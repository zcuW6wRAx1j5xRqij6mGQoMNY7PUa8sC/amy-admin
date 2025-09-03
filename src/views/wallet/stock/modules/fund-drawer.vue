<script setup lang="ts">
import { ref, watch } from 'vue';
import { WalletStockFundChange } from '@/service/api/flow';

defineOptions({
  name: 'FundDrawer'
});

interface Props {
  walletId: number | null;
}

interface Emits {
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const fundForm = ref(createDefaultModel());
const loading = ref(false);
const errorObj = ref<Record<string, string>>({});

function createDefaultModel() {
  return {
    amount: 0,
    type: 'system'
  };
}

// 变动类型选项
const typeOptions = [
  { label: '系统操作', value: 'system' },
  { label: '系统入金', value: 'system_deposit' },
  { label: '系统提现', value: 'system_withdraw' },
  { label: '提现', value: 'withdraw' },
  { label: '提现手续费', value: 'withdraw_fee' },
  { label: '提现手续费返还', value: 'withdraw_fee_refund' },
  { label: '提现失败返还', value: 'withdraw_refund' },
  { label: '入金', value: 'FlowTypeDeposit' },
  { label: '大宗申请', value: 'block_trade_apply' },
  { label: '大宗审核退款', value: 'block_trade_apply_refund' },
  { label: '大宗订单结算', value: 'block_trade_settlement' },
  { label: 'IPO认缴', value: 'ipo_subscription' },
  { label: 'IPO订单结算', value: 'ipo_settlement' },
  { label: '申请ETF', value: 'block_etf_apply' },
  { label: 'ETF审核退款', value: 'block_etf_apply_refund' },
  { label: 'ETF审核缴款', value: 'etf_subscription' },
  { label: 'ETF订单结算', value: 'etf_settlement' }
];

// 监听抽屉显示状态，重置表单
watch(visible, isVisible => {
  if (isVisible) {
    fundForm.value = createDefaultModel();
    errorObj.value = {};
  }
});

async function handleSubmit() {
  if (!props.walletId) return;

  // 表单验证
  errorObj.value = {};
  if (fundForm.value.amount === 0) {
    errorObj.value.amount = '请输入变动金额';
    return;
  }
  if (!fundForm.value.type) {
    errorObj.value.type = '请选择变动类型';
    return;
  }

  loading.value = true;
  try {
    await WalletStockFundChange({
      id: props.walletId,
      amount: fundForm.value.amount,
      type: fundForm.value.type
    });

    window.$message?.success('金额变动成功');
    visible.value = false;
    emit('success');
  } catch (error) {
    errorObj.value = error;
  } finally {
    loading.value = false;
  }
}

function handleClose() {
  visible.value = false;
}
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500" @update:show="handleClose">
    <NDrawerContent title="金额变动" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="fundForm.amount"
          label="变动金额"
          prop-name="amount"
          form-type="number"
          placeholder="正数为加，负数为减"
        />
        <MyFormItem
          v-model="fundForm.type"
          label="变动类型"
          prop-name="type"
          form-type="select"
          :data-list="typeOptions"
          placeholder="请选择变动类型"
        />
      </MyForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="handleClose">取消</NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">确定</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
