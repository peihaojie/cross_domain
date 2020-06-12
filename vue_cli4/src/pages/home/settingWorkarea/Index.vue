<!--
 * @Date         : 2020-05-15 15:05:21
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:45:56
 * @FilePath     : \src\pages\home\settingWorkarea\Index.vue
 -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import settingWorkareaStore from "store/modules/settingWorkarea/SettingWorkareaStore";
import msg from "common/MessageUtils";
import settingOrganizationStore from "store/modules/settingOrganization/SettingOrganizationStore";

@Component({})
export default class SettingWorkarea extends Vue {
  private store: any;
  private settingOrganizationStore: any;
  private state = "";
  private visible = false;
  private parentPeople: Array<any> = [{}]; // 人员下拉框的上级组织
  private defaultProps: any = {
    children: "children",
    label: "name"
  }; // 树形对应的数据结构

  private role = ""; // 用户选择的角色
  private roleList: Array<any> = [
    {
      id: 1,
      name: "123"
    },
    {
      id: 2,
      name: "456"
    }
  ]; // 角色下拉菜单数据

  private selectList: Array<any> = []; // 表格选择项
  private dialogTitle = ""; // 弹窗名称
  private dialog = false; // 弹窗的判断
  private superiorCompany: Array<any> = [{}]; // 弹窗的判断
  private member: Array<any> = [
    {
      name: "工区名称",
      value: "",
      must: true
    },
    {
      name: "负责人员",
      value: "",
      list: "asd"
    },
    {
      name: "选择上级",
      value: "",
      list: "asd"
    }
  ];

  constructor() {
    super();
    this.store = getModule(settingWorkareaStore);
    this.settingOrganizationStore = getModule(settingOrganizationStore);
  }

  async mounted() {
    const search = document.getElementsByClassName("el-input-group__append")[0];
    search.addEventListener("click", this.search);
    this.settingOrganizationStore.getTree();
    await this.settingOrganizationStore.getRoleList().then((res: any) => {
      if (res.code === 0) {
        res.data.list.forEach((a: any, i: number) => {
          this.roleList.push({});
          this.$set(this.roleList[i], "id", a.id);
          this.$set(this.roleList[i], "name", a.name);
        });
      }
    });
    this.store.getManagerData();
  }

  // 选择搜索项
  handleNodeClick(data: any) {
    this.$set(this.superiorCompany[0], "name", data.name);
    this.$set(this.superiorCompany[0], "id", data.uuid);
    this.$set(this.parentPeople[0], "name", data.name);
    this.$set(this.parentPeople[0], "id", data.id);
    // this.member[0].value = data.id;
    if (data.id !== this.store.store.state.SettingWorkareaStore.projectId) {
      this.store.setProjectIdWrap(data);
    }
  }

  // 搜索调用
  search() {
    if (this.state) {
      (this.$refs.attrList as any).store.defaultExpandAll = true;
      this.settingOrganizationStore.searchTree(this.state);
      return;
    }
    (this.$refs.attrList as any).store.defaultExpandAll = false;
    this.settingOrganizationStore.getTree();
  }

  // 表格选择项
  handleSelectionChange(val: any[]) {
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
    this.store.store.state.SettingWorkareaStore.pageNumber = val;
    this.store.getTableData({
      projectId: this.store.store.state.SettingWorkareaStore.projectId
    });
  }

  // 弹窗
  openDialog(title: string, row: any) {
    if (title === "修改") {
      this.store.store.state.SettingWorkareaStore.updateId = row.id;
      this.store.store.state.SettingWorkareaStore.workName = row.workName;
      this.store.store.state.SettingWorkareaStore.dutyPerson = row.dutyPerson;
      this.store.store.state.SettingWorkareaStore.projectId = row.projectId;
    }
    if (title === "添加工区") {
      this.store.store.state.SettingWorkareaStore.updateId = null;
      this.store.store.state.SettingWorkareaStore.workName = null;
      this.store.store.state.SettingWorkareaStore.dutyPerson = null;
    }
    if (Object.keys(this.superiorCompany[0]).length) {
      this.dialogTitle = title;
      this.dialog = true;
      return;
    }
    msg.warning("请选择父级公司或项目");
  }

  // 关闭弹窗，清除数据
  clear() {
    this.dialog = false;
    this.store.store.state.SettingWorkareaStore.workName = null;
    this.store.store.state.SettingWorkareaStore.dutyPerson = null;
  }

  // 验证必填项
  async verify() {
    if (this.store.store.state.SettingWorkareaStore.workName == null) {
      msg.warning("*号项为必填项!");
      return;
    }
    this.store.addOrUpdate();
    this.dialog = false;
  }

  // 删除工区
  del(id: number) {
    this.store.del(id);
    this.visible = false;
  }

  // 表格搜索
  searchTable() {
    this.store.getTableData();
  }
}
</script>
<template lang="pug" src="views/settingWorkarea.pug"/>
<style lang="stylus" src="styles/settingWorkarea.stylus"/>
