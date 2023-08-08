class UserTable {

  static isUserExistByTgId(tg_id) {
    return new UserTable().isUserExistByTgId(tg_id)
  }

  constructor() {
    Tamotsu.initialize()
    this.Table = Tamotsu.Table.define(
      {
        sheetName: `User`,
        idColumn: `user_id`,
        autoIncrement: false,
      },
      {
        fullName: function () {
          return [this[`first_name`], this[`last_name`]].join(` `)
        },
        validate: function (on) {
          // on === 'create' or 'update'
          if (on === `create`) {
            if (!this[`user_id`]) {
              this.errors = []
              this[`user_id`] = generateUUID()
            }
          }
        }
      }
    )
  }

  isUserExist(user_id) {
    return this.Table.where((user) => {
      return user.user_id == user_id
    }).first() != null
  }

  isUserExistByTgId(tg_id) {
    return this.Table.where((user) => {
      return user.tg_id == tg_id
    }).first() != null
  }

  getUserByTgId(tg_id) {
    return this.Table.where((user) => {
      return user.tg_id == tg_id
    }).first()
  }

  createOrUpdateUser({ tg_id, user_name, first_name, last_name, shipping_address = null }) {
    let user = this.getUserByTgId(tg_id)

    if (user == null) {
      if (shipping_address == null) shipping_address = ``
      user = this.Table.create({
        tg_id: tg_id,
        user_name: user_name,
        first_name: first_name,
        last_name: last_name,
        shipping_address: shipping_address
      })
    } else {
      user.user_name = user_name
      user.first_name = first_name
      user.last_name = last_name
      if (shipping_address != null) user.shipping_address = shipping_address
      user.save()
    }

    delete user.row_
    delete user.errors

    return user
  }
}
