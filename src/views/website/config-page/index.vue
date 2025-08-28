<script setup lang="tsx">
import { WebsiteAddConfig, WebsiteDelConfig, WebsiteUpdateConfig, WebsiteConfigList, type SetConfigPlader } from '@/service/api/website';
import { useAppStore } from '@/store/modules/app';
import { NPopconfirm, NButton } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { ref } from 'vue';
import { isEmpty } from '@/utils/is';

const typeList = ref([{
    value: 'string',
    label: 'string'
}, {
    value: 'integer',
    label: 'integer'
}, {
    value: 'boolean',
    label: 'boolean'
}, {
    value: 'json',
    label: 'json'
}])

const appStore = useAppStore();

const {
    columns,
    columnChecks,
    data,
    loading,
    getData,
    mobilePagination,
} = useTable({
    apiFn: WebsiteConfigList,
    apiParams: {
        page: 1,
        page_size: 20,
    },
    columns: () => [
        {
            key: 'id',
            title: 'id',
            align: 'center',
            width: 120
        },
        {
            key: 'group',
            title: '配置分组d',
            align: 'center',
            width: 120
        },
        {
            key: 'key',
            title: '配置键',
            align: 'center',
            width: 120
        },
        {
            key: 'value_type',
            title: '配置类型',
            align: 'center',
            width: 120
        },
        {
            key: 'value',
            title: '配置值',
            align: 'center',
            width: 120
        },
        {
            key: 'actions',
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 120,
            render: row => (
                <div>
                    <NPopconfirm onPositiveClick={() => handleDel(row.id)} >
                        {{
                            default: () => '确认删除？',
                            trigger: () => (
                                <NButton type="error" ghost size="small">
                                    删除
                                </NButton>
                            )
                        }}
                    </NPopconfirm>
                    <NButton size="small" onClick={() => handleEdit(row)}>编辑</NButton>
                </div>
            )
        }
    ]
});

const { handleAdd, checkedRowKeys } = useTableOperate(
    data,
    getData
);

const drawerVisible = ref(false)
const defaultConfig: SetConfigPlader = {
    id: undefined,
    key: "",
    group: "",
    value_type: "string",
    value: ""
}
const defultAddTitle = '添加配置'
const defultEditTitle = '修改配置'
const editErrors = ref({})
const editLoading = ref(false)
const editForm = ref({ ...defaultConfig })
const editTitle = ref('')

function handleEdit(item: any) {
    editTitle.value = item.id ? defultEditTitle : defultAddTitle
    editForm.value = { ...item }
    drawerVisible.value = true
}

async function handleDel(id: number) {
    WebsiteDelConfig({ id }).then(() => {
        window.$message?.success('操作成功')
        getData()
    }).catch(error => {
        window.$message?.error(error);
    })
}

async function handleEditSubmit() {
    editErrors.value = {};
    if (isEmpty(editForm.value.key)) {
        editErrors.value.key = '请输入配置键';
    }
    if (isEmpty(editForm.value.group)) {
        editErrors.value.group = '请输入配置分组';
    }
    if (isEmpty(editForm.value.value_type)) {
        editErrors.value.value_type = '请选择配置类型';
    }
    if (isEmpty(editForm.value.value)) {
        editErrors.value.value = '请输入配置值';
    }
    if (Object.values(editErrors.value).some(item => item)) {
        return;
    }
    editLoading.value = true;
    const action = editForm.value.id ? WebsiteUpdateConfig : WebsiteAddConfig;
    action(editForm.value)
        .then(() => {
            // request
            window.$message?.success('操作成功');
            drawerVisible.value = false;
            getData()
        })
        .catch(error => {
            editErrors.value = error;
        })
        .finally(() => {
            editLoading.value = false;
        });
}

</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <NCard title="配置列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
            <template #header-extra>
                <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
                    :loading="loading" @add="handleEdit(defaultConfig)" @refresh="getData" />
            </template>
            <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
                :flex-height="!appStore.isMobile" :scroll-x="800" :loading="loading" remote :row-key="row => row.id"
                :pagination="mobilePagination" class="sm:h-full" />
        </NCard>

        <!-- 编辑抽屉 -->
        <NDrawer v-model:show="drawerVisible" :width="500">
            <NDrawerContent :title="editTitle" closable>
                <MyForm all-required :error-obj="editErrors">
                    <MyFormItem v-model="editForm.key" label="请输入配置键" prop-name="key" />
                    <MyFormItem v-model="editForm.group" label="请输入配置分组" prop-name="group" />
                    <MyFormItem v-model="editForm.value_type" formType="select" :dataList="typeList" label="请选择配置类型"
                        prop-name="value_type" />
                    <MyFormItem v-model="editForm.value" label="请输入配置值" prop-name="value" />
                </MyForm>
                <template #footer>
                    <NSpace :size="16">
                        <NButton :loading="editLoading" @click="drawerVisible = false">取消</NButton>
                        <NButton type="primary" :loading="editLoading" @click="handleEditSubmit">确定</NButton>
                    </NSpace>
                </template>
            </NDrawerContent>
        </NDrawer>
    </div>
</template>

<style scoped></style>
