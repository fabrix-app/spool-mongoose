import { DatastoreSpool } from '@fabrix/fabrix/dist/common/spools/datastore'

import * as _ from 'lodash'
import * as mongoose from 'mongoose'

import { Transformer } from './transformer'

import * as config from './config'
import * as pkg from '../package.json'
import * as api  from './api/index'

/**
 * Mongoose integration for Fabrix. Allows mongoose to read its configration from the
 * fabrix datastore config, and auto-migrate on startup.
 */
export class MongooseSpool extends DatastoreSpool {
  public mongoose

  private _connections: {[key: string]: any} = { }
  private _models: {[key: string]: any} = { }

  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: api
    })
  }

  get models() {
    return this._models || {}
  }

  get connections () {
    return this._connections || {}
  }

  /**
   * Ensure that this spool supports the configured migration
   */
  validate () {
    if (!_.includes([ 'none', 'drop', 'create' ], this.app.config.get('models.migrate'))) {
      throw new Error('Migrate must be configured to either "create" or "drop"')
    }
  }

  /**
   * Create default configuration
   */
  configure () {
    // this.app.config.set('stores.orm', 'mongoose')

    this.mongoose = mongoose
  }

  /**
   * Initialize mongoose connections, and perform migrations.
   */
  initialize () {
    super.initialize()

    // Binding promise library
    // We will use default one
    mongoose.Promise = global.Promise

    this._models = Transformer.transformModels(this.app)

    this.orm = this.orm || {}
    // Need to pick only mongoose stores
    const stores = Transformer.pickStores(this.app.config.get('stores'))
    // iterating only through mongo stores
    this._connections = _.mapValues(stores, (_store, storeName) => {
      const store = _.merge({ }, _store)
      if (!_.isString(store.uri)) {
        throw new Error('Store have to contain "uri" option')
      }

      if (!_.isObject(store.options)) {
        store.options = {}
      }

      const connection = mongoose.createConnection(store.uri, store.options)
      const models = _.pickBy(this.models, { connection: storeName })

      _.map(models, model => {
        const schema = new mongoose.Schema(model.schema, model.schemaOptions)
        // Bind statics & methods
        schema.statics = model.statics
        schema.methods = model.methods

        model.onSchema(this.app, schema)

        // create model
        this.orm[model.globalId] = connection.model(model.globalId, schema, model.tableName)
        this.spools.mongoose.orm[model.identity] = this.orm[model.globalId]
      })

      return connection
    })

    this.app.orm = this.orm

    return this.migrate()
  }

  /**
   * Close all database connections
   */
  unload () {
    return Promise.all(
      _.map(this.connections, connection => {
        return new Promise((resolve, reject) => {
          connection.close((err) => {
            if (err) {
              return reject(err)
            }

            resolve()
          })
        })
      })
    )
  }

  /**
   * Run migrations
   */
  migrate () {
    const SchemaMigrationService = this.app.services.SchemaMigrationService
    const models = this.app.config.get('models')

    if (models.migrate === 'none') {
      return
    }

    return Promise.all(
      _.map(this.connections, connection => {
        if (models.migrate === 'drop') {
          return SchemaMigrationService.drop(connection)
        }
      }))
  }
}
