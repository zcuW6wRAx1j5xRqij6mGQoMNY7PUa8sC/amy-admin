import { request } from '../request';

/** 理财产品相关接口 */

/** 获取理财产品列表 */
export function fetchGetProductList(params: any) {
  return request<any>({ url: '/api/admin/financial/products', params });
}

/** 新增理财产品 */
export function fetchAddProduct(data: any) {
  return request<any>({ url: '/api/admin/financial/create', method: 'post', data });
}

/** 编辑理财产品 */
export function fetchUpdateProduct(data: any) {
  return request<any>({ url: '/api/admin/financial/edit', method: 'post', data });
}

/** 获取理财订单列表 */
export function fetchGetOrderList(params: any) {
  return request<any>({ url: '/api/admin/financial/orders', params });
}
