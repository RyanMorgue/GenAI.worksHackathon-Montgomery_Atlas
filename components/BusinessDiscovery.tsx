'use client';

import { useState, useMemo, useEffect } from 'react';
import SmartCityMap from './Map';
import { Store, Coffee, ShoppingBag, Scissors, HandMetal, Sparkles, Dumbbell, Activity, StretchHorizontal, MapPin, Clock } from 'lucide-react';

type Category = 'restaurants' | 'cafes' | 'malls' | 'salons' | 'manicure salons' | 'spas' | 'gyms' | 'yoga studios' | 'pilates studios';

// Generate 10+ items per category — called inside useState to avoid SSR/client hydration mismatch
const generatePOIs = () => {
    const categories: Category[] = ['restaurants', 'cafes', 'malls', 'salons', 'manicure salons', 'spas', 'gyms', 'yoga studios', 'pilates studios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pois: any[] = [];
    const baseLat = 32.3792;
    const baseLng = -86.3077;

    categories.forEach((cat, catIdx) => {
        for (let i = 1; i <= 12; i++) {
            const id = `poi-${catIdx}-${i}`;
            const isClosed = i % 3 === 0;

            pois.push({
                id,
                name: `${cat.split(' ')[0].charAt(0).toUpperCase() + cat.split(' ')[0].slice(1)} Hub ${i}`,
                type: cat,
                lat: baseLat + (Math.random() - 0.5) * 0.05,
                lng: baseLng + (Math.random() - 0.5) * 0.05,
                priceRange: i % 2 === 0 ? '$$' : (i % 3 === 0 ? '$$$' : '$'),
                openingStatus: isClosed ? 'Closed' : 'Open',
                distance: (Math.random() * 5).toFixed(1),
                hours: isClosed ? 'Opens at 9:00 AM' : 'Closes at 10:00 PM',
                rating: (3.5 + Math.random() * 1.5).toFixed(1)
            });
        }
    });

    // Add extra required Map POIs
    pois.push({ id: 'hosp-1', name: 'Jackson Hospital', type: 'hospitals', lat: 32.368, lng: -86.284, distance: '1.2', openingStatus: 'Open' });
    pois.push({ id: 'pol-1', name: 'Montgomery Central Police', type: 'police stations', lat: 32.381, lng: -86.311, distance: '0.4', openingStatus: 'Open' });
    pois.push({ id: 'tour-1', name: 'Legacy Museum', type: 'tourist attractions', lat: 32.377, lng: -86.312, distance: '0.2', openingStatus: 'Open', priceRange: '$' });
    pois.push({ id: 'trans-1', name: 'Union Station', type: 'transport hubs', lat: 32.383, lng: -86.309, distance: '0.5', openingStatus: 'Open' });

    return pois;
};

export default function BusinessDiscovery() {
    const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
    const [activeCategory, setActiveCategory] = useState<Category>('restaurants');
    // Populate client-only via useEffect to prevent SSR/hydration mismatch
    const [ALL_POIS, setALL_POIS] = useState<ReturnType<typeof generatePOIs>>([]);
    useEffect(() => { setALL_POIS(generatePOIs()); }, []);

    const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveCategory(e.target.value as Category);
    };

    const filteredPOIs = useMemo(() => {
        return ALL_POIS.filter(poi =>
            poi.type === activeCategory &&
            (activeTab === 'open' ? poi.openingStatus === 'Open' : poi.openingStatus === 'Closed')
        );
    }, [ALL_POIS, activeTab, activeCategory]);

    return (
        <section className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
            <header className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                        <Store className="text-indigo-400" size={32} />
                        Local Discovery Network
                    </h2>
                    <p className="text-zinc-400 text-sm mt-2">Live mapping of businesses sourced from Bright Data & SODA.</p>
                </div>

                <div className="flex bg-[#111113] p-1 rounded-xl border border-white/10 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('open')}
                        className={`flex-1 md:w-32 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'open' ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'text-zinc-500 hover:text-white'}`}
                    >
                        OPEN NOW
                    </button>
                    <button
                        onClick={() => setActiveTab('closed')}
                        className={`flex-1 md:w-32 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'closed' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                        CLOSED
                    </button>
                </div>
            </header>

            <div className="p-8 grid lg:grid-cols-12 gap-8">
                {/* List View */}
                <div className="lg:col-span-5 h-[600px] flex flex-col">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Select Category</label>
                        <select
                            value={activeCategory}
                            onChange={handleCategorySelect}
                            className="w-full bg-[#111113] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500/50 appearance-none rgb-hover-glow cursor-pointer"
                        >
                            <option value="restaurants">🍔 Restaurants (12)</option>
                            <option value="cafes">☕️ Cafes (12)</option>
                            <option value="malls">🛍️ Malls (12)</option>
                            <option value="salons">💇‍♀️ Salons (12)</option>
                            <option value="manicure salons">💅 Manicure Salons (12)</option>
                            <option value="spas">🧖‍♀️ Spas (12)</option>
                            <option value="gyms">🏋️ Gyms (12)</option>
                            <option value="yoga studios">🧘‍♀️ Yoga Studios (12)</option>
                            <option value="pilates studios">🤸‍♀️ Pilates Studios (12)</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {filteredPOIs.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500 border border-dashed border-white/10 rounded-2xl">
                                No {activeTab} {activeCategory} found.
                            </div>
                        ) : filteredPOIs.map(poi => (
                            <article key={poi.id} className="p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-[#1a1a1e] hover:border-indigo-500/30 transition-all group rgb-hover-glow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400">{poi.name}</h3>
                                    <span className="font-mono text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">{poi.rating} ★</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                    <span className={`px-2 py-1 rounded font-bold ${activeTab === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {activeTab === 'open' ? 'Open' : 'Closed'}
                                    </span>
                                    <span className="text-zinc-400 flex items-center gap-1"><Clock size={14} /> {poi.hours}</span>
                                    <span className="text-zinc-400 flex items-center gap-1"><MapPin size={14} /> {poi.distance} mi</span>
                                    <span className="text-zinc-400 font-mono tracking-widest">{poi.priceRange}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Map View */}
                <div className="lg:col-span-7 h-[600px] rounded-2xl overflow-hidden glass-panel border border-white/10 relative">
                    <div className="absolute top-4 right-4 z-[400] bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs text-zinc-300 space-y-2 pointer-events-none">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Open Now</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Closed</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Other Civic POIs</div>
                    </div>
                    {/* Send all POIs to Map so it can display multiple types at once as requested */}
                    <SmartCityMap pois={ALL_POIS} />
                </div>
            </div>
        </section>
    );
}
