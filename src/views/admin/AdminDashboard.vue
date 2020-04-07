<template>
  <v-container>
    <v-tabs fixed-tabs color="transparent" slider-color="primary">
      <v-tab>All Users</v-tab>
      <v-tab>Coaches</v-tab>
      <v-tab>Clients</v-tab>

      <v-tab-item>
        <UserTable :items="users" />
      </v-tab-item>

      <v-tab-item>
        <UserTable :items="coaches" />
      </v-tab-item>

      <v-tab-item>
        <UserTable :items="seekers" />
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import { db, rt } from '@/firebase'
import UserTable from '@/components/admin/UserTable'

export default {
  components: {
    UserTable,
  },

  data() {
    return {
      users: [],
      onlineUserIds: [],
    }
  },
  computed: {
    completeUsers() {
      return this.users.map(user => {
        user.online = this.onlineUserIds.includes(user.id)
        return user
      })
    },
    seekers() {
      return this.completeUsers.filter(user => user.role === 'seeker')
    },
    coaches() {
      return this.completeUsers.filter(user => user.role === 'coach')
    },
    unverifiedCoaches() {
      return this.coaches.filter(user => !user.accountVerified)
    },
  },
  created() {
    this.loadUsers()
    this.loadPresence()
  },
  methods: {
    loadPresence() {
      rt.ref('/presence')
        .orderByValue()
        .equalTo(true)
        .on(
          'value',
          snapshot => {
            this.onlineUserIds = Object.keys(snapshot.val())
          },
          () => {
            // console.log(e)
          }
        )
    },
    loadUsers() {
      db.collection('users')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          snapshot => {
            this.users = snapshot.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data(),
              }
            })
          },
          () => {
            // console.log(e)
          }
        )
    },
  },
}
</script>
