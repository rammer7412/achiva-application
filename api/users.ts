import { UpdateProfilePayload } from '@/types/ApiTypes';
import type { User } from '@/types/User';
import { httpGet, httpPut } from '@/utils/http';

export async function getMe() {
  return await httpGet<User>('/api/members/me');
}

export async function updateMyProfile(payload: UpdateProfilePayload): Promise<void> {
  const res = await httpPut<unknown>('/api/auth', payload);
  if (res?.status === 'error') throw new Error(res?.message ?? 'Update failed');
}