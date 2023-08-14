class TelegramCalbackSkipQueueUser {
  static get() {
    return createCallback(
      `skip_current_queue_user`,
      function (callback, telegram) {
        return TelegramCalbackSkipQueueUser.execute(callback, telegram)
      }
    )
  }

  static execute(callback, telegram) {
    let response = null
    let isAdmin = AdminTable.isUserExistByTgId(telegram.chat_id)
    let queueTable = new QueueTable()
    let telegramConfigTable = new TelegramConfigTable()

    if (isAdmin) {
      let user = queueTable.getCurrentQueueUser()
      if (user) {
        queueTable.removeQueue(user.tg_id)

        let messageOne = telegramConfigTable.get(`welcome_admin_reply`).template({ telegram })
        let messageTwo = `\n\n`
        messageTwo += telegramConfigTable.get(`remove_current_user_from_queue`).template({
          user: {
            fullName: function () {
              return user.fullName()
            }
          }
        })

        response = telegram.editMessageText({
          text: messageOne + messageTwo,
          reply_markup: createKeyboard().inline()
        })

        // reply to user
        response = telegram.sendMessage({
          text: telegramConfigTable.get(`conversation_end_by_admin`).template({
            user: {
              fullName: function () {
                return user.fullName()
              }
            }
          }),
          chat_id: user.tg_id,
          reply_markup: createKeyboard().buttons([
            keyCallback(telegramConfigTable.get(`inline_request_admin`), `talk_to_admin`)
          ]).inline()
        })

      } else {
        response = telegram.editMessageText({
          text: telegramConfigTable.get(`welcome_admin_reply`).template({ telegram }),
          reply_markup: createKeyboard().inline()
        })
      }

      // next queue user
      user = queueTable.getCurrentQueueUser()
      if (user) {

        // reply to admin for next user
        response = telegram.sendMessage({
          text: telegramConfigTable.get(`user_waiting_admin_reply`).template({
            user: {
              fullName: function () {
                return user.fullName()
              }
            },
            telegram
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

    } else {
      response = telegram.editMessageText({
        text: telegramConfigTable.get(`not_admin_reply`).template({ telegram }),
        reply_markup: createKeyboard().inline()
      })
    }

    let isRegister = true

    if (!isAdmin) isRegister = UserTable.isUserExistByTgId(telegram.chat_id)

    response = TelegramController.setBotCommand(
      telegram,
      isAdmin,
      isRegister,
    )

    if (telegram.DEBUG) console.log(response)
    else return response
  }
}
