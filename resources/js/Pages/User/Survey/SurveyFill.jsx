import React, { useEffect, useState } from "react";
import axios from "axios";
import { router, Head } from "@inertiajs/react";
import { toast } from "react-hot-toast";

const options = [
    "Sangat Tidak Setuju",
    "Tidak Setuju",
    "Netral",
    "Setuju",
    "Sangat Setuju",
];

export default function SurveyFill({ slug }) {
    const [survey, setSurvey] = useState(null);
    const [currentStep, setCurrentStep] = useState(-1);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [alreadyAnswered, setAlreadyAnswered] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [surveyRes, checkRes] = await Promise.all([
                    axios.get(`/api/survey/${slug}`),
                    axios.get(`/api/surveys/${slug}/check`)
                ]);

                setSurvey(surveyRes.data);
                setAlreadyAnswered(checkRes.data.alreadyAnswered);
            } catch (err) {
                const status = err.response?.status;
                if (status === 403 || status === 410) {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage("Survey tidak tersedia.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleStart = () => {
        setCurrentStep(0);
    };

    const handleChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleNext = () => {
        const currentQuestionId = survey.questions[currentStep].id;
        if (!answers[currentQuestionId]) {
            toast.error("Harap pilih salah satu jawaban terlebih dahulu.");
            return;
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`/api/survey/${slug}/submit`, { answers });
            setSubmitted(true);
            setTimeout(() => {
                router.visit("/");
            }, 5000);
        } catch (err) {
            if (err.response?.status === 409) {
                setAlreadyAnswered(true);
            } else {
                alert("Gagal mengirim jawaban. Silakan coba lagi.");
            }
        }
    };

    // 💫 Spinner custom loading
    if (loading) {
        return (
            <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1b096c] border-t-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-xl w-full bg-white p-8 rounded shadow text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
                    <p className="text-gray-600">{errorMessage}</p>
                </div>
            </div>
        );
    }

    if (alreadyAnswered) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Head title={`Survey: ${survey.title}`} />
                <div className="max-w-xl w-full bg-white p-8 rounded shadow text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Anda sudah pernah mengisi survey ini!
                    </h2>
                    <p className="text-gray-600">Terima kasih atas partisipasinya 🙏</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Head title={`Survey: ${survey.title}`} />
                <div className="max-w-xl w-full bg-white p-8 rounded shadow text-center">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Terima kasih!</h2>
                    <p className="text-gray-600">Jawaban Anda berhasil disimpan.</p>
                    <p className="mt-2 text-sm text-gray-400">
                        Anda akan diarahkan ke halaman utama dalam beberapa detik...
                    </p>
                </div>
            </div>
        );
    }

    if (!survey || !survey.questions || survey.questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Head title={`Survey: ${survey.title}`} />
                <div className="max-w-xl w-full bg-white p-8 rounded shadow text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Survey belum memiliki pertanyaan.
                    </h2>
                </div>
            </div>
        );
    }

    if (currentStep === -1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Head title={`Survey: ${survey.title}`} />
                <div className="max-w-xl w-full bg-white p-8 rounded shadow text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">{survey.title}</h1>
                    <p className="text-gray-600 mb-6">{survey.description}</p>
                    <button
                        onClick={handleStart}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Mulai Survey
                    </button>
                </div>
            </div>
        );
    }

    const question = survey.questions[currentStep];

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-white px-4 py-10">
        <Head title={`Survey: ${survey.title}`} />
        <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
                {currentStep + 1}. {question.question_text}
            </h2>

            <div className="space-y-3">
                {options.map((option) => (
                    <label
                        key={option}
                        className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition duration-150 ${
                            answers[question.id] === option
                                ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                                : "bg-white hover:bg-gray-50"
                        }`}
                    >
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() => handleChange(question.id, option)}
                            className="form-radio text-blue-600 h-5 w-5 mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                    </label>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
                {currentStep > 0 ? (
                    <button
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                    >
                        ← Kembali
                    </button>
                ) : (
                    <div />
                )}

                {currentStep < survey.questions.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
                    >
                        Lanjut →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
                    >
                        Kirim Jawaban
                    </button>
                )}
            </div>
        </div>
    </div>
);

}
