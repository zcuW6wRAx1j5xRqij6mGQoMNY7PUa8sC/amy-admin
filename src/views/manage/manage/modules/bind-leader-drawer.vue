<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions({
  name: 'BindLeaderDrawer'
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

const formData = ref({
  id: null,
  leader_id: null
});

const leaderList = ref([]);
const btnLoading = ref(false);
const errorObj = ref<Record<string, string>>({});

function handleInitModel() {
  errorObj.value = {};
  formData.value = {
    salesman_id: null,
    leader_id: null
  };
  if (props.rowData) {
    formData.value.salesman_id = props.rowData.id;
    formData.value.leader_id = props.rowData.parent?.id || null;
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}

// async function handleSubmit() {
//   errorObj.value = {};
//   if (isEmpty(formData.value.leader_id)) {
//     errorObj.value.leader_id = '请选择组长';
//     return;
//   }

//   btnLoading.value = true;
//   try {
//     await fetchBindParent(formData.value);
//     window.$message?.success('分配成功');
//     closeDrawer();
//     emit('submitted');
//   } catch (error) {
//     errorObj.value = error as Record<string, string>;
//   } finally {
//     btnLoading.value = false;
//   }
// }

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    // getLeaderList();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent title="分配组长" :native-scrollbar="false" closable>
      <MyForm :error-obj="errorObj">
        <MyFormItem
          v-model="formData.leader_id"
          label="组长"
          form-type="select"
          :data-list="leaderList"
          prop-name="leader_id"
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
