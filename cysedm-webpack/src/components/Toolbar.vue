<template>
  <v-toolbar fill-height app fixed clipped-left dark color="primary">
    <!-- <v-toolbar-side-icon v-if="isLoggedIn && showSide" @click="toggleDrawer()"></v-toolbar-side-icon> -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Profile</v-toolbar-title>
        </v-toolbar>
        <v-container fluid grid-list-md>
          <v-speed-dial
          v-model="fab"
          :top="top"
          :bottom="bottom"
          :right="right"
          :left="left"
          :direction="direction"
          :open-on-hover="hover"
          :transition="transition"
        >
          <v-btn v-btn--floating slot="activator" v-model="fab" color="blue darken-2" dark fab @click="showBox()">
            <v-icon>edit</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn fab dark small color="green">
            <v-icon>accept</v-icon>
          </v-btn>
          <v-btn fab dark small color="red">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-speed-dial>
          <v-layout child-flex wrap="">
            <v-flex d-flex xs12 sm6 md6>
              <v-card>
                <div v-if="dropBox" id="picture">
                  <picture-input
                    ref="pictureInput"
                    :width="225"
                    :height="225"
                    :removable="true"
                    removeButtonClass="ui red button"
                    accept="image/jpeg, image/png"
                    buttonClass="ui button primary"
                  ></picture-input>
                </div>
                <div v-else id="picture">
                  <img :src="result.avatar">
                </div>
              </v-card>
            </v-flex>
            <v-flex d-flex xs6 sm6 md6>
              <v-card style="padding: 10px">
                <v-list class="subtitle">Firstname:</v-list>
                <v-list-content>{{result.firstName}}</v-list-content>
                <v-list class="subtitle">Lastname:</v-list>
                <v-list-content>{{result.lastName}}</v-list-content>
                <v-list class="subtitle">Status:</v-list>
                <v-list-content>{{result.status}}</v-list-content>
                <!--<v-text-field label="result.status" @input="$v.oldPw.$touch()"
                @blur="$v.oldPw.$touch()"></v-text-field>-->
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex d-flex xs12 sm12 md12>
              <v-form
                id="form"
                v-model="valid"
                lazy-validation
                @keyup.native.enter="valid && changePw()"
              >
                <v-text-field
                  v-model="oldPw"
                  :error-message="passwordErrors"
                  :timeout="timeout"
                  label="Old Password"
                  type="password"
                  @input="$v.oldPw.$touch()"
                  @blur="$v.oldPw.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="newPw1"
                  :error-messages="passwordErrors"
                  :timeout="timeout"
                  label="New Password"
                  type="password"
                  @input="$v.newPw1.$touch()"
                  @blur="$v.newPw1.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="newPw2"
                  :error-messages="confirmErrors"
                  :timeout="timeout"
                  label="Confim New Password"
                  type="password"
                  sameAsPassword
                  @input="$v.newPw2.$touch()"
                  @blur="$v.newPw2.$touch()"
                ></v-text-field>
                <v-alert
                  v-model="changeErr"
                  dismissible
                  type="error"
                  transition="scale-transition"
                >{{errMsg}}</v-alert>
                <v-alert
                  v-model="changeRes"
                  dismissible
                  type="success"
                  transition="scale-transition"
                >Password successfully changed.</v-alert>
                <v-list-tile>
                  <v-btn :disabled="!valid" block color="primary" @click="changePw">Change Password</v-btn>
                </v-list-tile>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-tooltip open-delay="350" close-delay="100" right>
      <v-btn icon large @click="toggleDrawer()" slot="activator" v-if="isLoggedIn && showSide">
        <v-icon medium>library_books</v-icon>
      </v-btn>
      <span>Current conversations.</span>
    </v-tooltip>
    <a>
      <v-toolbar-title v-if="showTitle" @click="redirect()" class="white--text">CyseDM</v-toolbar-title>
    </a>
    <v-spacer v-if="showName"></v-spacer>
    <v-avatar size="30" v-if="showName">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-BwYJuj3yyVST5zpsvuLOLJWk26C9uWSk0vE2HbmTKX38j_Wdw"
        alt="avatar"
      >
    </v-avatar>
    <v-toolbar-title
      v-if="showName"
      class="ml-2 white--text text-capitalize"
    >{{ currentPartner.firstName }} {{ currentPartner.lastName }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- alerts -->
    <v-snackbar
      class="title"
      top
      multi-line
      color="success"
      :timeout="timeout"
      v-model="loggedIn"
    >{{loggedInMsg}}</v-snackbar>
    <v-snackbar class="title" top multi-line color="success" :timeout="timeout">Error logging out!</v-snackbar>
    <!-- Logout button -->
    <v-menu v-if="isLoggedIn" offset-y>
      <v-btn flat slot="activator">
        <span>{{ currentUser.username }}</span>
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile v-for="(action, index) in actions" :key="index" @click="action.action">
          <v-list-tile-title>{{ action.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import {
  required,
  sameAs,
  minLength,
  alphaNum
} from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import "vue2-dropzone/dist/vue2Dropzone.css";
import PictureInput from "vue-picture-input";
//import { POINT_CONVERSION_COMPRESSED } from 'constants';

export default {
  data() {
    return {
      timeout: 3000,
      alertSuccess: false,
      alertFail: false,
      err: "",
      showTitle: this.$route.path !== "/messages",
      showSide: this.$route.path === "/messages",
      currentPartner: "No conversation selected.",
      loggedIn: false,
      loggedInMsg: "",
      valid: true,
      dialog: false,
      dropBox: false,
      result: {},
      oldPw: "",
      newPw1: "",
      newPw2: "",
      changeRes: false,
      resMsg: "",
      changeErr: false,
      errMsg: "",
      wrongPassword: "",
      errors: "",
      direction: "right",
      fab: false,
      fling: true,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition",
      actions: [
        {
          title: "Logout",
          action: () => {
            try {
              this.$store.commit("users/logout");
              this.$router.push("login");
              this.alertSuccess = true;
            } catch (err) {
              this.err = err;
              this.alertFail = true;
              setTimeout(() => {
                this.alertSuccess = false;
              }, 2000);
            }
          }
        },
        {
          title: "Profile",
          action: () => {
            try {
              this.getProfile();
              this.dialog = true;
            } catch (err) {
              this.err = err;
            }
          }
        }
      ],
      dropOptions: {
        url: "https://httpbin.org/post",
        maxFilesize: 2, // MB
        maxFiles: 4,
        chunking: true,
        chunkSize: 500, // Bytes
        thumbnailWidth: 225, // px
        thumbnailHeight: 225,
        addRemoveLinks: true
      }
    };
  },
  components: {
    PictureInput
  },
  validations: {
    newPw1: { required, minLength: minLength(8), alphaNum },
    newPw2: { required, sameAsPassword: sameAs("newPw1") }
  },
  computed: {
    ...mapGetters("users", ["isLoggedIn", "currentUser"]),
    showName() {
      return (
        this.currentPartner.firstName &&
        this.currentPartner.firstName.length > 0 &&
        !this.showTitle
      );
    },
    passwordErrors() {
      let errors = [];
      if (!this.$v.newPw1.$dirty) return errors;
      !this.$v.newPw1.minLength &&
        errors.push("Password must be at least 8 characters long");
      !this.$v.newPw1.required && errors.push("Password is required.");
      return errors;
    },
    confirmErrors() {
      let errors = [];
      if (!this.$v.newPw2.$dirty) return errors;
      !this.$v.newPw2.sameAsPassword &&
        errors.push("Passwords must be identical");
      !this.$v.newPw2.required &&
        errors.push("Confirming password is required.");
      return errors;
    },
    activeFab() {
      switch (this.tabs) {
        case "one":
          return { class: "purple", icon: "account_circle" };
        case "two":
          return { class: "red", icon: "edit" };
        case "three":
          return { class: "green", icon: "keyboard_arrow_up" };
        default:
          return {};
      }
    }
  },
  created() {
    this.$eventHub.$on("currentPartner", this.changePartner);
    this.$eventHub.$on("loggedIn", this.setLoggedIn);
  },
  methods: {
    onChange(image) {
      console.log("New picture selected!");
      if (image) {
        console.log("Picture loaded.");
        this.image = image;
      } else {
        console.log("FileReader API not supported: use the <form>, Luke!");
      }
    },
    showBox() {
      if (this.dropBox) {
        this.dropBox = false;
      } else {
        this.dropBox = true;
      }
    },
    setLoggedIn(name) {
      this.loggedIn = true;
      this.loggedInMsg = `Welcome back, ${name}!`;
    },
    changePartner(partner) {
      this.currentPartner = partner;
    },
    redirect() {
      if (this.isLoggedIn) {
        this.$router.push("messages");
      } else {
        this.$router.push("/");
      }
    },
    toggleDrawer() {
      this.$eventHub.$emit("toggleDrawer");
    },
    getProfile() {
      this.axios({
        method: "GET",
        withCredentials: true,
        url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/read`
      })
        .then(res => {
          this.result = res.data;
        })
        .catch(() => {
          this.result = {};
        });
    },
    changePw() {
      this.axios({
        method: "PUT",
        withCredentials: true,
        url: `${process.env.VUE_APP_SERVERNAME}:3000/api/v1/user/update/${
          this.oldPw
        }/${this.newPw2}`
      })
        .then(res => {
          this.changeRes = true;
          this.changeMsg = res.data;
        })
        .catch(err => {
          this.changeErr = true;
          this.errMsg = err.response.data.message;
        });
      (this.oldPw = ""), (this.newPw1 = ""), (this.newPw2 = "");
    }
  },
  beforeDestroy() {
    this.$eventHub.$off("currentPartner");
    this.$eventHub.$off("loggedIn");
  },
  watch: {
    $route() {
      this.currentPartner = "No conversation selected.";
      this.showTitle = this.$route.path !== "/messages";
      this.showSide = this.$route.path === "/messages";
    },
    dialog: function(value) {
      if (!value) {
        this.oldPw = "";
        this.newPw1 = "";
        this.newPw2 = "";
      }
    },
    errors: function(value) {
      if (!value) {
        alert(value);
        setTimeout(() => {
          this.errors = [];
          this.changeRes = false;
          this.changeErr = false;
          this.alertSuccess = false;
          this.alertFail = false;
          this.errMsg = "";
        }, 2000);
      }
    },

    top(val) {
      this.bottom = !val;
    },
    right(val) {
      this.left = !val;
    },
    bottom(val) {
      this.top = !val;
    },
    left(val) {
      this.right = !val;
    }
  }
};
</script>
<style>
.subtitle {
  font-size: 1.25rem;
  font-weight: bold;
}
#picture {
  height: 225px;
  width: 225px;
}
</style>