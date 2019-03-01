'use strict'

const assert = require('assert')
const _ = require('lodash')

describe('api.services.TapestriesService', () => {

  let TapestriesService

  before(() => {
    TapestriesService = global.app.services.TapestriesService
  })

  describe('#create', () => {

    it('should insert a record', () => {
      return TapestriesService.create('Role', { name: 'createtest' })
        .then(role => {
          assert.equal(role.name, 'createtest')
        })
    })
  })

  describe('#find', () => {

    it('should find a single record', () => {
      return TapestriesService.create('Role', { name: 'findtest' })
        .then(role => {
          assert.equal(role.name, 'findtest')
          assert(role.id)
          return TapestriesService.find('Role', role.id)
        })
        .then(role => {
          assert(!role.length)
          assert.equal(role.name, 'findtest')
        })
    })

    it('should find a set of records', () => {
      return TapestriesService.create('Role', { name: 'findtest' })
        .then(role => {
          assert.equal(role.name, 'findtest')
          assert(role.id)
          return TapestriesService.find('Role', { name: 'findtest' })
        })
        .then(roles => {
          assert(roles[0])
          //assert.equal(roles.length, 1)
          assert.equal(roles[0].name, 'findtest')
        })
    })

  })

  describe('#update', () => {

    it('should update a set of records', () => {
      return TapestriesService.create('Role', { name: 'updatetest' })
        .then(role => {
          assert.equal(role.name, 'updatetest')
          assert(role.id)
          return TapestriesService.update(
            'Role',
            { name: 'updatetest' },
            { name: 'updated' }
          )
        })
        .then(roles => {
          assert(roles[0])
          assert.equal(roles[0].name, 'updated')
        })
    })

    it('should update a one record by id', () => {
      return TapestriesService.create('Role', { name: 'updatetestid' })
        .then(role => {
          assert.equal(role.name, 'updatetestid')
          assert(role.id)
          return TapestriesService.update(
            'Role',
            role.id,
            { name: 'updated' }
          )
        })
        .then(role => {
          assert(role)
          assert.equal(role.name, 'updated')
        })
    })

  })

  describe('#destroy', () => {

    it('should delete a set of records', () => {
      return TapestriesService.create('Role', { name: 'destroytest' })
        .then(role => {
          assert.equal(role.name, 'destroytest')
          assert(role.id)
          return TapestriesService.destroy('Role', { name: 'destroytest' })
        })
        .then(roles => {
          assert(roles[0])
          assert.equal(roles[0].name, 'destroytest')
          return TapestriesService.find('Role', { name: 'destroytest' })
        })
        .then(roles => {
          assert.equal(roles.length, 0)
        })
    })

    it('should delete one record by id and return object', () => {
      return TapestriesService.create('Role', { name: 'destroytestid' })
        .then(role => {
          assert.equal(role.name, 'destroytestid')
          assert(role.id)
          return TapestriesService.destroy('Role', role.id)
        })
        .then(role => {
          assert(_.isObject(role))
          assert.equal(role.name, 'destroytestid')
          return TapestriesService.find('Role', { name: 'destroytestid' })
        })
        .then(roles => {
          assert.equal(roles.length, 0)
        })
    })
  })

  describe('#createAssociation', () => {

    let user
    let role

    before(() => {
      return TapestriesService
        .create('User', { email: 'test@test.com', password: '123' })
        .then((record) => {
          assert(record)
          assert(record._id) // eslint-disable-line

          user = record
        })
    })

    it('should create an assotiation record', () => {
      return TapestriesService
        .createAssociation('User', user._id, 'role', { name: 'test' }) // eslint-disable-line
        .then((rec) => {
          assert(rec)
          assert(rec._id) // eslint-disable-line
          assert.equal(rec.name, 'test')

          role = rec
          return TapestriesService
            .find('User', user._id) // eslint-disable-line
        })
        .then((rec) => {
          assert(rec)
          assert.equal(rec.id, user.id) // eslint-disable-line
          assert.equal(rec.role, role.id)
        })
    })

    it('should add record into array', () => {
      return TapestriesService
        .createAssociation('User', user.id, 'roles', { name: 'temp' })
        .then((rec) => {
          assert(rec)
          role = rec
          return TapestriesService
            .find('User', user.id, { findOne: true })
        })
        .then((rec) => {
          assert(rec)
          assert.equal(rec.id, user.id)
          assert(_.isArray(rec.roles))
          assert.equal(rec.roles.length, 1)
          assert.equal(rec.roles[0], role.id)
        })
    })

    it('should add record into array for superRoles', () => {
      return TapestriesService
        .createAssociation('User', user.id, 'superRoles', { name: 'temp' })
        .then((rec) => {
          assert(rec)
          role = rec
          return TapestriesService
            .find('User', user.id, { findOne: true })
        })
        .then((rec) => {
          assert(rec)
          assert.equal(rec.id, user.id)
          assert(_.isArray(rec.superRoles))
          assert.equal(rec.superRoles.length, 1)
          assert.equal(rec.superRoles[0], role.id)
        })
    })

    it('should create an assotiation record and populate it', () => {
      return TapestriesService
        .createAssociation('User', user._id, 'role', { name: 'test' }) // eslint-disable-line
        .then((rec) => {
          assert(rec)
          assert(rec._id) // eslint-disable-line
          assert.equal(rec.name, 'test')

          role = rec

          return TapestriesService
            .find('User', user._id, { populate: 'role' }) // eslint-disable-line
        })
        .then((rec) => {
          assert(rec)
          assert.equal(rec.id, user.id) // eslint-disable-line
          assert.equal(rec.role.id, role.id)
          assert.equal(rec.role.name, role.name)
        })
    })

    it('should add record into array and populate it', () => {
      return TapestriesService
        .createAssociation('User', user.id, 'roles', { name: 'temp' })
        .then((rec) => {
          assert(rec)
          role = rec

          return TapestriesService
            .find('User', user.id, { findOne: true, populate: 'roles' })
        })
        .then((rec) => {
          assert(rec)
          assert.equal(rec.id, user.id)
          assert(_.isArray(rec.roles))
          // We have 1 record added in prev test
          // So need to look into last one
          assert.equal(rec.roles.length, 2)
          assert.equal(rec.roles[1].id, role.id)
          assert.equal(rec.roles[1].name, role.name)
        })
    })
  })

  describe('#findAssociation', () => {

    let user
    let role

    before(() => {
      return TapestriesService
        .create('User', { email: 'test1@test.com', password: '123' })
        .then((record) => {
          assert(record)
          assert(record._id) // eslint-disable-line

          user = record
          return TapestriesService
            .createAssociation('User', user._id, 'role', { name: 'test' }) // eslint-disable-line
            .then((rec) => {
              assert(rec)
              assert(rec._id) // eslint-disable-line
              role = rec
            })
        })
    })

    it('should find assotiation', () => {
      return TapestriesService
        .findAssociation('User', user._id, 'role') // eslint-disable-line
        .then((list) => {
          assert(_.isArray(list))
          assert.equal(list.length, 1)
          assert.equal(list[0]._id.toString(), role._id.toString()) // eslint-disable-line
        })
    })
  })

  describe('#updateAssociation', () => {

    let user
    let role

    before(() => {
      return TapestriesService
        .create('User', { email: 'test2@test.com', password: '123' })
        .then((record) => {
          assert(record)
          assert(record._id) // eslint-disable-line

          user = record
          return TapestriesService
            .createAssociation('User', user._id, 'role', { name: 'test' }) // eslint-disable-line
            .then((rec) => {
              assert(rec)
              assert(rec._id) // eslint-disable-line
              role = rec
            })
        })
    })

    it('should remove record', () => {
      return TapestriesService
        .updateAssociation('User', user._id, 'role', { name: 'test' }, { name: 'temp' }) // eslint-disable-line
        .then((rec) => {
          assert(rec)
          return TapestriesService
            .find('Role', role._id, { findOne: true }) // eslint-disable-line
        })
        .then((rec) => {
          assert(rec)
          assert.equal(rec.name, 'temp')
        })
    })
  })

  describe('#destroyAssociation', () => {

    let user
    let role

    before(() => {
      return TapestriesService
        .create('User', { email: 'test3@test.com', password: '123' })
        .then((record) => {
          assert(record)
          assert(record._id) // eslint-disable-line

          user = record
          return TapestriesService
            .createAssociation('User', user._id, 'role', { name: 'test' }) // eslint-disable-line
            .then((rec) => {
              assert(rec)
              assert(rec._id) // eslint-disable-line
              role = rec
            })
        })
    })

    it('should remove record', () => {
      return TapestriesService
        .destroyAssociation('User', user._id, 'role', { name: 'test' }) // eslint-disable-line
        .then(() => TapestriesService.find('Role', role._id, { findOne: true })) // eslint-disable-line
        .then((rec) => {
          assert(!rec)
          return TapestriesService
            .find('User', user._id, { findOne: true }) // eslint-disable-line
            .then((rec) => {
              assert(rec)
              assert(!rec.role)
            })
        })
    })
  })

})
