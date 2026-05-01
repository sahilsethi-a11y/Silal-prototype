import TopBanner from "@/components/TopBanner";
import GetStartVisit from "@/components/GetStartVisit";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import Image from "@/elements/Image";

const data = {
    topBanner: {
        title: "Join Marketplace",
        description: "Create a buyer or supplier account for UAE-made food, fashion, games, and local categories ready for retail and bulk procurement.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85",
        link: "#signup",
    },
    buyers: {
        title: "Built For UAE Buyers And Suppliers",
        subTitle: "B2C shopping and B2B procurement flows with verified onboarding, AI product checks, and supplier trust signals",
        List: [
            {
                icon: "/assets/users.svg",
                title: "0",
                subTitle: "Buyer Types",
            },
            {
                icon: "/assets/marketplace.svg",
                title: "3+",
                subTitle: "Product Categories",
            },
            {
                icon: "/assets/star.svg",
                title: "4",
                subTitle: "AI Trust Features",
            },
            {
                icon: "/assets/trend-up.svg",
                title: "2",
                subTitle: "Marketplace Modes",
            },
        ],
    },
    whyus: {
        title: "Why Use Silal Marketplace?",
        subTitle: "A trusted commerce layer for local products, supplier discovery, and enterprise procurement",
        List: [
            {
                icon: "/assets/dollar.svg",
                title: "B2C And B2B Pricing",
                subTitle: "Shop retail packs or request wholesale pricing with transparent RFQs and supplier comparisons.",
            },
            {
                icon: "/assets/shield.svg",
                title: "Verified UAE Suppliers",
                subTitle: "Supplier KYC, origin evidence, compliance documents, and admin approval are part of onboarding.",
            },
            {
                icon: "/assets/clock.svg",
                title: "Fast Buying Flows",
                subTitle: "Move from discovery to checkout, RFQ, negotiation, and fulfilment tracking in one account.",
            },
            {
                icon: "/assets/star.svg",
                title: "AI-Assisted Trust",
                subTitle: "Use chatbot support, image classification, product identification, and KYC checks across the journey.",
            },
        ],
    },
    process: {
        title: "How It Works",
        subTitle: "A simple onboarding model for consumers, business buyers, suppliers, and admins",
        List: [
            {
                icon: "/assets/user-check.svg",
                title: "Create Account",
                subTitle: "Choose buyer or supplier and provide account details.",
            },
            {
                icon: "/assets/document.svg",
                title: "Upload Documents",
                subTitle: "Complete UAE Pass, trade license, origin, and compliance document checks where required.",
            },
            {
                icon: "/assets/check-circle.svg",
                title: "AI And Admin Review",
                subTitle: "Image checks, KYC checks, and admin moderation review onboarding risk.",
            },
            {
                icon: "/assets/target.svg",
                title: "Start Trading",
                subTitle: "Buy, sell, publish products, build RFQs, and manage orders.",
            },
        ],
    },
    signup: {
        title: "Choose Your Account Type",
        subTitle: "Select the account type that matches your marketplace role",
        List: [
            {
                icon: "/assets/users.svg",
                title: "Buyer",
                subTitle: "Consumers and business buyers",
                link: "/signup/buyer",
            },
            {
                icon: "/assets/briefcase.svg",
                title: "Supplier",
                subTitle: "UAE farms, brands, makers",
                link: "/signup/seller",
            },
        ],
    },
};

export default function page() {
    return (
        <main>
            <div className="min-h-screen">
                <TopBanner verticalCenter={true} title={data.topBanner.title} description={data.topBanner.description} image={data.topBanner.image}>
                    <div className="flex justify-center lg:mt-8">
                        <Link
                            href={data.topBanner.link}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white text-brand-blue py-3 text-xs font-medium px-6 rounded-md hover:bg-gray-100">
                            Get Started Today
                            <ArrowRightIcon className="h-3.5 w-3.5 mr-1 lg:mr-2" />
                        </Link>
                    </div>
                </TopBanner>
            </div>
            <GetStartVisit
                data={data.buyers}
                cardCls="rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow border border-black/10"
                grid="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                cardTitleCls="text-2xl font-bold mb-1"
            />
            <GetStartVisit
                data={data.whyus}
                parentBg="bg-gray-50"
                grid="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                cardCls="rounded-xl border border-black/10 text-center hover:shadow-lg transition-shadow"
                cardTitleCls="mb-3"
            />
            <GetStartVisit
                data={data.process}
                cardCls="text-center"
                grid="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                cardTitleCls="mb-3 text-lg"
                imgBgCls="bg-brand-blue w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                imgCls="invert"
            />
            <section id="signup" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="text-3xl mb-4 text-[#202C4A]">Choose Your Account Type</div>
                        <p className="text-gray-600 max-w-2xl mx-auto">Select whether you want to buy UAE-made products or supply products into the marketplace.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {data.signup.List.map((item) => (
                            <div key={item.title} className="group">
                                <Link
                                    href={item.link}
                                    className="w-full h-40 bg-white text-brand-blue border-2 border-gray-200 hover:border-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl group-hover:scale-105 flex flex-col items-center justify-center space-y-4 p-8">
                                    <div className="p-4 rounded-full bg-brand-blue group-hover:bg-white transition-colors duration-300">
                                        <Image alt={item.title} src={item.icon} height={20} width={20} className="group-[:not(:hover)]:invert" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-semibold mb-1">{item.title}</div>
                                        <div className="text-sm opacity-80">{item.subTitle}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
