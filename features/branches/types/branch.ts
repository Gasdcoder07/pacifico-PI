import { User } from "@/features/users/types/user";

export type BranchId = number | undefined;

export interface Branch {
    id: number;
    name: string;
    direction: string;
    phone: string;
    contact_info: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    admin_id: string;
    company_id: string;
    foto_url: string;
    usuarios: User[];
    gerente: User | null;
    gerentes: User[]
}

export interface BranchResponse {
    message: string;
    data: Branch
}

export interface DeleteBranchResponse {
    message: string;
}