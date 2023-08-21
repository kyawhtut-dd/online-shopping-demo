(function (jQuery) {

	let App = null
	let Page = null
	let itemList = []
	let isHomePage = false

	let PageItemList = {
		itemList,
		cartItemList: [],
		isHasSelectedItem: false,
		isHomePage
	}

	jQuery.ItemPage = function(app, page) {
		App = app
		Page = page

		colseWithClear()

		PageItemList.open = open
		PageItemList.close = close
		PageItemList.colseWithClear = colseWithClear

		Object.defineProperty(PageItemList, `isHomePage`, {
			get: function() {
				return isHomePage
			},
			set: function(value) {
				isHomePage = value
			}
		})

		Object.defineProperty(PageItemList, `itemList`, {
			get: function() {
				return itemList
			},
			set: function(value) {
				itemList = value
				renderUI()
			}
		})

		Object.defineProperty(PageItemList, `cartItemList`, {
			get: function() {
				return itemList.filter(item => item.count != null && item.count > 0)
			}
		})

		Object.defineProperty(PageItemList, `isHasSelectedItem`, {
			get: function() {
				return PageItemList.cartItemList.length > 0
			}
		})

		return PageItemList
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
		if (PageItemList.isHasSelectedItem) {
			App.enableClosingConfirmation()
			App.showMainButton()
		}
	}

	const renderUI = () => {
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

}(jQuery))
