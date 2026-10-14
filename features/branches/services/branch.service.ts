import { apiClient } from "@/shared/lib/axios";
import { Branch } from "../types/branch";

export interface CreateBranchPayload {
    name: string;
    direction: string;
    phone?: string;
    contact_info?: string;
}

export const getBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get("/api/sucursales")
    return response.data.data
}

export const createBranch = (data: CreateBranchPayload): Promise<Branch> => {
    return apiClient.post("/api/sucursales", data).then((response) => response.data.data);
}