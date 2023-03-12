<template>
  <v-row justify="center">
    <v-col cols="6" md="6" xl="5">
      <v-card>
        <v-card-title>
          <p class="text-h5">Assessment creation</p>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                placeholder="Select a person"
                label="Assessment for"
                variant="outlined"
                density="comfortable"
                return-object
                v-model="selectedAssessmentFor"
                :items="assessmentFor"
                item-title="fullName"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :prepend-avatar="item?.raw?.image"
                    :title="item?.raw?.fullName"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-row justify="center">
                <v-col cols="auto">
                  <p class="text-h5" v-if="selectedAssessmentFor === null"> No one is selected</p>
                  <div v-else>
                    <v-row>
                      <v-avatar rounded="0">
                        <v-img cover :src="selectedAssessmentFor.image"></v-img>
                      </v-avatar>
                      <v-list-item
                        :title="selectedAssessmentFor.fullName"
                        :subtitle="selectedAssessmentFor.position"
                      ></v-list-item>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-divider class="mb-2"></v-divider>
            <v-col cols="6">
              <v-autocomplete variant="outlined"
                              placeholder="Select people"
                              label="Assessment people"
                              density="comfortable"
                              v-model="selectedAssessmentPeople"
                              multiple
                              closable-chips
                              :items="assessmentPeople">
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="item.raw.image"
                    :text="item.raw.fullName"
                  ></v-chip>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :prepend-avatar="item?.raw?.image"
                    :title="item?.raw?.fullName"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-row justify="center">
                <v-col cols="auto">
                  <p class="text-h5" v-if="selectedAssessmentPeople.length === 0"> No one is selected</p>
                  <div v-else>
                    <v-row v-for="person of selectedAssessmentPeople" :key="person">
                      <v-avatar rounded="0">
                        <v-img cover :src="person.image"></v-img>
                      </v-avatar>
                      <v-list-item
                        :title="person.fullName"
                        :subtitle="person.position"
                      ></v-list-item>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row justify="end">
            <v-col cols="auto">
              <v-snackbar
                :timeout="2000"
                location="top"
                color="success"
              >
                <template v-slot:activator="{ props }">
                  <v-btn @click="createAssessment" variant="outlined" color="primary" v-bind="props">Create</v-btn>
                </template>
                Assessment was created successfully.
              </v-snackbar>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-card class="mt-5" v-if="pendingAssessments && pendingAssessments.length > 0">
        <v-card-title>
          <p class="text-h5">Pending assessments ({{ pendingAssessments.length }})</p>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-for="pendingAssess of pendingAssessments" :key="pendingAssess" class="mt-2">
          <v-row align-content="center" class="m-0">
            <v-row align-content="center" justify="space-around">
              <v-list>
                <v-list-item>
                  <p class="text-h6"> Assessment For:</p>
                </v-list-item>
                <v-list-item
                  :title="pendingAssess.assessmentFor.firstName + ' ' + pendingAssess.assessmentFor.lastName"
                  :subtitle="pendingAssess.assessmentFor.position"
                ></v-list-item>
              </v-list>
              <v-list>
                <v-list-item>
                  <p class="text-h6">Assessment People:</p>
                </v-list-item>
                <v-list-item v-for="assessmentPeople of pendingAssess.assessmentPeople" :key="assessmentPeople">
                  <v-list-item :style="assessmentPeople.status === 'PENDING' ? 'color: red' : 'color: green'"
                               :title="assessmentPeople.firstName + ' ' + assessmentPeople.lastName"
                               :subtitle="assessmentPeople.position">
                  </v-list-item>
                </v-list-item>
              </v-list>
            </v-row>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref, watch} from "vue";
import axiosAuth from "@/axios-auth";

interface AssessmentProfile {
  id: number,
  image: string,
  previewImage: object,
  username: string,
  position: string,
  fullName: string
  team: string,
  about: string,
  status: string
}

interface PendingAssessment {
  assessmentFor: AssessmentProfile,
  assessmentPeople: AssessmentProfile[],
}

const images = {
  0: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  1: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
  2: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
  3: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
  4: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
  5: 'https://cdn.vuetifyjs.com/images/lists/6.jpg',
}

const assessmentFor: Ref<AssessmentProfile[]> = ref<AssessmentProfile[]>([]);
const selectedAssessmentFor = ref(null);

const assessmentPeople: Ref<AssessmentProfile[]> = ref<AssessmentProfile[]>([]);
const selectedAssessmentPeople: Ref<AssessmentProfile[]> = ref<AssessmentProfile[]>([]);

const pendingAssessments: Ref<PendingAssessment[]> = ref<PendingAssessment[]>([])

onMounted(() => {
  fetchAllProfiles()
  fetchAllCreatedAssessment()
})

watch(selectedAssessmentFor, (newSelected, oldSelected) => {
  if (oldSelected) {
    assessmentPeople.value.push(oldSelected)
  }
  if (newSelected) {
    assessmentPeople.value = assessmentPeople.value.filter(e => {
      return e.username !== newSelected.username
    })
    selectedAssessmentPeople.value = []
  }
})

const fetchAllProfiles = () => {
  axiosAuth.get("/profile/all")
    .then(e => {
      for (const profile of e.data) {
        profile.previewImage = JSON.parse(JSON.stringify(profile.image));
        if (profile.image && profile.image.data) {
          profile.image = 'data:' + profile.image.type + ';base64,' + profile.image.data
        }
        profile.fullName = profile.firstName + ' ' + profile.lastName
        assessmentFor.value.push(profile)
        assessmentPeople.value.push(profile)
      }
    })
}

const fetchAllCreatedAssessment = () => {
  axiosAuth.get("/assessment/all")
    .then(e => {
      pendingAssessments.value = e.data
      fetchEmployeeEvaluation(pendingAssessments.value)
    })
}

const fetchEmployeeEvaluation = (pendingAssessments: PendingAssessment[]) => {
  axiosAuth.get("/employee/evaluation/all")
    .then(e => {
        for (const pendingAssessment of pendingAssessments) {
          for (const assessmentPeople of pendingAssessment.assessmentPeople) {
            for (const employeeEvaluation of e.data) {
              if (employeeEvaluation.usernameFrom === assessmentPeople.username &&
                employeeEvaluation.assessmentId === pendingAssessment.id) {
                assessmentPeople.status = employeeEvaluation.status
              }
            }
          }
        }

      }
    )
    .catch(e => console.log(e))
}

const createAssessment = () => {
  const assessmentForValueData = selectedAssessmentFor.value;
  const assessmentPeopleValueData = selectedAssessmentPeople.value;

  if (assessmentForValueData && assessmentPeopleValueData) {
    const assessmentForData = assessmentFor.value.filter(e => e.username == assessmentForValueData.username)[0]
    assessmentForData.image = assessmentForData.previewImage
    const assessmentPeopleData = []
    for (const assessmentPeopleOut of assessmentPeople.value) {
      for (const assessmentPeopleIn of assessmentPeopleValueData) {
        if (assessmentPeopleOut.username == assessmentPeopleIn.username) {
          assessmentPeopleOut.image = assessmentPeopleOut.previewImage
          assessmentPeopleData.push(assessmentPeopleOut)
        }
      }
    }

    const data = {assessmentFor: assessmentForData, assessmentPeople: assessmentPeopleData}
    console.log(data)
    axiosAuth.post("/assessment", data)
      .then(e => {
        selectedAssessmentFor.value = null;
        selectedAssessmentPeople.value = []
        fetchAllCreatedAssessment()
      })
      .catch(e => console.log(e))
  }
}

</script>
