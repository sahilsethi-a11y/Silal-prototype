"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatAED, type OrderStatus } from "@/lib/mockData";

// Simulating buyer's orders (Mohammed Al Rashid + Fatima + Nour)
const MY_BUYER_ORDERS = MOCK_ORDERS.filter((o) => ["ord-001", "ord-004", "ord-006", "ord-003"].includes(o.id));

const ORDER_TIMELINE: Record<OrderStatus, string[]> = {
    pending: ["Order Placed"],
    confirmed: ["Order Placed", "Confirmed"],
    processing: ["Order Placed", "Confirmed", "Processing"],
    packed: ["Order Placed", "Confirmed", "Processing", "Packed"],
    dispatched: ["Order Placed", "Confirmed", "Processing", "Packed", "Dispatched"],
    in_transit: ["Order Placed", "Confirmed", "Processing", "Packed", "Dispatched", "In Transit"],
    delivered: ["Order Placed", "Confirmed", "Processing", "Packed", "Dispatched", "In Transit", "Delivered"],
    cancelled: ["Order Placed", "Cancelled"],
    returned: ["Order Placed", "Confirmed", "Delivered", "Return Requested", "Returned"],
};

export default function BuyerOrdersPage() {
    const [filter, setFilter] = useState<OrderStatus | "all">("all");
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const filtered = MY_BUYER_ORDERS.filter((o) => filter === "all" || o.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start mt-2">
                <div>
                    <h2 className="text-xl font-semibold text-brand-blue">My Orders</h2>
                    <p className="text-sm text-gray-500">Track all your B2C purchases and B2B orders</p>
                </div>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Total Orders", value: MY_BUYER_ORDERS.length, status: "all" as const },
                    { label: "Active", value: MY_BUYER_ORDERS.filter((o) => !["delivered", "cancelled"].includes(o.status)).length, status: "in_transit" as OrderStatus },
                    { label: "Delivered", value: MY_BUYER_ORDERS.filter((o) => o.status === "delivered").length, status: "delivered" as OrderStatus },
                    { label: "Pending", value: MY_BUYER_ORDERS.filter((o) => o.status === "pending").length, status: "pending" as OrderStatus },
                ].map((s) => (
                    <button
                        key={s.label}
                        onClick={() => setFilter(s.status)}
                        className={`rounded-xl border p-3 text-left transition-shadow hover:shadow-sm ${filter === s.status ? "border-brand-blue bg-accent" : "border-stroke-light bg-white"}`}
                    >
                        <p className="text-2xl font-bold text-brand-blue">{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </button>
                ))}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
                {(["all", "pending", "confirmed", "processing", "packed", "in_transit", "delivered", "cancelled"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filter === s ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-600 border-stroke-light"}`}
                    >
                        {s === "all" ? "All Orders" : ORDER_STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            {/* Order Cards */}
            <div className="space-y-4">
                {filtered.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    const steps = ORDER_TIMELINE[order.status as OrderStatus] || [];
                    const allSteps = ["Order Placed", "Confirmed", "Processing", "Packed", "Dispatched", "In Transit", "Delivered"];

                    return (
                        <div key={order.id} className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                            <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold font-mono text-brand-blue">{order.orderNumber}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}>
                                            {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded text-xs ${order.type === "B2B" ? "bg-brand-blue/10 text-brand-blue" : "bg-silal-leaf/10 text-silal-leaf"}`}>
                                            {order.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                                    </p>
                                    <div className="flex gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                                        <span>From: {order.supplierName}</span>
                                        <span>{new Date(order.createdAt).toLocaleDateString("en-AE")}</span>
                                        {order.estimatedDelivery && <span>ETA: {order.estimatedDelivery}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <p className="font-semibold text-brand-blue text-lg">{formatAED(order.totalAmount)}</p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                            className="px-3 py-1.5 rounded-lg text-xs bg-accent text-brand-blue border border-stroke-light hover:bg-muted transition-colors"
                                        >
                                            {isExpanded ? "Hide Details" : "View Details"}
                                        </button>
                                        {order.trackingNumber && (
                                            <Link
                                                href={`/buyer/track/${order.id}`}
                                                className="px-3 py-1.5 rounded-lg text-xs bg-brand-blue text-white hover:bg-primary-hover transition-colors text-center"
                                            >
                                                Track Order
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Progress */}
                            {!["cancelled", "returned"].includes(order.status) && (
                                <div className="px-4 pb-3">
                                    <div className="flex items-center gap-0">
                                        {allSteps.map((step, i) => {
                                            const isCompleted = steps.includes(step);
                                            const isCurrent = steps[steps.length - 1] === step;
                                            return (
                                                <div key={step} className="flex items-center flex-1">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-3 h-3 rounded-full ${isCompleted ? "bg-brand-blue" : "bg-gray-200"} ${isCurrent ? "ring-2 ring-brand-blue/30" : ""}`} />
                                                        <span className="text-xs text-gray-400 mt-1 text-center leading-tight hidden md:block" style={{ fontSize: "9px" }}>
                                                            {step.split(" ").map((w, wi) => <span key={wi}>{w}<br /></span>)}
                                                        </span>
                                                    </div>
                                                    {i < allSteps.length - 1 && (
                                                        <div className={`flex-1 h-0.5 ${steps.includes(allSteps[i + 1]) ? "bg-brand-blue" : "bg-gray-200"}`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Expanded details */}
                            {isExpanded && (
                                <div className="border-t border-stroke-light p-4 bg-accent/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-700 mb-2">Order Items</p>
                                            <div className="space-y-2">
                                                {order.items.map((i) => (
                                                    <div key={i.sku} className="flex justify-between">
                                                        <span className="text-gray-600">{i.name} × {i.qty}</span>
                                                        <span className="font-medium">{formatAED(i.unitPrice * i.qty)}</span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-stroke-light pt-2 flex justify-between font-semibold">
                                                    <span>Total</span>
                                                    <span className="text-brand-blue">{formatAED(order.totalAmount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700 mb-2">Delivery Details</p>
                                            <div className="space-y-1 text-gray-600">
                                                <p><span className="text-gray-400">Address:</span> {order.deliveryAddress}</p>
                                                {order.carrier && <p><span className="text-gray-400">Carrier:</span> {order.carrier}</p>}
                                                {order.trackingNumber && <p><span className="text-gray-400">Tracking:</span> <span className="font-mono">{order.trackingNumber}</span></p>}
                                                {order.estimatedDelivery && <p><span className="text-gray-400">ETA:</span> {order.estimatedDelivery}</p>}
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {order.trackingNumber && (
                                                    <Link href={`/buyer/track/${order.id}`} className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs hover:bg-primary-hover transition-colors">
                                                        Track Shipment
                                                    </Link>
                                                )}
                                                <Link href="/buyer/support" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                                                    Get Support
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="bg-white rounded-xl border border-stroke-light py-16 text-center">
                        <p className="text-4xl mb-3">📦</p>
                        <p className="text-gray-500">No orders found for this filter.</p>
                        <Link href="/products" className="text-sm text-brand-blue hover:underline mt-2 inline-block">Browse Products →</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
