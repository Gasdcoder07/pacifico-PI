export interface User {
    id: string;
    name: string;
    last_name: string;
    email: string;
    rol_id: string;
}

export interface UsersResponse {
    message: string;
    data: User[];
}

export interface ManagerRequest {
    name: string;
    last_name: string;
    email: string;
    password: string;
    company_id: string | number;
}