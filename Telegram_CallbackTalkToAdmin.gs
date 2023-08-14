class TelegramCallbackTalkToAdmin {
  static get() {
    return createCallback(
      `talk_to_admin`,
      function (callback, telegram) {
        return TelegramCallbackTalkToAdmin.execute(callback, telegram)
      }
    )
  }

  static execute(callback, telegram) {
    return TelegramCommandTalkToAdmin.execute(callback, telegram)
  }
}
