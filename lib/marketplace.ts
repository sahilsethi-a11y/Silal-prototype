export type MarketMode = "second_hand" | "zero_km";
export type PublicMarketMode = "retail" | "wholesale";

export const DEFAULT_MARKET_MODE: MarketMode = "second_hand";
export const MARKET_MODE_STORAGE_KEY = "adpg_market_mode";
export const MARKET_MODE_COOKIE_KEY = "adpg_market_mode";

export const parseMarketMode = (value?: string | null): MarketMode | null => {
    const normalized = value?.trim().toLowerCase();
    if (!normalized) return null;
    if (["zero_km", "wholesale", "b2b", "bulk"].includes(normalized)) return "zero_km";
    if (["second_hand", "retail", "b2c", "consumer"].includes(normalized)) return "second_hand";
    return null;
};

export const normalizeMarketMode = (value?: string | null): MarketMode => parseMarketMode(value) ?? DEFAULT_MARKET_MODE;

export const marketModeToParam = (mode: MarketMode): PublicMarketMode => (mode === "zero_km" ? "wholesale" : "retail");

export const marketModeLabel = (mode: MarketMode) => (mode === "zero_km" ? "B2B Wholesale" : "B2C Retail");

export const scopedStorageKey = (base: string, mode: MarketMode) => `${base}__${mode}`;

export const getClientMarketMode = (): MarketMode => {
    if (typeof window === "undefined") return DEFAULT_MARKET_MODE;
    const raw = window.localStorage.getItem(MARKET_MODE_STORAGE_KEY);
    return normalizeMarketMode(raw);
};

export const setClientMarketMode = (mode: MarketMode) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MARKET_MODE_STORAGE_KEY, mode);
    document.cookie = `${MARKET_MODE_COOKIE_KEY}=${mode}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    window.dispatchEvent(new CustomEvent("adpg-market-changed", { detail: { mode } }));
};
