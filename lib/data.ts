import { cache } from "react";
import { api } from "@/lib/api/client-request";
import { UAE_MARKETPLACE_LOCATIONS, getUaeProductBrands, uaeProductFilterData } from "@/data/uaeProducts";

export type Brand = {
    displayName: string;
    id: string;
    name: string;
};

export type Model = {
    displayName: string;
    id: string;
    modelId: string;
    modelName: string;
};

export type Variant = {
    id: string;
    variantName: string;
    oemId: string;
    modelId: string;
};

type FilterOption = {
    label: string;
    value: string;
    hex?: string;
};

type FilterMap = Record<string, unknown>;

const FALLBACK_CITIES_BY_COUNTRY: Record<string, { id: string; name: string }[]> = {
    AE: UAE_MARKETPLACE_LOCATIONS.map((location) => ({
        id: `ae-${location.value.toLowerCase().replace(/\s+/g, "-")}`,
        name: location.value,
    })),
};

const FALLBACK_BRAND_MODEL_VARIANTS: Record<string, Record<string, string[]>> = {
    "silal fresh": {
        "Hydroponic Tomato Box": ["5 kg carton", "Retail punnet"],
        "Weekly UAE Farm Box": ["8 to 10 items", "Family basket"],
    },
    "silal food": {
        "Premium Rice Essentials": ["5 kg bag", "Wholesale carton"],
        "Pantry Staples Bundle": ["Retail pack", "Horeca pack"],
    },
    "al dhafra": {
        "Premium Dates Selection": ["1 kg gift box", "Corporate case"],
    },
    "desert line": {
        "Linen Abaya": ["S to XL", "Made to order"],
    },
    "sharjah textile": {
        "Kandora Fabric Roll": ["30 meter roll", "Uniform house pack"],
    },
    "majlis play": {
        "Arabic STEM Board Game": ["Bilingual edition", "School pack"],
    },
    "farmers market": {
        "Weekly UAE Farm Box": ["8 to 10 items", "Family basket"],
    },
    "uae makers": {
        "Corporate Gift Hamper": ["Dates, coffee, craft goods", "Enterprise case"],
    },
};

const FALLBACK_FILTERS = uaeProductFilterData as Record<string, FilterOption[]>;

const normalizeRef = (value: string) => value.trim().toLowerCase();

const cloneFallback = (key: keyof typeof FALLBACK_FILTERS): FilterOption[] => FALLBACK_FILTERS[key].map((item) => ({ ...item }));

const normalizeFilters = (data?: FilterMap | null): FilterMap => {
    const raw = data ?? {};

    return {
        ...raw,
        country: cloneFallback("country"),
        bodyType: cloneFallback("bodyType"),
        fuelTypeOptions: cloneFallback("fuelTypeOptions"),
        transmissionOptions: cloneFallback("transmissionOptions"),
        regionalSpecsOptions: cloneFallback("regionalSpecsOptions"),
        drivetrainOptions: cloneFallback("drivetrainOptions"),
        bodyConditionOptions: cloneFallback("bodyConditionOptions"),
        currency: cloneFallback("currency"),
        colors: cloneFallback("colors"),
        priceRange: cloneFallback("priceRange"),
        sellerTypeOptions: cloneFallback("sellerTypeOptions"),
    };
};

const FALLBACK_BRANDS: Brand[] = getUaeProductBrands();

const getFallbackModels = (brand: string): Model[] => {
    const key = normalizeRef(brand);
    const models = FALLBACK_BRAND_MODEL_VARIANTS[key];
    if (!models) return [];
    return Object.keys(models).map((modelName) => ({
        id: `${key}-${normalizeRef(modelName).replace(/\s+/g, "-")}`,
        displayName: modelName,
        modelId: modelName,
        modelName,
    }));
};

const getFallbackVariants = (model: string): Variant[] => {
    const normalizedModel = normalizeRef(model);
    const hit = Object.entries(FALLBACK_BRAND_MODEL_VARIANTS).find(([, modelMap]) =>
        Object.keys(modelMap).some((name) => normalizeRef(name) === normalizedModel)
    );
    if (!hit) return [];
    const [brandKey, modelMap] = hit;
    const modelName = Object.keys(modelMap).find((name) => normalizeRef(name) === normalizedModel);
    if (!modelName) return [];

    return modelMap[modelName].map((variantName) => ({
        id: `${brandKey}-${normalizeRef(modelName).replace(/\s+/g, "-")}-${normalizeRef(variantName).replace(/\s+/g, "-")}`,
        variantName,
        oemId: brandKey,
        modelId: modelName,
    }));
};

export const getFilters = async () => {
    try {
        const res = await api.get<{ data: Record<string, unknown> }>("/masters/api/filters/map", { cacheRevalidate: 300 }); // 300 seconds or 5 min cache
        return { ...res, data: normalizeFilters(res.data) };
    } catch {
        return { data: normalizeFilters() };
    }
};

export const getBrands = cache(async () => {
    return { data: FALLBACK_BRANDS };
});

export const getModals = cache(async (brand: string) => {
    const fallbackModels = getFallbackModels(brand);
    if (fallbackModels.length) return { data: fallbackModels };

    try {
        const res = await api.get<{ data: Model[] }>("/masters/api/v1/mtoc/brands/models", { params: { ref: brand } });
        if (res?.data?.length) return res;
        return { data: fallbackModels };
    } catch {
        return { data: fallbackModels };
    }
});

export const getVariants = cache(async (model: string) => {
    const fallbackVariants = getFallbackVariants(model);
    if (fallbackVariants.length) return { data: fallbackVariants };

    try {
        const res = await api.get<{ data: Variant[] }>("/masters/api/v1/mtoc/models/variants", { params: { ref: model } });
        if (res?.data?.length) return res;
        return { data: fallbackVariants };
    } catch {
        return { data: fallbackVariants };
    }
});

export const getCountryDetails = cache(async (countryCode: string) => {
    try {
        return await api.get<{ data: { id: string }[] }>("/masters/api/v1/locations/roots/" + countryCode);
    } catch {
        return { data: [] };
    }
});

export const getCities = cache(async (countryCode: string) => {
    const normalizedCode = (countryCode || "").trim().toUpperCase();
    const selectedUaeLocation = UAE_MARKETPLACE_LOCATIONS.find((location) => location.value.toUpperCase() === normalizedCode);
    if (selectedUaeLocation) {
        return {
            data: [
                {
                    id: `ae-${selectedUaeLocation.value.toLowerCase().replace(/\s+/g, "-")}`,
                    name: selectedUaeLocation.value,
                },
            ],
        };
    }
    try {
        const res = await getCountryDetails(normalizedCode);
        const countryId = res.data?.[0]?.id;
        if (!countryId) {
            return { data: FALLBACK_CITIES_BY_COUNTRY[normalizedCode] ?? [] };
        }

        const cities = await api.get<{ data: { id: string; name: string }[] }>(`/masters/api/v1/locations/${countryId}/children`);
        if (!cities?.data?.length) {
            return { data: FALLBACK_CITIES_BY_COUNTRY[normalizedCode] ?? [] };
        }
        return cities;
    } catch {
        return { data: FALLBACK_CITIES_BY_COUNTRY[normalizedCode] ?? [] };
    }
});

export const uploadFile = async <T>(file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    return api.post<T>("/users/api/v1/users/upload", { body: formData });
};
