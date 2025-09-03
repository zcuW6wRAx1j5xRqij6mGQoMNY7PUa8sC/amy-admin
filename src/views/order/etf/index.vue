<script setup lang="tsx">
import { NTag } from 'naive-ui';
import { EtfOrderList } from '@/service/api/etf';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
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
  apiFn: EtfOrderList,
  apiParams: {
    uid: null,
    product_id: null,
    status: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'uid',
      title: '用户ID',
      align: 'center',
      width: 100,
      render: row => <span>{row.uid || '-'}</span>
    },
    {
      key: 'product.name',
      title: '产品名称',
      align: 'center',
      width: 150,
      render: row => <span>{row.product?.name || '-'}</span>
    },
    {
      key: 'amount',
      title: '买入金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.amount || '-'}</span>
    },
    {
      key: 'daily_profit_rate',
      title: '日收益率(%)',
      align: 'center',
      width: 120,
      render: row => <span>{row.daily_profit_rate ? `${row.daily_profit_rate}%` : '-'}</span>
    },
    {
      key: 'daily_profit',
      title: '日收益',
      align: 'center',
      width: 120,
      render: row => <span>{row.daily_profit || '-'}</span>
    },
    {
      key: 'profit',
      title: '总收益',
      align: 'center',
      width: 120,
      render: row => <span>{row.profit || '-'}</span>
    },
    {
      key: 'return_profit',
      title: '已返还收益',
      align: 'center',
      width: 120,
      render: row => <span>{row.return_profit || '-'}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          0: { type: 'warning', text: '待审核' },
          1: { type: 'error', text: '已拒绝' },
          2: { type: 'success', text: '已通过' },
          3: { type: 'info', text: '已结清' }
        };
        const status = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'next_settlement_at',
      title: '下次结算时间',
      align: 'center',
      width: 160,
      render: row => <span>{row.next_settlement_at || '-'}</span>
    },
    {
      key: 'settlement_at',
      title: '结单日期',
      align: 'center',
      width: 160,
      render: row => <span>{row.settlement_at || '-'}</span>
    },
    { key: 'created_at', title: '创建时间', align: 'center', width: 160 }
  ]
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="ETF订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @refresh="getData" />
      </template>

      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1800"
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
