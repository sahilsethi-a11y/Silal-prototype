import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import GoogleTagManager from "@/components/GoogleTagManager";
import { config } from "@/lib/config";
import GTMPageView from "@/components/GtmPageView";
import AITradeAssistant from "@/components/AITradeAssistant";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "Silal Marketplace - UAE-made products for B2C and B2B buyers.",
    description: "A UAE-made products marketplace for verified food, clothing, games, supplier onboarding, AI product checks, and B2B procurement.",
    manifest: "/manifest.json",
    icons: {
        icon: "/icon.png?v=3",
        shortcut: "/icon.png?v=3",
        apple: "/apple-icon.png?v=3",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
            <body className={`${outfit.variable} antialiased text-brand-blue`}>
                <GoogleTagManager gtmId={config.gtmId} />
                <GTMPageView />
                <Header />
                {children}
                <AITradeAssistant />
                <Footer />
            </body>
        </html>
    );
}
