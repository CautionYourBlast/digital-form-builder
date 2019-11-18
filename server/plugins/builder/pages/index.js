const EngineBasePage = require('digital-form-builder-engine/page')
const { uploadDocument, fileStreamsFromPayload, saveFileToTmp } = require('./../../../lib/documentUpload')

class Page extends EngineBasePage {
  get getRouteOptions () {
    return {
      ext: {
        onPostHandler: {
          method: (request, h) => {
            console.log(`GET onPostHandler ${this.path}`)
            return h.continue
          }
        }
      }
    }
  }

  get postRouteOptions () {
    return {
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 5e+6 // 5mb
      },
      ext: {
        onPreHandler: {
          method: async (request, h) => {
            let files = fileStreamsFromPayload(request.payload)
            let state = await this.model.getState(request)
            let originalFilenames = state.originalFilenames || {}
            for (let file of files) {
              let key = file[0]
              let previousUpload = originalFilenames[key]
              if (file[1]._data.length > 1) {
                try {
                  let saved = await saveFileToTmp(file[1])
                  let { error, location } = await uploadDocument(saved)
                  if (location) {
                    originalFilenames[key] = { originalFilename: file[1].hapi.filename, location }
                    h.request.payload[key] = location
                  }
                  if (error) {
                    h.request.pre.errors = [...h.request.pre.errors, {
                      path: key, href: `#${key}`, name: key, text: 'This file contains a virus'
                    }]
                  }
                } catch (e) {
                  h.request.pre.errors = [...h.request.pre.errors, {
                    path: key, href: `#${key}`, name: key, text: e
                  }]
                }
              } else if (previousUpload && file[1]._data.length < 1) {
                h.request.payload[key] = previousUpload.location
              } else {
                delete request.payload[key]
              }
            }
            await this.model.mergeState(request, { originalFilenames })
            return h.continue
          }
        },
        onPostHandler: {
          method: async (request, h) => {
            return h.continue
          }
        }
      }
    }
  }
}

module.exports = Page
