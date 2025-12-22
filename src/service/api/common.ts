import { request } from '../request';
/** 上传到oss */
export function getUploadApi(data: any) {
  return request<any>({
    url: '/api/admin/public/get-upload-url',
    method: 'get',
    params: data
  });
}

/** 获取等级选项 */
export function getLevelOptions() {
  return request<any>({
    url: '/api/admin/public/options/level',
    method: 'get'
  });
}

// 获取平台配置数据
export function fetchGetPlatformConfigData(params: any) {
  return request<any>({ url: '/api/admin/platform/config/data', method: 'get', params: params });
}

// 保存平台配置数据
export function fetchSavePlatformConfigData(data: any) {
  return request<any>({ url: '/api/admin/platform/config/save', method: 'post', data });
}
