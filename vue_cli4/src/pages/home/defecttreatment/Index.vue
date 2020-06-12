<!--
 * @Date         : 2020-05-15 15:24:37
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:27:37
 * @FilePath     : \src\pages\home\defecttreatment\Index.vue
 -->
<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator';
import { getModule } from "vuex-module-decorators";
import DefecttreatmentStore from 'store/modules/defecttreatment/defecttreatmentStore';
import msg from "common/MessageUtils";

@Component({})
export default class Defecttreatment extends Vue {
  private store: any;
  private state: string | null = null;
  private defaultProps: any = {
    children: "children",
    label: "inspectTask"
  }; // 树形对应的数据结构

  private selectList = []; // 表格选择项
  private dialogTitle: string | null = null; // 弹窗名称
  private dialog = false; // 弹窗的判断
  private safetyList = [{}]; // 隐患下拉
  private roleList = [
    {
      name: "一级",
      id: "一级"
    },
    {
      name: "二级",
      id: "二级"
    },
    {
      name: "三级",
      id: "三级"
    },
    {
      name: "四级",
      id: "四级"
    }
  ]; // 搜索的状态

  private category: any[] = [
    {
      name: "上级类别",
      value: null,
      list: this.safetyList,
      // must: true,
      link: "id"
    },
    {
      name: "新增类别",
      value: null,
      must: true,
      link: "inspectTask"
    }
  ]; // 添加类别的弹框内容

  private safety: any[] = [
    {
      name: "隐患类别",
      value: null,
      must: true,
      list: this.safetyList,
      link: "id"
    },
    {
      name: "隐患级别",
      value: null,
      must: true,
      list: this.roleList,
      link: "hazardLevel"
    },
    {
      name: "隐患状态",
      value: null,
      must: true,
      link: "state"
    },
    {
      name: "整改时限",
      value: null,
      must: true,
      link: "rectificationDate"
    },
    {
      name: "排查内容",
      value: null,
      must: true,
      textarea: true,
      link: "troubleshooting"
    },
    {
      name: "整改要求",
      value: null,
      must: true,
      textarea: true,
      link: "rectificationRequirements"
    }
  ]; // 添加隐患的弹框内容

  private mark: any = {}; // 地图点的挂载
  private safetyId: number | null = null; // 修改人员的id
  private code = "0" // 点击的id
  private pcode = null // 点击的pcode
  private children: any[] = [1] // 树形是否为最后一项
  private pid = null // 父id
  private safetyCode: number | null = null // 修改人员的code
  constructor() {
    super();
    this.store = getModule(DefecttreatmentStore);
  }

  async mounted() {
    const search = document.getElementsByClassName("el-input-group__append")[0];
    search.addEventListener("click", this.search);
    this.store.getTree();
    // await this.store.getRoleList().then((res: any) => {
    //   if (res.code == 0) {
    //     res.data.list.forEach((a, i) => {
    //       this.roleList.push({});
    //       this.$set(this.roleList[i], "id", a.id);
    //       this.$set(this.roleList[i], "name", a.name);
    //     });
    //   }
    // });
  }

  // 选择搜索项
  handleNodeClick(data: any) {
    this.code = data.code
    this.pcode = data.pcode
    this.children = data.children
    this.pid = data.id
    this.$set(this.safetyList[0], "name", data.inspectTask);
    this.$set(this.safetyList[0], "id", data.id);
    this.category[0].value = data.id;
    this.safety[0].value = data.id;
    if (data.code !== this.store.store.state.DefecttreatmentStore.codeId && !this.children.length) {
      this.store.setCodeIdWrap(data.code);
    }
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

  // 表格选择项
  handleSelectionChange(val: any) {
    this.selectList = val;
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
    this.store.store.state.DefecttreatmentStore.pageIndex = val;
    this.searchTable();
  }

  // 弹窗
  openDialog(title: string) {
    if (title === "添加" && this.children.length) {
      msg.warning("添加隐患只能在最底层的隐患库");
      return
    }
    this.dialogTitle = title;
    this.dialog = true;
  }

  // 关闭弹窗，清除数据
  clear() {
    this.dialog = false;
    switch (this.dialogTitle) {
      case "新建隐患类别":
        this.clearObj(this.category);
        break;
      case "添加":
        this.clearObj(this.safety);
        break;
      default:
        break;
    }
  }

  // 清除对象的属性
  clearObj(list: any[]) {
    list.forEach((item: any) => {
      if (item.name !== "上级类别" && item.name !== "隐患类别") {
        item.value = null;
      }
    });
    this.safetyId = null;
  }

  // 验证必填项
  async verify() {
    let list: any[] = [];
    switch (this.dialogTitle) {
      case "新建隐患类别":
        list = this.category;
        break;
      case "添加":
      case "修改隐患信息":
        list = this.safety;
        break;
      default:
        break;
    }
    if (!(await this.verifyList(list))) {
      msg.warning("*号项为必填项!");
      return;
    }
    this.add(list)
  }

  // 添加数据
  async add(list: any[]) {
    const params = {
      name: this.dialogTitle,
      list: list,
      pCode: this.dialogTitle === "添加" || this.dialogTitle === "新建隐患类别" ? this.code : null,
      id: this.dialogTitle === "修改隐患信息" ? this.safetyId : null,
      code: this.dialogTitle === "修改隐患信息" ? this.safetyCode : null
    }
    await this.store
      .add(params)
      .then((res: any) => {
        if (res.code === 0 && res.msg === "SUCCESS") {
          msg.success("成功!");
          this.clear();
          if (this.dialogTitle === "新建隐患类别") {
            this.store.getTree();
            return
          }
          this.store.getTable()
          return;
        }
        msg.warning("失败!");
      })
      .catch((e: any) => console.error(e))
  }

  // 统一验证方法
  verifyList(list: any[]) {
    return list.filter((a: any) => a.must).every((a: any) => a.value);
  }

  // 删除人员
  del(id: number) {
    this.store.del(id);
  }

  // 表格搜索
  searchTable() {
    this.store.getTable();
  }

  // 修改隐患信息
  async getPeople(data: any) {
    this.safetyId = data.id;
    this.safetyCode = data.code
    await this.store.getPeople(data.id).then((res: any) => {
      if (res.code === 0) {
        this.safety.forEach(a => {
          Object.keys(res.data).forEach(b => {
            if (a.link === b && b !== "id") {
              if (parseInt(res.data[b])) {
                a.value = parseInt(res.data[b]);
                return;
              }
              a.value = res.data[b];
            }
          });
        });
        this.dialogTitle = "修改隐患信息";
        this.dialog = true;
      }
    });
  }

  beforeDestroy () {
    this.store.refresh();
  }
}
</script>
<template lang="pug" src="views/defecttreatment.pug" />
<style lang="stylus" src="styles/defecttreatment.stylus" />
