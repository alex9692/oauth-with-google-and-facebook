<template>
  <div id="app">
    <Header></Header>
    <Error></Error>
    <Success></Success>
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header";
import Error from "@/components/error";
import Success from "@/components/success";
export default {
  components: {
    Header,
    Error,
    Success
  },
  mounted() {
    this.$store.dispatch("auth/PERSIST_USER");
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  letter-spacing: 0.075rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
