import {Model} from '../src/Cheddar'
import {expect} from 'chai'

class TestModel extends Model {
  configure () {
    this.before('save', this.validate)
  }

  validate () {
    this.ensure('age',      { type: Number })
    this.ensure('name',     { type: String, required: true })
    this.ensure('email',    { type: String, required: true })
    this.ensure('password', { type: String, required: true })
  }
}

describe('ApplicationModel', () => {
  let model

  beforeEach(() => {
    model = new TestModel()
  })

  afterEach(function *() {
    yield model.delete()
  })

  describe('constructor', () => {
    it('returns a new instance', () => {
      expect(model instanceof TestModel).to.be.true
    })
  })

  describe('save middleware', () => {
    it('fails if missing property', function *() {
      try {
        model.name = 'Test'
        yield model.save()
      } catch (error) {
        expect(error.message).to.be.equal('email is missing.')
      }
    })

    it('fails if unexpected type', function *() {
      try {
        model.name = 'Test'
        model.age = '42'
        yield model.save()
      } catch (error) {
        expect(error.message).to.be.equal('age is not a Number.')
      }
    })

    it('save model if validation is ok', function *() {
      model.name = 'Test'
      model.email = 'test@test.com'
      model.password = '123456'
      yield model.save()
    })
  })
})