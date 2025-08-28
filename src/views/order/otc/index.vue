<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { OrderOtcList } from '@/service/api/order';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';

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
  apiFn: OrderOtcList,
  apiParams: {
    order_code: '',
    uid: '',
    status: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    { key: 'uid', title: '用户ID', align: 'center', width: 100 },
    { key: 'user.nickname', title: '用户昵称', align: 'center', width: 120, render: row => row.user?.nickname || '-' },
    { key: 'stock_id', title: '股票ID', align: 'center', width: 100 },
    { key: 'stock.name', title: '股票名称', align: 'center', width: 120, render: row => row.stock?.name || '-' },
    { key: 'stock.symbol', title: '股票代码', align: 'center', width: 120, render: row => row.stock?.symbol || '-' },
    { key: 'block_trade_id', title: '大宗ID', align: 'center', width: 100 },
    {
      key: 'apply_price',
      title: '申请价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.apply_price || 0}</span>
    },
    {
      key: 'apply_quantity',
      title: '申请数量',
      align: 'center',
      width: 120,
      render: row => <span>{row.apply_quantity || 0}</span>
    },
    {
      key: 'match_price',
      title: '成交价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.match_price || 0}</span>
    },
    {
      key: 'match_quantity',
      title: '成交数量',
      align: 'center',
      width: 120,
      render: row => <span>{row.match_quantity || 0}</span>
    },
    {
      key: 'close_price',
      title: '平仓价格',
      align: 'center',
      width: 120,
      render: row => <span>{row.close_price || 0}</span>
    },
    {
      key: 'close_time',
      title: '平仓时间',
      align: 'center',
      width: 160,
      render: row => <span>{row.close_time || '-'}</span>
    },
    { key: 'leverage', title: '杠杆', align: 'center', width: 100, render: row => <span>{row.leverage || 0}x</span> },
    { key: 'volume', title: '仓位价值', align: 'center', width: 120, render: row => <span>{row.volume || 0}</span> },
    { key: 'profit', title: '盈利', align: 'center', width: 120, render: row => <span>{row.profit || 0}</span> },
    {
      key: 'open_fee',
      title: '开仓手续费',
      align: 'center',
      width: 120,
      render: row => <span>{row.open_fee || 0}</span>
    },
    {
      key: 'close_fee',
      title: '平仓手续费',
      align: 'center',
      width: 120,
      render: row => <span>{row.close_fee || 0}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          wait_subscription: { type: 'warning', text: '等待认购' },
          pending: { type: 'info', text: '待处理' },
          open: { type: 'success', text: '开放' },
          locked: { type: 'warning', text: '锁定' },
          rejected: { type: 'error', text: '已拒绝' },
          closed: { type: 'error', text: '已平仓' }
        };
        const status = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    { key: 'created_at', title: '创建时间', align: 'center', width: 160 },
    { key: 'updated_at', title: '更新时间', align: 'center', width: 160 },
    {
      key: 'actions',
      title: '操作',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: row => (
        <NSpace>
          {/* 通过按钮 - 只在状态为等待认购时显示 */}
          {row.status === 'wait_subscription' && (
            <NPopconfirm onPositiveClick={() => handleApprove(row.id)}>
              {{
                default: () => '确认通过此申请吗？',
                trigger: () => (
                  <NButton type="success" ghost size="small">
                    通过
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}

          {/* 拒绝按钮 - 只在状态为等待认购时显示 */}
          {row.status === 'wait_subscription' && (
            <NPopconfirm onPositiveClick={() => handleReject(row.id)}>
              {{
                default: () => '确认拒绝此申请吗？',
                trigger: () => (
                  <NButton type="error" ghost size="small">
                    拒绝
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}

          {/* 锁仓按钮 - 只在状态为开放时显示 */}
          {row.status === 'open' && (
            <NPopconfirm onPositiveClick={() => handleLock(row.id)}>
              {{
                default: () => '确认锁仓此订单吗？',
                trigger: () => (
                  <NButton type="warning" ghost size="small">
                    锁仓
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}

          {/* 解锁按钮 - 只在状态为锁定时显示 */}
          {row.status === 'locked' && (
            <NPopconfirm onPositiveClick={() => handleUnlock(row.id)}>
              {{
                default: () => '确认解锁此订单吗？',
                trigger: () => (
                  <NButton type="info" ghost size="small">
                    解锁
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}

          {/* 平仓按钮 - 只在状态为开放或锁定时显示 */}
          {(row.status === 'open' || row.status === 'locked') && (
            <NPopconfirm onPositiveClick={() => handleClose(row.id)}>
              {{
                default: () => '确认平仓此订单吗？',
                trigger: () => (
                  <NButton type="error" ghost size="small">
                    平仓
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}
        </NSpace>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

// 操作函数
function handleApprove(id: number) {
  // TODO: 实现通过功能
  console.log('通过订单:', id);
}

function handleReject(id: number) {
  // TODO: 实现拒绝功能
  console.log('拒绝订单:', id);
}

function handleLock(id: number) {
  // TODO: 实现锁仓功能
  console.log('锁仓订单:', id);
}

function handleUnlock(id: number) {
  // TODO: 实现解锁功能
  console.log('解锁订单:', id);
}

async function handleClose(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    // TODO: 调用平仓API
    console.log('平仓订单:', id);
    loading.value = false;
    onDeleted();
  } catch (error) {
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="OTC订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="3000"
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
