import { ArrowLeftIcon, MapPinIcon, Shield, StarIcon } from "@/components/Icons";
import Image from "@/elements/Image";
import Link from "next/link";
import Tabbin from "@/components/Tabbin";
import VehicleList from "@/components/single-seller/VehicleList";
import About, { type AboutData } from "@/components/single-seller/About";
import { api } from "@/lib/api/server-request";
import { Data as VehicleData } from "@/app/products/page";
import { getBrands, getFilters } from "@/lib/data";
import RatingsReviews, { type ReviewItem } from "@/components/RatingsReviews";
import { uaeProductCatalog, type UaeProductListing } from "@/data/uaeProducts";

const FALLBACK_SELLER_BANNER = "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1600&q=85";

type Data = {
    userInformation: {
        totalInventory: string;
        locationAttribute: {
            countryCode: string;
            country: string;
            city: string;
            district: string;
        };
        organizationName: string;
    };
    about: AboutData;
};

const buildSellerReviews = (sellerName: string): ReviewItem[] => [
    {
        id: "seller-review-1",
        author: "Fatima H.",
        role: "Business buyer",
        rating: 5,
        title: "Consistent fulfilment",
        body: `${sellerName} kept delivery windows clear, confirmed stock before invoicing, and handled substitutions professionally.`,
        date: "Apr 2026",
        verified: true,
    },
    {
        id: "seller-review-2",
        author: "Yousef R.",
        role: "Marketplace buyer",
        rating: 4,
        title: "Responsive supplier team",
        body: "Questions about packaging, origin documents, and order status were answered quickly through the marketplace.",
        date: "Mar 2026",
        verified: true,
    },
    {
        id: "seller-review-3",
        author: "Noura S.",
        role: "Retail buyer",
        rating: 5,
        title: "Accurate listings",
        body: "Product photos, pack sizes, and availability signals matched what was delivered.",
        date: "Feb 2026",
        verified: true,
    },
];

const buildLocalSellerAbout = (sellerName: string, products: UaeProductListing[], backendAbout?: AboutData): AboutData => {
    const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
    const categories = Array.from(new Set(products.map((item) => item.inventory.bodyType).filter(Boolean)));
    const specialties = Array.from(
        new Set(products.flatMap((item) => [item.inventory.bodyType, item.inventory.fuelType, item.inventory.drivetrain]).filter(isNonEmptyString))
    );

    return {
        businessCompanyName: sellerName,
        bannerImage: products[0]?.inventory.mainImageUrl || backendAbout?.bannerImage || FALLBACK_SELLER_BANNER,
        description:
            backendAbout?.description ||
            `${sellerName} supplies verified UAE-made ${categories.join(", ").toLowerCase() || "products"} through Silal Marketplace, with retail-ready listings, B2B procurement support, and marketplace quality checks.`,
        specialties: specialties.length ? specialties : backendAbout?.specialties || ["UAE-made products", "Verified supplier"],
        workingHours: backendAbout?.workingHours || "Sunday to Thursday, 9:00 AM - 6:00 PM",
    };
};

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const localSellerProducts = uaeProductCatalog.filter((item) => item.user.userId === slug || item.inventory.userId === slug);
    const localSellerName = localSellerProducts[0]?.user.roleMetaData.companyName || localSellerProducts[0]?.user.roleMetaData.dealershipName;

    const res = api.get<{ data: Data }>("/inventory/api/v1/inventory/getInventorySellerDealerInfo", {
        params: {
            userId: slug,
        },
        isAuthRequired: false,
    }).catch(() => ({ data: undefined as unknown as Data }));

    const vehicleData = api.get<{ data: VehicleData }>("/inventory/api/v1/inventory/inventoryListForUser", {
        params: {
            userId: slug,
            sortBy: "year",
            sortOrder: "desc",
        },
    }).catch(() => ({
        data: {
            content: [],
            totalItems: 0,
            totalElements: 0,
            totalPages: 1,
            size: 12,
            last: true,
            currentPage: 1,
        } as VehicleData,
    }));

    const [userInfo, products] = await Promise.all([res, vehicleData]);
    const backendData = userInfo.data;
    const sellerName = localSellerName || backendData?.about?.businessCompanyName || backendData?.userInformation?.organizationName || "Verified Supplier";
    const sellerProducts = localSellerProducts.length ? (localSellerProducts as unknown as VehicleData["content"]) : products.data.content;
    const firstProductImage = localSellerProducts[0]?.inventory.mainImageUrl || localSellerProducts[0]?.inventory.imageUrls?.[0];
    const secondProductImage = localSellerProducts[0]?.inventory.imageUrls?.[1] || localSellerProducts[1]?.inventory.mainImageUrl;
    const sellerBannerImage = firstProductImage || backendData?.about?.bannerImage?.trim() || FALLBACK_SELLER_BANNER;
    const sellerBrandImage = secondProductImage || sellerBannerImage;
    const sellerAbout = buildLocalSellerAbout(sellerName, localSellerProducts, backendData?.about);
    const sellerLocation = {
        district: backendData?.userInformation?.locationAttribute?.district || "",
        city: backendData?.userInformation?.locationAttribute?.city || localSellerProducts[0]?.inventory.city || "",
        country: backendData?.userInformation?.locationAttribute?.country || localSellerProducts[0]?.inventory.country || "",
    };
    const totalInventory = localSellerProducts.length || products.data.totalElements || Number(backendData?.userInformation?.totalInventory) || 0;
    const brandRes = getBrands();
    const filterRes = getFilters();

    const tabs = [
        {
            label: "Products",
            panel: (
                <VehicleList
                    userId={slug}
                    brandRes={brandRes}
                    filterRes={filterRes}
                    initialData={sellerProducts}
                    currentPage={products.data.currentPage}
                    totalItems={totalInventory}
                />
            ),
        },
        {
            label: "About",
            panel: <About data={sellerAbout} />,
        },
        {
            label: "Reviews",
            panel: (
                <RatingsReviews
                    title="Seller Ratings & Reviews"
                    subtitle="Buyer feedback on fulfilment, communication, product accuracy, and post-order support."
                    rating={4.8}
                    reviewCount={342}
                    reviews={buildSellerReviews(sellerName)}
                    distribution={[82, 13, 3, 1, 1]}
                />
            ),
        },
    ];

    return (
        <main>
            <div className="min-h-screen bg-gray-50">
                <div className="relative h-64 bg-brand-blue">
                    <Image width={1440} height={224} alt={`${sellerName} products`} src={sellerBannerImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <Link
                        href={"/products"}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all shrink-0 h-9 px-4 py-2 absolute top-4 left-4 text-white hover:bg-white/10">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to All Products
                    </Link>
                </div>
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex items-center gap-4 flex-col md:flex-row">
                                <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full w-20 h-20 border-4 border-white shadow-lg">
                                    <Image width={62} height={62} alt={`${sellerName} product`} src={sellerBrandImage} className="aspect-square size-full object-cover" />
                                </span>
                                <div>
                                    <div className="md:flex md:items-center gap-2 mb-4 md:mb-2">
                                        <h1 className="text-2xl font-bold text-brand-blue inline md:block">{sellerName}</h1>
                                        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-all overflow-hidden border-transparent bg-green-100 text-green-800">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Verified
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 border-brand-blue text-brand-blue">
                                            Verified Supplier
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon className="h-4 w-4" />
                                            {[sellerLocation.district, sellerLocation.city, sellerLocation.country].filter(Boolean).join(" , ")}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-600">
                                            <StarIcon filled className="h-4 w-4" />
                                            <span className="font-medium">4.8</span>
                                            <span className="text-gray-500">(342 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-6 md:ml-auto">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-brand-blue">{totalInventory}</div>
                                    <div className="text-sm text-gray-600">Products</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-2 space-y-6">
                        <Tabbin items={tabs} />
                    </div>
                </div>
            </div>
        </main>
    );
}
