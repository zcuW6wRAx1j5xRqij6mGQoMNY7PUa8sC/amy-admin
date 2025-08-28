<script setup lang="jsx">
import { NButton } from 'naive-ui';
import { FlowLoanList } from '@/service/api/flow';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { setBaseUrl } from "@/utils/utils"

const appStore = useAppStore();

const {
    columns,
    columnChecks,
    data,
    loading,
    getData,
    mobilePagination,
} = useTable({
    apiFn: FlowLoanList,
    apiParams: {
        page: 1,
        page_size: 20,
    },
    columns: () => [
        {
            key: 'id',
            title: 'ID',
            align: 'center',
            width: 120,
            fixed: 'left'
        },
        {
            key: 'uid',
            title: '用户ID',
            align: 'center',
            width: 120,
            fixed: 'left'
        },
        {
            key: 'amount',
            title: '变动金额',
            align: 'center',
            width: 120,
            fixed: 'left'
        },
        {
            key: 'balance_before',
            title: '变动前',
            align: 'center',
            width: 120,
            fixed: 'left'
        },
        {
            key: 'balance_after',
            title: '变动后',
            align: 'center',
            width: 120,
            fixed: 'left'
        },
        {
            key: 'remark',
            title: '备注',
            align: 'center',
            width: 120,
            fixed: 'left'
        },
        {
            key: 'source',
            title: 'source',
            align: 'center',
            width: 120,
            fixed: 'left'
        },
        {
            key: 'type',
            title: '类型',
            align: 'center',
            width: 120,
            fixed: 'left'
        },


        // {
        //     key: 'nickname',
        //     title: ' 昵称',
        //     align: 'center',
        //     width: 80,
        // },
        // {
        //     key: 'email',
        //     title: '邮箱',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'phone_code',
        //     title: '国际区号',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'phone',
        //     title: '手机号',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'invite_code',
        //     title: '邀请码',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'parent_id',
        //     title: '上级ID',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'role_id',
        //     title: '角色ID',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'name',
        //     title: '姓名',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'level_id',
        //     title: '用户等级ID',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'credit',
        //     title: '信用分',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'is_kyc',
        //     title: '是否实名',
        //     align: 'center',
        //     minWidth: 100,
        //     render: row => {
        //         return (
        //             <NTag type={row.is_kyc ? 'success' : 'error'}>{row.is_kyc ? '是' : '否'}</NTag>
        //         );
        //     }
        // },
        // {
        //     key: 'kyc_data',
        //     title: 'KYC数据',
        //     align: 'center',
        //     minWidth: 150
        // },
        // {
        //     key: 'avatar',
        //     title: '头像',
        //     align: 'center',
        //     minWidth: 60,
        //     render: row => {
        //         <img src={setBaseUrl(row.avatar)} class="w-60px h-60px" alt="" />
        //     }
        // },
        // {
        //     key: 'status',
        //     title: '是否实名',
        //     align: 'center',
        //     minWidth: 100,
        //     render: row => {
        //         return (
        //             <NTag type={row.status ? 'success' : 'error'}>{row.status ? '是' : '否'}</NTag>
        //         );
        //     }
        // },
        // {
        //     key: 'register_ip',
        //     title: '注册IP',
        //     align: 'center',
        //     minWidth: 100,
        // },
        // {
        //     key: 'regsiter_device',
        //     title: '注册设备',
        //     align: 'center',
        //     minWidth: 100,
        // },
        // {
        //     key: 'last_login_at',
        //     title: '最后登录时间',
        //     align: 'center',
        //     minWidth: 150,
        // },
        // {
        //     key: 'last_login_ip',
        //     title: '最后登录的ip',
        //     align: 'center',
        //     minWidth: 150,
        // },
        // {
        //     key: 'last_login_device',
        //     title: '最后登录设备',
        //     align: 'center',
        //     minWidth: 150,
        // },
        {
            key: 'created_at',
            title: '创建日期',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'updated_at',
            title: '最近日期',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'operate',
            title: '操作',
            align: 'center',
            width: 80,
            fixed: 'right',
            render: row => (
                <div >
                    <NButton onClick={() => handleDetail(row)}>详情</NButton>
                </div>
            )
        }
    ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
    data,
    getData
);

function edit(id) {
    handleEdit(id);
}
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <NCard title="合约钱包流水" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
            <template #header-extra>
                <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
                    :loading="loading" no-add @refresh="getData" />
            </template>
            <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
                :flex-height="!appStore.isMobile" :scroll-x="800" :loading="loading" remote :row-key="row => row.id"
                :pagination="mobilePagination" class="sm:h-full" />
        </NCard>
    </div>
</template>

<style scoped></style>
