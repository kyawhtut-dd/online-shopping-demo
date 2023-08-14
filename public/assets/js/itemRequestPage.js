(function(jQuery) {

	const BASE_URL = `https://script.google.com/macros/s/AKfycbzid6fJqnEQnz5NxR-CL-r0E84AKfS280BeZuaYMha_1i9fC2COdZCvhYdh7N0G-9ahZg/exec`

	let request = null
	let page = null
	let App = null
	let Api = $.Api(BASE_URL)
	let requestList = []
	let networkCallback = null
	let isListPage = false

	function checkMainButton() {
		let MainButton = App.MainButton

		let isAvailable = request != null && request.request_title != null && request.request_message != null && request.request_item_website != null && request.request_contact != null

		if (isAvailable) {
			MainButton.color = App.themeParams().button_color
			MainButton.enable()
			App.enableClosingConfirmation()
		} else {
			MainButton.color = "#d5d0d0"
			MainButton.disable()
			App.disableClosingConfirmation()
		}
	}

	function renderInputPage() {
		if (page == null) return

		App.MainButton.text = `Submit`
		App.showMainButton()
		App.showBackButton()

		request = {
			request_title: null,
			request_message: null,
			request_item_website: null,
			request_contact: null
		}
		page.empty()
		page.append(`
			<div class="material-input-group mt-4">
				<input type="text" required id="inputTitle">
				<span class="highlight"></span>
				<span class="bar"></span>
				<label>Title</label>
			</div>
			<div class="material-input-group">
				<textarea required id="inputMessage"></textarea>
				<span class="highlight"></span>
				<span class="bar"></span>
				<label>Message</label>
			</div>
			<div class="material-input-group">
				<input type="text" required id="inputWebsite">
				<span class="highlight"></span>
				<span class="bar"></span>
				<label>Website</label>
			</div>
			<div class="material-input-group">
				<textarea required id="inputContact"></textarea>
				<span class="highlight"></span>
				<span class="bar"></span>
				<label>Contact</label>
			</div>
		`)

		page.show()

		$(`#inputTitle`).on(`input`, function(e) {
			request.request_title = null
			let val = $(this).val()
			if (val != ``) {
				request.request_title = val
			}
			checkMainButton()
		})
		$(`#inputMessage`).on(`input`, function(e) {
			request.request_message = null
			let val = $(this).val()
			if (val != ``) {
				request.request_message = val
			}
			checkMainButton()
		})
		$(`#inputWebsite`).on(`input`, function(e) {
			request.request_item_website = null
			let val = $(this).val()
			if (val != ``) {
				request.request_item_website = val
			}
			checkMainButton()
		})
		$(`#inputContact`).on(`input`, function(e) {
			request.request_contact = null
			let val = $(this).val()
			if (val != ``) {
				request.request_contact = val
			}
			checkMainButton()
		})

		checkMainButton()
	}

	function renderListPage() {
		if (page == null) return

		request = null

		App.MainButton.text = `ပစ္စည်း အသစ် မှာရန်`
		App.MainButton.color = Telegram.WebApp.themeParams.button_color
		App.MainButton.enable()
		App.showMainButton()
		App.disableClosingConfirmation()
		App.hideBackButton()

		page.empty()
		let divRow = $(`<div>`, {
		})

		requestList.forEach((item, index) => {
			let button = $(`<button>`, {
				'class': `btn btn-primary btn-sm`
			}).text(`Website`)
			button.click(function() {
				Telegram.WebApp.openLink(item.request_item_website)
			})
			let cardClass = `col-12 mb-2 card`
			if (index == 0) {
				cardClass = `col-12 mt-2 mb-2 card`
			}
			let spanClass = ``
			if (item.request_status === `PENDING`) {
				spanClass = `request-status-pending`
			} else if (item.request_status === `CHECKING`) {
				spanClass = `request-status-checking`
			} else if (item.request_status === `COMPLETE`) {
				spanClass = `request-status-complete`
			}
			let card = $(`<div>`, {
				'class': cardClass
			}).append($(`<div>`, {
				'class': `card-body`
			}).append($(`<h5>`, {
				'class': `card-title`
			}).text(item.request_title)).append($(`<h6>`, {
				'class': `card-subtitle-title text-body-secondary`
			}).text(`Contact - ${item.request_contact}`)).append($(`<p>`, {
				'class': `card-text`
			}).text(item.request_message)).append(button)).append($(`<span>`, {
				'class': `request-status ${spanClass}`
			}).text(item.request_status))

			divRow.append(card)
		})

		page.append(divRow)

		page.show()
	}

	function checkTheme() {
		let r = document.querySelector(":root")
		if (App.themeParams().button_color != null) {
			r.style.setProperty(`--input_color`, App.themeParams().button_color)
		}
	}

	function submitForm() {
		if (request == null) {
			checkTheme()
			renderInputPage()
			return
		}
		Api.sheet({
			route: `requestForm`,
			payload: request,
			token: $.Utils().localStorage.token,
			callback: function(response) {
				App.hideMainButton()
				if (networkCallback != null) {
					networkCallback(response)
				}

				if (response.status == `success`) {
					requestList = response.data
					if (!isListPage) {
						App.sendData(JSON.stringify({request_id: response.data[0].request_id}))
					} else renderListPage()
				}
			}
		})
	}

	function fetchList(isNeedToUIRender) {
		Api.sheet({
			route: `request_list_by_user_id`,
			token: $.Utils().localStorage.token,
			callback: function(response) {
				if (isNeedToUIRender && networkCallback != null) {
					networkCallback(response)
				}
				if (response.status === `success`) {
					requestList = response.data
					if (isNeedToUIRender) {
						renderListPage()
					} else if (request != null) {
						page.show()
					}
				}
			}
		})
	}

	jQuery.ItemRequestPage = function (app, div) {
		page = $(div)
		App = app

		return {
			setListPage(listPage) {
				isListPage = listPage
			},

			fetchList() {
				fetchList(false)
			},

			setNetworkCallback(callback) {
				networkCallback = callback
			},

			inputPage() {
				checkTheme()
				renderInputPage()
			},

			listPage() {
				fetchList(true)
			},

			hide() {
				page.hide()
			},

			goBack(callback) {
				if (App.MainButton.isActive && request != null) {
					App.showPopup(
						"Online Shop | Dev",
						"Changes that you made may not be saved",
						[
							{
								id: 'close_anyway', 
								type: 'destructive', 
								text: 'Close anyway'
							},
							{
								type: 'cancel'
							}
						], 
						function(button_id) {
							if (button_id === "close_anyway") {
								if (requestList.length == 0) {
									request = null
									callback()
								} else renderListPage()
							}
						}
					)
				} else {
					if (requestList.length == 0) {
						request = null
						callback()
					} else renderListPage()
				}
			},

			submitForm() {
				submitForm()
			}
		}
	}
}(jQuery))
