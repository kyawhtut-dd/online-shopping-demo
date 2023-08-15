const SHEET_ID = `1dlo3fJYF2xo1hA7UhI_oPfAYOJers1XqfHm6EeiyyQw`
const Logger = BetterLog.useSpreadsheet(SHEET_ID)
const TELEGRAM_BOT_ID = `6528580725:AAFVvVLQAJb9rMNqvmOtPhjJPTuJ6jfu4Gk`
const WEB_APP_BASE_URL = `https://e1e8-118-200-69-12.ngrok-free.app/online-shop/public/`

const WEB_APP_URL = {
  command_shop: `category_page.html`,
  command_submit_form: `telegram.html`,
}

let generateUUID = () => {
  var d = new Date().getTime() //Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

let getParamKey = (query, key) => {
  key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  var regx = new RegExp("[\\?&]" + key + "=([^&#]*)")
  let results = regx.exec(query)
  return results === null ? `` : decodeURIComponent(results[1].replace(/\+/g, " "))
}

String.prototype.template = function (data) {
  let original = data
  return this.replace(/\${([^{]+)}/g, function (ignore, key) {
    data = original
    key.split(".").forEach(key => {
      key = key.replace("(", "").replace(")", "")
      data = data[key]
      if (typeof data === 'function') data = data()
    })
    return data
  })
}

let getWebAppUrl = (action, chat_id) => {
  return WEB_APP_BASE_URL + WEB_APP_URL[action] + `?id=${chat_id}`
}
