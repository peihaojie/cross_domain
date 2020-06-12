/*
 * @Date         : 2020-03-09 18:23:35
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:51:26
 * @FilePath     : \src\store\modules\homePage\HomePageStore.ts
 */
import { Module, VuexModule, Action } from "vuex-module-decorators";
import store from "../..";
import { server as axios } from "common/HttpClient";
import { requestConfig } from "request/requestConfig";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "HomePageStore",
  store,
})
export default class HomePageStore extends VuexModule {
  private url: any;
  constructor(args: any) {
    super(args);
    this.url = requestConfig.homePage;
  }

  // 获取隐患类别统计
  @Action
  getCategoryData(params: any): Promise<any> {
    return axios.post(this.url.categoryData, params);
  }

  // 获取在施重大风险项目排行
  @Action
  getRiskData(params: any): Promise<any> {
    return axios.post(this.url.riskData, params);
  }

  // 风险走势图
  @Action
  getTrendData(params: any): Promise<any> {
    return axios.post(this.url.trendData, params);
  }

  // 风险走势图
  @Action
  getUsageRateData(params: any): Promise<any> {
    return axios.post(this.url.usageRateData, params);
  }

  // 排查情况
  @Action
  getTroubleshoot(params: any): Promise<any> {
    return axios.post(this.url.troubleshoot, params);
  }

  // 获取地图数据
  @Action
  getMap(params: any): Promise<any> {
    return axios.post(this.url.map, params);
  }

  // 获取报警数据
  @Action
  getWarning(params: any): Promise<any> {
    return axios.post(this.url.warning, params);
  }
}
