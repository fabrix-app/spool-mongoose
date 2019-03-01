import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import * as _ from 'lodash'

/**
 * @module SchemaMigrationService
 * @description Schema Migrations
 */
export class SchemaMigrationService extends Service {

  /**
   * @param connection connection object
   *
   * Drop collections in current connection
   */
  drop (connection) {
    return Promise.all(
      _.map(connection.collections, collection => {
        return new Promise((resolve, reject) => {
          collection.drop((err) => {
            resolve()
          })
        })
      }))
  }

  /**
   * Alter an existing schema
   */
  alter (connection) {
    throw new Error('spool-mongoose does not currently support migrate=alter')
  }
}
