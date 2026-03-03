"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { FileText, Table as TableIcon, Download } from "lucide-react";

// Extend jsPDF with autotable types
declare module "jspdf" {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

interface Participant {
    id: string;
    name: string;
    email: string;
    organization: string;
}

interface Attendance {
    id: string;
    participant: Participant;
    status: string;
}

interface Evaluation {
    id: string;
    participant: Participant;
    rating: number;
    comments: string | null;
}

interface Training {
    id: string;
    title: string;
    date: string;
    venue: string;
    trainer: string;
    description: string;
    attendances: Attendance[];
    evaluations: Evaluation[];
}

export function ReportButtons({ trainingId }: { trainingId: string }) {
    const [loading, setLoading] = useState(false);

    const fetchReportData = async (): Promise<Training | null> => {
        setLoading(true);
        try {
            const res = await fetch(`/api/trainings/${trainingId}/report`);
            const data = await res.json();
            if (data.ok) return data.training;
            return null;
        } catch (error) {
            console.error("Failed to fetch report data", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async () => {
        const training = await fetchReportData();
        if (!training) return;

        const doc = new jsPDF();
        const dateStr = new Date(training.date).toLocaleDateString();

        // Header
        doc.setFontSize(20);
        doc.text("Training Report Summary", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // Training Details
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Training Information", 14, 45);

        doc.setFontSize(11);
        const details = [
            ["Title:", training.title],
            ["Date:", dateStr],
            ["Venue:", training.venue],
            ["Trainer:", training.trainer],
            ["Description:", training.description]
        ];

        doc.autoTable({
            startY: 50,
            body: details,
            theme: 'plain',
            styles: { cellPadding: 1, fontSize: 11 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 30 } }
        });

        // Attendance Table
        const currentY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Attendance Record", 14, currentY);

        doc.autoTable({
            startY: currentY + 5,
            head: [['Participant Name', 'Organization', 'Email', 'Status']],
            body: training.attendances.map(a => [
                a.participant.name,
                a.participant.organization,
                a.participant.email,
                a.status
            ]),
            headStyles: { fillColor: [59, 130, 246] }, // blue-500
        });

        // Evaluations Table (if any)
        if (training.evaluations.length > 0) {
            const evalY = (doc as any).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.text("Evaluation Summary", 14, evalY);

            doc.autoTable({
                startY: evalY + 5,
                head: [['Participant Name', 'Rating', 'Comments']],
                body: training.evaluations.map(e => [
                    e.participant.name,
                    `${e.rating} / 5`,
                    e.comments || 'No comments'
                ]),
                headStyles: { fillColor: [79, 70, 229] }, // indigo-600
            });
        }

        doc.save(`Training_Report_${training.title.replace(/\s+/g, '_')}.pdf`);
    };

    const exportToExcel = async () => {
        const training = await fetchReportData();
        if (!training) return;

        // Prepare Attendance Data
        const attendanceData = training.attendances.map(a => ({
            "Participant Name": a.participant.name,
            "Organization": a.participant.organization,
            "Email": a.participant.email,
            "Status": a.status,
            "Training": training.title,
            "Date": new Date(training.date).toLocaleDateString()
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(attendanceData);
        XLSX.utils.book_append_sheet(wb, ws, "Attendance");

        // Prepare Evaluation Data if exists
        if (training.evaluations.length > 0) {
            const evalData = training.evaluations.map(e => ({
                "Participant Name": e.participant.name,
                "Rating": e.rating,
                "Comments": e.comments || ""
            }));
            const wsEval = XLSX.utils.json_to_sheet(evalData);
            XLSX.utils.book_append_sheet(wb, wsEval, "Evaluations");
        }

        XLSX.writeFile(wb, `Training_List_${training.title.replace(/\s+/g, '_')}.xlsx`);
    };

    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={exportToPDF}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 shadow-sm transition-colors disabled:opacity-50"
            >
                <FileText className="w-4 h-4" />
                {loading ? "Generating..." : "Export to PDF"}
            </button>

            <button
                onClick={exportToExcel}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 shadow-sm transition-colors disabled:opacity-50"
            >
                <TableIcon className="w-4 h-4" />
                {loading ? "Generating..." : "Export to Excel"}
            </button>
        </div>
    );
}
