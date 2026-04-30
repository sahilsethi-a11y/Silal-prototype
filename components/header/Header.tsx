import Link from "next/link";
import SelectCurrency from "@/components/header/SelectCurrency";
import UserProfileButton from "@/components/header/UserProfileButton";
import Sidebar from "@/components/header/Sidebar";
import { api } from "@/lib/api/server-request";
import DesktopNav from "@/components/header/DesktopNav";
import { SearchIcon } from "@/components/Icons";
import CartButton from "@/components/header/CartButton";
import QuoteBuilderButton from "@/components/header/QuoteBuilderButton";
import { getFilters } from "@/lib/data";
import { getCurrency } from "@/lib/serverActions";
import { cookies } from "next/headers";
import { getDemoUserByToken } from "@/lib/localAuth";

export type User = {
    name: string;
    username: string;
    email: string;
    roleType: string;
    buyerType?: "individual" | "business";
    userId: string;
    otpVerified: boolean;
};

type ApiUser = Partial<User> & {
    id?: string;
    emailId?: string;
};

const normalizeUser = (raw?: ApiUser): User | undefined => {
    if (!raw) return undefined;
    const userId = raw.userId || raw.id;
    if (!userId) return undefined;

    return {
        userId,
        username: raw.username || raw.email || raw.emailId || "",
        name: raw.name || raw.username || raw.email || raw.emailId || "",
        email: raw.email || raw.emailId || raw.username || "",
        roleType: raw.roleType || "",
        buyerType: raw.buyerType,
        otpVerified: Boolean(raw.otpVerified),
    };
};

export default async function Header() {
    const cookieStore = await cookies();
    const selectedCurrency = await getCurrency();
    const filters = await getFilters().catch(() => ({ data: {} as Record<string, unknown> }));

    let userData: { data?: User } = {};
    let cartResp: { data?: { cartCount: number } } = { data: { cartCount: 0 } };
    try {
        const userPromise = api.get<{ data?: ApiUser }>("/api/v1/auth/getUserInfoByToken", { isAuthRequired: false });
        const cartPromise = api.get<{ data: { cartCount: number } }>("/inventory/api/v1/inventory/getCartCountForUser", { isAuthRequired: false });
        const [u, c] = await Promise.all([userPromise, cartPromise]);
        userData = { data: normalizeUser(u?.data) };
        cartResp = c;
    } catch {
        const tokenValue = cookieStore.get("userToken")?.value;
        const localUser = getDemoUserByToken(tokenValue);
        if (localUser) {
            userData = { data: normalizeUser(localUser) };
        }
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-stroke-light shadow-sm">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between py-2.5 gap-2">
                    <Link title="Silal Marketplace" href="/" className="flex items-center gap-2 text-brand-blue">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-sm font-bold text-white">S</span>
                        <span className="hidden leading-tight sm:block">
                            <span className="block text-base font-bold">Silal Marketplace</span>
                            <span className="block text-[10px] font-medium uppercase text-silal-leaf">Made in UAE</span>
                        </span>
                    </Link>
                    <DesktopNav isLoggedIn={userData.data?.userId} />
                    <div className="flex gap-2 md:gap-4 items-center">
                        <SelectCurrency filters={filters?.data} selectedCurrency={selectedCurrency} />
                        <Link className="p-2 hover:bg-gray-100 block rounded-md" href="/products" title="Search products">
                            <SearchIcon className="h-4 w-4" />
                        </Link>
                        <QuoteBuilderButton />
                        <CartButton initialCount={cartResp?.data?.cartCount ?? 0} />{" "}
                        <UserProfileButton user={userData.data} />
                        <div className="md:hidden">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
