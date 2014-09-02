var helper = require('../test_helper');

beforeEach(function (done) {
  var todoList = element.all(by.repeater('todo in todos'));
  browser.get('/');
});

describe("on landing page", function () {
  it("should have the correct title", function () {
    expect(browser.getTitle()).toBe("Jin's Todo App");
  });

  it("should have the number of starting todos", function () {
    expect(todoList.count()).toEqual(0);
  });

  describe("add new todo", function () {
    describe("with valid value", function () {
      it("should display the todo", function () {
        // element(by.model('formData.text')).sendKeys('test todo');
        // element(by.css("cssContainingText('.btn', 'Add')")).click();
        // expect(todoList.count()).toEqual(1);
      });
    });
  });
});
