<script setup lang="tsx">
import { ref } from "vue"
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import UserSearch from './modules/user-search.vue';
import dayjs from 'dayjs';
import {
    fetchGetUserList,
} from '@/service/api/user';

const { hasAuth } = useAuth();
const roleType = [
    {
        label: '普通账号',
        value: 1
    },
    {
        label: '内部账号',
        value: 2
    },
    {
        label: '测试账号',
        value: 3
    }
];

const {
    columnChecks,
    columns,
    data,
    getData,
    getDataByPage,
    loading,
    mobilePagination,
    searchParams,
    resetSearchParams
} = useTable({
    apiFn: fetchGetUserList,
    showTotal: true,
    apiParams: {
        page: 1,
        page_size: 20,
        email: null,
        name: null,
        status: null,
        funds_lock: null,
        is_verified_identity: null,
        role_type: null,
        phone: null,
        invite_code: null,
        uid: null
    },
    columns: () => [
        {
            key: 'id',
            title: 'UID',
            align: 'center',
            width: 80,
            fixed: 'left'
        },
        {
            key: 'name',
            title: '姓名',
            align: 'center',
            minWidth: 100
        },
        {
            key: 'email',
            title: 'email',
            align: 'center',
            minWidth: 120
        },
        {
            key: 'phone',
            title: '手机号',
            align: 'center',
            minWidth: 100,
            render: row => {
                return (
                    <NText>
                        ({row.phone_code}){row.phone}
                    </NText>
                );
            }
        },
        {
            key: 'nickname',
            title: '昵称',
            align: 'center',
            minWidth: 100
        },
        {
            key: 'role_id',
            title: '角色',
            align: 'center',
            width: 100,
            render: row => {
                const role = roleType.find(item => item.value === row.role_id);
                // 根据不一样的类型显示不一样的颜色
                const tagMap: Record<number, NaiveUI.ThemeColor> = {
                    1: 'success',
                    2: 'warning',
                    3: 'error'
                };
                return <NTag type={tagMap[row.role_id]}>{role?.label}</NTag>;
            }
        },
        {
            key: 'parent_id',
            title: '组长码',
            align: 'center',
            minWidth: 100
        },
        {
            key: 'level_id',
            title: 'vip等级',
            align: 'center',
            minWidth: 100
        },
        {
            key: 'credit',
            title: '信用分',
            align: 'center',
            minWidth: 120,
        },
        {
            key: 'is_kyc',
            title: '是否实名',
            align: 'center',
            minWidth: 100,
            render: row => {
                return (
                    <NTag type={row.is_kyc ? 'success' : 'error'}>{row.is_kyc ? '是' : '否'}</NTag>
                );
            }
        },
        {
            key: 'avatar',
            title: '头像',
            align: 'center',
            width: 100,
            render: row => {
                return row.avatar ? <img class="h-10 w-10 rounded-full" src={setBaseUrl(row.avatar)} alt="avatar" /> : null;
            }
        },
        {
            key: 'status',
            title: '状态',
            align: 'center',
            width: 100,
            render: row => {
                if (row.status === null) {
                    return null;
                }

                const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
                    1: 'success',
                    0: 'warning'
                };

                const label = row.status === 1 ? '开启' : '关闭';

                return <NTag type={tagMap[row.status]}>{label}</NTag>;
            }
        },
        {
            key: 'register_ip',
            title: '注册IP',
            align: 'center',
            minWidth: 120
        },
        {
            key: 'regsiter_device',
            title: '注册设备',
            align: 'center',
            minWidth: 120
        },
        {
            key: 'last_login_at',
            title: '最近登录',
            minWidth: 100,
            //   render: row => {
            //     return <NText>{row.last_login_at && dayjs(row.last_login_at).format('YYYY-MM-DD HH:mm:ss')}</NText>;
            //   }
        },
        {
            key: 'last_login_ip',
            title: '最后登录IP',
            minWidth: 120,
        },
        {
            key: 'last_login_device',
            title: '最后登录设备',
            minWidth: 120,
        },
        {
            key: 'remark',
            title: '备注',
            minWidth: 120
        },
        {
            key: 'created_at',
            title: '注册时间',
            minWidth: 100,
            render: row => {
                return <NText>{row.created_at && dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')}</NText>;
            }
        },
    ]
});
</script>
<template>
    <div min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto>
        <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
        <NCard title="用户列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
            <template #header-extra>
                <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" no-add
                    @refresh="getData" />
            </template>
            <NDataTable :columns="columns" :data="data" size="small" :scroll-x="962" :loading="loading" remote
                :row-key="row => row.id" :pagination="mobilePagination" class="sm:h-full" />
        </NCard>
    </div>
</template>
<style lang="scss"></style>