"use client";

import { useEffect } from "react";
import { setClientMarketMode, type MarketMode } from "@/lib/marketplace";

export default function MarketModeSync({ mode }: Readonly<{ mode: MarketMode }>) {
    useEffect(() => {
        setClientMarketMode(mode);
    }, [mode]);

    return null;
}
