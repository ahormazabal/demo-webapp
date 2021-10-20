/**
 * Create main app object within window.
 */
(function (window) {
  'use strict';

  function _AppInit() {

    // App instance.
    var THIS = {};

    /** Contenedor de variables globales */
    var app_globals = {};


    THIS.getGlobal = function (key = "") {
      return app_globals[key];
    }

    /**
     *
     * @param key
     * @param {function} value
     */
    THIS.putGlobal = function (key, value) {
      app_globals[key] = value;
    }


    // Return built app instance.
    return THIS;
  }

  //define globally if it doesn't already exist
  if (typeof(window.App) === 'undefined') {

    /** Main Application Controller */
    window.App = _AppInit();
    console.log("Loaded main app");
  }
  else {
    console.log("Library already defined.");
    throw "FATAL: Error initializing application: A component named 'App' already exists.";
  }
})(window);


