import { SalesResponse } from "@/features/sell/types/sale";
import { apiClient } from "@/shared/lib/axios"

export const getSales = async (page: number = 1, limit: number = 10) : Promise<SalesResponse> => {
    const response = await apiClient.get("/api/ventas", {
        params: {
            page,
            limit
        }
    });
    return response.data;
}

export const getSaleTicket = async (saleId: string | number) : Promise<Blob> => {
    const response = await apiClient.get(`/api/ventas/${saleId}/ticket`,
        {
            responseType: "blob",
        }
    );
    return response.data;
}