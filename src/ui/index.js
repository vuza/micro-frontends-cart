const React = require('react')
const { renderToString } = require('react-dom/server')
// const { flushToHTML } = require('styled-jsx/server')
// const cheerio = require('cheerio')
const request = require('request-promise-native')
import App from './widget'
const config = require('config')
const AWS = require('aws-sdk')

const awsCredentialsFilePath = config.get('aws.credentialsFilePath')
const awsS3Bucket = config.get('aws.s3Bucket')

if (awsCredentialsFilePath) {
  AWS.config.loadFromPath(awsCredentialsFilePath)
}

const s3 = new AWS.S3()

// TODO fix
s3.getObject({Bucket: awsS3Bucket, Key: 'travis-0bdd57bcec058da2aadceb66aa641525975fafa2-1517956392.zip'}).createReadStream().on('data', d => console.log(d))
s3.putObject({
  Body: 'alöksdfjaölsdfjk',
  Bucket: awsS3Bucket,
  Key: 'exampleobject'
}, (err, data) => {
  if (err) {
    return console.error(err)
  }

  console.log(data)
})

module.exports = {
  serveWidget: (req, res) => {
    _getUserData(req.cookies.token)
      .then(data => {
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
    requestUserData = () => request(`${config.get('userServiceConnectionString')}/user/api/user/${token}`)
  }

  return requestUserData()
    .then(data => data ? JSON.parse(data) : {})
    .catch(() => {
      console.error('Error catching user data')
      return {}
    })
}
