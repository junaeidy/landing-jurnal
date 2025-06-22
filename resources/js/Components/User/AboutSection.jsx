import React, { useEffect, useState, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AboutSection({ onLoadComplete, isLoading }) {
    const [aboutList, setAboutList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef();
    const { translations, locale } = usePage().props;
    const t = translations?.buttons || {};
    const currentLang = locale || "en";

    useEffect(() => {
        AOS.init({ once: true, duration: 800 });
    }, []);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch("/api/home/about");
                const data = await response.json();
                setAboutList(data);
            } catch (error) {
                console.error("Gagal memuat data About:", error);
            } finally {
                onLoadComplete();
            }
        };

        fetchAboutData();
    }, []);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % aboutList.length);
    };

    const prev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? aboutList.length - 1 : prev - 1
        );
    };

    if (!aboutList.length || isLoading) return null;

    return (
        <section className="relative py-20 bg-gray-100 overflow-hidden">
            {/* Panah Navigasi */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
            >
                <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
            >
                <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            </button>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        width: `${aboutList.length * 100}%`,
                        transform: `translateX(-${currentIndex * (100 / aboutList.length)}%)`,
                    }}
                >
                    {aboutList.map((about, idx) => (
                        <div
                            key={about.id}
                            className="w-full flex-shrink-0 px-4 md:px-8"
                            style={{ width: `${100 / aboutList.length}%` }}
                        >
                            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                                {/* Gambar */}
                                {about.image && (
                                    <div className="md:w-1/2 w-full" data-aos="fade-right">
                                        <div className="rounded-xl overflow-hidden shadow-xl">
                                            <img
                                                src={`/storage/${about.image}`}
                                                alt={about.title?.[currentLang] ?? "About"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Konten */}
                                <div className="md:w-1/2 w-full" data-aos="fade-left" data-aos-delay="200">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                                        {about.title?.[currentLang] ?? "Judul"}
                                    </h2>
                                    <div
                                        className="text-gray-700 text-base md:text-lg leading-relaxed mb-6"
                                        dangerouslySetInnerHTML={{
                                            __html: about.content?.[currentLang] ?? "Konten belum tersedia.",
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-4">
                                        {about.google_form_link && (
                                            <a
                                                target="_blank"
                                                href={about.google_form_link}
                                                className="bg-[#1b096c] hover:bg-[#34278c] text-white font-medium px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
                                            >
                                                {t.register}
                                            </a>
                                        )}
                                        {about.whatsapp_link && (
                                            <a
                                                href={about.whatsapp_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20.52 3.48a11.75 11.75 0 0 0-16.6 0c-4.38 4.4-4.65 11.4-.76 16.14L2 22l2.43-.63c1.6.86 3.42 1.29 5.24 1.29 3.17 0 6.27-1.26 8.57-3.57a11.75 11.75 0 0 0 0-16.61Zm-2.35 14.25c-1.98 1.98-4.93 2.64-7.53 1.68l-.56-.22-2.48.65.66-2.42-.25-.6c-.98-2.5-.33-5.44 1.64-7.4a8.75 8.75 0 0 1 12.38 12.31Z" />
                                                </svg>
                                                <span>{t.whatsapp}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
