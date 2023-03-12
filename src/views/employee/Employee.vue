<template>
  <v-row justify="center">
    <v-col cols="auto">
      <v-card
        class="mx-auto"
        min-width="320"
        max-width="344"
      >
        <v-img
          :src="imagePreview ? imagePreview : defaultImage"
          height="300px"
          cover
        >
          <v-card-title>
            <v-btn
              color="white"
              variant="outlined"
              append-icon="mdi-pencil"
              size="small"
              @click="openProfileDialog"
            >
              Edit
            </v-btn>
          </v-card-title>
        </v-img>

        <v-card-title>
          {{ fullName }}
        </v-card-title>

        <v-card-subtitle v-if="position && team" class="mb-3">
          {{ position }} @ {{ team }}
        </v-card-subtitle>

        <v-dialog v-model="editProfileModal" max-width="600">
          <v-card>
            <v-card-title>
              Update Profile
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-file-input label="Photo"
                            prepend-icon="mdi-camera"
                            v-model="image"
                            accept="image/*"
                            @change="selectImage"
                            @click:clear="clearImagePreview">
              </v-file-input>
              <v-img
                :src="image ? imagePreview : defaultImage"
                width="400"
                height="300"
              >
              </v-img>
              <v-text-field class="mt-5" label="Position" prepend-icon="mdi-subtitles"
                            v-model="positionPreview"></v-text-field>
              <v-text-field label="Team" prepend-icon="mdi-account-group" v-model="teamPreview"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row justify="end">
                  <v-btn color="secondary" variant="outlined" @click="editProfileModal = !editProfileModal">
                    Close
                  </v-btn>
                  <v-btn color="primary" variant="outlined" @click="updateProfile">Update</v-btn>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card>
      <v-card class="mt-3" v-if="assessmentsAssigned && assessmentsAssigned.length > 0">
        <v-card-title>Incoming assessment(s) - {{ assessmentsAssigned && assessmentsAssigned.length }}</v-card-title>
        <v-card-text>
          <v-row v-for="assessment of assessmentsAssigned" :key="assessment">
            <v-col cols="12">
              <v-btn variant="text" size="small" class="text-primary"
                     @click="openAssessmentDialog(assessment.usernameFor)">{{ assessment.firstName }}
                {{ assessment.lastName }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-dialog v-model="addAssessmentModal" max-width="600">
          <v-card>
            <v-card-title>Assess Skills</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-3">
              <v-row no-gutters justify="space-between" align="center" v-for="selectedSkill in assessmentsSkills"
                     :key="selectedSkill">
                <v-row no-gutters>

                  <v-col>
                    <p>{{ selectedSkill.name }}</p>
                  </v-col>
                </v-row>
                <v-rating
                  v-model="selectedSkill.score"
                  :item-labels="labels"
                >
                  <template v-slot:item-label="props">
        <span
          class="font-weight-black text-caption"
          :class="`text-${colors[props.index]}`"
        >
          {{ props.label }}
        </span>
                  </template>
                </v-rating>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-row justify="end">
                  <v-btn color="secondary" variant="outlined" @click="addAssessmentModal = false">Close</v-btn>
                  <v-btn color="primary" variant="outlined" @click="completeAssessment(assessmentsSkills)">Complete
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>


      <v-snackbar
        v-model="successfullySubmittedEvaluation"
      >
        Evaluation was successfully submitted
        <template v-slot:actions>
          <v-btn
            color="red"
            variant="text"
            location="top"
            @click="successfullySubmittedEvaluation = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>


    </v-col>
    <v-col xl="3" lg="4" md="4">
      <v-card>
        <v-card-title>
          <v-row justify="space-between" class="mt-1">
            <div class="ml-3">About</div>
            <v-btn variant="outlined"
                   size="small"
                   class="mr-3"
                   append-icon="mdi-pencil"
                   @click="editAboutModal = !editAboutModal"
                   color="primary">
              Edit
            </v-btn>
            <v-dialog v-model="editAboutModal" max-width="600">
              <v-card>
                <v-card-title>About</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-textarea variant="outlined"
                              autofocus
                              auto-grow
                              type="text"
                              v-model.lazy="aboutEdit"
                  >
                  </v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-container>
                    <v-row justify="end">
                      <v-btn color="secondary" variant="outlined" @click="editAboutModal = !editAboutModal">
                        Close
                      </v-btn>
                      <v-btn color="primary" variant="outlined" @click="updateAbout">Update</v-btn>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-card-title>
        <v-card-text class="mt-3">
          {{ about }}
        </v-card-text>

        <v-divider></v-divider>
        <v-card-title class="mt-2">
          <v-row justify="space-between" class="mt-2">
            <div class="ml-3">Skills & Technologies</div>
            <v-btn variant="outlined"
                   size="small"
                   class="mr-3"
                   append-icon="mdi-pencil"
                   @click="openSkillDialog"
                   color="primary">
              Edit
            </v-btn>

            <v-dialog v-model="editSkillsModal" max-width="600">
              <v-card>
                <v-card-title>Select Skills</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="mt-3">
                  <v-row>
                    <v-combobox
                      label="Type a skill"
                      v-model="skill"
                      :items=allAvailableSkills
                      return-object
                      v-on:keyup.enter="addSkill(skill)"
                      open-on-clear
                      @update:modelValue="addSkill(skill)"
                    ></v-combobox>
                  </v-row>
                  <v-row no-gutters justify="space-between" align="center" v-for="selectedSkill in selectedSkillsEdit"
                         :key="selectedSkill" v-if="selectedSkillsEdit.length > 0">
                    <v-row no-gutters>
                      <v-col cols="2">
                        <v-btn
                          size="x-small"
                          color="secondary"
                          variant="outlined"
                          icon
                          @click="removeSkill(selectedSkill.name)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col>
                        <p>{{ selectedSkill.name }}</p>
                      </v-col>
                    </v-row>
                    <v-rating
                      v-model="selectedSkill.score"
                      :item-labels="labels"
                    >
                      <template v-slot:item-label="props">
        <span
          class="font-weight-black text-caption"
          :class="`text-${colors[props.index]}`"
        >
          {{ props.label }}
        </span>
                      </template>
                    </v-rating>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-container>
                    <v-row justify="end">
                      <v-btn color="secondary" variant="outlined" @click="editSkillsModal = false">Close</v-btn>
                      <v-btn color="primary" variant="outlined" @click="updateSkills(selectedSkillsEdit)">Update
                      </v-btn>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-row>
        </v-card-title>
        <v-card-text class="mt-3">
          <v-row class="mt-3">
            <v-chip class="ma-1" v-for="skill in selectedSkills" :key="skill"
                    :class="`text-${colors[skill.score - 1]}`">
              {{ skill.name }}
            </v-chip>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-title class="mt-2">
          <v-row justify="space-between" class="mt-2">
            <div class="ml-3">Licenses & Certifications</div>
            <v-btn variant="outlined"
                   size="small"
                   class="mr-3"
                   append-icon="mdi-pencil"
                   @click="editCertificatesModal = !editCertificatesModal"
                   color="primary">
              Edit
            </v-btn>
            <v-dialog v-model="editCertificatesModal" max-width="600">
              <v-card>
                <v-card-title>
                  Licenses & Certificates
                </v-card-title>
                <v-card-text>

                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row justify="center">
                    <p class="text-subtitle-1">Certificate</p>
                  </v-row>
                  <v-row class="mt-3">
                    <v-col cols="12">
                      <v-text-field label="Name" density="compact"
                                    v-model="certificateName"
                                    placeholder="Add certificate name"
                                    variant="outlined">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <p class="text-subtitle-1">Issue date</p>
                  </v-row>
                  <v-row class="mt-3" justify="space-between">
                    <v-col cols="6">
                      <v-select :items="months" v-model="certificateIssueMonth" variant="outlined" density="compact"
                                label="Month"></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select :items="years" v-model="certificateIssueYear" variant="outlined" density="compact"
                                label="Year"></v-select>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <p class="text-subtitle-1">Expiration date</p>
                  </v-row>
                  <v-row class="mt-3" justify="space-between">
                    <v-col cols="6">
                      <v-select :items="months" v-model="certificateExpirationMonth" variant="outlined"
                                density="compact" label="Month"></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select :items="years" v-model="certificateExpirationYear" variant="outlined" density="compact"
                                label="Year"></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-container>
                    <v-row justify="end">
                      <v-btn color="secondary" variant="outlined" @click="editCertificatesModal = false">Close</v-btn>
                      <v-btn color="primary" variant="outlined" @click="updateCertificate">Update</v-btn>
                    </v-row>
                  </v-container>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-card-title>
        <v-card-text class="mt-3">
          <v-list>
            <v-list-item v-for="cert in certificates" :key="cert" :title="cert.name"
                         :subtitle="cert.issueMonth + ' ' + cert.issueYear + ' - ' + cert.expirationMonth + ' ' + cert.expirationYear">
              <template v-slot:append>
                <v-btn icon size="x-small" @click="removeCertificate(cert)" color="secondary" variant="outlined">
                  <v-icon color="secondary">mdi-close</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import {Ref, ref, watch, toRaw, onMounted} from "vue";
import axiosAuth from "@/axios-auth";
import {useRouter} from 'vue-router';

interface SkillEvaluation {
  name: string,
  score: number,
}

interface Certificate {
  name: string,
  issueMonth: string,
  issueYear: string,
  expirationMonth: string,
  expirationYear: string,
}

const router = useRouter();

const defaultImage = 'https://t4.ftcdn.net/jpg/04/08/24/43/360_F_408244382_Ex6k7k8XYzTbiXLNJgIL8gssebpLLBZQ.jpg';

let id: number = 0;

const fullName: Ref<string> = ref<string>("");

const position: Ref<string> = ref<string>("");
const positionPreview: Ref<string> = ref<string>(position.value);

const team: Ref<string> = ref<string>("");
const teamPreview: Ref<string> = ref<string>(team.value);

const about: Ref<string> = ref<string>("")
const aboutEdit: Ref<string> = ref<string>("")

const skill: Ref<string> = ref<string>("")
const allAvailableSkills: string[] = ['Java', 'Python', 'JavaScript', 'Spring Framework']
const selectedSkillsEdit: Ref<SkillEvaluation[]> = ref<SkillEvaluation[]>([]);
const selectedSkills: Ref<SkillEvaluation[]> = ref<SkillEvaluation[]>([]);

const defaultSkillScore: number = 3;
const colors: string[] = ['red', 'orange', 'grey', 'cyan', 'green']
const labels: number[] = [1, 2, 3, 4, 5]

const certificates: Ref<Certificate[]> = ref<Certificate[]>([])
const certificatesEdit: Ref<Certificate | null> = ref<Certificate | null>(null)
const certificateName: Ref<string> = ref<string>("")
const certificateIssueMonth: Ref<string> = ref<string>("")
const certificateIssueYear: Ref<string> = ref<string>("")
const certificateExpirationMonth: Ref<string> = ref<string>("")
const certificateExpirationYear: Ref<string> = ref<string>("")
const months: Ref<string[]> = ref<string[]>(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
const years: Ref<string[]> = ref<string[]>([
  '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002',
  '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990'])

const editProfileModal: Ref<Boolean> = ref<boolean>(false)
const editAboutModal: Ref<Boolean> = ref<boolean>(false)
const editSkillsModal: Ref<Boolean> = ref<boolean>(false)
const editCertificatesModal: Ref<Boolean> = ref<boolean>(false)

const image = ref("");
const imagePreview = ref(null);

const assessmentsAssigned = ref([])

const addAssessmentModal: Ref<Boolean> = ref<boolean>(false)

const assessmentsSkills: Ref<SkillEvaluation[]> = ref<SkillEvaluation[]>([])

const currentUsername: Ref<string> = ref<string>("")

const successfullySubmittedEvaluation: Ref<boolean> = ref<boolean>(false)

const selectImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return

  const readData = (f: Blob) => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(f)
  })

  imagePreview.value = await readData(file)
}

const clearImagePreview = async () => {
  imagePreview.value = defaultImage
}

const openProfileDialog = () => {
  editProfileModal.value = !editProfileModal.value
  teamPreview.value = team.value;
  positionPreview.value = position.value
}
const updateProfile = () => {
  position.value = positionPreview.value
  team.value = teamPreview.value
  editProfileModal.value = false;
  const localImage = toRaw(image.value)
  axiosAuth.post("/profile", {id: id, position: position.value, team: team.value})

  const formData = new FormData();

  formData.append("file", localImage[0]);
  if (image.value) {
    image.value
    axiosAuth.post("/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}

const updateAbout = () => {
  about.value = aboutEdit.value;
  editAboutModal.value = false;
  axiosAuth.post("/profile", {id: id, about: about.value})
}

const openSkillDialog = () => {
  editSkillsModal.value = true;
  selectedSkillsEdit.value = selectedSkills.value.length > 0 ? selectedSkills.value.slice() : []
}

const updateSkills = (input: SkillEvaluation[]) => {
  const skills = toRaw(input)
  console.log(skills)
  selectedSkills.value = selectedSkillsEdit.value;
  editSkillsModal.value = false;
  axiosAuth.post("/profile", {id: id, skills: selectedSkills.value})
}

const addSkill = (input: string) => {
  console.log(input)
  if (!selectedSkillsEdit.value.map(e => e.name).includes(input)) {
    selectedSkillsEdit.value.push({name: input, score: defaultSkillScore})
    skill.value = "";
  }
}

const removeSkill = (input: string) => {
  console.log(input)
  selectedSkillsEdit.value.splice(selectedSkillsEdit.value.map(e => e.name).indexOf(input), 1)
}

const updateCertificate = () => {
  certificates.value.push({
    name: certificateName.value,
    issueMonth: certificateIssueMonth.value,
    issueYear: certificateIssueYear.value,
    expirationMonth: certificateExpirationMonth.value,
    expirationYear: certificateExpirationYear.value
  })
  certificateName.value = ''
  certificateIssueMonth.value = ''
  certificateIssueYear.value = ''
  certificateExpirationMonth.value = ''
  certificateExpirationYear.value = ''
  editCertificatesModal.value = false;
  axiosAuth.post("/profile", {id: id, certificates: certificates.value})
}

const removeCertificate = (certificate: Certificate) => {
  certificates.value.splice(certificates.value.indexOf(certificate), 1)
  axiosAuth.post("/profile", {id: id, certificates: certificates.value})
}

const fetchAssignedAssessments = () => {
  axiosAuth.get("/employee/evaluation")
    .then(e => {
      console.log(e.data)
      assessmentsAssigned.value = e.data
    })
    .catch(e => console.log(e))
}

const openAssessmentDialog = (usernameFor: string) => {
  console.log(usernameFor)
  assessmentsSkills.value = assessmentsAssigned.value.filter(e => e.usernameFor === usernameFor)[0].skills
  console.log(assessmentsSkills.value)
  addAssessmentModal.value = !addAssessmentModal.value
  currentUsername.value = usernameFor
}

const completeAssessment = (skills: SkillEvaluation[]) => {
  console.log("complete")
  console.log(skills)
  const employeeEvaluation = assessmentsAssigned.value.filter(e => e.usernameFor === currentUsername.value)[0]
  employeeEvaluation.skills = skills
  axiosAuth.put("/employee/evaluation", employeeEvaluation)
    .then(e => {
      addAssessmentModal.value = false;
      successfullySubmittedEvaluation.value = true
      fetchAssignedAssessments();
      recalculateCoefficient();
    })
    .catch(e => console.log(e))
}

const recalculateCoefficient = () => {
  axiosAuth.get("/employee/recalculateCoefficient")
    .then(e => {
      console.log("Recalculated")
    })
    .catch(e => console.log(e))
}

onMounted(() => {
  axiosAuth.get("/profile")
    .then(e => {
      id = e.data.id
      fullName.value = e.data.firstName + " " + e.data.lastName
      about.value = e.data.about
      team.value = e.data.team
      position.value = e.data.position
      if (e.data.image && e.data.image.data) {
        imagePreview.value = 'data:image/jpeg;base64,' + e.data.image.data
      }
      selectedSkills.value = e.data.skills
      selectedSkillsEdit.value = e.data.skills ?? []
      certificates.value = e.data.certificates ?? []
    }).catch(e => {
    console.log(e)
    if (e.message === 'Request failed with status code 403') {
      router.push("/signin")
    }
  })
  fetchAssignedAssessments()
})

</script>
