(function(jQuery) {

	jQuery.Utils = function() {
		return {
			localStorage,
			setRipple,
			rgbToHex,
			getParameter,
		}
	}

	const getParameter = (key) => {
		key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
		var regx = new RegExp("[\\?&]" + key + "=([^&#]*)")
		let results = regx.exec(location.search)
		return results === null ? `` : decodeURIComponent(results[1].replace(/\+/g, " "))
	}

	const rgbToHex = (rgb) => {
		if (rgb.search("rgb") == -1)
			return rgb
		else {
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			function hex(x) {
				return ("0" + parseInt(x).toString(16)).slice(-2);
			}
			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
	}

	const setRipple = (view) => {
		view.click(function(e) {

			const button = e.currentTarget

			const circle = document.createElement("span")
			
			const diameter = Math.max(button.clientWidth, button.clientHeight)
			const radius = diameter / 2

			circle.style.width = circle.style.height = `${diameter}px`
			circle.style.left = `${e.clientX - button.offsetLeft - radius}px`
			circle.style.top = `${e.clientY - button.offsetTop - radius}px`
			circle.classList.add("ripple")

			const ripple = button.getElementsByClassName("ripple")[0]

			if (ripple) {
				ripple.remove()
			}

			button.appendChild(circle)
		})
	}
}(jQuery))
