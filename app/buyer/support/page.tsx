"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MOCK_ORDERS, ORDER_STATUS_LABELS } from "@/lib/mockData";

const MY_BUYER_ORDERS = MOCK_ORDERS.filter((o) => ["ord-001", "ord-004", "ord-006", "ord-003"].includes(o.id));

interface ChatMessage {
    id: string;
    role: "bot" | "user";
    text: string;
    time: string;
}

const CANNED_RESPONSES: Record<string, string> = {
    track: "I can help you track your order! Your order SL-2026-10041 is currently **In Transit** with Aramex UAE (Tracking: 3PL-AE-887342). Estimated delivery: April 30, 2026. You can also view the full tracking timeline on your [Orders page](/buyer/orders).",
    return: "To initiate a return, please select the order and click 'Return Item'. Returns are accepted within 7 days of delivery for most products. For fresh produce, returns must be initiated within 24 hours of delivery with photo evidence.",
    invoice: "I can generate and email you the invoice for any order. Which order number would you like the invoice for?",
    quality: "I'm sorry to hear about a quality issue! Please upload photos of the affected products and I'll escalate this to the supplier and our quality team within 2 hours.",
    payment: "Our payment platform (Telr) secures all transactions. If you see an unexpected charge, please share the transaction reference and I'll investigate immediately.",
    default: "Thanks for reaching out! I'm Silal's AI support assistant. I can help with: order tracking, returns, invoices, quality issues, or payments. What would you like help with?",
};

function getBotResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("track") || lower.includes("where") || lower.includes("delivery")) return CANNED_RESPONSES.track;
    if (lower.includes("return") || lower.includes("refund")) return CANNED_RESPONSES.return;
    if (lower.includes("invoice") || lower.includes("receipt")) return CANNED_RESPONSES.invoice;
    if (lower.includes("quality") || lower.includes("damage") || lower.includes("wrong")) return CANNED_RESPONSES.quality;
    if (lower.includes("payment") || lower.includes("charge") || lower.includes("pay")) return CANNED_RESPONSES.payment;
    return CANNED_RESPONSES.default;
}

const QUICK_QUESTIONS = [
    "Where is my order?",
    "I want to return an item",
    "I need an invoice",
    "Quality issue with product",
    "Payment question",
];

export default function BuyerSupportPage() {
    const [activeTab, setActiveTab] = useState<"chat" | "tickets" | "faq">("chat");
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "init",
            role: "bot",
            text: "👋 Hello! I'm Silal's AI support assistant. I'm here 24/7 to help with your orders, returns, invoices, and any other questions. How can I help you today?",
            time: new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" }),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            text: text.trim(),
            time: new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((m) => [...m, userMsg]);
        setInputText("");
        setIsTyping(true);
        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: getBotResponse(text),
                time: new Date().toLocaleTimeString("en-AE", { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((m) => [...m, botMsg]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="space-y-6">
            <div className="mt-2">
                <h2 className="text-xl font-semibold text-brand-blue">Customer Support</h2>
                <p className="text-sm text-gray-500">24/7 AI-powered support — chatbot, returns, and escalation</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stroke-light">
                {(["chat", "tickets", "faq"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${activeTab === t ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        {t === "chat" ? "💬 AI Chat" : t === "tickets" ? "🎟 My Tickets" : "❓ FAQ"}
                    </button>
                ))}
            </div>

            {/* Chat Tab */}
            {activeTab === "chat" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Chat window */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-stroke-light flex flex-col" style={{ height: "520px" }}>
                        {/* Chat header */}
                        <div className="p-4 border-b border-stroke-light flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-white text-sm font-bold">AI</div>
                            <div>
                                <p className="font-medium text-gray-800">Silal Support Assistant</p>
                                <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Online 24/7</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-brand-blue text-white rounded-br-sm" : "bg-muted text-gray-800 rounded-bl-sm"}`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.role === "user" ? "text-white/60" : "text-gray-400"}`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-stroke-light">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
                                    placeholder="Type your message..."
                                    className="flex-1 border border-stroke-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue"
                                />
                                <button
                                    onClick={() => sendMessage(inputText)}
                                    className="px-4 py-2.5 bg-brand-blue text-white rounded-xl text-sm hover:bg-primary-hover transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Quick questions */}
                        <div className="bg-white rounded-xl border border-stroke-light p-4">
                            <p className="text-sm font-semibold text-gray-800 mb-3">Quick Questions</p>
                            <div className="space-y-2">
                                {QUICK_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className="w-full text-left px-3 py-2 rounded-lg bg-accent hover:bg-muted text-sm text-brand-blue transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent orders for context */}
                        <div className="bg-white rounded-xl border border-stroke-light p-4">
                            <p className="text-sm font-semibold text-gray-800 mb-3">Your Recent Orders</p>
                            <div className="space-y-2">
                                {MY_BUYER_ORDERS.slice(0, 3).map((o) => (
                                    <div key={o.id} className="flex justify-between items-center py-1.5 border-b border-stroke-light last:border-0">
                                        <div>
                                            <p className="text-xs font-mono text-brand-blue">{o.orderNumber}</p>
                                            <p className="text-xs text-gray-400 capitalize">{ORDER_STATUS_LABELS[o.status as keyof typeof ORDER_STATUS_LABELS]}</p>
                                        </div>
                                        <Link href={`/buyer/track/${o.id}`} className="text-xs text-brand-blue hover:underline">Track</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Support Tickets</h3>
                        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-primary-hover transition-colors">
                            + New Ticket
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: "TKT-4821", subject: "Missing item in order SL-2026-10043", status: "Resolved", created: "2026-04-26", updated: "2026-04-26", type: "Missing Item" },
                            { id: "TKT-4892", subject: "Invoice request for order SL-2026-10041", status: "In Progress", created: "2026-04-29", updated: "2026-04-29", type: "Invoice" },
                        ].map((ticket) => (
                            <div key={ticket.id} className="bg-white rounded-xl border border-stroke-light p-4 flex justify-between items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-gray-400">{ticket.id}</span>
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">{ticket.type}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">{ticket.subject}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Created: {ticket.created} · Updated: {ticket.updated}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${ticket.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                    {ticket.status}
                                </span>
                            </div>
                        ))}
                        <div className="bg-white rounded-xl border border-stroke-light py-10 text-center text-gray-400 text-sm">
                            No more tickets
                        </div>
                    </div>
                </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
                <div className="space-y-3">
                    {[
                        { q: "How do I track my order?", a: "Go to My Orders, click 'View Details' on any order, then click 'Track Order'. You'll see a real-time timeline with carrier updates. You also receive automatic SMS and WhatsApp notifications via Twilio." },
                        { q: "What is the return policy?", a: "Most products can be returned within 7 days of delivery. Fresh produce must be returned within 24 hours with photo evidence of spoilage. B2B bulk orders have custom return terms per contract." },
                        { q: "How long does delivery take?", a: "B2C orders: 1–3 business days within UAE. B2B orders: 3–7 business days depending on quantity and product type. Cold chain orders follow dedicated SLA windows." },
                        { q: "Is my payment secure?", a: "Yes. All payments are processed through Telr, a PCI-DSS compliant payment gateway. We accept Visa, MasterCard, and bank wire transfers for B2B orders." },
                        { q: "How do I get a VAT invoice?", a: "VAT invoices are automatically generated for every order. You can download them from My Orders → View Details → Download Invoice. Invoices include VAT registration number and itemized breakdown." },
                        { q: "Are all products genuinely Made in UAE?", a: "Yes. Every supplier on Silal's Made in Emirates Marketplace undergoes KYC verification including origin certificates, trade licenses, and Halal certifications where applicable. Our AI moderation also flags suspicious listings." },
                        { q: "How do I place a B2B bulk order?", a: "Browse products and switch to 'Wholesale' mode using the marketplace toggle. Add items to your Quote Builder for bulk RFQs. Suppliers will respond with wholesale pricing, MOQ, and delivery terms within 24 hours." },
                    ].map((item, i) => (
                        <FaqItem key={i} question={item.q} answer={item.a} />
                    ))}
                </div>
            )}
        </div>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-accent/30 transition-colors"
            >
                <span className="font-medium text-gray-800 text-sm">{question}</span>
                <span className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${open ? "rotate-180" : ""}`}>▼</span>
            </button>
            {open && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-stroke-light pt-3">
                    {answer}
                </div>
            )}
        </div>
    );
}
