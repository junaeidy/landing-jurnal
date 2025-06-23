import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

export default function SurveyCreate() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        start_at: "",
        end_at: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post("/api/admin/surveys", form, {
            onSuccess: () => {
                toast.success("Survey berhasil dibuat!");
                router.visit(route("dashboard.surveys.index"));
            },
            onError: (err) => {
                toast.error("Gagal membuat survey");
                setErrors(err);
            },
        });
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">Buat Survei Baru</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Judul <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Deskripsi</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Mulai</label>
                        <input
                            type="date"
                            name="start_at"
                            value={form.start_at}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Selesai</label>
                        <input
                            type="date"
                            name="end_at"
                            value={form.end_at}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.end_at && (
                            <p className="text-red-500 text-sm mt-1">{errors.end_at}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}
