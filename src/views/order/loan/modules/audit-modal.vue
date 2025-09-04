<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { LoanOrderAudit } from '@/service/api/order';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'LoanAuditModal'
});

interface Props {
  /** 订单数据 */
  order?: any;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => '贷款审核');

const statusOptions = ref([
  { value: 'approved', label: '通过' },
  { value: 'rejected', label: '拒绝' }
]);

const ruleForm = ref(createDefaultModel());
const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

function createDefaultModel() {
  return {
    id: undefined,
    status: 'approved',
    approved_amount: 0,
    interest_rate: 0,
    reject_reason: '',
    remark: ''
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.order?.id) {
    ruleForm.value.id = props.order.id;
    ruleForm.value.approved_amount = props.order.apply_amount || 0;
    ruleForm.value.interest_rate = props.order.interest_rate || 0;
  }
}

function closeModal() {
  btnLoading.value = false;
  visible.value = false;
}

async function handleSubmit() {
  errorObj.value = {};

  if (ruleForm.value.status === 'approved') {
    if (isEmpty(ruleForm.value.approved_amount) || ruleForm.value.approved_amount <= 0) {
      errorObj.value.approved_amount = '请输入有效的审批金额';
    }
    if (isEmpty(ruleForm.value.interest_rate) || ruleForm.value.interest_rate < 0) {
      errorObj.value.interest_rate = '请输入有效的利率';
    }
  } else if (isEmpty(ruleForm.value.reject_reason)) {
    errorObj.value.reject_reason = '请输入拒绝原因';
  }

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }

  btnLoading.value = true;

  try {
    const data: any = {
      id: ruleForm.value.id,
      status: ruleForm.value.status
    };

    // 根据审批状态添加相应字段
    if (ruleForm.value.status === 'approved') {
      data.approved_amount = ruleForm.value.approved_amount;
      data.interest_rate = ruleForm.value.interest_rate;
    } else {
      data.reject_reason = ruleForm.value.reject_reason;
    }

    // 添加备注（如果有）
    if (ruleForm.value.remark) {
      data.remark = ruleForm.value.remark;
    }

    await LoanOrderAudit(data);

    const statusText = ruleForm.value.status === 'approved' ? '审核通过' : '审核拒绝';
    window.$message?.success(`${statusText}成功`);
    closeModal();
    emit('submitted');
  } catch (error) {
    errorObj.value = error;
  } finally {
    btnLoading.value = false;
  }
}

watch(visible, async () => {
  if (visible.value) {
    await handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="600">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.status" label="审核结果" form-type="select" :data-list="statusOptions" />

        <!-- 通过时的字段 -->
        <template v-if="ruleForm.status === 'approved'">
          <MyFormItem
            v-model="ruleForm.approved_amount"
            label="审批金额"
            prop-name="approved_amount"
            form-type="number"
          />
          <MyFormItem v-model="ruleForm.interest_rate" label="利率%" prop-name="interest_rate" form-type="number" />
        </template>

        <!-- 拒绝时的字段 -->
        <template v-if="ruleForm.status === 'rejected'">
          <MyFormItem v-model="ruleForm.reject_reason" label="拒绝原因" prop-name="reject_reason" type="textarea" />
        </template>

        <!-- 备注 -->
        <MyFormItem v-model="ruleForm.remark" label="备注" type="textarea" />
      </MyForm>
      <template #footer>
        <NSpace :size="16">
          <NButton :loading="btnLoading" @click="closeModal">取消</NButton>
          <NButton type="primary" :loading="btnLoading" @click="handleSubmit">确定</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
