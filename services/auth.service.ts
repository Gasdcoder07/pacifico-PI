import { apiClient } from "@/lib/axios"
import { LoginRequest } from "@/types/authInterfaces";

export const loginUser = async (credentials : LoginRequest) : Promise<any> => {
    const response = await apiClient.post<any>("/api/auth/login", credentials);
    return response.data;
}