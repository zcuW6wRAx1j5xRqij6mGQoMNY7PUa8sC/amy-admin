<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import {
  fetchAssignPermission,
  fetchDeleteRole,
  fetchGetMenuList,
  fetchGetRoleDetail,
  fetchGetRoleListPage
} from '@/service/api/rbac';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();

const appStore = useAppStore();

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useTable({
  apiFn: fetchGetRoleListPage,
  apiParams: {
    page: 1,
    page_size: 20
  },
  columns: () => [
    {
      key: 'show_name',
      title: '名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'desc',
      title: '注释',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 220,
      render: row => (
        <div class="flex-center gap-8px">
          {hasAuth('assign') && (
            <NButton type="primary" ghost size="small" onClick={() => assHandle(row)}>
              分配权限
            </NButton>
          )}
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
            </NPopconfirm>
          )}
        </div>
      )
    }
  ]
});

const btnLoading = ref(false);
const assignVisible = ref(false);
const treeRef = ref();
const treeData = ref([]);
const menuIds = ref([]);
const assId = ref();
const lastIds = ref([]);
const assignOptions = ref([]);

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
  data,
  getData
);

async function handleDelete(id) {
  if (btnLoading.value) return;
  btnLoading.value = true;
  await fetchDeleteRole({ id });
  btnLoading.value = false;
  onDeleted();
}

function edit(id) {
  handleEdit(id);
}

function assHandle(row) {
  menuIds.value = [];
  fetchGetRoleDetail(row).then(data => {
    const ids = data?.menuIds || [];
    menuIds.value = ids.map(Number).filter(id => lastIds.value.includes(id));
    assId.value = row.id;
    assignVisible.value = true;
  });
}

const updateCheckedKeys = (_, options) => {
  assignOptions.value = options;
};

onMounted(() => {
  const ids = [];
  fetchGetMenuList().then(res => {
    treeData.value = res.rows.map(el => {
      el.show_name = `${el.show_name}(${el.id})`;
      if (el.children && el.children.length > 0) {
        el.children = el.children?.map(cel => {
          cel.show_name = `${cel.show_name}(${cel.id})`;
          if (cel.children && cel.children.length > 0) {
            cel.children = cel.children?.map(cels => {
              ids.push(Number(cels.id));
              cels.show_name = `${cels.show_name}(${cels.id})`;
              return cels;
            });
          } else {
            ids.push(Number(cel.id));
          }
          return cel;
        });
      } else {
        ids.push(Number(el.id));
      }
      return el;
    });
    lastIds.value = ids;
  });
});

const assignHandleConfirm = () => {
  const checkIds = [];
  assignOptions.value.forEach(el => {
    if (el.parent_id) {
      checkIds.push(el.parent_id);
    }
    checkIds.push(el.id);
  });
  return fetchAssignPermission({
    menuIds: checkIds,
    id: assId.value
  }).then(() => {
    window.$message?.success('操作成功');
    assignVisible.value = false;
    getData();
  });
};
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="角色管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="702"
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
    <ObDialog v-model:visible="assignVisible" title="权限分配" :handle-confirm="assignHandleConfirm">
      <NTree
        ref="treeRef"
        :data="treeData"
        cascade
        :selectable="false"
        key-field="id"
        label-field="show_name"
        checkable
        :default-checked-keys="menuIds"
        @update:checked-keys="updateCheckedKeys"
      />
    </ObDialog>
  </div>
</template>

<style scoped></style>
