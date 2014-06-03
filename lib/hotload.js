// Compiled with multi-compiler 0.0.1-beta by Jan Święcki
// Using:
//   coco 0.8.1 by satyr, http://satyr.github.com/coco/
//   uglify-js 1.3.3 by Mihai Bazon, git@github.com:mishoo/UglifyJS.git
//   regexp-quote 0.0.0 by Daniel Brockman, https://github.com/dbrock/node-regexp-quote
//   colors 0.6.0-1 by Marak Squires, http://github.com/Marak/colors.js.git
//   multi-compiler 0.0.1-beta by Jan Święcki, https://github.com/jan-swiecki/multi-compiler
// 
// Compile time: 2013-04-11T18:05:53.184Z
// 
// Options: compile
//
// This file depends on:
//   colors 0.6.0-1 by Marak Squires, http://github.com/Marak/colors.js.git
//   callsite 1.0.0 by TJ Holowaychuk
// 
(function(){
  var PATH, fs, crypto, stack, resolveCalledFilename, hashSums, fileWatchers, headStr;
  PATH = require('path');
  fs = require('fs');
  crypto = require('crypto');
  stack = require('callsite');
  resolveCalledFilename = (function(){
    var MODULE;
    MODULE = require("module");
    return function(request, stackLevel){
      var moduleFilename;
      moduleFilename = stack()[stackLevel].getFileName();
      return MODULE._resolveFilename(request, require.cache[moduleFilename]);
    };
  }.call(this));
  hashSums = {};
  fileWatchers = {};
  headStr = function(it){
    return it.substr(0, 7);
  };
  module.exports = function(path, callback){
    var absPath, mainDir, relPath, _module, ref$, k, absTmpPath;
    absPath = resolveCalledFilename(path, 2);
    mainDir = PATH.dirname(require.main.filename);
    relPath = absPath.replace(RegExp(mainDir + ''), '');
    if (require.cache[absPath] == null) {
      _module = require(absPath);
      if (typeof _module !== 'object') {
        return _module;
      } else {
        if (typeof _module.hlInit == 'function') {
          _module.hlInit();
        }
        if (typeof callback == 'function') {
          callback(_module);
        }
        return _module;
      }
    } else {
      if (typeof (ref$ = require.cache[absPath].exports).hlUnload == 'function') {
        ref$.hlUnload();
      }
      for (k in require.cache[absPath].exports) {
        require.cache[absPath].exports[k] = null;
      }
      if (typeof global.gc == 'function') {
        global.gc();
      }
      for (k in require.cache[absPath].exports) {
        delete require.cache[absPath].exports[k];
      }
      absTmpPath = absPath + ".tmp";
      require.cache[absTmpPath] = require.cache[absPath];
      delete require.cache[absPath];
      _module = require(absPath);
      require.cache[absPath] = require.cache[absTmpPath];
      delete require.cache[absTmpPath];
      for (k in _module) {
        require.cache[absPath].exports[k] = _module[k];
      }
      if (typeof (ref$ = require.cache[absPath].exports).hlInit == 'function') {
        ref$.hlInit();
      }
      if (typeof callback == 'function') {
        callback(require.cache[absPath].exports);
      }
      return require.cache[absPath].exports;
    }
  };
}).call(this);
