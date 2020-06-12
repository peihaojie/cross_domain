<!--
 * @Date         : 2020-02-24 14:32:59
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-11 16:57:53
 * @FilePath     : \src\App.vue
 -->
<template lang='pug'>
  #app
    router-view
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "APP"
})
export default class App extends Vue {
  mounted() {
    this.adapt();
    window.onresize = () => this.adapt();
  }

  private adapt(): void {
    const StandardWidth = 1920;
    const StandardFontSize = 100;
    const nowWidth =
      document.documentElement.offsetWidth < 1600
        ? 1600
        : document.documentElement.offsetWidth;
    const nowFontSize = (nowWidth / StandardWidth) * StandardFontSize;
    document.documentElement.style.fontSize = nowFontSize + "px";
  }
}
</script>

<style lang="stylus">
@import 'assets/style/index.css';
@import 'styles/app.stylus';

.time-picker-wrap {
  font-size: 0;
}
</style>
