<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { fetchAddRole, fetchEditRole } from '@/service/api/rbac';
import { statusList } from '@/constants/business';
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
    desc: '',
    show_name: '',
    status: 1
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
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}
const btnLoading = ref(false);
async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(model.value.show_name)) {
    errorObj.value.show_name = '请输入名称';
  }
  if (isEmpty(model.value.desc)) {
    errorObj.value.desc = '请输入注释';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = isEdit.value ? fetchEditRole : fetchAddRole;
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
        <MyFormItem v-model="model.show_name" label="名称" prop-name="show_name" />
        <MyFormItem v-model="model.desc" label="注释" prop-name="desc" />
        <!-- <MyFormItem label="状态" formType="select" v-model="model.status" :dataList="statusList" propName="status" /> -->
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
