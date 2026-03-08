



export const columns = [{
  title: '样本编号',
  dataIndex: 'sampleCode',
  key: 'sampleCode',
  width: 150,
},
{
  title: '检测项目',
  dataIndex: 'checkType',
  key: 'checkType',
  width: 150,
  slots: {
    customRender: 'checkType',
  },
},
{
  title: '检测试剂',
  dataIndex: 'checkReagent',
  key: 'checkReagent',
  width: 150,
  slots: {
    customRender: 'checkReagent',
  },
},
{
  title: '芯片数据文件',
  dataIndex: 'socDataFileName',
  key: 'socDataFileName',
},
{
  title: '芯片文件状态',
  dataIndex: 'socStatus',
  key: 'socStatus',
  width: 120,
  slots: {
    customRender: 'socStatus',
  },
},
{
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  width: 50,
  align: 'center',
  slots: {
    customRender: 'action',
  },
},
]



