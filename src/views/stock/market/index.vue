<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { isEmpty } from '@/utils/is';
import { StockMarketList, StockCreateMarket, StockUpdateMarket, StockDelOtc, type MarkPostPlader } from '@/service/api/stock';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import SearchBox from "./modules/search-box.vue"

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
    getDataByPage,
    mobilePagination,
    searchParams,
    resetSearchParams
} = useTable({
    apiFn: StockMarketList,
    apiParams: {
        page: 1,
        page_size: 20,
        symbol: "",
        exchange: "",
        status: null
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
            key: 'exchange',
            title: '交易所类型',
            align: 'center',
            width: 80,
        },
        {
            key: 'country',
            title: '分类ID',
            align: 'center',
            width: 120
        }
        ,
        {
            key: 'name',
            title: '股票名称',
            align: 'center',
            width: 120
        },
        {
            key: 'symbol',
            title: '股票代码',
            align: 'center',
            width: 120
        },
        {
            key: 'isin',
            title: '国际证券识别码',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'is_recommend',
            title: '是否推荐',
            align: 'center',
            width: 80
        },
        ,
        {
            key: 'logo',
            title: '股票Logo',
            align: 'center',
            width: 120,
        },
        {
            key: 'price',
            title: '当前价格',
            align: 'center',
            width: 120
        },
        {
            key: 'change',
            title: '涨跌幅',
            align: 'center',
            width: 120
        },
        {
            key: 'volume',
            title: '成交量',
            align: 'center',
            width: 120
        },
        {
            key: 'market_cap',
            title: '成交额',
            align: 'center',
            width: 120
        },
        {
            key: 'high',
            title: '最高价',
            align: 'center',
            width: 120
        },
        {
            key: 'low',
            title: '最低价',
            align: 'center',
            width: 120
        },
        {
            key: 'open',
            title: '开盘价',
            align: 'center',
            width: 120
        },
        {
            key: 'close',
            title: '收盘价',
            align: 'center',
            width: 120
        },
        {
            key: 'kline_query_path',
            title: 'K线查询路径',
            align: 'center',
            width: 120
        },
        {
            key: 'quote_query_path',
            title: '行情查询路径',
            align: 'center',
            width: 120
        },
        {
            key: 'status',
            title: '成交量',
            align: 'center',
            width: 120,
            render: row => {
                const text = row.status === 1 ? '启用' : '禁用'
                return <NTag>{{ text }}</NTag>
            }
        },
        {
            key: 'sort',
            title: '排序',
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
const defaultForm: MarkPostPlader = {
    id: undefined,
    change: 0, //涨跌幅
    close: 0, //收盘价
    country: "", //国家
    exchange: "", //交易所类型
    high: 0, //最高价
    is_recommend: 0, // 是否推荐，0-否，1-是
    isin: "", //国际证券识别码
    kline_query_path: "", //K线查询路径
    logo: "", //股票Logo
    low: 0, //最低价
    market_cap: 0, //成交额
    name: "", //股票名称
    open: 0, //开盘价
    price: 0, //当前价格
    quote_query_path: "", //行情查询路径
    sort: 0, //排序
    status: 0, //状态，1:启用 0:禁用
    symbol: "", //股票代码
    volume: 0, //成交量
}
const editForm = ref({ ...defaultForm })
const handleEdit = (item: any) => {
    editVisible.value = true
    editForm.value = item
}
async function handleSubmit() {
    editErrors.value = {};

    if (isEmpty(editForm.value.change)) {
        editErrors.value.change = '请输入涨跌幅';
    }
    if (isEmpty(editForm.value.close)) {
        editErrors.value.close = '请输入收盘价';
    }
    if (isEmpty(editForm.value.country)) {
        editErrors.value.country = '请输入国家';
    }
    if (isEmpty(editForm.value.exchange)) {
        editErrors.value.exchange = '请输入交易所类型';
    }
    if (isEmpty(editForm.value.high)) {
        editErrors.value.high = '请输入最高价';
    }
    if (isEmpty(editForm.value.low)) {
        editErrors.value.low = '请输入最低价';
    }
    if (isEmpty(editForm.value.open)) {
        editErrors.value.open = '请输入开盘价';
    }
    if (isEmpty(editForm.value.name)) {
        editErrors.value.name = '请输入股票名称';
    }
    if (isEmpty(editForm.value.price)) {
        editErrors.value.price = '请输入当前价格';
    }
    if (isEmpty(editForm.value.sort)) {
        editErrors.value.low = '请输入排序';
    }
    if (isEmpty(editForm.value.symbol)) {
        editErrors.value.symbol = '请输入股票代码';
    }
    if (isEmpty(editForm.value.volume)) {
        editErrors.value.volume = '请输入成交量';
    }
    if (isEmpty(editForm.value.market_cap)) {
        editErrors.value.volume = '请输入成交额';
    }

    if (Object.values(editErrors.value).some(item => item)) {
        return;
    }
    editLoading.value = true;
    const action = editForm.value.id ? StockUpdateMarket : StockCreateMarket;
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
    StockDelOtc(id).then(() => {
        window.$message?.success('操作成功');
        getData()
    })
}
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <SearchBox v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
        <NCard title="大宗股票列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
                    <MyFormItem v-model="editForm.change" label="涨幅跌" prop-name="change" />
                    <MyFormItem v-model="editForm.close" label="收盘价" prop-name="close" />
                    <MyFormItem v-model="editForm.open" label="开盘价" prop-name="open" />
                    <MyFormItem v-model="editForm.country" label="国家" prop-name="country" />
                    <MyFormItem v-model="editForm.exchange" label="交易所类型" prop-name="exchange" />
                    <MyFormItem v-model="editForm.high" label="最高价" prop-name="high" />
                    <MyFormItem v-model="editForm.isin" label="国家证券识别码" prop-name="isin" />
                    <MyFormItem v-model="editForm.kline_query_path" label="K线查询路径" prop-name="kline_query_path" />
                    <MyFormItem v-model="editForm.quote_query_path" label="行情查询路径" prop-name="quote_query_path" />
                    <MyFormItem v-model="editForm.sort" label="排序" prop-name="sort" />
                    <MyFormItem v-model="editForm.logo" label="股票Logo" prop-name="logo" />
                    <MyFormItem v-model="editForm.low" label="最低价" prop-name="low" />
                    <MyFormItem v-model="editForm.market_cap" label="成交额" prop-name="market_cap" />
                    <MyFormItem v-model="editForm.name" label="股票名称" prop-name="name" />
                    <MyFormItem v-model="editForm.price" label="当前价格" prop-name="price" />
                    <MyFormItem v-model="editForm.symbol" label="股票代码" prop-name="symbol" />
                    <MyFormItem v-model="editForm.volume" label="成交量" prop-name="volume" />

                    <MyFormItem v-model="editForm.status" label="状态" form-type="select" :data-list="statusList"
                        prop-name="status" />
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
