import { defHttp } from '@/utils/http/axios';
import { useGlobSetting } from '@/hooks/setting';
// propTypes.string.def(useGlobSetting().uploadUrl),
/**
 * 图片上传结果接口
 */
export interface UploadImageResult {
  url: string;
  name?: string;
  size?: number;
  type?: string;
}

/**
 * 上传图片到服务器
 * @param file 图片文件
 * @returns 返回包含url的Promise
 */
export function uploadImage(file: File): Promise<UploadImageResult> {
  const { uploadUrl = '' } = useGlobSetting();

  // 创建表单数据
  const formData = new FormData();
  formData.append('file', file);
  // 可以添加额外参数
  formData.append('biz', 'doc'); // 业务标识

  return new Promise((resolve, reject) => {
    if (!uploadUrl) {
      reject(new Error('未配置上传URL'));
      return;
    }

    defHttp.uploadFile(
      {
        url: uploadUrl,
        // 可以添加上传进度处理
        // onUploadProgress: (e) => {
        //   const percent = Math.floor((e.loaded / e.total) * 100);
        //   console.log(`上传进度: ${percent}%`);
        // },
      },
      {
        file: file,
      }
    ).then((res: any) => {


      const data =  res?.data;
      // 根据实际后端接口返回格式进行处理
      if (data && data.code === 0) {
        // 如果返回数据格式可能是 { code: 0, data: { url: '...' } }
        resolve({
          url: data.data,
          // name: file.name,
          // size: file.size,
          // type: file.type
        });
      } else {
        reject(new Error('上传成功但返回数据格式不正确'));
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * 将图片转换为base64格式
 * @param file 图片文件
 * @returns 返回base64格式的Promise
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('转换base64失败'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// 导出默认对象
export default {
  uploadImage,
  imageToBase64
};
