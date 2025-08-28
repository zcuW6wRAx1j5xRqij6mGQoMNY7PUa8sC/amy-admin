<script setup lang="tsx">
import { NTag, NText } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetUserList } from '@/service/api/user';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();

// 表格相关
const { columns, data, loading, getDataByPage, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetUserList,
  apiParams: {
    uid: '',
    name: '',
    email: '',
    phone: '',
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
    { key: 'name', title: '姓名', align: 'center', width: 100 },
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
    { key: 'nickname', title: '昵称', align: 'center', width: 100 },
    { key: 'parent_id', title: '组长码', align: 'center', width: 100 },
    { key: 'level_id', title: 'VIP等级', align: 'center', width: 100 },
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
        const tagMap = {
          1: 'success',
          0: 'warning'
        };
        const label = row.status === 1 ? '开启' : '关闭';
        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    { key: 'register_ip', title: '注册IP', align: 'center', width: 120 },
    { key: 'regsiter_device', title: '注册设备', align: 'center', width: 120 },
    {
      key: 'last_login_at',
      title: '最近登录',
      align: 'center',
      width: 160,
      render: row => <span>{row.last_login_at || '-'}</span>
    },
    { key: 'last_login_ip', title: '最后登录IP', align: 'center', width: 120 },
    { key: 'last_login_device', title: '最后登录设备', align: 'center', width: 120 },
    { key: 'remark', title: '备注', align: 'center', width: 120, render: row => <span>{row.remark || '-'}</span> },
    {
      key: 'created_at',
      title: '注册时间',
      align: 'center',
      width: 160,
      render: row => <NText>{row.created_at && dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</NText>
    }
  ]
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="用户管理" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="2000"
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
