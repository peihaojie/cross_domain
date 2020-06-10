<!--
 * @Date         : 2020-06-10 11:42:00
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 16:07:27
 * @FilePath     : \src\views\Home.vue
-->
<template lang="pug">
  .home
    img(alt="Vue logo" src="../assets/logo.png")
    //- HelloWorld(msg="Welcome to Your Vue.js App")
    p {{res}}
</template>

<script lang="ts">
import HelloWorld from "@/components/HelloWorld.vue"
import { Component, Vue } from "vue-property-decorator"
import request from '../utils/request'

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  private res: string;
  constructor() {
    super()
    this.res = "ss"
  }

  mounted() {
    request.post("/api/post").then((res: any) => {
      this.res = res.data
    })
  }
}
</script>
