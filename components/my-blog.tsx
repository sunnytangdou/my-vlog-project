
import Link from "next/link";
import { Button } from "./ui/button";
import { Search, Menu, Heading } from "lucide-react"
import { Input } from "./ui/input";

export default function MYBlog() {
  return (
    <div className="flex flex-col items-center gap-5 max-w-5xl p-5">
      <h1 className="text-4xl font-bold">我的博客</h1>
      <h4 className="text-2xl">分享关于 Web 开发、设计和技术的见解和教程</h4>
      <Link href={"/blog/create"}>
        <Button color="gray" variant="default" >
        创建新文章
		</Button>
      </Link>

</div>
  );
}