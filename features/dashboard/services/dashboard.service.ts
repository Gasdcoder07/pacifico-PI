import { apiClient } from "@/shared/lib/axios"

export const getDashboardData = async () => {
    const response = await apiClient.get("/api/dashboard");
    return response.data;
}