"use client";

import { useState } from "react";
import { MOCK_BANNERS, MOCK_FEATURED_PRODUCTS, type MockBanner, type MockFeaturedProduct } from "@/lib/mockData";

type BannerStatus = MockBanner["status"];
const STATUS_COLORS: Record<BannerStatus, string> = {
    active: "bg-green-100 text-green-700",
    scheduled: "bg-blue-100 text-blue-700",
    paused: "bg-yellow-100 text-yellow-700",
    expired: "bg-gray-100 text-gray-500",
};

export default function MerchandisingPage() {
    const [banners, setBanners] = useState<MockBanner[]>(MOCK_BANNERS);
    const [featured, setFeatured] = useState<MockFeaturedProduct[]>(MOCK_FEATURED_PRODUCTS);
    const [activeTab, setActiveTab] = useState<"banners" | "featured" | "search">("banners");
    const [showBannerForm, setShowBannerForm] = useState(false);
    const [searchBoosts] = useState([
        { term: "dates", supplier: "Al Ain Farms LLC", boost: 150, active: true },
        { term: "fresh produce", supplier: "UAE Fresh Produce Co.", boost: 140, active: true },
        { term: "UAE made electronics", supplier: "Emirates Electronics Industries", boost: 130, active: true },
        { term: "organic honey", supplier: "Al Ain Farms LLC", boost: 120, active: false },
        { term: "cotton fabric", supplier: "Emirates Textiles Factory", boost: 110, active: true },
    ]);

    const toggleBannerStatus = (id: string) => {
        setBanners((bs) =>
            bs.map((b) =>
                b.id === id ? { ...b, status: b.status === "active" ? "paused" : "active" } : b
            )
        );
    };

    const removeFeatured = (id: string) => setFeatured((f) => f.filter((p) => p.id !== id));

    const moveFeatured = (id: string, dir: "up" | "down") => {
        setFeatured((f) => {
            const idx = f.findIndex((p) => p.id === id);
            if ((dir === "up" && idx === 0) || (dir === "down" && idx === f.length - 1)) return f;
            const next = [...f];
            const swap = dir === "up" ? idx - 1 : idx + 1;
            [next[idx], next[swap]] = [next[swap], next[idx]];
            return next.map((p, i) => ({ ...p, position: i + 1 }));
        });
    };

    return (
        <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Banners", value: banners.filter((b) => b.status === "active").length, color: "text-green-600" },
                    { label: "Scheduled", value: banners.filter((b) => b.status === "scheduled").length, color: "text-blue-600" },
                    { label: "Featured Products", value: featured.length, color: "text-brand-blue" },
                    { label: "Search Boosts", value: searchBoosts.filter((s) => s.active).length, color: "text-silal-gold" },
                ].map((c) => (
                    <div key={c.label} className="bg-white rounded-xl border border-stroke-light p-4">
                        <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stroke-light">
                {(["banners", "featured", "search"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === t ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        {t === "banners" ? "Banners" : t === "featured" ? "Featured Products" : "Search Boosts"}
                    </button>
                ))}
            </div>

            {/* Banners tab */}
            {activeTab === "banners" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Campaign Banners</h3>
                        <button
                            onClick={() => setShowBannerForm(!showBannerForm)}
                            className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-primary-hover transition-colors"
                        >
                            + New Banner
                        </button>
                    </div>

                    {showBannerForm && (
                        <div className="bg-accent rounded-xl p-5 border border-stroke-light space-y-3">
                            <p className="font-medium text-sm text-brand-blue">Create New Banner</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input placeholder="Banner title" className="border border-stroke-light rounded-lg px-3 py-2 text-sm bg-white" />
                                <input placeholder="Subtitle" className="border border-stroke-light rounded-lg px-3 py-2 text-sm bg-white" />
                                <input placeholder="CTA Text (e.g. Shop Now)" className="border border-stroke-light rounded-lg px-3 py-2 text-sm bg-white" />
                                <input placeholder="Target URL" className="border border-stroke-light rounded-lg px-3 py-2 text-sm bg-white" />
                                <input type="date" placeholder="Start date" className="border border-stroke-light rounded-lg px-3 py-2 text-sm bg-white" />
                                <input type="date" placeholder="End date" className="border border-stroke-light rounded-lg px-3 py-2 text-sm bg-white" />
                                <select className="border border-stroke-light rounded-lg px-3 py-2 text-sm bg-white">
                                    <option>Homepage Hero</option>
                                    <option>Category Top</option>
                                    <option>Sidebar</option>
                                    <option>Email</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-primary-hover">Save Banner</button>
                                <button onClick={() => setShowBannerForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">Cancel</button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4">
                        {banners.map((banner) => (
                            <div key={banner.id} className="bg-white rounded-xl border border-stroke-light overflow-hidden flex">
                                <div className="w-2 flex-shrink-0" style={{ backgroundColor: banner.imageColor }} />
                                <div className="p-4 flex-1 flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-800">{banner.title}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[banner.status]}`}>{banner.status}</span>
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{banner.placement.replace(/_/g, " ")}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{banner.subtitle}</p>
                                        <div className="flex gap-4 text-xs text-gray-400">
                                            <span>{banner.startDate} → {banner.endDate}</span>
                                            <span>{banner.impressions.toLocaleString()} impressions</span>
                                            <span>{banner.clicks.toLocaleString()} clicks</span>
                                            {banner.impressions > 0 && (
                                                <span className="text-silal-leaf font-medium">
                                                    {((banner.clicks / banner.impressions) * 100).toFixed(1)}% CTR
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleBannerStatus(banner.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${banner.status === "active" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                                        >
                                            {banner.status === "active" ? "Pause" : "Activate"}
                                        </button>
                                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">Edit</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Products tab */}
            {activeTab === "featured" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Featured & Boosted Products</h3>
                        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-primary-hover transition-colors">
                            + Add Product
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="text-left px-4 py-3">Position</th>
                                    <th className="text-left px-4 py-3">Product</th>
                                    <th className="text-left px-4 py-3">Supplier</th>
                                    <th className="text-left px-4 py-3">Category</th>
                                    <th className="text-left px-4 py-3">Price</th>
                                    <th className="text-left px-4 py-3">Badge</th>
                                    <th className="text-left px-4 py-3">Boost Score</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stroke-light">
                                {featured.map((p) => (
                                    <tr key={p.id} className="hover:bg-accent/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold text-brand-blue w-5">#{p.position}</span>
                                                <div className="flex flex-col gap-0.5">
                                                    <button onClick={() => moveFeatured(p.id, "up")} className="text-gray-400 hover:text-gray-600 leading-none">▲</button>
                                                    <button onClick={() => moveFeatured(p.id, "down")} className="text-gray-400 hover:text-gray-600 leading-none">▼</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: p.imageColor + "30" }} />
                                                <span className="font-medium text-gray-800">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{p.supplierName}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{p.category}</td>
                                        <td className="px-4 py-3 font-medium">AED {p.price.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-silal-gold/20 text-silal-gold font-medium">{p.badge}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full bg-silal-leaf rounded-full" style={{ width: `${p.boostScore}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500">{p.boostScore}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => removeFeatured(p.id)} className="px-2 py-1 rounded text-xs bg-red-100 text-red-600 hover:bg-red-200">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Search Boosts tab */}
            {activeTab === "search" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Search Term Boosts</h3>
                        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-primary-hover transition-colors">
                            + Add Boost
                        </button>
                    </div>
                    <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="text-left px-4 py-3">Search Term</th>
                                    <th className="text-left px-4 py-3">Boosted Supplier</th>
                                    <th className="text-left px-4 py-3">Boost Value</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stroke-light">
                                {searchBoosts.map((b, i) => (
                                    <tr key={i} className="hover:bg-accent/30">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">"{b.term}"</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{b.supplier}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full bg-silal-gold rounded-full" style={{ width: `${(b.boost / 150) * 100}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500">{b.boost}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                {b.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-600 hover:bg-blue-200">Edit</button>
                                                <button className="px-2 py-1 rounded text-xs bg-red-100 text-red-600 hover:bg-red-200">Remove</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
