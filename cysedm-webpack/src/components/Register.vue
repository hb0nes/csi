<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout align-center justify-space-around>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mt-5">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
               <v-form v-model="valid" lazy-validation @keyup.native.enter="valid && register()">
                 <v-text-field
                    v-model="username"
                    :error-messages="usernameErrors"
                    prepend-icon="person" 
                    label="Username"
                    type="text"
                    required
                    @input="$v.username.$touch()"
                    @blur="$v.username.$touch()"
                    ></v-text-field>

                 <v-text-field
                    v-model="firstname"
                    :error-messages="firstnameErrors"
                    prepend-icon="undo" 
                    label="First name"
                    type="text"
                    required
                    @input="$v.firstname.$touch()"
                    @blur="$v.firstname.$touch()"
                    ></v-text-field>

                 <v-text-field
                    v-model="lastname"
                    :error-messages="lastnameErrors"
                    prepend-icon="redo" 
                    label="Last name"
                    type="text"
                    required
                    @input="$v.lastname.$touch()"
                    @blur="$v.lastname.$touch()"
                    ></v-text-field>

                 <v-text-field
                    v-model="email"
                    :error-messages="emailErrors"
                    prepend-icon="mail_outline" 
                    label="Email"
                    type="text"
                    required
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                    ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :error-messages="passwordErrors"
                    prepend-icon="done"
                    label="Password" 
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
                  <v-alert v-model="regErr" dismissible type="error" transition="scale-transition"> {{errMsg}} {}</v-alert>
                  <v-alert v-model="regRes" dismissible type="success" transition="scale-transition"> Succesfully registered. </v-alert>
                  <v-btn :disabled="!valid" block color="primary" @click="register"> Register </v-btn>
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
  maxLength,
  minLength,
  alphaNum,
  alpha,
  email
} from "vuelidate/lib/validators";

const isValidName = naam => {
  // Robert-Jan Buddenböhmer, N'tongabubu'ltnang, Pum Jr., Håvard Bøkko en Jan Železný moeten ook kunnen registreren
  return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/.test(naam);  
};

export default {
  name: "Register",
  data: () => ({
    valid: true,
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    regRes: false,
    regMsg: "",
    regErr: false,
    errMsg: "",
    debug: ""
  }),
  validations: {
    username: { required, maxLength: maxLength(12), alphaNum },
    firstname: { required, isValidName, maxLength: maxLength(40), alpha },
    lastname: { required, isValidName, maxLength: maxLength(40), alpha },
    email: { required, email },
    password: { required, minLength: minLength(8), alphaNum },
    confirmpassword: { required, sameAsPassword: sameAs("password") }
  },
  computed: {
    usernameErrors() {
      let errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.maxLength &&
        errors.push("Username must be at most 12 characters long");
      !this.$v.username.required && errors.push("Username is required.");
      !this.$v.username.alphaNum &&
        errors.push("Username must be alphanumeric.");
      return errors;
    },
    firstnameErrors() {
      let errors = [];
      if (!this.$v.firstname.$dirty) return errors;
      !this.$v.firstname.maxLength &&
        errors.push("Name must be at most 40 characters long");
      !this.$v.firstname.required && errors.push("Firstname is required.");
      !this.$v.firstname.isValidName &&
        errors.push("Firstname contains illegal characters");
      return errors;
    },
    // TODO Possible duplicate code. Maybe same function as above, with field as param
    lastnameErrors() {
      let errors = [];
      if (!this.$v.lastname.$dirty) return errors;
      !this.$v.lastname.maxLength &&
        errors.push("Name must be at most 40 characters long");
      !this.$v.lastname.required && errors.push("Lastname is required.");
      !this.$v.lastname.isValidName &&
        errors.push("Lastname contains illegal characters");
      return errors;
    },
    emailErrors() {
      let errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Enter a valid email addres");
      !this.$v.email.required && errors.push("Email is required.");
      return errors;
    },
    passwordErrors() {
      let errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must be at least 8 characters long");
      !this.$v.email.required && errors.push("Password is required.");
      return errors;
    },
    confirmErrors() {
      let errors = [];
      if (!this.$v.confirmpassword.$dirty) return errors;
      !this.$v.confirmpassword.sameAsPassword &&
        errors.push("Passwords must me identical");
      !this.$v.confirmpassword.required &&
        errors.push("Confirming password is required.");
      return errors;
    }
  },
  methods: {
    register() {
      this.axios({
        method: "post",
        data: {
          username: this.username,
          firstName: this.firstname,
          lastName: this.lastname,
          email: this.email,
          password: this.password
        },
        withCredentials: true,
        url: "http://localhost:3000/api/v1/user/create"
      })
        .then(res => {
          this.regRes = true;
          this.regMsg = res.data;
        })
        .catch(err => {
          this.regErr = true;
          this.errMsg = err.message;
          if (err.response.data) {
            this.errMsg = err.response.data.message;
          }
        });
    }
  }
};
</script>
