import { request } from '../request';
import { CommListPlader } from './typescript/comm-plader'

// 合约订单列表
export function OrderFuturesList(params:CommListPlader) {
    return request<any>({ url: '/api/admin/order/futures/list', params})
}

// 大宗订单列表
export function OrderOtcList(params:CommListPlader) {
    return request<any>({url: '/api/admin/order/otc/list', params})
}

// 现货列表
export function OrderSpot(params:CommListPlader) {
    return request<any>({url:'/api/admin/order/spot/list', params})
}

//IPO列表
export function OrderIPOList(params:CommListPlader) {
    return request<any>({url:'/api/admin/order/ipo/list', params})
}