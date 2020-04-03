<template>
  <div>
    <Avatar
      class="coach-profile__avatar"
      :src="userProfile.profileImage.thumb_340x340"
      :name="userProfile.firstName + ' ' + userProfile.lastName"
      :certified="userProfile.certified"
      width="170"
    />
    <v-dialog v-if="canEdit" width="500">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on">edit</v-icon>
      </template>

      <v-card>
        <v-card-title class="headline" primary-title>
          Upload a profile image
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <template v-if="!success">
            <croppa
              v-model="myCroppa"
              class="croppa"
              :width="170"
              :height="170"
              :quality="2"
              :prevent-white-space="true"
              :file-size-limit="5242880"
              @file-size-exceed="onFileSizeExceed"
            ></croppa>
            <p class="caption">Click and hold to drag or scroll to zoom</p>

            <v-layout justify-space-between>
              <v-flex>
                <v-btn
                  color="primary"
                  class="ma-0 elevation-0"
                  :loading="loading"
                  @click="uploadCroppedImage"
                >
                  Upload
                </v-btn>
              </v-flex>
            </v-layout>
          </template>
          <template v-else>
            Success! The change will take a minute to update
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Avatar from '@/components/common/Avatar'
import { storage } from '@/firebase'

export default {
  components: {
    Avatar,
  },

  props: {
    userProfile: Object,
    canEdit: Boolean,
  },

  data() {
    return {
      loading: false,
      success: false,
      myCroppa: {},
    }
  },

  methods: {
    uploadCroppedImage() {
      this.loading = true
      const format = 'image/jpeg'

      this.myCroppa.generateBlob(
        blob => {
          if (!blob) {
            this.loading = false
            alert('Must add image')
            return
          }
          const uid = this.$store.state.auth.user.uid
          const metadata = { contentType: format }
          storage
            .ref()
            .child(`userProfileImages/${uid}/profile-image.jpg`)
            .put(blob, metadata)
            .then(() => {
              this.success = true
            })
            .catch(e => alert(e.message))
            .then(() => (this.loading = false))
        },
        format,
        0.8
      )
    },
    onFileSizeExceed() {
      alert('Image is too large, image must be below 5MB')
    },
  },
}
</script>

<style lang="scss">
.preview-image {
  position: relative;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
img[src=''] {
  display: none;
}
.coach-profile__avatar {
  display: inline-block;
  width: 170px;
}
</style>
