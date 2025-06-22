import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Navbar({ user }) {
    const { url, props } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { translations } = props;
    const t = translations.navbar;
    const locale = props.locale || "en";

    const navLinks = [
        { href: "/", label: t.home },
        { href: "/journal", label: t.journal },
        { href: "/events", label: t.events },
        { href: "/team", label: t.team },
        { href: "/about-us", label: t.about_us },
    ];

    const isActive = (href) => url === href || url.startsWith(href + "/");

    const LangSwitcher = ({ className = "" }) => (
        <div className={`flex gap-3 text-sm ${className}`}>
            <Link
                href="/lang/en"
                className={`hover:text-[#1b096c] ${
                    locale === "en" ? "font-bold underline" : ""
                }`}
            >
                EN
            </Link>
            <Link
                href="/lang/id"
                className={`hover:text-[#1b096c] ${
                    locale === "id" ? "font-bold underline" : ""
                }`}
            >
                ID
            </Link>
        </div>
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ease-in-out 
    bg-white/80 backdrop-blur-md shadow border border-gray-100 ${
        isScrolled
            ? "w-full rounded-none py-2 px-4"
            : "mx-auto max-w-screen-md md:top-6 md:rounded-3xl py-3 px-4 lg:max-w-screen-lg"
    }`}
        >
            <div className="px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/images/Logo-1.png"
                            alt="Logo Perusahaan"
                            className="h-10 w-auto"
                        />
                        <div className="flex flex-col leading-tight">
                            <span
                                className="text-sm font-semibold"
                                style={{ color: "#1b096c" }}
                            >
                                {" "}
                                Adra Karima Hubbi
                            </span>
                            <span
                                className="text-xs font-medium"
                                style={{ color: "#AD9113FF" }}
                            >
                                {" "}
                                Research and Publisher
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <nav className="hidden md:flex items-center gap-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-2 py-1 text-lg font-semibold transition-colors duration-200${
                                    isActive(link.href)
                                        ? "text-[#1b096c]"
                                        : "text-gray-700 hover:text-[#1b096c]"
                                }
    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#1b096c]
    after:transition-all after:duration-300 after:ease-in-out after:w-0
    ${isActive(link.href) ? "after:w-full" : "hover:after:w-full"}
  `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <LangSwitcher />
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-xl bg-[#1b096c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5d4ab3] transition"
                            >
                                {t.dashboard}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-xl bg-[#1b096c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5d4ab3] transition"
                            >
                                {t.login}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 pb-4 pt-3 flex flex-col space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative px-2 py-1 text-base font-medium text-gray-700 transition-colors duration-200
  hover:text-teal-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-teal-600 
  after:transition-all after:duration-300 after:ease-in-out after:w-0 hover:after:w-full ${
      isActive(link.href) ? "text-teal-600 after:w-full" : ""
  }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Auth Buttons - Mobile */}
                    <div className="mt-4 flex flex-col gap-2">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="block w-full bg-[#1b096c] text-white px-4 py-2 rounded-xl text-center hover:bg-[#5d4ab3] transition"
                                onClick={() => setIsOpen(false)}
                            >
                                {t.dashboard}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block w-full bg-[#1b096c] text-white px-4 py-2 rounded-xl text-center hover:bg-[#5d4ab3] transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t.login}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Language Switch - Mobile */}
                    <div className="mt-4">
                        <LangSwitcher className="justify-center" />
                    </div>
                </div>
            </div>
        </header>
    );
}
