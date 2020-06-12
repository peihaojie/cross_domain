<!--
 * @Date         : 2020-06-09 10:48:37
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:45:45
 * @FilePath     : \src\pages\home\settingDanger\Index.vue
-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import SettingDangerStore from "store/modules/settingDanger/SettingDangerStore";
import msg from "common/MessageUtils";

@Component({})
export default class SettingDanger extends Vue {
  private store: any;
  private state: string | null = null;
  private defaultProps: any = {
    children: "children",
    label: "name"
  }; // 树形对应的数据结构

  private selectList: Array<any> = []; // 表格选择项
  private dialogTitle: string | null = null; // 弹窗名称
  private dialog = false; // 弹窗的判断
  private dialogType: string | null = null; // 弹窗类型
  private addDanger: Array<AddDanger> = [
    {
      name: "施工部位",
      value: null,
      must: true,
      link: "place"
    },
    {
      name: "引发事故",
      value: null,
      must: true,
      link: "accident"
    },
    {
      name: "危险因素",
      value: null,
      must: true,
      textArea: true,
      link: "sourceOfRisk"
    },
    {
      name: "防范措施",
      value: null,
      must: true,
      textArea: true,
      link: "measures"
    }
  ]; // 添加危险源

  private editId: number | null = null; // 修改人员的id
  private checkedType: string | null = null; // 选择项的类别
  public pageIndex = 1; // 页码
  public total = 0;
  private pageSize = 15; // 表格行数
  public tableData: Array<any> = []; // 表格数据
  // private name: string = null; // 搜索的人名
  // private phone: number = null; // 搜索的电话
  private projectId: string | null = sessionStorage.getItem("seeProjectId"); // 点击左侧树形获取的id
  private tree: Array<any> = []; // 树形的数据
  private projectName: string | null = null; // 项目名称
  private imgSrc: string | null = null;
  constructor() {
    super();
    this.store = getModule(SettingDangerStore);
  }

  async mounted() {
    const search = document.getElementsByClassName("el-input-group__append")[0];
    search.addEventListener("click", this.search);
    this.getTree();
  }

  // 获取树形数据
  getTree() {
    this.store
      .getTree({ projectId: sessionStorage.getItem("seeProjectId") })
      .then((res: any) => {
        if (res.code === 0) {
          if (!this.store.store.state.SettingDangerStore.tree) {
            this.checkedType = res.data[0].deptTypeNo;
          }
          this.store.treeData(res.data);
          this.searchTable();
        }
      });
  }

  // 选择搜索项
  handleNodeClick(data: any) {
    this.projectId = data.uuid;
    this.checkedType = data.deptTypeNo;
    if (data.deptTypeNo === "project") {
      this.projectName = data.name;
    }
    if (data.id !== this.projectId) {
      this.handleCurrentChange(1);
    }
  }

  // 搜索调用
  search() {
    if (this.state) {
      (this.$refs.attrList as any).store.defaultExpandAll = true;
      this.store.searchTree({
        name: this.state,
        projectId: sessionStorage.getItem("seeProjectId")
      });
      return;
    }
    (this.$refs.attrList as any).store.defaultExpandAll = false;
    this.getTree();
  }

  // 表格选择项
  handleSelectionChange(val: any[]) {
    this.selectList = val;
    console.log(val);
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
    this.searchTable();
  }

  // 弹窗
  async openDialog(title: string) {
    if (this.dialogType === "del" && !this.selectList.length) {
      msg.warning("请选择需要删除的危险源");
      return;
    }
    if (this.dialogType === "addDanger" && this.checkedType !== "project") {
      msg.warning("公司不可添加危险源");
      return;
    }
    this.dialogTitle = this.getDialogTotal(title);
    this.dialog = true;
    if (this.dialogType === "QR") {
      this.imgSrc = await this.store.getQR(this.projectId);
    }
  }

  // 获取弹窗名称
  getDialogTotal(title: string): string {
    let name: string;
    switch (this.dialogType) {
      case "addDanger":
      case "edit":
        name = `${this.projectName}---${title}`;
        break;
      default:
        name = title;
        break;
    }
    return name;
  }

  // 关闭弹窗，清除数据
  clear() {
    this.dialog = false;
    switch (this.dialogType) {
      case "edit":
      case "addDanger":
        this.clearObj(this.addDanger);
        break;
      default:
        break;
    }
  }

  // 清除对象的属性
  clearObj(list: any[]) {
    list.forEach(item => (item.value = null));
    this.editId = null;
  }

  // 验证必填项
  async verify() {
    let list: Array<any> = [];
    let fun = '';
    switch (this.dialogType) {
      case "addDanger":
        list = this.addDanger;
        fun = "add";
        break;
      case "edit":
        list = this.addDanger;
        fun = "edit";
        break;
      default:
        break;
    }
    if (!(await this.verifyList(list))) {
      msg.warning("*号项为必填项!");
      return;
    }
    if (fun) {
      (this as any)[fun](list);
    }
  }

  // 添加数据
  async add(list: any[]) {
    const params: any = {
      projectId: this.projectId
    };
    list.forEach(addItem => {
      params[addItem.link] = addItem.value;
    });
    this.store
      .add(params)
      .then((res: any) => {
        if (res.code === 0) {
          msg.success("成功!");
          this.clear();
          this.searchTable();
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

  // 删除单个人员
  delAlone(id: number) {
    this.del([id]);
  }

  // 获取要删除的数据
  getDelList() {
    const list = this.selectList.map(select => select.id);
    this.del(list);
  }

  // 删除人员
  del(list: number[]) {
    this.store.del({ ids: list }).then((res: any) => {
      if (res.code === 0) {
        msg.success("删除成功!");
        this.searchTable();
        this.clear();
      }
    });
  }

  // 表格搜索
  searchTable() {
    const params: any = {
      projectId: this.projectId,
      pageNum: this.pageIndex,
      pageSize: this.pageSize
    };
    this.store
      .getTable(params)
      .then((res: any) => {
        if (res.code === 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  // 获取危险源单个数据
  getEdit(id: number) {
    this.editId = id;
    this.store.getEdit({ id: id }).then((res: any) => {
      if (res.code === 0) {
        this.dialogType = "edit";
        this.projectName = res.data.projectName;
        this.openDialog("修改危险源");
        this.addDanger.forEach(editItem => {
          editItem.value = res.data[editItem.link];
        });
      }
    });
  }

  // 修改危险源
  edit() {
    const params: any = {
      id: this.editId
    };
    this.addDanger.forEach(addItem => {
      params[addItem.link] = addItem.value;
    });
    this.store.edit(params).then((res: any) => {
      if (res.code === 0 && res.msg === "SUCCESS") {
        msg.success("修改成功");
        this.clear();
        this.searchTable();
      }
    });
  }

  // 返回表格数据绑定id
  getRowKey(row: any) {
    return row.id;
  }

  beforeDestroy() {
    this.store.refresh();
  }
}
interface AddDanger {
  name: string;
  value: string | null;
  must?: boolean;
  textArea?: boolean;
  link: string;
}
</script>
<template lang="pug" src="views/settingDanger.pug" />
<style lang="stylus" src="styles/settingDanger.stylus" />
