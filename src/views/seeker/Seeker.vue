<template>
  <div>
    <Navbar :drawer-links="drawerLinks" />

    <v-content>
      <div class="seeker-land">
        <router-view></router-view>
      </div>
      <Chat v-if="$store.getters.features.includes('chat')" />
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
          route: '/seeker/dashboard',
        },
        {
          title: 'Find a Coach',
          icon: 'people',
          route: '/seeker/coach-list',
        },
        {
          title: 'My Orders',
          icon: 'dns',
          route: '/seeker/orders',
          requiresFeature: 'payments',
        },
        {
          title: 'My Requests',
          icon: 'description',
          route: '/seeker/requests',
          requiresFeature: 'chat',
        },
        { title: 'FAQ', icon: 'comment', route: '/seeker/faq' },
        {
          title: 'Settings',
          icon: 'settings',
          route: '/seeker/settings',
        },
      ],
    }
  },
}
</script>
