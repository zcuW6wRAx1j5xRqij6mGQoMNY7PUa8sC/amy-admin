<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag, NImage } from 'naive-ui';
import { WebsiteBannerList, WebsiteDelBanner } from '@/service/api/website';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { setBaseUrl } from '@/utils/utils';
import OperateDrawer from './modules/operate-drawer.vue';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

const appStore = useAppStore();

// 表格相关
const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  mobilePagination
} = useTable({
  apiFn: WebsiteBannerList,
  apiParams: {
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'ID', align: 'center', width: 80, fixed: 'left' },
    {
      key: 'img_path',
      title: '图片',
      align: 'center',
      width: 120,
      render: row => {
        if (row.img_path) {
          return <NImage src={setBaseUrl(row.img_path)} width={80} height={60} object-fit="cover" />;
        }
        return <span>-</span>;
      }
    },
    {
      key: 'link_url',
      title: '跳转链接',
      align: 'center',
      width: 200,
      render: row => <span>{row.link_url || '-'}</span>
    },
    {
      key: 'platform',
      title: '平台',
      align: 'center',
      width: 100,
      render: row => {
        const platformMap = {
          app: { type: 'success', text: 'APP' },
          web: { type: 'info', text: 'WEB' }
        };
        const config = platformMap[row.platform] || { type: 'default', text: row.platform };
        return <NTag type={config.type}>{config.text}</NTag>;
      }
    },
    {
      key: 'sort',
      title: '排序',
      align: 'center',
      width: 80,
      render: row => <span>{row.sort || 0}</span>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        const statusMap = {
          0: { type: 'error', text: '不展示' },
          1: { type: 'success', text: '展示' }
        };
        const config = statusMap[row.status] || { type: 'default', text: '未知' };
        return <NTag type={config.type}>{config.text}</NTag>;
      }
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
          {hasAuth('edit') && (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              编辑
            </NButton>
          )}
          {hasAuth('delete') && (
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => '确认删除吗？',
              trigger: () => (
                <NButton type="error" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>)}
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
    await WebsiteDelBanner({ id });
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
    <NCard title="Banner管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :no-add="!hasAuth('add')"
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

<style scoped></style>
