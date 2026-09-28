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