(function(jQuery) {

	let App = null
	let Api = null
	let Page = null
	let Animation = null

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
		Page.empty()
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

	const toggleAnimation = (isLoading, isError) => {
		if (!isLoading && !isError) {
			Animation.stop()
			Page.empty()
			Page.hide()
			return
		}

		let AnimationPath = `./assets/animation/loading.json`

		if (isError) {
			AnimationPath = `./assets/animation/error.json`
		}

		Animation = bodymovin.loadAnimation({
			container: Page[0],
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: AnimationPath
		})

		Animation.play()
		Page.show()
	}

	const checkNetworkResponse = (response, callback) => {
		toggleAnimation(response.status == `loading`, response.status == `error`)

		if (response.status === `success`) {
			callback(response.data)
		} else if (response.status == `error` && App.isSupportedTelegram) {
			App.showAlert(response.error)
		}
	}

}(jQuery))
