import { LayoutDashboard, ShelvingUnit, ShoppingCart } from "lucide-react"

export type SidebarItem = {
    id : string,
    href : string,
    icon : any
}

export const sidebarNavigation : SidebarItem[] = [
    {
        id : "Sell",
        href : "/sell",
        icon : ShoppingCart
    },
    {
        id : "Dashboard",
        href : "/dashboard",
        icon : LayoutDashboard
    },
    {
        id : "Inventory",
        href : "/inventory",
        icon : ShelvingUnit
    }
];