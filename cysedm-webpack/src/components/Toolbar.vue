<template>
  <v-toolbar fill-height app fixed clipped-left dark color="primary">
    <!-- <v-toolbar-side-icon v-if="isLoggedIn && showSide" @click="toggleDrawer()"></v-toolbar-side-icon> -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title text-align="centered">MyProfile</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          
          <template>
            <v-list-tile-content>
              <v-list-tile>
                <v-list-tile-avatar>
                  <img :src="result.avatar" @click="zoomAvatar">
                  <v-spacer></v-spacer>
                </v-list-tile-avatar>
                <v-icon>edit</v-icon>
              </v-list-tile>
              <v-list-tile-title>Credentials</v-list-tile-title>
              {{result.firstName}}
              <br>
              {{result.lastName}}
              <br>
              {{result.avatar}}
              <br>
              {{result.status}}
              <v-list-tile-title>Change password</v-list-tile-title>
              <v-text-field
                id="searchBox"
                v-model="search"
                label="Old password"
              ></v-text-field>
              <!--<v-text-field
                @keyup.enter="changePw(oldPw,newPw1,newPw2)"
                id="searchBox2"
                label="New password"
                v-model="search"
                
              ></v-text-field>
              <v-text-field
                @keyup.enter="changePw(oldPw,newPw1,newPw2)"
                id="searchBox3"
                
                label="Retype new password"
                v-model="search"
                
              ></v-text-field>-->
            </v-list-tile-content>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-tooltip open-delay="350" close-delay="100" right>
      <v-btn
        icon
        large
        @click="toggleDrawer()"
        slot="activator"
        v-if="isLoggedIn && showSide"
      >
        <v-icon medium>library_books</v-icon>
      </v-btn>
      <span>Current conversations.</span>
    </v-tooltip>
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

      dialog: false,
      result: {},
      oldPw: "",
      newPw1: "",
      newPw2: "",

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
              setTimeout(() => {
                this.alertSuccess = false;
              }, 2000);
            } 
          }
        },
        {
          title: "Profile",
          action: () => {
            this.getProfile();
            this.dialog = true;
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters("users", ["isLoggedIn", "currentUser"]),
    showName() {
      return (
        this.currentPartner.firstName &&
        this.currentPartner.firstName.length > 0 &&
        !this.showTitle
      );
    }
  },
  created() {
    this.$eventHub.$on("currentPartner", this.changePartner);
    this.$eventHub.$on("loggedIn", this.setLoggedIn);
  },
  methods: {
    setLoggedIn(name) {
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
    },
    getProfile() {
      this.axios({
        method: "GET",
        withCredentials: true,
        url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/profile`
      })
        .then(res => {
          this.result = res.data;
        })
        .catch(() => {
          this.result = {};
        });
    },
    changePw(oldPw, newPw1, newPw2) {
      if (oldPw.length < 1 || newPw1.length < 1 || newPw2.length < 1) {
        return;
      } else if (newPw1 !== newPw2) {
        return;
      } else {
        this.axios({
          method: "PUT",
          withCredentials: true,
          url: `${
            process.env.VUE_APP_SERVERNAME
          }:3000/api/v1/user/changePw/oldPw/newPw1`
        });
      }
      (this.oldPw = ""), (this.newPw1 = ""), (this.newPw2 = "");
    }
  },
  beforeDestroy() {
    this.$eventHub.$off("currentPartner");
    this.$eventHub.$off("loggedIn");
  },
  watch: {
    $route() {
      this.currentPartner = "No conversation selected.";
      this.showTitle = this.$route.path !== "/messages";
      this.showSide = this.$route.path === "/messages";
    }
  }
};
</script>
<style>
.subtitle {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>