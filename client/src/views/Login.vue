<template>
  <div>
    <h1>Login:</h1>
    <section class="row flex-center child-borders">
      <div class="col-6 col shadow shadow-large">
        <div class="padding box">
          <form @submit.prevent="onSubmit">
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
                  {{ $v.password.$params.minLength.min }} characters long.</span
                >
              </div>
            </div>
            <button
              type="submit"
              :disabled="$v.$invalid"
              class="margin-top-large btn-primary btn-block"
            >
              Success
            </button>
          </form>
        </div>
        <div class="forgot-password padding text-right">
          <span class="help link  text-primary" @click="$router.push('/forgot')"
            >Forgot your password?</span
          >
        </div>
        <div class="row flex-edges">
          <div class="col-5 col ">
            <g-signin-button
              :params="googleSignInParams"
              @success="OnGoogleAuthSuccess"
              @error="OnGoogleAuthFail"
            >
              <button class="google">
                <span class="google-icon"
                  ><i class="fab fa-google-plus-g"></i></span
                >Sign in with Google+
              </button>
            </g-signin-button>
          </div>
          <div class="col-5 col ">
            <fb-signin-button
              :params="fbSignInParams"
              @success="OnFacebookAuthSuccess"
              @error="OnFacebookAuthFailure"
            >
              <button class="facebook">
                <span class="facebook-icon">
                  <i class="fab fa-facebook-f"></i
                ></span>
                Sign in with Facebook
              </button>
            </fb-signin-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
export default {
  methods: {
    onSubmit() {
      this.$store.dispatch("auth/SIGNIN", {
        email: this.email,
        password: this.password
      });
    },
    OnGoogleAuthSuccess(res) {
      const { access_token } = res.uc;
      this.$store.dispatch("auth/SIGN_IN_WITH_GOOGLE", {
        access_token
      });
    },
    OnGoogleAuthFail(error) {
      console.log(error);
    },
    OnFacebookAuthSuccess(res) {
      const { accessToken: access_token } = res.authResponse;
      this.$store.dispatch("auth/SIGN_IN_WITH_FACEBOOK", {
        access_token
      });
    },
    OnFacebookAuthFailure(error) {
      console.log(error);
    }
  },
  data() {
    return {
      email: "",
      password: "",
      googleSignInParams: {
        client_id:
          "273695228121-saleep4k11njktu96qt24onl099ku07d.apps.googleusercontent.com"
      },
      fbSignInParams: {
        scope: "email,user_likes",
        return_scopes: true
      }
    };
  },
  validations: {
    email: {
      email,
      required
    },
    password: {
      required,
      minLength: minLength(8)
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
  align-items: flex-start;
}
.form-group > label {
  font-weight: bold;
  margin-right: auto;
}
.form-group > input {
  width: 100%;
}
a {
  background: none;
  transition: all 0.35s;
}
.google,
.facebook {
  transition: all 0.35s;
}
.google:hover {
  cursor: pointer;
  background: #c94211;
}
.facebook:hover {
  color: #e0ded6;
  background: #0071de;
}
.google:hover a,
.facebook:hover a {
  color: #e0ded6;
}
.google-icon {
  color: #c94211;
  transition: all 0.35s;
  margin-right: 0.5rem;
}
.google:hover .google-icon {
  color: #e0ded6;
}
.facebook-icon {
  color: #0071de;
  transition: all 0.35s;
  margin-right: 0.5rem;
}
.facebook:hover .facebook-icon {
  color: #e0ded6;
}
.help {
  font-size: 0.7rem;
}
.link {
  transition: width 0.35s;
  cursor: pointer;
}
.link:hover {
  color: #7e7b72;
}
.forgot-password .link {
  padding-bottom: 0.5rem;
  position: relative;
}
.forgot-password .link::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #7a7a7a;
  height: 2px;
  width: 0%;
  transition: width 0.35s;
}
.link:hover::after {
  width: 100%;
}
</style>