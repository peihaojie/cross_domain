/*
 * @Date         : 2020-06-11 16:03:05
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-11 16:55:41
 * @FilePath     : \src\common\ModuleHandler.ts
 */

import { Store } from "vuex";
import { VuexModule } from "vuex-module-decorators/dist/types/vuexmodule";
import { getModule } from "vuex-module-decorators";
import { Vue } from "vue-property-decorator";

declare type ConstructorOf<C> = {
  new (...args: any[]): C;
};

function getStore<M extends VuexModule>(
  vue: Vue,
  moduleClass: ConstructorOf<any>,
  store?: Store<any>
): M {
  const myStore = getModule(moduleClass);
  myStore.$vue = vue;
  myStore.set = (key: string, value: string) => {
    myStore.$vue.$set(myStore.$vue, key, value);
  };

  myStore.delete = (Vue: Vue, vue: any) => {
    myStore.$vue.$delete(Vue, vue);
  };

  return myStore;
}

export default getStore;
