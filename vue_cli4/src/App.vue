<!--
 * @Date         : 2020-06-10 11:42:00
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 14:27:36
 * @FilePath     : \src\App.vue
-->
<template lang="pug">
  #app
    #nav
      router-link(to="/") Home |
      router-link(to="/about") About
    router-view
</template>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
