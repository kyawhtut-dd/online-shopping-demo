class TelegramConfigTable {

  static get(key, default_value = ``) {
    return new TelegramConfigTable().get(key, default_value)
  }

  constructor() {
    this.Table = Tamotsu.Table.define(
      {
        sheetName: `TelegramConfig`,
      }
    )
  }

  get(key, default_value = ``) {
    let config = this.Table.where({ key }).first()

    if (config != null) return config.value
    else default_value
  }
}
