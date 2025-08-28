<script setup lang="tsx">
import { NTag } from 'naive-ui';
import { FlowSpotList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { setBaseUrl } from '@/utils/utils';

const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination } = useTable({
  apiFn: FlowSpotList,
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
      key: 'before_amount',
      title: '变动前金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-blue-600">{row.before_amount || 0}</span>;
      }
    },
    {
      key: 'after_amount',
      title: '变动后金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-green-600">{row.after_amount || 0}</span>;
      }
    },
    {
      key: 'type',
      title: '变动类型',
      align: 'center',
      width: 100,
      render: row => {
        const typeMap: Record<string, { type: string; text: string }> = {
          deposit: { type: 'success', text: '充值' },
          withdraw: { type: 'error', text: '提现' },
          transfer: { type: 'info', text: '转账' },
          buy: { type: 'warning', text: '买入' },
          sell: { type: 'success', text: '卖出' },
          postion_margin: { type: 'info', text: '仓位保证金' },
          trading_fee: { type: 'error', text: '交易手续费' },
          dividend: { type: 'info', text: '分红' },
          airdrop: { type: 'success', text: '空投' }
        };
        const config = typeMap[row.type] || { type: 'default', text: row.type };
        return <NTag type={config.type}>{config.text}</NTag>;
      }
    },
    {
      key: 'relation_id',
      title: '关联ID',
      align: 'center',
      width: 100,
      render: row => {
        return row.relation_id || '-';
      }
    },
    {
      key: 'remark',
      title: '备注',
      align: 'center',
      width: 150,
      render: row => {
        return <span class="text-gray-600">{row.remark || '-'}</span>;
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
    <NCard title="现货钱包流水" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
