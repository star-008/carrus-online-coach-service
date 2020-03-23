export default class Notification {
  createdAt
  message
  id
  ref
  seenAt
  type

  constructor(data) {
    Object.assign(this, data)
  }

  markAsSeen() {
    this.ref.update({
      seenAt: new Date(),
    })
  }
}
