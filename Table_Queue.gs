class QueueTable {

  static isQueuing(user_id) {
    return new QueueTable().isQueuing(user_id)
  }

  static insertQueue(user_id) {
    return new QueueTable().insertQueue(user_id)
  }

  static getQueueNumberList() {
    return new QueueTable().getQueueNumberList()
  }

  static getQueueNumber(user_id) {
    return new QueueTable().getQueueNumber(user_id)
  }

  static removeQueue(user_id) {
    return new QueueTable().removeQueue(user_id)
  }

  static getQueueUser(user_id) {
    return new QueueTable().getQueueUser(user_id)
  }

  static getCurrentQueueUser() {
    return new QueueTable().getCurrentQueueUser()
  }

  static getCurrentQueueUserId() {
    return new QueueTable().getCurrentQueueUserId()
  }

  constructor() {
    this.Table = Tamotsu.Table.define(
      {
        sheetName: `Queue`,
      }
    )
  }

  isQueuing(user_id) {
    return this.Table.where(user => user.user_id == user_id).first() != null
  }

  insertQueue(user_id) {
    this.Table.create({
      user_id: `${user_id}`,
      is_accepted: false
    })
    return this.getQueueNumber(user_id)
  }

  getQueueNumberList() {
    return this.Table.all()
  }

  getQueueNumber(user_id) {
    let queue = this.Table.where(user => user.user_id == user_id).first()
    if (queue == null) return 0
    else return queue[`#`]
  }

  removeQueue(user_id) {
    this.Table.where(user => user.user_id == user_id).first().destroy()
  }

  getQueueUser(user_id) {
    return UserTable.getUserByTgId(user_id)
  }

  getCurrentQueueUserId() {
    let queue = this.Table.first()
    if (queue == null) return null
    else return queue.user_id
  }

  getCurrentQueueUser() {
    let user_id = this.getCurrentQueueUserId()
    if (user_id == null) return null
    else return this.getQueueUser(user_id)
  }
}
