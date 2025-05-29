// import { createClient } from '@supabase/supabase-js';
// import { cookies } from "next/headers"


// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const getCookieStore = () => cookies();
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//     auth: {
//         flowType: 'pkce',
//         autoRefreshToken: true,
//         persistSession: true,
//         detectSessionInUrl: true,
//         storage: {
//             getItem: async (key) => {
//                 const cookieStore = await getCookieStore();
//                 return cookieStore.get(key)?.value || null;
//             },
//             setItem: async (key, value) => {
//                 const cookieStore = await getCookieStore();
//                 cookieStore.set(key, value);
//             },
//             removeItem: async (key) => {
//                 const cookieStore = await getCookieStore();
//                 cookieStore.delete(key);
//             }
//         }
//     }
// })


import { createClient } from '@supabase/supabase-js'

export const createBrowserClient = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: 'pkce',
                persistSession: true,
                storage: {
                    getItem: (key: string): string | null => {
                        const cookie = document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`);
                        return cookie ? cookie.pop() || null : null;
                    },
                    setItem: (key: string, value: string): void => {
                        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
                        document.cookie = `${key}=${value}; path=/; domain=${window.location.hostname}; expires=${expirationDate}; ${process.env.NODE_ENV === 'production' ? 'secure; SameSite=None' : 'SameSite=Lax'}`;
                    },
                    removeItem: (key: string): void => {
                        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                    }
                }
            }
        }
    )

