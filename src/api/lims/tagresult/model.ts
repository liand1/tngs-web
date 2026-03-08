
/**
 * 靶区检测简单结果响应VO
 */
export interface TagResultSmallRespVO {
  // 病原体中文名
  pathogenCnSname?: string;
  // 实验编号
  sampleCode?: string;
  // 标记编号
  tagCode: string;
  // 检测数
  detectionCount?: number;
  // 是否水样
  isWater?: boolean;
  // 是否当前靶区
  isCurrentTag?: boolean;
  //样本ID
  sampleId?: number;
  //水控值
  waterControls?: [string];
}
 