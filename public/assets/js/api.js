(function (jQuery) {
	"use strict"

	let ajax = {}

	const STATUS = {
		LOADING: "loading",
		SUCCESS: "success",
		ERROR: "error"
	}

	function Api(base_url) {
		this.baseURL = base_url
	}

	Api.prototype.sheet = function({route, query = null, token = null, payload = null, callback}) {
		route = this.baseURL + `?route=${route}`

		if (ajax != null && ajax[route] != null) {
			ajax[route].abort()
		}

		if (query != null) {
			$.each(query, function(key, value) {
				route += `&${key}=${value}`
			})
		}

		if (payload != null) {
			route += `&payload=${JSON.stringify(payload)}`
		}

		if (token != null) {
			route += `&token=${token}`
		}

		let response = {
			status: STATUS.LOADING,
			status_code: null,
			data: null,
			error: null
		}

		ajax[route] = $.ajax({
			url: route,
			type: `get`,
			beforeSend: function() {
				callback(response)
			},
			complete: function() {
			},
			success: function(resp) {
				response.status_code = resp.status
				if (resp.status === 200) {
					response.status = STATUS.SUCCESS
				} else {
					response.status = STATUS.ERROR
				}
				response.error = resp.message
				response.data = resp.data
				callback(response)
			},
			error: function(jqXHR, exception) {
				response.status_code = jqXHR.status
				response.status = STATUS.ERROR
				response.error = parseError(jqXHR, exception)
				callback(response)
			}
		})
	}

	Api.prototype.get = function(path, callback) {

		let route = this.baseURL + path

		if (ajax != null && ajax[route] != null) {
			ajax[route].abort()
		}

		let response = {
			status: STATUS.LOADING,
			data: null,
			error: null
		}

		ajax[route] = $.ajax({
			url: route,
			type: `get`,
			beforeSend: function() {
				callback(response)
			},
			complete: function() {
			},
			success: function(resp) {
				response.status_code = resp.status
				if (resp.status === 200) {
					response.status = STATUS.SUCCESS
				} else {
					response.status = STATUS.ERROR
				}
				response.error = resp.message
				response.data = resp.data
				callback(response)
			},
			error: function(jqXHR, exception) {
				response.status_code = jqXHR.status
				response.status = STATUS.ERROR
				response.error = parseError(jqXHR, exception)
				callback(response)
			}
		})
	}

	Api.prototype.post = function({path, method = `post`, jsonData, callback}) {

		if (ajax != null && ajax[path] != null) {
			ajax[path].abort()
		}

		let response = {
			status: STATUS.LOADING,
			data: null,
			error: null
		}

		ajax[path] = $.ajax({
			url: this.baseURL,
			type: method,
			data: JSON.stringify(jsonData),
			contentType: `application/json; charset=utf-8`,
			beforeSend: function() {
				callback(response)
			},
			complete: function() {
			},
			success: function(resp) {
				response.status_code = resp.status
				if (resp.status === 200) {
					response.status = STATUS.SUCCESS
				} else {
					response.status = STATUS.ERROR
				}
				response.error = resp.message
				response.data = resp.data
				callback(response)
			},
			error: function(jqXHR, exception) {
				response.status_code = jqXHR.status
				response.status = STATUS.ERROR
				response.error = parseError(jqXHR, exception)
				callback(response)
			}
		})
	}

	function parseError(jqXHR, exception) {
		var msg = ``
		let status = jqXHR.status

		if (status === `(failed)net:ERR_INTERNET_DISCONNECTED`) {
			msg = `Uncaught Error.\n${jqXHR.responseText}`
		} else if (status === 0) {
			msg = `Not connect.\nVerify Network.`
		} else if (status === 413) {
			msg = `Image size is too large`
		} else if (status == 404) {
			msg = `Requested page not found [404]`
		} else if (status == 405) {
			msg = `Image size is too large`
		} else if (status == 500) {
			msg = `Internal Server Error [500]`
		} else if (exception === `parsererror`) {
			msg = `Requested JSON parse failed.`
		} else if (exception === `timeout`) {
			msg = `Time out error.`
		} else if (exception === `abort`) {
			msg = `Ajax request aborted.`
		} else {
			msg = `Uncaught Error.\n${jqXHR.responseText}`
		}

		return msg
	}

	jQuery.Api = function(base_url) {
		return new Api(base_url)
	}
}(jQuery))
