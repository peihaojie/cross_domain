/*
 * @Date         : 2020-06-10 20:47:07
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 21:02:19
 * @FilePath     : \vue_cli4\src\store\modules\app\appStore.ts
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import store from "../../index";
@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "AppStore",
  store
})
export default class AppStore extends VuexModule {
  public count = 12;

  // action 'decr' commits mutation 'decrement' when done with return value as payload
  @Action({ commit: "decrement" })
  public async decr() {
    return 3;
  }

  @Mutation
  private decrement(delta: number) {
    console.log("delta", delta);
    this.count -= delta;
  }

  @Mutation
  private add() {
    this.count = 100000;
  }
}
