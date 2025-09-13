<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, ref } from 'vue';
import { useNotification } from 'naive-ui';
import { AdminLayout, LAYOUT_SCROLL_EL_ID } from '@sa/materials';
import type { LayoutMode } from '@sa/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import useSocket from '@/hooks/business/useSocket';
import GlobalHeader from '../modules/global-header/index.vue';
import GlobalSider from '../modules/global-sider/index.vue';
import GlobalTab from '../modules/global-tab/index.vue';
import GlobalContent from '../modules/global-content/index.vue';
import GlobalFooter from '../modules/global-footer/index.vue';
import ThemeDrawer from '../modules/theme-drawer/index.vue';
import { setupMixMenuContext } from '../context';

const { routerPushByKey: _routerPushByKey } = useRouterPush();

const appStore = useAppStore();
const themeStore = useThemeStore();

// 初始化 Naive UI 通知实例
const notification = useNotification();

useSocket('public:admin_event', socketHandle);
const playAudioSrc = ref<string>('');
const audioElement = ref<HTMLAudioElement | null>(null);

function getImageUrl(imageName: string, type = 'mp3') {
  return new URL(`./mp3/${imageName}.${type}`, import.meta.url).href;
}

function socketHandle(data: any) {
  const eventName = data.data.event;
  // console.log('eventName', eventName);
  if (eventName === 'admin_notify') {
    const payload = data.data.payload;
    let path = '';
    let message = '';
    let audioSrc = '';
    if (payload.module === 'new_withdraw') {
      // 新的待审核提现订单
      message = '新的待审核提现订单';
      path = 'money_spot-withdraw';
      audioSrc = getImageUrl('withdraw');
    } else if (payload.module === 'new_deposit') {
      // 新的待审核提现订单
      message = '新的待审核充值订单';
      path = 'money_despoit';
      audioSrc = getImageUrl('deposit');
    } else if (payload.module === 'new_futures_order') {
      message = '新的合约订单';
      path = 'order_futures';
    } else if (payload.module === 'new_spot_order') {
      message = '新的现货订单';
      path = 'order_spot';
    } else if (payload.module === 'new_stock_withdraw') {
      message = '新的股票提现订单';
      path = 'money_stock-withdraw';
      audioSrc = getImageUrl('withdraw');
    } else if (payload.module === 'new_stock_deposit') {
      message = '新的股票充值订单';
      path = 'money_stock-despoit';
      audioSrc = getImageUrl('deposit');
    }
    // 使用 appStore 来通知页面刷新
    appStore.triggerPageRefresh(path);

    // 显示 Naive UI 通知
    notification.warning({
      title: '系统通知',
      content: message,
      duration: 5000,
      keepAliveOnHover: true,
      onAfterEnter: () => {
        // console.log('通知已显示');
      }
    });

    playAudioSrc.value = audioSrc;
    if (audioElement.value) {
      audioElement.value.load(); // 重新加载
    }
    playAudio();
  }
}

// 尝试自动播放音频
function playAudio() {
  nextTick(() => {
    if (audioElement.value) {
      audioElement.value.play().catch((_error: any) => {
        // console.log('自动播放被拒绝：', _error);
        // 可以考虑提示用户点击按钮来播放
      });
    }
  });
}

defineOptions({
  name: 'BaseLayout'
});
const { childLevelMenus, isActiveFirstLevelMenuHasChildren } = setupMixMenuContext();

const GlobalMenu = defineAsyncComponent(() => import('../modules/global-menu/index.vue'));

const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical';
  const horizontal: LayoutMode = 'horizontal';
  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal;
});

const headerProps = computed(() => {
  const { mode, reverseHorizontalMix } = themeStore.layout;

  const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
    vertical: {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true
    },
    'vertical-mix': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false
    },
    horizontal: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
    },
    'horizontal-mix': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: reverseHorizontalMix && isActiveFirstLevelMenuHasChildren.value
    }
  };

  return headerPropsConfig[mode];
});

const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal');

const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix');

const isHorizontalMix = computed(() => themeStore.layout.mode === 'horizontal-mix');

const siderWidth = computed(() => getSiderWidth());

const siderCollapsedWidth = computed(() => getSiderCollapsedWidth());

function getSiderWidth() {
  const { reverseHorizontalMix } = themeStore.layout;
  const { width, mixWidth, mixChildMenuWidth } = themeStore.sider;

  if (isHorizontalMix.value && reverseHorizontalMix) {
    return isActiveFirstLevelMenuHasChildren.value ? width : 0;
  }

  let w = isVerticalMix.value || isHorizontalMix.value ? mixWidth : width;

  if (isVerticalMix.value && appStore.mixSiderFixed && childLevelMenus.value.length) {
    w += mixChildMenuWidth;
  }

  return w;
}

function getSiderCollapsedWidth() {
  const { reverseHorizontalMix } = themeStore.layout;
  const { collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = themeStore.sider;

  if (isHorizontalMix.value && reverseHorizontalMix) {
    return isActiveFirstLevelMenuHasChildren.value ? collapsedWidth : 0;
  }

  let w = isVerticalMix.value || isHorizontalMix.value ? mixCollapsedWidth : collapsedWidth;

  if (isVerticalMix.value && appStore.mixSiderFixed && childLevelMenus.value.length) {
    w += mixChildMenuWidth;
  }

  return w;
}
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :mode="layoutMode"
    :scroll-el-id="LAYOUT_SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="appStore.isMobile"
    :full-content="appStore.fullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="themeStore.header.height"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :footer-height="themeStore.footer.height"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right"
  >
    <template #header>
      <GlobalHeader v-bind="headerProps" />
    </template>
    <template #tab>
      <GlobalTab />
    </template>
    <template #sider>
      <GlobalSider />
    </template>
    <GlobalMenu />
    <GlobalContent />
    <ThemeDrawer />
    <template #footer>
      <GlobalFooter />
    </template>
    <audio ref="audioElement" :loop="false">
      <source :src="playAudioSrc" type="audio/mpeg" />
      <!-- <source src="./img/aribitrage.mp3" type="audio/mpeg" /> -->
      您的浏览器不支持音频元素。
    </audio>
  </AdminLayout>
</template>

<style lang="scss">
#__SCROLL_EL_ID__ {
  @include scrollbar();
}
</style>
