import QuickActions from "@/components/seller/QuickActions";
import Tabs from "@/components/Tabs";
const data = {
    title: "Supplier Portal",
    description: "Manage your UAE-made product catalog, orders, fulfillment, analytics, and settlements.",
    tabs: [
        { label: "Dashboard", href: "/seller/dashboard" },
        { label: "Product Catalog", href: "/seller/products" },
        { label: "Orders", href: "/seller/orders" },
        { label: "Fulfillment", href: "/seller/fulfillment" },
        { label: "Analytics", href: "/seller/analytics" },
        { label: "Payout", href: "/seller/payout" },
        { label: "Profile", href: "/seller/profile" },
    ],
};

export default function SellerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-medium">{data.title}</h1>
                    <p className="text-gray-600">{data.description}</p>
                </div>
                <QuickActions />
            </div>
            <Tabs tabs={data.tabs} />
            {children}
        </main>
    );
}
