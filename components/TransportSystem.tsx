import React from 'react';

export default function TransportSystem() {
    return (
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <header className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Montgomery Transit Hub</h2>
                <p className="text-slate-500 mt-2">Your guide to navigating the historic city.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-4">How it Works</h3>
                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            The <strong className="text-slate-800">Montgomery Transit System (The M)</strong> provides reliable public transportation across the city limits.
                            Buses generally run from 5:00 AM to 9:00 PM on weekdays, with reduced hours on weekends.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Fares:</strong> Standard fare is $2.00 per ride. Day passes are $4.00.</li>
                            <li><strong>Payment:</strong> Exact change or mobile ticketing via the official app.</li>
                            <li><strong>Transfers:</strong> Free within 90 minutes of initial boarding.</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                            <p className="text-blue-800 text-sm">
                                💡 <strong>Visitor Tip:</strong> The Rosa Parks trolley route is a free downtown circulator connecting major historic sites and hotels!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Transport Stations near you</h3>

                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">🚌</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Intermodal Transfer Center</h4>
                                    <p className="text-sm text-slate-500">Main Bus Hub • 495 Molton St</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-green-600">Open</span>
                        </div>

                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">🚖</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Downtown Taxi Stand</h4>
                                    <p className="text-sm text-slate-500">Dexter Ave & Perry St</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-green-600">Active</span>
                        </div>

                        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">✈️</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Montgomery Regional (MGM)</h4>
                                    <p className="text-sm text-slate-500">Airport Shuttle pickup • 12 mi</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-green-600">Open</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
