<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { EtfConfigDelete, EtfConfigList } from '@/service/api/etf';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';
import OperateDrawer from './modules/operate-drawer.vue';

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
  apiFn: EtfConfigList,
  apiParams: {
    product_id: null,
    status: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'product.name',
      title: '产品名称',
      align: 'center',
      width: 150,
      render: row => <span>{row.product?.name || '-'}</span>
    },
    {
      key: 'daily_profit_rate',
      title: '日收益率(%)',
      align: 'center',
      width: 120,
      render: row => <span>{row.daily_profit_rate ? `${row.daily_profit_rate}%` : '-'}</span>
    },
    {
      key: 'min_quantity',
      title: '最小买入金额',
      align: 'center',
      width: 140,
      render: row => <span>{row.min_quantity || '-'}</span>
    },
    {
      key: 'max_quantity',
      title: '最大买入金额',
      align: 'center',
      width: 140,
      render: row => <span>{row.max_quantity || '-'}</span>
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
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => '确认删除吗？',
              trigger: () => (
                <NButton type="error" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
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
    await EtfConfigDelete({ id: _id });
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
    <NCard title="ETF设置管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
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
