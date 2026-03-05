'use client';

import { useState, useEffect } from 'react';

export interface JobListing {
    id: string;
    title: string;
    company: string;
    source: 'LinkedIn' | 'Indeed' | 'JobStreet';
    salary: string;
    workModel: 'Remote' | 'Hybrid' | 'Onsite';
    visaSponsorship: boolean;
    expiresAt: number; // UNIX timestamp
}

export default function JobsModule() {
    const [jobs, setJobs] = useState<JobListing[]>([]);

    useEffect(() => {
        // Stub data aligning with requirements for a MVP working state
        const initialJobs: JobListing[] = [
            {
                id: 'jl-1', title: 'Senior Software Engineer', company: 'TechNova Solutions',
                source: 'LinkedIn', salary: '$120,000 - $150,000',
                workModel: 'Remote', visaSponsorship: true,
                expiresAt: Date.now() + 86400000 * 5 // 5 days from now
            },
            {
                id: 'jl-2', title: 'Marketing Coordinator', company: 'Montgomery Local Business Alliance',
                source: 'Indeed', salary: '$45,000 - $55,000',
                workModel: 'Onsite', visaSponsorship: false,
                expiresAt: Date.now() - 3600000 // Expired 1 hour ago
            },
            {
                id: 'jl-3', title: 'Data Analyst', company: 'State of Alabama',
                source: 'JobStreet', salary: '$60,000 - $80,000',
                workModel: 'Hybrid', visaSponsorship: false,
                expiresAt: Date.now() + 86400000 * 14 // 14 days
            }
        ];

        // Filter out expired jobs automatically
        const validJobs = initialJobs.filter(job => job.expiresAt > Date.now());
        setJobs(validJobs);

        // Polling removal for expiration (checks every minute)
        const expirationInterval = setInterval(() => {
            setJobs(currentJobs => currentJobs.filter(job => job.expiresAt > Date.now()));
        }, 60000);

        return () => clearInterval(expirationInterval);
    }, []);

    const SourceBadge = ({ source }: { source: string }) => {
        let colors = '';
        if (source === 'LinkedIn') colors = 'bg-blue-100 text-blue-800';
        if (source === 'Indeed') colors = 'bg-indigo-100 text-indigo-800';
        if (source === 'JobStreet') colors = 'bg-amber-100 text-amber-800';
        return <span className={`text-xs px-2 py-1 rounded-md font-bold ${colors}`}>{source}</span>;
    };

    return (
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <header className="p-6 border-b border-slate-100 bg-blue-50 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Montgomery Job Board</h2>
                    <p className="text-slate-500 text-sm mt-1">Aggregated from leading networks</p>
                </div>
            </header>

            <div className="p-6">
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 border border-dashed rounded-lg">
                            No active job listings found in your area.
                        </div>
                    ) : jobs.map(job => (
                        <article key={job.id} className="p-5 border border-slate-200 rounded-xl hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                    <p className="text-slate-600 font-medium">{job.company}</p>

                                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                                            🏢 {job.workModel}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 font-medium">
                                            💵 {job.salary}
                                        </span>
                                        {job.visaSponsorship && (
                                            <span className="bg-sky-50 text-sky-700 px-2 py-1 rounded border border-sky-100">
                                                🌍 Visa Sponsorship Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2">
                                    <SourceBadge source={job.source} />
                                    <p className="text-xs text-slate-400">
                                        {/* eslint-disable-next-line react-hooks/exhaustive-deps */}
                                        Expires in {Math.round((job.expiresAt - new Date().getTime()) / 86400000)} days
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
