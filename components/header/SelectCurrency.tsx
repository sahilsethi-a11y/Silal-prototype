"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowDownIcon } from "@/components/Icons";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { usePathname, useRouter } from "next/navigation";

type Currency = {
    label: string;
    value: string;
    symbol: string;
};

const PATH_WITHOUT_CURRENCY = [
    "/about-us",
    "/signup",
    "/login",
    "/reset-password",
    "/terms-and-conditions",
    "/privacy-policy",
    "/cookie-policy",
    "/disclaimer",
    "/contact-us",
    "/faq",
    "/partner-network",
];

export default function CurrencySelector({ filters, selectedCurrency }: Readonly<{ filters: Record<string, unknown>; selectedCurrency: string }>) {
    const currencies = (filters?.currency ?? []) as Currency[];

    const pathname = usePathname();
    const isNotShowCurrencySelection = PATH_WITHOUT_CURRENCY.some((p) => pathname.startsWith(p));
    if (isNotShowCurrencySelection || pathname === "/" || !currencies?.length) return <></>;
    return <SelectCurrency currencies={currencies} selectedCurrency={selectedCurrency} />;
}

const SelectCurrency = ({ currencies, selectedCurrency }: { currencies: Currency[]; selectedCurrency: string }) => {
    const [open, setOpen] = useState(false);
    const [localSelectedCurrency, setLocalSelectedCurrency] = useState(selectedCurrency);
    const [isPending, startTransition] = useTransition();
    const ref = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        setLocalSelectedCurrency(selectedCurrency);
    }, [selectedCurrency]);

    useOutsideClick(ref, () => setOpen(false));

    const select = async (opt: Currency) => {
        setLocalSelectedCurrency(opt.value);
        setOpen(false);
        const res = await fetch("/api/currency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currency: opt.value }),
        });

        if (!res.ok) {
            setLocalSelectedCurrency(selectedCurrency);
            return;
        }

        startTransition(() => {
            router.refresh();
        });
    };

    const selected = currencies.find((o) => o.value === localSelectedCurrency) || currencies[0];

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={isPending}
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary-600">
                <span className="text-sm">
                    {selected.symbol} {selected.value}
                </span>
                <ArrowDownIcon className={`h-4 w-4 transition-transform ${open ? "-rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 p-1 w-40 border-black/10 bg-white rounded-md border shadow-md overflow-hidden z-50">
                    {currencies.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            title={opt.label}
                            disabled={isPending}
                            onClick={() => select(opt)}
                            className={`w-full flex items-center text-brand-blue justify-between gap-2 px-2 py-1.5 text-left text-sm rounded-sm ${
                                opt.value === selected.value ? "bg-accent" : "hover:bg-accent"
                            }`}>
                            <span className="text-sm">
                                {opt.symbol} {opt.value}
                            </span>
                            {opt.value === selected.value && <span className="h-2 w-2 rounded-full bg-brand-blue" aria-hidden="true" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
