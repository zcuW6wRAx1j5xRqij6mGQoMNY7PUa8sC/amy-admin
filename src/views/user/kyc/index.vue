<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import { NPopconfirm } from 'naive-ui';
import { UserKycList, UserKycAudit } from '@/service/api/user';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { reviewList } from "./index"
import { setBaseUrl } from '@/utils/utils';

const appStore = useAppStore();

const {
    columns,
    columnChecks,
    data,
    loading,
    getData,
    mobilePagination,
} = useTable({
    apiFn: UserKycList,
    apiParams: {
        page: 1,
        page_size: 20,
        filter: "",
        status: ""
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
            title: '用户id',
            align: 'center',
            width: 80,
        },
        {
            key: 'id_card_number',
            title: '证件号码',
            align: 'center',
            minWidth: 150
        },
        {
            key: 'photo_front',
            title: '证件正面照',
            align: 'center',
            minWidth: 150,
            render: row => {
                return <img src={setBaseUrl(row.photo_front)} class="h-100px w-130px object-cover" alt="" />
            }
        },
        {
            key: 'photo_back',
            title: '证件反面照',
            align: 'center',
            width: 150,
            render: row => {
                return <img src={setBaseUrl(row.photo_back)} class="h-100px w-130px object-cover" alt="" />
            }
        }
        ,
        {
            key: 'status',
            title: '审核状态',
            align: 'center',
            width: 120,
            render: row => {
                const text = reviewList[row.status]
                return text
            }
        }
        ,
        {
            key: 'reject_reason',
            title: '拒绝原因',
            align: 'center',
            width: 120
        }
        ,
        {
            key: 'verified_at',
            title: '审核时间',
            align: 'center',
            width: 120
        }
        ,
        {
            key: 'admin_id',
            title: '管理员ID',
            align: 'center',
            width: 120
        }
        ,
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
                row.status !== reviewList.success ? <div>
                    <NPopconfirm onPositiveClick={() => handleReview(row, reviewList.success)} >
                        {{
                            default: () => '确认拒绝吗？',
                            trigger: () => (
                                <NButton type="error" ghost size="small">
                                    拒绝
                                </NButton>
                            )
                        }}
                    </NPopconfirm>
                    <NPopconfirm onPositiveClick={() => handleReview(row, reviewList.success)} >
                        {{
                            default: () => '确认通过吗？',
                            trigger: () => (
                                <NButton type="success" ghost size="small">
                                    通过
                                </NButton>
                            )
                        }}
                    </NPopconfirm>
                </div> : <div></div>
            )
        }

    ]
});

const { handleEdit, checkedRowKeys } = useTableOperate(
    data,
    getData
);

function edit(id) {
    handleEdit(id);
}

function handleReview(item, status) {
    UserKycAudit({
        id: item.id,
        status
    }).then(() => {
        getData()
        window.$message?.success('操作成功')
    })
}
</script>

<template>
    <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
        <NCard title="实名认证列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
