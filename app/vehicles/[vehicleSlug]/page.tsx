import { marketModeToParam, parseMarketMode } from "@/lib/marketplace";
import { redirect } from "next/navigation";

type LegacyVehicleDetailsPageProps = {
    params: Promise<{ vehicleSlug: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const toProductsDetailQuery = (params: Record<string, string | string[] | undefined>) => {
    const next = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue;
        const values = Array.isArray(value) ? value : [value];

        if (key === "market" || key === "marketType") {
            const mode = parseMarketMode(values[0]);
            if (mode) next.set("market", marketModeToParam(mode));
            continue;
        }

        for (const item of values) {
            if (item) next.append(key, item);
        }
    }

    return next.toString();
};

export default async function LegacyVehicleDetailsRedirect({
    params,
    searchParams,
}: Readonly<LegacyVehicleDetailsPageProps>) {
    const { vehicleSlug } = await params;
    const query = toProductsDetailQuery((await searchParams) ?? {});

    redirect(`/products/${vehicleSlug}${query ? `?${query}` : ""}`);
}
