<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { type BannerRequest, WebsiteAddBanner, WebsiteBannerDetail, WebsiteUpdateBanner } from '@/service/api/website';
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
    add: '新增Banner',
    edit: '编辑Banner'
  };
  return titles[props.operateType];
});

const platformList = ref([
  { value: 'app', label: 'APP' },
  { value: 'web', label: 'WEB' }
]);

const statusList = ref([
  { value: 0, label: '不展示' },
  { value: 1, label: '展示' }
]);

const ruleForm = ref(createDefaultModel());

function createDefaultModel(): BannerRequest {
  return {
    id: undefined,
    img_path: '',
    link_url: '',
    platform: 'web',
    sort: 0,
    status: 1
  };
}

async function handleInitModel() {
  errorObj.value = {};
  ruleForm.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData?.id) {
    try {
      const detailData = await WebsiteBannerDetail({ id: props.rowData.id });
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
  if (isEmpty(ruleForm.value.img_path)) {
    errorObj.value.img_path = '请上传图片';
  }
  if (isEmpty(ruleForm.value.platform)) {
    errorObj.value.platform = '请选择平台';
  }
  if (ruleForm.value.sort === undefined || ruleForm.value.sort === null) {
    errorObj.value.sort = '请输入排序';
  }
  if (ruleForm.value.status === undefined || ruleForm.value.status === null) {
    errorObj.value.status = '请选择状态';
  }
  if (Object.values(errorObj.value).some(item => item)) {
    return;
  }
  btnLoading.value = true;
  const action = props.operateType === 'add' ? WebsiteAddBanner : WebsiteUpdateBanner;
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
        <MyFormItem
          v-model="ruleForm.img_path"
          is-required
          label="图片"
          prop-name="img_path"
          form-type="upload"
          accept="image/*"
        />
        <MyFormItem v-model="ruleForm.link_url" label="跳转链接" prop-name="link_url" placeholder="请输入跳转链接" />
        <MyFormItem
          v-model="ruleForm.platform"
          is-required
          label="平台"
          form-type="select"
          :data-list="platformList"
          prop-name="platform"
        />
        <MyFormItem
          v-model="ruleForm.sort"
          label="排序"
          prop-name="sort"
          form-type="number"
          placeholder="数字越小越靠前"
        />
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
