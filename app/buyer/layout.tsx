import Tabs from "@/components/Tabs";

const data = {
    title: "Buyer Dashboard",
    description:
        "Manage UAE-made product purchases, B2B RFQs, shortlists, and profile verification.",
    tabs: [
        { label: "Dashboard", href: "/buyer/dashboard" },
        { label: "Orders", href: "/buyer/orders" },
        { label: "Shortlisted", href: "/buyer/shortlisted" },
        { label: "Support", href: "/buyer/support" },
        { label: "Profile", href: "/buyer/profile" },
        { label: "RFQs", href: "/my-negotiations" },
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
            <Tabs tabs={data.tabs} fullWidth={true} />
            {children}
        </main>
    );
}
