import { reactive, ref } from 'vue';
import { columns, byLabelMap, pathogenTypeMap } from './model';
import { findTagResultListByName } from '@/api/lims/tagresult';
import { TagResultSmallRespVO } from '@/api/lims/tagresult/model';

// 导出组件所需的配置和模型
export { columns, byLabelMap, pathogenTypeMap };





export const detecionDataColumns = reactive({})


//props.findAnalysisReportDetails?.resultList
export const detecionDataCataSource = reactive([])


/**
 * 获取靶区检测对比结果列表
 * @param taskId 任务ID
 * @param pathogenName 病原体名称(中文名)
 * @returns 靶区检测对比结果列表
 */
export const getTagResultList = async (taskId: number, pathogenName: string, sampleId: string) => {
  // const res = await findTagResultListByName(taskId, pathogenName);
  const res = await findTagResultListByName(taskId, pathogenName, sampleId);
  return res;
};


// [
//   { title: "子文件名", dataIndex: "key", key: "key" },
//   { title: "子文件类型", dataIndex: "type", key: "type" },

// ];

export const subColumns = ref<any[]>([]);
export const subDataMap = ref<any[]>([]);

export const loadingKeys = ref<string[]>([]);
export const expandedRowKeys = ref<string[]>([]);

export const keysObj = ref<any>({
  current: [],
  water: [],
})




export async function handleExpand(expanded: boolean, record: any) {

  if (loadingKeys.value.includes(record.id)) return
  if (expanded) {
    if (!subDataMap.value[record.id]) {
      const children = await getTagResultList(record.taskId, record.pathogenCnSname, record.sampleId);
      const { subDatas, subColumn } = getTableData(children)
      subDataMap.value[record.id] = subDatas
      subColumns.value[record.id] = subColumn
    }
    // 确保 loading 状态移除
  }

  loadingKeys.value = loadingKeys.value.filter((k) => k !== record.id);

}

const getTableData = (data: TagResultSmallRespVO[]) => {

  const subDatas: any[] = []
  const subColumn: any[] = []


  subColumn.push({ title: "", dataIndex: "name", key: "name", width: 250 })


  data.forEach(item => {
    if (item.isCurrentTag && !keysObj.value.current.includes(item.sampleCode)) {
      keysObj.value.current.push(item.sampleCode)
    }
    if (item.isWater && !keysObj.value.water.includes(item.sampleCode)) {
      keysObj.value.water.push(item.sampleCode)
    }

    // 如果头文件名不存在，则添加
    if (!subColumn.some(col => col.key === item.sampleCode)) {

      subColumn.push({
        title: item.sampleCode, dataIndex: item.sampleCode, key: item.sampleCode, width: 50, align: "center"
      })
    }

    const name = item.pathogenCnSname + '_' + item.tagCode

    //判断这一行是否存在
    const oneSubData = subDatas.filter(col => col.name === name)
    if (oneSubData.length <= 0) {
      subDatas.push({
        name, [item.sampleCode!]: item.detectionCount,
      })
    } else {
      oneSubData[0][item.sampleCode!] = item.detectionCount
    }

  })
  console.log(subColumn)

  return { subDatas, subColumn };
}

// 修复后代码：
export const getClass = (item: TagResultSmallRespVO) => {
  // 水控
  if (item.isWater) return 'water';
  // 当前靶区
  if (item.isCurrentTag) return 'current';
  return '';
};
