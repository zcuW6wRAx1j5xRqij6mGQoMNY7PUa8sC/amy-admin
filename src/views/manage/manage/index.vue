<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { stautsObje } from '@/constants/business';
import { fetchAdminResetPwd, fetchDeleteAdmin, fetchGetAdminList, fetchGetAdminRoleList } from '@/service/api/rbac';
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
      key: 'name',
      title: '名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'account',
      title: '账户',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'invite_code',
      title: '邀请码',
      align: 'center',
      minWidth: 120,
      render: row => {
        return row.invite_code || '-';
      }
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      minWidth: 120,
      render: row => {
        const type = row.status === 1 ? 'success' : 'error';
        const text = row.status === 1 ? '开启' : '关闭';
        return <NTag type={type}>{text}</NTag>;
      }
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
      key: 'created_at',
      title: '创建时间',
      minWidth: 100
    },
    {
      key: 'login_time',
      title: '最近登录时间',
      minWidth: 100,
      render: row => {
        return <NText>{row.created_at && dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</NText>;
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
          <NButton type="primary" ghost size="small" onClick={() => resetEdit(row.id)}>
            重置密码
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

function resetEdit(id: number) {
  editVisible.value = true;
  editForm.value = ref({
    password: '',
    id
  });
}

const roleList = ref([]);
const roleOptions = ref([]);
const editVisible = ref(false);
const editForm = ref({});
const editErrors = ref({});

function handleEditSubmit() {
  if (!editForm.value.password) return (editErrors.value.password = '请输入密码');
  fetchAdminResetPwd(editForm.value)
    .then(res => {
      window.$message?.success('修改成功');
    })
    .catch(error => {
      editErrors.value = error;
    })
    .finally(() => {
      editLoading.value = false;
    });
}

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
    <NCard title="管理员管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
      </template>

      <!-- 编辑抽屉 -->
      <NDrawer v-model:show="editVisible" :width="500">
        <NDrawerContent title="重置密码" closable>
          <MyForm all-required :error-obj="editErrors">
            <MyFormItem v-model="editForm.password" label="请输入密码" prop-name="password" type="password" />
          </MyForm>
          <template #footer>
            <NSpace :size="16">
              <NButton :loading="editLoading" @click="editVisible = false">取消</NButton>
              <NButton type="primary" :loading="editLoading" @click="handleEditSubmit">确定</NButton>
            </NSpace>
          </template>
        </NDrawerContent>
      </NDrawer>

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
        @submitted="getData"
      />
      <!-- <BindLeaderDrawer v-model:visible="bindLeaderVisible" :row-data="currentRow" @submitted="getData" /> -->
    </NCard>
  </div>
</template>

<style scoped></style>
