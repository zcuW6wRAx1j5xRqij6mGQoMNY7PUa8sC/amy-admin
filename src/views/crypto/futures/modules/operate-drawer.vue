<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { statusList } from '@/constants/business';
import {
  CryptoCreateFutures,
  CryptoFuturesInfo,
  type CryptoPostFuturesPlader,
  CryptoUpdateFutures
} from '@/service/api/crypto';
import { isEmpty } from '@/utils/is';

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: CryptoPostFuturesPlader | null;
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
    add: '新增合约',
    edit: '编辑合约'
  };
  return titles[props.operateType];
});

const model = ref(createDefaultModel());

function createDefaultModel(): CryptoPostFuturesPlader {
  return {
    symbol_id: undefined,
    buy_spread: undefined,
    fee: undefined,
    id: undefined,
    sell_spread: undefined,
    sort: undefined,
    status: 0
  };
}

const isEdit = computed(() => props.operateType === 'edit');

async function handleInitModel() {
  errorObj.value = {};
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await CryptoFuturesInfo({ id: props.rowData.id });
      Object.assign(model.value, {
        buy_spread: detailData.rowData.buy_spread,
        fee: detailData.rowData.fee,
        id: detailData.rowData.id,
        sell_spread: detailData.rowData.sell_spread,
        sort: detailData.rowData.sort,
        status: detailData.rowData.status,
        symbol_id: detailData.rowData.symbol_id
      });
    } catch (error) {
      console.error('获取合约详情失败:', error);
      // 如果详情接口失败，使用传入的rowData作为备选
      Object.assign(model.value, {
        buy_spread: props.rowData.buy_spread,
        fee: props.rowData.fee,
        id: props.rowData.id,
        sell_spread: props.rowData.sell_spread,
        sort: props.rowData.sort,
        status: props.rowData.status,
        symbol_id: props.rowData.symbol_id
      });
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
  if (isEmpty(model.value.symbol_id)) {
    errorObj.value.symbol_id = '请输入交易对ID';
  }
  if (isEmpty(model.value.buy_spread)) {
    errorObj.value.buy_spread = '请输入买入点差';
  }
  if (isEmpty(model.value.sell_spread)) {
    errorObj.value.sell_spread = '请输入卖出点差';
  }
  if (isEmpty(model.value.fee)) {
    errorObj.value.fee = '请输入手续费';
  }
  if (isEmpty(model.value.sort)) {
    errorObj.value.sort = '请输入排序';
  }
  if (isEmpty(model.value.status)) {
    errorObj.value.status = '请选择状态';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = isEdit.value ? CryptoUpdateFutures : CryptoCreateFutures;
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
        <MyFormItem v-model="model.symbol_id" label="交易对ID" prop-name="symbol_id" />
        <MyFormItem v-model="model.sort" label="排序" prop-name="sort" />
        <MyFormItem v-model="model.buy_spread" label="买入点差" prop-name="buy_spread" />
        <MyFormItem v-model="model.sell_spread" label="卖出点差" prop-name="sell_spread" />
        <MyFormItem v-model="model.fee" label="手续费" prop-name="fee" />
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
