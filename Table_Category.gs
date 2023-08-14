class CategoryTable {

  static getAll() {
    return new CategoryTable().getAll()
  }

  constructor() {
    this.Table = Tamotsu.Table.define(
      {
        sheetName: `Category`,
        idColumn: `category_id`,
        autoIncrement: false,
      }
    )
  }

  getAll() {
    return this.Table.all()
  }
}