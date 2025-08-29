<script setup lang="tsx">
import { NTag } from 'naive-ui';
import { FlowLoanList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination } = useTable({
  apiFn: FlowLoanList,
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
      key: 'wallet_id',
      title: '钱包ID',
      align: 'center',
      width: 100
    },
    {
      key: 'balance_type',
      title: '余额类型',
      align: 'center',
      width: 100,
      render: row => {
        const typeMap: Record<string, { type: string; text: string }> = {
          total: { type: 'info', text: '总额度' },
          used: { type: 'warning', text: '已贷额度' },
          unused: { type: 'success', text: '可用额度' },
          frozen: { type: 'error', text: '冻结额度' }
        };
        const config = typeMap[row.balance_type] || { type: 'default', text: row.balance_type };
        return <NTag type={config.type}>{config.text}</NTag>;
      }
    },
    {
      key: 'amount',
      title: '变动金额',
      align: 'center',
      width: 120,
      render: row => {
        const amount = Number.parseFloat(row.amount) || 0;
        const color = amount >= 0 ? 'text-green-600' : 'text-red-600';
        const prefix = amount >= 0 ? '+' : '';
        return (
          <span class={color}>
            {prefix}
            {amount}
          </span>
        );
      }
    },
    {
      key: 'balance_before',
      title: '变动前余额',
      align: 'center',
      width: 120,
      render: row => {
        return <span>{row.balance_before || 0}</span>;
      }
    },
    {
      key: 'balance_after',
      title: '变动后余额',
      align: 'center',
      width: 120,
      render: row => {
        return <span>{row.balance_after || 0}</span>;
      }
    },
    {
      key: 'type',
      title: '变动类型',
      align: 'center',
      width: 100,
      render: row => {
        const typeMap: Record<string, { type: string; text: string }> = {
          apply: { type: 'warning', text: '申请贷款' },
          approved: { type: 'success', text: '审核通过' },
          rejected: { type: 'error', text: '审核拒绝' },
          canceled: { type: 'default', text: '取消贷款' },
          paid: { type: 'info', text: '还款' }
        };
        const config = typeMap[row.type] || { type: 'default', text: row.type };
        return <NTag type={config.type}>{config.text}</NTag>;
      }
    },
    {
      key: 'source',
      title: '来源',
      align: 'center',
      width: 120,
      render: row => {
        return <span>{row.source || '-'}</span>;
      }
    },
    {
      key: 'remark',
      title: '备注',
      align: 'center',
      width: 150,
      render: row => {
        return <span>{row.remark || '-'}</span>;
      }
    },
    {
      key: 'user.credit',
      title: '信用分',
      align: 'center',
      width: 100,
      render: row => {
        const credit = row.user?.credit || 0;
        return <span>{credit}</span>;
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
      key: 'created_at',
      title: '创建时间',
      align: 'center',
      width: 160
    }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="贷款钱包流水" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
