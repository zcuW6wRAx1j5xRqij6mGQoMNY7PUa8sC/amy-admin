<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchUpdateNotice } from '@/service/api/config';
import { statusList } from '@/constants/business';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'NoticeOperateDrawer'
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
    add: '新增',
    edit: '编辑'
  };
  return titles[props.operateType];
});

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    subject: '',
    content: '',
    status: 1
  };
}

function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(ruleForm.value, props.rowData);
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
  if (isEmpty(ruleForm.value.subject)) {
    errorObj.value.subject = '请输入标题';
  }
  if (isEmpty(ruleForm.value.content)) {
    errorObj.value.content = '请输入内容';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  fetchUpdateNotice(ruleForm.value)
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

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.subject" label="标题" prop-name="subject" />
        <MyFormItem label="内容" prop-name="content" form-type="textarea">
          <ObRichText v-model="ruleForm.content" />
        </MyFormItem>
        <MyFormItem v-model="ruleForm.status" label="状态" form-type="select" :data-list="statusList" />
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
