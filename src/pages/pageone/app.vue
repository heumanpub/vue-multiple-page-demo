<style>
body {
  font: Helvetica, sans-serif;
  color: #999;
}
.logo {
  width: 40px;
  height: 40px;
}
</style>

<template>
  <div>
    <img src="../../static/img/logo.png" alt="" class="logo">
    <h1>{{msg}}</h1>
    <comp-a></comp-a>
    <comp-b></comp-b>
  </div>
</template>

<script>
import CompA from '../../components/A/A.vue'
import CompB from '../../components/B/B.vue'
export default {
  data () {
    return {
      msg: 'Hello from page a page!'
    }
  },
  components: {
    CompA,
    CompB
  }
}
</script>