import { NextRequest, NextResponse } from "next/server";

// 1. Specify protected and public routes
const protectedRoutes = ["/add-product", "/admin", "/buyer", "/dealer", "/my-cart", "/my-negotiations", "/seller/", "/update-bank-details"];

const normalizeLegacyMarketParam = (url: URL) => {
    const market = url.searchParams.get("market") || url.searchParams.get("marketType");
    if (!market) return;

    if (["zero_km", "wholesale", "b2b", "bulk"].includes(market)) {
        url.searchParams.set("market", "wholesale");
    } else if (["second_hand", "retail", "b2c", "consumer"].includes(market)) {
        url.searchParams.set("market", "retail");
    }

    url.searchParams.delete("marketType");
};

const legacyRedirectUrl = (req: NextRequest) => {
    const url = req.nextUrl.clone();
    const path = url.pathname;

    if (path === "/vehicles" || path.startsWith("/vehicles/")) {
        url.pathname = path.replace("/vehicles", "/products");
        normalizeLegacyMarketParam(url);
        return url;
    }

    if (path === "/add-vehicle" || path.startsWith("/add-vehicle/")) {
        url.pathname = path.replace("/add-vehicle", "/add-product");
        normalizeLegacyMarketParam(url);
        return url;
    }

    if (path === "/seller/inventory") {
        url.pathname = "/seller/products";
        return url;
    }

    return null;
};

export default async function proxy(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;

    const redirectUrl = legacyRedirectUrl(req);
    if (redirectUrl) {
        return NextResponse.redirect(redirectUrl);
    }

    const isProtectedRoute = protectedRoutes.some((p) => path.startsWith(p));

    // 3. Read auth cookie from the incoming request
    const userId = req.cookies.get("userToken")?.value;

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !userId) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
