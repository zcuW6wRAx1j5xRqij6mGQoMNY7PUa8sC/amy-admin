<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { EtfConfigCreate, EtfConfigDetail, EtfConfigUpdate, EtfProductList } from '@/service/api/etf';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'EtfConfigOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: any;
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
    add: '新增ETF设置',
    edit: '编辑ETF设置'
  };
  return titles[props.operateType];
});

const statusOptions = ref([
  { value: '0', label: '关闭' },
  { value: '1', label: '开启' }
]);

const productOptions = ref<Array<{ label: string; value: number }>>([]);

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    id: undefined,
    product_id: null,
    daily_profit_rate: null,
    min_quantity: null,
    max_quantity: null,
    status: '1'
  };
}

// 获取产品列表
async function getProductOptions() {
  try {
    const response = await EtfProductList({ page: 1, size: 1000 });
    if (response && Array.isArray(response.rows)) {
      productOptions.value = response.rows.map(item => ({
        label: item.name || `产品${item.id}`,
        value: item.id
      }));
    }
  } catch (error) {
    console.error('获取产品列表失败:', error);
  }
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await EtfConfigDetail({ id: props.rowData.id });
      Object.keys(ruleForm.value).forEach(key => {
        ruleForm.value[key] = detailData[key] || null;
        ruleForm.value.daily_profit_rate = detailData.daily_profit_rate
      });
    } catch (error) {
      console.error('获取设置详情失败:', error);
      // 如果详情接口失败，使用传入的rowData作为备选
      Object.keys(ruleForm.value).forEach(key => {
        ruleForm.value[key] = props.rowData[key] || null;
        ruleForm.value.daily_profit_rate = props.rowData?.daily_profit_rate || null;
      });
    }
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

async function handleSubmit() {
  errorObj.value = {};
  if (!ruleForm.value.product_id) {
    errorObj.value.product_id = '请选择产品';
  }
  if (ruleForm.value.daily_profit_rate === null || ruleForm.value.daily_profit_rate < 0) {
    errorObj.value.daily_profit_rate = '请输入有效的日收益率';
  }
  if (ruleForm.value.min_quantity === null || ruleForm.value.min_quantity < 0) {
    errorObj.value.min_quantity = '请输入有效的最小买入金额';
  }
  if (ruleForm.value.max_quantity === null || ruleForm.value.max_quantity < 0) {
    errorObj.value.max_quantity = '请输入有效的最大买入金额';
  }
  if (+ruleForm.value.min_quantity >= +ruleForm.value.max_quantity) {
    errorObj.value.max_quantity = '最大买入金额必须大于最小买入金额';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;

  try {
    const action = props.operateType === 'add' ? EtfConfigCreate : EtfConfigUpdate;
    await action(ruleForm.value);

    window.$message?.success('操作成功');
    closeDrawer();
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

onMounted(() => {
  getProductOptions();
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="600">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="ruleForm.product_id"
          label="产品"
          prop-name="product_id"
          form-type="select"
          :data-list="productOptions"
        />
        <MyFormItem
          v-model="ruleForm.daily_profit_rate"
          label="日收益率(%)"
          prop-name="daily_profit_rate"
          form-type="number"
        />
        <MyFormItem v-model="ruleForm.min_quantity" label="最小买入金额" prop-name="min_quantity" form-type="number" />
        <MyFormItem v-model="ruleForm.max_quantity" label="最大买入金额" prop-name="max_quantity" form-type="number" />
        <MyFormItem v-model="ruleForm.status" label="状态" form-type="select" :data-list="statusOptions" />
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
