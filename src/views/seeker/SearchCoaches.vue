<template>
  <ais-instant-search :index-name="coachIndex" :search-client="searchClient">
    <ais-configure :hits-per-page.camel="12" />
    <div class="coaches-page-hero">
      <v-container>
        <v-layout justify-center class="py-4">
          <v-flex xs12 sm6 class="my-5">
            <h1
              class="coaches-page__title white--text font-weight-medium text-xs-center"
            >
              Find a coach
            </h1>
            <ais-search-box placeholder="Job title or keywords" autofocus />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <v-container>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-btn
            flat
            small
            color="primary"
            class="hidden-md-and-up"
            @click="showFiltersMobile = !showFiltersMobile"
          >
            Toggle filters
          </v-btn>
          <v-card
            class="search-coaches-filters elevation-0 border mb-3"
            :class="{ 'd-block': showFiltersMobile }"
          >
            <v-card-text>
              <ais-toggle-refinement
                class="mb-3 ais-ToggleRefinement--solo"
                attribute="freeConsultation"
                label="Free 1 hour coaching session"
              />

              <div class="mb-1">
                <v-icon small class="mr-2">assignment</v-icon>
                Service
              </div>
              <ais-refinement-list attribute="coachingExpertise" searchable />

              <div class="mb-1 mt-4">
                <v-icon small class="mr-2">account_balance</v-icon>
                Industry expertise
              </div>
              <ais-refinement-list attribute="industryExpertise" searchable />

              <div class="mb-1 mt-4">
                <v-icon small class="mr-2">watch</v-icon>
                Timezone
              </div>
              <ais-numeric-menu
                v-if="userOffset"
                attribute="timezone.offset"
                :items="timezoneList"
              />
              <div v-else>
                Please choose your timezone in
                <router-link to="/seeker/settings">settings</router-link>
                &nbsp;to search by timezone difference.
              </div>

              <div class="mb-1 mt-4">
                <v-icon small class="mr-2">language</v-icon>
                Languages
              </div>
              <ais-refinement-list attribute="languages" searchable />

              <div class="mb-1 mt-4">
                <v-icon small class="mr-2">local_atm</v-icon>
                Budget
              </div>
              <ais-numeric-menu attribute="rate" :items="budgetList" />

              <div class="mt-4">
                <v-icon small class="mr-2">more_horiz</v-icon>
                Others
              </div>
              <ais-toggle-refinement
                attribute="certified"
                label="Certified coaches"
              />
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 md9>
          <ais-hits>
            <AlgoliaCoachItem slot="item" slot-scope="{ item }" :item="item" />
          </ais-hits>
          <ais-pagination />
        </v-flex>
      </v-layout>
    </v-container>
  </ais-instant-search>
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
      showFiltersMobile: false,
      searchClient: algoliasearch(
        'FT5PF1X9PP',
        'f7fa6e1463cb5dee47a3b3791a277b3a'
      ),
      interval: null,
      cvAdvice: false,
      searchQuery: '',
      coachIndex: this.$store.state.coachIndex,
    }
  },

  computed: {
    userOffset() {
      return (
        this.$store.state.auth.user.timezone &&
        this.$store.state.auth.user.timezone.offset
      )
    },
    timezoneList() {
      return [
        { label: 'All' },
        {
          label: 'Only in your timezone',
          start: this.userOffset,
          end: this.userOffset,
        },
        {
          label: '± 3 hrs of your timezone',
          start: this.userOffset - 3,
          end: this.userOffset + 3,
        },
        {
          label: '± 6 hrs of your timezone',
          start: this.userOffset - 6,
          end: this.userOffset + 6,
        },
      ]
    },
    budgetList() {
      return [
        { label: 'Any' },
        { label: 'Less than $50/h', end: 50 },
        { label: 'Up to $100/h', end: 100 },
        { label: 'Up to $200/h', end: 200 },
        { label: 'More than $200/h', start: 201 },
      ]
    },
  },

  mounted() {
    this.setConsultationToggle()
    this.setQuery()
  },

  created() {
    this.getURLParams()
  },

  methods: {
    getURLParams() {
      const url = new URL(window.location.href)
      this.cvAdvice = url.searchParams.get('cv_advice')
      this.searchQuery = url.searchParams.get('s')
    },
    setConsultationToggle() {
      if (this.cvAdvice) {
        const interval = setInterval(() => {
          const cvAdviceCheckbox = document.querySelector(
            '.ais-RefinementList-checkbox[value="CV/Resume Advice"]'
          )
          if (cvAdviceCheckbox) {
            cvAdviceCheckbox.click()

            clearInterval(interval)
          }
        }, 100)
      }
    },
    setQuery() {
      if (this.searchQuery) {
        const interval = setInterval(() => {
          const searchBox = document.querySelector('.ais-SearchBox-input')
          if (searchBox) {
            searchBox.value = this.searchQuery
            searchBox.dispatchEvent(new Event('input', { bubbles: true }))

            clearInterval(interval)
          }
        }, 100)
      }
    },
  },
}
</script>

<style lang="scss">
.coaches-page-hero {
  background-image: url('~@/assets/images/bg-img.png');
  background-size: cover;
}

.coaches-page__title {
  text-shadow: 0px 1px 3px #000;
  margin-bottom: 2rem;
}

.ais-SearchBox-form {
  background: white;
  display: flex;
  padding: 7px 12px;
  border-radius: 3px;
}

.ais-SearchBox-submit {
  order: 1;
  flex-shrink: 1;
}

.ais-SearchBox-input {
  margin-left: 12px;
  order: 2;
  flex-grow: 1;
}

.ais-SearchBox-reset {
  order: 3;
}

.ais-SearchBox-submitIcon {
  transform: scale(1.4);
}

.ais-Hits-list {
  padding: 0;
}

.ais-Hits-item {
  display: block;
}

.hit-name {
  margin-bottom: 0.5em;
}
.hit-description {
  color: #888;
  font-size: 0.8em;
  margin-bottom: 0.5em;
}
.ais-RefinementList-list,
.ais-NumericMenu-list {
  list-style-type: none;
}

.ais-Pagination-list {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  list-style-type: none;
}
.ais-Pagination-item {
  text-align: center;
  border: 1px solid #ddd;
  border-right-width: 0;
  &:first-child {
    border-radius: 3px 0 0 3px;
  }
  &:last-child {
    border-right-width: 1px;
    border-radius: 0 3px 3px 0;
  }
  &.ais-Pagination-item--disabled {
    cursor: not-allowed;
  }
}
.ais-Pagination-link {
  display: block;
  background: white;
  min-width: 2.5em;
  padding: 0.5em;
}
.ais-ToggleRefinement {
  margin-top: 0.5rem;
  padding-left: 24px;
  &--solo {
    padding-left: 0;
  }
}
.ais-RefinementList-count,
.ais-ToggleRefinement-count {
  display: none;
}
.search-coaches-filters {
  margin-right: 1rem;
  @media (max-width: 959px) {
    display: none;
    margin-right: 0;
  }
}
</style>
