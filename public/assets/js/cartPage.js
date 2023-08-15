(function(jQuery) {

	let App = null

	jQuery.CartPage = function(app, div) {
		App = app
		div = $(div)

		return {

			show() {
				div.append(`<p class="pt-2">ဈေးဝယ်ခြင်း နေရာ အတွက် Develop လုပ်နေဆဲ ဖြစ်သည့်အတွက် ကြည့်ရှု၍ မရနိုင်သေးပါ။</p>`)
				div.show()

				App.enableClosingConfirmation()

				if (App.isRegister) {
					App.MainButton.text = "အော်ဒါမှာမည်"
				} else {
					App.MainButton.text = "အကောင့် Register လုပ်မည်။"
				}
			},

			hide() {
				div.empty()
				div.hide()
			}
		}
	}
}(jQuery))
