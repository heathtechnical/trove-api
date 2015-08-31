pkg = require __dirname + '/../../../package.json'

routes = {
  '/': {
    method: 'get'
    fn: (req, res) ->
      if req.params.fail?
        return res.status(400).json({ success: 'no' })

      return res.json
        name: pkg.description
        version: pkg.version
  }
}

module.exports =
  mount: '/',
  routes: routes
