import { apiClient } from "@/shared/lib/axios"
import { BranchProducts, DeleteProductPayload, DeleteProductResponse, EditProductPayload, EditProductResponse, Product } from "../types/product";

interface ProductFilters {
    branch?: string;
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
}

interface PaginatedInventoryResponse {
    data: BranchProducts[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface SearchProductsResponse {
    data: Product[];
}


export const getProducts = async (filters: ProductFilters = {}): Promise<PaginatedInventoryResponse> => {
    const params = new URLSearchParams();

    if (filters.branch) {
        params.set("branch", filters.branch);
    }

    if (filters.category) {
        params.set("category", filters.category);
    }

    if (filters.search) {
        params.set("search", filters.search);
    }

    params.set("page", String(filters.page ?? 1));
    params.set("limit", String(filters.limit ?? 10));

    const response = await apiClient.get<PaginatedInventoryResponse>(
        `/api/inventory?${params.toString()}`
    );

    return response.data;
};

export const searchProductsByName = async (name: string) : Promise<SearchProductsResponse> => {
    const response = await apiClient.get(`/api/products/${encodeURIComponent(name)}`);
    return response.data;
};

export const editProduct = async (data: FormData) : Promise<EditProductResponse> => {
    const response = await apiClient.put("/api/products", data);
    return response.data;
}

export const deleteProduct = async (data: DeleteProductPayload) : Promise<DeleteProductResponse> => {
    const response = await apiClient.delete("/api/products", {
        data,
    });
    return response.data;
}