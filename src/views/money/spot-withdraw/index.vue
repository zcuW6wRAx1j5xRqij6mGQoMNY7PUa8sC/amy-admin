<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NTag, NText, NPopconfirm } from 'naive-ui';
import dayjs from 'dayjs';
import { SpotWithdrawList } from '@/service/api/order';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { usePageRefresh } from '@/hooks/common/usePageRefresh';
import SearchBox from './modules/search-box.vue';
import AuditDrawer from './modules/audit-drawer.vue';
import { hiddenSpotWithdraw } from '@/service/api/hidden';

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
  apiFn: SpotWithdrawList,
  apiParams: {
    uid: '',
    audit_status: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    { key: 'uid', title: '用户ID', align: 'center', width: 100 },
    {
      key: 'user.name',
      title: '用户姓名',
      align: 'center',
      width: 120,
      render: row => <span>{row.user?.name || '-'}</span>
    },
    {
      key: 'user.email',
      title: '用户邮箱',
      align: 'center',
      width: 150,
      render: row => <span>{row.user?.email || '-'}</span>
    },
    {
      key: 'user.phone',
      title: '用户手机',
      align: 'center',
      width: 120,
      render: row => (
        <NText>
          {row.user?.phone_code ? `(${row.user.phone_code})` : ''}
          {row.user?.phone || '-'}
        </NText>
      )
    },
    {
      key: 'coin.name',
      title: '币种',
      align: 'center',
      width: 100,
      render: row => <span>{row.coin?.name || '-'}</span>
    },
    {
      key: 'amount',
      title: '申请金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.amount || 0}</span>
    },
    {
      key: 'fee',
      title: '手续费',
      align: 'center',
      width: 100,
      render: row => <span>{row.fee || 0}</span>
    },
    {
      key: 'real_amount',
      title: '实际到账',
      align: 'center',
      width: 120,
      render: row => <span>{row.real_amount || 0}</span>
    },
    {
      key: 'receive_wallet_address',
      title: '收款地址',
      align: 'center',
      width: 200,
      render: row => <span>{row.receive_wallet_address || '-'}</span>
    },
    {
      key: 'audit_status',
      title: '审核状态',
      align: 'center',
      width: 120,
      render: row => {
        const statusMap: Record<number, { type: 'warning' | 'success' | 'error'; text: string }> = {
          0: { type: 'warning', text: '待审核' },
          1: { type: 'success', text: '审核通过' },
          2: { type: 'error', text: '审核驳回' }
        };
        const status = statusMap[row.audit_status as number] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'status',
      title: '提现状态',
      align: 'center',
      width: 120,
      render: row => {
        const statusMap: Record<number, { type: 'warning' | 'success' | 'error'; text: string }> = {
          0: { type: 'warning', text: '申请中' },
          1: { type: 'success', text: '到账' },
          2: { type: 'error', text: '失败' }
        };
        const status = statusMap[row.status as number] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'reason',
      title: '拒绝原因',
      align: 'center',
      width: 150,
      render: row => <span>{row.reason || '-'}</span>
    },
    {
      key: 'created_at',
      title: '申请时间',
      align: 'center',
      width: 160,
      render: row => <NText>{row.created_at && dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</NText>
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: row => {
        // 只有待审核状态才显示操作按钮
        if (row.audit_status !== 0) {
          return (
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
          );
        }
        return (
          <div class="flex-center gap-12px">
            <NButton size="small" type="success" onClick={() => handleAudit(row.id, 1)}>
              审核通过
            </NButton>
            <NButton size="small" type="error" onClick={() => handleAudit(row.id, 2)}>
              审核驳回
            </NButton>
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
          </div>
        );
      }
    }
  ]
});

// 删除处理
async function handleHidden(id: number) {
  await hiddenSpotWithdraw({ id });
  getData();
}

// 如果收到通知，则刷新页面
usePageRefresh('money_spot-withdraw', getData);
const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

// 审核抽屉相关
const auditDrawerVisible = ref(false);
const auditWithdrawId = ref<number>();
const auditType = ref<1 | 2>(1);

// 审核处理
function handleAudit(id: number, type: 1 | 2) {
  auditWithdrawId.value = id;
  auditType.value = type;
  auditDrawerVisible.value = true;
}

// 处理审核提交
function handleAuditSubmitted() {
  auditDrawerVisible.value = false;
  getData();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="现货提现管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
    </NCard>

    <!-- 审核抽屉 -->
    <AuditDrawer
      v-model:visible="auditDrawerVisible"
      :withdraw-id="auditWithdrawId"
      :audit-type="auditType"
      @submitted="handleAuditSubmitted"
    />
  </div>
</template>

<style scoped></style>
