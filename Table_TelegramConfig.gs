class TelegramConfigTable {

  static get(key, default_value = ``) {
    let table = new TelegramConfigTable().Table
    let config = table.where((config) => {
      return config.key == key
    }).first()

    if (config != null) return config.value
    else default_value
  }

  constructor() {
    Tamotsu.initialize()
    this.Table = Tamotsu.Table.define(
      {
        sheetName: `TelegramConfig`,
      }
    )
  }
}
