<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { fetchDeleteMenu, fetchGetMenuListPage } from '@/service/api/rbac';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';
import SearchBox from './modules/search-box.vue';

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
  apiFn: fetchGetMenuListPage,
  apiParams: {
    page: 1,
    page_size: 20,
    name: '',
    category: null
  },
  columns: () => [
    {
      key: 'show_name',
      title: '名称',
      align: 'center',
      width: 120,
      fixed: 'left'
    },
    {
      key: 'category',
      title: '类型',
      align: 'center',
      width: 80,
      render: row => {
        const type = row.category === 1 ? 'info' : 'warning';
        const text = row.category === 1 ? '菜单' : '按钮';
        return <NTag type={type}>{text}</NTag>;
      }
    },
    {
      key: 'url',
      title: '地址',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'desc',
      title: '注释',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'position',
      title: '排序',
      align: 'center',
      width: 80
    },
    {
      key: 'parent_name',
      title: '父级',
      align: 'center',
      width: 120
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 180,
      fixed: 'right',
      render: row => (
        <div class="flex-center gap-8px">
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
const btnLoading = ref(false);

async function handleDelete(id) {
  if (btnLoading.value) return;
  btnLoading.value = true;
  await fetchDeleteMenu({ id });
  btnLoading.value = false;
  onDeleted();
}

function edit(id) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="菜单管理" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
        :scroll-x="800"
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
