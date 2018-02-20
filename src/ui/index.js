const React = require('react')
const { renderToString } = require('react-dom/server')
// const { flushToHTML } = require('styled-jsx/server')
// const cheerio = require('cheerio')
const request = require('request-promise-native')
import App from './widget'
const config = require('config')

module.exports = {
  serveWidget: (req, res) => {
    _getUserData(req.cookies.token)
      .then(data => {
        console.log(JSON.stringify(data))

        const html = renderToString(
          <App {...data} />
        )

        // const styles = flushToHTML()
        // const $ = cheerio.load(styles)

        // TODO write it to db
        // Provide it via specific route

        // Every Fragment sends a link header that describes its resources - css and js
        // const css = `<http://localhost:${port}/styles${$('style').attr('id')}.css>; rel="stylesheet"`

        res.set({
          // Link: `${css}`,
          'Content-Type': 'text/html'
        })

        res.end(html)
      })
  }
}

const _getUserData = token => {
  let requestUserData = () => Promise.resolve()

  if (token) {
    requestUserData = () => request(`${config.get('userServiceConnectionString')}/api/user/${token}`)
  }

  return requestUserData()
    .then(data => data ? JSON.parse(data) : {})
    .catch(() => {
      console.error('Error catching user data')
      return {}
    })
}
