import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/User/Navbar";
import HeroSection from "@/Components/User/HeroSection";
import AboutSection from "@/Components/User/AboutSection";
import FeaturedJournalsSection from "@/Components/User/FeaturedJournalsSection";
import PartnerSection from "@/Components/User/PartnerSection";
import Footer from "@/Components/User/Footer";
import { usePage } from "@inertiajs/react";

// AOS setup
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home({ auth }) {
    const [loadingCount, setLoadingCount] = useState(3);
    const { translations } = usePage().props;
    const t = translations.navbar;

    const handleSectionLoaded = () => {
        setLoadingCount((prev) => prev - 1);
    };

    const isLoading = loadingCount > 0;

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: "ease-out-cubic",
        });
    }, []);

    return (
        <>
            <Head title={t.home} />

            {isLoading && (
                <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1b096c] border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm font-medium">
                        Loading...
                    </p>
                </div>
            )}

            <Navbar user={auth.user} />
            <HeroSection
                onLoadComplete={handleSectionLoaded}
                isLoading={isLoading}
            />
            <AboutSection
                onLoadComplete={handleSectionLoaded}
                isLoading={isLoading}
            />
            <FeaturedJournalsSection
                onLoadComplete={handleSectionLoaded}
                isLoading={isLoading}
            />
            <PartnerSection
                onLoadComplete={handleSectionLoaded}
                isLoading={isLoading}
            />
            <Footer />
        </>
    );
}
