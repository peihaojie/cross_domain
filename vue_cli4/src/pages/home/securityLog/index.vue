<script >
import { requestConfig } from "request/requestConfig";
import msg from "common/MessageUtils";
const {
  securityLog: { securityLogList, securityLog },
  settingOrganization: { tree }
} = requestConfig;

export default {
  data() {
    return {
      treeFilterText: "", // 树形控件过滤字段
      treeNode: [], // 树形图数据
      defaultProps: {
        children: "children",
        label: "orgName"
      },
      projectId: sessionStorage.getItem("seeProjectId"),
      tableData: [],
      startDate: "", // 起始时间
      endDate: "", // 结束时间
      createBy: "",
      currentPage: 1, // 当前页码
      total: 0, // 列表total
      showDialog: false, // 弹窗显隐
      dialogData: {}, // 查看详情弹窗数据
      hiddenDangerRecordList: [], // 查看详情弹窗- 安全巡检记录
      dialogMan: "" // 弹窗内-姓名
    };
  },
  created() {
    this.getSecurityLogList(1);
    this.getTree();
  },
  methods: {
    // getTree
    getTree() {
      this.$axios
        .post(tree, {
          projectId: this.projectId
        })
        .then(res => {
          if (res.code !== 0) {
            msg.error(res.msg);
            return;
          }
          this.treeNode = res.data;
        });
    },

    // 树形控件点击节点事件监听
    handleNodeClick(data) {
      if (this.projectId !== data.orgNo) {
        this.projectId = data.orgNo;
        this.getSecurityLogList(1);
      }
    },

    // 树形控件过滤监听
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      const newLabel = data.orgName.toLowerCase();
      const newValue = value.toLowerCase();
      return newLabel.indexOf(newValue) !== -1;
    },

    // 表格点击查看按钮
    watchRecord(data) {
      this.showDialog = true;
      this.dialogMan = data.createBy;
      this.$axios
        .post(securityLog, {
          id: data.id
        })
        .then(res => {
          if (res.code !== 0) {
            msg.error(res.msg);
            return;
          }
          this.dialogData = res.data.securityLog;
          this.hiddenDangerRecordList = res.data.hiddenDangerRecordList;
        });
    },

    // treeFilter
    treeFilter() {
      this.$refs.tree.filter(this.treeFilterText);
    },

    // getSecurityLogList
    getSecurityLogList(pageNum) {
      this.currentPage = pageNum;
      // 获取安全日志列表
      this.$axios
        .post(securityLogList, {
          pageNum,
          pageSize: 10,
          projectId: this.projectId,
          startTime: this.startDate,
          endTime: this.endDate,
          createBy: this.createBy
        })
        .then(res => {
          if (res.code !== 0) {
            msg.error(res.msg);
            return;
          }
          this.tableData = res.data.list;
          this.total = res.data.total;
        });
    }
  }
};
</script>
<template lang="pug" src="views/securityLog.pug" />
<style lang="stylus" src='styles/securityLog.stylus' />
