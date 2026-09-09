import { apiClient } from "@/lib/axios"
import { LoginRequest, LoginResponse, UserProfile } from "@/types/authInterfaces";

export const loginUser = async (credentials : LoginRequest) : Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", credentials);
    return response.data;
}

export const getUserSession = async (): Promise<UserProfile | null> => {
    if (typeof window === "undefined") {
        return null;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        console.error("No hay token ni ID de usuario.");
        return null;
    }

    try {
        const response = await apiClient.get<{ data: UserProfile }>(`/api/usuarios/${userId}`);

        return response.data.data;
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");

        return null;
    }
}