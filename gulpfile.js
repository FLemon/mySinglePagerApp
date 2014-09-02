'use strict';

process.env.NODE_ENV = 'test';
var gulp = require('gulp');
require('gulp-help')(gulp);
var gp = require('gulp-protractor');
var args = require('yargs').argv;
var app = require('./app');
var http = require('http');
var server = http.createServer(app);
var isCI = args.type === 'ci';

// Download and update the selenium driver
gulp.task('webdriver_manager_update', 'updates the selenium server standalone jar file ', gp.webdriver_update);

gulp.task('acceptanceTest', 'runs e2etests using protractor.conf', ['testServer'], function(cb) {

	gulp.src(['test/**/*.js'], { read:false })
		.pipe(gp.protractor({
			configFile: './test/protractor.conf.js',
			args: ['debug', '--baseUrl', 'http://' + server.address().address + ':' + server.address().port]
		})).on('error', function(e) {
			server.close();
			if(isCI) {
				throw e;
			} else {
				console.log(e);
			}
			cb();
		}).on('end', function() {
			server.close();
			cb();
		});
});

gulp.task('testServer', 'starts a development webserver', function(cb) {
	server.listen(9001, cb);
});

gulp.task('default', [], function () {
  gulp.start('acceptanceTest');
  gulp.watch(['./test/**/*.js', './public/**/*.js'], function() {
    gulp.start('acceptanceTest');
  })
});
