<template>
  <div id="nav">
    <div class="nav-brand">
      <h2 class="nav-brand-title">OAuth</h2>
      <router-link to="/">Dashboard</router-link>
    </div>
    <router-link v-if="!isAuth" to="/login">Login</router-link>
    <router-link v-if="!isAuth" to="/register">Register</router-link>
    <div v-if="isAuth" class="user-box">
      <figure class="user-image">
        <img :src="user.avatar" alt="" />
      </figure>
      <p class="user-name">Welcome {{ user.username }}</p>
    </div>
    <a v-if="isAuth" @click="$store.dispatch('auth/SIGN_OUT')">Logout</a>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      isAuth: "auth/isAuth"
    }),
    ...mapState({
      user: state => state.auth.user
    })
  }
};
</script>

<style lang="css" scoped>
#nav {
  height: 5rem;
  padding: 0 30px;
  background-color: #706f6a;
  display: flex;
}
.nav-brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.nav-brand .nav-brand-title {
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #deb887;
  text-transform: uppercase;
  font-size: 2.5rem;
  margin-right: 2rem;
}
#nav .nav-brand {
  margin-right: auto;
}
#nav a {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: bold;
  color: #a1c2e2;
  background: none;
  padding: 0 1.2rem;
}
#nav a:hover,
#nav a:active {
  border-top: 2.5px solid #57e4a4;
  color: #57e4a4;
  background: #8f9091;
}
#nav a.router-link-exact-active {
  border-top: 2.5px solid #57e4a4;
  color: #57e4a4;
  background: #8f9091;
}
.user-box {
  display: flex;
  justify-content: center;
  align-items: stretch;
}
.user-name {
  align-self: center;
  color: #dcdcdc;
}
.user-image {
  align-self: center;
  height: 64px;
  width: 64px;
  margin: 1rem;
}
.user-image img {
  border: none;
}

a {
  cursor: pointer;
}
</style>