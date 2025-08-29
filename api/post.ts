import type { ApiBaseResponse, Article, PostedArticle } from '@/types/ApiTypes';
import { httpPost } from "@/utils/http";

export type CreateArticleRequest = PostedArticle & {
  backgroundColor?: string;
};

export async function createArticle(
  body: CreateArticleRequest,
): Promise<Article> {
  const payload: CreateArticleRequest = {
    ...body,
    photoUrl: body.photoUrl?.trim() ?? '',
    title: body.title.trim(),
    category: body.category.trim(),
    question: body.question.map((q) => ({
      question: q.question?.trim() ?? '',
      content: q.content?.trim() ?? '',
    })),
  };

  const res = await httpPost<ApiBaseResponse<Article>>('/api/articles', payload);

  if (!res?.data?.data) throw new Error('Invalid response');
  return res.data.data;
}