import { DatastoreSpool } from '@fabrix/fabrix/dist/common/spools/datastore';
export declare class MongooseSpool extends DatastoreSpool {
    mongoose: any;
    private _connections;
    private _models;
    constructor(app: any);
    readonly models: {
        [key: string]: any;
    };
    readonly connections: {
        [key: string]: any;
    };
    validate(): void;
    configure(): void;
    initialize(): Promise<any[]>;
    unload(): Promise<{}[]>;
    migrate(): Promise<any[]>;
}
