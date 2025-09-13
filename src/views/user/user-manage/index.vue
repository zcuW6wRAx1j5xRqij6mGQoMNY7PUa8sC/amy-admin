<script setup lang="tsx">
import { ref,reactive } from 'vue';
import { NButton, NTag, NText } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetUserList, fetchSendMessage } from '@/service/api/user';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
// import SearchBox from './modules/search-box.vue';
import UserEditDrawer from './modules/user-edit-drawer.vue';
import UserCreateDrawer from './modules/user-create-drawer.vue';
import ResetPasswordDrawer from './modules/reset-password-drawer.vue';

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
  apiFn: fetchGetUserList,
  apiParams: {
    uid: '',
    email: '',
    invite_code: '',
    status: null,
    role_type: null,
    is_verified_identity: null,
    funds_lock: null,
    page: 1,
    size: 20
  },
  columns: () => [
    { key: 'id', title: 'UID', align: 'center', width: 80, fixed: 'left' },
    { key: 'email', title: '邮箱', align: 'center', width: 150 },
    {
      key: 'phone',
      title: '手机号',
      align: 'center',
      width: 120,
      render: row => (
        <NText>
          ({row.phone_code}){row.phone}
        </NText>
      )
    },
    // { key: 'nickname', title: '昵称', align: 'center', width: 100 },
    { key: 'parent_id', title: '组长码', align: 'center', width: 100 },
    {
      key: 'level_id',
      title: 'VIP等级',
      align: 'center',
      width: 100,
      render: row => <span>{row.level?.name_en || '-'}</span>
    },
    { key: 'credit', title: '信用分', align: 'center', width: 100, render: row => <span>{row.credit || 0}</span> },
    {
      key: 'is_kyc',
      title: '是否实名',
      align: 'center',
      width: 100,
      render: row => <NTag type={row.is_kyc ? 'success' : 'error'}>{row.is_kyc ? '是' : '否'}</NTag>
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return '-';
        }
        const tagMap: Record<number, 'success' | 'warning'> = {
          1: 'success',
          0: 'warning'
        };
        const label = row.status === 1 ? '开启' : '关闭';
        return <NTag type={tagMap[row.status as number]}>{label}</NTag>;
      }
    },
    // { key: 'register_ip', title: '注册IP', align: 'center', width: 120 },
    // { key: 'regsiter_device', title: '注册设备', align: 'center', width: 120 },
    { key: 'remark', title: '备注', align: 'center', width: 120, render: row => <span>{row.remark || '-'}</span> },
    {
      key: 'last_login_at',
      title: '最近登录',
      align: 'center',
      width: 160,
      render: row => <span>{row.last_login_at || '-'}</span>
    },
    // { key: 'last_login_ip', title: '最后登录IP', align: 'center', width: 120 },
    // { key: 'last_login_device', title: '最后登录设备', align: 'center', width: 120 },
    {
      key: 'created_at',
      title: '注册时间',
      align: 'center',
      width: 160,
      render: row => <NText>{row.created_at && dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</NText>
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 280,
      fixed: 'right',
      render: row => (
        <div class="flex-center gap-12px">
          <NButton size="small" type="primary" onClick={() => edit(row.id)}>
            编辑
          </NButton>
          <NButton size="small" type="warning" onClick={() => handleResetPassword(row.id)}>
            重置密码
          </NButton>
          <NButton size="small" type="error" onClick={() => handleResetTradePassword(row.id)}>
            重置交易密码
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => send(row)}>
            发送站内信
          </NButton>
        </div>
      )
    }
  ]
});

// 站内信
const fromData = reactive({
  uid: '', // [必填][numeric] .用户UID
  subject: '', // [必填] [string] 消息主题
  content: '' // [必填][string] 消息内容 (富文本)
});
const msgVisible = ref(false);
const btnLoading = ref(false);
const errorObj = reactive({
  subject: '',
  content: ''
});
const send = row => {
  fromData.uid = row.id;
  fromData.subject = '';
  fromData.content = '';
  msgVisible.value = true;
};

const handleMsg = async () => {
  errorObj.value = {};
  if (!fromData.subject) {
    errorObj.value.subject = '请输入消息主题';
    return;
  }
  if (!fromData.content) {
    errorObj.value.content = '请输入消息内容';
    return;
  }
  btnLoading.value = true;
  return fetchSendMessage(fromData)
    .then(() => {
      window.$message?.success('发送成功');
      msgVisible.value = false;
    })
    .catch(error => {
      errorObj.value = error;
    })
    .finally(() => {
      btnLoading.value = false;
    });
};

const { drawerVisible, editingData, handleEdit, checkedRowKeys } = useTableOperate(data, getData);

// 创建用户抽屉相关
const createUserDrawerVisible = ref(false);

// 重置密码抽屉相关
const resetPasswordDrawerVisible = ref(false);
const resetPasswordUserId = ref<number>();
const resetPasswordType = ref<'password' | 'trade-password'>('password');

function edit(id: number) {
  handleEdit(id);
}

// 处理创建用户
function handleCreateUser() {
  createUserDrawerVisible.value = true;
}

// 处理创建用户提交成功
function handleCreateUserSubmitted() {
  createUserDrawerVisible.value = false;
  getDataByPage(); // 刷新列表
}

// 重置密码
function handleResetPassword(id: number) {
  resetPasswordUserId.value = id;
  resetPasswordType.value = 'password';
  resetPasswordDrawerVisible.value = true;
}

// 重置交易密码
function handleResetTradePassword(id: number) {
  resetPasswordUserId.value = id;
  resetPasswordType.value = 'trade-password';
  resetPasswordDrawerVisible.value = true;
}

// 处理重置密码提交
function handleResetPasswordSubmitted() {
  resetPasswordDrawerVisible.value = false;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" /> -->
    <NCard title="用户管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleCreateUser"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="2300"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>

    <!-- 创建用户抽屉 -->
    <UserCreateDrawer v-model:visible="createUserDrawerVisible" @submitted="handleCreateUserSubmitted" />

    <!-- 用户编辑抽屉 -->
    <UserEditDrawer v-model:visible="drawerVisible" :row-data="editingData" @submitted="getData" />

    <!-- 重置密码抽屉 -->
    <ResetPasswordDrawer
      v-model:visible="resetPasswordDrawerVisible"
      :user-id="resetPasswordUserId"
      :reset-type="resetPasswordType"
      @submitted="handleResetPasswordSubmitted"
    />

    <!-- 站内信 -->
    <ObDialog
      v-model:visible="msgVisible"
      title="发送站内信"
      :loading="btnLoading"
      width="420px"
      :handle-confirm="handleMsg"
    >
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="fromData.subject" label="消息主题" prop-name="subject" />
        <MyFormItem label="消息内容" form-type="others" prop-name="content">
          <ObRichText key="content" v-model="fromData.content" height="280px" />
        </MyFormItem>
      </MyForm>
    </ObDialog>

  </div>
</template>

<style scoped></style>
