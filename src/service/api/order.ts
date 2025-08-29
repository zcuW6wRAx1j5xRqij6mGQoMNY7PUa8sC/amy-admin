import { request } from '../request';
import type { CommListPlader } from './typescript/comm-plader';

// 合约订单列表
export function OrderFuturesList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/order/futures/list', params });
}

// 大宗订单列表
export function OrderOtcList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/order/otc/list', params });
}

// OTC订单审核
export interface OtcAuditRequest {
  id: number;
  match_price: number;
  match_quantity: number;
  status: 'open' | 'rejected';
}

export function OrderOtcAudit(data: OtcAuditRequest) {
  return request<any>({ url: '/api/admin/order/otc/audit', method: 'POST', data });
}

// 现货列表
export function OrderSpot(params: CommListPlader) {
  return request<any>({ url: '/api/admin/order/spot/list', params });
}

// IPO列表
export function OrderIPOList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/order/ipo/list', params });
}

// OTC订单锁仓/解锁
export interface OtcLockUnlockRequest {
  id: number;
  status: 'open' | 'locked';
}

export function OrderOtcLockUnlock(data: OtcLockUnlockRequest) {
  return request<any>({ url: '/api/admin/order/otc/lockOrUnlock', method: 'POST', data });
}

// OTC订单平仓
export interface OtcCloseRequest {
  id: number;
  close_price: number;
}

export function OrderOtcClose(data: OtcCloseRequest) {
  return request<any>({ url: '/api/admin/order/otc/closed', method: 'POST', data });
}

// OTC订单建仓
export interface OtcCreateRequest {
  block_trade_id: number;
  close_fee: number;
  leverage: number;
  open_fee: number;
  price: number;
  quantity: number;
  uid: number;
}

export function OrderOtcCreate(data: OtcCreateRequest) {
  return request<any>({ url: '/api/admin/order/otc/create', method: 'POST', data });
}
