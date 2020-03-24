<template>
  <v-footer height="auto">
    <v-container>
      <v-layout justify-space-between wrap>
        <div>
          <img height="30" class="footer__logo" :src="logoSrc" alt />
          <ul class="footer-links">
            <li v-for="(link, i) in links" :key="i">
              <template v-if="link.to">
                <router-link :to="link.to">{{ link.text }}</router-link>
              </template>
              <template v-else-if="link.href">
                <a :href="link.href">{{ link.text }}</a>
              </template>
            </li>
          </ul>
        </div>
        <div>
          <ul class="footer-links">
            <li v-for="(link, i) in social" :key="i">
              <a :class="link.icon" :href="link.href"></a>
            </li>
          </ul>
        </div>
      </v-layout>
      <v-layout class="my-2 grey--text" justify-space-between wrap>
        <div>Your life is about to change.</div>
        <div>
          © Copyright {{ new Date().getFullYear() }} Carrus.io - All Rights
          Reserved
        </div>
      </v-layout>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      logoSrc: require(`@/assets/images/logos/${process.env.VUE_APP_PROJECT}.png`),
      allLinks: [
        { text: 'About Us', href: 'https://carrus.io/about-us/' },
        { text: 'FAQ', to: '/coach/FAQ', role: 'coach' },
        { text: 'FAQ', href: 'https://carrus.io/general-faq/', role: 'seeker' },
        { text: 'Feedback Form', href: 'https://carrus.io/feedback-form/' },
        { text: 'Privacy Policy', href: 'https://carrus.io/privacy-policy-2/' },
      ],
      social: [
        { icon: 'socicon-facebook', href: 'https://facebook.com' },
        { icon: 'socicon-linkedin', href: 'https://linkedin.com' },
        { icon: 'socicon-twitter', href: 'https://twitter.com' },
      ],
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    links() {
      return this.allLinks.filter(
        link => !(link.role && link.role !== (this.user && this.user.role))
      )
    },
  },
}
</script>

<style lang="scss">
.footer {
  &__logo {
    display: block;
  }
}
.footer-links {
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  > li {
    display: inline-block;
    margin-right: 1rem;
  }
}
</style>
