import { request } from "../request"
import { type CommListPlader, type CommIdPlader } from "./typescript/comm-plader"

/**
 * 平台配置项
 */
export interface SetFormPlader {
    id?:string;
    group?: string; //配置分组
    key?: string; //配置键
    value?: string; //配置值
    value_type?: string; //string, integer, boolean, json
}

// 配置管理列表
export function PlatFormConfigList(params:CommListPlader) {
    return request<any>({url:'/api/admin/platform/config/list', params})
}
// 添加管理
export function PlatCreateFormConfig(data:SetFormPlader) {
    return request<any>({url:'/api/admin/platform/config/create', data})
}
// 修改管理
export function PlatUpdateFormConfig(data:SetFormPlader) {
    return request<any>({url:'/api/admin/platform/config/update', data})
}
// 管理详情
export function PlatFormConfigInfo(params:CommIdPlader) {
    return request<any>({url:'/api/admin/platform/config/detail', params})
}
// 删除管理
export function PlatDeleteFormConfig(params:CommIdPlader) {
    return request<any>({url:'/api/admin/platform/config/delete', params})
}

// banner
export function PlatBannerList(params: CommListPlader) {
    return request<any>({url:'/api/admin/banner/list', params})
}