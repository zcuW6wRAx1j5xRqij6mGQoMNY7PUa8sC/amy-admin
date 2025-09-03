<script setup lang="tsx">
import { NTag } from 'naive-ui';
import { CryptoDepositList } from '@/service/api/crypto';
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
  apiFn: CryptoDepositList,
  apiParams: {
    uid: null,
    coin_id: null,
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
      key: 'user.nickname',
      title: '用户昵称',
      align: 'center',
      width: 120,
      render: row => <span>{row.user?.nickname || '-'}</span>
    },
    {
      key: 'coin.name',
      title: '币种',
      align: 'center',
      width: 100,
      render: row => <span>{row.coin?.name || '-'}</span>
    },
    {
      key: 'coin.full_name',
      title: '币种全称',
      align: 'center',
      width: 120,
      render: row => <span>{row.coin?.full_name || '-'}</span>
    },
    {
      key: 'coin.block',
      title: '链名称',
      align: 'center',
      width: 100,
      render: row => <span>{row.coin?.block || '-'}</span>
    },
    {
      key: 'amount',
      title: '充值金额',
      align: 'center',
      width: 120,
      render: row => <span class="font-bold">{row.amount || 0}</span>
    },
    {
      key: 'receipt',
      title: '凭证',
      align: 'center',
      width: 200,
      render: row => <span>{row.receipt || '-'}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          pending: { type: 'warning', text: '待处理' },
          confirmed: { type: 'success', text: '已确认' },
          rejected: { type: 'error', text: '已拒绝' },
          cancelled: { type: 'info', text: '已取消' }
        };
        const status = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'coin.deposit_address',
      title: '充值地址',
      align: 'center',
      width: 200,
      render: row => <span class="text-xs">{row.coin?.deposit_address || '-'}</span>
    }
  ]
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="数字货币充值订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" no-add @refresh="getData" />
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1600"
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
