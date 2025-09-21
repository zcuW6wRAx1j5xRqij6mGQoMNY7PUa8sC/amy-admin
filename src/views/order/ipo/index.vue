<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { OrderClosed, OrderIPOList, OrderIPOLock, OrderIPOLockAudit, OrderIPOLockPrice } from '@/service/api/order';
import { hiddenIpo } from '@/service/api/hidden';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { isEmpty } from '@/utils/is';
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
  apiFn: OrderIPOList,
  apiParams: {
    order_code: '',
    uid: '',
    apply_status: null,
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
    { key: 'ipo_id', title: 'IPO ID', align: 'center', width: 100 },
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
      key: 'apply_status',
      title: '申请状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          0: { type: 'warning', text: '待审核' },
          1: { type: 'success', text: '已中签' },
          2: { type: 'error', text: '未中签' },
          3: { type: 'error', text: '已拒绝' }
        };
        const status = statusMap[row.apply_status] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
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
    {
      key: 'payable_amount',
      title: '应缴金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.payable_amount || 0}</span>
    },
    {
      key: 'paid_amount',
      title: '已缴金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.paid_amount || 0}</span>
    },
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
          oepn: { type: 'success', text: '持仓中' },
          pending: { type: 'info', text: '待审核' },
          locked: { type: 'warning', text: '锁定' },
          closed: { type: 'error', text: '已平仓' }
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
      width: 330,
      fixed: 'right',
      render: row => (
        <NSpace>
          {/* 通过按钮 - 只在申请状态为待审核时显示 */}
          {row.apply_status === 0 && (
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

          {/* 不通过按钮 - 只在申请状态为待审核时显示 */}
          {row.apply_status === 0 && (
            <NPopconfirm onPositiveClick={() => handleReject(row.id)}>
              {{
                default: () => '确认拒绝此申请吗？',
                trigger: () => (
                  <NButton type="error" ghost size="small">
                    不通过
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}

          {/* 锁仓按钮 - 只在状态为正常时显示 */}
          {row.status === 'pending' && row.apply_status === 1 && (
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
          {row.status === 'locked' && row.apply_status === 1 && (
            <NPopconfirm onPositiveClick={() => handleLock(row.id)}>
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

          {(row.status === 'pending' || row.status === 'open') && row.apply_status === 1 && (
            <NPopconfirm onPositiveClick={() => handlePrice(row)}>
              {{
                default: () => '确认设置卖出价格？',
                trigger: () => (
                  <NButton type="error" ghost size="small">
                    预设卖出价
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}

          {/* 平仓按钮 - 只在状态为正常或锁定时显示，且申请状态为已中签 */}
          {(row.status === 'pending' || row.status === 'locked') && row.apply_status === 1 && (
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
  await hiddenIpo({ id });
  getData();
};

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

const title = ref('');
const model = ref({});
// 操作函数
function handleApprove(id: number, match_quantity: number) {
  // TODO: 实现通过功能
  if (!match_quantity) {
    visible.value = true;
    title.value = '通过审核';
    model.value = {
      id,
      match_quantity: 0,
      apply_status: 1
    };
  }
}

function handleReject(id: number) {
  // TODO: 实现不通过功能
  OrderIPOLockAudit({ id, apply_status: 2 });
}
const priceText = '预设卖出价';
async function handlePrice(data: object) {
  visible.value = true;
  title.value = priceText;
  model.value = {
    id: data.id,
    price: data.close_price
  };
}

async function handleLock(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await OrderIPOLock(id);
    loading.value = false;
    onDeleted();
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

async function handleClose(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    // TODO: 调用平仓API
    await OrderClosed({ id });
    loading.value = false;
    onDeleted();
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

const btnLoading = ref(false);
const visible = defineModel<boolean>('visible', {
  default: false
});

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}
const errorObj = ref({});
async function handleSubmit() {
  errorObj.value = {};
  if (title.value === priceText) {
    if (isEmpty(model.value.price)) {
      errorObj.value.price = '请输入价格';
    }
  } else if (isEmpty(model.value.match_quantity)) {
    errorObj.value.match_quantity = '请输入数量';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = title.value === priceText ? OrderIPOLockPrice : OrderIPOLockAudit;
  try {
    console.log(model.value);
    await action(model.value);
    window.$message?.success('操作成功');
    getData();
    closeDrawer();
  } catch (error) {
    errorObj.value = error;
  } finally {
    btnLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="IPO订单管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="4000"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
    <NDrawer v-model:show="visible" display-directive="show" :width="360">
      <NDrawerContent :title="title" :native-scrollbar="false" closable>
        <MyForm all-required :error-obj="errorObj">
          <MyFormItem v-if="priceText === title" v-model="model.price" label="请填写价格" prop-name="price" />
          <MyFormItem
            v-if="priceText !== title"
            v-model="model.match_quantity"
            label="请填写数量"
            prop-name="match_quantity"
          />
        </MyForm>
        <template #footer>
          <NSpace :size="16">
            <NButton :loading="btnLoading" @click="closeDrawer">取消</NButton>
            <NButton type="primary" :loading="btnLoading" @click="handleSubmit">确定</NButton>
          </NSpace>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped></style>
