'use client';

import { useEffect } from 'react';
import api from '@/lib/api';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export const TokenValidator = () => {
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token');
      
      // Don't check if we're already on the sign-in page or if there's no token
      if (pathname.includes('/sign-in') || !token) {
        return;
      }

      try {
        await api.get('/auth/verify');
      } catch (error) {
        // Interceptor handles 401, so we don't need to do much here
        console.error('Token verification failed:', error);
      }
    };

    checkToken();

    // Optionally set up an interval to check token validity periodically (e.g., every 5 minutes)
    const interval = setInterval(checkToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
};
