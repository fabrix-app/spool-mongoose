'use strict'
/* global describe, it */

const should = require('chai').should() //eslint-disable-line

describe('index.js', () => {

  let TapestriesService

  before(() => {
    TapestriesService = global.app.services.TapestriesService
  })

  describe('onSchema binding', () => {
    it('should apply onSchema integration', () => {
      return TapestriesService
        .create('User', {
          name: 'TEST_USERNAME',
          email: 'test@fabrix.app',
          password: 'test'
        })
        .then((user)=>{
          user.password.should.be.equal('test***')
          user.name.should.be.equal('test_username')
        })
    })
  })
})
