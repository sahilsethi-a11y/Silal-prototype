"use client";

import { useState } from "react";
import { MOCK_PAYOUTS, PAYOUT_STATUS_COLORS, formatAED, formatAEDCompact, type PayoutStatus } from "@/lib/mockData";

const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
    scheduled: "Scheduled",
    processing: "Processing",
    paid: "Paid",
    failed: "Failed",
    on_hold: "On Hold",
};

// Simulating this supplier's payouts (sup-001 — Al Ain Farms LLC)
const MY_PAYOUTS = MOCK_PAYOUTS.filter((p) => p.supplierId === "sup-001");

export default function PayoutPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "history" | "settings">("overview");

    const totalEarned = MY_PAYOUTS.filter((p) => p.status === "paid").reduce((a, p) => a + p.netPayout, 0);
    const totalCommission = MY_PAYOUTS.reduce((a, p) => a + p.platformCommission, 0);
    const pending = MY_PAYOUTS.filter((p) => ["scheduled", "processing"].includes(p.status)).reduce((a, p) => a + p.netPayout, 0);
    const nextPayout = MY_PAYOUTS.find((p) => p.status === "scheduled");

    return (
        <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-brand-blue text-white rounded-2xl p-6">
                    <p className="text-sm opacity-80 mb-1">Available Balance</p>
                    <p className="text-3xl font-bold">{formatAED(totalEarned)}</p>
                    <p className="text-xs opacity-60 mt-2">All paid settlements</p>
                </div>
                <div className="bg-white rounded-2xl border border-stroke-light p-6">
                    <p className="text-sm text-gray-500 mb-1">Pending Payout</p>
                    <p className="text-2xl font-bold text-silal-gold">{formatAED(pending)}</p>
                    <p className="text-xs text-gray-400 mt-2">
                        {nextPayout ? `Next: ${nextPayout.scheduledDate}` : "No upcoming payouts"}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-stroke-light p-6">
                    <p className="text-sm text-gray-500 mb-1">Platform Commission (Total)</p>
                    <p className="text-2xl font-bold text-gray-700">{formatAEDCompact(totalCommission)}</p>
                    <p className="text-xs text-gray-400 mt-2">10% rate · VAT applied</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stroke-light">
                {(["overview", "history", "settings"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${activeTab === t ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {activeTab === "overview" && (
                <div className="space-y-4">
                    {/* Commission Breakdown */}
                    <div className="bg-white rounded-xl border border-stroke-light p-5">
                        <h3 className="font-semibold text-gray-800 mb-4">Commission Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: "Gross Revenue", value: MY_PAYOUTS.reduce((a, p) => a + p.grossRevenue, 0), color: "text-gray-800" },
                                { label: "Platform Commission (10%)", value: -totalCommission, color: "text-red-600" },
                                { label: "Net Settlement", value: MY_PAYOUTS.reduce((a, p) => a + p.netPayout, 0), color: "text-brand-blue" },
                            ].map((item) => (
                                <div key={item.label} className="bg-accent rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                    <p className={`text-xl font-bold ${item.color}`}>
                                        {item.value < 0 ? "−" : ""}{formatAEDCompact(Math.abs(item.value))}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-800">
                                <strong>Commission structure:</strong> 10% platform fee on gross revenue + 5% VAT on commission.
                                Payouts processed bi-monthly (1st and 16th of each month) via Telr to your registered bank account.
                            </p>
                        </div>
                    </div>

                    {/* Next payout countdown */}
                    {nextPayout && (
                        <div className="bg-white rounded-xl border border-stroke-light p-5">
                            <h3 className="font-semibold text-gray-800 mb-3">Next Scheduled Payout</h3>
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-silal-gold">{formatAED(nextPayout.netPayout)}</p>
                                    <p className="text-sm text-gray-500 mt-1">Period: {nextPayout.period}</p>
                                    <p className="text-sm text-gray-500">To: {nextPayout.bankAccount}</p>
                                </div>
                                <div className="text-center bg-accent rounded-xl p-4">
                                    <p className="text-xs text-gray-500">Scheduled Date</p>
                                    <p className="text-lg font-bold text-brand-blue mt-1">{nextPayout.scheduledDate}</p>
                                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PAYOUT_STATUS_COLORS[nextPayout.status]}`}>
                                        {PAYOUT_STATUS_LABELS[nextPayout.status]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "history" && (
                <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="text-left px-4 py-3">Period</th>
                                <th className="text-left px-4 py-3">Orders</th>
                                <th className="text-left px-4 py-3">Gross</th>
                                <th className="text-left px-4 py-3">Commission</th>
                                <th className="text-left px-4 py-3">Net Payout</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3">Date</th>
                                <th className="text-left px-4 py-3">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stroke-light">
                            {MY_PAYOUTS.map((p) => (
                                <tr key={p.id} className="hover:bg-accent/30">
                                    <td className="px-4 py-3 text-xs text-gray-600">{p.period}</td>
                                    <td className="px-4 py-3 text-gray-700">{p.ordersCount}</td>
                                    <td className="px-4 py-3 font-medium">{formatAED(p.grossRevenue)}</td>
                                    <td className="px-4 py-3 text-red-600 text-xs">−{formatAED(p.platformCommission)}</td>
                                    <td className="px-4 py-3 font-semibold text-brand-blue">{formatAED(p.netPayout)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYOUT_STATUS_COLORS[p.status]}`}>
                                            {PAYOUT_STATUS_LABELS[p.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{p.paidDate || p.scheduledDate}</td>
                                    <td className="px-4 py-3 text-xs text-gray-400">{p.reference || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 bg-muted flex justify-between items-center text-sm">
                        <span className="text-gray-600">Showing all settlement records</span>
                        <button className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs hover:bg-primary-hover">Download CSV</button>
                    </div>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-stroke-light p-5">
                        <h3 className="font-semibold text-gray-800 mb-4">Bank Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {[
                                { label: "Account Name", value: "Al Ain Farms LLC" },
                                { label: "Bank", value: "Abu Dhabi Commercial Bank (ADCB)" },
                                { label: "Account Number", value: "••••••••7841" },
                                { label: "IBAN", value: "AE07 0330 0000 0002 0078 41" },
                                { label: "Currency", value: "AED" },
                                { label: "Verification Status", value: "✓ Verified" },
                            ].map((f) => (
                                <div key={f.label} className="bg-accent rounded-lg p-3">
                                    <p className="text-xs text-gray-500">{f.label}</p>
                                    <p className="font-medium text-gray-800 mt-0.5">{f.value}</p>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 px-4 py-2 border border-stroke-light rounded-lg text-sm text-gray-600 hover:bg-accent transition-colors">
                            Update Bank Details
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border border-stroke-light p-5">
                        <h3 className="font-semibold text-gray-800 mb-3">Payout Notifications</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Email notification on payout processed", enabled: true },
                                { label: "SMS notification on payout scheduled", enabled: true },
                                { label: "Weekly settlement summary report", enabled: false },
                            ].map((n) => (
                                <div key={n.label} className="flex items-center justify-between py-2 border-b border-stroke-light last:border-0">
                                    <span className="text-sm text-gray-700">{n.label}</span>
                                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${n.enabled ? "bg-brand-blue" : "bg-gray-200"}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${n.enabled ? "left-5" : "left-0.5"}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
