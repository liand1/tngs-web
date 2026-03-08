import { AnalysisReportDownloadRespVO } from "@/api/lims/analysisreport/model";

//配置报告模板 模拟数据
export let analysisReportDownloadRespVODemo: AnalysisReportDownloadRespVO = {
  // 样本信息
  sample: {
    id: 1001,
    socId: 2001,
    socDataId: 3001,
    batchCode: "B20230615001",
    sourceCode: "SC20230615001",
    sampleCode: "S20230615001",
    failSafeTag: "FST001",
    sampleType: 1, // 肺泡灌洗液
    checkType: 1, // tNGS一步法呼吸道
    waterControl: "WC001",
    i7Code: "I7-001",
    i5Code: "I5-001",
    sampleVolume: 2.5,
    sampleUnit: "ml",
    samplingDate: Date.now() - 86400000 * 2, // 2天前
    subHospital: "协和医院",
    subRoom: "呼吸科",
    subDoctor: "张医生",
    collectDate: Date.now() - 86400000, // 1天前
    createType: 1,
    createTime: new Date().toISOString(),
    sampleStatus: 1,
    remark: "样本状态良好",
    examineeName: "王患者",
    examinee: {
      id: 5001,
      sampleId: 1001,
      name: "王患者",
      sex: 1, // 男
      age: 45,
      patientNumber: "P20230615001",
      phone: "13812345678",
      bed: "2号床",
      createTime: new Date().toISOString()
    },
    clinicalResult: {
      id: 6001,
      sampleId: 1001,
      diagnosis: "65℃ 发热、咳嗽、气促",
      result: "疑似肺部感染",
      wbc: 10.5,
      lym: 1.2,
      gr: 8.5,
      crp: 45.6,
      pct: 0.2,
      focusPathogen: "肺炎链球菌",
      nucleicAcidConc: 15.3,
      libraryConc: 25.7,
      getLrBatch: "GB20230615",
      putLrBatch: "PB20230615",
      onDeviceLr: "OD20230615",
      getTechnician: "李技师",
      putTechnician: "王技师",
      createTime: new Date().toISOString()
    }
  },

  // 分析结果(细菌)列表
  bacteriaResults: [
    {
      id: 101,
      taskId: 201,
      sampleId: 1001,
      pathogenType: 1, // 细菌
      pathogenCnSname: "肺炎链球菌",
      pathogenEnSname: "Streptococcus pneumoniae",
      pathogenCnGname: "链球菌属",
      pathogenEnGname: "Streptococcus",
      levellingReads: "15000",
      forecastConc: "中等",
      virulenceType: 2,
      subPathogen: "肺炎",
      pathogenComments: "常见上呼吸道感染病原体，可引起肺炎、中耳炎等疾病"
    },
    {
      id: 102,
      taskId: 201,
      sampleId: 1001,
      pathogenType: 1, // 细菌
      pathogenCnSname: "流感嗜血杆菌",
      pathogenEnSname: "Haemophilus influenzae",
      pathogenCnGname: "嗜血杆菌属",
      pathogenEnGname: "Haemophilus",
      levellingReads: "8000",
      forecastConc: "低",
      virulenceType: 1,
      subPathogen: "呼吸道感染",
      pathogenComments: "可引起支气管炎、肺炎等呼吸道感染"
    }
  ],

  // 分析结果(真菌)列表
  fungusResults: [
    {
      id: 201,
      taskId: 201,
      sampleId: 1001,
      pathogenType: 2, // 真菌
      pathogenCnSname: "白念珠菌",
      pathogenEnSname: "Candida albicans",
      pathogenCnGname: "念珠菌属",
      pathogenEnGname: "Candida",
      levellingReads: "500",
      forecastConc: "极低",
      virulenceType: 1,
      subPathogen: "真菌感染",
      pathogenComments: "常见条件致病真菌，免疫力低下时可致病"
    }
  ],

  // 分析结果(病毒)列表
  virusResults: [
    {
      id: 301,
      taskId: 201,
      sampleId: 1001,
      pathogenType: 3, // 病毒
      pathogenCnSname: "流感病毒",
      pathogenEnSname: "Influenza virus",
      pathogenCnGname: "正粘病毒科",
      pathogenEnGname: "Orthomyxoviridae",
      levellingReads: "20000",
      forecastConc: "高",
      virulenceType: 3,
      subPathogen: "流感",
      pathogenComments: "可引起季节性流感，具有高度传染性"
    }
  ],

  // 分析结果(菌属及其他)列表
  otherResults: [
    {
      id: 401,
      taskId: 201,
      sampleId: 1001,
      pathogenType: 4, // 其他
      pathogenCnSname: "支原体肺炎",
      pathogenEnSname: "Mycoplasma pneumoniae",
      pathogenCnGname: "支原体属",
      pathogenEnGname: "Mycoplasma",
      levellingReads: "12000",
      forecastConc: "中等",
      virulenceType: 2,
      subPathogen: "非典型性肺炎",
      pathogenComments: "常见非典型肺炎病原体，对青少年和儿童易感"
    }
  ],

  // 检出耐药基因列表
  genes: [
    {
      id: 501,
      taskId: 201,
      sampleId: 1001,
      pathogenType: 5, // 耐药基因
      pathogenCnSname: "β-内酰胺酶",
      pathogenEnSname: "Beta-lactamase",
      pathogenCnGname: "耐药基因",
      pathogenEnGname: "Resistance gene",
      levellingReads: "5000",
      forecastConc: "中等",
      virulenceType: 2,
      subPathogen: "β-内酰胺类抗生素耐药",
      pathogenComments: "可水解β-内酰胺类抗生素"
    }
  ],

  // 检出耐药突变位点列表
  geneMutationss: [
    {
      id: 601,
      taskId: 201,
      sampleId: 1001,
      drugGene: "gyrA",
      levellingReads: "2500",
      mutation: "S83L",
      mutationCount: 125,
      mutationRpm: 50,
      mutationRate: 0.85,
      mutationType: 1,
      relatedPathogen: "肺炎链球菌",
      annotation: "喹诺酮类抗生素耐药相关突变"
    }
  ],

  // 疑似病原体列表
  suspecteds: [
    {
      id: 701,
      taskId: 201,
      sampleId: 1001,
      pathogenType: 6, // 疑似
      pathogenCnSname: "铜绿假单胞菌",
      pathogenEnSname: "Pseudomonas aeruginosa",
      pathogenCnGname: "假单胞菌属",
      pathogenEnGname: "Pseudomonas",
      levellingReads: "300",
      forecastConc: "极低",
      virulenceType: 1,
      subPathogen: "呼吸道感染",
      pathogenComments: "疑似污染或低水平感染"
    }
  ],

  // 临床建议列表
  clinicals: {
    "general": "建议根据检测结果选择敏感抗生素进行治疗",
    "bacteria": "考虑使用青霉素类抗生素针对肺炎链球菌感染",
    "virus": "考虑使用奥司他韦等抗病毒药物",
    "fungi": "无需抗真菌治疗",
    "resistance": "注意β-内酰胺类抗生素可能存在耐药性"
  },

  // 质控报告
  qcReport: {
    rawReadsStatus: 1, // 合格
    waterStatus: 1, // 合格
    plasmidRateStatus: 1, // 合格
    qthreeStatus: 1, // 合格
  },

  // 检出阳性病原名称列表
  outPathogenNames: ["肺炎链球菌", "流感嗜血杆菌", "流感病毒"],

  geneResultDOS: [{
    drugGene: "gyrB",
    aminoMutation: "p.Asp461Asn",
    mutationRate: "25",
    annotation: "与抗结核二线药物氟喹诺酮(FQ)耐药相关",
    whoRating: "WHO1级",
  },{
    drugGene: "rrs",
    aminoMutation: "n.1402C>A",
    mutationRate: "15.13",
    annotation: "与抗结核二线药物卡那霉素(Km)、阿米卡星(Am)卷曲霉素(Cm)内耐药相关",
    whoRating: "#N/A",
  },{
    drugGene: "rrs",
    aminoMutation: "n.1402C>T",
    mutationRate: "10.51",
    annotation: "与抗结核二线药物卡那霉素(Km)、阿米卡星(Am)卷曲霉素(Cm)内耐药相关",
    whoRating: "WHO2级",
  }],

  geneResultDOS2: [{
    drugGene: "MAB_4384",
    aminoMutation: "n.R9fs",
    mutationRate: "26.13",
    annotation: "与抗结核二线药物利奈唑胺(Lzd)耐药相关",
    whoRating: "脓肿分枝杆菌脓肿亚种",
  }],

  mutationDOS: [{
    gene: "NAT2*6/*6",
    dntMutation: "590G>A/590G>A",
    aminoMutation: "R197Q/R197Q",
    phenotype: "慢代谢型",
    result: "疗效较好，毒副作用较高",
  }],
};