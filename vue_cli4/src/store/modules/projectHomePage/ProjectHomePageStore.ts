/*
 * @Date         : 2020-05-28 14:20:16
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:52:39
 * @FilePath     : \src\store\modules\projectHomePage\ProjectHomePageStore.ts
 */
import { Module, VuexModule, Action } from "vuex-module-decorators";
import store from "../..";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "ProjectHomePage",
  store,
})
export default class ProjectHomePage extends VuexModule {
  public url: any;
  constructor(args: any) {
    super(args);
    this.url = requestConfig.projectHomePage;
  }

  // 获取项目数据
  @Action
  getProjectData(params: any): Promise<any> {
    return axios.post(this.url.project, params);
  }

  // 获取隐患类别统计
  @Action
  getCategoryData(params: any): Promise<any> {
    return axios.post(this.url.categoryData, params);
  }

  // 获取隐患趋势图
  @Action
  getTendencyData(params: any): Promise<any> {
    return axios.post(this.url.getTendencyData, params);
  }
}