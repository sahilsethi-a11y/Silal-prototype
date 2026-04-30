import { MONTHLY_REVENUE, CATEGORY_BREAKDOWN, MOCK_VENDORS, MOCK_ORDERS, formatAEDCompact } from "@/lib/mockData";

export default function AnalyticsPage() {
    const totalRevenue = MONTHLY_REVENUE.reduce((a, m) => a + m.total, 0);
    const totalB2C = MONTHLY_REVENUE.reduce((a, m) => a + m.b2c, 0);
    const totalB2B = MONTHLY_REVENUE.reduce((a, m) => a + m.b2b, 0);
    const totalOrders = MOCK_ORDERS.length;
    const approvedVendors = MOCK_VENDORS.filter((v) => v.kycStatus === "approved").length;
    const maxMonthRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.total));
    const maxCatRevenue = Math.max(...CATEGORY_BREAKDOWN.map((c) => c.revenue));

    const userGrowth = [
        { month: "Nov", buyers: 840, suppliers: 12 },
        { month: "Dec", buyers: 1240, suppliers: 18 },
        { month: "Jan", buyers: 1680, suppliers: 22 },
        { month: "Feb", buyers: 2210, suppliers: 28 },
        { month: "Mar", buyers: 2940, suppliers: 34 },
        { month: "Apr", buyers: 3810, suppliers: 40 },
    ];
    const maxBuyers = Math.max(...userGrowth.map((u) => u.buyers));

    return (
        <div className="space-y-6">
            {/* Top KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Total GMV (6M)" value={formatAEDCompact(totalRevenue)} sub="+19.4% MoM" subColor="text-green-600" />
                <KpiCard title="B2C Revenue" value={formatAEDCompact(totalB2C)} sub="26.5% of total" subColor="text-silal-leaf" />
                <KpiCard title="B2B Revenue" value={formatAEDCompact(totalB2B)} sub="73.5% of total" subColor="text-brand-blue" />
                <KpiCard title="Active Suppliers" value={String(approvedVendors)} sub={`of ${MOCK_VENDORS.length} registered`} subColor="text-gray-500" />
            </div>

            {/* Revenue Trend */}
            <div className="bg-white rounded-xl border border-stroke-light p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-800">Platform Revenue Trend</h3>
                        <p className="text-sm text-gray-500">Monthly GMV — November 2025 to April 2026</p>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-silal-leaf/80 inline-block" /> B2C</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-brand-blue/80 inline-block" /> B2B</span>
                    </div>
                </div>
                <div className="flex items-end gap-4 h-48">
                    {MONTHLY_REVENUE.map((m) => {
                        const totalH = (m.total / maxMonthRevenue) * 100;
                        const b2cH = (m.b2c / m.total) * totalH;
                        const b2bH = totalH - b2cH;
                        return (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col items-stretch h-40 justify-end">
                                    <div className="rounded-t-sm" style={{ height: `${b2bH * 1.6}%`, backgroundColor: "#174f2a" }} title={`B2B: ${formatAEDCompact(m.b2b)}`} />
                                    <div style={{ height: `${b2cH * 1.6}%`, backgroundColor: "#75a843" }} title={`B2C: ${formatAEDCompact(m.b2c)}`} />
                                </div>
                                <span className="text-xs text-gray-500">{m.month}</span>
                                <span className="text-xs font-medium text-gray-700">{formatAEDCompact(m.total)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="bg-white rounded-xl border border-stroke-light p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Revenue by Category</h3>
                    <div className="space-y-3">
                        {CATEGORY_BREAKDOWN.map((c) => (
                            <div key={c.category}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 truncate pr-2">{c.category}</span>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-xs font-medium ${c.growth > 20 ? "text-green-600" : "text-gray-500"}`}>+{c.growth}%</span>
                                        <span className="font-medium text-gray-800">{formatAEDCompact(c.revenue)}</span>
                                    </div>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${(c.revenue / maxCatRevenue) * 100}%`, backgroundColor: c.color }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{c.orders.toLocaleString()} orders</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Growth */}
                <div className="bg-white rounded-xl border border-stroke-light p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">User Growth</h3>
                    <div className="flex items-end gap-3 h-40 mb-2">
                        {userGrowth.map((u) => (
                            <div key={u.month} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex items-end justify-center gap-0.5 h-32">
                                    <div className="w-5 rounded-t-sm bg-silal-leaf/80" style={{ height: `${(u.buyers / maxBuyers) * 100}%` }} title={`Buyers: ${u.buyers}`} />
                                    <div className="w-2 rounded-t-sm bg-silal-gold/80" style={{ height: `${(u.suppliers / 40) * 100}%` }} title={`Suppliers: ${u.suppliers}`} />
                                </div>
                                <span className="text-xs text-gray-500">{u.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-silal-leaf/80 inline-block" /> Buyers</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-silal-gold/80 inline-block" /> Suppliers</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-accent rounded-lg p-3">
                            <p className="text-xl font-semibold text-brand-blue">3,810</p>
                            <p className="text-xs text-gray-500">Registered buyers</p>
                        </div>
                        <div className="bg-accent rounded-lg p-3">
                            <p className="text-xl font-semibold text-silal-gold">+353%</p>
                            <p className="text-xs text-gray-500">Buyer growth (6M)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Funnel */}
            <div className="bg-white rounded-xl border border-stroke-light p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Conversion Funnel (April 2026)</h3>
                <div className="space-y-2">
                    {[
                        { stage: "Product Page Views", count: 84320, color: "bg-brand-blue" },
                        { stage: "Add to Cart / Request Quote", count: 12440, color: "bg-silal-leaf" },
                        { stage: "Checkout Initiated", count: 5820, color: "bg-silal-gold" },
                        { stage: "Order Placed", count: 4180, color: "bg-orange-500" },
                        { stage: "Order Delivered", count: 3890, color: "bg-green-500" },
                    ].map((f, i, arr) => {
                        const maxF = arr[0].count;
                        return (
                            <div key={f.stage} className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 w-44 flex-shrink-0">{f.stage}</span>
                                <div className="flex-1 h-7 rounded-lg bg-gray-50 overflow-hidden">
                                    <div className={`h-full rounded-lg flex items-center px-2 text-white text-xs font-medium ${f.color}`} style={{ width: `${(f.count / maxF) * 100}%` }}>
                                        {f.count.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 w-12 text-right">{i === 0 ? "100%" : `${((f.count / arr[0].count) * 100).toFixed(1)}%`}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Services Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: "AI Auto-Tagging", value: "1,248 products tagged", sub: "89.4% accuracy", icon: "🤖" },
                    { title: "Smart Search Queries", value: "38,420 this month", sub: "4.2% improvement in CTR", icon: "🔍" },
                    { title: "Chatbot Resolutions", value: "2,184 tickets resolved", sub: "67% without human escalation", icon: "💬" },
                ].map((a) => (
                    <div key={a.title} className="bg-white rounded-xl border border-stroke-light p-5">
                        <div className="text-2xl mb-2">{a.icon}</div>
                        <p className="font-semibold text-gray-800">{a.title}</p>
                        <p className="text-lg font-bold text-brand-blue mt-1">{a.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function KpiCard({ title, value, sub, subColor }: { title: string; value: string; sub: string; subColor: string }) {
    return (
        <div className="bg-white rounded-xl border border-stroke-light p-5">
            <p className="text-2xl font-bold text-brand-blue">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{title}</p>
            <p className={`text-xs mt-0.5 font-medium ${subColor}`}>{sub}</p>
        </div>
    );
}
