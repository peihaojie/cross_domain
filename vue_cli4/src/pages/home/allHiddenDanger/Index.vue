<!--
 * @Date         : 2020-05-15 15:32:20
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:45:37
 * @FilePath     : \src\pages\home\allHiddenDanger\Index.vue
 -->
<script lang="ts">
import { Component, Vue, Model, Prop } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import AllHiddenDangerStore from "store/modules/allHiddenDanger/allHiddenDangerStore";

@Component({})
export default class AllHiddenDanger extends Vue {
  private store: any;
  private centerDialogVisible = false;
  private test = "supercarrydoinb";
  private item = false;
  private pullDown = false;
  private value1 = '';
  private value12 = '';
  private url =
    "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";

  public TEMPERATURE = 37.5;
  constructor() {
    super();
    this.store = getModule(AllHiddenDangerStore);
  }

  public searchCheckeds: SearchList = {
    eafName: null,
    rateWorkType: null,
    grade: null,
    rank: null,
    modifyBy: null,
    company: null,
    project: null
  };

  mounted() {
    this.store.getData();
  }

  searchData() {
    this.store.getData();
  }

  clearData() {
    this.store.store.state.AllHiddenDangerStore.dateModel = null;
    this.store.store.state.AllHiddenDangerStore.hazardLevel = null;
    this.store.store.state.AllHiddenDangerStore.inspectionResult = null;
    this.store.store.state.AllHiddenDangerStore.inspectionType = null;
    this.store.store.state.AllHiddenDangerStore.inspector = null;
    this.store.getData();
  }

  details(item: any[]) {
    // this.store.details();
    this.store.getList(item);
  }

  changeItem() {
    this.item = !this.item;
    this.pullDown = !this.pullDown;
  }

  handleCurrentChange(val: number) {
    this.store.store.state.AllHiddenDangerStore.pageNumber = val;
    this.store.getData();
  }

  public getIndex(index: number): number {
    return (
      (Number(this.store.store.state.AllHiddenDangerStore.pageNumber) - 1) *
        Number(this.store.store.state.AllHiddenDangerStore.pageSize) +
      index +
      1
    );
  }

  public accidentLevel: Array<any> = [
    {
      label: "一般",
      value: "1"
    },
    {
      label: "重大",
      value: "2"
    }
  ];

  public timeOut: Array<any> = [
    {
      value: "1",
      label: "正常整改"
    },
    {
      value: "2",
      label: "超时整改"
    },
    {
      value: "3",
      label: "正常复查"
    },
    {
      value: "4",
      label: "超时复查"
    }
  ];

  public checkResult: Array<any> = [
    {
      label: "无需整改",
      value: "1"
    },
    {
      label: "待整改",
      value: "2"
    },
    {
      label: "待复查",
      value: "3"
    },
    {
      label: "合格",
      value: "4"
    },
    {
      label: "不合格",
      value: "5"
    }
  ];

  public checkType: Array<any> = [
    {
      label: "日常检查",
      value: "1"
    },
    {
      label: "周检",
      value: "2"
    },
    {
      label: "月检",
      value: "3"
    },
    {
      label: "季检",
      value: "4"
    }
  ];

  public checkMen: Array<any> = [
    {
      label: "曹启泰（安全员）（18178888888)",
      value: "1"
    },
    {
      label: "曹启泰（安全员）（18178888888)",
      value: "2"
    },
    {
      label: "曹启泰（安全员）（18178888888)",
      value: "3"
    },
    {
      label: "曹启泰（安全员）（18178888888)",
      value: "4"
    }
  ];
}
interface SearchList {
  eafName: string | null;
  rateWorkType: string | null;
  grade: string | null;
  rank: string | null;
  modifyBy: string | null;
  project?: string | null;
  company: string | null;
}
</script>
<template lang="pug" src="views/allHiddenDanger.pug" />
<style lang="stylus" src="styles/allHiddenDanger.stylus" />
<style scoped lang="css" src='styles/allHiddenDanger.css' />