import { apiClient } from "@/shared/lib/axios";
import { Branch, BranchResponse, DeleteBranchResponse, EditBranchPayload } from "../types/branch";

export interface CreateBranchPayload {
    name: string;
    direction: string;
    phone?: string;
    contact_info?: string;
    foto_public_id?: string | null;
    foto_url?: string | null;
}

export interface Branch {
    id: number
    company_id: number
    admin_id: number
    name: string
    direction: string
    phone: string
    contact_info: string
    foto_public_id?: string | null;
    foto_url?: string | null;
    status: boolean
    created_at: string
    updated_at: string
    gerentes: []
}

export const getBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get("/api/sucursales")
    return response.data.data 
}

export const getBranchById = async (id : string | number) : Promise<BranchResponse> => {
    const response = await apiClient.get(`/api/sucursales/${id}`);
    return response.data;
}

export const createBranch = async (data: CreateBranchPayload): Promise<Branch> => {
    const response = await apiClient.post("/api/sucursales", data);
    return response.data.data;
}

export const updateBranch = async (id : string | number, data: EditBranchPayload): Promise<BranchResponse> => {
    const response = await apiClient.put(`/api/sucursales/${id}`, data);
    return response.data;
}

export const deleteBranch = async (id: string | number) : Promise<DeleteBranchResponse> => {
    const response = await apiClient.delete(`/api/sucursales/${id}`)
    return response.data;
}