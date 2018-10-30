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
                <div v-if="changed">
                  <v-alert class="mb-3" :value="true" color="success" icon="check_circle" outline>
                    <span class="title">{{resetMsg}}</span>
                  </v-alert>
                  <v-btn block color="primary" to="/login">Return to loginpage</v-btn>
                </div>
                <v-form v-model="valid"
                  lazy-validation
                  @keyup.native.enter="valid && confirm()"
                  v-else>
                  <v-text-field
                    v-model="password"
                    :error-messages="passwordErrors"
                    prepend-icon="lock"
                    label="New Password"
                    type="password"
                    required
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                  ></v-text-field>
                  <v-text-field
                    v-model="confirmpassword"
                    :error-messages="confirmErrors"
                    prepend-icon="done_all"
                    label="Confirm password"
                    type="password"
                    sameAsPassword
                    @input="$v.confirmpassword.$touch()"
                    @blur="$v.confirmpassword.$touch()"
                  ></v-text-field>
                  <v-alert
                    v-model="resetErr"
                    dismissible
                    type="error"
                    transition="scale-transition"
                  >{{errMsg}}</v-alert>
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
import {
  required,
  sameAs,
  minLength,
  alphaNum
} from "vuelidate/lib/validators";

export default {
  name: "Reset",
  data: () => ({
    changed: false,
    valid: true,
    id: "",
    token: "",
    password: "",
    confirmpassword: "",
    resetErr: false,
    errMsg: ""
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
          this.changed = true;
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
  validations: {
    password: { required, minLength: minLength(8), alphaNum },
    confirmpassword: { required, sameAsPassword: sameAs("password") }
  },
  beforeMount() {
    this.id = this.$route.params.id;
    this.token = this.$route.params.token;
  },
  computed: {
    passwordErrors() {
      let errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must be at least 8 characters long");
      !this.$v.password.required && errors.push("Password is required.");
      return errors;
    },
    confirmErrors() {
      let errors = [];
      if (!this.$v.confirmpassword.$dirty) return errors;
      !this.$v.confirmpassword.sameAsPassword &&
        errors.push("Passwords must be identical");
      !this.$v.confirmpassword.required &&
        errors.push("Confirming password is required.");
      return errors;
    }
  }
};
</script>
