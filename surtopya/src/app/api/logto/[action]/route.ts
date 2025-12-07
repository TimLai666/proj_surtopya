import { handleAuthRoutes } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

export const GET = handleAuthRoutes(logtoConfig);
