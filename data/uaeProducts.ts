export type UaeProductListing = {
    id: string;
    isFavourite: boolean;
    inventoryData?: {
        id?: string;
        mileage?: string | number;
        numberOfOwners?: string | number;
        warrantyRemaining?: string | number;
        inspectionReportUrl?: string;
        vin?: string;
    };
    user: {
        userId?: string;
        roleMetaData: {
            companyName?: string;
            dealershipName?: string;
        };
    };
    inventory: {
        id: string;
        brand: string;
        model: string;
        variant?: string;
        condition: string;
        year: number;
        bodyType: string;
        city: string;
        country: string;
        fuelType: string;
        transmission: string;
        drivetrain?: string;
        mainImageUrl: string;
        imageUrls?: string[];
        bulkPurchaseAvailable: boolean;
        vehicleUrl: string;
        price: string;
        userId: string;
        inventoryList: string[];
        views: string;
        currency: string;
        marketType?: "second_hand" | "zero_km";
        color?: string;
        colorOptions?: string[];
        description?: string;
        features?: string[];
    };
};

export const uaeProductCatalog: UaeProductListing[] = [
    {
        id: "uae-fresh-tomatoes",
        isFavourite: false,
        user: { userId: "supplier-al-ain-farms", roleMetaData: { companyName: "Al Ain Smart Farms" } },
        inventoryData: { id: "lot-tomatoes-2026", mileage: "Harvested daily", numberOfOwners: "1", warrantyRemaining: "Cold chain verified" },
        inventory: {
            id: "uae-fresh-tomatoes",
            brand: "Silal Fresh",
            model: "Hydroponic Tomato Box",
            variant: "5 kg carton",
            condition: "AI classified",
            year: 2026,
            bodyType: "Food",
            city: "Al Ain",
            country: "United Arab Emirates",
            fuelType: "Fresh Produce",
            transmission: "B2C + B2B",
            drivetrain: "Retail Pack",
            mainImageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
            imageUrls: [
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80",
            ],
            bulkPurchaseAvailable: true,
            vehicleUrl: "/products/uae-fresh-tomatoes",
            price: "18",
            userId: "supplier-al-ain-farms",
            inventoryList: ["lot-tomatoes-2026"],
            views: "142",
            currency: "AED",
            color: "Green",
            colorOptions: ["Green", "Red"],
            description: "UAE-grown hydroponic tomatoes packed for grocery, hotel, and restaurant buyers with AI image grading and cold-chain traceability.",
            features: ["UAE origin certificate", "Same-day dispatch", "AI freshness grade", "Wholesale carton pricing"],
        },
    },
    {
        id: "uae-dates-selection",
        isFavourite: false,
        user: { userId: "supplier-dhafra-dates", roleMetaData: { companyName: "Al Dhafra Dates" } },
        inventoryData: { id: "lot-dates-2026", mileage: "2026 season", numberOfOwners: "1", warrantyRemaining: "Shelf stable" },
        inventory: {
            id: "uae-dates-selection",
            brand: "Al Dhafra",
            model: "Premium Dates Selection",
            variant: "1 kg gift box",
            condition: "KYC verified",
            year: 2026,
            bodyType: "Food",
            city: "Abu Dhabi",
            country: "United Arab Emirates",
            fuelType: "Dates & Snacks",
            transmission: "B2C + B2B",
            drivetrain: "Corporate Gifting",
            mainImageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=80",
            imageUrls: ["https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=80"],
            bulkPurchaseAvailable: true,
            vehicleUrl: "/products/uae-dates-selection",
            price: "65",
            userId: "supplier-dhafra-dates",
            inventoryList: ["lot-dates-2026"],
            views: "98",
            currency: "AED",
            color: "Brown",
            colorOptions: ["Brown", "Gold"],
            description: "Locally packed Emirati dates for household orders, travel retail, and corporate gifting programs.",
            features: ["Made in UAE packaging", "Gift-ready SKU", "Batch QR traceability", "B2B volume breaks"],
        },
    },
    {
        id: "uae-rice-essentials",
        isFavourite: false,
        user: { userId: "supplier-silal-food", roleMetaData: { companyName: "Silal Food" } },
        inventoryData: { id: "lot-rice-2026", mileage: "Fresh stock", numberOfOwners: "1", warrantyRemaining: "12 months" },
        inventory: {
            id: "uae-rice-essentials",
            brand: "Silal Food",
            model: "Premium Rice Essentials",
            variant: "5 kg bag",
            condition: "Compliance checked",
            year: 2026,
            bodyType: "Food",
            city: "Abu Dhabi",
            country: "United Arab Emirates",
            fuelType: "Pantry Essentials",
            transmission: "B2C + B2B",
            drivetrain: "Wholesale Carton",
            mainImageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
            imageUrls: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80"],
            bulkPurchaseAvailable: true,
            vehicleUrl: "/products/uae-rice-essentials",
            price: "32",
            userId: "supplier-silal-food",
            inventoryList: ["lot-rice-2026"],
            views: "117",
            currency: "AED",
            color: "White",
            colorOptions: ["White"],
            description: "Essential food SKU for homes, groceries, wholesalers, and Horeca procurement teams.",
            features: ["Halal documentation", "Warehouse stock", "Retail and Horeca packs", "Supplier score 98"],
        },
    },
    {
        id: "uae-linen-abaya",
        isFavourite: false,
        user: { userId: "supplier-dubai-design", roleMetaData: { companyName: "Dubai Design Cooperative" } },
        inventoryData: { id: "style-abaya-2026", mileage: "New season", numberOfOwners: "1", warrantyRemaining: "Size exchange eligible" },
        inventory: {
            id: "uae-linen-abaya",
            brand: "Desert Line",
            model: "Linen Abaya",
            variant: "S to XL",
            condition: "AI image matched",
            year: 2026,
            bodyType: "Clothing",
            city: "Dubai",
            country: "United Arab Emirates",
            fuelType: "Fashion",
            transmission: "B2C",
            drivetrain: "Retail Pack",
            mainImageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
            imageUrls: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"],
            bulkPurchaseAvailable: false,
            vehicleUrl: "/products/uae-linen-abaya",
            price: "280",
            userId: "supplier-dubai-design",
            inventoryList: ["style-abaya-2026"],
            views: "86",
            currency: "AED",
            color: "Black",
            colorOptions: ["Black", "Sand", "Olive"],
            description: "UAE-designed modest fashion piece with image-based style classification and size recommendation support.",
            features: ["Made in UAE label", "AI size guidance", "Designer verified", "Retail fulfillment"],
        },
    },
    {
        id: "uae-kandora-fabric",
        isFavourite: false,
        user: { userId: "supplier-sharjah-textile", roleMetaData: { companyName: "Sharjah Textile Works" } },
        inventoryData: { id: "fabric-kandora-2026", mileage: "Factory stock", numberOfOwners: "1", warrantyRemaining: "QC approved" },
        inventory: {
            id: "uae-kandora-fabric",
            brand: "Sharjah Textile",
            model: "Kandora Fabric Roll",
            variant: "30 meter roll",
            condition: "Factory verified",
            year: 2026,
            bodyType: "Clothing",
            city: "Sharjah",
            country: "United Arab Emirates",
            fuelType: "Textile & Uniform",
            transmission: "B2B",
            drivetrain: "Wholesale Carton",
            mainImageUrl: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1200&q=80",
            imageUrls: ["https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=1200&q=80"],
            bulkPurchaseAvailable: true,
            vehicleUrl: "/products/uae-kandora-fabric",
            price: "110",
            userId: "supplier-sharjah-textile",
            inventoryList: ["fabric-kandora-2026"],
            views: "64",
            currency: "AED",
            color: "White",
            colorOptions: ["White", "Cream", "Blue"],
            description: "Locally finished fabric roll for tailors, uniform houses, and hospitality procurement.",
            features: ["Factory KYC approved", "Bulk RFQ enabled", "Fabric image identification", "Certificate upload ready"],
        },
    },
    {
        id: "uae-stem-board-game",
        isFavourite: false,
        user: { userId: "supplier-ad-game-lab", roleMetaData: { companyName: "Abu Dhabi Game Lab" } },
        inventoryData: { id: "game-stem-2026", mileage: "New edition", numberOfOwners: "1", warrantyRemaining: "Retail sealed" },
        inventory: {
            id: "uae-stem-board-game",
            brand: "Majlis Play",
            model: "Arabic STEM Board Game",
            variant: "Bilingual edition",
            condition: "Content verified",
            year: 2026,
            bodyType: "Games",
            city: "Abu Dhabi",
            country: "United Arab Emirates",
            fuelType: "Educational Games",
            transmission: "B2C + B2B",
            drivetrain: "School Procurement",
            mainImageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80",
            imageUrls: ["https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80"],
            bulkPurchaseAvailable: true,
            vehicleUrl: "/products/uae-stem-board-game",
            price: "145",
            userId: "supplier-ad-game-lab",
            inventoryList: ["game-stem-2026"],
            views: "73",
            currency: "AED",
            color: "Multicolor",
            colorOptions: ["Multicolor"],
            description: "UAE-made bilingual educational game for families, schools, and corporate learning programs.",
            features: ["Age classification", "AI content tagging", "School bulk packs", "Arabic and English"],
        },
    },
    {
        id: "uae-weekly-farm-box",
        isFavourite: false,
        user: { userId: "supplier-local-farmer-network", roleMetaData: { companyName: "Local Farmer Network" } },
        inventoryData: { id: "farm-box-2026", mileage: "Weekly harvest", numberOfOwners: "1", warrantyRemaining: "Freshness guarantee" },
        inventory: {
            id: "uae-weekly-farm-box",
            brand: "Farmers Market",
            model: "Weekly UAE Farm Box",
            variant: "8 to 10 items",
            condition: "Origin verified",
            year: 2026,
            bodyType: "Food",
            city: "Abu Dhabi",
            country: "United Arab Emirates",
            fuelType: "Fresh Produce",
            transmission: "B2C",
            drivetrain: "Subscription",
            mainImageUrl: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80",
            imageUrls: ["https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80"],
            bulkPurchaseAvailable: false,
            vehicleUrl: "/products/uae-weekly-farm-box",
            price: "89",
            userId: "supplier-local-farmer-network",
            inventoryList: ["farm-box-2026"],
            views: "156",
            currency: "AED",
            color: "Green",
            colorOptions: ["Green"],
            description: "Curated seasonal farm basket connecting UAE farms directly to households with freshness classification.",
            features: ["Farmer profile visible", "AI produce identification", "Subscription ready", "Same-emirate delivery"],
        },
    },
    {
        id: "uae-corporate-gift-hamper",
        isFavourite: false,
        user: { userId: "supplier-uae-makers", roleMetaData: { companyName: "UAE Makers Collective" } },
        inventoryData: { id: "gift-hamper-2026", mileage: "Made to order", numberOfOwners: "1", warrantyRemaining: "Event support" },
        inventory: {
            id: "uae-corporate-gift-hamper",
            brand: "UAE Makers",
            model: "Corporate Gift Hamper",
            variant: "Dates, coffee, craft goods",
            condition: "Supplier verified",
            year: 2026,
            bodyType: "Food",
            city: "Dubai",
            country: "United Arab Emirates",
            fuelType: "Gifting",
            transmission: "B2B",
            drivetrain: "Corporate Gifting",
            mainImageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80",
            imageUrls: ["https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80"],
            bulkPurchaseAvailable: true,
            vehicleUrl: "/products/uae-corporate-gift-hamper",
            price: "220",
            userId: "supplier-uae-makers",
            inventoryList: ["gift-hamper-2026"],
            views: "92",
            currency: "AED",
            color: "Gold",
            colorOptions: ["Gold", "Black"],
            description: "Curated UAE-made corporate hamper for events, ministries, enterprises, and hospitality gifting.",
            features: ["Custom branding", "B2B quote workflow", "Supplier KYC complete", "Batch image verification"],
        },
    },
];

type ProductOption = {
    label: string;
    value: string;
    hex?: string;
    symbol?: string;
};

export const UAE_MARKETPLACE_LOCATIONS: ProductOption[] = [
    { label: "Abu Dhabi", value: "Abu Dhabi" },
    { label: "Dubai", value: "Dubai" },
    { label: "Sharjah", value: "Sharjah" },
    { label: "Ajman", value: "Ajman" },
    { label: "Al Ain", value: "Al Ain" },
    { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
    { label: "Fujairah", value: "Fujairah" },
    { label: "Umm Al Quwain", value: "Umm Al Quwain" },
];

const colorHex: Record<string, string> = {
    black: "#111827",
    blue: "#2563EB",
    brown: "#7C4A2D",
    cream: "#F4E8CF",
    gold: "#D4AF37",
    green: "#2F7F5F",
    multicolor: "#8B5CF6",
    olive: "#6B7B3E",
    red: "#DC2626",
    sand: "#D7B98E",
    white: "#F8FAFC",
};

const optionFromValue = (value: string): ProductOption => ({ label: value, value });

const uniqueInventoryValues = (select: (item: UaeProductListing) => string | undefined): string[] =>
    Array.from(new Set(uaeProductCatalog.map(select).map((value) => value?.trim()).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));

const uniqueColorValues = (): string[] =>
    Array.from(
        new Set(
            uaeProductCatalog
                .flatMap((item) => [item.inventory.color, ...(item.inventory.colorOptions ?? [])])
                .map((value) => value?.trim())
                .filter(Boolean) as string[]
        )
    ).sort((a, b) => a.localeCompare(b));

export const uaeProductFilterData: Record<string, ProductOption[]> = {
    country: UAE_MARKETPLACE_LOCATIONS,
    bodyType: uniqueInventoryValues((item) => item.inventory.bodyType).map(optionFromValue),
    fuelTypeOptions: uniqueInventoryValues((item) => item.inventory.fuelType).map(optionFromValue),
    transmissionOptions: [
        { label: "B2C", value: "B2C" },
        { label: "B2B", value: "B2B" },
        { label: "B2C + B2B", value: "B2C + B2B" },
        { label: "Subscription", value: "Subscription" },
    ],
    regionalSpecsOptions: [
        { label: "UAE Origin", value: "UAE Origin" },
        { label: "Halal", value: "Halal" },
        { label: "HACCP", value: "HACCP" },
        { label: "Organic", value: "Organic" },
        { label: "MOIAT", value: "MOIAT" },
    ],
    drivetrainOptions: uniqueInventoryValues((item) => item.inventory.drivetrain).map(optionFromValue),
    bodyConditionOptions: uniqueInventoryValues((item) => item.inventory.condition).map(optionFromValue),
    priceRange: [
        { label: "Under AED 50", value: "0-50" },
        { label: "AED 50 - 150", value: "50-150" },
        { label: "AED 150 - 500", value: "150-500" },
        { label: "AED 500+", value: "500+" },
    ],
    sellerTypeOptions: [
        { label: "All suppliers", value: "" },
        { label: "Farmers", value: "Farmers" },
        { label: "Food brands", value: "Food brands" },
        { label: "Fashion makers", value: "Fashion makers" },
        { label: "Game creators", value: "Game creators" },
    ],
    currency: [
        { label: "AED", value: "AED", symbol: "AED" },
        { label: "USD", value: "USD", symbol: "$" },
        { label: "OMR", value: "OMR", symbol: "OMR" },
        { label: "SAR", value: "SAR", symbol: "SAR" },
    ],
    colors: uniqueColorValues().map((value) => ({
        label: value,
        value,
        hex: colorHex[value.toLowerCase()] || "#8A93A3",
    })),
};

export const getUaeProductBrands = () =>
    uniqueInventoryValues((item) => item.inventory.brand).map((brand) => ({
        id: brand,
        name: brand,
        displayName: brand,
    }));

export const getUaeProductModelOptionsByBrand = () =>
    uaeProductCatalog.reduce<Record<string, ProductOption[]>>((acc, item) => {
        const brand = item.inventory.brand;
        const model = item.inventory.model;
        if (!brand || !model) return acc;
        const current = acc[brand] ?? [];
        if (!current.some((option) => option.value === model)) {
            current.push({ label: model, value: model });
        }
        acc[brand] = current.sort((a, b) => a.label.localeCompare(b.label));
        return acc;
    }, {});
