<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag, NText } from 'naive-ui';
import dayjs from 'dayjs';
import { DepositOrderList } from '@/service/api/order';
import { hiddenDespoit } from '@/service/api/hidden';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { usePageRefresh } from '@/hooks/common/usePageRefresh';
import { useAuth } from '@/hooks/business/auth';
import SearchBox from './modules/search-box.vue';
import AuditDrawer from './modules/audit-drawer.vue';

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
  apiFn: DepositOrderList,
  apiParams: {
    uid: '',
    status: null,
    page: 1,
    range: {
      created_at: null
    },
    filter: {
      'user.remark': ''
    },
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    { key: 'uid', title: '用户ID', align: 'center', width: 100 },
    {
      key: 'user.remark',
      title: '用户备注',
      align: 'center',
      width: 120,
      render: row => <span>{row.user?.remark || '-'}</span>
    },
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
      key: 'amount',
      title: '充值金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.amount || 0}</span>
    },
    {
      key: 'status',
      title: '充值状态',
      align: 'center',
      width: 120,
      render: row => {
        const statusMap: Record<string, { type: 'warning' | 'success' | 'error'; text: string }> = {
          pending: { type: 'warning', text: '待审核' },
          approved: { type: 'success', text: '审核通过' },
          rejected: { type: 'error', text: '审核拒绝' }
        };
        const status = statusMap[row.status as string] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'created_at',
      title: '充值时间',
      align: 'center',
      width: 170,
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
        if (row.status !== 'pending') {
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
            {hasAuth('review') && (
              <NButton size="small" type="success" onClick={() => handleAudit(row.id, 'approved')}>
                审核通过
              </NButton>
            )}
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
            {hasAuth('review') && (
              <NButton size="small" type="error" onClick={() => handleAudit(row.id, 'rejected')}>
                审核拒绝
              </NButton>
            )}
          </div>
        );
      }
    }
  ]
});
// 如果收到通知，则刷新页面
usePageRefresh('money_despoit', getData);
const handleHidden = async (id: number) => {
  await hiddenDespoit({ id });
  getData();
};

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

// 审核抽屉相关
const auditDrawerVisible = ref(false);
const auditOrderId = ref<string>();
const auditType = ref<'approved' | 'rejected'>('approved');

// 审核处理
function handleAudit(id: string, type: 'approved' | 'rejected') {
  auditOrderId.value = id;
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
    <NCard title="充值订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1600"
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
      :order-id="auditOrderId"
      :audit-type="auditType"
      @submitted="handleAuditSubmitted"
    />
  </div>
</template>

<style scoped></style>
