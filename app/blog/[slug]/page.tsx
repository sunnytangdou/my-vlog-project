"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Article } from "@lib/types/index";




type BlogPostPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const supabase = createClient();

    const resolvedParams = React.use(params); // ✅ 使用 React.use 解包 Promise
    const { slug } = resolvedParams;
    const [comment, setComment] = useState("");

    // const [user, setUser] = useState<any>(null);

    const [comments, setComments] = useState<string[]>([]);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<any>(null); // 用于存储用户会话

    const router = useRouter();

    // 检测是否登录
    useEffect(() => {
        async function fetchUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setSession(user);
            console.log('blog', user, session);
        }

        fetchUser();

        // 订阅 auth 状态变化
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session?.user);
            console.log("Auth state changed:", session?.user);
        });

        return () => {
            subscription.unsubscribe(); // 清理副作用
        };
    }, [supabase]);



    useEffect(() => {
        async function fetchArticle() {
            if (!slug) return;

            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .eq("id", slug)
                .single();

            if (error) {
                console.error("Error fetching article:", error);
                setError("文章不存在或无法加载");
                setLoading(false);
                return;
            }

            setPost(data);
            setLoading(false);
        }

        fetchArticle();
    }, [slug, supabase]);

    if (loading) {
        return <p>加载中...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!post) {
        return <p>未找到该文章</p>;
    }

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleSubmitComment = async () => {
        if (!session) {
            alert("请先登录后再发表评论");
            router.push("/login");
            return;
        }
        if (comment.trim() === "") {
            alert("评论内容不能为空");
            return;
        }
        try {
            // Create a new comment object with content and timestamp
            const newComment = {
                content: comment,
                created_at: new Date().toISOString(), // Current date and time in ISO format
            };

            // Get the current comments from the post
            const currentComments = post.comments || [];

            // Add the new comment to the current comments
            const updatedComments = [...currentComments, newComment];

            // Update the article in Supabase with the new comments
            const { data, error } = await supabase
                .from("articles")
                .update({ comments: updatedComments })
                .eq("id", post.id)
                .single();

            if (error) {
                console.error("Error updating article:", error);
                alert("评论发布失败，请稍后重试");
                return;
            }

            // Update the local state with the new comments
            setPost((prevPost: Article) => ({
                ...prevPost,
                comments: updatedComments,
            }));

            // Clear the comment input
            setComment("");
        } catch (error) {
            console.error("Error handling submit comment:", error);
            alert("评论发布失败，请稍后重试");
        }

    };

    return (
        <div className="container mx-auto p-6">
            {/* 返回首页链接 */}
            <div className="mb-4">
                <a href="/" className="text-gray-500 hover:text-blue-700">
                    ← 返回首页
                </a>
            </div>

            {/* 文章标题和内容 */}
            <div className="mb-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                <p className="text-gray-500 text-sm mb-4">
                    {post.date} · {post.author}
                </p>
                <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                <p className="text-gray-500 text-base mt-4">{post.description}</p>
            </div>
            {/* <button onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                console.log("手动获取用户:", user);
            }}>刷新用户</button> */}

            {/* 评论区 */}
            <div className="mb-8 max-w-3xl mx-auto">
                <h2 className="text-xl font-bold mb-4">评论</h2>
                <div className="border rounded p-4">
                    {/* <p>session{session}</p> */}
                    <textarea
                        placeholder={session?.email ? "请输入评论..." : "请先登录后再评论"}
                        value={comment}
                        onChange={handleCommentChange}
                        disabled={!session?.email} // 未登录禁用输入框
                        className={`w-full p-2 border rounded mb-4 ${!session?.email ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                    ></textarea>
                    <button
                        onClick={handleSubmitComment}
                        disabled={!session?.email} // 未登录禁用按钮
                        className={`px-4 py-2 rounded ${!session?.email ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 text-white"
                            }`}
                    >
                        发布评论
                    </button>
                </div>
                {post.comments.length === 0 ? (
                    <p className="text-center text-gray-500 mt-4">暂无评论，成为第一个评论的人吧！</p>
                ) : (
                    <div className="mt-4">
                        {post.comments.map((c: any, index: number) => (
                            <div key={index} className="border-t pt-2 pb-2 flex justify-between items-center">
                                <p>{c?.content}</p>
                                <p>{c?.created_at ? new Date(c?.created_at).toLocaleDateString() : ''}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}