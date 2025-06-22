import React, { useEffect, useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import Modal from "@/Components/UI/Modal";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ListJournal({ onLoaded }) {
    const { translations, locale } = usePage().props;
    const journalT = translations.journal || {};
    const currentLang = locale || "en";

    const [journals, setJournals] = useState([]);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchJournals = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                search,
                sort: sortBy,
                category: selectedCategory,
                page,
                limit: 15,
            }).toString();
            const response = await fetch(`/api/journals?${query}`);
            const data = await response.json();
            setJournals(data.data);
            setTotalPages(data.last_page);
        } catch (error) {
            console.error("Gagal mengambil data jurnal:", error);
        } finally {
            setLoading(false);
            if (onLoaded) onLoaded();
        }
    };

    useEffect(() => {
        fetchJournals();
    }, [search, sortBy, selectedCategory, page]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCloseModal = () => {
        setSelectedJournal(null);
        setIsExpanded(false);
    };

    function stripHtml(html) {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    }

    const getText = (field) => {
        if (!field) return "";
        return typeof field === "object"
            ? field[locale] || field["id"] || ""
            : field;
    };

    return (
        <section className="py-16 bg-white">
            <Head
                title={journalT.find_title?.[currentLang] ?? "Find Journal"}
            />
            <div className="container mx-auto px-4 max-w-screen-xl">
                {/* FILTERS */}
                <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Search */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="search"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            {journalT.search_label?.[currentLang] ??
                                "Search Journal"}
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder={
                                    journalT.search_placeholder?.[
                                        currentLang
                                    ] ?? "Enter journal name..."
                                }
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b096c] shadow-sm"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <MagnifyingGlassIcon className="w-4 h-4" />
                            </span>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="category"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            {journalT.category_filter?.[currentLang] ??
                                "Category"}
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b096c] shadow-sm"
                        >
                            <option value="">
                                {journalT.all_categories?.[currentLang] ??
                                    "All Categories"}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {getText(cat.name)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="sort"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            {journalT.sort_by?.[currentLang] ?? "Sort By"}
                        </label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b096c] shadow-sm"
                        >
                            <option value="title">
                                {journalT.sort_title_asc?.[currentLang] ??
                                    "Title (A-Z)"}
                            </option>
                            <option value="-title">
                                {journalT.sort_title_desc?.[currentLang] ??
                                    "Title (Z-A)"}
                            </option>
                            <option value="-impact_factor">
                                {journalT.sort_impact_desc?.[currentLang] ??
                                    "Highest Impact Factor"}
                            </option>
                            <option value="-acceptance_rate">
                                {journalT.sort_acceptance_desc?.[currentLang] ??
                                    "Highest Acceptance Rate"}
                            </option>
                        </select>
                    </div>
                </div>

                {/* LOADING */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1b096c] border-t-transparent mx-auto"></div>
                        <p className="mt-3 text-gray-500">
                            {journalT.loading?.[currentLang] ??
                                "Loading journals..."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {journals.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center py-16 text-gray-500">
                                <img
                                    src="/images/not-found.svg"
                                    alt="Not found"
                                    className="w-32 h-32 mb-4"
                                />
                                <p className="text-lg font-medium">
                                    {journalT.no_journal?.[currentLang] ??
                                        "No journals found."}
                                </p>
                            </div>
                        ) : (
                            journals.map((journal) => (
                                <div
                                    key={journal.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden transition transform hover:scale-[1.02] hover:shadow-xl duration-300 border"
                                >
                                    <img
                                        src={
                                            journal.cover
                                                ? `/${journal.cover}`
                                                : "https://placehold.co/250x400?text=No+Image"
                                        }
                                        alt={getText(
                                            journal.title?.[currentLang] ??
                                                "Title"
                                        )}
                                        className="w-full h-44 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                                            {getText(journal.title)}
                                        </h3>
                                        <p
                                            className="text-gray-600 text-sm mb-3 line-clamp-3"
                                            dangerouslySetInnerHTML={{
                                                __html: getText(
                                                    journal.description?.[
                                                        currentLang
                                                    ] ?? journal.description
                                                ),
                                            }}
                                        />
                                        <button
                                            onClick={() =>
                                                setSelectedJournal(journal)
                                            }
                                            className="bg-[#2A7C4C] hover:bg-[#3fa767] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all"
                                        >
                                            {journalT.read_more?.[
                                                currentLang
                                            ] ?? "Read more"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="mt-10 flex justify-center space-x-2">
                        {[...Array(Math.min(totalPages, 9)).keys()].map((i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                        page === pageNum
                                            ? "bg-[#50c878] text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 9 && (
                            <>
                                <span className="text-gray-400 px-1.5">
                                    ...
                                </span>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                        page === totalPages
                                            ? "bg-[#50c878] text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL DETAIL */}
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
