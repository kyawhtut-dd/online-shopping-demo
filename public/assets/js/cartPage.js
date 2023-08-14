(function(jQuery) {

	let App = null

	jQuery.CartPage = function(app, div) {
		App = app
		div = $(div)

		return {

			show() {
				div.append(`<p class="pt-2">ဈေးဝယ်ခြင်း နေရာ အတွက် Develop လုပ်နေဆဲ ဖြစ်သည့်အတွက် ကြည့်ရှု၍ မရနိုင်သေးပါ။</p>`)
				$.App().MainButton.text = "ပိတ်ရန်"
				$.App().enableClosingConfirmation()
				div.show()
			},

			hide() {
				div.empty()
				div.hide()
			}
		}
	}
}(jQuery))
