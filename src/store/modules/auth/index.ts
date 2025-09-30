import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { fetchLogin } from '@/service/api';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    userName: '',
    roles: [],
    buttons: []
  });
  const menuRootMap = ref({});

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));
  function setMenuRootMap(menuList:any) {
    // menuList是菜单列表，如果menuList的子元素有三级，则第三级是按钮的权限
    // 基于二级children存放相应的三级children
    const menuRoot = {};
    
    menuList.forEach(item => {
      if (item.children && Array.isArray(item.children)) {
        item.children.forEach(child => {
          if (child.children && Array.isArray(child.children)) {
            // 为每个二级菜单存储其对应的三级菜单（按钮权限）
            menuRoot[child.url] = child.children.map(c => c.url || '');
          } else {
            // 如果二级菜单没有三级子菜单，则设为空数组
            menuRoot[child.url] = [];
          }
        });
      }
    });
    
    menuRootMap.value = menuRoot;
  }
  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();
    // if (!route.meta.constant) {
    //   await toLogin();
    // }
    toLogin();
    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();
    try {
      const data = await fetchLogin({ username: userName, password });

      const pass = await loginByToken(data);

      if (pass) {
        await routeStore.initAuthRoute();

        await redirectFromLogin(redirect);

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName }),
            duration: 4500
          });
        }
      }
    } catch (error) {
      console.log(error);
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.token);
    localStg.set('ws_token', loginToken.ws_token);

    // 2. get user info
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.token;

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    return true;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo,
    setMenuRootMap,
    menuRootMap
  };
});
