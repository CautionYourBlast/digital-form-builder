const { caseManagementPostRequest } = require('./../lib/caseManagement')
const Cache = require('./../db')

const applicationStatus = {
  plugin: {
    name: 'applicationStatus',
    dependencies: 'vision',
    multiple: true,
    register: (server) => {
      server.route({
        method: 'get',
        path: '/status',
        handler: async (request, h) => {
          const { notifyService, payService } = request.services([])
          const { pay } = await Cache.getState(request)
          const basePath = request.yar.get('basePath')
          if (pay) {
            const { self, reference } = pay
            const { state } = await payService.payStatus(self)
            if (state.finished) {
              switch (state.status) {
                case 'success':
                  let { caseManagementData } = await Cache.getState(request)
                  let response = await caseManagementPostRequest(caseManagementData)
                  let { notifyOptions } = await Cache.getState(request)
                  let { templateId, personalisations } = notifyOptions
                  notifyService.sendNotification(templateId, 'jen@cautionyourblast.com', response.reference, personalisations || {})
                  await Cache.clearState(request)
                  if (response.reference === 'UNKNOWN') {
                    return h.view('confirmation', { })
                  }
                  return h.view('confirmation', { reference: response.reference })
                case 'failed':
                case 'error':
                  return h.view('application-error', { reference, errorList: ['there was a problem with your payment'] })
              }
            } else {
              // TODO:- unfinished payment flow?
            }
          } else {
            return h.redirect(`${basePath}`)
          }
        }
      })
    }
  }
}

module.exports = applicationStatus
