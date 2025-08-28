<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { statusList } from '@/constants/business';
import { fetchAddAdmin, fetchEditAdmin, fetchGetAdminRoleList } from '@/service/api/rbac';
import { isEmpty } from '@/utils/is';
defineOptions({
  name: 'RoleOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Role | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const roleList = ref([]);
onMounted(() => {
  fetchGetAdminRoleList().then((data: any) => {
    roleList.value = Object.keys(data).map(el => {
      return {
        label: data[el],
        value: +el
      };
    });
  });
});
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增',
    edit: '编辑'
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    username: '',
    status: 1,
    password: '',
    role_id: null
  };
}

const isEdit = computed(() => props.operateType === 'edit');

function handleInitModel() {
  errorObj.value = {};
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    model.value.uid = props.rowData.id;
    Object.assign(model.value, props.rowData);
  }
  if (model.value.id) {
    model.value.password = undefined;
  } else {
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}
const btnLoading = ref(false);
async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(model.value.name)) {
    errorObj.value.name = '请输入名称';
  }
  if (isEmpty(model.value.account)) {
    errorObj.value.account = '请输入账号';
  }
  if (!isEdit.value) {
    if (isEmpty(model.value.password)) {
      errorObj.value.password = '请输入密码';
    }
  }
  if (isEmpty(model.value.status)) {
    errorObj.value.status = '请选择状态';
  }
  if (isEmpty(model.value.role_id)) {
    errorObj.value.role_id = '请选择角色';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = isEdit.value ? fetchEditAdmin : fetchAddAdmin;
  action(model.value)
    .then(() => {
      // request
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
const errorObj = ref<Record<string, string>>({});
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm all-required :error-obj="errorObj">
        <MyFormItem v-model="model.name" label="名称" prop-name="name" />
        <MyFormItem v-model="model.account" label="账号" prop-name="account" />
        <MyFormItem v-if="!model.id" v-model="model.password" label="密码" prop-name="password" type="password" />
        <MyFormItem v-model="model.status" label="状态" form-type="select" :data-list="statusList" prop-name="status" />
        <MyFormItem v-model="model.role_id" label="角色" form-type="select" :data-list="roleList" prop-name="role_id" />
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
