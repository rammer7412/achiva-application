import type { Article, CreateArticleRequest } from '@/types/ApiTypes';
import { httpPost } from '@/utils/http';

export async function createArticle(body: CreateArticleRequest): Promise<Article> {
  const payload: CreateArticleRequest = {
    ...body,
    photoUrl: body.photoUrl?.trim() ?? '',
    title: body.title.trim(),
    category: body.category.trim(),
    question: body.question.map(q => ({
      question: q.question?.trim() ?? '',
      content : q.content?.trim() ?? '',
    })),
    backgroundColor: body.backgroundColor?.trim() ?? '#f9f9f9',
  };

  const res = await httpPost<Article>('/api/articles', payload);
  if (!res?.data) {
    throw new Error('Invalid response');
  }
  return res.data;
}
