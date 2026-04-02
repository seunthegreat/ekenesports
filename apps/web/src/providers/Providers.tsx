'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { authClient } from '@ekene/auth';
import { TrpcProvider } from './trpc-provider';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { setSession } = useAuthStore();

  useEffect(() => {
    const syncSession = async () => {
      const { data } = await authClient.getSession();
      setSession(data);
    };
    syncSession();
  }, [setSession]);

  return (
    <TrpcProvider>
      {children}
    </TrpcProvider>
  );
}


