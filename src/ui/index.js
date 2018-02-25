const React = require('react')
const { renderToString } = require('react-dom/server')
const { flushToHTML } = require('styled-jsx/server')
const cheerio = require('cheerio')
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

const doesCssExist = name => new Promise((resolve, reject) => {
  s3.headObject({Bucket: awsS3Bucket, Key: `${name}.css`}, (err, data) => {
    if (err) {
      if (err.code === 'NotFound') {
        return resolve(false)
      }

      return reject(err)
    }

    resolve(true)
  })
})

const persistCss = (name, content) => new Promise((resolve, reject) => {
  s3.putObject({
    Body: content,
    Bucket: awsS3Bucket,
    Key: `${name}.css`,
    ContentType: 'text/css',
    ACL: 'public-read'
  }, (err, data) => {
    if (err) {
      return reject(err)
    }

    resolve()
  })
})

module.exports = {
  serveWidget: (req, res) => {
    _getUserData(req.cookies.token)
      .then(data => {
        const html = renderToString(
          <App {...data} />
        )

        const styles = flushToHTML()
        const $ = cheerio.load(styles)
        const cssHash = $('style').attr('id')

        doesCssExist(cssHash)
          .then(exists => {
            if (!exists) {
              return persistCss(cssHash, $('style').html())
            }
          })
          .then(() => {
            const css = `<http://${awsS3Bucket}.s3-website-us-east-1.amazonaws.com/${cssHash}.css>; rel="stylesheet"`

            res.set({
              Link: `${css}`,
              'Content-Type': 'text/html'
            })
          })
          .then(() => res.end(html))
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
