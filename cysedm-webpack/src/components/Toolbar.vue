<template>
  <v-toolbar app fixed clipped-left dark color="primary">
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
    <v-toolbar-side-icon v-if="isLoggedIn" @click="toggleDrawer()"></v-toolbar-side-icon>
    <!-- <v-toolbar-side-icon @click.stop="$emit('toggleNav')"></v-toolbar-side-icon> -->
    <a>
      <v-toolbar-title @click="redirect()" class="white--text">CyseDM</v-toolbar-title>
    </a>
    <v-spacer></v-spacer>
    <!-- alert -->
    <v-alert
      style="position: relative; top: 62px;"
      v-model="alertSuccess"
      transition="scale-transition"
      type="success"
      icon="check_circle"
    >You've succesfully logged out!</v-alert>
    <v-alert
      style="position: absolute; top: 62px;"
      v-model="alertFail"
      transition="scale-transition"
      type="error"
      icon="warning"
    >Error logging out: {{err}}!</v-alert>
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
      alertSuccess: false,
      alertFail: false,
      err: "",
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
              setTimeout(() => {
                this.alertSuccess = false;
              }, 2000);
            } catch (err) {
              this.err = err;
              this.alertFail = true;
              setTimeout(() => {
                this.alertFail = false;
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
    ...mapGetters("users", ["isLoggedIn", "currentUser"])
  },
  watch: {},
  methods: {
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
  }
};
</script>
<style>
.subtitle {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>