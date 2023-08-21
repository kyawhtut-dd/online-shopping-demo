(function (jQuery) {
	"use strict";

	const BASE_URL = `https://script.google.com/macros/s/AKfycbzLhyJygr1MJQwNOznnDnKtxXB2MO2xtmw2dfEw5LLwh-sxaBjs2FZnl6PIBYG7EzMD/exec`
	
	let initDataUnsafe = Telegram.WebApp.initDataUnsafe || {}
	let DEBUG = false

	let App = {
		id: null,
		username: null,
		displayname: null,
		isRegister: false,
		MainButton: Telegram.WebApp.MainButton,
		BackButton: Telegram.WebApp.BackButton,
		Api: $.Api(BASE_URL),
		isSupportedTelegram: Telegram.WebApp.platform != `unknown`,
		isShopOpen: false,
	}

	jQuery.App = function(debug = false) {
		DEBUG = debug
		App.isShopOpen = App.isSupportedTelegram || DEBUG

		init()

		App.enableClosingConfirmation = enableClosingConfirmation
		App.disableClosingConfirmation = disableClosingConfirmation
		App.showMainButton = showMainButton
		App.hideMainButton = hideMainButton
		App.showBackButton = showBackButton
		App.hideBackButton = hideBackButton
		App.sendData = sendData
		App.expandApp = expandApp
		App.showAlert = showAlert
		App.showConfirm = showConfirm
		App.showPopup = showPopup
		App.showConfirmClose = showConfirmClose
		App.themeParams = themeParams
		App.close = close

		return App
	}

	const init = () => {

		processButton()

		try {
			App.id = initDataUnsafe.user.id || null
		} catch (e) {
			App.id = $.Utils().getParameter(`id`)
			console.log(e)
		}
		console.log(App.id)

		if (!App.isShopOpen) {
			// make shop inactive
			$(`body`).addClass(`closed`)
		} else {
			$(`body`).removeClass(`closed`)
			$(`#shopCloseLabel`).remove()
		}

		if (App.isShopOpen) {
			checkUser()
		}
	}

	const processButton = () => {
		if (!App.isSupportedTelegram && DEBUG) {
			let mButton = $(`<div>`, {
				'class': `main-button`
			})
			let bButton = $(`<div>`, {
				'class': `back-button`
			})
			$(`body`).append(mButton)
			$(`body`).append(bButton)
			App.MainButton = BootstrapMainButton(mButton)
			App.BackButton = BootstrapBackButton(bButton)
		}

		hideMainButton()
		hideBackButton()
	}

	const themeParams = () => {
		return Telegram.WebApp.themeParams
	}

	const enableClosingConfirmation = () => {
		Telegram.WebApp.enableClosingConfirmation()
	}

	const disableClosingConfirmation = () => {
		Telegram.WebApp.disableClosingConfirmation()
	}

	const showMainButton = () => {
		App.MainButton.show()
	}

	const hideMainButton = () => {
		App.MainButton.hide()
	}

	const showBackButton = () => {
		App.BackButton.show()
	}

	const hideBackButton = () => {
		App.BackButton.hide()
	}

	const sendData = (data) => {
		Telegram.WebApp.sendData(data)
	}

	const expandApp = () => {
		Telegram.WebApp.expand()
	}

	const showAlert = (message, callback) => {
		Telegram.WebApp.showAlert(message, callback)
	}

	const showConfirm = (message, callback) => {
		Telegram.WebApp.showConfirm(message, function(button_id) {
			callback(button_id)
		})
	}

	const showPopup = (title, message, buttons, callback) => {
		// [
		// 	{
		// 		id: 'delete', 
		// 		type: 'destructive', 
		// 		text: 'Delete all'
		// 	},
		// 	{
		// 		id: 'faq', 
		// 		type: 'default', 
		// 		text: 'Open FAQ'
		// 	},
		// 	{
		// 		type: 'cancel'
		// 	},
		// ]
		Telegram.WebApp.showPopup({
			title: title,
			message: message,
			buttons: buttons
		}, function(button_id) {
			callback(button_id)
			if (buttonId === 'delete') {
			DemoApp.showAlert("'Delete all' selected");
			} else if (buttonId === 'faq') {
			Telegram.WebApp.openLink('https://telegram.org/faq');
			}
		})
	}

	const showConfirmClose = () => {
		showPopup(
			"Online Shop Demo",
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
				if (button_id === "close_anyway") close()
			}
		)
	}

	const close = () => {
		Telegram.WebApp.close()
	}

	const checkUser = () => {
		if (App.id == null || App.id == ``) return
		App.Api.sheet({
			route: `check_user`,
			query: {
				user_id: App.id
			},
			callback: function(response) {
				App.isRegister = false
				if (response.status == `success` && response.data != null) {
					App.username = response.data.user_name
					App.displayname = [response.data.first_name, response.data.last_name].join(" ")
					App.isRegister = true
				}
			}
		})
	}

	const BootstrapMainButton = (parent) => {
		let child = $(`<button>`)
		$.Utils().setRipple(child)
		
		parent.append(child)

		let object = {
			text: ``,
			color: null,
			textColor: null,
			show: () => {
				parent.show()
			},
			hide: () => {
				parent.hide()
			},
			disable: () => {
				child.prop('disabled', true)
			},
			enable: () => {
				child.prop('disabled', false)
			},
			onClick: (callback) => {
				child.click(callback)
			}
		}
		Object.defineProperty(object, `text`, {
			get: function() {
				return child.text()
			},
			set: function(value) {
				child.text(value)
			}
		})
		Object.defineProperty(object, `color`, {
			get: function() {
				return $.Utils().rgbToHex(child.css('background-color'))
			},
			set: function(value) {
				child.css({'background-color': $.Utils().rgbToHex(value)})
			}
		})
		Object.defineProperty(object, `textColor`, {
			get: function() {
				return $.Utils().rgbToHex(child.css('color'))
			},
			set: function(value) {
				child.css({'color': $.Utils().rgbToHex(value)})
			}
		})
		return object
	}

	const BootstrapBackButton = (parent) => {
		parent.empty()

		let hideIcon = `fa-times`
		let showIcon = `fa-arrow-left`

		let icon = $(`<i>`, {
			'class': `fa`,
			'aria-hidden': `true`
		})
		parent.append(icon)

		return {
			show: () => {
				icon.removeClass(hideIcon)
				icon.addClass(showIcon)
			},
			hide: () => {
				icon.removeClass(showIcon)
				icon.addClass(hideIcon)
			},
			onClick: (callback) => {
				parent.click(callback)
			}
		}
	}
}(jQuery))
