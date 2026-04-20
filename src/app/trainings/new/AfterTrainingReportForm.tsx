"use client";

import { useRef, useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
import { AfterTrainingReportView, ReportData, SectorRow } from "@/components/AfterTrainingReportView";

// Removed local interface definitions as they are now imported

interface Props {
  coreTitle: string;
  setCoreTitle: (v: string) => void;
  coreDate: string;
  setCoreDate: (v: string) => void;
  coreVenue: string;
  setCoreVenue: (v: string) => void;
  coreStartTime: string;
  setCoreStartTime: (v: string) => void;
  coreEndTime: string;
  setCoreEndTime: (v: string) => void;
  coreTrainer: string;
  setCoreTrainer: (v: string) => void;
  coreDescription: string;
  setCoreDescription: (v: string) => void;
  onSubmit: (reportData: ReportData) => void;
  onBack: () => void;
  saving: boolean;
  initialReportData?: ReportData; // Added for editing support
}

// Preset quick-pick times
const TIME_PRESETS_START = [
  { label: "8:00 AM", value: "08:00 AM" },
  { label: "9:00 AM", value: "09:00 AM" },
  { label: "10:00 AM", value: "10:00 AM" },
  { label: "1:00 PM", value: "01:00 PM" },
  { label: "2:00 PM", value: "02:00 PM" },
];

const TIME_PRESETS_END = [
  { label: "12:00 PM", value: "12:00 PM" },
  { label: "3:00 PM", value: "03:00 PM" },
  { label: "4:00 PM", value: "04:00 PM" },
  { label: "5:00 PM", value: "05:00 PM" },
  { label: "6:00 PM", value: "06:00 PM" },
];

// Convert "09:00 AM" → "09:00" (for input[type="time"])
function toInputTime(ampm: string): string {
  if (!ampm) return "09:00";
  const match = ampm.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "09:00";
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

// Convert "09:00" (input[type="time"]) → "09:00 AM"
function toAmPm(inputVal: string): string {
  if (!inputVal) return "09:00 AM";
  const [h, m] = inputVal.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function BulletListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const addRow = () => onChange([...items, ""]);
  const updateRow = (i: number, val: string) => {
    const updated = [...items];
    updated[i] = val;
    onChange(updated);
  };
  const removeRow = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-bold text-gray-900 dark:text-slate-200 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-gray-400 font-bold text-lg leading-none mt-0.5">•</span>
            <input
              className="flex-1 rounded-xl border-2 border-gray-100 dark:border-slate-800 bg-gray-50/20 dark:bg-slate-900/50 px-4 py-3 text-sm font-medium dark:text-white outline-none transition-all focus:border-blue-500/40 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-slate-800"
              value={item}
              placeholder={placeholder ?? "Enter item..."}
              onChange={(e) => updateRow(i, e.target.value)}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                title="Remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 ml-5 mt-1"
      >
        + Add item
      </button>
    </div>
  );
}

function SectorInputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SectorRow;
  onChange: (v: SectorRow) => void;
}) {
  const sum = (m: string, f: string) => {
    const numM = parseInt(m) || 0;
    const numF = parseInt(f) || 0;
    return (numM + numF).toString();
  };

  const handleMaleChange = (val: string) => {
    onChange({ ...value, male: val, total: sum(val, value.female) });
  };

  const handleFemaleChange = (val: string) => {
    onChange({ ...value, female: val, total: sum(value.male, val) });
  };

  const inp =
    "w-full rounded-lg border-2 border-gray-100 dark:border-slate-800 bg-gray-50/20 dark:bg-slate-900/50 px-2 py-2 text-sm font-medium dark:text-white outline-none transition-all focus:border-blue-500/40 dark:focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-slate-800 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-2 items-center p-3 sm:p-2 border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50/30 dark:hover:bg-slate-800/20 transition-colors">
      <div className="sm:col-span-3 font-black text-[11px] text-gray-900 dark:text-slate-200 uppercase tracking-widest">{label}:</div>
      
      {/* Total Column */}
      <div className="sm:col-span-3">
        <div className="flex items-center gap-2">
          <span className="sm:hidden text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase w-10">Total:</span>
          <input 
            className={inp + " bg-gray-100/50 dark:bg-slate-800/70 font-bold text-blue-600 dark:text-blue-400"} 
            placeholder="Total" 
            value={value.total} 
            readOnly 
            tabIndex={-1} 
          />
        </div>
      </div>

      {/* Male Column */}
      <div className="sm:col-span-3">
        <div className="flex items-center gap-2">
          <span className="sm:hidden text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase w-10 text-right">Male:</span>
          <input 
            type="number"
            className={inp} 
            placeholder="M" 
            value={value.male} 
            onChange={(e) => handleMaleChange(e.target.value)} 
          />
        </div>
      </div>

      {/* Female Column */}
      <div className="sm:col-span-3">
        <div className="flex items-center gap-2">
          <span className="sm:hidden text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase w-10 text-right">Female:</span>
          <input 
            type="number"
            className={inp} 
            placeholder="F" 
            value={value.female} 
            onChange={(e) => handleFemaleChange(e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
}

const inp =
  "w-full rounded-2xl border-2 border-gray-100 dark:border-slate-800 bg-gray-50/20 dark:bg-slate-900/50 px-5 py-3.5 text-sm font-medium dark:text-white outline-none transition-all focus:border-blue-500/40 dark:focus:border-blue-500/50 focus:ring-8 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-900 dark:text-slate-200 uppercase tracking-[0.2em] ml-1">{label}</label>
      {children}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function AfterTrainingReportForm({
  coreTitle,
  setCoreTitle,
  coreDate,
  setCoreDate,
  coreVenue,
  setCoreVenue,
  coreStartTime,
  setCoreStartTime,
  coreEndTime,
  setCoreEndTime,
  coreTrainer,
  setCoreTrainer,
  coreDescription,
  setCoreDescription,
  onSubmit,
  onBack,
  saving,
  initialReportData,
}: Props) {
  const [step, setStep] = useState(0);
  const pdfRef = useRef<HTMLDivElement>(null);

  // ── Step 1 state ────────────────────
  const [courseCode, setCourseCode] = useState("");
  const [duration, setDuration] = useState("");
  const [ilcdbFocal, setIlcdbFocal] = useState("");
  const [trainingSupport, setTrainingSupport] = useState("N/A");
  const [technicalSupport, setTechnicalSupport] = useState("N/A");
  const [resourcePerson, setResourcePerson] = useState("");
  const [platformUsed, setPlatformUsed] = useState("");
  const [mode, setMode] = useState("Online");
  const [targetParticipants, setTargetParticipants] = useState("");
  const [attendeesTotal, setAttendeesTotal] = useState("");
  const [attendeesMale, setAttendeesMale] = useState("");
  const [attendeesFemale, setAttendeesFemale] = useState("");
  const [nga, setNga] = useState<SectorRow>({ total: "", male: "", female: "" });
  const [lgu, setLgu] = useState<SectorRow>({ total: "", male: "", female: "" });
  const [suc, setSuc] = useState<SectorRow>({ total: "", male: "", female: "" });
  const [others, setOthers] = useState<SectorRow>({ total: "", male: "", female: "" });
  const [certsTotal, setCertsTotal] = useState("");
  const [certsMale, setCertsMale] = useState("");
  const [certsFemale, setCertsFemale] = useState("");

  const autoSum = (m: string, f: string) => {
    const numM = parseInt(m) || 0;
    const numF = parseInt(f) || 0;
    return (numM + numF).toString();
  };

  // ── Auto-summing Issued Certificates from Sector Summary ─────────────
  useEffect(() => {
    const mTotal = (parseInt(nga.male) || 0) + 
                  (parseInt(lgu.male) || 0) + 
                  (parseInt(suc.male) || 0) + 
                  (parseInt(others.male) || 0);

    const fTotal = (parseInt(nga.female) || 0) + 
                  (parseInt(lgu.female) || 0) + 
                  (parseInt(suc.female) || 0) + 
                  (parseInt(others.female) || 0);

    setCertsMale(mTotal.toString());
    setCertsFemale(fTotal.toString());
    setCertsTotal((mTotal + fTotal).toString());
  }, [nga, lgu, suc, others]);

  // ── Step 2 state ────────────────────
  const [rationale, setRationale] = useState(coreDescription);
  const [objectives, setObjectives] = useState<string[]>([""]);

  // ── Step 3 state ────────────────────
  const [topicsCovered, setTopicsCovered] = useState("");
  const [issuesConcerns, setIssuesConcerns] = useState<string[]>([""]);
  const [recommendations, setRecommendations] = useState<string[]>([""]);
  const [plansNextSteps, setPlansNextSteps] = useState<string[]>([""]);

  // ── Step 4 state ────────────────────
  const [photos, setPhotos] = useState<{ label: string; photo: string | null; dayNumber?: string }[]>([
    { label: "", photo: null, dayNumber: "" },
  ]);
  const [preparedByName, setPreparedByName] = useState("HADASA A. MANALILI");
  const [preparedByPosition, setPreparedByPosition] = useState("PDO I");
  const [approvedByName, setApprovedByName] = useState("MARVIN L. MANUEL");
  const [approvedByPosition, setApprovedByPosition] = useState("Provincial Officer");

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // ── Initialization Logic for Editing ────────────────
  useState(() => {
    if (initialReportData) {
      setCourseCode(initialReportData.courseCode || "");
      setDuration(initialReportData.duration || "");
      setIlcdbFocal(initialReportData.ilcdbFocal || "");
      setTrainingSupport(initialReportData.trainingSupport || "N/A");
      setTechnicalSupport(initialReportData.technicalSupport || "N/A");
      setResourcePerson(initialReportData.resourcePerson || "");
      setPlatformUsed(initialReportData.platformUsed || "");
      setMode(initialReportData.mode || "Online");
      setTargetParticipants(initialReportData.targetParticipants || "");
      setAttendeesTotal(initialReportData.attendeesTotal || "");
      setAttendeesMale(initialReportData.attendeesMale || "");
      setAttendeesFemale(initialReportData.attendeesFemale || "");
      if (initialReportData.nga) setNga(initialReportData.nga);
      if (initialReportData.lgu) setLgu(initialReportData.lgu);
      if (initialReportData.suc) setSuc(initialReportData.suc);
      if (initialReportData.others) setOthers(initialReportData.others);
      setCertsTotal(initialReportData.certsTotal || "");
      setCertsMale(initialReportData.certsMale || "");
      setCertsFemale(initialReportData.certsFemale || "");
      setRationale(initialReportData.rationale || coreDescription);
      setObjectives(initialReportData.objectives?.length ? initialReportData.objectives : [""]);
      setTopicsCovered(initialReportData.topicsCovered || "");
      setIssuesConcerns(initialReportData.issuesConcerns?.length ? initialReportData.issuesConcerns : [""]);
      setRecommendations(initialReportData.recommendations?.length ? initialReportData.recommendations : [""]);
      setPlansNextSteps(initialReportData.plansNextSteps?.length ? initialReportData.plansNextSteps : [""]);
      
      // Handle legacy photos conversion
      if (initialReportData.photos) {
        setPhotos(initialReportData.photos);
      } else {
        const legacy: { label: string; photo: string | null }[] = [];
        if (initialReportData.day1Photo) legacy.push({ label: initialReportData.day1Label || "", photo: initialReportData.day1Photo });
        if (initialReportData.day2Photo) legacy.push({ label: initialReportData.day2Label || "", photo: initialReportData.day2Photo });
        if (legacy.length) setPhotos(legacy);
      }

      setPreparedByName(initialReportData.preparedByName || "HADASA A. MANALILI");
      setPreparedByPosition(initialReportData.preparedByPosition || "PDO I");
      setApprovedByName(initialReportData.approvedByName || "MARVIN L. MANUEL");
      setApprovedByPosition(initialReportData.approvedByPosition || "Provincial Officer");
    }
  });

  // ── Photo handlers ──────────────────
  function handlePhotoUpdate(index: number, label: string, photo: string | null, dayNumber?: string) {
    const updated = [...photos];
    updated[index] = { ...updated[index], label, photo };
    if (dayNumber !== undefined) updated[index].dayNumber = dayNumber;
    setPhotos(updated);
  }

  function addPhotoRow() {
    setPhotos([...photos, { label: "", photo: null, dayNumber: "" }]);
  }

  function removePhotoRow(index: number) {
    if (photos.length > 1) {
      setPhotos(photos.filter((_, i) => i !== index));
    } else {
      setPhotos([{ label: "", photo: null }]);
    }
  }

  // ── PDF Export ───────────────────────
  async function handleDownloadPdf() {
    setDownloadingPdf(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      if (!pdfRef.current) return;

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;

      const sections = pdfRef.current.querySelectorAll("[data-pdf-section]");
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

      const safeName = (coreTitle || "training-report").replace(/[^a-z0-9]/gi, "-").toLowerCase();
      pdf.save(`after-training-report-${safeName}.pdf`);
    } finally {
      setDownloadingPdf(false);
    }
  }

  // ── Submit ───────────────────────────
  function handleSubmit() {
    const data: ReportData = {
      courseCode, duration, ilcdbFocal, trainingSupport, technicalSupport,
      resourcePerson, platformUsed, mode, targetParticipants,
      attendeesTotal, attendeesMale, attendeesFemale,
      nga, lgu, suc, others, certsTotal, certsMale, certsFemale,
      rationale, objectives,
      topicsCovered, issuesConcerns, recommendations, plansNextSteps,
      // For compatibility with any old code:
      day1Label: photos[0]?.label || "",
      day1Photo: photos[0]?.photo || null,
      day2Label: photos[1]?.label || "",
      day2Photo: photos[1]?.photo || null,
      photos,
      preparedByName, preparedByPosition, approvedByName, approvedByPosition,
    };
    onSubmit(data);
  }

  // ── Steps ────────────────────────────

  const STEPS = ["Training Details", "Rationale & Objectives", "Topics, Issues & Plans", "Photo & Signatories"];

  const formatDate = (d: string) => {
    if (!d) return "";
    try { return new Date(d + "T00:00:00").toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }); }
    catch { return d; }
  };

  const getDayNumber = (photoDate: string) => {
    if (!coreDate || !photoDate) return null;
    const start = new Date(coreDate + "T00:00:00");
    const current = new Date(photoDate + "T00:00:00");
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  // ── Render ───────────────────────────

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-center gap-3 justify-between">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] font-bold text-center leading-tight hidden sm:block ${i === step ? "text-blue-600" : i < step ? "text-green-600" : "text-gray-400"}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className="absolute hidden sm:block" style={{ display: "none" }} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium mt-2 text-right">Step {step + 1} of {STEPS.length}: <span className="text-gray-600 dark:text-slate-300">{STEPS[step]}</span></p>
      </div>

      {/* PDF Preview (hidden visually but used for PDF generation) */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, width: "794px" }}>
        <div ref={pdfRef}>
          <AfterTrainingReportView 
            data={{
              courseCode, duration, ilcdbFocal, trainingSupport, technicalSupport,
              resourcePerson, platformUsed, mode, targetParticipants,
              attendeesTotal, attendeesMale, attendeesFemale,
              nga, lgu, suc, others, certsTotal, certsMale, certsFemale,
              rationale, objectives,
              topicsCovered, issuesConcerns, recommendations, plansNextSteps,
              photos,
              preparedByName, preparedByPosition, approvedByName, approvedByPosition,
            }}
            coreTitle={coreTitle}
            coreDate={coreDate}
            coreStartTime={coreStartTime}
            coreEndTime={coreEndTime}
            coreVenue={coreVenue}
            isDownloadMode={true}
          />
        </div>
      </div>


      {/* ────────────────────────────────────────────────── */}
      {/* STEP 1: Training Details */}
      {/* ────────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Header image */}
          <div className="w-full">
            <img
              src="/header.png"
              alt="DICT Header"
              className="w-full object-contain block"
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">I. Training Details</h3>
              <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium mt-1">Core information about the training event.</p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Course Title (Row 1) */}
            <div className="sm:col-span-2 space-y-2.5">
              <label className="text-[10px] font-bold text-gray-900 dark:text-slate-300 uppercase tracking-[0.2em] ml-1 text-blue-600 dark:text-blue-400">Course Title</label>
              <input
                className="w-full rounded-2xl border-2 border-blue-50 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 px-5 py-4 text-base font-bold dark:text-white outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-slate-800"
                placeholder="e.g. BASIC GRAPHIC DESIGN USING CANVA"
                value={coreTitle}
                onChange={(e) => setCoreTitle(e.target.value)}
                required
              />
            </div>

            {/* Course Code (Row 2) */}
            <div className="sm:col-span-2">
              <Field label="Course Code">
                <input className={inp} placeholder="e.g. 2026_ILCDB_004" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
              </Field>
            </div>

            {/* Date and Time (Row 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:col-span-2">
              <Field label="Date">
                <input
                  className={inp}
                  type="date"
                  value={coreDate}
                  onChange={(e) => setCoreDate(e.target.value)}
                  required
                />
              </Field>
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-gray-900 dark:text-slate-300 uppercase tracking-[0.2em] ml-1 text-blue-600 dark:text-blue-400">Training Time</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <input
                      className={inp + " text-center"}
                      type="time"
                      value={toInputTime(coreStartTime)}
                      onChange={(e) => setCoreStartTime(toAmPm(e.target.value))}
                      required
                    />
                  </div>
                  <span className="text-gray-400 dark:text-slate-500 font-bold">to</span>
                  <div className="flex-1 space-y-1">
                    <input
                      className={inp + " text-center"}
                      type="time"
                      value={toInputTime(coreEndTime)}
                      onChange={(e) => setCoreEndTime(toAmPm(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Duration (Row 4) */}
            <div className="sm:col-span-2">
              <Field label="Duration">
                <input className={inp} placeholder="e.g. 16 HOURS" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </Field>
            </div>

            {/* Venue (Row 5) */}
            <div className="sm:col-span-2">
              <Field label="Venue">
                <input
                  className={inp}
                  placeholder="e.g. Conference Hall A"
                  value={coreVenue}
                  onChange={(e) => setCoreVenue(e.target.value)}
                  required
                />
              </Field>
            </div>

            {/* Signatories / Focal (Rows 6-9) */}
            <Field label="ILCDB Focal">
              <input className={inp} placeholder="Full name" value={ilcdbFocal} onChange={(e) => setIlcdbFocal(e.target.value)} />
            </Field>

            <Field label="Training Support">
              <input className={inp} placeholder="e.g. N/A" value={trainingSupport} onChange={(e) => setTrainingSupport(e.target.value)} />
            </Field>

            <Field label="Technical Support">
              <input className={inp} placeholder="e.g. N/A" value={technicalSupport} onChange={(e) => setTechnicalSupport(e.target.value)} />
            </Field>

            <Field label="Resource Person">
              <input
                className={inp}
                placeholder="Full name"
                value={resourcePerson || coreTrainer}
                onChange={(e) => setResourcePerson(e.target.value)}
              />
            </Field>

            {/* Platform and Mode (Row 10) */}
            <Field label="Platform Used">
              <input className={inp} placeholder="e.g. MS Teams, Zoom" value={platformUsed} onChange={(e) => setPlatformUsed(e.target.value)} />
            </Field>

            <Field label="Mode">
              <select className={inp} value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Online</option>
                <option>Face-to-Face</option>
                <option>Hybrid</option>
              </select>
            </Field>

            {/* Target Participants (Row 11) */}
            <div className="sm:col-span-2">
              <Field label="Target Participants">
                <input className={inp} placeholder="e.g. Teacher Applicants" value={targetParticipants} onChange={(e) => setTargetParticipants(e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Attendees */}
          <div>
            <p className="text-[10px] font-bold text-gray-900 dark:text-slate-200 uppercase tracking-[0.2em] ml-1 mb-3">Total # of Attendees <span className="text-gray-400 dark:text-slate-500 normal-case tracking-normal font-medium">(with/without submitted Evaluation Form/Output)</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Total"><input className={inp + " text-center bg-gray-100/50 dark:bg-slate-800/50 font-bold text-blue-600 dark:text-blue-400"} placeholder="0" value={attendeesTotal} readOnly tabIndex={-1} /></Field>
              <Field label="Male"><input type="number" className={inp + " text-center"} placeholder="0" value={attendeesMale} onChange={(e) => { setAttendeesMale(e.target.value); setAttendeesTotal(autoSum(e.target.value, attendeesFemale)); }} /></Field>
              <Field label="Female"><input type="number" className={inp + " text-center"} placeholder="0" value={attendeesFemale} onChange={(e) => { setAttendeesFemale(e.target.value); setAttendeesTotal(autoSum(attendeesMale, e.target.value)); }} /></Field>
            </div>
          </div>

          {/* Sector Category */}
          <div>
            <p className="text-[10px] font-bold text-gray-900 dark:text-slate-200 uppercase tracking-[0.2em] ml-1 mb-3">Sector Category <span className="text-gray-400 dark:text-slate-500 normal-case tracking-normal font-medium">— Number of Beneficiary/ies with Sex Disaggregation</span></p>
            <div className="rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden bg-gray-50/10 dark:bg-slate-900/40 shadow-inner">
              {/* Header - Desktop Only */}
              <div className="hidden sm:grid grid-cols-12 gap-2 bg-gray-50 dark:bg-slate-800/80 px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                <div className="col-span-3 text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">Sector</div>
                <div className="col-span-3 text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest text-center">Total</div>
                <div className="col-span-3 text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest text-center">Male</div>
                <div className="col-span-3 text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest text-center">Female</div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                <SectorInputRow label="NGA" value={nga} onChange={setNga} />
                <SectorInputRow label="LGU" value={lgu} onChange={setLgu} />
                <SectorInputRow label="SUC" value={suc} onChange={setSuc} />
                <SectorInputRow label="Others" value={others} onChange={setOthers} />
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div>
            <p className="text-[10px] font-bold text-gray-900 dark:text-slate-200 uppercase tracking-[0.2em] ml-1 mb-3">Total # of Issued Certificates <span className="text-gray-400 dark:text-slate-500 normal-case tracking-normal font-medium">(with submitted Evaluation Form/Output)</span></p>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Total"><input className={inp + " text-center bg-gray-100/50 dark:bg-slate-800/50 font-bold text-blue-600 dark:text-blue-400"} placeholder="0" value={certsTotal} readOnly tabIndex={-1} /></Field>
              <Field label="Male"><input className={inp + " text-center bg-gray-100/50 dark:bg-slate-800/50 font-bold text-blue-600 dark:text-blue-400"} placeholder="0" value={certsMale} readOnly tabIndex={-1} /></Field>
              <Field label="Female"><input className={inp + " text-center bg-gray-100/50 dark:bg-slate-800/50 font-bold text-blue-600 dark:text-blue-400"} placeholder="0" value={certsFemale} readOnly tabIndex={-1} /></Field>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* ────────────────────────────────────────────────── */}
      {/* STEP 2: Rationale & Objectives */}
      {/* ────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">II. Rationale &amp; III. Objectives</h3>
            <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium mt-1">Explain the purpose of the training and what participants will achieve.</p>
          </div>

          <Field label="II. Rationale">
            <textarea
              className="min-h-[180px] w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white resize-y"
              placeholder="Describe the background and purpose of this training..."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
          </Field>

          <BulletListEditor
            label="III. Objectives — At the end of this course, participants will be able to:"
            items={objectives}
            onChange={setObjectives}
            placeholder="e.g. Apply the key features of Canva to create digital design outputs"
          />
        </div>
      )}

      {/* ────────────────────────────────────────────────── */}
      {/* STEP 3: Topics, Issues, Recommendations, Plans */}
      {/* ────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">IV–VII. Topics, Issues, Recommendations &amp; Plans</h3>
            <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium mt-1">Document what was covered, concerns raised, and next steps.</p>
          </div>

          <Field label="IV. Topics Covered">
            <textarea
              className="min-h-[160px] w-full rounded-2xl border-2 border-gray-100 bg-gray-50/20 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-blue-500/40 focus:ring-8 focus:ring-blue-500/5 focus:bg-white resize-y"
              placeholder="Describe the topics and activities covered during the training..."
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BulletListEditor
              label="V. Issues and Concerns"
              items={issuesConcerns}
              onChange={setIssuesConcerns}
              placeholder="e.g. Internet connectivity issues..."
            />
            <BulletListEditor
              label="VI. Recommendations"
              items={recommendations}
              onChange={setRecommendations}
              placeholder="e.g. Additional hands-on activities..."
            />
          </div>

          <BulletListEditor
            label="VII. Plans and Action Items (Next Steps)"
            items={plansNextSteps}
            onChange={setPlansNextSteps}
            placeholder="e.g. Future training iterations may include..."
          />
        </div>
      )}

      {/* ────────────────────────────────────────────────── */}
      {/* STEP 4: Photo Documentation & Signatories */}
      {/* ────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">VIII. Photo Documentation &amp; Signatories</h3>
            <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium mt-1">Upload training photos and provide signatory information.</p>
          </div>

          {/* Dynamic Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {photos.map((p, i) => {
              const dayNum = getDayNumber(p.label);
              return (
                <div key={i} className="relative group space-y-3 p-4 rounded-3xl border-2 border-gray-100 dark:border-slate-800 bg-gray-50/10 dark:bg-slate-800/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] ml-1">
                        {p.dayNumber ? `DAY ${p.dayNumber} — ` : (dayNum ? `DAY ${dayNum} — ` : "")}PHOTO {i+1}
                     </label>
                     {photos.length > 1 && (
                       <button type="button" onClick={() => removePhotoRow(i)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase transition-colors">✕ Remove</button>
                     )}
                  </div>
                
                  <div className="grid grid-cols-3 gap-3 items-end">
                    <div className="col-span-2 space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-[0.15em] ml-1">Photo Date</span>
                      <input 
                        className={inp} 
                        type="date" 
                        value={p.label} 
                        onChange={(e) => handlePhotoUpdate(i, e.target.value, p.photo)} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em] ml-1">Day No.</span>
                      <input 
                        className={inp + " text-center font-bold text-blue-700 dark:text-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto"} 
                        type="number"
                        min="1"
                        placeholder="1"
                        title="Set the training day number for this photo (e.g. 1, 2, 3…)"
                        value={p.dayNumber || ""}
                        onChange={(e) => handlePhotoUpdate(i, p.label, p.photo, e.target.value)}
                      />
                      <p className="text-[9px] text-gray-400 ml-1">e.g. Day 1, Day 2…</p>
                    </div>
                  </div>

                  <div>
                    <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-10 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-900/20 transition-all">
                      {p.photo ? (
                        <img src={p.photo} alt={`Photo ${i+1}`} className="max-h-40 object-contain rounded-lg" />
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Click to upload photo {i+1}</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                               handlePhotoUpdate(i, p.label, reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addPhotoRow}
            className="w-full rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 py-4 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-700 transition-all group flex items-center justify-center gap-2"
          >
            <span className="text-lg group-hover:scale-125 transition-transform">+</span>
            ADD ANOTHER PHOTO
          </button>

          {/* Signatories */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
            <p className="text-[10px] font-bold text-gray-900 dark:text-slate-200 uppercase tracking-[0.2em] ml-1 mb-4">Signatories</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Prepared By — Name"><input className={inp} placeholder="Full name" value={preparedByName} onChange={(e) => setPreparedByName(e.target.value)} /></Field>
              <Field label="Approved By — Name"><input className={inp} placeholder="Full name" value={approvedByName} onChange={(e) => setApprovedByName(e.target.value)} /></Field>
              <Field label="Prepared By — Position/Title"><input className={inp} placeholder="e.g. PDO I" value={preparedByPosition} onChange={(e) => setPreparedByPosition(e.target.value)} /></Field>
              <Field label="Approved By — Position/Title"><input className={inp} placeholder="e.g. Provincial Officer" value={approvedByPosition} onChange={(e) => setApprovedByPosition(e.target.value)} /></Field>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation Buttons ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={step === 0 ? onBack : () => setStep((s) => s - 1)}
          className="rounded-2xl border-2 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5 text-[12px] font-bold text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all flex items-center gap-2 uppercase tracking-wider"
        >
          ← {step === 0 ? "Back to Details" : "Previous"}
        </button>

        <div className="flex items-center gap-3">
          {step === 3 && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="rounded-2xl border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 px-6 py-3.5 text-[12px] font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center gap-2 uppercase tracking-wider disabled:opacity-60"
            >
              {downloadingPdf ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-2xl bg-blue-600 px-8 py-3.5 text-[12px] font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 uppercase tracking-wider"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-2xl bg-green-600 px-8 py-3.5 text-[12px] font-bold text-white hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 uppercase tracking-wider disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Submit Report
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
