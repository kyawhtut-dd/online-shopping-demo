(function(jQuery) {

	let App = null
	let Api = null
	let Page = null
	let LoadingPage = null
	let ErrorPage = null
	let LoadingAnimation = null
	let ErrorAnimation = null

	jQuery.ApiService = function(app, page) {
		App = app
		Api = app.Api
		Page = page

		init()

		return {
			fetchCategoryList,
			fetchItemListByCategoryId
		}
	}

	const init = () => {
		LoadingPage = $(`<div>`)
		LoadingAnimation = bodymovin.loadAnimation({
			container: LoadingPage[0],
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `./assets/animation/loading.json`
		})

		ErrorPage = $(`<div>`)
		ErrorAnimation = bodymovin.loadAnimation({
			container: ErrorPage[0],
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `./assets/animation/error.json`
		})

		LoadingPage.hide()
		ErrorPage.hide()

		Page.append(LoadingPage)
		Page.append(ErrorPage)
		Page.hide()
	}

	const fetchCategoryList = (callback) => {
		if (!App.isShopOpen) {
			callback([])
			return
		}
		Api.sheet({
			route: `get_category_list`,
			callback: function(response) {
				checkNetworkResponse(response, callback)
			}
		})

	}

	const fetchItemListByCategoryId = (category_id, callback) => {
		if (!App.isShopOpen) {
			callback([])
			return
		}
		Api.sheet({
			route: `get_all_item_by_category_id`,
			query: { category_id },
			callback: function(response) {
				checkNetworkResponse(response, callback)
			}
		})
	}

	const toggleAnimation = (isLoading) => {
		if (isLoading) {
			LoadingAnimation.play()
			LoadingPage.show()
			Page.show()
		} else {
			LoadingAnimation.stop()
			LoadingPage.hide()
			Page.hide()
		}
	}

	const toggleErrorAnimation = (isError) => {
		if (isError) {
			ErrorAnimation.play()
			ErrorPage.show()
			Page.show()
		} else {
			ErrorAnimation.stop()
			ErrorPage.hide()
			Page.hide()
		}
	}

	const checkNetworkResponse = (response, callback) => {
		toggleAnimation(response.status == `loading`)

		if (response.status === `success`) {
			callback(response.data)
			toggleErrorAnimation(false)
		} else if (response.status == `error`) {
			if (App.isSupportedTelegram) App.showAlert(response.error)
			toggleErrorAnimation(true)
		}
	}

}(jQuery))
