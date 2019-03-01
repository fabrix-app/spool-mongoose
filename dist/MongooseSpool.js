"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@fabrix/fabrix/dist/common/spools/datastore");
const _ = require("lodash");
const mongoose = require("mongoose");
const transformer_1 = require("./transformer");
const config = require("./config");
const pkg = require("../package.json");
const api = require("./api/index");
class MongooseSpool extends datastore_1.DatastoreSpool {
    constructor(app) {
        super(app, {
            config: config,
            pkg: pkg,
            api: api
        });
        this._connections = {};
        this._models = {};
    }
    get models() {
        return this._models || {};
    }
    get connections() {
        return this._connections || {};
    }
    validate() {
        if (!_.includes(['none', 'drop', 'create'], this.app.config.get('models.migrate'))) {
            throw new Error('Migrate must be configured to either "create" or "drop"');
        }
    }
    configure() {
        this.mongoose = mongoose;
    }
    initialize() {
        super.initialize();
        mongoose.Promise = global.Promise;
        this._models = transformer_1.Transformer.transformModels(this.app);
        this.orm = this.orm || {};
        const stores = transformer_1.Transformer.pickStores(this.app.config.get('stores'));
        this._connections = _.mapValues(stores, (_store, storeName) => {
            const store = _.merge({}, _store);
            if (!_.isString(store.uri)) {
                throw new Error('Store have to contain "uri" option');
            }
            if (!_.isObject(store.options)) {
                store.options = {};
            }
            const connection = mongoose.createConnection(store.uri, store.options);
            const models = _.pickBy(this.models, { connection: storeName });
            _.map(models, model => {
                const schema = new mongoose.Schema(model.schema, model.schemaOptions);
                schema.statics = model.statics;
                schema.methods = model.methods;
                model.onSchema(this.app, schema);
                this.orm[model.globalId] = connection.model(model.globalId, schema, model.tableName);
                this.spools.mongoose.orm[model.identity] = this.orm[model.globalId];
            });
            return connection;
        });
        this.app.orm = this.orm;
        return this.migrate();
    }
    unload() {
        return Promise.all(_.map(this.connections, connection => {
            return new Promise((resolve, reject) => {
                connection.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        }));
    }
    migrate() {
        const SchemaMigrationService = this.app.services.SchemaMigrationService;
        const models = this.app.config.get('models');
        if (models.migrate === 'none') {
            return;
        }
        return Promise.all(_.map(this.connections, connection => {
            if (models.migrate === 'drop') {
                return SchemaMigrationService.drop(connection);
            }
        }));
    }
}
exports.MongooseSpool = MongooseSpool;
