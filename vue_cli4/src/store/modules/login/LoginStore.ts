/*
 * @Date         : 2020-03-05 15:48:41
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-11 18:09:12
 * @FilePath     : \src\store\modules\login\LoginStore.ts
 */
import { Module, VuexModule, Action } from "vuex-module-decorators";
import store from "store/index";
import router from "common/RouterConfig";
import { requestConfig } from "request/requestConfig";
import { server as axios } from "common/HttpClient";
import msg from "common/MessageUtils";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "LoginStore",
  store
})
export default class LoginStore extends VuexModule {
  public username = "hjkj";
  public password = "123456";
  public loginUrl: any;

  constructor(args: any) {
    super(args);
    this.loginUrl = requestConfig.login;
  }

  @Action
  public login() {
    if (this.username && this.password) {
      axios
        .post(this.loginUrl.login, {
          username: this.username,
          password: this.password
        })
        .then((res: any) => {
          if (res.code === 1) {
            msg.warning(res.msg);
          } else if (res.code === 0) {
            sessionStorage.setItem("Authorization", res.data.token);
            sessionStorage.setItem("userName", res.data.username);
            sessionStorage.setItem("projectId", res.data.projectId);
            sessionStorage.setItem("seeProjectId", res.data.projectId);
            sessionStorage.setItem("deptTypeNo", res.data.project.deptTypeNo);
            router.push({
              path:
                res.data.project.deptTypeNo === "project"
                  ? "/home/projectHomepage"
                  : "/home/homepage"
            });
          }
        });
    } else if (!this.username) {
      msg.warning("请输入账号!");
    } else if (!this.password) {
      msg.warning("请输入密码!");
    }
  }
}
