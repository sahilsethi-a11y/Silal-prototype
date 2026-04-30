import { SELLER_WEEKLY_SALES, SELLER_TOP_PRODUCTS, MONTHLY_REVENUE, formatAEDCompact, formatAED } from "@/lib/mockData";

export default function SellerAnalyticsPage() {
    const maxDaily = Math.max(...SELLER_WEEKLY_SALES.map((d) => d.b2c + d.b2b));
    const totalWeekB2C = SELLER_WEEKLY_SALES.reduce((a, d) => a + d.b2c, 0);
    const totalWeekB2B = SELLER_WEEKLY_SALES.reduce((a, d) => a + d.b2b, 0);
    const totalWeek = totalWeekB2C + totalWeekB2B;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <KpiCard title="This Week Revenue" value={formatAEDCompact(totalWeek)} sub="+12.4% vs last week" subColor="text-green-600" />
                <KpiCard title="B2C Sales" value={formatAEDCompact(totalWeekB2C)} sub="28% of total" subColor="text-silal-leaf" />
                <KpiCard title="B2B Sales" value={formatAEDCompact(totalWeekB2B)} sub="72% of total" subColor="text-brand-blue" />
                <KpiCard title="Avg Order Value" value="AED 892" sub="+8.1% vs last week" subColor="text-green-600" />
            </div>

            {/* Daily Sales Chart */}
            <div className="bg-white rounded-xl border border-stroke-light p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-800">Daily Sales — This Week</h3>
                        <p className="text-sm text-gray-500">B2C Retail vs B2B Wholesale (AED)</p>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-silal-leaf/80 inline-block" /> B2C</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-brand-blue/80 inline-block" /> B2B</span>
                    </div>
                </div>
                <div className="flex items-end gap-4 h-40">
                    {SELLER_WEEKLY_SALES.map((d) => {
                        const total = d.b2c + d.b2b;
                        const totalH = (total / maxDaily) * 100;
                        const b2cH = (d.b2c / total) * totalH;
                        const b2bH = totalH - b2cH;
                        return (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col items-stretch h-36 justify-end">
                                    <div className="rounded-t-sm" style={{ height: `${b2bH}%`, backgroundColor: "#174f2a" }} />
                                    <div style={{ height: `${b2cH}%`, backgroundColor: "#75a843" }} />
                                </div>
                                <span className="text-xs text-gray-500">{d.day}</span>
                                <span className="text-xs font-medium text-gray-700">{formatAEDCompact(total)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-stroke-light p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Top Performing Products</h3>
                    <div className="space-y-3">
                        {SELLER_TOP_PRODUCTS.map((p, i) => (
                            <div key={p.sku} className="flex items-center gap-3 py-2 border-b border-stroke-light last:border-0">
                                <span className="text-lg font-bold text-gray-200 w-6">#{i + 1}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                    <p className="text-xs text-gray-400">{p.sku} · {p.sold} units sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-brand-blue">{formatAEDCompact(p.revenue)}</p>
                                    <span className={`text-xs font-medium ${p.trend === "up" ? "text-green-600" : p.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                                        {p.trend === "up" ? "▲" : p.trend === "down" ? "▼" : "—"} {p.trend}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-stroke-light p-5">
                        <h3 className="font-semibold text-gray-800 mb-3">Performance vs Benchmark</h3>
                        <div className="space-y-3">
                            {[
                                { metric: "Order Fulfillment Rate", your: 94.2, benchmark: 90, unit: "%" },
                                { metric: "On-Time Dispatch", your: 88.7, benchmark: 85, unit: "%" },
                                { metric: "Buyer Rating", your: 4.8, benchmark: 4.5, unit: "/5" },
                                { metric: "Return Rate", your: 2.1, benchmark: 5, unit: "%", lowerIsBetter: true },
                            ].map((m) => {
                                const isGood = m.lowerIsBetter ? m.your < m.benchmark : m.your >= m.benchmark;
                                return (
                                    <div key={m.metric}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{m.metric}</span>
                                            <span className={`font-semibold ${isGood ? "text-green-600" : "text-orange-600"}`}>
                                                {m.your}{m.unit}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden relative">
                                            <div className="h-full bg-silal-leaf rounded-full" style={{ width: `${Math.min((m.your / (m.lowerIsBetter ? m.benchmark * 2 : m.benchmark * 1.2)) * 100, 100)}%` }} />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">Benchmark: {m.benchmark}{m.unit}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-stroke-light p-5">
                        <h3 className="font-semibold text-gray-800 mb-3">Stock Health</h3>
                        <div className="space-y-2">
                            {SELLER_TOP_PRODUCTS.map((p) => (
                                <div key={p.sku} className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 w-40 truncate">{p.name.split("(")[0].trim()}</span>
                                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${p.stock < 80 ? "bg-red-400" : p.stock < 150 ? "bg-yellow-400" : "bg-silal-leaf"}`}
                                            style={{ width: `${Math.min((p.stock / 500) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 w-12 text-right">{p.stock} units</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            <span className="text-red-500">●</span> Low &nbsp;
                            <span className="text-yellow-500">●</span> Medium &nbsp;
                            <span className="text-silal-leaf">●</span> Good
                        </p>
                    </div>
                </div>
            </div>

            {/* Monthly trend */}
            <div className="bg-white rounded-xl border border-stroke-light p-6">
                <h3 className="font-semibold text-gray-800 mb-4">6-Month Revenue Trend (Platform-wide Reference)</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {MONTHLY_REVENUE.map((m, i) => {
                        const prev = i > 0 ? MONTHLY_REVENUE[i - 1].total : m.total;
                        const growth = (((m.total - prev) / prev) * 100).toFixed(1);
                        return (
                            <div key={m.month} className="bg-accent rounded-xl p-3 text-center">
                                <p className="text-xs text-gray-500">{m.month}</p>
                                <p className="text-base font-bold text-brand-blue mt-1">{formatAEDCompact(m.total)}</p>
                                {i > 0 && (
                                    <p className={`text-xs mt-1 ${Number(growth) >= 0 ? "text-green-600" : "text-red-500"}`}>
                                        {Number(growth) >= 0 ? "+" : ""}{growth}%
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, sub, subColor }: { title: string; value: string; sub: string; subColor: string }) {
    return (
        <div className="bg-white rounded-xl border border-stroke-light p-5">
            <p className="text-xl font-bold text-brand-blue">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{title}</p>
            <p className={`text-xs font-medium mt-0.5 ${subColor}`}>{sub}</p>
        </div>
    );
}
