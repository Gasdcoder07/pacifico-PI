import { apiClient } from "@/shared/lib/axios"
import { Company } from "../types/company";

export const getCompanyById = async (id: string | number): Promise<Company> => {
    const response = await apiClient.get(`/api/empresas/${id}`);
    return response.data;
}