import { watch } from 'vue';
import { useAppStore } from '@/store/modules/app';

/**
 * 页面刷新通知 Hook
 * 用于监听来自 App.vue 的页面刷新通知
 *
 * @param routeName 当前页面的路由名称
 * @param refreshCallback 刷新回调函数
 */
export function usePageRefresh(routeName: string, refreshCallback: () => void) {
  const appStore = useAppStore();

  // 监听页面刷新触发
  watch(
    () => appStore.pageRefreshTrigger,
    newPath => {
      console.log('newPath', newPath);
      console.log('routeName', routeName);
      if (newPath === routeName) {
        console.log(`页面 ${routeName} 收到刷新通知`);
        refreshCallback();
      }
    },
    { immediate: false }
  );

  return {
    // 可以返回一些有用的方法
    triggerRefresh: () => appStore.triggerPageRefresh(routeName)
  };
}
