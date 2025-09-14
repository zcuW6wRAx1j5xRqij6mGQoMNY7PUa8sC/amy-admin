<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NImage, NPopconfirm, NTag } from 'naive-ui';
import { WebsiteDelNotice, WebsiteNoticeList } from '@/service/api/website';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';

const appStore = useAppStore();

// 表格相关
const { columns, columnChecks, data, loading, getData, mobilePagination } = useTable({
  apiFn: WebsiteNoticeList,
  apiParams: {
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'subject',
      title: '主题',
      align: 'center',
      width: 200
    },
    {
      key: 'content',
      title: '内容',
      align: 'center',
      width: 200,
      render: row => {
        // 移除 HTML 标签，只保留纯文本内容
        const plainText = row.content?.replace(/<[^>]*>/g, '') || '';
        return <div class="text-ellipsis-2">{plainText}</div>;
      }
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          1: { type: 'error', text: '正常' },
          2: { type: 'success', text: '禁用' }
        };
        const config = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={config.type}>{config.text}</NTag>;
      }
    },
    { key: 'start_time', title: '开始时间', align: 'center', width: 160 },
    { key: 'end_time', title: '结束时间', align: 'center', width: 160 },
    { key: 'created_at', title: '创建时间', align: 'center', width: 160 },
    { key: 'updated_at', title: '更新时间', align: 'center', width: 160 },
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
    await WebsiteDelNotice({ id });
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
    <NCard title="公告管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped>
.text-ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
