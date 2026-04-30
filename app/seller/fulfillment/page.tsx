"use client";

import { useState } from "react";
import { MOCK_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatAED, type OrderStatus, type MockOrder } from "@/lib/mockData";

// Supplier-specific orders (sup-001)
const MY_ORDERS = MOCK_ORDERS.filter((o) => o.supplierId === "sup-001");

const FULFILLMENT_STEPS: OrderStatus[] = ["confirmed", "processing", "packed", "dispatched", "in_transit", "delivered"];

export default function FulfillmentPage() {
    const [orders, setOrders] = useState<MockOrder[]>(MY_ORDERS);
    const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
    const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);

    const advance = (id: string) => {
        setOrders((os) =>
            os.map((o) => {
                if (o.id !== id) return o;
                const idx = FULFILLMENT_STEPS.indexOf(o.status as OrderStatus);
                if (idx < 0 || idx >= FULFILLMENT_STEPS.length - 1) return o;
                return { ...o, status: FULFILLMENT_STEPS[idx + 1], updatedAt: new Date().toISOString() };
            })
        );
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter((o) => activeFilter === "all" || o.status === activeFilter);

    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter((o) => ["confirmed", "processing"].includes(o.status)).length;
    const packed = orders.filter((o) => o.status === "packed").length;
    const dispatched = orders.filter((o) => ["dispatched", "in_transit"].includes(o.status)).length;

    return (
        <div className="space-y-6">
            {/* Stage overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <StageCard label="Pending Confirmation" count={pending} color="text-yellow-600" bgColor="bg-yellow-50" />
                <StageCard label="Processing / Picking" count={confirmed} color="text-blue-600" bgColor="bg-blue-50" />
                <StageCard label="Ready to Dispatch" count={packed} color="text-indigo-600" bgColor="bg-indigo-50" />
                <StageCard label="In Transit" count={dispatched} color="text-orange-600" bgColor="bg-orange-50" />
            </div>

            {/* Priority alert */}
            {pending > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-xl">⏰</span>
                    <div>
                        <p className="font-semibold text-yellow-800">{pending} order{pending > 1 ? "s" : ""} awaiting confirmation</p>
                        <p className="text-sm text-yellow-700">Confirm within SLA window to avoid escalation</p>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {(["all", "pending", "confirmed", "processing", "packed", "dispatched", "in_transit", "delivered"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setActiveFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${activeFilter === s ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-600 border-stroke-light"}`}
                    >
                        {s === "all" ? "All Orders" : ORDER_STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            {/* Order Queue */}
            <div className="space-y-3">
                {filteredOrders.length === 0 && (
                    <div className="bg-white rounded-xl border border-stroke-light py-12 text-center text-gray-400">
                        No orders in this stage.
                    </div>
                )}
                {filteredOrders.map((order) => {
                    const isActionable = !["delivered", "cancelled", "returned"].includes(order.status);
                    const stepIdx = FULFILLMENT_STEPS.indexOf(order.status as OrderStatus);
                    const nextStatus = stepIdx >= 0 && stepIdx < FULFILLMENT_STEPS.length - 1 ? FULFILLMENT_STEPS[stepIdx + 1] : null;
                    return (
                        <div key={order.id} className={`bg-white rounded-xl border p-4 ${order.status === "pending" ? "border-yellow-300" : "border-stroke-light"}`}>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold text-gray-800 font-mono text-sm">{order.orderNumber}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}>
                                            {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${order.type === "B2B" ? "bg-brand-blue/10 text-brand-blue" : "bg-silal-leaf/10 text-silal-leaf"}`}>
                                            {order.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                                    </p>
                                    <div className="flex gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                                        <span>Buyer: {order.buyerName}</span>
                                        <span>{order.deliveryAddress}</span>
                                        {order.carrier && <span>Carrier: {order.carrier}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="font-semibold text-brand-blue">{formatAED(order.totalAmount)}</p>
                                        <p className="text-xs text-gray-400">ETA: {order.estimatedDelivery || "TBD"}</p>
                                    </div>

                                    {isActionable && (
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-3 py-2 bg-brand-blue text-white rounded-lg text-xs font-medium hover:bg-primary-hover transition-colors"
                                        >
                                            {nextStatus ? `Mark ${ORDER_STATUS_LABELS[nextStatus]}` : "Update"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Fulfillment Progress Bar */}
                            {isActionable && (
                                <div className="mt-3 flex items-center gap-1">
                                    {FULFILLMENT_STEPS.map((step, i) => {
                                        const current = FULFILLMENT_STEPS.indexOf(order.status as OrderStatus);
                                        const isCompleted = i <= current;
                                        const isCurrent = i === current;
                                        return (
                                            <div key={step} className="flex items-center flex-1">
                                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isCompleted ? "bg-brand-blue" : "bg-gray-200"} ${isCurrent ? "ring-2 ring-brand-blue/30" : ""}`} />
                                                {i < FULFILLMENT_STEPS.length - 1 && (
                                                    <div className={`flex-1 h-0.5 mx-0.5 ${i < current ? "bg-brand-blue" : "bg-gray-200"}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Confirm status advance modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-semibold text-gray-800 mb-1">Update Order Status</h3>
                        <p className="text-sm text-gray-500 mb-4">{selectedOrder.orderNumber} — {selectedOrder.buyerName}</p>

                        <div className="bg-accent rounded-xl p-4 mb-4">
                            <p className="text-sm text-gray-600">Items to fulfill:</p>
                            <ul className="mt-2 space-y-1">
                                {selectedOrder.items.map((i) => (
                                    <li key={i.sku} className="text-sm flex justify-between">
                                        <span>{i.name}</span>
                                        <span className="font-medium">× {i.qty}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {(() => {
                            const stepIdx = FULFILLMENT_STEPS.indexOf(selectedOrder.status as OrderStatus);
                            const nextStatus = stepIdx >= 0 ? FULFILLMENT_STEPS[stepIdx + 1] : null;
                            return nextStatus ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => advance(selectedOrder.id)}
                                        className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                                    >
                                        Confirm → {ORDER_STATUS_LABELS[nextStatus]}
                                    </button>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : null;
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}

function StageCard({ label, count, color, bgColor }: { label: string; count: number; color: string; bgColor: string }) {
    return (
        <div className={`rounded-xl border border-stroke-light p-4 ${bgColor}`}>
            <p className={`text-3xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-gray-600 mt-1">{label}</p>
        </div>
    );
}
