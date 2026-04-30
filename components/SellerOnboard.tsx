"use client";
import { useState } from "react";
import Stepper from "@/components/Stepper";
import ProgressBar from "@/components/ProgressBar";
import SellerForm from "@/components/SellerForm";
import DocumentUpload, { FileInfo } from "@/components/DocumentUpload";
import TncForm from "@/components/TncForm";
import { useRouter } from "next/navigation";
import { FetchError } from "@/lib/api/shared";
import { api } from "@/lib/api/client-request";
import { sellerDocumentSchema } from "@/validation/user-schema";

const documents = [
    {
        title: "Owner Emirates ID / Passport",
        description: "Valid Emirates ID or passport for the authorized representative",
        fileName: "nationalId",
        input: {
            label: "ID/Passport Number",
            name: "passportNo",
            placeholder: "Enter Emirates ID or passport number",
        },
    },
    {
        title: "UAE Trade License / Farm Registration",
        description: "Valid trade license, farm registration, or maker permit",
        fileName: "companyLicense",
        input: {
            label: "Trade License Number",
            name: "licenseNo",
            placeholder: "Enter trade license number",
        },
    },
    {
        title: "Product Compliance Document",
        description: "Origin certificate, Halal, HACCP, lab test, textile certificate, or age-rating evidence",
        fileName: "exportLicense",
        input: {
            label: "Compliance Reference",
            name: "exportNo",
            placeholder: "Enter certificate or approval reference",
        },
    },
];

export type PersonalData = {
    companyName: string;
    fullName: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    city: string;
    district: string;
};

const initialPersonalData: PersonalData = {
    companyName: "",
    fullName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    city: "",
    district: "",
};

export default function SellerOnboard() {
    const [personalData, setpersonalData] = useState<PersonalData>(initialPersonalData);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [files, setFiles] = useState<Record<string, FileInfo | string>>({
        nationalId: { url: "", name: "", uploaded: false },
        companyLicense: { url: "", name: "", uploaded: false },
        exportLicense: { url: "", name: "", uploaded: false },
        passportNo: "",
        licenseNo: "",
        exportNo: "",
    });
    const finalCallBack = async (password: string, confirmPassword: string) => {
        try {
            const payLoad = {
                name: personalData.fullName,
                emailId: personalData.email,
                phoneNumber: personalData.mobile,
                roleName: "UAE Supplier",
                roleMetaData: {
                    companyName: personalData.companyName,
                    companyLicenseNo: files.licenseNo,
                    complianceReference: files.exportNo,
                    dob: personalData.dateOfBirth,
                    passportNo: files.passportNo,
                    passportUrl: (files.nationalId as FileInfo).url,
                    companyLicenseUrl: (files.companyLicense as FileInfo).url,
                    complianceDocumentUrl: (files.exportLicense as FileInfo).url,
                    supplierCategories: ["Food", "Clothing", "Games"],
                },
                locationAttribute: {
                    countryCode: "AE",
                    country: "United Arab Emirates",
                    city: personalData.city,
                    district: personalData.district,
                },
                password: password,
                confirmPassword: confirmPassword,
            };
            await api.post("/users/api/v1/users/v2/create", { body: payLoad });
            router.push("/login");
        } catch (err) {
            setError((err as FetchError<{ message: string }>).response?.data?.message || "something went wrong");
        }
    };
    return (
        <>
            <Stepper step={step} />
            <div className="bg-white text-black flex flex-col gap-7 rounded-xl border border-black/10 shadow-lg p-6">
                <ProgressBar step={step} />
                {step === 1 && <SellerForm setStep={setStep} personalData={personalData} setpersonalData={setpersonalData} />}
                {step === 2 && <DocumentUpload schema={sellerDocumentSchema} data={documents} files={files} setFiles={setFiles} setStep={setStep} />}
                {step === 3 && <TncForm resetError={() => setError("")} setStep={setStep} finalCallBack={finalCallBack} error={error} />}
            </div>
        </>
    );
}
