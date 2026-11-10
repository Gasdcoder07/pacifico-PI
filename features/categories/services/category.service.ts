import { apiClient } from "@/shared/lib/axios"
import { CreateCategoryPayload, CreateCategoryResponse } from "../types/category";

export const createCategory = async (data: CreateCategoryPayload) : Promise<CreateCategoryResponse> => {
    const response = await apiClient.post("/api/category", data);
    return response.data;
}