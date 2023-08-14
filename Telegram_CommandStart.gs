class TelegramCommandStart {
  static get() {
    return createBotCommand({
      command: `/start`,
      description: TelegramConfigTable.get(`command_start`),
      callback: function (command, telegram) {
        return TelegramCommandStart.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    telegram.sendChatAction(new Action().TYPING)
    
    let telegramConfigTable = new TelegramConfigTable()
    let userTable = new UserTable()

    let response = null
    let isAdmin = AdminTable.isUserExistByTgId(telegram.chat_id)
    let isRegister = true

    if (isAdmin) {
      let user = QueueTable.getCurrentQueueUser()
      let messageOne = telegramConfigTable.get(`welcome_admin_reply`).template({ telegram })
      let messageTwo = ``
      let reply_markup = null

      if (user) {
        messageTwo = telegramConfigTable.get(`user_waiting_admin_reply`).template({
          user: {
            fullName: function () {
              return user.fullName()
            }
          },
          telegram
        })
        reply_markup = createKeyboard().buttons([
          keyCallback(telegramConfigTable.get(`inline_user_skip`), `skip_current_queue_user`),
          keyCallback(telegramConfigTable.get(`inline_user_accept`), `answer_current_queue_user`)
        ]).inline()
      }

      response = telegram.sendMessage({
        text: messageOne + "\n\n" + messageTwo,
        reply_markup: reply_markup
      })
    } else {

      let text = ``
      isRegister = userTable.isUserExistByTgId(telegram.chat_id)
      if (!isRegister) {
        text = telegramConfigTable.get(`start_reply_not_register`)
      } else {
        text = telegramConfigTable.get(`start_reply`)
      }
      response = telegram.sendMessage({
        text: text,
      })

    }

    response = TelegramController.setBotCommand(
      telegram,
      isAdmin,
      isRegister
    )

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}
