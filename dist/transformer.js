"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.Transformer = {
    pickStores(stores) {
        return _.pickBy(stores, (_store, name) => {
            return (_.isString(_store.uri) && _.startsWith(_store.uri, 'mongodb://'));
        });
    },
    transformModels(app) {
        const models = app.models;
        const dbConfig = app.config.database;
        return _.mapValues(models, (model, modelName) => {
            const config = model.constructor.config(app, require('mongoose')) || {};
            const schema = model.constructor.schema(app, require('mongoose')) || {};
            const onSchema = config.onSchema || _.noop;
            return {
                identity: modelName.toLowerCase(),
                globalId: modelName,
                tableName: config.tableName || modelName.toLowerCase(),
                connection: config.store || dbConfig.models.defaultStore,
                migrate: config.migrate || dbConfig.models.migrate,
                schema: schema,
                schemaOptions: config.schema,
                statics: config.statics || {},
                methods: config.methods || {},
                onSchema: onSchema
            };
        });
    }
};
