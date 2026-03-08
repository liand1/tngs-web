import { CheckTypeEnum, SampleStatusEnum, SampleTypeEnum, SexEnum } from "@/enums/customEnum";

/**
 * 受检者信息
 */
export interface ExamineeRespVO {
  /**
   * 受检者ID
   */
  id: number;
  
  /**
   * 样本ID
   */
  sampleId?: number;
  
  /**
   * 姓名
   */
  name: string;
  
  /**
   * 性别(0：未知；1：男；2：女；)
   */
  sex?: SexEnum;
  
  /**
   * 年龄
   */
  age?: number;
  
  /**
   * 门诊号/住院号
   */
  patientNumber: string;
  
  /**
   * 电话
   */
  phone?: string;
  
  /**
   * 床号
   */
  bed?: string;
  
  /**
   * 创建时间
   */
  createTime: string;
}

/**
 * 临床检测结果
 */
export interface ClinicalResultRespVO {
  /**
   * 临床结果ID
   */
  id: number;
  
  /**
   * 样本ID
   */
  sampleId?: number;
  
  /**
   * 临床表现/诊断
   */
  diagnosis?: string;
  
  /**
   * 结果说明
   */
  result?: string;
  
  /**
   * 白细胞计数(10^9/L)
   */
  wbc?: number;
  
  /**
   * 淋巴细胞(%)
   */
  lym?: number;
  
  /**
   * 中粒细胞(%)
   */
  gr?: number;
  
  /**
   * C反应蛋白(mg/L)
   */
  crp?: number;
  
  /**
   * 血小板比积(ng/ml)
   */
  pct?: number;
  
  /**
   * 重点关注病原体
   */
  focusPathogen?: string;
  
  /**
   * 核酸浓度
   */
  nucleicAcidConc?: number;
  
  /**
   * 文库浓度
   */
  libraryConc?: number;
  
  /**
   * 提取试剂批次
   */
  getLrBatch?: string;
  
  /**
   * 建库试剂批次
   */
  putLrBatch?: string;
  
  /**
   * 上机试剂
   */
  onDeviceLr?: string;
  
  /**
   * 提取实验员
   */
  getTechnician?: string;
  
  /**
   * 建库实验员
   */
  putTechnician?: string;
  
  /**
   * 创建时间
   */
  createTime: string;
}

/**
 * 样本芯片匹配信息
 */
export interface SampleSocRespVO {
  /**
   * 样本ID
   */
  id: number;
  
  /**
   * 芯片ID
   */
  socId: number;
  
  /**
   * 芯片数据ID
   */
  socDataId: number;
  
  /**
   * 批次编号
   */
  batchCode: string;
  
  /**
   * 源编号
   */
  sourceCode: string;
  
  /**
   * 实验编号（Sample名需要存在于测序数据文件中）
   */
  sampleCode: string;
  
  /**
   * 防错标签
   */
  failSafeTag?: string;
  
  /**
   * 样本类型（0：其他；1：肺泡灌洗液（BALF）；2：痰液；3：鼻/咽拭子；4：水控；）
   */
  sampleType: SampleTypeEnum;
  
  /**
   * 检测项目（0：其他；1：tNGS一步法呼吸道; ）
   */
  checkType: CheckTypeEnum;
  
  /**
   * 水控
   */
  waterControl: string;
  
  /**
   * I7编号
   */
  i7Code?: string;
  
  /**
   * I5编号
   */
  i5Code?: string;
  
  /**
   * 样本量(默认：单位：ml)
   */
  sampleVolume: number;
  
  /**
   * 样本单位（ul；ml；）
   */
  sampleUnit?: string;
  
  /**
   * 采样日期
   */
  samplingDate: number;
  
  /**
   * 送检医院
   */
  subHospital?: string;
  
  /**
   * 送检科室
   */
  subRoom?: string;
  
  /**
   * 送检医师
   */
  subDoctor?: string;
  
  /**
   * 接收日期
   */
  collectDate: number;
  
  /**
   * 来源类型（0：未知；1：手动创建；2：导入创建；）
   */
  createType?: number;
  
  /**
   * 创建时间
   */
  createTime: string;
  
  /**
   * 样本状态（0：未分析；1：已分析；2：无需分析；）
   */
  sampleStatus: SampleStatusEnum;
  
  /**
   * 备注
   */
  remark?: string;
  
  /**
   * 受检人名称
   */
  examineeName?: string;
  
  /**
   * 受检者信息
   */
  examinee: ExamineeRespVO;
  
  /**
   * 临床结果
   */
  clinicalResult: ClinicalResultRespVO;
  
  /**
   * 芯片数据文件名称
   */
  socDataFileName: string;
} 