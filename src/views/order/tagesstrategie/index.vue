<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag, NText } from 'naive-ui';
import dayjs from 'dayjs';
import { DayStrategyAudit, DayStrategyList } from '@/service/api/order';
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
  apiFn: DayStrategyList,
  apiParams: {
    uid: '',
    status: null,
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
      key: 'amount',
      title: '申请金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.amount || 0}</span>
    },
    {
      key: 'status',
      title: '申请状态',
      align: 'center',
      width: 120,
      render: row => {
        const statusMap: Record<number, { type: 'warning' | 'success' | 'error'; text: string }> = {
          0: { type: 'warning', text: '待审核' },
          1: { type: 'success', text: '审核通过' },
          2: { type: 'error', text: '审核拒绝' }
        };
        const status = statusMap[row.status as number] || { type: 'default', text: '未知' };
        return <NTag type={status.type}>{status.text}</NTag>;
      }
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
        if (row.status !== 0) {
          return <span>-</span>;
        }
        return (
          <div class="flex-center gap-12px">
            <NPopconfirm onPositiveClick={() => handleAudit(row.id, 1)}>
              {{
                default: () => '确认审核通过吗？',
                trigger: () => (
                  <NButton size="small" type="success">
                    审核通过
                  </NButton>
                )
              }}
            </NPopconfirm>
            <NPopconfirm onPositiveClick={() => handleAudit(row.id, 2)}>
              {{
                default: () => '确认审核拒绝吗？',
                trigger: () => (
                  <NButton size="small" type="error">
                    审核拒绝
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

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

// 审核处理
async function handleAudit(id: number, status: number) {
  if (loading.value) return;
  loading.value = true;

  try {
    await DayStrategyAudit({ id, status });
    window.$message?.success(`${status === 1 ? '审核通过' : '审核拒绝'}成功`);
    getDataByPage();
  } catch (error) {
    console.error('审核失败:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="日内策略申请管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1200"
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
