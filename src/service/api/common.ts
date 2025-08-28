import { request } from '../request';
/** 上传到oss */
export function fetchUploadOss(data: FormData) {
  return request<any>({
    url: '/api/admin/upload/oss',
    method: 'post',
    data
  });
}
