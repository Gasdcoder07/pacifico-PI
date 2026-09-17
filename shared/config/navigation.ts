import { BadgeDollarSign, LayoutDashboard, Monitor, Settings, ShelvingUnit } from "lucide-react"

export type SidebarItem = {
    id : string,
    href : string,
    icon : any
}

export const sidebarNavigation : SidebarItem[] = [
    {
        id : "Pos",
        href : "/pos",
        icon : Monitor
    },
    {
        id : "Sales",
        href : "/sales",
        icon : BadgeDollarSign
    },
    {
        id : "Inventory",
        href : "/inventory",
        icon : ShelvingUnit
    },
    {
        id : "Dashboard",
        href : "/dashboard",
        icon : LayoutDashboard
    },
    {
        id : "Settings",
        href : "/settings",
        icon : Settings
    }
]