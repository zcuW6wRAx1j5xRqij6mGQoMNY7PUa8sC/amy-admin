<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { NButton, NDrawer, NDrawerContent, NSpace, useMessage } from 'naive-ui';
import { OrderOtcCreate, type OtcCreateRequest } from '@/service/api/order';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'OtcCreateDrawer'
});

interface Props {
  visible: boolean;
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

const formData = ref<OtcCreateRequest>({
  block_trade_id: 0,
  close_fee: 0,
  leverage: 1,
  open_fee: 0,
  price: 0,
  quantity: 0,
  uid: 0
});

function createDefaultModel(): OtcCreateRequest {
  return {
    block_trade_id: 0,
    close_fee: 0,
    leverage: 1,
    open_fee: 0,
    price: 0,
    quantity: 0,
    uid: 0
  };
}

async function handleInitModel() {
  errorObj.value = {};
  formData.value = createDefaultModel();
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
  // 重置表单
  formData.value = createDefaultModel();
}

// 提交建仓
async function handleSubmit() {
  errorObj.value = {};

  // 表单验证
  if (isEmpty(formData.value.uid) || formData.value.uid <= 0) {
    errorObj.value.uid = '请选择用户';
  }
  if (isEmpty(formData.value.block_trade_id) || formData.value.block_trade_id <= 0) {
    errorObj.value.block_trade_id = '请选择大宗股票';
  }
  if (isEmpty(formData.value.price) || formData.value.price <= 0) {
    errorObj.value.price = '请输入有效的单价';
  }
  if (isEmpty(formData.value.quantity) || formData.value.quantity <= 0) {
    errorObj.value.quantity = '请输入有效的数量';
  }
  if (isEmpty(formData.value.leverage) || formData.value.leverage <= 0) {
    errorObj.value.leverage = '请输入有效的杠杆';
  }

  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }

  btnLoading.value = true;
  try {
    await OrderOtcCreate(formData.value);
    message.success('建仓操作成功');
    closeDrawer();
    emit('submitted');
  } catch (error) {
    console.error('建仓失败:', error);
    message.error('建仓操作失败');
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
    <NDrawerContent title="建仓操作" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="formData.uid"
          label="用户ID"
          prop-name="uid"
          form-type="number"
          :min="1"
          :precision="0"
          placeholder="请输入用户ID"
        />

        <MyFormItem
          v-model="formData.block_trade_id"
          label="大宗股票ID"
          prop-name="block_trade_id"
          form-type="number"
          :min="1"
          :precision="0"
          placeholder="请输入大宗股票ID"
        />

        <MyFormItem
          v-model="formData.price"
          label="单价"
          prop-name="price"
          form-type="number"
          :min="0"
          :precision="2"
          placeholder="请输入单价"
        />

        <MyFormItem
          v-model="formData.quantity"
          label="数量"
          prop-name="quantity"
          form-type="number"
          :min="1"
          :precision="0"
          placeholder="请输入数量"
        />

        <MyFormItem
          v-model="formData.leverage"
          label="杠杆"
          prop-name="leverage"
          form-type="number"
          :min="1"
          :precision="0"
          placeholder="请输入杠杆倍数"
        />

        <MyFormItem
          v-model="formData.open_fee"
          label="建仓手续费"
          prop-name="open_fee"
          form-type="number"
          :min="0"
          :precision="2"
          placeholder="请输入建仓手续费，默认0"
        />

        <MyFormItem
          v-model="formData.close_fee"
          label="平仓手续费"
          prop-name="close_fee"
          form-type="number"
          :min="0"
          :precision="2"
          placeholder="请输入平仓手续费，默认0"
        />
      </MyForm>

      <template #footer>
        <NSpace :size="16">
          <NButton :loading="btnLoading" @click="closeDrawer">取消</NButton>
          <NButton type="primary" :loading="btnLoading" @click="handleSubmit">
            建仓
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
