<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App"
};
</script>
<style>
#q-app {
  background: #f5f5f5;
}
.logoAlt {
  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 3rem;
}
</style>
