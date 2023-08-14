(function(jQuery) {

	jQuery.Utils = function() {
		return {
			localStorage: localStorage,

			logout() {
				this.localStorage.clear()
			},

			getParameter(key) {
				key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
				var regx = new RegExp("[\\?&]" + key + "=([^&#]*)")
				let results = regx.exec(location.search)
				return results === null ? `` : decodeURIComponent(results[1].replace(/\+/g, " "))
			},
		}
	}
}(jQuery))
