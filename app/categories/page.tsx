// categories/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Article } from "@lib/types/index";
import Link from "next/link";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();

            // 调用自定义 RPC 函数获取分类及其详细数据
            const { data, error } = await supabase.rpc("get_categories_with_details");

            if (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            } else {
                if (data) {
                    // 根据 category 字段进行去重
                    const uniqueCategories = data.filter(
                        (category: Article, index: number, self: any[]) =>
                            index === self.findIndex((c) => c.category === category.category)
                    );
                    // 过滤掉 category 为 "立即发布" 的项
                    const filteredCategories = uniqueCategories.filter(
                        (category: any) => category.category !== "立即发布"
                    );

                    // 提取每个 category 对应的 articles 数组的第一项，并保留 category 字段
                    const firstArticles = filteredCategories
                        .filter((category: any) => category.articles.length > 0)
                        .map((category: any) => ({
                            ...category.articles[0], // 展开第一个文章的所有字段
                            category: category.category, // 添加对应的 category 字段
                        }));
                    setCategories(firstArticles);
                    console.log(firstArticles);

                }
            }

            setLoading(false);
        }

        fetchCategories();
    }, []);

    if (loading) {
        return <p className="text-center p-6">加载中...</p>;
    }

    return (
        <div className="w-full max-w-7xl min-w-lg mx-auto">
            <div className="p-6 max-w-7xl w-7xl">
                <div className="flex justify-between mb-6 w-full">
                    <h1 className="text-2xl font-bold">分类</h1>
                    <div>
                        <button className="bg-gray-800 text-white px-4 py-2 rounded">管理分类</button>
                    </div>
                </div>

                {categories.length === 0 ? (
                    <p className="text-center text-gray-500">暂无分类数据</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {categories.map((article) => (

                            <Link href={`/categories/${article.category}`} key={article.id} className="hover:border-black hover:border-2 transition duration-300">
                                <div
                                    className="bg-white border rounded p-6 shadow h-38 flex flex-col justify-between"
                                >
                                    <h2 className="text-xl font-semibold">{article.title}</h2>
                                    <p className="text-gray-600 mt-5 flex-1">{article.summary}</p>
                                    <p>{article.category}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}