import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "@heroui/react";
import { toast } from "react-hot-toast";

export default function SurveyEdit({ surveyId }) {
    const [survey, setSurvey] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [errors, setErrors] = useState({});

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
        try {
            await axios.put(`/api/admin/surveys/${survey.id}`, survey);
            toast.success("Survey diperbarui");
            setErrors({});
        } catch (err) {
            toast.error("Gagal memperbarui");
            setErrors(err.response?.data?.errors || {});
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;
        try {
            const res = await axios.post(
                `/api/admin/surveys/${survey.id}/questions`,
                { question_text: newQuestion }
            );
            setQuestions([...questions, res.data]);
            setNewQuestion("");
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
                    <label className="block text-sm font-medium text-gray-700">Judul</label>
                    <input
                        type="text"
                        name="title"
                        value={survey.title}
                        onChange={handleSurveyChange}
                        className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                        name="description"
                        value={survey.description}
                        onChange={handleSurveyChange}
                        rows={4}
                        className="w-full mt-1 border rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                        <input
                            type="date"
                            name="start_at"
                            value={survey.start_at?.slice(0, 10)}
                            onChange={handleSurveyChange}
                            className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                        <input
                            type="date"
                            name="end_at"
                            value={survey.end_at?.slice(0, 10)}
                            onChange={handleSurveyChange}
                            className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>

            <hr className="border-gray-200" />

            {/* FORM ADD QUESTION */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Pertanyaan</h2>
                <form onSubmit={handleAddQuestion} className="flex gap-2">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Tulis pertanyaan..."
                        className="flex-grow border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                        Tambah
                    </button>
                </form>
            </div>

            {/* DAFTAR PERTANYAAN */}
            <ul className="space-y-3">
                {questions.map((q) => (
                    <li
                        key={q.id}
                        className="flex justify-between items-center border rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <span className="text-gray-800">{q.question_text}</span>
                        <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="text-red-600 hover:underline text-sm"
                        >
                            Hapus
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
