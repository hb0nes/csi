<template>
  <v-app>
    <v-content>
      <v-container>
        <v-layout align-center justify-space-around>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 mt-5">
              <v-toolbar dark color="primary">
                <v-toolbar-title v-if="registered">Welcome {{ username }}!</v-toolbar-title>
                <v-toolbar-title v-else>Register</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <div v-if="registered">
                  <!-- <p class="text-xs-center title">Your account has been created successfully.</p> -->
                  <v-alert class="mb-3" :value="true" color="success" icon="check_circle" outline>
                    <span class="title">Your account has been created successfully!</span>
                  </v-alert>
                  <v-btn block color="primary" to="/login">Return to loginpage</v-btn>
                </div>
                <v-form
                  v-model="valid"
                  lazy-validation
                  @keyup.native.enter="valid && register()"
                  v-else
                >
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
                  <v-alert
                    v-model="regErr"
                    dismissible
                    type="error"
                    transition="scale-transition"
                  >{{errMsg}}</v-alert>
                  <v-alert
                    v-model="regRes"
                    dismissible
                    type="success"
                    transition="scale-transition"
                  >Succesfully registered.</v-alert>
                  <v-btn
                    :loading="loading"
                    :disabled="!valid || loading"
                    block
                    color="primary"
                    @click="register"
                  >Register</v-btn>
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
  return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/.test(
    naam
  );
};

export default {
  name: "Register",
  data: () => ({
    loader: null,
    loading: false,
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
    registered: false
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
      !this.$v.firstname.required && errors.push("First name is required.");
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
      !this.$v.lastname.required && errors.push("Last name is required.");
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
  },
  methods: {
    register() {
      this.loader = "loading";
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
        url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/create`
      })
        .then(res => {
          this.loading = false;
          this.regRes = true;
          this.regMsg = res.data;
          this.registered = true;
        })
        .catch(err => {
          this.loading = false;
          this.regErr = true;
          this.errMsg = err.message.toString();
          if (err.response.data) {
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
  // // TODO waarom werkt dit niet?
  // ready() {
  //   window.addEventListener("keyup", function(event) {
  //     // If enter was pressed...
  //     if ((event.which == 13 || event.keyCode == 13) && this.registered) {
  //       this.$router.push("login");
  //     }
  //   });
  // }
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
