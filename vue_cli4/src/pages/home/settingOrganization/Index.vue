<!--
 * @Date         : 2020-05-15 14:50:28
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:35:22
 * @FilePath     : \src\pages\home\settingOrganization\Index.vue
 -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import SettingOrganizationStore from "store/modules/settingOrganization/SettingOrganizationStore";
import msg from "common/MessageUtils";

@Component({})
export default class SettingOrganization extends Vue {
  private store: any;
  private state: string | null = null;
  private defaultProps: any = {
    children: "children",
    label: "name"
  }; // 树形对应的数据结构

  private selectList: Array<any> = []; // 表格选择项
  private dialogTitle: string | null = null; // 弹窗名称
  private dialog = false; // 弹窗的判断
  private superiorCompany: Array<any> = [{}]; // 新增公司项目下拉框的上级组织
  private parentPeople: Array<any> = [{}]; // 人员下拉框的上级组织
  private roleList: Array<any> = []; // 成员角色列表
  private categoryList: Array<any> = []; // 工程类别列表
  private statusList: Array<any> = []; // 工程状态列表
  private member: Array<any> = [
    {
      name: "组织",
      value: null,
      list: this.parentPeople,
      must: true,
      link: "projectId"
    },
    {
      name: "姓名",
      value: null,
      must: true,
      link: "name"
    },
    {
      name: "手机",
      value: null,
      must: true,
      link: "phone"
    },
    {
      name: "岗位",
      value: null,
      link: "station"
    },
    {
      name: "角色",
      value: null,
      list: this.roleList,
      must: true,
      link: "roleId"
    },
    {
      name: "邮箱",
      value: null,
      link: "email"
    },
    {
      name: "账号",
      value: null,
      must: true,
      link: "loginName"
    },
    {
      name: "密码",
      value: null,
      must: true,
      link: "passwd",
    }
    // {
    //   name: "备注",
    //   value: null,
    //   textarea: true
    // }
  ]; // 添加成员的弹框内容

  private company: Array<any> = [
    {
      name: "公司名称",
      value: null,
      must: true,
      link: "name"
    },
    {
      name: "组织简称",
      value: null,
      link: "projectAbbreviation"
    },
    {
      name: "上级组织",
      value: null,
      list: this.superiorCompany,
      link: "uupid"
    }
  ]; // 新建公司的弹框内容

  private department: Array<any> = [
    {
      name: "部门名称",
      value: null,
      must: true
    }
  ]; // 添加部门弹窗

  private project: any = [
    {
      name: "项目名称",
      value: null,
      must: true,
      link: "name"
    },
    {
      name: "项目简称",
      value: null,
      link: "projectAbbreviation"
    },
    {
      name: "签约单位",
      value: null,
      link: "contractingUnit"
    },
    {
      name: "上级组织",
      value: null,
      must: true,
      list: this.superiorCompany,
      link: "uupid"
    },
    {
      name: "项目经理",
      value: null,
      link: "projectManager"
    },
    {
      name: "联系方式",
      value: null,
      link: "phone"
    },
    {
      name: "工程类别",
      value: null,
      must: true,
      list: this.categoryList,
      link: "projectType"
    },
    {
      name: "工程用途",
      value: null,
      must: true,
      link: "projectUse"
    },
    {
      name: "工程造价",
      value: null,
      link: "projectCosts"
    },
    {
      name: "工程状态",
      value: null,
      list: this.statusList,
      link: "projectStatus"
    },
    {
      name: "中标单位",
      value: null,
      link: "winningUnit"
    },
    {
      name: "建设单位",
      value: null,
      link: "buildingUnit"
    },
    {
      name: "设计单位",
      value: null,
      link: "designUnit"
    },
    {
      name: "监理单位",
      value: null,
      link: "supervisionUnit"
    },
    {
      name: "合同工期",
      value: null,
      link: "contract"
    },
    {
      name: "实际工期",
      value: null,
      link: "actual"
    },
    {
      name: "工程地址",
      value: null,
      link: "projectAddress",
      textarea: true
    }
  ]; // 添加项目弹窗

  private mark: any = {}; // 地图点的挂载
  private peopleId: number | null = null; // 修改人员的id
  private checkedType: string | null = null; // 选择项的类别
  constructor() {
    super();
    this.store = getModule(SettingOrganizationStore);
  }

  async mounted() {
    const search = document.getElementsByClassName("el-input-group__append")[0];
    search.addEventListener("click", this.search);
    this.store.getTree();
    await this.store.getRoleList().then((res: any) => {
      if (res.code === 0) {
        res.data.list.forEach((a: any, i: number) => {
          this.roleList.push({});
          this.$set(this.roleList[i], "id", a.id);
          this.$set(this.roleList[i], "name", a.name);
        });
      }
    });
    await this.store.getTypeList("project_category").then((res: any) => {
      if (res.code === 0) {
        this.setList(res.data, this.categoryList);
      }
    });
    await this.store.getTypeList("project_status").then((res: any) => {
      if (res.code === 0) {
        this.setList(res.data, this.statusList);
      }
    });
  }

  setList(data: any[], list: any[]) {
    data.forEach((a, i) => {
      list.push({});
      this.$set(list[i], "id", a.groupValue);
      this.$set(list[i], "name", a.station);
    });
  }

  // 选择搜索项
  handleNodeClick(data: any) {
    this.$set(this.superiorCompany[0], "name", data.name);
    this.$set(this.superiorCompany[0], "id", data.uuid);
    this.$set(this.parentPeople[0], "name", data.name);
    this.$set(this.parentPeople[0], "id", data.id);
    this.company[2].value = data.uuid;
    this.project[3].value = data.uuid;
    this.member[0].value = data.id;
    this.checkedType = data.deptTypeNo;
    if (data.id !== this.store.store.state.SettingOrganizationStore.projectId) {
      this.store.setProjectIdWrap(data.id);
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
    this.store.store.state.SettingOrganizationStore.pageIndex = val;
    this.searchTable();
  }

  // 弹窗
  openDialog(title: string) {
    if (Object.keys(this.superiorCompany[0]).length) {
      this.dialogTitle = title;
      if (title === "新建项目" && this.checkedType !== "project") {
        this.dialog = true;
        this.$nextTick(() => {
          const map = new AMap.Map("map", {
            zoom: 11, // 级别
            center: [114.057939, 22.543527], // 中心点坐标
            viewMode: "3D" // 使用3D视图
          });
          map.on("click", (e: any) => {
            if (this.mark) {
              map.remove(this.mark)
            };
            this.project.forEach((a: any) => {
              if (a.name === "工程地址") {
                a.value = [e.lnglat.getLng(), e.lnglat.getLat()];
              }
            });
            this.mark = new AMap.Marker({
              position: [e.lnglat.getLng(), e.lnglat.getLat()]
            });
            map.add(this.mark);
          });
        });
        return;
      }
      if (title === "新建项目") {
        msg.warning("项目下不可添加项目");
        return;
      }
      if (title === "新建公司" && this.checkedType === "project") {
        msg.warning("项目下不可添加公司");
        return;
      }
      this.dialog = true;
      return;
    }
    msg.warning("请选择父级公司或项目");
  }

  // 关闭弹窗，清除数据
  clear() {
    this.dialog = false;
    switch (this.dialogTitle) {
      case "添加成员":
      case "修改成员":
        this.clearObj(this.member);
        break;
      case "新建公司":
        this.clearObj(this.company);
        break;
      case "添加部门":
        this.clearObj(this.department);
        break;
      case "新建项目":
        this.clearObj(this.project);
        break;
      default:
        break;
    }
  }

  // 清除对象的属性
  clearObj(list: any[]) {
    list.forEach(item => {
      if (item.name !== "上级组织" && item.name !== "组织") {
        item.value = null;
      }
    });
    this.peopleId = null;
  }

  // 验证必填项
  async verify() {
    let list: Array<any> = [];
    switch (this.dialogTitle) {
      case "添加成员":
      case "修改成员":
        list = this.member;
        break;
      case "新建公司":
        list = this.company;
        break;
      // case "添加部门":
      //   list = this.department;
      //   break;
      case "新建项目":
        list = this.project;
        break;
      default:
        break;
    }
    if (!(await this.verifyList(list))) {
      msg.warning("*号项为必填项!");
      return;
    }
    this.add(list);
  }

  // 添加数据
  async add(list: any[]) {
    await this.store
      .add({ name: this.dialogTitle, list, id: this.peopleId })
      .then((res: any) => {
        if (res.code === 0 && res.msg === "SUCCESS") {
          msg.success("成功!");
          this.clear();
          this.store.getTree();
          return;
        }
        if (res.code === 1 && res.msg === "后台登录账号LoginName不能重复") {
          msg.warning("账号重复，请更换账号!");
          return;
        }
        msg.warning("失败!");
      })
      .catch((e: any) => console.error(e));
  }

  // 统一验证方法
  verifyList(list: any[]) {
    return list.filter(a => a.must).every(a => a.value);
  }

  // 删除人员
  del(id: number) {
    this.store.del(id);
  }

  // 表格搜索
  searchTable() {
    this.store.getTable();
  }

  // 修改成员
  async getPeople(id: number) {
    this.peopleId = id;
    await this.store.getPeople(id).then((res: any) => {
      if (res.code === 0) {
        this.member.forEach(a => {
          Object.keys(res.data).forEach(b => {
            if (a.link === b) {
              if (parseInt(res.data[b])) {
                a.value = parseInt(res.data[b]);
                return;
              }
              a.value = res.data[b];
            }
          });
        });
        this.dialogTitle = "修改成员";
        this.dialog = true;
      }
    });
  }

  beforeDestroy() {
    this.store.refresh();
  }
}
</script>
<template lang="pug" src="views/settingOrganization.pug" />
<style lang="stylus" src="styles/settingOrganization.stylus" />
