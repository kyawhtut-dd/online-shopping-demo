class ItemController {
  static getAll(request) {
    request.response = ItemTable.getAllItem()
    return request
  }

  static getAllByCategoryId(request) {
    let category_id = request.category_id

    request.response = ItemTable.getAllItemByCategoryId(category_id)

    return request
  }
}
