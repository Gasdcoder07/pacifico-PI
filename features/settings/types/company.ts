export interface Company {
    id: string | number;
    name: string;
    description: string;
    address: string;
    status: boolean;
    foto_url: string;
}

export interface CompanyRequest {
    name: string;
    description?: string;
    address: string;
    foto_url?: string;
}

export interface CompanyResponse {
    message: string;
    data: Company;
}