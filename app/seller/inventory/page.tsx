import { redirect } from "next/navigation";

export default function SellerInventoryRedirect() {
    redirect("/seller/products");
}
