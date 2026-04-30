"use client";

import { getVariants, type Brand } from "@/lib/data";
import { lookupVinOnChaboschi } from "@/lib/chaboschi";
import { MarketType } from "@/validation/vehicle-schema";
import * as XLSX from "xlsx";

export type BulkUploadField = {
    key: string;
    label: string;
    required: boolean;
    description?: string;
};

export type ParsedBulkFile = {
    headers: string[];
    rows: Record<string, string>[];
    rowCount: number;
};

export type BulkFieldSource = "seller" | "autocorrected" | "chaboschi" | "jato";
export type BulkConfidence = "pending" | "high" | "medium" | "low";
export type BulkIssue = {
    field?: string;
    message: string;
};
export type BulkCorrection = {
    original: string;
    corrected: string;
};
export type BulkMasterData = {
    brands: Brand[];
    colors: string[];
    conditions: string[];
    countries: string[];
    currencies: string[];
};
export type BulkRow = {
    id: string;
    values: Record<string, string>;
    originalValues: Record<string, string>;
    fieldSources: Record<string, BulkFieldSource>;
    fieldLocks: Record<string, boolean>;
    corrections: Record<string, BulkCorrection>;
    blockingIssues: BulkIssue[];
    warnings: BulkIssue[];
    confidence: BulkConfidence;
    selected: boolean;
    replaceExisting: boolean;
    duplicateExistingId?: string;
    enrichmentNotes?: string[];
};

export const BULK_UPLOAD_STEPS = ["Upload", "Map Headers", "Pre-Validate", "Enrich", "Review", "Submit"];

const COMMON_FIELDS: BulkUploadField[] = [
    { key: "regional_specs", label: "Regional Specs", required: true },
    { key: "make", label: "Make", required: true },
    { key: "model", label: "Model", required: true },
    { key: "variant", label: "Variant", required: true },
    { key: "year", label: "Year", required: true },
    { key: "color", label: "Color", required: true },
    { key: "currency", label: "Currency", required: true },
    { key: "city", label: "City", required: true },
    { key: "country", label: "Country", required: true },
];

const USED_ONLY_FIELDS: BulkUploadField[] = [
    { key: "vin", label: "VIN", required: true },
    { key: "number_of_owners", label: "Number of Owners", required: true },
    { key: "warranty_remaining_years", label: "Years of Warranty Remaining", required: true },
    { key: "condition", label: "Condition", required: false, description: "Fetched automatically from Chaboschi. Provide as a fallback if the VIN is not found." },
    { key: "mileage", label: "Mileage", required: true },
    { key: "incoterm", label: "Incoterm", required: true },
    { key: "price", label: "Price", required: true, description: "Use the price that matches the selected incoterm." },
    { key: "port_of_loading", label: "Port of Loading", required: true, description: "Required if using FOB." },
    { key: "port_of_destination", label: "Port of Destination", required: true, description: "Required if using CIF." },
];

const ZERO_KM_ONLY_FIELDS: BulkUploadField[] = [
    { key: "price_per_color", label: "Price per Color", required: false },
    { key: "mileage", label: "Mileage", required: true, description: "Must be 100 KM or below." },
];

const HEADER_ALIASES: Record<string, string[]> = {
    regional_specs: ["regionalspecs", "specs", "region", "specregion", "marketspecs"],
    make: ["brand", "maker", "vehiclemake"],
    model: ["vehiclemodel", "carmodel"],
    variant: ["trim", "grade", "spec", "version"],
    year: ["manufactureyear", "modelyear"],
    color: ["colour", "vehiclecolor", "paintcolor"],
    vin: ["vinnumber", "chassis", "chassisnumber"],
    number_of_owners: ["owners", "ownercount", "numberofowners"],
    warranty_remaining_years: ["warranty", "warrantyremaining", "yearsremaining"],
    condition: ["vehiclecondition", "gradecondition"],
    mileage: ["kms", "kilometers", "kilometres", "odometer"],
    incoterm: ["terms", "shippingterms", "tradeterms"],
    price: ["amount", "unitprice", "vehicleprice"],
    port_of_loading: ["loadingport", "originport", "fobport"],
    port_of_destination: ["destinationport", "arrivalport", "cifport"],
    price_per_color: ["colorprice", "colourprice", "pricebycolor"],
    currency: ["currencycode", "pricecurrency", "curr"],
    city: ["listingcity", "sellingcity", "location", "dealercity"],
    country: ["listingcountry", "sellingcountry", "dealercountry", "registrationcountry"],
};

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const normalizeValue = (value: string) => value.trim().toLowerCase();
const getSimilarityScore = (source: string, target: string) => {
    if (!source || !target) return 0;
    if (source === target) return 1;
    if (source.includes(target) || target.includes(source)) return 0.92;
    const sourceTokens = new Set(source.split(/(?=[A-Z])|_|-/).join(" ").split(/\s+/).filter(Boolean));
    const targetTokens = new Set(target.split(/(?=[A-Z])|_|-/).join(" ").split(/\s+/).filter(Boolean));
    const intersection = [...sourceTokens].filter((token) => targetTokens.has(token)).length;
    const union = new Set([...sourceTokens, ...targetTokens]).size || 1;
    return intersection / union;
};

export const getBulkUploadFields = (marketType: MarketType) => [...COMMON_FIELDS, ...(marketType === MarketType.SECOND_HAND ? USED_ONLY_FIELDS : ZERO_KM_ONLY_FIELDS)];

export const getRequiredBulkFields = (marketType: MarketType) => getBulkUploadFields(marketType).filter((field) => field.required);

export const getBulkTemplateRows = (marketType: MarketType) => {
    if (marketType === MarketType.SECOND_HAND) {
        return [
            {
                "Regional Specs": "GCC Specs",
                Make: "Toyota",
                Model: "Levin",
                Variant: "Hybrid",
                Year: "2022",
                Color: "White",
                Currency: "USD",
                City: "Dubai",
                Country: "UAE",
                VIN: "JTDBR32E720123456",
                "Number of Owners": "1",
                "Years of Warranty Remaining": "2",
                Condition: "Grade C - Fair",
                Mileage: "55000",
                Incoterm: "CIF",
                Price: "68000",
                "Port of Loading": "",
                "Port of Destination": "Jebel Ali",
            },
            {
                "Regional Specs": "Euro Specs",
                Make: "BMW",
                Model: "3 Series",
                Variant: "320i",
                Year: "2021",
                Color: "Black",
                Currency: "USD",
                City: "Dubai",
                Country: "UAE",
                VIN: "WBA5A5C58ED123456",
                "Number of Owners": "2",
                "Years of Warranty Remaining": "0",
                Condition: "Grade B - Good",
                Mileage: "42000",
                Incoterm: "FOB",
                Price: "95000",
                "Port of Loading": "Hamburg",
                "Port of Destination": "",
            },
            {
                "Regional Specs": "GCC Specs",
                Make: "Hyundai",
                Model: "Tucson",
                Variant: "Elite",
                Year: "2023",
                Color: "Silver",
                Currency: "USD",
                City: "Dubai",
                Country: "UAE",
                VIN: "KMHJ341DBNU123456",
                "Number of Owners": "1",
                "Years of Warranty Remaining": "3",
                Condition: "Grade A - Excellent",
                Mileage: "18000",
                Incoterm: "CIF",
                Price: "52000",
                "Port of Loading": "",
                "Port of Destination": "Mombasa",
            },
        ];
    }

    return [
        {
            "Regional Specs": "GCC Specs",
            Make: "Toyota",
            Model: "Corolla",
            Variant: "XLI",
            Year: "2025",
            Color: "Silver",
            Currency: "USD",
            City: "Dubai",
            Country: "UAE",
            "Price per Color": "75000",
            Mileage: "25",
        },
        {
            "Regional Specs": "GCC Specs",
            Make: "Toyota",
            Model: "Corolla",
            Variant: "XLI",
            Year: "2025",
            Color: "White",
            Currency: "USD",
            City: "Dubai",
            Country: "UAE",
            "Price per Color": "75000",
            Mileage: "0",
        },
        {
            "Regional Specs": "GCC Specs",
            Make: "Hyundai",
            Model: "Elantra",
            Variant: "GLS",
            Year: "2025",
            Color: "Blue",
            Currency: "USD",
            City: "Dubai",
            Country: "UAE",
            "Price per Color": "48000",
            Mileage: "10",
        },
    ];
};

const USED_VEHICLE_INSTRUCTIONS = [
    { Field: "Regional Specs", Required: "Yes", Description: "Regional specification of the vehicle, indicating the market it was built for", "Example / Allowed Values": "GCC Specs, Euro Specs, USDM, Japanese Domestic" },
    { Field: "Make", Required: "Yes", Description: "Vehicle brand name", "Example / Allowed Values": "Toyota, Honda, BMW, Mercedes-Benz" },
    { Field: "Model", Required: "Yes", Description: "Vehicle model name", "Example / Allowed Values": "Corolla, Civic, 3 Series, C-Class" },
    { Field: "Variant", Required: "Yes", Description: "Trim level, grade, or spec of the vehicle", "Example / Allowed Values": "XLI, LXI, Sport, 320i" },
    { Field: "Year", Required: "Yes", Description: "4-digit manufacture year", "Example / Allowed Values": "2020, 2021, 2022, 2023" },
    { Field: "Color", Required: "Yes", Description: "Exterior paint color of the vehicle", "Example / Allowed Values": "White, Silver, Black, Red, Blue" },
    { Field: "Currency", Required: "Yes", Description: "ISO 4217 currency code for all prices in this row", "Example / Allowed Values": "USD, AED, EUR, GBP" },
    { Field: "City", Required: "Yes", Description: "City where the vehicle is listed for sale", "Example / Allowed Values": "Dubai, Abu Dhabi, Nairobi, Lagos" },
    { Field: "Country", Required: "Yes", Description: "Country where the vehicle is listed for sale", "Example / Allowed Values": "UAE, Kenya, Nigeria, South Africa" },
    { Field: "VIN", Required: "Yes", Description: "17-character Vehicle Identification Number (no letters I, O, or Q)", "Example / Allowed Values": "JTDBR32E720123456" },
    { Field: "Number of Owners", Required: "Yes", Description: "Total number of registered owners including the current seller", "Example / Allowed Values": "1, 2, 3" },
    { Field: "Years of Warranty Remaining", Required: "Yes", Description: "Remaining years of manufacturer or extended warranty (use 0 if none)", "Example / Allowed Values": "0, 1, 2, 3" },
    { Field: "Condition", Required: "No (fetched from Chaboschi)", Description: "Vehicle condition grade. Automatically fetched from the Chaboschi inspection report via VIN. Provide here as a fallback in case the VIN is not found in Chaboschi.", "Example / Allowed Values": "Grade A - Excellent, Grade B - Good, Grade C - Fair, Grade D - Poor" },
    { Field: "Mileage", Required: "Yes", Description: "Odometer reading in kilometres at time of listing", "Example / Allowed Values": "18000, 55000, 120000" },
    { Field: "Incoterm", Required: "Yes", Description: "Shipping terms. Use FOB if price is at port of loading; use CIF if price includes insurance and freight to destination", "Example / Allowed Values": "FOB, CIF" },
    { Field: "Price", Required: "Yes", Description: "Asking price in USD corresponding to the selected incoterm", "Example / Allowed Values": "68000, 95000" },
    { Field: "Port of Loading", Required: "Required for FOB", Description: "Port where the vehicle is handed over to the buyer. Required only when Incoterm is FOB", "Example / Allowed Values": "Osaka, Yokohama, Hamburg, Antwerp" },
    { Field: "Port of Destination", Required: "Required for CIF", Description: "Destination port for delivery. Required only when Incoterm is CIF", "Example / Allowed Values": "Jebel Ali, Mombasa, Dar es Salaam, Durban" },
];

const ZERO_KM_INSTRUCTIONS = [
    { Field: "Regional Specs", Required: "Yes", Description: "Regional specification of the vehicle, indicating the market it was built for", "Example / Allowed Values": "GCC Specs, Euro Specs, USDM, Japanese Domestic" },
    { Field: "Make", Required: "Yes", Description: "Vehicle brand name", "Example / Allowed Values": "Toyota, Honda, BMW, Hyundai" },
    { Field: "Model", Required: "Yes", Description: "Vehicle model name", "Example / Allowed Values": "Corolla, Civic, Elantra" },
    { Field: "Variant", Required: "Yes", Description: "Trim level or grade of the vehicle", "Example / Allowed Values": "XLI, GLS, Sport" },
    { Field: "Year", Required: "Yes", Description: "4-digit manufacture year (current or upcoming model year)", "Example / Allowed Values": "2024, 2025" },
    { Field: "Color", Required: "Yes", Description: "Exterior paint color available for this listing row", "Example / Allowed Values": "White, Silver, Black, Red" },
    { Field: "Currency", Required: "Yes", Description: "ISO 4217 currency code for all prices in this row", "Example / Allowed Values": "USD, AED, EUR, GBP" },
    { Field: "City", Required: "Yes", Description: "City where the vehicle is listed for sale", "Example / Allowed Values": "Dubai, Abu Dhabi, Nairobi, Lagos" },
    { Field: "Country", Required: "Yes", Description: "Country where the vehicle is listed for sale", "Example / Allowed Values": "UAE, Kenya, Nigeria, South Africa" },
    { Field: "Price per Color", Required: "No", Description: "Price in USD for this specific color variant. Leave blank if price is uniform across colors", "Example / Allowed Values": "75000, 48000" },
    { Field: "Mileage", Required: "Yes", Description: "Stock readiness value. Must be 100 or below for B2B wholesale rows", "Example / Allowed Values": "0, 10, 25, 50" },
];

export const downloadBulkTemplate = (marketType: MarketType) => {
    const rows = getBulkTemplateRows(marketType);
    const instructions = marketType === MarketType.SECOND_HAND ? USED_VEHICLE_INSTRUCTIONS : ZERO_KM_INSTRUCTIONS;

    const vehicleSheet = XLSX.utils.json_to_sheet(rows);
    const instructionsSheet = XLSX.utils.json_to_sheet(instructions);

    // Set column widths for the vehicle data sheet
    if (marketType === MarketType.SECOND_HAND) {
        vehicleSheet["!cols"] = [
            { wch: 20 }, // Country of Origin
            { wch: 14 }, // Make
            { wch: 14 }, // Model
            { wch: 14 }, // Variant
            { wch: 8 },  // Year
            { wch: 10 }, // Color
            { wch: 10 }, // Currency
            { wch: 14 }, // City
            { wch: 14 }, // Country
            { wch: 20 }, // VIN
            { wch: 18 }, // Number of Owners
            { wch: 28 }, // Years of Warranty Remaining
            { wch: 22 }, // Condition
            { wch: 12 }, // Mileage
            { wch: 12 }, // Incoterm
            { wch: 12 }, // Price
            { wch: 20 }, // Port of Loading
            { wch: 22 }, // Port of Destination
        ];
    } else {
        vehicleSheet["!cols"] = [
            { wch: 20 }, // Country of Origin
            { wch: 14 }, // Make
            { wch: 14 }, // Model
            { wch: 14 }, // Variant
            { wch: 8 },  // Year
            { wch: 10 }, // Color
            { wch: 10 }, // Currency
            { wch: 14 }, // City
            { wch: 14 }, // Country
            { wch: 16 }, // Price per Color
            { wch: 10 }, // Mileage
        ];
    }

    // Set column widths for the instructions sheet
    instructionsSheet["!cols"] = [
        { wch: 28 }, // Field
        { wch: 20 }, // Required
        { wch: 60 }, // Description
        { wch: 50 }, // Example / Allowed Values
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, vehicleSheet, "Vehicles");
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

    const filename = marketType === MarketType.SECOND_HAND ? "used-vehicle-bulk-template.xlsx" : "zero-km-bulk-template.xlsx";
    XLSX.writeFile(workbook, filename);
};

export const parseBulkVehicleFile = async (file: File): Promise<ParsedBulkFile> => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(firstSheet, { header: 1, defval: "" });

    if (!rows.length) {
        return { headers: [], rows: [], rowCount: 0 };
    }

    const [headerRow, ...bodyRows] = rows;
    const headers = headerRow.map((cell) => String(cell || "").trim()).filter(Boolean);
    const parsedRows = bodyRows
        .filter((row) => row.some((cell) => String(cell || "").trim()))
        .map((row) =>
            headers.reduce<Record<string, string>>((acc, header, index) => {
                acc[header] = String(row[index] ?? "").trim();
                return acc;
            }, {})
        );

    return {
        headers,
        rows: parsedRows,
        rowCount: parsedRows.length,
    };
};

export const getSuggestedHeaderMappings = (headers: string[], marketType: MarketType) => {
    const fields = getBulkUploadFields(marketType);

    return headers.reduce<Record<string, string | null>>((acc, originalHeader) => {
        const normalizedHeader = normalizeHeader(originalHeader);
        let bestMatch: { key: string; score: number } | null = null;

        for (const field of fields) {
            const candidates = [field.label, field.key, ...(HEADER_ALIASES[field.key] || [])].map(normalizeHeader);
            const bestCandidateScore = Math.max(...candidates.map((candidate) => getSimilarityScore(normalizedHeader, candidate)));

            if (!bestMatch || bestCandidateScore > bestMatch.score) {
                bestMatch = { key: field.key, score: bestCandidateScore };
            }
        }

        acc[originalHeader] = bestMatch && bestMatch.score >= 0.55 ? bestMatch.key : null;
        return acc;
    }, {});
};

export const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getBulkDraftStorageKey = (marketType: MarketType) => `bulk-upload-draft:${marketType}`;

export const BULK_ROW_LIMIT = 500;

export const splitParsedFile = (parsed: ParsedBulkFile, chunkSize = BULK_ROW_LIMIT): ParsedBulkFile[] => {
    const chunks: ParsedBulkFile[] = [];
    for (let i = 0; i < parsed.rows.length; i += chunkSize) {
        const sliced = parsed.rows.slice(i, i + chunkSize);
        chunks.push({ headers: parsed.headers, rows: sliced, rowCount: sliced.length });
    }
    return chunks;
};

export const downloadParsedFileAsXlsx = (parsed: ParsedBulkFile, filename: string) => {
    const data = parsed.rows.map((row) =>
        parsed.headers.reduce<Record<string, string>>((acc, h) => {
            acc[h] = row[h] ?? "";
            return acc;
        }, {})
    );
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");
    XLSX.writeFile(workbook, filename);
};

const createRowId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `bulk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

const getDefaultValueMap = (marketType: MarketType) =>
    getBulkUploadFields(marketType).reduce<Record<string, string>>((acc, field) => {
        acc[field.key] = "";
        return acc;
    }, {});

const getExistingDuplicateKey = (row: BulkRow, marketType: MarketType) =>
    marketType === MarketType.SECOND_HAND
        ? normalizeValue(row.values.vin || "")
        : [row.values.make, row.values.model, row.values.variant, row.values.year].map((value) => normalizeValue(value || "")).join("|");

const getFileDuplicateKey = (row: BulkRow, marketType: MarketType) =>
    marketType === MarketType.SECOND_HAND
        ? normalizeValue(row.values.vin || "")
        : [row.values.make, row.values.model, row.values.variant, row.values.year, row.values.color].map((value) => normalizeValue(value || "")).join("|");

const getBestSuggestion = (raw: string, options: string[]) => {
    const normalizedRaw = normalizeHeader(raw);
    let best: { value: string; score: number } | null = null;

    for (const option of options) {
        const score = getSimilarityScore(normalizedRaw, normalizeHeader(option));
        if (!best || score > best.score) {
            best = { value: option, score };
        }
    }

    return best;
};

const addBlocking = (issues: BulkIssue[], message: string, field?: string) => {
    issues.push({ field, message });
};

const addWarning = (issues: BulkIssue[], message: string, field?: string) => {
    issues.push({ field, message });
};

export const createMappedBulkRows = (parsed: ParsedBulkFile, mappings: Record<string, string | null>, marketType: MarketType): BulkRow[] => {
    const fields = getBulkUploadFields(marketType);

    return parsed.rows.map((sourceRow) => {
        const values = getDefaultValueMap(marketType);

        Object.entries(sourceRow).forEach(([header, cellValue]) => {
            const mappedField = mappings[header];
            if (!mappedField || mappedField === "__ignore__") return;
            values[mappedField] = String(cellValue || "").trim();
        });

        return {
            id: createRowId(),
            values,
            originalValues: { ...values },
            fieldSources: fields.reduce<Record<string, BulkFieldSource>>((acc, field) => {
                acc[field.key] = "seller";
                return acc;
            }, {}),
            fieldLocks: {},
            corrections: {},
            blockingIssues: [],
            warnings: [],
            confidence: "pending",
            selected: false,
            replaceExisting: false,
            enrichmentNotes: [],
        };
    });
};

export const createEmptyBulkRow = (marketType: MarketType): BulkRow => ({
    id: createRowId(),
    values: getDefaultValueMap(marketType),
    originalValues: getDefaultValueMap(marketType),
    fieldSources: getBulkUploadFields(marketType).reduce<Record<string, BulkFieldSource>>((acc, field) => {
        acc[field.key] = "seller";
        return acc;
    }, {}),
    fieldLocks: {},
    corrections: {},
    blockingIssues: [],
    warnings: [],
    confidence: "pending",
    selected: false,
    replaceExisting: false,
    enrichmentNotes: [],
});

export const acceptAllBulkCorrections = (rows: BulkRow[]) =>
    rows.map((row) => {
        const nextValues = { ...row.values };
        const nextSources = { ...row.fieldSources };

        Object.entries(row.corrections).forEach(([field, correction]) => {
            nextValues[field] = correction.corrected;
            nextSources[field] = "autocorrected";
        });

        return {
            ...row,
            values: nextValues,
            fieldSources: nextSources,
            corrections: {},
        };
    });

export const validateBulkRows = (rows: BulkRow[], marketType: MarketType, masterData: BulkMasterData, existingKeys: Map<string, string>) => {
    const requiredFields = getRequiredBulkFields(marketType);
    const nextRows = rows.map((row) => ({
        ...row,
        corrections: {},
        blockingIssues: [],
        warnings: [],
    }));

    const fileDuplicateCounts = new Map<string, number>();
    nextRows.forEach((row) => {
        const key = getFileDuplicateKey(row, marketType);
        if (!key) return;
        fileDuplicateCounts.set(key, (fileDuplicateCounts.get(key) || 0) + 1);
    });

    return nextRows.map((row) => {
        const blockingIssues: BulkIssue[] = [];
        const warnings: BulkIssue[] = [];
        const corrections: Record<string, BulkCorrection> = {};

        requiredFields.forEach((field) => {
            if (!String(row.values[field.key] || "").trim()) {
                addBlocking(blockingIssues, `${field.label} is required`, field.key);
            }
        });

        const yearValue = row.values.year?.trim();
        if (yearValue && !/^\d{4}$/.test(yearValue)) {
            addBlocking(blockingIssues, "Year must be a 4-digit numeric value", "year");
        }

        if (marketType === MarketType.SECOND_HAND) {
            const vin = row.values.vin?.trim().toUpperCase();
            if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
                addBlocking(blockingIssues, "VIN must be a valid 17-character value", "vin");
            }
        }

        if (row.values.mileage) {
            const mileage = Number(row.values.mileage);
            if (Number.isNaN(mileage)) {
                addBlocking(blockingIssues, "Mileage must be numeric", "mileage");
            } else if (marketType === MarketType.ZERO_KM && mileage > 100) {
                addBlocking(blockingIssues, "Stock readiness must be 100 or below for B2B wholesale", "mileage");
            }
        }

        if (marketType === MarketType.SECOND_HAND) {
            const incoterm = normalizeValue(row.values.incoterm || "");
            if (incoterm && !["fob", "cif"].includes(incoterm)) {
                addBlocking(blockingIssues, "Incoterm must be either FOB or CIF", "incoterm");
            }
            if (incoterm === "fob" && !row.values.port_of_loading?.trim()) {
                addBlocking(blockingIssues, "Port of Loading is required for FOB", "port_of_loading");
            }
            if (incoterm === "cif" && !row.values.port_of_destination?.trim()) {
                addBlocking(blockingIssues, "Port of Destination is required for CIF", "port_of_destination");
            }
        }

        const makeOptions = masterData.brands.map((brand) => brand.name);
        const makeSuggestion = row.values.make ? getBestSuggestion(row.values.make, makeOptions) : null;
        if (row.values.make && makeSuggestion && normalizeValue(row.values.make) !== normalizeValue(makeSuggestion.value)) {
            if (makeSuggestion.score >= 0.8) {
                corrections.make = { original: row.values.make, corrected: makeSuggestion.value };
                addWarning(warnings, `Make auto-correction suggested: ${makeSuggestion.value}`, "make");
            } else if (makeSuggestion.score < 0.5) {
                addBlocking(blockingIssues, "Make does not match master data", "make");
            }
        }

        const colorSuggestion = row.values.color ? getBestSuggestion(row.values.color, masterData.colors) : null;
        if (row.values.color && colorSuggestion && normalizeValue(row.values.color) !== normalizeValue(colorSuggestion.value)) {
            if (colorSuggestion.score >= 0.8) {
                corrections.color = { original: row.values.color, corrected: colorSuggestion.value };
                addWarning(warnings, `Color auto-correction suggested: ${colorSuggestion.value}`, "color");
            } else if (colorSuggestion.score < 0.5) {
                addBlocking(blockingIssues, "Color does not match master data", "color");
            }
        }

        if (marketType === MarketType.SECOND_HAND && row.values.condition) {
            const conditionSuggestion = getBestSuggestion(row.values.condition, masterData.conditions);
            if (conditionSuggestion && normalizeValue(row.values.condition) !== normalizeValue(conditionSuggestion.value) && conditionSuggestion.score >= 0.8) {
                corrections.condition = { original: row.values.condition, corrected: conditionSuggestion.value };
                addWarning(warnings, `Condition auto-correction suggested: ${conditionSuggestion.value}`, "condition");
            }
        }

        const fileDuplicateKey = getFileDuplicateKey(row, marketType);
        if (fileDuplicateKey && (fileDuplicateCounts.get(fileDuplicateKey) || 0) > 1) {
            addBlocking(blockingIssues, "Duplicate row found within this upload", marketType === MarketType.SECOND_HAND ? "vin" : "variant");
        }

        const existingDuplicateKey = getExistingDuplicateKey(row, marketType);
        const existingInventoryId = existingDuplicateKey ? existingKeys.get(existingDuplicateKey) : undefined;
        if (existingInventoryId) {
            addWarning(warnings, "Matches an existing seller listing", marketType === MarketType.SECOND_HAND ? "vin" : "variant");
        }

        return {
            ...row,
            corrections,
            blockingIssues,
            warnings,
            duplicateExistingId: existingInventoryId,
        };
    });
};

type EnrichmentProgress = {
    current: number;
    total: number;
    message: string;
};

export const sortBulkRowsForDisplay = (rows: BulkRow[]) =>
    [...rows].sort((a, b) => {
        if (!!a.blockingIssues.length === !!b.blockingIssues.length) return 0;
        return a.blockingIssues.length ? -1 : 1;
    });

export const enrichBulkRows = async (
    rows: BulkRow[],
    marketType: MarketType,
    onProgress?: (progress: EnrichmentProgress) => void
): Promise<BulkRow[]> => {
    const total = rows.length;
    const nextRows: BulkRow[] = [];

    for (const [index, row] of rows.entries()) {
        onProgress?.({ current: index + 1, total, message: `Enriching row ${index + 1} of ${total}` });
        await new Promise((resolve) => setTimeout(resolve, 250));

        const nextRow: BulkRow = {
            ...row,
            fieldLocks: {},
            enrichmentNotes: [],
        };

        const nextValues = { ...row.values };
        const nextSources = { ...row.fieldSources };
        const blockingIssues = [...row.blockingIssues];
        const warnings = [...row.warnings];
        let confidence: BulkConfidence = "low";

        if (marketType === MarketType.SECOND_HAND) {
            const vin = String(row.values.vin || "").trim().toUpperCase();
            const inspection = await lookupVinOnChaboschi(vin, vin.endsWith("0") ? "not_found" : "found");
            const inspectionFound = inspection.status === "found";

            if (inspectionFound) {
                nextValues.make = inspection.make;
                nextValues.model = inspection.model;
                nextValues.year = String(inspection.year);
                nextValues.mileage = String(inspection.mileage);
                nextValues.condition = inspection.condition;
                nextSources.make = "chaboschi";
                nextSources.model = "chaboschi";
                nextSources.year = "chaboschi";
                nextSources.mileage = "chaboschi";
                nextSources.condition = "chaboschi";
                nextRow.enrichmentNotes?.push("Chaboschi inspection applied");
            } else {
                warnings.push({ field: "vin", message: "No Chaboschi inspection found. Seller values were retained." });
            }

            const variantSearch = inspectionFound ? inspection.variant : row.values.variant;
            const variants = await getVariants(nextValues.model || row.values.model || "");
            const variantOptions = variants.data.map((item) => item.variantName);
            const variantSuggestion = variantSearch ? getBestSuggestion(variantSearch, variantOptions) : null;

            if (variantSuggestion && variantSuggestion.score >= 0.8) {
                nextValues.variant = variantSuggestion.value;
                nextSources.variant = "jato";
                nextRow.fieldLocks = {
                    make: inspectionFound,
                    model: inspectionFound,
                    variant: true,
                    year: inspectionFound,
                    mileage: inspectionFound,
                    condition: inspectionFound,
                };
                confidence = inspectionFound ? "high" : "medium";
            } else if (variantSuggestion && variantSuggestion.score >= 0.5) {
                warnings.push({ field: "variant", message: `Variant needs seller review. Closest JATO match: ${variantSuggestion.value}` });
                confidence = "medium";
            } else {
                blockingIssues.push({ field: "variant", message: "Variant could not be resolved against JATO variants" });
                confidence = "low";
            }
        } else {
            const variants = await getVariants(row.values.model || "");
            const variantOptions = variants.data.map((item) => item.variantName);
            const variantSuggestion = row.values.variant ? getBestSuggestion(row.values.variant, variantOptions) : null;

            if (variantSuggestion && variantSuggestion.score >= 0.8) {
                nextValues.variant = variantSuggestion.value;
                nextSources.variant = "jato";
                confidence = "high";
            } else if (variantSuggestion && variantSuggestion.score >= 0.5) {
                warnings.push({ field: "variant", message: `Variant needs seller review. Closest JATO match: ${variantSuggestion.value}` });
                confidence = "medium";
            } else {
                blockingIssues.push({ field: "variant", message: "Variant could not be resolved against JATO variants" });
                confidence = "low";
            }
        }

        nextRows.push({
            ...nextRow,
            values: nextValues,
            fieldSources: nextSources,
            blockingIssues,
            warnings,
            confidence,
        });
    }

    return nextRows;
};
