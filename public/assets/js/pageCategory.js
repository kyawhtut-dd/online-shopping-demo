(function (jQuery) {

	let Page = null
	let onClickCategory = null

	jQuery.CategoryPage = function(page) {
		Page = page
		
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
				() => {
					Page.empty()
				}
			)
		} else {
			Page.hide()
			Page.empty()
		}
	}

	const setCategoryList = (categoryList) => {
		Page.append(`Hello`)
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

			shopButton.click(function(e) {
				$(`.ripple`).remove()

				var posX = $(this).offset().left,
					posY = $(this).offset().top,
					bottonWidth = $(this).width(),
					buttonHeight = $(this).height()

				$(this).prepend(`<span class="custom-ripple"></span>`)

				if (buttonWidth >= buttonHeight) {
					buttonHeight = buttonWidth
				} else {
					buttonWidth = buttonHeight
				}

				var x = e.pageX - posX - buttonWidth / 2
				var y = e.pageY - posY - buttonHeight / 2

				$(".ripple").css({
					width: buttonWidth,
					height: buttonHeight,
					top: y + 'px',
					left: x + 'px'
				}).addClass(`rippleEffect`)
			})

			Page.append(divCategory)
		})
	}

	const setOnClickCategoryListener = (listener) => {
		onClickCategory = listener
	}
}(jQuery))
