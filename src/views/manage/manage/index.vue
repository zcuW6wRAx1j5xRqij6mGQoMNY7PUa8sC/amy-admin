<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import {
  fetchDeleteAdmin,
  fetchGetAdminList,
  fetchGetAdminRoleList,
} from '@/service/api/rbac';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';
import SearchBox from './modules/search-box.vue';
// import BindLeaderDrawer from './modules/bind-leader-drawer.vue';

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
  apiFn: fetchGetAdminList,
  apiParams: {
    page: 1,
    page_size: 20,
    role_id: null
  },
  columns: () => [
    {
      key: 'username',
      title: '用户名',
      align: 'center',
      width: 120
    },
    {
      key: 'role_name',
      title: '角色',
      align: 'center',
      width: 120,
      render: row => {
        if (!row.role_id) return '-';
        return <NTag type="info">{roleOptions.value[row.role_id]}</NTag>;
      }
    },
    {
      key: 'parent_name',
      title: '组长',
      align: 'center',
      width: 120,
      render: row => {
        if (!row.parent) return '-';
        return <NTag type="info">{row.parent.nickname}</NTag>;
      }
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 280,
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
const bindLeaderVisible = ref(false);
const currentRow = ref<any>(null);

async function handleDelete(id) {
  if (btnLoading.value) return;
  btnLoading.value = true;
  await fetchDeleteAdmin({ id });
  btnLoading.value = false;
  onDeleted();
}

function edit(id) {
  handleEdit(id);
}

const roleList = ref([]);
const roleOptions = ref([]);

// 获取角色列表
async function getRoleList() {
  const data = await fetchGetAdminRoleList();
  roleList.value = Object.entries(data).map(([key, value]) => ({ label: value, value: key }));
  roleOptions.value = data;
}
getRoleList();

</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SearchBox v-model:model="searchParams" :role-list="roleList" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="管理员管理" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
      <!-- <BindLeaderDrawer v-model:visible="bindLeaderVisible" :row-data="currentRow" @submitted="getData" /> -->
    </NCard>
  </div>
</template>

<style scoped></style>
