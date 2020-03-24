<template>
  <nav>
    <v-toolbar dense flat app color="white" clipped-left>
      <v-toolbar-side-icon
        v-if="showSideIcon"
        @click="drawer = !drawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/">
          <img height="30" :src="logoSrc" />
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="user">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn flat class="hidden-xs-only" v-on="on">
              <template v-if="user.type === 'business'">
                <v-icon class="mr-2">people</v-icon>
                {{ user.companyName }} (Business)
              </template>
              <template v-else>
                <v-icon class="mr-2">person</v-icon>
                {{ user.firstName }} {{ user.lastName }}
              </template>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-tile :to="`/seeker`">
              <v-list-tile-title>
                {{ user.firstName }} {{ user.lastName }}
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="organization in organizations"
              :key="organization.id"
              :to="`/organization/${organization.id}`"
            >
              <v-list-tile-title>{{ organization.name }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="logout()">
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn color="primary" flat to="/login" class="hidden-xs-only">
          Log In
        </v-btn>
        <v-btn
          color="primary"
          class="elevation-0 hidden-xs-only"
          to="/register"
        >
          Sign up
        </v-btn>
      </template>
    </v-toolbar>

    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      class="app-nav-drawer"
      app
      :width="200"
      clipped
    >
      <v-list>
        <v-list-tile class="hidden-sm-and-up">
          <v-menu offset-y dense>
            <template v-slot:activator="{ on }">
              <v-btn class="v-btn--squeeze" flat v-on="on">
                <template v-if="user.type === 'business'">
                  <v-icon class="mr-2">people</v-icon>
                  {{ user.companyName }} (Business)
                </template>
                <template v-else>
                  <v-icon class="mr-2">person</v-icon>
                  {{ user.firstName }} {{ user.lastName }}
                </template>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-tile :to="`/seeker`">
                <v-list-tile-title>
                  {{ user.firstName }} {{ user.lastName }}
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                v-for="organization in organizations"
                :key="organization.id"
                :to="`/organization/${organization.id}`"
              >
                <v-list-tile-title>{{ organization.name }}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logout()">
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-list-tile>
        <v-divider class="hidden-sm-and-up"></v-divider>

        <template v-for="(link, i) in drawerLinks">
          <v-list-tile
            v-if="
              !(
                link.requiresFeature &&
                !$store.getters.features.includes(link.requiresFeature)
              )
            "
            :key="i"
            :to="link.route"
            :href="link.href"
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ link.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>

        <v-divider class="hidden-sm-and-up"></v-divider>
        <v-list-tile class="hidden-sm-and-up" @click="logout()">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Auth from '@/firebase/auth'
import { mapState } from 'vuex'

export default {
  props: {
    drawerLinks: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      logoSrc: require(`@/assets/images/logos/${process.env.VUE_APP_PROJECT}.png`),
      drawer: false,
      query: '',
    }
  },

  computed: {
    ...mapState('organization', ['organizations']),
    user() {
      return this.$store.state.auth.user
    },
    showSideIcon() {
      return (
        this.user && !(this.user.role === 'coach' && !this.user.accountVerified)
      )
    },
  },
  methods: {
    logout() {
      Auth.logOut()
    },

    searchCoach() {
      this.$router.push('/seeker/coach-list?s=' + this.query)
    },
  },
}
</script>

<style lang="scss">
.app-nav-drawer {
  background-color: #f8f8f8 !important;
}
.navbar-search {
  padding: 0.2em 0.5em;
  border-radius: 1em;
  box-shadow: 0 2px 8px -4px rgba(0, 0, 0, 0.4);
  input {
    outline: none;
  }
}
.v-btn--squeeze {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  margin: 0;
  .v-btn__content {
    justify-content: start;
  }
}
</style>
