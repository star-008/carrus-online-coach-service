<template>
  <div v-if="userProfileSearched" class="coach-profile">
    <div class="coach-profile-hero">
      <div
        class="background-image-blur"
        :style="{
          backgroundImage: `url(${userProfile.profileImage.thumb_340x340 ||
            require('@/assets/images/bg-img.png')})`,
        }"
      ></div>
      <v-container class="text-xs-center background-image-content">
        <CoachProfileImage :user-profile="userProfile" :can-edit="canEdit" />
        <h2 v-if="userProfile" class="headline my-2">
          {{ `${userProfile.firstName} ${userProfile.lastName}` }}
        </h2>
        <div>
          <span class="grey--text text--lighten-2">
            {{ userProfile.tagline || 'Edit your tagline' }}
          </span>
          <EditProfileNameTagline
            v-if="canEdit"
            :user-profile-prop="userProfile"
          />
        </div>
        <div class="text-xs-center mt-3">
          <v-btn
            v-if="!canEdit && $store.getters.features.includes('chat')"
            color="primary"
            class="elevation-0 ma-0"
            @click="chatWithCoach()"
          >
            Message {{ userProfile.firstName }}
          </v-btn>
        </div>
        <div class="text-xs-center mt-3">
          <v-dialog width="500">
            <v-btn
              v-if="
                !canEdit &&
                  userProfile.freeConsultation &&
                  $store.getters.features.includes('payments')
              "
              slot="activator"
              color="secondary"
              class="elevation-0 ma-0"
            >
              Free Consultation
            </v-btn>
            <FreeConsultation :coach-id="coachId" />
          </v-dialog>
        </div>
      </v-container>
    </div>

    <v-container class="wrapper--thin">
      <h2 class="mb-2">
        About me
        <EditProfileAboutMe v-if="canEdit" :user-profile-prop="userProfile" />
      </h2>
      <v-card class="elevation-0">
        <v-layout wrap class="coach-profile-stats text-xs-center">
          <v-flex xs6 sm3 class="py-5">
            <div class="title">
              {{ (Math.round(userProfile.rating * 100) / 100).toFixed(2) }}
            </div>
            <Stars class="d-block mt-2" :rating="userProfile.rating" />
          </v-flex>
          <v-flex xs6 sm3 class="py-5">
            <div class="title">{{ userProfile.numRatings }}</div>
            <div class="mt-2 caption">Reviews</div>
          </v-flex>
          <v-flex xs6 sm3 class="py-5">
            <div class="title">{{ userProfile.numSessions }}</div>
            <div class="mt-2 caption">Sessions</div>
          </v-flex>
          <v-flex xs6 sm3 class="py-5">
            <div class="title">${{ userProfile.rate }}</div>
            <div class="mt-2 caption">Hourly rate</div>
          </v-flex>
        </v-layout>
        <v-card-text class="coach-profile-item">
          <div
            v-html="userProfile.description || '<p>Describe yourself</p>'"
          ></div>
          <v-layout wrap justify-space-between class="mt-5">
            <div>
              <v-icon small>watch</v-icon>
              {{ userProfile.timezone.text }}
            </div>
            <div>
              <v-icon small>language</v-icon>
              {{ userProfile.languages && userProfile.languages.join(', ') }}
            </div>
            <div>
              <v-icon v-if="userProfile.freeConsultation" small>check</v-icon>
              <v-icon v-else small>close</v-icon>
              &nbsp;Free 1 hour coaching session
            </div>
          </v-layout>
        </v-card-text>
      </v-card>

      <h2 id="packages" class="mb-2 mt-4">My Coaching Packages</h2>
      <div class="packages-grid">
        <CoachPackage
          v-for="coachPackage in userPackages"
          :key="coachPackage.id"
          class="packages-grid__package"
          :coach-id="coachId"
          :coach-package="coachPackage"
          :can-edit="canEdit"
        />
        <v-card
          v-if="Object.keys(userPackages).length < 3 && canEdit"
          :key="Object.keys(userPackages).length"
          class="elevation-0 d-flex-min align-center justify-center"
        >
          <v-dialog width="400px">
            <v-btn
              id="new-package"
              slot="activator"
              color="primary"
              depressed
              class="ma-0 my-3 shrink"
            >
              New Package
            </v-btn>
            <EditPackage @saved="editPackageDialog = false" />
          </v-dialog>
        </v-card>
      </div>

      <v-card
        v-if="
          $store.getters.features.includes('payments') &&
            canEdit &&
            !user.stripeAccount
        "
        class="my-4 elevation-0"
      >
        <v-card-text>
          <ConnectToStripeButton
            id="connect-to-stripe"
            redirect-path="/coach/profile#connect-to-stripe"
          />
        </v-card-text>
      </v-card>

      <h2 class="mb-2 mt-4">
        Coaching Expertise
        <EditProfileCoachingExpertise
          v-if="canEdit"
          :user-profile-prop="userProfile"
        />
      </h2>
      <p v-if="canEdit">
        Learn more about
        <a href="https://carrus.io/coaching-categories/">coaching categories</a>
        .
      </p>

      <v-card class="elevation-0">
        <v-card-text class="coach-profile-item">
          <v-layout wrap>
            <v-flex
              v-for="category in userProfile.coachingExpertise"
              :key="category"
              xs12
              sm6
            >
              <v-icon small>check</v-icon>
              {{ category }}
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <h2 class="mb-2 mt-4">
        Industry Expertise
        <EditProfileIndustryExpertise
          v-if="canEdit"
          :user-profile-prop="userProfile"
        />
      </h2>
      <v-card class="elevation-0">
        <v-card-text class="coach-profile-item">
          <v-layout wrap>
            <v-flex
              v-for="industry in userProfile.industryExpertise"
              :key="industry"
              xs12
              sm4
            >
              <v-icon small>check</v-icon>
              {{ industry }}
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-layout v-if="canEdit" column align-center class="my-3">
        <div class="mb-2">
          Profile is
          <span v-if="userProfile.public">public</span>
          <span v-else>private</span>
        </div>
        <v-btn
          class="ma-0 elevation-0"
          :class="{
            secondary: userProfile.public,
            primary: !userProfile.public,
          }"
          :disabled="!$store.getters.canPublish"
          @click="togglePublic"
        >
          Make&nbsp;
          <span v-if="userProfile.public">private</span>
          <span v-else>public</span>
        </v-btn>
        <ul class="error--text mt-2">
          <li v-if="!$v.profileComplete.isTrue">
            Profile incomplete
            <ul>
              <li v-for="(field, i) in user.incompleteProfileFields" :key="i">
                {{ field }} required
              </li>
            </ul>
          </li>
          <li v-if="!$v.userProfile.numPackages.required">
            Packages incomplete
          </li>
          <li
            v-if="
              $store.getters.features.includes('payments') &&
                !$v.user.stripeAccount.required
            "
          >
            Payment details not connected
          </li>
        </ul>
      </v-layout>

      <div
        v-if="!canEdit && $store.getters.features.includes('chat')"
        class="coach-profile-make-request my-4 py-5 text-xs-center"
      >
        <div>Looking for a custom plan? Ask the coach directly.</div>
        <v-btn
          dark
          color="red darken-3"
          class="elevation-0 ma-0 mt-4"
          @click="chatWithCoach()"
        >
          Make a request
        </v-btn>
      </div>

      <template v-if="!canEdit">
        <h2 class="mb-2 mt-4">Reviews</h2>
        <template v-if="reviews.length">
          <div v-for="review in reviews" :key="review.id" class="mb-4">
            <v-layout>
              <div class="coach-profile-review__avatar mr-2">
                <Avatar
                  v-if="review.seeker"
                  :name="review.seeker.firstName + ' ' + review.seeker.lastName"
                />
              </div>
              <v-flex>
                <v-card color="grey lighten-2" class="elevation-0">
                  <v-card-text>
                    <div class="mb-2">{{ review.review }}</div>
                    <div class="grey--text">
                      {{ review.createdAt.toDate().toLocaleString() }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </div>
        </template>
        <div v-else class="text-xs-center">
          This user has not received any reviews so far
        </div>
      </template>
    </v-container>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { required } from 'vuelidate/lib/validators'
import Review from '@/models/Review'

import CoachProfileImage from '@/components/coach/CoachProfileImage'
import EditProfileNameTagline from '@/components/common/profile/EditProfileNameTagline'
import EditProfileAboutMe from '@/components/common/profile/EditProfileAboutMe'
import CoachPackage from '@/components/common/CoachPackage'
import EditPackage from '@/components/common/EditPackage'
import ConnectToStripeButton from '@/components/coach/ConnectToStripeButton'
import EditProfileCoachingExpertise from '@/components/common/profile/EditProfileCoachingExpertise'
import EditProfileIndustryExpertise from '@/components/common/profile/EditProfileIndustryExpertise'
import Stars from '@/components/common/Stars'
import Avatar from '@/components/common/Avatar'
import FreeConsultation from '@/components/common/FreeConsultation'

export default {
  components: {
    CoachProfileImage,
    EditProfileNameTagline,
    EditProfileAboutMe,
    CoachPackage,
    EditPackage,
    ConnectToStripeButton,
    EditProfileCoachingExpertise,
    EditProfileIndustryExpertise,
    Stars,
    Avatar,
    FreeConsultation,
  },

  props: ['coachId', 'canEdit'],

  data() {
    return {
      userProfile: {
        coachingExpertise: [],
        description: '',
        firstName: '',
        freeConsultation: false,
        industryExpertise: [],
        languages: [],
        lastName: '',
        numRatings: 0,
        numSessions: 0,
        profileImage: {
          thumb_340x340: null,
        },
        public: false,
        rate: 0,
        rating: 0,
        tagline: '',
        timezone: {
          offset: 0,
          text: '',
        },
      },
      userProfileSearched: false,
      userPackages: [],
      reviews: [],
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    profileComplete() {
      return this.user.profileComplete
    },
  },

  validations() {
    const validations = {
      profileComplete: {
        isTrue: v => v === true,
      },
      userProfile: {
        numPackages: { required },
      },
    }
    if (this.$store.getters.features.includes('payments')) {
      validations.user = {
        stripeAccount: { required },
      }
    }

    return validations
  },

  watch: {
    userProfileSearched: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        const url = new URL(window.location.href)
        const hash = url.hash

        if (hash) {
          this.$nextTick(() => {
            const hashEl = document.querySelector(hash)
            if (hashEl) hashEl.scrollIntoView()
          })
        }
      }
    },
  },

  created() {
    db.collection('users')
      .doc(this.coachId)
      .collection('packages')
      .orderBy('createdAt')
      .onSnapshot(snapshot => {
        this.userPackages = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          }
        })
      })

    db.collection('userProfiles')
      .doc(this.coachId)
      .onSnapshot(snapshot => {
        const data = snapshot.data()
        data.id = this.coachId

        this.userProfile = Object.assign({}, this.userProfile, data)
        this.userProfileSearched = true
      })

    db.collection('users')
      .doc(this.coachId)
      .collection('reviews')
      .orderBy('createdAt', 'desc')
      .get()
      .then(snapshot => {
        this.reviews = snapshot.docs.map(doc => {
          const data = {
            id: doc.id,
            ...doc.data(),
          }
          return new Review(data)
        })
      })
  },

  methods: {
    chatWithCoach() {
      this.$store.dispatch('messageUser', this.coachId)
    },

    togglePublic() {
      db.collection('userProfiles')
        .doc(this.user.uid)
        .update({
          public: !this.userProfile.public,
        })
    },

    scrollTo(hash) {
      document.querySelector(hash).scrollIntoView({ behavior: 'smooth' })
    },
  },
}
</script>

<style lang="scss">
.coach-profile-hero {
  background-size: cover;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.background-image-blur {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.1);
  filter: blur(90px);
}
.background-image-blur ~ .background-image-content {
  z-index: 1;
  position: relative;
}
.packages-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
}
.packages-grid__package {
  grid-column: span 3;
  @media (min-width: 600px) {
    grid-column: span 1;
  }
}
.coach-profile-make-request {
  background: #f7e7e7;
  border-radius: 3px;
}
.coach-profile-stats {
  & > div {
    border-bottom: 1px solid #ddd;
    &:not(:nth-child(even)) {
      border-right: 1px solid #ddd;
    }
    @media (min-width: 600px) {
      &:not(:nth-child(4)) {
        border-right: 1px solid #ddd;
      }
    }
  }
}
.coach-profile-review__avatar {
  min-width: 40px;
}
.coach-profile-item {
  @media (min-width: 600px) {
    padding: 3rem;
  }
}
</style>
