import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/User/Navbar";
import Footer from "@/Components//User/Footer";
import ListAbout from "./ListAbout";

export default function Index({ auth }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <Head title="About Us" />
            <Navbar user={auth.user} />

            {isLoading && (
                <div className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 text-sm">Loading...</p>
                </div>
            )}

            <div className="pt-16">
                {/* Hero Section */}
                <section
                    className="relative py-20 md:py-28 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.pexels.com/photos/796602/pexels-photo-796602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-left md:text-left text-white">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                About Us
                            </h1>
                            <p className="text-lg md:text-xl max-w-2xl leading-relaxed">
                                Adra Karima Hubbi is a scientific publication forum that aims to disseminate knowledge and research results from various scientific fields.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <ListAbout onLoaded={() => setIsLoading(false)} />
            </div>

            <Footer />
        </>
    );
}
