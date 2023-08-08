let doGet = (e) => {
  if (e.parameter.payload) {
    e.parameter.payload = JSON.parse(e.parameter.payload)
  }

  // Instantiate Request
  let request = new Request(e.parameter)
  request.DEBUG = true

  request.onRenderView(function (view, viewFile) {
    if (viewFile != null) return HtmlService.createHtmlOutputFromFile(viewFile)
    else return HtmlService.createHtmlOutput(view)
  })

  // Builing routes
  let route = new Route()

  route.authMiddleware(function (request) {
    if (request.route.startsWith("admin_")) {
      return adminUserAuth(request)
    } else return checkUserAuth(request)
  })

  regiseterRoute(route)

  // Register the route with request
  request.register(route)

  return request.process()
}

let doPost = (e) => {
  let telegramController = new TelegramController(e)

  if (telegramController.isTelegramRequest()) {
    telegramController.run()
    return
  }

  let parameter = null
  if (e.postData && e.postData.contents) {
    parameter = JSON.parse(e.postData.contents)
  } else if (e.parameter) {
    parameter = e.parameter
    if (parameter.payload) {
      parameter.payload = JSON.parse(parameter.payload)
    }
  } else {
    request.status = BAD_REQUEST
    request.message = BAD_REQUEST_MESSAGE
    return request.responseWithJson()
  }

  // Instantiate Request
  let request = new Request(parameter)
  request.DEBUG = true

  request.onRenderView(function (view, viewFile) {
    if (viewFile != null) return HtmlService.createHtmlOutputFromFile(viewFile)
    else return HtmlService.createHtmlOutput(view)
  })

  // Builing routes
  let route = new Route()

  route.authMiddleware(function (request) {
    if (request.route.startsWith("admin_")) {
      return adminUserAuth(request)
    } else return checkUserAuth(request)
  })

  regiseterRoute(route)

  // Register the route with request
  request.register(route)

  return request.process()
}

let regiseterRoute = (route) => {
  route.on(`signupUser`, UserController.signupUser, false)
}
