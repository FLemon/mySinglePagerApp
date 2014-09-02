var helper = require('../test_helper');
var Todo = require('../../server/models/todos');
var assert = require('assert');

describe('Todo', function() {
  describe('#create()', function() {
    describe('when input value is valid', function() {
      beforeEach(function() {
        input_value = 'test';
      })

      it('should save display on the right place', function() {
        Todo.create({ text: input_value }, function(err, todo) {
          assert.equal(todo.text, input_value);
        })
      })
    })
    describe('when input value is blank', function() {
      beforeEach(function() {
        input_value = '';
      })

      it('should not save and return error', function() {
        Todo.create({ text: input_value }, function(err, todo) {
          var err_msg = err.errors.text.message;
          assert.equal(err_msg, 'Please put in valid text!');
        })
      })
    })

    describe('when input value is duplicated', function() {
      beforeEach(function() {
        input_value = 'test';
        Todo.create({ text: input_value });
      })

      it('should not save and return error', function() {
        Todo.create({text: input_value}, function(err, todo) {
          assert.equal(err.code, 11000);
        })
      })
    })
  })
})
