import ListingModerationTab from "@/components/admin/ListingModerationTab";
import { api } from "@/lib/api/server-request";
import { getBrands, getFilters } from "@/lib/data";
import { type Data } from "@/components/admin/ListingModerationTab";

export default async function Listings() {
    const fallbackData: Data = {
        totalItems: 0,
        last: true,
        content: [],
        currentPage: 1,
        size: 10,
        totalPages: 1,
    };

    let listingsData = fallbackData;
    try {
        const res = await api.get<{ data: Data }>("/inventory/api/v1/inventory/adminList", {
            params: { size: 10 },
        });
        listingsData = res?.data ?? fallbackData;
    } catch {
        listingsData = fallbackData;
    }

    const brandRes = getBrands().catch(() => ({ data: [] }));
    const filterRes = getFilters().catch(() => ({ data: {} as Record<string, unknown> }));
    return (
        <main>
            <ListingModerationTab data={listingsData} brandRes={brandRes} filterRes={filterRes} />
        </main>
    );
}
