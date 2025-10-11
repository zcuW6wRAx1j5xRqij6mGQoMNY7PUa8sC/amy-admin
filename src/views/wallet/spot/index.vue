<script setup lang="tsx">
import { ref } from 'vue';
import { NTag } from 'naive-ui';
import { WalletSpotList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { setBaseUrl } from '@/utils/utils';
import SearchBox from './modules/search-box.vue';
import SpotFundDrawer from './modules/fund-drawer.vue';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination,searchParams,
  resetSearchParams,getDataByPage } = useTable({
  apiFn: WalletSpotList,
  apiParams: {
    page: 1,
    size: 20,
    uid: null,
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
      key: 'coin.name',
      title: '币种',
      align: 'center',
      width: 100,
      render: row => row.coin?.name || '-'
    },
    {
      key: 'amount',
      title: '数量',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="font-bold">{row.amount || 0}</span>;
      }
    },
    {
      key: 'lock_amount',
      title: '锁定数量',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-red-600">{row.lock_amount || 0}</span>;
      }
    },
    {
      key: 'usdt_value',
      title: 'USDT价值',
      align: 'center',
      width: 120,
      render: row => {
        return <span>${row.usdt_value || 0}</span>;
      }
    },
    {
      key: 'coin.status',
      title: '币种状态',
      align: 'center',
      width: 100,
      render: row => {
        const status = row.coin?.status;
        const type = status ? 'success' : 'error';
        const text = status ? '正常' : '禁用';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'coin.allow_deposit',
      title: '允许充值',
      align: 'center',
      width: 100,
      render: row => {
        const allowDeposit = row.coin?.allow_deposit;
        const type = allowDeposit ? 'success' : 'error';
        const text = allowDeposit ? '是' : '否';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'coin.allow_withdraw',
      title: '允许提现',
      align: 'center',
      width: 100,
      render: row => {
        const allowWithdraw = row.coin?.allow_withdraw;
        const type = allowWithdraw ? 'success' : 'error';
        const text = allowWithdraw ? '是' : '否';
        return <NTag type={type}>{text}</NTag>;
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
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: row => (
        <div class="flex-center gap-12px">
          {hasAuth('edit') && (
            <NButton type="primary" ghost size="small" onClick={() => handleFundChange(row.id)}>
              金额变动
            </NButton>
          )}
        </div>
      )
    }
  ]
});

const { checkedRowKeys } = useTableOperate(data, getData);
// 金额变动相关
const fundDrawerVisible = ref(false);
const currentWalletId = ref<number | null>(null);

function handleFundChange(id: number) {
  currentWalletId.value = id;
  fundDrawerVisible.value = true;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="数字货币现货钱包管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1600"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
    <!-- 金额变动抽屉 -->
    <SpotFundDrawer v-model:visible="fundDrawerVisible" :wallet-id="currentWalletId" @success="getData" />
  </div>
</template>

<style scoped></style>
