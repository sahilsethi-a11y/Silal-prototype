"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/Icons";
import Link from "next/link";
import type { User } from "@/components/login/LoginForm";
import Button from "@/elements/Button";
import Input from "@/elements/Input";
import { DEMO_CREDENTIALS, getDemoUser, LOCAL_AUTH_COOKIE, LOCAL_AUTH_STORAGE_KEY, type BuyerType } from "@/lib/localAuth";
import { setClientMarketMode } from "@/lib/marketplace";

const data = {
    title: "Welcome Back",
    description: "Sign in as a buyer, supplier, or admin",
};

type PropsT = {
    successCallback: (user: User, opts?: { skipOtp?: boolean }) => void;
};

type LoginAccountType = "individual_buyer" | "business_buyer" | "supplier" | "admin";

const accountOptions: { type: LoginAccountType; label: string; caption: string; username: string }[] = [
    { type: "individual_buyer", label: "Individual Buyer", caption: "B2C Retail", username: "individual@silal.local" },
    { type: "business_buyer", label: "Business Buyer", caption: "B2B Wholesale", username: "business@silal.local" },
    { type: "supplier", label: "Supplier", caption: "Seller portal", username: "supplier@silal.local" },
    { type: "admin", label: "Admin", caption: "Operations", username: "admin@silal.local" },
];

const demoCredentialFor = (username: string) => DEMO_CREDENTIALS.find((credential) => credential.username === username);

export default function SignIn({ successCallback }: Readonly<PropsT>) {
    const [selectedAccountType, setSelectedAccountType] = useState<LoginAccountType>("individual_buyer");
    const [formData, setFormData] = useState({
        username: demoCredentialFor("individual@silal.local")?.username ?? "",
        password: demoCredentialFor("individual@silal.local")?.password ?? "",
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const buildLocalUser = (username: string) => {
        const normalizedUsername = username.trim().toLowerCase();
        const safeSlug = normalizedUsername.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        const selectedRole: "buyer" | "seller" | "admin" = selectedAccountType === "admin" ? "admin" : selectedAccountType === "supplier" ? "seller" : "buyer";
        const roleType: "buyer" | "seller" | "admin" = normalizedUsername.includes("admin")
            ? "admin"
            : normalizedUsername.includes("seller") || normalizedUsername.includes("supplier")
              ? "seller"
              : selectedRole;
        const buyerType: BuyerType =
            roleType === "buyer" && (selectedAccountType === "business_buyer" || normalizedUsername.includes("business") || normalizedUsername.includes("b2b"))
                ? "business"
                : "individual";
        const userId = `local-${roleType}-${safeSlug || "user"}`;
        return {
            userId,
            id: userId,
            username: normalizedUsername,
            emailId: normalizedUsername,
            email: normalizedUsername,
            name: normalizedUsername.split("@")[0] || "Local User",
            roleType,
            buyerType: roleType === "buyer" ? buyerType : undefined,
            otpVerified: true,
            passwordTemporary: false,
        };
    };

    const validateForm = ({ username, password }: { username: string; password: string }) => {
        if (username.trim() === "") {
            setError("Please enter your User ID.");
            return false;
        }
        if (password.trim() === "") {
            setError("Please enter your Password.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (submitting || !validateForm(formData)) return;
        setSubmitting(true);

        try {
            const localUser = getDemoUser(formData.username, formData.password) || buildLocalUser(formData.username);
            const resolvedUser = {
                ...localUser,
                buyerType:
                    localUser.roleType === "buyer"
                        ? localUser.buyerType ?? (selectedAccountType === "business_buyer" ? "business" : "individual")
                        : undefined,
            };
            if (typeof window !== "undefined") {
                window.localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(resolvedUser));
                document.cookie = `${LOCAL_AUTH_COOKIE}=${encodeURIComponent(resolvedUser.userId)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
                if (resolvedUser.roleType === "buyer") {
                    setClientMarketMode(resolvedUser.buyerType === "business" ? "zero_km" : "second_hand");
                }
                window.dispatchEvent(new Event("adpg-auth-changed"));
            }
            successCallback(
                {
                    id: resolvedUser.id,
                    username: resolvedUser.username,
                    emailId: resolvedUser.emailId,
                    roleType: resolvedUser.roleType,
                    buyerType: resolvedUser.buyerType,
                    passwordTemporary: resolvedUser.passwordTemporary,
                },
                { skipOtp: true }
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-lg p-8 border border-black/10">
                <h1 className="text-2xl text-center text-brand-blue mb-1">{data.title}</h1>
                <p className="text-center text-gray-500 mb-6">{data.description}</p>
                <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {accountOptions.map((option) => {
                        const demo = demoCredentialFor(option.username);
                        const selected = selectedAccountType === option.type;
                        return (
                            <button
                                key={option.type}
                                type="button"
                                onClick={() => {
                                    setSelectedAccountType(option.type);
                                    if (demo) {
                                        setFormData({ username: demo.username, password: demo.password });
                                    }
                                    setError("");
                                }}
                                className={`rounded-lg border p-3 text-left transition-colors ${
                                    selected ? "border-brand-blue bg-brand-blue text-white" : "border-stroke-light bg-gray-50 text-gray-800 hover:border-brand-blue/50"
                                }`}
                            >
                                <span className="block text-sm font-semibold">{option.label}</span>
                                <span className={`mt-0.5 block text-xs ${selected ? "text-white/80" : "text-gray-600"}`}>{option.caption}</span>
                                {demo ? <span className={`mt-2 block text-[11px] ${selected ? "text-white/80" : "text-gray-500"}`}>{demo.username}</span> : null}
                            </button>
                        );
                    })}
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email ID"
                        id="username"
                        value={formData.username}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, username: e.target.value }));
                            setError("");
                        }}
                        placeholder="Enter your User ID"
                        aria-label="User ID"
                        autoComplete="username"
                        required
                    />

                    <div className="relative">
                        <Input
                            label="Password"
                            id="password"
                            value={formData.password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setFormData((prev) => ({ ...prev, password: e.target.value }));
                                setError("");
                            }}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            aria-label="Password"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-11.5 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                            {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                        </button>
                    </div>
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-destructive text-sm" role="alert">
                                {error}
                            </p>
                        </div>
                    )}
                    <Button type="submit" loading={submitting} disabled={submitting} size="lg" className="w-full">
                        {submitting ? "Signing in..." : "Sign In"}
                    </Button>
                    <div className="text-center text-sm">
                        <Link title="Forget password" href="/reset-password" className="hover:underline text-brand-blue">
                            Forgot your password?
                        </Link>
                    </div>
                </form>
            </div>
            <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                    {"Don't have an account? "}
                    <Link title="Sign up" href="/signup" className="hover:underline text-brand-blue">
                        Sign up here
                    </Link>
                </p>
            </div>
        </>
    );
}
