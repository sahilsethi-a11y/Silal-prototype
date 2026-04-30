"use client";

import { MARKET_MODE_COOKIE_KEY, MARKET_MODE_STORAGE_KEY, marketModeLabel, normalizeMarketMode, parseMarketMode, type MarketMode } from "@/lib/marketplace";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type MarketplaceMarkerProps = {
    initialMode: MarketMode;
    className?: string;
};

export default function MarketplaceMarker({ initialMode, className }: Readonly<MarketplaceMarkerProps>) {
    const searchParams = useSearchParams();
    const queryMode = searchParams.get("market");
    const [mode, setMode] = useState<MarketMode>(initialMode);

    useEffect(() => {
        const resolveMode = (): MarketMode => {
            const parsedQueryMode = parseMarketMode(queryMode);
            if (parsedQueryMode) return parsedQueryMode;
            if (typeof window !== "undefined") {
                const localMode = window.localStorage.getItem(MARKET_MODE_STORAGE_KEY);
                const parsedLocalMode = parseMarketMode(localMode);
                if (parsedLocalMode) return parsedLocalMode;
                const cookieMode = document.cookie
                    .split("; ")
                    .find((item) => item.startsWith(`${MARKET_MODE_COOKIE_KEY}=`))
                    ?.split("=")[1];
                const parsedCookieMode = parseMarketMode(cookieMode);
                if (parsedCookieMode) return parsedCookieMode;
            }
            return initialMode;
        };

        const sync = () => setMode(resolveMode());
        sync();
        window.addEventListener("storage", sync);
        window.addEventListener("adpg-market-changed", sync as EventListener);

        return () => {
            window.removeEventListener("storage", sync);
            window.removeEventListener("adpg-market-changed", sync as EventListener);
        };
    }, [queryMode, initialMode]);

    const marketLabel = marketModeLabel(normalizeMarketMode(mode));

    return (
        <span className={`hidden md:inline-flex items-center rounded-full border border-brand-blue/20 bg-brand-blue/5 px-3 py-1 text-xs font-medium text-brand-blue whitespace-nowrap ${className ?? ""}`}>
            Mode: {marketLabel}
        </span>
    );
}
