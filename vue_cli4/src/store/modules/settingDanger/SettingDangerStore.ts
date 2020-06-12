/*
 * @Date         : 2020-06-09 10:52:17
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:53:46
 * @FilePath     : \src\store\modules\settingDanger\SettingDangerStore.ts
 */

import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import store from "../..";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "SettingDangerStore",
  store,
})
export default class SettingDangerStore extends VuexModule {
  public url: any = {};
  public treeUrl: string = requestConfig.settingOrganization.tree;
  public searchTreeUrl: string = requestConfig.settingOrganization.treeSearch;
  private tree: Array<any> = []; // 树形的数据
  constructor(args: any) {
    super(args);
    this.url = requestConfig.danger;
  }

  // 获取树形数据
  @Action
  public getTree(params: any): Promise<any> {
    return axios.post(this.treeUrl, params);
  }

  // 搜索树形数据
  @Action
  public searchTree(params: any) {
    axios.post(this.searchTreeUrl, params).then((res: any) => {
      if (res.code === 0) this.treeData(res.data);
    });
  }

  // 树形赋值
  @Mutation
  public treeData(data: any[] | null) {
    this.tree = data || [];
  }

  // 添加危险源
  @Action
  async add(params: any) {
    return axios.post(this.url.add, params);
  }

  // 获取表格数据
  @Action
  getTable(params: any): Promise<any> {
    return axios.post(this.url.table, params);
  }

  // 删除危险源
  @Action
  del(params: any): Promise<any> {
    return axios.post(this.url.del, params);
  }

  // 获取单条危险源数据
  @Action
  getEdit(params: any): Promise<any> {
    return axios.post(this.url.query, params);
  }

  // 修改危险源
  @Action
  edit(params: any): Promise<any> {
    return axios.post(this.url.edit, params);
  }

  // 获取二维码
  @Action
  getQR(params: string): Promise<any> {
    return new Promise(resolve => {
      resolve(`${this.url.qr}?projectId=${params}`);
    });
  }

  // 清除store数据
  @Action
  refresh() {
    this.treeData(null);
  }
}
