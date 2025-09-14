<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { WebsiteAddNotice, WebsiteNoticeDetail, WebsiteUpdateNotice } from '@/service/api/website';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'BannerOperateDrawer'
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
    add: '新增公告',
    edit: '编辑公告'
  };
  return titles[props.operateType];
});

const platformList = ref([
  { value: 'app', label: 'APP' },
  { value: 'web', label: 'WEB' }
]);

const statusList = ref([
  { value: 1, label: '正常' },
  { value: 2, label: '禁用' }
]);

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    id: undefined,
    subject: '',
    content: '',
    start_time: null,
    end_time: null,
    status: 1
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await WebsiteNoticeDetail({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
    } catch (error) {
      console.error('获取Banner详情失败:', error);
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
  if (isEmpty(ruleForm.value.subject)) {
    errorObj.value.subject = '请输入主题';
  }
  if (isEmpty(ruleForm.value.content)) {
    errorObj.value.content = '请输入内容';
  }
  if (ruleForm.value.status === undefined || ruleForm.value.status === null) {
    errorObj.value.status = '请选择状态';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  if (ruleForm.value.start_time) {
    ruleForm.value.start_time = dayjs(ruleForm.value.start_time).format('YYYY-MM-DD HH:mm:ss');
  }
  if (ruleForm.value.end_time) {
    ruleForm.value.end_time = dayjs(ruleForm.value.end_time).format('YYYY-MM-DD HH:mm:ss');
  }
  const action = props.operateType === 'add' ? WebsiteAddNotice : WebsiteUpdateNotice;
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
      <MyForm :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.subject" label="主题" prop-name="subject" placeholder="请输入主题" />
        <MyFormItem
          v-model="ruleForm.content"
          label="内容"
          prop-name="content"
          placeholder="请输入内容"
          type="textarea"
        />
        <MyFormItem v-model="ruleForm.start_time" label="开始时间" prop-name="start_time" type="datetime" />
        <MyFormItem v-model="ruleForm.end_time" label="结束时间" prop-name="end_time" type="datetime" />
        <MyFormItem
          v-model="ruleForm.status"
          is-required
          label="状态"
          form-type="select"
          :data-list="statusList"
          prop-name="status"
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
