import React, { useState } from 'react'
import Topbar from "@/Components/layouts/Topbar";
import Sidebar from "@/Components/layouts/Sidebar";
import { Head, usePage } from "@inertiajs/react";
import SurveyEdit from './SurveyEdit';

export default function index () {
    const { surveyId } = usePage().props;
    const [activeTab, setActiveTab] = useState("Dashboard Survey");

    return (
        <div className="flex h-screen overflow-hidden">
            <Head title="Dashboard Survey" />
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                        Dashboard Survey
                    </h1>
                    <SurveyEdit surveyId={surveyId} />
                </main>
            </div>
        </div>
    )
}