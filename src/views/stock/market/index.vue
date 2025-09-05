<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { StockDelMarket, StockMarketList } from '@/service/api/stock';
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
  apiFn: StockMarketList,
  apiParams: {
    symbol: null,
    exchange: null,
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
      key: 'symbol',
      title: '股票代码',
      align: 'center',
      width: 120
    },
    {
      key: 'name',
      title: '股票名称',
      align: 'center',
      width: 120
    },
    {
      key: 'exchange',
      title: '交易所类型',
      align: 'center',
      width: 120
    },
    {
      key: 'country',
      title: '国家',
      align: 'center',
      width: 100
    },
    {
      key: 'logo',
      title: '股票Logo',
      align: 'center',
      width: 80,
      render: row => {
        if (row.logo) {
          return <img src={row.logo} class="h-40px w-40px rounded" alt="Logo" />;
        }
        return '-';
      }
    },
    {
      key: 'price',
      title: '当前价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.price || 0}</span>
    },
    {
      key: 'change',
      title: '涨跌幅',
      align: 'center',
      width: 120,
      render: row => {
        const change = row.change || 0;
        const color = change < 0 ? 'text-red-600' : '';
        return <span class={color}>{change}%</span>;
      }
    },
    {
      key: 'open',
      title: '开盘价',
      align: 'center',
      width: 120,
      render: row => <span>{row.open || 0}</span>
    },
    {
      key: 'close',
      title: '收盘价',
      align: 'center',
      width: 120,
      render: row => <span>{row.close || 0}</span>
    },
    {
      key: 'high',
      title: '最高价',
      align: 'center',
      width: 120,
      render: row => <span>{row.high || 0}</span>
    },
    {
      key: 'low',
      title: '最低价',
      align: 'center',
      width: 120,
      render: row => <span>{row.low || 0}</span>
    },
    {
      key: 'volume',
      title: '成交量',
      align: 'center',
      width: 120,
      render: row => <span>{row.volume || 0}</span>
    },
    {
      key: 'market_cap',
      title: '成交额',
      align: 'center',
      width: 120,
      render: row => <span>{row.market_cap || 0}</span>
    },
    {
      key: 'isin',
      title: '国际证券识别码',
      align: 'center',
      width: 150,
      render: row => <span>{row.isin || '-'}</span>
    },
    {
      key: 'is_recommend',
      title: '是否推荐',
      align: 'center',
      width: 100,
      render: row => {
        const type = row.is_recommend === 1 ? 'success' : 'default';
        const text = row.is_recommend === 1 ? '是' : '否';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const type = row.status === 1 ? 'success' : 'error';
        const text = row.status === 1 ? '启用' : '禁用';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'sort',
      title: '排序',
      align: 'center',
      width: 80,
      render: row => <span>{row.sort || 0}</span>
    },
    {
      key: 'created_at',
      title: '创建时间',
      align: 'center',
      width: 160
    },
    ,
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
    await StockDelMarket({ id });
    window.$message?.success('删除成功');
    onDeleted();
  } catch (error: any) {
    window.$message?.error('删除失败');
    console.error('删除市场股票失败:', error);
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
    <NCard title="市场股票管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :no-add="true"
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
        :scroll-x="2200"
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
