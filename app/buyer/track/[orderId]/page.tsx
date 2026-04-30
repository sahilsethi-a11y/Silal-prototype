"use client";

import { use } from "react";
import Link from "next/link";
import { MOCK_ORDERS, MOCK_SHIPMENTS, formatAED } from "@/lib/mockData";

const TIMELINE_EVENTS = [
    { status: "Order Placed", time: "2026-04-28 09:14", location: "Platform", done: true },
    { status: "Order Confirmed", time: "2026-04-28 09:22", location: "Al Ain Farms LLC", done: true },
    { status: "Processing — Picking", time: "2026-04-28 11:00", location: "Al Ain Farm Warehouse", done: true },
    { status: "Packed & Labelled", time: "2026-04-28 14:30", location: "Al Ain Farm Warehouse", done: true },
    { status: "Handed to Aramex UAE", time: "2026-04-28 16:45", location: "Al Ain Farm Warehouse", done: true },
    { status: "Departed Al Ain Hub", time: "2026-04-29 08:10", location: "Aramex Al Ain Hub", done: true },
    { status: "Arrived Dubai Hub", time: "2026-04-29 12:40", location: "Aramex Dubai Hub", done: true },
    { status: "Out for Delivery — Zone Assignment", time: "2026-04-29 14:22", location: "Dubai Hub", done: true },
    { status: "Delivered to Recipient", time: "Estimated: 2026-04-30", location: "Al Khawaneej, Dubai", done: false },
];

export default function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = use(params);
    const order = MOCK_ORDERS.find((o) => o.id === orderId) ?? MOCK_ORDERS[0];
    const shipment = MOCK_SHIPMENTS.find((s) => s.orderId === orderId) ?? MOCK_SHIPMENTS[0];
    const slaPercent = Math.min((shipment.elapsedHours / shipment.slaHours) * 100, 100);

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Back */}
            <Link href="/buyer/orders" className="text-sm text-brand-blue hover:underline mb-4 inline-flex items-center gap-1">
                ← Back to Orders
            </Link>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-stroke-light p-6 mt-4 mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Order Number</p>
                        <p className="text-xl font-bold text-brand-blue font-mono">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500 mt-1">From: {order.supplierName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-brand-blue">{formatAED(order.totalAmount)}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="mt-4 space-y-2 border-t border-stroke-light pt-4">
                    {order.items.map((item) => (
                        <div key={item.sku} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.qty}</span></span>
                            <span className="font-medium">{formatAED(item.unitPrice * item.qty)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Tracking Card */}
            <div className="bg-brand-blue text-white rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm opacity-80">Carrier</p>
                        <p className="text-lg font-semibold">{shipment.carrier}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-80">Tracking Number</p>
                        <p className="font-mono text-sm">{shipment.trackingNumber}</p>
                    </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 mb-4">
                    <p className="text-sm opacity-80 mb-1">Latest Update</p>
                    <p className="font-medium">{TIMELINE_EVENTS.filter((e) => e.done).at(-1)?.status}</p>
                    <p className="text-sm opacity-70 mt-0.5">{TIMELINE_EVENTS.filter((e) => e.done).at(-1)?.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs opacity-70">Delivery Address</p>
                        <p className="text-sm mt-0.5">{order.deliveryAddress}</p>
                    </div>
                    <div>
                        <p className="text-xs opacity-70">Estimated Delivery</p>
                        <p className="text-sm font-semibold mt-0.5">{order.estimatedDelivery}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs opacity-70 mb-1">
                        <span>Delivery SLA</span>
                        <span>{shipment.elapsedHours}h of {shipment.slaHours}h</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${slaPercent >= 100 ? "bg-red-400" : slaPercent >= 80 ? "bg-yellow-400" : "bg-silal-leaf"}`}
                            style={{ width: `${slaPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-stroke-light p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-5">Shipment Timeline</h3>
                <div className="space-y-4">
                    {TIMELINE_EVENTS.map((event, i) => {
                        const isLast = i === TIMELINE_EVENTS.length - 1;
                        const isPending = !event.done;
                        return (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${isPending ? "border-2 border-gray-300 bg-white" : "bg-brand-blue"}`}>
                                        {!isPending && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                    </div>
                                    {!isLast && <div className={`w-0.5 flex-1 mt-1 ${isPending ? "bg-gray-100" : "bg-brand-blue/30"}`} style={{ minHeight: "24px" }} />}
                                </div>
                                <div className={`pb-4 flex-1 ${isPending ? "opacity-40" : ""}`}>
                                    <p className={`text-sm font-medium ${isPending ? "text-gray-400" : "text-gray-800"}`}>{event.status}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{event.time} · {event.location}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
                <Link
                    href="/buyer/support"
                    className="py-3 rounded-xl border border-stroke-light text-center text-sm text-gray-700 hover:bg-accent transition-colors"
                >
                    🆘 Get Support
                </Link>
                <button className="py-3 rounded-xl border border-stroke-light text-center text-sm text-gray-700 hover:bg-accent transition-colors">
                    📄 Download Invoice
                </button>
            </div>

            {/* Twilio SMS notification banner */}
            <div className="mt-4 bg-accent rounded-xl p-4 flex items-center gap-3">
                <span className="text-xl">📱</span>
                <div>
                    <p className="text-sm font-medium text-brand-blue">SMS & WhatsApp Alerts Active</p>
                    <p className="text-xs text-gray-500">You will receive real-time delivery updates via Twilio SMS and WhatsApp</p>
                </div>
            </div>
        </div>
    );
}
