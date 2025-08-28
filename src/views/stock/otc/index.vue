<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { StockDelOtc, StockOtcList } from '@/service/api/stock';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';
import SearchBox from './modules/search-box.vue';

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
  apiFn: StockOtcList,
  apiParams: {
    page: 1,
    size: 20
  },
  columns: () => [
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      width: 80,
      fixed: 'left'
    },
    {
      key: 'stock_id',
      title: '股票ID',
      align: 'center',
      width: 100
    },
    {
      key: 'stock.name',
      title: '股票名称',
      align: 'center',
      width: 120,
      render: row => row.stock?.name || '-'
    },
    {
      key: 'stock.symbol',
      title: '股票代码',
      align: 'center',
      width: 120,
      render: row => row.stock?.symbol || '-'
    },
    {
      key: 'apply_price',
      title: '申请价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.apply_price || 0}</span>
    },
    {
      key: 'close_price',
      title: '平仓价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.close_price || 0}</span>
    },
    {
      key: 'apply_min_quantity',
      title: '申请最小量',
      align: 'center',
      width: 120,
      render: row => <span>{row.apply_min_quantity || 0}</span>
    },
    {
      key: 'apply_max_quantity',
      title: '申请最大量',
      align: 'center',
      width: 120,
      render: row => <span>{row.apply_max_quantity || 0}</span>
    },
    {
      key: 'open_fee',
      title: '开仓手续费%',
      align: 'center',
      width: 120,
      render: row => <span class="text-red-600">{row.open_fee || 0}%</span>
    },
    {
      key: 'close_fee',
      title: '平仓手续费%',
      align: 'center',
      width: 120,
      render: row => <span class="text-red-600">{row.close_fee || 0}%</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const type = row.status === 0 ? 'error' : 'success';
        const text = row.status === 0 ? '关闭' : '开启';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'created_at',
      title: '创建时间',
      align: 'center',
      width: 160
    },
    {
      key: 'updated_at',
      title: '更新时间',
      align: 'center',
      width: 160
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
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
async function handleDelete(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await StockDelOtc({ id });
    loading.value = false;
    onDeleted();
  } catch (error) {
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
    <NCard title="OTC股票管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="2000"
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
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
