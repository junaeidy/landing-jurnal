import { useEffect, useState } from "react";
import axios from "axios";

export default function ListAbout({ onLoaded }) {
    const [abouts, setAbouts] = useState([]);

    useEffect(() => {
        axios
            .get("/api/abouts")
            .then((res) => {
                setAbouts(res.data);
            })
            .catch((err) => console.error("Gagal mengambil data tentang:", err))
            .finally(() => {
                if (onLoaded) onLoaded();
            });
    }, []);

    if (abouts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <img
                    src="/images/not-found.svg"
                    alt="Not Found"
                    className="w-60 mb-6"
                />
                <p className="text-gray-500 text-lg">
                    There is no data about us.
                </p>
            </div>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-12 space-y-20">
            {abouts.map((about, index) => {
                const isEven = index % 2 === 1;

                return (
                    <div
                        key={about.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                    >
                        {/* Media */}
                        <div
                            className={`${
                                isEven ? "md:order-2" : "md:order-1"
                            } order-1`}
                        >
                            {about.image ? (
                                <div className="w-full aspect-video rounded-lg overflow-hidden">
                                    <img
                                        src={`/storage/${about.image}`}
                                        alt="Gambar About"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : about.video_url ? (
                                <iframe
                                    src={convertYouTubeUrl(about.video_url)}
                                    title="Video About"
                                    className="w-full aspect-video rounded-lg"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full aspect-video rounded-lg overflow-hidden">
                                    <img
                                        src="https://placehold.co/100x100?text=No+Image"
                                        alt="No Image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Konten */}
                        <div
                            className={`${
                                isEven ? "md:order-1" : "md:order-2"
                            } order-2`}
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
                                {about.title}
                            </h2>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: about.content,
                                }}
                            />
                            {about.extra_link && (
                                <div className="mt-6 text-center md:text-left">
                                    <a
                                        href={about.extra_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-white px-5 py-2 rounded bg-[#1b096c] hover:bg-[#34278c] transition"
                                    >
                                        More Information
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

function convertYouTubeUrl(url) {
    try {
        if (!url.includes("youtube.com") && !url.includes("youtu.be"))
            return url;
        const videoId = url.includes("youtu.be")
            ? url.split("youtu.be/")[1].split("?")[0]
            : new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
    } catch {
        return url;
    }
}
