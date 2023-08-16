(function (jQuery) {
	"use strict";

	const BASE_URL = `https://script.google.com/macros/s/AKfycbzLhyJygr1MJQwNOznnDnKtxXB2MO2xtmw2dfEw5LLwh-sxaBjs2FZnl6PIBYG7EzMD/exec`

	function checkUser(App) {
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

	jQuery.App = function() {

		let app = {
			BackButton: Telegram.WebApp.BackButton,
			MainButton: Telegram.WebApp.MainButton,
			initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
			id: null,
			username: null,
			displayname: null,
			Api: $.Api(BASE_URL),
			isRegister: false,

			init() {
				this.MainButton.hide()
				this.BackButton.hide()

				try {
					this.id = this.initDataUnsafe.user.id || null
				} catch (e) {
					this.id = $.Utils().getParameter("id")
					console.log(e)
				}

				console.log(this.id)

				checkUser(this)

				return this
			},

			enableClosingConfirmation() {
				Telegram.WebApp.enableClosingConfirmation()
			},

			disableClosingConfirmation() {
				Telegram.WebApp.disableClosingConfirmation()
			},

			showMainButton() {
				this.MainButton.show()
			},

			hideMainButton() {
				this.MainButton.hide()
			},

			showBackButton() {
				this.BackButton.show()
			},

			hideBackButton() {
				this.BackButton.hide()
			},

			sendData(data) {
				Telegram.WebApp.sendData(data)
			},

			expandApp() {
				Telegram.WebApp.expand()
			},

			showAlert(message, callback) {
				Telegram.WebApp.showAlert(message, callback)
			},

			showConfirm(message, callback) {
				Telegram.WebApp.showConfirm(message, function(button_id) {
					callback(button_id)
				})
			},

			themeParams() {
				return Telegram.WebApp.themeParams
			},

			showPopup(title, message, buttons, callback) {
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
			},

			showConfirmClose() {
				this.showPopup(
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
						if (button_id === "close_anyway") this.close()
					}
				)
			},

			close() {
				Telegram.WebApp.close()
			}
		}
		return app.init()
	}
}(jQuery))
