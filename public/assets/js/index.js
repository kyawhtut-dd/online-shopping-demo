(function (jQuery) {

	let App = null
	let ApiService = null
	let Animation = null
	let CurrentPage = null

	let CategoryPage = null
	let ItemPage = null
	let CartPage = null

	jQuery.Index = function(app) {
		return {
			init
		}
	}

	const init = () => {
		App = $.App(false)
		ApiService = $.ApiService(App, $(`.pageAnimation`))
		Animation = $.Animation()

		CategoryPage = $.CategoryPage(App, $(`.pageCategory`))
		ItemPage = $.ItemPage(App, $(`.pageItemList`))
		CartPage = $.CartPage(App, $(`.pageCart`))

		CategoryPage.onClickCategory = (catetgory) => {
			fetchItemListByCategoryId(catetgory.category_id)
		}

		CartPage.onEditCart = () => {
			openPage(ItemPage, true, Animation.slideDown, Animation.slideUp)
		}

		App.MainButton.onClick(() => {
			if (CurrentPage == ItemPage) {
				CartPage.setCartItemList(ItemPage.getCartItemList())
				openPage(CartPage, false, Animation.slideDown, Animation.slideUp)
			} else if (CurrentPage == CartPage) {
				if (App.isRegister) {}
				else App.sendData(`register_request_from_cart_page`)
			}
		})

		App.BackButton.onClick(() => {
			if (CurrentPage == ItemPage) {
				if (!ItemPage.isHomePage) openPage(CategoryPage, true, Animation.slideDown, Animation.slideUp)
				else if (ItemPage.isHasSelectedItem()) App.showConfirmClose()
				else App.close()
			} else if (CurrentPage == CartPage) {
				openPage(ItemPage, true, Animation.slideDown, Animation.slideUp)
			} else App.close()
		})

		processPage()
	}

	const processPage = () => {
		let category_id = $.Utils().getParameter(`category_id`)
		if (category_id != null && category_id != ``) {
			ItemPage.isHomePage = true
			CurrentPage = ItemPage
			ItemPage.open()

			fetchItemListByCategoryId(category_id)
		} else {
			CurrentPage = CategoryPage
			CategoryPage.open()
			fetchCategoryList()
		}
	}

	const fetchCategoryList = () => {
		ApiService.fetchCategoryList((result) => {
			CategoryPage.setCategoryList(result)
		})
	}

	const fetchItemListByCategoryId = (category_id) => {
		ApiService.fetchItemListByCategoryId(category_id, (result) => {
			ItemPage.setItemList(result)
			if (!ItemPage.isHomePage) openPage(ItemPage, false, Animation.slideDown, Animation.slideUp)
		})
	}

	const openPage = (open, isCloseWithClear, openAnim, closeAnim) => {
		if (isCloseWithClear) CurrentPage.colseWithClear(closeAnim)
		else CurrentPage.close(closeAnim)
		CurrentPage = open
		CurrentPage.open(openAnim)
	}
}(jQuery))
