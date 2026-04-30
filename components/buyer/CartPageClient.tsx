"use client";

import { useEffect, useState } from "react";
import CartList, { type Cart, type NegotiationOrder } from "@/components/buyer/CartList";
import { type B2CCartItem } from "@/components/buyer/B2CAddToCartButton";
import message from "@/elements/message";
import { useRouter } from "next/navigation";
import { scopedStorageKey, type MarketMode } from "@/lib/marketplace";
import { formatPrice } from "@/lib/utils";
import { cartStore } from "@/lib/cartStore";

const B2C_CART_KEY = "b2cCart";

type NegotiationCart = NegotiationOrder;

export default function CartPageClient({ list, marketMode }: Readonly<{ list: Cart[]; marketMode: MarketMode }>) {
    const router = useRouter();
    const NEGOTIATION_CARTS_LOCAL_KEY = scopedStorageKey("negotiationCartsByConversation_local", marketMode);
    const [negotiationOrders, setNegotiationOrders] = useState<NegotiationCart[]>([]);
    const [selectedNegotiations, setSelectedNegotiations] = useState<Record<string, boolean>>({});
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [b2cItems, setB2cItems] = useState<B2CCartItem[]>([]);
    const [b2cCheckoutLoading, setB2cCheckoutLoading] = useState(false);

    const loadB2cItems = () => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(B2C_CART_KEY);
            setB2cItems(raw ? (JSON.parse(raw) as B2CCartItem[]) : []);
        } catch {
            setB2cItems([]);
        }
    };

    useEffect(() => {
        loadB2cItems();
        const onUpdate = () => loadB2cItems();
        window.addEventListener("b2cCartUpdated", onUpdate);
        window.addEventListener("storage", onUpdate);
        return () => {
            window.removeEventListener("b2cCartUpdated", onUpdate);
            window.removeEventListener("storage", onUpdate);
        };
    }, []);

    useEffect(() => {
        const load = () => {
            try {
                if (typeof window === "undefined") return;
                const raw = window.localStorage.getItem(NEGOTIATION_CARTS_LOCAL_KEY);
                const map = raw ? (JSON.parse(raw) as Record<string, NegotiationCart>) : {};
                const carts = Object.values(map);
                setNegotiationOrders(carts);
                setSelectedNegotiations((prev) => {
                    const next: Record<string, boolean> = { ...prev };
                    for (const c of carts) {
                        if (typeof next[c.conversationId] !== "boolean") next[c.conversationId] = true;
                    }
                    return next;
                });
            } catch {}
        };
        load();
    }, [NEGOTIATION_CARTS_LOCAL_KEY]);

    const updateB2cQty = (id: string, delta: number) => {
        setB2cItems((prev) => {
            const next = prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, Math.min(99, i.quantity + delta)) } : i);
            localStorage.setItem(B2C_CART_KEY, JSON.stringify(next));
            return next;
        });
    };

    const removeB2cItem = (id: string) => {
        setB2cItems((prev) => {
            const next = prev.filter((i) => i.id !== id);
            localStorage.setItem(B2C_CART_KEY, JSON.stringify(next));
            cartStore.setCart(next.reduce((s, i) => s + i.quantity, 0));
            window.dispatchEvent(new Event("b2cCartUpdated"));
            return next;
        });
    };

    const handleB2cCheckout = async () => {
        setB2cCheckoutLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        localStorage.removeItem(B2C_CART_KEY);
        cartStore.setCart(0);
        window.dispatchEvent(new Event("b2cCartUpdated"));
        setB2cItems([]);
        message.success("Order placed successfully!");
        setB2cCheckoutLoading(false);
        router.push("/buyer/orders");
    };

    const toggleNegotiation = (id: string) => {
        setSelectedNegotiations((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const removeNegotiation = async (id: string) => {
        try {
            if (typeof window === "undefined") return;
            const raw = window.localStorage.getItem(NEGOTIATION_CARTS_LOCAL_KEY);
            const map = raw ? (JSON.parse(raw) as Record<string, NegotiationCart>) : {};
            delete map[id];
            window.localStorage.setItem(NEGOTIATION_CARTS_LOCAL_KEY, JSON.stringify(map));
            setNegotiationOrders((prev) => prev.filter((c) => c.conversationId !== id));
            setSelectedNegotiations((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } catch {}
    };

    const selectAllNegotiations = (value: boolean) => {
        setSelectedNegotiations((prev) => {
            const next = { ...prev };
            for (const o of negotiationOrders) {
                next[o.conversationId] = value;
            }
            return next;
        });
    };

    const handleCheckout = async (payload: {
        items: Cart[];
        negotiationOrders: NegotiationCart[];
        totals: {
            fobTotal: number;
            logisticsFees: number;
            negotiatedTotal: number;
            total: number;
        };
        currency?: string;
    }) => {
        try {
            setCheckoutLoading(true);
            if (typeof window !== "undefined") {
                const raw = window.localStorage.getItem(NEGOTIATION_CARTS_LOCAL_KEY);
                const map = raw ? (JSON.parse(raw) as Record<string, NegotiationCart>) : {};
                for (const order of payload.negotiationOrders) {
                    delete map[order.conversationId];
                }
                window.localStorage.setItem(NEGOTIATION_CARTS_LOCAL_KEY, JSON.stringify(map));
            }
            message.success("Local checkout completed.");
            setNegotiationOrders((prev) =>
                prev.filter((o) => !payload.negotiationOrders.some((x) => x.conversationId === o.conversationId))
            );
            router.push("/buyer/orders");
        } catch {
            message.error("Local checkout failed.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const isEmpty = list.length < 1 && negotiationOrders.length < 1 && b2cItems.length < 1;

    if (isEmpty) {
        return (
            <div className="flex justify-center">
                <div className="p-4 border rounded-2xl border-stroke-light">Cart is Empty</div>
            </div>
        );
    }

    const b2cTotal = b2cItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const b2cCurrency = b2cItems[0]?.currency || "AED";

    return (
        <div className="space-y-10">
            {b2cItems.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-brand-blue mb-4">Shopping Cart ({b2cItems.length} item{b2cItems.length !== 1 ? "s" : ""})</h2>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {b2cItems.map((item) => (
                                <div key={item.id} className="p-4 border border-stroke-light rounded-xl flex gap-4">
                                    <img src={item.imageUrl || "/seed-images/01a925d2f23d5cc8.jpg"} alt={item.name} className="h-20 w-20 object-cover rounded-lg shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-base font-semibold text-brand-blue">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.supplier}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-lg font-bold text-brand-blue">{formatPrice(item.price * item.quantity, item.currency)}</div>
                                                {item.quantity > 1 && <div className="text-xs text-gray-400">{formatPrice(item.price, item.currency)} each</div>}
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center border border-stroke-light rounded-lg overflow-hidden">
                                                <button onClick={() => updateB2cQty(item.id, -1)} className="px-3 py-1.5 text-gray-600 hover:bg-accent transition-colors">−</button>
                                                <span className="px-4 py-1.5 text-sm font-medium border-x border-stroke-light min-w-[2.5rem] text-center">{item.quantity}</span>
                                                <button onClick={() => updateB2cQty(item.id, 1)} className="px-3 py-1.5 text-gray-600 hover:bg-accent transition-colors">+</button>
                                            </div>
                                            <button onClick={() => removeB2cItem(item.id)} className="text-sm text-red-500 hover:text-red-700 transition-colors">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex flex-col gap-4 rounded-xl border border-stroke-light p-6 sticky top-20">
                                <h4 className="leading-none text-brand-blue">Order Summary</h4>
                                <div className="space-y-3 text-sm">
                                    {b2cItems.map((i) => (
                                        <div key={i.id} className="flex justify-between text-gray-600">
                                            <span className="truncate mr-2">{i.name} × {i.quantity}</span>
                                            <span className="shrink-0">{formatPrice(i.price * i.quantity, i.currency)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-stroke-light pt-3 flex justify-between font-semibold text-base">
                                        <span>Total</span>
                                        <span className="text-brand-blue">{formatPrice(b2cTotal, b2cCurrency)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleB2cCheckout}
                                    disabled={b2cCheckoutLoading}
                                    className="w-full py-3 rounded-xl font-medium text-sm bg-brand-blue text-white hover:bg-primary-hover transition-all disabled:opacity-60"
                                >
                                    {b2cCheckoutLoading ? "Placing Order…" : `Checkout (${b2cItems.length} item${b2cItems.length !== 1 ? "s" : ""})`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {(list.length > 0 || negotiationOrders.length > 0) && (
                <CartList
                    list={list}
                    negotiationOrders={negotiationOrders}
                    selectedNegotiations={selectedNegotiations}
                    onToggleNegotiation={toggleNegotiation}
                    onRemoveNegotiation={removeNegotiation}
                    onSelectAllNegotiations={selectAllNegotiations}
                    onCheckout={handleCheckout}
                    isCheckingOut={checkoutLoading}
                />
            )}
        </div>
    );
}
