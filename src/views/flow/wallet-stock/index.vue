<script setup lang="tsx">
import { NTag } from 'naive-ui';
import { WalletStockList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { setBaseUrl } from '@/utils/utils';

const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination } = useTable({
  apiFn: WalletStockList,
  apiParams: {
    page: 1,
    size: 20
  },
  columns: () => [
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      width: 80
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
      key: 'balance',
      title: '钱包余额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-green-600 font-bold">{row.balance || 0}</span>;
      }
    },
    {
      key: 'frozen_balance',
      title: '冻结余额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-red-600">{row.frozen_balance || 0}</span>;
      }
    },
    {
      key: 'total_deposit',
      title: '总充值金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-blue-600">{row.total_deposit || 0}</span>;
      }
    },
    {
      key: 'total_withdraw',
      title: '总提现金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-orange-600">{row.total_withdraw || 0}</span>;
      }
    },
    {
      key: 'user.credit',
      title: '信用分',
      align: 'center',
      width: 100,
      render: row => {
        const credit = row.user?.credit || 0;
        let color = 'text-gray-600';
        if (credit >= 800) color = 'text-green-600';
        else if (credit >= 600) color = 'text-blue-600';
        else if (credit >= 400) color = 'text-orange-600';
        else color = 'text-red-600';
        return <span class={color}>{credit}</span>;
      }
    },
    {
      key: 'user.is_kyc',
      title: '实名认证',
      align: 'center',
      width: 100,
      render: row => {
        const isKyc = row.user?.is_kyc;
        const type = isKyc ? 'success' : 'error';
        const text = isKyc ? '已认证' : '未认证';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'user.status',
      title: '用户状态',
      align: 'center',
      width: 100,
      render: row => {
        const status = row.user?.status;
        const type = status ? 'success' : 'error';
        const text = status ? '正常' : '禁用';
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
    }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="股票钱包管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
