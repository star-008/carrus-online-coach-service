<template>
  <v-container class="wrapper--thin">
    <h2 class="font-weight-medium mb-3">My Settings</h2>
    <MySettings />

    <h2 class="font-weight-medium mt-4 mb-3">Organizations</h2>
    <SettingsOrganizations />

    <h2 class="font-weight-medium mt-4 mb-3">Change Password</h2>
    <ChangePassword />
  </v-container>
</template>

<script>
import ChangePassword from '@/components/common/ChangePassword'
import MySettings from '@/components/common/MySettings'
import SettingsOrganizations from '@/components/seeker/SettingsOrganizations'

export default {
  name: 'SeekerSettings',

  components: {
    ChangePassword,
    MySettings,
    SettingsOrganizations,
  },
}
</script>
