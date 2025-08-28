<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { statusList } from '@/constants/business';
import {
  CryptoCreateSymbol,
  type CryptoPostFuturesPlader,
  CryptoSymbolInfo,
  CryptoUpdateSymbol
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
    add: '新增交易对',
    edit: '编辑交易对'
  };
  return titles[props.operateType];
});

const model = ref(createDefaultModel());

function createDefaultModel(): CryptoPostFuturesPlader {
  return {
    coin_id: undefined,
    logo: '',
    name: '',
    symbol: '',
    base_asset: '',
    quote_asset: '',
    binance_symbol: '',
    digits: undefined,
    self_data: 0,
    status: 0
  };
}

const isEdit = computed(() => props.operateType === 'edit');

async function handleInitModel() {
  errorObj.value = {};
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await CryptoSymbolInfo({ id: props.rowData.id });
      Object.assign(model.value, {
        coin_id: detailData.coin_id,
        logo: detailData.logo,
        name: detailData.name,
        symbol: detailData.symbol,
        base_asset: detailData.base_asset,
        quote_asset: detailData.quote_asset
      });
    } catch (error) {
      console.error('获取交易对详情失败:', error);
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
  if (isEmpty(model.value.coin_id)) {
    errorObj.value.coin_id = '请输入货币ID';
  }
  if (isEmpty(model.value.name)) {
    errorObj.value.name = '请输入自定义名称';
  }
  if (isEmpty(model.value.symbol)) {
    errorObj.value.symbol = '请输入交易对名称';
  }
  if (isEmpty(model.value.base_asset)) {
    errorObj.value.base_asset = '请输入交易货币';
  }
  if (isEmpty(model.value.quote_asset)) {
    errorObj.value.quote_asset = '请输入计价货币';
  }
  if (isEmpty(model.value.status)) {
    errorObj.value.status = '请选择状态';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = isEdit.value ? CryptoUpdateSymbol : CryptoCreateSymbol;
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
        <MyFormItem v-model="model.coin_id" label="货币ID" prop-name="coin_id" />
        <MyFormItem v-model="model.logo" label="Logo" prop-name="logo" form-type="upload" />
        <MyFormItem v-model="model.name" label="自定义名称" prop-name="name" />
        <MyFormItem v-model="model.symbol" label="交易对名称" prop-name="symbol" />
        <MyFormItem v-model="model.base_asset" label="交易货币" prop-name="base_asset" />
        <MyFormItem v-model="model.quote_asset" label="计价货币" prop-name="quote_asset" />
        <MyFormItem v-model="model.binance_symbol" label="币安交易对别名" prop-name="binance_symbol" />
        <MyFormItem v-model="model.digits" label="结算小数位" prop-name="digits" />
        <MyFormItem
          v-model="model.self_data"
          label="自有行情"
          form-type="select"
          :data-list="statusList"
          prop-name="self_data"
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
