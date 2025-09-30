import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
export function useAuth() {
  const authStore = useAuthStore();

  function hasAuth(codes: string | string[]) {
    if (!authStore.isLogin) {
      return false;
    }
    // 获取当前路由的信息
    const route = useRoute();
    if (typeof codes === 'string') {
      const menuItem = authStore.menuRootMap[route.name];
      return menuItem ? menuItem.includes(codes) : false;
    }

    return codes.some(code => authStore.userInfo?.buttons?.includes(code));
  }

  return {
    hasAuth
  };
}
