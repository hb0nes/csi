<template>
  <v-app>
    <router-view :drawer="drawer"/>
    <Toolbar @toggleNav="drawer = !drawer" />
  </v-app>
</template>

<script>
import Toolbar from "./components/Toolbar";
import router from "./router";


export default {
  router,
  name: "CyseDM",
  components: {
    Toolbar: Toolbar
  },
  // Check if localstorage hasn't been tampered with
  beforeMount() {
    let user = this.$store.getters["users/currentUser"];
    this.axios({
      method: "post",
      data: {
        user: user
      },
      withCredentials: true,
      url: "http://localhost:3000/api/v1/user/validate"
    }).catch(() => {
      // alert(err.response.data.message);
      this.$store.commit("users/logout");
    });
  },
  // If a user's cookie or token has expired... Log this user out.
  created() {
    this.axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response.status === 401) {
          this.$store.commit('users/logout');
        }
        return Promise.reject(error);
      }
    );
  },
  data() {
    return {
      drawer: true
    };
  }
};
</script>
