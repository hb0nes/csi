<template>
  <v-app>
    <router-view :drawer="drawer"/>
    <Toolbar @toggleNav="drawer = !drawer"/>
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
    this.$store.commit("users/validate");
  },
  // If a user's cookie or token has expired... Log this user out.
  created() {
    this.axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response.status === 401) {
          this.$store.commit("users/logout");
          this.$router.push('login');
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
