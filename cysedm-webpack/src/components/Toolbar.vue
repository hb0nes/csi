<template>
  <v-toolbar fill-height app fixed clipped-left dark color="primary">
    <v-toolbar-side-icon v-if="isLoggedIn && showSide" @click="toggleDrawer()"></v-toolbar-side-icon>
    <a>
      <v-toolbar-title v-if="showTitle" @click="redirect()" class="white--text">CyseDM</v-toolbar-title>
    </a>
    <v-spacer v-if="showName"></v-spacer>
    <v-avatar size="30" v-if="showName">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-BwYJuj3yyVST5zpsvuLOLJWk26C9uWSk0vE2HbmTKX38j_Wdw"
        alt="avatar"
      >
    </v-avatar>
    <v-toolbar-title
      v-if="showName"
      class="ml-2 white--text text-capitalize"
    >{{ currentPartner.firstName }} {{ currentPartner.lastName }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- alerts -->
    <v-snackbar
      class="title"
      top
      multi-line
      color="success"
      :timeout="timeout"
      v-model="loggedIn"
    >{{loggedInMsg}}</v-snackbar>
    <v-snackbar
      class="title"
      top
      multi-line
      color="success"
      :timeout="timeout"
      v-model="alertSuccess"
    >You've succesfully logged out!</v-snackbar>
    <v-snackbar
      class="title"
      top
      multi-line
      color="error"
      :timeout="timeout"
      v-model="alertFail"
    >Error logging out!</v-snackbar>
    <!-- Logout button -->
    <v-menu v-if="isLoggedIn" offset-y>
      <v-btn flat slot="activator">
        <span>{{ currentUser.username }}</span>
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile v-for="(action, index) in actions" :key="index" @click="action.action">
          <v-list-tile-title>{{ action.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      timeout: 3000,
      alertSuccess: false,
      alertFail: false,
      err: "",
      showTitle: this.$route.path !== "/messages",
      showSide: this.$route.path === "/messages",
      currentPartner: "No conversation selected.",
      loggedIn: false,
      loggedInMsg: "",
      actions: [
        {
          title: "Logout",
          action: () => {
            try {
              this.$store.commit("users/logout");
              this.$router.push("login");
              this.alertSuccess = true;
            } catch (err) {
              this.err = err;
              this.alertFail = true;
            }
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters("users", ["isLoggedIn", "currentUser"]),
    showName(){
      return (this.currentPartner.firstName && this.currentPartner.firstName.length > 0 && !this.showTitle)
    }
  },
  created() {
    this.$eventHub.$on("currentPartner", this.changePartner);
    this.$eventHub.$on("loggedIn", this.setLoggedIn);
  },
  methods: {
    setLoggedIn(name){
      this.loggedIn = true;
      this.loggedInMsg = `Welcome back, ${name}!`;
    },
    changePartner(partner) {
      this.currentPartner = partner;
    },
    redirect() {
      if (this.isLoggedIn) {
        this.$router.push("messages");
      } else {
        this.$router.push("/");
      }
    },
    toggleDrawer() {
      this.$eventHub.$emit("toggleDrawer");
    }
  },
  beforeDestroy() {
    this.$eventHub.$off("currentPartner");
    this.$eventHub.$off("loggedIn");
  },
  watch: {
    $route() {
      this.showTitle = this.$route.path !== "/messages";
      this.showSide = this.$route.path === "/messages";
    }
  }
};
</script>