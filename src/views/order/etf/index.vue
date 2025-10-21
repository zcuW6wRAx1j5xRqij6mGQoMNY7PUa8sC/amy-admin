<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { EtfOrderAudit, EtfOrderList } from '@/service/api/etf';
import { hiddenEtf } from '@/service/api/hidden';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import SearchBox from './modules/search-box.vue';

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
  apiFn: EtfOrderList,
  apiParams: {
    uid: null,
    product_id: null,
    status: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'uid',
      title: '用户ID',
      align: 'center',
      width: 100,
      render: row => <span>{row.uid || '-'}</span>
    },
    {
      key: 'user.remark',
      title: '用户备注',
      align: 'center',
      width: 120,
      render: row => <span>{row.user?.remark || '-'}</span>
    },
    {
      key: 'product.name',
      title: '产品名称',
      align: 'center',
      width: 150,
      render: row => <span>{row.product?.name || '-'}</span>
    },
    {
      key: 'amount',
      title: '买入金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.amount || '-'}</span>
    },
    {
      key: 'daily_profit_rate',
      title: '日收益率(%)',
      align: 'center',
      width: 120,
      render: row => <span>{row.daily_profit_rate ? `${row.daily_profit_rate}%` : '-'}</span>
    },
    {
      key: 'daily_profit',
      title: '日收益',
      align: 'center',
      width: 120,
      render: row => <span>{row.daily_profit || '-'}</span>
    },
    {
      key: 'profit',
      title: '总收益',
      align: 'center',
      width: 120,
      render: row => <span>{row.profit || '-'}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          0: { type: 'warning', text: '待审核' },
          1: { type: 'error', text: '已拒绝' },
          2: { type: 'success', text: '已通过' },
          3: { type: 'info', text: '已结清' }
        };
        const status = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    { key: 'created_at', title: '创建时间', align: 'center', width: 160 },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: row => {
        // 只有待审核状态的订单才显示审核按钮
        if (row.status === 0) {
          return (
            <div class="flex-center gap-12px">
              {hasAuth('review') && (
                <NPopconfirm onPositiveClick={() => handleAudit(row.id, 2)} positiveText="确定" negativeText="取消">
                  {{
                    trigger: () => (
                      <NButton size="small" type="success">
                        通过
                      </NButton>
                    ),
                    default: () => '确定要通过这个ETF订单吗？'
                  }}
                </NPopconfirm>
              )}
              {hasAuth('review') && (
                <NPopconfirm onPositiveClick={() => handleAudit(row.id, 1)} positiveText="确定" negativeText="取消">
                  {{
                    trigger: () => (
                      <NButton size="small" type="error">
                        拒绝
                      </NButton>
                    ),
                    default: () => '确定要拒绝这个ETF订单吗？'
                  }}
                </NPopconfirm>
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
            </div>
          );
        }
        return (
          <div class="flex-center gap-12px">
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

const handleHidden = async (id: number) => {
  await hiddenEtf({ id });
  getData();
};

// 处理审核操作
async function handleAudit(orderId: number, type: 1 | 2) {
  try {
    await EtfOrderAudit({
      id: orderId,
      status: type
    });

    const successMsg = type === 2 ? '审核通过成功' : '审核拒绝成功';
    window.$message?.success(successMsg);
    getData(); // 刷新列表
  } catch (error: any) {
    console.error('审核失败:', error);
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="ETF订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @refresh="getData" />
      </template>

      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="2000"
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
