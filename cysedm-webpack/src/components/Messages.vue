<template>
  <v-app>
    <v-navigation-drawer app clipped v-model="drawer">
      <v-layout>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Select Recipient</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                id="searchBox"
                autofocus
                label="Search User"
                append-icon="search"
                @click:append="searchUser(search)"
                @keyup.enter="searchUser(search)"
                @keyup.esc="dialog=false"
                v-model="search"
                solo
              ></v-text-field>
              <p v-if="searchMsg.length > 0">{{ searchMsg }}</p>
              <v-list v-if="searchResult.length > 0" two-line>
                <template v-for="(item, index) in searchResult">
                  <v-list-tile :key="index" avatar @click="userSelected = !userSelected">
                    <v-list-tile-avatar>
                      <img :src="item.avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.firstName }} {{ item.lastName }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ item.status }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action v-if="userSelected">
                      <v-icon>check</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn block color="primary" :disabled="!userSelected" flat @click="addUser">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-flex>
          <v-toolbar color="blue lighten-5">
            <v-toolbar-title>Conversations</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = true; focusSearch()" icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list two-line>
            <!-- Template voor repeterend item -->
            <template v-for="(partner, index) in partners">
              <v-list-tile ripple :key="partner.name" avatar @click="getMessages(partner.partner)">
                <v-list-tile-avatar>
                  <img :src="partner.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title
                    class="text-capitalize"
                  >{{ partner.firstName }} {{partner.lastName}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ partner.status }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider inset :key="index"></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
    <v-content style="font-size: 15px">
      <div class="chat-container" ref="chatContainer">
        <v-container grid-list-md>
          <v-layout row wrap="">
            <v-flex xs12 v-for="(msg, i) in messages" :key="i">
              <template v-if="i == 0 || newDate(msg.datetime, messages[i-1].datetime)">
                <div class="date">
                  {{getDate(msg.datetime)}}
                  <v-divider></v-divider>
                </div>
              </template>
              <span :class="messageStyle(msg.sender)">
                {{msg.content}}
                <br>
                <em style="font-size: 0.7em">{{getTime(msg.datetime)}}</em>
              </span>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
      <div class="typer">
        <input
          v-if="currentPartner"
          id="msgBox"
          v-model="msgContent"
          @keyup.enter="sendMsg"
          placeholder="Type a message"
          type="text"
        >
        <v-btn
          v-if="currentPartner"
          :disabled="msgContent.length < 1"
          flat
          color="primary"
          class="subheading"
          @click="sendMsg"
        >Send</v-btn>
      </div>
    </v-content>
    <audio id="audio" src="./sounds/notification.mp3"/>
  </v-app>
</template>

<script>
import moment from "moment";
export default {
  name: "Messages",
  data() {
    return {
      window: {
        width: 0,
        height: 0
      },
      isConnected: false,
      partners: [],
      messages: [],
      currentPartner: "",
      debug: false,
      dialog: false,
      drawer: true,
      msgContent: "",
      search: "",
      searchResult: [],
      searchMsg: "",
      userSelected: false
    };
  },
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    message: function(sender) {
      // Notify receiver
      document.getElementById('audio').play();
      // Update current messages if you're staring at the conversation with the sender
      if (this.currentPartner === sender) {
        this.getMessages(sender);
      }
      // Check if this sender is currently in your conversation list. If not, reload that list.
      let inList = false;
      this.partners.forEach(p => {
        if (p.partner === sender) {
          inList = true;
        }
      });
      if (!inList) {
        this.getConversations();
      }
    }
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    focusSearch(){
      setTimeout(()=> {document.getElementById("searchBox").focus()}, 200);
    },
    addUser() {
      if (this.userSelected) {
        let unique = true;
        this.partners.forEach(partner => {
          if (partner.partner === this.searchResult[0].partner) {
            unique = false;
          }
        });
        if (unique) {
          this.partners.unshift(this.searchResult[0]);
        }
      }
      this.userSelected = false;
      this.searchResult = [];
      this.search = "";
      this.searchMsg = "";
      this.dialog = false;
    },
    searchUser(username) {
      if (this.search.length < 1) {
        return
      }
      this.axios({
        method: "GET",
        withCredentials: true,
        url: `http://${
          process.env.VUE_APP_SERVERNAME
        }:3000/api/v1/user/list/${username.toLowerCase()}`
      })
        .then(res => {
          this.searchResult = [];
          this.searchResult.push(res.data);
          this.searchMsg = "";
        })
        .catch(() => {
          this.searchResult = [];
          this.searchMsg = "No users found.";
        });
    },
    // Scroll to last message
    scrollBottom() {
      this.$nextTick(function() {
        var container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    alert() {
      alert("BLA");
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    // ... Send message
    sendMsg() {
      if (this.msgContent.length > 0 && this.currentUser) {
        // Add your sent message to the page without doing another API call

        let dt = new Date();
        let offset = dt.getTimezoneOffset();
        this.messages.push({
          sender: this.currentUser,
          receiver: this.currentPartner,
          content: this.msgContent,
          datetime: moment(dt)
            .add(offset, "m")
            .format("YYYY-MM-DD HH:mm:ss")
        });
        // Clear input field
        let msg = this.msgContent;
        this.msgContent = "";
        this.scrollBottom();
        // Send to DB
        this.axios({
          method: "POST",
          data: {
            content: msg,
            receiver: this.currentPartner
          },
          withCredentials: true,
          url: `http://${
            process.env.VUE_APP_SERVERNAME
          }:3000/api/v1/message/create`
        })
          .then(() => {})
          .catch(err => {
            if (err) {
              return err;
            }
          });
      }
    },
    // Get a list of all the people you have chatted with
    getConversations() {
      this.axios({
        method: "GET",
        withCredentials: true,
        url: `http://${
          process.env.VUE_APP_SERVERNAME
        }:3000/api/v1/message/partners`
      })
        .then(res => {
          this.partners = res.data;
        })
        .catch(err => {
          if (err) {
            return err;
          }
        });
    },
    // Get all the messages for the conversation you just clicked
    getMessages(partner) {
      this.currentPartner = partner;
      this.axios({
        method: "GET",
        withCredentials: true,
        url: `http://${
          process.env.VUE_APP_SERVERNAME
        }:3000/api/v1/message/read/${partner}`
      })
        .then(res => {
          if (this.window.width < 600) {
            this.drawer = false;
          }
          this.messages = res.data;
          document.getElementById("msgBox").focus();
          this.scrollBottom();
        })
        .catch(err => {
          if (err) {
            return err;
          }
        });
    },
    // Add correct message style for either sender or receiver
    messageStyle(sender) {
      let classes = [];
      if (sender === this.currentUser) {
        classes.push("you");
      } else {
        classes.push("partner");
      }
      classes.push("message");
      classes.push("elevation-2");
      return classes;
    },
    newDate(nextDate, currDate) {
      return this.getDate(nextDate) != this.getDate(currDate);
    },
    getDate(datetime) {
      moment.locale("nl");
      var date = new Date();
      let offset = date.getTimezoneOffset();
      let dt = moment(datetime, "YYYY-MM-DD HH:mm:ss");
      return moment(dt)
        .add(-offset, "m")
        .format("l");
    },
    getTime(datetime) {
      moment.locale("nl");
      var date = new Date();
      let offset = date.getTimezoneOffset();
      let dt = moment(datetime, "YYYY-MM-DD HH:mm:ss");
      return moment(dt)
        .add(-offset, "m")
        .format("HH:mm");
    }
  },
  computed: {
    currentUser: function() {
      return this.$store.getters["users/currentUser"].username;
    }
  },
  beforeMount() {
    this.getConversations();
  },
  created() {
    this.$eventHub.$on("toggleDrawer", this.toggleDrawer);
    this.$socket.emit("join", this.currentUser);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    this.$eventHub.$off("toggleDrawer");
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style>
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  padding: 1rem 0rem 0rem 1rem;
  width: 100%;
  background-color: #f2f2f2;
}
.typer input[type="text"] {
  margin-left: auto;
  background-color: white;
  left: 6rem;
  height: 80%;
  padding: 1rem;
  width: 100%;
  border: 1px solid #e8f5e9;
  outline: none;
  border-radius: 1.5em;
  font-size: 1.25rem;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.date {
  color: grey;
  text-align: center;
  padding: 10px;
  font-size: 1em;
}
.message {
  padding: 10px;
  border-radius: 0.5em;
  max-width: 85%;
  font-size: 1.15em;
  word-break: break-all;
  word-wrap: break-word;
}
.partner {
  background-color: #e1f5fe;
  float: left;
}
.you {
  /* color: white; */
  /* background-color: rgb(25, 118, 210); */
  background-color: #e8f5e9;
  float: right;
}
</style>
