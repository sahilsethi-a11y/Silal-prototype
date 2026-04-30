import LoginForm from "@/components/login/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Silal Marketplace - Login",
    description: "Login as a buyer, supplier, or admin for the UAE-made products marketplace.",
};

export default async function Login({ searchParams }: Readonly<{ searchParams: Promise<{ redirectUrl?: string }> }>) {
    const { redirectUrl } = await searchParams;

    return (
        <main>
            <LoginForm redirectUrl={redirectUrl} />
        </main>
    );
}
