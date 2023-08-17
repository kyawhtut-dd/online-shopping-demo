(function (jQuery) {

	let App = null
	
	let pages = []
	let mainPage = null
	let currentPage = null
	let animationPage = null
	let pageStack = []

	function toggleCurrentPage() {
		let isShowingLoading = false
		let isShowingError = false
		if (loadingPage != null) {
			isShowingLoading = loadingPage.isShowing()
		}
		if (errorPage != null) {
			isShowingError = errorPage.isShowing()
		}

		if (isShowingLoading || isShowingError) {
			if (currentPage != null) currentPage.hide()
			return
		}

		if (currentPage != null) currentPage.show()
	}

	jQuery.Home = function(app) {
		App = app
		return {
			init(page) {
				mainPage = page
				currentPage = page
				pageStack.push(page)
			},

			canGoback() {
				return pageStack.length > 1
			},

			goBack() {
				let goBackPage = pageStack.pop()
				goBackPage.hide()
				
				currentPage = pageStack[pageStack.length - 1]
				if (pageStack.length == 1) App.hideBackButton()
				currentPage.show()
			},

			openPage(page) {
				App.showBackButton()
				this.getCurrentPage().hide()

				currentPage = page
				pageStack.push(page)
				
				this.getCurrentPage().show()
			},

			setAnimationPage(page) {
				animationPage = page
			},

			getCurrentPage() {
				return currentPage
			},

			networkResult(result) {
				if (currentPage != null) currentPage.hide()

				if (result.status_code === 401) {
					$.Utils().logout()
				}

				if (result.status === `loading` && animationPage != null) {
					animationPage.loading()
				} else if (result.status === `error` && animationPage != null) {
					animationPage.error()
				} else if ((result.data == null || (result.data.constructor === Array && result.data.length == 0)) && animationPage != null) {
					animationPage.empty()
				} else {
					if (animationPage != null) animationPage.hide()
				}
			},

			registerPage(page) {
				pages.push(page)
			},
		}
	}
}(jQuery))
