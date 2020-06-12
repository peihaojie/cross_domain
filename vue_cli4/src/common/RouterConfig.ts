/*
 * @Date         : 2020-03-07 10:18:43
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-11 18:13:59
 * @FilePath     : \src\common\RouterConfig.ts
 */
import router from "router/.invoke/router";
import store from "../store";

router.beforeEach((to, from, next) => {
  sessionStorage.setItem("path", to.path);
  store.commit("changePath", to.path);
  if (to.path === "/login") {
    next();
    return;
  }

  const Authorization = sessionStorage.getItem('Authorization');
  const userName = sessionStorage.getItem('userName');

  // 从别的系统过来，例如“智慧工地”，跳转首页，自动登陆
  switch (to.path) {
    case '/home/homePage':
      // 判断是否登陆
      if (Authorization && userName) { // 已登录
        next();
      } else { // 未登录，判断URL是否携带参数，携带->自动登陆，否则去登录页
        // const paramStr = location.href.split('?')[1];
        // if (paramStr) {
        //   const paramObj = {};
        //   const paramArr = paramStr.split('&');
        //   paramArr.forEach(item => {
        //     const param = item.split('=');
        //     paramObj[param[0]] = param[1];
        //   });
        //   // 自动登陆操作
        //   axios.post('/api/validatelogin', {
        //     username: 'hjkj',
        //     password: '123456',
        //   })
        //     .then((res) => {
        //       if (res["code"] == 0) {
        //         sessionStorage.setItem("Authorization", res.data.token);
        //         sessionStorage.setItem("userName", res.data.username);
        //         next();
        //       } else {
        //         next('/login');
        //       }
        //     });
        // } else {
        //  next('/login');
        // }
        next("/login");
      }
      break;
    case '/majorHazardList':
      next();
      break;
    default:
      if (Authorization && userName) {
        next();
      } else {
        next({ path: "/login" });
      }
  }
});
export default router;
