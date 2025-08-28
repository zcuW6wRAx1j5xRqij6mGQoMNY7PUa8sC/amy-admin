<script setup lang="tsx">
import { NTag } from 'naive-ui';
import { OrderSpot } from '@/service/api/order';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
// import SearchBox from './modules/search-box.vue';

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
  apiFn: OrderSpot,
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
      key: 'order_code',
      title: '订单编号',
      align: 'center',
      width: 150
    },
    {
      key: 'uid',
      title: '用户ID',
      align: 'center',
      width: 100
    },
    {
      key: 'user.nickname',
      title: '用户昵称',
      align: 'center',
      width: 120,
      render: row => row.user?.nickname || '-'
    },
    {
      key: 'symbol_id',
      title: '交易对ID',
      align: 'center',
      width: 100
    },
    {
      key: 'symbol.name',
      title: '交易对名称',
      align: 'center',
      width: 120,
      render: row => row.symbol?.name || '-'
    },
    {
      key: 'side',
      title: '交易方向',
      align: 'center',
      width: 100,
      render: row => {
        const type = row.side === 'buy' ? 'success' : 'error';
        const text = row.side === 'buy' ? '买入' : '卖出';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'price',
      title: '委托报价',
      align: 'center',
      width: 120,
      render: row => <span>{row.price || 0}</span>
    },
    {
      key: 'match_price',
      title: '成交价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.match_price || 0}</span>
    },
    {
      key: 'market_price',
      title: '市场价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.market_price || 0}</span>
    },
    {
      key: 'volume',
      title: '交易量',
      align: 'center',
      width: 120,
      render: row => <span>{row.volume || 0}</span>
    },
    {
      key: 'trade_volume',
      title: '交易额',
      align: 'center',
      width: 120,
      render: row => <span>{row.trade_volume || 0}</span>
    },
    {
      key: 'spread',
      title: '点差',
      align: 'center',
      width: 120,
      render: row => <span>{row.spread || 0}</span>
    },
    {
      key: 'fee',
      title: '手续费',
      align: 'center',
      width: 120,
      render: row => <span>{row.fee || 0}</span>
    },
    {
      key: 'base_asset',
      title: '交易货币',
      align: 'center',
      width: 100,
      render: row => <span class="text-gray-600">{row.base_asset || '-'}</span>
    },
    {
      key: 'quote_asset',
      title: '计价货币',
      align: 'center',
      width: 100,
      render: row => <span class="text-gray-600">{row.quote_asset || '-'}</span>
    },
    {
      key: 'trade_status',
      title: '交易状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          pending: { type: 'warning', text: '挂单中' },
          success: { type: 'success', text: '成交' },
          failed: { type: 'error', text: '失败' }
        };
        const status = statusMap[row.trade_status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'match_time',
      title: '成交时间',
      align: 'center',
      width: 160,
      render: row => <span class="text-gray-600">{row.match_time || '-'}</span>
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
    }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" /> -->
    <NCard title="现货订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          no-add
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="2500"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
