import { apiClient } from "@/shared/lib/axios"
import { BranchProducts, DeleteProductPayload, DeleteProductResponse, EditProductPayload, EditProductResponse } from "../types/product";

export const getProducts = async () : Promise<BranchProducts[]> => {
    const response = await apiClient.get("/api/inventory");
    return response.data;
}

export const editProduct = async (data: EditProductPayload) : Promise<EditProductResponse> => {
    const response = await apiClient.put("/api/products", data);
    return response.data;
}

export const deleteProduct = async (data: DeleteProductPayload) : Promise<DeleteProductResponse> => {
    const response = await apiClient.delete("/api/products", {
        data,
    });
    return response.data;
}