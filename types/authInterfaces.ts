// Hola xdxdxd este es un easter egg para quien quiera verlo, yo soy greco :V
// Viva 2017 xdxdxdxd, SIUUUUUUU

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserProfile {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol_id: number;
    sucursal_id: number;
    estado: boolean;
}

export interface LoginResponse {
    session: {
        access_token: string;
        refresh_token?: string;
    };
    usuario: UserProfile;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    rol_id: number;
    branch_id: number;
}