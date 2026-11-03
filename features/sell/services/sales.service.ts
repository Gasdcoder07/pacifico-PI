import { apiClient } from "@/shared/lib/axios"
import { SalePayload } from "../types/sale";

export const createSale = async (data: SalePayload) : Promise<any> => {
    const response = await apiClient.post("/api/ventas", data);
    return response.data;
}