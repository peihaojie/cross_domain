/*
 * @Date         : 2020-06-02 14:20:37
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 13:52:11
 * @FilePath     : \src\store\modules\photo\PhotoStore.ts
 */
import { Module, VuexModule, Action } from "vuex-module-decorators";
import store from "../..";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "Photo",
  store,
})
export default class Photo extends VuexModule {
  public url: any;
  constructor(args: any) {
    super(args);
    this.url = requestConfig.photo;
  }

  // 获取图片数据
  @Action
  getImgList(params: any): Promise<any> {
    return axios.post(this.url.img, params);
  }

  // 获取图片详情
  @Action
  getImgData(params: any): Promise<any> {
    return axios.post(this.url.imgData, params)
  }
}
