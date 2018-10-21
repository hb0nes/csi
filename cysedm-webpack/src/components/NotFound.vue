<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout align-center justify-space-around>
            <v-card class="elevation-12 mt-5">
              <v-toolbar dark color="red">
                <v-spacer></v-spacer>
                <v-toolbar-title class="display-1">404</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text class="text-xs-center title font-weight-medium text-uppercase">
                <div>Whoops...</div>
                <div>We couldn't find what you're looking for.</div>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="goback" block color="primary"> Take me back </v-btn>
              </v-card-actions>
            </v-card>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "notFound",
  methods: {
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>
