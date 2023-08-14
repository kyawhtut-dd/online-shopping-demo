(function (jQuery) {

	const BASE_URL = `https://script.google.com/macros/s/AKfycbzLhyJygr1MJQwNOznnDnKtxXB2MO2xtmw2dfEw5LLwh-sxaBjs2FZnl6PIBYG7EzMD/exec`
	let App = null
	let Page = null
	let itemList = []

	function renderPage() {

		Page.empty()

		if (itemList.length == 0) return

		let row = $(`<table>`, {
			'class': `row`
		})
		itemList.forEach(item => {
			let parent = $(`<div>`, {
				'class': `col-4 mt-2 mb-3 text-center category-container`,
			})

			parent.append($(`<img>`, {
				'src': item.category_logo
			}))
			parent.append($(`<p>`).text(item.category_name))

			let btnShop = $(`<span>`, {
				'id': `btn-${item.category_id}`
			}).text(`Shop`)
			btnShop.click(function() {
				window.location.replace(`item_page.html?category_id=${item.category_id}`)
			})
			parent.append(btnShop)

			row.append(parent)
		})

		Page.append(row)
		Page.show()
	}

	jQuery.CategoryPage = function(app, div) {
		App = app
		Page = $(div)
		Page.empty()

		return {
			show() {
				Page.show()
			},

			hide() {
				Page.hide()
			},

			fetch(callback) {
				let api = $.Api(BASE_URL)
				api.sheet({
					route: `get_category_list`,
					callback: function(response) {
						callback(response)
						if (response.status === `success`) {
							if (response.data != null) itemList = response.data
							renderPage()
						}
					}
				})
			}
		}
	}
}(jQuery))
