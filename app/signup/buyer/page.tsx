import BuyerOnboard from "@/components/BuyerOnboard";

const data = {
    title: "Create Your Buyer Account",
    description: "Register as a consumer or business buyer to shop UAE-made products, build B2B RFQs, and access verified supplier trust signals.",
};

export default function page() {
    return (
        <main>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl mb-4 text-brand-blue">{data.title}</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">{data.description}</p>
                    </div>
                    <BuyerOnboard />
                </div>
            </div>
        </main>
    );
}
