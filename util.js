"use strict";

module.exports = {
  "toObject": function(map) {
    var o = {};
    map.forEach(function(v,k) {
      o[k] = v;
    });
    return o;
  }
}
