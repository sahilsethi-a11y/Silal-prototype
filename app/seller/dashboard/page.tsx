import { MOCK_ORDERS, SELLER_TOP_PRODUCTS, SELLER_WEEKLY_SALES, formatAEDCompact, formatAED, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/mockData";
import Link from "next/link";
import QuickActions from "@/components/seller/QuickActions";

const MY_ORDERS = MOCK_ORDERS.filter((o) => o.supplierId === "sup-001");

export default function SellerDashboard() {
    const totalRevenue = SELLER_WEEKLY_SALES.reduce((a, d) => a + d.b2c + d.b2b, 0);
    const activeOrders = MY_ORDERS.filter((o) => !["delivered", "cancelled", "returned"].includes(o.status)).length;
    const pendingOrders = MY_ORDERS.filter((o) => o.status === "pending").length;
    const deliveredOrders = MY_ORDERS.filter((o) => o.status === "delivered").length;
    const maxSales = Math.max(...SELLER_WEEKLY_SALES.map((d) => d.b2c + d.b2b));

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <StatCard title="This Week Revenue" value={formatAEDCompact(totalRevenue)} sub="+12.4% vs last week" color="text-green-600" icon="💰" />
                <StatCard title="Active Orders" value={String(activeOrders)} sub={`${pendingOrders} pending action`} color={pendingOrders > 0 ? "text-orange-600" : "text-gray-500"} icon="📦" />
                <StatCard title="Active Products" value="38" sub="2 low stock" color="text-brand-blue" icon="🏷️" />
                <StatCard title="Buyer Rating" value="4.8" sub="Based on 342 reviews" color="text-silal-gold" icon="⭐" />
            </div>

            {pendingOrders > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">⏰</span>
                        <div>
                            <p className="font-semibold text-orange-800">{pendingOrders} order{pendingOrders > 1 ? "s" : ""} awaiting your confirmation</p>
                            <p className="text-sm text-orange-700">Confirm promptly to maintain your SLA score</p>
                        </div>
                    </div>
                    <Link href="/seller/fulfillment" className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
                        Go to Fulfillment
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-stroke-light p-5">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-800">Daily Sales This Week</h3>
                        <Link href="/seller/analytics" className="text-sm text-brand-blue hover:underline">Full Analytics →</Link>
                    </div>
                    <div className="flex items-end gap-3 h-28">
                        {SELLER_WEEKLY_SALES.map((d) => {
                            const total = d.b2c + d.b2b;
                            const totalH = (total / maxSales) * 100;
                            const b2cH = (d.b2c / total) * totalH;
                            const b2bH = totalH - b2cH;
                            return (
                                <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                                    <div className="w-full flex flex-col items-stretch h-24 justify-end">
                                        <div className="rounded-t-sm" style={{ height: `${b2bH}%`, backgroundColor: "#174f2a" }} />
                                        <div style={{ height: `${b2cH}%`, backgroundColor: "#75a843" }} />
                                    </div>
                                    <span className="text-xs text-gray-500">{d.day}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-silal-leaf inline-block" /> B2C</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-brand-blue inline-block" /> B2B</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-stroke-light p-5">
                    <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
                    <QuickActions variant="vertical" />
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-stroke-light p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                    <Link href="/seller/orders" className="text-sm text-brand-blue hover:underline">View all →</Link>
                </div>
                <div className="space-y-3">
                    {MY_ORDERS.slice(0, 4).map((o) => (
                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-stroke-light last:border-0">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-medium font-mono text-sm text-gray-800">{o.orderNumber}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>
                                        {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${o.type === "B2B" ? "bg-brand-blue/10 text-brand-blue" : "bg-silal-leaf/10 text-silal-leaf"}`}>{o.type}</span>
                                </div>
                                <p className="text-xs text-gray-500">{o.buyerName} · {new Date(o.createdAt).toLocaleDateString("en-AE")}</p>
                            </div>
                            <p className="font-semibold text-brand-blue text-sm">{formatAED(o.totalAmount)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Products & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-stroke-light p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Top Products</h3>
                        <Link href="/seller/analytics" className="text-sm text-brand-blue hover:underline">Analytics →</Link>
                    </div>
                    <div className="space-y-3">
                        {SELLER_TOP_PRODUCTS.slice(0, 4).map((p) => (
                            <div key={p.sku} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800">{p.name}</p>
                                    <p className="text-xs text-gray-400">{p.sold} units · {p.stock} in stock</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-brand-blue">{formatAEDCompact(p.revenue)}</p>
                                    <span className={`text-xs ${p.trend === "up" ? "text-green-500" : p.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                                        {p.trend === "up" ? "▲" : p.trend === "down" ? "▼" : "—"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { title: "Compliance Status", icon: "✅", detail: "Trade license valid until Dec 2026. Halal certificate renewed Apr 2026. Origin certificates up to date.", cta: "View Docs", href: "/seller/profile" },
                        { title: "Next Payout", icon: "💸", detail: "AED 127,313 scheduled for May 5, 2026. 91 orders in settlement period.", cta: "View Payout", href: "/seller/payout" },
                    ].map((c) => (
                        <div key={c.title} className="bg-white rounded-xl border border-stroke-light p-5">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{c.icon}</span>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">{c.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{c.detail}</p>
                                    <Link href={c.href} className="text-sm text-brand-blue hover:underline mt-2 inline-block">{c.cta} →</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, color, icon }: { title: string; value: string; sub: string; color: string; icon: string }) {
    return (
        <div className="bg-white rounded-xl p-5 hover:shadow-md flex items-center gap-3 border border-stroke-light">
            <div className="text-2xl">{icon}</div>
            <div>
                <p className="text-xl font-semibold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500">{title}</p>
                <p className={`text-xs font-medium mt-0.5 ${color}`}>{sub}</p>
            </div>
        </div>
    );
}
