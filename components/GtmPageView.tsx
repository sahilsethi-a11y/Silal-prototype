"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GTMPageView() {
    const pathname = usePathname();

    useEffect(() => {
        const url = globalThis.window.location.href;
        const dataLayer = globalThis.window.dataLayer ?? [];

        globalThis.window.dataLayer = dataLayer;
        dataLayer.push({
            event: "page_view",
            page_location: url,
        });
    }, [pathname]);

    return null;
}
