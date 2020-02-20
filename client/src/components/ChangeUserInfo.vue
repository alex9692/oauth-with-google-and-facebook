<template>
  <div class="row flex-center">
    <div class="col-8 col">
      <div class="row">
        <div class="col-10 col">
          <div class="form-group">
            <p class="title">Username</p>
            <div class="control">
              <input
                type="text"
                class="input-block"
                placeholder="leaving empty field will not update"
                v-model="username"
              />
            </div>
          </div>
          <div class="form-group">
            <p class="title">Name</p>
            <div class="control">
              <input
                type="text"
                class="input-block"
                placeholder="leaving empty field will not update"
                v-model="name"
              />
            </div>
          </div>
          <div class="form-group">
            <p class="title">Email</p>
            <div class="control">
              <input
                type="email"
                class="input-block"
                placeholder="leaving empty field will not update"
                v-model="email"
                @blur="$v.email.$touch()"
              />
              <div v-if="$v.email.$error">
                <span class="help text-danger" v-if="!$v.email.email"
                  >Email is invalid</span
                >
              </div>
            </div>
          </div>
          <div class="form-group">
            <p class="title">Avatar</p>
            <div class="control">
              <input
                type="text"
                class="input-block"
                placeholder="leaving empty field will not update"
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
          </div>
          <div class="form-group">
            <p class="title">Phone Number</p>
            <div class="control">
              <input
                type="text"
                class="input-block"
                placeholder="leaving empty field will not update"
                v-model="phoneNumber"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        :disabled="$v.$invalid || loading"
        @click="updatedUser"
        class="btn-secondary btn-block"
      >
        {{ loading ? "Wait..." : "Update" }}
      </button>
    </div>
  </div>
</template>

<script>
import { email, url } from "vuelidate/lib/validators";
import { supportedFileTypes } from "@/helpers/supportedFileTypes";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      user: state => state.auth.user
    })
  },
  data() {
    return {
      username: "",
      name: "",
      email: "",
      avatar: "",
      phoneNumber: "",
      loading: false
    };
  },
  mounted() {
    this.username = this.user.username;
    this.name = this.user.name;
    this.email = this.user.email;
    this.avatar = this.user.avatar;
    this.phoneNumber = this.user.phoneNumber;
  },
  validations: {
    email: {
      email
    },
    avatar: {
      url,
      supportedFileTypes
    }
  },
  methods: {
    async updatedUser() {
      try {
        const fields = {
          username: this.username,
          name: this.name,
          email: this.email,
          avatar: this.avatar,
          phoneNumber: this.phoneNumber
        };

        const updatedFields = {};

        for (let field in fields) {
          if (this[field] !== this.user[field] && this[field]) {
            updatedFields[field] = this[field];
          }
        }
        if (Object.keys(updatedFields).length === 0) {
          this.$store.dispatch(
            "auth/SEND_ERROR",
            "No updated values were detected!"
          );
        } else {
          this.loading = true;
          await this.$store.dispatch("auth/UPDATE_USERINFO", {
            ...updatedFields
          });
          this.loading = false;
        }
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