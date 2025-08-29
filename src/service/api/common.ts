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
