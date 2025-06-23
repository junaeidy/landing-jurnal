import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { usePage, Head } from "@inertiajs/react";
import Topbar from "@/Components/layouts/Topbar";
import Sidebar from "@/Components/layouts/Sidebar";
import html2pdf from "html2pdf.js";

const STATUS_ORDER = [
    "Sangat Tidak Setuju",
    "Tidak Setuju",
    "Netral",
    "Setuju",
    "Sangat Setuju",
];

const STATUS_COLORS = {
    "Sangat Tidak Setuju": "#ef4444",
    "Tidak Setuju": "#f97316",
    "Netral": "#eab308",
    "Setuju": "#60a5fa",
    "Sangat Setuju": "#10b981",
};

const getColor = (label) => STATUS_COLORS[label] || "#ccc";

export default function SurveyStats() {
    const { surveyId } = usePage().props;
    const [activeTab, setActiveTab] = useState("Dashboard Survey");
    const [stats, setStats] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/surveys/${surveyId}/stats`).then((res) => {
            setStats(res.data);
        });
    }, [surveyId]);

    const chartTypes = ["donut", "bar", "pie"];

    const renderChart = (question, index) => {
        const total = Object.values(question.summary || {}).reduce((a, b) => a + b, 0);
        const data = STATUS_ORDER.map((label) => ({
            name: label,
            value: question.summary?.[label] || 0,
            percent: total ? (((question.summary?.[label] || 0) / total) * 100).toFixed(1) : 0,
        }));

        const chartType = chartTypes[index % chartTypes.length];

        switch (chartType) {
            case "donut":
                return (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={40}
                                label={({ name, percent }) => `${name} (${percent}%)`}
                                dataKey="value"
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={getColor(entry.name)} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} jawaban`, name]} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case "bar":
                return (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value, name) => [`${value} jawaban`, name]} />
                            <Bar dataKey="value">
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={getColor(entry.name)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );

            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} (${percent}%)`}
                                dataKey="value"
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={getColor(entry.name)} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} jawaban`, name]} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    const handleExportPDF = async () => {
        setIsExporting(true);

        const element = document.getElementById("stats-content");
        if (!element) return;

        // Pastikan tidak ada scroll tersembunyi
        element.style.maxHeight = "none";
        element.style.overflow = "visible";

        const opt = {
            margin: 0.5,
            filename: `survey-statistik-${surveyId}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        await html2pdf().set(opt).from(element).save();
        setIsExporting(false);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Head title="Statistik Survei" />
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                {!stats ? (
                    <main className="flex-1 overflow-y-auto p-8 bg-gray-50 relative">
                        <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1b096c] border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>
                        </div>
                    </main>
                ) : (
                    <main className={`flex-1 p-8 bg-gray-50 ${isExporting ? "overflow-visible" : "overflow-y-auto"}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Statistik: {stats.title}</h1>
                            <button
                                disabled={isExporting}
                                onClick={handleExportPDF}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                {isExporting ? "Mengekspor..." : "Export PDF"}
                            </button>
                        </div>
                        <p className="mb-6 text-sm text-gray-600">Total Responden: {stats.responden_total}</p>
                        <div id="stats-content" className="space-y-10">
                            {stats.questions.map((q, index) => (
                                <div key={q.id} className="bg-white rounded shadow p-6 space-y-4">
                                    <h2 className="font-semibold text-gray-700">
                                        {index + 1}. {q.question_text}
                                    </h2>
                                    {(!q.summary || Object.values(q.summary).reduce((a, b) => a + b, 0) === 0) ? (
                                        <p className="text-gray-500">Belum ada jawaban.</p>
                                    ) : (
                                        <>
                                            {renderChart(q, index)}
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                {STATUS_ORDER.map((label) => (
                                                    <div key={label} className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className="w-4 h-4 rounded-full"
                                                            style={{ backgroundColor: getColor(label) }}
                                                        ></div>
                                                        <span className="text-gray-600">{label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}
