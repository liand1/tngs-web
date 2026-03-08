import { getDictDataPageToDictType } from "../data"


//性别
export const gender = 'system_user_sex'

export const getGender = async () => {
  const res = await getDictDataPageToDictType(gender)
  return res
}



// 导出 sampledict 中的所有内容
export * from "./sampledict"