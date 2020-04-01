<template>
  <tr v-if="profile">
    <td>{{ `${profile.firstName} ${profile.lastName}` }}</td>
    <td>{{ staffMember.roles.includes('admin') }}</td>
    <td>{{ staffMember.budget }}</td>
    <td>{{ staffMember.spent }}</td>
    <td>
      <v-dialog v-model="editDialog" width="400">
        <v-btn slot="activator" icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <h3>Edit User {{ `${profile.firstName} ${profile.lastName}` }}</h3>
          </v-card-title>
          <v-form @submit.prevent="update">
            <v-card-text>
              <v-text-field
                v-model="budget"
                label="Budget"
                type="number"
                outline
              ></v-text-field>
              <v-switch
                v-model="roles"
                label="Admin"
                value="admin"
                color="primary"
              ></v-switch>
            </v-card-text>
            <v-card-actions justify-end>
              <v-btn
                class="ma-0 mr-2 text elevation-0"
                :loading="deleteLoading"
                @click="deleteUser"
              >
                Delete
              </v-btn>
              <v-btn
                type="submit"
                class="ma-0 primary elevation-0"
                :loading="updateLoading"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </td>
  </tr>
</template>

<script>
import { db, functions } from '@/firebase'

export default {
  props: {
    staffMember: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      profile: null,
      editDialog: false,
      roles: [],
      budget: 0,
      updateLoading: false,
      deleteLoading: false,
    }
  },

  created() {
    this.getProfile()
    this.roles = this.staffMember.roles
    this.budget = this.staffMember.budget
  },

  methods: {
    async getProfile() {
      const userDoc = await db.doc(`userProfiles/${this.staffMember.id}`).get()
      this.profile = userDoc.data()
    },

    async update() {
      this.updateLoading = true

      await db
        .doc(
          `organizations/${this.$route.params.organizationId}/staff/${this.staffMember.id}`
        )
        .update({
          roles: this.roles,
          budget: this.budget,
          updatedAt: new Date(),
        })

      this.updateLoading = false
      this.editDialog = false
    },

    async deleteUser() {
      this.deleteLoading = true

      const deleteStaffMemberOnCall = functions.httpsCallable(
        'deleteStaffMemberOnCall'
      )

      await deleteStaffMemberOnCall({
        organizationId: this.$route.params.organizationId,
        userId: this.staffMember.id,
      }).catch(err => alert(err.message))

      this.deleteLoading = false
    },
  },
}
</script>

<style></style>
