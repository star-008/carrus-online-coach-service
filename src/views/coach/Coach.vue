<template>
  <div>
    <Navbar />

    <v-content>
      <div class="coach-land">
        <router-view
          v-if="this.$store.state.auth.user.accountVerified"
        ></router-view>
        <v-container v-else class="text-xs-center">
          <div class="title">
            Thanks for signing up! We will get back to you when we approve your
            account.
          </div>
        </v-container>
      </div>
      <Chat
        v-if="
          this.$store.state.auth.user.accountVerified &&
            $store.getters.features.includes('chat')
        "
      />
    </v-content>
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar'
import Chat from '@/components/common/Chat'

export default {
  components: {
    Chat,
    Navbar,
  },

  data() {
    return {
      drawerLinks: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          route: '/coach/dashboard',
        },
        {
          title: 'My Profile',
          icon: 'account_box',
          route: '/coach/profile',
        },
        {
          title: 'Orders',
          icon: 'dns',
          route: '/coach/orders',
          requiresFeature: 'payments',
        },
        {
          title: 'Open Requests',
          icon: 'description',
          route: '/coach/requests',
          requiresFeature: 'chat',
        },
        { title: 'FAQ', icon: 'comment', route: '/coach/faq' },
        {
          title: 'Settings',
          icon: 'settings',
          route: '/coach/settings',
        },
      ],
    }
  },
}
</script>
