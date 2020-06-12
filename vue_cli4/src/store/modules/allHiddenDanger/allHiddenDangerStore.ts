/*
 * @Date         : 2020-05-15 15:34:17
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:45:22
 * @FilePath     : \src\store\modules\allHiddenDanger\allHiddenDangerStore.ts
 */
import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "../..";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";
import Time from "common/mixin";
import { Message } from "element-ui";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "AllHiddenDangerStore",
  store
})
export default class AllHiddenDangerStore extends VuexModule {
  public url: any = {};
  public pageNumber = 1;
  public pageSize = 8;
  public totalPage = 0;
  public tableData: Array<any> = [];
  public inspector: number | null = null;
  public inspectionType: number | null = null;
  public projectName: string | null = null;
  public hazardLevel: number | null = null;
  public inspectionResult: number | null = null;
  public dateModel: Array<any> | null = null;
  public startTime: Date | null = null;
  public endTime: Date | null = null;
  public listData: Array<any> | null = null;
  private centerDialogVisible = false;
  // public searchParams: searchParams;

  constructor(args: any) {
    super(args);
    this.url = requestConfig.allHiddenDangerStore;
  }

  @Action
  public getParams(): Promise<any> {
    return new Promise(resolve => {
      const params: any = {
        pageNum: this.pageNumber,
        pageSize: this.pageSize
      };
      if (this.inspector) {
        params.inspector = this.inspector;
      }
      if (this.inspectionType) {
        params.inspectionType = this.inspectionType;
      }
      if (this.projectName) {
        params.projectName = this.projectName;
      }
      if (this.hazardLevel) {
        params.hazardLevel = this.hazardLevel;
      }
      if (this.inspectionResult) {
        params.inspectionResult = this.inspectionResult;
      }
      if (this.dateModel) {
        params.startTime = new Time(this.dateModel[0]).get();
        params.endTime = new Time(this.dateModel[1]).get();
      }
      resolve(params);
    });
  }

  // {
  //     "pageNum": this.pageNumber,
  //     "pageSize": this.pageSize,
  //     "inspector": this.inspector,
  //     "inspectionType": this.inspectionType,
  //     "projectName": this.projectName,
  //     "hazardLevel": this.hazardLevel,
  //     "inspectionResult": this.inspectionResult,
  //     "startTime": this.startTime,
  //     "endTime": this.endTime,
  // }

  @Action
  public async getData() {
    axios.post(this.url.getData, await this.getParams()).then((res: any) => {
      if (res.code === 0) {
        this.setTableData(res.data);
      }
    });
  }

  @Mutation
  public setTableData(data: any) {
    this.tableData = data.list;
    this.pageNumber = data.pageNumber;
    this.pageSize = data.pageSize;
    this.totalPage = data.total;
  }

  @Action
  public async getList(item: number) {
    axios
      .post(this.url.getList, {
        dangerInspectId: item
      })
      .then((res: any) => {
        const alert: any = Message;
        if (res.code === 0) {
          if (res.data.length === 0) {
            alert.warning("暂无数据");
            this.details(res.data.length);
          } else {
            this.details(res.data.length);
            this.setListData(res.data);
          }
        }
      });
  }

  @Mutation
  public setListData(data: any[]) {
    this.listData = data;
  }

  @Mutation
  public details(item: number) {
    if (item > 0) {
      this.centerDialogVisible = true;
    } else {
      this.centerDialogVisible = false;
    }
  }
}
