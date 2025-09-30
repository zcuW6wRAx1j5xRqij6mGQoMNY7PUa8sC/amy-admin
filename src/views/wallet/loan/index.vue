<script setup lang="tsx">
// import { ref } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { WalletLoanList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';
import SearchBox from './modules/search-box.vue';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

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
  apiFn: WalletLoanList,
  apiParams: {
    uid: null,
    status: null,
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
      key: 'amount_total',
      title: '总贷款金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="font-bold">{row.amount_total || 0}</span>;
      }
    },
    {
      key: 'amount_used',
      title: '已用金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span>{row.amount_used || 0}</span>;
      }
    },
    {
      key: 'amount_unused',
      title: '未用金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span>{row.amount_unused || 0}</span>;
      }
    },
    {
      key: 'amount_frozen',
      title: '冻结金额',
      align: 'center',
      width: 120,
      render: row => {
        return <span class="text-red-600">{row.amount_frozen || 0}</span>;
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
      key: 'status',
      title: '钱包状态',
      align: 'center',
      width: 100,
      render: row => {
        const status = row.status;
        const type = status === 'enabled' ? 'success' : 'error';
        const text = status === 'enabled' ? '启用' : '禁用';
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
          {hasAuth('set') && (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              设置
            </NButton>
          )}
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys } = useTableOperate(
  data,
  getData
);

function edit(_id: number) {
  handleEdit(_id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="贷款钱包管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          no-add
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
        :scroll-x="1800"
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
