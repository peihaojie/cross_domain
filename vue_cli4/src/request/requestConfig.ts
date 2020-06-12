/*
 * @Date         : 2020-03-05 11:37:23
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:57:01
 * @FilePath     : \src\request\requestConfig.ts
 */
// 配置所有的接口
export const requestConfig = {
  login: {
    login: "/api/validatelogin"
  },
  homePage: {
    categoryData: "/api/auth/home/onTheRiskCategoryList",
    riskData: "/api/auth/home/onTheRiskDateParticulars",
    trendData: "/api/auth/home/onTheRiskDateParticularsDate",
    usageRateData: "/api/auth/home/onTheRiskAreaUseRate",
    troubleshoot: "/api/auth/home/onTheRiskDateCount",
    map: "/api/auth/home/getProjectLocation",
    warning: "/api/auth/home/getSecuritiyWarning"
  },
  projectHomePage: {
    project: "/api/auth/home/project/getHiddenDanger",
    categoryData: "/api/auth/home/project/onTheRiskCategoryList",
    getTendencyData: "/api/auth/home/project/onTheRiskDateParticularsDate"
  },
  settingOrganization: {
    tree: "/api/auth/project/treeList",
    treeSearch: "/api/auth/project/treeListByName",
    table: "/api/auth/manage/manager/list",
    del: "/api/auth/manage/manager/delete",
    add: "/api/auth/project/add",
    people: "/api/auth/manage/manager/save",
    searchPeople: "/api/auth/manage/manager/update",
    roleList: "/api/auth/manage/role/list",
    typeList: "/api/auth/dictionaryStation/getDict"
  },
  defecttreatment: {
    tree: "/api/auth/safeHiddenDanger/treeList",
    treeSearch: "/api/auth/safeHiddenDanger/treeListByName",
    table: "/api/auth/safeHiddenDanger/getPageByCode",
    addSafety: "/api/auth/safeHiddenDanger/add",
    del: "/api/auth/safeHiddenDanger/delete",
    searchPeople: "/api/auth/safeHiddenDanger/selectOne",
    edit: "/api/auth/safeHiddenDanger/update",
    addCategory: "/api/auth/safeHiddenDanger/adds"
  },
  allHiddenDangerStore: {
    getData: "/api/auth/dangerInspect/getListByPage",
    getList: "/api/auth/dangerInspect/getListById"
  },
  settingWorkAreaStore: {
    table: "/api/auth/projectWorkArea/getPagerByProjectId",
    delete: "/api/auth/projectWorkArea/delete",
    save: "/api/auth/projectWorkArea/save",
    managerList: "/api/auth/manage/manager/getListByProjectId"
  },
  photo: {
    img: "/api/auth/album/getAlbums",
    imgData: "/api/auth/album/getAlbumsDetails"
  },
  cultivate: {
    table: "/api/auth/pcDisclosureController/getDisclosureList",
    disclosureType: "/api/auth/pcDisclosureController/getDisclosureType",
    disclosureLevel: "/api//auth/pcDisclosureController/getDisclosureLevel"
  },
  danger: {
    add: "/api/auth/sourceOfRiskController/insertSourceOfRisk",
    del: "/api/auth/sourceOfRiskController/deleteSourceOfRisk",
    table: "/api/auth/sourceOfRiskController/getSourceOfRiskPager",
    query: "/api/auth/sourceOfRiskController/getSourceOfRisk",
    edit: "/api/auth/sourceOfRiskController/updateSourceOfRisk",
    qr: "/api/auth/sourceOfRiskController/activityCode"
  },
  majorHazard: {
    sourceOfRiskList: "/api/auth/sourceOfRiskController/getSourceOfRiskList"
  },
  securityLog: {
    securityLogList: "/api/auth/securityLogApi/getSecurityLogList",
    securityLog: "/api/auth/securityLogApi/getSecurityLog"
  }
};
