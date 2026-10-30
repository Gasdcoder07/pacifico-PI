import { apiClient } from "@/shared/lib/axios"
import { Company, CompanyRequest, CompanyResponse } from "../types/company";

export const getCompanyById = async (id: string | number): Promise<Company> => {
    const response = await apiClient.get(`/api/empresas/${id}`);
    return response.data;
}

export const updateCompany = async (id: string | number, data: CompanyRequest): Promise<CompanyResponse> => {
    const response = await apiClient.put(`/api/empresas/${id}`, data);
    return response.data;
}