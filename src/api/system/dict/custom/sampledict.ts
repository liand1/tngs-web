import { getDictDataPageToDictType } from "@/api/system/dict/data"

//创建来源
export const ceateType = 'gm_create_type'

//样本类型
export const sampleType = 'sample_code_type'

//检测项目
export const checkType = 'check_code_type'

//i5编号
export const i5Code = 'ifive_code_type'

//i7编号
export const i7Code = 'iseven_code_type'

// 是否被分析
export const sampleStatus = 'sample_is_analysis'

// 质控结果
export const qcStatus = 'gm_qc_status'

// 任务状态
export const taskStatus = 'task_status_type'

// 审核状态
export const checkStatus = 'check_status_type'

// 深度挖掘
export const excavateDeeply = 'excavate_deeply'

// 调用状态
export const callStatus = 'soc_call_status'

export const getCreateType = async () => {
  const res = await getDictDataPageToDictType(ceateType)
  return res
}

export const getSampleType = async () => {
  const res = await getDictDataPageToDictType(sampleType)
  return res
}


export const getCheckType = async () => {
  const res = await getDictDataPageToDictType(checkType)
  return res
}

export const getI5Code = async () => {
  const res = await getDictDataPageToDictType(i5Code)
  return res
}

export const getI7Code = async () => {
  const res = await getDictDataPageToDictType(i7Code)
  return res
}

export const getSampleStatus = async () => {
  const res = await getDictDataPageToDictType(sampleStatus)
  return res
}


export const getQcStatus = async () => {
  const res = await getDictDataPageToDictType(qcStatus)
  return res
}

export const getTaskStatus = async () => {
  const res = await getDictDataPageToDictType(taskStatus)
  return res
}

export const getCheckStatus = async () => {
  const res = await getDictDataPageToDictType(checkStatus)
  return res

}

export const getExcavateDeeply = async () => {
  const res = await getDictDataPageToDictType(excavateDeeply)
  return res
}

export const getCallStatus = async () => {
  const res = await getDictDataPageToDictType(callStatus)
  return res
}
