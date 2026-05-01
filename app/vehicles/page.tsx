import { marketModeToParam, parseMarketMode } from "@/lib/marketplace";
import { redirect } from "next/navigation";

export type { Content, Data, Inventory } from "@/app/products/page";

type LegacyVehiclesPageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const toProductsQuery = (params: Record<string, string | string[] | undefined>) => {
    const next = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue;
        const values = Array.isArray(value) ? value : [value];

        if (key === "market" || key === "marketType") {
            const mode = parseMarketMode(values[0]);
            if (mode) next.set("market", marketModeToParam(mode));
            continue;
        }
        if (key === "mode") {
            const mode = parseMarketMode(values[0]);
            if (mode) next.set("market", marketModeToParam(mode));
            continue;
        }
        if (key === "category") {
            for (const item of values) {
                if (item) next.append("bodyType", item);
            }
            continue;
        }

        for (const item of values) {
            if (item) next.append(key, item);
        }
    }

    return next.toString();
};

export default async function VehiclesRedirect({ searchParams }: Readonly<LegacyVehiclesPageProps>) {
    const query = toProductsQuery((await searchParams) ?? {});

    redirect(query ? `/products?${query}` : "/products");
}
