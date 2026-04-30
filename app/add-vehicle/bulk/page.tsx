import { marketModeToParam, parseMarketMode } from "@/lib/marketplace";
import { redirect } from "next/navigation";

type LegacyBulkAddVehiclePageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const toBulkAddProductQuery = (params: Record<string, string | string[] | undefined>) => {
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

export default async function BulkAddVehicleRedirect({ searchParams }: Readonly<LegacyBulkAddVehiclePageProps>) {
    const query = toBulkAddProductQuery((await searchParams) ?? {});

    redirect(`/add-product/bulk${query ? `?${query}` : ""}`);
}
