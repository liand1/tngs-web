
/**
 * 性别枚举
 * 1: 男
 * 2: 女
 * 0: 未知
 */
export enum SexEnum {
  MAN = 1,
  WOMAN = 2,
  UNKNOWN = 0,
}

/*样本类型（0：其他；1：肺泡灌洗液（BALF）；2：痰液；3：鼻/咽拭子；4：水控；） */
export enum SampleTypeEnum {
  OTHER = 0,
  BALF = 1,
  CROUP = 2,
  SWAB = 3,
  WATER_CONTROL = 4,
}


export const SampleTypeEnumMap = {
  [SampleTypeEnum.OTHER]: '其他',
  [SampleTypeEnum.BALF]: '肺泡灌洗液(BALF)',
  [SampleTypeEnum.CROUP]: '痰液',
  [SampleTypeEnum.SWAB]: '鼻/咽拭子',
  [SampleTypeEnum.WATER_CONTROL]: '水控'
}

export const SampleAnalysisStatus = {
  [1]: '未自动分析',
  [2]: '待自动分析',
  [3]: '已自动分析'
}

export const SampleChipStatus = {
  [0]: '未关联',
  [1]: '已关联'
}

export const SampleCheckReagent = {
  ['v1.0']: 'v1.0',
  ['v1.5']: 'v1.5',
  ['v1.2']: 'v1.2',
  ['v1.3']: 'v1.3',
}

/*检测项目（0：其他；1：tNGS一步法呼吸道; ） */
export enum CheckTypeEnum {
  ONE_STEP_TNGS_RESPIRATORY = 1,
  ONE_STEP_TNGS_TUBERCULOSIS = 2, // tNGS一步法结核
  OTHER = 0,
}

/*样本状态（0：未分析；1：已分析；2：无需分析；） */
export enum SampleStatusEnum {
  UNANALYZED = 0,
  ANALYZED = 1,
  NO_ANALYZE = 2,
}

/*来源类型（0：未知；1：手动创建；2：导入创建；） */
export enum SourceTypeEnum {
  UNKNOWN = 0,
  MANUAL_CREATION = 1,
  IMPORT_CREATION = 2,
}

/*质控结果（0：未知；1：合格；2：不合格；） */
export enum QcStatusEnum {
  UNKNOWN = 0,
  PASS = 1,
  FAIL = 2,
  WARNING = 3,
  NOT_ENABLED = 4,
}

/*质控类型（0：未知；1：芯片质控；2：分析任务质控；） */
export enum QcTypeEnum {
  UNKNOWN = 0,
  CHIP = 1,
  ANALYSIS_TASK = 2,
}

/**
 * 状态枚举
 */
export enum QcSettingsStatusEnum {
  DISABLED = 0, // 停用
  ENABLED = 1, // 启用
}


/**
 * 分析任务类型枚举
 */
export enum AnalysisTaskTypeEnum {
  OTHER = 0, // 其他
  ONE_STEP_TNGS_RESPIRATORY = 1, // tNGS一步法呼吸道
  ONE_STEP_TNGS_TUBERCULOSIS = 2, // tNGS一步法结核
}

/**
 * 深度挖掘状态枚举
 */
export enum ExcavateDeeplyEnum {
  NO = 0, // 否
  YES = 1, // 是
}

/**
 * 任务状态枚举 （0：已创建分析任务；1：等待分析；2：分析中；3：已完成分析；4：分析失败；）
 */
export enum TaskStatusEnum {
  CREATED = 0, // 已创建分析任务
  WAITING = 1, // 等待分析
  ANALYZING = 2, // 分析中
  COMPLETED = 3, // 已完成分析
  FAILED = 4, // 分析失败
}

/**
 * 审核状态枚举
 */
export enum CheckStatusEnum {
  UNKNOWN = 0, //无需审核
  WAITING = 1, // 待审核
  CHECKING = 2, // 审核中
  PASSED = 3, // 已通过
  REJECTED = 4, // 未通过
}

/**
 * 流程状态枚举
 * 1:1
 * 2:2,3,4
 * 3:5
 * 4:6,7
 * 5:8,9
 * 6:10
 * 11： 无需审核（水控）
 */
export enum ProcessStatusEnum {
  UNKNOWN = 0, // 未知
  CREATED = 1, // 已创建分析任务
  ANALYZING = 2, // 任务分析中
  FAILED = 3, // 任务分析失败
  WAIT_RESULT = 4, //等待生成结果
  RESULT_GENERATED = 5, // 生成分析结果
  FIRST_REVIEW_PASSED = 6, // 一审通过
  FIRST_REVIEW_REJECTED = 7, // 一审未通过
  SECOND_REVIEW_PASSED = 8, // 二审通过
  SECOND_REVIEW_REJECTED = 9, // 二审未通过
  REPORT_ISSUED = 10, // 出具报告
  NO_AUDIT = 11, // 无需审核
  REPORT_ISSUED_FAILED = 12, // 出具报告失败
  APPLY_AGAIN_REPORT_ISSUED = 13, //申请重出报告中
  AGAIN_REPORT_PENDING = 14, //重出报告中...
  AGAIN_REPORT_ISSUED = 15, // 重出报告成功
  AGAIN_REPORT_ISSUED_FAILED = 16, // 重出报告失败
}


/**
 * 芯片创建来源枚举
 * 用于标识芯片创建的来源类型
 */
export enum CreateTypeEnum {
  UNKNOWN = 0, // 未知
  MANUAL_CREATION = 1, // 手动创建
  FIXED_PATH_IMPORT = 2, // 固定路径导入
}

/**
 * 调用状态枚举
 * 用于标识芯片的调用状态
 */
export enum CallStatusEnum {
  NO = 0, // 否
  YES = 1, // 是
}

/**
 * 报告区域枚举
 * 用于标识病原体在报告中的显示区域
 */
export enum ByLabelEnum {
  UNKNOWN = 0, // 未知
  MAIN_REPORT = 1, // 主报告
  SUSPECT = 2, // 疑似病原体
  HIDDEN = 3, // 不展示
  BACKGROUND = 4, // 背景菌
  DRUG_RESISTANCE = 5, // 耐药
}

/**
 * 病原体类型枚举
 * 用于标识病原体的类型分类
 */
export enum PathogenTypeEnum {
  OTHER = 0, // 其他
  DNA_VIRUS = 1, // DNA病毒
  RNA_VIRUS = 2, // RNA病毒
  GRAM_POSITIVE = 3, // 革兰氏阳性菌
  GRAM_NEGATIVE = 4, // 革兰氏阴性菌
  BACTERIA = 5, // 菌属
  DRUG_RESISTANCE = 6, // 耐药基因
  SPECIAL_PATHOGEN = 7, // 特殊病原体
  FUNGUS = 8, // 真菌
  PLASMID_INTERNAL_REFERENCE = 9, // 质粒内参
  DRUG_RESISTANCE_MUTATION = 10, // 耐药突变
}

/**
 * 一审状态枚举
 * 用于标识报告的一审状态
 * (0,"无需审核"),(1,"待审核"),(2,"已通过"),(3,"不通过"),(4,"审核中");
 */
export enum OneAuditStatusEnum {
  NO_AUDIT = 0, // 无需审核
  WAITING = 1, // 待审核
  CHECKING = 2, // 审核中
  PASSED = 3, // 已通过
  REJECTED = 4, // 不通过

}



/**
 * 二审状态枚举
 * 用于标识报告的二审状态
 * (0,"无需审核"),(1,"待审核"),(2,"已通过"),(3,"不通过"),(4,"审核中");
 */
export enum TwoAuditStatusEnum {
  NO_AUDIT = 0, // 无需审核
  WAITING = 1, // 待审核
  CHECKING = 2, // 审核中
  PASSED = 3, // 已通过
  REJECTED = 4, // 不通过

}

/**
 * 审核领取类型枚举
 * 用于标识审核领取的类型
 * (0：未知；1：一审领取；2：二审领取)
 */
export enum AuditGetTypeEnum {
  UNKNOWN = 0, // 未知
  FIRST_AUDIT = 1, // 一审领取
  SECOND_AUDIT = 2, // 二审领取
}

/**
 * 测序长度枚举
 * 用于标识分析任务的测序长度
 */
export enum SeqLengthEnum {
  DEFAULT = 75, // 默认长度
  EXTENDED = 150 // 扩展长度
}

/**
 * 测序长度枚举中文映射
 */
export const SeqLengthEnumMap = {
  [SeqLengthEnum.DEFAULT]: '75bp',
  [SeqLengthEnum.EXTENDED]: '150bp'
};

// ======== 枚举的中文映射 ========

/**
 * 性别枚举中文映射
 */
export const SexEnumMap = {
  [SexEnum.MAN]: '男',
  [SexEnum.WOMAN]: '女',
  [SexEnum.UNKNOWN]: '未知'
};



/**
 * 检测项目枚举中文映射
 */
export const CheckTypeEnumMap = {
  [CheckTypeEnum.ONE_STEP_TNGS_RESPIRATORY]: 'tNGS一步法呼吸道',
  [CheckTypeEnum.ONE_STEP_TNGS_TUBERCULOSIS]: 'tNGS一步法结核',
  [CheckTypeEnum.OTHER]: '其他',
};

/**
 * 样本状态枚举中文映射
 */
export const SampleStatusEnumMap = {
  [SampleStatusEnum.UNANALYZED]: '未分析',
  [SampleStatusEnum.ANALYZED]: '已分析',
  [SampleStatusEnum.NO_ANALYZE]: '无需分析'
};

/**
 * 来源类型枚举中文映射
 */
export const SourceTypeEnumMap = {
  [SourceTypeEnum.UNKNOWN]: '未知',
  [SourceTypeEnum.MANUAL_CREATION]: '手动创建',
  [SourceTypeEnum.IMPORT_CREATION]: '导入创建'
};

/**
 * 质控结果枚举中文映射
 */
export const QcStatusEnumMap = {
  [QcStatusEnum.UNKNOWN]: '待分析完成',
  [QcStatusEnum.PASS]: '合格',
  [QcStatusEnum.FAIL]: '不合格',
  [QcStatusEnum.WARNING]: '预警'
};

/**
 * 分析任务类型枚举中文映射
 */
export const AnalysisTaskTypeEnumMap = {
  [AnalysisTaskTypeEnum.OTHER]: '其他',
  [AnalysisTaskTypeEnum.ONE_STEP_TNGS_RESPIRATORY]: 'tNGS一步法呼吸道',
  [AnalysisTaskTypeEnum.ONE_STEP_TNGS_TUBERCULOSIS]: 'tNGS一步法结核'
};

/**
 * 深度挖掘状态枚举中文映射
 */
export const ExcavateDeeplyEnumMap = {
  [ExcavateDeeplyEnum.NO]: '否',
  [ExcavateDeeplyEnum.YES]: '是'
};

/**
 * 任务状态枚举中文映射
 */
export const TaskStatusEnumMap = {
  [TaskStatusEnum.CREATED]: '已创建分析任务',
  [TaskStatusEnum.WAITING]: '等待分析',
  [TaskStatusEnum.ANALYZING]: '分析中',
  [TaskStatusEnum.COMPLETED]: '已完成分析',
  [TaskStatusEnum.FAILED]: '分析失败'
};

/**
 * 审核状态枚举中文映射
 */
export const CheckStatusEnumMap = {
  [CheckStatusEnum.UNKNOWN]: '无需审核',
  [CheckStatusEnum.WAITING]: '待审核',
  [CheckStatusEnum.CHECKING]: '审核中',
  [CheckStatusEnum.PASSED]: '已通过',
  [CheckStatusEnum.REJECTED]: '未通过'
};

/**
 * 流程状态枚举中文映射
 */
export const ProcessStatusEnumMap = {
  [ProcessStatusEnum.UNKNOWN]: '未知',
  [ProcessStatusEnum.CREATED]: '已创建分析任务',
  [ProcessStatusEnum.ANALYZING]: '任务分析中',
  [ProcessStatusEnum.FAILED]: '任务分析失败',
  [ProcessStatusEnum.WAIT_RESULT]: '等待生成结果',
  [ProcessStatusEnum.RESULT_GENERATED]: '生成分析结果',
  [ProcessStatusEnum.FIRST_REVIEW_PASSED]: '一审通过',
  [ProcessStatusEnum.FIRST_REVIEW_REJECTED]: '一审未通过',
  [ProcessStatusEnum.SECOND_REVIEW_PASSED]: '二审通过',
  [ProcessStatusEnum.SECOND_REVIEW_REJECTED]: '二审未通过',
  [ProcessStatusEnum.REPORT_ISSUED]: '出具报告',
  [ProcessStatusEnum.NO_AUDIT]: '无需审核',
  [ProcessStatusEnum.REPORT_ISSUED_FAILED]: '出具报告失败',
  [ProcessStatusEnum.AGAIN_REPORT_PENDING]: '重出报告中...',
  [ProcessStatusEnum.AGAIN_REPORT_ISSUED]: '重出报告',
  [ProcessStatusEnum.AGAIN_REPORT_ISSUED_FAILED]: '重出报告失败'
};


/**
 * 芯片创建来源枚举中文映射
 */
export const CreateTypeEnumMap = {
  [CreateTypeEnum.UNKNOWN]: '未知',
  [CreateTypeEnum.MANUAL_CREATION]: '手动创建',
  [CreateTypeEnum.FIXED_PATH_IMPORT]: '导入创建'
};

/**
 * 调用状态枚举中文映射
 */
export const CallStatusEnumMap = {
  [CallStatusEnum.NO]: '否',
  [CallStatusEnum.YES]: '是'
};

/**
 * 报告区域枚举中文映射
 */
export const ByLabelEnumMap = {
  [ByLabelEnum.UNKNOWN]: '-',
  [ByLabelEnum.MAIN_REPORT]: '主报告',
  [ByLabelEnum.SUSPECT]: '疑似病原体',
  [ByLabelEnum.HIDDEN]: '不展示',
  [ByLabelEnum.BACKGROUND]: '不展示（背景）',
  [ByLabelEnum.DRUG_RESISTANCE]: '耐药'
};

export const mutationCodeType = {
  [0]: '-',
  [1]: '不展示',
  [2]: '主报告'
}

/**
 * 病原体类型枚举中文映射
 */
export const PathogenTypeEnumMap = {
  [PathogenTypeEnum.OTHER]: '其他',
  [PathogenTypeEnum.DNA_VIRUS]: 'DNA病毒',
  [PathogenTypeEnum.RNA_VIRUS]: 'RNA病毒',
  [PathogenTypeEnum.GRAM_POSITIVE]: '革兰氏阳性菌',
  [PathogenTypeEnum.GRAM_NEGATIVE]: '革兰氏阴性菌',
  [PathogenTypeEnum.BACTERIA]: '菌属',
  [PathogenTypeEnum.DRUG_RESISTANCE]: '耐药基因',
  [PathogenTypeEnum.SPECIAL_PATHOGEN]: '特殊病原体',
  [PathogenTypeEnum.FUNGUS]: '真菌',
  [PathogenTypeEnum.PLASMID_INTERNAL_REFERENCE]: '质粒内参',
  [PathogenTypeEnum.DRUG_RESISTANCE_MUTATION]: '耐药突变'
};

/**
 * 一审状态枚举中文映射
 */
export const OneAuditStatusEnumMap = {
  [OneAuditStatusEnum.NO_AUDIT]: '无需审核',
  [OneAuditStatusEnum.WAITING]: '待审核',
  [OneAuditStatusEnum.CHECKING]: '审核中',
  [OneAuditStatusEnum.PASSED]: '已通过',
  [OneAuditStatusEnum.REJECTED]: '不通过'

};

/**
 * 二审状态枚举中文映射
 */
export const TwoAuditStatusEnumMap = {
  [TwoAuditStatusEnum.NO_AUDIT]: '无需审核',
  [TwoAuditStatusEnum.WAITING]: '待审核',
  [TwoAuditStatusEnum.CHECKING]: '审核中',
  [TwoAuditStatusEnum.PASSED]: '已通过',
  [TwoAuditStatusEnum.REJECTED]: '不通过'

};

/**
 * 审核领取类型枚举中文映射
 */
export const AuditGetTypeEnumMap = {
  [AuditGetTypeEnum.UNKNOWN]: '未知',
  [AuditGetTypeEnum.FIRST_AUDIT]: '一审领取',
  [AuditGetTypeEnum.SECOND_AUDIT]: '二审领取'
};

/**
 * 重建来源类型枚举
 * 用于标识分析任务重建的来源类型
 */
export enum RebuildObjectTypeEnum {
  OTHER = 0, // 其他
  ANALYSIS_TASK = 1, // 分析任务
  SOC = 2, // 芯片
  SAMPLE = 3, // 样本
}

/**
 * 重建来源类型枚举中文映射
 */
export const RebuildObjectTypeEnumMap = {
  [RebuildObjectTypeEnum.OTHER]: '其他',
  [RebuildObjectTypeEnum.ANALYSIS_TASK]: '分析任务',
  [RebuildObjectTypeEnum.SOC]: '芯片',
  [RebuildObjectTypeEnum.SAMPLE]: '样本',
};

/**
 * 文档类型枚举
 * 用于标识文档的类型
 */
export enum DocTypeEnum {
  USER_MANUAL = 1, // 使用手册
  AUDIT_RELATED = 2, // 审核相关
  DATA_RELATED = 3, // 数据相关
}

/**
 * 文档类型枚举中文映射
 */
export const DocTypeEnumMap = {
  [DocTypeEnum.USER_MANUAL]: '使用手册',
  [DocTypeEnum.AUDIT_RELATED]: '审核相关',
  [DocTypeEnum.DATA_RELATED]: '数据相关',
};

/**
 * 文档状态枚举
 * 用于标识文档的状态
 */
export enum DocStatusEnum {
  CLOSED = 0, // 关闭
  NORMAL = 1, // 正常
}

/**
 * 文档状态枚举中文映射
 */
export const DocStatusEnumMap = {
  [DocStatusEnum.CLOSED]: '关闭',
  [DocStatusEnum.NORMAL]: '正常',
};


export enum virulenceTypeEnum {
  UNKNOWN = 0,
  A = 1,
  B = 2
}

export const virulenceTypeEnumMap = {
  [virulenceTypeEnum.UNKNOWN]: '未知',
  [virulenceTypeEnum.A]: 'A',
  [virulenceTypeEnum.B]: 'B'
}

//	样本关联状态（0：未关联；1：已关联；）
export enum SampleRelationStatusEnum {
  NOT_RELATED = 0,
  RELATED = 1
}


export const SampleRelationStatusEnumMap = {
  [SampleRelationStatusEnum.NOT_RELATED]: '未关联',
  [SampleRelationStatusEnum.RELATED]: '已关联'
}

//MD5完整性-校验状态（0：不完整；1：完整；2:无需验证;）
export enum MD5IntegrityStatusEnum {
  INCOMPLETE = 0,
  COMPLETE = 1,
  NO_VERIFICATION = 2
}

export const MD5IntegrityStatusEnumMap = {
  [MD5IntegrityStatusEnum.INCOMPLETE]: '不完整',
  [MD5IntegrityStatusEnum.COMPLETE]: '完整',
  [MD5IntegrityStatusEnum.NO_VERIFICATION]: '无需验证'
}

//文件上传状态（0：等待上传；1：上传中；2：已完成；） 
export enum FileUploadStatusEnum {
  WAITING = 0,
  UPLOADING = 1,
  COMPLETED = 2
}
export const FileUploadStatusEnumMap = {
  [FileUploadStatusEnum.WAITING]: '等待上传',
  [FileUploadStatusEnum.UPLOADING]: '上传中',
  [FileUploadStatusEnum.COMPLETED]: '已完成'
}

//（1：新增芯片；2：手动上传补全芯片；3：自动上传新增芯片；4：自动上传补全芯片；）
export enum UploadTypeEnum {
  ADD_SOC = 1,
  MANUAL_UPLOAD_COMPLETE_SOC = 2,
  AUTO_UPLOAD_ADD_SOC = 3,
  AUTO_UPLOAD_COMPLETE_SOC = 4
}

/**
 * 文件完整性校验状态（0：等待校验；1：校验中；2：校验通过；3：校验未通过（文件缺失）；）
 */
export enum FileIntegrityCheckStatusEnum {
  WAITING = 0,
  CHECKING = 1,
  PASSED = 2,
  FAILED = 3
}
export const FileIntegrityCheckStatusEnumMap = {
  [FileIntegrityCheckStatusEnum.WAITING]: '等待校验',
  [FileIntegrityCheckStatusEnum.CHECKING]: '校验中',
  [FileIntegrityCheckStatusEnum.PASSED]: '校验通过',
  [FileIntegrityCheckStatusEnum.FAILED]: '校验未通过（文件缺失）'
}


/**
 * 用户角色枚举
 * 用于标识用户的角色
 */
export enum UserRoleEnum {
  SUPER_ADMIN = "super_admin", // 超级管理员
  TENANT_ADMIN = "tenant_admin", // 租户管理员
  CRM_ADMIN = "crm_admin", // CRM 管理员
  SYSTEM_ADMIN = "sys_admin", // 系统管理员
}

export const UserRoleEnumMap = {
  [UserRoleEnum.SUPER_ADMIN]: '超级管理员',
  [UserRoleEnum.TENANT_ADMIN]: '租户管理员',
  [UserRoleEnum.CRM_ADMIN]: 'CRM 管理员',
  [UserRoleEnum.SYSTEM_ADMIN]: '系统管理员',
}

/**
 * 是否被分析
 *  0,"未分析",
    1,"已分析"),
    2,"无需分析";
 */
export enum SampleStatusEnum {
  NO_ANALYSIS = 0,
  FINISH_ANALYSIS = 1,
  NO_NEED_ANALYSIS = 2,
}

export const SampleStatusMap = {
  [SampleStatusEnum.NO_ANALYSIS]: '未分析',
  [SampleStatusEnum.FINISH_ANALYSIS]: '已分析',
  [SampleStatusEnum.NO_NEED_ANALYSIS]: '无需分析'
}

//文件响应类型：
// 1-下载
// 2-预览
export enum FileResponseTypeEnum {
  DOWNLOAD = 1,
  PREVIEW = 2,
}

export const FileResponseTypeMap = {
  [FileResponseTypeEnum.DOWNLOAD]: '下载',
  [FileResponseTypeEnum.PREVIEW]: '预览',
}

