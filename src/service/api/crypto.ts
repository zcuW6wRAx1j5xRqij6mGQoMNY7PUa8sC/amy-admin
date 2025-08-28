import {request} from "../request"
import { CommIdPlader } from "./typescript/comm-plader"

export interface CryptoPostCoinPlader {
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
    /**
     * 充值地址
     */
    deposit_address?: string;
    /**
     * 全称
     */
    full_name?: string;
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
    id?:number
}

/**
 * 现货交易对请求信息
 */
export interface CryptoPostSpotPlader {
    /**
     * 买入点差
     */
    buy_spread?: number;
    /**
     * 手续费
     */
    fee?: number;
    /**
     * 首页推荐 0 否 1是
     */
    is_recommend?: number;
    /**
     * 卖出点差
     */
    sell_spread?: number;
    /**
     * 排序显示 数字从小到大
     */
    sort?: number;
    /**
     * 交易状态 : 0 关闭 1 开启
     */
    status?: number;
    /**
     * 交易对ID
     */
    symbol_id?: number;
    id?:number
}

/**
 * 合约交易对请求信息
 */
export interface CryptoPostFuturesPlader {
    /**
     * 买入点差
     */
    buy_spread?: number;
    /**
     * 手续费
     */
    fee?: number;
    /**
     * 卖出点差
     */
    sell_spread?: number;
    /**
     * 排序显示 数字从小到大
     */
    sort?: number;
    /**
     * 交易状态 : 0 关闭 1 开启
     */
    status?: number;
    /**
     * 交易对ID
     */
    symbol_id?: number;
    id?:number
}

/**
 * 交易对请求信息
 */
export interface Request {
    /**
     * 交易货币
     */
    base_asset?: string;
    /**
     * 币安交易对别名
     */
    binance_symbol?: string;
    /**
     * 货币ID
     */
    coin_id?: number;
    /**
     * 结算小数位
     */
    digits?: number;
    logo?: string;
    /**
     * 交易对自定义名称
     */
    name?: string;
    /**
     * 计价货币
     */
    quote_asset?: string;
    /**
     * 自有行情 0 否 1 是
     */
    self_data?: number;
    /**
     * 状态 1开启 0关闭
     */
    status?: number;
    /**
     * 交易对名称
     */
    symbol?: string;
    [property: string]: any;
}

// symbol管理
export function CryptoSymbolList(params:any) {
    return request<any>({url:'/api/admin/crypto/symbol/list', params})
}
// 合约管理
export function CryptoFuturesList(params:any) {
    return request<any>({url:'/api/admin/crypto/futures/list', params})
}
// 现货管理
export function CryptoSpotList(params:any) {
    return request<any>({url:'/api/admin/crypto/spot/list', params})
}
// 币种管理
export function CryptoCoinList(params:any) {
    return request<any>({url:'/api/admin/crypto/coin/list', params})
}

// 新增币种
export function CryptoCreateCoin(data:CryptoPostCoinPlader) {
    return request<any>({url:'/api/admin/crypto/coin/create',method:'post', data})
}

// 修改币种
export function CryptoUpdateCoin(data:CryptoPostCoinPlader) {
    return request<any>({url:'/api/admin/crypto/coin/update',method:'post', data})
}

// 查询币种
export function CryptoCoinInfo(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/coin/detail', params})
}

// 删除币种
export function CryptoDelCoin(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/coin/delete', params})
}

// 新增现货
export function CryptoCreateSpot(data:CryptoPostSpotPlader) {
    return request<any>({url:'/api/admin/crypto/spot/create',method:'post', data})
}

// 修改现货
export function CryptoUpdateSpot(data:CryptoPostSpotPlader) {
    return request<any>({url:'/api/admin/crypto/spot/update',method:'post', data})
}

// 查询现货
export function CryptoSpotInfo(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/spot/detail', params})
}

// 删除现货
export function CryptoDelSpot(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/spot/delete', params})
}

// 新增合约
export function CryptoCreateFutures(data:CryptoPostFuturesPlader) {
    return request<any>({url:'/api/admin/crypto/futures/create',method:'post', data})
}

// 修改合约
export function CryptoUpdateFutures(data:CryptoPostFuturesPlader) {
    return request<any>({url:'/api/admin/crypto/futures/update',method:'post', data})
}

// 查询合约
export function CryptoFuturesInfo(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/futures/detail', params})
}

// 删除合约
export function CryptoDelFutures(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/futures/delete', params})
}

// 新增symbol
export function CryptoCreateSymbol(data:CryptoPostFuturesPlader) {
    return request<any>({url:'/api/admin/crypto/symbol/create',method:'post', data})
}

// 修改symbol
export function CryptoUpdateSymbol(data:CryptoPostFuturesPlader) {
    return request<any>({url:'/api/admin/crypto/symbol/update',method:'post', data})
}

// 查询symbol
export function CryptoSymbolInfo(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/symbol/detail', params})
}

// 删除symbol
export function CryptoDelSymbol(params:CommIdPlader) {
    return request<any>({url:'/api/admin/crypto/symbol/delete', params})
}
