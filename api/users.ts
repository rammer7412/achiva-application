import type { User } from '@/types/User';
import { httpGet } from '@/utils/http';

export async function getMe() {
  return await httpGet<User>('/api/users/me');
}
