import { request } from '@/service/request';
import type { EtfProductRequest, EtfSettingRequest } from '@/typings/etf';

// ETF产品列表
export function EtfProductList(params: { name?: string; status?: string; page?: number; size?: number }) {
  return request<any>({ url: '/api/admin/etf/product/list', params });
}

// ETF产品详情
export function EtfProductDetail(params: { id: number }) {
  return request<any>({ url: '/api/admin/etf/product/detail', params });
}

// 创建ETF产品
export function EtfProductCreate(data: EtfProductRequest) {
  return request<any>({ url: '/api/admin/etf/product/create', method: 'post', data });
}

// 更新ETF产品
export function EtfProductUpdate(data: EtfProductRequest & { id: number }) {
  return request<any>({ url: '/api/admin/etf/product/update', method: 'post', data });
}

// 删除ETF产品
export function EtfProductDelete(params: { id: number }) {
  return request<any>({ url: '/api/admin/etf/product/delete', params });
}

// ETF设置列表
export function EtfConfigList(params: { product_id?: number; status?: string; page?: number; size?: number }) {
  return request<any>({ url: '/api/admin/etf/config/list', params });
}

// ETF设置详情
export function EtfConfigDetail(params: { id: number }) {
  return request<any>({ url: '/api/admin/etf/config/detail', params });
}

// 创建ETF设置
export function EtfConfigCreate(data: EtfSettingRequest) {
  return request<any>({ url: '/api/admin/etf/config/create', method: 'post', data });
}

// 更新ETF设置
export function EtfConfigUpdate(data: EtfSettingRequest & { id: number }) {
  return request<any>({ url: '/api/admin/etf/config/update', method: 'post', data });
}

// 删除ETF设置
export function EtfConfigDelete(params: { id: number }) {
  return request<any>({ url: '/api/admin/etf/config/delete', params });
}

// 保留原有的setting接口，以防其他地方使用
// ETF设置列表
export function EtfSettingList(params: { product_id?: number; status?: string; page?: number; size?: number }) {
  return request<any>({ url: '/api/admin/etf/setting/list', params });
}

// ETF设置详情
export function EtfSettingDetail(params: { id: number }) {
  return request<any>({ url: '/api/admin/etf/setting/detail', params });
}

// 创建ETF设置
export function EtfSettingCreate(data: EtfSettingRequest) {
  return request<any>({ url: '/api/admin/etf/setting/create', method: 'post', data });
}

// 更新ETF设置
export function EtfSettingUpdate(data: EtfSettingRequest & { id: number }) {
  return request<any>({ url: '/api/admin/etf/setting/update', method: 'post', data });
}

// 删除ETF设置
export function EtfSettingDelete(params: { id: number }) {
  return request<any>({ url: '/api/admin/etf/setting/delete', params });
}

// ETF订单列表
export function EtfOrderList(params: {
  uid?: number;
  product_id?: number;
  status?: number;
  page?: number;
  size?: number;
}) {
  return request<any>({ url: '/api/admin/order/etf/list', params });
}

// ETF订单审核
export interface EtfOrderAuditRequest {
  id: number;
  status: number; // 1拒绝 2通过
}

export function EtfOrderAudit(data: EtfOrderAuditRequest) {
  return request<any>({ url: '/api/admin/order/etf/audit', method: 'post', data });
}

// 更新ETF产品
export function EtfOrderUpdate(data:{ id: number,close_at:string }) {
  return request<any>({ url: '/api/admin/order/etf/update', method: 'post', data });
}