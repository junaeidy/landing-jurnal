import { Link, usePage } from "@inertiajs/react";
import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function HeroSection({ onLoadComplete, isLoading }) {
    const [heroList, setHeroList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { props } = usePage();
    const currentLang = props.locale || "en";
    const intervalRef = useRef(null);

    useEffect(() => {
        AOS.init({ once: true, duration: 800 });
    }, []);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch("/api/home/hero");
                const data = await response.json();
                const processed = data.map((item) => ({
                    title: typeof item.title === "string" ? JSON.parse(item.title) : item.title,
                    subtitle: typeof item.subtitle === "string" ? JSON.parse(item.subtitle) : item.subtitle,
                    cta_text: typeof item.cta_text === "string" ? JSON.parse(item.cta_text) : item.cta_text,
                    cta_link: item.cta_link,
                    image: item.image,
                }));
                setHeroList(processed);
            } catch (error) {
                console.error("Gagal mengambil data hero:", error);
            } finally {
                onLoadComplete();
            }
        };
        fetchHeroData();
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroList.length);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, [heroList.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? heroList.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % heroList.length);
    };

    if (isLoading || heroList.length === 0) return null;

    return (
        <section className="relative w-full min-h-screen bg-gradient-to-br from-[#64326d] via-[#2f1e6e] to-[#170760] overflow-hidden">
            <div className="absolute inset-0 bg-black/50 z-0" />

            <div className="relative h-screen">
                {heroList.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute top-1/2 left-1/2 w-full max-w-7xl px-4 md:px-10 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-1000 ease-in-out ${
                            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-white">
                            {/* Teks */}
                            <div className="md:w-1/2 text-center md:text-left" data-aos="fade-right">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                                    {item.title?.[currentLang] || ""}
                                </h1>
                                <p className="text-base md:text-lg text-white/90 mb-6" data-aos="fade-up" data-aos-delay="200">
                                    {item.subtitle?.[currentLang] || ""}
                                </p>
                                {item.cta_text?.[currentLang] && item.cta_link && (
                                    <div data-aos="zoom-in" data-aos-delay="400">
                                        <a
                                            target="_blank"
                                            href={item.cta_link}
                                            className="inline-block bg-white text-[#1b096c] font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:bg-emerald-100 transition-transform transform hover:scale-105"
                                        >
                                            {item.cta_text[currentLang]}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Gambar */}
                            <div className="md:w-1/2 flex justify-center" data-aos="fade-left" data-aos-delay="300">
                                <img
                                    src={`/storage/${item.image}`}
                                    alt="Hero"
                                    className="w-full max-w-md md:max-w-lg drop-shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tombol navigasi */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full"
            >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full"
            >
                <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>

            {/* Indikator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                {heroList.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            i === currentIndex ? "bg-white" : "bg-white/40"
                        }`}
                    />
                ))}
            </div>

            {/* Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0">
                <svg
                    className="relative block w-full h-[130px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#f3f4f6"
                        d="M0,192L60,176C120,160,240,128,360,122.7C480,117,600,139,720,160C840,181,960,203,1080,202.7C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </div>
        </section>
    );
}
