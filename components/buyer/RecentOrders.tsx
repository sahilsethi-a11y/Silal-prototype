"use client";
import Button from "@/elements/Button";
import { useRouter } from "next/navigation";

const data = [
    {
        imgUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e",
        title: "Hydroponic Tomato Box",
        details: "ORD-001 • 2024-01-15",
        price: "AED 180",
        status: "DELIVERED",
    },
    {
        imgUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716",
        title: "Premium Dates Selection",
        details: "ORD-002 • 2024-01-10",
        price: "AED 660",
        status: "IN TRANSIT",
    },
    {
        imgUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09",
        title: "Arabic STEM Board Game",
        details: "ORD-003 • 2024-01-08",
        price: "AED 275",
        status: "PROCESSING",
    },
];

const baseBadgeCls = "px-1.5 py-1 rounded-sm text-xs font-medium";
const getStatus = (status: string) => {
    switch (status) {
        case "DELIVERED":
            return (
                <span className={`bg-[#e7f7e7] text-[#2d5a2d] ${baseBadgeCls}`}>
                    Delivered
                </span>
            );
        case "IN TRANSIT":
            return (
                <span className={`bg-[#f3e8ff] text-[#6b2c91] ${baseBadgeCls}`}>
                    In Transit
                </span>
            );
        case "PROCESSING":
            return (
                <span className={`bg-[#fff4e6] text-[#b45309] ${baseBadgeCls}`}>
                    Processing
                </span>
            );
        default:
            return <></>;
    }
};

export default function RecentOrders() {
    const router = useRouter();
    return (
        <div className="bg-white text-foreground flex flex-col gap-6 rounded-xl border border-stroke-light p-6">
            <div className="flex items-center justify-between">
                <h4 className="leading-none text-brand-blue">Recent Orders</h4>
                <Button
                    variant="outline"
                    onClick={() => router.push("/buyer/orders")}
                >
                    View All Order
                </Button>
            </div>
            <div className="space-y-4">
                {data.map((item, i) => (
                    <div
                        key={item.title}
                        className="flex items-center justify-between py-3 border-b last:border-b-0 border-stroke-light"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-10.5 rounded-md bg-accent"></div>
                            {/* <Image
                                width={56}
                                height={42}
                                src={data[i].imgUrl}
                                alt={data[i].title}
                            /> */}
                            <div>
                                <h4 className="text-brand-blue">
                                    {data[i].title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {data[i].details}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-brand-blue">{data[i].price}</p>
                            {getStatus(data[i].status)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
