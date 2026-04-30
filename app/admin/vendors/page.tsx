"use client";

import { useState } from "react";
import {
    MOCK_VENDORS,
    KYC_STATUS_LABELS,
    KYC_STATUS_COLORS,
    formatAEDCompact,
    type KYCStatus,
    type MockVendor,
} from "@/lib/mockData";

const DOC_LABELS: Record<keyof MockVendor["documents"], string> = {
    tradeLicense: "Trade License",
    emiratesId: "Emirates ID",
    bankLetter: "Bank Letter",
    originCertificate: "Origin Certificate",
    exportLicense: "Export License",
    halalCertificate: "Halal Certificate",
};

const KYC_FILTER_OPTIONS: { label: string; value: KYCStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Review", value: "in_review" },
    { label: "Docs Requested", value: "docs_requested" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

export default function VendorsPage() {
    const [filter, setFilter] = useState<KYCStatus | "all">("all");
    const [selectedVendor, setSelectedVendor] = useState<MockVendor | null>(null);
    const [statuses, setStatuses] = useState<Record<string, KYCStatus>>({});

    const getStatus = (v: MockVendor): KYCStatus => statuses[v.id] ?? v.kycStatus;

    const filtered = MOCK_VENDORS.filter((v) => filter === "all" || getStatus(v) === filter);

    const approve = (id: string) => setStatuses((s) => ({ ...s, [id]: "approved" }));
    const reject = (id: string) => setStatuses((s) => ({ ...s, [id]: "rejected" }));
    const requestDocs = (id: string) => setStatuses((s) => ({ ...s, [id]: "docs_requested" }));
    const setReview = (id: string) => setStatuses((s) => ({ ...s, [id]: "in_review" }));

    const counts = {
        all: MOCK_VENDORS.length,
        pending: MOCK_VENDORS.filter((v) => getStatus(v) === "pending").length,
        in_review: MOCK_VENDORS.filter((v) => getStatus(v) === "in_review").length,
        docs_requested: MOCK_VENDORS.filter((v) => getStatus(v) === "docs_requested").length,
        approved: MOCK_VENDORS.filter((v) => getStatus(v) === "approved").length,
        rejected: MOCK_VENDORS.filter((v) => getStatus(v) === "rejected").length,
    };

    return (
        <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(["pending", "in_review", "docs_requested", "approved", "rejected"] as KYCStatus[]).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`rounded-xl border p-4 text-left transition-shadow hover:shadow-md ${filter === s ? "border-brand-blue" : "border-stroke-light"} bg-white`}
                    >
                        <p className="text-2xl font-semibold">{counts[s]}</p>
                        <p className="text-xs text-gray-500 mt-1">{KYC_STATUS_LABELS[s]}</p>
                    </button>
                ))}
            </div>

            <div className="flex gap-3 flex-wrap items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {KYC_FILTER_OPTIONS.map((o) => (
                        <button
                            key={o.value}
                            onClick={() => setFilter(o.value)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${filter === o.value ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-600 border-stroke-light hover:border-brand-blue"}`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-gray-500">{filtered.length} vendors</p>
            </div>

            <div className="bg-white rounded-xl border border-stroke-light overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="text-left px-4 py-3">Supplier</th>
                            <th className="text-left px-4 py-3">Category</th>
                            <th className="text-left px-4 py-3">Emirate</th>
                            <th className="text-left px-4 py-3">KYC Status</th>
                            <th className="text-left px-4 py-3">Docs</th>
                            <th className="text-left px-4 py-3">Revenue</th>
                            <th className="text-left px-4 py-3">Risk</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke-light">
                        {filtered.map((vendor) => {
                            const status = getStatus(vendor);
                            const docCount = Object.values(vendor.documents).filter(Boolean).length;
                            const totalDocs = Object.keys(vendor.documents).length;
                            return (
                                <tr key={vendor.id} className="hover:bg-accent/30">
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedVendor(vendor)}
                                            className="text-left"
                                        >
                                            <p className="font-medium text-brand-blue hover:underline">{vendor.name}</p>
                                            <p className="text-xs text-gray-500">{vendor.contactName}</p>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{vendor.category}</td>
                                    <td className="px-4 py-3 text-gray-600">{vendor.emirate}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${KYC_STATUS_COLORS[status]}`}>
                                            {KYC_STATUS_LABELS[status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className="h-full bg-silal-leaf rounded-full"
                                                    style={{ width: `${(docCount / totalDocs) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{docCount}/{totalDocs}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {vendor.totalRevenue > 0 ? formatAEDCompact(vendor.totalRevenue) : "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <RiskBadge score={vendor.riskScore} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 flex-wrap">
                                            {status !== "approved" && (
                                                <ActionBtn color="green" onClick={() => approve(vendor.id)}>Approve</ActionBtn>
                                            )}
                                            {status !== "rejected" && (
                                                <ActionBtn color="red" onClick={() => reject(vendor.id)}>Reject</ActionBtn>
                                            )}
                                            {status === "pending" && (
                                                <ActionBtn color="blue" onClick={() => setReview(vendor.id)}>Review</ActionBtn>
                                            )}
                                            {status !== "docs_requested" && status !== "approved" && (
                                                <ActionBtn color="orange" onClick={() => requestDocs(vendor.id)}>Req Docs</ActionBtn>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-gray-400 text-sm">No vendors match this filter.</div>
                )}
            </div>

            {/* Vendor Detail Modal */}
            {selectedVendor && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedVendor(null)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-brand-blue">{selectedVendor.name}</h3>
                                <p className="text-sm text-gray-500">{selectedVendor.category} · {selectedVendor.emirate}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${KYC_STATUS_COLORS[getStatus(selectedVendor)]}`}>
                                {KYC_STATUS_LABELS[getStatus(selectedVendor)]}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-gray-500">Contact</span><p className="font-medium">{selectedVendor.contactName}</p></div>
                            <div><span className="text-gray-500">Email</span><p className="font-medium">{selectedVendor.email}</p></div>
                            <div><span className="text-gray-500">Phone</span><p className="font-medium">{selectedVendor.phone}</p></div>
                            <div><span className="text-gray-500">Registered</span><p className="font-medium">{selectedVendor.registrationDate}</p></div>
                            <div><span className="text-gray-500">Revenue</span><p className="font-medium">{selectedVendor.totalRevenue > 0 ? formatAEDCompact(selectedVendor.totalRevenue) : "—"}</p></div>
                            <div><span className="text-gray-500">Rating</span><p className="font-medium">{selectedVendor.rating > 0 ? `${selectedVendor.rating} / 5` : "—"}</p></div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold mb-2 text-gray-700">KYC Documents</p>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.entries(selectedVendor.documents) as [keyof MockVendor["documents"], boolean | undefined][]).map(([key, val]) => (
                                    <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${val ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                        <span>{val ? "✓" : "✗"}</span>
                                        <span>{DOC_LABELS[key]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedVendor.notes && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                                <strong>Note:</strong> {selectedVendor.notes}
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button onClick={() => { approve(selectedVendor.id); setSelectedVendor(null); }} className="flex-1 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-primary-hover transition-colors">Approve</button>
                            <button onClick={() => { requestDocs(selectedVendor.id); setSelectedVendor(null); }} className="flex-1 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors">Request Docs</button>
                            <button onClick={() => { reject(selectedVendor.id); setSelectedVendor(null); }} className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RiskBadge({ score }: { score: number }) {
    const color = score <= 3 ? "text-green-700 bg-green-50" : score <= 6 ? "text-orange-700 bg-orange-50" : "text-red-700 bg-red-50";
    const label = score <= 3 ? "Low" : score <= 6 ? "Medium" : "High";
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {label} ({score})
        </span>
    );
}

function ActionBtn({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) {
    const colors: Record<string, string> = {
        green: "bg-green-100 text-green-700 hover:bg-green-200",
        red: "bg-red-100 text-red-700 hover:bg-red-200",
        blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        orange: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    };
    return (
        <button onClick={onClick} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${colors[color]}`}>
            {children}
        </button>
    );
}
