<template>
  <div>
    <h1>Password Reset:</h1>
    <div class="row flex-center child-borders child-shadows">
      <div class="col-6 col">
        <p class="padding-large">
          Reset your password
        </p>
        <div class="form-group text-left">
          <label><strong>New Password</strong></label>
          <input
            type="password"
            placeholder="enter new password"
            class="input-block"
            v-model="newPassword"
            @blur="$v.newPassword.$touch()"
          />
          <div v-if="$v.newPassword.$error">
            <span class="help text-danger" v-if="!$v.newPassword.required"
              >Password is required</span
            >
            <span class="help text-danger" v-if="!$v.newPassword.minLength"
              >Password should be
              {{ $v.newPassword.$params.minLength.min }} characters long.</span
            >
          </div>
        </div>
        <div class="form-group text-left">
          <label><strong>Confirm Password</strong></label>
          <input
            type="password"
            placeholder="enter confirmation password"
            class="input-block"
            v-model="confirmNewPassword"
            @blur="$v.confirmNewPassword.$touch()"
          />
          <div v-if="$v.confirmNewPassword.$error">
            <span class="help text-danger" v-if="!$v.confirmNewPassword.sameAs"
              >Passwords dont match</span
            >
          </div>
        </div>
        <div class="row flex-right">
          <div class="col-5 col">
            <button
              @click="resetPassword"
              :disabled="$v.$invalid || loading"
              class="paper-btn btn-block btn-primary"
            >
              {{ loading ? "Wait.." : "Confirm" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { minLength, required, sameAs } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      newPassword: "",
      confirmNewPassword: "",
      loading: false
    };
  },
  validations: {
    newPassword: {
      minLength: minLength(8),
      required
    },
    confirmNewPassword: {
      sameAs: sameAs("newPassword")
    }
  },
  methods: {
    async resetPassword() {
      this.loading = true;
      await this.$store.dispatch("auth/RESET_PASSWORD", {
        payload: {
          newPassword: this.newPassword,
          confirmPassword: this.confirmNewPassword
        },
        token: this.$route.params.token
      });
      this.loading = false;
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="css" scoped>
.help {
  font-size: 0.7rem;
}
</style>