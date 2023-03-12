<template>
  <v-container fluid class="pt-0">
    <v-layout>
      <v-row justify="center">
        <v-col cols="7">
          <v-toolbar color="primary" elevation="3">
            <v-btn variant="text" @click="route('/')">Home</v-btn>
            <v-btn variant="text" @click="route('assessment')">Assessment</v-btn>
            <v-btn variant="text" @click="route('project')">Project</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="signOut">Sign Out</v-btn>
          </v-toolbar>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>

  <router-view></router-view>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';

const router = useRouter();

const signOut = () => {
  localStorage.removeItem("user")
  router.push("/signin")
}

const route = (direction: string) => {
  router.push(direction);
}

</script>

<style>
</style>
