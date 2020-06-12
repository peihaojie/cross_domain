<!--
 * @Date         : 2020-06-03 14:19:57
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:29:10
 * @FilePath     : \src\pages\home\cultivate\Index.vue
-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import CultivateStore from "store/modules/cultivate/CultivateStore";
import Time from "common/mixin";

@Component({})
export default class Cultivate extends Vue {
  private store: any;
  private state = null;
  private defaultProps: any = {
    children: "children",
    label: "name"
  }; // 树形对应的数据结构

  private dialog = false; // 弹窗的判断
  private searchTime: [Date, Date] | null = null // 筛选的时间
  private searchType = null // 交底类型
  private searchGrade = null // 交底级别
  private searchTypeList: Array<any> = [] // 交底类型列表
  private searchGradeList: Array<any> = [] // 交底级别列表
  private table: Array<any> = [] // 表格的数据
  public pageIndex = 1;
  public total = 0;
  private pageSize = 15; // 表格行数
  private projectId = null; // 点击的uuid
  private dialogData: any = {}; // 弹窗数据
  constructor() {
    super();
    this.store = getModule(CultivateStore);
  }

  async mounted() {
    const search = document.getElementsByClassName("el-input-group__append")[0];
    search.addEventListener("click", this.search);
    await this.store.getTree();
    this.handleNodeClick(this.store.store.state.CultivateStore.tree[0])
    this.getType()
    this.getGrade()
  }

  // 获取类型列表
  getType() {
    this.store.getType().then((res: any) => {
      if (res.code === 0) {
        this.searchTypeList = res.data.map((a: any) => {
          return {
            label: a.station,
            value: a.groupValue
          }
        })
      }
    })
  }

  // 获取隐患级别
  getGrade() {
    this.store.getGrade().then((res: any) => {
      if (res.code === 0) {
        this.searchGradeList = res.data.map((a: any) => {
          return {
            label: a.station,
            value: a.groupValue
          }
        })
      }
    })
  }

  // 选择搜索项
  handleNodeClick(data: any) {
    this.projectId = data.uuid
    this.getTable()
  }

  // 获取表格数据
  getTable() {
    this.store.getTable({
      projectId: this.projectId,
      pageSize: this.pageSize,
      pageNum: this.pageIndex,
      startTime: this.searchTime && this.searchTime.length ? new Time(this.searchTime[0]).get() : null,
      endTime: this.searchTime && this.searchTime.length ? new Time(this.searchTime[1]).get() : null,
      disclosureLevel: this.searchGrade,
      disclosureType: this.searchType
    }).then((res: any) => {
      if (res.code === 0) {
        this.table = res.data.list
        this.total = res.data.total
      }
    })
  }

  // 搜索调用
  search() {
    if (this.state) {
      (this.$refs.attrList as any).store.defaultExpandAll = true;
      this.store.searchTree(this.state);
      return;
    }
    (this.$refs.attrList as any).store.defaultExpandAll = false;
    this.store.getTree();
  }

  // 表头样式
  headerRow() {
    return "table-header-bg";
  }

  // 表样式
  cell() {
    return "table-cell";
  }

  // 翻页
  handleCurrentChange(val: number) {
    this.pageIndex = val;
    this.getTable();
  }

  // 关闭弹窗，清除数据
  clear() {
    this.dialog = false;
  }

  // 弹窗
  getDialog(data: any) {
    this.dialogData = data
    this.dialog = true
  }

  beforeDestroy() {
    this.store.refresh()
  }
}
</script>
<template lang="pug" src="views/cultivate.pug" />
<style lang="stylus" src='styles/cultivate.stylus' />