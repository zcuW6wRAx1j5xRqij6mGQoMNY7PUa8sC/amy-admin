import { request } from '../request';
import { type CommIdPlader, type CommListPlader } from './typescript/comm-plader';

// 登录
export interface LoginPlader {
  username: string;
  password: string;
}

export interface AuditPlader extends CommIdPlader {
  status: number;
}

export interface KycSearchPlader extends CommIdPlader {
  filter?: string; // 搜索条件（邮箱、......）
  status?: string;
}

export interface UserListPlader extends CommIdPlader {
  status?: string;
  mobile?: string; // 手机号
}

export interface UserLevelRequest {
  id?: number;
  slug?: string; // 等级标识
  name_en?: string; // 英文名称
  name_es?: string; // 西班牙名称
  name_jp?: string; // 日语名称
  name_kr?: string; // 韩语名称
  despoit_money?: number; // 充值金额
  high_yield_rate?: number; // 高收益比例
  high_yield_amount_rate?: number; // 高收益金额比例
}

/**
 * 用户更新请求接口
 */
export interface UserUpdateRequest {
  /**
   * 信用分
   */
  credit?: number;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * ID 编号
   */
  id: number;
  /**
   * 是否实名认证：0-否，1-是
   */
  is_kyc?: number;
  /**
   * 用户等级ID
   */
  level_id?: number;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 上级
   */
  parent_id?: number;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 国际区号
   */
  phone_code?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 角色
   */
  role_id?: number;
  /**
   * 状态，1-正常，0-禁用
   */
  status?: number;
  [property: string]: any;
}

/**
 * 用户搜索参数接口
 */
export interface UserSearchParams extends CommListPlader {
  uid?: string;
  name?: string;
  email?: string;
  phone?: string;
  invite_code?: string;
  status?: number | null;
  role_type?: number | null;
  is_verified_identity?: number | null;
  funds_lock?: number | null;
}

/**
 * 重置密码请求接口
 */
export interface ResetPasswordRequest {
  id: number;
  password: string;
}

/**
 * 重置交易密码请求接口
 */
export interface ResetTradePasswordRequest {
  id: number;
  password: string;
}

/**
 * 获取用户列表
 *
 * @param params
 * @returns
 */
export function fetchGetUserList(params: UserSearchParams) {
  return request({ url: '/api/admin/users/user/list', params });
}
// 用户详情
export function fetchGetUserInfo(params: CommIdPlader) {
  return request({ url: '/api/admin/users/user/detail', params });
}

// 用户更新
export function fetchUpdateUser(data: UserUpdateRequest) {
  return request({ url: '/api/admin/users/user/update', method: 'post', data });
}

// 重置密码
export function fetchResetPassword(data: ResetPasswordRequest) {
  return request({ url: '/api/admin/users/user/reset-password', method: 'post', data });
}

// 重置交易密码
export function fetchResetTradePassword(data: ResetTradePasswordRequest) {
  return request({ url: '/api/admin/users/user/reset-trade-password', method: 'post', data });
}

/* KYC管理 */
// 审核
export function UserKycAudit(data: AuditPlader) {
  return request({ url: '/api/admin/users/kyc/audit', data, method: 'post' });
}
// 详情
export function UserKycInfo(params: CommIdPlader) {
  return request({ url: '/api/admin/users/kyc/detail', params });
}
// 列表
export function UserKycList(params: any) {
  return request({ url: '/api/admin/users/kyc/list', params });
}

/* 用户等级管理 */
// 用户等级列表
export function UserLevelList(params: any) {
  return request({ url: '/api/admin/users/level/list', params });
}

// 添加用户等级
export function UserLevelAdd(data: UserLevelRequest) {
  return request({ url: '/api/admin/users/level/create', method: 'post', data });
}

// 修改用户等级
export function UserLevelUpdate(data: UserLevelRequest) {
  return request({ url: '/api/admin/users/level/update', method: 'post', data });
}

// 删除用户等级
export function UserLevelDelete(params: CommIdPlader) {
  return request({ url: '/api/admin/users/level/delete', params });
}

// 用户等级详情
export function UserLevelDetail(params: CommIdPlader) {
  return request({ url: '/api/admin/users/level/detail', params });
}
