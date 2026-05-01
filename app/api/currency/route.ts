import { NextResponse } from "next/server";

const SUPPORTED_CURRENCIES = new Set(["AED", "USD", "OMR", "SAR"]);

export async function POST(request: Request) {
    const body = (await request.json().catch(() => null)) as { currency?: string } | null;
    const currency = body?.currency?.trim().toUpperCase();

    if (!currency || !SUPPORTED_CURRENCIES.has(currency)) {
        return NextResponse.json({ message: "Unsupported currency" }, { status: 400 });
    }

    const response = NextResponse.json({ currency });
    response.cookies.set("currencyCookie", currency, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
    });

    return response;
}
