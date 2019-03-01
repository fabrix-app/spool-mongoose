/* global describe, it */
'use strict'

const expect = require('chai').expect
const mongoose = require('mongoose')

describe('TapestriesService', () => {

  let TapestriesService

  before(() => {
    TapestriesService = global.app.services.TapestriesService
  })

  it('should exist', () => {
    expect(global.app.api.services['TapestriesService']).to.be.defined
    expect(global.app.services.TapestriesService).to.be.an('object')
  })

  describe('#create', () => {

    it('fail if wrong Model', () => {
      return TapestriesService
        .create('Something', {})
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })

  })

  describe('#find', () => {

    it('fail if wrong model', () => {
      return TapestriesService
        .find('Something')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })
  })

  describe('#update', () => {

    it('fail if wrong model', () => {
      return TapestriesService
        .update('Something')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })
  })

  describe('#destroy', () => {

    it('fail if wrong model', () => {
      return TapestriesService
        .destroy('Something')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })
  })

  describe('#_getReferenceModelName', () => {

    let User

    before(() => {
      User = global.app.orm.User
    })

    it('should exist', () => {
      expect(TapestriesService._getReferenceModelName).to.be.an('function') // eslint-disable-line
    })

    it('false if no model or reference', () => {
      expect(TapestriesService._getReferenceModelName({})).to.be.false // eslint-disable-line
      expect(TapestriesService._getReferenceModelName(User)).to.be.false // eslint-disable-line
      expect(TapestriesService._getReferenceModelName(User, [])).to.be.false // eslint-disable-line
    })

    it('false if no such reference in model', () => {
      expect(TapestriesService._getReferenceModelName(User, 'nonExisting')).to.be.false // eslint-disable-line
    })

    it('return model with correct reference', () => {
      const role = TapestriesService._getReferenceModelName(User, 'roles') // eslint-disable-line
      expect(role).to.be.eq('Role')
    })
  })

  describe('#createAssociation', () => {

    it('fail if wrong model', () => {
      return TapestriesService
        .createAssociation('Something')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })

    it('fail with no parentId', () => {
      return TapestriesService
        .createAssociation('User')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parentId provided')
        })
    })

    it('fail if no reference exist', () => {
      return TapestriesService
        .createAssociation('User', 1, 'nonExisting')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No such reference exist')
        })
    })

    it('fail if no parent record exist', () => {
      const id = mongoose.Types.ObjectId() // eslint-disable-line
      return TapestriesService
        .createAssociation('User', id, 'role')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parent record found')
        })
    })

  })

  describe('#findAssociation', () => {

    it('should exist', () => {
      expect(TapestriesService.findAssociation).to.be.a('function')
    })

    it('fail if wrong parentModel', () => {
      return TapestriesService
        .findAssociation()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })

    it('fail if no parentId provided', () => {
      return TapestriesService
        .findAssociation('User')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parentId provided')
        })
    })

    it('fail if no parentModel exsit', () => {
      return TapestriesService
        .findAssociation('User', mongoose.Types.ObjectId(), 'role') // eslint-disable-line
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parent record found')
        })

    })

    it('fail if no reference exist', () => {
      return TapestriesService
        .findAssociation('User', 1, 'nonExisting')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No such reference exist')
        })
    })
  })

  describe('#updateAssociation', () => {

    it('should exist', () => {
      expect(TapestriesService.updateAssociation).to.be.a('function')
    })

    it('fail if wrong parentModel', () => {
      return TapestriesService
        .updateAssociation()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })

    it('fail if no parentId provided', () => {
      return TapestriesService
        .updateAssociation('User')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parentId provided')
        })
    })

    it('fail if no parentModel exsit', () => {
      return TapestriesService
        .updateAssociation('User', mongoose.Types.ObjectId(), 'role') // eslint-disable-line
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parent record found')
        })

    })

    it('fail if no reference exist', () => {
      return TapestriesService
        .updateAssociation('User', 1, 'nonExisting')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No such reference exist')
        })
    })
  })

  describe('#destroyAssociation', () => {

    it('should exist', () => {
      expect(TapestriesService.destroyAssociation).to.be.a('function')
    })

    it('fail if wrong parentModel', () => {
      return TapestriesService
        .destroyAssociation()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No model found')
        })
    })

    it('fail if no parentId provided', () => {
      return TapestriesService
        .destroyAssociation('User')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parentId provided')
        })
    })

    it('fail if no parentModel exsit', () => {
      return TapestriesService
        .destroyAssociation('User', mongoose.Types.ObjectId(), 'role') // eslint-disable-line
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No parent record found')
        })

    })

    it('fail if no reference exist', () => {
      return TapestriesService
        .destroyAssociation('User', 1, 'nonExisting')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'No such reference exist')
        })
    })
  })
})
