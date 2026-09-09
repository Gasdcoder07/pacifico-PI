"use client";

import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/axios";

const Page = () => {

    const { user, loading, logout } = useAuth()

    const fetch = async () => {
        const respones = await apiClient.get(`http://localhost:3000/api/usuarios/${user.id}`)

        console.log(respones.data)
    }

    return (
        <>
            <button 
                className="w-64 h-32 bg-zinc-700 m-20 rounded-4xl"
                onClick={() => fetch()}
            />
        </>
    )
};

export default Page;
