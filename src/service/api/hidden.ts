import { request } from "../request"

// 大宗订单隐藏
export const hiddenOrder = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/otc/hidden', params})
}

// 贷款订单隐藏
export const hiddenLoan = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/loan/hidden', params})
}

// IPO订单隐藏
export const hiddenIpo = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/ipo/hidden', params})
}

// 期货订单隐藏
export const hiddenFutures = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/futures/hidden', params})
}

// 现货订单隐藏
export const hiddenSpot = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/spot/hidden', params})
}

// ETF订单隐藏
export const hiddenEtf = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/etf/hidden', params})
}

// 日内订单隐藏
export const hiddenApply = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/apply/hidden' ,params})
}

// 充值订单隐藏
export const hiddenDespoit = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/deposit/hidden', params})
}

// 数字订单隐藏
export const hiddenCrypto = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/crypto/deposit/hidden', params})
}

// 股票订单隐藏
export const hiddenStock = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/stock/withdraw/hidden', params})
}

// 现货钱包订单隐藏
export const hiddenSpotWithdraw = (params: { id: number }) => {
  return request<any>({url:'/api/admin/order/spot/withdraw/hidden', params})
}

// 贷款钱包订单隐藏
export const hiddenLoanWithdraw = (params: { id: number }) => {
  return request<any>({url:'/api/admin/flow/loan/hidden', params})
}

// 隐藏订单
export const hiddenFinancial = (params: { id: number }) => {
  return request<any>({url:'/api/admin/financial/hidden', params})
}

// 期货订单隐藏
export const hiddenFuturesOrder = (params: { id: number }) => {
  return request<any>({url:'/api/admin/flow/futures/hidden', params})
}

// 现货订单隐藏
export const hiddenSpotOrder = (params: { id: number }) => {
  return request<any>({url:'/api/admin/flow/spot/hidden', params})
}

// 股票订单隐藏
export const hiddenStockOrder = (params: { id: number }) => {
  return request<any>({url:'/api/admin/flow/stock/hidden', params})
}
