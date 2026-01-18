'use client';

/**
 * Homepage Redirect
 * Redirects /homepage to root path /
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomepageRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/');
    }, [router]);

    return null;
}
