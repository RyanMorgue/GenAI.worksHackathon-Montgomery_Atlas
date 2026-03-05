'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function FinanceDashboard() {
    const expenditureData = [
        { department: 'Public Safety', amount: 12000000 },
        { department: 'Public Works', amount: 8500000 },
        { department: 'Parks & Rec', amount: 3200000 },
        { department: 'Administration', amount: 4500000 },
        { department: 'Sanitation', amount: 5100000 },
    ];

    const revenueData = [
        { name: 'Property Tax', value: 45 },
        { name: 'Sales Tax', value: 30 },
        { name: 'Grants', value: 15 },
        { name: 'Fees & Fines', value: 10 },
    ];
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(1)}M`;

    return (
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <header className="p-6 border-b border-slate-100 bg-emerald-50">
                <h2 className="text-2xl font-bold text-slate-800">Montgomery Open Finance</h2>
                <p className="text-slate-500 text-sm mt-1">Transparency in City Expenditures & Revenue</p>
            </header>

            <div className="p-6 grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-700">Department Expenditures (YTD)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expenditureData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" tickFormatter={formatCurrency} tick={{ fill: '#64748b' }} />
                                <YAxis dataKey="department" type="category" tick={{ fill: '#475569', fontSize: 12 }} width={100} />
                                <Tooltip formatter={(val: any) => `$${(Number(val) / 1000000).toFixed(1)}M`} cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-700">Revenue Sources (%)</h3>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={revenueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {revenueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val: any) => `${val}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {revenueData.map((entry, idx) => (
                            <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Recent Vendor Payments</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Mar 05, 2026</p>
                        <h4 className="font-bold text-slate-800 line-clamp-1">Vulcan Materials Co.</h4>
                        <p className="text-emerald-600 font-bold mt-2">$45,230.00</p>
                        <p className="text-xs text-slate-500 uppercase mt-1">Infrastructure</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Mar 02, 2026</p>
                        <h4 className="font-bold text-slate-800 line-clamp-1">Dell Technologies</h4>
                        <p className="text-emerald-600 font-bold mt-2">$12,400.00</p>
                        <p className="text-xs text-slate-500 uppercase mt-1">IT Equipment</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Feb 28, 2026</p>
                        <h4 className="font-bold text-slate-800 line-clamp-1">Waste Management Inc</h4>
                        <p className="text-emerald-600 font-bold mt-2">$89,000.00</p>
                        <p className="text-xs text-slate-500 uppercase mt-1">Sanitation</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
