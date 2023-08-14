class TelegramCommandTalkToAdmin {
  static get() {
    return createBotCommand({
      command: `/talk_to_admin`,
      description: TelegramConfigTable.get(`command_talk_to_admin`),
      callback: function (command, telegram) {
        return TelegramCommandTalkToAdmin.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    telegram.sendChatAction(new Action().TYPING)
    
    let telegramConfigTable = new TelegramConfigTable()
    let queueTable = new QueueTable()

    let response = null
    let isRegister = UserTable.isUserExistByTgId(telegram.chat_id)

    if (isRegister) {

      let queue = queueTable.getQueueNumber(telegram.chat_id)
      if (queue == 1) {
        response = telegram.sendMessage({
          text: telegramConfigTable.get(`user_request_agin_talk_to_admin`)
        })
      } else {
        if (queue == 0) {
          queue = queueTable.insertQueue(telegram.chat_id)
        }

        if (queue == 1) {
          let admin = AdminTable.getAdmin()
          let messageOne = telegramConfigTable.get(`welcome_admin_reply`).template({
            telegram: {
              display_name: admin.fullName()
            }
          })
          let messageTwo = telegramConfigTable.get(`user_waiting_admin_reply`).template({
            user: {
              fullName: function () {
                return telegram.display_name
              }
            },
            telegram: {
              display_name: admin.fullName()
            }
          })
          response = telegram.sendMessage({
            text: messageOne + "\n\n" + messageTwo,
            chat_id: admin.user_id,
            reply_markup: createKeyboard().buttons([
              keyCallback(telegramConfigTable.get(`inline_user_skip`), `skip_current_queue_user`),
              keyCallback(telegramConfigTable.get(`inline_user_accept`), `answer_current_queue_user`)
            ]).inline()
          })
        }

        response = telegram.sendMessage({
          text: telegramConfigTable.get(`queue_number_reply`).template({
            queue_number: queue
          })
        })
      }
    } else {
      response = telegram.sendMessage({
        text: telegramConfigTable.get(`start_reply_not_register`),
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
