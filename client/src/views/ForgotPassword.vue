<template>
  <div>
    <h1>Forgot Password:</h1>
    <div class="row flex-center child-borders child-shadows">
      <div class="col-6 col">
        <p class="padding-large">
          Please enter your email address. <br />
          We will send the link to reset your password as soon as possible.
        </p>
        <div class="form-group text-left">
          <input
            type="text"
            placeholder="Enter your email"
            class="input-block"
            v-model="email"
            @blur="$v.email.$touch()"
          />
          <div v-if="$v.email.$error">
            <span class="help text-danger" v-if="!$v.email.required"
              >Email is required</span
            >
            <span class="help text-danger" v-if="!$v.email.email"
              >Email is invalid</span
            >
          </div>
        </div>
        <div class="row flex-right">
          <div class="col-5 col">
            <button
              @click="sendEmailForgotPassword"
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
import { email, required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      email: "",
      loading: false
    };
  },
  validations: {
    email: {
      email,
      required
    }
  },
  methods: {
    async sendEmailForgotPassword() {
      this.loading = true;
      await this.$store.dispatch("auth/FORGOT_PASSWORD", this.email);
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