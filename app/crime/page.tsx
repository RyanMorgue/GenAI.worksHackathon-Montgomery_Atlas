import CrimeDashboard from '@/components/CrimeDashboard';
import { Shield } from 'lucide-react';

export default function CrimePage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="glass-panel p-8 rounded-3xl border border-red-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-4 bg-red-500/20 rounded-2xl text-red-500">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Live Crime & Safety Reports</h1>
                        <p className="text-zinc-400 mt-2">Real-time incident tracking mapped from Montgomery APD Public Dispatch.</p>
                    </div>
                </div>
            </header>

            <div className="h-full">
                <CrimeDashboard />
            </div>
        </div>
    );
}
