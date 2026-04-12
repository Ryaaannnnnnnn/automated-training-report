"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { AfterTrainingReportView, ReportData } from "./AfterTrainingReportView";
import ReactDOM from "react-dom";

interface Props {
  training: {
    id: string;
    title: string;
    date: Date | string;
    venue: string;
    startTime?: string | null;
    endTime?: string | null;
  };
  className?: string;
  showText?: boolean;
}

export function DownloadReportButton({ training, className, showText = false }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleDownloadClick = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const res = await fetch(`/api/trainings/${training.id}`);
      const result = await res.json();
      
      if (result.ok && result.training.reportData) {
        const data = JSON.parse(result.training.reportData);
        setReportData(data);
        
        // We need to wait for the component to render in the hidden div 
        // before triggering the download. 
        // However, instead of rendering hidden, we can just use the logic directly here
        // or use a temporary container.
        
        // To keep it simple and reuse the fancy PDF logic, let's trigger it 
        // after a short delay to allow the state update to settle if we were rendering.
        // But better: let's move the heavy lifting to a utility if possible.
        
        // Actually, the easiest way to reuse the EXACT same layout is to render it.
      } else {
        alert("This training does not have a detailed report available for download.");
        setDownloading(false);
      }
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download report. Please try again.");
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownloadClick}
        disabled={downloading}
        className={className || "rounded-2xl bg-white border border-slate-100 p-2.5 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all shadow-sm group/btn"}
        title={downloading ? "Generating PDF..." : "Download PDF Report"}
      >
        <div className="flex items-center gap-2">
          {downloading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FileDown className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          )}
          {showText && (
            <span className="font-black uppercase tracking-widest text-[10px]">
              {downloading ? "Generating..." : "Download PDF"}
            </span>
          )}
        </div>
      </button>

      {/* Hidden render for PDF generation */}
      {reportData && (
        <div style={{ position: "fixed", left: "-9999px", top: 0, width: "794px" }}>
           <ReportDownloader 
            data={reportData} 
            training={training} 
            onComplete={() => {
              setReportData(null);
              setDownloading(false);
            }} 
          />
        </div>
      )}
    </>
  );
}

// Internal component to handle the auto-download once rendered
function ReportDownloader({ data, training, onComplete }: { 
  data: ReportData, 
  training: any, 
  onComplete: () => void 
}) {
  const hasTriggered = typeof window !== "undefined" ? (window as any)._triggered === training.id : false;

  // We use a simple effect to trigger the download once the component is mounted
  useState(() => {
    const run = async () => {
      // Small delay to ensure images/fonts are ready for html2canvas
      await new Promise(r => setTimeout(r, 1000));
      
      try {
        const { default: jsPDF } = await import("jspdf");
        const { default: html2canvas } = await import("html2canvas");
        
        const element = document.getElementById(`pdf-download-root-${training.id}`);
        if (!element) return;

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        const usableWidth = pageWidth - margin * 2;

        const sections = element.querySelectorAll("[data-pdf-section]");
        let firstPage = true;

        for (const section of Array.from(sections)) {
          const canvas = await html2canvas(section as HTMLElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          });
          const imgData = canvas.toDataURL("image/png");
          const imgHeight = (canvas.height * usableWidth) / canvas.width;

          if (!firstPage) pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
          firstPage = false;
        }

        const safeName = (training.title || "training-report").replace(/[^a-z0-9]/gi, "-").toLowerCase();
        pdf.save(`after-training-report-${safeName}.pdf`);
      } catch (err) {
        console.error(err);
      } finally {
        onComplete();
      }
    };
    run();
  });

  return (
    <div id={`pdf-download-root-${training.id}`}>
      <AfterTrainingReportView 
        data={data}
        coreTitle={training.title}
        coreDate={new Date(training.date).toISOString().split('T')[0]}
        coreStartTime={training.startTime || "09:00 AM"}
        coreEndTime={training.endTime || "05:00 PM"}
        coreVenue={training.venue}
        isDownloadMode={true}
      />
    </div>
  );
}
