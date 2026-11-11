import { apiClient } from "@/shared/lib/axios"
import { CreateCategoryPayload, CreateCategoryResponse, EditCategoryPayload, EditCategoryResponse } from "../types/category";

export const createCategory = async (data: CreateCategoryPayload) : Promise<CreateCategoryResponse> => {
    const response = await apiClient.post("/api/category", data);
    return response.data;
}

export const editCategory = async (data: EditCategoryPayload) : Promise<EditCategoryResponse> => {
    const response = await apiClient.put("/api/category", data);
    return response.data
}