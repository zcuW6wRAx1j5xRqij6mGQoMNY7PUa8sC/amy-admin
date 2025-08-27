<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import {  NTag } from 'naive-ui';
import { OrderIPOList } from '@/service/api/order';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { commApply } from "../ipo/index"

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  mobilePagination,
} = useTable({
  apiFn: OrderIPOList,
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
      key: 'ipo_id',
      title: 'IpoID',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'uid',
      title: '用户id',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'profit',
      title: '盈利',
      align: 'center',
      width: 80
    },
    {
      key: 'leverage',
      title: '杠杆',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'apply_price',
      title: '申请价格',
      align: 'center',
      width: 120
    }
    ,
    {
      key: '申请数量',
      title: 'apply_quantity',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'open_fee',
      title: '开仓手续费',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'close_fee',
      title: '平仓手续费',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'match_price',
      title: '成交价格',
      align: 'center',
      width: 120
    }
    
    ,
    {
      key: 'match_quantity',
      title: '成交数量',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'volume',
      title: '仓位价值',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'payable_amount',
      title: '应缴金额',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'apply_status',
      title: '申请状态',
      align: 'center',
      width: 120,
      render: row =>{
        const text = commApply[row.apply_status]
        return <NTag>{{text}}</NTag>
      }
    }
    ,
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 120,
      render: row =>{
        const text = commApply[row.apply_status]
        return <NTag>{{text}}</NTag>
      }
    },
    {
      key: 'close_price',
      title: '平仓价格',
      align: 'center',
      width: 120
    },
    {
      key: 'close_time',
      title: '平仓时间',
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
