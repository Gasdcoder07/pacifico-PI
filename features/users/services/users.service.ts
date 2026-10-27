import { apiClient } from "@/shared/lib/axios";
import { AxiosResponse } from "axios";
import { CreateUserRequest, EditUserPayload, UsersResponse } from "../types/user";

type DeleteUserResponse = {
    message: string;
};

export const deleteUser = async (id: string | number): Promise<AxiosResponse<DeleteUserResponse>> => {
    const response = await apiClient.delete<DeleteUserResponse>(`/api/usuarios/${id}`);
    return response;
}

export const updateUser = async (id: string | number, data: EditUserPayload): Promise<AxiosResponse<UsersResponse>> => {
    const response = await apiClient.put<UsersResponse>(`/api/usuarios/${id}`, data);
    return response;
}

export const getUsers = async () : Promise<UsersResponse> => {
    const response = await apiClient.get("/api/usuarios");
    return response.data;
}

export const createManager = async (data : CreateUserRequest) : Promise<any> => {
    const response = await apiClient.post("/api/auth/register/manager", data);
    return response.data
}

export const createCashier = async (data: CreateUserRequest) : Promise<any> => {
    const response = await apiClient.post("/api/auth/register/cashier", data);
    return response.data;
}