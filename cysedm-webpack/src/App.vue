<template>
  <v-app>
    <Toolbar/>
    <router-view />
  </v-app>
</template>

<script>
import Toolbar from "./components/Toolbar";
import router from './router'

export default {
  router,
  name: "CyseDM",
  components: {
    Toolbar: Toolbar,
    //Routerview: router
  },
  data() {
    return {};
  }
};
</script>
