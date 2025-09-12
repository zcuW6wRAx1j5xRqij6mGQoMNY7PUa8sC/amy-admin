<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { UserLevelAdd, UserLevelDetail, type UserLevelRequest, UserLevelUpdate } from '@/service/api/user';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'UserLevelOperateDrawer'
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
    add: '新增用户等级',
    edit: '编辑用户等级'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel(): UserLevelRequest {
  return {
    id: undefined,
    slug: 0,
    name_en: '',
    name_es: '',
    name_jp: '',
    name_kr: '',
    despoit_money: 0,
    high_yield_rate: 0,
    high_yield_amount_rate: 0,
    normal_yield_rate: 0
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await UserLevelDetail({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
    } catch (error) {
      console.error('获取用户等级详情失败:', error);
      // 如果详情接口失败，使用传入的rowData作为备选
      Object.assign(ruleForm.value, props.rowData);
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
  if (isEmpty(ruleForm.value.slug)) {
    errorObj.value.slug = '请输入等级标识';
  }
  if (isEmpty(ruleForm.value.name_en)) {
    errorObj.value.name_en = '请输入英文名称';
  }
  if (isEmpty(ruleForm.value.name_es)) {
    errorObj.value.name_es = '请输入西班牙名称';
  }
  if (isEmpty(ruleForm.value.name_jp)) {
    errorObj.value.name_jp = '请输入日语名称';
  }
  if (isEmpty(ruleForm.value.name_kr)) {
    errorObj.value.name_kr = '请输入韩语名称';
  }
  if (ruleForm.value.despoit_money === undefined || ruleForm.value.despoit_money === null) {
    errorObj.value.despoit_money = '请输入充值金额';
  }
  if (ruleForm.value.high_yield_rate === undefined || ruleForm.value.high_yield_rate === null) {
    errorObj.value.high_yield_rate = '请输入高收益比例';
  }
  if (ruleForm.value.high_yield_amount_rate === undefined || ruleForm.value.high_yield_amount_rate === null) {
    errorObj.value.high_yield_amount_rate = '请输入高收益金额比例';
  }
  if (ruleForm.value.normal_yield_rate === undefined || ruleForm.value.normal_yield_rate === null) {
    errorObj.value.normal_yield_rate = '请输入普通收益比例';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = props.operateType === 'add' ? UserLevelAdd : UserLevelUpdate;
  action(ruleForm.value)
    .then(() => {
      window.$message?.success('操作成功');
      closeDrawer();
      emit('submitted');
    })
    .catch(error => {
      errorObj.value = error;
    })
    .finally(() => {
      btnLoading.value = false;
    });
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
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem
          v-model="ruleForm.slug"
          label="等级标识"
          :disabled="props.operateType === 'edit'"
          prop-name="slug"
          placeholder="请输入等级标识(数字)"
          form-type="number"
        />
        <MyFormItem v-model="ruleForm.name_en" label="英文名称" prop-name="name_en" placeholder="请输入英文名称" />
        <MyFormItem v-model="ruleForm.name_es" label="西班牙名称" prop-name="name_es" placeholder="请输入西班牙名称" />
        <MyFormItem v-model="ruleForm.name_jp" label="日语名称" prop-name="name_jp" placeholder="请输入日语名称" />
        <MyFormItem v-model="ruleForm.name_kr" label="韩语名称" prop-name="name_kr" placeholder="请输入韩语名称" />
        <MyFormItem
          v-model="ruleForm.despoit_money"
          label="充值金额"
          prop-name="despoit_money"
          form-type="number"
          placeholder="请输入充值金额"
        />
        <MyFormItem
          v-model="ruleForm.high_yield_amount_rate"
          label="高收益金额比例%"
          prop-name="high_yield_amount_rate"
          form-type="number"
          placeholder="请输入高收益金额比例"
        />
        <MyFormItem
          v-model="ruleForm.high_yield_rate"
          label="高收益比例%"
          prop-name="high_yield_rate"
          form-type="number"
          placeholder="请输入高收益比例"
        />
        <MyFormItem
          v-model="ruleForm.normal_yield_rate"
          label="普通收益比例%"
          prop-name="normal_yield_rate"
          form-type="number"
          placeholder="请输入普通收益比例"
        />
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
