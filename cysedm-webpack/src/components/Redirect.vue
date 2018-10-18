<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout align-center justify-space-around>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mt-5">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Welcome {{ naam }}!</v-toolbar-title>
                <v-spacer></v-spacer>                
              </v-toolbar>
              <v-card-text>
                <v-alert :value="true" type="success">Your account has been created successfully.</v-alert><br />
                <v-btn block color="primary" to="/"> Return to loginpage </v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "Redirect",
  data() {
    return {
      naam: ""
    };
  },
  created() {
    this.naam = this.$route.params.naam;
  }
};
</script>
