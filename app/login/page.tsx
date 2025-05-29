// app/login/page.tsx
"use client";
import { useState } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createBrowserClient } from "@lib/supabaseClient";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
// import Alert from "./../../components/Alert";
// import { useAlert } from "@/hooks/useAlert";

import Link from "next/link";

export default function LoginPage() {
  // const supabase = createClientComponentClient();
  // const { showAlert } = useAlert();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push("/")
    } else {
      console.error("Login error:", error);
      alert("登录失败，请检查邮箱和密码是否正确");
    }
  }

  async function handleOAuthLogin(provider: "google" | "github") {
    const supabase = createBrowserClient();
    const { data } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}` },
    });

    if (data.url) {
      // router.push(data.url)
      window.location.href = data.url;
    }
  }

  async function handleForgotPassword() {
    const email = prompt("请输入您的注册邮箱：");

    if (!email || !email.includes("@")) {
      alert("请输入有效的邮箱地址");
      return;
    }
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`, // Redirect URL after password reset
    });

    if (error) {
      console.error("Password reset error:", error);
      alert("密码重置失败，请稍后再试");
    } else {
      alert("密码重置邮件已发送，请检查您的邮箱");
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">登录</h5>
        <p className="mb-6 text-sm font-light text-gray-500 dark:text-gray-400">
          登录您的账户以管理您的博客
        </p>

        <button
          type="button"
          className="block w-full p-4 mb-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          onClick={() => handleOAuthLogin("github")}
        >
          <svg
            className="mr-2 w-5 h-5 text-gray-800 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .6a9.3 9.3 0 0 0-3 8.14A8.2 8.2 0 0 1 .6 8.1C.6 4.2.8 1.4 3.3.8a8.5 8.5 0 0 1 14 0c2.5.6 2.7 3.4 2.7 7.3 0 4.4-2.6 7.8-6 8.6A9.7 9.7 0 0 0 10 .6ZM9.8 8.2a.8.8 0 0 0-.4-.1V6H6.6a.9.9 0 1 0 0-1.8h2.8V6.1a.8.8 0 0 0 .4-.1c.3-.2 1-.3 1.4-.3.4 0 .6.1.6.3v2.1a.8.8 0 0 0 .4.1Z" />
          </svg>
          使用 GitHub 登录（需要获取邮箱权限）
        </button>

        <div className="relative pt-6 before:absolute before:left-0 before:top-5 before:right-0 before:block before:h-px before:mx-4 before:bg-gray-200 before:dark:bg-gray-700">
          <span className="absolute left-1/2 transform -translate-x-1/2 px-3 text-xs text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-900">
            或使用邮箱登录
          </span>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              电子邮件
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              密码
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              {/* Placeholder for future features like remember me */}
            </div>
            <div className="ml-3 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:underline dark:text-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
              >
                忘记密码?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            登录
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            还没有账户?{" "}
            <Link href="/register" className="text-gray-700 hover:underline dark:text-gray-500">
              注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}