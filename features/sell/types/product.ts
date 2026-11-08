export interface Product {
    inventario_id: number;
    product_id: number;
    name: string;
    description: string;
    foto_url: string;
    quantity: number;
    min_stock: number;
    price: number;
    branch_id: string;
    branch_name: string;
    category_id: string;
    category_name: string;
    sucursales: ProductBranch[];
}

export interface ProductBranch {
    quantity: number;
    min_stock?: number | null;
    branch_id: string;
    branch_name: string;
    inventario_id: string;
}

export interface BranchProducts {
    branch_id: number;
    productos: Product[];
}

export interface EditProductPayload {
    product_id: string | number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    foto_url?: string;
    branches: EditProductBranchPayload[];
}

export interface EditProductBranchPayload {
    branch_id: string;
    quantity: number;
    min_stock?: number
}

export interface EditProductResponse {
    success: string;
}

export interface DeleteProductResponse {
    success: string;
    product_id: number;
}

export interface DeleteProductPayload {
    product_id: string;
    branch_ids: string[];
}