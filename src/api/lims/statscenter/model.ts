import { ByLabelEnum, SampleTypeEnum } from "@/enums/customEnum";

/**
 * 统计中心病原结果信息
 */
export interface PathogenStatsRespVO {
  pathogenCnSname?: string; // 病原体中文名
  outCount?: number; // 检出数量
  outRatio?: number; // 占比（%）
  byLabel: ByLabelEnum; // 报阳标签（0:未知；1：不展示；2：主报告；3：不展示（背景）；4：疑似病原体；）
  reportCount: number;
}

/**
 * 统计中心样本统计信息
 */
export interface SampleStatsRespVO {
  createTime?: string; // 时间
  sampleType?: SampleTypeEnum; // 样本类型（0：其他；1：肺泡灌洗液；2：痰液；3：鼻/咽拭子；4：水控；）
  sampleCount?: number; // 样本数量
}

/**
 * 统计中心阳性率统计信息
 */
export interface PositiveRateStatsRespVO {
  byLabel: ByLabelEnum; // 报阳标签（0:未知；1：不展示；2：主报告；3：不展示（背景）；4：疑似病原体；）
  sampleType?: SampleTypeEnum; // 样本类型（0：其他；1：肺泡灌洗液；2：痰液；3：鼻/咽拭子；4：水控；）
  totalCount?: number; // 总量
  positiveCount?: number; // 阳性量
  positiveRatio?: number; // 阳性率（%）
}

/**
 * 统计中心基础信息
 */
export interface StatsBaseRespVO {
  batchSampleMap?: Record<string, number>; // 样本数统计Map(本月最新10条)
  socMap?: Record<string, number>; // 芯片数统计Map(本月最新10条)
  taskMap?: Record<string, number>; // 任务数统计Map(本月最新10条)
  makeReportMap?: Record<string, number>; // 出具报告数统计Map(本月最新10条)
  msocs?: number; // 本月芯片数
  ysocs?: number; // 昨日芯片数
  ysamples?: number; // 昨日样本数
  mtasks?: number; // 本月任务数
  msampleBatchs?: number; // 本月样本批次数
  msamples?: number; // 本月样本数
  ytasks?: number; // 昨日任务数
  mmakeReport?: number; // 本月出具报告数
  ysampleBatchs?: number; // 昨日样本批次数
  ymakeReport?: number; // 昨日出具报告数
}
