import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Navbar from "@/Components/User/Navbar";
import Footer from "@/Components//User/Footer";
import ListAbout from "./ListAbout";

export default function Index({ auth }) {
    const [isLoading, setIsLoading] = useState(true);
    const { translations, locale } = usePage().props;
    const aboutT = translations?.about || {};

    return (
        <>
            <Head title={aboutT?.find_title} />
            <Navbar user={auth.user} />

            {isLoading && (
                <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#1b096c] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 text-sm">Loading...</p>
                </div>
            )}

            <div>
                {/* Hero Section */}
                <section
                    className="relative py-24 md:py-32 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 1440 320"
                            preserveAspectRatio="none"
                        >
                            <path
                                fill="#ffffff"
                                fillOpacity="0.2"
                                d="M0,160L80,160C160,160,320,160,480,181.3C640,203,800,245,960,245.3C1120,245,1280,203,1360,181.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
                            ></path>
                        </svg>
                        </div>
                        <div className="relative pt-10 z-10 max-w-5xl mx-auto px-6 text-center">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1b096c] mb-6 leading-tight">
                                {aboutT?.find_title}
                            </h1>
                            <p className="text-md sm:text-lg text-gray-700 max-w-3xl mx-auto">
                                {aboutT?.find_description}
                            </p>
                        </div>
                </section>

                {/* Content Section */}
                <ListAbout onLoaded={() => setIsLoading(false)} />
            </div>

            <Footer />
        </>
    );
}
