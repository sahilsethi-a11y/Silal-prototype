import FilterBar from "@/components/FilterBar";
import VehicleCardListing from "@/components/inventory-listing/VehicleCardListing";
import { marketModeToParam, normalizeMarketMode, type MarketMode } from "@/lib/marketplace";
import { getUaeProductBrands, getUaeProductModelOptionsByBrand, uaeProductCatalog, uaeProductFilterData } from "@/data/uaeProducts";

export type Content = {
    id: string;
    inventory: Inventory;
    user: userData;
    isFavourite: boolean;
    inventoryData?: {
        mileage?: string | number;
        inspectionReportUrl?: string;
        vin?: string;
        numberOfOwners?: string | number;
        warrantyRemaining?: string | number;
    };
};
export type Data = {
    content: Content[];
    totalItems: number;
    totalElements: number;
    totalPages: number;
    size: number;
    last: boolean;
    currentPage: number;
};

type userData = {
    roleMetaData: {
        companyName?: string;
        dealershipName?: string;
    };
};

export type Inventory = {
    id: string;
    brand: string;
    model: string;
    condition: string;
    year: number;
    bodyType: string;
    city: string;
    country: string;
    fuelType: string;
    transmission: string;
    mainImageUrl: string;
    imageUrls?: string[];
    bulkPurchaseAvailable: boolean;
    vehicleUrl: string;
    price: string;
    userId: string;
    inventoryList: string[];
    views: string;
    currency: string;
    marketType?: MarketMode;
    color?: string;
    colorOptions?: string[];
    variant?: string;
    description?: string;
    features?: string[];
};

export default async function ProductListing({ searchParams }: Readonly<PageProps<"/products">>) {
    const querySearchParams = await searchParams;
    const marketMode = normalizeMarketMode((querySearchParams as Record<string, string | undefined>).market);
    const newQuery = {
        ...querySearchParams,
        fuelType: querySearchParams.fuelType ?? [],
        drivetrain: querySearchParams.drivetrain ?? [],
        sortBy: "price",
        sortOrder: "asc",
        market: marketModeToParam(marketMode),
    };

    let data: Data = {
        content: [],
        totalItems: 0,
        totalElements: 0,
        totalPages: 0,
        size: 12,
        last: true,
        currentPage: 1,
    };

    try {
        const sourceProducts = uaeProductCatalog as Content[];
        const secondHandProducts = sourceProducts.map((v) => ({
            ...v,
            inventory: {
                ...v.inventory,
                marketType: "second_hand" as const,
                colorOptions: [v.inventory?.color].filter(Boolean) as string[],
            },
        }));
        const zeroKmProducts = sourceProducts
            .filter((v) => v.inventory.bulkPurchaseAvailable || v.inventory.transmission.includes("B2B"))
            .map((v) => ({
                ...v,
                inventory: {
                    ...v.inventory,
                    marketType: "zero_km" as const,
                    condition: "B2B ready",
                    colorOptions: Array.from(new Set([v.inventory?.color, ...(v.inventory?.colorOptions ?? [])].filter(Boolean))) as string[],
                },
                inventoryData: {
                    ...v.inventoryData,
                    mileage: "Bulk stock",
                    inspectionReportUrl: "",
                },
            }));
        const products = (marketMode === "zero_km" ? zeroKmProducts : secondHandProducts) as Content[];
        data = {
            content: products,
            totalItems: products.length,
            totalElements: products.length,
            totalPages: Math.max(1, Math.ceil(products.length / 12)),
            size: 12,
            last: true,
            currentPage: 1,
        };
    } catch {}

    const allContent = data.content;
    const cartInventoryIds: string[] = [];

    const brandRes = Promise.resolve({ data: getUaeProductBrands() });
    const filterRes = Promise.resolve({ data: uaeProductFilterData as Record<string, unknown> });
    const modelOptionsByBrand = getUaeProductModelOptionsByBrand();

    return (
        <main className="text-[#4a5565] container mx-auto px-4 lg:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-brand-blue">UAE-Made Marketplace</h1>
                <p className="mt-2 max-w-3xl text-gray-600">Browse verified local food, clothing, games, and supplier catalogues for B2C shopping and B2B procurement.</p>
            </div>
            <FilterBar
                brandRes={brandRes}
                filterRes={filterRes}
                parentCls="border border-stroke-light"
                selectCls="bg-input-background"
                isLabel={false}
                isClear={true}
                initialFilters={querySearchParams}
                modelOptionsByBrand={modelOptionsByBrand}
            />
            <VehicleCardListing
                key={JSON.stringify(querySearchParams)}
                initialData={allContent}
                last={true}
                currentPage={data.currentPage}
                querySearchParams={newQuery}
                totalItems={data.totalItems}
                totalPages={data.totalPages}
                pageSize={data.size}
                cartInventoryIds={cartInventoryIds}
                marketMode={marketMode}
            />
        </main>
    );
}
