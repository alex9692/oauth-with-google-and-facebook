<template>
  <div>
    <h1>This is Dashboard Page</h1>
    <section v-if="!isAuth">Login to display your profile information.</section>
    <section v-else>
      <h2>User Info:</h2>
      <div class="user-info">
        <strong>_name:</strong> {{ user.name }} | <strong>_email:</strong>
        {{ user.email }} | <strong>_role:</strong> {{ user.role }}
        <span
          @click="verifyAcc"
          class="tag"
          :class="{ 'is-warning': user.role === 'guest' }"
          ><strong>{{
            user.role === "guest"
              ? "Not verified(click to verify)"
              : "Verified "
          }}</strong></span
        >
      </div>
      <section class="third-party-link">
        <div id="google-buttons">
          <g-signin-button
            v-if="!user.google"
            :params="googleSignInParams"
            @success="OnGoogleAuthSuccess"
            @error="OnGoogleAuthFail"
          >
            <button class="google margin-top">
              <span class="google-icon"
                ><i class="fab fa-google-plus-g"></i></span
              >Link with Google
            </button>
          </g-signin-button>
          <button
            @click="UnlinkAccount('google')"
            v-if="user.google"
            class="google margin-top"
            :class="{ active: user.google }"
          >
            <span class="google-icon" :class="{ 'icon-active': user.google }"
              ><i class="fab fa-google-plus-g"></i></span
            >Unlink with Google
          </button>
        </div>
        <div id="facebook-buttons">
          <fb-signin-button
            v-if="!user.facebook"
            :params="fbSignInParams"
            @success="OnFacebookAuthSuccess"
            @error="OnFacebookAuthFailure"
          >
            <button class="facebook">
              <span class="facebook-icon">
                <i class="fab fa-facebook-f"></i
              ></span>
              Link with Facebook
            </button>
          </fb-signin-button>
          <button
            @click="UnlinkAccount('facebook')"
            v-if="user.facebook"
            class="facebook"
            :class="{ 'active-fb': user.facebook }"
          >
            <span
              class="facebook-icon"
              :class="{ 'icon-active-fb': user.facebook }"
            >
              <i class="fab fa-facebook-f"></i
            ></span>
            Unlink with Facebook
          </button>
        </div>
      </section>
      <section class="change-password-container">
        <h2>Update your password:</h2>
        <ChangePassword></ChangePassword>
      </section>
      <section class="change-user-info-container">
        <h2>Update your user info:</h2>
        <ChangeUserInfo></ChangeUserInfo>
      </section>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from "vuex";
import ChangePassword from "@/components/ChangePassword";
import ChangeUserInfo from "@/components/ChangeUserInfo";
export default {
  components: {
    ChangePassword,
    ChangeUserInfo
  },
  data() {
    return {
      googleSignInParams: {
        client_id: process.env.VUE_APP_GOOGLE_ID
      },
      fbSignInParams: {
        scope: "email,user_likes",
        return_scopes: true
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    ...mapGetters({
      isAuth: "auth/isAuth"
    })
  },
  methods: {
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
    },
    UnlinkAccount(account) {
      this.$store.dispatch("auth/UNLINK_GOOGLE", account);
    },
    verifyAcc() {
      this.$store.dispatch("auth/VERIFY_ACCOUNT");
    }
  }
};
</script>

<style lang="css" scoped>
.user-info {
  margin: 1.5rem 0 0.5rem 0;
}
.third-party-link {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #7a7a7a;
}
.google,
.facebook {
  transition: all 0.35s;
}
.google:hover,
.google.active {
  cursor: pointer;
  background: #c94211;
}
.facebook:hover,
.facebook.active-fb {
  color: #e0ded6;
  background: #0071de;
}
.google:hover a,
.google.active,
.facebook:hover a,
.facebook.active-fb {
  color: #e0ded6;
}
.google-icon {
  color: #c94211;
  transition: all 0.35s;
  margin-right: 0.5rem;
}
.google:hover .google-icon,
.google-icon.icon-active {
  color: #e0ded6;
}
.facebook-icon {
  color: #0071de;
  transition: all 0.35s;
  margin-right: 0.5rem;
}
.facebook:hover .facebook-icon,
.facebook-icon.icon-active-fb {
  color: #e0ded6;
}
.change-password-container,
.change-user-info-container {
  padding: 2rem;
}
.tag {
  font-size: 0.6rem;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  margin-bottom: 5px;
  background-color: #7ddb1e;
  color: #3d3b3b;
  cursor: pointer;
}
.tag.is-warning {
  background-color: #eebe46;
  color: #5a5a5a;
  cursor: pointer;
}
.change-password-container {
  border-bottom: 2px solid #7a7a7a;
}
</style>