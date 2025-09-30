<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { EtfProductDelete, EtfProductList } from '@/service/api/etf';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';
import OperateDrawer from './modules/operate-drawer.vue';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

const appStore = useAppStore();

// 表格相关
const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: EtfProductList,
  apiParams: {
    name: '',
    status: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    { key: 'name', title: '产品名称', align: 'center', width: 150 },
    { key: 'desc', title: '详细介绍', align: 'center', width: 200, render: row => <span>{row.desc || '-'}</span> },
    {
      key: 'order_start_at',
      title: '开始时间',
      align: 'center',
      width: 170,
      render: row => <span>{row.order_start_at || '-'}</span>
    },
    {
      key: 'order_end_at',
      title: '结束时间',
      align: 'center',
      width: 170,
      render: row => <span>{row.order_end_at || '-'}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          '0': { type: 'error', text: '关闭' },
          '1': { type: 'success', text: '开启' }
        };
        const status = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: row => (
        <div class="flex-center gap-12px">
          {hasAuth('edit') && (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              编辑
            </NButton>
          )}
          {hasAuth('delete') && (
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => '确认删除吗？',
              trigger: () => (
                <NButton type="error" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>)}
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

// 删除
async function handleDelete(_id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await EtfProductDelete({ id: _id });
    loading.value = false;
    onDeleted();
  } catch {
  } finally {
    loading.value = false;
  }
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="ETF产品管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :no-add="!hasAuth('add')"
          @add="handleAdd"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1200"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <OperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
