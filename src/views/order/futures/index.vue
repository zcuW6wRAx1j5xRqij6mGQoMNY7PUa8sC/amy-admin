<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { OrderFuturesList } from '@/service/api/order';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

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
  apiFn: OrderFuturesList,
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
      key: 'margin_type',
      title: '保证金类型',
      align: 'center',
      width: 100,
      render: row => {
        const type = row.margin_type === 'isolated' ? 'warning' : 'info';
        const text = row.margin_type === 'isolated' ? '逐仓' : '全仓';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'leverage',
      title: '杠杆倍数',
      align: 'center',
      width: 100,
      render: row => <span>{row.leverage || 0}x</span>
    },
    {
      key: 'lots',
      title: '手数',
      align: 'center',
      width: 100,
      render: row => <span>{row.lots || 0}</span>
    },
    {
      key: 'margin',
      title: '保证金',
      align: 'center',
      width: 120,
      render: row => <span>{row.margin || 0}</span>
    },
    {
      key: 'margin_ratio',
      title: '保证金比例',
      align: 'center',
      width: 120,
      render: row => <span>{row.margin_ratio || 0}%</span>
    },
    {
      key: 'price',
      title: '开仓委托价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.price || 0}</span>
    },
    {
      key: 'match_price',
      title: '开仓成交价格',
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
      key: 'open_price',
      title: '开仓价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.open_price || 0}</span>
    },
    {
      key: 'open_spread',
      title: '开仓点差',
      align: 'center',
      width: 120,
      render: row => <span>{row.open_spread || 0}</span>
    },
    {
      key: 'open_fee',
      title: '开仓手续费',
      align: 'center',
      width: 120,
      render: row => <span>{row.open_fee || 0}</span>
    },
    {
      key: 'close_price',
      title: '平仓价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.close_price || 0}</span>
    },
    {
      key: 'close_spread',
      title: '平仓点差',
      align: 'center',
      width: 120,
      render: row => <span>{row.close_spread || 0}</span>
    },
    {
      key: 'close_fee',
      title: '平仓手续费',
      align: 'center',
      width: 120,
      render: row => <span>{row.close_fee || 0}</span>
    },
    {
      key: 'force_close_price',
      title: '强平价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.force_close_price || 0}</span>
    },
    {
      key: 'profit',
      title: '盈亏',
      align: 'center',
      width: 120,
      render: row => <span>{row.profit || 0}</span>
    },
    {
      key: 'profit_ratio',
      title: '浮动盈亏比例',
      align: 'center',
      width: 120,
      render: row => <span>{row.profit_ratio || 0}%</span>
    },
    {
      key: 'sl',
      title: '止损价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.sl || 0}</span>
    },
    {
      key: 'tp',
      title: '止盈价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.tp || 0}</span>
    },
    {
      key: 'close_type',
      title: '平仓类型',
      align: 'center',
      width: 120,
      render: row => <span class="text-gray-600">{row.close_type || '-'}</span>
    },
    {
      key: 'trade_status',
      title: '持仓状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          pending: { type: 'default', text: '等待' },
          open: { type: 'success', text: '持仓中' },
          closeing: { type: 'warning', text: '平仓中' },
          closed: { type: 'error', text: '已平仓' }
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
      key: 'close_time',
      title: '平仓时间',
      align: 'center',
      width: 160,
      render: row => <span class="text-gray-600">{row.close_time || '-'}</span>
    },
    {
      key: 'created_at',
      title: '创建时间',
      align: 'center',
      width: 160
    },

  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" /> -->
    <NCard title="合约订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="4000"
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
