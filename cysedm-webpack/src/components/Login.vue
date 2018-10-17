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
                <v-form v-model="valid" lazy-validation @keyup.native.enter="valid && login()">
                  <v-text-field
                    v-model="username"
                    :error-messages="usernameErrors"
                    prepend-icon="person" 
                    label="Login"
                    type="text"
                    required
                    @input="$v.username.$touch()"
                    @blur="$v.username.$touch()"
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
                  <v-alert v-model="loginErr" dismissible type="error" transition="scale-transition"> {{errMsg}} </v-alert>
                  <v-alert v-model="loginRes" dismissible type="success" transition="scale-transition"> Succesfully authenticated. </v-alert>
                  <v-btn :disabled="!valid" block color="primary" @click="login"> Login </v-btn>
                </v-form>
              <v-btn dark block color="secondary" @click="admintest"> Forgot password </v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
          <p> {{username}} and {{password}} and {{loginMsg}} and {{errMsg}}</p>
          <p> {{debug}} </p>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import {
  required,
  maxLength,
  minLength,
  alphaNum
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  mixins: [validationMixin],
  validations: {
    username: { required, maxLength: maxLength(12), alphaNum },
    password: { required, minLength: minLength(8) }
  },
  data: () => ({
    valid: true,
    username: "",
    password: "",
    loginRes: false,
    loginMsg: "",
    loginErr: false,
    errMsg: "",
    debug: ""
  }),
  computed: {
    usernameErrors() {
      let errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.maxLength &&
        errors.push("Name must be at most 12 characters long");
      !this.$v.username.required && errors.push("Name is required.");
      !this.$v.username.alphaNum &&
        errors.push("Username must be alphanumeric.");
      return errors;
    },
    passwordErrors() {
      let errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must be at least 8 characters long");
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    }
  },
  methods: {
    login() {
      this.axios({
        method: "post",
        data: {
          username: this.username,
          password: this.password
        },
        withCredentials: true,
        url: "http://localhost:3000/api/v1/user/login"
      })
        .then(res => {
          this.loginRes = true;
          this.loginMsg = res.data;
        })
        .catch(err => {
          this.loginErr = true;
          this.errMsg = err.message;
          if (err.response.data) {
            this.errMsg = err.response.data.message;
          }
        });
    },
    admintest() {
      this.axios({
        method: "get",
        withCredentials: true,
        url: "http://localhost:3000/api/v1/admintest"
      })
        .then(res => {
          this.debug = res.data;
        })
        .catch(err => {
          this.debug = err;
        });
    }
  }
};
</script>
