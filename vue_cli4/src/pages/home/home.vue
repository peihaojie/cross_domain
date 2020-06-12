<!--
 * @Date         : 2020-03-05 17:14:48
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:44:29
 * @FilePath     : \src\pages\home\home.vue
 -->
<script lang="ts">
import { Component, Vue, Model, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import HomeStore from "store/modules/home/HomeStore";

@Component({})
export default class Home extends Vue {
  private store: any;
  public userName: string | null = sessionStorage.getItem("userName");
  public list: Array<any> = [];
  private path: string | null = sessionStorage.getItem("path")
    ? sessionStorage.getItem("path")
    : sessionStorage.getItem("deptTypeNo") === "project"
      ? "/home/projectHomepage"
      : "/home/homepage";

  private isShow = true;
  private company: Array<any> = [];
  private companyList: Array<any> = [];
  private homepage: string =
    sessionStorage.getItem("deptTypeNo") === "project"
      ? "projectHomepage"
      : "homepage";

  private deptTypeNo: string | null = sessionStorage.getItem("deptTypeNo"); // 选择项是公司还是项目
  constructor() {
    super();
    this.store = getModule(HomeStore);
  }

  mounted() {
    this.getCompanyList();
    const seeProjectId = sessionStorage.getItem("projectId") || ""
    sessionStorage.setItem("seeProjectId", seeProjectId);
    if (
      this.$route.path === "/home/projectHomepage" &&
      sessionStorage.getItem("deptTypeNo") !== "project"
    ) {
      this.$router.push("/home/homepage");
    }
  }

  // 获取公司列表
  getCompanyList() {
    this.store
      .getCompanyList({ projectId: sessionStorage.getItem("projectId") })
      .then((res: any) => {
        if (res.code === 0) {
          this.company = [res.data[0].uuid];
          this.companyList = this.processing(res.data);
        }
      });
  }

  // 修改公司列表数据
  processing(list: any[]) {
    list.forEach(item => {
      item.label = item.name;
      item.value = item.uuid;
      if (item.children.length) {
        this.processing(item.children);
        return;
      }
      item.children = null;
    });
    return list;
  }

  // 选框变化调用
  companyChange(val: any[]) {
    this.isShow = false;
    sessionStorage.setItem("seeProjectId", val[val.length - 1]);
    this.getDeptTypeNo(this.companyList, val);
    this.homepage =
      this.deptTypeNo === "project" ? "projectHomepage" : "homepage";
    if (
      this.deptTypeNo === "project" &&
      this.$route.path === "/home/homepage"
    ) {
      this.$router.push("/home/projectHomepage");
    }
    if (
      this.deptTypeNo !== "project" &&
      this.$route.path === "/home/projectHomepage"
    ) {
      this.$router.push("/home/homepage");
    }
    this.$nextTick(() => {
      this.isShow = true;
      this.path = this.$route.path;
    });
  }

  // 获取选择的信息
  getDeptTypeNo(list: any[], val: any[], index = 0) {
    list.forEach(a => {
      if (a.uuid === val[index] && index === val.length - 1) {
        this.deptTypeNo = a.deptTypeNo;
        return;
      }
      if (a.uuid === val[index]) {
        this.getDeptTypeNo(a.children, val, index + 1);
      }
    });
  }

  // 退出
  quit() {
    sessionStorage.clear();
    this.$router.push({ path: "/login" });
  }

  // 菜单点击
  handleSelect(key: string) {
    // console.log(key, keyPath);
    this.path = key;
  }

  // 下拉框的显示
  get showSelect() {
    const path = this.path;
    switch (path) {
      // case "/home/cultivate":
      // case "/home/securityLog":
      //   return false
      //   break;
      default:
        return true;
    }
  }
}
</script>
<template lang="pug" src="views/home.pug" />
<style scoped lang="stylus" src='styles/home.stylus' />
<style lang="stylus">
#home-wrap
  .body
    .el-menu
      .el-submenu__title
        font-size: 0.2rem;
        border-bottom: 0.01rem solid #98c8e7;
        i
          color: #fff !important;
      .el-submenu__title:hover
        background-color: #2d83bb !important;
      /deep/ .el-menu-item-group__title
        display none !important
</style>
