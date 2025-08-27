<script setup lang="jsx">
import { onMounted, ref } from 'vue';
import {  NTag } from 'naive-ui';
import { OrderFuturesList } from '@/service/api/order';
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
  apiFn: OrderFuturesList,
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
      key: 'order_code',
      title: '订单编号',
      align: 'center',
      width: 80,
    },
    {
      key: 'symbol_id',
      title: '交易对ID',
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
      key: 'margin_type',
      title: '保证金类型',
      align: 'center',
      width: 80,
      render: row=>{
        const text = row.margin_type === 'isolated'? '逐仓': '全仓'
        return <NTag>{{text}}</NTag>
      }
    },
    {
      key: 'margin',
      title: '保证金',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'margin_ratio',
      title: '保证金比例',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'lots',
      title: '手数',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'side',
      title: '交易方向',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'leverage',
      title: '杠杆倍数',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'price',
      title: '开仓委托价格',
      align: 'center',
      width: 120
    }
    
    ,
    {
      key: 'match_price',
      title: '开仓成交价格',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'market_price',
      title: '市场价格',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'match_time',
      title: '成交时间',
      align: 'center',
      width: 120
    }
    ,
    {
      key: 'profit',
      title: '盈亏',
      align: 'center',
      width: 120,
    }
    ,
    {
      key: 'profit_ratio',
      title: '浮动盈亏比例',
      align: 'center',
      width: 120,
    },
    {
      key: 'sl',
      title: 'sl',
      align: 'center',
      width: 120
    },
    {
      key: 'tp',
      title: 'tp',
      align: 'center',
      width: 120
    },
    {
      key: 'open_price',
      title: '开仓价格',
      align: 'center',
      width: 120
    },
    {
      key: 'open_spread',
      title: '开仓点差',
      align: 'center',
      width: 120
    },
    {
      key: 'open_fee',
      title: '开仓手续费',
      align: 'center',
      width: 120
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
      key: 'close_spread',
      title: '平仓点差',
      align: 'center',
      width: 120
    },
    {
      key: 'close_fee',
      title: '平仓手续费',
      align: 'center',
      width: 120
    },
    {
      key: 'force_close_price',
      title: '强平手续费',
      align: 'center',
      width: 120
    },

    {
      key: 'close_type',
      title: '平仓类型',
      align: 'center',
      width: 120
    },
    {
      key: 'trade_status',
      title: '持仓状态',
      align: 'center',
      width: 120,
      render: row =>{
        const typeObj = {
            pending:'等待',
            open: '持仓中',
            closeing:'平仓中',
            closed:'已平仓'
        }
        const text = typeObj[row.trade_status]
        return <NTag>{{text}}</NTag>
      }
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
