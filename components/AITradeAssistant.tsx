"use client";

import { ChatIcon, CloseIcon, ImageIcon, SearchIcon, SendIcon, Shield, SparklesIcon } from "@/components/Icons";
import { useMemo, useState } from "react";

type Message = {
    role: "assistant" | "user";
    text: string;
};

const answerFor = (value: string) => {
    const text = value.toLowerCase();
    if (text.includes("kyc") || text.includes("document")) {
        return "Supplier KYC queue: verify UAE trade license, Emirates ID or passport, bank letter, origin certificate, and product compliance documents before publishing.";
    }
    if (text.includes("image") || text.includes("classify")) {
        return "Image AI can identify category, product type, packaging state, duplicate photos, and likely compliance flags before a supplier listing goes live.";
    }
    if (text.includes("hotel") || text.includes("farm") || text.includes("produce")) {
        return "Recommended B2B path: shortlist Silal Fresh produce, request carton pricing, confirm cold-chain capacity, and route the RFQ to Abu Dhabi and Al Ain suppliers.";
    }
    return "I can help buyers discover UAE-made products, suppliers enrich listings, and admins review risk signals across KYC, origin, images, and product compliance.";
};

export default function AITradeAssistant() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            text: "Welcome to the UAE-made marketplace assistant. I can support product discovery, supplier onboarding, image checks, and KYC review.",
        },
    ]);

    const lastMessage = useMemo(() => messages[messages.length - 1], [messages]);

    const submit = (value = input) => {
        const next = value.trim();
        if (!next) return;
        setMessages((prev) => [...prev, { role: "user", text: next }, { role: "assistant", text: answerFor(next) }]);
        setInput("");
        setOpen(true);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {open ? (
                <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-lg border border-brand-blue/15 bg-white shadow-2xl">
                    <div className="flex items-center justify-between bg-brand-blue px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="h-4 w-4" />
                            <span className="text-sm font-semibold">AI Trade Assistant</span>
                        </div>
                        <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-white/10">
                            <CloseIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-72 space-y-3 overflow-y-auto bg-[#f7faf4] p-4">
                        {messages.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`rounded-lg px-3 py-2 text-sm leading-5 ${
                                    message.role === "assistant" ? "bg-white text-gray-700 shadow-sm" : "ml-8 bg-brand-blue text-white"
                                }`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-stroke-light bg-white p-3">
                        <button type="button" title="Product search" className="rounded-md border border-stroke-light p-2 text-brand-blue hover:bg-gray-50" onClick={() => submit("Find UAE farm produce")}>
                            <SearchIcon className="mx-auto h-4 w-4" />
                        </button>
                        <button type="button" title="Image classification" className="rounded-md border border-stroke-light p-2 text-brand-blue hover:bg-gray-50" onClick={() => submit("Classify this product image")}>
                            <ImageIcon className="mx-auto h-4 w-4" />
                        </button>
                        <button type="button" title="KYC checks" className="rounded-md border border-stroke-light p-2 text-brand-blue hover:bg-gray-50" onClick={() => submit("Check supplier KYC documents")}>
                            <Shield className="mx-auto h-4 w-4" />
                        </button>
                    </div>
                    <form
                        className="flex gap-2 border-t border-stroke-light p-3"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submit();
                        }}>
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            aria-label="Ask AI assistant"
                            placeholder={lastMessage?.role === "assistant" ? "Ask about products, KYC, or images" : "Type a message"}
                            className="min-w-0 flex-1 rounded-md border border-stroke-light px-3 py-2 text-sm outline-none focus:border-brand-blue"
                        />
                        <button type="submit" title="Send" className="rounded-md bg-brand-blue p-2 text-white hover:bg-primary-hover">
                            <SendIcon className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            ) : null}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-white shadow-xl hover:bg-primary-hover"
                aria-label="Open AI trade assistant">
                <ChatIcon className="h-5 w-5" />
            </button>
        </div>
    );
}
