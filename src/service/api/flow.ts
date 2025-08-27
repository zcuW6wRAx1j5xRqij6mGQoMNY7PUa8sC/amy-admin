import {request} from "../request"
import { CommListPlader } from "./typescript/comm-plader"

// 股票钱包流水
export function FlowStockList(params:CommListPlader) {
    return request<any>({url:'/api/admin/flow/stock', params})
}
// 贷款钱包流水
export function FlowLoanList(params:CommListPlader) {
    return request<any>({url:'/api/admin/flow/loan', params})
}
// 合约钱包
export function FlowFuturesList(params:CommListPlader) {
    return request<any>({url:'/api/admin/flow/futures', params})
}
// 现货钱包
export function FlowSpotList(params:CommListPlader) {
    return request<any>({url:'/api/admin/flow/spot', params})
}