exports.config = {
  seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar',
  seleniumArgs: ['-browserTimeout=60'],
  capabilities: { 'browserName': 'chrome' },
  allScriptsTimeout: 30000
};
