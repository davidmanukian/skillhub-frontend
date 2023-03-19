<template>
  <v-row justify="center">
    <v-col cols="6" md="6" xl="5">
      <v-card style="min-height: 500px">
        <v-row justify="end" class="mt-1 mr-1">
          <v-col cols="auto">
            <v-btn color="primary"
                   variant="outlined"
                   @click="openProjectAddingDialog">Create new Project
            </v-btn>
            <v-dialog v-model="newProjectDialog" max-width="600">
              <v-card>
                <v-card-title>
                  Create A New Project
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-text-field label="Name"
                                  v-model="projectName"
                                  prepend-icon="mdi-subtitles"></v-text-field>
                  </v-row>
                  <v-row>
                    <v-combobox
                      prepend-icon="mdi-subtitles"
                      label="Type a skill"
                      v-model="skill"
                      :items=allAvailableSkills
                      return-object
                      v-on:keyup.enter="addSkill(skill)"
                      open-on-clear
                    ></v-combobox>
                  </v-row>
                  <v-row>
                    <div class="text-center" v-for="skill of skills" :key="skill">
                      <v-chip
                        class="ma-2"
                        color="primary"
                        closable
                        @click:close="removeSkill"
                      >
                        {{ skill }}
                      </v-chip>
                    </div>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-container>
                    <v-row justify="end">
                      <v-btn color="secondary" variant="outlined" @click="closeProjectDialog">
                        Close
                      </v-btn>
                      <v-btn color="primary" variant="outlined" @click="createNewProject">Create</v-btn>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row align="center" v-if="projects && projects.length > 0" v-for="project of projects" :key="project">
          <v-col cols="6">
            <v-row justify="center">
              <v-card class="mb-5" min-width="265" max-width="300">
                <v-img cover src="src/assets/project.jpeg" height="200"/>
                <v-card-title>
                  <p class="text-h6">{{ project.name }}</p>
                </v-card-title>
                <v-card-subtitle>
                  <v-row no-gutters>
                  <v-col cols="auto" class="text-center mx-1 my-1" v-for="skill of project.skills" :key="skill">
                    <v-chip color="primary">{{ skill }}</v-chip>
                  </v-col>
                  </v-row>
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    variant="text"
                  >
                    Edit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
          <v-col align-self="start" cols="6">
            <p class="text-h6">Best Matched: Highest Coefficient</p>
            <div v-for="(employee, index) of project.employees" :key="employee.username" class="mt-1">
              <v-chip
                :style="index === 0 ? 'color: #3a86ff' : index === 1 ? 'color: #ffc300' : index === 2 ? 'color: #ff6b6b' : ''">
                {{ employee.coefficient }}
              </v-chip>
              <span
                :style="index === 0 ? 'color: #3a86ff' : index === 1 ? 'color: #ffc300' : index === 2 ? 'color: #ff6b6b' : ''">{{
                  employee.firstName
                }} {{ employee.lastName }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" v-else>
          <v-col cols="auto" style="height: 100px">
            <p class="text-h3">You have no created project yet.</p>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>

import {onMounted, ref, Ref} from "vue";
import axiosAuth from "@/axios-auth";

interface Project {
  name: string
  skills: string[]
  employees: Employee[]
}

interface Employee {
  firstName: string,
  lastName: string,
  username: string,
  coefficient: number
}

const newProjectDialog: Ref<boolean> = ref<boolean>(false)
const projects: Ref<Project[]> = ref<Project[]>([])
const skill: Ref<string> = ref<string>("")
const allAvailableSkills: Ref<string[]> = ref<string[]>(['Java', 'Python', 'JavaScript'])
const skills: Ref<string[]> = ref<string[]>([])
const projectName: Ref<string> = ref<string>("")
const removeSkill = (skill) => {
  console.log(skill)
}

const createNewProject = () => {
  if (projectName.value && skills.value.length > 0) {
    const data = {name: projectName.value, skills: skills.value}
    axiosAuth.post("/project", data)
      .then(e => {
        fetchAllProjects()
        newProjectDialog.value = !newProjectDialog.value
      })
      .catch(e => {
        console.log(e)
      })
  }
}

const closeProjectDialog = () => {
  newProjectDialog.value = !newProjectDialog.value
  skills.value = []
  skill.value = ""
}

const addSkill = (input: string) => {
  if (input && input !== '' && !skills.value.includes(input) && allAvailableSkills.value.includes(input)) {
    skills.value.push(input)
    skill.value = "";
  }
}

const fetchAllProjects = () => {
  axiosAuth.get("/project")
    .then(e => {
      console.log(e.data)
      projects.value = e.data
      for (const project of projects.value) {
        fetchBestMatched(project)
      }
    })
    .catch(e => {
      console.log(e)
    })
}

const fetchBestMatched = (project) => {
  const data = {
    "skills": project.skills
  }
  axiosAuth.post("/employee/perfectMatch", data)
    .then(e => {
      project.employees = e.data
      console.log(e.data)
    })
    .catch(e => console.log(e))
}

const openProjectAddingDialog = () => {
  newProjectDialog.value = !newProjectDialog.value
  fetchAllSkills()
}

const fetchAllSkills = () => {
  axiosAuth.get("employee/skills")
    .then(e => {
      console.log(e.data)
      allAvailableSkills.value = e.data
    })
    .catch(e => console.log(e))
}

onMounted(() => {
  fetchAllProjects()
})

</script>
