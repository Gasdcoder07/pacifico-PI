import { apiClient } from "@/shared/lib/axios";

export const getBranches = async () => {
    const response = await apiClient.get("/api/sucursales")
    return response.data 
}