import UsersTable, { type Data } from "@/components/admin/UsersTable";
import { api } from "@/lib/api/server-request";

export default async function Users() {
    const fallbackData: Data = {
        content: [],
        currentPage: 1,
        totalPages: 1,
        size: 10,
        totalItems: 0,
    };

    let usersData = fallbackData;
    try {
        const res = await api.get<{ data: Data }>("/users/api/v1/users/list", { params: { size: 10 } });
        usersData = res?.data ?? fallbackData;
    } catch {
        usersData = fallbackData;
    }

    return (
        <main>
            <UsersTable data={usersData} />
        </main>
    );
}
