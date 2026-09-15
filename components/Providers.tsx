"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export function Providers ({ children } : { children : React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions : {
            queries : {
                refetchOnWindowFocus : false
            }
        }
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        background: '#fff',
                        color: '#171717',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#0891b2', // cyan-600, para que combine con tu paleta
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </QueryClientProvider>
    )
}