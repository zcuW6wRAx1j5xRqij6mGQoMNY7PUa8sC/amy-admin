<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { depositList, statusList } from '@/constants/business';
import { CryptoCoinInfo, CryptoCreateCoin, type CryptoPostCoinPlader, CryptoUpdateCoin } from '@/service/api/crypto';
import { isEmpty } from '@/utils/is';

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: CryptoPostCoinPlader | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增币种',
    edit: '编辑币种'
  };
  return titles[props.operateType];
});

const model = ref(createDefaultModel());

function createDefaultModel(): CryptoPostCoinPlader {
  return {
    logo: '',
    name: '',
    block: '',
    id: undefined,
    full_name: '',
    deposit_address: '',
    allow_deposit: 0,
    allow_withdraw: 1,
    status: 0,
    withdraw_fee: 0
  };
}

const isEdit = computed(() => props.operateType === 'edit');

async function handleInitModel() {
  errorObj.value = {};
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await CryptoCoinInfo({ id: props.rowData.id });
      Object.assign(model.value, detailData);
    } catch (error) {
      console.error('获取币种详情失败:', error);
      // 如果详情接口失败，使用传入的rowData作为备选
      Object.assign(model.value, props.rowData);
    }
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const btnLoading = ref(false);

async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(model.value.logo)) {
    errorObj.value.logo = '请上传logo';
  }
  if (isEmpty(model.value.name)) {
    errorObj.value.name = '请输入货币名称';
  }
  if (isEmpty(model.value.block)) {
    errorObj.value.block = '请输入链名称';
  }
  if (isEmpty(model.value.status)) {
    errorObj.value.status = '请选择状态';
  }
  if (isEmpty(model.value.full_name)) {
    errorObj.value.full_name = '请输入全称';
  }
  if (isEmpty(model.value.deposit_address)) {
    errorObj.value.deposit_address = '请输入充值地址';
  }
  if (isEmpty(model.value.allow_deposit)) {
    errorObj.value.allow_deposit = '请选择是否允许充值';
  }
  if (isEmpty(model.value.allow_withdraw)) {
    errorObj.value.allow_withdraw = '请选择是否允许提现';
  }
  if (isEmpty(model.value.withdraw_fee) && model.value.withdraw_fee !== 0) {
    errorObj.value.withdraw_fee = '请输入提现手续费';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = isEdit.value ? CryptoUpdateCoin : CryptoCreateCoin;
  if (model.value.index) model.value.index = undefined;
  try {
    await action(model.value);
    window.$message?.success('操作成功');
    closeDrawer();
    emit('submitted');
  } catch (error) {
    errorObj.value = error;
  } finally {
    btnLoading.value = false;
  }
}

const errorObj = ref<Record<string, string>>({});

watch(visible, async () => {
  if (visible.value) {
    await handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="model.logo" label="Logo" prop-name="logo" form-type="upload" />
        <MyFormItem v-model="model.name" label="货币名称" prop-name="name" />
        <MyFormItem v-model="model.block" label="链名称" prop-name="block" />
        <MyFormItem v-model="model.full_name" label="全称" prop-name="full_name" />
        <MyFormItem v-model="model.deposit_address" label="充值地址" prop-name="deposit_address" />
        <MyFormItem
          v-model="model.allow_deposit"
          label="是否允许充值"
          form-type="select"
          :data-list="depositList"
          prop-name="allow_deposit"
        />
        <MyFormItem
          v-model="model.allow_withdraw"
          label="是否允许提现"
          form-type="select"
          :data-list="depositList"
          prop-name="allow_withdraw"
        />
        <MyFormItem
          v-model="model.withdraw_fee"
          label="提现手续费（0-1）如0.01表示1‰"
          prop-name="withdraw_fee"
          form-type="number"
          placeholder="请输入提现手续费，如0.01表示1‰"
        />
        <MyFormItem v-model="model.status" label="状态" form-type="select" :data-list="statusList" prop-name="status" />
      </MyForm>
      <template #footer>
        <NSpace :size="16">
          <NButton :loading="btnLoading" @click="closeDrawer">取消</NButton>
          <NButton type="primary" :loading="btnLoading" @click="handleSubmit">确定</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
