import { ShoppingCart, LayoutDashboard, Settings, ShelvingUnit, Store, LucideIcon, UsersRound } from "lucide-react"

export type SidebarItem = {
    id : string,
    label: string;
    href : string,
    icon : LucideIcon
}

interface SidebarSection {
    title: string;
    items: SidebarItem[];
}

export const sidebarSections: SidebarSection[] = [
    {
        title: "Sucursal",
        items: [
            { id: "Sell", label: "Ventas", href: "/sell", icon: ShoppingCart },
            { id: "Dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { id: "Inventory", label: "Inventario", href: "/inventory", icon: ShelvingUnit },
        ],
    },
    {
        title: "Administración",
        items: [
            { id: "Branches", label: "Sucursales", href: "/branches", icon: Store },
            { id: "Users", label: "Usuarios", href: "/users", icon: UsersRound },
            { id: "Settings", label: "Ajustes", href: "/settings", icon: Settings },
        ],
    },
];