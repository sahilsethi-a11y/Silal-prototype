"use client";
import Link from "next/link";
import { FileIcon } from "@/components/Icons";
import { useEffect, useState } from "react";
import { getClientMarketMode, scopedStorageKey } from "@/lib/marketplace";
import { LOCAL_AUTH_STORAGE_KEY, type LocalAuthUser } from "@/lib/localAuth";

export default function QuoteBuilderButton() {
    const [count, setCount] = useState(0);
    const [canShow, setCanShow] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const read = () => {
            const mode = getClientMarketMode();
            const quoteItemsStorageKey = scopedStorageKey("quoteBuilderItems", mode);
            let localUser: LocalAuthUser | null = null;
            try {
                const raw = window.localStorage.getItem(LOCAL_AUTH_STORAGE_KEY);
                localUser = raw ? (JSON.parse(raw) as LocalAuthUser) : null;
            } catch {}
            setCanShow(mode === "zero_km" && (!localUser || (localUser.roleType === "buyer" && localUser.buyerType !== "individual")));
            try {
                const raw = window.localStorage.getItem(quoteItemsStorageKey);
                const parsed = raw ? (JSON.parse(raw) as unknown[]) : [];
                setCount(parsed.length);
            } catch {
                setCount(0);
            }
        };
        read();
        const onStorage = () => read();
        const onQuoteUpdate = () => read();
        window.addEventListener("storage", onStorage);
        window.addEventListener("quoteBuilderUpdated", onQuoteUpdate);
        window.addEventListener("adpg-market-changed", onQuoteUpdate);
        window.addEventListener("adpg-auth-changed", onQuoteUpdate);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("quoteBuilderUpdated", onQuoteUpdate);
            window.removeEventListener("adpg-market-changed", onQuoteUpdate);
            window.removeEventListener("adpg-auth-changed", onQuoteUpdate);
        };
    }, []);

    if (!canShow) return null;

    return (
        <div className="relative">
            <Link className="p-2 hover:bg-gray-100 block rounded-md" href="/quote-builder" title="RFQ Builder">
                <FileIcon className="h-4 w-4" />
            </Link>
            <span className="min-w-4 h-4 px-1 rounded-full bg-destructive text-[10px] absolute -top-0.5 -right-0.5 text-white flex justify-center items-center">
                {count}
            </span>
        </div>
    );
}
