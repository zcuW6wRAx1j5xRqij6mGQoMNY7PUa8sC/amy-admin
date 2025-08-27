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
