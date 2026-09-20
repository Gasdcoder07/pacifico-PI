"use client";

import InventoryTable from "@/features/inventory/components/InventoryTable";
import ProductSearch from "@/features/sell/components/ProductSearch";

interface Product {
    id: string;
    code: string;
    name: string;
    category: string;
    stock: number;
    price: number;
}

const PRODUCTS: Product[] = [
    {
        id: "1",
        code: "PRD-1001",
        name: "Laptop Pro 15'' M2",
        category: "Electrónica",
        stock: 24,
        price: 1299.99,
    },
    {
        id: "2",
        code: "PRD-1002",
        name: "Teclado Mecánico Wireless",
        category: "Periféricos",
        stock: 8,
        price: 89.5,
    },
    {
        id: "3",
        code: "PRD-1003",
        name: "Mouse Ergonómico Óptico",
        category: "Periféricos",
        stock: 45,
        price: 35.0,
    },
    {
        id: "4",
        code: "PRD-1004",
        name: "Monitor 27'' UHD 4K",
        category: "Pantallas",
        stock: 3,
        price: 349.99,
    },
    {
        id: "5",
        code: "PRD-1005",
        name: "Audífonos Noise Cancelling",
        category: "Audio",
        stock: 12,
        price: 199.0,
    },
    {
        id: "6",
        code: "PRD-1006",
        name: "Silla Ergonómica Ejecutiva",
        category: "Mobiliario",
        stock: 0,
        price: 250.0,
    },
    {
        id: "7",
        code: "PRD-1007",
        name: "Cámara Web Full HD 1080p",
        category: "Video",
        stock: 19,
        price: 59.99,
    },
    {
        id: "8",
        code: "PRD-1008",
        name: "Hub USB-C 7 en 1",
        category: "Accesorios",
        stock: 60,
        price: 42.5,
    },
    {
        id: "9",
        code: "PRD-1009",
        name: "Disco Duro Externo 2TB",
        category: "Almacenamiento",
        stock: 5,
        price: 79.99,
    },
    {
        id: "10",
        code: "PRD-1010",
        name: "Micrófono Condensador USB",
        category: "Audio",
        stock: 14,
        price: 110.0,
    },
    {
        id: "11",
        code: "PRD-1001",
        name: "Laptop Pro 15'' M2",
        category: "Electrónica",
        stock: 24,
        price: 1299.99,
    },
];

const Page = () => {
    return (
        <section className="flex flex-col h-full min-h-0 overflow-hidden p-4 gap-4">
            <ProductSearch/>

            <div className="flex min-h-0 min-w-0 flex-1">
                <InventoryTable
                    PRODUCTS={PRODUCTS}/>
            </div>
        </section>
    );
};

export default Page;
