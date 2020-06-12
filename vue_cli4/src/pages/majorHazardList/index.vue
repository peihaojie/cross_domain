<!--
 * @Date         : 2020-06-11 16:03:06
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-12 11:47:00
 * @FilePath     : \src\pages\majorHazardList\index.vue
-->
<style scoped lang="stylus" src="styles/majorHazardList.stylus"></style>
<template lang="pug" src="views/majorHazardList.pug"></template>
<script>
import { requestConfig } from "request/requestConfig";
const {
  majorHazard: { sourceOfRiskList }
} = requestConfig;
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    const { projectId } = this.$route.query;
    if (projectId) {
      this.$axios
        .post(sourceOfRiskList, {
          projectId
        })
        .then(res => {
          if (res.code !== 0) {
            return;
          }
          this.list = res.data;
        });
    }
  },
  mounted() {
    const app = document.getElementById("app");
    app.style.minWidth = "unset";
  },
  methods: {}
};
</script>