/*
 * @Date         : 2020-05-15 15:06:41
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:58:25
 * @FilePath     : \src\store\modules\settingWorkarea\SettingWorkareaStore.ts
 */
import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "../..";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";
import msg from "common/MessageUtils";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "SettingWorkareaStore",
  store
})
export default class SettingWorkareaStore extends VuexModule {
  public url: any = {};
  public tableData: Array<any> = []; // 表格数据
  public pageNumber = 1;
  public total = 0;
  private projectId: number | null = null; // 点击左侧树形获取的id
  private projectName = ""; // 点击左侧树形获取的项目名
  private pageSize = 15; // 表格行数
  private searchTable = "";
  private workName = "";
  private dutyPerson = "";
  private managerList: Array<any> = [];
  private updateId: number | null = null;

  constructor(args: any) {
    super(args);
    this.url = requestConfig.settingWorkAreaStore;
  }

  // 获取表格数据参数
  @Action
  public getParams() {
    return new Promise(resolve => {
      const params: any = {
        projectId: this.projectId,
        pageNum: this.pageNumber,
        pageSize: this.pageSize
      };
      if (this.searchTable) {
        params.muchQuery = this.searchTable;
      }
      resolve(params);
    });
  }

  // 获取表格数据
  @Action
  public async getTableData() {
    axios.post(this.url.table, await this.getParams()).then((res: any) => {
      if (res.code === 0) {
        this.setTableData(res.data);
      }
    });
  }

  // 设置表格数据
  @Mutation
  public setTableData(data: any) {
    this.tableData = data.list;
    this.pageNumber = data.pageNumber;
    this.pageSize = data.pageSize;
    this.total = data.total;
  }

  // 设置项目id;分页
  @Action
  public setProjectIdWrap(data: any) {
    this.setProjectId(data);
    this.getTableData();
  }

  // 设置项目id
  @Mutation
  public setProjectId(data: any) {
    console.log(data);
    this.projectId = data.id;
    this.projectName = data.name;
    this.pageNumber = 1;
  }

  // 新增or修改参数
  @Action
  public getAddParams() {
    return new Promise(resolve => {
      const params: any = {
        workName: this.workName,
        managerId: this.dutyPerson
      };
      if (this.updateId) {
        params.id = this.updateId;
      } else {
        params.projectId = this.projectId;
      }
      resolve(params);
    });
  }

  // 新增or修改
  @Action
  public async addOrUpdate() {
    axios.post(this.url.save, await this.getAddParams()).then((res: any) => {
      if (res.code === 0) {
        msg.success("成功!");
        this.getTableData();
      }
    });
  }

  // 删除
  @Action
  del(id: string) {
    axios.post(this.url.delete, { id: id }).then((res: any) => {
      if (res.code === 0) {
        msg.success("删除成功!");
        this.getTableData();
      }
    });
  }

  // 获取负责人列表
  @Action
  public async getManagerData() {
    axios
      .post(this.url.managerList, { projectId: this.projectId })
      .then((res: any) => {
        if (res.code === 0) {
          this.setManagerList(res.data);
        }
      });
  }

  // 设置负责人列表
  @Mutation
  public setManagerList(data: any[]) {
    this.managerList = data;
  }
}
