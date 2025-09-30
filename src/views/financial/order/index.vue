<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetOrderList } from '@/service/api/financial';
import { hiddenFinancial } from '@/service/api/hidden';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

const appStore = useAppStore();

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
      width: 80
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
      render: row => row.financial?.name
    },
    {
      key: 'amount',
      title: '投资金额',
      align: 'center'
    },
    {
      key: 'daily_rate',
      title: '日收益率',
      align: 'center',
      render: row => `${row.daily_rate}%`
    },
    {
      key: 'total_rate',
      title: '总收益率',
      align: 'center',
      render: row => `${row.total_rate}%`
    },
    {
      key: 'duration',
      title: '期限(天)',
      align: 'center'
    },
    {
      key: 'expected_total_profit',
      title: '预期总收益',
      align: 'center'
    },
    {
      key: 'settled_total_profit',
      title: '实际总收益',
      align: 'center'
    },
    {
      key: 'penalty_amount',
      title: '赎回费用',
      align: 'center'
    },
    {
      key: 'start_at',
      title: '开始时间',
      align: 'center',
      render: row => row.start_at && dayjs(row.start_at).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      key: 'end_at',
      title: '结束时间',
      align: 'center',
      render: row => row.end_at && dayjs(row.end_at).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      key: 'settled_at',
      title: '结算时间',
      align: 'center',
      render: row => row.settled_at && dayjs(row.settled_at).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      render: row => {
        const type = row.status === 'pending' ? 'warning' : 'success';
        const text = row.status === 'pending' ? '进行中' : '已结算';
        return <NTag type={type}>{text}</NTag>;
      }
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
            </NPopconfirm>)}
          </div>
        );
      }
    }
  ]
});

const handleHidden = async (id: number) => {
  await hiddenFinancial({ id });
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
