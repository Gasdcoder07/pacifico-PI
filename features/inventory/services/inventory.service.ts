import { Branch } from "@/features/branches/types/branch"
import { apiClient } from "@/shared/lib/axios"

export interface ProductBranchAllocation {
    branch_id: string
    quantity: number
    min_stock?: number
}

export interface CreateProductPayload {
    name: string
    description: string
    price: number
    category_id: number
    foto_public_id?: string | null,
    branches: ProductBranchAllocation[]
    image?: File | null
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

export const createProduct = async (data: FormData) => {
    const response = await apiClient.post("/api/products", data);
    return response.data;
}

export const getCategories = async () : Promise<Category[]> => {
    const response = await apiClient.get("/api/category")
    return response.data.data
}