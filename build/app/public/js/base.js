"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/classnames/index.js
  var require_classnames = __commonJS({
    "node_modules/classnames/index.js"(exports, module) {
      (function() {
        "use strict";
        var hasOwn = {}.hasOwnProperty;
        function classNames() {
          var classes = "";
          for (var i3 = 0; i3 < arguments.length; i3++) {
            var arg = arguments[i3];
            if (arg) {
              classes = appendClass(classes, parseValue(arg));
            }
          }
          return classes;
        }
        function parseValue(arg) {
          if (typeof arg === "string" || typeof arg === "number") {
            return arg;
          }
          if (typeof arg !== "object") {
            return "";
          }
          if (Array.isArray(arg)) {
            return classNames.apply(null, arg);
          }
          if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
            return arg.toString();
          }
          var classes = "";
          for (var key in arg) {
            if (hasOwn.call(arg, key) && arg[key]) {
              classes = appendClass(classes, key);
            }
          }
          return classes;
        }
        function appendClass(value, newClass) {
          if (!newClass) {
            return value;
          }
          if (value) {
            return value + " " + newClass;
          }
          return value + newClass;
        }
        if (typeof module !== "undefined" && module.exports) {
          classNames.default = classNames;
          module.exports = classNames;
        } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
          define("classnames", [], function() {
            return classNames;
          });
        } else {
          window.classNames = classNames;
        }
      })();
    }
  });

  // node_modules/hyperscript-attribute-to-property/index.js
  var require_hyperscript_attribute_to_property = __commonJS({
    "node_modules/hyperscript-attribute-to-property/index.js"(exports, module) {
      module.exports = attributeToProperty;
      var transform = {
        "class": "className",
        "for": "htmlFor",
        "http-equiv": "httpEquiv"
      };
      function attributeToProperty(h3) {
        return function(tagName, attrs, children) {
          for (var attr in attrs) {
            if (attr in transform) {
              attrs[transform[attr]] = attrs[attr];
              delete attrs[attr];
            }
          }
          return h3(tagName, attrs, children);
        };
      }
    }
  });

  // node_modules/hyperx/index.js
  var require_hyperx = __commonJS({
    "node_modules/hyperx/index.js"(exports, module) {
      var attrToProp = require_hyperscript_attribute_to_property();
      var VAR = 0;
      var TEXT = 1;
      var OPEN = 2;
      var CLOSE = 3;
      var ATTR = 4;
      var ATTR_KEY = 5;
      var ATTR_KEY_W = 6;
      var ATTR_VALUE_W = 7;
      var ATTR_VALUE = 8;
      var ATTR_VALUE_SQ = 9;
      var ATTR_VALUE_DQ = 10;
      var ATTR_EQ = 11;
      var ATTR_BREAK = 12;
      var COMMENT = 13;
      module.exports = function(h3, opts) {
        if (!opts)
          opts = {};
        var concat = opts.concat || function(a3, b3) {
          return String(a3) + String(b3);
        };
        if (opts.attrToProp !== false) {
          h3 = attrToProp(h3);
        }
        return function(strings2) {
          var state = TEXT, reg = "";
          var arglen = arguments.length;
          var parts = [];
          for (var i3 = 0; i3 < strings2.length; i3++) {
            if (i3 < arglen - 1) {
              var arg = arguments[i3 + 1];
              var p3 = parse2(strings2[i3]);
              var xstate = state;
              if (xstate === ATTR_VALUE_DQ)
                xstate = ATTR_VALUE;
              if (xstate === ATTR_VALUE_SQ)
                xstate = ATTR_VALUE;
              if (xstate === ATTR_VALUE_W)
                xstate = ATTR_VALUE;
              if (xstate === ATTR)
                xstate = ATTR_KEY;
              if (xstate === OPEN) {
                if (reg === "/") {
                  p3.push([OPEN, "/", arg]);
                  reg = "";
                } else {
                  p3.push([OPEN, arg]);
                }
              } else if (xstate === COMMENT && opts.comments) {
                reg += String(arg);
              } else if (xstate !== COMMENT) {
                p3.push([VAR, xstate, arg]);
              }
              parts.push.apply(parts, p3);
            } else
              parts.push.apply(parts, parse2(strings2[i3]));
          }
          var tree = [null, {}, []];
          var stack = [[tree, -1]];
          for (var i3 = 0; i3 < parts.length; i3++) {
            var cur = stack[stack.length - 1][0];
            var p3 = parts[i3], s3 = p3[0];
            if (s3 === OPEN && /^\//.test(p3[1])) {
              var ix = stack[stack.length - 1][1];
              if (stack.length > 1) {
                stack.pop();
                stack[stack.length - 1][0][2][ix] = h3(
                  cur[0],
                  cur[1],
                  cur[2].length ? cur[2] : void 0
                );
              }
            } else if (s3 === OPEN) {
              var c3 = [p3[1], {}, []];
              cur[2].push(c3);
              stack.push([c3, cur[2].length - 1]);
            } else if (s3 === ATTR_KEY || s3 === VAR && p3[1] === ATTR_KEY) {
              var key = "";
              var copyKey;
              for (; i3 < parts.length; i3++) {
                if (parts[i3][0] === ATTR_KEY) {
                  key = concat(key, parts[i3][1]);
                } else if (parts[i3][0] === VAR && parts[i3][1] === ATTR_KEY) {
                  if (typeof parts[i3][2] === "object" && !key) {
                    for (copyKey in parts[i3][2]) {
                      if (parts[i3][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                        cur[1][copyKey] = parts[i3][2][copyKey];
                      }
                    }
                  } else {
                    key = concat(key, parts[i3][2]);
                  }
                } else
                  break;
              }
              if (parts[i3][0] === ATTR_EQ)
                i3++;
              var j3 = i3;
              for (; i3 < parts.length; i3++) {
                if (parts[i3][0] === ATTR_VALUE || parts[i3][0] === ATTR_KEY) {
                  if (!cur[1][key])
                    cur[1][key] = strfn(parts[i3][1]);
                  else
                    parts[i3][1] === "" || (cur[1][key] = concat(cur[1][key], parts[i3][1]));
                } else if (parts[i3][0] === VAR && (parts[i3][1] === ATTR_VALUE || parts[i3][1] === ATTR_KEY)) {
                  if (!cur[1][key])
                    cur[1][key] = strfn(parts[i3][2]);
                  else
                    parts[i3][2] === "" || (cur[1][key] = concat(cur[1][key], parts[i3][2]));
                } else {
                  if (key.length && !cur[1][key] && i3 === j3 && (parts[i3][0] === CLOSE || parts[i3][0] === ATTR_BREAK)) {
                    cur[1][key] = key.toLowerCase();
                  }
                  if (parts[i3][0] === CLOSE) {
                    i3--;
                  }
                  break;
                }
              }
            } else if (s3 === ATTR_KEY) {
              cur[1][p3[1]] = true;
            } else if (s3 === VAR && p3[1] === ATTR_KEY) {
              cur[1][p3[2]] = true;
            } else if (s3 === CLOSE) {
              if (selfClosing(cur[0]) && stack.length) {
                var ix = stack[stack.length - 1][1];
                stack.pop();
                stack[stack.length - 1][0][2][ix] = h3(
                  cur[0],
                  cur[1],
                  cur[2].length ? cur[2] : void 0
                );
              }
            } else if (s3 === VAR && p3[1] === TEXT) {
              if (p3[2] === void 0 || p3[2] === null)
                p3[2] = "";
              else if (!p3[2])
                p3[2] = concat("", p3[2]);
              if (Array.isArray(p3[2][0])) {
                cur[2].push.apply(cur[2], p3[2]);
              } else {
                cur[2].push(p3[2]);
              }
            } else if (s3 === TEXT) {
              cur[2].push(p3[1]);
            } else if (s3 === ATTR_EQ || s3 === ATTR_BREAK) {
            } else {
              throw new Error("unhandled: " + s3);
            }
          }
          if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
            tree[2].shift();
          }
          if (tree[2].length > 2 || tree[2].length === 2 && /\S/.test(tree[2][1])) {
            if (opts.createFragment)
              return opts.createFragment(tree[2]);
            throw new Error(
              "multiple root elements must be wrapped in an enclosing tag"
            );
          }
          if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === "string" && Array.isArray(tree[2][0][2])) {
            tree[2][0] = h3(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
          }
          return tree[2][0];
          function parse2(str) {
            var res = [];
            if (state === ATTR_VALUE_W)
              state = ATTR;
            for (var i4 = 0; i4 < str.length; i4++) {
              var c4 = str.charAt(i4);
              if (state === TEXT && c4 === "<") {
                if (reg.length)
                  res.push([TEXT, reg]);
                reg = "";
                state = OPEN;
              } else if (c4 === ">" && !quot(state) && state !== COMMENT) {
                if (state === OPEN && reg.length) {
                  res.push([OPEN, reg]);
                } else if (state === ATTR_KEY) {
                  res.push([ATTR_KEY, reg]);
                } else if (state === ATTR_VALUE && reg.length) {
                  res.push([ATTR_VALUE, reg]);
                }
                res.push([CLOSE]);
                reg = "";
                state = TEXT;
              } else if (state === COMMENT && /-$/.test(reg) && c4 === "-") {
                if (opts.comments) {
                  res.push([ATTR_VALUE, reg.substr(0, reg.length - 1)]);
                }
                reg = "";
                state = TEXT;
              } else if (state === OPEN && /^!--$/.test(reg)) {
                if (opts.comments) {
                  res.push([OPEN, reg], [ATTR_KEY, "comment"], [ATTR_EQ]);
                }
                reg = c4;
                state = COMMENT;
              } else if (state === TEXT || state === COMMENT) {
                reg += c4;
              } else if (state === OPEN && c4 === "/" && reg.length) {
              } else if (state === OPEN && /\s/.test(c4)) {
                if (reg.length) {
                  res.push([OPEN, reg]);
                }
                reg = "";
                state = ATTR;
              } else if (state === OPEN) {
                reg += c4;
              } else if (state === ATTR && /[^\s"'=/]/.test(c4)) {
                state = ATTR_KEY;
                reg = c4;
              } else if (state === ATTR && /\s/.test(c4)) {
                if (reg.length)
                  res.push([ATTR_KEY, reg]);
                res.push([ATTR_BREAK]);
              } else if (state === ATTR_KEY && /\s/.test(c4)) {
                res.push([ATTR_KEY, reg]);
                reg = "";
                state = ATTR_KEY_W;
              } else if (state === ATTR_KEY && c4 === "=") {
                res.push([ATTR_KEY, reg], [ATTR_EQ]);
                reg = "";
                state = ATTR_VALUE_W;
              } else if (state === ATTR_KEY) {
                reg += c4;
              } else if ((state === ATTR_KEY_W || state === ATTR) && c4 === "=") {
                res.push([ATTR_EQ]);
                state = ATTR_VALUE_W;
              } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c4)) {
                res.push([ATTR_BREAK]);
                if (/[\w-]/.test(c4)) {
                  reg += c4;
                  state = ATTR_KEY;
                } else
                  state = ATTR;
              } else if (state === ATTR_VALUE_W && c4 === '"') {
                state = ATTR_VALUE_DQ;
              } else if (state === ATTR_VALUE_W && c4 === "'") {
                state = ATTR_VALUE_SQ;
              } else if (state === ATTR_VALUE_DQ && c4 === '"') {
                res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
                reg = "";
                state = ATTR;
              } else if (state === ATTR_VALUE_SQ && c4 === "'") {
                res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
                reg = "";
                state = ATTR;
              } else if (state === ATTR_VALUE_W && !/\s/.test(c4)) {
                state = ATTR_VALUE;
                i4--;
              } else if (state === ATTR_VALUE && /\s/.test(c4)) {
                res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
                reg = "";
                state = ATTR;
              } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ) {
                reg += c4;
              }
            }
            if (state === TEXT && reg.length) {
              res.push([TEXT, reg]);
              reg = "";
            } else if (state === ATTR_VALUE && reg.length) {
              res.push([ATTR_VALUE, reg]);
              reg = "";
            } else if (state === ATTR_VALUE_DQ && reg.length) {
              res.push([ATTR_VALUE, reg]);
              reg = "";
            } else if (state === ATTR_VALUE_SQ && reg.length) {
              res.push([ATTR_VALUE, reg]);
              reg = "";
            } else if (state === ATTR_KEY) {
              res.push([ATTR_KEY, reg]);
              reg = "";
            }
            return res;
          }
        };
        function strfn(x2) {
          if (typeof x2 === "function")
            return x2;
          else if (typeof x2 === "string")
            return x2;
          else if (x2 && typeof x2 === "object")
            return x2;
          else if (x2 === null || x2 === void 0)
            return x2;
          else
            return concat("", x2);
        }
      };
      function quot(state) {
        return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ;
      }
      var closeRE = RegExp("^(" + [
        "area",
        "base",
        "basefont",
        "bgsound",
        "br",
        "col",
        "command",
        "embed",
        "frame",
        "hr",
        "img",
        "input",
        "isindex",
        "keygen",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
        "!--",
        // SVG TAGS
        "animate",
        "animateTransform",
        "circle",
        "cursor",
        "desc",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "font-face-format",
        "font-face-name",
        "font-face-uri",
        "glyph",
        "glyphRef",
        "hkern",
        "image",
        "line",
        "missing-glyph",
        "mpath",
        "path",
        "polygon",
        "polyline",
        "rect",
        "set",
        "stop",
        "tref",
        "use",
        "view",
        "vkern"
      ].join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");
      function selfClosing(tag) {
        return closeRE.test(tag);
      }
    }
  });

  // node_modules/nanohtml/lib/append-child.js
  var require_append_child = __commonJS({
    "node_modules/nanohtml/lib/append-child.js"(exports, module) {
      "use strict";
      var trailingNewlineRegex = /\n[\s]+$/;
      var leadingNewlineRegex = /^\n[\s]+/;
      var trailingSpaceRegex = /[\s]+$/;
      var leadingSpaceRegex = /^[\s]+/;
      var multiSpaceRegex = /[\n\s]+/g;
      var TEXT_TAGS = [
        "a",
        "abbr",
        "b",
        "bdi",
        "bdo",
        "br",
        "cite",
        "data",
        "dfn",
        "em",
        "i",
        "kbd",
        "mark",
        "q",
        "rp",
        "rt",
        "rtc",
        "ruby",
        "s",
        "amp",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "time",
        "u",
        "var",
        "wbr"
      ];
      var VERBATIM_TAGS = [
        "code",
        "pre",
        "textarea"
      ];
      module.exports = function appendChild(el, childs) {
        if (!Array.isArray(childs))
          return;
        var nodeName = el.nodeName.toLowerCase();
        var hadText = false;
        var value, leader;
        for (var i3 = 0, len = childs.length; i3 < len; i3++) {
          var node = childs[i3];
          if (Array.isArray(node)) {
            appendChild(el, node);
            continue;
          }
          if (typeof node === "number" || typeof node === "boolean" || typeof node === "function" || node instanceof Date || node instanceof RegExp) {
            node = node.toString();
          }
          var lastChild = el.childNodes[el.childNodes.length - 1];
          if (typeof node === "string") {
            hadText = true;
            if (lastChild && lastChild.nodeName === "#text") {
              lastChild.nodeValue += node;
            } else {
              node = el.ownerDocument.createTextNode(node);
              el.appendChild(node);
              lastChild = node;
            }
            if (i3 === len - 1) {
              hadText = false;
              if (TEXT_TAGS.indexOf(nodeName) === -1 && VERBATIM_TAGS.indexOf(nodeName) === -1) {
                value = lastChild.nodeValue.replace(leadingNewlineRegex, "").replace(trailingSpaceRegex, "").replace(trailingNewlineRegex, "").replace(multiSpaceRegex, " ");
                if (value === "") {
                  el.removeChild(lastChild);
                } else {
                  lastChild.nodeValue = value;
                }
              } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
                leader = i3 === 0 ? "" : " ";
                value = lastChild.nodeValue.replace(leadingNewlineRegex, leader).replace(leadingSpaceRegex, " ").replace(trailingSpaceRegex, "").replace(trailingNewlineRegex, "").replace(multiSpaceRegex, " ");
                lastChild.nodeValue = value;
              }
            }
          } else if (node && node.nodeType) {
            if (hadText) {
              hadText = false;
              if (TEXT_TAGS.indexOf(nodeName) === -1 && VERBATIM_TAGS.indexOf(nodeName) === -1) {
                value = lastChild.nodeValue.replace(leadingNewlineRegex, "").replace(trailingNewlineRegex, " ").replace(multiSpaceRegex, " ");
                if (value === "") {
                  el.removeChild(lastChild);
                } else {
                  lastChild.nodeValue = value;
                }
              } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
                value = lastChild.nodeValue.replace(leadingSpaceRegex, " ").replace(leadingNewlineRegex, "").replace(trailingNewlineRegex, " ").replace(multiSpaceRegex, " ");
                lastChild.nodeValue = value;
              }
            }
            var _nodeName = node.nodeName;
            if (_nodeName)
              nodeName = _nodeName.toLowerCase();
            el.appendChild(node);
          }
        }
      };
    }
  });

  // node_modules/nanohtml/lib/svg-tags.js
  var require_svg_tags = __commonJS({
    "node_modules/nanohtml/lib/svg-tags.js"(exports, module) {
      "use strict";
      module.exports = [
        "svg",
        "altGlyph",
        "altGlyphDef",
        "altGlyphItem",
        "animate",
        "animateColor",
        "animateMotion",
        "animateTransform",
        "circle",
        "clipPath",
        "color-profile",
        "cursor",
        "defs",
        "desc",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "filter",
        "font",
        "font-face",
        "font-face-format",
        "font-face-name",
        "font-face-src",
        "font-face-uri",
        "foreignObject",
        "g",
        "glyph",
        "glyphRef",
        "hkern",
        "image",
        "line",
        "linearGradient",
        "marker",
        "mask",
        "metadata",
        "missing-glyph",
        "mpath",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialGradient",
        "rect",
        "set",
        "stop",
        "switch",
        "symbol",
        "text",
        "textPath",
        "title",
        "tref",
        "tspan",
        "use",
        "view",
        "vkern"
      ];
    }
  });

  // node_modules/nanohtml/lib/bool-props.js
  var require_bool_props = __commonJS({
    "node_modules/nanohtml/lib/bool-props.js"(exports, module) {
      "use strict";
      module.exports = [
        "async",
        "autofocus",
        "autoplay",
        "checked",
        "controls",
        "default",
        "defaultchecked",
        "defer",
        "disabled",
        "formnovalidate",
        "hidden",
        "ismap",
        "loop",
        "multiple",
        "muted",
        "novalidate",
        "open",
        "playsinline",
        "readonly",
        "required",
        "reversed",
        "selected"
      ];
    }
  });

  // node_modules/nanohtml/lib/direct-props.js
  var require_direct_props = __commonJS({
    "node_modules/nanohtml/lib/direct-props.js"(exports, module) {
      "use strict";
      module.exports = [
        "indeterminate"
      ];
    }
  });

  // node_modules/nanohtml/lib/dom.js
  var require_dom = __commonJS({
    "node_modules/nanohtml/lib/dom.js"(exports, module) {
      "use strict";
      var hyperx = require_hyperx();
      var appendChild = require_append_child();
      var SVG_TAGS = require_svg_tags();
      var BOOL_PROPS = require_bool_props();
      var DIRECT_PROPS = require_direct_props();
      var SVGNS = "http://www.w3.org/2000/svg";
      var XLINKNS = "http://www.w3.org/1999/xlink";
      var COMMENT_TAG = "!--";
      module.exports = function(document2) {
        function nanoHtmlCreateElement(tag, props, children) {
          var el;
          if (SVG_TAGS.indexOf(tag) !== -1) {
            props.namespace = SVGNS;
          }
          var ns2 = false;
          if (props.namespace) {
            ns2 = props.namespace;
            delete props.namespace;
          }
          var isCustomElement = false;
          if (props.is) {
            isCustomElement = props.is;
            delete props.is;
          }
          if (ns2) {
            if (isCustomElement) {
              el = document2.createElementNS(ns2, tag, { is: isCustomElement });
            } else {
              el = document2.createElementNS(ns2, tag);
            }
          } else if (tag === COMMENT_TAG) {
            return document2.createComment(props.comment);
          } else if (isCustomElement) {
            el = document2.createElement(tag, { is: isCustomElement });
          } else {
            el = document2.createElement(tag);
          }
          for (var p3 in props) {
            if (props.hasOwnProperty(p3)) {
              var key = p3.toLowerCase();
              var val = props[p3];
              if (key === "classname") {
                key = "class";
                p3 = "class";
              }
              if (p3 === "htmlFor") {
                p3 = "for";
              }
              if (BOOL_PROPS.indexOf(key) !== -1) {
                if (String(val) === "true")
                  val = key;
                else if (String(val) === "false")
                  continue;
              }
              if (key.slice(0, 2) === "on" || DIRECT_PROPS.indexOf(key) !== -1) {
                el[p3] = val;
              } else {
                if (ns2) {
                  if (p3 === "xlink:href") {
                    el.setAttributeNS(XLINKNS, p3, val);
                  } else if (/^xmlns($|:)/i.test(p3)) {
                  } else {
                    el.setAttributeNS(null, p3, val);
                  }
                } else {
                  el.setAttribute(p3, val);
                }
              }
            }
          }
          appendChild(el, children);
          return el;
        }
        function createFragment(nodes) {
          var fragment = document2.createDocumentFragment();
          for (var i3 = 0; i3 < nodes.length; i3++) {
            if (nodes[i3] == null)
              continue;
            if (Array.isArray(nodes[i3])) {
              fragment.appendChild(createFragment(nodes[i3]));
            } else {
              if (typeof nodes[i3] === "string")
                nodes[i3] = document2.createTextNode(nodes[i3]);
              fragment.appendChild(nodes[i3]);
            }
          }
          return fragment;
        }
        var exports2 = hyperx(nanoHtmlCreateElement, {
          comments: true,
          createFragment
        });
        exports2.default = exports2;
        exports2.createComment = nanoHtmlCreateElement;
        return exports2;
      };
    }
  });

  // node_modules/nanohtml/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/nanohtml/lib/browser.js"(exports, module) {
      module.exports = require_dom()(document);
    }
  });

  // node_modules/zod/lib/index.mjs
  function setErrorMap(map) {
    overrideErrorMap = map;
  }
  function getErrorMap() {
    return overrideErrorMap;
  }
  function addIssueToContext(ctx, issueData) {
    const issue = makeIssue({
      issueData,
      data: ctx.data,
      path: ctx.path,
      errorMaps: [
        ctx.common.contextualErrorMap,
        ctx.schemaErrorMap,
        getErrorMap(),
        errorMap
        // then global default map
      ].filter((x2) => !!x2)
    });
    ctx.common.issues.push(issue);
  }
  function processCreateParams(params) {
    if (!params)
      return {};
    const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
    if (errorMap2 && (invalid_type_error || required_error)) {
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap2)
      return { errorMap: errorMap2, description };
    const customMap = (iss, ctx) => {
      if (iss.code !== "invalid_type")
        return { message: ctx.defaultError };
      if (typeof ctx.data === "undefined") {
        return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
      }
      return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
    };
    return { errorMap: customMap, description };
  }
  function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
      return true;
    }
    return false;
  }
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / Math.pow(10, decCount);
  }
  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({
        ...schema._def,
        shape: () => newShape
      });
    } else if (schema instanceof ZodArray) {
      return new ZodArray({
        ...schema._def,
        type: deepPartialify(schema.element)
      });
    } else if (schema instanceof ZodOptional) {
      return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodNullable) {
      return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodTuple) {
      return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    } else {
      return schema;
    }
  }
  function mergeValues(a3, b3) {
    const aType = getParsedType(a3);
    const bType = getParsedType(b3);
    if (a3 === b3) {
      return { valid: true, data: a3 };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b3);
      const sharedKeys = util.objectKeys(a3).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a3, ...b3 };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a3[key], b3[key]);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a3.length !== b3.length) {
        return { valid: false };
      }
      const newArray = [];
      for (let index = 0; index < a3.length; index++) {
        const itemA = a3[index];
        const itemB = b3[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a3 === +b3) {
      return { valid: true, data: a3 };
    } else {
      return { valid: false };
    }
  }
  function createZodEnum(values, params) {
    return new ZodEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params)
    });
  }
  var util, objectUtil, ZodParsedType, getParsedType, ZodIssueCode, quotelessJson, ZodError, errorMap, overrideErrorMap, makeIssue, EMPTY_PATH, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync, errorUtil, ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv6Regex, datetimeRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, getDiscriminator, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodFunction, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, BRAND, ZodBranded, ZodPipeline, ZodReadonly, custom, late, ZodFirstPartyTypeKind, instanceOfType, stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring, onumber, oboolean, coerce, NEVER, z3;
  var init_lib = __esm({
    "node_modules/zod/lib/index.mjs"() {
      (function(util2) {
        util2.assertEqual = (val) => val;
        function assertIs(_arg) {
        }
        util2.assertIs = assertIs;
        function assertNever(_x) {
          throw new Error();
        }
        util2.assertNever = assertNever;
        util2.arrayToEnum = (items) => {
          const obj = {};
          for (const item of items) {
            obj[item] = item;
          }
          return obj;
        };
        util2.getValidEnumValues = (obj) => {
          const validKeys = util2.objectKeys(obj).filter((k3) => typeof obj[obj[k3]] !== "number");
          const filtered = {};
          for (const k3 of validKeys) {
            filtered[k3] = obj[k3];
          }
          return util2.objectValues(filtered);
        };
        util2.objectValues = (obj) => {
          return util2.objectKeys(obj).map(function(e3) {
            return obj[e3];
          });
        };
        util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
          const keys = [];
          for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
              keys.push(key);
            }
          }
          return keys;
        };
        util2.find = (arr2, checker) => {
          for (const item of arr2) {
            if (checker(item))
              return item;
          }
          return void 0;
        };
        util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
        function joinValues(array, separator = " | ") {
          return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
        }
        util2.joinValues = joinValues;
        util2.jsonStringifyReplacer = (_24, value) => {
          if (typeof value === "bigint") {
            return value.toString();
          }
          return value;
        };
      })(util || (util = {}));
      (function(objectUtil2) {
        objectUtil2.mergeShapes = (first, second) => {
          return {
            ...first,
            ...second
            // second overwrites first
          };
        };
      })(objectUtil || (objectUtil = {}));
      ZodParsedType = util.arrayToEnum([
        "string",
        "nan",
        "number",
        "integer",
        "float",
        "boolean",
        "date",
        "bigint",
        "symbol",
        "function",
        "undefined",
        "null",
        "array",
        "object",
        "unknown",
        "promise",
        "void",
        "never",
        "map",
        "set"
      ]);
      getParsedType = (data) => {
        const t4 = typeof data;
        switch (t4) {
          case "undefined":
            return ZodParsedType.undefined;
          case "string":
            return ZodParsedType.string;
          case "number":
            return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
          case "boolean":
            return ZodParsedType.boolean;
          case "function":
            return ZodParsedType.function;
          case "bigint":
            return ZodParsedType.bigint;
          case "symbol":
            return ZodParsedType.symbol;
          case "object":
            if (Array.isArray(data)) {
              return ZodParsedType.array;
            }
            if (data === null) {
              return ZodParsedType.null;
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
              return ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
              return ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
              return ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
              return ZodParsedType.date;
            }
            return ZodParsedType.object;
          default:
            return ZodParsedType.unknown;
        }
      };
      ZodIssueCode = util.arrayToEnum([
        "invalid_type",
        "invalid_literal",
        "custom",
        "invalid_union",
        "invalid_union_discriminator",
        "invalid_enum_value",
        "unrecognized_keys",
        "invalid_arguments",
        "invalid_return_type",
        "invalid_date",
        "invalid_string",
        "too_small",
        "too_big",
        "invalid_intersection_types",
        "not_multiple_of",
        "not_finite"
      ]);
      quotelessJson = (obj) => {
        const json = JSON.stringify(obj, null, 2);
        return json.replace(/"([^"]+)":/g, "$1:");
      };
      ZodError = class extends Error {
        constructor(issues) {
          super();
          this.issues = [];
          this.addIssue = (sub) => {
            this.issues = [...this.issues, sub];
          };
          this.addIssues = (subs = []) => {
            this.issues = [...this.issues, ...subs];
          };
          const actualProto = new.target.prototype;
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
          } else {
            this.__proto__ = actualProto;
          }
          this.name = "ZodError";
          this.issues = issues;
        }
        get errors() {
          return this.issues;
        }
        format(_mapper) {
          const mapper = _mapper || function(issue) {
            return issue.message;
          };
          const fieldErrors = { _errors: [] };
          const processError = (error2) => {
            for (const issue of error2.issues) {
              if (issue.code === "invalid_union") {
                issue.unionErrors.map(processError);
              } else if (issue.code === "invalid_return_type") {
                processError(issue.returnTypeError);
              } else if (issue.code === "invalid_arguments") {
                processError(issue.argumentsError);
              } else if (issue.path.length === 0) {
                fieldErrors._errors.push(mapper(issue));
              } else {
                let curr = fieldErrors;
                let i3 = 0;
                while (i3 < issue.path.length) {
                  const el = issue.path[i3];
                  const terminal = i3 === issue.path.length - 1;
                  if (!terminal) {
                    curr[el] = curr[el] || { _errors: [] };
                  } else {
                    curr[el] = curr[el] || { _errors: [] };
                    curr[el]._errors.push(mapper(issue));
                  }
                  curr = curr[el];
                  i3++;
                }
              }
            }
          };
          processError(this);
          return fieldErrors;
        }
        toString() {
          return this.message;
        }
        get message() {
          return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
        }
        get isEmpty() {
          return this.issues.length === 0;
        }
        flatten(mapper = (issue) => issue.message) {
          const fieldErrors = {};
          const formErrors = [];
          for (const sub of this.issues) {
            if (sub.path.length > 0) {
              fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
              fieldErrors[sub.path[0]].push(mapper(sub));
            } else {
              formErrors.push(mapper(sub));
            }
          }
          return { formErrors, fieldErrors };
        }
        get formErrors() {
          return this.flatten();
        }
      };
      ZodError.create = (issues) => {
        const error2 = new ZodError(issues);
        return error2;
      };
      errorMap = (issue, _ctx) => {
        let message;
        switch (issue.code) {
          case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
              message = "Required";
            } else {
              message = `Expected ${issue.expected}, received ${issue.received}`;
            }
            break;
          case ZodIssueCode.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
            break;
          case ZodIssueCode.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
            break;
          case ZodIssueCode.invalid_union:
            message = `Invalid input`;
            break;
          case ZodIssueCode.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
            break;
          case ZodIssueCode.invalid_enum_value:
            message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
            break;
          case ZodIssueCode.invalid_arguments:
            message = `Invalid function arguments`;
            break;
          case ZodIssueCode.invalid_return_type:
            message = `Invalid function return type`;
            break;
          case ZodIssueCode.invalid_date:
            message = `Invalid date`;
            break;
          case ZodIssueCode.invalid_string:
            if (typeof issue.validation === "object") {
              if ("includes" in issue.validation) {
                message = `Invalid input: must include "${issue.validation.includes}"`;
                if (typeof issue.validation.position === "number") {
                  message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                }
              } else if ("startsWith" in issue.validation) {
                message = `Invalid input: must start with "${issue.validation.startsWith}"`;
              } else if ("endsWith" in issue.validation) {
                message = `Invalid input: must end with "${issue.validation.endsWith}"`;
              } else {
                util.assertNever(issue.validation);
              }
            } else if (issue.validation !== "regex") {
              message = `Invalid ${issue.validation}`;
            } else {
              message = "Invalid";
            }
            break;
          case ZodIssueCode.too_small:
            if (issue.type === "array")
              message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string")
              message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number")
              message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
            else if (issue.type === "date")
              message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
            else
              message = "Invalid input";
            break;
          case ZodIssueCode.too_big:
            if (issue.type === "array")
              message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string")
              message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number")
              message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint")
              message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
            else if (issue.type === "date")
              message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else
              message = "Invalid input";
            break;
          case ZodIssueCode.custom:
            message = `Invalid input`;
            break;
          case ZodIssueCode.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
          case ZodIssueCode.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
          case ZodIssueCode.not_finite:
            message = "Number must be finite";
            break;
          default:
            message = _ctx.defaultError;
            util.assertNever(issue);
        }
        return { message };
      };
      overrideErrorMap = errorMap;
      makeIssue = (params) => {
        const { data, path, errorMaps, issueData } = params;
        const fullPath = [...path, ...issueData.path || []];
        const fullIssue = {
          ...issueData,
          path: fullPath
        };
        let errorMessage = "";
        const maps = errorMaps.filter((m3) => !!m3).slice().reverse();
        for (const map of maps) {
          errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
        }
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message || errorMessage
        };
      };
      EMPTY_PATH = [];
      ParseStatus = class _ParseStatus {
        constructor() {
          this.value = "valid";
        }
        dirty() {
          if (this.value === "valid")
            this.value = "dirty";
        }
        abort() {
          if (this.value !== "aborted")
            this.value = "aborted";
        }
        static mergeArray(status, results) {
          const arrayValue = [];
          for (const s3 of results) {
            if (s3.status === "aborted")
              return INVALID;
            if (s3.status === "dirty")
              status.dirty();
            arrayValue.push(s3.value);
          }
          return { status: status.value, value: arrayValue };
        }
        static async mergeObjectAsync(status, pairs) {
          const syncPairs = [];
          for (const pair of pairs) {
            syncPairs.push({
              key: await pair.key,
              value: await pair.value
            });
          }
          return _ParseStatus.mergeObjectSync(status, syncPairs);
        }
        static mergeObjectSync(status, pairs) {
          const finalObject = {};
          for (const pair of pairs) {
            const { key, value } = pair;
            if (key.status === "aborted")
              return INVALID;
            if (value.status === "aborted")
              return INVALID;
            if (key.status === "dirty")
              status.dirty();
            if (value.status === "dirty")
              status.dirty();
            if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
              finalObject[key.value] = value.value;
            }
          }
          return { status: status.value, value: finalObject };
        }
      };
      INVALID = Object.freeze({
        status: "aborted"
      });
      DIRTY = (value) => ({ status: "dirty", value });
      OK = (value) => ({ status: "valid", value });
      isAborted = (x2) => x2.status === "aborted";
      isDirty = (x2) => x2.status === "dirty";
      isValid = (x2) => x2.status === "valid";
      isAsync = (x2) => typeof Promise !== "undefined" && x2 instanceof Promise;
      (function(errorUtil2) {
        errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
        errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
      })(errorUtil || (errorUtil = {}));
      ParseInputLazyPath = class {
        constructor(parent, value, path, key) {
          this._cachedPath = [];
          this.parent = parent;
          this.data = value;
          this._path = path;
          this._key = key;
        }
        get path() {
          if (!this._cachedPath.length) {
            if (this._key instanceof Array) {
              this._cachedPath.push(...this._path, ...this._key);
            } else {
              this._cachedPath.push(...this._path, this._key);
            }
          }
          return this._cachedPath;
        }
      };
      handleResult = (ctx, result) => {
        if (isValid(result)) {
          return { success: true, data: result.value };
        } else {
          if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
          }
          return {
            success: false,
            get error() {
              if (this._error)
                return this._error;
              const error2 = new ZodError(ctx.common.issues);
              this._error = error2;
              return this._error;
            }
          };
        }
      };
      ZodType = class {
        constructor(def) {
          this.spa = this.safeParseAsync;
          this._def = def;
          this.parse = this.parse.bind(this);
          this.safeParse = this.safeParse.bind(this);
          this.parseAsync = this.parseAsync.bind(this);
          this.safeParseAsync = this.safeParseAsync.bind(this);
          this.spa = this.spa.bind(this);
          this.refine = this.refine.bind(this);
          this.refinement = this.refinement.bind(this);
          this.superRefine = this.superRefine.bind(this);
          this.optional = this.optional.bind(this);
          this.nullable = this.nullable.bind(this);
          this.nullish = this.nullish.bind(this);
          this.array = this.array.bind(this);
          this.promise = this.promise.bind(this);
          this.or = this.or.bind(this);
          this.and = this.and.bind(this);
          this.transform = this.transform.bind(this);
          this.brand = this.brand.bind(this);
          this.default = this.default.bind(this);
          this.catch = this.catch.bind(this);
          this.describe = this.describe.bind(this);
          this.pipe = this.pipe.bind(this);
          this.readonly = this.readonly.bind(this);
          this.isNullable = this.isNullable.bind(this);
          this.isOptional = this.isOptional.bind(this);
        }
        get description() {
          return this._def.description;
        }
        _getType(input) {
          return getParsedType(input.data);
        }
        _getOrReturnCtx(input, ctx) {
          return ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          };
        }
        _processInputParams(input) {
          return {
            status: new ParseStatus(),
            ctx: {
              common: input.parent.common,
              data: input.data,
              parsedType: getParsedType(input.data),
              schemaErrorMap: this._def.errorMap,
              path: input.path,
              parent: input.parent
            }
          };
        }
        _parseSync(input) {
          const result = this._parse(input);
          if (isAsync(result)) {
            throw new Error("Synchronous parse encountered promise.");
          }
          return result;
        }
        _parseAsync(input) {
          const result = this._parse(input);
          return Promise.resolve(result);
        }
        parse(data, params) {
          const result = this.safeParse(data, params);
          if (result.success)
            return result.data;
          throw result.error;
        }
        safeParse(data, params) {
          var _a2;
          const ctx = {
            common: {
              issues: [],
              async: (_a2 = params === null || params === void 0 ? void 0 : params.async) !== null && _a2 !== void 0 ? _a2 : false,
              contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data)
          };
          const result = this._parseSync({ data, path: ctx.path, parent: ctx });
          return handleResult(ctx, result);
        }
        async parseAsync(data, params) {
          const result = await this.safeParseAsync(data, params);
          if (result.success)
            return result.data;
          throw result.error;
        }
        async safeParseAsync(data, params) {
          const ctx = {
            common: {
              issues: [],
              contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
              async: true
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data)
          };
          const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
          const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
          return handleResult(ctx, result);
        }
        refine(check, message) {
          const getIssueProperties = (val) => {
            if (typeof message === "string" || typeof message === "undefined") {
              return { message };
            } else if (typeof message === "function") {
              return message(val);
            } else {
              return message;
            }
          };
          return this._refinement((val, ctx) => {
            const result = check(val);
            const setError = () => ctx.addIssue({
              code: ZodIssueCode.custom,
              ...getIssueProperties(val)
            });
            if (typeof Promise !== "undefined" && result instanceof Promise) {
              return result.then((data) => {
                if (!data) {
                  setError();
                  return false;
                } else {
                  return true;
                }
              });
            }
            if (!result) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        refinement(check, refinementData) {
          return this._refinement((val, ctx) => {
            if (!check(val)) {
              ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
              return false;
            } else {
              return true;
            }
          });
        }
        _refinement(refinement) {
          return new ZodEffects({
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "refinement", refinement }
          });
        }
        superRefine(refinement) {
          return this._refinement(refinement);
        }
        optional() {
          return ZodOptional.create(this, this._def);
        }
        nullable() {
          return ZodNullable.create(this, this._def);
        }
        nullish() {
          return this.nullable().optional();
        }
        array() {
          return ZodArray.create(this, this._def);
        }
        promise() {
          return ZodPromise.create(this, this._def);
        }
        or(option) {
          return ZodUnion.create([this, option], this._def);
        }
        and(incoming) {
          return ZodIntersection.create(this, incoming, this._def);
        }
        transform(transform) {
          return new ZodEffects({
            ...processCreateParams(this._def),
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "transform", transform }
          });
        }
        default(def) {
          const defaultValueFunc = typeof def === "function" ? def : () => def;
          return new ZodDefault({
            ...processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodDefault
          });
        }
        brand() {
          return new ZodBranded({
            typeName: ZodFirstPartyTypeKind.ZodBranded,
            type: this,
            ...processCreateParams(this._def)
          });
        }
        catch(def) {
          const catchValueFunc = typeof def === "function" ? def : () => def;
          return new ZodCatch({
            ...processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodCatch
          });
        }
        describe(description) {
          const This = this.constructor;
          return new This({
            ...this._def,
            description
          });
        }
        pipe(target) {
          return ZodPipeline.create(this, target);
        }
        readonly() {
          return ZodReadonly.create(this);
        }
        isOptional() {
          return this.safeParse(void 0).success;
        }
        isNullable() {
          return this.safeParse(null).success;
        }
      };
      cuidRegex = /^c[^\s-]{8,}$/i;
      cuid2Regex = /^[a-z][a-z0-9]*$/;
      ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
      uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
      emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
      _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
      ipv4Regex = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
      ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
      datetimeRegex = (args) => {
        if (args.precision) {
          if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
          } else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
          }
        } else if (args.precision === 0) {
          if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
          } else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
          }
        } else {
          if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
          } else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
          }
        }
      };
      ZodString = class _ZodString extends ZodType {
        _parse(input) {
          if (this._def.coerce) {
            input.data = String(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.string) {
            const ctx2 = this._getOrReturnCtx(input);
            addIssueToContext(
              ctx2,
              {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.string,
                received: ctx2.parsedType
              }
              //
            );
            return INVALID;
          }
          const status = new ParseStatus();
          let ctx = void 0;
          for (const check of this._def.checks) {
            if (check.kind === "min") {
              if (input.data.length < check.value) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: false,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "max") {
              if (input.data.length > check.value) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: false,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "length") {
              const tooBig = input.data.length > check.value;
              const tooSmall = input.data.length < check.value;
              if (tooBig || tooSmall) {
                ctx = this._getOrReturnCtx(input, ctx);
                if (tooBig) {
                  addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: check.value,
                    type: "string",
                    inclusive: true,
                    exact: true,
                    message: check.message
                  });
                } else if (tooSmall) {
                  addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: check.value,
                    type: "string",
                    inclusive: true,
                    exact: true,
                    message: check.message
                  });
                }
                status.dirty();
              }
            } else if (check.kind === "email") {
              if (!emailRegex.test(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "email",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "emoji") {
              if (!emojiRegex) {
                emojiRegex = new RegExp(_emojiRegex, "u");
              }
              if (!emojiRegex.test(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "emoji",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "uuid") {
              if (!uuidRegex.test(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "uuid",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "cuid") {
              if (!cuidRegex.test(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "cuid",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "cuid2") {
              if (!cuid2Regex.test(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "cuid2",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "ulid") {
              if (!ulidRegex.test(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "ulid",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "url") {
              try {
                new URL(input.data);
              } catch (_a2) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "url",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "regex") {
              check.regex.lastIndex = 0;
              const testResult = check.regex.test(input.data);
              if (!testResult) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "regex",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "trim") {
              input.data = input.data.trim();
            } else if (check.kind === "includes") {
              if (!input.data.includes(check.value, check.position)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_string,
                  validation: { includes: check.value, position: check.position },
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "toLowerCase") {
              input.data = input.data.toLowerCase();
            } else if (check.kind === "toUpperCase") {
              input.data = input.data.toUpperCase();
            } else if (check.kind === "startsWith") {
              if (!input.data.startsWith(check.value)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_string,
                  validation: { startsWith: check.value },
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "endsWith") {
              if (!input.data.endsWith(check.value)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_string,
                  validation: { endsWith: check.value },
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "datetime") {
              const regex = datetimeRegex(check);
              if (!regex.test(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_string,
                  validation: "datetime",
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "ip") {
              if (!isValidIP(input.data, check.version)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  validation: "ip",
                  code: ZodIssueCode.invalid_string,
                  message: check.message
                });
                status.dirty();
              }
            } else {
              util.assertNever(check);
            }
          }
          return { status: status.value, value: input.data };
        }
        _regex(regex, validation, message) {
          return this.refinement((data) => regex.test(data), {
            validation,
            code: ZodIssueCode.invalid_string,
            ...errorUtil.errToObj(message)
          });
        }
        _addCheck(check) {
          return new _ZodString({
            ...this._def,
            checks: [...this._def.checks, check]
          });
        }
        email(message) {
          return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
        }
        url(message) {
          return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
        }
        emoji(message) {
          return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
        }
        uuid(message) {
          return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
        }
        cuid(message) {
          return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
        }
        cuid2(message) {
          return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
        }
        ulid(message) {
          return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
        }
        ip(options) {
          return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
        }
        datetime(options) {
          var _a2;
          if (typeof options === "string") {
            return this._addCheck({
              kind: "datetime",
              precision: null,
              offset: false,
              message: options
            });
          }
          return this._addCheck({
            kind: "datetime",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            offset: (_a2 = options === null || options === void 0 ? void 0 : options.offset) !== null && _a2 !== void 0 ? _a2 : false,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
          });
        }
        regex(regex, message) {
          return this._addCheck({
            kind: "regex",
            regex,
            ...errorUtil.errToObj(message)
          });
        }
        includes(value, options) {
          return this._addCheck({
            kind: "includes",
            value,
            position: options === null || options === void 0 ? void 0 : options.position,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
          });
        }
        startsWith(value, message) {
          return this._addCheck({
            kind: "startsWith",
            value,
            ...errorUtil.errToObj(message)
          });
        }
        endsWith(value, message) {
          return this._addCheck({
            kind: "endsWith",
            value,
            ...errorUtil.errToObj(message)
          });
        }
        min(minLength, message) {
          return this._addCheck({
            kind: "min",
            value: minLength,
            ...errorUtil.errToObj(message)
          });
        }
        max(maxLength, message) {
          return this._addCheck({
            kind: "max",
            value: maxLength,
            ...errorUtil.errToObj(message)
          });
        }
        length(len, message) {
          return this._addCheck({
            kind: "length",
            value: len,
            ...errorUtil.errToObj(message)
          });
        }
        /**
         * @deprecated Use z.string().min(1) instead.
         * @see {@link ZodString.min}
         */
        nonempty(message) {
          return this.min(1, errorUtil.errToObj(message));
        }
        trim() {
          return new _ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "trim" }]
          });
        }
        toLowerCase() {
          return new _ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toLowerCase" }]
          });
        }
        toUpperCase() {
          return new _ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toUpperCase" }]
          });
        }
        get isDatetime() {
          return !!this._def.checks.find((ch) => ch.kind === "datetime");
        }
        get isEmail() {
          return !!this._def.checks.find((ch) => ch.kind === "email");
        }
        get isURL() {
          return !!this._def.checks.find((ch) => ch.kind === "url");
        }
        get isEmoji() {
          return !!this._def.checks.find((ch) => ch.kind === "emoji");
        }
        get isUUID() {
          return !!this._def.checks.find((ch) => ch.kind === "uuid");
        }
        get isCUID() {
          return !!this._def.checks.find((ch) => ch.kind === "cuid");
        }
        get isCUID2() {
          return !!this._def.checks.find((ch) => ch.kind === "cuid2");
        }
        get isULID() {
          return !!this._def.checks.find((ch) => ch.kind === "ulid");
        }
        get isIP() {
          return !!this._def.checks.find((ch) => ch.kind === "ip");
        }
        get minLength() {
          let min = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "min") {
              if (min === null || ch.value > min)
                min = ch.value;
            }
          }
          return min;
        }
        get maxLength() {
          let max = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "max") {
              if (max === null || ch.value < max)
                max = ch.value;
            }
          }
          return max;
        }
      };
      ZodString.create = (params) => {
        var _a2;
        return new ZodString({
          checks: [],
          typeName: ZodFirstPartyTypeKind.ZodString,
          coerce: (_a2 = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a2 !== void 0 ? _a2 : false,
          ...processCreateParams(params)
        });
      };
      ZodNumber = class _ZodNumber extends ZodType {
        constructor() {
          super(...arguments);
          this.min = this.gte;
          this.max = this.lte;
          this.step = this.multipleOf;
        }
        _parse(input) {
          if (this._def.coerce) {
            input.data = Number(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.number) {
            const ctx2 = this._getOrReturnCtx(input);
            addIssueToContext(ctx2, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.number,
              received: ctx2.parsedType
            });
            return INVALID;
          }
          let ctx = void 0;
          const status = new ParseStatus();
          for (const check of this._def.checks) {
            if (check.kind === "int") {
              if (!util.isInteger(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.invalid_type,
                  expected: "integer",
                  received: "float",
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "min") {
              const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
              if (tooSmall) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "number",
                  inclusive: check.inclusive,
                  exact: false,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "max") {
              const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
              if (tooBig) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "number",
                  inclusive: check.inclusive,
                  exact: false,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "multipleOf") {
              if (floatSafeRemainder(input.data, check.value) !== 0) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.not_multiple_of,
                  multipleOf: check.value,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "finite") {
              if (!Number.isFinite(input.data)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.not_finite,
                  message: check.message
                });
                status.dirty();
              }
            } else {
              util.assertNever(check);
            }
          }
          return { status: status.value, value: input.data };
        }
        gte(value, message) {
          return this.setLimit("min", value, true, errorUtil.toString(message));
        }
        gt(value, message) {
          return this.setLimit("min", value, false, errorUtil.toString(message));
        }
        lte(value, message) {
          return this.setLimit("max", value, true, errorUtil.toString(message));
        }
        lt(value, message) {
          return this.setLimit("max", value, false, errorUtil.toString(message));
        }
        setLimit(kind, value, inclusive, message) {
          return new _ZodNumber({
            ...this._def,
            checks: [
              ...this._def.checks,
              {
                kind,
                value,
                inclusive,
                message: errorUtil.toString(message)
              }
            ]
          });
        }
        _addCheck(check) {
          return new _ZodNumber({
            ...this._def,
            checks: [...this._def.checks, check]
          });
        }
        int(message) {
          return this._addCheck({
            kind: "int",
            message: errorUtil.toString(message)
          });
        }
        positive(message) {
          return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message)
          });
        }
        negative(message) {
          return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message)
          });
        }
        nonpositive(message) {
          return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message)
          });
        }
        nonnegative(message) {
          return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message)
          });
        }
        multipleOf(value, message) {
          return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil.toString(message)
          });
        }
        finite(message) {
          return this._addCheck({
            kind: "finite",
            message: errorUtil.toString(message)
          });
        }
        safe(message) {
          return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: errorUtil.toString(message)
          })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: errorUtil.toString(message)
          });
        }
        get minValue() {
          let min = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "min") {
              if (min === null || ch.value > min)
                min = ch.value;
            }
          }
          return min;
        }
        get maxValue() {
          let max = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "max") {
              if (max === null || ch.value < max)
                max = ch.value;
            }
          }
          return max;
        }
        get isInt() {
          return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
        }
        get isFinite() {
          let max = null, min = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
              return true;
            } else if (ch.kind === "min") {
              if (min === null || ch.value > min)
                min = ch.value;
            } else if (ch.kind === "max") {
              if (max === null || ch.value < max)
                max = ch.value;
            }
          }
          return Number.isFinite(min) && Number.isFinite(max);
        }
      };
      ZodNumber.create = (params) => {
        return new ZodNumber({
          checks: [],
          typeName: ZodFirstPartyTypeKind.ZodNumber,
          coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
          ...processCreateParams(params)
        });
      };
      ZodBigInt = class _ZodBigInt extends ZodType {
        constructor() {
          super(...arguments);
          this.min = this.gte;
          this.max = this.lte;
        }
        _parse(input) {
          if (this._def.coerce) {
            input.data = BigInt(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.bigint) {
            const ctx2 = this._getOrReturnCtx(input);
            addIssueToContext(ctx2, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.bigint,
              received: ctx2.parsedType
            });
            return INVALID;
          }
          let ctx = void 0;
          const status = new ParseStatus();
          for (const check of this._def.checks) {
            if (check.kind === "min") {
              const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
              if (tooSmall) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  type: "bigint",
                  minimum: check.value,
                  inclusive: check.inclusive,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "max") {
              const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
              if (tooBig) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  type: "bigint",
                  maximum: check.value,
                  inclusive: check.inclusive,
                  message: check.message
                });
                status.dirty();
              }
            } else if (check.kind === "multipleOf") {
              if (input.data % check.value !== BigInt(0)) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.not_multiple_of,
                  multipleOf: check.value,
                  message: check.message
                });
                status.dirty();
              }
            } else {
              util.assertNever(check);
            }
          }
          return { status: status.value, value: input.data };
        }
        gte(value, message) {
          return this.setLimit("min", value, true, errorUtil.toString(message));
        }
        gt(value, message) {
          return this.setLimit("min", value, false, errorUtil.toString(message));
        }
        lte(value, message) {
          return this.setLimit("max", value, true, errorUtil.toString(message));
        }
        lt(value, message) {
          return this.setLimit("max", value, false, errorUtil.toString(message));
        }
        setLimit(kind, value, inclusive, message) {
          return new _ZodBigInt({
            ...this._def,
            checks: [
              ...this._def.checks,
              {
                kind,
                value,
                inclusive,
                message: errorUtil.toString(message)
              }
            ]
          });
        }
        _addCheck(check) {
          return new _ZodBigInt({
            ...this._def,
            checks: [...this._def.checks, check]
          });
        }
        positive(message) {
          return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message)
          });
        }
        negative(message) {
          return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message)
          });
        }
        nonpositive(message) {
          return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message)
          });
        }
        nonnegative(message) {
          return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message)
          });
        }
        multipleOf(value, message) {
          return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil.toString(message)
          });
        }
        get minValue() {
          let min = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "min") {
              if (min === null || ch.value > min)
                min = ch.value;
            }
          }
          return min;
        }
        get maxValue() {
          let max = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "max") {
              if (max === null || ch.value < max)
                max = ch.value;
            }
          }
          return max;
        }
      };
      ZodBigInt.create = (params) => {
        var _a2;
        return new ZodBigInt({
          checks: [],
          typeName: ZodFirstPartyTypeKind.ZodBigInt,
          coerce: (_a2 = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a2 !== void 0 ? _a2 : false,
          ...processCreateParams(params)
        });
      };
      ZodBoolean = class extends ZodType {
        _parse(input) {
          if (this._def.coerce) {
            input.data = Boolean(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.boolean) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.boolean,
              received: ctx.parsedType
            });
            return INVALID;
          }
          return OK(input.data);
        }
      };
      ZodBoolean.create = (params) => {
        return new ZodBoolean({
          typeName: ZodFirstPartyTypeKind.ZodBoolean,
          coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
          ...processCreateParams(params)
        });
      };
      ZodDate = class _ZodDate extends ZodType {
        _parse(input) {
          if (this._def.coerce) {
            input.data = new Date(input.data);
          }
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.date) {
            const ctx2 = this._getOrReturnCtx(input);
            addIssueToContext(ctx2, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.date,
              received: ctx2.parsedType
            });
            return INVALID;
          }
          if (isNaN(input.data.getTime())) {
            const ctx2 = this._getOrReturnCtx(input);
            addIssueToContext(ctx2, {
              code: ZodIssueCode.invalid_date
            });
            return INVALID;
          }
          const status = new ParseStatus();
          let ctx = void 0;
          for (const check of this._def.checks) {
            if (check.kind === "min") {
              if (input.data.getTime() < check.value) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  message: check.message,
                  inclusive: true,
                  exact: false,
                  minimum: check.value,
                  type: "date"
                });
                status.dirty();
              }
            } else if (check.kind === "max") {
              if (input.data.getTime() > check.value) {
                ctx = this._getOrReturnCtx(input, ctx);
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  message: check.message,
                  inclusive: true,
                  exact: false,
                  maximum: check.value,
                  type: "date"
                });
                status.dirty();
              }
            } else {
              util.assertNever(check);
            }
          }
          return {
            status: status.value,
            value: new Date(input.data.getTime())
          };
        }
        _addCheck(check) {
          return new _ZodDate({
            ...this._def,
            checks: [...this._def.checks, check]
          });
        }
        min(minDate, message) {
          return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: errorUtil.toString(message)
          });
        }
        max(maxDate, message) {
          return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: errorUtil.toString(message)
          });
        }
        get minDate() {
          let min = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "min") {
              if (min === null || ch.value > min)
                min = ch.value;
            }
          }
          return min != null ? new Date(min) : null;
        }
        get maxDate() {
          let max = null;
          for (const ch of this._def.checks) {
            if (ch.kind === "max") {
              if (max === null || ch.value < max)
                max = ch.value;
            }
          }
          return max != null ? new Date(max) : null;
        }
      };
      ZodDate.create = (params) => {
        return new ZodDate({
          checks: [],
          coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
          typeName: ZodFirstPartyTypeKind.ZodDate,
          ...processCreateParams(params)
        });
      };
      ZodSymbol = class extends ZodType {
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.symbol) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.symbol,
              received: ctx.parsedType
            });
            return INVALID;
          }
          return OK(input.data);
        }
      };
      ZodSymbol.create = (params) => {
        return new ZodSymbol({
          typeName: ZodFirstPartyTypeKind.ZodSymbol,
          ...processCreateParams(params)
        });
      };
      ZodUndefined = class extends ZodType {
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.undefined,
              received: ctx.parsedType
            });
            return INVALID;
          }
          return OK(input.data);
        }
      };
      ZodUndefined.create = (params) => {
        return new ZodUndefined({
          typeName: ZodFirstPartyTypeKind.ZodUndefined,
          ...processCreateParams(params)
        });
      };
      ZodNull = class extends ZodType {
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.null) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.null,
              received: ctx.parsedType
            });
            return INVALID;
          }
          return OK(input.data);
        }
      };
      ZodNull.create = (params) => {
        return new ZodNull({
          typeName: ZodFirstPartyTypeKind.ZodNull,
          ...processCreateParams(params)
        });
      };
      ZodAny = class extends ZodType {
        constructor() {
          super(...arguments);
          this._any = true;
        }
        _parse(input) {
          return OK(input.data);
        }
      };
      ZodAny.create = (params) => {
        return new ZodAny({
          typeName: ZodFirstPartyTypeKind.ZodAny,
          ...processCreateParams(params)
        });
      };
      ZodUnknown = class extends ZodType {
        constructor() {
          super(...arguments);
          this._unknown = true;
        }
        _parse(input) {
          return OK(input.data);
        }
      };
      ZodUnknown.create = (params) => {
        return new ZodUnknown({
          typeName: ZodFirstPartyTypeKind.ZodUnknown,
          ...processCreateParams(params)
        });
      };
      ZodNever = class extends ZodType {
        _parse(input) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.never,
            received: ctx.parsedType
          });
          return INVALID;
        }
      };
      ZodNever.create = (params) => {
        return new ZodNever({
          typeName: ZodFirstPartyTypeKind.ZodNever,
          ...processCreateParams(params)
        });
      };
      ZodVoid = class extends ZodType {
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.void,
              received: ctx.parsedType
            });
            return INVALID;
          }
          return OK(input.data);
        }
      };
      ZodVoid.create = (params) => {
        return new ZodVoid({
          typeName: ZodFirstPartyTypeKind.ZodVoid,
          ...processCreateParams(params)
        });
      };
      ZodArray = class _ZodArray extends ZodType {
        _parse(input) {
          const { ctx, status } = this._processInputParams(input);
          const def = this._def;
          if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.array,
              received: ctx.parsedType
            });
            return INVALID;
          }
          if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
              addIssueToContext(ctx, {
                code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
                minimum: tooSmall ? def.exactLength.value : void 0,
                maximum: tooBig ? def.exactLength.value : void 0,
                type: "array",
                inclusive: true,
                exact: true,
                message: def.exactLength.message
              });
              status.dirty();
            }
          }
          if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: def.minLength.value,
                type: "array",
                inclusive: true,
                exact: false,
                message: def.minLength.message
              });
              status.dirty();
            }
          }
          if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: def.maxLength.value,
                type: "array",
                inclusive: true,
                exact: false,
                message: def.maxLength.message
              });
              status.dirty();
            }
          }
          if (ctx.common.async) {
            return Promise.all([...ctx.data].map((item, i3) => {
              return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i3));
            })).then((result2) => {
              return ParseStatus.mergeArray(status, result2);
            });
          }
          const result = [...ctx.data].map((item, i3) => {
            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i3));
          });
          return ParseStatus.mergeArray(status, result);
        }
        get element() {
          return this._def.type;
        }
        min(minLength, message) {
          return new _ZodArray({
            ...this._def,
            minLength: { value: minLength, message: errorUtil.toString(message) }
          });
        }
        max(maxLength, message) {
          return new _ZodArray({
            ...this._def,
            maxLength: { value: maxLength, message: errorUtil.toString(message) }
          });
        }
        length(len, message) {
          return new _ZodArray({
            ...this._def,
            exactLength: { value: len, message: errorUtil.toString(message) }
          });
        }
        nonempty(message) {
          return this.min(1, message);
        }
      };
      ZodArray.create = (schema, params) => {
        return new ZodArray({
          type: schema,
          minLength: null,
          maxLength: null,
          exactLength: null,
          typeName: ZodFirstPartyTypeKind.ZodArray,
          ...processCreateParams(params)
        });
      };
      ZodObject = class _ZodObject extends ZodType {
        constructor() {
          super(...arguments);
          this._cached = null;
          this.nonstrict = this.passthrough;
          this.augment = this.extend;
        }
        _getCached() {
          if (this._cached !== null)
            return this._cached;
          const shape = this._def.shape();
          const keys = util.objectKeys(shape);
          return this._cached = { shape, keys };
        }
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.object) {
            const ctx2 = this._getOrReturnCtx(input);
            addIssueToContext(ctx2, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.object,
              received: ctx2.parsedType
            });
            return INVALID;
          }
          const { status, ctx } = this._processInputParams(input);
          const { shape, keys: shapeKeys } = this._getCached();
          const extraKeys = [];
          if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
            for (const key in ctx.data) {
              if (!shapeKeys.includes(key)) {
                extraKeys.push(key);
              }
            }
          }
          const pairs = [];
          for (const key of shapeKeys) {
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
              alwaysSet: key in ctx.data
            });
          }
          if (this._def.catchall instanceof ZodNever) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") {
              for (const key of extraKeys) {
                pairs.push({
                  key: { status: "valid", value: key },
                  value: { status: "valid", value: ctx.data[key] }
                });
              }
            } else if (unknownKeys === "strict") {
              if (extraKeys.length > 0) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.unrecognized_keys,
                  keys: extraKeys
                });
                status.dirty();
              }
            } else if (unknownKeys === "strip")
              ;
            else {
              throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
            }
          } else {
            const catchall = this._def.catchall;
            for (const key of extraKeys) {
              const value = ctx.data[key];
              pairs.push({
                key: { status: "valid", value: key },
                value: catchall._parse(
                  new ParseInputLazyPath(ctx, value, ctx.path, key)
                  //, ctx.child(key), value, getParsedType(value)
                ),
                alwaysSet: key in ctx.data
              });
            }
          }
          if (ctx.common.async) {
            return Promise.resolve().then(async () => {
              const syncPairs = [];
              for (const pair of pairs) {
                const key = await pair.key;
                syncPairs.push({
                  key,
                  value: await pair.value,
                  alwaysSet: pair.alwaysSet
                });
              }
              return syncPairs;
            }).then((syncPairs) => {
              return ParseStatus.mergeObjectSync(status, syncPairs);
            });
          } else {
            return ParseStatus.mergeObjectSync(status, pairs);
          }
        }
        get shape() {
          return this._def.shape();
        }
        strict(message) {
          errorUtil.errToObj;
          return new _ZodObject({
            ...this._def,
            unknownKeys: "strict",
            ...message !== void 0 ? {
              errorMap: (issue, ctx) => {
                var _a2, _b, _c, _d;
                const defaultError = (_c = (_b = (_a2 = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a2, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                if (issue.code === "unrecognized_keys")
                  return {
                    message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                  };
                return {
                  message: defaultError
                };
              }
            } : {}
          });
        }
        strip() {
          return new _ZodObject({
            ...this._def,
            unknownKeys: "strip"
          });
        }
        passthrough() {
          return new _ZodObject({
            ...this._def,
            unknownKeys: "passthrough"
          });
        }
        // const AugmentFactory =
        //   <Def extends ZodObjectDef>(def: Def) =>
        //   <Augmentation extends ZodRawShape>(
        //     augmentation: Augmentation
        //   ): ZodObject<
        //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
        //     Def["unknownKeys"],
        //     Def["catchall"]
        //   > => {
        //     return new ZodObject({
        //       ...def,
        //       shape: () => ({
        //         ...def.shape(),
        //         ...augmentation,
        //       }),
        //     }) as any;
        //   };
        extend(augmentation) {
          return new _ZodObject({
            ...this._def,
            shape: () => ({
              ...this._def.shape(),
              ...augmentation
            })
          });
        }
        /**
         * Prior to zod@1.0.12 there was a bug in the
         * inferred type of merged objects. Please
         * upgrade if you are experiencing issues.
         */
        merge(merging) {
          const merged = new _ZodObject({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: () => ({
              ...this._def.shape(),
              ...merging._def.shape()
            }),
            typeName: ZodFirstPartyTypeKind.ZodObject
          });
          return merged;
        }
        // merge<
        //   Incoming extends AnyZodObject,
        //   Augmentation extends Incoming["shape"],
        //   NewOutput extends {
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   },
        //   NewInput extends {
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }
        // >(
        //   merging: Incoming
        // ): ZodObject<
        //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
        //   Incoming["_def"]["unknownKeys"],
        //   Incoming["_def"]["catchall"],
        //   NewOutput,
        //   NewInput
        // > {
        //   const merged: any = new ZodObject({
        //     unknownKeys: merging._def.unknownKeys,
        //     catchall: merging._def.catchall,
        //     shape: () =>
        //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
        //     typeName: ZodFirstPartyTypeKind.ZodObject,
        //   }) as any;
        //   return merged;
        // }
        setKey(key, schema) {
          return this.augment({ [key]: schema });
        }
        // merge<Incoming extends AnyZodObject>(
        //   merging: Incoming
        // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
        // ZodObject<
        //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
        //   Incoming["_def"]["unknownKeys"],
        //   Incoming["_def"]["catchall"]
        // > {
        //   // const mergedShape = objectUtil.mergeShapes(
        //   //   this._def.shape(),
        //   //   merging._def.shape()
        //   // );
        //   const merged: any = new ZodObject({
        //     unknownKeys: merging._def.unknownKeys,
        //     catchall: merging._def.catchall,
        //     shape: () =>
        //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
        //     typeName: ZodFirstPartyTypeKind.ZodObject,
        //   }) as any;
        //   return merged;
        // }
        catchall(index) {
          return new _ZodObject({
            ...this._def,
            catchall: index
          });
        }
        pick(mask) {
          const shape = {};
          util.objectKeys(mask).forEach((key) => {
            if (mask[key] && this.shape[key]) {
              shape[key] = this.shape[key];
            }
          });
          return new _ZodObject({
            ...this._def,
            shape: () => shape
          });
        }
        omit(mask) {
          const shape = {};
          util.objectKeys(this.shape).forEach((key) => {
            if (!mask[key]) {
              shape[key] = this.shape[key];
            }
          });
          return new _ZodObject({
            ...this._def,
            shape: () => shape
          });
        }
        /**
         * @deprecated
         */
        deepPartial() {
          return deepPartialify(this);
        }
        partial(mask) {
          const newShape = {};
          util.objectKeys(this.shape).forEach((key) => {
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) {
              newShape[key] = fieldSchema;
            } else {
              newShape[key] = fieldSchema.optional();
            }
          });
          return new _ZodObject({
            ...this._def,
            shape: () => newShape
          });
        }
        required(mask) {
          const newShape = {};
          util.objectKeys(this.shape).forEach((key) => {
            if (mask && !mask[key]) {
              newShape[key] = this.shape[key];
            } else {
              const fieldSchema = this.shape[key];
              let newField = fieldSchema;
              while (newField instanceof ZodOptional) {
                newField = newField._def.innerType;
              }
              newShape[key] = newField;
            }
          });
          return new _ZodObject({
            ...this._def,
            shape: () => newShape
          });
        }
        keyof() {
          return createZodEnum(util.objectKeys(this.shape));
        }
      };
      ZodObject.create = (shape, params) => {
        return new ZodObject({
          shape: () => shape,
          unknownKeys: "strip",
          catchall: ZodNever.create(),
          typeName: ZodFirstPartyTypeKind.ZodObject,
          ...processCreateParams(params)
        });
      };
      ZodObject.strictCreate = (shape, params) => {
        return new ZodObject({
          shape: () => shape,
          unknownKeys: "strict",
          catchall: ZodNever.create(),
          typeName: ZodFirstPartyTypeKind.ZodObject,
          ...processCreateParams(params)
        });
      };
      ZodObject.lazycreate = (shape, params) => {
        return new ZodObject({
          shape,
          unknownKeys: "strip",
          catchall: ZodNever.create(),
          typeName: ZodFirstPartyTypeKind.ZodObject,
          ...processCreateParams(params)
        });
      };
      ZodUnion = class extends ZodType {
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          const options = this._def.options;
          function handleResults(results) {
            for (const result of results) {
              if (result.result.status === "valid") {
                return result.result;
              }
            }
            for (const result of results) {
              if (result.result.status === "dirty") {
                ctx.common.issues.push(...result.ctx.common.issues);
                return result.result;
              }
            }
            const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_union,
              unionErrors
            });
            return INVALID;
          }
          if (ctx.common.async) {
            return Promise.all(options.map(async (option) => {
              const childCtx = {
                ...ctx,
                common: {
                  ...ctx.common,
                  issues: []
                },
                parent: null
              };
              return {
                result: await option._parseAsync({
                  data: ctx.data,
                  path: ctx.path,
                  parent: childCtx
                }),
                ctx: childCtx
              };
            })).then(handleResults);
          } else {
            let dirty = void 0;
            const issues = [];
            for (const option of options) {
              const childCtx = {
                ...ctx,
                common: {
                  ...ctx.common,
                  issues: []
                },
                parent: null
              };
              const result = option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              });
              if (result.status === "valid") {
                return result;
              } else if (result.status === "dirty" && !dirty) {
                dirty = { result, ctx: childCtx };
              }
              if (childCtx.common.issues.length) {
                issues.push(childCtx.common.issues);
              }
            }
            if (dirty) {
              ctx.common.issues.push(...dirty.ctx.common.issues);
              return dirty.result;
            }
            const unionErrors = issues.map((issues2) => new ZodError(issues2));
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_union,
              unionErrors
            });
            return INVALID;
          }
        }
        get options() {
          return this._def.options;
        }
      };
      ZodUnion.create = (types, params) => {
        return new ZodUnion({
          options: types,
          typeName: ZodFirstPartyTypeKind.ZodUnion,
          ...processCreateParams(params)
        });
      };
      getDiscriminator = (type) => {
        if (type instanceof ZodLazy) {
          return getDiscriminator(type.schema);
        } else if (type instanceof ZodEffects) {
          return getDiscriminator(type.innerType());
        } else if (type instanceof ZodLiteral) {
          return [type.value];
        } else if (type instanceof ZodEnum) {
          return type.options;
        } else if (type instanceof ZodNativeEnum) {
          return Object.keys(type.enum);
        } else if (type instanceof ZodDefault) {
          return getDiscriminator(type._def.innerType);
        } else if (type instanceof ZodUndefined) {
          return [void 0];
        } else if (type instanceof ZodNull) {
          return [null];
        } else {
          return null;
        }
      };
      ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.object,
              received: ctx.parsedType
            });
            return INVALID;
          }
          const discriminator = this.discriminator;
          const discriminatorValue = ctx.data[discriminator];
          const option = this.optionsMap.get(discriminatorValue);
          if (!option) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_union_discriminator,
              options: Array.from(this.optionsMap.keys()),
              path: [discriminator]
            });
            return INVALID;
          }
          if (ctx.common.async) {
            return option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
          } else {
            return option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
          }
        }
        get discriminator() {
          return this._def.discriminator;
        }
        get options() {
          return this._def.options;
        }
        get optionsMap() {
          return this._def.optionsMap;
        }
        /**
         * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
         * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
         * have a different value for each object in the union.
         * @param discriminator the name of the discriminator property
         * @param types an array of object schemas
         * @param params
         */
        static create(discriminator, options, params) {
          const optionsMap = /* @__PURE__ */ new Map();
          for (const type of options) {
            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues) {
              throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            }
            for (const value of discriminatorValues) {
              if (optionsMap.has(value)) {
                throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
              }
              optionsMap.set(value, type);
            }
          }
          return new _ZodDiscriminatedUnion({
            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
            discriminator,
            options,
            optionsMap,
            ...processCreateParams(params)
          });
        }
      };
      ZodIntersection = class extends ZodType {
        _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          const handleParsed = (parsedLeft, parsedRight) => {
            if (isAborted(parsedLeft) || isAborted(parsedRight)) {
              return INVALID;
            }
            const merged = mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_intersection_types
              });
              return INVALID;
            }
            if (isDirty(parsedLeft) || isDirty(parsedRight)) {
              status.dirty();
            }
            return { status: status.value, value: merged.data };
          };
          if (ctx.common.async) {
            return Promise.all([
              this._def.left._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              }),
              this._def.right._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              })
            ]).then(([left, right]) => handleParsed(left, right));
          } else {
            return handleParsed(this._def.left._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }), this._def.right._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }));
          }
        }
      };
      ZodIntersection.create = (left, right, params) => {
        return new ZodIntersection({
          left,
          right,
          typeName: ZodFirstPartyTypeKind.ZodIntersection,
          ...processCreateParams(params)
        });
      };
      ZodTuple = class _ZodTuple extends ZodType {
        _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.array,
              received: ctx.parsedType
            });
            return INVALID;
          }
          if (ctx.data.length < this._def.items.length) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: this._def.items.length,
              inclusive: true,
              exact: false,
              type: "array"
            });
            return INVALID;
          }
          const rest = this._def.rest;
          if (!rest && ctx.data.length > this._def.items.length) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: this._def.items.length,
              inclusive: true,
              exact: false,
              type: "array"
            });
            status.dirty();
          }
          const items = [...ctx.data].map((item, itemIndex) => {
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema)
              return null;
            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
          }).filter((x2) => !!x2);
          if (ctx.common.async) {
            return Promise.all(items).then((results) => {
              return ParseStatus.mergeArray(status, results);
            });
          } else {
            return ParseStatus.mergeArray(status, items);
          }
        }
        get items() {
          return this._def.items;
        }
        rest(rest) {
          return new _ZodTuple({
            ...this._def,
            rest
          });
        }
      };
      ZodTuple.create = (schemas, params) => {
        if (!Array.isArray(schemas)) {
          throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
        }
        return new ZodTuple({
          items: schemas,
          typeName: ZodFirstPartyTypeKind.ZodTuple,
          rest: null,
          ...processCreateParams(params)
        });
      };
      ZodRecord = class _ZodRecord extends ZodType {
        get keySchema() {
          return this._def.keyType;
        }
        get valueSchema() {
          return this._def.valueType;
        }
        _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.object,
              received: ctx.parsedType
            });
            return INVALID;
          }
          const pairs = [];
          const keyType = this._def.keyType;
          const valueType = this._def.valueType;
          for (const key in ctx.data) {
            pairs.push({
              key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
              value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key))
            });
          }
          if (ctx.common.async) {
            return ParseStatus.mergeObjectAsync(status, pairs);
          } else {
            return ParseStatus.mergeObjectSync(status, pairs);
          }
        }
        get element() {
          return this._def.valueType;
        }
        static create(first, second, third) {
          if (second instanceof ZodType) {
            return new _ZodRecord({
              keyType: first,
              valueType: second,
              typeName: ZodFirstPartyTypeKind.ZodRecord,
              ...processCreateParams(third)
            });
          }
          return new _ZodRecord({
            keyType: ZodString.create(),
            valueType: first,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(second)
          });
        }
      };
      ZodMap = class extends ZodType {
        get keySchema() {
          return this._def.keyType;
        }
        get valueSchema() {
          return this._def.valueType;
        }
        _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.map) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.map,
              received: ctx.parsedType
            });
            return INVALID;
          }
          const keyType = this._def.keyType;
          const valueType = this._def.valueType;
          const pairs = [...ctx.data.entries()].map(([key, value], index) => {
            return {
              key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
              value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
            };
          });
          if (ctx.common.async) {
            const finalMap = /* @__PURE__ */ new Map();
            return Promise.resolve().then(async () => {
              for (const pair of pairs) {
                const key = await pair.key;
                const value = await pair.value;
                if (key.status === "aborted" || value.status === "aborted") {
                  return INVALID;
                }
                if (key.status === "dirty" || value.status === "dirty") {
                  status.dirty();
                }
                finalMap.set(key.value, value.value);
              }
              return { status: status.value, value: finalMap };
            });
          } else {
            const finalMap = /* @__PURE__ */ new Map();
            for (const pair of pairs) {
              const key = pair.key;
              const value = pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          }
        }
      };
      ZodMap.create = (keyType, valueType, params) => {
        return new ZodMap({
          valueType,
          keyType,
          typeName: ZodFirstPartyTypeKind.ZodMap,
          ...processCreateParams(params)
        });
      };
      ZodSet = class _ZodSet extends ZodType {
        _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.set) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.set,
              received: ctx.parsedType
            });
            return INVALID;
          }
          const def = this._def;
          if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: def.minSize.value,
                type: "set",
                inclusive: true,
                exact: false,
                message: def.minSize.message
              });
              status.dirty();
            }
          }
          if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: def.maxSize.value,
                type: "set",
                inclusive: true,
                exact: false,
                message: def.maxSize.message
              });
              status.dirty();
            }
          }
          const valueType = this._def.valueType;
          function finalizeSet(elements2) {
            const parsedSet = /* @__PURE__ */ new Set();
            for (const element of elements2) {
              if (element.status === "aborted")
                return INVALID;
              if (element.status === "dirty")
                status.dirty();
              parsedSet.add(element.value);
            }
            return { status: status.value, value: parsedSet };
          }
          const elements = [...ctx.data.values()].map((item, i3) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i3)));
          if (ctx.common.async) {
            return Promise.all(elements).then((elements2) => finalizeSet(elements2));
          } else {
            return finalizeSet(elements);
          }
        }
        min(minSize, message) {
          return new _ZodSet({
            ...this._def,
            minSize: { value: minSize, message: errorUtil.toString(message) }
          });
        }
        max(maxSize, message) {
          return new _ZodSet({
            ...this._def,
            maxSize: { value: maxSize, message: errorUtil.toString(message) }
          });
        }
        size(size, message) {
          return this.min(size, message).max(size, message);
        }
        nonempty(message) {
          return this.min(1, message);
        }
      };
      ZodSet.create = (valueType, params) => {
        return new ZodSet({
          valueType,
          minSize: null,
          maxSize: null,
          typeName: ZodFirstPartyTypeKind.ZodSet,
          ...processCreateParams(params)
        });
      };
      ZodFunction = class _ZodFunction extends ZodType {
        constructor() {
          super(...arguments);
          this.validate = this.implement;
        }
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.function) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.function,
              received: ctx.parsedType
            });
            return INVALID;
          }
          function makeArgsIssue(args, error2) {
            return makeIssue({
              data: args,
              path: ctx.path,
              errorMaps: [
                ctx.common.contextualErrorMap,
                ctx.schemaErrorMap,
                getErrorMap(),
                errorMap
              ].filter((x2) => !!x2),
              issueData: {
                code: ZodIssueCode.invalid_arguments,
                argumentsError: error2
              }
            });
          }
          function makeReturnsIssue(returns, error2) {
            return makeIssue({
              data: returns,
              path: ctx.path,
              errorMaps: [
                ctx.common.contextualErrorMap,
                ctx.schemaErrorMap,
                getErrorMap(),
                errorMap
              ].filter((x2) => !!x2),
              issueData: {
                code: ZodIssueCode.invalid_return_type,
                returnTypeError: error2
              }
            });
          }
          const params = { errorMap: ctx.common.contextualErrorMap };
          const fn = ctx.data;
          if (this._def.returns instanceof ZodPromise) {
            const me = this;
            return OK(async function(...args) {
              const error2 = new ZodError([]);
              const parsedArgs = await me._def.args.parseAsync(args, params).catch((e3) => {
                error2.addIssue(makeArgsIssue(args, e3));
                throw error2;
              });
              const result = await Reflect.apply(fn, this, parsedArgs);
              const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e3) => {
                error2.addIssue(makeReturnsIssue(result, e3));
                throw error2;
              });
              return parsedReturns;
            });
          } else {
            const me = this;
            return OK(function(...args) {
              const parsedArgs = me._def.args.safeParse(args, params);
              if (!parsedArgs.success) {
                throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
              }
              const result = Reflect.apply(fn, this, parsedArgs.data);
              const parsedReturns = me._def.returns.safeParse(result, params);
              if (!parsedReturns.success) {
                throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
              }
              return parsedReturns.data;
            });
          }
        }
        parameters() {
          return this._def.args;
        }
        returnType() {
          return this._def.returns;
        }
        args(...items) {
          return new _ZodFunction({
            ...this._def,
            args: ZodTuple.create(items).rest(ZodUnknown.create())
          });
        }
        returns(returnType) {
          return new _ZodFunction({
            ...this._def,
            returns: returnType
          });
        }
        implement(func) {
          const validatedFunc = this.parse(func);
          return validatedFunc;
        }
        strictImplement(func) {
          const validatedFunc = this.parse(func);
          return validatedFunc;
        }
        static create(args, returns, params) {
          return new _ZodFunction({
            args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
            returns: returns || ZodUnknown.create(),
            typeName: ZodFirstPartyTypeKind.ZodFunction,
            ...processCreateParams(params)
          });
        }
      };
      ZodLazy = class extends ZodType {
        get schema() {
          return this._def.getter();
        }
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          const lazySchema = this._def.getter();
          return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
        }
      };
      ZodLazy.create = (getter, params) => {
        return new ZodLazy({
          getter,
          typeName: ZodFirstPartyTypeKind.ZodLazy,
          ...processCreateParams(params)
        });
      };
      ZodLiteral = class extends ZodType {
        _parse(input) {
          if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
              received: ctx.data,
              code: ZodIssueCode.invalid_literal,
              expected: this._def.value
            });
            return INVALID;
          }
          return { status: "valid", value: input.data };
        }
        get value() {
          return this._def.value;
        }
      };
      ZodLiteral.create = (value, params) => {
        return new ZodLiteral({
          value,
          typeName: ZodFirstPartyTypeKind.ZodLiteral,
          ...processCreateParams(params)
        });
      };
      ZodEnum = class _ZodEnum extends ZodType {
        _parse(input) {
          if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
              expected: util.joinValues(expectedValues),
              received: ctx.parsedType,
              code: ZodIssueCode.invalid_type
            });
            return INVALID;
          }
          if (this._def.values.indexOf(input.data) === -1) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
              received: ctx.data,
              code: ZodIssueCode.invalid_enum_value,
              options: expectedValues
            });
            return INVALID;
          }
          return OK(input.data);
        }
        get options() {
          return this._def.values;
        }
        get enum() {
          const enumValues = {};
          for (const val of this._def.values) {
            enumValues[val] = val;
          }
          return enumValues;
        }
        get Values() {
          const enumValues = {};
          for (const val of this._def.values) {
            enumValues[val] = val;
          }
          return enumValues;
        }
        get Enum() {
          const enumValues = {};
          for (const val of this._def.values) {
            enumValues[val] = val;
          }
          return enumValues;
        }
        extract(values) {
          return _ZodEnum.create(values);
        }
        exclude(values) {
          return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)));
        }
      };
      ZodEnum.create = createZodEnum;
      ZodNativeEnum = class extends ZodType {
        _parse(input) {
          const nativeEnumValues = util.getValidEnumValues(this._def.values);
          const ctx = this._getOrReturnCtx(input);
          if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
              expected: util.joinValues(expectedValues),
              received: ctx.parsedType,
              code: ZodIssueCode.invalid_type
            });
            return INVALID;
          }
          if (nativeEnumValues.indexOf(input.data) === -1) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
              received: ctx.data,
              code: ZodIssueCode.invalid_enum_value,
              options: expectedValues
            });
            return INVALID;
          }
          return OK(input.data);
        }
        get enum() {
          return this._def.values;
        }
      };
      ZodNativeEnum.create = (values, params) => {
        return new ZodNativeEnum({
          values,
          typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
          ...processCreateParams(params)
        });
      };
      ZodPromise = class extends ZodType {
        unwrap() {
          return this._def.type;
        }
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.promise,
              received: ctx.parsedType
            });
            return INVALID;
          }
          const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
          return OK(promisified.then((data) => {
            return this._def.type.parseAsync(data, {
              path: ctx.path,
              errorMap: ctx.common.contextualErrorMap
            });
          }));
        }
      };
      ZodPromise.create = (schema, params) => {
        return new ZodPromise({
          type: schema,
          typeName: ZodFirstPartyTypeKind.ZodPromise,
          ...processCreateParams(params)
        });
      };
      ZodEffects = class extends ZodType {
        innerType() {
          return this._def.schema;
        }
        sourceType() {
          return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
        }
        _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          const effect = this._def.effect || null;
          const checkCtx = {
            addIssue: (arg) => {
              addIssueToContext(ctx, arg);
              if (arg.fatal) {
                status.abort();
              } else {
                status.dirty();
              }
            },
            get path() {
              return ctx.path;
            }
          };
          checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
          if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data, checkCtx);
            if (ctx.common.issues.length) {
              return {
                status: "dirty",
                value: ctx.data
              };
            }
            if (ctx.common.async) {
              return Promise.resolve(processed).then((processed2) => {
                return this._def.schema._parseAsync({
                  data: processed2,
                  path: ctx.path,
                  parent: ctx
                });
              });
            } else {
              return this._def.schema._parseSync({
                data: processed,
                path: ctx.path,
                parent: ctx
              });
            }
          }
          if (effect.type === "refinement") {
            const executeRefinement = (acc) => {
              const result = effect.refinement(acc, checkCtx);
              if (ctx.common.async) {
                return Promise.resolve(result);
              }
              if (result instanceof Promise) {
                throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
              }
              return acc;
            };
            if (ctx.common.async === false) {
              const inner = this._def.schema._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              });
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              executeRefinement(inner.value);
              return { status: status.value, value: inner.value };
            } else {
              return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
                if (inner.status === "aborted")
                  return INVALID;
                if (inner.status === "dirty")
                  status.dirty();
                return executeRefinement(inner.value).then(() => {
                  return { status: status.value, value: inner.value };
                });
              });
            }
          }
          if (effect.type === "transform") {
            if (ctx.common.async === false) {
              const base = this._def.schema._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              });
              if (!isValid(base))
                return base;
              const result = effect.transform(base.value, checkCtx);
              if (result instanceof Promise) {
                throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
              }
              return { status: status.value, value: result };
            } else {
              return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
                if (!isValid(base))
                  return base;
                return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
              });
            }
          }
          util.assertNever(effect);
        }
      };
      ZodEffects.create = (schema, effect, params) => {
        return new ZodEffects({
          schema,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect,
          ...processCreateParams(params)
        });
      };
      ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
        return new ZodEffects({
          schema,
          effect: { type: "preprocess", transform: preprocess },
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          ...processCreateParams(params)
        });
      };
      ZodOptional = class extends ZodType {
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType === ZodParsedType.undefined) {
            return OK(void 0);
          }
          return this._def.innerType._parse(input);
        }
        unwrap() {
          return this._def.innerType;
        }
      };
      ZodOptional.create = (type, params) => {
        return new ZodOptional({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodOptional,
          ...processCreateParams(params)
        });
      };
      ZodNullable = class extends ZodType {
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType === ZodParsedType.null) {
            return OK(null);
          }
          return this._def.innerType._parse(input);
        }
        unwrap() {
          return this._def.innerType;
        }
      };
      ZodNullable.create = (type, params) => {
        return new ZodNullable({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodNullable,
          ...processCreateParams(params)
        });
      };
      ZodDefault = class extends ZodType {
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          let data = ctx.data;
          if (ctx.parsedType === ZodParsedType.undefined) {
            data = this._def.defaultValue();
          }
          return this._def.innerType._parse({
            data,
            path: ctx.path,
            parent: ctx
          });
        }
        removeDefault() {
          return this._def.innerType;
        }
      };
      ZodDefault.create = (type, params) => {
        return new ZodDefault({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodDefault,
          defaultValue: typeof params.default === "function" ? params.default : () => params.default,
          ...processCreateParams(params)
        });
      };
      ZodCatch = class extends ZodType {
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          const newCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            }
          };
          const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
              ...newCtx
            }
          });
          if (isAsync(result)) {
            return result.then((result2) => {
              return {
                status: "valid",
                value: result2.status === "valid" ? result2.value : this._def.catchValue({
                  get error() {
                    return new ZodError(newCtx.common.issues);
                  },
                  input: newCtx.data
                })
              };
            });
          } else {
            return {
              status: "valid",
              value: result.status === "valid" ? result.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          }
        }
        removeCatch() {
          return this._def.innerType;
        }
      };
      ZodCatch.create = (type, params) => {
        return new ZodCatch({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodCatch,
          catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
          ...processCreateParams(params)
        });
      };
      ZodNaN = class extends ZodType {
        _parse(input) {
          const parsedType = this._getType(input);
          if (parsedType !== ZodParsedType.nan) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: ZodParsedType.nan,
              received: ctx.parsedType
            });
            return INVALID;
          }
          return { status: "valid", value: input.data };
        }
      };
      ZodNaN.create = (params) => {
        return new ZodNaN({
          typeName: ZodFirstPartyTypeKind.ZodNaN,
          ...processCreateParams(params)
        });
      };
      BRAND = Symbol("zod_brand");
      ZodBranded = class extends ZodType {
        _parse(input) {
          const { ctx } = this._processInputParams(input);
          const data = ctx.data;
          return this._def.type._parse({
            data,
            path: ctx.path,
            parent: ctx
          });
        }
        unwrap() {
          return this._def.type;
        }
      };
      ZodPipeline = class _ZodPipeline extends ZodType {
        _parse(input) {
          const { status, ctx } = this._processInputParams(input);
          if (ctx.common.async) {
            const handleAsync = async () => {
              const inResult = await this._def.in._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx
              });
              if (inResult.status === "aborted")
                return INVALID;
              if (inResult.status === "dirty") {
                status.dirty();
                return DIRTY(inResult.value);
              } else {
                return this._def.out._parseAsync({
                  data: inResult.value,
                  path: ctx.path,
                  parent: ctx
                });
              }
            };
            return handleAsync();
          } else {
            const inResult = this._def.in._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return {
                status: "dirty",
                value: inResult.value
              };
            } else {
              return this._def.out._parseSync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          }
        }
        static create(a3, b3) {
          return new _ZodPipeline({
            in: a3,
            out: b3,
            typeName: ZodFirstPartyTypeKind.ZodPipeline
          });
        }
      };
      ZodReadonly = class extends ZodType {
        _parse(input) {
          const result = this._def.innerType._parse(input);
          if (isValid(result)) {
            result.value = Object.freeze(result.value);
          }
          return result;
        }
      };
      ZodReadonly.create = (type, params) => {
        return new ZodReadonly({
          innerType: type,
          typeName: ZodFirstPartyTypeKind.ZodReadonly,
          ...processCreateParams(params)
        });
      };
      custom = (check, params = {}, fatal) => {
        if (check)
          return ZodAny.create().superRefine((data, ctx) => {
            var _a2, _b;
            if (!check(data)) {
              const p3 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
              const _fatal = (_b = (_a2 = p3.fatal) !== null && _a2 !== void 0 ? _a2 : fatal) !== null && _b !== void 0 ? _b : true;
              const p22 = typeof p3 === "string" ? { message: p3 } : p3;
              ctx.addIssue({ code: "custom", ...p22, fatal: _fatal });
            }
          });
        return ZodAny.create();
      };
      late = {
        object: ZodObject.lazycreate
      };
      (function(ZodFirstPartyTypeKind2) {
        ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
        ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
        ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
        ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
        ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
        ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
        ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
        ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
        ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
        ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
        ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
        ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
        ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
        ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
        ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
        ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
        ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
        ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
        ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
        ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
        ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
        ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
        ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
        ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
        ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
        ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
        ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
        ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
        ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
        ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
        ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
        ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
        ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
        ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
        ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
        ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
      })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
      instanceOfType = (cls, params = {
        message: `Input not instance of ${cls.name}`
      }) => custom((data) => data instanceof cls, params);
      stringType = ZodString.create;
      numberType = ZodNumber.create;
      nanType = ZodNaN.create;
      bigIntType = ZodBigInt.create;
      booleanType = ZodBoolean.create;
      dateType = ZodDate.create;
      symbolType = ZodSymbol.create;
      undefinedType = ZodUndefined.create;
      nullType = ZodNull.create;
      anyType = ZodAny.create;
      unknownType = ZodUnknown.create;
      neverType = ZodNever.create;
      voidType = ZodVoid.create;
      arrayType = ZodArray.create;
      objectType = ZodObject.create;
      strictObjectType = ZodObject.strictCreate;
      unionType = ZodUnion.create;
      discriminatedUnionType = ZodDiscriminatedUnion.create;
      intersectionType = ZodIntersection.create;
      tupleType = ZodTuple.create;
      recordType = ZodRecord.create;
      mapType = ZodMap.create;
      setType = ZodSet.create;
      functionType = ZodFunction.create;
      lazyType = ZodLazy.create;
      literalType = ZodLiteral.create;
      enumType = ZodEnum.create;
      nativeEnumType = ZodNativeEnum.create;
      promiseType = ZodPromise.create;
      effectsType = ZodEffects.create;
      optionalType = ZodOptional.create;
      nullableType = ZodNullable.create;
      preprocessType = ZodEffects.createWithPreprocess;
      pipelineType = ZodPipeline.create;
      ostring = () => stringType().optional();
      onumber = () => numberType().optional();
      oboolean = () => booleanType().optional();
      coerce = {
        string: (arg) => ZodString.create({ ...arg, coerce: true }),
        number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
        boolean: (arg) => ZodBoolean.create({
          ...arg,
          coerce: true
        }),
        bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
        date: (arg) => ZodDate.create({ ...arg, coerce: true })
      };
      NEVER = INVALID;
      z3 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        defaultErrorMap: errorMap,
        setErrorMap,
        getErrorMap,
        makeIssue,
        EMPTY_PATH,
        addIssueToContext,
        ParseStatus,
        INVALID,
        DIRTY,
        OK,
        isAborted,
        isDirty,
        isValid,
        isAsync,
        get util() {
          return util;
        },
        get objectUtil() {
          return objectUtil;
        },
        ZodParsedType,
        getParsedType,
        ZodType,
        ZodString,
        ZodNumber,
        ZodBigInt,
        ZodBoolean,
        ZodDate,
        ZodSymbol,
        ZodUndefined,
        ZodNull,
        ZodAny,
        ZodUnknown,
        ZodNever,
        ZodVoid,
        ZodArray,
        ZodObject,
        ZodUnion,
        ZodDiscriminatedUnion,
        ZodIntersection,
        ZodTuple,
        ZodRecord,
        ZodMap,
        ZodSet,
        ZodFunction,
        ZodLazy,
        ZodLiteral,
        ZodEnum,
        ZodNativeEnum,
        ZodPromise,
        ZodEffects,
        ZodTransformer: ZodEffects,
        ZodOptional,
        ZodNullable,
        ZodDefault,
        ZodCatch,
        ZodNaN,
        BRAND,
        ZodBranded,
        ZodPipeline,
        ZodReadonly,
        custom,
        Schema: ZodType,
        ZodSchema: ZodType,
        late,
        get ZodFirstPartyTypeKind() {
          return ZodFirstPartyTypeKind;
        },
        coerce,
        any: anyType,
        array: arrayType,
        bigint: bigIntType,
        boolean: booleanType,
        date: dateType,
        discriminatedUnion: discriminatedUnionType,
        effect: effectsType,
        "enum": enumType,
        "function": functionType,
        "instanceof": instanceOfType,
        intersection: intersectionType,
        lazy: lazyType,
        literal: literalType,
        map: mapType,
        nan: nanType,
        nativeEnum: nativeEnumType,
        never: neverType,
        "null": nullType,
        nullable: nullableType,
        number: numberType,
        object: objectType,
        oboolean,
        onumber,
        optional: optionalType,
        ostring,
        pipeline: pipelineType,
        preprocess: preprocessType,
        promise: promiseType,
        record: recordType,
        set: setType,
        strictObject: strictObjectType,
        string: stringType,
        symbol: symbolType,
        transformer: effectsType,
        tuple: tupleType,
        "undefined": undefinedType,
        union: unionType,
        unknown: unknownType,
        "void": voidType,
        NEVER,
        ZodIssueCode,
        quotelessJson,
        ZodError
      });
    }
  });

  // schema/__generated__/schema.parsers.mjs
  var protectionsDisabledReasonSchema, ownedByFirstPartyReasonSchema, ruleExceptionReasonSchema, adClickAttributionReasonSchema, otherThirdPartyRequestReasonSchema, screenKindSchema, wvVersionTitleSchema, requestsTitleSchema, featuresTitleSchema, appVersionTitleSchema, atbTitleSchema, errorDescriptionsTitleSchema, extensionVersionTitleSchema, httpErrorCodesTitleSchema, lastSentDayTitleSchema, deviceTitleSchema, osTitleSchema, listVersionsTitleSchema, reportFlowTitleSchema, siteUrlTitleSchema, didOpenReportInfoTitleSchema, toggleReportCounterTitleSchema, openerContextTitleSchema, userRefreshCountTitleSchema, jsPerformanceTitleSchema, stateBlockedSchema, stateAllowedSchema, extensionMessageGetPrivacyDashboardDataSchema, emailProtectionUserDataSchema, protectionsStatusSchema, localeSettingsSchema, parentEntitySchema, fireButtonSchema, searchSchema, breakageReportRequestSchema, setListOptionsSchema, windowsIncomingVisibilitySchema, cookiePromptManagementStatusSchema, refreshAliasResponseSchema, extensionMessageSetListOptionsSchema, fireOptionSchema, primaryScreenSchema, eventOriginSchema, siteUrlAdditionalDataSchema, closeMessageParamsSchema, categoryTypeSelectedSchema, categorySelectedSchema, toggleSkippedSchema, dataItemIdSchema, detectedRequestSchema, tabSchema, breakageReportSchema, fireButtonDataSchema, remoteFeatureSettingsSchema, setProtectionParamsSchema, toggleReportScreenDataItemSchema, telemetrySpanSchema, requestDataSchema, getPrivacyDashboardDataSchema, windowsViewModelSchema, toggleReportScreenSchema, windowsIncomingViewModelSchema, windowsIncomingMessageSchema, apiSchema;
  var init_schema_parsers = __esm({
    "schema/__generated__/schema.parsers.mjs"() {
      "use strict";
      init_lib();
      protectionsDisabledReasonSchema = z3.literal("protectionDisabled");
      ownedByFirstPartyReasonSchema = z3.literal("ownedByFirstParty");
      ruleExceptionReasonSchema = z3.literal("ruleException");
      adClickAttributionReasonSchema = z3.literal("adClickAttribution");
      otherThirdPartyRequestReasonSchema = z3.literal("otherThirdPartyRequest");
      screenKindSchema = z3.union([z3.literal("primaryScreen"), z3.literal("breakageForm"), z3.literal("promptBreakageForm"), z3.literal("toggleReport"), z3.literal("categoryTypeSelection"), z3.literal("categorySelection"), z3.literal("choiceToggle"), z3.literal("choiceBreakageForm"), z3.literal("connection"), z3.literal("trackers"), z3.literal("nonTrackers"), z3.literal("consentManaged"), z3.literal("cookieHidden")]);
      wvVersionTitleSchema = z3.literal("wvVersion");
      requestsTitleSchema = z3.literal("requests");
      featuresTitleSchema = z3.literal("features");
      appVersionTitleSchema = z3.literal("appVersion");
      atbTitleSchema = z3.literal("atb");
      errorDescriptionsTitleSchema = z3.literal("errorDescriptions");
      extensionVersionTitleSchema = z3.literal("extensionVersion");
      httpErrorCodesTitleSchema = z3.literal("httpErrorCodes");
      lastSentDayTitleSchema = z3.literal("lastSentDay");
      deviceTitleSchema = z3.literal("device");
      osTitleSchema = z3.literal("os");
      listVersionsTitleSchema = z3.literal("listVersions");
      reportFlowTitleSchema = z3.literal("reportFlow");
      siteUrlTitleSchema = z3.literal("siteUrl");
      didOpenReportInfoTitleSchema = z3.literal("didOpenReportInfo");
      toggleReportCounterTitleSchema = z3.literal("toggleReportCounter");
      openerContextTitleSchema = z3.literal("openerContext");
      userRefreshCountTitleSchema = z3.literal("userRefreshCount");
      jsPerformanceTitleSchema = z3.literal("jsPerformance");
      stateBlockedSchema = z3.object({
        blocked: z3.object({})
      });
      stateAllowedSchema = z3.object({
        allowed: z3.object({
          reason: z3.union([protectionsDisabledReasonSchema, ownedByFirstPartyReasonSchema, ruleExceptionReasonSchema, adClickAttributionReasonSchema, otherThirdPartyRequestReasonSchema])
        })
      });
      extensionMessageGetPrivacyDashboardDataSchema = z3.object({
        messageType: z3.literal("getPrivacyDashboardData"),
        options: z3.object({
          tabId: z3.number().optional().nullable()
        })
      });
      emailProtectionUserDataSchema = z3.object({
        nextAlias: z3.string()
      });
      protectionsStatusSchema = z3.object({
        unprotectedTemporary: z3.boolean(),
        enabledFeatures: z3.array(z3.string()),
        allowlisted: z3.boolean(),
        denylisted: z3.boolean()
      });
      localeSettingsSchema = z3.object({
        locale: z3.string()
      });
      parentEntitySchema = z3.object({
        displayName: z3.string(),
        prevalence: z3.number()
      });
      fireButtonSchema = z3.object({
        enabled: z3.boolean()
      });
      searchSchema = z3.object({
        term: z3.string()
      });
      breakageReportRequestSchema = z3.object({
        category: z3.string().optional(),
        description: z3.string().optional()
      });
      setListOptionsSchema = z3.object({
        lists: z3.array(z3.object({
          list: z3.union([z3.literal("allowlisted"), z3.literal("denylisted")]),
          domain: z3.string(),
          value: z3.boolean()
        }))
      });
      windowsIncomingVisibilitySchema = z3.object({
        Feature: z3.literal("PrivacyDashboard"),
        Name: z3.literal("VisibilityChanged"),
        Data: z3.object({
          isVisible: z3.boolean()
        })
      });
      cookiePromptManagementStatusSchema = z3.object({
        consentManaged: z3.boolean(),
        cosmetic: z3.boolean().optional(),
        optoutFailed: z3.boolean().optional(),
        selftestFailed: z3.boolean().optional(),
        configurable: z3.boolean().optional()
      });
      refreshAliasResponseSchema = z3.object({
        personalAddress: z3.string(),
        privateAddress: z3.string()
      });
      extensionMessageSetListOptionsSchema = z3.object({
        messageType: z3.literal("setLists"),
        options: setListOptionsSchema
      });
      fireOptionSchema = z3.object({
        name: z3.union([z3.literal("CurrentSite"), z3.literal("LastHour"), z3.literal("Last24Hour"), z3.literal("Last7days"), z3.literal("Last4Weeks"), z3.literal("AllTime")]),
        selected: z3.boolean().optional(),
        options: z3.object({
          since: z3.number().optional(),
          origins: z3.array(z3.string()).optional()
        }),
        descriptionStats: z3.object({
          clearHistory: z3.boolean(),
          site: z3.string().optional(),
          duration: z3.union([z3.literal("hour"), z3.literal("day"), z3.literal("week"), z3.literal("month"), z3.literal("all")]),
          openTabs: z3.number(),
          cookies: z3.number(),
          pinnedTabs: z3.number()
        })
      });
      primaryScreenSchema = z3.object({
        layout: z3.union([z3.literal("default"), z3.literal("highlighted-protections-toggle")])
      });
      eventOriginSchema = z3.object({
        screen: screenKindSchema
      });
      siteUrlAdditionalDataSchema = z3.object({
        url: z3.string()
      });
      closeMessageParamsSchema = z3.object({
        eventOrigin: eventOriginSchema
      });
      categoryTypeSelectedSchema = z3.object({
        name: z3.literal("categoryTypeSelected"),
        value: z3.union([z3.literal("notWorking"), z3.literal("dislike"), z3.literal("general")])
      });
      categorySelectedSchema = z3.object({
        name: z3.literal("categorySelected"),
        value: z3.union([z3.literal("blocked"), z3.literal("layout"), z3.literal("empty-spaces"), z3.literal("paywall"), z3.literal("videos"), z3.literal("comments"), z3.literal("login"), z3.literal("shopping"), z3.literal("other")])
      });
      toggleSkippedSchema = z3.object({
        name: z3.literal("toggleSkipped")
      });
      dataItemIdSchema = z3.union([wvVersionTitleSchema, requestsTitleSchema, featuresTitleSchema, appVersionTitleSchema, atbTitleSchema, errorDescriptionsTitleSchema, extensionVersionTitleSchema, httpErrorCodesTitleSchema, lastSentDayTitleSchema, deviceTitleSchema, osTitleSchema, listVersionsTitleSchema, reportFlowTitleSchema, siteUrlTitleSchema, didOpenReportInfoTitleSchema, toggleReportCounterTitleSchema, openerContextTitleSchema, userRefreshCountTitleSchema, jsPerformanceTitleSchema]);
      detectedRequestSchema = z3.object({
        url: z3.string(),
        eTLDplus1: z3.string().optional(),
        pageUrl: z3.string(),
        state: z3.union([stateBlockedSchema, stateAllowedSchema]),
        entityName: z3.string().optional(),
        category: z3.string().optional(),
        prevalence: z3.number().optional(),
        ownerName: z3.string().optional()
      });
      tabSchema = z3.object({
        id: z3.number().optional(),
        url: z3.string(),
        upgradedHttps: z3.boolean(),
        protections: protectionsStatusSchema,
        localeSettings: localeSettingsSchema.optional(),
        parentEntity: parentEntitySchema.optional(),
        specialDomainName: z3.string().optional()
      });
      breakageReportSchema = z3.object({
        request: breakageReportRequestSchema.optional(),
        response: z3.object({}).optional()
      });
      fireButtonDataSchema = z3.object({
        options: z3.array(fireOptionSchema)
      });
      remoteFeatureSettingsSchema = z3.object({
        primaryScreen: primaryScreenSchema.optional()
      });
      setProtectionParamsSchema = z3.object({
        isProtected: z3.boolean(),
        eventOrigin: eventOriginSchema
      });
      toggleReportScreenDataItemSchema = z3.object({
        id: dataItemIdSchema,
        additional: siteUrlAdditionalDataSchema.optional()
      });
      telemetrySpanSchema = z3.object({
        attributes: z3.union([categoryTypeSelectedSchema, categorySelectedSchema, toggleSkippedSchema]),
        eventOrigin: eventOriginSchema
      });
      requestDataSchema = z3.object({
        requests: z3.array(detectedRequestSchema),
        installedSurrogates: z3.array(z3.string()).optional()
      });
      getPrivacyDashboardDataSchema = z3.object({
        requestData: requestDataSchema,
        emailProtectionUserData: emailProtectionUserDataSchema.optional(),
        tab: tabSchema,
        fireButton: fireButtonSchema.optional()
      });
      windowsViewModelSchema = z3.object({
        protections: protectionsStatusSchema,
        rawRequestData: requestDataSchema,
        tabUrl: z3.string(),
        upgradedHttps: z3.boolean(),
        parentEntity: parentEntitySchema.optional(),
        permissions: z3.array(z3.unknown()).optional(),
        certificates: z3.array(z3.unknown()).optional(),
        cookiePromptManagementStatus: cookiePromptManagementStatusSchema.optional()
      });
      toggleReportScreenSchema = z3.object({
        data: z3.array(toggleReportScreenDataItemSchema)
      });
      windowsIncomingViewModelSchema = z3.object({
        Feature: z3.literal("PrivacyDashboard"),
        Name: z3.literal("ViewModelUpdated"),
        Data: windowsViewModelSchema
      });
      windowsIncomingMessageSchema = z3.union([windowsIncomingVisibilitySchema, windowsIncomingViewModelSchema]);
      apiSchema = z3.object({
        "request-data": requestDataSchema,
        "extension-message-get-privacy-dashboard-data": extensionMessageGetPrivacyDashboardDataSchema,
        "get-privacy-dashboard-data": getPrivacyDashboardDataSchema.optional(),
        "search-message": searchSchema.optional(),
        "breakage-report": breakageReportSchema,
        "set-list": setListOptionsSchema.optional(),
        "windows-incoming-message": windowsIncomingMessageSchema.optional(),
        "locale-settings": localeSettingsSchema.optional(),
        "refresh-alias-response": refreshAliasResponseSchema.optional(),
        exe: extensionMessageSetListOptionsSchema.optional(),
        "fire-button": fireButtonDataSchema.optional(),
        "feature-settings": remoteFeatureSettingsSchema.optional(),
        "set-protection": setProtectionParamsSchema.optional(),
        "toggle-report-screen": toggleReportScreenSchema.optional(),
        "close-message": closeMessageParamsSchema.optional(),
        "telemetry-span": telemetrySpanSchema.optional()
      });
    }
  });

  // shared/js/browser/utils/protections.mjs
  var Protections;
  var init_protections = __esm({
    "shared/js/browser/utils/protections.mjs"() {
      "use strict";
      Protections = class _Protections {
        /**
         * @param {boolean} unprotectedTemporary
         * @param {string[]} enabledFeatures
         * @param {boolean} allowlisted
         * @param {boolean} denylisted
         */
        constructor(unprotectedTemporary, enabledFeatures, allowlisted = false, denylisted = false) {
          this.unprotectedTemporary = unprotectedTemporary;
          this.enabledFeatures = enabledFeatures;
          this.allowlisted = allowlisted;
          this.denylisted = denylisted;
        }
        static default() {
          return new _Protections(false, ["contentBlocking"], false, false);
        }
      };
    }
  });

  // node_modules/nanohtml/lib/raw-browser.js
  var require_raw_browser = __commonJS({
    "node_modules/nanohtml/lib/raw-browser.js"(exports, module) {
      "use strict";
      function nanohtmlRawBrowser(tag) {
        var el = document.createElement("div");
        el.innerHTML = tag;
        return toArray(el.childNodes);
      }
      function toArray(arr2) {
        return Array.isArray(arr2) ? arr2 : [].slice.call(arr2);
      }
      module.exports = nanohtmlRawBrowser;
    }
  });

  // node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var t;
  var i;
  var o;
  var r;
  var f;
  var e;
  var c = {};
  var s = [];
  var a = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var v = Array.isArray;
  function h(n2, l3) {
    for (var u3 in l3)
      n2[u3] = l3[u3];
    return n2;
  }
  function p(n2) {
    var l3 = n2.parentNode;
    l3 && l3.removeChild(n2);
  }
  function y(l3, u3, t4) {
    var i3, o3, r3, f3 = {};
    for (r3 in u3)
      "key" == r3 ? i3 = u3[r3] : "ref" == r3 ? o3 = u3[r3] : f3[r3] = u3[r3];
    if (arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : t4), "function" == typeof l3 && null != l3.defaultProps)
      for (r3 in l3.defaultProps)
        void 0 === f3[r3] && (f3[r3] = l3.defaultProps[r3]);
    return d(l3, f3, i3, o3, null);
  }
  function d(n2, t4, i3, o3, r3) {
    var f3 = { type: n2, props: t4, key: i3, ref: o3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == r3 ? ++u : r3 };
    return null == r3 && null != l.vnode && l.vnode(f3), f3;
  }
  function k(n2) {
    return n2.children;
  }
  function b(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function g(n2, l3) {
    if (null == l3)
      return n2.__ ? g(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u3; l3 < n2.__k.length; l3++)
      if (null != (u3 = n2.__k[l3]) && null != u3.__e)
        return u3.__d || u3.__e;
    return "function" == typeof n2.type ? g(n2) : null;
  }
  function m(n2) {
    var l3, u3;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
        if (null != (u3 = n2.__k[l3]) && null != u3.__e) {
          n2.__e = n2.__c.base = u3.__e;
          break;
        }
      return m(n2);
    }
  }
  function w(n2) {
    (!n2.__d && (n2.__d = true) && i.push(n2) && !x.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(x);
  }
  function x() {
    var n2, l3, u3, t4, o3, r3, e3, c3, s3;
    for (i.sort(f); n2 = i.shift(); )
      n2.__d && (l3 = i.length, t4 = void 0, o3 = void 0, r3 = void 0, c3 = (e3 = (u3 = n2).__v).__e, (s3 = u3.__P) && (t4 = [], o3 = [], (r3 = h({}, e3)).__v = e3.__v + 1, z(s3, e3, r3, u3.__n, void 0 !== s3.ownerSVGElement, null != e3.__h ? [c3] : null, t4, null == c3 ? g(e3) : c3, e3.__h, o3), L(t4, e3, o3), e3.__e != c3 && m(e3)), i.length > l3 && i.sort(f));
    x.__r = 0;
  }
  function P(n2, l3, u3, t4, i3, o3, r3, f3, e3, a3, h3) {
    var p3, y3, _24, b3, m3, w3, x2, P2, C, D2 = 0, H2 = t4 && t4.__k || s, I2 = H2.length, T3 = I2, j3 = l3.length;
    for (u3.__k = [], p3 = 0; p3 < j3; p3++)
      null != (b3 = u3.__k[p3] = null == (b3 = l3[p3]) || "boolean" == typeof b3 || "function" == typeof b3 ? null : "string" == typeof b3 || "number" == typeof b3 || "bigint" == typeof b3 ? d(null, b3, null, null, b3) : v(b3) ? d(k, { children: b3 }, null, null, null) : b3.__b > 0 ? d(b3.type, b3.props, b3.key, b3.ref ? b3.ref : null, b3.__v) : b3) ? (b3.__ = u3, b3.__b = u3.__b + 1, -1 === (P2 = A(b3, H2, x2 = p3 + D2, T3)) ? _24 = c : (_24 = H2[P2] || c, H2[P2] = void 0, T3--), z(n2, b3, _24, i3, o3, r3, f3, e3, a3, h3), m3 = b3.__e, (y3 = b3.ref) && _24.ref != y3 && (_24.ref && N(_24.ref, null, b3), h3.push(y3, b3.__c || m3, b3)), null != m3 && (null == w3 && (w3 = m3), (C = _24 === c || null === _24.__v) ? -1 == P2 && D2-- : P2 !== x2 && (P2 === x2 + 1 ? D2++ : P2 > x2 ? T3 > j3 - x2 ? D2 += P2 - x2 : D2-- : D2 = P2 < x2 && P2 == x2 - 1 ? P2 - x2 : 0), x2 = p3 + D2, "function" != typeof b3.type || P2 === x2 && _24.__k !== b3.__k ? "function" == typeof b3.type || P2 === x2 && !C ? void 0 !== b3.__d ? (e3 = b3.__d, b3.__d = void 0) : e3 = m3.nextSibling : e3 = S(n2, m3, e3) : e3 = $(b3, e3, n2), "function" == typeof u3.type && (u3.__d = e3))) : (_24 = H2[p3]) && null == _24.key && _24.__e && (_24.__e == e3 && (_24.__ = t4, e3 = g(_24)), O(_24, _24, false), H2[p3] = null);
    for (u3.__e = w3, p3 = I2; p3--; )
      null != H2[p3] && ("function" == typeof u3.type && null != H2[p3].__e && H2[p3].__e == u3.__d && (u3.__d = H2[p3].__e.nextSibling), O(H2[p3], H2[p3]));
  }
  function $(n2, l3, u3) {
    for (var t4, i3 = n2.__k, o3 = 0; i3 && o3 < i3.length; o3++)
      (t4 = i3[o3]) && (t4.__ = n2, l3 = "function" == typeof t4.type ? $(t4, l3, u3) : S(u3, t4.__e, l3));
    return l3;
  }
  function S(n2, l3, u3) {
    return null == u3 || u3.parentNode !== n2 ? n2.insertBefore(l3, null) : l3 == u3 && null != l3.parentNode || n2.insertBefore(l3, u3), l3.nextSibling;
  }
  function A(n2, l3, u3, t4) {
    var i3 = n2.key, o3 = n2.type, r3 = u3 - 1, f3 = u3 + 1, e3 = l3[u3];
    if (null === e3 || e3 && i3 == e3.key && o3 === e3.type)
      return u3;
    if (t4 > (null != e3 ? 1 : 0))
      for (; r3 >= 0 || f3 < l3.length; ) {
        if (r3 >= 0) {
          if ((e3 = l3[r3]) && i3 == e3.key && o3 === e3.type)
            return r3;
          r3--;
        }
        if (f3 < l3.length) {
          if ((e3 = l3[f3]) && i3 == e3.key && o3 === e3.type)
            return f3;
          f3++;
        }
      }
    return -1;
  }
  function D(n2, l3, u3, t4, i3) {
    var o3;
    for (o3 in u3)
      "children" === o3 || "key" === o3 || o3 in l3 || I(n2, o3, null, u3[o3], t4);
    for (o3 in l3)
      i3 && "function" != typeof l3[o3] || "children" === o3 || "key" === o3 || "value" === o3 || "checked" === o3 || u3[o3] === l3[o3] || I(n2, o3, l3[o3], u3[o3], t4);
  }
  function H(n2, l3, u3) {
    "-" === l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || a.test(l3) ? u3 : u3 + "px";
  }
  function I(n2, l3, u3, t4, i3) {
    var o3;
    n:
      if ("style" === l3)
        if ("string" == typeof u3)
          n2.style.cssText = u3;
        else {
          if ("string" == typeof t4 && (n2.style.cssText = t4 = ""), t4)
            for (l3 in t4)
              u3 && l3 in u3 || H(n2.style, l3, "");
          if (u3)
            for (l3 in u3)
              t4 && u3[l3] === t4[l3] || H(n2.style, l3, u3[l3]);
        }
      else if ("o" === l3[0] && "n" === l3[1])
        o3 = l3 !== (l3 = l3.replace(/(PointerCapture)$|Capture$/, "$1")), l3 = l3.toLowerCase() in n2 ? l3.toLowerCase().slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + o3] = u3, u3 ? t4 ? u3.u = t4.u : (u3.u = Date.now(), n2.addEventListener(l3, o3 ? j : T, o3)) : n2.removeEventListener(l3, o3 ? j : T, o3);
      else if ("dangerouslySetInnerHTML" !== l3) {
        if (i3)
          l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" !== l3 && "height" !== l3 && "href" !== l3 && "list" !== l3 && "form" !== l3 && "tabIndex" !== l3 && "download" !== l3 && "rowSpan" !== l3 && "colSpan" !== l3 && "role" !== l3 && l3 in n2)
          try {
            n2[l3] = null == u3 ? "" : u3;
            break n;
          } catch (n3) {
          }
        "function" == typeof u3 || (null == u3 || false === u3 && "-" !== l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, u3));
      }
  }
  function T(n2) {
    var u3 = this.l[n2.type + false];
    if (n2.t) {
      if (n2.t <= u3.u)
        return;
    } else
      n2.t = Date.now();
    return u3(l.event ? l.event(n2) : n2);
  }
  function j(n2) {
    return this.l[n2.type + true](l.event ? l.event(n2) : n2);
  }
  function z(n2, u3, t4, i3, o3, r3, f3, e3, c3, s3) {
    var a3, p3, y3, d3, _24, g3, m3, w3, x2, $2, C, S2, A2, D2, H2, I2 = u3.type;
    if (void 0 !== u3.constructor)
      return null;
    null != t4.__h && (c3 = t4.__h, e3 = u3.__e = t4.__e, u3.__h = null, r3 = [e3]), (a3 = l.__b) && a3(u3);
    n:
      if ("function" == typeof I2)
        try {
          if (w3 = u3.props, x2 = (a3 = I2.contextType) && i3[a3.__c], $2 = a3 ? x2 ? x2.props.value : a3.__ : i3, t4.__c ? m3 = (p3 = u3.__c = t4.__c).__ = p3.__E : ("prototype" in I2 && I2.prototype.render ? u3.__c = p3 = new I2(w3, $2) : (u3.__c = p3 = new b(w3, $2), p3.constructor = I2, p3.render = q), x2 && x2.sub(p3), p3.props = w3, p3.state || (p3.state = {}), p3.context = $2, p3.__n = i3, y3 = p3.__d = true, p3.__h = [], p3._sb = []), null == p3.__s && (p3.__s = p3.state), null != I2.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = h({}, p3.__s)), h(p3.__s, I2.getDerivedStateFromProps(w3, p3.__s))), d3 = p3.props, _24 = p3.state, p3.__v = u3, y3)
            null == I2.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
          else {
            if (null == I2.getDerivedStateFromProps && w3 !== d3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(w3, $2), !p3.__e && (null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(w3, p3.__s, $2) || u3.__v === t4.__v)) {
              for (u3.__v !== t4.__v && (p3.props = w3, p3.state = p3.__s, p3.__d = false), u3.__e = t4.__e, u3.__k = t4.__k, u3.__k.forEach(function(n3) {
                n3 && (n3.__ = u3);
              }), C = 0; C < p3._sb.length; C++)
                p3.__h.push(p3._sb[C]);
              p3._sb = [], p3.__h.length && f3.push(p3);
              break n;
            }
            null != p3.componentWillUpdate && p3.componentWillUpdate(w3, p3.__s, $2), null != p3.componentDidUpdate && p3.__h.push(function() {
              p3.componentDidUpdate(d3, _24, g3);
            });
          }
          if (p3.context = $2, p3.props = w3, p3.__P = n2, p3.__e = false, S2 = l.__r, A2 = 0, "prototype" in I2 && I2.prototype.render) {
            for (p3.state = p3.__s, p3.__d = false, S2 && S2(u3), a3 = p3.render(p3.props, p3.state, p3.context), D2 = 0; D2 < p3._sb.length; D2++)
              p3.__h.push(p3._sb[D2]);
            p3._sb = [];
          } else
            do {
              p3.__d = false, S2 && S2(u3), a3 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
            } while (p3.__d && ++A2 < 25);
          p3.state = p3.__s, null != p3.getChildContext && (i3 = h(h({}, i3), p3.getChildContext())), y3 || null == p3.getSnapshotBeforeUpdate || (g3 = p3.getSnapshotBeforeUpdate(d3, _24)), P(n2, v(H2 = null != a3 && a3.type === k && null == a3.key ? a3.props.children : a3) ? H2 : [H2], u3, t4, i3, o3, r3, f3, e3, c3, s3), p3.base = u3.__e, u3.__h = null, p3.__h.length && f3.push(p3), m3 && (p3.__E = p3.__ = null);
        } catch (n3) {
          u3.__v = null, (c3 || null != r3) && (u3.__e = e3, u3.__h = !!c3, r3[r3.indexOf(e3)] = null), l.__e(n3, u3, t4);
        }
      else
        null == r3 && u3.__v === t4.__v ? (u3.__k = t4.__k, u3.__e = t4.__e) : u3.__e = M(t4.__e, u3, t4, i3, o3, r3, f3, c3, s3);
    (a3 = l.diffed) && a3(u3);
  }
  function L(n2, u3, t4) {
    for (var i3 = 0; i3 < t4.length; i3++)
      N(t4[i3], t4[++i3], t4[++i3]);
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function M(l3, u3, t4, i3, o3, r3, f3, e3, s3) {
    var a3, h3, y3, d3 = t4.props, _24 = u3.props, k3 = u3.type, b3 = 0;
    if ("svg" === k3 && (o3 = true), null != r3) {
      for (; b3 < r3.length; b3++)
        if ((a3 = r3[b3]) && "setAttribute" in a3 == !!k3 && (k3 ? a3.localName === k3 : 3 === a3.nodeType)) {
          l3 = a3, r3[b3] = null;
          break;
        }
    }
    if (null == l3) {
      if (null === k3)
        return document.createTextNode(_24);
      l3 = o3 ? document.createElementNS("http://www.w3.org/2000/svg", k3) : document.createElement(k3, _24.is && _24), r3 = null, e3 = false;
    }
    if (null === k3)
      d3 === _24 || e3 && l3.data === _24 || (l3.data = _24);
    else {
      if (r3 = r3 && n.call(l3.childNodes), h3 = (d3 = t4.props || c).dangerouslySetInnerHTML, y3 = _24.dangerouslySetInnerHTML, !e3) {
        if (null != r3)
          for (d3 = {}, b3 = 0; b3 < l3.attributes.length; b3++)
            d3[l3.attributes[b3].name] = l3.attributes[b3].value;
        (y3 || h3) && (y3 && (h3 && y3.__html == h3.__html || y3.__html === l3.innerHTML) || (l3.innerHTML = y3 && y3.__html || ""));
      }
      if (D(l3, _24, d3, o3, e3), y3)
        u3.__k = [];
      else if (P(l3, v(b3 = u3.props.children) ? b3 : [b3], u3, t4, i3, o3 && "foreignObject" !== k3, r3, f3, r3 ? r3[0] : t4.__k && g(t4, 0), e3, s3), null != r3)
        for (b3 = r3.length; b3--; )
          null != r3[b3] && p(r3[b3]);
      e3 || ("value" in _24 && void 0 !== (b3 = _24.value) && (b3 !== l3.value || "progress" === k3 && !b3 || "option" === k3 && b3 !== d3.value) && I(l3, "value", b3, d3.value, false), "checked" in _24 && void 0 !== (b3 = _24.checked) && b3 !== l3.checked && I(l3, "checked", b3, d3.checked, false));
    }
    return l3;
  }
  function N(n2, u3, t4) {
    try {
      "function" == typeof n2 ? n2(u3) : n2.current = u3;
    } catch (n3) {
      l.__e(n3, t4);
    }
  }
  function O(n2, u3, t4) {
    var i3, o3;
    if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current !== n2.__e || N(i3, null, u3)), null != (i3 = n2.__c)) {
      if (i3.componentWillUnmount)
        try {
          i3.componentWillUnmount();
        } catch (n3) {
          l.__e(n3, u3);
        }
      i3.base = i3.__P = null, n2.__c = void 0;
    }
    if (i3 = n2.__k)
      for (o3 = 0; o3 < i3.length; o3++)
        i3[o3] && O(i3[o3], u3, t4 || "function" != typeof n2.type);
    t4 || null == n2.__e || p(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
  }
  function q(n2, l3, u3) {
    return this.constructor(n2, u3);
  }
  function B(u3, t4, i3) {
    var o3, r3, f3, e3;
    l.__ && l.__(u3, t4), r3 = (o3 = "function" == typeof i3) ? null : i3 && i3.__k || t4.__k, f3 = [], e3 = [], z(t4, u3 = (!o3 && i3 || t4).__k = y(k, null, [u3]), r3 || c, c, void 0 !== t4.ownerSVGElement, !o3 && i3 ? [i3] : r3 ? null : t4.firstChild ? n.call(t4.childNodes) : null, f3, !o3 && i3 ? i3 : r3 ? r3.__e : t4.firstChild, o3, e3), L(f3, u3, e3);
  }
  function G(n2, l3) {
    var u3 = { __c: l3 = "__cC" + e++, __: n2, Consumer: function(n3, l4) {
      return n3.children(l4);
    }, Provider: function(n3) {
      var u4, t4;
      return this.getChildContext || (u4 = [], (t4 = {})[l3] = this, this.getChildContext = function() {
        return t4;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value !== n4.value && u4.some(function(n5) {
          n5.__e = true, w(n5);
        });
      }, this.sub = function(n4) {
        u4.push(n4);
        var l4 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u4.splice(u4.indexOf(n4), 1), l4 && l4.call(n4);
        };
      }), n3.children;
    } };
    return u3.Provider.__ = u3.Consumer.contextType = u3;
  }
  n = s.slice, l = { __e: function(n2, l3, u3, t4) {
    for (var i3, o3, r3; l3 = l3.__; )
      if ((i3 = l3.__c) && !i3.__)
        try {
          if ((o3 = i3.constructor) && null != o3.getDerivedStateFromError && (i3.setState(o3.getDerivedStateFromError(n2)), r3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t4 || {}), r3 = i3.__d), r3)
            return i3.__E = i3;
        } catch (l4) {
          n2 = l4;
        }
    throw n2;
  } }, u = 0, t = function(n2) {
    return null != n2 && void 0 === n2.constructor;
  }, b.prototype.setState = function(n2, l3) {
    var u3;
    u3 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = h({}, this.state), "function" == typeof n2 && (n2 = n2(h({}, u3), this.props)), n2 && h(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), w(this));
  }, b.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), w(this));
  }, b.prototype.render = k, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n2, l3) {
    return n2.__v.__b - l3.__v.__b;
  }, x.__r = 0, e = 0;

  // v2/navigation.jsx
  var import_classnames = __toESM(require_classnames());

  // node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var r2;
  var u2;
  var i2;
  var o2 = 0;
  var f2 = [];
  var c2 = [];
  var e2 = l.__b;
  var a2 = l.__r;
  var v2 = l.diffed;
  var l2 = l.__c;
  var m2 = l.unmount;
  function d2(t4, u3) {
    l.__h && l.__h(r2, t4, o2 || u3), o2 = 0;
    var i3 = r2.__H || (r2.__H = { __: [], __h: [] });
    return t4 >= i3.__.length && i3.__.push({ __V: c2 }), i3.__[t4];
  }
  function h2(n2) {
    return o2 = 1, s2(B2, n2);
  }
  function s2(n2, u3, i3) {
    var o3 = d2(t2++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : B2(void 0, u3), function(n3) {
      var t4 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t4, n3);
      t4 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r2, !r2.u)) {
      var f3 = function(n3, t4, r3) {
        if (!o3.__c.__H)
          return true;
        var u4 = o3.__c.__H.__.filter(function(n4) {
          return n4.__c;
        });
        if (u4.every(function(n4) {
          return !n4.__N;
        }))
          return !c3 || c3.call(this, n3, t4, r3);
        var i4 = false;
        return u4.forEach(function(n4) {
          if (n4.__N) {
            var t5 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t5 !== n4.__[0] && (i4 = true);
          }
        }), !(!i4 && o3.__c.props === n3) && (!c3 || c3.call(this, n3, t4, r3));
      };
      r2.u = true;
      var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
      r2.componentWillUpdate = function(n3, t4, r3) {
        if (this.__e) {
          var u4 = c3;
          c3 = void 0, f3(n3, t4, r3), c3 = u4;
        }
        e3 && e3.call(this, n3, t4, r3);
      }, r2.shouldComponentUpdate = f3;
    }
    return o3.__N || o3.__;
  }
  function p2(u3, i3) {
    var o3 = d2(t2++, 3);
    !l.__s && z2(o3.__H, i3) && (o3.__ = u3, o3.i = i3, r2.__H.__h.push(o3));
  }
  function y2(u3, i3) {
    var o3 = d2(t2++, 4);
    !l.__s && z2(o3.__H, i3) && (o3.__ = u3, o3.i = i3, r2.__h.push(o3));
  }
  function _(n2) {
    return o2 = 5, F(function() {
      return { current: n2 };
    }, []);
  }
  function F(n2, r3) {
    var u3 = d2(t2++, 7);
    return z2(u3.__H, r3) ? (u3.__V = n2(), u3.i = r3, u3.__h = n2, u3.__V) : u3.__;
  }
  function T2(n2, t4) {
    return o2 = 8, F(function() {
      return n2;
    }, t4);
  }
  function q2(n2) {
    var u3 = r2.context[n2.__c], i3 = d2(t2++, 9);
    return i3.c = n2, u3 ? (null == i3.__ && (i3.__ = true, u3.sub(r2)), u3.props.value) : n2.__;
  }
  function b2() {
    for (var t4; t4 = f2.shift(); )
      if (t4.__P && t4.__H)
        try {
          t4.__H.__h.forEach(k2), t4.__H.__h.forEach(w2), t4.__H.__h = [];
        } catch (r3) {
          t4.__H.__h = [], l.__e(r3, t4.__v);
        }
  }
  l.__b = function(n2) {
    r2 = null, e2 && e2(n2);
  }, l.__r = function(n2) {
    a2 && a2(n2), t2 = 0;
    var i3 = (r2 = n2.__c).__H;
    i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.__V = c2, n3.__N = n3.i = void 0;
    })) : (i3.__h.forEach(k2), i3.__h.forEach(w2), i3.__h = [], t2 = 0)), u2 = r2;
  }, l.diffed = function(t4) {
    v2 && v2(t4);
    var o3 = t4.__c;
    o3 && o3.__H && (o3.__H.__h.length && (1 !== f2.push(o3) && i2 === l.requestAnimationFrame || ((i2 = l.requestAnimationFrame) || j2)(b2)), o3.__H.__.forEach(function(n2) {
      n2.i && (n2.__H = n2.i), n2.__V !== c2 && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c2;
    })), u2 = r2 = null;
  }, l.__c = function(t4, r3) {
    r3.some(function(t5) {
      try {
        t5.__h.forEach(k2), t5.__h = t5.__h.filter(function(n2) {
          return !n2.__ || w2(n2);
        });
      } catch (u3) {
        r3.some(function(n2) {
          n2.__h && (n2.__h = []);
        }), r3 = [], l.__e(u3, t5.__v);
      }
    }), l2 && l2(t4, r3);
  }, l.unmount = function(t4) {
    m2 && m2(t4);
    var r3, u3 = t4.__c;
    u3 && u3.__H && (u3.__H.__.forEach(function(n2) {
      try {
        k2(n2);
      } catch (n3) {
        r3 = n3;
      }
    }), u3.__H = void 0, r3 && l.__e(r3, u3.__v));
  };
  var g2 = "function" == typeof requestAnimationFrame;
  function j2(n2) {
    var t4, r3 = function() {
      clearTimeout(u3), g2 && cancelAnimationFrame(t4), setTimeout(n2);
    }, u3 = setTimeout(r3, 100);
    g2 && (t4 = requestAnimationFrame(r3));
  }
  function k2(n2) {
    var t4 = r2, u3 = n2.__c;
    "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t4;
  }
  function w2(n2) {
    var t4 = r2;
    n2.__c = n2.__(), r2 = t4;
  }
  function z2(n2, t4) {
    return !n2 || n2.length !== t4.length || t4.some(function(t5, r3) {
      return t5 !== n2[r3];
    });
  }
  function B2(n2, t4) {
    return "function" == typeof t4 ? t4(n2) : t4;
  }

  // shared/js/ui/templates/shared/hero.js
  var import_nanohtml2 = __toESM(require_browser());

  // shared/js/ui/templates/shared/links.js
  var import_nanohtml = __toESM(require_browser());

  // node_modules/@babel/runtime/helpers/esm/typeof.js
  function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
  }

  // node_modules/@babel/runtime/helpers/esm/classCallCheck.js
  function _classCallCheck(instance2, Constructor) {
    if (!(instance2 instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  // node_modules/@babel/runtime/helpers/esm/createClass.js
  function _defineProperties(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }

  // node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
  function _setPrototypeOf(o3, p3) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o4, p4) {
      o4.__proto__ = p4;
      return o4;
    };
    return _setPrototypeOf(o3, p3);
  }

  // node_modules/@babel/runtime/helpers/esm/inherits.js
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass)
      _setPrototypeOf(subClass, superClass);
  }

  // node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }

  // node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
  function _getPrototypeOf(o3) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o4) {
      return o4.__proto__ || Object.getPrototypeOf(o4);
    };
    return _getPrototypeOf(o3);
  }

  // node_modules/@babel/runtime/helpers/esm/defineProperty.js
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  // node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
  function _arrayWithHoles(arr2) {
    if (Array.isArray(arr2))
      return arr2;
  }

  // node_modules/@babel/runtime/helpers/esm/iterableToArray.js
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }

  // node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
  function _arrayLikeToArray(arr2, len) {
    if (len == null || len > arr2.length)
      len = arr2.length;
    for (var i3 = 0, arr22 = new Array(len); i3 < len; i3++) {
      arr22[i3] = arr2[i3];
    }
    return arr22;
  }

  // node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
  function _unsupportedIterableToArray(o3, minLen) {
    if (!o3)
      return;
    if (typeof o3 === "string")
      return _arrayLikeToArray(o3, minLen);
    var n2 = Object.prototype.toString.call(o3).slice(8, -1);
    if (n2 === "Object" && o3.constructor)
      n2 = o3.constructor.name;
    if (n2 === "Map" || n2 === "Set")
      return Array.from(o3);
    if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
      return _arrayLikeToArray(o3, minLen);
  }

  // node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // node_modules/@babel/runtime/helpers/esm/toArray.js
  function _toArray(arr2) {
    return _arrayWithHoles(arr2) || _iterableToArray(arr2) || _unsupportedIterableToArray(arr2) || _nonIterableRest();
  }

  // node_modules/i18next/dist/esm/i18next.js
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  var consoleLogger = {
    type: "logger",
    log: function log(args) {
      this.output("log", args);
    },
    warn: function warn(args) {
      this.output("warn", args);
    },
    error: function error(args) {
      this.output("error", args);
    },
    output: function output(type, args) {
      if (console && console[type])
        console[type].apply(console, args);
    }
  };
  var Logger = function() {
    function Logger2(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      _classCallCheck(this, Logger2);
      this.init(concreteLogger, options);
    }
    _createClass(Logger2, [{
      key: "init",
      value: function init3(concreteLogger) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        this.prefix = options.prefix || "i18next:";
        this.logger = concreteLogger || consoleLogger;
        this.options = options;
        this.debug = options.debug;
      }
    }, {
      key: "setDebug",
      value: function setDebug(bool) {
        this.debug = bool;
      }
    }, {
      key: "log",
      value: function log2() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return this.forward(args, "log", "", true);
      }
    }, {
      key: "warn",
      value: function warn2() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return this.forward(args, "warn", "", true);
      }
    }, {
      key: "error",
      value: function error2() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }
        return this.forward(args, "error", "");
      }
    }, {
      key: "deprecate",
      value: function deprecate() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }
        return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
      }
    }, {
      key: "forward",
      value: function forward(args, lvl, prefix2, debugOnly) {
        if (debugOnly && !this.debug)
          return null;
        if (typeof args[0] === "string")
          args[0] = "".concat(prefix2).concat(this.prefix, " ").concat(args[0]);
        return this.logger[lvl](args);
      }
    }, {
      key: "create",
      value: function create2(moduleName) {
        return new Logger2(this.logger, _objectSpread(_objectSpread({}, {
          prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
        }), this.options));
      }
    }]);
    return Logger2;
  }();
  var baseLogger = new Logger();
  var EventEmitter = function() {
    function EventEmitter2() {
      _classCallCheck(this, EventEmitter2);
      this.observers = {};
    }
    _createClass(EventEmitter2, [{
      key: "on",
      value: function on(events, listener) {
        var _this = this;
        events.split(" ").forEach(function(event) {
          _this.observers[event] = _this.observers[event] || [];
          _this.observers[event].push(listener);
        });
        return this;
      }
    }, {
      key: "off",
      value: function off(event, listener) {
        if (!this.observers[event])
          return;
        if (!listener) {
          delete this.observers[event];
          return;
        }
        this.observers[event] = this.observers[event].filter(function(l3) {
          return l3 !== listener;
        });
      }
    }, {
      key: "emit",
      value: function emit(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        if (this.observers[event]) {
          var cloned = [].concat(this.observers[event]);
          cloned.forEach(function(observer) {
            observer.apply(void 0, args);
          });
        }
        if (this.observers["*"]) {
          var _cloned = [].concat(this.observers["*"]);
          _cloned.forEach(function(observer) {
            observer.apply(observer, [event].concat(args));
          });
        }
      }
    }]);
    return EventEmitter2;
  }();
  function defer() {
    var res;
    var rej;
    var promise = new Promise(function(resolve, reject) {
      res = resolve;
      rej = reject;
    });
    promise.resolve = res;
    promise.reject = rej;
    return promise;
  }
  function makeString(object) {
    if (object == null)
      return "";
    return "" + object;
  }
  function copy(a3, s3, t4) {
    a3.forEach(function(m3) {
      if (s3[m3])
        t4[m3] = s3[m3];
    });
  }
  function getLastOfPath(object, path, Empty) {
    function cleanKey(key2) {
      return key2 && key2.indexOf("###") > -1 ? key2.replace(/###/g, ".") : key2;
    }
    function canNotTraverseDeeper() {
      return !object || typeof object === "string";
    }
    var stack = typeof path !== "string" ? [].concat(path) : path.split(".");
    while (stack.length > 1) {
      if (canNotTraverseDeeper())
        return {};
      var key = cleanKey(stack.shift());
      if (!object[key] && Empty)
        object[key] = new Empty();
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        object = object[key];
      } else {
        object = {};
      }
    }
    if (canNotTraverseDeeper())
      return {};
    return {
      obj: object,
      k: cleanKey(stack.shift())
    };
  }
  function setPath(object, path, newValue) {
    var _getLastOfPath = getLastOfPath(object, path, Object), obj = _getLastOfPath.obj, k3 = _getLastOfPath.k;
    obj[k3] = newValue;
  }
  function pushPath(object, path, newValue, concat) {
    var _getLastOfPath2 = getLastOfPath(object, path, Object), obj = _getLastOfPath2.obj, k3 = _getLastOfPath2.k;
    obj[k3] = obj[k3] || [];
    if (concat)
      obj[k3] = obj[k3].concat(newValue);
    if (!concat)
      obj[k3].push(newValue);
  }
  function getPath(object, path) {
    var _getLastOfPath3 = getLastOfPath(object, path), obj = _getLastOfPath3.obj, k3 = _getLastOfPath3.k;
    if (!obj)
      return void 0;
    return obj[k3];
  }
  function getPathWithDefaults(data, defaultData, key) {
    var value = getPath(data, key);
    if (value !== void 0) {
      return value;
    }
    return getPath(defaultData, key);
  }
  function deepExtend(target, source, overwrite) {
    for (var prop in source) {
      if (prop !== "__proto__" && prop !== "constructor") {
        if (prop in target) {
          if (typeof target[prop] === "string" || target[prop] instanceof String || typeof source[prop] === "string" || source[prop] instanceof String) {
            if (overwrite)
              target[prop] = source[prop];
          } else {
            deepExtend(target[prop], source[prop], overwrite);
          }
        } else {
          target[prop] = source[prop];
        }
      }
    }
    return target;
  }
  function regexEscape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  var _entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
  };
  function escape(data) {
    if (typeof data === "string") {
      return data.replace(/[&<>"'\/]/g, function(s3) {
        return _entityMap[s3];
      });
    }
    return data;
  }
  var isIE10 = typeof window !== "undefined" && window.navigator && typeof window.navigator.userAgentData === "undefined" && window.navigator.userAgent && window.navigator.userAgent.indexOf("MSIE") > -1;
  var chars = [" ", ",", "?", "!", ";"];
  function looksLikeObjectPath(key, nsSeparator, keySeparator) {
    nsSeparator = nsSeparator || "";
    keySeparator = keySeparator || "";
    var possibleChars = chars.filter(function(c3) {
      return nsSeparator.indexOf(c3) < 0 && keySeparator.indexOf(c3) < 0;
    });
    if (possibleChars.length === 0)
      return true;
    var r3 = new RegExp("(".concat(possibleChars.map(function(c3) {
      return c3 === "?" ? "\\?" : c3;
    }).join("|"), ")"));
    var matched = !r3.test(key);
    if (!matched) {
      var ki = key.indexOf(keySeparator);
      if (ki > 0 && !r3.test(key.substring(0, ki))) {
        matched = true;
      }
    }
    return matched;
  }
  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$1(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys$1(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$1(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e3) {
      return false;
    }
  }
  function deepFind(obj, path) {
    var keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
    if (!obj)
      return void 0;
    if (obj[path])
      return obj[path];
    var paths = path.split(keySeparator);
    var current = obj;
    for (var i3 = 0; i3 < paths.length; ++i3) {
      if (!current)
        return void 0;
      if (typeof current[paths[i3]] === "string" && i3 + 1 < paths.length) {
        return void 0;
      }
      if (current[paths[i3]] === void 0) {
        var j3 = 2;
        var p3 = paths.slice(i3, i3 + j3).join(keySeparator);
        var mix = current[p3];
        while (mix === void 0 && paths.length > i3 + j3) {
          j3++;
          p3 = paths.slice(i3, i3 + j3).join(keySeparator);
          mix = current[p3];
        }
        if (mix === void 0)
          return void 0;
        if (mix === null)
          return null;
        if (path.endsWith(p3)) {
          if (typeof mix === "string")
            return mix;
          if (p3 && typeof mix[p3] === "string")
            return mix[p3];
        }
        var joinedPath = paths.slice(i3 + j3).join(keySeparator);
        if (joinedPath)
          return deepFind(mix, joinedPath, keySeparator);
        return void 0;
      }
      current = current[paths[i3]];
    }
    return current;
  }
  var ResourceStore = function(_EventEmitter) {
    _inherits(ResourceStore2, _EventEmitter);
    var _super = _createSuper(ResourceStore2);
    function ResourceStore2(data) {
      var _this;
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        ns: ["translation"],
        defaultNS: "translation"
      };
      _classCallCheck(this, ResourceStore2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }
      _this.data = data || {};
      _this.options = options;
      if (_this.options.keySeparator === void 0) {
        _this.options.keySeparator = ".";
      }
      if (_this.options.ignoreJSONStructure === void 0) {
        _this.options.ignoreJSONStructure = true;
      }
      return _this;
    }
    _createClass(ResourceStore2, [{
      key: "addNamespaces",
      value: function addNamespaces(ns2) {
        if (this.options.ns.indexOf(ns2) < 0) {
          this.options.ns.push(ns2);
        }
      }
    }, {
      key: "removeNamespaces",
      value: function removeNamespaces(ns2) {
        var index = this.options.ns.indexOf(ns2);
        if (index > -1) {
          this.options.ns.splice(index, 1);
        }
      }
    }, {
      key: "getResource",
      value: function getResource(lng, ns2, key) {
        var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        var ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
        var path = [lng, ns2];
        if (key && typeof key !== "string")
          path = path.concat(key);
        if (key && typeof key === "string")
          path = path.concat(keySeparator ? key.split(keySeparator) : key);
        if (lng.indexOf(".") > -1) {
          path = lng.split(".");
        }
        var result = getPath(this.data, path);
        if (result || !ignoreJSONStructure || typeof key !== "string")
          return result;
        return deepFind(this.data && this.data[lng] && this.data[lng][ns2], key, keySeparator);
      }
    }, {
      key: "addResource",
      value: function addResource(lng, ns2, key, value) {
        var options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
          silent: false
        };
        var keySeparator = this.options.keySeparator;
        if (keySeparator === void 0)
          keySeparator = ".";
        var path = [lng, ns2];
        if (key)
          path = path.concat(keySeparator ? key.split(keySeparator) : key);
        if (lng.indexOf(".") > -1) {
          path = lng.split(".");
          value = ns2;
          ns2 = path[1];
        }
        this.addNamespaces(ns2);
        setPath(this.data, path, value);
        if (!options.silent)
          this.emit("added", lng, ns2, key, value);
      }
    }, {
      key: "addResources",
      value: function addResources(lng, ns2, resources2) {
        var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
          silent: false
        };
        for (var m3 in resources2) {
          if (typeof resources2[m3] === "string" || Object.prototype.toString.apply(resources2[m3]) === "[object Array]")
            this.addResource(lng, ns2, m3, resources2[m3], {
              silent: true
            });
        }
        if (!options.silent)
          this.emit("added", lng, ns2, resources2);
      }
    }, {
      key: "addResourceBundle",
      value: function addResourceBundle(lng, ns2, resources2, deep, overwrite) {
        var options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
          silent: false
        };
        var path = [lng, ns2];
        if (lng.indexOf(".") > -1) {
          path = lng.split(".");
          deep = resources2;
          resources2 = ns2;
          ns2 = path[1];
        }
        this.addNamespaces(ns2);
        var pack = getPath(this.data, path) || {};
        if (deep) {
          deepExtend(pack, resources2, overwrite);
        } else {
          pack = _objectSpread$1(_objectSpread$1({}, pack), resources2);
        }
        setPath(this.data, path, pack);
        if (!options.silent)
          this.emit("added", lng, ns2, resources2);
      }
    }, {
      key: "removeResourceBundle",
      value: function removeResourceBundle(lng, ns2) {
        if (this.hasResourceBundle(lng, ns2)) {
          delete this.data[lng][ns2];
        }
        this.removeNamespaces(ns2);
        this.emit("removed", lng, ns2);
      }
    }, {
      key: "hasResourceBundle",
      value: function hasResourceBundle(lng, ns2) {
        return this.getResource(lng, ns2) !== void 0;
      }
    }, {
      key: "getResourceBundle",
      value: function getResourceBundle(lng, ns2) {
        if (!ns2)
          ns2 = this.options.defaultNS;
        if (this.options.compatibilityAPI === "v1")
          return _objectSpread$1(_objectSpread$1({}, {}), this.getResource(lng, ns2));
        return this.getResource(lng, ns2);
      }
    }, {
      key: "getDataByLanguage",
      value: function getDataByLanguage(lng) {
        return this.data[lng];
      }
    }, {
      key: "hasLanguageSomeTranslations",
      value: function hasLanguageSomeTranslations(lng) {
        var data = this.getDataByLanguage(lng);
        var n2 = data && Object.keys(data) || [];
        return !!n2.find(function(v3) {
          return data[v3] && Object.keys(data[v3]).length > 0;
        });
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.data;
      }
    }]);
    return ResourceStore2;
  }(EventEmitter);
  var postProcessor = {
    processors: {},
    addPostProcessor: function addPostProcessor(module) {
      this.processors[module.name] = module;
    },
    handle: function handle(processors, value, key, options, translator) {
      var _this = this;
      processors.forEach(function(processor) {
        if (_this.processors[processor])
          value = _this.processors[processor].process(value, key, options, translator);
      });
      return value;
    }
  };
  function ownKeys$2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$2(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys$2(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$2(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _createSuper$1(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$1();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e3) {
      return false;
    }
  }
  var checkedLoadedFor = {};
  var Translator = function(_EventEmitter) {
    _inherits(Translator2, _EventEmitter);
    var _super = _createSuper$1(Translator2);
    function Translator2(services) {
      var _this;
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      _classCallCheck(this, Translator2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }
      copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, _assertThisInitialized(_this));
      _this.options = options;
      if (_this.options.keySeparator === void 0) {
        _this.options.keySeparator = ".";
      }
      _this.logger = baseLogger.create("translator");
      return _this;
    }
    _createClass(Translator2, [{
      key: "changeLanguage",
      value: function changeLanguage2(lng) {
        if (lng)
          this.language = lng;
      }
    }, {
      key: "exists",
      value: function exists2(key) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
          interpolation: {}
        };
        if (key === void 0 || key === null) {
          return false;
        }
        var resolved = this.resolve(key, options);
        return resolved && resolved.res !== void 0;
      }
    }, {
      key: "extractFromKey",
      value: function extractFromKey(key, options) {
        var nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === void 0)
          nsSeparator = ":";
        var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        var namespaces = options.ns || this.options.defaultNS || [];
        var wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
        var seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
        if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
          var m3 = key.match(this.interpolator.nestingRegexp);
          if (m3 && m3.length > 0) {
            return {
              key,
              namespaces
            };
          }
          var parts = key.split(nsSeparator);
          if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1)
            namespaces = parts.shift();
          key = parts.join(keySeparator);
        }
        if (typeof namespaces === "string")
          namespaces = [namespaces];
        return {
          key,
          namespaces
        };
      }
    }, {
      key: "translate",
      value: function translate(keys, options, lastKey) {
        var _this2 = this;
        if (_typeof(options) !== "object" && this.options.overloadTranslationOptionHandler) {
          options = this.options.overloadTranslationOptionHandler(arguments);
        }
        if (!options)
          options = {};
        if (keys === void 0 || keys === null)
          return "";
        if (!Array.isArray(keys))
          keys = [String(keys)];
        var returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
        var keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
        var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options), key = _this$extractFromKey.key, namespaces = _this$extractFromKey.namespaces;
        var namespace = namespaces[namespaces.length - 1];
        var lng = options.lng || this.language;
        var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
        if (lng && lng.toLowerCase() === "cimode") {
          if (appendNamespaceToCIMode) {
            var nsSeparator = options.nsSeparator || this.options.nsSeparator;
            if (returnDetails) {
              resolved.res = "".concat(namespace).concat(nsSeparator).concat(key);
              return resolved;
            }
            return "".concat(namespace).concat(nsSeparator).concat(key);
          }
          if (returnDetails) {
            resolved.res = key;
            return resolved;
          }
          return key;
        }
        var resolved = this.resolve(keys, options);
        var res = resolved && resolved.res;
        var resUsedKey = resolved && resolved.usedKey || key;
        var resExactUsedKey = resolved && resolved.exactUsedKey || key;
        var resType = Object.prototype.toString.apply(res);
        var noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
        var joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
        var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
        var handleAsObject = typeof res !== "string" && typeof res !== "boolean" && typeof res !== "number";
        if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === "string" && resType === "[object Array]")) {
          if (!options.returnObjects && !this.options.returnObjects) {
            if (!this.options.returnedObjectHandler) {
              this.logger.warn("accessing an object - but returnObjects options is not enabled!");
            }
            var r3 = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, _objectSpread$2(_objectSpread$2({}, options), {}, {
              ns: namespaces
            })) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
            if (returnDetails) {
              resolved.res = r3;
              return resolved;
            }
            return r3;
          }
          if (keySeparator) {
            var resTypeIsArray = resType === "[object Array]";
            var copy2 = resTypeIsArray ? [] : {};
            var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
            for (var m3 in res) {
              if (Object.prototype.hasOwnProperty.call(res, m3)) {
                var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m3);
                copy2[m3] = this.translate(deepKey, _objectSpread$2(_objectSpread$2({}, options), {
                  joinArrays: false,
                  ns: namespaces
                }));
                if (copy2[m3] === deepKey)
                  copy2[m3] = res[m3];
              }
            }
            res = copy2;
          }
        } else if (handleAsObjectInI18nFormat && typeof joinArrays === "string" && resType === "[object Array]") {
          res = res.join(joinArrays);
          if (res)
            res = this.extendTranslation(res, keys, options, lastKey);
        } else {
          var usedDefault = false;
          var usedKey = false;
          var needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
          var hasDefaultValue = Translator2.hasDefaultValue(options);
          var defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
          var defaultValue = options["defaultValue".concat(defaultValueSuffix)] || options.defaultValue;
          if (!this.isValidLookup(res) && hasDefaultValue) {
            usedDefault = true;
            res = defaultValue;
          }
          if (!this.isValidLookup(res)) {
            usedKey = true;
            res = key;
          }
          var missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
          var resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
          var updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
          if (usedKey || usedDefault || updateMissing) {
            this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
            if (keySeparator) {
              var fk = this.resolve(key, _objectSpread$2(_objectSpread$2({}, options), {}, {
                keySeparator: false
              }));
              if (fk && fk.res)
                this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
            }
            var lngs = [];
            var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
            if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
              for (var i3 = 0; i3 < fallbackLngs.length; i3++) {
                lngs.push(fallbackLngs[i3]);
              }
            } else if (this.options.saveMissingTo === "all") {
              lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
            } else {
              lngs.push(options.lng || this.language);
            }
            var send = function send2(l3, k3, specificDefaultValue) {
              var defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
              if (_this2.options.missingKeyHandler) {
                _this2.options.missingKeyHandler(l3, namespace, k3, defaultForMissing, updateMissing, options);
              } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
                _this2.backendConnector.saveMissing(l3, namespace, k3, defaultForMissing, updateMissing, options);
              }
              _this2.emit("missingKey", l3, namespace, k3, res);
            };
            if (this.options.saveMissing) {
              if (this.options.saveMissingPlurals && needsPluralHandling) {
                lngs.forEach(function(language) {
                  _this2.pluralResolver.getSuffixes(language, options).forEach(function(suffix) {
                    send([language], key + suffix, options["defaultValue".concat(suffix)] || defaultValue);
                  });
                });
              } else {
                send(lngs, key, defaultValue);
              }
            }
          }
          res = this.extendTranslation(res, keys, options, resolved, lastKey);
          if (usedKey && res === key && this.options.appendNamespaceToMissingKey)
            res = "".concat(namespace, ":").concat(key);
          if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
            if (this.options.compatibilityAPI !== "v1") {
              res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? "".concat(namespace, ":").concat(key) : key, usedDefault ? res : void 0);
            } else {
              res = this.options.parseMissingKeyHandler(res);
            }
          }
        }
        if (returnDetails) {
          resolved.res = res;
          return resolved;
        }
        return res;
      }
    }, {
      key: "extendTranslation",
      value: function extendTranslation(res, key, options, resolved, lastKey) {
        var _this3 = this;
        if (this.i18nFormat && this.i18nFormat.parse) {
          res = this.i18nFormat.parse(res, _objectSpread$2(_objectSpread$2({}, this.options.interpolation.defaultVariables), options), resolved.usedLng, resolved.usedNS, resolved.usedKey, {
            resolved
          });
        } else if (!options.skipInterpolation) {
          if (options.interpolation)
            this.interpolator.init(_objectSpread$2(_objectSpread$2({}, options), {
              interpolation: _objectSpread$2(_objectSpread$2({}, this.options.interpolation), options.interpolation)
            }));
          var skipOnVariables = typeof res === "string" && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
          var nestBef;
          if (skipOnVariables) {
            var nb = res.match(this.interpolator.nestingRegexp);
            nestBef = nb && nb.length;
          }
          var data = options.replace && typeof options.replace !== "string" ? options.replace : options;
          if (this.options.interpolation.defaultVariables)
            data = _objectSpread$2(_objectSpread$2({}, this.options.interpolation.defaultVariables), data);
          res = this.interpolator.interpolate(res, data, options.lng || this.language, options);
          if (skipOnVariables) {
            var na = res.match(this.interpolator.nestingRegexp);
            var nestAft = na && na.length;
            if (nestBef < nestAft)
              options.nest = false;
          }
          if (options.nest !== false)
            res = this.interpolator.nest(res, function() {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              if (lastKey && lastKey[0] === args[0] && !options.context) {
                _this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key[0]));
                return null;
              }
              return _this3.translate.apply(_this3, args.concat([key]));
            }, options);
          if (options.interpolation)
            this.interpolator.reset();
        }
        var postProcess = options.postProcess || this.options.postProcess;
        var postProcessorNames = typeof postProcess === "string" ? [postProcess] : postProcess;
        if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
          res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread$2({
            i18nResolved: resolved
          }, options) : options, this);
        }
        return res;
      }
    }, {
      key: "resolve",
      value: function resolve(keys) {
        var _this4 = this;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var found;
        var usedKey;
        var exactUsedKey;
        var usedLng;
        var usedNS;
        if (typeof keys === "string")
          keys = [keys];
        keys.forEach(function(k3) {
          if (_this4.isValidLookup(found))
            return;
          var extracted = _this4.extractFromKey(k3, options);
          var key = extracted.key;
          usedKey = key;
          var namespaces = extracted.namespaces;
          if (_this4.options.fallbackNS)
            namespaces = namespaces.concat(_this4.options.fallbackNS);
          var needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
          var needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && _this4.pluralResolver.shouldUseIntlApi();
          var needsContextHandling = options.context !== void 0 && (typeof options.context === "string" || typeof options.context === "number") && options.context !== "";
          var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
          namespaces.forEach(function(ns2) {
            if (_this4.isValidLookup(found))
              return;
            usedNS = ns2;
            if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns2)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
              checkedLoadedFor["".concat(codes[0], "-").concat(ns2)] = true;
              _this4.logger.warn('key "'.concat(usedKey, '" for languages "').concat(codes.join(", "), `" won't get resolved as namespace "`).concat(usedNS, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
            }
            codes.forEach(function(code) {
              if (_this4.isValidLookup(found))
                return;
              usedLng = code;
              var finalKeys = [key];
              if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
                _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns2, options);
              } else {
                var pluralSuffix;
                if (needsPluralHandling)
                  pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count, options);
                var zeroSuffix = "_zero";
                if (needsPluralHandling) {
                  finalKeys.push(key + pluralSuffix);
                  if (needsZeroSuffixLookup) {
                    finalKeys.push(key + zeroSuffix);
                  }
                }
                if (needsContextHandling) {
                  var contextKey = "".concat(key).concat(_this4.options.contextSeparator).concat(options.context);
                  finalKeys.push(contextKey);
                  if (needsPluralHandling) {
                    finalKeys.push(contextKey + pluralSuffix);
                    if (needsZeroSuffixLookup) {
                      finalKeys.push(contextKey + zeroSuffix);
                    }
                  }
                }
              }
              var possibleKey;
              while (possibleKey = finalKeys.pop()) {
                if (!_this4.isValidLookup(found)) {
                  exactUsedKey = possibleKey;
                  found = _this4.getResource(code, ns2, possibleKey, options);
                }
              }
            });
          });
        });
        return {
          res: found,
          usedKey,
          exactUsedKey,
          usedLng,
          usedNS
        };
      }
    }, {
      key: "isValidLookup",
      value: function isValidLookup(res) {
        return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
      }
    }, {
      key: "getResource",
      value: function getResource(code, ns2, key) {
        var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        if (this.i18nFormat && this.i18nFormat.getResource)
          return this.i18nFormat.getResource(code, ns2, key, options);
        return this.resourceStore.getResource(code, ns2, key, options);
      }
    }], [{
      key: "hasDefaultValue",
      value: function hasDefaultValue(options) {
        var prefix2 = "defaultValue";
        for (var option in options) {
          if (Object.prototype.hasOwnProperty.call(options, option) && prefix2 === option.substring(0, prefix2.length) && void 0 !== options[option]) {
            return true;
          }
        }
        return false;
      }
    }]);
    return Translator2;
  }(EventEmitter);
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  var LanguageUtil = function() {
    function LanguageUtil2(options) {
      _classCallCheck(this, LanguageUtil2);
      this.options = options;
      this.supportedLngs = this.options.supportedLngs || false;
      this.logger = baseLogger.create("languageUtils");
    }
    _createClass(LanguageUtil2, [{
      key: "getScriptPartFromCode",
      value: function getScriptPartFromCode(code) {
        if (!code || code.indexOf("-") < 0)
          return null;
        var p3 = code.split("-");
        if (p3.length === 2)
          return null;
        p3.pop();
        if (p3[p3.length - 1].toLowerCase() === "x")
          return null;
        return this.formatLanguageCode(p3.join("-"));
      }
    }, {
      key: "getLanguagePartFromCode",
      value: function getLanguagePartFromCode(code) {
        if (!code || code.indexOf("-") < 0)
          return code;
        var p3 = code.split("-");
        return this.formatLanguageCode(p3[0]);
      }
    }, {
      key: "formatLanguageCode",
      value: function formatLanguageCode(code) {
        if (typeof code === "string" && code.indexOf("-") > -1) {
          var specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
          var p3 = code.split("-");
          if (this.options.lowerCaseLng) {
            p3 = p3.map(function(part) {
              return part.toLowerCase();
            });
          } else if (p3.length === 2) {
            p3[0] = p3[0].toLowerCase();
            p3[1] = p3[1].toUpperCase();
            if (specialCases.indexOf(p3[1].toLowerCase()) > -1)
              p3[1] = capitalize(p3[1].toLowerCase());
          } else if (p3.length === 3) {
            p3[0] = p3[0].toLowerCase();
            if (p3[1].length === 2)
              p3[1] = p3[1].toUpperCase();
            if (p3[0] !== "sgn" && p3[2].length === 2)
              p3[2] = p3[2].toUpperCase();
            if (specialCases.indexOf(p3[1].toLowerCase()) > -1)
              p3[1] = capitalize(p3[1].toLowerCase());
            if (specialCases.indexOf(p3[2].toLowerCase()) > -1)
              p3[2] = capitalize(p3[2].toLowerCase());
          }
          return p3.join("-");
        }
        return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
      }
    }, {
      key: "isSupportedCode",
      value: function isSupportedCode(code) {
        if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
          code = this.getLanguagePartFromCode(code);
        }
        return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
      }
    }, {
      key: "getBestMatchFromCodes",
      value: function getBestMatchFromCodes(codes) {
        var _this = this;
        if (!codes)
          return null;
        var found;
        codes.forEach(function(code) {
          if (found)
            return;
          var cleanedLng = _this.formatLanguageCode(code);
          if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng))
            found = cleanedLng;
        });
        if (!found && this.options.supportedLngs) {
          codes.forEach(function(code) {
            if (found)
              return;
            var lngOnly = _this.getLanguagePartFromCode(code);
            if (_this.isSupportedCode(lngOnly))
              return found = lngOnly;
            found = _this.options.supportedLngs.find(function(supportedLng) {
              if (supportedLng.indexOf(lngOnly) === 0)
                return supportedLng;
            });
          });
        }
        if (!found)
          found = this.getFallbackCodes(this.options.fallbackLng)[0];
        return found;
      }
    }, {
      key: "getFallbackCodes",
      value: function getFallbackCodes(fallbacks, code) {
        if (!fallbacks)
          return [];
        if (typeof fallbacks === "function")
          fallbacks = fallbacks(code);
        if (typeof fallbacks === "string")
          fallbacks = [fallbacks];
        if (Object.prototype.toString.apply(fallbacks) === "[object Array]")
          return fallbacks;
        if (!code)
          return fallbacks["default"] || [];
        var found = fallbacks[code];
        if (!found)
          found = fallbacks[this.getScriptPartFromCode(code)];
        if (!found)
          found = fallbacks[this.formatLanguageCode(code)];
        if (!found)
          found = fallbacks[this.getLanguagePartFromCode(code)];
        if (!found)
          found = fallbacks["default"];
        return found || [];
      }
    }, {
      key: "toResolveHierarchy",
      value: function toResolveHierarchy(code, fallbackCode) {
        var _this2 = this;
        var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
        var codes = [];
        var addCode = function addCode2(c3) {
          if (!c3)
            return;
          if (_this2.isSupportedCode(c3)) {
            codes.push(c3);
          } else {
            _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c3));
          }
        };
        if (typeof code === "string" && code.indexOf("-") > -1) {
          if (this.options.load !== "languageOnly")
            addCode(this.formatLanguageCode(code));
          if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly")
            addCode(this.getScriptPartFromCode(code));
          if (this.options.load !== "currentOnly")
            addCode(this.getLanguagePartFromCode(code));
        } else if (typeof code === "string") {
          addCode(this.formatLanguageCode(code));
        }
        fallbackCodes.forEach(function(fc) {
          if (codes.indexOf(fc) < 0)
            addCode(_this2.formatLanguageCode(fc));
        });
        return codes;
      }
    }]);
    return LanguageUtil2;
  }();
  var sets = [{
    lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
    nr: [1, 2],
    fc: 1
  }, {
    lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
    nr: [1, 2],
    fc: 2
  }, {
    lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
    nr: [1],
    fc: 3
  }, {
    lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
    nr: [1, 2, 5],
    fc: 4
  }, {
    lngs: ["ar"],
    nr: [0, 1, 2, 3, 11, 100],
    fc: 5
  }, {
    lngs: ["cs", "sk"],
    nr: [1, 2, 5],
    fc: 6
  }, {
    lngs: ["csb", "pl"],
    nr: [1, 2, 5],
    fc: 7
  }, {
    lngs: ["cy"],
    nr: [1, 2, 3, 8],
    fc: 8
  }, {
    lngs: ["fr"],
    nr: [1, 2],
    fc: 9
  }, {
    lngs: ["ga"],
    nr: [1, 2, 3, 7, 11],
    fc: 10
  }, {
    lngs: ["gd"],
    nr: [1, 2, 3, 20],
    fc: 11
  }, {
    lngs: ["is"],
    nr: [1, 2],
    fc: 12
  }, {
    lngs: ["jv"],
    nr: [0, 1],
    fc: 13
  }, {
    lngs: ["kw"],
    nr: [1, 2, 3, 4],
    fc: 14
  }, {
    lngs: ["lt"],
    nr: [1, 2, 10],
    fc: 15
  }, {
    lngs: ["lv"],
    nr: [1, 2, 0],
    fc: 16
  }, {
    lngs: ["mk"],
    nr: [1, 2],
    fc: 17
  }, {
    lngs: ["mnk"],
    nr: [0, 1, 2],
    fc: 18
  }, {
    lngs: ["mt"],
    nr: [1, 2, 11, 20],
    fc: 19
  }, {
    lngs: ["or"],
    nr: [2, 1],
    fc: 2
  }, {
    lngs: ["ro"],
    nr: [1, 2, 20],
    fc: 20
  }, {
    lngs: ["sl"],
    nr: [5, 1, 2, 3],
    fc: 21
  }, {
    lngs: ["he", "iw"],
    nr: [1, 2, 20, 21],
    fc: 22
  }];
  var _rulesPluralsTypes = {
    1: function _2(n2) {
      return Number(n2 > 1);
    },
    2: function _3(n2) {
      return Number(n2 != 1);
    },
    3: function _4(n2) {
      return 0;
    },
    4: function _5(n2) {
      return Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2);
    },
    5: function _6(n2) {
      return Number(n2 == 0 ? 0 : n2 == 1 ? 1 : n2 == 2 ? 2 : n2 % 100 >= 3 && n2 % 100 <= 10 ? 3 : n2 % 100 >= 11 ? 4 : 5);
    },
    6: function _7(n2) {
      return Number(n2 == 1 ? 0 : n2 >= 2 && n2 <= 4 ? 1 : 2);
    },
    7: function _8(n2) {
      return Number(n2 == 1 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2);
    },
    8: function _9(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 != 8 && n2 != 11 ? 2 : 3);
    },
    9: function _10(n2) {
      return Number(n2 >= 2);
    },
    10: function _11(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 < 7 ? 2 : n2 < 11 ? 3 : 4);
    },
    11: function _12(n2) {
      return Number(n2 == 1 || n2 == 11 ? 0 : n2 == 2 || n2 == 12 ? 1 : n2 > 2 && n2 < 20 ? 2 : 3);
    },
    12: function _13(n2) {
      return Number(n2 % 10 != 1 || n2 % 100 == 11);
    },
    13: function _14(n2) {
      return Number(n2 !== 0);
    },
    14: function _15(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 == 3 ? 2 : 3);
    },
    15: function _16(n2) {
      return Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2);
    },
    16: function _17(n2) {
      return Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 !== 0 ? 1 : 2);
    },
    17: function _18(n2) {
      return Number(n2 == 1 || n2 % 10 == 1 && n2 % 100 != 11 ? 0 : 1);
    },
    18: function _19(n2) {
      return Number(n2 == 0 ? 0 : n2 == 1 ? 1 : 2);
    },
    19: function _20(n2) {
      return Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 1 && n2 % 100 < 11 ? 1 : n2 % 100 > 10 && n2 % 100 < 20 ? 2 : 3);
    },
    20: function _21(n2) {
      return Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 0 && n2 % 100 < 20 ? 1 : 2);
    },
    21: function _22(n2) {
      return Number(n2 % 100 == 1 ? 1 : n2 % 100 == 2 ? 2 : n2 % 100 == 3 || n2 % 100 == 4 ? 3 : 0);
    },
    22: function _23(n2) {
      return Number(n2 == 1 ? 0 : n2 == 2 ? 1 : (n2 < 0 || n2 > 10) && n2 % 10 == 0 ? 2 : 3);
    }
  };
  var deprecatedJsonVersions = ["v1", "v2", "v3"];
  var suffixesOrder = {
    zero: 0,
    one: 1,
    two: 2,
    few: 3,
    many: 4,
    other: 5
  };
  function createRules() {
    var rules = {};
    sets.forEach(function(set) {
      set.lngs.forEach(function(l3) {
        rules[l3] = {
          numbers: set.nr,
          plurals: _rulesPluralsTypes[set.fc]
        };
      });
    });
    return rules;
  }
  var PluralResolver = function() {
    function PluralResolver2(languageUtils) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      _classCallCheck(this, PluralResolver2);
      this.languageUtils = languageUtils;
      this.options = options;
      this.logger = baseLogger.create("pluralResolver");
      if ((!this.options.compatibilityJSON || this.options.compatibilityJSON === "v4") && (typeof Intl === "undefined" || !Intl.PluralRules)) {
        this.options.compatibilityJSON = "v3";
        this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
      }
      this.rules = createRules();
    }
    _createClass(PluralResolver2, [{
      key: "addRule",
      value: function addRule(lng, obj) {
        this.rules[lng] = obj;
      }
    }, {
      key: "getRule",
      value: function getRule(code) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (this.shouldUseIntlApi()) {
          try {
            return new Intl.PluralRules(code, {
              type: options.ordinal ? "ordinal" : "cardinal"
            });
          } catch (_unused) {
            return;
          }
        }
        return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
      }
    }, {
      key: "needsPlural",
      value: function needsPlural(code) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var rule = this.getRule(code, options);
        if (this.shouldUseIntlApi()) {
          return rule && rule.resolvedOptions().pluralCategories.length > 1;
        }
        return rule && rule.numbers.length > 1;
      }
    }, {
      key: "getPluralFormsOfKey",
      value: function getPluralFormsOfKey(code, key) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return this.getSuffixes(code, options).map(function(suffix) {
          return "".concat(key).concat(suffix);
        });
      }
    }, {
      key: "getSuffixes",
      value: function getSuffixes(code) {
        var _this = this;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var rule = this.getRule(code, options);
        if (!rule) {
          return [];
        }
        if (this.shouldUseIntlApi()) {
          return rule.resolvedOptions().pluralCategories.sort(function(pluralCategory1, pluralCategory2) {
            return suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2];
          }).map(function(pluralCategory) {
            return "".concat(_this.options.prepend).concat(pluralCategory);
          });
        }
        return rule.numbers.map(function(number) {
          return _this.getSuffix(code, number, options);
        });
      }
    }, {
      key: "getSuffix",
      value: function getSuffix(code, count) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var rule = this.getRule(code, options);
        if (rule) {
          if (this.shouldUseIntlApi()) {
            return "".concat(this.options.prepend).concat(rule.select(count));
          }
          return this.getSuffixRetroCompatible(rule, count);
        }
        this.logger.warn("no plural rule found for: ".concat(code));
        return "";
      }
    }, {
      key: "getSuffixRetroCompatible",
      value: function getSuffixRetroCompatible(rule, count) {
        var _this2 = this;
        var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
        var suffix = rule.numbers[idx];
        if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          if (suffix === 2) {
            suffix = "plural";
          } else if (suffix === 1) {
            suffix = "";
          }
        }
        var returnSuffix = function returnSuffix2() {
          return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
        };
        if (this.options.compatibilityJSON === "v1") {
          if (suffix === 1)
            return "";
          if (typeof suffix === "number")
            return "_plural_".concat(suffix.toString());
          return returnSuffix();
        } else if (this.options.compatibilityJSON === "v2") {
          return returnSuffix();
        } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          return returnSuffix();
        }
        return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
      }
    }, {
      key: "shouldUseIntlApi",
      value: function shouldUseIntlApi() {
        return !deprecatedJsonVersions.includes(this.options.compatibilityJSON);
      }
    }]);
    return PluralResolver2;
  }();
  function ownKeys$3(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$3(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys$3(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$3(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  var Interpolator = function() {
    function Interpolator2() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck(this, Interpolator2);
      this.logger = baseLogger.create("interpolator");
      this.options = options;
      this.format = options.interpolation && options.interpolation.format || function(value) {
        return value;
      };
      this.init(options);
    }
    _createClass(Interpolator2, [{
      key: "init",
      value: function init3() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (!options.interpolation)
          options.interpolation = {
            escapeValue: true
          };
        var iOpts = options.interpolation;
        this.escape = iOpts.escape !== void 0 ? iOpts.escape : escape;
        this.escapeValue = iOpts.escapeValue !== void 0 ? iOpts.escapeValue : true;
        this.useRawValueToEscape = iOpts.useRawValueToEscape !== void 0 ? iOpts.useRawValueToEscape : false;
        this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || "{{";
        this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || "}}";
        this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
        this.unescapePrefix = iOpts.unescapeSuffix ? "" : iOpts.unescapePrefix || "-";
        this.unescapeSuffix = this.unescapePrefix ? "" : iOpts.unescapeSuffix || "";
        this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape("$t(");
        this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(")");
        this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ",";
        this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1e3;
        this.alwaysFormat = iOpts.alwaysFormat !== void 0 ? iOpts.alwaysFormat : false;
        this.resetRegExp();
      }
    }, {
      key: "reset",
      value: function reset() {
        if (this.options)
          this.init(this.options);
      }
    }, {
      key: "resetRegExp",
      value: function resetRegExp() {
        var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
        this.regexp = new RegExp(regexpStr, "g");
        var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
        this.regexpUnescape = new RegExp(regexpUnescapeStr, "g");
        var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
        this.nestingRegexp = new RegExp(nestingRegexpStr, "g");
      }
    }, {
      key: "interpolate",
      value: function interpolate(str, data, lng, options) {
        var _this = this;
        var match;
        var value;
        var replaces;
        var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
        function regexSafe(val) {
          return val.replace(/\$/g, "$$$$");
        }
        var handleFormat = function handleFormat2(key) {
          if (key.indexOf(_this.formatSeparator) < 0) {
            var path = getPathWithDefaults(data, defaultData, key);
            return _this.alwaysFormat ? _this.format(path, void 0, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
              interpolationkey: key
            })) : path;
          }
          var p3 = key.split(_this.formatSeparator);
          var k3 = p3.shift().trim();
          var f3 = p3.join(_this.formatSeparator).trim();
          return _this.format(getPathWithDefaults(data, defaultData, k3), f3, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
            interpolationkey: k3
          }));
        };
        this.resetRegExp();
        var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
        var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
        var todos = [{
          regex: this.regexpUnescape,
          safeValue: function safeValue(val) {
            return regexSafe(val);
          }
        }, {
          regex: this.regexp,
          safeValue: function safeValue(val) {
            return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
          }
        }];
        todos.forEach(function(todo) {
          replaces = 0;
          while (match = todo.regex.exec(str)) {
            var matchedVar = match[1].trim();
            value = handleFormat(matchedVar);
            if (value === void 0) {
              if (typeof missingInterpolationHandler === "function") {
                var temp = missingInterpolationHandler(str, match, options);
                value = typeof temp === "string" ? temp : "";
              } else if (options && options.hasOwnProperty(matchedVar)) {
                value = "";
              } else if (skipOnVariables) {
                value = match[0];
                continue;
              } else {
                _this.logger.warn("missed to pass in variable ".concat(matchedVar, " for interpolating ").concat(str));
                value = "";
              }
            } else if (typeof value !== "string" && !_this.useRawValueToEscape) {
              value = makeString(value);
            }
            var safeValue = todo.safeValue(value);
            str = str.replace(match[0], safeValue);
            if (skipOnVariables) {
              todo.regex.lastIndex += value.length;
              todo.regex.lastIndex -= match[0].length;
            } else {
              todo.regex.lastIndex = 0;
            }
            replaces++;
            if (replaces >= _this.maxReplaces) {
              break;
            }
          }
        });
        return str;
      }
    }, {
      key: "nest",
      value: function nest(str, fc) {
        var _this2 = this;
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var match;
        var value;
        var clonedOptions = _objectSpread$3({}, options);
        clonedOptions.applyPostProcessor = false;
        delete clonedOptions.defaultValue;
        function handleHasOptions(key, inheritedOptions) {
          var sep = this.nestingOptionsSeparator;
          if (key.indexOf(sep) < 0)
            return key;
          var c3 = key.split(new RegExp("".concat(sep, "[ ]*{")));
          var optionsString = "{".concat(c3[1]);
          key = c3[0];
          optionsString = this.interpolate(optionsString, clonedOptions);
          optionsString = optionsString.replace(/'/g, '"');
          try {
            clonedOptions = JSON.parse(optionsString);
            if (inheritedOptions)
              clonedOptions = _objectSpread$3(_objectSpread$3({}, inheritedOptions), clonedOptions);
          } catch (e3) {
            this.logger.warn("failed parsing options string in nesting for key ".concat(key), e3);
            return "".concat(key).concat(sep).concat(optionsString);
          }
          delete clonedOptions.defaultValue;
          return key;
        }
        while (match = this.nestingRegexp.exec(str)) {
          var formatters = [];
          var doReduce = false;
          if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
            var r3 = match[1].split(this.formatSeparator).map(function(elem) {
              return elem.trim();
            });
            match[1] = r3.shift();
            formatters = r3;
            doReduce = true;
          }
          value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
          if (value && match[0] === str && typeof value !== "string")
            return value;
          if (typeof value !== "string")
            value = makeString(value);
          if (!value) {
            this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
            value = "";
          }
          if (doReduce) {
            value = formatters.reduce(function(v3, f3) {
              return _this2.format(v3, f3, options.lng, _objectSpread$3(_objectSpread$3({}, options), {}, {
                interpolationkey: match[1].trim()
              }));
            }, value.trim());
          }
          str = str.replace(match[0], value);
          this.regexp.lastIndex = 0;
        }
        return str;
      }
    }]);
    return Interpolator2;
  }();
  function ownKeys$4(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$4(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys$4(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$4(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function parseFormatStr(formatStr) {
    var formatName = formatStr.toLowerCase().trim();
    var formatOptions = {};
    if (formatStr.indexOf("(") > -1) {
      var p3 = formatStr.split("(");
      formatName = p3[0].toLowerCase().trim();
      var optStr = p3[1].substring(0, p3[1].length - 1);
      if (formatName === "currency" && optStr.indexOf(":") < 0) {
        if (!formatOptions.currency)
          formatOptions.currency = optStr.trim();
      } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
        if (!formatOptions.range)
          formatOptions.range = optStr.trim();
      } else {
        var opts = optStr.split(";");
        opts.forEach(function(opt) {
          if (!opt)
            return;
          var _opt$split = opt.split(":"), _opt$split2 = _toArray(_opt$split), key = _opt$split2[0], rest = _opt$split2.slice(1);
          var val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          if (!formatOptions[key.trim()])
            formatOptions[key.trim()] = val;
          if (val === "false")
            formatOptions[key.trim()] = false;
          if (val === "true")
            formatOptions[key.trim()] = true;
          if (!isNaN(val))
            formatOptions[key.trim()] = parseInt(val, 10);
        });
      }
    }
    return {
      formatName,
      formatOptions
    };
  }
  var Formatter = function() {
    function Formatter2() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck(this, Formatter2);
      this.logger = baseLogger.create("formatter");
      this.options = options;
      this.formats = {
        number: function number(val, lng, options2) {
          return new Intl.NumberFormat(lng, options2).format(val);
        },
        currency: function currency(val, lng, options2) {
          return new Intl.NumberFormat(lng, _objectSpread$4(_objectSpread$4({}, options2), {}, {
            style: "currency"
          })).format(val);
        },
        datetime: function datetime(val, lng, options2) {
          return new Intl.DateTimeFormat(lng, _objectSpread$4({}, options2)).format(val);
        },
        relativetime: function relativetime(val, lng, options2) {
          return new Intl.RelativeTimeFormat(lng, _objectSpread$4({}, options2)).format(val, options2.range || "day");
        },
        list: function list(val, lng, options2) {
          return new Intl.ListFormat(lng, _objectSpread$4({}, options2)).format(val);
        }
      };
      this.init(options);
    }
    _createClass(Formatter2, [{
      key: "init",
      value: function init3(services) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
          interpolation: {}
        };
        var iOpts = options.interpolation;
        this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
      }
    }, {
      key: "add",
      value: function add(name, fc) {
        this.formats[name.toLowerCase().trim()] = fc;
      }
    }, {
      key: "format",
      value: function format(value, _format, lng, options) {
        var _this = this;
        var formats = _format.split(this.formatSeparator);
        var result = formats.reduce(function(mem, f3) {
          var _parseFormatStr = parseFormatStr(f3), formatName = _parseFormatStr.formatName, formatOptions = _parseFormatStr.formatOptions;
          if (_this.formats[formatName]) {
            var formatted = mem;
            try {
              var valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
              var l3 = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
              formatted = _this.formats[formatName](mem, l3, _objectSpread$4(_objectSpread$4(_objectSpread$4({}, formatOptions), options), valOptions));
            } catch (error2) {
              _this.logger.warn(error2);
            }
            return formatted;
          } else {
            _this.logger.warn("there was no format function for ".concat(formatName));
          }
          return mem;
        }, value);
        return result;
      }
    }]);
    return Formatter2;
  }();
  function ownKeys$5(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$5(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys$5(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$5(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _createSuper$2(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$2();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct$2() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e3) {
      return false;
    }
  }
  function removePending(q3, name) {
    if (q3.pending[name] !== void 0) {
      delete q3.pending[name];
      q3.pendingCount--;
    }
  }
  var Connector = function(_EventEmitter) {
    _inherits(Connector2, _EventEmitter);
    var _super = _createSuper$2(Connector2);
    function Connector2(backend, store, services) {
      var _this;
      var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      _classCallCheck(this, Connector2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }
      _this.backend = backend;
      _this.store = store;
      _this.services = services;
      _this.languageUtils = services.languageUtils;
      _this.options = options;
      _this.logger = baseLogger.create("backendConnector");
      _this.waitingReads = [];
      _this.maxParallelReads = options.maxParallelReads || 10;
      _this.readingCalls = 0;
      _this.state = {};
      _this.queue = [];
      if (_this.backend && _this.backend.init) {
        _this.backend.init(services, options.backend, options);
      }
      return _this;
    }
    _createClass(Connector2, [{
      key: "queueLoad",
      value: function queueLoad(languages, namespaces, options, callback) {
        var _this2 = this;
        var toLoad = {};
        var pending = {};
        var toLoadLanguages = {};
        var toLoadNamespaces = {};
        languages.forEach(function(lng) {
          var hasAllNamespaces = true;
          namespaces.forEach(function(ns2) {
            var name = "".concat(lng, "|").concat(ns2);
            if (!options.reload && _this2.store.hasResourceBundle(lng, ns2)) {
              _this2.state[name] = 2;
            } else if (_this2.state[name] < 0)
              ;
            else if (_this2.state[name] === 1) {
              if (pending[name] === void 0)
                pending[name] = true;
            } else {
              _this2.state[name] = 1;
              hasAllNamespaces = false;
              if (pending[name] === void 0)
                pending[name] = true;
              if (toLoad[name] === void 0)
                toLoad[name] = true;
              if (toLoadNamespaces[ns2] === void 0)
                toLoadNamespaces[ns2] = true;
            }
          });
          if (!hasAllNamespaces)
            toLoadLanguages[lng] = true;
        });
        if (Object.keys(toLoad).length || Object.keys(pending).length) {
          this.queue.push({
            pending,
            pendingCount: Object.keys(pending).length,
            loaded: {},
            errors: [],
            callback
          });
        }
        return {
          toLoad: Object.keys(toLoad),
          pending: Object.keys(pending),
          toLoadLanguages: Object.keys(toLoadLanguages),
          toLoadNamespaces: Object.keys(toLoadNamespaces)
        };
      }
    }, {
      key: "loaded",
      value: function loaded(name, err, data) {
        var s3 = name.split("|");
        var lng = s3[0];
        var ns2 = s3[1];
        if (err)
          this.emit("failedLoading", lng, ns2, err);
        if (data) {
          this.store.addResourceBundle(lng, ns2, data);
        }
        this.state[name] = err ? -1 : 2;
        var loaded2 = {};
        this.queue.forEach(function(q3) {
          pushPath(q3.loaded, [lng], ns2);
          removePending(q3, name);
          if (err)
            q3.errors.push(err);
          if (q3.pendingCount === 0 && !q3.done) {
            Object.keys(q3.loaded).forEach(function(l3) {
              if (!loaded2[l3])
                loaded2[l3] = {};
              var loadedKeys = q3.loaded[l3];
              if (loadedKeys.length) {
                loadedKeys.forEach(function(ns3) {
                  if (loaded2[l3][ns3] === void 0)
                    loaded2[l3][ns3] = true;
                });
              }
            });
            q3.done = true;
            if (q3.errors.length) {
              q3.callback(q3.errors);
            } else {
              q3.callback();
            }
          }
        });
        this.emit("loaded", loaded2);
        this.queue = this.queue.filter(function(q3) {
          return !q3.done;
        });
      }
    }, {
      key: "read",
      value: function read(lng, ns2, fcName) {
        var _this3 = this;
        var tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
        var wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 350;
        var callback = arguments.length > 5 ? arguments[5] : void 0;
        if (!lng.length)
          return callback(null, {});
        if (this.readingCalls >= this.maxParallelReads) {
          this.waitingReads.push({
            lng,
            ns: ns2,
            fcName,
            tried,
            wait,
            callback
          });
          return;
        }
        this.readingCalls++;
        return this.backend[fcName](lng, ns2, function(err, data) {
          if (err && data && tried < 5) {
            setTimeout(function() {
              _this3.read.call(_this3, lng, ns2, fcName, tried + 1, wait * 2, callback);
            }, wait);
            return;
          }
          _this3.readingCalls--;
          if (_this3.waitingReads.length > 0) {
            var next = _this3.waitingReads.shift();
            _this3.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
          }
          callback(err, data);
        });
      }
    }, {
      key: "prepareLoading",
      value: function prepareLoading(languages, namespaces) {
        var _this4 = this;
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var callback = arguments.length > 3 ? arguments[3] : void 0;
        if (!this.backend) {
          this.logger.warn("No backend was added via i18next.use. Will not load resources.");
          return callback && callback();
        }
        if (typeof languages === "string")
          languages = this.languageUtils.toResolveHierarchy(languages);
        if (typeof namespaces === "string")
          namespaces = [namespaces];
        var toLoad = this.queueLoad(languages, namespaces, options, callback);
        if (!toLoad.toLoad.length) {
          if (!toLoad.pending.length)
            callback();
          return null;
        }
        toLoad.toLoad.forEach(function(name) {
          _this4.loadOne(name);
        });
      }
    }, {
      key: "load",
      value: function load(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {}, callback);
      }
    }, {
      key: "reload",
      value: function reload(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {
          reload: true
        }, callback);
      }
    }, {
      key: "loadOne",
      value: function loadOne(name) {
        var _this5 = this;
        var prefix2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
        var s3 = name.split("|");
        var lng = s3[0];
        var ns2 = s3[1];
        this.read(lng, ns2, "read", void 0, void 0, function(err, data) {
          if (err)
            _this5.logger.warn("".concat(prefix2, "loading namespace ").concat(ns2, " for language ").concat(lng, " failed"), err);
          if (!err && data)
            _this5.logger.log("".concat(prefix2, "loaded namespace ").concat(ns2, " for language ").concat(lng), data);
          _this5.loaded(name, err, data);
        });
      }
    }, {
      key: "saveMissing",
      value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
        var options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
        if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
          this.logger.warn('did not save key "'.concat(key, '" as the namespace "').concat(namespace, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
          return;
        }
        if (key === void 0 || key === null || key === "")
          return;
        if (this.backend && this.backend.create) {
          this.backend.create(languages, namespace, key, fallbackValue, null, _objectSpread$5(_objectSpread$5({}, options), {}, {
            isUpdate
          }));
        }
        if (!languages || !languages[0])
          return;
        this.store.addResource(languages[0], namespace, key, fallbackValue);
      }
    }]);
    return Connector2;
  }(EventEmitter);
  function get() {
    return {
      debug: false,
      initImmediate: true,
      ns: ["translation"],
      defaultNS: ["translation"],
      fallbackLng: ["dev"],
      fallbackNS: false,
      supportedLngs: false,
      nonExplicitSupportedLngs: false,
      load: "all",
      preload: false,
      simplifyPluralSuffix: true,
      keySeparator: ".",
      nsSeparator: ":",
      pluralSeparator: "_",
      contextSeparator: "_",
      partialBundledLanguages: false,
      saveMissing: false,
      updateMissing: false,
      saveMissingTo: "fallback",
      saveMissingPlurals: true,
      missingKeyHandler: false,
      missingInterpolationHandler: false,
      postProcess: false,
      postProcessPassResolved: false,
      returnNull: true,
      returnEmptyString: true,
      returnObjects: false,
      joinArrays: false,
      returnedObjectHandler: false,
      parseMissingKeyHandler: false,
      appendNamespaceToMissingKey: false,
      appendNamespaceToCIMode: false,
      overloadTranslationOptionHandler: function handle2(args) {
        var ret = {};
        if (_typeof(args[1]) === "object")
          ret = args[1];
        if (typeof args[1] === "string")
          ret.defaultValue = args[1];
        if (typeof args[2] === "string")
          ret.tDescription = args[2];
        if (_typeof(args[2]) === "object" || _typeof(args[3]) === "object") {
          var options = args[3] || args[2];
          Object.keys(options).forEach(function(key) {
            ret[key] = options[key];
          });
        }
        return ret;
      },
      interpolation: {
        escapeValue: true,
        format: function format(value, _format, lng, options) {
          return value;
        },
        prefix: "{{",
        suffix: "}}",
        formatSeparator: ",",
        unescapePrefix: "-",
        nestingPrefix: "$t(",
        nestingSuffix: ")",
        nestingOptionsSeparator: ",",
        maxReplaces: 1e3,
        skipOnVariables: true
      }
    };
  }
  function transformOptions(options) {
    if (typeof options.ns === "string")
      options.ns = [options.ns];
    if (typeof options.fallbackLng === "string")
      options.fallbackLng = [options.fallbackLng];
    if (typeof options.fallbackNS === "string")
      options.fallbackNS = [options.fallbackNS];
    if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) {
      options.supportedLngs = options.supportedLngs.concat(["cimode"]);
    }
    return options;
  }
  function ownKeys$6(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$6(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys$6(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$6(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _createSuper$3(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$3();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _isNativeReflectConstruct$3() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e3) {
      return false;
    }
  }
  function noop() {
  }
  function bindMemberFunctions(inst) {
    var mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
    mems.forEach(function(mem) {
      if (typeof inst[mem] === "function") {
        inst[mem] = inst[mem].bind(inst);
      }
    });
  }
  var I18n = function(_EventEmitter) {
    _inherits(I18n2, _EventEmitter);
    var _super = _createSuper$3(I18n2);
    function I18n2() {
      var _this;
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : void 0;
      _classCallCheck(this, I18n2);
      _this = _super.call(this);
      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }
      _this.options = transformOptions(options);
      _this.services = {};
      _this.logger = baseLogger;
      _this.modules = {
        external: []
      };
      bindMemberFunctions(_assertThisInitialized(_this));
      if (callback && !_this.isInitialized && !options.isClone) {
        if (!_this.options.initImmediate) {
          _this.init(options, callback);
          return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
        }
        setTimeout(function() {
          _this.init(options, callback);
        }, 0);
      }
      return _this;
    }
    _createClass(I18n2, [{
      key: "init",
      value: function init3() {
        var _this2 = this;
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var callback = arguments.length > 1 ? arguments[1] : void 0;
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        if (!options.defaultNS && options.ns) {
          if (typeof options.ns === "string") {
            options.defaultNS = options.ns;
          } else if (options.ns.indexOf("translation") < 0) {
            options.defaultNS = options.ns[0];
          }
        }
        var defOpts = get();
        this.options = _objectSpread$6(_objectSpread$6(_objectSpread$6({}, defOpts), this.options), transformOptions(options));
        if (this.options.compatibilityAPI !== "v1") {
          this.options.interpolation = _objectSpread$6(_objectSpread$6({}, defOpts.interpolation), this.options.interpolation);
        }
        if (options.keySeparator !== void 0) {
          this.options.userDefinedKeySeparator = options.keySeparator;
        }
        if (options.nsSeparator !== void 0) {
          this.options.userDefinedNsSeparator = options.nsSeparator;
        }
        function createClassOnDemand(ClassOrObject) {
          if (!ClassOrObject)
            return null;
          if (typeof ClassOrObject === "function")
            return new ClassOrObject();
          return ClassOrObject;
        }
        if (!this.options.isClone) {
          if (this.modules.logger) {
            baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
          } else {
            baseLogger.init(null, this.options);
          }
          var formatter;
          if (this.modules.formatter) {
            formatter = this.modules.formatter;
          } else if (typeof Intl !== "undefined") {
            formatter = Formatter;
          }
          var lu = new LanguageUtil(this.options);
          this.store = new ResourceStore(this.options.resources, this.options);
          var s3 = this.services;
          s3.logger = baseLogger;
          s3.resourceStore = this.store;
          s3.languageUtils = lu;
          s3.pluralResolver = new PluralResolver(lu, {
            prepend: this.options.pluralSeparator,
            compatibilityJSON: this.options.compatibilityJSON,
            simplifyPluralSuffix: this.options.simplifyPluralSuffix
          });
          if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
            s3.formatter = createClassOnDemand(formatter);
            s3.formatter.init(s3, this.options);
            this.options.interpolation.format = s3.formatter.format.bind(s3.formatter);
          }
          s3.interpolator = new Interpolator(this.options);
          s3.utils = {
            hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
          };
          s3.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s3.resourceStore, s3, this.options);
          s3.backendConnector.on("*", function(event) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            _this2.emit.apply(_this2, [event].concat(args));
          });
          if (this.modules.languageDetector) {
            s3.languageDetector = createClassOnDemand(this.modules.languageDetector);
            s3.languageDetector.init(s3, this.options.detection, this.options);
          }
          if (this.modules.i18nFormat) {
            s3.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
            if (s3.i18nFormat.init)
              s3.i18nFormat.init(this);
          }
          this.translator = new Translator(this.services, this.options);
          this.translator.on("*", function(event) {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            _this2.emit.apply(_this2, [event].concat(args));
          });
          this.modules.external.forEach(function(m3) {
            if (m3.init)
              m3.init(_this2);
          });
        }
        this.format = this.options.interpolation.format;
        if (!callback)
          callback = noop;
        if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
          var codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          if (codes.length > 0 && codes[0] !== "dev")
            this.options.lng = codes[0];
        }
        if (!this.services.languageDetector && !this.options.lng) {
          this.logger.warn("init: no languageDetector is used and no lng is defined");
        }
        var storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
        storeApi.forEach(function(fcName) {
          _this2[fcName] = function() {
            var _this2$store;
            return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
          };
        });
        var storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
        storeApiChained.forEach(function(fcName) {
          _this2[fcName] = function() {
            var _this2$store2;
            (_this2$store2 = _this2.store)[fcName].apply(_this2$store2, arguments);
            return _this2;
          };
        });
        var deferred = defer();
        var load = function load2() {
          var finish = function finish2(err, t4) {
            if (_this2.isInitialized && !_this2.initializedStoreOnce)
              _this2.logger.warn("init: i18next is already initialized. You should call init just once!");
            _this2.isInitialized = true;
            if (!_this2.options.isClone)
              _this2.logger.log("initialized", _this2.options);
            _this2.emit("initialized", _this2.options);
            deferred.resolve(t4);
            callback(err, t4);
          };
          if (_this2.languages && _this2.options.compatibilityAPI !== "v1" && !_this2.isInitialized)
            return finish(null, _this2.t.bind(_this2));
          _this2.changeLanguage(_this2.options.lng, finish);
        };
        if (this.options.resources || !this.options.initImmediate) {
          load();
        } else {
          setTimeout(load, 0);
        }
        return deferred;
      }
    }, {
      key: "loadResources",
      value: function loadResources2(language) {
        var _this3 = this;
        var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
        var usedCallback = callback;
        var usedLng = typeof language === "string" ? language : this.language;
        if (typeof language === "function")
          usedCallback = language;
        if (!this.options.resources || this.options.partialBundledLanguages) {
          if (usedLng && usedLng.toLowerCase() === "cimode")
            return usedCallback();
          var toLoad = [];
          var append = function append2(lng) {
            if (!lng)
              return;
            var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);
            lngs.forEach(function(l3) {
              if (toLoad.indexOf(l3) < 0)
                toLoad.push(l3);
            });
          };
          if (!usedLng) {
            var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            fallbacks.forEach(function(l3) {
              return append(l3);
            });
          } else {
            append(usedLng);
          }
          if (this.options.preload) {
            this.options.preload.forEach(function(l3) {
              return append(l3);
            });
          }
          this.services.backendConnector.load(toLoad, this.options.ns, function(e3) {
            if (!e3 && !_this3.resolvedLanguage && _this3.language)
              _this3.setResolvedLanguage(_this3.language);
            usedCallback(e3);
          });
        } else {
          usedCallback(null);
        }
      }
    }, {
      key: "reloadResources",
      value: function reloadResources2(lngs, ns2, callback) {
        var deferred = defer();
        if (!lngs)
          lngs = this.languages;
        if (!ns2)
          ns2 = this.options.ns;
        if (!callback)
          callback = noop;
        this.services.backendConnector.reload(lngs, ns2, function(err) {
          deferred.resolve();
          callback(err);
        });
        return deferred;
      }
    }, {
      key: "use",
      value: function use2(module) {
        if (!module)
          throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
        if (!module.type)
          throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
        if (module.type === "backend") {
          this.modules.backend = module;
        }
        if (module.type === "logger" || module.log && module.warn && module.error) {
          this.modules.logger = module;
        }
        if (module.type === "languageDetector") {
          this.modules.languageDetector = module;
        }
        if (module.type === "i18nFormat") {
          this.modules.i18nFormat = module;
        }
        if (module.type === "postProcessor") {
          postProcessor.addPostProcessor(module);
        }
        if (module.type === "formatter") {
          this.modules.formatter = module;
        }
        if (module.type === "3rdParty") {
          this.modules.external.push(module);
        }
        return this;
      }
    }, {
      key: "setResolvedLanguage",
      value: function setResolvedLanguage(l3) {
        if (!l3 || !this.languages)
          return;
        if (["cimode", "dev"].indexOf(l3) > -1)
          return;
        for (var li = 0; li < this.languages.length; li++) {
          var lngInLngs = this.languages[li];
          if (["cimode", "dev"].indexOf(lngInLngs) > -1)
            continue;
          if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
            this.resolvedLanguage = lngInLngs;
            break;
          }
        }
      }
    }, {
      key: "changeLanguage",
      value: function changeLanguage2(lng, callback) {
        var _this4 = this;
        this.isLanguageChangingTo = lng;
        var deferred = defer();
        this.emit("languageChanging", lng);
        var setLngProps = function setLngProps2(l3) {
          _this4.language = l3;
          _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l3);
          _this4.resolvedLanguage = void 0;
          _this4.setResolvedLanguage(l3);
        };
        var done = function done2(err, l3) {
          if (l3) {
            setLngProps(l3);
            _this4.translator.changeLanguage(l3);
            _this4.isLanguageChangingTo = void 0;
            _this4.emit("languageChanged", l3);
            _this4.logger.log("languageChanged", l3);
          } else {
            _this4.isLanguageChangingTo = void 0;
          }
          deferred.resolve(function() {
            return _this4.t.apply(_this4, arguments);
          });
          if (callback)
            callback(err, function() {
              return _this4.t.apply(_this4, arguments);
            });
        };
        var setLng = function setLng2(lngs) {
          if (!lng && !lngs && _this4.services.languageDetector)
            lngs = [];
          var l3 = typeof lngs === "string" ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);
          if (l3) {
            if (!_this4.language) {
              setLngProps(l3);
            }
            if (!_this4.translator.language)
              _this4.translator.changeLanguage(l3);
            if (_this4.services.languageDetector)
              _this4.services.languageDetector.cacheUserLanguage(l3);
          }
          _this4.loadResources(l3, function(err) {
            done(err, l3);
          });
        };
        if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
          setLng(this.services.languageDetector.detect());
        } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
          this.services.languageDetector.detect(setLng);
        } else {
          setLng(lng);
        }
        return deferred;
      }
    }, {
      key: "getFixedT",
      value: function getFixedT2(lng, ns2, keyPrefix) {
        var _this5 = this;
        var fixedT = function fixedT2(key, opts) {
          var options;
          if (_typeof(opts) !== "object") {
            for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
              rest[_key3 - 2] = arguments[_key3];
            }
            options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
          } else {
            options = _objectSpread$6({}, opts);
          }
          options.lng = options.lng || fixedT2.lng;
          options.lngs = options.lngs || fixedT2.lngs;
          options.ns = options.ns || fixedT2.ns;
          var keySeparator = _this5.options.keySeparator || ".";
          var resultKey = keyPrefix ? "".concat(keyPrefix).concat(keySeparator).concat(key) : key;
          return _this5.t(resultKey, options);
        };
        if (typeof lng === "string") {
          fixedT.lng = lng;
        } else {
          fixedT.lngs = lng;
        }
        fixedT.ns = ns2;
        fixedT.keyPrefix = keyPrefix;
        return fixedT;
      }
    }, {
      key: "t",
      value: function t4() {
        var _this$translator;
        return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
      }
    }, {
      key: "exists",
      value: function exists2() {
        var _this$translator2;
        return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
      }
    }, {
      key: "setDefaultNamespace",
      value: function setDefaultNamespace2(ns2) {
        this.options.defaultNS = ns2;
      }
    }, {
      key: "hasLoadedNamespace",
      value: function hasLoadedNamespace2(ns2) {
        var _this6 = this;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (!this.isInitialized) {
          this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
          return false;
        }
        if (!this.languages || !this.languages.length) {
          this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
          return false;
        }
        var lng = this.resolvedLanguage || this.languages[0];
        var fallbackLng = this.options ? this.options.fallbackLng : false;
        var lastLng = this.languages[this.languages.length - 1];
        if (lng.toLowerCase() === "cimode")
          return true;
        var loadNotPending = function loadNotPending2(l3, n2) {
          var loadState = _this6.services.backendConnector.state["".concat(l3, "|").concat(n2)];
          return loadState === -1 || loadState === 2;
        };
        if (options.precheck) {
          var preResult = options.precheck(this, loadNotPending);
          if (preResult !== void 0)
            return preResult;
        }
        if (this.hasResourceBundle(lng, ns2))
          return true;
        if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages)
          return true;
        if (loadNotPending(lng, ns2) && (!fallbackLng || loadNotPending(lastLng, ns2)))
          return true;
        return false;
      }
    }, {
      key: "loadNamespaces",
      value: function loadNamespaces2(ns2, callback) {
        var _this7 = this;
        var deferred = defer();
        if (!this.options.ns) {
          callback && callback();
          return Promise.resolve();
        }
        if (typeof ns2 === "string")
          ns2 = [ns2];
        ns2.forEach(function(n2) {
          if (_this7.options.ns.indexOf(n2) < 0)
            _this7.options.ns.push(n2);
        });
        this.loadResources(function(err) {
          deferred.resolve();
          if (callback)
            callback(err);
        });
        return deferred;
      }
    }, {
      key: "loadLanguages",
      value: function loadLanguages2(lngs, callback) {
        var deferred = defer();
        if (typeof lngs === "string")
          lngs = [lngs];
        var preloaded = this.options.preload || [];
        var newLngs = lngs.filter(function(lng) {
          return preloaded.indexOf(lng) < 0;
        });
        if (!newLngs.length) {
          if (callback)
            callback();
          return Promise.resolve();
        }
        this.options.preload = preloaded.concat(newLngs);
        this.loadResources(function(err) {
          deferred.resolve();
          if (callback)
            callback(err);
        });
        return deferred;
      }
    }, {
      key: "dir",
      value: function dir(lng) {
        if (!lng)
          lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
        if (!lng)
          return "rtl";
        var rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
        return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
      }
    }, {
      key: "cloneInstance",
      value: function cloneInstance() {
        var _this8 = this;
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
        var mergedOptions = _objectSpread$6(_objectSpread$6(_objectSpread$6({}, this.options), options), {
          isClone: true
        });
        var clone = new I18n2(mergedOptions);
        var membersToCopy = ["store", "services", "language"];
        membersToCopy.forEach(function(m3) {
          clone[m3] = _this8[m3];
        });
        clone.services = _objectSpread$6({}, this.services);
        clone.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        clone.translator = new Translator(clone.services, clone.options);
        clone.translator.on("*", function(event) {
          for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
          }
          clone.emit.apply(clone, [event].concat(args));
        });
        clone.init(mergedOptions, callback);
        clone.translator.options = clone.options;
        clone.translator.backendConnector.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        return clone;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          options: this.options,
          store: this.store,
          language: this.language,
          languages: this.languages,
          resolvedLanguage: this.resolvedLanguage
        };
      }
    }]);
    return I18n2;
  }(EventEmitter);
  _defineProperty(I18n, "createInstance", function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : void 0;
    return new I18n(options, callback);
  });
  var instance = I18n.createInstance();
  instance.createInstance = I18n.createInstance;
  var createInstance = instance.createInstance;
  var init = instance.init;
  var loadResources = instance.loadResources;
  var reloadResources = instance.reloadResources;
  var use = instance.use;
  var changeLanguage = instance.changeLanguage;
  var getFixedT = instance.getFixedT;
  var t3 = instance.t;
  var exists = instance.exists;
  var setDefaultNamespace = instance.setDefaultNamespace;
  var hasLoadedNamespace = instance.hasLoadedNamespace;
  var loadNamespaces = instance.loadNamespaces;
  var loadLanguages = instance.loadLanguages;
  var i18next_default = instance;

  // node_modules/i18next-icu/dist/es/utils.js
  function getLastOfPath2(object, path, Empty) {
    function cleanKey(key2) {
      return key2 && key2.indexOf("###") > -1 ? key2.replace(/###/g, ".") : key2;
    }
    function canNotTraverseDeeper() {
      return !object || typeof object === "string";
    }
    var stack = typeof path !== "string" ? [].concat(path) : path.split(".");
    while (stack.length > 1) {
      if (canNotTraverseDeeper())
        return {};
      var key = cleanKey(stack.shift());
      if (!object[key] && Empty)
        object[key] = new Empty();
      object = object[key];
    }
    if (canNotTraverseDeeper())
      return {};
    return {
      obj: object,
      k: cleanKey(stack.shift())
    };
  }
  function setPath2(object, path, newValue) {
    var _getLastOfPath = getLastOfPath2(object, path, Object), obj = _getLastOfPath.obj, k3 = _getLastOfPath.k;
    obj[k3] = newValue;
  }
  function getPath2(object, path) {
    var _getLastOfPath3 = getLastOfPath2(object, path), obj = _getLastOfPath3.obj, k3 = _getLastOfPath3.k;
    if (!obj)
      return void 0;
    return obj[k3];
  }
  var arr = [];
  var each = arr.forEach;
  var slice = arr.slice;
  function defaults(obj) {
    each.call(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0)
            obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }

  // node_modules/tslib/tslib.es6.js
  var extendStatics = function(d3, b3) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d4, b4) {
      d4.__proto__ = b4;
    } || function(d4, b4) {
      for (var p3 in b4)
        if (Object.prototype.hasOwnProperty.call(b4, p3))
          d4[p3] = b4[p3];
    };
    return extendStatics(d3, b3);
  };
  function __extends(d3, b3) {
    if (typeof b3 !== "function" && b3 !== null)
      throw new TypeError("Class extends value " + String(b3) + " is not a constructor or null");
    extendStatics(d3, b3);
    function __() {
      this.constructor = d3;
    }
    d3.prototype = b3 === null ? Object.create(b3) : (__.prototype = b3.prototype, new __());
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t4) {
      for (var s3, i3 = 1, n2 = arguments.length; i3 < n2; i3++) {
        s3 = arguments[i3];
        for (var p3 in s3)
          if (Object.prototype.hasOwnProperty.call(s3, p3))
            t4[p3] = s3[p3];
      }
      return t4;
    };
    return __assign.apply(this, arguments);
  };
  function __values(o3) {
    var s3 = typeof Symbol === "function" && Symbol.iterator, m3 = s3 && o3[s3], i3 = 0;
    if (m3)
      return m3.call(o3);
    if (o3 && typeof o3.length === "number")
      return {
        next: function() {
          if (o3 && i3 >= o3.length)
            o3 = void 0;
          return { value: o3 && o3[i3++], done: !o3 };
        }
      };
    throw new TypeError(s3 ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o3, n2) {
    var m3 = typeof Symbol === "function" && o3[Symbol.iterator];
    if (!m3)
      return o3;
    var i3 = m3.call(o3), r3, ar = [], e3;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r3 = i3.next()).done)
        ar.push(r3.value);
    } catch (error2) {
      e3 = { error: error2 };
    } finally {
      try {
        if (r3 && !r3.done && (m3 = i3["return"]))
          m3.call(i3);
      } finally {
        if (e3)
          throw e3.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i3 = 0, l3 = from.length, ar; i3 < l3; i3++) {
        if (ar || !(i3 in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i3);
          ar[i3] = from[i3];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  // node_modules/@formatjs/icu-messageformat-parser/lib/error.js
  var ErrorKind;
  (function(ErrorKind2) {
    ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
    ErrorKind2[ErrorKind2["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
    ErrorKind2[ErrorKind2["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
    ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
    ErrorKind2[ErrorKind2["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
    ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
    ErrorKind2[ErrorKind2["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
    ErrorKind2[ErrorKind2["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
    ErrorKind2[ErrorKind2["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
    ErrorKind2[ErrorKind2["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
    ErrorKind2[ErrorKind2["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
    ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
    ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
    ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
    ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
    ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
    ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
    ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
    ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
    ErrorKind2[ErrorKind2["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
    ErrorKind2[ErrorKind2["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
    ErrorKind2[ErrorKind2["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
    ErrorKind2[ErrorKind2["INVALID_TAG"] = 23] = "INVALID_TAG";
    ErrorKind2[ErrorKind2["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
    ErrorKind2[ErrorKind2["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
    ErrorKind2[ErrorKind2["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
  })(ErrorKind || (ErrorKind = {}));

  // node_modules/@formatjs/icu-messageformat-parser/lib/types.js
  var TYPE;
  (function(TYPE2) {
    TYPE2[TYPE2["literal"] = 0] = "literal";
    TYPE2[TYPE2["argument"] = 1] = "argument";
    TYPE2[TYPE2["number"] = 2] = "number";
    TYPE2[TYPE2["date"] = 3] = "date";
    TYPE2[TYPE2["time"] = 4] = "time";
    TYPE2[TYPE2["select"] = 5] = "select";
    TYPE2[TYPE2["plural"] = 6] = "plural";
    TYPE2[TYPE2["pound"] = 7] = "pound";
    TYPE2[TYPE2["tag"] = 8] = "tag";
  })(TYPE || (TYPE = {}));
  var SKELETON_TYPE;
  (function(SKELETON_TYPE2) {
    SKELETON_TYPE2[SKELETON_TYPE2["number"] = 0] = "number";
    SKELETON_TYPE2[SKELETON_TYPE2["dateTime"] = 1] = "dateTime";
  })(SKELETON_TYPE || (SKELETON_TYPE = {}));
  function isLiteralElement(el) {
    return el.type === TYPE.literal;
  }
  function isArgumentElement(el) {
    return el.type === TYPE.argument;
  }
  function isNumberElement(el) {
    return el.type === TYPE.number;
  }
  function isDateElement(el) {
    return el.type === TYPE.date;
  }
  function isTimeElement(el) {
    return el.type === TYPE.time;
  }
  function isSelectElement(el) {
    return el.type === TYPE.select;
  }
  function isPluralElement(el) {
    return el.type === TYPE.plural;
  }
  function isPoundElement(el) {
    return el.type === TYPE.pound;
  }
  function isTagElement(el) {
    return el.type === TYPE.tag;
  }
  function isNumberSkeleton(el) {
    return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.number);
  }
  function isDateTimeSkeleton(el) {
    return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.dateTime);
  }

  // node_modules/@formatjs/icu-messageformat-parser/lib/regex.generated.js
  var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;

  // node_modules/@formatjs/icu-skeleton-parser/lib/date-time.js
  var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
  function parseDateTimeSkeleton(skeleton) {
    var result = {};
    skeleton.replace(DATE_TIME_REGEX, function(match) {
      var len = match.length;
      switch (match[0]) {
        case "G":
          result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
          break;
        case "y":
          result.year = len === 2 ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
        case "q":
        case "Q":
          throw new RangeError("`q/Q` (quarter) patterns are not supported");
        case "M":
        case "L":
          result.month = ["numeric", "2-digit", "short", "long", "narrow"][len - 1];
          break;
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          result.day = ["numeric", "2-digit"][len - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
        case "E":
          result.weekday = len === 4 ? "short" : len === 5 ? "narrow" : "short";
          break;
        case "e":
          if (len < 4) {
            throw new RangeError("`e..eee` (weekday) patterns are not supported");
          }
          result.weekday = ["short", "long", "narrow", "short"][len - 4];
          break;
        case "c":
          if (len < 4) {
            throw new RangeError("`c..ccc` (weekday) patterns are not supported");
          }
          result.weekday = ["short", "long", "narrow", "short"][len - 4];
          break;
        case "a":
          result.hour12 = true;
          break;
        case "b":
        case "B":
          throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
        case "h":
          result.hourCycle = "h12";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "H":
          result.hourCycle = "h23";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "K":
          result.hourCycle = "h11";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "k":
          result.hourCycle = "h24";
          result.hour = ["numeric", "2-digit"][len - 1];
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
        case "m":
          result.minute = ["numeric", "2-digit"][len - 1];
          break;
        case "s":
          result.second = ["numeric", "2-digit"][len - 1];
          break;
        case "S":
        case "A":
          throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
        case "z":
          result.timeZoneName = len < 4 ? "short" : "long";
          break;
        case "Z":
        case "O":
        case "v":
        case "V":
        case "X":
        case "x":
          throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
      }
      return "";
    });
    return result;
  }

  // node_modules/@formatjs/icu-skeleton-parser/lib/regex.generated.js
  var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;

  // node_modules/@formatjs/icu-skeleton-parser/lib/number.js
  function parseNumberSkeletonFromString(skeleton) {
    if (skeleton.length === 0) {
      throw new Error("Number skeleton cannot be empty");
    }
    var stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter(function(x2) {
      return x2.length > 0;
    });
    var tokens = [];
    for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
      var stringToken = stringTokens_1[_i];
      var stemAndOptions = stringToken.split("/");
      if (stemAndOptions.length === 0) {
        throw new Error("Invalid number skeleton");
      }
      var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
      for (var _a2 = 0, options_1 = options; _a2 < options_1.length; _a2++) {
        var option = options_1[_a2];
        if (option.length === 0) {
          throw new Error("Invalid number skeleton");
        }
      }
      tokens.push({ stem, options });
    }
    return tokens;
  }
  function icuUnitToEcma(unit) {
    return unit.replace(/^(.*?)-/, "");
  }
  var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
  var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?[rs]?$/g;
  var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
  var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
  function parseSignificantPrecision(str) {
    var result = {};
    if (str[str.length - 1] === "r") {
      result.roundingPriority = "morePrecision";
    } else if (str[str.length - 1] === "s") {
      result.roundingPriority = "lessPrecision";
    }
    str.replace(SIGNIFICANT_PRECISION_REGEX, function(_24, g1, g22) {
      if (typeof g22 !== "string") {
        result.minimumSignificantDigits = g1.length;
        result.maximumSignificantDigits = g1.length;
      } else if (g22 === "+") {
        result.minimumSignificantDigits = g1.length;
      } else if (g1[0] === "#") {
        result.maximumSignificantDigits = g1.length;
      } else {
        result.minimumSignificantDigits = g1.length;
        result.maximumSignificantDigits = g1.length + (typeof g22 === "string" ? g22.length : 0);
      }
      return "";
    });
    return result;
  }
  function parseSign(str) {
    switch (str) {
      case "sign-auto":
        return {
          signDisplay: "auto"
        };
      case "sign-accounting":
      case "()":
        return {
          currencySign: "accounting"
        };
      case "sign-always":
      case "+!":
        return {
          signDisplay: "always"
        };
      case "sign-accounting-always":
      case "()!":
        return {
          signDisplay: "always",
          currencySign: "accounting"
        };
      case "sign-except-zero":
      case "+?":
        return {
          signDisplay: "exceptZero"
        };
      case "sign-accounting-except-zero":
      case "()?":
        return {
          signDisplay: "exceptZero",
          currencySign: "accounting"
        };
      case "sign-never":
      case "+_":
        return {
          signDisplay: "never"
        };
    }
  }
  function parseConciseScientificAndEngineeringStem(stem) {
    var result;
    if (stem[0] === "E" && stem[1] === "E") {
      result = {
        notation: "engineering"
      };
      stem = stem.slice(2);
    } else if (stem[0] === "E") {
      result = {
        notation: "scientific"
      };
      stem = stem.slice(1);
    }
    if (result) {
      var signDisplay = stem.slice(0, 2);
      if (signDisplay === "+!") {
        result.signDisplay = "always";
        stem = stem.slice(2);
      } else if (signDisplay === "+?") {
        result.signDisplay = "exceptZero";
        stem = stem.slice(2);
      }
      if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
        throw new Error("Malformed concise eng/scientific notation");
      }
      result.minimumIntegerDigits = stem.length;
    }
    return result;
  }
  function parseNotationOptions(opt) {
    var result = {};
    var signOpts = parseSign(opt);
    if (signOpts) {
      return signOpts;
    }
    return result;
  }
  function parseNumberSkeleton(tokens) {
    var result = {};
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];
      switch (token.stem) {
        case "percent":
        case "%":
          result.style = "percent";
          continue;
        case "%x100":
          result.style = "percent";
          result.scale = 100;
          continue;
        case "currency":
          result.style = "currency";
          result.currency = token.options[0];
          continue;
        case "group-off":
        case ",_":
          result.useGrouping = false;
          continue;
        case "precision-integer":
        case ".":
          result.maximumFractionDigits = 0;
          continue;
        case "measure-unit":
        case "unit":
          result.style = "unit";
          result.unit = icuUnitToEcma(token.options[0]);
          continue;
        case "compact-short":
        case "K":
          result.notation = "compact";
          result.compactDisplay = "short";
          continue;
        case "compact-long":
        case "KK":
          result.notation = "compact";
          result.compactDisplay = "long";
          continue;
        case "scientific":
          result = __assign(__assign(__assign({}, result), { notation: "scientific" }), token.options.reduce(function(all, opt2) {
            return __assign(__assign({}, all), parseNotationOptions(opt2));
          }, {}));
          continue;
        case "engineering":
          result = __assign(__assign(__assign({}, result), { notation: "engineering" }), token.options.reduce(function(all, opt2) {
            return __assign(__assign({}, all), parseNotationOptions(opt2));
          }, {}));
          continue;
        case "notation-simple":
          result.notation = "standard";
          continue;
        case "unit-width-narrow":
          result.currencyDisplay = "narrowSymbol";
          result.unitDisplay = "narrow";
          continue;
        case "unit-width-short":
          result.currencyDisplay = "code";
          result.unitDisplay = "short";
          continue;
        case "unit-width-full-name":
          result.currencyDisplay = "name";
          result.unitDisplay = "long";
          continue;
        case "unit-width-iso-code":
          result.currencyDisplay = "symbol";
          continue;
        case "scale":
          result.scale = parseFloat(token.options[0]);
          continue;
        case "integer-width":
          if (token.options.length > 1) {
            throw new RangeError("integer-width stems only accept a single optional option");
          }
          token.options[0].replace(INTEGER_WIDTH_REGEX, function(_24, g1, g22, g3, g4, g5) {
            if (g1) {
              result.minimumIntegerDigits = g22.length;
            } else if (g3 && g4) {
              throw new Error("We currently do not support maximum integer digits");
            } else if (g5) {
              throw new Error("We currently do not support exact integer digits");
            }
            return "";
          });
          continue;
      }
      if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
        result.minimumIntegerDigits = token.stem.length;
        continue;
      }
      if (FRACTION_PRECISION_REGEX.test(token.stem)) {
        if (token.options.length > 1) {
          throw new RangeError("Fraction-precision stems only accept a single optional option");
        }
        token.stem.replace(FRACTION_PRECISION_REGEX, function(_24, g1, g22, g3, g4, g5) {
          if (g22 === "*") {
            result.minimumFractionDigits = g1.length;
          } else if (g3 && g3[0] === "#") {
            result.maximumFractionDigits = g3.length;
          } else if (g4 && g5) {
            result.minimumFractionDigits = g4.length;
            result.maximumFractionDigits = g4.length + g5.length;
          } else {
            result.minimumFractionDigits = g1.length;
            result.maximumFractionDigits = g1.length;
          }
          return "";
        });
        var opt = token.options[0];
        if (opt === "w") {
          result = __assign(__assign({}, result), { trailingZeroDisplay: "stripIfInteger" });
        } else if (opt) {
          result = __assign(__assign({}, result), parseSignificantPrecision(opt));
        }
        continue;
      }
      if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
        result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
        continue;
      }
      var signOpts = parseSign(token.stem);
      if (signOpts) {
        result = __assign(__assign({}, result), signOpts);
      }
      var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
      if (conciseScientificAndEngineeringOpts) {
        result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
      }
    }
    return result;
  }

  // node_modules/@formatjs/icu-messageformat-parser/lib/time-data.generated.js
  var timeData = {
    "AX": [
      "H"
    ],
    "BQ": [
      "H"
    ],
    "CP": [
      "H"
    ],
    "CZ": [
      "H"
    ],
    "DK": [
      "H"
    ],
    "FI": [
      "H"
    ],
    "ID": [
      "H"
    ],
    "IS": [
      "H"
    ],
    "ML": [
      "H"
    ],
    "NE": [
      "H"
    ],
    "RU": [
      "H"
    ],
    "SE": [
      "H"
    ],
    "SJ": [
      "H"
    ],
    "SK": [
      "H"
    ],
    "AS": [
      "h",
      "H"
    ],
    "BT": [
      "h",
      "H"
    ],
    "DJ": [
      "h",
      "H"
    ],
    "ER": [
      "h",
      "H"
    ],
    "GH": [
      "h",
      "H"
    ],
    "IN": [
      "h",
      "H"
    ],
    "LS": [
      "h",
      "H"
    ],
    "PG": [
      "h",
      "H"
    ],
    "PW": [
      "h",
      "H"
    ],
    "SO": [
      "h",
      "H"
    ],
    "TO": [
      "h",
      "H"
    ],
    "VU": [
      "h",
      "H"
    ],
    "WS": [
      "h",
      "H"
    ],
    "001": [
      "H",
      "h"
    ],
    "AL": [
      "h",
      "H",
      "hB"
    ],
    "TD": [
      "h",
      "H",
      "hB"
    ],
    "ca-ES": [
      "H",
      "h",
      "hB"
    ],
    "CF": [
      "H",
      "h",
      "hB"
    ],
    "CM": [
      "H",
      "h",
      "hB"
    ],
    "fr-CA": [
      "H",
      "h",
      "hB"
    ],
    "gl-ES": [
      "H",
      "h",
      "hB"
    ],
    "it-CH": [
      "H",
      "h",
      "hB"
    ],
    "it-IT": [
      "H",
      "h",
      "hB"
    ],
    "LU": [
      "H",
      "h",
      "hB"
    ],
    "NP": [
      "H",
      "h",
      "hB"
    ],
    "PF": [
      "H",
      "h",
      "hB"
    ],
    "SC": [
      "H",
      "h",
      "hB"
    ],
    "SM": [
      "H",
      "h",
      "hB"
    ],
    "SN": [
      "H",
      "h",
      "hB"
    ],
    "TF": [
      "H",
      "h",
      "hB"
    ],
    "VA": [
      "H",
      "h",
      "hB"
    ],
    "CY": [
      "h",
      "H",
      "hb",
      "hB"
    ],
    "GR": [
      "h",
      "H",
      "hb",
      "hB"
    ],
    "CO": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "DO": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "KP": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "KR": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "NA": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "PA": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "PR": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "VE": [
      "h",
      "H",
      "hB",
      "hb"
    ],
    "AC": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "AI": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "BW": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "BZ": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "CC": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "CK": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "CX": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "DG": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "FK": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "GB": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "GG": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "GI": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "IE": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "IM": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "IO": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "JE": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "LT": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "MK": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "MN": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "MS": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "NF": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "NG": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "NR": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "NU": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "PN": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "SH": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "SX": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "TA": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "ZA": [
      "H",
      "h",
      "hb",
      "hB"
    ],
    "af-ZA": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "AR": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "CL": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "CR": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "CU": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "EA": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "es-BO": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "es-BR": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "es-EC": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "es-ES": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "es-GQ": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "es-PE": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "GT": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "HN": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "IC": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "KG": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "KM": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "LK": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "MA": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "MX": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "NI": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "PY": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "SV": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "UY": [
      "H",
      "h",
      "hB",
      "hb"
    ],
    "JP": [
      "H",
      "h",
      "K"
    ],
    "AD": [
      "H",
      "hB"
    ],
    "AM": [
      "H",
      "hB"
    ],
    "AO": [
      "H",
      "hB"
    ],
    "AT": [
      "H",
      "hB"
    ],
    "AW": [
      "H",
      "hB"
    ],
    "BE": [
      "H",
      "hB"
    ],
    "BF": [
      "H",
      "hB"
    ],
    "BJ": [
      "H",
      "hB"
    ],
    "BL": [
      "H",
      "hB"
    ],
    "BR": [
      "H",
      "hB"
    ],
    "CG": [
      "H",
      "hB"
    ],
    "CI": [
      "H",
      "hB"
    ],
    "CV": [
      "H",
      "hB"
    ],
    "DE": [
      "H",
      "hB"
    ],
    "EE": [
      "H",
      "hB"
    ],
    "FR": [
      "H",
      "hB"
    ],
    "GA": [
      "H",
      "hB"
    ],
    "GF": [
      "H",
      "hB"
    ],
    "GN": [
      "H",
      "hB"
    ],
    "GP": [
      "H",
      "hB"
    ],
    "GW": [
      "H",
      "hB"
    ],
    "HR": [
      "H",
      "hB"
    ],
    "IL": [
      "H",
      "hB"
    ],
    "IT": [
      "H",
      "hB"
    ],
    "KZ": [
      "H",
      "hB"
    ],
    "MC": [
      "H",
      "hB"
    ],
    "MD": [
      "H",
      "hB"
    ],
    "MF": [
      "H",
      "hB"
    ],
    "MQ": [
      "H",
      "hB"
    ],
    "MZ": [
      "H",
      "hB"
    ],
    "NC": [
      "H",
      "hB"
    ],
    "NL": [
      "H",
      "hB"
    ],
    "PM": [
      "H",
      "hB"
    ],
    "PT": [
      "H",
      "hB"
    ],
    "RE": [
      "H",
      "hB"
    ],
    "RO": [
      "H",
      "hB"
    ],
    "SI": [
      "H",
      "hB"
    ],
    "SR": [
      "H",
      "hB"
    ],
    "ST": [
      "H",
      "hB"
    ],
    "TG": [
      "H",
      "hB"
    ],
    "TR": [
      "H",
      "hB"
    ],
    "WF": [
      "H",
      "hB"
    ],
    "YT": [
      "H",
      "hB"
    ],
    "BD": [
      "h",
      "hB",
      "H"
    ],
    "PK": [
      "h",
      "hB",
      "H"
    ],
    "AZ": [
      "H",
      "hB",
      "h"
    ],
    "BA": [
      "H",
      "hB",
      "h"
    ],
    "BG": [
      "H",
      "hB",
      "h"
    ],
    "CH": [
      "H",
      "hB",
      "h"
    ],
    "GE": [
      "H",
      "hB",
      "h"
    ],
    "LI": [
      "H",
      "hB",
      "h"
    ],
    "ME": [
      "H",
      "hB",
      "h"
    ],
    "RS": [
      "H",
      "hB",
      "h"
    ],
    "UA": [
      "H",
      "hB",
      "h"
    ],
    "UZ": [
      "H",
      "hB",
      "h"
    ],
    "XK": [
      "H",
      "hB",
      "h"
    ],
    "AG": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "AU": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "BB": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "BM": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "BS": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "CA": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "DM": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "en-001": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "FJ": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "FM": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "GD": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "GM": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "GU": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "GY": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "JM": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "KI": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "KN": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "KY": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "LC": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "LR": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "MH": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "MP": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "MW": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "NZ": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "SB": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "SG": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "SL": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "SS": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "SZ": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "TC": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "TT": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "UM": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "US": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "VC": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "VG": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "VI": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "ZM": [
      "h",
      "hb",
      "H",
      "hB"
    ],
    "BO": [
      "H",
      "hB",
      "h",
      "hb"
    ],
    "EC": [
      "H",
      "hB",
      "h",
      "hb"
    ],
    "ES": [
      "H",
      "hB",
      "h",
      "hb"
    ],
    "GQ": [
      "H",
      "hB",
      "h",
      "hb"
    ],
    "PE": [
      "H",
      "hB",
      "h",
      "hb"
    ],
    "AE": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "ar-001": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "BH": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "DZ": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "EG": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "EH": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "HK": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "IQ": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "JO": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "KW": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "LB": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "LY": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "MO": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "MR": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "OM": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "PH": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "PS": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "QA": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "SA": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "SD": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "SY": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "TN": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "YE": [
      "h",
      "hB",
      "hb",
      "H"
    ],
    "AF": [
      "H",
      "hb",
      "hB",
      "h"
    ],
    "LA": [
      "H",
      "hb",
      "hB",
      "h"
    ],
    "CN": [
      "H",
      "hB",
      "hb",
      "h"
    ],
    "LV": [
      "H",
      "hB",
      "hb",
      "h"
    ],
    "TL": [
      "H",
      "hB",
      "hb",
      "h"
    ],
    "zu-ZA": [
      "H",
      "hB",
      "hb",
      "h"
    ],
    "CD": [
      "hB",
      "H"
    ],
    "IR": [
      "hB",
      "H"
    ],
    "hi-IN": [
      "hB",
      "h",
      "H"
    ],
    "kn-IN": [
      "hB",
      "h",
      "H"
    ],
    "ml-IN": [
      "hB",
      "h",
      "H"
    ],
    "te-IN": [
      "hB",
      "h",
      "H"
    ],
    "KH": [
      "hB",
      "h",
      "H",
      "hb"
    ],
    "ta-IN": [
      "hB",
      "h",
      "hb",
      "H"
    ],
    "BN": [
      "hb",
      "hB",
      "h",
      "H"
    ],
    "MY": [
      "hb",
      "hB",
      "h",
      "H"
    ],
    "ET": [
      "hB",
      "hb",
      "h",
      "H"
    ],
    "gu-IN": [
      "hB",
      "hb",
      "h",
      "H"
    ],
    "mr-IN": [
      "hB",
      "hb",
      "h",
      "H"
    ],
    "pa-IN": [
      "hB",
      "hb",
      "h",
      "H"
    ],
    "TW": [
      "hB",
      "hb",
      "h",
      "H"
    ],
    "KE": [
      "hB",
      "hb",
      "H",
      "h"
    ],
    "MM": [
      "hB",
      "hb",
      "H",
      "h"
    ],
    "TZ": [
      "hB",
      "hb",
      "H",
      "h"
    ],
    "UG": [
      "hB",
      "hb",
      "H",
      "h"
    ]
  };

  // node_modules/@formatjs/icu-messageformat-parser/lib/date-time-pattern-generator.js
  function getBestPattern(skeleton, locale3) {
    var skeletonCopy = "";
    for (var patternPos = 0; patternPos < skeleton.length; patternPos++) {
      var patternChar = skeleton.charAt(patternPos);
      if (patternChar === "j") {
        var extraLength = 0;
        while (patternPos + 1 < skeleton.length && skeleton.charAt(patternPos + 1) === patternChar) {
          extraLength++;
          patternPos++;
        }
        var hourLen = 1 + (extraLength & 1);
        var dayPeriodLen = extraLength < 2 ? 1 : 3 + (extraLength >> 1);
        var dayPeriodChar = "a";
        var hourChar = getDefaultHourSymbolFromLocale(locale3);
        if (hourChar == "H" || hourChar == "k") {
          dayPeriodLen = 0;
        }
        while (dayPeriodLen-- > 0) {
          skeletonCopy += dayPeriodChar;
        }
        while (hourLen-- > 0) {
          skeletonCopy = hourChar + skeletonCopy;
        }
      } else if (patternChar === "J") {
        skeletonCopy += "H";
      } else {
        skeletonCopy += patternChar;
      }
    }
    return skeletonCopy;
  }
  function getDefaultHourSymbolFromLocale(locale3) {
    var hourCycle = locale3.hourCycle;
    if (hourCycle === void 0 && // @ts-ignore hourCycle(s) is not identified yet
    locale3.hourCycles && // @ts-ignore
    locale3.hourCycles.length) {
      hourCycle = locale3.hourCycles[0];
    }
    if (hourCycle) {
      switch (hourCycle) {
        case "h24":
          return "k";
        case "h23":
          return "H";
        case "h12":
          return "h";
        case "h11":
          return "K";
        default:
          throw new Error("Invalid hourCycle");
      }
    }
    var languageTag = locale3.language;
    var regionTag;
    if (languageTag !== "root") {
      regionTag = locale3.maximize().region;
    }
    var hourCycles = timeData[regionTag || ""] || timeData[languageTag || ""] || timeData["".concat(languageTag, "-001")] || timeData["001"];
    return hourCycles[0];
  }

  // node_modules/@formatjs/icu-messageformat-parser/lib/parser.js
  var _a;
  var SPACE_SEPARATOR_START_REGEX = new RegExp("^".concat(SPACE_SEPARATOR_REGEX.source, "*"));
  var SPACE_SEPARATOR_END_REGEX = new RegExp("".concat(SPACE_SEPARATOR_REGEX.source, "*$"));
  function createLocation(start, end) {
    return { start, end };
  }
  var hasNativeStartsWith = !!String.prototype.startsWith;
  var hasNativeFromCodePoint = !!String.fromCodePoint;
  var hasNativeFromEntries = !!Object.fromEntries;
  var hasNativeCodePointAt = !!String.prototype.codePointAt;
  var hasTrimStart = !!String.prototype.trimStart;
  var hasTrimEnd = !!String.prototype.trimEnd;
  var hasNativeIsSafeInteger = !!Number.isSafeInteger;
  var isSafeInteger = hasNativeIsSafeInteger ? Number.isSafeInteger : function(n2) {
    return typeof n2 === "number" && isFinite(n2) && Math.floor(n2) === n2 && Math.abs(n2) <= 9007199254740991;
  };
  var REGEX_SUPPORTS_U_AND_Y = true;
  try {
    re = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
    REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec("a")) === null || _a === void 0 ? void 0 : _a[0]) === "a";
  } catch (_24) {
    REGEX_SUPPORTS_U_AND_Y = false;
  }
  var re;
  var startsWith = hasNativeStartsWith ? (
    // Native
    function startsWith2(s3, search2, position) {
      return s3.startsWith(search2, position);
    }
  ) : (
    // For IE11
    function startsWith3(s3, search2, position) {
      return s3.slice(position, position + search2.length) === search2;
    }
  );
  var fromCodePoint = hasNativeFromCodePoint ? String.fromCodePoint : (
    // IE11
    function fromCodePoint2() {
      var codePoints = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        codePoints[_i] = arguments[_i];
      }
      var elements = "";
      var length = codePoints.length;
      var i3 = 0;
      var code;
      while (length > i3) {
        code = codePoints[i3++];
        if (code > 1114111)
          throw RangeError(code + " is not a valid code point");
        elements += code < 65536 ? String.fromCharCode(code) : String.fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320);
      }
      return elements;
    }
  );
  var fromEntries = (
    // native
    hasNativeFromEntries ? Object.fromEntries : (
      // Ponyfill
      function fromEntries2(entries) {
        var obj = {};
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
          var _a2 = entries_1[_i], k3 = _a2[0], v3 = _a2[1];
          obj[k3] = v3;
        }
        return obj;
      }
    )
  );
  var codePointAt = hasNativeCodePointAt ? (
    // Native
    function codePointAt2(s3, index) {
      return s3.codePointAt(index);
    }
  ) : (
    // IE 11
    function codePointAt3(s3, index) {
      var size = s3.length;
      if (index < 0 || index >= size) {
        return void 0;
      }
      var first = s3.charCodeAt(index);
      var second;
      return first < 55296 || first > 56319 || index + 1 === size || (second = s3.charCodeAt(index + 1)) < 56320 || second > 57343 ? first : (first - 55296 << 10) + (second - 56320) + 65536;
    }
  );
  var trimStart = hasTrimStart ? (
    // Native
    function trimStart2(s3) {
      return s3.trimStart();
    }
  ) : (
    // Ponyfill
    function trimStart3(s3) {
      return s3.replace(SPACE_SEPARATOR_START_REGEX, "");
    }
  );
  var trimEnd = hasTrimEnd ? (
    // Native
    function trimEnd2(s3) {
      return s3.trimEnd();
    }
  ) : (
    // Ponyfill
    function trimEnd3(s3) {
      return s3.replace(SPACE_SEPARATOR_END_REGEX, "");
    }
  );
  function RE(s3, flag) {
    return new RegExp(s3, flag);
  }
  var matchIdentifierAtIndex;
  if (REGEX_SUPPORTS_U_AND_Y) {
    IDENTIFIER_PREFIX_RE_1 = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
    matchIdentifierAtIndex = function matchIdentifierAtIndex2(s3, index) {
      var _a2;
      IDENTIFIER_PREFIX_RE_1.lastIndex = index;
      var match = IDENTIFIER_PREFIX_RE_1.exec(s3);
      return (_a2 = match[1]) !== null && _a2 !== void 0 ? _a2 : "";
    };
  } else {
    matchIdentifierAtIndex = function matchIdentifierAtIndex2(s3, index) {
      var match = [];
      while (true) {
        var c3 = codePointAt(s3, index);
        if (c3 === void 0 || _isWhiteSpace(c3) || _isPatternSyntax(c3)) {
          break;
        }
        match.push(c3);
        index += c3 >= 65536 ? 2 : 1;
      }
      return fromCodePoint.apply(void 0, match);
    };
  }
  var IDENTIFIER_PREFIX_RE_1;
  var Parser = (
    /** @class */
    function() {
      function Parser2(message, options) {
        if (options === void 0) {
          options = {};
        }
        this.message = message;
        this.position = { offset: 0, line: 1, column: 1 };
        this.ignoreTag = !!options.ignoreTag;
        this.locale = options.locale;
        this.requiresOtherClause = !!options.requiresOtherClause;
        this.shouldParseSkeletons = !!options.shouldParseSkeletons;
      }
      Parser2.prototype.parse = function() {
        if (this.offset() !== 0) {
          throw Error("parser can only be used once");
        }
        return this.parseMessage(0, "", false);
      };
      Parser2.prototype.parseMessage = function(nestingLevel, parentArgType, expectingCloseTag) {
        var elements = [];
        while (!this.isEOF()) {
          var char = this.char();
          if (char === 123) {
            var result = this.parseArgument(nestingLevel, expectingCloseTag);
            if (result.err) {
              return result;
            }
            elements.push(result.val);
          } else if (char === 125 && nestingLevel > 0) {
            break;
          } else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
            var position = this.clonePosition();
            this.bump();
            elements.push({
              type: TYPE.pound,
              location: createLocation(position, this.clonePosition())
            });
          } else if (char === 60 && !this.ignoreTag && this.peek() === 47) {
            if (expectingCloseTag) {
              break;
            } else {
              return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
            }
          } else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
            var result = this.parseTag(nestingLevel, parentArgType);
            if (result.err) {
              return result;
            }
            elements.push(result.val);
          } else {
            var result = this.parseLiteral(nestingLevel, parentArgType);
            if (result.err) {
              return result;
            }
            elements.push(result.val);
          }
        }
        return { val: elements, err: null };
      };
      Parser2.prototype.parseTag = function(nestingLevel, parentArgType) {
        var startPosition = this.clonePosition();
        this.bump();
        var tagName = this.parseTagName();
        this.bumpSpace();
        if (this.bumpIf("/>")) {
          return {
            val: {
              type: TYPE.literal,
              value: "<".concat(tagName, "/>"),
              location: createLocation(startPosition, this.clonePosition())
            },
            err: null
          };
        } else if (this.bumpIf(">")) {
          var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
          if (childrenResult.err) {
            return childrenResult;
          }
          var children = childrenResult.val;
          var endTagStartPosition = this.clonePosition();
          if (this.bumpIf("</")) {
            if (this.isEOF() || !_isAlpha(this.char())) {
              return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
            }
            var closingTagNameStartPosition = this.clonePosition();
            var closingTagName = this.parseTagName();
            if (tagName !== closingTagName) {
              return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
            }
            this.bumpSpace();
            if (!this.bumpIf(">")) {
              return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
            }
            return {
              val: {
                type: TYPE.tag,
                value: tagName,
                children,
                location: createLocation(startPosition, this.clonePosition())
              },
              err: null
            };
          } else {
            return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
          }
        } else {
          return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
        }
      };
      Parser2.prototype.parseTagName = function() {
        var startOffset = this.offset();
        this.bump();
        while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
          this.bump();
        }
        return this.message.slice(startOffset, this.offset());
      };
      Parser2.prototype.parseLiteral = function(nestingLevel, parentArgType) {
        var start = this.clonePosition();
        var value = "";
        while (true) {
          var parseQuoteResult = this.tryParseQuote(parentArgType);
          if (parseQuoteResult) {
            value += parseQuoteResult;
            continue;
          }
          var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
          if (parseUnquotedResult) {
            value += parseUnquotedResult;
            continue;
          }
          var parseLeftAngleResult = this.tryParseLeftAngleBracket();
          if (parseLeftAngleResult) {
            value += parseLeftAngleResult;
            continue;
          }
          break;
        }
        var location2 = createLocation(start, this.clonePosition());
        return {
          val: { type: TYPE.literal, value, location: location2 },
          err: null
        };
      };
      Parser2.prototype.tryParseLeftAngleBracket = function() {
        if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || // If at the opening tag or closing tag position, bail.
        !_isAlphaOrSlash(this.peek() || 0))) {
          this.bump();
          return "<";
        }
        return null;
      };
      Parser2.prototype.tryParseQuote = function(parentArgType) {
        if (this.isEOF() || this.char() !== 39) {
          return null;
        }
        switch (this.peek()) {
          case 39:
            this.bump();
            this.bump();
            return "'";
          case 123:
          case 60:
          case 62:
          case 125:
            break;
          case 35:
            if (parentArgType === "plural" || parentArgType === "selectordinal") {
              break;
            }
            return null;
          default:
            return null;
        }
        this.bump();
        var codePoints = [this.char()];
        this.bump();
        while (!this.isEOF()) {
          var ch = this.char();
          if (ch === 39) {
            if (this.peek() === 39) {
              codePoints.push(39);
              this.bump();
            } else {
              this.bump();
              break;
            }
          } else {
            codePoints.push(ch);
          }
          this.bump();
        }
        return fromCodePoint.apply(void 0, codePoints);
      };
      Parser2.prototype.tryParseUnquoted = function(nestingLevel, parentArgType) {
        if (this.isEOF()) {
          return null;
        }
        var ch = this.char();
        if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) {
          return null;
        } else {
          this.bump();
          return fromCodePoint(ch);
        }
      };
      Parser2.prototype.parseArgument = function(nestingLevel, expectingCloseTag) {
        var openingBracePosition = this.clonePosition();
        this.bump();
        this.bumpSpace();
        if (this.isEOF()) {
          return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
        }
        if (this.char() === 125) {
          this.bump();
          return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
        }
        var value = this.parseIdentifierIfPossible().value;
        if (!value) {
          return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
        }
        this.bumpSpace();
        if (this.isEOF()) {
          return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
        }
        switch (this.char()) {
          case 125: {
            this.bump();
            return {
              val: {
                type: TYPE.argument,
                // value does not include the opening and closing braces.
                value,
                location: createLocation(openingBracePosition, this.clonePosition())
              },
              err: null
            };
          }
          case 44: {
            this.bump();
            this.bumpSpace();
            if (this.isEOF()) {
              return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
            }
            return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
          }
          default:
            return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
        }
      };
      Parser2.prototype.parseIdentifierIfPossible = function() {
        var startingPosition = this.clonePosition();
        var startOffset = this.offset();
        var value = matchIdentifierAtIndex(this.message, startOffset);
        var endOffset = startOffset + value.length;
        this.bumpTo(endOffset);
        var endPosition = this.clonePosition();
        var location2 = createLocation(startingPosition, endPosition);
        return { value, location: location2 };
      };
      Parser2.prototype.parseArgumentOptions = function(nestingLevel, expectingCloseTag, value, openingBracePosition) {
        var _a2;
        var typeStartPosition = this.clonePosition();
        var argType = this.parseIdentifierIfPossible().value;
        var typeEndPosition = this.clonePosition();
        switch (argType) {
          case "":
            return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
          case "number":
          case "date":
          case "time": {
            this.bumpSpace();
            var styleAndLocation = null;
            if (this.bumpIf(",")) {
              this.bumpSpace();
              var styleStartPosition = this.clonePosition();
              var result = this.parseSimpleArgStyleIfPossible();
              if (result.err) {
                return result;
              }
              var style = trimEnd(result.val);
              if (style.length === 0) {
                return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
              }
              var styleLocation = createLocation(styleStartPosition, this.clonePosition());
              styleAndLocation = { style, styleLocation };
            }
            var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
            if (argCloseResult.err) {
              return argCloseResult;
            }
            var location_1 = createLocation(openingBracePosition, this.clonePosition());
            if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, "::", 0)) {
              var skeleton = trimStart(styleAndLocation.style.slice(2));
              if (argType === "number") {
                var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
                if (result.err) {
                  return result;
                }
                return {
                  val: { type: TYPE.number, value, location: location_1, style: result.val },
                  err: null
                };
              } else {
                if (skeleton.length === 0) {
                  return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
                }
                var dateTimePattern = skeleton;
                if (this.locale) {
                  dateTimePattern = getBestPattern(skeleton, this.locale);
                }
                var style = {
                  type: SKELETON_TYPE.dateTime,
                  pattern: dateTimePattern,
                  location: styleAndLocation.styleLocation,
                  parsedOptions: this.shouldParseSkeletons ? parseDateTimeSkeleton(dateTimePattern) : {}
                };
                var type = argType === "date" ? TYPE.date : TYPE.time;
                return {
                  val: { type, value, location: location_1, style },
                  err: null
                };
              }
            }
            return {
              val: {
                type: argType === "number" ? TYPE.number : argType === "date" ? TYPE.date : TYPE.time,
                value,
                location: location_1,
                style: (_a2 = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a2 !== void 0 ? _a2 : null
              },
              err: null
            };
          }
          case "plural":
          case "selectordinal":
          case "select": {
            var typeEndPosition_1 = this.clonePosition();
            this.bumpSpace();
            if (!this.bumpIf(",")) {
              return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
            }
            this.bumpSpace();
            var identifierAndLocation = this.parseIdentifierIfPossible();
            var pluralOffset = 0;
            if (argType !== "select" && identifierAndLocation.value === "offset") {
              if (!this.bumpIf(":")) {
                return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
              }
              this.bumpSpace();
              var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
              if (result.err) {
                return result;
              }
              this.bumpSpace();
              identifierAndLocation = this.parseIdentifierIfPossible();
              pluralOffset = result.val;
            }
            var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
            if (optionsResult.err) {
              return optionsResult;
            }
            var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
            if (argCloseResult.err) {
              return argCloseResult;
            }
            var location_2 = createLocation(openingBracePosition, this.clonePosition());
            if (argType === "select") {
              return {
                val: {
                  type: TYPE.select,
                  value,
                  options: fromEntries(optionsResult.val),
                  location: location_2
                },
                err: null
              };
            } else {
              return {
                val: {
                  type: TYPE.plural,
                  value,
                  options: fromEntries(optionsResult.val),
                  offset: pluralOffset,
                  pluralType: argType === "plural" ? "cardinal" : "ordinal",
                  location: location_2
                },
                err: null
              };
            }
          }
          default:
            return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
        }
      };
      Parser2.prototype.tryParseArgumentClose = function(openingBracePosition) {
        if (this.isEOF() || this.char() !== 125) {
          return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
        }
        this.bump();
        return { val: true, err: null };
      };
      Parser2.prototype.parseSimpleArgStyleIfPossible = function() {
        var nestedBraces = 0;
        var startPosition = this.clonePosition();
        while (!this.isEOF()) {
          var ch = this.char();
          switch (ch) {
            case 39: {
              this.bump();
              var apostrophePosition = this.clonePosition();
              if (!this.bumpUntil("'")) {
                return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
              }
              this.bump();
              break;
            }
            case 123: {
              nestedBraces += 1;
              this.bump();
              break;
            }
            case 125: {
              if (nestedBraces > 0) {
                nestedBraces -= 1;
              } else {
                return {
                  val: this.message.slice(startPosition.offset, this.offset()),
                  err: null
                };
              }
              break;
            }
            default:
              this.bump();
              break;
          }
        }
        return {
          val: this.message.slice(startPosition.offset, this.offset()),
          err: null
        };
      };
      Parser2.prototype.parseNumberSkeletonFromString = function(skeleton, location2) {
        var tokens = [];
        try {
          tokens = parseNumberSkeletonFromString(skeleton);
        } catch (e3) {
          return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location2);
        }
        return {
          val: {
            type: SKELETON_TYPE.number,
            tokens,
            location: location2,
            parsedOptions: this.shouldParseSkeletons ? parseNumberSkeleton(tokens) : {}
          },
          err: null
        };
      };
      Parser2.prototype.tryParsePluralOrSelectOptions = function(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
        var _a2;
        var hasOtherClause = false;
        var options = [];
        var parsedSelectors = /* @__PURE__ */ new Set();
        var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
        while (true) {
          if (selector.length === 0) {
            var startPosition = this.clonePosition();
            if (parentArgType !== "select" && this.bumpIf("=")) {
              var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
              if (result.err) {
                return result;
              }
              selectorLocation = createLocation(startPosition, this.clonePosition());
              selector = this.message.slice(startPosition.offset, this.offset());
            } else {
              break;
            }
          }
          if (parsedSelectors.has(selector)) {
            return this.error(parentArgType === "select" ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
          }
          if (selector === "other") {
            hasOtherClause = true;
          }
          this.bumpSpace();
          var openingBracePosition = this.clonePosition();
          if (!this.bumpIf("{")) {
            return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
          }
          var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
          if (fragmentResult.err) {
            return fragmentResult;
          }
          var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
          if (argCloseResult.err) {
            return argCloseResult;
          }
          options.push([
            selector,
            {
              value: fragmentResult.val,
              location: createLocation(openingBracePosition, this.clonePosition())
            }
          ]);
          parsedSelectors.add(selector);
          this.bumpSpace();
          _a2 = this.parseIdentifierIfPossible(), selector = _a2.value, selectorLocation = _a2.location;
        }
        if (options.length === 0) {
          return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
        }
        if (this.requiresOtherClause && !hasOtherClause) {
          return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
        }
        return { val: options, err: null };
      };
      Parser2.prototype.tryParseDecimalInteger = function(expectNumberError, invalidNumberError) {
        var sign = 1;
        var startingPosition = this.clonePosition();
        if (this.bumpIf("+")) {
        } else if (this.bumpIf("-")) {
          sign = -1;
        }
        var hasDigits = false;
        var decimal = 0;
        while (!this.isEOF()) {
          var ch = this.char();
          if (ch >= 48 && ch <= 57) {
            hasDigits = true;
            decimal = decimal * 10 + (ch - 48);
            this.bump();
          } else {
            break;
          }
        }
        var location2 = createLocation(startingPosition, this.clonePosition());
        if (!hasDigits) {
          return this.error(expectNumberError, location2);
        }
        decimal *= sign;
        if (!isSafeInteger(decimal)) {
          return this.error(invalidNumberError, location2);
        }
        return { val: decimal, err: null };
      };
      Parser2.prototype.offset = function() {
        return this.position.offset;
      };
      Parser2.prototype.isEOF = function() {
        return this.offset() === this.message.length;
      };
      Parser2.prototype.clonePosition = function() {
        return {
          offset: this.position.offset,
          line: this.position.line,
          column: this.position.column
        };
      };
      Parser2.prototype.char = function() {
        var offset2 = this.position.offset;
        if (offset2 >= this.message.length) {
          throw Error("out of bound");
        }
        var code = codePointAt(this.message, offset2);
        if (code === void 0) {
          throw Error("Offset ".concat(offset2, " is at invalid UTF-16 code unit boundary"));
        }
        return code;
      };
      Parser2.prototype.error = function(kind, location2) {
        return {
          val: null,
          err: {
            kind,
            message: this.message,
            location: location2
          }
        };
      };
      Parser2.prototype.bump = function() {
        if (this.isEOF()) {
          return;
        }
        var code = this.char();
        if (code === 10) {
          this.position.line += 1;
          this.position.column = 1;
          this.position.offset += 1;
        } else {
          this.position.column += 1;
          this.position.offset += code < 65536 ? 1 : 2;
        }
      };
      Parser2.prototype.bumpIf = function(prefix2) {
        if (startsWith(this.message, prefix2, this.offset())) {
          for (var i3 = 0; i3 < prefix2.length; i3++) {
            this.bump();
          }
          return true;
        }
        return false;
      };
      Parser2.prototype.bumpUntil = function(pattern) {
        var currentOffset = this.offset();
        var index = this.message.indexOf(pattern, currentOffset);
        if (index >= 0) {
          this.bumpTo(index);
          return true;
        } else {
          this.bumpTo(this.message.length);
          return false;
        }
      };
      Parser2.prototype.bumpTo = function(targetOffset) {
        if (this.offset() > targetOffset) {
          throw Error("targetOffset ".concat(targetOffset, " must be greater than or equal to the current offset ").concat(this.offset()));
        }
        targetOffset = Math.min(targetOffset, this.message.length);
        while (true) {
          var offset2 = this.offset();
          if (offset2 === targetOffset) {
            break;
          }
          if (offset2 > targetOffset) {
            throw Error("targetOffset ".concat(targetOffset, " is at invalid UTF-16 code unit boundary"));
          }
          this.bump();
          if (this.isEOF()) {
            break;
          }
        }
      };
      Parser2.prototype.bumpSpace = function() {
        while (!this.isEOF() && _isWhiteSpace(this.char())) {
          this.bump();
        }
      };
      Parser2.prototype.peek = function() {
        if (this.isEOF()) {
          return null;
        }
        var code = this.char();
        var offset2 = this.offset();
        var nextCode = this.message.charCodeAt(offset2 + (code >= 65536 ? 2 : 1));
        return nextCode !== null && nextCode !== void 0 ? nextCode : null;
      };
      return Parser2;
    }()
  );
  function _isAlpha(codepoint) {
    return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
  }
  function _isAlphaOrSlash(codepoint) {
    return _isAlpha(codepoint) || codepoint === 47;
  }
  function _isPotentialElementNameChar(c3) {
    return c3 === 45 || c3 === 46 || c3 >= 48 && c3 <= 57 || c3 === 95 || c3 >= 97 && c3 <= 122 || c3 >= 65 && c3 <= 90 || c3 == 183 || c3 >= 192 && c3 <= 214 || c3 >= 216 && c3 <= 246 || c3 >= 248 && c3 <= 893 || c3 >= 895 && c3 <= 8191 || c3 >= 8204 && c3 <= 8205 || c3 >= 8255 && c3 <= 8256 || c3 >= 8304 && c3 <= 8591 || c3 >= 11264 && c3 <= 12271 || c3 >= 12289 && c3 <= 55295 || c3 >= 63744 && c3 <= 64975 || c3 >= 65008 && c3 <= 65533 || c3 >= 65536 && c3 <= 983039;
  }
  function _isWhiteSpace(c3) {
    return c3 >= 9 && c3 <= 13 || c3 === 32 || c3 === 133 || c3 >= 8206 && c3 <= 8207 || c3 === 8232 || c3 === 8233;
  }
  function _isPatternSyntax(c3) {
    return c3 >= 33 && c3 <= 35 || c3 === 36 || c3 >= 37 && c3 <= 39 || c3 === 40 || c3 === 41 || c3 === 42 || c3 === 43 || c3 === 44 || c3 === 45 || c3 >= 46 && c3 <= 47 || c3 >= 58 && c3 <= 59 || c3 >= 60 && c3 <= 62 || c3 >= 63 && c3 <= 64 || c3 === 91 || c3 === 92 || c3 === 93 || c3 === 94 || c3 === 96 || c3 === 123 || c3 === 124 || c3 === 125 || c3 === 126 || c3 === 161 || c3 >= 162 && c3 <= 165 || c3 === 166 || c3 === 167 || c3 === 169 || c3 === 171 || c3 === 172 || c3 === 174 || c3 === 176 || c3 === 177 || c3 === 182 || c3 === 187 || c3 === 191 || c3 === 215 || c3 === 247 || c3 >= 8208 && c3 <= 8213 || c3 >= 8214 && c3 <= 8215 || c3 === 8216 || c3 === 8217 || c3 === 8218 || c3 >= 8219 && c3 <= 8220 || c3 === 8221 || c3 === 8222 || c3 === 8223 || c3 >= 8224 && c3 <= 8231 || c3 >= 8240 && c3 <= 8248 || c3 === 8249 || c3 === 8250 || c3 >= 8251 && c3 <= 8254 || c3 >= 8257 && c3 <= 8259 || c3 === 8260 || c3 === 8261 || c3 === 8262 || c3 >= 8263 && c3 <= 8273 || c3 === 8274 || c3 === 8275 || c3 >= 8277 && c3 <= 8286 || c3 >= 8592 && c3 <= 8596 || c3 >= 8597 && c3 <= 8601 || c3 >= 8602 && c3 <= 8603 || c3 >= 8604 && c3 <= 8607 || c3 === 8608 || c3 >= 8609 && c3 <= 8610 || c3 === 8611 || c3 >= 8612 && c3 <= 8613 || c3 === 8614 || c3 >= 8615 && c3 <= 8621 || c3 === 8622 || c3 >= 8623 && c3 <= 8653 || c3 >= 8654 && c3 <= 8655 || c3 >= 8656 && c3 <= 8657 || c3 === 8658 || c3 === 8659 || c3 === 8660 || c3 >= 8661 && c3 <= 8691 || c3 >= 8692 && c3 <= 8959 || c3 >= 8960 && c3 <= 8967 || c3 === 8968 || c3 === 8969 || c3 === 8970 || c3 === 8971 || c3 >= 8972 && c3 <= 8991 || c3 >= 8992 && c3 <= 8993 || c3 >= 8994 && c3 <= 9e3 || c3 === 9001 || c3 === 9002 || c3 >= 9003 && c3 <= 9083 || c3 === 9084 || c3 >= 9085 && c3 <= 9114 || c3 >= 9115 && c3 <= 9139 || c3 >= 9140 && c3 <= 9179 || c3 >= 9180 && c3 <= 9185 || c3 >= 9186 && c3 <= 9254 || c3 >= 9255 && c3 <= 9279 || c3 >= 9280 && c3 <= 9290 || c3 >= 9291 && c3 <= 9311 || c3 >= 9472 && c3 <= 9654 || c3 === 9655 || c3 >= 9656 && c3 <= 9664 || c3 === 9665 || c3 >= 9666 && c3 <= 9719 || c3 >= 9720 && c3 <= 9727 || c3 >= 9728 && c3 <= 9838 || c3 === 9839 || c3 >= 9840 && c3 <= 10087 || c3 === 10088 || c3 === 10089 || c3 === 10090 || c3 === 10091 || c3 === 10092 || c3 === 10093 || c3 === 10094 || c3 === 10095 || c3 === 10096 || c3 === 10097 || c3 === 10098 || c3 === 10099 || c3 === 10100 || c3 === 10101 || c3 >= 10132 && c3 <= 10175 || c3 >= 10176 && c3 <= 10180 || c3 === 10181 || c3 === 10182 || c3 >= 10183 && c3 <= 10213 || c3 === 10214 || c3 === 10215 || c3 === 10216 || c3 === 10217 || c3 === 10218 || c3 === 10219 || c3 === 10220 || c3 === 10221 || c3 === 10222 || c3 === 10223 || c3 >= 10224 && c3 <= 10239 || c3 >= 10240 && c3 <= 10495 || c3 >= 10496 && c3 <= 10626 || c3 === 10627 || c3 === 10628 || c3 === 10629 || c3 === 10630 || c3 === 10631 || c3 === 10632 || c3 === 10633 || c3 === 10634 || c3 === 10635 || c3 === 10636 || c3 === 10637 || c3 === 10638 || c3 === 10639 || c3 === 10640 || c3 === 10641 || c3 === 10642 || c3 === 10643 || c3 === 10644 || c3 === 10645 || c3 === 10646 || c3 === 10647 || c3 === 10648 || c3 >= 10649 && c3 <= 10711 || c3 === 10712 || c3 === 10713 || c3 === 10714 || c3 === 10715 || c3 >= 10716 && c3 <= 10747 || c3 === 10748 || c3 === 10749 || c3 >= 10750 && c3 <= 11007 || c3 >= 11008 && c3 <= 11055 || c3 >= 11056 && c3 <= 11076 || c3 >= 11077 && c3 <= 11078 || c3 >= 11079 && c3 <= 11084 || c3 >= 11085 && c3 <= 11123 || c3 >= 11124 && c3 <= 11125 || c3 >= 11126 && c3 <= 11157 || c3 === 11158 || c3 >= 11159 && c3 <= 11263 || c3 >= 11776 && c3 <= 11777 || c3 === 11778 || c3 === 11779 || c3 === 11780 || c3 === 11781 || c3 >= 11782 && c3 <= 11784 || c3 === 11785 || c3 === 11786 || c3 === 11787 || c3 === 11788 || c3 === 11789 || c3 >= 11790 && c3 <= 11798 || c3 === 11799 || c3 >= 11800 && c3 <= 11801 || c3 === 11802 || c3 === 11803 || c3 === 11804 || c3 === 11805 || c3 >= 11806 && c3 <= 11807 || c3 === 11808 || c3 === 11809 || c3 === 11810 || c3 === 11811 || c3 === 11812 || c3 === 11813 || c3 === 11814 || c3 === 11815 || c3 === 11816 || c3 === 11817 || c3 >= 11818 && c3 <= 11822 || c3 === 11823 || c3 >= 11824 && c3 <= 11833 || c3 >= 11834 && c3 <= 11835 || c3 >= 11836 && c3 <= 11839 || c3 === 11840 || c3 === 11841 || c3 === 11842 || c3 >= 11843 && c3 <= 11855 || c3 >= 11856 && c3 <= 11857 || c3 === 11858 || c3 >= 11859 && c3 <= 11903 || c3 >= 12289 && c3 <= 12291 || c3 === 12296 || c3 === 12297 || c3 === 12298 || c3 === 12299 || c3 === 12300 || c3 === 12301 || c3 === 12302 || c3 === 12303 || c3 === 12304 || c3 === 12305 || c3 >= 12306 && c3 <= 12307 || c3 === 12308 || c3 === 12309 || c3 === 12310 || c3 === 12311 || c3 === 12312 || c3 === 12313 || c3 === 12314 || c3 === 12315 || c3 === 12316 || c3 === 12317 || c3 >= 12318 && c3 <= 12319 || c3 === 12320 || c3 === 12336 || c3 === 64830 || c3 === 64831 || c3 >= 65093 && c3 <= 65094;
  }

  // node_modules/@formatjs/icu-messageformat-parser/lib/index.js
  function pruneLocation(els) {
    els.forEach(function(el) {
      delete el.location;
      if (isSelectElement(el) || isPluralElement(el)) {
        for (var k3 in el.options) {
          delete el.options[k3].location;
          pruneLocation(el.options[k3].value);
        }
      } else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
        delete el.style.location;
      } else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) {
        delete el.style.location;
      } else if (isTagElement(el)) {
        pruneLocation(el.children);
      }
    });
  }
  function parse(message, opts) {
    if (opts === void 0) {
      opts = {};
    }
    opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
    var result = new Parser(message, opts).parse();
    if (result.err) {
      var error2 = SyntaxError(ErrorKind[result.err.kind]);
      error2.location = result.err.location;
      error2.originalMessage = result.err.message;
      throw error2;
    }
    if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
      pruneLocation(result.val);
    }
    return result.val;
  }

  // node_modules/@formatjs/fast-memoize/lib/index.js
  function memoize(fn, options) {
    var cache = options && options.cache ? options.cache : cacheDefault;
    var serializer = options && options.serializer ? options.serializer : serializerDefault;
    var strategy = options && options.strategy ? options.strategy : strategyDefault;
    return strategy(fn, {
      cache,
      serializer
    });
  }
  function isPrimitive(value) {
    return value == null || typeof value === "number" || typeof value === "boolean";
  }
  function monadic(fn, cache, serializer, arg) {
    var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
      computedValue = fn.call(this, arg);
      cache.set(cacheKey, computedValue);
    }
    return computedValue;
  }
  function variadic(fn, cache, serializer) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cacheKey = serializer(args);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
      computedValue = fn.apply(this, args);
      cache.set(cacheKey, computedValue);
    }
    return computedValue;
  }
  function assemble(fn, context, strategy, cache, serialize) {
    return strategy.bind(context, fn, cache, serialize);
  }
  function strategyDefault(fn, options) {
    var strategy = fn.length === 1 ? monadic : variadic;
    return assemble(fn, this, strategy, options.cache.create(), options.serializer);
  }
  function strategyVariadic(fn, options) {
    return assemble(fn, this, variadic, options.cache.create(), options.serializer);
  }
  function strategyMonadic(fn, options) {
    return assemble(fn, this, monadic, options.cache.create(), options.serializer);
  }
  var serializerDefault = function() {
    return JSON.stringify(arguments);
  };
  function ObjectWithoutPrototypeCache() {
    this.cache = /* @__PURE__ */ Object.create(null);
  }
  ObjectWithoutPrototypeCache.prototype.get = function(key) {
    return this.cache[key];
  };
  ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
    this.cache[key] = value;
  };
  var cacheDefault = {
    create: function create() {
      return new ObjectWithoutPrototypeCache();
    }
  };
  var strategies = {
    variadic: strategyVariadic,
    monadic: strategyMonadic
  };

  // node_modules/intl-messageformat/lib/src/error.js
  var ErrorCode;
  (function(ErrorCode2) {
    ErrorCode2["MISSING_VALUE"] = "MISSING_VALUE";
    ErrorCode2["INVALID_VALUE"] = "INVALID_VALUE";
    ErrorCode2["MISSING_INTL_API"] = "MISSING_INTL_API";
  })(ErrorCode || (ErrorCode = {}));
  var FormatError = (
    /** @class */
    function(_super) {
      __extends(FormatError2, _super);
      function FormatError2(msg, code, originalMessage) {
        var _this = _super.call(this, msg) || this;
        _this.code = code;
        _this.originalMessage = originalMessage;
        return _this;
      }
      FormatError2.prototype.toString = function() {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      };
      return FormatError2;
    }(Error)
  );
  var InvalidValueError = (
    /** @class */
    function(_super) {
      __extends(InvalidValueError2, _super);
      function InvalidValueError2(variableId, value, options, originalMessage) {
        return _super.call(this, 'Invalid values for "'.concat(variableId, '": "').concat(value, '". Options are "').concat(Object.keys(options).join('", "'), '"'), ErrorCode.INVALID_VALUE, originalMessage) || this;
      }
      return InvalidValueError2;
    }(FormatError)
  );
  var InvalidValueTypeError = (
    /** @class */
    function(_super) {
      __extends(InvalidValueTypeError2, _super);
      function InvalidValueTypeError2(value, type, originalMessage) {
        return _super.call(this, 'Value for "'.concat(value, '" must be of type ').concat(type), ErrorCode.INVALID_VALUE, originalMessage) || this;
      }
      return InvalidValueTypeError2;
    }(FormatError)
  );
  var MissingValueError = (
    /** @class */
    function(_super) {
      __extends(MissingValueError2, _super);
      function MissingValueError2(variableId, originalMessage) {
        return _super.call(this, 'The intl string context variable "'.concat(variableId, '" was not provided to the string "').concat(originalMessage, '"'), ErrorCode.MISSING_VALUE, originalMessage) || this;
      }
      return MissingValueError2;
    }(FormatError)
  );

  // node_modules/intl-messageformat/lib/src/formatters.js
  var PART_TYPE;
  (function(PART_TYPE2) {
    PART_TYPE2[PART_TYPE2["literal"] = 0] = "literal";
    PART_TYPE2[PART_TYPE2["object"] = 1] = "object";
  })(PART_TYPE || (PART_TYPE = {}));
  function mergeLiteral(parts) {
    if (parts.length < 2) {
      return parts;
    }
    return parts.reduce(function(all, part) {
      var lastPart = all[all.length - 1];
      if (!lastPart || lastPart.type !== PART_TYPE.literal || part.type !== PART_TYPE.literal) {
        all.push(part);
      } else {
        lastPart.value += part.value;
      }
      return all;
    }, []);
  }
  function isFormatXMLElementFn(el) {
    return typeof el === "function";
  }
  function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
    if (els.length === 1 && isLiteralElement(els[0])) {
      return [
        {
          type: PART_TYPE.literal,
          value: els[0].value
        }
      ];
    }
    var result = [];
    for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
      var el = els_1[_i];
      if (isLiteralElement(el)) {
        result.push({
          type: PART_TYPE.literal,
          value: el.value
        });
        continue;
      }
      if (isPoundElement(el)) {
        if (typeof currentPluralValue === "number") {
          result.push({
            type: PART_TYPE.literal,
            value: formatters.getNumberFormat(locales).format(currentPluralValue)
          });
        }
        continue;
      }
      var varName = el.value;
      if (!(values && varName in values)) {
        throw new MissingValueError(varName, originalMessage);
      }
      var value = values[varName];
      if (isArgumentElement(el)) {
        if (!value || typeof value === "string" || typeof value === "number") {
          value = typeof value === "string" || typeof value === "number" ? String(value) : "";
        }
        result.push({
          type: typeof value === "string" ? PART_TYPE.literal : PART_TYPE.object,
          value
        });
        continue;
      }
      if (isDateElement(el)) {
        var style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getDateTimeFormat(locales, style).format(value)
        });
        continue;
      }
      if (isTimeElement(el)) {
        var style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : formats.time.medium;
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getDateTimeFormat(locales, style).format(value)
        });
        continue;
      }
      if (isNumberElement(el)) {
        var style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
        if (style && style.scale) {
          value = value * (style.scale || 1);
        }
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getNumberFormat(locales, style).format(value)
        });
        continue;
      }
      if (isTagElement(el)) {
        var children = el.children, value_1 = el.value;
        var formatFn = values[value_1];
        if (!isFormatXMLElementFn(formatFn)) {
          throw new InvalidValueTypeError(value_1, "function", originalMessage);
        }
        var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
        var chunks = formatFn(parts.map(function(p3) {
          return p3.value;
        }));
        if (!Array.isArray(chunks)) {
          chunks = [chunks];
        }
        result.push.apply(result, chunks.map(function(c3) {
          return {
            type: typeof c3 === "string" ? PART_TYPE.literal : PART_TYPE.object,
            value: c3
          };
        }));
      }
      if (isSelectElement(el)) {
        var opt = el.options[value] || el.options.other;
        if (!opt) {
          throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
        }
        result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
        continue;
      }
      if (isPluralElement(el)) {
        var opt = el.options["=".concat(value)];
        if (!opt) {
          if (!Intl.PluralRules) {
            throw new FormatError('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', ErrorCode.MISSING_INTL_API, originalMessage);
          }
          var rule = formatters.getPluralRules(locales, { type: el.pluralType }).select(value - (el.offset || 0));
          opt = el.options[rule] || el.options.other;
        }
        if (!opt) {
          throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
        }
        result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
        continue;
      }
    }
    return mergeLiteral(result);
  }

  // node_modules/intl-messageformat/lib/src/core.js
  function mergeConfig(c1, c22) {
    if (!c22) {
      return c1;
    }
    return __assign(__assign(__assign({}, c1 || {}), c22 || {}), Object.keys(c1).reduce(function(all, k3) {
      all[k3] = __assign(__assign({}, c1[k3]), c22[k3] || {});
      return all;
    }, {}));
  }
  function mergeConfigs(defaultConfig, configs) {
    if (!configs) {
      return defaultConfig;
    }
    return Object.keys(defaultConfig).reduce(function(all, k3) {
      all[k3] = mergeConfig(defaultConfig[k3], configs[k3]);
      return all;
    }, __assign({}, defaultConfig));
  }
  function createFastMemoizeCache(store) {
    return {
      create: function() {
        return {
          get: function(key) {
            return store[key];
          },
          set: function(key, value) {
            store[key] = value;
          }
        };
      }
    };
  }
  function createDefaultFormatters(cache) {
    if (cache === void 0) {
      cache = {
        number: {},
        dateTime: {},
        pluralRules: {}
      };
    }
    return {
      getNumberFormat: memoize(function() {
        var _a2;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return new ((_a2 = Intl.NumberFormat).bind.apply(_a2, __spreadArray([void 0], args, false)))();
      }, {
        cache: createFastMemoizeCache(cache.number),
        strategy: strategies.variadic
      }),
      getDateTimeFormat: memoize(function() {
        var _a2;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return new ((_a2 = Intl.DateTimeFormat).bind.apply(_a2, __spreadArray([void 0], args, false)))();
      }, {
        cache: createFastMemoizeCache(cache.dateTime),
        strategy: strategies.variadic
      }),
      getPluralRules: memoize(function() {
        var _a2;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return new ((_a2 = Intl.PluralRules).bind.apply(_a2, __spreadArray([void 0], args, false)))();
      }, {
        cache: createFastMemoizeCache(cache.pluralRules),
        strategy: strategies.variadic
      })
    };
  }
  var IntlMessageFormat = (
    /** @class */
    function() {
      function IntlMessageFormat2(message, locales, overrideFormats, opts) {
        var _this = this;
        if (locales === void 0) {
          locales = IntlMessageFormat2.defaultLocale;
        }
        this.formatterCache = {
          number: {},
          dateTime: {},
          pluralRules: {}
        };
        this.format = function(values) {
          var parts = _this.formatToParts(values);
          if (parts.length === 1) {
            return parts[0].value;
          }
          var result = parts.reduce(function(all, part) {
            if (!all.length || part.type !== PART_TYPE.literal || typeof all[all.length - 1] !== "string") {
              all.push(part.value);
            } else {
              all[all.length - 1] += part.value;
            }
            return all;
          }, []);
          if (result.length <= 1) {
            return result[0] || "";
          }
          return result;
        };
        this.formatToParts = function(values) {
          return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, void 0, _this.message);
        };
        this.resolvedOptions = function() {
          return {
            locale: _this.resolvedLocale.toString()
          };
        };
        this.getAst = function() {
          return _this.ast;
        };
        this.locales = locales;
        this.resolvedLocale = IntlMessageFormat2.resolveLocale(locales);
        if (typeof message === "string") {
          this.message = message;
          if (!IntlMessageFormat2.__parse) {
            throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
          }
          this.ast = IntlMessageFormat2.__parse(message, {
            ignoreTag: opts === null || opts === void 0 ? void 0 : opts.ignoreTag,
            locale: this.resolvedLocale
          });
        } else {
          this.ast = message;
        }
        if (!Array.isArray(this.ast)) {
          throw new TypeError("A message must be provided as a String or AST.");
        }
        this.formats = mergeConfigs(IntlMessageFormat2.formats, overrideFormats);
        this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
      }
      Object.defineProperty(IntlMessageFormat2, "defaultLocale", {
        get: function() {
          if (!IntlMessageFormat2.memoizedDefaultLocale) {
            IntlMessageFormat2.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
          }
          return IntlMessageFormat2.memoizedDefaultLocale;
        },
        enumerable: false,
        configurable: true
      });
      IntlMessageFormat2.memoizedDefaultLocale = null;
      IntlMessageFormat2.resolveLocale = function(locales) {
        var supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales);
        if (supportedLocales.length > 0) {
          return new Intl.Locale(supportedLocales[0]);
        }
        return new Intl.Locale(typeof locales === "string" ? locales : locales[0]);
      };
      IntlMessageFormat2.__parse = parse;
      IntlMessageFormat2.formats = {
        number: {
          integer: {
            maximumFractionDigits: 0
          },
          currency: {
            style: "currency"
          },
          percent: {
            style: "percent"
          }
        },
        date: {
          short: {
            month: "numeric",
            day: "numeric",
            year: "2-digit"
          },
          medium: {
            month: "short",
            day: "numeric",
            year: "numeric"
          },
          long: {
            month: "long",
            day: "numeric",
            year: "numeric"
          },
          full: {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          }
        },
        time: {
          short: {
            hour: "numeric",
            minute: "numeric"
          },
          medium: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          },
          long: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short"
          },
          full: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short"
          }
        }
      };
      return IntlMessageFormat2;
    }()
  );

  // node_modules/intl-messageformat/lib/index.js
  var lib_default = IntlMessageFormat;

  // node_modules/i18next-icu/dist/es/index.js
  function ownKeys2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3] != null ? arguments[i3] : {};
      if (i3 % 2) {
        ownKeys2(Object(source), true).forEach(function(key) {
          _defineProperty2(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys2(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _defineProperty2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _classCallCheck2(instance2, Constructor) {
    if (!(instance2 instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties2(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass2(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties2(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties2(Constructor, staticProps);
    return Constructor;
  }
  function getDefaults() {
    return {
      memoize: true,
      memoizeFallback: false,
      bindI18n: "",
      bindI18nStore: "",
      parseErrorHandler: function parseErrorHandler(err, key, res, options) {
        return res;
      }
    };
  }
  var ICU = /* @__PURE__ */ function() {
    function ICU2(options) {
      _classCallCheck2(this, ICU2);
      this.type = "i18nFormat";
      this.mem = {};
      this.init(null, options);
    }
    _createClass2(ICU2, [{
      key: "init",
      value: function init3(i18next, options) {
        var _this = this;
        var i18nextOptions = i18next && i18next.options && i18next.options.i18nFormat || {};
        this.options = defaults(i18nextOptions, options, this.options || {}, getDefaults());
        this.formats = this.options.formats;
        if (i18next) {
          var _this$options = this.options, bindI18n = _this$options.bindI18n, bindI18nStore = _this$options.bindI18nStore, memoize2 = _this$options.memoize;
          i18next.IntlMessageFormat = lib_default;
          i18next.ICU = this;
          if (memoize2) {
            if (bindI18n) {
              i18next.on(bindI18n, function() {
                return _this.clearCache();
              });
            }
            if (bindI18nStore) {
              i18next.store.on(bindI18nStore, function() {
                return _this.clearCache();
              });
            }
          }
        }
      }
    }, {
      key: "addUserDefinedFormats",
      value: function addUserDefinedFormats(formats) {
        this.formats = this.formats ? _objectSpread2(_objectSpread2({}, this.formats), formats) : formats;
      }
    }, {
      key: "parse",
      value: function parse2(res, options, lng, ns2, key, info) {
        var hadSuccessfulLookup = info && info.resolved && info.resolved.res;
        var memKey = this.options.memoize && "".concat(lng, ".").concat(ns2, ".").concat(key.replace(/\./g, "###"));
        var fc;
        if (this.options.memoize) {
          fc = getPath2(this.mem, memKey);
        }
        try {
          if (!fc) {
            fc = new lib_default(res, lng, this.formats, {
              ignoreTag: true
            });
            if (this.options.memoize && (this.options.memoizeFallback || !info || hadSuccessfulLookup))
              setPath2(this.mem, memKey, fc);
          }
          return fc.format(options);
        } catch (err) {
          return this.options.parseErrorHandler(err, key, res, options);
        }
      }
    }, {
      key: "addLookupKeys",
      value: function addLookupKeys(finalKeys, _key, _code, _ns, _options) {
        return finalKeys;
      }
    }, {
      key: "clearCache",
      value: function clearCache() {
        this.mem = {};
      }
    }]);
    return ICU2;
  }();
  ICU.type = "i18nFormat";
  var es_default = ICU;

  // shared/locales/en/connection.json
  var connection_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    },
    encrypt: {
      title: "Encrypt",
      note: "When the cryptographic key can be used to encrypt data"
    },
    sign: {
      title: "Sign",
      note: "When the cryptographic key can be used to sign data"
    },
    verify: {
      title: "Verify",
      note: "When the cryptographic key can be used to verify data"
    },
    derive: {
      title: "Derive",
      note: "When the cryptographic key can be used to derive new keys"
    },
    wrap: {
      title: "Wrap",
      note: "When the cryptographic key can be used to wrap another key"
    },
    unwrap: {
      title: "Unwrap",
      note: "When the cryptographic key can be used to unwrap another key"
    },
    unknown: {
      title: "Unknown",
      note: "The cryptographic key can be used some other purpose we don't recognize"
    },
    certificateDetail: {
      title: "Security Certificate Detail",
      note: "Header for section that contains the SSL certificate details"
    },
    commonName: {
      title: "Common Name",
      note: "The Common Name for an SSL certificate"
    },
    publicKey: {
      title: "Public Key",
      note: "The Public Key for an SSL certificate"
    },
    algorithm: {
      title: "Algorithm",
      note: "The Algorithm used for an SSL certificate"
    },
    keySize: {
      title: "Key Size",
      note: "The size of the encryption key for an SSL certificate"
    },
    usage: {
      title: "Usage",
      note: "The allowed uses for an SSL certificate (references 'encrypt', 'sign', 'verify', 'unwrap', etc. strings in this file)"
    },
    summary: {
      title: "Summary",
      note: "Header for summary of connection details"
    },
    permanent: {
      title: "Permanent",
      note: "Whether certificate is permanent"
    },
    effectiveSize: {
      title: "Effective Size",
      note: "Effective size of encryption key for an SSL certificate"
    },
    certificateNotFound: {
      title: "Certificate not found",
      note: "When the connection is not encrypted (ie. http) we do not have any certificate details to show"
    },
    certificateForDomain: {
      title: "Certificate for {domain}",
      note: "Header for certificate details for a given domain"
    },
    insecureConnectionDesc: {
      title: "This page is using an unencrypted connection. Third parties may be able to view your activity or intercept sensitive information you send on this page.",
      note: "Shown we connection is not encrypted"
    },
    invalidConnectionDesc: {
      title: "The certificate for this site is invalid. You might be connecting to a server that is pretending to be <b>{domain}</b> which could put your confidential information at risk.",
      note: "Shown when connection is encrypted, but the certificate is invalid"
    },
    upgradedConnectionDesc: {
      title: "We upgraded the connection on this page to protect information you send while in transit.",
      note: "Shown when we successfully upgrade a connection from an insecure one to a secure connection"
    },
    secureConnectionDesc: {
      title: "This page uses an encrypted connection, which prevents third parties from viewing your activity or intercepting sensitive information you send on this page.",
      note: "Shown when the user navigated directly to a secure connection"
    }
  };

  // shared/locales/en/ctascreens.json
  var ctascreens_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    },
    protectionsUnavailableNote: {
      title: "Privacy Protections are not available for special pages or local pages.",
      note: "'Special pages' here means things like the browser settings page, whereas 'local pages' means files opened from the user's computer rather than the internet"
    },
    spreadTitle: {
      title: "Love using DuckDuckGo?",
      note: "Title text for 'Spread DuckDuckGo' CTA"
    },
    spreadText: {
      title: "Help us spread the word to your family and friends",
      note: "Secondary text for 'Spread DuckDuckGo' CTA"
    },
    spreadButton: {
      title: "Spread DuckDuckGo",
      note: "Button text for 'spread' CTA"
    },
    emailTitle: {
      title: "Tired of emails being tracked?",
      note: "Title text for 'Email Protection' CTA"
    },
    emailText: {
      title: "Sign up for DuckDuckGo Email Protection for your extension now!",
      note: "Extension here means browser extension or addon"
    }
  };

  // shared/locales/en/firebutton.json
  var firebutton_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    },
    fireDialogHeader: {
      title: "Close Tabs and Clear Data",
      note: "Dialog header."
    },
    fireDialogHeaderNoTabs: {
      title: "Clear Data",
      note: "Dialog header when tab clearing is disabled."
    },
    optionCurrentSite: {
      title: "Current site only",
      note: "Dropdown option to only clear data for the current active website"
    },
    optionLastHour: {
      title: "Last hour",
      note: "Dropdown option to only clear data from the past hour"
    },
    optionLast24Hour: {
      title: "Last 24 hours",
      note: "Dropdown option to only clear data from the past 24 hours"
    },
    optionLast7days: {
      title: "Last 7 days",
      note: "Dropdown option to only clear data from the past 7 days"
    },
    optionLast4Weeks: {
      title: "Last 4 weeks",
      note: "Dropdown option to only clear data from the past 4 weeks"
    },
    optionAllTime: {
      title: "All time",
      note: "Dropdown option to clear all data, since recording started"
    },
    historyDuration: {
      title: "{duration, select, hour {one hour} day {24 hours} week {one week} month {4 weeks} other {all} }",
      note: "Description of what period of history data should be deleted."
    },
    summaryClearTabsHistoryDuration: {
      title: "Close <b>{openTabs}</b> {openTabs, plural, =1 {tab} other {tabs}}, and clear <b>{durationDesc}</b> of browsing history and cookies?",
      note: "Description of data to be removed after the user submits the form. Placeholders stand for: 1. the number of tabs that will be affected; 2. the timespan of data to be removed (translated separately with key historyDuration). Example: Close 3 tabs and clear 2 weeks of browsing\u2026"
    },
    summaryClearTabsDuration: {
      title: "Close <b>{openTabs}</b> {openTabs, plural, =1 {tab} other {tabs}}, and clear <b>{durationDesc}</b> of cookies?",
      note: "Description of data to be removed after the user submits the form. Placeholders stand for: 1. the number of tabs that will be affected; 2. the timespan of data to be removed (translated separately with key historyDuration). Example: Close 3 tabs and clear 2 weeks of cookies?"
    },
    summaryClearHistoryDuration: {
      title: "Clear <b>{durationDesc}</b> of browsing history and cookies?",
      note: "Description of data to be removed after the user submits the form. The placeholder stands for the timespan of data to be removed (translated separately with key historyDuration). Example: Clear 2 weeks of browsing\u2026"
    },
    summaryClearCookiesDuration: {
      title: "Clear <b>{durationDesc}</b> of cookies?",
      note: "Description of data to be removed after the user submits the form. The placeholder stands for the timespan of data to be removed (translated separately with key historyDuration). Example: Clear 2 weeks of cookies?"
    },
    summaryClearTabsHistoryAll: {
      title: "Close <b>{openTabs}</b> {openTabs, plural, =1 {tab} other {tabs}}, and clear <b>all</b> browsing history and cookies ({cookies} {cookies, plural, =1 {site} other {sites}})?",
      note: "Description of data to be removed after the user submits the form. The placeholders are for the number of tabs to be closed, and the number of sites where we'll clear cookies. Example: Close 3 tabs, and clear browsing history and cookies (2 sites)?"
    },
    summaryClearTabsAll: {
      title: "Close <b>{openTabs}</b> {openTabs, plural, =1 {tab} other {tabs}}, and clear <b>all</b> cookies ({cookies} {cookies, plural, =1 {site} other {sites}})?",
      note: "Description of data to be removed after the user submits the form. The placeholders are for the number of tabs to be closed, and the number of sites where we'll clear cookies. Example: Close 3 tabs, and clear all cookies (2 sites)?"
    },
    summaryClearHistoryAll: {
      title: "Clear <b>all</b> browsing history and cookies ({cookies} {cookies, plural, =1 {site} other {sites}})?",
      note: "Description of data to be removed after the user submits the form. The placeholders stand for the number of sites where we'll clear cookies. Example: Clear all browsing history and cookies (2 sites)?"
    },
    summaryClearCookiesAll: {
      title: "Clear <b>all</b> cookies ({cookies} {cookies, plural, =1 {site} other {sites}})?",
      note: "Description of data to be removed after the user submits the form. The placeholders stand for the number of sites where we'll clear cookies. Example: Clear all cookies (2 sites)?"
    },
    summaryClearTabsHistorySite: {
      title: "Close <b>{openTabs} {site}</b> {openTabs, plural, =1 {tab} other {tabs}}, and clear <b>all {site}</b> cookies?",
      note: 'Description of data to be removed after the user submits the form. Example: "Close <b>3 example.com</b> tabs, and clear <b>all example.com</b> cookies?".'
    },
    summaryClearTabsSite: {
      title: "Close <b>{openTabs} {site}</b> {openTabs, plural, =1 {tab} other {tabs}}, and clear <b>all {site}</b> cookies?",
      note: 'Description of data to be removed after the user submits the form. Example: "Close <b>3 example.com</b> tabs, and clear <b>all example.com</b> cookies?".'
    },
    summaryClearHistorySite: {
      title: "Clear <b>all {site}</b> browsing history and cookies?",
      note: "Description of data to be removed after the user submits the form. Example: Clear all example.com browsing history and cookies?"
    },
    summaryClearCookiesSite: {
      title: "Clear <b>all {site}</b> cookies?",
      note: "Description of data to be removed after the user submits the form. Clear all example.com cookies?"
    },
    summaryPinnedIgnored: {
      title: "<b>{tabs} pinned</b> {tabs, plural, =1 {tab} other {tabs}} will be ignored.",
      note: "Notice to tell the user that some tabs will not be closed. Example: 3 pinned tabs will be ignored."
    },
    clearData: {
      title: "Clear",
      note: "Button text to start data clearing."
    },
    cancel: {
      title: "Cancel",
      note: "Button text to exit the fire button modal."
    },
    historyAndDownloadsNotAffected: {
      title: "To also clear history, select a time period.",
      note: "Notice to tell the user that the chosen clearing settings will not affect history and downloads because a time period has not been selected from the dropdown."
    }
  };

  // shared/locales/en/permissions.json
  var permissions_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    },
    camera: {
      title: "Camera",
      note: "Camera permission is used by the browser to ask the user for access to computer or phone camera"
    },
    microphone: {
      title: "Microphone",
      note: "Microphone permission is used by the browser to ask the user for access to computer or phone microphone"
    },
    geolocation: {
      title: "Geolocation",
      note: "Geolocation permission is used by the browser to ask the user to share their current location with the website"
    },
    popups: {
      title: "Pop-ups",
      note: "Pop-ups permission is used by the browser to ask the user to allow the website to open new windows"
    },
    ask: {
      title: "Ask every time",
      note: "A permission setting that specifies the user should be asked each time the website wants to use a given permission"
    },
    notify: {
      title: "Notify",
      note: "A permission setting that specifies the user should be notified each time the website wants to use a given permission"
    },
    grant: {
      title: "Always allow",
      note: "A permission setting that allows the website to always use this permission without asking"
    },
    deny: {
      title: "Always deny",
      note: "A permission setting that always blocks the website from using this permission"
    }
  };

  // shared/locales/en/report.json
  var report_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    },
    selectTheOptionDesc: {
      title: "Submitting an anonymous broken site report helps us improve the app.",
      note: "The user will see this UI when they're running into issues with a given website, that we may be causing"
    },
    selectTheOptionDescV2: {
      title: "Select the option that best describes the problem you experienced.",
      note: "A heading that encourages the user to select from a list of reasons a website might be broken"
    },
    selectTheCategoryType: {
      title: "What's the problem?",
      note: "A heading that encourages the user to select the kind of problem from a list. Options such as: 'The site is not working as expected', 'I dislike the content on this site' or 'General DuckDuckGo browser feedback'"
    },
    categoryType1: {
      title: "The site is not working as expected",
      note: "The user wants to report that the site isn't functioning as they expect it to."
    },
    categoryType2: {
      title: "I dislike the content on this site",
      note: "The user wants to report that they didn't like the content of the site in question."
    },
    categoryType3: {
      title: "General DuckDuckGo browser feedback",
      note: "The user wants to provide feedback about our application, not the site in question"
    },
    selectTheCategory: {
      title: "What's not working on this site?",
      note: "A heading that encourages the user to select from a list of reasons a website might be broken, like `videos didn't play' or 'site layout is broken'"
    },
    tryTurningProtectionsOff: {
      title: "Try turning Privacy Protections off to see if that resolves the issue.",
      note: "Presented as an alternative solution"
    },
    skipThisStep: {
      title: "Skip this step",
      note: "Text within a button that allow the user to skip to the next step"
    },
    pickYourIssueFromTheList: {
      title: "Describe what happened",
      note: "Asks the user to pick a specific list from the pulldown"
    },
    blocked: {
      title: "Site blocked or didn't load",
      note: "User is reporting this page because the page didn't load"
    },
    layout: {
      title: "Site layout broken",
      note: "User is reporting this page because the page layout appears broken"
    },
    emptySpaces: {
      title: "Site contains large empty spaces",
      note: "User is reporting this page because the page contains large empty spaces"
    },
    videos: {
      title: "Video didn\u2019t play or load",
      note: "User is reporting this page because a video didn't play or load correctly"
    },
    images: {
      title: "Images didn't load",
      note: "User is reporting this page because one or more images did not load"
    },
    comments: {
      title: "Comments, reviews, or chats didn\u2019t load",
      note: "User is reporting this page because one or more comments did not load"
    },
    content: {
      title: "Content is missing",
      note: "User is reporting this page because some other type of content did not load"
    },
    links: {
      title: "Links or buttons don't work",
      note: "User is reporting this page because one or more links or buttons did not work when clicked"
    },
    login: {
      title: "Can\u2019t sign in/register",
      note: "User is reporting this page because they are unable to log into the website"
    },
    loginV2: {
      title: "Can't sign in or register",
      note: "User is reporting this page because they are unable to log into the website"
    },
    shopping: {
      title: "Can't pay, check out, or shop",
      note: "User is reporting this page because they are unable to log into the website"
    },
    browser: {
      title: "Browser or other browser extension issue",
      note: "User is reporting this page because there a problem with the browser or another extension"
    },
    paywall: {
      title: "Site asked me to disable ad blocker",
      note: "User is reporting this page asked them to disable their privacy or ad blocking extension"
    },
    other: {
      title: "Something else",
      note: "User is reporting this page because of some other reason than the ones we listed"
    },
    tellUsMoreDesc: {
      title: "Share more details (optional):{bullet}What happened?{bullet}What should have happened?{bullet}Did turning protections off help?",
      note: "A hint for a text box that lets user enter free text to describe their problem. There are 3 questions as a guide, and each 'bullet' is replaced with a bullet point - such as '\u2022 What happened?'"
    },
    sendReport: {
      title: "Send Report",
      note: "Button for submitting report"
    },
    reportsAreAnonymousDesc: {
      title: "Reports sent to DuckDuckGo only include info required to help us address your feedback.",
      note: "A small disclaimer at the bottom of the view describing what is included in the report"
    },
    thankYou: {
      title: "Thank you!",
      note: "Title for what the user sees upon submitting the report"
    },
    yourReportWillHelpDesc: {
      title: "Your report will help improve our products and make the experience better for other people.",
      note: "Body that the user sees upon submitting the report"
    },
    dislike: {
      title: "I dislike the content",
      note: "User is reporting this page because they dislike something on the page"
    },
    otherRequired: {
      title: "Please describe the issue you experienced (required)",
      note: "Placeholder text in a form where the user must provide additional information"
    },
    otherOptional: {
      title: "Please describe the issue you experienced (optional)",
      note: "Placeholder text in a form where the user can provide additional information, but is not required to"
    },
    suggestionWhatHappened: {
      title: "What happened?",
      note: "Suggestion to enter a description of what problem the user was experiencing"
    },
    suggestionWhatHappened2: {
      title: "What should have happened?",
      note: "Suggestion to enter a description of what the user expected to happen, but didn't"
    },
    suggestionWhatHappened3: {
      title: "Did turning Privacy Protections off help?",
      note: "Suggestion to mention if turning off privacy protections helped solve a problem the user was having"
    },
    reportTitle: {
      title: "Report to DuckDuckGo",
      note: "Used as a screen heading for a breakage report flow."
    }
  };

  // shared/locales/en/shared.json
  var shared_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    }
  };

  // shared/locales/en/site.json
  var site_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    },
    updatingProtectionList: {
      title: "Updating protection list",
      note: "Message shown while updating the list of protections"
    },
    protectionsEnabled: {
      title: "Protections are <b>ON</b> for this site",
      note: "Headline when privacy protections are enabled"
    },
    protectionsDisabled: {
      title: "Protections are <b>OFF</b> for this site",
      note: "Headline when privacy protections are disabled by user"
    },
    protectionsDisabledRemote: {
      title: "We temporarily turned Privacy Protections off as they appear to be breaking this site.",
      note: "Headline when privacy protections are disabled by DDG"
    },
    protectionsDisabledRemoteOverride: {
      title: "We recommend disabling Privacy Protections for this site to prevent the site from breaking.",
      note: "Headline when privacy protections are disabled by user"
    },
    connectionDescriptionUnencrypted: {
      title: "<b>This site is not secure</b> and may compromise any information you send on this page.",
      note: "Shown when the connection is not encrypted (HTTP instead of HTTPS)"
    },
    connectionDescriptionInvalidCertificate: {
      title: "<b>The certificate for this site is invalid.</b> You might be connecting to a server that is pretending to be <b>{domain}</b> which could put your confidential information at risk.",
      note: "Shown when the connection is encrypted, but the certificate was invalid"
    },
    trackerNetworksSummaryBlocked: {
      title: "The following third-party domains\u2019 requests were blocked from loading because they were identified as tracking requests. If a company's requests are loaded, it can allow them to profile you.",
      note: "The summary immediately shown on the 'trackers blocked' screen"
    },
    trackerNetworksSummaryNoneBlocked: {
      title: "No tracking requests were blocked from loading on this page. If a company's requests are loaded, it can allow them to profile you.",
      note: "The message shown when we detected trackers, but none were blocked"
    },
    trackerNetworksSummaryNoneFound: {
      title: "We did not identify any tracking requests on this page.",
      note: "The message shown when we didn't detect any trackers"
    },
    trackerNetworksSummaryNone: {
      title: "We didn't find any companies trying to load tracking requests on this page.",
      note: "We did not find any trackers on this page"
    },
    trackerNetworksSummaryAllowedOnly: {
      title: "To prevent site breakage, we didn\u2019t block any companies from loading tracking requests on this page.",
      note: "The message shown when we allowed some trackers to load."
    },
    trackerNetworksSummaryProtectionsOff: {
      title: "No tracking requests were blocked from loading because Protections are turned off for this site. If a company's requests are loaded, it can allow them to profile you.",
      note: "We found trackers, but protections were disabled"
    },
    createNewDuckAddress: {
      title: "Generate Private Duck Address",
      note: "Create a new private email alias"
    },
    createNewDuckAddressCopied: {
      title: "Copied to your clipboard!",
      note: "Note to inform that the email address was copied"
    },
    websiteNotWorkingQ: {
      title: "Website not working as expected?",
      note: "Call to action for user to click if they are having issues with this web page"
    },
    websiteNotWorkingPrompt: {
      title: "Website not working?",
      note: "button label text when we are trying to encourage a user to toggle protections off"
    },
    websiteNotWorkingCta: {
      title: "Report broken site",
      note: "button label text for a trigger that shows our feedback form"
    },
    websiteNotWorkingAdvice: {
      title: "Turning protections OFF might help.",
      note: "help text"
    },
    websiteNotWorkingPromptFollowUp: {
      title: "Site still not working?",
      note: "button label text a user has already turned protections off"
    },
    takePrecautions: {
      title: "Take Precautions",
      note: "Title shown when the page is unencrypted"
    },
    majorTrackingNetworkDesc: {
      title: "<b>This site is owned by {companyDisplayName}</b>, which operates a tracker network across {companyPrevalence}% of the top websites. {blocked, select, true {We were able to block some of their requests on this page.} other {}}",
      note: "When visiting a site that is owned by a major tracking company, we cannot block their trackers so we warn the user.  Ex. Google (owner of news.google.com) tracks you across 79% of top sites.... etc"
    },
    trackersBlockedDesc: {
      title: "We blocked {companyCount, plural, =0 {some companies} =1 {<b>{firstCompany}</b>} =2 {<b>{firstCompany}</b> and <b>{secondCompany}</b>} =3 {<b>{firstCompany}</b>, <b>{secondCompany}</b> and <b>{thirdCompany}</b>} =4 {<b>{firstCompany}</b>, <b>{secondCompany}</b>, <b>{thirdCompany}</b> and <b>{fourthCompany}</b>} =5 {<b>{firstCompany}</b>, <b>{secondCompany}</b>, <b>{thirdCompany}</b>, <b>{fourthCompany}</b> and <b>1 other</b>} other {<b>{firstCompany}</b>, <b>{secondCompany}</b>, <b>{thirdCompany}</b>, <b>{fourthCompany}</b> and <b>{othersCount} others</b>}} from loading tracking requests on this page.",
      note: "Returns a string in the form of 'We blocked CompanyA and CompanyB from trying to track you.'"
    },
    cookiesMinimized: {
      title: "Cookies Managed",
      note: "Title for when we have set the cookie privacy settings on this website to maximize privacy"
    },
    cookiesHidden: {
      title: "Cookie Pop-up Hidden",
      note: "Title for when we have cosmetically hidden a cookie banner"
    },
    cookiesHiddenSummary: {
      title: "We were only able to hide the cookie pop-up on this site because no options were provided to manage cookie preferences. Our other Web Tracking Protections still apply.",
      note: "A longer explanation that we have cosmetically hidden a cookie banner"
    },
    cookiesMinimizedSummary: {
      title: "We set your cookie preferences to maximize privacy and closed the pop-up.",
      note: "A longer explanation that we have set the cookie privacy settings on this website to maximize privacy"
    },
    cookiesMinimizedSettings: {
      title: "Disable in Settings",
      note: "Button text for allowing the settings to be opened"
    },
    connectionSecure: {
      title: "Connection Is Encrypted",
      note: "The connection to the website is secure (HTTPS)"
    },
    connectionNotSecure: {
      title: "Connection Is Not Encrypted",
      note: "The connection is not secure (HTTP)"
    },
    connectionNotSecureInvalidCertificate: {
      title: "Connection May Be Insecure",
      note: "Shown as the button text when the connection is using an invalid certificate."
    },
    trackerNetworksDesc: {
      title: "Requests Blocked from Loading",
      note: "This indicates that 1 or more trackers were blocked."
    },
    trackerNetworksNotBlocked: {
      title: "No Tracking Requests Blocked",
      note: "This indicates that no trackers were blocked."
    },
    trackerNetworksNotFound: {
      title: "No Tracking Requests Found",
      note: "This is an alternative heading for when there were no Trackers but there WAS at least 1 non-special request loaded"
    },
    thirdPartiesLoaded: {
      title: "Third-Party Requests Loaded",
      note: "todo"
    },
    thirdPartiesNoneFound: {
      title: "No Third-Party Requests Found",
      note: "This describes how many non-tracker domains were loaded with a longer description  Ex: Requests from 3 other third-party domains were loaded on this page."
    },
    firstPartyDesc: {
      title: "{companyName} owns this site and the known trackers found on this page, so we didn't block them.",
      note: "When trackers detected belong to companyName, we can't block them on a site that company owns"
    },
    noTrackersFound: {
      title: "We didn't find any companies trying to load tracking requests on this page.",
      note: "We did not find any trackers on this page"
    },
    trackersFoundForAllowlisted: {
      title: "Trackers help companies profile you. We found these companies monitoring your activity on this page.",
      note: "This header for the list of tracker companies is shown when a site has protections disabled"
    },
    trackersFoundAndBlocked: {
      title: "Trackers help companies profile you. We blocked these companies from monitoring your activity on this page.",
      note: "This header for the list of tracker companies is shown when a site has protections enabled"
    },
    trackerNetworkUnknown: {
      title: "Tracker network unknown",
      note: "Shown when we don't have a company name for a given tracker"
    },
    trackerDomainsForCompany: {
      title: "Tracker domains for {companyName}",
      note: "Title for the list of tracker domains detected from a given company"
    },
    zeroTrackersFound: {
      title: "0 Trackers Found",
      note: "We did not find any trackers on this page"
    },
    trackerOwnedByThisSite: {
      title: "Trackers Owned by This Site (Allowed)",
      note: "Trackers owned by this site are not blocked"
    },
    trackerCountForDomain: {
      title: "{trackerCount} {trackerCount, plural, =1 {Tracker} other {Trackers}} {blocked, select, true {Blocked} other {Found}} on {domain}",
      note: "For a given domain, the count of trackers either blocked or just detected (found).  Ex 4 Trackers Blocked"
    },
    trackerLimitationsNote: {
      title: "Please note: platform limitations may limit our ability to detect all requests.",
      note: "Shown at the bottom of tracker lists"
    },
    trackerAboutLink: {
      title: "About our Web Tracking Protections",
      note: "A link pointing to a help page that gives more info on our Web Tracking Protections"
    },
    trackerAdLink: {
      title: "How our search ads impact our protections",
      note: "A link pointing to an help page explaining how our search ads impact our protections"
    },
    sectionHeadingAdAttribution: {
      title: "The following domain\u2019s requests were loaded because a {domain} ad on DuckDuckGo was recently clicked. These requests help evaluate ad effectiveness. All ads on DuckDuckGo are non-profiling.",
      note: "The placeholder stands for a company name"
    },
    sectionHeadingIgnore: {
      title: "The following domains\u2019 requests were loaded to prevent site breakage.",
      note: "Blocking trackers can cause issue with the host page, so we may allow them to load"
    },
    sectionHeadingFirstParty: {
      title: "The following domains\u2019 requests were loaded because they\u2019re associated with {domain}.",
      note: "The placeholder stands for a company name"
    },
    sectionHeadingThirdParty: {
      title: "The following domains' requests were also loaded."
    },
    sectionHeadingProtectionsDisabled: {
      title: "The following domains' requests were loaded because protections are off.",
      note: "The user can manually turn off protections. When that happens we show this message"
    },
    thirdPartiesSummaryLoaded: {
      title: "The following third-party domains\u2019 requests were loaded. If a company's requests are loaded, it can allow them to profile you, though our other web tracking protections still apply.",
      note: "Shown as the summary in third parties screen"
    },
    thirdPartiesSummaryProtectionsOff: {
      title: "The following third-party domains\u2019 requests were loaded. If a company's requests are loaded, it can allow them to profile you, though our other web tracking protections still apply.",
      note: "Shown when any requests were loaded, but protections are off"
    },
    thirdPartiesSummaryNone: {
      title: "We did not identify any requests from third-party domains.",
      note: "Shown in third party listing screen"
    },
    analyticsCategory: {
      title: "Analytics",
      note: "Used to describe the type of tracker, in this case one that is used to report analytics back to the site owner"
    },
    advertisingCategory: {
      title: "Advertising",
      note: "Used to describe the type of tracker, in this case one that is used for advertising"
    },
    socialCategory: {
      title: "Social Network",
      note: "Used to describe the type of tracker, in this case one that is used by one of the popular social networks"
    },
    contentDeliveryCategory: {
      title: "Content Delivery",
      note: "Used to describe the type of tracker, in this case one that is used by content delivery platforms"
    },
    embeddedContentCategory: {
      title: "Embedded Content",
      note: "Used to describe the type of tracker, in this case one that is used by embedded content"
    },
    searchPlaceholder: {
      title: "Search DuckDuckGo",
      note: "Placeholder text for the search bar"
    },
    searchGoButton: {
      title: "Search",
      note: "Aria label for the search button"
    },
    optionsButton: {
      title: "More options",
      note: "Aria label for the for the options button"
    },
    navigationComplete: {
      title: "Done",
      note: "Button text for iOS on top bar navigation"
    },
    navigationClose: {
      title: "Close",
      note: "Button text for macos on top bar navigation"
    },
    navigationCancel: {
      title: "Cancel",
      note: "Button text for cancel action"
    },
    navigationBack: {
      title: "Back",
      note: "Aria label and visible text for iOS on top bar navigation"
    },
    enableProtectionsSwitch: {
      title: "Enable Protections",
      note: "Aria label for the switch that allows the user to turn protections on"
    },
    disableProtectionsSwitch: {
      title: "Disable Protections",
      note: "Aria label for the switch that allows the user to turn protections off"
    },
    errorMessage: {
      title: "Something went wrong, and we couldn't load this content. Try reloading the page.",
      note: "Message shown to the user when an error has occurred and the UI cannot be displayed"
    }
  };

  // shared/locales/en/toggle-report.json
  var toggle_report_default = {
    smartling: {
      string_format: "icu",
      translate_paths: [{
        path: "*/title",
        key: "{*}/title",
        instruction: "*/note"
      }]
    },
    dontSendReport: {
      title: "Don't Send",
      note: "Button for choosing not to submit a report"
    },
    yourReportWillHelpToggleReport: {
      title: "Your report will help improve our products and make the experience better for everyone.",
      note: "Body that the user sees upon submitting the report"
    },
    siteNotWorkingTitle: {
      title: "Site not working? Let us know.",
      note: "Title asking users if the site is not working and prompting them to report the issue."
    },
    siteNotWorkingSubTitle: {
      title: "Anonymous reports help DuckDuckGo fix issues caused by privacy protections.",
      note: "Subtitle explaining that anonymous reports assist DuckDuckGo in fixing issues caused by privacy protections."
    },
    siteNotWorkingInfoReveal: {
      title: "See what\u2019s sent",
      note: "Button label allowing users to see the information that is sent in the report."
    },
    siteNotWorkingInfoHide: {
      title: "Hide",
      note: "Button label allowing users to hide the information that is sent in the report."
    },
    reportsNoInfoSent: {
      title: "Info sent in reports can't be used to identify you:",
      note: "This text emphasizes that the sent reports do not contain any personally identifiable information."
    },
    dynamic_wvVersion: {
      title: "Web browser engine version number",
      note: "This text represents the version number of the web browser engine."
    },
    dynamic_requests: {
      title: "Hostnames of trackers blocked, surrogate requests, ignored requests, and requests not in tracker blocking list",
      note: "This text provides information about various types of requests, including blocked trackers and ignored requests."
    },
    dynamic_features: {
      title: "List of which protections and browser features were active",
      note: "This text represents a list of active protections and browser features."
    },
    dynamic_appVersion: {
      title: "App version number",
      note: "This text indicates the version number of the app."
    },
    dynamic_atb: {
      title: "Anonymous experiment group for feature testing",
      note: "This text represents an anonymous group for testing features."
    },
    dynamic_errorDescriptions: {
      title: "Browser-reported errors",
      note: "This text provides a list of errors reported by the browser."
    },
    dynamic_extensionVersion: {
      title: "Extension version number",
      note: "This text indicates the version number of the extension."
    },
    dynamic_httpErrorCodes: {
      title: "Website response status (HTTP) codes",
      note: "This text provides a list of response status codes from the website."
    },
    dynamic_lastSentDay: {
      title: "Date of last report sent for this site",
      note: "This text indicates the date of the last report sent for the site."
    },
    dynamic_device: {
      title: "Device make, model, and manufacturer",
      note: "This text provides information about the device, including make, model, and manufacturer."
    },
    dynamic_os: {
      title: "Operating system version number",
      note: "This text indicates the version number of the operating system."
    },
    dynamic_reportFlow: {
      title: 'Which reporting form you used ("menu", "dashboard", etc.)',
      note: "This text represents the path the user took to get to this feedback screen."
    },
    dynamic_siteUrl: {
      title: "Page URL (without identifiable info)",
      note: "This text represents the URL of the page, without including any identifiable information."
    },
    dynamic_listVersions: {
      title: "Information about which versions of our protections were active",
      note: "This text represents the URL of the page, without including any identifiable information."
    },
    dynamic_didOpenReportInfo: {
      title: "Whether or not you opted to show this report info",
      note: "This text represents if the user has opted to see a list of information, or not."
    },
    dynamic_toggleReportCounter: {
      title: "Number of times protections were toggled off",
      note: "This text represents the amount of times protections were toggled"
    },
    dynamic_openerContext: {
      title: 'How you got to this page, either: "SERP" (DuckDuckGo search), "Navigation" (link/URL), or "External" (other means)',
      note: "This text represents the context of how the user navigated to the current page (e.g., through search results, direct link, or external sources)."
    },
    dynamic_userRefreshCount: {
      title: "Number of refreshes since page load",
      note: "This text represents the number of times the user has refreshed the page since it was initially loaded."
    },
    dynamic_jsPerformance: {
      title: "How quickly parts of the page loaded",
      note: "This text provides information on the performance of the page's JavaScript, indicating how quickly different parts of the page loaded."
    }
  };

  // shared/js/ui/base/localize.js
  var resources = {
    connection: connection_default,
    ctascreens: ctascreens_default,
    firebutton: firebutton_default,
    permissions: permissions_default,
    report: report_default,
    shared: shared_default,
    site: site_default,
    "toggle-report": toggle_report_default
  };
  i18next_default.use(es_default).init({
    // debug: true,
    initImmediate: false,
    fallbackLng: "en",
    lng: "en",
    ns: Object.keys(resources),
    resources: { en: resources },
    i18nFormat: {
      parseErrorHandler: (err, key, res, options) => {
        console.warn("parseErrorHandler", err, key, res, options);
      }
    }
  });
  var i18n = i18next_default;
  function siteT(key, options) {
    return i18next_default.t(`site:${key}`, options);
  }
  function reportT(key, options) {
    return i18next_default.t(`report:${key}`, options);
  }
  function toggleReportT(key, options) {
    return i18next_default.t(`toggle-report:${key}`, options);
  }
  var ns = {
    site: siteT,
    report: reportT,
    toggleReport: toggleReportT
  };

  // shared/js/ui/templates/shared/links.js
  function aboutLink() {
    const text = ns.site("trackerAboutLink.title");
    return import_nanohtml.default`<a
        class="about-link link-action link-action--text-short"
        href="https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/"
        target="_blank"
        >${text}</a
    >`;
  }
  function adAttributionLink() {
    const text = ns.site("trackerAdLink.title");
    return import_nanohtml.default`<a
        class="link-action link-action--text-micro"
        href="https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/#3rd-party-tracker-loading-protection"
        target="_blank"
        >${text}</a
    >`;
  }
  function disableInSettingsLink(cb) {
    const text = ns.site("cookiesMinimizedSettings.title");
    return import_nanohtml.default`<a class="link-action link-action--text-micro" draggable="false" href="javascript:void(0)" onclick=${cb}>${text}</a>`;
  }

  // shared/js/ui/models/mixins/normalize-company-name.mjs
  function normalizeCompanyName(companyName) {
    return (companyName || "").toLowerCase().replace(/\.[a-z]+$/i, "").replace(/[^a-z0-9]/g, "");
  }
  function removeTLD(entityName) {
    return entityName.replace(/\.[a-z]+$/i, "");
  }

  // shared/js/browser/utils/request-details.mjs
  init_schema_parsers();
  init_protections();
  var createTabData = (tabUrl, upgradedHttps4, protections4, rawRequestData) => {
    let domain;
    try {
      domain = new URL(tabUrl).hostname.replace(/^www\./, "");
    } catch (e3) {
      domain = "unknown";
    }
    return {
      id: void 0,
      url: tabUrl,
      status: "complete",
      upgradedHttps: upgradedHttps4,
      specialDomainName: void 0,
      domain,
      protections: protections4,
      locale: null,
      requestDetails: createRequestDetails(rawRequestData.requests, rawRequestData.installedSurrogates || []),
      parentEntity: void 0,
      permissions: void 0,
      cookiePromptManagementStatus: void 0,
      ctaScreens: void 0,
      search: void 0,
      emailProtection: void 0,
      isPendingUpdates: void 0,
      certificate: void 0,
      platformLimitations: void 0,
      error: void 0
    };
  };
  function createRequestDetails(requests, installedSurrogates) {
    const output2 = new RequestDetails(installedSurrogates);
    for (const request of requests) {
      output2.all.addRequest(request);
      if ("blocked" in request.state) {
        output2.blocked.addRequest(request);
      }
      if ("allowed" in request.state) {
        const reason = request.state.allowed.reason;
        if (reason in output2.allowed) {
          output2.allowed[request.state.allowed.reason].addRequest(request);
        }
      }
    }
    return output2;
  }
  var AggregatedCompanyResponseData = class {
    constructor() {
      /** @type {number} */
      __publicField(this, "entitiesCount", 0);
      /** @type {number} */
      __publicField(this, "requestCount", 0);
      /** @type {Record<string, AggregateCompanyData>} */
      __publicField(this, "entities", {});
    }
    /**
     * @param {import('../../../../schema/__generated__/schema.types.js').DetectedRequest} request
     */
    addRequest(request) {
      let hostname;
      try {
        hostname = new URL(request.url).hostname;
      } catch (e3) {
        hostname = request.url;
      }
      let displayName;
      const urlHostname = hostname.replace(/^www\./, "");
      if (request.entityName) {
        if (request.entityName === request.eTLDplus1) {
          displayName = request.eTLDplus1;
        } else {
          displayName = removeTLD(request.entityName);
        }
      } else {
        displayName = request.eTLDplus1 || request.url;
      }
      if (!this.entities[displayName]) {
        this.entities[displayName] = new AggregateCompanyData(request.ownerName, displayName, request.prevalence ?? 0);
      }
      this.entities[displayName].addUrl(urlHostname, request.category);
      this.entitiesCount = Object.keys(this.entities).length;
      this.requestCount += 1;
    }
    /**
     * Returns a list of AggregateCompanyData sorted by the entity prevalence
     * @returns {AggregateCompanyData[]}
     */
    sortedByPrevalence() {
      return [...Object.values(this.entities)].sort((a3, b3) => b3.prevalence - a3.prevalence);
    }
  };
  var states = (
    /** @type {const} */
    {
      /* 01 */
      protectionsOn: "protectionsOn",
      /* 02 */
      protectionsOn_blocked: "protectionsOn_blocked",
      /* 03 */
      protectionsOn_blocked_allowedTrackers: "protectionsOn_blocked_allowedTrackers",
      /* 04 */
      protectionsOn_blocked_allowedNonTrackers: "protectionsOn_blocked_allowedNonTrackers",
      /* 05 */
      protectionsOn_blocked_allowedTrackers_allowedNonTrackers: "protectionsOn_blocked_allowedTrackers_allowedNonTrackers",
      /* 06 */
      protectionsOn_allowedTrackers: "protectionsOn_allowedTrackers",
      /* 07 */
      protectionsOn_allowedNonTrackers: "protectionsOn_allowedNonTrackers",
      /* 08 */
      protectionsOn_allowedTrackers_allowedNonTrackers: "protectionsOn_allowedTrackers_allowedNonTrackers",
      /* 09 */
      protectionsOff: "protectionsOff",
      /* 010 */
      protectionsOff_allowedTrackers: "protectionsOff_allowedTrackers",
      /* 011 */
      protectionsOff_allowedNonTrackers: "protectionsOff_allowedNonTrackers",
      /* 012 */
      protectionsOff_allowedTrackers_allowedNonTrackers: "protectionsOff_allowedTrackers_allowedNonTrackers"
    }
  );
  var RequestDetails = class {
    /**
     * @param {string[]} surrogates - any installed surrogates, just the domains
     */
    constructor(surrogates) {
      __publicField(this, "surrogates");
      __publicField(this, "all", new AggregatedCompanyResponseData());
      __publicField(this, "blocked", new AggregatedCompanyResponseData());
      __publicField(this, "allowed", {
        adClickAttribution: new AggregatedCompanyResponseData(),
        ownedByFirstParty: new AggregatedCompanyResponseData(),
        ruleException: new AggregatedCompanyResponseData(),
        protectionDisabled: new AggregatedCompanyResponseData(),
        otherThirdPartyRequest: new AggregatedCompanyResponseData()
      });
      this.surrogates = surrogates;
    }
    /**
     * Loop over every seen entity
     * @param {(entity: AggregateCompanyData) => void} fn
     */
    forEachEntity(fn) {
      for (const entity of Object.values(this.all.entities)) {
        fn(entity);
      }
    }
    /**
     * @returns {number}
     */
    blockedCount() {
      return this.blocked.entitiesCount;
    }
    /**
     * The number of entities observed that had 'special' requests.
     *
     * 'special' means that a request was classified as a tracker, but we didn't block it
     * for any given reason. Note: This list excludes 'non-special' requests such as 3rd party
     * requests not classified as trackers
     *
     * @returns {number}
     */
    allowedSpecialCount() {
      return this.allowed.adClickAttribution.entitiesCount + this.allowed.ownedByFirstParty.entitiesCount + this.allowed.ruleException.entitiesCount + this.allowed.protectionDisabled.entitiesCount;
    }
    /**
     * The number of entities observed that had 'non-special' requests.
     *
     * 'non-special' means a request that was observed, but it was *not* classified as a tracker
     *
     * @returns {number}
     */
    allowedNonSpecialCount() {
      return this.allowed.otherThirdPartyRequest.entitiesCount;
    }
    /**
     * Create a list of company names, excluding any 'unknown' ones.
     * @returns {string[]}
     */
    blockedCompanyNames() {
      const output2 = [];
      for (const entity of Object.values(this.blocked.entities)) {
        if (entity.name === "unknown")
          continue;
        output2.push(entity);
      }
      return output2.sort((a3, b3) => b3.prevalence - a3.prevalence).map((entity) => entity.displayName);
    }
    /**
     * @param {boolean} protectionsEnabled
     * @param {(keyof states & string)[]} states
     */
    matches(protectionsEnabled, states2) {
      const curr = this.state(protectionsEnabled);
      return states2.includes(curr);
    }
    /**
     * From the available request data, determine the global 'state' of the Request Data
     * @param {boolean} protectionsEnabled
     * @return {keyof states & string}
     */
    state(protectionsEnabled) {
      if (!protectionsEnabled) {
        if (this.allowedSpecialCount() > 0 && this.allowedNonSpecialCount() > 0) {
          return states.protectionsOff_allowedTrackers_allowedNonTrackers;
        }
        if (this.allowedNonSpecialCount() > 0) {
          return states.protectionsOff_allowedNonTrackers;
        }
        if (this.allowedSpecialCount() > 0) {
          return states.protectionsOff_allowedTrackers;
        }
        return states.protectionsOff;
      } else {
        if (this.blockedCount() > 0) {
          if (this.allowedSpecialCount() > 0 && this.allowedNonSpecialCount() > 0) {
            return states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers;
          }
          if (this.allowedSpecialCount() > 0) {
            return states.protectionsOn_blocked_allowedTrackers;
          }
          if (this.allowedNonSpecialCount() > 0) {
            return states.protectionsOn_blocked_allowedNonTrackers;
          }
          return states.protectionsOn_blocked;
        } else {
          if (this.allowedSpecialCount() > 0 && this.allowedNonSpecialCount() > 0) {
            return states.protectionsOn_allowedTrackers_allowedNonTrackers;
          }
          if (this.allowedSpecialCount() > 0) {
            return states.protectionsOn_allowedTrackers;
          }
          if (this.allowedNonSpecialCount() > 0) {
            return states.protectionsOn_allowedNonTrackers;
          }
        }
        return states.protectionsOn;
      }
    }
  };
  var AggregateCompanyData = class {
    /**
     * @param {string|undefined} name
     * @param {string} displayName
     * @param {number} prevalence
     */
    constructor(name, displayName, prevalence) {
      this.name = name;
      this.displayName = displayName;
      this.prevalence = prevalence;
      this.normalizedName = normalizeCompanyName(displayName);
      this.urls = {};
    }
    /**
     * @param {string} url
     * @param {string} [category]
     */
    addUrl(url, category) {
      this.urls[url] = new TrackerUrl(url, category);
    }
  };
  var TrackerUrl = class {
    /**
     * @param {string} url
     * @param {string} [category]
     */
    constructor(url, category) {
      this.url = url;
      this.category = category;
    }
  };

  // shared/js/ui/templates/shared/tracker-networks-text.js
  function trackerNetworksText(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled);
    switch (state) {
      case states.protectionsOn_blocked:
      case states.protectionsOn_blocked_allowedTrackers:
      case states.protectionsOn_blocked_allowedNonTrackers:
      case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers: {
        return {
          title: ns.site("trackerNetworksDesc.title"),
          icon: "blocked"
        };
      }
      case states.protectionsOn_allowedTrackers_allowedNonTrackers:
      case states.protectionsOn_allowedTrackers: {
        return {
          title: ns.site("trackerNetworksNotBlocked.title"),
          icon: "info"
        };
      }
      case states.protectionsOff_allowedTrackers:
      case states.protectionsOff_allowedTrackers_allowedNonTrackers: {
        return {
          title: ns.site("trackerNetworksNotBlocked.title"),
          icon: "warning"
        };
      }
      case states.protectionsOn:
      case states.protectionsOff:
      case states.protectionsOn_allowedNonTrackers:
      case states.protectionsOff_allowedNonTrackers: {
        return {
          title: ns.site("trackerNetworksNotFound.title"),
          icon: "blocked"
        };
      }
      default:
        return unreachable(state);
    }
  }
  function trackerNetworkSummary(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled);
    switch (state) {
      case states.protectionsOn:
      case states.protectionsOff:
      case states.protectionsOn_allowedNonTrackers:
      case states.protectionsOff_allowedNonTrackers: {
        return ns.site("trackerNetworksSummaryNoneFound.title");
      }
      case states.protectionsOn_allowedTrackers:
      case states.protectionsOn_allowedTrackers_allowedNonTrackers: {
        return ns.site("trackerNetworksSummaryNoneBlocked.title");
      }
      case states.protectionsOff_allowedTrackers:
      case states.protectionsOff_allowedTrackers_allowedNonTrackers:
        return ns.site("trackerNetworksSummaryProtectionsOff.title");
      default:
        return ns.site("trackerNetworksSummaryBlocked.title");
    }
  }
  function trackerNetworksHeroIcon(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled);
    switch (state) {
      case states.protectionsOn:
      case states.protectionsOff:
      case states.protectionsOff_allowedNonTrackers:
      case states.protectionsOn_allowedNonTrackers: {
        return "major-networks-no-activity";
      }
      case states.protectionsOn_allowedTrackers:
      case states.protectionsOn_allowedTrackers_allowedNonTrackers: {
        return "major-networks-info";
      }
      case states.protectionsOff_allowedTrackers:
      case states.protectionsOff_allowedTrackers_allowedNonTrackers: {
        return "major-networks-warning";
      }
      case states.protectionsOn_blocked_allowedTrackers:
      case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
      case states.protectionsOn_blocked:
      case states.protectionsOn_blocked_allowedNonTrackers: {
        return "major-networks-blocked";
      }
      default:
        return unreachable(state);
    }
  }
  function unreachable(x2) {
    throw new Error("Didn't expect to get here with value" + x2);
  }

  // shared/js/ui/templates/shared/thirdparty-text.js
  function thirdpartyText(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled);
    switch (state) {
      case states.protectionsOn:
      case states.protectionsOn_blocked:
      case states.protectionsOff: {
        return {
          title: ns.site("thirdPartiesNoneFound.title"),
          icon: "blocked"
        };
      }
      case states.protectionsOn_allowedTrackers:
      case states.protectionsOn_allowedNonTrackers:
      case states.protectionsOn_blocked_allowedTrackers:
      case states.protectionsOn_blocked_allowedNonTrackers:
      case states.protectionsOn_allowedTrackers_allowedNonTrackers:
      case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
      case states.protectionsOff_allowedTrackers_allowedNonTrackers:
      case states.protectionsOff_allowedNonTrackers:
      case states.protectionsOff_allowedTrackers: {
        return {
          title: ns.site("thirdPartiesLoaded.title"),
          icon: "info"
        };
      }
      default:
        return unreachable2(state);
    }
  }
  function thirdpartySummary(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled);
    switch (state) {
      case states.protectionsOn_blocked_allowedTrackers:
      case states.protectionsOn_blocked_allowedNonTrackers:
      case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
      case states.protectionsOn_allowedTrackers_allowedNonTrackers:
      case states.protectionsOn_allowedTrackers:
      case states.protectionsOff_allowedTrackers:
      case states.protectionsOn_allowedNonTrackers:
      case states.protectionsOff_allowedTrackers_allowedNonTrackers:
      case states.protectionsOff_allowedNonTrackers: {
        return ns.site("thirdPartiesSummaryProtectionsOff.title");
      }
      case states.protectionsOn:
      case states.protectionsOff:
      case states.protectionsOn_blocked: {
        return ns.site("thirdPartiesSummaryNone.title");
      }
      default:
        return unreachable2(state);
    }
  }
  function thirdpartyHeroIcon(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled);
    switch (state) {
      case states.protectionsOn:
      case states.protectionsOn_blocked:
      case states.protectionsOff: {
        return "major-networks-no-activity";
      }
      case states.protectionsOn_blocked_allowedTrackers:
      case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
      case states.protectionsOn_allowedTrackers:
      case states.protectionsOn_allowedNonTrackers:
      case states.protectionsOff_allowedNonTrackers:
      case states.protectionsOff_allowedTrackers:
      case states.protectionsOn_blocked_allowedNonTrackers:
      case states.protectionsOff_allowedTrackers_allowedNonTrackers:
      case states.protectionsOn_allowedTrackers_allowedNonTrackers: {
        return "major-networks-info";
      }
      default:
        return unreachable2(state);
    }
  }
  function unreachable2(x2) {
    throw new Error("Didn't expect to get here with value " + x2);
  }

  // shared/js/ui/templates/shared/hero.js
  var import_raw = __toESM(require_raw_browser());
  function heroTemplate(opts) {
    return import_nanohtml2.default`
        <div class="key-insight" data-suffix=${opts.suffix}>
            ${opts.icon} ${opts.summary ? import_nanohtml2.default`<p class="token-title-3">${(0, import_raw.default)(opts.summary)}</p>` : null}
            ${opts.suffix === "about-link" ? aboutLink() : null} ${opts.children ? opts.children : null}
        </div>
    `;
  }
  function heroFromTabTrackers(requestDetails, protectionsEnabled) {
    const summary = trackerNetworkSummary(requestDetails, protectionsEnabled);
    const icon = trackerNetworksHeroIcon(requestDetails, protectionsEnabled);
    const largeIcon = largeHeroIcon({
      status: icon
    });
    return heroTemplate({
      suffix: "about-link",
      icon: largeIcon,
      summary
    });
  }
  function heroFromTabNonTrackers(requestDetails, protectionsEnabled) {
    const summary = thirdpartySummary(requestDetails, protectionsEnabled);
    const icon = thirdpartyHeroIcon(requestDetails, protectionsEnabled);
    const largeIcon = largeHeroIcon({
      status: icon
    });
    return heroTemplate({
      suffix: "about-link",
      icon: largeIcon,
      summary
    });
  }
  function largeHeroIcon(props) {
    return import_nanohtml2.default`<div class="large-icon-container hero-icon--${props.status}"></div>`;
  }

  // shared/js/ui/templates/page-connection.js
  var import_nanohtml4 = __toESM(require_browser());

  // shared/js/ui/templates/shared/top-nav.js
  var import_nanohtml3 = __toESM(require_browser());

  // shared/js/ui/environment-check.js
  function isEnvironment(platform2) {
    return document.body.classList.contains(`environment--${platform2}`);
  }
  var isIOS = () => isEnvironment("ios");
  var isAndroid = () => isEnvironment("android");
  var isBrowser = () => isEnvironment("browser");
  var isWindows = () => isEnvironment("windows");
  var isMacos = () => isEnvironment("macos");
  function currentPlatform() {
    const matchingClass = [...document.body.classList].find((x2) => x2.startsWith("environment--"));
    if (matchingClass) {
      const platform2 = matchingClass.slice(13);
      if (isValidPlatform(platform2)) {
        return platform2;
      }
    }
    return null;
  }
  function isValidPlatform(name) {
    if (!name)
      throw new Error(`not a valid platform name ${name}`);
    const names = ["ios", "android", "macos", "browser", "windows"];
    if (names.includes(name)) {
      return true;
    }
    throw new Error("nope!");
  }
  var lastKnownPlatformName;
  function platformSwitch(mapping) {
    if (!lastKnownPlatformName)
      lastKnownPlatformName = currentPlatform();
    if (!lastKnownPlatformName)
      throw new Error("could not determine the current platform.");
    if (lastKnownPlatformName in mapping) {
      return mapping[lastKnownPlatformName]();
    }
    if ("default" in mapping) {
      return mapping.default();
    }
    throw new Error("did not expect to get here - use a default!");
  }

  // shared/js/ui/templates/page-connection.js
  function getKeyUsage(key) {
    const capabilities = {
      canEncrypt: i18n.t("connection:encrypt.title"),
      canDecrypt: i18n.t("connection:decrypt.title"),
      canSign: i18n.t("connection:sign.title"),
      canVerify: i18n.t("connection:verify.title"),
      canDerive: i18n.t("connection:derive.title"),
      canWrap: i18n.t("connection:wrap.title"),
      canUnwrap: i18n.t("connection:unwrap.title")
    };
    return Object.keys(capabilities).reduce((usage, capability) => {
      if (!key[capability])
        return usage;
      return [].concat(usage, capabilities[capability]);
    }, []);
  }
  function renderCertificateDetails(site, tab) {
    if (site.httpsState === "none" || !tab.certificate || tab.certificate.length === 0)
      return "";
    const certificate = tab.certificate[0];
    return import_nanohtml4.default`
        <div>
            ${renderHeader(site, tab)}
            <div class="page-connection__certificate">
                <div class="page-connection__certificate-details">
                    <h3 class="token-body-em">${i18n.t("connection:certificateDetail.title")}</h3>
                    <div>
                        <span>${i18n.t("connection:commonName.title")}</span>
                        <span class="page-connection__certificate-value">${certificate.commonName}</span>
                    </div>
                    ${renderCertificateSummary(certificate)}
                </div>
                ${renderPublicKeyDetails(certificate)}
            </div>
        </div>
    `;
  }
  function renderCertificateSummary(certificate) {
    if (!certificate.summary)
      return "";
    return import_nanohtml4.default`<div>
        <span>${i18n.t("connection:summary.title")}</span>
        <span class="page-connection__certificate-value">${certificate.summary}</span>
    </div>`;
  }
  function renderPublicKeyDetails(certificate) {
    if (!certificate.publicKey)
      return "";
    return import_nanohtml4.default`<div class="page-connection__certificate-details">
        <h3 class="token-body-em">${i18n.t("connection:publicKey.title")}</h3>
        ${renderCertificateType(certificate.publicKey)} ${renderCertificateBitSize(certificate.publicKey)}
        ${renderCertificateEffectiveSize(certificate.publicKey)} ${renderCertificateKeyUsage(certificate.publicKey)}
        ${renderCertificateIsPermanent(certificate.publicKey)}
    </div>`;
  }
  function renderCertificateType(publicKey) {
    if (!publicKey.type)
      return "";
    return import_nanohtml4.default`<div>
        <span>${i18n.t("connection:algorithm.title")}</span>
        <span class="page-connection__certificate-value">${publicKey.type}</span>
    </div>`;
  }
  function renderCertificateBitSize(publicKey) {
    if (!publicKey.bitSize)
      return "";
    return import_nanohtml4.default`<div>
        <span>${i18n.t("connection:keySize.title")}</span>
        <span class="page-connection__certificate-value">${publicKey.bitSize} bits</span>
    </div>`;
  }
  function renderCertificateIsPermanent(publicKey) {
    if (typeof publicKey.isPermanent !== "boolean")
      return "";
    return import_nanohtml4.default`<div>
        <span>${i18n.t("connection:permanent.title")}</span>
        <span class="page-connection__certificate-value">${publicKey.isPermanent ? "Yes" : "No"}</span>
    </div>`;
  }
  function renderCertificateKeyUsage(publicKey) {
    const keyUsage = getKeyUsage(publicKey);
    if (keyUsage.length === 0)
      return "";
    return import_nanohtml4.default`<div>
        <span>${i18n.t("connection:usage.title")}</span>
        <span class="page-connection__certificate-value">${keyUsage.join(", ")}</span>
    </div>`;
  }
  function renderCertificateEffectiveSize(publicKey) {
    if (!publicKey.effectiveSize)
      return "";
    return import_nanohtml4.default`<div>
        <span>${i18n.t("connection:effectiveSize.title")}</span>
        <span class="page-connection__certificate-value">${publicKey.effectiveSize} bits</span>
    </div>`;
  }
  function renderHeader(site, tab) {
    if (site.httpsState === "none") {
      return import_nanohtml4.default`<div class="section-list-header certificate-header--not-found">${i18n.t("connection:certificateNotFound.title")}</div>`;
    }
    return import_nanohtml4.default`<div class="section-list-header">${i18n.t("connection:certificateForDomain.title", { domain: tab.domain })}</div>`;
  }
  function renderConnectionDescription(site, tab) {
    if (site.httpsState === "invalid") {
      return i18n.t("connection:invalidConnectionDesc.title", { domain: tab.domain });
    }
    if (site.httpsState === "none") {
      return i18n.t("connection:insecureConnectionDesc.title");
    }
    if (site.httpsState === "upgraded") {
      return i18n.t("connection:upgradedConnectionDesc.title");
    }
    return i18n.t("connection:secureConnectionDesc.title");
  }

  // shared/js/browser/browser-communication.js
  var browser_communication_exports = {};
  __export(browser_communication_exports, {
    backgroundMessage: () => backgroundMessage,
    doBurn: () => doBurn,
    fetch: () => fetch,
    getBackgroundTabData: () => getBackgroundTabData,
    getBurnOptions: () => getBurnOptions,
    getPrivacyDashboardData: () => getPrivacyDashboardData,
    openOptions: () => openOptions,
    refreshAlias: () => refreshAlias,
    search: () => search,
    setBurnDefaultOption: () => setBurnDefaultOption,
    setLists: () => setLists,
    setup: () => setup,
    submitBrokenSiteReport: () => submitBrokenSiteReport
  });
  init_schema_parsers();

  // shared/js/browser/common.js
  var getContentHeight = () => {
    const $openSubviewV2 = window.document.querySelector(
      "#popup-container.sliding-subview-v2--root [data-current]:last-of-type > *:first-child"
    );
    const $rootSubviewV2 = window.document.querySelector("#popup-container.sliding-subview-v2--root .page-inner");
    return ($openSubviewV2 || $rootSubviewV2)?.scrollHeight;
  };
  function setupMutationObserver(callback) {
    const bufferHeight = 200;
    let lastHeight;
    const mutationObserver = new MutationObserver(() => {
      const contentHeight = getContentHeight();
      if (!contentHeight)
        return;
      const height = Math.min(window.screen.height - bufferHeight, contentHeight);
      if (lastHeight === height)
        return;
      lastHeight = height;
      callback(height);
    });
    const config = { childList: true, attributes: true, subtree: true };
    mutationObserver.observe(window.document, config);
  }
  var DARK_THEME = "dark";
  var LIGHT_THEME = "light";
  var explicitlySetTheme = "";
  var detectedTheme = LIGHT_THEME;
  var oppositeTheme = {
    [LIGHT_THEME]: DARK_THEME,
    [DARK_THEME]: LIGHT_THEME
  };
  function swapThemeTo(theme) {
    document.body.classList.remove(`body--theme-${oppositeTheme[theme]}`);
    document.body.classList.add(`body--theme-${theme}`);
  }
  function updateTheme() {
    if (explicitlySetTheme) {
      swapThemeTo(explicitlySetTheme);
    } else {
      swapThemeTo(detectedTheme);
    }
  }
  function setupColorScheme() {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    if (query?.matches) {
      detectedTheme = DARK_THEME;
    }
    if (query.addEventListener) {
      query?.addEventListener("change", (event) => {
        detectedTheme = event.matches ? DARK_THEME : LIGHT_THEME;
        updateTheme();
      });
    } else if ("addListener" in query) {
      query.addListener((event) => {
        detectedTheme = event.matches ? DARK_THEME : LIGHT_THEME;
        updateTheme();
      });
    }
    updateTheme();
    return (theme = "") => {
      theme = theme.trim().toLowerCase();
      if (theme === LIGHT_THEME || theme === DARK_THEME) {
        explicitlySetTheme = theme;
      } else {
        explicitlySetTheme = "";
      }
      updateTheme();
    };
  }
  function assert(condition, message = "") {
    if (!condition) {
      if (!message) {
        throw new Error("invariant");
      }
      throw new Error(message);
    }
  }
  var Msg = class {
    toJSON() {
      return {
        ...this,
        kind: this.constructor.name
      };
    }
  };
  var SetListsMessage = class extends Msg {
    /**
     * @param {object} params
     * @param {Array<{ list: "allowlisted" | "denylisted", domain: string, value: boolean}>} params.lists
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     */
    constructor(params) {
      super();
      this.lists = params.lists;
      this.eventOrigin = params.eventOrigin;
    }
  };
  var SubmitBrokenSiteReportMessage = class extends Msg {
    /**
     * @param {object} params
     * @param {string} params.category
     * @param {string} params.description
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     */
    constructor(params) {
      super();
      this.category = params.category;
      this.description = params.description;
      this.eventOrigin = params.eventOrigin;
    }
  };
  var UpdatePermissionMessage = class extends Msg {
    /**
     * @param {object} params
     * @param {string} params.id
     * @param {string} params.value
     */
    constructor(params) {
      super();
      this.id = params.id;
      this.value = params.value;
    }
  };
  var CloseMessage = class extends Msg {
    /**
     * @param {object} params
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     */
    constructor(params) {
      super();
      this.eventOrigin = params.eventOrigin;
    }
  };
  var CheckBrokenSiteReportHandledMessage = class extends Msg {
  };
  var RefreshEmailAliasMessage = class extends Msg {
  };
  var OpenOptionsMessage = class extends Msg {
  };
  var ShowAlertForMissingDescription = class extends Msg {
  };
  var ShowNativeFeedback = class extends Msg {
  };
  var TelemetrySpanMsg = class extends Msg {
    /**
     * @param {object} params
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     * @param {import('../../../schema/__generated__/schema.types').TelemetrySpan['attributes']} params.attributes
     */
    constructor(params) {
      super();
      this.eventOrigin = params.eventOrigin;
      this.attributes = params.attributes;
    }
  };
  var SearchMessage = class extends Msg {
    /**
     * @param {object} params
     * @param {string} params.term
     */
    constructor(params) {
      super();
      this.term = params.term;
    }
  };
  var OpenSettingsMessages = class extends Msg {
    /**
     * @param {object} params
     * @param {'cpm'} params.target
     */
    constructor(params) {
      super();
      this.target = params.target;
    }
  };
  var BurnMessage = class extends Msg {
    /**
     * @param {import('../../../schema/__generated__/schema.types').FireOption} opts
     */
    constructor(opts) {
      super();
      Object.assign(this, opts);
    }
  };
  var FetchBurnOptions = class extends Msg {
  };
  var FetchToggleReportOptions = class extends Msg {
  };
  var SendToggleBreakageReport = class extends Msg {
  };
  var RejectToggleBreakageReport = class extends Msg {
  };
  var SeeWhatIsSent = class extends Msg {
  };
  var SetBurnDefaultOption = class extends Msg {
    /**
     * @param {import('../../../schema/__generated__/schema.types').FireOption['name']} name
     */
    constructor(name) {
      super();
      this.defaultOption = name;
    }
  };

  // shared/js/browser/browser-communication.js
  init_protections();
  var channel;
  function setup() {
    setupColorScheme();
  }
  async function fetch(message) {
    if (message instanceof CheckBrokenSiteReportHandledMessage) {
      return false;
    }
    if (message instanceof SubmitBrokenSiteReportMessage) {
      return submitBrokenSiteReport(message);
    }
    if (message instanceof SetListsMessage) {
      return setLists(message);
    }
    if (message instanceof SearchMessage) {
      return search(message);
    }
    if (message instanceof RefreshEmailAliasMessage) {
      return refreshAlias();
    }
    if (message instanceof OpenOptionsMessage) {
      return openOptions();
    }
    if (message instanceof BurnMessage) {
      return doBurn(message);
    }
    if (message instanceof FetchBurnOptions) {
      return getBurnOptions();
    }
    if (message instanceof SetBurnDefaultOption) {
      return setBurnDefaultOption(message);
    }
    return new Promise((resolve) => {
      window.chrome.runtime.sendMessage(message, (result) => {
        resolve(result);
      });
    });
  }
  function toExtensionMessage(name, data) {
    const outgoing = {
      messageType: name,
      options: data
    };
    return new Promise((resolve) => {
      window.chrome.runtime.sendMessage(outgoing, (result) => {
        if (window.chrome.runtime.lastError) {
          console.error("window.chrome.runtime.lastError", window.chrome.runtime.lastError);
        }
        resolve(result);
      });
    });
  }
  async function submitBrokenSiteReport(report) {
    const parsedInput = breakageReportRequestSchema.parse(report);
    toExtensionMessage("submitBrokenSiteReport", parsedInput);
  }
  async function setLists(options) {
    const parsedInput = setListOptionsSchema.parse(options);
    return toExtensionMessage("setLists", parsedInput);
  }
  async function refreshAlias() {
    const result = await toExtensionMessage("refreshAlias");
    return refreshAliasResponseSchema.parse(result);
  }
  async function search(options) {
    return toExtensionMessage("search", options);
  }
  async function openOptions() {
    return toExtensionMessage("openOptions");
  }
  function getBurnOptions() {
    return toExtensionMessage("getBurnOptions");
  }
  function setBurnDefaultOption(message) {
    return toExtensionMessage("setBurnDefaultOption", message);
  }
  async function doBurn(message) {
    const browsingDataPermissions = {
      permissions: ["browsingData"]
    };
    const permissionRequestGranted = await new Promise((resolve) => chrome.permissions.request(browsingDataPermissions, resolve));
    if (!permissionRequestGranted) {
      throw new Error("Permission not granted");
    }
    return toExtensionMessage("doBurn", message);
  }
  async function getPrivacyDashboardData(tabId) {
    return toExtensionMessage("getPrivacyDashboardData", { tabId });
  }
  function backgroundMessage(_channel) {
    channel = _channel;
    window.chrome.runtime.onMessage.addListener((req, sender) => {
      if (sender.id !== window.chrome.runtime.id) {
        return;
      }
      if (req.updateTabData)
        channel.send("updateTabData");
      if (req.didResetTrackersData)
        channel.send("updateTabData");
      if (req.closePopup)
        window.close();
    });
  }
  async function getBackgroundTabData() {
    const tabIdParam = new URL(document.location.href).searchParams.get("tabId");
    const isNumeric = tabIdParam && !Number.isNaN(Number(tabIdParam));
    const tabId = isNumeric ? Number(tabIdParam) : null;
    const resp = await getPrivacyDashboardData(tabId);
    const parsedMessageData = getPrivacyDashboardDataSchema.safeParse(resp);
    if (parsedMessageData.success === true) {
      const { tab, emailProtectionUserData, requestData, fireButton } = parsedMessageData.data;
      const { upgradedHttps: upgradedHttps4, url, parentEntity: parentEntity4, specialDomainName, id, localeSettings } = tab;
      const protections5 = new Protections(
        tab.protections.unprotectedTemporary,
        tab.protections.enabledFeatures,
        tab.protections.allowlisted,
        tab.protections.denylisted
      );
      return {
        tab: {
          ...createTabData(url, upgradedHttps4, protections5, requestData),
          id,
          // if the extension sends this value, then use it as-is. Otherwise, the default of 'en' will take effect
          locale: localeSettings?.locale,
          search: {},
          emailProtection: {},
          ctaScreens: {},
          parentEntity: parentEntity4,
          specialDomainName
        },
        emailProtectionUserData,
        fireButton
      };
    }
    if (!window.__playwright) {
      console.log("\u{1F64F} getBackgroundTabData \u274C", parsedMessageData.error, resp);
    }
    const protections4 = {
      allowlisted: false,
      denylisted: false,
      enabledFeatures: ["contentBlocking"],
      unprotectedTemporary: false
    };
    return {
      tab: {
        ...createTabData("unknown", false, protections4, { requests: [] }),
        error: parsedMessageData.error.message,
        search: {},
        ctaScreens: {}
      }
    };
  }

  // shared/js/browser/ios-communication.js
  var ios_communication_exports = {};
  __export(ios_communication_exports, {
    backgroundMessage: () => backgroundMessage2,
    fetch: () => fetch3,
    getBackgroundTabData: () => getBackgroundTabData2,
    privacyDashboardShowAlertForMissingDescription: () => privacyDashboardShowAlertForMissingDescription,
    privacyDashboardShowNativeFeedback: () => privacyDashboardShowNativeFeedback,
    privacyDashboardShowReportBrokenSite: () => privacyDashboardShowReportBrokenSite,
    privacyDashboardTelemetrySpan: () => privacyDashboardTelemetrySpan,
    setup: () => setup3
  });

  // node_modules/tiny-invariant/dist/esm/tiny-invariant.js
  var isProduction = false;
  var prefix = "Invariant failed";
  function invariant(condition, message) {
    if (condition) {
      return;
    }
    if (isProduction) {
      throw new Error(prefix);
    }
    var provided = typeof message === "function" ? message() : message;
    var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
    throw new Error(value);
  }

  // shared/js/browser/macos-communication.js
  var macos_communication_exports = {};
  __export(macos_communication_exports, {
    backgroundMessage: () => backgroundMessage2,
    fetch: () => fetch2,
    firstRenderComplete: () => firstRenderComplete,
    getBackgroundTabData: () => getBackgroundTabData2,
    onChangeConsentManaged: () => onChangeConsentManaged,
    onChangeLocale: () => onChangeLocale,
    onChangeProtectionStatus: () => onChangeProtectionStatus,
    onChangeRequestData: () => onChangeRequestData,
    privacyDashboardClose: () => privacyDashboardClose,
    privacyDashboardGetToggleReportOptions: () => privacyDashboardGetToggleReportOptions,
    privacyDashboardOpenSettings: () => privacyDashboardOpenSettings,
    privacyDashboardOpenUrlInNewTab: () => privacyDashboardOpenUrlInNewTab,
    privacyDashboardRejectToggleReport: () => privacyDashboardRejectToggleReport,
    privacyDashboardSeeWhatIsSent: () => privacyDashboardSeeWhatIsSent,
    privacyDashboardSendToggleReport: () => privacyDashboardSendToggleReport,
    privacyDashboardSetPermission: () => privacyDashboardSetPermission,
    privacyDashboardSetProtection: () => privacyDashboardSetProtection,
    privacyDashboardSetSize: () => privacyDashboardSetSize,
    privacyDashboardSubmitBrokenSiteReport: () => privacyDashboardSubmitBrokenSiteReport,
    setup: () => setup2,
    setupShared: () => setupShared
  });
  init_schema_parsers();

  // node_modules/@material/ripple/util.js
  var supportsCssVariables_;
  function supportsCssVariables(windowObj, forceRefresh) {
    if (forceRefresh === void 0) {
      forceRefresh = false;
    }
    var CSS = windowObj.CSS;
    var supportsCssVars = supportsCssVariables_;
    if (typeof supportsCssVariables_ === "boolean" && !forceRefresh) {
      return supportsCssVariables_;
    }
    var supportsFunctionPresent = CSS && typeof CSS.supports === "function";
    if (!supportsFunctionPresent) {
      return false;
    }
    var explicitlySupportsCssVars = CSS.supports("--css-vars", "yes");
    var weAreFeatureDetectingSafari10plus = CSS.supports("(--css-vars: yes)") && CSS.supports("color", "#00000000");
    supportsCssVars = explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
    if (!forceRefresh) {
      supportsCssVariables_ = supportsCssVars;
    }
    return supportsCssVars;
  }
  function getNormalizedEventCoords(evt, pageOffset, clientRect) {
    if (!evt) {
      return { x: 0, y: 0 };
    }
    var x2 = pageOffset.x, y3 = pageOffset.y;
    var documentX = x2 + clientRect.left;
    var documentY = y3 + clientRect.top;
    var normalizedX;
    var normalizedY;
    if (evt.type === "touchstart") {
      var touchEvent = evt;
      normalizedX = touchEvent.changedTouches[0].pageX - documentX;
      normalizedY = touchEvent.changedTouches[0].pageY - documentY;
    } else {
      var mouseEvent = evt;
      normalizedX = mouseEvent.pageX - documentX;
      normalizedY = mouseEvent.pageY - documentY;
    }
    return { x: normalizedX, y: normalizedY };
  }

  // node_modules/@material/base/foundation.js
  var MDCFoundation = (
    /** @class */
    function() {
      function MDCFoundation2(adapter) {
        if (adapter === void 0) {
          adapter = {};
        }
        this.adapter = adapter;
      }
      Object.defineProperty(MDCFoundation2, "cssClasses", {
        get: function() {
          return {};
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MDCFoundation2, "strings", {
        get: function() {
          return {};
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MDCFoundation2, "numbers", {
        get: function() {
          return {};
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MDCFoundation2, "defaultAdapter", {
        get: function() {
          return {};
        },
        enumerable: false,
        configurable: true
      });
      MDCFoundation2.prototype.init = function() {
      };
      MDCFoundation2.prototype.destroy = function() {
      };
      return MDCFoundation2;
    }()
  );

  // node_modules/@material/base/component.js
  var MDCComponent = (
    /** @class */
    function() {
      function MDCComponent2(root, foundation) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
          args[_i - 2] = arguments[_i];
        }
        this.root = root;
        this.initialize.apply(this, __spreadArray([], __read(args)));
        this.foundation = foundation === void 0 ? this.getDefaultFoundation() : foundation;
        this.foundation.init();
        this.initialSyncWithDOM();
      }
      MDCComponent2.attachTo = function(root) {
        return new MDCComponent2(root, new MDCFoundation({}));
      };
      MDCComponent2.prototype.initialize = function() {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          _args[_i] = arguments[_i];
        }
      };
      MDCComponent2.prototype.getDefaultFoundation = function() {
        throw new Error("Subclasses must override getDefaultFoundation to return a properly configured foundation class");
      };
      MDCComponent2.prototype.initialSyncWithDOM = function() {
      };
      MDCComponent2.prototype.destroy = function() {
        this.foundation.destroy();
      };
      MDCComponent2.prototype.listen = function(evtType, handler, options) {
        this.root.addEventListener(evtType, handler, options);
      };
      MDCComponent2.prototype.unlisten = function(evtType, handler, options) {
        this.root.removeEventListener(evtType, handler, options);
      };
      MDCComponent2.prototype.emit = function(evtType, evtData, shouldBubble) {
        if (shouldBubble === void 0) {
          shouldBubble = false;
        }
        var evt;
        if (typeof CustomEvent === "function") {
          evt = new CustomEvent(evtType, {
            bubbles: shouldBubble,
            detail: evtData
          });
        } else {
          evt = document.createEvent("CustomEvent");
          evt.initCustomEvent(evtType, shouldBubble, false, evtData);
        }
        this.root.dispatchEvent(evt);
      };
      return MDCComponent2;
    }()
  );

  // node_modules/@material/dom/events.js
  function applyPassive(globalObj) {
    if (globalObj === void 0) {
      globalObj = window;
    }
    return supportsPassiveOption(globalObj) ? { passive: true } : false;
  }
  function supportsPassiveOption(globalObj) {
    if (globalObj === void 0) {
      globalObj = window;
    }
    var passiveSupported = false;
    try {
      var options = {
        // This function will be called when the browser
        // attempts to access the passive property.
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      var handler = function() {
      };
      globalObj.document.addEventListener("test", handler, options);
      globalObj.document.removeEventListener("test", handler, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }

  // node_modules/@material/dom/ponyfill.js
  function matches(element, selector) {
    var nativeMatches = element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    return nativeMatches.call(element, selector);
  }

  // node_modules/@material/ripple/constants.js
  var cssClasses = {
    // Ripple is a special case where the "root" component is really a "mixin" of sorts,
    // given that it's an 'upgrade' to an existing component. That being said it is the root
    // CSS class that all other CSS classes derive from.
    BG_FOCUSED: "mdc-ripple-upgraded--background-focused",
    FG_ACTIVATION: "mdc-ripple-upgraded--foreground-activation",
    FG_DEACTIVATION: "mdc-ripple-upgraded--foreground-deactivation",
    ROOT: "mdc-ripple-upgraded",
    UNBOUNDED: "mdc-ripple-upgraded--unbounded"
  };
  var strings = {
    VAR_FG_SCALE: "--mdc-ripple-fg-scale",
    VAR_FG_SIZE: "--mdc-ripple-fg-size",
    VAR_FG_TRANSLATE_END: "--mdc-ripple-fg-translate-end",
    VAR_FG_TRANSLATE_START: "--mdc-ripple-fg-translate-start",
    VAR_LEFT: "--mdc-ripple-left",
    VAR_TOP: "--mdc-ripple-top"
  };
  var numbers = {
    DEACTIVATION_TIMEOUT_MS: 225,
    FG_DEACTIVATION_MS: 150,
    INITIAL_ORIGIN_SCALE: 0.6,
    PADDING: 10,
    TAP_DELAY_MS: 300
    // Delay between touch and simulated mouse events on touch devices
  };

  // node_modules/@material/ripple/foundation.js
  var ACTIVATION_EVENT_TYPES = [
    "touchstart",
    "pointerdown",
    "mousedown",
    "keydown"
  ];
  var POINTER_DEACTIVATION_EVENT_TYPES = [
    "touchend",
    "pointerup",
    "mouseup",
    "contextmenu"
  ];
  var activatedTargets = [];
  var MDCRippleFoundation = (
    /** @class */
    function(_super) {
      __extends(MDCRippleFoundation2, _super);
      function MDCRippleFoundation2(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation2.defaultAdapter), adapter)) || this;
        _this.activationAnimationHasEnded = false;
        _this.activationTimer = 0;
        _this.fgDeactivationRemovalTimer = 0;
        _this.fgScale = "0";
        _this.frame = { width: 0, height: 0 };
        _this.initialSize = 0;
        _this.layoutFrame = 0;
        _this.maxRadius = 0;
        _this.unboundedCoords = { left: 0, top: 0 };
        _this.activationState = _this.defaultActivationState();
        _this.activationTimerCallback = function() {
          _this.activationAnimationHasEnded = true;
          _this.runDeactivationUXLogicIfReady();
        };
        _this.activateHandler = function(e3) {
          _this.activateImpl(e3);
        };
        _this.deactivateHandler = function() {
          _this.deactivateImpl();
        };
        _this.focusHandler = function() {
          _this.handleFocus();
        };
        _this.blurHandler = function() {
          _this.handleBlur();
        };
        _this.resizeHandler = function() {
          _this.layout();
        };
        return _this;
      }
      Object.defineProperty(MDCRippleFoundation2, "cssClasses", {
        get: function() {
          return cssClasses;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MDCRippleFoundation2, "strings", {
        get: function() {
          return strings;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MDCRippleFoundation2, "numbers", {
        get: function() {
          return numbers;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MDCRippleFoundation2, "defaultAdapter", {
        get: function() {
          return {
            addClass: function() {
              return void 0;
            },
            browserSupportsCssVars: function() {
              return true;
            },
            computeBoundingRect: function() {
              return { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
            },
            containsEventTarget: function() {
              return true;
            },
            deregisterDocumentInteractionHandler: function() {
              return void 0;
            },
            deregisterInteractionHandler: function() {
              return void 0;
            },
            deregisterResizeHandler: function() {
              return void 0;
            },
            getWindowPageOffset: function() {
              return { x: 0, y: 0 };
            },
            isSurfaceActive: function() {
              return true;
            },
            isSurfaceDisabled: function() {
              return true;
            },
            isUnbounded: function() {
              return true;
            },
            registerDocumentInteractionHandler: function() {
              return void 0;
            },
            registerInteractionHandler: function() {
              return void 0;
            },
            registerResizeHandler: function() {
              return void 0;
            },
            removeClass: function() {
              return void 0;
            },
            updateCssVariable: function() {
              return void 0;
            }
          };
        },
        enumerable: false,
        configurable: true
      });
      MDCRippleFoundation2.prototype.init = function() {
        var _this = this;
        var supportsPressRipple = this.supportsPressRipple();
        this.registerRootHandlers(supportsPressRipple);
        if (supportsPressRipple) {
          var _a2 = MDCRippleFoundation2.cssClasses, ROOT_1 = _a2.ROOT, UNBOUNDED_1 = _a2.UNBOUNDED;
          requestAnimationFrame(function() {
            _this.adapter.addClass(ROOT_1);
            if (_this.adapter.isUnbounded()) {
              _this.adapter.addClass(UNBOUNDED_1);
              _this.layoutInternal();
            }
          });
        }
      };
      MDCRippleFoundation2.prototype.destroy = function() {
        var _this = this;
        if (this.supportsPressRipple()) {
          if (this.activationTimer) {
            clearTimeout(this.activationTimer);
            this.activationTimer = 0;
            this.adapter.removeClass(MDCRippleFoundation2.cssClasses.FG_ACTIVATION);
          }
          if (this.fgDeactivationRemovalTimer) {
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.fgDeactivationRemovalTimer = 0;
            this.adapter.removeClass(MDCRippleFoundation2.cssClasses.FG_DEACTIVATION);
          }
          var _a2 = MDCRippleFoundation2.cssClasses, ROOT_2 = _a2.ROOT, UNBOUNDED_2 = _a2.UNBOUNDED;
          requestAnimationFrame(function() {
            _this.adapter.removeClass(ROOT_2);
            _this.adapter.removeClass(UNBOUNDED_2);
            _this.removeCssVars();
          });
        }
        this.deregisterRootHandlers();
        this.deregisterDeactivationHandlers();
      };
      MDCRippleFoundation2.prototype.activate = function(evt) {
        this.activateImpl(evt);
      };
      MDCRippleFoundation2.prototype.deactivate = function() {
        this.deactivateImpl();
      };
      MDCRippleFoundation2.prototype.layout = function() {
        var _this = this;
        if (this.layoutFrame) {
          cancelAnimationFrame(this.layoutFrame);
        }
        this.layoutFrame = requestAnimationFrame(function() {
          _this.layoutInternal();
          _this.layoutFrame = 0;
        });
      };
      MDCRippleFoundation2.prototype.setUnbounded = function(unbounded) {
        var UNBOUNDED = MDCRippleFoundation2.cssClasses.UNBOUNDED;
        if (unbounded) {
          this.adapter.addClass(UNBOUNDED);
        } else {
          this.adapter.removeClass(UNBOUNDED);
        }
      };
      MDCRippleFoundation2.prototype.handleFocus = function() {
        var _this = this;
        requestAnimationFrame(function() {
          return _this.adapter.addClass(MDCRippleFoundation2.cssClasses.BG_FOCUSED);
        });
      };
      MDCRippleFoundation2.prototype.handleBlur = function() {
        var _this = this;
        requestAnimationFrame(function() {
          return _this.adapter.removeClass(MDCRippleFoundation2.cssClasses.BG_FOCUSED);
        });
      };
      MDCRippleFoundation2.prototype.supportsPressRipple = function() {
        return this.adapter.browserSupportsCssVars();
      };
      MDCRippleFoundation2.prototype.defaultActivationState = function() {
        return {
          activationEvent: void 0,
          hasDeactivationUXRun: false,
          isActivated: false,
          isProgrammatic: false,
          wasActivatedByPointer: false,
          wasElementMadeActive: false
        };
      };
      MDCRippleFoundation2.prototype.registerRootHandlers = function(supportsPressRipple) {
        var e_1, _a2;
        if (supportsPressRipple) {
          try {
            for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
              var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
              this.adapter.registerInteractionHandler(evtType, this.activateHandler);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a2 = ACTIVATION_EVENT_TYPES_1.return))
                _a2.call(ACTIVATION_EVENT_TYPES_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          if (this.adapter.isUnbounded()) {
            this.adapter.registerResizeHandler(this.resizeHandler);
          }
        }
        this.adapter.registerInteractionHandler("focus", this.focusHandler);
        this.adapter.registerInteractionHandler("blur", this.blurHandler);
      };
      MDCRippleFoundation2.prototype.registerDeactivationHandlers = function(evt) {
        var e_2, _a2;
        if (evt.type === "keydown") {
          this.adapter.registerInteractionHandler("keyup", this.deactivateHandler);
        } else {
          try {
            for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
              var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
              this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a2 = POINTER_DEACTIVATION_EVENT_TYPES_1.return))
                _a2.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
        }
      };
      MDCRippleFoundation2.prototype.deregisterRootHandlers = function() {
        var e_3, _a2;
        try {
          for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
            var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
            this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a2 = ACTIVATION_EVENT_TYPES_2.return))
              _a2.call(ACTIVATION_EVENT_TYPES_2);
          } finally {
            if (e_3)
              throw e_3.error;
          }
        }
        this.adapter.deregisterInteractionHandler("focus", this.focusHandler);
        this.adapter.deregisterInteractionHandler("blur", this.blurHandler);
        if (this.adapter.isUnbounded()) {
          this.adapter.deregisterResizeHandler(this.resizeHandler);
        }
      };
      MDCRippleFoundation2.prototype.deregisterDeactivationHandlers = function() {
        var e_4, _a2;
        this.adapter.deregisterInteractionHandler("keyup", this.deactivateHandler);
        try {
          for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
            var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
            this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
          }
        } catch (e_4_1) {
          e_4 = { error: e_4_1 };
        } finally {
          try {
            if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a2 = POINTER_DEACTIVATION_EVENT_TYPES_2.return))
              _a2.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
          } finally {
            if (e_4)
              throw e_4.error;
          }
        }
      };
      MDCRippleFoundation2.prototype.removeCssVars = function() {
        var _this = this;
        var rippleStrings = MDCRippleFoundation2.strings;
        var keys = Object.keys(rippleStrings);
        keys.forEach(function(key) {
          if (key.indexOf("VAR_") === 0) {
            _this.adapter.updateCssVariable(rippleStrings[key], null);
          }
        });
      };
      MDCRippleFoundation2.prototype.activateImpl = function(evt) {
        var _this = this;
        if (this.adapter.isSurfaceDisabled()) {
          return;
        }
        var activationState = this.activationState;
        if (activationState.isActivated) {
          return;
        }
        var previousActivationEvent = this.previousActivationEvent;
        var isSameInteraction = previousActivationEvent && evt !== void 0 && previousActivationEvent.type !== evt.type;
        if (isSameInteraction) {
          return;
        }
        activationState.isActivated = true;
        activationState.isProgrammatic = evt === void 0;
        activationState.activationEvent = evt;
        activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== void 0 && (evt.type === "mousedown" || evt.type === "touchstart" || evt.type === "pointerdown");
        var hasActivatedChild = evt !== void 0 && activatedTargets.length > 0 && activatedTargets.some(function(target) {
          return _this.adapter.containsEventTarget(target);
        });
        if (hasActivatedChild) {
          this.resetActivationState();
          return;
        }
        if (evt !== void 0) {
          activatedTargets.push(evt.target);
          this.registerDeactivationHandlers(evt);
        }
        activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
        if (activationState.wasElementMadeActive) {
          this.animateActivation();
        }
        requestAnimationFrame(function() {
          activatedTargets = [];
          if (!activationState.wasElementMadeActive && evt !== void 0 && (evt.key === " " || evt.keyCode === 32)) {
            activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
              _this.animateActivation();
            }
          }
          if (!activationState.wasElementMadeActive) {
            _this.activationState = _this.defaultActivationState();
          }
        });
      };
      MDCRippleFoundation2.prototype.checkElementMadeActive = function(evt) {
        return evt !== void 0 && evt.type === "keydown" ? this.adapter.isSurfaceActive() : true;
      };
      MDCRippleFoundation2.prototype.animateActivation = function() {
        var _this = this;
        var _a2 = MDCRippleFoundation2.strings, VAR_FG_TRANSLATE_START = _a2.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a2.VAR_FG_TRANSLATE_END;
        var _b = MDCRippleFoundation2.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
        var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation2.numbers.DEACTIVATION_TIMEOUT_MS;
        this.layoutInternal();
        var translateStart = "";
        var translateEnd = "";
        if (!this.adapter.isUnbounded()) {
          var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
          translateStart = startPoint.x + "px, " + startPoint.y + "px";
          translateEnd = endPoint.x + "px, " + endPoint.y + "px";
        }
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
        clearTimeout(this.activationTimer);
        clearTimeout(this.fgDeactivationRemovalTimer);
        this.rmBoundedActivationClasses();
        this.adapter.removeClass(FG_DEACTIVATION);
        this.adapter.computeBoundingRect();
        this.adapter.addClass(FG_ACTIVATION);
        this.activationTimer = setTimeout(function() {
          _this.activationTimerCallback();
        }, DEACTIVATION_TIMEOUT_MS);
      };
      MDCRippleFoundation2.prototype.getFgTranslationCoordinates = function() {
        var _a2 = this.activationState, activationEvent = _a2.activationEvent, wasActivatedByPointer = _a2.wasActivatedByPointer;
        var startPoint;
        if (wasActivatedByPointer) {
          startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
        } else {
          startPoint = {
            x: this.frame.width / 2,
            y: this.frame.height / 2
          };
        }
        startPoint = {
          x: startPoint.x - this.initialSize / 2,
          y: startPoint.y - this.initialSize / 2
        };
        var endPoint = {
          x: this.frame.width / 2 - this.initialSize / 2,
          y: this.frame.height / 2 - this.initialSize / 2
        };
        return { startPoint, endPoint };
      };
      MDCRippleFoundation2.prototype.runDeactivationUXLogicIfReady = function() {
        var _this = this;
        var FG_DEACTIVATION = MDCRippleFoundation2.cssClasses.FG_DEACTIVATION;
        var _a2 = this.activationState, hasDeactivationUXRun = _a2.hasDeactivationUXRun, isActivated = _a2.isActivated;
        var activationHasEnded = hasDeactivationUXRun || !isActivated;
        if (activationHasEnded && this.activationAnimationHasEnded) {
          this.rmBoundedActivationClasses();
          this.adapter.addClass(FG_DEACTIVATION);
          this.fgDeactivationRemovalTimer = setTimeout(function() {
            _this.adapter.removeClass(FG_DEACTIVATION);
          }, numbers.FG_DEACTIVATION_MS);
        }
      };
      MDCRippleFoundation2.prototype.rmBoundedActivationClasses = function() {
        var FG_ACTIVATION = MDCRippleFoundation2.cssClasses.FG_ACTIVATION;
        this.adapter.removeClass(FG_ACTIVATION);
        this.activationAnimationHasEnded = false;
        this.adapter.computeBoundingRect();
      };
      MDCRippleFoundation2.prototype.resetActivationState = function() {
        var _this = this;
        this.previousActivationEvent = this.activationState.activationEvent;
        this.activationState = this.defaultActivationState();
        setTimeout(function() {
          return _this.previousActivationEvent = void 0;
        }, MDCRippleFoundation2.numbers.TAP_DELAY_MS);
      };
      MDCRippleFoundation2.prototype.deactivateImpl = function() {
        var _this = this;
        var activationState = this.activationState;
        if (!activationState.isActivated) {
          return;
        }
        var state = __assign({}, activationState);
        if (activationState.isProgrammatic) {
          requestAnimationFrame(function() {
            _this.animateDeactivation(state);
          });
          this.resetActivationState();
        } else {
          this.deregisterDeactivationHandlers();
          requestAnimationFrame(function() {
            _this.activationState.hasDeactivationUXRun = true;
            _this.animateDeactivation(state);
            _this.resetActivationState();
          });
        }
      };
      MDCRippleFoundation2.prototype.animateDeactivation = function(_a2) {
        var wasActivatedByPointer = _a2.wasActivatedByPointer, wasElementMadeActive = _a2.wasElementMadeActive;
        if (wasActivatedByPointer || wasElementMadeActive) {
          this.runDeactivationUXLogicIfReady();
        }
      };
      MDCRippleFoundation2.prototype.layoutInternal = function() {
        var _this = this;
        this.frame = this.adapter.computeBoundingRect();
        var maxDim = Math.max(this.frame.height, this.frame.width);
        var getBoundedRadius = function() {
          var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
          return hypotenuse + MDCRippleFoundation2.numbers.PADDING;
        };
        this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
        var initialSize = Math.floor(maxDim * MDCRippleFoundation2.numbers.INITIAL_ORIGIN_SCALE);
        if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
          this.initialSize = initialSize - 1;
        } else {
          this.initialSize = initialSize;
        }
        this.fgScale = "" + this.maxRadius / this.initialSize;
        this.updateLayoutCssVars();
      };
      MDCRippleFoundation2.prototype.updateLayoutCssVars = function() {
        var _a2 = MDCRippleFoundation2.strings, VAR_FG_SIZE = _a2.VAR_FG_SIZE, VAR_LEFT = _a2.VAR_LEFT, VAR_TOP = _a2.VAR_TOP, VAR_FG_SCALE = _a2.VAR_FG_SCALE;
        this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
        this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
        if (this.adapter.isUnbounded()) {
          this.unboundedCoords = {
            left: Math.round(this.frame.width / 2 - this.initialSize / 2),
            top: Math.round(this.frame.height / 2 - this.initialSize / 2)
          };
          this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
          this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
        }
      };
      return MDCRippleFoundation2;
    }(MDCFoundation)
  );

  // node_modules/@material/ripple/component.js
  var MDCRipple = (
    /** @class */
    function(_super) {
      __extends(MDCRipple2, _super);
      function MDCRipple2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.disabled = false;
        return _this;
      }
      MDCRipple2.attachTo = function(root, opts) {
        if (opts === void 0) {
          opts = {
            isUnbounded: void 0
          };
        }
        var ripple = new MDCRipple2(root);
        if (opts.isUnbounded !== void 0) {
          ripple.unbounded = opts.isUnbounded;
        }
        return ripple;
      };
      MDCRipple2.createAdapter = function(instance2) {
        return {
          addClass: function(className) {
            return instance2.root.classList.add(className);
          },
          browserSupportsCssVars: function() {
            return supportsCssVariables(window);
          },
          computeBoundingRect: function() {
            return instance2.root.getBoundingClientRect();
          },
          containsEventTarget: function(target) {
            return instance2.root.contains(target);
          },
          deregisterDocumentInteractionHandler: function(evtType, handler) {
            return document.documentElement.removeEventListener(evtType, handler, applyPassive());
          },
          deregisterInteractionHandler: function(evtType, handler) {
            return instance2.root.removeEventListener(evtType, handler, applyPassive());
          },
          deregisterResizeHandler: function(handler) {
            return window.removeEventListener("resize", handler);
          },
          getWindowPageOffset: function() {
            return { x: window.pageXOffset, y: window.pageYOffset };
          },
          isSurfaceActive: function() {
            return matches(instance2.root, ":active");
          },
          isSurfaceDisabled: function() {
            return Boolean(instance2.disabled);
          },
          isUnbounded: function() {
            return Boolean(instance2.unbounded);
          },
          registerDocumentInteractionHandler: function(evtType, handler) {
            return document.documentElement.addEventListener(evtType, handler, applyPassive());
          },
          registerInteractionHandler: function(evtType, handler) {
            return instance2.root.addEventListener(evtType, handler, applyPassive());
          },
          registerResizeHandler: function(handler) {
            return window.addEventListener("resize", handler);
          },
          removeClass: function(className) {
            return instance2.root.classList.remove(className);
          },
          updateCssVariable: function(varName, value) {
            return instance2.root.style.setProperty(varName, value);
          }
        };
      };
      Object.defineProperty(MDCRipple2.prototype, "unbounded", {
        get: function() {
          return Boolean(this.isUnbounded);
        },
        set: function(unbounded) {
          this.isUnbounded = Boolean(unbounded);
          this.setUnbounded();
        },
        enumerable: false,
        configurable: true
      });
      MDCRipple2.prototype.activate = function() {
        this.foundation.activate();
      };
      MDCRipple2.prototype.deactivate = function() {
        this.foundation.deactivate();
      };
      MDCRipple2.prototype.layout = function() {
        this.foundation.layout();
      };
      MDCRipple2.prototype.getDefaultFoundation = function() {
        return new MDCRippleFoundation(MDCRipple2.createAdapter(this));
      };
      MDCRipple2.prototype.initialSyncWithDOM = function() {
        var root = this.root;
        this.isUnbounded = "mdcRippleIsUnbounded" in root.dataset;
      };
      MDCRipple2.prototype.setUnbounded = function() {
        this.foundation.setUnbounded(Boolean(this.isUnbounded));
      };
      return MDCRipple2;
    }(MDCComponent)
  );

  // shared/js/ui/views/utils/utils.js
  var seen = /* @__PURE__ */ new WeakSet();
  var seenSwitch = /* @__PURE__ */ new WeakSet();
  function setupBlurOnLongPress() {
    let pressedTime = 0;
    const hasPointerEvents = "PointerEvent" in window || window.navigator && "msPointerEnabled" in window.navigator;
    const isTouch = "ontouchstart" in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const mouseDown = hasPointerEvents ? "pointerdown" : isTouch ? "touchstart" : "mousedown";
    const mouseUp = hasPointerEvents ? "pointerup" : isTouch ? "touchend" : "mouseup";
    document.addEventListener(mouseDown, () => {
      pressedTime = 0;
    });
    document.addEventListener(mouseUp, (event) => {
      const now = Date.now();
      const delta = (now - pressedTime) / 1e3;
      const target = event.target;
      if (delta > 0.5 && target instanceof HTMLElement) {
        const trigger = target.closest("a,button");
        if (trigger instanceof HTMLElement) {
          if (seen.has(trigger) || seenSwitch.has(trigger)) {
            trigger?.blur();
          }
        }
      }
    });
  }
  function setupGlobalOpenerListener(cb) {
    document.addEventListener("click", (e3) => {
      const targetElem = e3.target;
      if (targetElem instanceof HTMLAnchorElement) {
        if (targetElem.target === "_blank" && targetElem.origin) {
          e3.preventDefault();
          cb(targetElem.href);
        }
      }
    });
  }

  // shared/js/browser/macos-communication.js
  var channel2 = null;
  var backgroundMessage2 = (backgroundModel) => {
    channel2 = backgroundModel;
  };
  var getBackgroundTabDataPromises = [];
  var trackerBlockingData;
  var permissionsData;
  var certificateData;
  var upgradedHttps;
  var protections;
  var isPendingUpdates;
  var parentEntity;
  var cookiePromptManagementStatus = {};
  var locale;
  var combineSources = () => ({
    tab: Object.assign(
      {},
      trackerBlockingData || {},
      {
        isPendingUpdates,
        parentEntity,
        cookiePromptManagementStatus,
        platformLimitations: true,
        locale
      },
      permissionsData ? { permissions: permissionsData } : {},
      certificateData ? { certificate: certificateData } : {}
    )
  });
  var resolveInitialRender = function() {
    const isUpgradedHttpsSet = typeof upgradedHttps === "boolean";
    const isIsProtectedSet = typeof protections !== "undefined";
    const isTrackerBlockingDataSet = typeof trackerBlockingData === "object";
    const isLocaleSet = typeof locale === "string";
    if (!isLocaleSet || !isUpgradedHttpsSet || !isIsProtectedSet || !isTrackerBlockingDataSet) {
      return;
    }
    getBackgroundTabDataPromises.forEach((resolve) => resolve(combineSources()));
    channel2?.send("updateTabData");
  };
  function onChangeRequestData(tabUrl, rawRequestData) {
    const requestData = requestDataSchema.safeParse(rawRequestData);
    if (!protections)
      throw new Error("protections status not set");
    if (!requestData.success) {
      console.error("could not parse incoming request data from `onChangeRequestData`");
      console.log(requestData.error);
      return;
    }
    trackerBlockingData = createTabData(tabUrl, upgradedHttps, protections, requestData.data);
    resolveInitialRender();
  }
  function onChangeProtectionStatus(protectionsStatus) {
    const parsed = protectionsStatusSchema.safeParse(protectionsStatus);
    if (!parsed.success) {
      console.error("could not parse incoming protection status from onChangeProtectionStatus");
      console.error(parsed.error);
      return;
    }
    protections = parsed.data;
    resolveInitialRender();
  }
  function onChangeLocale(payload) {
    const parsed = localeSettingsSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("could not parse incoming data from onChangeLocale");
      console.error(parsed.error);
      return;
    }
    locale = parsed.data.locale;
    channel2?.send("updateTabData");
  }
  function onChangeConsentManaged(payload) {
    const parsed = cookiePromptManagementStatusSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("could not parse incoming data from onChangeConsentManaged");
      console.error(parsed.error);
      return;
    }
    Object.assign(cookiePromptManagementStatus, parsed.data);
    channel2?.send("updateTabData");
  }
  function privacyDashboardSetProtection(params) {
    invariant(
      window.webkit?.messageHandlers?.privacyDashboardSetProtection,
      "webkit.messageHandlers.privacyDashboardSetProtection required"
    );
    window.webkit.messageHandlers.privacyDashboardSetProtection.postMessage(params);
  }
  function privacyDashboardSetPermission(params) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardSetPermission.postMessage(params);
  }
  function privacyDashboardGetToggleReportOptions() {
    return new Promise((resolve) => {
      invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
      invariant(window.webkit.messageHandlers.privacyDashboardGetToggleReportOptions, "privacyDashboardGetToggleReportOptions required");
      window.webkit.messageHandlers.privacyDashboardGetToggleReportOptions.postMessage({});
      window.onGetToggleReportOptionsResponse = (data) => {
        resolve(data);
        Reflect.deleteProperty(window, "onGetToggleReportOptionsResponse");
      };
    });
  }
  function privacyDashboardSendToggleReport() {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    invariant(window.webkit.messageHandlers.privacyDashboardSendToggleReport, "privacyDashboardSendToggleReport required");
    return window.webkit.messageHandlers.privacyDashboardSendToggleReport.postMessage({});
  }
  function privacyDashboardRejectToggleReport() {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    invariant(window.webkit.messageHandlers.privacyDashboardRejectToggleReport, "privacyDashboardRejectToggleReport required");
    return window.webkit.messageHandlers.privacyDashboardRejectToggleReport.postMessage({});
  }
  function privacyDashboardSeeWhatIsSent() {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    invariant(window.webkit.messageHandlers.privacyDashboardSeeWhatIsSent, "privacyDashboardSeeWhatIsSent required");
    return window.webkit.messageHandlers.privacyDashboardSeeWhatIsSent.postMessage({});
  }
  function privacyDashboardClose(args) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardClose.postMessage(args);
  }
  async function fetch2(message) {
    if (message instanceof CloseMessage) {
      privacyDashboardClose({ eventOrigin: message.eventOrigin });
      return;
    }
    if (message instanceof SubmitBrokenSiteReportMessage) {
      privacyDashboardSubmitBrokenSiteReport({
        category: message.category,
        description: message.description
      });
      return;
    }
    if (message instanceof SetListsMessage) {
      for (const listItem of message.lists) {
        const { list, value } = listItem;
        if (list !== "allowlisted") {
          if (!window.__playwright)
            console.warn("only `allowlisted` is currently supported on macos");
          continue;
        }
        const isProtected = value === false;
        privacyDashboardSetProtection({ eventOrigin: message.eventOrigin, isProtected });
      }
      return;
    }
    if (message instanceof OpenSettingsMessages) {
      privacyDashboardOpenSettings({
        target: message.target
      });
      return;
    }
    if (message instanceof UpdatePermissionMessage) {
      privacyDashboardSetPermission({
        permission: message.id,
        value: message.value
      });
    }
    if (message instanceof FetchToggleReportOptions) {
      const data = await privacyDashboardGetToggleReportOptions();
      const parsed = toggleReportScreenSchema.parse(data);
      return parsed;
    }
    if (message instanceof SendToggleBreakageReport) {
      return privacyDashboardSendToggleReport();
    }
    if (message instanceof RejectToggleBreakageReport) {
      return privacyDashboardRejectToggleReport();
    }
    if (message instanceof SeeWhatIsSent) {
      return privacyDashboardSeeWhatIsSent();
    }
  }
  var getBackgroundTabData2 = () => {
    return new Promise((resolve) => {
      if (trackerBlockingData) {
        resolve(combineSources());
        return;
      }
      getBackgroundTabDataPromises.push(resolve);
    });
  };
  function privacyDashboardOpenUrlInNewTab(args) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardOpenUrlInNewTab.postMessage({
      url: args.url
    });
  }
  function privacyDashboardOpenSettings(args) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardOpenSettings.postMessage({
      target: args.target
    });
  }
  function privacyDashboardSubmitBrokenSiteReport(report) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardSubmitBrokenSiteReport.postMessage({
      category: report.category,
      description: report.description
    });
  }
  function privacyDashboardSetSize(payload) {
    if (!isIOS()) {
      invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
      window.webkit.messageHandlers.privacyDashboardSetSize.postMessage(payload);
    }
  }
  function setupShared() {
    window.onChangeRequestData = onChangeRequestData;
    window.onChangeAllowedPermissions = function(data) {
      permissionsData = data;
      channel2?.send("updateTabData");
    };
    window.onChangeUpgradedHttps = function(data) {
      upgradedHttps = data;
      if (trackerBlockingData)
        trackerBlockingData.upgradedHttps = upgradedHttps;
      resolveInitialRender();
    };
    window.onChangeProtectionStatus = onChangeProtectionStatus;
    window.onChangeLocale = onChangeLocale;
    window.onChangeCertificateData = function(data) {
      certificateData = data.secCertificateViewModels;
      channel2?.send("updateTabData");
    };
    window.onIsPendingUpdates = function(data) {
      isPendingUpdates = data;
      channel2?.send("updateTabData");
    };
    window.onChangeParentEntity = function(data) {
      parentEntity = data;
      channel2?.send("updateTabData");
    };
    window.onChangeConsentManaged = onChangeConsentManaged;
    setupGlobalOpenerListener((href) => {
      privacyDashboardOpenUrlInNewTab({
        url: href
      });
    });
  }
  function setup2() {
    setupColorScheme();
    setupShared();
    setupMutationObserver((height) => {
      privacyDashboardSetSize({ height });
    });
  }
  function firstRenderComplete() {
    const height = getContentHeight();
    if (typeof height === "number") {
      privacyDashboardSetSize({ height });
    }
  }

  // shared/js/browser/ios-communication.js
  function setup3() {
    const setColorScheme = setupColorScheme();
    window.onChangeTheme = function(themeName) {
      setColorScheme(themeName);
    };
    window.history.replaceState({}, "", window.location.href);
    setupShared();
  }
  function privacyDashboardShowReportBrokenSite(args) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardShowReportBrokenSite.postMessage(args);
  }
  function privacyDashboardShowAlertForMissingDescription(args) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardShowAlertForMissingDescription.postMessage(args);
  }
  function privacyDashboardShowNativeFeedback(args) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardShowNativeFeedback.postMessage(args);
  }
  function privacyDashboardTelemetrySpan(args) {
    invariant(window.webkit?.messageHandlers, "webkit.messageHandlers required");
    window.webkit.messageHandlers.privacyDashboardTelemetrySpan.postMessage(args);
  }
  async function fetch3(message) {
    if (message instanceof CheckBrokenSiteReportHandledMessage) {
      privacyDashboardShowReportBrokenSite({});
      return false;
    }
    if (message instanceof ShowAlertForMissingDescription) {
      privacyDashboardShowAlertForMissingDescription({});
      return false;
    }
    if (message instanceof ShowNativeFeedback) {
      privacyDashboardShowNativeFeedback({});
      return false;
    }
    if (message instanceof TelemetrySpanMsg) {
      privacyDashboardTelemetrySpan(message);
      return false;
    }
    return fetch2(message);
  }

  // shared/js/browser/android-communication.js
  var android_communication_exports = {};
  __export(android_communication_exports, {
    PrivacyDashboardJavascriptInterface: () => PrivacyDashboardJavascriptInterface,
    backgroundMessage: () => backgroundMessage3,
    fetch: () => fetch4,
    getBackgroundTabData: () => getBackgroundTabData3,
    onChangeConsentManaged: () => onChangeConsentManaged2,
    onChangeFeatureSettings: () => onChangeFeatureSettings,
    onChangeLocale: () => onChangeLocale2,
    onChangeProtectionStatus: () => onChangeProtectionStatus2,
    onChangeRequestData: () => onChangeRequestData2,
    setup: () => setup4
  });
  init_schema_parsers();
  var channel3 = null;
  var backgroundMessage3 = (backgroundModel) => {
    channel3 = backgroundModel;
  };
  var getBackgroundTabDataPromises2 = [];
  var trackerBlockingData2;
  var permissionsData2;
  var certificateData2;
  var upgradedHttps2;
  var protections2;
  var isPendingUpdates2;
  var parentEntity2;
  var cookiePromptManagementStatus2 = {};
  var locale2;
  var featureSettings;
  var combineSources2 = () => ({
    tab: Object.assign(
      {},
      trackerBlockingData2 || {},
      {
        isPendingUpdates: isPendingUpdates2,
        parentEntity: parentEntity2,
        cookiePromptManagementStatus: cookiePromptManagementStatus2,
        locale: locale2
      },
      permissionsData2 ? { permissions: permissionsData2 } : {},
      certificateData2 ? { certificate: certificateData2 } : {}
    ),
    featureSettings
  });
  var resolveInitialRender2 = function() {
    const isUpgradedHttpsSet = typeof upgradedHttps2 === "boolean";
    const isIsProtectedSet = typeof protections2 !== "undefined";
    const isTrackerBlockingDataSet = typeof trackerBlockingData2 === "object";
    const isLocaleSet = typeof locale2 === "string";
    if (!isLocaleSet || !isUpgradedHttpsSet || !isIsProtectedSet || !isTrackerBlockingDataSet) {
      return;
    }
    getBackgroundTabDataPromises2.forEach((resolve) => resolve(combineSources2()));
    channel3?.send("updateTabData", { via: "resolveInitialRender" });
  };
  function onChangeRequestData2(tabUrl, rawRequestData) {
    const requestData = requestDataSchema.safeParse(rawRequestData);
    if (!protections2) {
      console.error("protections status not set");
      return;
    }
    if (!requestData.success) {
      console.error("could not parse incoming request data from `onChangeRequestData`");
      console.log(requestData.error);
      return;
    }
    trackerBlockingData2 = createTabData(tabUrl, upgradedHttps2, protections2, requestData.data);
    resolveInitialRender2();
  }
  function onChangeProtectionStatus2(protectionsStatus) {
    const parsed = protectionsStatusSchema.safeParse(protectionsStatus);
    if (!parsed.success) {
      console.error("could not parse incoming protection status from onChangeProtectionStatus");
      console.error(parsed.error);
      return;
    }
    protections2 = parsed.data;
    resolveInitialRender2();
  }
  function onChangeLocale2(payload) {
    const parsed = localeSettingsSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("could not parse incoming protection status from onChangeLocale");
      console.error(parsed.error);
      return;
    }
    locale2 = parsed.data.locale;
    channel3?.send("updateTabData", { via: "onChangeLocale" });
  }
  function onChangeFeatureSettings(payload) {
    const parsed = remoteFeatureSettingsSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("could not parse incoming protection status from onChangeFeatureSettings");
      console.error(parsed.error);
      return;
    }
    featureSettings = parsed.data;
    channel3?.send("updateTabData", { via: "onChangeFeatureSettings" });
  }
  function onChangeConsentManaged2(payload) {
    const parsed = cookiePromptManagementStatusSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("could not parse incoming data from onChangeConsentManaged");
      console.error(parsed.error);
      return;
    }
    Object.assign(cookiePromptManagementStatus2, parsed.data);
    channel3?.send("updateTabData");
  }
  var PrivacyDashboardJavascriptInterface = class {
    /**
     * @param {boolean} isProtected - note: this will be sent as valid JSON, eg: `"true"` or `"false"`
     *
     * Add the current domain to the 'allowlist'
     *
     * ```js
     * window.PrivacyDashboard.toggleAllowlist("true")
     * ```
     *
     * Remove the current domain from the 'allowlist'
     *
     * ```js
     * window.PrivacyDashboard.toggleAllowlist("false")
     * ```
     */
    toggleAllowlist(isProtected) {
      window.PrivacyDashboard.toggleAllowlist(isProtected);
    }
    /**
     * Shows the native breakage form, instead of using the one
     * embedded in the Privacy Dashboard
     * @example
     * ```
     * window.PrivacyDashboard.showBreakageForm()
     * ```
     */
    showBreakageForm() {
      window.PrivacyDashboard.showBreakageForm();
    }
    /**
     * @example
     * ```
     * window.PrivacyDashboard.close()
     * ```
     */
    close() {
      window.PrivacyDashboard.close();
    }
    /**
     * {@inheritDoc common.openInNewTab}
     * @type {import("./common.js").openInNewTab}
     *
     * ```js
     * const payload = JSON.stringify({
     *     "url": "https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/"
     * });
     * window.PrivacyDashboard.openInNewTab(payload)
     * ```
     */
    openInNewTab(payload) {
      window.PrivacyDashboard.openInNewTab(JSON.stringify(payload));
    }
    /**
     * {@inheritDoc common.openSettings}
     * @type {import("./common.js").openSettings}
     * @example
     * ```js
     * const payload = JSON.stringify({
     *     "target": "cpm"
     * });
     * window.PrivacyDashboard.openSettings(payload)
     * ```
     */
    openSettings(payload) {
      window.PrivacyDashboard.openSettings(JSON.stringify(payload));
    }
  };
  var privacyDashboardApi;
  async function fetchAndroid(message) {
    if (message instanceof SetListsMessage) {
      for (const listItem of message.lists) {
        const { list, value } = listItem;
        if (list !== "allowlisted") {
          if (!window.__playwright)
            console.warn("only `allowlisted` is currently supported on android");
          continue;
        }
        const isProtected = value === false;
        privacyDashboardApi.toggleAllowlist(isProtected);
      }
    }
    if (message instanceof CloseMessage) {
      privacyDashboardApi.close();
    }
    if (message instanceof CheckBrokenSiteReportHandledMessage) {
      privacyDashboardApi.showBreakageForm();
      return true;
    }
    if (message instanceof OpenSettingsMessages) {
      privacyDashboardApi.openSettings({
        target: message.target
      });
    }
  }
  var getBackgroundTabDataAndroid = () => {
    return new Promise((resolve) => {
      if (trackerBlockingData2) {
        resolve(combineSources2());
        return;
      }
      getBackgroundTabDataPromises2.push(resolve);
    });
  };
  function setup4() {
    const setColorScheme = setupColorScheme();
    window.onChangeTheme = function(themeName) {
      setColorScheme(themeName);
    };
    window.onChangeProtectionStatus = onChangeProtectionStatus2;
    window.onChangeLocale = onChangeLocale2;
    window.onChangeRequestData = onChangeRequestData2;
    window.onChangeConsentManaged = onChangeConsentManaged2;
    window.onChangeFeatureSettings = onChangeFeatureSettings;
    window.onChangeAllowedPermissions = function(data) {
      permissionsData2 = data;
      channel3?.send("updateTabData", { via: "onChangeAllowedPermissions" });
    };
    window.onChangeUpgradedHttps = function(data) {
      upgradedHttps2 = data;
      if (trackerBlockingData2)
        trackerBlockingData2.upgradedHttps = upgradedHttps2;
      resolveInitialRender2();
    };
    window.onChangeCertificateData = function(data) {
      certificateData2 = data.secCertificateViewModels;
      channel3?.send("updateTabData", { via: "onChangeCertificateData" });
    };
    window.onIsPendingUpdates = function(data) {
      isPendingUpdates2 = data;
      channel3?.send("updateTabData", { via: "onIsPendingUpdates" });
    };
    window.onChangeParentEntity = function(data) {
      parentEntity2 = data;
      channel3?.send("updateTabData", { via: "onChangeParentEntity" });
    };
    privacyDashboardApi = new PrivacyDashboardJavascriptInterface();
    setupBlurOnLongPress();
    setupGlobalOpenerListener((href) => {
      privacyDashboardApi.openInNewTab({
        url: href
      });
    });
  }
  var getBackgroundTabData3 = new Proxy(getBackgroundTabDataAndroid, {
    apply(target, thisArg, argArray) {
      return Reflect.apply(target, thisArg, argArray);
    }
  });
  var fetch4 = new Proxy(fetchAndroid, {
    apply(target, thisArg, argArray) {
      return Reflect.apply(target, thisArg, argArray);
    }
  });

  // shared/js/browser/windows-communication.js
  var windows_communication_exports = {};
  __export(windows_communication_exports, {
    AddToAllowListCommand: () => AddToAllowListCommand,
    OpenInNewTab: () => OpenInNewTab,
    OpenSettings: () => OpenSettings,
    RemoveFromAllowListCommand: () => RemoveFromAllowListCommand,
    SetPermissionCommand: () => SetPermissionCommand,
    SetSize: () => SetSize,
    SubmitBrokenSiteReport: () => SubmitBrokenSiteReport,
    backgroundMessage: () => backgroundMessage4,
    fetch: () => fetch5,
    firstRenderComplete: () => firstRenderComplete2,
    getBackgroundTabData: () => getBackgroundTabData4,
    handleIncomingMessage: () => handleIncomingMessage,
    setup: () => setup5
  });
  init_lib();
  init_schema_parsers();
  var channel4 = null;
  var backgroundMessage4 = (backgroundModel) => {
    channel4 = backgroundModel;
  };
  var getBackgroundTabDataPromises3 = [];
  var trackerBlockingData3;
  var permissionsData3;
  var certificateData3;
  var upgradedHttps3;
  var protections3;
  var isPendingUpdates3;
  var parentEntity3;
  var combineSources3 = () => ({
    tab: Object.assign(
      {},
      trackerBlockingData3 || {},
      {
        isPendingUpdates: isPendingUpdates3,
        parentEntity: parentEntity3
      },
      permissionsData3 ? { permissions: permissionsData3 } : {},
      certificateData3 ? { certificate: certificateData3 } : {}
    )
  });
  var resolveInitialRender3 = function() {
    const isUpgradedHttpsSet = typeof upgradedHttps3 === "boolean";
    const isIsProtectedSet = typeof protections3 !== "undefined";
    const isTrackerBlockingDataSet = typeof trackerBlockingData3 === "object";
    if (!isUpgradedHttpsSet || !isIsProtectedSet || !isTrackerBlockingDataSet) {
      return;
    }
    getBackgroundTabDataPromises3.forEach((resolve) => resolve(combineSources3()));
    channel4?.send("updateTabData");
  };
  function handleViewModelUpdate(viewModel) {
    upgradedHttps3 = viewModel.upgradedHttps;
    parentEntity3 = viewModel.parentEntity || {};
    permissionsData3 = viewModel.permissions || [];
    certificateData3 = viewModel.certificates || [];
    protections3 = viewModel.protections;
    trackerBlockingData3 = createTabData(viewModel.tabUrl, upgradedHttps3, viewModel.protections, viewModel.rawRequestData);
    trackerBlockingData3.cookiePromptManagementStatus = viewModel.cookiePromptManagementStatus;
    if (trackerBlockingData3)
      trackerBlockingData3.upgradedHttps = upgradedHttps3;
    resolveInitialRender3();
  }
  function windowsPostMessage(name, data) {
    assert(typeof window.chrome.webview?.postMessage === "function");
    window.chrome.webview.postMessage({
      Feature: "PrivacyDashboard",
      Name: name,
      Data: data
    });
  }
  async function fetch5(message) {
    if (message instanceof SubmitBrokenSiteReportMessage) {
      SubmitBrokenSiteReport({
        category: message.category,
        description: message.description
      });
      return;
    }
    if (message instanceof OpenSettingsMessages) {
      OpenSettings({
        target: message.target
      });
      return;
    }
    if (message instanceof SetListsMessage) {
      for (const listItem of message.lists) {
        const { list, value } = listItem;
        if (list !== "allowlisted") {
          if (!window.__playwright)
            console.warn("only `allowlisted` is currently supported on windows");
          continue;
        }
        const isProtected = value === false;
        const eventOrigin = message.eventOrigin;
        if (isProtected) {
          RemoveFromAllowListCommand(eventOrigin);
        } else {
          AddToAllowListCommand(eventOrigin);
        }
      }
    }
    if (message instanceof UpdatePermissionMessage) {
      SetPermissionCommand({
        permission: message.id,
        value: message.value
      });
    }
  }
  function SubmitBrokenSiteReport(report) {
    windowsPostMessage("SubmitBrokenSiteReport", {
      category: report.category,
      description: report.description
    });
  }
  function OpenInNewTab(args) {
    windowsPostMessage("OpenInNewTab", {
      url: args.url
    });
  }
  function SetSize(payload) {
    windowsPostMessage("SetSize", payload);
  }
  function OpenSettings(args) {
    windowsPostMessage("OpenSettings", args);
  }
  function SetPermissionCommand(args) {
    windowsPostMessage("SetPermissionCommand", args);
  }
  function RemoveFromAllowListCommand(eventOrigin) {
    windowsPostMessage("RemoveFromAllowListCommand", { eventOrigin });
  }
  function AddToAllowListCommand(eventOrigin) {
    windowsPostMessage("AddToAllowListCommand", { eventOrigin });
  }
  var getBackgroundTabData4 = () => {
    return new Promise((resolve) => {
      if (trackerBlockingData3) {
        resolve(combineSources3());
        return;
      }
      getBackgroundTabDataPromises3.push(resolve);
    });
  };
  var eventShape = z3.discriminatedUnion("Name", [windowsIncomingViewModelSchema, windowsIncomingVisibilitySchema]);
  function handleIncomingMessage(message) {
    const parsed = eventShape.safeParse(message);
    if (!parsed.success) {
      console.error("cannot handle incoming message from event data", message);
      console.error(parsed.error);
      return;
    }
    switch (parsed.data.Name) {
      case "VisibilityChanged": {
        if (parsed.data.Data.isVisible === false) {
          document.body.innerHTML = "";
        }
        break;
      }
      case "ViewModelUpdated": {
        handleViewModelUpdate(parsed.data.Data);
      }
    }
  }
  function setup5() {
    if (!window.chrome.webview) {
      console.error("window.chrome.webview not available");
      return;
    }
    setupColorScheme();
    assert(typeof window.chrome.webview?.addEventListener === "function", "window.chrome.webview.addEventListener is required");
    window.chrome.webview.addEventListener("message", (event) => {
      handleIncomingMessage(event.data);
    });
    setupMutationObserver((height) => {
      SetSize({ height });
    });
    setupGlobalOpenerListener((href) => {
      OpenInNewTab({
        url: href
      });
    });
  }
  function firstRenderComplete2() {
    const height = getContentHeight();
    if (typeof height === "number") {
      SetSize({ height });
    }
  }

  // shared/js/browser/communication.js
  var defaultComms;
  var platform = {
    name: "browser"
  };
  if (isIOS()) {
    defaultComms = ios_communication_exports;
    platform.name = "ios";
  } else if (isBrowser()) {
    defaultComms = browser_communication_exports;
    platform.name = "browser";
  } else if (isAndroid()) {
    defaultComms = android_communication_exports;
    platform.name = "android";
  } else if (isWindows()) {
    defaultComms = windows_communication_exports;
    platform.name = "windows";
  } else if (isMacos()) {
    defaultComms = macos_communication_exports;
    platform.name = "macos";
  }
  if (!defaultComms)
    throw new Error("unsupported environment");
  defaultComms.setup();
  var communication_default = defaultComms;

  // shared/js/ui/platform-features.mjs
  function createPlatformFeatures(platform2) {
    const desktop = ["windows", "macos", "browser"];
    let includeToggleOnBreakageForm = true;
    let screen = "primaryScreen";
    const url = new URL(window.location.href);
    const acceptedScreenParam = [
      "breakageForm",
      "toggleReport",
      "choiceBreakageForm",
      "categoryTypeSelection",
      "categorySelection",
      "promptBreakageForm"
    ];
    if (url.searchParams.has("screen")) {
      const param = url.searchParams.get("screen");
      if (typeof param === "string" && acceptedScreenParam.includes(
        /** @type {string} */
        param
      )) {
        screen = /** @type {any} */
        param;
      }
    }
    if (screen === "promptBreakageForm") {
      includeToggleOnBreakageForm = false;
    }
    let opener = "menu";
    if (url.searchParams.get("opener") === "dashboard") {
      opener = "dashboard";
    }
    let breakageScreen = "breakageForm";
    if (url.searchParams.get("breakageScreen") === "categorySelection") {
      breakageScreen = "categorySelection";
    }
    if (url.searchParams.get("breakageScreen") === "categoryTypeSelection") {
      breakageScreen = "categoryTypeSelection";
    }
    return new PlatformFeatures({
      spinnerFollowingProtectionsToggle: platform2.name !== "android" && platform2.name !== "windows",
      supportsHover: desktop.includes(platform2.name),
      initialScreen: screen,
      opener,
      supportsInvalidCerts: platform2.name !== "browser" && platform2.name !== "windows",
      includeToggleOnBreakageForm,
      breakageScreen
    });
  }
  var PlatformFeatures = class {
    /**
     * @param {object} params
     * @param {boolean} params.spinnerFollowingProtectionsToggle
     * @param {boolean} params.supportsHover
     * @param {InitialScreen} params.initialScreen
     * @param {'dashboard' | 'menu'} params.opener
     * @param {boolean} params.supportsInvalidCerts
     * @param {boolean} params.includeToggleOnBreakageForm
     * @param {InitialScreen} params.breakageScreen
     */
    constructor(params) {
      this.spinnerFollowingProtectionsToggle = params.spinnerFollowingProtectionsToggle;
      this.supportsHover = params.supportsHover;
      this.supportsInvalidCerts = params.supportsInvalidCerts;
      this.initialScreen = params.initialScreen;
      this.opener = params.opener;
      this.includeToggleOnBreakageForm = params.includeToggleOnBreakageForm;
      this.breakageScreen = params.breakageScreen;
    }
  };
  var FeatureSettings = class _FeatureSettings {
    /**
     * @param {object} params
     * @param {import("../../../schema/__generated__/schema.types").PrimaryScreen} [params.primaryScreen]
     */
    constructor(params) {
      this.primaryScreen = params.primaryScreen || { layout: "default" };
    }
    /**
     *
     */
    static default() {
      return new _FeatureSettings({});
    }
  };

  // v2/data-provider.js
  var DataChannel = class extends EventTarget {
    constructor() {
      super(...arguments);
      __publicField(this, "protectionsEnabled", false);
      /** @type {'secure' | 'upgraded' | 'none' | 'invalid'} */
      __publicField(this, "httpsState", "none");
      __publicField(this, "isBroken", false);
      __publicField(this, "isAllowlisted", false);
      __publicField(this, "isDenylisted", false);
      __publicField(this, "displayBrokenUI", false);
      __publicField(this, "isaMajorTrackingNetwork", false);
      // always disabled by default
      __publicField(this, "disabled", true);
      __publicField(this, "features", createPlatformFeatures(platform));
      /** @type {FeatureSettings | null} */
      __publicField(this, "featureSettings", null);
      /** @type {any[] | null | undefined} */
      __publicField(this, "permissions", null);
      /** @type {import('../shared/js/browser/utils/request-details.mjs').TabData | null} */
      __publicField(this, "tab", null);
      /** @type {import('../schema/__generated__/schema.types').EmailProtectionUserData | null} */
      __publicField(this, "emailProtectionUserData", null);
      __publicField(this, "count", 0);
      __publicField(
        this,
        "_timeout",
        /** @type {any} */
        null
      );
    }
    /**
     * This will be called by the communication layer
     */
    send() {
      clearTimeout(this._timeout);
      this._timeout = window.setTimeout(() => {
        communication_default.getBackgroundTabData().then((resp) => {
          this.accept(resp);
        }).catch((e3) => {
          console.log("\u274C [models/site.es6.js:handleBackgroundMsg()] --> ", e3);
        });
      }, 100);
    }
    /**
     * @param {import('../shared/js/browser/common.js').BackgroundTabData} data
     */
    accept({ tab, emailProtectionUserData, fireButton }) {
      if (tab) {
        this.tab = tab;
        this.domain = tab.domain;
        const MAJOR_TRACKER_THRESHOLD_PCT = 25;
        this.isaMajorTrackingNetwork = (tab.parentEntity?.prevalence || 0) >= MAJOR_TRACKER_THRESHOLD_PCT;
      } else {
        this.domain = "new tab";
        console.debug("Site model: no tab");
      }
      if (emailProtectionUserData) {
        this.emailProtectionUserData = emailProtectionUserData;
      }
      this.fireButton = fireButton;
      this.featureSettings = new FeatureSettings({});
      this.setSiteProperties();
      this.setHttpsMessage();
      if (this.tab) {
        this.permissions = this.tab.permissions;
      }
      this.broadcast();
    }
    initial() {
      communication_default.getBackgroundTabData().then((resp) => {
        this.accept(resp);
      }).catch((e3) => {
        console.log("\u274C [DataChannel .initial()] --> ", e3);
      });
    }
    setSiteProperties() {
      if (!this.tab) {
        this.domain = "new tab";
      } else {
        this.initAllowlisted(this.tab.protections.allowlisted, this.tab.protections.denylisted);
        if (this.tab.specialDomainName) {
          this.domain = this.tab.specialDomainName;
        } else {
          this.disabled = false;
        }
      }
      if (this.domain && this.domain === "-") {
        this.disabled = true;
      }
    }
    initAllowlisted(allowListValue, denyListValue) {
      this.isAllowlisted = allowListValue;
      this.isDenylisted = denyListValue;
      this.isBroken = Boolean(
        this.tab?.protections.unprotectedTemporary || !this.tab?.protections.enabledFeatures?.includes("contentBlocking")
      );
      this.displayBrokenUI = this.isBroken;
      if (denyListValue) {
        this.displayBrokenUI = false;
        this.protectionsEnabled = true;
      } else {
        this.displayBrokenUI = this.isBroken;
        this.protectionsEnabled = !(this.isAllowlisted || this.isBroken);
      }
    }
    setHttpsMessage() {
      if (!this.tab)
        return;
      let nextState = (() => {
        if (this.tab.upgradedHttps) {
          return "upgraded";
        }
        if (/^https/.exec(this.tab.url)) {
          if (this.features.supportsInvalidCerts) {
            if (!this.tab.certificate || this.tab.certificate.length === 0) {
              return "invalid";
            }
          }
          return "secure";
        }
        return "none";
      })();
      this.httpsState = nextState;
    }
    broadcast() {
      this.count += 1;
      this.dispatchEvent(new CustomEvent("data", { detail: this.lastValue() }));
    }
    /**
     * @return {DataChannelPublicData}
     */
    lastValue() {
      if (!this.tab)
        throw new Error("unreachable");
      if (!this.featureSettings)
        throw new Error("unreachable");
      return {
        fireButton: this.fireButton,
        protectionsEnabled: this.protectionsEnabled,
        httpsState: this.httpsState,
        isBroken: this.isBroken,
        isAllowlisted: this.isAllowlisted,
        isDenylisted: this.isDenylisted,
        displayBrokenUI: this.displayBrokenUI,
        isaMajorTrackingNetwork: this.isaMajorTrackingNetwork,
        disabled: this.disabled,
        features: this.features,
        featureSettings: this.featureSettings,
        permissions: this.permissions,
        tab: this.tab,
        count: this.count,
        emailProtectionUserData: this.emailProtectionUserData
      };
    }
  };
  var ToggleAllowList = class {
    /**
     * @param {DataChannelPublicData} data
     * @param {import('../schema/__generated__/schema.types.js').EventOrigin} eventOrigin
     * @return {import('../shared/js/browser/common.js').Msg}
     */
    intoMessage(data, eventOrigin) {
      const lists = [];
      if (data.tab && data.tab.domain) {
        if (data.isBroken) {
          lists.push({
            list: "denylisted",
            domain: data.tab.domain,
            value: !data.isDenylisted
          });
        } else {
          lists.push({
            list: "denylisted",
            domain: data.tab.domain,
            value: false
          });
          lists.push({
            list: "allowlisted",
            domain: data.tab.domain,
            value: !data.isAllowlisted
          });
        }
      }
      return new SetListsMessage({ lists, eventOrigin });
    }
  };
  var dc = new DataChannel();
  communication_default.backgroundMessage(dc);
  var ChannelContext = G({
    /** @type {DataChannel} */
    channel: (
      /** @type {any} */
      null
    )
  });
  function DataProvider({ children }) {
    const d3 = useInternalData();
    if (!d3 || d3.count === 0)
      return null;
    return /* @__PURE__ */ y(ChannelContext.Provider, { value: { channel: dc } }, children);
  }
  function useInternalData() {
    const [state, setState] = h2(null);
    p2(() => {
      dc.initial();
      const handler = (evt) => {
        setState(evt.detail);
      };
      dc.addEventListener("data", handler);
      return () => {
        dc.removeEventListener("data", handler);
      };
    }, []);
    return state;
  }
  function useData() {
    const [state, setState] = h2(() => dc.lastValue());
    p2(() => {
      const handler = (evt) => {
        setState(evt.detail);
      };
      dc.addEventListener("data", handler);
      return () => {
        dc.removeEventListener("data", handler);
      };
    }, []);
    return state;
  }
  function useFeatures() {
    return dc.lastValue().features;
  }
  function usePrimaryStatus() {
    const { disabled, tab } = dc.lastValue();
    if (tab?.error)
      return "error";
    if (tab?.ctaScreens && disabled)
      return "cta";
    return "ready";
  }
  function useFetcher() {
    return T2(async (msg) => {
      try {
        console.log("\u{1F4E4} [outgoing useFetcher]", msg);
        return communication_default.fetch(msg);
      } catch (error2) {
        console.error("Error:", error2);
        throw error2;
      }
    }, []);
  }
  function useClose() {
    const fetcher = useFetcher();
    const nav = useNav();
    return T2(() => {
      const msg = new CloseMessage({ eventOrigin: { screen: nav.screen() } });
      fetcher(msg).catch(console.error);
    }, [nav]);
  }
  function useToggle() {
    const fetcher = useFetcher();
    const data = useData();
    const nav = useNav();
    return T2(() => {
      const msg = new ToggleAllowList().intoMessage(data, { screen: nav.screen() });
      fetcher(msg).catch(console.error);
    }, [data, nav]);
  }
  function useSendReport() {
    const fetcher = useFetcher();
    const nav = useNav();
    return T2(
      ({ category, description }) => {
        const msg = new SubmitBrokenSiteReportMessage({
          category: category || "",
          description: description || "",
          eventOrigin: { screen: nav.screen() }
        });
        fetcher(msg).catch(console.error);
      },
      [nav]
    );
  }
  function useShowAlert() {
    const fetcher = useFetcher();
    const nav = useNav();
    return T2(() => {
      const msg = new ShowAlertForMissingDescription();
      fetcher(msg).catch(console.error);
    }, [nav]);
  }
  function useShowNativeFeedback() {
    const fetcher = useFetcher();
    const nav = useNav();
    return T2(() => {
      const msg = new ShowNativeFeedback();
      fetcher(msg).catch(console.error);
    }, [nav]);
  }
  function useTelemetry() {
    const fetcher = useFetcher();
    const nav = useNav();
    return function(attrs) {
      const msg = new TelemetrySpanMsg({
        eventOrigin: { screen: nav.screen() },
        attributes: attrs
      });
      fetcher(msg).catch(console.error);
    };
  }

  // v2/dom-node.jsx
  function DomNode({ children }) {
    this.shouldComponentUpdate = () => false;
    return (
      /** @type {any} */
      Object.defineProperty(y(children.localName), "__e", { get: () => children, set: Object })
    );
  }

  // v2/components/top-nav.jsx
  function TopNav({ back, done, children }) {
    return /* @__PURE__ */ y("div", null, /* @__PURE__ */ y("div", { className: "top-nav" }, back, children, done), /* @__PURE__ */ y("div", { className: "top-nav__spacer" }));
  }
  function SecondaryTopNav() {
    const { pop } = useNav();
    const onClose = useClose();
    return platformSwitch({
      ios: () => {
        return /* @__PURE__ */ y(TopNav, { back: /* @__PURE__ */ y(Back, { onClick: pop }), done: /* @__PURE__ */ y(Done, { onClick: onClose }) });
      },
      default: () => {
        return /* @__PURE__ */ y(TopNav, { back: /* @__PURE__ */ y(Back, { onClick: pop }), done: null });
      }
    });
  }
  function SecondaryTopNavAlt({ children }) {
    const { pop } = useNav();
    const canPop = useCanPop();
    const onClose = useClose();
    return platformSwitch({
      ios: () => {
        return /* @__PURE__ */ y(TopNav, { back: canPop ? /* @__PURE__ */ y(Back, { onClick: pop }) : null, done: /* @__PURE__ */ y(Cancel, { onClick: onClose }) }, children);
      },
      default: () => {
        return /* @__PURE__ */ y(TopNav, { back: /* @__PURE__ */ y(Back, { onClick: pop }), done: null }, children);
      }
    });
  }
  function Back({ onClick }) {
    const textLabel = ns.site("navigationBack.title");
    return /* @__PURE__ */ y(
      "a",
      {
        href: "javascript:void(0)",
        onClick,
        className: "top-nav__back link-action link-action--dark",
        role: "button",
        "aria-label": textLabel
      },
      /* @__PURE__ */ y("span", { className: "icon icon__back-arrow", "data-icon-text": textLabel })
    );
  }
  function Done({ textLabel = ns.site("navigationComplete.title"), onClick }) {
    return /* @__PURE__ */ y("a", { href: "javascript:void(0)", onClick, className: "top-nav__done link-action link-action--dark", role: "button" }, textLabel);
  }
  function Close({ onClick }) {
    return /* @__PURE__ */ y(Done, { textLabel: ns.site("navigationClose.title"), onClick });
  }
  function Cancel({ onClick }) {
    return /* @__PURE__ */ y("a", { href: "javascript:void(0)", onClick, className: "top-nav__cancel link-action link-action--dark", role: "button" }, ns.site("navigationCancel.title"));
  }
  function Title({ children }) {
    return /* @__PURE__ */ y("span", { className: "top-nav__title" }, children);
  }

  // v2/screens/connection-screen.jsx
  function ConnectionScreen() {
    const data = useData();
    const summary = renderConnectionDescription(data, data.tab);
    const icon = largeHeroIcon({
      status: `connection-${data.httpsState}`
    });
    const hero = heroTemplate({
      icon,
      summary,
      suffix: "none"
    });
    return /* @__PURE__ */ y("div", { className: "site-info card page-inner", "data-page": "connection" }, /* @__PURE__ */ y(SecondaryTopNav, null), /* @__PURE__ */ y("div", { className: "padding-x-double" }, /* @__PURE__ */ y(DomNode, { key: data.count }, hero), data.tab.certificate && /* @__PURE__ */ y(k, null, /* @__PURE__ */ y(DomNode, { key: data.count }, renderCertificateDetails(data, data.tab)))));
  }

  // shared/js/ui/views/main-nav.js
  var import_nanohtml5 = __toESM(require_browser());

  // shared/data/constants.js
  var displayCategories = {
    Analytics: "site:analyticsCategory.title",
    Advertising: "site:advertisingCategory.title",
    "Social Network": "site:socialCategory.title",
    "Content Delivery": "site:contentDeliveryCategory.title",
    "Embedded Content": "site:embeddedContentCategory.title"
  };
  var httpsMessages = {
    secure: "site:connectionSecure.title",
    upgraded: "site:connectionSecure.title",
    none: "site:connectionNotSecure.title",
    invalid: "site:connectionNotSecureInvalidCertificate.title"
  };

  // shared/js/ui/views/main-nav.js
  function template(model, nav) {
    const consentCb = model.tab.cookiePromptManagementStatus?.cosmetic ? nav.cookieHidden : nav.consentManaged;
    const consentRow = import_nanohtml5.default`<li class="main-nav__row">${renderCookieConsentManaged(model, consentCb)}</li>`;
    return import_nanohtml5.default`
        <ul class="default-list main-nav token-body-em js-site-main-nav">
            <li class="main-nav__row">${renderConnection(model, nav.connection)}</li>
            <li class="main-nav__row">${renderTrackerNetworksNew(model, nav.trackers)}</li>
            <li class="main-nav__row">${renderThirdPartyNew(model, nav.nonTrackers)}</li>
            ${model.tab?.cookiePromptManagementStatus?.consentManaged ? consentRow : null}
        </ul>
    `;
  }
  function renderCookieConsentManaged(model, cb) {
    if (!model.tab?.cookiePromptManagementStatus)
      return null;
    const { consentManaged, cosmetic, optoutFailed, configurable } = model.tab.cookiePromptManagementStatus;
    if (consentManaged && !optoutFailed) {
      const text = cosmetic ? i18n.t("site:cookiesHidden.title") : i18n.t("site:cookiesMinimized.title");
      if (configurable) {
        return import_nanohtml5.default`
                <a
                    href="javascript:void(0)"
                    class="main-nav__item main-nav__item--link link-action link-action--dark"
                    role="button"
                    draggable="false"
                    onclick=${cb}
                >
                    <span class="main-nav__icon ${cosmetic ? "icon-small--info" : "icon-small--secure"}"></span>
                    <span class="main-nav__text">${text}</span>
                    <span class="main-nav__chev"></span>
                </a>
            `;
      } else {
        return import_nanohtml5.default`
                <div class="main-nav__item">
                    <span class="main-nav__icon icon-small--secure"></span>
                    <span class="main-nav__text">${text}</span>
                </div>
            `;
      }
    }
    return import_nanohtml5.default``;
  }
  function renderConnection(model, cb) {
    let icon = "icon-small--insecure";
    let text = i18n.t(httpsMessages[model.httpsState]);
    let isSecure = model.httpsState === "secure";
    let isUpgraded = model.httpsState === "upgraded" && /^https/.exec(model.tab.url);
    if (isSecure || isUpgraded) {
      icon = "icon-small--secure";
    }
    return import_nanohtml5.default` <a
        href="javascript:void(0)"
        class="main-nav__item main-nav__item--link link-action link-action--dark"
        role="button"
        draggable="false"
        aria-label="View Connection Information"
        onclick=${cb}
    >
        <span class="main-nav__icon ${icon}"></span>
        <span class="main-nav__text">${text}</span>
        <span class="main-nav__chev"></span>
    </a>`;
  }
  function renderTrackerNetworksNew(model, cb) {
    const { title, icon } = trackerNetworksText(model.tab.requestDetails, model.protectionsEnabled);
    return import_nanohtml5.default` <a
        href="javascript:void(0)"
        class="main-nav__item main-nav__item--link link-action link-action--dark"
        role="button"
        draggable="false"
        aria-label="View Tracker Companies"
        onclick=${cb}
    >
        <span class="main-nav__icon icon-small--${icon}"></span>
        <span class="main-nav__text">${title}</span>
        <span class="main-nav__chev"></span>
    </a>`;
  }
  function renderThirdPartyNew(model, cb) {
    const { title, icon } = thirdpartyText(model.tab.requestDetails, model.protectionsEnabled);
    return import_nanohtml5.default` <a
        href="javascript:void(0)"
        class="main-nav__item main-nav__item--link link-action link-action--dark"
        role="button"
        draggable="false"
        aria-label="View Non-Tracker Companies"
        onclick=${cb}
    >
        <span class="main-nav__icon icon-small--${icon}"></span>
        <span class="main-nav__text">${title}</span>
        <span class="main-nav__chev"></span>
    </a>`;
  }

  // shared/js/ui/hooks/useRipple.js
  function useRipple(params) {
    const { ref } = params;
    y2(() => {
      const $el = ref.current;
      if (!$el)
        return;
      if (!isAndroid())
        return;
      $el.classList.add("material-design-ripple");
      const instance2 = MDCRipple.attachTo($el);
      instance2.listen("click", function(e3) {
        if (e3.target instanceof HTMLElement) {
          e3.target.closest?.("a")?.blur();
        }
      });
      return () => {
        instance2.destroy();
      };
    }, []);
  }
  function useRippleChildren() {
    const ref = _(null);
    p2(() => {
      const $el = ref.current;
      if (!$el)
        return console.warn("missing ref");
      if (!isAndroid())
        return;
      const links = $el.querySelectorAll("a");
      const cleanup = addRippleTo(links);
      return () => {
        cleanup();
      };
    }, []);
    return ref;
  }
  function addRippleTo(elements) {
    const instances = [];
    elements.forEach((element) => {
      const instance2 = MDCRipple.attachTo(element);
      element.classList.add("material-design-ripple");
      instance2.listen("click", function(e3) {
        if (e3.target instanceof HTMLElement) {
          e3.target.closest?.("a")?.blur();
        }
      });
      instances.push(instance2);
    });
    return () => {
      while (instances.length) {
        const last = instances.pop();
        last.destroy();
        console.log("destroy");
      }
    };
  }

  // v2/components/main-nav.jsx
  function MainNav() {
    const data = useData();
    const { push } = useNav();
    const ref = useRippleChildren();
    return /* @__PURE__ */ y("nav", { id: "main-nav", ref }, /* @__PURE__ */ y(DomNode, { key: data.count }, template(data, {
      connection: () => {
        push("connection");
      },
      trackers: () => {
        push("trackers");
      },
      nonTrackers: () => {
        push("nonTrackers");
      },
      consentManaged: () => {
        push("consentManaged");
      },
      cookieHidden: () => {
        push("cookieHidden");
      }
    })));
  }

  // shared/js/ui/templates/key-insights.js
  var import_nanohtml6 = __toESM(require_browser());
  var import_raw2 = __toESM(require_raw_browser());

  // shared/js/ui/templates/shared/utils.js
  var offset = "a".charCodeAt(0);
  var colorCount = 16;
  function getColorId(value) {
    const characters = value.toLowerCase().split("");
    const sum = characters.reduce((total, character) => total + character.charCodeAt(0) - offset, 0);
    return Math.abs(sum % colorCount + 1);
  }

  // shared/js/ui/templates/key-insights.js
  var keyInsightsState = (
    /** @type {const} */
    {
      /* 01 */
      insecure: "insecure",
      /* 02 */
      broken: "broken",
      /* 03 */
      userAllowListed: "userAllowListed",
      /* 04 */
      majorTrackingNetwork: "majorTrackingNetwork",
      /* 05 */
      noneBlocked_someSpecialAllowed: "noneBlocked_someSpecialAllowed",
      /* 06 */
      noneBlocked: "noneBlocked",
      /* 07 */
      emptyCompaniesList: "emptyCompaniesList",
      /* 08 */
      blocked: "blocked",
      /* 09 */
      invalid: "invalid"
    }
  );
  function renderKeyInsight(modelOverride) {
    const model = modelOverride;
    const title = (text) => import_nanohtml6.default`<h1 class="token-title-3-em">${text}</h1>`;
    const description = (text) => import_nanohtml6.default`<div class="token-title-3"><span role="text">${text}</span></div>`;
    const state = (() => {
      if (model.httpsState === "none")
        return keyInsightsState.insecure;
      if (model.httpsState === "invalid")
        return keyInsightsState.invalid;
      if (model.isBroken)
        return keyInsightsState.broken;
      if (!model.protectionsEnabled)
        return keyInsightsState.userAllowListed;
      if (model.isaMajorTrackingNetwork && model.tab.parentEntity)
        return keyInsightsState.majorTrackingNetwork;
      if (model.tab.requestDetails.blocked.requestCount === 0) {
        if (model.tab.requestDetails.allowedSpecialCount() > 0) {
          return keyInsightsState.noneBlocked_someSpecialAllowed;
        }
        return keyInsightsState.noneBlocked;
      }
      const companyNames = model.tab.requestDetails.blockedCompanyNames();
      if (companyNames.length === 0)
        return keyInsightsState.emptyCompaniesList;
      return keyInsightsState.blocked;
    })();
    return {
      insecure: () => {
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--insecure-connection"></div>
                    ${title(model.tab.domain)} ${description((0, import_raw2.default)(i18n.t("site:connectionDescriptionUnencrypted.title")))}
                </div>
            `;
      },
      invalid: () => {
        const text = i18n.t("site:connectionDescriptionInvalidCertificate.title", { domain: model.tab.domain });
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--insecure-connection"></div>
                    ${title(model.tab.domain)} ${description((0, import_raw2.default)(text))}
                </div>
            `;
      },
      broken: () => {
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--protections-off"></div>
                    ${title(model.tab.domain)} 
                </div>
            `;
      },
      userAllowListed: () => {
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--protections-off"></div>
                    ${title(model.tab.domain)} ${description((0, import_raw2.default)(i18n.t("site:protectionsDisabled.title")))}
                </div>
            `;
      },
      majorTrackingNetwork: () => {
        const company = model.tab.parentEntity;
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--tracker-network"></div>
                    ${title(model.tab.domain)}
                    ${description(
          (0, import_raw2.default)(
            i18n.t("site:majorTrackingNetworkDesc.title", {
              companyDisplayName: company?.displayName,
              companyPrevalence: Math.round(company?.prevalence ?? 0),
              blocked: model.tab.requestDetails.blocked.entitiesCount > 0
            })
          )
        )}
                </div>
            `;
      },
      noneBlocked_someSpecialAllowed: () => {
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--info"></div>
                    ${title(model.tab.domain)} ${description(i18n.t("site:trackerNetworksSummaryAllowedOnly.title"))}
                </div>
            `;
      },
      noneBlocked: () => {
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--no-activity"></div>
                    ${title(model.tab.domain)} ${description((0, import_raw2.default)(i18n.t("site:trackerNetworksSummaryNone.title")))}
                </div>
            `;
      },
      emptyCompaniesList: () => {
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--trackers-blocked"></div>
                    ${title(model.tab.domain)}
                    ${description((0, import_raw2.default)(i18n.t("site:trackersBlockedDesc.title", generateCompanyNamesList(model))))}
                </div>
            `;
      },
      blocked: () => {
        return import_nanohtml6.default`
                <div class="key-insight key-insight--main">
                    ${renderCompanyIconsList(model)} ${title(model.tab.domain)}
                    ${description((0, import_raw2.default)(i18n.t("site:trackersBlockedDesc.title", generateCompanyNamesList(model))))}
                </div>
            `;
      }
    }[state]();
  }
  function generateCompanyNamesList(model) {
    const blockedCompanyNames = model.tab.requestDetails.blockedCompanyNames();
    return {
      companyCount: blockedCompanyNames.length,
      othersCount: blockedCompanyNames.length - 4,
      firstCompany: blockedCompanyNames[0],
      secondCompany: blockedCompanyNames[1],
      thirdCompany: blockedCompanyNames[2],
      fourthCompany: blockedCompanyNames[3]
    };
  }
  function renderCompanyIconsList(model) {
    const companyNames = model.tab.requestDetails.blockedCompanyNames();
    if (companyNames.length === 0)
      return "";
    const topCompanies = companyNames.slice(0, 4);
    const remainingCount = companyNames.length - topCompanies.length;
    const items = ["large", "medium", "medium", "small", "small"];
    const positions = {
      1: [1],
      2: [2, 1],
      3: [2, 1, 3],
      4: [3, 2, 4, 1],
      5: [3, 2, 4, 1, 5]
    };
    const processed = topCompanies.map((name, index) => {
      const slug = normalizeCompanyName(name);
      return {
        kind: "icon",
        slug,
        colorId: getColorId(slug),
        letter: slug[0].toUpperCase(),
        size: items[index]
      };
    });
    if (remainingCount > 0) {
      processed.push({
        kind: "more",
        count: remainingCount,
        size: items[4]
      });
    }
    const positionMap = positions[processed.length];
    const list = processed.map((item, index) => {
      if (item.kind === "icon") {
        return import_nanohtml6.default`
                <span class="icon-list__item" style="order: ${positionMap[index]}" data-company-icon-position=${positionMap[index]}>
                    <span class="icon-list__wrapper" data-company-icon-size=${item.size}>
                        <span class="icon-list__icon ${item.letter} color-${item.colorId} ${item.slug}"></span>
                        <span class="icon-list__blocked-icon"> ${blockSvg()} </span>
                    </span>
                </span>
            `;
      }
      return import_nanohtml6.default`
            <span class='icon-list__item' style='order: ${positionMap[index]}' data-company-icon-position='${positionMap[index]}'>
                <span class='icon-list__wrapper icon-list__wrapper--count' 
                    data-company-icon-size='${item.size}'>
                    <span class='icon-list__count'>+${item.count}</span>
                </span>
            </div>`;
    });
    return import_nanohtml6.default`
        <div class="key-insight__icon icon-list" data-company-count="${processed.length}" aria-label="List of Blocked Company Icons">
            ${list}
        </div>
    `;
  }
  function blockSvg() {
    return import_nanohtml6.default`
        <svg viewBox="0 0 32 32" fill="none">
            <circle fill="white" cx="16" cy="16" r="15" />
            <path
                fill="#EE1025"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM24 16C24 20.4183 20.4183 24 16 24C14.5164 24 13.1271 23.5961 11.9361 22.8924L22.8924 11.9361C23.5961 13.1271 24 14.5164 24 16ZM9.10763 20.0639L20.0639 9.10763C18.8729 8.40386 17.4836 8 16 8C11.5817 8 8 11.5817 8 16C8 17.4836 8.40386 18.8729 9.10763 20.0639Z"
            />
        </svg>
    `;
  }

  // v2/components/key-insights.jsx
  function KeyInsights() {
    const data = useData();
    return /* @__PURE__ */ y("div", { id: "key-insight" }, /* @__PURE__ */ y(DomNode, { key: data.count }, renderKeyInsight(data)));
  }
  function KeyInsightsMain({ title, children, icon = "chat" }) {
    return /* @__PURE__ */ y("div", { className: "key-insight key-insight--main" }, /* @__PURE__ */ y("div", { className: `key-insight__icon hero-icon--${icon}` }), /* @__PURE__ */ y("h1", { className: "token-title-3-em" }, title), /* @__PURE__ */ y("div", { className: "token-title-3" }, /* @__PURE__ */ y("span", null, children)));
  }

  // shared/js/ui/templates/protection-header.js
  var import_nanohtml7 = __toESM(require_browser());

  // shared/js/ui/components/text-link.jsx
  function TextLink(props) {
    const { onClick, rounded = false } = props;
    const ref = _(null);
    useRipple({ ref });
    let classNames = [`link-action`, `link-action--text`];
    if (rounded)
      classNames.push(`link-action--rounded`);
    return /* @__PURE__ */ y("a", { href: "javascript:void(0)", className: classNames.join(" "), draggable: false, ref, onClick }, props.children);
  }
  function PlainTextLink({ children, className, ...rest }) {
    const classes = ["text-link-as-button"];
    if (className)
      classes.push(className);
    return /* @__PURE__ */ y("a", { href: "javascript:void(0)", className: classes.join(" "), draggable: false, ...rest }, children);
  }

  // node_modules/@material/switch/constants.js
  var CssClasses;
  (function(CssClasses2) {
    CssClasses2["PROCESSING"] = "mdc-switch--processing";
    CssClasses2["SELECTED"] = "mdc-switch--selected";
    CssClasses2["UNSELECTED"] = "mdc-switch--unselected";
  })(CssClasses || (CssClasses = {}));
  var Selectors;
  (function(Selectors2) {
    Selectors2["RIPPLE"] = ".mdc-switch__ripple";
  })(Selectors || (Selectors = {}));

  // node_modules/@material/base/observer.js
  function observeProperty(target, property, observer) {
    var targetObservers = installObserver(target, property);
    var observers = targetObservers.getObservers(property);
    observers.push(observer);
    return function() {
      observers.splice(observers.indexOf(observer), 1);
    };
  }
  var allTargetObservers = /* @__PURE__ */ new WeakMap();
  function installObserver(target, property) {
    var observersMap = /* @__PURE__ */ new Map();
    if (!allTargetObservers.has(target)) {
      allTargetObservers.set(target, {
        isEnabled: true,
        getObservers: function(key) {
          var observers = observersMap.get(key) || [];
          if (!observersMap.has(key)) {
            observersMap.set(key, observers);
          }
          return observers;
        },
        installedProperties: /* @__PURE__ */ new Set()
      });
    }
    var targetObservers = allTargetObservers.get(target);
    if (targetObservers.installedProperties.has(property)) {
      return targetObservers;
    }
    var descriptor = getDescriptor(target, property) || {
      configurable: true,
      enumerable: true,
      value: target[property],
      writable: true
    };
    var observedDescriptor = __assign({}, descriptor);
    var descGet = descriptor.get, descSet = descriptor.set;
    if ("value" in descriptor) {
      delete observedDescriptor.value;
      delete observedDescriptor.writable;
      var value_1 = descriptor.value;
      descGet = function() {
        return value_1;
      };
      if (descriptor.writable) {
        descSet = function(newValue) {
          value_1 = newValue;
        };
      }
    }
    if (descGet) {
      observedDescriptor.get = function() {
        return descGet.call(this);
      };
    }
    if (descSet) {
      observedDescriptor.set = function(newValue) {
        var e_4, _a2;
        var previous = descGet ? descGet.call(this) : newValue;
        descSet.call(this, newValue);
        if (targetObservers.isEnabled && (!descGet || newValue !== previous)) {
          try {
            for (var _b = __values(targetObservers.getObservers(property)), _c = _b.next(); !_c.done; _c = _b.next()) {
              var observer = _c.value;
              observer(newValue, previous);
            }
          } catch (e_4_1) {
            e_4 = { error: e_4_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a2 = _b.return))
                _a2.call(_b);
            } finally {
              if (e_4)
                throw e_4.error;
            }
          }
        }
      };
    }
    targetObservers.installedProperties.add(property);
    Object.defineProperty(target, property, observedDescriptor);
    return targetObservers;
  }
  function getDescriptor(target, property) {
    var descriptorTarget = target;
    var descriptor;
    while (descriptorTarget) {
      descriptor = Object.getOwnPropertyDescriptor(descriptorTarget, property);
      if (descriptor) {
        break;
      }
      descriptorTarget = Object.getPrototypeOf(descriptorTarget);
    }
    return descriptor;
  }
  function setObserversEnabled(target, enabled) {
    var targetObservers = allTargetObservers.get(target);
    if (targetObservers) {
      targetObservers.isEnabled = enabled;
    }
  }

  // node_modules/@material/base/observer-foundation.js
  var MDCObserverFoundation = (
    /** @class */
    function(_super) {
      __extends(MDCObserverFoundation2, _super);
      function MDCObserverFoundation2(adapter) {
        var _this = _super.call(this, adapter) || this;
        _this.unobserves = /* @__PURE__ */ new Set();
        return _this;
      }
      MDCObserverFoundation2.prototype.destroy = function() {
        _super.prototype.destroy.call(this);
        this.unobserve();
      };
      MDCObserverFoundation2.prototype.observe = function(target, observers) {
        var e_1, _a2;
        var _this = this;
        var cleanup = [];
        try {
          for (var _b = __values(Object.keys(observers)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var property = _c.value;
            var observer = observers[property].bind(this);
            cleanup.push(this.observeProperty(target, property, observer));
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a2 = _b.return))
              _a2.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        var unobserve = function() {
          var e_2, _a3;
          try {
            for (var cleanup_1 = __values(cleanup), cleanup_1_1 = cleanup_1.next(); !cleanup_1_1.done; cleanup_1_1 = cleanup_1.next()) {
              var cleanupFn = cleanup_1_1.value;
              cleanupFn();
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (cleanup_1_1 && !cleanup_1_1.done && (_a3 = cleanup_1.return))
                _a3.call(cleanup_1);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
          _this.unobserves.delete(unobserve);
        };
        this.unobserves.add(unobserve);
        return unobserve;
      };
      MDCObserverFoundation2.prototype.observeProperty = function(target, property, observer) {
        return observeProperty(target, property, observer);
      };
      MDCObserverFoundation2.prototype.setObserversEnabled = function(target, enabled) {
        setObserversEnabled(target, enabled);
      };
      MDCObserverFoundation2.prototype.unobserve = function() {
        var e_3, _a2;
        try {
          for (var _b = __values(__spreadArray([], __read(this.unobserves))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var unobserve = _c.value;
            unobserve();
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a2 = _b.return))
              _a2.call(_b);
          } finally {
            if (e_3)
              throw e_3.error;
          }
        }
      };
      return MDCObserverFoundation2;
    }(MDCFoundation)
  );

  // node_modules/@material/switch/foundation.js
  var MDCSwitchFoundation = (
    /** @class */
    function(_super) {
      __extends(MDCSwitchFoundation2, _super);
      function MDCSwitchFoundation2(adapter) {
        var _this = _super.call(this, adapter) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
      }
      MDCSwitchFoundation2.prototype.init = function() {
        this.observe(this.adapter.state, {
          disabled: this.stopProcessingIfDisabled,
          processing: this.stopProcessingIfDisabled
        });
      };
      MDCSwitchFoundation2.prototype.handleClick = function() {
        if (this.adapter.state.disabled) {
          return;
        }
        this.adapter.state.selected = !this.adapter.state.selected;
      };
      MDCSwitchFoundation2.prototype.stopProcessingIfDisabled = function() {
        if (this.adapter.state.disabled) {
          this.adapter.state.processing = false;
        }
      };
      return MDCSwitchFoundation2;
    }(MDCObserverFoundation)
  );
  var MDCSwitchRenderFoundation = (
    /** @class */
    function(_super) {
      __extends(MDCSwitchRenderFoundation2, _super);
      function MDCSwitchRenderFoundation2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      MDCSwitchRenderFoundation2.prototype.init = function() {
        _super.prototype.init.call(this);
        this.observe(this.adapter.state, {
          disabled: this.onDisabledChange,
          processing: this.onProcessingChange,
          selected: this.onSelectedChange
        });
      };
      MDCSwitchRenderFoundation2.prototype.initFromDOM = function() {
        this.setObserversEnabled(this.adapter.state, false);
        this.adapter.state.selected = this.adapter.hasClass(CssClasses.SELECTED);
        this.onSelectedChange();
        this.adapter.state.disabled = this.adapter.isDisabled();
        this.adapter.state.processing = this.adapter.hasClass(CssClasses.PROCESSING);
        this.setObserversEnabled(this.adapter.state, true);
        this.stopProcessingIfDisabled();
      };
      MDCSwitchRenderFoundation2.prototype.onDisabledChange = function() {
        this.adapter.setDisabled(this.adapter.state.disabled);
      };
      MDCSwitchRenderFoundation2.prototype.onProcessingChange = function() {
        this.toggleClass(this.adapter.state.processing, CssClasses.PROCESSING);
      };
      MDCSwitchRenderFoundation2.prototype.onSelectedChange = function() {
        this.adapter.setAriaChecked(String(this.adapter.state.selected));
        this.toggleClass(this.adapter.state.selected, CssClasses.SELECTED);
        this.toggleClass(!this.adapter.state.selected, CssClasses.UNSELECTED);
      };
      MDCSwitchRenderFoundation2.prototype.toggleClass = function(addClass, className) {
        if (addClass) {
          this.adapter.addClass(className);
        } else {
          this.adapter.removeClass(className);
        }
      };
      return MDCSwitchRenderFoundation2;
    }(MDCSwitchFoundation)
  );

  // node_modules/@material/switch/component.js
  var MDCSwitch = (
    /** @class */
    function(_super) {
      __extends(MDCSwitch2, _super);
      function MDCSwitch2(root, foundation) {
        var _this = _super.call(this, root, foundation) || this;
        _this.root = root;
        return _this;
      }
      MDCSwitch2.attachTo = function(root) {
        return new MDCSwitch2(root);
      };
      MDCSwitch2.prototype.initialize = function() {
        this.ripple = new MDCRipple(this.root, this.createRippleFoundation());
      };
      MDCSwitch2.prototype.initialSyncWithDOM = function() {
        var rippleElement = this.root.querySelector(Selectors.RIPPLE);
        if (!rippleElement) {
          throw new Error("Switch " + Selectors.RIPPLE + " element is required.");
        }
        this.rippleElement = rippleElement;
        this.root.addEventListener("click", this.foundation.handleClick);
        this.foundation.initFromDOM();
      };
      MDCSwitch2.prototype.destroy = function() {
        _super.prototype.destroy.call(this);
        this.ripple.destroy();
        this.root.removeEventListener("click", this.foundation.handleClick);
      };
      MDCSwitch2.prototype.getDefaultFoundation = function() {
        return new MDCSwitchRenderFoundation(this.createAdapter());
      };
      MDCSwitch2.prototype.createAdapter = function() {
        var _this = this;
        return {
          addClass: function(className) {
            _this.root.classList.add(className);
          },
          hasClass: function(className) {
            return _this.root.classList.contains(className);
          },
          isDisabled: function() {
            return _this.root.disabled;
          },
          removeClass: function(className) {
            _this.root.classList.remove(className);
          },
          setAriaChecked: function(ariaChecked) {
            return _this.root.setAttribute("aria-checked", ariaChecked);
          },
          setDisabled: function(disabled) {
            _this.root.disabled = disabled;
          },
          state: this
        };
      };
      MDCSwitch2.prototype.createRippleFoundation = function() {
        return new MDCRippleFoundation(this.createRippleAdapter());
      };
      MDCSwitch2.prototype.createRippleAdapter = function() {
        var _this = this;
        return __assign(__assign({}, MDCRipple.createAdapter(this)), { computeBoundingRect: function() {
          return _this.rippleElement.getBoundingClientRect();
        }, isUnbounded: function() {
          return true;
        } });
      };
      return MDCSwitch2;
    }(MDCComponent)
  );

  // shared/js/ui/components/toggle.jsx
  function ProtectionToggle(props) {
    const [toggleState, toggle] = useToggleState(props.model, props.toggle);
    const altText = ns.site("updatingProtectionList.title");
    return /* @__PURE__ */ y("div", { class: `site-info-toggle ${toggleState.active ? "is-active" : ""}` }, /* @__PURE__ */ y("p", { class: "site-info__protection" }, /* @__PURE__ */ y("span", { role: "textbox", dangerouslySetInnerHTML: { __html: toggleState.text } })), /* @__PURE__ */ y("div", { class: "site-info__toggle-container" }, toggleState.toggled && /* @__PURE__ */ y("img", { src: "../img/spinner.svg", className: "toggle-spinner", alt: altText }), !toggleState.toggled && /* @__PURE__ */ y(ToggleButton, { toggleState, onToggle: toggle })));
  }
  function useToggleState(model, toggle) {
    const [state, setState] = h2(() => {
      const toggleState = {
        text: ns.site("protectionsEnabled.title"),
        active: true,
        disabled: false,
        label: "",
        toggled: false,
        sideEffects: false
      };
      if (!model.protectionsEnabled) {
        toggleState.text = ns.site("protectionsDisabled.title");
        toggleState.active = false;
      }
      if (model.isBroken) {
        if (!isBrowser()) {
          toggleState.active = false;
          toggleState.disabled = true;
        }
      }
      const labelEnabled = ns.site("enableProtectionsSwitch.title");
      const labelDisabled = ns.site("disableProtectionsSwitch.title");
      toggleState.label = toggleState.active ? labelDisabled : labelEnabled;
      return toggleState;
    });
    p2(() => {
      if (!state.sideEffects)
        return;
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
      const timeout = isReducedMotion ? 0 : 300;
      const int = setTimeout(() => {
        toggle();
        if (model.features.spinnerFollowingProtectionsToggle) {
          setState((prev) => {
            return { ...prev, toggled: true };
          });
        }
      }, timeout);
      return () => {
        clearTimeout(int);
      };
    }, [state.active, state.sideEffects]);
    function toggleInternal() {
      setState((prev) => {
        return { ...prev, active: !prev.active, sideEffects: true };
      });
    }
    return [state, toggleInternal];
  }
  function ToggleButton(props) {
    const { toggleState } = props;
    const labelEnabled = ns.site("enableProtectionsSwitch.title");
    const labelDisabled = ns.site("disableProtectionsSwitch.title");
    const label = toggleState.active ? labelDisabled : labelEnabled;
    return isAndroid() ? /* @__PURE__ */ y(AndroidToggle, { toggleState, onToggle: props.onToggle, label }) : /* @__PURE__ */ y(DefaultToggleButton, { toggleState, label, onToggle: props.onToggle });
  }
  function AndroidToggle(props) {
    const ref = _(null);
    const className = `mdc-switch mdc-switch--${props.toggleState.active ? "selected" : "unselected"}`;
    y2(() => {
      if (!ref.current)
        return;
      const elem = (
        /** @type {HTMLButtonElement} */
        ref.current
      );
      if (!(elem instanceof HTMLButtonElement))
        return;
      const switchInstance = new MDCSwitch(ref.current);
      switchInstance.listen("click", () => {
        const pressed = elem.getAttribute("aria-checked");
        const next = pressed === "true" ? "false" : "true";
        elem.setAttribute("aria-checked", next);
        props.onToggle();
        switchInstance.destroy();
      });
      return () => {
        switchInstance.destroy();
      };
    }, []);
    return /* @__PURE__ */ y(
      "button",
      {
        ref,
        id: "basic-switch",
        class: className,
        type: "button",
        role: "switch",
        "aria-checked": "false",
        "aria-label": props.label,
        disabled: props.toggleState.disabled
      },
      /* @__PURE__ */ y("div", { class: "mdc-switch__track" }),
      /* @__PURE__ */ y("div", { class: "mdc-switch__handle-track" }, /* @__PURE__ */ y("div", { class: "mdc-switch__handle" }, /* @__PURE__ */ y("div", { class: "mdc-switch__shadow" }, /* @__PURE__ */ y("div", { class: "mdc-elevation-overlay" })), /* @__PURE__ */ y("div", { class: "mdc-switch__ripple" }))),
      /* @__PURE__ */ y("span", { class: "mdc-switch__focus-ring-wrapper" }, /* @__PURE__ */ y("div", { class: "mdc-switch__focus-ring" }))
    );
  }
  function DefaultToggleButton(props) {
    const { toggleState, label } = props;
    return /* @__PURE__ */ y(
      "button",
      {
        class: "toggle-button",
        type: "button",
        role: "switch",
        "aria-checked": toggleState.active,
        "aria-label": label,
        disabled: toggleState.disabled,
        onClick: props.onToggle
      },
      /* @__PURE__ */ y("div", { class: "toggle-button__track" }),
      /* @__PURE__ */ y("div", { class: "toggle-button__handle" })
    );
  }

  // shared/js/ui/templates/protection-header.js
  var ProtectionContext = G(
    /** @type {{state: UIState, setState: (st: UIState) => void; model: MigrationModel}} */
    {}
  );
  function ProtectionHeader({ model, initialState, toggle, children, ...rest }) {
    let initial;
    if (initialState) {
      initial = initialState;
    } else {
      if (model.isBroken || model.isAllowlisted) {
        initial = "form-trigger";
      } else {
        initial = "help-trigger";
      }
    }
    const [state, setState] = h2(
      /** @type {UIState} */
      initial
    );
    return /* @__PURE__ */ y("div", { ...rest }, /* @__PURE__ */ y("div", { class: "card-list--bordered" }, model.isBroken && /* @__PURE__ */ y(HeaderDisabled, { model, state, toggle }), !model.isBroken && /* @__PURE__ */ y(HeaderDefault, { model, state, toggle })), /* @__PURE__ */ y(
      ProtectionContext.Provider,
      {
        value: {
          state,
          setState,
          model
        }
      },
      children
    ));
  }
  function HeaderDefault(props) {
    const text = ns.site("websiteNotWorkingAdvice.title");
    const showHelp = props.state === "site-not-working" && !props.model.isAllowlisted;
    return /* @__PURE__ */ y("div", { className: "protection-toggle" }, /* @__PURE__ */ y("div", { className: "protection-toggle__row" }, /* @__PURE__ */ y(ProtectionToggle, { model: props.model, toggle: props.toggle })), showHelp && /* @__PURE__ */ y("div", { className: "protection-toggle__row protection-toggle__row--alt" }, text));
  }
  function HeaderDisabled(props) {
    let text = i18n.t("site:protectionsDisabledRemote.title");
    if (props.model.isDenylisted) {
      text = i18n.t("site:protectionsDisabledRemoteOverride.title");
    }
    return /* @__PURE__ */ y(k, null, /* @__PURE__ */ y("div", { className: "padding-x padding-y--reduced" }, /* @__PURE__ */ y(ProtectionToggle, { model: props.model, toggle: props.toggle })), /* @__PURE__ */ y("div", { className: "note note--nested" }, text));
  }

  // v2/components/protection-header.jsx
  function ProtectionHeader2() {
    const { push } = useNav();
    const data = useData();
    const onToggle = useToggle();
    const fetcher = useFetcher();
    const { breakageScreen } = useFeatures();
    return /* @__PURE__ */ y("div", { "data-testid": "protectionHeader" }, /* @__PURE__ */ y(ProtectionHeader, { model: data, toggle: onToggle }, /* @__PURE__ */ y("div", { className: "text--center" }, /* @__PURE__ */ y(
      TextLink,
      {
        onClick: () => {
          fetcher(new CheckBrokenSiteReportHandledMessage()).then(() => {
            if (!isAndroid()) {
              push(breakageScreen);
            }
          }).catch(console.error);
        },
        rounded: true
      },
      ns.site("websiteNotWorkingPrompt.title")
    ))));
  }

  // shared/js/ui/views/fire-dialog.js
  var import_nanohtml8 = __toESM(require_browser());
  var import_raw3 = __toESM(require_raw_browser());
  function fireSummaryTemplate(selectedOption) {
    const { descriptionStats } = selectedOption;
    let template2 = "firebutton:summary";
    if (descriptionStats.clearHistory && descriptionStats.openTabs) {
      template2 += "ClearTabsHistory";
    } else if (descriptionStats.clearHistory && !descriptionStats.openTabs) {
      template2 += "ClearHistory";
    } else if (!descriptionStats.clearHistory && descriptionStats.openTabs) {
      template2 += "ClearTabs";
    } else {
      template2 += "ClearCookies";
    }
    if (descriptionStats.site) {
      template2 += "Site";
    } else if (descriptionStats.duration === "all") {
      template2 += "All";
    } else {
      template2 += "Duration";
    }
    template2 += ".title";
    return import_nanohtml8.default`<div id="fire-button-summary">
        <p>
            ${(0, import_raw3.default)(
      i18n.t(template2, {
        durationDesc: i18n.t("firebutton:historyDuration.title", { duration: descriptionStats.duration }),
        ...descriptionStats
      })
    )}
        </p>
        ${descriptionStats.site && descriptionStats.clearHistory ? import_nanohtml8.default`<p class="fire-button-disclaimer">${i18n.t("firebutton:historyAndDownloadsNotAffected.title")}</p>` : null}
        ${descriptionStats.openTabs && descriptionStats.pinnedTabs ? import_nanohtml8.default`<p class="fire-button-disclaimer">
                  ${(0, import_raw3.default)(i18n.t("firebutton:summaryPinnedIgnored.title", { tabs: descriptionStats.pinnedTabs }))}
              </p>` : null}
    </div>`;
  }

  // v2/components/fire-dialog.jsx
  function FireProvider({ onCancel }) {
    const [fireOptions, setFireOptions] = h2(
      /** @type {null | FireOption[]} */
      null
    );
    const fetcher = useFetcher();
    p2(() => {
      const msg = new FetchBurnOptions();
      fetcher(msg).then((resp) => {
        setFireOptions(resp.options);
      }).catch(console.error);
    }, [fetcher]);
    function onUpdate(index) {
      if (!fireOptions)
        return;
      const selectedOption = index;
      const opts = fireOptions[selectedOption];
      fetcher(new SetBurnDefaultOption(opts.name)).catch(console.error);
    }
    function onBurn(index) {
      if (!fireOptions)
        return;
      const selectedOption = index;
      const opts = fireOptions[selectedOption].options;
      fetcher(new BurnMessage(
        /** @type {any} */
        opts
      )).then(() => {
        onCancel();
      });
    }
    if (fireOptions === null)
      return null;
    return /* @__PURE__ */ y(FireDialog, { fireOptions, onUpdate, onCancel, onBurn });
  }
  function FireDialog({ fireOptions, onUpdate, onCancel, onBurn }) {
    if (!fireOptions) {
      return /* @__PURE__ */ y("dialog", { id: "fire-button-container" });
    }
    let selectedOptionIndex = fireOptions.findIndex(({ selected }) => selected);
    if (selectedOptionIndex < 0) {
      selectedOptionIndex = 0;
    }
    const [value, setValue] = h2(selectedOptionIndex);
    const selectedOption = fireOptions[value];
    const selectOptions = fireOptions.map(({ name }, index) => /* @__PURE__ */ y("option", { value: index }, i18n.t(`firebutton:option${name}.title`)));
    const summary = fireSummaryTemplate(selectedOption);
    function onChange(e3) {
      setValue(Number(e3.target.value));
      onUpdate(Number(e3.target.value));
    }
    return /* @__PURE__ */ y("dialog", { id: "fire-button-container", open: true }, /* @__PURE__ */ y("div", { id: "fire-button-content" }, /* @__PURE__ */ y("span", { id: "fire-button-header" }, /* @__PURE__ */ y("img", { src: "../img/fire-button-header.svg" }), /* @__PURE__ */ y("h3", null, selectedOption.descriptionStats.openTabs > 0 ? i18n.t("firebutton:fireDialogHeader.title") : i18n.t("firebutton:fireDialogHeaderNoTabs.title"))), /* @__PURE__ */ y("select", { id: "fire-button-opts", onChange, value }, selectOptions), /* @__PURE__ */ y(DomNode, null, summary), /* @__PURE__ */ y("div", { id: "fire-button-row" }, /* @__PURE__ */ y("button", { id: "fire-button-cancel", onClick: onCancel }, i18n.t("firebutton:cancel.title")), /* @__PURE__ */ y("button", { id: "fire-button-burn", onClick: () => onBurn(value) }, i18n.t("firebutton:clearData.title")))));
  }

  // v2/components/search-bar.jsx
  function SearchBar() {
    const data = useData();
    const fetcher = useFetcher();
    const showFireButton = data.fireButton?.enabled === true;
    const [focussed, setFocussed] = h2(false);
    const [fireDialogOpen, setFireDialogOpen] = h2(false);
    function openSettings() {
      const msg = new OpenOptionsMessage();
      fetcher(msg).catch(console.error);
    }
    function openFire() {
      setFireDialogOpen(true);
    }
    function doSearch(e3) {
      e3.preventDefault();
      const values = Object.fromEntries(new FormData(e3.target));
      if (!values.q || !(typeof values.q === "string")) {
        return console.warn("missing value");
      }
      const msg = new SearchMessage({ term: values.q });
      fetcher(msg).catch(console.error);
    }
    const fireButton = showFireButton ? /* @__PURE__ */ y("button", { type: "button", class: "fire-button", onClick: openFire }, /* @__PURE__ */ y(FireIcon, null)) : null;
    if (!data.tab.search)
      return null;
    return /* @__PURE__ */ y("div", { className: "search token-search-input" }, /* @__PURE__ */ y("form", { className: "search-form", name: "x", "data-test-id": "search-form", "data-focussed": focussed, onSubmit: doSearch }, /* @__PURE__ */ y(
      "input",
      {
        type: "text",
        autoComplete: "off",
        autoFocus: true,
        placeholder: ns.site("searchPlaceholder.title"),
        name: "q",
        className: "search-form__input",
        defaultValue: "",
        onInput: (e3) => setFocussed(e3.target.value.length > 0),
        onBlur: () => setFocussed(false),
        onFocus: (e3) => setFocussed(e3.target.value.length > 0)
      }
    ), /* @__PURE__ */ y("button", { className: "search-form__go", type: "submit", "aria-label": ns.site("searchGoButton.title") }, /* @__PURE__ */ y(LoupeIcon, null))), fireButton, fireDialogOpen ? /* @__PURE__ */ y(FireProvider, { onCancel: () => setFireDialogOpen(false) }) : null, /* @__PURE__ */ y("button", { type: "button", className: "cog-button", "aria-label": ns.site("optionsButton.title"), onClick: openSettings }, /* @__PURE__ */ y(CogIcon, null)));
  }
  function LoupeIcon() {
    return /* @__PURE__ */ y("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ y("rect", { class: "loupe-handle", x: "11.5", y: "12.9142", width: "2", height: "6", rx: "1", transform: "rotate(-45 11.5 12.9142)" }), /* @__PURE__ */ y(
      "path",
      {
        class: "loupe-glass",
        d: "M12.6976 5.27292C14.7478 7.32317 14.7478 10.6473 12.6976 12.6975C10.6473 14.7478 7.32322 14.7478 5.27297 12.6975C3.22272 10.6473 3.22272 7.32317 5.27297 5.27292C7.32322 3.22267 10.6473 3.22267 12.6976 5.27292Z",
        "stroke-width": "1.5"
      }
    ));
  }
  function CogIcon() {
    return /* @__PURE__ */ y("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ y(
      "path",
      {
        class: "settings-cog",
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M3.43351 13.1462C3.06364 14.0391 3.48767 15.0628 4.3806 15.4327L5.30448 15.8154C6.19741 16.1853 7.2211 15.7612 7.59096 14.8683L7.84778 14.2483C7.89842 14.2495 7.94918 14.2501 8.00007 14.2501C8.05068 14.2501 8.10118 14.2495 8.15154 14.2483L8.40831 14.8682C8.77818 15.7611 9.80187 16.1852 10.6948 15.8153L11.6187 15.4326C12.5116 15.0628 12.9356 14.0391 12.5658 13.1461L12.3093 12.527C12.3828 12.457 12.4546 12.3853 12.5247 12.3118L13.1437 12.5682C14.0366 12.9381 15.0603 12.514 15.4302 11.6211L15.8129 10.6972C16.1827 9.8043 15.7587 8.7806 14.8658 8.41074L14.2482 8.15493C14.2494 8.10345 14.2501 8.05185 14.2501 8.00011C14.2501 7.94964 14.2495 7.89928 14.2483 7.84905L14.8659 7.59324C15.7588 7.22337 16.1828 6.19968 15.8129 5.30675L15.4303 4.38287C15.0604 3.48994 14.0367 3.06592 13.1438 3.43578L12.5273 3.69115C12.4568 3.61712 12.3845 3.54482 12.3105 3.47432L12.5658 2.85787C12.9357 1.96494 12.5117 0.94124 11.6188 0.571378L10.6949 0.188694C9.80195 -0.181168 8.77825 0.242858 8.40839 1.13579L8.15316 1.75196C8.10226 1.75073 8.05122 1.75011 8.00007 1.75011C7.94864 1.75011 7.89734 1.75074 7.84616 1.75198L7.59089 1.13569C7.22102 0.242766 6.19733 -0.181263 5.3044 0.1886L4.38052 0.571284C3.4876 0.941146 3.06357 1.96484 3.43343 2.85777L3.68905 3.47488C3.61513 3.54532 3.54293 3.61755 3.47254 3.69151L2.85533 3.43585C1.9624 3.06599 0.938705 3.49002 0.568843 4.38295L0.186159 5.30683C-0.183704 6.19975 0.240324 7.22345 1.13325 7.59331L1.75185 7.84955C1.75067 7.89961 1.75007 7.9498 1.75007 8.00011C1.75007 8.05168 1.7507 8.10312 1.75194 8.15443L1.13335 8.41066C0.240417 8.78052 -0.18361 9.80422 0.186252 10.6971L0.568936 11.621C0.938798 12.514 1.96249 12.938 2.85542 12.5681L3.47512 12.3114C3.54507 12.3848 3.6168 12.4565 3.69022 12.5265L3.43351 13.1462ZM1.61161 6.43846C1.35648 6.33279 1.23533 6.0403 1.34101 5.78518L1.72369 4.8613C1.82937 4.60618 2.12185 4.48503 2.37697 4.5907L3.47809 5.0468C3.69752 5.13769 3.94855 5.05988 4.09713 4.87459C4.32641 4.58865 4.58647 4.32845 4.87227 4.099C5.05738 3.95039 5.13507 3.69948 5.04422 3.48016L4.58828 2.37941C4.4826 2.12429 4.60375 1.83181 4.85888 1.72613L5.78276 1.34345C6.03788 1.23777 6.33036 1.35893 6.43604 1.61405L6.89159 2.71385C6.98246 2.93322 7.21488 3.05571 7.45092 3.02993C7.63126 3.01022 7.81448 3.00011 8.00007 3.00011C8.18541 3.00011 8.3684 3.0102 8.54851 3.02985C8.78452 3.0556 9.01691 2.93311 9.10776 2.71377L9.56324 1.61414C9.66891 1.35902 9.9614 1.23787 10.2165 1.34354L11.1404 1.72623C11.3955 1.8319 11.5167 2.12439 11.411 2.37951L10.9553 3.47967C10.8644 3.69901 10.9422 3.94995 11.1273 4.09856C11.4132 4.32802 11.6734 4.58826 11.9027 4.87425C12.0513 5.05952 12.3023 5.13731 12.5217 5.04642L13.6221 4.59063C13.8773 4.48495 14.1697 4.6061 14.2754 4.86122L14.6581 5.7851C14.7638 6.04023 14.6426 6.33271 14.3875 6.43839L13.2866 6.89438C13.0674 6.98521 12.9449 7.21748 12.9705 7.45343C12.99 7.63298 13.0001 7.81537 13.0001 8.00011C13.0001 8.18597 12.9899 8.36945 12.9702 8.55005C12.9443 8.78611 13.0668 9.01859 13.2862 9.10947L14.3874 9.56559C14.6425 9.67126 14.7637 9.96375 14.658 10.2189L14.2753 11.1427C14.1696 11.3979 13.8772 11.519 13.622 11.4133L12.5195 10.9566C12.3002 10.8658 12.0493 10.9435 11.9007 11.1285C11.6715 11.4139 11.4117 11.6736 11.1262 11.9026C10.941 12.0511 10.8632 12.3021 10.9541 12.5215L11.4109 13.6245C11.5166 13.8796 11.3954 14.1721 11.1403 14.2778L10.2164 14.6604C9.96132 14.7661 9.66884 14.645 9.56316 14.3898L9.1062 13.2866C9.01536 13.0673 8.78307 12.9449 8.54711 12.9705C8.36745 12.9901 8.18493 13.0001 8.00007 13.0001C7.81497 13.0001 7.63221 12.9901 7.45233 12.9705C7.21634 12.9447 6.984 13.0672 6.89316 13.2865L6.43611 14.3899C6.33044 14.6451 6.03796 14.7662 5.78283 14.6605L4.85895 14.2779C4.60383 14.1722 4.48268 13.8797 4.58836 13.6246L5.04545 12.521C5.13632 12.3017 5.05857 12.0507 4.87337 11.9021C4.58799 11.6731 4.32826 11.4135 4.09918 11.1282C3.95057 10.9431 3.69967 10.8654 3.48037 10.9563L2.37707 11.4133C2.12194 11.5189 1.82946 11.3978 1.72379 11.1427L1.3411 10.2188C1.23543 9.96367 1.35658 9.67119 1.6117 9.56551L2.71385 9.10898C2.93323 9.01811 3.05572 8.78566 3.02992 8.54962C3.01019 8.36916 3.00007 8.18582 3.00007 8.00011C3.00007 7.81552 3.01007 7.63327 3.02957 7.45386C3.0552 7.21793 2.93271 6.98568 2.71345 6.89486L1.61161 6.43846ZM6.12508 8.00008C6.12508 6.96455 6.96455 6.12508 8.00008 6.12508C9.03562 6.12508 9.87508 6.96455 9.87508 8.00008C9.87508 9.03562 9.03562 9.87508 8.00008 9.87508C6.96455 9.87508 6.12508 9.03562 6.12508 8.00008ZM8.00008 4.87508C6.27419 4.87508 4.87508 6.27419 4.87508 8.00008C4.87508 9.72597 6.27419 11.1251 8.00008 11.1251C9.72597 11.1251 11.1251 9.72597 11.1251 8.00008C11.1251 6.27419 9.72597 4.87508 8.00008 4.87508Z",
        "fill-opacity": "0.8"
      }
    ));
  }
  function FireIcon() {
    return /* @__PURE__ */ y("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ y(
      "path",
      {
        class: "fire-icon",
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M6.51018 15.53C5.52187 15.1832 4.62831 14.6102 3.90082 13.8566C3.17333 13.1031 2.63205 12.1899 2.32018 11.19C2.00674 10.2021 1.95815 9.14927 2.17926 8.1367C2.40038 7.12413 2.88345 6.18736 3.58018 5.42005C3.55105 5.89155 3.6297 6.36349 3.81018 6.80005C4.02356 7.25295 4.32236 7.6604 4.69018 8.00005C4.69018 8.00005 4.12018 6.49005 5.50018 4.00005C6.05384 3.11404 6.78312 2.35083 7.64306 1.75747C8.50299 1.16412 9.47535 0.7532 10.5002 0.550049C9.98701 1.37608 9.80819 2.36673 10.0002 3.32005C10.3002 4.32005 10.7902 4.86005 11.3402 6.32005C11.6533 7.02128 11.8102 7.78217 11.8002 8.55005C11.8926 8.00549 12.0787 7.48106 12.3502 7.00005C12.8054 6.23481 13.5124 5.65154 14.3502 5.35005C13.9624 6.24354 13.8043 7.21983 13.8902 8.19005C14.1302 9.57207 14.0026 10.9929 13.5202 12.31C13.1428 13.1433 12.5799 13.8792 11.8745 14.4616C11.1691 15.0439 10.3398 15.4573 9.45018 15.67C10.0364 15.44 10.5354 15.0313 10.8765 14.5018C11.2175 13.9723 11.3832 13.349 11.3502 12.72C11.252 11.9769 10.8985 11.2911 10.3502 10.78C10.0002 12.67 9.00018 12.89 9.00018 12.89C9.38752 12.0753 9.62788 11.1985 9.71018 10.3C9.76455 9.73167 9.71025 9.15813 9.55018 8.61005C9.35806 7.62829 8.80504 6.75416 8.00018 6.16005C8.05821 6.68407 8.0102 7.21441 7.85902 7.7195C7.70784 8.22458 7.45657 8.69408 7.12018 9.10005C6.31018 10.36 4.94018 11.29 5.00018 13.17C5.02637 13.6604 5.17925 14.1356 5.44391 14.5492C5.70856 14.9628 6.07594 15.3008 6.51018 15.53Z",
        "fill-opacity": "0.84"
      }
    ));
  }

  // v2/components/email.jsx
  init_lib();
  var formatAddress = (address) => address + "@duck.com";
  var EmailContext = G({
    /** @type {EmailState} */
    state: {
      state: "unknown",
      alias: null
    },
    /** @type {() => void} */
    copyAlias: () => {
      throw new Error("todo: implement refresh");
    }
  });
  function EmailProvider({ children }) {
    const data = useData();
    const fetcher = useFetcher();
    const hasAlias = typeof data.emailProtectionUserData?.nextAlias === "string";
    const initialState = {
      state: hasAlias ? "idle" : "unknown",
      alias: hasAlias ? data.emailProtectionUserData?.nextAlias : null
    };
    const [state, dispatch] = s2((state2, action) => {
      switch (state2.state) {
        case "added": {
          switch (action.type) {
            case "update": {
              return {
                ...state2,
                alias: action.alias
              };
            }
            case "reset": {
              return {
                ...state2,
                state: (
                  /** @type {const} */
                  "idle"
                )
              };
            }
            default:
              return state2;
          }
        }
        case "idle":
        case "unknown":
          switch (action.type) {
            case "copy": {
              return {
                ...state2,
                state: (
                  /** @type {const} */
                  "added"
                )
              };
            }
          }
          break;
      }
      return state2;
    }, initialState);
    function copyAlias() {
      dispatch({ type: "copy" });
      if (!state.alias) {
        return console.warn("missing state.alias");
      }
      navigator.clipboard?.writeText(formatAddress(state.alias));
      const msg = new RefreshEmailAliasMessage();
      fetcher(msg).then((resp) => {
        console.log("--", resp);
        const response = z3.object({
          privateAddress: z3.string().optional()
        });
        const parsed = response.safeParse(resp);
        if (!parsed.success) {
          console.warn("response did not contain a valid private address", resp);
          dispatch({
            type: "update",
            alias: null
          });
        } else {
          if (!parsed.data.privateAddress) {
            return console.warn("missing `privateAddress`");
          }
          dispatch({
            type: "update",
            alias: parsed.data.privateAddress
          });
        }
      }).catch((e3) => console.error("error refreshing", e3)).finally(() => {
        setTimeout(() => {
          dispatch({ type: "reset" });
        }, 2e3);
      });
    }
    if (state.state === "unknown")
      return null;
    return /* @__PURE__ */ y(EmailContext.Provider, { value: { state, copyAlias } }, children);
  }
  function EmailBar() {
    const { state, copyAlias } = q2(EmailContext);
    const text = state.state === "idle" ? i18n.t("site:createNewDuckAddress.title") : i18n.t("site:createNewDuckAddressCopied.title");
    const icon = state.state === "idle" ? /* @__PURE__ */ y(WandIcon, null) : /* @__PURE__ */ y(CheckMarkIcon, null);
    return /* @__PURE__ */ y("div", { id: "email-alias-container" }, /* @__PURE__ */ y("div", { className: "js-email-alias email-alias token-body-em" }, /* @__PURE__ */ y(
      "button",
      {
        className: "email-alias__button",
        type: "button",
        "data-state": state.state,
        disabled: state.state === "added",
        onClick: copyAlias
      },
      icon,
      /* @__PURE__ */ y("span", { className: "email-alias__text" }, text)
    )));
  }
  function WandIcon() {
    return /* @__PURE__ */ y("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none" }, /* @__PURE__ */ y("path", { d: "M10.4998 0.75C10.4998 0.335786 10.164 0 9.74976 0C9.33554 0 8.99976 0.335786 8.99976 0.75V3.25C8.99976 3.66421 9.33554 4 9.74976 4C10.164 4 10.4998 3.66421 10.4998 3.25V0.75Z" }), /* @__PURE__ */ y("path", { d: "M10.4998 9.75C10.4998 9.33579 10.164 9 9.74976 9C9.33554 9 8.99976 9.33579 8.99976 9.75V12.25C8.99976 12.6642 9.33554 13 9.74976 13C10.164 13 10.4998 12.6642 10.4998 12.25V9.75Z" }), /* @__PURE__ */ y("path", { d: "M15.9998 6.25C15.9998 6.66421 15.664 7 15.2498 7H12.7498C12.3355 7 11.9998 6.66421 11.9998 6.25C11.9998 5.83579 12.3355 5.5 12.7498 5.5H15.2498C15.664 5.5 15.9998 5.83579 15.9998 6.25Z" }), /* @__PURE__ */ y("path", { d: "M6.24976 7C6.66397 7 6.99976 6.66421 6.99976 6.25C6.99976 5.83579 6.66397 5.5 6.24976 5.5H3.74976C3.33554 5.5 2.99976 5.83579 2.99976 6.25C2.99976 6.66421 3.33554 7 3.74976 7H6.24976Z" }), /* @__PURE__ */ y("path", { d: "M14.2801 10.7803C13.9872 11.0732 13.5123 11.0732 13.2194 10.7803L11.4694 9.03033C11.1765 8.73744 11.1765 8.26256 11.4694 7.96967C11.7623 7.67678 12.2372 7.67678 12.5301 7.96967L14.2801 9.71967C14.573 10.0126 14.573 10.4874 14.2801 10.7803Z" }), /* @__PURE__ */ y("path", { d: "M6.71942 4.28033C7.01231 4.57322 7.48719 4.57322 7.78008 4.28033C8.07297 3.98744 8.07297 3.51256 7.78008 3.21967L6.03008 1.46967C5.73719 1.17678 5.26231 1.17678 4.96942 1.46967C4.67653 1.76256 4.67653 2.23744 4.96942 2.53033L6.71942 4.28033Z" }), /* @__PURE__ */ y("path", { d: "M11.4694 4.53032C11.1765 4.23743 11.1765 3.76256 11.4694 3.46966L13.2194 1.71966C13.5123 1.42677 13.9872 1.42677 14.2801 1.71966C14.573 2.01256 14.573 2.48743 14.2801 2.78032L12.5301 4.53032C12.2372 4.82322 11.7623 4.82322 11.4694 4.53032Z" }), /* @__PURE__ */ y("path", { d: "M2.28296 12.658L9.24784 5.69307C9.54074 5.40018 10.0156 5.40018 10.3085 5.69307V5.69307C10.6014 5.98597 10.6014 6.46084 10.3085 6.75373L3.34362 13.7186L2.28296 12.658Z" }), /* @__PURE__ */ y("path", { d: "M0.243221 15.7588C-0.0496725 15.466 -0.0496726 14.9911 0.243221 14.6982L1.75195 13.1895L2.81261 14.2501L1.30388 15.7588C1.01099 16.0517 0.536114 16.0517 0.243221 15.7588V15.7588Z" }));
  }
  function CheckMarkIcon() {
    return /* @__PURE__ */ y("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none" }, /* @__PURE__ */ y("path", { d: "M11.809 6.2501C12.0851 5.94141 12.0588 5.46727 11.7501 5.19108C11.4414 4.91488 10.9673 4.94122 10.6911 5.24991L7.0255 9.34675L5.33049 7.27508C5.06819 6.9545 4.59568 6.90724 4.27509 7.16954C3.95451 7.43183 3.90726 7.90435 4.16955 8.22494L6.41955 10.9749C6.55833 11.1446 6.76436 11.245 6.98346 11.2498C7.20256 11.2547 7.41282 11.1634 7.55895 11.0001L11.809 6.2501Z" }), /* @__PURE__ */ y(
      "path",
      {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z"
      }
    ));
  }

  // shared/js/ui/templates/site.js
  var import_nanohtml9 = __toESM(require_browser());
  function localizePermissions(permissions) {
    if (!Array.isArray(permissions) || permissions.length === 0) {
      return [];
    }
    const updatedPermissions = JSON.parse(JSON.stringify(permissions));
    return updatedPermissions.map((perm) => {
      const permKey = `permissions:${perm.key}.title`;
      if (i18n.exists(permKey)) {
        perm.title = i18n.t(permKey);
      }
      perm.options = perm.options.map((option) => {
        const optionKey = `permissions:${option.id}.title`;
        if (i18n.exists(optionKey)) {
          option.title = i18n.t(optionKey);
        }
        return option;
      });
      return perm;
    });
  }

  // v2/components/page-outer.jsx
  function PageOuter({ children }) {
    return /* @__PURE__ */ y("div", { class: "page-outer" }, children);
  }

  // v2/components/permissions.jsx
  function Permissions() {
    const data = useData();
    if (!data.permissions || data.permissions.length === 0) {
      return null;
    }
    const localizedPerms = localizePermissions(data.permissions);
    const fetcher = useFetcher();
    function update(id, value) {
      console.log(id, value);
      fetcher(new UpdatePermissionMessage({ id, value })).catch((e3) => console.error(e3));
    }
    return /* @__PURE__ */ y(PageOuter, null, /* @__PURE__ */ y("div", { className: "site-info__li--manage-permissions" }, localizedPerms.map(({ key: permissionId, title, permission, options }) => {
      return /* @__PURE__ */ y("div", { className: "site-info__page-permission" }, /* @__PURE__ */ y("label", null, /* @__PURE__ */ y("div", null, /* @__PURE__ */ y("div", { className: "site-info__page-permission__icon", "data-icon": permissionId }), title), /* @__PURE__ */ y("select", { name: permissionId, onChange: (e3) => update(
        permissionId,
        /** @type {any} */
        e3.target.value
      ) }, options.map(({ id, title: title2 }) => /* @__PURE__ */ y("option", { value: id, selected: permission === id }, title2)))));
    })));
  }

  // v2/screens/cta-screen.jsx
  function CtaScreen() {
    const data = useData();
    const ctas = {
      spread: {
        title: i18n.t("ctascreens:spreadTitle.title"),
        text: i18n.t("ctascreens:spreadText.title"),
        icon: heartArrowSvg,
        action: /* @__PURE__ */ y("a", { href: "https://duckduckgo.com/spread", target: "_blank", class: "cta__button" }, i18n.t("ctascreens:spreadButton.title"))
      },
      email: {
        title: i18n.t("ctascreens:emailTitle.title"),
        text: i18n.t("ctascreens:emailText.title"),
        icon: emailSvg,
        action: /* @__PURE__ */ y("a", { href: "https://duckduckgo.com/email", target: "_blank", class: "cta__button" }, i18n.t("ctascreens:spreadButton.title"))
      }
    };
    const keys = Object.keys(ctas);
    const ctaKey = data.emailProtectionUserData?.nextAlias ? "spread" : keys[Math.floor(Math.random() * keys.length)];
    const cta = ctas[ctaKey];
    return /* @__PURE__ */ y("div", { className: "cta-screen page-inner" }, /* @__PURE__ */ y("p", { className: "note token-title-3 text--center" }, i18n.t("ctascreens:protectionsUnavailableNote.title")), /* @__PURE__ */ y("div", { className: "cta text--center" }, /* @__PURE__ */ y("div", { className: "cta__icon", dangerouslySetInnerHTML: { __html: cta.icon() } }), /* @__PURE__ */ y("h1", { className: "cta__title" }, cta.title), /* @__PURE__ */ y("h2", { className: "cta__text" }, cta.text), /* @__PURE__ */ y("div", { className: "cta__action" }, cta.action)));
  }
  function heartArrowSvg() {
    return `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M78.5138 21L71.5098 28.003V34.003L78.5138 27V21Z" fill="#C0C0C0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M78.505 27.0034L71.51 33.9614H77.51L84.505 27.0034H78.505Z" fill="#C0C0C0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M66.339 42.0032L63.51 39.1742L76.684 26.0012L79.512 28.8302L66.339 42.0032Z" fill="#C0C0C0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M64.755 32.1171C58.769 31.3911 53.4 34.2001 50.505 38.6781C47.61 34.2001 42.241 31.3911 36.255 32.1171C29.715 32.9091 24.444 38.0531 23.619 44.4181C23.577 44.7471 23.546 45.0751 23.526 45.4001C23.293 49.2851 24.979 53.0491 27.799 55.8071L50.505 78.0031L73.211 55.8071C76.031 53.0491 77.717 49.2851 77.484 45.4001C77.464 45.0751 77.433 44.7471 77.391 44.4181C76.566 38.0531 71.295 32.9091 64.755 32.1171Z" fill="#DE5833"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M77.3909 44.4179C76.5659 38.0529 71.2949 32.9099 64.7549 32.1169C62.5109 31.8449 60.3539 32.0699 58.3809 32.6929C63.6639 34.3599 67.6819 38.9309 68.3929 44.4179C68.4359 44.7479 68.4669 45.0749 68.4869 45.3999C68.7189 49.2849 67.0349 53.0489 64.2129 55.8069L46.0059 73.6049L50.5049 78.0029L73.2109 55.8069C76.0319 53.0489 77.7169 49.2849 77.4839 45.3999C77.4639 45.0749 77.4329 44.7479 77.3909 44.4179Z" fill="#BC4726"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M31.51 66.0034L27.51 78.0034L39.51 74.0034L31.51 66.0034Z" fill="#C0C0C0"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.51 74.0034C32.998 74.0034 32.487 73.8084 32.096 73.4174C31.315 72.6364 31.315 71.3704 32.096 70.5894L44.096 58.5894C44.876 57.8084 46.144 57.8084 46.924 58.5894C47.705 59.3704 47.705 60.6364 46.924 61.4174L34.924 73.4174C34.534 73.8084 34.022 74.0034 33.51 74.0034Z" fill="#C0C0C0"/>
<path d="M86.4922 44L90.5052 41" stroke="#AAAAAA" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
<path d="M88.5049 52.5H94.5099" stroke="#AAAAAA" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
<path d="M14.5176 44L10.5046 41" stroke="#AAAAAA" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
<path d="M12.505 52.5H6.5" stroke="#AAAAAA" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
<path d="M86.4922 61.5L90.5052 64.5" stroke="#AAAAAA" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
<path d="M14.5176 61.5L10.5046 64.5" stroke="#AAAAAA" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M27.9544 15.0818C26.3303 14.4357 24.6178 14.8261 23.4753 15.8672C22.995 14.398 21.6978 13.2137 19.9664 12.9746C18.0748 12.7131 16.2171 13.7652 15.5153 15.4882C15.4792 15.5773 15.4462 15.6669 15.4166 15.7565C15.0641 16.8282 15.2583 18.0079 15.8448 18.9894L20.5677 26.8894L28.5729 22.3469C29.5672 21.7824 30.318 20.8521 30.54 19.7459C30.5584 19.6534 30.574 19.5591 30.5865 19.4638C30.8259 17.6188 29.7289 15.7873 27.9544 15.0818Z" fill="#E2E2E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M77.945 75.9298C76.9297 76.1112 76.1926 76.8398 75.9437 77.7173C75.2457 77.1301 74.2269 76.94 73.2844 77.3588C72.2546 77.8163 71.6506 78.9218 71.8348 80.004C71.8444 80.0599 71.8558 80.1151 71.8688 80.1693C72.0255 80.8163 72.49 81.3473 73.0894 81.6569L77.9155 84.1482L80.5157 79.3799C80.8385 78.7875 80.9255 78.0875 80.6926 77.4638C80.673 77.4117 80.6515 77.3596 80.6282 77.3079C80.1741 76.3084 79.0542 75.7314 77.945 75.9298Z" fill="#E2E2E2"/>
</svg>
`;
  }
  function emailSvg() {
    return `<svg width="76" height="78" viewBox="0 0 76 78" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_273_32068)">
<path d="M55.0125 26.7115C55.3701 26.3897 55.6204 25.9249 55.6204 25.3886V0.71875L41.4263 16.2L55.0125 26.7115Z" fill="#F9BE1A"/>
<path d="M14.147 0.71875V25.3886C14.147 25.9249 14.3972 26.3897 14.7548 26.7115L28.3411 16.2L14.147 0.71875Z" fill="#F9BE1A"/>
<path d="M40.9621 16.7361C40.2828 17.487 39.3175 17.8803 38.3164 17.8803H31.4517C30.4506 17.8803 29.4853 17.4512 28.806 16.7361L28.3412 16.2356L14.7549 26.7471C15.0767 27.0331 15.47 27.2119 15.9347 27.2119H53.8333C54.2981 27.2119 54.6914 27.0331 55.0132 26.7471L41.4269 16.2356L40.9621 16.7361Z" fill="#F9BE1A"/>
<path d="M55.6209 0.71875L41.4268 16.2L40.962 16.7363C40.2827 17.4871 39.3174 17.8804 38.3163 17.8804H31.4516C30.4505 17.8804 29.4852 17.4513 28.8059 16.7363L28.3411 16.2357L14.147 0.71875H55.6209Z" fill="#F9BE1A"/>
</g>
<g clip-path="url(#clip1_273_32068)">
<path d="M60.3304 38.5762C60.7824 38.1695 61.0987 37.5819 61.0987 36.9039V5.71753L43.1553 25.2881L60.3304 38.5762Z" fill="#FFCC33"/>
<path d="M8.66943 5.71753V36.9039C8.66943 37.5819 8.98582 38.1695 9.43779 38.5762L26.6129 25.2881L8.66943 5.71753Z" fill="#FFCC33"/>
<path d="M42.5679 25.966C41.7091 26.9152 40.4888 27.4123 39.2233 27.4123H30.5453C29.2798 27.4123 28.0594 26.87 27.2007 25.966L26.6131 25.3333L9.43799 38.6214C9.84477 38.983 10.3419 39.2089 10.9295 39.2089H58.839C59.4266 39.2089 59.9238 38.983 60.3306 38.6214L43.1555 25.3333L42.5679 25.966Z" fill="#FFCC33"/>
<path d="M61.0987 5.71753L43.1553 25.2881L42.5677 25.9661C41.7089 26.9152 40.4886 27.4124 39.2231 27.4124H30.5451C29.2796 27.4124 28.0592 26.87 27.2005 25.9661L26.6129 25.3333L8.66943 5.71753H61.0987Z" fill="#FFCC33"/>
</g>
<g clip-path="url(#clip2_273_32068)">
<path d="M63.5124 47.6839C64.0209 47.2263 64.3769 46.5652 64.3769 45.8025V10.7161L44.1895 32.7341L63.5124 47.6839Z" fill="#FDD20A"/>
<path d="M5.39062 10.7161V45.8025C5.39062 46.5652 5.74657 47.2263 6.25507 47.6839L25.578 32.7341L5.39062 10.7161Z" fill="#FDD20A"/>
<path d="M43.5283 33.4968C42.5622 34.5647 41.1892 35.124 39.7654 35.124H30.0023C28.5785 35.124 27.2055 34.5138 26.2394 33.4968L25.5783 32.7849L6.25537 47.7348C6.71302 48.1416 7.27237 48.3958 7.93342 48.3958H61.8343C62.4954 48.3958 63.0547 48.1416 63.5124 47.7348L44.1894 32.7849L43.5283 33.4968Z" fill="#F5B608"/>
<path d="M64.3765 10.7161L44.1891 32.7341L43.528 33.4968C42.5619 34.5647 41.189 35.124 39.7652 35.124H30.002C28.5782 35.124 27.2052 34.5138 26.2391 33.4968L25.578 32.7849L5.39062 10.7161H64.3765Z" fill="#FFDE7A"/>
</g>
<rect x="13.0835" y="47.7449" width="43.9126" height="4.87918" fill="#8CABFF"/>
<path d="M59.4354 37.9863L52.1166 52.6239H17.9624L10.6436 37.9863H0.885254V64.8218C0.885254 67.5165 3.06974 69.701 5.76443 69.701H64.3145C67.0092 69.701 69.1937 67.5165 69.1937 64.8218V37.9863H59.4354Z" fill="#668BFF"/>
<path d="M10.6436 37.9864H5.76443V23.3489H3.32484C1.97749 23.3489 0.885254 24.4411 0.885254 25.7885V40.426C0.885254 41.7733 1.97749 42.8656 3.32484 42.8656H13.0832L10.6436 37.9864Z" fill="#8CABFF"/>
<path d="M59.4357 37.9864H64.3149V23.3489H66.7544C68.1018 23.3489 69.194 24.4411 69.194 25.7885V40.426C69.194 41.7733 68.1018 42.8656 66.7544 42.8656H56.9961L59.4357 37.9864Z" fill="#8CABFF"/>
<path d="M59.1032 54.5231C60.7374 51.5626 64.9926 51.5626 66.6268 54.5231L74.8089 69.3457C76.3897 72.2095 74.3182 75.7191 71.047 75.7191H54.6829C51.4118 75.7191 49.3403 72.2095 50.9211 69.3457L59.1032 54.5231Z" fill="#FDD20A"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M62.1235 58.5312C61.6767 58.5312 61.3209 58.9053 61.3433 59.3515L61.6558 65.6015C61.6765 66.0173 62.0197 66.3438 62.436 66.3438H63.2935C63.7098 66.3438 64.0529 66.0173 64.0737 65.6015L64.3862 59.3515C64.4085 58.9053 64.0528 58.5312 63.606 58.5312H62.1235ZM62.8647 71.0312C63.7277 71.0312 64.4272 70.3317 64.4272 69.4688C64.4272 68.6058 63.7277 67.9062 62.8647 67.9062C62.0018 67.9062 61.3022 68.6058 61.3022 69.4688C61.3022 70.3317 62.0018 71.0312 62.8647 71.0312Z" fill="black" fill-opacity="0.8"/>
<defs>
<clipPath id="clip0_273_32068">
<rect x="14.147" y="0.71875" width="41.4739" height="26.4932" rx="2.99924" fill="white"/>
</clipPath>
<clipPath id="clip1_273_32068">
<rect x="8.66943" y="5.71753" width="52.4293" height="33.4915" rx="2.99924" fill="white"/>
</clipPath>
<clipPath id="clip2_273_32068">
<rect x="5.39062" y="10.7161" width="58.9859" height="37.6798" rx="2.99924" fill="white"/>
</clipPath>
</defs>
</svg>
`;
  }

  // v2/screens/primary-screen.jsx
  function PrimaryScreen() {
    const status = usePrimaryStatus();
    return /* @__PURE__ */ y("div", { class: "site-info page" }, /* @__PURE__ */ y("div", { className: "page-inner" }, /* @__PURE__ */ y(SearchBar, null), /* @__PURE__ */ y(PrimaryScreenTopNav, null), status === "error" && /* @__PURE__ */ y(ErrorInner, null), status === "cta" && /* @__PURE__ */ y(CtaScreenInner, null), status === "ready" && /* @__PURE__ */ y(PrimaryScreenInner, null), /* @__PURE__ */ y(Footer, null), /* @__PURE__ */ y(Permissions, null)));
  }
  function Footer() {
    return /* @__PURE__ */ y("footer", { className: "footer" }, /* @__PURE__ */ y("div", { className: "padding-x" }, isBrowser() && /* @__PURE__ */ y(EmailProvider, null, /* @__PURE__ */ y(EmailBar, null))));
  }
  function PrimaryScreenInner() {
    return /* @__PURE__ */ y(k, null, /* @__PURE__ */ y("header", { class: "header" }, /* @__PURE__ */ y(ProtectionHeader2, null)), /* @__PURE__ */ y("div", { class: "header-spacer" }), /* @__PURE__ */ y("div", { class: "padding-x-double" }, /* @__PURE__ */ y(KeyInsights, null)), /* @__PURE__ */ y("div", { class: "padding-x" }, /* @__PURE__ */ y(MainNav, null)));
  }
  function PrimaryScreenTopNav() {
    const onClose = useClose();
    if (isAndroid())
      return /* @__PURE__ */ y(TopNav, { back: /* @__PURE__ */ y(Back, { onClick: onClose }) });
    if (isIOS())
      return /* @__PURE__ */ y(TopNav, { done: /* @__PURE__ */ y(Done, { onClick: onClose }) });
    return null;
  }
  function CtaScreenInner() {
    return /* @__PURE__ */ y("div", { class: "padding-x" }, /* @__PURE__ */ y(CtaScreen, null));
  }
  function ErrorInner() {
    const errorText = i18n.t("site:errorMessage.title");
    return /* @__PURE__ */ y("div", { className: "padding-x" }, /* @__PURE__ */ y("div", { className: "cta-screen" }, /* @__PURE__ */ y("p", { className: "note token-title-3 text--center" }, errorText)));
  }

  // v2/screens/breakage-form-screen.jsx
  var categories = () => {
    return {
      blocked: ns.report("blocked.title"),
      layout: ns.report("layout.title"),
      "empty-spaces": ns.report("emptySpaces.title"),
      paywall: ns.report("paywall.title"),
      videos: ns.report("videos.title"),
      comments: ns.report("comments.title"),
      login: ns.report("login.title"),
      shopping: ns.report("shopping.title"),
      other: ns.report("other.title")
    };
  };
  function BreakageFormScreen({ includeToggle }) {
    const data = useData();
    const onToggle = useToggle();
    const onClose = useClose();
    const nav = useNav();
    const canPop = nav.canPop();
    const sendReport = useSendReport();
    const [state, setState] = h2(
      /** @type {"idle" | "sent"} */
      "idle"
    );
    const icon = largeHeroIcon({
      status: "breakage-form"
    });
    let headerText = includeToggle ? ns.report("selectTheOptionDesc.title") : ns.report("selectTheOptionDescV2.title");
    function submit(e3) {
      e3.preventDefault();
      const values = Object.fromEntries(new FormData(e3.target));
      sendReport({
        category: String(values.category || ""),
        description: String(values.description || "")
      });
      setState("sent");
    }
    let topNav2 = /* @__PURE__ */ y(SecondaryTopNav, null);
    if (!canPop) {
      topNav2 = platformSwitch({
        ios: () => /* @__PURE__ */ y(TopNav, { done: /* @__PURE__ */ y(Done, { onClick: onClose }) }),
        default: () => /* @__PURE__ */ y(TopNav, { done: /* @__PURE__ */ y(Close, { onClick: onClose }) })
      });
    }
    return /* @__PURE__ */ y("div", { className: "breakage-form page-inner" }, topNav2, /* @__PURE__ */ y("div", { className: "breakage-form__inner", "data-state": state }, includeToggle && /* @__PURE__ */ y("div", { class: "header header--breakage" }, /* @__PURE__ */ y(
      ProtectionHeader,
      {
        model: data,
        initialState: "site-not-working",
        toggle: onToggle,
        "data-testid": "breakage-form-protection-header"
      }
    )), /* @__PURE__ */ y("div", { className: "key-insight key-insight--breakage padding-x-double" }, /* @__PURE__ */ y(DomNode, null, icon), /* @__PURE__ */ y("div", { className: "breakage-form__advise" }, /* @__PURE__ */ y("p", { className: "token-title-3" }, headerText)), /* @__PURE__ */ y("div", { className: "thanks" }, /* @__PURE__ */ y("p", { className: "thanks__primary" }, ns.report("thankYou.title")), /* @__PURE__ */ y("p", { className: "thanks__secondary" }, ns.report("yourReportWillHelpDesc.title")))), /* @__PURE__ */ y("div", { className: "breakage-form__content padding-x-double" }, /* @__PURE__ */ y(
      FormElement,
      {
        onSubmit: submit,
        before: /* @__PURE__ */ y("div", { className: "form__select breakage-form__input--dropdown" }, /* @__PURE__ */ y("select", { name: "category" }, /* @__PURE__ */ y("option", { value: "" }, ns.report("pickYourIssueFromTheList.title")), "$", Object.entries(categories()).map(([key, value]) => {
          return /* @__PURE__ */ y("option", { value: key }, value);
        })))
      }
    )), /* @__PURE__ */ y("div", { className: "breakage-form__footer padding-x-double token-breakage-form-body" }, ns.report("reportsAreAnonymousDesc.title"))));
  }
  function FormElement({ onSubmit, before, after, placeholder }) {
    let bullet = "\n \u2022 ";
    placeholder = placeholder || ns.report("tellUsMoreDesc.title", { bullet });
    return /* @__PURE__ */ y("form", { className: "breakage-form__element", onSubmit }, /* @__PURE__ */ y("div", { className: "form__group" }, before, /* @__PURE__ */ y("textarea", { className: "form__textarea", placeholder, maxLength: 2500, name: "description" }), after), /* @__PURE__ */ y("button", { className: "form__submit token-label-em", type: "submit" }, ns.report("sendReport.title")));
  }

  // shared/js/ui/templates/page-trackers.js
  var import_nanohtml11 = __toESM(require_browser());

  // shared/js/ui/templates/shared/platform-limitations.js
  var import_nanohtml10 = __toESM(require_browser());
  function platformLimitations() {
    return import_nanohtml10.default`<p class="platform-limitations border--top--inner">${ns.site("trackerLimitationsNote.title")}</p>`;
  }

  // shared/js/ui/templates/page-trackers.js
  function trackerListWrapper(name, heading, companiesList, bordered) {
    return import_nanohtml11.default`
        <ol class="default-list site-info__trackers__company-list ${bordered ? "border--top" : ""}" aria-label="List of tracker networks">
            ${heading ? import_nanohtml11.default`<li class="section-list-header" data-section-name=${name}>${heading}</li>` : import_nanohtml11.default``} ${companiesList}
        </ol>
    `;
  }
  function renderCompany(company) {
    if (company.displayName && company.displayName === "unknown") {
      company.displayName = `(${i18n.t("site:trackerNetworkUnknown.title")})`;
    }
    const slug = company.normalizedName;
    const title = company.name || company.displayName;
    const titleClasses = [
      "site-info__tracker__icon",
      "site-info__tracker__icon--company",
      slug[0].toUpperCase(),
      "color-" + getColorId(slug),
      slug
    ];
    const listLabel = i18n.t("site:trackerDomainsForCompany.title", {
      companyName: company.displayName
    });
    return import_nanohtml11.default`<li class="site-info__trackers__company-list-item">
        <p title=${title} class="site-info__domain block token-title-3-em">
            <span class=${titleClasses.join(" ")}></span>
            ${company.displayName}
        </p>
        <ol class="default-list site-info__trackers__company-list__url-list" aria-label=${listLabel}>
            ${Object.keys(company.urls).map((urlHostname) => {
      const url = company.urls[urlHostname];
      const matched = displayCategories[url.category];
      return import_nanohtml11.default` <li class="url-list-item">
                    <p class="url" title=${urlHostname}>${urlHostname}</p>
                    ${matched ? import_nanohtml11.default`<div class="category">${i18n.t(matched)}</div>` : ""}
                </li>`;
    })}
        </ol>
    </li>`;
  }
  function renderSections(sections) {
    const output2 = sections.filter((section) => section.companies.length > 0).map((section) => {
      const companiesList = section.companies.map((company) => renderCompany(company));
      const sectionHeading = section.heading();
      return trackerListWrapper(section.name, sectionHeading, companiesList, section.bordered);
    });
    return output2;
  }
  function sectionsFromSiteTrackers(site) {
    const { blocked } = site.tab.requestDetails;
    const sections = renderSections([
      {
        name: "blocked",
        heading: () => null,
        companies: blocked.sortedByPrevalence(),
        bordered: true
      }
    ]);
    return sections;
  }

  // v2/screens/trackers-screen.jsx
  function TrackersScreen() {
    const data = useData();
    const ref = useRippleChildren();
    return /* @__PURE__ */ y("div", { className: "site-info card page-inner", "data-page": "trackers" }, /* @__PURE__ */ y(SecondaryTopNav, null), /* @__PURE__ */ y("div", { className: "padding-x-double", ref }, /* @__PURE__ */ y(DomNode, { key: data.count }, heroFromTabTrackers(data.tab.requestDetails, data.protectionsEnabled))), /* @__PURE__ */ y("div", { className: "padding-x-double", "aria-label": "List of Tracker Companies" }, sectionsFromSiteTrackers(data).map((el, index) => {
      return /* @__PURE__ */ y(DomNode, { key: String(data.count) + String(index) }, el);
    })), data.tab.platformLimitations ? /* @__PURE__ */ y("div", { class: "padding-x-double" }, /* @__PURE__ */ y(DomNode, { key: data.count }, platformLimitations())) : /* @__PURE__ */ y("div", null));
  }

  // shared/js/ui/templates/page-non-trackers.js
  var import_nanohtml12 = __toESM(require_browser());
  function sectionsFromSiteNonTracker(site) {
    const requestDetails = site.tab.requestDetails;
    const onlyAllowedNonTrackers = requestDetails.matches(site.protectionsEnabled, [
      states.protectionsOn_allowedNonTrackers,
      states.protectionsOff_allowedNonTrackers,
      states.protectionsOn_blocked_allowedNonTrackers
    ]);
    if (!site.protectionsEnabled) {
      return renderSections([
        {
          name: "protectionsDisabled",
          heading: () => ns.site("sectionHeadingProtectionsDisabled.title"),
          companies: requestDetails.all.sortedByPrevalence(),
          bordered: false
        }
      ]);
    }
    return renderSections([
      {
        name: "adAttribution",
        heading: () => import_nanohtml12.default`
                <div>
                    <p>${ns.site("sectionHeadingAdAttribution.title", { domain: site.tab.domain })}</p>
                    ${adAttributionLink()}
                </div>
            `,
        companies: requestDetails.allowed.adClickAttribution.sortedByPrevalence()
      },
      {
        name: "ignored (rule exceptions)",
        heading: () => ns.site("sectionHeadingIgnore.title"),
        companies: requestDetails.allowed.ruleException.sortedByPrevalence()
      },
      {
        name: "firstParty",
        heading: () => ns.site("sectionHeadingFirstParty.title", { domain: site.tab.domain }),
        companies: requestDetails.allowed.ownedByFirstParty.sortedByPrevalence()
      },
      {
        name: "thirdParty",
        heading: () => {
          if (onlyAllowedNonTrackers) {
            return null;
          }
          return ns.site("sectionHeadingThirdParty.title");
        },
        companies: requestDetails.allowed.otherThirdPartyRequest.sortedByPrevalence(),
        bordered: onlyAllowedNonTrackers
      }
    ]);
  }

  // v2/screens/non-trackers-screen.jsx
  function NonTrackersScreen() {
    const data = useData();
    const ref = useRippleChildren();
    return /* @__PURE__ */ y("div", { className: "site-info card page-inner", "data-page": "non-trackers" }, /* @__PURE__ */ y(SecondaryTopNav, null), /* @__PURE__ */ y("div", { className: "padding-x-double", ref }, /* @__PURE__ */ y(DomNode, { key: data.count }, heroFromTabNonTrackers(data.tab.requestDetails, data.protectionsEnabled))), /* @__PURE__ */ y("div", { className: "padding-x-double", "aria-label": "List of Tracker Companies" }, sectionsFromSiteNonTracker(data).map((el, index) => {
      return /* @__PURE__ */ y(DomNode, { key: String(data.count) + String(index) }, el);
    })), data.tab.platformLimitations && /* @__PURE__ */ y("div", { class: "padding-x-double" }, /* @__PURE__ */ y(DomNode, { key: data.count }, platformLimitations())));
  }

  // v2/screens/consent-managed-screen.jsx
  function ConsentManagedScreen({ cosmetic }) {
    const data = useData();
    const fetcher = useFetcher();
    const summary = cosmetic ? ns.site("cookiesHiddenSummary.title") : ns.site("cookiesMinimizedSummary.title");
    const icon = largeHeroIcon({
      status: cosmetic ? "cookies-hidden" : "cookies-managed"
    });
    const hero = heroTemplate({
      icon,
      summary,
      suffix: "none"
    });
    function disable() {
      const msg = new OpenSettingsMessages({
        target: "cpm"
      });
      fetcher(msg).catch(console.error);
    }
    return /* @__PURE__ */ y("div", { className: "card page-inner", "data-page": "cookie-prompt" }, /* @__PURE__ */ y(SecondaryTopNav, null), /* @__PURE__ */ y("div", { className: "padding-x-double" }, /* @__PURE__ */ y(DomNode, { key: data.count }, hero)), /* @__PURE__ */ y("div", { className: "padding-x-double" }, /* @__PURE__ */ y("div", { className: "padding-y border--top--inner text--center" }, /* @__PURE__ */ y(DomNode, { key: data.count }, disableInSettingsLink(disable)))));
  }

  // shared/js/ui/components/toggle-report/toggle-report-provider.jsx
  var ToggleReportContext = G({
    value: (
      /** @type {import('../../../../../schema/__generated__/schema.types').ToggleReportScreen} */
      {}
    ),
    /** @type {() => void} */
    send: () => {
      throw new Error("todo implement send");
    },
    /** @type {() => void} */
    reject: () => {
      throw new Error("todo implement reject");
    },
    /** @type {() => void} */
    didShowWhatIsSent: () => {
      throw new Error("todo implement didShowWhatIsSent");
    },
    /** @type {() => void} */
    didClickSuccessScreen: () => {
      throw new Error("todo implement didClickSuccessScreen");
    }
  });
  function ToggleReportProvider({ children, model, screen }) {
    const initial = { status: "pending" };
    const [state, dispatch] = s2((state2, action) => action, initial);
    p2(() => {
      const msg = new FetchToggleReportOptions();
      model.fetch(msg)?.then((data) => {
        dispatch({ status: "ready", value: data });
      }).catch((e3) => {
        dispatch({ status: "error", error: e3.toString() });
      });
    }, [model]);
    function send() {
      model.fetch(new SendToggleBreakageReport());
    }
    function reject() {
      model.fetch(new RejectToggleBreakageReport());
    }
    function didShowWhatIsSent() {
      model.fetch(new SeeWhatIsSent());
    }
    function didClickSuccessScreen() {
      model.fetch(new CloseMessage({ eventOrigin: { screen } }));
    }
    if (state.status === "ready") {
      return /* @__PURE__ */ y(
        ToggleReportContext.Provider,
        {
          value: {
            value: state.value,
            send,
            reject,
            didShowWhatIsSent,
            didClickSuccessScreen
          }
        },
        children
      );
    }
    if (state.status === "error")
      return /* @__PURE__ */ y("div", null, /* @__PURE__ */ y("p", null, "Something went wrong"), /* @__PURE__ */ y("pre", null, /* @__PURE__ */ y("code", null, state.error)));
    return null;
  }

  // shared/js/ui/components/button.jsx
  function Button({ children, btnSize, variant = "macos-standard", ...rest }) {
    return /* @__PURE__ */ y("button", { type: "button", className: "button", ...rest, "data-variant": variant, "data-size": btnSize }, children);
  }
  function ButtonBar({ children, layout = "horizontal", ...rest }) {
    return /* @__PURE__ */ y("div", { className: "button-bar", "data-layout": layout, ...rest }, children);
  }

  // shared/js/ui/components/stack.jsx
  function Stack({ children, gap, ...rest }) {
    return /* @__PURE__ */ y("div", { ...rest, className: "stack", style: { gap } }, children);
  }
  function Scrollable({ children, ...rest }) {
    return /* @__PURE__ */ y("div", { className: "scrollable fade-in", ...rest }, children);
  }

  // shared/js/ui/components/toggle-report/use-toggle-report-state.js
  function useToggleReportState() {
    const { send, reject, didShowWhatIsSent } = q2(ToggleReportContext);
    return s2(
      (state, action) => {
        switch (action) {
          case "toggle-ios": {
            didShowWhatIsSent();
            return {
              ...state,
              value: (
                /** @type {const} */
                "animating"
              )
            };
          }
          case "animation-complete": {
            return {
              ...state,
              value: (
                /** @type {const} */
                "showing"
              )
            };
          }
          case "toggle": {
            const next = state.value === "hiding" ? (
              /** @type {const} */
              "showing"
            ) : (
              /** @type {const} */
              "hiding"
            );
            if (next === "showing") {
              didShowWhatIsSent();
            }
            return {
              ...state,
              value: next
            };
          }
          case "send": {
            send();
            return {
              ...state,
              value: (
                /** @type {const} */
                "sent"
              )
            };
          }
          case "reject": {
            reject();
            return state;
          }
        }
        return state;
      },
      { value: (
        /** @type {'hiding' | 'showing' | 'sent' | 'rejected' | 'animating'} */
        "hiding"
      ) }
    );
  }

  // shared/js/ui/components/toggle-report/use-ios-animation.js
  function useIosAnimation(state, dispatch) {
    p2(() => {
      if (platform.name !== "ios")
        return;
      if (state.value === "animating") {
        const child = (
          /** @type {HTMLDivElement | null} */
          document.querySelector('[data-toggle-report="child"]')
        );
        if (!child)
          return;
        child.addEventListener("transitionend", () => {
          dispatch("animation-complete");
        });
        child.style.transform = "translateY(0)";
      }
    }, [state.value]);
    p2(() => {
      if (platform.name !== "ios")
        return;
      const child = (
        /** @type {HTMLDivElement | null} */
        document.querySelector('[data-toggle-report="child"]')
      );
      const parent = (
        /** @type {HTMLDivElement | null} */
        document.querySelector('[data-toggle-report="parent"]')
      );
      if (!child || !parent)
        return;
      const rs = new ResizeObserver((r3) => {
        for (let resizeObserverEntry of r3) {
          if (resizeObserverEntry.contentRect.height === 0)
            continue;
          const childSize = child.clientHeight;
          const parentHeight = resizeObserverEntry.contentRect.height - 56;
          const offset2 = (parentHeight - childSize) / 2;
          child.style.transform = "translateY(" + offset2 + "px)";
          child.dataset.ready = "true";
          setTimeout(() => {
            child.style.transition = "all .3s";
          }, 0);
        }
      });
      rs.observe(parent);
      return () => {
        rs.disconnect();
      };
    }, []);
  }

  // shared/data/text.js
  function namedString(item) {
    switch (item.id) {
      case "openerContext":
        return ns.toggleReport("dynamic_openerContext.title");
      case "userRefreshCount":
        return ns.toggleReport("dynamic_userRefreshCount.title");
      case "jsPerformance":
        return ns.toggleReport("dynamic_jsPerformance.title");
      case "wvVersion":
        return ns.toggleReport("dynamic_wvVersion.title");
      case "requests":
        return ns.toggleReport("dynamic_requests.title");
      case "features":
        return ns.toggleReport("dynamic_features.title");
      case "appVersion":
        return ns.toggleReport("dynamic_appVersion.title");
      case "atb":
        return ns.toggleReport("dynamic_atb.title");
      case "errorDescriptions":
        return ns.toggleReport("dynamic_errorDescriptions.title");
      case "extensionVersion":
        return ns.toggleReport("dynamic_extensionVersion.title");
      case "httpErrorCodes":
        return ns.toggleReport("dynamic_httpErrorCodes.title");
      case "lastSentDay":
        return ns.toggleReport("dynamic_lastSentDay.title");
      case "device":
        return ns.toggleReport("dynamic_device.title");
      case "os":
        return ns.toggleReport("dynamic_os.title");
      case "reportFlow":
        return ns.toggleReport("dynamic_reportFlow.title");
      case "siteUrl":
        return ns.toggleReport("dynamic_siteUrl.title");
      case "listVersions":
        return ns.toggleReport("dynamic_listVersions.title");
      case "didOpenReportInfo":
        return ns.toggleReport("dynamic_didOpenReportInfo.title");
      case "toggleReportCounter":
        return ns.toggleReport("dynamic_toggleReportCounter.title");
    }
  }

  // shared/js/ui/components/toggle-report/toggle-report-data-list.jsx
  function ToggleReportDataList({ rows }) {
    return /* @__PURE__ */ y(Stack, { gap: "4px" }, /* @__PURE__ */ y("p", { className: "token-bold" }, ns.toggleReport("reportsNoInfoSent.title")), /* @__PURE__ */ y("ul", { className: "data-list" }, rows.map((item) => {
      const string = namedString(item);
      const additional = item.id === "siteUrl" ? "[" + item.additional?.url + "]" : null;
      return /* @__PURE__ */ y("li", { className: "data-list__item token-breakage-form-body" }, /* @__PURE__ */ y("span", { dangerouslySetInnerHTML: { __html: `<!-- ${item.id} -->` } }), string, additional && /* @__PURE__ */ y("strong", { className: "block" }, additional));
    })));
  }

  // shared/js/ui/components/toggle-report/toggle-report-sent.jsx
  function ToggleReportSent({ onClick }) {
    return /* @__PURE__ */ y("div", { onClick }, /* @__PURE__ */ y("div", { className: "medium-icon-container hero-icon--toggle-report-sent" }), /* @__PURE__ */ y(Stack, { gap: "8px" }, /* @__PURE__ */ y("h1", { className: "token-title-2-em text--center" }, ns.report("thankYou.title")), /* @__PURE__ */ y("h2", { className: "token-title-3 text--center" }, ns.toggleReport("yourReportWillHelpToggleReport.title"))));
  }

  // shared/js/ui/components/toggle-report/toggle-report-wrapper.jsx
  function ToggleReportWrapper({ children, state }) {
    switch (platform.name) {
      case "android":
      case "ios":
        return /* @__PURE__ */ y("div", { className: "padding-x-xl vertically-centered", "data-state": state, "data-toggle-report": "child" }, children);
      case "windows":
      case "browser":
      case "macos":
        return /* @__PURE__ */ y("div", { className: "padding-x-double" }, children, state === "sent" ? /* @__PURE__ */ y("div", { style: "height: 40px" }) : /* @__PURE__ */ y("div", { style: "height: 32px" }));
      default:
        return null;
    }
  }

  // shared/js/ui/components/toggle-report/toggle-report-title.jsx
  function ToggleReportTitle({ children }) {
    switch (platform.name) {
      case "android":
      case "ios":
        return /* @__PURE__ */ y("h1", { className: "token-ios-title-3 text--center" }, children);
      case "windows":
      case "browser":
      case "macos":
        return /* @__PURE__ */ y("h1", { className: "token-title-2-em text--center" }, children);
      default:
        return null;
    }
  }

  // shared/js/ui/components/toggle-report.jsx
  function ToggleReport() {
    const buttonVariant = platform.name === "ios" ? "ios-secondary" : "macos-standard";
    const buttonLayout = platform.name === "ios" ? "vertical" : "horizontal";
    const buttonSize = platform.name === "ios" ? "big" : "small";
    const innerGap = platform.name === "ios" ? "24px" : "16px";
    const { value, didClickSuccessScreen } = q2(ToggleReportContext);
    const [state, dispatch] = useToggleReportState();
    useIosAnimation(state, dispatch);
    if (state.value === "sent" && platform.name === "macos") {
      return /* @__PURE__ */ y(ToggleReportWrapper, { state: state.value }, /* @__PURE__ */ y(ToggleReportSent, { onClick: didClickSuccessScreen }));
    }
    return /* @__PURE__ */ y(ToggleReportWrapper, { state: state.value }, /* @__PURE__ */ y(Stack, { gap: "40px" }, /* @__PURE__ */ y(Stack, { gap: "24px" }, /* @__PURE__ */ y(Stack, { gap: innerGap }, /* @__PURE__ */ y("div", { className: "medium-icon-container hero-icon--toggle-report" }), /* @__PURE__ */ y(ToggleReportTitle, null, ns.toggleReport("siteNotWorkingTitle.title")), /* @__PURE__ */ y("div", null, /* @__PURE__ */ y("h2", { className: "token-title-3 text--center" }, ns.toggleReport("siteNotWorkingSubTitle.title")), platform.name === "macos" && /* @__PURE__ */ y("div", null, /* @__PURE__ */ y("p", { className: "text--center token-title-3" }, /* @__PURE__ */ y(PlainTextLink, { onClick: () => dispatch("toggle") }, state.value === "hiding" && ns.toggleReport("siteNotWorkingInfoReveal.title"), state.value === "showing" && ns.toggleReport("siteNotWorkingInfoHide.title")))))), platform.name === "macos" && state.value === "showing" && /* @__PURE__ */ y(Scrollable, null, /* @__PURE__ */ y(ToggleReportDataList, { rows: value.data })), /* @__PURE__ */ y(ButtonBar, { layout: buttonLayout }, /* @__PURE__ */ y(Button, { variant: buttonVariant, btnSize: buttonSize, onClick: () => dispatch("reject") }, ns.toggleReport("dontSendReport.title")), /* @__PURE__ */ y(Button, { variant: buttonVariant, btnSize: buttonSize, onClick: () => dispatch("send") }, ns.report("sendReport.title"))), platform.name === "ios" && state.value !== "showing" && /* @__PURE__ */ y("p", { className: "text--center token-title-3" }, /* @__PURE__ */ y(PlainTextLink, { onClick: () => dispatch("toggle-ios"), className: "token-bold" }, ns.toggleReport("siteNotWorkingInfoReveal.title")))), platform.name === "ios" && state.value === "showing" && /* @__PURE__ */ y("div", { className: "ios-separator" }, /* @__PURE__ */ y(ToggleReportDataList, { rows: value.data }))));
  }

  // v2/screens/toggle-report-screen.jsx
  function ToggleReportScreen() {
    const fetcher = useFetcher();
    const features = useFeatures();
    const onClose = useClose();
    p2(() => {
      document.body.dataset.screen = "toggleReport";
      return () => {
        document.body.dataset.screen = "";
      };
    }, []);
    const done = platformSwitch({
      ios: () => /* @__PURE__ */ y(Done, { onClick: onClose }),
      default: () => /* @__PURE__ */ y(Close, { onClick: onClose })
    });
    return /* @__PURE__ */ y("div", { "data-toggle-report": "parent", class: "toggle-report page-inner", "data-opener": features.opener }, features.opener === "menu" ? /* @__PURE__ */ y(TopNav, { done }) : /* @__PURE__ */ y(TopNav, null), /* @__PURE__ */ y("div", { "data-testid": "toggle-report" }, /* @__PURE__ */ y(ToggleReportProvider, { model: { fetch: fetcher }, screen: features.initialScreen }, /* @__PURE__ */ y(ToggleReport, null))));
  }

  // v2/components/nav.jsx
  function Nav({ children }) {
    return /* @__PURE__ */ y("ul", { className: "default-list main-nav token-body-em" }, children);
  }
  function NavItem({ children, label, onClick }) {
    return /* @__PURE__ */ y("li", { className: "main-nav__row" }, /* @__PURE__ */ y(
      "a",
      {
        href: "javascript:void(0)",
        role: "button",
        draggable: false,
        "aria-label": typeof children === "string" ? children : label,
        className: "main-nav__item main-nav__item--link link-action link-action--dark",
        onClick
      },
      /* @__PURE__ */ y("span", { className: "main-nav__text" }, children),
      /* @__PURE__ */ y("span", { className: "main-nav__chev" })
    ));
  }

  // v2/screens/choice-problem.jsx
  function CategoryTypeSelection() {
    const description = ns.report("selectTheCategoryType.title");
    const { push } = useNav();
    const send = useTelemetry();
    const { tab } = useData();
    const showNativeFeedback = useShowNativeFeedback();
    return /* @__PURE__ */ y("div", { className: "site-info page-inner card", "data-page": "choice-problem" }, /* @__PURE__ */ y(NavWrapper, null), /* @__PURE__ */ y("div", { className: "padding-x-double" }, /* @__PURE__ */ y(KeyInsightsMain, { title: tab.domain }, description)), /* @__PURE__ */ y("div", { className: "padding-x" }, /* @__PURE__ */ y(Nav, null, /* @__PURE__ */ y(
      NavItem,
      {
        onClick: () => {
          send({ name: "categoryTypeSelected", value: "notWorking" });
          push("categorySelection");
        }
      },
      ns.report("categoryType1.title")
    ), /* @__PURE__ */ y(
      NavItem,
      {
        onClick: () => {
          send({ name: "categoryTypeSelected", value: "dislike" });
          push("choiceBreakageForm", { category: "dislike" });
        }
      },
      ns.report("categoryType2.title")
    ), /* @__PURE__ */ y(
      NavItem,
      {
        onClick: () => {
          send({ name: "categoryTypeSelected", value: "general" });
          showNativeFeedback();
        }
      },
      ns.report("categoryType3.title")
    ))));
  }
  function CategorySelection() {
    const description = ns.report("selectTheCategory.title");
    const { push } = useNav();
    const send = useTelemetry();
    const { protectionsEnabled, tab } = useData();
    const text = tab.domain;
    const { breakageScreen, initialScreen } = useFeatures();
    const showToggle = protectionsEnabled && (breakageScreen === "categoryTypeSelection" || initialScreen === "categoryTypeSelection");
    const v2Categories = {
      ...categories(),
      login: ns.report("loginV2.title")
    };
    return /* @__PURE__ */ y("div", { className: "site-info page-inner card", "data-page": "choice-category" }, /* @__PURE__ */ y(NavWrapper, null), /* @__PURE__ */ y("div", { className: "padding-x-double" }, /* @__PURE__ */ y(KeyInsightsMain, { title: text }, description)), /* @__PURE__ */ y("div", { className: "padding-x" }, /* @__PURE__ */ y(Nav, null, Object.entries(v2Categories).map(([value, title]) => {
      return /* @__PURE__ */ y(
        NavItem,
        {
          key: value,
          onClick: () => {
            send({ name: "categorySelected", value: (
              /** @type {any} */
              value
            ) });
            if (showToggle) {
              push("choiceToggle", { category: value });
            } else {
              push("choiceBreakageForm", { category: value });
            }
          }
        },
        title
      );
    }))));
  }
  function ChoiceToggleScreen() {
    const description = ns.report("tryTurningProtectionsOff.title");
    const { push } = useNav();
    const data = useData();
    const text = data.tab.domain;
    const onToggle = useToggle();
    const send = useTelemetry();
    return /* @__PURE__ */ y("div", { className: "site-info page-inner card", "data-page": "choice-category" }, /* @__PURE__ */ y(NavWrapper, null), /* @__PURE__ */ y("div", { className: "padding-x-double" }, /* @__PURE__ */ y(KeyInsightsMain, { title: text, icon: "switch-shield" }, description)), /* @__PURE__ */ y("div", { className: "padding-x" }, /* @__PURE__ */ y("div", { class: "card-list--bordered" }, /* @__PURE__ */ y("div", { className: "protection-toggle" }, /* @__PURE__ */ y("div", { className: "protection-toggle__row" }, /* @__PURE__ */ y(ProtectionToggle, { model: data, toggle: onToggle })))), /* @__PURE__ */ y("div", { class: "text--center" }, /* @__PURE__ */ y(
      TextLink,
      {
        onClick: () => {
          push("choiceBreakageForm");
          send({ name: "toggleSkipped" });
        }
      },
      ns.report("skipThisStep.title")
    ))));
  }
  var validCategories = () => {
    return {
      ...categories(),
      dislike: ns.report("dislike.title")
    };
  };
  function ChoiceBreakageForm() {
    const { tab } = useData();
    const sendReport = useSendReport();
    const nav = useNav();
    const showAlert = useShowAlert();
    const categories2 = validCategories();
    let category = nav.params.get("category");
    if (!category || !Object.hasOwnProperty.call(categories2, category)) {
      category = "other";
    }
    const description = categories2[category];
    const placeholder = category === "other" ? ns.report("otherRequired.title") : ns.report("otherOptional.title");
    function submit(e3) {
      e3.preventDefault();
      const values = Object.fromEntries(new FormData(e3.target));
      const desc = String(values.description).trim();
      if (category === "other" && desc.length === 0) {
        showAlert();
      } else {
        sendReport({
          category,
          description: desc
        });
      }
    }
    return /* @__PURE__ */ y("div", { className: "site-info page-inner card", "data-page": "choice-category" }, /* @__PURE__ */ y(NavWrapper, null), /* @__PURE__ */ y("div", { className: "padding-x-third" }, /* @__PURE__ */ y(KeyInsightsMain, { title: tab.domain }, description)), /* @__PURE__ */ y("div", { className: "padding-x-third" }, /* @__PURE__ */ y(
      FormElement,
      {
        placeholder,
        after: /* @__PURE__ */ y("ul", { class: "padding-x" }, /* @__PURE__ */ y("li", null, ns.report("suggestionWhatHappened.title")), /* @__PURE__ */ y("li", null, ns.report("suggestionWhatHappened2.title")), /* @__PURE__ */ y("li", null, ns.report("suggestionWhatHappened3.title"))),
        onSubmit: submit
      }
    )));
  }
  function NavWrapper() {
    return /* @__PURE__ */ y(SecondaryTopNavAlt, null, /* @__PURE__ */ y(Title, null, ns.report("reportTitle.title")));
  }

  // v2/navigation.jsx
  var availableScreens = {
    primaryScreen: { kind: "root", component: () => /* @__PURE__ */ y(PrimaryScreen, null) },
    // screens that would load immediately
    breakageForm: { kind: "subview", component: () => /* @__PURE__ */ y(BreakageFormScreen, { includeToggle: true }) },
    promptBreakageForm: { kind: "subview", component: () => /* @__PURE__ */ y(BreakageFormScreen, { includeToggle: false }) },
    toggleReport: { kind: "subview", component: () => /* @__PURE__ */ y(ToggleReportScreen, null) },
    //
    categoryTypeSelection: { kind: "subview", component: () => /* @__PURE__ */ y(CategoryTypeSelection, null) },
    categorySelection: { kind: "subview", component: () => /* @__PURE__ */ y(CategorySelection, null) },
    choiceToggle: { kind: "subview", component: () => /* @__PURE__ */ y(ChoiceToggleScreen, null) },
    choiceBreakageForm: { kind: "subview", component: () => /* @__PURE__ */ y(ChoiceBreakageForm, null) },
    connection: { kind: "subview", component: () => /* @__PURE__ */ y(ConnectionScreen, null) },
    trackers: { kind: "subview", component: () => /* @__PURE__ */ y(TrackersScreen, null) },
    nonTrackers: { kind: "subview", component: () => /* @__PURE__ */ y(NonTrackersScreen, null) },
    consentManaged: { kind: "subview", component: () => /* @__PURE__ */ y(ConsentManagedScreen, { cosmetic: false }) },
    cookieHidden: { kind: "subview", component: () => /* @__PURE__ */ y(ConsentManagedScreen, { cosmetic: true }) }
  };
  var NavContext = G({
    /** @type {(name: ScreenName, params?: Record<string, string>) => void} */
    push() {
      throw new Error("not implemented");
    },
    /** @type {() => void} */
    pop() {
      throw new Error("not implemented");
    },
    /** @type {(stack: ScreenName[]) => void} */
    goto(stack) {
      throw new Error("not implemented " + stack);
    },
    params: new URLSearchParams(""),
    /** @type {() => boolean} */
    canPop: () => false,
    /** @type {(screen: import('../schema/__generated__/schema.types').EventOrigin['screen']) => boolean} */
    canPopFrom: (screen) => false,
    /** @type {() => ScreenName} */
    screen: () => {
      throw new Error("screen() not implemented");
    }
  });
  var ScreenContext = G({
    /** @type {import('../schema/__generated__/schema.types').EventOrigin['screen']} */
    screen: (
      /** @type {const} */
      "primaryScreen"
    )
  });
  function useNav() {
    return q2(NavContext);
  }
  function useCanPop() {
    const { screen } = q2(ScreenContext);
    const { canPopFrom } = useNav();
    return canPopFrom(screen);
  }
  function navReducer(state, event) {
    console.log("\u{1F4E9}", event, state);
    switch (state.state) {
      case "transitioning": {
        switch (event.type) {
          case "end": {
            return {
              ...state,
              commit: [],
              state: (
                /** @type {const} */
                "settled"
              )
            };
          }
        }
        return state;
      }
      case "initial":
      case "settled": {
        switch (event.type) {
          case "goto": {
            if (!event.opts.animate) {
              return {
                ...state,
                stack: event.stack,
                state: (
                  /** @type {const} */
                  "settled"
                )
              };
            }
            return {
              ...state,
              stack: event.stack,
              state: (
                /** @type {const} */
                "transitioning"
              )
            };
          }
          case "push": {
            const nextParams = new URLSearchParams(state.params);
            for (let [key, value] of Object.entries(event.params)) {
              nextParams.set(key, value);
            }
            if (!event.opts.animate) {
              return {
                ...state,
                params: nextParams,
                stack: state.stack.concat(event.name),
                state: (
                  /** @type {const} */
                  "settled"
                )
              };
            }
            return {
              ...state,
              params: nextParams,
              stack: state.stack.concat(event.name),
              state: (
                /** @type {const} */
                "transitioning"
              )
            };
          }
          case "pop": {
            if (state.stack.length < 2) {
              console.warn("ignoring a `pop` event");
              return state;
            }
            if (!event.opts.animate) {
              const next = state.stack.slice(0, -1);
              return {
                ...state,
                commit: next,
                stack: next,
                state: (
                  /** @type {const} */
                  "settled"
                )
              };
            }
            return {
              ...state,
              commit: state.stack,
              stack: state.stack.slice(0, -1),
              state: (
                /** @type {const} */
                "transitioning"
              )
            };
          }
          default: {
            console.warn("ignoring", event, "state", state);
            return state;
          }
        }
      }
      default:
        throw new Error("unreachable");
    }
  }
  function Navigation(props) {
    const [state, dispatch] = s2(navReducer, {
      stack: props.stack,
      state: "initial",
      commit: [],
      params: props.params
    });
    const parentRef = _(null);
    p2(() => {
      const curr = parentRef.current;
      if (!curr)
        return;
      const handler = (e3) => {
        if (e3.target !== parentRef.current)
          return;
        dispatch({ type: "end" });
      };
      curr.addEventListener("transitionend", handler);
      return () => {
        curr.removeEventListener("transitionend", handler);
      };
    }, [state.state]);
    p2(() => {
      if (state.state !== "settled") {
        return;
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("stack");
      for (let string of state.stack) {
        url.searchParams.append("stack", string);
      }
      for (let [key, value] of Object.entries(state.params)) {
        url.searchParams.set(key, value);
      }
      window.history.pushState({}, "", url);
      function handler() {
        dispatch({ type: "pop", opts: { animate: props.animate } });
      }
      window.addEventListener("popstate", handler);
      return () => {
        window.removeEventListener("popstate", handler);
      };
    }, [state.state, state.params, props.animate]);
    const canPop = T2(() => {
      if (state.state === "transitioning") {
        return state.commit.length > 1 || state.stack.length > 1;
      }
      return state.stack.length > 1;
    }, [state.state, state.stack, state.commit]);
    const canPopFrom = T2(
      (screen2) => {
        if (state.stack[0] === screen2)
          return false;
        return canPop();
      },
      [state.state, state.stack, state.commit]
    );
    const screen = T2(() => {
      const v3 = (
        /** @type {ScreenName} */
        state.stack[state.stack.length - 1]
      );
      return v3;
    }, [state.state, state.stack, state.commit]);
    const api = {
      push: (name, params = {}) => dispatch({ type: "push", name, opts: { animate: props.animate }, params }),
      pop: () => dispatch({ type: "pop", opts: { animate: props.animate } }),
      goto: (stack) => dispatch({ type: "goto", stack, opts: { animate: props.animate } }),
      canPop,
      canPopFrom,
      screen,
      params: state.params
    };
    return /* @__PURE__ */ y(NavContext.Provider, { value: api }, /* @__PURE__ */ y(
      "div",
      {
        id: "popup-container",
        ref: parentRef,
        className: (0, import_classnames.default)({
          "sliding-subview-v2": true,
          "sliding-subview-v2--root": true,
          "sliding-subview-v2--animating": state.state === "transitioning"
        }),
        style: {
          transform: `translateX(` + -((state.stack.length - 1) * 100) + "%)"
        }
      },
      Object.entries(availableScreens).map(([name, item]) => {
        const inStack = state.stack.includes(name);
        const commiting = state.commit.includes(name);
        const current = state.stack[state.stack.length - 1] === name;
        if (!inStack && !commiting)
          return null;
        if (item.kind === "root") {
          return /* @__PURE__ */ y(ScreenContext.Provider, { value: { screen: (
            /** @type {ScreenName} */
            name
          ) } }, /* @__PURE__ */ y("section", { className: "app-height", key: name }, item.component()));
        }
        const translateValue = state.stack.includes(name) ? state.stack.indexOf(name) : state.commit.includes(name) ? state.commit.indexOf(name) : 0;
        const cssProp = `translateX(${translateValue * 100}%)`;
        return /* @__PURE__ */ y(ScreenContext.Provider, { value: { screen: (
          /** @type {ScreenName} */
          name
        ) } }, /* @__PURE__ */ y(
          "section",
          {
            "data-current": String(current),
            className: "sliding-subview-v2",
            key: name,
            style: { transform: cssProp }
          },
          item.component()
        ));
      })
    ));
  }

  // v2/settings.jsx
  var SettingsContext = G({
    /** @type {boolean} */
    reducedMotion: false
  });
  function SettingsProvider({ children }) {
    const [reducedMotion, setReducedMotion] = h2(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    p2(() => {
      const mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
      const listener = (event) => setReducedMotion(event.matches);
      mediaQueryList.addEventListener("change", listener);
      return () => {
        mediaQueryList.removeEventListener("change", listener);
      };
    }, []);
    return /* @__PURE__ */ y(SettingsContext.Provider, { value: { reducedMotion } }, children);
  }
  function useGlobalSettings() {
    return q2(SettingsContext);
  }

  // v2/app.jsx
  function App() {
    const { reducedMotion } = useGlobalSettings();
    const data = useFeatures();
    const stack = initialStack(data);
    return /* @__PURE__ */ y(Navigation, { stack, animate: !reducedMotion, params: new URLSearchParams(window.location.search) });
  }
  function initialStack(features) {
    if (features.initialScreen === "breakageForm") {
      return ["breakageForm"];
    }
    if (features.initialScreen === "promptBreakageForm") {
      return ["promptBreakageForm"];
    }
    if (features.initialScreen === "toggleReport") {
      return ["toggleReport"];
    }
    if (features.initialScreen === "choiceBreakageForm") {
      return ["choiceBreakageForm"];
    }
    if (features.initialScreen === "categoryTypeSelection") {
      return ["categoryTypeSelection"];
    }
    if (features.initialScreen === "categorySelection") {
      return ["categorySelection"];
    }
    return ["primaryScreen"];
  }

  // v2/translations.jsx
  var TranslationContext = G({
    /** @type {string} */
    locale: "en"
  });
  function TranslationProvider({ children }) {
    const data = useData();
    const locale3 = data.tab?.locale;
    const [state, setReady] = h2(
      /** @type {'idle'|'ready'|'loading'|'error'} */
      "idle"
    );
    p2(() => {
      async function fetchFile(locale4) {
        setReady("loading");
        const v3 = `/locales/${locale4}.js`;
        const mod = await import(v3);
        for (let [ns2, translations] of Object.entries(mod.default)) {
          i18n.addResourceBundle(locale4, ns2, translations);
        }
        if (Object.keys(
          /** @type {any} */
          i18n.options.resources
        ).includes(locale4)) {
          i18n.changeLanguage(locale4);
        } else {
          console.warn(`Unsupported locale ${locale4}`);
        }
        setReady("ready");
      }
      if (typeof locale3 === "string" && locale3.length === 2) {
        fetchFile("pl").then(() => setReady("ready")).catch(() => {
          console.error(`could not load the locale ${locale3}`);
          setReady("error");
        });
      } else {
        setReady("ready");
      }
    }, [locale3]);
    if (state === "idle")
      return null;
    if (state === "loading")
      return null;
    return /* @__PURE__ */ y(TranslationContext.Provider, { value: { locale: "en" } }, children);
  }

  // v2/index.jsx
  window.onunhandledrejection = (event) => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
  };
  async function init2() {
    const app = document.querySelector("#app");
    if (!app)
      throw new Error("unreachable");
    B(
      /* @__PURE__ */ y(SettingsProvider, null, /* @__PURE__ */ y(DataProvider, null, /* @__PURE__ */ y(TranslationProvider, null, /* @__PURE__ */ y(App, null)))),
      app
    );
  }
  init2().catch((e3) => {
    console.error("start up error", e3);
  });
})();
/*! Bundled license information:

classnames/index.js:
  (*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  *)

@material/base/foundation.js:
  (**
   * @license
   * Copyright 2016 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/base/component.js:
  (**
   * @license
   * Copyright 2016 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/dom/events.js:
  (**
   * @license
   * Copyright 2019 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/dom/ponyfill.js:
  (**
   * @license
   * Copyright 2018 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/ripple/constants.js:
  (**
   * @license
   * Copyright 2016 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/ripple/foundation.js:
  (**
   * @license
   * Copyright 2016 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/ripple/component.js:
  (**
   * @license
   * Copyright 2016 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/switch/constants.js:
  (**
   * @license
   * Copyright 2021 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/base/observer.js:
  (**
   * @license
   * Copyright 2021 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/base/observer-foundation.js:
  (**
   * @license
   * Copyright 2021 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/switch/foundation.js:
  (**
   * @license
   * Copyright 2021 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)

@material/switch/component.js:
  (**
   * @license
   * Copyright 2021 Google Inc.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   *)
*/
