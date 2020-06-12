<!--
 * @Date         : 2020-05-28 14:19:31
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 11:00:41
 * @FilePath     : \src\pages\home\projectHomePage\Index.vue
-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import ProjectHomePageStore from "store/modules/projectHomePage/ProjectHomePageStore";
import echarts from "echarts";
import msg from "common/MessageUtils";
import Time from "common/mixin";

@Component({})
export default class ProjectHomePage extends Vue {
  private store: any;
  private categoryRadio = 1; // 隐患类型时间段
  private tendencyRadio = 1; // 隐患趋势图时间段
  private projectId: string | null = sessionStorage.getItem("seeProjectId");
  private now: Date = new Date();
  private nowTime: string = new Time(this.now).get(); // 当前的日期
  private weekAgo: string = new Time(
    new Date(
      this.now.getTime() -
        1000 * 60 * 60 * 24 * (this.now.getDay() ? this.now.getDay() - 1 : 6)
    )
  ).get(); // 周一的日期

  private monthAgo: string = new Time(
    new Date(
      this.now.getTime() - 1000 * 60 * 60 * 24 * (this.now.getDate() - 1)
    )
  ).get(); // 一月前的日期

  private project: any = {
    examine: 0, // 检查总数
    danger: 0, // 隐患总数
    great: 0, // 重大隐患总数
    reform: 0, // 整改率
    immediatelyReform: 0, // 及时整改率
    immediatelyReview: 0 // 及时复查率
  };

  constructor() {
    super();
    this.store = getModule(ProjectHomePageStore);
  }

  mounted() {
    this.getProjectData();
    this.getCategoryData();
    this.getTendencyData();
  }

  // 获取项目数据
  getProjectData() {
    this.store
      .getProjectData({ projectId: this.projectId })
      .then((res: any) => {
        if (res.code === 0) {
          const data = res.data;
          this.project = {
            examine: data.examineTotal, // 检查总数
            danger: data.hiddenDangerTotal, // 隐患总数
            great: data.majorHiddenDangerTotal, // 重大隐患总数
            reform: (data.rectificationRate * 100).toFixed(2), // 整改率
            immediatelyReform: (data.timelyCorrectionRate * 100).toFixed(2), // 及时整改率
            immediatelyReview: (data.timelyReviewRate * 100).toFixed(2), // 及时复查率
          };
        }
      });
  }

  // 获取隐患类型数据
  getCategoryData() {
    const params: any = {
      projectId: this.projectId,
      startTime: this.categoryRadio === 1 ? this.weekAgo : this.monthAgo,
      endTime: this.nowTime
    };
    this.store.getCategoryData(params).then((res: any) => {
      if (res.code === 0) {
        const categoryData = res.data.map((a: any) => {
          return {
            name: a.inspectTask,
            value: a.count
          };
        });
        this.getCategory(categoryData);
      }
    });
  }

  // 隐患类别统计
  getCategory(data: Array<Category> | null = null) {
    data = data && data.length ? data : [{ name: "无数据", value: 0 }];
    const total: number = data.reduce((num, item) => num + item.value, 0);
    const X = data.map(a => a.name);
    const echart = echarts.init(this.$refs.category);
    echart.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        x: "center",
        bottom: 20,
        formatter: (name: string) => {
          const label: Category = (data as any).filter((a: any) => a.name === name)[0];
          const value: number = total ? (label.value / total) * 100 : 0;
          const showName: string =
            name.length < 6 ? name.padStart(5, "一") : name.substring(0, 5);
          return ` ${showName} | ${
            value < 10 && total ? "0" + value : value
          }%   ${label.value}`;
        },
        data: X
      },
      color: ["#36CBCB", "#975FE4", "#F04864", "#FAD337", "#4ECB73", "#3BA0FF"],
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"],
          center: ["50%", "35%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold"
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    });
    window.onresize = () => {
      echart.resize();
    };
  }

  // 获取风险数据
  getTendencyData() {
    const params: any = {
      projectId: this.projectId,
      startTime: this.tendencyRadio === 1 ? this.weekAgo : this.monthAgo,
      endTime: this.nowTime
    };
    this.store.getTendencyData(params).then((res: any) => {
      if (res.code === 0) {
        const tendency = res.data.map((a: any) => {
          return {
            name: a.createOn,
            ordinary: a.riskTotal - a.significanTiskTotal,
            great: a.significanTiskTotal
          };
        });
        this.getTendency(tendency);
      }
    });
  }

  // 风险走势图
  getTendency(data: Array<Trend> | null = null) {
    data = data && data.length
      ? data
      : [
        { name: "无数据", ordinary: 0, great: 0 },
        { name: "无数据", ordinary: 0, great: 0 },
        { name: "无数据", ordinary: 0, great: 0 }
      ];
    const X = data.map(a => a.name);
    const ordinary = data.map(a => a.ordinary);
    const great = data.map(a => a.great);
    const echart = echarts.init(this.$refs.tendency);
    echart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      grid: {
        containLabel: true,
        top: 20,
        bottom: 10,
        left: 20,
        right: 10
      },
      color: ["#61D182", "#2999EB"],
      xAxis: {
        type: "category",
        axisTick: { show: false },
        data: X
      },
      yAxis: {
        type: "value",
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dotted"
          }
        }
      },
      series: [
        {
          name: "一般隐患",
          data: ordinary,
          type: "line",
          smooth: true
        },
        {
          name: "重大隐患",
          data: great,
          type: "line",
          smooth: true
        }
      ]
    });
    window.onresize = () => {
      echart.resize();
    };
  }
}
interface Category {
  name: string;
  value: number;
}
interface Trend {
  name: string;
  ordinary: number;
  great: number;
}
</script>
<template lang="pug" src="views/projectHomePage.pug" />
<style lang="stylus" src='styles/projectHomePage.stylus' />
