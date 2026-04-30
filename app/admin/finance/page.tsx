"use client";

import { useState } from "react";
import {
    MOCK_PAYOUTS,
    MOCK_DISPUTES,
    MONTHLY_REVENUE,
    formatAED,
    formatAEDCompact,
    PAYOUT_STATUS_COLORS,
    type PayoutStatus,
} from "@/lib/mockData";

const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
    scheduled: "Scheduled",
    processing: "Processing",
    paid: "Paid",
    failed: "Failed",
    on_hold: "On Hold",
};

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<"payouts" | "transactions" | "disputes">("payouts");
    const [payoutFilter, setPayoutFilter] = useState<PayoutStatus | "all">("all");
    const [payouts, setPayouts] = useState(MOCK_PAYOUTS);

    const totalGMV = MONTHLY_REVENUE.reduce((a, m) => a + m.total, 0);
    const totalCommission = MOCK_PAYOUTS.reduce((a, p) => a + p.platformCommission, 0);
    const totalPaid = MOCK_PAYOUTS.filter((p) => p.status === "paid").reduce((a, p) => a + p.netPayout, 0);
    const pendingPayouts = MOCK_PAYOUTS.filter((p) => ["scheduled", "processing"].includes(p.status)).reduce((a, p) => a + p.netPayout, 0);

    const filteredPayouts = payouts.filter((p) => payoutFilter === "all" || p.status === payoutFilter);

    const processPayout = (id: string) => {
        setPayouts((ps) => ps.map((p) => p.id === id ? { ...p, status: "processing" as PayoutStatus } : p));
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard title="Total GMV (6 months)" value={formatAEDCompact(totalGMV)} color="text-brand-blue" icon="📊" />
                <SummaryCard title="Platform Commission" value={formatAEDCompact(totalCommission)} color="text-silal-gold" icon="💰" />
                <SummaryCard title="Paid to Suppliers" value={formatAEDCompact(totalPaid)} color="text-green-600" icon="✅" />
                <SummaryCard title="Pending Payouts" value={formatAEDCompact(pendingPayouts)} color="text-orange-600" icon="⏳" />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-stroke-light p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Monthly Revenue — B2C vs B2B (AED)</h3>
                <div className="flex items-end gap-3 h-40">
                    {MONTHLY_REVENUE.map((m) => {
                        const maxTotal = Math.max(...MONTHLY_REVENUE.map((r) => r.total));
                        const b2cH = (m.b2c / maxTotal) * 100;
                        const b2bH = (m.b2b / maxTotal) * 100;
                        return (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex items-end gap-0.5 h-32">
                                    <div className="flex-1 rounded-t-sm bg-silal-leaf/80 transition-all" style={{ height: `${b2cH}%` }} title={`B2C: ${formatAEDCompact(m.b2c)}`} />
                                    <div className="flex-1 rounded-t-sm bg-brand-blue/80 transition-all" style={{ height: `${b2bH}%` }} title={`B2B: ${formatAEDCompact(m.b2b)}`} />
                                </div>
                                <span className="text-xs text-gray-500">{m.month}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-silal-leaf/80 inline-block" /> B2C Retail</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-brand-blue/80 inline-block" /> B2B Wholesale</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stroke-light">
                {(["payouts", "transactions", "disputes"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${activeTab === t ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Payouts tab */}
            {activeTab === "payouts" && (
                <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        {(["all", "scheduled", "processing", "paid", "on_hold", "failed"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setPayoutFilter(s)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-colors capitalize ${payoutFilter === s ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-600 border-stroke-light"}`}
                            >
                                {s === "all" ? "All" : PAYOUT_STATUS_LABELS[s as PayoutStatus]}
                            </button>
                        ))}
                    </div>
                    <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="text-left px-4 py-3">Supplier</th>
                                    <th className="text-left px-4 py-3">Period</th>
                                    <th className="text-left px-4 py-3">Gross Revenue</th>
                                    <th className="text-left px-4 py-3">Commission (10%)</th>
                                    <th className="text-left px-4 py-3">Net Payout</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-left px-4 py-3">Scheduled</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stroke-light">
                                {filteredPayouts.map((p) => (
                                    <tr key={p.id} className="hover:bg-accent/30">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800">{p.supplierName}</p>
                                            <p className="text-xs text-gray-400">{p.bankAccount}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">{p.period}</td>
                                        <td className="px-4 py-3 font-medium">{formatAED(p.grossRevenue)}</td>
                                        <td className="px-4 py-3 text-red-600 text-xs">−{formatAED(p.platformCommission)}</td>
                                        <td className="px-4 py-3 font-semibold text-brand-blue">{formatAED(p.netPayout)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYOUT_STATUS_COLORS[p.status]}`}>
                                                {PAYOUT_STATUS_LABELS[p.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{p.scheduledDate}</td>
                                        <td className="px-4 py-3">
                                            {p.status === "scheduled" && (
                                                <button onClick={() => processPayout(p.id)} className="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Process</button>
                                            )}
                                            {p.status === "on_hold" && (
                                                <button className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 hover:bg-orange-200">Review</button>
                                            )}
                                            {p.status === "paid" && p.reference && (
                                                <span className="text-xs text-gray-400">{p.reference}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Transactions tab */}
            {activeTab === "transactions" && (
                <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                    <div className="p-4 border-b border-stroke-light flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Telr Payment Transactions</h3>
                        <button className="px-3 py-1.5 bg-accent text-brand-blue rounded-lg text-xs font-medium hover:bg-muted">Export CSV</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="text-left px-4 py-3">Transaction ID</th>
                                <th className="text-left px-4 py-3">Order</th>
                                <th className="text-left px-4 py-3">Buyer</th>
                                <th className="text-left px-4 py-3">Amount</th>
                                <th className="text-left px-4 py-3">VAT</th>
                                <th className="text-left px-4 py-3">Method</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stroke-light">
                            {[
                                { id: "TLR-TX-88821", order: "SL-2026-10041", buyer: "Mohammed Al Rashid", amount: 425, vat: 21.25, method: "Visa", status: "Captured", date: "2026-04-28" },
                                { id: "TLR-TX-88822", order: "SL-2026-10042", buyer: "Sara Johnson", amount: 9200, vat: 460, method: "Wire", status: "Captured", date: "2026-04-27" },
                                { id: "TLR-TX-88823", order: "SL-2026-10043", buyer: "Ahmed Al Mansoori", amount: 2060, vat: 103, method: "Wire", status: "Settled", date: "2026-04-24" },
                                { id: "TLR-TX-88824", order: "SL-2026-10044", buyer: "Fatima Al Zaabi", amount: 1299, vat: 64.95, method: "MasterCard", status: "Captured", date: "2026-04-29" },
                                { id: "TLR-TX-88825", order: "SL-2026-10047", buyer: "David Chen", amount: 15000, vat: 750, method: "Wire", status: "Refunded", date: "2026-04-22" },
                            ].map((tx) => (
                                <tr key={tx.id} className="hover:bg-accent/30">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{tx.id}</td>
                                    <td className="px-4 py-3 text-brand-blue text-xs">{tx.order}</td>
                                    <td className="px-4 py-3 text-gray-700">{tx.buyer}</td>
                                    <td className="px-4 py-3 font-medium">{formatAED(tx.amount)}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{formatAED(tx.vat)}</td>
                                    <td className="px-4 py-3 text-gray-600 text-xs">{tx.method}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.status === "Settled" || tx.status === "Captured" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{tx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Disputes tab */}
            {activeTab === "disputes" && (
                <div className="space-y-3">
                    {MOCK_DISPUTES.map((d) => (
                        <div key={d.id} className="bg-white rounded-xl border border-stroke-light p-5">
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-800">{d.orderNumber}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === "resolved" ? "bg-green-100 text-green-700" : d.status === "escalated" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {d.status.replace("_", " ")}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 capitalize">{d.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{d.description}</p>
                                    <p className="text-xs text-gray-400">{d.buyerName} vs {d.supplierName} · {d.raisedDate}</p>
                                    {d.resolution && (
                                        <p className="mt-2 text-sm text-green-700 bg-green-50 rounded px-3 py-2">{d.resolution}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-brand-blue">{formatAED(d.amount)}</p>
                                    {d.status !== "resolved" && (
                                        <div className="flex gap-2 mt-2">
                                            <button className="px-3 py-1.5 text-xs rounded-lg bg-brand-blue text-white hover:bg-primary-hover">Resolve</button>
                                            <button className="px-3 py-1.5 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Escalate</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SummaryCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: string }) {
    return (
        <div className="bg-white rounded-xl border border-stroke-light p-5 flex items-center gap-3">
            <div className="text-2xl">{icon}</div>
            <div>
                <p className={`text-xl font-semibold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{title}</p>
            </div>
        </div>
    );
}
