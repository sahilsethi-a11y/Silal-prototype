export type BuyerType = "individual" | "business";

export type LocalAuthUser = {
    userId: string;
    id: string;
    username: string;
    emailId: string;
    email: string;
    name: string;
    roleType: "buyer" | "seller" | "admin";
    buyerType?: BuyerType;
    otpVerified: boolean;
    passwordTemporary: boolean;
};

export const LOCAL_AUTH_STORAGE_KEY = "silal_local_auth_user";
export const LOCAL_AUTH_COOKIE = "userToken";

type DemoCredential = {
    username: string;
    password: string;
    user: LocalAuthUser;
};

export const DEMO_CREDENTIALS: DemoCredential[] = [
    {
        username: "individual@silal.local",
        password: "buyer123",
        user: {
            userId: "local-individual-buyer-001",
            id: "local-individual-buyer-001",
            username: "individual@silal.local",
            emailId: "individual@silal.local",
            email: "individual@silal.local",
            name: "Demo Individual Buyer",
            roleType: "buyer",
            buyerType: "individual",
            otpVerified: true,
            passwordTemporary: false,
        },
    },
    {
        username: "business@silal.local",
        password: "buyer123",
        user: {
            userId: "local-business-buyer-001",
            id: "local-business-buyer-001",
            username: "business@silal.local",
            emailId: "business@silal.local",
            email: "business@silal.local",
            name: "Demo Business Buyer",
            roleType: "buyer",
            buyerType: "business",
            otpVerified: true,
            passwordTemporary: false,
        },
    },
    {
        username: "buyer@silal.local",
        password: "buyer123",
        user: {
            userId: "local-buyer-001",
            id: "local-buyer-001",
            username: "buyer@silal.local",
            emailId: "buyer@silal.local",
            email: "buyer@silal.local",
            name: "Demo Individual Buyer",
            roleType: "buyer",
            buyerType: "individual",
            otpVerified: true,
            passwordTemporary: false,
        },
    },
    {
        username: "supplier@silal.local",
        password: "supplier123",
        user: {
            userId: "local-seller-001",
            id: "local-seller-001",
            username: "supplier@silal.local",
            emailId: "supplier@silal.local",
            email: "supplier@silal.local",
            name: "Demo Supplier",
            roleType: "seller",
            otpVerified: true,
            passwordTemporary: false,
        },
    },
    {
        username: "admin@silal.local",
        password: "admin123",
        user: {
            userId: "local-admin-001",
            id: "local-admin-001",
            username: "admin@silal.local",
            emailId: "admin@silal.local",
            email: "admin@silal.local",
            name: "Demo Admin",
            roleType: "admin",
            otpVerified: true,
            passwordTemporary: false,
        },
    },
];

export const getDemoUser = (username: string, password: string): LocalAuthUser | null => {
    const found = DEMO_CREDENTIALS.find((d) => d.username === username.trim().toLowerCase() && d.password === password);
    return found?.user ?? null;
};

export const getDemoUserByToken = (token?: string | null): LocalAuthUser | null => {
    if (!token) return null;
    const found = DEMO_CREDENTIALS.find((d) => d.user.userId === token || d.user.id === token);
    return found?.user ?? null;
};
