#module.exports.controller = (router, app) ->
#  router.route('/').get (req, res) ->
#    res.json
#      name: 'fCrunch',
#      version: '0.0.1'

routes = {
  '/': {
    method: 'get'
    fn: (req, res) ->
      if req.params.fail?
        return res.status(400).json({ success: 'no' })
      return res.json
        name: 'fCrunch'
        version: '0.0.1'
  }
}

module.exports =
  mount: '/',
  routes: routes
