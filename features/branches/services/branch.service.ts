import { apiClient } from "@/shared/lib/axios";
import { Branch } from "../types/branch";

export const getBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get("/api/sucursales")
    return response.data.data 
}