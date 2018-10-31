<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout align-center justify-space-around>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mt-5">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Forgot password</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <div v-if="resetRes">
                  <v-alert class="mb-3" :value="true" color="success" icon="check_circle" outline>
                    <span class="title">{{resetMsg}}</span>
                  </v-alert>
                </div>
                <v-form @keyup.native.enter="reset()" v-else>
                  <v-text-field
                    v-model="email"
                    prepend-icon="mail"
                    label="Enter your email"
                    type="text"
                    required
                  ></v-text-field>
                  <v-alert
                    v-model="resetErr"
                    dismissible
                    type="error"
                    transition="scale-transition"
                  >{{errMsg}}</v-alert>
                  <v-btn block color="primary" @click="reset()">Reset</v-btn>
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
  name: "Forgot",
  data: () => ({
    resetRes: false,
    resetMsg: "",
    resetErr: false,
    email: null,
    errMsg: ""
  }),
  methods: {
    reset() {
      this.axios({
        method: "post",
        data: {
          email: this.email
        },
        url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/resetpassword`
      })
        .then(res => {
          this.resetRes = true;
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
  }
};
</script>
