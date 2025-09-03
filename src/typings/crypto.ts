/**
 * 数字货币充值订单信息
 */
export interface CryptoDepositOrder {
  id?: number;
  /**
   * 金额
   */
  amount?: number;
  coin: CoinInfo;
  /**
   * 币ID
   */
  coin_id?: number;
  created_at?: string;
  /**
   * 凭证
   */
  receipt?: string;
  /**
   * 状态
   */
  status?: string;
  /**
   * UID
   */
  uid?: number;
  updated_at?: string;
  user: UserInfo;
  [property: string]: any;
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
 * 用户信息
 */
export interface UserInfo {
  agent: AdminInfo;
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
   * 姓名
   */
  name?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 所属代理
   */
  parent_id: number;
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
   * 状态：1-正常，0-禁用
   */
  status?: number;
  updated_at?: string;
  [property: string]: any;
}

/**
 * 管理员信息
 */
export interface AdminInfo {
  /**
   * 账号
   */
  account?: string;
  /**
   * 头像
   */
  avatar?: string;
  created_at?: string;
  id?: number;
  /**
   * 邀请码
   */
  invite_code?: string;
  /**
   * 登录IP
   */
  login_ip?: string;
  /**
   * 登录时间
   */
  login_time?: number;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 上级ID
   */
  parent_id?: number;
  /**
   * 角色ID
   */
  role_id?: number;
  /**
   * 状态 0 禁用 1 启用
   */
  status?: number;
  updated_at?: string;
  [property: string]: any;
}
