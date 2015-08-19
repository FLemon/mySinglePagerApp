window.logger = (function (window) {
  'use strict';

  var logger = {
    info: window.console.log.bind(window.console),
    error: window.console.error.bind(window.console)
  };

  return logger;
}).call(this, window);
