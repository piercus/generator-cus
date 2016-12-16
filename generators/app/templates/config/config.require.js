module.exports = function(opts){
  if(!opts){
    opts = {};
  }
  var rjs = opts.rjs;
  var env = opts.env || "dev";
  if(!rjs){
    rjs = require("requirejs");
  }
  rjs.config({
    baseUrl: '.',
    paths: {
      "<%=name>/config" : "./config/config."+env,
    }
  });
  return rjs;
};
