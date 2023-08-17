(function (jQuery) {

	jQuery.Animation = function() {
		return {
			slideUp,
			slideDown,
		}
	}

	const slideUp = (view, complete) => {
		view.slideUp({ complete })
	}

	const slideDown = (view, complete) => {
		view.slideDown({ complete })
	}
}(jQuery))
