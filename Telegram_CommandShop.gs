class TelegramCommandShop {
  static get() {
    return createBotCommand({
      command: `/shop`,
      description: TelegramConfigTable.get(`command_shop`),
      callback: function (command, telegram) {
        return TelegramCommandShop.execute(command, telegram)
      }
    })
  }

  static execute(command, telegram) {
    telegram.sendChatAction(new Action().TYPING)
    
    let telegramConfigTable = new TelegramConfigTable()

    let response = null
    let isRegister = new UserTable().isUserExistByTgId(telegram.chat_id)
    if (isRegister) {
      // telegramConfigTable.get(`admin_account_id`).split(`,`).forEach(admin_id => {
      //   response = telegram.replayToAdmin({
      //     text: `User request for shop`,
      //     chat_id: admin_id,
      //   })

      //   response = telegram.forwardToAdmin({
      //     chat_id: admin_id,
      //   })

      // })
      // response = telegram.sendMessage({
      //   text: `Admin ထံသို့အကြောင်းကြားပြီးပါပြီ။`
      // })
      telegram.setMenuButtonDefault()
      response = telegram.sendMessage({
        text: `ဈေးဝယ်ရန် အတွက် <strong>ဈေးဝယ်မည်</strong> ကို နှိပ်ပြီး ဝယ်နိုင်ပါသည်။`,
        reply_markup: createKeyboard().buttons([
          keyWebApp(telegramConfigTable.get(`inline_shop_now`), getWebAppUrl(`command_shop`, telegram.chat_id))
        ]).resize(true).oneTime(true).reply()
      })
    } else {
      response = telegram.sendMessage({
        text: telegramConfigTable.get(`shop_reply_not_register`),
        reply_markup: createKeyboard().buttons([
          keyCallback(telegramConfigTable.get(`inline_key_register`), "user_agree_registration?action=command_shop")
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
