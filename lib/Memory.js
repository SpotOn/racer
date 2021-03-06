// Generated by CoffeeScript 1.3.3
var Memory, clone, create, createArray, createObject, isPrivate, lookup, lookupSet, _ref,
  __slice = [].slice;

_ref = require('./util/speculative'), clone = _ref.clone, create = _ref.create, createObject = _ref.createObject, createArray = _ref.createArray;

isPrivate = require('./path').isPrivate;

Memory = module.exports = function() {
  this.flush();
};

Memory.prototype = {
  flush: function() {
    this._data = {
      world: {}
    };
    return this.version = 0;
  },
  init: function(obj) {
    this._data = {
      world: obj.data
    };
    return this.version = obj.ver;
  },
  eraseNonPrivate: function() {
    var path, world;
    world = this._data.world;
    for (path in world) {
      if (!isPrivate(path)) {
        delete world[path];
      }
    }
  },
  toJSON: function() {
    return {
      data: this._data.world,
      ver: this.version
    };
  },
  setVersion: function(ver) {
    return this.version = Math.max(this.version, ver);
  },
  get: function(path, data, getRef) {
    data || (data = this._data);
    data.$deref = null;
    if (path) {
      return lookup(path, data, getRef);
    }
    return data.world;
  },
  set: function(path, value, ver, data) {
    var obj, parent, prop, segments, _ref1, _ref2;
    this.setVersion(ver);
    _ref1 = lookupSet(path, data || this._data, ver == null, 'object'), obj = _ref1[0], parent = _ref1[1], prop = _ref1[2];
    parent[prop] = value;
    segments = path.split('.');
    if (segments.length === 2 && value && value.constructor === Object) {
      if ((_ref2 = value.id) == null) {
        value.id = segments[1];
      }
    }
    return obj;
  },
  del: function(path, ver, data) {
    var grandparent, index, obj, parent, parentClone, parentPath, parentProp, prop, speculative, _ref1, _ref2;
    this.setVersion(ver);
    data || (data = this._data);
    speculative = ver == null;
    _ref1 = lookupSet(path, data, speculative), obj = _ref1[0], parent = _ref1[1], prop = _ref1[2];
    if (ver != null) {
      if (parent) {
        delete parent[prop];
      }
      return obj;
    }
    if (!parent) {
      return obj;
    }
    if (~(index = path.lastIndexOf('.'))) {
      parentPath = path.substr(0, index);
      _ref2 = lookupSet(parentPath, data, speculative), parent = _ref2[0], grandparent = _ref2[1], parentProp = _ref2[2];
    } else {
      parent = data.world;
      grandparent = data;
      parentProp = 'world';
    }
    parentClone = clone(parent);
    delete parentClone[prop];
    grandparent[parentProp] = parentClone;
    return obj;
  },
  push: function() {
    var args, arr, data, path, ver, _i;
    path = arguments[0], args = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), ver = arguments[_i++], data = arguments[_i++];
    this.setVersion(ver);
    arr = lookupSet(path, data || this._data, ver == null, 'array')[0];
    if (!Array.isArray(arr)) {
      throw new TypeError("" + arr + " is not an Array");
    }
    return arr.push.apply(arr, args);
  },
  unshift: function() {
    var args, arr, data, path, ver, _i;
    path = arguments[0], args = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), ver = arguments[_i++], data = arguments[_i++];
    this.setVersion(ver);
    arr = lookupSet(path, data || this._data, ver == null, 'array')[0];
    if (!Array.isArray(arr)) {
      throw new TypeError("" + arr + " is not an Array");
    }
    return arr.unshift.apply(arr, args);
  },
  insert: function() {
    var args, arr, data, index, len, path, ver, _i;
    path = arguments[0], index = arguments[1], args = 5 <= arguments.length ? __slice.call(arguments, 2, _i = arguments.length - 2) : (_i = 2, []), ver = arguments[_i++], data = arguments[_i++];
    this.setVersion(ver);
    arr = lookupSet(path, data || this._data, ver == null, 'array')[0];
    if (!Array.isArray(arr)) {
      throw new TypeError("" + arr + " is not an Array");
    }
    len = arr.length;
    arr.splice.apply(arr, [index, 0].concat(__slice.call(args)));
    return arr.length;
  },
  pop: function(path, ver, data) {
    var arr;
    this.setVersion(ver);
    arr = lookupSet(path, data || this._data, ver == null, 'array')[0];
    if (!Array.isArray(arr)) {
      throw new TypeError("" + arr + " is not an Array");
    }
    return arr.pop();
  },
  shift: function(path, ver, data) {
    var arr;
    this.setVersion(ver);
    arr = lookupSet(path, data || this._data, ver == null, 'array')[0];
    if (!Array.isArray(arr)) {
      throw new TypeError("" + arr + " is not an Array");
    }
    return arr.shift();
  },
  remove: function(path, index, howMany, ver, data) {
    var arr, len;
    this.setVersion(ver);
    arr = lookupSet(path, data || this._data, ver == null, 'array')[0];
    if (!Array.isArray(arr)) {
      throw new TypeError("" + arr + " is not an Array");
    }
    len = arr.length;
    return arr.splice(index, howMany);
  },
  move: function(path, from, to, howMany, ver, data) {
    var arr, len, values;
    this.setVersion(ver);
    arr = lookupSet(path, data || this._data, ver == null, 'array')[0];
    if (!Array.isArray(arr)) {
      throw new TypeError("" + arr + " is not an Array");
    }
    len = arr.length;
    from = +from;
    to = +to;
    if (from < 0) {
      from += len;
    }
    if (to < 0) {
      to += len;
    }
    values = arr.splice(from, howMany);
    arr.splice.apply(arr, [to, 0].concat(__slice.call(values)));
    return values;
  }
};

lookup = function(path, data, getRef) {
  var curr, i, len, prop, props, refOut, _ref1;
  props = path.split('.');
  len = props.length;
  i = 0;
  curr = data.world;
  path = '';
  while (i < len) {
    prop = props[i++];
    curr = curr[prop];
    path = path ? path + '.' + prop : prop;
    if (typeof curr === 'function') {
      if (getRef && i === len) {
        break;
      }
      _ref1 = refOut = curr(lookup, data, path, props, len, i), curr = _ref1[0], path = _ref1[1], i = _ref1[2];
    }
    if (curr == null) {
      break;
    }
  }
  return curr;
};

lookupSet = Memory.lookupSet = function(path, data, speculative, pathType) {
  var curr, firstProp, i, len, parent, prop, props;
  props = path.split('.');
  len = props.length;
  i = 0;
  curr = data.world = speculative ? create(data.world) : data.world;
  firstProp = props[0];
  while (i < len) {
    prop = props[i++];
    parent = curr;
    curr = curr[prop];
    if (curr != null) {
      if (speculative && typeof curr === 'object') {
        curr = parent[prop] = create(curr);
      }
    } else {
      if (pathType === 'object') {
        if (i !== 1 && /^[0-9]+$/.test(props[i])) {
          curr = parent[prop] = speculative ? createArray() : [];
        } else if (i !== len) {
          curr = parent[prop] = speculative ? createObject() : {};
          if (i === 2 && !isPrivate(firstProp)) {
            curr.id = prop;
          }
        }
      } else if (pathType === 'array') {
        if (i === len) {
          curr = parent[prop] = speculative ? createArray() : [];
        } else {
          curr = parent[prop] = speculative ? createObject() : {};
          if (i === 2 && !isPrivate(firstProp)) {
            curr.id = prop;
          }
        }
      } else {
        if (i !== len) {
          parent = curr = void 0;
        }
        return [curr, parent, prop];
      }
    }
  }
  return [curr, parent, prop];
};
