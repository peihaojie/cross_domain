/*
 * @Date         : 2020-03-13 15:43:16
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 11:55:32
 * @FilePath     : \src\store\modules\attendanceRecord\AttendanceRecordStore.ts
 */
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import store from "../..";

@Module({
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  name: "AttendanceRecordSrore",
  store
})
export default class AttendanceRecordSrore extends VuexModule {
  public name: string = "";
  public searchName: string = "";
  public peopleName: string = "";
  public searchPeopleName: string = "";
  public passedTime: string = "";
  public searchPassedTime: string = "";
  public direction: string = "";
  public searchDirection: string = "";
  public tableData: any = [];
  public total: number = 0;
  public pageSize: number = 15;
  public pageNum: number = 1;
  public loading: boolean = false;
  public pid: string | null;
  constructor(e: any) {
    super(e);
    this.pid = sessionStorage.getItem("pid");
  }
  // @Action
  // public getData(): Promise<any> {
  //   this.createdData();
  //   return axios
  //     .post(
  //       `${requestConfig.attendanceRecord.tableData}?projectId=${this.pid}&pageSize=${this.pageSize}&pageNum=${this.pageNum}&companyName=${this.searchName}&passedTime=${this.passedTime}&empName=${this.searchPeopleName}&direction=${this.direction}`
  //     )
  //     .then((res: any) => {
  //       if (res.code == 0) {
  //         this.hasData(res.data);
  //         return this.tableData;
  //       } else {
  //         return;
  //       }
  //     });
  // }
  @Mutation
  public createdData() {
    this.loading = true;
    this.name = this.searchName;
    this.passedTime = this.searchPassedTime;
    this.peopleName = this.searchPeopleName;
    this.direction = this.searchDirection;
  }
  @Mutation
  public hasData(res: any) {
    this.total = res.total;
    this.tableData = res.rows;
    this.loading = false;
  }
  // @Action
  // private async search() {
  //   this.createdSearch();
  //   let data: Array<any> = await this.getData();
  //   if (data && data.length == 0) {
  //     msg.warning("未搜索到相关数据!");
  //   }
  // }
  @Mutation
  public createdSearch() {
    this.searchName = this.name;
    this.passedTime = this.passedTime ? this.passedTime : "";
    this.searchPassedTime = this.passedTime;
    this.searchPeopleName = this.peopleName;
    this.searchDirection = this.direction;
    this.pageNum = 1;
  }
  // @Action
  // public handleCurrentChange(val) {
  //   this.setPage(val);
  //   this.getData();
  // }
  // @Mutation
  // public setPage(val) {
  //   this.pageNum = val;
  // }

  // @Mutation
  // public download() {
  //   axios({
  //     method: "get",
  //     url: `${requestConfig.attendanceRecord.excel}?pid=${this.pid}&passedTime=${this.searchPassedTime}`,
  //     responseType: "blob",
  //     params: "考勤记录"
  //   });
  // }

  public columns = [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: '序号',
      width: 100,
      slot: 'serialNumber'
    },
    { title: '姓名', key: 'eafName' },
    { title: '所属项目', key: 'projectName',
      render: (h: any, params: any) => {
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            },
            domProps: {
              title: params.row.projectName
            }
          }, params.row.projectName)
        ])
      }},
    { title: '工种', key: 'workType' },
    { title: '处罚', key: 'punishment' },
    { title: '处罚时间', key: 'appraise_time' },
    { title: '操作', slot: 'operation' }
  ];
}