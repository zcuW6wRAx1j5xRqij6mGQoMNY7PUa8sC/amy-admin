<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import { NImage, NTag } from 'naive-ui';
import { CryptoFuturesList } from "@/service/api/crypto"
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
    apiFn: CryptoFuturesList,
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
            key: 'symbol_id',
            title: '交易对ID',
            align: 'center',
            width: 80,
        },
        {
            key: 'sort',
            title: '排序',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'buy_spread',
            title: '买入点差',
            align: 'center',
            width: 80
        },
        {
            key: 'sell_spread',
            title: '卖出点差',
            align: 'center',
            width: 120
        },
        {
            key: 'fee',
            title: '手续费',
            align: 'center',
            width: 120
        },
        {
            key: "status",
            title: '状态',
            align: 'center',
            width: 150,
            render: row => {
                const text = row.self_data === 1 ? '开启' : '关闭';
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
        <NCard title="合约列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
