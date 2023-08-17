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
		Animation = bodymovin.loadAnimation({
			container: Page[0],
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: `./assets/animation/loading.json`
		})
	}

	const fetchCategoryList = (callback) => {
		Api.sheet({
			route: `get_category_list`,
			callback: function(response) {
				checkNetworkResponse(response, callback)
			}
		})

	}

	const fetchItemListByCategoryId = (category_id, callback) => {
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
			Animation.play()
			Page.show()
		} else Page.hide()
	}

	const checkNetworkResponse = (response, callback) => {
		toggleAnimation(response.status == `loading`)

		if (response.status === `success`) {
			callback(response.data)
		} else if (response.status == `error`) {
			App.showAlert(response.error)
		}
	}

}(jQuery))
