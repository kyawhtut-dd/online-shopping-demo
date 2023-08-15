class AdminTable {

  static getAdmin() {
    return new AdminTable().getAdmin()
  }

  static isUserExistByTgId(tg_id) {
    return new AdminTable().isUserExistByTgId(tg_id)
  }

  constructor() {
    this.Table = Tamotsu.Table.define(
      {
        sheetName: `Admin`,
      },
      {
        fullName: function () {
          return [this[`first_name`], this[`last_name`]].join(` `)
        },
      }
    )
  }

  getAdmin() {
    return this.Table.first()
  }

  isUserExistByTgId(tg_id) {
    tg_id = parseInt(tg_id)
    return this.getUserByTgId(tg_id) != null
  }

  getUserByTgId(tg_id) {
    let user_id = parseInt(tg_id)
    let user = this.Table.where({ user_id }).first()
    return user
  }
}
