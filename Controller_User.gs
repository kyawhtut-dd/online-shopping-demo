class UserController {

  static checkUser(request) {
    let user_id = request.user_id
    
    request.response = UserTable.isUserExistByTgId(user_id)

    return request
  }

  static signupUser(request) {
    let Table = new UserTable()

    let tg_id = request.payload.tg_id
    let user_name = request.payload.user_name
    let first_name = request.payload.first_name
    let last_name = request.payload.last_name
    let shipping_address = request.payload.shipping_address

    let user = Table.createOrUpdateUser({
      tg_id: tg_id,
      user_name: user_name,
      first_name: first_name,
      last_name: last_name,
      shipping_address: shipping_address
    })

    delete user.row_

    request.response = user

    return request
  }
}
