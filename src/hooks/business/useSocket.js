import { onBeforeUnmount, ref } from 'vue';
import { localStg } from '@/utils/storage';
const socketInfo = {
  url: 'wss://ws.vitaxon.com/connection/websocket'
};
let centrifuge = null;
// url: 订阅的频道 fn 处理数据的函数
export default function useSocket(url, fn) {
  if (!centrifuge) {
    centrifuge = new Centrifuge(socketInfo.url, {
      token: localStg.get('ws_token')
    });
  }
  const subscriptions = [];
  const btcSub = ref();
  function connectHandle(scriptUrl) {
    try {
      if (!centrifuge) return;
      centrifuge
        .on('connecting', function (ctx) {
          console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
        })
        .on('connected', function (ctx) {
          console.log(`connected over ${ctx.transport}`);
        })
        .on('disconnected', function (ctx) {
          console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
        })
        .on('error', function (ctx) {
          console.log('client error', ctx);
        })
        .connect();
      if (!scriptUrl) {
        return;
      }
      setSub(scriptUrl, fn);
    } catch (error) {}
  }
  // 再次订阅其他的
  function setSub(subUrl, subFn) {
    try {
      btcSub.value = centrifuge.newSubscription(subUrl);
      if (!btcSub.value) {
        return;
      }
      subscriptions.push(btcSub.value);
      btcSub.value
        .on('publication', function (ctx) {
          // 收到消息
          // console.log('收到消息', ctx)
          subFn && subFn(ctx);
        })
        .on('subscribing', function (ctx) {
          // 订阅中
          console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
        })
        .on('subscribed', function (ctx) {
          // 订阅成功
          console.log('subscribed', ctx);
        })
        .on('unsubscribed', function (ctx) {
          // 取消订阅
          console.log(`unsubscribed: ${ctx}, ${ctx.reason}`);
        })
        .subscribe();
    } catch (error) {}
  }
  connectHandle(url);

  // 添加取消特定频道订阅的方法
  function unsubscribeChannel(channelUrl) {
    const index = subscriptions.findIndex(item => item.channel === channelUrl);
    if (index !== -1) {
      const subscription = subscriptions[index];
      subscription.unsubscribe();
      subscriptions.splice(index, 1); // 从数组中移除订阅
      centrifuge.removeSubscription(subscription); // 如果需要，从 centrifuge 客户端中移除订阅
    }
  }

  // 取消所有订阅的函数
  function unsubscribeAll() {
    subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
        centrifuge.removeSubscription(subscription);
      }
    });
    subscriptions.length = 0; // 清空数组
  }
  onBeforeUnmount(() => {
    unsubscribeAll();
    if (centrifuge) {
      // centrifuge.disconnect()
    }
  });
  function unConnectHandle() {
    if (centrifuge) {
      centrifuge.disconnect();
      centrifuge = null;
    }
  }
  return { connectHandle, btcSub, setSub, unsubscribeChannel, unsubscribeAll, unConnectHandle };
}
