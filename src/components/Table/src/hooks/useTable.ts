import type { WatchStopHandle } from 'vue'
import { onUnmounted, ref, toRaw, unref, watch } from 'vue'
import type { Key } from 'ant-design-vue/lib/table/interface'
import type { BasicColumn, BasicTableProps, FetchParams, TableActionType } from '../types/table'
import type { PaginationProps } from '../types/pagination'
import type { DynamicProps } from '@/types/utils'
import type { FormActionType } from '@/components/Form'
import { getDynamicProps } from '@/utils'
import { isProdMode } from '@/utils/env'
import { error } from '@/utils/log'

type Props = Partial<DynamicProps<BasicTableProps>>

type UseTableMethod = TableActionType & {
  getForm: () => FormActionType
}

export function useTable(tableProps?: Props, beforeTableAction?: TableActionType & {
  getForm?: () => FormActionType
}): [
    (instance: TableActionType, formInstance: UseTableMethod) => void,
    TableActionType & {
      getForm: () => FormActionType
    },
  ] {
  const tableRef = ref<Nullable<TableActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)
  const formRef = ref<Nullable<UseTableMethod>>(null)

  let stopWatch: WatchStopHandle

  function register(instance: TableActionType, formInstance: UseTableMethod) {
    isProdMode()
      && onUnmounted(() => {
        tableRef.value = null
        loadedRef.value = null
      })

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef))
      return

    tableRef.value = instance
    formRef.value = formInstance
    tableProps && instance.setProps(getDynamicProps(tableProps))
    loadedRef.value = true

    stopWatch?.()

    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps))
      },
      {
        immediate: true,
        deep: true,
      },
    )
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef)
    if (!table) {
      error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!',
      )
    }
    return table as TableActionType
  }

  const methods: TableActionType & {
    getForm: () => FormActionType
  } = {
    reload: async (opt?: FetchParams) => {
      await beforeTableAction?.reload?.(opt)
      return await getTableInstance().reload(opt)
    },
    setProps: (props: Partial<BasicTableProps>) => {
      beforeTableAction?.setProps?.(props)
      getTableInstance().setProps(props)
    },
    redoHeight: () => {
      beforeTableAction?.redoHeight?.()
      getTableInstance().redoHeight()
    },
    setSelectedRows: (rows: Recordable[]) => {
      beforeTableAction?.setSelectedRows?.(rows)
      return toRaw(getTableInstance().setSelectedRows(rows))
    },
    setLoading: (loading: boolean) => {
      beforeTableAction?.setLoading?.(loading)
      getTableInstance().setLoading(loading)
    },
    getDataSource: () => {
      beforeTableAction?.getDataSource?.()
      return getTableInstance().getDataSource()
    },
    getRawDataSource: () => {
      beforeTableAction?.getRawDataSource?.()
      return getTableInstance().getRawDataSource()
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      beforeTableAction?.getColumns?.({ ignoreIndex })
      const columns = getTableInstance().getColumns({ ignoreIndex }) || []
      return toRaw(columns)
    },
    setColumns: (columns: BasicColumn[] | string[]) => {
      beforeTableAction?.setColumns?.(columns)
      getTableInstance().setColumns(columns)
    },
    setTableData: (values: any[]) => {
      beforeTableAction?.setTableData?.(values)
      return getTableInstance().setTableData(values)
    },
    setPagination: (info: Partial<PaginationProps>) => {
      beforeTableAction?.setPagination?.(info)
      return getTableInstance().setPagination(info)
    },
    deleteSelectRowByKey: (key: string) => {
      beforeTableAction?.deleteSelectRowByKey?.(key)
      getTableInstance().deleteSelectRowByKey(key)
    },
    getSelectRowKeys: () => {
      beforeTableAction?.getSelectRowKeys?.()
      return toRaw(getTableInstance().getSelectRowKeys())
    },
    getSelectRows: () => {
      beforeTableAction?.getSelectRows?.()
      return toRaw(getTableInstance().getSelectRows())
    },
    clearSelectedRowKeys: () => {
      beforeTableAction?.clearSelectedRowKeys?.()
      getTableInstance().clearSelectedRowKeys()
    },
    setSelectedRowKeys: (keys: (string | number)[]) => {
      beforeTableAction?.setSelectedRowKeys?.(keys)
      getTableInstance().setSelectedRowKeys(keys)
    },
    getPaginationRef: () => {
      beforeTableAction?.getPaginationRef?.()
      return getTableInstance().getPaginationRef()
    },
    getSize: () => {
      beforeTableAction?.getSize?.()
      return toRaw(getTableInstance().getSize())
    },
    updateTableData: (index: number, key: string, value: any) => {
      beforeTableAction?.updateTableData?.(index, key, value)
      return getTableInstance().updateTableData(index, key, value)
    },
    deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => {
      beforeTableAction?.deleteTableDataRecord?.(rowKey)
      return getTableInstance().deleteTableDataRecord(rowKey)
    },
    insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
      beforeTableAction?.insertTableDataRecord?.(record, index)
      return getTableInstance().insertTableDataRecord(record, index)
    },
    updateTableDataRecord: (rowKey: string | number, record: Recordable) => {
      beforeTableAction?.updateTableDataRecord?.(rowKey, record)
      return getTableInstance().updateTableDataRecord(rowKey, record)
    },
    findTableDataRecord: (rowKey: string | number) => {
      beforeTableAction?.findTableDataRecord?.(rowKey)
      return getTableInstance().findTableDataRecord(rowKey)
    },
    getRowSelection: () => {
      beforeTableAction?.getRowSelection?.()
      return toRaw(getTableInstance().getRowSelection())
    },
    getCacheColumns: () => {
      beforeTableAction?.getCacheColumns?.()
      return toRaw(getTableInstance().getCacheColumns())
    },
    getForm: () => {
      beforeTableAction?.getForm?.()
      return unref(formRef) as unknown as FormActionType
    },
    setShowPagination: async (show: boolean) => {
      await beforeTableAction?.setShowPagination?.(show)
      await getTableInstance().setShowPagination(show)
    },
    getShowPagination: () => {
      beforeTableAction?.getShowPagination?.()
      return toRaw(getTableInstance().getShowPagination())
    },
    expandAll: () => {
      beforeTableAction?.expandAll?.()
      getTableInstance().expandAll()
    },
    expandRows: (keys: Key[]) => {
      beforeTableAction?.expandRows?.(keys)
      getTableInstance().expandRows(keys)
    },
    collapseAll: () => {
      beforeTableAction?.collapseAll?.()
      getTableInstance().collapseAll()
    },
    scrollTo: (pos: string) => {
      beforeTableAction?.scrollTo?.(pos)
      getTableInstance().scrollTo(pos)
    },
    setShowForm: async (flag: boolean) => {
      await beforeTableAction?.setShowForm?.(flag)
      await getTableInstance().setShowForm(flag)
    },
    getShowForm: () => {
      beforeTableAction?.getShowForm?.()
      return toRaw(getTableInstance().getShowForm())
    },
  }

  return [register, methods]
}
