<template>
  <v-toolbar app fixed clipped-left dark color="primary">
    <v-toolbar-side-icon v-if="isLoggedIn" @click="toggleDrawer()"></v-toolbar-side-icon>
    <!-- <v-toolbar-side-icon @click.stop="$emit('toggleNav')"></v-toolbar-side-icon> -->
      <a><v-toolbar-title @click="redirect()" class="white--text">CyseDM</v-toolbar-title></a>
    <v-spacer></v-spacer>
    
    <!-- alert -->
    <v-snackbar
      top
      multi-line
      color="success"
      timeout="3000"
      v-model="alertSuccess"
    > You've succesfully logged out! </v-snackbar>
    <v-snackbar
      top
      multi-line
      color="error"
      timeout="3000"
      v-model="alertFail"
    > Error logging out! </v-snackbar>

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
              setTimeout(()=>{ this.alertSuccess = false; }, 2000);
            } catch (err) {
              this.err = err;
              this.alertFail = true;
              setTimeout(()=>{ this.alertFail = false; }, 2000);

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
    redirect(){
      if (this.isLoggedIn) {
        this.$router.push('messages');
      } else {
        this.$router.push('/');
      }
    },
    toggleDrawer() {
      this.$eventHub.$emit("toggleDrawer");
    }
  }
};
</script>