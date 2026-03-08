import { defHttp } from '@/utils/http/axios';
import { PathogenStatsRespVO, SampleStatsRespVO, PositiveRateStatsRespVO, StatsBaseRespVO } from './model';

/**
 * 获得指定时段-背景病原结果统计列表
 * 
 * @param params 查询参数
 * @returns 背景病原结果统计列表
 */
export const findWaterPathogenStatsByTime = (params: {
  checkType: number | null;
  startTime: number; // 开始时间
  endTime: number; // 结束时间
  getLrBatch: string; // 提取试剂批次
  putLrBatch: string; // 建库试剂批次
}) => {
  return defHttp.get<PathogenStatsRespVO[]>(
    { url: '/lims/stats-center/find-water-stats-list', params }
  );
};

/**
 * 获得指定分组类型-样本统计列表
 * 
 * @param params 查询参数
 * @returns 样本统计列表（按日期分组）
 */
export const findSampleStatsByGroup = (params: {
  checkType: number; //检测项目
  subHospital: string; // 送检单位
  subRoom: string; // 送检科室
  subDoctor: string; // 送检医生
  groupByType: string; // 分组类型： day = 天; month = 月;
}) => {
  return defHttp.get<Record<string, SampleStatsRespVO[]>>(
    { url: '/lims/stats-center/find-sample-stats-list', params }
  );
};

export const findSampleChecktypeList = (params: {
  subHospital: string; // 送检单位
  subRoom: string; // 送检科室
  subDoctor: string; // 送检医生
  startDate: string;
  endDate: string;
  groupByType: string; // 分组类型： day = 天; month = 月;
}) => {
  return defHttp.get<Record<string, SampleStatsRespVO[]>>(
    { url: '/lims/stats-center/find-sample-checktype-list', params }
  );
};

/**
 * 获得指定分组条件-阳性率统计列表
 * 
 * @param params 查询参数
 * @returns 阳性率统计列表
 */
export const findPathogenPositiveRateByTime = (params: {
  checkType: number | null;
  startTime: number; // 开始时间
  endTime: number; // 结束时间
  subHospital: string; // 送检单位
  subRoom: string; // 送检科室
  subDoctor: string; // 送检医生
}) => {
  return defHttp.get<PositiveRateStatsRespVO[]>(
    { url: '/lims/stats-center/find-positive-stats-list', params }
  );
};

/**
 * 获得指定时段-病原检出结果统计列表
 * 
 * @param params 查询参数
 * @returns 病原检出结果统计列表
 */
export const findPathogenOutStatsByTime = (params: {
  checkType: number | null,
  startTime: number; // 开始时间
  endTime: number; // 结束时间
  sampleType: number; // 样本类型（0：其他；1：肺泡灌洗液；2：痰液；3：鼻/咽拭子；4：水控；）
  byLabelStr: string; // 报阳标签（0:未知；1：不展示；2：主报告；3：不展示（背景）；4：疑似病原体；），传递多个按逗号分隔
}) => {
  return defHttp.get<PathogenStatsRespVO[]>(
    { url: '/lims/stats-center/find-pathogen-out-stats-list', params }
  );
};

/**
 * 获得指定时段-耐药基因结果统计列表
 * 
 * @param params 查询参数
 * @returns 耐药基因结果统计列表
 */
export const findGenePathogenStatsByTime = (params: {
  startTime: number; // 开始时间
  endTime: number; // 结束时间
  sampleType: number; // 样本类型（0：其他；1：肺泡灌洗液；2：痰液；3：鼻/咽拭子；4：水控；）
  checkType: null | number,
}) => {
  return defHttp.get<PathogenStatsRespVO[]>(
    { url: '/lims/stats-center/find-gene-stats-list', params }
  );
};

/**
 * 获得基础统计信息
 * 
 * @returns 基础统计信息
 */
export const findBaseStats = () => {
  return defHttp.get<StatsBaseRespVO>(
    { url: '/lims/stats-center/find-base-stats' }
  );
};
