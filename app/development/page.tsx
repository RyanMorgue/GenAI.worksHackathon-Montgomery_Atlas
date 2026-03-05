import { HardHat, Leaf, Clock, TrendingUp } from 'lucide-react';

export default function DevelopmentPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="glass-panel p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-500">
                        <HardHat size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">City Development</h1>
                        <p className="text-zinc-400 mt-2">Infrastructure projects, construction updates, and timelines.</p>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-3xl border border-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                        <TrendingUp className="text-amber-500" /> Active Infrastructure Projects
                    </h2>
                    <div className="space-y-6">
                        <div className="border-l-2 border-amber-500 pl-4">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-white text-lg">I-85 Expansion</h3>
                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">On Schedule</span>
                            </div>
                            <p className="text-sm text-zinc-400 mb-2">Widening lanes and updating interchanges to improve traffic flow.</p>
                            <p className="text-xs text-amber-500 font-mono flex items-center gap-1"><Clock size={12} /> Est. Completion: Q4 2026</p>
                        </div>
                        <div className="border-l-2 border-zinc-700 pl-4">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-white text-lg">Downtown Smart Grid</h3>
                                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Phase 1</span>
                            </div>
                            <p className="text-sm text-zinc-400 mb-2">Installing smart meters and IoT traffic management systems.</p>
                            <p className="text-xs text-zinc-500 font-mono flex items-center gap-1"><Clock size={12} /> Est. Completion: Q1 2027</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                        <Leaf className="text-emerald-500" /> Sustainability Initiatives
                    </h2>
                    <div className="p-5 rounded-xl bg-[#111113] border border-white/5 rgb-hover-glow cursor-pointer group">
                        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">Riverfront Solar Park</h3>
                        <p className="text-zinc-400 text-sm mt-2">10MW solar installation powering critical city infrastructure. Currently in planning phase.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
