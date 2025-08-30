import type { Member } from '@/types/ApiTypes';
import { httpGet } from '@/utils/http';

export async function fetchMemberProfile(memberId: number): Promise<Member> {
  const res = await httpGet<Member>(`/api/members/${memberId}`);

  if (!res?.data) {
    throw new Error('Invalid response');
  }
  return res.data;
}
