<template>
  <v-card
    slot="item"
    slot-scope="{ item }"
    class="search-coach elevation-0 border mb-4"
  >
    <v-card-text>
      <v-layout wrap justify-center>
        <v-flex xs12 sm1 shrink>
          <div class="search-coach-avatar-container">
            <Avatar
              :src="item.profileImage && item.profileImage.thumb_88x88"
              :name="item.firstName + ' ' + item.lastName"
              :certified="item.certified"
            />
          </div>
        </v-flex>
        <v-flex xs12 sm8>
          <div class="search-coach__name">
            <router-link class="mr-2" :to="'/coach-profile/' + item.objectID">
              {{ item.firstName }} {{ item.lastName }}
            </router-link>
            <span class="mr-2 grey--text">•</span>
            <span class="mr-2 grey--text">{{ item.rating.toFixed(1) }}</span>
            <Stars class="mr-2 grey--text" :rating="item.rating" />
            <span class="grey--text">{{ item.numRatings }} reviews</span>
          </div>
          <div class="grey--text mt-2">{{ item.tagline }}</div>
          <div class="grey--text mt-2">
            <span>
              <v-icon small class="mr-3">watch</v-icon>
              {{ item.timezone.text }}
            </span>
            <span class="mx-2">•</span>
            <span>
              <v-icon small class="mr-3">language</v-icon>
              {{ item.languages.join(', ') }}
            </span>
          </div>
          <div v-truncate class="mt-2" v-html="item.description"></div>
        </v-flex>
        <v-flex xs12 sm3 class="search-coach-actions text-xs-center">
          <div>From ${{ item.rate }} / hour</div>
          <v-btn
            color="primary"
            class="elevation-0"
            :to="'/coach-profile/' + item.objectID"
          >
            View profile
          </v-btn>
          <div class="mt-2">
            <v-icon v-if="item.freeConsultation" small>check</v-icon>
            <v-icon v-else small>close</v-icon>
            &nbsp;Free 1 hour coaching session
          </div>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import Avatar from '@/components/common/Avatar'
import Stars from '@/components/common/Stars'

export default {
  components: {
    Avatar,
    Stars,
  },

  props: ['item'],
}
</script>

<style lang="scss">
.search-coach-avatar-container {
  max-width: 44px;
}
.search-coach__name {
  margin-top: 1rem;
  @media (min-width: 600px) {
    margin-top: 0;
  }
}
.search-coach-actions {
  margin-top: 1rem;
  @media (min-width: 600px) {
    margin-top: 0;
  }
}
</style>
