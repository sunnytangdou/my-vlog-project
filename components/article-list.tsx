import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Button } from "./ui/button";
import Link from "next/link";
import { Article } from "@lib/types/index";
import { useRouter } from "next/navigation";



// Update component to accept articles prop
export default function ArticleList({ articles }: { articles: Article[] }) {
    const router = useRouter();
    const gotoMore = (url: string) => {
        router.push(url)
    }
    return (

        <div className="flex flex-wrap gap-6 justify-start">
            {articles && articles.length > 0 && (
                articles.map((article) => (
                    <Box
                        key={article.id}
                        className="border p-4 rounded-md h-72 w-full sm:w-[calc(50%-12px)] md:w-[30%] min-w-xs"
                    >
                        <Card className="h-full flex flex-col justify-between">
                            <Box>
                                <Text as="div" size="2" weight="bold" className="pb-5">
                                    {new Date(article.created_at).toLocaleDateString()} ·{" "}
                                    {article.author || "未知作者"}
                                </Text>
                                <Link href={`/blog/${article.id}`} className="font-bold block pb-2">
                                    {article.title}
                                </Link>
                                <Text as="div" size="2" color="gray" className="h-24 pt-7 overflow-hidden">
                                    {article.description}
                                </Text>
                            </Box>
                            <Box className="mt-auto pt-4">
                                <div onClick={() => gotoMore(`/blog/${article.id}`)}>
                                    <Button color="gray" variant="outline" className="w-full">
                                        阅读全文
                                    </Button>
                                </div>
                            </Box>
                        </Card>
                    </Box>
                ))
            )}
        </div>

    );
}