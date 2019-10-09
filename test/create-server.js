const hapi = require('hapi')
const config = require('./../server/config')
const { routes } = require('./builder')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  await server.register(require('inert'))
  await server.register(require('./../server/plugins/locale'))
  await server.register(require('./../server/plugins/session'))
  await server.register(require('./../server/plugins/views'))
  await server.register(routes)
  await server.register(require('./../server/plugins/router'))
  await server.register(require('./../server/plugins/error-pages'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./../server/plugins/logging'))
  }

  return server
}

module.exports = createServer
