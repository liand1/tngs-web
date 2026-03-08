import { defHttp } from '@/utils/http/axios';
import { TagResultSmallRespVO } from './model';

/**
 * 根据病原体名-获得指定任务靶区检测对比结果列表
 * @param taskId 任务ID
 * @param pathogenName 病原体名称(中文名)
 * @param sampleId 样本ID
 * @returns 靶区检测对比结果列表
 */
export function findTagResultListByName(taskId: number, pathogenName: string, sampleId: string) {
  return defHttp.get<TagResultSmallRespVO[]>({
    url: '/lims/tag-result/find-list-by-contrast',
    params: { taskId, pathogenName, sampleId },
  });
}
