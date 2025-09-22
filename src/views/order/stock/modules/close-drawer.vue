<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NButton, NDrawer, NDrawerContent, NSpace, useMessage } from 'naive-ui';
import { OrderMarketClosed, type OtcCloseRequest } from '@/service/api/order';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'OtcCloseDrawer'
});

interface Props {
  rowData?: any;
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

const formData = ref({
  id: 0,
});

function createDefaultModel() {
  return {
    id: 0,
  };
}

async function handleInitModel() {
  errorObj.value = {};
  formData.value = createDefaultModel();
  if (props.rowData) {
    formData.value = {
      id: props.rowData.id,
    };
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

// 提交平仓
async function handleSubmit() {
  errorObj.value = {};

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }

  btnLoading.value = true;
  try {
    await OrderMarketClosed(formData.value);
    message.success('平仓操作成功');
    closeDrawer();
    emit('submitted');
  } catch (error) {
    console.error('平仓失败:', error);
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
    <NDrawerContent title="平仓操作" :native-scrollbar="false" closable>
      <!-- 只读信息显示 -->
      <div class="readonly-info">
        <div class="info-item">
          <span class="label">订单ID:</span>
          <span class="value">{{ formData.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">成交价格:</span>
          <span class="value">{{ rowData?.match_price || 0 }}</span>
        </div>
        <div class="info-item">
          <span class="label">成交数量:</span>
          <span class="value">{{ rowData?.match_quantity || 0 }}</span>
        </div>
      </div>

      <!-- 表单区域 -->
      <!-- <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="formData.close_price"
          label="平仓价格"
          prop-name="close_price"
          form-type="number"
          :min="0"
          :precision="2"
          placeholder="请输入平仓价格，0为系统设定平仓价格"
        />
      </MyForm> -->

      <template #footer>
        <NSpace :size="16">
          <NButton :loading="btnLoading" @click="closeDrawer">取消</NButton>
          <NButton type="primary" :loading="btnLoading" @click="handleSubmit">平仓</NButton>
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
</style>
