<template>
  <v-app>
    <Toolbar/>
    <Login/>
  </v-app>
</template>

<script>
import Toolbar from "./components/Toolbar";
import Login from "./components/Login";

export default {
  name: "CyseDM",
  components: {
    Toolbar: Toolbar,
    Login: Login
  },
  data() {
    return {};
  }
};
</script>
