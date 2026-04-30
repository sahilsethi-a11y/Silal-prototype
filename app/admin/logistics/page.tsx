"use client";

import { useState } from "react";
import { MOCK_SHIPMENTS, MOCK_DISPUTES, type MockShipment } from "@/lib/mockData";

type ShipmentStatus = MockShipment["status"];
const STATUS_COLORS: Record<ShipmentStatus, string> = {
    booked: "bg-gray-100 text-gray-600",
    picked_up: "bg-blue-100 text-blue-700",
    in_transit: "bg-orange-100 text-orange-700",
    out_for_delivery: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    exception: "bg-red-100 text-red-700",
    returned: "bg-yellow-100 text-yellow-700",
};

const STATUS_LABELS: Record<ShipmentStatus, string> = {
    booked: "Booked",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    exception: "Exception",
    returned: "Returned",
};

const CARRIERS = [
    { name: "Aramex UAE", status: "Active", activeShipments: 2, slaBreaches: 0, onTimeRate: 98.2 },
    { name: "DHL Express", status: "Active", activeShipments: 1, slaBreaches: 0, onTimeRate: 99.1 },
    { name: "Quill Logistics", status: "Active", activeShipments: 0, slaBreaches: 0, onTimeRate: 97.4 },
    { name: "Fetchr", status: "Active", activeShipments: 1, slaBreaches: 1, onTimeRate: 91.2 },
];

export default function LogisticsPage() {
    const [activeTab, setActiveTab] = useState<"shipments" | "carriers" | "returns">("shipments");
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");

    const filtered = MOCK_SHIPMENTS.filter((s) => statusFilter === "all" || s.status === statusFilter);

    const exceptions = MOCK_SHIPMENTS.filter((s) => s.status === "exception").length;
    const slaAtRisk = MOCK_SHIPMENTS.filter((s) => s.elapsedHours / s.slaHours > 0.8 && s.status !== "delivered").length;
    const delivered = MOCK_SHIPMENTS.filter((s) => s.status === "delivered").length;
    const active = MOCK_SHIPMENTS.filter((s) => !["delivered", "returned"].includes(s.status)).length;

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="Active Shipments" value={active} color="text-brand-blue" />
                <KpiCard label="Delivered (All Time)" value={delivered} color="text-green-600" />
                <KpiCard label="SLA At Risk" value={slaAtRisk} color="text-orange-600" />
                <KpiCard label="Exceptions" value={exceptions} color="text-red-600" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stroke-light">
                {(["shipments", "carriers", "returns"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${activeTab === t ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {activeTab === "shipments" && (
                <div className="space-y-4">
                    {/* Filter row */}
                    <div className="flex gap-2 flex-wrap">
                        {(["all", "booked", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "returned"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${statusFilter === s ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-600 border-stroke-light"}`}
                            >
                                {s === "all" ? "All" : STATUS_LABELS[s]}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {filtered.map((s) => {
                            const slaPercent = Math.min((s.elapsedHours / s.slaHours) * 100, 100);
                            const slaColor = slaPercent >= 100 ? "bg-red-400" : slaPercent >= 80 ? "bg-orange-400" : "bg-silal-leaf";
                            return (
                                <div key={s.id} className={`bg-white rounded-xl border p-4 ${s.status === "exception" ? "border-red-300" : "border-stroke-light"}`}>
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-semibold text-gray-800">{s.orderNumber}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">{s.type}</span>
                                                {s.status === "exception" && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">⚠ Needs Action</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{s.lastEvent}</p>
                                            <p className="text-xs text-gray-400">{s.origin} → {s.destination}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                                                <span>{s.carrier}</span>
                                                <span className="font-mono">{s.trackingNumber}</span>
                                                <span>ETA: {s.estimatedDelivery}</span>
                                                <span>{s.weight}</span>
                                            </div>
                                        </div>
                                        <div className="min-w-[140px]">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>SLA</span>
                                                <span>{s.elapsedHours}h / {s.slaHours}h</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div className={`h-full rounded-full ${slaColor}`} style={{ width: `${slaPercent}%` }} />
                                            </div>
                                            {s.status === "exception" && (
                                                <button className="mt-2 w-full px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Escalate</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === "carriers" && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">3PL Carrier Partners</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {CARRIERS.map((c) => (
                            <div key={c.name} className="bg-white rounded-xl border border-stroke-light p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{c.name}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.status}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-brand-blue">{c.onTimeRate}%</p>
                                        <p className="text-xs text-gray-500">On-time rate</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                                    <div className="bg-accent rounded-lg p-3">
                                        <p className="text-lg font-semibold text-brand-blue">{c.activeShipments}</p>
                                        <p className="text-xs text-gray-500">Active shipments</p>
                                    </div>
                                    <div className={`rounded-lg p-3 ${c.slaBreaches > 0 ? "bg-red-50" : "bg-accent"}`}>
                                        <p className={`text-lg font-semibold ${c.slaBreaches > 0 ? "text-red-600" : "text-brand-blue"}`}>{c.slaBreaches}</p>
                                        <p className="text-xs text-gray-500">SLA breaches</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>On-time performance</span>
                                        <span>{c.onTimeRate}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-silal-leaf rounded-full" style={{ width: `${c.onTimeRate}%` }} />
                                    </div>
                                </div>
                                <button className="mt-3 w-full py-2 text-sm border border-stroke-light rounded-lg text-gray-600 hover:bg-accent transition-colors">View All Shipments</button>
                            </div>
                        ))}
                    </div>

                    {/* Integration Status */}
                    <div className="bg-white rounded-xl border border-stroke-light p-5">
                        <h4 className="font-semibold text-gray-800 mb-3">3PL API Integration Status</h4>
                        <div className="space-y-2">
                            {[
                                { label: "Aramex API", status: "Connected", lastSync: "2 min ago" },
                                { label: "DHL Express API", status: "Connected", lastSync: "5 min ago" },
                                { label: "Fetchr API", status: "Connected", lastSync: "1 min ago" },
                                { label: "Quill Logistics API", status: "Connected", lastSync: "3 min ago" },
                                { label: "Webhook — Order Created", status: "Active", lastSync: "Real-time" },
                                { label: "Webhook — Status Update", status: "Active", lastSync: "Real-time" },
                            ].map((i) => (
                                <div key={i.label} className="flex items-center justify-between py-2 border-b border-stroke-light last:border-0">
                                    <span className="text-sm text-gray-700">{i.label}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400">{i.lastSync}</span>
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-xs text-green-600">{i.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "returns" && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Returns & Disputes</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <KpiCard label="Open Returns" value={2} color="text-orange-600" />
                        <KpiCard label="Resolved Returns" value={1} color="text-green-600" />
                        <KpiCard label="Avg Resolution Time" value={"1.4d"} color="text-brand-blue" />
                    </div>
                    {MOCK_DISPUTES.map((d) => (
                        <div key={d.id} className={`bg-white rounded-xl border p-5 ${d.status === "escalated" ? "border-red-300" : "border-stroke-light"}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-semibold text-gray-800">{d.orderNumber}</h4>
                                    <p className="text-xs text-gray-500">{d.buyerName} · {d.raisedDate}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === "resolved" ? "bg-green-100 text-green-700" : d.status === "escalated" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {d.status.replace("_", " ")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{d.description}</p>
                            {d.resolution && (
                                <p className="mt-2 text-sm text-green-700 bg-green-50 rounded px-3 py-2">{d.resolution}</p>
                            )}
                            {d.status !== "resolved" && (
                                <div className="flex gap-2 mt-3">
                                    <button className="px-3 py-1.5 text-xs rounded-lg bg-brand-blue text-white hover:bg-primary-hover">Resolve</button>
                                    <button className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">Contact Buyer</button>
                                    <button className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">Contact Supplier</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function KpiCard({ label, value, color }: { label: string; value: number | string; color: string }) {
    return (
        <div className="bg-white rounded-xl border border-stroke-light p-4">
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
    );
}
