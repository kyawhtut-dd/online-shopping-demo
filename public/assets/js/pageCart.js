(function(jQuery) {

	let App = null
	let Page = null

	function renderCartUI(itemList) {
		let block = $(`<div>`, {
			'style': `background-color: white; box-shadow: 0 0.5px rgba(0, 0, 0, .07);`
		})
		let header = $(`<div>`, {
			'style': `padding: 21px 20px 14px; display: flex; align-item: center`
		})
		header.append($(`<h2>`, {
			'style': `font-size: 17px; line-height: 21px; text-transform: uppercase; flex-grow: 1; padding: 0; margin: 0;`
		}).text(`Your Order`))
		header.append($(`<span>`, {
			'style': `font-size: 15px; line-height: 18px; font-weight: 500; color: #31b545`
		}).text(`Edit`))

		let list = $(`<div>`)

		let itemOne = $(`<div>`, {
			'style': `display: flex; padding: 5px 20px 5px 14px;`
		})
		itemOne.append($(`<div>`, {
			'style': `text-align: center; width: 50px; height: 50px; margin-right: 11px; background: red;`
		}))
		let label = $(`<div>`, {
			'style': `flex-grow: 1`
		})

		let itemName = $(`<div>`, {
			'style': `font-size: 15px; line-height: 18px; font-weight: 700; padding: 3px 0;`
		})
		itemName.text(`Burger`)
		itemName.append($(`<span>`, {
			'style': `color: #f8a917;`
		}).text(`2x`))

		label.append(itemName)
		label.append($(`<div>`, {
			'style': `font-size: 14px; line-height: 17px; color: #83878a; padding: 2px 0;`
		}).text(`Meat™`))

		itemOne.append(label)

		itemOne.append($(`<div>`, {
			'style': `font-size: 14px; line-height: 17px; font-weight: 500; padding: 4px 0;`
		}).text(`$9.98`))

		list.append(itemOne)
		list.append(itemOne)
		list.append(itemOne)
		list.append(itemOne)
		list.append(itemOne)

		block.append(header)
		block.append(list)

		let comment = $(`<div>`, {
			'style': `margin-top: 14px;`
		})
		comment.append($(`<textarea>`, {
			'style': `overflox: hidden; overflow-wrap: break-word; height: 46px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 17px; line-height: 21px; padding: 12px 20px 13px; box-sizing: border-box; display: block; outline: none; border: none; border-radius: 0; resize: none; color: black; user-select: auto; cursor: auto; width: 100%;`,
			'placeholder': `Add comment...`,
			'rows': `1`
		}))
		comment.append($(`<div>`, {
			'style': `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 14px; line-height: 18px; padding: 10px 20px 24px; color: black;`
		}).text(`
      Any special requests, details, final wishes etc.
    `))

		Page.append(block)
		Page.append(comment)
	}

	jQuery.CartPage = function(app, div) {
		App = app
		Page = $(div)

		return {

			setCartItem(itemList) {
				renderCartUI(itemList)
			},

			show() {
				// Page.append(`<p class="pt-2">ဈေးဝယ်ခြင်း နေရာ အတွက် Develop လုပ်နေဆဲ ဖြစ်သည့်အတွက် ကြည့်ရှု၍ မရနိုင်သေးပါ။</p>`)
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
