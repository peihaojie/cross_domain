/*
 * @Date         : 2020-06-03 14:17:58
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:30:09
 * @FilePath     : \src\store\modules\cultivate\CultivateStore.ts
 */
import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "../..";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "CultivateStore",
  store,
})
export default class CultivateStore extends VuexModule {
  public url: any = {};
  public ownUrl: any = {};
  private tree: Array<any> | null = []; // 树形的数据
  constructor(args: any) {
    super(args);
    this.url = requestConfig.settingOrganization;
    this.ownUrl = requestConfig.cultivate;
  }

  @Action
  public async getTree(): Promise<any> {
    return axios
      .post(this.url.tree, {
        projectId: sessionStorage.getItem("seeProjectId"),
      })
      .then((res: any) => {
        if (res.code === 0) {
          this.treeData(res.data);
        }
      });
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
    this.tree = data;
  }

  @Action
  getTable(params: any): Promise<any> {
    return axios.post(this.ownUrl.table, params);
  }

  @Action
  getType() {
    return axios.post(this.ownUrl.disclosureType);
  }

  @Action
  getGrade() {
    return axios.post(this.ownUrl.disclosureLevel);
  }

  @Action
  refresh() {
    this.treeData(null);
  }
}
