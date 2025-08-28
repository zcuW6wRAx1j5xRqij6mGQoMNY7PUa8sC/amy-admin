<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  type SetConfigPlader,
  WebsiteAddConfig,
  WebsiteConfigDetail,
  WebsiteUpdateConfig
} from '@/service/api/website';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'ConfigOperateDrawer'
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
    add: '新增配置',
    edit: '编辑配置'
  };
  return titles[props.operateType];
});

const typeList = ref([
  { value: 'string', label: 'string' },
  { value: 'integer', label: 'integer' },
  { value: 'boolean', label: 'boolean' },
  { value: 'json', label: 'json' }
]);

const ruleForm = ref(createDefaultModel());

function createDefaultModel(): SetConfigPlader {
  return {
    id: undefined,
    key: '',
    group: '',
    value_type: 'string',
    value: ''
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await WebsiteConfigDetail({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
    } catch (error) {
      console.error('获取配置详情失败:', error);
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
  if (isEmpty(ruleForm.value.key)) {
    errorObj.value.key = '请输入配置键';
  }
  if (isEmpty(ruleForm.value.group)) {
    errorObj.value.group = '请输入配置分组';
  }
  if (isEmpty(ruleForm.value.value_type)) {
    errorObj.value.value_type = '请选择配置类型';
  }
  if (isEmpty(ruleForm.value.value)) {
    errorObj.value.value = '请输入配置值';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = props.operateType === 'add' ? WebsiteAddConfig : WebsiteUpdateConfig;
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
        <MyFormItem v-model="ruleForm.key" label="配置键" prop-name="key" />
        <MyFormItem v-model="ruleForm.group" label="配置分组" prop-name="group" />
        <MyFormItem v-model="ruleForm.value_type" label="配置类型" form-type="select" :data-list="typeList" />
        <MyFormItem v-model="ruleForm.value" label="配置值" prop-name="value" />
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
