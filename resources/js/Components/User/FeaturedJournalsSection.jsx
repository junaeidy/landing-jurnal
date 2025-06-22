import React, { useEffect, useState, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import Modal from "@/Components/UI/Modal";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function FeaturedJournalsSection({ onLoadComplete, isLoading }) {
    const [journals, setJournals] = useState([]);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const sliderRef = useRef(null);
    const { translations, locale } = usePage().props;
    const journalT = translations?.journal || {};

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const response = await fetch("/api/home/featured-journals");
                const data = await response.json();
                setJournals(data.slice(0, 10));
            } catch (error) {
                console.error("Gagal mengambil data jurnal unggulan:", error);
            } finally {
                onLoadComplete();
            }
        };

        fetchJournals();
    }, []);

    const handleCloseModal = () => {
        setSelectedJournal(null);
        setIsExpanded(false);
    };

    const scroll = (direction) => {
        const slider = sliderRef.current;
        if (slider) {
            const scrollAmount = slider.clientWidth * 0.8;
            slider.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    function stripHtml(html) {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    }

    function truncate(text, maxLength) {
        return text.length > maxLength
            ? text.slice(0, maxLength) + "..."
            : text;
    }

    const getText = (obj) =>
        typeof obj === "object" ? obj[locale] || "" : obj || "";

    if (isLoading || journals.length === 0) return null;

    return (
        <section className="py-20 bg-gradient-to-b from-white via-[#f7f9fc] to-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <h2
                    className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4"
                    data-aos="fade-up"
                >
                    {journalT.title}
                </h2>
                <div
                    className="w-24 h-1 mx-auto bg-[#1b096c] rounded-full mb-12"
                    data-aos="fade-up"
                    data-aos-delay="100"
                />

                {/* Navigasi panah */}
                <div className="hidden md:block">
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-6 top-[50%] -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-lg p-2 rounded-full hover:bg-green-800 transition"
                    >
                        <ChevronLeftIcon className="h-6 w-6 text-emerald-600" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-6 top-[50%] -translate-y-1/2 z-10 bg-white border border-gray-200 shadow-lg p-2 rounded-full hover:bg-emerald-50 transition"
                    >
                        <ChevronRightIcon className="h-6 w-6 text-emerald-600" />
                    </button>
                </div>

                {/* Slider */}
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-6 scroll-smooth scrollbar-hide py-2"
                >
                    {journals.map((journal, index) => (
                        <div
                            key={journal.id}
                            className="min-w-[80%] sm:min-w-[300px] sm:max-w-[300px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-emerald-100 hover:ring-2 hover:ring-emerald-300 transform hover:scale-[1.02] transition duration-300"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <img
                                src={
                                    journal.cover
                                        ? `/${journal.cover}`
                                        : "https://placehold.co/250x400?text=No+Image"
                                }
                                alt={getText(journal.title)}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5 text-left">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-snug line-clamp-2">
                                    {getText(journal.title)}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                                    {truncate(
                                        stripHtml(getText(journal.description)),
                                        120
                                    )}
                                </p>

                                <button
                                    onClick={() => setSelectedJournal(journal)}
                                    className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-300"
                                >
                                    {journalT.read_more}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-14" data-aos="zoom-in" data-aos-delay="800">
                    <Link
                        href="/journal"
                        className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-md"
                    >
                        {journalT.view_all}
                    </Link>
                </div>
            </div>

            <Modal
                show={!!selectedJournal}
                maxWidth="2xl"
                onClose={handleCloseModal}
            >
                {selectedJournal && (
                    <div className="relative">
                        <img
                            src={
                                selectedJournal.cover
                                    ? `/${selectedJournal.cover}`
                                    : "https://placehold.co/250x400?text=No+Image"
                            }
                            alt={getText(selectedJournal.title)}
                            className="w-full h-64 object-cover rounded-t-lg"
                        />
                        <div className="p-6 space-y-4">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                {getText(selectedJournal.title)}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-gray-700 leading-relaxed prose max-w-none max-h-[200px] overflow-y-auto pr-2">
                                        {(() => {
                                            const htmlContent = getText(
                                                selectedJournal.description
                                            );
                                            const plainText =
                                                stripHtml(htmlContent);
                                            const wordCount =
                                                plainText.split(/\s+/).length;

                                            if (!isExpanded && wordCount > 30) {
                                                return (
                                                    <>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    stripHtml(
                                                                        htmlContent
                                                                    )
                                                                        .split(
                                                                            /\s+/
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            30
                                                                        )
                                                                        .join(
                                                                            " "
                                                                        ) +
                                                                    "...",
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                setIsExpanded(
                                                                    true
                                                                )
                                                            }
                                                            className="mt-2 text-sm text-[#2A7C4C] underline hover:text-[#50c878] transition"
                                                        >
                                                            {journalT.read_more}
                                                        </button>
                                                    </>
                                                );
                                            }

                                            return (
                                                <>
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: htmlContent,
                                                        }}
                                                    />
                                                    {wordCount > 30 && (
                                                        <button
                                                            onClick={() =>
                                                                setIsExpanded(
                                                                    false
                                                                )
                                                            }
                                                            className="mt-2 text-sm text-[#2A7C4C] underline hover:text-[#50c878] transition"
                                                        >
                                                            {journalT.read_less}
                                                        </button>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                        {selectedJournal.link && (
                                            <a
                                                href={selectedJournal.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 text-center bg-[#2A7C4C] hover:bg-[#3fa767] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300"
                                            >
                                                {journalT.visit}
                                            </a>
                                        )}
                                        <a
                                            href="https://wa.me/62895323444273"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center flex items-center justify-center gap-2 bg-[#2e4799] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300"
                                        >
                                            {journalT.contact}
                                        </a>
                                    </div>
                                </div>

                                <div className="md:border-l md:pl-6 space-y-2 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-semibold">
                                            {journalT.published_year}:
                                        </span>{" "}
                                        {selectedJournal.published_year}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">
                                            {journalT.acceptance_rate}:
                                        </span>{" "}
                                        {selectedJournal.acceptance_rate}%
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">
                                            {journalT.decision_days}:
                                        </span>{" "}
                                        {selectedJournal.decision_days} days
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">
                                            {journalT.impact_factor}:
                                        </span>{" "}
                                        {selectedJournal.impact_factor}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}
