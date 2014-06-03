// Compiled with multi-compiler 0.0.1-beta by Jan Święcki
// Modified by Brandon Dusseau on 2014-06-03
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
