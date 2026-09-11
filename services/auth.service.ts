import { apiClient } from "@/lib/axios";
import {
    LoginRequest,
    LoginResponse,
    UserProfile
} from "@/types/authInterfaces";

export const loginUser = async (
    credentials: LoginRequest
): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
        "/api/auth/login",
        credentials
    );

    return response.data;
};

export const getUserSession = async (): Promise<UserProfile | null> => {
    try {
        const response = await apiClient.get<{ data: UserProfile }>(
            "/api/auth/me"
        );

        return response.data.data;
    } catch {
        return null;
    }
};