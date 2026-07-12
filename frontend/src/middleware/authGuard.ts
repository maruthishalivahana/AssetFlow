import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '../store/hooks';
import { getAuthSession } from '../utils/authStorage';

const unauthenticatedPaths = ['/signin', '/signup'];
const protectedPaths = ['/dashboard', '/organization', '/assets', '/transfers', '/bookings', '/maintenance', '/reports', '/notifications'];

export const useAuthGuard = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const session = typeof window !== 'undefined' ? getAuthSession() : null;
        const hasToken = !!accessToken || !!session?.accessToken;

        if (!hasToken && protectedPaths.some((path) => pathname.startsWith(path))) {
            router.replace('/signin');
            return;
        }

        if (hasToken && unauthenticatedPaths.includes(pathname)) {
            router.replace('/dashboard');
        }
    }, [accessToken, isAuthenticated, pathname, router]);
};
