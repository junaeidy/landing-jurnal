import { useState, useEffect } from "react";
import Modal from "@/Components/UI/Modal";
import TextInput from "@/Components/UI/TextInput";
import PrimaryButton from "@/Components/UI/PrimaryButton";
import SecondaryButton from "@/Components/UI/SecondaryButton";
import toast from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";

export default function AddActivity({ show, onClose, onSuccess }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        event_date: "",
        location: "",
        related_link: "",
        image: null,
        is_active: true,
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState("general");
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            event_date: "",
            location: "",
            related_link: "",
            image: null,
            is_active: true,
        });
        setPreview(null);
        setTab("general");
    };

    useEffect(() => {
        if (show) resetForm();
    }, [show]);

    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;

        if (type === "file") {
            const file = files?.[0];
            setForm((prev) => ({ ...prev, image: file }));
            if (file) setPreview(URL.createObjectURL(file));
        } else if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
        setPreview(null);
    };

    const validateForm = () => {
        if (!form.title.trim()) return "Judul kegiatan wajib diisi";
        if (!form.description.trim()) return "Konten kegiatan wajib diisi";
        if (!form.event_date.trim()) return "Tanggal kegiatan wajib diisi";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        setSubmitting(true);
        const formData = new FormData();

        for (const key in form) {
            let value = form[key];

            if (key === "is_active") {
                formData.append("is_active", form.is_active ? "1" : "0");
                continue;
            }

            if (value === "") value = null;
            if (value !== null) {
                formData.append(key, value);
            }
        }

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            console.log("✅ Response status:", res.status);

            if (res.ok) {
                toast.success("Data kegiatan berhasil ditambahkan");
                const newData = await res.json();
                onSuccess(newData);
                onClose();
                resetForm();
            } else {
                const errorText = await res.text();
                console.error("❌ Gagal tambah data:", errorText);
                toast.error("Gagal menambahkan data");
            }
        } catch (error) {
            console.error("💥 Error saat request:", error);
            toast.error("Terjadi kesalahan saat menambahkan data");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Tambah Data Kegiatan
                </h2>

                {/* Tab Selector */}
                <div className="flex gap-4 border-b pb-2">
                    <button
                        type="button"
                        className={`pb-1 border-b-2 ${
                            tab === "general"
                                ? "border-indigo-500 text-indigo-600 font-semibold"
                                : "border-transparent text-gray-500 hover:text-indigo-500"
                        }`}
                        onClick={() => setTab("general")}
                    >
                        Informasi Umum
                    </button>
                    <button
                        type="button"
                        className={`pb-1 border-b-2 ${
                            tab === "content"
                                ? "border-indigo-500 text-indigo-600 font-semibold"
                                : "border-transparent text-gray-500 hover:text-indigo-500"
                        }`}
                        onClick={() => setTab("content")}
                    >
                        Konten & Media
                    </button>
                </div>

                {/* Tab Content */}
                {tab === "general" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            label="Judul Kegiatan"
                            name="title"
                            value={form.title || ""}
                            onChange={handleChange}
                            isRequired
                        />
                        <TextInput
                            label="Tanggal Kegiatan"
                            name="event_date"
                            type="date"
                            value={form.event_date || ""}
                            onChange={handleChange}
                            isRequired
                        />
                        <TextInput
                            label="Lokasi Kegiatan"
                            name="location"
                            value={form.location || ""}
                            onChange={handleChange}
                            isRequired
                        />
                        <TextInput
                            label="Link Terkait (opsional)"
                            name="related_link"
                            value={form.related_link || ""}
                            onChange={handleChange}
                        />
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active || false}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <span>Status Aktif</span>
                            </label>
                        </div>
                    </div>
                )}

                {tab === "content" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Konten Kegiatan
                            </label>
                            <Editor
                                apiKey="pyjzhjk91dk9ks2jft1cs0wd0dw2alw1wy0x03qhtj1wrn2d"
                                value={form.description}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        "advlist",
                                        "autolink",
                                        "lists",
                                        "link",
                                        "image",
                                        "charmap",
                                        "preview",
                                        "anchor",
                                        "searchreplace",
                                        "visualblocks",
                                        "code",
                                        "fullscreen",
                                        "insertdatetime",
                                        "media",
                                        "table",
                                        "help",
                                        "wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                                }}
                                onEditorChange={(desc) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        description: desc,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Gambar/Banner (opsional)
                            </label>
                            {preview ? (
                                <div className="relative w-[150px] h-[100px] max-w-xs">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="rounded shadow object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            )}
                        </div>
                    </>
                )}

                <div className="flex justify-between items-center pt-6">
                    <div className="flex gap-2">
                        <SecondaryButton
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={submitting}>
                            {submitting ? "Menyimpan..." : "Simpan"}
                        </PrimaryButton>
                    </div>

                    <div className="flex gap-2">
                        {tab === "content" && (
                            <button
                                type="button"
                                className="text-sm text-gray-500 hover:text-indigo-600"
                                onClick={() => setTab("general")}
                            >
                                ← Kembali
                            </button>
                        )}
                        {tab === "general" && (
                            <button
                                type="button"
                                className="text-sm text-indigo-600 font-medium hover:underline"
                                onClick={() => setTab("content")}
                            >
                                Lanjut →
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
