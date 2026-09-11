// Hola xdxdxd este es un easter egg para quien quiera verlo, yo soy greco :V 
//When modificas un easter egg, el futuro es hoy oiste viejo att: Nvin777
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
    sucursal_id: number | null;
    estado: boolean;
}

export interface LoginResponse {
    usuario: UserProfile;
}

export interface RegisterRequest {
    last_name: string;
    name: string;
    email: string;
    password: string;
    rol_id: number;
    branch_id: number;
}