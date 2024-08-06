function Fh(e, o) {
  for (var n = 0; n < o.length; n++) {
    const l = o[n];
    if (typeof l != "string" && !Array.isArray(l)) {
      for (const c in l)
        if (c !== "default" && !(c in e)) {
          const m = Object.getOwnPropertyDescriptor(l, c);
          m && Object.defineProperty(e, c, m.get ? m : {
            enumerable: !0,
            get: () => l[c]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var ki = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Js(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function zh(e, o) {
  const n = window.getComputedStyle(e);
  for (const l of n)
    o.style[l] = n[l];
  for (let l = 0; l < e.children.length; l++)
    zh(e.children[l], o.children[l]);
}
function W0({ source: e, target: o, scale: n, format: l, quality: c }) {
  let m = new XMLSerializer().serializeToString(o), g = document.createElement("canvas"), b = e.getBoundingClientRect();
  g.width = b.width * n, g.height = b.height * n, g.style.width = b.width, g.style.height = b.height;
  let p = g.getContext("2d");
  p.scale(n, n);
  let v = document.createElement("img");
  return v.setAttribute(
    "src",
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(m)))
  ), new Promise((S) => {
    v.onload = () => {
      p.drawImage(v, 0, 0), S(
        g.toDataURL(`image/${l === "jpg" ? "jpeg" : l}`, c)
      );
    };
  });
}
function $0({ file: e, name: o, format: n }) {
  let l = document.createElement("a");
  l.download = `${o}.${n}`, l.href = e, document.body.appendChild(l), l.click(), document.body.removeChild(l);
}
var qh = async function(e, o, {
  scale: n = 1,
  format: l = "png",
  quality: c = 0.92,
  download: m = !0,
  ignore: g = null,
  cssinline: b = 1,
  background: p = null
} = {}) {
  e = e instanceof Element ? e : document.querySelector(e);
  const v = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  v.innerHTML = e.innerHTML;
  for (const x of e.attributes)
    v.setAttribute(x.name, x.value);
  if (b === 1 && zh(e, v), p && (v.style.background = p), g != null) {
    const x = v.querySelectorAll(g);
    [].forEach.call(x, (h) => h.parentNode.removeChild(h));
  }
  const S = await W0({
    source: e,
    target: v,
    scale: n,
    format: l,
    quality: c
  });
  return m && $0({ file: S, name: o, format: l }), S;
};
const Hh = /* @__PURE__ */ Js(qh), G0 = /* @__PURE__ */ Fh({
  __proto__: null,
  default: Hh
}, [qh]), U0 = function() {
  var e = function(o) {
    var l;
    var n = {};
    return console.log("json", o), n.features = (l = o.genome.features) == null ? void 0 : l.map((c) => ({
      ...c,
      midpoint: (c.end - c.start) / 2 + c.start,
      selected: !1
    })), n;
  };
  return {
    readAnnotationXMLFromRawXML: function(o) {
      return e(o);
    },
    readAnnotationXML: async function(o) {
      const n = await import("./arabidopsis-BWR4fnku.js");
      return e(n.default);
    }
  };
}, V0 = function() {
  var e = function(o) {
    console.log("json", o);
    var n = {};
    return n.chromosomes = o == null ? void 0 : o.chromosomes, n;
  };
  return {
    readBasemapXML: async function(o) {
      const n = await import("./arabidopsis-DwB0Pl7k.js");
      return e(n.default);
    },
    readBasemapXMLFromRawXML: function(o) {
      return e(o);
    }
  };
}, X0 = function() {
  var e = function(l) {
    var c = new Array(8 - l.length + 1).join("0");
    let m = "#" + c + l.substring(2, l.length);
    return m == "#00FF00" && (m = "#208000"), m;
  }, o = function(l) {
    return l.chromosomes.forEach(function(c) {
      c.annotations = {
        allGenes: [],
        genes: [],
        qtls: [],
        snps: []
      }, c.bands || (c.bands = []), c.bands.forEach(function(m) {
        m.color = e(m.color);
      });
    }), l;
  }, n = function(l) {
    var c = o(l[0]), m = l[1];
    return m.features.forEach(function(g) {
      g.color = e(g.color);
    }), m.features.filter(function(g) {
      return g.type.toLowerCase() === "gene";
    }).forEach(function(g, b) {
      g.globalIndex = b;
    }), c.chromosomes.forEach(function(g) {
      var b = m.features.filter(function(k) {
        return k.chromosome === g.number;
      }), p = b.filter(function(k) {
        return k.type.toLowerCase() === "gene";
      }), v = b.filter(function(k) {
        return k.type.toLowerCase() === "qtl";
      }), S = b.filter(function(k) {
        return k.type.toLowerCase() === "snp";
      }), x = S.reduce(function(k, O) {
        return Math.min(k, O.pvalue);
      }, 1);
      S.forEach(function(k, O) {
        k.id = g.number + "_" + O, k.importance = Math.log(k.pvalue) / Math.log(x);
      }), v.forEach(function(k, O) {
        k.id = g.number + "_" + O, k.selected = !1;
      }), v.reduce(function(k, O) {
        return Math.max(k, O.score);
      }, 0);
      var h = 0.9, w = 3.5, a = function(k) {
        return h - 0.5 + 1 / (1 + Math.pow(k, w));
      };
      p.forEach(function(k, O) {
        k.visible = !1, k.hidden = !1, k.displayed = !1, k.importance = a(O);
      });
      var E = p.slice(0, 100);
      g.annotations = {
        genes: E,
        allGenes: p,
        qtls: v,
        snps: S
      };
    }), c;
  };
  return {
    readXMLData: async function(l, c, m) {
      var g = V0();
      let b;
      if (m ? b = g.readBasemapXMLFromRawXML(l) : b = await g.readBasemapXML(l), c) {
        var p = U0();
        let S;
        m ? S = p.readAnnotationXMLFromRawXML(c) : S = p.readAnnotationXML(c);
        var v = Promise.all([b, S]).then(
          n,
          function(x) {
            return b.then(o);
          }
        );
        return v;
      }
      return o(b);
    }
  };
};
var qs = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
qs.exports;
(function(e, o) {
  (function() {
    var n, l = "4.17.21", c = 200, m = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", g = "Expected a function", b = "Invalid `variable` option passed into `_.template`", p = "__lodash_hash_undefined__", v = 500, S = "__lodash_placeholder__", x = 1, h = 2, w = 4, a = 1, E = 2, k = 1, O = 2, G = 4, q = 8, P = 16, U = 32, Q = 64, et = 128, yt = 256, _t = 512, bt = 30, wt = "...", jt = 800, Bt = 16, Y = 1, pt = 2, J = 3, lt = 1 / 0, xt = 9007199254740991, At = 17976931348623157e292, Lt = NaN, j = 4294967295, kt = j - 1, le = j >>> 1, zt = [
      ["ary", et],
      ["bind", k],
      ["bindKey", O],
      ["curry", q],
      ["curryRight", P],
      ["flip", _t],
      ["partial", U],
      ["partialRight", Q],
      ["rearg", yt]
    ], ie = "[object Arguments]", de = "[object Array]", oe = "[object AsyncFunction]", Yt = "[object Boolean]", Be = "[object Date]", Je = "[object DOMException]", ye = "[object Error]", Ot = "[object Function]", rt = "[object GeneratorFunction]", dt = "[object Map]", vt = "[object Number]", Jt = "[object Null]", pe = "[object Object]", xe = "[object Promise]", Ve = "[object Proxy]", ke = "[object RegExp]", Oe = "[object Set]", Me = "[object String]", Ae = "[object Symbol]", qn = "[object Undefined]", Ln = "[object WeakMap]", br = "[object WeakSet]", kn = "[object ArrayBuffer]", dn = "[object DataView]", wr = "[object Float32Array]", li = "[object Float64Array]", fi = "[object Int8Array]", Wr = "[object Int16Array]", $r = "[object Int32Array]", it = "[object Uint8Array]", St = "[object Uint8ClampedArray]", Rt = "[object Uint16Array]", ae = "[object Uint32Array]", se = /\b__p \+= '';/g, $e = /\b(__p \+=) '' \+/g, tn = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Hn = /&(?:amp|lt|gt|quot|#39);/g, ci = /[&<>"']/g, Wn = RegExp(Hn.source), hi = RegExp(ci.source), Gr = /<%-([\s\S]+?)%>/g, Pn = /<%([\s\S]+?)%>/g, di = /<%=([\s\S]+?)%>/g, Ur = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, xr = /^\w*$/, wa = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, _o = /[\\^$.*+?()[\]{}|]/g, _r = RegExp(_o.source), Bi = /^\s+/, pi = /\s/, xa = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, _a = /\{\n\/\* \[wrapped with (.+)\] \*/, Fi = /,? & /, Ca = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, zi = /[()=,{}\[\]\/\s]/, Co = /\\(\\)?/g, Aa = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, ir = /\w*$/, or = /^[-+]0x[0-9a-f]+$/i, ou = /^0b[01]+$/i, Ao = /^\[object .+?Constructor\]$/, So = /^0o[0-7]+$/i, au = /^(?:0|[1-9]\d*)$/, su = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, qi = /($^)/, uu = /['\n\r\u2028\u2029\\]/g, gi = "\\ud800-\\udfff", Sa = "\\u0300-\\u036f", Ea = "\\ufe20-\\ufe2f", Ta = "\\u20d0-\\u20ff", Eo = Sa + Ea + Ta, To = "\\u2700-\\u27bf", Lo = "a-z\\xdf-\\xf6\\xf8-\\xff", La = "\\xac\\xb1\\xd7\\xf7", en = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Vr = "\\u2000-\\u206f", Hi = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", ka = "A-Z\\xc0-\\xd6\\xd8-\\xde", Pa = "\\ufe0e\\ufe0f", ko = La + en + Vr + Hi, Xr = "['’]", Na = "[" + gi + "]", Ma = "[" + ko + "]", Wi = "[" + Eo + "]", pn = "\\d+", lu = "[" + To + "]", Da = "[" + Lo + "]", Cr = "[^" + gi + ko + pn + To + Lo + ka + "]", $i = "\\ud83c[\\udffb-\\udfff]", $n = "(?:" + Wi + "|" + $i + ")", Gi = "[^" + gi + "]", Gn = "(?:\\ud83c[\\udde6-\\uddff]){2}", jr = "[\\ud800-\\udbff][\\udc00-\\udfff]", Yr = "[" + ka + "]", Oa = "\\u200d", Ui = "(?:" + Da + "|" + Cr + ")", Ar = "(?:" + Yr + "|" + Cr + ")", Ra = "(?:" + Xr + "(?:d|ll|m|re|s|t|ve))?", Vi = "(?:" + Xr + "(?:D|LL|M|RE|S|T|VE))?", Xi = $n + "?", Ia = "[" + Pa + "]?", fu = "(?:" + Oa + "(?:" + [Gi, Gn, jr].join("|") + ")" + Ia + Xi + ")*", Ba = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", cu = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Fa = Ia + Xi + fu, hu = "(?:" + [lu, Gn, jr].join("|") + ")" + Fa, du = "(?:" + [Gi + Wi + "?", Wi, Gn, jr, Na].join("|") + ")", za = RegExp(Xr, "g"), qa = RegExp(Wi, "g"), vi = RegExp($i + "(?=" + $i + ")|" + du + Fa, "g"), Ha = RegExp([
      Yr + "?" + Da + "+" + Ra + "(?=" + [Ma, Yr, "$"].join("|") + ")",
      Ar + "+" + Vi + "(?=" + [Ma, Yr + Ui, "$"].join("|") + ")",
      Yr + "?" + Ui + "+" + Ra,
      Yr + "+" + Vi,
      cu,
      Ba,
      pn,
      hu
    ].join("|"), "g"), Po = RegExp("[" + Oa + gi + Eo + Pa + "]"), Qr = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Wa = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ], $a = -1, Se = {};
    Se[wr] = Se[li] = Se[fi] = Se[Wr] = Se[$r] = Se[it] = Se[St] = Se[Rt] = Se[ae] = !0, Se[ie] = Se[de] = Se[kn] = Se[Yt] = Se[dn] = Se[Be] = Se[ye] = Se[Ot] = Se[dt] = Se[vt] = Se[pe] = Se[ke] = Se[Oe] = Se[Me] = Se[Ln] = !1;
    var Ee = {};
    Ee[ie] = Ee[de] = Ee[kn] = Ee[dn] = Ee[Yt] = Ee[Be] = Ee[wr] = Ee[li] = Ee[fi] = Ee[Wr] = Ee[$r] = Ee[dt] = Ee[vt] = Ee[pe] = Ee[ke] = Ee[Oe] = Ee[Me] = Ee[Ae] = Ee[it] = Ee[St] = Ee[Rt] = Ee[ae] = !0, Ee[ye] = Ee[Ot] = Ee[Ln] = !1;
    var pu = {
      // Latin-1 Supplement block.
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "A",
      Å: "A",
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "a",
      å: "a",
      Ç: "C",
      ç: "c",
      Ð: "D",
      ð: "d",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      Ñ: "N",
      ñ: "n",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "O",
      Ø: "O",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "o",
      ø: "o",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "U",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "u",
      Ý: "Y",
      ý: "y",
      ÿ: "y",
      Æ: "Ae",
      æ: "ae",
      Þ: "Th",
      þ: "th",
      ß: "ss",
      // Latin Extended-A block.
      Ā: "A",
      Ă: "A",
      Ą: "A",
      ā: "a",
      ă: "a",
      ą: "a",
      Ć: "C",
      Ĉ: "C",
      Ċ: "C",
      Č: "C",
      ć: "c",
      ĉ: "c",
      ċ: "c",
      č: "c",
      Ď: "D",
      Đ: "D",
      ď: "d",
      đ: "d",
      Ē: "E",
      Ĕ: "E",
      Ė: "E",
      Ę: "E",
      Ě: "E",
      ē: "e",
      ĕ: "e",
      ė: "e",
      ę: "e",
      ě: "e",
      Ĝ: "G",
      Ğ: "G",
      Ġ: "G",
      Ģ: "G",
      ĝ: "g",
      ğ: "g",
      ġ: "g",
      ģ: "g",
      Ĥ: "H",
      Ħ: "H",
      ĥ: "h",
      ħ: "h",
      Ĩ: "I",
      Ī: "I",
      Ĭ: "I",
      Į: "I",
      İ: "I",
      ĩ: "i",
      ī: "i",
      ĭ: "i",
      į: "i",
      ı: "i",
      Ĵ: "J",
      ĵ: "j",
      Ķ: "K",
      ķ: "k",
      ĸ: "k",
      Ĺ: "L",
      Ļ: "L",
      Ľ: "L",
      Ŀ: "L",
      Ł: "L",
      ĺ: "l",
      ļ: "l",
      ľ: "l",
      ŀ: "l",
      ł: "l",
      Ń: "N",
      Ņ: "N",
      Ň: "N",
      Ŋ: "N",
      ń: "n",
      ņ: "n",
      ň: "n",
      ŋ: "n",
      Ō: "O",
      Ŏ: "O",
      Ő: "O",
      ō: "o",
      ŏ: "o",
      ő: "o",
      Ŕ: "R",
      Ŗ: "R",
      Ř: "R",
      ŕ: "r",
      ŗ: "r",
      ř: "r",
      Ś: "S",
      Ŝ: "S",
      Ş: "S",
      Š: "S",
      ś: "s",
      ŝ: "s",
      ş: "s",
      š: "s",
      Ţ: "T",
      Ť: "T",
      Ŧ: "T",
      ţ: "t",
      ť: "t",
      ŧ: "t",
      Ũ: "U",
      Ū: "U",
      Ŭ: "U",
      Ů: "U",
      Ű: "U",
      Ų: "U",
      ũ: "u",
      ū: "u",
      ŭ: "u",
      ů: "u",
      ű: "u",
      ų: "u",
      Ŵ: "W",
      ŵ: "w",
      Ŷ: "Y",
      ŷ: "y",
      Ÿ: "Y",
      Ź: "Z",
      Ż: "Z",
      Ž: "Z",
      ź: "z",
      ż: "z",
      ž: "z",
      Ĳ: "IJ",
      ĳ: "ij",
      Œ: "Oe",
      œ: "oe",
      ŉ: "'n",
      ſ: "s"
    }, gu = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, vu = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, mu = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, yu = parseFloat, Ga = parseInt, Ua = typeof ki == "object" && ki && ki.Object === Object && ki, bu = typeof self == "object" && self && self.Object === Object && self, Fe = Ua || bu || Function("return this")(), No = o && !o.nodeType && o, Nn = No && !0 && e && !e.nodeType && e, Kr = Nn && Nn.exports === No, mi = Kr && Ua.process, sn = function() {
      try {
        var $ = Nn && Nn.require && Nn.require("util").types;
        return $ || mi && mi.binding && mi.binding("util");
      } catch {
      }
    }(), Mo = sn && sn.isArrayBuffer, ji = sn && sn.isDate, Do = sn && sn.isMap, Oo = sn && sn.isRegExp, Va = sn && sn.isSet, Xa = sn && sn.isTypedArray;
    function i($, tt, Z) {
      switch (Z.length) {
        case 0:
          return $.call(tt);
        case 1:
          return $.call(tt, Z[0]);
        case 2:
          return $.call(tt, Z[0], Z[1]);
        case 3:
          return $.call(tt, Z[0], Z[1], Z[2]);
      }
      return $.apply(tt, Z);
    }
    function s($, tt, Z, Et) {
      for (var Vt = -1, ve = $ == null ? 0 : $.length; ++Vt < ve; ) {
        var ze = $[Vt];
        tt(Et, ze, Z(ze), $);
      }
      return Et;
    }
    function f($, tt) {
      for (var Z = -1, Et = $ == null ? 0 : $.length; ++Z < Et && tt($[Z], Z, $) !== !1; )
        ;
      return $;
    }
    function d($, tt) {
      for (var Z = $ == null ? 0 : $.length; Z-- && tt($[Z], Z, $) !== !1; )
        ;
      return $;
    }
    function C($, tt) {
      for (var Z = -1, Et = $ == null ? 0 : $.length; ++Z < Et; )
        if (!tt($[Z], Z, $))
          return !1;
      return !0;
    }
    function A($, tt) {
      for (var Z = -1, Et = $ == null ? 0 : $.length, Vt = 0, ve = []; ++Z < Et; ) {
        var ze = $[Z];
        tt(ze, Z, $) && (ve[Vt++] = ze);
      }
      return ve;
    }
    function L($, tt) {
      var Z = $ == null ? 0 : $.length;
      return !!Z && De($, tt, 0) > -1;
    }
    function R($, tt, Z) {
      for (var Et = -1, Vt = $ == null ? 0 : $.length; ++Et < Vt; )
        if (Z(tt, $[Et]))
          return !0;
      return !1;
    }
    function z($, tt) {
      for (var Z = -1, Et = $ == null ? 0 : $.length, Vt = Array(Et); ++Z < Et; )
        Vt[Z] = tt($[Z], Z, $);
      return Vt;
    }
    function H($, tt) {
      for (var Z = -1, Et = tt.length, Vt = $.length; ++Z < Et; )
        $[Vt + Z] = tt[Z];
      return $;
    }
    function X($, tt, Z, Et) {
      var Vt = -1, ve = $ == null ? 0 : $.length;
      for (Et && ve && (Z = $[++Vt]); ++Vt < ve; )
        Z = tt(Z, $[Vt], Vt, $);
      return Z;
    }
    function ft($, tt, Z, Et) {
      var Vt = $ == null ? 0 : $.length;
      for (Et && Vt && (Z = $[--Vt]); Vt--; )
        Z = tt(Z, $[Vt], Vt, $);
      return Z;
    }
    function mt($, tt) {
      for (var Z = -1, Et = $ == null ? 0 : $.length; ++Z < Et; )
        if (tt($[Z], Z, $))
          return !0;
      return !1;
    }
    var ct = Kt("length");
    function Ut($) {
      return $.split("");
    }
    function qt($) {
      return $.match(Ca) || [];
    }
    function Qt($, tt, Z) {
      var Et;
      return Z($, function(Vt, ve, ze) {
        if (tt(Vt, ve, ze))
          return Et = ve, !1;
      }), Et;
    }
    function Xe($, tt, Z, Et) {
      for (var Vt = $.length, ve = Z + (Et ? 1 : -1); Et ? ve-- : ++ve < Vt; )
        if (tt($[ve], ve, $))
          return ve;
      return -1;
    }
    function De($, tt, Z) {
      return tt === tt ? Zi($, tt, Z) : Xe($, Tt, Z);
    }
    function ar($, tt, Z, Et) {
      for (var Vt = Z - 1, ve = $.length; ++Vt < ve; )
        if (Et($[Vt], tt))
          return Vt;
      return -1;
    }
    function Tt($) {
      return $ !== $;
    }
    function Ge($, tt) {
      var Z = $ == null ? 0 : $.length;
      return Z ? nn($, tt) / Z : Lt;
    }
    function Kt($) {
      return function(tt) {
        return tt == null ? n : tt[$];
      };
    }
    function Ne($) {
      return function(tt) {
        return $ == null ? n : $[tt];
      };
    }
    function Un($, tt, Z, Et, Vt) {
      return Vt($, function(ve, ze, ce) {
        Z = Et ? (Et = !1, ve) : tt(Z, ve, ze, ce);
      }), Z;
    }
    function Yi($, tt) {
      var Z = $.length;
      for ($.sort(tt); Z--; )
        $[Z] = $[Z].value;
      return $;
    }
    function nn($, tt) {
      for (var Z, Et = -1, Vt = $.length; ++Et < Vt; ) {
        var ve = tt($[Et]);
        ve !== n && (Z = Z === n ? ve : Z + ve);
      }
      return Z;
    }
    function Vn($, tt) {
      for (var Z = -1, Et = Array($); ++Z < $; )
        Et[Z] = tt(Z);
      return Et;
    }
    function sr($, tt) {
      return z(tt, function(Z) {
        return [Z, $[Z]];
      });
    }
    function Xn($) {
      return $ && $.slice(0, Ka($) + 1).replace(Bi, "");
    }
    function Te($) {
      return function(tt) {
        return $(tt);
      };
    }
    function rn($, tt) {
      return z(tt, function(Z) {
        return $[Z];
      });
    }
    function yi($, tt) {
      return $.has(tt);
    }
    function jn($, tt) {
      for (var Z = -1, Et = $.length; ++Z < Et && De(tt, $[Z], 0) > -1; )
        ;
      return Z;
    }
    function Ro($, tt) {
      for (var Z = $.length; Z-- && De(tt, $[Z], 0) > -1; )
        ;
      return Z;
    }
    function Sr($, tt) {
      for (var Z = $.length, Et = 0; Z--; )
        $[Z] === tt && ++Et;
      return Et;
    }
    var Io = Ne(pu), _e = Ne(gu);
    function Er($) {
      return "\\" + mu[$];
    }
    function ja($, tt) {
      return $ == null ? n : $[tt];
    }
    function ur($) {
      return Po.test($);
    }
    function wu($) {
      return Qr.test($);
    }
    function Qi($) {
      for (var tt, Z = []; !(tt = $.next()).done; )
        Z.push(tt.value);
      return Z;
    }
    function Bo($) {
      var tt = -1, Z = Array($.size);
      return $.forEach(function(Et, Vt) {
        Z[++tt] = [Vt, Et];
      }), Z;
    }
    function Ya($, tt) {
      return function(Z) {
        return $(tt(Z));
      };
    }
    function lr($, tt) {
      for (var Z = -1, Et = $.length, Vt = 0, ve = []; ++Z < Et; ) {
        var ze = $[Z];
        (ze === tt || ze === S) && ($[Z] = S, ve[Vt++] = Z);
      }
      return ve;
    }
    function Ki($) {
      var tt = -1, Z = Array($.size);
      return $.forEach(function(Et) {
        Z[++tt] = Et;
      }), Z;
    }
    function Qa($) {
      var tt = -1, Z = Array($.size);
      return $.forEach(function(Et) {
        Z[++tt] = [Et, Et];
      }), Z;
    }
    function Zi($, tt, Z) {
      for (var Et = Z - 1, Vt = $.length; ++Et < Vt; )
        if ($[Et] === tt)
          return Et;
      return -1;
    }
    function xu($, tt, Z) {
      for (var Et = Z + 1; Et--; )
        if ($[Et] === tt)
          return Et;
      return Et;
    }
    function Zr($) {
      return ur($) ? _u($) : ct($);
    }
    function Qe($) {
      return ur($) ? Yn($) : Ut($);
    }
    function Ka($) {
      for (var tt = $.length; tt-- && pi.test($.charAt(tt)); )
        ;
      return tt;
    }
    var Fo = Ne(vu);
    function _u($) {
      for (var tt = vi.lastIndex = 0; vi.test($); )
        ++tt;
      return tt;
    }
    function Yn($) {
      return $.match(vi) || [];
    }
    function Qn($) {
      return $.match(Ha) || [];
    }
    var Za = function $(tt) {
      tt = tt == null ? Fe : ge.defaults(Fe.Object(), tt, ge.pick(Fe, Wa));
      var Z = tt.Array, Et = tt.Date, Vt = tt.Error, ve = tt.Function, ze = tt.Math, ce = tt.Object, bi = tt.RegExp, Ja = tt.String, Ke = tt.TypeError, Jr = Z.prototype, zo = ve.prototype, ti = ce.prototype, Tr = tt["__core-js_shared__"], ei = zo.toString, me = ti.hasOwnProperty, Cu = 0, D = function() {
        var t = /[^.]+$/.exec(Tr && Tr.keys && Tr.keys.IE_PROTO || "");
        return t ? "Symbol(src)_1." + t : "";
      }(), B = ti.toString, W = ei.call(ce), nt = Fe._, K = bi(
        "^" + ei.call(me).replace(_o, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), ut = Kr ? tt.Buffer : n, ot = tt.Symbol, gt = tt.Uint8Array, Nt = ut ? ut.allocUnsafe : n, Gt = Ya(ce.getPrototypeOf, ce), Mt = ce.create, Ht = ti.propertyIsEnumerable, te = Jr.splice, be = ot ? ot.isConcatSpreadable : n, It = ot ? ot.iterator : n, Le = ot ? ot.toStringTag : n, qe = function() {
        try {
          var t = Si(ce, "defineProperty");
          return t({}, "", {}), t;
        } catch {
        }
      }(), un = tt.clearTimeout !== Fe.clearTimeout && tt.clearTimeout, Pe = Et && Et.now !== Fe.Date.now && Et.now, wi = tt.setTimeout !== Fe.setTimeout && tt.setTimeout, fr = ze.ceil, je = ze.floor, Au = ce.getOwnPropertySymbols, Gd = ut ? ut.isBuffer : n, ff = tt.isFinite, Ud = Jr.join, Vd = Ya(ce.keys, ce), Ue = ze.max, on = ze.min, Xd = Et.now, jd = tt.parseInt, cf = ze.random, Yd = Jr.reverse, Su = Si(tt, "DataView"), qo = Si(tt, "Map"), Eu = Si(tt, "Promise"), Ji = Si(tt, "Set"), Ho = Si(tt, "WeakMap"), Wo = Si(ce, "create"), ts = Ho && new Ho(), to = {}, Qd = Ei(Su), Kd = Ei(qo), Zd = Ei(Eu), Jd = Ei(Ji), tp = Ei(Ho), es = ot ? ot.prototype : n, $o = es ? es.valueOf : n, hf = es ? es.toString : n;
      function N(t) {
        if (Ie(t) && !Zt(t) && !(t instanceof fe)) {
          if (t instanceof Mn)
            return t;
          if (me.call(t, "__wrapped__"))
            return dc(t);
        }
        return new Mn(t);
      }
      var eo = /* @__PURE__ */ function() {
        function t() {
        }
        return function(r) {
          if (!Re(r))
            return {};
          if (Mt)
            return Mt(r);
          t.prototype = r;
          var u = new t();
          return t.prototype = n, u;
        };
      }();
      function ns() {
      }
      function Mn(t, r) {
        this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!r, this.__index__ = 0, this.__values__ = n;
      }
      N.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: Gr,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: Pn,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: di,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        variable: "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        imports: {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          _: N
        }
      }, N.prototype = ns.prototype, N.prototype.constructor = N, Mn.prototype = eo(ns.prototype), Mn.prototype.constructor = Mn;
      function fe(t) {
        this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = j, this.__views__ = [];
      }
      function ep() {
        var t = new fe(this.__wrapped__);
        return t.__actions__ = gn(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = gn(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = gn(this.__views__), t;
      }
      function np() {
        if (this.__filtered__) {
          var t = new fe(this);
          t.__dir__ = -1, t.__filtered__ = !0;
        } else
          t = this.clone(), t.__dir__ *= -1;
        return t;
      }
      function rp() {
        var t = this.__wrapped__.value(), r = this.__dir__, u = Zt(t), y = r < 0, T = u ? t.length : 0, M = gg(0, T, this.__views__), I = M.start, F = M.end, V = F - I, at = y ? F : I - 1, st = this.__iteratees__, ht = st.length, Ct = 0, Pt = on(V, this.__takeCount__);
        if (!u || !y && T == V && Pt == V)
          return If(t, this.__actions__);
        var Wt = [];
        t:
          for (; V-- && Ct < Pt; ) {
            at += r;
            for (var ne = -1, $t = t[at]; ++ne < ht; ) {
              var ue = st[ne], he = ue.iteratee, An = ue.type, cn = he($t);
              if (An == pt)
                $t = cn;
              else if (!cn) {
                if (An == Y)
                  continue t;
                break t;
              }
            }
            Wt[Ct++] = $t;
          }
        return Wt;
      }
      fe.prototype = eo(ns.prototype), fe.prototype.constructor = fe;
      function xi(t) {
        var r = -1, u = t == null ? 0 : t.length;
        for (this.clear(); ++r < u; ) {
          var y = t[r];
          this.set(y[0], y[1]);
        }
      }
      function ip() {
        this.__data__ = Wo ? Wo(null) : {}, this.size = 0;
      }
      function op(t) {
        var r = this.has(t) && delete this.__data__[t];
        return this.size -= r ? 1 : 0, r;
      }
      function ap(t) {
        var r = this.__data__;
        if (Wo) {
          var u = r[t];
          return u === p ? n : u;
        }
        return me.call(r, t) ? r[t] : n;
      }
      function sp(t) {
        var r = this.__data__;
        return Wo ? r[t] !== n : me.call(r, t);
      }
      function up(t, r) {
        var u = this.__data__;
        return this.size += this.has(t) ? 0 : 1, u[t] = Wo && r === n ? p : r, this;
      }
      xi.prototype.clear = ip, xi.prototype.delete = op, xi.prototype.get = ap, xi.prototype.has = sp, xi.prototype.set = up;
      function Lr(t) {
        var r = -1, u = t == null ? 0 : t.length;
        for (this.clear(); ++r < u; ) {
          var y = t[r];
          this.set(y[0], y[1]);
        }
      }
      function lp() {
        this.__data__ = [], this.size = 0;
      }
      function fp(t) {
        var r = this.__data__, u = rs(r, t);
        if (u < 0)
          return !1;
        var y = r.length - 1;
        return u == y ? r.pop() : te.call(r, u, 1), --this.size, !0;
      }
      function cp(t) {
        var r = this.__data__, u = rs(r, t);
        return u < 0 ? n : r[u][1];
      }
      function hp(t) {
        return rs(this.__data__, t) > -1;
      }
      function dp(t, r) {
        var u = this.__data__, y = rs(u, t);
        return y < 0 ? (++this.size, u.push([t, r])) : u[y][1] = r, this;
      }
      Lr.prototype.clear = lp, Lr.prototype.delete = fp, Lr.prototype.get = cp, Lr.prototype.has = hp, Lr.prototype.set = dp;
      function kr(t) {
        var r = -1, u = t == null ? 0 : t.length;
        for (this.clear(); ++r < u; ) {
          var y = t[r];
          this.set(y[0], y[1]);
        }
      }
      function pp() {
        this.size = 0, this.__data__ = {
          hash: new xi(),
          map: new (qo || Lr)(),
          string: new xi()
        };
      }
      function gp(t) {
        var r = gs(this, t).delete(t);
        return this.size -= r ? 1 : 0, r;
      }
      function vp(t) {
        return gs(this, t).get(t);
      }
      function mp(t) {
        return gs(this, t).has(t);
      }
      function yp(t, r) {
        var u = gs(this, t), y = u.size;
        return u.set(t, r), this.size += u.size == y ? 0 : 1, this;
      }
      kr.prototype.clear = pp, kr.prototype.delete = gp, kr.prototype.get = vp, kr.prototype.has = mp, kr.prototype.set = yp;
      function _i(t) {
        var r = -1, u = t == null ? 0 : t.length;
        for (this.__data__ = new kr(); ++r < u; )
          this.add(t[r]);
      }
      function bp(t) {
        return this.__data__.set(t, p), this;
      }
      function wp(t) {
        return this.__data__.has(t);
      }
      _i.prototype.add = _i.prototype.push = bp, _i.prototype.has = wp;
      function Kn(t) {
        var r = this.__data__ = new Lr(t);
        this.size = r.size;
      }
      function xp() {
        this.__data__ = new Lr(), this.size = 0;
      }
      function _p(t) {
        var r = this.__data__, u = r.delete(t);
        return this.size = r.size, u;
      }
      function Cp(t) {
        return this.__data__.get(t);
      }
      function Ap(t) {
        return this.__data__.has(t);
      }
      function Sp(t, r) {
        var u = this.__data__;
        if (u instanceof Lr) {
          var y = u.__data__;
          if (!qo || y.length < c - 1)
            return y.push([t, r]), this.size = ++u.size, this;
          u = this.__data__ = new kr(y);
        }
        return u.set(t, r), this.size = u.size, this;
      }
      Kn.prototype.clear = xp, Kn.prototype.delete = _p, Kn.prototype.get = Cp, Kn.prototype.has = Ap, Kn.prototype.set = Sp;
      function df(t, r) {
        var u = Zt(t), y = !u && Ti(t), T = !u && !y && ai(t), M = !u && !y && !T && oo(t), I = u || y || T || M, F = I ? Vn(t.length, Ja) : [], V = F.length;
        for (var at in t)
          (r || me.call(t, at)) && !(I && // Safari 9 has enumerable `arguments.length` in strict mode.
          (at == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          T && (at == "offset" || at == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          M && (at == "buffer" || at == "byteLength" || at == "byteOffset") || // Skip index properties.
          Dr(at, V))) && F.push(at);
        return F;
      }
      function pf(t) {
        var r = t.length;
        return r ? t[Bu(0, r - 1)] : n;
      }
      function Ep(t, r) {
        return vs(gn(t), Ci(r, 0, t.length));
      }
      function Tp(t) {
        return vs(gn(t));
      }
      function Tu(t, r, u) {
        (u !== n && !Zn(t[r], u) || u === n && !(r in t)) && Pr(t, r, u);
      }
      function Go(t, r, u) {
        var y = t[r];
        (!(me.call(t, r) && Zn(y, u)) || u === n && !(r in t)) && Pr(t, r, u);
      }
      function rs(t, r) {
        for (var u = t.length; u--; )
          if (Zn(t[u][0], r))
            return u;
        return -1;
      }
      function Lp(t, r, u, y) {
        return ni(t, function(T, M, I) {
          r(y, T, u(T), I);
        }), y;
      }
      function gf(t, r) {
        return t && hr(r, Ye(r), t);
      }
      function kp(t, r) {
        return t && hr(r, mn(r), t);
      }
      function Pr(t, r, u) {
        r == "__proto__" && qe ? qe(t, r, {
          configurable: !0,
          enumerable: !0,
          value: u,
          writable: !0
        }) : t[r] = u;
      }
      function Lu(t, r) {
        for (var u = -1, y = r.length, T = Z(y), M = t == null; ++u < y; )
          T[u] = M ? n : ul(t, r[u]);
        return T;
      }
      function Ci(t, r, u) {
        return t === t && (u !== n && (t = t <= u ? t : u), r !== n && (t = t >= r ? t : r)), t;
      }
      function Dn(t, r, u, y, T, M) {
        var I, F = r & x, V = r & h, at = r & w;
        if (u && (I = T ? u(t, y, T, M) : u(t)), I !== n)
          return I;
        if (!Re(t))
          return t;
        var st = Zt(t);
        if (st) {
          if (I = mg(t), !F)
            return gn(t, I);
        } else {
          var ht = an(t), Ct = ht == Ot || ht == rt;
          if (ai(t))
            return zf(t, F);
          if (ht == pe || ht == ie || Ct && !T) {
            if (I = V || Ct ? {} : ic(t), !F)
              return V ? ag(t, kp(I, t)) : og(t, gf(I, t));
          } else {
            if (!Ee[ht])
              return T ? t : {};
            I = yg(t, ht, F);
          }
        }
        M || (M = new Kn());
        var Pt = M.get(t);
        if (Pt)
          return Pt;
        M.set(t, I), Dc(t) ? t.forEach(function($t) {
          I.add(Dn($t, r, u, $t, t, M));
        }) : Nc(t) && t.forEach(function($t, ue) {
          I.set(ue, Dn($t, r, u, ue, t, M));
        });
        var Wt = at ? V ? ju : Xu : V ? mn : Ye, ne = st ? n : Wt(t);
        return f(ne || t, function($t, ue) {
          ne && (ue = $t, $t = t[ue]), Go(I, ue, Dn($t, r, u, ue, t, M));
        }), I;
      }
      function Pp(t) {
        var r = Ye(t);
        return function(u) {
          return vf(u, t, r);
        };
      }
      function vf(t, r, u) {
        var y = u.length;
        if (t == null)
          return !y;
        for (t = ce(t); y--; ) {
          var T = u[y], M = r[T], I = t[T];
          if (I === n && !(T in t) || !M(I))
            return !1;
        }
        return !0;
      }
      function mf(t, r, u) {
        if (typeof t != "function")
          throw new Ke(g);
        return Ko(function() {
          t.apply(n, u);
        }, r);
      }
      function Uo(t, r, u, y) {
        var T = -1, M = L, I = !0, F = t.length, V = [], at = r.length;
        if (!F)
          return V;
        u && (r = z(r, Te(u))), y ? (M = R, I = !1) : r.length >= c && (M = yi, I = !1, r = new _i(r));
        t:
          for (; ++T < F; ) {
            var st = t[T], ht = u == null ? st : u(st);
            if (st = y || st !== 0 ? st : 0, I && ht === ht) {
              for (var Ct = at; Ct--; )
                if (r[Ct] === ht)
                  continue t;
              V.push(st);
            } else M(r, ht, y) || V.push(st);
          }
        return V;
      }
      var ni = Gf(cr), yf = Gf(Pu, !0);
      function Np(t, r) {
        var u = !0;
        return ni(t, function(y, T, M) {
          return u = !!r(y, T, M), u;
        }), u;
      }
      function is(t, r, u) {
        for (var y = -1, T = t.length; ++y < T; ) {
          var M = t[y], I = r(M);
          if (I != null && (F === n ? I === I && !Cn(I) : u(I, F)))
            var F = I, V = M;
        }
        return V;
      }
      function Mp(t, r, u, y) {
        var T = t.length;
        for (u = ee(u), u < 0 && (u = -u > T ? 0 : T + u), y = y === n || y > T ? T : ee(y), y < 0 && (y += T), y = u > y ? 0 : Rc(y); u < y; )
          t[u++] = r;
        return t;
      }
      function bf(t, r) {
        var u = [];
        return ni(t, function(y, T, M) {
          r(y, T, M) && u.push(y);
        }), u;
      }
      function Ze(t, r, u, y, T) {
        var M = -1, I = t.length;
        for (u || (u = wg), T || (T = []); ++M < I; ) {
          var F = t[M];
          r > 0 && u(F) ? r > 1 ? Ze(F, r - 1, u, y, T) : H(T, F) : y || (T[T.length] = F);
        }
        return T;
      }
      var ku = Uf(), wf = Uf(!0);
      function cr(t, r) {
        return t && ku(t, r, Ye);
      }
      function Pu(t, r) {
        return t && wf(t, r, Ye);
      }
      function os(t, r) {
        return A(r, function(u) {
          return Or(t[u]);
        });
      }
      function Ai(t, r) {
        r = ii(r, t);
        for (var u = 0, y = r.length; t != null && u < y; )
          t = t[dr(r[u++])];
        return u && u == y ? t : n;
      }
      function xf(t, r, u) {
        var y = r(t);
        return Zt(t) ? y : H(y, u(t));
      }
      function ln(t) {
        return t == null ? t === n ? qn : Jt : Le && Le in ce(t) ? pg(t) : Tg(t);
      }
      function Nu(t, r) {
        return t > r;
      }
      function Dp(t, r) {
        return t != null && me.call(t, r);
      }
      function Op(t, r) {
        return t != null && r in ce(t);
      }
      function Rp(t, r, u) {
        return t >= on(r, u) && t < Ue(r, u);
      }
      function Mu(t, r, u) {
        for (var y = u ? R : L, T = t[0].length, M = t.length, I = M, F = Z(M), V = 1 / 0, at = []; I--; ) {
          var st = t[I];
          I && r && (st = z(st, Te(r))), V = on(st.length, V), F[I] = !u && (r || T >= 120 && st.length >= 120) ? new _i(I && st) : n;
        }
        st = t[0];
        var ht = -1, Ct = F[0];
        t:
          for (; ++ht < T && at.length < V; ) {
            var Pt = st[ht], Wt = r ? r(Pt) : Pt;
            if (Pt = u || Pt !== 0 ? Pt : 0, !(Ct ? yi(Ct, Wt) : y(at, Wt, u))) {
              for (I = M; --I; ) {
                var ne = F[I];
                if (!(ne ? yi(ne, Wt) : y(t[I], Wt, u)))
                  continue t;
              }
              Ct && Ct.push(Wt), at.push(Pt);
            }
          }
        return at;
      }
      function Ip(t, r, u, y) {
        return cr(t, function(T, M, I) {
          r(y, u(T), M, I);
        }), y;
      }
      function Vo(t, r, u) {
        r = ii(r, t), t = uc(t, r);
        var y = t == null ? t : t[dr(Rn(r))];
        return y == null ? n : i(y, t, u);
      }
      function _f(t) {
        return Ie(t) && ln(t) == ie;
      }
      function Bp(t) {
        return Ie(t) && ln(t) == kn;
      }
      function Fp(t) {
        return Ie(t) && ln(t) == Be;
      }
      function Xo(t, r, u, y, T) {
        return t === r ? !0 : t == null || r == null || !Ie(t) && !Ie(r) ? t !== t && r !== r : zp(t, r, u, y, Xo, T);
      }
      function zp(t, r, u, y, T, M) {
        var I = Zt(t), F = Zt(r), V = I ? de : an(t), at = F ? de : an(r);
        V = V == ie ? pe : V, at = at == ie ? pe : at;
        var st = V == pe, ht = at == pe, Ct = V == at;
        if (Ct && ai(t)) {
          if (!ai(r))
            return !1;
          I = !0, st = !1;
        }
        if (Ct && !st)
          return M || (M = new Kn()), I || oo(t) ? ec(t, r, u, y, T, M) : hg(t, r, V, u, y, T, M);
        if (!(u & a)) {
          var Pt = st && me.call(t, "__wrapped__"), Wt = ht && me.call(r, "__wrapped__");
          if (Pt || Wt) {
            var ne = Pt ? t.value() : t, $t = Wt ? r.value() : r;
            return M || (M = new Kn()), T(ne, $t, u, y, M);
          }
        }
        return Ct ? (M || (M = new Kn()), dg(t, r, u, y, T, M)) : !1;
      }
      function qp(t) {
        return Ie(t) && an(t) == dt;
      }
      function Du(t, r, u, y) {
        var T = u.length, M = T, I = !y;
        if (t == null)
          return !M;
        for (t = ce(t); T--; ) {
          var F = u[T];
          if (I && F[2] ? F[1] !== t[F[0]] : !(F[0] in t))
            return !1;
        }
        for (; ++T < M; ) {
          F = u[T];
          var V = F[0], at = t[V], st = F[1];
          if (I && F[2]) {
            if (at === n && !(V in t))
              return !1;
          } else {
            var ht = new Kn();
            if (y)
              var Ct = y(at, st, V, t, r, ht);
            if (!(Ct === n ? Xo(st, at, a | E, y, ht) : Ct))
              return !1;
          }
        }
        return !0;
      }
      function Cf(t) {
        if (!Re(t) || _g(t))
          return !1;
        var r = Or(t) ? K : Ao;
        return r.test(Ei(t));
      }
      function Hp(t) {
        return Ie(t) && ln(t) == ke;
      }
      function Wp(t) {
        return Ie(t) && an(t) == Oe;
      }
      function $p(t) {
        return Ie(t) && _s(t.length) && !!Se[ln(t)];
      }
      function Af(t) {
        return typeof t == "function" ? t : t == null ? yn : typeof t == "object" ? Zt(t) ? Tf(t[0], t[1]) : Ef(t) : Vc(t);
      }
      function Ou(t) {
        if (!Qo(t))
          return Vd(t);
        var r = [];
        for (var u in ce(t))
          me.call(t, u) && u != "constructor" && r.push(u);
        return r;
      }
      function Gp(t) {
        if (!Re(t))
          return Eg(t);
        var r = Qo(t), u = [];
        for (var y in t)
          y == "constructor" && (r || !me.call(t, y)) || u.push(y);
        return u;
      }
      function Ru(t, r) {
        return t < r;
      }
      function Sf(t, r) {
        var u = -1, y = vn(t) ? Z(t.length) : [];
        return ni(t, function(T, M, I) {
          y[++u] = r(T, M, I);
        }), y;
      }
      function Ef(t) {
        var r = Qu(t);
        return r.length == 1 && r[0][2] ? ac(r[0][0], r[0][1]) : function(u) {
          return u === t || Du(u, t, r);
        };
      }
      function Tf(t, r) {
        return Zu(t) && oc(r) ? ac(dr(t), r) : function(u) {
          var y = ul(u, t);
          return y === n && y === r ? ll(u, t) : Xo(r, y, a | E);
        };
      }
      function as(t, r, u, y, T) {
        t !== r && ku(r, function(M, I) {
          if (T || (T = new Kn()), Re(M))
            Up(t, r, I, u, as, y, T);
          else {
            var F = y ? y(tl(t, I), M, I + "", t, r, T) : n;
            F === n && (F = M), Tu(t, I, F);
          }
        }, mn);
      }
      function Up(t, r, u, y, T, M, I) {
        var F = tl(t, u), V = tl(r, u), at = I.get(V);
        if (at) {
          Tu(t, u, at);
          return;
        }
        var st = M ? M(F, V, u + "", t, r, I) : n, ht = st === n;
        if (ht) {
          var Ct = Zt(V), Pt = !Ct && ai(V), Wt = !Ct && !Pt && oo(V);
          st = V, Ct || Pt || Wt ? Zt(F) ? st = F : He(F) ? st = gn(F) : Pt ? (ht = !1, st = zf(V, !0)) : Wt ? (ht = !1, st = qf(V, !0)) : st = [] : Zo(V) || Ti(V) ? (st = F, Ti(F) ? st = Ic(F) : (!Re(F) || Or(F)) && (st = ic(V))) : ht = !1;
        }
        ht && (I.set(V, st), T(st, V, y, M, I), I.delete(V)), Tu(t, u, st);
      }
      function Lf(t, r) {
        var u = t.length;
        if (u)
          return r += r < 0 ? u : 0, Dr(r, u) ? t[r] : n;
      }
      function kf(t, r, u) {
        r.length ? r = z(r, function(M) {
          return Zt(M) ? function(I) {
            return Ai(I, M.length === 1 ? M[0] : M);
          } : M;
        }) : r = [yn];
        var y = -1;
        r = z(r, Te(Ft()));
        var T = Sf(t, function(M, I, F) {
          var V = z(r, function(at) {
            return at(M);
          });
          return { criteria: V, index: ++y, value: M };
        });
        return Yi(T, function(M, I) {
          return ig(M, I, u);
        });
      }
      function Vp(t, r) {
        return Pf(t, r, function(u, y) {
          return ll(t, y);
        });
      }
      function Pf(t, r, u) {
        for (var y = -1, T = r.length, M = {}; ++y < T; ) {
          var I = r[y], F = Ai(t, I);
          u(F, I) && jo(M, ii(I, t), F);
        }
        return M;
      }
      function Xp(t) {
        return function(r) {
          return Ai(r, t);
        };
      }
      function Iu(t, r, u, y) {
        var T = y ? ar : De, M = -1, I = r.length, F = t;
        for (t === r && (r = gn(r)), u && (F = z(t, Te(u))); ++M < I; )
          for (var V = 0, at = r[M], st = u ? u(at) : at; (V = T(F, st, V, y)) > -1; )
            F !== t && te.call(F, V, 1), te.call(t, V, 1);
        return t;
      }
      function Nf(t, r) {
        for (var u = t ? r.length : 0, y = u - 1; u--; ) {
          var T = r[u];
          if (u == y || T !== M) {
            var M = T;
            Dr(T) ? te.call(t, T, 1) : qu(t, T);
          }
        }
        return t;
      }
      function Bu(t, r) {
        return t + je(cf() * (r - t + 1));
      }
      function jp(t, r, u, y) {
        for (var T = -1, M = Ue(fr((r - t) / (u || 1)), 0), I = Z(M); M--; )
          I[y ? M : ++T] = t, t += u;
        return I;
      }
      function Fu(t, r) {
        var u = "";
        if (!t || r < 1 || r > xt)
          return u;
        do
          r % 2 && (u += t), r = je(r / 2), r && (t += t);
        while (r);
        return u;
      }
      function re(t, r) {
        return el(sc(t, r, yn), t + "");
      }
      function Yp(t) {
        return pf(ao(t));
      }
      function Qp(t, r) {
        var u = ao(t);
        return vs(u, Ci(r, 0, u.length));
      }
      function jo(t, r, u, y) {
        if (!Re(t))
          return t;
        r = ii(r, t);
        for (var T = -1, M = r.length, I = M - 1, F = t; F != null && ++T < M; ) {
          var V = dr(r[T]), at = u;
          if (V === "__proto__" || V === "constructor" || V === "prototype")
            return t;
          if (T != I) {
            var st = F[V];
            at = y ? y(st, V, F) : n, at === n && (at = Re(st) ? st : Dr(r[T + 1]) ? [] : {});
          }
          Go(F, V, at), F = F[V];
        }
        return t;
      }
      var Mf = ts ? function(t, r) {
        return ts.set(t, r), t;
      } : yn, Kp = qe ? function(t, r) {
        return qe(t, "toString", {
          configurable: !0,
          enumerable: !1,
          value: cl(r),
          writable: !0
        });
      } : yn;
      function Zp(t) {
        return vs(ao(t));
      }
      function On(t, r, u) {
        var y = -1, T = t.length;
        r < 0 && (r = -r > T ? 0 : T + r), u = u > T ? T : u, u < 0 && (u += T), T = r > u ? 0 : u - r >>> 0, r >>>= 0;
        for (var M = Z(T); ++y < T; )
          M[y] = t[y + r];
        return M;
      }
      function Jp(t, r) {
        var u;
        return ni(t, function(y, T, M) {
          return u = r(y, T, M), !u;
        }), !!u;
      }
      function ss(t, r, u) {
        var y = 0, T = t == null ? y : t.length;
        if (typeof r == "number" && r === r && T <= le) {
          for (; y < T; ) {
            var M = y + T >>> 1, I = t[M];
            I !== null && !Cn(I) && (u ? I <= r : I < r) ? y = M + 1 : T = M;
          }
          return T;
        }
        return zu(t, r, yn, u);
      }
      function zu(t, r, u, y) {
        var T = 0, M = t == null ? 0 : t.length;
        if (M === 0)
          return 0;
        r = u(r);
        for (var I = r !== r, F = r === null, V = Cn(r), at = r === n; T < M; ) {
          var st = je((T + M) / 2), ht = u(t[st]), Ct = ht !== n, Pt = ht === null, Wt = ht === ht, ne = Cn(ht);
          if (I)
            var $t = y || Wt;
          else at ? $t = Wt && (y || Ct) : F ? $t = Wt && Ct && (y || !Pt) : V ? $t = Wt && Ct && !Pt && (y || !ne) : Pt || ne ? $t = !1 : $t = y ? ht <= r : ht < r;
          $t ? T = st + 1 : M = st;
        }
        return on(M, kt);
      }
      function Df(t, r) {
        for (var u = -1, y = t.length, T = 0, M = []; ++u < y; ) {
          var I = t[u], F = r ? r(I) : I;
          if (!u || !Zn(F, V)) {
            var V = F;
            M[T++] = I === 0 ? 0 : I;
          }
        }
        return M;
      }
      function Of(t) {
        return typeof t == "number" ? t : Cn(t) ? Lt : +t;
      }
      function _n(t) {
        if (typeof t == "string")
          return t;
        if (Zt(t))
          return z(t, _n) + "";
        if (Cn(t))
          return hf ? hf.call(t) : "";
        var r = t + "";
        return r == "0" && 1 / t == -lt ? "-0" : r;
      }
      function ri(t, r, u) {
        var y = -1, T = L, M = t.length, I = !0, F = [], V = F;
        if (u)
          I = !1, T = R;
        else if (M >= c) {
          var at = r ? null : fg(t);
          if (at)
            return Ki(at);
          I = !1, T = yi, V = new _i();
        } else
          V = r ? [] : F;
        t:
          for (; ++y < M; ) {
            var st = t[y], ht = r ? r(st) : st;
            if (st = u || st !== 0 ? st : 0, I && ht === ht) {
              for (var Ct = V.length; Ct--; )
                if (V[Ct] === ht)
                  continue t;
              r && V.push(ht), F.push(st);
            } else T(V, ht, u) || (V !== F && V.push(ht), F.push(st));
          }
        return F;
      }
      function qu(t, r) {
        return r = ii(r, t), t = uc(t, r), t == null || delete t[dr(Rn(r))];
      }
      function Rf(t, r, u, y) {
        return jo(t, r, u(Ai(t, r)), y);
      }
      function us(t, r, u, y) {
        for (var T = t.length, M = y ? T : -1; (y ? M-- : ++M < T) && r(t[M], M, t); )
          ;
        return u ? On(t, y ? 0 : M, y ? M + 1 : T) : On(t, y ? M + 1 : 0, y ? T : M);
      }
      function If(t, r) {
        var u = t;
        return u instanceof fe && (u = u.value()), X(r, function(y, T) {
          return T.func.apply(T.thisArg, H([y], T.args));
        }, u);
      }
      function Hu(t, r, u) {
        var y = t.length;
        if (y < 2)
          return y ? ri(t[0]) : [];
        for (var T = -1, M = Z(y); ++T < y; )
          for (var I = t[T], F = -1; ++F < y; )
            F != T && (M[T] = Uo(M[T] || I, t[F], r, u));
        return ri(Ze(M, 1), r, u);
      }
      function Bf(t, r, u) {
        for (var y = -1, T = t.length, M = r.length, I = {}; ++y < T; ) {
          var F = y < M ? r[y] : n;
          u(I, t[y], F);
        }
        return I;
      }
      function Wu(t) {
        return He(t) ? t : [];
      }
      function $u(t) {
        return typeof t == "function" ? t : yn;
      }
      function ii(t, r) {
        return Zt(t) ? t : Zu(t, r) ? [t] : hc(Ce(t));
      }
      var tg = re;
      function oi(t, r, u) {
        var y = t.length;
        return u = u === n ? y : u, !r && u >= y ? t : On(t, r, u);
      }
      var Ff = un || function(t) {
        return Fe.clearTimeout(t);
      };
      function zf(t, r) {
        if (r)
          return t.slice();
        var u = t.length, y = Nt ? Nt(u) : new t.constructor(u);
        return t.copy(y), y;
      }
      function Gu(t) {
        var r = new t.constructor(t.byteLength);
        return new gt(r).set(new gt(t)), r;
      }
      function eg(t, r) {
        var u = r ? Gu(t.buffer) : t.buffer;
        return new t.constructor(u, t.byteOffset, t.byteLength);
      }
      function ng(t) {
        var r = new t.constructor(t.source, ir.exec(t));
        return r.lastIndex = t.lastIndex, r;
      }
      function rg(t) {
        return $o ? ce($o.call(t)) : {};
      }
      function qf(t, r) {
        var u = r ? Gu(t.buffer) : t.buffer;
        return new t.constructor(u, t.byteOffset, t.length);
      }
      function Hf(t, r) {
        if (t !== r) {
          var u = t !== n, y = t === null, T = t === t, M = Cn(t), I = r !== n, F = r === null, V = r === r, at = Cn(r);
          if (!F && !at && !M && t > r || M && I && V && !F && !at || y && I && V || !u && V || !T)
            return 1;
          if (!y && !M && !at && t < r || at && u && T && !y && !M || F && u && T || !I && T || !V)
            return -1;
        }
        return 0;
      }
      function ig(t, r, u) {
        for (var y = -1, T = t.criteria, M = r.criteria, I = T.length, F = u.length; ++y < I; ) {
          var V = Hf(T[y], M[y]);
          if (V) {
            if (y >= F)
              return V;
            var at = u[y];
            return V * (at == "desc" ? -1 : 1);
          }
        }
        return t.index - r.index;
      }
      function Wf(t, r, u, y) {
        for (var T = -1, M = t.length, I = u.length, F = -1, V = r.length, at = Ue(M - I, 0), st = Z(V + at), ht = !y; ++F < V; )
          st[F] = r[F];
        for (; ++T < I; )
          (ht || T < M) && (st[u[T]] = t[T]);
        for (; at--; )
          st[F++] = t[T++];
        return st;
      }
      function $f(t, r, u, y) {
        for (var T = -1, M = t.length, I = -1, F = u.length, V = -1, at = r.length, st = Ue(M - F, 0), ht = Z(st + at), Ct = !y; ++T < st; )
          ht[T] = t[T];
        for (var Pt = T; ++V < at; )
          ht[Pt + V] = r[V];
        for (; ++I < F; )
          (Ct || T < M) && (ht[Pt + u[I]] = t[T++]);
        return ht;
      }
      function gn(t, r) {
        var u = -1, y = t.length;
        for (r || (r = Z(y)); ++u < y; )
          r[u] = t[u];
        return r;
      }
      function hr(t, r, u, y) {
        var T = !u;
        u || (u = {});
        for (var M = -1, I = r.length; ++M < I; ) {
          var F = r[M], V = y ? y(u[F], t[F], F, u, t) : n;
          V === n && (V = t[F]), T ? Pr(u, F, V) : Go(u, F, V);
        }
        return u;
      }
      function og(t, r) {
        return hr(t, Ku(t), r);
      }
      function ag(t, r) {
        return hr(t, nc(t), r);
      }
      function ls(t, r) {
        return function(u, y) {
          var T = Zt(u) ? s : Lp, M = r ? r() : {};
          return T(u, t, Ft(y, 2), M);
        };
      }
      function no(t) {
        return re(function(r, u) {
          var y = -1, T = u.length, M = T > 1 ? u[T - 1] : n, I = T > 2 ? u[2] : n;
          for (M = t.length > 3 && typeof M == "function" ? (T--, M) : n, I && fn(u[0], u[1], I) && (M = T < 3 ? n : M, T = 1), r = ce(r); ++y < T; ) {
            var F = u[y];
            F && t(r, F, y, M);
          }
          return r;
        });
      }
      function Gf(t, r) {
        return function(u, y) {
          if (u == null)
            return u;
          if (!vn(u))
            return t(u, y);
          for (var T = u.length, M = r ? T : -1, I = ce(u); (r ? M-- : ++M < T) && y(I[M], M, I) !== !1; )
            ;
          return u;
        };
      }
      function Uf(t) {
        return function(r, u, y) {
          for (var T = -1, M = ce(r), I = y(r), F = I.length; F--; ) {
            var V = I[t ? F : ++T];
            if (u(M[V], V, M) === !1)
              break;
          }
          return r;
        };
      }
      function sg(t, r, u) {
        var y = r & k, T = Yo(t);
        function M() {
          var I = this && this !== Fe && this instanceof M ? T : t;
          return I.apply(y ? u : this, arguments);
        }
        return M;
      }
      function Vf(t) {
        return function(r) {
          r = Ce(r);
          var u = ur(r) ? Qe(r) : n, y = u ? u[0] : r.charAt(0), T = u ? oi(u, 1).join("") : r.slice(1);
          return y[t]() + T;
        };
      }
      function ro(t) {
        return function(r) {
          return X(Gc($c(r).replace(za, "")), t, "");
        };
      }
      function Yo(t) {
        return function() {
          var r = arguments;
          switch (r.length) {
            case 0:
              return new t();
            case 1:
              return new t(r[0]);
            case 2:
              return new t(r[0], r[1]);
            case 3:
              return new t(r[0], r[1], r[2]);
            case 4:
              return new t(r[0], r[1], r[2], r[3]);
            case 5:
              return new t(r[0], r[1], r[2], r[3], r[4]);
            case 6:
              return new t(r[0], r[1], r[2], r[3], r[4], r[5]);
            case 7:
              return new t(r[0], r[1], r[2], r[3], r[4], r[5], r[6]);
          }
          var u = eo(t.prototype), y = t.apply(u, r);
          return Re(y) ? y : u;
        };
      }
      function ug(t, r, u) {
        var y = Yo(t);
        function T() {
          for (var M = arguments.length, I = Z(M), F = M, V = io(T); F--; )
            I[F] = arguments[F];
          var at = M < 3 && I[0] !== V && I[M - 1] !== V ? [] : lr(I, V);
          if (M -= at.length, M < u)
            return Kf(
              t,
              r,
              fs,
              T.placeholder,
              n,
              I,
              at,
              n,
              n,
              u - M
            );
          var st = this && this !== Fe && this instanceof T ? y : t;
          return i(st, this, I);
        }
        return T;
      }
      function Xf(t) {
        return function(r, u, y) {
          var T = ce(r);
          if (!vn(r)) {
            var M = Ft(u, 3);
            r = Ye(r), u = function(F) {
              return M(T[F], F, T);
            };
          }
          var I = t(r, u, y);
          return I > -1 ? T[M ? r[I] : I] : n;
        };
      }
      function jf(t) {
        return Mr(function(r) {
          var u = r.length, y = u, T = Mn.prototype.thru;
          for (t && r.reverse(); y--; ) {
            var M = r[y];
            if (typeof M != "function")
              throw new Ke(g);
            if (T && !I && ps(M) == "wrapper")
              var I = new Mn([], !0);
          }
          for (y = I ? y : u; ++y < u; ) {
            M = r[y];
            var F = ps(M), V = F == "wrapper" ? Yu(M) : n;
            V && Ju(V[0]) && V[1] == (et | q | U | yt) && !V[4].length && V[9] == 1 ? I = I[ps(V[0])].apply(I, V[3]) : I = M.length == 1 && Ju(M) ? I[F]() : I.thru(M);
          }
          return function() {
            var at = arguments, st = at[0];
            if (I && at.length == 1 && Zt(st))
              return I.plant(st).value();
            for (var ht = 0, Ct = u ? r[ht].apply(this, at) : st; ++ht < u; )
              Ct = r[ht].call(this, Ct);
            return Ct;
          };
        });
      }
      function fs(t, r, u, y, T, M, I, F, V, at) {
        var st = r & et, ht = r & k, Ct = r & O, Pt = r & (q | P), Wt = r & _t, ne = Ct ? n : Yo(t);
        function $t() {
          for (var ue = arguments.length, he = Z(ue), An = ue; An--; )
            he[An] = arguments[An];
          if (Pt)
            var cn = io($t), Sn = Sr(he, cn);
          if (y && (he = Wf(he, y, T, Pt)), M && (he = $f(he, M, I, Pt)), ue -= Sn, Pt && ue < at) {
            var We = lr(he, cn);
            return Kf(
              t,
              r,
              fs,
              $t.placeholder,
              u,
              he,
              We,
              F,
              V,
              at - ue
            );
          }
          var Jn = ht ? u : this, Ir = Ct ? Jn[t] : t;
          return ue = he.length, F ? he = Lg(he, F) : Wt && ue > 1 && he.reverse(), st && V < ue && (he.length = V), this && this !== Fe && this instanceof $t && (Ir = ne || Yo(Ir)), Ir.apply(Jn, he);
        }
        return $t;
      }
      function Yf(t, r) {
        return function(u, y) {
          return Ip(u, t, r(y), {});
        };
      }
      function cs(t, r) {
        return function(u, y) {
          var T;
          if (u === n && y === n)
            return r;
          if (u !== n && (T = u), y !== n) {
            if (T === n)
              return y;
            typeof u == "string" || typeof y == "string" ? (u = _n(u), y = _n(y)) : (u = Of(u), y = Of(y)), T = t(u, y);
          }
          return T;
        };
      }
      function Uu(t) {
        return Mr(function(r) {
          return r = z(r, Te(Ft())), re(function(u) {
            var y = this;
            return t(r, function(T) {
              return i(T, y, u);
            });
          });
        });
      }
      function hs(t, r) {
        r = r === n ? " " : _n(r);
        var u = r.length;
        if (u < 2)
          return u ? Fu(r, t) : r;
        var y = Fu(r, fr(t / Zr(r)));
        return ur(r) ? oi(Qe(y), 0, t).join("") : y.slice(0, t);
      }
      function lg(t, r, u, y) {
        var T = r & k, M = Yo(t);
        function I() {
          for (var F = -1, V = arguments.length, at = -1, st = y.length, ht = Z(st + V), Ct = this && this !== Fe && this instanceof I ? M : t; ++at < st; )
            ht[at] = y[at];
          for (; V--; )
            ht[at++] = arguments[++F];
          return i(Ct, T ? u : this, ht);
        }
        return I;
      }
      function Qf(t) {
        return function(r, u, y) {
          return y && typeof y != "number" && fn(r, u, y) && (u = y = n), r = Rr(r), u === n ? (u = r, r = 0) : u = Rr(u), y = y === n ? r < u ? 1 : -1 : Rr(y), jp(r, u, y, t);
        };
      }
      function ds(t) {
        return function(r, u) {
          return typeof r == "string" && typeof u == "string" || (r = In(r), u = In(u)), t(r, u);
        };
      }
      function Kf(t, r, u, y, T, M, I, F, V, at) {
        var st = r & q, ht = st ? I : n, Ct = st ? n : I, Pt = st ? M : n, Wt = st ? n : M;
        r |= st ? U : Q, r &= ~(st ? Q : U), r & G || (r &= ~(k | O));
        var ne = [
          t,
          r,
          T,
          Pt,
          ht,
          Wt,
          Ct,
          F,
          V,
          at
        ], $t = u.apply(n, ne);
        return Ju(t) && lc($t, ne), $t.placeholder = y, fc($t, t, r);
      }
      function Vu(t) {
        var r = ze[t];
        return function(u, y) {
          if (u = In(u), y = y == null ? 0 : on(ee(y), 292), y && ff(u)) {
            var T = (Ce(u) + "e").split("e"), M = r(T[0] + "e" + (+T[1] + y));
            return T = (Ce(M) + "e").split("e"), +(T[0] + "e" + (+T[1] - y));
          }
          return r(u);
        };
      }
      var fg = Ji && 1 / Ki(new Ji([, -0]))[1] == lt ? function(t) {
        return new Ji(t);
      } : pl;
      function Zf(t) {
        return function(r) {
          var u = an(r);
          return u == dt ? Bo(r) : u == Oe ? Qa(r) : sr(r, t(r));
        };
      }
      function Nr(t, r, u, y, T, M, I, F) {
        var V = r & O;
        if (!V && typeof t != "function")
          throw new Ke(g);
        var at = y ? y.length : 0;
        if (at || (r &= ~(U | Q), y = T = n), I = I === n ? I : Ue(ee(I), 0), F = F === n ? F : ee(F), at -= T ? T.length : 0, r & Q) {
          var st = y, ht = T;
          y = T = n;
        }
        var Ct = V ? n : Yu(t), Pt = [
          t,
          r,
          u,
          y,
          T,
          st,
          ht,
          M,
          I,
          F
        ];
        if (Ct && Sg(Pt, Ct), t = Pt[0], r = Pt[1], u = Pt[2], y = Pt[3], T = Pt[4], F = Pt[9] = Pt[9] === n ? V ? 0 : t.length : Ue(Pt[9] - at, 0), !F && r & (q | P) && (r &= ~(q | P)), !r || r == k)
          var Wt = sg(t, r, u);
        else r == q || r == P ? Wt = ug(t, r, F) : (r == U || r == (k | U)) && !T.length ? Wt = lg(t, r, u, y) : Wt = fs.apply(n, Pt);
        var ne = Ct ? Mf : lc;
        return fc(ne(Wt, Pt), t, r);
      }
      function Jf(t, r, u, y) {
        return t === n || Zn(t, ti[u]) && !me.call(y, u) ? r : t;
      }
      function tc(t, r, u, y, T, M) {
        return Re(t) && Re(r) && (M.set(r, t), as(t, r, n, tc, M), M.delete(r)), t;
      }
      function cg(t) {
        return Zo(t) ? n : t;
      }
      function ec(t, r, u, y, T, M) {
        var I = u & a, F = t.length, V = r.length;
        if (F != V && !(I && V > F))
          return !1;
        var at = M.get(t), st = M.get(r);
        if (at && st)
          return at == r && st == t;
        var ht = -1, Ct = !0, Pt = u & E ? new _i() : n;
        for (M.set(t, r), M.set(r, t); ++ht < F; ) {
          var Wt = t[ht], ne = r[ht];
          if (y)
            var $t = I ? y(ne, Wt, ht, r, t, M) : y(Wt, ne, ht, t, r, M);
          if ($t !== n) {
            if ($t)
              continue;
            Ct = !1;
            break;
          }
          if (Pt) {
            if (!mt(r, function(ue, he) {
              if (!yi(Pt, he) && (Wt === ue || T(Wt, ue, u, y, M)))
                return Pt.push(he);
            })) {
              Ct = !1;
              break;
            }
          } else if (!(Wt === ne || T(Wt, ne, u, y, M))) {
            Ct = !1;
            break;
          }
        }
        return M.delete(t), M.delete(r), Ct;
      }
      function hg(t, r, u, y, T, M, I) {
        switch (u) {
          case dn:
            if (t.byteLength != r.byteLength || t.byteOffset != r.byteOffset)
              return !1;
            t = t.buffer, r = r.buffer;
          case kn:
            return !(t.byteLength != r.byteLength || !M(new gt(t), new gt(r)));
          case Yt:
          case Be:
          case vt:
            return Zn(+t, +r);
          case ye:
            return t.name == r.name && t.message == r.message;
          case ke:
          case Me:
            return t == r + "";
          case dt:
            var F = Bo;
          case Oe:
            var V = y & a;
            if (F || (F = Ki), t.size != r.size && !V)
              return !1;
            var at = I.get(t);
            if (at)
              return at == r;
            y |= E, I.set(t, r);
            var st = ec(F(t), F(r), y, T, M, I);
            return I.delete(t), st;
          case Ae:
            if ($o)
              return $o.call(t) == $o.call(r);
        }
        return !1;
      }
      function dg(t, r, u, y, T, M) {
        var I = u & a, F = Xu(t), V = F.length, at = Xu(r), st = at.length;
        if (V != st && !I)
          return !1;
        for (var ht = V; ht--; ) {
          var Ct = F[ht];
          if (!(I ? Ct in r : me.call(r, Ct)))
            return !1;
        }
        var Pt = M.get(t), Wt = M.get(r);
        if (Pt && Wt)
          return Pt == r && Wt == t;
        var ne = !0;
        M.set(t, r), M.set(r, t);
        for (var $t = I; ++ht < V; ) {
          Ct = F[ht];
          var ue = t[Ct], he = r[Ct];
          if (y)
            var An = I ? y(he, ue, Ct, r, t, M) : y(ue, he, Ct, t, r, M);
          if (!(An === n ? ue === he || T(ue, he, u, y, M) : An)) {
            ne = !1;
            break;
          }
          $t || ($t = Ct == "constructor");
        }
        if (ne && !$t) {
          var cn = t.constructor, Sn = r.constructor;
          cn != Sn && "constructor" in t && "constructor" in r && !(typeof cn == "function" && cn instanceof cn && typeof Sn == "function" && Sn instanceof Sn) && (ne = !1);
        }
        return M.delete(t), M.delete(r), ne;
      }
      function Mr(t) {
        return el(sc(t, n, vc), t + "");
      }
      function Xu(t) {
        return xf(t, Ye, Ku);
      }
      function ju(t) {
        return xf(t, mn, nc);
      }
      var Yu = ts ? function(t) {
        return ts.get(t);
      } : pl;
      function ps(t) {
        for (var r = t.name + "", u = to[r], y = me.call(to, r) ? u.length : 0; y--; ) {
          var T = u[y], M = T.func;
          if (M == null || M == t)
            return T.name;
        }
        return r;
      }
      function io(t) {
        var r = me.call(N, "placeholder") ? N : t;
        return r.placeholder;
      }
      function Ft() {
        var t = N.iteratee || hl;
        return t = t === hl ? Af : t, arguments.length ? t(arguments[0], arguments[1]) : t;
      }
      function gs(t, r) {
        var u = t.__data__;
        return xg(r) ? u[typeof r == "string" ? "string" : "hash"] : u.map;
      }
      function Qu(t) {
        for (var r = Ye(t), u = r.length; u--; ) {
          var y = r[u], T = t[y];
          r[u] = [y, T, oc(T)];
        }
        return r;
      }
      function Si(t, r) {
        var u = ja(t, r);
        return Cf(u) ? u : n;
      }
      function pg(t) {
        var r = me.call(t, Le), u = t[Le];
        try {
          t[Le] = n;
          var y = !0;
        } catch {
        }
        var T = B.call(t);
        return y && (r ? t[Le] = u : delete t[Le]), T;
      }
      var Ku = Au ? function(t) {
        return t == null ? [] : (t = ce(t), A(Au(t), function(r) {
          return Ht.call(t, r);
        }));
      } : gl, nc = Au ? function(t) {
        for (var r = []; t; )
          H(r, Ku(t)), t = Gt(t);
        return r;
      } : gl, an = ln;
      (Su && an(new Su(new ArrayBuffer(1))) != dn || qo && an(new qo()) != dt || Eu && an(Eu.resolve()) != xe || Ji && an(new Ji()) != Oe || Ho && an(new Ho()) != Ln) && (an = function(t) {
        var r = ln(t), u = r == pe ? t.constructor : n, y = u ? Ei(u) : "";
        if (y)
          switch (y) {
            case Qd:
              return dn;
            case Kd:
              return dt;
            case Zd:
              return xe;
            case Jd:
              return Oe;
            case tp:
              return Ln;
          }
        return r;
      });
      function gg(t, r, u) {
        for (var y = -1, T = u.length; ++y < T; ) {
          var M = u[y], I = M.size;
          switch (M.type) {
            case "drop":
              t += I;
              break;
            case "dropRight":
              r -= I;
              break;
            case "take":
              r = on(r, t + I);
              break;
            case "takeRight":
              t = Ue(t, r - I);
              break;
          }
        }
        return { start: t, end: r };
      }
      function vg(t) {
        var r = t.match(_a);
        return r ? r[1].split(Fi) : [];
      }
      function rc(t, r, u) {
        r = ii(r, t);
        for (var y = -1, T = r.length, M = !1; ++y < T; ) {
          var I = dr(r[y]);
          if (!(M = t != null && u(t, I)))
            break;
          t = t[I];
        }
        return M || ++y != T ? M : (T = t == null ? 0 : t.length, !!T && _s(T) && Dr(I, T) && (Zt(t) || Ti(t)));
      }
      function mg(t) {
        var r = t.length, u = new t.constructor(r);
        return r && typeof t[0] == "string" && me.call(t, "index") && (u.index = t.index, u.input = t.input), u;
      }
      function ic(t) {
        return typeof t.constructor == "function" && !Qo(t) ? eo(Gt(t)) : {};
      }
      function yg(t, r, u) {
        var y = t.constructor;
        switch (r) {
          case kn:
            return Gu(t);
          case Yt:
          case Be:
            return new y(+t);
          case dn:
            return eg(t, u);
          case wr:
          case li:
          case fi:
          case Wr:
          case $r:
          case it:
          case St:
          case Rt:
          case ae:
            return qf(t, u);
          case dt:
            return new y();
          case vt:
          case Me:
            return new y(t);
          case ke:
            return ng(t);
          case Oe:
            return new y();
          case Ae:
            return rg(t);
        }
      }
      function bg(t, r) {
        var u = r.length;
        if (!u)
          return t;
        var y = u - 1;
        return r[y] = (u > 1 ? "& " : "") + r[y], r = r.join(u > 2 ? ", " : " "), t.replace(xa, `{
/* [wrapped with ` + r + `] */
`);
      }
      function wg(t) {
        return Zt(t) || Ti(t) || !!(be && t && t[be]);
      }
      function Dr(t, r) {
        var u = typeof t;
        return r = r ?? xt, !!r && (u == "number" || u != "symbol" && au.test(t)) && t > -1 && t % 1 == 0 && t < r;
      }
      function fn(t, r, u) {
        if (!Re(u))
          return !1;
        var y = typeof r;
        return (y == "number" ? vn(u) && Dr(r, u.length) : y == "string" && r in u) ? Zn(u[r], t) : !1;
      }
      function Zu(t, r) {
        if (Zt(t))
          return !1;
        var u = typeof t;
        return u == "number" || u == "symbol" || u == "boolean" || t == null || Cn(t) ? !0 : xr.test(t) || !Ur.test(t) || r != null && t in ce(r);
      }
      function xg(t) {
        var r = typeof t;
        return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? t !== "__proto__" : t === null;
      }
      function Ju(t) {
        var r = ps(t), u = N[r];
        if (typeof u != "function" || !(r in fe.prototype))
          return !1;
        if (t === u)
          return !0;
        var y = Yu(u);
        return !!y && t === y[0];
      }
      function _g(t) {
        return !!D && D in t;
      }
      var Cg = Tr ? Or : vl;
      function Qo(t) {
        var r = t && t.constructor, u = typeof r == "function" && r.prototype || ti;
        return t === u;
      }
      function oc(t) {
        return t === t && !Re(t);
      }
      function ac(t, r) {
        return function(u) {
          return u == null ? !1 : u[t] === r && (r !== n || t in ce(u));
        };
      }
      function Ag(t) {
        var r = ws(t, function(y) {
          return u.size === v && u.clear(), y;
        }), u = r.cache;
        return r;
      }
      function Sg(t, r) {
        var u = t[1], y = r[1], T = u | y, M = T < (k | O | et), I = y == et && u == q || y == et && u == yt && t[7].length <= r[8] || y == (et | yt) && r[7].length <= r[8] && u == q;
        if (!(M || I))
          return t;
        y & k && (t[2] = r[2], T |= u & k ? 0 : G);
        var F = r[3];
        if (F) {
          var V = t[3];
          t[3] = V ? Wf(V, F, r[4]) : F, t[4] = V ? lr(t[3], S) : r[4];
        }
        return F = r[5], F && (V = t[5], t[5] = V ? $f(V, F, r[6]) : F, t[6] = V ? lr(t[5], S) : r[6]), F = r[7], F && (t[7] = F), y & et && (t[8] = t[8] == null ? r[8] : on(t[8], r[8])), t[9] == null && (t[9] = r[9]), t[0] = r[0], t[1] = T, t;
      }
      function Eg(t) {
        var r = [];
        if (t != null)
          for (var u in ce(t))
            r.push(u);
        return r;
      }
      function Tg(t) {
        return B.call(t);
      }
      function sc(t, r, u) {
        return r = Ue(r === n ? t.length - 1 : r, 0), function() {
          for (var y = arguments, T = -1, M = Ue(y.length - r, 0), I = Z(M); ++T < M; )
            I[T] = y[r + T];
          T = -1;
          for (var F = Z(r + 1); ++T < r; )
            F[T] = y[T];
          return F[r] = u(I), i(t, this, F);
        };
      }
      function uc(t, r) {
        return r.length < 2 ? t : Ai(t, On(r, 0, -1));
      }
      function Lg(t, r) {
        for (var u = t.length, y = on(r.length, u), T = gn(t); y--; ) {
          var M = r[y];
          t[y] = Dr(M, u) ? T[M] : n;
        }
        return t;
      }
      function tl(t, r) {
        if (!(r === "constructor" && typeof t[r] == "function") && r != "__proto__")
          return t[r];
      }
      var lc = cc(Mf), Ko = wi || function(t, r) {
        return Fe.setTimeout(t, r);
      }, el = cc(Kp);
      function fc(t, r, u) {
        var y = r + "";
        return el(t, bg(y, kg(vg(y), u)));
      }
      function cc(t) {
        var r = 0, u = 0;
        return function() {
          var y = Xd(), T = Bt - (y - u);
          if (u = y, T > 0) {
            if (++r >= jt)
              return arguments[0];
          } else
            r = 0;
          return t.apply(n, arguments);
        };
      }
      function vs(t, r) {
        var u = -1, y = t.length, T = y - 1;
        for (r = r === n ? y : r; ++u < r; ) {
          var M = Bu(u, T), I = t[M];
          t[M] = t[u], t[u] = I;
        }
        return t.length = r, t;
      }
      var hc = Ag(function(t) {
        var r = [];
        return t.charCodeAt(0) === 46 && r.push(""), t.replace(wa, function(u, y, T, M) {
          r.push(T ? M.replace(Co, "$1") : y || u);
        }), r;
      });
      function dr(t) {
        if (typeof t == "string" || Cn(t))
          return t;
        var r = t + "";
        return r == "0" && 1 / t == -lt ? "-0" : r;
      }
      function Ei(t) {
        if (t != null) {
          try {
            return ei.call(t);
          } catch {
          }
          try {
            return t + "";
          } catch {
          }
        }
        return "";
      }
      function kg(t, r) {
        return f(zt, function(u) {
          var y = "_." + u[0];
          r & u[1] && !L(t, y) && t.push(y);
        }), t.sort();
      }
      function dc(t) {
        if (t instanceof fe)
          return t.clone();
        var r = new Mn(t.__wrapped__, t.__chain__);
        return r.__actions__ = gn(t.__actions__), r.__index__ = t.__index__, r.__values__ = t.__values__, r;
      }
      function Pg(t, r, u) {
        (u ? fn(t, r, u) : r === n) ? r = 1 : r = Ue(ee(r), 0);
        var y = t == null ? 0 : t.length;
        if (!y || r < 1)
          return [];
        for (var T = 0, M = 0, I = Z(fr(y / r)); T < y; )
          I[M++] = On(t, T, T += r);
        return I;
      }
      function Ng(t) {
        for (var r = -1, u = t == null ? 0 : t.length, y = 0, T = []; ++r < u; ) {
          var M = t[r];
          M && (T[y++] = M);
        }
        return T;
      }
      function Mg() {
        var t = arguments.length;
        if (!t)
          return [];
        for (var r = Z(t - 1), u = arguments[0], y = t; y--; )
          r[y - 1] = arguments[y];
        return H(Zt(u) ? gn(u) : [u], Ze(r, 1));
      }
      var Dg = re(function(t, r) {
        return He(t) ? Uo(t, Ze(r, 1, He, !0)) : [];
      }), Og = re(function(t, r) {
        var u = Rn(r);
        return He(u) && (u = n), He(t) ? Uo(t, Ze(r, 1, He, !0), Ft(u, 2)) : [];
      }), Rg = re(function(t, r) {
        var u = Rn(r);
        return He(u) && (u = n), He(t) ? Uo(t, Ze(r, 1, He, !0), n, u) : [];
      });
      function Ig(t, r, u) {
        var y = t == null ? 0 : t.length;
        return y ? (r = u || r === n ? 1 : ee(r), On(t, r < 0 ? 0 : r, y)) : [];
      }
      function Bg(t, r, u) {
        var y = t == null ? 0 : t.length;
        return y ? (r = u || r === n ? 1 : ee(r), r = y - r, On(t, 0, r < 0 ? 0 : r)) : [];
      }
      function Fg(t, r) {
        return t && t.length ? us(t, Ft(r, 3), !0, !0) : [];
      }
      function zg(t, r) {
        return t && t.length ? us(t, Ft(r, 3), !0) : [];
      }
      function qg(t, r, u, y) {
        var T = t == null ? 0 : t.length;
        return T ? (u && typeof u != "number" && fn(t, r, u) && (u = 0, y = T), Mp(t, r, u, y)) : [];
      }
      function pc(t, r, u) {
        var y = t == null ? 0 : t.length;
        if (!y)
          return -1;
        var T = u == null ? 0 : ee(u);
        return T < 0 && (T = Ue(y + T, 0)), Xe(t, Ft(r, 3), T);
      }
      function gc(t, r, u) {
        var y = t == null ? 0 : t.length;
        if (!y)
          return -1;
        var T = y - 1;
        return u !== n && (T = ee(u), T = u < 0 ? Ue(y + T, 0) : on(T, y - 1)), Xe(t, Ft(r, 3), T, !0);
      }
      function vc(t) {
        var r = t == null ? 0 : t.length;
        return r ? Ze(t, 1) : [];
      }
      function Hg(t) {
        var r = t == null ? 0 : t.length;
        return r ? Ze(t, lt) : [];
      }
      function Wg(t, r) {
        var u = t == null ? 0 : t.length;
        return u ? (r = r === n ? 1 : ee(r), Ze(t, r)) : [];
      }
      function $g(t) {
        for (var r = -1, u = t == null ? 0 : t.length, y = {}; ++r < u; ) {
          var T = t[r];
          y[T[0]] = T[1];
        }
        return y;
      }
      function mc(t) {
        return t && t.length ? t[0] : n;
      }
      function Gg(t, r, u) {
        var y = t == null ? 0 : t.length;
        if (!y)
          return -1;
        var T = u == null ? 0 : ee(u);
        return T < 0 && (T = Ue(y + T, 0)), De(t, r, T);
      }
      function Ug(t) {
        var r = t == null ? 0 : t.length;
        return r ? On(t, 0, -1) : [];
      }
      var Vg = re(function(t) {
        var r = z(t, Wu);
        return r.length && r[0] === t[0] ? Mu(r) : [];
      }), Xg = re(function(t) {
        var r = Rn(t), u = z(t, Wu);
        return r === Rn(u) ? r = n : u.pop(), u.length && u[0] === t[0] ? Mu(u, Ft(r, 2)) : [];
      }), jg = re(function(t) {
        var r = Rn(t), u = z(t, Wu);
        return r = typeof r == "function" ? r : n, r && u.pop(), u.length && u[0] === t[0] ? Mu(u, n, r) : [];
      });
      function Yg(t, r) {
        return t == null ? "" : Ud.call(t, r);
      }
      function Rn(t) {
        var r = t == null ? 0 : t.length;
        return r ? t[r - 1] : n;
      }
      function Qg(t, r, u) {
        var y = t == null ? 0 : t.length;
        if (!y)
          return -1;
        var T = y;
        return u !== n && (T = ee(u), T = T < 0 ? Ue(y + T, 0) : on(T, y - 1)), r === r ? xu(t, r, T) : Xe(t, Tt, T, !0);
      }
      function Kg(t, r) {
        return t && t.length ? Lf(t, ee(r)) : n;
      }
      var Zg = re(yc);
      function yc(t, r) {
        return t && t.length && r && r.length ? Iu(t, r) : t;
      }
      function Jg(t, r, u) {
        return t && t.length && r && r.length ? Iu(t, r, Ft(u, 2)) : t;
      }
      function tv(t, r, u) {
        return t && t.length && r && r.length ? Iu(t, r, n, u) : t;
      }
      var ev = Mr(function(t, r) {
        var u = t == null ? 0 : t.length, y = Lu(t, r);
        return Nf(t, z(r, function(T) {
          return Dr(T, u) ? +T : T;
        }).sort(Hf)), y;
      });
      function nv(t, r) {
        var u = [];
        if (!(t && t.length))
          return u;
        var y = -1, T = [], M = t.length;
        for (r = Ft(r, 3); ++y < M; ) {
          var I = t[y];
          r(I, y, t) && (u.push(I), T.push(y));
        }
        return Nf(t, T), u;
      }
      function nl(t) {
        return t == null ? t : Yd.call(t);
      }
      function rv(t, r, u) {
        var y = t == null ? 0 : t.length;
        return y ? (u && typeof u != "number" && fn(t, r, u) ? (r = 0, u = y) : (r = r == null ? 0 : ee(r), u = u === n ? y : ee(u)), On(t, r, u)) : [];
      }
      function iv(t, r) {
        return ss(t, r);
      }
      function ov(t, r, u) {
        return zu(t, r, Ft(u, 2));
      }
      function av(t, r) {
        var u = t == null ? 0 : t.length;
        if (u) {
          var y = ss(t, r);
          if (y < u && Zn(t[y], r))
            return y;
        }
        return -1;
      }
      function sv(t, r) {
        return ss(t, r, !0);
      }
      function uv(t, r, u) {
        return zu(t, r, Ft(u, 2), !0);
      }
      function lv(t, r) {
        var u = t == null ? 0 : t.length;
        if (u) {
          var y = ss(t, r, !0) - 1;
          if (Zn(t[y], r))
            return y;
        }
        return -1;
      }
      function fv(t) {
        return t && t.length ? Df(t) : [];
      }
      function cv(t, r) {
        return t && t.length ? Df(t, Ft(r, 2)) : [];
      }
      function hv(t) {
        var r = t == null ? 0 : t.length;
        return r ? On(t, 1, r) : [];
      }
      function dv(t, r, u) {
        return t && t.length ? (r = u || r === n ? 1 : ee(r), On(t, 0, r < 0 ? 0 : r)) : [];
      }
      function pv(t, r, u) {
        var y = t == null ? 0 : t.length;
        return y ? (r = u || r === n ? 1 : ee(r), r = y - r, On(t, r < 0 ? 0 : r, y)) : [];
      }
      function gv(t, r) {
        return t && t.length ? us(t, Ft(r, 3), !1, !0) : [];
      }
      function vv(t, r) {
        return t && t.length ? us(t, Ft(r, 3)) : [];
      }
      var mv = re(function(t) {
        return ri(Ze(t, 1, He, !0));
      }), yv = re(function(t) {
        var r = Rn(t);
        return He(r) && (r = n), ri(Ze(t, 1, He, !0), Ft(r, 2));
      }), bv = re(function(t) {
        var r = Rn(t);
        return r = typeof r == "function" ? r : n, ri(Ze(t, 1, He, !0), n, r);
      });
      function wv(t) {
        return t && t.length ? ri(t) : [];
      }
      function xv(t, r) {
        return t && t.length ? ri(t, Ft(r, 2)) : [];
      }
      function _v(t, r) {
        return r = typeof r == "function" ? r : n, t && t.length ? ri(t, n, r) : [];
      }
      function rl(t) {
        if (!(t && t.length))
          return [];
        var r = 0;
        return t = A(t, function(u) {
          if (He(u))
            return r = Ue(u.length, r), !0;
        }), Vn(r, function(u) {
          return z(t, Kt(u));
        });
      }
      function bc(t, r) {
        if (!(t && t.length))
          return [];
        var u = rl(t);
        return r == null ? u : z(u, function(y) {
          return i(r, n, y);
        });
      }
      var Cv = re(function(t, r) {
        return He(t) ? Uo(t, r) : [];
      }), Av = re(function(t) {
        return Hu(A(t, He));
      }), Sv = re(function(t) {
        var r = Rn(t);
        return He(r) && (r = n), Hu(A(t, He), Ft(r, 2));
      }), Ev = re(function(t) {
        var r = Rn(t);
        return r = typeof r == "function" ? r : n, Hu(A(t, He), n, r);
      }), Tv = re(rl);
      function Lv(t, r) {
        return Bf(t || [], r || [], Go);
      }
      function kv(t, r) {
        return Bf(t || [], r || [], jo);
      }
      var Pv = re(function(t) {
        var r = t.length, u = r > 1 ? t[r - 1] : n;
        return u = typeof u == "function" ? (t.pop(), u) : n, bc(t, u);
      });
      function wc(t) {
        var r = N(t);
        return r.__chain__ = !0, r;
      }
      function Nv(t, r) {
        return r(t), t;
      }
      function ms(t, r) {
        return r(t);
      }
      var Mv = Mr(function(t) {
        var r = t.length, u = r ? t[0] : 0, y = this.__wrapped__, T = function(M) {
          return Lu(M, t);
        };
        return r > 1 || this.__actions__.length || !(y instanceof fe) || !Dr(u) ? this.thru(T) : (y = y.slice(u, +u + (r ? 1 : 0)), y.__actions__.push({
          func: ms,
          args: [T],
          thisArg: n
        }), new Mn(y, this.__chain__).thru(function(M) {
          return r && !M.length && M.push(n), M;
        }));
      });
      function Dv() {
        return wc(this);
      }
      function Ov() {
        return new Mn(this.value(), this.__chain__);
      }
      function Rv() {
        this.__values__ === n && (this.__values__ = Oc(this.value()));
        var t = this.__index__ >= this.__values__.length, r = t ? n : this.__values__[this.__index__++];
        return { done: t, value: r };
      }
      function Iv() {
        return this;
      }
      function Bv(t) {
        for (var r, u = this; u instanceof ns; ) {
          var y = dc(u);
          y.__index__ = 0, y.__values__ = n, r ? T.__wrapped__ = y : r = y;
          var T = y;
          u = u.__wrapped__;
        }
        return T.__wrapped__ = t, r;
      }
      function Fv() {
        var t = this.__wrapped__;
        if (t instanceof fe) {
          var r = t;
          return this.__actions__.length && (r = new fe(this)), r = r.reverse(), r.__actions__.push({
            func: ms,
            args: [nl],
            thisArg: n
          }), new Mn(r, this.__chain__);
        }
        return this.thru(nl);
      }
      function zv() {
        return If(this.__wrapped__, this.__actions__);
      }
      var qv = ls(function(t, r, u) {
        me.call(t, u) ? ++t[u] : Pr(t, u, 1);
      });
      function Hv(t, r, u) {
        var y = Zt(t) ? C : Np;
        return u && fn(t, r, u) && (r = n), y(t, Ft(r, 3));
      }
      function Wv(t, r) {
        var u = Zt(t) ? A : bf;
        return u(t, Ft(r, 3));
      }
      var $v = Xf(pc), Gv = Xf(gc);
      function Uv(t, r) {
        return Ze(ys(t, r), 1);
      }
      function Vv(t, r) {
        return Ze(ys(t, r), lt);
      }
      function Xv(t, r, u) {
        return u = u === n ? 1 : ee(u), Ze(ys(t, r), u);
      }
      function xc(t, r) {
        var u = Zt(t) ? f : ni;
        return u(t, Ft(r, 3));
      }
      function _c(t, r) {
        var u = Zt(t) ? d : yf;
        return u(t, Ft(r, 3));
      }
      var jv = ls(function(t, r, u) {
        me.call(t, u) ? t[u].push(r) : Pr(t, u, [r]);
      });
      function Yv(t, r, u, y) {
        t = vn(t) ? t : ao(t), u = u && !y ? ee(u) : 0;
        var T = t.length;
        return u < 0 && (u = Ue(T + u, 0)), Cs(t) ? u <= T && t.indexOf(r, u) > -1 : !!T && De(t, r, u) > -1;
      }
      var Qv = re(function(t, r, u) {
        var y = -1, T = typeof r == "function", M = vn(t) ? Z(t.length) : [];
        return ni(t, function(I) {
          M[++y] = T ? i(r, I, u) : Vo(I, r, u);
        }), M;
      }), Kv = ls(function(t, r, u) {
        Pr(t, u, r);
      });
      function ys(t, r) {
        var u = Zt(t) ? z : Sf;
        return u(t, Ft(r, 3));
      }
      function Zv(t, r, u, y) {
        return t == null ? [] : (Zt(r) || (r = r == null ? [] : [r]), u = y ? n : u, Zt(u) || (u = u == null ? [] : [u]), kf(t, r, u));
      }
      var Jv = ls(function(t, r, u) {
        t[u ? 0 : 1].push(r);
      }, function() {
        return [[], []];
      });
      function tm(t, r, u) {
        var y = Zt(t) ? X : Un, T = arguments.length < 3;
        return y(t, Ft(r, 4), u, T, ni);
      }
      function em(t, r, u) {
        var y = Zt(t) ? ft : Un, T = arguments.length < 3;
        return y(t, Ft(r, 4), u, T, yf);
      }
      function nm(t, r) {
        var u = Zt(t) ? A : bf;
        return u(t, xs(Ft(r, 3)));
      }
      function rm(t) {
        var r = Zt(t) ? pf : Yp;
        return r(t);
      }
      function im(t, r, u) {
        (u ? fn(t, r, u) : r === n) ? r = 1 : r = ee(r);
        var y = Zt(t) ? Ep : Qp;
        return y(t, r);
      }
      function om(t) {
        var r = Zt(t) ? Tp : Zp;
        return r(t);
      }
      function am(t) {
        if (t == null)
          return 0;
        if (vn(t))
          return Cs(t) ? Zr(t) : t.length;
        var r = an(t);
        return r == dt || r == Oe ? t.size : Ou(t).length;
      }
      function sm(t, r, u) {
        var y = Zt(t) ? mt : Jp;
        return u && fn(t, r, u) && (r = n), y(t, Ft(r, 3));
      }
      var um = re(function(t, r) {
        if (t == null)
          return [];
        var u = r.length;
        return u > 1 && fn(t, r[0], r[1]) ? r = [] : u > 2 && fn(r[0], r[1], r[2]) && (r = [r[0]]), kf(t, Ze(r, 1), []);
      }), bs = Pe || function() {
        return Fe.Date.now();
      };
      function lm(t, r) {
        if (typeof r != "function")
          throw new Ke(g);
        return t = ee(t), function() {
          if (--t < 1)
            return r.apply(this, arguments);
        };
      }
      function Cc(t, r, u) {
        return r = u ? n : r, r = t && r == null ? t.length : r, Nr(t, et, n, n, n, n, r);
      }
      function Ac(t, r) {
        var u;
        if (typeof r != "function")
          throw new Ke(g);
        return t = ee(t), function() {
          return --t > 0 && (u = r.apply(this, arguments)), t <= 1 && (r = n), u;
        };
      }
      var il = re(function(t, r, u) {
        var y = k;
        if (u.length) {
          var T = lr(u, io(il));
          y |= U;
        }
        return Nr(t, y, r, u, T);
      }), Sc = re(function(t, r, u) {
        var y = k | O;
        if (u.length) {
          var T = lr(u, io(Sc));
          y |= U;
        }
        return Nr(r, y, t, u, T);
      });
      function Ec(t, r, u) {
        r = u ? n : r;
        var y = Nr(t, q, n, n, n, n, n, r);
        return y.placeholder = Ec.placeholder, y;
      }
      function Tc(t, r, u) {
        r = u ? n : r;
        var y = Nr(t, P, n, n, n, n, n, r);
        return y.placeholder = Tc.placeholder, y;
      }
      function Lc(t, r, u) {
        var y, T, M, I, F, V, at = 0, st = !1, ht = !1, Ct = !0;
        if (typeof t != "function")
          throw new Ke(g);
        r = In(r) || 0, Re(u) && (st = !!u.leading, ht = "maxWait" in u, M = ht ? Ue(In(u.maxWait) || 0, r) : M, Ct = "trailing" in u ? !!u.trailing : Ct);
        function Pt(We) {
          var Jn = y, Ir = T;
          return y = T = n, at = We, I = t.apply(Ir, Jn), I;
        }
        function Wt(We) {
          return at = We, F = Ko(ue, r), st ? Pt(We) : I;
        }
        function ne(We) {
          var Jn = We - V, Ir = We - at, Xc = r - Jn;
          return ht ? on(Xc, M - Ir) : Xc;
        }
        function $t(We) {
          var Jn = We - V, Ir = We - at;
          return V === n || Jn >= r || Jn < 0 || ht && Ir >= M;
        }
        function ue() {
          var We = bs();
          if ($t(We))
            return he(We);
          F = Ko(ue, ne(We));
        }
        function he(We) {
          return F = n, Ct && y ? Pt(We) : (y = T = n, I);
        }
        function An() {
          F !== n && Ff(F), at = 0, y = V = T = F = n;
        }
        function cn() {
          return F === n ? I : he(bs());
        }
        function Sn() {
          var We = bs(), Jn = $t(We);
          if (y = arguments, T = this, V = We, Jn) {
            if (F === n)
              return Wt(V);
            if (ht)
              return Ff(F), F = Ko(ue, r), Pt(V);
          }
          return F === n && (F = Ko(ue, r)), I;
        }
        return Sn.cancel = An, Sn.flush = cn, Sn;
      }
      var fm = re(function(t, r) {
        return mf(t, 1, r);
      }), cm = re(function(t, r, u) {
        return mf(t, In(r) || 0, u);
      });
      function hm(t) {
        return Nr(t, _t);
      }
      function ws(t, r) {
        if (typeof t != "function" || r != null && typeof r != "function")
          throw new Ke(g);
        var u = function() {
          var y = arguments, T = r ? r.apply(this, y) : y[0], M = u.cache;
          if (M.has(T))
            return M.get(T);
          var I = t.apply(this, y);
          return u.cache = M.set(T, I) || M, I;
        };
        return u.cache = new (ws.Cache || kr)(), u;
      }
      ws.Cache = kr;
      function xs(t) {
        if (typeof t != "function")
          throw new Ke(g);
        return function() {
          var r = arguments;
          switch (r.length) {
            case 0:
              return !t.call(this);
            case 1:
              return !t.call(this, r[0]);
            case 2:
              return !t.call(this, r[0], r[1]);
            case 3:
              return !t.call(this, r[0], r[1], r[2]);
          }
          return !t.apply(this, r);
        };
      }
      function dm(t) {
        return Ac(2, t);
      }
      var pm = tg(function(t, r) {
        r = r.length == 1 && Zt(r[0]) ? z(r[0], Te(Ft())) : z(Ze(r, 1), Te(Ft()));
        var u = r.length;
        return re(function(y) {
          for (var T = -1, M = on(y.length, u); ++T < M; )
            y[T] = r[T].call(this, y[T]);
          return i(t, this, y);
        });
      }), ol = re(function(t, r) {
        var u = lr(r, io(ol));
        return Nr(t, U, n, r, u);
      }), kc = re(function(t, r) {
        var u = lr(r, io(kc));
        return Nr(t, Q, n, r, u);
      }), gm = Mr(function(t, r) {
        return Nr(t, yt, n, n, n, r);
      });
      function vm(t, r) {
        if (typeof t != "function")
          throw new Ke(g);
        return r = r === n ? r : ee(r), re(t, r);
      }
      function mm(t, r) {
        if (typeof t != "function")
          throw new Ke(g);
        return r = r == null ? 0 : Ue(ee(r), 0), re(function(u) {
          var y = u[r], T = oi(u, 0, r);
          return y && H(T, y), i(t, this, T);
        });
      }
      function ym(t, r, u) {
        var y = !0, T = !0;
        if (typeof t != "function")
          throw new Ke(g);
        return Re(u) && (y = "leading" in u ? !!u.leading : y, T = "trailing" in u ? !!u.trailing : T), Lc(t, r, {
          leading: y,
          maxWait: r,
          trailing: T
        });
      }
      function bm(t) {
        return Cc(t, 1);
      }
      function wm(t, r) {
        return ol($u(r), t);
      }
      function xm() {
        if (!arguments.length)
          return [];
        var t = arguments[0];
        return Zt(t) ? t : [t];
      }
      function _m(t) {
        return Dn(t, w);
      }
      function Cm(t, r) {
        return r = typeof r == "function" ? r : n, Dn(t, w, r);
      }
      function Am(t) {
        return Dn(t, x | w);
      }
      function Sm(t, r) {
        return r = typeof r == "function" ? r : n, Dn(t, x | w, r);
      }
      function Em(t, r) {
        return r == null || vf(t, r, Ye(r));
      }
      function Zn(t, r) {
        return t === r || t !== t && r !== r;
      }
      var Tm = ds(Nu), Lm = ds(function(t, r) {
        return t >= r;
      }), Ti = _f(/* @__PURE__ */ function() {
        return arguments;
      }()) ? _f : function(t) {
        return Ie(t) && me.call(t, "callee") && !Ht.call(t, "callee");
      }, Zt = Z.isArray, km = Mo ? Te(Mo) : Bp;
      function vn(t) {
        return t != null && _s(t.length) && !Or(t);
      }
      function He(t) {
        return Ie(t) && vn(t);
      }
      function Pm(t) {
        return t === !0 || t === !1 || Ie(t) && ln(t) == Yt;
      }
      var ai = Gd || vl, Nm = ji ? Te(ji) : Fp;
      function Mm(t) {
        return Ie(t) && t.nodeType === 1 && !Zo(t);
      }
      function Dm(t) {
        if (t == null)
          return !0;
        if (vn(t) && (Zt(t) || typeof t == "string" || typeof t.splice == "function" || ai(t) || oo(t) || Ti(t)))
          return !t.length;
        var r = an(t);
        if (r == dt || r == Oe)
          return !t.size;
        if (Qo(t))
          return !Ou(t).length;
        for (var u in t)
          if (me.call(t, u))
            return !1;
        return !0;
      }
      function Om(t, r) {
        return Xo(t, r);
      }
      function Rm(t, r, u) {
        u = typeof u == "function" ? u : n;
        var y = u ? u(t, r) : n;
        return y === n ? Xo(t, r, n, u) : !!y;
      }
      function al(t) {
        if (!Ie(t))
          return !1;
        var r = ln(t);
        return r == ye || r == Je || typeof t.message == "string" && typeof t.name == "string" && !Zo(t);
      }
      function Im(t) {
        return typeof t == "number" && ff(t);
      }
      function Or(t) {
        if (!Re(t))
          return !1;
        var r = ln(t);
        return r == Ot || r == rt || r == oe || r == Ve;
      }
      function Pc(t) {
        return typeof t == "number" && t == ee(t);
      }
      function _s(t) {
        return typeof t == "number" && t > -1 && t % 1 == 0 && t <= xt;
      }
      function Re(t) {
        var r = typeof t;
        return t != null && (r == "object" || r == "function");
      }
      function Ie(t) {
        return t != null && typeof t == "object";
      }
      var Nc = Do ? Te(Do) : qp;
      function Bm(t, r) {
        return t === r || Du(t, r, Qu(r));
      }
      function Fm(t, r, u) {
        return u = typeof u == "function" ? u : n, Du(t, r, Qu(r), u);
      }
      function zm(t) {
        return Mc(t) && t != +t;
      }
      function qm(t) {
        if (Cg(t))
          throw new Vt(m);
        return Cf(t);
      }
      function Hm(t) {
        return t === null;
      }
      function Wm(t) {
        return t == null;
      }
      function Mc(t) {
        return typeof t == "number" || Ie(t) && ln(t) == vt;
      }
      function Zo(t) {
        if (!Ie(t) || ln(t) != pe)
          return !1;
        var r = Gt(t);
        if (r === null)
          return !0;
        var u = me.call(r, "constructor") && r.constructor;
        return typeof u == "function" && u instanceof u && ei.call(u) == W;
      }
      var sl = Oo ? Te(Oo) : Hp;
      function $m(t) {
        return Pc(t) && t >= -xt && t <= xt;
      }
      var Dc = Va ? Te(Va) : Wp;
      function Cs(t) {
        return typeof t == "string" || !Zt(t) && Ie(t) && ln(t) == Me;
      }
      function Cn(t) {
        return typeof t == "symbol" || Ie(t) && ln(t) == Ae;
      }
      var oo = Xa ? Te(Xa) : $p;
      function Gm(t) {
        return t === n;
      }
      function Um(t) {
        return Ie(t) && an(t) == Ln;
      }
      function Vm(t) {
        return Ie(t) && ln(t) == br;
      }
      var Xm = ds(Ru), jm = ds(function(t, r) {
        return t <= r;
      });
      function Oc(t) {
        if (!t)
          return [];
        if (vn(t))
          return Cs(t) ? Qe(t) : gn(t);
        if (It && t[It])
          return Qi(t[It]());
        var r = an(t), u = r == dt ? Bo : r == Oe ? Ki : ao;
        return u(t);
      }
      function Rr(t) {
        if (!t)
          return t === 0 ? t : 0;
        if (t = In(t), t === lt || t === -lt) {
          var r = t < 0 ? -1 : 1;
          return r * At;
        }
        return t === t ? t : 0;
      }
      function ee(t) {
        var r = Rr(t), u = r % 1;
        return r === r ? u ? r - u : r : 0;
      }
      function Rc(t) {
        return t ? Ci(ee(t), 0, j) : 0;
      }
      function In(t) {
        if (typeof t == "number")
          return t;
        if (Cn(t))
          return Lt;
        if (Re(t)) {
          var r = typeof t.valueOf == "function" ? t.valueOf() : t;
          t = Re(r) ? r + "" : r;
        }
        if (typeof t != "string")
          return t === 0 ? t : +t;
        t = Xn(t);
        var u = ou.test(t);
        return u || So.test(t) ? Ga(t.slice(2), u ? 2 : 8) : or.test(t) ? Lt : +t;
      }
      function Ic(t) {
        return hr(t, mn(t));
      }
      function Ym(t) {
        return t ? Ci(ee(t), -xt, xt) : t === 0 ? t : 0;
      }
      function Ce(t) {
        return t == null ? "" : _n(t);
      }
      var Qm = no(function(t, r) {
        if (Qo(r) || vn(r)) {
          hr(r, Ye(r), t);
          return;
        }
        for (var u in r)
          me.call(r, u) && Go(t, u, r[u]);
      }), Bc = no(function(t, r) {
        hr(r, mn(r), t);
      }), As = no(function(t, r, u, y) {
        hr(r, mn(r), t, y);
      }), Km = no(function(t, r, u, y) {
        hr(r, Ye(r), t, y);
      }), Zm = Mr(Lu);
      function Jm(t, r) {
        var u = eo(t);
        return r == null ? u : gf(u, r);
      }
      var ty = re(function(t, r) {
        t = ce(t);
        var u = -1, y = r.length, T = y > 2 ? r[2] : n;
        for (T && fn(r[0], r[1], T) && (y = 1); ++u < y; )
          for (var M = r[u], I = mn(M), F = -1, V = I.length; ++F < V; ) {
            var at = I[F], st = t[at];
            (st === n || Zn(st, ti[at]) && !me.call(t, at)) && (t[at] = M[at]);
          }
        return t;
      }), ey = re(function(t) {
        return t.push(n, tc), i(Fc, n, t);
      });
      function ny(t, r) {
        return Qt(t, Ft(r, 3), cr);
      }
      function ry(t, r) {
        return Qt(t, Ft(r, 3), Pu);
      }
      function iy(t, r) {
        return t == null ? t : ku(t, Ft(r, 3), mn);
      }
      function oy(t, r) {
        return t == null ? t : wf(t, Ft(r, 3), mn);
      }
      function ay(t, r) {
        return t && cr(t, Ft(r, 3));
      }
      function sy(t, r) {
        return t && Pu(t, Ft(r, 3));
      }
      function uy(t) {
        return t == null ? [] : os(t, Ye(t));
      }
      function ly(t) {
        return t == null ? [] : os(t, mn(t));
      }
      function ul(t, r, u) {
        var y = t == null ? n : Ai(t, r);
        return y === n ? u : y;
      }
      function fy(t, r) {
        return t != null && rc(t, r, Dp);
      }
      function ll(t, r) {
        return t != null && rc(t, r, Op);
      }
      var cy = Yf(function(t, r, u) {
        r != null && typeof r.toString != "function" && (r = B.call(r)), t[r] = u;
      }, cl(yn)), hy = Yf(function(t, r, u) {
        r != null && typeof r.toString != "function" && (r = B.call(r)), me.call(t, r) ? t[r].push(u) : t[r] = [u];
      }, Ft), dy = re(Vo);
      function Ye(t) {
        return vn(t) ? df(t) : Ou(t);
      }
      function mn(t) {
        return vn(t) ? df(t, !0) : Gp(t);
      }
      function py(t, r) {
        var u = {};
        return r = Ft(r, 3), cr(t, function(y, T, M) {
          Pr(u, r(y, T, M), y);
        }), u;
      }
      function gy(t, r) {
        var u = {};
        return r = Ft(r, 3), cr(t, function(y, T, M) {
          Pr(u, T, r(y, T, M));
        }), u;
      }
      var vy = no(function(t, r, u) {
        as(t, r, u);
      }), Fc = no(function(t, r, u, y) {
        as(t, r, u, y);
      }), my = Mr(function(t, r) {
        var u = {};
        if (t == null)
          return u;
        var y = !1;
        r = z(r, function(M) {
          return M = ii(M, t), y || (y = M.length > 1), M;
        }), hr(t, ju(t), u), y && (u = Dn(u, x | h | w, cg));
        for (var T = r.length; T--; )
          qu(u, r[T]);
        return u;
      });
      function yy(t, r) {
        return zc(t, xs(Ft(r)));
      }
      var by = Mr(function(t, r) {
        return t == null ? {} : Vp(t, r);
      });
      function zc(t, r) {
        if (t == null)
          return {};
        var u = z(ju(t), function(y) {
          return [y];
        });
        return r = Ft(r), Pf(t, u, function(y, T) {
          return r(y, T[0]);
        });
      }
      function wy(t, r, u) {
        r = ii(r, t);
        var y = -1, T = r.length;
        for (T || (T = 1, t = n); ++y < T; ) {
          var M = t == null ? n : t[dr(r[y])];
          M === n && (y = T, M = u), t = Or(M) ? M.call(t) : M;
        }
        return t;
      }
      function xy(t, r, u) {
        return t == null ? t : jo(t, r, u);
      }
      function _y(t, r, u, y) {
        return y = typeof y == "function" ? y : n, t == null ? t : jo(t, r, u, y);
      }
      var qc = Zf(Ye), Hc = Zf(mn);
      function Cy(t, r, u) {
        var y = Zt(t), T = y || ai(t) || oo(t);
        if (r = Ft(r, 4), u == null) {
          var M = t && t.constructor;
          T ? u = y ? new M() : [] : Re(t) ? u = Or(M) ? eo(Gt(t)) : {} : u = {};
        }
        return (T ? f : cr)(t, function(I, F, V) {
          return r(u, I, F, V);
        }), u;
      }
      function Ay(t, r) {
        return t == null ? !0 : qu(t, r);
      }
      function Sy(t, r, u) {
        return t == null ? t : Rf(t, r, $u(u));
      }
      function Ey(t, r, u, y) {
        return y = typeof y == "function" ? y : n, t == null ? t : Rf(t, r, $u(u), y);
      }
      function ao(t) {
        return t == null ? [] : rn(t, Ye(t));
      }
      function Ty(t) {
        return t == null ? [] : rn(t, mn(t));
      }
      function Ly(t, r, u) {
        return u === n && (u = r, r = n), u !== n && (u = In(u), u = u === u ? u : 0), r !== n && (r = In(r), r = r === r ? r : 0), Ci(In(t), r, u);
      }
      function ky(t, r, u) {
        return r = Rr(r), u === n ? (u = r, r = 0) : u = Rr(u), t = In(t), Rp(t, r, u);
      }
      function Py(t, r, u) {
        if (u && typeof u != "boolean" && fn(t, r, u) && (r = u = n), u === n && (typeof r == "boolean" ? (u = r, r = n) : typeof t == "boolean" && (u = t, t = n)), t === n && r === n ? (t = 0, r = 1) : (t = Rr(t), r === n ? (r = t, t = 0) : r = Rr(r)), t > r) {
          var y = t;
          t = r, r = y;
        }
        if (u || t % 1 || r % 1) {
          var T = cf();
          return on(t + T * (r - t + yu("1e-" + ((T + "").length - 1))), r);
        }
        return Bu(t, r);
      }
      var Ny = ro(function(t, r, u) {
        return r = r.toLowerCase(), t + (u ? Wc(r) : r);
      });
      function Wc(t) {
        return fl(Ce(t).toLowerCase());
      }
      function $c(t) {
        return t = Ce(t), t && t.replace(su, Io).replace(qa, "");
      }
      function My(t, r, u) {
        t = Ce(t), r = _n(r);
        var y = t.length;
        u = u === n ? y : Ci(ee(u), 0, y);
        var T = u;
        return u -= r.length, u >= 0 && t.slice(u, T) == r;
      }
      function Dy(t) {
        return t = Ce(t), t && hi.test(t) ? t.replace(ci, _e) : t;
      }
      function Oy(t) {
        return t = Ce(t), t && _r.test(t) ? t.replace(_o, "\\$&") : t;
      }
      var Ry = ro(function(t, r, u) {
        return t + (u ? "-" : "") + r.toLowerCase();
      }), Iy = ro(function(t, r, u) {
        return t + (u ? " " : "") + r.toLowerCase();
      }), By = Vf("toLowerCase");
      function Fy(t, r, u) {
        t = Ce(t), r = ee(r);
        var y = r ? Zr(t) : 0;
        if (!r || y >= r)
          return t;
        var T = (r - y) / 2;
        return hs(je(T), u) + t + hs(fr(T), u);
      }
      function zy(t, r, u) {
        t = Ce(t), r = ee(r);
        var y = r ? Zr(t) : 0;
        return r && y < r ? t + hs(r - y, u) : t;
      }
      function qy(t, r, u) {
        t = Ce(t), r = ee(r);
        var y = r ? Zr(t) : 0;
        return r && y < r ? hs(r - y, u) + t : t;
      }
      function Hy(t, r, u) {
        return u || r == null ? r = 0 : r && (r = +r), jd(Ce(t).replace(Bi, ""), r || 0);
      }
      function Wy(t, r, u) {
        return (u ? fn(t, r, u) : r === n) ? r = 1 : r = ee(r), Fu(Ce(t), r);
      }
      function $y() {
        var t = arguments, r = Ce(t[0]);
        return t.length < 3 ? r : r.replace(t[1], t[2]);
      }
      var Gy = ro(function(t, r, u) {
        return t + (u ? "_" : "") + r.toLowerCase();
      });
      function Uy(t, r, u) {
        return u && typeof u != "number" && fn(t, r, u) && (r = u = n), u = u === n ? j : u >>> 0, u ? (t = Ce(t), t && (typeof r == "string" || r != null && !sl(r)) && (r = _n(r), !r && ur(t)) ? oi(Qe(t), 0, u) : t.split(r, u)) : [];
      }
      var Vy = ro(function(t, r, u) {
        return t + (u ? " " : "") + fl(r);
      });
      function Xy(t, r, u) {
        return t = Ce(t), u = u == null ? 0 : Ci(ee(u), 0, t.length), r = _n(r), t.slice(u, u + r.length) == r;
      }
      function jy(t, r, u) {
        var y = N.templateSettings;
        u && fn(t, r, u) && (r = n), t = Ce(t), r = As({}, r, y, Jf);
        var T = As({}, r.imports, y.imports, Jf), M = Ye(T), I = rn(T, M), F, V, at = 0, st = r.interpolate || qi, ht = "__p += '", Ct = bi(
          (r.escape || qi).source + "|" + st.source + "|" + (st === di ? Aa : qi).source + "|" + (r.evaluate || qi).source + "|$",
          "g"
        ), Pt = "//# sourceURL=" + (me.call(r, "sourceURL") ? (r.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++$a + "]") + `
`;
        t.replace(Ct, function($t, ue, he, An, cn, Sn) {
          return he || (he = An), ht += t.slice(at, Sn).replace(uu, Er), ue && (F = !0, ht += `' +
__e(` + ue + `) +
'`), cn && (V = !0, ht += `';
` + cn + `;
__p += '`), he && (ht += `' +
((__t = (` + he + `)) == null ? '' : __t) +
'`), at = Sn + $t.length, $t;
        }), ht += `';
`;
        var Wt = me.call(r, "variable") && r.variable;
        if (!Wt)
          ht = `with (obj) {
` + ht + `
}
`;
        else if (zi.test(Wt))
          throw new Vt(b);
        ht = (V ? ht.replace(se, "") : ht).replace($e, "$1").replace(tn, "$1;"), ht = "function(" + (Wt || "obj") + `) {
` + (Wt ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (F ? ", __e = _.escape" : "") + (V ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + ht + `return __p
}`;
        var ne = Uc(function() {
          return ve(M, Pt + "return " + ht).apply(n, I);
        });
        if (ne.source = ht, al(ne))
          throw ne;
        return ne;
      }
      function Yy(t) {
        return Ce(t).toLowerCase();
      }
      function Qy(t) {
        return Ce(t).toUpperCase();
      }
      function Ky(t, r, u) {
        if (t = Ce(t), t && (u || r === n))
          return Xn(t);
        if (!t || !(r = _n(r)))
          return t;
        var y = Qe(t), T = Qe(r), M = jn(y, T), I = Ro(y, T) + 1;
        return oi(y, M, I).join("");
      }
      function Zy(t, r, u) {
        if (t = Ce(t), t && (u || r === n))
          return t.slice(0, Ka(t) + 1);
        if (!t || !(r = _n(r)))
          return t;
        var y = Qe(t), T = Ro(y, Qe(r)) + 1;
        return oi(y, 0, T).join("");
      }
      function Jy(t, r, u) {
        if (t = Ce(t), t && (u || r === n))
          return t.replace(Bi, "");
        if (!t || !(r = _n(r)))
          return t;
        var y = Qe(t), T = jn(y, Qe(r));
        return oi(y, T).join("");
      }
      function t0(t, r) {
        var u = bt, y = wt;
        if (Re(r)) {
          var T = "separator" in r ? r.separator : T;
          u = "length" in r ? ee(r.length) : u, y = "omission" in r ? _n(r.omission) : y;
        }
        t = Ce(t);
        var M = t.length;
        if (ur(t)) {
          var I = Qe(t);
          M = I.length;
        }
        if (u >= M)
          return t;
        var F = u - Zr(y);
        if (F < 1)
          return y;
        var V = I ? oi(I, 0, F).join("") : t.slice(0, F);
        if (T === n)
          return V + y;
        if (I && (F += V.length - F), sl(T)) {
          if (t.slice(F).search(T)) {
            var at, st = V;
            for (T.global || (T = bi(T.source, Ce(ir.exec(T)) + "g")), T.lastIndex = 0; at = T.exec(st); )
              var ht = at.index;
            V = V.slice(0, ht === n ? F : ht);
          }
        } else if (t.indexOf(_n(T), F) != F) {
          var Ct = V.lastIndexOf(T);
          Ct > -1 && (V = V.slice(0, Ct));
        }
        return V + y;
      }
      function e0(t) {
        return t = Ce(t), t && Wn.test(t) ? t.replace(Hn, Fo) : t;
      }
      var n0 = ro(function(t, r, u) {
        return t + (u ? " " : "") + r.toUpperCase();
      }), fl = Vf("toUpperCase");
      function Gc(t, r, u) {
        return t = Ce(t), r = u ? n : r, r === n ? wu(t) ? Qn(t) : qt(t) : t.match(r) || [];
      }
      var Uc = re(function(t, r) {
        try {
          return i(t, n, r);
        } catch (u) {
          return al(u) ? u : new Vt(u);
        }
      }), r0 = Mr(function(t, r) {
        return f(r, function(u) {
          u = dr(u), Pr(t, u, il(t[u], t));
        }), t;
      });
      function i0(t) {
        var r = t == null ? 0 : t.length, u = Ft();
        return t = r ? z(t, function(y) {
          if (typeof y[1] != "function")
            throw new Ke(g);
          return [u(y[0]), y[1]];
        }) : [], re(function(y) {
          for (var T = -1; ++T < r; ) {
            var M = t[T];
            if (i(M[0], this, y))
              return i(M[1], this, y);
          }
        });
      }
      function o0(t) {
        return Pp(Dn(t, x));
      }
      function cl(t) {
        return function() {
          return t;
        };
      }
      function a0(t, r) {
        return t == null || t !== t ? r : t;
      }
      var s0 = jf(), u0 = jf(!0);
      function yn(t) {
        return t;
      }
      function hl(t) {
        return Af(typeof t == "function" ? t : Dn(t, x));
      }
      function l0(t) {
        return Ef(Dn(t, x));
      }
      function f0(t, r) {
        return Tf(t, Dn(r, x));
      }
      var c0 = re(function(t, r) {
        return function(u) {
          return Vo(u, t, r);
        };
      }), h0 = re(function(t, r) {
        return function(u) {
          return Vo(t, u, r);
        };
      });
      function dl(t, r, u) {
        var y = Ye(r), T = os(r, y);
        u == null && !(Re(r) && (T.length || !y.length)) && (u = r, r = t, t = this, T = os(r, Ye(r)));
        var M = !(Re(u) && "chain" in u) || !!u.chain, I = Or(t);
        return f(T, function(F) {
          var V = r[F];
          t[F] = V, I && (t.prototype[F] = function() {
            var at = this.__chain__;
            if (M || at) {
              var st = t(this.__wrapped__), ht = st.__actions__ = gn(this.__actions__);
              return ht.push({ func: V, args: arguments, thisArg: t }), st.__chain__ = at, st;
            }
            return V.apply(t, H([this.value()], arguments));
          });
        }), t;
      }
      function d0() {
        return Fe._ === this && (Fe._ = nt), this;
      }
      function pl() {
      }
      function p0(t) {
        return t = ee(t), re(function(r) {
          return Lf(r, t);
        });
      }
      var g0 = Uu(z), v0 = Uu(C), m0 = Uu(mt);
      function Vc(t) {
        return Zu(t) ? Kt(dr(t)) : Xp(t);
      }
      function y0(t) {
        return function(r) {
          return t == null ? n : Ai(t, r);
        };
      }
      var b0 = Qf(), w0 = Qf(!0);
      function gl() {
        return [];
      }
      function vl() {
        return !1;
      }
      function x0() {
        return {};
      }
      function _0() {
        return "";
      }
      function C0() {
        return !0;
      }
      function A0(t, r) {
        if (t = ee(t), t < 1 || t > xt)
          return [];
        var u = j, y = on(t, j);
        r = Ft(r), t -= j;
        for (var T = Vn(y, r); ++u < t; )
          r(u);
        return T;
      }
      function S0(t) {
        return Zt(t) ? z(t, dr) : Cn(t) ? [t] : gn(hc(Ce(t)));
      }
      function E0(t) {
        var r = ++Cu;
        return Ce(t) + r;
      }
      var T0 = cs(function(t, r) {
        return t + r;
      }, 0), L0 = Vu("ceil"), k0 = cs(function(t, r) {
        return t / r;
      }, 1), P0 = Vu("floor");
      function N0(t) {
        return t && t.length ? is(t, yn, Nu) : n;
      }
      function M0(t, r) {
        return t && t.length ? is(t, Ft(r, 2), Nu) : n;
      }
      function D0(t) {
        return Ge(t, yn);
      }
      function O0(t, r) {
        return Ge(t, Ft(r, 2));
      }
      function R0(t) {
        return t && t.length ? is(t, yn, Ru) : n;
      }
      function I0(t, r) {
        return t && t.length ? is(t, Ft(r, 2), Ru) : n;
      }
      var B0 = cs(function(t, r) {
        return t * r;
      }, 1), F0 = Vu("round"), z0 = cs(function(t, r) {
        return t - r;
      }, 0);
      function q0(t) {
        return t && t.length ? nn(t, yn) : 0;
      }
      function H0(t, r) {
        return t && t.length ? nn(t, Ft(r, 2)) : 0;
      }
      return N.after = lm, N.ary = Cc, N.assign = Qm, N.assignIn = Bc, N.assignInWith = As, N.assignWith = Km, N.at = Zm, N.before = Ac, N.bind = il, N.bindAll = r0, N.bindKey = Sc, N.castArray = xm, N.chain = wc, N.chunk = Pg, N.compact = Ng, N.concat = Mg, N.cond = i0, N.conforms = o0, N.constant = cl, N.countBy = qv, N.create = Jm, N.curry = Ec, N.curryRight = Tc, N.debounce = Lc, N.defaults = ty, N.defaultsDeep = ey, N.defer = fm, N.delay = cm, N.difference = Dg, N.differenceBy = Og, N.differenceWith = Rg, N.drop = Ig, N.dropRight = Bg, N.dropRightWhile = Fg, N.dropWhile = zg, N.fill = qg, N.filter = Wv, N.flatMap = Uv, N.flatMapDeep = Vv, N.flatMapDepth = Xv, N.flatten = vc, N.flattenDeep = Hg, N.flattenDepth = Wg, N.flip = hm, N.flow = s0, N.flowRight = u0, N.fromPairs = $g, N.functions = uy, N.functionsIn = ly, N.groupBy = jv, N.initial = Ug, N.intersection = Vg, N.intersectionBy = Xg, N.intersectionWith = jg, N.invert = cy, N.invertBy = hy, N.invokeMap = Qv, N.iteratee = hl, N.keyBy = Kv, N.keys = Ye, N.keysIn = mn, N.map = ys, N.mapKeys = py, N.mapValues = gy, N.matches = l0, N.matchesProperty = f0, N.memoize = ws, N.merge = vy, N.mergeWith = Fc, N.method = c0, N.methodOf = h0, N.mixin = dl, N.negate = xs, N.nthArg = p0, N.omit = my, N.omitBy = yy, N.once = dm, N.orderBy = Zv, N.over = g0, N.overArgs = pm, N.overEvery = v0, N.overSome = m0, N.partial = ol, N.partialRight = kc, N.partition = Jv, N.pick = by, N.pickBy = zc, N.property = Vc, N.propertyOf = y0, N.pull = Zg, N.pullAll = yc, N.pullAllBy = Jg, N.pullAllWith = tv, N.pullAt = ev, N.range = b0, N.rangeRight = w0, N.rearg = gm, N.reject = nm, N.remove = nv, N.rest = vm, N.reverse = nl, N.sampleSize = im, N.set = xy, N.setWith = _y, N.shuffle = om, N.slice = rv, N.sortBy = um, N.sortedUniq = fv, N.sortedUniqBy = cv, N.split = Uy, N.spread = mm, N.tail = hv, N.take = dv, N.takeRight = pv, N.takeRightWhile = gv, N.takeWhile = vv, N.tap = Nv, N.throttle = ym, N.thru = ms, N.toArray = Oc, N.toPairs = qc, N.toPairsIn = Hc, N.toPath = S0, N.toPlainObject = Ic, N.transform = Cy, N.unary = bm, N.union = mv, N.unionBy = yv, N.unionWith = bv, N.uniq = wv, N.uniqBy = xv, N.uniqWith = _v, N.unset = Ay, N.unzip = rl, N.unzipWith = bc, N.update = Sy, N.updateWith = Ey, N.values = ao, N.valuesIn = Ty, N.without = Cv, N.words = Gc, N.wrap = wm, N.xor = Av, N.xorBy = Sv, N.xorWith = Ev, N.zip = Tv, N.zipObject = Lv, N.zipObjectDeep = kv, N.zipWith = Pv, N.entries = qc, N.entriesIn = Hc, N.extend = Bc, N.extendWith = As, dl(N, N), N.add = T0, N.attempt = Uc, N.camelCase = Ny, N.capitalize = Wc, N.ceil = L0, N.clamp = Ly, N.clone = _m, N.cloneDeep = Am, N.cloneDeepWith = Sm, N.cloneWith = Cm, N.conformsTo = Em, N.deburr = $c, N.defaultTo = a0, N.divide = k0, N.endsWith = My, N.eq = Zn, N.escape = Dy, N.escapeRegExp = Oy, N.every = Hv, N.find = $v, N.findIndex = pc, N.findKey = ny, N.findLast = Gv, N.findLastIndex = gc, N.findLastKey = ry, N.floor = P0, N.forEach = xc, N.forEachRight = _c, N.forIn = iy, N.forInRight = oy, N.forOwn = ay, N.forOwnRight = sy, N.get = ul, N.gt = Tm, N.gte = Lm, N.has = fy, N.hasIn = ll, N.head = mc, N.identity = yn, N.includes = Yv, N.indexOf = Gg, N.inRange = ky, N.invoke = dy, N.isArguments = Ti, N.isArray = Zt, N.isArrayBuffer = km, N.isArrayLike = vn, N.isArrayLikeObject = He, N.isBoolean = Pm, N.isBuffer = ai, N.isDate = Nm, N.isElement = Mm, N.isEmpty = Dm, N.isEqual = Om, N.isEqualWith = Rm, N.isError = al, N.isFinite = Im, N.isFunction = Or, N.isInteger = Pc, N.isLength = _s, N.isMap = Nc, N.isMatch = Bm, N.isMatchWith = Fm, N.isNaN = zm, N.isNative = qm, N.isNil = Wm, N.isNull = Hm, N.isNumber = Mc, N.isObject = Re, N.isObjectLike = Ie, N.isPlainObject = Zo, N.isRegExp = sl, N.isSafeInteger = $m, N.isSet = Dc, N.isString = Cs, N.isSymbol = Cn, N.isTypedArray = oo, N.isUndefined = Gm, N.isWeakMap = Um, N.isWeakSet = Vm, N.join = Yg, N.kebabCase = Ry, N.last = Rn, N.lastIndexOf = Qg, N.lowerCase = Iy, N.lowerFirst = By, N.lt = Xm, N.lte = jm, N.max = N0, N.maxBy = M0, N.mean = D0, N.meanBy = O0, N.min = R0, N.minBy = I0, N.stubArray = gl, N.stubFalse = vl, N.stubObject = x0, N.stubString = _0, N.stubTrue = C0, N.multiply = B0, N.nth = Kg, N.noConflict = d0, N.noop = pl, N.now = bs, N.pad = Fy, N.padEnd = zy, N.padStart = qy, N.parseInt = Hy, N.random = Py, N.reduce = tm, N.reduceRight = em, N.repeat = Wy, N.replace = $y, N.result = wy, N.round = F0, N.runInContext = $, N.sample = rm, N.size = am, N.snakeCase = Gy, N.some = sm, N.sortedIndex = iv, N.sortedIndexBy = ov, N.sortedIndexOf = av, N.sortedLastIndex = sv, N.sortedLastIndexBy = uv, N.sortedLastIndexOf = lv, N.startCase = Vy, N.startsWith = Xy, N.subtract = z0, N.sum = q0, N.sumBy = H0, N.template = jy, N.times = A0, N.toFinite = Rr, N.toInteger = ee, N.toLength = Rc, N.toLower = Yy, N.toNumber = In, N.toSafeInteger = Ym, N.toString = Ce, N.toUpper = Qy, N.trim = Ky, N.trimEnd = Zy, N.trimStart = Jy, N.truncate = t0, N.unescape = e0, N.uniqueId = E0, N.upperCase = n0, N.upperFirst = fl, N.each = xc, N.eachRight = _c, N.first = mc, dl(N, function() {
        var t = {};
        return cr(N, function(r, u) {
          me.call(N.prototype, u) || (t[u] = r);
        }), t;
      }(), { chain: !1 }), N.VERSION = l, f(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(t) {
        N[t].placeholder = N;
      }), f(["drop", "take"], function(t, r) {
        fe.prototype[t] = function(u) {
          u = u === n ? 1 : Ue(ee(u), 0);
          var y = this.__filtered__ && !r ? new fe(this) : this.clone();
          return y.__filtered__ ? y.__takeCount__ = on(u, y.__takeCount__) : y.__views__.push({
            size: on(u, j),
            type: t + (y.__dir__ < 0 ? "Right" : "")
          }), y;
        }, fe.prototype[t + "Right"] = function(u) {
          return this.reverse()[t](u).reverse();
        };
      }), f(["filter", "map", "takeWhile"], function(t, r) {
        var u = r + 1, y = u == Y || u == J;
        fe.prototype[t] = function(T) {
          var M = this.clone();
          return M.__iteratees__.push({
            iteratee: Ft(T, 3),
            type: u
          }), M.__filtered__ = M.__filtered__ || y, M;
        };
      }), f(["head", "last"], function(t, r) {
        var u = "take" + (r ? "Right" : "");
        fe.prototype[t] = function() {
          return this[u](1).value()[0];
        };
      }), f(["initial", "tail"], function(t, r) {
        var u = "drop" + (r ? "" : "Right");
        fe.prototype[t] = function() {
          return this.__filtered__ ? new fe(this) : this[u](1);
        };
      }), fe.prototype.compact = function() {
        return this.filter(yn);
      }, fe.prototype.find = function(t) {
        return this.filter(t).head();
      }, fe.prototype.findLast = function(t) {
        return this.reverse().find(t);
      }, fe.prototype.invokeMap = re(function(t, r) {
        return typeof t == "function" ? new fe(this) : this.map(function(u) {
          return Vo(u, t, r);
        });
      }), fe.prototype.reject = function(t) {
        return this.filter(xs(Ft(t)));
      }, fe.prototype.slice = function(t, r) {
        t = ee(t);
        var u = this;
        return u.__filtered__ && (t > 0 || r < 0) ? new fe(u) : (t < 0 ? u = u.takeRight(-t) : t && (u = u.drop(t)), r !== n && (r = ee(r), u = r < 0 ? u.dropRight(-r) : u.take(r - t)), u);
      }, fe.prototype.takeRightWhile = function(t) {
        return this.reverse().takeWhile(t).reverse();
      }, fe.prototype.toArray = function() {
        return this.take(j);
      }, cr(fe.prototype, function(t, r) {
        var u = /^(?:filter|find|map|reject)|While$/.test(r), y = /^(?:head|last)$/.test(r), T = N[y ? "take" + (r == "last" ? "Right" : "") : r], M = y || /^find/.test(r);
        T && (N.prototype[r] = function() {
          var I = this.__wrapped__, F = y ? [1] : arguments, V = I instanceof fe, at = F[0], st = V || Zt(I), ht = function(ue) {
            var he = T.apply(N, H([ue], F));
            return y && Ct ? he[0] : he;
          };
          st && u && typeof at == "function" && at.length != 1 && (V = st = !1);
          var Ct = this.__chain__, Pt = !!this.__actions__.length, Wt = M && !Ct, ne = V && !Pt;
          if (!M && st) {
            I = ne ? I : new fe(this);
            var $t = t.apply(I, F);
            return $t.__actions__.push({ func: ms, args: [ht], thisArg: n }), new Mn($t, Ct);
          }
          return Wt && ne ? t.apply(this, F) : ($t = this.thru(ht), Wt ? y ? $t.value()[0] : $t.value() : $t);
        });
      }), f(["pop", "push", "shift", "sort", "splice", "unshift"], function(t) {
        var r = Jr[t], u = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru", y = /^(?:pop|shift)$/.test(t);
        N.prototype[t] = function() {
          var T = arguments;
          if (y && !this.__chain__) {
            var M = this.value();
            return r.apply(Zt(M) ? M : [], T);
          }
          return this[u](function(I) {
            return r.apply(Zt(I) ? I : [], T);
          });
        };
      }), cr(fe.prototype, function(t, r) {
        var u = N[r];
        if (u) {
          var y = u.name + "";
          me.call(to, y) || (to[y] = []), to[y].push({ name: r, func: u });
        }
      }), to[fs(n, O).name] = [{
        name: "wrapper",
        func: n
      }], fe.prototype.clone = ep, fe.prototype.reverse = np, fe.prototype.value = rp, N.prototype.at = Mv, N.prototype.chain = Dv, N.prototype.commit = Ov, N.prototype.next = Rv, N.prototype.plant = Bv, N.prototype.reverse = Fv, N.prototype.toJSON = N.prototype.valueOf = N.prototype.value = zv, N.prototype.first = N.prototype.head, It && (N.prototype[It] = Iv), N;
    }, ge = Za();
    Nn ? ((Nn.exports = ge)._ = ge, No._ = ge) : Fe._ = ge;
  }).call(ki);
})(qs, qs.exports);
var j0 = qs.exports;
const we = /* @__PURE__ */ Js(j0), Y0 = function(e) {
  var o = {
    width: 900,
    height: 600,
    numberPerRow: 7,
    margin: { top: 0.05, left: 0.05, bottom: 0.05, right: 0.05 },
    cellMargin: { top: 0.15, left: 0.05, bottom: 0.1, right: 0.05 },
    labelHeight: 0.09,
    chromosomeAspectRatio: 0.04,
    scale: 1,
    annotations: {
      label: {
        size: 3,
        show: !0,
        showThreshold: 8,
        maxSize: 14
      },
      marker: {
        size: 6,
        show: !0,
        maxSize: 20
      }
    }
  }, n = we.merge({}, o, e), l = function(c, m) {
    var g = we.cloneDeep(c);
    if (c.show) {
      var b = c.size * n.scale;
      m.showThreshold && (g.show = b >= m.showThreshold), m.maxSize && b > m.maxSize && (g.size = m.maxSize / n.scale);
    }
    return g;
  };
  return {
    decorateGenome: function(c) {
      var m = c, g = {
        width: n.width * (1 - n.margin.left - n.margin.right),
        height: n.height * (1 - n.margin.top - n.margin.bottom)
      }, b = Math.min(n.numberPerRow, m.chromosomes.length), p = Math.ceil(m.chromosomes.length / b), v = {
        width: g.width / b,
        height: g.height / p
      }, S = {
        top: v.height * n.cellMargin.top,
        bottom: v.height * n.cellMargin.bottom,
        left: v.width * n.cellMargin.left,
        right: v.width * n.cellMargin.right
      }, x = n.labelHeight * v.height, h = n.labelHeight * v.height, w = v.height - x - h - S.top - S.bottom, a = Math.min(
        65 / n.scale,
        w * n.chromosomeAspectRatio
      ), E = v.width - a - S.left - S.right, k = E / 2, O = Math.max.apply(
        null,
        m.chromosomes.map(function(P) {
          return P.length;
        })
      ), G = {
        label: we.pick(n.annotations.label, ["size", "show"]),
        marker: we.pick(n.annotations.marker, ["size", "show"])
      };
      G.label = l(
        G.label,
        n.annotations.label
      ), G.marker = l(
        G.marker,
        n.annotations.marker
      );
      var q = {
        chromosomePosition: {
          height: w,
          width: a,
          x: S.left + k,
          y: S.top + x
        },
        labelPosition: {
          height: x,
          width: v.width - S.left - S.right,
          chromosomeWidth: a,
          x: S.left,
          y: S.top
        },
        sizeLabelPosition: {
          cellHeight: w,
          height: h,
          width: v.width - S.left - S.right,
          x: S.left,
          y: S.top + x
        },
        qtlAnnotationPosition: {
          height: w,
          width: k,
          chromosomeWidth: a,
          x: S.left,
          y: S.top + x
        },
        geneAnnotationPosition: {
          height: w,
          width: k,
          x: S.left + k + a,
          y: S.top + x
        },
        longestChromosome: O,
        annotations: G,
        scale: n.scale
      };
      return m.chromosomes.length == 1 && (q.chromosomePosition.x = S.left + 0.5 * k, q.geneAnnotationPosition.x = S.left + 0.5 * k + a, q.qtlAnnotationPosition.width = k * 0.5, q.geneAnnotationPosition.width = k * 1.5, q.labelPosition.x = S.left + 0.5 * k, q.labelPosition.width = a, q.sizeLabelPosition.x = S.left + 0.5 * k, q.sizeLabelPosition.width = a), m.drawing = we.pick(n, ["width", "height"]), m.drawing.margin = {
        top: n.margin.top * m.drawing.height,
        left: n.margin.left * m.drawing.width,
        bottom: n.margin.bottom * m.drawing.height,
        right: n.margin.right * m.drawing.width
      }, m.chromosomes.forEach(function(P, U) {
        var Q = U % n.numberPerRow, et = Math.floor(U / n.numberPerRow);
        P.cell = {
          y: et * v.height + n.margin.top * n.height,
          x: Q * v.width + n.margin.left * n.width,
          width: v.width,
          height: v.height
        };
      }), m.cellLayout = q, m;
    },
    width: function(c) {
      return arguments.length ? (n.width = c, this) : n.width;
    },
    height: function(c) {
      return arguments.length ? (n.height = c, this) : n.height;
    },
    numberPerRow: function(c) {
      return arguments.length ? (n.numberPerRow = c, this) : n.numberPerRow;
    },
    margin: function(c) {
      return arguments.length ? (n.margin = we.merge(n.margin, c), this) : n.margin;
    },
    labelHeight: function(c) {
      return arguments.length ? (n.labelHeight = c, this) : n.labelHeight;
    },
    cellMargin: function(c) {
      return arguments.length ? (n.cellMargin = c, this) : n.cellMargin;
    },
    chromosomeAspectRatio: function(c) {
      return arguments.length ? (n.chromosomeAspectRatio = c, this) : n.chromosomeAspectRatio;
    },
    scale: function(c) {
      return arguments.length ? (n.scale = c, this) : n.scale;
    }
  };
};
function Os(e, o) {
  return e == null || o == null ? NaN : e < o ? -1 : e > o ? 1 : e >= o ? 0 : NaN;
}
function Q0(e, o) {
  return e == null || o == null ? NaN : o < e ? -1 : o > e ? 1 : o >= e ? 0 : NaN;
}
function Wh(e) {
  let o, n, l;
  e.length !== 2 ? (o = Os, n = (b, p) => Os(e(b), p), l = (b, p) => e(b) - p) : (o = e === Os || e === Q0 ? e : K0, n = e, l = e);
  function c(b, p, v = 0, S = b.length) {
    if (v < S) {
      if (o(p, p) !== 0) return S;
      do {
        const x = v + S >>> 1;
        n(b[x], p) < 0 ? v = x + 1 : S = x;
      } while (v < S);
    }
    return v;
  }
  function m(b, p, v = 0, S = b.length) {
    if (v < S) {
      if (o(p, p) !== 0) return S;
      do {
        const x = v + S >>> 1;
        n(b[x], p) <= 0 ? v = x + 1 : S = x;
      } while (v < S);
    }
    return v;
  }
  function g(b, p, v = 0, S = b.length) {
    const x = c(b, p, v, S - 1);
    return x > v && l(b[x - 1], p) > -l(b[x], p) ? x - 1 : x;
  }
  return { left: c, center: g, right: m };
}
function K0() {
  return 0;
}
function Z0(e) {
  return e === null ? NaN : +e;
}
const J0 = Wh(Os), tb = J0.right;
Wh(Z0).center;
const eb = Math.sqrt(50), nb = Math.sqrt(10), rb = Math.sqrt(2);
function Hs(e, o, n) {
  const l = (o - e) / Math.max(0, n), c = Math.floor(Math.log10(l)), m = l / Math.pow(10, c), g = m >= eb ? 10 : m >= nb ? 5 : m >= rb ? 2 : 1;
  let b, p, v;
  return c < 0 ? (v = Math.pow(10, -c) / g, b = Math.round(e * v), p = Math.round(o * v), b / v < e && ++b, p / v > o && --p, v = -v) : (v = Math.pow(10, c) * g, b = Math.round(e / v), p = Math.round(o / v), b * v < e && ++b, p * v > o && --p), p < b && 0.5 <= n && n < 2 ? Hs(e, o, n * 2) : [b, p, v];
}
function ib(e, o, n) {
  if (o = +o, e = +e, n = +n, !(n > 0)) return [];
  if (e === o) return [e];
  const l = o < e, [c, m, g] = l ? Hs(o, e, n) : Hs(e, o, n);
  if (!(m >= c)) return [];
  const b = m - c + 1, p = new Array(b);
  if (l)
    if (g < 0) for (let v = 0; v < b; ++v) p[v] = (m - v) / -g;
    else for (let v = 0; v < b; ++v) p[v] = (m - v) * g;
  else if (g < 0) for (let v = 0; v < b; ++v) p[v] = (c + v) / -g;
  else for (let v = 0; v < b; ++v) p[v] = (c + v) * g;
  return p;
}
function El(e, o, n) {
  return o = +o, e = +e, n = +n, Hs(e, o, n)[2];
}
function ob(e, o, n) {
  o = +o, e = +e, n = +n;
  const l = o < e, c = l ? El(o, e, n) : El(e, o, n);
  return (l ? -1 : 1) * (c < 0 ? 1 / -c : c);
}
var ab = { value: function() {
} };
function tu() {
  for (var e = 0, o = arguments.length, n = {}, l; e < o; ++e) {
    if (!(l = arguments[e] + "") || l in n || /[\s.]/.test(l)) throw new Error("illegal type: " + l);
    n[l] = [];
  }
  return new Rs(n);
}
function Rs(e) {
  this._ = e;
}
function sb(e, o) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var l = "", c = n.indexOf(".");
    if (c >= 0 && (l = n.slice(c + 1), n = n.slice(0, c)), n && !o.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: l };
  });
}
Rs.prototype = tu.prototype = {
  constructor: Rs,
  on: function(e, o) {
    var n = this._, l = sb(e + "", n), c, m = -1, g = l.length;
    if (arguments.length < 2) {
      for (; ++m < g; ) if ((c = (e = l[m]).type) && (c = ub(n[c], e.name))) return c;
      return;
    }
    if (o != null && typeof o != "function") throw new Error("invalid callback: " + o);
    for (; ++m < g; )
      if (c = (e = l[m]).type) n[c] = jc(n[c], e.name, o);
      else if (o == null) for (c in n) n[c] = jc(n[c], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, o = this._;
    for (var n in o) e[n] = o[n].slice();
    return new Rs(e);
  },
  call: function(e, o) {
    if ((c = arguments.length - 2) > 0) for (var n = new Array(c), l = 0, c, m; l < c; ++l) n[l] = arguments[l + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (m = this._[e], l = 0, c = m.length; l < c; ++l) m[l].value.apply(o, n);
  },
  apply: function(e, o, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var l = this._[e], c = 0, m = l.length; c < m; ++c) l[c].value.apply(o, n);
  }
};
function ub(e, o) {
  for (var n = 0, l = e.length, c; n < l; ++n)
    if ((c = e[n]).name === o)
      return c.value;
}
function jc(e, o, n) {
  for (var l = 0, c = e.length; l < c; ++l)
    if (e[l].name === o) {
      e[l] = ab, e = e.slice(0, l).concat(e.slice(l + 1));
      break;
    }
  return n != null && e.push({ name: o, value: n }), e;
}
var Tl = "http://www.w3.org/1999/xhtml";
const Yc = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Tl,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function eu(e) {
  var o = e += "", n = o.indexOf(":");
  return n >= 0 && (o = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Yc.hasOwnProperty(o) ? { space: Yc[o], local: e } : e;
}
function lb(e) {
  return function() {
    var o = this.ownerDocument, n = this.namespaceURI;
    return n === Tl && o.documentElement.namespaceURI === Tl ? o.createElement(e) : o.createElementNS(n, e);
  };
}
function fb(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function $h(e) {
  var o = eu(e);
  return (o.local ? fb : lb)(o);
}
function cb() {
}
function Gl(e) {
  return e == null ? cb : function() {
    return this.querySelector(e);
  };
}
function hb(e) {
  typeof e != "function" && (e = Gl(e));
  for (var o = this._groups, n = o.length, l = new Array(n), c = 0; c < n; ++c)
    for (var m = o[c], g = m.length, b = l[c] = new Array(g), p, v, S = 0; S < g; ++S)
      (p = m[S]) && (v = e.call(p, p.__data__, S, m)) && ("__data__" in p && (v.__data__ = p.__data__), b[S] = v);
  return new hn(l, this._parents);
}
function Gh(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function db() {
  return [];
}
function Uh(e) {
  return e == null ? db : function() {
    return this.querySelectorAll(e);
  };
}
function pb(e) {
  return function() {
    return Gh(e.apply(this, arguments));
  };
}
function gb(e) {
  typeof e == "function" ? e = pb(e) : e = Uh(e);
  for (var o = this._groups, n = o.length, l = [], c = [], m = 0; m < n; ++m)
    for (var g = o[m], b = g.length, p, v = 0; v < b; ++v)
      (p = g[v]) && (l.push(e.call(p, p.__data__, v, g)), c.push(p));
  return new hn(l, c);
}
function Vh(e) {
  return function() {
    return this.matches(e);
  };
}
function Xh(e) {
  return function(o) {
    return o.matches(e);
  };
}
var vb = Array.prototype.find;
function mb(e) {
  return function() {
    return vb.call(this.children, e);
  };
}
function yb() {
  return this.firstElementChild;
}
function bb(e) {
  return this.select(e == null ? yb : mb(typeof e == "function" ? e : Xh(e)));
}
var wb = Array.prototype.filter;
function xb() {
  return Array.from(this.children);
}
function _b(e) {
  return function() {
    return wb.call(this.children, e);
  };
}
function Cb(e) {
  return this.selectAll(e == null ? xb : _b(typeof e == "function" ? e : Xh(e)));
}
function Ab(e) {
  typeof e != "function" && (e = Vh(e));
  for (var o = this._groups, n = o.length, l = new Array(n), c = 0; c < n; ++c)
    for (var m = o[c], g = m.length, b = l[c] = [], p, v = 0; v < g; ++v)
      (p = m[v]) && e.call(p, p.__data__, v, m) && b.push(p);
  return new hn(l, this._parents);
}
function jh(e) {
  return new Array(e.length);
}
function Sb() {
  return new hn(this._enter || this._groups.map(jh), this._parents);
}
function Ws(e, o) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = o;
}
Ws.prototype = {
  constructor: Ws,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, o) {
    return this._parent.insertBefore(e, o);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Eb(e) {
  return function() {
    return e;
  };
}
function Tb(e, o, n, l, c, m) {
  for (var g = 0, b, p = o.length, v = m.length; g < v; ++g)
    (b = o[g]) ? (b.__data__ = m[g], l[g] = b) : n[g] = new Ws(e, m[g]);
  for (; g < p; ++g)
    (b = o[g]) && (c[g] = b);
}
function Lb(e, o, n, l, c, m, g) {
  var b, p, v = /* @__PURE__ */ new Map(), S = o.length, x = m.length, h = new Array(S), w;
  for (b = 0; b < S; ++b)
    (p = o[b]) && (h[b] = w = g.call(p, p.__data__, b, o) + "", v.has(w) ? c[b] = p : v.set(w, p));
  for (b = 0; b < x; ++b)
    w = g.call(e, m[b], b, m) + "", (p = v.get(w)) ? (l[b] = p, p.__data__ = m[b], v.delete(w)) : n[b] = new Ws(e, m[b]);
  for (b = 0; b < S; ++b)
    (p = o[b]) && v.get(h[b]) === p && (c[b] = p);
}
function kb(e) {
  return e.__data__;
}
function Pb(e, o) {
  if (!arguments.length) return Array.from(this, kb);
  var n = o ? Lb : Tb, l = this._parents, c = this._groups;
  typeof e != "function" && (e = Eb(e));
  for (var m = c.length, g = new Array(m), b = new Array(m), p = new Array(m), v = 0; v < m; ++v) {
    var S = l[v], x = c[v], h = x.length, w = Nb(e.call(S, S && S.__data__, v, l)), a = w.length, E = b[v] = new Array(a), k = g[v] = new Array(a), O = p[v] = new Array(h);
    n(S, x, E, k, O, w, o);
    for (var G = 0, q = 0, P, U; G < a; ++G)
      if (P = E[G]) {
        for (G >= q && (q = G + 1); !(U = k[q]) && ++q < a; ) ;
        P._next = U || null;
      }
  }
  return g = new hn(g, l), g._enter = b, g._exit = p, g;
}
function Nb(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Mb() {
  return new hn(this._exit || this._groups.map(jh), this._parents);
}
function Db(e, o, n) {
  var l = this.enter(), c = this, m = this.exit();
  return typeof e == "function" ? (l = e(l), l && (l = l.selection())) : l = l.append(e + ""), o != null && (c = o(c), c && (c = c.selection())), n == null ? m.remove() : n(m), l && c ? l.merge(c).order() : c;
}
function Ob(e) {
  for (var o = e.selection ? e.selection() : e, n = this._groups, l = o._groups, c = n.length, m = l.length, g = Math.min(c, m), b = new Array(c), p = 0; p < g; ++p)
    for (var v = n[p], S = l[p], x = v.length, h = b[p] = new Array(x), w, a = 0; a < x; ++a)
      (w = v[a] || S[a]) && (h[a] = w);
  for (; p < c; ++p)
    b[p] = n[p];
  return new hn(b, this._parents);
}
function Rb() {
  for (var e = this._groups, o = -1, n = e.length; ++o < n; )
    for (var l = e[o], c = l.length - 1, m = l[c], g; --c >= 0; )
      (g = l[c]) && (m && g.compareDocumentPosition(m) ^ 4 && m.parentNode.insertBefore(g, m), m = g);
  return this;
}
function Ib(e) {
  e || (e = Bb);
  function o(x, h) {
    return x && h ? e(x.__data__, h.__data__) : !x - !h;
  }
  for (var n = this._groups, l = n.length, c = new Array(l), m = 0; m < l; ++m) {
    for (var g = n[m], b = g.length, p = c[m] = new Array(b), v, S = 0; S < b; ++S)
      (v = g[S]) && (p[S] = v);
    p.sort(o);
  }
  return new hn(c, this._parents).order();
}
function Bb(e, o) {
  return e < o ? -1 : e > o ? 1 : e >= o ? 0 : NaN;
}
function Fb() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function zb() {
  return Array.from(this);
}
function qb() {
  for (var e = this._groups, o = 0, n = e.length; o < n; ++o)
    for (var l = e[o], c = 0, m = l.length; c < m; ++c) {
      var g = l[c];
      if (g) return g;
    }
  return null;
}
function Hb() {
  let e = 0;
  for (const o of this) ++e;
  return e;
}
function Wb() {
  return !this.node();
}
function $b(e) {
  for (var o = this._groups, n = 0, l = o.length; n < l; ++n)
    for (var c = o[n], m = 0, g = c.length, b; m < g; ++m)
      (b = c[m]) && e.call(b, b.__data__, m, c);
  return this;
}
function Gb(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ub(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Vb(e, o) {
  return function() {
    this.setAttribute(e, o);
  };
}
function Xb(e, o) {
  return function() {
    this.setAttributeNS(e.space, e.local, o);
  };
}
function jb(e, o) {
  return function() {
    var n = o.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Yb(e, o) {
  return function() {
    var n = o.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Qb(e, o) {
  var n = eu(e);
  if (arguments.length < 2) {
    var l = this.node();
    return n.local ? l.getAttributeNS(n.space, n.local) : l.getAttribute(n);
  }
  return this.each((o == null ? n.local ? Ub : Gb : typeof o == "function" ? n.local ? Yb : jb : n.local ? Xb : Vb)(n, o));
}
function Yh(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Kb(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Zb(e, o, n) {
  return function() {
    this.style.setProperty(e, o, n);
  };
}
function Jb(e, o, n) {
  return function() {
    var l = o.apply(this, arguments);
    l == null ? this.style.removeProperty(e) : this.style.setProperty(e, l, n);
  };
}
function tw(e, o, n) {
  return arguments.length > 1 ? this.each((o == null ? Kb : typeof o == "function" ? Jb : Zb)(e, o, n ?? "")) : go(this.node(), e);
}
function go(e, o) {
  return e.style.getPropertyValue(o) || Yh(e).getComputedStyle(e, null).getPropertyValue(o);
}
function ew(e) {
  return function() {
    delete this[e];
  };
}
function nw(e, o) {
  return function() {
    this[e] = o;
  };
}
function rw(e, o) {
  return function() {
    var n = o.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function iw(e, o) {
  return arguments.length > 1 ? this.each((o == null ? ew : typeof o == "function" ? rw : nw)(e, o)) : this.node()[e];
}
function Qh(e) {
  return e.trim().split(/^|\s+/);
}
function Ul(e) {
  return e.classList || new Kh(e);
}
function Kh(e) {
  this._node = e, this._names = Qh(e.getAttribute("class") || "");
}
Kh.prototype = {
  add: function(e) {
    var o = this._names.indexOf(e);
    o < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var o = this._names.indexOf(e);
    o >= 0 && (this._names.splice(o, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Zh(e, o) {
  for (var n = Ul(e), l = -1, c = o.length; ++l < c; ) n.add(o[l]);
}
function Jh(e, o) {
  for (var n = Ul(e), l = -1, c = o.length; ++l < c; ) n.remove(o[l]);
}
function ow(e) {
  return function() {
    Zh(this, e);
  };
}
function aw(e) {
  return function() {
    Jh(this, e);
  };
}
function sw(e, o) {
  return function() {
    (o.apply(this, arguments) ? Zh : Jh)(this, e);
  };
}
function uw(e, o) {
  var n = Qh(e + "");
  if (arguments.length < 2) {
    for (var l = Ul(this.node()), c = -1, m = n.length; ++c < m; ) if (!l.contains(n[c])) return !1;
    return !0;
  }
  return this.each((typeof o == "function" ? sw : o ? ow : aw)(n, o));
}
function lw() {
  this.textContent = "";
}
function fw(e) {
  return function() {
    this.textContent = e;
  };
}
function cw(e) {
  return function() {
    var o = e.apply(this, arguments);
    this.textContent = o ?? "";
  };
}
function hw(e) {
  return arguments.length ? this.each(e == null ? lw : (typeof e == "function" ? cw : fw)(e)) : this.node().textContent;
}
function dw() {
  this.innerHTML = "";
}
function pw(e) {
  return function() {
    this.innerHTML = e;
  };
}
function gw(e) {
  return function() {
    var o = e.apply(this, arguments);
    this.innerHTML = o ?? "";
  };
}
function vw(e) {
  return arguments.length ? this.each(e == null ? dw : (typeof e == "function" ? gw : pw)(e)) : this.node().innerHTML;
}
function mw() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function yw() {
  return this.each(mw);
}
function bw() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ww() {
  return this.each(bw);
}
function xw(e) {
  var o = typeof e == "function" ? e : $h(e);
  return this.select(function() {
    return this.appendChild(o.apply(this, arguments));
  });
}
function _w() {
  return null;
}
function Cw(e, o) {
  var n = typeof e == "function" ? e : $h(e), l = o == null ? _w : typeof o == "function" ? o : Gl(o);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), l.apply(this, arguments) || null);
  });
}
function Aw() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Sw() {
  return this.each(Aw);
}
function Ew() {
  var e = this.cloneNode(!1), o = this.parentNode;
  return o ? o.insertBefore(e, this.nextSibling) : e;
}
function Tw() {
  var e = this.cloneNode(!0), o = this.parentNode;
  return o ? o.insertBefore(e, this.nextSibling) : e;
}
function Lw(e) {
  return this.select(e ? Tw : Ew);
}
function kw(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Pw(e) {
  return function(o) {
    e.call(this, o, this.__data__);
  };
}
function Nw(e) {
  return e.trim().split(/^|\s+/).map(function(o) {
    var n = "", l = o.indexOf(".");
    return l >= 0 && (n = o.slice(l + 1), o = o.slice(0, l)), { type: o, name: n };
  });
}
function Mw(e) {
  return function() {
    var o = this.__on;
    if (o) {
      for (var n = 0, l = -1, c = o.length, m; n < c; ++n)
        m = o[n], (!e.type || m.type === e.type) && m.name === e.name ? this.removeEventListener(m.type, m.listener, m.options) : o[++l] = m;
      ++l ? o.length = l : delete this.__on;
    }
  };
}
function Dw(e, o, n) {
  return function() {
    var l = this.__on, c, m = Pw(o);
    if (l) {
      for (var g = 0, b = l.length; g < b; ++g)
        if ((c = l[g]).type === e.type && c.name === e.name) {
          this.removeEventListener(c.type, c.listener, c.options), this.addEventListener(c.type, c.listener = m, c.options = n), c.value = o;
          return;
        }
    }
    this.addEventListener(e.type, m, n), c = { type: e.type, name: e.name, value: o, listener: m, options: n }, l ? l.push(c) : this.__on = [c];
  };
}
function Ow(e, o, n) {
  var l = Nw(e + ""), c, m = l.length, g;
  if (arguments.length < 2) {
    var b = this.node().__on;
    if (b) {
      for (var p = 0, v = b.length, S; p < v; ++p)
        for (c = 0, S = b[p]; c < m; ++c)
          if ((g = l[c]).type === S.type && g.name === S.name)
            return S.value;
    }
    return;
  }
  for (b = o ? Dw : Mw, c = 0; c < m; ++c) this.each(b(l[c], o, n));
  return this;
}
function td(e, o, n) {
  var l = Yh(e), c = l.CustomEvent;
  typeof c == "function" ? c = new c(o, n) : (c = l.document.createEvent("Event"), n ? (c.initEvent(o, n.bubbles, n.cancelable), c.detail = n.detail) : c.initEvent(o, !1, !1)), e.dispatchEvent(c);
}
function Rw(e, o) {
  return function() {
    return td(this, e, o);
  };
}
function Iw(e, o) {
  return function() {
    return td(this, e, o.apply(this, arguments));
  };
}
function Bw(e, o) {
  return this.each((typeof o == "function" ? Iw : Rw)(e, o));
}
function* Fw() {
  for (var e = this._groups, o = 0, n = e.length; o < n; ++o)
    for (var l = e[o], c = 0, m = l.length, g; c < m; ++c)
      (g = l[c]) && (yield g);
}
var Vl = [null];
function hn(e, o) {
  this._groups = e, this._parents = o;
}
function ga() {
  return new hn([[document.documentElement]], Vl);
}
function zw() {
  return this;
}
hn.prototype = ga.prototype = {
  constructor: hn,
  select: hb,
  selectAll: gb,
  selectChild: bb,
  selectChildren: Cb,
  filter: Ab,
  data: Pb,
  enter: Sb,
  exit: Mb,
  join: Db,
  merge: Ob,
  selection: zw,
  order: Rb,
  sort: Ib,
  call: Fb,
  nodes: zb,
  node: qb,
  size: Hb,
  empty: Wb,
  each: $b,
  attr: Qb,
  style: tw,
  property: iw,
  classed: uw,
  text: hw,
  html: vw,
  raise: yw,
  lower: ww,
  append: xw,
  insert: Cw,
  remove: Sw,
  clone: Lw,
  datum: kw,
  on: Ow,
  dispatch: Bw,
  [Symbol.iterator]: Fw
};
function Dt(e) {
  return typeof e == "string" ? new hn([[document.querySelector(e)]], [document.documentElement]) : new hn([[e]], Vl);
}
function qw(e) {
  let o;
  for (; o = e.sourceEvent; ) e = o;
  return e;
}
function tr(e, o) {
  if (e = qw(e), o === void 0 && (o = e.currentTarget), o) {
    var n = o.ownerSVGElement || o;
    if (n.createSVGPoint) {
      var l = n.createSVGPoint();
      return l.x = e.clientX, l.y = e.clientY, l = l.matrixTransform(o.getScreenCTM().inverse()), [l.x, l.y];
    }
    if (o.getBoundingClientRect) {
      var c = o.getBoundingClientRect();
      return [e.clientX - c.left - o.clientLeft, e.clientY - c.top - o.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
function Ll(e) {
  return typeof e == "string" ? new hn([document.querySelectorAll(e)], [document.documentElement]) : new hn([Gh(e)], Vl);
}
const Hw = { passive: !1 }, sa = { capture: !0, passive: !1 };
function ml(e) {
  e.stopImmediatePropagation();
}
function co(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function ed(e) {
  var o = e.document.documentElement, n = Dt(e).on("dragstart.drag", co, sa);
  "onselectstart" in o ? n.on("selectstart.drag", co, sa) : (o.__noselect = o.style.MozUserSelect, o.style.MozUserSelect = "none");
}
function nd(e, o) {
  var n = e.document.documentElement, l = Dt(e).on("dragstart.drag", null);
  o && (l.on("click.drag", co, sa), setTimeout(function() {
    l.on("click.drag", null);
  }, 0)), "onselectstart" in n ? l.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Ss = (e) => () => e;
function kl(e, {
  sourceEvent: o,
  subject: n,
  target: l,
  identifier: c,
  active: m,
  x: g,
  y: b,
  dx: p,
  dy: v,
  dispatch: S
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: o, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: l, enumerable: !0, configurable: !0 },
    identifier: { value: c, enumerable: !0, configurable: !0 },
    active: { value: m, enumerable: !0, configurable: !0 },
    x: { value: g, enumerable: !0, configurable: !0 },
    y: { value: b, enumerable: !0, configurable: !0 },
    dx: { value: p, enumerable: !0, configurable: !0 },
    dy: { value: v, enumerable: !0, configurable: !0 },
    _: { value: S }
  });
}
kl.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function Ww(e) {
  return !e.ctrlKey && !e.button;
}
function $w() {
  return this.parentNode;
}
function Gw(e, o) {
  return o ?? { x: e.x, y: e.y };
}
function Uw() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Vw() {
  var e = Ww, o = $w, n = Gw, l = Uw, c = {}, m = tu("start", "drag", "end"), g = 0, b, p, v, S, x = 0;
  function h(P) {
    P.on("mousedown.drag", w).filter(l).on("touchstart.drag", k).on("touchmove.drag", O, Hw).on("touchend.drag touchcancel.drag", G).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function w(P, U) {
    if (!(S || !e.call(this, P, U))) {
      var Q = q(this, o.call(this, P, U), P, U, "mouse");
      Q && (Dt(P.view).on("mousemove.drag", a, sa).on("mouseup.drag", E, sa), ed(P.view), ml(P), v = !1, b = P.clientX, p = P.clientY, Q("start", P));
    }
  }
  function a(P) {
    if (co(P), !v) {
      var U = P.clientX - b, Q = P.clientY - p;
      v = U * U + Q * Q > x;
    }
    c.mouse("drag", P);
  }
  function E(P) {
    Dt(P.view).on("mousemove.drag mouseup.drag", null), nd(P.view, v), co(P), c.mouse("end", P);
  }
  function k(P, U) {
    if (e.call(this, P, U)) {
      var Q = P.changedTouches, et = o.call(this, P, U), yt = Q.length, _t, bt;
      for (_t = 0; _t < yt; ++_t)
        (bt = q(this, et, P, U, Q[_t].identifier, Q[_t])) && (ml(P), bt("start", P, Q[_t]));
    }
  }
  function O(P) {
    var U = P.changedTouches, Q = U.length, et, yt;
    for (et = 0; et < Q; ++et)
      (yt = c[U[et].identifier]) && (co(P), yt("drag", P, U[et]));
  }
  function G(P) {
    var U = P.changedTouches, Q = U.length, et, yt;
    for (S && clearTimeout(S), S = setTimeout(function() {
      S = null;
    }, 500), et = 0; et < Q; ++et)
      (yt = c[U[et].identifier]) && (ml(P), yt("end", P, U[et]));
  }
  function q(P, U, Q, et, yt, _t) {
    var bt = m.copy(), wt = tr(_t || Q, U), jt, Bt, Y;
    if ((Y = n.call(P, new kl("beforestart", {
      sourceEvent: Q,
      target: h,
      identifier: yt,
      active: g,
      x: wt[0],
      y: wt[1],
      dx: 0,
      dy: 0,
      dispatch: bt
    }), et)) != null)
      return jt = Y.x - wt[0] || 0, Bt = Y.y - wt[1] || 0, function pt(J, lt, xt) {
        var At = wt, Lt;
        switch (J) {
          case "start":
            c[yt] = pt, Lt = g++;
            break;
          case "end":
            delete c[yt], --g;
          case "drag":
            wt = tr(xt || lt, U), Lt = g;
            break;
        }
        bt.call(
          J,
          P,
          new kl(J, {
            sourceEvent: lt,
            subject: Y,
            target: h,
            identifier: yt,
            active: Lt,
            x: wt[0] + jt,
            y: wt[1] + Bt,
            dx: wt[0] - At[0],
            dy: wt[1] - At[1],
            dispatch: bt
          }),
          et
        );
      };
  }
  return h.filter = function(P) {
    return arguments.length ? (e = typeof P == "function" ? P : Ss(!!P), h) : e;
  }, h.container = function(P) {
    return arguments.length ? (o = typeof P == "function" ? P : Ss(P), h) : o;
  }, h.subject = function(P) {
    return arguments.length ? (n = typeof P == "function" ? P : Ss(P), h) : n;
  }, h.touchable = function(P) {
    return arguments.length ? (l = typeof P == "function" ? P : Ss(!!P), h) : l;
  }, h.on = function() {
    var P = m.on.apply(m, arguments);
    return P === m ? h : P;
  }, h.clickDistance = function(P) {
    return arguments.length ? (x = (P = +P) * P, h) : Math.sqrt(x);
  }, h;
}
function Xl(e, o, n) {
  e.prototype = o.prototype = n, n.constructor = e;
}
function rd(e, o) {
  var n = Object.create(e.prototype);
  for (var l in o) n[l] = o[l];
  return n;
}
function va() {
}
var ua = 0.7, $s = 1 / ua, ho = "\\s*([+-]?\\d+)\\s*", la = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", gr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Xw = /^#([0-9a-f]{3,8})$/, jw = new RegExp(`^rgb\\(${ho},${ho},${ho}\\)$`), Yw = new RegExp(`^rgb\\(${gr},${gr},${gr}\\)$`), Qw = new RegExp(`^rgba\\(${ho},${ho},${ho},${la}\\)$`), Kw = new RegExp(`^rgba\\(${gr},${gr},${gr},${la}\\)$`), Zw = new RegExp(`^hsl\\(${la},${gr},${gr}\\)$`), Jw = new RegExp(`^hsla\\(${la},${gr},${gr},${la}\\)$`), Qc = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Xl(va, Di, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Kc,
  // Deprecated! Use color.formatHex.
  formatHex: Kc,
  formatHex8: tx,
  formatHsl: ex,
  formatRgb: Zc,
  toString: Zc
});
function Kc() {
  return this.rgb().formatHex();
}
function tx() {
  return this.rgb().formatHex8();
}
function ex() {
  return id(this).formatHsl();
}
function Zc() {
  return this.rgb().formatRgb();
}
function Di(e) {
  var o, n;
  return e = (e + "").trim().toLowerCase(), (o = Xw.exec(e)) ? (n = o[1].length, o = parseInt(o[1], 16), n === 6 ? Jc(o) : n === 3 ? new bn(o >> 8 & 15 | o >> 4 & 240, o >> 4 & 15 | o & 240, (o & 15) << 4 | o & 15, 1) : n === 8 ? Es(o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, (o & 255) / 255) : n === 4 ? Es(o >> 12 & 15 | o >> 8 & 240, o >> 8 & 15 | o >> 4 & 240, o >> 4 & 15 | o & 240, ((o & 15) << 4 | o & 15) / 255) : null) : (o = jw.exec(e)) ? new bn(o[1], o[2], o[3], 1) : (o = Yw.exec(e)) ? new bn(o[1] * 255 / 100, o[2] * 255 / 100, o[3] * 255 / 100, 1) : (o = Qw.exec(e)) ? Es(o[1], o[2], o[3], o[4]) : (o = Kw.exec(e)) ? Es(o[1] * 255 / 100, o[2] * 255 / 100, o[3] * 255 / 100, o[4]) : (o = Zw.exec(e)) ? nh(o[1], o[2] / 100, o[3] / 100, 1) : (o = Jw.exec(e)) ? nh(o[1], o[2] / 100, o[3] / 100, o[4]) : Qc.hasOwnProperty(e) ? Jc(Qc[e]) : e === "transparent" ? new bn(NaN, NaN, NaN, 0) : null;
}
function Jc(e) {
  return new bn(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Es(e, o, n, l) {
  return l <= 0 && (e = o = n = NaN), new bn(e, o, n, l);
}
function nx(e) {
  return e instanceof va || (e = Di(e)), e ? (e = e.rgb(), new bn(e.r, e.g, e.b, e.opacity)) : new bn();
}
function Pl(e, o, n, l) {
  return arguments.length === 1 ? nx(e) : new bn(e, o, n, l ?? 1);
}
function bn(e, o, n, l) {
  this.r = +e, this.g = +o, this.b = +n, this.opacity = +l;
}
Xl(bn, Pl, rd(va, {
  brighter(e) {
    return e = e == null ? $s : Math.pow($s, e), new bn(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ua : Math.pow(ua, e), new bn(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new bn(Ni(this.r), Ni(this.g), Ni(this.b), Gs(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: th,
  // Deprecated! Use color.formatHex.
  formatHex: th,
  formatHex8: rx,
  formatRgb: eh,
  toString: eh
}));
function th() {
  return `#${Pi(this.r)}${Pi(this.g)}${Pi(this.b)}`;
}
function rx() {
  return `#${Pi(this.r)}${Pi(this.g)}${Pi(this.b)}${Pi((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function eh() {
  const e = Gs(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Ni(this.r)}, ${Ni(this.g)}, ${Ni(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Gs(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Ni(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Pi(e) {
  return e = Ni(e), (e < 16 ? "0" : "") + e.toString(16);
}
function nh(e, o, n, l) {
  return l <= 0 ? e = o = n = NaN : n <= 0 || n >= 1 ? e = o = NaN : o <= 0 && (e = NaN), new nr(e, o, n, l);
}
function id(e) {
  if (e instanceof nr) return new nr(e.h, e.s, e.l, e.opacity);
  if (e instanceof va || (e = Di(e)), !e) return new nr();
  if (e instanceof nr) return e;
  e = e.rgb();
  var o = e.r / 255, n = e.g / 255, l = e.b / 255, c = Math.min(o, n, l), m = Math.max(o, n, l), g = NaN, b = m - c, p = (m + c) / 2;
  return b ? (o === m ? g = (n - l) / b + (n < l) * 6 : n === m ? g = (l - o) / b + 2 : g = (o - n) / b + 4, b /= p < 0.5 ? m + c : 2 - m - c, g *= 60) : b = p > 0 && p < 1 ? 0 : g, new nr(g, b, p, e.opacity);
}
function ix(e, o, n, l) {
  return arguments.length === 1 ? id(e) : new nr(e, o, n, l ?? 1);
}
function nr(e, o, n, l) {
  this.h = +e, this.s = +o, this.l = +n, this.opacity = +l;
}
Xl(nr, ix, rd(va, {
  brighter(e) {
    return e = e == null ? $s : Math.pow($s, e), new nr(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ua : Math.pow(ua, e), new nr(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, o = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, l = n + (n < 0.5 ? n : 1 - n) * o, c = 2 * n - l;
    return new bn(
      yl(e >= 240 ? e - 240 : e + 120, c, l),
      yl(e, c, l),
      yl(e < 120 ? e + 240 : e - 120, c, l),
      this.opacity
    );
  },
  clamp() {
    return new nr(rh(this.h), Ts(this.s), Ts(this.l), Gs(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Gs(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${rh(this.h)}, ${Ts(this.s) * 100}%, ${Ts(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function rh(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Ts(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function yl(e, o, n) {
  return (e < 60 ? o + (n - o) * e / 60 : e < 180 ? n : e < 240 ? o + (n - o) * (240 - e) / 60 : o) * 255;
}
const jl = (e) => () => e;
function ox(e, o) {
  return function(n) {
    return e + n * o;
  };
}
function ax(e, o, n) {
  return e = Math.pow(e, n), o = Math.pow(o, n) - e, n = 1 / n, function(l) {
    return Math.pow(e + l * o, n);
  };
}
function sx(e) {
  return (e = +e) == 1 ? od : function(o, n) {
    return n - o ? ax(o, n, e) : jl(isNaN(o) ? n : o);
  };
}
function od(e, o) {
  var n = o - e;
  return n ? ox(e, n) : jl(isNaN(e) ? o : e);
}
const Us = function e(o) {
  var n = sx(o);
  function l(c, m) {
    var g = n((c = Pl(c)).r, (m = Pl(m)).r), b = n(c.g, m.g), p = n(c.b, m.b), v = od(c.opacity, m.opacity);
    return function(S) {
      return c.r = g(S), c.g = b(S), c.b = p(S), c.opacity = v(S), c + "";
    };
  }
  return l.gamma = e, l;
}(1);
function ux(e, o) {
  o || (o = []);
  var n = e ? Math.min(o.length, e.length) : 0, l = o.slice(), c;
  return function(m) {
    for (c = 0; c < n; ++c) l[c] = e[c] * (1 - m) + o[c] * m;
    return l;
  };
}
function lx(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function fx(e, o) {
  var n = o ? o.length : 0, l = e ? Math.min(n, e.length) : 0, c = new Array(l), m = new Array(n), g;
  for (g = 0; g < l; ++g) c[g] = Yl(e[g], o[g]);
  for (; g < n; ++g) m[g] = o[g];
  return function(b) {
    for (g = 0; g < l; ++g) m[g] = c[g](b);
    return m;
  };
}
function cx(e, o) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, o = +o, function(l) {
    return n.setTime(e * (1 - l) + o * l), n;
  };
}
function er(e, o) {
  return e = +e, o = +o, function(n) {
    return e * (1 - n) + o * n;
  };
}
function hx(e, o) {
  var n = {}, l = {}, c;
  (e === null || typeof e != "object") && (e = {}), (o === null || typeof o != "object") && (o = {});
  for (c in o)
    c in e ? n[c] = Yl(e[c], o[c]) : l[c] = o[c];
  return function(m) {
    for (c in n) l[c] = n[c](m);
    return l;
  };
}
var Nl = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, bl = new RegExp(Nl.source, "g");
function dx(e) {
  return function() {
    return e;
  };
}
function px(e) {
  return function(o) {
    return e(o) + "";
  };
}
function ad(e, o) {
  var n = Nl.lastIndex = bl.lastIndex = 0, l, c, m, g = -1, b = [], p = [];
  for (e = e + "", o = o + ""; (l = Nl.exec(e)) && (c = bl.exec(o)); )
    (m = c.index) > n && (m = o.slice(n, m), b[g] ? b[g] += m : b[++g] = m), (l = l[0]) === (c = c[0]) ? b[g] ? b[g] += c : b[++g] = c : (b[++g] = null, p.push({ i: g, x: er(l, c) })), n = bl.lastIndex;
  return n < o.length && (m = o.slice(n), b[g] ? b[g] += m : b[++g] = m), b.length < 2 ? p[0] ? px(p[0].x) : dx(o) : (o = p.length, function(v) {
    for (var S = 0, x; S < o; ++S) b[(x = p[S]).i] = x.x(v);
    return b.join("");
  });
}
function Yl(e, o) {
  var n = typeof o, l;
  return o == null || n === "boolean" ? jl(o) : (n === "number" ? er : n === "string" ? (l = Di(o)) ? (o = l, Us) : ad : o instanceof Di ? Us : o instanceof Date ? cx : lx(o) ? ux : Array.isArray(o) ? fx : typeof o.valueOf != "function" && typeof o.toString != "function" || isNaN(o) ? hx : er)(e, o);
}
function gx(e, o) {
  return e = +e, o = +o, function(n) {
    return Math.round(e * (1 - n) + o * n);
  };
}
var ih = 180 / Math.PI, Ml = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function sd(e, o, n, l, c, m) {
  var g, b, p;
  return (g = Math.sqrt(e * e + o * o)) && (e /= g, o /= g), (p = e * n + o * l) && (n -= e * p, l -= o * p), (b = Math.sqrt(n * n + l * l)) && (n /= b, l /= b, p /= b), e * l < o * n && (e = -e, o = -o, p = -p, g = -g), {
    translateX: c,
    translateY: m,
    rotate: Math.atan2(o, e) * ih,
    skewX: Math.atan(p) * ih,
    scaleX: g,
    scaleY: b
  };
}
var Ls;
function vx(e) {
  const o = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return o.isIdentity ? Ml : sd(o.a, o.b, o.c, o.d, o.e, o.f);
}
function mx(e) {
  return e == null || (Ls || (Ls = document.createElementNS("http://www.w3.org/2000/svg", "g")), Ls.setAttribute("transform", e), !(e = Ls.transform.baseVal.consolidate())) ? Ml : (e = e.matrix, sd(e.a, e.b, e.c, e.d, e.e, e.f));
}
function ud(e, o, n, l) {
  function c(v) {
    return v.length ? v.pop() + " " : "";
  }
  function m(v, S, x, h, w, a) {
    if (v !== x || S !== h) {
      var E = w.push("translate(", null, o, null, n);
      a.push({ i: E - 4, x: er(v, x) }, { i: E - 2, x: er(S, h) });
    } else (x || h) && w.push("translate(" + x + o + h + n);
  }
  function g(v, S, x, h) {
    v !== S ? (v - S > 180 ? S += 360 : S - v > 180 && (v += 360), h.push({ i: x.push(c(x) + "rotate(", null, l) - 2, x: er(v, S) })) : S && x.push(c(x) + "rotate(" + S + l);
  }
  function b(v, S, x, h) {
    v !== S ? h.push({ i: x.push(c(x) + "skewX(", null, l) - 2, x: er(v, S) }) : S && x.push(c(x) + "skewX(" + S + l);
  }
  function p(v, S, x, h, w, a) {
    if (v !== x || S !== h) {
      var E = w.push(c(w) + "scale(", null, ",", null, ")");
      a.push({ i: E - 4, x: er(v, x) }, { i: E - 2, x: er(S, h) });
    } else (x !== 1 || h !== 1) && w.push(c(w) + "scale(" + x + "," + h + ")");
  }
  return function(v, S) {
    var x = [], h = [];
    return v = e(v), S = e(S), m(v.translateX, v.translateY, S.translateX, S.translateY, x, h), g(v.rotate, S.rotate, x, h), b(v.skewX, S.skewX, x, h), p(v.scaleX, v.scaleY, S.scaleX, S.scaleY, x, h), v = S = null, function(w) {
      for (var a = -1, E = h.length, k; ++a < E; ) x[(k = h[a]).i] = k.x(w);
      return x.join("");
    };
  };
}
var yx = ud(vx, "px, ", "px)", "deg)"), bx = ud(mx, ", ", ")", ")"), wx = 1e-12;
function oh(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function xx(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function _x(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Cx = function e(o, n, l) {
  function c(m, g) {
    var b = m[0], p = m[1], v = m[2], S = g[0], x = g[1], h = g[2], w = S - b, a = x - p, E = w * w + a * a, k, O;
    if (E < wx)
      O = Math.log(h / v) / o, k = function(et) {
        return [
          b + et * w,
          p + et * a,
          v * Math.exp(o * et * O)
        ];
      };
    else {
      var G = Math.sqrt(E), q = (h * h - v * v + l * E) / (2 * v * n * G), P = (h * h - v * v - l * E) / (2 * h * n * G), U = Math.log(Math.sqrt(q * q + 1) - q), Q = Math.log(Math.sqrt(P * P + 1) - P);
      O = (Q - U) / o, k = function(et) {
        var yt = et * O, _t = oh(U), bt = v / (n * G) * (_t * _x(o * yt + U) - xx(U));
        return [
          b + bt * w,
          p + bt * a,
          v * _t / oh(o * yt + U)
        ];
      };
    }
    return k.duration = O * 1e3 * o / Math.SQRT2, k;
  }
  return c.rho = function(m) {
    var g = Math.max(1e-3, +m), b = g * g, p = b * b;
    return e(g, b, p);
  }, c;
}(Math.SQRT2, 2, 4);
var vo = 0, na = 0, Jo = 0, ld = 1e3, Vs, ra, Xs = 0, Oi = 0, nu = 0, fa = typeof performance == "object" && performance.now ? performance : Date, fd = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Ql() {
  return Oi || (fd(Ax), Oi = fa.now() + nu);
}
function Ax() {
  Oi = 0;
}
function js() {
  this._call = this._time = this._next = null;
}
js.prototype = cd.prototype = {
  constructor: js,
  restart: function(e, o, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Ql() : +n) + (o == null ? 0 : +o), !this._next && ra !== this && (ra ? ra._next = this : Vs = this, ra = this), this._call = e, this._time = n, Dl();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Dl());
  }
};
function cd(e, o, n) {
  var l = new js();
  return l.restart(e, o, n), l;
}
function Sx() {
  Ql(), ++vo;
  for (var e = Vs, o; e; )
    (o = Oi - e._time) >= 0 && e._call.call(void 0, o), e = e._next;
  --vo;
}
function ah() {
  Oi = (Xs = fa.now()) + nu, vo = na = 0;
  try {
    Sx();
  } finally {
    vo = 0, Tx(), Oi = 0;
  }
}
function Ex() {
  var e = fa.now(), o = e - Xs;
  o > ld && (nu -= o, Xs = e);
}
function Tx() {
  for (var e, o = Vs, n, l = 1 / 0; o; )
    o._call ? (l > o._time && (l = o._time), e = o, o = o._next) : (n = o._next, o._next = null, o = e ? e._next = n : Vs = n);
  ra = e, Dl(l);
}
function Dl(e) {
  if (!vo) {
    na && (na = clearTimeout(na));
    var o = e - Oi;
    o > 24 ? (e < 1 / 0 && (na = setTimeout(ah, e - fa.now() - nu)), Jo && (Jo = clearInterval(Jo))) : (Jo || (Xs = fa.now(), Jo = setInterval(Ex, ld)), vo = 1, fd(ah));
  }
}
function sh(e, o, n) {
  var l = new js();
  return o = o == null ? 0 : +o, l.restart((c) => {
    l.stop(), e(c + o);
  }, o, n), l;
}
var Lx = tu("start", "end", "cancel", "interrupt"), kx = [], hd = 0, uh = 1, Ol = 2, Is = 3, lh = 4, Rl = 5, Bs = 6;
function ru(e, o, n, l, c, m) {
  var g = e.__transition;
  if (!g) e.__transition = {};
  else if (n in g) return;
  Px(e, n, {
    name: o,
    index: l,
    // For context during callback.
    group: c,
    // For context during callback.
    on: Lx,
    tween: kx,
    time: m.time,
    delay: m.delay,
    duration: m.duration,
    ease: m.ease,
    timer: null,
    state: hd
  });
}
function Kl(e, o) {
  var n = rr(e, o);
  if (n.state > hd) throw new Error("too late; already scheduled");
  return n;
}
function yr(e, o) {
  var n = rr(e, o);
  if (n.state > Is) throw new Error("too late; already running");
  return n;
}
function rr(e, o) {
  var n = e.__transition;
  if (!n || !(n = n[o])) throw new Error("transition not found");
  return n;
}
function Px(e, o, n) {
  var l = e.__transition, c;
  l[o] = n, n.timer = cd(m, 0, n.time);
  function m(v) {
    n.state = uh, n.timer.restart(g, n.delay, n.time), n.delay <= v && g(v - n.delay);
  }
  function g(v) {
    var S, x, h, w;
    if (n.state !== uh) return p();
    for (S in l)
      if (w = l[S], w.name === n.name) {
        if (w.state === Is) return sh(g);
        w.state === lh ? (w.state = Bs, w.timer.stop(), w.on.call("interrupt", e, e.__data__, w.index, w.group), delete l[S]) : +S < o && (w.state = Bs, w.timer.stop(), w.on.call("cancel", e, e.__data__, w.index, w.group), delete l[S]);
      }
    if (sh(function() {
      n.state === Is && (n.state = lh, n.timer.restart(b, n.delay, n.time), b(v));
    }), n.state = Ol, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Ol) {
      for (n.state = Is, c = new Array(h = n.tween.length), S = 0, x = -1; S < h; ++S)
        (w = n.tween[S].value.call(e, e.__data__, n.index, n.group)) && (c[++x] = w);
      c.length = x + 1;
    }
  }
  function b(v) {
    for (var S = v < n.duration ? n.ease.call(null, v / n.duration) : (n.timer.restart(p), n.state = Rl, 1), x = -1, h = c.length; ++x < h; )
      c[x].call(e, S);
    n.state === Rl && (n.on.call("end", e, e.__data__, n.index, n.group), p());
  }
  function p() {
    n.state = Bs, n.timer.stop(), delete l[o];
    for (var v in l) return;
    delete e.__transition;
  }
}
function Fs(e, o) {
  var n = e.__transition, l, c, m = !0, g;
  if (n) {
    o = o == null ? null : o + "";
    for (g in n) {
      if ((l = n[g]).name !== o) {
        m = !1;
        continue;
      }
      c = l.state > Ol && l.state < Rl, l.state = Bs, l.timer.stop(), l.on.call(c ? "interrupt" : "cancel", e, e.__data__, l.index, l.group), delete n[g];
    }
    m && delete e.__transition;
  }
}
function Nx(e) {
  return this.each(function() {
    Fs(this, e);
  });
}
function Mx(e, o) {
  var n, l;
  return function() {
    var c = yr(this, e), m = c.tween;
    if (m !== n) {
      l = n = m;
      for (var g = 0, b = l.length; g < b; ++g)
        if (l[g].name === o) {
          l = l.slice(), l.splice(g, 1);
          break;
        }
    }
    c.tween = l;
  };
}
function Dx(e, o, n) {
  var l, c;
  if (typeof n != "function") throw new Error();
  return function() {
    var m = yr(this, e), g = m.tween;
    if (g !== l) {
      c = (l = g).slice();
      for (var b = { name: o, value: n }, p = 0, v = c.length; p < v; ++p)
        if (c[p].name === o) {
          c[p] = b;
          break;
        }
      p === v && c.push(b);
    }
    m.tween = c;
  };
}
function Ox(e, o) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var l = rr(this.node(), n).tween, c = 0, m = l.length, g; c < m; ++c)
      if ((g = l[c]).name === e)
        return g.value;
    return null;
  }
  return this.each((o == null ? Mx : Dx)(n, e, o));
}
function Zl(e, o, n) {
  var l = e._id;
  return e.each(function() {
    var c = yr(this, l);
    (c.value || (c.value = {}))[o] = n.apply(this, arguments);
  }), function(c) {
    return rr(c, l).value[o];
  };
}
function dd(e, o) {
  var n;
  return (typeof o == "number" ? er : o instanceof Di ? Us : (n = Di(o)) ? (o = n, Us) : ad)(e, o);
}
function Rx(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ix(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Bx(e, o, n) {
  var l, c = n + "", m;
  return function() {
    var g = this.getAttribute(e);
    return g === c ? null : g === l ? m : m = o(l = g, n);
  };
}
function Fx(e, o, n) {
  var l, c = n + "", m;
  return function() {
    var g = this.getAttributeNS(e.space, e.local);
    return g === c ? null : g === l ? m : m = o(l = g, n);
  };
}
function zx(e, o, n) {
  var l, c, m;
  return function() {
    var g, b = n(this), p;
    return b == null ? void this.removeAttribute(e) : (g = this.getAttribute(e), p = b + "", g === p ? null : g === l && p === c ? m : (c = p, m = o(l = g, b)));
  };
}
function qx(e, o, n) {
  var l, c, m;
  return function() {
    var g, b = n(this), p;
    return b == null ? void this.removeAttributeNS(e.space, e.local) : (g = this.getAttributeNS(e.space, e.local), p = b + "", g === p ? null : g === l && p === c ? m : (c = p, m = o(l = g, b)));
  };
}
function Hx(e, o) {
  var n = eu(e), l = n === "transform" ? bx : dd;
  return this.attrTween(e, typeof o == "function" ? (n.local ? qx : zx)(n, l, Zl(this, "attr." + e, o)) : o == null ? (n.local ? Ix : Rx)(n) : (n.local ? Fx : Bx)(n, l, o));
}
function Wx(e, o) {
  return function(n) {
    this.setAttribute(e, o.call(this, n));
  };
}
function $x(e, o) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, o.call(this, n));
  };
}
function Gx(e, o) {
  var n, l;
  function c() {
    var m = o.apply(this, arguments);
    return m !== l && (n = (l = m) && $x(e, m)), n;
  }
  return c._value = o, c;
}
function Ux(e, o) {
  var n, l;
  function c() {
    var m = o.apply(this, arguments);
    return m !== l && (n = (l = m) && Wx(e, m)), n;
  }
  return c._value = o, c;
}
function Vx(e, o) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (o == null) return this.tween(n, null);
  if (typeof o != "function") throw new Error();
  var l = eu(e);
  return this.tween(n, (l.local ? Gx : Ux)(l, o));
}
function Xx(e, o) {
  return function() {
    Kl(this, e).delay = +o.apply(this, arguments);
  };
}
function jx(e, o) {
  return o = +o, function() {
    Kl(this, e).delay = o;
  };
}
function Yx(e) {
  var o = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Xx : jx)(o, e)) : rr(this.node(), o).delay;
}
function Qx(e, o) {
  return function() {
    yr(this, e).duration = +o.apply(this, arguments);
  };
}
function Kx(e, o) {
  return o = +o, function() {
    yr(this, e).duration = o;
  };
}
function Zx(e) {
  var o = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Qx : Kx)(o, e)) : rr(this.node(), o).duration;
}
function Jx(e, o) {
  if (typeof o != "function") throw new Error();
  return function() {
    yr(this, e).ease = o;
  };
}
function t1(e) {
  var o = this._id;
  return arguments.length ? this.each(Jx(o, e)) : rr(this.node(), o).ease;
}
function e1(e, o) {
  return function() {
    var n = o.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    yr(this, e).ease = n;
  };
}
function n1(e) {
  if (typeof e != "function") throw new Error();
  return this.each(e1(this._id, e));
}
function r1(e) {
  typeof e != "function" && (e = Vh(e));
  for (var o = this._groups, n = o.length, l = new Array(n), c = 0; c < n; ++c)
    for (var m = o[c], g = m.length, b = l[c] = [], p, v = 0; v < g; ++v)
      (p = m[v]) && e.call(p, p.__data__, v, m) && b.push(p);
  return new qr(l, this._parents, this._name, this._id);
}
function i1(e) {
  if (e._id !== this._id) throw new Error();
  for (var o = this._groups, n = e._groups, l = o.length, c = n.length, m = Math.min(l, c), g = new Array(l), b = 0; b < m; ++b)
    for (var p = o[b], v = n[b], S = p.length, x = g[b] = new Array(S), h, w = 0; w < S; ++w)
      (h = p[w] || v[w]) && (x[w] = h);
  for (; b < l; ++b)
    g[b] = o[b];
  return new qr(g, this._parents, this._name, this._id);
}
function o1(e) {
  return (e + "").trim().split(/^|\s+/).every(function(o) {
    var n = o.indexOf(".");
    return n >= 0 && (o = o.slice(0, n)), !o || o === "start";
  });
}
function a1(e, o, n) {
  var l, c, m = o1(o) ? Kl : yr;
  return function() {
    var g = m(this, e), b = g.on;
    b !== l && (c = (l = b).copy()).on(o, n), g.on = c;
  };
}
function s1(e, o) {
  var n = this._id;
  return arguments.length < 2 ? rr(this.node(), n).on.on(e) : this.each(a1(n, e, o));
}
function u1(e) {
  return function() {
    var o = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    o && o.removeChild(this);
  };
}
function l1() {
  return this.on("end.remove", u1(this._id));
}
function f1(e) {
  var o = this._name, n = this._id;
  typeof e != "function" && (e = Gl(e));
  for (var l = this._groups, c = l.length, m = new Array(c), g = 0; g < c; ++g)
    for (var b = l[g], p = b.length, v = m[g] = new Array(p), S, x, h = 0; h < p; ++h)
      (S = b[h]) && (x = e.call(S, S.__data__, h, b)) && ("__data__" in S && (x.__data__ = S.__data__), v[h] = x, ru(v[h], o, n, h, v, rr(S, n)));
  return new qr(m, this._parents, o, n);
}
function c1(e) {
  var o = this._name, n = this._id;
  typeof e != "function" && (e = Uh(e));
  for (var l = this._groups, c = l.length, m = [], g = [], b = 0; b < c; ++b)
    for (var p = l[b], v = p.length, S, x = 0; x < v; ++x)
      if (S = p[x]) {
        for (var h = e.call(S, S.__data__, x, p), w, a = rr(S, n), E = 0, k = h.length; E < k; ++E)
          (w = h[E]) && ru(w, o, n, E, h, a);
        m.push(h), g.push(S);
      }
  return new qr(m, g, o, n);
}
var h1 = ga.prototype.constructor;
function d1() {
  return new h1(this._groups, this._parents);
}
function p1(e, o) {
  var n, l, c;
  return function() {
    var m = go(this, e), g = (this.style.removeProperty(e), go(this, e));
    return m === g ? null : m === n && g === l ? c : c = o(n = m, l = g);
  };
}
function pd(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function g1(e, o, n) {
  var l, c = n + "", m;
  return function() {
    var g = go(this, e);
    return g === c ? null : g === l ? m : m = o(l = g, n);
  };
}
function v1(e, o, n) {
  var l, c, m;
  return function() {
    var g = go(this, e), b = n(this), p = b + "";
    return b == null && (p = b = (this.style.removeProperty(e), go(this, e))), g === p ? null : g === l && p === c ? m : (c = p, m = o(l = g, b));
  };
}
function m1(e, o) {
  var n, l, c, m = "style." + o, g = "end." + m, b;
  return function() {
    var p = yr(this, e), v = p.on, S = p.value[m] == null ? b || (b = pd(o)) : void 0;
    (v !== n || c !== S) && (l = (n = v).copy()).on(g, c = S), p.on = l;
  };
}
function y1(e, o, n) {
  var l = (e += "") == "transform" ? yx : dd;
  return o == null ? this.styleTween(e, p1(e, l)).on("end.style." + e, pd(e)) : typeof o == "function" ? this.styleTween(e, v1(e, l, Zl(this, "style." + e, o))).each(m1(this._id, e)) : this.styleTween(e, g1(e, l, o), n).on("end.style." + e, null);
}
function b1(e, o, n) {
  return function(l) {
    this.style.setProperty(e, o.call(this, l), n);
  };
}
function w1(e, o, n) {
  var l, c;
  function m() {
    var g = o.apply(this, arguments);
    return g !== c && (l = (c = g) && b1(e, g, n)), l;
  }
  return m._value = o, m;
}
function x1(e, o, n) {
  var l = "style." + (e += "");
  if (arguments.length < 2) return (l = this.tween(l)) && l._value;
  if (o == null) return this.tween(l, null);
  if (typeof o != "function") throw new Error();
  return this.tween(l, w1(e, o, n ?? ""));
}
function _1(e) {
  return function() {
    this.textContent = e;
  };
}
function C1(e) {
  return function() {
    var o = e(this);
    this.textContent = o ?? "";
  };
}
function A1(e) {
  return this.tween("text", typeof e == "function" ? C1(Zl(this, "text", e)) : _1(e == null ? "" : e + ""));
}
function S1(e) {
  return function(o) {
    this.textContent = e.call(this, o);
  };
}
function E1(e) {
  var o, n;
  function l() {
    var c = e.apply(this, arguments);
    return c !== n && (o = (n = c) && S1(c)), o;
  }
  return l._value = e, l;
}
function T1(e) {
  var o = "text";
  if (arguments.length < 1) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, E1(e));
}
function L1() {
  for (var e = this._name, o = this._id, n = gd(), l = this._groups, c = l.length, m = 0; m < c; ++m)
    for (var g = l[m], b = g.length, p, v = 0; v < b; ++v)
      if (p = g[v]) {
        var S = rr(p, o);
        ru(p, e, n, v, g, {
          time: S.time + S.delay + S.duration,
          delay: 0,
          duration: S.duration,
          ease: S.ease
        });
      }
  return new qr(l, this._parents, e, n);
}
function k1() {
  var e, o, n = this, l = n._id, c = n.size();
  return new Promise(function(m, g) {
    var b = { value: g }, p = { value: function() {
      --c === 0 && m();
    } };
    n.each(function() {
      var v = yr(this, l), S = v.on;
      S !== e && (o = (e = S).copy(), o._.cancel.push(b), o._.interrupt.push(b), o._.end.push(p)), v.on = o;
    }), c === 0 && m();
  });
}
var P1 = 0;
function qr(e, o, n, l) {
  this._groups = e, this._parents = o, this._name = n, this._id = l;
}
function gd() {
  return ++P1;
}
var Br = ga.prototype;
qr.prototype = {
  constructor: qr,
  select: f1,
  selectAll: c1,
  selectChild: Br.selectChild,
  selectChildren: Br.selectChildren,
  filter: r1,
  merge: i1,
  selection: d1,
  transition: L1,
  call: Br.call,
  nodes: Br.nodes,
  node: Br.node,
  size: Br.size,
  empty: Br.empty,
  each: Br.each,
  on: s1,
  attr: Hx,
  attrTween: Vx,
  style: y1,
  styleTween: x1,
  text: A1,
  textTween: T1,
  remove: l1,
  tween: Ox,
  delay: Yx,
  duration: Zx,
  ease: t1,
  easeVarying: n1,
  end: k1,
  [Symbol.iterator]: Br[Symbol.iterator]
};
function N1(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var M1 = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: N1
};
function D1(e, o) {
  for (var n; !(n = e.__transition) || !(n = n[o]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${o} not found`);
  return n;
}
function O1(e) {
  var o, n;
  e instanceof qr ? (o = e._id, e = e._name) : (o = gd(), (n = M1).time = Ql(), e = e == null ? null : e + "");
  for (var l = this._groups, c = l.length, m = 0; m < c; ++m)
    for (var g = l[m], b = g.length, p, v = 0; v < b; ++v)
      (p = g[v]) && ru(p, e, o, v, g, n || D1(p, o));
  return new qr(l, this._parents, e, o);
}
ga.prototype.interrupt = Nx;
ga.prototype.transition = O1;
function R1(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function Ys(e, o) {
  if ((n = (e = o ? e.toExponential(o - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var n, l = e.slice(0, n);
  return [
    l.length > 1 ? l[0] + l.slice(2) : l,
    +e.slice(n + 1)
  ];
}
function mo(e) {
  return e = Ys(Math.abs(e)), e ? e[1] : NaN;
}
function I1(e, o) {
  return function(n, l) {
    for (var c = n.length, m = [], g = 0, b = e[0], p = 0; c > 0 && b > 0 && (p + b + 1 > l && (b = Math.max(1, l - p)), m.push(n.substring(c -= b, c + b)), !((p += b + 1) > l)); )
      b = e[g = (g + 1) % e.length];
    return m.reverse().join(o);
  };
}
function B1(e) {
  return function(o) {
    return o.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var F1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Qs(e) {
  if (!(o = F1.exec(e))) throw new Error("invalid format: " + e);
  var o;
  return new Jl({
    fill: o[1],
    align: o[2],
    sign: o[3],
    symbol: o[4],
    zero: o[5],
    width: o[6],
    comma: o[7],
    precision: o[8] && o[8].slice(1),
    trim: o[9],
    type: o[10]
  });
}
Qs.prototype = Jl.prototype;
function Jl(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Jl.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function z1(e) {
  t: for (var o = e.length, n = 1, l = -1, c; n < o; ++n)
    switch (e[n]) {
      case ".":
        l = c = n;
        break;
      case "0":
        l === 0 && (l = n), c = n;
        break;
      default:
        if (!+e[n]) break t;
        l > 0 && (l = 0);
        break;
    }
  return l > 0 ? e.slice(0, l) + e.slice(c + 1) : e;
}
var vd;
function q1(e, o) {
  var n = Ys(e, o);
  if (!n) return e + "";
  var l = n[0], c = n[1], m = c - (vd = Math.max(-8, Math.min(8, Math.floor(c / 3))) * 3) + 1, g = l.length;
  return m === g ? l : m > g ? l + new Array(m - g + 1).join("0") : m > 0 ? l.slice(0, m) + "." + l.slice(m) : "0." + new Array(1 - m).join("0") + Ys(e, Math.max(0, o + m - 1))[0];
}
function fh(e, o) {
  var n = Ys(e, o);
  if (!n) return e + "";
  var l = n[0], c = n[1];
  return c < 0 ? "0." + new Array(-c).join("0") + l : l.length > c + 1 ? l.slice(0, c + 1) + "." + l.slice(c + 1) : l + new Array(c - l.length + 2).join("0");
}
const ch = {
  "%": (e, o) => (e * 100).toFixed(o),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: R1,
  e: (e, o) => e.toExponential(o),
  f: (e, o) => e.toFixed(o),
  g: (e, o) => e.toPrecision(o),
  o: (e) => Math.round(e).toString(8),
  p: (e, o) => fh(e * 100, o),
  r: fh,
  s: q1,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function hh(e) {
  return e;
}
var dh = Array.prototype.map, ph = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function H1(e) {
  var o = e.grouping === void 0 || e.thousands === void 0 ? hh : I1(dh.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", l = e.currency === void 0 ? "" : e.currency[1] + "", c = e.decimal === void 0 ? "." : e.decimal + "", m = e.numerals === void 0 ? hh : B1(dh.call(e.numerals, String)), g = e.percent === void 0 ? "%" : e.percent + "", b = e.minus === void 0 ? "−" : e.minus + "", p = e.nan === void 0 ? "NaN" : e.nan + "";
  function v(x) {
    x = Qs(x);
    var h = x.fill, w = x.align, a = x.sign, E = x.symbol, k = x.zero, O = x.width, G = x.comma, q = x.precision, P = x.trim, U = x.type;
    U === "n" ? (G = !0, U = "g") : ch[U] || (q === void 0 && (q = 12), P = !0, U = "g"), (k || h === "0" && w === "=") && (k = !0, h = "0", w = "=");
    var Q = E === "$" ? n : E === "#" && /[boxX]/.test(U) ? "0" + U.toLowerCase() : "", et = E === "$" ? l : /[%p]/.test(U) ? g : "", yt = ch[U], _t = /[defgprs%]/.test(U);
    q = q === void 0 ? 6 : /[gprs]/.test(U) ? Math.max(1, Math.min(21, q)) : Math.max(0, Math.min(20, q));
    function bt(wt) {
      var jt = Q, Bt = et, Y, pt, J;
      if (U === "c")
        Bt = yt(wt) + Bt, wt = "";
      else {
        wt = +wt;
        var lt = wt < 0 || 1 / wt < 0;
        if (wt = isNaN(wt) ? p : yt(Math.abs(wt), q), P && (wt = z1(wt)), lt && +wt == 0 && a !== "+" && (lt = !1), jt = (lt ? a === "(" ? a : b : a === "-" || a === "(" ? "" : a) + jt, Bt = (U === "s" ? ph[8 + vd / 3] : "") + Bt + (lt && a === "(" ? ")" : ""), _t) {
          for (Y = -1, pt = wt.length; ++Y < pt; )
            if (J = wt.charCodeAt(Y), 48 > J || J > 57) {
              Bt = (J === 46 ? c + wt.slice(Y + 1) : wt.slice(Y)) + Bt, wt = wt.slice(0, Y);
              break;
            }
        }
      }
      G && !k && (wt = o(wt, 1 / 0));
      var xt = jt.length + wt.length + Bt.length, At = xt < O ? new Array(O - xt + 1).join(h) : "";
      switch (G && k && (wt = o(At + wt, At.length ? O - Bt.length : 1 / 0), At = ""), w) {
        case "<":
          wt = jt + wt + Bt + At;
          break;
        case "=":
          wt = jt + At + wt + Bt;
          break;
        case "^":
          wt = At.slice(0, xt = At.length >> 1) + jt + wt + Bt + At.slice(xt);
          break;
        default:
          wt = At + jt + wt + Bt;
          break;
      }
      return m(wt);
    }
    return bt.toString = function() {
      return x + "";
    }, bt;
  }
  function S(x, h) {
    var w = v((x = Qs(x), x.type = "f", x)), a = Math.max(-8, Math.min(8, Math.floor(mo(h) / 3))) * 3, E = Math.pow(10, -a), k = ph[8 + a / 3];
    return function(O) {
      return w(E * O) + k;
    };
  }
  return {
    format: v,
    formatPrefix: S
  };
}
var ks, md, yd;
W1({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function W1(e) {
  return ks = H1(e), md = ks.format, yd = ks.formatPrefix, ks;
}
function $1(e) {
  return Math.max(0, -mo(Math.abs(e)));
}
function G1(e, o) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(mo(o) / 3))) * 3 - mo(Math.abs(e)));
}
function U1(e, o) {
  return e = Math.abs(e), o = Math.abs(o) - e, Math.max(0, mo(o) - mo(e)) + 1;
}
function V1(e, o) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(o).domain(e);
      break;
  }
  return this;
}
function X1(e) {
  return function() {
    return e;
  };
}
function j1(e) {
  return +e;
}
var gh = [0, 1];
function fo(e) {
  return e;
}
function Il(e, o) {
  return (o -= e = +e) ? function(n) {
    return (n - e) / o;
  } : X1(isNaN(o) ? NaN : 0.5);
}
function Y1(e, o) {
  var n;
  return e > o && (n = e, e = o, o = n), function(l) {
    return Math.max(e, Math.min(o, l));
  };
}
function Q1(e, o, n) {
  var l = e[0], c = e[1], m = o[0], g = o[1];
  return c < l ? (l = Il(c, l), m = n(g, m)) : (l = Il(l, c), m = n(m, g)), function(b) {
    return m(l(b));
  };
}
function K1(e, o, n) {
  var l = Math.min(e.length, o.length) - 1, c = new Array(l), m = new Array(l), g = -1;
  for (e[l] < e[0] && (e = e.slice().reverse(), o = o.slice().reverse()); ++g < l; )
    c[g] = Il(e[g], e[g + 1]), m[g] = n(o[g], o[g + 1]);
  return function(b) {
    var p = tb(e, b, 1, l) - 1;
    return m[p](c[p](b));
  };
}
function Z1(e, o) {
  return o.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function J1() {
  var e = gh, o = gh, n = Yl, l, c, m, g = fo, b, p, v;
  function S() {
    var h = Math.min(e.length, o.length);
    return g !== fo && (g = Y1(e[0], e[h - 1])), b = h > 2 ? K1 : Q1, p = v = null, x;
  }
  function x(h) {
    return h == null || isNaN(h = +h) ? m : (p || (p = b(e.map(l), o, n)))(l(g(h)));
  }
  return x.invert = function(h) {
    return g(c((v || (v = b(o, e.map(l), er)))(h)));
  }, x.domain = function(h) {
    return arguments.length ? (e = Array.from(h, j1), S()) : e.slice();
  }, x.range = function(h) {
    return arguments.length ? (o = Array.from(h), S()) : o.slice();
  }, x.rangeRound = function(h) {
    return o = Array.from(h), n = gx, S();
  }, x.clamp = function(h) {
    return arguments.length ? (g = h ? !0 : fo, S()) : g !== fo;
  }, x.interpolate = function(h) {
    return arguments.length ? (n = h, S()) : n;
  }, x.unknown = function(h) {
    return arguments.length ? (m = h, x) : m;
  }, function(h, w) {
    return l = h, c = w, S();
  };
}
function t_() {
  return J1()(fo, fo);
}
function e_(e, o, n, l) {
  var c = ob(e, o, n), m;
  switch (l = Qs(l ?? ",f"), l.type) {
    case "s": {
      var g = Math.max(Math.abs(e), Math.abs(o));
      return l.precision == null && !isNaN(m = G1(c, g)) && (l.precision = m), yd(l, g);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      l.precision == null && !isNaN(m = U1(c, Math.max(Math.abs(e), Math.abs(o)))) && (l.precision = m - (l.type === "e"));
      break;
    }
    case "f":
    case "%": {
      l.precision == null && !isNaN(m = $1(c)) && (l.precision = m - (l.type === "%") * 2);
      break;
    }
  }
  return md(l);
}
function n_(e) {
  var o = e.domain;
  return e.ticks = function(n) {
    var l = o();
    return ib(l[0], l[l.length - 1], n ?? 10);
  }, e.tickFormat = function(n, l) {
    var c = o();
    return e_(c[0], c[c.length - 1], n ?? 10, l);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var l = o(), c = 0, m = l.length - 1, g = l[c], b = l[m], p, v, S = 10;
    for (b < g && (v = g, g = b, b = v, v = c, c = m, m = v); S-- > 0; ) {
      if (v = El(g, b, n), v === p)
        return l[c] = g, l[m] = b, o(l);
      if (v > 0)
        g = Math.floor(g / v) * v, b = Math.ceil(b / v) * v;
      else if (v < 0)
        g = Math.ceil(g * v) / v, b = Math.floor(b * v) / v;
      else
        break;
      p = v;
    }
    return e;
  }, e;
}
function Ii() {
  var e = t_();
  return e.copy = function() {
    return Z1(e, Ii());
  }, V1.apply(e, arguments), n_(e);
}
const Ps = (e) => () => e;
function r_(e, {
  sourceEvent: o,
  target: n,
  transform: l,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: o, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: l, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
function zr(e, o, n) {
  this.k = e, this.x = o, this.y = n;
}
zr.prototype = {
  constructor: zr,
  scale: function(e) {
    return e === 1 ? this : new zr(this.k * e, this.x, this.y);
  },
  translate: function(e, o) {
    return e === 0 & o === 0 ? this : new zr(this.k, this.x + this.k * e, this.y + this.k * o);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var tf = new zr(1, 0, 0);
uo.prototype = zr.prototype;
function uo(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return tf;
  return e.__zoom;
}
function wl(e) {
  e.stopImmediatePropagation();
}
function ta(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function i_(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function o_() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function vh() {
  return this.__zoom || tf;
}
function a_(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function s_() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function u_(e, o, n) {
  var l = e.invertX(o[0][0]) - n[0][0], c = e.invertX(o[1][0]) - n[1][0], m = e.invertY(o[0][1]) - n[0][1], g = e.invertY(o[1][1]) - n[1][1];
  return e.translate(
    c > l ? (l + c) / 2 : Math.min(0, l) || Math.max(0, c),
    g > m ? (m + g) / 2 : Math.min(0, m) || Math.max(0, g)
  );
}
function l_() {
  var e = i_, o = o_, n = u_, l = a_, c = s_, m = [0, 1 / 0], g = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], b = 250, p = Cx, v = tu("start", "zoom", "end"), S, x, h, w = 500, a = 150, E = 0, k = 10;
  function O(Y) {
    Y.property("__zoom", vh).on("wheel.zoom", yt, { passive: !1 }).on("mousedown.zoom", _t).on("dblclick.zoom", bt).filter(c).on("touchstart.zoom", wt).on("touchmove.zoom", jt).on("touchend.zoom touchcancel.zoom", Bt).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  O.transform = function(Y, pt, J, lt) {
    var xt = Y.selection ? Y.selection() : Y;
    xt.property("__zoom", vh), Y !== xt ? U(Y, pt, J, lt) : xt.interrupt().each(function() {
      Q(this, arguments).event(lt).start().zoom(null, typeof pt == "function" ? pt.apply(this, arguments) : pt).end();
    });
  }, O.scaleBy = function(Y, pt, J, lt) {
    O.scaleTo(Y, function() {
      var xt = this.__zoom.k, At = typeof pt == "function" ? pt.apply(this, arguments) : pt;
      return xt * At;
    }, J, lt);
  }, O.scaleTo = function(Y, pt, J, lt) {
    O.transform(Y, function() {
      var xt = o.apply(this, arguments), At = this.__zoom, Lt = J == null ? P(xt) : typeof J == "function" ? J.apply(this, arguments) : J, j = At.invert(Lt), kt = typeof pt == "function" ? pt.apply(this, arguments) : pt;
      return n(q(G(At, kt), Lt, j), xt, g);
    }, J, lt);
  }, O.translateBy = function(Y, pt, J, lt) {
    O.transform(Y, function() {
      return n(this.__zoom.translate(
        typeof pt == "function" ? pt.apply(this, arguments) : pt,
        typeof J == "function" ? J.apply(this, arguments) : J
      ), o.apply(this, arguments), g);
    }, null, lt);
  }, O.translateTo = function(Y, pt, J, lt, xt) {
    O.transform(Y, function() {
      var At = o.apply(this, arguments), Lt = this.__zoom, j = lt == null ? P(At) : typeof lt == "function" ? lt.apply(this, arguments) : lt;
      return n(tf.translate(j[0], j[1]).scale(Lt.k).translate(
        typeof pt == "function" ? -pt.apply(this, arguments) : -pt,
        typeof J == "function" ? -J.apply(this, arguments) : -J
      ), At, g);
    }, lt, xt);
  };
  function G(Y, pt) {
    return pt = Math.max(m[0], Math.min(m[1], pt)), pt === Y.k ? Y : new zr(pt, Y.x, Y.y);
  }
  function q(Y, pt, J) {
    var lt = pt[0] - J[0] * Y.k, xt = pt[1] - J[1] * Y.k;
    return lt === Y.x && xt === Y.y ? Y : new zr(Y.k, lt, xt);
  }
  function P(Y) {
    return [(+Y[0][0] + +Y[1][0]) / 2, (+Y[0][1] + +Y[1][1]) / 2];
  }
  function U(Y, pt, J, lt) {
    Y.on("start.zoom", function() {
      Q(this, arguments).event(lt).start();
    }).on("interrupt.zoom end.zoom", function() {
      Q(this, arguments).event(lt).end();
    }).tween("zoom", function() {
      var xt = this, At = arguments, Lt = Q(xt, At).event(lt), j = o.apply(xt, At), kt = J == null ? P(j) : typeof J == "function" ? J.apply(xt, At) : J, le = Math.max(j[1][0] - j[0][0], j[1][1] - j[0][1]), zt = xt.__zoom, ie = typeof pt == "function" ? pt.apply(xt, At) : pt, de = p(zt.invert(kt).concat(le / zt.k), ie.invert(kt).concat(le / ie.k));
      return function(oe) {
        if (oe === 1) oe = ie;
        else {
          var Yt = de(oe), Be = le / Yt[2];
          oe = new zr(Be, kt[0] - Yt[0] * Be, kt[1] - Yt[1] * Be);
        }
        Lt.zoom(null, oe);
      };
    });
  }
  function Q(Y, pt, J) {
    return !J && Y.__zooming || new et(Y, pt);
  }
  function et(Y, pt) {
    this.that = Y, this.args = pt, this.active = 0, this.sourceEvent = null, this.extent = o.apply(Y, pt), this.taps = 0;
  }
  et.prototype = {
    event: function(Y) {
      return Y && (this.sourceEvent = Y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(Y, pt) {
      return this.mouse && Y !== "mouse" && (this.mouse[1] = pt.invert(this.mouse[0])), this.touch0 && Y !== "touch" && (this.touch0[1] = pt.invert(this.touch0[0])), this.touch1 && Y !== "touch" && (this.touch1[1] = pt.invert(this.touch1[0])), this.that.__zoom = pt, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(Y) {
      var pt = Dt(this.that).datum();
      v.call(
        Y,
        this.that,
        new r_(Y, {
          sourceEvent: this.sourceEvent,
          target: O,
          type: Y,
          transform: this.that.__zoom,
          dispatch: v
        }),
        pt
      );
    }
  };
  function yt(Y, ...pt) {
    if (!e.apply(this, arguments)) return;
    var J = Q(this, pt).event(Y), lt = this.__zoom, xt = Math.max(m[0], Math.min(m[1], lt.k * Math.pow(2, l.apply(this, arguments)))), At = tr(Y);
    if (J.wheel)
      (J.mouse[0][0] !== At[0] || J.mouse[0][1] !== At[1]) && (J.mouse[1] = lt.invert(J.mouse[0] = At)), clearTimeout(J.wheel);
    else {
      if (lt.k === xt) return;
      J.mouse = [At, lt.invert(At)], Fs(this), J.start();
    }
    ta(Y), J.wheel = setTimeout(Lt, a), J.zoom("mouse", n(q(G(lt, xt), J.mouse[0], J.mouse[1]), J.extent, g));
    function Lt() {
      J.wheel = null, J.end();
    }
  }
  function _t(Y, ...pt) {
    if (h || !e.apply(this, arguments)) return;
    var J = Y.currentTarget, lt = Q(this, pt, !0).event(Y), xt = Dt(Y.view).on("mousemove.zoom", kt, !0).on("mouseup.zoom", le, !0), At = tr(Y, J), Lt = Y.clientX, j = Y.clientY;
    ed(Y.view), wl(Y), lt.mouse = [At, this.__zoom.invert(At)], Fs(this), lt.start();
    function kt(zt) {
      if (ta(zt), !lt.moved) {
        var ie = zt.clientX - Lt, de = zt.clientY - j;
        lt.moved = ie * ie + de * de > E;
      }
      lt.event(zt).zoom("mouse", n(q(lt.that.__zoom, lt.mouse[0] = tr(zt, J), lt.mouse[1]), lt.extent, g));
    }
    function le(zt) {
      xt.on("mousemove.zoom mouseup.zoom", null), nd(zt.view, lt.moved), ta(zt), lt.event(zt).end();
    }
  }
  function bt(Y, ...pt) {
    if (e.apply(this, arguments)) {
      var J = this.__zoom, lt = tr(Y.changedTouches ? Y.changedTouches[0] : Y, this), xt = J.invert(lt), At = J.k * (Y.shiftKey ? 0.5 : 2), Lt = n(q(G(J, At), lt, xt), o.apply(this, pt), g);
      ta(Y), b > 0 ? Dt(this).transition().duration(b).call(U, Lt, lt, Y) : Dt(this).call(O.transform, Lt, lt, Y);
    }
  }
  function wt(Y, ...pt) {
    if (e.apply(this, arguments)) {
      var J = Y.touches, lt = J.length, xt = Q(this, pt, Y.changedTouches.length === lt).event(Y), At, Lt, j, kt;
      for (wl(Y), Lt = 0; Lt < lt; ++Lt)
        j = J[Lt], kt = tr(j, this), kt = [kt, this.__zoom.invert(kt), j.identifier], xt.touch0 ? !xt.touch1 && xt.touch0[2] !== kt[2] && (xt.touch1 = kt, xt.taps = 0) : (xt.touch0 = kt, At = !0, xt.taps = 1 + !!S);
      S && (S = clearTimeout(S)), At && (xt.taps < 2 && (x = kt[0], S = setTimeout(function() {
        S = null;
      }, w)), Fs(this), xt.start());
    }
  }
  function jt(Y, ...pt) {
    if (this.__zooming) {
      var J = Q(this, pt).event(Y), lt = Y.changedTouches, xt = lt.length, At, Lt, j, kt;
      for (ta(Y), At = 0; At < xt; ++At)
        Lt = lt[At], j = tr(Lt, this), J.touch0 && J.touch0[2] === Lt.identifier ? J.touch0[0] = j : J.touch1 && J.touch1[2] === Lt.identifier && (J.touch1[0] = j);
      if (Lt = J.that.__zoom, J.touch1) {
        var le = J.touch0[0], zt = J.touch0[1], ie = J.touch1[0], de = J.touch1[1], oe = (oe = ie[0] - le[0]) * oe + (oe = ie[1] - le[1]) * oe, Yt = (Yt = de[0] - zt[0]) * Yt + (Yt = de[1] - zt[1]) * Yt;
        Lt = G(Lt, Math.sqrt(oe / Yt)), j = [(le[0] + ie[0]) / 2, (le[1] + ie[1]) / 2], kt = [(zt[0] + de[0]) / 2, (zt[1] + de[1]) / 2];
      } else if (J.touch0) j = J.touch0[0], kt = J.touch0[1];
      else return;
      J.zoom("touch", n(q(Lt, j, kt), J.extent, g));
    }
  }
  function Bt(Y, ...pt) {
    if (this.__zooming) {
      var J = Q(this, pt).event(Y), lt = Y.changedTouches, xt = lt.length, At, Lt;
      for (wl(Y), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, w), At = 0; At < xt; ++At)
        Lt = lt[At], J.touch0 && J.touch0[2] === Lt.identifier ? delete J.touch0 : J.touch1 && J.touch1[2] === Lt.identifier && delete J.touch1;
      if (J.touch1 && !J.touch0 && (J.touch0 = J.touch1, delete J.touch1), J.touch0) J.touch0[1] = this.__zoom.invert(J.touch0[0]);
      else if (J.end(), J.taps === 2 && (Lt = tr(Lt, this), Math.hypot(x[0] - Lt[0], x[1] - Lt[1]) < k)) {
        var j = Dt(this).on("dblclick.zoom");
        j && j.apply(this, arguments);
      }
    }
  }
  return O.wheelDelta = function(Y) {
    return arguments.length ? (l = typeof Y == "function" ? Y : Ps(+Y), O) : l;
  }, O.filter = function(Y) {
    return arguments.length ? (e = typeof Y == "function" ? Y : Ps(!!Y), O) : e;
  }, O.touchable = function(Y) {
    return arguments.length ? (c = typeof Y == "function" ? Y : Ps(!!Y), O) : c;
  }, O.extent = function(Y) {
    return arguments.length ? (o = typeof Y == "function" ? Y : Ps([[+Y[0][0], +Y[0][1]], [+Y[1][0], +Y[1][1]]]), O) : o;
  }, O.scaleExtent = function(Y) {
    return arguments.length ? (m[0] = +Y[0], m[1] = +Y[1], O) : [m[0], m[1]];
  }, O.translateExtent = function(Y) {
    return arguments.length ? (g[0][0] = +Y[0][0], g[1][0] = +Y[1][0], g[0][1] = +Y[0][1], g[1][1] = +Y[1][1], O) : [[g[0][0], g[0][1]], [g[1][0], g[1][1]]];
  }, O.constrain = function(Y) {
    return arguments.length ? (n = Y, O) : n;
  }, O.duration = function(Y) {
    return arguments.length ? (b = +Y, O) : b;
  }, O.interpolate = function(Y) {
    return arguments.length ? (p = Y, O) : p;
  }, O.on = function() {
    var Y = v.on.apply(v, arguments);
    return Y === v ? O : Y;
  }, O.clickDistance = function(Y) {
    return arguments.length ? (E = (Y = +Y) * Y, O) : Math.sqrt(E);
  }, O.tapDistance = function(Y) {
    return arguments.length ? (k = +Y, O) : k;
  }, O;
}
var bd = { exports: {} };
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */
(function(e) {
  (function(o, n) {
    e.exports = o.document ? n(o, !0) : function(l) {
      if (!l.document)
        throw new Error("jQuery requires a window with a document");
      return n(l);
    };
  })(typeof window < "u" ? window : ki, function(o, n) {
    var l = [], c = o.document, m = l.slice, g = l.concat, b = l.push, p = l.indexOf, v = {}, S = v.toString, x = v.hasOwnProperty, h = {}, w = "1.12.4", a = function(i, s) {
      return new a.fn.init(i, s);
    }, E = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, k = /^-ms-/, O = /-([\da-z])/gi, G = function(i, s) {
      return s.toUpperCase();
    };
    a.fn = a.prototype = {
      // The current version of jQuery being used
      jquery: w,
      constructor: a,
      // Start with an empty selector
      selector: "",
      // The default length of a jQuery object is 0
      length: 0,
      toArray: function() {
        return m.call(this);
      },
      // Get the Nth element in the matched element set OR
      // Get the whole matched element set as a clean array
      get: function(i) {
        return i != null ? (
          // Return just the one element from the set
          i < 0 ? this[i + this.length] : this[i]
        ) : (
          // Return all the elements in a clean array
          m.call(this)
        );
      },
      // Take an array of elements and push it onto the stack
      // (returning the new matched element set)
      pushStack: function(i) {
        var s = a.merge(this.constructor(), i);
        return s.prevObject = this, s.context = this.context, s;
      },
      // Execute a callback for every element in the matched set.
      each: function(i) {
        return a.each(this, i);
      },
      map: function(i) {
        return this.pushStack(a.map(this, function(s, f) {
          return i.call(s, f, s);
        }));
      },
      slice: function() {
        return this.pushStack(m.apply(this, arguments));
      },
      first: function() {
        return this.eq(0);
      },
      last: function() {
        return this.eq(-1);
      },
      eq: function(i) {
        var s = this.length, f = +i + (i < 0 ? s : 0);
        return this.pushStack(f >= 0 && f < s ? [this[f]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      // For internal use only.
      // Behaves like an Array's method, not like a jQuery method.
      push: b,
      sort: l.sort,
      splice: l.splice
    }, a.extend = a.fn.extend = function() {
      var i, s, f, d, C, A, L = arguments[0] || {}, R = 1, z = arguments.length, H = !1;
      for (typeof L == "boolean" && (H = L, L = arguments[R] || {}, R++), typeof L != "object" && !a.isFunction(L) && (L = {}), R === z && (L = this, R--); R < z; R++)
        if ((C = arguments[R]) != null)
          for (d in C)
            i = L[d], f = C[d], L !== f && (H && f && (a.isPlainObject(f) || (s = a.isArray(f))) ? (s ? (s = !1, A = i && a.isArray(i) ? i : []) : A = i && a.isPlainObject(i) ? i : {}, L[d] = a.extend(H, A, f)) : f !== void 0 && (L[d] = f));
      return L;
    }, a.extend({
      // Unique for each copy of jQuery on the page
      expando: "jQuery" + (w + Math.random()).replace(/\D/g, ""),
      // Assume jQuery is ready without the ready module
      isReady: !0,
      error: function(i) {
        throw new Error(i);
      },
      noop: function() {
      },
      // See test/unit/core.js for details concerning isFunction.
      // Since version 1.3, DOM methods and functions like alert
      // aren't supported. They return false on IE (#2968).
      isFunction: function(i) {
        return a.type(i) === "function";
      },
      isArray: Array.isArray || function(i) {
        return a.type(i) === "array";
      },
      isWindow: function(i) {
        return i != null && i == i.window;
      },
      isNumeric: function(i) {
        var s = i && i.toString();
        return !a.isArray(i) && s - parseFloat(s) + 1 >= 0;
      },
      isEmptyObject: function(i) {
        var s;
        for (s in i)
          return !1;
        return !0;
      },
      isPlainObject: function(i) {
        var s;
        if (!i || a.type(i) !== "object" || i.nodeType || a.isWindow(i))
          return !1;
        try {
          if (i.constructor && !x.call(i, "constructor") && !x.call(i.constructor.prototype, "isPrototypeOf"))
            return !1;
        } catch {
          return !1;
        }
        if (!h.ownFirst)
          for (s in i)
            return x.call(i, s);
        for (s in i)
          ;
        return s === void 0 || x.call(i, s);
      },
      type: function(i) {
        return i == null ? i + "" : typeof i == "object" || typeof i == "function" ? v[S.call(i)] || "object" : typeof i;
      },
      // Workarounds based on findings by Jim Driscoll
      // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
      globalEval: function(i) {
        i && a.trim(i) && (o.execScript || function(s) {
          o.eval.call(o, s);
        })(i);
      },
      // Convert dashed to camelCase; used by the css and data modules
      // Microsoft forgot to hump their vendor prefix (#9572)
      camelCase: function(i) {
        return i.replace(k, "ms-").replace(O, G);
      },
      nodeName: function(i, s) {
        return i.nodeName && i.nodeName.toLowerCase() === s.toLowerCase();
      },
      each: function(i, s) {
        var f, d = 0;
        if (q(i))
          for (f = i.length; d < f && s.call(i[d], d, i[d]) !== !1; d++)
            ;
        else
          for (d in i)
            if (s.call(i[d], d, i[d]) === !1)
              break;
        return i;
      },
      // Support: Android<4.1, IE<9
      trim: function(i) {
        return i == null ? "" : (i + "").replace(E, "");
      },
      // results is for internal usage only
      makeArray: function(i, s) {
        var f = s || [];
        return i != null && (q(Object(i)) ? a.merge(
          f,
          typeof i == "string" ? [i] : i
        ) : b.call(f, i)), f;
      },
      inArray: function(i, s, f) {
        var d;
        if (s) {
          if (p)
            return p.call(s, i, f);
          for (d = s.length, f = f ? f < 0 ? Math.max(0, d + f) : f : 0; f < d; f++)
            if (f in s && s[f] === i)
              return f;
        }
        return -1;
      },
      merge: function(i, s) {
        for (var f = +s.length, d = 0, C = i.length; d < f; )
          i[C++] = s[d++];
        if (f !== f)
          for (; s[d] !== void 0; )
            i[C++] = s[d++];
        return i.length = C, i;
      },
      grep: function(i, s, f) {
        for (var d, C = [], A = 0, L = i.length, R = !f; A < L; A++)
          d = !s(i[A], A), d !== R && C.push(i[A]);
        return C;
      },
      // arg is for internal usage only
      map: function(i, s, f) {
        var d, C, A = 0, L = [];
        if (q(i))
          for (d = i.length; A < d; A++)
            C = s(i[A], A, f), C != null && L.push(C);
        else
          for (A in i)
            C = s(i[A], A, f), C != null && L.push(C);
        return g.apply([], L);
      },
      // A global GUID counter for objects
      guid: 1,
      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function(i, s) {
        var f, d, C;
        if (typeof s == "string" && (C = i[s], s = i, i = C), !!a.isFunction(i))
          return f = m.call(arguments, 2), d = function() {
            return i.apply(s || this, f.concat(m.call(arguments)));
          }, d.guid = i.guid = i.guid || a.guid++, d;
      },
      now: function() {
        return +/* @__PURE__ */ new Date();
      },
      // jQuery.support is not used in Core but other projects attach their
      // properties to it so it needs to exist.
      support: h
    }), typeof Symbol == "function" && (a.fn[Symbol.iterator] = l[Symbol.iterator]), a.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
      function(i, s) {
        v["[object " + s + "]"] = s.toLowerCase();
      }
    );
    function q(i) {
      var s = !!i && "length" in i && i.length, f = a.type(i);
      return f === "function" || a.isWindow(i) ? !1 : f === "array" || s === 0 || typeof s == "number" && s > 0 && s - 1 in i;
    }
    var P = (
      /*!
       * Sizzle CSS Selector Engine v2.2.1
       * http://sizzlejs.com/
       *
       * Copyright jQuery Foundation and other contributors
       * Released under the MIT license
       * http://jquery.org/license
       *
       * Date: 2015-10-17
       */
      function(i) {
        var s, f, d, C, A, L, R, z, H, X, ft, mt, ct, Ut, qt, Qt, Xe, De, ar, Tt = "sizzle" + 1 * /* @__PURE__ */ new Date(), Ge = i.document, Kt = 0, Ne = 0, Un = $(), Yi = $(), nn = $(), Vn = function(D, B) {
          return D === B && (ft = !0), 0;
        }, sr = 1 << 31, Xn = {}.hasOwnProperty, Te = [], rn = Te.pop, yi = Te.push, jn = Te.push, Ro = Te.slice, Sr = function(D, B) {
          for (var W = 0, nt = D.length; W < nt; W++)
            if (D[W] === B)
              return W;
          return -1;
        }, Io = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", _e = "[\\x20\\t\\r\\n\\f]", Er = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", ja = "\\[" + _e + "*(" + Er + ")(?:" + _e + // Operator (capture 2)
        "*([*^$|!~]?=)" + _e + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Er + "))|)" + _e + "*\\]", ur = ":(" + Er + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + ja + ")*)|.*)\\)|)", wu = new RegExp(_e + "+", "g"), Qi = new RegExp("^" + _e + "+|((?:^|[^\\\\])(?:\\\\.)*)" + _e + "+$", "g"), Bo = new RegExp("^" + _e + "*," + _e + "*"), Ya = new RegExp("^" + _e + "*([>+~]|" + _e + ")" + _e + "*"), lr = new RegExp("=" + _e + `*([^\\]'"]*?)` + _e + "*\\]", "g"), Ki = new RegExp(ur), Qa = new RegExp("^" + Er + "$"), Zi = {
          ID: new RegExp("^#(" + Er + ")"),
          CLASS: new RegExp("^\\.(" + Er + ")"),
          TAG: new RegExp("^(" + Er + "|[*])"),
          ATTR: new RegExp("^" + ja),
          PSEUDO: new RegExp("^" + ur),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + _e + "*(even|odd|(([+-]|)(\\d*)n|)" + _e + "*(?:([+-]|)" + _e + "*(\\d+)|))" + _e + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + Io + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + _e + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + _e + "*((?:-\\d)?\\d*)" + _e + "*\\)|)(?=[^-]|$)", "i")
        }, xu = /^(?:input|select|textarea|button)$/i, Zr = /^h\d$/i, Qe = /^[^{]+\{\s*\[native \w/, Ka = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Fo = /[+~]/, _u = /'|\\/g, Yn = new RegExp("\\\\([\\da-f]{1,6}" + _e + "?|(" + _e + ")|.)", "ig"), Qn = function(D, B, W) {
          var nt = "0x" + B - 65536;
          return nt !== nt || W ? B : nt < 0 ? (
            // BMP codepoint
            String.fromCharCode(nt + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(nt >> 10 | 55296, nt & 1023 | 56320)
          );
        }, Za = function() {
          mt();
        };
        try {
          jn.apply(
            Te = Ro.call(Ge.childNodes),
            Ge.childNodes
          ), Te[Ge.childNodes.length].nodeType;
        } catch {
          jn = {
            apply: Te.length ? (
              // Leverage slice if possible
              function(B, W) {
                yi.apply(B, Ro.call(W));
              }
            ) : (
              // Support: IE<9
              // Otherwise append directly
              function(B, W) {
                for (var nt = B.length, K = 0; B[nt++] = W[K++]; )
                  ;
                B.length = nt - 1;
              }
            )
          };
        }
        function ge(D, B, W, nt) {
          var K, ut, ot, gt, Nt, Gt, Mt, Ht, te = B && B.ownerDocument, be = B ? B.nodeType : 9;
          if (W = W || [], typeof D != "string" || !D || be !== 1 && be !== 9 && be !== 11)
            return W;
          if (!nt && ((B ? B.ownerDocument || B : Ge) !== ct && mt(B), B = B || ct, qt)) {
            if (be !== 11 && (Gt = Ka.exec(D)))
              if (K = Gt[1]) {
                if (be === 9)
                  if (ot = B.getElementById(K)) {
                    if (ot.id === K)
                      return W.push(ot), W;
                  } else
                    return W;
                else if (te && (ot = te.getElementById(K)) && ar(B, ot) && ot.id === K)
                  return W.push(ot), W;
              } else {
                if (Gt[2])
                  return jn.apply(W, B.getElementsByTagName(D)), W;
                if ((K = Gt[3]) && f.getElementsByClassName && B.getElementsByClassName)
                  return jn.apply(W, B.getElementsByClassName(K)), W;
              }
            if (f.qsa && !nn[D + " "] && (!Qt || !Qt.test(D))) {
              if (be !== 1)
                te = B, Ht = D;
              else if (B.nodeName.toLowerCase() !== "object") {
                for ((gt = B.getAttribute("id")) ? gt = gt.replace(_u, "\\$&") : B.setAttribute("id", gt = Tt), Mt = L(D), ut = Mt.length, Nt = Qa.test(gt) ? "#" + gt : "[id='" + gt + "']"; ut--; )
                  Mt[ut] = Nt + " " + Ke(Mt[ut]);
                Ht = Mt.join(","), te = Fo.test(D) && bi(B.parentNode) || B;
              }
              if (Ht)
                try {
                  return jn.apply(
                    W,
                    te.querySelectorAll(Ht)
                  ), W;
                } catch {
                } finally {
                  gt === Tt && B.removeAttribute("id");
                }
            }
          }
          return z(D.replace(Qi, "$1"), B, W, nt);
        }
        function $() {
          var D = [];
          function B(W, nt) {
            return D.push(W + " ") > d.cacheLength && delete B[D.shift()], B[W + " "] = nt;
          }
          return B;
        }
        function tt(D) {
          return D[Tt] = !0, D;
        }
        function Z(D) {
          var B = ct.createElement("div");
          try {
            return !!D(B);
          } catch {
            return !1;
          } finally {
            B.parentNode && B.parentNode.removeChild(B), B = null;
          }
        }
        function Et(D, B) {
          for (var W = D.split("|"), nt = W.length; nt--; )
            d.attrHandle[W[nt]] = B;
        }
        function Vt(D, B) {
          var W = B && D, nt = W && D.nodeType === 1 && B.nodeType === 1 && (~B.sourceIndex || sr) - (~D.sourceIndex || sr);
          if (nt)
            return nt;
          if (W) {
            for (; W = W.nextSibling; )
              if (W === B)
                return -1;
          }
          return D ? 1 : -1;
        }
        function ve(D) {
          return function(B) {
            var W = B.nodeName.toLowerCase();
            return W === "input" && B.type === D;
          };
        }
        function ze(D) {
          return function(B) {
            var W = B.nodeName.toLowerCase();
            return (W === "input" || W === "button") && B.type === D;
          };
        }
        function ce(D) {
          return tt(function(B) {
            return B = +B, tt(function(W, nt) {
              for (var K, ut = D([], W.length, B), ot = ut.length; ot--; )
                W[K = ut[ot]] && (W[K] = !(nt[K] = W[K]));
            });
          });
        }
        function bi(D) {
          return D && typeof D.getElementsByTagName < "u" && D;
        }
        f = ge.support = {}, A = ge.isXML = function(D) {
          var B = D && (D.ownerDocument || D).documentElement;
          return B ? B.nodeName !== "HTML" : !1;
        }, mt = ge.setDocument = function(D) {
          var B, W, nt = D ? D.ownerDocument || D : Ge;
          return nt === ct || nt.nodeType !== 9 || !nt.documentElement || (ct = nt, Ut = ct.documentElement, qt = !A(ct), (W = ct.defaultView) && W.top !== W && (W.addEventListener ? W.addEventListener("unload", Za, !1) : W.attachEvent && W.attachEvent("onunload", Za)), f.attributes = Z(function(K) {
            return K.className = "i", !K.getAttribute("className");
          }), f.getElementsByTagName = Z(function(K) {
            return K.appendChild(ct.createComment("")), !K.getElementsByTagName("*").length;
          }), f.getElementsByClassName = Qe.test(ct.getElementsByClassName), f.getById = Z(function(K) {
            return Ut.appendChild(K).id = Tt, !ct.getElementsByName || !ct.getElementsByName(Tt).length;
          }), f.getById ? (d.find.ID = function(K, ut) {
            if (typeof ut.getElementById < "u" && qt) {
              var ot = ut.getElementById(K);
              return ot ? [ot] : [];
            }
          }, d.filter.ID = function(K) {
            var ut = K.replace(Yn, Qn);
            return function(ot) {
              return ot.getAttribute("id") === ut;
            };
          }) : (delete d.find.ID, d.filter.ID = function(K) {
            var ut = K.replace(Yn, Qn);
            return function(ot) {
              var gt = typeof ot.getAttributeNode < "u" && ot.getAttributeNode("id");
              return gt && gt.value === ut;
            };
          }), d.find.TAG = f.getElementsByTagName ? function(K, ut) {
            if (typeof ut.getElementsByTagName < "u")
              return ut.getElementsByTagName(K);
            if (f.qsa)
              return ut.querySelectorAll(K);
          } : function(K, ut) {
            var ot, gt = [], Nt = 0, Gt = ut.getElementsByTagName(K);
            if (K === "*") {
              for (; ot = Gt[Nt++]; )
                ot.nodeType === 1 && gt.push(ot);
              return gt;
            }
            return Gt;
          }, d.find.CLASS = f.getElementsByClassName && function(K, ut) {
            if (typeof ut.getElementsByClassName < "u" && qt)
              return ut.getElementsByClassName(K);
          }, Xe = [], Qt = [], (f.qsa = Qe.test(ct.querySelectorAll)) && (Z(function(K) {
            Ut.appendChild(K).innerHTML = "<a id='" + Tt + "'></a><select id='" + Tt + "-\r\\' msallowcapture=''><option selected=''></option></select>", K.querySelectorAll("[msallowcapture^='']").length && Qt.push("[*^$]=" + _e + `*(?:''|"")`), K.querySelectorAll("[selected]").length || Qt.push("\\[" + _e + "*(?:value|" + Io + ")"), K.querySelectorAll("[id~=" + Tt + "-]").length || Qt.push("~="), K.querySelectorAll(":checked").length || Qt.push(":checked"), K.querySelectorAll("a#" + Tt + "+*").length || Qt.push(".#.+[+~]");
          }), Z(function(K) {
            var ut = ct.createElement("input");
            ut.setAttribute("type", "hidden"), K.appendChild(ut).setAttribute("name", "D"), K.querySelectorAll("[name=d]").length && Qt.push("name" + _e + "*[*^$|!~]?="), K.querySelectorAll(":enabled").length || Qt.push(":enabled", ":disabled"), K.querySelectorAll("*,:x"), Qt.push(",.*:");
          })), (f.matchesSelector = Qe.test(De = Ut.matches || Ut.webkitMatchesSelector || Ut.mozMatchesSelector || Ut.oMatchesSelector || Ut.msMatchesSelector)) && Z(function(K) {
            f.disconnectedMatch = De.call(K, "div"), De.call(K, "[s!='']:x"), Xe.push("!=", ur);
          }), Qt = Qt.length && new RegExp(Qt.join("|")), Xe = Xe.length && new RegExp(Xe.join("|")), B = Qe.test(Ut.compareDocumentPosition), ar = B || Qe.test(Ut.contains) ? function(K, ut) {
            var ot = K.nodeType === 9 ? K.documentElement : K, gt = ut && ut.parentNode;
            return K === gt || !!(gt && gt.nodeType === 1 && (ot.contains ? ot.contains(gt) : K.compareDocumentPosition && K.compareDocumentPosition(gt) & 16));
          } : function(K, ut) {
            if (ut) {
              for (; ut = ut.parentNode; )
                if (ut === K)
                  return !0;
            }
            return !1;
          }, Vn = B ? function(K, ut) {
            if (K === ut)
              return ft = !0, 0;
            var ot = !K.compareDocumentPosition - !ut.compareDocumentPosition;
            return ot || (ot = (K.ownerDocument || K) === (ut.ownerDocument || ut) ? K.compareDocumentPosition(ut) : (
              // Otherwise we know they are disconnected
              1
            ), ot & 1 || !f.sortDetached && ut.compareDocumentPosition(K) === ot ? K === ct || K.ownerDocument === Ge && ar(Ge, K) ? -1 : ut === ct || ut.ownerDocument === Ge && ar(Ge, ut) ? 1 : X ? Sr(X, K) - Sr(X, ut) : 0 : ot & 4 ? -1 : 1);
          } : function(K, ut) {
            if (K === ut)
              return ft = !0, 0;
            var ot, gt = 0, Nt = K.parentNode, Gt = ut.parentNode, Mt = [K], Ht = [ut];
            if (!Nt || !Gt)
              return K === ct ? -1 : ut === ct ? 1 : Nt ? -1 : Gt ? 1 : X ? Sr(X, K) - Sr(X, ut) : 0;
            if (Nt === Gt)
              return Vt(K, ut);
            for (ot = K; ot = ot.parentNode; )
              Mt.unshift(ot);
            for (ot = ut; ot = ot.parentNode; )
              Ht.unshift(ot);
            for (; Mt[gt] === Ht[gt]; )
              gt++;
            return gt ? (
              // Do a sibling check if the nodes have a common ancestor
              Vt(Mt[gt], Ht[gt])
            ) : (
              // Otherwise nodes in our document sort first
              Mt[gt] === Ge ? -1 : Ht[gt] === Ge ? 1 : 0
            );
          }), ct;
        }, ge.matches = function(D, B) {
          return ge(D, null, null, B);
        }, ge.matchesSelector = function(D, B) {
          if ((D.ownerDocument || D) !== ct && mt(D), B = B.replace(lr, "='$1']"), f.matchesSelector && qt && !nn[B + " "] && (!Xe || !Xe.test(B)) && (!Qt || !Qt.test(B)))
            try {
              var W = De.call(D, B);
              if (W || f.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              D.document && D.document.nodeType !== 11)
                return W;
            } catch {
            }
          return ge(B, ct, null, [D]).length > 0;
        }, ge.contains = function(D, B) {
          return (D.ownerDocument || D) !== ct && mt(D), ar(D, B);
        }, ge.attr = function(D, B) {
          (D.ownerDocument || D) !== ct && mt(D);
          var W = d.attrHandle[B.toLowerCase()], nt = W && Xn.call(d.attrHandle, B.toLowerCase()) ? W(D, B, !qt) : void 0;
          return nt !== void 0 ? nt : f.attributes || !qt ? D.getAttribute(B) : (nt = D.getAttributeNode(B)) && nt.specified ? nt.value : null;
        }, ge.error = function(D) {
          throw new Error("Syntax error, unrecognized expression: " + D);
        }, ge.uniqueSort = function(D) {
          var B, W = [], nt = 0, K = 0;
          if (ft = !f.detectDuplicates, X = !f.sortStable && D.slice(0), D.sort(Vn), ft) {
            for (; B = D[K++]; )
              B === D[K] && (nt = W.push(K));
            for (; nt--; )
              D.splice(W[nt], 1);
          }
          return X = null, D;
        }, C = ge.getText = function(D) {
          var B, W = "", nt = 0, K = D.nodeType;
          if (K) {
            if (K === 1 || K === 9 || K === 11) {
              if (typeof D.textContent == "string")
                return D.textContent;
              for (D = D.firstChild; D; D = D.nextSibling)
                W += C(D);
            } else if (K === 3 || K === 4)
              return D.nodeValue;
          } else for (; B = D[nt++]; )
            W += C(B);
          return W;
        }, d = ge.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: tt,
          match: Zi,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(D) {
              return D[1] = D[1].replace(Yn, Qn), D[3] = (D[3] || D[4] || D[5] || "").replace(Yn, Qn), D[2] === "~=" && (D[3] = " " + D[3] + " "), D.slice(0, 4);
            },
            CHILD: function(D) {
              return D[1] = D[1].toLowerCase(), D[1].slice(0, 3) === "nth" ? (D[3] || ge.error(D[0]), D[4] = +(D[4] ? D[5] + (D[6] || 1) : 2 * (D[3] === "even" || D[3] === "odd")), D[5] = +(D[7] + D[8] || D[3] === "odd")) : D[3] && ge.error(D[0]), D;
            },
            PSEUDO: function(D) {
              var B, W = !D[6] && D[2];
              return Zi.CHILD.test(D[0]) ? null : (D[3] ? D[2] = D[4] || D[5] || "" : W && Ki.test(W) && // Get excess from tokenize (recursively)
              (B = L(W, !0)) && // advance to the next closing parenthesis
              (B = W.indexOf(")", W.length - B) - W.length) && (D[0] = D[0].slice(0, B), D[2] = W.slice(0, B)), D.slice(0, 3));
            }
          },
          filter: {
            TAG: function(D) {
              var B = D.replace(Yn, Qn).toLowerCase();
              return D === "*" ? function() {
                return !0;
              } : function(W) {
                return W.nodeName && W.nodeName.toLowerCase() === B;
              };
            },
            CLASS: function(D) {
              var B = Un[D + " "];
              return B || (B = new RegExp("(^|" + _e + ")" + D + "(" + _e + "|$)")) && Un(D, function(W) {
                return B.test(typeof W.className == "string" && W.className || typeof W.getAttribute < "u" && W.getAttribute("class") || "");
              });
            },
            ATTR: function(D, B, W) {
              return function(nt) {
                var K = ge.attr(nt, D);
                return K == null ? B === "!=" : B ? (K += "", B === "=" ? K === W : B === "!=" ? K !== W : B === "^=" ? W && K.indexOf(W) === 0 : B === "*=" ? W && K.indexOf(W) > -1 : B === "$=" ? W && K.slice(-W.length) === W : B === "~=" ? (" " + K.replace(wu, " ") + " ").indexOf(W) > -1 : B === "|=" ? K === W || K.slice(0, W.length + 1) === W + "-" : !1) : !0;
              };
            },
            CHILD: function(D, B, W, nt, K) {
              var ut = D.slice(0, 3) !== "nth", ot = D.slice(-4) !== "last", gt = B === "of-type";
              return nt === 1 && K === 0 ? (
                // Shortcut for :nth-*(n)
                function(Nt) {
                  return !!Nt.parentNode;
                }
              ) : function(Nt, Gt, Mt) {
                var Ht, te, be, It, Le, qe, un = ut !== ot ? "nextSibling" : "previousSibling", Pe = Nt.parentNode, wi = gt && Nt.nodeName.toLowerCase(), fr = !Mt && !gt, je = !1;
                if (Pe) {
                  if (ut) {
                    for (; un; ) {
                      for (It = Nt; It = It[un]; )
                        if (gt ? It.nodeName.toLowerCase() === wi : It.nodeType === 1)
                          return !1;
                      qe = un = D === "only" && !qe && "nextSibling";
                    }
                    return !0;
                  }
                  if (qe = [ot ? Pe.firstChild : Pe.lastChild], ot && fr) {
                    for (It = Pe, be = It[Tt] || (It[Tt] = {}), te = be[It.uniqueID] || (be[It.uniqueID] = {}), Ht = te[D] || [], Le = Ht[0] === Kt && Ht[1], je = Le && Ht[2], It = Le && Pe.childNodes[Le]; It = ++Le && It && It[un] || // Fallback to seeking `elem` from the start
                    (je = Le = 0) || qe.pop(); )
                      if (It.nodeType === 1 && ++je && It === Nt) {
                        te[D] = [Kt, Le, je];
                        break;
                      }
                  } else if (fr && (It = Nt, be = It[Tt] || (It[Tt] = {}), te = be[It.uniqueID] || (be[It.uniqueID] = {}), Ht = te[D] || [], Le = Ht[0] === Kt && Ht[1], je = Le), je === !1)
                    for (; (It = ++Le && It && It[un] || (je = Le = 0) || qe.pop()) && !((gt ? It.nodeName.toLowerCase() === wi : It.nodeType === 1) && ++je && (fr && (be = It[Tt] || (It[Tt] = {}), te = be[It.uniqueID] || (be[It.uniqueID] = {}), te[D] = [Kt, je]), It === Nt)); )
                      ;
                  return je -= K, je === nt || je % nt === 0 && je / nt >= 0;
                }
              };
            },
            PSEUDO: function(D, B) {
              var W, nt = d.pseudos[D] || d.setFilters[D.toLowerCase()] || ge.error("unsupported pseudo: " + D);
              return nt[Tt] ? nt(B) : nt.length > 1 ? (W = [D, D, "", B], d.setFilters.hasOwnProperty(D.toLowerCase()) ? tt(function(K, ut) {
                for (var ot, gt = nt(K, B), Nt = gt.length; Nt--; )
                  ot = Sr(K, gt[Nt]), K[ot] = !(ut[ot] = gt[Nt]);
              }) : function(K) {
                return nt(K, 0, W);
              }) : nt;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: tt(function(D) {
              var B = [], W = [], nt = R(D.replace(Qi, "$1"));
              return nt[Tt] ? tt(function(K, ut, ot, gt) {
                for (var Nt, Gt = nt(K, null, gt, []), Mt = K.length; Mt--; )
                  (Nt = Gt[Mt]) && (K[Mt] = !(ut[Mt] = Nt));
              }) : function(K, ut, ot) {
                return B[0] = K, nt(B, null, ot, W), B[0] = null, !W.pop();
              };
            }),
            has: tt(function(D) {
              return function(B) {
                return ge(D, B).length > 0;
              };
            }),
            contains: tt(function(D) {
              return D = D.replace(Yn, Qn), function(B) {
                return (B.textContent || B.innerText || C(B)).indexOf(D) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            lang: tt(function(D) {
              return Qa.test(D || "") || ge.error("unsupported lang: " + D), D = D.replace(Yn, Qn).toLowerCase(), function(B) {
                var W;
                do
                  if (W = qt ? B.lang : B.getAttribute("xml:lang") || B.getAttribute("lang"))
                    return W = W.toLowerCase(), W === D || W.indexOf(D + "-") === 0;
                while ((B = B.parentNode) && B.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(D) {
              var B = i.location && i.location.hash;
              return B && B.slice(1) === D.id;
            },
            root: function(D) {
              return D === Ut;
            },
            focus: function(D) {
              return D === ct.activeElement && (!ct.hasFocus || ct.hasFocus()) && !!(D.type || D.href || ~D.tabIndex);
            },
            // Boolean properties
            enabled: function(D) {
              return D.disabled === !1;
            },
            disabled: function(D) {
              return D.disabled === !0;
            },
            checked: function(D) {
              var B = D.nodeName.toLowerCase();
              return B === "input" && !!D.checked || B === "option" && !!D.selected;
            },
            selected: function(D) {
              return D.parentNode && D.parentNode.selectedIndex, D.selected === !0;
            },
            // Contents
            empty: function(D) {
              for (D = D.firstChild; D; D = D.nextSibling)
                if (D.nodeType < 6)
                  return !1;
              return !0;
            },
            parent: function(D) {
              return !d.pseudos.empty(D);
            },
            // Element/input types
            header: function(D) {
              return Zr.test(D.nodeName);
            },
            input: function(D) {
              return xu.test(D.nodeName);
            },
            button: function(D) {
              var B = D.nodeName.toLowerCase();
              return B === "input" && D.type === "button" || B === "button";
            },
            text: function(D) {
              var B;
              return D.nodeName.toLowerCase() === "input" && D.type === "text" && // Support: IE<8
              // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
              ((B = D.getAttribute("type")) == null || B.toLowerCase() === "text");
            },
            // Position-in-collection
            first: ce(function() {
              return [0];
            }),
            last: ce(function(D, B) {
              return [B - 1];
            }),
            eq: ce(function(D, B, W) {
              return [W < 0 ? W + B : W];
            }),
            even: ce(function(D, B) {
              for (var W = 0; W < B; W += 2)
                D.push(W);
              return D;
            }),
            odd: ce(function(D, B) {
              for (var W = 1; W < B; W += 2)
                D.push(W);
              return D;
            }),
            lt: ce(function(D, B, W) {
              for (var nt = W < 0 ? W + B : W; --nt >= 0; )
                D.push(nt);
              return D;
            }),
            gt: ce(function(D, B, W) {
              for (var nt = W < 0 ? W + B : W; ++nt < B; )
                D.push(nt);
              return D;
            })
          }
        }, d.pseudos.nth = d.pseudos.eq;
        for (s in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          d.pseudos[s] = ve(s);
        for (s in { submit: !0, reset: !0 })
          d.pseudos[s] = ze(s);
        function Ja() {
        }
        Ja.prototype = d.filters = d.pseudos, d.setFilters = new Ja(), L = ge.tokenize = function(D, B) {
          var W, nt, K, ut, ot, gt, Nt, Gt = Yi[D + " "];
          if (Gt)
            return B ? 0 : Gt.slice(0);
          for (ot = D, gt = [], Nt = d.preFilter; ot; ) {
            (!W || (nt = Bo.exec(ot))) && (nt && (ot = ot.slice(nt[0].length) || ot), gt.push(K = [])), W = !1, (nt = Ya.exec(ot)) && (W = nt.shift(), K.push({
              value: W,
              // Cast descendant combinators to space
              type: nt[0].replace(Qi, " ")
            }), ot = ot.slice(W.length));
            for (ut in d.filter)
              (nt = Zi[ut].exec(ot)) && (!Nt[ut] || (nt = Nt[ut](nt))) && (W = nt.shift(), K.push({
                value: W,
                type: ut,
                matches: nt
              }), ot = ot.slice(W.length));
            if (!W)
              break;
          }
          return B ? ot.length : ot ? ge.error(D) : (
            // Cache the tokens
            Yi(D, gt).slice(0)
          );
        };
        function Ke(D) {
          for (var B = 0, W = D.length, nt = ""; B < W; B++)
            nt += D[B].value;
          return nt;
        }
        function Jr(D, B, W) {
          var nt = B.dir, K = W && nt === "parentNode", ut = Ne++;
          return B.first ? (
            // Check against closest ancestor/preceding element
            function(ot, gt, Nt) {
              for (; ot = ot[nt]; )
                if (ot.nodeType === 1 || K)
                  return D(ot, gt, Nt);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(ot, gt, Nt) {
              var Gt, Mt, Ht, te = [Kt, ut];
              if (Nt) {
                for (; ot = ot[nt]; )
                  if ((ot.nodeType === 1 || K) && D(ot, gt, Nt))
                    return !0;
              } else
                for (; ot = ot[nt]; )
                  if (ot.nodeType === 1 || K) {
                    if (Ht = ot[Tt] || (ot[Tt] = {}), Mt = Ht[ot.uniqueID] || (Ht[ot.uniqueID] = {}), (Gt = Mt[nt]) && Gt[0] === Kt && Gt[1] === ut)
                      return te[2] = Gt[2];
                    if (Mt[nt] = te, te[2] = D(ot, gt, Nt))
                      return !0;
                  }
            }
          );
        }
        function zo(D) {
          return D.length > 1 ? function(B, W, nt) {
            for (var K = D.length; K--; )
              if (!D[K](B, W, nt))
                return !1;
            return !0;
          } : D[0];
        }
        function ti(D, B, W) {
          for (var nt = 0, K = B.length; nt < K; nt++)
            ge(D, B[nt], W);
          return W;
        }
        function Tr(D, B, W, nt, K) {
          for (var ut, ot = [], gt = 0, Nt = D.length, Gt = B != null; gt < Nt; gt++)
            (ut = D[gt]) && (!W || W(ut, nt, K)) && (ot.push(ut), Gt && B.push(gt));
          return ot;
        }
        function ei(D, B, W, nt, K, ut) {
          return nt && !nt[Tt] && (nt = ei(nt)), K && !K[Tt] && (K = ei(K, ut)), tt(function(ot, gt, Nt, Gt) {
            var Mt, Ht, te, be = [], It = [], Le = gt.length, qe = ot || ti(B || "*", Nt.nodeType ? [Nt] : Nt, []), un = D && (ot || !B) ? Tr(qe, be, D, Nt, Gt) : qe, Pe = W ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              K || (ot ? D : Le || nt) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                gt
              )
            ) : un;
            if (W && W(un, Pe, Nt, Gt), nt)
              for (Mt = Tr(Pe, It), nt(Mt, [], Nt, Gt), Ht = Mt.length; Ht--; )
                (te = Mt[Ht]) && (Pe[It[Ht]] = !(un[It[Ht]] = te));
            if (ot) {
              if (K || D) {
                if (K) {
                  for (Mt = [], Ht = Pe.length; Ht--; )
                    (te = Pe[Ht]) && Mt.push(un[Ht] = te);
                  K(null, Pe = [], Mt, Gt);
                }
                for (Ht = Pe.length; Ht--; )
                  (te = Pe[Ht]) && (Mt = K ? Sr(ot, te) : be[Ht]) > -1 && (ot[Mt] = !(gt[Mt] = te));
              }
            } else
              Pe = Tr(
                Pe === gt ? Pe.splice(Le, Pe.length) : Pe
              ), K ? K(null, gt, Pe, Gt) : jn.apply(gt, Pe);
          });
        }
        function me(D) {
          for (var B, W, nt, K = D.length, ut = d.relative[D[0].type], ot = ut || d.relative[" "], gt = ut ? 1 : 0, Nt = Jr(function(Ht) {
            return Ht === B;
          }, ot, !0), Gt = Jr(function(Ht) {
            return Sr(B, Ht) > -1;
          }, ot, !0), Mt = [function(Ht, te, be) {
            var It = !ut && (be || te !== H) || ((B = te).nodeType ? Nt(Ht, te, be) : Gt(Ht, te, be));
            return B = null, It;
          }]; gt < K; gt++)
            if (W = d.relative[D[gt].type])
              Mt = [Jr(zo(Mt), W)];
            else {
              if (W = d.filter[D[gt].type].apply(null, D[gt].matches), W[Tt]) {
                for (nt = ++gt; nt < K && !d.relative[D[nt].type]; nt++)
                  ;
                return ei(
                  gt > 1 && zo(Mt),
                  gt > 1 && Ke(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    D.slice(0, gt - 1).concat({ value: D[gt - 2].type === " " ? "*" : "" })
                  ).replace(Qi, "$1"),
                  W,
                  gt < nt && me(D.slice(gt, nt)),
                  nt < K && me(D = D.slice(nt)),
                  nt < K && Ke(D)
                );
              }
              Mt.push(W);
            }
          return zo(Mt);
        }
        function Cu(D, B) {
          var W = B.length > 0, nt = D.length > 0, K = function(ut, ot, gt, Nt, Gt) {
            var Mt, Ht, te, be = 0, It = "0", Le = ut && [], qe = [], un = H, Pe = ut || nt && d.find.TAG("*", Gt), wi = Kt += un == null ? 1 : Math.random() || 0.1, fr = Pe.length;
            for (Gt && (H = ot === ct || ot || Gt); It !== fr && (Mt = Pe[It]) != null; It++) {
              if (nt && Mt) {
                for (Ht = 0, !ot && Mt.ownerDocument !== ct && (mt(Mt), gt = !qt); te = D[Ht++]; )
                  if (te(Mt, ot || ct, gt)) {
                    Nt.push(Mt);
                    break;
                  }
                Gt && (Kt = wi);
              }
              W && ((Mt = !te && Mt) && be--, ut && Le.push(Mt));
            }
            if (be += It, W && It !== be) {
              for (Ht = 0; te = B[Ht++]; )
                te(Le, qe, ot, gt);
              if (ut) {
                if (be > 0)
                  for (; It--; )
                    Le[It] || qe[It] || (qe[It] = rn.call(Nt));
                qe = Tr(qe);
              }
              jn.apply(Nt, qe), Gt && !ut && qe.length > 0 && be + B.length > 1 && ge.uniqueSort(Nt);
            }
            return Gt && (Kt = wi, H = un), Le;
          };
          return W ? tt(K) : K;
        }
        return R = ge.compile = function(D, B) {
          var W, nt = [], K = [], ut = nn[D + " "];
          if (!ut) {
            for (B || (B = L(D)), W = B.length; W--; )
              ut = me(B[W]), ut[Tt] ? nt.push(ut) : K.push(ut);
            ut = nn(D, Cu(K, nt)), ut.selector = D;
          }
          return ut;
        }, z = ge.select = function(D, B, W, nt) {
          var K, ut, ot, gt, Nt, Gt = typeof D == "function" && D, Mt = !nt && L(D = Gt.selector || D);
          if (W = W || [], Mt.length === 1) {
            if (ut = Mt[0] = Mt[0].slice(0), ut.length > 2 && (ot = ut[0]).type === "ID" && f.getById && B.nodeType === 9 && qt && d.relative[ut[1].type]) {
              if (B = (d.find.ID(ot.matches[0].replace(Yn, Qn), B) || [])[0], B)
                Gt && (B = B.parentNode);
              else return W;
              D = D.slice(ut.shift().value.length);
            }
            for (K = Zi.needsContext.test(D) ? 0 : ut.length; K-- && (ot = ut[K], !d.relative[gt = ot.type]); )
              if ((Nt = d.find[gt]) && (nt = Nt(
                ot.matches[0].replace(Yn, Qn),
                Fo.test(ut[0].type) && bi(B.parentNode) || B
              ))) {
                if (ut.splice(K, 1), D = nt.length && Ke(ut), !D)
                  return jn.apply(W, nt), W;
                break;
              }
          }
          return (Gt || R(D, Mt))(
            nt,
            B,
            !qt,
            W,
            !B || Fo.test(D) && bi(B.parentNode) || B
          ), W;
        }, f.sortStable = Tt.split("").sort(Vn).join("") === Tt, f.detectDuplicates = !!ft, mt(), f.sortDetached = Z(function(D) {
          return D.compareDocumentPosition(ct.createElement("div")) & 1;
        }), Z(function(D) {
          return D.innerHTML = "<a href='#'></a>", D.firstChild.getAttribute("href") === "#";
        }) || Et("type|href|height|width", function(D, B, W) {
          if (!W)
            return D.getAttribute(B, B.toLowerCase() === "type" ? 1 : 2);
        }), (!f.attributes || !Z(function(D) {
          return D.innerHTML = "<input/>", D.firstChild.setAttribute("value", ""), D.firstChild.getAttribute("value") === "";
        })) && Et("value", function(D, B, W) {
          if (!W && D.nodeName.toLowerCase() === "input")
            return D.defaultValue;
        }), Z(function(D) {
          return D.getAttribute("disabled") == null;
        }) || Et(Io, function(D, B, W) {
          var nt;
          if (!W)
            return D[B] === !0 ? B.toLowerCase() : (nt = D.getAttributeNode(B)) && nt.specified ? nt.value : null;
        }), ge;
      }(o)
    );
    a.find = P, a.expr = P.selectors, a.expr[":"] = a.expr.pseudos, a.uniqueSort = a.unique = P.uniqueSort, a.text = P.getText, a.isXMLDoc = P.isXML, a.contains = P.contains;
    var U = function(i, s, f) {
      for (var d = [], C = f !== void 0; (i = i[s]) && i.nodeType !== 9; )
        if (i.nodeType === 1) {
          if (C && a(i).is(f))
            break;
          d.push(i);
        }
      return d;
    }, Q = function(i, s) {
      for (var f = []; i; i = i.nextSibling)
        i.nodeType === 1 && i !== s && f.push(i);
      return f;
    }, et = a.expr.match.needsContext, yt = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, _t = /^.[^:#\[\.,]*$/;
    function bt(i, s, f) {
      if (a.isFunction(s))
        return a.grep(i, function(d, C) {
          return !!s.call(d, C, d) !== f;
        });
      if (s.nodeType)
        return a.grep(i, function(d) {
          return d === s !== f;
        });
      if (typeof s == "string") {
        if (_t.test(s))
          return a.filter(s, i, f);
        s = a.filter(s, i);
      }
      return a.grep(i, function(d) {
        return a.inArray(d, s) > -1 !== f;
      });
    }
    a.filter = function(i, s, f) {
      var d = s[0];
      return f && (i = ":not(" + i + ")"), s.length === 1 && d.nodeType === 1 ? a.find.matchesSelector(d, i) ? [d] : [] : a.find.matches(i, a.grep(s, function(C) {
        return C.nodeType === 1;
      }));
    }, a.fn.extend({
      find: function(i) {
        var s, f = [], d = this, C = d.length;
        if (typeof i != "string")
          return this.pushStack(a(i).filter(function() {
            for (s = 0; s < C; s++)
              if (a.contains(d[s], this))
                return !0;
          }));
        for (s = 0; s < C; s++)
          a.find(i, d[s], f);
        return f = this.pushStack(C > 1 ? a.unique(f) : f), f.selector = this.selector ? this.selector + " " + i : i, f;
      },
      filter: function(i) {
        return this.pushStack(bt(this, i || [], !1));
      },
      not: function(i) {
        return this.pushStack(bt(this, i || [], !0));
      },
      is: function(i) {
        return !!bt(
          this,
          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof i == "string" && et.test(i) ? a(i) : i || [],
          !1
        ).length;
      }
    });
    var wt, jt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, Bt = a.fn.init = function(i, s, f) {
      var d, C;
      if (!i)
        return this;
      if (f = f || wt, typeof i == "string")
        if (i.charAt(0) === "<" && i.charAt(i.length - 1) === ">" && i.length >= 3 ? d = [null, i, null] : d = jt.exec(i), d && (d[1] || !s))
          if (d[1]) {
            if (s = s instanceof a ? s[0] : s, a.merge(this, a.parseHTML(
              d[1],
              s && s.nodeType ? s.ownerDocument || s : c,
              !0
            )), yt.test(d[1]) && a.isPlainObject(s))
              for (d in s)
                a.isFunction(this[d]) ? this[d](s[d]) : this.attr(d, s[d]);
            return this;
          } else {
            if (C = c.getElementById(d[2]), C && C.parentNode) {
              if (C.id !== d[2])
                return wt.find(i);
              this.length = 1, this[0] = C;
            }
            return this.context = c, this.selector = i, this;
          }
        else return !s || s.jquery ? (s || f).find(i) : this.constructor(s).find(i);
      else {
        if (i.nodeType)
          return this.context = this[0] = i, this.length = 1, this;
        if (a.isFunction(i))
          return typeof f.ready < "u" ? f.ready(i) : (
            // Execute immediately if ready is not present
            i(a)
          );
      }
      return i.selector !== void 0 && (this.selector = i.selector, this.context = i.context), a.makeArray(i, this);
    };
    Bt.prototype = a.fn, wt = a(c);
    var Y = /^(?:parents|prev(?:Until|All))/, pt = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
    a.fn.extend({
      has: function(i) {
        var s, f = a(i, this), d = f.length;
        return this.filter(function() {
          for (s = 0; s < d; s++)
            if (a.contains(this, f[s]))
              return !0;
        });
      },
      closest: function(i, s) {
        for (var f, d = 0, C = this.length, A = [], L = et.test(i) || typeof i != "string" ? a(i, s || this.context) : 0; d < C; d++)
          for (f = this[d]; f && f !== s; f = f.parentNode)
            if (f.nodeType < 11 && (L ? L.index(f) > -1 : (
              // Don't pass non-elements to Sizzle
              f.nodeType === 1 && a.find.matchesSelector(f, i)
            ))) {
              A.push(f);
              break;
            }
        return this.pushStack(A.length > 1 ? a.uniqueSort(A) : A);
      },
      // Determine the position of an element within
      // the matched set of elements
      index: function(i) {
        return i ? typeof i == "string" ? a.inArray(this[0], a(i)) : a.inArray(
          // If it receives a jQuery object, the first element is used
          i.jquery ? i[0] : i,
          this
        ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      },
      add: function(i, s) {
        return this.pushStack(
          a.uniqueSort(
            a.merge(this.get(), a(i, s))
          )
        );
      },
      addBack: function(i) {
        return this.add(
          i == null ? this.prevObject : this.prevObject.filter(i)
        );
      }
    });
    function J(i, s) {
      do
        i = i[s];
      while (i && i.nodeType !== 1);
      return i;
    }
    a.each({
      parent: function(i) {
        var s = i.parentNode;
        return s && s.nodeType !== 11 ? s : null;
      },
      parents: function(i) {
        return U(i, "parentNode");
      },
      parentsUntil: function(i, s, f) {
        return U(i, "parentNode", f);
      },
      next: function(i) {
        return J(i, "nextSibling");
      },
      prev: function(i) {
        return J(i, "previousSibling");
      },
      nextAll: function(i) {
        return U(i, "nextSibling");
      },
      prevAll: function(i) {
        return U(i, "previousSibling");
      },
      nextUntil: function(i, s, f) {
        return U(i, "nextSibling", f);
      },
      prevUntil: function(i, s, f) {
        return U(i, "previousSibling", f);
      },
      siblings: function(i) {
        return Q((i.parentNode || {}).firstChild, i);
      },
      children: function(i) {
        return Q(i.firstChild);
      },
      contents: function(i) {
        return a.nodeName(i, "iframe") ? i.contentDocument || i.contentWindow.document : a.merge([], i.childNodes);
      }
    }, function(i, s) {
      a.fn[i] = function(f, d) {
        var C = a.map(this, s, f);
        return i.slice(-5) !== "Until" && (d = f), d && typeof d == "string" && (C = a.filter(d, C)), this.length > 1 && (pt[i] || (C = a.uniqueSort(C)), Y.test(i) && (C = C.reverse())), this.pushStack(C);
      };
    });
    var lt = /\S+/g;
    function xt(i) {
      var s = {};
      return a.each(i.match(lt) || [], function(f, d) {
        s[d] = !0;
      }), s;
    }
    a.Callbacks = function(i) {
      i = typeof i == "string" ? xt(i) : a.extend({}, i);
      var s, f, d, C, A = [], L = [], R = -1, z = function() {
        for (C = i.once, d = s = !0; L.length; R = -1)
          for (f = L.shift(); ++R < A.length; )
            A[R].apply(f[0], f[1]) === !1 && i.stopOnFalse && (R = A.length, f = !1);
        i.memory || (f = !1), s = !1, C && (f ? A = [] : A = "");
      }, H = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return A && (f && !s && (R = A.length - 1, L.push(f)), function X(ft) {
            a.each(ft, function(mt, ct) {
              a.isFunction(ct) ? (!i.unique || !H.has(ct)) && A.push(ct) : ct && ct.length && a.type(ct) !== "string" && X(ct);
            });
          }(arguments), f && !s && z()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return a.each(arguments, function(X, ft) {
            for (var mt; (mt = a.inArray(ft, A, mt)) > -1; )
              A.splice(mt, 1), mt <= R && R--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(X) {
          return X ? a.inArray(X, A) > -1 : A.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return A && (A = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return C = L = [], A = f = "", this;
        },
        disabled: function() {
          return !A;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return C = !0, f || H.disable(), this;
        },
        locked: function() {
          return !!C;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(X, ft) {
          return C || (ft = ft || [], ft = [X, ft.slice ? ft.slice() : ft], L.push(ft), s || z()), this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          return H.fireWith(this, arguments), this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!d;
        }
      };
      return H;
    }, a.extend({
      Deferred: function(i) {
        var s = [
          // action, add listener, listener list, final state
          ["resolve", "done", a.Callbacks("once memory"), "resolved"],
          ["reject", "fail", a.Callbacks("once memory"), "rejected"],
          ["notify", "progress", a.Callbacks("memory")]
        ], f = "pending", d = {
          state: function() {
            return f;
          },
          always: function() {
            return C.done(arguments).fail(arguments), this;
          },
          then: function() {
            var A = arguments;
            return a.Deferred(function(L) {
              a.each(s, function(R, z) {
                var H = a.isFunction(A[R]) && A[R];
                C[z[1]](function() {
                  var X = H && H.apply(this, arguments);
                  X && a.isFunction(X.promise) ? X.promise().progress(L.notify).done(L.resolve).fail(L.reject) : L[z[0] + "With"](
                    this === d ? L.promise() : this,
                    H ? [X] : arguments
                  );
                });
              }), A = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(A) {
            return A != null ? a.extend(A, d) : d;
          }
        }, C = {};
        return d.pipe = d.then, a.each(s, function(A, L) {
          var R = L[2], z = L[3];
          d[L[1]] = R.add, z && R.add(function() {
            f = z;
          }, s[A ^ 1][2].disable, s[2][2].lock), C[L[0]] = function() {
            return C[L[0] + "With"](this === C ? d : this, arguments), this;
          }, C[L[0] + "With"] = R.fireWith;
        }), d.promise(C), i && i.call(C, C), C;
      },
      // Deferred helper
      when: function(i) {
        var s = 0, f = m.call(arguments), d = f.length, C = d !== 1 || i && a.isFunction(i.promise) ? d : 0, A = C === 1 ? i : a.Deferred(), L = function(X, ft, mt) {
          return function(ct) {
            ft[X] = this, mt[X] = arguments.length > 1 ? m.call(arguments) : ct, mt === R ? A.notifyWith(ft, mt) : --C || A.resolveWith(ft, mt);
          };
        }, R, z, H;
        if (d > 1)
          for (R = new Array(d), z = new Array(d), H = new Array(d); s < d; s++)
            f[s] && a.isFunction(f[s].promise) ? f[s].promise().progress(L(s, z, R)).done(L(s, H, f)).fail(A.reject) : --C;
        return C || A.resolveWith(H, f), A.promise();
      }
    });
    var At;
    a.fn.ready = function(i) {
      return a.ready.promise().done(i), this;
    }, a.extend({
      // Is the DOM ready to be used? Set to true once it occurs.
      isReady: !1,
      // A counter to track how many items to wait for before
      // the ready event fires. See #6781
      readyWait: 1,
      // Hold (or release) the ready event
      holdReady: function(i) {
        i ? a.readyWait++ : a.ready(!0);
      },
      // Handle when the DOM is ready
      ready: function(i) {
        (i === !0 ? --a.readyWait : a.isReady) || (a.isReady = !0, !(i !== !0 && --a.readyWait > 0) && (At.resolveWith(c, [a]), a.fn.triggerHandler && (a(c).triggerHandler("ready"), a(c).off("ready"))));
      }
    });
    function Lt() {
      c.addEventListener ? (c.removeEventListener("DOMContentLoaded", j), o.removeEventListener("load", j)) : (c.detachEvent("onreadystatechange", j), o.detachEvent("onload", j));
    }
    function j() {
      (c.addEventListener || o.event.type === "load" || c.readyState === "complete") && (Lt(), a.ready());
    }
    a.ready.promise = function(i) {
      if (!At)
        if (At = a.Deferred(), c.readyState === "complete" || c.readyState !== "loading" && !c.documentElement.doScroll)
          o.setTimeout(a.ready);
        else if (c.addEventListener)
          c.addEventListener("DOMContentLoaded", j), o.addEventListener("load", j);
        else {
          c.attachEvent("onreadystatechange", j), o.attachEvent("onload", j);
          var s = !1;
          try {
            s = o.frameElement == null && c.documentElement;
          } catch {
          }
          s && s.doScroll && function f() {
            if (!a.isReady) {
              try {
                s.doScroll("left");
              } catch {
                return o.setTimeout(f, 50);
              }
              Lt(), a.ready();
            }
          }();
        }
      return At.promise(i);
    }, a.ready.promise();
    var kt;
    for (kt in a(h))
      break;
    h.ownFirst = kt === "0", h.inlineBlockNeedsLayout = !1, a(function() {
      var i, s, f, d;
      f = c.getElementsByTagName("body")[0], !(!f || !f.style) && (s = c.createElement("div"), d = c.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", f.appendChild(d).appendChild(s), typeof s.style.zoom < "u" && (s.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", h.inlineBlockNeedsLayout = i = s.offsetWidth === 3, i && (f.style.zoom = 1)), f.removeChild(d));
    }), function() {
      var i = c.createElement("div");
      h.deleteExpando = !0;
      try {
        delete i.test;
      } catch {
        h.deleteExpando = !1;
      }
      i = null;
    }();
    var le = function(i) {
      var s = a.noData[(i.nodeName + " ").toLowerCase()], f = +i.nodeType || 1;
      return f !== 1 && f !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !s || s !== !0 && i.getAttribute("classid") === s
      );
    }, zt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, ie = /([A-Z])/g;
    function de(i, s, f) {
      if (f === void 0 && i.nodeType === 1) {
        var d = "data-" + s.replace(ie, "-$1").toLowerCase();
        if (f = i.getAttribute(d), typeof f == "string") {
          try {
            f = f === "true" ? !0 : f === "false" ? !1 : f === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +f + "" === f ? +f : zt.test(f) ? a.parseJSON(f) : f
            );
          } catch {
          }
          a.data(i, s, f);
        } else
          f = void 0;
      }
      return f;
    }
    function oe(i) {
      var s;
      for (s in i)
        if (!(s === "data" && a.isEmptyObject(i[s])) && s !== "toJSON")
          return !1;
      return !0;
    }
    function Yt(i, s, f, d) {
      if (le(i)) {
        var C, A, L = a.expando, R = i.nodeType, z = R ? a.cache : i, H = R ? i[L] : i[L] && L;
        if (!((!H || !z[H] || !d && !z[H].data) && f === void 0 && typeof s == "string"))
          return H || (R ? H = i[L] = l.pop() || a.guid++ : H = L), z[H] || (z[H] = R ? {} : { toJSON: a.noop }), (typeof s == "object" || typeof s == "function") && (d ? z[H] = a.extend(z[H], s) : z[H].data = a.extend(z[H].data, s)), A = z[H], d || (A.data || (A.data = {}), A = A.data), f !== void 0 && (A[a.camelCase(s)] = f), typeof s == "string" ? (C = A[s], C == null && (C = A[a.camelCase(s)])) : C = A, C;
      }
    }
    function Be(i, s, f) {
      if (le(i)) {
        var d, C, A = i.nodeType, L = A ? a.cache : i, R = A ? i[a.expando] : a.expando;
        if (L[R]) {
          if (s && (d = f ? L[R] : L[R].data, d)) {
            for (a.isArray(s) ? s = s.concat(a.map(s, a.camelCase)) : (s in d) ? s = [s] : (s = a.camelCase(s), s in d ? s = [s] : s = s.split(" ")), C = s.length; C--; )
              delete d[s[C]];
            if (f ? !oe(d) : !a.isEmptyObject(d))
              return;
          }
          !f && (delete L[R].data, !oe(L[R])) || (A ? a.cleanData([i], !0) : h.deleteExpando || L != L.window ? delete L[R] : L[R] = void 0);
        }
      }
    }
    a.extend({
      cache: {},
      // The following elements (space-suffixed to avoid Object.prototype collisions)
      // throw uncatchable exceptions if you attempt to set expando properties
      noData: {
        "applet ": !0,
        "embed ": !0,
        // ...but Flash objects (which have this classid) *can* handle expandos
        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      },
      hasData: function(i) {
        return i = i.nodeType ? a.cache[i[a.expando]] : i[a.expando], !!i && !oe(i);
      },
      data: function(i, s, f) {
        return Yt(i, s, f);
      },
      removeData: function(i, s) {
        return Be(i, s);
      },
      // For internal use only.
      _data: function(i, s, f) {
        return Yt(i, s, f, !0);
      },
      _removeData: function(i, s) {
        return Be(i, s, !0);
      }
    }), a.fn.extend({
      data: function(i, s) {
        var f, d, C, A = this[0], L = A && A.attributes;
        if (i === void 0) {
          if (this.length && (C = a.data(A), A.nodeType === 1 && !a._data(A, "parsedAttrs"))) {
            for (f = L.length; f--; )
              L[f] && (d = L[f].name, d.indexOf("data-") === 0 && (d = a.camelCase(d.slice(5)), de(A, d, C[d])));
            a._data(A, "parsedAttrs", !0);
          }
          return C;
        }
        return typeof i == "object" ? this.each(function() {
          a.data(this, i);
        }) : arguments.length > 1 ? (
          // Sets one value
          this.each(function() {
            a.data(this, i, s);
          })
        ) : (
          // Gets one value
          // Try to fetch any internally stored data first
          A ? de(A, i, a.data(A, i)) : void 0
        );
      },
      removeData: function(i) {
        return this.each(function() {
          a.removeData(this, i);
        });
      }
    }), a.extend({
      queue: function(i, s, f) {
        var d;
        if (i)
          return s = (s || "fx") + "queue", d = a._data(i, s), f && (!d || a.isArray(f) ? d = a._data(i, s, a.makeArray(f)) : d.push(f)), d || [];
      },
      dequeue: function(i, s) {
        s = s || "fx";
        var f = a.queue(i, s), d = f.length, C = f.shift(), A = a._queueHooks(i, s), L = function() {
          a.dequeue(i, s);
        };
        C === "inprogress" && (C = f.shift(), d--), C && (s === "fx" && f.unshift("inprogress"), delete A.stop, C.call(i, L, A)), !d && A && A.empty.fire();
      },
      // not intended for public consumption - generates a queueHooks object,
      // or returns the current one
      _queueHooks: function(i, s) {
        var f = s + "queueHooks";
        return a._data(i, f) || a._data(i, f, {
          empty: a.Callbacks("once memory").add(function() {
            a._removeData(i, s + "queue"), a._removeData(i, f);
          })
        });
      }
    }), a.fn.extend({
      queue: function(i, s) {
        var f = 2;
        return typeof i != "string" && (s = i, i = "fx", f--), arguments.length < f ? a.queue(this[0], i) : s === void 0 ? this : this.each(function() {
          var d = a.queue(this, i, s);
          a._queueHooks(this, i), i === "fx" && d[0] !== "inprogress" && a.dequeue(this, i);
        });
      },
      dequeue: function(i) {
        return this.each(function() {
          a.dequeue(this, i);
        });
      },
      clearQueue: function(i) {
        return this.queue(i || "fx", []);
      },
      // Get a promise resolved when queues of a certain type
      // are emptied (fx is the type by default)
      promise: function(i, s) {
        var f, d = 1, C = a.Deferred(), A = this, L = this.length, R = function() {
          --d || C.resolveWith(A, [A]);
        };
        for (typeof i != "string" && (s = i, i = void 0), i = i || "fx"; L--; )
          f = a._data(A[L], i + "queueHooks"), f && f.empty && (d++, f.empty.add(R));
        return R(), C.promise(s);
      }
    }), function() {
      var i;
      h.shrinkWrapBlocks = function() {
        if (i != null)
          return i;
        i = !1;
        var s, f, d;
        if (f = c.getElementsByTagName("body")[0], !(!f || !f.style))
          return s = c.createElement("div"), d = c.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", f.appendChild(d).appendChild(s), typeof s.style.zoom < "u" && (s.style.cssText = // Support: Firefox<29, Android 2.3
          // Vendor-prefix box-sizing
          "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", s.appendChild(c.createElement("div")).style.width = "5px", i = s.offsetWidth !== 3), f.removeChild(d), i;
      };
    }();
    var Je = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, ye = new RegExp("^(?:([+-])=|)(" + Je + ")([a-z%]*)$", "i"), Ot = ["Top", "Right", "Bottom", "Left"], rt = function(i, s) {
      return i = s || i, a.css(i, "display") === "none" || !a.contains(i.ownerDocument, i);
    };
    function dt(i, s, f, d) {
      var C, A = 1, L = 20, R = d ? function() {
        return d.cur();
      } : function() {
        return a.css(i, s, "");
      }, z = R(), H = f && f[3] || (a.cssNumber[s] ? "" : "px"), X = (a.cssNumber[s] || H !== "px" && +z) && ye.exec(a.css(i, s));
      if (X && X[3] !== H) {
        H = H || X[3], f = f || [], X = +z || 1;
        do
          A = A || ".5", X = X / A, a.style(i, s, X + H);
        while (A !== (A = R() / z) && A !== 1 && --L);
      }
      return f && (X = +X || +z || 0, C = f[1] ? X + (f[1] + 1) * f[2] : +f[2], d && (d.unit = H, d.start = X, d.end = C)), C;
    }
    var vt = function(i, s, f, d, C, A, L) {
      var R = 0, z = i.length, H = f == null;
      if (a.type(f) === "object") {
        C = !0;
        for (R in f)
          vt(i, s, R, f[R], !0, A, L);
      } else if (d !== void 0 && (C = !0, a.isFunction(d) || (L = !0), H && (L ? (s.call(i, d), s = null) : (H = s, s = function(X, ft, mt) {
        return H.call(a(X), mt);
      })), s))
        for (; R < z; R++)
          s(
            i[R],
            f,
            L ? d : d.call(i[R], R, s(i[R], f))
          );
      return C ? i : (
        // Gets
        H ? s.call(i) : z ? s(i[0], f) : A
      );
    }, Jt = /^(?:checkbox|radio)$/i, pe = /<([\w:-]+)/, xe = /^$|\/(?:java|ecma)script/i, Ve = /^\s+/, ke = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function Oe(i) {
      var s = ke.split("|"), f = i.createDocumentFragment();
      if (f.createElement)
        for (; s.length; )
          f.createElement(
            s.pop()
          );
      return f;
    }
    (function() {
      var i = c.createElement("div"), s = c.createDocumentFragment(), f = c.createElement("input");
      i.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", h.leadingWhitespace = i.firstChild.nodeType === 3, h.tbody = !i.getElementsByTagName("tbody").length, h.htmlSerialize = !!i.getElementsByTagName("link").length, h.html5Clone = c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", f.type = "checkbox", f.checked = !0, s.appendChild(f), h.appendChecked = f.checked, i.innerHTML = "<textarea>x</textarea>", h.noCloneChecked = !!i.cloneNode(!0).lastChild.defaultValue, s.appendChild(i), f = c.createElement("input"), f.setAttribute("type", "radio"), f.setAttribute("checked", "checked"), f.setAttribute("name", "t"), i.appendChild(f), h.checkClone = i.cloneNode(!0).cloneNode(!0).lastChild.checked, h.noCloneEvent = !!i.addEventListener, i[a.expando] = 1, h.attributes = !i.getAttribute(a.expando);
    })();
    var Me = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      area: [1, "<map>", "</map>"],
      // Support: IE8
      param: [1, "<object>", "</object>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
      // unless wrapped in a div with non-breaking characters in front of it.
      _default: h.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Me.optgroup = Me.option, Me.tbody = Me.tfoot = Me.colgroup = Me.caption = Me.thead, Me.th = Me.td;
    function Ae(i, s) {
      var f, d, C = 0, A = typeof i.getElementsByTagName < "u" ? i.getElementsByTagName(s || "*") : typeof i.querySelectorAll < "u" ? i.querySelectorAll(s || "*") : void 0;
      if (!A)
        for (A = [], f = i.childNodes || i; (d = f[C]) != null; C++)
          !s || a.nodeName(d, s) ? A.push(d) : a.merge(A, Ae(d, s));
      return s === void 0 || s && a.nodeName(i, s) ? a.merge([i], A) : A;
    }
    function qn(i, s) {
      for (var f, d = 0; (f = i[d]) != null; d++)
        a._data(
          f,
          "globalEval",
          !s || a._data(s[d], "globalEval")
        );
    }
    var Ln = /<|&#?\w+;/, br = /<tbody/i;
    function kn(i) {
      Jt.test(i.type) && (i.defaultChecked = i.checked);
    }
    function dn(i, s, f, d, C) {
      for (var A, L, R, z, H, X, ft, mt = i.length, ct = Oe(s), Ut = [], qt = 0; qt < mt; qt++)
        if (L = i[qt], L || L === 0)
          if (a.type(L) === "object")
            a.merge(Ut, L.nodeType ? [L] : L);
          else if (!Ln.test(L))
            Ut.push(s.createTextNode(L));
          else {
            for (z = z || ct.appendChild(s.createElement("div")), H = (pe.exec(L) || ["", ""])[1].toLowerCase(), ft = Me[H] || Me._default, z.innerHTML = ft[1] + a.htmlPrefilter(L) + ft[2], A = ft[0]; A--; )
              z = z.lastChild;
            if (!h.leadingWhitespace && Ve.test(L) && Ut.push(s.createTextNode(Ve.exec(L)[0])), !h.tbody)
              for (L = H === "table" && !br.test(L) ? z.firstChild : (
                // String was a bare <thead> or <tfoot>
                ft[1] === "<table>" && !br.test(L) ? z : 0
              ), A = L && L.childNodes.length; A--; )
                a.nodeName(X = L.childNodes[A], "tbody") && !X.childNodes.length && L.removeChild(X);
            for (a.merge(Ut, z.childNodes), z.textContent = ""; z.firstChild; )
              z.removeChild(z.firstChild);
            z = ct.lastChild;
          }
      for (z && ct.removeChild(z), h.appendChecked || a.grep(Ae(Ut, "input"), kn), qt = 0; L = Ut[qt++]; ) {
        if (d && a.inArray(L, d) > -1) {
          C && C.push(L);
          continue;
        }
        if (R = a.contains(L.ownerDocument, L), z = Ae(ct.appendChild(L), "script"), R && qn(z), f)
          for (A = 0; L = z[A++]; )
            xe.test(L.type || "") && f.push(L);
      }
      return z = null, ct;
    }
    (function() {
      var i, s, f = c.createElement("div");
      for (i in { submit: !0, change: !0, focusin: !0 })
        s = "on" + i, (h[i] = s in o) || (f.setAttribute(s, "t"), h[i] = f.attributes[s].expando === !1);
      f = null;
    })();
    var wr = /^(?:input|select|textarea)$/i, li = /^key/, fi = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Wr = /^(?:focusinfocus|focusoutblur)$/, $r = /^([^.]*)(?:\.(.+)|)/;
    function it() {
      return !0;
    }
    function St() {
      return !1;
    }
    function Rt() {
      try {
        return c.activeElement;
      } catch {
      }
    }
    function ae(i, s, f, d, C, A) {
      var L, R;
      if (typeof s == "object") {
        typeof f != "string" && (d = d || f, f = void 0);
        for (R in s)
          ae(i, R, f, d, s[R], A);
        return i;
      }
      if (d == null && C == null ? (C = f, d = f = void 0) : C == null && (typeof f == "string" ? (C = d, d = void 0) : (C = d, d = f, f = void 0)), C === !1)
        C = St;
      else if (!C)
        return i;
      return A === 1 && (L = C, C = function(z) {
        return a().off(z), L.apply(this, arguments);
      }, C.guid = L.guid || (L.guid = a.guid++)), i.each(function() {
        a.event.add(this, s, C, d, f);
      });
    }
    a.event = {
      global: {},
      add: function(i, s, f, d, C) {
        var A, L, R, z, H, X, ft, mt, ct, Ut, qt, Qt = a._data(i);
        if (Qt) {
          for (f.handler && (z = f, f = z.handler, C = z.selector), f.guid || (f.guid = a.guid++), (L = Qt.events) || (L = Qt.events = {}), (X = Qt.handle) || (X = Qt.handle = function(Xe) {
            return typeof a < "u" && (!Xe || a.event.triggered !== Xe.type) ? a.event.dispatch.apply(X.elem, arguments) : void 0;
          }, X.elem = i), s = (s || "").match(lt) || [""], R = s.length; R--; )
            A = $r.exec(s[R]) || [], ct = qt = A[1], Ut = (A[2] || "").split(".").sort(), ct && (H = a.event.special[ct] || {}, ct = (C ? H.delegateType : H.bindType) || ct, H = a.event.special[ct] || {}, ft = a.extend({
              type: ct,
              origType: qt,
              data: d,
              handler: f,
              guid: f.guid,
              selector: C,
              needsContext: C && a.expr.match.needsContext.test(C),
              namespace: Ut.join(".")
            }, z), (mt = L[ct]) || (mt = L[ct] = [], mt.delegateCount = 0, (!H.setup || H.setup.call(i, d, Ut, X) === !1) && (i.addEventListener ? i.addEventListener(ct, X, !1) : i.attachEvent && i.attachEvent("on" + ct, X))), H.add && (H.add.call(i, ft), ft.handler.guid || (ft.handler.guid = f.guid)), C ? mt.splice(mt.delegateCount++, 0, ft) : mt.push(ft), a.event.global[ct] = !0);
          i = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(i, s, f, d, C) {
        var A, L, R, z, H, X, ft, mt, ct, Ut, qt, Qt = a.hasData(i) && a._data(i);
        if (!(!Qt || !(X = Qt.events))) {
          for (s = (s || "").match(lt) || [""], H = s.length; H--; ) {
            if (R = $r.exec(s[H]) || [], ct = qt = R[1], Ut = (R[2] || "").split(".").sort(), !ct) {
              for (ct in X)
                a.event.remove(i, ct + s[H], f, d, !0);
              continue;
            }
            for (ft = a.event.special[ct] || {}, ct = (d ? ft.delegateType : ft.bindType) || ct, mt = X[ct] || [], R = R[2] && new RegExp("(^|\\.)" + Ut.join("\\.(?:.*\\.|)") + "(\\.|$)"), z = A = mt.length; A--; )
              L = mt[A], (C || qt === L.origType) && (!f || f.guid === L.guid) && (!R || R.test(L.namespace)) && (!d || d === L.selector || d === "**" && L.selector) && (mt.splice(A, 1), L.selector && mt.delegateCount--, ft.remove && ft.remove.call(i, L));
            z && !mt.length && ((!ft.teardown || ft.teardown.call(i, Ut, Qt.handle) === !1) && a.removeEvent(i, ct, Qt.handle), delete X[ct]);
          }
          a.isEmptyObject(X) && (delete Qt.handle, a._removeData(i, "events"));
        }
      },
      trigger: function(i, s, f, d) {
        var C, A, L, R, z, H, X, ft = [f || c], mt = x.call(i, "type") ? i.type : i, ct = x.call(i, "namespace") ? i.namespace.split(".") : [];
        if (L = H = f = f || c, !(f.nodeType === 3 || f.nodeType === 8) && !Wr.test(mt + a.event.triggered) && (mt.indexOf(".") > -1 && (ct = mt.split("."), mt = ct.shift(), ct.sort()), A = mt.indexOf(":") < 0 && "on" + mt, i = i[a.expando] ? i : new a.Event(mt, typeof i == "object" && i), i.isTrigger = d ? 2 : 3, i.namespace = ct.join("."), i.rnamespace = i.namespace ? new RegExp("(^|\\.)" + ct.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, i.result = void 0, i.target || (i.target = f), s = s == null ? [i] : a.makeArray(s, [i]), z = a.event.special[mt] || {}, !(!d && z.trigger && z.trigger.apply(f, s) === !1))) {
          if (!d && !z.noBubble && !a.isWindow(f)) {
            for (R = z.delegateType || mt, Wr.test(R + mt) || (L = L.parentNode); L; L = L.parentNode)
              ft.push(L), H = L;
            H === (f.ownerDocument || c) && ft.push(H.defaultView || H.parentWindow || o);
          }
          for (X = 0; (L = ft[X++]) && !i.isPropagationStopped(); )
            i.type = X > 1 ? R : z.bindType || mt, C = (a._data(L, "events") || {})[i.type] && a._data(L, "handle"), C && C.apply(L, s), C = A && L[A], C && C.apply && le(L) && (i.result = C.apply(L, s), i.result === !1 && i.preventDefault());
          if (i.type = mt, !d && !i.isDefaultPrevented() && (!z._default || z._default.apply(ft.pop(), s) === !1) && le(f) && A && f[mt] && !a.isWindow(f)) {
            H = f[A], H && (f[A] = null), a.event.triggered = mt;
            try {
              f[mt]();
            } catch {
            }
            a.event.triggered = void 0, H && (f[A] = H);
          }
          return i.result;
        }
      },
      dispatch: function(i) {
        i = a.event.fix(i);
        var s, f, d, C, A, L = [], R = m.call(arguments), z = (a._data(this, "events") || {})[i.type] || [], H = a.event.special[i.type] || {};
        if (R[0] = i, i.delegateTarget = this, !(H.preDispatch && H.preDispatch.call(this, i) === !1)) {
          for (L = a.event.handlers.call(this, i, z), s = 0; (C = L[s++]) && !i.isPropagationStopped(); )
            for (i.currentTarget = C.elem, f = 0; (A = C.handlers[f++]) && !i.isImmediatePropagationStopped(); )
              (!i.rnamespace || i.rnamespace.test(A.namespace)) && (i.handleObj = A, i.data = A.data, d = ((a.event.special[A.origType] || {}).handle || A.handler).apply(C.elem, R), d !== void 0 && (i.result = d) === !1 && (i.preventDefault(), i.stopPropagation()));
          return H.postDispatch && H.postDispatch.call(this, i), i.result;
        }
      },
      handlers: function(i, s) {
        var f, d, C, A, L = [], R = s.delegateCount, z = i.target;
        if (R && z.nodeType && (i.type !== "click" || isNaN(i.button) || i.button < 1)) {
          for (; z != this; z = z.parentNode || this)
            if (z.nodeType === 1 && (z.disabled !== !0 || i.type !== "click")) {
              for (d = [], f = 0; f < R; f++)
                A = s[f], C = A.selector + " ", d[C] === void 0 && (d[C] = A.needsContext ? a(C, this).index(z) > -1 : a.find(C, this, null, [z]).length), d[C] && d.push(A);
              d.length && L.push({ elem: z, handlers: d });
            }
        }
        return R < s.length && L.push({ elem: this, handlers: s.slice(R) }), L;
      },
      fix: function(i) {
        if (i[a.expando])
          return i;
        var s, f, d, C = i.type, A = i, L = this.fixHooks[C];
        for (L || (this.fixHooks[C] = L = fi.test(C) ? this.mouseHooks : li.test(C) ? this.keyHooks : {}), d = L.props ? this.props.concat(L.props) : this.props, i = new a.Event(A), s = d.length; s--; )
          f = d[s], i[f] = A[f];
        return i.target || (i.target = A.srcElement || c), i.target.nodeType === 3 && (i.target = i.target.parentNode), i.metaKey = !!i.metaKey, L.filter ? L.filter(i, A) : i;
      },
      // Includes some event props shared by KeyEvent and MouseEvent
      props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(i, s) {
          return i.which == null && (i.which = s.charCode != null ? s.charCode : s.keyCode), i;
        }
      },
      mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(i, s) {
          var f, d, C, A = s.button, L = s.fromElement;
          return i.pageX == null && s.clientX != null && (d = i.target.ownerDocument || c, C = d.documentElement, f = d.body, i.pageX = s.clientX + (C && C.scrollLeft || f && f.scrollLeft || 0) - (C && C.clientLeft || f && f.clientLeft || 0), i.pageY = s.clientY + (C && C.scrollTop || f && f.scrollTop || 0) - (C && C.clientTop || f && f.clientTop || 0)), !i.relatedTarget && L && (i.relatedTarget = L === i.target ? s.toElement : L), !i.which && A !== void 0 && (i.which = A & 1 ? 1 : A & 2 ? 3 : A & 4 ? 2 : 0), i;
        }
      },
      special: {
        load: {
          // Prevent triggered image.load events from bubbling to window.load
          noBubble: !0
        },
        focus: {
          // Fire native event if possible so blur/focus sequence is correct
          trigger: function() {
            if (this !== Rt() && this.focus)
              try {
                return this.focus(), !1;
              } catch {
              }
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            if (this === Rt() && this.blur)
              return this.blur(), !1;
          },
          delegateType: "focusout"
        },
        click: {
          // For checkbox, fire native event so checked state will be right
          trigger: function() {
            if (a.nodeName(this, "input") && this.type === "checkbox" && this.click)
              return this.click(), !1;
          },
          // For cross-browser consistency, don't fire native .click() on links
          _default: function(i) {
            return a.nodeName(i.target, "a");
          }
        },
        beforeunload: {
          postDispatch: function(i) {
            i.result !== void 0 && i.originalEvent && (i.originalEvent.returnValue = i.result);
          }
        }
      },
      // Piggyback on a donor event to simulate a different one
      simulate: function(i, s, f) {
        var d = a.extend(
          new a.Event(),
          f,
          {
            type: i,
            isSimulated: !0
            // Previously, `originalEvent: {}` was set here, so stopPropagation call
            // would not be triggered on donor event, since in our own
            // jQuery.event.stopPropagation function we had a check for existence of
            // originalEvent.stopPropagation method, so, consequently it would be a noop.
            //
            // Guard for simulated events was moved to jQuery.event.stopPropagation function
            // since `originalEvent` should point to the original event for the
            // constancy with other events and for more focused logic
          }
        );
        a.event.trigger(d, null, s), d.isDefaultPrevented() && f.preventDefault();
      }
    }, a.removeEvent = c.removeEventListener ? function(i, s, f) {
      i.removeEventListener && i.removeEventListener(s, f);
    } : function(i, s, f) {
      var d = "on" + s;
      i.detachEvent && (typeof i[d] > "u" && (i[d] = null), i.detachEvent(d, f));
    }, a.Event = function(i, s) {
      if (!(this instanceof a.Event))
        return new a.Event(i, s);
      i && i.type ? (this.originalEvent = i, this.type = i.type, this.isDefaultPrevented = i.defaultPrevented || i.defaultPrevented === void 0 && // Support: IE < 9, Android < 4.0
      i.returnValue === !1 ? it : St) : this.type = i, s && a.extend(this, s), this.timeStamp = i && i.timeStamp || a.now(), this[a.expando] = !0;
    }, a.Event.prototype = {
      constructor: a.Event,
      isDefaultPrevented: St,
      isPropagationStopped: St,
      isImmediatePropagationStopped: St,
      preventDefault: function() {
        var i = this.originalEvent;
        this.isDefaultPrevented = it, i && (i.preventDefault ? i.preventDefault() : i.returnValue = !1);
      },
      stopPropagation: function() {
        var i = this.originalEvent;
        this.isPropagationStopped = it, !(!i || this.isSimulated) && (i.stopPropagation && i.stopPropagation(), i.cancelBubble = !0);
      },
      stopImmediatePropagation: function() {
        var i = this.originalEvent;
        this.isImmediatePropagationStopped = it, i && i.stopImmediatePropagation && i.stopImmediatePropagation(), this.stopPropagation();
      }
    }, a.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(i, s) {
      a.event.special[i] = {
        delegateType: s,
        bindType: s,
        handle: function(f) {
          var d, C = this, A = f.relatedTarget, L = f.handleObj;
          return (!A || A !== C && !a.contains(C, A)) && (f.type = L.origType, d = L.handler.apply(this, arguments), f.type = s), d;
        }
      };
    }), h.submit || (a.event.special.submit = {
      setup: function() {
        if (a.nodeName(this, "form"))
          return !1;
        a.event.add(this, "click._submit keypress._submit", function(i) {
          var s = i.target, f = a.nodeName(s, "input") || a.nodeName(s, "button") ? (
            // Support: IE <=8
            // We use jQuery.prop instead of elem.form
            // to allow fixing the IE8 delegated submit issue (gh-2332)
            // by 3rd party polyfills/workarounds.
            a.prop(s, "form")
          ) : void 0;
          f && !a._data(f, "submit") && (a.event.add(f, "submit._submit", function(d) {
            d._submitBubble = !0;
          }), a._data(f, "submit", !0));
        });
      },
      postDispatch: function(i) {
        i._submitBubble && (delete i._submitBubble, this.parentNode && !i.isTrigger && a.event.simulate("submit", this.parentNode, i));
      },
      teardown: function() {
        if (a.nodeName(this, "form"))
          return !1;
        a.event.remove(this, "._submit");
      }
    }), h.change || (a.event.special.change = {
      setup: function() {
        if (wr.test(this.nodeName))
          return (this.type === "checkbox" || this.type === "radio") && (a.event.add(this, "propertychange._change", function(i) {
            i.originalEvent.propertyName === "checked" && (this._justChanged = !0);
          }), a.event.add(this, "click._change", function(i) {
            this._justChanged && !i.isTrigger && (this._justChanged = !1), a.event.simulate("change", this, i);
          })), !1;
        a.event.add(this, "beforeactivate._change", function(i) {
          var s = i.target;
          wr.test(s.nodeName) && !a._data(s, "change") && (a.event.add(s, "change._change", function(f) {
            this.parentNode && !f.isSimulated && !f.isTrigger && a.event.simulate("change", this.parentNode, f);
          }), a._data(s, "change", !0));
        });
      },
      handle: function(i) {
        var s = i.target;
        if (this !== s || i.isSimulated || i.isTrigger || s.type !== "radio" && s.type !== "checkbox")
          return i.handleObj.handler.apply(this, arguments);
      },
      teardown: function() {
        return a.event.remove(this, "._change"), !wr.test(this.nodeName);
      }
    }), h.focusin || a.each({ focus: "focusin", blur: "focusout" }, function(i, s) {
      var f = function(d) {
        a.event.simulate(s, d.target, a.event.fix(d));
      };
      a.event.special[s] = {
        setup: function() {
          var d = this.ownerDocument || this, C = a._data(d, s);
          C || d.addEventListener(i, f, !0), a._data(d, s, (C || 0) + 1);
        },
        teardown: function() {
          var d = this.ownerDocument || this, C = a._data(d, s) - 1;
          C ? a._data(d, s, C) : (d.removeEventListener(i, f, !0), a._removeData(d, s));
        }
      };
    }), a.fn.extend({
      on: function(i, s, f, d) {
        return ae(this, i, s, f, d);
      },
      one: function(i, s, f, d) {
        return ae(this, i, s, f, d, 1);
      },
      off: function(i, s, f) {
        var d, C;
        if (i && i.preventDefault && i.handleObj)
          return d = i.handleObj, a(i.delegateTarget).off(
            d.namespace ? d.origType + "." + d.namespace : d.origType,
            d.selector,
            d.handler
          ), this;
        if (typeof i == "object") {
          for (C in i)
            this.off(C, s, i[C]);
          return this;
        }
        return (s === !1 || typeof s == "function") && (f = s, s = void 0), f === !1 && (f = St), this.each(function() {
          a.event.remove(this, i, f, s);
        });
      },
      trigger: function(i, s) {
        return this.each(function() {
          a.event.trigger(i, s, this);
        });
      },
      triggerHandler: function(i, s) {
        var f = this[0];
        if (f)
          return a.event.trigger(i, s, f, !0);
      }
    });
    var se = / jQuery\d+="(?:null|\d+)"/g, $e = new RegExp("<(?:" + ke + ")[\\s/>]", "i"), tn = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, Hn = /<script|<style|<link/i, ci = /checked\s*(?:[^=]|=\s*.checked.)/i, Wn = /^true\/(.*)/, hi = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Gr = Oe(c), Pn = Gr.appendChild(c.createElement("div"));
    function di(i, s) {
      return a.nodeName(i, "table") && a.nodeName(s.nodeType !== 11 ? s : s.firstChild, "tr") ? i.getElementsByTagName("tbody")[0] || i.appendChild(i.ownerDocument.createElement("tbody")) : i;
    }
    function Ur(i) {
      return i.type = (a.find.attr(i, "type") !== null) + "/" + i.type, i;
    }
    function xr(i) {
      var s = Wn.exec(i.type);
      return s ? i.type = s[1] : i.removeAttribute("type"), i;
    }
    function wa(i, s) {
      if (!(s.nodeType !== 1 || !a.hasData(i))) {
        var f, d, C, A = a._data(i), L = a._data(s, A), R = A.events;
        if (R) {
          delete L.handle, L.events = {};
          for (f in R)
            for (d = 0, C = R[f].length; d < C; d++)
              a.event.add(s, f, R[f][d]);
        }
        L.data && (L.data = a.extend({}, L.data));
      }
    }
    function _o(i, s) {
      var f, d, C;
      if (s.nodeType === 1) {
        if (f = s.nodeName.toLowerCase(), !h.noCloneEvent && s[a.expando]) {
          C = a._data(s);
          for (d in C.events)
            a.removeEvent(s, d, C.handle);
          s.removeAttribute(a.expando);
        }
        f === "script" && s.text !== i.text ? (Ur(s).text = i.text, xr(s)) : f === "object" ? (s.parentNode && (s.outerHTML = i.outerHTML), h.html5Clone && i.innerHTML && !a.trim(s.innerHTML) && (s.innerHTML = i.innerHTML)) : f === "input" && Jt.test(i.type) ? (s.defaultChecked = s.checked = i.checked, s.value !== i.value && (s.value = i.value)) : f === "option" ? s.defaultSelected = s.selected = i.defaultSelected : (f === "input" || f === "textarea") && (s.defaultValue = i.defaultValue);
      }
    }
    function _r(i, s, f, d) {
      s = g.apply([], s);
      var C, A, L, R, z, H, X = 0, ft = i.length, mt = ft - 1, ct = s[0], Ut = a.isFunction(ct);
      if (Ut || ft > 1 && typeof ct == "string" && !h.checkClone && ci.test(ct))
        return i.each(function(qt) {
          var Qt = i.eq(qt);
          Ut && (s[0] = ct.call(this, qt, Qt.html())), _r(Qt, s, f, d);
        });
      if (ft && (H = dn(s, i[0].ownerDocument, !1, i, d), C = H.firstChild, H.childNodes.length === 1 && (H = C), C || d)) {
        for (R = a.map(Ae(H, "script"), Ur), L = R.length; X < ft; X++)
          A = H, X !== mt && (A = a.clone(A, !0, !0), L && a.merge(R, Ae(A, "script"))), f.call(i[X], A, X);
        if (L)
          for (z = R[R.length - 1].ownerDocument, a.map(R, xr), X = 0; X < L; X++)
            A = R[X], xe.test(A.type || "") && !a._data(A, "globalEval") && a.contains(z, A) && (A.src ? a._evalUrl && a._evalUrl(A.src) : a.globalEval(
              (A.text || A.textContent || A.innerHTML || "").replace(hi, "")
            ));
        H = C = null;
      }
      return i;
    }
    function Bi(i, s, f) {
      for (var d, C = s ? a.filter(s, i) : i, A = 0; (d = C[A]) != null; A++)
        !f && d.nodeType === 1 && a.cleanData(Ae(d)), d.parentNode && (f && a.contains(d.ownerDocument, d) && qn(Ae(d, "script")), d.parentNode.removeChild(d));
      return i;
    }
    a.extend({
      htmlPrefilter: function(i) {
        return i.replace(tn, "<$1></$2>");
      },
      clone: function(i, s, f) {
        var d, C, A, L, R, z = a.contains(i.ownerDocument, i);
        if (h.html5Clone || a.isXMLDoc(i) || !$e.test("<" + i.nodeName + ">") ? A = i.cloneNode(!0) : (Pn.innerHTML = i.outerHTML, Pn.removeChild(A = Pn.firstChild)), (!h.noCloneEvent || !h.noCloneChecked) && (i.nodeType === 1 || i.nodeType === 11) && !a.isXMLDoc(i))
          for (d = Ae(A), R = Ae(i), L = 0; (C = R[L]) != null; ++L)
            d[L] && _o(C, d[L]);
        if (s)
          if (f)
            for (R = R || Ae(i), d = d || Ae(A), L = 0; (C = R[L]) != null; L++)
              wa(C, d[L]);
          else
            wa(i, A);
        return d = Ae(A, "script"), d.length > 0 && qn(d, !z && Ae(i, "script")), d = R = C = null, A;
      },
      cleanData: function(i, s) {
        for (var f, d, C, A, L = 0, R = a.expando, z = a.cache, H = h.attributes, X = a.event.special; (f = i[L]) != null; L++)
          if ((s || le(f)) && (C = f[R], A = C && z[C], A)) {
            if (A.events)
              for (d in A.events)
                X[d] ? a.event.remove(f, d) : a.removeEvent(f, d, A.handle);
            z[C] && (delete z[C], !H && typeof f.removeAttribute < "u" ? f.removeAttribute(R) : f[R] = void 0, l.push(C));
          }
      }
    }), a.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: _r,
      detach: function(i) {
        return Bi(this, i, !0);
      },
      remove: function(i) {
        return Bi(this, i);
      },
      text: function(i) {
        return vt(this, function(s) {
          return s === void 0 ? a.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || c).createTextNode(s)
          );
        }, null, i, arguments.length);
      },
      append: function() {
        return _r(this, arguments, function(i) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var s = di(this, i);
            s.appendChild(i);
          }
        });
      },
      prepend: function() {
        return _r(this, arguments, function(i) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var s = di(this, i);
            s.insertBefore(i, s.firstChild);
          }
        });
      },
      before: function() {
        return _r(this, arguments, function(i) {
          this.parentNode && this.parentNode.insertBefore(i, this);
        });
      },
      after: function() {
        return _r(this, arguments, function(i) {
          this.parentNode && this.parentNode.insertBefore(i, this.nextSibling);
        });
      },
      empty: function() {
        for (var i, s = 0; (i = this[s]) != null; s++) {
          for (i.nodeType === 1 && a.cleanData(Ae(i, !1)); i.firstChild; )
            i.removeChild(i.firstChild);
          i.options && a.nodeName(i, "select") && (i.options.length = 0);
        }
        return this;
      },
      clone: function(i, s) {
        return i = i ?? !1, s = s ?? i, this.map(function() {
          return a.clone(this, i, s);
        });
      },
      html: function(i) {
        return vt(this, function(s) {
          var f = this[0] || {}, d = 0, C = this.length;
          if (s === void 0)
            return f.nodeType === 1 ? f.innerHTML.replace(se, "") : void 0;
          if (typeof s == "string" && !Hn.test(s) && (h.htmlSerialize || !$e.test(s)) && (h.leadingWhitespace || !Ve.test(s)) && !Me[(pe.exec(s) || ["", ""])[1].toLowerCase()]) {
            s = a.htmlPrefilter(s);
            try {
              for (; d < C; d++)
                f = this[d] || {}, f.nodeType === 1 && (a.cleanData(Ae(f, !1)), f.innerHTML = s);
              f = 0;
            } catch {
            }
          }
          f && this.empty().append(s);
        }, null, i, arguments.length);
      },
      replaceWith: function() {
        var i = [];
        return _r(this, arguments, function(s) {
          var f = this.parentNode;
          a.inArray(this, i) < 0 && (a.cleanData(Ae(this)), f && f.replaceChild(s, this));
        }, i);
      }
    }), a.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(i, s) {
      a.fn[i] = function(f) {
        for (var d, C = 0, A = [], L = a(f), R = L.length - 1; C <= R; C++)
          d = C === R ? this : this.clone(!0), a(L[C])[s](d), b.apply(A, d.get());
        return this.pushStack(A);
      };
    });
    var pi, xa = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function _a(i, s) {
      var f = a(s.createElement(i)).appendTo(s.body), d = a.css(f[0], "display");
      return f.detach(), d;
    }
    function Fi(i) {
      var s = c, f = xa[i];
      return f || (f = _a(i, s), (f === "none" || !f) && (pi = (pi || a("<iframe frameborder='0' width='0' height='0'/>")).appendTo(s.documentElement), s = (pi[0].contentWindow || pi[0].contentDocument).document, s.write(), s.close(), f = _a(i, s), pi.detach()), xa[i] = f), f;
    }
    var Ca = /^margin/, zi = new RegExp("^(" + Je + ")(?!px)[a-z%]+$", "i"), Co = function(i, s, f, d) {
      var C, A, L = {};
      for (A in s)
        L[A] = i.style[A], i.style[A] = s[A];
      C = f.apply(i, d || []);
      for (A in s)
        i.style[A] = L[A];
      return C;
    }, Aa = c.documentElement;
    (function() {
      var i, s, f, d, C, A, L = c.createElement("div"), R = c.createElement("div");
      if (!R.style)
        return;
      R.style.cssText = "float:left;opacity:.5", h.opacity = R.style.opacity === "0.5", h.cssFloat = !!R.style.cssFloat, R.style.backgroundClip = "content-box", R.cloneNode(!0).style.backgroundClip = "", h.clearCloneStyle = R.style.backgroundClip === "content-box", L = c.createElement("div"), L.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", R.innerHTML = "", L.appendChild(R), h.boxSizing = R.style.boxSizing === "" || R.style.MozBoxSizing === "" || R.style.WebkitBoxSizing === "", a.extend(h, {
        reliableHiddenOffsets: function() {
          return i == null && z(), d;
        },
        boxSizingReliable: function() {
          return i == null && z(), f;
        },
        pixelMarginRight: function() {
          return i == null && z(), s;
        },
        pixelPosition: function() {
          return i == null && z(), i;
        },
        reliableMarginRight: function() {
          return i == null && z(), C;
        },
        reliableMarginLeft: function() {
          return i == null && z(), A;
        }
      });
      function z() {
        var H, X, ft = c.documentElement;
        ft.appendChild(L), R.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", i = f = A = !1, s = C = !0, o.getComputedStyle && (X = o.getComputedStyle(R), i = (X || {}).top !== "1%", A = (X || {}).marginLeft === "2px", f = (X || { width: "4px" }).width === "4px", R.style.marginRight = "50%", s = (X || { marginRight: "4px" }).marginRight === "4px", H = R.appendChild(c.createElement("div")), H.style.cssText = R.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", H.style.marginRight = H.style.width = "0", R.style.width = "1px", C = !parseFloat((o.getComputedStyle(H) || {}).marginRight), R.removeChild(H)), R.style.display = "none", d = R.getClientRects().length === 0, d && (R.style.display = "", R.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", R.childNodes[0].style.borderCollapse = "separate", H = R.getElementsByTagName("td"), H[0].style.cssText = "margin:0;border:0;padding:0;display:none", d = H[0].offsetHeight === 0, d && (H[0].style.display = "", H[1].style.display = "none", d = H[0].offsetHeight === 0)), ft.removeChild(L);
      }
    })();
    var ir, or, ou = /^(top|right|bottom|left)$/;
    o.getComputedStyle ? (ir = function(i) {
      var s = i.ownerDocument.defaultView;
      return (!s || !s.opener) && (s = o), s.getComputedStyle(i);
    }, or = function(i, s, f) {
      var d, C, A, L, R = i.style;
      return f = f || ir(i), L = f ? f.getPropertyValue(s) || f[s] : void 0, (L === "" || L === void 0) && !a.contains(i.ownerDocument, i) && (L = a.style(i, s)), f && !h.pixelMarginRight() && zi.test(L) && Ca.test(s) && (d = R.width, C = R.minWidth, A = R.maxWidth, R.minWidth = R.maxWidth = R.width = L, L = f.width, R.width = d, R.minWidth = C, R.maxWidth = A), L === void 0 ? L : L + "";
    }) : Aa.currentStyle && (ir = function(i) {
      return i.currentStyle;
    }, or = function(i, s, f) {
      var d, C, A, L, R = i.style;
      return f = f || ir(i), L = f ? f[s] : void 0, L == null && R && R[s] && (L = R[s]), zi.test(L) && !ou.test(s) && (d = R.left, C = i.runtimeStyle, A = C && C.left, A && (C.left = i.currentStyle.left), R.left = s === "fontSize" ? "1em" : L, L = R.pixelLeft + "px", R.left = d, A && (C.left = A)), L === void 0 ? L : L + "" || "auto";
    });
    function Ao(i, s) {
      return {
        get: function() {
          if (i()) {
            delete this.get;
            return;
          }
          return (this.get = s).apply(this, arguments);
        }
      };
    }
    var So = /alpha\([^)]*\)/i, au = /opacity\s*=\s*([^)]*)/i, su = /^(none|table(?!-c[ea]).+)/, qi = new RegExp("^(" + Je + ")(.*)$", "i"), uu = { position: "absolute", visibility: "hidden", display: "block" }, gi = {
      letterSpacing: "0",
      fontWeight: "400"
    }, Sa = ["Webkit", "O", "Moz", "ms"], Ea = c.createElement("div").style;
    function Ta(i) {
      if (i in Ea)
        return i;
      for (var s = i.charAt(0).toUpperCase() + i.slice(1), f = Sa.length; f--; )
        if (i = Sa[f] + s, i in Ea)
          return i;
    }
    function Eo(i, s) {
      for (var f, d, C, A = [], L = 0, R = i.length; L < R; L++)
        d = i[L], d.style && (A[L] = a._data(d, "olddisplay"), f = d.style.display, s ? (!A[L] && f === "none" && (d.style.display = ""), d.style.display === "" && rt(d) && (A[L] = a._data(d, "olddisplay", Fi(d.nodeName)))) : (C = rt(d), (f && f !== "none" || !C) && a._data(
          d,
          "olddisplay",
          C ? f : a.css(d, "display")
        )));
      for (L = 0; L < R; L++)
        d = i[L], d.style && (!s || d.style.display === "none" || d.style.display === "") && (d.style.display = s ? A[L] || "" : "none");
      return i;
    }
    function To(i, s, f) {
      var d = qi.exec(s);
      return d ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, d[1] - (f || 0)) + (d[2] || "px")
      ) : s;
    }
    function Lo(i, s, f, d, C) {
      for (var A = f === (d ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        s === "width" ? 1 : 0
      ), L = 0; A < 4; A += 2)
        f === "margin" && (L += a.css(i, f + Ot[A], !0, C)), d ? (f === "content" && (L -= a.css(i, "padding" + Ot[A], !0, C)), f !== "margin" && (L -= a.css(i, "border" + Ot[A] + "Width", !0, C))) : (L += a.css(i, "padding" + Ot[A], !0, C), f !== "padding" && (L += a.css(i, "border" + Ot[A] + "Width", !0, C)));
      return L;
    }
    function La(i, s, f) {
      var d = !0, C = s === "width" ? i.offsetWidth : i.offsetHeight, A = ir(i), L = h.boxSizing && a.css(i, "boxSizing", !1, A) === "border-box";
      if (C <= 0 || C == null) {
        if (C = or(i, s, A), (C < 0 || C == null) && (C = i.style[s]), zi.test(C))
          return C;
        d = L && (h.boxSizingReliable() || C === i.style[s]), C = parseFloat(C) || 0;
      }
      return C + Lo(
        i,
        s,
        f || (L ? "border" : "content"),
        d,
        A
      ) + "px";
    }
    a.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
        opacity: {
          get: function(i, s) {
            if (s) {
              var f = or(i, "opacity");
              return f === "" ? "1" : f;
            }
          }
        }
      },
      // Don't automatically add "px" to these possibly-unitless properties
      cssNumber: {
        animationIterationCount: !0,
        columnCount: !0,
        fillOpacity: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0
      },
      // Add in properties whose names you wish to fix before
      // setting or getting the value
      cssProps: {
        // normalize float css property
        float: h.cssFloat ? "cssFloat" : "styleFloat"
      },
      // Get and set the style property on a DOM Node
      style: function(i, s, f, d) {
        if (!(!i || i.nodeType === 3 || i.nodeType === 8 || !i.style)) {
          var C, A, L, R = a.camelCase(s), z = i.style;
          if (s = a.cssProps[R] || (a.cssProps[R] = Ta(R) || R), L = a.cssHooks[s] || a.cssHooks[R], f !== void 0) {
            if (A = typeof f, A === "string" && (C = ye.exec(f)) && C[1] && (f = dt(i, s, C), A = "number"), f == null || f !== f)
              return;
            if (A === "number" && (f += C && C[3] || (a.cssNumber[R] ? "" : "px")), !h.clearCloneStyle && f === "" && s.indexOf("background") === 0 && (z[s] = "inherit"), !L || !("set" in L) || (f = L.set(i, f, d)) !== void 0)
              try {
                z[s] = f;
              } catch {
              }
          } else
            return L && "get" in L && (C = L.get(i, !1, d)) !== void 0 ? C : z[s];
        }
      },
      css: function(i, s, f, d) {
        var C, A, L, R = a.camelCase(s);
        return s = a.cssProps[R] || (a.cssProps[R] = Ta(R) || R), L = a.cssHooks[s] || a.cssHooks[R], L && "get" in L && (A = L.get(i, !0, f)), A === void 0 && (A = or(i, s, d)), A === "normal" && s in gi && (A = gi[s]), f === "" || f ? (C = parseFloat(A), f === !0 || isFinite(C) ? C || 0 : A) : A;
      }
    }), a.each(["height", "width"], function(i, s) {
      a.cssHooks[s] = {
        get: function(f, d, C) {
          if (d)
            return su.test(a.css(f, "display")) && f.offsetWidth === 0 ? Co(f, uu, function() {
              return La(f, s, C);
            }) : La(f, s, C);
        },
        set: function(f, d, C) {
          var A = C && ir(f);
          return To(
            f,
            d,
            C ? Lo(
              f,
              s,
              C,
              h.boxSizing && a.css(f, "boxSizing", !1, A) === "border-box",
              A
            ) : 0
          );
        }
      };
    }), h.opacity || (a.cssHooks.opacity = {
      get: function(i, s) {
        return au.test((s && i.currentStyle ? i.currentStyle.filter : i.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : s ? "1" : "";
      },
      set: function(i, s) {
        var f = i.style, d = i.currentStyle, C = a.isNumeric(s) ? "alpha(opacity=" + s * 100 + ")" : "", A = d && d.filter || f.filter || "";
        f.zoom = 1, !((s >= 1 || s === "") && a.trim(A.replace(So, "")) === "" && f.removeAttribute && (f.removeAttribute("filter"), s === "" || d && !d.filter)) && (f.filter = So.test(A) ? A.replace(So, C) : A + " " + C);
      }
    }), a.cssHooks.marginRight = Ao(
      h.reliableMarginRight,
      function(i, s) {
        if (s)
          return Co(
            i,
            { display: "inline-block" },
            or,
            [i, "marginRight"]
          );
      }
    ), a.cssHooks.marginLeft = Ao(
      h.reliableMarginLeft,
      function(i, s) {
        if (s)
          return (parseFloat(or(i, "marginLeft")) || // Support: IE<=11+
          // Running getBoundingClientRect on a disconnected node in IE throws an error
          // Support: IE8 only
          // getClientRects() errors on disconnected elems
          (a.contains(i.ownerDocument, i) ? i.getBoundingClientRect().left - Co(i, { marginLeft: 0 }, function() {
            return i.getBoundingClientRect().left;
          }) : 0)) + "px";
      }
    ), a.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(i, s) {
      a.cssHooks[i + s] = {
        expand: function(f) {
          for (var d = 0, C = {}, A = typeof f == "string" ? f.split(" ") : [f]; d < 4; d++)
            C[i + Ot[d] + s] = A[d] || A[d - 2] || A[0];
          return C;
        }
      }, Ca.test(i) || (a.cssHooks[i + s].set = To);
    }), a.fn.extend({
      css: function(i, s) {
        return vt(this, function(f, d, C) {
          var A, L, R = {}, z = 0;
          if (a.isArray(d)) {
            for (A = ir(f), L = d.length; z < L; z++)
              R[d[z]] = a.css(f, d[z], !1, A);
            return R;
          }
          return C !== void 0 ? a.style(f, d, C) : a.css(f, d);
        }, i, s, arguments.length > 1);
      },
      show: function() {
        return Eo(this, !0);
      },
      hide: function() {
        return Eo(this);
      },
      toggle: function(i) {
        return typeof i == "boolean" ? i ? this.show() : this.hide() : this.each(function() {
          rt(this) ? a(this).show() : a(this).hide();
        });
      }
    });
    function en(i, s, f, d, C) {
      return new en.prototype.init(i, s, f, d, C);
    }
    a.Tween = en, en.prototype = {
      constructor: en,
      init: function(i, s, f, d, C, A) {
        this.elem = i, this.prop = f, this.easing = C || a.easing._default, this.options = s, this.start = this.now = this.cur(), this.end = d, this.unit = A || (a.cssNumber[f] ? "" : "px");
      },
      cur: function() {
        var i = en.propHooks[this.prop];
        return i && i.get ? i.get(this) : en.propHooks._default.get(this);
      },
      run: function(i) {
        var s, f = en.propHooks[this.prop];
        return this.options.duration ? this.pos = s = a.easing[this.easing](
          i,
          this.options.duration * i,
          0,
          1,
          this.options.duration
        ) : this.pos = s = i, this.now = (this.end - this.start) * s + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), f && f.set ? f.set(this) : en.propHooks._default.set(this), this;
      }
    }, en.prototype.init.prototype = en.prototype, en.propHooks = {
      _default: {
        get: function(i) {
          var s;
          return i.elem.nodeType !== 1 || i.elem[i.prop] != null && i.elem.style[i.prop] == null ? i.elem[i.prop] : (s = a.css(i.elem, i.prop, ""), !s || s === "auto" ? 0 : s);
        },
        set: function(i) {
          a.fx.step[i.prop] ? a.fx.step[i.prop](i) : i.elem.nodeType === 1 && (i.elem.style[a.cssProps[i.prop]] != null || a.cssHooks[i.prop]) ? a.style(i.elem, i.prop, i.now + i.unit) : i.elem[i.prop] = i.now;
        }
      }
    }, en.propHooks.scrollTop = en.propHooks.scrollLeft = {
      set: function(i) {
        i.elem.nodeType && i.elem.parentNode && (i.elem[i.prop] = i.now);
      }
    }, a.easing = {
      linear: function(i) {
        return i;
      },
      swing: function(i) {
        return 0.5 - Math.cos(i * Math.PI) / 2;
      },
      _default: "swing"
    }, a.fx = en.prototype.init, a.fx.step = {};
    var Vr, Hi, ka = /^(?:toggle|show|hide)$/, Pa = /queueHooks$/;
    function ko() {
      return o.setTimeout(function() {
        Vr = void 0;
      }), Vr = a.now();
    }
    function Xr(i, s) {
      var f, d = { height: i }, C = 0;
      for (s = s ? 1 : 0; C < 4; C += 2 - s)
        f = Ot[C], d["margin" + f] = d["padding" + f] = i;
      return s && (d.opacity = d.width = i), d;
    }
    function Na(i, s, f) {
      for (var d, C = (pn.tweeners[s] || []).concat(pn.tweeners["*"]), A = 0, L = C.length; A < L; A++)
        if (d = C[A].call(f, s, i))
          return d;
    }
    function Ma(i, s, f) {
      var d, C, A, L, R, z, H, X, ft = this, mt = {}, ct = i.style, Ut = i.nodeType && rt(i), qt = a._data(i, "fxshow");
      f.queue || (R = a._queueHooks(i, "fx"), R.unqueued == null && (R.unqueued = 0, z = R.empty.fire, R.empty.fire = function() {
        R.unqueued || z();
      }), R.unqueued++, ft.always(function() {
        ft.always(function() {
          R.unqueued--, a.queue(i, "fx").length || R.empty.fire();
        });
      })), i.nodeType === 1 && ("height" in s || "width" in s) && (f.overflow = [ct.overflow, ct.overflowX, ct.overflowY], H = a.css(i, "display"), X = H === "none" ? a._data(i, "olddisplay") || Fi(i.nodeName) : H, X === "inline" && a.css(i, "float") === "none" && (!h.inlineBlockNeedsLayout || Fi(i.nodeName) === "inline" ? ct.display = "inline-block" : ct.zoom = 1)), f.overflow && (ct.overflow = "hidden", h.shrinkWrapBlocks() || ft.always(function() {
        ct.overflow = f.overflow[0], ct.overflowX = f.overflow[1], ct.overflowY = f.overflow[2];
      }));
      for (d in s)
        if (C = s[d], ka.exec(C)) {
          if (delete s[d], A = A || C === "toggle", C === (Ut ? "hide" : "show"))
            if (C === "show" && qt && qt[d] !== void 0)
              Ut = !0;
            else
              continue;
          mt[d] = qt && qt[d] || a.style(i, d);
        } else
          H = void 0;
      if (a.isEmptyObject(mt))
        (H === "none" ? Fi(i.nodeName) : H) === "inline" && (ct.display = H);
      else {
        qt ? "hidden" in qt && (Ut = qt.hidden) : qt = a._data(i, "fxshow", {}), A && (qt.hidden = !Ut), Ut ? a(i).show() : ft.done(function() {
          a(i).hide();
        }), ft.done(function() {
          var Qt;
          a._removeData(i, "fxshow");
          for (Qt in mt)
            a.style(i, Qt, mt[Qt]);
        });
        for (d in mt)
          L = Na(Ut ? qt[d] : 0, d, ft), d in qt || (qt[d] = L.start, Ut && (L.end = L.start, L.start = d === "width" || d === "height" ? 1 : 0));
      }
    }
    function Wi(i, s) {
      var f, d, C, A, L;
      for (f in i)
        if (d = a.camelCase(f), C = s[d], A = i[f], a.isArray(A) && (C = A[1], A = i[f] = A[0]), f !== d && (i[d] = A, delete i[f]), L = a.cssHooks[d], L && "expand" in L) {
          A = L.expand(A), delete i[d];
          for (f in A)
            f in i || (i[f] = A[f], s[f] = C);
        } else
          s[d] = C;
    }
    function pn(i, s, f) {
      var d, C, A = 0, L = pn.prefilters.length, R = a.Deferred().always(function() {
        delete z.elem;
      }), z = function() {
        if (C)
          return !1;
        for (var ft = Vr || ko(), mt = Math.max(0, H.startTime + H.duration - ft), ct = mt / H.duration || 0, Ut = 1 - ct, qt = 0, Qt = H.tweens.length; qt < Qt; qt++)
          H.tweens[qt].run(Ut);
        return R.notifyWith(i, [H, Ut, mt]), Ut < 1 && Qt ? mt : (R.resolveWith(i, [H]), !1);
      }, H = R.promise({
        elem: i,
        props: a.extend({}, s),
        opts: a.extend(!0, {
          specialEasing: {},
          easing: a.easing._default
        }, f),
        originalProperties: s,
        originalOptions: f,
        startTime: Vr || ko(),
        duration: f.duration,
        tweens: [],
        createTween: function(ft, mt) {
          var ct = a.Tween(
            i,
            H.opts,
            ft,
            mt,
            H.opts.specialEasing[ft] || H.opts.easing
          );
          return H.tweens.push(ct), ct;
        },
        stop: function(ft) {
          var mt = 0, ct = ft ? H.tweens.length : 0;
          if (C)
            return this;
          for (C = !0; mt < ct; mt++)
            H.tweens[mt].run(1);
          return ft ? (R.notifyWith(i, [H, 1, 0]), R.resolveWith(i, [H, ft])) : R.rejectWith(i, [H, ft]), this;
        }
      }), X = H.props;
      for (Wi(X, H.opts.specialEasing); A < L; A++)
        if (d = pn.prefilters[A].call(H, i, X, H.opts), d)
          return a.isFunction(d.stop) && (a._queueHooks(H.elem, H.opts.queue).stop = a.proxy(d.stop, d)), d;
      return a.map(X, Na, H), a.isFunction(H.opts.start) && H.opts.start.call(i, H), a.fx.timer(
        a.extend(z, {
          elem: i,
          anim: H,
          queue: H.opts.queue
        })
      ), H.progress(H.opts.progress).done(H.opts.done, H.opts.complete).fail(H.opts.fail).always(H.opts.always);
    }
    a.Animation = a.extend(pn, {
      tweeners: {
        "*": [function(i, s) {
          var f = this.createTween(i, s);
          return dt(f.elem, i, ye.exec(s), f), f;
        }]
      },
      tweener: function(i, s) {
        a.isFunction(i) ? (s = i, i = ["*"]) : i = i.match(lt);
        for (var f, d = 0, C = i.length; d < C; d++)
          f = i[d], pn.tweeners[f] = pn.tweeners[f] || [], pn.tweeners[f].unshift(s);
      },
      prefilters: [Ma],
      prefilter: function(i, s) {
        s ? pn.prefilters.unshift(i) : pn.prefilters.push(i);
      }
    }), a.speed = function(i, s, f) {
      var d = i && typeof i == "object" ? a.extend({}, i) : {
        complete: f || !f && s || a.isFunction(i) && i,
        duration: i,
        easing: f && s || s && !a.isFunction(s) && s
      };
      return d.duration = a.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in a.fx.speeds ? a.fx.speeds[d.duration] : a.fx.speeds._default, (d.queue == null || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
        a.isFunction(d.old) && d.old.call(this), d.queue && a.dequeue(this, d.queue);
      }, d;
    }, a.fn.extend({
      fadeTo: function(i, s, f, d) {
        return this.filter(rt).css("opacity", 0).show().end().animate({ opacity: s }, i, f, d);
      },
      animate: function(i, s, f, d) {
        var C = a.isEmptyObject(i), A = a.speed(s, f, d), L = function() {
          var R = pn(this, a.extend({}, i), A);
          (C || a._data(this, "finish")) && R.stop(!0);
        };
        return L.finish = L, C || A.queue === !1 ? this.each(L) : this.queue(A.queue, L);
      },
      stop: function(i, s, f) {
        var d = function(C) {
          var A = C.stop;
          delete C.stop, A(f);
        };
        return typeof i != "string" && (f = s, s = i, i = void 0), s && i !== !1 && this.queue(i || "fx", []), this.each(function() {
          var C = !0, A = i != null && i + "queueHooks", L = a.timers, R = a._data(this);
          if (A)
            R[A] && R[A].stop && d(R[A]);
          else
            for (A in R)
              R[A] && R[A].stop && Pa.test(A) && d(R[A]);
          for (A = L.length; A--; )
            L[A].elem === this && (i == null || L[A].queue === i) && (L[A].anim.stop(f), C = !1, L.splice(A, 1));
          (C || !f) && a.dequeue(this, i);
        });
      },
      finish: function(i) {
        return i !== !1 && (i = i || "fx"), this.each(function() {
          var s, f = a._data(this), d = f[i + "queue"], C = f[i + "queueHooks"], A = a.timers, L = d ? d.length : 0;
          for (f.finish = !0, a.queue(this, i, []), C && C.stop && C.stop.call(this, !0), s = A.length; s--; )
            A[s].elem === this && A[s].queue === i && (A[s].anim.stop(!0), A.splice(s, 1));
          for (s = 0; s < L; s++)
            d[s] && d[s].finish && d[s].finish.call(this);
          delete f.finish;
        });
      }
    }), a.each(["toggle", "show", "hide"], function(i, s) {
      var f = a.fn[s];
      a.fn[s] = function(d, C, A) {
        return d == null || typeof d == "boolean" ? f.apply(this, arguments) : this.animate(Xr(s, !0), d, C, A);
      };
    }), a.each({
      slideDown: Xr("show"),
      slideUp: Xr("hide"),
      slideToggle: Xr("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(i, s) {
      a.fn[i] = function(f, d, C) {
        return this.animate(s, f, d, C);
      };
    }), a.timers = [], a.fx.tick = function() {
      var i, s = a.timers, f = 0;
      for (Vr = a.now(); f < s.length; f++)
        i = s[f], !i() && s[f] === i && s.splice(f--, 1);
      s.length || a.fx.stop(), Vr = void 0;
    }, a.fx.timer = function(i) {
      a.timers.push(i), i() ? a.fx.start() : a.timers.pop();
    }, a.fx.interval = 13, a.fx.start = function() {
      Hi || (Hi = o.setInterval(a.fx.tick, a.fx.interval));
    }, a.fx.stop = function() {
      o.clearInterval(Hi), Hi = null;
    }, a.fx.speeds = {
      slow: 600,
      fast: 200,
      // Default speed
      _default: 400
    }, a.fn.delay = function(i, s) {
      return i = a.fx && a.fx.speeds[i] || i, s = s || "fx", this.queue(s, function(f, d) {
        var C = o.setTimeout(f, i);
        d.stop = function() {
          o.clearTimeout(C);
        };
      });
    }, function() {
      var i, s = c.createElement("input"), f = c.createElement("div"), d = c.createElement("select"), C = d.appendChild(c.createElement("option"));
      f = c.createElement("div"), f.setAttribute("className", "t"), f.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", i = f.getElementsByTagName("a")[0], s.setAttribute("type", "checkbox"), f.appendChild(s), i = f.getElementsByTagName("a")[0], i.style.cssText = "top:1px", h.getSetAttribute = f.className !== "t", h.style = /top/.test(i.getAttribute("style")), h.hrefNormalized = i.getAttribute("href") === "/a", h.checkOn = !!s.value, h.optSelected = C.selected, h.enctype = !!c.createElement("form").enctype, d.disabled = !0, h.optDisabled = !C.disabled, s = c.createElement("input"), s.setAttribute("value", ""), h.input = s.getAttribute("value") === "", s.value = "t", s.setAttribute("type", "radio"), h.radioValue = s.value === "t";
    }();
    var lu = /\r/g, Da = /[\x20\t\r\n\f]+/g;
    a.fn.extend({
      val: function(i) {
        var s, f, d, C = this[0];
        return arguments.length ? (d = a.isFunction(i), this.each(function(A) {
          var L;
          this.nodeType === 1 && (d ? L = i.call(this, A, a(this).val()) : L = i, L == null ? L = "" : typeof L == "number" ? L += "" : a.isArray(L) && (L = a.map(L, function(R) {
            return R == null ? "" : R + "";
          })), s = a.valHooks[this.type] || a.valHooks[this.nodeName.toLowerCase()], (!s || !("set" in s) || s.set(this, L, "value") === void 0) && (this.value = L));
        })) : C ? (s = a.valHooks[C.type] || a.valHooks[C.nodeName.toLowerCase()], s && "get" in s && (f = s.get(C, "value")) !== void 0 ? f : (f = C.value, typeof f == "string" ? (
          // handle most common string cases
          f.replace(lu, "")
        ) : (
          // handle cases where value is null/undef or number
          f ?? ""
        ))) : void 0;
      }
    }), a.extend({
      valHooks: {
        option: {
          get: function(i) {
            var s = a.find.attr(i, "value");
            return s ?? // Support: IE10-11+
            // option.text throws exceptions (#14686, #14858)
            // Strip and collapse whitespace
            // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
            a.trim(a.text(i)).replace(Da, " ");
          }
        },
        select: {
          get: function(i) {
            for (var s, f, d = i.options, C = i.selectedIndex, A = i.type === "select-one" || C < 0, L = A ? null : [], R = A ? C + 1 : d.length, z = C < 0 ? R : A ? C : 0; z < R; z++)
              if (f = d[z], (f.selected || z === C) && // Don't return options that are disabled or in a disabled optgroup
              (h.optDisabled ? !f.disabled : f.getAttribute("disabled") === null) && (!f.parentNode.disabled || !a.nodeName(f.parentNode, "optgroup"))) {
                if (s = a(f).val(), A)
                  return s;
                L.push(s);
              }
            return L;
          },
          set: function(i, s) {
            for (var f, d, C = i.options, A = a.makeArray(s), L = C.length; L--; )
              if (d = C[L], a.inArray(a.valHooks.option.get(d), A) > -1)
                try {
                  d.selected = f = !0;
                } catch {
                  d.scrollHeight;
                }
              else
                d.selected = !1;
            return f || (i.selectedIndex = -1), C;
          }
        }
      }
    }), a.each(["radio", "checkbox"], function() {
      a.valHooks[this] = {
        set: function(i, s) {
          if (a.isArray(s))
            return i.checked = a.inArray(a(i).val(), s) > -1;
        }
      }, h.checkOn || (a.valHooks[this].get = function(i) {
        return i.getAttribute("value") === null ? "on" : i.value;
      });
    });
    var Cr, $i, $n = a.expr.attrHandle, Gi = /^(?:checked|selected)$/i, Gn = h.getSetAttribute, jr = h.input;
    a.fn.extend({
      attr: function(i, s) {
        return vt(this, a.attr, i, s, arguments.length > 1);
      },
      removeAttr: function(i) {
        return this.each(function() {
          a.removeAttr(this, i);
        });
      }
    }), a.extend({
      attr: function(i, s, f) {
        var d, C, A = i.nodeType;
        if (!(A === 3 || A === 8 || A === 2)) {
          if (typeof i.getAttribute > "u")
            return a.prop(i, s, f);
          if ((A !== 1 || !a.isXMLDoc(i)) && (s = s.toLowerCase(), C = a.attrHooks[s] || (a.expr.match.bool.test(s) ? $i : Cr)), f !== void 0) {
            if (f === null) {
              a.removeAttr(i, s);
              return;
            }
            return C && "set" in C && (d = C.set(i, f, s)) !== void 0 ? d : (i.setAttribute(s, f + ""), f);
          }
          return C && "get" in C && (d = C.get(i, s)) !== null ? d : (d = a.find.attr(i, s), d ?? void 0);
        }
      },
      attrHooks: {
        type: {
          set: function(i, s) {
            if (!h.radioValue && s === "radio" && a.nodeName(i, "input")) {
              var f = i.value;
              return i.setAttribute("type", s), f && (i.value = f), s;
            }
          }
        }
      },
      removeAttr: function(i, s) {
        var f, d, C = 0, A = s && s.match(lt);
        if (A && i.nodeType === 1)
          for (; f = A[C++]; )
            d = a.propFix[f] || f, a.expr.match.bool.test(f) ? jr && Gn || !Gi.test(f) ? i[d] = !1 : i[a.camelCase("default-" + f)] = i[d] = !1 : a.attr(i, f, ""), i.removeAttribute(Gn ? f : d);
      }
    }), $i = {
      set: function(i, s, f) {
        return s === !1 ? a.removeAttr(i, f) : jr && Gn || !Gi.test(f) ? i.setAttribute(!Gn && a.propFix[f] || f, f) : i[a.camelCase("default-" + f)] = i[f] = !0, f;
      }
    }, a.each(a.expr.match.bool.source.match(/\w+/g), function(i, s) {
      var f = $n[s] || a.find.attr;
      jr && Gn || !Gi.test(s) ? $n[s] = function(d, C, A) {
        var L, R;
        return A || (R = $n[C], $n[C] = L, L = f(d, C, A) != null ? C.toLowerCase() : null, $n[C] = R), L;
      } : $n[s] = function(d, C, A) {
        if (!A)
          return d[a.camelCase("default-" + C)] ? C.toLowerCase() : null;
      };
    }), (!jr || !Gn) && (a.attrHooks.value = {
      set: function(i, s, f) {
        if (a.nodeName(i, "input"))
          i.defaultValue = s;
        else
          return Cr && Cr.set(i, s, f);
      }
    }), Gn || (Cr = {
      set: function(i, s, f) {
        var d = i.getAttributeNode(f);
        if (d || i.setAttributeNode(
          d = i.ownerDocument.createAttribute(f)
        ), d.value = s += "", f === "value" || s === i.getAttribute(f))
          return s;
      }
    }, $n.id = $n.name = $n.coords = function(i, s, f) {
      var d;
      if (!f)
        return (d = i.getAttributeNode(s)) && d.value !== "" ? d.value : null;
    }, a.valHooks.button = {
      get: function(i, s) {
        var f = i.getAttributeNode(s);
        if (f && f.specified)
          return f.value;
      },
      set: Cr.set
    }, a.attrHooks.contenteditable = {
      set: function(i, s, f) {
        Cr.set(i, s === "" ? !1 : s, f);
      }
    }, a.each(["width", "height"], function(i, s) {
      a.attrHooks[s] = {
        set: function(f, d) {
          if (d === "")
            return f.setAttribute(s, "auto"), d;
        }
      };
    })), h.style || (a.attrHooks.style = {
      get: function(i) {
        return i.style.cssText || void 0;
      },
      set: function(i, s) {
        return i.style.cssText = s + "";
      }
    });
    var Yr = /^(?:input|select|textarea|button|object)$/i, Oa = /^(?:a|area)$/i;
    a.fn.extend({
      prop: function(i, s) {
        return vt(this, a.prop, i, s, arguments.length > 1);
      },
      removeProp: function(i) {
        return i = a.propFix[i] || i, this.each(function() {
          try {
            this[i] = void 0, delete this[i];
          } catch {
          }
        });
      }
    }), a.extend({
      prop: function(i, s, f) {
        var d, C, A = i.nodeType;
        if (!(A === 3 || A === 8 || A === 2))
          return (A !== 1 || !a.isXMLDoc(i)) && (s = a.propFix[s] || s, C = a.propHooks[s]), f !== void 0 ? C && "set" in C && (d = C.set(i, f, s)) !== void 0 ? d : i[s] = f : C && "get" in C && (d = C.get(i, s)) !== null ? d : i[s];
      },
      propHooks: {
        tabIndex: {
          get: function(i) {
            var s = a.find.attr(i, "tabindex");
            return s ? parseInt(s, 10) : Yr.test(i.nodeName) || Oa.test(i.nodeName) && i.href ? 0 : -1;
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), h.hrefNormalized || a.each(["href", "src"], function(i, s) {
      a.propHooks[s] = {
        get: function(f) {
          return f.getAttribute(s, 4);
        }
      };
    }), h.optSelected || (a.propHooks.selected = {
      get: function(i) {
        var s = i.parentNode;
        return s && (s.selectedIndex, s.parentNode && s.parentNode.selectedIndex), null;
      },
      set: function(i) {
        var s = i.parentNode;
        s && (s.selectedIndex, s.parentNode && s.parentNode.selectedIndex);
      }
    }), a.each([
      "tabIndex",
      "readOnly",
      "maxLength",
      "cellSpacing",
      "cellPadding",
      "rowSpan",
      "colSpan",
      "useMap",
      "frameBorder",
      "contentEditable"
    ], function() {
      a.propFix[this.toLowerCase()] = this;
    }), h.enctype || (a.propFix.enctype = "encoding");
    var Ui = /[\t\r\n\f]/g;
    function Ar(i) {
      return a.attr(i, "class") || "";
    }
    a.fn.extend({
      addClass: function(i) {
        var s, f, d, C, A, L, R, z = 0;
        if (a.isFunction(i))
          return this.each(function(H) {
            a(this).addClass(i.call(this, H, Ar(this)));
          });
        if (typeof i == "string" && i) {
          for (s = i.match(lt) || []; f = this[z++]; )
            if (C = Ar(f), d = f.nodeType === 1 && (" " + C + " ").replace(Ui, " "), d) {
              for (L = 0; A = s[L++]; )
                d.indexOf(" " + A + " ") < 0 && (d += A + " ");
              R = a.trim(d), C !== R && a.attr(f, "class", R);
            }
        }
        return this;
      },
      removeClass: function(i) {
        var s, f, d, C, A, L, R, z = 0;
        if (a.isFunction(i))
          return this.each(function(H) {
            a(this).removeClass(i.call(this, H, Ar(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof i == "string" && i) {
          for (s = i.match(lt) || []; f = this[z++]; )
            if (C = Ar(f), d = f.nodeType === 1 && (" " + C + " ").replace(Ui, " "), d) {
              for (L = 0; A = s[L++]; )
                for (; d.indexOf(" " + A + " ") > -1; )
                  d = d.replace(" " + A + " ", " ");
              R = a.trim(d), C !== R && a.attr(f, "class", R);
            }
        }
        return this;
      },
      toggleClass: function(i, s) {
        var f = typeof i;
        return typeof s == "boolean" && f === "string" ? s ? this.addClass(i) : this.removeClass(i) : a.isFunction(i) ? this.each(function(d) {
          a(this).toggleClass(
            i.call(this, d, Ar(this), s),
            s
          );
        }) : this.each(function() {
          var d, C, A, L;
          if (f === "string")
            for (C = 0, A = a(this), L = i.match(lt) || []; d = L[C++]; )
              A.hasClass(d) ? A.removeClass(d) : A.addClass(d);
          else (i === void 0 || f === "boolean") && (d = Ar(this), d && a._data(this, "__className__", d), a.attr(
            this,
            "class",
            d || i === !1 ? "" : a._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(i) {
        var s, f, d = 0;
        for (s = " " + i + " "; f = this[d++]; )
          if (f.nodeType === 1 && (" " + Ar(f) + " ").replace(Ui, " ").indexOf(s) > -1)
            return !0;
        return !1;
      }
    }), a.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
      function(i, s) {
        a.fn[s] = function(f, d) {
          return arguments.length > 0 ? this.on(s, null, f, d) : this.trigger(s);
        };
      }
    ), a.fn.extend({
      hover: function(i, s) {
        return this.mouseenter(i).mouseleave(s || i);
      }
    });
    var Ra = o.location, Vi = a.now(), Xi = /\?/, Ia = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    a.parseJSON = function(i) {
      if (o.JSON && o.JSON.parse)
        return o.JSON.parse(i + "");
      var s, f = null, d = a.trim(i + "");
      return d && !a.trim(d.replace(Ia, function(C, A, L, R) {
        return s && A && (f = 0), f === 0 ? C : (s = L || A, f += !R - !L, "");
      })) ? Function("return " + d)() : a.error("Invalid JSON: " + i);
    }, a.parseXML = function(i) {
      var s, f;
      if (!i || typeof i != "string")
        return null;
      try {
        o.DOMParser ? (f = new o.DOMParser(), s = f.parseFromString(i, "text/xml")) : (s = new o.ActiveXObject("Microsoft.XMLDOM"), s.async = "false", s.loadXML(i));
      } catch {
        s = void 0;
      }
      return (!s || !s.documentElement || s.getElementsByTagName("parsererror").length) && a.error("Invalid XML: " + i), s;
    };
    var fu = /#.*$/, Ba = /([?&])_=[^&]*/, cu = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, Fa = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, hu = /^(?:GET|HEAD)$/, du = /^\/\//, za = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, qa = {}, vi = {}, Ha = "*/".concat("*"), Po = Ra.href, Qr = za.exec(Po.toLowerCase()) || [];
    function Wa(i) {
      return function(s, f) {
        typeof s != "string" && (f = s, s = "*");
        var d, C = 0, A = s.toLowerCase().match(lt) || [];
        if (a.isFunction(f))
          for (; d = A[C++]; )
            d.charAt(0) === "+" ? (d = d.slice(1) || "*", (i[d] = i[d] || []).unshift(f)) : (i[d] = i[d] || []).push(f);
      };
    }
    function $a(i, s, f, d) {
      var C = {}, A = i === vi;
      function L(R) {
        var z;
        return C[R] = !0, a.each(i[R] || [], function(H, X) {
          var ft = X(s, f, d);
          if (typeof ft == "string" && !A && !C[ft])
            return s.dataTypes.unshift(ft), L(ft), !1;
          if (A)
            return !(z = ft);
        }), z;
      }
      return L(s.dataTypes[0]) || !C["*"] && L("*");
    }
    function Se(i, s) {
      var f, d, C = a.ajaxSettings.flatOptions || {};
      for (d in s)
        s[d] !== void 0 && ((C[d] ? i : f || (f = {}))[d] = s[d]);
      return f && a.extend(!0, i, f), i;
    }
    function Ee(i, s, f) {
      for (var d, C, A, L, R = i.contents, z = i.dataTypes; z[0] === "*"; )
        z.shift(), C === void 0 && (C = i.mimeType || s.getResponseHeader("Content-Type"));
      if (C) {
        for (L in R)
          if (R[L] && R[L].test(C)) {
            z.unshift(L);
            break;
          }
      }
      if (z[0] in f)
        A = z[0];
      else {
        for (L in f) {
          if (!z[0] || i.converters[L + " " + z[0]]) {
            A = L;
            break;
          }
          d || (d = L);
        }
        A = A || d;
      }
      if (A)
        return A !== z[0] && z.unshift(A), f[A];
    }
    function pu(i, s, f, d) {
      var C, A, L, R, z, H = {}, X = i.dataTypes.slice();
      if (X[1])
        for (L in i.converters)
          H[L.toLowerCase()] = i.converters[L];
      for (A = X.shift(); A; )
        if (i.responseFields[A] && (f[i.responseFields[A]] = s), !z && d && i.dataFilter && (s = i.dataFilter(s, i.dataType)), z = A, A = X.shift(), A) {
          if (A === "*")
            A = z;
          else if (z !== "*" && z !== A) {
            if (L = H[z + " " + A] || H["* " + A], !L) {
              for (C in H)
                if (R = C.split(" "), R[1] === A && (L = H[z + " " + R[0]] || H["* " + R[0]], L)) {
                  L === !0 ? L = H[C] : H[C] !== !0 && (A = R[0], X.unshift(R[1]));
                  break;
                }
            }
            if (L !== !0)
              if (L && i.throws)
                s = L(s);
              else
                try {
                  s = L(s);
                } catch (ft) {
                  return {
                    state: "parsererror",
                    error: L ? ft : "No conversion from " + z + " to " + A
                  };
                }
          }
        }
      return { state: "success", data: s };
    }
    a.extend({
      // Counter for holding the number of active queries
      active: 0,
      // Last-Modified header cache for next request
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: Po,
        type: "GET",
        isLocal: Fa.test(Qr[1]),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        /*
        timeout: 0,
        data: null,
        dataType: null,
        username: null,
        password: null,
        cache: null,
        throws: false,
        traditional: false,
        headers: {},
        */
        accepts: {
          "*": Ha,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript"
        },
        contents: {
          xml: /\bxml\b/,
          html: /\bhtml/,
          json: /\bjson\b/
        },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON"
        },
        // Data converters
        // Keys separate source (or catchall "*") and destination types with a single space
        converters: {
          // Convert anything to text
          "* text": String,
          // Text to html (true = no transformation)
          "text html": !0,
          // Evaluate text as a json expression
          "text json": a.parseJSON,
          // Parse text as xml
          "text xml": a.parseXML
        },
        // For options that shouldn't be deep extended:
        // you can add your own custom options here if
        // and when you create one that shouldn't be
        // deep extended (see ajaxExtend)
        flatOptions: {
          url: !0,
          context: !0
        }
      },
      // Creates a full fledged settings object into target
      // with both ajaxSettings and settings fields.
      // If target is omitted, writes into ajaxSettings.
      ajaxSetup: function(i, s) {
        return s ? (
          // Building a settings object
          Se(Se(i, a.ajaxSettings), s)
        ) : (
          // Extending ajaxSettings
          Se(a.ajaxSettings, i)
        );
      },
      ajaxPrefilter: Wa(qa),
      ajaxTransport: Wa(vi),
      // Main method
      ajax: function(i, s) {
        typeof i == "object" && (s = i, i = void 0), s = s || {};
        var f, d, C, A, L, R, z, H, X = a.ajaxSetup({}, s), ft = X.context || X, mt = X.context && (ft.nodeType || ft.jquery) ? a(ft) : a.event, ct = a.Deferred(), Ut = a.Callbacks("once memory"), qt = X.statusCode || {}, Qt = {}, Xe = {}, De = 0, ar = "canceled", Tt = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(Kt) {
            var Ne;
            if (De === 2) {
              if (!H)
                for (H = {}; Ne = cu.exec(A); )
                  H[Ne[1].toLowerCase()] = Ne[2];
              Ne = H[Kt.toLowerCase()];
            }
            return Ne ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return De === 2 ? A : null;
          },
          // Caches the header
          setRequestHeader: function(Kt, Ne) {
            var Un = Kt.toLowerCase();
            return De || (Kt = Xe[Un] = Xe[Un] || Kt, Qt[Kt] = Ne), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(Kt) {
            return De || (X.mimeType = Kt), this;
          },
          // Status-dependent callbacks
          statusCode: function(Kt) {
            var Ne;
            if (Kt)
              if (De < 2)
                for (Ne in Kt)
                  qt[Ne] = [qt[Ne], Kt[Ne]];
              else
                Tt.always(Kt[Tt.status]);
            return this;
          },
          // Cancel the request
          abort: function(Kt) {
            var Ne = Kt || ar;
            return z && z.abort(Ne), Ge(0, Ne), this;
          }
        };
        if (ct.promise(Tt).complete = Ut.add, Tt.success = Tt.done, Tt.error = Tt.fail, X.url = ((i || X.url || Po) + "").replace(fu, "").replace(du, Qr[1] + "//"), X.type = s.method || s.type || X.method || X.type, X.dataTypes = a.trim(X.dataType || "*").toLowerCase().match(lt) || [""], X.crossDomain == null && (f = za.exec(X.url.toLowerCase()), X.crossDomain = !!(f && (f[1] !== Qr[1] || f[2] !== Qr[2] || (f[3] || (f[1] === "http:" ? "80" : "443")) !== (Qr[3] || (Qr[1] === "http:" ? "80" : "443"))))), X.data && X.processData && typeof X.data != "string" && (X.data = a.param(X.data, X.traditional)), $a(qa, X, s, Tt), De === 2)
          return Tt;
        R = a.event && X.global, R && a.active++ === 0 && a.event.trigger("ajaxStart"), X.type = X.type.toUpperCase(), X.hasContent = !hu.test(X.type), C = X.url, X.hasContent || (X.data && (C = X.url += (Xi.test(C) ? "&" : "?") + X.data, delete X.data), X.cache === !1 && (X.url = Ba.test(C) ? (
          // If there is already a '_' parameter, set its value
          C.replace(Ba, "$1_=" + Vi++)
        ) : (
          // Otherwise add one to the end
          C + (Xi.test(C) ? "&" : "?") + "_=" + Vi++
        ))), X.ifModified && (a.lastModified[C] && Tt.setRequestHeader("If-Modified-Since", a.lastModified[C]), a.etag[C] && Tt.setRequestHeader("If-None-Match", a.etag[C])), (X.data && X.hasContent && X.contentType !== !1 || s.contentType) && Tt.setRequestHeader("Content-Type", X.contentType), Tt.setRequestHeader(
          "Accept",
          X.dataTypes[0] && X.accepts[X.dataTypes[0]] ? X.accepts[X.dataTypes[0]] + (X.dataTypes[0] !== "*" ? ", " + Ha + "; q=0.01" : "") : X.accepts["*"]
        );
        for (d in X.headers)
          Tt.setRequestHeader(d, X.headers[d]);
        if (X.beforeSend && (X.beforeSend.call(ft, Tt, X) === !1 || De === 2))
          return Tt.abort();
        ar = "abort";
        for (d in { success: 1, error: 1, complete: 1 })
          Tt[d](X[d]);
        if (z = $a(vi, X, s, Tt), !z)
          Ge(-1, "No Transport");
        else {
          if (Tt.readyState = 1, R && mt.trigger("ajaxSend", [Tt, X]), De === 2)
            return Tt;
          X.async && X.timeout > 0 && (L = o.setTimeout(function() {
            Tt.abort("timeout");
          }, X.timeout));
          try {
            De = 1, z.send(Qt, Ge);
          } catch (Kt) {
            if (De < 2)
              Ge(-1, Kt);
            else
              throw Kt;
          }
        }
        function Ge(Kt, Ne, Un, Yi) {
          var nn, Vn, sr, Xn, Te, rn = Ne;
          De !== 2 && (De = 2, L && o.clearTimeout(L), z = void 0, A = Yi || "", Tt.readyState = Kt > 0 ? 4 : 0, nn = Kt >= 200 && Kt < 300 || Kt === 304, Un && (Xn = Ee(X, Tt, Un)), Xn = pu(X, Xn, Tt, nn), nn ? (X.ifModified && (Te = Tt.getResponseHeader("Last-Modified"), Te && (a.lastModified[C] = Te), Te = Tt.getResponseHeader("etag"), Te && (a.etag[C] = Te)), Kt === 204 || X.type === "HEAD" ? rn = "nocontent" : Kt === 304 ? rn = "notmodified" : (rn = Xn.state, Vn = Xn.data, sr = Xn.error, nn = !sr)) : (sr = rn, (Kt || !rn) && (rn = "error", Kt < 0 && (Kt = 0))), Tt.status = Kt, Tt.statusText = (Ne || rn) + "", nn ? ct.resolveWith(ft, [Vn, rn, Tt]) : ct.rejectWith(ft, [Tt, rn, sr]), Tt.statusCode(qt), qt = void 0, R && mt.trigger(
            nn ? "ajaxSuccess" : "ajaxError",
            [Tt, X, nn ? Vn : sr]
          ), Ut.fireWith(ft, [Tt, rn]), R && (mt.trigger("ajaxComplete", [Tt, X]), --a.active || a.event.trigger("ajaxStop")));
        }
        return Tt;
      },
      getJSON: function(i, s, f) {
        return a.get(i, s, f, "json");
      },
      getScript: function(i, s) {
        return a.get(i, void 0, s, "script");
      }
    }), a.each(["get", "post"], function(i, s) {
      a[s] = function(f, d, C, A) {
        return a.isFunction(d) && (A = A || C, C = d, d = void 0), a.ajax(a.extend({
          url: f,
          type: s,
          dataType: A,
          data: d,
          success: C
        }, a.isPlainObject(f) && f));
      };
    }), a._evalUrl = function(i) {
      return a.ajax({
        url: i,
        // Make this explicit, since user can override this through ajaxSetup (#11264)
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        throws: !0
      });
    }, a.fn.extend({
      wrapAll: function(i) {
        if (a.isFunction(i))
          return this.each(function(f) {
            a(this).wrapAll(i.call(this, f));
          });
        if (this[0]) {
          var s = a(i, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && s.insertBefore(this[0]), s.map(function() {
            for (var f = this; f.firstChild && f.firstChild.nodeType === 1; )
              f = f.firstChild;
            return f;
          }).append(this);
        }
        return this;
      },
      wrapInner: function(i) {
        return a.isFunction(i) ? this.each(function(s) {
          a(this).wrapInner(i.call(this, s));
        }) : this.each(function() {
          var s = a(this), f = s.contents();
          f.length ? f.wrapAll(i) : s.append(i);
        });
      },
      wrap: function(i) {
        var s = a.isFunction(i);
        return this.each(function(f) {
          a(this).wrapAll(s ? i.call(this, f) : i);
        });
      },
      unwrap: function() {
        return this.parent().each(function() {
          a.nodeName(this, "body") || a(this).replaceWith(this.childNodes);
        }).end();
      }
    });
    function gu(i) {
      return i.style && i.style.display || a.css(i, "display");
    }
    function vu(i) {
      if (!a.contains(i.ownerDocument || c, i))
        return !0;
      for (; i && i.nodeType === 1; ) {
        if (gu(i) === "none" || i.type === "hidden")
          return !0;
        i = i.parentNode;
      }
      return !1;
    }
    a.expr.filters.hidden = function(i) {
      return h.reliableHiddenOffsets() ? i.offsetWidth <= 0 && i.offsetHeight <= 0 && !i.getClientRects().length : vu(i);
    }, a.expr.filters.visible = function(i) {
      return !a.expr.filters.hidden(i);
    };
    var mu = /%20/g, yu = /\[\]$/, Ga = /\r?\n/g, Ua = /^(?:submit|button|image|reset|file)$/i, bu = /^(?:input|select|textarea|keygen)/i;
    function Fe(i, s, f, d) {
      var C;
      if (a.isArray(s))
        a.each(s, function(A, L) {
          f || yu.test(i) ? d(i, L) : Fe(
            i + "[" + (typeof L == "object" && L != null ? A : "") + "]",
            L,
            f,
            d
          );
        });
      else if (!f && a.type(s) === "object")
        for (C in s)
          Fe(i + "[" + C + "]", s[C], f, d);
      else
        d(i, s);
    }
    a.param = function(i, s) {
      var f, d = [], C = function(A, L) {
        L = a.isFunction(L) ? L() : L ?? "", d[d.length] = encodeURIComponent(A) + "=" + encodeURIComponent(L);
      };
      if (s === void 0 && (s = a.ajaxSettings && a.ajaxSettings.traditional), a.isArray(i) || i.jquery && !a.isPlainObject(i))
        a.each(i, function() {
          C(this.name, this.value);
        });
      else
        for (f in i)
          Fe(f, i[f], s, C);
      return d.join("&").replace(mu, "+");
    }, a.fn.extend({
      serialize: function() {
        return a.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var i = a.prop(this, "elements");
          return i ? a.makeArray(i) : this;
        }).filter(function() {
          var i = this.type;
          return this.name && !a(this).is(":disabled") && bu.test(this.nodeName) && !Ua.test(i) && (this.checked || !Jt.test(i));
        }).map(function(i, s) {
          var f = a(this).val();
          return f == null ? null : a.isArray(f) ? a.map(f, function(d) {
            return { name: s.name, value: d.replace(Ga, `\r
`) };
          }) : { name: s.name, value: f.replace(Ga, `\r
`) };
        }).get();
      }
    }), a.ajaxSettings.xhr = o.ActiveXObject !== void 0 ? (
      // Support: IE6-IE8
      function() {
        return this.isLocal ? sn() : c.documentMode > 8 ? mi() : /^(get|post|head|put|delete|options)$/i.test(this.type) && mi() || sn();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      mi
    );
    var No = 0, Nn = {}, Kr = a.ajaxSettings.xhr();
    o.attachEvent && o.attachEvent("onunload", function() {
      for (var i in Nn)
        Nn[i](void 0, !0);
    }), h.cors = !!Kr && "withCredentials" in Kr, Kr = h.ajax = !!Kr, Kr && a.ajaxTransport(function(i) {
      if (!i.crossDomain || h.cors) {
        var s;
        return {
          send: function(f, d) {
            var C, A = i.xhr(), L = ++No;
            if (A.open(
              i.type,
              i.url,
              i.async,
              i.username,
              i.password
            ), i.xhrFields)
              for (C in i.xhrFields)
                A[C] = i.xhrFields[C];
            i.mimeType && A.overrideMimeType && A.overrideMimeType(i.mimeType), !i.crossDomain && !f["X-Requested-With"] && (f["X-Requested-With"] = "XMLHttpRequest");
            for (C in f)
              f[C] !== void 0 && A.setRequestHeader(C, f[C] + "");
            A.send(i.hasContent && i.data || null), s = function(R, z) {
              var H, X, ft;
              if (s && (z || A.readyState === 4))
                if (delete Nn[L], s = void 0, A.onreadystatechange = a.noop, z)
                  A.readyState !== 4 && A.abort();
                else {
                  ft = {}, H = A.status, typeof A.responseText == "string" && (ft.text = A.responseText);
                  try {
                    X = A.statusText;
                  } catch {
                    X = "";
                  }
                  !H && i.isLocal && !i.crossDomain ? H = ft.text ? 200 : 404 : H === 1223 && (H = 204);
                }
              ft && d(H, X, ft, A.getAllResponseHeaders());
            }, i.async ? A.readyState === 4 ? o.setTimeout(s) : A.onreadystatechange = Nn[L] = s : s();
          },
          abort: function() {
            s && s(void 0, !0);
          }
        };
      }
    });
    function mi() {
      try {
        return new o.XMLHttpRequest();
      } catch {
      }
    }
    function sn() {
      try {
        return new o.ActiveXObject("Microsoft.XMLHTTP");
      } catch {
      }
    }
    a.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function(i) {
          return a.globalEval(i), i;
        }
      }
    }), a.ajaxPrefilter("script", function(i) {
      i.cache === void 0 && (i.cache = !1), i.crossDomain && (i.type = "GET", i.global = !1);
    }), a.ajaxTransport("script", function(i) {
      if (i.crossDomain) {
        var s, f = c.head || a("head")[0] || c.documentElement;
        return {
          send: function(d, C) {
            s = c.createElement("script"), s.async = !0, i.scriptCharset && (s.charset = i.scriptCharset), s.src = i.url, s.onload = s.onreadystatechange = function(A, L) {
              (L || !s.readyState || /loaded|complete/.test(s.readyState)) && (s.onload = s.onreadystatechange = null, s.parentNode && s.parentNode.removeChild(s), s = null, L || C(200, "success"));
            }, f.insertBefore(s, f.firstChild);
          },
          abort: function() {
            s && s.onload(void 0, !0);
          }
        };
      }
    });
    var Mo = [], ji = /(=)\?(?=&|$)|\?\?/;
    a.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var i = Mo.pop() || a.expando + "_" + Vi++;
        return this[i] = !0, i;
      }
    }), a.ajaxPrefilter("json jsonp", function(i, s, f) {
      var d, C, A, L = i.jsonp !== !1 && (ji.test(i.url) ? "url" : typeof i.data == "string" && (i.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && ji.test(i.data) && "data");
      if (L || i.dataTypes[0] === "jsonp")
        return d = i.jsonpCallback = a.isFunction(i.jsonpCallback) ? i.jsonpCallback() : i.jsonpCallback, L ? i[L] = i[L].replace(ji, "$1" + d) : i.jsonp !== !1 && (i.url += (Xi.test(i.url) ? "&" : "?") + i.jsonp + "=" + d), i.converters["script json"] = function() {
          return A || a.error(d + " was not called"), A[0];
        }, i.dataTypes[0] = "json", C = o[d], o[d] = function() {
          A = arguments;
        }, f.always(function() {
          C === void 0 ? a(o).removeProp(d) : o[d] = C, i[d] && (i.jsonpCallback = s.jsonpCallback, Mo.push(d)), A && a.isFunction(C) && C(A[0]), A = C = void 0;
        }), "script";
    }), a.parseHTML = function(i, s, f) {
      if (!i || typeof i != "string")
        return null;
      typeof s == "boolean" && (f = s, s = !1), s = s || c;
      var d = yt.exec(i), C = !f && [];
      return d ? [s.createElement(d[1])] : (d = dn([i], s, C), C && C.length && a(C).remove(), a.merge([], d.childNodes));
    };
    var Do = a.fn.load;
    a.fn.load = function(i, s, f) {
      if (typeof i != "string" && Do)
        return Do.apply(this, arguments);
      var d, C, A, L = this, R = i.indexOf(" ");
      return R > -1 && (d = a.trim(i.slice(R, i.length)), i = i.slice(0, R)), a.isFunction(s) ? (f = s, s = void 0) : s && typeof s == "object" && (C = "POST"), L.length > 0 && a.ajax({
        url: i,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: C || "GET",
        dataType: "html",
        data: s
      }).done(function(z) {
        A = arguments, L.html(d ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          a("<div>").append(a.parseHTML(z)).find(d)
        ) : (
          // Otherwise use the full result
          z
        ));
      }).always(f && function(z, H) {
        L.each(function() {
          f.apply(this, A || [z.responseText, H, z]);
        });
      }), this;
    }, a.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(i, s) {
      a.fn[s] = function(f) {
        return this.on(s, f);
      };
    }), a.expr.filters.animated = function(i) {
      return a.grep(a.timers, function(s) {
        return i === s.elem;
      }).length;
    };
    function Oo(i) {
      return a.isWindow(i) ? i : i.nodeType === 9 ? i.defaultView || i.parentWindow : !1;
    }
    a.offset = {
      setOffset: function(i, s, f) {
        var d, C, A, L, R, z, H, X = a.css(i, "position"), ft = a(i), mt = {};
        X === "static" && (i.style.position = "relative"), R = ft.offset(), A = a.css(i, "top"), z = a.css(i, "left"), H = (X === "absolute" || X === "fixed") && a.inArray("auto", [A, z]) > -1, H ? (d = ft.position(), L = d.top, C = d.left) : (L = parseFloat(A) || 0, C = parseFloat(z) || 0), a.isFunction(s) && (s = s.call(i, f, a.extend({}, R))), s.top != null && (mt.top = s.top - R.top + L), s.left != null && (mt.left = s.left - R.left + C), "using" in s ? s.using.call(i, mt) : ft.css(mt);
      }
    }, a.fn.extend({
      offset: function(i) {
        if (arguments.length)
          return i === void 0 ? this : this.each(function(L) {
            a.offset.setOffset(this, i, L);
          });
        var s, f, d = { top: 0, left: 0 }, C = this[0], A = C && C.ownerDocument;
        if (A)
          return s = A.documentElement, a.contains(s, C) ? (typeof C.getBoundingClientRect < "u" && (d = C.getBoundingClientRect()), f = Oo(A), {
            top: d.top + (f.pageYOffset || s.scrollTop) - (s.clientTop || 0),
            left: d.left + (f.pageXOffset || s.scrollLeft) - (s.clientLeft || 0)
          }) : d;
      },
      position: function() {
        if (this[0]) {
          var i, s, f = { top: 0, left: 0 }, d = this[0];
          return a.css(d, "position") === "fixed" ? s = d.getBoundingClientRect() : (i = this.offsetParent(), s = this.offset(), a.nodeName(i[0], "html") || (f = i.offset()), f.top += a.css(i[0], "borderTopWidth", !0), f.left += a.css(i[0], "borderLeftWidth", !0)), {
            top: s.top - f.top - a.css(d, "marginTop", !0),
            left: s.left - f.left - a.css(d, "marginLeft", !0)
          };
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var i = this.offsetParent; i && !a.nodeName(i, "html") && a.css(i, "position") === "static"; )
            i = i.offsetParent;
          return i || Aa;
        });
      }
    }), a.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(i, s) {
      var f = /Y/.test(s);
      a.fn[i] = function(d) {
        return vt(this, function(C, A, L) {
          var R = Oo(C);
          if (L === void 0)
            return R ? s in R ? R[s] : R.document.documentElement[A] : C[A];
          R ? R.scrollTo(
            f ? a(R).scrollLeft() : L,
            f ? L : a(R).scrollTop()
          ) : C[A] = L;
        }, i, d, arguments.length, null);
      };
    }), a.each(["top", "left"], function(i, s) {
      a.cssHooks[s] = Ao(
        h.pixelPosition,
        function(f, d) {
          if (d)
            return d = or(f, s), zi.test(d) ? a(f).position()[s] + "px" : d;
        }
      );
    }), a.each({ Height: "height", Width: "width" }, function(i, s) {
      a.each(
        { padding: "inner" + i, content: s, "": "outer" + i },
        function(f, d) {
          a.fn[d] = function(C, A) {
            var L = arguments.length && (f || typeof C != "boolean"), R = f || (C === !0 || A === !0 ? "margin" : "border");
            return vt(this, function(z, H, X) {
              var ft;
              return a.isWindow(z) ? z.document.documentElement["client" + i] : z.nodeType === 9 ? (ft = z.documentElement, Math.max(
                z.body["scroll" + i],
                ft["scroll" + i],
                z.body["offset" + i],
                ft["offset" + i],
                ft["client" + i]
              )) : X === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                a.css(z, H, R)
              ) : (
                // Set width or height on the element
                a.style(z, H, X, R)
              );
            }, s, L ? C : void 0, L, null);
          };
        }
      );
    }), a.fn.extend({
      bind: function(i, s, f) {
        return this.on(i, null, s, f);
      },
      unbind: function(i, s) {
        return this.off(i, null, s);
      },
      delegate: function(i, s, f, d) {
        return this.on(s, i, f, d);
      },
      undelegate: function(i, s, f) {
        return arguments.length === 1 ? this.off(i, "**") : this.off(s, i || "**", f);
      }
    }), a.fn.size = function() {
      return this.length;
    }, a.fn.andSelf = a.fn.addBack;
    var Va = o.jQuery, Xa = o.$;
    return a.noConflict = function(i) {
      return o.$ === a && (o.$ = Xa), i && o.jQuery === a && (o.jQuery = Va), a;
    }, n || (o.jQuery = o.$ = a), a;
  });
})(bd);
var f_ = bd.exports;
const Xt = /* @__PURE__ */ Js(f_), c_ = function(e) {
  var o = {
    border: !1,
    layout: {
      width: 100,
      height: 20,
      x: 0,
      y: 0
    },
    sizeLayout: {
      width: 100,
      height: 20,
      x: 0,
      y: 0
    },
    scale: 1,
    onLabelSelectFunction: function(m) {
      alert("Click" + m.number);
    },
    labelSize: 10,
    longestChromosome: 100
  }, n = we.merge({}, o, e), l = function(m) {
    return m < 1e3 ? m : m < 1e6 ? (m / 1e3).toFixed(1) + "Kb" : (m / 1e6).toFixed(1) + "Mb";
  };
  function c(m) {
    m.each(function(g) {
      var b = Dt(this).selectAll(".chromosome-label").data([g]), p = b.enter().append("g").attr("class", "chromosome-label");
      p.append("text"), n.border && p.append("rect").classed("border", !0), Dt(this).selectAll(".chromosome-label").attr("transform", function(h) {
        return "translate(" + n.layout.x + "," + n.layout.y + ")";
      }), Dt(this).selectAll(".chromosome-label").selectAll("text").attr("x", n.layout.width * 0.5).attr("y", n.layout.height * 0.5).style(
        "font-size",
        Math.max(14 / n.scale, n.layout.chromosomeWidth * 1.2) + "px"
      ).text(g.number).on("click", n.onLabelSelectFunction), n.border && b.select("rect").attr("width", n.layout.width).attr("height", n.layout.height), b.exit().remove();
      var v = Dt(this).selectAll(".chromosome-size-label").data([g]);
      p = v.enter().append("g").attr("class", "chromosome-size-label"), p.append("text");
      var S = 10 + n.sizeLayout.y + n.sizeLayout.cellHeight * g.length / n.longestChromosome, x = 1.2 * n.labelSize / Math.min(5, n.scale) + "px";
      Dt(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + n.sizeLayout.x + "," + S + ")"
      ), v = Dt(this).selectAll(".chromosome-size-label").select("text").attr("x", n.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", x).text(l(g.length)), v.exit().remove();
    });
  }
  return c.longestChromosome = function(m) {
    return arguments.length ? (n.longestChromosome = m, c) : n.longestChromosome;
  }, c.layout = function(m) {
    return arguments.length ? (n.layout = m, c) : n.layout;
  }, c.sizeLayout = function(m) {
    return arguments.length ? (n.sizeLayout = m, c) : n.sizeLayout;
  }, c.scale = function(m) {
    return arguments.length ? (n.scale = m, c) : n.scale;
  }, c.onLabelSelectFunction = function(m) {
    return arguments.length ? (n.onLabelSelectFunction = m, c) : n.onLabelSelectFunction;
  }, c;
}, h_ = function(e) {
  var o = {
    border: !1,
    longestChromosome: 100,
    bands: "basemap",
    layout: {
      width: 10,
      height: 100,
      x: 0,
      y: 0
    },
    scale: 1,
    onAnnotationSelectFunction: Xt.noop(),
    drawing: null
  }, n = we.merge({}, o, e), l = function() {
    return Ii().range([0, n.layout.height]).domain([0, n.longestChromosome]);
  }, c = function(v) {
    var S = l(), x = S(v.length), h = Dt(this);
    h.attr("id", "chromosome_" + v.number).attr(
      "transform",
      "translate(" + n.layout.x + "," + n.layout.y + ")"
    ), h.select("defs").html("").append("mask").attr("id", "chromosome_mask_" + v.number).append("rect").attr("class", "mask_rect"), h.select("#chromosome_mask_" + v.number).attr("width", n.layout.width).attr("height", x);
    var w = {
      width: n.layout.width,
      height: x,
      rx: Math.min(n.layout.width * 0.4, n.layout.height * 0.1),
      ry: Math.min(n.layout.width * 0.4, n.layout.height * 0.1)
    };
    h.select(".mask_rect").attr("width", w.width).attr("height", w.height).attr("rx", w.rx).attr("ry", w.ry), h.select("rect.background").attr("width", w.width).attr("height", w.height).attr("rx", w.rx).attr("ry", w.ry), h.select("rect.outline").attr("width", w.width).attr("height", w.height).attr("rx", w.rx).attr("ry", w.ry);
    var a = [], E = function() {
      var q = h.selectAll("rect.selection").data(a);
      q.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), q.attr("x", 0).attr("y", function(P) {
        return Math.min(P.start, P.end);
      }).attr("width", n.layout.width).attr("height", function(P) {
        return Math.abs(P.end - P.start);
      }), q.exit().remove();
    }, k = Vw().on("start", function(q) {
      var P = tr(q, this);
      a.push({
        start: P[1],
        end: P[1]
      }), E(), q.sourceEvent.stopPropagation();
    }).on("drag", function(q) {
      a[0].end = tr(q, this)[1], E(), q.sourceEvent.stopPropagation(), q.sourceEvent.preventDefault();
    }).on("end", function(q) {
      q.sourceEvent.stopPropagation();
      var P = S.invert(a[0].start), U = S.invert(a[0].end);
      if (P > U) {
        var Q = P;
        P = U, U = Q;
      }
      var et = v.layout.geneBandNodes.filter(function(yt) {
        return yt.data.midpoint > P && yt.data.midpoint < U;
      });
      et.forEach(function(yt) {
        yt.data.type == "gene" ? yt.data.visible = !0 : yt.data.type == "geneslist" && yt.data.genesList.forEach(function(_t) {
          _t.visible = !0;
        });
      }), n.onAnnotationSelectFunction(), a = [], E();
    });
    h.select("rect.background").call(k), n.border && h.select("rect.border").attr("width", n.layout.width).attr("height", n.layout.height);
    var O = h.select(".bands_container"), G;
    n.bands == "basemap" ? G = m : n.bands == "genes" && (G = b), G(O, v), h.select(".bands_container").style("mask", "url(#chromosome_mask_" + v.number + ")");
  }, m = function(v, S) {
    var x = l(), h = v.selectAll("rect.band").data(S.bands);
    h.enter().append("rect").attr("class", "band"), h.attr("width", n.layout.width).attr("y", function(w) {
      return x(w.start);
    }).attr("height", function(w) {
      return x(w.end - w.start);
    }).attr("fill", function(w) {
      return w.color;
    }), h.exit().remove();
  }, g = function(v, S) {
    var x = S.end - S.start, h = v(x), w;
    if (h * n.scale > 2)
      w = { y: v(S.start), height: h };
    else {
      let a = Math.min(2 / n.scale, 2);
      w = { y: v(S.midpoint) - a / 2, height: a };
    }
    return w.fill = S.color, w.width = n.layout.width, w["fill-opacity"] = 0.8, w["stroke-dasharray"] = [
      0,
      n.layout.width,
      w.height,
      n.layout.width + w.height
    ], w["stroke-width"] = n.layout.width / 5, w;
  }, b = function(v, S) {
    var x = l(), h = v.selectAll("rect.band"), w = h.data(S.layout.geneBandNodes);
    w.enter().append("rect").attr("id", function(E) {
      return E.data.id;
    }).attr("class", "band geneline infobox"), w.each(function(E) {
      let k = g(x, E);
      Dt(this).attr("y", k.y).attr("height", k.height).attr("fill", k.fill).attr("width", k.width).attr("fill-opacity", k["fill-opacity"]).attr("stroke-dasharray", k["stroke-dasharray"]).attr("stroke-width", k["stroke-width"]);
    }), w.classed("selected", function(E) {
      return E.data.selected;
    });
    var a = h.data(S.bands);
    a.attr("width", n.layout.width).attr("y", function(E) {
      return x(E.start);
    }).attr("height", function(E) {
      return x(E.end - E.start);
    }).attr("fill", function(E) {
      return "white";
    }), w.on("click", function(E, k) {
      if (k.data.type == "gene" && (k.data.displayed && !k.data.visible && !k.data.hidden ? (k.data.visible = !1, k.data.hidden = !0) : k.data.visible = !k.data.visible, n.onAnnotationSelectFunction()), k.data.type == "geneslist") {
        let O = k.data.genesList.some(function(G) {
          return !G.displayed;
        });
        k.data.genesList.forEach(function(G) {
          G.visible = O, G.hidden = !O;
        }), n.onAnnotationSelectFunction();
      }
    }), w.exit().remove();
  };
  function p(v) {
    v.each(function(S) {
      var x = Dt(this).selectAll(".chromosome").data([S]), h = x.enter().append("g").attr("class", "chromosome");
      h.append("defs"), h.append("rect").classed("background", !0), h.append("g").classed("bands_container", !0), h.append("rect").classed("outline", !0), n.border && h.append("rect").classed("border", !0), Dt(this).selectAll(".chromosome").each(c), x.exit().remove();
    });
  }
  return p.onAnnotationSelectFunction = function(v) {
    return arguments.length ? (n.onAnnotationSelectFunction = v, p) : n.onAnnotationSelectFunction;
  }, p.layout = function(v) {
    return arguments.length ? (n.layout = v, p) : n.layout;
  }, p.drawing = function(v) {
    return arguments.length ? (n.drawing = v, p) : n.drawing;
  }, p.longestChromosome = function(v) {
    return arguments.length ? (n.longestChromosome = v, p) : n.longestChromosome;
  }, p.bands = function(v) {
    return arguments.length ? (n.bands = v, p) : n.bands;
  }, p.scale = function(v) {
    return arguments.length ? (n.scale = v, p) : n.scale;
  }, p.infoBoxManager = function(v) {
    return arguments.length ? (n.infoBoxManager = v, p) : n.infoBoxManager;
  }, p;
};
var wn = "top", Fn = "bottom", zn = "right", xn = "left", ef = "auto", ma = [wn, Fn, zn, xn], yo = "start", ca = "end", d_ = "clippingParents", wd = "viewport", ea = "popper", p_ = "reference", mh = /* @__PURE__ */ ma.reduce(function(e, o) {
  return e.concat([o + "-" + yo, o + "-" + ca]);
}, []), xd = /* @__PURE__ */ [].concat(ma, [ef]).reduce(function(e, o) {
  return e.concat([o, o + "-" + yo, o + "-" + ca]);
}, []), g_ = "beforeRead", v_ = "read", m_ = "afterRead", y_ = "beforeMain", b_ = "main", w_ = "afterMain", x_ = "beforeWrite", __ = "write", C_ = "afterWrite", A_ = [g_, v_, m_, y_, b_, w_, x_, __, C_];
function mr(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function Tn(e) {
  if (e == null)
    return window;
  if (e.toString() !== "[object Window]") {
    var o = e.ownerDocument;
    return o && o.defaultView || window;
  }
  return e;
}
function Ri(e) {
  var o = Tn(e).Element;
  return e instanceof o || e instanceof Element;
}
function Bn(e) {
  var o = Tn(e).HTMLElement;
  return e instanceof o || e instanceof HTMLElement;
}
function nf(e) {
  if (typeof ShadowRoot > "u")
    return !1;
  var o = Tn(e).ShadowRoot;
  return e instanceof o || e instanceof ShadowRoot;
}
function S_(e) {
  var o = e.state;
  Object.keys(o.elements).forEach(function(n) {
    var l = o.styles[n] || {}, c = o.attributes[n] || {}, m = o.elements[n];
    !Bn(m) || !mr(m) || (Object.assign(m.style, l), Object.keys(c).forEach(function(g) {
      var b = c[g];
      b === !1 ? m.removeAttribute(g) : m.setAttribute(g, b === !0 ? "" : b);
    }));
  });
}
function E_(e) {
  var o = e.state, n = {
    popper: {
      position: o.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(o.elements.popper.style, n.popper), o.styles = n, o.elements.arrow && Object.assign(o.elements.arrow.style, n.arrow), function() {
    Object.keys(o.elements).forEach(function(l) {
      var c = o.elements[l], m = o.attributes[l] || {}, g = Object.keys(o.styles.hasOwnProperty(l) ? o.styles[l] : n[l]), b = g.reduce(function(p, v) {
        return p[v] = "", p;
      }, {});
      !Bn(c) || !mr(c) || (Object.assign(c.style, b), Object.keys(m).forEach(function(p) {
        c.removeAttribute(p);
      }));
    });
  };
}
const _d = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: S_,
  effect: E_,
  requires: ["computeStyles"]
};
function vr(e) {
  return e.split("-")[0];
}
var Mi = Math.max, Ks = Math.min, bo = Math.round;
function Bl() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands) ? e.brands.map(function(o) {
    return o.brand + "/" + o.version;
  }).join(" ") : navigator.userAgent;
}
function Cd() {
  return !/^((?!chrome|android).)*safari/i.test(Bl());
}
function wo(e, o, n) {
  o === void 0 && (o = !1), n === void 0 && (n = !1);
  var l = e.getBoundingClientRect(), c = 1, m = 1;
  o && Bn(e) && (c = e.offsetWidth > 0 && bo(l.width) / e.offsetWidth || 1, m = e.offsetHeight > 0 && bo(l.height) / e.offsetHeight || 1);
  var g = Ri(e) ? Tn(e) : window, b = g.visualViewport, p = !Cd() && n, v = (l.left + (p && b ? b.offsetLeft : 0)) / c, S = (l.top + (p && b ? b.offsetTop : 0)) / m, x = l.width / c, h = l.height / m;
  return {
    width: x,
    height: h,
    top: S,
    right: v + x,
    bottom: S + h,
    left: v,
    x: v,
    y: S
  };
}
function rf(e) {
  var o = wo(e), n = e.offsetWidth, l = e.offsetHeight;
  return Math.abs(o.width - n) <= 1 && (n = o.width), Math.abs(o.height - l) <= 1 && (l = o.height), {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: n,
    height: l
  };
}
function Ad(e, o) {
  var n = o.getRootNode && o.getRootNode();
  if (e.contains(o))
    return !0;
  if (n && nf(n)) {
    var l = o;
    do {
      if (l && e.isSameNode(l))
        return !0;
      l = l.parentNode || l.host;
    } while (l);
  }
  return !1;
}
function Hr(e) {
  return Tn(e).getComputedStyle(e);
}
function T_(e) {
  return ["table", "td", "th"].indexOf(mr(e)) >= 0;
}
function ui(e) {
  return ((Ri(e) ? e.ownerDocument : (
    // $FlowFixMe[prop-missing]
    e.document
  )) || window.document).documentElement;
}
function iu(e) {
  return mr(e) === "html" ? e : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    e.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    e.parentNode || // DOM Element detected
    (nf(e) ? e.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    ui(e)
  );
}
function yh(e) {
  return !Bn(e) || // https://github.com/popperjs/popper-core/issues/837
  Hr(e).position === "fixed" ? null : e.offsetParent;
}
function L_(e) {
  var o = /firefox/i.test(Bl()), n = /Trident/i.test(Bl());
  if (n && Bn(e)) {
    var l = Hr(e);
    if (l.position === "fixed")
      return null;
  }
  var c = iu(e);
  for (nf(c) && (c = c.host); Bn(c) && ["html", "body"].indexOf(mr(c)) < 0; ) {
    var m = Hr(c);
    if (m.transform !== "none" || m.perspective !== "none" || m.contain === "paint" || ["transform", "perspective"].indexOf(m.willChange) !== -1 || o && m.willChange === "filter" || o && m.filter && m.filter !== "none")
      return c;
    c = c.parentNode;
  }
  return null;
}
function ya(e) {
  for (var o = Tn(e), n = yh(e); n && T_(n) && Hr(n).position === "static"; )
    n = yh(n);
  return n && (mr(n) === "html" || mr(n) === "body" && Hr(n).position === "static") ? o : n || L_(e) || o;
}
function of(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function ia(e, o, n) {
  return Mi(e, Ks(o, n));
}
function k_(e, o, n) {
  var l = ia(e, o, n);
  return l > n ? n : l;
}
function Sd() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function Ed(e) {
  return Object.assign({}, Sd(), e);
}
function Td(e, o) {
  return o.reduce(function(n, l) {
    return n[l] = e, n;
  }, {});
}
var P_ = function(o, n) {
  return o = typeof o == "function" ? o(Object.assign({}, n.rects, {
    placement: n.placement
  })) : o, Ed(typeof o != "number" ? o : Td(o, ma));
};
function N_(e) {
  var o, n = e.state, l = e.name, c = e.options, m = n.elements.arrow, g = n.modifiersData.popperOffsets, b = vr(n.placement), p = of(b), v = [xn, zn].indexOf(b) >= 0, S = v ? "height" : "width";
  if (!(!m || !g)) {
    var x = P_(c.padding, n), h = rf(m), w = p === "y" ? wn : xn, a = p === "y" ? Fn : zn, E = n.rects.reference[S] + n.rects.reference[p] - g[p] - n.rects.popper[S], k = g[p] - n.rects.reference[p], O = ya(m), G = O ? p === "y" ? O.clientHeight || 0 : O.clientWidth || 0 : 0, q = E / 2 - k / 2, P = x[w], U = G - h[S] - x[a], Q = G / 2 - h[S] / 2 + q, et = ia(P, Q, U), yt = p;
    n.modifiersData[l] = (o = {}, o[yt] = et, o.centerOffset = et - Q, o);
  }
}
function M_(e) {
  var o = e.state, n = e.options, l = n.element, c = l === void 0 ? "[data-popper-arrow]" : l;
  c != null && (typeof c == "string" && (c = o.elements.popper.querySelector(c), !c) || Ad(o.elements.popper, c) && (o.elements.arrow = c));
}
const D_ = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: N_,
  effect: M_,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function xo(e) {
  return e.split("-")[1];
}
var O_ = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function R_(e, o) {
  var n = e.x, l = e.y, c = o.devicePixelRatio || 1;
  return {
    x: bo(n * c) / c || 0,
    y: bo(l * c) / c || 0
  };
}
function bh(e) {
  var o, n = e.popper, l = e.popperRect, c = e.placement, m = e.variation, g = e.offsets, b = e.position, p = e.gpuAcceleration, v = e.adaptive, S = e.roundOffsets, x = e.isFixed, h = g.x, w = h === void 0 ? 0 : h, a = g.y, E = a === void 0 ? 0 : a, k = typeof S == "function" ? S({
    x: w,
    y: E
  }) : {
    x: w,
    y: E
  };
  w = k.x, E = k.y;
  var O = g.hasOwnProperty("x"), G = g.hasOwnProperty("y"), q = xn, P = wn, U = window;
  if (v) {
    var Q = ya(n), et = "clientHeight", yt = "clientWidth";
    if (Q === Tn(n) && (Q = ui(n), Hr(Q).position !== "static" && b === "absolute" && (et = "scrollHeight", yt = "scrollWidth")), Q = Q, c === wn || (c === xn || c === zn) && m === ca) {
      P = Fn;
      var _t = x && Q === U && U.visualViewport ? U.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        Q[et]
      );
      E -= _t - l.height, E *= p ? 1 : -1;
    }
    if (c === xn || (c === wn || c === Fn) && m === ca) {
      q = zn;
      var bt = x && Q === U && U.visualViewport ? U.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        Q[yt]
      );
      w -= bt - l.width, w *= p ? 1 : -1;
    }
  }
  var wt = Object.assign({
    position: b
  }, v && O_), jt = S === !0 ? R_({
    x: w,
    y: E
  }, Tn(n)) : {
    x: w,
    y: E
  };
  if (w = jt.x, E = jt.y, p) {
    var Bt;
    return Object.assign({}, wt, (Bt = {}, Bt[P] = G ? "0" : "", Bt[q] = O ? "0" : "", Bt.transform = (U.devicePixelRatio || 1) <= 1 ? "translate(" + w + "px, " + E + "px)" : "translate3d(" + w + "px, " + E + "px, 0)", Bt));
  }
  return Object.assign({}, wt, (o = {}, o[P] = G ? E + "px" : "", o[q] = O ? w + "px" : "", o.transform = "", o));
}
function I_(e) {
  var o = e.state, n = e.options, l = n.gpuAcceleration, c = l === void 0 ? !0 : l, m = n.adaptive, g = m === void 0 ? !0 : m, b = n.roundOffsets, p = b === void 0 ? !0 : b, v = {
    placement: vr(o.placement),
    variation: xo(o.placement),
    popper: o.elements.popper,
    popperRect: o.rects.popper,
    gpuAcceleration: c,
    isFixed: o.options.strategy === "fixed"
  };
  o.modifiersData.popperOffsets != null && (o.styles.popper = Object.assign({}, o.styles.popper, bh(Object.assign({}, v, {
    offsets: o.modifiersData.popperOffsets,
    position: o.options.strategy,
    adaptive: g,
    roundOffsets: p
  })))), o.modifiersData.arrow != null && (o.styles.arrow = Object.assign({}, o.styles.arrow, bh(Object.assign({}, v, {
    offsets: o.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: p
  })))), o.attributes.popper = Object.assign({}, o.attributes.popper, {
    "data-popper-placement": o.placement
  });
}
const B_ = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: I_,
  data: {}
};
var Ns = {
  passive: !0
};
function F_(e) {
  var o = e.state, n = e.instance, l = e.options, c = l.scroll, m = c === void 0 ? !0 : c, g = l.resize, b = g === void 0 ? !0 : g, p = Tn(o.elements.popper), v = [].concat(o.scrollParents.reference, o.scrollParents.popper);
  return m && v.forEach(function(S) {
    S.addEventListener("scroll", n.update, Ns);
  }), b && p.addEventListener("resize", n.update, Ns), function() {
    m && v.forEach(function(S) {
      S.removeEventListener("scroll", n.update, Ns);
    }), b && p.removeEventListener("resize", n.update, Ns);
  };
}
const z_ = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: F_,
  data: {}
};
var q_ = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function zs(e) {
  return e.replace(/left|right|bottom|top/g, function(o) {
    return q_[o];
  });
}
var H_ = {
  start: "end",
  end: "start"
};
function wh(e) {
  return e.replace(/start|end/g, function(o) {
    return H_[o];
  });
}
function af(e) {
  var o = Tn(e), n = o.pageXOffset, l = o.pageYOffset;
  return {
    scrollLeft: n,
    scrollTop: l
  };
}
function sf(e) {
  return wo(ui(e)).left + af(e).scrollLeft;
}
function W_(e, o) {
  var n = Tn(e), l = ui(e), c = n.visualViewport, m = l.clientWidth, g = l.clientHeight, b = 0, p = 0;
  if (c) {
    m = c.width, g = c.height;
    var v = Cd();
    (v || !v && o === "fixed") && (b = c.offsetLeft, p = c.offsetTop);
  }
  return {
    width: m,
    height: g,
    x: b + sf(e),
    y: p
  };
}
function $_(e) {
  var o, n = ui(e), l = af(e), c = (o = e.ownerDocument) == null ? void 0 : o.body, m = Mi(n.scrollWidth, n.clientWidth, c ? c.scrollWidth : 0, c ? c.clientWidth : 0), g = Mi(n.scrollHeight, n.clientHeight, c ? c.scrollHeight : 0, c ? c.clientHeight : 0), b = -l.scrollLeft + sf(e), p = -l.scrollTop;
  return Hr(c || n).direction === "rtl" && (b += Mi(n.clientWidth, c ? c.clientWidth : 0) - m), {
    width: m,
    height: g,
    x: b,
    y: p
  };
}
function uf(e) {
  var o = Hr(e), n = o.overflow, l = o.overflowX, c = o.overflowY;
  return /auto|scroll|overlay|hidden/.test(n + c + l);
}
function Ld(e) {
  return ["html", "body", "#document"].indexOf(mr(e)) >= 0 ? e.ownerDocument.body : Bn(e) && uf(e) ? e : Ld(iu(e));
}
function oa(e, o) {
  var n;
  o === void 0 && (o = []);
  var l = Ld(e), c = l === ((n = e.ownerDocument) == null ? void 0 : n.body), m = Tn(l), g = c ? [m].concat(m.visualViewport || [], uf(l) ? l : []) : l, b = o.concat(g);
  return c ? b : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    b.concat(oa(iu(g)))
  );
}
function Fl(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height
  });
}
function G_(e, o) {
  var n = wo(e, !1, o === "fixed");
  return n.top = n.top + e.clientTop, n.left = n.left + e.clientLeft, n.bottom = n.top + e.clientHeight, n.right = n.left + e.clientWidth, n.width = e.clientWidth, n.height = e.clientHeight, n.x = n.left, n.y = n.top, n;
}
function xh(e, o, n) {
  return o === wd ? Fl(W_(e, n)) : Ri(o) ? G_(o, n) : Fl($_(ui(e)));
}
function U_(e) {
  var o = oa(iu(e)), n = ["absolute", "fixed"].indexOf(Hr(e).position) >= 0, l = n && Bn(e) ? ya(e) : e;
  return Ri(l) ? o.filter(function(c) {
    return Ri(c) && Ad(c, l) && mr(c) !== "body";
  }) : [];
}
function V_(e, o, n, l) {
  var c = o === "clippingParents" ? U_(e) : [].concat(o), m = [].concat(c, [n]), g = m[0], b = m.reduce(function(p, v) {
    var S = xh(e, v, l);
    return p.top = Mi(S.top, p.top), p.right = Ks(S.right, p.right), p.bottom = Ks(S.bottom, p.bottom), p.left = Mi(S.left, p.left), p;
  }, xh(e, g, l));
  return b.width = b.right - b.left, b.height = b.bottom - b.top, b.x = b.left, b.y = b.top, b;
}
function kd(e) {
  var o = e.reference, n = e.element, l = e.placement, c = l ? vr(l) : null, m = l ? xo(l) : null, g = o.x + o.width / 2 - n.width / 2, b = o.y + o.height / 2 - n.height / 2, p;
  switch (c) {
    case wn:
      p = {
        x: g,
        y: o.y - n.height
      };
      break;
    case Fn:
      p = {
        x: g,
        y: o.y + o.height
      };
      break;
    case zn:
      p = {
        x: o.x + o.width,
        y: b
      };
      break;
    case xn:
      p = {
        x: o.x - n.width,
        y: b
      };
      break;
    default:
      p = {
        x: o.x,
        y: o.y
      };
  }
  var v = c ? of(c) : null;
  if (v != null) {
    var S = v === "y" ? "height" : "width";
    switch (m) {
      case yo:
        p[v] = p[v] - (o[S] / 2 - n[S] / 2);
        break;
      case ca:
        p[v] = p[v] + (o[S] / 2 - n[S] / 2);
        break;
    }
  }
  return p;
}
function ha(e, o) {
  o === void 0 && (o = {});
  var n = o, l = n.placement, c = l === void 0 ? e.placement : l, m = n.strategy, g = m === void 0 ? e.strategy : m, b = n.boundary, p = b === void 0 ? d_ : b, v = n.rootBoundary, S = v === void 0 ? wd : v, x = n.elementContext, h = x === void 0 ? ea : x, w = n.altBoundary, a = w === void 0 ? !1 : w, E = n.padding, k = E === void 0 ? 0 : E, O = Ed(typeof k != "number" ? k : Td(k, ma)), G = h === ea ? p_ : ea, q = e.rects.popper, P = e.elements[a ? G : h], U = V_(Ri(P) ? P : P.contextElement || ui(e.elements.popper), p, S, g), Q = wo(e.elements.reference), et = kd({
    reference: Q,
    element: q,
    strategy: "absolute",
    placement: c
  }), yt = Fl(Object.assign({}, q, et)), _t = h === ea ? yt : Q, bt = {
    top: U.top - _t.top + O.top,
    bottom: _t.bottom - U.bottom + O.bottom,
    left: U.left - _t.left + O.left,
    right: _t.right - U.right + O.right
  }, wt = e.modifiersData.offset;
  if (h === ea && wt) {
    var jt = wt[c];
    Object.keys(bt).forEach(function(Bt) {
      var Y = [zn, Fn].indexOf(Bt) >= 0 ? 1 : -1, pt = [wn, Fn].indexOf(Bt) >= 0 ? "y" : "x";
      bt[Bt] += jt[pt] * Y;
    });
  }
  return bt;
}
function X_(e, o) {
  o === void 0 && (o = {});
  var n = o, l = n.placement, c = n.boundary, m = n.rootBoundary, g = n.padding, b = n.flipVariations, p = n.allowedAutoPlacements, v = p === void 0 ? xd : p, S = xo(l), x = S ? b ? mh : mh.filter(function(a) {
    return xo(a) === S;
  }) : ma, h = x.filter(function(a) {
    return v.indexOf(a) >= 0;
  });
  h.length === 0 && (h = x);
  var w = h.reduce(function(a, E) {
    return a[E] = ha(e, {
      placement: E,
      boundary: c,
      rootBoundary: m,
      padding: g
    })[vr(E)], a;
  }, {});
  return Object.keys(w).sort(function(a, E) {
    return w[a] - w[E];
  });
}
function j_(e) {
  if (vr(e) === ef)
    return [];
  var o = zs(e);
  return [wh(e), o, wh(o)];
}
function Y_(e) {
  var o = e.state, n = e.options, l = e.name;
  if (!o.modifiersData[l]._skip) {
    for (var c = n.mainAxis, m = c === void 0 ? !0 : c, g = n.altAxis, b = g === void 0 ? !0 : g, p = n.fallbackPlacements, v = n.padding, S = n.boundary, x = n.rootBoundary, h = n.altBoundary, w = n.flipVariations, a = w === void 0 ? !0 : w, E = n.allowedAutoPlacements, k = o.options.placement, O = vr(k), G = O === k, q = p || (G || !a ? [zs(k)] : j_(k)), P = [k].concat(q).reduce(function(zt, ie) {
      return zt.concat(vr(ie) === ef ? X_(o, {
        placement: ie,
        boundary: S,
        rootBoundary: x,
        padding: v,
        flipVariations: a,
        allowedAutoPlacements: E
      }) : ie);
    }, []), U = o.rects.reference, Q = o.rects.popper, et = /* @__PURE__ */ new Map(), yt = !0, _t = P[0], bt = 0; bt < P.length; bt++) {
      var wt = P[bt], jt = vr(wt), Bt = xo(wt) === yo, Y = [wn, Fn].indexOf(jt) >= 0, pt = Y ? "width" : "height", J = ha(o, {
        placement: wt,
        boundary: S,
        rootBoundary: x,
        altBoundary: h,
        padding: v
      }), lt = Y ? Bt ? zn : xn : Bt ? Fn : wn;
      U[pt] > Q[pt] && (lt = zs(lt));
      var xt = zs(lt), At = [];
      if (m && At.push(J[jt] <= 0), b && At.push(J[lt] <= 0, J[xt] <= 0), At.every(function(zt) {
        return zt;
      })) {
        _t = wt, yt = !1;
        break;
      }
      et.set(wt, At);
    }
    if (yt)
      for (var Lt = a ? 3 : 1, j = function(ie) {
        var de = P.find(function(oe) {
          var Yt = et.get(oe);
          if (Yt)
            return Yt.slice(0, ie).every(function(Be) {
              return Be;
            });
        });
        if (de)
          return _t = de, "break";
      }, kt = Lt; kt > 0; kt--) {
        var le = j(kt);
        if (le === "break") break;
      }
    o.placement !== _t && (o.modifiersData[l]._skip = !0, o.placement = _t, o.reset = !0);
  }
}
const Q_ = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Y_,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function _h(e, o, n) {
  return n === void 0 && (n = {
    x: 0,
    y: 0
  }), {
    top: e.top - o.height - n.y,
    right: e.right - o.width + n.x,
    bottom: e.bottom - o.height + n.y,
    left: e.left - o.width - n.x
  };
}
function Ch(e) {
  return [wn, zn, Fn, xn].some(function(o) {
    return e[o] >= 0;
  });
}
function K_(e) {
  var o = e.state, n = e.name, l = o.rects.reference, c = o.rects.popper, m = o.modifiersData.preventOverflow, g = ha(o, {
    elementContext: "reference"
  }), b = ha(o, {
    altBoundary: !0
  }), p = _h(g, l), v = _h(b, c, m), S = Ch(p), x = Ch(v);
  o.modifiersData[n] = {
    referenceClippingOffsets: p,
    popperEscapeOffsets: v,
    isReferenceHidden: S,
    hasPopperEscaped: x
  }, o.attributes.popper = Object.assign({}, o.attributes.popper, {
    "data-popper-reference-hidden": S,
    "data-popper-escaped": x
  });
}
const Z_ = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: K_
};
function J_(e, o, n) {
  var l = vr(e), c = [xn, wn].indexOf(l) >= 0 ? -1 : 1, m = typeof n == "function" ? n(Object.assign({}, o, {
    placement: e
  })) : n, g = m[0], b = m[1];
  return g = g || 0, b = (b || 0) * c, [xn, zn].indexOf(l) >= 0 ? {
    x: b,
    y: g
  } : {
    x: g,
    y: b
  };
}
function tC(e) {
  var o = e.state, n = e.options, l = e.name, c = n.offset, m = c === void 0 ? [0, 0] : c, g = xd.reduce(function(S, x) {
    return S[x] = J_(x, o.rects, m), S;
  }, {}), b = g[o.placement], p = b.x, v = b.y;
  o.modifiersData.popperOffsets != null && (o.modifiersData.popperOffsets.x += p, o.modifiersData.popperOffsets.y += v), o.modifiersData[l] = g;
}
const eC = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: tC
};
function nC(e) {
  var o = e.state, n = e.name;
  o.modifiersData[n] = kd({
    reference: o.rects.reference,
    element: o.rects.popper,
    strategy: "absolute",
    placement: o.placement
  });
}
const rC = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: nC,
  data: {}
};
function iC(e) {
  return e === "x" ? "y" : "x";
}
function oC(e) {
  var o = e.state, n = e.options, l = e.name, c = n.mainAxis, m = c === void 0 ? !0 : c, g = n.altAxis, b = g === void 0 ? !1 : g, p = n.boundary, v = n.rootBoundary, S = n.altBoundary, x = n.padding, h = n.tether, w = h === void 0 ? !0 : h, a = n.tetherOffset, E = a === void 0 ? 0 : a, k = ha(o, {
    boundary: p,
    rootBoundary: v,
    padding: x,
    altBoundary: S
  }), O = vr(o.placement), G = xo(o.placement), q = !G, P = of(O), U = iC(P), Q = o.modifiersData.popperOffsets, et = o.rects.reference, yt = o.rects.popper, _t = typeof E == "function" ? E(Object.assign({}, o.rects, {
    placement: o.placement
  })) : E, bt = typeof _t == "number" ? {
    mainAxis: _t,
    altAxis: _t
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, _t), wt = o.modifiersData.offset ? o.modifiersData.offset[o.placement] : null, jt = {
    x: 0,
    y: 0
  };
  if (Q) {
    if (m) {
      var Bt, Y = P === "y" ? wn : xn, pt = P === "y" ? Fn : zn, J = P === "y" ? "height" : "width", lt = Q[P], xt = lt + k[Y], At = lt - k[pt], Lt = w ? -yt[J] / 2 : 0, j = G === yo ? et[J] : yt[J], kt = G === yo ? -yt[J] : -et[J], le = o.elements.arrow, zt = w && le ? rf(le) : {
        width: 0,
        height: 0
      }, ie = o.modifiersData["arrow#persistent"] ? o.modifiersData["arrow#persistent"].padding : Sd(), de = ie[Y], oe = ie[pt], Yt = ia(0, et[J], zt[J]), Be = q ? et[J] / 2 - Lt - Yt - de - bt.mainAxis : j - Yt - de - bt.mainAxis, Je = q ? -et[J] / 2 + Lt + Yt + oe + bt.mainAxis : kt + Yt + oe + bt.mainAxis, ye = o.elements.arrow && ya(o.elements.arrow), Ot = ye ? P === "y" ? ye.clientTop || 0 : ye.clientLeft || 0 : 0, rt = (Bt = wt == null ? void 0 : wt[P]) != null ? Bt : 0, dt = lt + Be - rt - Ot, vt = lt + Je - rt, Jt = ia(w ? Ks(xt, dt) : xt, lt, w ? Mi(At, vt) : At);
      Q[P] = Jt, jt[P] = Jt - lt;
    }
    if (b) {
      var pe, xe = P === "x" ? wn : xn, Ve = P === "x" ? Fn : zn, ke = Q[U], Oe = U === "y" ? "height" : "width", Me = ke + k[xe], Ae = ke - k[Ve], qn = [wn, xn].indexOf(O) !== -1, Ln = (pe = wt == null ? void 0 : wt[U]) != null ? pe : 0, br = qn ? Me : ke - et[Oe] - yt[Oe] - Ln + bt.altAxis, kn = qn ? ke + et[Oe] + yt[Oe] - Ln - bt.altAxis : Ae, dn = w && qn ? k_(br, ke, kn) : ia(w ? br : Me, ke, w ? kn : Ae);
      Q[U] = dn, jt[U] = dn - ke;
    }
    o.modifiersData[l] = jt;
  }
}
const aC = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: oC,
  requiresIfExists: ["offset"]
};
function sC(e) {
  return {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  };
}
function uC(e) {
  return e === Tn(e) || !Bn(e) ? af(e) : sC(e);
}
function lC(e) {
  var o = e.getBoundingClientRect(), n = bo(o.width) / e.offsetWidth || 1, l = bo(o.height) / e.offsetHeight || 1;
  return n !== 1 || l !== 1;
}
function fC(e, o, n) {
  n === void 0 && (n = !1);
  var l = Bn(o), c = Bn(o) && lC(o), m = ui(o), g = wo(e, c, n), b = {
    scrollLeft: 0,
    scrollTop: 0
  }, p = {
    x: 0,
    y: 0
  };
  return (l || !l && !n) && ((mr(o) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  uf(m)) && (b = uC(o)), Bn(o) ? (p = wo(o, !0), p.x += o.clientLeft, p.y += o.clientTop) : m && (p.x = sf(m))), {
    x: g.left + b.scrollLeft - p.x,
    y: g.top + b.scrollTop - p.y,
    width: g.width,
    height: g.height
  };
}
function cC(e) {
  var o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), l = [];
  e.forEach(function(m) {
    o.set(m.name, m);
  });
  function c(m) {
    n.add(m.name);
    var g = [].concat(m.requires || [], m.requiresIfExists || []);
    g.forEach(function(b) {
      if (!n.has(b)) {
        var p = o.get(b);
        p && c(p);
      }
    }), l.push(m);
  }
  return e.forEach(function(m) {
    n.has(m.name) || c(m);
  }), l;
}
function hC(e) {
  var o = cC(e);
  return A_.reduce(function(n, l) {
    return n.concat(o.filter(function(c) {
      return c.phase === l;
    }));
  }, []);
}
function dC(e) {
  var o;
  return function() {
    return o || (o = new Promise(function(n) {
      Promise.resolve().then(function() {
        o = void 0, n(e());
      });
    })), o;
  };
}
function pC(e) {
  var o = e.reduce(function(n, l) {
    var c = n[l.name];
    return n[l.name] = c ? Object.assign({}, c, l, {
      options: Object.assign({}, c.options, l.options),
      data: Object.assign({}, c.data, l.data)
    }) : l, n;
  }, {});
  return Object.keys(o).map(function(n) {
    return o[n];
  });
}
var Ah = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Sh() {
  for (var e = arguments.length, o = new Array(e), n = 0; n < e; n++)
    o[n] = arguments[n];
  return !o.some(function(l) {
    return !(l && typeof l.getBoundingClientRect == "function");
  });
}
function gC(e) {
  e === void 0 && (e = {});
  var o = e, n = o.defaultModifiers, l = n === void 0 ? [] : n, c = o.defaultOptions, m = c === void 0 ? Ah : c;
  return function(b, p, v) {
    v === void 0 && (v = m);
    var S = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Ah, m),
      modifiersData: {},
      elements: {
        reference: b,
        popper: p
      },
      attributes: {},
      styles: {}
    }, x = [], h = !1, w = {
      state: S,
      setOptions: function(O) {
        var G = typeof O == "function" ? O(S.options) : O;
        E(), S.options = Object.assign({}, m, S.options, G), S.scrollParents = {
          reference: Ri(b) ? oa(b) : b.contextElement ? oa(b.contextElement) : [],
          popper: oa(p)
        };
        var q = hC(pC([].concat(l, S.options.modifiers)));
        return S.orderedModifiers = q.filter(function(P) {
          return P.enabled;
        }), a(), w.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!h) {
          var O = S.elements, G = O.reference, q = O.popper;
          if (Sh(G, q)) {
            S.rects = {
              reference: fC(G, ya(q), S.options.strategy === "fixed"),
              popper: rf(q)
            }, S.reset = !1, S.placement = S.options.placement, S.orderedModifiers.forEach(function(bt) {
              return S.modifiersData[bt.name] = Object.assign({}, bt.data);
            });
            for (var P = 0; P < S.orderedModifiers.length; P++) {
              if (S.reset === !0) {
                S.reset = !1, P = -1;
                continue;
              }
              var U = S.orderedModifiers[P], Q = U.fn, et = U.options, yt = et === void 0 ? {} : et, _t = U.name;
              typeof Q == "function" && (S = Q({
                state: S,
                options: yt,
                name: _t,
                instance: w
              }) || S);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: dC(function() {
        return new Promise(function(k) {
          w.forceUpdate(), k(S);
        });
      }),
      destroy: function() {
        E(), h = !0;
      }
    };
    if (!Sh(b, p))
      return w;
    w.setOptions(v).then(function(k) {
      !h && v.onFirstUpdate && v.onFirstUpdate(k);
    });
    function a() {
      S.orderedModifiers.forEach(function(k) {
        var O = k.name, G = k.options, q = G === void 0 ? {} : G, P = k.effect;
        if (typeof P == "function") {
          var U = P({
            state: S,
            name: O,
            instance: w,
            options: q
          }), Q = function() {
          };
          x.push(U || Q);
        }
      });
    }
    function E() {
      x.forEach(function(k) {
        return k();
      }), x = [];
    }
    return w;
  };
}
var vC = [z_, rC, B_, _d, eC, Q_, aC, D_, Z_], mC = /* @__PURE__ */ gC({
  defaultModifiers: vC
}), yC = "tippy-box", Pd = "tippy-content", bC = "tippy-backdrop", Nd = "tippy-arrow", Md = "tippy-svg-arrow", Li = {
  passive: !0,
  capture: !0
}, Dd = function() {
  return document.body;
};
function wC(e, o) {
  return {}.hasOwnProperty.call(e, o);
}
function xl(e, o, n) {
  if (Array.isArray(e)) {
    var l = e[o];
    return l ?? (Array.isArray(n) ? n[o] : n);
  }
  return e;
}
function lf(e, o) {
  var n = {}.toString.call(e);
  return n.indexOf("[object") === 0 && n.indexOf(o + "]") > -1;
}
function Od(e, o) {
  return typeof e == "function" ? e.apply(void 0, o) : e;
}
function Eh(e, o) {
  if (o === 0)
    return e;
  var n;
  return function(l) {
    clearTimeout(n), n = setTimeout(function() {
      e(l);
    }, o);
  };
}
function xC(e, o) {
  var n = Object.assign({}, e);
  return o.forEach(function(l) {
    delete n[l];
  }), n;
}
function _C(e) {
  return e.split(/\s+/).filter(Boolean);
}
function lo(e) {
  return [].concat(e);
}
function Th(e, o) {
  e.indexOf(o) === -1 && e.push(o);
}
function CC(e) {
  return e.filter(function(o, n) {
    return e.indexOf(o) === n;
  });
}
function AC(e) {
  return e.split("-")[0];
}
function Zs(e) {
  return [].slice.call(e);
}
function Lh(e) {
  return Object.keys(e).reduce(function(o, n) {
    return e[n] !== void 0 && (o[n] = e[n]), o;
  }, {});
}
function aa() {
  return document.createElement("div");
}
function da(e) {
  return ["Element", "Fragment"].some(function(o) {
    return lf(e, o);
  });
}
function SC(e) {
  return lf(e, "NodeList");
}
function EC(e) {
  return lf(e, "MouseEvent");
}
function TC(e) {
  return !!(e && e._tippy && e._tippy.reference === e);
}
function LC(e) {
  return da(e) ? [e] : SC(e) ? Zs(e) : Array.isArray(e) ? e : Zs(document.querySelectorAll(e));
}
function _l(e, o) {
  e.forEach(function(n) {
    n && (n.style.transitionDuration = o + "ms");
  });
}
function kh(e, o) {
  e.forEach(function(n) {
    n && n.setAttribute("data-state", o);
  });
}
function kC(e) {
  var o, n = lo(e), l = n[0];
  return l != null && (o = l.ownerDocument) != null && o.body ? l.ownerDocument : document;
}
function PC(e, o) {
  var n = o.clientX, l = o.clientY;
  return e.every(function(c) {
    var m = c.popperRect, g = c.popperState, b = c.props, p = b.interactiveBorder, v = AC(g.placement), S = g.modifiersData.offset;
    if (!S)
      return !0;
    var x = v === "bottom" ? S.top.y : 0, h = v === "top" ? S.bottom.y : 0, w = v === "right" ? S.left.x : 0, a = v === "left" ? S.right.x : 0, E = m.top - l + x > p, k = l - m.bottom - h > p, O = m.left - n + w > p, G = n - m.right - a > p;
    return E || k || O || G;
  });
}
function Cl(e, o, n) {
  var l = o + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(c) {
    e[l](c, n);
  });
}
function Ph(e, o) {
  for (var n = o; n; ) {
    var l;
    if (e.contains(n))
      return !0;
    n = n.getRootNode == null || (l = n.getRootNode()) == null ? void 0 : l.host;
  }
  return !1;
}
var pr = {
  isTouch: !1
}, Nh = 0;
function NC() {
  pr.isTouch || (pr.isTouch = !0, window.performance && document.addEventListener("mousemove", Rd));
}
function Rd() {
  var e = performance.now();
  e - Nh < 20 && (pr.isTouch = !1, document.removeEventListener("mousemove", Rd)), Nh = e;
}
function MC() {
  var e = document.activeElement;
  if (TC(e)) {
    var o = e._tippy;
    e.blur && !o.state.isVisible && e.blur();
  }
}
function DC() {
  document.addEventListener("touchstart", NC, Li), window.addEventListener("blur", MC);
}
var OC = typeof window < "u" && typeof document < "u", RC = OC ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function so(e) {
  var o = e === "destroy" ? "n already-" : " ";
  return [e + "() was called on a" + o + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function Mh(e) {
  var o = /[ \t]{2,}/g, n = /^[ \t]*/gm;
  return e.replace(o, " ").replace(n, "").trim();
}
function IC(e) {
  return Mh(`
  %ctippy.js

  %c` + Mh(e) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function Id(e) {
  return [
    IC(e),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var pa;
process.env.NODE_ENV !== "production" && BC();
function BC() {
  pa = /* @__PURE__ */ new Set();
}
function Fr(e, o) {
  if (e && !pa.has(o)) {
    var n;
    pa.add(o), (n = console).warn.apply(n, Id(o));
  }
}
function zl(e, o) {
  if (e && !pa.has(o)) {
    var n;
    pa.add(o), (n = console).error.apply(n, Id(o));
  }
}
function FC(e) {
  var o = !e, n = Object.prototype.toString.call(e) === "[object Object]" && !e.addEventListener;
  zl(o, ["tippy() was passed", "`" + String(e) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), zl(n, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var Bd = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, zC = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, En = Object.assign({
  appendTo: Dd,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: !0,
  ignoreAttributes: !1,
  interactive: !1,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function() {
  },
  onBeforeUpdate: function() {
  },
  onCreate: function() {
  },
  onDestroy: function() {
  },
  onHidden: function() {
  },
  onHide: function() {
  },
  onMount: function() {
  },
  onShow: function() {
  },
  onShown: function() {
  },
  onTrigger: function() {
  },
  onUntrigger: function() {
  },
  onClickOutside: function() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: !1,
  touch: !0,
  trigger: "mouseenter focus",
  triggerTarget: null
}, Bd, zC), qC = Object.keys(En), HC = function(o) {
  process.env.NODE_ENV !== "production" && zd(o, []);
  var n = Object.keys(o);
  n.forEach(function(l) {
    En[l] = o[l];
  });
};
function Fd(e) {
  var o = e.plugins || [], n = o.reduce(function(l, c) {
    var m = c.name, g = c.defaultValue;
    if (m) {
      var b;
      l[m] = e[m] !== void 0 ? e[m] : (b = En[m]) != null ? b : g;
    }
    return l;
  }, {});
  return Object.assign({}, e, n);
}
function WC(e, o) {
  var n = o ? Object.keys(Fd(Object.assign({}, En, {
    plugins: o
  }))) : qC, l = n.reduce(function(c, m) {
    var g = (e.getAttribute("data-tippy-" + m) || "").trim();
    if (!g)
      return c;
    if (m === "content")
      c[m] = g;
    else
      try {
        c[m] = JSON.parse(g);
      } catch {
        c[m] = g;
      }
    return c;
  }, {});
  return l;
}
function Dh(e, o) {
  var n = Object.assign({}, o, {
    content: Od(o.content, [e])
  }, o.ignoreAttributes ? {} : WC(e, o.plugins));
  return n.aria = Object.assign({}, En.aria, n.aria), n.aria = {
    expanded: n.aria.expanded === "auto" ? o.interactive : n.aria.expanded,
    content: n.aria.content === "auto" ? o.interactive ? null : "describedby" : n.aria.content
  }, n;
}
function zd(e, o) {
  e === void 0 && (e = {}), o === void 0 && (o = []);
  var n = Object.keys(e);
  n.forEach(function(l) {
    var c = xC(En, Object.keys(Bd)), m = !wC(c, l);
    m && (m = o.filter(function(g) {
      return g.name === l;
    }).length === 0), Fr(m, ["`" + l + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var $C = function() {
  return "innerHTML";
};
function ql(e, o) {
  e[$C()] = o;
}
function Oh(e) {
  var o = aa();
  return e === !0 ? o.className = Nd : (o.className = Md, da(e) ? o.appendChild(e) : ql(o, e)), o;
}
function Rh(e, o) {
  da(o.content) ? (ql(e, ""), e.appendChild(o.content)) : typeof o.content != "function" && (o.allowHTML ? ql(e, o.content) : e.textContent = o.content);
}
function Hl(e) {
  var o = e.firstElementChild, n = Zs(o.children);
  return {
    box: o,
    content: n.find(function(l) {
      return l.classList.contains(Pd);
    }),
    arrow: n.find(function(l) {
      return l.classList.contains(Nd) || l.classList.contains(Md);
    }),
    backdrop: n.find(function(l) {
      return l.classList.contains(bC);
    })
  };
}
function qd(e) {
  var o = aa(), n = aa();
  n.className = yC, n.setAttribute("data-state", "hidden"), n.setAttribute("tabindex", "-1");
  var l = aa();
  l.className = Pd, l.setAttribute("data-state", "hidden"), Rh(l, e.props), o.appendChild(n), n.appendChild(l), c(e.props, e.props);
  function c(m, g) {
    var b = Hl(o), p = b.box, v = b.content, S = b.arrow;
    g.theme ? p.setAttribute("data-theme", g.theme) : p.removeAttribute("data-theme"), typeof g.animation == "string" ? p.setAttribute("data-animation", g.animation) : p.removeAttribute("data-animation"), g.inertia ? p.setAttribute("data-inertia", "") : p.removeAttribute("data-inertia"), p.style.maxWidth = typeof g.maxWidth == "number" ? g.maxWidth + "px" : g.maxWidth, g.role ? p.setAttribute("role", g.role) : p.removeAttribute("role"), (m.content !== g.content || m.allowHTML !== g.allowHTML) && Rh(v, e.props), g.arrow ? S ? m.arrow !== g.arrow && (p.removeChild(S), p.appendChild(Oh(g.arrow))) : p.appendChild(Oh(g.arrow)) : S && p.removeChild(S);
  }
  return {
    popper: o,
    onUpdate: c
  };
}
qd.$$tippy = !0;
var GC = 1, Ms = [], Al = [];
function UC(e, o) {
  var n = Dh(e, Object.assign({}, En, Fd(Lh(o)))), l, c, m, g = !1, b = !1, p = !1, v = !1, S, x, h, w = [], a = Eh(dt, n.interactiveDebounce), E, k = GC++, O = null, G = CC(n.plugins), q = {
    // Is the instance currently enabled?
    isEnabled: !0,
    // Is the tippy currently showing and not transitioning out?
    isVisible: !1,
    // Has the instance been destroyed?
    isDestroyed: !1,
    // Is the tippy currently mounted to the DOM?
    isMounted: !1,
    // Has the tippy finished transitioning in?
    isShown: !1
  }, P = {
    // properties
    id: k,
    reference: e,
    popper: aa(),
    popperInstance: O,
    props: n,
    state: q,
    plugins: G,
    // methods
    clearDelayTimeouts: br,
    setProps: kn,
    setContent: dn,
    show: wr,
    hide: li,
    hideWithInteractivity: fi,
    enable: qn,
    disable: Ln,
    unmount: Wr,
    destroy: $r
  };
  if (!n.render)
    return process.env.NODE_ENV !== "production" && zl(!0, "render() function has not been supplied."), P;
  var U = n.render(P), Q = U.popper, et = U.onUpdate;
  Q.setAttribute("data-tippy-root", ""), Q.id = "tippy-" + P.id, P.popper = Q, e._tippy = P, Q._tippy = P;
  var yt = G.map(function(it) {
    return it.fn(P);
  }), _t = e.hasAttribute("aria-expanded");
  return ye(), Lt(), lt(), xt("onCreate", [P]), n.showOnCreate && Me(), Q.addEventListener("mouseenter", function() {
    P.props.interactive && P.state.isVisible && P.clearDelayTimeouts();
  }), Q.addEventListener("mouseleave", function() {
    P.props.interactive && P.props.trigger.indexOf("mouseenter") >= 0 && Y().addEventListener("mousemove", a);
  }), P;
  function bt() {
    var it = P.props.touch;
    return Array.isArray(it) ? it : [it, 0];
  }
  function wt() {
    return bt()[0] === "hold";
  }
  function jt() {
    var it;
    return !!((it = P.props.render) != null && it.$$tippy);
  }
  function Bt() {
    return E || e;
  }
  function Y() {
    var it = Bt().parentNode;
    return it ? kC(it) : document;
  }
  function pt() {
    return Hl(Q);
  }
  function J(it) {
    return P.state.isMounted && !P.state.isVisible || pr.isTouch || S && S.type === "focus" ? 0 : xl(P.props.delay, it ? 0 : 1, En.delay);
  }
  function lt(it) {
    it === void 0 && (it = !1), Q.style.pointerEvents = P.props.interactive && !it ? "" : "none", Q.style.zIndex = "" + P.props.zIndex;
  }
  function xt(it, St, Rt) {
    if (Rt === void 0 && (Rt = !0), yt.forEach(function(se) {
      se[it] && se[it].apply(se, St);
    }), Rt) {
      var ae;
      (ae = P.props)[it].apply(ae, St);
    }
  }
  function At() {
    var it = P.props.aria;
    if (it.content) {
      var St = "aria-" + it.content, Rt = Q.id, ae = lo(P.props.triggerTarget || e);
      ae.forEach(function(se) {
        var $e = se.getAttribute(St);
        if (P.state.isVisible)
          se.setAttribute(St, $e ? $e + " " + Rt : Rt);
        else {
          var tn = $e && $e.replace(Rt, "").trim();
          tn ? se.setAttribute(St, tn) : se.removeAttribute(St);
        }
      });
    }
  }
  function Lt() {
    if (!(_t || !P.props.aria.expanded)) {
      var it = lo(P.props.triggerTarget || e);
      it.forEach(function(St) {
        P.props.interactive ? St.setAttribute("aria-expanded", P.state.isVisible && St === Bt() ? "true" : "false") : St.removeAttribute("aria-expanded");
      });
    }
  }
  function j() {
    Y().removeEventListener("mousemove", a), Ms = Ms.filter(function(it) {
      return it !== a;
    });
  }
  function kt(it) {
    if (!(pr.isTouch && (p || it.type === "mousedown"))) {
      var St = it.composedPath && it.composedPath()[0] || it.target;
      if (!(P.props.interactive && Ph(Q, St))) {
        if (lo(P.props.triggerTarget || e).some(function(Rt) {
          return Ph(Rt, St);
        })) {
          if (pr.isTouch || P.state.isVisible && P.props.trigger.indexOf("click") >= 0)
            return;
        } else
          xt("onClickOutside", [P, it]);
        P.props.hideOnClick === !0 && (P.clearDelayTimeouts(), P.hide(), b = !0, setTimeout(function() {
          b = !1;
        }), P.state.isMounted || de());
      }
    }
  }
  function le() {
    p = !0;
  }
  function zt() {
    p = !1;
  }
  function ie() {
    var it = Y();
    it.addEventListener("mousedown", kt, !0), it.addEventListener("touchend", kt, Li), it.addEventListener("touchstart", zt, Li), it.addEventListener("touchmove", le, Li);
  }
  function de() {
    var it = Y();
    it.removeEventListener("mousedown", kt, !0), it.removeEventListener("touchend", kt, Li), it.removeEventListener("touchstart", zt, Li), it.removeEventListener("touchmove", le, Li);
  }
  function oe(it, St) {
    Be(it, function() {
      !P.state.isVisible && Q.parentNode && Q.parentNode.contains(Q) && St();
    });
  }
  function Yt(it, St) {
    Be(it, St);
  }
  function Be(it, St) {
    var Rt = pt().box;
    function ae(se) {
      se.target === Rt && (Cl(Rt, "remove", ae), St());
    }
    if (it === 0)
      return St();
    Cl(Rt, "remove", x), Cl(Rt, "add", ae), x = ae;
  }
  function Je(it, St, Rt) {
    Rt === void 0 && (Rt = !1);
    var ae = lo(P.props.triggerTarget || e);
    ae.forEach(function(se) {
      se.addEventListener(it, St, Rt), w.push({
        node: se,
        eventType: it,
        handler: St,
        options: Rt
      });
    });
  }
  function ye() {
    wt() && (Je("touchstart", rt, {
      passive: !0
    }), Je("touchend", vt, {
      passive: !0
    })), _C(P.props.trigger).forEach(function(it) {
      if (it !== "manual")
        switch (Je(it, rt), it) {
          case "mouseenter":
            Je("mouseleave", vt);
            break;
          case "focus":
            Je(RC ? "focusout" : "blur", Jt);
            break;
          case "focusin":
            Je("focusout", Jt);
            break;
        }
    });
  }
  function Ot() {
    w.forEach(function(it) {
      var St = it.node, Rt = it.eventType, ae = it.handler, se = it.options;
      St.removeEventListener(Rt, ae, se);
    }), w = [];
  }
  function rt(it) {
    var St, Rt = !1;
    if (!(!P.state.isEnabled || pe(it) || b)) {
      var ae = ((St = S) == null ? void 0 : St.type) === "focus";
      S = it, E = it.currentTarget, Lt(), !P.state.isVisible && EC(it) && Ms.forEach(function(se) {
        return se(it);
      }), it.type === "click" && (P.props.trigger.indexOf("mouseenter") < 0 || g) && P.props.hideOnClick !== !1 && P.state.isVisible ? Rt = !0 : Me(it), it.type === "click" && (g = !Rt), Rt && !ae && Ae(it);
    }
  }
  function dt(it) {
    var St = it.target, Rt = Bt().contains(St) || Q.contains(St);
    if (!(it.type === "mousemove" && Rt)) {
      var ae = Oe().concat(Q).map(function(se) {
        var $e, tn = se._tippy, Hn = ($e = tn.popperInstance) == null ? void 0 : $e.state;
        return Hn ? {
          popperRect: se.getBoundingClientRect(),
          popperState: Hn,
          props: n
        } : null;
      }).filter(Boolean);
      PC(ae, it) && (j(), Ae(it));
    }
  }
  function vt(it) {
    var St = pe(it) || P.props.trigger.indexOf("click") >= 0 && g;
    if (!St) {
      if (P.props.interactive) {
        P.hideWithInteractivity(it);
        return;
      }
      Ae(it);
    }
  }
  function Jt(it) {
    P.props.trigger.indexOf("focusin") < 0 && it.target !== Bt() || P.props.interactive && it.relatedTarget && Q.contains(it.relatedTarget) || Ae(it);
  }
  function pe(it) {
    return pr.isTouch ? wt() !== it.type.indexOf("touch") >= 0 : !1;
  }
  function xe() {
    Ve();
    var it = P.props, St = it.popperOptions, Rt = it.placement, ae = it.offset, se = it.getReferenceClientRect, $e = it.moveTransition, tn = jt() ? Hl(Q).arrow : null, Hn = se ? {
      getBoundingClientRect: se,
      contextElement: se.contextElement || Bt()
    } : e, ci = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Gr) {
        var Pn = Gr.state;
        if (jt()) {
          var di = pt(), Ur = di.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(xr) {
            xr === "placement" ? Ur.setAttribute("data-placement", Pn.placement) : Pn.attributes.popper["data-popper-" + xr] ? Ur.setAttribute("data-" + xr, "") : Ur.removeAttribute("data-" + xr);
          }), Pn.attributes.popper = {};
        }
      }
    }, Wn = [{
      name: "offset",
      options: {
        offset: ae
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !$e
      }
    }, ci];
    jt() && tn && Wn.push({
      name: "arrow",
      options: {
        element: tn,
        padding: 3
      }
    }), Wn.push.apply(Wn, (St == null ? void 0 : St.modifiers) || []), P.popperInstance = mC(Hn, Q, Object.assign({}, St, {
      placement: Rt,
      onFirstUpdate: h,
      modifiers: Wn
    }));
  }
  function Ve() {
    P.popperInstance && (P.popperInstance.destroy(), P.popperInstance = null);
  }
  function ke() {
    var it = P.props.appendTo, St, Rt = Bt();
    P.props.interactive && it === Dd || it === "parent" ? St = Rt.parentNode : St = Od(it, [Rt]), St.contains(Q) || St.appendChild(Q), P.state.isMounted = !0, xe(), process.env.NODE_ENV !== "production" && Fr(P.props.interactive && it === En.appendTo && Rt.nextElementSibling !== Q, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function Oe() {
    return Zs(Q.querySelectorAll("[data-tippy-root]"));
  }
  function Me(it) {
    P.clearDelayTimeouts(), it && xt("onTrigger", [P, it]), ie();
    var St = J(!0), Rt = bt(), ae = Rt[0], se = Rt[1];
    pr.isTouch && ae === "hold" && se && (St = se), St ? l = setTimeout(function() {
      P.show();
    }, St) : P.show();
  }
  function Ae(it) {
    if (P.clearDelayTimeouts(), xt("onUntrigger", [P, it]), !P.state.isVisible) {
      de();
      return;
    }
    if (!(P.props.trigger.indexOf("mouseenter") >= 0 && P.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(it.type) >= 0 && g)) {
      var St = J(!1);
      St ? c = setTimeout(function() {
        P.state.isVisible && P.hide();
      }, St) : m = requestAnimationFrame(function() {
        P.hide();
      });
    }
  }
  function qn() {
    P.state.isEnabled = !0;
  }
  function Ln() {
    P.hide(), P.state.isEnabled = !1;
  }
  function br() {
    clearTimeout(l), clearTimeout(c), cancelAnimationFrame(m);
  }
  function kn(it) {
    if (process.env.NODE_ENV !== "production" && Fr(P.state.isDestroyed, so("setProps")), !P.state.isDestroyed) {
      xt("onBeforeUpdate", [P, it]), Ot();
      var St = P.props, Rt = Dh(e, Object.assign({}, St, Lh(it), {
        ignoreAttributes: !0
      }));
      P.props = Rt, ye(), St.interactiveDebounce !== Rt.interactiveDebounce && (j(), a = Eh(dt, Rt.interactiveDebounce)), St.triggerTarget && !Rt.triggerTarget ? lo(St.triggerTarget).forEach(function(ae) {
        ae.removeAttribute("aria-expanded");
      }) : Rt.triggerTarget && e.removeAttribute("aria-expanded"), Lt(), lt(), et && et(St, Rt), P.popperInstance && (xe(), Oe().forEach(function(ae) {
        requestAnimationFrame(ae._tippy.popperInstance.forceUpdate);
      })), xt("onAfterUpdate", [P, it]);
    }
  }
  function dn(it) {
    P.setProps({
      content: it
    });
  }
  function wr() {
    process.env.NODE_ENV !== "production" && Fr(P.state.isDestroyed, so("show"));
    var it = P.state.isVisible, St = P.state.isDestroyed, Rt = !P.state.isEnabled, ae = pr.isTouch && !P.props.touch, se = xl(P.props.duration, 0, En.duration);
    if (!(it || St || Rt || ae) && !Bt().hasAttribute("disabled") && (xt("onShow", [P], !1), P.props.onShow(P) !== !1)) {
      if (P.state.isVisible = !0, jt() && (Q.style.visibility = "visible"), lt(), ie(), P.state.isMounted || (Q.style.transition = "none"), jt()) {
        var $e = pt(), tn = $e.box, Hn = $e.content;
        _l([tn, Hn], 0);
      }
      h = function() {
        var Wn;
        if (!(!P.state.isVisible || v)) {
          if (v = !0, Q.offsetHeight, Q.style.transition = P.props.moveTransition, jt() && P.props.animation) {
            var hi = pt(), Gr = hi.box, Pn = hi.content;
            _l([Gr, Pn], se), kh([Gr, Pn], "visible");
          }
          At(), Lt(), Th(Al, P), (Wn = P.popperInstance) == null || Wn.forceUpdate(), xt("onMount", [P]), P.props.animation && jt() && Yt(se, function() {
            P.state.isShown = !0, xt("onShown", [P]);
          });
        }
      }, ke();
    }
  }
  function li() {
    process.env.NODE_ENV !== "production" && Fr(P.state.isDestroyed, so("hide"));
    var it = !P.state.isVisible, St = P.state.isDestroyed, Rt = !P.state.isEnabled, ae = xl(P.props.duration, 1, En.duration);
    if (!(it || St || Rt) && (xt("onHide", [P], !1), P.props.onHide(P) !== !1)) {
      if (P.state.isVisible = !1, P.state.isShown = !1, v = !1, g = !1, jt() && (Q.style.visibility = "hidden"), j(), de(), lt(!0), jt()) {
        var se = pt(), $e = se.box, tn = se.content;
        P.props.animation && (_l([$e, tn], ae), kh([$e, tn], "hidden"));
      }
      At(), Lt(), P.props.animation ? jt() && oe(ae, P.unmount) : P.unmount();
    }
  }
  function fi(it) {
    process.env.NODE_ENV !== "production" && Fr(P.state.isDestroyed, so("hideWithInteractivity")), Y().addEventListener("mousemove", a), Th(Ms, a), a(it);
  }
  function Wr() {
    process.env.NODE_ENV !== "production" && Fr(P.state.isDestroyed, so("unmount")), P.state.isVisible && P.hide(), P.state.isMounted && (Ve(), Oe().forEach(function(it) {
      it._tippy.unmount();
    }), Q.parentNode && Q.parentNode.removeChild(Q), Al = Al.filter(function(it) {
      return it !== P;
    }), P.state.isMounted = !1, xt("onHidden", [P]));
  }
  function $r() {
    process.env.NODE_ENV !== "production" && Fr(P.state.isDestroyed, so("destroy")), !P.state.isDestroyed && (P.clearDelayTimeouts(), P.unmount(), Ot(), delete e._tippy, P.state.isDestroyed = !0, xt("onDestroy", [P]));
  }
}
function ba(e, o) {
  o === void 0 && (o = {});
  var n = En.plugins.concat(o.plugins || []);
  process.env.NODE_ENV !== "production" && (FC(e), zd(o, n)), DC();
  var l = Object.assign({}, o, {
    plugins: n
  }), c = LC(e);
  if (process.env.NODE_ENV !== "production") {
    var m = da(l.content), g = c.length > 1;
    Fr(m && g, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var b = c.reduce(function(p, v) {
    var S = v && UC(v, l);
    return S && p.push(S), p;
  }, []);
  return da(e) ? b[0] : b;
}
ba.defaultProps = En;
ba.setDefaultProps = HC;
ba.currentInput = pr;
Object.assign({}, _d, {
  effect: function(o) {
    var n = o.state, l = {
      popper: {
        position: n.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(n.elements.popper.style, l.popper), n.styles = l, n.elements.arrow && Object.assign(n.elements.arrow.style, l.arrow);
  }
});
ba.setDefaultProps({
  render: qd
});
const VC = "_btn_pqsxd_1", XC = "_btnGroup_pqsxd_4", Ds = {
  btn: VC,
  btnGroup: XC
}, jC = function(e) {
  var o = {
    onAnnotationSelectFunction: Xt.noop(),
    drawing: null,
    popoverId: ""
  }, n = we.merge({}, o, e), l = {
    show: function(p) {
      p.visible = !0;
    },
    hide: function(p) {
      p.visible = !1, p.hidden = !0;
    },
    auto: function(p) {
      p.visible = !1, p.hidden = !1;
    }
  }, c = function(p, v) {
    p.select("span.genelabel").text(function(h) {
      return h.label;
    }).style("font-weight", function(h) {
      return h.selected ? "bold" : "normal";
    }).style("opacity", function(h) {
      return h.visible || h.selected ? 1 : h.normedScore ? h.normedScore : h.importance;
    }).style("color", function(h) {
      return v.visible || v.selected ? v.color : null;
    });
    var S = p.select("div.btn-group");
    S.selectAll("a").data(["show", "hide", "auto"]).classed("disabled", function(h) {
      return h == "show" && v.visible || h == "hide" && v.hidden && !v.visible || h == "auto" && !v.hidden && !v.visible;
    });
  }, m = function(p, v, S) {
    var x = S.data.genesList, h = v.selectAll("p").data(x);
    p.append("span").text("Cluster"), p.append("div.btn-group").selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(k) {
      return k;
    }).classed(`${Ds.btn}`, !0)``.on("click", function(k) {
      var O = l[k];
      x.forEach(O), h.each(function(G) {
        var q = Dt(this);
        c(q, G);
      }), n.onAnnotationSelectFunction();
    });
    var a = h.enter(), E = a.append("p");
    E.append("span").classed("genelabel", !0), E.append("div").classed("btn-group", !0), h.each(function(k) {
      var O = Dt(this), G = O.select("div.btn-group");
      G.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(P) {
        return P;
      }).classed(`${Ds.btn}`, !0).on("click", function(P) {
        var U = l[P];
        U(k), n.onAnnotationSelectFunction(), c(O, k);
      });
    }), h.each(function(k) {
      var O = Dt(this);
      c(O, k);
    });
  }, g = function(p, v, S) {
    var x = S.data;
    p.append("a").attr("href", x.link).text(x.label), v.append("p").text(
      "Chromosome " + x.chromosome + ": " + x.start + "-" + x.end
    ), x.score && v.append("p").text("Score: " + parseFloat(x.score).toFixed(3)), v.append("hr");
    var h = v.append("p").style("float", "right").classed(Ds.btnGroup, !0), w = function() {
      let a = h.selectAll("a").data(["show", "hide", "auto"]);
      a.enter().append("a").attr("href", "#").text(function(E) {
        return E;
      }).classed(`${Ds.btn}`, !0).on("click", function(E) {
        var k = l[E];
        k(x), n.onAnnotationSelectFunction(), w();
      }), a.classed("disabled", function(E) {
        return E == "show" && x.visible || E == "hide" && x.hidden && !x.visible || E == "auto" && !x.hidden && !x.visible;
      });
    };
    w();
  }, b = {};
  return b.geneAnnotationsPopoverFunction = function(p, v) {
    var S = p.data.type == "geneslist";
    Dt(n.popoverId).attr("class", "popover");
    let x = Dt(n.popoverId).select(".popover-title"), h = Dt(n.popoverId).select(".popover-content");
    x.selectAll("*").remove(), x.text(""), h.selectAll("*").remove(), h.text(""), S ? m(x, h, p) : g(x, h, p);
    var w = v.target;
    Xt(".gene-annotation-popover").remove(), ba(w, {
      content: Xt(n.popoverId).html(),
      // Change the selector accordingly
      appendTo: document.body,
      // Appends the popover to the body
      allowHTML: !0,
      // Allows HTML content in the popover
      placement: "right",
      // Placement of the popover
      trigger: "manual",
      // Control when the popover is shown
      theme: "light",
      // Custom theme (optional)
      interactive: !0,
      // Allows interaction with the popover
      onShow(a) {
        console.log("Popover is shown");
      },
      onHide(a) {
        console.log("Popover is hidden");
      }
    }), w._tippy.show(), Xt(document).on("click", function(a) {
      Xt(a.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || Xt(".gene-annotation-popover").remove();
    }), Xt(n.popoverId).on("mousedown mousewheel", function(a) {
      a.stopPropagation();
    });
  }, b;
}, YC = function(e) {
  var o = {
    border: !1,
    labelRectangles: !1,
    onAnnotationSelectFunction: Xt.noop(),
    onExpandClusterFunction: Xt.noop(),
    longestChromosome: 100,
    layout: {
      width: 10,
      height: 100,
      x: 0,
      y: 0
    },
    chromosomeWidth: 20,
    annotationMarkerSize: 5,
    annotationLabelSize: 5,
    scale: null,
    drawing: null
  }, n = we.merge({}, o, e), l = null, c = function() {
    return Ii().range([0, n.layout.height]).domain([0, n.longestChromosome]);
  }, m = function(p, v) {
    we.pick(n, ["onAnnotationSelectFunction", "drawing"]), n.popoverId = "#clusterPopover", l = jC(n);
    var S = c(), x = p.selectAll("g.gene-annotation").data(v.layout.annotationNodes, function(E) {
      return E.data.id;
    }), h = x.enter().append("g").classed("gene-annotation", !0);
    h.append("line").classed("midpoint-line", !0), h.append("path").classed("link", !0).attr("d", function(E) {
      return E.data.path;
    }), n.labelRectangles && h.append("rect").classed("labella", !0), h.append("text").attr("x", function(E) {
      return E.x + 0.1 * n.annotationLabelSize;
    }).attr("y", function(E) {
      return E.y + 0.4 * n.annotationLabelSize;
    }), p.selectAll("g.gene-annotation").attr("id", function(E) {
      return "feature_" + E.data.id;
    }).attr("data-bs-toggle", "popover").attr("data-bs-trigger", "hover").attr("data-bs-html", "true"), p.selectAll("g.gene-annotation").classed("selected", function(E) {
      return E.data.selected;
    }), p.selectAll("g.gene-annotation").select("line.midpoint-line").attr("x1", -(n.chromosomeWidth * 0.5)).attr("y1", function(E) {
      return S(E.data.midpoint);
    }).attr("y2", function(E) {
      return S(E.data.midpoint);
    }).attr("x2", 0), p.selectAll("g.gene-annotation").select("text").text(function(E) {
      if (E.data.type == "gene")
        return E.data.label;
      if (E.data.type == "geneslist")
        return "(" + E.data.genesList.length + ")";
    }), n.labelRectangles && p.selectAll("g.gene-annotation").select("rect.labella").attr("fill", "pink").attr("stroke", "none").attr("x", function(E) {
      return E.x;
    }).attr("y", function(E) {
      return E.y - E.dy / 2;
    }).attr("width", function(E) {
      return E.dx;
    }).attr("height", function(E) {
      return E.dy;
    });
    var w = "0.5";
    p.selectAll("g.gene-annotation").select("path.link").style("opacity", function(E) {
      return E.data.visible || E.data.selected ? 1 : E.data.normedScore ? E.data.normedScore : E.data.importance;
    }).style("stroke-width", function(E) {
      return w;
    }).style("stroke", function(E) {
      return E.data.visible || E.data.selected ? E.data.color : "gray";
    }), p.selectAll("g.gene-annotation").select("text").style("font-size", function(E) {
      return (E.data.selected ? 0.2 : 0) + E.data.fontSize + "px";
    }).style("font-weight", function(E) {
      return E.data.selected ? "bold" : "normal";
    }).style("fill", function(E) {
      return E.data.selected ? E.data.color : null;
    }), p.selectAll("g.gene-annotation").select("text").transition().duration(300).attr("x", function(E) {
      return E.x + 0.1 * n.annotationLabelSize;
    }).attr("y", function(E) {
      return E.y + 0.4 * n.annotationLabelSize;
    }), p.selectAll("g.gene-annotation").select("path.link").transition().duration(300).attr("d", function(E) {
      return E.data.path;
    }), p.selectAll("g.gene-annotation").on("click", function(E, k) {
      k.data.type == "gene" && (k.data.selected = !k.data.selected, k.data.selected && (k.data.visible = !0), n.onAnnotationSelectFunction()), k.data.type == "geneslist" && n.onExpandClusterFunction(v, k.data);
    }), p.selectAll("g.gene-annotation").on("contextmenu", function(E, k) {
      l.geneAnnotationsPopoverFunction(k, E);
    });
    var a = p.selectAll("g.gene-annotation").exit();
    a.remove();
  }, g = function(p) {
    p.select("rect.border").empty() && p.append("rect").classed("border", !0), p.select("rect.border").attr("width", n.layout.width).attr("height", n.layout.height);
  };
  function b(p) {
    p.each(function(v) {
      var S = Dt(this).selectAll(".gene-annotations").data([v]);
      S.enter().append("g").attr("class", "gene-annotations"), S.attr(
        "transform",
        "translate(" + n.layout.x + "," + n.layout.y + ")"
      ).attr("id", function(x) {
        return "annotation_" + x.number;
      }), m(S, v), S.exit().remove(), n.border && g(S);
    });
  }
  return b.onAnnotationSelectFunction = function(p) {
    return arguments.length ? (n.onAnnotationSelectFunction = p, b) : n.onAnnotationSelectFunction;
  }, b.onExpandClusterFunction = function(p) {
    return arguments.length ? (n.onExpandClusterFunction = p, b) : n.onExpandClusterFunction;
  }, b.layout = function(p) {
    return arguments.length ? (n.layout = p, b) : n.layout;
  }, b.drawing = function(p) {
    return arguments.length ? (n.drawing = p, b) : n.drawing;
  }, b.scale = function(p) {
    return arguments.length ? (n.scale = p, b) : n.scale;
  }, b.longestChromosome = function(p) {
    return arguments.length ? (n.longestChromosome = p, b) : n.longestChromosome;
  }, b.chromosomeWidth = function(p) {
    return arguments.length ? (n.chromosomeWidth = p, b) : n.chromosomeWidth;
  }, b.annotationLabelSize = function(p) {
    return arguments.length ? (n.annotationLabelSize = p, b) : n.annotationLabelSize;
  }, b.annotationMarkerSize = function(p) {
    return arguments.length ? (n.annotationMarkerSize = p, b) : n.annotationMarkerSize;
  }, b;
}, QC = function(e) {
  var o = {
    border: !1,
    onAnnotationSelectFunction: Xt.noop(),
    longestChromosome: 100,
    layout: {
      width: 10,
      height: 100,
      x: 0,
      y: 0
    },
    bandWidthPercentage: 0.125,
    gapPercentage: 0.06666666666666667,
    chromosomeWidth: 20,
    annotationMarkerSize: 5,
    annotationLabelSize: 5,
    showAnnotationLabels: !0,
    maxSnpPValue: 1,
    drawing: null,
    scale: 1
  }, n = we.merge({}, o, e), l = function() {
    return Ii().range([0, n.layout.height]).domain([0, n.longestChromosome]);
  }, c = function(v, S, x, h) {
    var w = {};
    h.map(function(U, Q) {
      w[U] = Q;
    });
    var a = l(), E = v.selectAll("rect.snp-annotation").data(x, function(U) {
      return U.id;
    }), k = 4, O = function(U) {
      return n.layout.width - 0.2 * n.layout.chromosomeWidth * (1 + w[U.trait]);
    }, G = function(U) {
      return a(U.midpoint) - 0.5 * Math.max(k / n.scale, a(10));
    }, q = Math.max(k / n.scale, a(10)), P = 0.2 * n.layout.chromosomeWidth;
    E.attr("x", O).attr("y", G).attr("width", P).attr("height", q), E.enter().append("rect").attr("fill", function(U) {
      return U.color;
    }).attr("opacity", function(U) {
      return U.importance;
    }).attr("class", "snp-annotation").attr("x", O).attr("y", G).attr("width", P).attr("height", q), E.exit().remove(), E.on("contextmenu", function(U) {
    });
  }, m = function(v, S, x) {
    var h = 500, w = l();
    n.layout.width;
    var a = 0.3 * n.layout.chromosomeWidth, E = 0.4 * n.layout.chromosomeWidth, k = S.layout.qtlNodes.some(function(j) {
      return j.displayLabel;
    });
    k && (E = E * 1.5);
    var O = x * 0.2 * n.layout.chromosomeWidth, G = function(j) {
      return n.layout.width - j.labelPosition * (E + a) - O;
    }, q = function(j) {
      return n.layout.width - j.position * (E + a) - O;
    }, P = v.selectAll("g.qtl-annotation").data(S.layout.qtlNodes, function(j) {
      return j.id;
    }), U = P.enter().append("g").classed("qtl-annotation infobox", !0);
    U.append("rect").classed("qtl-hoverbox", !0);
    var Q = U.append("rect").classed("qtl-selector infobox", !0), et = {}, yt = {};
    P.exit().select("rect").each(function(j) {
      et[j.index] = we.pick(this, ["x", "y", "width", "height"]), et[j.index].midpoint = j.midpoint, et[j.index].position = j.position;
    }), Q.each(function(j) {
      yt[j.index] = we.pick(this, ["x", "y", "width", "height"]), yt[j.index].midpoint = j.midpoint, yt[j.index].position = j.position;
    });
    var _t = function(j, kt, le, zt) {
      return we.has(j, kt) ? j[kt][le].animVal.value : zt;
    };
    Q.attr("x", function(j) {
      return _t(et, j.parentIndex, "x", q(j));
    }).attr("y", function(j) {
      return _t(et, j.parentIndex, "y", w(j.start));
    }).attr("width", a).attr("height", function(j) {
      return _t(
        et,
        j.parentIndex,
        "height",
        w(j.end) - w(j.start)
      );
    }), P.attr("id", function(j) {
      return "feature_" + j.id;
    }), P.select("rect.qtl-hoverbox").attr("x", function(j) {
      return q(j);
    }).attr("y", function(j) {
      return w(j.start);
    }).attr("width", function(j) {
      return j.position * (E + a) + n.chromosomeWidth + O;
    }).attr("height", function(j) {
      return w(j.end) - w(j.start);
    }).attr("fill", function(j) {
      return j.color;
    }).attr("visibility", function(j) {
      return j.hover ? "visible" : "hidden";
    }), P.select("rect.qtl-selector").transition().duration(h).attr("x", q).attr("y", function(j) {
      return w(j.start);
    }).attr("width", a).attr("height", function(j) {
      return w(j.end) - w(j.start);
    }), P.select("rect.qtl-selector").style("fill", function(j) {
      return j.color;
    }), P.exit().select("rect").transition().duration(h).attr("x", function(j) {
      return _t(yt, j.parentIndex, "x", q(j));
    }).attr("y", function(j) {
      return _t(yt, j.parentIndex, "y", w(j.start));
    }).attr("width", function(j) {
      return a;
    }).attr("height", function(j) {
      return _t(
        yt,
        j.parentIndex,
        "height",
        w(j.end) - w(j.start)
      );
    }).remove(), P.exit().remove();
    var bt = function(j) {
      return w(j.midpoint);
    }, wt = function(j) {
      return j.displayLabel === "show" ? "visible" : j.displayLabel === "hide" ? "hidden" : !0;
    }, jt = U.append("g").classed("qtl-count-group", !0), Bt = P.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(j) {
        var kt = j.type == "qtllist" ? [j] : [];
        return kt;
      },
      function(j) {
        return "label_" + j.id;
      }
    ), Y = Bt.enter(), pt = Y.append("g").classed("qtllist", !0);
    pt.append("circle").classed("qtl-count", !0), pt.append("text").classed("qtl-count", !0), jt.each(function(j) {
      if (we.has(yt, j.index))
        if (we.has(et, j.parentIndex)) {
          let zt = et[j.parentIndex];
          var kt = n.layout.width - zt.position * (E + a), le = w(zt.midpoint);
          Dt(this).attr(
            "transform",
            "translate(" + (kt + 0.5 * a) + "," + le + ")"
          );
        } else
          Dt(this).attr("transform", function(zt) {
            return zt ? "translate(" + (q(zt) + 0.5 * a) + "," + bt(zt) + ")" : "translate(0,0)";
          });
    }), P.select("g.qtl-count-group").transition().duration(h).attr("transform", function(j) {
      return j ? "translate(" + (q(j) + 0.5 * a) + "," + bt(j) + ")" : "translate(0,0)";
    }), P.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", a + "px").style("visibility", "visible").style("fill", function(j) {
      return j.color;
    }).attr("id", function(j) {
      return j.id;
    });
    var J = Math.min(
      Math.max(10 / n.scale, a),
      14 / n.scale
    );
    P.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", J + "px").style(
      "visibility",
      J < 2 * a ? "visible" : "hidden"
    ).text(function(j) {
      return j.count;
    }), Bt.exit().remove(), U.append("g").classed("qtl-label-group", !0);
    var lt = P.select("g.qtl-label-group").selectAll("g.qtl").data(
      function(j) {
        var kt = j.displayLabel ? [j] : [];
        return kt;
      },
      function(j) {
        return "label_" + j.id;
      }
    );
    lt.exit().remove(), lt.transition().duration(h).attr("transform", function(j) {
      return "translate(" + (G(j) + 0.5 * a) + "," + bt(j) + ")";
    });
    var xt = lt.enter(), At = xt.append("g").classed("qtl", !0).attr("transform", function(j) {
      return "translate(" + (G(j) + 0.5 * a) + "," + bt(j) + ")";
    });
    At.append("text").classed("qtl-label", !0), P.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(j) {
      return j.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", wt).text(function(j) {
      return j.screenLabel;
    });
    var Lt = function(j) {
      j.on("mouseenter", function(kt) {
        kt.hover = !0, m(v, S, x);
      }).on("mouseout", function(kt) {
        kt.hover = !1, m(v, S, x);
      }).on("click", function(kt) {
        kt.hover = !kt.hover, m(v, S, x);
      });
    };
    Lt(P.select("rect.qtl-selector")), Lt(P.select("circle.qtl-count")), Lt(P.select("text.qtl-count")), P.on("contextmenu", function(j) {
      var kt = Dt("#clusterPopover");
      kt.attr("class", "popover");
      var le = kt.select(".popover-title");
      le.selectAll("*").remove(), le.text(""), le.text(
        "Chromosome " + j.chromosome + ": " + j.start + "-" + j.end
      ), Xt.fn.redraw = function() {
        return Xt(this).each(function() {
          this.offsetHeight;
        });
      }, zt = kt.select(".popover-content"), zt.selectAll("*").remove(), zt.text("");
      var zt = kt.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        j.type == "qtllist" ? j.qtlList : [j]
      ), ie = zt.enter();
      ie.append("p").classed("popover-annotation", !0);
      var de = zt.append("div").attr("class", "checkbox").append("label");
      de.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(oe) {
        return oe.selected;
      }).on("click", function(oe) {
        oe.selected = !oe.selected, zt.classed("selected", function(Yt) {
          return Yt.selected;
        }), n.onAnnotationSelectFunction();
      }), de.append("a").attr("href", function(oe) {
        return oe.link;
      }).attr("target", "_blank").text(function(oe) {
        return oe.label;
      }), zt.classed("selected", function(oe) {
        return oe.selected;
      });
    });
  }, g = function(v) {
    v.select("rect.border").empty() && v.append("rect").classed("border", !0), v.select("rect.border").attr("width", n.layout.width).attr("height", n.layout.height);
  }, b = function(v) {
    var S = /* @__PURE__ */ new Set();
    v.map(function(h) {
      S.add(h.trait);
    });
    var x = Array.from(S).sort();
    return x;
  };
  function p(v) {
    v.each(function(S) {
      var x = S.annotations.snps.filter(function(E) {
        return !(E.pvalue > n.maxSnpPValue);
      }), h = b(x), w = Dt(this).selectAll(".qtl-annotations").data([S]);
      w.enter().append("g").attr("class", "qtl-annotations"), w.attr(
        "transform",
        "translate(" + n.layout.x + "," + n.layout.y + ")"
      ), m(w, S, h.length), n.border && g(w), w.exit().remove();
      var a = Dt(this).selectAll(".snp-annotations").data([S]);
      a.enter().append("g").attr("class", "snp-annotations"), a.attr(
        "transform",
        "translate(" + n.layout.x + "," + n.layout.y + ")"
      ), c(a, S, x, h), a.exit().remove();
    });
  }
  return p.onAnnotationSelectFunction = function(v) {
    return arguments.length ? (n.onAnnotationSelectFunction = v, p) : n.onAnnotationSelectFunction;
  }, p.layout = function(v) {
    return arguments.length ? (n.layout = v, p) : n.layout;
  }, p.drawing = function(v) {
    return arguments.length ? (n.drawing = v, p) : n.drawing;
  }, p.longestChromosome = function(v) {
    return arguments.length ? (n.longestChromosome = v, p) : n.longestChromosome;
  }, p.chromosomeWidth = function(v) {
    return arguments.length ? (n.chromosomeWidth = v, p) : n.chromosomeWidth;
  }, p.annotationLabelSize = function(v) {
    return arguments.length ? (n.annotationLabelSize = v, p) : n.annotationLabelSize;
  }, p.annotationMarkerSize = function(v) {
    return arguments.length ? (n.annotationMarkerSize = v, p) : n.annotationMarkerSize;
  }, p.showAnnotationLabels = function(v) {
    return arguments.length ? (n.showAnnotationLabels = v, p) : n.showAnnotationLabels;
  }, p.maxSnpPValue = function(v) {
    return arguments.length ? (n.maxSnpPValue = v, p) : n.maxSnpPValue;
  }, p.infoBoxManager = function(v) {
    return arguments.length ? (n.infoBoxManager = v, p) : n.infoBoxManager;
  }, p.scale = function(v) {
    return arguments.length ? (n.scale = v, p) : n.scale;
  }, p;
}, KC = function(e) {
  var o = {
    border: !1,
    onAnnotationSelectFunction: Xt.noop(),
    onExpandClusterFunction: Xt.noop(),
    onLabelSelectFunction: Xt.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, n = we.merge({}, o, e);
  function l(c) {
    c.each(function(m) {
      var g = m.cellLayout, b = Dt(this).selectAll(".chromosome-cell").data(m.chromosomes), p = b.enter().append("g").attr("class", "chromosome-cell");
      n.border && p.append("rect").classed("border", !0), Dt(this).selectAll(".chromosome-cell").attr("transform", function(w) {
        return "translate(" + w.cell.x + "," + w.cell.y + ")";
      }), n.border && b.select("rect").attr("x", 0).attr("y", 0).attr("width", function(w) {
        return w.cell.width;
      }).attr("height", function(w) {
        return w.cell.height;
      });
      var v = YC().onAnnotationSelectFunction(n.onAnnotationSelectFunction).onExpandClusterFunction(n.onExpandClusterFunction).layout(g.geneAnnotationPosition).longestChromosome(g.longestChromosome).chromosomeWidth(g.chromosomePosition.width).annotationLabelSize(g.annotations.label.size).annotationMarkerSize(g.annotations.marker.size).drawing(n.svg).scale(g.scale);
      Ll(".chromosome-cell").call(v);
      var S = h_().layout(g.chromosomePosition).longestChromosome(g.longestChromosome).onAnnotationSelectFunction(n.onAnnotationSelectFunction).scale(g.scale).bands("genes").drawing(n.svg);
      Ll(".chromosome-cell").call(S);
      var x = c_().layout(g.labelPosition).sizeLayout(g.sizeLabelPosition).onLabelSelectFunction(n.onLabelSelectFunction).longestChromosome(g.longestChromosome).scale(g.scale);
      b.call(x);
      var h = QC().onAnnotationSelectFunction(n.onAnnotationSelectFunction).layout(g.qtlAnnotationPosition).longestChromosome(g.longestChromosome).chromosomeWidth(g.chromosomePosition.width).annotationLabelSize(g.annotations.label.size).annotationMarkerSize(g.annotations.marker.size).showAnnotationLabels(g.annotations.label.show).maxSnpPValue(n.maxSnpPValue).drawing(n.svg).scale(g.scale);
      b.call(h), b.exit().remove();
    });
  }
  return l.onAnnotationSelectFunction = function(c) {
    return arguments.length ? (n.onAnnotationSelectFunction = c, l) : n.onAnnotationSelectFunction;
  }, l.onExpandClusterFunction = function(c) {
    return arguments.length ? (n.onExpandClusterFunction = c, l) : n.onExpandClusterFunction;
  }, l.onLabelSelectFunction = function(c) {
    return arguments.length ? (n.onLabelSelectFunction = c, l) : n.onLabelSelectFunction;
  }, l.infoBoxManager = function(c) {
    return arguments.length ? (n.infoBoxManager = c, l) : n.infoBoxManager;
  }, l.maxAnnotationLayers = function(c) {
    return arguments.length ? (n.maxAnnotationLayers = c, l) : n.maxAnnotationLayers;
  }, l.maxSnpPValue = function(c) {
    return arguments.length ? (n.maxSnpPValue = c, l) : n.maxSnpPValue;
  }, l.svg = function(c) {
    return arguments.length ? (n.svg = c, l) : n.svg;
  }, l;
};
var Hd = { exports: {} };
(function(e, o) {
  (function(n, l) {
    e.exports = l();
  })(ki, function() {
    return function(n) {
      function l(m) {
        if (c[m]) return c[m].exports;
        var g = c[m] = { exports: {}, id: m, loaded: !1 };
        return n[m].call(g.exports, g, g.exports, l), g.loaded = !0, g.exports;
      }
      var c = {};
      return l.m = n, l.c = c, l.p = "", l(0);
    }([function(n, l, c) {
      n.exports = { Node: c(1), Force: c(2), Distributor: c(3), Renderer: c(10) };
    }, function(n, l) {
      function c(b, p) {
        if (!(b instanceof p)) throw new TypeError("Cannot call a class as a function");
      }
      var m = /* @__PURE__ */ function() {
        function b(p, v) {
          for (var S = 0; S < v.length; S++) {
            var x = v[S];
            x.enumerable = x.enumerable || !1, x.configurable = !0, "value" in x && (x.writable = !0), Object.defineProperty(p, x.key, x);
          }
        }
        return function(p, v, S) {
          return v && b(p.prototype, v), S && b(p, S), p;
        };
      }(), g = function() {
        function b(p, v, S) {
          c(this, b), this.idealPos = p, this.currentPos = p, this.width = v, this.data = S, this.layerIndex = 0;
        }
        return m(b, [{ key: "distanceFrom", value: function(p) {
          var v = this.width / 2, S = p.width / 2;
          return Math.max(this.currentPos - v, p.currentPos - S) - Math.min(this.currentPos + v, p.currentPos + S);
        } }, { key: "moveToIdealPosition", value: function() {
          return this.currentPos = this.idealPos, this;
        } }, { key: "displacement", value: function() {
          return this.idealPos - this.currentPos;
        } }, { key: "overlapWithNode", value: function(p) {
          var v = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return this.distanceFrom(p) - v < 0;
        } }, { key: "overlapWithPoint", value: function(p) {
          var v = this.width / 2;
          return p >= this.currentPos - v && p <= this.currentPos + v;
        } }, { key: "positionBefore", value: function(p) {
          var v = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return p.currentLeft() - this.width / 2 - v;
        } }, { key: "positionAfter", value: function(p) {
          var v = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return p.currentRight() + this.width / 2 + v;
        } }, { key: "currentRight", value: function() {
          return this.currentPos + this.width / 2;
        } }, { key: "currentLeft", value: function() {
          return this.currentPos - this.width / 2;
        } }, { key: "idealRight", value: function() {
          return this.idealPos + this.width / 2;
        } }, { key: "idealLeft", value: function() {
          return this.idealPos - this.width / 2;
        } }, { key: "createStub", value: function(p) {
          var v = new b(this.idealPos, p, this.data);
          return v.currentPos = this.currentPos, v.child = this, this.parent = v, v;
        } }, { key: "removeStub", value: function() {
          return this.parent && (this.parent.child = null, this.parent = null), this;
        } }, { key: "isStub", value: function() {
          return !!this.child;
        } }, { key: "getPathToRoot", value: function() {
          for (var p = [], v = this; v; ) p.push(v), v = v.parent;
          return p;
        } }, { key: "getPathFromRoot", value: function() {
          return this.getPathToRoot().reverse();
        } }, { key: "getPathToRootLength", value: function() {
          for (var p = 0, v = this; v; ) {
            var S = v.parent ? v.parent.currentPos : v.idealPos;
            p += Math.abs(v.currentPos - S), v = v.parent;
          }
          return p;
        } }, { key: "getRoot", value: function() {
          for (var p = this, v = this; v; ) p = v, v = v.parent;
          return p;
        } }, { key: "getLayerIndex", value: function() {
          return this.layerIndex;
        } }, { key: "clone", value: function() {
          var p = new b(this.idealPos, this.width, this.data);
          return p.currentPos = this.currentPos, p.layerIndex = this.layerIndex, p;
        } }]), b;
      }();
      n.exports = g;
    }, function(n, l, c) {
      var m = c(3), g = c(4), b = c(8), p = { nodeSpacing: 3, minPos: 0, maxPos: null, algorithm: "overlap", removeOverlap: !0, density: 0.85, stubWidth: 1 }, v = function(S) {
        var x = {}, h = g.extend({}, p), w = new m(), a = [], E = null;
        return x.nodes = function(k) {
          return arguments.length ? (a = k, E = [k.concat()], x) : a;
        }, x.getLayers = function() {
          return E;
        }, x.options = function(k) {
          if (!arguments.length) return h;
          h = g.extend(h, k);
          var O = g.pick(h, Object.keys(m.DEFAULT_OPTIONS));
          return g.isDefined(h.minPos) && g.isDefined(h.maxPos) ? O.layerWidth = h.maxPos - h.minPos : O.layerWidth = null, w.options(O), x;
        }, x.options(S), x.compute = function() {
          var k = g.pick(h, Object.keys(b.DEFAULT_OPTIONS));
          return a.forEach(function(O) {
            O.removeStub();
          }), E = w.distribute(a), E.map(function(O, G) {
            O.forEach(function(q) {
              q.layerIndex = G;
            }), h.removeOverlap && b(O, k);
          }), x;
        }, x.start = function() {
          console.log("[warning] force.start() is deprecated. Please use force.compute() instead.");
        }, x;
      };
      v.DEFAULT_OPTIONS = p, n.exports = v;
    }, function(n, l, c) {
      var m = c(4), g = c(6), b = { algorithm: "overlap", layerWidth: 1e3, density: 0.75, nodeSpacing: 3, stubWidth: 1 }, p = function(v) {
        var S = {};
        v = m.extend({}, b, v), S.options = function(h) {
          return arguments.length ? (v = m.extend(v, h), S) : v;
        }, S.computeRequiredWidth = function(h) {
          return m.sum(h, function(w) {
            return w.width + v.nodeSpacing;
          }) - v.nodeSpacing;
        }, S.maxWidthPerLayer = function() {
          return v.density * v.layerWidth;
        }, S.needToSplit = function(h) {
          return S.estimateRequiredLayers(h) > 1;
        }, S.estimateRequiredLayers = function(h) {
          return v.layerWidth ? Math.ceil(S.computeRequiredWidth(h) / S.maxWidthPerLayer()) : 1;
        };
        var x = { simple: function(h) {
          for (var w = S.estimateRequiredLayers(h), a = [], E = 0; E < w; E++) a.push([]);
          return h.forEach(function(k, O) {
            var G = O % w;
            a[G].push(k);
            for (var q = k, P = G - 1; P >= 0; P--) q = q.createStub(v.stubWidth), a[P].push(q);
          }), a;
        }, roundRobin: function(h) {
          var w = [];
          return w;
        }, overlap: function(h) {
          for (var w = [], a = S.maxWidthPerLayer(), E = h.concat(), k = S.computeRequiredWidth(E); k > a; ) {
            S.countIdealOverlaps(E);
            var O = E.concat(), G = k;
            for (E = []; O.length > 2 && G > a; ) {
              O.sort(function(bt, wt) {
                return wt.overlapCount - bt.overlapCount;
              });
              var q = O.shift();
              G -= q.width, G += v.stubWidth, q.overlaps.forEach(function(bt) {
                bt.overlapCount--;
              }), E.push(q);
            }
            w.push(O), k = S.computeRequiredWidth(E);
          }
          E.length > 0 && w.push(E);
          for (var P = w.length - 1; P >= 1; P--) for (var U = w[P], Q = 0; Q < U.length; Q++) {
            var et = U[Q];
            if (!et.isStub()) for (var yt = et, _t = P - 1; _t >= 0; _t--) yt = yt.createStub(v.stubWidth), w[_t].push(yt);
          }
          return w;
        } };
        return S.countIdealOverlaps = function(h) {
          var w = new g(v.layerWidth / 2);
          return h.forEach(function(a) {
            w.add([a.idealLeft(), a.idealRight(), a]);
          }), h.forEach(function(a) {
            var E = w.search(a.idealLeft(), a.idealRight());
            a.overlaps = E.map(function(k) {
              return k.data[2];
            }), a.overlapCount = E.length;
          }), h;
        }, S.distribute = function(h) {
          if (!h || h.length === 0) return [];
          if (v.algorithm == "none" || !m.isDefined(v.algorithm)) return [h];
          if (!S.needToSplit(h)) return [h];
          var w = h.concat().sort(function(a, E) {
            return a.idealPos - E.idealPos;
          });
          if (typeof v.algorithm == "function") return v.algorithm(w, v);
          if (x.hasOwnProperty(v.algorithm)) return x[v.algorithm](w);
          throw "Unknown algorithm: " + v.algorithm;
        }, S;
      };
      p.DEFAULT_OPTIONS = b, n.exports = p;
    }, function(n, l, c) {
      var m = { isDefined: function(g) {
        return g != null;
      }, last: function(g) {
        return g.length > 0 ? g[g.length - 1] : null;
      }, pick: function(g, b) {
        return b.reduce(function(p, v) {
          return p[v] = g[v], p;
        }, {});
      }, sum: function(g, b) {
        return g.map(b).reduce(function(p, v) {
          return p + v;
        }, 0);
      } };
      m.extend = c(5), n.exports = m;
    }, function(n, l) {
      var c = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(v) {
        return typeof v;
      } : function(v) {
        return v && typeof Symbol == "function" && v.constructor === Symbol && v !== Symbol.prototype ? "symbol" : typeof v;
      }, m = Object.prototype.hasOwnProperty, g = Object.prototype.toString, b = function(v) {
        return typeof Array.isArray == "function" ? Array.isArray(v) : g.call(v) === "[object Array]";
      }, p = function(v) {
        if (!v || g.call(v) !== "[object Object]") return !1;
        var S = m.call(v, "constructor"), x = v.constructor && v.constructor.prototype && m.call(v.constructor.prototype, "isPrototypeOf");
        if (v.constructor && !S && !x) return !1;
        var h;
        for (h in v) ;
        return h === void 0 || m.call(v, h);
      };
      n.exports = function v() {
        var S, x, h, w, a, E, k = arguments[0], O = 1, G = arguments.length, q = !1;
        for (typeof k == "boolean" ? (q = k, k = arguments[1] || {}, O = 2) : ((typeof k > "u" ? "undefined" : c(k)) !== "object" && typeof k != "function" || k == null) && (k = {}); O < G; ++O) if (S = arguments[O], S != null) for (x in S) h = k[x], w = S[x], k !== w && (q && w && (p(w) || (a = b(w))) ? (a ? (a = !1, E = h && b(h) ? h : []) : E = h && p(h) ? h : {}, k[x] = v(q, E, w)) : w !== void 0 && (k[x] = w));
        return k;
      };
    }, function(n, l, c) {
      function m(h, w) {
        if (w || (w = {}), this.startKey = w.startKey || 0, this.endKey = w.endKey || 1, this.intervalHash = {}, this.pointTree = new x({ compare: function(a, E) {
          if (a == null) return -1;
          if (E == null) return 1;
          var k = a[0] - E[0];
          return k > 0 ? 1 : k == 0 ? 0 : -1;
        } }), this._autoIncrement = 0, !h || typeof h != "number") throw new Error("you must specify center index as the 2nd argument.");
        this.root = new v(h);
      }
      function g(h, w) {
        return w.end < h.idx ? (h.left || (h.left = new v(w.start + w.end >> 1)), g.call(this, h.left, w)) : h.idx < w.start ? (h.right || (h.right = new v(w.start + w.end >> 1)), g.call(this, h.right, w)) : h.insert(w);
      }
      function b(h, w, a) {
        if (h) return w < h.idx ? (h.starts.every(function(E) {
          var k = E.start <= w;
          return k && a.push(E.result()), k;
        }), b.call(this, h.left, w, a)) : w > h.idx ? (h.ends.every(function(E) {
          var k = E.end >= w;
          return k && a.push(E.result()), k;
        }), b.call(this, h.right, w, a)) : void h.starts.map(function(E) {
          a.push(E.result());
        });
      }
      function p(h, w, a) {
        if (w - h <= 0) throw new Error("end must be greater than start. start: " + h + ", end: " + w);
        var E = {}, k = [];
        b.call(this, this.root, h + w >> 1, k, !0), k.forEach(function(U) {
          E[U.id] = !0;
        });
        for (var O = this.pointTree.bsearch([h, null]), G = this.pointTree; O >= 0 && G[O][0] == h; ) O--;
        var q = this.pointTree.bsearch([w, null]);
        if (q >= 0) {
          for (var P = G.length - 1; q <= P && G[q][0] <= w; ) q++;
          G.slice(O + 1, q).forEach(function(U) {
            var Q = U[1];
            E[Q] = !0;
          }, this), Object.keys(E).forEach(function(U) {
            var Q = this.intervalHash[U];
            a.push(Q.result(h, w));
          }, this);
        }
      }
      function v(h) {
        this.idx = h, this.starts = new x({ compare: function(w, a) {
          if (w == null) return -1;
          if (a == null) return 1;
          var E = w.start - a.start;
          return E > 0 ? 1 : E == 0 ? 0 : -1;
        } }), this.ends = new x({ compare: function(w, a) {
          if (w == null) return -1;
          if (a == null) return 1;
          var E = w.end - a.end;
          return E < 0 ? 1 : E == 0 ? 0 : -1;
        } });
      }
      function S(h, w, a, E) {
        if (this.id = w, this.start = h[a], this.end = h[E], this.data = h, typeof this.start != "number" || typeof this.end != "number") throw new Error("start, end must be number. start: " + this.start + ", end: " + this.end);
        if (this.start >= this.end) throw new Error("start must be smaller than end. start: " + this.start + ", end: " + this.end);
      }
      var x = c(7);
      m.prototype.add = function(h, w) {
        if (this.intervalHash[w]) throw new Error("id " + w + " is already registered.");
        if (w == null) {
          for (; this.intervalHash[this._autoIncrement]; ) this._autoIncrement++;
          w = this._autoIncrement;
        }
        var a = new S(h, w, this.startKey, this.endKey);
        this.pointTree.insert([a.start, w]), this.pointTree.insert([a.end, w]), this.intervalHash[w] = a, this._autoIncrement++, g.call(this, this.root, a);
      }, m.prototype.search = function(h, w) {
        var a = [];
        if (typeof h != "number") throw new Error(h + ": invalid input");
        if (w == null) b.call(this, this.root, h, a);
        else {
          if (typeof w != "number") throw new Error(h + "," + w + ": invalid input");
          p.call(this, h, w, a);
        }
        return a;
      }, m.prototype.remove = function(h) {
      }, v.prototype.insert = function(h) {
        this.starts.insert(h), this.ends.insert(h);
      }, S.prototype.result = function(h, w) {
        var a = { id: this.id, data: this.data };
        if (typeof h == "number" && typeof w == "number") {
          var E = Math.max(this.start, h), k = Math.min(this.end, w), O = k - E;
          a.rate1 = O / (w - h), a.rate2 = O / (this.end - this.start);
        }
        return a;
      }, n.exports = m;
    }, function(n, l) {
      var c = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(g) {
        return typeof g;
      } : function(g) {
        return g && typeof Symbol == "function" && g.constructor === Symbol && g !== Symbol.prototype ? "symbol" : typeof g;
      }, m = function g() {
        var b = null, p = {}, v = arguments;
        ["0", "1"].forEach(function(S) {
          var x = v[S];
          Array.isArray(x) ? b = x : x && (typeof x > "u" ? "undefined" : c(x)) == "object" && (p = x);
        }), typeof p.filter == "function" && (this._filter = p.filter), typeof p.compare == "function" ? this._compare = p.compare : typeof p.compare == "string" && g.compares[p.compare] && (this._compare = g.compares[p.compare]), this._unique = !!p.unique, p.resume && b ? b.forEach(function(S, x) {
          this.push(S);
        }, this) : b && this.insert.apply(this, b);
      };
      m.create = function(g, b) {
        return new m(g, b);
      }, m.prototype = new Array(), m.prototype.constructor = Array.prototype.constructor, m.prototype.insertOne = function(g) {
        var b = this.bsearch(g);
        return (!this._unique || this.key(g, b) == null) && !!this._filter(g, b) && (this.splice(b + 1, 0, g), b + 1);
      }, m.prototype.insert = function() {
        return Array.prototype.map.call(arguments, function(g) {
          return this.insertOne(g);
        }, this);
      }, m.prototype.remove = function(g) {
        return this.splice(g, 1), this;
      }, m.prototype.bsearch = function(g) {
        if (!this.length) return -1;
        for (var b, p = 0, v = this.length; v - p > 1; ) {
          b = Math.floor((p + v) / 2);
          var S = this[b], x = this._compare(g, S);
          if (x == 0) return b;
          x > 0 ? p = b : v = b;
        }
        return p == 0 && this._compare(this[0], g) > 0 ? -1 : p;
      }, m.prototype.key = function(g, b) {
        b == null && (b = this.bsearch(g));
        var p = b;
        if (p == -1 || this._compare(this[p], g) < 0) return p + 1 < this.length && this._compare(this[p + 1], g) == 0 ? p + 1 : null;
        for (; p >= 1 && this._compare(this[p - 1], g) == 0; ) p--;
        return p;
      }, m.prototype.keys = function(g, b) {
        var p = [];
        b == null && (b = this.bsearch(g));
        for (var v = b; v >= 0 && this._compare(this[v], g) == 0; ) p.push(v), v--;
        var S = this.length;
        for (v = b + 1; v < S && this._compare(this[v], g) == 0; ) p.push(v), v++;
        return p.length ? p : null;
      }, m.prototype.unique = function(g) {
        if (g) return this.filter(function(p, v) {
          return v == 0 || this._compare(this[v - 1], p) != 0;
        }, this);
        var b = 0;
        return this.map(function(p, v) {
          return v == 0 || this._compare(this[v - 1], p) != 0 ? null : v - b++;
        }, this).forEach(function(p) {
          p != null && this.remove(p);
        }, this), this;
      }, m.prototype.toArray = function() {
        return this.slice();
      }, m.prototype._filter = function(g, b) {
        return !0;
      }, m.compares = { number: function(g, b) {
        var p = g - b;
        return p > 0 ? 1 : p == 0 ? 0 : -1;
      }, string: function(g, b) {
        return g > b ? 1 : g == b ? 0 : -1;
      } }, m.prototype._compare = m.compares.string, n.exports = m;
    }, function(n, l, c) {
      function m(S) {
        var x = new p.Variable(S.targetPos);
        return x.node = S, x;
      }
      function g(S, x) {
        if (S.length > 0) {
          x = b.extend(v, x), S.forEach(function(Q, et) {
            Q.targetPos = Q.parent ? Q.parent.currentPos : Q.idealPos, Q.index = et;
          });
          for (var h = S.concat().sort(function(Q, et) {
            var yt = Q.targetPos - et.targetPos;
            if (yt !== 0) return yt;
            var _t = Q.isStub() - et.isStub();
            return _t !== 0 ? _t : Q.index - et.index;
          }).map(m), w = [], a = 1; a < h.length; a++) {
            var E = h[a - 1], k = h[a], O = void 0;
            O = E.node.isStub() && k.node.isStub() ? (E.node.width + k.node.width) / 2 + x.lineSpacing : (E.node.width + k.node.width) / 2 + x.nodeSpacing, w.push(new p.Constraint(E, k, O));
          }
          if (b.isDefined(x.minPos)) {
            var G = new p.Variable(x.minPos, 1e10), q = h[0];
            w.push(new p.Constraint(G, q, q.node.width / 2)), h.unshift(G);
          }
          if (b.isDefined(x.maxPos)) {
            var P = new p.Variable(x.maxPos, 1e10), U = b.last(h);
            w.push(new p.Constraint(U, P, U.node.width / 2)), h.push(P);
          }
          new p.Solver(h, w).solve(), h.filter(function(Q) {
            return Q.node;
          }).map(function(Q) {
            return Q.node.currentPos = Math.round(Q.position()), Q;
          });
        }
        return S;
      }
      var b = c(4), p = c(9), v = { lineSpacing: 2, nodeSpacing: 3, minPos: 0, maxPos: null };
      g.DEFAULT_OPTIONS = v, n.exports = g;
    }, function(n, l) {
      var c = {}, m = function() {
        function x(h) {
          this.scale = h, this.AB = 0, this.AD = 0, this.A2 = 0;
        }
        return x.prototype.addVariable = function(h) {
          var w = this.scale / h.scale, a = h.offset / h.scale, E = h.weight;
          this.AB += E * w * a, this.AD += E * w * h.desiredPosition, this.A2 += E * w * w;
        }, x.prototype.getPosn = function() {
          return (this.AD - this.AB) / this.A2;
        }, x;
      }();
      c.PositionStats = m;
      var g = function() {
        function x(h, w, a, E) {
          E === void 0 && (E = !1), this.left = h, this.right = w, this.gap = a, this.equality = E, this.active = !1, this.unsatisfiable = !1, this.left = h, this.right = w, this.gap = a, this.equality = E;
        }
        return x.prototype.slack = function() {
          return this.unsatisfiable ? Number.MAX_VALUE : this.right.scale * this.right.position() - this.gap - this.left.scale * this.left.position();
        }, x;
      }();
      c.Constraint = g;
      var b = function() {
        function x(h, w, a) {
          w === void 0 && (w = 1), a === void 0 && (a = 1), this.desiredPosition = h, this.weight = w, this.scale = a, this.offset = 0;
        }
        return x.prototype.dfdv = function() {
          return 2 * this.weight * (this.position() - this.desiredPosition);
        }, x.prototype.position = function() {
          return (this.block.ps.scale * this.block.posn + this.offset) / this.scale;
        }, x.prototype.visitNeighbours = function(h, w) {
          var a = function(E, k) {
            return E.active && h !== k && w(E, k);
          };
          this.cOut.forEach(function(E) {
            return a(E, E.right);
          }), this.cIn.forEach(function(E) {
            return a(E, E.left);
          });
        }, x;
      }();
      c.Variable = b;
      var p = function() {
        function x(h) {
          this.vars = [], h.offset = 0, this.ps = new m(h.scale), this.addVariable(h);
        }
        return x.prototype.addVariable = function(h) {
          h.block = this, this.vars.push(h), this.ps.addVariable(h), this.posn = this.ps.getPosn();
        }, x.prototype.updateWeightedPosition = function() {
          this.ps.AB = this.ps.AD = this.ps.A2 = 0;
          for (var h = 0, w = this.vars.length; h < w; ++h) this.ps.addVariable(this.vars[h]);
          this.posn = this.ps.getPosn();
        }, x.prototype.compute_lm = function(h, w, a) {
          var E = this, k = h.dfdv();
          return h.visitNeighbours(w, function(O, G) {
            var q = E.compute_lm(G, h, a);
            G === O.right ? (k += q * O.left.scale, O.lm = q) : (k += q * O.right.scale, O.lm = -q), a(O);
          }), k / h.scale;
        }, x.prototype.populateSplitBlock = function(h, w) {
          var a = this;
          h.visitNeighbours(w, function(E, k) {
            k.offset = h.offset + (k === E.right ? E.gap : -E.gap), a.addVariable(k), a.populateSplitBlock(k, h);
          });
        }, x.prototype.traverse = function(h, w, a, E) {
          var k = this;
          a === void 0 && (a = this.vars[0]), E === void 0 && (E = null), a.visitNeighbours(E, function(O, G) {
            w.push(h(O)), k.traverse(h, w, G, a);
          });
        }, x.prototype.findMinLM = function() {
          var h = null;
          return this.compute_lm(this.vars[0], null, function(w) {
            !w.equality && (h === null || w.lm < h.lm) && (h = w);
          }), h;
        }, x.prototype.findMinLMBetween = function(h, w) {
          this.compute_lm(h, null, function() {
          });
          var a = null;
          return this.findPath(h, null, w, function(E, k) {
            !E.equality && E.right === k && (a === null || E.lm < a.lm) && (a = E);
          }), a;
        }, x.prototype.findPath = function(h, w, a, E) {
          var k = this, O = !1;
          return h.visitNeighbours(w, function(G, q) {
            O || q !== a && !k.findPath(q, h, a, E) || (O = !0, E(G, q));
          }), O;
        }, x.prototype.isActiveDirectedPathBetween = function(h, w) {
          if (h === w) return !0;
          for (var a = h.cOut.length; a--; ) {
            var E = h.cOut[a];
            if (E.active && this.isActiveDirectedPathBetween(E.right, w)) return !0;
          }
          return !1;
        }, x.split = function(h) {
          return h.active = !1, [x.createSplitBlock(h.left), x.createSplitBlock(h.right)];
        }, x.createSplitBlock = function(h) {
          var w = new x(h);
          return w.populateSplitBlock(h, null), w;
        }, x.prototype.splitBetween = function(h, w) {
          var a = this.findMinLMBetween(h, w);
          if (a !== null) {
            var E = x.split(a);
            return { constraint: a, lb: E[0], rb: E[1] };
          }
          return null;
        }, x.prototype.mergeAcross = function(h, w, a) {
          w.active = !0;
          for (var E = 0, k = h.vars.length; E < k; ++E) {
            var O = h.vars[E];
            O.offset += a, this.addVariable(O);
          }
          this.posn = this.ps.getPosn();
        }, x.prototype.cost = function() {
          for (var h = 0, w = this.vars.length; w--; ) {
            var a = this.vars[w], E = a.position() - a.desiredPosition;
            h += E * E * a.weight;
          }
          return h;
        }, x;
      }();
      c.Block = p;
      var v = function() {
        function x(h) {
          this.vs = h;
          var w = h.length;
          for (this.list = new Array(w); w--; ) {
            var a = new p(h[w]);
            this.list[w] = a, a.blockInd = w;
          }
        }
        return x.prototype.cost = function() {
          for (var h = 0, w = this.list.length; w--; ) h += this.list[w].cost();
          return h;
        }, x.prototype.insert = function(h) {
          h.blockInd = this.list.length, this.list.push(h);
        }, x.prototype.remove = function(h) {
          var w = this.list.length - 1, a = this.list[w];
          this.list.length = w, h !== a && (this.list[h.blockInd] = a, a.blockInd = h.blockInd);
        }, x.prototype.merge = function(h) {
          var w = h.left.block, a = h.right.block, E = h.right.offset - h.left.offset - h.gap;
          w.vars.length < a.vars.length ? (a.mergeAcross(w, h, E), this.remove(w)) : (w.mergeAcross(a, h, -E), this.remove(a));
        }, x.prototype.forEach = function(h) {
          this.list.forEach(h);
        }, x.prototype.updateBlockPositions = function() {
          this.list.forEach(function(h) {
            return h.updateWeightedPosition();
          });
        }, x.prototype.split = function(h) {
          var w = this;
          this.updateBlockPositions(), this.list.forEach(function(a) {
            var E = a.findMinLM();
            E !== null && E.lm < S.LAGRANGIAN_TOLERANCE && (a = E.left.block, p.split(E).forEach(function(k) {
              return w.insert(k);
            }), w.remove(a), h.push(E));
          });
        }, x;
      }();
      c.Blocks = v;
      var S = function() {
        function x(h, w) {
          this.vs = h, this.cs = w, this.vs = h, h.forEach(function(a) {
            a.cIn = [], a.cOut = [];
          }), this.cs = w, w.forEach(function(a) {
            a.left.cOut.push(a), a.right.cIn.push(a);
          }), this.inactive = w.map(function(a) {
            return a.active = !1, a;
          }), this.bs = null;
        }
        return x.prototype.cost = function() {
          return this.bs.cost();
        }, x.prototype.setStartingPositions = function(h) {
          this.inactive = this.cs.map(function(w) {
            return w.active = !1, w;
          }), this.bs = new v(this.vs), this.bs.forEach(function(w, a) {
            return w.posn = h[a];
          });
        }, x.prototype.setDesiredPositions = function(h) {
          this.vs.forEach(function(w, a) {
            return w.desiredPosition = h[a];
          });
        }, x.prototype.mostViolated = function() {
          for (var h = Number.MAX_VALUE, w = null, a = this.inactive, E = a.length, k = E, O = 0; O < E; ++O) {
            var G = a[O];
            if (!G.unsatisfiable) {
              var q = G.slack();
              if ((G.equality || q < h) && (h = q, w = G, k = O, G.equality)) break;
            }
          }
          return k !== E && (h < x.ZERO_UPPERBOUND && !w.active || w.equality) && (a[k] = a[E - 1], a.length = E - 1), w;
        }, x.prototype.satisfy = function() {
          this.bs == null && (this.bs = new v(this.vs)), this.bs.split(this.inactive);
          for (var h = null; (h = this.mostViolated()) && (h.equality || h.slack() < x.ZERO_UPPERBOUND && !h.active); ) {
            var w = h.left.block, a = h.right.block;
            if (w !== a) this.bs.merge(h);
            else {
              if (w.isActiveDirectedPathBetween(h.right, h.left)) {
                h.unsatisfiable = !0;
                continue;
              }
              var E = w.splitBetween(h.left, h.right);
              if (E === null) {
                h.unsatisfiable = !0;
                continue;
              }
              this.bs.insert(E.lb), this.bs.insert(E.rb), this.bs.remove(w), this.inactive.push(E.constraint), h.slack() >= 0 ? this.inactive.push(h) : this.bs.merge(h);
            }
          }
        }, x.prototype.solve = function() {
          this.satisfy();
          for (var h = Number.MAX_VALUE, w = this.bs.cost(); Math.abs(h - w) > 1e-4; ) this.satisfy(), h = w, w = this.bs.cost();
          return w;
        }, x.LAGRANGIAN_TOLERANCE = -1e-4, x.ZERO_UPPERBOUND = -1e-10, x;
      }();
      c.Solver = S, n.exports = c;
    }, function(n, l, c) {
      function m(h) {
        this.options = x.extend({ layerGap: 60, nodeHeight: 10, direction: "down" }, h);
      }
      function g(h) {
        return "L " + h.join(" ");
      }
      function b(h) {
        return "M " + h.join(" ");
      }
      function p(h, w, a) {
        return "C " + h.join(" ") + " " + w.join(" ") + " " + a.join(" ");
      }
      function v(h, w) {
        var a = (h[1] + w[1]) / 2;
        return p([h[0], a], [w[0], a], w);
      }
      function S(h, w) {
        var a = (h[0] + w[0]) / 2;
        return p([a, h[1]], [a, w[1]], w);
      }
      var x = c(4);
      m.lineTo = g, m.moveTo = b, m.curveTo = p, m.vCurveBetween = v, m.hCurveBetween = S, m.prototype.getWaypoints = function(h) {
        var w = this.options, a = w.direction, E = h.getPathFromRoot(), k = w.nodeHeight + w.layerGap;
        return a === "left" ? [[[0, E[0].idealPos]]].concat(E.map(function(O, G) {
          var q = k * (G + 1) * -1;
          return [[q + w.nodeHeight, O.currentPos], [q, O.currentPos]];
        })) : a === "right" ? [[[0, E[0].idealPos]]].concat(E.map(function(O, G) {
          var q = k * (G + 1);
          return [[q - w.nodeHeight, O.currentPos], [q, O.currentPos]];
        })) : a === "up" ? [[[E[0].idealPos, 0]]].concat(E.map(function(O, G) {
          var q = k * (G + 1) * -1;
          return [[O.currentPos, q + w.nodeHeight], [O.currentPos, q]];
        })) : [[[E[0].idealPos, 0]]].concat(E.map(function(O, G) {
          var q = k * (G + 1);
          return [[O.currentPos, q - w.nodeHeight], [O.currentPos, q]];
        }));
      }, m.prototype.layout = function(h) {
        var w = this.options, a = w.layerGap + w.nodeHeight;
        switch (w.direction) {
          case "left":
            h.forEach(function(E) {
              var k = E.getLayerIndex() * a + w.layerGap;
              E.x = -k - w.nodeHeight, E.y = E.currentPos, E.dx = w.nodeHeight, E.dy = E.width;
            });
            break;
          case "right":
            h.forEach(function(E) {
              var k = E.getLayerIndex() * a + w.layerGap;
              E.x = k, E.y = E.currentPos, E.dx = w.nodeHeight, E.dy = E.width;
            });
            break;
          case "up":
            h.forEach(function(E) {
              var k = E.getLayerIndex() * a + w.layerGap;
              E.x = E.currentPos, E.y = -k - w.nodeHeight, E.dx = E.width, E.dy = w.nodeHeight;
            });
            break;
          default:
          case "down":
            h.forEach(function(E) {
              var k = E.getLayerIndex() * a + w.layerGap;
              E.x = E.currentPos, E.y = k, E.dx = E.width, E.dy = w.nodeHeight;
            });
        }
        return h;
      }, m.prototype.generatePath = function(h) {
        var w = this.options, a = w.direction, E = this.getWaypoints(h, a), k = [b(E[0][0])];
        return a === "left" || a === "right" ? E.reduce(function(O, G, q) {
          return k.push(S(O[O.length - 1], G[0])), q < E.length - 1 && k.push(g(G[1])), G;
        }) : E.reduce(function(O, G, q) {
          return k.push(v(O[O.length - 1], G[0])), q < E.length - 1 && k.push(g(G[1])), G;
        }), k.join(" ");
      }, n.exports = m;
    }]);
  });
})(Hd);
var Wd = Hd.exports;
const $d = /* @__PURE__ */ Js(Wd), ZC = /* @__PURE__ */ Fh({
  __proto__: null,
  default: $d
}, [Wd]);
function JC(e) {
  return e.slice().sort(function(o, n) {
    return o - n;
  });
}
function Ih(e, o) {
  for (var n = [], l = 0; l < e; l++) {
    for (var c = [], m = 0; m < o; m++)
      c.push(0);
    n.push(c);
  }
  return n;
}
function tA(e) {
  for (var o = 0, n, l = 0; l < e.length; l++)
    (l === 0 || e[l] !== n) && (n = e[l], o++);
  return o;
}
function Wl(e, o, n, l) {
  var c;
  if (e > 0) {
    var m = (n[o] - n[e - 1]) / (o - e + 1);
    c = l[o] - l[e - 1] - (o - e + 1) * m * m;
  } else
    c = l[o] - n[o] * n[o] / (o + 1);
  return c < 0 ? 0 : c;
}
function $l(e, o, n, l, c, m, g) {
  if (!(e > o)) {
    var b = Math.floor((e + o) / 2);
    l[n][b] = l[n - 1][b - 1], c[n][b] = b;
    var p = n;
    e > n && (p = Math.max(p, c[n][e - 1] || 0)), p = Math.max(p, c[n - 1][b] || 0);
    var v = b - 1;
    o < l[0].length - 1 && (v = Math.min(v, c[n][o + 1] || 0));
    for (var S, x, h, w, a = v; a >= p && (S = Wl(a, b, m, g), !(S + l[n - 1][p - 1] >= l[n][b])); --a)
      x = Wl(p, b, m, g), h = x + l[n - 1][p - 1], h < l[n][b] && (l[n][b] = h, c[n][b] = p), p++, w = S + l[n - 1][a - 1], w < l[n][b] && (l[n][b] = w, c[n][b] = a);
    $l(
      e,
      b - 1,
      n,
      l,
      c,
      m,
      g
    ), $l(
      b + 1,
      o,
      n,
      l,
      c,
      m,
      g
    );
  }
}
function eA(e, o, n) {
  for (var l = o[0].length, c = e[Math.floor(l / 2)], m = [], g = [], b = 0, p = void 0; b < l; ++b)
    p = e[b] - c, b === 0 ? (m.push(p), g.push(p * p)) : (m.push(m[b - 1] + p), g.push(
      g[b - 1] + p * p
    )), o[0][b] = Wl(0, b, m, g), n[0][b] = 0;
  for (var v, S = 1; S < o.length; ++S)
    S < o.length - 1 ? v = S : v = l - 1, $l(
      v,
      l - 1,
      S,
      o,
      n,
      m,
      g
    );
}
function nA(e, o) {
  if (o > e.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var n = JC(e), l = tA(n);
  if (l === 1)
    return [n];
  var c = Ih(o, n.length), m = Ih(o, n.length);
  eA(n, c, m);
  for (var g = [], b = m[0].length - 1, p = m.length - 1; p >= 0; p--) {
    var v = m[p][b];
    g[p] = n.slice(v, b + 1), p > 0 && (b = v - 1);
  }
  return g;
}
const Bh = function(e) {
  var o = {}, n = { nClusters: 6 }, l = we.merge({}, n, e);
  return o.createClustersFromGenes = function(c) {
    var m = [];
    if (c.length < 1)
      return m;
    var g = Math.min(l.nClusters, c.length), b = c.map(function(x) {
      return x.midpoint;
    });
    let p = nA(b, g);
    for (var v = [], S = 0; S < p.length; S++)
      v.push([]);
    return c.map(function(x) {
      let h = p.findIndex(function(w) {
        return w.includes(x.midpoint);
      });
      v[h].push(x);
    }), v.map(function(x) {
      if (x.length < 2)
        m.push.apply(m, x);
      else {
        var h = x.reduce(function(E, k) {
          return E + k.midpoint;
        }, 0) / x.length, w = x.reduce(function(E, k) {
          return E + k.id.toString();
        }, ""), a = {
          genesList: x,
          midpoint: h,
          type: "geneslist",
          id: w.toString()
        };
        m.push(a);
      }
    }), m;
  }, o.nClusters = function(c) {
    return arguments.length ? (l.nClusters = c, o) : l.nClusters;
  }, o;
};
var Sl = $d || ZC;
const rA = function(e) {
  var o = {
    longestChromosome: 100,
    layout: {
      width: 10,
      //not used
      height: 100,
      x: 0,
      //not used
      y: 0
      //not used
    },
    autoLabels: !0,
    manualLabels: !0,
    annotationMarkerSize: 5,
    annotationLabelSize: 5,
    doCluster: !0,
    nClusters: 6,
    nGenesToDisplay: 1e3,
    maxAnnotationLayers: 3,
    displayedFontSize: 13,
    scale: 1
  }, n = we.merge({}, o, e), l = function() {
    return Ii().range([0, n.layout.height]).domain([0, n.longestChromosome]);
  }, c = function(x, h, w, a) {
    var E = 4, k = h / 3, O = k / w * E, G = O * x > a;
    if (G)
      return 2;
    var q = h * (0.1 + 0.1 / x);
    return k = h - q, O = k / w * E, G = O * x > a, G ? 1 : 0;
  }, m = function(x, h, w, a, E) {
    var k = 3.5;
    let O = {};
    return O.scale = x, O.availableHeight = E, O.lineSpacing = 1, O.layerGap = h * (0.1 + 0.1 / x), O.spaceForLabel = h - O.layerGap, O.setFontSize = Math.min(
      O.spaceForLabel / w * k,
      a / n.scale
    ), O.nodeSpacing = O.setFontSize, O.nLabels = 0.4 * E / (O.nodeSpacing + O.lineSpacing), O.density = 1, O;
  }, g = function(x, h, w, a, E) {
    var k = 3.5, O = {};
    return O.scale = x, O.availableHeight = E, O.lineSpacing = 1, O.setFontSize = Math.min(
      h / 3 / w * k,
      a / n.scale
    ), O.nodeSpacing = O.setFontSize, O.spaceForLabel = 1.3 * w * O.setFontSize / k, O.layerGap = Math.min(5 * O.setFontSize, h / 3), O.density = 0.9, O.nLabels = 0.6 * E / (O.nodeSpacing + O.lineSpacing), O;
  }, b = function(x, h, w, a) {
    a.forEach(function(k) {
      k.displayed = !0, k.fontSize = w.setFontSize;
    });
    var E = a.map(function(k) {
      return new Sl.Node(h(k.midpoint), w.setFontSize, k);
    });
    try {
      x.nodes(E).compute();
    } catch (k) {
      if (k instanceof RangeError)
        return null;
      throw k;
    }
    return E;
  }, p = function(x) {
    let h = x.annotations.allGenes.filter(function(J) {
      return J.globalIndex < n.nGenesToDisplay;
    });
    var w = n.layout.width, a = n.layout.height * Math.min(1, 0.2 + x.length / n.longestChromosome), E = h.reduce(function(J, lt) {
      return Math.max(J, lt.label.length);
    }, 0), k = 1.1 * n.displayedFontSize, O = 0.9 * n.displayedFontSize, G = c(
      n.scale,
      w,
      E,
      k
    ), q;
    G == 2 ? q = g(
      n.scale,
      w,
      E,
      O,
      a
    ) : G == 1 ? q = m(
      n.scale,
      w,
      E,
      O,
      a
    ) : G == 0 && (q = m(
      n.scale,
      w,
      E,
      O,
      a
    ), q.nLabels = 0);
    var P = l();
    let U = {
      nodeSpacing: q.nodeSpacing,
      lineSpacing: q.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: q.availableHeight,
      density: q.density
    };
    var Q = new Sl.Force(U);
    h.forEach(function(J) {
      J.displayed = !1;
    });
    var et = n.manualLabels ? new Set(
      h.filter(function(J) {
        return J.visible;
      })
    ) : /* @__PURE__ */ new Set();
    n.autoLabels && h.slice(0, q.nLabels).filter(function(J) {
      return !J.hidden;
    }).forEach(function(J) {
      et.add(J);
    });
    var yt = Array.from(et), _t = b(Q, P, q, yt);
    !_t == 0 && (Q.options({ algorithm: "simple" }), _t = b(Q, P, q, yt));
    var bt;
    if (_t && _t.length > 0) {
      var wt = _t.map(function(J) {
        return J.getLayerIndex();
      });
      bt = Math.max.apply(null, wt);
    }
    if (!_t || bt > 3) {
      var jt = Bh().nClusters(Math.max(q.nLabels, 1));
      try {
        var Bt = jt.createClustersFromGenes(yt);
      } catch {
        Bt = [];
      }
      _t = b(Q, P, q, Bt);
    }
    let Y = {
      direction: "right",
      layerGap: q.layerGap,
      nodeHeight: q.spaceForLabel
    };
    var pt = new Sl.Renderer(Y);
    return pt.layout(_t), _t.forEach(function(J) {
      J.data.path = pt.generatePath(J);
    }), n.manualLabels || Ll(".gene-annotation").remove(), _t;
  }, v = function(x) {
    var h = Bh(), w = x.annotations.genes, a = h.createClustersFromGenes(w);
    return a;
  };
  let S = {};
  return S.layoutChromosome = function(x) {
    x.layout.annotationNodes = p(x) || x.layout.annotationNodes;
  }, S.computeChromosomeClusters = function(x) {
    x.layout.annotationClusters = v(x), x.layout.annotationDisplayClusters = x.layout.annotationClusters.slice();
  }, S.expandAllChromosomeClusters = function(x) {
    x.layout.annotationDisplayClusters = x.annotations.genes;
  }, S.collapseAllChromosomeClusters = function(x) {
    x.layout.annotationDisplayClusters = x.layout.annotationClusters.slice();
  }, S.expandAChromosomeCluster = function(x, h) {
    x.layout.annotationDisplayClusters = x.layout.annotationClusters.slice(), h.genesList.forEach(function(a) {
      x.layout.annotationDisplayClusters.push(a);
    });
    var w = x.layout.annotationDisplayClusters.indexOf(h);
    x.layout.annotationDisplayClusters.splice(w, 1);
  }, S.computeNormalisedGeneScores = function(x) {
    var h = x.reduce(function(k, O) {
      return k.concat(
        O.annotations.genes.filter(function(G) {
          return G.displayed;
        })
      );
    }, []), w = h.every(function(k) {
      return k.score;
    });
    if (w) {
      var a = h.reduce(function(k, O) {
        return Math.max(k, O.score);
      }, 0), E = h.reduce(function(k, O) {
        return Math.min(k, O.score);
      }, 0);
      h.forEach(function(k) {
        k.normedScore = 0.5 * (k.score - E) / (a - E) + 0.5;
      });
    } else
      h.forEach(function(k) {
        k.normedScore = null;
      });
  }, S;
}, iA = function(e) {
  var o = {
    longestChromosome: 100,
    layout: {
      width: 10,
      //not used
      height: 100,
      x: 0,
      //not used
      y: 0
      //not used
    },
    doCluster: !0,
    nClusters: 6,
    scale: 1,
    nGenesToDisplay: 1e3
  }, n = we.merge({}, o, e), l = function() {
    return Ii().range([0, n.layout.height]).domain([0, n.longestChromosome]);
  }, c = function(p) {
    if (p.type == "gene") {
      var v = p;
      return {
        start: v.start,
        end: v.end,
        midpoint: v.midpoint,
        color: v.color,
        data: v
      };
    } else if (p.type == "geneslist") {
      let S = p.genesList.reduce(function(w, a) {
        return Math.max(w, a.end);
      }, 0);
      return {
        start: p.genesList.reduce(function(w, a) {
          return Math.min(w, a.start);
        }, 1 / 0),
        end: S,
        midpoint: p.midpoint,
        color: "#0000FF",
        data: p
      };
    }
  }, m = function(p) {
    l();
    var v = p.layout.geneBandDisplayClusters, S = v.map(c);
    return S;
  }, g = function(p) {
    var v = p.annotations.allGenes.filter(function(E) {
      return E.globalIndex < n.nGenesToDisplay;
    });
    v.sort(function(E, k) {
      return E.midpoint - k.midpoint;
    });
    for (var S = [], x = 0; x < v.length; ) {
      let E = x;
      for (; E < v.length && v[x].midpoint == v[E].midpoint; )
        E++;
      if (E - x == 1)
        S.push(v[x]), x++;
      else {
        var h = v.slice(x, E), w = h.reduce(function(O, G) {
          return O + G.id.toString();
        }, ""), a = {
          genesList: h,
          midpoint: h[0].midpoint,
          type: "geneslist",
          id: w
        };
        S.push(a), x = E;
      }
    }
    return S.sort(function(E, k) {
      return E.midpoint < k.midpoint;
    }), S;
  };
  let b = {};
  return b.layoutChromosome = function(p) {
    p.layout.geneBandNodes = m(p);
  }, b.computeChromosomeClusters = function(p) {
    let v = p.layout;
    v.geneBandClusters = g(p), v.geneBandDisplayClusters = v.geneBandClusters.slice();
  }, b.expandAllChromosomeClusters = function(p) {
    let v = p.layout;
    v.geneBandDisplayClusters = p.annotations.allGenes;
  }, b.collapseAllChromosomeClusters = function(p) {
    let v = p.layout;
    v.geneBandDisplayClusters = v.geneBandClusters.slice();
  }, b.expandAChromosomeCluster = function(p, v) {
    let S = p.layout;
    S.geneBandDisplayClusters = S.geneBandClusters.slice(), v.genesList.forEach(function(h) {
      S.geneBandDisplayClusters.push(h);
    });
    var x = S.geneBandDisplayClusters.indexOf(v);
    S.geneBandDisplayClusters.splice(x, 1);
  }, b;
}, oA = function(e) {
  var o = {
    onNetworkBtnClick: Xt.noop,
    onFitBtnClick: Xt.noop,
    onTagBtnClick: Xt.noop,
    onLabelBtnClick: Xt.noop,
    onQtlBtnClick: Xt.noop,
    onResetBtnClick: Xt.noop,
    onSetNumberPerRowClick: Xt.noop,
    onExportBtnClick: Xt.noop,
    onExportAllBtnClick: Xt.noop,
    onExpandBtnClick: Xt.noop,
    maxSnpPValueProperty: Xt.noop,
    nGenesToDisplayProperty: Xt.noop,
    annotationLabelSizeProperty: Xt.noop,
    initialMaxGenes: 200,
    initialNPerRow: 10
  }, n = we.merge({}, o, e), l, c = function() {
    Xt(this).hasClass("disabled") || n.onNetworkBtnClick();
  }, m = function() {
    Xt(this).hasClass("disabled") || n.onTagBtnClick();
  }, g = function() {
    Xt(this).hasClass("disabled") || n.onFitBtnClick();
  }, b = function() {
    if (Xt(this).hasClass("disabled"))
      return;
    const h = new Event("change"), w = document.getElementById("select-label-btn");
    w.value = "auto", w.dispatchEvent(h);
    const a = document.getElementById("select-ngenes-dropdown");
    a.value = "50", a.dispatchEvent(h), n.onResetBtnClick();
  }, p = function() {
    n.onExpandBtnClick();
  }, v = function(h, w, a, E, k) {
    var O = "select-" + w, G = h.selectAll("select").data([null]);
    G.enter().append("select").attr("id", O).attr("name", O).attr("class", "menu-dropdown");
    const q = document.getElementById(O);
    if (!q) {
      console.log("Failed to find the select element.");
      return;
    }
    q.innerHTML = "", a.forEach(function(P) {
      var U = document.createElement("option");
      U.value = P[1], U.textContent = P[0], P[1] === k && (U.selected = !0), q.appendChild(U);
    }), q.addEventListener("change", function() {
      var P = q.options[q.selectedIndex], U = P.value;
      E(U);
    });
  }, S = function() {
    var h = Dt(l).selectAll(".genemap-menu").data([null]);
    h.enter().append("div").classed("genemap-menu", !0);
    var w = h.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), a = w.selectAll("span").data(function(bt, wt) {
      return bt;
    });
    a.enter().append("span"), w.selectAll("span").attr("class", function(bt) {
      return bt;
    }), h.select(".network-btn").attr("title", "Launch network view").on("click", c), h.select(".tag-btn").on("click", m);
    var E = h.select(".label-btn");
    v(
      E,
      "label-btn",
      [
        ["Auto labels", "auto"],
        ["Checked labels", "show"],
        ["No labels", "hide"]
      ],
      n.onLabelBtnClick,
      "Auto labels"
    ), h.select(".fit-btn").attr("title", "Reset pan and zoom").on("click", g), h.select(".reset-btn").attr("title", "Reset selections").on("click", b);
    var k = h.select(".ngenes-dropdown");
    k.text(""), v(
      k,
      "ngenes-dropdown",
      [
        ["50 genes", 50],
        ["100 genes", 100],
        ["200 genes", 200],
        ["500 genes", 500],
        ["1000 genes", 1e3]
      ],
      n.nGenesToDisplayProperty,
      n.nGenesToDisplayProperty() + " genes"
    ), n.nGenesToDisplayProperty.addListener(function(bt) {
      Xt("#select-ngenes-dropdown").selectpicker("val", [
        bt + " genes",
        bt
      ]);
    }), h.select(".export-btn").attr("title", "Export to PNG").on("click", n.onExportBtnClick), h.select(".expand-btn").attr("title", "Toggle full screen").on("click", p);
    var O = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    h.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(O, "_blank");
    });
    var G = Dt(l).selectAll(".genemap-advanced-menu").data([null]), q = G.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    q.enter().append("div").attr("class", function(bt) {
      return bt;
    });
    var P = G.select(".qtl-btn");
    v(
      P,
      "qtl-btn",
      [
        ["All QTLs", "all"],
        ["Checked QTLs", "selected"],
        ["No QTLs", "none"]
      ],
      n.onQtlBtnClick,
      "All QTLs"
    );
    var U = G.select(".max-snp-pvalue").selectAll("form").data([""]).enter(), Q = U.append("form").classed("bootstrap", !0).attr("id", "snp-pvalue-form").attr("class", "bootstrap form-inline");
    Q.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), Q.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", n.maxSnpPValueProperty()), Q.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), Xt("#snp-pvalue-form").submit(function(bt) {
      n.maxSnpPValueProperty(Xt("#max-snp-pvalue-input").val()), bt.preventDefault();
    }), n.maxSnpPValueProperty.addListener(function(bt) {
      Xt("#max-snp-pvalue-input").val(bt);
    });
    var et = G.select(".nperrow-spinner"), yt = et.selectAll("input").data(["nPerRowSpinner"]).enter();
    yt.append("span").append("label").classed("bootstrap", !0).attr("for", (bt) => bt).html("Num per row:&nbsp;"), yt.append("span").append("input").attr("id", (bt) => bt).attr("type", "text").attr("value", n.initialNPerRow).attr("name", (bt) => bt), Dt(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), Xt("#nPerRowSpinner").on("change", function(bt) {
      n.onSetNumberPerRowClick(Xt("#nPerRowSpinner").val());
    }), G.select(".export-all-btn").attr("title", "export all to PNG").on("click", n.onExportAllBtnClick), G.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(bt) {
      return bt;
    }), G.select(".labelsize-label").classed("bootstrap", !0), G.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var _t = G.select(".labelsize-dropdown");
    _t.text(""), v(
      _t,
      "labelsize-dropdown",
      [
        ["10", 10],
        ["15", 15],
        ["20", 20],
        ["25", 25]
      ],
      n.annotationLabelSizeProperty,
      n.annotationLabelSizeProperty()
    ), n.annotationLabelSizeProperty.addListener(function(bt) {
      Xt("#select-labelsize-dropdown").selectpicker("val", [
        bt,
        bt
      ]);
    });
  };
  function x(h) {
    h.each(function(w) {
      var a = this;
      l = a, S();
    });
  }
  return x.onNetworkBtnClick = function(h) {
    return arguments.length ? (n.onNetworkBtnClick = h, x) : n.onNetworkBtnClick;
  }, x.onTagBtnClick = function(h) {
    return arguments.length ? (n.onTagBtnClick = h, x) : n.onTagBtnClick;
  }, x.onLabelBtnClick = function(h) {
    return arguments.length ? (n.onLabelBtnClick = h, x) : n.onLabelBtnClick;
  }, x.onQtlBtnClick = function(h) {
    return arguments.length ? (n.onQtlBtnClick = h, x) : n.onQtlBtnClick;
  }, x.onFitBtnClick = function(h) {
    return arguments.length ? (n.onFitBtnClick = h, x) : n.onFitBtnClick;
  }, x.onResetBtnClick = function(h) {
    return arguments.length ? (n.onResetBtnClick = h, x) : n.onResetBtnClick;
  }, x.onSetNumberPerRowClick = function(h) {
    return arguments.length ? (n.onSetNumberPerRowClick = h, x) : n.onSetNumberPerRowClick;
  }, x.initialMaxGenes = function(h) {
    return arguments.length ? (n.initialMaxGenes = h, x) : n.initialMaxGenes;
  }, x.initialNPerRow = function(h) {
    return arguments.length ? (n.initialNPerRow = h, x) : n.initialNPerRow;
  }, x.onExportBtnClick = function(h) {
    return arguments.length ? (n.onExportBtnClick = h, x) : n.onExportBtnClick;
  }, x.onExportAllBtnClick = function(h) {
    return arguments.length ? (n.onExportAllBtnClick = h, x) : n.onExportAllBtnClick;
  }, x.onExpandBtnClick = function(h) {
    return arguments.length ? (n.onExpandBtnClick = h, x) : n.onExpandBtnClick;
  }, x.maxSnpPValueProperty = function(h) {
    return arguments.length ? (n.maxSnpPValueProperty = h, x) : n.maxSnpPValueProperty;
  }, x.nGenesToDisplayProperty = function(h) {
    return arguments.length ? (n.nGenesToDisplayProperty = h, x) : n.nGenesToDisplayProperty;
  }, x.annotationLabelSizeProperty = function(h) {
    return arguments.length ? (n.annotationLabelSizeProperty = h, x) : n.annotationLabelSizeProperty;
  }, x.setTabButtonState = function(h) {
    var w = Dt(l).select(".tag-btn");
    h === "show" ? (w.classed("show-label", !0), w.classed("hide-label", !1), w.classed("auto-label", !1), w.classed("manual-label", !1), w.attr("title", "Show Labels")) : h === "hide" ? (w.classed("show-label", !1), w.classed("hide-label", !0), w.classed("auto-label", !1), w.classed("manual-label", !1), w.attr("title", "Hide Labels")) : h === "manual" ? (w.classed("show-label", !1), w.classed("hide-label", !1), w.classed("auto-label", !1), w.classed("manual-label", !0), w.attr("title", "Manual Labels")) : (w.classed("show-label", !1), w.classed("hide-label", !1), w.classed("auto-label", !0), w.classed("manual-label", !1), w.attr("title", "Automatic Labels"));
  }, x.getTagButtonState = function() {
    var h = Dt(l).select(".tag-btn");
    return h.classed("show-label") ? "show" : h.classed("hide-label") ? "hide" : h.classed("auto-label") ? "auto" : "manual";
  }, x.setFitButtonEnabled = function(h) {
    Dt(l).select(".fit-btn").classed("disabled", !h);
  }, x.setNetworkButtonEnabled = function(h) {
    Dt(l).select(".network-btn").classed("disabled", !h);
  }, x;
};
class aA {
  constructor(o, n, l) {
    this.distance = o, this.linkage = n, this.threshold = l ?? 1 / 0;
  }
  cluster(o, n, l) {
    this.clusters = [], this.dists = [], this.mins = [], this.index = [];
    for (let g = 0; g < o.length; g++) {
      const b = {
        value: o[g],
        key: g,
        index: g,
        size: 1
      };
      this.clusters[g] = b, this.index[g] = b, this.dists[g] = [], this.mins[g] = 0;
    }
    for (let g = 0; g < this.clusters.length; g++)
      for (let b = 0; b <= g; b++) {
        const p = g === b ? 1 / 0 : this.distance(this.clusters[g].value, this.clusters[b].value);
        this.dists[g][b] = p, this.dists[b][g] = p, p < this.dists[g][this.mins[g]] && (this.mins[g] = b);
      }
    let c = this.mergeClosest(), m = 0;
    for (; c; )
      l && m++ % n === 0 && l(this.clusters), c = this.mergeClosest();
    return this.clusters.forEach((g) => {
      delete g.key, delete g.index;
    }), this.clusters;
  }
  mergeClosest() {
    let o = 0, n = 1 / 0;
    for (let g = 0; g < this.clusters.length; g++) {
      const b = this.clusters[g].key, p = this.dists[b][this.mins[b]];
      p < n && (o = b, n = p);
    }
    if (n >= this.threshold)
      return !1;
    const l = this.index[o], c = this.index[this.mins[o]], m = {
      left: l,
      right: c,
      key: l.key,
      size: l.size + c.size
    };
    this.clusters[l.index] = m, this.clusters.splice(c.index, 1), this.index[l.key] = m;
    for (let g = 0; g < this.clusters.length; g++) {
      const b = this.clusters[g];
      let p;
      l.key === b.key ? p = 1 / 0 : this.linkage === "single" ? (p = this.dists[l.key][b.key], this.dists[l.key][b.key] > this.dists[c.key][b.key] && (p = this.dists[c.key][b.key])) : this.linkage === "complete" ? (p = this.dists[l.key][b.key], this.dists[l.key][b.key] < this.dists[c.key][b.key] && (p = this.dists[c.key][b.key])) : this.linkage === "average" ? p = (this.dists[l.key][b.key] * l.size + this.dists[c.key][b.key] * c.size) / (l.size + c.size) : p = this.distance(b.value, l.value), this.dists[l.key][b.key] = this.dists[b.key][l.key] = p;
    }
    for (let g = 0; g < this.clusters.length; g++) {
      const b = this.clusters[g].key;
      if (this.mins[b] === l.key || this.mins[b] === c.key) {
        let p = b;
        for (let v = 0; v < this.clusters.length; v++) {
          const S = this.clusters[v].key;
          this.dists[b][S] < this.dists[b][p] && (p = S);
        }
        this.mins[b] = p;
      }
      this.clusters[g].index = g;
    }
    return delete l.key, delete c.key, delete l.index, delete c.index, !0;
  }
}
function sA(e, o, n, l, c, m) {
  return n = n || "average", new aA(
    o,
    n,
    l
  ).cluster(e, c, m);
}
const uA = function() {
  var e = {};
  return e.positionAnnotations = function(o, n, l, c, m, g) {
    for (var b = c, p = g, v = m, S = function(U, Q) {
      return b(U) < p(Q) && b(Q) < p(U);
    }, x = o.sort(function(U, Q) {
      return v(U) - v(Q);
    }), h = [], w = 0; w < x.length; w++) {
      for (var a = o[w], E = [], k = 0; k < h.length; k++) {
        var O = x[h[k]];
        S(a, O) || E.push(h[k]);
      }
      var G = _.difference(h, E), q = G.map(function(U) {
        return n(x[U]);
      }), P = 0;
      for (P = 1; P < q.length + 1 && q.indexOf(P) !== -1; P++)
        ;
      l(a, P), h.push(w);
    }
    return x;
  }, e.sortQTLAnnotations = function(o) {
    return e.positionAnnotations(
      o,
      function(n) {
        return n.position;
      },
      function(n, l) {
        n.position = l;
      },
      function(n) {
        return n.start;
      },
      function(n) {
        return n.midpoint;
      },
      function(n) {
        return n.end;
      }
    );
  }, e.sortQTLLabels = function(o, n, l) {
    var c = o, m = 0.6, g = m * l;
    return e.positionAnnotations(
      c,
      function(b) {
        return b.labelPosition;
      },
      function(b, p) {
        b.labelPosition = p;
      },
      function(b) {
        return n(b.midpoint) - g * b.screenLabel.length / 2;
      },
      function(b) {
        return b.midpoint;
      },
      function(b) {
        return n(b.midpoint) + g * b.screenLabel.length / 2;
      }
    );
  }, e.sortQTLAnnotationsWithLabels = function(o, n, l) {
    var c = o;
    return e.positionAnnotations(
      c,
      function(m) {
        return m.comboPosition;
      },
      function(m, g) {
        m.comboPosition = g;
      },
      function(m) {
        return Math.min(
          n(m.midpoint) - m.label.length * l / 2,
          m.start
        );
      },
      function(m) {
        return m.midpoint;
      },
      function(m) {
        return Math.max(
          n(m.midpoint) + m.label.length * l / 2,
          m.end
        );
      }
    );
  }, e;
}, lA = function(e) {
  var o = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, n = we.merge({}, o, e), l = uA(), c = function() {
    return Ii().range([0, n.layout.height]).domain([0, n.longestChromosome]);
  }, m = function(a) {
    return a.map(function(E) {
      var k = h(E), O = k.reduce(function(Q, et) {
        return Math.min(Q, et.start);
      }, 1 / 0), G = k.reduce(function(Q, et) {
        return Math.max(Q, et.end);
      }, 0), q = k.reduce(function(Q, et) {
        return Q + (Q ? "|" : "") + et.start + "-" + et.end;
      }, ""), P = (O + G) / 2;
      let U;
      return k.length == 1 ? (U = k[0], U.type = "qtl", U.index = E.index, U.parentIndex = E.parentIndex) : U = {
        cluster: E,
        index: E.index,
        parentIndex: E.parentIndex,
        qtlList: k,
        color: k[0].color,
        count: k.length,
        start: O,
        end: G,
        midpoint: P,
        chromosome: k[0].chromosome,
        type: "qtllist",
        id: q
      }, U;
    });
  }, g = function(a) {
    var E = [];
    if (n.showAllQTLs) {
      a.layout.qtlDisplayClusters = a.layout.qtlClusters.slice();
      for (var k = a.layout.qtlDisplayClusters, O = Math.ceil(Math.floor(n.scale - 0.1) / 2); O--; )
        k = x(k);
      for (var G = k.length; ; ) {
        E = m(k), E = l.sortQTLAnnotations(E);
        var q = E.reduce(function(P, U) {
          return Math.max(P, U.position);
        }, 0);
        if (q < 2) {
          if (k = x(k), G == k.length)
            break;
          G = k.length;
        } else
          break;
      }
    } else n.showSelectedQTLs && (a.layout.qtlDisplayClusters = a.annotations.qtls.filter(
      function(P) {
        return P.selected;
      }
    ), k = a.layout.qtlDisplayClusters, E = k.map(function(P) {
      let U = P;
      return U.type = "qtl", U;
    }));
    return E;
  }, b = function(a) {
    var E = we.groupBy(a, "position");
    return we.forOwn(E, function(k) {
      var O = 14 / n.scale, G = c();
      k = l.sortQTLLabels(k, G, O), k.forEach(function(q) {
        q.labelPosition > 1 ? q.displayLabel = !1 : (q.displayLabel = !0, q.labelPosition = q.position + 0.4);
      });
    }), a;
  }, p = function(a) {
    var E = g(a);
    E.forEach(function(et) {
      et.displayLabel = !1;
    });
    var k = E.filter(function(et) {
      return et.type == "qtl";
    });
    if (n.showAutoQTLLabels) {
      E = l.sortQTLAnnotations(E);
      var O = E.reduce(function(et, yt) {
        return Math.max(et, yt.position);
      }, 0);
      k.forEach(function(et) {
        et.label.length > 15 ? et.screenLabel = et.label.substring(0, 12) + "..." : et.screenLabel = et.label;
      });
      var G = 14 / n.scale, q = G > 0.6 * n.layout.chromosomeWidth, P = O > 3;
      !P && !q ? (b(k), k.forEach(function(et) {
        et.fontSize = G;
      })) : k.forEach(function(et) {
        et.displayLabel = !1;
      });
    }
    if (n.showSelectedQTLLabels && !n.showAutoQTLLabels) {
      var U = E.filter(function(et) {
        return et.selected;
      });
      G = 14 / n.scale;
      var Q = 0.3 * n.layout.chromosomeWidth;
      U.forEach(function(et) {
        et.displayLabel = !0, et.screenLabel = et.label, et.fontSize = Math.min(G, 2 * Q);
      }), U = l.sortQTLAnnotationsWithLabels(
        U,
        c(),
        n.annotationLabelSize
      ), U.forEach(function(et) {
        et.position = et.comboPosition, et.labelPosition = et.comboPosition + 0.4;
      });
    }
    return E;
  }, v = function(a, E) {
    if (a.index = E.index, E.index = E.index + 1, a.value)
      a.unit = !0, a.start = a.value.start, a.end = a.value.end;
    else {
      var k = a.left, O = a.right;
      k.parentIndex = a.index, O.parentIndex = a.index, v(k, E), v(O, E), a.unit = k.unit && O.unit && k.start == O.start && k.end == O.end, a.start = Math.min(a.left.start, a.right.start), a.end = Math.max(a.left.end, a.right.end);
    }
  }, S = function(a) {
    var E = sA(
      a.annotations.qtls,
      function(O, G) {
        if (O.end == G.end && O.start == G.start)
          return 0;
        var q = Math.min(O.end, G.end) - Math.max(O.start, G.start), P = O.end - O.start, U = G.end - G.start, Q = q, et = Math.abs(P - U);
        return Math.max(0.1, et - Q);
      },
      "single",
      null
    ), k = { index: 0 };
    return E.forEach(function(O) {
      v(O, k);
    }), E;
  }, x = function(a) {
    var E = [];
    return a.forEach(function(k) {
      if (k.value || k.unit)
        E.push(k);
      else {
        var O = k.left, G = k.right;
        E.push(O), E.push(G);
      }
    }), E;
  }, h = function(a) {
    return a.size == 1 ? [a.value] : h(a.left).concat(h(a.right));
  };
  let w = {};
  return w.layoutChromosome = function(a) {
    a.layout.qtlNodes = p(a) || a.layout.qtlNodes;
  }, w.computeChromosomeClusters = function(a) {
    a.layout.qtlClusters = S(a);
  }, w;
}, fA = Hh || G0;
let si = {};
si.vectorEffectSupport = !0;
si.Listener = function(e) {
  var o = e, n = [], l = function(c) {
    if (!arguments.length || c == o)
      return o;
    o = c, n.forEach(function(m) {
      m(o);
    });
  };
  return l.addListener = function(c) {
    return n.push(c), l;
  }, l.removeListener = function(c) {
    return we.pull(n, c), l;
  }, l;
};
si.GeneMap = function(e) {
  var o = {
    apiUrl: "/",
    width: "800",
    height: "500",
    svgDefsFile: "./assets/sprite-defs.svg",
    layout: {
      margin: { top: 0.05, right: 0.05, bottom: 0.05, left: 0.05 },
      numberPerRow: (
        /*6*/
        7
      ),
      maxAnnotationLayers: 3
    },
    pngScale: 2,
    contentBorder: !1,
    initialMaxGenes: 200,
    nGenesToDisplay: 200,
    maxSnpPValue: 1e-5,
    annotationLabelSize: 13,
    // the extra area outside of the content that the user can pan overflow
    // as a proportion of the content. The content doesn't include the margins.
    extraPanArea: 0.4
  }, n = we.merge({}, o, e), l, c, m, g, b, p, v, S, x, h, w, a, E, k, O, G, q = !1, P = {}, U = function() {
    if (q) {
      var rt = Xt(l).height();
      n.height = rt - 80, n.width = "100%";
    }
  }, Q = function() {
    q ? (n.height = P.height, n.width = P.width, Dt(l).classed("fullscreen", !1), q = !1) : (P.height = n.height, P.width = n.width, Dt(l).classed("fullscreen", !0), q = !0), U(), pt(), _t(), ye();
  }, et = function() {
    var rt = { width: n.width, height: n.height };
    if (rt.width.toString().indexOf("%") >= 0 || rt.height.toString().indexOf("%") >= 0) {
      var dt = Dt(l).select("svg").node().getBoundingClientRect();
      rt.width.toString().indexOf("%") >= 0 && (rt.width = dt.width), rt.height.toString().indexOf("%") >= 0 && (rt.height = dt.height);
    }
    return rt;
  }, yt = function() {
    const rt = uo(c.node()), dt = rt.k, vt = [rt.x, rt.y];
    return vt[0] !== 0 || vt[1] !== 0 || dt !== 1;
  }, _t = function() {
    const rt = uo(c.node()), dt = rt.k, vt = [rt.x, rt.y];
    dt === 1 && we.isEqual(vt, [0, 0]) || (p.translate([0, 0]), p.scale(1), m.attr(
      "transform",
      "translate(" + p.translate() + ")scale(" + p.scale() + ")"
    ), a.setFitButtonEnabled(yt()), Yt(), ye());
  }, bt = function() {
    m.select(".drawing_outline").attr("width", x.drawing.width).attr("height", x.drawing.height);
  }, wt = function() {
    var rt = x.drawing, dt = x.margin;
    m.select(".drawing_margin").attr("x", dt.left).attr("y", dt.top).attr("width", rt.width - dt.left - dt.right).attr("height", rt.height - dt.top - dt.bottom);
  }, jt = function() {
    m.attr("transform", "translate(0,0)scale(1)"), m.attr(
      "transform",
      "translate(" + p.translate() + ")scale(" + p.scale() + ")"
    );
  }, Bt = function() {
    var rt = Dt(l).select(".mapview").node();
    fA.saveSvgAsPng(rt, "genemap.png");
  };
  v = function() {
    var rt = uo(this), dt = [rt.x, rt.y], vt = rt.k;
    if (x) {
      var Jt = c.node().getBoundingClientRect(), pe = -x.drawing.width * vt + Jt.width * (1 - n.extraPanArea) + x.drawing.margin.right * vt, xe = Jt.width * n.extraPanArea - x.drawing.margin.left * vt;
      dt[0] = we.clamp(dt[0], pe, xe);
      var Ve = -x.drawing.height * vt + Jt.height * (1 - n.extraPanArea) + x.drawing.margin.bottom * vt, ke = Jt.height * n.extraPanArea - x.drawing.margin.top * vt;
      dt[1] = we.clamp(dt[1], Ve, ke);
    }
    (rt.x !== dt[0] || rt.y !== dt[1]) && p.translateBy(
      c,
      dt[0] - rt.x,
      dt[1] - rt.y
    ), vt !== S && (Yt(), ye(), S = vt), a.setFitButtonEnabled(yt()), m.attr(
      "transform",
      "translate(" + dt[0] + "," + dt[1] + ")scale(" + vt + ")"
    ), pt(), g.text(
      "translate: [ " + dt[0].toFixed(1) + "," + dt[1].toFixed(1) + "]  zoom:" + vt.toFixed(2)
    );
  };
  var Y = function(rt) {
    rt.preventDefault();
  }, pt = function() {
    Xt(".gene-annotation-popover").remove();
  }, J = function() {
    var rt = function(vt) {
      vt.target !== "undefined" && vt.target.tagName.toLowerCase() === "a" || Xt(vt.target).closest(".genemap-advanced-menu").length > 0 || Xt(vt.target).closest(".color-picker-modal").length > 0 || pt();
    }, dt = "mousedown mousewheel DOMMouseScroll touchstart ";
    Xt(l).off(dt).on(dt, rt), Xt("body").on("click", function(vt) {
      Xt(vt.target).closest(l).length < 1 && q == !0 && Q();
    });
  }, lt = function(rt) {
    rt == "auto" ? (E = !0, k = !0, x.chromosomes.forEach(function(dt) {
      dt.annotations.genes.forEach(function(vt) {
        vt.selected == !0 && (vt.visible = !0);
      });
    })) : rt == "show" ? (E = !1, k = !0) : rt == "hide" && (E = !1, k = !1), x.chromosomes.forEach(function(dt) {
      dt.annotations.genes.forEach(function(vt) {
        rt === "auto" ? delete vt.showLabel : vt.showLabel = rt;
      });
    }), console.log("genome", x), Yt(), ye();
  }, xt = function() {
    var rt = x.chromosomes.some(function(dt) {
      return dt.annotations.genes.some(function(vt) {
        return vt.selected;
      });
    });
    Ot.onAnonationLabelSelectFunction && Ot.onAnonationLabelSelectFunction(Ot.getSelectedGenes()), Yt(), ye(), Dt(".network-btn").classed("disabled", !rt);
  }, At = function(rt) {
    w ? (x = h, w = !1) : (x = { chromosomes: [rt] }, w = !0), Ot.onAnonationLabelSelectFunction(Ot.getSelectedGenes()), _t(), Yt(), ye();
  }, Lt = function() {
    we.flatMap(
      x.chromosomes.map(function(rt) {
        return rt.annotations.genes.filter(function(dt) {
          return dt.selected;
        }).map(function(dt) {
          var vt = dt.link, Jt = vt.substring(vt.indexOf("list="), vt.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              Jt.replace(/\+/g, " ")
            )
          );
        });
      })
    ), n.apiUrl + "";
  }, j = function() {
    var rt = a.getTagButtonState(), dt;
    rt === "auto" ? dt = "show" : rt === "show" ? dt = "hide" : dt = "auto", a.setTabButtonState(dt), lt(dt), ye();
  }, kt = function() {
    x.chromosomes.forEach(function(rt) {
      rt.annotations.allGenes.forEach(function(dt) {
        dt.selected = !1, dt.visible = !1, dt.hidden = !1;
      });
    }), Yt(), ye();
  }, le = function(rt) {
    n.layout.numberPerRow = rt, de(), Yt(), ye();
  }, zt = function(rt) {
    rt == "all" ? (O = !0, G = !0) : rt == "selected" ? (O = !1, G = "true") : (O = !1, G = !1), oe(), Yt(), ye();
  }, ie = function() {
    const dt = uo(c.node()).k;
    var vt = Y0(n.layout).width(et().width).height(et().height).scale(dt);
    x = vt.decorateGenome(x);
  }, de = function() {
    x.chromosomes.forEach(function(rt) {
      rt.layout = rt.layout || {}, rt.layout.annotationDisplayClusters = null, rt.layout.geneBandDisplayClusters = null;
    });
  }, oe = function() {
    x.chromosomes.forEach(function(rt) {
      rt.layout = rt.layout || {}, rt.layout.qtlDisplayClusters = null;
    });
  }, Yt = function() {
    const dt = uo(c.node()).k;
    ie();
    var vt = rA({
      longestChromosome: x.cellLayout.longestChromosome,
      layout: x.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: x.cellLayout.annotations.marker.size,
      annotationLabelSize: x.cellLayout.annotations.label.size,
      scale: dt,
      autoLabels: E,
      manualLabels: k,
      nGenesToDisplay: n.nGenesToDisplay,
      displayedFontSize: n.annotationLabelSize
    }), Jt = iA({
      longestChromosome: x.cellLayout.longestChromosome,
      layout: x.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: dt,
      nGenesToDisplay: n.nGenesToDisplay
    }), pe = lA({
      longestChromosome: x.cellLayout.longestChromosome,
      layout: x.cellLayout.qtlAnnotationPosition,
      scale: dt,
      showAllQTLs: O,
      showSelectedQTLs: G,
      showAutoQTLLabels: O,
      showSelectedQTLLabels: G,
      annotationLabelSize: x.cellLayout.annotations.label.size
    });
    x.chromosomes.forEach(function(xe) {
      xe.layout = xe.layout || {}, xe.layout.annotationDisplayClusters || vt.computeChromosomeClusters(xe), vt.layoutChromosome(xe), xe.layout.geneBandDisplayClusters || Jt.computeChromosomeClusters(xe), Jt.layoutChromosome(xe), xe.layout.qtlDisplayClusters || pe.computeChromosomeClusters(xe), pe.layoutChromosome(xe);
    }), vt.computeNormalisedGeneScores(x.chromosomes);
  }, Be = function(rt, dt) {
    var vt = /* @__PURE__ */ new Set(), Jt = [];
    dt.chromosomes.forEach(function(Ve) {
      Ve.annotations.snps.forEach(function(ke) {
        vt.has(ke.trait) || ke.trait != null && Jt.push({ trait: ke.trait, color: ke.color }), vt.add(ke.trait);
      });
    }), Jt.length > 0 ? rt.text("SNP legend: ") : rt.text("");
    var pe = rt.selectAll("span").data(Jt), xe = pe.enter().append("span").classed("key-item", !0);
    xe.append("span").style("background-color", function(Ve) {
      return Ve.color;
    }).classed("colorbox", !0).append("svg"), xe.append("span").text(function(Ve) {
      return Ve.trait;
    }), pe.exit().remove();
  }, Je = function(rt) {
    var dt = rt.append("div").attr("class", "mapview-wrapper"), vt = dt.append("svg").attr("width", n.width).attr("height", n.height).attr("class", "mapview").attr("flex", n.flex);
    g = rt.append("div").append("span").attr("class", "logger").attr("id", "logbar"), b = rt.append("div").attr("class", "key").attr("id", "keybar"), si.vectorEffectSupport = "vectorEffect" in vt.node().style, J(), vt.on("contextmenu", Y), vt.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), n.contentBorder && rt.select(".zoom_window").append("rect").classed("drawing_margin", !0), S = 1, p = l_().scaleExtent([0.5, 60]), p.on("zoom", v), rt.select("svg").call(p);
    var Jt = rt.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return Jt.append("div").attr("class", "arrow"), Jt.append("h3").attr("class", "popover-title").text("Cluster"), Jt.append("div").attr("class", "popover-content"), vt;
  }, ye = function() {
    Dt(l).select("svg").node() ? (c = Dt(l).select("svg"), c.attr("width", n.width).attr("height", n.height)) : c = Je(Dt(l)), ie();
    var rt = x.chromosomes.every(function(vt) {
      return vt.layout;
    });
    rt || Yt(), c.datum(x), m = c.select(".zoom_window"), bt(), n.contentBorder && wt();
    var dt = KC().onAnnotationSelectFunction(xt).onLabelSelectFunction(At).maxAnnotationLayers(n.layout.maxAnnotationLayers).maxSnpPValue(n.maxSnpPValue).svg(c);
    m.call(dt);
  };
  function Ot(rt) {
    rt.each(function(dt) {
      var vt = this;
      l = vt, h = dt, x = h, w = !1, a || (a = oA().onTagBtnClick(j).onFitBtnClick(_t).onLabelBtnClick(lt).onQtlBtnClick(zt).onNetworkBtnClick(Lt).onResetBtnClick(kt).onSetNumberPerRowClick(le).initialMaxGenes(n.nGenesToDisplay).initialNPerRow(n.layout.numberPerRow).onExportBtnClick(Bt).onExportAllBtnClick(jt).onExpandBtnClick(Q).maxSnpPValueProperty(Ot.maxSnpPValue).nGenesToDisplayProperty(Ot.nGenesToDisplay).annotationLabelSizeProperty(Ot.annotationLabelSize)), Dt(l).call(a), a.setNetworkButtonEnabled(!1), a.setFitButtonEnabled(!1), a.setTabButtonState("auto"), ye();
    });
  }
  return Ot.resetZoom = _t, Ot.width = function(rt) {
    return arguments.length ? (n.width = rt, Ot) : n.width;
  }, Ot.height = function(rt) {
    return arguments.length ? (n.height = rt, Ot) : n.height;
  }, Ot.layout = function(rt) {
    return arguments.length ? (n.layout = we.merge(n.layout, rt), Ot) : n.layout;
  }, Ot.draw = async function(rt, dt, vt, Jt = !1) {
    var pe = X0();
    if (vt)
      pe.readXMLData(dt, vt, Jt).then(function(xe) {
        Ot._draw(rt, xe, Jt);
      });
    else {
      const xe = await pe.readXMLData(
        dt,
        vt,
        Jt
      );
      Ot._draw(rt, xe, Jt);
    }
  }, Ot._draw = function(rt, dt) {
    var vt = Dt(rt).selectAll("div").data(["genemap-target"]);
    vt.enter().append("div").attr("id", function(Jt) {
      return Jt;
    }), l = Dt(rt).select("#genemap-target").node(), Dt(l).datum(dt).call(Ot), Ot.nGenesToDisplay(n.initialMaxGenes), _t(), Be(b, x);
  }, Ot.changeQtlColor = function(rt, dt, vt) {
    x.chromosomes.forEach(function(Jt) {
      Jt.layout.qtlNodes.forEach(function(pe) {
        pe.id === rt && (pe.color = dt, pe.label = vt);
      });
    }), Yt(), ye();
  }, Ot.changeColor = function(rt) {
    Dt("#map").style("background-color", rt), Yt(), ye();
  }, Ot.redraw = function(rt) {
    l = Dt(rt).select("#genemap-target")[0][0], U(), Dt(l).call(Ot), pt();
  }, Ot.setGeneLabels = function(rt) {
    l && lt(rt);
  }, Ot.maxSnpPValue = si.Listener(n.maxSnpPValue).addListener(function(rt) {
    var dt = Number(rt);
    isNaN(dt) && Ot.maxSnpPValue(n.maxSnpPValue), n.maxSnpPValue = Number(rt), Yt(), ye();
  }), Ot.nGenesToDisplay = si.Listener(n.nGenesToDisplay).addListener(
    function(rt) {
      var dt = n.nGenesToDisplay;
      n.nGenesToDisplay = rt, rt != dt && (de(), Yt(), ye());
    }
  ), Ot.annotationLabelSize = si.Listener(
    n.annotationLabelSize
  ).addListener(function(rt) {
    n.annotationLabelSize = rt, de(), Yt(), ye();
  }), Ot.setQtlLabels = function(rt) {
    if (l) {
      var dt = Dt(l).datum();
      dt.chromosomes.forEach(function(vt) {
        vt.annotations.qtls.forEach(function(Jt) {
          rt === "auto" ? delete Jt.showLabel : Jt.showLabel = rt;
        });
      });
    }
  }, Ot.onAnonationLabelSelectFunction = function() {
  }, Ot.loggingOn = function() {
    g.style("display", "initial");
  }, Ot.loggingOff = function() {
    g.style("display", "none");
  }, Ot.getSelectedGenes = function() {
    var rt = [];
    return x.chromosomes.forEach(function(dt) {
      dt.annotations.genes.forEach(function(vt) {
        vt.selected && rt.push(vt);
      });
    }), rt;
  }, Ot.getGenome = function() {
    return x;
  }, Ot;
};
const po = si.GeneMap().width("100%").height("100%");
function cA() {
  const e = document.getElementById("show-gene-labels"), o = e.options[e.selectedIndex].value;
  po.setGeneLabels(o);
  const n = document.getElementById("show-qtl-labels"), l = n.options[n.selectedIndex].value;
  po.setQtlLabels(l), po.redraw("#map");
}
function hA() {
  po.changeQtlColor("C6", "#000");
}
function dA(e) {
  e && po.resetZoom(), po.draw("#map", "./test/data/basemap/arabidopsis.json", "./test/data/annotations/arabidopsis.json");
}
export {
  hA as changeQtlColor,
  po as chart,
  dA as redraw,
  cA as updateLabel
};
