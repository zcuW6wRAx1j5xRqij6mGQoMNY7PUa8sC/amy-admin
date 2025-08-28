 <script setup lang="jsx">
import {  NButton } from 'naive-ui';
import { FlowFuturesList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  mobilePagination,
} = useTable({
  apiFn: FlowFuturesList,
  apiParams: {
    page: 1,
    page_size: 20,
  },
  columns: () => [
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      width: 120,
      fixed: 'left'
    },
    {
      key: 'uid',
      title: '用户ID',
      align: 'center',
      width: 80,
    },
    {
      key: 'amount',
      title: '变动金额',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'before_amount',
      title: '变动前金额',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'after_amount',
      title: '变动后金额',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'relation_id',
      title: '关联ID',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'type',
      title: '变动类型',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'remark',
      title: '备注',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'created_at',
      title: '创建日期',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'updated_at',
      title: '最近日期',
      align: 'center',
      minWidth: 150
    },
    // {
    //   key: 'operate',
    //   title: '操作',
    //   align: 'center',
    //   width: 80,
    //   fixed: 'right',
    //   render: row => (
    //     <div >
    //         <NButton onClick={()=> handleDetail(row)}>详情</NButton> 
    //     </div>
    //   )
    // }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

function edit(id) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <NCard title="合约钱包流水" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
            <template #header-extra>
                <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
                    :loading="loading" no-add @refresh="getData" />
            </template>
            <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
                :flex-height="!appStore.isMobile" :scroll-x="800" :loading="loading" remote :row-key="row => row.id"
                :pagination="mobilePagination" class="sm:h-full" />
        </NCard>
    </div>
</template>

<style scoped></style>
