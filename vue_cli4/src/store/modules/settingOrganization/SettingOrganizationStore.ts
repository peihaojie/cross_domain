/*
 * @Date         : 2020-05-15 14:55:59
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:56:14
 * @FilePath     : \src\store\modules\settingOrganization\SettingOrganizationStore.ts
 */
import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "../..";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";
import msg from "common/MessageUtils";
import Time from "common/mixin";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "SettingOrganizationStore",
  store
})
export default class SettingOrganizationStore extends VuexModule {
  public url: any = {};
  public tableData: Array<any> = []; // 表格数据
  public pageIndex = 1;
  public total = 0;
  private tree: Array<any> = []; // 树形的数据
  private projectId: string | null = null; // 点击左侧树形获取的id
  private pageSize = 15; // 表格行数
  private name: string | null = null; // 搜索的人名
  private phone: number | null = null; // 搜索的电话
  // private role: number = null; // 搜索的状态
  private allTotal = 0; // 公司或项目下的人员总数
  constructor(args: any) {
    super(args);
    this.url = requestConfig.settingOrganization;
  }

  @Action
  public getTypeList(type: string) {
    return axios.post(this.url.typeList, { groupType: type });
  }

  @Action
  public getTree() {
    axios
      .post(this.url.tree, {
        projectId: sessionStorage.getItem("seeProjectId")
      })
      .then((res: any) => {
        if (res.code === 0) {
          this.treeData(res.data);
          this.setProjectIdWrap(res.data[0].id);
        }
      });
  }

  @Action
  async getRoleList() {
    return axios.post(this.url.roleList, {});
  }

  @Action
  public setProjectIdWrap(id: string) {
    this.setProjectId(id);
    this.getTable();
  }

  @Mutation
  public setProjectId(id: string | null) {
    this.projectId = id;
    this.pageIndex = 1;
  }

  @Action
  public searchTree(name: string) {
    axios
      .post(this.url.treeSearch, {
        name: name,
        projectId: sessionStorage.getItem("seeProjectId")
      })
      .then((res: any) => {
        if (res.code === 0) this.treeData(res.data);
      });
  }

  @Mutation
  public treeData(data: any[] | null) {
    this.tree = data || [];
  }

  @Action
  async add({ name, list, id = null }: any) {
    let url = this.url;
    let deptTypeNo: string | null = null;
    switch (name) {
      case "添加成员":
        url = url.people;
        break;
      case "修改成员":
        url = url.people;
        break;
      case "新建公司":
        url = url.add;
        deptTypeNo = "subCompany";
        break;
      // case "添加部门":
      //   url = url.XXX;
      //   break;
      case "新建项目":
        url = url.add;
        deptTypeNo = "project";
        break;
      default:
        break;
    }
    return this.dialogRequest({ url, list, id, deptTypeNo });
  }

  @Action
  dialogRequest({ url, list, id, deptTypeNo }: any) {
    const params: any = {};
    list.forEach((i: any) => {
      switch (i.link) {
        case "actual":
          if (i.value && i.value.length) {
            params.actualStartTime = new Time(i.value[0]).get();
            params.actualEndTime = new Time(i.value[1]).get();
          }
          break;
        case "contract":
          if (i.value && i.value.length) {
            params.contractStartTime = new Time(i.value[0]).get();
            params.contractEndTime = new Time(i.value[1]).get();
          }
          break;
        case "projectAddress":
          if (i.value && i.value.length) {
            params.longitude = i.value[0];
            params.latitude = i.value[1];
          }
          break;
        default:
          params[i.link] = i.value;
          break;
      }
    });
    if (id) params.id = id;
    if (deptTypeNo) params.deptTypeNo = deptTypeNo;
    return axios.post(url, params);
  }

  @Action
  getTable() {
    axios
      .post(this.url.table, {
        projectId: this.projectId,
        name: this.name,
        phone: this.phone,
        // role: this.role,
        pageSize: this.pageSize,
        pageNum: this.pageIndex
      })
      .then((res: any) => {
        if (res.code === 0) {
          this.setTable(res.data);
          if (!this.name && !this.phone) {
            this.setAllTotal(res.data.total);
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  @Mutation
  setTable(data: any) {
    this.total = data.total;
    this.tableData = data.list;
  }

  @Mutation
  setAllTotal(num: number) {
    this.allTotal = num;
  }

  @Action
  del(id: number) {
    axios.post(this.url.del, { id: id }).then((res: any) => {
      if (res.code === 0) {
        msg.success("删除成功!");
        this.setProjectId(this.projectId);
        this.getTable();
      }
    });
  }

  @Action
  getPeople(id: number) {
    return axios.post(this.url.searchPeople, { id: id });
  }

  @Action
  refresh() {
    this.setTable([]);
    this.setProjectId(null);
    this.treeData(null);
    this.setAllTotal(0);
  }
}
