# Next.js Middleware to Proxy Migration

> **Note**: This project currently uses `middleware.ts` which Next.js 16 marks as deprecated in favor of the new `proxy.ts` convention. The middleware works correctly for now, but you may want to migrate to `proxy.ts` in the future.

## Current Setup

The app uses `middleware.ts` for:
- Refreshing Supabase auth sessions
- Protecting authenticated routes
- Redirecting unauthenticated users to sign-in

## Future Migration

When you're ready to migrate to the new `proxy.ts` convention (recommended for Next.js 16+), refer to the [Next.js Proxy documentation](https://nextjs.org/docs/messages/middleware-to-proxy).

The migration involves:
1. Renaming `middleware.ts` to `proxy.ts`
2. Updating the export format
3. Adjusting route matching if needed

## Why Wait?

The current middleware implementation:
- Works correctly with Next.js 16
- Is well-tested with Supabase SSR
- Will continue to work until a future Next.js version

You can migrate when:
- Next.js provides better documentation and examples
- Supabase updates their SSR guide for the proxy convention
- You have time to thoroughly test the migration
