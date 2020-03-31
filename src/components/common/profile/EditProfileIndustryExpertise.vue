<template>
  <v-dialog v-model="dialog" width="600">
    <v-icon slot="activator">edit</v-icon>

    <v-card>
      <v-card-title class="headline" primary-title>
        Edit industry expertise
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <div class="my-2">
            <v-chip
              v-for="(industry, index) in selectedIndustries"
              :key="index"
              close
              @input="selectedIndustries.splice(index, 1)"
            >
              {{ industry }}
            </v-chip>
          </div>

          <v-menu
            class="edit-industries-menu d-block"
            offset-y
            max-height="225px"
            :close-on-content-click="false"
          >
            <v-text-field
              slot="activator"
              v-model="industryFilter"
              append-icon="search"
              placeholder="Search industries"
              clearable
              :error-messages="selectedIndustryErrors"
              @change="$v.selectedIndustries.$touch()"
              @blur="$v.selectedIndustries.$touch()"
            ></v-text-field>
            <v-list>
              <v-list-tile
                v-for="(industry, index) in filteredIndustries"
                :key="index"
                @click="toggleIndustry(industry)"
              >
                <v-list-tile-action>
                  <v-checkbox
                    :value="selectedIndustries.includes(industry)"
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-title>{{ industry }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-btn
            type="submit"
            depressed
            color="primary"
            class="ma-0"
            :loading="loading"
          >
            Save
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '@/firebase'
import industries from '@/assets/js/industries.json'
import { required } from 'vuelidate/lib/validators'

export default {
  props: ['userProfileProp'],

  data() {
    return {
      dialog: false,
      loading: false,
      industries: industries,
      industryFilter: '',
      selectedIndustries: [],
      industryExpertiseRules: [
        () =>
          this.selectedIndustries.length > 0 || 'Industry expertise required',
      ],
    }
  },

  validations: {
    selectedIndustries: { required },
  },

  computed: {
    filteredIndustries() {
      return this.industryFilter
        ? this.industries.filter(industry =>
            industry.toLowerCase().includes(this.industryFilter.toLowerCase())
          )
        : this.industries
    },
    selectedIndustryErrors() {
      const errors = []
      const property = this.$v.selectedIndustries
      if (!property.$dirty) return errors
      !property.required && errors.push('Industry expertise is required')
      return errors
    },
  },

  created() {
    this.selectedIndustries = Object.assign(
      [],
      this.selectedIndustries,
      this.userProfileProp.industryExpertise
    )
  },

  methods: {
    toggleIndustry(industry) {
      const indexOfIndustry = this.selectedIndustries.indexOf(industry)
      if (indexOfIndustry >= 0) {
        this.selectedIndustries.splice(indexOfIndustry, 1)
      } else {
        this.selectedIndustries.push(industry)
      }
    },
    save() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true

        db.collection('userProfiles')
          .doc(this.userProfileProp.id)
          .update({
            industryExpertise: this.selectedIndustries,
          })
          .catch(e => alert(e.message))
          .then(() => {
            this.loading = false
            this.dialog = false
          })
      }
    },
  },
}
</script>
