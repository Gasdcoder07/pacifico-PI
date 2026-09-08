import { getUserSession, loginUser } from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data : user, isLoading : loading } = useQuery({
        queryKey : ["authUser"],
        queryFn : getUserSession,
        staleTime : 1000 * 60 * 60
    });

    const loginMutation = useMutation({
        mutationFn : loginUser,
        onSuccess : (data) => {
            const { session, usuario } = data;

            localStorage.setItem("token", session.access_token);
            localStorage.setItem("userId", String(usuario.id));

            if (session.refresh_token) {
                localStorage.setItem("refreshToken", session.refresh_token);
            }

            queryClient.setQueryData(["authUser"], usuario);
            router.push("/pos");
        }
    });

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");

        queryClient.setQueryData(["authUser"], null);
        router.push("/login");
    };

    return {
        user,
        loading,
        login : loginMutation.mutate,
        isLoggingIn : loginMutation.isPending,
        logout,
    };
}