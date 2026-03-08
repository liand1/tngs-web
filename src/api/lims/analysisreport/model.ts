
// 下载报告详情主模型
export interface AnalysisReportDownloadRespVO {
  // 样本信息
  sample: SampleRespVO;
  // 分析结果(细菌)列表
  bacteriaResults: AnalysisResultDownloadRespVO[];
  // 分析结果(真菌)列表
  fungusResults: AnalysisResultDownloadRespVO[];
  // 分析结果(病毒)列表
  virusResults: AnalysisResultDownloadRespVO[];
  // 分析结果(菌属及其他)列表
  otherResults: AnalysisResultDownloadRespVO[];
  // 检出耐药基因列表
  genes: AnalysisResultDownloadRespVO[];
  //结核耐药基因 -结核相关
  geneResultDOS: any;
  //结核耐药基因 -非结核相关
  geneResultDOS2: any;
  //结核人源基因突变
  mutationDOS: any;
  // 检出耐药突变位点列表
  geneMutationss: AnalysisDownloadGmResultRespVO[];
  // 疑似病原体列表
  suspecteds: AnalysisResultDownloadRespVO[];
  // 临床建议列表
  clinicals: Record<string, string>;
  // 质控报告
  qcReport: AnalysisReportQCRespVO;
  // 检出阳性病原名称列表
  outPathogenNames: string[];
}

// 样本信息模型
interface SampleRespVO {
  id: number;                  // 样本ID
  socId: number;               // 芯片ID
  socDataId: number;           // 芯片数据ID
  batchCode: string;           // 批次编号
  sourceCode: string;          // 源编号
  sampleCode: string;          // 实验编号
  failSafeTag?: string;        // 防错标签
  sampleType: number;          // 样本类型（0：其他；1：肺泡灌洗液；2：痰液；3：鼻/咽拭子；4：水控）
  checkType: number;           // 检测项目（0：其他；1：tNGS一步法呼吸道）
  waterControl: string;        // 水控
  i7Code?: string;             // I7编号
  i5Code?: string;             // I5编号
  sampleVolume: number;        // 样本量
  sampleUnit?: string;         // 样本单位
  samplingDate: number;        // 采样日期
  subHospital?: string;        // 送检医院
  subRoom?: string;            // 送检科室
  subDoctor?: string;          // 送检医师
  collectDate: number;         // 接收日期
  createType?: number;         // 来源类型
  createTime: string;          // 创建时间
  sampleStatus: number;        // 样本状态
  remark?: string;             // 备注
  examineeName?: string;       // 受检人名称
  examinee: ExamineeRespVO;    // 受检者信息
  clinicalResult: ClinicalResultRespVO; // 临床检测结果
}

// 受检者信息模型
interface ExamineeRespVO {
  id: number;                  // 受检者ID
  sampleId?: number;           // 样本ID
  name: string;                // 姓名
  sex?: number;                // 性别(0：未知；1：男；2：女）
  age?: number;                // 年龄
  patientNumber: string;       // 门诊号/住院号
  phone?: string;              // 电话
  bed?: string;                // 床号
  createTime: string;          // 创建时间
}

// 临床检测结果模型
interface ClinicalResultRespVO {
  id: number;                  // 临床结果ID
  sampleId?: number;           // 样本ID
  diagnosis?: string;          // 临床表现/诊断
  result?: string;             // 结果说明
  wbc?: number;                // 白细胞计数
  lym?: number;                // 淋巴细胞
  gr?: number;                 // 中粒细胞
  crp?: number;                // C反应蛋白
  pct?: number;                // 血小板比积
  focusPathogen?: string;      // 重点关注病原体
  nucleicAcidConc?: number;    // 核酸浓度
  libraryConc?: number;        // 文库浓度
  getLrBatch?: string;         // 提取试剂批次
  putLrBatch?: string;         // 建库试剂批次
  onDeviceLr?: string;         // 上机试剂
  getTechnician?: string;      // 提取实验员
  putTechnician?: string;      // 建库实验员
  createTime: string;          // 创建时间
}

// 分析结果下载报告信息模型
interface AnalysisResultDownloadRespVO {
  id: number;                  // 结果ID
  taskId: number;              // 任务ID
  sampleId: number;            // 样本ID
  pathogenType: number;        // 病原类型
  pathogenCnSname?: string;    // 病原体中文名
  pathogenEnSname?: string;    // 病原体英文名
  pathogenCnGname?: string;    // 中文属名
  pathogenEnGname?: string;    // 英文属名
  levellingReads: string;      // 均一化reads数
  forecastConc: string;        // 微生物估测浓度等级
  virulenceType: number;       // 致病性分类
  subPathogen: string;         // 相关病原体
  pathogenComments: string;    // 病原体注释
}

// 下载报告耐药突变结果模型
interface AnalysisDownloadGmResultRespVO {
  id: number;                  // 结果ID
  taskId: number;              // 任务ID
  sampleId: number;            // 样本ID
  pathogenCnSname?: string;    // 病原体中文名
  levellingReads: string;      // 均一化reads数
  subPathogen?: string;        // 相关病原体
  pathogenComments?: string;   // 基因说明
  mutationRpm: number;         // 突变速度
  mutationRate: number;        // 突变率
  geneName?: string;           // 基因名称
  checkResult: string;         // 耐药位点检测结果
}

// 下载报告检测质控信息模型
interface AnalysisReportQCRespVO {
  rawReadsStatus?: number;     // 测序总序列数-质控状态
  waterStatus?: number;        // 阴性对照-质控状态
  plasmidRateStatus?: number;  // 内参-质控状态
  qthreeStatus?: number;       // 质量值>30的序列百分比状态
}

export interface AnalysisReportHistoryReqVO {
  examineeName?: string;       //受检人姓名
  phone?: string;              //受检人电话
  sampleId?: number;           //样本ID
  reportId?: number;           //样本ID
}