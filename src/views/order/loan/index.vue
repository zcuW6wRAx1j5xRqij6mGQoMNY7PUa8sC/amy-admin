<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NTag, NPopconfirm } from 'naive-ui';
import { LoanOrderList } from '@/service/api/order';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';
import RepaymentModal from './modules/repayment-modal.vue';
import StatusModal from './modules/status-modal.vue';
import AuditModal from './modules/audit-modal.vue';
import { hiddenLoan } from '@/service/api/hidden';

const appStore = useAppStore();

// 还款弹窗
const repaymentModalVisible = ref(false);
const currentOrder = ref<any>(null);

// 状态更新弹窗
const statusModalVisible = ref(false);
const statusOrder = ref<any>(null);

// 审核弹窗
const auditModalVisible = ref(false);
const auditOrder = ref<any>(null);

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
  apiFn: LoanOrderList,
  apiParams: {
    uid: null,
    status: null,
    repayment_status: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'order_no',
      title: '订单编号',
      align: 'center',
      width: 150,
      render: row => <span class="text-xs font-mono">{row.order_no || '-'}</span>
    },
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
      key: 'apply_amount',
      title: '申请金额',
      align: 'center',
      width: 120,
      render: row => <span class="font-bold">{row.apply_amount || 0}</span>
    },
    {
      key: 'approved_amount',
      title: '审批金额',
      align: 'center',
      width: 120,
      render: row => <span class="font-bold">{row.approved_amount || 0}</span>
    },
    {
      key: 'interest_rate',
      title: '利率(%)',
      align: 'center',
      width: 100,
      render: row => <span>{row.interest_rate ? `${row.interest_rate}%` : '-'}</span>
    },
    {
      key: 'due_amount',
      title: '待还金额',
      align: 'center',
      width: 120,
      render: row => <span class="font-bold">{row.due_amount || 0}</span>
    },
    {
      key: 'repayment_amount',
      title: '已还金额',
      align: 'center',
      width: 120,
      render: row => <span class="font-bold">{row.repayment_amount || 0}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          pending: { type: 'warning', text: '待审核' },
          approved: { type: 'success', text: '已通过' },
          rejected: { type: 'error', text: '已拒绝' },
          cancelled: { type: 'info', text: '已取消' },
          completed: { type: 'success', text: '已完成' }
        };
        const status = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    {
      key: 'repayment_status',
      title: '还款状态',
      align: 'center',
      width: 120,
      render: row => {
        const repaymentStatusMap = {
          unpaid: { type: 'warning', text: '未还款' },
          partial: { type: 'info', text: '部分还款' },
          paid: { type: 'success', text: '已还清' },
          overdue: { type: 'error', text: '逾期' },
          cancelled: { type: 'default', text: '已取消' },
          written_off: { type: 'default', text: '已核销' }
        };
        const repaymentStatus = repaymentStatusMap[row.repayment_status] || { type: 'default', text: '未知' };
        return <NTag type={repaymentStatus.type}>{repaymentStatus.text}</NTag>;
      }
    },
    {
      key: 'approved_at',
      title: '审批时间',
      align: 'center',
      width: 170,
      render: row => <span>{row.approved_at || '-'}</span>
    },
    {
      key: 'completed_at',
      title: '完成时间',
      align: 'center',
      width: 170,
      render: row => <span>{row.completed_at || '-'}</span>
    },
    { key: 'created_at', title: '创建时间', align: 'center', width: 160 },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: row => {
        const actions = [];

        // 只有待审核状态的订单才显示审核按钮
        if (row.status === 'pending') {
          actions.push(
            <NButton size="small" type="warning" onClick={() => openAuditModal(row)}>
              审核
            </NButton>
          );
        }
        // 已通过且未还清的订单显示还款和状态更新按钮
        if (
          row.status === 'approved' &&
          row.repayment_status !== 'paid' &&
          row.repayment_status !== 'cancelled' &&
          row.repayment_status !== 'written_off'
        ) {
          actions.push(
            <NButton size="small" type="success" onClick={() => openRepaymentModal(row)}>
              还款
            </NButton>,
            <NButton size="small" type="primary" onClick={() => openStatusModal(row)}>
              更改状态
            </NButton>
          );
        }
        // 隐藏订单
        actions.push(
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
        )
        
        if (actions.length === 0) {
          return <NPopconfirm onPositiveClick={() => handleHidden(row.id)}>
            {{
              default: () => '确认删除吗？',
              trigger: () => (
                <NButton type="info" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>;
        }
        return <div class="flex-center flex-wrap gap-8px">{actions}</div>;
      }
    }
  ]
});


const handleHidden = async (id: number) => {
  await hiddenLoan({ id });
  getData();
}

// 打开审核弹窗
function openAuditModal(order: any) {
  auditOrder.value = order;
  auditModalVisible.value = true;
}

// 打开还款弹窗
function openRepaymentModal(order: any) {
  currentOrder.value = order;
  repaymentModalVisible.value = true;
}

// 打开状态更新弹窗
function openStatusModal(order: any) {
  statusOrder.value = order;
  statusModalVisible.value = true;
}

// 处理还款成功
function handleRepaymentSuccess() {
  getData(); // 刷新列表
}

// 处理状态更新成功
function handleStatusUpdateSuccess() {
  getData(); // 刷新列表
}

// 处理审核成功
function handleAuditSuccess() {
  getData(); // 刷新列表
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="贷款订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" no-add @refresh="getData" />
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="2200"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>

    <!-- 还款弹窗 -->
    <RepaymentModal v-model:visible="repaymentModalVisible" :order="currentOrder" @success="handleRepaymentSuccess" />

    <!-- 状态更新弹窗 -->
    <StatusModal v-model:visible="statusModalVisible" :order="statusOrder" @success="handleStatusUpdateSuccess" />

    <!-- 审核弹窗 -->
    <AuditModal v-model:visible="auditModalVisible" :order="auditOrder" @submitted="handleAuditSuccess" />
  </div>
</template>

<style scoped></style>
