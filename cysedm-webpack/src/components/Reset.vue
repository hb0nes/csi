<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout align-center justify-space-around>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mt-5">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Reset password</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @keyup.native.enter="confirm()">
                  <v-text-field
                    v-model="password"
                    prepend-icon="lock"
                    label="New Password"
                    type="password"
                    required
                  ></v-text-field>
                  <input type="hidden" v-model="id">
                  <input type="hidden" v-model="token">
                  <v-btn block color="primary" @click="confirm()">Confirm</v-btn>
                  <v-alert dismissible type="error" transition="scale-transition"></v-alert>
                </v-form>
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
  name: "Reset",
  data: () => ({
    id: "",
    token: "",
    password: ""
  }),
  methods: {
    confirm() {
      this.axios({
        method: "POST",
        data: {
          password: this.password,
          id: this.id,
          token: this.token
        },
        url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/reset`
      })
        .then(res => {
          this.resetMsg = res.data;
        })
        .catch(err => {
          this.resetErr = true;
          this.errMsg = err.message;
          if (err.response) {
            this.errMsg = err.response.data.message;
          }
        });
    }
  },
  beforeMount() {
    this.id = this.$route.params.id;
    this.token = this.$route.params.token;
  }
};
</script>
