import type { ApiBaseResponse, CheeringCategoryStat } from '@/types/ApiTypes';
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
  console.log(res.data.data);
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
