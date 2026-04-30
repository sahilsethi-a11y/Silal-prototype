import Tabs from "@/components/Tabs";

const data = {
    title: "Admin Control Center",
    description: "Marketplace management, vendor governance, KYC operations, finance, logistics, and AI oversight.",
    tabs: [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Vendor Management", href: "/admin/vendors" },
        { label: "Product Moderation", href: "/admin/listings" },
        { label: "Merchandising", href: "/admin/merchandising" },
        { label: "Finance & Pay", href: "/admin/finance" },
        { label: "Logistics", href: "/admin/logistics" },
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Users", href: "/admin/users" },
    ],
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-medium">{data.title}</h1>
            <p className="text-gray-600 mb-8">{data.description}</p>
            <Tabs tabs={data.tabs} />
            {children}
        </main>
    );
}
