import { onBeforeUnmount, ref } from 'vue';
import { localStg } from '@/utils/storage';
const socketInfo = {
  url: 'wss://ws.amy.finance/connection/websocket'
};
let centrifuge = null;
// 存储已订阅的频道，避免重复订阅
const subscribedChannels = new Set();
// 存储频道对应的处理函数
const channelHandlers = new Map();
// 存储所有订阅对象
const globalSubscriptions = new Map();
// url: 订阅的频道 fn 处理数据的函数
export default function useSocket(url, fn) {
  if (!centrifuge) {
    centrifuge = new Centrifuge(socketInfo.url, {
      token: localStg.get('ws_token')
    });
  }
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
      // 检查是否已经订阅过这个频道
      if (subscribedChannels.has(subUrl)) {
        console.log(`频道 ${subUrl} 已经订阅过了，更新处理函数`);
        console.log(`当前处理函数:`, `${subFn.toString().substring(0, 100)}...`);
        // 更新处理函数
        channelHandlers.set(subUrl, subFn);
        return;
      }

      console.log(`开始订阅新频道: ${subUrl}`);
      console.log(`处理函数:`, `${subFn.toString().substring(0, 100)}...`);

      const subscription = centrifuge.newSubscription(subUrl);
      if (!subscription) {
        return;
      }

      // 标记为已订阅
      subscribedChannels.add(subUrl);
      // 存储处理函数
      channelHandlers.set(subUrl, subFn);
      // 存储订阅对象
      globalSubscriptions.set(subUrl, subscription);

      subscription
        .on('publication', function (ctx) {
          // 收到消息，使用存储的处理函数
          const handler = channelHandlers.get(subUrl);
          console.log(`频道 ${subUrl} 收到消息，调用处理函数:`, handler ? '存在' : '不存在');
          if (handler) {
            handler(ctx);
          }
        })
        .on('subscribing', function (ctx) {
          // 订阅中
          console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
        })
        .on('subscribed', function (ctx) {
          // 订阅成功
          console.log(`频道 ${subUrl} 订阅成功`, ctx);
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
    const subscription = globalSubscriptions.get(channelUrl);
    if (subscription) {
      subscription.unsubscribe();
      centrifuge.removeSubscription(subscription);
      // 从已订阅列表中移除
      subscribedChannels.delete(channelUrl);
      // 移除处理函数
      channelHandlers.delete(channelUrl);
      // 移除订阅对象
      globalSubscriptions.delete(channelUrl);
    }
  }

  // 取消所有订阅的函数
  function unsubscribeAll() {
    globalSubscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
        centrifuge.removeSubscription(subscription);
      }
    });
    globalSubscriptions.clear(); // 清空订阅对象映射
    subscribedChannels.clear(); // 清空已订阅列表
    channelHandlers.clear(); // 清空处理函数映射
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
  return { connectHandle, setSub, unsubscribeChannel, unsubscribeAll, unConnectHandle };
}
