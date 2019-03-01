export declare const Transformer: {
    pickStores(stores: any): Partial<any>;
    transformModels(app: any): {
        [x: string]: {
            identity: string;
            globalId: string;
            tableName: any;
            connection: any;
            migrate: any;
            schema: any;
            schemaOptions: any;
            statics: any;
            methods: any;
            onSchema: any;
        };
    };
};
