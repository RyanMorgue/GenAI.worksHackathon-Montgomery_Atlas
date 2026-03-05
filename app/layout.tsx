import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI City Copilot | Montgomery Dash',
  description: ' Montgomery Smart City OS powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <h1 className="font-bold text-xl tracking-tight text-slate-800">Montgomery <span className="text-blue-600 font-extrabold">OS</span></h1>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <a href="#copilot" className="hover:text-blue-600 transition-colors">Copilot</a>
              <a href="#discovery" className="hover:text-blue-600 transition-colors">Discovery</a>
              <a href="#transit" className="hover:text-blue-600 transition-colors">Transit</a>
              <a href="#finance" className="hover:text-blue-600 transition-colors">Transparency</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {children}
        </main>

        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <p>&copy; 2026 AI City Copilot — Montgomery Smart City Initiative</p>
            <p className="mt-2 text-xs opacity-60">Data sourced from Montgomery Open Data & Live APIs. Secure endpoint integration compliant.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
