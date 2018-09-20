// const path = require('path')
const { getState, mergeState } = require('../db')
const config = require('../config')
// const dataFilePath = path.join(__dirname, '../govsite.demo.json')
// const data = require(dataFilePath)
const playgroundModel = require('../govsite.playground.json')

module.exports = [{
  plugin: require('digital-form-builder-engine'),
  options: { getState, mergeState, ordnanceSurveyKey: config.ordnanceSurveyKey, playgroundModel }
}, {
  plugin: require('digital-form-builder-designer'),
  options: { playgroundModel }
}]
