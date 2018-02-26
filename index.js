const express = require('express')
const path = require('path')
const config = require('config')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {serveWidget} = require('./src/ui')
const {handleProductPost} = require('./src/api')

const server = express()
const port = config.get('port')

server.use(cookieParser())
server.use(bodyParser.json())

server.get('/ui/widget', serveWidget)
server.get('/assets', express.static(path.join(__dirname, '/dist/assets')))
server.post('/api/product', handleProductPost)

server.listen(port, () => console.log(`listening to ${port}`))
