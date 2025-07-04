/**
 * Example Controller
 * This controller handles example API endpoints.
 */
module.exports = {
  getExample1: (req, res) => {
    return res.api('success', {}, 'Example1 endpoint works')
  },
  getExample2: (req, res) => {
    return res.api('success', null, 'Example2 endpoint works')
  },
  postExample3: (req, res) => {
    return res.api('success', req.body, 'Example3 endpoint works')
  }
}