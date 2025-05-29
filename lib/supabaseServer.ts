
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createServerClient = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: 'pkce',
                persistSession: true,
                storage: {
                    getItem: async (key) => {
                        const cookieStore = await cookies();
                        return cookieStore.get(key)?.value || null;
                    },
                    setItem: async (key, value) => {
                        const cookieStore = await cookies();
                        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                        cookieStore.set({
                            name: key,
                            value,
                            expires: expirationDate,
                            path: '/',
                            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
                        });
                    },
                    removeItem: async (key) => {
                        const cookieStore = await cookies();
                        cookieStore.delete({
                            name: key,
                            path: '/',
                            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined
                        });
                    }
                }
            }
        }
    )
