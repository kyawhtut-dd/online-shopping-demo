class TelegramController {

  static getBotCommands(isRegister) {
    let list = createBotCommandList()
    list.addBotCommand(TelegramCommandStart.get())
    list.addBotCommand(TelegramCommandShop.get())

    if (!isRegister) {
      list.addBotCommand(TelegramCommandRegister.get())
    }

    return list
  }

  constructor(e) {
    this.DEBUG = false

    Logger.log(JSON.stringify(e))

    let telegram = createTelegramApp(TELEGRAM_BOT_ID)
    this.Telegram = telegram

    telegram.setRequest(e)

    if (telegram.isTelegramRequest()) {
      telegram.registerBotCommands(TelegramController.getBotCommands(false).commands)

      telegram.registerCallback(TelegramCallbackAgreeRegistration.get())

      // this.Telegram.registerWebAppReply()

      telegram.setMyCommands(
        TelegramController.getBotCommands(
          UserTable.isUserExistByTgId(telegram.chat_id)
        ).chatScope(telegram.chat_id).setMyCommands()
      )
    }
  }

  run() {
    this.Telegram.run()
  }

  setDebug(isDebug) {
    this.DEBUG = isDebug
    this.Telegram.DEBUG = isDebug
    return this
  }

  isTelegramRequest() {
    return this.Telegram.isTelegramRequest()
  }

  setWebhook() {
    let response = this.Telegram.setWebhook("https://script.google.com/macros/s/AKfycbzLhyJygr1MJQwNOznnDnKtxXB2MO2xtmw2dfEw5LLwh-sxaBjs2FZnl6PIBYG7EzMD/exec")
    if (this.DEBUG) console.log(JSON.stringify(response))
    else return response
  }

  deleteWebhook() {
    let response = this.Telegram.deleteWebhook()
    if (this.DEBUG) console.log(JSON.stringify(response))
    else return response
  }
}

class TelegramCommandStart {
  static get() {
    return createBotCommand({
      command: `/start`,
      description: `${TelegramConfigTable.get(`command_start`)}`,
      callback: function (command, telegram) {
        return TelegramCommandStart.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    let text = ``
    if (!new UserTable().isUserExistByTgId(telegram.chat_id)) {
      text = TelegramConfigTable.get(`start_reply_not_register`)
    } else {
      text = TelegramConfigTable.get(`start_reply`)
    }
    let response = telegram.sendMessage({
      text: `${text}`,
    })
    if (telegram.DEBUG) console.log(response)
    else return response
  }
}

class TelegramCommandShop {
  static get() {
    return createBotCommand({
      command: `/shop`,
      description: TelegramConfigTable.get(`command_shop`),
      callback: function (command, telegram) {
        return TelegramCommandShop.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    let response = null
    if (new UserTable().isUserExistByTgId(telegram.chat_id)) {
      response = telegram.sendMessage({
        text: `ဈေးဝယ်လို့ရပါပြီ။`
      })
    } else {
      response = telegram.sendMessage({
        text: `${TelegramConfigTable.get(`shop_reply_not_register`)}`,
        reply_markup: createKeyboard().buttons([keyCallback(TelegramConfigTable.get(`inline_key_register`), "user_agree_registration")]).inline()
      })
    }

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}

class TelegramCommandRegister {
  static get() {
    return createBotCommand({
      command: `/register`,
      description: `${TelegramConfigTable.get(`command_register`)}`,
      callback: function (command, telegram) {
        return TelegramCommandRegister.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    let message = TelegramConfigTable.get(`registration_success`)

    if (UserTable.isUserExistByTgId(telegram.chat_id)) {
      message = TelegramConfigTable.get(`account_already_exist`).template({telegram})
    }

    new UserTable().createOrUpdateUser({
      tg_id: telegram.chat_id,
      user_name: telegram.user_name,
      first_name: telegram.first_name,
      last_name: telegram.last_name
    })

    let response = telegram.setMyCommands(
      TelegramController.getBotCommands(
        UserTable.isUserExistByTgId(telegram.chat_id)
      ).chatScope(telegram.chat_id).setMyCommands()
    )

    if (telegram.DEBUG) console.log(response)

    response = telegram.sendMessage({
      text: `${message}`
    })

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}

class TelegramCallbackAgreeRegistration {
  static get() {
    return createCallback(`user_agree_registration`, function (callback, telegram) {
      return TelegramCallbackAgreeRegistration.execute(callback, telegram)
    })
  }

  static execute(callback, telegram) {
    let message = `<strong>${TelegramConfigTable.get(`registration_success`)}</strong>`

    if (UserTable.isUserExistByTgId(telegram.chat_id)) {
      message = `<strong>${TelegramConfigTable.get(`account_already_exist`).template({telegram})}</strong>`
    }

    new UserTable().createOrUpdateUser({
      tg_id: telegram.chat_id,
      user_name: telegram.user_name,
      first_name: telegram.first_name,
      last_name: telegram.last_name
    })

    let response = telegram.setMyCommands(
      TelegramController.getBotCommands(
        UserTable.isUserExistByTgId(telegram.chat_id)
      ).chatScope(telegram.chat_id).setMyCommands()
    )

    if (telegram.DEBUG) console.log(response)

    response = telegram.editMessageText({
      text: `${telegram.text}\n\n${message}`,
      reply_markup: createKeyboard().inline()
    })

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}
