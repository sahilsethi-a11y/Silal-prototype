import Link from "next/link";
import RecentOrders from "@/components/buyer/RecentOrders";
import QuickActions from "@/components/buyer/QuickActions";
import { MOCK_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatAED, type OrderStatus } from "@/lib/mockData";

const MY_BUYER_ORDERS = MOCK_ORDERS.filter((o) => ["ord-001", "ord-004", "ord-006", "ord-003"].includes(o.id));

const StatCard = ({ title, value, icon, sub, subColor }: { title: string; value: string; icon: React.ReactNode; sub?: string; subColor?: string }) => (
    <div className="bg-white rounded-xl p-5 hover:shadow-md flex items-center gap-3 border border-stroke-light">
        <div className="opacity-60">{icon}</div>
        <div>
            <p className="text-xl font-semibold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{title}</p>
            {sub && <p className={`text-xs font-medium mt-0.5 ${subColor || "text-gray-400"}`}>{sub}</p>}
        </div>
    </div>
);

export default function BuyerDashboard() {
    const activeOrders = MY_BUYER_ORDERS.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
    const inTransit = MY_BUYER_ORDERS.filter((o) => o.status === "in_transit").length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <StatCard
                    title="Total Orders"
                    value={String(MY_BUYER_ORDERS.length)}
                    sub={`${activeOrders} active`}
                    subColor="text-brand-blue"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-brand-blue"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>}
                />
                <StatCard
                    title="In Transit"
                    value={String(inTransit)}
                    sub="Track your shipments"
                    subColor={inTransit > 0 ? "text-orange-600" : "text-gray-400"}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-orange-500"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>}
                />
                <StatCard
                    title="Shortlisted"
                    value="4"
                    sub="UAE-made products saved"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
                />
                <StatCard
                    title="Active RFQs"
                    value="2"
                    sub="B2B quote requests"
                    subColor="text-silal-gold"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-silal-gold"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>}
                />
            </div>

            {/* Active Shipment Alert */}
            {inTransit > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🚚</span>
                        <div>
                            <p className="font-semibold text-orange-800">You have {inTransit} shipment{inTransit > 1 ? "s" : ""} in transit</p>
                            <p className="text-sm text-orange-600">Estimated delivery: April 30, 2026</p>
                        </div>
                    </div>
                    <Link href={`/buyer/track/ord-001`} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors flex-shrink-0">
                        Track Now
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Summary */}
                <div className="bg-white rounded-xl border border-stroke-light p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                        <Link href="/buyer/orders" className="text-sm text-brand-blue hover:underline">View all →</Link>
                    </div>
                    <div className="space-y-3">
                        {MY_BUYER_ORDERS.slice(0, 4).map((o) => (
                            <div key={o.id} className="flex items-center justify-between py-2 border-b border-stroke-light last:border-0">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span className="font-mono text-xs text-brand-blue">{o.orderNumber}</span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>
                                            {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">{o.supplierName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-brand-blue">{formatAED(o.totalAmount)}</p>
                                    {o.trackingNumber && (
                                        <Link href={`/buyer/track/${o.id}`} className="text-xs text-brand-blue hover:underline">Track</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-stroke-light p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <QuickActions variant="vertical" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                    {
                        title: "AI Product Finder",
                        detail: "Describe what you need and our AI will match you with the best UAE-made products from verified local suppliers.",
                        icon: "🤖",
                        cta: "Find Products",
                        href: "/products",
                    },
                    {
                        title: "Supplier Verification",
                        detail: "See KYC status, origin certificates, Halal compliance, and quality ratings before every purchase.",
                        icon: "🛡️",
                        cta: "Browse Suppliers",
                        href: "/products",
                    },
                    {
                        title: "24/7 Support",
                        detail: "Our AI chatbot resolves 67% of queries instantly. Escalate to a human agent anytime.",
                        icon: "💬",
                        cta: "Get Support",
                        href: "/buyer/support",
                    },
                ].map((c) => (
                    <div key={c.title} className="bg-white rounded-xl border border-stroke-light p-5">
                        <div className="text-2xl mb-2">{c.icon}</div>
                        <h3 className="font-semibold text-brand-blue">{c.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mt-2 mb-3">{c.detail}</p>
                        <Link href={c.href} className="text-sm text-brand-blue font-medium hover:underline">{c.cta} →</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
