import type { BasicColumn } from '@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '基因名',
    dataIndex: 'drugGene',
    width: 150,
  },
  {
    title: '核苷酸突变',
    dataIndex: 'dntMutation',
    width: 150,
    ellipsis: true,
  },
  {
    title: '氨基酸突变',
    dataIndex: 'aminoMutation',
    width: 150,
    ellipsis: true,
  },
  {
    title: '突变类型',
    dataIndex: 'gene',
    width: 140,
  },
  {
    title: 'WHO注释',
    dataIndex: 'result',
    width: 140,
    ellipsis: true,
  },
  {
    title: '临床意义',
    dataIndex: 'annotation',
    ellipsis: true,
  },
]
