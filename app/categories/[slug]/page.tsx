// categories/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Article } from "@lib/types/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArticleList from "@/components/article-list";

type CategoriesListPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default function CategoriesListPage({ params }: CategoriesListPageProps) {
    const resolvedParams = React.use(params); // ✅ 使用 React.use 解包 Promise
    const { slug } = resolvedParams;
    const [error, setError] = useState<string | null>(null);

    const [articles, setArticles] = useState<Article[]>([]);

    let decodedSlug: string | null = slug;
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch (e) {
        console.warn("Invalid encoded slug:", slug);
    }


    useEffect(() => {
        async function fetchArticles() {
            if (!decodedSlug) return;

            const supabase = createClient();

            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .contains("category", [decodedSlug]); // Filter by category field in DB

            if (error) {
                console.error("Error fetching articles:", error);
                setError("无法加载文章");
                return;
            }

            setArticles(data || []);
        }

        fetchArticles();
    }, [decodedSlug]);

    const capitalizeFirstLetter = (str: string): string => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // const decodedSlug = decodeURIComponent(slug); // If needed, for URL-encoded slugs
    const displayCategory = capitalizeFirstLetter(decodedSlug);

    return (
        <div className="w-full max-w-7xl min-w-lg mx-auto">
            <div className="p-6 max-w-7xl w-7xl">
                <div className="mb-4">
                    <Link href="/categories" className="text-gray-500 hover:text-blue-700">
                        ← 返回分类列表
                    </Link>
                </div>
                <div className="flex flex-col mb-6 pt-8 w-full">
                    <h1 className="text-3xl font-bold">
                        {displayCategory}
                    </h1>
                    <div className="text-base pt-3">
                        {displayCategory} 框架相关的文章和教程
                    </div>
                </div>


            </div>
            <ArticleList articles={articles} />
        </div>
    );
}