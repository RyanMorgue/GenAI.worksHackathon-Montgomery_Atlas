import { HeartPulse, Stethoscope, Phone } from 'lucide-react';

export default function HealthPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="glass-panel p-8 rounded-3xl border border-rose-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-rose-500/20 rounded-2xl text-rose-500">
                        <HeartPulse size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">Public Health Network</h1>
                        <p className="text-zinc-400 mt-2">Hospitals, Clinics, Pharmacies, and Emergency Contacts.</p>
                    </div>
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2"><Stethoscope /> Nearby Medical Facilities</h2>
                    <div className="space-y-4">
                        {['Baptist Medical Center South', 'Jackson Hospital', 'VAMC Central Clinic', 'CVS 24/7 Pharmacy'].map((fac, i) => (
                            <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5 rgb-hover-glow cursor-pointer group hover:bg-[#1a1a1e]">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-white group-hover:text-rose-400 transition-colors">{fac}</h3>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">Open Now</span>
                                </div>
                                <p className="text-zinc-400 text-sm mt-2">{i < 2 ? 'Full Hospital Services • Emergency ER' : 'Pharmacy & Outpatient Care'}</p>
                                <p className="text-rose-500/80 text-sm mt-3 font-mono border-t border-white/5 pt-2 italic">Wait time: ~{15 + i * 12} mins</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2"><Phone /> Emergency Contacts</h2>
                    <div className="glass-panel p-8 rounded-2xl border border-rose-500/20 bg-rose-950/20">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                                <div>
                                    <h4 className="font-bold text-white text-lg">Ambulance & Fire</h4>
                                    <p className="text-zinc-400 text-sm">Immediate life-threatening emergencies</p>
                                </div>
                                <span className="text-3xl font-black text-rose-500 tracking-widest drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">911</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                                <div>
                                    <h4 className="font-bold text-white text-lg">Poison Control Center</h4>
                                    <p className="text-zinc-400 text-sm">Toxic substances exposure</p>
                                </div>
                                <span className="text-xl font-black text-rose-400 font-mono">1-800-222-1222</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-lg">Mental Health Crisis</h4>
                                    <p className="text-zinc-400 text-sm">Suicide and Crisis Lifeline</p>
                                </div>
                                <span className="text-xl font-black text-rose-400 font-mono">988</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
