(function (jQuery) {

	let App = null
	let Page = null
	let ItemList = []
	let isHomePage = false

	jQuery.ItemPage = function(app, page) {
		App = app
		Page = page

		colseWithClear()

		let object = {
			open,
			close,
			colseWithClear,
			setItemList,
			getCartItemList,
			isHomePage,
			isHasSelectedItem
		}

		Object.defineProperty(object, `isHomePage`, {
			get: function() {
				return isHomePage
			},
			set: function(value) {
				isHomePage = value
			}
		})

		return object
	}

	const open = (animation) => {
		if (!isHomePage) App.showBackButton()
		toggleMainButton()

		if (animation != null) {
			animation(Page)
		} else {
			Page.show()
		}
	}

	const close = (animation) => {
		App.hideBackButton()

		if (animation != null) {
			animation(Page)
		} else {
			Page.hide()
		}
	}

	const colseWithClear = (animation) => {
		App.hideBackButton()

		if (animation != null) {
			animation(
				Page,
				() => {
					Page.empty()
				}
			)
		} else {
			Page.hide()
			Page.empty()
		}
	}

	const toggleMainButton = () => {
		App.hideMainButton()
		App.disableClosingConfirmation()

		App.MainButton.text = `စျေးဝယ်ခြင်း ကြည့်ရန်`
		if (isHasSelectedItem()) {
			App.enableClosingConfirmation()
			App.showMainButton()
		}
	}

	const isHasSelectedItem = () => {
		return getCartItemList().length > 0
	}

	const setItemList = (itemList) => {
		ItemList = itemList
		Page.empty()

		if (itemList.length == 0) {
			$.Utils().renderEmptyPage(Page)
			return
		}

		itemList.forEach(item => {
			
			let divItem = $(`<div>`, {
				'class': `item`
			})
			
			let divItemPhoto = $(`<div>`, {
				'class': `item-photo`
			})
			let divItemCount = $(`<span>`, {
				'class': `item-count hide`
			}).text(`1`)
			divItemPhoto.append($(`<img>`, {
				'src': item.item_logo
			}))
			divItemPhoto.append(divItemCount)
			divItem.append(divItemPhoto)

			let divItemLabel = $(`<div>`, {
				'class': `item-label`
			})
			divItemLabel.append($(`<span>`, {
				'class': `item-title`
			}).text(item.item_name))
			divItem.append(divItemLabel)

			let divItemButton = $(`<div>`, {
				'class': `item-button`
			})
			let addButton = $(`<button>`, {
				'class': `item-shop-button add`
			}).text(`Add`)
			let removeButton = $(`<button>`, {
				'class': `item-shop-button remove selected hide`
			}).append(`<i class="fa-solid fa-minus fa-xl"></i>`)
			divItemButton.append(removeButton)
			divItemButton.append(addButton)
			divItem.append(divItemButton)

			$.Utils().setRipple(addButton)
			addButton.click(function(e) {

				if (item.count == null) item.count = 0
				
				item.count += 1
				divItemCount.text(item.count)

				if (removeButton.hasClass(`hide`)) removeButton.removeClass(`hide`)

				if ($(this).hasClass(`selected`)) return

				divItemCount.removeClass(`hide`)

				toggleMainButton()

				$(this).text(``)
				$(this).addClass(`selected`)
				$(this).append(`<i class="fa-solid fa-plus fa-xl"></i>`)

			})

			$.Utils().setRipple(removeButton)
			removeButton.click(function(e) {
				
				item.count -= 1
				divItemCount.text(item.count)

				if (item.count > 0) return

				if (addButton.hasClass(`selected`)) {
					addButton.empty()
					addButton.removeClass(`selected`)
					addButton.text(`Add`)
				}

				if ($(this).hasClass(`hide`)) return

				toggleMainButton()

				divItemCount.addClass(`hide`)
				$(this).addClass(`hide`)
				$(this).children(`span`).remove()
			})

			Page.append(divItem)
		})
	}

	const getCartItemList = () => {
		return ItemList.filter(item => {
			return item.count != null && item.count > 0
		})
	}

}(jQuery))
