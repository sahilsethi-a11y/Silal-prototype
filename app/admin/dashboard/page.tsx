import { MOCK_VENDORS, MOCK_ORDERS, MONTHLY_REVENUE, MOCK_SHIPMENTS, formatAEDCompact, KYC_STATUS_COLORS, KYC_STATUS_LABELS } from "@/lib/mockData";
import Link from "next/link";

export default function AdminDashboard() {
    const totalGMV = MONTHLY_REVENUE.reduce((a, m) => a + m.total, 0);
    const pendingKYC = MOCK_VENDORS.filter((v) => ["pending", "in_review", "docs_requested"].includes(v.kycStatus)).length;
    const activeOrders = MOCK_ORDERS.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
    const approvedSuppliers = MOCK_VENDORS.filter((v) => v.kycStatus === "approved").length;
    const exceptionShipments = MOCK_SHIPMENTS.filter((s) => s.status === "exception").length;
    const aprRevenue = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].total;
    const marRevenue = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2].total;
    const growthPct = (((aprRevenue - marRevenue) / marRevenue) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Primary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <StatCard title="Platform GMV (6M)" value={formatAEDCompact(totalGMV)} sub={`+${growthPct}% MoM`} subColor="text-green-600" icon="📊" />
                <StatCard title="Active Suppliers" value={String(approvedSuppliers)} sub={`${MOCK_VENDORS.length} registered`} subColor="text-gray-500" icon="🏭" />
                <StatCard title="Pending KYC" value={String(pendingKYC)} sub="Requires attention" subColor="text-orange-600" icon="🛡️" />
                <StatCard title="Active Orders" value={String(activeOrders)} sub={`${exceptionShipments} delivery exceptions`} subColor={exceptionShipments > 0 ? "text-red-600" : "text-gray-500"} icon="📦" />
            </div>

            {/* Alert Banner for exceptions */}
            {exceptionShipments > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold text-red-800">{exceptionShipments} Delivery Exception{exceptionShipments > 1 ? "s" : ""} Requiring Action</p>
                            <p className="text-sm text-red-600">SLA may be breached — escalate with carrier partners immediately</p>
                        </div>
                    </div>
                    <Link href="/admin/logistics" className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                        View Logistics
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KYC Queue */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-stroke-light p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">KYC Review Queue</h3>
                        <Link href="/admin/vendors" className="text-sm text-brand-blue hover:underline">View all →</Link>
                    </div>
                    <div className="space-y-3">
                        {MOCK_VENDORS.filter((v) => !["approved", "rejected"].includes(v.kycStatus)).slice(0, 4).map((v) => {
                            const docCount = Object.values(v.documents).filter(Boolean).length;
                            const totalDocs = Object.keys(v.documents).length;
                            return (
                                <div key={v.id} className="flex items-center justify-between py-2 border-b border-stroke-light last:border-0">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{v.name}</p>
                                        <p className="text-xs text-gray-400">{v.category} · {v.emirate}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full bg-silal-leaf rounded-full" style={{ width: `${(docCount / totalDocs) * 100}%` }} />
                                                </div>
                                                {docCount}/{totalDocs} docs
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${KYC_STATUS_COLORS[v.kycStatus]}`}>
                                            {KYC_STATUS_LABELS[v.kycStatus]}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-stroke-light p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        {[
                            { label: "Review Vendor KYC", href: "/admin/vendors", icon: "🛡️", count: pendingKYC },
                            { label: "Moderate Products", href: "/admin/listings", icon: "📋", count: null },
                            { label: "Finance & Payouts", href: "/admin/finance", icon: "💰", count: null },
                            { label: "Logistics Alerts", href: "/admin/logistics", icon: "🚚", count: exceptionShipments || null },
                            { label: "Update Merchandising", href: "/admin/merchandising", icon: "🎯", count: null },
                            { label: "View Analytics", href: "/admin/analytics", icon: "📈", count: null },
                        ].map((a) => (
                            <Link
                                key={a.href}
                                href={a.href}
                                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent transition-colors group"
                            >
                                <span className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-brand-blue">
                                    <span>{a.icon}</span>
                                    {a.label}
                                </span>
                                {a.count != null && a.count > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">{a.count}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-stroke-light p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                    <span className="text-sm text-gray-500">{MOCK_ORDERS.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-500 uppercase bg-muted">
                            <tr>
                                <th className="text-left px-3 py-2">Order</th>
                                <th className="text-left px-3 py-2">Buyer</th>
                                <th className="text-left px-3 py-2">Supplier</th>
                                <th className="text-left px-3 py-2">Amount</th>
                                <th className="text-left px-3 py-2">Type</th>
                                <th className="text-left px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stroke-light">
                            {MOCK_ORDERS.slice(0, 5).map((o) => (
                                <tr key={o.id} className="hover:bg-accent/30">
                                    <td className="px-3 py-2 font-mono text-xs text-brand-blue">{o.orderNumber}</td>
                                    <td className="px-3 py-2 text-gray-700">{o.buyerName}</td>
                                    <td className="px-3 py-2 text-gray-600 text-xs">{o.supplierName}</td>
                                    <td className="px-3 py-2 font-medium">AED {o.totalAmount.toLocaleString()}</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${o.type === "B2B" ? "bg-brand-blue/10 text-brand-blue" : "bg-silal-leaf/10 text-silal-leaf"}`}>{o.type}</span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            o.status === "delivered" ? "bg-green-100 text-green-700" :
                                            o.status === "cancelled" ? "bg-red-100 text-red-700" :
                                            o.status === "in_transit" ? "bg-orange-100 text-orange-700" :
                                            "bg-blue-100 text-blue-700"
                                        }`}>
                                            {o.status.replace("_", " ")}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Control Center overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: "AI Moderation Queue", detail: "14 products flagged for image classification mismatch, restricted items, or duplicate catalogues. AI confidence below 70% threshold.", href: "/admin/listings", cta: "Review Queue" },
                    { title: "Finance Reconciliation", detail: "3 payouts scheduled for May 5. 1 payout on hold pending bank verification. Total pending: AED 1.05M.", href: "/admin/finance", cta: "View Finance" },
                    { title: "Supplier Compliance", detail: "2 suppliers with expired trade licenses. 1 halal certificate renewal pending for fresh produce category.", href: "/admin/vendors", cta: "View Vendors" },
                ].map((c) => (
                    <div key={c.title} className="bg-white rounded-xl border border-stroke-light p-5">
                        <h3 className="font-semibold text-brand-blue mb-2">{c.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{c.detail}</p>
                        <Link href={c.href} className="text-sm text-brand-blue font-medium hover:underline">{c.cta} →</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, subColor, icon }: { title: string; value: string; sub: string; subColor: string; icon: string }) {
    return (
        <div className="bg-white rounded-xl p-5 hover:shadow-md flex items-center gap-3 border border-stroke-light">
            <div className="text-2xl">{icon}</div>
            <div>
                <p className="text-xl font-semibold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500">{title}</p>
                <p className={`text-xs font-medium mt-0.5 ${subColor}`}>{sub}</p>
            </div>
        </div>
    );
}
