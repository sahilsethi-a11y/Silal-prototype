"use client";

import { useState } from "react";
import { cartStore } from "@/lib/cartStore";
import message from "@/elements/message";

const B2C_CART_KEY = "b2cCart";

export interface B2CCartItem {
    id: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
    imageUrl: string;
    supplier: string;
}

function persistToCart(item: B2CCartItem) {
    try {
        const raw = localStorage.getItem(B2C_CART_KEY);
        const cart: B2CCartItem[] = raw ? JSON.parse(raw) : [];
        const existing = cart.findIndex((i) => i.id === item.id);
        if (existing >= 0) {
            cart[existing].quantity += item.quantity;
        } else {
            cart.push(item);
        }
        localStorage.setItem(B2C_CART_KEY, JSON.stringify(cart));
        cartStore.addToCart();
        window.dispatchEvent(new Event("b2cCartUpdated"));
    } catch {}
}

type Props = {
    productId: string;
    name: string;
    price: number;
    currency: string;
    imageUrl: string;
    supplier: string;
};

export default function B2CAddToCartButton({ productId, name, price, currency, imageUrl, supplier }: Readonly<Props>) {
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        persistToCart({ id: productId, name, price, currency, quantity: qty, imageUrl, supplier });
        setAdded(true);
        message.success("Added to cart");
        setTimeout(() => setAdded(false), 2500);
    };

    const formattedPrice = new Intl.NumberFormat("en-AE", { style: "currency", currency: currency || "AED" }).format(price * qty);

    return (
        <div className="space-y-3">
            {/* Quantity selector */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantity</span>
                <div className="flex items-center border border-stroke-light rounded-lg overflow-hidden">
                    <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="px-3 py-2 text-gray-600 hover:bg-accent transition-colors text-lg leading-none"
                    >
                        −
                    </button>
                    <span className="px-4 py-2 text-sm font-medium border-x border-stroke-light min-w-[3rem] text-center">
                        {qty}
                    </span>
                    <button
                        onClick={() => setQty((q) => Math.min(99, q + 1))}
                        className="px-3 py-2 text-gray-600 hover:bg-accent transition-colors text-lg leading-none"
                    >
                        +
                    </button>
                </div>
            </div>

            {qty > 1 && (
                <p className="text-xs text-gray-500">
                    Total: <span className="font-semibold text-brand-blue">{formattedPrice}</span>
                </p>
            )}

            <button
                onClick={handleAdd}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                    added
                        ? "bg-green-600 text-white"
                        : "bg-brand-blue text-white hover:bg-primary-hover"
                }`}
            >
                {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>

            <button className="w-full py-3 rounded-xl font-medium text-sm border border-brand-blue text-brand-blue hover:bg-accent transition-colors">
                Buy Now
            </button>
        </div>
    );
}
