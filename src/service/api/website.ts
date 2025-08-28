import { Method } from '~/packages/alova/src';
import { request } from '../request';
import { CommIdPlader } from './typescript/comm-plader'

export interface SetConfigPlader {
    id?:number,
    key: string, //配置键
    group: string, //配置分组
    value_type: 'string' | 'integer' | 'boolean' | 'json',
    value: string //配置值
}

// 轮播列表
export function WebsiteBannerList(params: any) {
    return request<any>({ url: '/api/admin/banner/list', params})
}

//配置管理
export function WebsiteConfigList(params: any) {
    return request<any>({ url: '/api/admin/platform/config/list', params})
}

//添加配置
export function WebsiteAddConfig(data: SetConfigPlader) {
    return request<any>({ url: '/api/admin/platform/config/create',method:'post', data})
}

//修改配置
export function WebsiteUpdateConfig(data: SetConfigPlader) {
    return request<any>({ url: '/api/admin/platform/config/update', method:'post', data})
}

//删除配置
export function WebsiteDelConfig(params: CommIdPlader) {
    return request<any>({ url: '/api/admin/platform/config/delete', params})
}


