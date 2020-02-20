import axios from "../../helpers/axios";
import router from "../../router";
import Vue from "vue";

export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
    error: null,
    success: null
  },
  mutations: {
    SET_USER: (state, { token, user }) => {
      state.token = token;
      state.user = user;
    },
    SET_ERROR: (state, payload) => {
      state.error = payload;
    },
    SET_SUCCESS: (state, payload) => {
      state.success = payload;
    },
    "UPDATE_USER[VERIFIED]": state => {
      Vue.set(state.user, "role", "user");
    }
  },
  actions: {
    PERSIST_USER: async ({ commit }) => {
      try {
        const response = await axios.get("/api/v1/user/me");
        const userData = response.data.data;
        commit("SET_USER", userData);
      } catch (error) {
        console.error(error.response);
      }
    },
    SIGNIN: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.post("/api/v1/auth/signin", payload);
        const userData = response.data.data;
        commit("SET_USER", userData);
        router.push({ path: "/" });
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
        // commit("SET_ERROR", error.response.data.message);
        // setTimeout(() => {
        //   commit("SET_ERROR", null);
        // }, 5000);
      }
    },
    REGISTER_USER: async (_, payload) => {
      try {
        await axios.post("/api/v1/auth/signup", { ...payload });
        router.push("/login");
      } catch (error) {
        console.error(error.response);
      }
    },
    SIGN_OUT: async ({ commit }) => {
      try {
        await axios.get("/api/v1/auth/signout");
        commit("SET_USER", { token: null, user: null });
        router.push({ path: "/login" });
      } catch (error) {
        console.error(error.response);
      }
    },
    SIGN_IN_WITH_GOOGLE: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.post("/oauth/google", payload);
        const userData = response.data.data;
        commit("SET_USER", userData);
        router.push({ path: "/" });
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
        // commit("SET_ERROR", error.response.data.message);
        // setTimeout(() => {
        //   commit("SET_ERROR", null);
        // }, 5000);
      }
    },
    UNLINK_GOOGLE: async ({ commit, state }, payload) => {
      try {
        const response = await axios.get(`/oauth/unlink/${payload}`);
        const { user } = response.data.data;
        commit("SET_USER", { user, token: state.token });
      } catch (error) {
        console.error(error.response);
      }
    },
    SIGN_IN_WITH_FACEBOOK: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.post("/oauth/facebook", payload);
        const userData = response.data.data;
        commit("SET_USER", userData);
        router.push({ path: "/" });
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
        // commit("SET_ERROR", error.response.data.message);
        // setTimeout(() => {
        //   commit("SET_ERROR", null);
        // }, 5000);
      }
    },
    FORGOT_PASSWORD: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.post("/api/v1/auth/forgot", {
          email: payload
        });
        commit("SET_SUCCESS", response.data.message);
        setTimeout(() => {
          commit("SET_SUCCESS", null);
        }, 5000);
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
        // commit("SET_ERROR", error.response.data.message);
        // setTimeout(() => {
        //   commit("SET_ERROR", null);
        // }, 5000);
      }
    },
    RESET_PASSWORD: async ({ commit, dispatch }, { payload, token }) => {
      try {
        const response = await axios.patch(`/api/v1/auth/reset/${token}`, {
          ...payload
        });
        commit("SET_SUCCESS", response.data.message);
        setTimeout(() => {
          commit("SET_SUCCESS", null);
        }, 5000);
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
        // commit("SET_ERROR", error.response.data.message);
        // setTimeout(() => {
        //   commit("SET_ERROR", null);
        // }, 5000);
      }
    },
    UPDATE_PASSWORD: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.patch("/api/v1/user/changepassword", {
          ...payload
        });
        commit(
          "SET_SUCCESS",
          response.data.message + ". You will be logged out!"
        );
        setTimeout(() => {
          commit("SET_SUCCESS", null);
          dispatch("SIGN_OUT");
        }, 5000);
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
        // commit("SET_ERROR", error.response.data.message);
        // setTimeout(() => {
        //   commit("SET_ERROR", null);
        // }, 5000);
      }
    },
    UPDATE_USERINFO: async ({ commit, state, dispatch }, payload) => {
      try {
        const response = await axios.patch("/api/v1/user/changeUserInfo", {
          ...payload
        });
        commit("SET_USER", {
          token: state.token,
          user: response.data.data.user
        });
        commit("SET_SUCCESS", "User Updated");
        setTimeout(() => {
          commit("SET_SUCCESS", null);
        }, 5000);
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
      }
    },
    VERIFY_ACCOUNT: async ({ commit, dispatch }) => {
      try {
        const response = await axios.get("/api/v1/user/verifyaccount");
        commit("SET_SUCCESS", response.data.message);
        setTimeout(() => {
          commit("SET_SUCCESS", null);
        }, 5000);
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
      }
    },
    FINISH_VERIFYACCOUNT_STEP: async ({ commit, dispatch }, payload) => {
      try {
        const response = await axios.patch(
          `/api/v1/user/verifyaccount/${payload}`
        );
        commit("SET_SUCCESS", response.data.message);
        commit("UPDATE_USER[VERIFIED]");
        setTimeout(() => {
          commit("SET_SUCCESS", null);
        }, 5000);
      } catch (error) {
        dispatch("SEND_ERROR", error.response.data.message);
      }
    },
    SEND_ERROR: ({ commit }, payload) => {
      commit("SET_ERROR", payload);
      setTimeout(() => {
        commit("SET_ERROR", null);
      }, 5000);
    }
  },
  getters: {
    isAuth: state => {
      return !!state.token;
    }
  }
};
