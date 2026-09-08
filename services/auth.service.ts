import { apiClient } from "@/lib/axios"
import { LoginRequest } from "@/types/authInterfaces";

export const loginUser = async (credentials : LoginRequest) : Promise<any> => {
    const response = await apiClient.post<any>("/api/auth/login", credentials);
    return response.data;
}

export const getUserSession = async () => {
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
        const response = await apiClient.get(`/api/usuarios/${encodeURIComponent(userId)}`);

        console.log("Respuesta de getUserSession:", response.data);

        return response.data.usuario;
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");

        return null;
    }
}