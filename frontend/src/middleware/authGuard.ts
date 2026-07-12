import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '../store/hooks';

const unauthenticatedPaths = ['/signin', '/signup'];
const protectedPaths = ['/', '/dashboard', '/organization', '/assets', '/transfers', '/bookings', '/maintenance', '/reports', '/notifications'];

export const useAuthGuard = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const hasToken = !!accessToken;

        if (!hasToken && protectedPaths.some((path) => pathname.startsWith(path))) {
            router.replace('/signin');
            return;
        }

        if (hasToken && unauthenticatedPaths.includes(pathname)) {
            router.replace('/');
        }
    }, [accessToken, isAuthenticated, pathname, router]);
};
