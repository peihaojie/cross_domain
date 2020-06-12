/*
 * @Date         : 2020-06-10 16:58:02
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 11:40:12
 * @FilePath     : \src\shims-vue.d.ts
 */
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare let AMap: any;
declare module 'echarts'
