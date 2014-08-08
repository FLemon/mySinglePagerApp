var helper = require('../test_helper');
var Todo = require('../../server/models/todos');
var assert = require("assert");

describe('Todo', function() {
  describe('#create()', function() {
    it('should save when the value is not empty', function() {
      Todo.create({text: ""}, function(err, todo) {
        var err_msg = err.errors.text.message;
        assert.equal(err_msg, "Please put in valid text!");
      })
    }) 
  })
})
