import { request } from '../request';
import type { CommListPlader } from './typescript/comm-plader';

// 股票钱包流水
export function FlowStockList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/flow/stock', params });
}
// 股票钱包列表
export function WalletStockList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/wallet/stock/list', params });
}

// 股票钱包金额变动
export function WalletStockFundChange(data: {
  id: number;
  amount: number;
  type: string;
}) {
  return request<any>({ url: '/api/admin/wallet/stock/fund', method: 'post', data });
}
// 合约钱包列表
export function WalletFuturesList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/wallet/crypto-futures/list', params });
}
// 数字货币现货钱包列表
export function WalletSpotList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/wallet/crypto-spot/list', params });
}
// 贷款钱包流水
export function FlowLoanList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/flow/loan', params });
}
// 贷款钱包列表
export function WalletLoanList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/wallet/loan/list', params });
}

// 贷款钱包设置
export function WalletLoanSet(data: {
  id: number;
  amount_total: number;
  status: 'enabled' | 'disabled';
}) {
  return request<any>({ url: '/api/admin/wallet/loan/set', method: 'post', data });
}
// 合约钱包
export function FlowFuturesList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/flow/futures', params });
}
// 现货钱包
export function FlowSpotList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/flow/spot', params });
}
