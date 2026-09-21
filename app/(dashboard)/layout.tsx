import Navbar from "@/shared/components/Navbar";
import SidebarWrapper from "@/shared/components/SidebarWrapper";
import React from "react";

export default function DashLayout({ children } : { children : React.ReactNode; }) {

    return (
        <main className="h-screen font-Inter antialiased flex flex-col">
            <Navbar/>

            <section className="min-w-0 flex-1 w-full flex overflow-hidden">
                <SidebarWrapper/>

                <div className="bg-[#F4F7F9] w-full">
                    {children}
                </div>
            </section>
        </main>
    );
}