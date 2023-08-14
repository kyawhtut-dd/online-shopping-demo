class TelegramCommandSubmitForm {
  static get() {
    return createBotCommand({
      command: `/command_submit_form`,
      description: TelegramConfigTable.get(`command_submit_form`),
      callback: function (command, telegram) {
        return TelegramCommandSubmitForm.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    telegram.sendChatAction(new Action().TYPING)

    let telegramConfigTable = new TelegramConfigTable()

    let isRegister = UserTable.isUserExistByTgId(telegram.chat_id)
    let response = null

    if (isRegister) {
      response = telegram.sendMessage({
        text: telegramConfigTable.get(`submit_form_reply`),
        reply_markup: createKeyboard().buttons([
          keyWebApp(
            telegramConfigTable.get(`command_submit_form`),
            getWebAppUrl(`command_submit_form`, telegram.chat_id) + `&action=command_submit_form`
          )
        ]).oneTime().inline()
      })
    } else {
      response = telegram.sendMessage({
        text: telegramConfigTable.get(`submit_form_not_register_reply`),
        reply_markup: createKeyboard().buttons([
          keyCallback(
            telegramConfigTable.get(`inline_key_register`),
            "user_agree_registration?action=command_submit_form"
          )
        ]).inline()
      })
    }

    response = TelegramController.setBotCommand(
      telegram,
      false,
      isRegister
    )

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}
