(function (jQuery) {

	let App = null
	let Page = null
	let onClickCategory = null

	jQuery.CategoryPage = function(app, page) {
		App = app
		Page = page
		Page.empty()
		
		close()

		return {
			open,
			close,
			colseWithClear,
			setCategoryList,
			setOnClickCategoryListener
		}
	}

	const open = (animation) => {
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

	const setCategoryList = (categoryList) => {
		Page.empty()

		if (categoryList.length == 0) return

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

	const setOnClickCategoryListener = (listener) => {
		onClickCategory = listener
	}
}(jQuery))
