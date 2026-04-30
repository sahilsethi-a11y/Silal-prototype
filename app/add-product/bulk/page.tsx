import BulkUploadWizard from "@/components/bulk-upload/BulkUploadWizard";
import { getBrands, getFilters } from "@/lib/data";
import { MarketType } from "@/validation/vehicle-schema";
import { parseMarketMode } from "@/lib/marketplace";

export default async function BulkAddVehiclePage({
    searchParams,
}: Readonly<{ searchParams: Promise<{ market?: string; marketType?: MarketType }> }>) {
    const { market, marketType } = await searchParams;
    const marketMode = parseMarketMode(market) ?? parseMarketMode(marketType);
    const normalizedMarketType = marketMode === "zero_km" ? MarketType.ZERO_KM : MarketType.SECOND_HAND;
    const [brandData, filterData] = await Promise.all([getBrands(), getFilters()]);

    return (
        <main>
            <div className="container mx-auto max-w-6xl px-4 py-8">
                <BulkUploadWizard marketType={normalizedMarketType} brands={brandData.data} filterData={filterData.data} />
            </div>
        </main>
    );
}
