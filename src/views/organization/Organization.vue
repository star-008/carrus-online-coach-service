<template>
  <div>
    <Navbar :drawer-links="drawerLinks" />

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar'

export default {
  components: {
    Navbar,
  },

  data() {
    return {
      drawerLinks: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          route: {
            name: 'organization-dashboard',
            params: { organizationId: this.$route.params.organizationId },
          },
        },
        {
          title: 'Staff',
          icon: 'people',
          route: {
            name: 'organization-staff',
            params: { organizationId: this.$route.params.organizationId },
          },
        },
      ],
    }
  },

  created() {
    this.$store.commit(
      'organization/setSelectedOrganization',
      this.$route.params.organizationId
    )
  },
}
</script>
