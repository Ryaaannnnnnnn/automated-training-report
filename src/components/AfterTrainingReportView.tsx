"use client";

import { useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SectorRow {
  total: string;
  male: string;
  female: string;
}

export interface ReportData {
  courseCode: string;
  duration: string;
  ilcdbFocal: string;
  trainingSupport: string;
  technicalSupport: string;
  resourcePerson: string;
  platformUsed: string;
  mode: string;
  targetParticipants: string;
  attendeesTotal: string;
  attendeesMale: string;
  attendeesFemale: string;
  nga: SectorRow;
  lgu: SectorRow;
  suc: SectorRow;
  others: SectorRow;
  certsTotal: string;
  certsMale: string;
  certsFemale: string;
  rationale: string;
  objectives: string[];
  topicsCovered: string;
  issuesConcerns: string[];
  recommendations: string[];
  plansNextSteps: string[];
  // Legacy fields for backward compatibility
  day1Label?: string;
  day1Photo?: string | null;
  day2Label?: string;
  day2Photo?: string | null;
  photos?: { label: string; photo: string | null; dayNumber?: string }[];
  preparedByName: string;
  preparedByPosition: string;
  approvedByName: string;
  approvedByPosition: string;
}

interface Props {
  data: ReportData;
  coreTitle: string;
  coreDate: string;
  coreStartTime: string;
  coreEndTime: string;
  coreVenue: string;
  isDownloadMode?: boolean;
}

export function AfterTrainingReportView({ 
  data, 
  coreTitle, 
  coreDate, 
  coreStartTime, 
  coreEndTime, 
  coreVenue,
  isDownloadMode = false
}: Props) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const formatDate = (d: string) => {
    if (!d) return "";
    try { 
      return new Date(d + "T00:00:00").toLocaleDateString("en-PH", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      }); 
    } catch { 
      return d; 
    }
  };

  const getDayNumber = (photoDate: string) => {
    if (!coreDate || !photoDate) return null;
    const start = new Date(coreDate + "T00:00:00");
    const current = new Date(photoDate + "T00:00:00");
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const ReportFooter = ({ page }: { page: number }) => (
    <div style={{ 
      marginTop: "auto", 
      paddingTop: "8px", 
      borderTop: "2px solid #3b82f6", 
      display: "flex", 
      justifyContent: "space-between", 
      fontSize: "9px", 
      lineHeight: 1.4,
      color: isDownloadMode ? "#333" : "var(--report-text)"
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#2563eb", fontWeight: "bold" }}>DICT Aklan Provincial Field Office</div>
        <div>Mabini Street, Poblacion, Kalibo, Aklan</div>
        <div>Philippines</div>
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <div><span style={{ opacity: 0.8 }}>facebook.com/</span><span style={{ color: "#2563eb" }}>dictaklanprovince</span></div>
        <div>268 6273</div>
        <div style={{ marginTop: "2px", fontWeight: "bold", textTransform: "uppercase", fontSize: "8px" }}>
          AFTER TRAINING REPORT - {coreTitle} | Page {page} of 4
        </div>
      </div>
    </div>
  );

  // Expose download function if needed via a button or externally

  // Expose download function if needed via a button or externally
  // For now, we render the report inside a container.

  return (
    <div className="flex flex-col gap-6">

      {/* The Actual Report Content */}
      <div 
        ref={pdfRef} 
        className={isDownloadMode ? "" : "transition-colors duration-300"}
        style={{ 
          background: isDownloadMode ? "white" : "var(--report-bg, white)", 
          fontFamily: "Arial, sans-serif", 
          maxWidth: isDownloadMode ? "794px" : "100%",
          margin: "0 auto",
          boxShadow: isDownloadMode ? "none" : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          borderRadius: isDownloadMode ? "0" : "1rem",
          overflow: "hidden",
          color: isDownloadMode ? "#333" : "var(--report-text, #333)"
        }}
      >
        <style jsx>{`
          div {
            --report-bg: white;
            --report-text: #333;
            --report-border: #ccc;
            --report-header-bg: #f0f4ff;
            --report-title-color: #111;
          }
          :global(.dark) div {
            --report-bg: #1e293b;
            --report-text: #f1f5f9;
            --report-border: #334155;
            --report-header-bg: #1e3a8a;
            --report-title-color: #f8fafc;
          }
        `}</style>
        {/* Section 1 — Header + Training Details */}
        <div data-pdf-section style={{ padding: isDownloadMode ? "0 40px 10px 40px" : "12px 24px 16px 24px", background: isDownloadMode ? "white" : "transparent", display: "flex", flexDirection: "column", minHeight: isDownloadMode ? "1080px" : "100%", width: "100%" }}>
          <div style={{ marginBottom: "16px" }}>
            <img src="/header.png" alt="DICT Header" style={{ width: "100%", display: "block" }} />
          </div>

          <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "14px", marginBottom: "16px", letterSpacing: "0.05em", color: isDownloadMode ? "#111" : "var(--report-title-color)" }}>AFTER TRAINING REPORT</h2>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: isDownloadMode ? "#333" : "var(--report-text)" }}>
            <thead>
              <tr style={{ background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)" }}>
                <td colSpan={6} style={{ fontWeight: "bold", padding: "6px 8px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>I. TRAINING DETAILS</td>
              </tr>
            </thead>
            <tbody>
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td style={{ padding: "5px 8px", fontWeight: "600", width: "25%", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Course Title:</td>
                <td colSpan={5} style={{ padding: "5px 8px" }}>{coreTitle}</td>
              </tr>
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Course Code:</td>
                <td colSpan={5} style={{ padding: "5px 8px" }}>{data.courseCode}</td>
              </tr>
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Date:</td>
                <td style={{ padding: "5px 8px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{formatDate(coreDate)}</td>
                <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Time:</td>
                <td colSpan={3} style={{ padding: "5px 8px" }}>{coreStartTime} to {coreEndTime}</td>
              </tr>
              {[
                ["Duration:", data.duration],
                ["Venue:", coreVenue],
                ["ILCDB Focal:", data.ilcdbFocal],
                ["Training Support:", data.trainingSupport],
                ["Technical Support:", data.technicalSupport],
                ["Resource Person:", data.resourcePerson],
              ].map(([label, val], ri) => (
                <tr key={ri} style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                  <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{label as string}</td>
                  <td colSpan={5} style={{ padding: "5px 8px" }}>{val as string}</td>
                </tr>
              ))}
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Platform Used:</td>
                <td style={{ padding: "5px 8px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{data.platformUsed}</td>
                <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Mode:</td>
                <td colSpan={3} style={{ padding: "5px 8px" }}>{data.mode}</td>
              </tr>
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Target Participants:</td>
                <td colSpan={5} style={{ padding: "5px 8px" }}>{data.targetParticipants}</td>
              </tr>
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td style={{ padding: "5px 8px", fontWeight: "600", fontSize: "10px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Total # of Attendees:<br /><em>(with/without submitted Evaluation Form/Output)</em></td>
                <td style={{ padding: "5px 8px", textAlign: "center", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{data.attendeesTotal}</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Male</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{data.attendeesMale}</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Female</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{data.attendeesFemale}</td>
              </tr>
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td colSpan={6} style={{ padding: "5px 8px", textAlign: "center", fontSize: "10px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Number of Beneficiary/ies with Sex Disaggregation</td>
              </tr>
              {[
                ["NGA:", data.nga],
                ["LGU:", data.lgu],
                ["SUC:", data.suc],
                ["Others:", data.others],
              ].map(([label, row], ri) => (
                <tr key={ri} style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                  <td style={{ padding: "5px 8px", fontWeight: "600", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Sector Category: <strong>{label as string}</strong></td>
                  <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{(row as SectorRow).total}</td>
                  <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Male</td>
                  <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{(row as SectorRow).male}</td>
                  <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Female</td>
                  <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{(row as SectorRow).female}</td>
                </tr>
              ))}
              <tr style={{ border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                <td style={{ padding: "5px 8px", fontWeight: "600", fontSize: "10px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Total # of Issued Certificates:<br /><em>(with submitted Evaluation Form/Output)</em></td>
                <td style={{ padding: "5px 8px", textAlign: "center", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{data.certsTotal}</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Male</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{data.certsMale}</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>Female</td>
                <td style={{ padding: "5px 8px", textAlign: "center", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>{data.certsFemale}</td>
              </tr>
            </tbody>
          </table>
          <ReportFooter page={1} />
        </div>

        {/* Section 2 — Rationale, Objectives, Topics */}
        <div data-pdf-section style={{ padding: isDownloadMode ? "20px 40px 10px 40px" : "12px 24px 16px 24px", background: isDownloadMode ? "white" : "transparent", display: "flex", flexDirection: "column", minHeight: isDownloadMode ? "1080px" : "100%", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: isDownloadMode ? "#333" : "var(--report-text)" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)" }}>II. RATIONALE</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{data.rationale}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)" }}>III. OBJECTIVES</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                  <div>At the end of this course, successful participants will be able to:</div>
                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    {data.objectives.filter(Boolean).map((o, i) => <li key={i} style={{ marginBottom: "4px" }}>{o}</li>)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)" }}>IV. TOPICS COVERED:</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{data.topicsCovered}</td>
              </tr>
            </tbody>
          </table>
          <ReportFooter page={2} />
        </div>

        {/* Section 3 — Issues, Recommendations, Plans */}
        <div data-pdf-section style={{ padding: isDownloadMode ? "20px 40px 10px 40px" : "12px 24px 16px 24px", background: isDownloadMode ? "white" : "transparent", display: "flex", flexDirection: "column", minHeight: isDownloadMode ? "1080px" : "100%", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: isDownloadMode ? "#333" : "var(--report-text)" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)", width: "50%" }}>V. ISSUES AND CONCERNS</td>
                <td style={{ padding: "8px", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)" }}>VI. RECOMMENDATION</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", verticalAlign: "top" }}>
                  <ul style={{ paddingLeft: "18px" }}>
                    {data.issuesConcerns.filter(Boolean).map((item, i) => <li key={i} style={{ marginBottom: "4px" }}>{item}</li>)}
                  </ul>
                </td>
                <td style={{ padding: "10px 12px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", verticalAlign: "top" }}>
                  <ul style={{ paddingLeft: "18px" }}>
                    {data.recommendations.filter(Boolean).map((item, i) => <li key={i} style={{ marginBottom: "4px" }}>{item}</li>)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: "8px", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)" }}>VII. PLANS AND ACTION ITEMS (NEXT STEPS)</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: "10px 12px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                  <ul style={{ paddingLeft: "18px" }}>
                    {data.plansNextSteps.filter(Boolean).map((item, i) => <li key={i} style={{ marginBottom: "4px" }}>{item}</li>)}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <ReportFooter page={3} />
        </div>

        {/* Section 4 — Photo Documentation + Signatories */}
        <div data-pdf-section style={{ padding: isDownloadMode ? "20px 40px 10px 40px" : "12px 24px 16px 24px", background: isDownloadMode ? "white" : "transparent", display: "flex", flexDirection: "column", minHeight: isDownloadMode ? "1080px" : "100%", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: isDownloadMode ? "#333" : "var(--report-text)" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px", fontWeight: "bold", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)", background: isDownloadMode ? "#f0f4ff" : "var(--report-header-bg)" }}>VIII. PHOTO DOCUMENTATION</td>
              </tr>
              {data.photos?.map((p, i) => p.photo && (
                <tr key={i}>
                  <td style={{ padding: "10px 12px", border: isDownloadMode ? "1px solid #ccc" : "1px solid var(--report-border)" }}>
                    <div style={{ marginBottom: "6px", fontStyle: "italic", fontWeight: "bold" }}>
                       {p.dayNumber ? `DAY ${p.dayNumber} — ` : (getDayNumber(p.label) ? `DAY ${getDayNumber(p.label)} — ` : "")}
                       {formatDate(p.label) || `Photo ${i+1}`}
                    </div>
                    <img src={p.photo} alt={`Photo ${i+1}`} style={{ maxWidth: "100%", maxHeight: "260px", objectFit: "contain", borderRadius: "4px" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "space-between", fontSize: "11px", color: isDownloadMode ? "#333" : "var(--report-text)" }}>
            <div style={{ width: "45%" }}>
              <div>Prepared by:</div>
              <div style={{ marginTop: "24px", fontWeight: "bold", borderTop: isDownloadMode ? "1px solid #333" : "1px solid var(--report-border)", paddingTop: "4px" }}>{data.preparedByName}</div>
              <div style={{ opacity: 0.8 }}>{data.preparedByPosition}</div>
            </div>
            <div style={{ width: "45%" }}>
              <div>Approved by:</div>
              <div style={{ marginTop: "24px", fontWeight: "bold", borderTop: isDownloadMode ? "1px solid #333" : "1px solid var(--report-border)", paddingTop: "4px" }}>{data.approvedByName}</div>
              <div style={{ opacity: 0.8 }}>{data.approvedByPosition}</div>
            </div>
          </div>
          <ReportFooter page={4} />
        </div>
      </div>
    </div>
  );
}
