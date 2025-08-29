<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NButton, NCard, NPopconfirm, NSpace, NTag, NTree, useMessage } from 'naive-ui';
import { fetchAddMenu, fetchDeleteMenu, fetchEditMenu, fetchGetMenuList } from '@/service/api/rbac';
import { useAppStore } from '@/store/modules/app';
import { useAuth } from '@/hooks/business/auth';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import OperateDrawer from './modules/operate-drawer.vue';

const { hasAuth } = useAuth();
const appStore = useAppStore();
const message = useMessage();

// 树形数据
const treeData = ref([]);
const loading = ref(false);
const expandedKeys = ref([]);

// 抽屉相关
const drawerVisible = ref(false);
const operateType = ref('add');
const editingData = ref(null);
const parentNode = ref(null);

// 获取菜单数据
async function getMenuData() {
  loading.value = true;
  try {
    const response = await fetchGetMenuList();
    treeData.value = response.items || [];
    // 默认展开所有节点
    expandedKeys.value = getAllKeys(treeData.value);
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

// 获取所有节点的key
function getAllKeys(nodes) {
  const keys = [];
  if (!nodes || !Array.isArray(nodes)) return keys;

  nodes.forEach(node => {
    if (node && node.id) {
      keys.push(node.id);
      if (node.children && node.children.length > 0) {
        keys.push(...getAllKeys(node.children));
      }
    }
  });
  return keys;
}

// 新增菜单
function handleAdd(node) {
  operateType.value = 'add';
  editingData.value = {
    show_name: '',
    url: '',
    desc: '',
    visible: 1,
    position: '',
    icon: '',
    parent_id: node?.id || null,
    category: 1
  };
  parentNode.value = node;
  drawerVisible.value = true;
}

// 编辑菜单
function handleEdit(node) {
  operateType.value = 'edit';
  editingData.value = { ...node };

  // 找到父节点信息
  if (node.parent_id) {
    parentNode.value = findNodeById(treeData.value, node.parent_id);
  } else {
    parentNode.value = null;
  }

  drawerVisible.value = true;
}
// 删除菜单
async function handleDelete(id) {
  if (loading.value) return;
  try {
    loading.value = true;
    await fetchDeleteMenu({ id });
    message.success('删除成功');
    getMenuData();
  } catch (error) {
    console.error('删除失败:', error);
    message.error('删除失败');
  } finally {
    loading.value = false;
  }
}

// 根据ID查找节点
function findNodeById(nodes, id) {
  if (!nodes || !Array.isArray(nodes)) return null;

  for (const node of nodes) {
    if (node && node.id === id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// 抽屉提交后的回调
function handleDrawerSubmitted() {
  drawerVisible.value = false;
  getMenuData();
}

// 渲染树节点
function renderTreeLabel(data) {
  console.log(data);
  const node = data.option;
  if (!node) {
    return <div>加载中...</div>;
  }

  return (
    <div class="w-full flex items-center justify-between rounded-lg transition-colors hover:bg-gray-50">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="font-medium">{node.show_name || '未命名'}</span>
          <NTag size="small" type={node.category === 1 ? 'success' : 'warning'} class="font-medium">
            {node.category === 1 ? '菜单' : '按钮'}
          </NTag>
        </div>
        {node.url && (
          <NTag size="small" type="info" class="font-medium">
            {node.url}
          </NTag>
        )}
      </div>
      <div class="ml-2 flex items-center gap-1">
        {node.category === 1 && hasAuth('add') && (
          <NButton
            type="primary"
            size="tiny"
            onClick={e => {
              e.stopPropagation();
              handleAdd(node);
            }}
          >
            <svg-icon icon="tabler:code-plus" class="h-4 w-4" />
          </NButton>
        )}
        {hasAuth('edit') && (
          <NButton
            type="primary"
            size="tiny"
            onClick={e => {
              e.stopPropagation();
              handleEdit(node);
            }}
          >
            <svg-icon icon="tabler:pencil-cog" class="h-4 w-4" />
          </NButton>
        )}
        {hasAuth('delete') && (
          <NPopconfirm onPositiveClick={() => handleDelete(node.id)}>
            {{
              default: () => `确认删除这个${node.category === 1 ? '菜单' : '按钮'}吗？`,
              trigger: () => (
                <NButton type="error" size="tiny" onClick={e => e.stopPropagation()}>
                  <svg-icon icon="tabler:trash" color="red" class="h-4 w-4" />
                </NButton>
              )
            }}
          </NPopconfirm>
        )}
      </div>
    </div>
  );
}

onMounted(() => {
  getMenuData();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="菜单管理" :bordered="false" size="small" class="card-wrapper shadow-sm sm:flex-1-hidden">
      <template #header-extra>
        <NButton v-if="hasAuth('add')" type="primary" @click="handleAdd">新增</NButton>
      </template>
      <NSpin :show="loading">
        <!-- 调试信息 -->
        <div v-if="treeData.length === 0 && !loading" class="p-8 text-center">
          <div class="mb-2 text-lg text-gray-400">暂无菜单数据</div>
          <div class="text-sm text-gray-300">点击右上角的新增按钮开始创建菜单</div>
        </div>

        <div v-if="hasAuth('index')" class="h-full overflow-auto">
          <NTree
            v-if="treeData.length > 0"
            :data="treeData"
            :loading="loading"
            key-field="id"
            label-field="show_name"
            children-field="children"
            :render-label="renderTreeLabel"
            class="menu-tree h-full"
          />
        </div>

        <OperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          :parent-node="parentNode"
          @submitted="handleDrawerSubmitted"
        />
      </NSpin>
    </NCard>
  </div>
</template>

<style scoped>
.menu-tree :deep(.n-tree-node) {
  margin: 4px 0;
}

.menu-tree :deep(.n-tree-node-content__icon) {
  margin-right: 8px;
}

.menu-tree :deep(.n-tree-node-content__label) {
  flex: 1;
  min-width: 0;
}
</style>
