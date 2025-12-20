<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetOrderList, auditFinancial } from '@/service/api/financial';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';
import { useAuth } from '@/hooks/business/auth';
import { percentFormat } from '@/utils/utils';

const { hasAuth } = useAuth();

const appStore = useAppStore();
const AuditStatusMap = {
  pending: {
    type: 'warning',
    text: '待审核'
  },
  approved: {
    type: 'success',
    text: '已通过'
  },
  rejected: {
    type: 'error',
    text: '已拒绝'
  }
}

// 状态: pending 待处理 processing 进行中 settled 已结算 rejected 审核拒绝
const StatusMap = {
  pending: {
    type: 'warning',
    text: '待处理'
  },
  processing: {
    type: 'primary',
    text: '进行中'
  },
  settled: {
    type: 'success',
    text: '已结算'
  },
  rejected: {
    type: 'error',
    text: '已拒绝'
  }
}

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
  apiFn: fetchGetOrderList,
  apiParams: {
    email: '',
    phone: '',
    status: null,
    uid: null,
    page: 1,
    page_size: 20
  },
  columns: () => [
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      width: 80,
      fixed: 'left'
    },
    {
      key: 'uid',
      title: '用户ID',
      align: 'center',
      width: 80
    },
    {
      key: 'user.remark',
      title: '用户备注',
      align: 'center',
      width: 120,
      render: row => <span>{row.user?.remark || '-'}</span>
    },
    {
      key: 'financial',
      title: '产品名称',
      align: 'center',
      minWidth: 120,
      render: row => row.financial?.name
    },
    {
      key: 'amount',
      title: '投资金额',
      align: 'center',
      width: 150
    },
    {
      key: 'daily_rate',
      title: '日收益率',
      align: 'center',
      width: 80,
      render: row => percentFormat(row.daily_rate)
    },
    {
      key: 'total_rate',
      title: '总收益率',
      align: 'center',
      width: 80,
      render: row => percentFormat(row.total_rate)
    },
    {
      key: 'duration',
      title: '期限(天)',
      align: 'center',
      width: 80,
      render: row => `${row.duration} 天`
    },
    {
      key: 'expected_total_profit',
      title: '预期总收益',
      align: 'center',
      width: 100
    },
    {
      key: 'settled_total_profit',
      title: '实际总收益',
      align: 'center',
      width: 100
    },
    {
      key: 'penalty_amount',
      title: '赎回费用',
      align: 'center',
      width: 100
    },
    {
      key: 'start_at',
      title: '开始时间',
      align: 'center',
      width: 180,
      render: row => row.start_at && dayjs(row.start_at).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      key: 'end_at',
      title: '结束时间',
      align: 'center',
      width: 180,
      render: row => row.end_at && dayjs(row.end_at).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      key: 'settled_at',
      title: '结算时间',
      align: 'center',
      width: 180,
      render: row => row.settled_at && dayjs(row.settled_at).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: row => {
        if(row.audit_status !== 'approved'){
          return <NTag type={AuditStatusMap[row.audit_status].type}>{AuditStatusMap[row.audit_status].text}</NTag>;
        }else{
            return <NTag type={StatusMap[row.status].type}>{StatusMap[row.status].text}</NTag>;
        }
      }
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: row => {
        return (
          <div class="flex-center gap-12px">
            {hasAuth('audit') && (
            <NPopconfirm onPositiveClick={() => handleAudit({ id: row.id, status: 'approved' })}>
              {{
                default: () => '确认通过吗？',
                trigger: () => (
                  <NButton type="success" ghost size="small">
                    通过
                  </NButton>
                )
              }}
            </NPopconfirm>)}
            {hasAuth('audit') && (
            <NPopconfirm onPositiveClick={() => handleAudit({ id: row.id, status: 'rejected' })}>
              {{
                default: () => '确认拒绝吗？',
                trigger: () => (
                  <NButton type='error' ghost size="small">
                    拒绝
                  </NButton>
                )
              }}
            </NPopconfirm>)}
          </div>
        );
      }
    }
  ]
});

const handleAudit = async (params: { id: number, status: string }) => {
  await auditFinancial(params);
  getData();
};
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="理财订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
