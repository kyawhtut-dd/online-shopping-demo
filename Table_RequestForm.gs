class RequestFormTable {

  static createRequestForm(user_id, title, message) {
    return new RequestFormTable().createRequestForm(user_id, title, message)
  }

  static getRequestFormListByUserId(user_id) {
    return new RequestFormTable().getRequestFormListByUserId(user_id)
  }

  constructor() {
    this.Table = Table.define(
      {
        sheetName: `RequestForm`
      }
    )
  }

  createRequestForm(user_id, title, message) {
    let form = this.Table.create({
      user_id,
      title,
      message,
      status: `PENDING`
    })

    return form
  }

  getRequestFormListByUserId(user_id) {
    return this.Table.where(form => form.user_id == user_id).all()
  }
}
