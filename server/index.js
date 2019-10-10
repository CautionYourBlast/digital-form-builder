const hapi = require('hapi')
const config = require('./config')
const { routes } = require('./plugins/builder')

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
  await server.register(require('./plugins/locale'))
  await server.register(require('./plugins/session'))
  await server.register(require('./plugins/views'))
  await server.register(routes)
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  return server
}

module.exports = createServer
