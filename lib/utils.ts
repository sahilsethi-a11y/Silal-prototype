import { type ClassValue, clsx } from "clsx";
import { type SearchParams } from "next/dist/server/request/search-params";
import { twMerge } from "tailwind-merge";

const currencyLocaleMap: Record<string, string> = {
    CNY: "zh-CN", // Chinese Yuan
    EUR: "de-DE", // Euro (Germany format)
    USD: "en-US", // US Dollar
    AED: "ar-AE", // UAE Dirham
    OMR: "ar-OM", // Omani Rial
    SAR: "ar-SA", // Saudi Riyal
};

const currencyUsdRateMap: Record<string, number> = {
    USD: 1,
    AED: 1 / 3.6725,
    SAR: 1 / 3.75,
    OMR: 1 / 0.3845,
};

const normalizeCurrency = (currency?: string) =>
    typeof currency === "string" && currency.trim().length === 3 ? currency.trim().toUpperCase() : "USD";

export const convertPrice = (price: number | string, sourceCurrency = "USD", targetCurrency = sourceCurrency) => {
    const source = normalizeCurrency(sourceCurrency);
    const target = normalizeCurrency(targetCurrency);
    const value = Number(price) || 0;

    if (source === target) return value;

    const sourceUsdRate = currencyUsdRateMap[source];
    const targetUsdRate = currencyUsdRateMap[target];
    if (!sourceUsdRate || !targetUsdRate) return value;

    return (value * sourceUsdRate) / targetUsdRate;
};

export const queryStringify = (params: Record<string, string | string[]>): string => {
    const query = Object.entries(params)
        .filter(([, value]) => value !== "" || value.length !== 0)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join("&");
    return query ? `?${query}` : "";
};

export const downloadFile = (url?: string) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = url.split("/").pop() || "document";
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const scrollToField = (field: string) => {
    // try by name=
    let el = document.querySelector(`[name="${field}"]`);

    // fallback: try by data-field=
    el ??= document.querySelector(`[data-field="${field}"]`);

    if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        // Optional: focus the field
        if ("focus" in el) {
            setTimeout(() => {
                (el as HTMLElement)?.focus?.();
            }, 200);
        }
    }
};

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const cleanQueryParams = (obj: SearchParams) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            if (value.length === 0) continue;
            for (const v of value) {
                query.append(key, v);
            }
        } else {
            if (!value) continue;
            query.set(key, value);
        }
    }
    return query.toString();
};

export const getDaysBetween = (date1: string | Date, date2: string | Date): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffMs = d2.getTime() - d1.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const formatPrice = (price: number | string, currency: string = "USD") => {
    const safeCurrency = normalizeCurrency(currency);
    try {
        return new Intl.NumberFormat(currencyLocaleMap[safeCurrency] || "en-US", {
            style: "currency",
            currency: safeCurrency,
        }).format(+price);
    } catch {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(+price);
    }
};
