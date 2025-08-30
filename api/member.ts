import type { Member } from '@/types/ApiTypes';
import { httpGet } from '@/utils/http';

/** 특정 멤버의 프로필 조회 */
export async function fetchMemberProfile(memberId: number): Promise<Member> {
  const res = await httpGet<Member>(`/api/members/${memberId}`);

  if (!res?.data) {
    throw new Error('Invalid response');
  }
  return res.data;
}
