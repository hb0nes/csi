<template>
  <v-app>
    <v-navigation-drawer width="500" app clipped v-model="drawer">
      <v-layout>
        <v-flex>
          <v-toolbar color="blue lighten-5">
            <v-toolbar-title>Conversations</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
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
              <span :class="messageStyle(msg.sender)">{{msg.content}}</span>
            </v-flex>
            <!-- debug: {{ debug }}  -->
          </v-layout>
        </v-container>
      </div>
      <div class="typer">
        <input v-if="currentPartner"
          id="msgBox"
          v-model="msgContent"
          @keyup.enter="sendMsg"
          placeholder="Type a message"
          type="text"
        >
        <v-btn v-if="currentPartner"
          :disabled="msgContent.length < 1"
          flat
          color="primary"
          class="subheading"
          @click="sendMsg"
        >Send</v-btn>
      </div>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "Messages",
  data() {
    return {
      isConnected: false,
      partners: [],
      messages: [],
      currentPartner: "",
      drawer: true,
      msgContent: ""
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
    // Scroll to last message
    scrollBottom() {
      this.$nextTick(function() {
        var container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    // ... Send message
    sendMsg() {
      if (this.msgContent.length > 0 && this.currentUser) {
        // Add your sent message to the page without doing another API call
        this.messages.push({
          sender: this.currentUser,
          receiver: this.currentPartner,
          content: this.msgContent,
          datetime: ""
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
          url: `http://${process.env.VUE_APP_SERVERNAME}:3000/api/v1/message/create`
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
        url: `http://${process.env.VUE_APP_SERVERNAME}:3000/api/v1/message/partners`
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
        url: `http://${process.env.VUE_APP_SERVERNAME}:3000/api/v1/message/read/${partner}`
      })
        .then(res => {
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
  },
  beforeDestroy() {
    this.$eventHub.$off("toggleDrawer");
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
