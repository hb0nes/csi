<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout align-center justify-space-around>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mt-5">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" lazy-validation @keyup.native.enter="valid && reqFullscreen(); logIn()">
                  <v-text-field
                    v-model="login"
                    :error-messages="loginErrors"
                    prepend-icon="person"
                    label="Username or Email"
                    type="text"
                    required
                    @input="$v.login.$touch()"
                    @blur="$v.login.$touch()"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :error-messages="passwordErrors"
                    prepend-icon="lock"
                    label="Password"
                    type="password"
                    required
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                  ></v-text-field>
                  <v-alert
                    v-model="loginErr"
                    dismissible
                    type="error"
                    transition="scale-transition"
                  >{{errMsg}}</v-alert>
                  <v-alert
                    v-model="loginRes"
                    dismissible
                    type="success"
                    transition="scale-transition"
                  >Succesfully authenticated.</v-alert>
                  <v-btn
                    :loading="loading"
                    :disabled="!valid || loading"
                    block
                    color="primary"
                    @click="reqFullscreen();logIn()"
                  >Login</v-btn>
                </v-form>
                <v-btn dark block color="secondary" to="/forgot">Forgot password</v-btn>
                <v-btn block outline color="primary" to="/register">Register</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  name: "Login",
  validations: {
    login: { required },
    password: { required }
  },
  data: () => ({
    loader: null,
    loading: false,
    valid: true,
    login: "",
    password: "",
    loginRes: false,
    loginMsg: "",
    loginErr: false,
    errMsg: ""
  }),
  computed: {
    loginErrors() {
      let errors = [];
      if (!this.$v.login.$dirty) return errors;
      !this.$v.login.required && errors.push("Login is required.");
      return errors;
    },
    passwordErrors() {
      let errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    }
  },
  methods: {
    reqFullscreen() {
      let app = document.getElementById("app");
      if (app.requestFullscreen) {
        app.requestFullscreen();
      } else if (app.mozRequestFullScreen) {
        app.mozRequestFullScreen();
      } else if (app.webkitRequestFullscreen) {
        app.webkitRequestFullscreen();
      }
    },
    logIn() {
      this.loader = "loading";
      this.$store.commit("users/auth_request");
      this.axios({
        method: "post",
        data: {
          login: this.login,
          password: this.password
        },
        withCredentials: true,
        url: `http://${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/login`
      })
        .then(res => {
          this.loading = false;
          this.$store.commit("users/auth_success", res.data);
          this.loginRes = true;
          this.loginMsg = res.data;
          this.$router.push("messages");
        })
        .catch(err => {
          this.loading = false;
          this.$store.commit("users/auth_error");
          this.loginErr = true;
          this.errMsg = err.message;
          if (err.response) {
            this.errMsg = err.response.data.message;
          }
        });
    }
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 3000);
      this.loader = null;
    }
  }
};
</script>

<!--Loader styles-->
<style>
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
