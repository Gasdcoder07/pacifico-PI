import { apiClient } from "@/shared/lib/axios";
import { UsersResponse } from "../types/user";

export const getUsers = async () : Promise<UsersResponse> => {
    const response = await apiClient.get("/api/usuarios");
    return response.data;
}