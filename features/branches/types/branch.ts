
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
}

export interface BranchResponse {
    message: string;
    data: Branch
}

export interface DeleteBranchResponse {
    message: string;
}