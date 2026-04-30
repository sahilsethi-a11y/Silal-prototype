import { ArrowRightIcon, CheckCircleIcon, ImageIcon, PackageIcon, SearchIcon, Shield, SparklesIcon, StoreIcon, UsersIcon } from "@/components/Icons";
import Image from "@/elements/Image";
import { uaeProductCatalog } from "@/data/uaeProducts";
import Link from "next/link";

const categories = [
    { name: "Food", detail: "Farmers, fresh produce, dates, pantry essentials", href: "/products?bodyType=Food&market=retail" },
    { name: "Clothing", detail: "Fashion, textiles, uniforms, modest wear", href: "/products?bodyType=Clothing&market=retail" },
    { name: "Games", detail: "UAE-made toys, board games, educational kits", href: "/products?bodyType=Games&market=retail" },
];

const flows = [
    {
        title: "Buyers",
        detail: "Shop B2C, build B2B RFQs, compare verified UAE suppliers, track orders, and negotiate contract quantities.",
        href: "/signup/buyer",
        icon: <UsersIcon className="h-5 w-5" />,
    },
    {
        title: "Suppliers",
        detail: "Onboard farms, food brands, fashion makers, and game studios with listings, documents, bank details, and fulfillment rules.",
        href: "/signup/seller",
        icon: <StoreIcon className="h-5 w-5" />,
    },
    {
        title: "Admins",
        detail: "Moderate listings, approve KYC, monitor AI flags, manage categories, and oversee B2C and B2B marketplace health.",
        href: "/login",
        icon: <Shield className="h-5 w-5" />,
    },
];

const aiFeatures = [
    { title: "Chatbot", detail: "Guides buyers, suppliers, and admins through product discovery, RFQs, onboarding, and support." },
    { title: "Image classification", detail: "Detects food, clothing, games, packaging quality, duplicates, and catalogue mismatches." },
    { title: "Product identification", detail: "Suggests category, HS-style tags, UAE origin fields, pack size, and search keywords." },
    { title: "KYC checks", detail: "Reviews trade licenses, Emirates ID, bank letters, origin certificates, and compliance evidence." },
];

const metrics = [
    { value: "B2C", label: "Household shopping" },
    { value: "B2B", label: "Bulk procurement" },
    { value: "AI", label: "Trust workflows" },
    { value: "UAE", label: "Made locally" },
];

const featuredProducts = uaeProductCatalog.slice(0, 4);

export default function Home() {
    return (
        <main className="bg-white text-brand-blue">
            <section className="relative min-h-[82vh] overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1800&q=85"
                    alt="Fresh UAE marketplace produce"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d2415]/90 via-[#174f2a]/70 to-black/20" />
                <div className="relative z-10 container mx-auto flex min-h-[82vh] flex-col justify-center px-4 py-16 lg:px-6">
                    <div className="max-w-4xl text-white">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur">
                            <SparklesIcon className="h-4 w-4" />
                            UAE-made products marketplace
                        </div>
                        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">Silal Marketplace for products made in the UAE</h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-xl">
                            A marketplace for local food, clothing, games, and future categories, connecting households, enterprises, retailers, Horeca buyers, and verified UAE suppliers.
                        </p>
                    </div>

                    <div className="mt-8 max-w-5xl rounded-lg border border-white/20 bg-white p-4 shadow-2xl md:p-5">
                        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
                            <label className="flex min-h-12 items-center gap-3 rounded-md border border-stroke-light bg-input-background px-3">
                                <SearchIcon className="h-4 w-4 text-brand-blue" />
                                <span className="sr-only">Search marketplace</span>
                                <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search dates, tomatoes, abayas, games" />
                            </label>
                            <Link href="/products?market=retail" className="flex min-h-12 items-center justify-center rounded-md border border-brand-blue px-4 text-sm font-semibold text-brand-blue hover:bg-accent">
                                B2C Retail
                            </Link>
                            <Link href="/products?market=wholesale" className="flex min-h-12 items-center justify-center rounded-md border border-brand-blue px-4 text-sm font-semibold text-brand-blue hover:bg-accent">
                                B2B Wholesale
                            </Link>
                            <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand-blue px-5 text-sm font-semibold text-white hover:bg-primary-hover">
                                Search
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                            {categories.map((category) => (
                                <Link key={category.name} href={category.href} className="rounded-md border border-stroke-light p-3 hover:border-brand-blue hover:bg-accent">
                                    <span className="block font-semibold text-brand-blue">{category.name}</span>
                                    <span className="mt-1 block leading-5">{category.detail}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-stroke-light bg-[#f7faf4]">
                <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 lg:px-6">
                    {metrics.map((metric) => (
                        <div key={metric.label}>
                            <div className="text-2xl font-bold text-brand-blue">{metric.value}</div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-4 py-14 lg:px-6">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-blue">Featured UAE Products</h2>
                        <p className="mt-2 max-w-2xl text-gray-600">Retail-ready products and B2B-capable supplier catalogues across food, fashion, and games.</p>
                    </div>
                    <Link href="/products" className="inline-flex w-fit items-center gap-2 rounded-md border border-brand-blue px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-accent">
                        View marketplace
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
                        <Link key={product.id} href={`/products/${product.inventory.id}`} className="group overflow-hidden rounded-lg border border-stroke-light bg-white shadow-sm hover:shadow-md">
                            <div className="relative aspect-[4/3] bg-accent">
                                <Image src={product.inventory.mainImageUrl} alt={product.inventory.model} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <div className="p-4">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-brand-blue">{product.inventory.bodyType}</span>
                                    <span className="text-sm font-semibold">{product.inventory.currency} {product.inventory.price}</span>
                                </div>
                                <h3 className="font-semibold text-gray-950">{product.inventory.model}</h3>
                                <p className="mt-1 text-sm text-gray-600">{product.user.roleMetaData.companyName}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="bg-[#102618] text-white">
                <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-6">
                    <div>
                        <h2 className="text-3xl font-bold">Comprehensive Flows For Every User</h2>
                        <p className="mt-3 text-[#dfe8d9]">
                            The platform supports household checkout, enterprise RFQs, supplier catalog operations, and admin trust workflows in one marketplace.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {flows.map((flow) => (
                            <Link key={flow.title} href={flow.href} className="rounded-lg border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-white text-brand-blue">{flow.icon}</div>
                                <h3 className="font-semibold">{flow.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-[#dfe8d9]">{flow.detail}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-14 lg:px-6">
                <div className="mb-8 max-w-3xl">
                    <h2 className="text-3xl font-bold text-brand-blue">AI Trust And Commerce Layer</h2>
                    <p className="mt-2 text-gray-600">AI features are built into discovery, listing quality, supplier onboarding, and admin moderation.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {aiFeatures.map((feature, index) => (
                        <div key={feature.title} className="rounded-lg border border-stroke-light bg-white p-5 shadow-sm">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent text-brand-blue">
                                {index === 0 ? <SparklesIcon className="h-5 w-5" /> : index === 1 ? <ImageIcon className="h-5 w-5" /> : index === 2 ? <PackageIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                            </div>
                            <h3 className="font-semibold text-gray-950">{feature.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-600">{feature.detail}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
