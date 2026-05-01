import { ArrowLeftIcon, CheckCircleIcon } from "@/components/Icons";
import Link from "next/link";
import ImageCarousel from "@/components/vehicle-details/ImageCarousel";
import ShortList from "@/components/vehicle-details/ShortList";
import QRShare from "@/components/vehicle-details/QRShare";
import FeaturesTable from "@/components/vehicle-details/FeaturesTable";
import VehicleSpecs from "@/components/vehicle-details/VehicleSpecs";
import VehicleViewTracker from "@/components/vehicle-details/VehicleViewTracker";
import VehicleDetails, { type VehicleDetailsData } from "@/components/vehicle-details/VehicleDetails";
import type { Specification } from "@/components/vehicle-details/VehicleSpecs";
import PriceBadge from "@/elements/PriceBadge";
import { convertPrice, formatPrice } from "@/lib/utils";
import { marketModeToParam, normalizeMarketMode } from "@/lib/marketplace";
import ZeroKmQuantityCard from "@/components/vehicle-details/ZeroKmQuantityCard";
import IndicativePriceBadge from "@/components/vehicle-details/IndicativePriceBadge";
import B2CAddToCartButton from "@/components/buyer/B2CAddToCartButton";
import { notFound } from "next/navigation";
import { uaeProductCatalog } from "@/data/uaeProducts";
import MarketModeSync from "@/components/MarketModeSync";
import { getCurrency } from "@/lib/serverActions";
import RatingsReviews, { type ReviewItem } from "@/components/RatingsReviews";

type Data = {
    id: string;
    imageUrls: string[];
    name: string;
    price: string;
    description: string;
    currency: string;
    condition: string;
    features: string[];
    sellerInformation: {
        id: string;
        name: string;
        address: string;
    };
    vehicleDetails: VehicleDetailsData[];
    specificationIcons: Specification[];
    isFavourite: boolean;
    vin?: string;
    brand?: string;
    model?: string;
    variant?: string;
    year?: number;
    color?: string;
    colorOptions?: string[];
    bodyType?: string;
};

type SeedVehicle = {
    id?: string;
    isFavourite?: boolean;
    user?: {
        roleMetaData?: {
            companyName?: string;
            dealershipName?: string;
        };
    };
    inventoryData?: {
        id?: string;
        mileage?: string | number;
        numberOfOwners?: string | number;
        warrantyRemaining?: string | number;
        inspectionReportUrl?: string;
        vin?: string;
    };
    inventory: {
        id: string;
        brand?: string;
        model?: string;
        variant?: string;
        year?: number;
        bodyType?: string;
        condition?: string;
        color?: string;
        colorOptions?: string[];
        city?: string;
        country?: string;
        fuelType?: string;
        transmission?: string;
        drivetrain?: string;
        engineSize?: string | number;
        seatingCapacity?: string | number;
        numberOfDoors?: string | number;
        features?: string[];
        imageUrls?: string[];
        mainImageUrl?: string;
        price?: string | number;
        currency?: string;
        description?: string;
        userId?: string;
    };
};

const toLocalDetailsData = (seed: SeedVehicle, marketMode: "second_hand" | "zero_km"): Data => {
    const inv = seed.inventory;
    const invData = seed.inventoryData;
    const year = Number(inv.year) || undefined;
    const brand = inv.brand || "";
    const model = inv.model || "";
    const variant = inv.variant || "";
    const name = [brand, model, variant].filter(Boolean).join(" ").trim() || "Product";
    const images = (inv.imageUrls && inv.imageUrls.length ? inv.imageUrls : [inv.mainImageUrl || "/seed-images/01a925d2f23d5cc8.jpg"]).filter(Boolean) as string[];
    const sellerName = seed.user?.roleMetaData?.companyName || seed.user?.roleMetaData?.dealershipName || "Unknown Supplier";
    const address = [inv.city, inv.country].filter(Boolean).join(", ");
    const mileageRaw = invData?.mileage ?? "";
    const mileage = marketMode === "zero_km" ? "Bulk stock" : String(mileageRaw || "Ready");
    const numberOfOwners = String(invData?.numberOfOwners ?? "UAE origin pending");
    const warrantyRemaining = String(invData?.warrantyRemaining ?? "Available");
    const inspectionReportUrl = marketMode === "zero_km" ? "" : String(invData?.inspectionReportUrl || "");
    const palette = ["White", "Black", "Silver", "Blue", "Red", "Gray"];
    const c1 = inv.color || "White";
    const c2 = palette[(inv.id?.length || 0) % palette.length];
    const c3 = palette[((inv.id?.length || 0) + 2) % palette.length];
    const seedColorOptions = Array.isArray(inv.colorOptions) ? inv.colorOptions.filter(Boolean) : [];
    const colorOptions = Array.from(new Set([c1, ...seedColorOptions, c2, c3].filter(Boolean)));

    const specificationIcons: Specification[] = [
        { key: "Product Type", value: inv.fuelType || "N/A", icon: "/assets/marketplace.svg" },
        { key: "Selling Model", value: inv.transmission || "N/A", icon: "/assets/clock.svg" },
        { key: "Category", value: inv.bodyType || "N/A", icon: "/assets/briefcase.svg" },
        { key: "Supply Channel", value: inv.drivetrain || "N/A", icon: "/assets/target.svg" },
        { key: "Pack Size", value: variant || "N/A", icon: "/assets/delivery.svg" },
        { key: "Supplier", value: sellerName, icon: "/assets/users.svg" },
    ];

    return {
        id: inv.id,
        imageUrls: images,
        name,
        price: String(inv.price ?? "0"),
        description: inv.description || "No description available.",
        currency: inv.currency || "USD",
        condition: marketMode === "zero_km" ? "" : inv.condition || "",
        features: inv.features || [],
        sellerInformation: {
            id: inv.userId || "",
            name: sellerName,
            address,
        },
        vehicleDetails: [
            {
                id: invData?.id || inv.id,
                mileage,
                numberOfOwners,
                warrantyRemaining,
                inspectionReportUrl,
            },
        ],
        specificationIcons,
        isFavourite: Boolean(seed.isFavourite),
        vin: invData?.vin || "",
        brand,
        model,
        variant,
        year,
        color: inv.color || "",
        colorOptions,
        bodyType: inv.bodyType || "",
    };
};

const buildProductReviews = (productName: string, sellerName: string): ReviewItem[] => [
    {
        id: "product-review-1",
        author: "Mariam A.",
        role: "Retail buyer",
        rating: 5,
        title: "Quality matched the listing",
        body: `${productName} arrived in the condition described, with clear packaging details and responsive supplier updates.`,
        date: "Apr 2026",
        verified: true,
    },
    {
        id: "product-review-2",
        author: "Omar K.",
        role: "Procurement lead",
        rating: 4,
        title: "Reliable for repeat orders",
        body: `${sellerName} confirmed availability quickly and the product specifications were easy to validate before checkout.`,
        date: "Mar 2026",
        verified: true,
    },
];

export default async function page({
    params,
    searchParams,
}: {
    params: Promise<{ productSlug: string }>;
    searchParams?: Promise<{ sellerId?: string; market?: string; units?: string }>;
}) {
    const { productSlug } = await params;
    const resolvedSearchParams = await searchParams;
    const sellerIdFromQuery =
        typeof resolvedSearchParams?.sellerId === "string" ? decodeURIComponent(resolvedSearchParams.sellerId) : undefined;
    const marketMode = normalizeMarketMode(resolvedSearchParams?.market);
    const selectedCurrency = await getCurrency();
    const availableUnits = Math.max(1, Number(resolvedSearchParams?.units || "1") || 1);

    const seedVehicle = (uaeProductCatalog as SeedVehicle[]).find((v) => String(v?.inventory?.id || v?.id) === String(productSlug));
    if (!seedVehicle) notFound();
    const data = toLocalDetailsData(seedVehicle, marketMode);
    const displayPrice = convertPrice(data.price, data.currency, selectedCurrency);
    const marketplaceHref = `/products?market=${marketModeToParam(marketMode)}`;
    return (
        <main className="container mx-auto px-4 lg:px-6">
            <MarketModeSync mode={marketMode} />
            <VehicleViewTracker vehicleId={productSlug} />
            <div className="min-h-screen bg-white">
                <div className="bg-white border-b py-4 border-gray-100">
                    <Link
                        href={marketplaceHref}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-6 h-9 py-2 border bg-white">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Marketplace
                    </Link>
                </div>
                {data && (
                    <div className="py-15">
                        <div className="lg:grid lg:grid-cols-[5fr_2fr] gap-15 items-start">
                            <div className="">
                                <div className="space-y-[21px]">
                                    <ImageCarousel images={data.imageUrls} />
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {data?.condition && (
                                            <span className="font-medium w-fit whitespace-nowrap bg-white text-gray-700 border border-gray-300 text-sm px-3 py-1.5 rounded-md shadow-sm">
                                                {data.condition}
                                            </span>
                                        )}
                                        <span
                                            className={`font-medium w-fit whitespace-nowrap border  text-sm px-3 py-1.5 rounded-md ${
                                                data.vehicleDetails.length > 1 ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-50 text-gray-600 border-gray-300"
                                            }`}>
                                            {data.vehicleDetails.length > 1 ? "Bulk purchase available" : "Retail-ready SKU"}
                                        </span>
                                        <span className="font-medium w-fit whitespace-nowrap border border-transparent bg-brand-blue text-white text-sm px-3 py-1.5 rounded-md">Verified Supplier</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-6">
                                        <ShortList inventoryId={productSlug} isLike={data?.isFavourite} />
                                        <QRShare vehicleUrl={`/products/${productSlug}`} />
                                    </div>
                                    <div className="space-y-6">
                                        <VehicleSpecs data={data.specificationIcons} />
                                        <div className="bg-white rounded-xl border border-[rgba(36,39,44,0.1)] p-4 md:p-7.5">
                                            <h3 className="text-xl font-semibold text-black mb-4">Description</h3>
                                            <p className="text-[15px] text-[#4d4f53] leading-5.5">{data.description}</p>
                                        </div>
                                        <VehicleDetails data={data.vehicleDetails} hideInspectionReport={true} />
                                        {data.features.length > 0 && <FeaturesTable data={data.features} />}
                                        <RatingsReviews
                                            title="Product Ratings & Reviews"
                                            subtitle="Feedback from verified buyers who ordered or evaluated this product."
                                            rating={4.7}
                                            reviewCount={128}
                                            reviews={buildProductReviews(data.name, data.sellerInformation.name)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full space-y-6 lg:sticky lg:top-24 self-start">
                                <div className="bg-white rounded-xl border border-stroke-light p-7.5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-right">
                                            <div className="flex gap-1 items-center justify-end">
                                                <div className="text-[30px] font-bold text-brand-blue">{formatPrice(displayPrice, selectedCurrency)}</div>
                                                <PriceBadge />
                                                {marketMode === "zero_km" ? <IndicativePriceBadge /> : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[16px] text-[#4d4f53] mb-6">{data.name}</div>
                                    {marketMode === "zero_km" ? null : (
                                        <div className="mb-6 grid gap-2 text-sm text-gray-700">
                                            <div className="flex items-center gap-2 rounded-md bg-accent px-3 py-2">
                                                <CheckCircleIcon className="h-4 w-4 text-brand-blue" />
                                                AI image classification complete
                                            </div>
                                            <div className="flex items-center gap-2 rounded-md bg-accent px-3 py-2">
                                                <CheckCircleIcon className="h-4 w-4 text-brand-blue" />
                                                Supplier KYC verified
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {marketMode === "zero_km" ? (
                                    <ZeroKmQuantityCard
                                        marketMode={marketMode}
                                        vehicleId={data.id}
                                        availableUnits={availableUnits}
                                        name={data.name}
                                        year={data.year}
                                        location={data.sellerInformation?.address || ""}
                                        price={displayPrice}
                                        currency={selectedCurrency || "USD"}
                                        mainImageUrl={data.imageUrls?.[0] || ""}
                                        sellerId={data.sellerInformation?.id || sellerIdFromQuery}
                                        sellerCompany={data.sellerInformation?.name || "Unknown Supplier"}
                                        brand={data.brand}
                                        model={data.model}
                                        variant={data.variant}
                                        color={data.color}
                                        colorOptions={data.colorOptions}
                                        condition={data.condition}
                                        bodyType={data.bodyType}
                                    />
                                ) : (
                                    <div className="bg-white rounded-xl border border-stroke-light p-5">
                                        <B2CAddToCartButton
                                            productId={data.id}
                                            name={data.name}
                                            price={displayPrice}
                                            currency={selectedCurrency || "AED"}
                                            imageUrl={data.imageUrls?.[0] || ""}
                                            supplier={data.sellerInformation?.name || ""}
                                        />
                                    </div>
                                )}
                                <SellerCard sellerInfo={data.sellerInformation} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

const SellerCard = ({
    sellerInfo,
}: Readonly<{
    sellerInfo: {
        name: string;
        address: string;
        id: string;
    };
}>) => {
    return (
        <div className="bg-white rounded-xl border border-stroke-light p-7.5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-brand-blue">Supplier Information</h3>
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1  text-brand-blue border-brand-blue">
                    Verified
                </span>
            </div>
            <div className="space-y-3">
                <div>
                    <div className="text-base font-semibold text-black">{sellerInfo.name}</div>
                    <div className="text-xs text-[#4d4f53]">{sellerInfo.address}</div>
                </div>
                <Link
                    href={`/seller-details/${sellerInfo.id}`}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all shrink-0 outline-none h-9 px-4 py-2 w-full mt-4 border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                    View Supplier Profile
                </Link>
            </div>
        </div>
    );
};
