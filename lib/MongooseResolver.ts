import { FabrixModel, FabrixResolver } from '@fabrix/fabrix/dist/common'
import { Mongoose, Model, DataTypes } from 'mongoose'
import { Transformer } from './transformer'

export class MongooseResolver extends FabrixResolver {
  private _connection
  private _mongoose
  private _mongooseModel

  constructor (model: FabrixModel, datastore?: Mongoose) {
    super(model)
    if (!model) {
      throw new RangeError('Resolver must be given a Model to bind to')
    }
    this._mongoose = datastore
  }

  // get connection() {
  //   return this._connection
  // }
  //
  // set connection(connection) {
  //   this._connection = connection
  // }
  //
  // get mongooseModel() {
  //   return this._mongooseModel
  // }
  //
  // get dataStoreModel() {
  //   return this._mongooseModel
  // }
  //
  // get mongoose() {
  //   return this._mongoose
  // }
  //
  // get datastore() {
  //   return this._mongoose
  // }
  //
  // get instance() {
  //   return this._mongooseModel
  // }
  //
  // public connect(modelName, schema, options) {
  //   // Define the Mongoose Connection on the provided connection
  //   this._mongooseModel = this._connection.define(modelName, schema, options)
  //   // Add a copy of the Fabrix app to the connection model
  //   this._mongooseModel.app = this.app
  //
  //   // A helpful exposure of the instance of Mongoose being used
  //   this._mongoose = this._mongooseModel.mongoose
  //   this.model.datastore = this.model['mongoose'] = this.datastore
  //
  //   // Get the instance methods
  //   const instanceMethods = Transformer.getModelPrototypes(this.model)
  //   const classMethods = Transformer.getModelMethods(this.model, instanceMethods)
  //
  //   // Assign Class Methods from the Model
  //   Object.keys(classMethods).forEach(c => {
  //     this._mongooseModel[c] = classMethods[c]
  //   })
  //
  //   // Assign Instance Methods from the Model
  //   Object.keys(instanceMethods).forEach(i => {
  //     this._mongooseModel.prototype[i] = instanceMethods[i]
  //   })
  //
  //   // Attach Fabrix to the instance prototype
  //   this._mongooseModel.prototype.app = this.app
  //
  //   // Add this model to the connection.models for use later
  //   this._connection.models[modelName] = this._mongooseModel
  //
  //   // Bind the new methods to the Fabrix model
  //   const resolverMethods = Transformer.getClassMethods(this)
  //   Object.entries(resolverMethods).forEach(([ _, method]: [any, string])  => {
  //     this.model[method] = this[method].bind(this)
  //   })
  // }
  //
  // /***********************
  //  * Getters             *
  //  ***********************/
  // /**
  //  *
  //  */
  // get associations() {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.associations
  //   }
  // }
  //
  // /************************
  //  * Class Methods        *
  //  ************************/
  //
  // /**
  //  *
  //  */
  // addScope(name, scope, options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.addScope(name, scope, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // aggregate(filed, aggregateFunction, options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.aggregate(filed, aggregateFunction, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // belongsTo(target, options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.belongsTo(target, options)
  //   }
  // }
  //
  // belongsToMany(target, options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.belongsToMany(target, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // build(dataValues, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.build(dataValues, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // bulkCreate(records: any[], options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.bulkCreate(records, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // count(criteria, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.count(criteria, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // create (values, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.create(values, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // decrement(fields, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.decrement(fields, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // describe(schema, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.describe(schema, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // // Delete is a Fabrix Alias of Mongoose.destroy
  // delete(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.destroy(options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // destroy(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.destroy(options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // drop(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.drop(options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // findAll(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.findAll(options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // findAndCountAll(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.findAndCountAll(options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // findById(id, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.findById(id, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // findOne(criteria) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.findOne(criteria)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // findOrBuild(criteria) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.findOrBuild(criteria)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // findOrCreate(criteria) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.findOrCreate(criteria)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // getTableName() {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.getTableName()
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // hasMany(arget, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.hasMany(arget, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // hasOne(target, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.hasOne(target, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // increment(fields, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.increment(fields, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // init(attributes, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.init(attributes, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // max(criteria, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.max(criteria, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // min(criteria, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.min(criteria, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // removeAttribute(attribute) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.removeAttribute(attribute)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // restore(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.restore(options)
  //   }
  // }
  //
  // // Conflicts with Fabrix Resolver?
  // // schema(schema, options = { }) {
  // //
  // // }
  //
  // /**
  //  *
  //  */
  // scope(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.scope(options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // sum(criteria, options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.sum(criteria, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // sync(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.sync(options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // truncate(options = { }) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.truncate(options)
  //   }
  // }
  //
  // unscoped() {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.unscoped()
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // // Save is a Fabrix Alias of Mongoose.update
  // save(values, options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.update(values, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // update(values, options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.update(values, options)
  //   }
  // }
  //
  // /**
  //  *
  //  */
  // upsert(values, options = {}) {
  //   if (this._mongooseModel) {
  //     return this._mongooseModel.upsert(values, options)
  //   }
  // }
}
