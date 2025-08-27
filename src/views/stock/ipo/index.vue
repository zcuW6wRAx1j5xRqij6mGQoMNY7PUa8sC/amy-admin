<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import { StockIpoList, StockCreateIpo, StockUpdateIpo, StockDelIpo, type IpoPostPlader } from '@/service/api/stock';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';

const appStore = useAppStore();

const statusList = [
    { label: '关闭', value: 0 },
    { label: '开启', value: 1 }
];

const {
    columns,
    columnChecks,
    data,
    loading,
    getData,
    mobilePagination,
} = useTable({
    apiFn: StockIpoList,
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
            key: 'stock_id',
            title: '股票ID',
            align: 'center',
            width: 80,
        },
        {
            key: 'open_fee',
            title: '开仓手续费%',
            align: 'center',
            width: 120
        }
        ,
        {
            key: 'close_fee',
            title: '平仓手续费%',
            align: 'center',
            width: 120
        },
        {
            key: 'apply_price',
            title: '申请价格',
            align: 'center',
            width: 120
        },
        {
            key: 'apply_min_quantity',
            title: '申请最小量',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'apply_max_quantity',
            title: '申请最大量',
            align: 'center',
            width: 80
        },
        ,
        {
            key: 'status',
            title: '状态',
            align: 'center',
            width: 120,
        },
        {
            key: 'close_price',
            title: '平仓价格',
            align: 'center',
            width: 120
        },
        {
            key: 'apply_start_at',
            title: '开始时间',
            align: 'center',
            width: 120
        },
        {
            key: 'apply_end_at',
            title: '结束时间',
            align: 'center',
            width: 120
        },
        {
            key: 'issue_quantity',
            title: '发行数量',
            align: 'center',
            width: 120
        },
        {
            key: 'created_at',
            title: '创建时间',
            align: 'center',
            width: 120
        },
        {
            key: 'updated_at',
            title: '更新时间',
            align: 'center',
            width: 120
        },
        {
            key: 'actions',
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 80,
            render: row => (
                <div>
                    <NButton text type="primary" onClick={() => handleEdit(row)}>
                        编辑
                    </NButton>
                    <NPopconfirm onPositiveClick={() => handleDelete(row.id)} >
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

const { checkedRowKeys } = useTableOperate(
    data,
    getData
);

function edit(id: any) {
    handleEdit(id);
}
const editVisible = ref(false)
const editErrors = ref({});
const editLoading = ref(false)
const defaultForm: IpoPostPlader = {
    id: undefined,
    apply_max_quantity: 0,//申请最大量
    apply_min_quantity: 0, //申请最小量
    apply_price: 0, //申请价格
    close_fee: 0, //手续费%
    close_price: 0, //平仓价格
    open_fee: 0, //开盘手续费%
    status: 0, //状态，0 关闭 1开启
    stock_id: 0, //股票ID
    apply_start_at: undefined,
    apply_end_at: undefined
}
const editForm = ref({ ...defaultForm })
const handleEdit = (item: any) => {
    editVisible.value = true
    editForm.value = item
}
async function handleSubmit() {
    editErrors.value = {};
    editLoading.value = true;
    const action = editForm.value.id ? StockUpdateIpo : StockCreateIpo;
    action(editForm.value)
        .then(() => {
            // request
            window.$message?.success('操作成功');
            editVisible.value = false;
            getData()
        })
        .catch(error => {
            editErrors.value = error;
        })
        .finally(() => {
            editLoading.value = false;
        });
}

function handleDelete(id) {
    StockDelIpo(id).then(() => {
        window.$message?.success('操作成功');
        getData()
    })
}
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <NCard title="币种列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
            <template #header-extra>
                <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
                    :loading="loading" @add="handleEdit(defaultForm)" @refresh="getData" />
            </template>
            <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
                :flex-height="!appStore.isMobile" :scroll-x="800" :loading="loading" remote :row-key="row => row.id"
                :pagination="mobilePagination" class="sm:h-full" />
        </NCard>


        <!-- 编辑抽屉 -->
        <NDrawer v-model:show="editVisible" :width="500">
            <NDrawerContent title="编辑交易对" closable>
                <MyForm all-required :error-obj="editErrors">
                    <MyFormItem v-model="editForm.apply_price" label="申请价格" prop-name="apply_price" />
                    <MyFormItem v-model="editForm.apply_max_quantity" label="申请最大量" prop-name="apply_max_quantity" />
                    <MyFormItem v-model="editForm.apply_min_quantity" label="申请最小量" prop-name="apply_min_quantity" />
                    <MyFormItem v-model="editForm.close_fee" label="手续费%" prop-name="close_fee" />
                    <MyFormItem v-model="editForm.stock_id" label="股票ID" prop-name="stock_id" />
                    <MyFormItem v-model="editForm.status" label="状态" form-type="select" :data-list="statusList"
                        prop-name="status" />
                    <NTimePicker v-model="editForm.apply_start_at" style="margin-bottom: 15px;" format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间" />
                    <NTimePicker v-model="editForm.apply_end_at" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" />
                </MyForm>
                <template #footer>
                    <NSpace :size="16">
                        <NButton :loading="editLoading" @click="editVisible = false">取消</NButton>
                        <NButton type="primary" :loading="editLoading" @click="handleEditSubmit">确定</NButton>
                    </NSpace>
                </template>
            </NDrawerContent>
        </NDrawer>
    </div>
</template>

<style scoped></style>
