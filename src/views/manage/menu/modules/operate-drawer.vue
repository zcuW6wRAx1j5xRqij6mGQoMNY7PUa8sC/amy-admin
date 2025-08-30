<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NButton, NDrawer, NDrawerContent, NSpace } from 'naive-ui';
import { fetchAddMenu, fetchEditMenu, fetchGetMenuList } from '@/service/api/rbac';
import { isEmpty } from '@/utils/is';

const categoryList = [
  { label: '菜单', value: 1 },
  { label: '按钮', value: 2 }
];

defineOptions({
  name: 'MenuOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: any;
  /** the parent node data */
  parentNode?: any;
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
    url: '',
    desc: '',
    show_name: '',
    visible: 1,
    position: '',
    icon: '',
    parent_id: null,
    category: 1
  };
}

const isEdit = computed(() => props.operateType === 'edit');

function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(ruleForm.value, props.rowData);
  } else if (props.operateType === 'add' && props.parentNode) {
    // 新增时，如果有父节点，自动设置父级ID
    ruleForm.value.parent_id = props.parentNode.id || null;
  }
}

function closeDrawer() {
  btnLoading.value = false;
  visible.value = false;
}
const btnLoading = ref(false);
async function handleSubmit() {
  errorObj.value = {};
  if (isEmpty(ruleForm.value.show_name)) {
    errorObj.value.show_name = '请输入名称';
  }
  if (isEmpty(ruleForm.value.url)) {
    errorObj.value.url = '请输入地址';
  }
  if (isEmpty(ruleForm.value.position)) {
    errorObj.value.position = '请输入排序';
    return;
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = isEdit.value ? fetchEditMenu : fetchAddMenu;
  ruleForm.value.parent_id = +ruleForm.value.parent_id || 0;
  ruleForm.value.desc = ruleForm.value.desc || '';
  ruleForm.value.icon = ruleForm.value.icon || 'memory:align-horizontal-center';
  action(ruleForm.value)
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
const selectMenu = ref([]);
const getList = () => {
  fetchGetMenuList().then(data => {
    const list = [];
    data.rows.forEach(el => {
      list.push({
        label: el.show_name,
        value: el.id
      });
      if (el.children) {
        el.children.forEach(item => {
          list.push({
            label: item.show_name,
            value: item.id
          });
        });
      }
    });
    selectMenu.value = list;
  });
};
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    getList();
    errorObj.value = {};
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <MyForm :error-obj="errorObj">
        <MyFormItem v-model="ruleForm.show_name" is-required label="名称" prop-name="show_name" />
        <MyFormItem v-model="ruleForm.url" is-required label="地址" prop-name="url" />
        <MyFormItem v-model="ruleForm.position" is-required label="排序" prop-name="position" />
        <MyFormItem v-model="ruleForm.desc" label="注释" prop-name="desc" />
        <MyFormItem
          v-model="ruleForm.category"
          label="类型"
          form-type="select"
          :data-list="categoryList"
          prop-name="category"
        />
        <MyFormItem
          v-model="ruleForm.parent_id"
          label="父级"
          form-type="select"
          :data-list="selectMenu"
          prop-name="parent_id"
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
