class TelegramWebAppRequestRegisteration {
  static get() {
    return createWebAppReply({
      data: `register_request_from_cart_page`,
      callback: function (web_app, telegram) {
        return TelegramWebAppRequestRegisteration.execute(web_app, telegram)
      }
    })
  }

  static execute(web_app, telegram) {
    telegram.sendChatAction(new Action().TYPING)

    let response = null
    let telegramConfigTable = new TelegramConfigTable()
    let user = new UserTable().getUserById(telegram.chat_id)

    response = telegram.sendMessage({
      text: telegramConfigTable.get(`web_app_received_for_registration`)
    })

    response = telegram.sendMessage({
      text: telegramConfigTable.get(`web_reply_for_registration`),
      reply_markup: createKeyboard().buttons([
        keyCallback(telegramConfigTable.get(`inline_key_register`), "user_agree_registration?action=command_shop")
      ]).inline()
    })

    if(telegram.DEBUG) console.log(response)
    else return response
  }
}
