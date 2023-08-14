class TelegramCommandEndTalkToAdmin {
  static get() {
    return createBotCommand({
      command: `/end`,
      description: TelegramConfigTable.get(`command_end_talk_to_adin`),
      callback: function (command, telegram) {
        return TelegramCommandEndTalkToAdmin.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    telegram.sendChatAction(new Action().TYPING)
    
    let queueTable = new QueueTable()
    let telegramConfigTable = new TelegramConfigTable()

    let response = null
    let isRegister = UserTable.isUserExistByTgId(telegram.chat_id)

    if (isRegister) {
      let userQueueNo = queueTable.getQueueNumber(telegram.chat_id)

      if (userQueueNo == 0) {
        response = telegram.sendMessage({
          text: telegramConfigTable.get(`user_not_in_waiting_list`).template({ telegram })
        })
      } else {
        let admin = AdminTable.getAdmin()
        if (userQueueNo == 1) {
          response = telegram.sendMessage({
            text: telegramConfigTable.get(`user_end_conversation_reply_to_admin`).template({
              telegram,
              admin: {
                fullName: function () {
                  return admin.fullName()
                }
              }
            }),
            chat_id: admin.user_id,
          })
          response = telegram.sendMessage({
            text: telegramConfigTable.get(`user_end_conversation_reply_to_user`)
          })
        } else {
          response = telegram.sendMessage({
            text: telegramConfigTable.get(`user_remove_from_queue`).template({ telegram })
          })
        }

        queueTable.removeQueue(telegram.chat_id)

        if (userQueueNo == 1) {
          let user = queueTable.getCurrentQueueUser()
          if (user) {

            response = telegram.sendMessage({
              text: telegramConfigTable.get(`user_waiting_admin_reply`).template({
                user: {
                  fullName: function () {
                    return user.fullName()
                  }
                }, telegram: {
                  display_name: admin.fullName()
                }
              }),
              reply_markup: createKeyboard().buttons([
                keyCallback(telegramConfigTable.get(`inline_user_skip`), `skip_current_queue_user`),
                keyCallback(telegramConfigTable.get(`inline_user_accept`), `answer_current_queue_user`)
              ]).inline()
            })
          }

          // reply to queue user their queue number
          queueTable.getQueueNumberList().forEach(queue => {
            response = telegram.sendMessage({
              text: telegramConfigTable.get(`queue_number_reply`).template({ queue_number: queue[`#`] }),
              chat_id: queue.user_id
            })
          })
        }
      }
    } else {
      telegram.sendMessage({
        text: telegramConfigTable.get(`start_reply_not_register`)
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
