export interface Article {
    id: number;
    title: string;
    summary: string;
    description: string;
    author: string;
    created_at: string;
    category?: string;
}