import SellerOnboard from "@/components/SellerOnboard";

const data = {
  title: "Create Your Supplier Account",
  subTitle:
    "Register as a UAE supplier to sell food, clothing, games, and other locally made products through B2C and B2B marketplace flows.",
};

export default function page() {
  return (
    <main>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl mb-4 text-[#202C4A]">
             {data.title}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {data.subTitle}
            </p>
          </div>
          <SellerOnboard />
        </div>
      </div>
    </main>
  );
}
