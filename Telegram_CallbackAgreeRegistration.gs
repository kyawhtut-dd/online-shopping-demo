class TelegramCallbackAgreeRegistration {
  static get() {
    return createCallback(
      `user_agree_registration`,
      function (callback, telegram) {
        return TelegramCallbackAgreeRegistration.execute(callback, telegram)
      }
    )
  }

  static execute(callback, telegram) {
    let action = getParamKey(telegram.callback, `action`)
    let userTable = new UserTable()
    let telegramConfigTable = new TelegramConfigTable()

    let message = `<strong>${telegramConfigTable.get(`registration_success`)}</strong>`

    if (userTable.isUserExistByTgId(telegram.chat_id)) {
      message = `<strong>${telegramConfigTable.get(`account_already_exist`).template({ telegram })}</strong>`
    }

    new userTable.createOrUpdateUser({
      tg_id: telegram.chat_id,
      user_name: telegram.user_name,
      first_name: telegram.first_name,
      last_name: telegram.last_name
    })

    let keyboard = keyWebApp(
      telegramConfigTable.get(action),
      getWebAppUrl(action, telegram.chat_id) + `?action=${action}`
    )

    let response = telegram.editMessageText({
      text: `${telegram.text}\n\n${message}`,
      reply_markup: createKeyboard().buttons([keyboard]).inline()
    })

    response = TelegramController.setBotCommand(
      telegram,
      false,
      true
    )

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}
