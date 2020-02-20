<template>
  <div>
    <h1>Register Yourself:</h1>
    <section class="row flex-center child-borders margin-bottom-large">
      <div class="col-6 col shadow shadow-large margin-bottom-large">
        <div class="padding box margin-bottom-large">
          <form @submit.prevent="onSubmit">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                id="name"
                v-model="name"
                @blur="$v.name.$touch()"
              />
              <div v-if="$v.name.$error">
                <span class="help text-danger" v-if="!$v.name.required"
                  >Name is required</span
                >
              </div>
            </div>
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                id="username"
                v-model="username"
                @blur="$v.username.$touch()"
              />
              <div v-if="$v.username.$error">
                <span class="help text-danger" v-if="!$v.username.required"
                  >Username is required</span
                >
              </div>
            </div>
            <div class="form-group">
              <label for="avatar">Avatar</label>
              <input
                type="text"
                placeholder="Enter avatar url"
                id="avatar"
                v-model="avatar"
                @blur="$v.avatar.$touch()"
              />
              <div v-if="$v.avatar.$error">
                <span class="help text-danger" v-if="!$v.avatar.url"
                  >Url is invalid</span
                >
                <span
                  class="help text-danger"
                  v-if="$v.avatar.url && !$v.avatar.supportedFileTypes"
                  >Image is not supported</span
                >
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                id="email"
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
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                id="password"
                v-model="password"
                @blur="$v.password.$touch()"
              />
              <div v-if="$v.password.$error">
                <span class="help text-danger" v-if="!$v.password.required"
                  >Password is required</span
                >
                <span class="help text-danger" v-if="!$v.password.minLength"
                  >Password should be
                  {{ $v.password.$params.minLength.min }} characters long</span
                >
              </div>
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input
                type="password"
                placeholder="Enter your confirmation password"
                id="confirm-password"
                v-model="confirmPassword"
                @blur="$v.confirmPassword.$touch()"
              />
              <div v-if="$v.confirmPassword.$error">
                <span class="help text-danger" v-if="!$v.confirmPassword.sameAs"
                  >Passwords don't match</span
                >
              </div>
            </div>
            <button
              type="submit"
              :disabled="$v.$invalid || loading"
              class="margin-top-large btn-primary btn-block"
            >
              {{ loading ? "Wait..." : "Success" }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  email,
  minLength,
  sameAs,
  required,
  url
} from "vuelidate/lib/validators";
import { supportedFileTypes } from "@/helpers/supportedFileTypes";
export default {
  data() {
    return {
      name: "",
      username: "",
      avatar: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false
    };
  },
  validations: {
    email: {
      email,
      required
    },
    name: {
      required
    },
    username: {
      required
    },
    avatar: {
      url,
      supportedFileTypes
    },
    password: {
      minLength: minLength(8),
      required
    },
    confirmPassword: {
      sameAs: sameAs("password")
    }
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      await this.$store.dispatch("auth/REGISTER_USER", {
        email: this.email,
        name: this.name,
        username: this.username,
        avatar: this.avatar,
        password: this.password
      });
      this.loading = false;
    }
  }
};
</script>

<style lang="css" scoped>
.box {
  max-height: 40rem;
  width: 100%;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group > label {
  font-weight: bold;
  margin-right: auto;
}
.help {
  font-size: 0.7rem;
}
</style>