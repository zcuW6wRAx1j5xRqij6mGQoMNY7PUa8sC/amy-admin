<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import { NImage, NTag } from 'naive-ui';
import { CryptoCoinList } from "@/service/api/crypto"
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

const {
    columns,
    columnChecks,
    data,
    loading,
    getData,
    mobilePagination,
} = useTable({
    apiFn: CryptoCoinList,
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
            key: 'logo',
            title: 'logo',
            align: 'center',
            width: 80,
            // render:row=>{
            //     return <img src="" alt="logo" />
            // }
        },
        {
            key: 'name',
            title: '名称',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'block',
            title: '链名称',
            align: 'center',
            width: 180
        },
        {
            key: 'full_name',
            title: '全称',
            align: 'center',
            width: 120
        },
        {
            key: 'deposit_address',
            title: '充值地址',
            align: 'center',
            width: 120
        },
        {
            key: "allow_deposit",
            title: '是否允许充值',
            align: 'center',
            width: 150,
            render: row => {
                const text = row.allow_deposit === 1 ? '是' : '否';
                return <NTag>{text}</NTag>
            }
        },
        {
            key: "allow_withdraw",
            title: '是否允许提现',
            align: 'center',
            width: 150,
            render: row => {
                const text = row.allow_withdraw === 1 ? '是' : '否';
                return <NTag>{text}</NTag>
            }
        },
        {
            key: "status",
            title: '状态',
            align: 'center',
            width: 150,
            render: row => {
                const text = row.allow_withdraw === 1 ? '正常' : '禁用';
                return <NTag>{text}</NTag>
            }
        },
        {
            key: "created_at",
            title: '创建时间',
            align: 'center',
            width: 150
        }, {
            key: "updated_at",
            title: '更新时间',
            align: 'center',
            width: 150
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
        <NCard title="币种列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
