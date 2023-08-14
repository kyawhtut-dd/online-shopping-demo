class ItemTable {

  static getAllItem() {
    return new ItemTable().getAllItem()
  }

  static getAllItemByCategoryId(category_id) {
    return new ItemTable().getAllItemByCategoryId(category_id)
  }

  constructor() {
    this.Table = Tamotsu.Table.define(
      {
        sheetName: `Item`,
        idColumn: `item_id`,
        autoIncrement: false,
      }
    )
  }

  getAllItem() {
    return this.Table.all()
  }

  getAllItemByCategoryId(category_id) {
    return this.Table.where({category_id}).all()
  }
}
