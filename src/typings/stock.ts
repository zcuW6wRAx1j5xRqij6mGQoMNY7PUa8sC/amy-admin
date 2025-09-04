/**
 * IPO股票信息
 */
export interface IpoStock {
  /**
   * 股票ID
   */
  id?: number;
  /**
   * 股票名称
   */
  name: string;
  /**
   * 企业ID
   */
  company_id?: string;
  /**
   * 企业名称
   */
  company_name?: string;
  /**
   * 购买价格
   */
  buy_price: number;
  /**
   * 发行价格
   */
  apply_price?: number;
  /**
   * 平仓价格
   */
  close_price?: number;
  /**
   * 申请最小量
   */
  apply_min_quantity?: number;
  /**
   * 申请最大量
   */
  apply_max_quantity?: number;
  /**
   * 发行数量
   */
  issue_quantity?: number;
  /**
   * 已售数量
   */
  sold_quantity?: number;
  /**
   * 上市时间
   */
  published_at?: string;
  /**
   * 开仓手续费%
   */
  open_fee?: number;
  /**
   * 平仓手续费%
   */
  close_fee?: number;
  /**
   * 开始时间
   */
  apply_start_at?: string;
  /**
   * 结束时间
   */
  apply_end_at?: string;
  /**
   * 状态，0 关闭 1开启
   */
  status?: number;
  /**
   * 创建时间
   */
  created_at?: string;
  /**
   * 更新时间
   */
  updated_at?: string;
  [property: string]: any;
}

/**
 * IPO股票创建/更新请求参数
 */
export interface IpoStockRequest {
  /**
   * 股票ID（更新时必填）
   */
  id?: number;
  /**
   * 股票名称
   */
  name: string;
  /**
   * 企业ID
   */
  company_id?: string;
  /**
   * 企业名称
   */
  company_name?: string;
  /**
   * 购买价格
   */
  buy_price: number;
  /**
   * 发行价格
   */
  apply_price?: number;
  /**
   * 平仓价格
   */
  close_price?: number;
  /**
   * 申请最小量
   */
  apply_min_quantity?: number;
  /**
   * 申请最大量
   */
  apply_max_quantity?: number;
  /**
   * 发行数量
   */
  issue_quantity?: number;
  /**
   * 开仓手续费%
   */
  open_fee?: number;
  /**
   * 平仓手续费%
   */
  close_fee?: number;
  /**
   * 开始时间
   */
  apply_start_at?: string;
  /**
   * 结束时间
   */
  apply_end_at?: string;
  /**
   * 上市时间
   */
  published_at?: string;
  /**
   * 状态，0 关闭 1开启
   */
  status?: number;
  [property: string]: any;
}

/**
 * IPO股票查询参数
 */
export interface IpoStockSearchParams {
  /**
   * 股票ID
   */
  stock_id?: number;
  /**
   * 状态
   */
  status?: number;
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  size?: number;
  [property: string]: any;
}

/**
 * OTC股票信息
 */
export interface OtcStock {
  /**
   * 股票ID
   */
  id?: number;
  /**
   * 股票ID
   */
  stock_id: number;
  /**
   * 申请最大量
   */
  apply_max_quantity: number;
  /**
   * 申请最小量
   */
  apply_min_quantity: number;
  /**
   * 申请价格
   */
  apply_price: number;
  /**
   * 平仓手续费%
   */
  close_fee: number;
  /**
   * 平仓价格
   */
  close_price: number;
  /**
   * 开仓手续费%
   */
  open_fee: number;
  /**
   * 状态，0 关闭 1开启
   */
  status: number;
  /**
   * 折扣价开启状态=1:启用,0:禁用
   */
  discount_status?: number;
  /**
   * 折扣比例8折=0.8
   */
  discount?: number;
  /**
   * 折扣开始时间
   */
  discount_start?: string;
  /**
   * 折扣结束时间
   */
  discount_end?: string;
  /**
   * 创建时间
   */
  created_at?: string;
  /**
   * 更新时间
   */
  updated_at?: string;
  [property: string]: any;
}

/**
 * 市场股票信息
 */
export interface MarketStock {
  /**
   * 股票ID
   */
  id?: number;
  /**
   * 涨跌幅
   */
  change: number;
  /**
   * 收盘价
   */
  close: number;
  /**
   * 国家
   */
  country: string;
  /**
   * 交易所类型
   */
  exchange: string;
  /**
   * 最高价
   */
  high: number;
  /**
   * 是否推荐，0-否，1-是
   */
  is_recommend?: number;
  /**
   * 国际证券识别码
   */
  isin?: string;
  /**
   * K线查询路径
   */
  kline_query_path?: string;
  /**
   * 股票Logo
   */
  logo?: string;
  /**
   * 最低价
   */
  low: number;
  /**
   * 成交额
   */
  market_cap: number;
  /**
   * 股票名称
   */
  name: string;
  /**
   * 开盘价
   */
  open: number;
  /**
   * 当前价格
   */
  price: number;
  /**
   * 行情查询路径
   */
  quote_query_path?: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 状态，1:启用 0:禁用
   */
  status: number;
  /**
   * 股票代码
   */
  symbol: string;
  /**
   * 成交量
   */
  volume: number;
  /**
   * 创建时间
   */
  created_at?: string;
  /**
   * 更新时间
   */
  updated_at?: string;
  [property: string]: any;
}
