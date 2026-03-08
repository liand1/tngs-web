import { ExcelData } from "@/components/Excel";
import { BasicColumn } from "@/components/Table";
import { useMessage } from "@/hooks/web/useMessage";
import { CheckTypeEnum, SampleStatusEnum, SampleTypeEnum, SexEnum, SourceTypeEnum } from "@/enums/customEnum";
import { SampleDataModel } from "@/views/lims/sample/model";


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
        // 验证必填字段
        // if (!row['批次编号']) {
        //   createMessage.error(`第${i + 2}行数据"批次编号"不能为空，请检查导入数据`);
        //   return [];
        // }
        if (!row['样本编号']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"样本编号"不能为空，请检查导入数据`);
          return [];
        }
        if (!row['防错标签']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"防错标签"不能为空，请检查导入数据`);
          return [];
        }
        if (!row['样本类型']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"样本类型"不能为空，请检查导入数据`);
          return [];
        }
        if (!row['检测项目']?.toString().trim()) {
          createMessage.error(`第${i + 2}行数据"检测项目"不能为空，请检查导入数据`);
          return [];
        }
      }

      // 为每一行数据创建一个新的 SampleDataModel 对象
      for (const row of results) {
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

        //采样日期的处理
        let samplingDateValue = 0;
        const samplingDateStr = row['采样日期']?.toString().trim();
        if (samplingDateStr) {
          samplingDateValue = new Date(samplingDateStr).getTime();
        // 确保采样日期是13位时间戳
        if (samplingDateValue > 0 && samplingDateValue.toString().length < 13) {
          // 如果是10位时间戳（秒级），转换为13位（毫秒级）
          samplingDateValue = samplingDateValue * 1000;
        }
        }


        const currentEID: SampleDataModel = {
          batchCode: row['批次编号'] || '',
          sampleCode: row['Sample'] || '',
          sourceCode: row['样本原编号'] || '',
          i5Code: row['I5编号'] || '',
          i7Code: row['I7编号'] || '',
          sampleType: sampleTypeValue,
          sampleVolume: sampleVolumeValue || 0,
          checkType: checkTypeValue,
          waterControl: row['水控'] || '',
          subDoctor: row['送检医师'] || '',
          subHospital: row['送检单位'] || '',
          subRoom: row['送检科室'] || '',
          samplingDate: samplingDateValue || 0,
          failSafeTag: row['防错标签'] || '',
          createType: SourceTypeEnum.IMPORT_CREATION,
          sampleStatus: SampleStatusEnum.UNANALYZED,
          examineeName: row['受检人名称'] || '',

          clinicalResult: {
            crp: Number(row['CRP(mg/L)']) || 0,
            pct: Number(row['PCT(ng/ml)']) || 0,
            wbc: Number(row['WBC(10^9/L)']) || 0,
            onDeviceLr: row['上机试剂'] || '',
            gr: Number(row['中粒细胞(%)']) || 0,
            diagnosis: row['临床表现'] || '',
            putLrBatch: row['建库试剂批次'] || '',
            getTechnician: row['提取实验员'] || '',
            getLrBatch: row['提取试剂批次'] || '',
            libraryConc: Number(row['文库浓度']) || 0,
            nucleicAcidConc: Number(row['核酸浓度']) || 0,
            result: row['检测结果'] || '',
            focusPathogen: row['重点关注病原体'] || '',
            lym: Number(row['淋巴细胞(%)']) || 0,
            putTechnician: row['建库实验员'] || '',
            remark: row['备注'] || '',
          },
          examinee: {
            patientNumber: row['住院号'] || '',
            name: row['姓名'] || '',
            age: Number(row['年龄']) || 0,
            bed: row['床号'] || '',
            sex: row['性别'] === '男' ? SexEnum.MAN : (row['性别'] === '女' ? SexEnum.WOMAN : SexEnum.UNKNOWN),
            phone: row['联系电话'] || '',
            id: 0,
          }
        };
        EID.push(currentEID);
      }
    }
  }


  // console.log('Excel data processed:', ExcelData);
  // console.log('Mapped EID data:', EID);

  return EID;
}