(function (jQuery) {
	"use strict";

	const BASE_URL = `https://script.google.com/macros/s/AKfycbzLhyJygr1MJQwNOznnDnKtxXB2MO2xtmw2dfEw5LLwh-sxaBjs2FZnl6PIBYG7EzMD/exec`

	let id = null
	let username = null
	let displayname = null
	let Api = $.Api(BASE_URL)
	let isRegister = false
	let MainButton = Telegram.WebApp.MainButton
	let BackButton = Telegram.WebApp.BackButton
	let initDataUnsafe = Telegram.WebApp.initDataUnsafe || {}
	let isSupportedTelegram = Telegram.WebApp.webAppPlatform == null

	jQuery.App = function() {

		init()

		return {
			id,
			username,
			displayname,
			isRegister,
			MainButton,
			BackButton,
			Api,
			enableClosingConfirmation,
			disableClosingConfirmation,
			showMainButton,
			hideMainButton,
			showBackButton,
			hideBackButton,
			sendData,
			expandApp,
			showAlert,
			showConfirm,
			showPopup,
			showConfirmClose,
			themeParams,
			close
		}
	}

	const init = () => {
		if (isSupportedTelegram) {
			MainButton = $(`.main-button`)
			BackButton = $(`.back-button`)
		}

		hideMainButton()
		hideBackButton()

		try {
			id = initDataUnsafe.user.id || null
		} catch (e) {
			id = $.Utils().getParameter(`id`)
			console.log(e)
		}
		console.log(id)

		checkUser()
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
		MainButton.show()
	}

	const hideMainButton = () => {
		MainButton.hide()
	}

	const showBackButton = () => {
		BackButton.show()
	}

	const hideBackButton = () => {
		BackButton.hide()
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
		if (id == null || id == ``) return
		Api.sheet({
			route: `check_user`,
			query: {
				user_id: id
			},
			callback: function(response) {
				isRegister = false
				if (response.status == `success` && response.data != null) {
					username = response.data.user_name
					displayname = [response.data.first_name, response.data.last_name].join(" ")
					isRegister = true
				}
			}
		})
	}
}(jQuery))
