import { apiClient } from "@/lib/axios"
import { LoginRequest } from "@/types/authInterfaces";

export const loginUser = async (credentials : LoginRequest) : Promise<any> => {
    const response = await apiClient.post<any>("/api/auth/login", credentials);
    return response.data;
}

export const getUserSession = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
        return null;
    }

    try {
        const response = await apiClient.get("/api/auth/me");
        return response.data.usuario;

    } catch (error) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
        }
        return null;
    }
}