//tiene al usuario mediante /api/auth/me usando la cookie.
//Ya no guarda tokens en localStorage
import { getUserSession, loginUser } from '@/services/auth.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
export const useAuth = () => {
    const cache = useQueryClient();
    const router = useRouter();
    const { data: user, isLoading: loading } = useQuery({ 
        queryKey: ['authUser'], queryFn: getUserSession, staleTime: 30000, retry: false });
    const mutation = useMutation({ mutationFn: loginUser, onSuccess: ({ usuario }) => {
        localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); 
        localStorage.removeItem('userId');
        cache.clear(); cache.setQueryData(['authUser'], usuario);
        router.push(usuario.rol_id === 3 ? '/sales' : '/usuarios'); router.refresh();
    } });
    const logout = async () => {
        await apiClient.post('/api/auth/logout');
        cache.clear(); router.push('/login'); router.refresh();
    };
    return { user, loading, login: mutation.mutate, isLoggingIn: mutation.isPending, loginError: mutation.error, logout };
};
