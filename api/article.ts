import type { ApiBaseResponse, ArticlesParams } from '@/types/ApiTypes';
import { Article, PageResponse } from '@/types/ApiTypes';
import { api } from '@/utils/apiClients';

export async function myArticles(params?: ArticlesParams) {
  const res = await api.get<ApiBaseResponse<PageResponse<Article>>>(
    '/api/articles/my-articles',
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 6,
        sort: params?.sort ?? 'createdAt,DESC',
      },
    },
  );

  if (!res?.data?.data) {
    throw new Error('Invalid response');  // 반환이 없으면 예외로 처리
  }
  console.log(res.data.data);
  return res.data.data;
}
