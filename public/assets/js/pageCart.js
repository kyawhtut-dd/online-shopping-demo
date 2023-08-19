(function(jQuery) {

	let App = null
	let Page = null
	let onEditCart = null

	jQuery.CartPage = function(app, page) {
		App = app
		Page = page

		colseWithClear()

		let object = {
			open,
			close,
			colseWithClear,
			setCartItemList,
			onEditCart
		}

		Object.defineProperty(object, `onEditCart`, {
			get: function() {
				return onEditCart
			},
			set: function(listener) {
				onEditCart = listener
			}
		})

		return object
	}

	const open = (animation) => {
		App.showBackButton()

		toggleMainButton()

		if (animation != null) {
			animation(Page)
		} else {
			Page.show()
		}
	}

	const close = (animation) => {
		if (animation != null) {
			animation(Page)
		} else {
			Page.hide()
		}
	}

	const colseWithClear = (animation) => {
		if (animation != null) {
			animation(
				Page,
				() => Page.empty()
			)
		} else {
			Page.hide()
			Page.empty()
		}
	}

	const toggleMainButton = () => {
		if (App.isRegister) {
			App.MainButton.text = "အော်ဒါမှာမည်"
		} else {
			App.MainButton.text = "အကောင့် Register လုပ်မည်။"
		}
	}

	const setCartItemList = (itemList) => {
		Page.empty()

		let cartContent = $(`<div>`, {
			'class': `cart-content`
		})

		let cartHeader = $(`<div>`, {
			'class': `cart-header`
		})
		cartContent.append(cartHeader)

		cartHeader.append($(`<h2>`).text(`Your Order`))

		let editButton = $(`<span>`).text(`Edit`)
		editButton.click(() => {
			onEditCart()
		})
		cartHeader.append(editButton)

		let cartList = $(`<div>`)

		itemList.forEach(item => {
			let cartItem = $(`<div>`, {
				'class': `cart-item`
			})

			let cartItemLogo = $(`<div>`, {
				'class': `cart-item-logo`,
				'style': `background-image: url("${item.item_logo}")`
			})
			cartItem.append(cartItemLogo)

			let cartItemLabel = $(`<div>`, {
				'class': `cart-item-label`
			})
			cartItem.append(cartItemLabel)

			let cartItemPrice = $(`<div>`, {
				'class': `cart-item-price`
			}).text(`$${item.item_price}`)
			cartItem.append(cartItemPrice)

			let cartItemName = $(`<div>`, {
				'class': `cart-item-name`
			}).text(item.item_name)
			cartItemName.append($(`<span>`, {
				'class': `cart-item-count`
			}).text(`${item.count}x`))
			cartItemLabel.append(cartItemName)

			let cartItemSubDescription = $(`<div>`, {
				'class': `cart-item-sub-description`
			}).text(`Meat™`)
			cartItemLabel.append(cartItemSubDescription)

			cartList.append(cartItem)
		})

		cartContent.append(cartList)

		let cartComment = $(`<div>`, {
			'class': `cart-item-commend`
		})
		let textArea = $(`<textarea>`, {
			'placeholder': `Add comment...`,
			'rows': `1`
		})
		cartComment.append(textArea)

		let promoMessage = $(`<div>`, {
			'class': `cart-promo-message`
		}).text(`Any special requests, details, final wishes etc.`)

		cartComment.append(promoMessage)

		Page.append(cartContent)
		Page.append(cartComment)
	}
}(jQuery))
