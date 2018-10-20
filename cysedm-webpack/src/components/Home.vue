<template>
  <v-navigation-drawer v-model="drawer">
    <v-layout row>
      <v-flex>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Conversations</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list three-line>
            <!-- Template voor repeterend item -->
            <template v-for="(item, index) in users">
              <v-divider v-if="item.divider" :inset="item.inset" :key="index"></v-divider>
              <v-list-tile v-else :key="item.name" avatar>
                <v-list-tile-avatar>
                  <img :src="item.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.state"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
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
        { divider: true, inset: true },
        {
          avatar: herman,
          name: "Hermanos",
          state: "Aan het no(de)-lifen"
        },
        { divider: true, inset: true },
        {
          avatar: herman,
          name: "Roberto",
          state: "Aan het no(de)-lifen"
        },
        { divider: true, inset: true },
        {
          avatar: herman,
          name: "Arjen",
          state: "Everything secure?"
        },
        { divider: true, inset: true },
        {
          avatar: herman,
          name: "Mirjam",
          state: "Soxx en Bailey"
        },
        { divider: true, inset: true },
        {
          avatar: herman,
          name: "Pum",
          state: "Tess rules"
        },
        { divider: true, inset: true },
        {
          avatar: herman,
          name: "J. Watson",
          state: "Boks ouwe!"
        },
        { divider: true, inset: true }
      ]
    };
  }
};
</script>