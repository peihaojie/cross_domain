/*
 * @Date         : 2020-03-05 14:35:22
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 12:01:43
 * @FilePath     : \src\store\modules\home\HomeStore.ts
 */
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import store from "../..";
import { server as axios } from "common/HttpClient";
import { requestConfig } from 'request/requestConfig';

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "HomeStore",
  store
})
export default class HomeStore extends VuexModule {
  public url: any;

  constructor(args: any) {
    super(args);
    this.url = requestConfig;
  }

  @Action
  getCompanyList(params: any) {
    return axios.post(this.url.settingOrganization.tree, params);
  }
}
