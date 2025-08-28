import { getMe } from '@/api/users';
import { useAuthStore } from '@/stores/useAuthStore';

export async function refreshUser() {
  const me = await getMe();
  const user = (me as any)?.data ?? me;
  useAuthStore.getState().setUser(user);
}
