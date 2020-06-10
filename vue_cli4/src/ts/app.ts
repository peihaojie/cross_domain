/*
 * @Date         : 2020-06-10 20:32:52
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 20:58:50
 * @FilePath     : \vue_cli4\src\ts\app.ts
 */
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import AppStore from "../store/modules/app/appStore";
@Component
export default class App extends Vue {
  private home: string;
  private store: any;
  constructor() {
    super();
    this.home = "";
    this.store = getModule(AppStore);
  }

  mounted() {
    this.home = this.store.count
    setTimeout(() => {
      this.store.add()
      this.home = this.store.count;
    }, 1000);
  }
}
