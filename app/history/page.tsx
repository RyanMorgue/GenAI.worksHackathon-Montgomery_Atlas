'use client';

import { useState } from 'react';
import { BookOpen, Play, Pause, MapPin, Volume2 } from 'lucide-react';

import { landmarks } from '@/data/landmarks';



export default function HistoryPage() {
    const [activeLocation, setActiveLocation] = useState(landmarks[0]);
    const [isPlayingTTS, setIsPlayingTTS] = useState(false);

    // Web Speech API for TTS
    const handleTTS = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in your browser.');
            return;
        }

        if (isPlayingTTS) {
            window.speechSynthesis.cancel();
            setIsPlayingTTS(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(activeLocation.description);
            utterance.rate = 0.9;
            utterance.pitch = 0.8;
            utterance.onend = () => setIsPlayingTTS(false);
            window.speechSynthesis.speak(utterance);
            setIsPlayingTTS(true);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="glass-panel p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-500">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Historic Montgomery</h1>
                        <p className="text-zinc-400 mt-2">Curated historical records mapped from Wikipedia data.</p>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Location Selection List */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-300 uppercase tracking-widest pl-2">Select Landmark</h3>
                    {landmarks.map(loc => (
                        <button
                            key={loc.id}
                            onClick={() => {
                                setActiveLocation(loc);
                                window.speechSynthesis.cancel();
                                setIsPlayingTTS(false);
                            }}
                            className={`w-full text-left p-5 rounded-xl border transition-all ${activeLocation.id === loc.id ? 'bg-amber-500/10 border-amber-500/30 rgb-hover-glow' : 'glass-panel border-white/5 hover:border-white/10 hover:bg-[#1a1a1e]'}`}
                        >
                            <h4 className="font-bold text-white mb-1">{loc.name}</h4>
                            <p className="text-sm text-amber-500/80 font-mono">Est. {loc.year}</p>
                        </button>
                    ))}
                </div>

                {/* Display Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                        {/* AI Story Video Placeholder */}
                        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden cursor-pointer group mb-8 border border-white/10">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-amber-500/80 text-white flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-amber-500 transition-all shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                                    <Play size={40} className="ml-2" />
                                </div>
                                <p className="mt-4 font-bold text-amber-300 tracking-widest uppercase text-sm drop-shadow-md">Play Cinematic Story</p>
                            </div>
                            {/* The generated image acting as the cinematic frame */}
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('${activeLocation.image}')` }}></div>
                        </div>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white mb-2">{activeLocation.name}</h2>
                                <p className="text-amber-500 font-mono text-lg flex items-center gap-2">
                                    <MapPin size={18} /> Established {activeLocation.year}
                                </p>
                            </div>

                            {/* TTS Controls */}
                            <button
                                onClick={handleTTS}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-lg ${isPlayingTTS ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10'}`}
                            >
                                {isPlayingTTS ? (
                                    <><Pause size={20} /> Stop Narrative </>
                                ) : (
                                    <><Volume2 size={20} className="text-amber-400" /> Listen to History</>
                                )}
                            </button>
                        </div>

                        <p className="text-zinc-300 leading-relaxed text-lg border-l-4 border-amber-500/50 pl-6 py-2">
                            {activeLocation.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
