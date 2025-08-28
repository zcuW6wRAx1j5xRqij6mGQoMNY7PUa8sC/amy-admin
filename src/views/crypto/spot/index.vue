<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { CryptoSpotList, CryptoDelSpot} from "@/service/api/crypto"
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import OperateDrawer from './modules/operate-drawer.vue';

const appStore = useAppStore();

const {
    columns,
    columnChecks,
    data,
    loading,
    getData,
    mobilePagination,
} = useTable({
    apiFn: CryptoSpotList,
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
            key: "is_recommend",
            title: '首页推荐',
            align: 'center',
            width: 150,
            render: row => {
                const text = row.is_recommend === 1 ? '是' : '否';
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
        },{
            key: 'operate',
            title: '操作',
            align: 'center',
            width: 80,
            fixed: 'right',
            render:row=>(
                <div class="flex-center gap-8px">
                    <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
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
            )}
    ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onDeleted } = useTableOperate(
    data,
    getData
);

function edit(id) {
    handleEdit(id);
}
function handleDelete(id: number) {
    CryptoDelSpot({ id }).then(() => {
        window.$message?.success('删除成功')
        getData()
    }).catch(err => {
        window.$message?.success(err)
    })
}
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <NCard title="现货列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
            <template #header-extra>
                <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
                    :loading="loading" @add="handleAdd" @refresh="getData" />
            </template>
            <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
                :flex-height="!appStore.isMobile" :scroll-x="800" :loading="loading" remote :row-key="row => row.id"
                :pagination="mobilePagination" class="sm:h-full" />
                <OperateDrawer v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData"
                @submitted="getData" />
        </NCard>
    </div>
</template>

<style scoped></style>
