export interface Category {
    id: number
    company_id: number
    name: string
    description: string | null
    admin_id: number
    created_at: string
    updated_at: string
}

export interface CreateCategoryPayload {
    name: string;
    description: string | null;
}

export interface CreateCategoryResponse {
    success: string;
}

export interface EditCategoryPayload {
    id: number;
    name: string;
    description: string | null;
}

export interface EditCategoryResponse {
    success: string;
}