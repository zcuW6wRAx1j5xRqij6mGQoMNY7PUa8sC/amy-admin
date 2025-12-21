<script setup lang="tsx">
import { NTag, NPopconfirm, NButton } from 'naive-ui';
import { FlowStockList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { hiddenStockOrder } from '@/service/api/hidden';
import SearchBox from './modules/search-box.vue';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination,getDataByPage,searchParams,resetSearchParams } = useTable({
  apiFn: FlowStockList,
  apiParams: {
    uid: '',
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
        return <span>{row.before_amount || 0}</span>;
      }
    },
    {
      key: 'after_amount',
      title: '变动后金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span>{row.after_amount || 0}</span>;
      }
    },
    {
      key: 'type',
      title: '变动类型',
      align: 'center',
      width: 120,
      render: row => {
        const typeMap: Record<string, { type: string; text: string }> = {
          // 基础操作类型
          system: { type: 'default', text: '系统操作' },
          system_deposit: { type: 'success', text: '系统入金' },
          system_withdraw: { type: 'error', text: '系统提现' },
          deposit: { type: 'success', text: '入金' },
          withdraw: { type: 'error', text: '提现' },
          withdraw_fee: { type: 'error', text: '提现手续费' },
          withdraw_fee_refund: { type: 'success', text: '提现手续费返还' },
          withdraw_refund: { type: 'success', text: '提现失败返还' },
          FlowTypeDeposit: { type: 'success', text: '入金' },
          block_trade_system_create: { type: 'success', text: '系统建仓' },
          market_buy: { type: 'success', text: '股票购买' },

          // 大宗交易相关
          block_trade_apply: { type: 'warning', text: '大宗申请' },
          block_trade_apply_refund: { type: 'success', text: '大宗审核退款' },
          block_trade_settlement: { type: 'info', text: '大宗订单结算' },
          block_trade_extra_income: { type: 'success', text: '大宗额外收益' },
          block_trade_close_refund_partial: { type: 'success', text: '大宗退款' },

          // IPO相关
          ipo_subscription: { type: 'warning', text: 'IPO认缴' },
          ipo_settlement: { type: 'info', text: 'IPO订单结算' },

          // ETF相关
          block_etf_apply: { type: 'warning', text: '申请AI7.0' },
          block_etf_apply_refund: { type: 'success', text: 'AI7.0审核退款' },
          etf_subscription: { type: 'warning', text: 'AI7.0审核缴款' },
          etf_settlement: { type: 'info', text: 'AI7.0订单结算' },
          etf_principal_refund: { type: 'success', text: 'AI7.0本金返还' },

          // 日内交易相关
          financial: { type: 'warning', text: '日内购买' },
          financial_settle: { type: 'info', text: '日内收益' },
          financial_principal_refund: { type: 'success', text: '日内本金返还' },
          financial_redeem: { type: 'error', text: '日内赎回' },
          financial_earning_deduct: { type: 'error', text: '日内赎回违约金' },
          financial_redeem_fee: { type: 'error', text: '日内赎回手续费' },
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
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: row => {
        return (
          <div class="flex-center gap-12px">
            {hasAuth('delete') && (
              <NPopconfirm onPositiveClick={() => handleHidden(row.id)}>
                {{
                  default: () => '确认删除吗？',
                  trigger: () => (
                    <NButton type="info" ghost size="small">
                      删除
                    </NButton>
                  )
                }}
              </NPopconfirm>
            )}
          </div>
        );
      }
    }
  ]
});

const handleHidden = async (id: number) => {
  await hiddenStockOrder({ id });
  getData();
}

const { checkedRowKeys } = useTableOperate(data, getData);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="股票钱包流水" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
