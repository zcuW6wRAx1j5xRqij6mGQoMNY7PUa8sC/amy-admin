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

// 使用 useSocket 监听事件
const socketHandleId = Math.random().toString(36).substr(2, 9);
console.log(`BaseLayout 组件初始化 [${socketHandleId}]，开始 Socket 监听: public:admin_event`);

// 添加防重复机制
let isSocketInitialized = false;
if (!isSocketInitialized) {
  useSocket('public:admin_event', socketHandle);
  isSocketInitialized = true;
} else {
  console.log(`[${socketHandleId}] Socket 已经初始化过了，跳过重复初始化`);
}
const playAudioSrc = ref<string>('');
const audioElement = ref<HTMLAudioElement | null>(null);

function getImageUrl(imageName: string, type = 'mp3') {
  return new URL(`./mp3/${imageName}.${type}`, import.meta.url).href;
}

// 防抖机制，避免重复处理同一个事件
const processedEvents = new Set();

function socketHandle(data: any) {
  const eventName = data.data.event;
  console.log(`[${socketHandleId}] 收到 Socket 事件:`, eventName, data);

  if (eventName === 'admin_notify') {
    const payload = data.data.payload;

    // 创建更精确的事件唯一标识，基于事件内容
    const eventId = `${data.channel}_${payload?.module}_${JSON.stringify(payload)}`;

    // 检查是否已经处理过这个事件
    if (processedEvents.has(eventId)) {
      console.log(`[${socketHandleId}] 重复事件已处理过，跳过:`, eventId);
      return;
    }

    // 标记为已处理
    processedEvents.add(eventId);
    console.log(`[${socketHandleId}] 新事件，开始处理:`, eventId);

    // 10秒后清理事件记录，避免内存泄漏
    setTimeout(() => {
      processedEvents.delete(eventId);
    }, 10000);
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
      path = 'money_despoit';
      audioSrc = getImageUrl('deposit');
    }
    // 使用 appStore 来通知页面刷新
    appStore.triggerPageRefresh(path);
    console.log('path', path);
    // 显示 Naive UI 通知
    notification.warning({
      title: '系统通知',
      content: message,
      duration: 5000,
      keepAliveOnHover: true,
      onAfterEnter: () => {
        // 通知显示后，添加点击事件
        nextTick(() => {
          // 查找最新的通知元素
          const notifications = document.querySelectorAll('.n-notification');
          const latestNotification = notifications[notifications.length - 1] as HTMLElement;

          if (latestNotification) {
            // 设置鼠标指针样式
            latestNotification.style.cursor = 'pointer';

            // 添加点击事件
            const clickHandler = () => {
              console.log('clickHandler', path);
              _routerPushByKey(path as any);
            };

            latestNotification.addEventListener('click', clickHandler);

            // 在通知消失时移除事件监听器
            setTimeout(() => {
              latestNotification.removeEventListener('click', clickHandler);
            }, 5000);
          }
        });
      },
      onClose: () => {
        // 通知关闭时的回调
      },
      onLeave: () => {
        // 通知离开时的回调
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
