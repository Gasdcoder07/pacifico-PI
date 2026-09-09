"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Page = () => {

    const { user, loading, logout } = useAuth()

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <section>
            Page
        </section>
    );
};

export default Page;
