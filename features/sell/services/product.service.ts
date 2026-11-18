import { apiClient } from "@/shared/lib/axios"
import { BranchProducts, DeleteProductPayload, DeleteProductResponse, EditProductPayload, EditProductResponse, Product } from "../types/product";

interface ProductFilters {
    branch?: string;
    category?: string;
}

interface SearchProductsResponse {
    data: Product[];
}

export const getProducts = async (filters: ProductFilters = {}) : Promise<BranchProducts[]> => {
    const params = new URLSearchParams();

    if (filters.branch) {
        params.set("branch", filters.branch);
    }

    if (filters.category) {
        params.set("category", filters.category);
    }

    const query = params.toString();

    const response = await apiClient.get(
        `/api/inventory${query ? `?${query}` : ""}`
    );
    return response.data;
}

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