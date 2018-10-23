<template>
  <v-toolbar app fixed clipped-left dark color="primary">
    <v-toolbar-side-icon @click="toggleDrawer()"></v-toolbar-side-icon>
    <!-- <v-toolbar-side-icon @click.stop="$emit('toggleNav')"></v-toolbar-side-icon> -->
    <router-link to="/">
      <v-toolbar-title class="white--text">CyseDM</v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>
    
    <!-- alert -->
    <v-alert
      style="position: relative; top: 62px;"
      v-model="alertSuccess"
      transition="scale-transition"
      type="success"
      icon="check_circle"
      dismissible
    >You've succesfully logged out!</v-alert>
    <v-alert
      style="position: absolute; top: 62px;"
      v-model="alertFail"
      transition="scale-transition"
      type="error"
      icon="warning"
      dismissible
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
      actions: [
        {
          title: "Logout",
          action: () => {
            try {
              this.$store.commit("users/logout");
              this.$router.push("login");
              this.alertSuccess = true;
              setTimeout(function(){ this.alertSuccess = false; }, 3000);
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
    ...mapGetters("users", ["isLoggedIn", "currentUser"])
  },
  watch: {

  },
  methods: {
    toggleDrawer() {
      this.$eventHub.$emit("toggleDrawer");
    }
  }
};
</script>