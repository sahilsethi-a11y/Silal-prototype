import { EnternalLinkIcon, StarIcon } from "@/components/Icons";
import Tabbin from "@/components/Tabbin";
import Image from "@/elements/Image";
import Link from "next/link";

type PartnerData = {
    title: string;
    subtitle: string;
    items: {
        isFeatured?: boolean;
        image: string;
        title: string;
        description: string;
        link: string;
    }[];
};

export default async function PartnerNetwork() {
    const data = {
        title: "Supplier Network",
        description:
            "We work with trusted UAE service providers to support fulfillment, payments, and secure marketplace operations for local products.",
        logistics: {
            title: "UAE 3PL Logistics Providers",
            subtitle: "Delivery, warehousing, and fulfillment partners for marketplace orders",
            items: [
                {
                    isFeatured: true,
                    image: "/assets/global-auto-transport.jpeg",
                    title: "Aramex",
                    description: "UAE-wide last-mile and cross-border delivery operations with tracking and fulfillment services.",
                    link: "https://www.aramex.com",
                },
                {
                    image: "/assets/emirates-logistics-hub.jpeg",
                    title: "Emirates Post",
                    description: "Nationwide logistics and parcel network supporting reliable marketplace distribution.",
                    link: "https://www.epg.gov.ae",
                },
                {
                    image: "/assets/secure-auto-delivery.jpeg",
                    title: "Shipa Delivery",
                    description: "Ecommerce-focused 3PL services for same-day and scheduled UAE deliveries.",
                    link: "https://shipa.com",
                },
            ],
        },
        payments: {
            title: "UAE Payment Gateway Services",
            subtitle: "Secure payment processing options for B2C and B2B marketplace transactions",
            items: [
                {
                    isFeatured: true,
                    image: "/assets/gulf-finance-corporation.jpeg",
                    title: "Telr",
                    description: "PCI-compliant online payment gateway widely used by UAE commerce businesses.",
                    link: "https://telr.com",
                },
                {
                    image: "/assets/gulf-finance-corporation.jpeg",
                    title: "PayTabs",
                    description: "Regional payment platform supporting cards, wallets, and local payment methods.",
                    link: "https://paytabs.com",
                },
                {
                    image: "/assets/uae-national-bank.jpeg",
                    title: "Network International",
                    description: "Enterprise-grade payment acceptance and acquiring infrastructure across the UAE.",
                    link: "https://network.ae",
                },
            ],
        },
        benifits: {
            title: "Why Partner With Us",
            description: "Join a UAE-first commerce ecosystem focused on dependable fulfillment and secure payments",
            items: [
                {
                    title: "Access to Network",
                    description: "Connect with buyers, suppliers, and marketplace operators across our platform",
                    icon: "/assets/users.svg",
                },
                {
                    title: "Business Growth",
                    description: "Expand your reach and grow your business with our marketing support",
                    icon: "/assets/trend-up.svg",
                },
                {
                    title: "Quality Assurance",
                    description: "Maintain high service standards with our quality assurance programs",
                    icon: "/assets/shield.svg",
                },
            ],
        },
    };

    const tabs = [
        {
            label: "3PL Logistics",
            panel: <TabPanel data={data.logistics} />,
        },
        {
            label: "Payment Gateways",
            panel: <TabPanel data={data.payments} />,
        },
    ];

    const benifits = data.benifits;

    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl mb-4 text-brand-blue">{data.title}</h1>
                <p className="text-gray-600 max-w-3xl mx-auto">{data.description}</p>
            </div>
            <Tabbin items={tabs} />
            <section className="mt-16 py-12 bg-gray-50 rounded-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl mb-4">{benifits.title}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">{benifits.description}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {benifits.items.map((item) => (
                        <div key={item.title} className="text-center space-y-4">
                            <div className="w-16 h-16 bg-stroke-light rounded-full flex items-center justify-center mx-auto">
                                <Image alt={item.title} src={item.icon} height={28} width={28} />
                            </div>
                            <h4>{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

const TabPanel = ({ data }: { data: PartnerData }) => {
    return (
        <div>
            <div className="my-6">
                <h2 className="text-2xl mb-2">{data.title}</h2>
                <p className="text-gray-600">{data.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items?.map((item) => (
                    <div key={item.title} className={`p-6 relative border rounded-xl ${item.isFeatured ? "border-2" : "border-stroke-light"}`}>
                        {item.isFeatured && (
                            <span className="inline-flex items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium absolute -top-3 left-4 bg-primary text-white bg-black">
                                <StarIcon className="h-2.5 w-2.5" />
                                Featured
                            </span>
                        )}
                        <Image src={item.image} alt={item.title} height={100} width={200} className="h-12 w-auto mb-4" />
                        <h3 className="mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        <Link
                            href={item.link}
                            target="_blank"
                            className="flex items-center justify-center text-sm font-medium border bg-background text-foreground hover:bg-accent hover:text-accent-foreground py-1 rounded-md gap-1.5 px-3 border-stroke-light">
                            <EnternalLinkIcon className="h-3.5 w-3.5" />
                            Visit Website
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
