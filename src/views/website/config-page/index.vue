<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { WebsiteConfigList, WebsiteDelConfig } from '@/service/api/website';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import SearchBox from './modules/search-box.vue';
import OperateDrawer from './modules/operate-drawer.vue';

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
  apiFn: WebsiteConfigList,
  apiParams: {
    key: '',
    group: '',
    value_type: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    { key: 'group', title: '配置分组', align: 'center', width: 120 },
    { key: 'key', title: '配置键', align: 'center', width: 150 },
    {
      key: 'value_type',
      title: '配置类型',
      align: 'center',
      width: 100,
      render: row => {
        const typeMap = {
          string: { type: 'success', text: '字符串' },
          integer: { type: 'info', text: '整数' },
          boolean: { type: 'warning', text: '布尔值' },
          json: { type: 'error', text: 'JSON' }
        };
        const type = typeMap[row.value_type] || { type: 'default', text: '未知' };
        return <NTag type={type.type}>{type.text}</NTag>;
      }
    },
    { key: 'value', title: '配置值', align: 'center', width: 200, render: row => <span>{row.value || '-'}</span> },
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
    await WebsiteDelConfig({ id });
    loading.value = false;
    onDeleted();
  } catch (error) {
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
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="配置管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1000"
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
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
