import { ExcelData } from "@/components/Excel";
import { BasicColumn } from "@/components/Table";
import { useMessage } from "@/hooks/web/useMessage";
import { SampleDataModel } from "../../model";
import { createBatch } from "@/api/lims/sample";
import { CheckTypeEnum, SampleStatusEnum, SampleTypeEnum, SexEnum, SourceTypeEnum } from "@/enums/customEnum";


// 导入样本
export async function handleSampleImport(importData: ExcelData[]) {
  // const { createMessage } = useMessage();

  const submitData: SampleDataModel[] = loadDataSuccess(importData);

  return submitData;

  // try {
  //   // 提交导入数据
  //   const res = await createBatch(submitData);

  //   createMessage.success("样本导入成功");

  //   return res;
  // } catch (error: any) {
  //   console.error("样本导入失败:", error);
  //   createMessage.error("样本导入失败：" + (error.message || "未知错误"));
  //   throw error;
  // }
}

//采样日期的处理  
// 20250220  
// 处理日期格式 20250220 转换为13位时间戳
const parseDateString = (dateStr: string): number => {
  if (!dateStr || dateStr.length !== 8) {
    return 0;
  }

  // 解析 YYYYMMDD 格式
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // 月份从0开始
  const day = parseInt(dateStr.substring(6, 8));

  // 创建日期对象并返回13位时间戳
  const date = new Date(year, month, day);
  return date.getTime();
};



//映射excel数据
export function loadDataSuccess(excelDataList: ExcelData[]) {
  const ExcelData: any[] = [];
  const EID: SampleDataModel[] = [];
  const { createMessage } = useMessage();

  
  // 遍历Excel数据
  for (const excelData of excelDataList) {
    const {
      header,
      results,
      meta: { sheetName },
    } = excelData;
    const columns: BasicColumn[] = [];
    for (const title of header) {
      columns.push({ title, dataIndex: title });
    }
    ExcelData.push({ title: sheetName, dataSource: results, columns });

    // 根据 sheetName 将数据映射到对应的对象中
    if (sheetName === '样本信息表') {
      // 检查是否存在缺失必要字段的行
      for (let i = 0; i < results.length; i++) {
        const row = results[i];

        // 检查该行是否所有值去除空格后都为空
        const isEmpty = Object.values(row).every((value) => {
          // 跳过undefined或null值
          if (value === undefined || value === null) {
            return true;
          }
          // 转换为字符串并去除空格，检查是否为空字符串
          return value.toString().trim() === '';
        });

        // 如果该行所有值都为空，则跳过该行
        if (isEmpty) {
          continue;
        }



        // 验证必填字段
        // if (!row['批次编号']) {
        //   createMessage.error(`第${i + 2}行数据"批次编号"不能为空，请检查导入数据`);
        //   return [];
        // }
        // if (!row['患者ID']?.toString().trim()) {
        //   createMessage.error(`第${i + 2}行数据"患者ID"不能为空，请检查导入数据`);
        //   return [];
        // }
        if (!row['样本编号']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"样本编号"不能为空，请检查导入数据`);
          return [];
        }
        // if (!row['防错标签']?.toString().trim()) {
        //   createMessage.error(`第${i + 2}行数据"防错标签"不能为空，请检查导入数据`);
        //   return [];
        // }
        if (!row['样本类型']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"样本类型"不能为空，请检查导入数据`);
          return [];
        }
        if (!row['检测项目']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"检测项目"不能为空，请检查导入数据`);
          return [];
        }
        if (!row['检测试剂']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"检测试剂"不能为空，请检查导入数据`);
          return [];
        }
        if(row['检测项目']?.toString().trim() == 'tNGS一步法呼吸道') {
          let checkReagent = row['检测试剂']?.toString().trim();
          if(!['v1.0', 'v1.5'].includes(checkReagent)) {
            createMessage.error(`第${i + 2}行数据"检测项目"为"tNGS一步法呼吸道"时，检测试剂只能选择v1.0或者v1.5`);
            return [];
          }
        } else if(row['检测项目']?.toString().trim() == 'tNGS一步法结核') {
          let checkReagent = row['检测试剂']?.toString().trim();
          if(!['v1.2', 'v1.3'].includes(checkReagent)) {
            createMessage.error(`第${i + 2}行数据"检测项目"为"tNGS一步法结核"时，检测试剂只能选择v1.2或者v1.3`);
            return [];
          }
        }
      }

      // 为每一行数据创建一个新的 SampleDataModel 对象
      for (const row of results) {
        // 检查该行是否所有值去除空格后都为空
        const isEmpty = Object.values(row).every((value) => {
          // 跳过undefined或null值
          if (value === undefined || value === null) {
            return true;
          }
          // 转换为字符串并去除空格，检查是否为空字符串
          return value.toString().trim() === '';
        });

        // 如果该行所有值都为空，则跳过该行
        if (isEmpty) {
          continue;
        }


        // 处理样本类型转换
        let sampleTypeValue = SampleTypeEnum.OTHER;
        const sampleTypeStr = row['样本类型']?.toString().trim();
        if (sampleTypeStr) {
          if (sampleTypeStr.includes('肺泡灌洗液') || sampleTypeStr.includes('BALF')) {
            sampleTypeValue = SampleTypeEnum.BALF;
          } else if (sampleTypeStr.includes('痰液')) {
            sampleTypeValue = SampleTypeEnum.CROUP;
          } else if (sampleTypeStr.includes('鼻/咽拭子')) {
            sampleTypeValue = SampleTypeEnum.SWAB;
          } else if (sampleTypeStr.includes('水控')) {
            sampleTypeValue = SampleTypeEnum.WATER_CONTROL;
          } else {
            sampleTypeValue = SampleTypeEnum.OTHER;
          }
        }

        // 处理检测项目转换
        let checkTypeValue = CheckTypeEnum.OTHER;
        const checkTypeStr = row['检测项目']?.toString().trim();
        if (checkTypeStr) {
          if (checkTypeStr.includes('tNGS一步法呼吸道')) {
            checkTypeValue = CheckTypeEnum.ONE_STEP_TNGS_RESPIRATORY;
          } else if (checkTypeStr.includes('tNGS一步法结核')) {
            checkTypeValue = CheckTypeEnum.ONE_STEP_TNGS_TUBERCULOSIS;
          } else {
            checkTypeValue = CheckTypeEnum.OTHER;
          }
        }
        

        //处理样本量
        let sampleVolumeValue = 0;
        const sampleVolumeStr = row['样本量']?.toString().trim();
        if (sampleVolumeStr) {
          // 10ml
          // 从样本量字符串中提取数字部分
          const numericValue = sampleVolumeStr.replace(/[^\d.]/g, '');
          sampleVolumeValue = numericValue ? parseFloat(numericValue) : 0;
        }

        //处理采样日期
        let samplingDateValue = 0;
        const samplingDateStr = row['采样日期']?.toString().trim();
        if (samplingDateStr) {
          if (samplingDateStr.length === 8) {
            samplingDateValue = parseDateString(samplingDateStr);
          } else {
            samplingDateValue = new Date(samplingDateStr).getTime();
          }
          // 确保采样日期是13位时间戳
          if (samplingDateValue > 0 && samplingDateValue.toString().length < 13) {
            // 如果是10位时间戳（秒级），转换为13位（毫秒级）
            samplingDateValue = samplingDateValue * 1000;
          }
        }

        //接收日期的处理
        let collectDateValue = 0;
        const collectDateStr = row['接收日期']?.toString().trim();
        if (collectDateStr) {
          if (collectDateStr.length === 8) {
            collectDateValue = parseDateString(collectDateStr);
          } else {
            collectDateValue = new Date(collectDateStr).getTime();
          }
          // 确保采样日期是13位时间戳
          if (collectDateValue > 0 && collectDateValue.toString().length < 13) {
            // 如果是10位时间戳（秒级），转换为13位（毫秒级）
            collectDateValue = collectDateValue * 1000;
          }
        }


        const currentEID: SampleDataModel = {
          // batchCode: (row['批次编号'] ?? '').trim(),
          sampleCode: (row['样本编号'] ?? '').toString().trim(),
          sourceCode: (row['样本原编号'] ?? '').toString().trim(),
          i5Code: (row['I5编号'] ?? '').toString().trim(),
          i7Code: (row['I7编号'] ?? '').toString().trim(),
          sampleType: sampleTypeValue,
          sampleVolume: sampleVolumeValue ?? 0,
          checkType: checkTypeValue,
          checkReagent: row['检测试剂']?.toString().trim(),
          waterControl: (row['水控'] ?? '').toString().trim(),
          subDoctor: (row['送检医师'] ?? '').toString().trim(),
          subHospital: (row['送检单位'] ?? '').toString().trim(),
          subRoom: (row['送检科室'] ?? '').toString().trim(),
          samplingDate: samplingDateValue ?? 0,
          collectDate: collectDateValue ?? 0,
          failSafeTag: (row['防错标签'] ?? '').toString().trim(),
          createType: SourceTypeEnum.IMPORT_CREATION,
          sampleStatus: SampleStatusEnum.UNANALYZED,
          examineeName: (row['姓名'] ?? '').toString().trim(),
          remark: (row['备注'] ?? '').toString().trim(),

          clinicalResult: {
            crp: Number((row['CRP(mg/L)'] ?? '').toString().trim()) || 0,
            pct: Number((row['PCT(ng/ml)'] ?? '').toString().trim()) || 0,
            wbc: Number((row['WBC(10^9/L)'] ?? '').toString().trim()) || 0,
            onDeviceLr: (row['上机试剂'] ?? '').toString().trim(),
            gr: Number((row['中粒细胞(%)'] ?? '').toString().trim()) || 0,
            diagnosis: (row['临床表现'] ?? '').toString().trim(),
            putLrBatch: (row['建库试剂批次'] ?? '').toString().trim(),
            getTechnician: (row['提取实验员'] ?? '').toString().trim(),
            getLrBatch: (row['提取试剂批次'] ?? '').toString().trim(),
            libraryConc: Number((row['文库浓度'] ?? '').toString().trim()) || 0,
            nucleicAcidConc: Number((row['核酸浓度'] ?? '').toString().trim()) || 0,
            result: (row['检测结果'] ?? '').toString().trim(),
            focusPathogen: (row['重点关注病原体'] ?? '').toString().trim(),
            lym: Number((row['淋巴细胞(%)'] ?? '').toString().trim()) || 0,
            putTechnician: (row['建库实验员'] ?? '').toString().trim(),
          },
          examinee: {
            patientNumber: (row['住院号'] ?? '').toString().trim(),
            name: (row['姓名'] ?? '').toString().trim(),
            age: Number((row['年龄'] ?? '').toString().trim()) || 0,
            bed: (row['床号'] ?? '').toString().trim(),
            sex: (row['性别'] ?? '').toString().trim() === '男' ? SexEnum.MAN : (row['性别'] ?? '').toString().trim() === '女' ? SexEnum.WOMAN : SexEnum.UNKNOWN,
            phone: (row['联系电话'] ?? '').toString().trim(),
            id: 0,
          }
        };
        EID.push(currentEID);
      }
    }
  }

  if (EID.length === 0) {
    createMessage.error('没有数据导入');
    return [];
  }

  // console.log('Excel data processed:', ExcelData);
  // console.log('Mapped EID data:', EID);

  return EID;
}