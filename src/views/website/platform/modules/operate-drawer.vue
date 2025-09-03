<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { PlatformSettingCreate, PlatformSettingDetail, PlatformSettingUpdate } from '@/service/api/platform';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'PlatformSettingOperateDrawer'
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
    add: '新增平台设置',
    edit: '编辑平台设置'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    id: undefined,
    group: '',
    key: '',
    name: '',
    value: ''
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await PlatformSettingDetail({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
    } catch (error) {
      console.error('获取设置详情失败:', error);
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
  if (isEmpty(ruleForm.value.group)) {
    errorObj.value.group = '请输入分组';
  }
  if (isEmpty(ruleForm.value.key)) {
    errorObj.value.key = '请输入键';
  }
  if (isEmpty(ruleForm.value.name)) {
    errorObj.value.name = '请输入名称';
  }
  if (isEmpty(ruleForm.value.value)) {
    errorObj.value.value = '请输入值';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;

  try {
    const action = props.operateType === 'add' ? PlatformSettingCreate : PlatformSettingUpdate;
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
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="600">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.group" label="分组" prop-name="group" />
        <MyFormItem v-model="ruleForm.key" label="键" prop-name="key" />
        <MyFormItem v-model="ruleForm.name" label="名称" prop-name="name" />
        <MyFormItem v-model="ruleForm.value" label="值" prop-name="value" type="textarea" />
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
