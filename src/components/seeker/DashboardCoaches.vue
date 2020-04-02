<template>
  <div>
    <v-text-field
      v-model="query"
      placeholder="Search Coaches"
      prepend-inner-icon="search"
      @keydown.enter="searchCoach"
    ></v-text-field>
    <ais-instant-search :index-name="coachIndex" :search-client="searchClient">
      <ais-configure :hits-per-page.camel="12" />
      <ais-hits>
        <AlgoliaCoachItem slot="item" slot-scope="{ item }" :item="item" />
      </ais-hits>
    </ais-instant-search>
    <div class="text-xs-center">
      <v-btn class="ma-0 primary elevation-0" to="/seeker/coach-list">
        View More
      </v-btn>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite'
import AlgoliaCoachItem from '@/components/seeker/AlgoliaCoachItem'

export default {
  components: {
    AlgoliaCoachItem,
  },

  data() {
    return {
      query: '',
      showFiltersMobile: false,
      searchClient: algoliasearch(
        'FT5PF1X9PP',
        'f7fa6e1463cb5dee47a3b3791a277b3a'
      ),
      coachIndex: this.$store.state.coachIndex,
    }
  },

  methods: {
    searchCoach() {
      this.$router.push('/seeker/coach-list?s=' + this.query)
    },
  },
}
</script>
