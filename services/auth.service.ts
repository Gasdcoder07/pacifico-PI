import { apiClient } from "@/lib/axios"
import { LoginRequest, RegisterRequest  } from "@/types/authInterfaces";

export const loginUser = async (credentials : LoginRequest) : Promise<any> => {
    const response = await apiClient.post<any>("/api/auth/login", credentials);
    return response.data;
}

export const registerUser = async (credentials: RegisterRequest): Promise<any> => {
    const response = await apiClient.post<any>("/api/auth/register", credentials);
    return response.data;
}