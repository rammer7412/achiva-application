import type { ApiBaseResponse, CheeringCategoryStat, CreateCheeringPayload } from '@/types/ApiTypes';
import type { Cheering } from '@/types/Response';
import { api } from '@/utils/apiClients';

export async function getReceivingCategoryStats(
  memberId: number,
  signal?: AbortSignal
): Promise<CheeringCategoryStat[]> {
  const res = await api.get<ApiBaseResponse<CheeringCategoryStat[]>>(
    `/api/members/${memberId}/cheerings/receiving-category-stats`,
    { signal }
  );
  if (!res?.data?.data) throw new Error('Invalid response');
  return res.data.data;
}

export async function getSendingCategoryStats(memberId: number, signal?: AbortSignal) {
  const res = await api.get<ApiBaseResponse<CheeringCategoryStat[]>>(
    `/api/members/${memberId}/cheerings/sending-category-stats`,
    { signal }
  );
  if (!res?.data?.data) throw new Error('Invalid response');
  return res.data.data;
}

export async function createCheering(
  articleId: number,
  body: CreateCheeringPayload,
  signal?: AbortSignal
): Promise<Cheering> {
  const url = `/api/articles/${encodeURIComponent(String(articleId))}/cheerings`;

  const res = await api.post<ApiBaseResponse<Cheering>>(
    url,                       // /api/articles/{postId}/cheerings
    body,                      // { content: cheeringType, cheeringCategory: cheeringType }
    {
      signal,
      params: { articleId },   // ?articleId={postId}  ← fetch와 동일하게 쿼리도 붙임
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      validateStatus: () => true,
    }
  );

  if (!res?.data?.data) {
    const serverMsg = (res.data as any)?.message || (res.data as any)?.error;
    throw new Error(serverMsg ? `HTTP_${res.status}: ${serverMsg}` : `HTTP_${res.status}`);
  }
  return res.data.data;
}

export async function deleteCheering(
  articleId: number,
  cheeringId: number,
  signal?: AbortSignal
): Promise<void> {
  const url = `/api/articles/${encodeURIComponent(String(articleId))}/cheerings/${encodeURIComponent(String(cheeringId))}`;
  const res = await api.delete<ApiBaseResponse<unknown>>(url, {
    signal,
    // 서버가 쿼리 파라미터를 요구할 수 있으므로 같이 붙여줌(POST 때와 동일 스타일)
    params: { articleId, cheeringId },
    validateStatus: () => true,
  });

  if (res.status < 200 || res.status >= 300) {
    const msg = (res.data as any)?.message || (res.data as any)?.error;
    throw new Error(msg ? `HTTP_${res.status}: ${msg}` : `HTTP_${res.status}`);
  }
}
