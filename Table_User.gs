class UserTable {

  static isUserExistByTgId(tg_id) {
    return new UserTable().isUserExistByTgId(tg_id)
  }

  static getUserByTgId(tg_id) {
    return new UserTable().getUserByTgId(tg_id)
  }

  constructor() {
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
    return this.getUserById(user_id) != null
  }

  isUserExistByTgId(tg_id) {
    return this.getUserByTgId(tg_id) != null
  }

  getUserByTgId(tg_id) {
    return this.Table.where(user => user.tg_id == tg_id ).first()
  }

  getUserById(user_id) {
    let user = this.Table.where({'user_id': user_id}).first()
    user.fullName = function() {
      return [user[`first_name`], user[`last_name`]].join(` `)
    }
    return user
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
