<!--
 * @Date        : 2020-06-02 14: 16: 43
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 10:29:58
 * @FilePath     : \src\pages\home\photo\Index.vue
-->
<script lang = "ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import PhotoStore from "store/modules/photo/PhotoStore";
import msg from "common/MessageUtils";
import Time from "common/mixin";
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
});

@Component({})
export default class Photo extends Vue {
  private store: any;
  private searchTime: [Date, Date] | null = null; // 搜索的时间
  private selectType: number | null = null; // 选择隐患类型
  private selectTypeList: any[] = [
    {
      label: "一般隐患",
      value: 1
    },
    {
      label: "重大隐患",
      value: 2
    }
  ]; // 选择隐患类型列表

  private selectState: number | null = null; // 选择隐患状态
  private selectStateList: any[] = [
    {
      label: "未整改",
      value: 0
    },
    {
      label: "合格",
      value: 1
    },
    {
      label: "待复查",
      value: 2
    }
  ]; // 隐患状态列表

  private selectPeople: number | null = null; // 上传隐患人员
  private imgList: any[] = []; // 图片列表
  private pageNum = 1; // 页码
  private pageSize = 20; // 每页条数
  private dialog = false; // 弹窗
  private imgData: ImgData = {
    url: "", // 图片
    inspect_task: "", // 隐患种类
    create_on: "", // 上传时间
    hidden_level: "", // 隐患性质
    name: "", // 项目名称
    area_name: "", // 工区名称
    create_name: "", // 上传人员
  }; // 图片详情

  private infiniteScroll: any = {}; // 防抖节流
  constructor() {
    super();
    this.store = getModule(PhotoStore);
  }

  mounted() {
    this.createScroll();
    this.getImgList();
  }

  // 滚动触发事件
  scroll(e: any) {
    const top = (e.target as HTMLElement).scrollTop - 82
    const clientH = (e.target as HTMLElement).clientHeight
    const scrollH = (this.$refs.scroll as HTMLElement).clientHeight;
    if (scrollH - (top + clientH) <= 200) {
      if (this.infiniteScroll) {
        clearTimeout(this.infiniteScroll)
      }
      this.infiniteScroll = setTimeout(() => {
        this.pageNum++;
        this.getImgList();
        console.log("添加");
      }, 300);
    }
  }

  // 获取图片数据
  getImgList() {
    const params = {
      projectId: sessionStorage.getItem("seeProjectId"),
      startTime:
        this.searchTime && this.searchTime.length
          ? new Time(this.searchTime[0]).get()
          : null,
      endTime:
        this.searchTime && this.searchTime.length
          ? new Time(this.searchTime[1]).get()
          : null,
      hidden_level: this.selectType,
      hidden_status: this.selectState,
      create_name: this.selectPeople,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    this.store.getImgList(params).then((res: any) => {
      if (res.code === 0 && res.data.list && res.data.list.length) {
        const arr: any[] = []
        res.data.list.forEach((item: any) => {
          const child = item.rectificationReviewRecord;
          if (child && child.length) {
            item.inspect_id = item.id;
            arr.push({
              index: !arr.length
                ? 0
                : arr[arr.length - 1].index + child.length + 1,
              data: child
            });
          }
        });
        arr.forEach(item => {
          res.data.list.splice(item.index + 1, 0, ...item.data);
        });
        this.imgList.push(...res.data.list);
      } else {
        if (this.imgList.length) {
          msg.warning("没有更多了");
        }
        this.clearScroll()
      }
    });
  }

  // 打开弹窗
  getImgData(imgData: any) {
    this.store
      .getImgData({ projectId: imgData.inspect_id })
      .then((res: any) => {
        if (res.code === 0) {
          this.dialog = true;
          this.imgData = {
            url: imgData.photo, // 图片
            inspect_task: res.data.inspect_task, // 隐患种类
            create_on: res.data.create_on, // 上传时间
            hidden_level: res.data.hidden_level, // 隐患性质
            name: res.data.name, // 项目名称
            area_name: res.data.area_name, // 工区名称
            create_name: res.data.create_name // 上传人员
          };
        }
      });
  }

  // 搜索
  search() {
    this.createScroll()
    this.imgList = []
    this.pageNum = 1
    this.getImgList()
  }

  // 添加滚动监听
  createScroll() {
    document
      .getElementsByClassName("router-wrap")[0]
      .addEventListener("scroll", this.scroll, false);
  }

  // 清除滚动监听
  clearScroll() {
    document
      .getElementsByClassName("router-wrap")[0]
      .removeEventListener("scroll", this.scroll, false);
  }

  beforeDestroy() {
    this.clearScroll()
  }
}
interface ImgData {
  url: string; // 图片
  inspect_task: string; // 隐患种类
  create_on: string; // 上传时间
  hidden_level: string; // 隐患性质
  name: string; // 项目名称
  area_name: string; // 工区名称
  create_name: string; // 上传人员
}
</script>
<template lang = "pug" src    = "views/photo.pug" />
<style    lang = "stylus" src = 'styles/photo.stylus' />
