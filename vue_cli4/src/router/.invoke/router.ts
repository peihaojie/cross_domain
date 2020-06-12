import Vue from 'vue';
import Router, {
  RouteConfig
} from 'vue-router';;
Vue.use(Router);
export const routes: RouteConfig[] = [{
    component: () => import('@/pages/home/home.vue'),
    name: 'home',
    path: '/home',
    children: [{
        component: () => import('@/pages/home/allHiddenDanger/Index.vue'),
        name: 'home-allHiddenDanger',
        path: 'allHiddenDanger',
      },
      {
        component: () => import('@/pages/home/cultivate/Index.vue'),
        name: 'home-cultivate',
        path: 'cultivate',
      },
      {
        component: () => import('@/pages/home/defecttreatment/Index.vue'),
        name: 'home-defecttreatment',
        path: 'defecttreatment',
      },
      {
        component: () => import('@/pages/home/homePage/Index.vue'),
        name: 'home-homePage',
        path: 'homePage',
      },
      {
        component: () => import('@/pages/home/manageLaborUnit/index.vue'),
        name: 'home-manageLaborUnit',
        path: 'manageLaborUnit',
      },
      {
        component: () => import('@/pages/home/photo/Index.vue'),
        name: 'home-photo',
        path: 'photo',
      },
      {
        component: () => import('@/pages/home/projectHomePage/Index.vue'),
        name: 'home-projectHomePage',
        path: 'projectHomePage',
      },
      {
        component: () => import('@/pages/home/securityLog/index.vue'),
        name: 'home-securityLog',
        path: 'securityLog',
      },
      {
        component: () => import('@/pages/home/settingDanger/Index.vue'),
        name: 'home-settingDanger',
        path: 'settingDanger',
      },
      {
        component: () => import('@/pages/home/settingOrganization/Index.vue'),
        name: 'home-settingOrganization',
        path: 'settingOrganization',
      },
      {
        component: () => import('@/pages/home/settingWorkarea/Index.vue'),
        name: 'home-settingWorkarea',
        path: 'settingWorkarea',
      },
    ],
  },
  {
    component: () => import('@/pages/login/Index.vue'),
    name: 'login',
    path: '/login',
  },
  {
    component: () => import('@/pages/majorHazardList/index.vue'),
    name: 'majorHazardList',
    path: '/majorHazardList',
  },
  {
    path: '/',
    redirect: '/login'
  },
];
const router = new Router({
  mode: 'hash',
  routes,
});
export default router;