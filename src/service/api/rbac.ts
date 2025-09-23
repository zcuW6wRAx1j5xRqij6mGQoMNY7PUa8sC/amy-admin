import ResetPwd from '@/views/_builtin/login/modules/reset-pwd.vue';
import { request } from '../request';
import type { CommIdPlader, CommListPlader } from './typescript/comm-plader';

interface MenuItemPlader {
  icon: string;
  id: number;
  open_link: number;
  parent_id: number;
  position: string;
  show_name: string;
  url: string;
  cgildren: any;
}

export interface ResetPwdPlader extends CommIdPlader {
  password: string;
}

export interface RoleAdminPlader extends CommIdPlader {
  role_id: number;
}

/**
 * 创建管理员
 */
export interface AccountPostPlader {
  id?: number;
  account?: string; // 账号
  avatar?: string; // 头像
  name?: string; // 姓名
  parent_id?: number; // 上级ID
  password?: string; // 密码
  role_id?: number; // 角色ID
  status?: number; // 状态 0 禁用 1 启用
}

// 获取个人菜单
export function fetchGetPersonalMenu() {
  return request<any>({ url: '/api/admin/menu/index' });
}

// 管理员列表
export function fetchGetAdminList(params: CommListPlader) {
  return request<any>({ url: '/api/admin/account/list', params });
}

// 添加管理员
export function fetchAddAdmin(data: AccountPostPlader) {
  return request<any>({ url: '/api/admin/account/create', method: 'post', data });
}

// 添加管理员
export function fetchUpdateAdmin(data: AccountPostPlader) {
  return request<any>({ url: '/api/admin/account/setting', data });
}

// 管理员退出登录
export function fetchAdminRolelogout() {
  return request<any>({ url: '/api/admin/account/logout', method: 'post' });
}

// 管理员角色选项
// export function fetchAdminRoleOptions() {
//   return request<any>({ url: '/api/admin/account/roleOptions' });
// }

// 管理员删除
export function fetchDeleteAdmin(params: CommIdPlader) {
  return request<any>({ url: `/api/admin/account/destroy`, params });
}

// 管理员冻结
export function fetchAdminFreeze(params: CommIdPlader) {
  return request<any>({ url: `/api/admin/account/freeze`, params });
}

// 管理员详情
export function fetchAdminInfo(params: CommIdPlader) {
  return request<any>({ url: `/api/admin/account/detail`, params });
}
// 管理员编辑
export function fetchEditAdmin(params: any) {
  return request<any>({ url: '/api/admin/account/setting', method: 'post', data: params });
}

// 重置密码
export function fetchAdminResetPwd(data: ResetPwdPlader) {
  return request<any>({ url: `/api/admin/account/resetPwd`, method: 'post', data });
}

// 管理员角色列表
export function fetchGetAdminRoleList() {
  return request<any>({ url: '/api/admin/account/roleOptions' });
}

// 菜单删除
export function fetchDeleteMenu(params: any) {
  return request<any>({ url: `/api/admin/menu/destroy`, params });
}

// 菜单列表
export function fetchGetMenuListPage(params: any) {
  return request<any>({ url: '/api/admin/menu/show', params });
}

// 角色删除
export function fetchDeleteRole(data: any) {
  return request<any>({ url: `/api/admin/role/destroy`, method: 'post', data });
}

// 角色添加
export function fetchAddRole(data: any) {
  return request<any>({ url: '/api/admin/role/store', method: 'post', data });
}

// 角色编辑
export function fetchEditRole(data: any) {
  return request<any>({ url: `/api/admin/role/update`, method: 'post', data });
}

// 分配权限
export function fetchAssignPermission(data: any) {
  return request<any>({ url: `/api/admin/role/assignMenus`, method: 'post', data });
}

// 菜单添加
export function fetchAddMenu(data: any) {
  return request<any>({ url: '/api/admin/menu/store', method: 'post', data });
}

// 菜单编辑
export function fetchEditMenu(data: any) {
  return request<any>({ url: `/api/admin/menu/update`, method: 'post', data });
}

// 角色详情
export function fetchGetRoleDetail(params: any) {
  return request<any>({ url: `/api/admin/role/detail`, params });
}

// 角色列表
export function fetchGetRoleListPage() {
  return request<any>({ url: '/api/admin/role/show' });
}

// 获取无分页的菜单列表
export function fetchGetMenuList() {
  return request<any>({ url: '/api/admin/menu/selector', method: 'get' });
}
