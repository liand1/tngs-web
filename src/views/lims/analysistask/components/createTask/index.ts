import { ExcelData } from "@/components/Excel";
import { BasicColumn } from "@/components/Table";

export function loadDataSuccess(excelDataList: ExcelData[]) {
  const ExcelData: any[] = [];
  console.log(excelDataList);
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
  }
  console.log(ExcelData)
}

