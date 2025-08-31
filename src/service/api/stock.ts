import { url } from 'node:inspector';
import { request } from '../request';
import { type CommIdPlader, type CommListPlader } from './typescript/comm-plader';

export interface MarkListPlader extends CommListPlader {
  symbol?: string; // 股票代码，空为全部
  exchange?: string; // 交易所，空为全部
  status?: string; // 状态，空为全部
}

export interface MarkPostPlader {
  id?: number;
  change: number; // 涨跌幅
  close: number; // 收盘价
  country: string; // 国家
  exchange: string; // 交易所类型
  high: number; // 最高价
  is_recommend?: number; // 是否推荐，0-否，1-是
  isin?: string; // 国际证券识别码
  kline_query_path?: string; // K线查询路径
  logo?: string; // 股票Logo
  low: number; // 最低价
  market_cap: number; // 成交额
  name: string; // 股票名称
  open: number; // 开盘价
  price: number; // 当前价格
  quote_query_path?: string; // 行情查询路径
  sort: number; // 排序
  status: number; // 状态，1:启用 0:禁用
  symbol: string; // 股票代码
  volume: number; // 成交量
}

export interface OtcPostPlader {
  id?: number;
  apply_max_quantity: number; // 申请最大量
  apply_min_quantity: number; // 申请最小量
  apply_price: number; // 申请价格
  close_fee: number; // 手续费%
  close_price: number; // 平仓价格
  open_fee: number; // 开盘手续费%
  status: number; // 状态，0 关闭 1开启
  stock_id: number; // 股票ID
  discount_status?: number; // 折扣价开启状态=1:启用,0:禁用
  discount?: number; // 折扣比例8折=0.8
  discount_start?: string; // 折扣开始时间
  discount_end?: string; // 折扣结束时间
}

export interface IpoPostPlader {
  id?: number;
  apply_end_at?: string; // 结束时间
  apply_max_quantity?: number; // 申请最大量
  apply_min_quantity?: number; // 申请最小量
  apply_price?: number; // 发行价格
  apply_start_at?: string; // 开始时间
  close_fee?: number; // 出盘手续费%
  close_price?: number; // 平仓价格
  issue_quantity?: number; // 发行数量
  open_fee?: number; // 进盘手续费%
  status?: number; // 状态，0 关闭 1开启
  stock_id?: number; // 股票ID
}

/* 市场股票 */
// 市场股票列表
export function StockMarketList(params: any) {
  return request<any>({ url: '/api/admin/stock/market/list', params });
}
// 市场股票详情
export function StockMarketInfo(params: CommIdPlader) {
  return request<any>({ url: '/api/admin/stock/market/detail', params });
}
// 添加市场股票
export function StockCreateMarket(data: MarkPostPlader) {
  return request<any>({ url: '/api/admin/stock/market/create', data });
}
// 修改市场股票
export function StockUpdateMarket(data: MarkPostPlader) {
  return request<any>({ url: '/api/admin/stock/market/update', data });
}
// 删除市场股票
export function StockDelMarket(data: CommIdPlader) {
  return request<any>({ url: '/api/admin/stock/market/delete', data });
}

/* IPO */
// ipo列表
export function StockIpoList(params: any) {
  return request<any>({ url: '/api/admin/stock/ipo/list', params });
}
// ipo详情
export function StockIpoInfo(params: CommIdPlader) {
  return request<any>({ url: '/api/admin/stock/ipo/detail', params });
}
// 删除ipo
export function StockDelIpo(params: CommIdPlader) {
  return request<any>({ url: '/api/admin/stock/ipo/delete', params });
}
// 新增ipo
export function StockCreateIpo(data: IpoPostPlader) {
  return request<any>({ url: '/api/admin/stock/ipo/create', data });
}
// 修改ipo
export function StockUpdateIpo(data: IpoPostPlader) {
  return request<any>({ url: '/api/admin/stock/ipo/update', data });
}

/* 大宗 */
// 大宗列表
export function StockOtcList(params: any) {
  return request<any>({ url: '/api/admin/stock/otc/list', params });
}
// 大宗详情
export function StockOtcInfo(params: CommIdPlader) {
  return request<any>({ url: '/api/admin/stock/otc/detail', params });
}
// 删除大宗
export function StockDelOtc(params: CommIdPlader) {
  return request<any>({ url: '/api/admin/stock/otc/delete', params });
}
// 新增大宗
export function StockCreateOtc(data: OtcPostPlader) {
  return request<any>({ url: '/api/admin/stock/otc/create', data });
}
// 修改大宗
export function StockUpdateOtc(data: OtcPostPlader) {
  return request<any>({ url: '/api/admin/stock/otc/update', data });
}
