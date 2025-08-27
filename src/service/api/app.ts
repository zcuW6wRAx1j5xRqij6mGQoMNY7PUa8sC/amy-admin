import { Method } from "~/packages/alova/src"
import { request } from "../request"

export function AppSetStockMarket(data: any) {
    return request<any>({ url: '/api/app/stock/wallet/deposit',method:"post", data })
}

export function AppGetStockDeposit(params: any) {
    return request<any>({ url: '/api/admin/stock/wallet/deposit', params })
}

export function AppSetStockSpotDepositList(data: any) {
    return request<any>({ url: '/api/app/stock/wallet/spot/deposit', method:"post", data })
}

export function AppGetStockSpotDepositList(params: any) {
    return request<any>({ url: '/api/app/stock/wallet/spot/deposit', params })
}

