<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import { NImage, NTag } from 'naive-ui';
import { CryptoSymbolList } from "@/service/api/crypto"
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
    apiFn: CryptoSymbolList,
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
            key: 'coin_id',
            title: '货币ID',
            align: 'center',
            width: 80,
        },
        {
            key: 'logo',
            title: 'logo',
            align: 'center',
            minWidth: 150,
        },
        {
            key: 'name',
            title: '自定义名称',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'symbol',
            title: '交易对名称',
            align: 'center',
            width: 80
        },
        {
            key: 'base_asset',
            title: '交易货币',
            align: 'center',
            width: 120
        },
        {
            key: 'quote_asset',
            title: '计价货币',
            align: 'center',
            width: 120
        },
        {
            key: 'binance_symbol',
            title: '币安交易对别名',
            align: 'center',
            width: 150
        },
        {
            key: "digits",
            title: '结算小数位',
            align: 'center',
            width: 120
        },
        {
            key: "self_data",
            title: '自有行情',
            align: 'center',
            width: 150,
            render: row => {
                const text = row.self_data === 1 ? '是' : '否';
                return <NTag>{text}</NTag>
            }
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
        <NCard title="Symbol列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
