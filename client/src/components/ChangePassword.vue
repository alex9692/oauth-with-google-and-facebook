<template>
  <div class="row flex-center">
    <div class="col-8 col">
      <div class="row">
        <div class="col-10 col">
          <div class="form-group">
            <p class="title">Current Password</p>
            <div class="control">
              <input
                type="password"
                class="input-block"
                placeholder="if you currently don't have password leave this field"
                v-model="currentPassword"
              />
            </div>
          </div>
          <div class="form-group">
            <p class="title">New Password</p>
            <div class="control">
              <input
                type="password"
                class="input-block"
                placeholder="enter your new password"
                v-model="newPassword"
                @blur="$v.newPassword.$touch()"
              />
              <div v-if="$v.newPassword.$error">
                <span class="help text-danger" v-if="!$v.newPassword.required"
                  >Password is required</span
                >
                <span class="help text-danger" v-if="!$v.newPassword.minLength"
                  >Password should be
                  {{ $v.newPassword.$params.minLength.min }} characters
                  long.</span
                >
              </div>
            </div>
          </div>
          <div class="form-group">
            <p class="title">Confirm New Password</p>
            <div class="control">
              <input
                type="password"
                class="input-block"
                placeholder="enter confirmation password"
                v-model="confirmNewPassword"
                @blur="$v.confirmNewPassword.$touch()"
              />
              <div v-if="$v.confirmNewPassword.$error">
                <span
                  class="help text-danger"
                  v-if="!$v.confirmNewPassword.sameAs"
                  >Password don't match</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        :disabled="$v.$invalid || loading"
        @click="updatedPassword"
        class="btn-secondary btn-block"
      >
        {{ loading ? "Wait..." : "Change Password" }}
      </button>
    </div>
  </div>
</template>

<script>
import { minLength, required, sameAs } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      loading: false
    };
  },
  validations: {
    newPassword: {
      required,
      minLength: minLength(8)
    },
    confirmNewPassword: {
      sameAs: sameAs("newPassword")
    }
  },
  methods: {
    async updatedPassword() {
      try {
        this.loading = true;
        await this.$store.dispatch("auth/UPDATE_PASSWORD", {
          oldPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmNewPassword: this.confirmNewPassword
        });
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="css" scoped>
.title {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  height: 100%;
  min-width: 12rem;
}
.form-group {
  display: flex;
}
.help {
  font-size: 0.7rem;
}
.control {
  width: 100%;
}
</style>