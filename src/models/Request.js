import { db } from '@/firebase'

export default class Request {
  seeker

  constructor(data) {
    Object.assign(this, data)

    this.getUser()
  }

  getUser() {
    db.collection('userProfiles')
      .doc(this.seekerId)
      .get()
      .then(doc => {
        this.seeker = doc.data()
      })
  }
}
