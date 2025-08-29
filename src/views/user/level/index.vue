<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { UserLevelDelete, UserLevelList } from '@/service/api/user';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';

const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination } = useTable({
  apiFn: UserLevelList,
  apiParams: {
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'slug',
      title: '等级标识',
      align: 'center',
      width: 120,
      render: row => <span>{row.slug || '-'}</span>
    },
    {
      key: 'name_en',
      title: '英文名称',
      align: 'center',
      width: 120,
      render: row => <span>{row.name_en || '-'}</span>
    },
    {
      key: 'name_es',
      title: '西班牙名称',
      align: 'center',
      width: 120,
      render: row => <span>{row.name_es || '-'}</span>
    },
    {
      key: 'name_jp',
      title: '日语名称',
      align: 'center',
      width: 120,
      render: row => <span>{row.name_jp || '-'}</span>
    },
    {
      key: 'name_kr',
      title: '韩语名称',
      align: 'center',
      width: 120,
      render: row => <span>{row.name_kr || '-'}</span>
    },
    {
      key: 'despoit_money',
      title: '充值金额',
      align: 'center',
      width: 120,
      render: row => <span>{row.despoit_money || 0}</span>
    },
    {
      key: 'high_yield_rate',
      title: '高收益比例',
      align: 'center',
      width: 120,
      render: row => <span>{row.high_yield_rate || 0}%</span>
    },
    {
      key: 'high_yield_amount_rate',
      title: '高收益金额比例',
      align: 'center',
      width: 140,
      render: row => <span>{row.high_yield_amount_rate || 0}%</span>
    },
    { key: 'created_at', title: '创建时间', align: 'center', width: 160 },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: row => (
        <div class="flex-center gap-12px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => '确认删除吗？',
              trigger: () => (
                <NButton type="error" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

// 删除
async function handleDelete(id: number) {
  if (loading.value) return;
  loading.value = true;
  try {
    await UserLevelDelete({ id });
    loading.value = false;
    onDeleted();
  } catch {
  } finally {
    loading.value = false;
  }
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="用户等级管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
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
        :scroll-x="1400"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <OperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
