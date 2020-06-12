<!--
 * @Date         : 2020-03-09 18:21:44
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 12:13:13
 * @FilePath     : \src\pages\home\homePage\Index.vue
 -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import HomePageStore from "store/modules/homePage/HomePageStore";
import echarts from "echarts";
import msg from "common/MessageUtils";
import Time from "common/mixin";

@Component({})
export default class HomePage extends Vue {
  private store: any;
  private map: any;
  private center: [number, number] = [114.057939, 22.543527];
  private usageRateRadio = 1; // 项目使用率查看周期
  private categoryRadio = 1; // 隐患类别统计查看周期
  private riskRadio = 1; // 在施重大风险项目排行查看周期
  private trendRadio = 1; // 风险走势查看周期
  private usageOn = 0; // 使用项目数
  private usageOff = 0; // 未使用项目数
  private company: any = {
    examine: 0, // 企业检查总数
    danger: 0, // 企业隐患总数
    great: 0, // 企业重大总数
    week: 0, // 企业周同比
    month: 0, // 企业重大总数
    reform: 0 // 企业整改率
  };

  private project: any = {
    examine: 0, // 项目检查总数
    danger: 0, // 项目隐患总数
    great: 0, // 项目重大总数
    week: 0, // 项目周同比
    month: 0, // 项目重大总数
    reform: 0 // 项目整改率
  };

  private warningList: Array<any> = [
    {
      name: "最近七天未进行隐患排查的项目数",
      num: 0,
      link: "weekUnCheckCount"
    },
    { name: "隐患整改率低于50%项目数", num: 0, link: "rectificationTotal" },
    { name: "最近一个月未履行检查的公司数", num: 0, link: "monthUnCheckCount" },
    { name: "未整改重大隐患数", num: 0, link: "unReformDangerTotal" },
    { name: "超期未复查重大隐患数", num: 0, link: "unReviewHiddenDangerCount" }
  ];

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

  private projectId: string | null = sessionStorage.getItem("seeProjectId"); // 登录的项目id
  constructor() {
    super();
    this.store = getModule(HomePageStore);
  }

  mounted() {
    this.map = new AMap.Map("map", {
      zoom: 11, // 级别
      center: this.center, // 中心点坐标
      viewMode: "3D", // 使用3D视图
      mapStyle: "amap://styles/fresh" // 设置地图的显示样式
    });
    this.getMap();
    this.getUsageRateData();
    this.getRiskData();
    this.getTrendData();
    this.getCategoryData();
    this.getTroubleshoot();
    // this.getScroll();
    this.getWarning();
  }

  // 挂载地图
  getMap() {
    this.store.getMap({ projectId: this.projectId }).then((res: any) => {
      if (res.code === 0) {
        const markerList: any[] = [];
        res.data.forEach((a: any, i: any) => {
          if (a.longitude && a.latitude) {
            const center = [a.longitude, a.latitude];
            if (i === 0) this.map.setCenter(center);
            const marker = new AMap.Marker({
              position: center
            });
            const infoWindow = new AMap.InfoWindow({
              anchor: "bottom-center",
              content: a.name,
              offset: new AMap.Pixel(0, -30)
            });
            marker.on("mouseover", () => {
              infoWindow.open(this.map, center);
            });
            marker.on("mouseout", () => {
              infoWindow.close();
            });
            markerList.push(marker);
          }
        });
        this.map.add(markerList);
      }
    });
  }

  // 获取项目使用率数据
  getUsageRateData() {
    const params: any = {
      projectId: this.projectId,
      startTime: this.usageRateRadio === 1 ? this.weekAgo : this.monthAgo,
      endTime: this.nowTime
    };
    this.store.getUsageRateData(params).then((res: any) => {
      if (res.code === 0) {
        this.usageOn = res.data.use;
        this.usageOff = res.data.unUse;
        const data = [
          {
            name: "使用项目",
            value: res.data.use
          },
          {
            name: "未使用项目",
            value: res.data.unUse
          }
        ];
        this.getUsageRate(data);
      }
    });
  }

  // 加载项目使用率图表
  getUsageRate(data: Array<UsageRate> | null = null) {
    data = data && data.length ? data : [{ name: "无数据", value: 0 }];
    const total = data.reduce((num, item) => num + item.value, 0);
    const echart = echarts.init(this.$refs.usageRate);
    echart.setOption({
      series: [
        {
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          color: ["#00b577", "#c0e8e7"],
          label: {
            show: false,
            position: "center",
            formatter: (val: any) => {
              return `${val.name}:\n${
                total ? ((val.value / total) * 100).toFixed(2) : 0
              }%`;
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "15"
            }
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            normal: {
              borderColor: "#fff",
              borderWidth: data.length > 1 ? 2 : 0
            }
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
  getRiskData() {
    const params: any = {
      projectId: this.projectId,
      startTime: this.riskRadio === 1 ? this.weekAgo : this.monthAgo,
      endTime: this.nowTime
    };
    this.store.getRiskData(params).then((res: any) => {
      if (res.code === 0) {
        const risk = res.data.map((a: any) => {
          return {
            name: a.name,
            value: a.significanTiskTotal
          };
        });
        this.getRisk(risk);
      }
    });
  }

  // 风险数量柱形图
  getRisk(data: Array<Risk> | null = null) {
    data = data && data.length
      ? data
      : [
        { name: "无数据", value: 0 },
        { name: "无数据", value: 0 },
        { name: "无数据", value: 0 }
      ];
    const X = data.map(a => a.name);
    const list = data.map(a => a.value);
    const echart = echarts.init(this.$refs.risk);
    echart.setOption({
      title: {
        text: "风险数量",
        textStyle: {
          fontWeight: 500,
          fontSize: 14
        },
        left: 10,
        top: 10
      },
      tooltip: {
        trigger: "item"
      },
      grid: {
        containLabel: true,
        bottom: 10,
        left: 20,
        right: 10
      },
      color: "#3BA1FF",
      xAxis: {
        type: "category",
        axisTick: { show: false },
        data: X,
        axisLabel: {
          formatter: function(params: any) {
            let newParamsName = "";
            const paramsNameNumber = 6;
            const provideNumber = 3;
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
              for (let p = 0; p < rowNumber; p++) {
                let tempStr = "";
                const start = p * provideNumber;
                const end = start + provideNumber;
                if (p === rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
              }
            } else {
              newParamsName = params;
            }
            return newParamsName;
          }
        }
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
      series: {
        data: list,
        type: "bar",
        barMaxWidth: 20,
        itemStyle: {
          normal: {
            // 柱形图圆角，初始化效果
            barBorderRadius: [10, 10, 0, 0]
          }
        }
      }
    });
    window.onresize = () => {
      echart.resize();
    };
  }

  // 获取风险走势数据
  getTrendData() {
    const params: any = {
      projectId: this.projectId,
      startTime: this.trendRadio === 1 ? this.weekAgo : this.monthAgo,
      endTime: this.nowTime
    };
    this.store.getTrendData(params).then((res: any) => {
      if (res.code === 0) {
        const trendData = res.data.map((a: any) => {
          return {
            name: a.createOn,
            ordinary: a.riskTotal - a.significanTiskTotal,
            great: a.significanTiskTotal
          };
        });
        this.getTrend(trendData);
      }
    });
  }

  // 风险走势图
  getTrend(data: Array<Trend> | null = null) {
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
    const echart = echarts.init(this.$refs.trend);
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
          const value: number | string = total
            ? ((label.value / total) * 100).toFixed(2)
            : 0;
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
          radius: ["50%", "70%"],
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
          itemStyle: {
            normal: {
              borderColor: "#fff",
              borderWidth: data.length > 1 ? 2 : 0
            }
          },
          data: data
        }
      ]
    });
    window.onresize = () => {
      echart.resize();
    };
  }

  // 向下滚动
  getScroll() {
    const height = (this.$refs.scroll as HTMLElement).clientHeight;
    const top = (this.$refs.scrollWrap as HTMLElement).scrollTop;
    if (top < height) {
      (this.$refs.scrollWrap as HTMLElement).scrollTop = top + 1;
      requestAnimationFrame(this.getScroll);
      return;
    }
    (this.$refs.scrollWrap as HTMLElement).scrollTop = 0;
    this.getScroll();
  }

  // 获取排查情况数据
  getTroubleshoot() {
    const params: any = { projectId: this.projectId };
    this.store.getTroubleshoot(params).then((res: any) => {
      if (res.code === 0) {
        const data = res.data;
        this.company = {
          examine: data.companyExamineTotal, // 企业检查总数
          danger: data.companyRiskTotaL, // 企业隐患总数
          great: data.companySignificantRiskTotal, // 企业重大总数
          week: data.companyWeekRatio, // 企业周同比
          month: data.companyDayliyRatio, // 企业重大总数
          reform: data.companyRiskRate.toFixed(2) // 企业整改率
        };
        this.project = {
          examine: data.projectExamineTotal, // 项目检查总数
          danger: data.projectRiskTotal, // 项目隐患总数
          great: data.projectSignificantRiskTotal, // 项目重大总数
          week: data.projectWeekRatio, // 项目周同比
          month: data.projectDayliyRatio, // 项目重大总数
          reform: data.projectRiskRate.toFixed(2) // 项目整改率
        };
      }
    });
  }

  // 获取报警数据
  getWarning() {
    this.store.getWarning({ projectId: this.projectId }).then((res: any) => {
      if (res.code === 0) {
        const data = res.data;
        this.warningList.forEach(a => {
          a.num = data[a.link];
        });
      }
    });
  }
}
interface UsageRate {
  name: string;
  value: number;
}
interface Risk {
  name: string;
  value: number;
}
interface Trend {
  name: string;
  ordinary: number;
  great: number;
}
interface Category {
  name: string;
  value: number;
}
</script>
<template lang="pug" src="views/homePage.pug" />
<style lang="stylus" src='styles/homePage.stylus' />
