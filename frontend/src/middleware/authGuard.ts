import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '../store/hooks';
import { getAuthSession } from '../utils/authStorage';

const unauthenticatedPaths = ['/signin', '/signup'];

export const useAuthGuard = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const session = typeof window !== 'undefined' ? getAuthSession() : null;
        const hasToken = !!accessToken || !!session?.accessToken;

        // If no token and trying to access a protected route (anything other than signin/signup)
        if (!hasToken && !unauthenticatedPaths.includes(pathname)) {
            router.replace('/signin');
            return;
        }

        // If token exists and trying to access signin/signup
        if (hasToken && unauthenticatedPaths.includes(pathname)) {
            router.replace('/'); // The dashboard is at '/'
        }
    }, [accessToken, isAuthenticated, pathname, router]);
};
