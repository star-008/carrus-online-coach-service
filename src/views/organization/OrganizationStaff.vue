<template>
  <div>
    <h1 class="mb-3">Staff</h1>

    <table class="staff-table" style="width:100%">
      <tr>
        <th></th>
        <th>Admin</th>
        <th>Budget</th>
        <th>Spent</th>
        <th></th>
      </tr>
      <OrganizationStaffMember
        v-for="staffMember in staffMembers"
        :key="staffMember.id"
        :staff-member="staffMember"
        class="pa-3"
      >
        {{ staffMember }}
      </OrganizationStaffMember>
    </table>

    <v-progress-circular v-if="loading" indeterminate />
  </div>
</template>

<script>
import { db } from '@/firebase'

import OrganizationStaffMember from '@/components/organization/OrganizationStaffMember'

export default {
  components: {
    OrganizationStaffMember,
  },

  data() {
    return {
      staffMembers: [],
      loading: false,
    }
  },

  created() {
    this.loadStaff()
  },

  methods: {
    loadStaff() {
      this.loading = true

      db.collection(
        `organizations/${this.$route.params.organizationId}/staff`
      ).onSnapshot(snap => {
        this.loading = false
        this.staffMembers = snap.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.staff-table {
  td,
  th {
    text-align: left;
  }
}
</style>
