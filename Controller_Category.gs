class CategoryController {
  static getAll(request) {
    request.response = CategoryTable.getAll()

    return request
  }
}
