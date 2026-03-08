<template>
  <a-upload-dragger
    v-model:fileList="formData.fileList"
    name="file"
    :multiple="false"
    @change="handleChange"
    :customRequest="customRequest"
  >
    <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <p class="ant-upload-text" style="font-weight: 400;">点击或拖动文件到区域上传</p>
    <p class="ant-upload-hint">
      一次仅支持上传一份样本文件<br/>上传格式仅支持.xlsx,.xls格式的Excel文件
    </p>
  </a-upload-dragger>
</template>
<script lang="ts" setup>
import { ref, unref, reactive } from "vue";
import * as XLSX from "xlsx";
import type { ExcelData } from "@/components/Excel/src/typing";
import type { UploadChangeParam } from 'ant-design-vue';
import { dateUtil } from "@/utils/dateUtil";
import { SampleDataModel } from "../../model";
import { handleSampleImport } from "./index";

const props = defineProps({
  // 日期时间格式。如果不提供或者提供空值，将返回原始Date对象
  dateFormat: {
    type: String,
  },
  // 时区调整。实验性功能，仅为了解决读取日期时间值有偏差的问题。目前仅提供了+08:00时区的偏差修正值
  // https://github.com/SheetJS/sheetjs/issues/1470#issuecomment-501108554
  timeZone: {
    type: Number,
    default: 8,
  },
  // 是否直接返回选中文件
  isReturnFile: {
    type: Boolean,
    default: false,
  },
});
// 表单数据
const formData = ref<{
  batchCode: string;
  fileList: {
    id: number;
    name: string;
    files: SampleDataModel[];
  }[];
}>({
  batchCode: "",
  fileList: [],
});

const emit = defineEmits(["success", "error", "cancel"]);

const loadingRef = ref<boolean>(false);

const handleChange = (info: UploadChangeParam) => {
  console.log(info);
}

const customRequest = async (options) => {
  try {
    let result = await readerData(options.file);
    if(result) {
      const submitData = await handleSampleImport(result);
      if (submitData.length > 0) {
        emit("success", {
          fileName: options.file.name,
          excelData: result
        });
        return options.onSuccess();
      } else {
        formData.value.fileList = [];
      }
    } else {
      emit("error");
      formData.value.fileList = [];
    }
  } catch(err) {
    emit("error");
    formData.value.fileList = [];
  }
}

function shapeWorkSheel(sheet: XLSX.WorkSheet, range: XLSX.Range) {
  let str = " ";
  let char = 65;
  let customWorkSheet = {
    t: "s",
    v: str,
    r: '<t> </t><phoneticPr fontId="1" type="noConversion"/>',
    h: str,
    w: str,
  };
  if (!sheet || !sheet["!ref"]) return [];
  let c = 0;
  let r = 1;
  while (c < range.e.c + 1) {
    while (r < range.e.r + 1) {
      if (!sheet[String.fromCharCode(char) + r])
        sheet[String.fromCharCode(char) + r] = customWorkSheet;

      r++;
    }
    r = 1;
    str += " ";
    customWorkSheet = {
      t: "s",
      v: str,
      r: '<t> </t><phoneticPr fontId="1" type="noConversion"/>',
      h: str,
      w: str,
    };
    c++;
    char++;
  }
}

/**
 * @description: 第一行作为头部
 */
function getHeaderRow(sheet: XLSX.WorkSheet) {
  if (!sheet || !sheet["!ref"]) return [];
  const headers: string[] = [];
  // A3:B7=>{s:{c:0, r:2}, e:{c:1, r:6}}
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  shapeWorkSheel(sheet, range);

  const R = range.s.r;
  /* start in the first row */
  for (let C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
    /* find the cell in the first row */
    let hdr = `UNKNOWN ${C}`; // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    headers.push(hdr);
  }
  return headers;
}

/**
 * @description: 获得excel数据
 */
function getExcelData(workbook: XLSX.WorkBook) {
  const excelData: ExcelData[] = [];
  const { dateFormat, timeZone } = props;
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const header: string[] = getHeaderRow(worksheet);
    let results = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
      dateNF: dateFormat, // Not worked
    }) as object[];
    results = results.map((row: object) => {
      for (const field in row) {
        if (row[field] instanceof Date) {
          if (timeZone === 8)
            row[field].setSeconds(row[field].getSeconds() + 43);

          if (dateFormat) row[field] = dateUtil(row[field]).format(dateFormat);
        }
      }
      return row;
    });

    excelData.push({
      header,
      results,
      meta: {
        sheetName,
      },
    });
  }
  return excelData;
}

/**
 * @description: 读取excel数据
 */
function readerData(rawFile: File) {
  loadingRef.value = true;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target && e.target.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        /* DO SOMETHING WITH workbook HERE */
        const excelData = getExcelData(workbook);
        
        resolve(excelData);
      } catch (error) {
        reject(error);
        
      } finally {
        loadingRef.value = false;
      }
    };
    reader.readAsArrayBuffer(rawFile);
  });
}

const clearFileList = () => {
  formData.value.fileList = [];
}

// 暴露外部接口
defineExpose({
  clearFileList,
});
</script>