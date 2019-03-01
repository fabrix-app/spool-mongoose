# spool-mongoose
:package: Mongoose.js Spool [http://mongoosejs.com](http://mongoosejs.com)

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Follow @FabrixApp on Twitter][twitter-image]][twitter-url]

Loads Application Models (in `api/models`) into the Mongoose ORM; Integrates with [spool-router](https://github.com/fabrix-app/spool-router) to
generate Tapestriess for routes.

## Usage

### Include spool in app.

```js
// config/main.js
module.exports = {
  // ...
  packs: [
    require('spool-mongoose')
  ]
}
```

### Configure stores.

```js
// config/stores.ts
export const stores = {

  /**
   * Define the database stores. A store is typically a single database.
   *
   * Use the SQLite3 by default for development purposes.
   *
   * Set production connection info in config/env/production.js
   */
  someteststore: {
    // migration
    migrate: 'create',
    // Mongodb URI
    uri: 'mongodb://localhost:27017/test',
    // Mongoose connection options
    options: {

    },
    // Set this stores orm to mongoose
    orm: 'mongoose'
  }
}

// config/models.ts
export const models = {
  defaultStore: 'someteststore',
  migrate: 'drop'
}

```

### Models

#### Options

##### Model::Schema

See [Mongoose Documentation for Schemas](http://mongoosejs.com/docs/guide.html).

##### Model::Config

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| tableName | String | `modelName.toLowerCase()` | Name of collection to use with this model. For example: MyModel.js defaults to collection named `mymodel`
| store | String | `app.config.database.models.defaultStore` | Datastore to use for this model; specify the name of one of the stores in `app.config.database.stores`.
| migrate | String | | Migrate *must* be set to one of `[ 'none', 'drop', 'create' ]`
| schema | Object | `{}` | [Schema Options](http://mongoosejs.com/docs/guide.html#options) to pass into Mongoose's Schema constructor.
| statics | Object | `{}` | [Static methods](http://mongoosejs.com/docs/guide.html#statics) to add to the Model.
| methods | Object | `{}` | [Instance methods](http://mongoosejs.com/docs/guide.html#methods) to add to this model's documents.
| onSchema | Function | undefined | Funcion which is useful to for adding schema middleware, virtuals, or indexes.

#### Example

```js
// Use default Schema from Mongoose. See http://mongoosejs.com/docs/schematypes.html
module.exports = class User extends Model {

  static schema (app, Mongoose) {
    return {
      username: String,
      childs: [{
        type: Mongoose.Schema.ObjectId,
        ref: 'UserSchema'
      }],
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
          validator: function (val) {
            return isEmail(val)
          },
          message: '{VALUE} is not a valid email'
        }
      }
    }
  }

  static config (app, Mongoose) {
    return {
      // Collection name
      tableName: 'users',

      // Schema options
      schema: {
        timestamps: true,

        versionKey: false,

        toObject: {
          virtuals: true
        },

        toJSON: {
          virtuals: true
        }
      },
      // Schema statics
      statics: {
        getByEmail: function (email) {
          return this
            .findOne({
              email: _.trim(email)
            })
            .exec()
        },
      },

      // Schema methods
      methods: {
        toJSON: function () {
          const user = this.toObject()
          delete user.password

          return user
        }
      },
      
      /**
        * After Fabrix.js will create model Schema you could add anything you want here
        * @param  {FabrixApp} app FabrixJs app object
        * @param  {mongoose.Schema} schema mongoose new Schema object
      */
      onSchema (app, schema) {
          // virtuals
          schema.virtual('name.full').get(function () {
            return this.name.first + ' ' + this.name.last
          })
          // lifecircle events
          schema.pre('save', function (next) {
            // performing actions
            next()
          })
          
          // text indexes
          schema.index(
            { 
              username: 'text',
              email: 'text'
            },
            { 
              weights : {
                username : 10,
                email: 5
              },
              name: "usersIndex"
            }
          )
        }
    }
  }
}
```

### Query

```js
// api/services/UserService.js
module.exports = class UserService extends Service {
  /**
   * Finds people with the given email.
   * @return Promise
   * @example {
   *    name: 'Ludwig Beethoven',
   *    email: 'someemail@email.com',
   *    favoriteColors: [
   *      { name: 'yellow', hex: 'ffff00' },
   *      { name: 'black', hex: '000000' }
   *     ]
   * }
   */
  findUser (email) {
    return this.orm.User.find({ email: email })
      .exec()
  }
}
```


## Contributing
We love contributions! Please check out our [Contributor's Guide](https://github.com/fabrix-app/fabrix/blob/master/CONTRIBUTING.md) for more
information on how our projects are organized and how to get started.


## License
[MIT](https://github.com/fabrix-app/spool-mongoose/blob/master/LICENSE)

## Changelog
[Changelog](https://github.com/fabrix-app/spool-mongoose/blob/master/CHANGELOG.md)

[npm-image]: https://img.shields.io/npm/v/@fabrix/spool-mongoose.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/spool-mongoose
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/spool-mongoose/master.svg
[ci-url]: https://circleci.com/gh/fabrix-app/spool-mongoose/tree/master
[daviddm-image]: http://img.shields.io/david/fabrix-app/spool-mongoose.svg?style=flat-square
[daviddm-url]: https://david-dm.org/fabrix-app/spool-mongoose
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/Lobby
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/spool-mongoose.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/spool-mongoose/coverage
