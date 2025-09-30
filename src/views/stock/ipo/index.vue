<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { StockDelIpo, StockIpoList } from '@/service/api/stock';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import type { IpoStock } from '@/typings/stock';
import OperateDrawer from './modules/operate-drawer.vue';
import SearchBox from './modules/search-box.vue';
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
  apiFn: StockIpoList,
  apiParams: {
    stock_id: null,
    status: null,
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
      key: 'company_id',
      title: '企业ID',
      align: 'center',
      width: 100
    },
    {
      key: 'company_name',
      title: '企业名称',
      align: 'center',
      width: 100
    },
    {
      key: 'buy_price',
      title: '购买价格',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.buy_price || 0}</span>
    },
    {
      key: 'apply_price',
      title: '发行价格',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.apply_price || 0}</span>
    },
    {
      key: 'close_price',
      title: '平仓价格',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.close_price || 0}</span>
    },
    {
      key: 'apply_min_quantity',
      title: '申请最小量',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.apply_min_quantity || 0}</span>
    },
    {
      key: 'apply_max_quantity',
      title: '申请最大量',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.apply_max_quantity || 0}</span>
    },
    {
      key: 'issue_quantity',
      title: '发行数量',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.issue_quantity || 0}</span>
    },
    {
      key: 'sold_quantity',
      title: '已售数量',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.sold_quantity || 0}</span>
    },
    {
      key: 'published_at',
      title: '上市时间',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span>{row.published_at || '-'}</span>
    },
    {
      key: 'open_fee',
      title: '开仓手续费%',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span class="text-red-600">{row.open_fee || 0}%</span>
    },
    {
      key: 'close_fee',
      title: '平仓手续费%',
      align: 'center',
      width: 120,
      render: (row: IpoStock) => <span class="text-red-600">{row.close_fee || 0}%</span>
    },
    {
      key: 'apply_start_at',
      title: '开始时间',
      align: 'center',
      width: 170,
      render: (row: IpoStock) => <span>{row.apply_start_at || '-'}</span>
    },
    {
      key: 'apply_end_at',
      title: '结束时间',
      align: 'center',
      width: 170,
      render: (row: IpoStock) => <span>{row.apply_end_at || '-'}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: (row: IpoStock) => {
        const type = row.status === 1 ? 'success' : 'error';
        const text = row.status === 1 ? '开启' : '关闭';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (row: IpoStock) => (
        <div class="flex-center gap-12px">
          {hasAuth('edit')&&(<NButton type="primary" ghost size="small" onClick={() => edit(row.id!)}>
            编辑
          </NButton>)}
          {hasAuth('delete')&&(<NPopconfirm onPositiveClick={() => handleDelete(row.id!)}>
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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } =
  useTableOperate<IpoStock>(data, getData);

// 删除
async function handleDelete(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await StockDelIpo({ id });
    window.$message?.success('删除成功');
    onDeleted();
  } catch (error: any) {
    console.error('删除IPO失败:', error);
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
    <NCard title="IPO股票管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :row-data="editingData || undefined"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
