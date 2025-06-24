import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "@heroui/react";
import { toast } from "react-hot-toast";

const chartTypes = ["bar", "pie", "donut", "line", "area", "radar", "scatter"];

export default function SurveyEdit({ surveyId }) {
    const [survey, setSurvey] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        question_text: "",
        type: "radio",
        options: [],
        chart_type: "bar",
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axios.get(`/api/admin/surveys/${surveyId}`).then((res) => {
            setSurvey(res.data);
            setQuestions(res.data.questions || []);
        });
    }, [surveyId]);

    const handleSurveyChange = (e) => {
        setSurvey({ ...survey, [e.target.name]: e.target.value });
    };

    const handleSurveyUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`/api/admin/surveys/${survey.id}`, survey);
            toast.success("Survey diperbarui");
            setErrors({});
        } catch (err) {
            toast.error("Gagal memperbarui");
            setErrors(err.response?.data?.errors || {});
        } finally {
            setSaving(false);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.question_text.trim()) return;

        const payload = { ...newQuestion };
        if (payload.type === "text") {
            payload.chart_type = null;
        }

        try {
            const res = await axios.post(
                `/api/admin/surveys/${survey.id}/questions`,
                payload
            );
            setQuestions([...questions, res.data]);
            setNewQuestion({
                question_text: "",
                type: "radio",
                options: [],
                chart_type: "bar",
            });
            toast.success("Pertanyaan ditambahkan");
        } catch (err) {
            toast.error("Gagal tambah pertanyaan");
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`/api/admin/questions/${id}`);
            setQuestions((prev) => prev.filter((q) => q.id !== id));
            toast.success("Pertanyaan dihapus");
        } catch (err) {
            toast.error("Gagal hapus pertanyaan");
        }
    };

    const handleNewOptionChange = (index, value) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[index] = value;
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const addNewOption = () => {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, ""],
        });
    };

    const removeNewOption = (index) => {
        const updated = [...newQuestion.options];
        updated.splice(index, 1);
        setNewQuestion({ ...newQuestion, options: updated });
    };

    if (!survey) {
        return (
            <div className="flex items-center justify-center h-40">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Edit Survei</h1>

            {/* FORM UPDATE */}
            <form onSubmit={handleSurveyUpdate} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Judul
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={survey.title}
                        onChange={handleSurveyChange}
                        className="w-full mt-1 border rounded-md px-4 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        value={survey.description}
                        onChange={handleSurveyChange}
                        rows={4}
                        className="w-full mt-1 border rounded-md px-4 py-2"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            name="start_at"
                            value={survey.start_at?.slice(0, 10)}
                            onChange={handleSurveyChange}
                            className="w-full mt-1 border rounded-md px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tanggal Selesai
                        </label>
                        <input
                            type="date"
                            name="end_at"
                            value={survey.end_at?.slice(0, 10)}
                            onChange={handleSurveyChange}
                            className="w-full mt-1 border rounded-md px-4 py-2"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>

            <hr className="border-gray-200" />

            {/* FORM ADD QUESTION */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Tambah Pertanyaan
                </h2>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                    <input
                        type="text"
                        value={newQuestion.question_text}
                        onChange={(e) =>
                            setNewQuestion({
                                ...newQuestion,
                                question_text: e.target.value,
                            })
                        }
                        placeholder="Tulis pertanyaan..."
                        className="w-full border rounded-md px-4 py-2"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Tipe Jawaban
                            </label>
                            <select
                                value={newQuestion.type}
                                onChange={(e) =>
                                    setNewQuestion({
                                        ...newQuestion,
                                        type: e.target.value,
                                    })
                                }
                                className="w-full border rounded-md px-4 py-2"
                            >
                                <option value="radio">Radio</option>
                                <option value="select">
                                    Select (Dropdown)
                                </option>
                                <option value="multiselect">
                                    Multiselect (Checkbox)
                                </option>
                                <option value="text">Text (Isian Bebas)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Tipe Diagram
                            </label>
                            <select
                                value={newQuestion.chart_type || ""}
                                onChange={(e) =>
                                    setNewQuestion({
                                        ...newQuestion,
                                        chart_type: e.target.value,
                                    })
                                }
                                className="w-full border rounded-md px-4 py-2"
                                disabled={newQuestion.type === "text"}
                            >
                                {chartTypes.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {["radio", "select", "multiselect"].includes(
                        newQuestion.type
                    ) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilihan Jawaban
                            </label>
                            {newQuestion.options.map((opt, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) =>
                                            handleNewOptionChange(
                                                i,
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 border rounded-md px-3 py-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewOption(i)}
                                        className="text-red-500 text-sm"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addNewOption}
                                className="text-blue-600 text-sm mt-1"
                            >
                                + Tambah Opsi
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                    >
                        Tambah Pertanyaan
                    </button>
                </form>
            </div>

            {/* DAFTAR PERTANYAAN */}
            <ul className="space-y-3">
                {questions.map((q) => (
                    <li
                        key={q.id}
                        className="border rounded-md px-4 py-3 bg-gray-50 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-medium text-gray-800">
                                {q.question_text}
                            </p>
                            <p className="text-sm text-gray-500">
                                Tipe: {q.type}, Diagram: {q.chart_type || "-"}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Hapus
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
