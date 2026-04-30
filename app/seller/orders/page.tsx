"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatAED, type OrderStatus, type MockOrder } from "@/lib/mockData";

const MY_ORDERS = MOCK_ORDERS.filter((o) => o.supplierId === "sup-001");

export default function SellerOrdersPage() {
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "B2C" | "B2B">("all");
    const [orders, setOrders] = useState<MockOrder[]>(MY_ORDERS);

    const filteredOrders = orders.filter((o) => {
        const statusMatch = filter === "all" || o.status === filter;
        const typeMatch = typeFilter === "all" || o.type === typeFilter;
        return statusMatch && typeMatch;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        active: orders.filter((o) => !["delivered", "cancelled", "returned"].includes(o.status)).length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        b2b: orders.filter((o) => o.type === "B2B").length,
        b2c: orders.filter((o) => o.type === "B2C").length,
    };

    const confirmOrder = (id: string) => {
        setOrders((os) => os.map((o) => o.id === id ? { ...o, status: "confirmed" as OrderStatus } : o));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-brand-blue">Order Management</h2>
                    <p className="text-sm text-gray-500">Track product orders, RFQ requests, fulfilment status, and buyer communications</p>
                </div>
                <Link href="/seller/fulfillment" className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-primary-hover transition-colors text-center">
                    Go to Fulfillment Queue →
                </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                    { label: "Total", value: stats.total, onClick: () => setFilter("all") },
                    { label: "Pending", value: stats.pending, onClick: () => setFilter("pending") },
                    { label: "Active", value: stats.active, onClick: () => setFilter("processing") },
                    { label: "Delivered", value: stats.delivered, onClick: () => setFilter("delivered") },
                    { label: "B2B", value: stats.b2b, onClick: () => setTypeFilter("B2B") },
                    { label: "B2C", value: stats.b2c, onClick: () => setTypeFilter("B2C") },
                ].map((s) => (
                    <button
                        key={s.label}
                        onClick={s.onClick}
                        className="bg-white rounded-xl border border-stroke-light p-3 text-center hover:border-brand-blue transition-colors"
                    >
                        <p className="text-xl font-bold text-brand-blue">{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                <div className="flex gap-1 border border-stroke-light rounded-lg p-1 bg-white">
                    {(["all", "B2C", "B2B"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-3 py-1 rounded text-xs transition-colors ${typeFilter === t ? "bg-brand-blue text-white" : "text-gray-600 hover:bg-accent"}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1 flex-wrap">
                    {(["all", "pending", "confirmed", "processing", "packed", "in_transit", "delivered", "cancelled"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filter === s ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-600 border-stroke-light"}`}
                        >
                            {s === "all" ? "All" : ORDER_STATUS_LABELS[s]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders table */}
            <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="text-left px-4 py-3">Order</th>
                            <th className="text-left px-4 py-3">Buyer</th>
                            <th className="text-left px-4 py-3">Items</th>
                            <th className="text-left px-4 py-3">Amount</th>
                            <th className="text-left px-4 py-3">Type</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">ETA</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke-light">
                        {filteredOrders.map((o) => (
                            <tr key={o.id} className={`hover:bg-accent/30 ${o.status === "pending" ? "bg-yellow-50/50" : ""}`}>
                                <td className="px-4 py-3">
                                    <p className="font-mono text-xs text-brand-blue">{o.orderNumber}</p>
                                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-AE")}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800">{o.buyerName}</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{o.deliveryAddress.split(",")[0]}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-gray-700 text-xs">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</p>
                                </td>
                                <td className="px-4 py-3 font-semibold text-brand-blue">{formatAED(o.totalAmount)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.type === "B2B" ? "bg-brand-blue/10 text-brand-blue" : "bg-silal-leaf/10 text-silal-leaf"}`}>
                                        {o.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>
                                        {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">{o.estimatedDelivery || "—"}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        {o.status === "pending" && (
                                            <button
                                                onClick={() => confirmOrder(o.id)}
                                                className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 hover:bg-green-200 font-medium"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {["confirmed", "processing", "packed"].includes(o.status) && (
                                            <Link href="/seller/fulfillment" className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                Fulfill
                                            </Link>
                                        )}
                                        {o.trackingNumber && (
                                            <Link href={`/buyer/track/${o.id}`} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
                                                Track
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="py-12 text-center text-gray-400 text-sm">No orders match this filter.</div>
                )}
            </div>
        </div>
    );
}
