<!--
 * @Date         : 2020-06-11 16:03:05
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 14:02:46
 * @FilePath     : \src\pages\home\manageLaborUnit\index.vue
-->
<script >
import Vue from "vue";
import { Checkbox, MessageBox } from "element-ui";

Vue.use(Checkbox);

Vue.prototype.$confirm = MessageBox.confirm;

export default {
  data() {
    return {
      showDialog: false,
      tableData: [
        {
          unitName: "虎匠科技1",
          no: "123456",
          shortName: "虎匠科技1",
          type: "参建单位",
          unitId: 1
        },
        {
          unitName: "虎匠科技2",
          no: "654321",
          shortName: "虎匠科技2",
          type: "参建单位",
          unitId: 2
        }
      ],
      checkedUnits: [],
      isLoading: true,
      selectedUnits: [], // 表格已选中的单位，用来批量移除
      total: 100,
      currentPage: 1
    };
  },
  methods: {
    // 添加按钮
    addUnits() {
      this.showDialog = true;
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },

    // 批量移除按钮
    removeUnitsHandler() {
      this.$confirm("确定要移除选中的单位吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.removeUnits(this.selectedUnits);
      });
    },

    // 表格单个移除操作
    removeUnitHandler(unitIdList) {
      this.$confirm("确定要移除该单位吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.removeUnits(unitIdList);
      });
    },

    // 表格checkbox
    handleSelectionChange(selection) {
      console.log("selection: ", selection);
      this.selectedUnits = selection.map(item => item.unitId);
    },

    // 移除单位操作
    removeUnits(unitIdList) {
      for (let i = 0; i < unitIdList.length; i += 1) {
        const unitId = unitIdList[i];
        this.tableData = this.tableData.filter(item => item.unitId !== unitId);
      }
      console.log(this.tableData);

      // 重新获取一下表格数据...
    },

    // 添加单位复选框
    unitsChangeHandler(v) {
      console.log(this.checkedUnits);
    },

    // 分页器change
    pageChangeHandler(currentPage) {
      console.log(currentPage);
    }
  }
};
</script>
<style lang="stylus" src="styles/manageLaborUnit.stylus"></style>
<template lang="pug" src="views/manageLaborUnit.pug"></template>