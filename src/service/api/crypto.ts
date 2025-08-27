import {request} from "../request"
import {CommListPlader} from "./typescript/comm-plader"

// symbol管理
export function CryptoSymbolList(params:CommListPlader) {
    return request<any>({url:'/api/admin/crypto/symbol/list', params})
}
// 合约管理
export function CryptoFuturesList(params:CommListPlader) {
    return request<any>({url:'/api/admin/crypto/futures/list', params})
}
// 现货管理
export function CryptoSpotList(params:CommListPlader) {
    return request<any>({url:'/api/admin/crypto/spot/list', params})
}
// 币种管理
export function CryptoCoinList(params:CommListPlader) {
    return request<any>({url:'/api/admin/crypto/coin/list', params})
}