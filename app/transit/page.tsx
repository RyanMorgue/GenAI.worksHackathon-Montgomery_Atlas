'use client';

import { useState } from 'react';
import { Navigation, Bus, Train, CarTaxiFront, Route, MapPin } from 'lucide-react';

export default function TransitPage() {
    const [activeTab, setActiveTab] = useState<'bus' | 'train' | 'taxi'>('bus');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="glass-panel p-8 rounded-3xl border border-sky-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-sky-500/20 rounded-2xl text-sky-400">
                        <Navigation size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Montgomery Transit Hub</h1>
                        <p className="text-zinc-400 mt-2">Live routing and schedules for bus stops, train stations, and taxi hubs.</p>
                    </div>
                </div>
            </header>

            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button onClick={() => setActiveTab('bus')} className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'bus' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-[#111113] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 rgb-hover-glow'}`}>
                    <Bus size={20} /> City Buses
                </button>
                <button onClick={() => setActiveTab('train')} className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'train' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-[#111113] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 rgb-hover-glow'}`}>
                    <Train size={20} /> Train Stations
                </button>
                <button onClick={() => setActiveTab('taxi')} className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'taxi' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-[#111113] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 rgb-hover-glow'}`}>
                    <CarTaxiFront size={20} /> Taxi Hubs
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <article key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all rgb-hover-glow group cursor-pointer block">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-white text-lg group-hover:text-sky-400 transition-colors">
                                {activeTab === 'bus' ? `Route 0${i} Express` : activeTab === 'train' ? `Downtown Station ${i}` : `Central Taxi rank ${i}`}
                            </h3>
                            <span className="text-xs font-mono px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                {activeTab === 'bus' ? '12 mins away' : 'On Time'}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-zinc-400">
                                <MapPin size={16} className="text-zinc-600" />
                                <span>Departure: {activeTab === 'bus' ? 'Rosa Parks Transit Center' : 'Union Station'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-400">
                                <Route size={16} className="text-zinc-600" />
                                <span>Destination: {activeTab === 'bus' ? 'Eastdale Mall via Perry St' : 'Interstate Exchange'}</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 rounded-lg bg-zinc-800 text-white font-bold group-hover:bg-sky-600 group-hover:shadow-[0_0_15px_rgba(2,132,199,0.5)] transition-all">
                            View Directions
                        </button>
                    </article>
                ))}
            </div>

        </div>
    );
}
