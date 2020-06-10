/*
 * @Date         : 2020-06-10 11:42:00
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 14:53:52
 * @FilePath     : \src\router\index.ts
 */
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
Vue.use(VueRouter);
const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("views/Home.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "views/About.vue")
  }
];
const router = new VueRouter({
  routes
});
export default router;
