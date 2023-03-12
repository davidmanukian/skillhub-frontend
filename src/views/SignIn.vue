<template>
  <v-container fill-height fluid class="backgroundImage">
    <v-row justify="center" style="height:90vh" class="mt-5">
      <v-col cols="auto" class="fill-height d-flex  flex-column justify-center align-center">
        <v-card rounded="5" width="400" fill-height elevation="1">
          <v-card-title>
            <v-row justify="center" class="mt-2">
              <v-col cols="auto">
                <p class="text-h4">SIGN IN</p>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-2" justify="center">
              <v-col cols="auto">
                <p class="text-subtitle-1">New to Project? <a class="text-subtitle-1" style="text-decoration: none"
                                                              href="#">Sing up</a></p>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="mt-2">
            <v-row class="mt-2" justify="center" v-if="showWrongCredslabel">
              <p class="text-red">Username/Password is incorrect</p>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field type="text"
                              hide-details
                              variant="outlined"
                              density="comfortable"
                              v-model="username"
                              label="Username"></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  :append-inner-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="passwordShow ? 'text' : 'password'"
                  density="comfortable"
                  label="Password"
                  v-model="password"
                  @click:append-inner="passwordShow = !passwordShow"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="auto">
                <v-checkbox density="compact" hide-details label="Remember me"></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-container>
                <v-row justify="space-between" align-content="center" align="center">
                  <v-col cols="auto">
                    <a href="#" class="text-subtitle-1" style="text-decoration: none">Forgot password?</a>
                  </v-col>
                  <v-col cols="6">
                    <v-btn color="primary" @click="signIn" variant="outlined" block>
                      Sign In
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {ref, Ref} from "vue";
import axios from "axios";
import {Constants} from "@/constants";

const router = useRouter();

const passwordShow: Ref<boolean> = ref<boolean>(false);
const showWrongCredslabel: Ref<boolean> = ref<boolean>(false);
const password: Ref<string> = ref<string>("");
const username: Ref<string> = ref<string>("");

const signIn = () => {
  const authPayload = {username: username.value, password: password.value}
  axios.post(Constants.URL + "/authentication", authPayload)
    .then(e => {
      if (e.data.token) {
        console.log(JSON.stringify(e.data.token))
        localStorage.setItem("user", e.data.token);
        localStorage.setItem("username", username.value);
        showWrongCredslabel.value = false;
        router.push("/")
      }
    }).catch(e => {
    console.log("error" + JSON.stringify(e))
    showWrongCredslabel.value = true

  })
}
</script>

<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.backgroundImage {
  background: url('../assets/signinImage.jpg');
  background-size: cover;
  height: 100vh;
}
</style>
