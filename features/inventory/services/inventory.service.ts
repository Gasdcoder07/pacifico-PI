import { apiClient } from "@/shared/lib/axios"

export interface CreateProductPayload {
    name: string
    description: string
    price: number
    category_id: number
    foto_url: string
}

export interface Category {
    id: number
    company_id: number
    name: string
    description: string
    admin_id: number
    created_at: string
    updated_at: string
}

export const createProduct = (data : CreateProductPayload) => {
    return apiClient.post("/api/inventory", data)
}

export const getCategories = async () : Promise<Category[]> => {
    const response = await apiClient.get("/api/category")
    return response.data.data
}