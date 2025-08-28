import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import utc from 'dayjs/plugin/utc'; // 导入 UTC 插件
import timezone from 'dayjs/plugin/timezone'; // 导入时区插件
import { isEmpty, isNumber } from '@/utils/is';
dayjs.extend(utc); // 注册 UTC 插件
dayjs.extend(timezone); // 注册时区插件
export function convertUtcToLocal(utcDate) {
  // 将 UTC 时间字符串转换为 Day.js 对象
  const localTime = dayjs.utc(utcDate).tz(dayjs.tz.guess()); // 使用当前时区转换
  return localTime.format('YYYY-MM-DD HH:mm:ss'); // 格式化为需要的时间格式
}
export const encodedParams = (obj = {}) => {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};
export const baseUrl = 'https://s3.vitaxon.com';

export function setBaseUrl(url) {
  if (!url) {
    return;
  }
  // 如果是绝对路径则拼接 否则直接返回
  if (url.startsWith('http')) {
    return url;
  }
  // 如果url第一个是/则不需要加不是的话则加上/
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  return `${baseUrl}/${url}`;
}
// 定义一个函数 friendlyNumber，用于格式化数字
export const friendlyNumber = (num, addSign = false) => {
  // 如果数字为空，则返回空字符串
  if (isEmpty(num)) {
    return '';
  }

  // 如果数字不是数字类型（包括字符串不能转换为数字），则直接返回原值
  if (!isNumber(num) && !Number(num) && Number(num) !== 0) {
    return num;
  }
  if (Number.isNaN(num)) {
    return 0.0;
  }
  // 将数字转换为字符串
  const numStr = num.toString();

  // 检查是否包含小数点
  const hasDecimal = numStr.includes('.');

  // 如果没有小数部分，补充 '.00'
  if (!hasDecimal) {
    return `${numStr}.00`;
  }

  // 找到小数点的位置
  const decimalIndex = numStr.indexOf('.');

  // 获取整数部分和小数部分
  const integerPart = numStr.slice(0, decimalIndex);
  let decimalPart = numStr.slice(decimalIndex + 1);

  // 移除小数部分末尾的 0
  while (decimalPart.endsWith('0')) {
    decimalPart = decimalPart.slice(0, -1);
  }

  // 如果小数部分长度大于 8，则截取前 8 位
  if (decimalPart.length > 8) {
    decimalPart = decimalPart.slice(0, 8);
  }

  // 如果小数部分长度小于 2，补 0 到两位
  while (decimalPart.length < 2) {
    decimalPart += '0';
  }

  // 组合结果
  const result = `${integerPart}.${decimalPart}`;

  // 如果 addSign 为 true 且最终值大于 0，添加 + 符号
  if (addSign && Number(num) > 0) {
    return `+${result}`;
  }

  // 返回格式化后的字符串
  return result;
};

/**
 * 相加
 *
 * @param {number | string} a - 第一个加数
 * @param {number | string} b - 第二个加数
 * @returns {string} - 相加结果
 */
export const add = (a, b) => {
  if (isEmpty(a) || isEmpty(b)) {
    return '0.00';
  }
  return new Decimal(a).plus(b).toString();
};

/**
 * 相减
 *
 * @param {number | string} a - 被减数
 * @param {number | string} b - 减数
 * @returns {string} - 相减结果
 */
export const subtract = (a, b) => {
  if (isEmpty(a) || isEmpty(b)) {
    return '0.00';
  }
  return new Decimal(a).minus(b).toString();
};

/**
 * 相乘
 *
 * @param {number | string} a - 第一个乘数
 * @param {number | string} b - 第二个乘数
 * @returns {string} - 相乘结果
 */
export const multiply = (a, b) => {
  if (isEmpty(a) || isEmpty(b)) {
    return '0.00';
  }
  return new Decimal(a).times(b).toString();
};

/**
 * 相除
 *
 * @param {number | string} a - 被除数
 * @param {number | string} b - 除数
 * @returns {string} - 相除结果
 */
export const divide = (a, b) => {
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return new Decimal(a).dividedBy(b).toString();
};
