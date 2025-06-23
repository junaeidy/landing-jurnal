import { Link, usePage } from "@inertiajs/react";
import {
    ArchiveBoxIcon,
    BookOpenIcon,
    BriefcaseIcon,
    ChartBarIcon,
    ClockIcon,
    EnvelopeOpenIcon,
    HomeIcon,
    InformationCircleIcon,
    PencilSquareIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";

const navItems = [
    { name: "Dashboard", icon: ChartBarIcon, href: route("dashboard")},
    { name: "Manajemen Home", icon: HomeIcon, href: route("dashboard.home.index")},
    { name: "Manajemen Partner", icon: BriefcaseIcon, href: route("dashboard.partners.index")},
    { name: "Manajemen Kategori", icon: ArchiveBoxIcon, href: route("dashboard.categories.index")},
    { name: "Manajemen Jurnal", icon: BookOpenIcon, href: route("dashboard.journals.index")},
    { name: "Manajemen Kegiatan", icon: ClockIcon, href: route("dashboard.events.index")},
    { name: "Manajemen Team", icon: UserGroupIcon, href: route("dashboard.teams.index")},
    { name: "Manajemen About", icon: InformationCircleIcon, href: route("dashboard.abouts.index")},
    { name: "Campaign Email", icon: EnvelopeOpenIcon, href: route("campaigns.index")},
    { name: "Dashboard Survey", icon: PencilSquareIcon, href: route("dashboard.surveys.index")},
];

export default function Sidebar({ activeTab, setActiveTab }) {
    const { app_name } = usePage().props;

    return (
        <aside className="w-64 bg-white shadow-lg p-4 flex flex-col h-screen">
            <div className="text-2xl font-bold text-blue-600 mb-8">
               <p>Adra Karima Hubbi</p>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map((item) =>
                    item.href ? (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center p-3 rounded-lg transition-colors hover:bg-blue-100 ${
                                activeTab === item.name
                                    ? "bg-blue-100 text-blue-600 font-semibold"
                                    : "text-gray-700"
                            }`}
                        >
                            <item.icon className="w-6 h-6 mr-3" />
                            <span>{item.name}</span>
                        </Link>
                    ) : (
                        <div
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-blue-100 ${
                                activeTab === item.name
                                    ? "bg-blue-100 text-blue-600 font-semibold"
                                    : "text-gray-700"
                            }`}
                        >
                            <item.icon className="w-6 h-6 mr-3" />
                            <span>{item.name}</span>
                        </div>
                    )
                )}
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-200 text-sm text-gray-500">
                Created with ❤️ @ {new Date().getFullYear()}
            </div>
        </aside>
    );
}