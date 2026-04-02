import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@ekene/trpc';

export const trpc = createTRPCReact<AppRouter>();
