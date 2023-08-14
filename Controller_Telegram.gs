class TelegramController {

  static setBotCommand(telegram, isAdmin, isRegister) {
    return telegram.setMyCommands(
      TelegramController.getMyCommands(
        isAdmin,
        isRegister,
        telegram.chat_id
      ).chatScope(telegram.chat_id).setMyCommands()
    )
  }

  static getRegisterCommands(isAdmin, isRegister) {
    let list = createBotCommandList()

    list.addBotCommand(TelegramCommandStart.get())

    if (!isAdmin) {
      list.addBotCommand(TelegramCommandShop.get())
      //list.addBotCommand(TelegramCommandSubmitForm.get())

      if (!isRegister) {
        list.addBotCommand(TelegramCommandRegister.get())
      }

      list.addBotCommand(TelegramCommandTalkToAdmin.get())

      list.addBotCommand(TelegramCommandEndTalkToAdmin.get())
    }

    return list
  }

  static getMyCommands(isAdmin, isRegister, chat_id) {
    let list = createBotCommandList()

    list.addBotCommand(TelegramCommandStart.get())

    if (!isAdmin) {
      list.addBotCommand(TelegramCommandShop.get())
      //list.addBotCommand(TelegramCommandSubmitForm.get())

      if (QueueTable.getQueueNumber(chat_id) == 0) {
        list.addBotCommand(TelegramCommandTalkToAdmin.get())
      } else {
        list.addBotCommand(TelegramCommandEndTalkToAdmin.get())
      }

      if (!isRegister) {
        list.addBotCommand(TelegramCommandRegister.get())
      }
    }

    return list
  }

  constructor(e) {
    this.DEBUG = false

    let telegram = createTelegramApp(TELEGRAM_BOT_ID)
    telegram.setRequest(e)

    Logger.log(JSON.stringify(e))

    this.Telegram = telegram

    if (telegram.isTelegramRequest()) {

      let isAdmin = AdminTable.isUserExistByTgId(telegram.chat_id)

      telegram.registerBotCommands(
        TelegramController.getRegisterCommands(
          isAdmin,
          UserTable.isUserExistByTgId(telegram.chat_id),
          telegram.chat_id
        ).commands
      )

      telegram.registerCallback(TelegramCallbackAgreeRegistration.get())

      telegram.regiseterCallbacks([TelegramCalbackSkipQueueUser.get(), TelegramCallbackTalkToAdmin.get()])

      // this.Telegram.registerWebAppReply()
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
