// page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flex, Radio } from "@radix-ui/themes";
import { createClient } from "@/utils/supabase/client"; // Adjust path based on your project structure
import { useRouter } from "next/navigation";

const CATEGORIES = [
    { value: "CSS", label: "CSS" },
    { value: "Next.js", label: "Next.js" },
    { value: "Web 开发", label: "Web 开发" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
];

export default function CreateNewBlog() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [visibility, setVisibility] = useState<"private" | "public">("private");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleCategoryChange = (category: string) => {
        if (categories.includes(category)) {
            setCategories(categories.filter((c) => c !== category));
        } else {
            setCategories([...categories, category]);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!title.trim()) newErrors.title = "标题是必填项";
        if (!description.trim()) newErrors.description = "内容是必填项";
        if (categories.length === 0) newErrors.categories = "至少选择一个分类";
        if (!visibility) newErrors.visibility = "请选择可见性";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const supabase = createClient();

        const { data, error } = await supabase.from("articles").insert([
            {
                title,
                summary,
                description,
                category: categories,
                visibility,
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            alert("提交失败，请重试");
            console.error(error);
        } else {
            alert("文章已提交");
            router.push("/"); // Redirect after successful submission
        }
    };

    return (
        <div className="w-full max-w-4xl min-w-lg mx-auto p-7 bg-white rounded-lg shadow-xl border">
            <div className="form-container space-y-4">
                <h2 className="text-2xl font-bold mb-4">创建新文章</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">标题</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="输入文章标题"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    {/* Excerpt */}
                    <div>
                        <Label htmlFor="summary">摘要（可选）</Label>
                        <textarea
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="输入文章摘要..."
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <Label>内容</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[200px] w-full p-2 border rounded"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description}</p>
                        )}
                    </div>

                    {/* Categories */}
                    <div>
                        <Label>分类</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {CATEGORIES.map((category) => (
                                <label key={category.value} className="flex items-center space-x-2 w-1/3">
                                    <input
                                        type="checkbox"
                                        value={category.value}
                                        onChange={() => handleCategoryChange(category.value)}
                                        checked={categories.includes(category.value)}
                                    />
                                    <span>{category.label}</span>
                                </label>
                            ))}
                        </div>
                        <label className="flex items-center space-x-2 w-1/3 mt-2">
                            <input
                                type="checkbox"
                                value="立即发布"
                                onChange={() => handleCategoryChange("立即发布")}
                                checked={categories.includes("立即发布")}
                            />
                            <span>立即发布</span>
                        </label>
                        {errors.categories && (
                            <p className="text-red-500 text-sm">{errors.categories}</p>
                        )}
                    </div>

                    {/* Visibility */}
                    <div>
                        <Label>可见性</Label>
                        <div className="mt-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="private"
                                    checked={visibility === "private"}
                                    onChange={() => setVisibility("private")}
                                />
                                <span>私有 - 仅登录用户可见</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={visibility === "public"}
                                    onChange={() => setVisibility("public")}
                                />
                                <span>公开 - 所有人可见</span>
                            </label>
                        </div>
                        {errors.visibility && (
                            <p className="text-red-500 text-sm">{errors.visibility}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="button-group flex justify-between">
                        <Link href={"/"}>
                            <Button variant="outline" type="button">
                                取消
                            </Button>
                        </Link>

                        <Button type="submit">
                            {categories.includes("立即发布") ? "发布文章" : "保存为草稿"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}