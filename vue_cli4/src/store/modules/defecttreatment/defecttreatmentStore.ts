/*
 * @Date         : 2020-05-15 15:25:54
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:50:44
 * @FilePath     : \src\store\modules\defecttreatment\defecttreatmentStore.ts
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
  name: "DefecttreatmentStore",
  store
})
export default class DefecttreatmentStore extends VuexModule {
  public url: any = {};
  public tableData: Array<any> = []; // 表格数据
  public pageIndex = 1;
  public total = 0;
  private tree: Array<any> = []; // 树形的数据
  private codeId: string | null = null; // 点击左侧树形获取的id
  private pageSize = 15; // 表格行数
  private troubleshooting: string | null = null; // 搜索的排查内容
  private hazardLevel: string | null = null; // 搜索的隐患级别
  constructor(args: any) {
    super(args);
    this.url = requestConfig.defecttreatment;
  }

  @Action
  public getTree() {
    axios.post(this.url.tree).then((res: any) => {
      if (res.code === 0) {
        this.treeData(res.data);
        this.setCodeId(res.data[0].code);
      }
    });
  }
  // @Action
  // async getRoleList() {
  //   return axios.post(this.url.roleList, {});
  // }

  @Action
  public setCodeIdWrap(id: string) {
    this.setCodeId(id);
    this.getTable();
  }

  @Mutation
  public setCodeId(id: string | null) {
    this.codeId = id;
    this.pageIndex = 1;
  }

  @Action
  public searchTree(name: string) {
    axios.post(this.url.treeSearch, { inspectTask: name }).then((res: any) => {
      if (res.code === 0) this.treeData(res.data);
    });
  }

  @Mutation
  public treeData(data: any[] | null) {
    this.tree = data || [];
  }

  @Action
  async add({ name, list, pCode = null, id = null, code = null }: any) {
    let url = this.url;
    switch (name) {
      case "新建隐患类别":
        url = url.addCategory;
        break;
      case "添加":
        url = url.addSafety;
        break;
      case "修改隐患信息":
        url = url.edit;
        break;
      default:
        break;
    }
    return this.dialogRequest({ url, list, pCode, id, code });
  }

  @Action
  dialogRequest({ url, list, pCode, id, code }: any) {
    const params: any = {};
    list.forEach((i: any) => {
      switch (i.link) {
        case "actual":
          if (i.value.length) {
            params.actualStartTime = new Time(i.value[0]).get();
            params.actualEndTime = new Time(i.value[1]).get();
          }
          break;
        case "contract":
          if (i.value.length) {
            params.contractStartTime = new Time(i.value[0]).get();
            params.contractEndTime = new Time(i.value[1]).get();
          }
          break;
        default:
          params[i.link] = i.value;
          break;
      }
    });
    if (pCode || pCode === "0") params.pcode = pCode;
    if (id) params.id = id;
    if (code) params.code = code;
    return axios.post(url, params);
  }

  @Action
  getTable() {
    axios
      .post(this.url.table, {
        code: this.codeId,
        troubleshooting: this.troubleshooting,
        hazardLevel: this.hazardLevel,
        pageSize: this.pageSize,
        pageNum: this.pageIndex
      })
      .then((res: any) => {
        if (res.code === 0) {
          this.setTable(res.data);
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

  @Action
  del(id: string) {
    axios.post(this.url.del, { id: id }).then((res: any) => {
      if (res.code === 0) {
        msg.success("删除成功!");
        this.setCodeId(this.codeId);
        this.getTable();
      }
    });
  }

  @Action
  getPeople(id: string) {
    return axios.post(this.url.searchPeople, { id: id });
  }

  @Action
  refresh() {
    this.setTable([]);
    this.treeData(null);
    this.setCodeId(null);
  }
}
