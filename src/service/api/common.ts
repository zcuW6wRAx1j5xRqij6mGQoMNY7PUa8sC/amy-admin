import { request } from '../request';
/** 上传到oss */
export function getUploadApi(data: any) {
  return request<any>({
    url: '/api/admin/public/get-upload-url',
    method: 'get',
    params: data
  });
}
