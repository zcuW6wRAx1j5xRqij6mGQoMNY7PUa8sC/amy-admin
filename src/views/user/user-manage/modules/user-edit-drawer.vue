<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchGetUserInfo, fetchUpdateUser } from '@/service/api/user';
import { getLevelOptions } from '@/service/api/common';
import { isEmpty } from '@/utils/is';

defineOptions({
  name: 'UserEditDrawer'
});

interface Props {
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

const title = computed(() => '编辑用户信息');

const ruleForm = ref(createDefaultModel());

function createDefaultModel() {
  return {
    id: undefined,
    email: '',
    phone: '',
    phone_code: '',
    nickname: '',
    parent_id: null,
    level_id: null,
    credit: 0,
    is_kyc: 0,
    status: 1,
    remark: '',
    role_id: null
  };
}

async function handleInitModel() {
  ruleForm.value = createDefaultModel();

  if (props.rowData?.id) {
    try {
      btnLoading.value = true;
      const detailData = await fetchGetUserInfo({ id: props.rowData.id });
      Object.assign(ruleForm.value, detailData);
    } catch (error: any) {
      console.error('获取用户详情失败:', error);
    } finally {
      btnLoading.value = false;
    }
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

// 等级选项
const levelOptions = ref<Array<{ label: string; value: number }>>([]);

// 获取等级选项
async function fetchLevelOptions() {
  try {
    const data = await getLevelOptions();
    levelOptions.value = data.map((item: any) => ({
      label: item.name || item.slug,
      value: item.id
    }));
  } catch (error) {
    console.error('获取等级选项失败:', error);
  }
}

const statusOptions = [
  { label: '禁用', value: 0 },
  { label: '正常', value: 1 }
];

const kycOptions = [
  { label: '否', value: 0 },
  { label: '是', value: 1 }
];

async function handleSubmit() {
  errorObj.value = {};
  btnLoading.value = true;

  try {
    await fetchUpdateUser(ruleForm.value);
    window.$message?.success('更新成功');
    closeDrawer();
    emit('submitted');
  } catch (error: any) {
    errorObj.value = error;
    console.error('更新用户失败:', error);
  } finally {
    btnLoading.value = false;
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    fetchLevelOptions();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.email" label="邮箱" prop-name="email" />
        <MyFormItem v-model="ruleForm.phone" label="手机号" prop-name="phone" />
        <MyFormItem v-model="ruleForm.phone_code" label="国际区号" prop-name="phone_code" />
        <MyFormItem v-model="ruleForm.nickname" label="昵称" prop-name="nickname" />
        <MyFormItem v-model="ruleForm.parent_id" label="上级ID" prop-name="parent_id" />
        <MyFormItem
          v-model="ruleForm.level_id"
          label="用户等级"
          form-type="select"
          :data-list="levelOptions"
          prop-name="level_id"
        />
        <MyFormItem v-model="ruleForm.credit" label="信用分" prop-name="credit" />
        <MyFormItem
          v-model="ruleForm.is_kyc"
          label="是否实名"
          form-type="select"
          :data-list="kycOptions"
          prop-name="is_kyc"
        />
        <MyFormItem
          v-model="ruleForm.status"
          label="状态"
          form-type="select"
          :data-list="statusOptions"
          prop-name="status"
        />
        <MyFormItem v-model="ruleForm.remark" label="备注" prop-name="remark" />
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
