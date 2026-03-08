

export interface inputDomeModel {
  //字段名
  fields: string;
  //名字
  label: string;

  //值
  value: string;

  //类型
  type: 'input' | 'uploadImg' | 'select'

  //input默认显示内容
  placeholder: string;

  //图片列表
  fileList: string[];


  // 是否必填
  required: boolean;

  //描述
  desc: string;

}