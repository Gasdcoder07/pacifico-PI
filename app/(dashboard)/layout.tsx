import Navbar from "@/shared/components/Navbar";
import Sidebar from "@/shared/components/Sidebar";
import React from "react";

export default function DashLayout({ children } : { children : React.ReactNode; }) {

    return (
        <main className="h-screen font-Inter antialiased flex flex-col">
            <Navbar/>

            <section className="min-w-0 flex-1 w-full flex overflow-hidden">
                <Sidebar/>

                <div className="bg-[#F4F7F9] w-full overflow-scroll">
                    {children}
                </div>
            </section>
        </main>
    );
}