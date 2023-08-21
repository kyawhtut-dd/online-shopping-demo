(function (jQuery) {

	let App = null
	let Page = null
	let onClickCategory = null
	let categoryList = []

	jQuery.CategoryPage = function(app, page) {
		App = app
		Page = page
		
		colseWithClear()

		let object = {
			open,
			close,
			colseWithClear,
			categoryList,
			onClickCategory
		}

		Object.defineProperty(object, `onClickCategory`, {
			get: function() {
				return onClickCategory
			},
			set: function(value) {
				onClickCategory = value
			}
		})

		Object.defineProperty(object, `categoryList`, {
			get: function() {
				return categoryList
			},
			set: function(value) {
				categoryList = value
				renderUI()
			}
		})

		return object
	}

	const open = (animation) => {
		App.hideBackButton()
		App.hideMainButton()
		App.disableClosingConfirmation()
		
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

	const renderUI = () => {
		if (!App.isShopOpen) {
			$.Utils().renderShopClose(Page)
			return
		}
		Page.empty()

		if (categoryList.length == 0) {
			$.Utils().renderEmptyPage(Page)
			return
		}

		categoryList.forEach(category => {
			let divCategory = $(`<div>`, {
				'class': `category`
			})
			
			let divCategoryPhoto = $(`<div>`, {
				'class': `category-photo`
			})
			divCategoryPhoto.append($(`<img>`, {
				'src': category.category_logo
			}))
			divCategory.append(divCategoryPhoto)

			let divCategoryLabel = $(`<div>`, {
				'class': `category-label`
			})
			divCategoryLabel.append($(`<span>`, {
				'class': `category-title`
			}).text(category.category_name))
			divCategory.append(divCategoryLabel)

			let divCategoryButton = $(`<div>`, {
				'class': `category-button`
			})
			let shopButton = $(`<button>`, {
				'class': `category-shop-button`
			}).text(`Shop`)
			divCategoryButton.append(shopButton)
			divCategory.append(divCategoryButton)

			$.Utils().setRipple(shopButton)
			shopButton.click(function(e) {
				onClickCategory(category)
			})

			Page.append(divCategory)
		})
	}
}(jQuery))
