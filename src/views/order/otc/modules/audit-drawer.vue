<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NButton, NDrawer, NDrawerContent, NSpace, useMessage } from 'naive-ui';
import { OrderOtcAudit, type OtcAuditRequest } from '@/service/api/order';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'OtcAuditDrawer'
});

interface Props {
  rowData?: any;
  auditType: 'approve' | 'reject';
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'submitted'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const message = useMessage();

const visible = defineModel<boolean>('visible', {
  default: false
});

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

const formData = ref<OtcAuditRequest>({
  id: 0,
  match_price: 0,
  match_quantity: 0,
  status: 'open'
});

const title = computed(() => {
  return props.auditType === 'approve' ? '审核通过' : '审核拒绝';
});

function createDefaultModel(): OtcAuditRequest {
  return {
    id: 0,
    match_price: 0,
    match_quantity: 0,
    status: props.auditType === 'approve' ? 'open' : 'rejected'
  };
}

async function handleInitModel() {
  errorObj.value = {};
  formData.value = createDefaultModel();
  if (props.rowData) {
    formData.value = {
      id: props.rowData.id,
      match_price: props.auditType === 'approve' ? props.rowData.apply_price || 0 : 0,
      match_quantity: props.auditType === 'approve' ? props.rowData.apply_quantity || 0 : 0,
      status: props.auditType === 'approve' ? 'open' : 'rejected'
    };
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

// 提交审核
async function handleSubmit() {
  errorObj.value = {};

  // 表单验证
  if (props.auditType === 'approve') {
    if (isEmpty(formData.value.match_price) || formData.value.match_price <= 0) {
      errorObj.value.match_price = '请输入有效的成交价格';
    }
    if (isEmpty(formData.value.match_quantity) || formData.value.match_quantity <= 0) {
      errorObj.value.match_quantity = '请输入有效的成交数量';
    }
  }

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }

  btnLoading.value = true;
  try {
    await OrderOtcAudit(formData.value);
    message.success('审核操作成功');
    closeDrawer();
    emit('submitted');
  } catch (error) {
    console.error('审核失败:', error);
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
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <!-- 只读信息显示 -->
      <div class="readonly-info">
        <div class="info-item">
          <span class="label">订单ID:</span>
          <span class="value">{{ formData.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">申请价格:</span>
          <span class="value">{{ rowData?.apply_price || 0 }}</span>
        </div>
        <div class="info-item">
          <span class="label">申请数量:</span>
          <span class="value">{{ rowData?.apply_quantity || 0 }}</span>
        </div>
      </div>

      <!-- 表单区域 -->
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-if="auditType === 'approve'"
          v-model="formData.match_price"
          label="成交价格"
          prop-name="match_price"
          form-type="number"
          :min="0"
          :precision="2"
        />

        <MyFormItem
          v-if="auditType === 'approve'"
          v-model="formData.match_quantity"
          label="成交数量"
          prop-name="match_quantity"
          form-type="number"
          :min="0"
          :precision="0"
        />

        <!-- 审核状态显示 -->
        <div class="status-display">
          <span class="label">审核状态:</span>
          <span class="value" :class="auditType === 'approve' ? 'status-approve' : 'status-reject'">
            {{ auditType === 'approve' ? '通过' : '拒绝' }}
          </span>
        </div>
      </MyForm>

      <template #footer>
        <NSpace :size="16">
          <NButton :loading="btnLoading" @click="closeDrawer">取消</NButton>
          <NButton :type="auditType === 'approve' ? 'success' : 'error'" :loading="btnLoading" @click="handleSubmit">
            {{ auditType === 'approve' ? '通过' : '拒绝' }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.readonly-info {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #495057;
  min-width: 80px;
  margin-right: 12px;
}

.value {
  color: #212529;
  font-weight: 600;
}

.status-display {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.status-display .label {
  font-weight: 500;
  color: #495057;
  min-width: 80px;
  margin-right: 12px;
}

.status-display .value {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.status-approve {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-reject {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
