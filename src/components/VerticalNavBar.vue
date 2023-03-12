<template>
  <v-navigation-drawer app>
    <v-list>
      <v-list-item
        prepend-avatar=""
        title="My Lovely Project"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-folder" title="My summary" to="summary"></v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="My team" to="team"></v-list-item>
      <v-list-item prepend-icon="mdi-star" title="Settings"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>

</script>
