// "use client"
import Hero from "@/components/hero";
import MYBlog from "@/components/my-blog";
import ArticleList from "@/components/article-list";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Box, Card, Flex, Text, Heading } from "@radix-ui/themes";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Article } from "@lib/types/index";


export default async function Home() {
    // const [articles, setArticles] = useState<Article[]>([]);
    // const supabase = createClient();

    // useEffect(() => {
    //     async function fetchArticles() {
    //         const { data, error } = await supabase
    //             .from("articles")
    //             .select("*")
    //             .order("created_at", { ascending: false });
    //         if (error) {
    //             console.log(error)
    //             console.error("Error fetching articles:", error);
    //         } else {
    //             console.log(data)
    //             setArticles(data);
    //         }
    //     }
    //     fetchArticles();
    // }, [])

    const supabase = createClient();
    const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching articles:", error);

    }

    return (
        <div className="flex flex-col gap-6 px-4">
            <div className="flex align-center justify-center w-full h-full ">
                <MYBlog />
            </div>
            <div className="w-full px-4">
                <div className="max-w-screen-xl mx-auto">
                    <h3 className="text-2xl font-bold text-left mb-6">最新文章</h3>
                    <ArticleList articles={data ?? []} />
                </div>
            </div>
        </div>

    );
}

// export async function getStaticProps() {  // 不能在app  目录下使用 getStaticProps
//     const supabase = createClient();
//     const { data, error } = await supabase
//         .from("articles")
//         .select("*")
//         .order("created_at", { ascending: false });
//     if (error) {
//         console.error("Error fetching articles:", error);
//         return {
//             props: {
//                 articles: [],
//             },
//         };
//     }
//     return {
//         props: {
//             articles: data,
//         },
//     };
// }
