import { z } from "zod";

export enum Status {
    DRAFT = "DRAFT",
    LIVE = "LIVE",
    SOLD = "SOLD",
}

export enum MarketType {
    SECOND_HAND = "second_hand",
    ZERO_KM = "zero_km",
}

export enum Incoterm {
    FOB = "FOB",
    CIF = "CIF",
    CFR = "CFR",
    EXW = "EXW",
    FCA = "FCA",
    DAP = "DAP",
}

//
// SHARED FIELDS
//
export const baseSchema = z.object({
    inventoryId: z.string()?.optional(),
    marketType: z.enum(MarketType, { message: "Please select vehicle type" }),
    vin: z.string().optional(),
    vinLookupStatus: z.enum(["idle", "found", "not_found"]).optional(),
    vinLookupMessage: z.string().optional(),
    vinLookupProvider: z.string().optional(),
    inspectionSummary: z.string().optional(),
    inspectionProvider: z.string().optional(),
    inspectionDateNote: z.string().optional(),
    vehicleDescription: z.string().optional(),
    fetchedMileage: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(0).optional()),
    brand: z.string().min(1, "Please select a vehicle make"),
    model: z.string().min(1, "Please select a vehicle model"),
    variant: z.string().min(1, "Please select a vehicle variant"),
    year: z.preprocess(
        Number,
        z.number().min(1900, "Please enter a valid year between 1950 and 2026").max(new Date().getFullYear(), `Please enter a valid year between 1950 and ${new Date().getFullYear()}`)
    ),
    regionalSpecs: z.string().min(1, "Please select regional specifications"),
    bodyType: z.string().min(1, "Please select vehicle body type"),
    condition: z.string().optional(),
    city: z.string().min(1, "Please select city"),
    country: z.string().min(1, "Please select country"),
    status: z.enum(Status),
});
//
// VEHICLE SCHEMA
//

export const VehicleInfoSchema = z.object({
    id: z.string().optional(),
    mileage: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1, "Please enter valid mileage").max(1000000, "Mileage can not be more then 1000000").optional()),
    vin: z.string().optional(),
    vinList: z.array(z.string()).optional(),
    registrationNumber: z.string().max(20, "Please Enter valid registration number").optional(),
    numberOfOwners: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1, "Please enter number of owners").max(10, "Number of owners can not be more then 10").optional()),
    warrantyRemaining: z.string().max(100, "Please mention in valid words").optional(),
    inspectionReportUrl: z.string().optional().or(z.literal("")),
    color: z.string().optional(),
    availableQuantity: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1, "Quantity must be at least 1").optional()),
    unitPrice: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1, "Price must be greater than 0").optional()),
    incoterm: z.nativeEnum(Incoterm).optional(),
    fobPrice: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1, "FOB price must be greater than 0").optional()),
    fobPortOfLoading: z.string().optional(),
    cifPrice: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1, "CIF price must be greater than 0").optional()),
    cifPortOfDestination: z.string().optional(),
});

const VehiclesArraySchema = z.array(VehicleInfoSchema).min(1, "Add at least one vehicle entry");

const VIN_REGEX = /^[A-HJ-NPR-Z0-9a-hj-npr-z]+$/;
const isValidVin = (vin: string) => vin.length === 17 && VIN_REGEX.test(vin);
const isValidImagePath = (value: string) => {
    if (!value) return false;
    if (value.startsWith("/")) return true;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

//
// FULL LISTING SCHEMA
//
const fullListingObjectSchema = baseSchema.extend({
    color: z.string().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    drivetrain: z.string().optional(),
    engineSize: z.string().optional(),
    cylinders: z.preprocess(Number, z.number().max(16, "Cylinders can not be more then 16").optional()),
    horsepower: z.preprocess(Number, z.number().max(2000, "Horsepower can not be more then 2000").optional()),
    seatingCapacity: z.preprocess(Number, z.number().max(15, "Seating capacity can not be more then 15")),
    numberOfDoors: z.preprocess(Number, z.number().max(5, "Door count can not be more then 5").optional()),
    features: z.array(z.string()).min(1, "Minimum 1 feature is required").max(20, "Maximum 20 features allowed"),
    imageUrls: z.array(z.string()).min(1, "Please upload atleast one image").max(20, "Maximum 10 images allowed"),
    mainImageUrl: z.string().refine(isValidImagePath, "Please select a main image"),
    price: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1, "Price must be greater than 0").optional()),
    allowPriceNegotiations: z.boolean().nullable().optional(),
    negotiationNotes: z.string().nullable().optional(),
    description: z
        .string()
        .refine((val) => val === "" || val.length >= 10, "Description must be at least 10 characters")
        .refine((val) => val === "" || val.length <= 2000, "Description can not be more than 2000 characters"),
    currency: z.string().optional(),
    vehicles: VehiclesArraySchema,
});

export const fullListingSchema = fullListingObjectSchema.superRefine((data, ctx) => {
    if (data.marketType === MarketType.SECOND_HAND) {
        if (!data.condition?.trim()) {
            ctx.addIssue({ code: "custom", message: "Please select vehicle condition", path: ["condition"] });
        }
        const vinCount = new Map<string, number>();
        for (const v of data.vehicles) {
            const normalizedVin = (v.vin || "").trim().toUpperCase();
            if (normalizedVin) {
                vinCount.set(normalizedVin, (vinCount.get(normalizedVin) ?? 0) + 1);
            }
        }
        for (const [index, v] of data.vehicles.entries()) {
            const vin = (v.vin || "").trim().toUpperCase();
            if (!vin) {
                ctx.addIssue({ code: "custom", message: "Please enter VIN", path: ["vehicles", index, "vin"] });
            } else if (!isValidVin(vin)) {
                ctx.addIssue({ code: "custom", message: "Please enter a valid 17-character VIN", path: ["vehicles", index, "vin"] });
            } else if ((vinCount.get(vin) ?? 0) > 1) {
                ctx.addIssue({ code: "custom", message: "This VIN has already been added", path: ["vehicles", index, "vin"] });
            }
            if (!v.mileage || v.mileage < 1) {
                ctx.addIssue({ code: "custom", message: "Please enter valid mileage", path: ["vehicles", index, "mileage"] });
            }
            if (!v.numberOfOwners || v.numberOfOwners < 1) {
                ctx.addIssue({ code: "custom", message: "Please enter number of owners", path: ["vehicles", index, "numberOfOwners"] });
            }
            const hasFobPrice = typeof v.fobPrice === "number" && v.fobPrice > 0;
            const hasFobPort = !!v.fobPortOfLoading?.trim();
            const hasCifPrice = typeof v.cifPrice === "number" && v.cifPrice > 0;
            const hasCifPort = !!v.cifPortOfDestination?.trim();

            if (v.incoterm === Incoterm.FOB) {
                if (!hasFobPrice) {
                    ctx.addIssue({ code: "custom", message: "Enter FOB price", path: ["vehicles", index, "fobPrice"] });
                }
                if (!hasFobPort) {
                    ctx.addIssue({ code: "custom", message: "Enter port of loading for FOB", path: ["vehicles", index, "fobPortOfLoading"] });
                }
            }

            if (v.incoterm === Incoterm.CIF) {
                if (!hasCifPrice) {
                    ctx.addIssue({ code: "custom", message: "Enter CIF price", path: ["vehicles", index, "cifPrice"] });
                }
                if (!hasCifPort) {
                    ctx.addIssue({ code: "custom", message: "Enter port of destination for CIF", path: ["vehicles", index, "cifPortOfDestination"] });
                }
            }
        }
        if (!data.price || data.price < 1) {
            ctx.addIssue({ code: "custom", message: "Price must be greater than 0", path: ["price"] });
        }
        if (!data.color?.trim()) {
            ctx.addIssue({ code: "custom", message: "Please select color", path: ["color"] });
        }
        return;
    }

    const vinCount = new Map<string, number>();
    for (const v of data.vehicles) {
        for (const vinItem of v.vinList || []) {
            const normalized = (vinItem || "").trim().toUpperCase();
            if (!normalized) continue;
            vinCount.set(normalized, (vinCount.get(normalized) ?? 0) + 1);
        }
    }

    for (const [index, v] of data.vehicles.entries()) {
        const vin = (v.vin || "").trim().toUpperCase();
        if (vin && !isValidVin(vin)) {
            ctx.addIssue({ code: "custom", message: "If provided, VIN must be a valid 17-character value", path: ["vehicles", index, "vin"] });
        }
        for (const [vinIndex, vinItem] of (v.vinList || []).entries()) {
            const normalized = (vinItem || "").trim().toUpperCase();
            if (!normalized) continue;
            if (!isValidVin(normalized)) {
                ctx.addIssue({
                    code: "custom",
                    message: "If provided, VIN must be a valid 17-character value",
                    path: ["vehicles", index, "vinList", vinIndex],
                });
            } else if ((vinCount.get(normalized) ?? 0) > 1) {
                ctx.addIssue({
                    code: "custom",
                    message: "This VIN has already been added",
                    path: ["vehicles", index, "vinList", vinIndex],
                });
            }
        }
        if (!v.color?.trim()) {
            ctx.addIssue({ code: "custom", message: "Select color for this configuration", path: ["vehicles", index, "color"] });
        }
        const hasFobPrice = typeof v.fobPrice === "number" && v.fobPrice > 0;
        const hasFobPort = !!v.fobPortOfLoading?.trim();
        const hasCifPrice = typeof v.cifPrice === "number" && v.cifPrice > 0;
        const hasCifPort = !!v.cifPortOfDestination?.trim();

        if (hasFobPrice && !hasFobPort) {
            ctx.addIssue({ code: "custom", message: "Enter port of loading for FOB", path: ["vehicles", index, "fobPortOfLoading"] });
        }
        if (hasFobPort && !hasFobPrice) {
            ctx.addIssue({ code: "custom", message: "Enter FOB price", path: ["vehicles", index, "fobPrice"] });
        }
        if (hasCifPrice && !hasCifPort) {
            ctx.addIssue({ code: "custom", message: "Enter port of destination for CIF", path: ["vehicles", index, "cifPortOfDestination"] });
        }
        if (hasCifPort && !hasCifPrice) {
            ctx.addIssue({ code: "custom", message: "Enter CIF price", path: ["vehicles", index, "cifPrice"] });
        }
    }

    const hasAnyCommercialTerm = data.vehicles.some((v) => {
        const hasFob = typeof v.fobPrice === "number" && v.fobPrice > 0;
        const hasCif = typeof v.cifPrice === "number" && v.cifPrice > 0;
        return hasFob || hasCif;
    });

    if (hasAnyCommercialTerm && !data.currency?.trim()) {
        ctx.addIssue({ code: "custom", message: "Please select currency", path: ["currency"] });
    }
});

export type VehicleFormValues = z.infer<typeof fullListingSchema>;

export const basicInfoFormSchema = fullListingObjectSchema.pick({
    marketType: true,
    vin: true,
    vinLookupStatus: true,
    vinLookupMessage: true,
    vinLookupProvider: true,
    inspectionSummary: true,
    inspectionProvider: true,
    inspectionDateNote: true,
    vehicleDescription: true,
    fetchedMileage: true,
    brand: true,
    model: true,
    variant: true,
    year: true,
    regionalSpecs: true,
    bodyType: true,
    color: true,
    country: true,
    city: true,
    fuelType: true,
    transmission: true,
    drivetrain: true,
    engineSize: true,
    cylinders: true,
    horsepower: true,
    seatingCapacity: true,
    numberOfDoors: true,
    description: true,
});

export const detailFormSchema = fullListingObjectSchema.pick({
    condition: true,
    vehicles: true,
});

export const featureFormSchema = fullListingObjectSchema.pick({
    features: true,
});

export const imageFormSchema = fullListingObjectSchema.pick({
    imageUrls: true,
    mainImageUrl: true,
});

export const priceFormSchema = fullListingObjectSchema.pick({
    price: true,
    currency: true,
    allowPriceNegotiations: true,
    negotiationNotes: true,
});
