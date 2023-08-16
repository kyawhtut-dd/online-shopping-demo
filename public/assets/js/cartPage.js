(function(jQuery) {

	let App = null
	let Page = null

	jQuery.CartPage = function(app, div) {
		App = app
		Page = $(div)

		return {

			show() {
				Page.append(`<p class="pt-2">ဈေးဝယ်ခြင်း နေရာ အတွက် Develop လုပ်နေဆဲ ဖြစ်သည့်အတွက် ကြည့်ရှု၍ မရနိုင်သေးပါ။</p>`)
				Page.show()

				App.enableClosingConfirmation()

				if (App.isRegister) {
					App.MainButton.text = "အော်ဒါမှာမည်"
				} else {
					App.MainButton.text = "အကောင့် Register လုပ်မည်။"
				}
			},

			hide() {
				Page.empty()
				Page.hide()
			}
		}
	}
}(jQuery))
