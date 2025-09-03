import { request } from '@/service/request';

// 平台设置列表
export function PlatformSettingList(params: {
  group?: string;
  key?: string;
  page?: number;
  size?: number;
}) {
  return request<any>({ url: '/api/admin/platform/setting/list', params });
}

// 平台设置详情
export function PlatformSettingDetail(params: { id: number }) {
  return request<any>({ url: '/api/admin/platform/setting/detail', params });
}

// 创建平台设置
export function PlatformSettingCreate(data: {
  group: string;
  key: string;
  name: string;
  value: string;
}) {
  return request<any>({ url: '/api/admin/platform/setting/create', method: 'post', data });
}

// 更新平台设置
export function PlatformSettingUpdate(data: {
  id: number;
  group: string;
  key: string;
  name: string;
  value: string;
}) {
  return request<any>({ url: '/api/admin/platform/setting/update', method: 'post', data });
}

// 删除平台设置
export function PlatformSettingDelete(params: { id: number }) {
  return request<any>({ url: '/api/admin/platform/setting/delete', params });
}
