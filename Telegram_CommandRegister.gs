class TelegramCommandRegister {
  static get() {
    return createBotCommand({
      command: `/register`,
      description: TelegramConfigTable.get(`command_register`),
      callback: function (command, telegram) {
        return TelegramCommandRegister.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    telegram.sendChatAction(new Action().TYPING)

    let telegramConfigTable = new TelegramConfigTable()

    let message = telegramConfigTable.get(`registration_success`)
    let isRegister = UserTable.isUserExistByTgId(telegram.chat_id)

    if (isRegister) {
      message = telegramConfigTable.get(`account_already_exist`).template({ telegram })
    }

    new UserTable().createOrUpdateUser({
      tg_id: `${telegram.chat_id}`,
      user_name: telegram.user_name,
      first_name: telegram.first_name,
      last_name: telegram.last_name
    })

    response = telegram.sendMessage({
      text: message
    })

    response = TelegramController.setBotCommand(
      telegram,
      false,
      isRegister
    )

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}
