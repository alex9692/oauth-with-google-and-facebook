<template>
  <div class="alert-container">
    <transition
      enter-active-class="animated  fadeInUp"
      leave-active-class="animated  fadeOutUp"
    >
      <div v-if="error">
        <div class="pos alert alert-danger">{{error}}</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      error: state => state.auth.error
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
  opacity: 0.8;
}
</style>