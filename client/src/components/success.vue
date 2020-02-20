<template>
  <div class="alert-container">
    <transition
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutUp"
    >
      <div v-if="message">
        <div class="pos alert alert-success">{{ message }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      message: state => state.auth.success
    })
  }
};
</script>
<style lang="css" scoped>
.alert-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
}
.pos {
  width: max-content;
  font-size: 0.8rem;
  opacity: 0.95;
}
</style>