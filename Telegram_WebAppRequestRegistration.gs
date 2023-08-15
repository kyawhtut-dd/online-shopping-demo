class TelegramWebAppRequestRegisteration {
  static get() {
    return createWebAppReply(
      `register_request_from_cart_page`,
      function(web_app, telegram) {
        return TelegramWebAppRequestRegisteration.execute(web_app, telegram)
      }
    )
  }

  static execute(web_app, telegram) {
    return telegram.sendMessage({
      text: "Received Regisration.",
      reply_markup: createKeyboard().remove()
    })
  }
}
