"use client";

import { useState } from "react";
import OuterAccordion from "@/components/faq/OuterAccordion";
import InnerAccordion from "@/components/faq/InnerAccordion";

const data = [
    {
        title: "Getting Started",
        description: "Essential information for new users to begin their journey on Silal Marketplace",
        icon: "🚀",
        id: "gettingStarted",
        faq: [
            { q: "How does Silal Marketplace work?", a: "Silal Marketplace connects verified buyers, sellers, and suppliers across the UAE. Browse products, compare offers, add items to cart, and complete secure checkout with integrated logistics support." },
            { q: "Do I need to create an account to browse products?", a: "No, you can browse product listings without an account. To place orders, save items, negotiate, or list products for sale, create a free account and complete verification." },
            { q: "What makes Silal Marketplace different from other marketplaces?", a: "Silal Marketplace combines verified suppliers, secure payment workflows, and UAE-focused 3PL logistics in one platform. This keeps transactions transparent, reliable, and easy to manage." },
        ],
    },
    {
        title: "Buying Process",
        description: "Step-by-step guidance through our secure product purchasing process and payment options",
        icon: "🛒",
        id: "buyingProcess",
        faq: [
            {
                q: "How do I purchase a product on Silal Marketplace?",
                a: "Browse and filter products by your preferences "
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept major credit cards, debit cards, and bank transfers. Payments are processed through secure payment gateways to protect buyers and sellers."
            },
            {
                q: "Can I negotiate the price of a product?",
                a: "Yes. Our platform includes negotiation tools that let you communicate with sellers and submit counter-offers."
            },
            {
                q: "What if I'm not satisfied with the product after inspection?",
                a: "If the product does not match the listing details or agreed quality terms, you can raise a dispute through support and request resolution under buyer protection policies."
            },
        ],
    },
    {
        title: "Product Quality",
        description: "Quality assurance and compliance checks for transparent marketplace transactions",
        icon: "🔍",
        id: "productQuality",
        faq: [
            {
                q: "Are product quality checks mandatory?",
                a: "Quality checks depend on product category and seller program. For applicable categories, suppliers provide quality and compliance documentation before orders are confirmed.",
            },
            {
                q: "How much do quality checks cost?",
                a: "Where quality checks apply, costs are included in seller onboarding and marketplace operations.",
            },
            {
                q: "How long does quality verification take?",
                a: "Verification timelines vary by category and supplier readiness. Most checks are completed before listing activation.",
            },
            {
                q: "Can I request proof of quality verification?",
                a: "Yes. Buyers can request category-specific certificates, quality notes, and listing evidence where available.",
            },
        ],
    },
    {
        title: "Selling Process",
        description: "Everything you need to know about listing and selling your product on our trusted platform",
        icon: "💰",
        id: "sellingProcess",
        faq: [
            {
                q: "How do I list my product for sale?",
                a: "Create a seller account and complete verification",
            },
            {
                q: "What are the seller fees?",
                a: "Seller fees depend on account type and service package. Contact supplier support for the latest pricing and commission structure.",
            },
            {
                q: "How long does it take to sell a product?",
                a: "Average selling time varies by product type, condition, and pricing. Most well-priced products sell within 30-45 days. Premium products may take longer, while competitively priced retail products often sell within 2-3 weeks.",
            },
            {
                q: "Can I sell multiple products?",
                a: "Yes! Individual sellers can list up to 5 products at a time. If you regularly sell products, consider upgrading to a supplier account for unlimited listings and additional features like inventory management tools and priority support.",
            },
        ],
    },
    {
        title: "Shipping & Delivery",
        description: "Reliable logistics solutions and delivery services across the UAE and international markets",
        icon: "🚛",
        id: "shippingDelivery",
        faq: [
            {
                q: "Do you provide product delivery services?",
                a: "Yes, we offer comprehensive logistics solutions through our network of certified transporters. We can deliver products anywhere in the UAE and to select international destinations. Delivery costs are calculated based on distance and product type.",
            },
            {
                q: "How much does delivery cost?",
                a: "Delivery within UAE emirates ranges from AED 300-800 depending on the distance. International shipping costs vary by destination. You'll see exact delivery costs before completing your purchase. Some sellers offer free local delivery for qualified buyers.",
            },
            {
                q: "Is my product insured during transport?",
                a: "Yes, all products are fully insured during transport through our logistics partners. Coverage includes protection against damage, theft, or loss during the delivery process. Insurance is included at no additional cost to buyers.",
            },
            {
                q: "Can I track my product delivery?",
                a: "Absolutely! You'll receive real-time tracking updates via SMS and email once your product is dispatched. Our logistics dashboard provides live GPS tracking, estimated delivery times, and direct contact with the driver.",
            },
        ],
    },
    {
        title: "Account & Security",
        description: "Information about user verification, data protection, and maintaining secure account access",
        icon: "🔒",
        id: "accountSecurity",
        faq: [
            {
                q: "How do you verify users on the platform?",
                a: "We use a comprehensive KYC (Know Your Customer) process that includes Emirates ID verification, phone number confirmation, and address verification. Suppliers undergo additional business license and trade license verification. This ensures all users are legitimate and trustworthy.",
            },
            {
                q: "Is my personal information secure?",
                a: "Yes, we use bank-level encryption and security measures to protect your personal and financial information. We comply with UAE data protection regulations and never share your information with third parties without your consent.",
            },
            {
                q: "What should I do if I suspect fraudulent activity?",
                a: "Report any suspicious activity immediately through our 24/7 support channels. We have dedicated fraud prevention teams and advanced monitoring systems. Never share personal information or make payments outside our secure platform.",
            },
            {
                q: "Can I delete my account?",
                a: "Yes, you can request account deletion at any time. Contact our support team, and we'll process your request within 7 business days. Note that some transaction records may be retained as required by UAE regulations.",
            },
        ],
    },
    {
        title: "Supplier Services",
        description: "Professional supplier onboarding, enhanced features, and business growth opportunities",
        icon: "🏢",
        id: "dealerServices",
        faq: [
            {
                q: "How do I become a verified supplier?",
                a: "To become a verified supplier: 1) Submit your trade license and business registration 2) Complete our supplier verification process 3) Choose a subscription plan 4) Upload your inventory 5) Start selling with enhanced features like bulk listing tools, analytics dashboard, and priority support.",
            },
            {
                q: "What are the benefits of a supplier account?",
                a: "Supplier accounts include: unlimited product listings, advanced inventory management, detailed analytics, priority customer support, bulk upload tools, custom branding options, featured listing privileges, and access to supplier financing programs.",
            },
            {
                q: "Do you offer supplier financing programs?",
                a: "Yes, we partner with leading financial institutions to offer competitive financing options to your customers. Suppliers can access wholesale financing, floor plan financing, and customer financing programs to boost sales and profitability.",
            },

        ],
    },
    {
        title: "Technical Support",
        description: "Troubleshooting guides and technical assistance for platform usage and common issues",
        icon: "⚙️",
        id: "technicalSupport",
        faq: [
            {
                q: "I'm having trouble uploading photos. What should I do?",
                a: "Ensure your photos are in JPG or PNG format and under 10MB each. Use high-resolution images (minimum 1280x720). Clear your browser cache or try a different browser. If problems persist, contact our technical support team for assistance.",
            },
            {
                q: "The website is running slowly. How can I fix this?",
                a: "Try clearing your browser cache and cookies, disable browser extensions temporarily, ensure you have a stable internet connection, or try accessing the site from a different device. If issues continue, it may be temporary server maintenance.",
            },
            {
                q: "Can I use the platform on my mobile device?",
                a: "Yes! Our platform is fully optimized for mobile devices. You can browse, buy, sell, and manage your account from any smartphone or tablet. We also plan to launch dedicated mobile apps for iOS and Android soon.",
            },

        ],
    },
];

const initialOuterState = data.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
}, {} as Record<string, boolean>);

export default function NestedAccordions() {
    const [outerState, setOuterState] = useState < Record < string, boolean>> (initialOuterState);
    const [activeInnerItems, setActiveInnerItems] = useState < Record < string, number | null >> ({});

    const handleOuterToggle = (id: string) => {
        setOuterState((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleInnerToggle = (outerId: string, innerIdx: number) => {
        setActiveInnerItems((prev) => ({
            ...prev,
            [outerId]: prev[outerId] === innerIdx ? null : innerIdx,
        }));
    };

    return (
        <div className="mx-auto mt-6">
            {data.map((outer, outerIdx) => (
                <OuterAccordion
                    key={outerIdx}
                    title={outer.title}
                    icon={outer.icon}
                    description={outer.description}
                    isOpen={outerState[outer.id]}
                    onClick={() => handleOuterToggle(outer.id)}
                >
                    {outer.faq.map((item, innerIdx) => (
                        <InnerAccordion
                            key={innerIdx}
                            question={item.q}
                            answer={item.a}
                            isOpen={activeInnerItems[outer.id] === innerIdx}
                            onClick={() => handleInnerToggle(outer.id, innerIdx)}
                            isLast={innerIdx === outer.faq.length - 1}
                        />
                    ))}
                </OuterAccordion>
            ))}
        </div>
    );
}
