import { CalendarDays, MapPin, Ticket } from 'lucide-react';

import { events } from '@/data/events';

export default function RecreationPage() {

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="glass-panel p-8 rounded-3xl border border-fuchsia-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-fuchsia-500/20 rounded-2xl text-fuchsia-500">
                        <CalendarDays size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">Recreation & Culture</h1>
                        <p className="text-zinc-400 mt-2">Parks, Historic Landmarks, Museums, and Cultural Venues.</p>
                    </div>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {events.map((evt, i) => (
                    <article key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-fuchsia-500/30 transition-colors rgb-hover-glow group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-white text-lg group-hover:text-fuchsia-400 transition-colors">{evt.name}</h3>
                            <span className="text-xs px-2 py-1 bg-fuchsia-500/10 text-fuchsia-400 rounded border border-fuchsia-500/20">{evt.type}</span>
                        </div>
                        <p className="text-zinc-400 text-sm flex items-center gap-2 mb-6"><MapPin size={14} /> Montgomery City Center</p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                            <span className="text-sm font-mono text-zinc-300">{evt.date}</span>
                            <a href={evt.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-bold group-hover:bg-fuchsia-500/10 px-3 py-2 rounded-lg">
                                <Ticket size={16} /> Get Tickets
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
