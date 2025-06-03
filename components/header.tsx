"use client"
import Link from "next/link";
import { Button } from "./ui/button";
import { Search, Menu } from "lucide-react"
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Header() {
    const supabase = createClient();
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        async function fetchUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setSession(user);
            console.log('header', user, session);
        }

        fetchUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload(); // 页面刷新以更新 UI
    };
    return (
        <nav
            className="w-full flex justify-center border-b border-b-foreground/10 h-16"
        >
            <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                {/* Left Section - Title */}
                <div className="flex items-center font-semibold text-2xl">
                    <Link href={"/"}>博客系统</Link>
                </div>

                {/* Center Section - Navigation Links */}
                <div className="flex items-center gap-5 text-lg">
                    <Link href={"/"}>首页</Link>
                    <Link href={"/categories"}>分类</Link>
                    <Link href={"/about"}>关于</Link>
                </div>

                {/* Right Section - Search Box and Login Button */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="搜索文章..." className="w-[200px] pl-8" />
                    </div>
                    {session ? (
                        <div className="flex items-center gap-4 relative group">
                            <div className="flex items-center gap-2 cursor-pointer">
                                {/* <User className="h-5 w-5" /> */}
                                <span className="text-sm font-medium">{session.email}</span>
                            </div>

                            {/* 退出按钮（悬停时显示） */}
                            <button
                                onClick={handleSignOut}
                                className="ml-4 text-sm text-gray-600 hover:text-red-500"
                            >
                                退出
                            </button>
                        </div>
                    ) : (
                        <Link href={"/login"}>
                            <Button color="gray" variant="outline">
                                登录
                            </Button>
                        </Link>
                        // <Link href={"/sign-in"}>
                        //     <Button color="gray" variant="outline">
                        //         登录
                        //     </Button>
                        // </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}