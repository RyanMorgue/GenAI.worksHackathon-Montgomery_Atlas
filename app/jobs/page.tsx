'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Building, Globe, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

import { generateJobs, Job } from '@/lib/jobGenerator';



export default function JobsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 100;

    const currentJobs = generateJobs(currentPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="glass-panel p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
                        <Briefcase size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Montgomery Job Board</h1>
                        <p className="text-zinc-400 mt-2">Aggregated from LinkedIn & Indeed. Showing page {currentPage} of {totalPages}.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {currentJobs.map(job => (
                    <a key={job.id} href={`https://${job.source.toLowerCase()}.com`} target="_blank" rel="noreferrer" className="block rgb-hover-glow rounded-xl">
                        <article className="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-[#1a1a1e] transition-colors border-white/5">
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                    {job.title}
                                    <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1"><Building size={16} className="text-zinc-500" /> {job.company}</span>
                                    <span className="flex items-center gap-1"><MapPin size={16} className="text-zinc-500" /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Globe size={16} className="text-emerald-500/70" /> {job.model}</span>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-bold">
                                    {job.salary}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-md font-bold ${job.source === 'LinkedIn' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                    {job.source}
                                </span>
                            </div>
                        </article>
                    </a>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 py-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl bg-[#111113] border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="text-zinc-400 font-medium">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl bg-[#111113] border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
