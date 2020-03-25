<template>
  <v-card>
    <v-card-text>
      <v-form ref="form" @submit.prevent="save">
        <v-text-field
          v-model="coachPackage.title"
          label="Title"
          :rules="rules.title"
        ></v-text-field>
        <v-textarea
          v-model="coachPackage.description"
          label="Description"
          :rules="rules.description"
        ></v-textarea>
        <v-radio-group
          v-model="coachPackage.type"
          class="mb-3"
          row
          persistent-hint
          :hint="typeHint"
        >
          <v-radio color="primary" label="Hourly" value="hourly"></v-radio>
          <v-radio color="primary" label="Fixed Price" value="fixed"></v-radio>
        </v-radio-group>
        <v-text-field
          v-if="coachPackage.type === 'hourly'"
          v-model="coachPackage.price"
          label="Rate"
          persistent-hint
          hint="Your hourly rate in USD"
          type="number"
          :rules="rules.price"
        ></v-text-field>
        <v-layout v-else-if="coachPackage.type === 'fixed'">
          <v-text-field
            v-model="coachPackage.price"
            class="mt-0"
            label="Price"
            persistent-hint
            hint="The Full Price of Your Package in USD."
            type="number"
            :rules="rules.price"
          ></v-text-field>
          <v-text-field
            v-model="coachPackage.numSessions"
            class="mt-0"
            label="Number of Sessions"
            persistent-hint
            hint="Total Number of Sessions Included in the Package"
            type="number"
            :rules="rules.numSessions"
          ></v-text-field>
        </v-layout>
        <v-btn
          type="submit"
          color="primary"
          depressed
          class="mt-2 ma-0"
          :loading="loading"
        >
          Save
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/firebase'

export default {
  props: ['coachPackageProp'],

  data() {
    return {
      coachPackage: null,
      rules: {
        title: [v => !!v || 'Title is required'],
        description: [v => !!v || 'Description is required'],
        price: [v => v >= 1 || 'Price is required'],
        numSessions: [v => v >= 1 || 'Number of sessions is required'],
      },
      loading: false,
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    typeHint() {
      if (this.coachPackage.type === 'hourly') {
        return 'Clients will be able to purchase one hour of coaching at a time. They can always purchase another hour at any point.'
      } else if (this.coachPackage.type === 'fixed') {
        return 'Clients will be able to purchase a package of any number of sessions.'
      }

      return ''
    },
  },

  created() {
    const coachPackage = {
      title: (this.coachPackageProp && this.coachPackageProp.title) || '',
      type: (this.coachPackageProp && this.coachPackageProp.type) || 'hourly',
      description:
        (this.coachPackageProp && this.coachPackageProp.description) || '',
      price: (this.coachPackageProp && this.coachPackageProp.price) || 0,
      numSessions:
        (this.coachPackageProp && this.coachPackageProp.numSessions) || 0,
      createdAt:
        (this.coachPackageProp && this.coachPackageProp.createdAt) || null,
      id: (this.coachPackageProp && this.coachPackageProp.id) || null,
    }

    this.coachPackage = Object.assign({}, this.coachPackage, coachPackage)
  },

  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true

        const dbPackage = {
          title: this.coachPackage.title,
          type: this.coachPackage.type,
          price: Number(this.coachPackage.price),
          description: this.coachPackage.description,
          createdAt: this.coachPackage.createdAt,
        }

        if (dbPackage.type === 'fixed') {
          dbPackage.numSessions = Number(this.coachPackage.numSessions)
        }

        if (this.coachPackageProp) {
          db.collection('users')
            .doc(this.user.uid)
            .collection('packages')
            .doc(this.coachPackage.id)
            .set(dbPackage)
            .then(() => {
              this.$emit('saved')
            })
            .catch(e => alert(e.message))
            .then(() => {
              this.loading = false
            })
        } else {
          dbPackage.createdAt = new Date()
          db.collection('users')
            .doc(this.user.uid)
            .collection('packages')
            .add(dbPackage)
            .then(() => {
              this.$emit('saved')
            })
            .catch(e => alert(e.message))
            .then(() => {
              this.loading = false
            })
        }
      }
    },
  },
}
</script>

<style></style>
