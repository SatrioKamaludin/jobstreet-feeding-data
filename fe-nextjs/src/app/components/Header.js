// src/app/HeaderMenu.js
"use client";

import { downloadFile } from "../api/api";

export default function Header() {

    const handleExportClick = () => {
        downloadFile();
    };


    return (
        <header className="w-full bg-slate-50">
            <div className="container mx-auto px-4 py-4 flex gap-5 justify-center">
                {/* Search Field */}
                <div className="flex items-center space-x-2 w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Search
                    </button>
                </div>

                {/* Add Jobs Button */}
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    + Add Jobs
                </button>

                {/* Export Button */}
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onClick={handleExportClick}>
                    Export
                </button>
            </div>
        </header>
    );
}
