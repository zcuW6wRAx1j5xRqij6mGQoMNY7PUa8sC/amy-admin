<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag, useMessage } from 'naive-ui';
import { OrderStockList, OrderMarketLockOrUnlock,OrderMarketHidden} from '@/service/api/order';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';
import AuditDrawer from './modules/audit-drawer.vue';
import CloseDrawer from './modules/close-drawer.vue';
import CreateDrawer from './modules/create-drawer.vue';

const appStore = useAppStore();
const message = useMessage();

// 审核弹窗相关
const auditDrawerVisible = ref(false);
const auditType = ref<'approve' | 'reject'>('approve');
const currentRowData = ref<any>(null);

// 平仓弹窗相关
const closeDrawerVisible = ref(false);
const closeRowData = ref<any>(null);

// 建仓弹窗相关
const createDrawerVisible = ref(false);

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
  apiFn: OrderStockList,
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
    {
      key: 'user.remark',
      title: '用户备注',
      align: 'center',
      width: 120,
      render: row => <span>{row.user?.remark || '-'}</span>
    },
    { key: 'user.nickname', title: '用户昵称', align: 'center', width: 120, render: row => row.user?.nickname || '-' },
    { key: 'stock_id', title: '股票ID', align: 'center', width: 100 },
    { key: 'stock.name', title: '股票名称', align: 'center', width: 120, render: row => row.stock?.name || '-' },
    { key: 'stock.symbol', title: '股票代码', align: 'center', width: 120, render: row => row.stock?.symbol || '-' },
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
      width: 170,
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
          pending: { type: 'warning', text: '待审核' },
          open: { type: 'success', text: '持仓中' },
          locked: { type: 'warning', text: '已锁仓' },
          rejected: { type: 'error', text: '已拒绝' },
          closed: { type: 'error', text: '已平仓' }
        };
        const status = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
    },
    { key: 'created_at', title: '申请时间', align: 'center', width: 160 },
    {
      key: 'actions',
      title: '操作',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: row => (
        <NSpace>
          {/* 通过按钮 - 只在状态为待审核时显示 */}
          {row.status === 'pending' && (
            <NButton type="success" ghost size="small" onClick={() => handleApprove(row)}>
              通过
            </NButton>
          )}

          {/* 拒绝按钮 - 只在状态为待审核时显示 */}
          {row.status === 'pending' && (
            <NButton type="error" ghost size="small" onClick={() => handleReject(row)}>
              拒绝
            </NButton>
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
            <NButton type="error" ghost size="small" onClick={() => handleClose(row)}>
              平仓
            </NButton>
          )}
          {/* 隐藏订单 */}
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
        </NSpace>
      )
    }
  ]
});

const handleHidden = async (id: number) => {
  await OrderMarketHidden({ id });
  getData();
};
const { checkedRowKeys } = useTableOperate(data, getData);

// 操作函数
function handleApprove(row: any) {
  currentRowData.value = row;
  auditType.value = 'approve';
  auditDrawerVisible.value = true;
}

function handleReject(row: any) {
  currentRowData.value = row;
  auditType.value = 'reject';
  auditDrawerVisible.value = true;
}

async function handleLock(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await OrderMarketLockOrUnlock({ id, status: 'locked' });
    message.success('订单已锁仓');
    getData();
  } catch (error) {
    console.error('锁仓失败:', error);
  } finally {
    loading.value = false;
  }
}

async function handleUnlock(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await OrderMarketLockOrUnlock({ id, status: 'open' });
    message.success('订单已解锁');
    getData();
  } catch (error) {
    console.error('解锁失败:', error);
  } finally {
    loading.value = false;
  }
}

async function handleClose(row: any) {
  closeRowData.value = row;
  closeDrawerVisible.value = true;
}

function handleCreate() {
  createDrawerVisible.value = true;
}
</script>
          <!-- @add="handleCreate" -->
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" /> -->
    <NCard title="OTC订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="3000"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
    <AuditDrawer
      v-model:visible="auditDrawerVisible"
      :audit-type="auditType"
      :row-data="currentRowData"
      @submitted="getData"
    />
    <CloseDrawer v-model:visible="closeDrawerVisible" :row-data="closeRowData" @submitted="getData" />
    <CreateDrawer v-model:visible="createDrawerVisible" @submitted="getData" />
  </div>
</template>

<style scoped></style>
