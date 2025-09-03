/**
 * ETF产品信息
 */
export interface EtfProduct {
  id?: number;
  /**
   * 产品名称
   */
  name?: string;
  /**
   * 详细介绍
   */
  desc?: string;
  /**
   * 开始时间
   */
  order_start_at?: string;
  /**
   * 结束时间
   */
  order_end_at?: string;
  /**
   * 状态:0=关闭,1=开启
   */
  status?: string;
  created_at?: string;
  updated_at?: string;
  [property: string]: any;
}

/**
 * ETF设置信息
 */
export interface EtfSetting {
  id?: number;
  /**
   * 产品ID
   */
  product_id?: number;
  /**
   * 日收益率
   */
  daily_profit_rate?: number;
  /**
   * 最小买入金额
   */
  min_quantity?: number;
  /**
   * 最大买入金额
   */
  max_quantity?: number;
  /**
   * 状态:0=关闭,1=开启
   */
  status?: string;
  created_at?: string;
  updated_at?: string;
  [property: string]: any;
}

/**
 * ETF设置信息（包含产品信息）
 */
export interface EtfConfigRow {
  id?: number;
  /**
   * 产品ID
   */
  product_id?: number;
  /**
   * 日收益率
   */
  daily_profit_rate?: number;
  /**
   * 最小买入金额
   */
  min_quantity?: number;
  /**
   * 最大买入金额
   */
  max_quantity?: number;
  /**
   * 状态:0=关闭,1=开启
   */
  status?: string;
  /**
   * 产品信息
   */
  product: EtfProduct;
  created_at?: string;
  updated_at?: string;
  [property: string]: any;
}

/**
 * ETF产品请求信息
 */
export interface EtfProductRequest {
  /**
   * 详细介绍
   */
  desc?: string;
  /**
   * 产品名称
   */
  name?: string;
  /**
   * 结束时间
   */
  order_end_at?: string;
  /**
   * 开始时间
   */
  order_start_at?: string;
  /**
   * 状态:0=关闭,1=开启
   */
  status?: number;
  [property: string]: any;
}

/**
 * ETF设置请求信息
 */
export interface EtfSettingRequest {
  /**
   * 产品ID
   */
  product_id: number;
  /**
   * 日收益率
   */
  daily_profit_rate: number;
  /**
   * 最小买入金额
   */
  min_quantity: number;
  /**
   * 最大买入金额
   */
  max_quantity: number;
  /**
   * 状态:0=关闭,1=开启
   */
  status: number;
  [property: string]: any;
}
