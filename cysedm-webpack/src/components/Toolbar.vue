<template>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <router-link to="/"><v-toolbar-title class="white--text">CyseDM</v-toolbar-title></router-link>
    <v-spacer></v-spacer>
    <v-menu v-if="isLoggedIn" offset-y>
    <v-btn flat slot="activator">
      <span> {{ currentUser.username }} </span>
      <v-icon>arrow_drop_down</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile 
      v-for="(action, index) in actions"
      :key="index"
      @click="action.action"
      >
      <v-list-tile-title> {{ action.title }} </v-list-tile-title>
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
      actions: [
        {
          title: "Logout",
          action: () => {
            this.$store.commit("users/logout");
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters("users", ["isLoggedIn", "currentUser"])
  }
};
</script>