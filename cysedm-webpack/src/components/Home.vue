<template>
  <v-navigation-drawer permanent>
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
            <template v-for="(item, index) in users">
                <v-list-tile :key="item.name" avatar @click="placeholder">
                  <v-list-tile-avatar>
                    <img :src="item.avatar">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title> {{ item.name }} </v-list-tile-title>
                    <v-list-tile-sub-title> {{ item.state }} </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              <v-divider inset :key="index"></v-divider>
            </template>
          </v-list>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
  const herman =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-BwYJuj3yyVST5zpsvuLOLJWk26C9uWSk0vE2HbmTKX38j_Wdw";
  export default {
    name: "Home",
    data() {
      return {
        users: [
          {
            avatar: herman,
            name: "Tom Hagen",
            state: "On vacation"
          },
          {
            avatar: herman,
            name: "Hermanos",
            state: "Aan het no(de)-lifen"
          },
          {
            avatar: herman,
            name: "Roberto",
            state: "Aan het no(de)-lifen"
          },
          {
            avatar: herman,
            name: "Arjen",
            state: "Everything secure?"
          },
          {
            avatar: herman,
            name: "Mirjam",
            state: "Soxx en Bailey"
          },
          {
            avatar: herman,
            name: "Pum",
            state: "Tess rules"
          },
          {
            avatar: herman,
            name: "J. Watson",
            state: "Boks ouwe!"
          },
        ]
      };
    },
    methods: {
      placeholder(){
        return;
      }
    }
  };
</script>