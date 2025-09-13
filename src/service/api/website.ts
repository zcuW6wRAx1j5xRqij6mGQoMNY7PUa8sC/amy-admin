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

export interface BannerRequest {
    id?: number,
    img_path?: string, // 图片地址
    link_url?: string, // 点击跳转
    platform?: string, // 平台 : app -> APP web -> WEB
    sort?: number, // 排序 数字小在前
    status?: number // 是否展示 0 否 1是
}

// 轮播列表
export function WebsiteBannerList(params: any) {
    return request<any>({ url: '/api/admin/banner/list', params})
}

// 添加轮播
export function WebsiteAddBanner(data: BannerRequest) {
    return request<any>({ url: '/api/admin/banner/create', method: 'post', data })
}

// 修改轮播
export function WebsiteUpdateBanner(data: BannerRequest) {
    return request<any>({ url: '/api/admin/banner/update', method: 'post', data })
}

// 删除轮播
export function WebsiteDelBanner(params: CommIdPlader) {
    return request<any>({ url: '/api/admin/banner/delete', params })
}

// 轮播详情
export function WebsiteBannerDetail(params: CommIdPlader) {
    return request<any>({ url: '/api/admin/banner/detail', params })
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

//配置详情
export function WebsiteConfigDetail(params: CommIdPlader) {
    return request<any>({ url: '/api/admin/platform/config/detail', params})
}

// 通知列表
export function WebsiteNoticeList(params: any) {
    return request<any>({ url: '/api/admin/public/notice/list', params})
}

// 删除通知
export function WebsiteDelNotice(params: { id: number }) {
    return request<any>({ url: '/api/admin/public/notice/delete', params})
}

export interface RequestNotice {
    /**
     * 内容
     */
    content: string;
    /**
     * 结束时间
     */
    end_time?: string;
    /**
     * ID 编号，ID 编号
     */
    id?: number;
    /**
     * 开始时间
     */
    start_time?: string;
    /**
     * 状态
     */
    status: number;
    /**
     * 主题
     */
    subject: string;
}
// 添加通知
export function WebsiteAddNotice(data: RequestNotice) {
    return request<any>({ url: '/api/admin/public/notice/create', method: 'post', data })
}

// 通知详情
export function WebsiteNoticeDetail(params: any) {
    return request<any>({ url: '/api/admin/public/notice/detail', params })
}

// 修改通知
export function WebsiteUpdateNotice(data: RequestNotice) {
    return request<any>({ url: '/api/admin/public/notice/update', method: 'post', data })
}
