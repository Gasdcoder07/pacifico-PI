import { apiClient } from "@/shared/lib/axios";
import { AxiosResponse } from "axios";
import { UsersResponse } from "../types/user";

type DeleteUserResponse = {
    message: string;
};

export const deleteUser = async (id: string | number): Promise<AxiosResponse<DeleteUserResponse>> => {
    const response = await apiClient.delete<DeleteUserResponse>(`api/usuarios/${id}`);

    return response;
}

export const getUsers = async () : Promise<UsersResponse> => {
    const response = await apiClient.get("/api/usuarios");
    return response.data;
}