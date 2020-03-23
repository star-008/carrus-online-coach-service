import { db } from '@/firebase'

export default class Review {
  coachId
  createdAt
  id
  packageOrderId
  rating
  review
  seeker
  seekerId

  constructor(data) {
    Object.assign(this, data)
    this._getSeeker()
  }

  _getSeeker() {
    db.collection('userProfiles')
      .doc(this.seekerId)
      .get()
      .then(snapshot => {
        this.seeker = snapshot.data()
      })
  }
}
