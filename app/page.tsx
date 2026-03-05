import BusinessDiscovery from '@/components/BusinessDiscovery';
import TransportSystem from '@/components/TransportSystem';
import CrimeDashboard from '@/components/CrimeDashboard';
import FinanceDashboard from '@/components/FinanceDashboard';
import JobsModule from '@/components/JobsModule';

export default function Home() {
  return (
    <>
      {/* AI Copilot Hero Section */}
      <section id="copilot" className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden h-[400px] flex flex-col justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 MixBlendMode-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Meet your City Copilot.
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-8 font-medium">
            Ask me anything about Montgomery. Try typing: <br />
            <span className="inline-block mt-3 bg-white/10 px-4 py-2 rounded-lg border border-white/20 italic font-mono text-sm">
              "Plan my perfect day in Montgomery"
            </span>
          </p>

          <div className="relative max-w-xl group">
            <input
              type="text"
              placeholder="Ask your civic assistant..."
              className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-6 pr-32 text-white placeholder:text-blue-200 focus:outline-none focus:bg-white/20 transition-all shadow-inner backdrop-blur-md"
              readOnly // MVP constraint: We don't have the LLM api key, just showing the UI shell
            />
            <button className="absolute right-2 top-2 bottom-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 rounded-full transition-colors shadow-lg shadow-blue-500/30">
              Ask
            </button>
          </div>
        </div>
      </section>

      {/* Primary Discovery Grid */}
      <div id="discovery" className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <BusinessDiscovery />
        </div>
        <div className="lg:col-span-4 h-full">
          <CrimeDashboard />
        </div>
      </div>

      {/* Transport & Jobs */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div id="transit">
          <TransportSystem />
        </div>
        <div>
          <JobsModule />
        </div>
      </div>

      {/* Finance Transparency */}
      <div id="finance">
        <FinanceDashboard />
      </div>
    </>
  );
}
