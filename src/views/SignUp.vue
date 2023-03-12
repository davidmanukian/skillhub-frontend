<template>
  <v-container fill-height fluid class="backgroundImage">
    <v-row justify="center" style="height:90vh" class="mt-5">
      <v-col cols="auto" class="fill-height d-flex  flex-column justify-center align-center">
        <v-card rounded="5" width="400" fill-height elevation="1">
          <v-card-title>
            <v-row justify="center" class="mt-2">
              <v-col cols="auto">
                <p class="text-h4">SIGN UP</p>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="mt-2">
            <v-form v-model="signUpForm" ref="form">
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field v-model="firstName"
                                :rules="[rules.required, rules.count]"
                                type="text"
                                variant="outlined"
                                density="comfortable"
                                label="First Name"></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field v-model="lastName"
                                :rules="[rules.required, rules.count]"
                                type="text"
                                variant="outlined"
                                density="comfortable"
                                label="Last Name"></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field v-model="username"
                                :rules="[rules.required, rules.count]"
                                type="text"
                                hide-details
                                variant="outlined"
                                density="comfortable"
                                label="Username"></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    variant="outlined"
                    :append-inner-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordShow ? 'text' : 'password'"
                    density="comfortable"
                    :rules="[rules.required, rules.password_count]"
                    label="Password"
                    @click:append-inner="passwordShow = !passwordShow"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-container>
                  <v-row justify="space-between" align-content="center" align="center">

                    <v-col cols="12">
                      <v-btn color="green" @click="signUp" variant="outlined" block>
                        Sign Up
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-snackbar
                    v-model="snackbarForSuccess"
                    location="top"
                    color="success"
                    :timeout="2000"
                  >
                    <v-row justify="center">
                      <p class="text-subtitle-1">Signup successfully</p>
                    </v-row>
                  </v-snackbar>
                </v-container>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import {Ref, ref} from "vue";
import axios from 'axios'
import {Constants} from "@/constants";
import {useRouter} from 'vue-router';

const router = useRouter();

const firstName: Ref<string> = ref<string>("")
const lastName: Ref<string> = ref<string>("")
const username: Ref<string> = ref<string>("")
const password: Ref<string> = ref<string>("")
const passwordShow: Ref<boolean> = ref<boolean>(false)
const signUpForm: Ref<boolean> = ref<boolean>(true)
const snackbarForSuccess: Ref<boolean> = ref<boolean>(false)

const rules = {
  required: (value: string) => !!value || 'Required',
  count: (value: string) => value.length > 3 || 'Must be more 3 characters',
  password_count: (value: string) => value.length > 5 || 'Password must be more than 6 characters',
}

const signUp = () => {
  const isValid = signUpForm.value
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    password: password.value
  }
  if (isValid) {
    console.log(payload)
    axios.post(Constants.URL + "/registration", payload)
      .then(e => {
        snackbarForSuccess.value = true
        router.push("/signin")
      })
  }

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
