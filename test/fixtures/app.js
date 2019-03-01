'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')
const User = require('./model/User')
const Role = require('./model/Role')

module.exports = _.defaultsDeep({
  pkg: {
    name: 'mongoose-spool-test'
  },
  api: {
    models: {
      User: User,
      Role: Role
    }
  },
  config: {
    log: {
      logger: new smokesignals.Logger('error')
    },
    main: {
      packs: [
        require('../.') // spool-mongoose
      ]
    },
    database: {
      stores: {
        teststore: {
          uri: 'mongodb://localhost:27017/test',
          options: {

          }
        },
        storeoverride: {
          uri: 'mongodb://localhost:27017/test2',
          options: {

          }
        },
        notMongoStore: {
          uri: 'postgres://localhost:5432/tests',
          options: {}
        }
      },
      models: {
        defaultStore: 'teststore',
        migrate: 'drop'
      }
    }
  }
}, smokesignals.FailsafeConfig)
