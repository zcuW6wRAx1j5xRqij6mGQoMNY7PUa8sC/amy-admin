import { request } from '../request';
import { type CommListPlader, type CommIdPlader} from "./typescript/comm-plader"

// 登录
export interface LoginPlader {
    username: string,
    password: string
}

export interface AuditPlader extends CommIdPlader{
  status: number
}

export interface KycSearchPlader extends CommIdPlader {
  filter?: string,//搜索条件（邮箱、......）
  status?: string
}

export interface UserListPlader extends CommIdPlader {
  status?: string,
  mobile?: string //手机号
}

export interface UserLevelRequest {
  id?: number,
  slug?: string, // 等级标识
  name_en?: string, // 英文名称
  name_es?: string, // 西班牙名称
  name_jp?: string, // 日语名称
  name_kr?: string, // 韩语名称
  despoit_money?: number, // 充值金额
  high_yield_rate?: number, // 高收益比例
  high_yield_amount_rate?: number // 高收益金额比例
}

/**
 * 获取用户列表
 *
 * @param params
 * @returns
 */
export function fetchGetUserList(params:CommListPlader) {
  return request({url:'/api/admin/users/user/list', params})
}
// 用户详情
export function fetchGetUserInfo(params: CommIdPlader) {
  return request({url:'/api/admin/users/user/detail', params})
}


/*KYC管理*/
// 审核
export function UserKycAudit(data: AuditPlader) {
  return request({url: '/api/admin/users/kyc/audit', data})
}
// 详情
export function UserKycInfo(params: CommIdPlader) {
  return request ({url:'/api/admin/users/kyc/detail', params})
}
// 列表
export function UserKycList(params: any) {
  return request ({url:'/api/admin/users/kyc/list', params})
}

/*用户等级管理*/
// 用户等级列表
export function UserLevelList(params: any) {
  return request({url: '/api/admin/users/level/list', params})
}

// 添加用户等级
export function UserLevelAdd(data: UserLevelRequest) {
  return request({url: '/api/admin/users/level/create', method: 'post', data})
}

// 修改用户等级
export function UserLevelUpdate(data: UserLevelRequest) {
  return request({url: '/api/admin/users/level/update', method: 'post', data})
}

// 删除用户等级
export function UserLevelDelete(params: CommIdPlader) {
  return request({url: '/api/admin/users/level/delete', params})
}

// 用户等级详情
export function UserLevelDetail(params: CommIdPlader) {
  return request({url: '/api/admin/users/level/detail', params})
}
