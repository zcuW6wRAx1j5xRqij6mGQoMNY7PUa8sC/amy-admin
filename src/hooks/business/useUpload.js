import { useLoadingBar, useMessage } from 'naive-ui';
import { getUploadApi } from '@/service/api/common';

export default function useUpload() {
  const loadingBar = useLoadingBar();
  const message = useMessage();

  return async function uploadFile(file) {
    loadingBar.start();

    try {
      // 获取后缀名
      const type = file.name.split('.').pop();
      const resp = await getUploadApi({
        mimetypes: type
      });
      const uploadUrl = resp.upload_url ?? '';
      const filepath = resp.filepath ?? '';
      if (uploadUrl.length <= 0 || filepath.length <= 0) {
        message.error('上传失败：获取上传地址失败');
        return null;
      }

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file
      });

      if (!uploadRes.ok) {
        message.error('上传失败：文件上传失败');
        return null;
      }

      loadingBar.finish();
      message.success('上传成功');
      return filepath;
    } catch {
      return null;
    } finally {
      loadingBar.error();
    }
  };
}
