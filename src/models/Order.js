import { db } from '@/firebase'

export default class Order {
  coachId
  createdAt
  freeConsultation
  id
  itemId
  lastTransactionAt
  otherParticipant
  participants
  ref
  seekerId
  transactions
  type
  upToDateItem

  constructor(data, uid) {
    Object.assign(this, data)
    this.freeConsultation = this.itemId === 'free-consultation'
    this._getUpToDateItem(uid)
    this._getOtherParticipant(uid)
    this._listenTransactions(uid)
  }

  _getUpToDateItem() {
    if (this.freeConsultation) {
      this.upToDateItem = {
        title: 'Free Consultation',
        type: 'hourly',
      }
    } else {
      db.collection('users')
        .doc(this.coachId)
        .collection('packages')
        .doc(this.itemId)
        .get()
        .then(doc => {
          this.upToDateItem = {
            id: doc.id,
            ...doc.data(),
          }
        })
    }
  }

  _getOtherParticipant(uid) {
    const otherParticipantId = this.participants.find(id => id != uid)
    db.collection('userProfiles')
      .doc(otherParticipantId)
      .get()
      .then(doc => {
        this.otherParticipant = {
          id: doc.id,
          ...doc.data(),
        }
      })
  }

  _listenTransactions(uid) {
    this.ref
      .collection('transactions')
      .where('participants', 'array-contains', uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(query => {
        this.transactions = query.docs.map(doc => {
          return {
            id: doc.id,
            ref: doc.ref,
            ...doc.data(),
          }
        })
      })
  }
}
