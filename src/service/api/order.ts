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

/**
 * 日内策略信息
 */
export interface DayStrategyInfo {
  /**
   * 申请金额
   */
  amount?: number;
  created_at?: string;
  id?: number;
  /**
   * 申请状态(0:待审核,1:审核通过,2:审核拒绝)
   */
  status?: number;
  /**
   * 用户ID
   */
  uid?: number;
  updated_at?: string;
  user: UserInfo;
  [property: string]: any;
}

/**
 * 用户信息
 */
export interface UserInfo {
  /**
   * 头像
   */
  avatar?: string;
  created_at?: string;
  /**
   * 信用分
   */
  credit?: number;
  email?: string;
  id?: number;
  /**
   * 邀请码
   */
  invite_code?: string;
  /**
   * 是否实名认证：0-否，1-是
   */
  is_kyc?: number;
  /**
   * KYC数据
   */
  kyc_data?: number;
  /**
   * 最后登录时间
   */
  last_login_at?: string;
  /**
   * 最后登录设备
   */
  last_login_device?: string;
  /**
   * 最后登录IP
   */
  last_login_ip?: string;
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
   * 上级ID
   */
  parent_id?: number;
  phone?: string;
  /**
   * 国际区号
   */
  phone_code?: string;
  /**
   * 注册IP
   */
  register_ip?: string;
  /**
   * 注册设备
   */
  regsiter_device?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 角色ID
   */
  role_id?: number;
  /**
   * 状态：1-正常，0-禁用
   */
  status?: number;
  updated_at?: string;
  [property: string]: any;
}

/**
 * 日内策略搜索参数
 */
export interface DayStrategySearchParams extends CommListPlader {
  uid?: string;
  status?: number | null;
}

/**
 * 日内策略审核请求
 */
export interface DayStrategyAuditRequest {
  id: number;
  status: number;
}

// 日内策略申请列表
export function DayStrategyList(params: DayStrategySearchParams) {
  return request<any>({ url: '/api/admin/order/apply/list', params });
}

// 日内策略申请审核
export function DayStrategyAudit(data: DayStrategyAuditRequest) {
  return request<any>({ url: '/api/admin/order/apply/update', method: 'POST', data });
}

/**
 * 充值订单信息
 */
export interface DepositOrderInfo {
  id?: number;
  uid?: number;
  amount?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
  user: UserInfo;
  [property: string]: any;
}

/**
 * 充值订单搜索参数
 */
export interface DepositOrderSearchParams extends CommListPlader {
  uid?: string;
  status?: number | null;
}

/**
 * 充值订单审核请求
 */
export interface DepositOrderAuditRequest {
  id: string;
  status: 'approved' | 'rejected';
}

// 充值订单列表
export function DepositOrderList(params: DepositOrderSearchParams) {
  return request<any>({ url: '/api/admin/order/despoit/list', params });
}

// 充值订单审核
export function DepositOrderAudit(data: DepositOrderAuditRequest) {
  return request<any>({ url: '/api/admin/order/despoit/update', method: 'POST', data });
}

/**
 * 股票钱包提现信息
 */
export interface StockWithdrawInfo {
  /**
   * 提现金额
   */
  amount?: number;
  /**
   * 银行卡ID
   */
  bank_card_id?: number;
  /**
   * 银行卡信息
   */
  bank_card_info?: number;
  created_at?: string;
  id?: number;
  /**
   * 拒绝原因
   */
  reject_reason?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态：待审核，审核通过，审核不通过
   */
  status?: string;
  /**
   * 用户ID
   */
  uid?: number;
  updated_at?: string;
  user: UserInfo;
  [property: string]: any;
}

/**
 * 股票钱包提现搜索参数
 */
export interface StockWithdrawSearchParams extends CommListPlader {
  uid?: string;
  status?: string | null;
}

/**
 * 股票钱包提现审核请求
 */
export interface StockWithdrawAuditRequest {
  id: number;
  status: 'approved' | 'rejected';
  remark: string;
}

// 股票钱包提现列表
export function StockWithdrawList(params: StockWithdrawSearchParams) {
  return request<any>({ url: '/api/admin/order/stock/withdraw/list', params });
}

// 股票钱包提现审核
export function StockWithdrawAudit(data: StockWithdrawAuditRequest) {
  return request<any>({ url: '/api/admin/order/stock/withdraw/audit', method: 'POST', data });
}

/**
 * 币种信息
 */
export interface CoinInfo {
  /**
   * 是否允许充值
   */
  allow_deposit?: number;
  /**
   * 是否允许提现
   */
  allow_withdraw?: number;
  /**
   * 链名称
   */
  block?: string;
  created_at?: string;
  /**
   * 充值地址
   */
  deposit_address?: string;
  /**
   * 全称
   */
  full_name?: string;
  id?: number;
  /**
   * logo显示
   */
  logo?: string;
  /**
   * 货币名称
   */
  name?: string;
  /**
   * 状态：1-正常，0-禁用
   */
  status?: number;
  updated_at?: string;
  [property: string]: any;
}

/**
 * 现货提现信息
 */
export interface SpotWithdrawInfo {
  /**
   * 审核人员ID
   */
  admin_id?: number;
  /**
   * 申请金额
   */
  amount?: number;
  /**
   * 审核状态 0 待审核 1通过 2驳回
   */
  audit_status?: number;
  coin: CoinInfo;
  /**
   * 货币ID
   */
  coin_id?: number;
  created_at?: string;
  /**
   * 手续费
   */
  fee?: string;
  id?: number;
  /**
   * 实际到账金额
   */
  real_amount?: number;
  /**
   * 拒绝原因
   */
  reason?: string;
  /**
   * 收款钱包地址
   */
  receive_wallet_address?: string;
  /**
   * 状态 0 申请中 1 到账 2 失败
   */
  status?: number;
  /**
   * 用户UID
   */
  uid?: number;
  updated_at?: string;
  user: UserInfo;
  [property: string]: any;
}

/**
 * 现货提现搜索参数
 */
export interface SpotWithdrawSearchParams extends CommListPlader {
  uid?: string;
  audit_status?: number | null;
}

/**
 * 现货提现审核请求
 */
export interface SpotWithdrawAuditRequest {
  id: number;
  audit_status: number;
  remark: string;
}

// 现货提现列表
export function SpotWithdrawList(params: SpotWithdrawSearchParams) {
  return request<any>({ url: '/api/admin/order/spot/withdraw/list', params });
}

// 现货提现审核
export function SpotWithdrawAudit(data: SpotWithdrawAuditRequest) {
  return request<any>({ url: '/api/admin/order/spot/withdraw/audit', method: 'POST', data });
}
