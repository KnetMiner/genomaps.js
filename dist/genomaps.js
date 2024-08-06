import './chart.css';function Vg(e, n) {
  for (var t = 0; t < n.length; t++) {
    const a = n[t];
    if (typeof a != "string" && !Array.isArray(a)) {
      for (const u in a)
        if (u !== "default" && !(u in e)) {
          const f = Object.getOwnPropertyDescriptor(a, u);
          f && Object.defineProperty(e, u, f.get ? f : {
            enumerable: !0,
            get: () => a[u]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var uo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ws(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ug(e, n) {
  const t = window.getComputedStyle(e);
  for (const a of t)
    n.style[a] = t[a];
  for (let a = 0; a < e.children.length; a++)
    Ug(e.children[a], n.children[a]);
}
function U1({ source: e, target: n, scale: t, format: a, quality: u }) {
  let f = new XMLSerializer().serializeToString(n), d = document.createElement("canvas"), v = e.getBoundingClientRect();
  d.width = v.width * t, d.height = v.height * t, d.style.width = v.width, d.style.height = v.height;
  let p = d.getContext("2d");
  p.scale(t, t);
  let g = document.createElement("img");
  return g.setAttribute(
    "src",
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(f)))
  ), new Promise((b) => {
    g.onload = () => {
      p.drawImage(g, 0, 0), b(
        d.toDataURL(`image/${a === "jpg" ? "jpeg" : a}`, u)
      );
    };
  });
}
function G1({ file: e, name: n, format: t }) {
  let a = document.createElement("a");
  a.download = `${n}.${t}`, a.href = e, document.body.appendChild(a), a.click(), document.body.removeChild(a);
}
var Gg = async function(e, n, {
  scale: t = 1,
  format: a = "png",
  quality: u = 0.92,
  download: f = !0,
  ignore: d = null,
  cssinline: v = 1,
  background: p = null
} = {}) {
  e = e instanceof Element ? e : document.querySelector(e);
  const g = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  g.innerHTML = e.innerHTML;
  for (const w of e.attributes)
    g.setAttribute(w.name, w.value);
  if (v === 1 && Ug(e, g), p && (g.style.background = p), d != null) {
    const w = g.querySelectorAll(d);
    [].forEach.call(w, (m) => m.parentNode.removeChild(m));
  }
  const b = await U1({
    source: e,
    target: g,
    scale: t,
    format: a,
    quality: u
  });
  return f && G1({ file: b, name: n, format: a }), b;
};
const Kg = /* @__PURE__ */ ws(Gg), K1 = /* @__PURE__ */ Vg({
  __proto__: null,
  default: Kg
}, [Gg]);
var sf = { exports: {} }, Xg = {}, Er = {}, ia = {}, bs = {}, mt = {}, cs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class n {
  }
  e._CodeOrName = n, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class t extends n {
    constructor(I) {
      if (super(), !e.IDENTIFIER.test(I))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = I;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = t;
  class a extends n {
    constructor(I) {
      super(), this._items = typeof I == "string" ? [I] : I;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const I = this._items[0];
      return I === "" || I === '""';
    }
    get str() {
      var I;
      return (I = this._str) !== null && I !== void 0 ? I : this._str = this._items.reduce((F, k) => `${F}${k}`, "");
    }
    get names() {
      var I;
      return (I = this._names) !== null && I !== void 0 ? I : this._names = this._items.reduce((F, k) => (k instanceof t && (F[k.str] = (F[k.str] || 0) + 1), F), {});
    }
  }
  e._Code = a, e.nil = new a("");
  function u(A, ...I) {
    const F = [A[0]];
    let k = 0;
    for (; k < I.length; )
      v(F, I[k]), F.push(A[++k]);
    return new a(F);
  }
  e._ = u;
  const f = new a("+");
  function d(A, ...I) {
    const F = [x(A[0])];
    let k = 0;
    for (; k < I.length; )
      F.push(f), v(F, I[k]), F.push(f, x(A[++k]));
    return p(F), new a(F);
  }
  e.str = d;
  function v(A, I) {
    I instanceof a ? A.push(...I._items) : I instanceof t ? A.push(I) : A.push(w(I));
  }
  e.addCodeArg = v;
  function p(A) {
    let I = 1;
    for (; I < A.length - 1; ) {
      if (A[I] === f) {
        const F = g(A[I - 1], A[I + 1]);
        if (F !== void 0) {
          A.splice(I - 1, 3, F);
          continue;
        }
        A[I++] = "+";
      }
      I++;
    }
  }
  function g(A, I) {
    if (I === '""')
      return A;
    if (A === '""')
      return I;
    if (typeof A == "string")
      return I instanceof t || A[A.length - 1] !== '"' ? void 0 : typeof I != "string" ? `${A.slice(0, -1)}${I}"` : I[0] === '"' ? A.slice(0, -1) + I.slice(1) : void 0;
    if (typeof I == "string" && I[0] === '"' && !(A instanceof t))
      return `"${A}${I.slice(1)}`;
  }
  function b(A, I) {
    return I.emptyStr() ? A : A.emptyStr() ? I : d`${A}${I}`;
  }
  e.strConcat = b;
  function w(A) {
    return typeof A == "number" || typeof A == "boolean" || A === null ? A : x(Array.isArray(A) ? A.join(",") : A);
  }
  function m(A) {
    return new a(x(A));
  }
  e.stringify = m;
  function x(A) {
    return JSON.stringify(A).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = x;
  function s(A) {
    return typeof A == "string" && e.IDENTIFIER.test(A) ? new a(`.${A}`) : u`[${A}]`;
  }
  e.getProperty = s;
  function $(A) {
    if (typeof A == "string" && e.IDENTIFIER.test(A))
      return new a(`${A}`);
    throw new Error(`CodeGen: invalid export name: ${A}, use explicit $id name mapping`);
  }
  e.getEsmExportName = $;
  function E(A) {
    return new a(A.toString());
  }
  e.regexpCode = E;
})(cs);
var uf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const n = cs;
  class t extends Error {
    constructor(g) {
      super(`CodeGen: "code" for ${g} not defined`), this.value = g.value;
    }
  }
  var a;
  (function(p) {
    p[p.Started = 0] = "Started", p[p.Completed = 1] = "Completed";
  })(a || (e.UsedValueState = a = {})), e.varKinds = {
    const: new n.Name("const"),
    let: new n.Name("let"),
    var: new n.Name("var")
  };
  class u {
    constructor({ prefixes: g, parent: b } = {}) {
      this._names = {}, this._prefixes = g, this._parent = b;
    }
    toName(g) {
      return g instanceof n.Name ? g : this.name(g);
    }
    name(g) {
      return new n.Name(this._newName(g));
    }
    _newName(g) {
      const b = this._names[g] || this._nameGroup(g);
      return `${g}${b.index++}`;
    }
    _nameGroup(g) {
      var b, w;
      if (!((w = (b = this._parent) === null || b === void 0 ? void 0 : b._prefixes) === null || w === void 0) && w.has(g) || this._prefixes && !this._prefixes.has(g))
        throw new Error(`CodeGen: prefix "${g}" is not allowed in this scope`);
      return this._names[g] = { prefix: g, index: 0 };
    }
  }
  e.Scope = u;
  class f extends n.Name {
    constructor(g, b) {
      super(b), this.prefix = g;
    }
    setValue(g, { property: b, itemIndex: w }) {
      this.value = g, this.scopePath = (0, n._)`.${new n.Name(b)}[${w}]`;
    }
  }
  e.ValueScopeName = f;
  const d = (0, n._)`\n`;
  class v extends u {
    constructor(g) {
      super(g), this._values = {}, this._scope = g.scope, this.opts = { ...g, _n: g.lines ? d : n.nil };
    }
    get() {
      return this._scope;
    }
    name(g) {
      return new f(g, this._newName(g));
    }
    value(g, b) {
      var w;
      if (b.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const m = this.toName(g), { prefix: x } = m, s = (w = b.key) !== null && w !== void 0 ? w : b.ref;
      let $ = this._values[x];
      if ($) {
        const I = $.get(s);
        if (I)
          return I;
      } else
        $ = this._values[x] = /* @__PURE__ */ new Map();
      $.set(s, m);
      const E = this._scope[x] || (this._scope[x] = []), A = E.length;
      return E[A] = b.ref, m.setValue(b, { property: x, itemIndex: A }), m;
    }
    getValue(g, b) {
      const w = this._values[g];
      if (w)
        return w.get(b);
    }
    scopeRefs(g, b = this._values) {
      return this._reduceValues(b, (w) => {
        if (w.scopePath === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return (0, n._)`${g}${w.scopePath}`;
      });
    }
    scopeCode(g = this._values, b, w) {
      return this._reduceValues(g, (m) => {
        if (m.value === void 0)
          throw new Error(`CodeGen: name "${m}" has no value`);
        return m.value.code;
      }, b, w);
    }
    _reduceValues(g, b, w = {}, m) {
      let x = n.nil;
      for (const s in g) {
        const $ = g[s];
        if (!$)
          continue;
        const E = w[s] = w[s] || /* @__PURE__ */ new Map();
        $.forEach((A) => {
          if (E.has(A))
            return;
          E.set(A, a.Started);
          let I = b(A);
          if (I) {
            const F = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            x = (0, n._)`${x}${F} ${A} = ${I};${this.opts._n}`;
          } else if (I = m == null ? void 0 : m(A))
            x = (0, n._)`${x}${I}${this.opts._n}`;
          else
            throw new t(A);
          E.set(A, a.Completed);
        });
      }
      return x;
    }
  }
  e.ValueScope = v;
})(uf);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const n = cs, t = uf;
  var a = cs;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return a._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return a.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return a.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return a.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return a.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return a.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return a.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return a.Name;
  } });
  var u = uf;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return u.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return u.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return u.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return u.varKinds;
  } }), e.operators = {
    GT: new n._Code(">"),
    GTE: new n._Code(">="),
    LT: new n._Code("<"),
    LTE: new n._Code("<="),
    EQ: new n._Code("==="),
    NEQ: new n._Code("!=="),
    NOT: new n._Code("!"),
    OR: new n._Code("||"),
    AND: new n._Code("&&"),
    ADD: new n._Code("+")
  };
  class f {
    optimizeNodes() {
      return this;
    }
    optimizeNames(L, B) {
      return this;
    }
  }
  class d extends f {
    constructor(L, B, re) {
      super(), this.varKind = L, this.name = B, this.rhs = re;
    }
    render({ es5: L, _n: B }) {
      const re = L ? t.varKinds.var : this.varKind, xe = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${re} ${this.name}${xe};` + B;
    }
    optimizeNames(L, B) {
      if (L[this.name.str])
        return this.rhs && (this.rhs = J(this.rhs, L, B)), this;
    }
    get names() {
      return this.rhs instanceof n._CodeOrName ? this.rhs.names : {};
    }
  }
  class v extends f {
    constructor(L, B, re) {
      super(), this.lhs = L, this.rhs = B, this.sideEffects = re;
    }
    render({ _n: L }) {
      return `${this.lhs} = ${this.rhs};` + L;
    }
    optimizeNames(L, B) {
      if (!(this.lhs instanceof n.Name && !L[this.lhs.str] && !this.sideEffects))
        return this.rhs = J(this.rhs, L, B), this;
    }
    get names() {
      const L = this.lhs instanceof n.Name ? {} : { ...this.lhs.names };
      return Fe(L, this.rhs);
    }
  }
  class p extends v {
    constructor(L, B, re, xe) {
      super(L, re, xe), this.op = B;
    }
    render({ _n: L }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + L;
    }
  }
  class g extends f {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `${this.label}:` + L;
    }
  }
  class b extends f {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `break${this.label ? ` ${this.label}` : ""};` + L;
    }
  }
  class w extends f {
    constructor(L) {
      super(), this.error = L;
    }
    render({ _n: L }) {
      return `throw ${this.error};` + L;
    }
    get names() {
      return this.error.names;
    }
  }
  class m extends f {
    constructor(L) {
      super(), this.code = L;
    }
    render({ _n: L }) {
      return `${this.code};` + L;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(L, B) {
      return this.code = J(this.code, L, B), this;
    }
    get names() {
      return this.code instanceof n._CodeOrName ? this.code.names : {};
    }
  }
  class x extends f {
    constructor(L = []) {
      super(), this.nodes = L;
    }
    render(L) {
      return this.nodes.reduce((B, re) => B + re.render(L), "");
    }
    optimizeNodes() {
      const { nodes: L } = this;
      let B = L.length;
      for (; B--; ) {
        const re = L[B].optimizeNodes();
        Array.isArray(re) ? L.splice(B, 1, ...re) : re ? L[B] = re : L.splice(B, 1);
      }
      return L.length > 0 ? this : void 0;
    }
    optimizeNames(L, B) {
      const { nodes: re } = this;
      let xe = re.length;
      for (; xe--; ) {
        const be = re[xe];
        be.optimizeNames(L, B) || (_e(L, be.names), re.splice(xe, 1));
      }
      return re.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((L, B) => We(L, B.names), {});
    }
  }
  class s extends x {
    render(L) {
      return "{" + L._n + super.render(L) + "}" + L._n;
    }
  }
  class $ extends x {
  }
  class E extends s {
  }
  E.kind = "else";
  class A extends s {
    constructor(L, B) {
      super(B), this.condition = L;
    }
    render(L) {
      let B = `if(${this.condition})` + super.render(L);
      return this.else && (B += "else " + this.else.render(L)), B;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const L = this.condition;
      if (L === !0)
        return this.nodes;
      let B = this.else;
      if (B) {
        const re = B.optimizeNodes();
        B = this.else = Array.isArray(re) ? new E(re) : re;
      }
      if (B)
        return L === !1 ? B instanceof A ? B : B.nodes : this.nodes.length ? this : new A(oe(L), B instanceof A ? [B] : B.nodes);
      if (!(L === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(L, B) {
      var re;
      if (this.else = (re = this.else) === null || re === void 0 ? void 0 : re.optimizeNames(L, B), !!(super.optimizeNames(L, B) || this.else))
        return this.condition = J(this.condition, L, B), this;
    }
    get names() {
      const L = super.names;
      return Fe(L, this.condition), this.else && We(L, this.else.names), L;
    }
  }
  A.kind = "if";
  class I extends s {
  }
  I.kind = "for";
  class F extends I {
    constructor(L) {
      super(), this.iteration = L;
    }
    render(L) {
      return `for(${this.iteration})` + super.render(L);
    }
    optimizeNames(L, B) {
      if (super.optimizeNames(L, B))
        return this.iteration = J(this.iteration, L, B), this;
    }
    get names() {
      return We(super.names, this.iteration.names);
    }
  }
  class k extends I {
    constructor(L, B, re, xe) {
      super(), this.varKind = L, this.name = B, this.from = re, this.to = xe;
    }
    render(L) {
      const B = L.es5 ? t.varKinds.var : this.varKind, { name: re, from: xe, to: be } = this;
      return `for(${B} ${re}=${xe}; ${re}<${be}; ${re}++)` + super.render(L);
    }
    get names() {
      const L = Fe(super.names, this.from);
      return Fe(L, this.to);
    }
  }
  class j extends I {
    constructor(L, B, re, xe) {
      super(), this.loop = L, this.varKind = B, this.name = re, this.iterable = xe;
    }
    render(L) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(L);
    }
    optimizeNames(L, B) {
      if (super.optimizeNames(L, B))
        return this.iterable = J(this.iterable, L, B), this;
    }
    get names() {
      return We(super.names, this.iterable.names);
    }
  }
  class U extends s {
    constructor(L, B, re) {
      super(), this.name = L, this.args = B, this.async = re;
    }
    render(L) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(L);
    }
  }
  U.kind = "func";
  class ne extends x {
    render(L) {
      return "return " + super.render(L);
    }
  }
  ne.kind = "return";
  class Se extends s {
    render(L) {
      let B = "try" + super.render(L);
      return this.catch && (B += this.catch.render(L)), this.finally && (B += this.finally.render(L)), B;
    }
    optimizeNodes() {
      var L, B;
      return super.optimizeNodes(), (L = this.catch) === null || L === void 0 || L.optimizeNodes(), (B = this.finally) === null || B === void 0 || B.optimizeNodes(), this;
    }
    optimizeNames(L, B) {
      var re, xe;
      return super.optimizeNames(L, B), (re = this.catch) === null || re === void 0 || re.optimizeNames(L, B), (xe = this.finally) === null || xe === void 0 || xe.optimizeNames(L, B), this;
    }
    get names() {
      const L = super.names;
      return this.catch && We(L, this.catch.names), this.finally && We(L, this.finally.names), L;
    }
  }
  class Ce extends s {
    constructor(L) {
      super(), this.error = L;
    }
    render(L) {
      return `catch(${this.error})` + super.render(L);
    }
  }
  Ce.kind = "catch";
  class Ee extends s {
    render(L) {
      return "finally" + super.render(L);
    }
  }
  Ee.kind = "finally";
  class Ae {
    constructor(L, B = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...B, _n: B.lines ? `
` : "" }, this._extScope = L, this._scope = new t.Scope({ parent: L }), this._nodes = [new $()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(L) {
      return this._scope.name(L);
    }
    // reserves unique name in the external scope
    scopeName(L) {
      return this._extScope.name(L);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(L, B) {
      const re = this._extScope.value(L, B);
      return (this._values[re.prefix] || (this._values[re.prefix] = /* @__PURE__ */ new Set())).add(re), re;
    }
    getScopeValue(L, B) {
      return this._extScope.getValue(L, B);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(L) {
      return this._extScope.scopeRefs(L, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(L, B, re, xe) {
      const be = this._scope.toName(B);
      return re !== void 0 && xe && (this._constants[be.str] = re), this._leafNode(new d(L, be, re)), be;
    }
    // `const` declaration (`var` in es5 mode)
    const(L, B, re) {
      return this._def(t.varKinds.const, L, B, re);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(L, B, re) {
      return this._def(t.varKinds.let, L, B, re);
    }
    // `var` declaration with optional assignment
    var(L, B, re) {
      return this._def(t.varKinds.var, L, B, re);
    }
    // assignment code
    assign(L, B, re) {
      return this._leafNode(new v(L, B, re));
    }
    // `+=` code
    add(L, B) {
      return this._leafNode(new p(L, e.operators.ADD, B));
    }
    // appends passed SafeExpr to code or executes Block
    code(L) {
      return typeof L == "function" ? L() : L !== n.nil && this._leafNode(new m(L)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...L) {
      const B = ["{"];
      for (const [re, xe] of L)
        B.length > 1 && B.push(","), B.push(re), (re !== xe || this.opts.es5) && (B.push(":"), (0, n.addCodeArg)(B, xe));
      return B.push("}"), new n._Code(B);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(L, B, re) {
      if (this._blockNode(new A(L)), B && re)
        this.code(B).else().code(re).endIf();
      else if (B)
        this.code(B).endIf();
      else if (re)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(L) {
      return this._elseNode(new A(L));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new E());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(A, E);
    }
    _for(L, B) {
      return this._blockNode(L), B && this.code(B).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(L, B) {
      return this._for(new F(L), B);
    }
    // `for` statement for a range of values
    forRange(L, B, re, xe, be = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const Ge = this._scope.toName(L);
      return this._for(new k(be, Ge, B, re), () => xe(Ge));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(L, B, re, xe = t.varKinds.const) {
      const be = this._scope.toName(L);
      if (this.opts.es5) {
        const Ge = B instanceof n.Name ? B : this.var("_arr", B);
        return this.forRange("_i", 0, (0, n._)`${Ge}.length`, (et) => {
          this.var(be, (0, n._)`${Ge}[${et}]`), re(be);
        });
      }
      return this._for(new j("of", xe, be, B), () => re(be));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(L, B, re, xe = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(L, (0, n._)`Object.keys(${B})`, re);
      const be = this._scope.toName(L);
      return this._for(new j("in", xe, be, B), () => re(be));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(I);
    }
    // `label` statement
    label(L) {
      return this._leafNode(new g(L));
    }
    // `break` statement
    break(L) {
      return this._leafNode(new b(L));
    }
    // `return` statement
    return(L) {
      const B = new ne();
      if (this._blockNode(B), this.code(L), B.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(ne);
    }
    // `try` statement
    try(L, B, re) {
      if (!B && !re)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const xe = new Se();
      if (this._blockNode(xe), this.code(L), B) {
        const be = this.name("e");
        this._currNode = xe.catch = new Ce(be), B(be);
      }
      return re && (this._currNode = xe.finally = new Ee(), this.code(re)), this._endBlockNode(Ce, Ee);
    }
    // `throw` statement
    throw(L) {
      return this._leafNode(new w(L));
    }
    // start self-balancing block
    block(L, B) {
      return this._blockStarts.push(this._nodes.length), L && this.code(L).endBlock(B), this;
    }
    // end the current self-balancing block
    endBlock(L) {
      const B = this._blockStarts.pop();
      if (B === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const re = this._nodes.length - B;
      if (re < 0 || L !== void 0 && re !== L)
        throw new Error(`CodeGen: wrong number of nodes: ${re} vs ${L} expected`);
      return this._nodes.length = B, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(L, B = n.nil, re, xe) {
      return this._blockNode(new U(L, B, re)), xe && this.code(xe).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(U);
    }
    optimize(L = 1) {
      for (; L-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(L) {
      return this._currNode.nodes.push(L), this;
    }
    _blockNode(L) {
      this._currNode.nodes.push(L), this._nodes.push(L);
    }
    _endBlockNode(L, B) {
      const re = this._currNode;
      if (re instanceof L || B && re instanceof B)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${B ? `${L.kind}/${B.kind}` : L.kind}"`);
    }
    _elseNode(L) {
      const B = this._currNode;
      if (!(B instanceof A))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = B.else = L, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const L = this._nodes;
      return L[L.length - 1];
    }
    set _currNode(L) {
      const B = this._nodes;
      B[B.length - 1] = L;
    }
  }
  e.CodeGen = Ae;
  function We(Y, L) {
    for (const B in L)
      Y[B] = (Y[B] || 0) + (L[B] || 0);
    return Y;
  }
  function Fe(Y, L) {
    return L instanceof n._CodeOrName ? We(Y, L.names) : Y;
  }
  function J(Y, L, B) {
    if (Y instanceof n.Name)
      return re(Y);
    if (!xe(Y))
      return Y;
    return new n._Code(Y._items.reduce((be, Ge) => (Ge instanceof n.Name && (Ge = re(Ge)), Ge instanceof n._Code ? be.push(...Ge._items) : be.push(Ge), be), []));
    function re(be) {
      const Ge = B[be.str];
      return Ge === void 0 || L[be.str] !== 1 ? be : (delete L[be.str], Ge);
    }
    function xe(be) {
      return be instanceof n._Code && be._items.some((Ge) => Ge instanceof n.Name && L[Ge.str] === 1 && B[Ge.str] !== void 0);
    }
  }
  function _e(Y, L) {
    for (const B in L)
      Y[B] = (Y[B] || 0) - (L[B] || 0);
  }
  function oe(Y) {
    return typeof Y == "boolean" || typeof Y == "number" || Y === null ? !Y : (0, n._)`!${te(Y)}`;
  }
  e.not = oe;
  const pe = R(e.operators.AND);
  function ke(...Y) {
    return Y.reduce(pe);
  }
  e.and = ke;
  const Ne = R(e.operators.OR);
  function ae(...Y) {
    return Y.reduce(Ne);
  }
  e.or = ae;
  function R(Y) {
    return (L, B) => L === n.nil ? B : B === n.nil ? L : (0, n._)`${te(L)} ${Y} ${te(B)}`;
  }
  function te(Y) {
    return Y instanceof n.Name ? Y : (0, n._)`(${Y})`;
  }
})(mt);
var Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.checkStrictMode = Me.getErrorPath = Me.Type = Me.useFunc = Me.setEvaluated = Me.evaluatedPropsToName = Me.mergeEvaluated = Me.eachItem = Me.unescapeJsonPointer = Me.escapeJsonPointer = Me.escapeFragment = Me.unescapeFragment = Me.schemaRefOrVal = Me.schemaHasRulesButRef = Me.schemaHasRules = Me.checkUnknownRules = Me.alwaysValidSchema = Me.toHash = void 0;
const zt = mt, X1 = cs;
function Y1(e) {
  const n = {};
  for (const t of e)
    n[t] = !0;
  return n;
}
Me.toHash = Y1;
function Q1(e, n) {
  return typeof n == "boolean" ? n : Object.keys(n).length === 0 ? !0 : (Yg(e, n), !Qg(n, e.self.RULES.all));
}
Me.alwaysValidSchema = Q1;
function Yg(e, n = e.schema) {
  const { opts: t, self: a } = e;
  if (!t.strictSchema || typeof n == "boolean")
    return;
  const u = a.RULES.keywords;
  for (const f in n)
    u[f] || em(e, `unknown keyword: "${f}"`);
}
Me.checkUnknownRules = Yg;
function Qg(e, n) {
  if (typeof e == "boolean")
    return !e;
  for (const t in e)
    if (n[t])
      return !0;
  return !1;
}
Me.schemaHasRules = Qg;
function J1(e, n) {
  if (typeof e == "boolean")
    return !e;
  for (const t in e)
    if (t !== "$ref" && n.all[t])
      return !0;
  return !1;
}
Me.schemaHasRulesButRef = J1;
function Z1({ topSchemaRef: e, schemaPath: n }, t, a, u) {
  if (!u) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, zt._)`${t}`;
  }
  return (0, zt._)`${e}${n}${(0, zt.getProperty)(a)}`;
}
Me.schemaRefOrVal = Z1;
function ex(e) {
  return Jg(decodeURIComponent(e));
}
Me.unescapeFragment = ex;
function tx(e) {
  return encodeURIComponent(Rf(e));
}
Me.escapeFragment = tx;
function Rf(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Me.escapeJsonPointer = Rf;
function Jg(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
Me.unescapeJsonPointer = Jg;
function nx(e, n) {
  if (Array.isArray(e))
    for (const t of e)
      n(t);
  else
    n(e);
}
Me.eachItem = nx;
function Tp({ mergeNames: e, mergeToName: n, mergeValues: t, resultToName: a }) {
  return (u, f, d, v) => {
    const p = d === void 0 ? f : d instanceof zt.Name ? (f instanceof zt.Name ? e(u, f, d) : n(u, f, d), d) : f instanceof zt.Name ? (n(u, d, f), f) : t(f, d);
    return v === zt.Name && !(p instanceof zt.Name) ? a(u, p) : p;
  };
}
Me.mergeEvaluated = {
  props: Tp({
    mergeNames: (e, n, t) => e.if((0, zt._)`${t} !== true && ${n} !== undefined`, () => {
      e.if((0, zt._)`${n} === true`, () => e.assign(t, !0), () => e.assign(t, (0, zt._)`${t} || {}`).code((0, zt._)`Object.assign(${t}, ${n})`));
    }),
    mergeToName: (e, n, t) => e.if((0, zt._)`${t} !== true`, () => {
      n === !0 ? e.assign(t, !0) : (e.assign(t, (0, zt._)`${t} || {}`), Mf(e, t, n));
    }),
    mergeValues: (e, n) => e === !0 ? !0 : { ...e, ...n },
    resultToName: Zg
  }),
  items: Tp({
    mergeNames: (e, n, t) => e.if((0, zt._)`${t} !== true && ${n} !== undefined`, () => e.assign(t, (0, zt._)`${n} === true ? true : ${t} > ${n} ? ${t} : ${n}`)),
    mergeToName: (e, n, t) => e.if((0, zt._)`${t} !== true`, () => e.assign(t, n === !0 ? !0 : (0, zt._)`${t} > ${n} ? ${t} : ${n}`)),
    mergeValues: (e, n) => e === !0 ? !0 : Math.max(e, n),
    resultToName: (e, n) => e.var("items", n)
  })
};
function Zg(e, n) {
  if (n === !0)
    return e.var("props", !0);
  const t = e.var("props", (0, zt._)`{}`);
  return n !== void 0 && Mf(e, t, n), t;
}
Me.evaluatedPropsToName = Zg;
function Mf(e, n, t) {
  Object.keys(t).forEach((a) => e.assign((0, zt._)`${n}${(0, zt.getProperty)(a)}`, !0));
}
Me.setEvaluated = Mf;
const Pp = {};
function rx(e, n) {
  return e.scopeValue("func", {
    ref: n,
    code: Pp[n.code] || (Pp[n.code] = new X1._Code(n.code))
  });
}
Me.useFunc = rx;
var lf;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(lf || (Me.Type = lf = {}));
function ix(e, n, t) {
  if (e instanceof zt.Name) {
    const a = n === lf.Num;
    return t ? a ? (0, zt._)`"[" + ${e} + "]"` : (0, zt._)`"['" + ${e} + "']"` : a ? (0, zt._)`"/" + ${e}` : (0, zt._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, zt.getProperty)(e).toString() : "/" + Rf(e);
}
Me.getErrorPath = ix;
function em(e, n, t = e.opts.strictSchema) {
  if (t) {
    if (n = `strict mode: ${n}`, t === !0)
      throw new Error(n);
    e.self.logger.warn(n);
  }
}
Me.checkStrictMode = em;
var Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
const xn = mt, ox = {
  // validation function arguments
  data: new xn.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new xn.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new xn.Name("instancePath"),
  parentData: new xn.Name("parentData"),
  parentDataProperty: new xn.Name("parentDataProperty"),
  rootData: new xn.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new xn.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new xn.Name("vErrors"),
  // null or array of validation errors
  errors: new xn.Name("errors"),
  // counter of validation errors
  this: new xn.Name("this"),
  // "globals"
  self: new xn.Name("self"),
  scope: new xn.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new xn.Name("json"),
  jsonPos: new xn.Name("jsonPos"),
  jsonLen: new xn.Name("jsonLen"),
  jsonPart: new xn.Name("jsonPart")
};
Wr.default = ox;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const n = mt, t = Me, a = Wr;
  e.keywordError = {
    message: ({ keyword: E }) => (0, n.str)`must pass "${E}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: E, schemaType: A }) => A ? (0, n.str)`"${E}" keyword must be ${A} ($data)` : (0, n.str)`"${E}" keyword is invalid ($data)`
  };
  function u(E, A = e.keywordError, I, F) {
    const { it: k } = E, { gen: j, compositeRule: U, allErrors: ne } = k, Se = w(E, A, I);
    F ?? (U || ne) ? p(j, Se) : g(k, (0, n._)`[${Se}]`);
  }
  e.reportError = u;
  function f(E, A = e.keywordError, I) {
    const { it: F } = E, { gen: k, compositeRule: j, allErrors: U } = F, ne = w(E, A, I);
    p(k, ne), j || U || g(F, a.default.vErrors);
  }
  e.reportExtraError = f;
  function d(E, A) {
    E.assign(a.default.errors, A), E.if((0, n._)`${a.default.vErrors} !== null`, () => E.if(A, () => E.assign((0, n._)`${a.default.vErrors}.length`, A), () => E.assign(a.default.vErrors, null)));
  }
  e.resetErrorsCount = d;
  function v({ gen: E, keyword: A, schemaValue: I, data: F, errsCount: k, it: j }) {
    if (k === void 0)
      throw new Error("ajv implementation error");
    const U = E.name("err");
    E.forRange("i", k, a.default.errors, (ne) => {
      E.const(U, (0, n._)`${a.default.vErrors}[${ne}]`), E.if((0, n._)`${U}.instancePath === undefined`, () => E.assign((0, n._)`${U}.instancePath`, (0, n.strConcat)(a.default.instancePath, j.errorPath))), E.assign((0, n._)`${U}.schemaPath`, (0, n.str)`${j.errSchemaPath}/${A}`), j.opts.verbose && (E.assign((0, n._)`${U}.schema`, I), E.assign((0, n._)`${U}.data`, F));
    });
  }
  e.extendErrors = v;
  function p(E, A) {
    const I = E.const("err", A);
    E.if((0, n._)`${a.default.vErrors} === null`, () => E.assign(a.default.vErrors, (0, n._)`[${I}]`), (0, n._)`${a.default.vErrors}.push(${I})`), E.code((0, n._)`${a.default.errors}++`);
  }
  function g(E, A) {
    const { gen: I, validateName: F, schemaEnv: k } = E;
    k.$async ? I.throw((0, n._)`new ${E.ValidationError}(${A})`) : (I.assign((0, n._)`${F}.errors`, A), I.return(!1));
  }
  const b = {
    keyword: new n.Name("keyword"),
    schemaPath: new n.Name("schemaPath"),
    // also used in JTD errors
    params: new n.Name("params"),
    propertyName: new n.Name("propertyName"),
    message: new n.Name("message"),
    schema: new n.Name("schema"),
    parentSchema: new n.Name("parentSchema")
  };
  function w(E, A, I) {
    const { createErrors: F } = E.it;
    return F === !1 ? (0, n._)`{}` : m(E, A, I);
  }
  function m(E, A, I = {}) {
    const { gen: F, it: k } = E, j = [
      x(k, I),
      s(E, I)
    ];
    return $(E, A, j), F.object(...j);
  }
  function x({ errorPath: E }, { instancePath: A }) {
    const I = A ? (0, n.str)`${E}${(0, t.getErrorPath)(A, t.Type.Str)}` : E;
    return [a.default.instancePath, (0, n.strConcat)(a.default.instancePath, I)];
  }
  function s({ keyword: E, it: { errSchemaPath: A } }, { schemaPath: I, parentSchema: F }) {
    let k = F ? A : (0, n.str)`${A}/${E}`;
    return I && (k = (0, n.str)`${k}${(0, t.getErrorPath)(I, t.Type.Str)}`), [b.schemaPath, k];
  }
  function $(E, { params: A, message: I }, F) {
    const { keyword: k, data: j, schemaValue: U, it: ne } = E, { opts: Se, propertyName: Ce, topSchemaRef: Ee, schemaPath: Ae } = ne;
    F.push([b.keyword, k], [b.params, typeof A == "function" ? A(E) : A || (0, n._)`{}`]), Se.messages && F.push([b.message, typeof I == "function" ? I(E) : I]), Se.verbose && F.push([b.schema, U], [b.parentSchema, (0, n._)`${Ee}${Ae}`], [a.default.data, j]), Ce && F.push([b.propertyName, Ce]);
  }
})(bs);
Object.defineProperty(ia, "__esModule", { value: !0 });
ia.boolOrEmptySchema = ia.topBoolOrEmptySchema = void 0;
const ax = bs, sx = mt, ux = Wr, lx = {
  message: "boolean schema is false"
};
function cx(e) {
  const { gen: n, schema: t, validateName: a } = e;
  t === !1 ? tm(e, !1) : typeof t == "object" && t.$async === !0 ? n.return(ux.default.data) : (n.assign((0, sx._)`${a}.errors`, null), n.return(!0));
}
ia.topBoolOrEmptySchema = cx;
function fx(e, n) {
  const { gen: t, schema: a } = e;
  a === !1 ? (t.var(n, !1), tm(e)) : t.var(n, !0);
}
ia.boolOrEmptySchema = fx;
function tm(e, n) {
  const { gen: t, data: a } = e, u = {
    gen: t,
    keyword: "false schema",
    data: a,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, ax.reportError)(u, lx, void 0, n);
}
var rn = {}, mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
mo.getRules = mo.isJSONType = void 0;
const dx = ["string", "number", "integer", "boolean", "null", "object", "array"], hx = new Set(dx);
function px(e) {
  return typeof e == "string" && hx.has(e);
}
mo.isJSONType = px;
function gx() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
mo.getRules = gx;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.shouldUseRule = di.shouldUseGroup = di.schemaHasRulesForType = void 0;
function mx({ schema: e, self: n }, t) {
  const a = n.RULES.types[t];
  return a && a !== !0 && nm(e, a);
}
di.schemaHasRulesForType = mx;
function nm(e, n) {
  return n.rules.some((t) => rm(e, t));
}
di.shouldUseGroup = nm;
function rm(e, n) {
  var t;
  return e[n.keyword] !== void 0 || ((t = n.definition.implements) === null || t === void 0 ? void 0 : t.some((a) => e[a] !== void 0));
}
di.shouldUseRule = rm;
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.reportTypeError = rn.checkDataTypes = rn.checkDataType = rn.coerceAndCheckDataType = rn.getJSONTypes = rn.getSchemaTypes = rn.DataType = void 0;
const vx = mo, yx = di, wx = bs, dt = mt, im = Me;
var Zo;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Zo || (rn.DataType = Zo = {}));
function bx(e) {
  const n = om(e.type);
  if (n.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!n.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && n.push("null");
  }
  return n;
}
rn.getSchemaTypes = bx;
function om(e) {
  const n = Array.isArray(e) ? e : e ? [e] : [];
  if (n.every(vx.isJSONType))
    return n;
  throw new Error("type must be JSONType or JSONType[]: " + n.join(","));
}
rn.getJSONTypes = om;
function _x(e, n) {
  const { gen: t, data: a, opts: u } = e, f = xx(n, u.coerceTypes), d = n.length > 0 && !(f.length === 0 && n.length === 1 && (0, yx.schemaHasRulesForType)(e, n[0]));
  if (d) {
    const v = Df(n, a, u.strictNumbers, Zo.Wrong);
    t.if(v, () => {
      f.length ? Sx(e, n, f) : If(e);
    });
  }
  return d;
}
rn.coerceAndCheckDataType = _x;
const am = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function xx(e, n) {
  return n ? e.filter((t) => am.has(t) || n === "array" && t === "array") : [];
}
function Sx(e, n, t) {
  const { gen: a, data: u, opts: f } = e, d = a.let("dataType", (0, dt._)`typeof ${u}`), v = a.let("coerced", (0, dt._)`undefined`);
  f.coerceTypes === "array" && a.if((0, dt._)`${d} == 'object' && Array.isArray(${u}) && ${u}.length == 1`, () => a.assign(u, (0, dt._)`${u}[0]`).assign(d, (0, dt._)`typeof ${u}`).if(Df(n, u, f.strictNumbers), () => a.assign(v, u))), a.if((0, dt._)`${v} !== undefined`);
  for (const g of t)
    (am.has(g) || g === "array" && f.coerceTypes === "array") && p(g);
  a.else(), If(e), a.endIf(), a.if((0, dt._)`${v} !== undefined`, () => {
    a.assign(u, v), $x(e, v);
  });
  function p(g) {
    switch (g) {
      case "string":
        a.elseIf((0, dt._)`${d} == "number" || ${d} == "boolean"`).assign(v, (0, dt._)`"" + ${u}`).elseIf((0, dt._)`${u} === null`).assign(v, (0, dt._)`""`);
        return;
      case "number":
        a.elseIf((0, dt._)`${d} == "boolean" || ${u} === null
              || (${d} == "string" && ${u} && ${u} == +${u})`).assign(v, (0, dt._)`+${u}`);
        return;
      case "integer":
        a.elseIf((0, dt._)`${d} === "boolean" || ${u} === null
              || (${d} === "string" && ${u} && ${u} == +${u} && !(${u} % 1))`).assign(v, (0, dt._)`+${u}`);
        return;
      case "boolean":
        a.elseIf((0, dt._)`${u} === "false" || ${u} === 0 || ${u} === null`).assign(v, !1).elseIf((0, dt._)`${u} === "true" || ${u} === 1`).assign(v, !0);
        return;
      case "null":
        a.elseIf((0, dt._)`${u} === "" || ${u} === 0 || ${u} === false`), a.assign(v, null);
        return;
      case "array":
        a.elseIf((0, dt._)`${d} === "string" || ${d} === "number"
              || ${d} === "boolean" || ${u} === null`).assign(v, (0, dt._)`[${u}]`);
    }
  }
}
function $x({ gen: e, parentData: n, parentDataProperty: t }, a) {
  e.if((0, dt._)`${n} !== undefined`, () => e.assign((0, dt._)`${n}[${t}]`, a));
}
function cf(e, n, t, a = Zo.Correct) {
  const u = a === Zo.Correct ? dt.operators.EQ : dt.operators.NEQ;
  let f;
  switch (e) {
    case "null":
      return (0, dt._)`${n} ${u} null`;
    case "array":
      f = (0, dt._)`Array.isArray(${n})`;
      break;
    case "object":
      f = (0, dt._)`${n} && typeof ${n} == "object" && !Array.isArray(${n})`;
      break;
    case "integer":
      f = d((0, dt._)`!(${n} % 1) && !isNaN(${n})`);
      break;
    case "number":
      f = d();
      break;
    default:
      return (0, dt._)`typeof ${n} ${u} ${e}`;
  }
  return a === Zo.Correct ? f : (0, dt.not)(f);
  function d(v = dt.nil) {
    return (0, dt.and)((0, dt._)`typeof ${n} == "number"`, v, t ? (0, dt._)`isFinite(${n})` : dt.nil);
  }
}
rn.checkDataType = cf;
function Df(e, n, t, a) {
  if (e.length === 1)
    return cf(e[0], n, t, a);
  let u;
  const f = (0, im.toHash)(e);
  if (f.array && f.object) {
    const d = (0, dt._)`typeof ${n} != "object"`;
    u = f.null ? d : (0, dt._)`!${n} || ${d}`, delete f.null, delete f.array, delete f.object;
  } else
    u = dt.nil;
  f.number && delete f.integer;
  for (const d in f)
    u = (0, dt.and)(u, cf(d, n, t, a));
  return u;
}
rn.checkDataTypes = Df;
const Ex = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: n }) => typeof e == "string" ? (0, dt._)`{type: ${e}}` : (0, dt._)`{type: ${n}}`
};
function If(e) {
  const n = Cx(e);
  (0, wx.reportError)(n, Ex);
}
rn.reportTypeError = If;
function Cx(e) {
  const { gen: n, data: t, schema: a } = e, u = (0, im.schemaRefOrVal)(e, a, "type");
  return {
    gen: n,
    keyword: "type",
    data: t,
    schema: a.type,
    schemaCode: u,
    schemaValue: u,
    parentSchema: a,
    params: {},
    it: e
  };
}
var Sl = {};
Object.defineProperty(Sl, "__esModule", { value: !0 });
Sl.assignDefaults = void 0;
const Uo = mt, Ax = Me;
function Tx(e, n) {
  const { properties: t, items: a } = e.schema;
  if (n === "object" && t)
    for (const u in t)
      kp(e, u, t[u].default);
  else n === "array" && Array.isArray(a) && a.forEach((u, f) => kp(e, f, u.default));
}
Sl.assignDefaults = Tx;
function kp(e, n, t) {
  const { gen: a, compositeRule: u, data: f, opts: d } = e;
  if (t === void 0)
    return;
  const v = (0, Uo._)`${f}${(0, Uo.getProperty)(n)}`;
  if (u) {
    (0, Ax.checkStrictMode)(e, `default is ignored for: ${v}`);
    return;
  }
  let p = (0, Uo._)`${v} === undefined`;
  d.useDefaults === "empty" && (p = (0, Uo._)`${p} || ${v} === null || ${v} === ""`), a.if(p, (0, Uo._)`${v} = ${(0, Uo.stringify)(t)}`);
}
var qr = {}, gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.validateUnion = gt.validateArray = gt.usePattern = gt.callValidateCode = gt.schemaProperties = gt.allSchemaProperties = gt.noPropertyInData = gt.propertyInData = gt.isOwnProperty = gt.hasPropFunc = gt.reportMissingProp = gt.checkMissingProp = gt.checkReportMissingProp = void 0;
const Ht = mt, Ff = Me, Di = Wr, Px = Me;
function kx(e, n) {
  const { gen: t, data: a, it: u } = e;
  t.if(zf(t, a, n, u.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Ht._)`${n}` }, !0), e.error();
  });
}
gt.checkReportMissingProp = kx;
function Nx({ gen: e, data: n, it: { opts: t } }, a, u) {
  return (0, Ht.or)(...a.map((f) => (0, Ht.and)(zf(e, n, f, t.ownProperties), (0, Ht._)`${u} = ${f}`)));
}
gt.checkMissingProp = Nx;
function Ox(e, n) {
  e.setParams({ missingProperty: n }, !0), e.error();
}
gt.reportMissingProp = Ox;
function sm(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Ht._)`Object.prototype.hasOwnProperty`
  });
}
gt.hasPropFunc = sm;
function qf(e, n, t) {
  return (0, Ht._)`${sm(e)}.call(${n}, ${t})`;
}
gt.isOwnProperty = qf;
function Lx(e, n, t, a) {
  const u = (0, Ht._)`${n}${(0, Ht.getProperty)(t)} !== undefined`;
  return a ? (0, Ht._)`${u} && ${qf(e, n, t)}` : u;
}
gt.propertyInData = Lx;
function zf(e, n, t, a) {
  const u = (0, Ht._)`${n}${(0, Ht.getProperty)(t)} === undefined`;
  return a ? (0, Ht.or)(u, (0, Ht.not)(qf(e, n, t))) : u;
}
gt.noPropertyInData = zf;
function um(e) {
  return e ? Object.keys(e).filter((n) => n !== "__proto__") : [];
}
gt.allSchemaProperties = um;
function Rx(e, n) {
  return um(n).filter((t) => !(0, Ff.alwaysValidSchema)(e, n[t]));
}
gt.schemaProperties = Rx;
function Mx({ schemaCode: e, data: n, it: { gen: t, topSchemaRef: a, schemaPath: u, errorPath: f }, it: d }, v, p, g) {
  const b = g ? (0, Ht._)`${e}, ${n}, ${a}${u}` : n, w = [
    [Di.default.instancePath, (0, Ht.strConcat)(Di.default.instancePath, f)],
    [Di.default.parentData, d.parentData],
    [Di.default.parentDataProperty, d.parentDataProperty],
    [Di.default.rootData, Di.default.rootData]
  ];
  d.opts.dynamicRef && w.push([Di.default.dynamicAnchors, Di.default.dynamicAnchors]);
  const m = (0, Ht._)`${b}, ${t.object(...w)}`;
  return p !== Ht.nil ? (0, Ht._)`${v}.call(${p}, ${m})` : (0, Ht._)`${v}(${m})`;
}
gt.callValidateCode = Mx;
const Dx = (0, Ht._)`new RegExp`;
function Ix({ gen: e, it: { opts: n } }, t) {
  const a = n.unicodeRegExp ? "u" : "", { regExp: u } = n.code, f = u(t, a);
  return e.scopeValue("pattern", {
    key: f.toString(),
    ref: f,
    code: (0, Ht._)`${u.code === "new RegExp" ? Dx : (0, Px.useFunc)(e, u)}(${t}, ${a})`
  });
}
gt.usePattern = Ix;
function Fx(e) {
  const { gen: n, data: t, keyword: a, it: u } = e, f = n.name("valid");
  if (u.allErrors) {
    const v = n.let("valid", !0);
    return d(() => n.assign(v, !1)), v;
  }
  return n.var(f, !0), d(() => n.break()), f;
  function d(v) {
    const p = n.const("len", (0, Ht._)`${t}.length`);
    n.forRange("i", 0, p, (g) => {
      e.subschema({
        keyword: a,
        dataProp: g,
        dataPropType: Ff.Type.Num
      }, f), n.if((0, Ht.not)(f), v);
    });
  }
}
gt.validateArray = Fx;
function qx(e) {
  const { gen: n, schema: t, keyword: a, it: u } = e;
  if (!Array.isArray(t))
    throw new Error("ajv implementation error");
  if (t.some((p) => (0, Ff.alwaysValidSchema)(u, p)) && !u.opts.unevaluated)
    return;
  const d = n.let("valid", !1), v = n.name("_valid");
  n.block(() => t.forEach((p, g) => {
    const b = e.subschema({
      keyword: a,
      schemaProp: g,
      compositeRule: !0
    }, v);
    n.assign(d, (0, Ht._)`${d} || ${v}`), e.mergeValidEvaluated(b, v) || n.if((0, Ht.not)(d));
  })), e.result(d, () => e.reset(), () => e.error(!0));
}
gt.validateUnion = qx;
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.validateKeywordUsage = qr.validSchemaType = qr.funcKeywordCode = qr.macroKeywordCode = void 0;
const kn = mt, lo = Wr, zx = gt, Bx = bs;
function jx(e, n) {
  const { gen: t, keyword: a, schema: u, parentSchema: f, it: d } = e, v = n.macro.call(d.self, u, f, d), p = lm(t, a, v);
  d.opts.validateSchema !== !1 && d.self.validateSchema(v, !0);
  const g = t.name("valid");
  e.subschema({
    schema: v,
    schemaPath: kn.nil,
    errSchemaPath: `${d.errSchemaPath}/${a}`,
    topSchemaRef: p,
    compositeRule: !0
  }, g), e.pass(g, () => e.error(!0));
}
qr.macroKeywordCode = jx;
function Hx(e, n) {
  var t;
  const { gen: a, keyword: u, schema: f, parentSchema: d, $data: v, it: p } = e;
  Vx(p, n);
  const g = !v && n.compile ? n.compile.call(p.self, f, d, p) : n.validate, b = lm(a, u, g), w = a.let("valid");
  e.block$data(w, m), e.ok((t = n.valid) !== null && t !== void 0 ? t : w);
  function m() {
    if (n.errors === !1)
      $(), n.modifying && Np(e), E(() => e.error());
    else {
      const A = n.async ? x() : s();
      n.modifying && Np(e), E(() => Wx(e, A));
    }
  }
  function x() {
    const A = a.let("ruleErrs", null);
    return a.try(() => $((0, kn._)`await `), (I) => a.assign(w, !1).if((0, kn._)`${I} instanceof ${p.ValidationError}`, () => a.assign(A, (0, kn._)`${I}.errors`), () => a.throw(I))), A;
  }
  function s() {
    const A = (0, kn._)`${b}.errors`;
    return a.assign(A, null), $(kn.nil), A;
  }
  function $(A = n.async ? (0, kn._)`await ` : kn.nil) {
    const I = p.opts.passContext ? lo.default.this : lo.default.self, F = !("compile" in n && !v || n.schema === !1);
    a.assign(w, (0, kn._)`${A}${(0, zx.callValidateCode)(e, b, I, F)}`, n.modifying);
  }
  function E(A) {
    var I;
    a.if((0, kn.not)((I = n.valid) !== null && I !== void 0 ? I : w), A);
  }
}
qr.funcKeywordCode = Hx;
function Np(e) {
  const { gen: n, data: t, it: a } = e;
  n.if(a.parentData, () => n.assign(t, (0, kn._)`${a.parentData}[${a.parentDataProperty}]`));
}
function Wx(e, n) {
  const { gen: t } = e;
  t.if((0, kn._)`Array.isArray(${n})`, () => {
    t.assign(lo.default.vErrors, (0, kn._)`${lo.default.vErrors} === null ? ${n} : ${lo.default.vErrors}.concat(${n})`).assign(lo.default.errors, (0, kn._)`${lo.default.vErrors}.length`), (0, Bx.extendErrors)(e);
  }, () => e.error());
}
function Vx({ schemaEnv: e }, n) {
  if (n.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function lm(e, n, t) {
  if (t === void 0)
    throw new Error(`keyword "${n}" failed to compile`);
  return e.scopeValue("keyword", typeof t == "function" ? { ref: t } : { ref: t, code: (0, kn.stringify)(t) });
}
function Ux(e, n, t = !1) {
  return !n.length || n.some((a) => a === "array" ? Array.isArray(e) : a === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == a || t && typeof e > "u");
}
qr.validSchemaType = Ux;
function Gx({ schema: e, opts: n, self: t, errSchemaPath: a }, u, f) {
  if (Array.isArray(u.keyword) ? !u.keyword.includes(f) : u.keyword !== f)
    throw new Error("ajv implementation error");
  const d = u.dependencies;
  if (d != null && d.some((v) => !Object.prototype.hasOwnProperty.call(e, v)))
    throw new Error(`parent schema must have dependencies of ${f}: ${d.join(",")}`);
  if (u.validateSchema && !u.validateSchema(e[f])) {
    const p = `keyword "${f}" value is invalid at path "${a}": ` + t.errorsText(u.validateSchema.errors);
    if (n.validateSchema === "log")
      t.logger.error(p);
    else
      throw new Error(p);
  }
}
qr.validateKeywordUsage = Gx;
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.extendSubschemaMode = zi.extendSubschemaData = zi.getSubschema = void 0;
const Fr = mt, cm = Me;
function Kx(e, { keyword: n, schemaProp: t, schema: a, schemaPath: u, errSchemaPath: f, topSchemaRef: d }) {
  if (n !== void 0 && a !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (n !== void 0) {
    const v = e.schema[n];
    return t === void 0 ? {
      schema: v,
      schemaPath: (0, Fr._)`${e.schemaPath}${(0, Fr.getProperty)(n)}`,
      errSchemaPath: `${e.errSchemaPath}/${n}`
    } : {
      schema: v[t],
      schemaPath: (0, Fr._)`${e.schemaPath}${(0, Fr.getProperty)(n)}${(0, Fr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${n}/${(0, cm.escapeFragment)(t)}`
    };
  }
  if (a !== void 0) {
    if (u === void 0 || f === void 0 || d === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: a,
      schemaPath: u,
      topSchemaRef: d,
      errSchemaPath: f
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
zi.getSubschema = Kx;
function Xx(e, n, { dataProp: t, dataPropType: a, data: u, dataTypes: f, propertyName: d }) {
  if (u !== void 0 && t !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: v } = n;
  if (t !== void 0) {
    const { errorPath: g, dataPathArr: b, opts: w } = n, m = v.let("data", (0, Fr._)`${n.data}${(0, Fr.getProperty)(t)}`, !0);
    p(m), e.errorPath = (0, Fr.str)`${g}${(0, cm.getErrorPath)(t, a, w.jsPropertySyntax)}`, e.parentDataProperty = (0, Fr._)`${t}`, e.dataPathArr = [...b, e.parentDataProperty];
  }
  if (u !== void 0) {
    const g = u instanceof Fr.Name ? u : v.let("data", u, !0);
    p(g), d !== void 0 && (e.propertyName = d);
  }
  f && (e.dataTypes = f);
  function p(g) {
    e.data = g, e.dataLevel = n.dataLevel + 1, e.dataTypes = [], n.definedProperties = /* @__PURE__ */ new Set(), e.parentData = n.data, e.dataNames = [...n.dataNames, g];
  }
}
zi.extendSubschemaData = Xx;
function Yx(e, { jtdDiscriminator: n, jtdMetadata: t, compositeRule: a, createErrors: u, allErrors: f }) {
  a !== void 0 && (e.compositeRule = a), u !== void 0 && (e.createErrors = u), f !== void 0 && (e.allErrors = f), e.jtdDiscriminator = n, e.jtdMetadata = t;
}
zi.extendSubschemaMode = Yx;
var hn = {}, fm = function e(n, t) {
  if (n === t) return !0;
  if (n && t && typeof n == "object" && typeof t == "object") {
    if (n.constructor !== t.constructor) return !1;
    var a, u, f;
    if (Array.isArray(n)) {
      if (a = n.length, a != t.length) return !1;
      for (u = a; u-- !== 0; )
        if (!e(n[u], t[u])) return !1;
      return !0;
    }
    if (n.constructor === RegExp) return n.source === t.source && n.flags === t.flags;
    if (n.valueOf !== Object.prototype.valueOf) return n.valueOf() === t.valueOf();
    if (n.toString !== Object.prototype.toString) return n.toString() === t.toString();
    if (f = Object.keys(n), a = f.length, a !== Object.keys(t).length) return !1;
    for (u = a; u-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, f[u])) return !1;
    for (u = a; u-- !== 0; ) {
      var d = f[u];
      if (!e(n[d], t[d])) return !1;
    }
    return !0;
  }
  return n !== n && t !== t;
}, dm = { exports: {} }, qi = dm.exports = function(e, n, t) {
  typeof n == "function" && (t = n, n = {}), t = n.cb || t;
  var a = typeof t == "function" ? t : t.pre || function() {
  }, u = t.post || function() {
  };
  Ku(n, a, u, e, "", e);
};
qi.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
qi.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
qi.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
qi.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Ku(e, n, t, a, u, f, d, v, p, g) {
  if (a && typeof a == "object" && !Array.isArray(a)) {
    n(a, u, f, d, v, p, g);
    for (var b in a) {
      var w = a[b];
      if (Array.isArray(w)) {
        if (b in qi.arrayKeywords)
          for (var m = 0; m < w.length; m++)
            Ku(e, n, t, w[m], u + "/" + b + "/" + m, f, u, b, a, m);
      } else if (b in qi.propsKeywords) {
        if (w && typeof w == "object")
          for (var x in w)
            Ku(e, n, t, w[x], u + "/" + b + "/" + Qx(x), f, u, b, a, x);
      } else (b in qi.keywords || e.allKeys && !(b in qi.skipKeywords)) && Ku(e, n, t, w, u + "/" + b, f, u, b, a);
    }
    t(a, u, f, d, v, p, g);
  }
}
function Qx(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Jx = dm.exports;
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.getSchemaRefs = hn.resolveUrl = hn.normalizeId = hn._getFullPath = hn.getFullPath = hn.inlineRef = void 0;
const Zx = Me, eS = fm, tS = Jx, nS = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function rS(e, n = !0) {
  return typeof e == "boolean" ? !0 : n === !0 ? !ff(e) : n ? hm(e) <= n : !1;
}
hn.inlineRef = rS;
const iS = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ff(e) {
  for (const n in e) {
    if (iS.has(n))
      return !0;
    const t = e[n];
    if (Array.isArray(t) && t.some(ff) || typeof t == "object" && ff(t))
      return !0;
  }
  return !1;
}
function hm(e) {
  let n = 0;
  for (const t in e) {
    if (t === "$ref")
      return 1 / 0;
    if (n++, !nS.has(t) && (typeof e[t] == "object" && (0, Zx.eachItem)(e[t], (a) => n += hm(a)), n === 1 / 0))
      return 1 / 0;
  }
  return n;
}
function pm(e, n = "", t) {
  t !== !1 && (n = ea(n));
  const a = e.parse(n);
  return gm(e, a);
}
hn.getFullPath = pm;
function gm(e, n) {
  return e.serialize(n).split("#")[0] + "#";
}
hn._getFullPath = gm;
const oS = /#\/?$/;
function ea(e) {
  return e ? e.replace(oS, "") : "";
}
hn.normalizeId = ea;
function aS(e, n, t) {
  return t = ea(t), e.resolve(n, t);
}
hn.resolveUrl = aS;
const sS = /^[a-z_][-a-z0-9._]*$/i;
function uS(e, n) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: t, uriResolver: a } = this.opts, u = ea(e[t] || n), f = { "": u }, d = pm(a, u, !1), v = {}, p = /* @__PURE__ */ new Set();
  return tS(e, { allKeys: !0 }, (w, m, x, s) => {
    if (s === void 0)
      return;
    const $ = d + m;
    let E = f[s];
    typeof w[t] == "string" && (E = A.call(this, w[t])), I.call(this, w.$anchor), I.call(this, w.$dynamicAnchor), f[m] = E;
    function A(F) {
      const k = this.opts.uriResolver.resolve;
      if (F = ea(E ? k(E, F) : F), p.has(F))
        throw b(F);
      p.add(F);
      let j = this.refs[F];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? g(w, j.schema, F) : F !== ea($) && (F[0] === "#" ? (g(w, v[F], F), v[F] = w) : this.refs[F] = $), F;
    }
    function I(F) {
      if (typeof F == "string") {
        if (!sS.test(F))
          throw new Error(`invalid anchor "${F}"`);
        A.call(this, `#${F}`);
      }
    }
  }), v;
  function g(w, m, x) {
    if (m !== void 0 && !eS(w, m))
      throw b(x);
  }
  function b(w) {
    return new Error(`reference "${w}" resolves to more than one schema`);
  }
}
hn.getSchemaRefs = uS;
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.getData = Er.KeywordCxt = Er.validateFunctionCode = void 0;
const mm = ia, Op = rn, Bf = di, ol = rn, lS = Sl, ns = qr, Uc = zi, ze = mt, ot = Wr, cS = hn, hi = Me, Ga = bs;
function fS(e) {
  if (wm(e) && (bm(e), ym(e))) {
    pS(e);
    return;
  }
  vm(e, () => (0, mm.topBoolOrEmptySchema)(e));
}
Er.validateFunctionCode = fS;
function vm({ gen: e, validateName: n, schema: t, schemaEnv: a, opts: u }, f) {
  u.code.es5 ? e.func(n, (0, ze._)`${ot.default.data}, ${ot.default.valCxt}`, a.$async, () => {
    e.code((0, ze._)`"use strict"; ${Lp(t, u)}`), hS(e, u), e.code(f);
  }) : e.func(n, (0, ze._)`${ot.default.data}, ${dS(u)}`, a.$async, () => e.code(Lp(t, u)).code(f));
}
function dS(e) {
  return (0, ze._)`{${ot.default.instancePath}="", ${ot.default.parentData}, ${ot.default.parentDataProperty}, ${ot.default.rootData}=${ot.default.data}${e.dynamicRef ? (0, ze._)`, ${ot.default.dynamicAnchors}={}` : ze.nil}}={}`;
}
function hS(e, n) {
  e.if(ot.default.valCxt, () => {
    e.var(ot.default.instancePath, (0, ze._)`${ot.default.valCxt}.${ot.default.instancePath}`), e.var(ot.default.parentData, (0, ze._)`${ot.default.valCxt}.${ot.default.parentData}`), e.var(ot.default.parentDataProperty, (0, ze._)`${ot.default.valCxt}.${ot.default.parentDataProperty}`), e.var(ot.default.rootData, (0, ze._)`${ot.default.valCxt}.${ot.default.rootData}`), n.dynamicRef && e.var(ot.default.dynamicAnchors, (0, ze._)`${ot.default.valCxt}.${ot.default.dynamicAnchors}`);
  }, () => {
    e.var(ot.default.instancePath, (0, ze._)`""`), e.var(ot.default.parentData, (0, ze._)`undefined`), e.var(ot.default.parentDataProperty, (0, ze._)`undefined`), e.var(ot.default.rootData, ot.default.data), n.dynamicRef && e.var(ot.default.dynamicAnchors, (0, ze._)`{}`);
  });
}
function pS(e) {
  const { schema: n, opts: t, gen: a } = e;
  vm(e, () => {
    t.$comment && n.$comment && xm(e), wS(e), a.let(ot.default.vErrors, null), a.let(ot.default.errors, 0), t.unevaluated && gS(e), _m(e), xS(e);
  });
}
function gS(e) {
  const { gen: n, validateName: t } = e;
  e.evaluated = n.const("evaluated", (0, ze._)`${t}.evaluated`), n.if((0, ze._)`${e.evaluated}.dynamicProps`, () => n.assign((0, ze._)`${e.evaluated}.props`, (0, ze._)`undefined`)), n.if((0, ze._)`${e.evaluated}.dynamicItems`, () => n.assign((0, ze._)`${e.evaluated}.items`, (0, ze._)`undefined`));
}
function Lp(e, n) {
  const t = typeof e == "object" && e[n.schemaId];
  return t && (n.code.source || n.code.process) ? (0, ze._)`/*# sourceURL=${t} */` : ze.nil;
}
function mS(e, n) {
  if (wm(e) && (bm(e), ym(e))) {
    vS(e, n);
    return;
  }
  (0, mm.boolOrEmptySchema)(e, n);
}
function ym({ schema: e, self: n }) {
  if (typeof e == "boolean")
    return !e;
  for (const t in e)
    if (n.RULES.all[t])
      return !0;
  return !1;
}
function wm(e) {
  return typeof e.schema != "boolean";
}
function vS(e, n) {
  const { schema: t, gen: a, opts: u } = e;
  u.$comment && t.$comment && xm(e), bS(e), _S(e);
  const f = a.const("_errs", ot.default.errors);
  _m(e, f), a.var(n, (0, ze._)`${f} === ${ot.default.errors}`);
}
function bm(e) {
  (0, hi.checkUnknownRules)(e), yS(e);
}
function _m(e, n) {
  if (e.opts.jtd)
    return Rp(e, [], !1, n);
  const t = (0, Op.getSchemaTypes)(e.schema), a = (0, Op.coerceAndCheckDataType)(e, t);
  Rp(e, t, !a, n);
}
function yS(e) {
  const { schema: n, errSchemaPath: t, opts: a, self: u } = e;
  n.$ref && a.ignoreKeywordsWithRef && (0, hi.schemaHasRulesButRef)(n, u.RULES) && u.logger.warn(`$ref: keywords ignored in schema at path "${t}"`);
}
function wS(e) {
  const { schema: n, opts: t } = e;
  n.default !== void 0 && t.useDefaults && t.strictSchema && (0, hi.checkStrictMode)(e, "default is ignored in the schema root");
}
function bS(e) {
  const n = e.schema[e.opts.schemaId];
  n && (e.baseId = (0, cS.resolveUrl)(e.opts.uriResolver, e.baseId, n));
}
function _S(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function xm({ gen: e, schemaEnv: n, schema: t, errSchemaPath: a, opts: u }) {
  const f = t.$comment;
  if (u.$comment === !0)
    e.code((0, ze._)`${ot.default.self}.logger.log(${f})`);
  else if (typeof u.$comment == "function") {
    const d = (0, ze.str)`${a}/$comment`, v = e.scopeValue("root", { ref: n.root });
    e.code((0, ze._)`${ot.default.self}.opts.$comment(${f}, ${d}, ${v}.schema)`);
  }
}
function xS(e) {
  const { gen: n, schemaEnv: t, validateName: a, ValidationError: u, opts: f } = e;
  t.$async ? n.if((0, ze._)`${ot.default.errors} === 0`, () => n.return(ot.default.data), () => n.throw((0, ze._)`new ${u}(${ot.default.vErrors})`)) : (n.assign((0, ze._)`${a}.errors`, ot.default.vErrors), f.unevaluated && SS(e), n.return((0, ze._)`${ot.default.errors} === 0`));
}
function SS({ gen: e, evaluated: n, props: t, items: a }) {
  t instanceof ze.Name && e.assign((0, ze._)`${n}.props`, t), a instanceof ze.Name && e.assign((0, ze._)`${n}.items`, a);
}
function Rp(e, n, t, a) {
  const { gen: u, schema: f, data: d, allErrors: v, opts: p, self: g } = e, { RULES: b } = g;
  if (f.$ref && (p.ignoreKeywordsWithRef || !(0, hi.schemaHasRulesButRef)(f, b))) {
    u.block(() => Em(e, "$ref", b.all.$ref.definition));
    return;
  }
  p.jtd || $S(e, n), u.block(() => {
    for (const m of b.rules)
      w(m);
    w(b.post);
  });
  function w(m) {
    (0, Bf.shouldUseGroup)(f, m) && (m.type ? (u.if((0, ol.checkDataType)(m.type, d, p.strictNumbers)), Mp(e, m), n.length === 1 && n[0] === m.type && t && (u.else(), (0, ol.reportTypeError)(e)), u.endIf()) : Mp(e, m), v || u.if((0, ze._)`${ot.default.errors} === ${a || 0}`));
  }
}
function Mp(e, n) {
  const { gen: t, schema: a, opts: { useDefaults: u } } = e;
  u && (0, lS.assignDefaults)(e, n.type), t.block(() => {
    for (const f of n.rules)
      (0, Bf.shouldUseRule)(a, f) && Em(e, f.keyword, f.definition, n.type);
  });
}
function $S(e, n) {
  e.schemaEnv.meta || !e.opts.strictTypes || (ES(e, n), e.opts.allowUnionTypes || CS(e, n), AS(e, e.dataTypes));
}
function ES(e, n) {
  if (n.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = n;
      return;
    }
    n.forEach((t) => {
      Sm(e.dataTypes, t) || jf(e, `type "${t}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), PS(e, n);
  }
}
function CS(e, n) {
  n.length > 1 && !(n.length === 2 && n.includes("null")) && jf(e, "use allowUnionTypes to allow union type keyword");
}
function AS(e, n) {
  const t = e.self.RULES.all;
  for (const a in t) {
    const u = t[a];
    if (typeof u == "object" && (0, Bf.shouldUseRule)(e.schema, u)) {
      const { type: f } = u.definition;
      f.length && !f.some((d) => TS(n, d)) && jf(e, `missing type "${f.join(",")}" for keyword "${a}"`);
    }
  }
}
function TS(e, n) {
  return e.includes(n) || n === "number" && e.includes("integer");
}
function Sm(e, n) {
  return e.includes(n) || n === "integer" && e.includes("number");
}
function PS(e, n) {
  const t = [];
  for (const a of e.dataTypes)
    Sm(n, a) ? t.push(a) : n.includes("integer") && a === "number" && t.push("integer");
  e.dataTypes = t;
}
function jf(e, n) {
  const t = e.schemaEnv.baseId + e.errSchemaPath;
  n += ` at "${t}" (strictTypes)`, (0, hi.checkStrictMode)(e, n, e.opts.strictTypes);
}
class $m {
  constructor(n, t, a) {
    if ((0, ns.validateKeywordUsage)(n, t, a), this.gen = n.gen, this.allErrors = n.allErrors, this.keyword = a, this.data = n.data, this.schema = n.schema[a], this.$data = t.$data && n.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, hi.schemaRefOrVal)(n, this.schema, a, this.$data), this.schemaType = t.schemaType, this.parentSchema = n.schema, this.params = {}, this.it = n, this.def = t, this.$data)
      this.schemaCode = n.gen.const("vSchema", Cm(this.$data, n));
    else if (this.schemaCode = this.schemaValue, !(0, ns.validSchemaType)(this.schema, t.schemaType, t.allowUndefined))
      throw new Error(`${a} value must be ${JSON.stringify(t.schemaType)}`);
    ("code" in t ? t.trackErrors : t.errors !== !1) && (this.errsCount = n.gen.const("_errs", ot.default.errors));
  }
  result(n, t, a) {
    this.failResult((0, ze.not)(n), t, a);
  }
  failResult(n, t, a) {
    this.gen.if(n), a ? a() : this.error(), t ? (this.gen.else(), t(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(n, t) {
    this.failResult((0, ze.not)(n), void 0, t);
  }
  fail(n) {
    if (n === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(n), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(n) {
    if (!this.$data)
      return this.fail(n);
    const { schemaCode: t } = this;
    this.fail((0, ze._)`${t} !== undefined && (${(0, ze.or)(this.invalid$data(), n)})`);
  }
  error(n, t, a) {
    if (t) {
      this.setParams(t), this._error(n, a), this.setParams({});
      return;
    }
    this._error(n, a);
  }
  _error(n, t) {
    (n ? Ga.reportExtraError : Ga.reportError)(this, this.def.error, t);
  }
  $dataError() {
    (0, Ga.reportError)(this, this.def.$dataError || Ga.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ga.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(n) {
    this.allErrors || this.gen.if(n);
  }
  setParams(n, t) {
    t ? Object.assign(this.params, n) : this.params = n;
  }
  block$data(n, t, a = ze.nil) {
    this.gen.block(() => {
      this.check$data(n, a), t();
    });
  }
  check$data(n = ze.nil, t = ze.nil) {
    if (!this.$data)
      return;
    const { gen: a, schemaCode: u, schemaType: f, def: d } = this;
    a.if((0, ze.or)((0, ze._)`${u} === undefined`, t)), n !== ze.nil && a.assign(n, !0), (f.length || d.validateSchema) && (a.elseIf(this.invalid$data()), this.$dataError(), n !== ze.nil && a.assign(n, !1)), a.else();
  }
  invalid$data() {
    const { gen: n, schemaCode: t, schemaType: a, def: u, it: f } = this;
    return (0, ze.or)(d(), v());
    function d() {
      if (a.length) {
        if (!(t instanceof ze.Name))
          throw new Error("ajv implementation error");
        const p = Array.isArray(a) ? a : [a];
        return (0, ze._)`${(0, ol.checkDataTypes)(p, t, f.opts.strictNumbers, ol.DataType.Wrong)}`;
      }
      return ze.nil;
    }
    function v() {
      if (u.validateSchema) {
        const p = n.scopeValue("validate$data", { ref: u.validateSchema });
        return (0, ze._)`!${p}(${t})`;
      }
      return ze.nil;
    }
  }
  subschema(n, t) {
    const a = (0, Uc.getSubschema)(this.it, n);
    (0, Uc.extendSubschemaData)(a, this.it, n), (0, Uc.extendSubschemaMode)(a, n);
    const u = { ...this.it, ...a, items: void 0, props: void 0 };
    return mS(u, t), u;
  }
  mergeEvaluated(n, t) {
    const { it: a, gen: u } = this;
    a.opts.unevaluated && (a.props !== !0 && n.props !== void 0 && (a.props = hi.mergeEvaluated.props(u, n.props, a.props, t)), a.items !== !0 && n.items !== void 0 && (a.items = hi.mergeEvaluated.items(u, n.items, a.items, t)));
  }
  mergeValidEvaluated(n, t) {
    const { it: a, gen: u } = this;
    if (a.opts.unevaluated && (a.props !== !0 || a.items !== !0))
      return u.if(t, () => this.mergeEvaluated(n, ze.Name)), !0;
  }
}
Er.KeywordCxt = $m;
function Em(e, n, t, a) {
  const u = new $m(e, t, n);
  "code" in t ? t.code(u, a) : u.$data && t.validate ? (0, ns.funcKeywordCode)(u, t) : "macro" in t ? (0, ns.macroKeywordCode)(u, t) : (t.compile || t.validate) && (0, ns.funcKeywordCode)(u, t);
}
const kS = /^\/(?:[^~]|~0|~1)*$/, NS = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Cm(e, { dataLevel: n, dataNames: t, dataPathArr: a }) {
  let u, f;
  if (e === "")
    return ot.default.rootData;
  if (e[0] === "/") {
    if (!kS.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    u = e, f = ot.default.rootData;
  } else {
    const g = NS.exec(e);
    if (!g)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const b = +g[1];
    if (u = g[2], u === "#") {
      if (b >= n)
        throw new Error(p("property/index", b));
      return a[n - b];
    }
    if (b > n)
      throw new Error(p("data", b));
    if (f = t[n - b], !u)
      return f;
  }
  let d = f;
  const v = u.split("/");
  for (const g of v)
    g && (f = (0, ze._)`${f}${(0, ze.getProperty)((0, hi.unescapeJsonPointer)(g))}`, d = (0, ze._)`${d} && ${f}`);
  return d;
  function p(g, b) {
    return `Cannot access ${g} ${b} levels up, current level is ${n}`;
  }
}
Er.getData = Cm;
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
class OS extends Error {
  constructor(n) {
    super("validation failed"), this.errors = n, this.ajv = this.validation = !0;
  }
}
_s.default = OS;
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
const Gc = hn;
class LS extends Error {
  constructor(n, t, a, u) {
    super(u || `can't resolve reference ${a} from id ${t}`), this.missingRef = (0, Gc.resolveUrl)(n, t, a), this.missingSchema = (0, Gc.normalizeId)((0, Gc.getFullPath)(n, this.missingRef));
  }
}
ha.default = LS;
var Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.resolveSchema = Fn.getCompilingSchema = Fn.resolveRef = Fn.compileSchema = Fn.SchemaEnv = void 0;
const wr = mt, RS = _s, ao = Wr, Sr = hn, Dp = Me, MS = Er;
class $l {
  constructor(n) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let a;
    typeof n.schema == "object" && (a = n.schema), this.schema = n.schema, this.schemaId = n.schemaId, this.root = n.root || this, this.baseId = (t = n.baseId) !== null && t !== void 0 ? t : (0, Sr.normalizeId)(a == null ? void 0 : a[n.schemaId || "$id"]), this.schemaPath = n.schemaPath, this.localRefs = n.localRefs, this.meta = n.meta, this.$async = a == null ? void 0 : a.$async, this.refs = {};
  }
}
Fn.SchemaEnv = $l;
function Hf(e) {
  const n = Am.call(this, e);
  if (n)
    return n;
  const t = (0, Sr.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: a, lines: u } = this.opts.code, { ownProperties: f } = this.opts, d = new wr.CodeGen(this.scope, { es5: a, lines: u, ownProperties: f });
  let v;
  e.$async && (v = d.scopeValue("Error", {
    ref: RS.default,
    code: (0, wr._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const p = d.scopeName("validate");
  e.validateName = p;
  const g = {
    gen: d,
    allErrors: this.opts.allErrors,
    data: ao.default.data,
    parentData: ao.default.parentData,
    parentDataProperty: ao.default.parentDataProperty,
    dataNames: [ao.default.data],
    dataPathArr: [wr.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: d.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, wr.stringify)(e.schema) } : { ref: e.schema }),
    validateName: p,
    ValidationError: v,
    schema: e.schema,
    schemaEnv: e,
    rootId: t,
    baseId: e.baseId || t,
    schemaPath: wr.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, wr._)`""`,
    opts: this.opts,
    self: this
  };
  let b;
  try {
    this._compilations.add(e), (0, MS.validateFunctionCode)(g), d.optimize(this.opts.code.optimize);
    const w = d.toString();
    b = `${d.scopeRefs(ao.default.scope)}return ${w}`, this.opts.code.process && (b = this.opts.code.process(b, e));
    const x = new Function(`${ao.default.self}`, `${ao.default.scope}`, b)(this, this.scope.get());
    if (this.scope.value(p, { ref: x }), x.errors = null, x.schema = e.schema, x.schemaEnv = e, e.$async && (x.$async = !0), this.opts.code.source === !0 && (x.source = { validateName: p, validateCode: w, scopeValues: d._values }), this.opts.unevaluated) {
      const { props: s, items: $ } = g;
      x.evaluated = {
        props: s instanceof wr.Name ? void 0 : s,
        items: $ instanceof wr.Name ? void 0 : $,
        dynamicProps: s instanceof wr.Name,
        dynamicItems: $ instanceof wr.Name
      }, x.source && (x.source.evaluated = (0, wr.stringify)(x.evaluated));
    }
    return e.validate = x, e;
  } catch (w) {
    throw delete e.validate, delete e.validateName, b && this.logger.error("Error compiling schema, function code:", b), w;
  } finally {
    this._compilations.delete(e);
  }
}
Fn.compileSchema = Hf;
function DS(e, n, t) {
  var a;
  t = (0, Sr.resolveUrl)(this.opts.uriResolver, n, t);
  const u = e.refs[t];
  if (u)
    return u;
  let f = qS.call(this, e, t);
  if (f === void 0) {
    const d = (a = e.localRefs) === null || a === void 0 ? void 0 : a[t], { schemaId: v } = this.opts;
    d && (f = new $l({ schema: d, schemaId: v, root: e, baseId: n }));
  }
  if (f !== void 0)
    return e.refs[t] = IS.call(this, f);
}
Fn.resolveRef = DS;
function IS(e) {
  return (0, Sr.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Hf.call(this, e);
}
function Am(e) {
  for (const n of this._compilations)
    if (FS(n, e))
      return n;
}
Fn.getCompilingSchema = Am;
function FS(e, n) {
  return e.schema === n.schema && e.root === n.root && e.baseId === n.baseId;
}
function qS(e, n) {
  let t;
  for (; typeof (t = this.refs[n]) == "string"; )
    n = t;
  return t || this.schemas[n] || El.call(this, e, n);
}
function El(e, n) {
  const t = this.opts.uriResolver.parse(n), a = (0, Sr._getFullPath)(this.opts.uriResolver, t);
  let u = (0, Sr.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && a === u)
    return Kc.call(this, t, e);
  const f = (0, Sr.normalizeId)(a), d = this.refs[f] || this.schemas[f];
  if (typeof d == "string") {
    const v = El.call(this, e, d);
    return typeof (v == null ? void 0 : v.schema) != "object" ? void 0 : Kc.call(this, t, v);
  }
  if (typeof (d == null ? void 0 : d.schema) == "object") {
    if (d.validate || Hf.call(this, d), f === (0, Sr.normalizeId)(n)) {
      const { schema: v } = d, { schemaId: p } = this.opts, g = v[p];
      return g && (u = (0, Sr.resolveUrl)(this.opts.uriResolver, u, g)), new $l({ schema: v, schemaId: p, root: e, baseId: u });
    }
    return Kc.call(this, t, d);
  }
}
Fn.resolveSchema = El;
const zS = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Kc(e, { baseId: n, schema: t, root: a }) {
  var u;
  if (((u = e.fragment) === null || u === void 0 ? void 0 : u[0]) !== "/")
    return;
  for (const v of e.fragment.slice(1).split("/")) {
    if (typeof t == "boolean")
      return;
    const p = t[(0, Dp.unescapeFragment)(v)];
    if (p === void 0)
      return;
    t = p;
    const g = typeof t == "object" && t[this.opts.schemaId];
    !zS.has(v) && g && (n = (0, Sr.resolveUrl)(this.opts.uriResolver, n, g));
  }
  let f;
  if (typeof t != "boolean" && t.$ref && !(0, Dp.schemaHasRulesButRef)(t, this.RULES)) {
    const v = (0, Sr.resolveUrl)(this.opts.uriResolver, n, t.$ref);
    f = El.call(this, a, v);
  }
  const { schemaId: d } = this.opts;
  if (f = f || new $l({ schema: t, schemaId: d, root: a, baseId: n }), f.schema !== f.root.schema)
    return f;
}
const BS = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", jS = "Meta-schema for $data reference (JSON AnySchema extension proposal)", HS = "object", WS = [
  "$data"
], VS = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, US = !1, GS = {
  $id: BS,
  description: jS,
  type: HS,
  required: WS,
  properties: VS,
  additionalProperties: US
};
var Wf = {}, Cl = { exports: {} };
const KS = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};
var XS = {
  HEX: KS
};
const { HEX: YS } = XS;
function Tm(e) {
  if (km(e, ".") < 3)
    return { host: e, isIPV4: !1 };
  const n = e.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u) || [], [t] = n;
  return t ? { host: JS(t, "."), isIPV4: !0 } : { host: e, isIPV4: !1 };
}
function df(e, n = !1) {
  let t = "", a = !0;
  for (const u of e) {
    if (YS[u] === void 0) return;
    u !== "0" && a === !0 && (a = !1), a || (t += u);
  }
  return n && t.length === 0 && (t = "0"), t;
}
function QS(e) {
  let n = 0;
  const t = { error: !1, address: "", zone: "" }, a = [], u = [];
  let f = !1, d = !1, v = !1;
  function p() {
    if (u.length) {
      if (f === !1) {
        const g = df(u);
        if (g !== void 0)
          a.push(g);
        else
          return t.error = !0, !1;
      }
      u.length = 0;
    }
    return !0;
  }
  for (let g = 0; g < e.length; g++) {
    const b = e[g];
    if (!(b === "[" || b === "]"))
      if (b === ":") {
        if (d === !0 && (v = !0), !p())
          break;
        if (n++, a.push(":"), n > 7) {
          t.error = !0;
          break;
        }
        g - 1 >= 0 && e[g - 1] === ":" && (d = !0);
        continue;
      } else if (b === "%") {
        if (!p())
          break;
        f = !0;
      } else {
        u.push(b);
        continue;
      }
  }
  return u.length && (f ? t.zone = u.join("") : v ? a.push(u.join("")) : a.push(df(u))), t.address = a.join(""), t;
}
function Pm(e, n = {}) {
  if (km(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = QS(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let a = t.address, u = t.address;
    return t.zone && (a += "%" + t.zone, u += "%25" + t.zone), { host: a, escapedHost: u, isIPV6: !0 };
  }
}
function JS(e, n) {
  let t = "", a = !0;
  const u = e.length;
  for (let f = 0; f < u; f++) {
    const d = e[f];
    d === "0" && a ? (f + 1 <= u && e[f + 1] === n || f + 1 === u) && (t += d, a = !1) : (d === n ? a = !0 : a = !1, t += d);
  }
  return t;
}
function km(e, n) {
  let t = 0;
  for (let a = 0; a < e.length; a++)
    e[a] === n && t++;
  return t;
}
const Ip = /^\.\.?\//u, Fp = /^\/\.(?:\/|$)/u, qp = /^\/\.\.(?:\/|$)/u, ZS = /^\/?(?:.|\n)*?(?=\/|$)/u;
function e$(e) {
  const n = [];
  for (; e.length; )
    if (e.match(Ip))
      e = e.replace(Ip, "");
    else if (e.match(Fp))
      e = e.replace(Fp, "/");
    else if (e.match(qp))
      e = e.replace(qp, "/"), n.pop();
    else if (e === "." || e === "..")
      e = "";
    else {
      const t = e.match(ZS);
      if (t) {
        const a = t[0];
        e = e.slice(a.length), n.push(a);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return n.join("");
}
function t$(e, n) {
  const t = n !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = t(e.scheme)), e.userinfo !== void 0 && (e.userinfo = t(e.userinfo)), e.host !== void 0 && (e.host = t(e.host)), e.path !== void 0 && (e.path = t(e.path)), e.query !== void 0 && (e.query = t(e.query)), e.fragment !== void 0 && (e.fragment = t(e.fragment)), e;
}
function n$(e, n) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let a = unescape(e.host);
    const u = Tm(a);
    if (u.isIPV4)
      a = u.host;
    else {
      const f = Pm(u.host, { isIPV4: !1 });
      f.isIPV6 === !0 ? a = `[${f.escapedHost}]` : a = e.host;
    }
    t.push(a);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var r$ = {
  recomposeAuthority: n$,
  normalizeComponentEncoding: t$,
  removeDotSegments: e$,
  normalizeIPv4: Tm,
  normalizeIPv6: Pm,
  stringArrayToHexStripped: df
};
const i$ = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, o$ = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Nm(e) {
  return typeof e.secure == "boolean" ? e.secure : String(e.scheme).toLowerCase() === "wss";
}
function Om(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Lm(e) {
  const n = String(e.scheme).toLowerCase() === "https";
  return (e.port === (n ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function a$(e) {
  return e.secure = Nm(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function s$(e) {
  if ((e.port === (Nm(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [n, t] = e.resourceName.split("?");
    e.path = n && n !== "/" ? n : void 0, e.query = t, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function u$(e, n) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const t = e.path.match(o$);
  if (t) {
    const a = n.scheme || e.scheme || "urn";
    e.nid = t[1].toLowerCase(), e.nss = t[2];
    const u = `${a}:${n.nid || e.nid}`, f = Vf[u];
    e.path = void 0, f && (e = f.parse(e, n));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function l$(e, n) {
  const t = n.scheme || e.scheme || "urn", a = e.nid.toLowerCase(), u = `${t}:${n.nid || a}`, f = Vf[u];
  f && (e = f.serialize(e, n));
  const d = e, v = e.nss;
  return d.path = `${a || n.nid}:${v}`, n.skipEscape = !0, d;
}
function c$(e, n) {
  const t = e;
  return t.uuid = t.nss, t.nss = void 0, !n.tolerant && (!t.uuid || !i$.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
}
function f$(e) {
  const n = e;
  return n.nss = (e.uuid || "").toLowerCase(), n;
}
const Rm = {
  scheme: "http",
  domainHost: !0,
  parse: Om,
  serialize: Lm
}, d$ = {
  scheme: "https",
  domainHost: Rm.domainHost,
  parse: Om,
  serialize: Lm
}, Xu = {
  scheme: "ws",
  domainHost: !0,
  parse: a$,
  serialize: s$
}, h$ = {
  scheme: "wss",
  domainHost: Xu.domainHost,
  parse: Xu.parse,
  serialize: Xu.serialize
}, p$ = {
  scheme: "urn",
  parse: u$,
  serialize: l$,
  skipNormalize: !0
}, g$ = {
  scheme: "urn:uuid",
  parse: c$,
  serialize: f$,
  skipNormalize: !0
}, Vf = {
  http: Rm,
  https: d$,
  ws: Xu,
  wss: h$,
  urn: p$,
  "urn:uuid": g$
};
var m$ = Vf;
const { normalizeIPv6: v$, normalizeIPv4: y$, removeDotSegments: Ja, recomposeAuthority: w$, normalizeComponentEncoding: Lu } = r$, Uf = m$;
function b$(e, n) {
  return typeof e == "string" ? e = zr(pi(e, n), n) : typeof e == "object" && (e = pi(zr(e, n), n)), e;
}
function _$(e, n, t) {
  const a = Object.assign({ scheme: "null" }, t), u = Mm(pi(e, a), pi(n, a), a, !0);
  return zr(u, { ...a, skipEscape: !0 });
}
function Mm(e, n, t, a) {
  const u = {};
  return a || (e = pi(zr(e, t), t), n = pi(zr(n, t), t)), t = t || {}, !t.tolerant && n.scheme ? (u.scheme = n.scheme, u.userinfo = n.userinfo, u.host = n.host, u.port = n.port, u.path = Ja(n.path || ""), u.query = n.query) : (n.userinfo !== void 0 || n.host !== void 0 || n.port !== void 0 ? (u.userinfo = n.userinfo, u.host = n.host, u.port = n.port, u.path = Ja(n.path || ""), u.query = n.query) : (n.path ? (n.path.charAt(0) === "/" ? u.path = Ja(n.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? u.path = "/" + n.path : e.path ? u.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + n.path : u.path = n.path, u.path = Ja(u.path)), u.query = n.query) : (u.path = e.path, n.query !== void 0 ? u.query = n.query : u.query = e.query), u.userinfo = e.userinfo, u.host = e.host, u.port = e.port), u.scheme = e.scheme), u.fragment = n.fragment, u;
}
function x$(e, n, t) {
  return typeof e == "string" ? (e = unescape(e), e = zr(Lu(pi(e, t), !0), { ...t, skipEscape: !0 })) : typeof e == "object" && (e = zr(Lu(e, !0), { ...t, skipEscape: !0 })), typeof n == "string" ? (n = unescape(n), n = zr(Lu(pi(n, t), !0), { ...t, skipEscape: !0 })) : typeof n == "object" && (n = zr(Lu(n, !0), { ...t, skipEscape: !0 })), e.toLowerCase() === n.toLowerCase();
}
function zr(e, n) {
  const t = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, a = Object.assign({}, n), u = [], f = Uf[(a.scheme || t.scheme || "").toLowerCase()];
  f && f.serialize && f.serialize(t, a), t.path !== void 0 && (a.skipEscape ? t.path = unescape(t.path) : (t.path = escape(t.path), t.scheme !== void 0 && (t.path = t.path.split("%3A").join(":")))), a.reference !== "suffix" && t.scheme && (u.push(t.scheme), u.push(":"));
  const d = w$(t, a);
  if (d !== void 0 && (a.reference !== "suffix" && u.push("//"), u.push(d), t.path && t.path.charAt(0) !== "/" && u.push("/")), t.path !== void 0) {
    let v = t.path;
    !a.absolutePath && (!f || !f.absolutePath) && (v = Ja(v)), d === void 0 && (v = v.replace(/^\/\//u, "/%2F")), u.push(v);
  }
  return t.query !== void 0 && (u.push("?"), u.push(t.query)), t.fragment !== void 0 && (u.push("#"), u.push(t.fragment)), u.join("");
}
const S$ = Array.from({ length: 127 }, (e, n) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(n)));
function $$(e) {
  let n = 0;
  for (let t = 0, a = e.length; t < a; ++t)
    if (n = e.charCodeAt(t), n > 126 || S$[n])
      return !0;
  return !1;
}
const E$ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function pi(e, n) {
  const t = Object.assign({}, n), a = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  }, u = e.indexOf("%") !== -1;
  let f = !1;
  t.reference === "suffix" && (e = (t.scheme ? t.scheme + ":" : "") + "//" + e);
  const d = e.match(E$);
  if (d) {
    if (a.scheme = d[1], a.userinfo = d[3], a.host = d[4], a.port = parseInt(d[5], 10), a.path = d[6] || "", a.query = d[7], a.fragment = d[8], isNaN(a.port) && (a.port = d[5]), a.host) {
      const p = y$(a.host);
      if (p.isIPV4 === !1) {
        const g = v$(p.host, { isIPV4: !1 });
        a.host = g.host.toLowerCase(), f = g.isIPV6;
      } else
        a.host = p.host, f = !0;
    }
    a.scheme === void 0 && a.userinfo === void 0 && a.host === void 0 && a.port === void 0 && !a.path && a.query === void 0 ? a.reference = "same-document" : a.scheme === void 0 ? a.reference = "relative" : a.fragment === void 0 ? a.reference = "absolute" : a.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== a.reference && (a.error = a.error || "URI is not a " + t.reference + " reference.");
    const v = Uf[(t.scheme || a.scheme || "").toLowerCase()];
    if (!t.unicodeSupport && (!v || !v.unicodeSupport) && a.host && (t.domainHost || v && v.domainHost) && f === !1 && $$(a.host))
      try {
        a.host = URL.domainToASCII(a.host.toLowerCase());
      } catch (p) {
        a.error = a.error || "Host's domain name can not be converted to ASCII: " + p;
      }
    (!v || v && !v.skipNormalize) && (u && a.scheme !== void 0 && (a.scheme = unescape(a.scheme)), u && a.userinfo !== void 0 && (a.userinfo = unescape(a.userinfo)), u && a.host !== void 0 && (a.host = unescape(a.host)), a.path !== void 0 && a.path.length && (a.path = escape(unescape(a.path))), a.fragment !== void 0 && a.fragment.length && (a.fragment = encodeURI(decodeURIComponent(a.fragment)))), v && v.parse && v.parse(a, t);
  } else
    a.error = a.error || "URI can not be parsed.";
  return a;
}
const Gf = {
  SCHEMES: Uf,
  normalize: b$,
  resolve: _$,
  resolveComponents: Mm,
  equal: x$,
  serialize: zr,
  parse: pi
};
Cl.exports = Gf;
Cl.exports.default = Gf;
Cl.exports.fastUri = Gf;
var C$ = Cl.exports;
Object.defineProperty(Wf, "__esModule", { value: !0 });
const Dm = C$;
Dm.code = 'require("ajv/dist/runtime/uri").default';
Wf.default = Dm;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var n = Er;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return n.KeywordCxt;
  } });
  var t = mt;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return t._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return t.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return t.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return t.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return t.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return t.CodeGen;
  } });
  const a = _s, u = ha, f = mo, d = Fn, v = mt, p = hn, g = rn, b = Me, w = GS, m = Wf, x = (ae, R) => new RegExp(ae, R);
  x.code = "new RegExp";
  const s = ["removeAdditional", "useDefaults", "coerceTypes"], $ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), E = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, A = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, I = 200;
  function F(ae) {
    var R, te, Y, L, B, re, xe, be, Ge, et, Ke, Ie, ue, we, $e, at, vt, xt, Ut, Nt, Ft, Mt, Et, Sn, pn;
    const $n = ae.strict, gn = (R = ae.code) === null || R === void 0 ? void 0 : R.optimize, un = gn === !0 || gn === void 0 ? 1 : gn || 0, Kn = (Y = (te = ae.code) === null || te === void 0 ? void 0 : te.regExp) !== null && Y !== void 0 ? Y : x, Ur = (L = ae.uriResolver) !== null && L !== void 0 ? L : m.default;
    return {
      strictSchema: (re = (B = ae.strictSchema) !== null && B !== void 0 ? B : $n) !== null && re !== void 0 ? re : !0,
      strictNumbers: (be = (xe = ae.strictNumbers) !== null && xe !== void 0 ? xe : $n) !== null && be !== void 0 ? be : !0,
      strictTypes: (et = (Ge = ae.strictTypes) !== null && Ge !== void 0 ? Ge : $n) !== null && et !== void 0 ? et : "log",
      strictTuples: (Ie = (Ke = ae.strictTuples) !== null && Ke !== void 0 ? Ke : $n) !== null && Ie !== void 0 ? Ie : "log",
      strictRequired: (we = (ue = ae.strictRequired) !== null && ue !== void 0 ? ue : $n) !== null && we !== void 0 ? we : !1,
      code: ae.code ? { ...ae.code, optimize: un, regExp: Kn } : { optimize: un, regExp: Kn },
      loopRequired: ($e = ae.loopRequired) !== null && $e !== void 0 ? $e : I,
      loopEnum: (at = ae.loopEnum) !== null && at !== void 0 ? at : I,
      meta: (vt = ae.meta) !== null && vt !== void 0 ? vt : !0,
      messages: (xt = ae.messages) !== null && xt !== void 0 ? xt : !0,
      inlineRefs: (Ut = ae.inlineRefs) !== null && Ut !== void 0 ? Ut : !0,
      schemaId: (Nt = ae.schemaId) !== null && Nt !== void 0 ? Nt : "$id",
      addUsedSchema: (Ft = ae.addUsedSchema) !== null && Ft !== void 0 ? Ft : !0,
      validateSchema: (Mt = ae.validateSchema) !== null && Mt !== void 0 ? Mt : !0,
      validateFormats: (Et = ae.validateFormats) !== null && Et !== void 0 ? Et : !0,
      unicodeRegExp: (Sn = ae.unicodeRegExp) !== null && Sn !== void 0 ? Sn : !0,
      int32range: (pn = ae.int32range) !== null && pn !== void 0 ? pn : !0,
      uriResolver: Ur
    };
  }
  class k {
    constructor(R = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), R = this.opts = { ...R, ...F(R) };
      const { es5: te, lines: Y } = this.opts.code;
      this.scope = new v.ValueScope({ scope: {}, prefixes: $, es5: te, lines: Y }), this.logger = We(R.logger);
      const L = R.validateFormats;
      R.validateFormats = !1, this.RULES = (0, f.getRules)(), j.call(this, E, R, "NOT SUPPORTED"), j.call(this, A, R, "DEPRECATED", "warn"), this._metaOpts = Ee.call(this), R.formats && Se.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), R.keywords && Ce.call(this, R.keywords), typeof R.meta == "object" && this.addMetaSchema(R.meta), ne.call(this), R.validateFormats = L;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: R, meta: te, schemaId: Y } = this.opts;
      let L = w;
      Y === "id" && (L = { ...w }, L.id = L.$id, delete L.$id), te && R && this.addMetaSchema(L, L[Y], !1);
    }
    defaultMeta() {
      const { meta: R, schemaId: te } = this.opts;
      return this.opts.defaultMeta = typeof R == "object" ? R[te] || R : void 0;
    }
    validate(R, te) {
      let Y;
      if (typeof R == "string") {
        if (Y = this.getSchema(R), !Y)
          throw new Error(`no schema with key or ref "${R}"`);
      } else
        Y = this.compile(R);
      const L = Y(te);
      return "$async" in Y || (this.errors = Y.errors), L;
    }
    compile(R, te) {
      const Y = this._addSchema(R, te);
      return Y.validate || this._compileSchemaEnv(Y);
    }
    compileAsync(R, te) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: Y } = this.opts;
      return L.call(this, R, te);
      async function L(et, Ke) {
        await B.call(this, et.$schema);
        const Ie = this._addSchema(et, Ke);
        return Ie.validate || re.call(this, Ie);
      }
      async function B(et) {
        et && !this.getSchema(et) && await L.call(this, { $ref: et }, !0);
      }
      async function re(et) {
        try {
          return this._compileSchemaEnv(et);
        } catch (Ke) {
          if (!(Ke instanceof u.default))
            throw Ke;
          return xe.call(this, Ke), await be.call(this, Ke.missingSchema), re.call(this, et);
        }
      }
      function xe({ missingSchema: et, missingRef: Ke }) {
        if (this.refs[et])
          throw new Error(`AnySchema ${et} is loaded but ${Ke} cannot be resolved`);
      }
      async function be(et) {
        const Ke = await Ge.call(this, et);
        this.refs[et] || await B.call(this, Ke.$schema), this.refs[et] || this.addSchema(Ke, et, te);
      }
      async function Ge(et) {
        const Ke = this._loading[et];
        if (Ke)
          return Ke;
        try {
          return await (this._loading[et] = Y(et));
        } finally {
          delete this._loading[et];
        }
      }
    }
    // Adds schema to the instance
    addSchema(R, te, Y, L = this.opts.validateSchema) {
      if (Array.isArray(R)) {
        for (const re of R)
          this.addSchema(re, void 0, Y, L);
        return this;
      }
      let B;
      if (typeof R == "object") {
        const { schemaId: re } = this.opts;
        if (B = R[re], B !== void 0 && typeof B != "string")
          throw new Error(`schema ${re} must be string`);
      }
      return te = (0, p.normalizeId)(te || B), this._checkUnique(te), this.schemas[te] = this._addSchema(R, Y, te, L, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(R, te, Y = this.opts.validateSchema) {
      return this.addSchema(R, te, !0, Y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(R, te) {
      if (typeof R == "boolean")
        return !0;
      let Y;
      if (Y = R.$schema, Y !== void 0 && typeof Y != "string")
        throw new Error("$schema must be a string");
      if (Y = Y || this.opts.defaultMeta || this.defaultMeta(), !Y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const L = this.validate(Y, R);
      if (!L && te) {
        const B = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(B);
        else
          throw new Error(B);
      }
      return L;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(R) {
      let te;
      for (; typeof (te = U.call(this, R)) == "string"; )
        R = te;
      if (te === void 0) {
        const { schemaId: Y } = this.opts, L = new d.SchemaEnv({ schema: {}, schemaId: Y });
        if (te = d.resolveSchema.call(this, L, R), !te)
          return;
        this.refs[R] = te;
      }
      return te.validate || this._compileSchemaEnv(te);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(R) {
      if (R instanceof RegExp)
        return this._removeAllSchemas(this.schemas, R), this._removeAllSchemas(this.refs, R), this;
      switch (typeof R) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const te = U.call(this, R);
          return typeof te == "object" && this._cache.delete(te.schema), delete this.schemas[R], delete this.refs[R], this;
        }
        case "object": {
          const te = R;
          this._cache.delete(te);
          let Y = R[this.opts.schemaId];
          return Y && (Y = (0, p.normalizeId)(Y), delete this.schemas[Y], delete this.refs[Y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(R) {
      for (const te of R)
        this.addKeyword(te);
      return this;
    }
    addKeyword(R, te) {
      let Y;
      if (typeof R == "string")
        Y = R, typeof te == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), te.keyword = Y);
      else if (typeof R == "object" && te === void 0) {
        if (te = R, Y = te.keyword, Array.isArray(Y) && !Y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (J.call(this, Y, te), !te)
        return (0, b.eachItem)(Y, (B) => _e.call(this, B)), this;
      pe.call(this, te);
      const L = {
        ...te,
        type: (0, g.getJSONTypes)(te.type),
        schemaType: (0, g.getJSONTypes)(te.schemaType)
      };
      return (0, b.eachItem)(Y, L.type.length === 0 ? (B) => _e.call(this, B, L) : (B) => L.type.forEach((re) => _e.call(this, B, L, re))), this;
    }
    getKeyword(R) {
      const te = this.RULES.all[R];
      return typeof te == "object" ? te.definition : !!te;
    }
    // Remove keyword
    removeKeyword(R) {
      const { RULES: te } = this;
      delete te.keywords[R], delete te.all[R];
      for (const Y of te.rules) {
        const L = Y.rules.findIndex((B) => B.keyword === R);
        L >= 0 && Y.rules.splice(L, 1);
      }
      return this;
    }
    // Add format
    addFormat(R, te) {
      return typeof te == "string" && (te = new RegExp(te)), this.formats[R] = te, this;
    }
    errorsText(R = this.errors, { separator: te = ", ", dataVar: Y = "data" } = {}) {
      return !R || R.length === 0 ? "No errors" : R.map((L) => `${Y}${L.instancePath} ${L.message}`).reduce((L, B) => L + te + B);
    }
    $dataMetaSchema(R, te) {
      const Y = this.RULES.all;
      R = JSON.parse(JSON.stringify(R));
      for (const L of te) {
        const B = L.split("/").slice(1);
        let re = R;
        for (const xe of B)
          re = re[xe];
        for (const xe in Y) {
          const be = Y[xe];
          if (typeof be != "object")
            continue;
          const { $data: Ge } = be.definition, et = re[xe];
          Ge && et && (re[xe] = Ne(et));
        }
      }
      return R;
    }
    _removeAllSchemas(R, te) {
      for (const Y in R) {
        const L = R[Y];
        (!te || te.test(Y)) && (typeof L == "string" ? delete R[Y] : L && !L.meta && (this._cache.delete(L.schema), delete R[Y]));
      }
    }
    _addSchema(R, te, Y, L = this.opts.validateSchema, B = this.opts.addUsedSchema) {
      let re;
      const { schemaId: xe } = this.opts;
      if (typeof R == "object")
        re = R[xe];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof R != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let be = this._cache.get(R);
      if (be !== void 0)
        return be;
      Y = (0, p.normalizeId)(re || Y);
      const Ge = p.getSchemaRefs.call(this, R, Y);
      return be = new d.SchemaEnv({ schema: R, schemaId: xe, meta: te, baseId: Y, localRefs: Ge }), this._cache.set(be.schema, be), B && !Y.startsWith("#") && (Y && this._checkUnique(Y), this.refs[Y] = be), L && this.validateSchema(R, !0), be;
    }
    _checkUnique(R) {
      if (this.schemas[R] || this.refs[R])
        throw new Error(`schema with key or id "${R}" already exists`);
    }
    _compileSchemaEnv(R) {
      if (R.meta ? this._compileMetaSchema(R) : d.compileSchema.call(this, R), !R.validate)
        throw new Error("ajv implementation error");
      return R.validate;
    }
    _compileMetaSchema(R) {
      const te = this.opts;
      this.opts = this._metaOpts;
      try {
        d.compileSchema.call(this, R);
      } finally {
        this.opts = te;
      }
    }
  }
  k.ValidationError = a.default, k.MissingRefError = u.default, e.default = k;
  function j(ae, R, te, Y = "error") {
    for (const L in ae) {
      const B = L;
      B in R && this.logger[Y](`${te}: option ${L}. ${ae[B]}`);
    }
  }
  function U(ae) {
    return ae = (0, p.normalizeId)(ae), this.schemas[ae] || this.refs[ae];
  }
  function ne() {
    const ae = this.opts.schemas;
    if (ae)
      if (Array.isArray(ae))
        this.addSchema(ae);
      else
        for (const R in ae)
          this.addSchema(ae[R], R);
  }
  function Se() {
    for (const ae in this.opts.formats) {
      const R = this.opts.formats[ae];
      R && this.addFormat(ae, R);
    }
  }
  function Ce(ae) {
    if (Array.isArray(ae)) {
      this.addVocabulary(ae);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const R in ae) {
      const te = ae[R];
      te.keyword || (te.keyword = R), this.addKeyword(te);
    }
  }
  function Ee() {
    const ae = { ...this.opts };
    for (const R of s)
      delete ae[R];
    return ae;
  }
  const Ae = { log() {
  }, warn() {
  }, error() {
  } };
  function We(ae) {
    if (ae === !1)
      return Ae;
    if (ae === void 0)
      return console;
    if (ae.log && ae.warn && ae.error)
      return ae;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Fe = /^[a-z_$][a-z0-9_$:-]*$/i;
  function J(ae, R) {
    const { RULES: te } = this;
    if ((0, b.eachItem)(ae, (Y) => {
      if (te.keywords[Y])
        throw new Error(`Keyword ${Y} is already defined`);
      if (!Fe.test(Y))
        throw new Error(`Keyword ${Y} has invalid name`);
    }), !!R && R.$data && !("code" in R || "validate" in R))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function _e(ae, R, te) {
    var Y;
    const L = R == null ? void 0 : R.post;
    if (te && L)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: B } = this;
    let re = L ? B.post : B.rules.find(({ type: be }) => be === te);
    if (re || (re = { type: te, rules: [] }, B.rules.push(re)), B.keywords[ae] = !0, !R)
      return;
    const xe = {
      keyword: ae,
      definition: {
        ...R,
        type: (0, g.getJSONTypes)(R.type),
        schemaType: (0, g.getJSONTypes)(R.schemaType)
      }
    };
    R.before ? oe.call(this, re, xe, R.before) : re.rules.push(xe), B.all[ae] = xe, (Y = R.implements) === null || Y === void 0 || Y.forEach((be) => this.addKeyword(be));
  }
  function oe(ae, R, te) {
    const Y = ae.rules.findIndex((L) => L.keyword === te);
    Y >= 0 ? ae.rules.splice(Y, 0, R) : (ae.rules.push(R), this.logger.warn(`rule ${te} is not defined`));
  }
  function pe(ae) {
    let { metaSchema: R } = ae;
    R !== void 0 && (ae.$data && this.opts.$data && (R = Ne(R)), ae.validateSchema = this.compile(R, !0));
  }
  const ke = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function Ne(ae) {
    return { anyOf: [ae, ke] };
  }
})(Xg);
var Kf = {}, Xf = {}, Yf = {};
Object.defineProperty(Yf, "__esModule", { value: !0 });
const A$ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Yf.default = A$;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
vo.callRef = vo.getValidate = void 0;
const T$ = ha, zp = gt, In = mt, Go = Wr, Bp = Fn, Ru = Me, P$ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: n, schema: t, it: a } = e, { baseId: u, schemaEnv: f, validateName: d, opts: v, self: p } = a, { root: g } = f;
    if ((t === "#" || t === "#/") && u === g.baseId)
      return w();
    const b = Bp.resolveRef.call(p, g, u, t);
    if (b === void 0)
      throw new T$.default(a.opts.uriResolver, u, t);
    if (b instanceof Bp.SchemaEnv)
      return m(b);
    return x(b);
    function w() {
      if (f === g)
        return Yu(e, d, f, f.$async);
      const s = n.scopeValue("root", { ref: g });
      return Yu(e, (0, In._)`${s}.validate`, g, g.$async);
    }
    function m(s) {
      const $ = Im(e, s);
      Yu(e, $, s, s.$async);
    }
    function x(s) {
      const $ = n.scopeValue("schema", v.code.source === !0 ? { ref: s, code: (0, In.stringify)(s) } : { ref: s }), E = n.name("valid"), A = e.subschema({
        schema: s,
        dataTypes: [],
        schemaPath: In.nil,
        topSchemaRef: $,
        errSchemaPath: t
      }, E);
      e.mergeEvaluated(A), e.ok(E);
    }
  }
};
function Im(e, n) {
  const { gen: t } = e;
  return n.validate ? t.scopeValue("validate", { ref: n.validate }) : (0, In._)`${t.scopeValue("wrapper", { ref: n })}.validate`;
}
vo.getValidate = Im;
function Yu(e, n, t, a) {
  const { gen: u, it: f } = e, { allErrors: d, schemaEnv: v, opts: p } = f, g = p.passContext ? Go.default.this : In.nil;
  a ? b() : w();
  function b() {
    if (!v.$async)
      throw new Error("async schema referenced by sync schema");
    const s = u.let("valid");
    u.try(() => {
      u.code((0, In._)`await ${(0, zp.callValidateCode)(e, n, g)}`), x(n), d || u.assign(s, !0);
    }, ($) => {
      u.if((0, In._)`!(${$} instanceof ${f.ValidationError})`, () => u.throw($)), m($), d || u.assign(s, !1);
    }), e.ok(s);
  }
  function w() {
    e.result((0, zp.callValidateCode)(e, n, g), () => x(n), () => m(n));
  }
  function m(s) {
    const $ = (0, In._)`${s}.errors`;
    u.assign(Go.default.vErrors, (0, In._)`${Go.default.vErrors} === null ? ${$} : ${Go.default.vErrors}.concat(${$})`), u.assign(Go.default.errors, (0, In._)`${Go.default.vErrors}.length`);
  }
  function x(s) {
    var $;
    if (!f.opts.unevaluated)
      return;
    const E = ($ = t == null ? void 0 : t.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (f.props !== !0)
      if (E && !E.dynamicProps)
        E.props !== void 0 && (f.props = Ru.mergeEvaluated.props(u, E.props, f.props));
      else {
        const A = u.var("props", (0, In._)`${s}.evaluated.props`);
        f.props = Ru.mergeEvaluated.props(u, A, f.props, In.Name);
      }
    if (f.items !== !0)
      if (E && !E.dynamicItems)
        E.items !== void 0 && (f.items = Ru.mergeEvaluated.items(u, E.items, f.items));
      else {
        const A = u.var("items", (0, In._)`${s}.evaluated.items`);
        f.items = Ru.mergeEvaluated.items(u, A, f.items, In.Name);
      }
  }
}
vo.callRef = Yu;
vo.default = P$;
Object.defineProperty(Xf, "__esModule", { value: !0 });
const k$ = Yf, N$ = vo, O$ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  k$.default,
  N$.default
];
Xf.default = O$;
var Qf = {}, Jf = {};
Object.defineProperty(Jf, "__esModule", { value: !0 });
const al = mt, Ii = al.operators, sl = {
  maximum: { okStr: "<=", ok: Ii.LTE, fail: Ii.GT },
  minimum: { okStr: ">=", ok: Ii.GTE, fail: Ii.LT },
  exclusiveMaximum: { okStr: "<", ok: Ii.LT, fail: Ii.GTE },
  exclusiveMinimum: { okStr: ">", ok: Ii.GT, fail: Ii.LTE }
}, L$ = {
  message: ({ keyword: e, schemaCode: n }) => (0, al.str)`must be ${sl[e].okStr} ${n}`,
  params: ({ keyword: e, schemaCode: n }) => (0, al._)`{comparison: ${sl[e].okStr}, limit: ${n}}`
}, R$ = {
  keyword: Object.keys(sl),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: L$,
  code(e) {
    const { keyword: n, data: t, schemaCode: a } = e;
    e.fail$data((0, al._)`${t} ${sl[n].fail} ${a} || isNaN(${t})`);
  }
};
Jf.default = R$;
var Zf = {};
Object.defineProperty(Zf, "__esModule", { value: !0 });
const rs = mt, M$ = {
  message: ({ schemaCode: e }) => (0, rs.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, rs._)`{multipleOf: ${e}}`
}, D$ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: M$,
  code(e) {
    const { gen: n, data: t, schemaCode: a, it: u } = e, f = u.opts.multipleOfPrecision, d = n.let("res"), v = f ? (0, rs._)`Math.abs(Math.round(${d}) - ${d}) > 1e-${f}` : (0, rs._)`${d} !== parseInt(${d})`;
    e.fail$data((0, rs._)`(${a} === 0 || (${d} = ${t}/${a}, ${v}))`);
  }
};
Zf.default = D$;
var ed = {}, td = {};
Object.defineProperty(td, "__esModule", { value: !0 });
function Fm(e) {
  const n = e.length;
  let t = 0, a = 0, u;
  for (; a < n; )
    t++, u = e.charCodeAt(a++), u >= 55296 && u <= 56319 && a < n && (u = e.charCodeAt(a), (u & 64512) === 56320 && a++);
  return t;
}
td.default = Fm;
Fm.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ed, "__esModule", { value: !0 });
const co = mt, I$ = Me, F$ = td, q$ = {
  message({ keyword: e, schemaCode: n }) {
    const t = e === "maxLength" ? "more" : "fewer";
    return (0, co.str)`must NOT have ${t} than ${n} characters`;
  },
  params: ({ schemaCode: e }) => (0, co._)`{limit: ${e}}`
}, z$ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: q$,
  code(e) {
    const { keyword: n, data: t, schemaCode: a, it: u } = e, f = n === "maxLength" ? co.operators.GT : co.operators.LT, d = u.opts.unicode === !1 ? (0, co._)`${t}.length` : (0, co._)`${(0, I$.useFunc)(e.gen, F$.default)}(${t})`;
    e.fail$data((0, co._)`${d} ${f} ${a}`);
  }
};
ed.default = z$;
var nd = {};
Object.defineProperty(nd, "__esModule", { value: !0 });
const B$ = gt, ul = mt, j$ = {
  message: ({ schemaCode: e }) => (0, ul.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, ul._)`{pattern: ${e}}`
}, H$ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: j$,
  code(e) {
    const { data: n, $data: t, schema: a, schemaCode: u, it: f } = e, d = f.opts.unicodeRegExp ? "u" : "", v = t ? (0, ul._)`(new RegExp(${u}, ${d}))` : (0, B$.usePattern)(e, a);
    e.fail$data((0, ul._)`!${v}.test(${n})`);
  }
};
nd.default = H$;
var rd = {};
Object.defineProperty(rd, "__esModule", { value: !0 });
const is = mt, W$ = {
  message({ keyword: e, schemaCode: n }) {
    const t = e === "maxProperties" ? "more" : "fewer";
    return (0, is.str)`must NOT have ${t} than ${n} properties`;
  },
  params: ({ schemaCode: e }) => (0, is._)`{limit: ${e}}`
}, V$ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: W$,
  code(e) {
    const { keyword: n, data: t, schemaCode: a } = e, u = n === "maxProperties" ? is.operators.GT : is.operators.LT;
    e.fail$data((0, is._)`Object.keys(${t}).length ${u} ${a}`);
  }
};
rd.default = V$;
var id = {};
Object.defineProperty(id, "__esModule", { value: !0 });
const Ka = gt, os = mt, U$ = Me, G$ = {
  message: ({ params: { missingProperty: e } }) => (0, os.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, os._)`{missingProperty: ${e}}`
}, K$ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: G$,
  code(e) {
    const { gen: n, schema: t, schemaCode: a, data: u, $data: f, it: d } = e, { opts: v } = d;
    if (!f && t.length === 0)
      return;
    const p = t.length >= v.loopRequired;
    if (d.allErrors ? g() : b(), v.strictRequired) {
      const x = e.parentSchema.properties, { definedProperties: s } = e.it;
      for (const $ of t)
        if ((x == null ? void 0 : x[$]) === void 0 && !s.has($)) {
          const E = d.schemaEnv.baseId + d.errSchemaPath, A = `required property "${$}" is not defined at "${E}" (strictRequired)`;
          (0, U$.checkStrictMode)(d, A, d.opts.strictRequired);
        }
    }
    function g() {
      if (p || f)
        e.block$data(os.nil, w);
      else
        for (const x of t)
          (0, Ka.checkReportMissingProp)(e, x);
    }
    function b() {
      const x = n.let("missing");
      if (p || f) {
        const s = n.let("valid", !0);
        e.block$data(s, () => m(x, s)), e.ok(s);
      } else
        n.if((0, Ka.checkMissingProp)(e, t, x)), (0, Ka.reportMissingProp)(e, x), n.else();
    }
    function w() {
      n.forOf("prop", a, (x) => {
        e.setParams({ missingProperty: x }), n.if((0, Ka.noPropertyInData)(n, u, x, v.ownProperties), () => e.error());
      });
    }
    function m(x, s) {
      e.setParams({ missingProperty: x }), n.forOf(x, a, () => {
        n.assign(s, (0, Ka.propertyInData)(n, u, x, v.ownProperties)), n.if((0, os.not)(s), () => {
          e.error(), n.break();
        });
      }, os.nil);
    }
  }
};
id.default = K$;
var od = {};
Object.defineProperty(od, "__esModule", { value: !0 });
const as = mt, X$ = {
  message({ keyword: e, schemaCode: n }) {
    const t = e === "maxItems" ? "more" : "fewer";
    return (0, as.str)`must NOT have ${t} than ${n} items`;
  },
  params: ({ schemaCode: e }) => (0, as._)`{limit: ${e}}`
}, Y$ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: X$,
  code(e) {
    const { keyword: n, data: t, schemaCode: a } = e, u = n === "maxItems" ? as.operators.GT : as.operators.LT;
    e.fail$data((0, as._)`${t}.length ${u} ${a}`);
  }
};
od.default = Y$;
var ad = {}, xs = {};
Object.defineProperty(xs, "__esModule", { value: !0 });
const qm = fm;
qm.code = 'require("ajv/dist/runtime/equal").default';
xs.default = qm;
Object.defineProperty(ad, "__esModule", { value: !0 });
const Xc = rn, dn = mt, Q$ = Me, J$ = xs, Z$ = {
  message: ({ params: { i: e, j: n } }) => (0, dn.str)`must NOT have duplicate items (items ## ${n} and ${e} are identical)`,
  params: ({ params: { i: e, j: n } }) => (0, dn._)`{i: ${e}, j: ${n}}`
}, eE = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Z$,
  code(e) {
    const { gen: n, data: t, $data: a, schema: u, parentSchema: f, schemaCode: d, it: v } = e;
    if (!a && !u)
      return;
    const p = n.let("valid"), g = f.items ? (0, Xc.getSchemaTypes)(f.items) : [];
    e.block$data(p, b, (0, dn._)`${d} === false`), e.ok(p);
    function b() {
      const s = n.let("i", (0, dn._)`${t}.length`), $ = n.let("j");
      e.setParams({ i: s, j: $ }), n.assign(p, !0), n.if((0, dn._)`${s} > 1`, () => (w() ? m : x)(s, $));
    }
    function w() {
      return g.length > 0 && !g.some((s) => s === "object" || s === "array");
    }
    function m(s, $) {
      const E = n.name("item"), A = (0, Xc.checkDataTypes)(g, E, v.opts.strictNumbers, Xc.DataType.Wrong), I = n.const("indices", (0, dn._)`{}`);
      n.for((0, dn._)`;${s}--;`, () => {
        n.let(E, (0, dn._)`${t}[${s}]`), n.if(A, (0, dn._)`continue`), g.length > 1 && n.if((0, dn._)`typeof ${E} == "string"`, (0, dn._)`${E} += "_"`), n.if((0, dn._)`typeof ${I}[${E}] == "number"`, () => {
          n.assign($, (0, dn._)`${I}[${E}]`), e.error(), n.assign(p, !1).break();
        }).code((0, dn._)`${I}[${E}] = ${s}`);
      });
    }
    function x(s, $) {
      const E = (0, Q$.useFunc)(n, J$.default), A = n.name("outer");
      n.label(A).for((0, dn._)`;${s}--;`, () => n.for((0, dn._)`${$} = ${s}; ${$}--;`, () => n.if((0, dn._)`${E}(${t}[${s}], ${t}[${$}])`, () => {
        e.error(), n.assign(p, !1).break(A);
      })));
    }
  }
};
ad.default = eE;
var sd = {};
Object.defineProperty(sd, "__esModule", { value: !0 });
const hf = mt, tE = Me, nE = xs, rE = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, hf._)`{allowedValue: ${e}}`
}, iE = {
  keyword: "const",
  $data: !0,
  error: rE,
  code(e) {
    const { gen: n, data: t, $data: a, schemaCode: u, schema: f } = e;
    a || f && typeof f == "object" ? e.fail$data((0, hf._)`!${(0, tE.useFunc)(n, nE.default)}(${t}, ${u})`) : e.fail((0, hf._)`${f} !== ${t}`);
  }
};
sd.default = iE;
var ud = {};
Object.defineProperty(ud, "__esModule", { value: !0 });
const Za = mt, oE = Me, aE = xs, sE = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Za._)`{allowedValues: ${e}}`
}, uE = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: sE,
  code(e) {
    const { gen: n, data: t, $data: a, schema: u, schemaCode: f, it: d } = e;
    if (!a && u.length === 0)
      throw new Error("enum must have non-empty array");
    const v = u.length >= d.opts.loopEnum;
    let p;
    const g = () => p ?? (p = (0, oE.useFunc)(n, aE.default));
    let b;
    if (v || a)
      b = n.let("valid"), e.block$data(b, w);
    else {
      if (!Array.isArray(u))
        throw new Error("ajv implementation error");
      const x = n.const("vSchema", f);
      b = (0, Za.or)(...u.map((s, $) => m(x, $)));
    }
    e.pass(b);
    function w() {
      n.assign(b, !1), n.forOf("v", f, (x) => n.if((0, Za._)`${g()}(${t}, ${x})`, () => n.assign(b, !0).break()));
    }
    function m(x, s) {
      const $ = u[s];
      return typeof $ == "object" && $ !== null ? (0, Za._)`${g()}(${t}, ${x}[${s}])` : (0, Za._)`${t} === ${$}`;
    }
  }
};
ud.default = uE;
Object.defineProperty(Qf, "__esModule", { value: !0 });
const lE = Jf, cE = Zf, fE = ed, dE = nd, hE = rd, pE = id, gE = od, mE = ad, vE = sd, yE = ud, wE = [
  // number
  lE.default,
  cE.default,
  // string
  fE.default,
  dE.default,
  // object
  hE.default,
  pE.default,
  // array
  gE.default,
  mE.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  vE.default,
  yE.default
];
Qf.default = wE;
var ld = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.validateAdditionalItems = void 0;
const fo = mt, pf = Me, bE = {
  message: ({ params: { len: e } }) => (0, fo.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, fo._)`{limit: ${e}}`
}, _E = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: bE,
  code(e) {
    const { parentSchema: n, it: t } = e, { items: a } = n;
    if (!Array.isArray(a)) {
      (0, pf.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    zm(e, a);
  }
};
function zm(e, n) {
  const { gen: t, schema: a, data: u, keyword: f, it: d } = e;
  d.items = !0;
  const v = t.const("len", (0, fo._)`${u}.length`);
  if (a === !1)
    e.setParams({ len: n.length }), e.pass((0, fo._)`${v} <= ${n.length}`);
  else if (typeof a == "object" && !(0, pf.alwaysValidSchema)(d, a)) {
    const g = t.var("valid", (0, fo._)`${v} <= ${n.length}`);
    t.if((0, fo.not)(g), () => p(g)), e.ok(g);
  }
  function p(g) {
    t.forRange("i", n.length, v, (b) => {
      e.subschema({ keyword: f, dataProp: b, dataPropType: pf.Type.Num }, g), d.allErrors || t.if((0, fo.not)(g), () => t.break());
    });
  }
}
pa.validateAdditionalItems = zm;
pa.default = _E;
var cd = {}, ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
ga.validateTuple = void 0;
const jp = mt, Qu = Me, xE = gt, SE = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: n, it: t } = e;
    if (Array.isArray(n))
      return Bm(e, "additionalItems", n);
    t.items = !0, !(0, Qu.alwaysValidSchema)(t, n) && e.ok((0, xE.validateArray)(e));
  }
};
function Bm(e, n, t = e.schema) {
  const { gen: a, parentSchema: u, data: f, keyword: d, it: v } = e;
  b(u), v.opts.unevaluated && t.length && v.items !== !0 && (v.items = Qu.mergeEvaluated.items(a, t.length, v.items));
  const p = a.name("valid"), g = a.const("len", (0, jp._)`${f}.length`);
  t.forEach((w, m) => {
    (0, Qu.alwaysValidSchema)(v, w) || (a.if((0, jp._)`${g} > ${m}`, () => e.subschema({
      keyword: d,
      schemaProp: m,
      dataProp: m
    }, p)), e.ok(p));
  });
  function b(w) {
    const { opts: m, errSchemaPath: x } = v, s = t.length, $ = s === w.minItems && (s === w.maxItems || w[n] === !1);
    if (m.strictTuples && !$) {
      const E = `"${d}" is ${s}-tuple, but minItems or maxItems/${n} are not specified or different at path "${x}"`;
      (0, Qu.checkStrictMode)(v, E, m.strictTuples);
    }
  }
}
ga.validateTuple = Bm;
ga.default = SE;
Object.defineProperty(cd, "__esModule", { value: !0 });
const $E = ga, EE = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, $E.validateTuple)(e, "items")
};
cd.default = EE;
var fd = {};
Object.defineProperty(fd, "__esModule", { value: !0 });
const Hp = mt, CE = Me, AE = gt, TE = pa, PE = {
  message: ({ params: { len: e } }) => (0, Hp.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Hp._)`{limit: ${e}}`
}, kE = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: PE,
  code(e) {
    const { schema: n, parentSchema: t, it: a } = e, { prefixItems: u } = t;
    a.items = !0, !(0, CE.alwaysValidSchema)(a, n) && (u ? (0, TE.validateAdditionalItems)(e, u) : e.ok((0, AE.validateArray)(e)));
  }
};
fd.default = kE;
var dd = {};
Object.defineProperty(dd, "__esModule", { value: !0 });
const nr = mt, Mu = Me, NE = {
  message: ({ params: { min: e, max: n } }) => n === void 0 ? (0, nr.str)`must contain at least ${e} valid item(s)` : (0, nr.str)`must contain at least ${e} and no more than ${n} valid item(s)`,
  params: ({ params: { min: e, max: n } }) => n === void 0 ? (0, nr._)`{minContains: ${e}}` : (0, nr._)`{minContains: ${e}, maxContains: ${n}}`
}, OE = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: NE,
  code(e) {
    const { gen: n, schema: t, parentSchema: a, data: u, it: f } = e;
    let d, v;
    const { minContains: p, maxContains: g } = a;
    f.opts.next ? (d = p === void 0 ? 1 : p, v = g) : d = 1;
    const b = n.const("len", (0, nr._)`${u}.length`);
    if (e.setParams({ min: d, max: v }), v === void 0 && d === 0) {
      (0, Mu.checkStrictMode)(f, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (v !== void 0 && d > v) {
      (0, Mu.checkStrictMode)(f, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Mu.alwaysValidSchema)(f, t)) {
      let $ = (0, nr._)`${b} >= ${d}`;
      v !== void 0 && ($ = (0, nr._)`${$} && ${b} <= ${v}`), e.pass($);
      return;
    }
    f.items = !0;
    const w = n.name("valid");
    v === void 0 && d === 1 ? x(w, () => n.if(w, () => n.break())) : d === 0 ? (n.let(w, !0), v !== void 0 && n.if((0, nr._)`${u}.length > 0`, m)) : (n.let(w, !1), m()), e.result(w, () => e.reset());
    function m() {
      const $ = n.name("_valid"), E = n.let("count", 0);
      x($, () => n.if($, () => s(E)));
    }
    function x($, E) {
      n.forRange("i", 0, b, (A) => {
        e.subschema({
          keyword: "contains",
          dataProp: A,
          dataPropType: Mu.Type.Num,
          compositeRule: !0
        }, $), E();
      });
    }
    function s($) {
      n.code((0, nr._)`${$}++`), v === void 0 ? n.if((0, nr._)`${$} >= ${d}`, () => n.assign(w, !0).break()) : (n.if((0, nr._)`${$} > ${v}`, () => n.assign(w, !1).break()), d === 1 ? n.assign(w, !0) : n.if((0, nr._)`${$} >= ${d}`, () => n.assign(w, !0)));
    }
  }
};
dd.default = OE;
var jm = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const n = mt, t = Me, a = gt;
  e.error = {
    message: ({ params: { property: p, depsCount: g, deps: b } }) => {
      const w = g === 1 ? "property" : "properties";
      return (0, n.str)`must have ${w} ${b} when property ${p} is present`;
    },
    params: ({ params: { property: p, depsCount: g, deps: b, missingProperty: w } }) => (0, n._)`{property: ${p},
    missingProperty: ${w},
    depsCount: ${g},
    deps: ${b}}`
    // TODO change to reference
  };
  const u = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(p) {
      const [g, b] = f(p);
      d(p, g), v(p, b);
    }
  };
  function f({ schema: p }) {
    const g = {}, b = {};
    for (const w in p) {
      if (w === "__proto__")
        continue;
      const m = Array.isArray(p[w]) ? g : b;
      m[w] = p[w];
    }
    return [g, b];
  }
  function d(p, g = p.schema) {
    const { gen: b, data: w, it: m } = p;
    if (Object.keys(g).length === 0)
      return;
    const x = b.let("missing");
    for (const s in g) {
      const $ = g[s];
      if ($.length === 0)
        continue;
      const E = (0, a.propertyInData)(b, w, s, m.opts.ownProperties);
      p.setParams({
        property: s,
        depsCount: $.length,
        deps: $.join(", ")
      }), m.allErrors ? b.if(E, () => {
        for (const A of $)
          (0, a.checkReportMissingProp)(p, A);
      }) : (b.if((0, n._)`${E} && (${(0, a.checkMissingProp)(p, $, x)})`), (0, a.reportMissingProp)(p, x), b.else());
    }
  }
  e.validatePropertyDeps = d;
  function v(p, g = p.schema) {
    const { gen: b, data: w, keyword: m, it: x } = p, s = b.name("valid");
    for (const $ in g)
      (0, t.alwaysValidSchema)(x, g[$]) || (b.if(
        (0, a.propertyInData)(b, w, $, x.opts.ownProperties),
        () => {
          const E = p.subschema({ keyword: m, schemaProp: $ }, s);
          p.mergeValidEvaluated(E, s);
        },
        () => b.var(s, !0)
        // TODO var
      ), p.ok(s));
  }
  e.validateSchemaDeps = v, e.default = u;
})(jm);
var hd = {};
Object.defineProperty(hd, "__esModule", { value: !0 });
const Hm = mt, LE = Me, RE = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Hm._)`{propertyName: ${e.propertyName}}`
}, ME = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: RE,
  code(e) {
    const { gen: n, schema: t, data: a, it: u } = e;
    if ((0, LE.alwaysValidSchema)(u, t))
      return;
    const f = n.name("valid");
    n.forIn("key", a, (d) => {
      e.setParams({ propertyName: d }), e.subschema({
        keyword: "propertyNames",
        data: d,
        dataTypes: ["string"],
        propertyName: d,
        compositeRule: !0
      }, f), n.if((0, Hm.not)(f), () => {
        e.error(!0), u.allErrors || n.break();
      });
    }), e.ok(f);
  }
};
hd.default = ME;
var Al = {};
Object.defineProperty(Al, "__esModule", { value: !0 });
const Du = gt, br = mt, DE = Wr, Iu = Me, IE = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, br._)`{additionalProperty: ${e.additionalProperty}}`
}, FE = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: IE,
  code(e) {
    const { gen: n, schema: t, parentSchema: a, data: u, errsCount: f, it: d } = e;
    if (!f)
      throw new Error("ajv implementation error");
    const { allErrors: v, opts: p } = d;
    if (d.props = !0, p.removeAdditional !== "all" && (0, Iu.alwaysValidSchema)(d, t))
      return;
    const g = (0, Du.allSchemaProperties)(a.properties), b = (0, Du.allSchemaProperties)(a.patternProperties);
    w(), e.ok((0, br._)`${f} === ${DE.default.errors}`);
    function w() {
      n.forIn("key", u, (E) => {
        !g.length && !b.length ? s(E) : n.if(m(E), () => s(E));
      });
    }
    function m(E) {
      let A;
      if (g.length > 8) {
        const I = (0, Iu.schemaRefOrVal)(d, a.properties, "properties");
        A = (0, Du.isOwnProperty)(n, I, E);
      } else g.length ? A = (0, br.or)(...g.map((I) => (0, br._)`${E} === ${I}`)) : A = br.nil;
      return b.length && (A = (0, br.or)(A, ...b.map((I) => (0, br._)`${(0, Du.usePattern)(e, I)}.test(${E})`))), (0, br.not)(A);
    }
    function x(E) {
      n.code((0, br._)`delete ${u}[${E}]`);
    }
    function s(E) {
      if (p.removeAdditional === "all" || p.removeAdditional && t === !1) {
        x(E);
        return;
      }
      if (t === !1) {
        e.setParams({ additionalProperty: E }), e.error(), v || n.break();
        return;
      }
      if (typeof t == "object" && !(0, Iu.alwaysValidSchema)(d, t)) {
        const A = n.name("valid");
        p.removeAdditional === "failing" ? ($(E, A, !1), n.if((0, br.not)(A), () => {
          e.reset(), x(E);
        })) : ($(E, A), v || n.if((0, br.not)(A), () => n.break()));
      }
    }
    function $(E, A, I) {
      const F = {
        keyword: "additionalProperties",
        dataProp: E,
        dataPropType: Iu.Type.Str
      };
      I === !1 && Object.assign(F, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(F, A);
    }
  }
};
Al.default = FE;
var pd = {};
Object.defineProperty(pd, "__esModule", { value: !0 });
const qE = Er, Wp = gt, Yc = Me, Vp = Al, zE = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: n, schema: t, parentSchema: a, data: u, it: f } = e;
    f.opts.removeAdditional === "all" && a.additionalProperties === void 0 && Vp.default.code(new qE.KeywordCxt(f, Vp.default, "additionalProperties"));
    const d = (0, Wp.allSchemaProperties)(t);
    for (const w of d)
      f.definedProperties.add(w);
    f.opts.unevaluated && d.length && f.props !== !0 && (f.props = Yc.mergeEvaluated.props(n, (0, Yc.toHash)(d), f.props));
    const v = d.filter((w) => !(0, Yc.alwaysValidSchema)(f, t[w]));
    if (v.length === 0)
      return;
    const p = n.name("valid");
    for (const w of v)
      g(w) ? b(w) : (n.if((0, Wp.propertyInData)(n, u, w, f.opts.ownProperties)), b(w), f.allErrors || n.else().var(p, !0), n.endIf()), e.it.definedProperties.add(w), e.ok(p);
    function g(w) {
      return f.opts.useDefaults && !f.compositeRule && t[w].default !== void 0;
    }
    function b(w) {
      e.subschema({
        keyword: "properties",
        schemaProp: w,
        dataProp: w
      }, p);
    }
  }
};
pd.default = zE;
var gd = {};
Object.defineProperty(gd, "__esModule", { value: !0 });
const Up = gt, Fu = mt, Gp = Me, Kp = Me, BE = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: n, schema: t, data: a, parentSchema: u, it: f } = e, { opts: d } = f, v = (0, Up.allSchemaProperties)(t), p = v.filter(($) => (0, Gp.alwaysValidSchema)(f, t[$]));
    if (v.length === 0 || p.length === v.length && (!f.opts.unevaluated || f.props === !0))
      return;
    const g = d.strictSchema && !d.allowMatchingProperties && u.properties, b = n.name("valid");
    f.props !== !0 && !(f.props instanceof Fu.Name) && (f.props = (0, Kp.evaluatedPropsToName)(n, f.props));
    const { props: w } = f;
    m();
    function m() {
      for (const $ of v)
        g && x($), f.allErrors ? s($) : (n.var(b, !0), s($), n.if(b));
    }
    function x($) {
      for (const E in g)
        new RegExp($).test(E) && (0, Gp.checkStrictMode)(f, `property ${E} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function s($) {
      n.forIn("key", a, (E) => {
        n.if((0, Fu._)`${(0, Up.usePattern)(e, $)}.test(${E})`, () => {
          const A = p.includes($);
          A || e.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: E,
            dataPropType: Kp.Type.Str
          }, b), f.opts.unevaluated && w !== !0 ? n.assign((0, Fu._)`${w}[${E}]`, !0) : !A && !f.allErrors && n.if((0, Fu.not)(b), () => n.break());
        });
      });
    }
  }
};
gd.default = BE;
var md = {};
Object.defineProperty(md, "__esModule", { value: !0 });
const jE = Me, HE = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: n, schema: t, it: a } = e;
    if ((0, jE.alwaysValidSchema)(a, t)) {
      e.fail();
      return;
    }
    const u = n.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, u), e.failResult(u, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
md.default = HE;
var vd = {};
Object.defineProperty(vd, "__esModule", { value: !0 });
const WE = gt, VE = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: WE.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
vd.default = VE;
var yd = {};
Object.defineProperty(yd, "__esModule", { value: !0 });
const Ju = mt, UE = Me, GE = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Ju._)`{passingSchemas: ${e.passing}}`
}, KE = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: GE,
  code(e) {
    const { gen: n, schema: t, parentSchema: a, it: u } = e;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    if (u.opts.discriminator && a.discriminator)
      return;
    const f = t, d = n.let("valid", !1), v = n.let("passing", null), p = n.name("_valid");
    e.setParams({ passing: v }), n.block(g), e.result(d, () => e.reset(), () => e.error(!0));
    function g() {
      f.forEach((b, w) => {
        let m;
        (0, UE.alwaysValidSchema)(u, b) ? n.var(p, !0) : m = e.subschema({
          keyword: "oneOf",
          schemaProp: w,
          compositeRule: !0
        }, p), w > 0 && n.if((0, Ju._)`${p} && ${d}`).assign(d, !1).assign(v, (0, Ju._)`[${v}, ${w}]`).else(), n.if(p, () => {
          n.assign(d, !0), n.assign(v, w), m && e.mergeEvaluated(m, Ju.Name);
        });
      });
    }
  }
};
yd.default = KE;
var wd = {};
Object.defineProperty(wd, "__esModule", { value: !0 });
const XE = Me, YE = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: n, schema: t, it: a } = e;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    const u = n.name("valid");
    t.forEach((f, d) => {
      if ((0, XE.alwaysValidSchema)(a, f))
        return;
      const v = e.subschema({ keyword: "allOf", schemaProp: d }, u);
      e.ok(u), e.mergeEvaluated(v);
    });
  }
};
wd.default = YE;
var bd = {};
Object.defineProperty(bd, "__esModule", { value: !0 });
const ll = mt, Wm = Me, QE = {
  message: ({ params: e }) => (0, ll.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ll._)`{failingKeyword: ${e.ifClause}}`
}, JE = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: QE,
  code(e) {
    const { gen: n, parentSchema: t, it: a } = e;
    t.then === void 0 && t.else === void 0 && (0, Wm.checkStrictMode)(a, '"if" without "then" and "else" is ignored');
    const u = Xp(a, "then"), f = Xp(a, "else");
    if (!u && !f)
      return;
    const d = n.let("valid", !0), v = n.name("_valid");
    if (p(), e.reset(), u && f) {
      const b = n.let("ifClause");
      e.setParams({ ifClause: b }), n.if(v, g("then", b), g("else", b));
    } else u ? n.if(v, g("then")) : n.if((0, ll.not)(v), g("else"));
    e.pass(d, () => e.error(!0));
    function p() {
      const b = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, v);
      e.mergeEvaluated(b);
    }
    function g(b, w) {
      return () => {
        const m = e.subschema({ keyword: b }, v);
        n.assign(d, v), e.mergeValidEvaluated(m, d), w ? n.assign(w, (0, ll._)`${b}`) : e.setParams({ ifClause: b });
      };
    }
  }
};
function Xp(e, n) {
  const t = e.schema[n];
  return t !== void 0 && !(0, Wm.alwaysValidSchema)(e, t);
}
bd.default = JE;
var _d = {};
Object.defineProperty(_d, "__esModule", { value: !0 });
const ZE = Me, eC = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: n, it: t }) {
    n.if === void 0 && (0, ZE.checkStrictMode)(t, `"${e}" without "if" is ignored`);
  }
};
_d.default = eC;
Object.defineProperty(ld, "__esModule", { value: !0 });
const tC = pa, nC = cd, rC = ga, iC = fd, oC = dd, aC = jm, sC = hd, uC = Al, lC = pd, cC = gd, fC = md, dC = vd, hC = yd, pC = wd, gC = bd, mC = _d;
function vC(e = !1) {
  const n = [
    // any
    fC.default,
    dC.default,
    hC.default,
    pC.default,
    gC.default,
    mC.default,
    // object
    sC.default,
    uC.default,
    aC.default,
    lC.default,
    cC.default
  ];
  return e ? n.push(nC.default, iC.default) : n.push(tC.default, rC.default), n.push(oC.default), n;
}
ld.default = vC;
var xd = {}, Sd = {};
Object.defineProperty(Sd, "__esModule", { value: !0 });
const Zt = mt, yC = {
  message: ({ schemaCode: e }) => (0, Zt.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Zt._)`{format: ${e}}`
}, wC = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: yC,
  code(e, n) {
    const { gen: t, data: a, $data: u, schema: f, schemaCode: d, it: v } = e, { opts: p, errSchemaPath: g, schemaEnv: b, self: w } = v;
    if (!p.validateFormats)
      return;
    u ? m() : x();
    function m() {
      const s = t.scopeValue("formats", {
        ref: w.formats,
        code: p.code.formats
      }), $ = t.const("fDef", (0, Zt._)`${s}[${d}]`), E = t.let("fType"), A = t.let("format");
      t.if((0, Zt._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => t.assign(E, (0, Zt._)`${$}.type || "string"`).assign(A, (0, Zt._)`${$}.validate`), () => t.assign(E, (0, Zt._)`"string"`).assign(A, $)), e.fail$data((0, Zt.or)(I(), F()));
      function I() {
        return p.strictSchema === !1 ? Zt.nil : (0, Zt._)`${d} && !${A}`;
      }
      function F() {
        const k = b.$async ? (0, Zt._)`(${$}.async ? await ${A}(${a}) : ${A}(${a}))` : (0, Zt._)`${A}(${a})`, j = (0, Zt._)`(typeof ${A} == "function" ? ${k} : ${A}.test(${a}))`;
        return (0, Zt._)`${A} && ${A} !== true && ${E} === ${n} && !${j}`;
      }
    }
    function x() {
      const s = w.formats[f];
      if (!s) {
        I();
        return;
      }
      if (s === !0)
        return;
      const [$, E, A] = F(s);
      $ === n && e.pass(k());
      function I() {
        if (p.strictSchema === !1) {
          w.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${f}" ignored in schema at path "${g}"`;
        }
      }
      function F(j) {
        const U = j instanceof RegExp ? (0, Zt.regexpCode)(j) : p.code.formats ? (0, Zt._)`${p.code.formats}${(0, Zt.getProperty)(f)}` : void 0, ne = t.scopeValue("formats", { key: f, ref: j, code: U });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, Zt._)`${ne}.validate`] : ["string", j, ne];
      }
      function k() {
        if (typeof s == "object" && !(s instanceof RegExp) && s.async) {
          if (!b.$async)
            throw new Error("async format in sync schema");
          return (0, Zt._)`await ${A}(${a})`;
        }
        return typeof E == "function" ? (0, Zt._)`${A}(${a})` : (0, Zt._)`${A}.test(${a})`;
      }
    }
  }
};
Sd.default = wC;
Object.defineProperty(xd, "__esModule", { value: !0 });
const bC = Sd, _C = [bC.default];
xd.default = _C;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.contentVocabulary = oa.metadataVocabulary = void 0;
oa.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
oa.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Kf, "__esModule", { value: !0 });
const xC = Xf, SC = Qf, $C = ld, EC = xd, Yp = oa, CC = [
  xC.default,
  SC.default,
  (0, $C.default)(),
  EC.default,
  Yp.metadataVocabulary,
  Yp.contentVocabulary
];
Kf.default = CC;
var $d = {}, Tl = {};
Object.defineProperty(Tl, "__esModule", { value: !0 });
Tl.DiscrError = void 0;
var Qp;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Qp || (Tl.DiscrError = Qp = {}));
Object.defineProperty($d, "__esModule", { value: !0 });
const Xo = mt, gf = Tl, Jp = Fn, AC = ha, TC = Me, PC = {
  message: ({ params: { discrError: e, tagName: n } }) => e === gf.DiscrError.Tag ? `tag "${n}" must be string` : `value of tag "${n}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: n, tagName: t } }) => (0, Xo._)`{error: ${e}, tag: ${t}, tagValue: ${n}}`
}, kC = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: PC,
  code(e) {
    const { gen: n, data: t, schema: a, parentSchema: u, it: f } = e, { oneOf: d } = u;
    if (!f.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const v = a.propertyName;
    if (typeof v != "string")
      throw new Error("discriminator: requires propertyName");
    if (a.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!d)
      throw new Error("discriminator: requires oneOf keyword");
    const p = n.let("valid", !1), g = n.const("tag", (0, Xo._)`${t}${(0, Xo.getProperty)(v)}`);
    n.if((0, Xo._)`typeof ${g} == "string"`, () => b(), () => e.error(!1, { discrError: gf.DiscrError.Tag, tag: g, tagName: v })), e.ok(p);
    function b() {
      const x = m();
      n.if(!1);
      for (const s in x)
        n.elseIf((0, Xo._)`${g} === ${s}`), n.assign(p, w(x[s]));
      n.else(), e.error(!1, { discrError: gf.DiscrError.Mapping, tag: g, tagName: v }), n.endIf();
    }
    function w(x) {
      const s = n.name("valid"), $ = e.subschema({ keyword: "oneOf", schemaProp: x }, s);
      return e.mergeEvaluated($, Xo.Name), s;
    }
    function m() {
      var x;
      const s = {}, $ = A(u);
      let E = !0;
      for (let k = 0; k < d.length; k++) {
        let j = d[k];
        if (j != null && j.$ref && !(0, TC.schemaHasRulesButRef)(j, f.self.RULES)) {
          const ne = j.$ref;
          if (j = Jp.resolveRef.call(f.self, f.schemaEnv.root, f.baseId, ne), j instanceof Jp.SchemaEnv && (j = j.schema), j === void 0)
            throw new AC.default(f.opts.uriResolver, f.baseId, ne);
        }
        const U = (x = j == null ? void 0 : j.properties) === null || x === void 0 ? void 0 : x[v];
        if (typeof U != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${v}"`);
        E = E && ($ || A(j)), I(U, k);
      }
      if (!E)
        throw new Error(`discriminator: "${v}" must be required`);
      return s;
      function A({ required: k }) {
        return Array.isArray(k) && k.includes(v);
      }
      function I(k, j) {
        if (k.const)
          F(k.const, j);
        else if (k.enum)
          for (const U of k.enum)
            F(U, j);
        else
          throw new Error(`discriminator: "properties/${v}" must have "const" or "enum"`);
      }
      function F(k, j) {
        if (typeof k != "string" || k in s)
          throw new Error(`discriminator: "${v}" values must be unique strings`);
        s[k] = j;
      }
    }
  }
};
$d.default = kC;
const NC = "http://json-schema.org/draft-07/schema#", OC = "http://json-schema.org/draft-07/schema#", LC = "Core schema meta-schema", RC = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, MC = [
  "object",
  "boolean"
], DC = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, IC = {
  $schema: NC,
  $id: OC,
  title: LC,
  definitions: RC,
  type: MC,
  properties: DC,
  default: !0
};
(function(e, n) {
  Object.defineProperty(n, "__esModule", { value: !0 }), n.MissingRefError = n.ValidationError = n.CodeGen = n.Name = n.nil = n.stringify = n.str = n._ = n.KeywordCxt = n.Ajv = void 0;
  const t = Xg, a = Kf, u = $d, f = IC, d = ["/properties"], v = "http://json-schema.org/draft-07/schema";
  class p extends t.default {
    _addVocabularies() {
      super._addVocabularies(), a.default.forEach((s) => this.addVocabulary(s)), this.opts.discriminator && this.addKeyword(u.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const s = this.opts.$data ? this.$dataMetaSchema(f, d) : f;
      this.addMetaSchema(s, v, !1), this.refs["http://json-schema.org/schema"] = v;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(v) ? v : void 0);
    }
  }
  n.Ajv = p, e.exports = n = p, e.exports.Ajv = p, Object.defineProperty(n, "__esModule", { value: !0 }), n.default = p;
  var g = Er;
  Object.defineProperty(n, "KeywordCxt", { enumerable: !0, get: function() {
    return g.KeywordCxt;
  } });
  var b = mt;
  Object.defineProperty(n, "_", { enumerable: !0, get: function() {
    return b._;
  } }), Object.defineProperty(n, "str", { enumerable: !0, get: function() {
    return b.str;
  } }), Object.defineProperty(n, "stringify", { enumerable: !0, get: function() {
    return b.stringify;
  } }), Object.defineProperty(n, "nil", { enumerable: !0, get: function() {
    return b.nil;
  } }), Object.defineProperty(n, "Name", { enumerable: !0, get: function() {
    return b.Name;
  } }), Object.defineProperty(n, "CodeGen", { enumerable: !0, get: function() {
    return b.CodeGen;
  } });
  var w = _s;
  Object.defineProperty(n, "ValidationError", { enumerable: !0, get: function() {
    return w.default;
  } });
  var m = ha;
  Object.defineProperty(n, "MissingRefError", { enumerable: !0, get: function() {
    return m.default;
  } });
})(sf, sf.exports);
var FC = sf.exports;
const Vm = /* @__PURE__ */ ws(FC), qC = "http://json-schema.org/draft-07/schema#", zC = "Generated schema for Root", BC = "object", jC = {
  genome: {
    type: "object",
    properties: {
      features: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string"
            },
            color: {
              type: "string"
            },
            geneId: {
              type: "string"
            },
            label: {
              type: "string"
            },
            id: {
              oneOf: [
                {
                  type: "string"
                },
                {
                  type: "number"
                }
              ]
            },
            chromosome: {
              oneOf: [
                {
                  type: "string"
                },
                {
                  type: "number"
                }
              ]
            },
            start: {
              oneOf: [
                {
                  type: "string"
                },
                {
                  type: "number"
                }
              ]
            },
            end: {
              oneOf: [
                {
                  type: "string"
                },
                {
                  type: "number"
                }
              ]
            }
          },
          required: [
            "type",
            "color",
            "label",
            "id"
          ]
        }
      }
    },
    required: [
      "features"
    ]
  }
}, HC = [
  "genome"
], WC = {
  $schema: qC,
  title: zC,
  type: BC,
  properties: jC,
  required: HC
}, VC = new Vm(), Zp = VC.compile(WC), UC = function() {
  var e = function(n) {
    var u;
    if (!Zp(n))
      throw console.log("annotation json:", n), console.log("Invalid data:", Zp.errors), new Error("Invalid data");
    var a = {};
    return a.features = (u = n.genome.features) == null ? void 0 : u.map((f) => ({
      ...f,
      midpoint: (f.end - f.start) / 2 + f.start,
      selected: !1
    })), a;
  };
  return {
    readAnnotationJSONFromRawJSON: function(n) {
      return e(n);
    },
    readAnnotation: async function(n) {
      const t = await import(n);
      return e(t.default);
    }
  };
}, GC = "http://json-schema.org/draft-07/schema#", KC = "Generated schema for Root", XC = "object", YC = {
  chromosomes: {
    type: "array",
    items: {
      type: "object",
      properties: {
        index: {
          oneOf: [
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        },
        length: {
          oneOf: [
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        },
        number: {
          oneOf: [
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        },
        bands: {
          type: "array",
          items: {
            type: "object",
            properties: {
              index: {
                oneOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  }
                ]
              },
              start: {
                oneOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  }
                ]
              },
              end: {
                oneOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  }
                ]
              },
              color: {
                type: "string"
              }
            }
          }
        }
      },
      required: [
        "index",
        "length",
        "number",
        "bands"
      ]
    }
  }
}, QC = [
  "chromosomes"
], JC = {
  $schema: GC,
  title: KC,
  type: XC,
  properties: YC,
  required: QC
}, ZC = new Vm(), eg = ZC.compile(JC), eA = function() {
  var e = function(n) {
    if (!eg(n))
      throw console.log("json:", n), console.log("Invalid data:", eg.errors), new Error("Invalid data");
    var a = {};
    return a.chromosomes = n == null ? void 0 : n.chromosomes, a;
  };
  return {
    readBasemap: async function(n) {
      const t = await import(n);
      return e(t.default);
    },
    readBasemapFromRawJSON: function(n) {
      return e(n);
    }
  };
}, tA = function() {
  var e = function(a) {
    var u = new Array(8 - a.length + 1).join("0");
    let f = "#" + u + a.substring(2, a.length);
    return f == "#00FF00" && (f = "#208000"), f;
  }, n = function(a) {
    return a.chromosomes.forEach(function(u) {
      u.annotations = {
        allGenes: [],
        genes: [],
        qtls: [],
        snps: []
      }, u.bands || (u.bands = []), u.bands.forEach(function(f) {
        f.color = e(f.color);
      });
    }), a;
  }, t = function(a) {
    var u = n(a[0]), f = a[1];
    return f.features.forEach(function(d) {
      d.color = e(d.color);
    }), f.features.filter(function(d) {
      return d.type.toLowerCase() === "gene";
    }).forEach(function(d, v) {
      d.globalIndex = v;
    }), u.chromosomes.forEach(function(d) {
      var v = f.features.filter(function(E) {
        return E.chromosome === d.number;
      }), p = v.filter(function(E) {
        return E.type.toLowerCase() === "gene";
      }), g = v.filter(function(E) {
        return E.type.toLowerCase() === "qtl";
      }), b = v.filter(function(E) {
        return E.type.toLowerCase() === "snp";
      }), w = b.reduce(function(E, A) {
        return Math.min(E, A.pvalue);
      }, 1);
      b.forEach(function(E, A) {
        E.id = d.number + "_" + A, E.importance = Math.log(E.pvalue) / Math.log(w);
      }), g.forEach(function(E, A) {
        E.id = d.number + "_" + A, E.selected = !1;
      }), g.reduce(function(E, A) {
        return Math.max(E, A.score);
      }, 0);
      var m = 0.9, x = 3.5, s = function(E) {
        return m - 0.5 + 1 / (1 + Math.pow(E, x));
      };
      p.forEach(function(E, A) {
        E.visible = !1, E.hidden = !1, E.displayed = !1, E.importance = s(A);
      });
      var $ = p.slice(0, 100);
      d.annotations = {
        genes: $,
        allGenes: p,
        qtls: g,
        snps: b
      };
    }), u;
  };
  return {
    readData: async function(a, u, f) {
      var d = eA();
      let v;
      if (f ? v = d.readBasemapFromRawJSON(a) : v = await d.readBasemap(a), u) {
        var p = UC();
        let b;
        f ? b = p.readAnnotationJSONFromRawJSON(u) : b = p.readAnnotation(u);
        var g = Promise.all([v, b]).then(
          t,
          function(w) {
            return v.then(n);
          }
        );
        return g;
      }
      return n(v);
    }
  };
};
var cl = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
cl.exports;
(function(e, n) {
  (function() {
    var t, a = "4.17.21", u = 200, f = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", d = "Expected a function", v = "Invalid `variable` option passed into `_.template`", p = "__lodash_hash_undefined__", g = 500, b = "__lodash_placeholder__", w = 1, m = 2, x = 4, s = 1, $ = 2, E = 1, A = 2, I = 4, F = 8, k = 16, j = 32, U = 64, ne = 128, Se = 256, Ce = 512, Ee = 30, Ae = "...", We = 800, Fe = 16, J = 1, _e = 2, oe = 3, pe = 1 / 0, ke = 9007199254740991, Ne = 17976931348623157e292, ae = NaN, R = 4294967295, te = R - 1, Y = R >>> 1, L = [
      ["ary", ne],
      ["bind", E],
      ["bindKey", A],
      ["curry", F],
      ["curryRight", k],
      ["flip", Ce],
      ["partial", j],
      ["partialRight", U],
      ["rearg", Se]
    ], B = "[object Arguments]", re = "[object Array]", xe = "[object AsyncFunction]", be = "[object Boolean]", Ge = "[object Date]", et = "[object DOMException]", Ke = "[object Error]", Ie = "[object Function]", ue = "[object GeneratorFunction]", we = "[object Map]", $e = "[object Number]", at = "[object Null]", vt = "[object Object]", xt = "[object Promise]", Ut = "[object Proxy]", Nt = "[object RegExp]", Ft = "[object Set]", Mt = "[object String]", Et = "[object Symbol]", Sn = "[object Undefined]", pn = "[object WeakMap]", $n = "[object WeakSet]", gn = "[object ArrayBuffer]", un = "[object DataView]", Kn = "[object Float32Array]", Ur = "[object Float64Array]", ji = "[object Int8Array]", vi = "[object Int16Array]", yi = "[object Int32Array]", ce = "[object Uint8Array]", Le = "[object Uint8ClampedArray]", Ve = "[object Uint16Array]", yt = "[object Uint32Array]", wt = /\b__p \+= '';/g, en = /\b(__p \+=) '' \+/g, mn = /(__e\(.*?\)|\b__t\)) \+\n'';/g, ar = /&(?:amp|lt|gt|quot|#39);/g, Hi = /[&<>"']/g, sr = RegExp(ar.source), Wi = RegExp(Hi.source), wi = /<%-([\s\S]+?)%>/g, Xn = /<%([\s\S]+?)%>/g, Vi = /<%=([\s\S]+?)%>/g, bi = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Gr = /^\w*$/, Ts = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, ma = /[\\^$.*+?()[\]{}|]/g, Kr = RegExp(ma.source), xo = /^\s+/, Ui = /\s/, Ps = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, ks = /\{\n\/\* \[wrapped with (.+)\] \*/, So = /,? & /, Ns = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, $o = /[()=,{}\[\]\/\s]/, va = /\\(\\)?/g, Os = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ar = /\w*$/, Tr = /^[-+]0x[0-9a-f]+$/i, Rl = /^0b[01]+$/i, ya = /^\[object .+?Constructor\]$/, wa = /^0o[0-7]+$/i, Ml = /^(?:0|[1-9]\d*)$/, Dl = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Eo = /($^)/, Il = /['\n\r\u2028\u2029\\]/g, Gi = "\\ud800-\\udfff", Ls = "\\u0300-\\u036f", Rs = "\\ufe20-\\ufe2f", Ms = "\\u20d0-\\u20ff", ba = Ls + Rs + Ms, _a = "\\u2700-\\u27bf", xa = "a-z\\xdf-\\xf6\\xf8-\\xff", Ds = "\\xac\\xb1\\xd7\\xf7", vn = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", _i = "\\u2000-\\u206f", Co = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Is = "A-Z\\xc0-\\xd6\\xd8-\\xde", Fs = "\\ufe0e\\ufe0f", Sa = Ds + vn + _i + Co, xi = "['’]", qs = "[" + Gi + "]", zs = "[" + Sa + "]", Ao = "[" + ba + "]", On = "\\d+", Fl = "[" + _a + "]", Bs = "[" + xa + "]", Xr = "[^" + Gi + Sa + On + _a + xa + Is + "]", To = "\\ud83c[\\udffb-\\udfff]", ur = "(?:" + Ao + "|" + To + ")", Po = "[^" + Gi + "]", lr = "(?:\\ud83c[\\udde6-\\uddff]){2}", Si = "[\\ud800-\\udbff][\\udc00-\\udfff]", $i = "[" + Is + "]", js = "\\u200d", ko = "(?:" + Bs + "|" + Xr + ")", Yr = "(?:" + $i + "|" + Xr + ")", Hs = "(?:" + xi + "(?:d|ll|m|re|s|t|ve))?", No = "(?:" + xi + "(?:D|LL|M|RE|S|T|VE))?", Oo = ur + "?", Ws = "[" + Fs + "]?", ql = "(?:" + js + "(?:" + [Po, lr, Si].join("|") + ")" + Ws + Oo + ")*", Vs = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", zl = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Us = Ws + Oo + ql, Bl = "(?:" + [Fl, lr, Si].join("|") + ")" + Us, jl = "(?:" + [Po + Ao + "?", Ao, lr, Si, qs].join("|") + ")", Gs = RegExp(xi, "g"), Ks = RegExp(Ao, "g"), Ki = RegExp(To + "(?=" + To + ")|" + jl + Us, "g"), Xs = RegExp([
      $i + "?" + Bs + "+" + Hs + "(?=" + [zs, $i, "$"].join("|") + ")",
      Yr + "+" + No + "(?=" + [zs, $i + ko, "$"].join("|") + ")",
      $i + "?" + ko + "+" + Hs,
      $i + "+" + No,
      zl,
      Vs,
      On,
      Bl
    ].join("|"), "g"), $a = RegExp("[" + js + Gi + ba + Fs + "]"), Ei = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Ys = [
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
    ], Qs = -1, Rt = {};
    Rt[Kn] = Rt[Ur] = Rt[ji] = Rt[vi] = Rt[yi] = Rt[ce] = Rt[Le] = Rt[Ve] = Rt[yt] = !0, Rt[B] = Rt[re] = Rt[gn] = Rt[be] = Rt[un] = Rt[Ge] = Rt[Ke] = Rt[Ie] = Rt[we] = Rt[$e] = Rt[vt] = Rt[Nt] = Rt[Ft] = Rt[Mt] = Rt[pn] = !1;
    var Dt = {};
    Dt[B] = Dt[re] = Dt[gn] = Dt[un] = Dt[be] = Dt[Ge] = Dt[Kn] = Dt[Ur] = Dt[ji] = Dt[vi] = Dt[yi] = Dt[we] = Dt[$e] = Dt[vt] = Dt[Nt] = Dt[Ft] = Dt[Mt] = Dt[Et] = Dt[ce] = Dt[Le] = Dt[Ve] = Dt[yt] = !0, Dt[Ke] = Dt[Ie] = Dt[pn] = !1;
    var Hl = {
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
    }, Wl = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, Vl = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, Ul = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, Gl = parseFloat, Js = parseInt, Zs = typeof uo == "object" && uo && uo.Object === Object && uo, Kl = typeof self == "object" && self && self.Object === Object && self, Kt = Zs || Kl || Function("return this")(), Ea = n && !n.nodeType && n, Yn = Ea && !0 && e && !e.nodeType && e, Ci = Yn && Yn.exports === Ea, Xi = Ci && Zs.process, En = function() {
      try {
        var X = Yn && Yn.require && Yn.require("util").types;
        return X || Xi && Xi.binding && Xi.binding("util");
      } catch {
      }
    }(), Ca = En && En.isArrayBuffer, Lo = En && En.isDate, Aa = En && En.isMap, Ta = En && En.isRegExp, eu = En && En.isSet, tu = En && En.isTypedArray;
    function o(X, se, ie) {
      switch (ie.length) {
        case 0:
          return X.call(se);
        case 1:
          return X.call(se, ie[0]);
        case 2:
          return X.call(se, ie[0], ie[1]);
        case 3:
          return X.call(se, ie[0], ie[1], ie[2]);
      }
      return X.apply(se, ie);
    }
    function l(X, se, ie, Re) {
      for (var rt = -1, At = X == null ? 0 : X.length; ++rt < At; ) {
        var Xt = X[rt];
        se(Re, Xt, ie(Xt), X);
      }
      return Re;
    }
    function h(X, se) {
      for (var ie = -1, Re = X == null ? 0 : X.length; ++ie < Re && se(X[ie], ie, X) !== !1; )
        ;
      return X;
    }
    function y(X, se) {
      for (var ie = X == null ? 0 : X.length; ie-- && se(X[ie], ie, X) !== !1; )
        ;
      return X;
    }
    function C(X, se) {
      for (var ie = -1, Re = X == null ? 0 : X.length; ++ie < Re; )
        if (!se(X[ie], ie, X))
          return !1;
      return !0;
    }
    function T(X, se) {
      for (var ie = -1, Re = X == null ? 0 : X.length, rt = 0, At = []; ++ie < Re; ) {
        var Xt = X[ie];
        se(Xt, ie, X) && (At[rt++] = Xt);
      }
      return At;
    }
    function N(X, se) {
      var ie = X == null ? 0 : X.length;
      return !!ie && Wt(X, se, 0) > -1;
    }
    function q(X, se, ie) {
      for (var Re = -1, rt = X == null ? 0 : X.length; ++Re < rt; )
        if (ie(se, X[Re]))
          return !0;
      return !1;
    }
    function V(X, se) {
      for (var ie = -1, Re = X == null ? 0 : X.length, rt = Array(Re); ++ie < Re; )
        rt[ie] = se(X[ie], ie, X);
      return rt;
    }
    function G(X, se) {
      for (var ie = -1, Re = se.length, rt = X.length; ++ie < Re; )
        X[rt + ie] = se[ie];
      return X;
    }
    function Z(X, se, ie, Re) {
      var rt = -1, At = X == null ? 0 : X.length;
      for (Re && At && (ie = X[++rt]); ++rt < At; )
        ie = se(ie, X[rt], rt, X);
      return ie;
    }
    function me(X, se, ie, Re) {
      var rt = X == null ? 0 : X.length;
      for (Re && rt && (ie = X[--rt]); rt--; )
        ie = se(ie, X[rt], rt, X);
      return ie;
    }
    function Pe(X, se) {
      for (var ie = -1, Re = X == null ? 0 : X.length; ++ie < Re; )
        if (se(X[ie], ie, X))
          return !0;
      return !1;
    }
    var ve = ut("length");
    function nt(X) {
      return X.split("");
    }
    function Ye(X) {
      return X.match(Ns) || [];
    }
    function st(X, se, ie) {
      var Re;
      return ie(X, function(rt, At, Xt) {
        if (se(rt, At, Xt))
          return Re = At, !1;
      }), Re;
    }
    function on(X, se, ie, Re) {
      for (var rt = X.length, At = ie + (Re ? 1 : -1); Re ? At-- : ++At < rt; )
        if (se(X[At], At, X))
          return At;
      return -1;
    }
    function Wt(X, se, ie) {
      return se === se ? Io(X, se, ie) : on(X, De, ie);
    }
    function Pr(X, se, ie, Re) {
      for (var rt = ie - 1, At = X.length; ++rt < At; )
        if (Re(X[rt], se))
          return rt;
      return -1;
    }
    function De(X) {
      return X !== X;
    }
    function tn(X, se) {
      var ie = X == null ? 0 : X.length;
      return ie ? yn(X, se) / ie : ae;
    }
    function ut(X) {
      return function(se) {
        return se == null ? t : se[X];
      };
    }
    function jt(X) {
      return function(se) {
        return X == null ? t : X[se];
      };
    }
    function cr(X, se, ie, Re, rt) {
      return rt(X, function(At, Xt, St) {
        ie = Re ? (Re = !1, At) : se(ie, At, Xt, St);
      }), ie;
    }
    function Ro(X, se) {
      var ie = X.length;
      for (X.sort(se); ie--; )
        X[ie] = X[ie].value;
      return X;
    }
    function yn(X, se) {
      for (var ie, Re = -1, rt = X.length; ++Re < rt; ) {
        var At = se(X[Re]);
        At !== t && (ie = ie === t ? At : ie + At);
      }
      return ie;
    }
    function fr(X, se) {
      for (var ie = -1, Re = Array(X); ++ie < X; )
        Re[ie] = se(ie);
      return Re;
    }
    function kr(X, se) {
      return V(se, function(ie) {
        return [ie, X[ie]];
      });
    }
    function dr(X) {
      return X && X.slice(0, ou(X) + 1).replace(xo, "");
    }
    function It(X) {
      return function(se) {
        return X(se);
      };
    }
    function wn(X, se) {
      return V(se, function(ie) {
        return X[ie];
      });
    }
    function Yi(X, se) {
      return X.has(se);
    }
    function hr(X, se) {
      for (var ie = -1, Re = X.length; ++ie < Re && Wt(se, X[ie], 0) > -1; )
        ;
      return ie;
    }
    function Pa(X, se) {
      for (var ie = X.length; ie-- && Wt(se, X[ie], 0) > -1; )
        ;
      return ie;
    }
    function Qr(X, se) {
      for (var ie = X.length, Re = 0; ie--; )
        X[ie] === se && ++Re;
      return Re;
    }
    var ka = jt(Hl), Ot = jt(Wl);
    function Jr(X) {
      return "\\" + Ul[X];
    }
    function nu(X, se) {
      return X == null ? t : X[se];
    }
    function Nr(X) {
      return $a.test(X);
    }
    function Xl(X) {
      return Ei.test(X);
    }
    function Mo(X) {
      for (var se, ie = []; !(se = X.next()).done; )
        ie.push(se.value);
      return ie;
    }
    function Na(X) {
      var se = -1, ie = Array(X.size);
      return X.forEach(function(Re, rt) {
        ie[++se] = [rt, Re];
      }), ie;
    }
    function ru(X, se) {
      return function(ie) {
        return X(se(ie));
      };
    }
    function Or(X, se) {
      for (var ie = -1, Re = X.length, rt = 0, At = []; ++ie < Re; ) {
        var Xt = X[ie];
        (Xt === se || Xt === b) && (X[ie] = b, At[rt++] = ie);
      }
      return At;
    }
    function Do(X) {
      var se = -1, ie = Array(X.size);
      return X.forEach(function(Re) {
        ie[++se] = Re;
      }), ie;
    }
    function iu(X) {
      var se = -1, ie = Array(X.size);
      return X.forEach(function(Re) {
        ie[++se] = [Re, Re];
      }), ie;
    }
    function Io(X, se, ie) {
      for (var Re = ie - 1, rt = X.length; ++Re < rt; )
        if (X[Re] === se)
          return Re;
      return -1;
    }
    function Yl(X, se, ie) {
      for (var Re = ie + 1; Re--; )
        if (X[Re] === se)
          return Re;
      return Re;
    }
    function Ai(X) {
      return Nr(X) ? Ql(X) : ve(X);
    }
    function ln(X) {
      return Nr(X) ? pr(X) : nt(X);
    }
    function ou(X) {
      for (var se = X.length; se-- && Ui.test(X.charAt(se)); )
        ;
      return se;
    }
    var Oa = jt(Vl);
    function Ql(X) {
      for (var se = Ki.lastIndex = 0; Ki.test(X); )
        ++se;
      return se;
    }
    function pr(X) {
      return X.match(Ki) || [];
    }
    function gr(X) {
      return X.match(Xs) || [];
    }
    var au = function X(se) {
      se = se == null ? Kt : Ct.defaults(Kt.Object(), se, Ct.pick(Kt, Ys));
      var ie = se.Array, Re = se.Date, rt = se.Error, At = se.Function, Xt = se.Math, St = se.Object, Qi = se.RegExp, su = se.String, cn = se.TypeError, Ti = ie.prototype, La = At.prototype, Pi = St.prototype, Zr = se["__core-js_shared__"], ki = La.toString, Tt = Pi.hasOwnProperty, Jl = 0, D = function() {
        var r = /[^.]+$/.exec(Zr && Zr.keys && Zr.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), H = Pi.toString, K = ki.call(St), le = Kt._, ee = Qi(
        "^" + ki.call(Tt).replace(ma, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), ge = Ci ? se.Buffer : t, fe = se.Symbol, Te = se.Uint8Array, Be = ge ? ge.allocUnsafe : t, tt = ru(St.getPrototypeOf, St), je = St.create, Qe = Pi.propertyIsEnumerable, ct = Ti.splice, Pt = fe ? fe.isConcatSpreadable : t, Ue = fe ? fe.iterator : t, qt = fe ? fe.toStringTag : t, Yt = function() {
        try {
          var r = ro(St, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), Cn = se.clearTimeout !== Kt.clearTimeout && se.clearTimeout, Bt = Re && Re.now !== Kt.Date.now && Re.now, Ji = se.setTimeout !== Kt.setTimeout && se.setTimeout, Lr = Xt.ceil, an = Xt.floor, Zl = St.getOwnPropertySymbols, Kv = ge ? ge.isBuffer : t, Wd = se.isFinite, Xv = Ti.join, Yv = ru(St.keys, St), nn = Xt.max, bn = Xt.min, Qv = Re.now, Jv = se.parseInt, Vd = Xt.random, Zv = Ti.reverse, ec = ro(se, "DataView"), Ra = ro(se, "Map"), tc = ro(se, "Promise"), Fo = ro(se, "Set"), Ma = ro(se, "WeakMap"), Da = ro(St, "create"), uu = Ma && new Ma(), qo = {}, ey = io(ec), ty = io(Ra), ny = io(tc), ry = io(Fo), iy = io(Ma), lu = fe ? fe.prototype : t, Ia = lu ? lu.valueOf : t, Ud = lu ? lu.toString : t;
      function O(r) {
        if (Gt(r) && !lt(r) && !(r instanceof _t)) {
          if (r instanceof Qn)
            return r;
          if (Tt.call(r, "__wrapped__"))
            return Gh(r);
        }
        return new Qn(r);
      }
      var zo = /* @__PURE__ */ function() {
        function r() {
        }
        return function(i) {
          if (!Vt(i))
            return {};
          if (je)
            return je(i);
          r.prototype = i;
          var c = new r();
          return r.prototype = t, c;
        };
      }();
      function cu() {
      }
      function Qn(r, i) {
        this.__wrapped__ = r, this.__actions__ = [], this.__chain__ = !!i, this.__index__ = 0, this.__values__ = t;
      }
      O.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: wi,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: Xn,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: Vi,
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
          _: O
        }
      }, O.prototype = cu.prototype, O.prototype.constructor = O, Qn.prototype = zo(cu.prototype), Qn.prototype.constructor = Qn;
      function _t(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = R, this.__views__ = [];
      }
      function oy() {
        var r = new _t(this.__wrapped__);
        return r.__actions__ = Ln(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = Ln(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = Ln(this.__views__), r;
      }
      function ay() {
        if (this.__filtered__) {
          var r = new _t(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function sy() {
        var r = this.__wrapped__.value(), i = this.__dir__, c = lt(r), S = i < 0, P = c ? r.length : 0, M = w0(0, P, this.__views__), z = M.start, W = M.end, Q = W - z, de = S ? W : z - 1, he = this.__iteratees__, ye = he.length, Oe = 0, qe = bn(Q, this.__takeCount__);
        if (!c || !S && P == Q && qe == Q)
          return mh(r, this.__actions__);
        var Je = [];
        e:
          for (; Q-- && Oe < qe; ) {
            de += i;
            for (var ht = -1, Ze = r[de]; ++ht < ye; ) {
              var bt = he[ht], $t = bt.iteratee, Wn = bt.type, Pn = $t(Ze);
              if (Wn == _e)
                Ze = Pn;
              else if (!Pn) {
                if (Wn == J)
                  continue e;
                break e;
              }
            }
            Je[Oe++] = Ze;
          }
        return Je;
      }
      _t.prototype = zo(cu.prototype), _t.prototype.constructor = _t;
      function Zi(r) {
        var i = -1, c = r == null ? 0 : r.length;
        for (this.clear(); ++i < c; ) {
          var S = r[i];
          this.set(S[0], S[1]);
        }
      }
      function uy() {
        this.__data__ = Da ? Da(null) : {}, this.size = 0;
      }
      function ly(r) {
        var i = this.has(r) && delete this.__data__[r];
        return this.size -= i ? 1 : 0, i;
      }
      function cy(r) {
        var i = this.__data__;
        if (Da) {
          var c = i[r];
          return c === p ? t : c;
        }
        return Tt.call(i, r) ? i[r] : t;
      }
      function fy(r) {
        var i = this.__data__;
        return Da ? i[r] !== t : Tt.call(i, r);
      }
      function dy(r, i) {
        var c = this.__data__;
        return this.size += this.has(r) ? 0 : 1, c[r] = Da && i === t ? p : i, this;
      }
      Zi.prototype.clear = uy, Zi.prototype.delete = ly, Zi.prototype.get = cy, Zi.prototype.has = fy, Zi.prototype.set = dy;
      function ei(r) {
        var i = -1, c = r == null ? 0 : r.length;
        for (this.clear(); ++i < c; ) {
          var S = r[i];
          this.set(S[0], S[1]);
        }
      }
      function hy() {
        this.__data__ = [], this.size = 0;
      }
      function py(r) {
        var i = this.__data__, c = fu(i, r);
        if (c < 0)
          return !1;
        var S = i.length - 1;
        return c == S ? i.pop() : ct.call(i, c, 1), --this.size, !0;
      }
      function gy(r) {
        var i = this.__data__, c = fu(i, r);
        return c < 0 ? t : i[c][1];
      }
      function my(r) {
        return fu(this.__data__, r) > -1;
      }
      function vy(r, i) {
        var c = this.__data__, S = fu(c, r);
        return S < 0 ? (++this.size, c.push([r, i])) : c[S][1] = i, this;
      }
      ei.prototype.clear = hy, ei.prototype.delete = py, ei.prototype.get = gy, ei.prototype.has = my, ei.prototype.set = vy;
      function ti(r) {
        var i = -1, c = r == null ? 0 : r.length;
        for (this.clear(); ++i < c; ) {
          var S = r[i];
          this.set(S[0], S[1]);
        }
      }
      function yy() {
        this.size = 0, this.__data__ = {
          hash: new Zi(),
          map: new (Ra || ei)(),
          string: new Zi()
        };
      }
      function wy(r) {
        var i = Su(this, r).delete(r);
        return this.size -= i ? 1 : 0, i;
      }
      function by(r) {
        return Su(this, r).get(r);
      }
      function _y(r) {
        return Su(this, r).has(r);
      }
      function xy(r, i) {
        var c = Su(this, r), S = c.size;
        return c.set(r, i), this.size += c.size == S ? 0 : 1, this;
      }
      ti.prototype.clear = yy, ti.prototype.delete = wy, ti.prototype.get = by, ti.prototype.has = _y, ti.prototype.set = xy;
      function eo(r) {
        var i = -1, c = r == null ? 0 : r.length;
        for (this.__data__ = new ti(); ++i < c; )
          this.add(r[i]);
      }
      function Sy(r) {
        return this.__data__.set(r, p), this;
      }
      function $y(r) {
        return this.__data__.has(r);
      }
      eo.prototype.add = eo.prototype.push = Sy, eo.prototype.has = $y;
      function mr(r) {
        var i = this.__data__ = new ei(r);
        this.size = i.size;
      }
      function Ey() {
        this.__data__ = new ei(), this.size = 0;
      }
      function Cy(r) {
        var i = this.__data__, c = i.delete(r);
        return this.size = i.size, c;
      }
      function Ay(r) {
        return this.__data__.get(r);
      }
      function Ty(r) {
        return this.__data__.has(r);
      }
      function Py(r, i) {
        var c = this.__data__;
        if (c instanceof ei) {
          var S = c.__data__;
          if (!Ra || S.length < u - 1)
            return S.push([r, i]), this.size = ++c.size, this;
          c = this.__data__ = new ti(S);
        }
        return c.set(r, i), this.size = c.size, this;
      }
      mr.prototype.clear = Ey, mr.prototype.delete = Cy, mr.prototype.get = Ay, mr.prototype.has = Ty, mr.prototype.set = Py;
      function Gd(r, i) {
        var c = lt(r), S = !c && oo(r), P = !c && !S && Mi(r), M = !c && !S && !P && Wo(r), z = c || S || P || M, W = z ? fr(r.length, su) : [], Q = W.length;
        for (var de in r)
          (i || Tt.call(r, de)) && !(z && // Safari 9 has enumerable `arguments.length` in strict mode.
          (de == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          P && (de == "offset" || de == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          M && (de == "buffer" || de == "byteLength" || de == "byteOffset") || // Skip index properties.
          oi(de, Q))) && W.push(de);
        return W;
      }
      function Kd(r) {
        var i = r.length;
        return i ? r[dc(0, i - 1)] : t;
      }
      function ky(r, i) {
        return $u(Ln(r), to(i, 0, r.length));
      }
      function Ny(r) {
        return $u(Ln(r));
      }
      function nc(r, i, c) {
        (c !== t && !vr(r[i], c) || c === t && !(i in r)) && ni(r, i, c);
      }
      function Fa(r, i, c) {
        var S = r[i];
        (!(Tt.call(r, i) && vr(S, c)) || c === t && !(i in r)) && ni(r, i, c);
      }
      function fu(r, i) {
        for (var c = r.length; c--; )
          if (vr(r[c][0], i))
            return c;
        return -1;
      }
      function Oy(r, i, c, S) {
        return Ni(r, function(P, M, z) {
          i(S, P, c(P), z);
        }), S;
      }
      function Xd(r, i) {
        return r && Mr(i, sn(i), r);
      }
      function Ly(r, i) {
        return r && Mr(i, Mn(i), r);
      }
      function ni(r, i, c) {
        i == "__proto__" && Yt ? Yt(r, i, {
          configurable: !0,
          enumerable: !0,
          value: c,
          writable: !0
        }) : r[i] = c;
      }
      function rc(r, i) {
        for (var c = -1, S = i.length, P = ie(S), M = r == null; ++c < S; )
          P[c] = M ? t : Ic(r, i[c]);
        return P;
      }
      function to(r, i, c) {
        return r === r && (c !== t && (r = r <= c ? r : c), i !== t && (r = r >= i ? r : i)), r;
      }
      function Jn(r, i, c, S, P, M) {
        var z, W = i & w, Q = i & m, de = i & x;
        if (c && (z = P ? c(r, S, P, M) : c(r)), z !== t)
          return z;
        if (!Vt(r))
          return r;
        var he = lt(r);
        if (he) {
          if (z = _0(r), !W)
            return Ln(r, z);
        } else {
          var ye = _n(r), Oe = ye == Ie || ye == ue;
          if (Mi(r))
            return wh(r, W);
          if (ye == vt || ye == B || Oe && !P) {
            if (z = Q || Oe ? {} : Fh(r), !W)
              return Q ? c0(r, Ly(z, r)) : l0(r, Xd(z, r));
          } else {
            if (!Dt[ye])
              return P ? r : {};
            z = x0(r, ye, W);
          }
        }
        M || (M = new mr());
        var qe = M.get(r);
        if (qe)
          return qe;
        M.set(r, z), hp(r) ? r.forEach(function(Ze) {
          z.add(Jn(Ze, i, c, Ze, r, M));
        }) : fp(r) && r.forEach(function(Ze, bt) {
          z.set(bt, Jn(Ze, i, c, bt, r, M));
        });
        var Je = de ? Q ? Sc : xc : Q ? Mn : sn, ht = he ? t : Je(r);
        return h(ht || r, function(Ze, bt) {
          ht && (bt = Ze, Ze = r[bt]), Fa(z, bt, Jn(Ze, i, c, bt, r, M));
        }), z;
      }
      function Ry(r) {
        var i = sn(r);
        return function(c) {
          return Yd(c, r, i);
        };
      }
      function Yd(r, i, c) {
        var S = c.length;
        if (r == null)
          return !S;
        for (r = St(r); S--; ) {
          var P = c[S], M = i[P], z = r[P];
          if (z === t && !(P in r) || !M(z))
            return !1;
        }
        return !0;
      }
      function Qd(r, i, c) {
        if (typeof r != "function")
          throw new cn(d);
        return Va(function() {
          r.apply(t, c);
        }, i);
      }
      function qa(r, i, c, S) {
        var P = -1, M = N, z = !0, W = r.length, Q = [], de = i.length;
        if (!W)
          return Q;
        c && (i = V(i, It(c))), S ? (M = q, z = !1) : i.length >= u && (M = Yi, z = !1, i = new eo(i));
        e:
          for (; ++P < W; ) {
            var he = r[P], ye = c == null ? he : c(he);
            if (he = S || he !== 0 ? he : 0, z && ye === ye) {
              for (var Oe = de; Oe--; )
                if (i[Oe] === ye)
                  continue e;
              Q.push(he);
            } else M(i, ye, S) || Q.push(he);
          }
        return Q;
      }
      var Ni = $h(Rr), Jd = $h(oc, !0);
      function My(r, i) {
        var c = !0;
        return Ni(r, function(S, P, M) {
          return c = !!i(S, P, M), c;
        }), c;
      }
      function du(r, i, c) {
        for (var S = -1, P = r.length; ++S < P; ) {
          var M = r[S], z = i(M);
          if (z != null && (W === t ? z === z && !Hn(z) : c(z, W)))
            var W = z, Q = M;
        }
        return Q;
      }
      function Dy(r, i, c, S) {
        var P = r.length;
        for (c = ft(c), c < 0 && (c = -c > P ? 0 : P + c), S = S === t || S > P ? P : ft(S), S < 0 && (S += P), S = c > S ? 0 : gp(S); c < S; )
          r[c++] = i;
        return r;
      }
      function Zd(r, i) {
        var c = [];
        return Ni(r, function(S, P, M) {
          i(S, P, M) && c.push(S);
        }), c;
      }
      function fn(r, i, c, S, P) {
        var M = -1, z = r.length;
        for (c || (c = $0), P || (P = []); ++M < z; ) {
          var W = r[M];
          i > 0 && c(W) ? i > 1 ? fn(W, i - 1, c, S, P) : G(P, W) : S || (P[P.length] = W);
        }
        return P;
      }
      var ic = Eh(), eh = Eh(!0);
      function Rr(r, i) {
        return r && ic(r, i, sn);
      }
      function oc(r, i) {
        return r && eh(r, i, sn);
      }
      function hu(r, i) {
        return T(i, function(c) {
          return ai(r[c]);
        });
      }
      function no(r, i) {
        i = Li(i, r);
        for (var c = 0, S = i.length; r != null && c < S; )
          r = r[Dr(i[c++])];
        return c && c == S ? r : t;
      }
      function th(r, i, c) {
        var S = i(r);
        return lt(r) ? S : G(S, c(r));
      }
      function An(r) {
        return r == null ? r === t ? Sn : at : qt && qt in St(r) ? y0(r) : N0(r);
      }
      function ac(r, i) {
        return r > i;
      }
      function Iy(r, i) {
        return r != null && Tt.call(r, i);
      }
      function Fy(r, i) {
        return r != null && i in St(r);
      }
      function qy(r, i, c) {
        return r >= bn(i, c) && r < nn(i, c);
      }
      function sc(r, i, c) {
        for (var S = c ? q : N, P = r[0].length, M = r.length, z = M, W = ie(M), Q = 1 / 0, de = []; z--; ) {
          var he = r[z];
          z && i && (he = V(he, It(i))), Q = bn(he.length, Q), W[z] = !c && (i || P >= 120 && he.length >= 120) ? new eo(z && he) : t;
        }
        he = r[0];
        var ye = -1, Oe = W[0];
        e:
          for (; ++ye < P && de.length < Q; ) {
            var qe = he[ye], Je = i ? i(qe) : qe;
            if (qe = c || qe !== 0 ? qe : 0, !(Oe ? Yi(Oe, Je) : S(de, Je, c))) {
              for (z = M; --z; ) {
                var ht = W[z];
                if (!(ht ? Yi(ht, Je) : S(r[z], Je, c)))
                  continue e;
              }
              Oe && Oe.push(Je), de.push(qe);
            }
          }
        return de;
      }
      function zy(r, i, c, S) {
        return Rr(r, function(P, M, z) {
          i(S, c(P), M, z);
        }), S;
      }
      function za(r, i, c) {
        i = Li(i, r), r = jh(r, i);
        var S = r == null ? r : r[Dr(er(i))];
        return S == null ? t : o(S, r, c);
      }
      function nh(r) {
        return Gt(r) && An(r) == B;
      }
      function By(r) {
        return Gt(r) && An(r) == gn;
      }
      function jy(r) {
        return Gt(r) && An(r) == Ge;
      }
      function Ba(r, i, c, S, P) {
        return r === i ? !0 : r == null || i == null || !Gt(r) && !Gt(i) ? r !== r && i !== i : Hy(r, i, c, S, Ba, P);
      }
      function Hy(r, i, c, S, P, M) {
        var z = lt(r), W = lt(i), Q = z ? re : _n(r), de = W ? re : _n(i);
        Q = Q == B ? vt : Q, de = de == B ? vt : de;
        var he = Q == vt, ye = de == vt, Oe = Q == de;
        if (Oe && Mi(r)) {
          if (!Mi(i))
            return !1;
          z = !0, he = !1;
        }
        if (Oe && !he)
          return M || (M = new mr()), z || Wo(r) ? Mh(r, i, c, S, P, M) : m0(r, i, Q, c, S, P, M);
        if (!(c & s)) {
          var qe = he && Tt.call(r, "__wrapped__"), Je = ye && Tt.call(i, "__wrapped__");
          if (qe || Je) {
            var ht = qe ? r.value() : r, Ze = Je ? i.value() : i;
            return M || (M = new mr()), P(ht, Ze, c, S, M);
          }
        }
        return Oe ? (M || (M = new mr()), v0(r, i, c, S, P, M)) : !1;
      }
      function Wy(r) {
        return Gt(r) && _n(r) == we;
      }
      function uc(r, i, c, S) {
        var P = c.length, M = P, z = !S;
        if (r == null)
          return !M;
        for (r = St(r); P--; ) {
          var W = c[P];
          if (z && W[2] ? W[1] !== r[W[0]] : !(W[0] in r))
            return !1;
        }
        for (; ++P < M; ) {
          W = c[P];
          var Q = W[0], de = r[Q], he = W[1];
          if (z && W[2]) {
            if (de === t && !(Q in r))
              return !1;
          } else {
            var ye = new mr();
            if (S)
              var Oe = S(de, he, Q, r, i, ye);
            if (!(Oe === t ? Ba(he, de, s | $, S, ye) : Oe))
              return !1;
          }
        }
        return !0;
      }
      function rh(r) {
        if (!Vt(r) || C0(r))
          return !1;
        var i = ai(r) ? ee : ya;
        return i.test(io(r));
      }
      function Vy(r) {
        return Gt(r) && An(r) == Nt;
      }
      function Uy(r) {
        return Gt(r) && _n(r) == Ft;
      }
      function Gy(r) {
        return Gt(r) && ku(r.length) && !!Rt[An(r)];
      }
      function ih(r) {
        return typeof r == "function" ? r : r == null ? Dn : typeof r == "object" ? lt(r) ? sh(r[0], r[1]) : ah(r) : Cp(r);
      }
      function lc(r) {
        if (!Wa(r))
          return Yv(r);
        var i = [];
        for (var c in St(r))
          Tt.call(r, c) && c != "constructor" && i.push(c);
        return i;
      }
      function Ky(r) {
        if (!Vt(r))
          return k0(r);
        var i = Wa(r), c = [];
        for (var S in r)
          S == "constructor" && (i || !Tt.call(r, S)) || c.push(S);
        return c;
      }
      function cc(r, i) {
        return r < i;
      }
      function oh(r, i) {
        var c = -1, S = Rn(r) ? ie(r.length) : [];
        return Ni(r, function(P, M, z) {
          S[++c] = i(P, M, z);
        }), S;
      }
      function ah(r) {
        var i = Ec(r);
        return i.length == 1 && i[0][2] ? zh(i[0][0], i[0][1]) : function(c) {
          return c === r || uc(c, r, i);
        };
      }
      function sh(r, i) {
        return Ac(r) && qh(i) ? zh(Dr(r), i) : function(c) {
          var S = Ic(c, r);
          return S === t && S === i ? Fc(c, r) : Ba(i, S, s | $);
        };
      }
      function pu(r, i, c, S, P) {
        r !== i && ic(i, function(M, z) {
          if (P || (P = new mr()), Vt(M))
            Xy(r, i, z, c, pu, S, P);
          else {
            var W = S ? S(Pc(r, z), M, z + "", r, i, P) : t;
            W === t && (W = M), nc(r, z, W);
          }
        }, Mn);
      }
      function Xy(r, i, c, S, P, M, z) {
        var W = Pc(r, c), Q = Pc(i, c), de = z.get(Q);
        if (de) {
          nc(r, c, de);
          return;
        }
        var he = M ? M(W, Q, c + "", r, i, z) : t, ye = he === t;
        if (ye) {
          var Oe = lt(Q), qe = !Oe && Mi(Q), Je = !Oe && !qe && Wo(Q);
          he = Q, Oe || qe || Je ? lt(W) ? he = W : Qt(W) ? he = Ln(W) : qe ? (ye = !1, he = wh(Q, !0)) : Je ? (ye = !1, he = bh(Q, !0)) : he = [] : Ua(Q) || oo(Q) ? (he = W, oo(W) ? he = mp(W) : (!Vt(W) || ai(W)) && (he = Fh(Q))) : ye = !1;
        }
        ye && (z.set(Q, he), P(he, Q, S, M, z), z.delete(Q)), nc(r, c, he);
      }
      function uh(r, i) {
        var c = r.length;
        if (c)
          return i += i < 0 ? c : 0, oi(i, c) ? r[i] : t;
      }
      function lh(r, i, c) {
        i.length ? i = V(i, function(M) {
          return lt(M) ? function(z) {
            return no(z, M.length === 1 ? M[0] : M);
          } : M;
        }) : i = [Dn];
        var S = -1;
        i = V(i, It(Xe()));
        var P = oh(r, function(M, z, W) {
          var Q = V(i, function(de) {
            return de(M);
          });
          return { criteria: Q, index: ++S, value: M };
        });
        return Ro(P, function(M, z) {
          return u0(M, z, c);
        });
      }
      function Yy(r, i) {
        return ch(r, i, function(c, S) {
          return Fc(r, S);
        });
      }
      function ch(r, i, c) {
        for (var S = -1, P = i.length, M = {}; ++S < P; ) {
          var z = i[S], W = no(r, z);
          c(W, z) && ja(M, Li(z, r), W);
        }
        return M;
      }
      function Qy(r) {
        return function(i) {
          return no(i, r);
        };
      }
      function fc(r, i, c, S) {
        var P = S ? Pr : Wt, M = -1, z = i.length, W = r;
        for (r === i && (i = Ln(i)), c && (W = V(r, It(c))); ++M < z; )
          for (var Q = 0, de = i[M], he = c ? c(de) : de; (Q = P(W, he, Q, S)) > -1; )
            W !== r && ct.call(W, Q, 1), ct.call(r, Q, 1);
        return r;
      }
      function fh(r, i) {
        for (var c = r ? i.length : 0, S = c - 1; c--; ) {
          var P = i[c];
          if (c == S || P !== M) {
            var M = P;
            oi(P) ? ct.call(r, P, 1) : gc(r, P);
          }
        }
        return r;
      }
      function dc(r, i) {
        return r + an(Vd() * (i - r + 1));
      }
      function Jy(r, i, c, S) {
        for (var P = -1, M = nn(Lr((i - r) / (c || 1)), 0), z = ie(M); M--; )
          z[S ? M : ++P] = r, r += c;
        return z;
      }
      function hc(r, i) {
        var c = "";
        if (!r || i < 1 || i > ke)
          return c;
        do
          i % 2 && (c += r), i = an(i / 2), i && (r += r);
        while (i);
        return c;
      }
      function pt(r, i) {
        return kc(Bh(r, i, Dn), r + "");
      }
      function Zy(r) {
        return Kd(Vo(r));
      }
      function e0(r, i) {
        var c = Vo(r);
        return $u(c, to(i, 0, c.length));
      }
      function ja(r, i, c, S) {
        if (!Vt(r))
          return r;
        i = Li(i, r);
        for (var P = -1, M = i.length, z = M - 1, W = r; W != null && ++P < M; ) {
          var Q = Dr(i[P]), de = c;
          if (Q === "__proto__" || Q === "constructor" || Q === "prototype")
            return r;
          if (P != z) {
            var he = W[Q];
            de = S ? S(he, Q, W) : t, de === t && (de = Vt(he) ? he : oi(i[P + 1]) ? [] : {});
          }
          Fa(W, Q, de), W = W[Q];
        }
        return r;
      }
      var dh = uu ? function(r, i) {
        return uu.set(r, i), r;
      } : Dn, t0 = Yt ? function(r, i) {
        return Yt(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: zc(i),
          writable: !0
        });
      } : Dn;
      function n0(r) {
        return $u(Vo(r));
      }
      function Zn(r, i, c) {
        var S = -1, P = r.length;
        i < 0 && (i = -i > P ? 0 : P + i), c = c > P ? P : c, c < 0 && (c += P), P = i > c ? 0 : c - i >>> 0, i >>>= 0;
        for (var M = ie(P); ++S < P; )
          M[S] = r[S + i];
        return M;
      }
      function r0(r, i) {
        var c;
        return Ni(r, function(S, P, M) {
          return c = i(S, P, M), !c;
        }), !!c;
      }
      function gu(r, i, c) {
        var S = 0, P = r == null ? S : r.length;
        if (typeof i == "number" && i === i && P <= Y) {
          for (; S < P; ) {
            var M = S + P >>> 1, z = r[M];
            z !== null && !Hn(z) && (c ? z <= i : z < i) ? S = M + 1 : P = M;
          }
          return P;
        }
        return pc(r, i, Dn, c);
      }
      function pc(r, i, c, S) {
        var P = 0, M = r == null ? 0 : r.length;
        if (M === 0)
          return 0;
        i = c(i);
        for (var z = i !== i, W = i === null, Q = Hn(i), de = i === t; P < M; ) {
          var he = an((P + M) / 2), ye = c(r[he]), Oe = ye !== t, qe = ye === null, Je = ye === ye, ht = Hn(ye);
          if (z)
            var Ze = S || Je;
          else de ? Ze = Je && (S || Oe) : W ? Ze = Je && Oe && (S || !qe) : Q ? Ze = Je && Oe && !qe && (S || !ht) : qe || ht ? Ze = !1 : Ze = S ? ye <= i : ye < i;
          Ze ? P = he + 1 : M = he;
        }
        return bn(M, te);
      }
      function hh(r, i) {
        for (var c = -1, S = r.length, P = 0, M = []; ++c < S; ) {
          var z = r[c], W = i ? i(z) : z;
          if (!c || !vr(W, Q)) {
            var Q = W;
            M[P++] = z === 0 ? 0 : z;
          }
        }
        return M;
      }
      function ph(r) {
        return typeof r == "number" ? r : Hn(r) ? ae : +r;
      }
      function jn(r) {
        if (typeof r == "string")
          return r;
        if (lt(r))
          return V(r, jn) + "";
        if (Hn(r))
          return Ud ? Ud.call(r) : "";
        var i = r + "";
        return i == "0" && 1 / r == -pe ? "-0" : i;
      }
      function Oi(r, i, c) {
        var S = -1, P = N, M = r.length, z = !0, W = [], Q = W;
        if (c)
          z = !1, P = q;
        else if (M >= u) {
          var de = i ? null : p0(r);
          if (de)
            return Do(de);
          z = !1, P = Yi, Q = new eo();
        } else
          Q = i ? [] : W;
        e:
          for (; ++S < M; ) {
            var he = r[S], ye = i ? i(he) : he;
            if (he = c || he !== 0 ? he : 0, z && ye === ye) {
              for (var Oe = Q.length; Oe--; )
                if (Q[Oe] === ye)
                  continue e;
              i && Q.push(ye), W.push(he);
            } else P(Q, ye, c) || (Q !== W && Q.push(ye), W.push(he));
          }
        return W;
      }
      function gc(r, i) {
        return i = Li(i, r), r = jh(r, i), r == null || delete r[Dr(er(i))];
      }
      function gh(r, i, c, S) {
        return ja(r, i, c(no(r, i)), S);
      }
      function mu(r, i, c, S) {
        for (var P = r.length, M = S ? P : -1; (S ? M-- : ++M < P) && i(r[M], M, r); )
          ;
        return c ? Zn(r, S ? 0 : M, S ? M + 1 : P) : Zn(r, S ? M + 1 : 0, S ? P : M);
      }
      function mh(r, i) {
        var c = r;
        return c instanceof _t && (c = c.value()), Z(i, function(S, P) {
          return P.func.apply(P.thisArg, G([S], P.args));
        }, c);
      }
      function mc(r, i, c) {
        var S = r.length;
        if (S < 2)
          return S ? Oi(r[0]) : [];
        for (var P = -1, M = ie(S); ++P < S; )
          for (var z = r[P], W = -1; ++W < S; )
            W != P && (M[P] = qa(M[P] || z, r[W], i, c));
        return Oi(fn(M, 1), i, c);
      }
      function vh(r, i, c) {
        for (var S = -1, P = r.length, M = i.length, z = {}; ++S < P; ) {
          var W = S < M ? i[S] : t;
          c(z, r[S], W);
        }
        return z;
      }
      function vc(r) {
        return Qt(r) ? r : [];
      }
      function yc(r) {
        return typeof r == "function" ? r : Dn;
      }
      function Li(r, i) {
        return lt(r) ? r : Ac(r, i) ? [r] : Uh(Lt(r));
      }
      var i0 = pt;
      function Ri(r, i, c) {
        var S = r.length;
        return c = c === t ? S : c, !i && c >= S ? r : Zn(r, i, c);
      }
      var yh = Cn || function(r) {
        return Kt.clearTimeout(r);
      };
      function wh(r, i) {
        if (i)
          return r.slice();
        var c = r.length, S = Be ? Be(c) : new r.constructor(c);
        return r.copy(S), S;
      }
      function wc(r) {
        var i = new r.constructor(r.byteLength);
        return new Te(i).set(new Te(r)), i;
      }
      function o0(r, i) {
        var c = i ? wc(r.buffer) : r.buffer;
        return new r.constructor(c, r.byteOffset, r.byteLength);
      }
      function a0(r) {
        var i = new r.constructor(r.source, Ar.exec(r));
        return i.lastIndex = r.lastIndex, i;
      }
      function s0(r) {
        return Ia ? St(Ia.call(r)) : {};
      }
      function bh(r, i) {
        var c = i ? wc(r.buffer) : r.buffer;
        return new r.constructor(c, r.byteOffset, r.length);
      }
      function _h(r, i) {
        if (r !== i) {
          var c = r !== t, S = r === null, P = r === r, M = Hn(r), z = i !== t, W = i === null, Q = i === i, de = Hn(i);
          if (!W && !de && !M && r > i || M && z && Q && !W && !de || S && z && Q || !c && Q || !P)
            return 1;
          if (!S && !M && !de && r < i || de && c && P && !S && !M || W && c && P || !z && P || !Q)
            return -1;
        }
        return 0;
      }
      function u0(r, i, c) {
        for (var S = -1, P = r.criteria, M = i.criteria, z = P.length, W = c.length; ++S < z; ) {
          var Q = _h(P[S], M[S]);
          if (Q) {
            if (S >= W)
              return Q;
            var de = c[S];
            return Q * (de == "desc" ? -1 : 1);
          }
        }
        return r.index - i.index;
      }
      function xh(r, i, c, S) {
        for (var P = -1, M = r.length, z = c.length, W = -1, Q = i.length, de = nn(M - z, 0), he = ie(Q + de), ye = !S; ++W < Q; )
          he[W] = i[W];
        for (; ++P < z; )
          (ye || P < M) && (he[c[P]] = r[P]);
        for (; de--; )
          he[W++] = r[P++];
        return he;
      }
      function Sh(r, i, c, S) {
        for (var P = -1, M = r.length, z = -1, W = c.length, Q = -1, de = i.length, he = nn(M - W, 0), ye = ie(he + de), Oe = !S; ++P < he; )
          ye[P] = r[P];
        for (var qe = P; ++Q < de; )
          ye[qe + Q] = i[Q];
        for (; ++z < W; )
          (Oe || P < M) && (ye[qe + c[z]] = r[P++]);
        return ye;
      }
      function Ln(r, i) {
        var c = -1, S = r.length;
        for (i || (i = ie(S)); ++c < S; )
          i[c] = r[c];
        return i;
      }
      function Mr(r, i, c, S) {
        var P = !c;
        c || (c = {});
        for (var M = -1, z = i.length; ++M < z; ) {
          var W = i[M], Q = S ? S(c[W], r[W], W, c, r) : t;
          Q === t && (Q = r[W]), P ? ni(c, W, Q) : Fa(c, W, Q);
        }
        return c;
      }
      function l0(r, i) {
        return Mr(r, Cc(r), i);
      }
      function c0(r, i) {
        return Mr(r, Dh(r), i);
      }
      function vu(r, i) {
        return function(c, S) {
          var P = lt(c) ? l : Oy, M = i ? i() : {};
          return P(c, r, Xe(S, 2), M);
        };
      }
      function Bo(r) {
        return pt(function(i, c) {
          var S = -1, P = c.length, M = P > 1 ? c[P - 1] : t, z = P > 2 ? c[2] : t;
          for (M = r.length > 3 && typeof M == "function" ? (P--, M) : t, z && Tn(c[0], c[1], z) && (M = P < 3 ? t : M, P = 1), i = St(i); ++S < P; ) {
            var W = c[S];
            W && r(i, W, S, M);
          }
          return i;
        });
      }
      function $h(r, i) {
        return function(c, S) {
          if (c == null)
            return c;
          if (!Rn(c))
            return r(c, S);
          for (var P = c.length, M = i ? P : -1, z = St(c); (i ? M-- : ++M < P) && S(z[M], M, z) !== !1; )
            ;
          return c;
        };
      }
      function Eh(r) {
        return function(i, c, S) {
          for (var P = -1, M = St(i), z = S(i), W = z.length; W--; ) {
            var Q = z[r ? W : ++P];
            if (c(M[Q], Q, M) === !1)
              break;
          }
          return i;
        };
      }
      function f0(r, i, c) {
        var S = i & E, P = Ha(r);
        function M() {
          var z = this && this !== Kt && this instanceof M ? P : r;
          return z.apply(S ? c : this, arguments);
        }
        return M;
      }
      function Ch(r) {
        return function(i) {
          i = Lt(i);
          var c = Nr(i) ? ln(i) : t, S = c ? c[0] : i.charAt(0), P = c ? Ri(c, 1).join("") : i.slice(1);
          return S[r]() + P;
        };
      }
      function jo(r) {
        return function(i) {
          return Z($p(Sp(i).replace(Gs, "")), r, "");
        };
      }
      function Ha(r) {
        return function() {
          var i = arguments;
          switch (i.length) {
            case 0:
              return new r();
            case 1:
              return new r(i[0]);
            case 2:
              return new r(i[0], i[1]);
            case 3:
              return new r(i[0], i[1], i[2]);
            case 4:
              return new r(i[0], i[1], i[2], i[3]);
            case 5:
              return new r(i[0], i[1], i[2], i[3], i[4]);
            case 6:
              return new r(i[0], i[1], i[2], i[3], i[4], i[5]);
            case 7:
              return new r(i[0], i[1], i[2], i[3], i[4], i[5], i[6]);
          }
          var c = zo(r.prototype), S = r.apply(c, i);
          return Vt(S) ? S : c;
        };
      }
      function d0(r, i, c) {
        var S = Ha(r);
        function P() {
          for (var M = arguments.length, z = ie(M), W = M, Q = Ho(P); W--; )
            z[W] = arguments[W];
          var de = M < 3 && z[0] !== Q && z[M - 1] !== Q ? [] : Or(z, Q);
          if (M -= de.length, M < c)
            return Nh(
              r,
              i,
              yu,
              P.placeholder,
              t,
              z,
              de,
              t,
              t,
              c - M
            );
          var he = this && this !== Kt && this instanceof P ? S : r;
          return o(he, this, z);
        }
        return P;
      }
      function Ah(r) {
        return function(i, c, S) {
          var P = St(i);
          if (!Rn(i)) {
            var M = Xe(c, 3);
            i = sn(i), c = function(W) {
              return M(P[W], W, P);
            };
          }
          var z = r(i, c, S);
          return z > -1 ? P[M ? i[z] : z] : t;
        };
      }
      function Th(r) {
        return ii(function(i) {
          var c = i.length, S = c, P = Qn.prototype.thru;
          for (r && i.reverse(); S--; ) {
            var M = i[S];
            if (typeof M != "function")
              throw new cn(d);
            if (P && !z && xu(M) == "wrapper")
              var z = new Qn([], !0);
          }
          for (S = z ? S : c; ++S < c; ) {
            M = i[S];
            var W = xu(M), Q = W == "wrapper" ? $c(M) : t;
            Q && Tc(Q[0]) && Q[1] == (ne | F | j | Se) && !Q[4].length && Q[9] == 1 ? z = z[xu(Q[0])].apply(z, Q[3]) : z = M.length == 1 && Tc(M) ? z[W]() : z.thru(M);
          }
          return function() {
            var de = arguments, he = de[0];
            if (z && de.length == 1 && lt(he))
              return z.plant(he).value();
            for (var ye = 0, Oe = c ? i[ye].apply(this, de) : he; ++ye < c; )
              Oe = i[ye].call(this, Oe);
            return Oe;
          };
        });
      }
      function yu(r, i, c, S, P, M, z, W, Q, de) {
        var he = i & ne, ye = i & E, Oe = i & A, qe = i & (F | k), Je = i & Ce, ht = Oe ? t : Ha(r);
        function Ze() {
          for (var bt = arguments.length, $t = ie(bt), Wn = bt; Wn--; )
            $t[Wn] = arguments[Wn];
          if (qe)
            var Pn = Ho(Ze), Vn = Qr($t, Pn);
          if (S && ($t = xh($t, S, P, qe)), M && ($t = Sh($t, M, z, qe)), bt -= Vn, qe && bt < de) {
            var Jt = Or($t, Pn);
            return Nh(
              r,
              i,
              yu,
              Ze.placeholder,
              c,
              $t,
              Jt,
              W,
              Q,
              de - bt
            );
          }
          var yr = ye ? c : this, ui = Oe ? yr[r] : r;
          return bt = $t.length, W ? $t = O0($t, W) : Je && bt > 1 && $t.reverse(), he && Q < bt && ($t.length = Q), this && this !== Kt && this instanceof Ze && (ui = ht || Ha(ui)), ui.apply(yr, $t);
        }
        return Ze;
      }
      function Ph(r, i) {
        return function(c, S) {
          return zy(c, r, i(S), {});
        };
      }
      function wu(r, i) {
        return function(c, S) {
          var P;
          if (c === t && S === t)
            return i;
          if (c !== t && (P = c), S !== t) {
            if (P === t)
              return S;
            typeof c == "string" || typeof S == "string" ? (c = jn(c), S = jn(S)) : (c = ph(c), S = ph(S)), P = r(c, S);
          }
          return P;
        };
      }
      function bc(r) {
        return ii(function(i) {
          return i = V(i, It(Xe())), pt(function(c) {
            var S = this;
            return r(i, function(P) {
              return o(P, S, c);
            });
          });
        });
      }
      function bu(r, i) {
        i = i === t ? " " : jn(i);
        var c = i.length;
        if (c < 2)
          return c ? hc(i, r) : i;
        var S = hc(i, Lr(r / Ai(i)));
        return Nr(i) ? Ri(ln(S), 0, r).join("") : S.slice(0, r);
      }
      function h0(r, i, c, S) {
        var P = i & E, M = Ha(r);
        function z() {
          for (var W = -1, Q = arguments.length, de = -1, he = S.length, ye = ie(he + Q), Oe = this && this !== Kt && this instanceof z ? M : r; ++de < he; )
            ye[de] = S[de];
          for (; Q--; )
            ye[de++] = arguments[++W];
          return o(Oe, P ? c : this, ye);
        }
        return z;
      }
      function kh(r) {
        return function(i, c, S) {
          return S && typeof S != "number" && Tn(i, c, S) && (c = S = t), i = si(i), c === t ? (c = i, i = 0) : c = si(c), S = S === t ? i < c ? 1 : -1 : si(S), Jy(i, c, S, r);
        };
      }
      function _u(r) {
        return function(i, c) {
          return typeof i == "string" && typeof c == "string" || (i = tr(i), c = tr(c)), r(i, c);
        };
      }
      function Nh(r, i, c, S, P, M, z, W, Q, de) {
        var he = i & F, ye = he ? z : t, Oe = he ? t : z, qe = he ? M : t, Je = he ? t : M;
        i |= he ? j : U, i &= ~(he ? U : j), i & I || (i &= ~(E | A));
        var ht = [
          r,
          i,
          P,
          qe,
          ye,
          Je,
          Oe,
          W,
          Q,
          de
        ], Ze = c.apply(t, ht);
        return Tc(r) && Hh(Ze, ht), Ze.placeholder = S, Wh(Ze, r, i);
      }
      function _c(r) {
        var i = Xt[r];
        return function(c, S) {
          if (c = tr(c), S = S == null ? 0 : bn(ft(S), 292), S && Wd(c)) {
            var P = (Lt(c) + "e").split("e"), M = i(P[0] + "e" + (+P[1] + S));
            return P = (Lt(M) + "e").split("e"), +(P[0] + "e" + (+P[1] - S));
          }
          return i(c);
        };
      }
      var p0 = Fo && 1 / Do(new Fo([, -0]))[1] == pe ? function(r) {
        return new Fo(r);
      } : Hc;
      function Oh(r) {
        return function(i) {
          var c = _n(i);
          return c == we ? Na(i) : c == Ft ? iu(i) : kr(i, r(i));
        };
      }
      function ri(r, i, c, S, P, M, z, W) {
        var Q = i & A;
        if (!Q && typeof r != "function")
          throw new cn(d);
        var de = S ? S.length : 0;
        if (de || (i &= ~(j | U), S = P = t), z = z === t ? z : nn(ft(z), 0), W = W === t ? W : ft(W), de -= P ? P.length : 0, i & U) {
          var he = S, ye = P;
          S = P = t;
        }
        var Oe = Q ? t : $c(r), qe = [
          r,
          i,
          c,
          S,
          P,
          he,
          ye,
          M,
          z,
          W
        ];
        if (Oe && P0(qe, Oe), r = qe[0], i = qe[1], c = qe[2], S = qe[3], P = qe[4], W = qe[9] = qe[9] === t ? Q ? 0 : r.length : nn(qe[9] - de, 0), !W && i & (F | k) && (i &= ~(F | k)), !i || i == E)
          var Je = f0(r, i, c);
        else i == F || i == k ? Je = d0(r, i, W) : (i == j || i == (E | j)) && !P.length ? Je = h0(r, i, c, S) : Je = yu.apply(t, qe);
        var ht = Oe ? dh : Hh;
        return Wh(ht(Je, qe), r, i);
      }
      function Lh(r, i, c, S) {
        return r === t || vr(r, Pi[c]) && !Tt.call(S, c) ? i : r;
      }
      function Rh(r, i, c, S, P, M) {
        return Vt(r) && Vt(i) && (M.set(i, r), pu(r, i, t, Rh, M), M.delete(i)), r;
      }
      function g0(r) {
        return Ua(r) ? t : r;
      }
      function Mh(r, i, c, S, P, M) {
        var z = c & s, W = r.length, Q = i.length;
        if (W != Q && !(z && Q > W))
          return !1;
        var de = M.get(r), he = M.get(i);
        if (de && he)
          return de == i && he == r;
        var ye = -1, Oe = !0, qe = c & $ ? new eo() : t;
        for (M.set(r, i), M.set(i, r); ++ye < W; ) {
          var Je = r[ye], ht = i[ye];
          if (S)
            var Ze = z ? S(ht, Je, ye, i, r, M) : S(Je, ht, ye, r, i, M);
          if (Ze !== t) {
            if (Ze)
              continue;
            Oe = !1;
            break;
          }
          if (qe) {
            if (!Pe(i, function(bt, $t) {
              if (!Yi(qe, $t) && (Je === bt || P(Je, bt, c, S, M)))
                return qe.push($t);
            })) {
              Oe = !1;
              break;
            }
          } else if (!(Je === ht || P(Je, ht, c, S, M))) {
            Oe = !1;
            break;
          }
        }
        return M.delete(r), M.delete(i), Oe;
      }
      function m0(r, i, c, S, P, M, z) {
        switch (c) {
          case un:
            if (r.byteLength != i.byteLength || r.byteOffset != i.byteOffset)
              return !1;
            r = r.buffer, i = i.buffer;
          case gn:
            return !(r.byteLength != i.byteLength || !M(new Te(r), new Te(i)));
          case be:
          case Ge:
          case $e:
            return vr(+r, +i);
          case Ke:
            return r.name == i.name && r.message == i.message;
          case Nt:
          case Mt:
            return r == i + "";
          case we:
            var W = Na;
          case Ft:
            var Q = S & s;
            if (W || (W = Do), r.size != i.size && !Q)
              return !1;
            var de = z.get(r);
            if (de)
              return de == i;
            S |= $, z.set(r, i);
            var he = Mh(W(r), W(i), S, P, M, z);
            return z.delete(r), he;
          case Et:
            if (Ia)
              return Ia.call(r) == Ia.call(i);
        }
        return !1;
      }
      function v0(r, i, c, S, P, M) {
        var z = c & s, W = xc(r), Q = W.length, de = xc(i), he = de.length;
        if (Q != he && !z)
          return !1;
        for (var ye = Q; ye--; ) {
          var Oe = W[ye];
          if (!(z ? Oe in i : Tt.call(i, Oe)))
            return !1;
        }
        var qe = M.get(r), Je = M.get(i);
        if (qe && Je)
          return qe == i && Je == r;
        var ht = !0;
        M.set(r, i), M.set(i, r);
        for (var Ze = z; ++ye < Q; ) {
          Oe = W[ye];
          var bt = r[Oe], $t = i[Oe];
          if (S)
            var Wn = z ? S($t, bt, Oe, i, r, M) : S(bt, $t, Oe, r, i, M);
          if (!(Wn === t ? bt === $t || P(bt, $t, c, S, M) : Wn)) {
            ht = !1;
            break;
          }
          Ze || (Ze = Oe == "constructor");
        }
        if (ht && !Ze) {
          var Pn = r.constructor, Vn = i.constructor;
          Pn != Vn && "constructor" in r && "constructor" in i && !(typeof Pn == "function" && Pn instanceof Pn && typeof Vn == "function" && Vn instanceof Vn) && (ht = !1);
        }
        return M.delete(r), M.delete(i), ht;
      }
      function ii(r) {
        return kc(Bh(r, t, Yh), r + "");
      }
      function xc(r) {
        return th(r, sn, Cc);
      }
      function Sc(r) {
        return th(r, Mn, Dh);
      }
      var $c = uu ? function(r) {
        return uu.get(r);
      } : Hc;
      function xu(r) {
        for (var i = r.name + "", c = qo[i], S = Tt.call(qo, i) ? c.length : 0; S--; ) {
          var P = c[S], M = P.func;
          if (M == null || M == r)
            return P.name;
        }
        return i;
      }
      function Ho(r) {
        var i = Tt.call(O, "placeholder") ? O : r;
        return i.placeholder;
      }
      function Xe() {
        var r = O.iteratee || Bc;
        return r = r === Bc ? ih : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Su(r, i) {
        var c = r.__data__;
        return E0(i) ? c[typeof i == "string" ? "string" : "hash"] : c.map;
      }
      function Ec(r) {
        for (var i = sn(r), c = i.length; c--; ) {
          var S = i[c], P = r[S];
          i[c] = [S, P, qh(P)];
        }
        return i;
      }
      function ro(r, i) {
        var c = nu(r, i);
        return rh(c) ? c : t;
      }
      function y0(r) {
        var i = Tt.call(r, qt), c = r[qt];
        try {
          r[qt] = t;
          var S = !0;
        } catch {
        }
        var P = H.call(r);
        return S && (i ? r[qt] = c : delete r[qt]), P;
      }
      var Cc = Zl ? function(r) {
        return r == null ? [] : (r = St(r), T(Zl(r), function(i) {
          return Qe.call(r, i);
        }));
      } : Wc, Dh = Zl ? function(r) {
        for (var i = []; r; )
          G(i, Cc(r)), r = tt(r);
        return i;
      } : Wc, _n = An;
      (ec && _n(new ec(new ArrayBuffer(1))) != un || Ra && _n(new Ra()) != we || tc && _n(tc.resolve()) != xt || Fo && _n(new Fo()) != Ft || Ma && _n(new Ma()) != pn) && (_n = function(r) {
        var i = An(r), c = i == vt ? r.constructor : t, S = c ? io(c) : "";
        if (S)
          switch (S) {
            case ey:
              return un;
            case ty:
              return we;
            case ny:
              return xt;
            case ry:
              return Ft;
            case iy:
              return pn;
          }
        return i;
      });
      function w0(r, i, c) {
        for (var S = -1, P = c.length; ++S < P; ) {
          var M = c[S], z = M.size;
          switch (M.type) {
            case "drop":
              r += z;
              break;
            case "dropRight":
              i -= z;
              break;
            case "take":
              i = bn(i, r + z);
              break;
            case "takeRight":
              r = nn(r, i - z);
              break;
          }
        }
        return { start: r, end: i };
      }
      function b0(r) {
        var i = r.match(ks);
        return i ? i[1].split(So) : [];
      }
      function Ih(r, i, c) {
        i = Li(i, r);
        for (var S = -1, P = i.length, M = !1; ++S < P; ) {
          var z = Dr(i[S]);
          if (!(M = r != null && c(r, z)))
            break;
          r = r[z];
        }
        return M || ++S != P ? M : (P = r == null ? 0 : r.length, !!P && ku(P) && oi(z, P) && (lt(r) || oo(r)));
      }
      function _0(r) {
        var i = r.length, c = new r.constructor(i);
        return i && typeof r[0] == "string" && Tt.call(r, "index") && (c.index = r.index, c.input = r.input), c;
      }
      function Fh(r) {
        return typeof r.constructor == "function" && !Wa(r) ? zo(tt(r)) : {};
      }
      function x0(r, i, c) {
        var S = r.constructor;
        switch (i) {
          case gn:
            return wc(r);
          case be:
          case Ge:
            return new S(+r);
          case un:
            return o0(r, c);
          case Kn:
          case Ur:
          case ji:
          case vi:
          case yi:
          case ce:
          case Le:
          case Ve:
          case yt:
            return bh(r, c);
          case we:
            return new S();
          case $e:
          case Mt:
            return new S(r);
          case Nt:
            return a0(r);
          case Ft:
            return new S();
          case Et:
            return s0(r);
        }
      }
      function S0(r, i) {
        var c = i.length;
        if (!c)
          return r;
        var S = c - 1;
        return i[S] = (c > 1 ? "& " : "") + i[S], i = i.join(c > 2 ? ", " : " "), r.replace(Ps, `{
/* [wrapped with ` + i + `] */
`);
      }
      function $0(r) {
        return lt(r) || oo(r) || !!(Pt && r && r[Pt]);
      }
      function oi(r, i) {
        var c = typeof r;
        return i = i ?? ke, !!i && (c == "number" || c != "symbol" && Ml.test(r)) && r > -1 && r % 1 == 0 && r < i;
      }
      function Tn(r, i, c) {
        if (!Vt(c))
          return !1;
        var S = typeof i;
        return (S == "number" ? Rn(c) && oi(i, c.length) : S == "string" && i in c) ? vr(c[i], r) : !1;
      }
      function Ac(r, i) {
        if (lt(r))
          return !1;
        var c = typeof r;
        return c == "number" || c == "symbol" || c == "boolean" || r == null || Hn(r) ? !0 : Gr.test(r) || !bi.test(r) || i != null && r in St(i);
      }
      function E0(r) {
        var i = typeof r;
        return i == "string" || i == "number" || i == "symbol" || i == "boolean" ? r !== "__proto__" : r === null;
      }
      function Tc(r) {
        var i = xu(r), c = O[i];
        if (typeof c != "function" || !(i in _t.prototype))
          return !1;
        if (r === c)
          return !0;
        var S = $c(c);
        return !!S && r === S[0];
      }
      function C0(r) {
        return !!D && D in r;
      }
      var A0 = Zr ? ai : Vc;
      function Wa(r) {
        var i = r && r.constructor, c = typeof i == "function" && i.prototype || Pi;
        return r === c;
      }
      function qh(r) {
        return r === r && !Vt(r);
      }
      function zh(r, i) {
        return function(c) {
          return c == null ? !1 : c[r] === i && (i !== t || r in St(c));
        };
      }
      function T0(r) {
        var i = Tu(r, function(S) {
          return c.size === g && c.clear(), S;
        }), c = i.cache;
        return i;
      }
      function P0(r, i) {
        var c = r[1], S = i[1], P = c | S, M = P < (E | A | ne), z = S == ne && c == F || S == ne && c == Se && r[7].length <= i[8] || S == (ne | Se) && i[7].length <= i[8] && c == F;
        if (!(M || z))
          return r;
        S & E && (r[2] = i[2], P |= c & E ? 0 : I);
        var W = i[3];
        if (W) {
          var Q = r[3];
          r[3] = Q ? xh(Q, W, i[4]) : W, r[4] = Q ? Or(r[3], b) : i[4];
        }
        return W = i[5], W && (Q = r[5], r[5] = Q ? Sh(Q, W, i[6]) : W, r[6] = Q ? Or(r[5], b) : i[6]), W = i[7], W && (r[7] = W), S & ne && (r[8] = r[8] == null ? i[8] : bn(r[8], i[8])), r[9] == null && (r[9] = i[9]), r[0] = i[0], r[1] = P, r;
      }
      function k0(r) {
        var i = [];
        if (r != null)
          for (var c in St(r))
            i.push(c);
        return i;
      }
      function N0(r) {
        return H.call(r);
      }
      function Bh(r, i, c) {
        return i = nn(i === t ? r.length - 1 : i, 0), function() {
          for (var S = arguments, P = -1, M = nn(S.length - i, 0), z = ie(M); ++P < M; )
            z[P] = S[i + P];
          P = -1;
          for (var W = ie(i + 1); ++P < i; )
            W[P] = S[P];
          return W[i] = c(z), o(r, this, W);
        };
      }
      function jh(r, i) {
        return i.length < 2 ? r : no(r, Zn(i, 0, -1));
      }
      function O0(r, i) {
        for (var c = r.length, S = bn(i.length, c), P = Ln(r); S--; ) {
          var M = i[S];
          r[S] = oi(M, c) ? P[M] : t;
        }
        return r;
      }
      function Pc(r, i) {
        if (!(i === "constructor" && typeof r[i] == "function") && i != "__proto__")
          return r[i];
      }
      var Hh = Vh(dh), Va = Ji || function(r, i) {
        return Kt.setTimeout(r, i);
      }, kc = Vh(t0);
      function Wh(r, i, c) {
        var S = i + "";
        return kc(r, S0(S, L0(b0(S), c)));
      }
      function Vh(r) {
        var i = 0, c = 0;
        return function() {
          var S = Qv(), P = Fe - (S - c);
          if (c = S, P > 0) {
            if (++i >= We)
              return arguments[0];
          } else
            i = 0;
          return r.apply(t, arguments);
        };
      }
      function $u(r, i) {
        var c = -1, S = r.length, P = S - 1;
        for (i = i === t ? S : i; ++c < i; ) {
          var M = dc(c, P), z = r[M];
          r[M] = r[c], r[c] = z;
        }
        return r.length = i, r;
      }
      var Uh = T0(function(r) {
        var i = [];
        return r.charCodeAt(0) === 46 && i.push(""), r.replace(Ts, function(c, S, P, M) {
          i.push(P ? M.replace(va, "$1") : S || c);
        }), i;
      });
      function Dr(r) {
        if (typeof r == "string" || Hn(r))
          return r;
        var i = r + "";
        return i == "0" && 1 / r == -pe ? "-0" : i;
      }
      function io(r) {
        if (r != null) {
          try {
            return ki.call(r);
          } catch {
          }
          try {
            return r + "";
          } catch {
          }
        }
        return "";
      }
      function L0(r, i) {
        return h(L, function(c) {
          var S = "_." + c[0];
          i & c[1] && !N(r, S) && r.push(S);
        }), r.sort();
      }
      function Gh(r) {
        if (r instanceof _t)
          return r.clone();
        var i = new Qn(r.__wrapped__, r.__chain__);
        return i.__actions__ = Ln(r.__actions__), i.__index__ = r.__index__, i.__values__ = r.__values__, i;
      }
      function R0(r, i, c) {
        (c ? Tn(r, i, c) : i === t) ? i = 1 : i = nn(ft(i), 0);
        var S = r == null ? 0 : r.length;
        if (!S || i < 1)
          return [];
        for (var P = 0, M = 0, z = ie(Lr(S / i)); P < S; )
          z[M++] = Zn(r, P, P += i);
        return z;
      }
      function M0(r) {
        for (var i = -1, c = r == null ? 0 : r.length, S = 0, P = []; ++i < c; ) {
          var M = r[i];
          M && (P[S++] = M);
        }
        return P;
      }
      function D0() {
        var r = arguments.length;
        if (!r)
          return [];
        for (var i = ie(r - 1), c = arguments[0], S = r; S--; )
          i[S - 1] = arguments[S];
        return G(lt(c) ? Ln(c) : [c], fn(i, 1));
      }
      var I0 = pt(function(r, i) {
        return Qt(r) ? qa(r, fn(i, 1, Qt, !0)) : [];
      }), F0 = pt(function(r, i) {
        var c = er(i);
        return Qt(c) && (c = t), Qt(r) ? qa(r, fn(i, 1, Qt, !0), Xe(c, 2)) : [];
      }), q0 = pt(function(r, i) {
        var c = er(i);
        return Qt(c) && (c = t), Qt(r) ? qa(r, fn(i, 1, Qt, !0), t, c) : [];
      });
      function z0(r, i, c) {
        var S = r == null ? 0 : r.length;
        return S ? (i = c || i === t ? 1 : ft(i), Zn(r, i < 0 ? 0 : i, S)) : [];
      }
      function B0(r, i, c) {
        var S = r == null ? 0 : r.length;
        return S ? (i = c || i === t ? 1 : ft(i), i = S - i, Zn(r, 0, i < 0 ? 0 : i)) : [];
      }
      function j0(r, i) {
        return r && r.length ? mu(r, Xe(i, 3), !0, !0) : [];
      }
      function H0(r, i) {
        return r && r.length ? mu(r, Xe(i, 3), !0) : [];
      }
      function W0(r, i, c, S) {
        var P = r == null ? 0 : r.length;
        return P ? (c && typeof c != "number" && Tn(r, i, c) && (c = 0, S = P), Dy(r, i, c, S)) : [];
      }
      function Kh(r, i, c) {
        var S = r == null ? 0 : r.length;
        if (!S)
          return -1;
        var P = c == null ? 0 : ft(c);
        return P < 0 && (P = nn(S + P, 0)), on(r, Xe(i, 3), P);
      }
      function Xh(r, i, c) {
        var S = r == null ? 0 : r.length;
        if (!S)
          return -1;
        var P = S - 1;
        return c !== t && (P = ft(c), P = c < 0 ? nn(S + P, 0) : bn(P, S - 1)), on(r, Xe(i, 3), P, !0);
      }
      function Yh(r) {
        var i = r == null ? 0 : r.length;
        return i ? fn(r, 1) : [];
      }
      function V0(r) {
        var i = r == null ? 0 : r.length;
        return i ? fn(r, pe) : [];
      }
      function U0(r, i) {
        var c = r == null ? 0 : r.length;
        return c ? (i = i === t ? 1 : ft(i), fn(r, i)) : [];
      }
      function G0(r) {
        for (var i = -1, c = r == null ? 0 : r.length, S = {}; ++i < c; ) {
          var P = r[i];
          S[P[0]] = P[1];
        }
        return S;
      }
      function Qh(r) {
        return r && r.length ? r[0] : t;
      }
      function K0(r, i, c) {
        var S = r == null ? 0 : r.length;
        if (!S)
          return -1;
        var P = c == null ? 0 : ft(c);
        return P < 0 && (P = nn(S + P, 0)), Wt(r, i, P);
      }
      function X0(r) {
        var i = r == null ? 0 : r.length;
        return i ? Zn(r, 0, -1) : [];
      }
      var Y0 = pt(function(r) {
        var i = V(r, vc);
        return i.length && i[0] === r[0] ? sc(i) : [];
      }), Q0 = pt(function(r) {
        var i = er(r), c = V(r, vc);
        return i === er(c) ? i = t : c.pop(), c.length && c[0] === r[0] ? sc(c, Xe(i, 2)) : [];
      }), J0 = pt(function(r) {
        var i = er(r), c = V(r, vc);
        return i = typeof i == "function" ? i : t, i && c.pop(), c.length && c[0] === r[0] ? sc(c, t, i) : [];
      });
      function Z0(r, i) {
        return r == null ? "" : Xv.call(r, i);
      }
      function er(r) {
        var i = r == null ? 0 : r.length;
        return i ? r[i - 1] : t;
      }
      function ew(r, i, c) {
        var S = r == null ? 0 : r.length;
        if (!S)
          return -1;
        var P = S;
        return c !== t && (P = ft(c), P = P < 0 ? nn(S + P, 0) : bn(P, S - 1)), i === i ? Yl(r, i, P) : on(r, De, P, !0);
      }
      function tw(r, i) {
        return r && r.length ? uh(r, ft(i)) : t;
      }
      var nw = pt(Jh);
      function Jh(r, i) {
        return r && r.length && i && i.length ? fc(r, i) : r;
      }
      function rw(r, i, c) {
        return r && r.length && i && i.length ? fc(r, i, Xe(c, 2)) : r;
      }
      function iw(r, i, c) {
        return r && r.length && i && i.length ? fc(r, i, t, c) : r;
      }
      var ow = ii(function(r, i) {
        var c = r == null ? 0 : r.length, S = rc(r, i);
        return fh(r, V(i, function(P) {
          return oi(P, c) ? +P : P;
        }).sort(_h)), S;
      });
      function aw(r, i) {
        var c = [];
        if (!(r && r.length))
          return c;
        var S = -1, P = [], M = r.length;
        for (i = Xe(i, 3); ++S < M; ) {
          var z = r[S];
          i(z, S, r) && (c.push(z), P.push(S));
        }
        return fh(r, P), c;
      }
      function Nc(r) {
        return r == null ? r : Zv.call(r);
      }
      function sw(r, i, c) {
        var S = r == null ? 0 : r.length;
        return S ? (c && typeof c != "number" && Tn(r, i, c) ? (i = 0, c = S) : (i = i == null ? 0 : ft(i), c = c === t ? S : ft(c)), Zn(r, i, c)) : [];
      }
      function uw(r, i) {
        return gu(r, i);
      }
      function lw(r, i, c) {
        return pc(r, i, Xe(c, 2));
      }
      function cw(r, i) {
        var c = r == null ? 0 : r.length;
        if (c) {
          var S = gu(r, i);
          if (S < c && vr(r[S], i))
            return S;
        }
        return -1;
      }
      function fw(r, i) {
        return gu(r, i, !0);
      }
      function dw(r, i, c) {
        return pc(r, i, Xe(c, 2), !0);
      }
      function hw(r, i) {
        var c = r == null ? 0 : r.length;
        if (c) {
          var S = gu(r, i, !0) - 1;
          if (vr(r[S], i))
            return S;
        }
        return -1;
      }
      function pw(r) {
        return r && r.length ? hh(r) : [];
      }
      function gw(r, i) {
        return r && r.length ? hh(r, Xe(i, 2)) : [];
      }
      function mw(r) {
        var i = r == null ? 0 : r.length;
        return i ? Zn(r, 1, i) : [];
      }
      function vw(r, i, c) {
        return r && r.length ? (i = c || i === t ? 1 : ft(i), Zn(r, 0, i < 0 ? 0 : i)) : [];
      }
      function yw(r, i, c) {
        var S = r == null ? 0 : r.length;
        return S ? (i = c || i === t ? 1 : ft(i), i = S - i, Zn(r, i < 0 ? 0 : i, S)) : [];
      }
      function ww(r, i) {
        return r && r.length ? mu(r, Xe(i, 3), !1, !0) : [];
      }
      function bw(r, i) {
        return r && r.length ? mu(r, Xe(i, 3)) : [];
      }
      var _w = pt(function(r) {
        return Oi(fn(r, 1, Qt, !0));
      }), xw = pt(function(r) {
        var i = er(r);
        return Qt(i) && (i = t), Oi(fn(r, 1, Qt, !0), Xe(i, 2));
      }), Sw = pt(function(r) {
        var i = er(r);
        return i = typeof i == "function" ? i : t, Oi(fn(r, 1, Qt, !0), t, i);
      });
      function $w(r) {
        return r && r.length ? Oi(r) : [];
      }
      function Ew(r, i) {
        return r && r.length ? Oi(r, Xe(i, 2)) : [];
      }
      function Cw(r, i) {
        return i = typeof i == "function" ? i : t, r && r.length ? Oi(r, t, i) : [];
      }
      function Oc(r) {
        if (!(r && r.length))
          return [];
        var i = 0;
        return r = T(r, function(c) {
          if (Qt(c))
            return i = nn(c.length, i), !0;
        }), fr(i, function(c) {
          return V(r, ut(c));
        });
      }
      function Zh(r, i) {
        if (!(r && r.length))
          return [];
        var c = Oc(r);
        return i == null ? c : V(c, function(S) {
          return o(i, t, S);
        });
      }
      var Aw = pt(function(r, i) {
        return Qt(r) ? qa(r, i) : [];
      }), Tw = pt(function(r) {
        return mc(T(r, Qt));
      }), Pw = pt(function(r) {
        var i = er(r);
        return Qt(i) && (i = t), mc(T(r, Qt), Xe(i, 2));
      }), kw = pt(function(r) {
        var i = er(r);
        return i = typeof i == "function" ? i : t, mc(T(r, Qt), t, i);
      }), Nw = pt(Oc);
      function Ow(r, i) {
        return vh(r || [], i || [], Fa);
      }
      function Lw(r, i) {
        return vh(r || [], i || [], ja);
      }
      var Rw = pt(function(r) {
        var i = r.length, c = i > 1 ? r[i - 1] : t;
        return c = typeof c == "function" ? (r.pop(), c) : t, Zh(r, c);
      });
      function ep(r) {
        var i = O(r);
        return i.__chain__ = !0, i;
      }
      function Mw(r, i) {
        return i(r), r;
      }
      function Eu(r, i) {
        return i(r);
      }
      var Dw = ii(function(r) {
        var i = r.length, c = i ? r[0] : 0, S = this.__wrapped__, P = function(M) {
          return rc(M, r);
        };
        return i > 1 || this.__actions__.length || !(S instanceof _t) || !oi(c) ? this.thru(P) : (S = S.slice(c, +c + (i ? 1 : 0)), S.__actions__.push({
          func: Eu,
          args: [P],
          thisArg: t
        }), new Qn(S, this.__chain__).thru(function(M) {
          return i && !M.length && M.push(t), M;
        }));
      });
      function Iw() {
        return ep(this);
      }
      function Fw() {
        return new Qn(this.value(), this.__chain__);
      }
      function qw() {
        this.__values__ === t && (this.__values__ = pp(this.value()));
        var r = this.__index__ >= this.__values__.length, i = r ? t : this.__values__[this.__index__++];
        return { done: r, value: i };
      }
      function zw() {
        return this;
      }
      function Bw(r) {
        for (var i, c = this; c instanceof cu; ) {
          var S = Gh(c);
          S.__index__ = 0, S.__values__ = t, i ? P.__wrapped__ = S : i = S;
          var P = S;
          c = c.__wrapped__;
        }
        return P.__wrapped__ = r, i;
      }
      function jw() {
        var r = this.__wrapped__;
        if (r instanceof _t) {
          var i = r;
          return this.__actions__.length && (i = new _t(this)), i = i.reverse(), i.__actions__.push({
            func: Eu,
            args: [Nc],
            thisArg: t
          }), new Qn(i, this.__chain__);
        }
        return this.thru(Nc);
      }
      function Hw() {
        return mh(this.__wrapped__, this.__actions__);
      }
      var Ww = vu(function(r, i, c) {
        Tt.call(r, c) ? ++r[c] : ni(r, c, 1);
      });
      function Vw(r, i, c) {
        var S = lt(r) ? C : My;
        return c && Tn(r, i, c) && (i = t), S(r, Xe(i, 3));
      }
      function Uw(r, i) {
        var c = lt(r) ? T : Zd;
        return c(r, Xe(i, 3));
      }
      var Gw = Ah(Kh), Kw = Ah(Xh);
      function Xw(r, i) {
        return fn(Cu(r, i), 1);
      }
      function Yw(r, i) {
        return fn(Cu(r, i), pe);
      }
      function Qw(r, i, c) {
        return c = c === t ? 1 : ft(c), fn(Cu(r, i), c);
      }
      function tp(r, i) {
        var c = lt(r) ? h : Ni;
        return c(r, Xe(i, 3));
      }
      function np(r, i) {
        var c = lt(r) ? y : Jd;
        return c(r, Xe(i, 3));
      }
      var Jw = vu(function(r, i, c) {
        Tt.call(r, c) ? r[c].push(i) : ni(r, c, [i]);
      });
      function Zw(r, i, c, S) {
        r = Rn(r) ? r : Vo(r), c = c && !S ? ft(c) : 0;
        var P = r.length;
        return c < 0 && (c = nn(P + c, 0)), Nu(r) ? c <= P && r.indexOf(i, c) > -1 : !!P && Wt(r, i, c) > -1;
      }
      var eb = pt(function(r, i, c) {
        var S = -1, P = typeof i == "function", M = Rn(r) ? ie(r.length) : [];
        return Ni(r, function(z) {
          M[++S] = P ? o(i, z, c) : za(z, i, c);
        }), M;
      }), tb = vu(function(r, i, c) {
        ni(r, c, i);
      });
      function Cu(r, i) {
        var c = lt(r) ? V : oh;
        return c(r, Xe(i, 3));
      }
      function nb(r, i, c, S) {
        return r == null ? [] : (lt(i) || (i = i == null ? [] : [i]), c = S ? t : c, lt(c) || (c = c == null ? [] : [c]), lh(r, i, c));
      }
      var rb = vu(function(r, i, c) {
        r[c ? 0 : 1].push(i);
      }, function() {
        return [[], []];
      });
      function ib(r, i, c) {
        var S = lt(r) ? Z : cr, P = arguments.length < 3;
        return S(r, Xe(i, 4), c, P, Ni);
      }
      function ob(r, i, c) {
        var S = lt(r) ? me : cr, P = arguments.length < 3;
        return S(r, Xe(i, 4), c, P, Jd);
      }
      function ab(r, i) {
        var c = lt(r) ? T : Zd;
        return c(r, Pu(Xe(i, 3)));
      }
      function sb(r) {
        var i = lt(r) ? Kd : Zy;
        return i(r);
      }
      function ub(r, i, c) {
        (c ? Tn(r, i, c) : i === t) ? i = 1 : i = ft(i);
        var S = lt(r) ? ky : e0;
        return S(r, i);
      }
      function lb(r) {
        var i = lt(r) ? Ny : n0;
        return i(r);
      }
      function cb(r) {
        if (r == null)
          return 0;
        if (Rn(r))
          return Nu(r) ? Ai(r) : r.length;
        var i = _n(r);
        return i == we || i == Ft ? r.size : lc(r).length;
      }
      function fb(r, i, c) {
        var S = lt(r) ? Pe : r0;
        return c && Tn(r, i, c) && (i = t), S(r, Xe(i, 3));
      }
      var db = pt(function(r, i) {
        if (r == null)
          return [];
        var c = i.length;
        return c > 1 && Tn(r, i[0], i[1]) ? i = [] : c > 2 && Tn(i[0], i[1], i[2]) && (i = [i[0]]), lh(r, fn(i, 1), []);
      }), Au = Bt || function() {
        return Kt.Date.now();
      };
      function hb(r, i) {
        if (typeof i != "function")
          throw new cn(d);
        return r = ft(r), function() {
          if (--r < 1)
            return i.apply(this, arguments);
        };
      }
      function rp(r, i, c) {
        return i = c ? t : i, i = r && i == null ? r.length : i, ri(r, ne, t, t, t, t, i);
      }
      function ip(r, i) {
        var c;
        if (typeof i != "function")
          throw new cn(d);
        return r = ft(r), function() {
          return --r > 0 && (c = i.apply(this, arguments)), r <= 1 && (i = t), c;
        };
      }
      var Lc = pt(function(r, i, c) {
        var S = E;
        if (c.length) {
          var P = Or(c, Ho(Lc));
          S |= j;
        }
        return ri(r, S, i, c, P);
      }), op = pt(function(r, i, c) {
        var S = E | A;
        if (c.length) {
          var P = Or(c, Ho(op));
          S |= j;
        }
        return ri(i, S, r, c, P);
      });
      function ap(r, i, c) {
        i = c ? t : i;
        var S = ri(r, F, t, t, t, t, t, i);
        return S.placeholder = ap.placeholder, S;
      }
      function sp(r, i, c) {
        i = c ? t : i;
        var S = ri(r, k, t, t, t, t, t, i);
        return S.placeholder = sp.placeholder, S;
      }
      function up(r, i, c) {
        var S, P, M, z, W, Q, de = 0, he = !1, ye = !1, Oe = !0;
        if (typeof r != "function")
          throw new cn(d);
        i = tr(i) || 0, Vt(c) && (he = !!c.leading, ye = "maxWait" in c, M = ye ? nn(tr(c.maxWait) || 0, i) : M, Oe = "trailing" in c ? !!c.trailing : Oe);
        function qe(Jt) {
          var yr = S, ui = P;
          return S = P = t, de = Jt, z = r.apply(ui, yr), z;
        }
        function Je(Jt) {
          return de = Jt, W = Va(bt, i), he ? qe(Jt) : z;
        }
        function ht(Jt) {
          var yr = Jt - Q, ui = Jt - de, Ap = i - yr;
          return ye ? bn(Ap, M - ui) : Ap;
        }
        function Ze(Jt) {
          var yr = Jt - Q, ui = Jt - de;
          return Q === t || yr >= i || yr < 0 || ye && ui >= M;
        }
        function bt() {
          var Jt = Au();
          if (Ze(Jt))
            return $t(Jt);
          W = Va(bt, ht(Jt));
        }
        function $t(Jt) {
          return W = t, Oe && S ? qe(Jt) : (S = P = t, z);
        }
        function Wn() {
          W !== t && yh(W), de = 0, S = Q = P = W = t;
        }
        function Pn() {
          return W === t ? z : $t(Au());
        }
        function Vn() {
          var Jt = Au(), yr = Ze(Jt);
          if (S = arguments, P = this, Q = Jt, yr) {
            if (W === t)
              return Je(Q);
            if (ye)
              return yh(W), W = Va(bt, i), qe(Q);
          }
          return W === t && (W = Va(bt, i)), z;
        }
        return Vn.cancel = Wn, Vn.flush = Pn, Vn;
      }
      var pb = pt(function(r, i) {
        return Qd(r, 1, i);
      }), gb = pt(function(r, i, c) {
        return Qd(r, tr(i) || 0, c);
      });
      function mb(r) {
        return ri(r, Ce);
      }
      function Tu(r, i) {
        if (typeof r != "function" || i != null && typeof i != "function")
          throw new cn(d);
        var c = function() {
          var S = arguments, P = i ? i.apply(this, S) : S[0], M = c.cache;
          if (M.has(P))
            return M.get(P);
          var z = r.apply(this, S);
          return c.cache = M.set(P, z) || M, z;
        };
        return c.cache = new (Tu.Cache || ti)(), c;
      }
      Tu.Cache = ti;
      function Pu(r) {
        if (typeof r != "function")
          throw new cn(d);
        return function() {
          var i = arguments;
          switch (i.length) {
            case 0:
              return !r.call(this);
            case 1:
              return !r.call(this, i[0]);
            case 2:
              return !r.call(this, i[0], i[1]);
            case 3:
              return !r.call(this, i[0], i[1], i[2]);
          }
          return !r.apply(this, i);
        };
      }
      function vb(r) {
        return ip(2, r);
      }
      var yb = i0(function(r, i) {
        i = i.length == 1 && lt(i[0]) ? V(i[0], It(Xe())) : V(fn(i, 1), It(Xe()));
        var c = i.length;
        return pt(function(S) {
          for (var P = -1, M = bn(S.length, c); ++P < M; )
            S[P] = i[P].call(this, S[P]);
          return o(r, this, S);
        });
      }), Rc = pt(function(r, i) {
        var c = Or(i, Ho(Rc));
        return ri(r, j, t, i, c);
      }), lp = pt(function(r, i) {
        var c = Or(i, Ho(lp));
        return ri(r, U, t, i, c);
      }), wb = ii(function(r, i) {
        return ri(r, Se, t, t, t, i);
      });
      function bb(r, i) {
        if (typeof r != "function")
          throw new cn(d);
        return i = i === t ? i : ft(i), pt(r, i);
      }
      function _b(r, i) {
        if (typeof r != "function")
          throw new cn(d);
        return i = i == null ? 0 : nn(ft(i), 0), pt(function(c) {
          var S = c[i], P = Ri(c, 0, i);
          return S && G(P, S), o(r, this, P);
        });
      }
      function xb(r, i, c) {
        var S = !0, P = !0;
        if (typeof r != "function")
          throw new cn(d);
        return Vt(c) && (S = "leading" in c ? !!c.leading : S, P = "trailing" in c ? !!c.trailing : P), up(r, i, {
          leading: S,
          maxWait: i,
          trailing: P
        });
      }
      function Sb(r) {
        return rp(r, 1);
      }
      function $b(r, i) {
        return Rc(yc(i), r);
      }
      function Eb() {
        if (!arguments.length)
          return [];
        var r = arguments[0];
        return lt(r) ? r : [r];
      }
      function Cb(r) {
        return Jn(r, x);
      }
      function Ab(r, i) {
        return i = typeof i == "function" ? i : t, Jn(r, x, i);
      }
      function Tb(r) {
        return Jn(r, w | x);
      }
      function Pb(r, i) {
        return i = typeof i == "function" ? i : t, Jn(r, w | x, i);
      }
      function kb(r, i) {
        return i == null || Yd(r, i, sn(i));
      }
      function vr(r, i) {
        return r === i || r !== r && i !== i;
      }
      var Nb = _u(ac), Ob = _u(function(r, i) {
        return r >= i;
      }), oo = nh(/* @__PURE__ */ function() {
        return arguments;
      }()) ? nh : function(r) {
        return Gt(r) && Tt.call(r, "callee") && !Qe.call(r, "callee");
      }, lt = ie.isArray, Lb = Ca ? It(Ca) : By;
      function Rn(r) {
        return r != null && ku(r.length) && !ai(r);
      }
      function Qt(r) {
        return Gt(r) && Rn(r);
      }
      function Rb(r) {
        return r === !0 || r === !1 || Gt(r) && An(r) == be;
      }
      var Mi = Kv || Vc, Mb = Lo ? It(Lo) : jy;
      function Db(r) {
        return Gt(r) && r.nodeType === 1 && !Ua(r);
      }
      function Ib(r) {
        if (r == null)
          return !0;
        if (Rn(r) && (lt(r) || typeof r == "string" || typeof r.splice == "function" || Mi(r) || Wo(r) || oo(r)))
          return !r.length;
        var i = _n(r);
        if (i == we || i == Ft)
          return !r.size;
        if (Wa(r))
          return !lc(r).length;
        for (var c in r)
          if (Tt.call(r, c))
            return !1;
        return !0;
      }
      function Fb(r, i) {
        return Ba(r, i);
      }
      function qb(r, i, c) {
        c = typeof c == "function" ? c : t;
        var S = c ? c(r, i) : t;
        return S === t ? Ba(r, i, t, c) : !!S;
      }
      function Mc(r) {
        if (!Gt(r))
          return !1;
        var i = An(r);
        return i == Ke || i == et || typeof r.message == "string" && typeof r.name == "string" && !Ua(r);
      }
      function zb(r) {
        return typeof r == "number" && Wd(r);
      }
      function ai(r) {
        if (!Vt(r))
          return !1;
        var i = An(r);
        return i == Ie || i == ue || i == xe || i == Ut;
      }
      function cp(r) {
        return typeof r == "number" && r == ft(r);
      }
      function ku(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= ke;
      }
      function Vt(r) {
        var i = typeof r;
        return r != null && (i == "object" || i == "function");
      }
      function Gt(r) {
        return r != null && typeof r == "object";
      }
      var fp = Aa ? It(Aa) : Wy;
      function Bb(r, i) {
        return r === i || uc(r, i, Ec(i));
      }
      function jb(r, i, c) {
        return c = typeof c == "function" ? c : t, uc(r, i, Ec(i), c);
      }
      function Hb(r) {
        return dp(r) && r != +r;
      }
      function Wb(r) {
        if (A0(r))
          throw new rt(f);
        return rh(r);
      }
      function Vb(r) {
        return r === null;
      }
      function Ub(r) {
        return r == null;
      }
      function dp(r) {
        return typeof r == "number" || Gt(r) && An(r) == $e;
      }
      function Ua(r) {
        if (!Gt(r) || An(r) != vt)
          return !1;
        var i = tt(r);
        if (i === null)
          return !0;
        var c = Tt.call(i, "constructor") && i.constructor;
        return typeof c == "function" && c instanceof c && ki.call(c) == K;
      }
      var Dc = Ta ? It(Ta) : Vy;
      function Gb(r) {
        return cp(r) && r >= -ke && r <= ke;
      }
      var hp = eu ? It(eu) : Uy;
      function Nu(r) {
        return typeof r == "string" || !lt(r) && Gt(r) && An(r) == Mt;
      }
      function Hn(r) {
        return typeof r == "symbol" || Gt(r) && An(r) == Et;
      }
      var Wo = tu ? It(tu) : Gy;
      function Kb(r) {
        return r === t;
      }
      function Xb(r) {
        return Gt(r) && _n(r) == pn;
      }
      function Yb(r) {
        return Gt(r) && An(r) == $n;
      }
      var Qb = _u(cc), Jb = _u(function(r, i) {
        return r <= i;
      });
      function pp(r) {
        if (!r)
          return [];
        if (Rn(r))
          return Nu(r) ? ln(r) : Ln(r);
        if (Ue && r[Ue])
          return Mo(r[Ue]());
        var i = _n(r), c = i == we ? Na : i == Ft ? Do : Vo;
        return c(r);
      }
      function si(r) {
        if (!r)
          return r === 0 ? r : 0;
        if (r = tr(r), r === pe || r === -pe) {
          var i = r < 0 ? -1 : 1;
          return i * Ne;
        }
        return r === r ? r : 0;
      }
      function ft(r) {
        var i = si(r), c = i % 1;
        return i === i ? c ? i - c : i : 0;
      }
      function gp(r) {
        return r ? to(ft(r), 0, R) : 0;
      }
      function tr(r) {
        if (typeof r == "number")
          return r;
        if (Hn(r))
          return ae;
        if (Vt(r)) {
          var i = typeof r.valueOf == "function" ? r.valueOf() : r;
          r = Vt(i) ? i + "" : i;
        }
        if (typeof r != "string")
          return r === 0 ? r : +r;
        r = dr(r);
        var c = Rl.test(r);
        return c || wa.test(r) ? Js(r.slice(2), c ? 2 : 8) : Tr.test(r) ? ae : +r;
      }
      function mp(r) {
        return Mr(r, Mn(r));
      }
      function Zb(r) {
        return r ? to(ft(r), -ke, ke) : r === 0 ? r : 0;
      }
      function Lt(r) {
        return r == null ? "" : jn(r);
      }
      var e_ = Bo(function(r, i) {
        if (Wa(i) || Rn(i)) {
          Mr(i, sn(i), r);
          return;
        }
        for (var c in i)
          Tt.call(i, c) && Fa(r, c, i[c]);
      }), vp = Bo(function(r, i) {
        Mr(i, Mn(i), r);
      }), Ou = Bo(function(r, i, c, S) {
        Mr(i, Mn(i), r, S);
      }), t_ = Bo(function(r, i, c, S) {
        Mr(i, sn(i), r, S);
      }), n_ = ii(rc);
      function r_(r, i) {
        var c = zo(r);
        return i == null ? c : Xd(c, i);
      }
      var i_ = pt(function(r, i) {
        r = St(r);
        var c = -1, S = i.length, P = S > 2 ? i[2] : t;
        for (P && Tn(i[0], i[1], P) && (S = 1); ++c < S; )
          for (var M = i[c], z = Mn(M), W = -1, Q = z.length; ++W < Q; ) {
            var de = z[W], he = r[de];
            (he === t || vr(he, Pi[de]) && !Tt.call(r, de)) && (r[de] = M[de]);
          }
        return r;
      }), o_ = pt(function(r) {
        return r.push(t, Rh), o(yp, t, r);
      });
      function a_(r, i) {
        return st(r, Xe(i, 3), Rr);
      }
      function s_(r, i) {
        return st(r, Xe(i, 3), oc);
      }
      function u_(r, i) {
        return r == null ? r : ic(r, Xe(i, 3), Mn);
      }
      function l_(r, i) {
        return r == null ? r : eh(r, Xe(i, 3), Mn);
      }
      function c_(r, i) {
        return r && Rr(r, Xe(i, 3));
      }
      function f_(r, i) {
        return r && oc(r, Xe(i, 3));
      }
      function d_(r) {
        return r == null ? [] : hu(r, sn(r));
      }
      function h_(r) {
        return r == null ? [] : hu(r, Mn(r));
      }
      function Ic(r, i, c) {
        var S = r == null ? t : no(r, i);
        return S === t ? c : S;
      }
      function p_(r, i) {
        return r != null && Ih(r, i, Iy);
      }
      function Fc(r, i) {
        return r != null && Ih(r, i, Fy);
      }
      var g_ = Ph(function(r, i, c) {
        i != null && typeof i.toString != "function" && (i = H.call(i)), r[i] = c;
      }, zc(Dn)), m_ = Ph(function(r, i, c) {
        i != null && typeof i.toString != "function" && (i = H.call(i)), Tt.call(r, i) ? r[i].push(c) : r[i] = [c];
      }, Xe), v_ = pt(za);
      function sn(r) {
        return Rn(r) ? Gd(r) : lc(r);
      }
      function Mn(r) {
        return Rn(r) ? Gd(r, !0) : Ky(r);
      }
      function y_(r, i) {
        var c = {};
        return i = Xe(i, 3), Rr(r, function(S, P, M) {
          ni(c, i(S, P, M), S);
        }), c;
      }
      function w_(r, i) {
        var c = {};
        return i = Xe(i, 3), Rr(r, function(S, P, M) {
          ni(c, P, i(S, P, M));
        }), c;
      }
      var b_ = Bo(function(r, i, c) {
        pu(r, i, c);
      }), yp = Bo(function(r, i, c, S) {
        pu(r, i, c, S);
      }), __ = ii(function(r, i) {
        var c = {};
        if (r == null)
          return c;
        var S = !1;
        i = V(i, function(M) {
          return M = Li(M, r), S || (S = M.length > 1), M;
        }), Mr(r, Sc(r), c), S && (c = Jn(c, w | m | x, g0));
        for (var P = i.length; P--; )
          gc(c, i[P]);
        return c;
      });
      function x_(r, i) {
        return wp(r, Pu(Xe(i)));
      }
      var S_ = ii(function(r, i) {
        return r == null ? {} : Yy(r, i);
      });
      function wp(r, i) {
        if (r == null)
          return {};
        var c = V(Sc(r), function(S) {
          return [S];
        });
        return i = Xe(i), ch(r, c, function(S, P) {
          return i(S, P[0]);
        });
      }
      function $_(r, i, c) {
        i = Li(i, r);
        var S = -1, P = i.length;
        for (P || (P = 1, r = t); ++S < P; ) {
          var M = r == null ? t : r[Dr(i[S])];
          M === t && (S = P, M = c), r = ai(M) ? M.call(r) : M;
        }
        return r;
      }
      function E_(r, i, c) {
        return r == null ? r : ja(r, i, c);
      }
      function C_(r, i, c, S) {
        return S = typeof S == "function" ? S : t, r == null ? r : ja(r, i, c, S);
      }
      var bp = Oh(sn), _p = Oh(Mn);
      function A_(r, i, c) {
        var S = lt(r), P = S || Mi(r) || Wo(r);
        if (i = Xe(i, 4), c == null) {
          var M = r && r.constructor;
          P ? c = S ? new M() : [] : Vt(r) ? c = ai(M) ? zo(tt(r)) : {} : c = {};
        }
        return (P ? h : Rr)(r, function(z, W, Q) {
          return i(c, z, W, Q);
        }), c;
      }
      function T_(r, i) {
        return r == null ? !0 : gc(r, i);
      }
      function P_(r, i, c) {
        return r == null ? r : gh(r, i, yc(c));
      }
      function k_(r, i, c, S) {
        return S = typeof S == "function" ? S : t, r == null ? r : gh(r, i, yc(c), S);
      }
      function Vo(r) {
        return r == null ? [] : wn(r, sn(r));
      }
      function N_(r) {
        return r == null ? [] : wn(r, Mn(r));
      }
      function O_(r, i, c) {
        return c === t && (c = i, i = t), c !== t && (c = tr(c), c = c === c ? c : 0), i !== t && (i = tr(i), i = i === i ? i : 0), to(tr(r), i, c);
      }
      function L_(r, i, c) {
        return i = si(i), c === t ? (c = i, i = 0) : c = si(c), r = tr(r), qy(r, i, c);
      }
      function R_(r, i, c) {
        if (c && typeof c != "boolean" && Tn(r, i, c) && (i = c = t), c === t && (typeof i == "boolean" ? (c = i, i = t) : typeof r == "boolean" && (c = r, r = t)), r === t && i === t ? (r = 0, i = 1) : (r = si(r), i === t ? (i = r, r = 0) : i = si(i)), r > i) {
          var S = r;
          r = i, i = S;
        }
        if (c || r % 1 || i % 1) {
          var P = Vd();
          return bn(r + P * (i - r + Gl("1e-" + ((P + "").length - 1))), i);
        }
        return dc(r, i);
      }
      var M_ = jo(function(r, i, c) {
        return i = i.toLowerCase(), r + (c ? xp(i) : i);
      });
      function xp(r) {
        return qc(Lt(r).toLowerCase());
      }
      function Sp(r) {
        return r = Lt(r), r && r.replace(Dl, ka).replace(Ks, "");
      }
      function D_(r, i, c) {
        r = Lt(r), i = jn(i);
        var S = r.length;
        c = c === t ? S : to(ft(c), 0, S);
        var P = c;
        return c -= i.length, c >= 0 && r.slice(c, P) == i;
      }
      function I_(r) {
        return r = Lt(r), r && Wi.test(r) ? r.replace(Hi, Ot) : r;
      }
      function F_(r) {
        return r = Lt(r), r && Kr.test(r) ? r.replace(ma, "\\$&") : r;
      }
      var q_ = jo(function(r, i, c) {
        return r + (c ? "-" : "") + i.toLowerCase();
      }), z_ = jo(function(r, i, c) {
        return r + (c ? " " : "") + i.toLowerCase();
      }), B_ = Ch("toLowerCase");
      function j_(r, i, c) {
        r = Lt(r), i = ft(i);
        var S = i ? Ai(r) : 0;
        if (!i || S >= i)
          return r;
        var P = (i - S) / 2;
        return bu(an(P), c) + r + bu(Lr(P), c);
      }
      function H_(r, i, c) {
        r = Lt(r), i = ft(i);
        var S = i ? Ai(r) : 0;
        return i && S < i ? r + bu(i - S, c) : r;
      }
      function W_(r, i, c) {
        r = Lt(r), i = ft(i);
        var S = i ? Ai(r) : 0;
        return i && S < i ? bu(i - S, c) + r : r;
      }
      function V_(r, i, c) {
        return c || i == null ? i = 0 : i && (i = +i), Jv(Lt(r).replace(xo, ""), i || 0);
      }
      function U_(r, i, c) {
        return (c ? Tn(r, i, c) : i === t) ? i = 1 : i = ft(i), hc(Lt(r), i);
      }
      function G_() {
        var r = arguments, i = Lt(r[0]);
        return r.length < 3 ? i : i.replace(r[1], r[2]);
      }
      var K_ = jo(function(r, i, c) {
        return r + (c ? "_" : "") + i.toLowerCase();
      });
      function X_(r, i, c) {
        return c && typeof c != "number" && Tn(r, i, c) && (i = c = t), c = c === t ? R : c >>> 0, c ? (r = Lt(r), r && (typeof i == "string" || i != null && !Dc(i)) && (i = jn(i), !i && Nr(r)) ? Ri(ln(r), 0, c) : r.split(i, c)) : [];
      }
      var Y_ = jo(function(r, i, c) {
        return r + (c ? " " : "") + qc(i);
      });
      function Q_(r, i, c) {
        return r = Lt(r), c = c == null ? 0 : to(ft(c), 0, r.length), i = jn(i), r.slice(c, c + i.length) == i;
      }
      function J_(r, i, c) {
        var S = O.templateSettings;
        c && Tn(r, i, c) && (i = t), r = Lt(r), i = Ou({}, i, S, Lh);
        var P = Ou({}, i.imports, S.imports, Lh), M = sn(P), z = wn(P, M), W, Q, de = 0, he = i.interpolate || Eo, ye = "__p += '", Oe = Qi(
          (i.escape || Eo).source + "|" + he.source + "|" + (he === Vi ? Os : Eo).source + "|" + (i.evaluate || Eo).source + "|$",
          "g"
        ), qe = "//# sourceURL=" + (Tt.call(i, "sourceURL") ? (i.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Qs + "]") + `
`;
        r.replace(Oe, function(Ze, bt, $t, Wn, Pn, Vn) {
          return $t || ($t = Wn), ye += r.slice(de, Vn).replace(Il, Jr), bt && (W = !0, ye += `' +
__e(` + bt + `) +
'`), Pn && (Q = !0, ye += `';
` + Pn + `;
__p += '`), $t && (ye += `' +
((__t = (` + $t + `)) == null ? '' : __t) +
'`), de = Vn + Ze.length, Ze;
        }), ye += `';
`;
        var Je = Tt.call(i, "variable") && i.variable;
        if (!Je)
          ye = `with (obj) {
` + ye + `
}
`;
        else if ($o.test(Je))
          throw new rt(v);
        ye = (Q ? ye.replace(wt, "") : ye).replace(en, "$1").replace(mn, "$1;"), ye = "function(" + (Je || "obj") + `) {
` + (Je ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (W ? ", __e = _.escape" : "") + (Q ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + ye + `return __p
}`;
        var ht = Ep(function() {
          return At(M, qe + "return " + ye).apply(t, z);
        });
        if (ht.source = ye, Mc(ht))
          throw ht;
        return ht;
      }
      function Z_(r) {
        return Lt(r).toLowerCase();
      }
      function e1(r) {
        return Lt(r).toUpperCase();
      }
      function t1(r, i, c) {
        if (r = Lt(r), r && (c || i === t))
          return dr(r);
        if (!r || !(i = jn(i)))
          return r;
        var S = ln(r), P = ln(i), M = hr(S, P), z = Pa(S, P) + 1;
        return Ri(S, M, z).join("");
      }
      function n1(r, i, c) {
        if (r = Lt(r), r && (c || i === t))
          return r.slice(0, ou(r) + 1);
        if (!r || !(i = jn(i)))
          return r;
        var S = ln(r), P = Pa(S, ln(i)) + 1;
        return Ri(S, 0, P).join("");
      }
      function r1(r, i, c) {
        if (r = Lt(r), r && (c || i === t))
          return r.replace(xo, "");
        if (!r || !(i = jn(i)))
          return r;
        var S = ln(r), P = hr(S, ln(i));
        return Ri(S, P).join("");
      }
      function i1(r, i) {
        var c = Ee, S = Ae;
        if (Vt(i)) {
          var P = "separator" in i ? i.separator : P;
          c = "length" in i ? ft(i.length) : c, S = "omission" in i ? jn(i.omission) : S;
        }
        r = Lt(r);
        var M = r.length;
        if (Nr(r)) {
          var z = ln(r);
          M = z.length;
        }
        if (c >= M)
          return r;
        var W = c - Ai(S);
        if (W < 1)
          return S;
        var Q = z ? Ri(z, 0, W).join("") : r.slice(0, W);
        if (P === t)
          return Q + S;
        if (z && (W += Q.length - W), Dc(P)) {
          if (r.slice(W).search(P)) {
            var de, he = Q;
            for (P.global || (P = Qi(P.source, Lt(Ar.exec(P)) + "g")), P.lastIndex = 0; de = P.exec(he); )
              var ye = de.index;
            Q = Q.slice(0, ye === t ? W : ye);
          }
        } else if (r.indexOf(jn(P), W) != W) {
          var Oe = Q.lastIndexOf(P);
          Oe > -1 && (Q = Q.slice(0, Oe));
        }
        return Q + S;
      }
      function o1(r) {
        return r = Lt(r), r && sr.test(r) ? r.replace(ar, Oa) : r;
      }
      var a1 = jo(function(r, i, c) {
        return r + (c ? " " : "") + i.toUpperCase();
      }), qc = Ch("toUpperCase");
      function $p(r, i, c) {
        return r = Lt(r), i = c ? t : i, i === t ? Xl(r) ? gr(r) : Ye(r) : r.match(i) || [];
      }
      var Ep = pt(function(r, i) {
        try {
          return o(r, t, i);
        } catch (c) {
          return Mc(c) ? c : new rt(c);
        }
      }), s1 = ii(function(r, i) {
        return h(i, function(c) {
          c = Dr(c), ni(r, c, Lc(r[c], r));
        }), r;
      });
      function u1(r) {
        var i = r == null ? 0 : r.length, c = Xe();
        return r = i ? V(r, function(S) {
          if (typeof S[1] != "function")
            throw new cn(d);
          return [c(S[0]), S[1]];
        }) : [], pt(function(S) {
          for (var P = -1; ++P < i; ) {
            var M = r[P];
            if (o(M[0], this, S))
              return o(M[1], this, S);
          }
        });
      }
      function l1(r) {
        return Ry(Jn(r, w));
      }
      function zc(r) {
        return function() {
          return r;
        };
      }
      function c1(r, i) {
        return r == null || r !== r ? i : r;
      }
      var f1 = Th(), d1 = Th(!0);
      function Dn(r) {
        return r;
      }
      function Bc(r) {
        return ih(typeof r == "function" ? r : Jn(r, w));
      }
      function h1(r) {
        return ah(Jn(r, w));
      }
      function p1(r, i) {
        return sh(r, Jn(i, w));
      }
      var g1 = pt(function(r, i) {
        return function(c) {
          return za(c, r, i);
        };
      }), m1 = pt(function(r, i) {
        return function(c) {
          return za(r, c, i);
        };
      });
      function jc(r, i, c) {
        var S = sn(i), P = hu(i, S);
        c == null && !(Vt(i) && (P.length || !S.length)) && (c = i, i = r, r = this, P = hu(i, sn(i)));
        var M = !(Vt(c) && "chain" in c) || !!c.chain, z = ai(r);
        return h(P, function(W) {
          var Q = i[W];
          r[W] = Q, z && (r.prototype[W] = function() {
            var de = this.__chain__;
            if (M || de) {
              var he = r(this.__wrapped__), ye = he.__actions__ = Ln(this.__actions__);
              return ye.push({ func: Q, args: arguments, thisArg: r }), he.__chain__ = de, he;
            }
            return Q.apply(r, G([this.value()], arguments));
          });
        }), r;
      }
      function v1() {
        return Kt._ === this && (Kt._ = le), this;
      }
      function Hc() {
      }
      function y1(r) {
        return r = ft(r), pt(function(i) {
          return uh(i, r);
        });
      }
      var w1 = bc(V), b1 = bc(C), _1 = bc(Pe);
      function Cp(r) {
        return Ac(r) ? ut(Dr(r)) : Qy(r);
      }
      function x1(r) {
        return function(i) {
          return r == null ? t : no(r, i);
        };
      }
      var S1 = kh(), $1 = kh(!0);
      function Wc() {
        return [];
      }
      function Vc() {
        return !1;
      }
      function E1() {
        return {};
      }
      function C1() {
        return "";
      }
      function A1() {
        return !0;
      }
      function T1(r, i) {
        if (r = ft(r), r < 1 || r > ke)
          return [];
        var c = R, S = bn(r, R);
        i = Xe(i), r -= R;
        for (var P = fr(S, i); ++c < r; )
          i(c);
        return P;
      }
      function P1(r) {
        return lt(r) ? V(r, Dr) : Hn(r) ? [r] : Ln(Uh(Lt(r)));
      }
      function k1(r) {
        var i = ++Jl;
        return Lt(r) + i;
      }
      var N1 = wu(function(r, i) {
        return r + i;
      }, 0), O1 = _c("ceil"), L1 = wu(function(r, i) {
        return r / i;
      }, 1), R1 = _c("floor");
      function M1(r) {
        return r && r.length ? du(r, Dn, ac) : t;
      }
      function D1(r, i) {
        return r && r.length ? du(r, Xe(i, 2), ac) : t;
      }
      function I1(r) {
        return tn(r, Dn);
      }
      function F1(r, i) {
        return tn(r, Xe(i, 2));
      }
      function q1(r) {
        return r && r.length ? du(r, Dn, cc) : t;
      }
      function z1(r, i) {
        return r && r.length ? du(r, Xe(i, 2), cc) : t;
      }
      var B1 = wu(function(r, i) {
        return r * i;
      }, 1), j1 = _c("round"), H1 = wu(function(r, i) {
        return r - i;
      }, 0);
      function W1(r) {
        return r && r.length ? yn(r, Dn) : 0;
      }
      function V1(r, i) {
        return r && r.length ? yn(r, Xe(i, 2)) : 0;
      }
      return O.after = hb, O.ary = rp, O.assign = e_, O.assignIn = vp, O.assignInWith = Ou, O.assignWith = t_, O.at = n_, O.before = ip, O.bind = Lc, O.bindAll = s1, O.bindKey = op, O.castArray = Eb, O.chain = ep, O.chunk = R0, O.compact = M0, O.concat = D0, O.cond = u1, O.conforms = l1, O.constant = zc, O.countBy = Ww, O.create = r_, O.curry = ap, O.curryRight = sp, O.debounce = up, O.defaults = i_, O.defaultsDeep = o_, O.defer = pb, O.delay = gb, O.difference = I0, O.differenceBy = F0, O.differenceWith = q0, O.drop = z0, O.dropRight = B0, O.dropRightWhile = j0, O.dropWhile = H0, O.fill = W0, O.filter = Uw, O.flatMap = Xw, O.flatMapDeep = Yw, O.flatMapDepth = Qw, O.flatten = Yh, O.flattenDeep = V0, O.flattenDepth = U0, O.flip = mb, O.flow = f1, O.flowRight = d1, O.fromPairs = G0, O.functions = d_, O.functionsIn = h_, O.groupBy = Jw, O.initial = X0, O.intersection = Y0, O.intersectionBy = Q0, O.intersectionWith = J0, O.invert = g_, O.invertBy = m_, O.invokeMap = eb, O.iteratee = Bc, O.keyBy = tb, O.keys = sn, O.keysIn = Mn, O.map = Cu, O.mapKeys = y_, O.mapValues = w_, O.matches = h1, O.matchesProperty = p1, O.memoize = Tu, O.merge = b_, O.mergeWith = yp, O.method = g1, O.methodOf = m1, O.mixin = jc, O.negate = Pu, O.nthArg = y1, O.omit = __, O.omitBy = x_, O.once = vb, O.orderBy = nb, O.over = w1, O.overArgs = yb, O.overEvery = b1, O.overSome = _1, O.partial = Rc, O.partialRight = lp, O.partition = rb, O.pick = S_, O.pickBy = wp, O.property = Cp, O.propertyOf = x1, O.pull = nw, O.pullAll = Jh, O.pullAllBy = rw, O.pullAllWith = iw, O.pullAt = ow, O.range = S1, O.rangeRight = $1, O.rearg = wb, O.reject = ab, O.remove = aw, O.rest = bb, O.reverse = Nc, O.sampleSize = ub, O.set = E_, O.setWith = C_, O.shuffle = lb, O.slice = sw, O.sortBy = db, O.sortedUniq = pw, O.sortedUniqBy = gw, O.split = X_, O.spread = _b, O.tail = mw, O.take = vw, O.takeRight = yw, O.takeRightWhile = ww, O.takeWhile = bw, O.tap = Mw, O.throttle = xb, O.thru = Eu, O.toArray = pp, O.toPairs = bp, O.toPairsIn = _p, O.toPath = P1, O.toPlainObject = mp, O.transform = A_, O.unary = Sb, O.union = _w, O.unionBy = xw, O.unionWith = Sw, O.uniq = $w, O.uniqBy = Ew, O.uniqWith = Cw, O.unset = T_, O.unzip = Oc, O.unzipWith = Zh, O.update = P_, O.updateWith = k_, O.values = Vo, O.valuesIn = N_, O.without = Aw, O.words = $p, O.wrap = $b, O.xor = Tw, O.xorBy = Pw, O.xorWith = kw, O.zip = Nw, O.zipObject = Ow, O.zipObjectDeep = Lw, O.zipWith = Rw, O.entries = bp, O.entriesIn = _p, O.extend = vp, O.extendWith = Ou, jc(O, O), O.add = N1, O.attempt = Ep, O.camelCase = M_, O.capitalize = xp, O.ceil = O1, O.clamp = O_, O.clone = Cb, O.cloneDeep = Tb, O.cloneDeepWith = Pb, O.cloneWith = Ab, O.conformsTo = kb, O.deburr = Sp, O.defaultTo = c1, O.divide = L1, O.endsWith = D_, O.eq = vr, O.escape = I_, O.escapeRegExp = F_, O.every = Vw, O.find = Gw, O.findIndex = Kh, O.findKey = a_, O.findLast = Kw, O.findLastIndex = Xh, O.findLastKey = s_, O.floor = R1, O.forEach = tp, O.forEachRight = np, O.forIn = u_, O.forInRight = l_, O.forOwn = c_, O.forOwnRight = f_, O.get = Ic, O.gt = Nb, O.gte = Ob, O.has = p_, O.hasIn = Fc, O.head = Qh, O.identity = Dn, O.includes = Zw, O.indexOf = K0, O.inRange = L_, O.invoke = v_, O.isArguments = oo, O.isArray = lt, O.isArrayBuffer = Lb, O.isArrayLike = Rn, O.isArrayLikeObject = Qt, O.isBoolean = Rb, O.isBuffer = Mi, O.isDate = Mb, O.isElement = Db, O.isEmpty = Ib, O.isEqual = Fb, O.isEqualWith = qb, O.isError = Mc, O.isFinite = zb, O.isFunction = ai, O.isInteger = cp, O.isLength = ku, O.isMap = fp, O.isMatch = Bb, O.isMatchWith = jb, O.isNaN = Hb, O.isNative = Wb, O.isNil = Ub, O.isNull = Vb, O.isNumber = dp, O.isObject = Vt, O.isObjectLike = Gt, O.isPlainObject = Ua, O.isRegExp = Dc, O.isSafeInteger = Gb, O.isSet = hp, O.isString = Nu, O.isSymbol = Hn, O.isTypedArray = Wo, O.isUndefined = Kb, O.isWeakMap = Xb, O.isWeakSet = Yb, O.join = Z0, O.kebabCase = q_, O.last = er, O.lastIndexOf = ew, O.lowerCase = z_, O.lowerFirst = B_, O.lt = Qb, O.lte = Jb, O.max = M1, O.maxBy = D1, O.mean = I1, O.meanBy = F1, O.min = q1, O.minBy = z1, O.stubArray = Wc, O.stubFalse = Vc, O.stubObject = E1, O.stubString = C1, O.stubTrue = A1, O.multiply = B1, O.nth = tw, O.noConflict = v1, O.noop = Hc, O.now = Au, O.pad = j_, O.padEnd = H_, O.padStart = W_, O.parseInt = V_, O.random = R_, O.reduce = ib, O.reduceRight = ob, O.repeat = U_, O.replace = G_, O.result = $_, O.round = j1, O.runInContext = X, O.sample = sb, O.size = cb, O.snakeCase = K_, O.some = fb, O.sortedIndex = uw, O.sortedIndexBy = lw, O.sortedIndexOf = cw, O.sortedLastIndex = fw, O.sortedLastIndexBy = dw, O.sortedLastIndexOf = hw, O.startCase = Y_, O.startsWith = Q_, O.subtract = H1, O.sum = W1, O.sumBy = V1, O.template = J_, O.times = T1, O.toFinite = si, O.toInteger = ft, O.toLength = gp, O.toLower = Z_, O.toNumber = tr, O.toSafeInteger = Zb, O.toString = Lt, O.toUpper = e1, O.trim = t1, O.trimEnd = n1, O.trimStart = r1, O.truncate = i1, O.unescape = o1, O.uniqueId = k1, O.upperCase = a1, O.upperFirst = qc, O.each = tp, O.eachRight = np, O.first = Qh, jc(O, function() {
        var r = {};
        return Rr(O, function(i, c) {
          Tt.call(O.prototype, c) || (r[c] = i);
        }), r;
      }(), { chain: !1 }), O.VERSION = a, h(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        O[r].placeholder = O;
      }), h(["drop", "take"], function(r, i) {
        _t.prototype[r] = function(c) {
          c = c === t ? 1 : nn(ft(c), 0);
          var S = this.__filtered__ && !i ? new _t(this) : this.clone();
          return S.__filtered__ ? S.__takeCount__ = bn(c, S.__takeCount__) : S.__views__.push({
            size: bn(c, R),
            type: r + (S.__dir__ < 0 ? "Right" : "")
          }), S;
        }, _t.prototype[r + "Right"] = function(c) {
          return this.reverse()[r](c).reverse();
        };
      }), h(["filter", "map", "takeWhile"], function(r, i) {
        var c = i + 1, S = c == J || c == oe;
        _t.prototype[r] = function(P) {
          var M = this.clone();
          return M.__iteratees__.push({
            iteratee: Xe(P, 3),
            type: c
          }), M.__filtered__ = M.__filtered__ || S, M;
        };
      }), h(["head", "last"], function(r, i) {
        var c = "take" + (i ? "Right" : "");
        _t.prototype[r] = function() {
          return this[c](1).value()[0];
        };
      }), h(["initial", "tail"], function(r, i) {
        var c = "drop" + (i ? "" : "Right");
        _t.prototype[r] = function() {
          return this.__filtered__ ? new _t(this) : this[c](1);
        };
      }), _t.prototype.compact = function() {
        return this.filter(Dn);
      }, _t.prototype.find = function(r) {
        return this.filter(r).head();
      }, _t.prototype.findLast = function(r) {
        return this.reverse().find(r);
      }, _t.prototype.invokeMap = pt(function(r, i) {
        return typeof r == "function" ? new _t(this) : this.map(function(c) {
          return za(c, r, i);
        });
      }), _t.prototype.reject = function(r) {
        return this.filter(Pu(Xe(r)));
      }, _t.prototype.slice = function(r, i) {
        r = ft(r);
        var c = this;
        return c.__filtered__ && (r > 0 || i < 0) ? new _t(c) : (r < 0 ? c = c.takeRight(-r) : r && (c = c.drop(r)), i !== t && (i = ft(i), c = i < 0 ? c.dropRight(-i) : c.take(i - r)), c);
      }, _t.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, _t.prototype.toArray = function() {
        return this.take(R);
      }, Rr(_t.prototype, function(r, i) {
        var c = /^(?:filter|find|map|reject)|While$/.test(i), S = /^(?:head|last)$/.test(i), P = O[S ? "take" + (i == "last" ? "Right" : "") : i], M = S || /^find/.test(i);
        P && (O.prototype[i] = function() {
          var z = this.__wrapped__, W = S ? [1] : arguments, Q = z instanceof _t, de = W[0], he = Q || lt(z), ye = function(bt) {
            var $t = P.apply(O, G([bt], W));
            return S && Oe ? $t[0] : $t;
          };
          he && c && typeof de == "function" && de.length != 1 && (Q = he = !1);
          var Oe = this.__chain__, qe = !!this.__actions__.length, Je = M && !Oe, ht = Q && !qe;
          if (!M && he) {
            z = ht ? z : new _t(this);
            var Ze = r.apply(z, W);
            return Ze.__actions__.push({ func: Eu, args: [ye], thisArg: t }), new Qn(Ze, Oe);
          }
          return Je && ht ? r.apply(this, W) : (Ze = this.thru(ye), Je ? S ? Ze.value()[0] : Ze.value() : Ze);
        });
      }), h(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var i = Ti[r], c = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", S = /^(?:pop|shift)$/.test(r);
        O.prototype[r] = function() {
          var P = arguments;
          if (S && !this.__chain__) {
            var M = this.value();
            return i.apply(lt(M) ? M : [], P);
          }
          return this[c](function(z) {
            return i.apply(lt(z) ? z : [], P);
          });
        };
      }), Rr(_t.prototype, function(r, i) {
        var c = O[i];
        if (c) {
          var S = c.name + "";
          Tt.call(qo, S) || (qo[S] = []), qo[S].push({ name: i, func: c });
        }
      }), qo[yu(t, A).name] = [{
        name: "wrapper",
        func: t
      }], _t.prototype.clone = oy, _t.prototype.reverse = ay, _t.prototype.value = sy, O.prototype.at = Dw, O.prototype.chain = Iw, O.prototype.commit = Fw, O.prototype.next = qw, O.prototype.plant = Bw, O.prototype.reverse = jw, O.prototype.toJSON = O.prototype.valueOf = O.prototype.value = Hw, O.prototype.first = O.prototype.head, Ue && (O.prototype[Ue] = zw), O;
    }, Ct = au();
    Yn ? ((Yn.exports = Ct)._ = Ct, Ea._ = Ct) : Kt._ = Ct;
  }).call(uo);
})(cl, cl.exports);
var nA = cl.exports;
const kt = /* @__PURE__ */ ws(nA), rA = function(e) {
  var n = {
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
  }, t = kt.merge({}, n, e), a = function(u, f) {
    var d = kt.cloneDeep(u);
    if (u.show) {
      var v = u.size * t.scale;
      f.showThreshold && (d.show = v >= f.showThreshold), f.maxSize && v > f.maxSize && (d.size = f.maxSize / t.scale);
    }
    return d;
  };
  return {
    decorateGenome: function(u) {
      var f = u, d = {
        width: t.width * (1 - t.margin.left - t.margin.right),
        height: t.height * (1 - t.margin.top - t.margin.bottom)
      }, v = Math.min(t.numberPerRow, f.chromosomes.length), p = Math.ceil(f.chromosomes.length / v), g = {
        width: d.width / v,
        height: d.height / p
      }, b = {
        top: g.height * t.cellMargin.top,
        bottom: g.height * t.cellMargin.bottom,
        left: g.width * t.cellMargin.left,
        right: g.width * t.cellMargin.right
      }, w = t.labelHeight * g.height, m = t.labelHeight * g.height, x = g.height - w - m - b.top - b.bottom, s = Math.min(
        65 / t.scale,
        x * t.chromosomeAspectRatio
      ), $ = g.width - s - b.left - b.right, E = $ / 2, A = Math.max.apply(
        null,
        f.chromosomes.map(function(k) {
          return k.length;
        })
      ), I = {
        label: kt.pick(t.annotations.label, ["size", "show"]),
        marker: kt.pick(t.annotations.marker, ["size", "show"])
      };
      I.label = a(
        I.label,
        t.annotations.label
      ), I.marker = a(
        I.marker,
        t.annotations.marker
      );
      var F = {
        chromosomePosition: {
          height: x,
          width: s,
          x: b.left + E,
          y: b.top + w
        },
        labelPosition: {
          height: w,
          width: g.width - b.left - b.right,
          chromosomeWidth: s,
          x: b.left,
          y: b.top
        },
        sizeLabelPosition: {
          cellHeight: x,
          height: m,
          width: g.width - b.left - b.right,
          x: b.left,
          y: b.top + w
        },
        qtlAnnotationPosition: {
          height: x,
          width: E,
          chromosomeWidth: s,
          x: b.left,
          y: b.top + w
        },
        geneAnnotationPosition: {
          height: x,
          width: E,
          x: b.left + E + s,
          y: b.top + w
        },
        longestChromosome: A,
        annotations: I,
        scale: t.scale
      };
      return f.chromosomes.length == 1 && (F.chromosomePosition.x = b.left + 0.5 * E, F.geneAnnotationPosition.x = b.left + 0.5 * E + s, F.qtlAnnotationPosition.width = E * 0.5, F.geneAnnotationPosition.width = E * 1.5, F.labelPosition.x = b.left + 0.5 * E, F.labelPosition.width = s, F.sizeLabelPosition.x = b.left + 0.5 * E, F.sizeLabelPosition.width = s), f.drawing = kt.pick(t, ["width", "height"]), f.drawing.margin = {
        top: t.margin.top * f.drawing.height,
        left: t.margin.left * f.drawing.width,
        bottom: t.margin.bottom * f.drawing.height,
        right: t.margin.right * f.drawing.width
      }, f.chromosomes.forEach(function(k, j) {
        var U = j % t.numberPerRow, ne = Math.floor(j / t.numberPerRow);
        k.cell = {
          y: ne * g.height + t.margin.top * t.height,
          x: U * g.width + t.margin.left * t.width,
          width: g.width,
          height: g.height
        };
      }), f.cellLayout = F, f;
    },
    width: function(u) {
      return arguments.length ? (t.width = u, this) : t.width;
    },
    height: function(u) {
      return arguments.length ? (t.height = u, this) : t.height;
    },
    numberPerRow: function(u) {
      return arguments.length ? (t.numberPerRow = u, this) : t.numberPerRow;
    },
    margin: function(u) {
      return arguments.length ? (t.margin = kt.merge(t.margin, u), this) : t.margin;
    },
    labelHeight: function(u) {
      return arguments.length ? (t.labelHeight = u, this) : t.labelHeight;
    },
    cellMargin: function(u) {
      return arguments.length ? (t.cellMargin = u, this) : t.cellMargin;
    },
    chromosomeAspectRatio: function(u) {
      return arguments.length ? (t.chromosomeAspectRatio = u, this) : t.chromosomeAspectRatio;
    },
    scale: function(u) {
      return arguments.length ? (t.scale = u, this) : t.scale;
    }
  };
};
function Zu(e, n) {
  return e == null || n == null ? NaN : e < n ? -1 : e > n ? 1 : e >= n ? 0 : NaN;
}
function iA(e, n) {
  return e == null || n == null ? NaN : n < e ? -1 : n > e ? 1 : n >= e ? 0 : NaN;
}
function Um(e) {
  let n, t, a;
  e.length !== 2 ? (n = Zu, t = (v, p) => Zu(e(v), p), a = (v, p) => e(v) - p) : (n = e === Zu || e === iA ? e : oA, t = e, a = e);
  function u(v, p, g = 0, b = v.length) {
    if (g < b) {
      if (n(p, p) !== 0) return b;
      do {
        const w = g + b >>> 1;
        t(v[w], p) < 0 ? g = w + 1 : b = w;
      } while (g < b);
    }
    return g;
  }
  function f(v, p, g = 0, b = v.length) {
    if (g < b) {
      if (n(p, p) !== 0) return b;
      do {
        const w = g + b >>> 1;
        t(v[w], p) <= 0 ? g = w + 1 : b = w;
      } while (g < b);
    }
    return g;
  }
  function d(v, p, g = 0, b = v.length) {
    const w = u(v, p, g, b - 1);
    return w > g && a(v[w - 1], p) > -a(v[w], p) ? w - 1 : w;
  }
  return { left: u, center: d, right: f };
}
function oA() {
  return 0;
}
function aA(e) {
  return e === null ? NaN : +e;
}
const sA = Um(Zu), uA = sA.right;
Um(aA).center;
const lA = Math.sqrt(50), cA = Math.sqrt(10), fA = Math.sqrt(2);
function fl(e, n, t) {
  const a = (n - e) / Math.max(0, t), u = Math.floor(Math.log10(a)), f = a / Math.pow(10, u), d = f >= lA ? 10 : f >= cA ? 5 : f >= fA ? 2 : 1;
  let v, p, g;
  return u < 0 ? (g = Math.pow(10, -u) / d, v = Math.round(e * g), p = Math.round(n * g), v / g < e && ++v, p / g > n && --p, g = -g) : (g = Math.pow(10, u) * d, v = Math.round(e / g), p = Math.round(n / g), v * g < e && ++v, p * g > n && --p), p < v && 0.5 <= t && t < 2 ? fl(e, n, t * 2) : [v, p, g];
}
function dA(e, n, t) {
  if (n = +n, e = +e, t = +t, !(t > 0)) return [];
  if (e === n) return [e];
  const a = n < e, [u, f, d] = a ? fl(n, e, t) : fl(e, n, t);
  if (!(f >= u)) return [];
  const v = f - u + 1, p = new Array(v);
  if (a)
    if (d < 0) for (let g = 0; g < v; ++g) p[g] = (f - g) / -d;
    else for (let g = 0; g < v; ++g) p[g] = (f - g) * d;
  else if (d < 0) for (let g = 0; g < v; ++g) p[g] = (u + g) / -d;
  else for (let g = 0; g < v; ++g) p[g] = (u + g) * d;
  return p;
}
function mf(e, n, t) {
  return n = +n, e = +e, t = +t, fl(e, n, t)[2];
}
function hA(e, n, t) {
  n = +n, e = +e, t = +t;
  const a = n < e, u = a ? mf(n, e, t) : mf(e, n, t);
  return (a ? -1 : 1) * (u < 0 ? 1 / -u : u);
}
var pA = { value: function() {
} };
function Pl() {
  for (var e = 0, n = arguments.length, t = {}, a; e < n; ++e) {
    if (!(a = arguments[e] + "") || a in t || /[\s.]/.test(a)) throw new Error("illegal type: " + a);
    t[a] = [];
  }
  return new el(t);
}
function el(e) {
  this._ = e;
}
function gA(e, n) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var a = "", u = t.indexOf(".");
    if (u >= 0 && (a = t.slice(u + 1), t = t.slice(0, u)), t && !n.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: a };
  });
}
el.prototype = Pl.prototype = {
  constructor: el,
  on: function(e, n) {
    var t = this._, a = gA(e + "", t), u, f = -1, d = a.length;
    if (arguments.length < 2) {
      for (; ++f < d; ) if ((u = (e = a[f]).type) && (u = mA(t[u], e.name))) return u;
      return;
    }
    if (n != null && typeof n != "function") throw new Error("invalid callback: " + n);
    for (; ++f < d; )
      if (u = (e = a[f]).type) t[u] = tg(t[u], e.name, n);
      else if (n == null) for (u in t) t[u] = tg(t[u], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, n = this._;
    for (var t in n) e[t] = n[t].slice();
    return new el(e);
  },
  call: function(e, n) {
    if ((u = arguments.length - 2) > 0) for (var t = new Array(u), a = 0, u, f; a < u; ++a) t[a] = arguments[a + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (f = this._[e], a = 0, u = f.length; a < u; ++a) f[a].value.apply(n, t);
  },
  apply: function(e, n, t) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var a = this._[e], u = 0, f = a.length; u < f; ++u) a[u].value.apply(n, t);
  }
};
function mA(e, n) {
  for (var t = 0, a = e.length, u; t < a; ++t)
    if ((u = e[t]).name === n)
      return u.value;
}
function tg(e, n, t) {
  for (var a = 0, u = e.length; a < u; ++a)
    if (e[a].name === n) {
      e[a] = pA, e = e.slice(0, a).concat(e.slice(a + 1));
      break;
    }
  return t != null && e.push({ name: n, value: t }), e;
}
var vf = "http://www.w3.org/1999/xhtml";
const ng = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: vf,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function kl(e) {
  var n = e += "", t = n.indexOf(":");
  return t >= 0 && (n = e.slice(0, t)) !== "xmlns" && (e = e.slice(t + 1)), ng.hasOwnProperty(n) ? { space: ng[n], local: e } : e;
}
function vA(e) {
  return function() {
    var n = this.ownerDocument, t = this.namespaceURI;
    return t === vf && n.documentElement.namespaceURI === vf ? n.createElement(e) : n.createElementNS(t, e);
  };
}
function yA(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Gm(e) {
  var n = kl(e);
  return (n.local ? yA : vA)(n);
}
function wA() {
}
function Ed(e) {
  return e == null ? wA : function() {
    return this.querySelector(e);
  };
}
function bA(e) {
  typeof e != "function" && (e = Ed(e));
  for (var n = this._groups, t = n.length, a = new Array(t), u = 0; u < t; ++u)
    for (var f = n[u], d = f.length, v = a[u] = new Array(d), p, g, b = 0; b < d; ++b)
      (p = f[b]) && (g = e.call(p, p.__data__, b, f)) && ("__data__" in p && (g.__data__ = p.__data__), v[b] = g);
  return new Nn(a, this._parents);
}
function Km(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function _A() {
  return [];
}
function Xm(e) {
  return e == null ? _A : function() {
    return this.querySelectorAll(e);
  };
}
function xA(e) {
  return function() {
    return Km(e.apply(this, arguments));
  };
}
function SA(e) {
  typeof e == "function" ? e = xA(e) : e = Xm(e);
  for (var n = this._groups, t = n.length, a = [], u = [], f = 0; f < t; ++f)
    for (var d = n[f], v = d.length, p, g = 0; g < v; ++g)
      (p = d[g]) && (a.push(e.call(p, p.__data__, g, d)), u.push(p));
  return new Nn(a, u);
}
function Ym(e) {
  return function() {
    return this.matches(e);
  };
}
function Qm(e) {
  return function(n) {
    return n.matches(e);
  };
}
var $A = Array.prototype.find;
function EA(e) {
  return function() {
    return $A.call(this.children, e);
  };
}
function CA() {
  return this.firstElementChild;
}
function AA(e) {
  return this.select(e == null ? CA : EA(typeof e == "function" ? e : Qm(e)));
}
var TA = Array.prototype.filter;
function PA() {
  return Array.from(this.children);
}
function kA(e) {
  return function() {
    return TA.call(this.children, e);
  };
}
function NA(e) {
  return this.selectAll(e == null ? PA : kA(typeof e == "function" ? e : Qm(e)));
}
function OA(e) {
  typeof e != "function" && (e = Ym(e));
  for (var n = this._groups, t = n.length, a = new Array(t), u = 0; u < t; ++u)
    for (var f = n[u], d = f.length, v = a[u] = [], p, g = 0; g < d; ++g)
      (p = f[g]) && e.call(p, p.__data__, g, f) && v.push(p);
  return new Nn(a, this._parents);
}
function Jm(e) {
  return new Array(e.length);
}
function LA() {
  return new Nn(this._enter || this._groups.map(Jm), this._parents);
}
function dl(e, n) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = n;
}
dl.prototype = {
  constructor: dl,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, n) {
    return this._parent.insertBefore(e, n);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function RA(e) {
  return function() {
    return e;
  };
}
function MA(e, n, t, a, u, f) {
  for (var d = 0, v, p = n.length, g = f.length; d < g; ++d)
    (v = n[d]) ? (v.__data__ = f[d], a[d] = v) : t[d] = new dl(e, f[d]);
  for (; d < p; ++d)
    (v = n[d]) && (u[d] = v);
}
function DA(e, n, t, a, u, f, d) {
  var v, p, g = /* @__PURE__ */ new Map(), b = n.length, w = f.length, m = new Array(b), x;
  for (v = 0; v < b; ++v)
    (p = n[v]) && (m[v] = x = d.call(p, p.__data__, v, n) + "", g.has(x) ? u[v] = p : g.set(x, p));
  for (v = 0; v < w; ++v)
    x = d.call(e, f[v], v, f) + "", (p = g.get(x)) ? (a[v] = p, p.__data__ = f[v], g.delete(x)) : t[v] = new dl(e, f[v]);
  for (v = 0; v < b; ++v)
    (p = n[v]) && g.get(m[v]) === p && (u[v] = p);
}
function IA(e) {
  return e.__data__;
}
function FA(e, n) {
  if (!arguments.length) return Array.from(this, IA);
  var t = n ? DA : MA, a = this._parents, u = this._groups;
  typeof e != "function" && (e = RA(e));
  for (var f = u.length, d = new Array(f), v = new Array(f), p = new Array(f), g = 0; g < f; ++g) {
    var b = a[g], w = u[g], m = w.length, x = qA(e.call(b, b && b.__data__, g, a)), s = x.length, $ = v[g] = new Array(s), E = d[g] = new Array(s), A = p[g] = new Array(m);
    t(b, w, $, E, A, x, n);
    for (var I = 0, F = 0, k, j; I < s; ++I)
      if (k = $[I]) {
        for (I >= F && (F = I + 1); !(j = E[F]) && ++F < s; ) ;
        k._next = j || null;
      }
  }
  return d = new Nn(d, a), d._enter = v, d._exit = p, d;
}
function qA(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function zA() {
  return new Nn(this._exit || this._groups.map(Jm), this._parents);
}
function BA(e, n, t) {
  var a = this.enter(), u = this, f = this.exit();
  return typeof e == "function" ? (a = e(a), a && (a = a.selection())) : a = a.append(e + ""), n != null && (u = n(u), u && (u = u.selection())), t == null ? f.remove() : t(f), a && u ? a.merge(u).order() : u;
}
function jA(e) {
  for (var n = e.selection ? e.selection() : e, t = this._groups, a = n._groups, u = t.length, f = a.length, d = Math.min(u, f), v = new Array(u), p = 0; p < d; ++p)
    for (var g = t[p], b = a[p], w = g.length, m = v[p] = new Array(w), x, s = 0; s < w; ++s)
      (x = g[s] || b[s]) && (m[s] = x);
  for (; p < u; ++p)
    v[p] = t[p];
  return new Nn(v, this._parents);
}
function HA() {
  for (var e = this._groups, n = -1, t = e.length; ++n < t; )
    for (var a = e[n], u = a.length - 1, f = a[u], d; --u >= 0; )
      (d = a[u]) && (f && d.compareDocumentPosition(f) ^ 4 && f.parentNode.insertBefore(d, f), f = d);
  return this;
}
function WA(e) {
  e || (e = VA);
  function n(w, m) {
    return w && m ? e(w.__data__, m.__data__) : !w - !m;
  }
  for (var t = this._groups, a = t.length, u = new Array(a), f = 0; f < a; ++f) {
    for (var d = t[f], v = d.length, p = u[f] = new Array(v), g, b = 0; b < v; ++b)
      (g = d[b]) && (p[b] = g);
    p.sort(n);
  }
  return new Nn(u, this._parents).order();
}
function VA(e, n) {
  return e < n ? -1 : e > n ? 1 : e >= n ? 0 : NaN;
}
function UA() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function GA() {
  return Array.from(this);
}
function KA() {
  for (var e = this._groups, n = 0, t = e.length; n < t; ++n)
    for (var a = e[n], u = 0, f = a.length; u < f; ++u) {
      var d = a[u];
      if (d) return d;
    }
  return null;
}
function XA() {
  let e = 0;
  for (const n of this) ++e;
  return e;
}
function YA() {
  return !this.node();
}
function QA(e) {
  for (var n = this._groups, t = 0, a = n.length; t < a; ++t)
    for (var u = n[t], f = 0, d = u.length, v; f < d; ++f)
      (v = u[f]) && e.call(v, v.__data__, f, u);
  return this;
}
function JA(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function ZA(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function eT(e, n) {
  return function() {
    this.setAttribute(e, n);
  };
}
function tT(e, n) {
  return function() {
    this.setAttributeNS(e.space, e.local, n);
  };
}
function nT(e, n) {
  return function() {
    var t = n.apply(this, arguments);
    t == null ? this.removeAttribute(e) : this.setAttribute(e, t);
  };
}
function rT(e, n) {
  return function() {
    var t = n.apply(this, arguments);
    t == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, t);
  };
}
function iT(e, n) {
  var t = kl(e);
  if (arguments.length < 2) {
    var a = this.node();
    return t.local ? a.getAttributeNS(t.space, t.local) : a.getAttribute(t);
  }
  return this.each((n == null ? t.local ? ZA : JA : typeof n == "function" ? t.local ? rT : nT : t.local ? tT : eT)(t, n));
}
function Zm(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function oT(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function aT(e, n, t) {
  return function() {
    this.style.setProperty(e, n, t);
  };
}
function sT(e, n, t) {
  return function() {
    var a = n.apply(this, arguments);
    a == null ? this.style.removeProperty(e) : this.style.setProperty(e, a, t);
  };
}
function uT(e, n, t) {
  return arguments.length > 1 ? this.each((n == null ? oT : typeof n == "function" ? sT : aT)(e, n, t ?? "")) : aa(this.node(), e);
}
function aa(e, n) {
  return e.style.getPropertyValue(n) || Zm(e).getComputedStyle(e, null).getPropertyValue(n);
}
function lT(e) {
  return function() {
    delete this[e];
  };
}
function cT(e, n) {
  return function() {
    this[e] = n;
  };
}
function fT(e, n) {
  return function() {
    var t = n.apply(this, arguments);
    t == null ? delete this[e] : this[e] = t;
  };
}
function dT(e, n) {
  return arguments.length > 1 ? this.each((n == null ? lT : typeof n == "function" ? fT : cT)(e, n)) : this.node()[e];
}
function ev(e) {
  return e.trim().split(/^|\s+/);
}
function Cd(e) {
  return e.classList || new tv(e);
}
function tv(e) {
  this._node = e, this._names = ev(e.getAttribute("class") || "");
}
tv.prototype = {
  add: function(e) {
    var n = this._names.indexOf(e);
    n < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var n = this._names.indexOf(e);
    n >= 0 && (this._names.splice(n, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function nv(e, n) {
  for (var t = Cd(e), a = -1, u = n.length; ++a < u; ) t.add(n[a]);
}
function rv(e, n) {
  for (var t = Cd(e), a = -1, u = n.length; ++a < u; ) t.remove(n[a]);
}
function hT(e) {
  return function() {
    nv(this, e);
  };
}
function pT(e) {
  return function() {
    rv(this, e);
  };
}
function gT(e, n) {
  return function() {
    (n.apply(this, arguments) ? nv : rv)(this, e);
  };
}
function mT(e, n) {
  var t = ev(e + "");
  if (arguments.length < 2) {
    for (var a = Cd(this.node()), u = -1, f = t.length; ++u < f; ) if (!a.contains(t[u])) return !1;
    return !0;
  }
  return this.each((typeof n == "function" ? gT : n ? hT : pT)(t, n));
}
function vT() {
  this.textContent = "";
}
function yT(e) {
  return function() {
    this.textContent = e;
  };
}
function wT(e) {
  return function() {
    var n = e.apply(this, arguments);
    this.textContent = n ?? "";
  };
}
function bT(e) {
  return arguments.length ? this.each(e == null ? vT : (typeof e == "function" ? wT : yT)(e)) : this.node().textContent;
}
function _T() {
  this.innerHTML = "";
}
function xT(e) {
  return function() {
    this.innerHTML = e;
  };
}
function ST(e) {
  return function() {
    var n = e.apply(this, arguments);
    this.innerHTML = n ?? "";
  };
}
function $T(e) {
  return arguments.length ? this.each(e == null ? _T : (typeof e == "function" ? ST : xT)(e)) : this.node().innerHTML;
}
function ET() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function CT() {
  return this.each(ET);
}
function AT() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function TT() {
  return this.each(AT);
}
function PT(e) {
  var n = typeof e == "function" ? e : Gm(e);
  return this.select(function() {
    return this.appendChild(n.apply(this, arguments));
  });
}
function kT() {
  return null;
}
function NT(e, n) {
  var t = typeof e == "function" ? e : Gm(e), a = n == null ? kT : typeof n == "function" ? n : Ed(n);
  return this.select(function() {
    return this.insertBefore(t.apply(this, arguments), a.apply(this, arguments) || null);
  });
}
function OT() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function LT() {
  return this.each(OT);
}
function RT() {
  var e = this.cloneNode(!1), n = this.parentNode;
  return n ? n.insertBefore(e, this.nextSibling) : e;
}
function MT() {
  var e = this.cloneNode(!0), n = this.parentNode;
  return n ? n.insertBefore(e, this.nextSibling) : e;
}
function DT(e) {
  return this.select(e ? MT : RT);
}
function IT(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function FT(e) {
  return function(n) {
    e.call(this, n, this.__data__);
  };
}
function qT(e) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var t = "", a = n.indexOf(".");
    return a >= 0 && (t = n.slice(a + 1), n = n.slice(0, a)), { type: n, name: t };
  });
}
function zT(e) {
  return function() {
    var n = this.__on;
    if (n) {
      for (var t = 0, a = -1, u = n.length, f; t < u; ++t)
        f = n[t], (!e.type || f.type === e.type) && f.name === e.name ? this.removeEventListener(f.type, f.listener, f.options) : n[++a] = f;
      ++a ? n.length = a : delete this.__on;
    }
  };
}
function BT(e, n, t) {
  return function() {
    var a = this.__on, u, f = FT(n);
    if (a) {
      for (var d = 0, v = a.length; d < v; ++d)
        if ((u = a[d]).type === e.type && u.name === e.name) {
          this.removeEventListener(u.type, u.listener, u.options), this.addEventListener(u.type, u.listener = f, u.options = t), u.value = n;
          return;
        }
    }
    this.addEventListener(e.type, f, t), u = { type: e.type, name: e.name, value: n, listener: f, options: t }, a ? a.push(u) : this.__on = [u];
  };
}
function jT(e, n, t) {
  var a = qT(e + ""), u, f = a.length, d;
  if (arguments.length < 2) {
    var v = this.node().__on;
    if (v) {
      for (var p = 0, g = v.length, b; p < g; ++p)
        for (u = 0, b = v[p]; u < f; ++u)
          if ((d = a[u]).type === b.type && d.name === b.name)
            return b.value;
    }
    return;
  }
  for (v = n ? BT : zT, u = 0; u < f; ++u) this.each(v(a[u], n, t));
  return this;
}
function iv(e, n, t) {
  var a = Zm(e), u = a.CustomEvent;
  typeof u == "function" ? u = new u(n, t) : (u = a.document.createEvent("Event"), t ? (u.initEvent(n, t.bubbles, t.cancelable), u.detail = t.detail) : u.initEvent(n, !1, !1)), e.dispatchEvent(u);
}
function HT(e, n) {
  return function() {
    return iv(this, e, n);
  };
}
function WT(e, n) {
  return function() {
    return iv(this, e, n.apply(this, arguments));
  };
}
function VT(e, n) {
  return this.each((typeof n == "function" ? WT : HT)(e, n));
}
function* UT() {
  for (var e = this._groups, n = 0, t = e.length; n < t; ++n)
    for (var a = e[n], u = 0, f = a.length, d; u < f; ++u)
      (d = a[u]) && (yield d);
}
var Ad = [null];
function Nn(e, n) {
  this._groups = e, this._parents = n;
}
function Ss() {
  return new Nn([[document.documentElement]], Ad);
}
function GT() {
  return this;
}
Nn.prototype = Ss.prototype = {
  constructor: Nn,
  select: bA,
  selectAll: SA,
  selectChild: AA,
  selectChildren: NA,
  filter: OA,
  data: FA,
  enter: LA,
  exit: zA,
  join: BA,
  merge: jA,
  selection: GT,
  order: HA,
  sort: WA,
  call: UA,
  nodes: GA,
  node: KA,
  size: XA,
  empty: YA,
  each: QA,
  attr: iT,
  style: uT,
  property: dT,
  classed: mT,
  text: bT,
  html: $T,
  raise: CT,
  lower: TT,
  append: PT,
  insert: NT,
  remove: LT,
  clone: DT,
  datum: IT,
  on: jT,
  dispatch: VT,
  [Symbol.iterator]: UT
};
function He(e) {
  return typeof e == "string" ? new Nn([[document.querySelector(e)]], [document.documentElement]) : new Nn([[e]], Ad);
}
function KT(e) {
  let n;
  for (; n = e.sourceEvent; ) e = n;
  return e;
}
function _r(e, n) {
  if (e = KT(e), n === void 0 && (n = e.currentTarget), n) {
    var t = n.ownerSVGElement || n;
    if (t.createSVGPoint) {
      var a = t.createSVGPoint();
      return a.x = e.clientX, a.y = e.clientY, a = a.matrixTransform(n.getScreenCTM().inverse()), [a.x, a.y];
    }
    if (n.getBoundingClientRect) {
      var u = n.getBoundingClientRect();
      return [e.clientX - u.left - n.clientLeft, e.clientY - u.top - n.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
function yf(e) {
  return typeof e == "string" ? new Nn([document.querySelectorAll(e)], [document.documentElement]) : new Nn([Km(e)], Ad);
}
const XT = { passive: !1 }, fs = { capture: !0, passive: !1 };
function Qc(e) {
  e.stopImmediatePropagation();
}
function ta(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function ov(e) {
  var n = e.document.documentElement, t = He(e).on("dragstart.drag", ta, fs);
  "onselectstart" in n ? t.on("selectstart.drag", ta, fs) : (n.__noselect = n.style.MozUserSelect, n.style.MozUserSelect = "none");
}
function av(e, n) {
  var t = e.document.documentElement, a = He(e).on("dragstart.drag", null);
  n && (a.on("click.drag", ta, fs), setTimeout(function() {
    a.on("click.drag", null);
  }, 0)), "onselectstart" in t ? a.on("selectstart.drag", null) : (t.style.MozUserSelect = t.__noselect, delete t.__noselect);
}
const qu = (e) => () => e;
function wf(e, {
  sourceEvent: n,
  subject: t,
  target: a,
  identifier: u,
  active: f,
  x: d,
  y: v,
  dx: p,
  dy: g,
  dispatch: b
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: n, enumerable: !0, configurable: !0 },
    subject: { value: t, enumerable: !0, configurable: !0 },
    target: { value: a, enumerable: !0, configurable: !0 },
    identifier: { value: u, enumerable: !0, configurable: !0 },
    active: { value: f, enumerable: !0, configurable: !0 },
    x: { value: d, enumerable: !0, configurable: !0 },
    y: { value: v, enumerable: !0, configurable: !0 },
    dx: { value: p, enumerable: !0, configurable: !0 },
    dy: { value: g, enumerable: !0, configurable: !0 },
    _: { value: b }
  });
}
wf.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function YT(e) {
  return !e.ctrlKey && !e.button;
}
function QT() {
  return this.parentNode;
}
function JT(e, n) {
  return n ?? { x: e.x, y: e.y };
}
function ZT() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function eP() {
  var e = YT, n = QT, t = JT, a = ZT, u = {}, f = Pl("start", "drag", "end"), d = 0, v, p, g, b, w = 0;
  function m(k) {
    k.on("mousedown.drag", x).filter(a).on("touchstart.drag", E).on("touchmove.drag", A, XT).on("touchend.drag touchcancel.drag", I).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function x(k, j) {
    if (!(b || !e.call(this, k, j))) {
      var U = F(this, n.call(this, k, j), k, j, "mouse");
      U && (He(k.view).on("mousemove.drag", s, fs).on("mouseup.drag", $, fs), ov(k.view), Qc(k), g = !1, v = k.clientX, p = k.clientY, U("start", k));
    }
  }
  function s(k) {
    if (ta(k), !g) {
      var j = k.clientX - v, U = k.clientY - p;
      g = j * j + U * U > w;
    }
    u.mouse("drag", k);
  }
  function $(k) {
    He(k.view).on("mousemove.drag mouseup.drag", null), av(k.view, g), ta(k), u.mouse("end", k);
  }
  function E(k, j) {
    if (e.call(this, k, j)) {
      var U = k.changedTouches, ne = n.call(this, k, j), Se = U.length, Ce, Ee;
      for (Ce = 0; Ce < Se; ++Ce)
        (Ee = F(this, ne, k, j, U[Ce].identifier, U[Ce])) && (Qc(k), Ee("start", k, U[Ce]));
    }
  }
  function A(k) {
    var j = k.changedTouches, U = j.length, ne, Se;
    for (ne = 0; ne < U; ++ne)
      (Se = u[j[ne].identifier]) && (ta(k), Se("drag", k, j[ne]));
  }
  function I(k) {
    var j = k.changedTouches, U = j.length, ne, Se;
    for (b && clearTimeout(b), b = setTimeout(function() {
      b = null;
    }, 500), ne = 0; ne < U; ++ne)
      (Se = u[j[ne].identifier]) && (Qc(k), Se("end", k, j[ne]));
  }
  function F(k, j, U, ne, Se, Ce) {
    var Ee = f.copy(), Ae = _r(Ce || U, j), We, Fe, J;
    if ((J = t.call(k, new wf("beforestart", {
      sourceEvent: U,
      target: m,
      identifier: Se,
      active: d,
      x: Ae[0],
      y: Ae[1],
      dx: 0,
      dy: 0,
      dispatch: Ee
    }), ne)) != null)
      return We = J.x - Ae[0] || 0, Fe = J.y - Ae[1] || 0, function _e(oe, pe, ke) {
        var Ne = Ae, ae;
        switch (oe) {
          case "start":
            u[Se] = _e, ae = d++;
            break;
          case "end":
            delete u[Se], --d;
          case "drag":
            Ae = _r(ke || pe, j), ae = d;
            break;
        }
        Ee.call(
          oe,
          k,
          new wf(oe, {
            sourceEvent: pe,
            subject: J,
            target: m,
            identifier: Se,
            active: ae,
            x: Ae[0] + We,
            y: Ae[1] + Fe,
            dx: Ae[0] - Ne[0],
            dy: Ae[1] - Ne[1],
            dispatch: Ee
          }),
          ne
        );
      };
  }
  return m.filter = function(k) {
    return arguments.length ? (e = typeof k == "function" ? k : qu(!!k), m) : e;
  }, m.container = function(k) {
    return arguments.length ? (n = typeof k == "function" ? k : qu(k), m) : n;
  }, m.subject = function(k) {
    return arguments.length ? (t = typeof k == "function" ? k : qu(k), m) : t;
  }, m.touchable = function(k) {
    return arguments.length ? (a = typeof k == "function" ? k : qu(!!k), m) : a;
  }, m.on = function() {
    var k = f.on.apply(f, arguments);
    return k === f ? m : k;
  }, m.clickDistance = function(k) {
    return arguments.length ? (w = (k = +k) * k, m) : Math.sqrt(w);
  }, m;
}
function Td(e, n, t) {
  e.prototype = n.prototype = t, t.constructor = e;
}
function sv(e, n) {
  var t = Object.create(e.prototype);
  for (var a in n) t[a] = n[a];
  return t;
}
function $s() {
}
var ds = 0.7, hl = 1 / ds, na = "\\s*([+-]?\\d+)\\s*", hs = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Br = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", tP = /^#([0-9a-f]{3,8})$/, nP = new RegExp(`^rgb\\(${na},${na},${na}\\)$`), rP = new RegExp(`^rgb\\(${Br},${Br},${Br}\\)$`), iP = new RegExp(`^rgba\\(${na},${na},${na},${hs}\\)$`), oP = new RegExp(`^rgba\\(${Br},${Br},${Br},${hs}\\)$`), aP = new RegExp(`^hsl\\(${hs},${Br},${Br}\\)$`), sP = new RegExp(`^hsla\\(${hs},${Br},${Br},${hs}\\)$`), rg = {
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
Td($s, yo, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ig,
  // Deprecated! Use color.formatHex.
  formatHex: ig,
  formatHex8: uP,
  formatHsl: lP,
  formatRgb: og,
  toString: og
});
function ig() {
  return this.rgb().formatHex();
}
function uP() {
  return this.rgb().formatHex8();
}
function lP() {
  return uv(this).formatHsl();
}
function og() {
  return this.rgb().formatRgb();
}
function yo(e) {
  var n, t;
  return e = (e + "").trim().toLowerCase(), (n = tP.exec(e)) ? (t = n[1].length, n = parseInt(n[1], 16), t === 6 ? ag(n) : t === 3 ? new qn(n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, (n & 15) << 4 | n & 15, 1) : t === 8 ? zu(n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, (n & 255) / 255) : t === 4 ? zu(n >> 12 & 15 | n >> 8 & 240, n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | n & 240, ((n & 15) << 4 | n & 15) / 255) : null) : (n = nP.exec(e)) ? new qn(n[1], n[2], n[3], 1) : (n = rP.exec(e)) ? new qn(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, 1) : (n = iP.exec(e)) ? zu(n[1], n[2], n[3], n[4]) : (n = oP.exec(e)) ? zu(n[1] * 255 / 100, n[2] * 255 / 100, n[3] * 255 / 100, n[4]) : (n = aP.exec(e)) ? lg(n[1], n[2] / 100, n[3] / 100, 1) : (n = sP.exec(e)) ? lg(n[1], n[2] / 100, n[3] / 100, n[4]) : rg.hasOwnProperty(e) ? ag(rg[e]) : e === "transparent" ? new qn(NaN, NaN, NaN, 0) : null;
}
function ag(e) {
  return new qn(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function zu(e, n, t, a) {
  return a <= 0 && (e = n = t = NaN), new qn(e, n, t, a);
}
function cP(e) {
  return e instanceof $s || (e = yo(e)), e ? (e = e.rgb(), new qn(e.r, e.g, e.b, e.opacity)) : new qn();
}
function bf(e, n, t, a) {
  return arguments.length === 1 ? cP(e) : new qn(e, n, t, a ?? 1);
}
function qn(e, n, t, a) {
  this.r = +e, this.g = +n, this.b = +t, this.opacity = +a;
}
Td(qn, bf, sv($s, {
  brighter(e) {
    return e = e == null ? hl : Math.pow(hl, e), new qn(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ds : Math.pow(ds, e), new qn(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new qn(po(this.r), po(this.g), po(this.b), pl(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: sg,
  // Deprecated! Use color.formatHex.
  formatHex: sg,
  formatHex8: fP,
  formatRgb: ug,
  toString: ug
}));
function sg() {
  return `#${ho(this.r)}${ho(this.g)}${ho(this.b)}`;
}
function fP() {
  return `#${ho(this.r)}${ho(this.g)}${ho(this.b)}${ho((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ug() {
  const e = pl(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${po(this.r)}, ${po(this.g)}, ${po(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function pl(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function po(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function ho(e) {
  return e = po(e), (e < 16 ? "0" : "") + e.toString(16);
}
function lg(e, n, t, a) {
  return a <= 0 ? e = n = t = NaN : t <= 0 || t >= 1 ? e = n = NaN : n <= 0 && (e = NaN), new $r(e, n, t, a);
}
function uv(e) {
  if (e instanceof $r) return new $r(e.h, e.s, e.l, e.opacity);
  if (e instanceof $s || (e = yo(e)), !e) return new $r();
  if (e instanceof $r) return e;
  e = e.rgb();
  var n = e.r / 255, t = e.g / 255, a = e.b / 255, u = Math.min(n, t, a), f = Math.max(n, t, a), d = NaN, v = f - u, p = (f + u) / 2;
  return v ? (n === f ? d = (t - a) / v + (t < a) * 6 : t === f ? d = (a - n) / v + 2 : d = (n - t) / v + 4, v /= p < 0.5 ? f + u : 2 - f - u, d *= 60) : v = p > 0 && p < 1 ? 0 : d, new $r(d, v, p, e.opacity);
}
function dP(e, n, t, a) {
  return arguments.length === 1 ? uv(e) : new $r(e, n, t, a ?? 1);
}
function $r(e, n, t, a) {
  this.h = +e, this.s = +n, this.l = +t, this.opacity = +a;
}
Td($r, dP, sv($s, {
  brighter(e) {
    return e = e == null ? hl : Math.pow(hl, e), new $r(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ds : Math.pow(ds, e), new $r(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, n = isNaN(e) || isNaN(this.s) ? 0 : this.s, t = this.l, a = t + (t < 0.5 ? t : 1 - t) * n, u = 2 * t - a;
    return new qn(
      Jc(e >= 240 ? e - 240 : e + 120, u, a),
      Jc(e, u, a),
      Jc(e < 120 ? e + 240 : e - 120, u, a),
      this.opacity
    );
  },
  clamp() {
    return new $r(cg(this.h), Bu(this.s), Bu(this.l), pl(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = pl(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${cg(this.h)}, ${Bu(this.s) * 100}%, ${Bu(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function cg(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Bu(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Jc(e, n, t) {
  return (e < 60 ? n + (t - n) * e / 60 : e < 180 ? t : e < 240 ? n + (t - n) * (240 - e) / 60 : n) * 255;
}
const Pd = (e) => () => e;
function hP(e, n) {
  return function(t) {
    return e + t * n;
  };
}
function pP(e, n, t) {
  return e = Math.pow(e, t), n = Math.pow(n, t) - e, t = 1 / t, function(a) {
    return Math.pow(e + a * n, t);
  };
}
function gP(e) {
  return (e = +e) == 1 ? lv : function(n, t) {
    return t - n ? pP(n, t, e) : Pd(isNaN(n) ? t : n);
  };
}
function lv(e, n) {
  var t = n - e;
  return t ? hP(e, t) : Pd(isNaN(e) ? n : e);
}
const gl = function e(n) {
  var t = gP(n);
  function a(u, f) {
    var d = t((u = bf(u)).r, (f = bf(f)).r), v = t(u.g, f.g), p = t(u.b, f.b), g = lv(u.opacity, f.opacity);
    return function(b) {
      return u.r = d(b), u.g = v(b), u.b = p(b), u.opacity = g(b), u + "";
    };
  }
  return a.gamma = e, a;
}(1);
function mP(e, n) {
  n || (n = []);
  var t = e ? Math.min(n.length, e.length) : 0, a = n.slice(), u;
  return function(f) {
    for (u = 0; u < t; ++u) a[u] = e[u] * (1 - f) + n[u] * f;
    return a;
  };
}
function vP(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function yP(e, n) {
  var t = n ? n.length : 0, a = e ? Math.min(t, e.length) : 0, u = new Array(a), f = new Array(t), d;
  for (d = 0; d < a; ++d) u[d] = kd(e[d], n[d]);
  for (; d < t; ++d) f[d] = n[d];
  return function(v) {
    for (d = 0; d < a; ++d) f[d] = u[d](v);
    return f;
  };
}
function wP(e, n) {
  var t = /* @__PURE__ */ new Date();
  return e = +e, n = +n, function(a) {
    return t.setTime(e * (1 - a) + n * a), t;
  };
}
function xr(e, n) {
  return e = +e, n = +n, function(t) {
    return e * (1 - t) + n * t;
  };
}
function bP(e, n) {
  var t = {}, a = {}, u;
  (e === null || typeof e != "object") && (e = {}), (n === null || typeof n != "object") && (n = {});
  for (u in n)
    u in e ? t[u] = kd(e[u], n[u]) : a[u] = n[u];
  return function(f) {
    for (u in t) a[u] = t[u](f);
    return a;
  };
}
var _f = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Zc = new RegExp(_f.source, "g");
function _P(e) {
  return function() {
    return e;
  };
}
function xP(e) {
  return function(n) {
    return e(n) + "";
  };
}
function cv(e, n) {
  var t = _f.lastIndex = Zc.lastIndex = 0, a, u, f, d = -1, v = [], p = [];
  for (e = e + "", n = n + ""; (a = _f.exec(e)) && (u = Zc.exec(n)); )
    (f = u.index) > t && (f = n.slice(t, f), v[d] ? v[d] += f : v[++d] = f), (a = a[0]) === (u = u[0]) ? v[d] ? v[d] += u : v[++d] = u : (v[++d] = null, p.push({ i: d, x: xr(a, u) })), t = Zc.lastIndex;
  return t < n.length && (f = n.slice(t), v[d] ? v[d] += f : v[++d] = f), v.length < 2 ? p[0] ? xP(p[0].x) : _P(n) : (n = p.length, function(g) {
    for (var b = 0, w; b < n; ++b) v[(w = p[b]).i] = w.x(g);
    return v.join("");
  });
}
function kd(e, n) {
  var t = typeof n, a;
  return n == null || t === "boolean" ? Pd(n) : (t === "number" ? xr : t === "string" ? (a = yo(n)) ? (n = a, gl) : cv : n instanceof yo ? gl : n instanceof Date ? wP : vP(n) ? mP : Array.isArray(n) ? yP : typeof n.valueOf != "function" && typeof n.toString != "function" || isNaN(n) ? bP : xr)(e, n);
}
function SP(e, n) {
  return e = +e, n = +n, function(t) {
    return Math.round(e * (1 - t) + n * t);
  };
}
var fg = 180 / Math.PI, xf = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function fv(e, n, t, a, u, f) {
  var d, v, p;
  return (d = Math.sqrt(e * e + n * n)) && (e /= d, n /= d), (p = e * t + n * a) && (t -= e * p, a -= n * p), (v = Math.sqrt(t * t + a * a)) && (t /= v, a /= v, p /= v), e * a < n * t && (e = -e, n = -n, p = -p, d = -d), {
    translateX: u,
    translateY: f,
    rotate: Math.atan2(n, e) * fg,
    skewX: Math.atan(p) * fg,
    scaleX: d,
    scaleY: v
  };
}
var ju;
function $P(e) {
  const n = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return n.isIdentity ? xf : fv(n.a, n.b, n.c, n.d, n.e, n.f);
}
function EP(e) {
  return e == null || (ju || (ju = document.createElementNS("http://www.w3.org/2000/svg", "g")), ju.setAttribute("transform", e), !(e = ju.transform.baseVal.consolidate())) ? xf : (e = e.matrix, fv(e.a, e.b, e.c, e.d, e.e, e.f));
}
function dv(e, n, t, a) {
  function u(g) {
    return g.length ? g.pop() + " " : "";
  }
  function f(g, b, w, m, x, s) {
    if (g !== w || b !== m) {
      var $ = x.push("translate(", null, n, null, t);
      s.push({ i: $ - 4, x: xr(g, w) }, { i: $ - 2, x: xr(b, m) });
    } else (w || m) && x.push("translate(" + w + n + m + t);
  }
  function d(g, b, w, m) {
    g !== b ? (g - b > 180 ? b += 360 : b - g > 180 && (g += 360), m.push({ i: w.push(u(w) + "rotate(", null, a) - 2, x: xr(g, b) })) : b && w.push(u(w) + "rotate(" + b + a);
  }
  function v(g, b, w, m) {
    g !== b ? m.push({ i: w.push(u(w) + "skewX(", null, a) - 2, x: xr(g, b) }) : b && w.push(u(w) + "skewX(" + b + a);
  }
  function p(g, b, w, m, x, s) {
    if (g !== w || b !== m) {
      var $ = x.push(u(x) + "scale(", null, ",", null, ")");
      s.push({ i: $ - 4, x: xr(g, w) }, { i: $ - 2, x: xr(b, m) });
    } else (w !== 1 || m !== 1) && x.push(u(x) + "scale(" + w + "," + m + ")");
  }
  return function(g, b) {
    var w = [], m = [];
    return g = e(g), b = e(b), f(g.translateX, g.translateY, b.translateX, b.translateY, w, m), d(g.rotate, b.rotate, w, m), v(g.skewX, b.skewX, w, m), p(g.scaleX, g.scaleY, b.scaleX, b.scaleY, w, m), g = b = null, function(x) {
      for (var s = -1, $ = m.length, E; ++s < $; ) w[(E = m[s]).i] = E.x(x);
      return w.join("");
    };
  };
}
var CP = dv($P, "px, ", "px)", "deg)"), AP = dv(EP, ", ", ")", ")"), TP = 1e-12;
function dg(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function PP(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function kP(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const NP = function e(n, t, a) {
  function u(f, d) {
    var v = f[0], p = f[1], g = f[2], b = d[0], w = d[1], m = d[2], x = b - v, s = w - p, $ = x * x + s * s, E, A;
    if ($ < TP)
      A = Math.log(m / g) / n, E = function(ne) {
        return [
          v + ne * x,
          p + ne * s,
          g * Math.exp(n * ne * A)
        ];
      };
    else {
      var I = Math.sqrt($), F = (m * m - g * g + a * $) / (2 * g * t * I), k = (m * m - g * g - a * $) / (2 * m * t * I), j = Math.log(Math.sqrt(F * F + 1) - F), U = Math.log(Math.sqrt(k * k + 1) - k);
      A = (U - j) / n, E = function(ne) {
        var Se = ne * A, Ce = dg(j), Ee = g / (t * I) * (Ce * kP(n * Se + j) - PP(j));
        return [
          v + Ee * x,
          p + Ee * s,
          g * Ce / dg(n * Se + j)
        ];
      };
    }
    return E.duration = A * 1e3 * n / Math.SQRT2, E;
  }
  return u.rho = function(f) {
    var d = Math.max(1e-3, +f), v = d * d, p = v * v;
    return e(d, v, p);
  }, u;
}(Math.SQRT2, 2, 4);
var sa = 0, es = 0, Xa = 0, hv = 1e3, ml, ts, vl = 0, wo = 0, Nl = 0, ps = typeof performance == "object" && performance.now ? performance : Date, pv = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Nd() {
  return wo || (pv(OP), wo = ps.now() + Nl);
}
function OP() {
  wo = 0;
}
function yl() {
  this._call = this._time = this._next = null;
}
yl.prototype = gv.prototype = {
  constructor: yl,
  restart: function(e, n, t) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    t = (t == null ? Nd() : +t) + (n == null ? 0 : +n), !this._next && ts !== this && (ts ? ts._next = this : ml = this, ts = this), this._call = e, this._time = t, Sf();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Sf());
  }
};
function gv(e, n, t) {
  var a = new yl();
  return a.restart(e, n, t), a;
}
function LP() {
  Nd(), ++sa;
  for (var e = ml, n; e; )
    (n = wo - e._time) >= 0 && e._call.call(void 0, n), e = e._next;
  --sa;
}
function hg() {
  wo = (vl = ps.now()) + Nl, sa = es = 0;
  try {
    LP();
  } finally {
    sa = 0, MP(), wo = 0;
  }
}
function RP() {
  var e = ps.now(), n = e - vl;
  n > hv && (Nl -= n, vl = e);
}
function MP() {
  for (var e, n = ml, t, a = 1 / 0; n; )
    n._call ? (a > n._time && (a = n._time), e = n, n = n._next) : (t = n._next, n._next = null, n = e ? e._next = t : ml = t);
  ts = e, Sf(a);
}
function Sf(e) {
  if (!sa) {
    es && (es = clearTimeout(es));
    var n = e - wo;
    n > 24 ? (e < 1 / 0 && (es = setTimeout(hg, e - ps.now() - Nl)), Xa && (Xa = clearInterval(Xa))) : (Xa || (vl = ps.now(), Xa = setInterval(RP, hv)), sa = 1, pv(hg));
  }
}
function pg(e, n, t) {
  var a = new yl();
  return n = n == null ? 0 : +n, a.restart((u) => {
    a.stop(), e(u + n);
  }, n, t), a;
}
var DP = Pl("start", "end", "cancel", "interrupt"), IP = [], mv = 0, gg = 1, $f = 2, tl = 3, mg = 4, Ef = 5, nl = 6;
function Ol(e, n, t, a, u, f) {
  var d = e.__transition;
  if (!d) e.__transition = {};
  else if (t in d) return;
  FP(e, t, {
    name: n,
    index: a,
    // For context during callback.
    group: u,
    // For context during callback.
    on: DP,
    tween: IP,
    time: f.time,
    delay: f.delay,
    duration: f.duration,
    ease: f.ease,
    timer: null,
    state: mv
  });
}
function Od(e, n) {
  var t = Cr(e, n);
  if (t.state > mv) throw new Error("too late; already scheduled");
  return t;
}
function Vr(e, n) {
  var t = Cr(e, n);
  if (t.state > tl) throw new Error("too late; already running");
  return t;
}
function Cr(e, n) {
  var t = e.__transition;
  if (!t || !(t = t[n])) throw new Error("transition not found");
  return t;
}
function FP(e, n, t) {
  var a = e.__transition, u;
  a[n] = t, t.timer = gv(f, 0, t.time);
  function f(g) {
    t.state = gg, t.timer.restart(d, t.delay, t.time), t.delay <= g && d(g - t.delay);
  }
  function d(g) {
    var b, w, m, x;
    if (t.state !== gg) return p();
    for (b in a)
      if (x = a[b], x.name === t.name) {
        if (x.state === tl) return pg(d);
        x.state === mg ? (x.state = nl, x.timer.stop(), x.on.call("interrupt", e, e.__data__, x.index, x.group), delete a[b]) : +b < n && (x.state = nl, x.timer.stop(), x.on.call("cancel", e, e.__data__, x.index, x.group), delete a[b]);
      }
    if (pg(function() {
      t.state === tl && (t.state = mg, t.timer.restart(v, t.delay, t.time), v(g));
    }), t.state = $f, t.on.call("start", e, e.__data__, t.index, t.group), t.state === $f) {
      for (t.state = tl, u = new Array(m = t.tween.length), b = 0, w = -1; b < m; ++b)
        (x = t.tween[b].value.call(e, e.__data__, t.index, t.group)) && (u[++w] = x);
      u.length = w + 1;
    }
  }
  function v(g) {
    for (var b = g < t.duration ? t.ease.call(null, g / t.duration) : (t.timer.restart(p), t.state = Ef, 1), w = -1, m = u.length; ++w < m; )
      u[w].call(e, b);
    t.state === Ef && (t.on.call("end", e, e.__data__, t.index, t.group), p());
  }
  function p() {
    t.state = nl, t.timer.stop(), delete a[n];
    for (var g in a) return;
    delete e.__transition;
  }
}
function rl(e, n) {
  var t = e.__transition, a, u, f = !0, d;
  if (t) {
    n = n == null ? null : n + "";
    for (d in t) {
      if ((a = t[d]).name !== n) {
        f = !1;
        continue;
      }
      u = a.state > $f && a.state < Ef, a.state = nl, a.timer.stop(), a.on.call(u ? "interrupt" : "cancel", e, e.__data__, a.index, a.group), delete t[d];
    }
    f && delete e.__transition;
  }
}
function qP(e) {
  return this.each(function() {
    rl(this, e);
  });
}
function zP(e, n) {
  var t, a;
  return function() {
    var u = Vr(this, e), f = u.tween;
    if (f !== t) {
      a = t = f;
      for (var d = 0, v = a.length; d < v; ++d)
        if (a[d].name === n) {
          a = a.slice(), a.splice(d, 1);
          break;
        }
    }
    u.tween = a;
  };
}
function BP(e, n, t) {
  var a, u;
  if (typeof t != "function") throw new Error();
  return function() {
    var f = Vr(this, e), d = f.tween;
    if (d !== a) {
      u = (a = d).slice();
      for (var v = { name: n, value: t }, p = 0, g = u.length; p < g; ++p)
        if (u[p].name === n) {
          u[p] = v;
          break;
        }
      p === g && u.push(v);
    }
    f.tween = u;
  };
}
function jP(e, n) {
  var t = this._id;
  if (e += "", arguments.length < 2) {
    for (var a = Cr(this.node(), t).tween, u = 0, f = a.length, d; u < f; ++u)
      if ((d = a[u]).name === e)
        return d.value;
    return null;
  }
  return this.each((n == null ? zP : BP)(t, e, n));
}
function Ld(e, n, t) {
  var a = e._id;
  return e.each(function() {
    var u = Vr(this, a);
    (u.value || (u.value = {}))[n] = t.apply(this, arguments);
  }), function(u) {
    return Cr(u, a).value[n];
  };
}
function vv(e, n) {
  var t;
  return (typeof n == "number" ? xr : n instanceof yo ? gl : (t = yo(n)) ? (n = t, gl) : cv)(e, n);
}
function HP(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function WP(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function VP(e, n, t) {
  var a, u = t + "", f;
  return function() {
    var d = this.getAttribute(e);
    return d === u ? null : d === a ? f : f = n(a = d, t);
  };
}
function UP(e, n, t) {
  var a, u = t + "", f;
  return function() {
    var d = this.getAttributeNS(e.space, e.local);
    return d === u ? null : d === a ? f : f = n(a = d, t);
  };
}
function GP(e, n, t) {
  var a, u, f;
  return function() {
    var d, v = t(this), p;
    return v == null ? void this.removeAttribute(e) : (d = this.getAttribute(e), p = v + "", d === p ? null : d === a && p === u ? f : (u = p, f = n(a = d, v)));
  };
}
function KP(e, n, t) {
  var a, u, f;
  return function() {
    var d, v = t(this), p;
    return v == null ? void this.removeAttributeNS(e.space, e.local) : (d = this.getAttributeNS(e.space, e.local), p = v + "", d === p ? null : d === a && p === u ? f : (u = p, f = n(a = d, v)));
  };
}
function XP(e, n) {
  var t = kl(e), a = t === "transform" ? AP : vv;
  return this.attrTween(e, typeof n == "function" ? (t.local ? KP : GP)(t, a, Ld(this, "attr." + e, n)) : n == null ? (t.local ? WP : HP)(t) : (t.local ? UP : VP)(t, a, n));
}
function YP(e, n) {
  return function(t) {
    this.setAttribute(e, n.call(this, t));
  };
}
function QP(e, n) {
  return function(t) {
    this.setAttributeNS(e.space, e.local, n.call(this, t));
  };
}
function JP(e, n) {
  var t, a;
  function u() {
    var f = n.apply(this, arguments);
    return f !== a && (t = (a = f) && QP(e, f)), t;
  }
  return u._value = n, u;
}
function ZP(e, n) {
  var t, a;
  function u() {
    var f = n.apply(this, arguments);
    return f !== a && (t = (a = f) && YP(e, f)), t;
  }
  return u._value = n, u;
}
function ek(e, n) {
  var t = "attr." + e;
  if (arguments.length < 2) return (t = this.tween(t)) && t._value;
  if (n == null) return this.tween(t, null);
  if (typeof n != "function") throw new Error();
  var a = kl(e);
  return this.tween(t, (a.local ? JP : ZP)(a, n));
}
function tk(e, n) {
  return function() {
    Od(this, e).delay = +n.apply(this, arguments);
  };
}
function nk(e, n) {
  return n = +n, function() {
    Od(this, e).delay = n;
  };
}
function rk(e) {
  var n = this._id;
  return arguments.length ? this.each((typeof e == "function" ? tk : nk)(n, e)) : Cr(this.node(), n).delay;
}
function ik(e, n) {
  return function() {
    Vr(this, e).duration = +n.apply(this, arguments);
  };
}
function ok(e, n) {
  return n = +n, function() {
    Vr(this, e).duration = n;
  };
}
function ak(e) {
  var n = this._id;
  return arguments.length ? this.each((typeof e == "function" ? ik : ok)(n, e)) : Cr(this.node(), n).duration;
}
function sk(e, n) {
  if (typeof n != "function") throw new Error();
  return function() {
    Vr(this, e).ease = n;
  };
}
function uk(e) {
  var n = this._id;
  return arguments.length ? this.each(sk(n, e)) : Cr(this.node(), n).ease;
}
function lk(e, n) {
  return function() {
    var t = n.apply(this, arguments);
    if (typeof t != "function") throw new Error();
    Vr(this, e).ease = t;
  };
}
function ck(e) {
  if (typeof e != "function") throw new Error();
  return this.each(lk(this._id, e));
}
function fk(e) {
  typeof e != "function" && (e = Ym(e));
  for (var n = this._groups, t = n.length, a = new Array(t), u = 0; u < t; ++u)
    for (var f = n[u], d = f.length, v = a[u] = [], p, g = 0; g < d; ++g)
      (p = f[g]) && e.call(p, p.__data__, g, f) && v.push(p);
  return new gi(a, this._parents, this._name, this._id);
}
function dk(e) {
  if (e._id !== this._id) throw new Error();
  for (var n = this._groups, t = e._groups, a = n.length, u = t.length, f = Math.min(a, u), d = new Array(a), v = 0; v < f; ++v)
    for (var p = n[v], g = t[v], b = p.length, w = d[v] = new Array(b), m, x = 0; x < b; ++x)
      (m = p[x] || g[x]) && (w[x] = m);
  for (; v < a; ++v)
    d[v] = n[v];
  return new gi(d, this._parents, this._name, this._id);
}
function hk(e) {
  return (e + "").trim().split(/^|\s+/).every(function(n) {
    var t = n.indexOf(".");
    return t >= 0 && (n = n.slice(0, t)), !n || n === "start";
  });
}
function pk(e, n, t) {
  var a, u, f = hk(n) ? Od : Vr;
  return function() {
    var d = f(this, e), v = d.on;
    v !== a && (u = (a = v).copy()).on(n, t), d.on = u;
  };
}
function gk(e, n) {
  var t = this._id;
  return arguments.length < 2 ? Cr(this.node(), t).on.on(e) : this.each(pk(t, e, n));
}
function mk(e) {
  return function() {
    var n = this.parentNode;
    for (var t in this.__transition) if (+t !== e) return;
    n && n.removeChild(this);
  };
}
function vk() {
  return this.on("end.remove", mk(this._id));
}
function yk(e) {
  var n = this._name, t = this._id;
  typeof e != "function" && (e = Ed(e));
  for (var a = this._groups, u = a.length, f = new Array(u), d = 0; d < u; ++d)
    for (var v = a[d], p = v.length, g = f[d] = new Array(p), b, w, m = 0; m < p; ++m)
      (b = v[m]) && (w = e.call(b, b.__data__, m, v)) && ("__data__" in b && (w.__data__ = b.__data__), g[m] = w, Ol(g[m], n, t, m, g, Cr(b, t)));
  return new gi(f, this._parents, n, t);
}
function wk(e) {
  var n = this._name, t = this._id;
  typeof e != "function" && (e = Xm(e));
  for (var a = this._groups, u = a.length, f = [], d = [], v = 0; v < u; ++v)
    for (var p = a[v], g = p.length, b, w = 0; w < g; ++w)
      if (b = p[w]) {
        for (var m = e.call(b, b.__data__, w, p), x, s = Cr(b, t), $ = 0, E = m.length; $ < E; ++$)
          (x = m[$]) && Ol(x, n, t, $, m, s);
        f.push(m), d.push(b);
      }
  return new gi(f, d, n, t);
}
var bk = Ss.prototype.constructor;
function _k() {
  return new bk(this._groups, this._parents);
}
function xk(e, n) {
  var t, a, u;
  return function() {
    var f = aa(this, e), d = (this.style.removeProperty(e), aa(this, e));
    return f === d ? null : f === t && d === a ? u : u = n(t = f, a = d);
  };
}
function yv(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Sk(e, n, t) {
  var a, u = t + "", f;
  return function() {
    var d = aa(this, e);
    return d === u ? null : d === a ? f : f = n(a = d, t);
  };
}
function $k(e, n, t) {
  var a, u, f;
  return function() {
    var d = aa(this, e), v = t(this), p = v + "";
    return v == null && (p = v = (this.style.removeProperty(e), aa(this, e))), d === p ? null : d === a && p === u ? f : (u = p, f = n(a = d, v));
  };
}
function Ek(e, n) {
  var t, a, u, f = "style." + n, d = "end." + f, v;
  return function() {
    var p = Vr(this, e), g = p.on, b = p.value[f] == null ? v || (v = yv(n)) : void 0;
    (g !== t || u !== b) && (a = (t = g).copy()).on(d, u = b), p.on = a;
  };
}
function Ck(e, n, t) {
  var a = (e += "") == "transform" ? CP : vv;
  return n == null ? this.styleTween(e, xk(e, a)).on("end.style." + e, yv(e)) : typeof n == "function" ? this.styleTween(e, $k(e, a, Ld(this, "style." + e, n))).each(Ek(this._id, e)) : this.styleTween(e, Sk(e, a, n), t).on("end.style." + e, null);
}
function Ak(e, n, t) {
  return function(a) {
    this.style.setProperty(e, n.call(this, a), t);
  };
}
function Tk(e, n, t) {
  var a, u;
  function f() {
    var d = n.apply(this, arguments);
    return d !== u && (a = (u = d) && Ak(e, d, t)), a;
  }
  return f._value = n, f;
}
function Pk(e, n, t) {
  var a = "style." + (e += "");
  if (arguments.length < 2) return (a = this.tween(a)) && a._value;
  if (n == null) return this.tween(a, null);
  if (typeof n != "function") throw new Error();
  return this.tween(a, Tk(e, n, t ?? ""));
}
function kk(e) {
  return function() {
    this.textContent = e;
  };
}
function Nk(e) {
  return function() {
    var n = e(this);
    this.textContent = n ?? "";
  };
}
function Ok(e) {
  return this.tween("text", typeof e == "function" ? Nk(Ld(this, "text", e)) : kk(e == null ? "" : e + ""));
}
function Lk(e) {
  return function(n) {
    this.textContent = e.call(this, n);
  };
}
function Rk(e) {
  var n, t;
  function a() {
    var u = e.apply(this, arguments);
    return u !== t && (n = (t = u) && Lk(u)), n;
  }
  return a._value = e, a;
}
function Mk(e) {
  var n = "text";
  if (arguments.length < 1) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, Rk(e));
}
function Dk() {
  for (var e = this._name, n = this._id, t = wv(), a = this._groups, u = a.length, f = 0; f < u; ++f)
    for (var d = a[f], v = d.length, p, g = 0; g < v; ++g)
      if (p = d[g]) {
        var b = Cr(p, n);
        Ol(p, e, t, g, d, {
          time: b.time + b.delay + b.duration,
          delay: 0,
          duration: b.duration,
          ease: b.ease
        });
      }
  return new gi(a, this._parents, e, t);
}
function Ik() {
  var e, n, t = this, a = t._id, u = t.size();
  return new Promise(function(f, d) {
    var v = { value: d }, p = { value: function() {
      --u === 0 && f();
    } };
    t.each(function() {
      var g = Vr(this, a), b = g.on;
      b !== e && (n = (e = b).copy(), n._.cancel.push(v), n._.interrupt.push(v), n._.end.push(p)), g.on = n;
    }), u === 0 && f();
  });
}
var Fk = 0;
function gi(e, n, t, a) {
  this._groups = e, this._parents = n, this._name = t, this._id = a;
}
function wv() {
  return ++Fk;
}
var li = Ss.prototype;
gi.prototype = {
  constructor: gi,
  select: yk,
  selectAll: wk,
  selectChild: li.selectChild,
  selectChildren: li.selectChildren,
  filter: fk,
  merge: dk,
  selection: _k,
  transition: Dk,
  call: li.call,
  nodes: li.nodes,
  node: li.node,
  size: li.size,
  empty: li.empty,
  each: li.each,
  on: gk,
  attr: XP,
  attrTween: ek,
  style: Ck,
  styleTween: Pk,
  text: Ok,
  textTween: Mk,
  remove: vk,
  tween: jP,
  delay: rk,
  duration: ak,
  ease: uk,
  easeVarying: ck,
  end: Ik,
  [Symbol.iterator]: li[Symbol.iterator]
};
function qk(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var zk = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: qk
};
function Bk(e, n) {
  for (var t; !(t = e.__transition) || !(t = t[n]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${n} not found`);
  return t;
}
function jk(e) {
  var n, t;
  e instanceof gi ? (n = e._id, e = e._name) : (n = wv(), (t = zk).time = Nd(), e = e == null ? null : e + "");
  for (var a = this._groups, u = a.length, f = 0; f < u; ++f)
    for (var d = a[f], v = d.length, p, g = 0; g < v; ++g)
      (p = d[g]) && Ol(p, e, n, g, d, t || Bk(p, n));
  return new gi(a, this._parents, e, n);
}
Ss.prototype.interrupt = qP;
Ss.prototype.transition = jk;
function Hk(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function wl(e, n) {
  if ((t = (e = n ? e.toExponential(n - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var t, a = e.slice(0, t);
  return [
    a.length > 1 ? a[0] + a.slice(2) : a,
    +e.slice(t + 1)
  ];
}
function ua(e) {
  return e = wl(Math.abs(e)), e ? e[1] : NaN;
}
function Wk(e, n) {
  return function(t, a) {
    for (var u = t.length, f = [], d = 0, v = e[0], p = 0; u > 0 && v > 0 && (p + v + 1 > a && (v = Math.max(1, a - p)), f.push(t.substring(u -= v, u + v)), !((p += v + 1) > a)); )
      v = e[d = (d + 1) % e.length];
    return f.reverse().join(n);
  };
}
function Vk(e) {
  return function(n) {
    return n.replace(/[0-9]/g, function(t) {
      return e[+t];
    });
  };
}
var Uk = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function bl(e) {
  if (!(n = Uk.exec(e))) throw new Error("invalid format: " + e);
  var n;
  return new Rd({
    fill: n[1],
    align: n[2],
    sign: n[3],
    symbol: n[4],
    zero: n[5],
    width: n[6],
    comma: n[7],
    precision: n[8] && n[8].slice(1),
    trim: n[9],
    type: n[10]
  });
}
bl.prototype = Rd.prototype;
function Rd(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Rd.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function Gk(e) {
  e: for (var n = e.length, t = 1, a = -1, u; t < n; ++t)
    switch (e[t]) {
      case ".":
        a = u = t;
        break;
      case "0":
        a === 0 && (a = t), u = t;
        break;
      default:
        if (!+e[t]) break e;
        a > 0 && (a = 0);
        break;
    }
  return a > 0 ? e.slice(0, a) + e.slice(u + 1) : e;
}
var bv;
function Kk(e, n) {
  var t = wl(e, n);
  if (!t) return e + "";
  var a = t[0], u = t[1], f = u - (bv = Math.max(-8, Math.min(8, Math.floor(u / 3))) * 3) + 1, d = a.length;
  return f === d ? a : f > d ? a + new Array(f - d + 1).join("0") : f > 0 ? a.slice(0, f) + "." + a.slice(f) : "0." + new Array(1 - f).join("0") + wl(e, Math.max(0, n + f - 1))[0];
}
function vg(e, n) {
  var t = wl(e, n);
  if (!t) return e + "";
  var a = t[0], u = t[1];
  return u < 0 ? "0." + new Array(-u).join("0") + a : a.length > u + 1 ? a.slice(0, u + 1) + "." + a.slice(u + 1) : a + new Array(u - a.length + 2).join("0");
}
const yg = {
  "%": (e, n) => (e * 100).toFixed(n),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: Hk,
  e: (e, n) => e.toExponential(n),
  f: (e, n) => e.toFixed(n),
  g: (e, n) => e.toPrecision(n),
  o: (e) => Math.round(e).toString(8),
  p: (e, n) => vg(e * 100, n),
  r: vg,
  s: Kk,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function wg(e) {
  return e;
}
var bg = Array.prototype.map, _g = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function Xk(e) {
  var n = e.grouping === void 0 || e.thousands === void 0 ? wg : Wk(bg.call(e.grouping, Number), e.thousands + ""), t = e.currency === void 0 ? "" : e.currency[0] + "", a = e.currency === void 0 ? "" : e.currency[1] + "", u = e.decimal === void 0 ? "." : e.decimal + "", f = e.numerals === void 0 ? wg : Vk(bg.call(e.numerals, String)), d = e.percent === void 0 ? "%" : e.percent + "", v = e.minus === void 0 ? "−" : e.minus + "", p = e.nan === void 0 ? "NaN" : e.nan + "";
  function g(w) {
    w = bl(w);
    var m = w.fill, x = w.align, s = w.sign, $ = w.symbol, E = w.zero, A = w.width, I = w.comma, F = w.precision, k = w.trim, j = w.type;
    j === "n" ? (I = !0, j = "g") : yg[j] || (F === void 0 && (F = 12), k = !0, j = "g"), (E || m === "0" && x === "=") && (E = !0, m = "0", x = "=");
    var U = $ === "$" ? t : $ === "#" && /[boxX]/.test(j) ? "0" + j.toLowerCase() : "", ne = $ === "$" ? a : /[%p]/.test(j) ? d : "", Se = yg[j], Ce = /[defgprs%]/.test(j);
    F = F === void 0 ? 6 : /[gprs]/.test(j) ? Math.max(1, Math.min(21, F)) : Math.max(0, Math.min(20, F));
    function Ee(Ae) {
      var We = U, Fe = ne, J, _e, oe;
      if (j === "c")
        Fe = Se(Ae) + Fe, Ae = "";
      else {
        Ae = +Ae;
        var pe = Ae < 0 || 1 / Ae < 0;
        if (Ae = isNaN(Ae) ? p : Se(Math.abs(Ae), F), k && (Ae = Gk(Ae)), pe && +Ae == 0 && s !== "+" && (pe = !1), We = (pe ? s === "(" ? s : v : s === "-" || s === "(" ? "" : s) + We, Fe = (j === "s" ? _g[8 + bv / 3] : "") + Fe + (pe && s === "(" ? ")" : ""), Ce) {
          for (J = -1, _e = Ae.length; ++J < _e; )
            if (oe = Ae.charCodeAt(J), 48 > oe || oe > 57) {
              Fe = (oe === 46 ? u + Ae.slice(J + 1) : Ae.slice(J)) + Fe, Ae = Ae.slice(0, J);
              break;
            }
        }
      }
      I && !E && (Ae = n(Ae, 1 / 0));
      var ke = We.length + Ae.length + Fe.length, Ne = ke < A ? new Array(A - ke + 1).join(m) : "";
      switch (I && E && (Ae = n(Ne + Ae, Ne.length ? A - Fe.length : 1 / 0), Ne = ""), x) {
        case "<":
          Ae = We + Ae + Fe + Ne;
          break;
        case "=":
          Ae = We + Ne + Ae + Fe;
          break;
        case "^":
          Ae = Ne.slice(0, ke = Ne.length >> 1) + We + Ae + Fe + Ne.slice(ke);
          break;
        default:
          Ae = Ne + We + Ae + Fe;
          break;
      }
      return f(Ae);
    }
    return Ee.toString = function() {
      return w + "";
    }, Ee;
  }
  function b(w, m) {
    var x = g((w = bl(w), w.type = "f", w)), s = Math.max(-8, Math.min(8, Math.floor(ua(m) / 3))) * 3, $ = Math.pow(10, -s), E = _g[8 + s / 3];
    return function(A) {
      return x($ * A) + E;
    };
  }
  return {
    format: g,
    formatPrefix: b
  };
}
var Hu, _v, xv;
Yk({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function Yk(e) {
  return Hu = Xk(e), _v = Hu.format, xv = Hu.formatPrefix, Hu;
}
function Qk(e) {
  return Math.max(0, -ua(Math.abs(e)));
}
function Jk(e, n) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(ua(n) / 3))) * 3 - ua(Math.abs(e)));
}
function Zk(e, n) {
  return e = Math.abs(e), n = Math.abs(n) - e, Math.max(0, ua(n) - ua(e)) + 1;
}
function eN(e, n) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(n).domain(e);
      break;
  }
  return this;
}
function tN(e) {
  return function() {
    return e;
  };
}
function nN(e) {
  return +e;
}
var xg = [0, 1];
function Jo(e) {
  return e;
}
function Cf(e, n) {
  return (n -= e = +e) ? function(t) {
    return (t - e) / n;
  } : tN(isNaN(n) ? NaN : 0.5);
}
function rN(e, n) {
  var t;
  return e > n && (t = e, e = n, n = t), function(a) {
    return Math.max(e, Math.min(n, a));
  };
}
function iN(e, n, t) {
  var a = e[0], u = e[1], f = n[0], d = n[1];
  return u < a ? (a = Cf(u, a), f = t(d, f)) : (a = Cf(a, u), f = t(f, d)), function(v) {
    return f(a(v));
  };
}
function oN(e, n, t) {
  var a = Math.min(e.length, n.length) - 1, u = new Array(a), f = new Array(a), d = -1;
  for (e[a] < e[0] && (e = e.slice().reverse(), n = n.slice().reverse()); ++d < a; )
    u[d] = Cf(e[d], e[d + 1]), f[d] = t(n[d], n[d + 1]);
  return function(v) {
    var p = uA(e, v, 1, a) - 1;
    return f[p](u[p](v));
  };
}
function aN(e, n) {
  return n.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function sN() {
  var e = xg, n = xg, t = kd, a, u, f, d = Jo, v, p, g;
  function b() {
    var m = Math.min(e.length, n.length);
    return d !== Jo && (d = rN(e[0], e[m - 1])), v = m > 2 ? oN : iN, p = g = null, w;
  }
  function w(m) {
    return m == null || isNaN(m = +m) ? f : (p || (p = v(e.map(a), n, t)))(a(d(m)));
  }
  return w.invert = function(m) {
    return d(u((g || (g = v(n, e.map(a), xr)))(m)));
  }, w.domain = function(m) {
    return arguments.length ? (e = Array.from(m, nN), b()) : e.slice();
  }, w.range = function(m) {
    return arguments.length ? (n = Array.from(m), b()) : n.slice();
  }, w.rangeRound = function(m) {
    return n = Array.from(m), t = SP, b();
  }, w.clamp = function(m) {
    return arguments.length ? (d = m ? !0 : Jo, b()) : d !== Jo;
  }, w.interpolate = function(m) {
    return arguments.length ? (t = m, b()) : t;
  }, w.unknown = function(m) {
    return arguments.length ? (f = m, w) : f;
  }, function(m, x) {
    return a = m, u = x, b();
  };
}
function uN() {
  return sN()(Jo, Jo);
}
function lN(e, n, t, a) {
  var u = hA(e, n, t), f;
  switch (a = bl(a ?? ",f"), a.type) {
    case "s": {
      var d = Math.max(Math.abs(e), Math.abs(n));
      return a.precision == null && !isNaN(f = Jk(u, d)) && (a.precision = f), xv(a, d);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      a.precision == null && !isNaN(f = Zk(u, Math.max(Math.abs(e), Math.abs(n)))) && (a.precision = f - (a.type === "e"));
      break;
    }
    case "f":
    case "%": {
      a.precision == null && !isNaN(f = Qk(u)) && (a.precision = f - (a.type === "%") * 2);
      break;
    }
  }
  return _v(a);
}
function cN(e) {
  var n = e.domain;
  return e.ticks = function(t) {
    var a = n();
    return dA(a[0], a[a.length - 1], t ?? 10);
  }, e.tickFormat = function(t, a) {
    var u = n();
    return lN(u[0], u[u.length - 1], t ?? 10, a);
  }, e.nice = function(t) {
    t == null && (t = 10);
    var a = n(), u = 0, f = a.length - 1, d = a[u], v = a[f], p, g, b = 10;
    for (v < d && (g = d, d = v, v = g, g = u, u = f, f = g); b-- > 0; ) {
      if (g = mf(d, v, t), g === p)
        return a[u] = d, a[f] = v, n(a);
      if (g > 0)
        d = Math.floor(d / g) * g, v = Math.ceil(v / g) * g;
      else if (g < 0)
        d = Math.ceil(d * g) / g, v = Math.floor(v * g) / g;
      else
        break;
      p = g;
    }
    return e;
  }, e;
}
function _o() {
  var e = uN();
  return e.copy = function() {
    return aN(e, _o());
  }, eN.apply(e, arguments), cN(e);
}
const Wu = (e) => () => e;
function fN(e, {
  sourceEvent: n,
  target: t,
  transform: a,
  dispatch: u
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: n, enumerable: !0, configurable: !0 },
    target: { value: t, enumerable: !0, configurable: !0 },
    transform: { value: a, enumerable: !0, configurable: !0 },
    _: { value: u }
  });
}
function fi(e, n, t) {
  this.k = e, this.x = n, this.y = t;
}
fi.prototype = {
  constructor: fi,
  scale: function(e) {
    return e === 1 ? this : new fi(this.k * e, this.x, this.y);
  },
  translate: function(e, n) {
    return e === 0 & n === 0 ? this : new fi(this.k, this.x + this.k * e, this.y + this.k * n);
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
var Md = new fi(1, 0, 0);
Yo.prototype = fi.prototype;
function Yo(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return Md;
  return e.__zoom;
}
function ef(e) {
  e.stopImmediatePropagation();
}
function Ya(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function dN(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function hN() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Sg() {
  return this.__zoom || Md;
}
function pN(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function gN() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function mN(e, n, t) {
  var a = e.invertX(n[0][0]) - t[0][0], u = e.invertX(n[1][0]) - t[1][0], f = e.invertY(n[0][1]) - t[0][1], d = e.invertY(n[1][1]) - t[1][1];
  return e.translate(
    u > a ? (a + u) / 2 : Math.min(0, a) || Math.max(0, u),
    d > f ? (f + d) / 2 : Math.min(0, f) || Math.max(0, d)
  );
}
function vN() {
  var e = dN, n = hN, t = mN, a = pN, u = gN, f = [0, 1 / 0], d = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], v = 250, p = NP, g = Pl("start", "zoom", "end"), b, w, m, x = 500, s = 150, $ = 0, E = 10;
  function A(J) {
    J.property("__zoom", Sg).on("wheel.zoom", Se, { passive: !1 }).on("mousedown.zoom", Ce).on("dblclick.zoom", Ee).filter(u).on("touchstart.zoom", Ae).on("touchmove.zoom", We).on("touchend.zoom touchcancel.zoom", Fe).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  A.transform = function(J, _e, oe, pe) {
    var ke = J.selection ? J.selection() : J;
    ke.property("__zoom", Sg), J !== ke ? j(J, _e, oe, pe) : ke.interrupt().each(function() {
      U(this, arguments).event(pe).start().zoom(null, typeof _e == "function" ? _e.apply(this, arguments) : _e).end();
    });
  }, A.scaleBy = function(J, _e, oe, pe) {
    A.scaleTo(J, function() {
      var ke = this.__zoom.k, Ne = typeof _e == "function" ? _e.apply(this, arguments) : _e;
      return ke * Ne;
    }, oe, pe);
  }, A.scaleTo = function(J, _e, oe, pe) {
    A.transform(J, function() {
      var ke = n.apply(this, arguments), Ne = this.__zoom, ae = oe == null ? k(ke) : typeof oe == "function" ? oe.apply(this, arguments) : oe, R = Ne.invert(ae), te = typeof _e == "function" ? _e.apply(this, arguments) : _e;
      return t(F(I(Ne, te), ae, R), ke, d);
    }, oe, pe);
  }, A.translateBy = function(J, _e, oe, pe) {
    A.transform(J, function() {
      return t(this.__zoom.translate(
        typeof _e == "function" ? _e.apply(this, arguments) : _e,
        typeof oe == "function" ? oe.apply(this, arguments) : oe
      ), n.apply(this, arguments), d);
    }, null, pe);
  }, A.translateTo = function(J, _e, oe, pe, ke) {
    A.transform(J, function() {
      var Ne = n.apply(this, arguments), ae = this.__zoom, R = pe == null ? k(Ne) : typeof pe == "function" ? pe.apply(this, arguments) : pe;
      return t(Md.translate(R[0], R[1]).scale(ae.k).translate(
        typeof _e == "function" ? -_e.apply(this, arguments) : -_e,
        typeof oe == "function" ? -oe.apply(this, arguments) : -oe
      ), Ne, d);
    }, pe, ke);
  };
  function I(J, _e) {
    return _e = Math.max(f[0], Math.min(f[1], _e)), _e === J.k ? J : new fi(_e, J.x, J.y);
  }
  function F(J, _e, oe) {
    var pe = _e[0] - oe[0] * J.k, ke = _e[1] - oe[1] * J.k;
    return pe === J.x && ke === J.y ? J : new fi(J.k, pe, ke);
  }
  function k(J) {
    return [(+J[0][0] + +J[1][0]) / 2, (+J[0][1] + +J[1][1]) / 2];
  }
  function j(J, _e, oe, pe) {
    J.on("start.zoom", function() {
      U(this, arguments).event(pe).start();
    }).on("interrupt.zoom end.zoom", function() {
      U(this, arguments).event(pe).end();
    }).tween("zoom", function() {
      var ke = this, Ne = arguments, ae = U(ke, Ne).event(pe), R = n.apply(ke, Ne), te = oe == null ? k(R) : typeof oe == "function" ? oe.apply(ke, Ne) : oe, Y = Math.max(R[1][0] - R[0][0], R[1][1] - R[0][1]), L = ke.__zoom, B = typeof _e == "function" ? _e.apply(ke, Ne) : _e, re = p(L.invert(te).concat(Y / L.k), B.invert(te).concat(Y / B.k));
      return function(xe) {
        if (xe === 1) xe = B;
        else {
          var be = re(xe), Ge = Y / be[2];
          xe = new fi(Ge, te[0] - be[0] * Ge, te[1] - be[1] * Ge);
        }
        ae.zoom(null, xe);
      };
    });
  }
  function U(J, _e, oe) {
    return !oe && J.__zooming || new ne(J, _e);
  }
  function ne(J, _e) {
    this.that = J, this.args = _e, this.active = 0, this.sourceEvent = null, this.extent = n.apply(J, _e), this.taps = 0;
  }
  ne.prototype = {
    event: function(J) {
      return J && (this.sourceEvent = J), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(J, _e) {
      return this.mouse && J !== "mouse" && (this.mouse[1] = _e.invert(this.mouse[0])), this.touch0 && J !== "touch" && (this.touch0[1] = _e.invert(this.touch0[0])), this.touch1 && J !== "touch" && (this.touch1[1] = _e.invert(this.touch1[0])), this.that.__zoom = _e, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(J) {
      var _e = He(this.that).datum();
      g.call(
        J,
        this.that,
        new fN(J, {
          sourceEvent: this.sourceEvent,
          target: A,
          type: J,
          transform: this.that.__zoom,
          dispatch: g
        }),
        _e
      );
    }
  };
  function Se(J, ..._e) {
    if (!e.apply(this, arguments)) return;
    var oe = U(this, _e).event(J), pe = this.__zoom, ke = Math.max(f[0], Math.min(f[1], pe.k * Math.pow(2, a.apply(this, arguments)))), Ne = _r(J);
    if (oe.wheel)
      (oe.mouse[0][0] !== Ne[0] || oe.mouse[0][1] !== Ne[1]) && (oe.mouse[1] = pe.invert(oe.mouse[0] = Ne)), clearTimeout(oe.wheel);
    else {
      if (pe.k === ke) return;
      oe.mouse = [Ne, pe.invert(Ne)], rl(this), oe.start();
    }
    Ya(J), oe.wheel = setTimeout(ae, s), oe.zoom("mouse", t(F(I(pe, ke), oe.mouse[0], oe.mouse[1]), oe.extent, d));
    function ae() {
      oe.wheel = null, oe.end();
    }
  }
  function Ce(J, ..._e) {
    if (m || !e.apply(this, arguments)) return;
    var oe = J.currentTarget, pe = U(this, _e, !0).event(J), ke = He(J.view).on("mousemove.zoom", te, !0).on("mouseup.zoom", Y, !0), Ne = _r(J, oe), ae = J.clientX, R = J.clientY;
    ov(J.view), ef(J), pe.mouse = [Ne, this.__zoom.invert(Ne)], rl(this), pe.start();
    function te(L) {
      if (Ya(L), !pe.moved) {
        var B = L.clientX - ae, re = L.clientY - R;
        pe.moved = B * B + re * re > $;
      }
      pe.event(L).zoom("mouse", t(F(pe.that.__zoom, pe.mouse[0] = _r(L, oe), pe.mouse[1]), pe.extent, d));
    }
    function Y(L) {
      ke.on("mousemove.zoom mouseup.zoom", null), av(L.view, pe.moved), Ya(L), pe.event(L).end();
    }
  }
  function Ee(J, ..._e) {
    if (e.apply(this, arguments)) {
      var oe = this.__zoom, pe = _r(J.changedTouches ? J.changedTouches[0] : J, this), ke = oe.invert(pe), Ne = oe.k * (J.shiftKey ? 0.5 : 2), ae = t(F(I(oe, Ne), pe, ke), n.apply(this, _e), d);
      Ya(J), v > 0 ? He(this).transition().duration(v).call(j, ae, pe, J) : He(this).call(A.transform, ae, pe, J);
    }
  }
  function Ae(J, ..._e) {
    if (e.apply(this, arguments)) {
      var oe = J.touches, pe = oe.length, ke = U(this, _e, J.changedTouches.length === pe).event(J), Ne, ae, R, te;
      for (ef(J), ae = 0; ae < pe; ++ae)
        R = oe[ae], te = _r(R, this), te = [te, this.__zoom.invert(te), R.identifier], ke.touch0 ? !ke.touch1 && ke.touch0[2] !== te[2] && (ke.touch1 = te, ke.taps = 0) : (ke.touch0 = te, Ne = !0, ke.taps = 1 + !!b);
      b && (b = clearTimeout(b)), Ne && (ke.taps < 2 && (w = te[0], b = setTimeout(function() {
        b = null;
      }, x)), rl(this), ke.start());
    }
  }
  function We(J, ..._e) {
    if (this.__zooming) {
      var oe = U(this, _e).event(J), pe = J.changedTouches, ke = pe.length, Ne, ae, R, te;
      for (Ya(J), Ne = 0; Ne < ke; ++Ne)
        ae = pe[Ne], R = _r(ae, this), oe.touch0 && oe.touch0[2] === ae.identifier ? oe.touch0[0] = R : oe.touch1 && oe.touch1[2] === ae.identifier && (oe.touch1[0] = R);
      if (ae = oe.that.__zoom, oe.touch1) {
        var Y = oe.touch0[0], L = oe.touch0[1], B = oe.touch1[0], re = oe.touch1[1], xe = (xe = B[0] - Y[0]) * xe + (xe = B[1] - Y[1]) * xe, be = (be = re[0] - L[0]) * be + (be = re[1] - L[1]) * be;
        ae = I(ae, Math.sqrt(xe / be)), R = [(Y[0] + B[0]) / 2, (Y[1] + B[1]) / 2], te = [(L[0] + re[0]) / 2, (L[1] + re[1]) / 2];
      } else if (oe.touch0) R = oe.touch0[0], te = oe.touch0[1];
      else return;
      oe.zoom("touch", t(F(ae, R, te), oe.extent, d));
    }
  }
  function Fe(J, ..._e) {
    if (this.__zooming) {
      var oe = U(this, _e).event(J), pe = J.changedTouches, ke = pe.length, Ne, ae;
      for (ef(J), m && clearTimeout(m), m = setTimeout(function() {
        m = null;
      }, x), Ne = 0; Ne < ke; ++Ne)
        ae = pe[Ne], oe.touch0 && oe.touch0[2] === ae.identifier ? delete oe.touch0 : oe.touch1 && oe.touch1[2] === ae.identifier && delete oe.touch1;
      if (oe.touch1 && !oe.touch0 && (oe.touch0 = oe.touch1, delete oe.touch1), oe.touch0) oe.touch0[1] = this.__zoom.invert(oe.touch0[0]);
      else if (oe.end(), oe.taps === 2 && (ae = _r(ae, this), Math.hypot(w[0] - ae[0], w[1] - ae[1]) < E)) {
        var R = He(this).on("dblclick.zoom");
        R && R.apply(this, arguments);
      }
    }
  }
  return A.wheelDelta = function(J) {
    return arguments.length ? (a = typeof J == "function" ? J : Wu(+J), A) : a;
  }, A.filter = function(J) {
    return arguments.length ? (e = typeof J == "function" ? J : Wu(!!J), A) : e;
  }, A.touchable = function(J) {
    return arguments.length ? (u = typeof J == "function" ? J : Wu(!!J), A) : u;
  }, A.extent = function(J) {
    return arguments.length ? (n = typeof J == "function" ? J : Wu([[+J[0][0], +J[0][1]], [+J[1][0], +J[1][1]]]), A) : n;
  }, A.scaleExtent = function(J) {
    return arguments.length ? (f[0] = +J[0], f[1] = +J[1], A) : [f[0], f[1]];
  }, A.translateExtent = function(J) {
    return arguments.length ? (d[0][0] = +J[0][0], d[1][0] = +J[1][0], d[0][1] = +J[0][1], d[1][1] = +J[1][1], A) : [[d[0][0], d[0][1]], [d[1][0], d[1][1]]];
  }, A.constrain = function(J) {
    return arguments.length ? (t = J, A) : t;
  }, A.duration = function(J) {
    return arguments.length ? (v = +J, A) : v;
  }, A.interpolate = function(J) {
    return arguments.length ? (p = J, A) : p;
  }, A.on = function() {
    var J = g.on.apply(g, arguments);
    return J === g ? A : J;
  }, A.clickDistance = function(J) {
    return arguments.length ? ($ = (J = +J) * J, A) : Math.sqrt($);
  }, A.tapDistance = function(J) {
    return arguments.length ? (E = +J, A) : E;
  }, A;
}
var Sv = { exports: {} };
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
  (function(n, t) {
    e.exports = n.document ? t(n, !0) : function(a) {
      if (!a.document)
        throw new Error("jQuery requires a window with a document");
      return t(a);
    };
  })(typeof window < "u" ? window : uo, function(n, t) {
    var a = [], u = n.document, f = a.slice, d = a.concat, v = a.push, p = a.indexOf, g = {}, b = g.toString, w = g.hasOwnProperty, m = {}, x = "1.12.4", s = function(o, l) {
      return new s.fn.init(o, l);
    }, $ = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, E = /^-ms-/, A = /-([\da-z])/gi, I = function(o, l) {
      return l.toUpperCase();
    };
    s.fn = s.prototype = {
      // The current version of jQuery being used
      jquery: x,
      constructor: s,
      // Start with an empty selector
      selector: "",
      // The default length of a jQuery object is 0
      length: 0,
      toArray: function() {
        return f.call(this);
      },
      // Get the Nth element in the matched element set OR
      // Get the whole matched element set as a clean array
      get: function(o) {
        return o != null ? (
          // Return just the one element from the set
          o < 0 ? this[o + this.length] : this[o]
        ) : (
          // Return all the elements in a clean array
          f.call(this)
        );
      },
      // Take an array of elements and push it onto the stack
      // (returning the new matched element set)
      pushStack: function(o) {
        var l = s.merge(this.constructor(), o);
        return l.prevObject = this, l.context = this.context, l;
      },
      // Execute a callback for every element in the matched set.
      each: function(o) {
        return s.each(this, o);
      },
      map: function(o) {
        return this.pushStack(s.map(this, function(l, h) {
          return o.call(l, h, l);
        }));
      },
      slice: function() {
        return this.pushStack(f.apply(this, arguments));
      },
      first: function() {
        return this.eq(0);
      },
      last: function() {
        return this.eq(-1);
      },
      eq: function(o) {
        var l = this.length, h = +o + (o < 0 ? l : 0);
        return this.pushStack(h >= 0 && h < l ? [this[h]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      // For internal use only.
      // Behaves like an Array's method, not like a jQuery method.
      push: v,
      sort: a.sort,
      splice: a.splice
    }, s.extend = s.fn.extend = function() {
      var o, l, h, y, C, T, N = arguments[0] || {}, q = 1, V = arguments.length, G = !1;
      for (typeof N == "boolean" && (G = N, N = arguments[q] || {}, q++), typeof N != "object" && !s.isFunction(N) && (N = {}), q === V && (N = this, q--); q < V; q++)
        if ((C = arguments[q]) != null)
          for (y in C)
            o = N[y], h = C[y], N !== h && (G && h && (s.isPlainObject(h) || (l = s.isArray(h))) ? (l ? (l = !1, T = o && s.isArray(o) ? o : []) : T = o && s.isPlainObject(o) ? o : {}, N[y] = s.extend(G, T, h)) : h !== void 0 && (N[y] = h));
      return N;
    }, s.extend({
      // Unique for each copy of jQuery on the page
      expando: "jQuery" + (x + Math.random()).replace(/\D/g, ""),
      // Assume jQuery is ready without the ready module
      isReady: !0,
      error: function(o) {
        throw new Error(o);
      },
      noop: function() {
      },
      // See test/unit/core.js for details concerning isFunction.
      // Since version 1.3, DOM methods and functions like alert
      // aren't supported. They return false on IE (#2968).
      isFunction: function(o) {
        return s.type(o) === "function";
      },
      isArray: Array.isArray || function(o) {
        return s.type(o) === "array";
      },
      isWindow: function(o) {
        return o != null && o == o.window;
      },
      isNumeric: function(o) {
        var l = o && o.toString();
        return !s.isArray(o) && l - parseFloat(l) + 1 >= 0;
      },
      isEmptyObject: function(o) {
        var l;
        for (l in o)
          return !1;
        return !0;
      },
      isPlainObject: function(o) {
        var l;
        if (!o || s.type(o) !== "object" || o.nodeType || s.isWindow(o))
          return !1;
        try {
          if (o.constructor && !w.call(o, "constructor") && !w.call(o.constructor.prototype, "isPrototypeOf"))
            return !1;
        } catch {
          return !1;
        }
        if (!m.ownFirst)
          for (l in o)
            return w.call(o, l);
        for (l in o)
          ;
        return l === void 0 || w.call(o, l);
      },
      type: function(o) {
        return o == null ? o + "" : typeof o == "object" || typeof o == "function" ? g[b.call(o)] || "object" : typeof o;
      },
      // Workarounds based on findings by Jim Driscoll
      // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
      globalEval: function(o) {
        o && s.trim(o) && (n.execScript || function(l) {
          n.eval.call(n, l);
        })(o);
      },
      // Convert dashed to camelCase; used by the css and data modules
      // Microsoft forgot to hump their vendor prefix (#9572)
      camelCase: function(o) {
        return o.replace(E, "ms-").replace(A, I);
      },
      nodeName: function(o, l) {
        return o.nodeName && o.nodeName.toLowerCase() === l.toLowerCase();
      },
      each: function(o, l) {
        var h, y = 0;
        if (F(o))
          for (h = o.length; y < h && l.call(o[y], y, o[y]) !== !1; y++)
            ;
        else
          for (y in o)
            if (l.call(o[y], y, o[y]) === !1)
              break;
        return o;
      },
      // Support: Android<4.1, IE<9
      trim: function(o) {
        return o == null ? "" : (o + "").replace($, "");
      },
      // results is for internal usage only
      makeArray: function(o, l) {
        var h = l || [];
        return o != null && (F(Object(o)) ? s.merge(
          h,
          typeof o == "string" ? [o] : o
        ) : v.call(h, o)), h;
      },
      inArray: function(o, l, h) {
        var y;
        if (l) {
          if (p)
            return p.call(l, o, h);
          for (y = l.length, h = h ? h < 0 ? Math.max(0, y + h) : h : 0; h < y; h++)
            if (h in l && l[h] === o)
              return h;
        }
        return -1;
      },
      merge: function(o, l) {
        for (var h = +l.length, y = 0, C = o.length; y < h; )
          o[C++] = l[y++];
        if (h !== h)
          for (; l[y] !== void 0; )
            o[C++] = l[y++];
        return o.length = C, o;
      },
      grep: function(o, l, h) {
        for (var y, C = [], T = 0, N = o.length, q = !h; T < N; T++)
          y = !l(o[T], T), y !== q && C.push(o[T]);
        return C;
      },
      // arg is for internal usage only
      map: function(o, l, h) {
        var y, C, T = 0, N = [];
        if (F(o))
          for (y = o.length; T < y; T++)
            C = l(o[T], T, h), C != null && N.push(C);
        else
          for (T in o)
            C = l(o[T], T, h), C != null && N.push(C);
        return d.apply([], N);
      },
      // A global GUID counter for objects
      guid: 1,
      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function(o, l) {
        var h, y, C;
        if (typeof l == "string" && (C = o[l], l = o, o = C), !!s.isFunction(o))
          return h = f.call(arguments, 2), y = function() {
            return o.apply(l || this, h.concat(f.call(arguments)));
          }, y.guid = o.guid = o.guid || s.guid++, y;
      },
      now: function() {
        return +/* @__PURE__ */ new Date();
      },
      // jQuery.support is not used in Core but other projects attach their
      // properties to it so it needs to exist.
      support: m
    }), typeof Symbol == "function" && (s.fn[Symbol.iterator] = a[Symbol.iterator]), s.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
      function(o, l) {
        g["[object " + l + "]"] = l.toLowerCase();
      }
    );
    function F(o) {
      var l = !!o && "length" in o && o.length, h = s.type(o);
      return h === "function" || s.isWindow(o) ? !1 : h === "array" || l === 0 || typeof l == "number" && l > 0 && l - 1 in o;
    }
    var k = (
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
      function(o) {
        var l, h, y, C, T, N, q, V, G, Z, me, Pe, ve, nt, Ye, st, on, Wt, Pr, De = "sizzle" + 1 * /* @__PURE__ */ new Date(), tn = o.document, ut = 0, jt = 0, cr = X(), Ro = X(), yn = X(), fr = function(D, H) {
          return D === H && (me = !0), 0;
        }, kr = 1 << 31, dr = {}.hasOwnProperty, It = [], wn = It.pop, Yi = It.push, hr = It.push, Pa = It.slice, Qr = function(D, H) {
          for (var K = 0, le = D.length; K < le; K++)
            if (D[K] === H)
              return K;
          return -1;
        }, ka = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", Ot = "[\\x20\\t\\r\\n\\f]", Jr = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", nu = "\\[" + Ot + "*(" + Jr + ")(?:" + Ot + // Operator (capture 2)
        "*([*^$|!~]?=)" + Ot + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Jr + "))|)" + Ot + "*\\]", Nr = ":(" + Jr + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + nu + ")*)|.*)\\)|)", Xl = new RegExp(Ot + "+", "g"), Mo = new RegExp("^" + Ot + "+|((?:^|[^\\\\])(?:\\\\.)*)" + Ot + "+$", "g"), Na = new RegExp("^" + Ot + "*," + Ot + "*"), ru = new RegExp("^" + Ot + "*([>+~]|" + Ot + ")" + Ot + "*"), Or = new RegExp("=" + Ot + `*([^\\]'"]*?)` + Ot + "*\\]", "g"), Do = new RegExp(Nr), iu = new RegExp("^" + Jr + "$"), Io = {
          ID: new RegExp("^#(" + Jr + ")"),
          CLASS: new RegExp("^\\.(" + Jr + ")"),
          TAG: new RegExp("^(" + Jr + "|[*])"),
          ATTR: new RegExp("^" + nu),
          PSEUDO: new RegExp("^" + Nr),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + Ot + "*(even|odd|(([+-]|)(\\d*)n|)" + Ot + "*(?:([+-]|)" + Ot + "*(\\d+)|))" + Ot + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + ka + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + Ot + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + Ot + "*((?:-\\d)?\\d*)" + Ot + "*\\)|)(?=[^-]|$)", "i")
        }, Yl = /^(?:input|select|textarea|button)$/i, Ai = /^h\d$/i, ln = /^[^{]+\{\s*\[native \w/, ou = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Oa = /[+~]/, Ql = /'|\\/g, pr = new RegExp("\\\\([\\da-f]{1,6}" + Ot + "?|(" + Ot + ")|.)", "ig"), gr = function(D, H, K) {
          var le = "0x" + H - 65536;
          return le !== le || K ? H : le < 0 ? (
            // BMP codepoint
            String.fromCharCode(le + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(le >> 10 | 55296, le & 1023 | 56320)
          );
        }, au = function() {
          Pe();
        };
        try {
          hr.apply(
            It = Pa.call(tn.childNodes),
            tn.childNodes
          ), It[tn.childNodes.length].nodeType;
        } catch {
          hr = {
            apply: It.length ? (
              // Leverage slice if possible
              function(H, K) {
                Yi.apply(H, Pa.call(K));
              }
            ) : (
              // Support: IE<9
              // Otherwise append directly
              function(H, K) {
                for (var le = H.length, ee = 0; H[le++] = K[ee++]; )
                  ;
                H.length = le - 1;
              }
            )
          };
        }
        function Ct(D, H, K, le) {
          var ee, ge, fe, Te, Be, tt, je, Qe, ct = H && H.ownerDocument, Pt = H ? H.nodeType : 9;
          if (K = K || [], typeof D != "string" || !D || Pt !== 1 && Pt !== 9 && Pt !== 11)
            return K;
          if (!le && ((H ? H.ownerDocument || H : tn) !== ve && Pe(H), H = H || ve, Ye)) {
            if (Pt !== 11 && (tt = ou.exec(D)))
              if (ee = tt[1]) {
                if (Pt === 9)
                  if (fe = H.getElementById(ee)) {
                    if (fe.id === ee)
                      return K.push(fe), K;
                  } else
                    return K;
                else if (ct && (fe = ct.getElementById(ee)) && Pr(H, fe) && fe.id === ee)
                  return K.push(fe), K;
              } else {
                if (tt[2])
                  return hr.apply(K, H.getElementsByTagName(D)), K;
                if ((ee = tt[3]) && h.getElementsByClassName && H.getElementsByClassName)
                  return hr.apply(K, H.getElementsByClassName(ee)), K;
              }
            if (h.qsa && !yn[D + " "] && (!st || !st.test(D))) {
              if (Pt !== 1)
                ct = H, Qe = D;
              else if (H.nodeName.toLowerCase() !== "object") {
                for ((Te = H.getAttribute("id")) ? Te = Te.replace(Ql, "\\$&") : H.setAttribute("id", Te = De), je = N(D), ge = je.length, Be = iu.test(Te) ? "#" + Te : "[id='" + Te + "']"; ge--; )
                  je[ge] = Be + " " + cn(je[ge]);
                Qe = je.join(","), ct = Oa.test(D) && Qi(H.parentNode) || H;
              }
              if (Qe)
                try {
                  return hr.apply(
                    K,
                    ct.querySelectorAll(Qe)
                  ), K;
                } catch {
                } finally {
                  Te === De && H.removeAttribute("id");
                }
            }
          }
          return V(D.replace(Mo, "$1"), H, K, le);
        }
        function X() {
          var D = [];
          function H(K, le) {
            return D.push(K + " ") > y.cacheLength && delete H[D.shift()], H[K + " "] = le;
          }
          return H;
        }
        function se(D) {
          return D[De] = !0, D;
        }
        function ie(D) {
          var H = ve.createElement("div");
          try {
            return !!D(H);
          } catch {
            return !1;
          } finally {
            H.parentNode && H.parentNode.removeChild(H), H = null;
          }
        }
        function Re(D, H) {
          for (var K = D.split("|"), le = K.length; le--; )
            y.attrHandle[K[le]] = H;
        }
        function rt(D, H) {
          var K = H && D, le = K && D.nodeType === 1 && H.nodeType === 1 && (~H.sourceIndex || kr) - (~D.sourceIndex || kr);
          if (le)
            return le;
          if (K) {
            for (; K = K.nextSibling; )
              if (K === H)
                return -1;
          }
          return D ? 1 : -1;
        }
        function At(D) {
          return function(H) {
            var K = H.nodeName.toLowerCase();
            return K === "input" && H.type === D;
          };
        }
        function Xt(D) {
          return function(H) {
            var K = H.nodeName.toLowerCase();
            return (K === "input" || K === "button") && H.type === D;
          };
        }
        function St(D) {
          return se(function(H) {
            return H = +H, se(function(K, le) {
              for (var ee, ge = D([], K.length, H), fe = ge.length; fe--; )
                K[ee = ge[fe]] && (K[ee] = !(le[ee] = K[ee]));
            });
          });
        }
        function Qi(D) {
          return D && typeof D.getElementsByTagName < "u" && D;
        }
        h = Ct.support = {}, T = Ct.isXML = function(D) {
          var H = D && (D.ownerDocument || D).documentElement;
          return H ? H.nodeName !== "HTML" : !1;
        }, Pe = Ct.setDocument = function(D) {
          var H, K, le = D ? D.ownerDocument || D : tn;
          return le === ve || le.nodeType !== 9 || !le.documentElement || (ve = le, nt = ve.documentElement, Ye = !T(ve), (K = ve.defaultView) && K.top !== K && (K.addEventListener ? K.addEventListener("unload", au, !1) : K.attachEvent && K.attachEvent("onunload", au)), h.attributes = ie(function(ee) {
            return ee.className = "i", !ee.getAttribute("className");
          }), h.getElementsByTagName = ie(function(ee) {
            return ee.appendChild(ve.createComment("")), !ee.getElementsByTagName("*").length;
          }), h.getElementsByClassName = ln.test(ve.getElementsByClassName), h.getById = ie(function(ee) {
            return nt.appendChild(ee).id = De, !ve.getElementsByName || !ve.getElementsByName(De).length;
          }), h.getById ? (y.find.ID = function(ee, ge) {
            if (typeof ge.getElementById < "u" && Ye) {
              var fe = ge.getElementById(ee);
              return fe ? [fe] : [];
            }
          }, y.filter.ID = function(ee) {
            var ge = ee.replace(pr, gr);
            return function(fe) {
              return fe.getAttribute("id") === ge;
            };
          }) : (delete y.find.ID, y.filter.ID = function(ee) {
            var ge = ee.replace(pr, gr);
            return function(fe) {
              var Te = typeof fe.getAttributeNode < "u" && fe.getAttributeNode("id");
              return Te && Te.value === ge;
            };
          }), y.find.TAG = h.getElementsByTagName ? function(ee, ge) {
            if (typeof ge.getElementsByTagName < "u")
              return ge.getElementsByTagName(ee);
            if (h.qsa)
              return ge.querySelectorAll(ee);
          } : function(ee, ge) {
            var fe, Te = [], Be = 0, tt = ge.getElementsByTagName(ee);
            if (ee === "*") {
              for (; fe = tt[Be++]; )
                fe.nodeType === 1 && Te.push(fe);
              return Te;
            }
            return tt;
          }, y.find.CLASS = h.getElementsByClassName && function(ee, ge) {
            if (typeof ge.getElementsByClassName < "u" && Ye)
              return ge.getElementsByClassName(ee);
          }, on = [], st = [], (h.qsa = ln.test(ve.querySelectorAll)) && (ie(function(ee) {
            nt.appendChild(ee).innerHTML = "<a id='" + De + "'></a><select id='" + De + "-\r\\' msallowcapture=''><option selected=''></option></select>", ee.querySelectorAll("[msallowcapture^='']").length && st.push("[*^$]=" + Ot + `*(?:''|"")`), ee.querySelectorAll("[selected]").length || st.push("\\[" + Ot + "*(?:value|" + ka + ")"), ee.querySelectorAll("[id~=" + De + "-]").length || st.push("~="), ee.querySelectorAll(":checked").length || st.push(":checked"), ee.querySelectorAll("a#" + De + "+*").length || st.push(".#.+[+~]");
          }), ie(function(ee) {
            var ge = ve.createElement("input");
            ge.setAttribute("type", "hidden"), ee.appendChild(ge).setAttribute("name", "D"), ee.querySelectorAll("[name=d]").length && st.push("name" + Ot + "*[*^$|!~]?="), ee.querySelectorAll(":enabled").length || st.push(":enabled", ":disabled"), ee.querySelectorAll("*,:x"), st.push(",.*:");
          })), (h.matchesSelector = ln.test(Wt = nt.matches || nt.webkitMatchesSelector || nt.mozMatchesSelector || nt.oMatchesSelector || nt.msMatchesSelector)) && ie(function(ee) {
            h.disconnectedMatch = Wt.call(ee, "div"), Wt.call(ee, "[s!='']:x"), on.push("!=", Nr);
          }), st = st.length && new RegExp(st.join("|")), on = on.length && new RegExp(on.join("|")), H = ln.test(nt.compareDocumentPosition), Pr = H || ln.test(nt.contains) ? function(ee, ge) {
            var fe = ee.nodeType === 9 ? ee.documentElement : ee, Te = ge && ge.parentNode;
            return ee === Te || !!(Te && Te.nodeType === 1 && (fe.contains ? fe.contains(Te) : ee.compareDocumentPosition && ee.compareDocumentPosition(Te) & 16));
          } : function(ee, ge) {
            if (ge) {
              for (; ge = ge.parentNode; )
                if (ge === ee)
                  return !0;
            }
            return !1;
          }, fr = H ? function(ee, ge) {
            if (ee === ge)
              return me = !0, 0;
            var fe = !ee.compareDocumentPosition - !ge.compareDocumentPosition;
            return fe || (fe = (ee.ownerDocument || ee) === (ge.ownerDocument || ge) ? ee.compareDocumentPosition(ge) : (
              // Otherwise we know they are disconnected
              1
            ), fe & 1 || !h.sortDetached && ge.compareDocumentPosition(ee) === fe ? ee === ve || ee.ownerDocument === tn && Pr(tn, ee) ? -1 : ge === ve || ge.ownerDocument === tn && Pr(tn, ge) ? 1 : Z ? Qr(Z, ee) - Qr(Z, ge) : 0 : fe & 4 ? -1 : 1);
          } : function(ee, ge) {
            if (ee === ge)
              return me = !0, 0;
            var fe, Te = 0, Be = ee.parentNode, tt = ge.parentNode, je = [ee], Qe = [ge];
            if (!Be || !tt)
              return ee === ve ? -1 : ge === ve ? 1 : Be ? -1 : tt ? 1 : Z ? Qr(Z, ee) - Qr(Z, ge) : 0;
            if (Be === tt)
              return rt(ee, ge);
            for (fe = ee; fe = fe.parentNode; )
              je.unshift(fe);
            for (fe = ge; fe = fe.parentNode; )
              Qe.unshift(fe);
            for (; je[Te] === Qe[Te]; )
              Te++;
            return Te ? (
              // Do a sibling check if the nodes have a common ancestor
              rt(je[Te], Qe[Te])
            ) : (
              // Otherwise nodes in our document sort first
              je[Te] === tn ? -1 : Qe[Te] === tn ? 1 : 0
            );
          }), ve;
        }, Ct.matches = function(D, H) {
          return Ct(D, null, null, H);
        }, Ct.matchesSelector = function(D, H) {
          if ((D.ownerDocument || D) !== ve && Pe(D), H = H.replace(Or, "='$1']"), h.matchesSelector && Ye && !yn[H + " "] && (!on || !on.test(H)) && (!st || !st.test(H)))
            try {
              var K = Wt.call(D, H);
              if (K || h.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              D.document && D.document.nodeType !== 11)
                return K;
            } catch {
            }
          return Ct(H, ve, null, [D]).length > 0;
        }, Ct.contains = function(D, H) {
          return (D.ownerDocument || D) !== ve && Pe(D), Pr(D, H);
        }, Ct.attr = function(D, H) {
          (D.ownerDocument || D) !== ve && Pe(D);
          var K = y.attrHandle[H.toLowerCase()], le = K && dr.call(y.attrHandle, H.toLowerCase()) ? K(D, H, !Ye) : void 0;
          return le !== void 0 ? le : h.attributes || !Ye ? D.getAttribute(H) : (le = D.getAttributeNode(H)) && le.specified ? le.value : null;
        }, Ct.error = function(D) {
          throw new Error("Syntax error, unrecognized expression: " + D);
        }, Ct.uniqueSort = function(D) {
          var H, K = [], le = 0, ee = 0;
          if (me = !h.detectDuplicates, Z = !h.sortStable && D.slice(0), D.sort(fr), me) {
            for (; H = D[ee++]; )
              H === D[ee] && (le = K.push(ee));
            for (; le--; )
              D.splice(K[le], 1);
          }
          return Z = null, D;
        }, C = Ct.getText = function(D) {
          var H, K = "", le = 0, ee = D.nodeType;
          if (ee) {
            if (ee === 1 || ee === 9 || ee === 11) {
              if (typeof D.textContent == "string")
                return D.textContent;
              for (D = D.firstChild; D; D = D.nextSibling)
                K += C(D);
            } else if (ee === 3 || ee === 4)
              return D.nodeValue;
          } else for (; H = D[le++]; )
            K += C(H);
          return K;
        }, y = Ct.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: se,
          match: Io,
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
              return D[1] = D[1].replace(pr, gr), D[3] = (D[3] || D[4] || D[5] || "").replace(pr, gr), D[2] === "~=" && (D[3] = " " + D[3] + " "), D.slice(0, 4);
            },
            CHILD: function(D) {
              return D[1] = D[1].toLowerCase(), D[1].slice(0, 3) === "nth" ? (D[3] || Ct.error(D[0]), D[4] = +(D[4] ? D[5] + (D[6] || 1) : 2 * (D[3] === "even" || D[3] === "odd")), D[5] = +(D[7] + D[8] || D[3] === "odd")) : D[3] && Ct.error(D[0]), D;
            },
            PSEUDO: function(D) {
              var H, K = !D[6] && D[2];
              return Io.CHILD.test(D[0]) ? null : (D[3] ? D[2] = D[4] || D[5] || "" : K && Do.test(K) && // Get excess from tokenize (recursively)
              (H = N(K, !0)) && // advance to the next closing parenthesis
              (H = K.indexOf(")", K.length - H) - K.length) && (D[0] = D[0].slice(0, H), D[2] = K.slice(0, H)), D.slice(0, 3));
            }
          },
          filter: {
            TAG: function(D) {
              var H = D.replace(pr, gr).toLowerCase();
              return D === "*" ? function() {
                return !0;
              } : function(K) {
                return K.nodeName && K.nodeName.toLowerCase() === H;
              };
            },
            CLASS: function(D) {
              var H = cr[D + " "];
              return H || (H = new RegExp("(^|" + Ot + ")" + D + "(" + Ot + "|$)")) && cr(D, function(K) {
                return H.test(typeof K.className == "string" && K.className || typeof K.getAttribute < "u" && K.getAttribute("class") || "");
              });
            },
            ATTR: function(D, H, K) {
              return function(le) {
                var ee = Ct.attr(le, D);
                return ee == null ? H === "!=" : H ? (ee += "", H === "=" ? ee === K : H === "!=" ? ee !== K : H === "^=" ? K && ee.indexOf(K) === 0 : H === "*=" ? K && ee.indexOf(K) > -1 : H === "$=" ? K && ee.slice(-K.length) === K : H === "~=" ? (" " + ee.replace(Xl, " ") + " ").indexOf(K) > -1 : H === "|=" ? ee === K || ee.slice(0, K.length + 1) === K + "-" : !1) : !0;
              };
            },
            CHILD: function(D, H, K, le, ee) {
              var ge = D.slice(0, 3) !== "nth", fe = D.slice(-4) !== "last", Te = H === "of-type";
              return le === 1 && ee === 0 ? (
                // Shortcut for :nth-*(n)
                function(Be) {
                  return !!Be.parentNode;
                }
              ) : function(Be, tt, je) {
                var Qe, ct, Pt, Ue, qt, Yt, Cn = ge !== fe ? "nextSibling" : "previousSibling", Bt = Be.parentNode, Ji = Te && Be.nodeName.toLowerCase(), Lr = !je && !Te, an = !1;
                if (Bt) {
                  if (ge) {
                    for (; Cn; ) {
                      for (Ue = Be; Ue = Ue[Cn]; )
                        if (Te ? Ue.nodeName.toLowerCase() === Ji : Ue.nodeType === 1)
                          return !1;
                      Yt = Cn = D === "only" && !Yt && "nextSibling";
                    }
                    return !0;
                  }
                  if (Yt = [fe ? Bt.firstChild : Bt.lastChild], fe && Lr) {
                    for (Ue = Bt, Pt = Ue[De] || (Ue[De] = {}), ct = Pt[Ue.uniqueID] || (Pt[Ue.uniqueID] = {}), Qe = ct[D] || [], qt = Qe[0] === ut && Qe[1], an = qt && Qe[2], Ue = qt && Bt.childNodes[qt]; Ue = ++qt && Ue && Ue[Cn] || // Fallback to seeking `elem` from the start
                    (an = qt = 0) || Yt.pop(); )
                      if (Ue.nodeType === 1 && ++an && Ue === Be) {
                        ct[D] = [ut, qt, an];
                        break;
                      }
                  } else if (Lr && (Ue = Be, Pt = Ue[De] || (Ue[De] = {}), ct = Pt[Ue.uniqueID] || (Pt[Ue.uniqueID] = {}), Qe = ct[D] || [], qt = Qe[0] === ut && Qe[1], an = qt), an === !1)
                    for (; (Ue = ++qt && Ue && Ue[Cn] || (an = qt = 0) || Yt.pop()) && !((Te ? Ue.nodeName.toLowerCase() === Ji : Ue.nodeType === 1) && ++an && (Lr && (Pt = Ue[De] || (Ue[De] = {}), ct = Pt[Ue.uniqueID] || (Pt[Ue.uniqueID] = {}), ct[D] = [ut, an]), Ue === Be)); )
                      ;
                  return an -= ee, an === le || an % le === 0 && an / le >= 0;
                }
              };
            },
            PSEUDO: function(D, H) {
              var K, le = y.pseudos[D] || y.setFilters[D.toLowerCase()] || Ct.error("unsupported pseudo: " + D);
              return le[De] ? le(H) : le.length > 1 ? (K = [D, D, "", H], y.setFilters.hasOwnProperty(D.toLowerCase()) ? se(function(ee, ge) {
                for (var fe, Te = le(ee, H), Be = Te.length; Be--; )
                  fe = Qr(ee, Te[Be]), ee[fe] = !(ge[fe] = Te[Be]);
              }) : function(ee) {
                return le(ee, 0, K);
              }) : le;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: se(function(D) {
              var H = [], K = [], le = q(D.replace(Mo, "$1"));
              return le[De] ? se(function(ee, ge, fe, Te) {
                for (var Be, tt = le(ee, null, Te, []), je = ee.length; je--; )
                  (Be = tt[je]) && (ee[je] = !(ge[je] = Be));
              }) : function(ee, ge, fe) {
                return H[0] = ee, le(H, null, fe, K), H[0] = null, !K.pop();
              };
            }),
            has: se(function(D) {
              return function(H) {
                return Ct(D, H).length > 0;
              };
            }),
            contains: se(function(D) {
              return D = D.replace(pr, gr), function(H) {
                return (H.textContent || H.innerText || C(H)).indexOf(D) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            lang: se(function(D) {
              return iu.test(D || "") || Ct.error("unsupported lang: " + D), D = D.replace(pr, gr).toLowerCase(), function(H) {
                var K;
                do
                  if (K = Ye ? H.lang : H.getAttribute("xml:lang") || H.getAttribute("lang"))
                    return K = K.toLowerCase(), K === D || K.indexOf(D + "-") === 0;
                while ((H = H.parentNode) && H.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(D) {
              var H = o.location && o.location.hash;
              return H && H.slice(1) === D.id;
            },
            root: function(D) {
              return D === nt;
            },
            focus: function(D) {
              return D === ve.activeElement && (!ve.hasFocus || ve.hasFocus()) && !!(D.type || D.href || ~D.tabIndex);
            },
            // Boolean properties
            enabled: function(D) {
              return D.disabled === !1;
            },
            disabled: function(D) {
              return D.disabled === !0;
            },
            checked: function(D) {
              var H = D.nodeName.toLowerCase();
              return H === "input" && !!D.checked || H === "option" && !!D.selected;
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
              return !y.pseudos.empty(D);
            },
            // Element/input types
            header: function(D) {
              return Ai.test(D.nodeName);
            },
            input: function(D) {
              return Yl.test(D.nodeName);
            },
            button: function(D) {
              var H = D.nodeName.toLowerCase();
              return H === "input" && D.type === "button" || H === "button";
            },
            text: function(D) {
              var H;
              return D.nodeName.toLowerCase() === "input" && D.type === "text" && // Support: IE<8
              // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
              ((H = D.getAttribute("type")) == null || H.toLowerCase() === "text");
            },
            // Position-in-collection
            first: St(function() {
              return [0];
            }),
            last: St(function(D, H) {
              return [H - 1];
            }),
            eq: St(function(D, H, K) {
              return [K < 0 ? K + H : K];
            }),
            even: St(function(D, H) {
              for (var K = 0; K < H; K += 2)
                D.push(K);
              return D;
            }),
            odd: St(function(D, H) {
              for (var K = 1; K < H; K += 2)
                D.push(K);
              return D;
            }),
            lt: St(function(D, H, K) {
              for (var le = K < 0 ? K + H : K; --le >= 0; )
                D.push(le);
              return D;
            }),
            gt: St(function(D, H, K) {
              for (var le = K < 0 ? K + H : K; ++le < H; )
                D.push(le);
              return D;
            })
          }
        }, y.pseudos.nth = y.pseudos.eq;
        for (l in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          y.pseudos[l] = At(l);
        for (l in { submit: !0, reset: !0 })
          y.pseudos[l] = Xt(l);
        function su() {
        }
        su.prototype = y.filters = y.pseudos, y.setFilters = new su(), N = Ct.tokenize = function(D, H) {
          var K, le, ee, ge, fe, Te, Be, tt = Ro[D + " "];
          if (tt)
            return H ? 0 : tt.slice(0);
          for (fe = D, Te = [], Be = y.preFilter; fe; ) {
            (!K || (le = Na.exec(fe))) && (le && (fe = fe.slice(le[0].length) || fe), Te.push(ee = [])), K = !1, (le = ru.exec(fe)) && (K = le.shift(), ee.push({
              value: K,
              // Cast descendant combinators to space
              type: le[0].replace(Mo, " ")
            }), fe = fe.slice(K.length));
            for (ge in y.filter)
              (le = Io[ge].exec(fe)) && (!Be[ge] || (le = Be[ge](le))) && (K = le.shift(), ee.push({
                value: K,
                type: ge,
                matches: le
              }), fe = fe.slice(K.length));
            if (!K)
              break;
          }
          return H ? fe.length : fe ? Ct.error(D) : (
            // Cache the tokens
            Ro(D, Te).slice(0)
          );
        };
        function cn(D) {
          for (var H = 0, K = D.length, le = ""; H < K; H++)
            le += D[H].value;
          return le;
        }
        function Ti(D, H, K) {
          var le = H.dir, ee = K && le === "parentNode", ge = jt++;
          return H.first ? (
            // Check against closest ancestor/preceding element
            function(fe, Te, Be) {
              for (; fe = fe[le]; )
                if (fe.nodeType === 1 || ee)
                  return D(fe, Te, Be);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(fe, Te, Be) {
              var tt, je, Qe, ct = [ut, ge];
              if (Be) {
                for (; fe = fe[le]; )
                  if ((fe.nodeType === 1 || ee) && D(fe, Te, Be))
                    return !0;
              } else
                for (; fe = fe[le]; )
                  if (fe.nodeType === 1 || ee) {
                    if (Qe = fe[De] || (fe[De] = {}), je = Qe[fe.uniqueID] || (Qe[fe.uniqueID] = {}), (tt = je[le]) && tt[0] === ut && tt[1] === ge)
                      return ct[2] = tt[2];
                    if (je[le] = ct, ct[2] = D(fe, Te, Be))
                      return !0;
                  }
            }
          );
        }
        function La(D) {
          return D.length > 1 ? function(H, K, le) {
            for (var ee = D.length; ee--; )
              if (!D[ee](H, K, le))
                return !1;
            return !0;
          } : D[0];
        }
        function Pi(D, H, K) {
          for (var le = 0, ee = H.length; le < ee; le++)
            Ct(D, H[le], K);
          return K;
        }
        function Zr(D, H, K, le, ee) {
          for (var ge, fe = [], Te = 0, Be = D.length, tt = H != null; Te < Be; Te++)
            (ge = D[Te]) && (!K || K(ge, le, ee)) && (fe.push(ge), tt && H.push(Te));
          return fe;
        }
        function ki(D, H, K, le, ee, ge) {
          return le && !le[De] && (le = ki(le)), ee && !ee[De] && (ee = ki(ee, ge)), se(function(fe, Te, Be, tt) {
            var je, Qe, ct, Pt = [], Ue = [], qt = Te.length, Yt = fe || Pi(H || "*", Be.nodeType ? [Be] : Be, []), Cn = D && (fe || !H) ? Zr(Yt, Pt, D, Be, tt) : Yt, Bt = K ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              ee || (fe ? D : qt || le) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                Te
              )
            ) : Cn;
            if (K && K(Cn, Bt, Be, tt), le)
              for (je = Zr(Bt, Ue), le(je, [], Be, tt), Qe = je.length; Qe--; )
                (ct = je[Qe]) && (Bt[Ue[Qe]] = !(Cn[Ue[Qe]] = ct));
            if (fe) {
              if (ee || D) {
                if (ee) {
                  for (je = [], Qe = Bt.length; Qe--; )
                    (ct = Bt[Qe]) && je.push(Cn[Qe] = ct);
                  ee(null, Bt = [], je, tt);
                }
                for (Qe = Bt.length; Qe--; )
                  (ct = Bt[Qe]) && (je = ee ? Qr(fe, ct) : Pt[Qe]) > -1 && (fe[je] = !(Te[je] = ct));
              }
            } else
              Bt = Zr(
                Bt === Te ? Bt.splice(qt, Bt.length) : Bt
              ), ee ? ee(null, Te, Bt, tt) : hr.apply(Te, Bt);
          });
        }
        function Tt(D) {
          for (var H, K, le, ee = D.length, ge = y.relative[D[0].type], fe = ge || y.relative[" "], Te = ge ? 1 : 0, Be = Ti(function(Qe) {
            return Qe === H;
          }, fe, !0), tt = Ti(function(Qe) {
            return Qr(H, Qe) > -1;
          }, fe, !0), je = [function(Qe, ct, Pt) {
            var Ue = !ge && (Pt || ct !== G) || ((H = ct).nodeType ? Be(Qe, ct, Pt) : tt(Qe, ct, Pt));
            return H = null, Ue;
          }]; Te < ee; Te++)
            if (K = y.relative[D[Te].type])
              je = [Ti(La(je), K)];
            else {
              if (K = y.filter[D[Te].type].apply(null, D[Te].matches), K[De]) {
                for (le = ++Te; le < ee && !y.relative[D[le].type]; le++)
                  ;
                return ki(
                  Te > 1 && La(je),
                  Te > 1 && cn(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    D.slice(0, Te - 1).concat({ value: D[Te - 2].type === " " ? "*" : "" })
                  ).replace(Mo, "$1"),
                  K,
                  Te < le && Tt(D.slice(Te, le)),
                  le < ee && Tt(D = D.slice(le)),
                  le < ee && cn(D)
                );
              }
              je.push(K);
            }
          return La(je);
        }
        function Jl(D, H) {
          var K = H.length > 0, le = D.length > 0, ee = function(ge, fe, Te, Be, tt) {
            var je, Qe, ct, Pt = 0, Ue = "0", qt = ge && [], Yt = [], Cn = G, Bt = ge || le && y.find.TAG("*", tt), Ji = ut += Cn == null ? 1 : Math.random() || 0.1, Lr = Bt.length;
            for (tt && (G = fe === ve || fe || tt); Ue !== Lr && (je = Bt[Ue]) != null; Ue++) {
              if (le && je) {
                for (Qe = 0, !fe && je.ownerDocument !== ve && (Pe(je), Te = !Ye); ct = D[Qe++]; )
                  if (ct(je, fe || ve, Te)) {
                    Be.push(je);
                    break;
                  }
                tt && (ut = Ji);
              }
              K && ((je = !ct && je) && Pt--, ge && qt.push(je));
            }
            if (Pt += Ue, K && Ue !== Pt) {
              for (Qe = 0; ct = H[Qe++]; )
                ct(qt, Yt, fe, Te);
              if (ge) {
                if (Pt > 0)
                  for (; Ue--; )
                    qt[Ue] || Yt[Ue] || (Yt[Ue] = wn.call(Be));
                Yt = Zr(Yt);
              }
              hr.apply(Be, Yt), tt && !ge && Yt.length > 0 && Pt + H.length > 1 && Ct.uniqueSort(Be);
            }
            return tt && (ut = Ji, G = Cn), qt;
          };
          return K ? se(ee) : ee;
        }
        return q = Ct.compile = function(D, H) {
          var K, le = [], ee = [], ge = yn[D + " "];
          if (!ge) {
            for (H || (H = N(D)), K = H.length; K--; )
              ge = Tt(H[K]), ge[De] ? le.push(ge) : ee.push(ge);
            ge = yn(D, Jl(ee, le)), ge.selector = D;
          }
          return ge;
        }, V = Ct.select = function(D, H, K, le) {
          var ee, ge, fe, Te, Be, tt = typeof D == "function" && D, je = !le && N(D = tt.selector || D);
          if (K = K || [], je.length === 1) {
            if (ge = je[0] = je[0].slice(0), ge.length > 2 && (fe = ge[0]).type === "ID" && h.getById && H.nodeType === 9 && Ye && y.relative[ge[1].type]) {
              if (H = (y.find.ID(fe.matches[0].replace(pr, gr), H) || [])[0], H)
                tt && (H = H.parentNode);
              else return K;
              D = D.slice(ge.shift().value.length);
            }
            for (ee = Io.needsContext.test(D) ? 0 : ge.length; ee-- && (fe = ge[ee], !y.relative[Te = fe.type]); )
              if ((Be = y.find[Te]) && (le = Be(
                fe.matches[0].replace(pr, gr),
                Oa.test(ge[0].type) && Qi(H.parentNode) || H
              ))) {
                if (ge.splice(ee, 1), D = le.length && cn(ge), !D)
                  return hr.apply(K, le), K;
                break;
              }
          }
          return (tt || q(D, je))(
            le,
            H,
            !Ye,
            K,
            !H || Oa.test(D) && Qi(H.parentNode) || H
          ), K;
        }, h.sortStable = De.split("").sort(fr).join("") === De, h.detectDuplicates = !!me, Pe(), h.sortDetached = ie(function(D) {
          return D.compareDocumentPosition(ve.createElement("div")) & 1;
        }), ie(function(D) {
          return D.innerHTML = "<a href='#'></a>", D.firstChild.getAttribute("href") === "#";
        }) || Re("type|href|height|width", function(D, H, K) {
          if (!K)
            return D.getAttribute(H, H.toLowerCase() === "type" ? 1 : 2);
        }), (!h.attributes || !ie(function(D) {
          return D.innerHTML = "<input/>", D.firstChild.setAttribute("value", ""), D.firstChild.getAttribute("value") === "";
        })) && Re("value", function(D, H, K) {
          if (!K && D.nodeName.toLowerCase() === "input")
            return D.defaultValue;
        }), ie(function(D) {
          return D.getAttribute("disabled") == null;
        }) || Re(ka, function(D, H, K) {
          var le;
          if (!K)
            return D[H] === !0 ? H.toLowerCase() : (le = D.getAttributeNode(H)) && le.specified ? le.value : null;
        }), Ct;
      }(n)
    );
    s.find = k, s.expr = k.selectors, s.expr[":"] = s.expr.pseudos, s.uniqueSort = s.unique = k.uniqueSort, s.text = k.getText, s.isXMLDoc = k.isXML, s.contains = k.contains;
    var j = function(o, l, h) {
      for (var y = [], C = h !== void 0; (o = o[l]) && o.nodeType !== 9; )
        if (o.nodeType === 1) {
          if (C && s(o).is(h))
            break;
          y.push(o);
        }
      return y;
    }, U = function(o, l) {
      for (var h = []; o; o = o.nextSibling)
        o.nodeType === 1 && o !== l && h.push(o);
      return h;
    }, ne = s.expr.match.needsContext, Se = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, Ce = /^.[^:#\[\.,]*$/;
    function Ee(o, l, h) {
      if (s.isFunction(l))
        return s.grep(o, function(y, C) {
          return !!l.call(y, C, y) !== h;
        });
      if (l.nodeType)
        return s.grep(o, function(y) {
          return y === l !== h;
        });
      if (typeof l == "string") {
        if (Ce.test(l))
          return s.filter(l, o, h);
        l = s.filter(l, o);
      }
      return s.grep(o, function(y) {
        return s.inArray(y, l) > -1 !== h;
      });
    }
    s.filter = function(o, l, h) {
      var y = l[0];
      return h && (o = ":not(" + o + ")"), l.length === 1 && y.nodeType === 1 ? s.find.matchesSelector(y, o) ? [y] : [] : s.find.matches(o, s.grep(l, function(C) {
        return C.nodeType === 1;
      }));
    }, s.fn.extend({
      find: function(o) {
        var l, h = [], y = this, C = y.length;
        if (typeof o != "string")
          return this.pushStack(s(o).filter(function() {
            for (l = 0; l < C; l++)
              if (s.contains(y[l], this))
                return !0;
          }));
        for (l = 0; l < C; l++)
          s.find(o, y[l], h);
        return h = this.pushStack(C > 1 ? s.unique(h) : h), h.selector = this.selector ? this.selector + " " + o : o, h;
      },
      filter: function(o) {
        return this.pushStack(Ee(this, o || [], !1));
      },
      not: function(o) {
        return this.pushStack(Ee(this, o || [], !0));
      },
      is: function(o) {
        return !!Ee(
          this,
          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof o == "string" && ne.test(o) ? s(o) : o || [],
          !1
        ).length;
      }
    });
    var Ae, We = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, Fe = s.fn.init = function(o, l, h) {
      var y, C;
      if (!o)
        return this;
      if (h = h || Ae, typeof o == "string")
        if (o.charAt(0) === "<" && o.charAt(o.length - 1) === ">" && o.length >= 3 ? y = [null, o, null] : y = We.exec(o), y && (y[1] || !l))
          if (y[1]) {
            if (l = l instanceof s ? l[0] : l, s.merge(this, s.parseHTML(
              y[1],
              l && l.nodeType ? l.ownerDocument || l : u,
              !0
            )), Se.test(y[1]) && s.isPlainObject(l))
              for (y in l)
                s.isFunction(this[y]) ? this[y](l[y]) : this.attr(y, l[y]);
            return this;
          } else {
            if (C = u.getElementById(y[2]), C && C.parentNode) {
              if (C.id !== y[2])
                return Ae.find(o);
              this.length = 1, this[0] = C;
            }
            return this.context = u, this.selector = o, this;
          }
        else return !l || l.jquery ? (l || h).find(o) : this.constructor(l).find(o);
      else {
        if (o.nodeType)
          return this.context = this[0] = o, this.length = 1, this;
        if (s.isFunction(o))
          return typeof h.ready < "u" ? h.ready(o) : (
            // Execute immediately if ready is not present
            o(s)
          );
      }
      return o.selector !== void 0 && (this.selector = o.selector, this.context = o.context), s.makeArray(o, this);
    };
    Fe.prototype = s.fn, Ae = s(u);
    var J = /^(?:parents|prev(?:Until|All))/, _e = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
    s.fn.extend({
      has: function(o) {
        var l, h = s(o, this), y = h.length;
        return this.filter(function() {
          for (l = 0; l < y; l++)
            if (s.contains(this, h[l]))
              return !0;
        });
      },
      closest: function(o, l) {
        for (var h, y = 0, C = this.length, T = [], N = ne.test(o) || typeof o != "string" ? s(o, l || this.context) : 0; y < C; y++)
          for (h = this[y]; h && h !== l; h = h.parentNode)
            if (h.nodeType < 11 && (N ? N.index(h) > -1 : (
              // Don't pass non-elements to Sizzle
              h.nodeType === 1 && s.find.matchesSelector(h, o)
            ))) {
              T.push(h);
              break;
            }
        return this.pushStack(T.length > 1 ? s.uniqueSort(T) : T);
      },
      // Determine the position of an element within
      // the matched set of elements
      index: function(o) {
        return o ? typeof o == "string" ? s.inArray(this[0], s(o)) : s.inArray(
          // If it receives a jQuery object, the first element is used
          o.jquery ? o[0] : o,
          this
        ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      },
      add: function(o, l) {
        return this.pushStack(
          s.uniqueSort(
            s.merge(this.get(), s(o, l))
          )
        );
      },
      addBack: function(o) {
        return this.add(
          o == null ? this.prevObject : this.prevObject.filter(o)
        );
      }
    });
    function oe(o, l) {
      do
        o = o[l];
      while (o && o.nodeType !== 1);
      return o;
    }
    s.each({
      parent: function(o) {
        var l = o.parentNode;
        return l && l.nodeType !== 11 ? l : null;
      },
      parents: function(o) {
        return j(o, "parentNode");
      },
      parentsUntil: function(o, l, h) {
        return j(o, "parentNode", h);
      },
      next: function(o) {
        return oe(o, "nextSibling");
      },
      prev: function(o) {
        return oe(o, "previousSibling");
      },
      nextAll: function(o) {
        return j(o, "nextSibling");
      },
      prevAll: function(o) {
        return j(o, "previousSibling");
      },
      nextUntil: function(o, l, h) {
        return j(o, "nextSibling", h);
      },
      prevUntil: function(o, l, h) {
        return j(o, "previousSibling", h);
      },
      siblings: function(o) {
        return U((o.parentNode || {}).firstChild, o);
      },
      children: function(o) {
        return U(o.firstChild);
      },
      contents: function(o) {
        return s.nodeName(o, "iframe") ? o.contentDocument || o.contentWindow.document : s.merge([], o.childNodes);
      }
    }, function(o, l) {
      s.fn[o] = function(h, y) {
        var C = s.map(this, l, h);
        return o.slice(-5) !== "Until" && (y = h), y && typeof y == "string" && (C = s.filter(y, C)), this.length > 1 && (_e[o] || (C = s.uniqueSort(C)), J.test(o) && (C = C.reverse())), this.pushStack(C);
      };
    });
    var pe = /\S+/g;
    function ke(o) {
      var l = {};
      return s.each(o.match(pe) || [], function(h, y) {
        l[y] = !0;
      }), l;
    }
    s.Callbacks = function(o) {
      o = typeof o == "string" ? ke(o) : s.extend({}, o);
      var l, h, y, C, T = [], N = [], q = -1, V = function() {
        for (C = o.once, y = l = !0; N.length; q = -1)
          for (h = N.shift(); ++q < T.length; )
            T[q].apply(h[0], h[1]) === !1 && o.stopOnFalse && (q = T.length, h = !1);
        o.memory || (h = !1), l = !1, C && (h ? T = [] : T = "");
      }, G = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return T && (h && !l && (q = T.length - 1, N.push(h)), function Z(me) {
            s.each(me, function(Pe, ve) {
              s.isFunction(ve) ? (!o.unique || !G.has(ve)) && T.push(ve) : ve && ve.length && s.type(ve) !== "string" && Z(ve);
            });
          }(arguments), h && !l && V()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return s.each(arguments, function(Z, me) {
            for (var Pe; (Pe = s.inArray(me, T, Pe)) > -1; )
              T.splice(Pe, 1), Pe <= q && q--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(Z) {
          return Z ? s.inArray(Z, T) > -1 : T.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return T && (T = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return C = N = [], T = h = "", this;
        },
        disabled: function() {
          return !T;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return C = !0, h || G.disable(), this;
        },
        locked: function() {
          return !!C;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(Z, me) {
          return C || (me = me || [], me = [Z, me.slice ? me.slice() : me], N.push(me), l || V()), this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          return G.fireWith(this, arguments), this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!y;
        }
      };
      return G;
    }, s.extend({
      Deferred: function(o) {
        var l = [
          // action, add listener, listener list, final state
          ["resolve", "done", s.Callbacks("once memory"), "resolved"],
          ["reject", "fail", s.Callbacks("once memory"), "rejected"],
          ["notify", "progress", s.Callbacks("memory")]
        ], h = "pending", y = {
          state: function() {
            return h;
          },
          always: function() {
            return C.done(arguments).fail(arguments), this;
          },
          then: function() {
            var T = arguments;
            return s.Deferred(function(N) {
              s.each(l, function(q, V) {
                var G = s.isFunction(T[q]) && T[q];
                C[V[1]](function() {
                  var Z = G && G.apply(this, arguments);
                  Z && s.isFunction(Z.promise) ? Z.promise().progress(N.notify).done(N.resolve).fail(N.reject) : N[V[0] + "With"](
                    this === y ? N.promise() : this,
                    G ? [Z] : arguments
                  );
                });
              }), T = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(T) {
            return T != null ? s.extend(T, y) : y;
          }
        }, C = {};
        return y.pipe = y.then, s.each(l, function(T, N) {
          var q = N[2], V = N[3];
          y[N[1]] = q.add, V && q.add(function() {
            h = V;
          }, l[T ^ 1][2].disable, l[2][2].lock), C[N[0]] = function() {
            return C[N[0] + "With"](this === C ? y : this, arguments), this;
          }, C[N[0] + "With"] = q.fireWith;
        }), y.promise(C), o && o.call(C, C), C;
      },
      // Deferred helper
      when: function(o) {
        var l = 0, h = f.call(arguments), y = h.length, C = y !== 1 || o && s.isFunction(o.promise) ? y : 0, T = C === 1 ? o : s.Deferred(), N = function(Z, me, Pe) {
          return function(ve) {
            me[Z] = this, Pe[Z] = arguments.length > 1 ? f.call(arguments) : ve, Pe === q ? T.notifyWith(me, Pe) : --C || T.resolveWith(me, Pe);
          };
        }, q, V, G;
        if (y > 1)
          for (q = new Array(y), V = new Array(y), G = new Array(y); l < y; l++)
            h[l] && s.isFunction(h[l].promise) ? h[l].promise().progress(N(l, V, q)).done(N(l, G, h)).fail(T.reject) : --C;
        return C || T.resolveWith(G, h), T.promise();
      }
    });
    var Ne;
    s.fn.ready = function(o) {
      return s.ready.promise().done(o), this;
    }, s.extend({
      // Is the DOM ready to be used? Set to true once it occurs.
      isReady: !1,
      // A counter to track how many items to wait for before
      // the ready event fires. See #6781
      readyWait: 1,
      // Hold (or release) the ready event
      holdReady: function(o) {
        o ? s.readyWait++ : s.ready(!0);
      },
      // Handle when the DOM is ready
      ready: function(o) {
        (o === !0 ? --s.readyWait : s.isReady) || (s.isReady = !0, !(o !== !0 && --s.readyWait > 0) && (Ne.resolveWith(u, [s]), s.fn.triggerHandler && (s(u).triggerHandler("ready"), s(u).off("ready"))));
      }
    });
    function ae() {
      u.addEventListener ? (u.removeEventListener("DOMContentLoaded", R), n.removeEventListener("load", R)) : (u.detachEvent("onreadystatechange", R), n.detachEvent("onload", R));
    }
    function R() {
      (u.addEventListener || n.event.type === "load" || u.readyState === "complete") && (ae(), s.ready());
    }
    s.ready.promise = function(o) {
      if (!Ne)
        if (Ne = s.Deferred(), u.readyState === "complete" || u.readyState !== "loading" && !u.documentElement.doScroll)
          n.setTimeout(s.ready);
        else if (u.addEventListener)
          u.addEventListener("DOMContentLoaded", R), n.addEventListener("load", R);
        else {
          u.attachEvent("onreadystatechange", R), n.attachEvent("onload", R);
          var l = !1;
          try {
            l = n.frameElement == null && u.documentElement;
          } catch {
          }
          l && l.doScroll && function h() {
            if (!s.isReady) {
              try {
                l.doScroll("left");
              } catch {
                return n.setTimeout(h, 50);
              }
              ae(), s.ready();
            }
          }();
        }
      return Ne.promise(o);
    }, s.ready.promise();
    var te;
    for (te in s(m))
      break;
    m.ownFirst = te === "0", m.inlineBlockNeedsLayout = !1, s(function() {
      var o, l, h, y;
      h = u.getElementsByTagName("body")[0], !(!h || !h.style) && (l = u.createElement("div"), y = u.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", h.appendChild(y).appendChild(l), typeof l.style.zoom < "u" && (l.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", m.inlineBlockNeedsLayout = o = l.offsetWidth === 3, o && (h.style.zoom = 1)), h.removeChild(y));
    }), function() {
      var o = u.createElement("div");
      m.deleteExpando = !0;
      try {
        delete o.test;
      } catch {
        m.deleteExpando = !1;
      }
      o = null;
    }();
    var Y = function(o) {
      var l = s.noData[(o.nodeName + " ").toLowerCase()], h = +o.nodeType || 1;
      return h !== 1 && h !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !l || l !== !0 && o.getAttribute("classid") === l
      );
    }, L = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, B = /([A-Z])/g;
    function re(o, l, h) {
      if (h === void 0 && o.nodeType === 1) {
        var y = "data-" + l.replace(B, "-$1").toLowerCase();
        if (h = o.getAttribute(y), typeof h == "string") {
          try {
            h = h === "true" ? !0 : h === "false" ? !1 : h === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +h + "" === h ? +h : L.test(h) ? s.parseJSON(h) : h
            );
          } catch {
          }
          s.data(o, l, h);
        } else
          h = void 0;
      }
      return h;
    }
    function xe(o) {
      var l;
      for (l in o)
        if (!(l === "data" && s.isEmptyObject(o[l])) && l !== "toJSON")
          return !1;
      return !0;
    }
    function be(o, l, h, y) {
      if (Y(o)) {
        var C, T, N = s.expando, q = o.nodeType, V = q ? s.cache : o, G = q ? o[N] : o[N] && N;
        if (!((!G || !V[G] || !y && !V[G].data) && h === void 0 && typeof l == "string"))
          return G || (q ? G = o[N] = a.pop() || s.guid++ : G = N), V[G] || (V[G] = q ? {} : { toJSON: s.noop }), (typeof l == "object" || typeof l == "function") && (y ? V[G] = s.extend(V[G], l) : V[G].data = s.extend(V[G].data, l)), T = V[G], y || (T.data || (T.data = {}), T = T.data), h !== void 0 && (T[s.camelCase(l)] = h), typeof l == "string" ? (C = T[l], C == null && (C = T[s.camelCase(l)])) : C = T, C;
      }
    }
    function Ge(o, l, h) {
      if (Y(o)) {
        var y, C, T = o.nodeType, N = T ? s.cache : o, q = T ? o[s.expando] : s.expando;
        if (N[q]) {
          if (l && (y = h ? N[q] : N[q].data, y)) {
            for (s.isArray(l) ? l = l.concat(s.map(l, s.camelCase)) : (l in y) ? l = [l] : (l = s.camelCase(l), l in y ? l = [l] : l = l.split(" ")), C = l.length; C--; )
              delete y[l[C]];
            if (h ? !xe(y) : !s.isEmptyObject(y))
              return;
          }
          !h && (delete N[q].data, !xe(N[q])) || (T ? s.cleanData([o], !0) : m.deleteExpando || N != N.window ? delete N[q] : N[q] = void 0);
        }
      }
    }
    s.extend({
      cache: {},
      // The following elements (space-suffixed to avoid Object.prototype collisions)
      // throw uncatchable exceptions if you attempt to set expando properties
      noData: {
        "applet ": !0,
        "embed ": !0,
        // ...but Flash objects (which have this classid) *can* handle expandos
        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      },
      hasData: function(o) {
        return o = o.nodeType ? s.cache[o[s.expando]] : o[s.expando], !!o && !xe(o);
      },
      data: function(o, l, h) {
        return be(o, l, h);
      },
      removeData: function(o, l) {
        return Ge(o, l);
      },
      // For internal use only.
      _data: function(o, l, h) {
        return be(o, l, h, !0);
      },
      _removeData: function(o, l) {
        return Ge(o, l, !0);
      }
    }), s.fn.extend({
      data: function(o, l) {
        var h, y, C, T = this[0], N = T && T.attributes;
        if (o === void 0) {
          if (this.length && (C = s.data(T), T.nodeType === 1 && !s._data(T, "parsedAttrs"))) {
            for (h = N.length; h--; )
              N[h] && (y = N[h].name, y.indexOf("data-") === 0 && (y = s.camelCase(y.slice(5)), re(T, y, C[y])));
            s._data(T, "parsedAttrs", !0);
          }
          return C;
        }
        return typeof o == "object" ? this.each(function() {
          s.data(this, o);
        }) : arguments.length > 1 ? (
          // Sets one value
          this.each(function() {
            s.data(this, o, l);
          })
        ) : (
          // Gets one value
          // Try to fetch any internally stored data first
          T ? re(T, o, s.data(T, o)) : void 0
        );
      },
      removeData: function(o) {
        return this.each(function() {
          s.removeData(this, o);
        });
      }
    }), s.extend({
      queue: function(o, l, h) {
        var y;
        if (o)
          return l = (l || "fx") + "queue", y = s._data(o, l), h && (!y || s.isArray(h) ? y = s._data(o, l, s.makeArray(h)) : y.push(h)), y || [];
      },
      dequeue: function(o, l) {
        l = l || "fx";
        var h = s.queue(o, l), y = h.length, C = h.shift(), T = s._queueHooks(o, l), N = function() {
          s.dequeue(o, l);
        };
        C === "inprogress" && (C = h.shift(), y--), C && (l === "fx" && h.unshift("inprogress"), delete T.stop, C.call(o, N, T)), !y && T && T.empty.fire();
      },
      // not intended for public consumption - generates a queueHooks object,
      // or returns the current one
      _queueHooks: function(o, l) {
        var h = l + "queueHooks";
        return s._data(o, h) || s._data(o, h, {
          empty: s.Callbacks("once memory").add(function() {
            s._removeData(o, l + "queue"), s._removeData(o, h);
          })
        });
      }
    }), s.fn.extend({
      queue: function(o, l) {
        var h = 2;
        return typeof o != "string" && (l = o, o = "fx", h--), arguments.length < h ? s.queue(this[0], o) : l === void 0 ? this : this.each(function() {
          var y = s.queue(this, o, l);
          s._queueHooks(this, o), o === "fx" && y[0] !== "inprogress" && s.dequeue(this, o);
        });
      },
      dequeue: function(o) {
        return this.each(function() {
          s.dequeue(this, o);
        });
      },
      clearQueue: function(o) {
        return this.queue(o || "fx", []);
      },
      // Get a promise resolved when queues of a certain type
      // are emptied (fx is the type by default)
      promise: function(o, l) {
        var h, y = 1, C = s.Deferred(), T = this, N = this.length, q = function() {
          --y || C.resolveWith(T, [T]);
        };
        for (typeof o != "string" && (l = o, o = void 0), o = o || "fx"; N--; )
          h = s._data(T[N], o + "queueHooks"), h && h.empty && (y++, h.empty.add(q));
        return q(), C.promise(l);
      }
    }), function() {
      var o;
      m.shrinkWrapBlocks = function() {
        if (o != null)
          return o;
        o = !1;
        var l, h, y;
        if (h = u.getElementsByTagName("body")[0], !(!h || !h.style))
          return l = u.createElement("div"), y = u.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", h.appendChild(y).appendChild(l), typeof l.style.zoom < "u" && (l.style.cssText = // Support: Firefox<29, Android 2.3
          // Vendor-prefix box-sizing
          "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", l.appendChild(u.createElement("div")).style.width = "5px", o = l.offsetWidth !== 3), h.removeChild(y), o;
      };
    }();
    var et = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, Ke = new RegExp("^(?:([+-])=|)(" + et + ")([a-z%]*)$", "i"), Ie = ["Top", "Right", "Bottom", "Left"], ue = function(o, l) {
      return o = l || o, s.css(o, "display") === "none" || !s.contains(o.ownerDocument, o);
    };
    function we(o, l, h, y) {
      var C, T = 1, N = 20, q = y ? function() {
        return y.cur();
      } : function() {
        return s.css(o, l, "");
      }, V = q(), G = h && h[3] || (s.cssNumber[l] ? "" : "px"), Z = (s.cssNumber[l] || G !== "px" && +V) && Ke.exec(s.css(o, l));
      if (Z && Z[3] !== G) {
        G = G || Z[3], h = h || [], Z = +V || 1;
        do
          T = T || ".5", Z = Z / T, s.style(o, l, Z + G);
        while (T !== (T = q() / V) && T !== 1 && --N);
      }
      return h && (Z = +Z || +V || 0, C = h[1] ? Z + (h[1] + 1) * h[2] : +h[2], y && (y.unit = G, y.start = Z, y.end = C)), C;
    }
    var $e = function(o, l, h, y, C, T, N) {
      var q = 0, V = o.length, G = h == null;
      if (s.type(h) === "object") {
        C = !0;
        for (q in h)
          $e(o, l, q, h[q], !0, T, N);
      } else if (y !== void 0 && (C = !0, s.isFunction(y) || (N = !0), G && (N ? (l.call(o, y), l = null) : (G = l, l = function(Z, me, Pe) {
        return G.call(s(Z), Pe);
      })), l))
        for (; q < V; q++)
          l(
            o[q],
            h,
            N ? y : y.call(o[q], q, l(o[q], h))
          );
      return C ? o : (
        // Gets
        G ? l.call(o) : V ? l(o[0], h) : T
      );
    }, at = /^(?:checkbox|radio)$/i, vt = /<([\w:-]+)/, xt = /^$|\/(?:java|ecma)script/i, Ut = /^\s+/, Nt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function Ft(o) {
      var l = Nt.split("|"), h = o.createDocumentFragment();
      if (h.createElement)
        for (; l.length; )
          h.createElement(
            l.pop()
          );
      return h;
    }
    (function() {
      var o = u.createElement("div"), l = u.createDocumentFragment(), h = u.createElement("input");
      o.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", m.leadingWhitespace = o.firstChild.nodeType === 3, m.tbody = !o.getElementsByTagName("tbody").length, m.htmlSerialize = !!o.getElementsByTagName("link").length, m.html5Clone = u.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", h.type = "checkbox", h.checked = !0, l.appendChild(h), m.appendChecked = h.checked, o.innerHTML = "<textarea>x</textarea>", m.noCloneChecked = !!o.cloneNode(!0).lastChild.defaultValue, l.appendChild(o), h = u.createElement("input"), h.setAttribute("type", "radio"), h.setAttribute("checked", "checked"), h.setAttribute("name", "t"), o.appendChild(h), m.checkClone = o.cloneNode(!0).cloneNode(!0).lastChild.checked, m.noCloneEvent = !!o.addEventListener, o[s.expando] = 1, m.attributes = !o.getAttribute(s.expando);
    })();
    var Mt = {
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
      _default: m.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Mt.optgroup = Mt.option, Mt.tbody = Mt.tfoot = Mt.colgroup = Mt.caption = Mt.thead, Mt.th = Mt.td;
    function Et(o, l) {
      var h, y, C = 0, T = typeof o.getElementsByTagName < "u" ? o.getElementsByTagName(l || "*") : typeof o.querySelectorAll < "u" ? o.querySelectorAll(l || "*") : void 0;
      if (!T)
        for (T = [], h = o.childNodes || o; (y = h[C]) != null; C++)
          !l || s.nodeName(y, l) ? T.push(y) : s.merge(T, Et(y, l));
      return l === void 0 || l && s.nodeName(o, l) ? s.merge([o], T) : T;
    }
    function Sn(o, l) {
      for (var h, y = 0; (h = o[y]) != null; y++)
        s._data(
          h,
          "globalEval",
          !l || s._data(l[y], "globalEval")
        );
    }
    var pn = /<|&#?\w+;/, $n = /<tbody/i;
    function gn(o) {
      at.test(o.type) && (o.defaultChecked = o.checked);
    }
    function un(o, l, h, y, C) {
      for (var T, N, q, V, G, Z, me, Pe = o.length, ve = Ft(l), nt = [], Ye = 0; Ye < Pe; Ye++)
        if (N = o[Ye], N || N === 0)
          if (s.type(N) === "object")
            s.merge(nt, N.nodeType ? [N] : N);
          else if (!pn.test(N))
            nt.push(l.createTextNode(N));
          else {
            for (V = V || ve.appendChild(l.createElement("div")), G = (vt.exec(N) || ["", ""])[1].toLowerCase(), me = Mt[G] || Mt._default, V.innerHTML = me[1] + s.htmlPrefilter(N) + me[2], T = me[0]; T--; )
              V = V.lastChild;
            if (!m.leadingWhitespace && Ut.test(N) && nt.push(l.createTextNode(Ut.exec(N)[0])), !m.tbody)
              for (N = G === "table" && !$n.test(N) ? V.firstChild : (
                // String was a bare <thead> or <tfoot>
                me[1] === "<table>" && !$n.test(N) ? V : 0
              ), T = N && N.childNodes.length; T--; )
                s.nodeName(Z = N.childNodes[T], "tbody") && !Z.childNodes.length && N.removeChild(Z);
            for (s.merge(nt, V.childNodes), V.textContent = ""; V.firstChild; )
              V.removeChild(V.firstChild);
            V = ve.lastChild;
          }
      for (V && ve.removeChild(V), m.appendChecked || s.grep(Et(nt, "input"), gn), Ye = 0; N = nt[Ye++]; ) {
        if (y && s.inArray(N, y) > -1) {
          C && C.push(N);
          continue;
        }
        if (q = s.contains(N.ownerDocument, N), V = Et(ve.appendChild(N), "script"), q && Sn(V), h)
          for (T = 0; N = V[T++]; )
            xt.test(N.type || "") && h.push(N);
      }
      return V = null, ve;
    }
    (function() {
      var o, l, h = u.createElement("div");
      for (o in { submit: !0, change: !0, focusin: !0 })
        l = "on" + o, (m[o] = l in n) || (h.setAttribute(l, "t"), m[o] = h.attributes[l].expando === !1);
      h = null;
    })();
    var Kn = /^(?:input|select|textarea)$/i, Ur = /^key/, ji = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, vi = /^(?:focusinfocus|focusoutblur)$/, yi = /^([^.]*)(?:\.(.+)|)/;
    function ce() {
      return !0;
    }
    function Le() {
      return !1;
    }
    function Ve() {
      try {
        return u.activeElement;
      } catch {
      }
    }
    function yt(o, l, h, y, C, T) {
      var N, q;
      if (typeof l == "object") {
        typeof h != "string" && (y = y || h, h = void 0);
        for (q in l)
          yt(o, q, h, y, l[q], T);
        return o;
      }
      if (y == null && C == null ? (C = h, y = h = void 0) : C == null && (typeof h == "string" ? (C = y, y = void 0) : (C = y, y = h, h = void 0)), C === !1)
        C = Le;
      else if (!C)
        return o;
      return T === 1 && (N = C, C = function(V) {
        return s().off(V), N.apply(this, arguments);
      }, C.guid = N.guid || (N.guid = s.guid++)), o.each(function() {
        s.event.add(this, l, C, y, h);
      });
    }
    s.event = {
      global: {},
      add: function(o, l, h, y, C) {
        var T, N, q, V, G, Z, me, Pe, ve, nt, Ye, st = s._data(o);
        if (st) {
          for (h.handler && (V = h, h = V.handler, C = V.selector), h.guid || (h.guid = s.guid++), (N = st.events) || (N = st.events = {}), (Z = st.handle) || (Z = st.handle = function(on) {
            return typeof s < "u" && (!on || s.event.triggered !== on.type) ? s.event.dispatch.apply(Z.elem, arguments) : void 0;
          }, Z.elem = o), l = (l || "").match(pe) || [""], q = l.length; q--; )
            T = yi.exec(l[q]) || [], ve = Ye = T[1], nt = (T[2] || "").split(".").sort(), ve && (G = s.event.special[ve] || {}, ve = (C ? G.delegateType : G.bindType) || ve, G = s.event.special[ve] || {}, me = s.extend({
              type: ve,
              origType: Ye,
              data: y,
              handler: h,
              guid: h.guid,
              selector: C,
              needsContext: C && s.expr.match.needsContext.test(C),
              namespace: nt.join(".")
            }, V), (Pe = N[ve]) || (Pe = N[ve] = [], Pe.delegateCount = 0, (!G.setup || G.setup.call(o, y, nt, Z) === !1) && (o.addEventListener ? o.addEventListener(ve, Z, !1) : o.attachEvent && o.attachEvent("on" + ve, Z))), G.add && (G.add.call(o, me), me.handler.guid || (me.handler.guid = h.guid)), C ? Pe.splice(Pe.delegateCount++, 0, me) : Pe.push(me), s.event.global[ve] = !0);
          o = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(o, l, h, y, C) {
        var T, N, q, V, G, Z, me, Pe, ve, nt, Ye, st = s.hasData(o) && s._data(o);
        if (!(!st || !(Z = st.events))) {
          for (l = (l || "").match(pe) || [""], G = l.length; G--; ) {
            if (q = yi.exec(l[G]) || [], ve = Ye = q[1], nt = (q[2] || "").split(".").sort(), !ve) {
              for (ve in Z)
                s.event.remove(o, ve + l[G], h, y, !0);
              continue;
            }
            for (me = s.event.special[ve] || {}, ve = (y ? me.delegateType : me.bindType) || ve, Pe = Z[ve] || [], q = q[2] && new RegExp("(^|\\.)" + nt.join("\\.(?:.*\\.|)") + "(\\.|$)"), V = T = Pe.length; T--; )
              N = Pe[T], (C || Ye === N.origType) && (!h || h.guid === N.guid) && (!q || q.test(N.namespace)) && (!y || y === N.selector || y === "**" && N.selector) && (Pe.splice(T, 1), N.selector && Pe.delegateCount--, me.remove && me.remove.call(o, N));
            V && !Pe.length && ((!me.teardown || me.teardown.call(o, nt, st.handle) === !1) && s.removeEvent(o, ve, st.handle), delete Z[ve]);
          }
          s.isEmptyObject(Z) && (delete st.handle, s._removeData(o, "events"));
        }
      },
      trigger: function(o, l, h, y) {
        var C, T, N, q, V, G, Z, me = [h || u], Pe = w.call(o, "type") ? o.type : o, ve = w.call(o, "namespace") ? o.namespace.split(".") : [];
        if (N = G = h = h || u, !(h.nodeType === 3 || h.nodeType === 8) && !vi.test(Pe + s.event.triggered) && (Pe.indexOf(".") > -1 && (ve = Pe.split("."), Pe = ve.shift(), ve.sort()), T = Pe.indexOf(":") < 0 && "on" + Pe, o = o[s.expando] ? o : new s.Event(Pe, typeof o == "object" && o), o.isTrigger = y ? 2 : 3, o.namespace = ve.join("."), o.rnamespace = o.namespace ? new RegExp("(^|\\.)" + ve.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, o.result = void 0, o.target || (o.target = h), l = l == null ? [o] : s.makeArray(l, [o]), V = s.event.special[Pe] || {}, !(!y && V.trigger && V.trigger.apply(h, l) === !1))) {
          if (!y && !V.noBubble && !s.isWindow(h)) {
            for (q = V.delegateType || Pe, vi.test(q + Pe) || (N = N.parentNode); N; N = N.parentNode)
              me.push(N), G = N;
            G === (h.ownerDocument || u) && me.push(G.defaultView || G.parentWindow || n);
          }
          for (Z = 0; (N = me[Z++]) && !o.isPropagationStopped(); )
            o.type = Z > 1 ? q : V.bindType || Pe, C = (s._data(N, "events") || {})[o.type] && s._data(N, "handle"), C && C.apply(N, l), C = T && N[T], C && C.apply && Y(N) && (o.result = C.apply(N, l), o.result === !1 && o.preventDefault());
          if (o.type = Pe, !y && !o.isDefaultPrevented() && (!V._default || V._default.apply(me.pop(), l) === !1) && Y(h) && T && h[Pe] && !s.isWindow(h)) {
            G = h[T], G && (h[T] = null), s.event.triggered = Pe;
            try {
              h[Pe]();
            } catch {
            }
            s.event.triggered = void 0, G && (h[T] = G);
          }
          return o.result;
        }
      },
      dispatch: function(o) {
        o = s.event.fix(o);
        var l, h, y, C, T, N = [], q = f.call(arguments), V = (s._data(this, "events") || {})[o.type] || [], G = s.event.special[o.type] || {};
        if (q[0] = o, o.delegateTarget = this, !(G.preDispatch && G.preDispatch.call(this, o) === !1)) {
          for (N = s.event.handlers.call(this, o, V), l = 0; (C = N[l++]) && !o.isPropagationStopped(); )
            for (o.currentTarget = C.elem, h = 0; (T = C.handlers[h++]) && !o.isImmediatePropagationStopped(); )
              (!o.rnamespace || o.rnamespace.test(T.namespace)) && (o.handleObj = T, o.data = T.data, y = ((s.event.special[T.origType] || {}).handle || T.handler).apply(C.elem, q), y !== void 0 && (o.result = y) === !1 && (o.preventDefault(), o.stopPropagation()));
          return G.postDispatch && G.postDispatch.call(this, o), o.result;
        }
      },
      handlers: function(o, l) {
        var h, y, C, T, N = [], q = l.delegateCount, V = o.target;
        if (q && V.nodeType && (o.type !== "click" || isNaN(o.button) || o.button < 1)) {
          for (; V != this; V = V.parentNode || this)
            if (V.nodeType === 1 && (V.disabled !== !0 || o.type !== "click")) {
              for (y = [], h = 0; h < q; h++)
                T = l[h], C = T.selector + " ", y[C] === void 0 && (y[C] = T.needsContext ? s(C, this).index(V) > -1 : s.find(C, this, null, [V]).length), y[C] && y.push(T);
              y.length && N.push({ elem: V, handlers: y });
            }
        }
        return q < l.length && N.push({ elem: this, handlers: l.slice(q) }), N;
      },
      fix: function(o) {
        if (o[s.expando])
          return o;
        var l, h, y, C = o.type, T = o, N = this.fixHooks[C];
        for (N || (this.fixHooks[C] = N = ji.test(C) ? this.mouseHooks : Ur.test(C) ? this.keyHooks : {}), y = N.props ? this.props.concat(N.props) : this.props, o = new s.Event(T), l = y.length; l--; )
          h = y[l], o[h] = T[h];
        return o.target || (o.target = T.srcElement || u), o.target.nodeType === 3 && (o.target = o.target.parentNode), o.metaKey = !!o.metaKey, N.filter ? N.filter(o, T) : o;
      },
      // Includes some event props shared by KeyEvent and MouseEvent
      props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(o, l) {
          return o.which == null && (o.which = l.charCode != null ? l.charCode : l.keyCode), o;
        }
      },
      mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(o, l) {
          var h, y, C, T = l.button, N = l.fromElement;
          return o.pageX == null && l.clientX != null && (y = o.target.ownerDocument || u, C = y.documentElement, h = y.body, o.pageX = l.clientX + (C && C.scrollLeft || h && h.scrollLeft || 0) - (C && C.clientLeft || h && h.clientLeft || 0), o.pageY = l.clientY + (C && C.scrollTop || h && h.scrollTop || 0) - (C && C.clientTop || h && h.clientTop || 0)), !o.relatedTarget && N && (o.relatedTarget = N === o.target ? l.toElement : N), !o.which && T !== void 0 && (o.which = T & 1 ? 1 : T & 2 ? 3 : T & 4 ? 2 : 0), o;
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
            if (this !== Ve() && this.focus)
              try {
                return this.focus(), !1;
              } catch {
              }
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            if (this === Ve() && this.blur)
              return this.blur(), !1;
          },
          delegateType: "focusout"
        },
        click: {
          // For checkbox, fire native event so checked state will be right
          trigger: function() {
            if (s.nodeName(this, "input") && this.type === "checkbox" && this.click)
              return this.click(), !1;
          },
          // For cross-browser consistency, don't fire native .click() on links
          _default: function(o) {
            return s.nodeName(o.target, "a");
          }
        },
        beforeunload: {
          postDispatch: function(o) {
            o.result !== void 0 && o.originalEvent && (o.originalEvent.returnValue = o.result);
          }
        }
      },
      // Piggyback on a donor event to simulate a different one
      simulate: function(o, l, h) {
        var y = s.extend(
          new s.Event(),
          h,
          {
            type: o,
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
        s.event.trigger(y, null, l), y.isDefaultPrevented() && h.preventDefault();
      }
    }, s.removeEvent = u.removeEventListener ? function(o, l, h) {
      o.removeEventListener && o.removeEventListener(l, h);
    } : function(o, l, h) {
      var y = "on" + l;
      o.detachEvent && (typeof o[y] > "u" && (o[y] = null), o.detachEvent(y, h));
    }, s.Event = function(o, l) {
      if (!(this instanceof s.Event))
        return new s.Event(o, l);
      o && o.type ? (this.originalEvent = o, this.type = o.type, this.isDefaultPrevented = o.defaultPrevented || o.defaultPrevented === void 0 && // Support: IE < 9, Android < 4.0
      o.returnValue === !1 ? ce : Le) : this.type = o, l && s.extend(this, l), this.timeStamp = o && o.timeStamp || s.now(), this[s.expando] = !0;
    }, s.Event.prototype = {
      constructor: s.Event,
      isDefaultPrevented: Le,
      isPropagationStopped: Le,
      isImmediatePropagationStopped: Le,
      preventDefault: function() {
        var o = this.originalEvent;
        this.isDefaultPrevented = ce, o && (o.preventDefault ? o.preventDefault() : o.returnValue = !1);
      },
      stopPropagation: function() {
        var o = this.originalEvent;
        this.isPropagationStopped = ce, !(!o || this.isSimulated) && (o.stopPropagation && o.stopPropagation(), o.cancelBubble = !0);
      },
      stopImmediatePropagation: function() {
        var o = this.originalEvent;
        this.isImmediatePropagationStopped = ce, o && o.stopImmediatePropagation && o.stopImmediatePropagation(), this.stopPropagation();
      }
    }, s.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(o, l) {
      s.event.special[o] = {
        delegateType: l,
        bindType: l,
        handle: function(h) {
          var y, C = this, T = h.relatedTarget, N = h.handleObj;
          return (!T || T !== C && !s.contains(C, T)) && (h.type = N.origType, y = N.handler.apply(this, arguments), h.type = l), y;
        }
      };
    }), m.submit || (s.event.special.submit = {
      setup: function() {
        if (s.nodeName(this, "form"))
          return !1;
        s.event.add(this, "click._submit keypress._submit", function(o) {
          var l = o.target, h = s.nodeName(l, "input") || s.nodeName(l, "button") ? (
            // Support: IE <=8
            // We use jQuery.prop instead of elem.form
            // to allow fixing the IE8 delegated submit issue (gh-2332)
            // by 3rd party polyfills/workarounds.
            s.prop(l, "form")
          ) : void 0;
          h && !s._data(h, "submit") && (s.event.add(h, "submit._submit", function(y) {
            y._submitBubble = !0;
          }), s._data(h, "submit", !0));
        });
      },
      postDispatch: function(o) {
        o._submitBubble && (delete o._submitBubble, this.parentNode && !o.isTrigger && s.event.simulate("submit", this.parentNode, o));
      },
      teardown: function() {
        if (s.nodeName(this, "form"))
          return !1;
        s.event.remove(this, "._submit");
      }
    }), m.change || (s.event.special.change = {
      setup: function() {
        if (Kn.test(this.nodeName))
          return (this.type === "checkbox" || this.type === "radio") && (s.event.add(this, "propertychange._change", function(o) {
            o.originalEvent.propertyName === "checked" && (this._justChanged = !0);
          }), s.event.add(this, "click._change", function(o) {
            this._justChanged && !o.isTrigger && (this._justChanged = !1), s.event.simulate("change", this, o);
          })), !1;
        s.event.add(this, "beforeactivate._change", function(o) {
          var l = o.target;
          Kn.test(l.nodeName) && !s._data(l, "change") && (s.event.add(l, "change._change", function(h) {
            this.parentNode && !h.isSimulated && !h.isTrigger && s.event.simulate("change", this.parentNode, h);
          }), s._data(l, "change", !0));
        });
      },
      handle: function(o) {
        var l = o.target;
        if (this !== l || o.isSimulated || o.isTrigger || l.type !== "radio" && l.type !== "checkbox")
          return o.handleObj.handler.apply(this, arguments);
      },
      teardown: function() {
        return s.event.remove(this, "._change"), !Kn.test(this.nodeName);
      }
    }), m.focusin || s.each({ focus: "focusin", blur: "focusout" }, function(o, l) {
      var h = function(y) {
        s.event.simulate(l, y.target, s.event.fix(y));
      };
      s.event.special[l] = {
        setup: function() {
          var y = this.ownerDocument || this, C = s._data(y, l);
          C || y.addEventListener(o, h, !0), s._data(y, l, (C || 0) + 1);
        },
        teardown: function() {
          var y = this.ownerDocument || this, C = s._data(y, l) - 1;
          C ? s._data(y, l, C) : (y.removeEventListener(o, h, !0), s._removeData(y, l));
        }
      };
    }), s.fn.extend({
      on: function(o, l, h, y) {
        return yt(this, o, l, h, y);
      },
      one: function(o, l, h, y) {
        return yt(this, o, l, h, y, 1);
      },
      off: function(o, l, h) {
        var y, C;
        if (o && o.preventDefault && o.handleObj)
          return y = o.handleObj, s(o.delegateTarget).off(
            y.namespace ? y.origType + "." + y.namespace : y.origType,
            y.selector,
            y.handler
          ), this;
        if (typeof o == "object") {
          for (C in o)
            this.off(C, l, o[C]);
          return this;
        }
        return (l === !1 || typeof l == "function") && (h = l, l = void 0), h === !1 && (h = Le), this.each(function() {
          s.event.remove(this, o, h, l);
        });
      },
      trigger: function(o, l) {
        return this.each(function() {
          s.event.trigger(o, l, this);
        });
      },
      triggerHandler: function(o, l) {
        var h = this[0];
        if (h)
          return s.event.trigger(o, l, h, !0);
      }
    });
    var wt = / jQuery\d+="(?:null|\d+)"/g, en = new RegExp("<(?:" + Nt + ")[\\s/>]", "i"), mn = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, ar = /<script|<style|<link/i, Hi = /checked\s*(?:[^=]|=\s*.checked.)/i, sr = /^true\/(.*)/, Wi = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wi = Ft(u), Xn = wi.appendChild(u.createElement("div"));
    function Vi(o, l) {
      return s.nodeName(o, "table") && s.nodeName(l.nodeType !== 11 ? l : l.firstChild, "tr") ? o.getElementsByTagName("tbody")[0] || o.appendChild(o.ownerDocument.createElement("tbody")) : o;
    }
    function bi(o) {
      return o.type = (s.find.attr(o, "type") !== null) + "/" + o.type, o;
    }
    function Gr(o) {
      var l = sr.exec(o.type);
      return l ? o.type = l[1] : o.removeAttribute("type"), o;
    }
    function Ts(o, l) {
      if (!(l.nodeType !== 1 || !s.hasData(o))) {
        var h, y, C, T = s._data(o), N = s._data(l, T), q = T.events;
        if (q) {
          delete N.handle, N.events = {};
          for (h in q)
            for (y = 0, C = q[h].length; y < C; y++)
              s.event.add(l, h, q[h][y]);
        }
        N.data && (N.data = s.extend({}, N.data));
      }
    }
    function ma(o, l) {
      var h, y, C;
      if (l.nodeType === 1) {
        if (h = l.nodeName.toLowerCase(), !m.noCloneEvent && l[s.expando]) {
          C = s._data(l);
          for (y in C.events)
            s.removeEvent(l, y, C.handle);
          l.removeAttribute(s.expando);
        }
        h === "script" && l.text !== o.text ? (bi(l).text = o.text, Gr(l)) : h === "object" ? (l.parentNode && (l.outerHTML = o.outerHTML), m.html5Clone && o.innerHTML && !s.trim(l.innerHTML) && (l.innerHTML = o.innerHTML)) : h === "input" && at.test(o.type) ? (l.defaultChecked = l.checked = o.checked, l.value !== o.value && (l.value = o.value)) : h === "option" ? l.defaultSelected = l.selected = o.defaultSelected : (h === "input" || h === "textarea") && (l.defaultValue = o.defaultValue);
      }
    }
    function Kr(o, l, h, y) {
      l = d.apply([], l);
      var C, T, N, q, V, G, Z = 0, me = o.length, Pe = me - 1, ve = l[0], nt = s.isFunction(ve);
      if (nt || me > 1 && typeof ve == "string" && !m.checkClone && Hi.test(ve))
        return o.each(function(Ye) {
          var st = o.eq(Ye);
          nt && (l[0] = ve.call(this, Ye, st.html())), Kr(st, l, h, y);
        });
      if (me && (G = un(l, o[0].ownerDocument, !1, o, y), C = G.firstChild, G.childNodes.length === 1 && (G = C), C || y)) {
        for (q = s.map(Et(G, "script"), bi), N = q.length; Z < me; Z++)
          T = G, Z !== Pe && (T = s.clone(T, !0, !0), N && s.merge(q, Et(T, "script"))), h.call(o[Z], T, Z);
        if (N)
          for (V = q[q.length - 1].ownerDocument, s.map(q, Gr), Z = 0; Z < N; Z++)
            T = q[Z], xt.test(T.type || "") && !s._data(T, "globalEval") && s.contains(V, T) && (T.src ? s._evalUrl && s._evalUrl(T.src) : s.globalEval(
              (T.text || T.textContent || T.innerHTML || "").replace(Wi, "")
            ));
        G = C = null;
      }
      return o;
    }
    function xo(o, l, h) {
      for (var y, C = l ? s.filter(l, o) : o, T = 0; (y = C[T]) != null; T++)
        !h && y.nodeType === 1 && s.cleanData(Et(y)), y.parentNode && (h && s.contains(y.ownerDocument, y) && Sn(Et(y, "script")), y.parentNode.removeChild(y));
      return o;
    }
    s.extend({
      htmlPrefilter: function(o) {
        return o.replace(mn, "<$1></$2>");
      },
      clone: function(o, l, h) {
        var y, C, T, N, q, V = s.contains(o.ownerDocument, o);
        if (m.html5Clone || s.isXMLDoc(o) || !en.test("<" + o.nodeName + ">") ? T = o.cloneNode(!0) : (Xn.innerHTML = o.outerHTML, Xn.removeChild(T = Xn.firstChild)), (!m.noCloneEvent || !m.noCloneChecked) && (o.nodeType === 1 || o.nodeType === 11) && !s.isXMLDoc(o))
          for (y = Et(T), q = Et(o), N = 0; (C = q[N]) != null; ++N)
            y[N] && ma(C, y[N]);
        if (l)
          if (h)
            for (q = q || Et(o), y = y || Et(T), N = 0; (C = q[N]) != null; N++)
              Ts(C, y[N]);
          else
            Ts(o, T);
        return y = Et(T, "script"), y.length > 0 && Sn(y, !V && Et(o, "script")), y = q = C = null, T;
      },
      cleanData: function(o, l) {
        for (var h, y, C, T, N = 0, q = s.expando, V = s.cache, G = m.attributes, Z = s.event.special; (h = o[N]) != null; N++)
          if ((l || Y(h)) && (C = h[q], T = C && V[C], T)) {
            if (T.events)
              for (y in T.events)
                Z[y] ? s.event.remove(h, y) : s.removeEvent(h, y, T.handle);
            V[C] && (delete V[C], !G && typeof h.removeAttribute < "u" ? h.removeAttribute(q) : h[q] = void 0, a.push(C));
          }
      }
    }), s.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: Kr,
      detach: function(o) {
        return xo(this, o, !0);
      },
      remove: function(o) {
        return xo(this, o);
      },
      text: function(o) {
        return $e(this, function(l) {
          return l === void 0 ? s.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || u).createTextNode(l)
          );
        }, null, o, arguments.length);
      },
      append: function() {
        return Kr(this, arguments, function(o) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var l = Vi(this, o);
            l.appendChild(o);
          }
        });
      },
      prepend: function() {
        return Kr(this, arguments, function(o) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var l = Vi(this, o);
            l.insertBefore(o, l.firstChild);
          }
        });
      },
      before: function() {
        return Kr(this, arguments, function(o) {
          this.parentNode && this.parentNode.insertBefore(o, this);
        });
      },
      after: function() {
        return Kr(this, arguments, function(o) {
          this.parentNode && this.parentNode.insertBefore(o, this.nextSibling);
        });
      },
      empty: function() {
        for (var o, l = 0; (o = this[l]) != null; l++) {
          for (o.nodeType === 1 && s.cleanData(Et(o, !1)); o.firstChild; )
            o.removeChild(o.firstChild);
          o.options && s.nodeName(o, "select") && (o.options.length = 0);
        }
        return this;
      },
      clone: function(o, l) {
        return o = o ?? !1, l = l ?? o, this.map(function() {
          return s.clone(this, o, l);
        });
      },
      html: function(o) {
        return $e(this, function(l) {
          var h = this[0] || {}, y = 0, C = this.length;
          if (l === void 0)
            return h.nodeType === 1 ? h.innerHTML.replace(wt, "") : void 0;
          if (typeof l == "string" && !ar.test(l) && (m.htmlSerialize || !en.test(l)) && (m.leadingWhitespace || !Ut.test(l)) && !Mt[(vt.exec(l) || ["", ""])[1].toLowerCase()]) {
            l = s.htmlPrefilter(l);
            try {
              for (; y < C; y++)
                h = this[y] || {}, h.nodeType === 1 && (s.cleanData(Et(h, !1)), h.innerHTML = l);
              h = 0;
            } catch {
            }
          }
          h && this.empty().append(l);
        }, null, o, arguments.length);
      },
      replaceWith: function() {
        var o = [];
        return Kr(this, arguments, function(l) {
          var h = this.parentNode;
          s.inArray(this, o) < 0 && (s.cleanData(Et(this)), h && h.replaceChild(l, this));
        }, o);
      }
    }), s.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(o, l) {
      s.fn[o] = function(h) {
        for (var y, C = 0, T = [], N = s(h), q = N.length - 1; C <= q; C++)
          y = C === q ? this : this.clone(!0), s(N[C])[l](y), v.apply(T, y.get());
        return this.pushStack(T);
      };
    });
    var Ui, Ps = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function ks(o, l) {
      var h = s(l.createElement(o)).appendTo(l.body), y = s.css(h[0], "display");
      return h.detach(), y;
    }
    function So(o) {
      var l = u, h = Ps[o];
      return h || (h = ks(o, l), (h === "none" || !h) && (Ui = (Ui || s("<iframe frameborder='0' width='0' height='0'/>")).appendTo(l.documentElement), l = (Ui[0].contentWindow || Ui[0].contentDocument).document, l.write(), l.close(), h = ks(o, l), Ui.detach()), Ps[o] = h), h;
    }
    var Ns = /^margin/, $o = new RegExp("^(" + et + ")(?!px)[a-z%]+$", "i"), va = function(o, l, h, y) {
      var C, T, N = {};
      for (T in l)
        N[T] = o.style[T], o.style[T] = l[T];
      C = h.apply(o, y || []);
      for (T in l)
        o.style[T] = N[T];
      return C;
    }, Os = u.documentElement;
    (function() {
      var o, l, h, y, C, T, N = u.createElement("div"), q = u.createElement("div");
      if (!q.style)
        return;
      q.style.cssText = "float:left;opacity:.5", m.opacity = q.style.opacity === "0.5", m.cssFloat = !!q.style.cssFloat, q.style.backgroundClip = "content-box", q.cloneNode(!0).style.backgroundClip = "", m.clearCloneStyle = q.style.backgroundClip === "content-box", N = u.createElement("div"), N.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", q.innerHTML = "", N.appendChild(q), m.boxSizing = q.style.boxSizing === "" || q.style.MozBoxSizing === "" || q.style.WebkitBoxSizing === "", s.extend(m, {
        reliableHiddenOffsets: function() {
          return o == null && V(), y;
        },
        boxSizingReliable: function() {
          return o == null && V(), h;
        },
        pixelMarginRight: function() {
          return o == null && V(), l;
        },
        pixelPosition: function() {
          return o == null && V(), o;
        },
        reliableMarginRight: function() {
          return o == null && V(), C;
        },
        reliableMarginLeft: function() {
          return o == null && V(), T;
        }
      });
      function V() {
        var G, Z, me = u.documentElement;
        me.appendChild(N), q.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", o = h = T = !1, l = C = !0, n.getComputedStyle && (Z = n.getComputedStyle(q), o = (Z || {}).top !== "1%", T = (Z || {}).marginLeft === "2px", h = (Z || { width: "4px" }).width === "4px", q.style.marginRight = "50%", l = (Z || { marginRight: "4px" }).marginRight === "4px", G = q.appendChild(u.createElement("div")), G.style.cssText = q.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", G.style.marginRight = G.style.width = "0", q.style.width = "1px", C = !parseFloat((n.getComputedStyle(G) || {}).marginRight), q.removeChild(G)), q.style.display = "none", y = q.getClientRects().length === 0, y && (q.style.display = "", q.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", q.childNodes[0].style.borderCollapse = "separate", G = q.getElementsByTagName("td"), G[0].style.cssText = "margin:0;border:0;padding:0;display:none", y = G[0].offsetHeight === 0, y && (G[0].style.display = "", G[1].style.display = "none", y = G[0].offsetHeight === 0)), me.removeChild(N);
      }
    })();
    var Ar, Tr, Rl = /^(top|right|bottom|left)$/;
    n.getComputedStyle ? (Ar = function(o) {
      var l = o.ownerDocument.defaultView;
      return (!l || !l.opener) && (l = n), l.getComputedStyle(o);
    }, Tr = function(o, l, h) {
      var y, C, T, N, q = o.style;
      return h = h || Ar(o), N = h ? h.getPropertyValue(l) || h[l] : void 0, (N === "" || N === void 0) && !s.contains(o.ownerDocument, o) && (N = s.style(o, l)), h && !m.pixelMarginRight() && $o.test(N) && Ns.test(l) && (y = q.width, C = q.minWidth, T = q.maxWidth, q.minWidth = q.maxWidth = q.width = N, N = h.width, q.width = y, q.minWidth = C, q.maxWidth = T), N === void 0 ? N : N + "";
    }) : Os.currentStyle && (Ar = function(o) {
      return o.currentStyle;
    }, Tr = function(o, l, h) {
      var y, C, T, N, q = o.style;
      return h = h || Ar(o), N = h ? h[l] : void 0, N == null && q && q[l] && (N = q[l]), $o.test(N) && !Rl.test(l) && (y = q.left, C = o.runtimeStyle, T = C && C.left, T && (C.left = o.currentStyle.left), q.left = l === "fontSize" ? "1em" : N, N = q.pixelLeft + "px", q.left = y, T && (C.left = T)), N === void 0 ? N : N + "" || "auto";
    });
    function ya(o, l) {
      return {
        get: function() {
          if (o()) {
            delete this.get;
            return;
          }
          return (this.get = l).apply(this, arguments);
        }
      };
    }
    var wa = /alpha\([^)]*\)/i, Ml = /opacity\s*=\s*([^)]*)/i, Dl = /^(none|table(?!-c[ea]).+)/, Eo = new RegExp("^(" + et + ")(.*)$", "i"), Il = { position: "absolute", visibility: "hidden", display: "block" }, Gi = {
      letterSpacing: "0",
      fontWeight: "400"
    }, Ls = ["Webkit", "O", "Moz", "ms"], Rs = u.createElement("div").style;
    function Ms(o) {
      if (o in Rs)
        return o;
      for (var l = o.charAt(0).toUpperCase() + o.slice(1), h = Ls.length; h--; )
        if (o = Ls[h] + l, o in Rs)
          return o;
    }
    function ba(o, l) {
      for (var h, y, C, T = [], N = 0, q = o.length; N < q; N++)
        y = o[N], y.style && (T[N] = s._data(y, "olddisplay"), h = y.style.display, l ? (!T[N] && h === "none" && (y.style.display = ""), y.style.display === "" && ue(y) && (T[N] = s._data(y, "olddisplay", So(y.nodeName)))) : (C = ue(y), (h && h !== "none" || !C) && s._data(
          y,
          "olddisplay",
          C ? h : s.css(y, "display")
        )));
      for (N = 0; N < q; N++)
        y = o[N], y.style && (!l || y.style.display === "none" || y.style.display === "") && (y.style.display = l ? T[N] || "" : "none");
      return o;
    }
    function _a(o, l, h) {
      var y = Eo.exec(l);
      return y ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, y[1] - (h || 0)) + (y[2] || "px")
      ) : l;
    }
    function xa(o, l, h, y, C) {
      for (var T = h === (y ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        l === "width" ? 1 : 0
      ), N = 0; T < 4; T += 2)
        h === "margin" && (N += s.css(o, h + Ie[T], !0, C)), y ? (h === "content" && (N -= s.css(o, "padding" + Ie[T], !0, C)), h !== "margin" && (N -= s.css(o, "border" + Ie[T] + "Width", !0, C))) : (N += s.css(o, "padding" + Ie[T], !0, C), h !== "padding" && (N += s.css(o, "border" + Ie[T] + "Width", !0, C)));
      return N;
    }
    function Ds(o, l, h) {
      var y = !0, C = l === "width" ? o.offsetWidth : o.offsetHeight, T = Ar(o), N = m.boxSizing && s.css(o, "boxSizing", !1, T) === "border-box";
      if (C <= 0 || C == null) {
        if (C = Tr(o, l, T), (C < 0 || C == null) && (C = o.style[l]), $o.test(C))
          return C;
        y = N && (m.boxSizingReliable() || C === o.style[l]), C = parseFloat(C) || 0;
      }
      return C + xa(
        o,
        l,
        h || (N ? "border" : "content"),
        y,
        T
      ) + "px";
    }
    s.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
        opacity: {
          get: function(o, l) {
            if (l) {
              var h = Tr(o, "opacity");
              return h === "" ? "1" : h;
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
        float: m.cssFloat ? "cssFloat" : "styleFloat"
      },
      // Get and set the style property on a DOM Node
      style: function(o, l, h, y) {
        if (!(!o || o.nodeType === 3 || o.nodeType === 8 || !o.style)) {
          var C, T, N, q = s.camelCase(l), V = o.style;
          if (l = s.cssProps[q] || (s.cssProps[q] = Ms(q) || q), N = s.cssHooks[l] || s.cssHooks[q], h !== void 0) {
            if (T = typeof h, T === "string" && (C = Ke.exec(h)) && C[1] && (h = we(o, l, C), T = "number"), h == null || h !== h)
              return;
            if (T === "number" && (h += C && C[3] || (s.cssNumber[q] ? "" : "px")), !m.clearCloneStyle && h === "" && l.indexOf("background") === 0 && (V[l] = "inherit"), !N || !("set" in N) || (h = N.set(o, h, y)) !== void 0)
              try {
                V[l] = h;
              } catch {
              }
          } else
            return N && "get" in N && (C = N.get(o, !1, y)) !== void 0 ? C : V[l];
        }
      },
      css: function(o, l, h, y) {
        var C, T, N, q = s.camelCase(l);
        return l = s.cssProps[q] || (s.cssProps[q] = Ms(q) || q), N = s.cssHooks[l] || s.cssHooks[q], N && "get" in N && (T = N.get(o, !0, h)), T === void 0 && (T = Tr(o, l, y)), T === "normal" && l in Gi && (T = Gi[l]), h === "" || h ? (C = parseFloat(T), h === !0 || isFinite(C) ? C || 0 : T) : T;
      }
    }), s.each(["height", "width"], function(o, l) {
      s.cssHooks[l] = {
        get: function(h, y, C) {
          if (y)
            return Dl.test(s.css(h, "display")) && h.offsetWidth === 0 ? va(h, Il, function() {
              return Ds(h, l, C);
            }) : Ds(h, l, C);
        },
        set: function(h, y, C) {
          var T = C && Ar(h);
          return _a(
            h,
            y,
            C ? xa(
              h,
              l,
              C,
              m.boxSizing && s.css(h, "boxSizing", !1, T) === "border-box",
              T
            ) : 0
          );
        }
      };
    }), m.opacity || (s.cssHooks.opacity = {
      get: function(o, l) {
        return Ml.test((l && o.currentStyle ? o.currentStyle.filter : o.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : l ? "1" : "";
      },
      set: function(o, l) {
        var h = o.style, y = o.currentStyle, C = s.isNumeric(l) ? "alpha(opacity=" + l * 100 + ")" : "", T = y && y.filter || h.filter || "";
        h.zoom = 1, !((l >= 1 || l === "") && s.trim(T.replace(wa, "")) === "" && h.removeAttribute && (h.removeAttribute("filter"), l === "" || y && !y.filter)) && (h.filter = wa.test(T) ? T.replace(wa, C) : T + " " + C);
      }
    }), s.cssHooks.marginRight = ya(
      m.reliableMarginRight,
      function(o, l) {
        if (l)
          return va(
            o,
            { display: "inline-block" },
            Tr,
            [o, "marginRight"]
          );
      }
    ), s.cssHooks.marginLeft = ya(
      m.reliableMarginLeft,
      function(o, l) {
        if (l)
          return (parseFloat(Tr(o, "marginLeft")) || // Support: IE<=11+
          // Running getBoundingClientRect on a disconnected node in IE throws an error
          // Support: IE8 only
          // getClientRects() errors on disconnected elems
          (s.contains(o.ownerDocument, o) ? o.getBoundingClientRect().left - va(o, { marginLeft: 0 }, function() {
            return o.getBoundingClientRect().left;
          }) : 0)) + "px";
      }
    ), s.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(o, l) {
      s.cssHooks[o + l] = {
        expand: function(h) {
          for (var y = 0, C = {}, T = typeof h == "string" ? h.split(" ") : [h]; y < 4; y++)
            C[o + Ie[y] + l] = T[y] || T[y - 2] || T[0];
          return C;
        }
      }, Ns.test(o) || (s.cssHooks[o + l].set = _a);
    }), s.fn.extend({
      css: function(o, l) {
        return $e(this, function(h, y, C) {
          var T, N, q = {}, V = 0;
          if (s.isArray(y)) {
            for (T = Ar(h), N = y.length; V < N; V++)
              q[y[V]] = s.css(h, y[V], !1, T);
            return q;
          }
          return C !== void 0 ? s.style(h, y, C) : s.css(h, y);
        }, o, l, arguments.length > 1);
      },
      show: function() {
        return ba(this, !0);
      },
      hide: function() {
        return ba(this);
      },
      toggle: function(o) {
        return typeof o == "boolean" ? o ? this.show() : this.hide() : this.each(function() {
          ue(this) ? s(this).show() : s(this).hide();
        });
      }
    });
    function vn(o, l, h, y, C) {
      return new vn.prototype.init(o, l, h, y, C);
    }
    s.Tween = vn, vn.prototype = {
      constructor: vn,
      init: function(o, l, h, y, C, T) {
        this.elem = o, this.prop = h, this.easing = C || s.easing._default, this.options = l, this.start = this.now = this.cur(), this.end = y, this.unit = T || (s.cssNumber[h] ? "" : "px");
      },
      cur: function() {
        var o = vn.propHooks[this.prop];
        return o && o.get ? o.get(this) : vn.propHooks._default.get(this);
      },
      run: function(o) {
        var l, h = vn.propHooks[this.prop];
        return this.options.duration ? this.pos = l = s.easing[this.easing](
          o,
          this.options.duration * o,
          0,
          1,
          this.options.duration
        ) : this.pos = l = o, this.now = (this.end - this.start) * l + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), h && h.set ? h.set(this) : vn.propHooks._default.set(this), this;
      }
    }, vn.prototype.init.prototype = vn.prototype, vn.propHooks = {
      _default: {
        get: function(o) {
          var l;
          return o.elem.nodeType !== 1 || o.elem[o.prop] != null && o.elem.style[o.prop] == null ? o.elem[o.prop] : (l = s.css(o.elem, o.prop, ""), !l || l === "auto" ? 0 : l);
        },
        set: function(o) {
          s.fx.step[o.prop] ? s.fx.step[o.prop](o) : o.elem.nodeType === 1 && (o.elem.style[s.cssProps[o.prop]] != null || s.cssHooks[o.prop]) ? s.style(o.elem, o.prop, o.now + o.unit) : o.elem[o.prop] = o.now;
        }
      }
    }, vn.propHooks.scrollTop = vn.propHooks.scrollLeft = {
      set: function(o) {
        o.elem.nodeType && o.elem.parentNode && (o.elem[o.prop] = o.now);
      }
    }, s.easing = {
      linear: function(o) {
        return o;
      },
      swing: function(o) {
        return 0.5 - Math.cos(o * Math.PI) / 2;
      },
      _default: "swing"
    }, s.fx = vn.prototype.init, s.fx.step = {};
    var _i, Co, Is = /^(?:toggle|show|hide)$/, Fs = /queueHooks$/;
    function Sa() {
      return n.setTimeout(function() {
        _i = void 0;
      }), _i = s.now();
    }
    function xi(o, l) {
      var h, y = { height: o }, C = 0;
      for (l = l ? 1 : 0; C < 4; C += 2 - l)
        h = Ie[C], y["margin" + h] = y["padding" + h] = o;
      return l && (y.opacity = y.width = o), y;
    }
    function qs(o, l, h) {
      for (var y, C = (On.tweeners[l] || []).concat(On.tweeners["*"]), T = 0, N = C.length; T < N; T++)
        if (y = C[T].call(h, l, o))
          return y;
    }
    function zs(o, l, h) {
      var y, C, T, N, q, V, G, Z, me = this, Pe = {}, ve = o.style, nt = o.nodeType && ue(o), Ye = s._data(o, "fxshow");
      h.queue || (q = s._queueHooks(o, "fx"), q.unqueued == null && (q.unqueued = 0, V = q.empty.fire, q.empty.fire = function() {
        q.unqueued || V();
      }), q.unqueued++, me.always(function() {
        me.always(function() {
          q.unqueued--, s.queue(o, "fx").length || q.empty.fire();
        });
      })), o.nodeType === 1 && ("height" in l || "width" in l) && (h.overflow = [ve.overflow, ve.overflowX, ve.overflowY], G = s.css(o, "display"), Z = G === "none" ? s._data(o, "olddisplay") || So(o.nodeName) : G, Z === "inline" && s.css(o, "float") === "none" && (!m.inlineBlockNeedsLayout || So(o.nodeName) === "inline" ? ve.display = "inline-block" : ve.zoom = 1)), h.overflow && (ve.overflow = "hidden", m.shrinkWrapBlocks() || me.always(function() {
        ve.overflow = h.overflow[0], ve.overflowX = h.overflow[1], ve.overflowY = h.overflow[2];
      }));
      for (y in l)
        if (C = l[y], Is.exec(C)) {
          if (delete l[y], T = T || C === "toggle", C === (nt ? "hide" : "show"))
            if (C === "show" && Ye && Ye[y] !== void 0)
              nt = !0;
            else
              continue;
          Pe[y] = Ye && Ye[y] || s.style(o, y);
        } else
          G = void 0;
      if (s.isEmptyObject(Pe))
        (G === "none" ? So(o.nodeName) : G) === "inline" && (ve.display = G);
      else {
        Ye ? "hidden" in Ye && (nt = Ye.hidden) : Ye = s._data(o, "fxshow", {}), T && (Ye.hidden = !nt), nt ? s(o).show() : me.done(function() {
          s(o).hide();
        }), me.done(function() {
          var st;
          s._removeData(o, "fxshow");
          for (st in Pe)
            s.style(o, st, Pe[st]);
        });
        for (y in Pe)
          N = qs(nt ? Ye[y] : 0, y, me), y in Ye || (Ye[y] = N.start, nt && (N.end = N.start, N.start = y === "width" || y === "height" ? 1 : 0));
      }
    }
    function Ao(o, l) {
      var h, y, C, T, N;
      for (h in o)
        if (y = s.camelCase(h), C = l[y], T = o[h], s.isArray(T) && (C = T[1], T = o[h] = T[0]), h !== y && (o[y] = T, delete o[h]), N = s.cssHooks[y], N && "expand" in N) {
          T = N.expand(T), delete o[y];
          for (h in T)
            h in o || (o[h] = T[h], l[h] = C);
        } else
          l[y] = C;
    }
    function On(o, l, h) {
      var y, C, T = 0, N = On.prefilters.length, q = s.Deferred().always(function() {
        delete V.elem;
      }), V = function() {
        if (C)
          return !1;
        for (var me = _i || Sa(), Pe = Math.max(0, G.startTime + G.duration - me), ve = Pe / G.duration || 0, nt = 1 - ve, Ye = 0, st = G.tweens.length; Ye < st; Ye++)
          G.tweens[Ye].run(nt);
        return q.notifyWith(o, [G, nt, Pe]), nt < 1 && st ? Pe : (q.resolveWith(o, [G]), !1);
      }, G = q.promise({
        elem: o,
        props: s.extend({}, l),
        opts: s.extend(!0, {
          specialEasing: {},
          easing: s.easing._default
        }, h),
        originalProperties: l,
        originalOptions: h,
        startTime: _i || Sa(),
        duration: h.duration,
        tweens: [],
        createTween: function(me, Pe) {
          var ve = s.Tween(
            o,
            G.opts,
            me,
            Pe,
            G.opts.specialEasing[me] || G.opts.easing
          );
          return G.tweens.push(ve), ve;
        },
        stop: function(me) {
          var Pe = 0, ve = me ? G.tweens.length : 0;
          if (C)
            return this;
          for (C = !0; Pe < ve; Pe++)
            G.tweens[Pe].run(1);
          return me ? (q.notifyWith(o, [G, 1, 0]), q.resolveWith(o, [G, me])) : q.rejectWith(o, [G, me]), this;
        }
      }), Z = G.props;
      for (Ao(Z, G.opts.specialEasing); T < N; T++)
        if (y = On.prefilters[T].call(G, o, Z, G.opts), y)
          return s.isFunction(y.stop) && (s._queueHooks(G.elem, G.opts.queue).stop = s.proxy(y.stop, y)), y;
      return s.map(Z, qs, G), s.isFunction(G.opts.start) && G.opts.start.call(o, G), s.fx.timer(
        s.extend(V, {
          elem: o,
          anim: G,
          queue: G.opts.queue
        })
      ), G.progress(G.opts.progress).done(G.opts.done, G.opts.complete).fail(G.opts.fail).always(G.opts.always);
    }
    s.Animation = s.extend(On, {
      tweeners: {
        "*": [function(o, l) {
          var h = this.createTween(o, l);
          return we(h.elem, o, Ke.exec(l), h), h;
        }]
      },
      tweener: function(o, l) {
        s.isFunction(o) ? (l = o, o = ["*"]) : o = o.match(pe);
        for (var h, y = 0, C = o.length; y < C; y++)
          h = o[y], On.tweeners[h] = On.tweeners[h] || [], On.tweeners[h].unshift(l);
      },
      prefilters: [zs],
      prefilter: function(o, l) {
        l ? On.prefilters.unshift(o) : On.prefilters.push(o);
      }
    }), s.speed = function(o, l, h) {
      var y = o && typeof o == "object" ? s.extend({}, o) : {
        complete: h || !h && l || s.isFunction(o) && o,
        duration: o,
        easing: h && l || l && !s.isFunction(l) && l
      };
      return y.duration = s.fx.off ? 0 : typeof y.duration == "number" ? y.duration : y.duration in s.fx.speeds ? s.fx.speeds[y.duration] : s.fx.speeds._default, (y.queue == null || y.queue === !0) && (y.queue = "fx"), y.old = y.complete, y.complete = function() {
        s.isFunction(y.old) && y.old.call(this), y.queue && s.dequeue(this, y.queue);
      }, y;
    }, s.fn.extend({
      fadeTo: function(o, l, h, y) {
        return this.filter(ue).css("opacity", 0).show().end().animate({ opacity: l }, o, h, y);
      },
      animate: function(o, l, h, y) {
        var C = s.isEmptyObject(o), T = s.speed(l, h, y), N = function() {
          var q = On(this, s.extend({}, o), T);
          (C || s._data(this, "finish")) && q.stop(!0);
        };
        return N.finish = N, C || T.queue === !1 ? this.each(N) : this.queue(T.queue, N);
      },
      stop: function(o, l, h) {
        var y = function(C) {
          var T = C.stop;
          delete C.stop, T(h);
        };
        return typeof o != "string" && (h = l, l = o, o = void 0), l && o !== !1 && this.queue(o || "fx", []), this.each(function() {
          var C = !0, T = o != null && o + "queueHooks", N = s.timers, q = s._data(this);
          if (T)
            q[T] && q[T].stop && y(q[T]);
          else
            for (T in q)
              q[T] && q[T].stop && Fs.test(T) && y(q[T]);
          for (T = N.length; T--; )
            N[T].elem === this && (o == null || N[T].queue === o) && (N[T].anim.stop(h), C = !1, N.splice(T, 1));
          (C || !h) && s.dequeue(this, o);
        });
      },
      finish: function(o) {
        return o !== !1 && (o = o || "fx"), this.each(function() {
          var l, h = s._data(this), y = h[o + "queue"], C = h[o + "queueHooks"], T = s.timers, N = y ? y.length : 0;
          for (h.finish = !0, s.queue(this, o, []), C && C.stop && C.stop.call(this, !0), l = T.length; l--; )
            T[l].elem === this && T[l].queue === o && (T[l].anim.stop(!0), T.splice(l, 1));
          for (l = 0; l < N; l++)
            y[l] && y[l].finish && y[l].finish.call(this);
          delete h.finish;
        });
      }
    }), s.each(["toggle", "show", "hide"], function(o, l) {
      var h = s.fn[l];
      s.fn[l] = function(y, C, T) {
        return y == null || typeof y == "boolean" ? h.apply(this, arguments) : this.animate(xi(l, !0), y, C, T);
      };
    }), s.each({
      slideDown: xi("show"),
      slideUp: xi("hide"),
      slideToggle: xi("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(o, l) {
      s.fn[o] = function(h, y, C) {
        return this.animate(l, h, y, C);
      };
    }), s.timers = [], s.fx.tick = function() {
      var o, l = s.timers, h = 0;
      for (_i = s.now(); h < l.length; h++)
        o = l[h], !o() && l[h] === o && l.splice(h--, 1);
      l.length || s.fx.stop(), _i = void 0;
    }, s.fx.timer = function(o) {
      s.timers.push(o), o() ? s.fx.start() : s.timers.pop();
    }, s.fx.interval = 13, s.fx.start = function() {
      Co || (Co = n.setInterval(s.fx.tick, s.fx.interval));
    }, s.fx.stop = function() {
      n.clearInterval(Co), Co = null;
    }, s.fx.speeds = {
      slow: 600,
      fast: 200,
      // Default speed
      _default: 400
    }, s.fn.delay = function(o, l) {
      return o = s.fx && s.fx.speeds[o] || o, l = l || "fx", this.queue(l, function(h, y) {
        var C = n.setTimeout(h, o);
        y.stop = function() {
          n.clearTimeout(C);
        };
      });
    }, function() {
      var o, l = u.createElement("input"), h = u.createElement("div"), y = u.createElement("select"), C = y.appendChild(u.createElement("option"));
      h = u.createElement("div"), h.setAttribute("className", "t"), h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", o = h.getElementsByTagName("a")[0], l.setAttribute("type", "checkbox"), h.appendChild(l), o = h.getElementsByTagName("a")[0], o.style.cssText = "top:1px", m.getSetAttribute = h.className !== "t", m.style = /top/.test(o.getAttribute("style")), m.hrefNormalized = o.getAttribute("href") === "/a", m.checkOn = !!l.value, m.optSelected = C.selected, m.enctype = !!u.createElement("form").enctype, y.disabled = !0, m.optDisabled = !C.disabled, l = u.createElement("input"), l.setAttribute("value", ""), m.input = l.getAttribute("value") === "", l.value = "t", l.setAttribute("type", "radio"), m.radioValue = l.value === "t";
    }();
    var Fl = /\r/g, Bs = /[\x20\t\r\n\f]+/g;
    s.fn.extend({
      val: function(o) {
        var l, h, y, C = this[0];
        return arguments.length ? (y = s.isFunction(o), this.each(function(T) {
          var N;
          this.nodeType === 1 && (y ? N = o.call(this, T, s(this).val()) : N = o, N == null ? N = "" : typeof N == "number" ? N += "" : s.isArray(N) && (N = s.map(N, function(q) {
            return q == null ? "" : q + "";
          })), l = s.valHooks[this.type] || s.valHooks[this.nodeName.toLowerCase()], (!l || !("set" in l) || l.set(this, N, "value") === void 0) && (this.value = N));
        })) : C ? (l = s.valHooks[C.type] || s.valHooks[C.nodeName.toLowerCase()], l && "get" in l && (h = l.get(C, "value")) !== void 0 ? h : (h = C.value, typeof h == "string" ? (
          // handle most common string cases
          h.replace(Fl, "")
        ) : (
          // handle cases where value is null/undef or number
          h ?? ""
        ))) : void 0;
      }
    }), s.extend({
      valHooks: {
        option: {
          get: function(o) {
            var l = s.find.attr(o, "value");
            return l ?? // Support: IE10-11+
            // option.text throws exceptions (#14686, #14858)
            // Strip and collapse whitespace
            // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
            s.trim(s.text(o)).replace(Bs, " ");
          }
        },
        select: {
          get: function(o) {
            for (var l, h, y = o.options, C = o.selectedIndex, T = o.type === "select-one" || C < 0, N = T ? null : [], q = T ? C + 1 : y.length, V = C < 0 ? q : T ? C : 0; V < q; V++)
              if (h = y[V], (h.selected || V === C) && // Don't return options that are disabled or in a disabled optgroup
              (m.optDisabled ? !h.disabled : h.getAttribute("disabled") === null) && (!h.parentNode.disabled || !s.nodeName(h.parentNode, "optgroup"))) {
                if (l = s(h).val(), T)
                  return l;
                N.push(l);
              }
            return N;
          },
          set: function(o, l) {
            for (var h, y, C = o.options, T = s.makeArray(l), N = C.length; N--; )
              if (y = C[N], s.inArray(s.valHooks.option.get(y), T) > -1)
                try {
                  y.selected = h = !0;
                } catch {
                  y.scrollHeight;
                }
              else
                y.selected = !1;
            return h || (o.selectedIndex = -1), C;
          }
        }
      }
    }), s.each(["radio", "checkbox"], function() {
      s.valHooks[this] = {
        set: function(o, l) {
          if (s.isArray(l))
            return o.checked = s.inArray(s(o).val(), l) > -1;
        }
      }, m.checkOn || (s.valHooks[this].get = function(o) {
        return o.getAttribute("value") === null ? "on" : o.value;
      });
    });
    var Xr, To, ur = s.expr.attrHandle, Po = /^(?:checked|selected)$/i, lr = m.getSetAttribute, Si = m.input;
    s.fn.extend({
      attr: function(o, l) {
        return $e(this, s.attr, o, l, arguments.length > 1);
      },
      removeAttr: function(o) {
        return this.each(function() {
          s.removeAttr(this, o);
        });
      }
    }), s.extend({
      attr: function(o, l, h) {
        var y, C, T = o.nodeType;
        if (!(T === 3 || T === 8 || T === 2)) {
          if (typeof o.getAttribute > "u")
            return s.prop(o, l, h);
          if ((T !== 1 || !s.isXMLDoc(o)) && (l = l.toLowerCase(), C = s.attrHooks[l] || (s.expr.match.bool.test(l) ? To : Xr)), h !== void 0) {
            if (h === null) {
              s.removeAttr(o, l);
              return;
            }
            return C && "set" in C && (y = C.set(o, h, l)) !== void 0 ? y : (o.setAttribute(l, h + ""), h);
          }
          return C && "get" in C && (y = C.get(o, l)) !== null ? y : (y = s.find.attr(o, l), y ?? void 0);
        }
      },
      attrHooks: {
        type: {
          set: function(o, l) {
            if (!m.radioValue && l === "radio" && s.nodeName(o, "input")) {
              var h = o.value;
              return o.setAttribute("type", l), h && (o.value = h), l;
            }
          }
        }
      },
      removeAttr: function(o, l) {
        var h, y, C = 0, T = l && l.match(pe);
        if (T && o.nodeType === 1)
          for (; h = T[C++]; )
            y = s.propFix[h] || h, s.expr.match.bool.test(h) ? Si && lr || !Po.test(h) ? o[y] = !1 : o[s.camelCase("default-" + h)] = o[y] = !1 : s.attr(o, h, ""), o.removeAttribute(lr ? h : y);
      }
    }), To = {
      set: function(o, l, h) {
        return l === !1 ? s.removeAttr(o, h) : Si && lr || !Po.test(h) ? o.setAttribute(!lr && s.propFix[h] || h, h) : o[s.camelCase("default-" + h)] = o[h] = !0, h;
      }
    }, s.each(s.expr.match.bool.source.match(/\w+/g), function(o, l) {
      var h = ur[l] || s.find.attr;
      Si && lr || !Po.test(l) ? ur[l] = function(y, C, T) {
        var N, q;
        return T || (q = ur[C], ur[C] = N, N = h(y, C, T) != null ? C.toLowerCase() : null, ur[C] = q), N;
      } : ur[l] = function(y, C, T) {
        if (!T)
          return y[s.camelCase("default-" + C)] ? C.toLowerCase() : null;
      };
    }), (!Si || !lr) && (s.attrHooks.value = {
      set: function(o, l, h) {
        if (s.nodeName(o, "input"))
          o.defaultValue = l;
        else
          return Xr && Xr.set(o, l, h);
      }
    }), lr || (Xr = {
      set: function(o, l, h) {
        var y = o.getAttributeNode(h);
        if (y || o.setAttributeNode(
          y = o.ownerDocument.createAttribute(h)
        ), y.value = l += "", h === "value" || l === o.getAttribute(h))
          return l;
      }
    }, ur.id = ur.name = ur.coords = function(o, l, h) {
      var y;
      if (!h)
        return (y = o.getAttributeNode(l)) && y.value !== "" ? y.value : null;
    }, s.valHooks.button = {
      get: function(o, l) {
        var h = o.getAttributeNode(l);
        if (h && h.specified)
          return h.value;
      },
      set: Xr.set
    }, s.attrHooks.contenteditable = {
      set: function(o, l, h) {
        Xr.set(o, l === "" ? !1 : l, h);
      }
    }, s.each(["width", "height"], function(o, l) {
      s.attrHooks[l] = {
        set: function(h, y) {
          if (y === "")
            return h.setAttribute(l, "auto"), y;
        }
      };
    })), m.style || (s.attrHooks.style = {
      get: function(o) {
        return o.style.cssText || void 0;
      },
      set: function(o, l) {
        return o.style.cssText = l + "";
      }
    });
    var $i = /^(?:input|select|textarea|button|object)$/i, js = /^(?:a|area)$/i;
    s.fn.extend({
      prop: function(o, l) {
        return $e(this, s.prop, o, l, arguments.length > 1);
      },
      removeProp: function(o) {
        return o = s.propFix[o] || o, this.each(function() {
          try {
            this[o] = void 0, delete this[o];
          } catch {
          }
        });
      }
    }), s.extend({
      prop: function(o, l, h) {
        var y, C, T = o.nodeType;
        if (!(T === 3 || T === 8 || T === 2))
          return (T !== 1 || !s.isXMLDoc(o)) && (l = s.propFix[l] || l, C = s.propHooks[l]), h !== void 0 ? C && "set" in C && (y = C.set(o, h, l)) !== void 0 ? y : o[l] = h : C && "get" in C && (y = C.get(o, l)) !== null ? y : o[l];
      },
      propHooks: {
        tabIndex: {
          get: function(o) {
            var l = s.find.attr(o, "tabindex");
            return l ? parseInt(l, 10) : $i.test(o.nodeName) || js.test(o.nodeName) && o.href ? 0 : -1;
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), m.hrefNormalized || s.each(["href", "src"], function(o, l) {
      s.propHooks[l] = {
        get: function(h) {
          return h.getAttribute(l, 4);
        }
      };
    }), m.optSelected || (s.propHooks.selected = {
      get: function(o) {
        var l = o.parentNode;
        return l && (l.selectedIndex, l.parentNode && l.parentNode.selectedIndex), null;
      },
      set: function(o) {
        var l = o.parentNode;
        l && (l.selectedIndex, l.parentNode && l.parentNode.selectedIndex);
      }
    }), s.each([
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
      s.propFix[this.toLowerCase()] = this;
    }), m.enctype || (s.propFix.enctype = "encoding");
    var ko = /[\t\r\n\f]/g;
    function Yr(o) {
      return s.attr(o, "class") || "";
    }
    s.fn.extend({
      addClass: function(o) {
        var l, h, y, C, T, N, q, V = 0;
        if (s.isFunction(o))
          return this.each(function(G) {
            s(this).addClass(o.call(this, G, Yr(this)));
          });
        if (typeof o == "string" && o) {
          for (l = o.match(pe) || []; h = this[V++]; )
            if (C = Yr(h), y = h.nodeType === 1 && (" " + C + " ").replace(ko, " "), y) {
              for (N = 0; T = l[N++]; )
                y.indexOf(" " + T + " ") < 0 && (y += T + " ");
              q = s.trim(y), C !== q && s.attr(h, "class", q);
            }
        }
        return this;
      },
      removeClass: function(o) {
        var l, h, y, C, T, N, q, V = 0;
        if (s.isFunction(o))
          return this.each(function(G) {
            s(this).removeClass(o.call(this, G, Yr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof o == "string" && o) {
          for (l = o.match(pe) || []; h = this[V++]; )
            if (C = Yr(h), y = h.nodeType === 1 && (" " + C + " ").replace(ko, " "), y) {
              for (N = 0; T = l[N++]; )
                for (; y.indexOf(" " + T + " ") > -1; )
                  y = y.replace(" " + T + " ", " ");
              q = s.trim(y), C !== q && s.attr(h, "class", q);
            }
        }
        return this;
      },
      toggleClass: function(o, l) {
        var h = typeof o;
        return typeof l == "boolean" && h === "string" ? l ? this.addClass(o) : this.removeClass(o) : s.isFunction(o) ? this.each(function(y) {
          s(this).toggleClass(
            o.call(this, y, Yr(this), l),
            l
          );
        }) : this.each(function() {
          var y, C, T, N;
          if (h === "string")
            for (C = 0, T = s(this), N = o.match(pe) || []; y = N[C++]; )
              T.hasClass(y) ? T.removeClass(y) : T.addClass(y);
          else (o === void 0 || h === "boolean") && (y = Yr(this), y && s._data(this, "__className__", y), s.attr(
            this,
            "class",
            y || o === !1 ? "" : s._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(o) {
        var l, h, y = 0;
        for (l = " " + o + " "; h = this[y++]; )
          if (h.nodeType === 1 && (" " + Yr(h) + " ").replace(ko, " ").indexOf(l) > -1)
            return !0;
        return !1;
      }
    }), s.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
      function(o, l) {
        s.fn[l] = function(h, y) {
          return arguments.length > 0 ? this.on(l, null, h, y) : this.trigger(l);
        };
      }
    ), s.fn.extend({
      hover: function(o, l) {
        return this.mouseenter(o).mouseleave(l || o);
      }
    });
    var Hs = n.location, No = s.now(), Oo = /\?/, Ws = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    s.parseJSON = function(o) {
      if (n.JSON && n.JSON.parse)
        return n.JSON.parse(o + "");
      var l, h = null, y = s.trim(o + "");
      return y && !s.trim(y.replace(Ws, function(C, T, N, q) {
        return l && T && (h = 0), h === 0 ? C : (l = N || T, h += !q - !N, "");
      })) ? Function("return " + y)() : s.error("Invalid JSON: " + o);
    }, s.parseXML = function(o) {
      var l, h;
      if (!o || typeof o != "string")
        return null;
      try {
        n.DOMParser ? (h = new n.DOMParser(), l = h.parseFromString(o, "text/xml")) : (l = new n.ActiveXObject("Microsoft.XMLDOM"), l.async = "false", l.loadXML(o));
      } catch {
        l = void 0;
      }
      return (!l || !l.documentElement || l.getElementsByTagName("parsererror").length) && s.error("Invalid XML: " + o), l;
    };
    var ql = /#.*$/, Vs = /([?&])_=[^&]*/, zl = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, Us = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Bl = /^(?:GET|HEAD)$/, jl = /^\/\//, Gs = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Ks = {}, Ki = {}, Xs = "*/".concat("*"), $a = Hs.href, Ei = Gs.exec($a.toLowerCase()) || [];
    function Ys(o) {
      return function(l, h) {
        typeof l != "string" && (h = l, l = "*");
        var y, C = 0, T = l.toLowerCase().match(pe) || [];
        if (s.isFunction(h))
          for (; y = T[C++]; )
            y.charAt(0) === "+" ? (y = y.slice(1) || "*", (o[y] = o[y] || []).unshift(h)) : (o[y] = o[y] || []).push(h);
      };
    }
    function Qs(o, l, h, y) {
      var C = {}, T = o === Ki;
      function N(q) {
        var V;
        return C[q] = !0, s.each(o[q] || [], function(G, Z) {
          var me = Z(l, h, y);
          if (typeof me == "string" && !T && !C[me])
            return l.dataTypes.unshift(me), N(me), !1;
          if (T)
            return !(V = me);
        }), V;
      }
      return N(l.dataTypes[0]) || !C["*"] && N("*");
    }
    function Rt(o, l) {
      var h, y, C = s.ajaxSettings.flatOptions || {};
      for (y in l)
        l[y] !== void 0 && ((C[y] ? o : h || (h = {}))[y] = l[y]);
      return h && s.extend(!0, o, h), o;
    }
    function Dt(o, l, h) {
      for (var y, C, T, N, q = o.contents, V = o.dataTypes; V[0] === "*"; )
        V.shift(), C === void 0 && (C = o.mimeType || l.getResponseHeader("Content-Type"));
      if (C) {
        for (N in q)
          if (q[N] && q[N].test(C)) {
            V.unshift(N);
            break;
          }
      }
      if (V[0] in h)
        T = V[0];
      else {
        for (N in h) {
          if (!V[0] || o.converters[N + " " + V[0]]) {
            T = N;
            break;
          }
          y || (y = N);
        }
        T = T || y;
      }
      if (T)
        return T !== V[0] && V.unshift(T), h[T];
    }
    function Hl(o, l, h, y) {
      var C, T, N, q, V, G = {}, Z = o.dataTypes.slice();
      if (Z[1])
        for (N in o.converters)
          G[N.toLowerCase()] = o.converters[N];
      for (T = Z.shift(); T; )
        if (o.responseFields[T] && (h[o.responseFields[T]] = l), !V && y && o.dataFilter && (l = o.dataFilter(l, o.dataType)), V = T, T = Z.shift(), T) {
          if (T === "*")
            T = V;
          else if (V !== "*" && V !== T) {
            if (N = G[V + " " + T] || G["* " + T], !N) {
              for (C in G)
                if (q = C.split(" "), q[1] === T && (N = G[V + " " + q[0]] || G["* " + q[0]], N)) {
                  N === !0 ? N = G[C] : G[C] !== !0 && (T = q[0], Z.unshift(q[1]));
                  break;
                }
            }
            if (N !== !0)
              if (N && o.throws)
                l = N(l);
              else
                try {
                  l = N(l);
                } catch (me) {
                  return {
                    state: "parsererror",
                    error: N ? me : "No conversion from " + V + " to " + T
                  };
                }
          }
        }
      return { state: "success", data: l };
    }
    s.extend({
      // Counter for holding the number of active queries
      active: 0,
      // Last-Modified header cache for next request
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: $a,
        type: "GET",
        isLocal: Us.test(Ei[1]),
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
          "*": Xs,
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
          "text json": s.parseJSON,
          // Parse text as xml
          "text xml": s.parseXML
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
      ajaxSetup: function(o, l) {
        return l ? (
          // Building a settings object
          Rt(Rt(o, s.ajaxSettings), l)
        ) : (
          // Extending ajaxSettings
          Rt(s.ajaxSettings, o)
        );
      },
      ajaxPrefilter: Ys(Ks),
      ajaxTransport: Ys(Ki),
      // Main method
      ajax: function(o, l) {
        typeof o == "object" && (l = o, o = void 0), l = l || {};
        var h, y, C, T, N, q, V, G, Z = s.ajaxSetup({}, l), me = Z.context || Z, Pe = Z.context && (me.nodeType || me.jquery) ? s(me) : s.event, ve = s.Deferred(), nt = s.Callbacks("once memory"), Ye = Z.statusCode || {}, st = {}, on = {}, Wt = 0, Pr = "canceled", De = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(ut) {
            var jt;
            if (Wt === 2) {
              if (!G)
                for (G = {}; jt = zl.exec(T); )
                  G[jt[1].toLowerCase()] = jt[2];
              jt = G[ut.toLowerCase()];
            }
            return jt ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return Wt === 2 ? T : null;
          },
          // Caches the header
          setRequestHeader: function(ut, jt) {
            var cr = ut.toLowerCase();
            return Wt || (ut = on[cr] = on[cr] || ut, st[ut] = jt), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(ut) {
            return Wt || (Z.mimeType = ut), this;
          },
          // Status-dependent callbacks
          statusCode: function(ut) {
            var jt;
            if (ut)
              if (Wt < 2)
                for (jt in ut)
                  Ye[jt] = [Ye[jt], ut[jt]];
              else
                De.always(ut[De.status]);
            return this;
          },
          // Cancel the request
          abort: function(ut) {
            var jt = ut || Pr;
            return V && V.abort(jt), tn(0, jt), this;
          }
        };
        if (ve.promise(De).complete = nt.add, De.success = De.done, De.error = De.fail, Z.url = ((o || Z.url || $a) + "").replace(ql, "").replace(jl, Ei[1] + "//"), Z.type = l.method || l.type || Z.method || Z.type, Z.dataTypes = s.trim(Z.dataType || "*").toLowerCase().match(pe) || [""], Z.crossDomain == null && (h = Gs.exec(Z.url.toLowerCase()), Z.crossDomain = !!(h && (h[1] !== Ei[1] || h[2] !== Ei[2] || (h[3] || (h[1] === "http:" ? "80" : "443")) !== (Ei[3] || (Ei[1] === "http:" ? "80" : "443"))))), Z.data && Z.processData && typeof Z.data != "string" && (Z.data = s.param(Z.data, Z.traditional)), Qs(Ks, Z, l, De), Wt === 2)
          return De;
        q = s.event && Z.global, q && s.active++ === 0 && s.event.trigger("ajaxStart"), Z.type = Z.type.toUpperCase(), Z.hasContent = !Bl.test(Z.type), C = Z.url, Z.hasContent || (Z.data && (C = Z.url += (Oo.test(C) ? "&" : "?") + Z.data, delete Z.data), Z.cache === !1 && (Z.url = Vs.test(C) ? (
          // If there is already a '_' parameter, set its value
          C.replace(Vs, "$1_=" + No++)
        ) : (
          // Otherwise add one to the end
          C + (Oo.test(C) ? "&" : "?") + "_=" + No++
        ))), Z.ifModified && (s.lastModified[C] && De.setRequestHeader("If-Modified-Since", s.lastModified[C]), s.etag[C] && De.setRequestHeader("If-None-Match", s.etag[C])), (Z.data && Z.hasContent && Z.contentType !== !1 || l.contentType) && De.setRequestHeader("Content-Type", Z.contentType), De.setRequestHeader(
          "Accept",
          Z.dataTypes[0] && Z.accepts[Z.dataTypes[0]] ? Z.accepts[Z.dataTypes[0]] + (Z.dataTypes[0] !== "*" ? ", " + Xs + "; q=0.01" : "") : Z.accepts["*"]
        );
        for (y in Z.headers)
          De.setRequestHeader(y, Z.headers[y]);
        if (Z.beforeSend && (Z.beforeSend.call(me, De, Z) === !1 || Wt === 2))
          return De.abort();
        Pr = "abort";
        for (y in { success: 1, error: 1, complete: 1 })
          De[y](Z[y]);
        if (V = Qs(Ki, Z, l, De), !V)
          tn(-1, "No Transport");
        else {
          if (De.readyState = 1, q && Pe.trigger("ajaxSend", [De, Z]), Wt === 2)
            return De;
          Z.async && Z.timeout > 0 && (N = n.setTimeout(function() {
            De.abort("timeout");
          }, Z.timeout));
          try {
            Wt = 1, V.send(st, tn);
          } catch (ut) {
            if (Wt < 2)
              tn(-1, ut);
            else
              throw ut;
          }
        }
        function tn(ut, jt, cr, Ro) {
          var yn, fr, kr, dr, It, wn = jt;
          Wt !== 2 && (Wt = 2, N && n.clearTimeout(N), V = void 0, T = Ro || "", De.readyState = ut > 0 ? 4 : 0, yn = ut >= 200 && ut < 300 || ut === 304, cr && (dr = Dt(Z, De, cr)), dr = Hl(Z, dr, De, yn), yn ? (Z.ifModified && (It = De.getResponseHeader("Last-Modified"), It && (s.lastModified[C] = It), It = De.getResponseHeader("etag"), It && (s.etag[C] = It)), ut === 204 || Z.type === "HEAD" ? wn = "nocontent" : ut === 304 ? wn = "notmodified" : (wn = dr.state, fr = dr.data, kr = dr.error, yn = !kr)) : (kr = wn, (ut || !wn) && (wn = "error", ut < 0 && (ut = 0))), De.status = ut, De.statusText = (jt || wn) + "", yn ? ve.resolveWith(me, [fr, wn, De]) : ve.rejectWith(me, [De, wn, kr]), De.statusCode(Ye), Ye = void 0, q && Pe.trigger(
            yn ? "ajaxSuccess" : "ajaxError",
            [De, Z, yn ? fr : kr]
          ), nt.fireWith(me, [De, wn]), q && (Pe.trigger("ajaxComplete", [De, Z]), --s.active || s.event.trigger("ajaxStop")));
        }
        return De;
      },
      getJSON: function(o, l, h) {
        return s.get(o, l, h, "json");
      },
      getScript: function(o, l) {
        return s.get(o, void 0, l, "script");
      }
    }), s.each(["get", "post"], function(o, l) {
      s[l] = function(h, y, C, T) {
        return s.isFunction(y) && (T = T || C, C = y, y = void 0), s.ajax(s.extend({
          url: h,
          type: l,
          dataType: T,
          data: y,
          success: C
        }, s.isPlainObject(h) && h));
      };
    }), s._evalUrl = function(o) {
      return s.ajax({
        url: o,
        // Make this explicit, since user can override this through ajaxSetup (#11264)
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        throws: !0
      });
    }, s.fn.extend({
      wrapAll: function(o) {
        if (s.isFunction(o))
          return this.each(function(h) {
            s(this).wrapAll(o.call(this, h));
          });
        if (this[0]) {
          var l = s(o, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && l.insertBefore(this[0]), l.map(function() {
            for (var h = this; h.firstChild && h.firstChild.nodeType === 1; )
              h = h.firstChild;
            return h;
          }).append(this);
        }
        return this;
      },
      wrapInner: function(o) {
        return s.isFunction(o) ? this.each(function(l) {
          s(this).wrapInner(o.call(this, l));
        }) : this.each(function() {
          var l = s(this), h = l.contents();
          h.length ? h.wrapAll(o) : l.append(o);
        });
      },
      wrap: function(o) {
        var l = s.isFunction(o);
        return this.each(function(h) {
          s(this).wrapAll(l ? o.call(this, h) : o);
        });
      },
      unwrap: function() {
        return this.parent().each(function() {
          s.nodeName(this, "body") || s(this).replaceWith(this.childNodes);
        }).end();
      }
    });
    function Wl(o) {
      return o.style && o.style.display || s.css(o, "display");
    }
    function Vl(o) {
      if (!s.contains(o.ownerDocument || u, o))
        return !0;
      for (; o && o.nodeType === 1; ) {
        if (Wl(o) === "none" || o.type === "hidden")
          return !0;
        o = o.parentNode;
      }
      return !1;
    }
    s.expr.filters.hidden = function(o) {
      return m.reliableHiddenOffsets() ? o.offsetWidth <= 0 && o.offsetHeight <= 0 && !o.getClientRects().length : Vl(o);
    }, s.expr.filters.visible = function(o) {
      return !s.expr.filters.hidden(o);
    };
    var Ul = /%20/g, Gl = /\[\]$/, Js = /\r?\n/g, Zs = /^(?:submit|button|image|reset|file)$/i, Kl = /^(?:input|select|textarea|keygen)/i;
    function Kt(o, l, h, y) {
      var C;
      if (s.isArray(l))
        s.each(l, function(T, N) {
          h || Gl.test(o) ? y(o, N) : Kt(
            o + "[" + (typeof N == "object" && N != null ? T : "") + "]",
            N,
            h,
            y
          );
        });
      else if (!h && s.type(l) === "object")
        for (C in l)
          Kt(o + "[" + C + "]", l[C], h, y);
      else
        y(o, l);
    }
    s.param = function(o, l) {
      var h, y = [], C = function(T, N) {
        N = s.isFunction(N) ? N() : N ?? "", y[y.length] = encodeURIComponent(T) + "=" + encodeURIComponent(N);
      };
      if (l === void 0 && (l = s.ajaxSettings && s.ajaxSettings.traditional), s.isArray(o) || o.jquery && !s.isPlainObject(o))
        s.each(o, function() {
          C(this.name, this.value);
        });
      else
        for (h in o)
          Kt(h, o[h], l, C);
      return y.join("&").replace(Ul, "+");
    }, s.fn.extend({
      serialize: function() {
        return s.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var o = s.prop(this, "elements");
          return o ? s.makeArray(o) : this;
        }).filter(function() {
          var o = this.type;
          return this.name && !s(this).is(":disabled") && Kl.test(this.nodeName) && !Zs.test(o) && (this.checked || !at.test(o));
        }).map(function(o, l) {
          var h = s(this).val();
          return h == null ? null : s.isArray(h) ? s.map(h, function(y) {
            return { name: l.name, value: y.replace(Js, `\r
`) };
          }) : { name: l.name, value: h.replace(Js, `\r
`) };
        }).get();
      }
    }), s.ajaxSettings.xhr = n.ActiveXObject !== void 0 ? (
      // Support: IE6-IE8
      function() {
        return this.isLocal ? En() : u.documentMode > 8 ? Xi() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Xi() || En();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      Xi
    );
    var Ea = 0, Yn = {}, Ci = s.ajaxSettings.xhr();
    n.attachEvent && n.attachEvent("onunload", function() {
      for (var o in Yn)
        Yn[o](void 0, !0);
    }), m.cors = !!Ci && "withCredentials" in Ci, Ci = m.ajax = !!Ci, Ci && s.ajaxTransport(function(o) {
      if (!o.crossDomain || m.cors) {
        var l;
        return {
          send: function(h, y) {
            var C, T = o.xhr(), N = ++Ea;
            if (T.open(
              o.type,
              o.url,
              o.async,
              o.username,
              o.password
            ), o.xhrFields)
              for (C in o.xhrFields)
                T[C] = o.xhrFields[C];
            o.mimeType && T.overrideMimeType && T.overrideMimeType(o.mimeType), !o.crossDomain && !h["X-Requested-With"] && (h["X-Requested-With"] = "XMLHttpRequest");
            for (C in h)
              h[C] !== void 0 && T.setRequestHeader(C, h[C] + "");
            T.send(o.hasContent && o.data || null), l = function(q, V) {
              var G, Z, me;
              if (l && (V || T.readyState === 4))
                if (delete Yn[N], l = void 0, T.onreadystatechange = s.noop, V)
                  T.readyState !== 4 && T.abort();
                else {
                  me = {}, G = T.status, typeof T.responseText == "string" && (me.text = T.responseText);
                  try {
                    Z = T.statusText;
                  } catch {
                    Z = "";
                  }
                  !G && o.isLocal && !o.crossDomain ? G = me.text ? 200 : 404 : G === 1223 && (G = 204);
                }
              me && y(G, Z, me, T.getAllResponseHeaders());
            }, o.async ? T.readyState === 4 ? n.setTimeout(l) : T.onreadystatechange = Yn[N] = l : l();
          },
          abort: function() {
            l && l(void 0, !0);
          }
        };
      }
    });
    function Xi() {
      try {
        return new n.XMLHttpRequest();
      } catch {
      }
    }
    function En() {
      try {
        return new n.ActiveXObject("Microsoft.XMLHTTP");
      } catch {
      }
    }
    s.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function(o) {
          return s.globalEval(o), o;
        }
      }
    }), s.ajaxPrefilter("script", function(o) {
      o.cache === void 0 && (o.cache = !1), o.crossDomain && (o.type = "GET", o.global = !1);
    }), s.ajaxTransport("script", function(o) {
      if (o.crossDomain) {
        var l, h = u.head || s("head")[0] || u.documentElement;
        return {
          send: function(y, C) {
            l = u.createElement("script"), l.async = !0, o.scriptCharset && (l.charset = o.scriptCharset), l.src = o.url, l.onload = l.onreadystatechange = function(T, N) {
              (N || !l.readyState || /loaded|complete/.test(l.readyState)) && (l.onload = l.onreadystatechange = null, l.parentNode && l.parentNode.removeChild(l), l = null, N || C(200, "success"));
            }, h.insertBefore(l, h.firstChild);
          },
          abort: function() {
            l && l.onload(void 0, !0);
          }
        };
      }
    });
    var Ca = [], Lo = /(=)\?(?=&|$)|\?\?/;
    s.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var o = Ca.pop() || s.expando + "_" + No++;
        return this[o] = !0, o;
      }
    }), s.ajaxPrefilter("json jsonp", function(o, l, h) {
      var y, C, T, N = o.jsonp !== !1 && (Lo.test(o.url) ? "url" : typeof o.data == "string" && (o.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Lo.test(o.data) && "data");
      if (N || o.dataTypes[0] === "jsonp")
        return y = o.jsonpCallback = s.isFunction(o.jsonpCallback) ? o.jsonpCallback() : o.jsonpCallback, N ? o[N] = o[N].replace(Lo, "$1" + y) : o.jsonp !== !1 && (o.url += (Oo.test(o.url) ? "&" : "?") + o.jsonp + "=" + y), o.converters["script json"] = function() {
          return T || s.error(y + " was not called"), T[0];
        }, o.dataTypes[0] = "json", C = n[y], n[y] = function() {
          T = arguments;
        }, h.always(function() {
          C === void 0 ? s(n).removeProp(y) : n[y] = C, o[y] && (o.jsonpCallback = l.jsonpCallback, Ca.push(y)), T && s.isFunction(C) && C(T[0]), T = C = void 0;
        }), "script";
    }), s.parseHTML = function(o, l, h) {
      if (!o || typeof o != "string")
        return null;
      typeof l == "boolean" && (h = l, l = !1), l = l || u;
      var y = Se.exec(o), C = !h && [];
      return y ? [l.createElement(y[1])] : (y = un([o], l, C), C && C.length && s(C).remove(), s.merge([], y.childNodes));
    };
    var Aa = s.fn.load;
    s.fn.load = function(o, l, h) {
      if (typeof o != "string" && Aa)
        return Aa.apply(this, arguments);
      var y, C, T, N = this, q = o.indexOf(" ");
      return q > -1 && (y = s.trim(o.slice(q, o.length)), o = o.slice(0, q)), s.isFunction(l) ? (h = l, l = void 0) : l && typeof l == "object" && (C = "POST"), N.length > 0 && s.ajax({
        url: o,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: C || "GET",
        dataType: "html",
        data: l
      }).done(function(V) {
        T = arguments, N.html(y ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          s("<div>").append(s.parseHTML(V)).find(y)
        ) : (
          // Otherwise use the full result
          V
        ));
      }).always(h && function(V, G) {
        N.each(function() {
          h.apply(this, T || [V.responseText, G, V]);
        });
      }), this;
    }, s.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(o, l) {
      s.fn[l] = function(h) {
        return this.on(l, h);
      };
    }), s.expr.filters.animated = function(o) {
      return s.grep(s.timers, function(l) {
        return o === l.elem;
      }).length;
    };
    function Ta(o) {
      return s.isWindow(o) ? o : o.nodeType === 9 ? o.defaultView || o.parentWindow : !1;
    }
    s.offset = {
      setOffset: function(o, l, h) {
        var y, C, T, N, q, V, G, Z = s.css(o, "position"), me = s(o), Pe = {};
        Z === "static" && (o.style.position = "relative"), q = me.offset(), T = s.css(o, "top"), V = s.css(o, "left"), G = (Z === "absolute" || Z === "fixed") && s.inArray("auto", [T, V]) > -1, G ? (y = me.position(), N = y.top, C = y.left) : (N = parseFloat(T) || 0, C = parseFloat(V) || 0), s.isFunction(l) && (l = l.call(o, h, s.extend({}, q))), l.top != null && (Pe.top = l.top - q.top + N), l.left != null && (Pe.left = l.left - q.left + C), "using" in l ? l.using.call(o, Pe) : me.css(Pe);
      }
    }, s.fn.extend({
      offset: function(o) {
        if (arguments.length)
          return o === void 0 ? this : this.each(function(N) {
            s.offset.setOffset(this, o, N);
          });
        var l, h, y = { top: 0, left: 0 }, C = this[0], T = C && C.ownerDocument;
        if (T)
          return l = T.documentElement, s.contains(l, C) ? (typeof C.getBoundingClientRect < "u" && (y = C.getBoundingClientRect()), h = Ta(T), {
            top: y.top + (h.pageYOffset || l.scrollTop) - (l.clientTop || 0),
            left: y.left + (h.pageXOffset || l.scrollLeft) - (l.clientLeft || 0)
          }) : y;
      },
      position: function() {
        if (this[0]) {
          var o, l, h = { top: 0, left: 0 }, y = this[0];
          return s.css(y, "position") === "fixed" ? l = y.getBoundingClientRect() : (o = this.offsetParent(), l = this.offset(), s.nodeName(o[0], "html") || (h = o.offset()), h.top += s.css(o[0], "borderTopWidth", !0), h.left += s.css(o[0], "borderLeftWidth", !0)), {
            top: l.top - h.top - s.css(y, "marginTop", !0),
            left: l.left - h.left - s.css(y, "marginLeft", !0)
          };
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var o = this.offsetParent; o && !s.nodeName(o, "html") && s.css(o, "position") === "static"; )
            o = o.offsetParent;
          return o || Os;
        });
      }
    }), s.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(o, l) {
      var h = /Y/.test(l);
      s.fn[o] = function(y) {
        return $e(this, function(C, T, N) {
          var q = Ta(C);
          if (N === void 0)
            return q ? l in q ? q[l] : q.document.documentElement[T] : C[T];
          q ? q.scrollTo(
            h ? s(q).scrollLeft() : N,
            h ? N : s(q).scrollTop()
          ) : C[T] = N;
        }, o, y, arguments.length, null);
      };
    }), s.each(["top", "left"], function(o, l) {
      s.cssHooks[l] = ya(
        m.pixelPosition,
        function(h, y) {
          if (y)
            return y = Tr(h, l), $o.test(y) ? s(h).position()[l] + "px" : y;
        }
      );
    }), s.each({ Height: "height", Width: "width" }, function(o, l) {
      s.each(
        { padding: "inner" + o, content: l, "": "outer" + o },
        function(h, y) {
          s.fn[y] = function(C, T) {
            var N = arguments.length && (h || typeof C != "boolean"), q = h || (C === !0 || T === !0 ? "margin" : "border");
            return $e(this, function(V, G, Z) {
              var me;
              return s.isWindow(V) ? V.document.documentElement["client" + o] : V.nodeType === 9 ? (me = V.documentElement, Math.max(
                V.body["scroll" + o],
                me["scroll" + o],
                V.body["offset" + o],
                me["offset" + o],
                me["client" + o]
              )) : Z === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                s.css(V, G, q)
              ) : (
                // Set width or height on the element
                s.style(V, G, Z, q)
              );
            }, l, N ? C : void 0, N, null);
          };
        }
      );
    }), s.fn.extend({
      bind: function(o, l, h) {
        return this.on(o, null, l, h);
      },
      unbind: function(o, l) {
        return this.off(o, null, l);
      },
      delegate: function(o, l, h, y) {
        return this.on(l, o, h, y);
      },
      undelegate: function(o, l, h) {
        return arguments.length === 1 ? this.off(o, "**") : this.off(l, o || "**", h);
      }
    }), s.fn.size = function() {
      return this.length;
    }, s.fn.andSelf = s.fn.addBack;
    var eu = n.jQuery, tu = n.$;
    return s.noConflict = function(o) {
      return n.$ === s && (n.$ = tu), o && n.jQuery === s && (n.jQuery = eu), s;
    }, t || (n.jQuery = n.$ = s), s;
  });
})(Sv);
var yN = Sv.exports;
const it = /* @__PURE__ */ ws(yN), wN = function(e) {
  var n = {
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
    onLabelSelectFunction: function(f) {
      alert("Click" + f.number);
    },
    labelSize: 10,
    longestChromosome: 100
  }, t = kt.merge({}, n, e), a = function(f) {
    return f < 1e3 ? f : f < 1e6 ? (f / 1e3).toFixed(1) + "Kb" : (f / 1e6).toFixed(1) + "Mb";
  };
  function u(f) {
    f.each(function(d) {
      var v = He(this).selectAll(".chromosome-label").data([d]), p = v.enter().append("g").attr("class", "chromosome-label");
      p.append("text"), t.border && p.append("rect").classed("border", !0), He(this).selectAll(".chromosome-label").attr("transform", function(m) {
        return "translate(" + t.layout.x + "," + t.layout.y + ")";
      }), He(this).selectAll(".chromosome-label").selectAll("text").attr("x", t.layout.width * 0.5).attr("y", t.layout.height * 0.5).style(
        "font-size",
        Math.max(14 / t.scale, t.layout.chromosomeWidth * 1.2) + "px"
      ).text(d.number).on("click", t.onLabelSelectFunction), t.border && v.select("rect").attr("width", t.layout.width).attr("height", t.layout.height), v.exit().remove();
      var g = He(this).selectAll(".chromosome-size-label").data([d]);
      p = g.enter().append("g").attr("class", "chromosome-size-label"), p.append("text");
      var b = 10 + t.sizeLayout.y + t.sizeLayout.cellHeight * d.length / t.longestChromosome, w = 1.2 * t.labelSize / Math.min(5, t.scale) + "px";
      He(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + t.sizeLayout.x + "," + b + ")"
      ), g = He(this).selectAll(".chromosome-size-label").select("text").attr("x", t.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", w).text(a(d.length)), g.exit().remove();
    });
  }
  return u.longestChromosome = function(f) {
    return arguments.length ? (t.longestChromosome = f, u) : t.longestChromosome;
  }, u.layout = function(f) {
    return arguments.length ? (t.layout = f, u) : t.layout;
  }, u.sizeLayout = function(f) {
    return arguments.length ? (t.sizeLayout = f, u) : t.sizeLayout;
  }, u.scale = function(f) {
    return arguments.length ? (t.scale = f, u) : t.scale;
  }, u.onLabelSelectFunction = function(f) {
    return arguments.length ? (t.onLabelSelectFunction = f, u) : t.onLabelSelectFunction;
  }, u;
}, bN = function(e) {
  var n = {
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
    onAnnotationSelectFunction: it.noop(),
    drawing: null
  }, t = kt.merge({}, n, e), a = function() {
    return _o().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, u = function(g) {
    var b = a(), w = b(g.length), m = He(this);
    m.attr("id", "chromosome_" + g.number).attr(
      "transform",
      "translate(" + t.layout.x + "," + t.layout.y + ")"
    ), m.select("defs").html("").append("mask").attr("id", "chromosome_mask_" + g.number).append("rect").attr("class", "mask_rect"), m.select("#chromosome_mask_" + g.number).attr("width", t.layout.width).attr("height", w);
    var x = {
      width: t.layout.width,
      height: w,
      rx: Math.min(t.layout.width * 0.4, t.layout.height * 0.1),
      ry: Math.min(t.layout.width * 0.4, t.layout.height * 0.1)
    };
    m.select(".mask_rect").attr("width", x.width).attr("height", x.height).attr("rx", x.rx).attr("ry", x.ry), m.select("rect.background").attr("width", x.width).attr("height", x.height).attr("rx", x.rx).attr("ry", x.ry), m.select("rect.outline").attr("width", x.width).attr("height", x.height).attr("rx", x.rx).attr("ry", x.ry);
    var s = [], $ = function() {
      var F = m.selectAll("rect.selection").data(s);
      F.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), F.attr("x", 0).attr("y", function(k) {
        return Math.min(k.start, k.end);
      }).attr("width", t.layout.width).attr("height", function(k) {
        return Math.abs(k.end - k.start);
      }), F.exit().remove();
    }, E = eP().on("start", function(F) {
      var k = _r(F, this);
      s.push({
        start: k[1],
        end: k[1]
      }), $(), F.sourceEvent.stopPropagation();
    }).on("drag", function(F) {
      s[0].end = _r(F, this)[1], $(), F.sourceEvent.stopPropagation(), F.sourceEvent.preventDefault();
    }).on("end", function(F) {
      F.sourceEvent.stopPropagation();
      var k = b.invert(s[0].start), j = b.invert(s[0].end);
      if (k > j) {
        var U = k;
        k = j, j = U;
      }
      var ne = g.layout.geneBandNodes.filter(function(Se) {
        return Se.data.midpoint > k && Se.data.midpoint < j;
      });
      ne.forEach(function(Se) {
        Se.data.type == "gene" ? Se.data.visible = !0 : Se.data.type == "geneslist" && Se.data.genesList.forEach(function(Ce) {
          Ce.visible = !0;
        });
      }), t.onAnnotationSelectFunction(), s = [], $();
    });
    m.select("rect.background").call(E), t.border && m.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
    var A = m.select(".bands_container"), I;
    t.bands == "basemap" ? I = f : t.bands == "genes" && (I = v), I(A, g), m.select(".bands_container").style("mask", "url(#chromosome_mask_" + g.number + ")");
  }, f = function(g, b) {
    var w = a(), m = g.selectAll("rect.band").data(b.bands);
    m.enter().append("rect").attr("class", "band"), m.attr("width", t.layout.width).attr("y", function(x) {
      return w(x.start);
    }).attr("height", function(x) {
      return w(x.end - x.start);
    }).attr("fill", function(x) {
      return x.color;
    }), m.exit().remove();
  }, d = function(g, b) {
    var w = b.end - b.start, m = g(w), x;
    if (m * t.scale > 2)
      x = { y: g(b.start), height: m };
    else {
      let s = Math.min(2 / t.scale, 2);
      x = { y: g(b.midpoint) - s / 2, height: s };
    }
    return x.fill = b.color, x.width = t.layout.width, x["fill-opacity"] = 0.8, x["stroke-dasharray"] = [
      0,
      t.layout.width,
      x.height,
      t.layout.width + x.height
    ], x["stroke-width"] = t.layout.width / 5, x;
  }, v = function(g, b) {
    var w = a(), m = g.selectAll("rect.band"), x = m.data(b.layout.geneBandNodes);
    x.enter().append("rect").attr("id", function($) {
      return $.data.id;
    }).attr("class", "band geneline infobox"), x.each(function($) {
      let E = d(w, $);
      He(this).attr("y", E.y).attr("height", E.height).attr("fill", E.fill).attr("width", E.width).attr("fill-opacity", E["fill-opacity"]).attr("stroke-dasharray", E["stroke-dasharray"]).attr("stroke-width", E["stroke-width"]);
    }), x.classed("selected", function($) {
      return $.data.selected;
    });
    var s = m.data(b.bands);
    s.attr("width", t.layout.width).attr("y", function($) {
      return w($.start);
    }).attr("height", function($) {
      return w($.end - $.start);
    }).attr("fill", function($) {
      return "white";
    }), x.on("click", function($, E) {
      if (E.data.type == "gene" && (E.data.displayed && !E.data.visible && !E.data.hidden ? (E.data.visible = !1, E.data.hidden = !0) : E.data.visible = !E.data.visible, t.onAnnotationSelectFunction()), E.data.type == "geneslist") {
        let A = E.data.genesList.some(function(I) {
          return !I.displayed;
        });
        E.data.genesList.forEach(function(I) {
          I.visible = A, I.hidden = !A;
        }), t.onAnnotationSelectFunction();
      }
    }), x.exit().remove();
  };
  function p(g) {
    g.each(function(b) {
      var w = He(this).selectAll(".chromosome").data([b]), m = w.enter().append("g").attr("class", "chromosome");
      m.append("defs"), m.append("rect").classed("background", !0), m.append("g").classed("bands_container", !0), m.append("rect").classed("outline", !0), t.border && m.append("rect").classed("border", !0), He(this).selectAll(".chromosome").each(u), w.exit().remove();
    });
  }
  return p.onAnnotationSelectFunction = function(g) {
    return arguments.length ? (t.onAnnotationSelectFunction = g, p) : t.onAnnotationSelectFunction;
  }, p.layout = function(g) {
    return arguments.length ? (t.layout = g, p) : t.layout;
  }, p.drawing = function(g) {
    return arguments.length ? (t.drawing = g, p) : t.drawing;
  }, p.longestChromosome = function(g) {
    return arguments.length ? (t.longestChromosome = g, p) : t.longestChromosome;
  }, p.bands = function(g) {
    return arguments.length ? (t.bands = g, p) : t.bands;
  }, p.scale = function(g) {
    return arguments.length ? (t.scale = g, p) : t.scale;
  }, p.infoBoxManager = function(g) {
    return arguments.length ? (t.infoBoxManager = g, p) : t.infoBoxManager;
  }, p;
};
var zn = "top", ir = "bottom", or = "right", Bn = "left", Dd = "auto", Es = [zn, ir, or, Bn], la = "start", gs = "end", _N = "clippingParents", $v = "viewport", Qa = "popper", xN = "reference", $g = /* @__PURE__ */ Es.reduce(function(e, n) {
  return e.concat([n + "-" + la, n + "-" + gs]);
}, []), Ev = /* @__PURE__ */ [].concat(Es, [Dd]).reduce(function(e, n) {
  return e.concat([n, n + "-" + la, n + "-" + gs]);
}, []), SN = "beforeRead", $N = "read", EN = "afterRead", CN = "beforeMain", AN = "main", TN = "afterMain", PN = "beforeWrite", kN = "write", NN = "afterWrite", ON = [SN, $N, EN, CN, AN, TN, PN, kN, NN];
function Hr(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function Gn(e) {
  if (e == null)
    return window;
  if (e.toString() !== "[object Window]") {
    var n = e.ownerDocument;
    return n && n.defaultView || window;
  }
  return e;
}
function bo(e) {
  var n = Gn(e).Element;
  return e instanceof n || e instanceof Element;
}
function rr(e) {
  var n = Gn(e).HTMLElement;
  return e instanceof n || e instanceof HTMLElement;
}
function Id(e) {
  if (typeof ShadowRoot > "u")
    return !1;
  var n = Gn(e).ShadowRoot;
  return e instanceof n || e instanceof ShadowRoot;
}
function LN(e) {
  var n = e.state;
  Object.keys(n.elements).forEach(function(t) {
    var a = n.styles[t] || {}, u = n.attributes[t] || {}, f = n.elements[t];
    !rr(f) || !Hr(f) || (Object.assign(f.style, a), Object.keys(u).forEach(function(d) {
      var v = u[d];
      v === !1 ? f.removeAttribute(d) : f.setAttribute(d, v === !0 ? "" : v);
    }));
  });
}
function RN(e) {
  var n = e.state, t = {
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
  return Object.assign(n.elements.popper.style, t.popper), n.styles = t, n.elements.arrow && Object.assign(n.elements.arrow.style, t.arrow), function() {
    Object.keys(n.elements).forEach(function(a) {
      var u = n.elements[a], f = n.attributes[a] || {}, d = Object.keys(n.styles.hasOwnProperty(a) ? n.styles[a] : t[a]), v = d.reduce(function(p, g) {
        return p[g] = "", p;
      }, {});
      !rr(u) || !Hr(u) || (Object.assign(u.style, v), Object.keys(f).forEach(function(p) {
        u.removeAttribute(p);
      }));
    });
  };
}
const Cv = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: LN,
  effect: RN,
  requires: ["computeStyles"]
};
function jr(e) {
  return e.split("-")[0];
}
var go = Math.max, _l = Math.min, ca = Math.round;
function Af() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands) ? e.brands.map(function(n) {
    return n.brand + "/" + n.version;
  }).join(" ") : navigator.userAgent;
}
function Av() {
  return !/^((?!chrome|android).)*safari/i.test(Af());
}
function fa(e, n, t) {
  n === void 0 && (n = !1), t === void 0 && (t = !1);
  var a = e.getBoundingClientRect(), u = 1, f = 1;
  n && rr(e) && (u = e.offsetWidth > 0 && ca(a.width) / e.offsetWidth || 1, f = e.offsetHeight > 0 && ca(a.height) / e.offsetHeight || 1);
  var d = bo(e) ? Gn(e) : window, v = d.visualViewport, p = !Av() && t, g = (a.left + (p && v ? v.offsetLeft : 0)) / u, b = (a.top + (p && v ? v.offsetTop : 0)) / f, w = a.width / u, m = a.height / f;
  return {
    width: w,
    height: m,
    top: b,
    right: g + w,
    bottom: b + m,
    left: g,
    x: g,
    y: b
  };
}
function Fd(e) {
  var n = fa(e), t = e.offsetWidth, a = e.offsetHeight;
  return Math.abs(n.width - t) <= 1 && (t = n.width), Math.abs(n.height - a) <= 1 && (a = n.height), {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: t,
    height: a
  };
}
function Tv(e, n) {
  var t = n.getRootNode && n.getRootNode();
  if (e.contains(n))
    return !0;
  if (t && Id(t)) {
    var a = n;
    do {
      if (a && e.isSameNode(a))
        return !0;
      a = a.parentNode || a.host;
    } while (a);
  }
  return !1;
}
function mi(e) {
  return Gn(e).getComputedStyle(e);
}
function MN(e) {
  return ["table", "td", "th"].indexOf(Hr(e)) >= 0;
}
function Bi(e) {
  return ((bo(e) ? e.ownerDocument : (
    // $FlowFixMe[prop-missing]
    e.document
  )) || window.document).documentElement;
}
function Ll(e) {
  return Hr(e) === "html" ? e : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    e.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    e.parentNode || // DOM Element detected
    (Id(e) ? e.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Bi(e)
  );
}
function Eg(e) {
  return !rr(e) || // https://github.com/popperjs/popper-core/issues/837
  mi(e).position === "fixed" ? null : e.offsetParent;
}
function DN(e) {
  var n = /firefox/i.test(Af()), t = /Trident/i.test(Af());
  if (t && rr(e)) {
    var a = mi(e);
    if (a.position === "fixed")
      return null;
  }
  var u = Ll(e);
  for (Id(u) && (u = u.host); rr(u) && ["html", "body"].indexOf(Hr(u)) < 0; ) {
    var f = mi(u);
    if (f.transform !== "none" || f.perspective !== "none" || f.contain === "paint" || ["transform", "perspective"].indexOf(f.willChange) !== -1 || n && f.willChange === "filter" || n && f.filter && f.filter !== "none")
      return u;
    u = u.parentNode;
  }
  return null;
}
function Cs(e) {
  for (var n = Gn(e), t = Eg(e); t && MN(t) && mi(t).position === "static"; )
    t = Eg(t);
  return t && (Hr(t) === "html" || Hr(t) === "body" && mi(t).position === "static") ? n : t || DN(e) || n;
}
function qd(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function ss(e, n, t) {
  return go(e, _l(n, t));
}
function IN(e, n, t) {
  var a = ss(e, n, t);
  return a > t ? t : a;
}
function Pv() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function kv(e) {
  return Object.assign({}, Pv(), e);
}
function Nv(e, n) {
  return n.reduce(function(t, a) {
    return t[a] = e, t;
  }, {});
}
var FN = function(n, t) {
  return n = typeof n == "function" ? n(Object.assign({}, t.rects, {
    placement: t.placement
  })) : n, kv(typeof n != "number" ? n : Nv(n, Es));
};
function qN(e) {
  var n, t = e.state, a = e.name, u = e.options, f = t.elements.arrow, d = t.modifiersData.popperOffsets, v = jr(t.placement), p = qd(v), g = [Bn, or].indexOf(v) >= 0, b = g ? "height" : "width";
  if (!(!f || !d)) {
    var w = FN(u.padding, t), m = Fd(f), x = p === "y" ? zn : Bn, s = p === "y" ? ir : or, $ = t.rects.reference[b] + t.rects.reference[p] - d[p] - t.rects.popper[b], E = d[p] - t.rects.reference[p], A = Cs(f), I = A ? p === "y" ? A.clientHeight || 0 : A.clientWidth || 0 : 0, F = $ / 2 - E / 2, k = w[x], j = I - m[b] - w[s], U = I / 2 - m[b] / 2 + F, ne = ss(k, U, j), Se = p;
    t.modifiersData[a] = (n = {}, n[Se] = ne, n.centerOffset = ne - U, n);
  }
}
function zN(e) {
  var n = e.state, t = e.options, a = t.element, u = a === void 0 ? "[data-popper-arrow]" : a;
  u != null && (typeof u == "string" && (u = n.elements.popper.querySelector(u), !u) || Tv(n.elements.popper, u) && (n.elements.arrow = u));
}
const BN = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: qN,
  effect: zN,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function da(e) {
  return e.split("-")[1];
}
var jN = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function HN(e, n) {
  var t = e.x, a = e.y, u = n.devicePixelRatio || 1;
  return {
    x: ca(t * u) / u || 0,
    y: ca(a * u) / u || 0
  };
}
function Cg(e) {
  var n, t = e.popper, a = e.popperRect, u = e.placement, f = e.variation, d = e.offsets, v = e.position, p = e.gpuAcceleration, g = e.adaptive, b = e.roundOffsets, w = e.isFixed, m = d.x, x = m === void 0 ? 0 : m, s = d.y, $ = s === void 0 ? 0 : s, E = typeof b == "function" ? b({
    x,
    y: $
  }) : {
    x,
    y: $
  };
  x = E.x, $ = E.y;
  var A = d.hasOwnProperty("x"), I = d.hasOwnProperty("y"), F = Bn, k = zn, j = window;
  if (g) {
    var U = Cs(t), ne = "clientHeight", Se = "clientWidth";
    if (U === Gn(t) && (U = Bi(t), mi(U).position !== "static" && v === "absolute" && (ne = "scrollHeight", Se = "scrollWidth")), U = U, u === zn || (u === Bn || u === or) && f === gs) {
      k = ir;
      var Ce = w && U === j && j.visualViewport ? j.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        U[ne]
      );
      $ -= Ce - a.height, $ *= p ? 1 : -1;
    }
    if (u === Bn || (u === zn || u === ir) && f === gs) {
      F = or;
      var Ee = w && U === j && j.visualViewport ? j.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        U[Se]
      );
      x -= Ee - a.width, x *= p ? 1 : -1;
    }
  }
  var Ae = Object.assign({
    position: v
  }, g && jN), We = b === !0 ? HN({
    x,
    y: $
  }, Gn(t)) : {
    x,
    y: $
  };
  if (x = We.x, $ = We.y, p) {
    var Fe;
    return Object.assign({}, Ae, (Fe = {}, Fe[k] = I ? "0" : "", Fe[F] = A ? "0" : "", Fe.transform = (j.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + $ + "px)" : "translate3d(" + x + "px, " + $ + "px, 0)", Fe));
  }
  return Object.assign({}, Ae, (n = {}, n[k] = I ? $ + "px" : "", n[F] = A ? x + "px" : "", n.transform = "", n));
}
function WN(e) {
  var n = e.state, t = e.options, a = t.gpuAcceleration, u = a === void 0 ? !0 : a, f = t.adaptive, d = f === void 0 ? !0 : f, v = t.roundOffsets, p = v === void 0 ? !0 : v, g = {
    placement: jr(n.placement),
    variation: da(n.placement),
    popper: n.elements.popper,
    popperRect: n.rects.popper,
    gpuAcceleration: u,
    isFixed: n.options.strategy === "fixed"
  };
  n.modifiersData.popperOffsets != null && (n.styles.popper = Object.assign({}, n.styles.popper, Cg(Object.assign({}, g, {
    offsets: n.modifiersData.popperOffsets,
    position: n.options.strategy,
    adaptive: d,
    roundOffsets: p
  })))), n.modifiersData.arrow != null && (n.styles.arrow = Object.assign({}, n.styles.arrow, Cg(Object.assign({}, g, {
    offsets: n.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: p
  })))), n.attributes.popper = Object.assign({}, n.attributes.popper, {
    "data-popper-placement": n.placement
  });
}
const VN = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: WN,
  data: {}
};
var Vu = {
  passive: !0
};
function UN(e) {
  var n = e.state, t = e.instance, a = e.options, u = a.scroll, f = u === void 0 ? !0 : u, d = a.resize, v = d === void 0 ? !0 : d, p = Gn(n.elements.popper), g = [].concat(n.scrollParents.reference, n.scrollParents.popper);
  return f && g.forEach(function(b) {
    b.addEventListener("scroll", t.update, Vu);
  }), v && p.addEventListener("resize", t.update, Vu), function() {
    f && g.forEach(function(b) {
      b.removeEventListener("scroll", t.update, Vu);
    }), v && p.removeEventListener("resize", t.update, Vu);
  };
}
const GN = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: UN,
  data: {}
};
var KN = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function il(e) {
  return e.replace(/left|right|bottom|top/g, function(n) {
    return KN[n];
  });
}
var XN = {
  start: "end",
  end: "start"
};
function Ag(e) {
  return e.replace(/start|end/g, function(n) {
    return XN[n];
  });
}
function zd(e) {
  var n = Gn(e), t = n.pageXOffset, a = n.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: a
  };
}
function Bd(e) {
  return fa(Bi(e)).left + zd(e).scrollLeft;
}
function YN(e, n) {
  var t = Gn(e), a = Bi(e), u = t.visualViewport, f = a.clientWidth, d = a.clientHeight, v = 0, p = 0;
  if (u) {
    f = u.width, d = u.height;
    var g = Av();
    (g || !g && n === "fixed") && (v = u.offsetLeft, p = u.offsetTop);
  }
  return {
    width: f,
    height: d,
    x: v + Bd(e),
    y: p
  };
}
function QN(e) {
  var n, t = Bi(e), a = zd(e), u = (n = e.ownerDocument) == null ? void 0 : n.body, f = go(t.scrollWidth, t.clientWidth, u ? u.scrollWidth : 0, u ? u.clientWidth : 0), d = go(t.scrollHeight, t.clientHeight, u ? u.scrollHeight : 0, u ? u.clientHeight : 0), v = -a.scrollLeft + Bd(e), p = -a.scrollTop;
  return mi(u || t).direction === "rtl" && (v += go(t.clientWidth, u ? u.clientWidth : 0) - f), {
    width: f,
    height: d,
    x: v,
    y: p
  };
}
function jd(e) {
  var n = mi(e), t = n.overflow, a = n.overflowX, u = n.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + u + a);
}
function Ov(e) {
  return ["html", "body", "#document"].indexOf(Hr(e)) >= 0 ? e.ownerDocument.body : rr(e) && jd(e) ? e : Ov(Ll(e));
}
function us(e, n) {
  var t;
  n === void 0 && (n = []);
  var a = Ov(e), u = a === ((t = e.ownerDocument) == null ? void 0 : t.body), f = Gn(a), d = u ? [f].concat(f.visualViewport || [], jd(a) ? a : []) : a, v = n.concat(d);
  return u ? v : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    v.concat(us(Ll(d)))
  );
}
function Tf(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height
  });
}
function JN(e, n) {
  var t = fa(e, !1, n === "fixed");
  return t.top = t.top + e.clientTop, t.left = t.left + e.clientLeft, t.bottom = t.top + e.clientHeight, t.right = t.left + e.clientWidth, t.width = e.clientWidth, t.height = e.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Tg(e, n, t) {
  return n === $v ? Tf(YN(e, t)) : bo(n) ? JN(n, t) : Tf(QN(Bi(e)));
}
function ZN(e) {
  var n = us(Ll(e)), t = ["absolute", "fixed"].indexOf(mi(e).position) >= 0, a = t && rr(e) ? Cs(e) : e;
  return bo(a) ? n.filter(function(u) {
    return bo(u) && Tv(u, a) && Hr(u) !== "body";
  }) : [];
}
function eO(e, n, t, a) {
  var u = n === "clippingParents" ? ZN(e) : [].concat(n), f = [].concat(u, [t]), d = f[0], v = f.reduce(function(p, g) {
    var b = Tg(e, g, a);
    return p.top = go(b.top, p.top), p.right = _l(b.right, p.right), p.bottom = _l(b.bottom, p.bottom), p.left = go(b.left, p.left), p;
  }, Tg(e, d, a));
  return v.width = v.right - v.left, v.height = v.bottom - v.top, v.x = v.left, v.y = v.top, v;
}
function Lv(e) {
  var n = e.reference, t = e.element, a = e.placement, u = a ? jr(a) : null, f = a ? da(a) : null, d = n.x + n.width / 2 - t.width / 2, v = n.y + n.height / 2 - t.height / 2, p;
  switch (u) {
    case zn:
      p = {
        x: d,
        y: n.y - t.height
      };
      break;
    case ir:
      p = {
        x: d,
        y: n.y + n.height
      };
      break;
    case or:
      p = {
        x: n.x + n.width,
        y: v
      };
      break;
    case Bn:
      p = {
        x: n.x - t.width,
        y: v
      };
      break;
    default:
      p = {
        x: n.x,
        y: n.y
      };
  }
  var g = u ? qd(u) : null;
  if (g != null) {
    var b = g === "y" ? "height" : "width";
    switch (f) {
      case la:
        p[g] = p[g] - (n[b] / 2 - t[b] / 2);
        break;
      case gs:
        p[g] = p[g] + (n[b] / 2 - t[b] / 2);
        break;
    }
  }
  return p;
}
function ms(e, n) {
  n === void 0 && (n = {});
  var t = n, a = t.placement, u = a === void 0 ? e.placement : a, f = t.strategy, d = f === void 0 ? e.strategy : f, v = t.boundary, p = v === void 0 ? _N : v, g = t.rootBoundary, b = g === void 0 ? $v : g, w = t.elementContext, m = w === void 0 ? Qa : w, x = t.altBoundary, s = x === void 0 ? !1 : x, $ = t.padding, E = $ === void 0 ? 0 : $, A = kv(typeof E != "number" ? E : Nv(E, Es)), I = m === Qa ? xN : Qa, F = e.rects.popper, k = e.elements[s ? I : m], j = eO(bo(k) ? k : k.contextElement || Bi(e.elements.popper), p, b, d), U = fa(e.elements.reference), ne = Lv({
    reference: U,
    element: F,
    strategy: "absolute",
    placement: u
  }), Se = Tf(Object.assign({}, F, ne)), Ce = m === Qa ? Se : U, Ee = {
    top: j.top - Ce.top + A.top,
    bottom: Ce.bottom - j.bottom + A.bottom,
    left: j.left - Ce.left + A.left,
    right: Ce.right - j.right + A.right
  }, Ae = e.modifiersData.offset;
  if (m === Qa && Ae) {
    var We = Ae[u];
    Object.keys(Ee).forEach(function(Fe) {
      var J = [or, ir].indexOf(Fe) >= 0 ? 1 : -1, _e = [zn, ir].indexOf(Fe) >= 0 ? "y" : "x";
      Ee[Fe] += We[_e] * J;
    });
  }
  return Ee;
}
function tO(e, n) {
  n === void 0 && (n = {});
  var t = n, a = t.placement, u = t.boundary, f = t.rootBoundary, d = t.padding, v = t.flipVariations, p = t.allowedAutoPlacements, g = p === void 0 ? Ev : p, b = da(a), w = b ? v ? $g : $g.filter(function(s) {
    return da(s) === b;
  }) : Es, m = w.filter(function(s) {
    return g.indexOf(s) >= 0;
  });
  m.length === 0 && (m = w);
  var x = m.reduce(function(s, $) {
    return s[$] = ms(e, {
      placement: $,
      boundary: u,
      rootBoundary: f,
      padding: d
    })[jr($)], s;
  }, {});
  return Object.keys(x).sort(function(s, $) {
    return x[s] - x[$];
  });
}
function nO(e) {
  if (jr(e) === Dd)
    return [];
  var n = il(e);
  return [Ag(e), n, Ag(n)];
}
function rO(e) {
  var n = e.state, t = e.options, a = e.name;
  if (!n.modifiersData[a]._skip) {
    for (var u = t.mainAxis, f = u === void 0 ? !0 : u, d = t.altAxis, v = d === void 0 ? !0 : d, p = t.fallbackPlacements, g = t.padding, b = t.boundary, w = t.rootBoundary, m = t.altBoundary, x = t.flipVariations, s = x === void 0 ? !0 : x, $ = t.allowedAutoPlacements, E = n.options.placement, A = jr(E), I = A === E, F = p || (I || !s ? [il(E)] : nO(E)), k = [E].concat(F).reduce(function(L, B) {
      return L.concat(jr(B) === Dd ? tO(n, {
        placement: B,
        boundary: b,
        rootBoundary: w,
        padding: g,
        flipVariations: s,
        allowedAutoPlacements: $
      }) : B);
    }, []), j = n.rects.reference, U = n.rects.popper, ne = /* @__PURE__ */ new Map(), Se = !0, Ce = k[0], Ee = 0; Ee < k.length; Ee++) {
      var Ae = k[Ee], We = jr(Ae), Fe = da(Ae) === la, J = [zn, ir].indexOf(We) >= 0, _e = J ? "width" : "height", oe = ms(n, {
        placement: Ae,
        boundary: b,
        rootBoundary: w,
        altBoundary: m,
        padding: g
      }), pe = J ? Fe ? or : Bn : Fe ? ir : zn;
      j[_e] > U[_e] && (pe = il(pe));
      var ke = il(pe), Ne = [];
      if (f && Ne.push(oe[We] <= 0), v && Ne.push(oe[pe] <= 0, oe[ke] <= 0), Ne.every(function(L) {
        return L;
      })) {
        Ce = Ae, Se = !1;
        break;
      }
      ne.set(Ae, Ne);
    }
    if (Se)
      for (var ae = s ? 3 : 1, R = function(B) {
        var re = k.find(function(xe) {
          var be = ne.get(xe);
          if (be)
            return be.slice(0, B).every(function(Ge) {
              return Ge;
            });
        });
        if (re)
          return Ce = re, "break";
      }, te = ae; te > 0; te--) {
        var Y = R(te);
        if (Y === "break") break;
      }
    n.placement !== Ce && (n.modifiersData[a]._skip = !0, n.placement = Ce, n.reset = !0);
  }
}
const iO = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: rO,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function Pg(e, n, t) {
  return t === void 0 && (t = {
    x: 0,
    y: 0
  }), {
    top: e.top - n.height - t.y,
    right: e.right - n.width + t.x,
    bottom: e.bottom - n.height + t.y,
    left: e.left - n.width - t.x
  };
}
function kg(e) {
  return [zn, or, ir, Bn].some(function(n) {
    return e[n] >= 0;
  });
}
function oO(e) {
  var n = e.state, t = e.name, a = n.rects.reference, u = n.rects.popper, f = n.modifiersData.preventOverflow, d = ms(n, {
    elementContext: "reference"
  }), v = ms(n, {
    altBoundary: !0
  }), p = Pg(d, a), g = Pg(v, u, f), b = kg(p), w = kg(g);
  n.modifiersData[t] = {
    referenceClippingOffsets: p,
    popperEscapeOffsets: g,
    isReferenceHidden: b,
    hasPopperEscaped: w
  }, n.attributes.popper = Object.assign({}, n.attributes.popper, {
    "data-popper-reference-hidden": b,
    "data-popper-escaped": w
  });
}
const aO = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: oO
};
function sO(e, n, t) {
  var a = jr(e), u = [Bn, zn].indexOf(a) >= 0 ? -1 : 1, f = typeof t == "function" ? t(Object.assign({}, n, {
    placement: e
  })) : t, d = f[0], v = f[1];
  return d = d || 0, v = (v || 0) * u, [Bn, or].indexOf(a) >= 0 ? {
    x: v,
    y: d
  } : {
    x: d,
    y: v
  };
}
function uO(e) {
  var n = e.state, t = e.options, a = e.name, u = t.offset, f = u === void 0 ? [0, 0] : u, d = Ev.reduce(function(b, w) {
    return b[w] = sO(w, n.rects, f), b;
  }, {}), v = d[n.placement], p = v.x, g = v.y;
  n.modifiersData.popperOffsets != null && (n.modifiersData.popperOffsets.x += p, n.modifiersData.popperOffsets.y += g), n.modifiersData[a] = d;
}
const lO = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: uO
};
function cO(e) {
  var n = e.state, t = e.name;
  n.modifiersData[t] = Lv({
    reference: n.rects.reference,
    element: n.rects.popper,
    strategy: "absolute",
    placement: n.placement
  });
}
const fO = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: cO,
  data: {}
};
function dO(e) {
  return e === "x" ? "y" : "x";
}
function hO(e) {
  var n = e.state, t = e.options, a = e.name, u = t.mainAxis, f = u === void 0 ? !0 : u, d = t.altAxis, v = d === void 0 ? !1 : d, p = t.boundary, g = t.rootBoundary, b = t.altBoundary, w = t.padding, m = t.tether, x = m === void 0 ? !0 : m, s = t.tetherOffset, $ = s === void 0 ? 0 : s, E = ms(n, {
    boundary: p,
    rootBoundary: g,
    padding: w,
    altBoundary: b
  }), A = jr(n.placement), I = da(n.placement), F = !I, k = qd(A), j = dO(k), U = n.modifiersData.popperOffsets, ne = n.rects.reference, Se = n.rects.popper, Ce = typeof $ == "function" ? $(Object.assign({}, n.rects, {
    placement: n.placement
  })) : $, Ee = typeof Ce == "number" ? {
    mainAxis: Ce,
    altAxis: Ce
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, Ce), Ae = n.modifiersData.offset ? n.modifiersData.offset[n.placement] : null, We = {
    x: 0,
    y: 0
  };
  if (U) {
    if (f) {
      var Fe, J = k === "y" ? zn : Bn, _e = k === "y" ? ir : or, oe = k === "y" ? "height" : "width", pe = U[k], ke = pe + E[J], Ne = pe - E[_e], ae = x ? -Se[oe] / 2 : 0, R = I === la ? ne[oe] : Se[oe], te = I === la ? -Se[oe] : -ne[oe], Y = n.elements.arrow, L = x && Y ? Fd(Y) : {
        width: 0,
        height: 0
      }, B = n.modifiersData["arrow#persistent"] ? n.modifiersData["arrow#persistent"].padding : Pv(), re = B[J], xe = B[_e], be = ss(0, ne[oe], L[oe]), Ge = F ? ne[oe] / 2 - ae - be - re - Ee.mainAxis : R - be - re - Ee.mainAxis, et = F ? -ne[oe] / 2 + ae + be + xe + Ee.mainAxis : te + be + xe + Ee.mainAxis, Ke = n.elements.arrow && Cs(n.elements.arrow), Ie = Ke ? k === "y" ? Ke.clientTop || 0 : Ke.clientLeft || 0 : 0, ue = (Fe = Ae == null ? void 0 : Ae[k]) != null ? Fe : 0, we = pe + Ge - ue - Ie, $e = pe + et - ue, at = ss(x ? _l(ke, we) : ke, pe, x ? go(Ne, $e) : Ne);
      U[k] = at, We[k] = at - pe;
    }
    if (v) {
      var vt, xt = k === "x" ? zn : Bn, Ut = k === "x" ? ir : or, Nt = U[j], Ft = j === "y" ? "height" : "width", Mt = Nt + E[xt], Et = Nt - E[Ut], Sn = [zn, Bn].indexOf(A) !== -1, pn = (vt = Ae == null ? void 0 : Ae[j]) != null ? vt : 0, $n = Sn ? Mt : Nt - ne[Ft] - Se[Ft] - pn + Ee.altAxis, gn = Sn ? Nt + ne[Ft] + Se[Ft] - pn - Ee.altAxis : Et, un = x && Sn ? IN($n, Nt, gn) : ss(x ? $n : Mt, Nt, x ? gn : Et);
      U[j] = un, We[j] = un - Nt;
    }
    n.modifiersData[a] = We;
  }
}
const pO = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: hO,
  requiresIfExists: ["offset"]
};
function gO(e) {
  return {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  };
}
function mO(e) {
  return e === Gn(e) || !rr(e) ? zd(e) : gO(e);
}
function vO(e) {
  var n = e.getBoundingClientRect(), t = ca(n.width) / e.offsetWidth || 1, a = ca(n.height) / e.offsetHeight || 1;
  return t !== 1 || a !== 1;
}
function yO(e, n, t) {
  t === void 0 && (t = !1);
  var a = rr(n), u = rr(n) && vO(n), f = Bi(n), d = fa(e, u, t), v = {
    scrollLeft: 0,
    scrollTop: 0
  }, p = {
    x: 0,
    y: 0
  };
  return (a || !a && !t) && ((Hr(n) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  jd(f)) && (v = mO(n)), rr(n) ? (p = fa(n, !0), p.x += n.clientLeft, p.y += n.clientTop) : f && (p.x = Bd(f))), {
    x: d.left + v.scrollLeft - p.x,
    y: d.top + v.scrollTop - p.y,
    width: d.width,
    height: d.height
  };
}
function wO(e) {
  var n = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), a = [];
  e.forEach(function(f) {
    n.set(f.name, f);
  });
  function u(f) {
    t.add(f.name);
    var d = [].concat(f.requires || [], f.requiresIfExists || []);
    d.forEach(function(v) {
      if (!t.has(v)) {
        var p = n.get(v);
        p && u(p);
      }
    }), a.push(f);
  }
  return e.forEach(function(f) {
    t.has(f.name) || u(f);
  }), a;
}
function bO(e) {
  var n = wO(e);
  return ON.reduce(function(t, a) {
    return t.concat(n.filter(function(u) {
      return u.phase === a;
    }));
  }, []);
}
function _O(e) {
  var n;
  return function() {
    return n || (n = new Promise(function(t) {
      Promise.resolve().then(function() {
        n = void 0, t(e());
      });
    })), n;
  };
}
function xO(e) {
  var n = e.reduce(function(t, a) {
    var u = t[a.name];
    return t[a.name] = u ? Object.assign({}, u, a, {
      options: Object.assign({}, u.options, a.options),
      data: Object.assign({}, u.data, a.data)
    }) : a, t;
  }, {});
  return Object.keys(n).map(function(t) {
    return n[t];
  });
}
var Ng = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Og() {
  for (var e = arguments.length, n = new Array(e), t = 0; t < e; t++)
    n[t] = arguments[t];
  return !n.some(function(a) {
    return !(a && typeof a.getBoundingClientRect == "function");
  });
}
function SO(e) {
  e === void 0 && (e = {});
  var n = e, t = n.defaultModifiers, a = t === void 0 ? [] : t, u = n.defaultOptions, f = u === void 0 ? Ng : u;
  return function(v, p, g) {
    g === void 0 && (g = f);
    var b = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Ng, f),
      modifiersData: {},
      elements: {
        reference: v,
        popper: p
      },
      attributes: {},
      styles: {}
    }, w = [], m = !1, x = {
      state: b,
      setOptions: function(A) {
        var I = typeof A == "function" ? A(b.options) : A;
        $(), b.options = Object.assign({}, f, b.options, I), b.scrollParents = {
          reference: bo(v) ? us(v) : v.contextElement ? us(v.contextElement) : [],
          popper: us(p)
        };
        var F = bO(xO([].concat(a, b.options.modifiers)));
        return b.orderedModifiers = F.filter(function(k) {
          return k.enabled;
        }), s(), x.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!m) {
          var A = b.elements, I = A.reference, F = A.popper;
          if (Og(I, F)) {
            b.rects = {
              reference: yO(I, Cs(F), b.options.strategy === "fixed"),
              popper: Fd(F)
            }, b.reset = !1, b.placement = b.options.placement, b.orderedModifiers.forEach(function(Ee) {
              return b.modifiersData[Ee.name] = Object.assign({}, Ee.data);
            });
            for (var k = 0; k < b.orderedModifiers.length; k++) {
              if (b.reset === !0) {
                b.reset = !1, k = -1;
                continue;
              }
              var j = b.orderedModifiers[k], U = j.fn, ne = j.options, Se = ne === void 0 ? {} : ne, Ce = j.name;
              typeof U == "function" && (b = U({
                state: b,
                options: Se,
                name: Ce,
                instance: x
              }) || b);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: _O(function() {
        return new Promise(function(E) {
          x.forceUpdate(), E(b);
        });
      }),
      destroy: function() {
        $(), m = !0;
      }
    };
    if (!Og(v, p))
      return x;
    x.setOptions(g).then(function(E) {
      !m && g.onFirstUpdate && g.onFirstUpdate(E);
    });
    function s() {
      b.orderedModifiers.forEach(function(E) {
        var A = E.name, I = E.options, F = I === void 0 ? {} : I, k = E.effect;
        if (typeof k == "function") {
          var j = k({
            state: b,
            name: A,
            instance: x,
            options: F
          }), U = function() {
          };
          w.push(j || U);
        }
      });
    }
    function $() {
      w.forEach(function(E) {
        return E();
      }), w = [];
    }
    return x;
  };
}
var $O = [GN, fO, VN, Cv, lO, iO, pO, BN, aO], EO = /* @__PURE__ */ SO({
  defaultModifiers: $O
}), CO = "tippy-box", Rv = "tippy-content", AO = "tippy-backdrop", Mv = "tippy-arrow", Dv = "tippy-svg-arrow", so = {
  passive: !0,
  capture: !0
}, Iv = function() {
  return document.body;
};
function TO(e, n) {
  return {}.hasOwnProperty.call(e, n);
}
function tf(e, n, t) {
  if (Array.isArray(e)) {
    var a = e[n];
    return a ?? (Array.isArray(t) ? t[n] : t);
  }
  return e;
}
function Hd(e, n) {
  var t = {}.toString.call(e);
  return t.indexOf("[object") === 0 && t.indexOf(n + "]") > -1;
}
function Fv(e, n) {
  return typeof e == "function" ? e.apply(void 0, n) : e;
}
function Lg(e, n) {
  if (n === 0)
    return e;
  var t;
  return function(a) {
    clearTimeout(t), t = setTimeout(function() {
      e(a);
    }, n);
  };
}
function PO(e, n) {
  var t = Object.assign({}, e);
  return n.forEach(function(a) {
    delete t[a];
  }), t;
}
function kO(e) {
  return e.split(/\s+/).filter(Boolean);
}
function Qo(e) {
  return [].concat(e);
}
function Rg(e, n) {
  e.indexOf(n) === -1 && e.push(n);
}
function NO(e) {
  return e.filter(function(n, t) {
    return e.indexOf(n) === t;
  });
}
function OO(e) {
  return e.split("-")[0];
}
function xl(e) {
  return [].slice.call(e);
}
function Mg(e) {
  return Object.keys(e).reduce(function(n, t) {
    return e[t] !== void 0 && (n[t] = e[t]), n;
  }, {});
}
function ls() {
  return document.createElement("div");
}
function vs(e) {
  return ["Element", "Fragment"].some(function(n) {
    return Hd(e, n);
  });
}
function LO(e) {
  return Hd(e, "NodeList");
}
function RO(e) {
  return Hd(e, "MouseEvent");
}
function MO(e) {
  return !!(e && e._tippy && e._tippy.reference === e);
}
function DO(e) {
  return vs(e) ? [e] : LO(e) ? xl(e) : Array.isArray(e) ? e : xl(document.querySelectorAll(e));
}
function nf(e, n) {
  e.forEach(function(t) {
    t && (t.style.transitionDuration = n + "ms");
  });
}
function Dg(e, n) {
  e.forEach(function(t) {
    t && t.setAttribute("data-state", n);
  });
}
function IO(e) {
  var n, t = Qo(e), a = t[0];
  return a != null && (n = a.ownerDocument) != null && n.body ? a.ownerDocument : document;
}
function FO(e, n) {
  var t = n.clientX, a = n.clientY;
  return e.every(function(u) {
    var f = u.popperRect, d = u.popperState, v = u.props, p = v.interactiveBorder, g = OO(d.placement), b = d.modifiersData.offset;
    if (!b)
      return !0;
    var w = g === "bottom" ? b.top.y : 0, m = g === "top" ? b.bottom.y : 0, x = g === "right" ? b.left.x : 0, s = g === "left" ? b.right.x : 0, $ = f.top - a + w > p, E = a - f.bottom - m > p, A = f.left - t + x > p, I = t - f.right - s > p;
    return $ || E || A || I;
  });
}
function rf(e, n, t) {
  var a = n + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(u) {
    e[a](u, t);
  });
}
function Ig(e, n) {
  for (var t = n; t; ) {
    var a;
    if (e.contains(t))
      return !0;
    t = t.getRootNode == null || (a = t.getRootNode()) == null ? void 0 : a.host;
  }
  return !1;
}
var Ir = {
  isTouch: !1
}, Fg = 0;
function qO() {
  Ir.isTouch || (Ir.isTouch = !0, window.performance && document.addEventListener("mousemove", qv));
}
function qv() {
  var e = performance.now();
  e - Fg < 20 && (Ir.isTouch = !1, document.removeEventListener("mousemove", qv)), Fg = e;
}
function zO() {
  var e = document.activeElement;
  if (MO(e)) {
    var n = e._tippy;
    e.blur && !n.state.isVisible && e.blur();
  }
}
function BO() {
  document.addEventListener("touchstart", qO, so), window.addEventListener("blur", zO);
}
var jO = typeof window < "u" && typeof document < "u", HO = jO ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function Ko(e) {
  var n = e === "destroy" ? "n already-" : " ";
  return [e + "() was called on a" + n + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function qg(e) {
  var n = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return e.replace(n, " ").replace(t, "").trim();
}
function WO(e) {
  return qg(`
  %ctippy.js

  %c` + qg(e) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function zv(e) {
  return [
    WO(e),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var ys;
process.env.NODE_ENV !== "production" && VO();
function VO() {
  ys = /* @__PURE__ */ new Set();
}
function ci(e, n) {
  if (e && !ys.has(n)) {
    var t;
    ys.add(n), (t = console).warn.apply(t, zv(n));
  }
}
function Pf(e, n) {
  if (e && !ys.has(n)) {
    var t;
    ys.add(n), (t = console).error.apply(t, zv(n));
  }
}
function UO(e) {
  var n = !e, t = Object.prototype.toString.call(e) === "[object Object]" && !e.addEventListener;
  Pf(n, ["tippy() was passed", "`" + String(e) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), Pf(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var Bv = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, GO = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, Un = Object.assign({
  appendTo: Iv,
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
}, Bv, GO), KO = Object.keys(Un), XO = function(n) {
  process.env.NODE_ENV !== "production" && Hv(n, []);
  var t = Object.keys(n);
  t.forEach(function(a) {
    Un[a] = n[a];
  });
};
function jv(e) {
  var n = e.plugins || [], t = n.reduce(function(a, u) {
    var f = u.name, d = u.defaultValue;
    if (f) {
      var v;
      a[f] = e[f] !== void 0 ? e[f] : (v = Un[f]) != null ? v : d;
    }
    return a;
  }, {});
  return Object.assign({}, e, t);
}
function YO(e, n) {
  var t = n ? Object.keys(jv(Object.assign({}, Un, {
    plugins: n
  }))) : KO, a = t.reduce(function(u, f) {
    var d = (e.getAttribute("data-tippy-" + f) || "").trim();
    if (!d)
      return u;
    if (f === "content")
      u[f] = d;
    else
      try {
        u[f] = JSON.parse(d);
      } catch {
        u[f] = d;
      }
    return u;
  }, {});
  return a;
}
function zg(e, n) {
  var t = Object.assign({}, n, {
    content: Fv(n.content, [e])
  }, n.ignoreAttributes ? {} : YO(e, n.plugins));
  return t.aria = Object.assign({}, Un.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? n.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? n.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function Hv(e, n) {
  e === void 0 && (e = {}), n === void 0 && (n = []);
  var t = Object.keys(e);
  t.forEach(function(a) {
    var u = PO(Un, Object.keys(Bv)), f = !TO(u, a);
    f && (f = n.filter(function(d) {
      return d.name === a;
    }).length === 0), ci(f, ["`" + a + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var QO = function() {
  return "innerHTML";
};
function kf(e, n) {
  e[QO()] = n;
}
function Bg(e) {
  var n = ls();
  return e === !0 ? n.className = Mv : (n.className = Dv, vs(e) ? n.appendChild(e) : kf(n, e)), n;
}
function jg(e, n) {
  vs(n.content) ? (kf(e, ""), e.appendChild(n.content)) : typeof n.content != "function" && (n.allowHTML ? kf(e, n.content) : e.textContent = n.content);
}
function Nf(e) {
  var n = e.firstElementChild, t = xl(n.children);
  return {
    box: n,
    content: t.find(function(a) {
      return a.classList.contains(Rv);
    }),
    arrow: t.find(function(a) {
      return a.classList.contains(Mv) || a.classList.contains(Dv);
    }),
    backdrop: t.find(function(a) {
      return a.classList.contains(AO);
    })
  };
}
function Wv(e) {
  var n = ls(), t = ls();
  t.className = CO, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var a = ls();
  a.className = Rv, a.setAttribute("data-state", "hidden"), jg(a, e.props), n.appendChild(t), t.appendChild(a), u(e.props, e.props);
  function u(f, d) {
    var v = Nf(n), p = v.box, g = v.content, b = v.arrow;
    d.theme ? p.setAttribute("data-theme", d.theme) : p.removeAttribute("data-theme"), typeof d.animation == "string" ? p.setAttribute("data-animation", d.animation) : p.removeAttribute("data-animation"), d.inertia ? p.setAttribute("data-inertia", "") : p.removeAttribute("data-inertia"), p.style.maxWidth = typeof d.maxWidth == "number" ? d.maxWidth + "px" : d.maxWidth, d.role ? p.setAttribute("role", d.role) : p.removeAttribute("role"), (f.content !== d.content || f.allowHTML !== d.allowHTML) && jg(g, e.props), d.arrow ? b ? f.arrow !== d.arrow && (p.removeChild(b), p.appendChild(Bg(d.arrow))) : p.appendChild(Bg(d.arrow)) : b && p.removeChild(b);
  }
  return {
    popper: n,
    onUpdate: u
  };
}
Wv.$$tippy = !0;
var JO = 1, Uu = [], of = [];
function ZO(e, n) {
  var t = zg(e, Object.assign({}, Un, jv(Mg(n)))), a, u, f, d = !1, v = !1, p = !1, g = !1, b, w, m, x = [], s = Lg(we, t.interactiveDebounce), $, E = JO++, A = null, I = NO(t.plugins), F = {
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
  }, k = {
    // properties
    id: E,
    reference: e,
    popper: ls(),
    popperInstance: A,
    props: t,
    state: F,
    plugins: I,
    // methods
    clearDelayTimeouts: $n,
    setProps: gn,
    setContent: un,
    show: Kn,
    hide: Ur,
    hideWithInteractivity: ji,
    enable: Sn,
    disable: pn,
    unmount: vi,
    destroy: yi
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && Pf(!0, "render() function has not been supplied."), k;
  var j = t.render(k), U = j.popper, ne = j.onUpdate;
  U.setAttribute("data-tippy-root", ""), U.id = "tippy-" + k.id, k.popper = U, e._tippy = k, U._tippy = k;
  var Se = I.map(function(ce) {
    return ce.fn(k);
  }), Ce = e.hasAttribute("aria-expanded");
  return Ke(), ae(), pe(), ke("onCreate", [k]), t.showOnCreate && Mt(), U.addEventListener("mouseenter", function() {
    k.props.interactive && k.state.isVisible && k.clearDelayTimeouts();
  }), U.addEventListener("mouseleave", function() {
    k.props.interactive && k.props.trigger.indexOf("mouseenter") >= 0 && J().addEventListener("mousemove", s);
  }), k;
  function Ee() {
    var ce = k.props.touch;
    return Array.isArray(ce) ? ce : [ce, 0];
  }
  function Ae() {
    return Ee()[0] === "hold";
  }
  function We() {
    var ce;
    return !!((ce = k.props.render) != null && ce.$$tippy);
  }
  function Fe() {
    return $ || e;
  }
  function J() {
    var ce = Fe().parentNode;
    return ce ? IO(ce) : document;
  }
  function _e() {
    return Nf(U);
  }
  function oe(ce) {
    return k.state.isMounted && !k.state.isVisible || Ir.isTouch || b && b.type === "focus" ? 0 : tf(k.props.delay, ce ? 0 : 1, Un.delay);
  }
  function pe(ce) {
    ce === void 0 && (ce = !1), U.style.pointerEvents = k.props.interactive && !ce ? "" : "none", U.style.zIndex = "" + k.props.zIndex;
  }
  function ke(ce, Le, Ve) {
    if (Ve === void 0 && (Ve = !0), Se.forEach(function(wt) {
      wt[ce] && wt[ce].apply(wt, Le);
    }), Ve) {
      var yt;
      (yt = k.props)[ce].apply(yt, Le);
    }
  }
  function Ne() {
    var ce = k.props.aria;
    if (ce.content) {
      var Le = "aria-" + ce.content, Ve = U.id, yt = Qo(k.props.triggerTarget || e);
      yt.forEach(function(wt) {
        var en = wt.getAttribute(Le);
        if (k.state.isVisible)
          wt.setAttribute(Le, en ? en + " " + Ve : Ve);
        else {
          var mn = en && en.replace(Ve, "").trim();
          mn ? wt.setAttribute(Le, mn) : wt.removeAttribute(Le);
        }
      });
    }
  }
  function ae() {
    if (!(Ce || !k.props.aria.expanded)) {
      var ce = Qo(k.props.triggerTarget || e);
      ce.forEach(function(Le) {
        k.props.interactive ? Le.setAttribute("aria-expanded", k.state.isVisible && Le === Fe() ? "true" : "false") : Le.removeAttribute("aria-expanded");
      });
    }
  }
  function R() {
    J().removeEventListener("mousemove", s), Uu = Uu.filter(function(ce) {
      return ce !== s;
    });
  }
  function te(ce) {
    if (!(Ir.isTouch && (p || ce.type === "mousedown"))) {
      var Le = ce.composedPath && ce.composedPath()[0] || ce.target;
      if (!(k.props.interactive && Ig(U, Le))) {
        if (Qo(k.props.triggerTarget || e).some(function(Ve) {
          return Ig(Ve, Le);
        })) {
          if (Ir.isTouch || k.state.isVisible && k.props.trigger.indexOf("click") >= 0)
            return;
        } else
          ke("onClickOutside", [k, ce]);
        k.props.hideOnClick === !0 && (k.clearDelayTimeouts(), k.hide(), v = !0, setTimeout(function() {
          v = !1;
        }), k.state.isMounted || re());
      }
    }
  }
  function Y() {
    p = !0;
  }
  function L() {
    p = !1;
  }
  function B() {
    var ce = J();
    ce.addEventListener("mousedown", te, !0), ce.addEventListener("touchend", te, so), ce.addEventListener("touchstart", L, so), ce.addEventListener("touchmove", Y, so);
  }
  function re() {
    var ce = J();
    ce.removeEventListener("mousedown", te, !0), ce.removeEventListener("touchend", te, so), ce.removeEventListener("touchstart", L, so), ce.removeEventListener("touchmove", Y, so);
  }
  function xe(ce, Le) {
    Ge(ce, function() {
      !k.state.isVisible && U.parentNode && U.parentNode.contains(U) && Le();
    });
  }
  function be(ce, Le) {
    Ge(ce, Le);
  }
  function Ge(ce, Le) {
    var Ve = _e().box;
    function yt(wt) {
      wt.target === Ve && (rf(Ve, "remove", yt), Le());
    }
    if (ce === 0)
      return Le();
    rf(Ve, "remove", w), rf(Ve, "add", yt), w = yt;
  }
  function et(ce, Le, Ve) {
    Ve === void 0 && (Ve = !1);
    var yt = Qo(k.props.triggerTarget || e);
    yt.forEach(function(wt) {
      wt.addEventListener(ce, Le, Ve), x.push({
        node: wt,
        eventType: ce,
        handler: Le,
        options: Ve
      });
    });
  }
  function Ke() {
    Ae() && (et("touchstart", ue, {
      passive: !0
    }), et("touchend", $e, {
      passive: !0
    })), kO(k.props.trigger).forEach(function(ce) {
      if (ce !== "manual")
        switch (et(ce, ue), ce) {
          case "mouseenter":
            et("mouseleave", $e);
            break;
          case "focus":
            et(HO ? "focusout" : "blur", at);
            break;
          case "focusin":
            et("focusout", at);
            break;
        }
    });
  }
  function Ie() {
    x.forEach(function(ce) {
      var Le = ce.node, Ve = ce.eventType, yt = ce.handler, wt = ce.options;
      Le.removeEventListener(Ve, yt, wt);
    }), x = [];
  }
  function ue(ce) {
    var Le, Ve = !1;
    if (!(!k.state.isEnabled || vt(ce) || v)) {
      var yt = ((Le = b) == null ? void 0 : Le.type) === "focus";
      b = ce, $ = ce.currentTarget, ae(), !k.state.isVisible && RO(ce) && Uu.forEach(function(wt) {
        return wt(ce);
      }), ce.type === "click" && (k.props.trigger.indexOf("mouseenter") < 0 || d) && k.props.hideOnClick !== !1 && k.state.isVisible ? Ve = !0 : Mt(ce), ce.type === "click" && (d = !Ve), Ve && !yt && Et(ce);
    }
  }
  function we(ce) {
    var Le = ce.target, Ve = Fe().contains(Le) || U.contains(Le);
    if (!(ce.type === "mousemove" && Ve)) {
      var yt = Ft().concat(U).map(function(wt) {
        var en, mn = wt._tippy, ar = (en = mn.popperInstance) == null ? void 0 : en.state;
        return ar ? {
          popperRect: wt.getBoundingClientRect(),
          popperState: ar,
          props: t
        } : null;
      }).filter(Boolean);
      FO(yt, ce) && (R(), Et(ce));
    }
  }
  function $e(ce) {
    var Le = vt(ce) || k.props.trigger.indexOf("click") >= 0 && d;
    if (!Le) {
      if (k.props.interactive) {
        k.hideWithInteractivity(ce);
        return;
      }
      Et(ce);
    }
  }
  function at(ce) {
    k.props.trigger.indexOf("focusin") < 0 && ce.target !== Fe() || k.props.interactive && ce.relatedTarget && U.contains(ce.relatedTarget) || Et(ce);
  }
  function vt(ce) {
    return Ir.isTouch ? Ae() !== ce.type.indexOf("touch") >= 0 : !1;
  }
  function xt() {
    Ut();
    var ce = k.props, Le = ce.popperOptions, Ve = ce.placement, yt = ce.offset, wt = ce.getReferenceClientRect, en = ce.moveTransition, mn = We() ? Nf(U).arrow : null, ar = wt ? {
      getBoundingClientRect: wt,
      contextElement: wt.contextElement || Fe()
    } : e, Hi = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(wi) {
        var Xn = wi.state;
        if (We()) {
          var Vi = _e(), bi = Vi.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(Gr) {
            Gr === "placement" ? bi.setAttribute("data-placement", Xn.placement) : Xn.attributes.popper["data-popper-" + Gr] ? bi.setAttribute("data-" + Gr, "") : bi.removeAttribute("data-" + Gr);
          }), Xn.attributes.popper = {};
        }
      }
    }, sr = [{
      name: "offset",
      options: {
        offset: yt
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
        adaptive: !en
      }
    }, Hi];
    We() && mn && sr.push({
      name: "arrow",
      options: {
        element: mn,
        padding: 3
      }
    }), sr.push.apply(sr, (Le == null ? void 0 : Le.modifiers) || []), k.popperInstance = EO(ar, U, Object.assign({}, Le, {
      placement: Ve,
      onFirstUpdate: m,
      modifiers: sr
    }));
  }
  function Ut() {
    k.popperInstance && (k.popperInstance.destroy(), k.popperInstance = null);
  }
  function Nt() {
    var ce = k.props.appendTo, Le, Ve = Fe();
    k.props.interactive && ce === Iv || ce === "parent" ? Le = Ve.parentNode : Le = Fv(ce, [Ve]), Le.contains(U) || Le.appendChild(U), k.state.isMounted = !0, xt(), process.env.NODE_ENV !== "production" && ci(k.props.interactive && ce === Un.appendTo && Ve.nextElementSibling !== U, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function Ft() {
    return xl(U.querySelectorAll("[data-tippy-root]"));
  }
  function Mt(ce) {
    k.clearDelayTimeouts(), ce && ke("onTrigger", [k, ce]), B();
    var Le = oe(!0), Ve = Ee(), yt = Ve[0], wt = Ve[1];
    Ir.isTouch && yt === "hold" && wt && (Le = wt), Le ? a = setTimeout(function() {
      k.show();
    }, Le) : k.show();
  }
  function Et(ce) {
    if (k.clearDelayTimeouts(), ke("onUntrigger", [k, ce]), !k.state.isVisible) {
      re();
      return;
    }
    if (!(k.props.trigger.indexOf("mouseenter") >= 0 && k.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(ce.type) >= 0 && d)) {
      var Le = oe(!1);
      Le ? u = setTimeout(function() {
        k.state.isVisible && k.hide();
      }, Le) : f = requestAnimationFrame(function() {
        k.hide();
      });
    }
  }
  function Sn() {
    k.state.isEnabled = !0;
  }
  function pn() {
    k.hide(), k.state.isEnabled = !1;
  }
  function $n() {
    clearTimeout(a), clearTimeout(u), cancelAnimationFrame(f);
  }
  function gn(ce) {
    if (process.env.NODE_ENV !== "production" && ci(k.state.isDestroyed, Ko("setProps")), !k.state.isDestroyed) {
      ke("onBeforeUpdate", [k, ce]), Ie();
      var Le = k.props, Ve = zg(e, Object.assign({}, Le, Mg(ce), {
        ignoreAttributes: !0
      }));
      k.props = Ve, Ke(), Le.interactiveDebounce !== Ve.interactiveDebounce && (R(), s = Lg(we, Ve.interactiveDebounce)), Le.triggerTarget && !Ve.triggerTarget ? Qo(Le.triggerTarget).forEach(function(yt) {
        yt.removeAttribute("aria-expanded");
      }) : Ve.triggerTarget && e.removeAttribute("aria-expanded"), ae(), pe(), ne && ne(Le, Ve), k.popperInstance && (xt(), Ft().forEach(function(yt) {
        requestAnimationFrame(yt._tippy.popperInstance.forceUpdate);
      })), ke("onAfterUpdate", [k, ce]);
    }
  }
  function un(ce) {
    k.setProps({
      content: ce
    });
  }
  function Kn() {
    process.env.NODE_ENV !== "production" && ci(k.state.isDestroyed, Ko("show"));
    var ce = k.state.isVisible, Le = k.state.isDestroyed, Ve = !k.state.isEnabled, yt = Ir.isTouch && !k.props.touch, wt = tf(k.props.duration, 0, Un.duration);
    if (!(ce || Le || Ve || yt) && !Fe().hasAttribute("disabled") && (ke("onShow", [k], !1), k.props.onShow(k) !== !1)) {
      if (k.state.isVisible = !0, We() && (U.style.visibility = "visible"), pe(), B(), k.state.isMounted || (U.style.transition = "none"), We()) {
        var en = _e(), mn = en.box, ar = en.content;
        nf([mn, ar], 0);
      }
      m = function() {
        var sr;
        if (!(!k.state.isVisible || g)) {
          if (g = !0, U.offsetHeight, U.style.transition = k.props.moveTransition, We() && k.props.animation) {
            var Wi = _e(), wi = Wi.box, Xn = Wi.content;
            nf([wi, Xn], wt), Dg([wi, Xn], "visible");
          }
          Ne(), ae(), Rg(of, k), (sr = k.popperInstance) == null || sr.forceUpdate(), ke("onMount", [k]), k.props.animation && We() && be(wt, function() {
            k.state.isShown = !0, ke("onShown", [k]);
          });
        }
      }, Nt();
    }
  }
  function Ur() {
    process.env.NODE_ENV !== "production" && ci(k.state.isDestroyed, Ko("hide"));
    var ce = !k.state.isVisible, Le = k.state.isDestroyed, Ve = !k.state.isEnabled, yt = tf(k.props.duration, 1, Un.duration);
    if (!(ce || Le || Ve) && (ke("onHide", [k], !1), k.props.onHide(k) !== !1)) {
      if (k.state.isVisible = !1, k.state.isShown = !1, g = !1, d = !1, We() && (U.style.visibility = "hidden"), R(), re(), pe(!0), We()) {
        var wt = _e(), en = wt.box, mn = wt.content;
        k.props.animation && (nf([en, mn], yt), Dg([en, mn], "hidden"));
      }
      Ne(), ae(), k.props.animation ? We() && xe(yt, k.unmount) : k.unmount();
    }
  }
  function ji(ce) {
    process.env.NODE_ENV !== "production" && ci(k.state.isDestroyed, Ko("hideWithInteractivity")), J().addEventListener("mousemove", s), Rg(Uu, s), s(ce);
  }
  function vi() {
    process.env.NODE_ENV !== "production" && ci(k.state.isDestroyed, Ko("unmount")), k.state.isVisible && k.hide(), k.state.isMounted && (Ut(), Ft().forEach(function(ce) {
      ce._tippy.unmount();
    }), U.parentNode && U.parentNode.removeChild(U), of = of.filter(function(ce) {
      return ce !== k;
    }), k.state.isMounted = !1, ke("onHidden", [k]));
  }
  function yi() {
    process.env.NODE_ENV !== "production" && ci(k.state.isDestroyed, Ko("destroy")), !k.state.isDestroyed && (k.clearDelayTimeouts(), k.unmount(), Ie(), delete e._tippy, k.state.isDestroyed = !0, ke("onDestroy", [k]));
  }
}
function As(e, n) {
  n === void 0 && (n = {});
  var t = Un.plugins.concat(n.plugins || []);
  process.env.NODE_ENV !== "production" && (UO(e), Hv(n, t)), BO();
  var a = Object.assign({}, n, {
    plugins: t
  }), u = DO(e);
  if (process.env.NODE_ENV !== "production") {
    var f = vs(a.content), d = u.length > 1;
    ci(f && d, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var v = u.reduce(function(p, g) {
    var b = g && ZO(g, a);
    return b && p.push(b), p;
  }, []);
  return vs(e) ? v[0] : v;
}
As.defaultProps = Un;
As.setDefaultProps = XO;
As.currentInput = Ir;
Object.assign({}, Cv, {
  effect: function(n) {
    var t = n.state, a = {
      popper: {
        position: t.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(t.elements.popper.style, a.popper), t.styles = a, t.elements.arrow && Object.assign(t.elements.arrow.style, a.arrow);
  }
});
As.setDefaultProps({
  render: Wv
});
const eL = "_btn_pqsxd_1", tL = "_btnGroup_pqsxd_4", Gu = {
  btn: eL,
  btnGroup: tL
}, nL = function(e) {
  var n = {
    onAnnotationSelectFunction: it.noop(),
    drawing: null,
    popoverId: ""
  }, t = kt.merge({}, n, e), a = {
    show: function(p) {
      p.visible = !0;
    },
    hide: function(p) {
      p.visible = !1, p.hidden = !0;
    },
    auto: function(p) {
      p.visible = !1, p.hidden = !1;
    }
  }, u = function(p, g) {
    p.select("span.genelabel").text(function(m) {
      return m.label;
    }).style("font-weight", function(m) {
      return m.selected ? "bold" : "normal";
    }).style("opacity", function(m) {
      return m.visible || m.selected ? 1 : m.normedScore ? m.normedScore : m.importance;
    }).style("color", function(m) {
      return g.visible || g.selected ? g.color : null;
    });
    var b = p.select("div.btn-group");
    b.selectAll("a").data(["show", "hide", "auto"]).classed("disabled", function(m) {
      return m == "show" && g.visible || m == "hide" && g.hidden && !g.visible || m == "auto" && !g.hidden && !g.visible;
    });
  }, f = function(p, g, b) {
    var w = b.data.genesList, m = g.selectAll("p").data(w);
    p.append("span").text("Cluster"), p.append("div.btn-group").selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(E) {
      return E;
    }).classed(`${Gu.btn}`, !0)``.on("click", function(E) {
      var A = a[E];
      w.forEach(A), m.each(function(I) {
        var F = He(this);
        u(F, I);
      }), t.onAnnotationSelectFunction();
    });
    var s = m.enter(), $ = s.append("p");
    $.append("span").classed("genelabel", !0), $.append("div").classed("btn-group", !0), m.each(function(E) {
      var A = He(this), I = A.select("div.btn-group");
      I.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(k) {
        return k;
      }).classed(`${Gu.btn}`, !0).on("click", function(k) {
        var j = a[k];
        j(E), t.onAnnotationSelectFunction(), u(A, E);
      });
    }), m.each(function(E) {
      var A = He(this);
      u(A, E);
    });
  }, d = function(p, g, b) {
    var w = b.data;
    p.append("a").attr("href", w.link).text(w.label), g.append("p").text(
      "Chromosome " + w.chromosome + ": " + w.start + "-" + w.end
    ), w.score && g.append("p").text("Score: " + parseFloat(w.score).toFixed(3)), g.append("hr");
    var m = g.append("p").style("float", "right").classed(Gu.btnGroup, !0), x = function() {
      let s = m.selectAll("a").data(["show", "hide", "auto"]);
      s.enter().append("a").attr("href", "#").text(function($) {
        return $;
      }).classed(`${Gu.btn}`, !0).on("click", function($) {
        var E = a[$];
        E(w), t.onAnnotationSelectFunction(), x();
      }), s.classed("disabled", function($) {
        return $ == "show" && w.visible || $ == "hide" && w.hidden && !w.visible || $ == "auto" && !w.hidden && !w.visible;
      });
    };
    x();
  }, v = {};
  return v.geneAnnotationsPopoverFunction = function(p, g) {
    var b = p.data.type == "geneslist";
    He(t.popoverId).attr("class", "popover");
    let w = He(t.popoverId).select(".popover-title"), m = He(t.popoverId).select(".popover-content");
    w.selectAll("*").remove(), w.text(""), m.selectAll("*").remove(), m.text(""), b ? f(w, m, p) : d(w, m, p);
    var x = g.target;
    it(".gene-annotation-popover").remove(), As(x, {
      content: it(t.popoverId).html(),
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
      onShow(s) {
        console.log("Popover is shown");
      },
      onHide(s) {
        console.log("Popover is hidden");
      }
    }), x._tippy.show(), it(document).on("click", function(s) {
      it(s.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || it(".gene-annotation-popover").remove();
    }), it(t.popoverId).on("mousedown mousewheel", function(s) {
      s.stopPropagation();
    });
  }, v;
}, rL = function(e) {
  var n = {
    border: !1,
    labelRectangles: !1,
    onAnnotationSelectFunction: it.noop(),
    onExpandClusterFunction: it.noop(),
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
  }, t = kt.merge({}, n, e), a = null, u = function() {
    return _o().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, f = function(p, g) {
    kt.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", a = nL(t);
    var b = u(), w = p.selectAll("g.gene-annotation").data(g.layout.annotationNodes, function($) {
      return $.data.id;
    }), m = w.enter().append("g").classed("gene-annotation", !0);
    m.append("line").classed("midpoint-line", !0), m.append("path").classed("link", !0).attr("d", function($) {
      return $.data.path;
    }), t.labelRectangles && m.append("rect").classed("labella", !0), m.append("text").attr("x", function($) {
      return $.x + 0.1 * t.annotationLabelSize;
    }).attr("y", function($) {
      return $.y + 0.4 * t.annotationLabelSize;
    }), p.selectAll("g.gene-annotation").attr("id", function($) {
      return "feature_" + $.data.id;
    }).attr("data-bs-toggle", "popover").attr("data-bs-trigger", "hover").attr("data-bs-html", "true"), p.selectAll("g.gene-annotation").classed("selected", function($) {
      return $.data.selected;
    }), p.selectAll("g.gene-annotation").select("line.midpoint-line").attr("x1", -(t.chromosomeWidth * 0.5)).attr("y1", function($) {
      return b($.data.midpoint);
    }).attr("y2", function($) {
      return b($.data.midpoint);
    }).attr("x2", 0), p.selectAll("g.gene-annotation").select("text").text(function($) {
      if ($.data.type == "gene")
        return $.data.label;
      if ($.data.type == "geneslist")
        return "(" + $.data.genesList.length + ")";
    }), t.labelRectangles && p.selectAll("g.gene-annotation").select("rect.labella").attr("fill", "pink").attr("stroke", "none").attr("x", function($) {
      return $.x;
    }).attr("y", function($) {
      return $.y - $.dy / 2;
    }).attr("width", function($) {
      return $.dx;
    }).attr("height", function($) {
      return $.dy;
    });
    var x = "0.5";
    p.selectAll("g.gene-annotation").select("path.link").style("opacity", function($) {
      return $.data.visible || $.data.selected ? 1 : $.data.normedScore ? $.data.normedScore : $.data.importance;
    }).style("stroke-width", function($) {
      return x;
    }).style("stroke", function($) {
      return $.data.visible || $.data.selected ? $.data.color : "gray";
    }), p.selectAll("g.gene-annotation").select("text").style("font-size", function($) {
      return ($.data.selected ? 0.2 : 0) + $.data.fontSize + "px";
    }).style("font-weight", function($) {
      return $.data.selected ? "bold" : "normal";
    }).style("fill", function($) {
      return $.data.selected ? $.data.color : null;
    }), p.selectAll("g.gene-annotation").select("text").transition().duration(300).attr("x", function($) {
      return $.x + 0.1 * t.annotationLabelSize;
    }).attr("y", function($) {
      return $.y + 0.4 * t.annotationLabelSize;
    }), p.selectAll("g.gene-annotation").select("path.link").transition().duration(300).attr("d", function($) {
      return $.data.path;
    }), p.selectAll("g.gene-annotation").on("click", function($, E) {
      E.data.type == "gene" && (E.data.selected = !E.data.selected, E.data.selected && (E.data.visible = !0), t.onAnnotationSelectFunction()), E.data.type == "geneslist" && t.onExpandClusterFunction(g, E.data);
    }), p.selectAll("g.gene-annotation").on("contextmenu", function($, E) {
      a.geneAnnotationsPopoverFunction(E, $);
    });
    var s = p.selectAll("g.gene-annotation").exit();
    s.remove();
  }, d = function(p) {
    p.select("rect.border").empty() && p.append("rect").classed("border", !0), p.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  };
  function v(p) {
    p.each(function(g) {
      var b = He(this).selectAll(".gene-annotations").data([g]);
      b.enter().append("g").attr("class", "gene-annotations"), b.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ).attr("id", function(w) {
        return "annotation_" + w.number;
      }), f(b, g), b.exit().remove(), t.border && d(b);
    });
  }
  return v.onAnnotationSelectFunction = function(p) {
    return arguments.length ? (t.onAnnotationSelectFunction = p, v) : t.onAnnotationSelectFunction;
  }, v.onExpandClusterFunction = function(p) {
    return arguments.length ? (t.onExpandClusterFunction = p, v) : t.onExpandClusterFunction;
  }, v.layout = function(p) {
    return arguments.length ? (t.layout = p, v) : t.layout;
  }, v.drawing = function(p) {
    return arguments.length ? (t.drawing = p, v) : t.drawing;
  }, v.scale = function(p) {
    return arguments.length ? (t.scale = p, v) : t.scale;
  }, v.longestChromosome = function(p) {
    return arguments.length ? (t.longestChromosome = p, v) : t.longestChromosome;
  }, v.chromosomeWidth = function(p) {
    return arguments.length ? (t.chromosomeWidth = p, v) : t.chromosomeWidth;
  }, v.annotationLabelSize = function(p) {
    return arguments.length ? (t.annotationLabelSize = p, v) : t.annotationLabelSize;
  }, v.annotationMarkerSize = function(p) {
    return arguments.length ? (t.annotationMarkerSize = p, v) : t.annotationMarkerSize;
  }, v;
}, iL = function(e) {
  var n = {
    border: !1,
    onAnnotationSelectFunction: it.noop(),
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
  }, t = kt.merge({}, n, e), a = function() {
    return _o().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, u = function(g, b, w, m) {
    var x = {};
    m.map(function(j, U) {
      x[j] = U;
    });
    var s = a(), $ = g.selectAll("rect.snp-annotation").data(w, function(j) {
      return j.id;
    }), E = 4, A = function(j) {
      return t.layout.width - 0.2 * t.layout.chromosomeWidth * (1 + x[j.trait]);
    }, I = function(j) {
      return s(j.midpoint) - 0.5 * Math.max(E / t.scale, s(10));
    }, F = Math.max(E / t.scale, s(10)), k = 0.2 * t.layout.chromosomeWidth;
    $.attr("x", A).attr("y", I).attr("width", k).attr("height", F), $.enter().append("rect").attr("fill", function(j) {
      return j.color;
    }).attr("opacity", function(j) {
      return j.importance;
    }).attr("class", "snp-annotation").attr("x", A).attr("y", I).attr("width", k).attr("height", F), $.exit().remove(), $.on("contextmenu", function(j) {
    });
  }, f = function(g, b, w) {
    var m = 500, x = a();
    t.layout.width;
    var s = 0.3 * t.layout.chromosomeWidth, $ = 0.4 * t.layout.chromosomeWidth, E = b.layout.qtlNodes.some(function(R) {
      return R.displayLabel;
    });
    E && ($ = $ * 1.5);
    var A = w * 0.2 * t.layout.chromosomeWidth, I = function(R) {
      return t.layout.width - R.labelPosition * ($ + s) - A;
    }, F = function(R) {
      return t.layout.width - R.position * ($ + s) - A;
    }, k = g.selectAll("g.qtl-annotation").data(b.layout.qtlNodes, function(R) {
      return R.id;
    }), j = k.enter().append("g").classed("qtl-annotation infobox", !0);
    j.append("rect").classed("qtl-hoverbox", !0);
    var U = j.append("rect").classed("qtl-selector infobox", !0), ne = {}, Se = {};
    k.exit().select("rect").each(function(R) {
      ne[R.index] = kt.pick(this, ["x", "y", "width", "height"]), ne[R.index].midpoint = R.midpoint, ne[R.index].position = R.position;
    }), U.each(function(R) {
      Se[R.index] = kt.pick(this, ["x", "y", "width", "height"]), Se[R.index].midpoint = R.midpoint, Se[R.index].position = R.position;
    });
    var Ce = function(R, te, Y, L) {
      return kt.has(R, te) ? R[te][Y].animVal.value : L;
    };
    U.attr("x", function(R) {
      return Ce(ne, R.parentIndex, "x", F(R));
    }).attr("y", function(R) {
      return Ce(ne, R.parentIndex, "y", x(R.start));
    }).attr("width", s).attr("height", function(R) {
      return Ce(
        ne,
        R.parentIndex,
        "height",
        x(R.end) - x(R.start)
      );
    }), k.attr("id", function(R) {
      return "feature_" + R.id;
    }), k.select("rect.qtl-hoverbox").attr("x", function(R) {
      return F(R);
    }).attr("y", function(R) {
      return x(R.start);
    }).attr("width", function(R) {
      return R.position * ($ + s) + t.chromosomeWidth + A;
    }).attr("height", function(R) {
      return x(R.end) - x(R.start);
    }).attr("fill", function(R) {
      return R.color;
    }).attr("visibility", function(R) {
      return R.hover ? "visible" : "hidden";
    }), k.select("rect.qtl-selector").transition().duration(m).attr("x", F).attr("y", function(R) {
      return x(R.start);
    }).attr("width", s).attr("height", function(R) {
      return x(R.end) - x(R.start);
    }), k.select("rect.qtl-selector").style("fill", function(R) {
      return R.color;
    }), k.exit().select("rect").transition().duration(m).attr("x", function(R) {
      return Ce(Se, R.parentIndex, "x", F(R));
    }).attr("y", function(R) {
      return Ce(Se, R.parentIndex, "y", x(R.start));
    }).attr("width", function(R) {
      return s;
    }).attr("height", function(R) {
      return Ce(
        Se,
        R.parentIndex,
        "height",
        x(R.end) - x(R.start)
      );
    }).remove(), k.exit().remove();
    var Ee = function(R) {
      return x(R.midpoint);
    }, Ae = function(R) {
      return R.displayLabel === "show" ? "visible" : R.displayLabel === "hide" ? "hidden" : !0;
    }, We = j.append("g").classed("qtl-count-group", !0), Fe = k.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(R) {
        var te = R.type == "qtllist" ? [R] : [];
        return te;
      },
      function(R) {
        return "label_" + R.id;
      }
    ), J = Fe.enter(), _e = J.append("g").classed("qtllist", !0);
    _e.append("circle").classed("qtl-count", !0), _e.append("text").classed("qtl-count", !0), We.each(function(R) {
      if (kt.has(Se, R.index))
        if (kt.has(ne, R.parentIndex)) {
          let L = ne[R.parentIndex];
          var te = t.layout.width - L.position * ($ + s), Y = x(L.midpoint);
          He(this).attr(
            "transform",
            "translate(" + (te + 0.5 * s) + "," + Y + ")"
          );
        } else
          He(this).attr("transform", function(L) {
            return L ? "translate(" + (F(L) + 0.5 * s) + "," + Ee(L) + ")" : "translate(0,0)";
          });
    }), k.select("g.qtl-count-group").transition().duration(m).attr("transform", function(R) {
      return R ? "translate(" + (F(R) + 0.5 * s) + "," + Ee(R) + ")" : "translate(0,0)";
    }), k.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", s + "px").style("visibility", "visible").style("fill", function(R) {
      return R.color;
    }).attr("id", function(R) {
      return R.id;
    });
    var oe = Math.min(
      Math.max(10 / t.scale, s),
      14 / t.scale
    );
    k.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", oe + "px").style(
      "visibility",
      oe < 2 * s ? "visible" : "hidden"
    ).text(function(R) {
      return R.count;
    }), Fe.exit().remove(), j.append("g").classed("qtl-label-group", !0);
    var pe = k.select("g.qtl-label-group").selectAll("g.qtl").data(
      function(R) {
        var te = R.displayLabel ? [R] : [];
        return te;
      },
      function(R) {
        return "label_" + R.id;
      }
    );
    pe.exit().remove(), pe.transition().duration(m).attr("transform", function(R) {
      return "translate(" + (I(R) + 0.5 * s) + "," + Ee(R) + ")";
    });
    var ke = pe.enter(), Ne = ke.append("g").classed("qtl", !0).attr("transform", function(R) {
      return "translate(" + (I(R) + 0.5 * s) + "," + Ee(R) + ")";
    });
    Ne.append("text").classed("qtl-label", !0), k.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(R) {
      return R.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", Ae).text(function(R) {
      return R.screenLabel;
    });
    var ae = function(R) {
      R.on("mouseenter", function(te) {
        te.hover = !0, f(g, b, w);
      }).on("mouseout", function(te) {
        te.hover = !1, f(g, b, w);
      }).on("click", function(te) {
        te.hover = !te.hover, f(g, b, w);
      });
    };
    ae(k.select("rect.qtl-selector")), ae(k.select("circle.qtl-count")), ae(k.select("text.qtl-count")), k.on("contextmenu", function(R) {
      var te = He("#clusterPopover");
      te.attr("class", "popover");
      var Y = te.select(".popover-title");
      Y.selectAll("*").remove(), Y.text(""), Y.text(
        "Chromosome " + R.chromosome + ": " + R.start + "-" + R.end
      ), it.fn.redraw = function() {
        return it(this).each(function() {
          this.offsetHeight;
        });
      }, L = te.select(".popover-content"), L.selectAll("*").remove(), L.text("");
      var L = te.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        R.type == "qtllist" ? R.qtlList : [R]
      ), B = L.enter();
      B.append("p").classed("popover-annotation", !0);
      var re = L.append("div").attr("class", "checkbox").append("label");
      re.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(xe) {
        return xe.selected;
      }).on("click", function(xe) {
        xe.selected = !xe.selected, L.classed("selected", function(be) {
          return be.selected;
        }), t.onAnnotationSelectFunction();
      }), re.append("a").attr("href", function(xe) {
        return xe.link;
      }).attr("target", "_blank").text(function(xe) {
        return xe.label;
      }), L.classed("selected", function(xe) {
        return xe.selected;
      });
    });
  }, d = function(g) {
    g.select("rect.border").empty() && g.append("rect").classed("border", !0), g.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  }, v = function(g) {
    var b = /* @__PURE__ */ new Set();
    g.map(function(m) {
      b.add(m.trait);
    });
    var w = Array.from(b).sort();
    return w;
  };
  function p(g) {
    g.each(function(b) {
      var w = b.annotations.snps.filter(function($) {
        return !($.pvalue > t.maxSnpPValue);
      }), m = v(w), x = He(this).selectAll(".qtl-annotations").data([b]);
      x.enter().append("g").attr("class", "qtl-annotations"), x.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), f(x, b, m.length), t.border && d(x), x.exit().remove();
      var s = He(this).selectAll(".snp-annotations").data([b]);
      s.enter().append("g").attr("class", "snp-annotations"), s.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), u(s, b, w, m), s.exit().remove();
    });
  }
  return p.onAnnotationSelectFunction = function(g) {
    return arguments.length ? (t.onAnnotationSelectFunction = g, p) : t.onAnnotationSelectFunction;
  }, p.layout = function(g) {
    return arguments.length ? (t.layout = g, p) : t.layout;
  }, p.drawing = function(g) {
    return arguments.length ? (t.drawing = g, p) : t.drawing;
  }, p.longestChromosome = function(g) {
    return arguments.length ? (t.longestChromosome = g, p) : t.longestChromosome;
  }, p.chromosomeWidth = function(g) {
    return arguments.length ? (t.chromosomeWidth = g, p) : t.chromosomeWidth;
  }, p.annotationLabelSize = function(g) {
    return arguments.length ? (t.annotationLabelSize = g, p) : t.annotationLabelSize;
  }, p.annotationMarkerSize = function(g) {
    return arguments.length ? (t.annotationMarkerSize = g, p) : t.annotationMarkerSize;
  }, p.showAnnotationLabels = function(g) {
    return arguments.length ? (t.showAnnotationLabels = g, p) : t.showAnnotationLabels;
  }, p.maxSnpPValue = function(g) {
    return arguments.length ? (t.maxSnpPValue = g, p) : t.maxSnpPValue;
  }, p.infoBoxManager = function(g) {
    return arguments.length ? (t.infoBoxManager = g, p) : t.infoBoxManager;
  }, p.scale = function(g) {
    return arguments.length ? (t.scale = g, p) : t.scale;
  }, p;
}, oL = function(e) {
  var n = {
    border: !1,
    onAnnotationSelectFunction: it.noop(),
    onExpandClusterFunction: it.noop(),
    onLabelSelectFunction: it.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, t = kt.merge({}, n, e);
  function a(u) {
    u.each(function(f) {
      var d = f.cellLayout, v = He(this).selectAll(".chromosome-cell").data(f.chromosomes), p = v.enter().append("g").attr("class", "chromosome-cell");
      t.border && p.append("rect").classed("border", !0), He(this).selectAll(".chromosome-cell").attr("transform", function(x) {
        return "translate(" + x.cell.x + "," + x.cell.y + ")";
      }), t.border && v.select("rect").attr("x", 0).attr("y", 0).attr("width", function(x) {
        return x.cell.width;
      }).attr("height", function(x) {
        return x.cell.height;
      });
      var g = rL().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(d.geneAnnotationPosition).longestChromosome(d.longestChromosome).chromosomeWidth(d.chromosomePosition.width).annotationLabelSize(d.annotations.label.size).annotationMarkerSize(d.annotations.marker.size).drawing(t.svg).scale(d.scale);
      yf(".chromosome-cell").call(g);
      var b = bN().layout(d.chromosomePosition).longestChromosome(d.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(d.scale).bands("genes").drawing(t.svg);
      yf(".chromosome-cell").call(b);
      var w = wN().layout(d.labelPosition).sizeLayout(d.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(d.longestChromosome).scale(d.scale);
      v.call(w);
      var m = iL().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(d.qtlAnnotationPosition).longestChromosome(d.longestChromosome).chromosomeWidth(d.chromosomePosition.width).annotationLabelSize(d.annotations.label.size).annotationMarkerSize(d.annotations.marker.size).showAnnotationLabels(d.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(d.scale);
      v.call(m), v.exit().remove();
    });
  }
  return a.onAnnotationSelectFunction = function(u) {
    return arguments.length ? (t.onAnnotationSelectFunction = u, a) : t.onAnnotationSelectFunction;
  }, a.onExpandClusterFunction = function(u) {
    return arguments.length ? (t.onExpandClusterFunction = u, a) : t.onExpandClusterFunction;
  }, a.onLabelSelectFunction = function(u) {
    return arguments.length ? (t.onLabelSelectFunction = u, a) : t.onLabelSelectFunction;
  }, a.infoBoxManager = function(u) {
    return arguments.length ? (t.infoBoxManager = u, a) : t.infoBoxManager;
  }, a.maxAnnotationLayers = function(u) {
    return arguments.length ? (t.maxAnnotationLayers = u, a) : t.maxAnnotationLayers;
  }, a.maxSnpPValue = function(u) {
    return arguments.length ? (t.maxSnpPValue = u, a) : t.maxSnpPValue;
  }, a.svg = function(u) {
    return arguments.length ? (t.svg = u, a) : t.svg;
  }, a;
};
var Vv = { exports: {} };
(function(e, n) {
  (function(t, a) {
    e.exports = a();
  })(uo, function() {
    return function(t) {
      function a(f) {
        if (u[f]) return u[f].exports;
        var d = u[f] = { exports: {}, id: f, loaded: !1 };
        return t[f].call(d.exports, d, d.exports, a), d.loaded = !0, d.exports;
      }
      var u = {};
      return a.m = t, a.c = u, a.p = "", a(0);
    }([function(t, a, u) {
      t.exports = { Node: u(1), Force: u(2), Distributor: u(3), Renderer: u(10) };
    }, function(t, a) {
      function u(v, p) {
        if (!(v instanceof p)) throw new TypeError("Cannot call a class as a function");
      }
      var f = /* @__PURE__ */ function() {
        function v(p, g) {
          for (var b = 0; b < g.length; b++) {
            var w = g[b];
            w.enumerable = w.enumerable || !1, w.configurable = !0, "value" in w && (w.writable = !0), Object.defineProperty(p, w.key, w);
          }
        }
        return function(p, g, b) {
          return g && v(p.prototype, g), b && v(p, b), p;
        };
      }(), d = function() {
        function v(p, g, b) {
          u(this, v), this.idealPos = p, this.currentPos = p, this.width = g, this.data = b, this.layerIndex = 0;
        }
        return f(v, [{ key: "distanceFrom", value: function(p) {
          var g = this.width / 2, b = p.width / 2;
          return Math.max(this.currentPos - g, p.currentPos - b) - Math.min(this.currentPos + g, p.currentPos + b);
        } }, { key: "moveToIdealPosition", value: function() {
          return this.currentPos = this.idealPos, this;
        } }, { key: "displacement", value: function() {
          return this.idealPos - this.currentPos;
        } }, { key: "overlapWithNode", value: function(p) {
          var g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return this.distanceFrom(p) - g < 0;
        } }, { key: "overlapWithPoint", value: function(p) {
          var g = this.width / 2;
          return p >= this.currentPos - g && p <= this.currentPos + g;
        } }, { key: "positionBefore", value: function(p) {
          var g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return p.currentLeft() - this.width / 2 - g;
        } }, { key: "positionAfter", value: function(p) {
          var g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return p.currentRight() + this.width / 2 + g;
        } }, { key: "currentRight", value: function() {
          return this.currentPos + this.width / 2;
        } }, { key: "currentLeft", value: function() {
          return this.currentPos - this.width / 2;
        } }, { key: "idealRight", value: function() {
          return this.idealPos + this.width / 2;
        } }, { key: "idealLeft", value: function() {
          return this.idealPos - this.width / 2;
        } }, { key: "createStub", value: function(p) {
          var g = new v(this.idealPos, p, this.data);
          return g.currentPos = this.currentPos, g.child = this, this.parent = g, g;
        } }, { key: "removeStub", value: function() {
          return this.parent && (this.parent.child = null, this.parent = null), this;
        } }, { key: "isStub", value: function() {
          return !!this.child;
        } }, { key: "getPathToRoot", value: function() {
          for (var p = [], g = this; g; ) p.push(g), g = g.parent;
          return p;
        } }, { key: "getPathFromRoot", value: function() {
          return this.getPathToRoot().reverse();
        } }, { key: "getPathToRootLength", value: function() {
          for (var p = 0, g = this; g; ) {
            var b = g.parent ? g.parent.currentPos : g.idealPos;
            p += Math.abs(g.currentPos - b), g = g.parent;
          }
          return p;
        } }, { key: "getRoot", value: function() {
          for (var p = this, g = this; g; ) p = g, g = g.parent;
          return p;
        } }, { key: "getLayerIndex", value: function() {
          return this.layerIndex;
        } }, { key: "clone", value: function() {
          var p = new v(this.idealPos, this.width, this.data);
          return p.currentPos = this.currentPos, p.layerIndex = this.layerIndex, p;
        } }]), v;
      }();
      t.exports = d;
    }, function(t, a, u) {
      var f = u(3), d = u(4), v = u(8), p = { nodeSpacing: 3, minPos: 0, maxPos: null, algorithm: "overlap", removeOverlap: !0, density: 0.85, stubWidth: 1 }, g = function(b) {
        var w = {}, m = d.extend({}, p), x = new f(), s = [], $ = null;
        return w.nodes = function(E) {
          return arguments.length ? (s = E, $ = [E.concat()], w) : s;
        }, w.getLayers = function() {
          return $;
        }, w.options = function(E) {
          if (!arguments.length) return m;
          m = d.extend(m, E);
          var A = d.pick(m, Object.keys(f.DEFAULT_OPTIONS));
          return d.isDefined(m.minPos) && d.isDefined(m.maxPos) ? A.layerWidth = m.maxPos - m.minPos : A.layerWidth = null, x.options(A), w;
        }, w.options(b), w.compute = function() {
          var E = d.pick(m, Object.keys(v.DEFAULT_OPTIONS));
          return s.forEach(function(A) {
            A.removeStub();
          }), $ = x.distribute(s), $.map(function(A, I) {
            A.forEach(function(F) {
              F.layerIndex = I;
            }), m.removeOverlap && v(A, E);
          }), w;
        }, w.start = function() {
          console.log("[warning] force.start() is deprecated. Please use force.compute() instead.");
        }, w;
      };
      g.DEFAULT_OPTIONS = p, t.exports = g;
    }, function(t, a, u) {
      var f = u(4), d = u(6), v = { algorithm: "overlap", layerWidth: 1e3, density: 0.75, nodeSpacing: 3, stubWidth: 1 }, p = function(g) {
        var b = {};
        g = f.extend({}, v, g), b.options = function(m) {
          return arguments.length ? (g = f.extend(g, m), b) : g;
        }, b.computeRequiredWidth = function(m) {
          return f.sum(m, function(x) {
            return x.width + g.nodeSpacing;
          }) - g.nodeSpacing;
        }, b.maxWidthPerLayer = function() {
          return g.density * g.layerWidth;
        }, b.needToSplit = function(m) {
          return b.estimateRequiredLayers(m) > 1;
        }, b.estimateRequiredLayers = function(m) {
          return g.layerWidth ? Math.ceil(b.computeRequiredWidth(m) / b.maxWidthPerLayer()) : 1;
        };
        var w = { simple: function(m) {
          for (var x = b.estimateRequiredLayers(m), s = [], $ = 0; $ < x; $++) s.push([]);
          return m.forEach(function(E, A) {
            var I = A % x;
            s[I].push(E);
            for (var F = E, k = I - 1; k >= 0; k--) F = F.createStub(g.stubWidth), s[k].push(F);
          }), s;
        }, roundRobin: function(m) {
          var x = [];
          return x;
        }, overlap: function(m) {
          for (var x = [], s = b.maxWidthPerLayer(), $ = m.concat(), E = b.computeRequiredWidth($); E > s; ) {
            b.countIdealOverlaps($);
            var A = $.concat(), I = E;
            for ($ = []; A.length > 2 && I > s; ) {
              A.sort(function(Ee, Ae) {
                return Ae.overlapCount - Ee.overlapCount;
              });
              var F = A.shift();
              I -= F.width, I += g.stubWidth, F.overlaps.forEach(function(Ee) {
                Ee.overlapCount--;
              }), $.push(F);
            }
            x.push(A), E = b.computeRequiredWidth($);
          }
          $.length > 0 && x.push($);
          for (var k = x.length - 1; k >= 1; k--) for (var j = x[k], U = 0; U < j.length; U++) {
            var ne = j[U];
            if (!ne.isStub()) for (var Se = ne, Ce = k - 1; Ce >= 0; Ce--) Se = Se.createStub(g.stubWidth), x[Ce].push(Se);
          }
          return x;
        } };
        return b.countIdealOverlaps = function(m) {
          var x = new d(g.layerWidth / 2);
          return m.forEach(function(s) {
            x.add([s.idealLeft(), s.idealRight(), s]);
          }), m.forEach(function(s) {
            var $ = x.search(s.idealLeft(), s.idealRight());
            s.overlaps = $.map(function(E) {
              return E.data[2];
            }), s.overlapCount = $.length;
          }), m;
        }, b.distribute = function(m) {
          if (!m || m.length === 0) return [];
          if (g.algorithm == "none" || !f.isDefined(g.algorithm)) return [m];
          if (!b.needToSplit(m)) return [m];
          var x = m.concat().sort(function(s, $) {
            return s.idealPos - $.idealPos;
          });
          if (typeof g.algorithm == "function") return g.algorithm(x, g);
          if (w.hasOwnProperty(g.algorithm)) return w[g.algorithm](x);
          throw "Unknown algorithm: " + g.algorithm;
        }, b;
      };
      p.DEFAULT_OPTIONS = v, t.exports = p;
    }, function(t, a, u) {
      var f = { isDefined: function(d) {
        return d != null;
      }, last: function(d) {
        return d.length > 0 ? d[d.length - 1] : null;
      }, pick: function(d, v) {
        return v.reduce(function(p, g) {
          return p[g] = d[g], p;
        }, {});
      }, sum: function(d, v) {
        return d.map(v).reduce(function(p, g) {
          return p + g;
        }, 0);
      } };
      f.extend = u(5), t.exports = f;
    }, function(t, a) {
      var u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(g) {
        return typeof g;
      } : function(g) {
        return g && typeof Symbol == "function" && g.constructor === Symbol && g !== Symbol.prototype ? "symbol" : typeof g;
      }, f = Object.prototype.hasOwnProperty, d = Object.prototype.toString, v = function(g) {
        return typeof Array.isArray == "function" ? Array.isArray(g) : d.call(g) === "[object Array]";
      }, p = function(g) {
        if (!g || d.call(g) !== "[object Object]") return !1;
        var b = f.call(g, "constructor"), w = g.constructor && g.constructor.prototype && f.call(g.constructor.prototype, "isPrototypeOf");
        if (g.constructor && !b && !w) return !1;
        var m;
        for (m in g) ;
        return m === void 0 || f.call(g, m);
      };
      t.exports = function g() {
        var b, w, m, x, s, $, E = arguments[0], A = 1, I = arguments.length, F = !1;
        for (typeof E == "boolean" ? (F = E, E = arguments[1] || {}, A = 2) : ((typeof E > "u" ? "undefined" : u(E)) !== "object" && typeof E != "function" || E == null) && (E = {}); A < I; ++A) if (b = arguments[A], b != null) for (w in b) m = E[w], x = b[w], E !== x && (F && x && (p(x) || (s = v(x))) ? (s ? (s = !1, $ = m && v(m) ? m : []) : $ = m && p(m) ? m : {}, E[w] = g(F, $, x)) : x !== void 0 && (E[w] = x));
        return E;
      };
    }, function(t, a, u) {
      function f(m, x) {
        if (x || (x = {}), this.startKey = x.startKey || 0, this.endKey = x.endKey || 1, this.intervalHash = {}, this.pointTree = new w({ compare: function(s, $) {
          if (s == null) return -1;
          if ($ == null) return 1;
          var E = s[0] - $[0];
          return E > 0 ? 1 : E == 0 ? 0 : -1;
        } }), this._autoIncrement = 0, !m || typeof m != "number") throw new Error("you must specify center index as the 2nd argument.");
        this.root = new g(m);
      }
      function d(m, x) {
        return x.end < m.idx ? (m.left || (m.left = new g(x.start + x.end >> 1)), d.call(this, m.left, x)) : m.idx < x.start ? (m.right || (m.right = new g(x.start + x.end >> 1)), d.call(this, m.right, x)) : m.insert(x);
      }
      function v(m, x, s) {
        if (m) return x < m.idx ? (m.starts.every(function($) {
          var E = $.start <= x;
          return E && s.push($.result()), E;
        }), v.call(this, m.left, x, s)) : x > m.idx ? (m.ends.every(function($) {
          var E = $.end >= x;
          return E && s.push($.result()), E;
        }), v.call(this, m.right, x, s)) : void m.starts.map(function($) {
          s.push($.result());
        });
      }
      function p(m, x, s) {
        if (x - m <= 0) throw new Error("end must be greater than start. start: " + m + ", end: " + x);
        var $ = {}, E = [];
        v.call(this, this.root, m + x >> 1, E, !0), E.forEach(function(j) {
          $[j.id] = !0;
        });
        for (var A = this.pointTree.bsearch([m, null]), I = this.pointTree; A >= 0 && I[A][0] == m; ) A--;
        var F = this.pointTree.bsearch([x, null]);
        if (F >= 0) {
          for (var k = I.length - 1; F <= k && I[F][0] <= x; ) F++;
          I.slice(A + 1, F).forEach(function(j) {
            var U = j[1];
            $[U] = !0;
          }, this), Object.keys($).forEach(function(j) {
            var U = this.intervalHash[j];
            s.push(U.result(m, x));
          }, this);
        }
      }
      function g(m) {
        this.idx = m, this.starts = new w({ compare: function(x, s) {
          if (x == null) return -1;
          if (s == null) return 1;
          var $ = x.start - s.start;
          return $ > 0 ? 1 : $ == 0 ? 0 : -1;
        } }), this.ends = new w({ compare: function(x, s) {
          if (x == null) return -1;
          if (s == null) return 1;
          var $ = x.end - s.end;
          return $ < 0 ? 1 : $ == 0 ? 0 : -1;
        } });
      }
      function b(m, x, s, $) {
        if (this.id = x, this.start = m[s], this.end = m[$], this.data = m, typeof this.start != "number" || typeof this.end != "number") throw new Error("start, end must be number. start: " + this.start + ", end: " + this.end);
        if (this.start >= this.end) throw new Error("start must be smaller than end. start: " + this.start + ", end: " + this.end);
      }
      var w = u(7);
      f.prototype.add = function(m, x) {
        if (this.intervalHash[x]) throw new Error("id " + x + " is already registered.");
        if (x == null) {
          for (; this.intervalHash[this._autoIncrement]; ) this._autoIncrement++;
          x = this._autoIncrement;
        }
        var s = new b(m, x, this.startKey, this.endKey);
        this.pointTree.insert([s.start, x]), this.pointTree.insert([s.end, x]), this.intervalHash[x] = s, this._autoIncrement++, d.call(this, this.root, s);
      }, f.prototype.search = function(m, x) {
        var s = [];
        if (typeof m != "number") throw new Error(m + ": invalid input");
        if (x == null) v.call(this, this.root, m, s);
        else {
          if (typeof x != "number") throw new Error(m + "," + x + ": invalid input");
          p.call(this, m, x, s);
        }
        return s;
      }, f.prototype.remove = function(m) {
      }, g.prototype.insert = function(m) {
        this.starts.insert(m), this.ends.insert(m);
      }, b.prototype.result = function(m, x) {
        var s = { id: this.id, data: this.data };
        if (typeof m == "number" && typeof x == "number") {
          var $ = Math.max(this.start, m), E = Math.min(this.end, x), A = E - $;
          s.rate1 = A / (x - m), s.rate2 = A / (this.end - this.start);
        }
        return s;
      }, t.exports = f;
    }, function(t, a) {
      var u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(d) {
        return typeof d;
      } : function(d) {
        return d && typeof Symbol == "function" && d.constructor === Symbol && d !== Symbol.prototype ? "symbol" : typeof d;
      }, f = function d() {
        var v = null, p = {}, g = arguments;
        ["0", "1"].forEach(function(b) {
          var w = g[b];
          Array.isArray(w) ? v = w : w && (typeof w > "u" ? "undefined" : u(w)) == "object" && (p = w);
        }), typeof p.filter == "function" && (this._filter = p.filter), typeof p.compare == "function" ? this._compare = p.compare : typeof p.compare == "string" && d.compares[p.compare] && (this._compare = d.compares[p.compare]), this._unique = !!p.unique, p.resume && v ? v.forEach(function(b, w) {
          this.push(b);
        }, this) : v && this.insert.apply(this, v);
      };
      f.create = function(d, v) {
        return new f(d, v);
      }, f.prototype = new Array(), f.prototype.constructor = Array.prototype.constructor, f.prototype.insertOne = function(d) {
        var v = this.bsearch(d);
        return (!this._unique || this.key(d, v) == null) && !!this._filter(d, v) && (this.splice(v + 1, 0, d), v + 1);
      }, f.prototype.insert = function() {
        return Array.prototype.map.call(arguments, function(d) {
          return this.insertOne(d);
        }, this);
      }, f.prototype.remove = function(d) {
        return this.splice(d, 1), this;
      }, f.prototype.bsearch = function(d) {
        if (!this.length) return -1;
        for (var v, p = 0, g = this.length; g - p > 1; ) {
          v = Math.floor((p + g) / 2);
          var b = this[v], w = this._compare(d, b);
          if (w == 0) return v;
          w > 0 ? p = v : g = v;
        }
        return p == 0 && this._compare(this[0], d) > 0 ? -1 : p;
      }, f.prototype.key = function(d, v) {
        v == null && (v = this.bsearch(d));
        var p = v;
        if (p == -1 || this._compare(this[p], d) < 0) return p + 1 < this.length && this._compare(this[p + 1], d) == 0 ? p + 1 : null;
        for (; p >= 1 && this._compare(this[p - 1], d) == 0; ) p--;
        return p;
      }, f.prototype.keys = function(d, v) {
        var p = [];
        v == null && (v = this.bsearch(d));
        for (var g = v; g >= 0 && this._compare(this[g], d) == 0; ) p.push(g), g--;
        var b = this.length;
        for (g = v + 1; g < b && this._compare(this[g], d) == 0; ) p.push(g), g++;
        return p.length ? p : null;
      }, f.prototype.unique = function(d) {
        if (d) return this.filter(function(p, g) {
          return g == 0 || this._compare(this[g - 1], p) != 0;
        }, this);
        var v = 0;
        return this.map(function(p, g) {
          return g == 0 || this._compare(this[g - 1], p) != 0 ? null : g - v++;
        }, this).forEach(function(p) {
          p != null && this.remove(p);
        }, this), this;
      }, f.prototype.toArray = function() {
        return this.slice();
      }, f.prototype._filter = function(d, v) {
        return !0;
      }, f.compares = { number: function(d, v) {
        var p = d - v;
        return p > 0 ? 1 : p == 0 ? 0 : -1;
      }, string: function(d, v) {
        return d > v ? 1 : d == v ? 0 : -1;
      } }, f.prototype._compare = f.compares.string, t.exports = f;
    }, function(t, a, u) {
      function f(b) {
        var w = new p.Variable(b.targetPos);
        return w.node = b, w;
      }
      function d(b, w) {
        if (b.length > 0) {
          w = v.extend(g, w), b.forEach(function(U, ne) {
            U.targetPos = U.parent ? U.parent.currentPos : U.idealPos, U.index = ne;
          });
          for (var m = b.concat().sort(function(U, ne) {
            var Se = U.targetPos - ne.targetPos;
            if (Se !== 0) return Se;
            var Ce = U.isStub() - ne.isStub();
            return Ce !== 0 ? Ce : U.index - ne.index;
          }).map(f), x = [], s = 1; s < m.length; s++) {
            var $ = m[s - 1], E = m[s], A = void 0;
            A = $.node.isStub() && E.node.isStub() ? ($.node.width + E.node.width) / 2 + w.lineSpacing : ($.node.width + E.node.width) / 2 + w.nodeSpacing, x.push(new p.Constraint($, E, A));
          }
          if (v.isDefined(w.minPos)) {
            var I = new p.Variable(w.minPos, 1e10), F = m[0];
            x.push(new p.Constraint(I, F, F.node.width / 2)), m.unshift(I);
          }
          if (v.isDefined(w.maxPos)) {
            var k = new p.Variable(w.maxPos, 1e10), j = v.last(m);
            x.push(new p.Constraint(j, k, j.node.width / 2)), m.push(k);
          }
          new p.Solver(m, x).solve(), m.filter(function(U) {
            return U.node;
          }).map(function(U) {
            return U.node.currentPos = Math.round(U.position()), U;
          });
        }
        return b;
      }
      var v = u(4), p = u(9), g = { lineSpacing: 2, nodeSpacing: 3, minPos: 0, maxPos: null };
      d.DEFAULT_OPTIONS = g, t.exports = d;
    }, function(t, a) {
      var u = {}, f = function() {
        function w(m) {
          this.scale = m, this.AB = 0, this.AD = 0, this.A2 = 0;
        }
        return w.prototype.addVariable = function(m) {
          var x = this.scale / m.scale, s = m.offset / m.scale, $ = m.weight;
          this.AB += $ * x * s, this.AD += $ * x * m.desiredPosition, this.A2 += $ * x * x;
        }, w.prototype.getPosn = function() {
          return (this.AD - this.AB) / this.A2;
        }, w;
      }();
      u.PositionStats = f;
      var d = function() {
        function w(m, x, s, $) {
          $ === void 0 && ($ = !1), this.left = m, this.right = x, this.gap = s, this.equality = $, this.active = !1, this.unsatisfiable = !1, this.left = m, this.right = x, this.gap = s, this.equality = $;
        }
        return w.prototype.slack = function() {
          return this.unsatisfiable ? Number.MAX_VALUE : this.right.scale * this.right.position() - this.gap - this.left.scale * this.left.position();
        }, w;
      }();
      u.Constraint = d;
      var v = function() {
        function w(m, x, s) {
          x === void 0 && (x = 1), s === void 0 && (s = 1), this.desiredPosition = m, this.weight = x, this.scale = s, this.offset = 0;
        }
        return w.prototype.dfdv = function() {
          return 2 * this.weight * (this.position() - this.desiredPosition);
        }, w.prototype.position = function() {
          return (this.block.ps.scale * this.block.posn + this.offset) / this.scale;
        }, w.prototype.visitNeighbours = function(m, x) {
          var s = function($, E) {
            return $.active && m !== E && x($, E);
          };
          this.cOut.forEach(function($) {
            return s($, $.right);
          }), this.cIn.forEach(function($) {
            return s($, $.left);
          });
        }, w;
      }();
      u.Variable = v;
      var p = function() {
        function w(m) {
          this.vars = [], m.offset = 0, this.ps = new f(m.scale), this.addVariable(m);
        }
        return w.prototype.addVariable = function(m) {
          m.block = this, this.vars.push(m), this.ps.addVariable(m), this.posn = this.ps.getPosn();
        }, w.prototype.updateWeightedPosition = function() {
          this.ps.AB = this.ps.AD = this.ps.A2 = 0;
          for (var m = 0, x = this.vars.length; m < x; ++m) this.ps.addVariable(this.vars[m]);
          this.posn = this.ps.getPosn();
        }, w.prototype.compute_lm = function(m, x, s) {
          var $ = this, E = m.dfdv();
          return m.visitNeighbours(x, function(A, I) {
            var F = $.compute_lm(I, m, s);
            I === A.right ? (E += F * A.left.scale, A.lm = F) : (E += F * A.right.scale, A.lm = -F), s(A);
          }), E / m.scale;
        }, w.prototype.populateSplitBlock = function(m, x) {
          var s = this;
          m.visitNeighbours(x, function($, E) {
            E.offset = m.offset + (E === $.right ? $.gap : -$.gap), s.addVariable(E), s.populateSplitBlock(E, m);
          });
        }, w.prototype.traverse = function(m, x, s, $) {
          var E = this;
          s === void 0 && (s = this.vars[0]), $ === void 0 && ($ = null), s.visitNeighbours($, function(A, I) {
            x.push(m(A)), E.traverse(m, x, I, s);
          });
        }, w.prototype.findMinLM = function() {
          var m = null;
          return this.compute_lm(this.vars[0], null, function(x) {
            !x.equality && (m === null || x.lm < m.lm) && (m = x);
          }), m;
        }, w.prototype.findMinLMBetween = function(m, x) {
          this.compute_lm(m, null, function() {
          });
          var s = null;
          return this.findPath(m, null, x, function($, E) {
            !$.equality && $.right === E && (s === null || $.lm < s.lm) && (s = $);
          }), s;
        }, w.prototype.findPath = function(m, x, s, $) {
          var E = this, A = !1;
          return m.visitNeighbours(x, function(I, F) {
            A || F !== s && !E.findPath(F, m, s, $) || (A = !0, $(I, F));
          }), A;
        }, w.prototype.isActiveDirectedPathBetween = function(m, x) {
          if (m === x) return !0;
          for (var s = m.cOut.length; s--; ) {
            var $ = m.cOut[s];
            if ($.active && this.isActiveDirectedPathBetween($.right, x)) return !0;
          }
          return !1;
        }, w.split = function(m) {
          return m.active = !1, [w.createSplitBlock(m.left), w.createSplitBlock(m.right)];
        }, w.createSplitBlock = function(m) {
          var x = new w(m);
          return x.populateSplitBlock(m, null), x;
        }, w.prototype.splitBetween = function(m, x) {
          var s = this.findMinLMBetween(m, x);
          if (s !== null) {
            var $ = w.split(s);
            return { constraint: s, lb: $[0], rb: $[1] };
          }
          return null;
        }, w.prototype.mergeAcross = function(m, x, s) {
          x.active = !0;
          for (var $ = 0, E = m.vars.length; $ < E; ++$) {
            var A = m.vars[$];
            A.offset += s, this.addVariable(A);
          }
          this.posn = this.ps.getPosn();
        }, w.prototype.cost = function() {
          for (var m = 0, x = this.vars.length; x--; ) {
            var s = this.vars[x], $ = s.position() - s.desiredPosition;
            m += $ * $ * s.weight;
          }
          return m;
        }, w;
      }();
      u.Block = p;
      var g = function() {
        function w(m) {
          this.vs = m;
          var x = m.length;
          for (this.list = new Array(x); x--; ) {
            var s = new p(m[x]);
            this.list[x] = s, s.blockInd = x;
          }
        }
        return w.prototype.cost = function() {
          for (var m = 0, x = this.list.length; x--; ) m += this.list[x].cost();
          return m;
        }, w.prototype.insert = function(m) {
          m.blockInd = this.list.length, this.list.push(m);
        }, w.prototype.remove = function(m) {
          var x = this.list.length - 1, s = this.list[x];
          this.list.length = x, m !== s && (this.list[m.blockInd] = s, s.blockInd = m.blockInd);
        }, w.prototype.merge = function(m) {
          var x = m.left.block, s = m.right.block, $ = m.right.offset - m.left.offset - m.gap;
          x.vars.length < s.vars.length ? (s.mergeAcross(x, m, $), this.remove(x)) : (x.mergeAcross(s, m, -$), this.remove(s));
        }, w.prototype.forEach = function(m) {
          this.list.forEach(m);
        }, w.prototype.updateBlockPositions = function() {
          this.list.forEach(function(m) {
            return m.updateWeightedPosition();
          });
        }, w.prototype.split = function(m) {
          var x = this;
          this.updateBlockPositions(), this.list.forEach(function(s) {
            var $ = s.findMinLM();
            $ !== null && $.lm < b.LAGRANGIAN_TOLERANCE && (s = $.left.block, p.split($).forEach(function(E) {
              return x.insert(E);
            }), x.remove(s), m.push($));
          });
        }, w;
      }();
      u.Blocks = g;
      var b = function() {
        function w(m, x) {
          this.vs = m, this.cs = x, this.vs = m, m.forEach(function(s) {
            s.cIn = [], s.cOut = [];
          }), this.cs = x, x.forEach(function(s) {
            s.left.cOut.push(s), s.right.cIn.push(s);
          }), this.inactive = x.map(function(s) {
            return s.active = !1, s;
          }), this.bs = null;
        }
        return w.prototype.cost = function() {
          return this.bs.cost();
        }, w.prototype.setStartingPositions = function(m) {
          this.inactive = this.cs.map(function(x) {
            return x.active = !1, x;
          }), this.bs = new g(this.vs), this.bs.forEach(function(x, s) {
            return x.posn = m[s];
          });
        }, w.prototype.setDesiredPositions = function(m) {
          this.vs.forEach(function(x, s) {
            return x.desiredPosition = m[s];
          });
        }, w.prototype.mostViolated = function() {
          for (var m = Number.MAX_VALUE, x = null, s = this.inactive, $ = s.length, E = $, A = 0; A < $; ++A) {
            var I = s[A];
            if (!I.unsatisfiable) {
              var F = I.slack();
              if ((I.equality || F < m) && (m = F, x = I, E = A, I.equality)) break;
            }
          }
          return E !== $ && (m < w.ZERO_UPPERBOUND && !x.active || x.equality) && (s[E] = s[$ - 1], s.length = $ - 1), x;
        }, w.prototype.satisfy = function() {
          this.bs == null && (this.bs = new g(this.vs)), this.bs.split(this.inactive);
          for (var m = null; (m = this.mostViolated()) && (m.equality || m.slack() < w.ZERO_UPPERBOUND && !m.active); ) {
            var x = m.left.block, s = m.right.block;
            if (x !== s) this.bs.merge(m);
            else {
              if (x.isActiveDirectedPathBetween(m.right, m.left)) {
                m.unsatisfiable = !0;
                continue;
              }
              var $ = x.splitBetween(m.left, m.right);
              if ($ === null) {
                m.unsatisfiable = !0;
                continue;
              }
              this.bs.insert($.lb), this.bs.insert($.rb), this.bs.remove(x), this.inactive.push($.constraint), m.slack() >= 0 ? this.inactive.push(m) : this.bs.merge(m);
            }
          }
        }, w.prototype.solve = function() {
          this.satisfy();
          for (var m = Number.MAX_VALUE, x = this.bs.cost(); Math.abs(m - x) > 1e-4; ) this.satisfy(), m = x, x = this.bs.cost();
          return x;
        }, w.LAGRANGIAN_TOLERANCE = -1e-4, w.ZERO_UPPERBOUND = -1e-10, w;
      }();
      u.Solver = b, t.exports = u;
    }, function(t, a, u) {
      function f(m) {
        this.options = w.extend({ layerGap: 60, nodeHeight: 10, direction: "down" }, m);
      }
      function d(m) {
        return "L " + m.join(" ");
      }
      function v(m) {
        return "M " + m.join(" ");
      }
      function p(m, x, s) {
        return "C " + m.join(" ") + " " + x.join(" ") + " " + s.join(" ");
      }
      function g(m, x) {
        var s = (m[1] + x[1]) / 2;
        return p([m[0], s], [x[0], s], x);
      }
      function b(m, x) {
        var s = (m[0] + x[0]) / 2;
        return p([s, m[1]], [s, x[1]], x);
      }
      var w = u(4);
      f.lineTo = d, f.moveTo = v, f.curveTo = p, f.vCurveBetween = g, f.hCurveBetween = b, f.prototype.getWaypoints = function(m) {
        var x = this.options, s = x.direction, $ = m.getPathFromRoot(), E = x.nodeHeight + x.layerGap;
        return s === "left" ? [[[0, $[0].idealPos]]].concat($.map(function(A, I) {
          var F = E * (I + 1) * -1;
          return [[F + x.nodeHeight, A.currentPos], [F, A.currentPos]];
        })) : s === "right" ? [[[0, $[0].idealPos]]].concat($.map(function(A, I) {
          var F = E * (I + 1);
          return [[F - x.nodeHeight, A.currentPos], [F, A.currentPos]];
        })) : s === "up" ? [[[$[0].idealPos, 0]]].concat($.map(function(A, I) {
          var F = E * (I + 1) * -1;
          return [[A.currentPos, F + x.nodeHeight], [A.currentPos, F]];
        })) : [[[$[0].idealPos, 0]]].concat($.map(function(A, I) {
          var F = E * (I + 1);
          return [[A.currentPos, F - x.nodeHeight], [A.currentPos, F]];
        }));
      }, f.prototype.layout = function(m) {
        var x = this.options, s = x.layerGap + x.nodeHeight;
        switch (x.direction) {
          case "left":
            m.forEach(function($) {
              var E = $.getLayerIndex() * s + x.layerGap;
              $.x = -E - x.nodeHeight, $.y = $.currentPos, $.dx = x.nodeHeight, $.dy = $.width;
            });
            break;
          case "right":
            m.forEach(function($) {
              var E = $.getLayerIndex() * s + x.layerGap;
              $.x = E, $.y = $.currentPos, $.dx = x.nodeHeight, $.dy = $.width;
            });
            break;
          case "up":
            m.forEach(function($) {
              var E = $.getLayerIndex() * s + x.layerGap;
              $.x = $.currentPos, $.y = -E - x.nodeHeight, $.dx = $.width, $.dy = x.nodeHeight;
            });
            break;
          default:
          case "down":
            m.forEach(function($) {
              var E = $.getLayerIndex() * s + x.layerGap;
              $.x = $.currentPos, $.y = E, $.dx = $.width, $.dy = x.nodeHeight;
            });
        }
        return m;
      }, f.prototype.generatePath = function(m) {
        var x = this.options, s = x.direction, $ = this.getWaypoints(m, s), E = [v($[0][0])];
        return s === "left" || s === "right" ? $.reduce(function(A, I, F) {
          return E.push(b(A[A.length - 1], I[0])), F < $.length - 1 && E.push(d(I[1])), I;
        }) : $.reduce(function(A, I, F) {
          return E.push(g(A[A.length - 1], I[0])), F < $.length - 1 && E.push(d(I[1])), I;
        }), E.join(" ");
      }, t.exports = f;
    }]);
  });
})(Vv);
var Uv = Vv.exports;
const Gv = /* @__PURE__ */ ws(Uv), aL = /* @__PURE__ */ Vg({
  __proto__: null,
  default: Gv
}, [Uv]);
function sL(e) {
  return e.slice().sort(function(n, t) {
    return n - t;
  });
}
function Hg(e, n) {
  for (var t = [], a = 0; a < e; a++) {
    for (var u = [], f = 0; f < n; f++)
      u.push(0);
    t.push(u);
  }
  return t;
}
function uL(e) {
  for (var n = 0, t, a = 0; a < e.length; a++)
    (a === 0 || e[a] !== t) && (t = e[a], n++);
  return n;
}
function Of(e, n, t, a) {
  var u;
  if (e > 0) {
    var f = (t[n] - t[e - 1]) / (n - e + 1);
    u = a[n] - a[e - 1] - (n - e + 1) * f * f;
  } else
    u = a[n] - t[n] * t[n] / (n + 1);
  return u < 0 ? 0 : u;
}
function Lf(e, n, t, a, u, f, d) {
  if (!(e > n)) {
    var v = Math.floor((e + n) / 2);
    a[t][v] = a[t - 1][v - 1], u[t][v] = v;
    var p = t;
    e > t && (p = Math.max(p, u[t][e - 1] || 0)), p = Math.max(p, u[t - 1][v] || 0);
    var g = v - 1;
    n < a[0].length - 1 && (g = Math.min(g, u[t][n + 1] || 0));
    for (var b, w, m, x, s = g; s >= p && (b = Of(s, v, f, d), !(b + a[t - 1][p - 1] >= a[t][v])); --s)
      w = Of(p, v, f, d), m = w + a[t - 1][p - 1], m < a[t][v] && (a[t][v] = m, u[t][v] = p), p++, x = b + a[t - 1][s - 1], x < a[t][v] && (a[t][v] = x, u[t][v] = s);
    Lf(
      e,
      v - 1,
      t,
      a,
      u,
      f,
      d
    ), Lf(
      v + 1,
      n,
      t,
      a,
      u,
      f,
      d
    );
  }
}
function lL(e, n, t) {
  for (var a = n[0].length, u = e[Math.floor(a / 2)], f = [], d = [], v = 0, p = void 0; v < a; ++v)
    p = e[v] - u, v === 0 ? (f.push(p), d.push(p * p)) : (f.push(f[v - 1] + p), d.push(
      d[v - 1] + p * p
    )), n[0][v] = Of(0, v, f, d), t[0][v] = 0;
  for (var g, b = 1; b < n.length; ++b)
    b < n.length - 1 ? g = b : g = a - 1, Lf(
      g,
      a - 1,
      b,
      n,
      t,
      f,
      d
    );
}
function cL(e, n) {
  if (n > e.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var t = sL(e), a = uL(t);
  if (a === 1)
    return [t];
  var u = Hg(n, t.length), f = Hg(n, t.length);
  lL(t, u, f);
  for (var d = [], v = f[0].length - 1, p = f.length - 1; p >= 0; p--) {
    var g = f[p][v];
    d[p] = t.slice(g, v + 1), p > 0 && (v = g - 1);
  }
  return d;
}
const Wg = function(e) {
  var n = {}, t = { nClusters: 6 }, a = kt.merge({}, t, e);
  return n.createClustersFromGenes = function(u) {
    var f = [];
    if (u.length < 1)
      return f;
    var d = Math.min(a.nClusters, u.length), v = u.map(function(w) {
      return w.midpoint;
    });
    let p = cL(v, d);
    for (var g = [], b = 0; b < p.length; b++)
      g.push([]);
    return u.map(function(w) {
      let m = p.findIndex(function(x) {
        return x.includes(w.midpoint);
      });
      g[m].push(w);
    }), g.map(function(w) {
      if (w.length < 2)
        f.push.apply(f, w);
      else {
        var m = w.reduce(function($, E) {
          return $ + E.midpoint;
        }, 0) / w.length, x = w.reduce(function($, E) {
          return $ + E.id.toString();
        }, ""), s = {
          genesList: w,
          midpoint: m,
          type: "geneslist",
          id: x.toString()
        };
        f.push(s);
      }
    }), f;
  }, n.nClusters = function(u) {
    return arguments.length ? (a.nClusters = u, n) : a.nClusters;
  }, n;
};
var af = Gv || aL;
const fL = function(e) {
  var n = {
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
  }, t = kt.merge({}, n, e), a = function() {
    return _o().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, u = function(w, m, x, s) {
    var $ = 4, E = m / 3, A = E / x * $, I = A * w > s;
    if (I)
      return 2;
    var F = m * (0.1 + 0.1 / w);
    return E = m - F, A = E / x * $, I = A * w > s, I ? 1 : 0;
  }, f = function(w, m, x, s, $) {
    var E = 3.5;
    let A = {};
    return A.scale = w, A.availableHeight = $, A.lineSpacing = 1, A.layerGap = m * (0.1 + 0.1 / w), A.spaceForLabel = m - A.layerGap, A.setFontSize = Math.min(
      A.spaceForLabel / x * E,
      s / t.scale
    ), A.nodeSpacing = A.setFontSize, A.nLabels = 0.4 * $ / (A.nodeSpacing + A.lineSpacing), A.density = 1, A;
  }, d = function(w, m, x, s, $) {
    var E = 3.5, A = {};
    return A.scale = w, A.availableHeight = $, A.lineSpacing = 1, A.setFontSize = Math.min(
      m / 3 / x * E,
      s / t.scale
    ), A.nodeSpacing = A.setFontSize, A.spaceForLabel = 1.3 * x * A.setFontSize / E, A.layerGap = Math.min(5 * A.setFontSize, m / 3), A.density = 0.9, A.nLabels = 0.6 * $ / (A.nodeSpacing + A.lineSpacing), A;
  }, v = function(w, m, x, s) {
    s.forEach(function(E) {
      E.displayed = !0, E.fontSize = x.setFontSize;
    });
    var $ = s.map(function(E) {
      return new af.Node(m(E.midpoint), x.setFontSize, E);
    });
    try {
      w.nodes($).compute();
    } catch (E) {
      if (E instanceof RangeError)
        return null;
      throw E;
    }
    return $;
  }, p = function(w) {
    let m = w.annotations.allGenes.filter(function(oe) {
      return oe.globalIndex < t.nGenesToDisplay;
    });
    var x = t.layout.width, s = t.layout.height * Math.min(1, 0.2 + w.length / t.longestChromosome), $ = m.reduce(function(oe, pe) {
      return Math.max(oe, pe.label.length);
    }, 0), E = 1.1 * t.displayedFontSize, A = 0.9 * t.displayedFontSize, I = u(
      t.scale,
      x,
      $,
      E
    ), F;
    I == 2 ? F = d(
      t.scale,
      x,
      $,
      A,
      s
    ) : I == 1 ? F = f(
      t.scale,
      x,
      $,
      A,
      s
    ) : I == 0 && (F = f(
      t.scale,
      x,
      $,
      A,
      s
    ), F.nLabels = 0);
    var k = a();
    let j = {
      nodeSpacing: F.nodeSpacing,
      lineSpacing: F.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: F.availableHeight,
      density: F.density
    };
    var U = new af.Force(j);
    m.forEach(function(oe) {
      oe.displayed = !1;
    });
    var ne = t.manualLabels ? new Set(
      m.filter(function(oe) {
        return oe.visible;
      })
    ) : /* @__PURE__ */ new Set();
    t.autoLabels && m.slice(0, F.nLabels).filter(function(oe) {
      return !oe.hidden;
    }).forEach(function(oe) {
      ne.add(oe);
    });
    var Se = Array.from(ne), Ce = v(U, k, F, Se);
    !Ce == 0 && (U.options({ algorithm: "simple" }), Ce = v(U, k, F, Se));
    var Ee;
    if (Ce && Ce.length > 0) {
      var Ae = Ce.map(function(oe) {
        return oe.getLayerIndex();
      });
      Ee = Math.max.apply(null, Ae);
    }
    if (!Ce || Ee > 3) {
      var We = Wg().nClusters(Math.max(F.nLabels, 1));
      try {
        var Fe = We.createClustersFromGenes(Se);
      } catch {
        Fe = [];
      }
      Ce = v(U, k, F, Fe);
    }
    let J = {
      direction: "right",
      layerGap: F.layerGap,
      nodeHeight: F.spaceForLabel
    };
    var _e = new af.Renderer(J);
    return _e.layout(Ce), Ce.forEach(function(oe) {
      oe.data.path = _e.generatePath(oe);
    }), t.manualLabels || yf(".gene-annotation").remove(), Ce;
  }, g = function(w) {
    var m = Wg(), x = w.annotations.genes, s = m.createClustersFromGenes(x);
    return s;
  };
  let b = {};
  return b.layoutChromosome = function(w) {
    w.layout.annotationNodes = p(w) || w.layout.annotationNodes;
  }, b.computeChromosomeClusters = function(w) {
    w.layout.annotationClusters = g(w), w.layout.annotationDisplayClusters = w.layout.annotationClusters.slice();
  }, b.expandAllChromosomeClusters = function(w) {
    w.layout.annotationDisplayClusters = w.annotations.genes;
  }, b.collapseAllChromosomeClusters = function(w) {
    w.layout.annotationDisplayClusters = w.layout.annotationClusters.slice();
  }, b.expandAChromosomeCluster = function(w, m) {
    w.layout.annotationDisplayClusters = w.layout.annotationClusters.slice(), m.genesList.forEach(function(s) {
      w.layout.annotationDisplayClusters.push(s);
    });
    var x = w.layout.annotationDisplayClusters.indexOf(m);
    w.layout.annotationDisplayClusters.splice(x, 1);
  }, b.computeNormalisedGeneScores = function(w) {
    var m = w.reduce(function(E, A) {
      return E.concat(
        A.annotations.genes.filter(function(I) {
          return I.displayed;
        })
      );
    }, []), x = m.every(function(E) {
      return E.score;
    });
    if (x) {
      var s = m.reduce(function(E, A) {
        return Math.max(E, A.score);
      }, 0), $ = m.reduce(function(E, A) {
        return Math.min(E, A.score);
      }, 0);
      m.forEach(function(E) {
        E.normedScore = 0.5 * (E.score - $) / (s - $) + 0.5;
      });
    } else
      m.forEach(function(E) {
        E.normedScore = null;
      });
  }, b;
}, dL = function(e) {
  var n = {
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
  }, t = kt.merge({}, n, e), a = function() {
    return _o().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, u = function(p) {
    if (p.type == "gene") {
      var g = p;
      return {
        start: g.start,
        end: g.end,
        midpoint: g.midpoint,
        color: g.color,
        data: g
      };
    } else if (p.type == "geneslist") {
      let b = p.genesList.reduce(function(x, s) {
        return Math.max(x, s.end);
      }, 0);
      return {
        start: p.genesList.reduce(function(x, s) {
          return Math.min(x, s.start);
        }, 1 / 0),
        end: b,
        midpoint: p.midpoint,
        color: "#0000FF",
        data: p
      };
    }
  }, f = function(p) {
    a();
    var g = p.layout.geneBandDisplayClusters, b = g.map(u);
    return b;
  }, d = function(p) {
    var g = p.annotations.allGenes.filter(function($) {
      return $.globalIndex < t.nGenesToDisplay;
    });
    g.sort(function($, E) {
      return $.midpoint - E.midpoint;
    });
    for (var b = [], w = 0; w < g.length; ) {
      let $ = w;
      for (; $ < g.length && g[w].midpoint == g[$].midpoint; )
        $++;
      if ($ - w == 1)
        b.push(g[w]), w++;
      else {
        var m = g.slice(w, $), x = m.reduce(function(A, I) {
          return A + I.id.toString();
        }, ""), s = {
          genesList: m,
          midpoint: m[0].midpoint,
          type: "geneslist",
          id: x
        };
        b.push(s), w = $;
      }
    }
    return b.sort(function($, E) {
      return $.midpoint < E.midpoint;
    }), b;
  };
  let v = {};
  return v.layoutChromosome = function(p) {
    p.layout.geneBandNodes = f(p);
  }, v.computeChromosomeClusters = function(p) {
    let g = p.layout;
    g.geneBandClusters = d(p), g.geneBandDisplayClusters = g.geneBandClusters.slice();
  }, v.expandAllChromosomeClusters = function(p) {
    let g = p.layout;
    g.geneBandDisplayClusters = p.annotations.allGenes;
  }, v.collapseAllChromosomeClusters = function(p) {
    let g = p.layout;
    g.geneBandDisplayClusters = g.geneBandClusters.slice();
  }, v.expandAChromosomeCluster = function(p, g) {
    let b = p.layout;
    b.geneBandDisplayClusters = b.geneBandClusters.slice(), g.genesList.forEach(function(m) {
      b.geneBandDisplayClusters.push(m);
    });
    var w = b.geneBandDisplayClusters.indexOf(g);
    b.geneBandDisplayClusters.splice(w, 1);
  }, v;
}, hL = function(e) {
  var n = {
    onNetworkBtnClick: it.noop,
    onFitBtnClick: it.noop,
    onTagBtnClick: it.noop,
    onLabelBtnClick: it.noop,
    onQtlBtnClick: it.noop,
    onResetBtnClick: it.noop,
    onSetNumberPerRowClick: it.noop,
    onExportBtnClick: it.noop,
    onExportAllBtnClick: it.noop,
    onExpandBtnClick: it.noop,
    maxSnpPValueProperty: it.noop,
    nGenesToDisplayProperty: it.noop,
    annotationLabelSizeProperty: it.noop,
    initialMaxGenes: 200,
    initialNPerRow: 10
  }, t = kt.merge({}, n, e), a, u = function() {
    it(this).hasClass("disabled") || t.onNetworkBtnClick();
  }, f = function() {
    it(this).hasClass("disabled") || t.onTagBtnClick();
  }, d = function() {
    it(this).hasClass("disabled") || t.onFitBtnClick();
  }, v = function() {
    if (it(this).hasClass("disabled"))
      return;
    const m = new Event("change"), x = document.getElementById("select-label-btn");
    x.value = "auto", x.dispatchEvent(m);
    const s = document.getElementById("select-ngenes-dropdown");
    s.value = "50", s.dispatchEvent(m), t.onResetBtnClick();
  }, p = function() {
    t.onExpandBtnClick();
  }, g = function(m, x, s, $, E) {
    var A = "select-" + x, I = m.selectAll("select").data([null]);
    I.enter().append("select").attr("id", A).attr("name", A).attr("class", "menu-dropdown");
    const F = document.getElementById(A);
    if (!F) {
      console.log("Failed to find the select element.");
      return;
    }
    F.innerHTML = "", s.forEach(function(k) {
      var j = document.createElement("option");
      j.value = k[1], j.textContent = k[0], k[1] === E && (j.selected = !0), F.appendChild(j);
    }), F.addEventListener("change", function() {
      var k = F.options[F.selectedIndex], j = k.value;
      $(j);
    });
  }, b = function() {
    var m = He(a).selectAll(".genemap-menu").data([null]);
    m.enter().append("div").classed("genemap-menu", !0);
    var x = m.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), s = x.selectAll("span").data(function(Ee, Ae) {
      return Ee;
    });
    s.enter().append("span"), x.selectAll("span").attr("class", function(Ee) {
      return Ee;
    }), m.select(".network-btn").attr("title", "Launch network view").on("click", u), m.select(".tag-btn").on("click", f);
    var $ = m.select(".label-btn");
    g(
      $,
      "label-btn",
      [
        ["Auto labels", "auto"],
        ["Checked labels", "show"],
        ["No labels", "hide"]
      ],
      t.onLabelBtnClick,
      "Auto labels"
    ), m.select(".fit-btn").attr("title", "Reset pan and zoom").on("click", d), m.select(".reset-btn").attr("title", "Reset selections").on("click", v);
    var E = m.select(".ngenes-dropdown");
    E.text(""), g(
      E,
      "ngenes-dropdown",
      [
        ["50 genes", 50],
        ["100 genes", 100],
        ["200 genes", 200],
        ["500 genes", 500],
        ["1000 genes", 1e3]
      ],
      t.nGenesToDisplayProperty,
      t.nGenesToDisplayProperty() + " genes"
    ), t.nGenesToDisplayProperty.addListener(function(Ee) {
      it("#select-ngenes-dropdown").selectpicker("val", [
        Ee + " genes",
        Ee
      ]);
    }), m.select(".export-btn").attr("title", "Export to PNG").on("click", t.onExportBtnClick), m.select(".expand-btn").attr("title", "Toggle full screen").on("click", p);
    var A = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    m.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(A, "_blank");
    });
    var I = He(a).selectAll(".genemap-advanced-menu").data([null]), F = I.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    F.enter().append("div").attr("class", function(Ee) {
      return Ee;
    });
    var k = I.select(".qtl-btn");
    g(
      k,
      "qtl-btn",
      [
        ["All QTLs", "all"],
        ["Checked QTLs", "selected"],
        ["No QTLs", "none"]
      ],
      t.onQtlBtnClick,
      "All QTLs"
    );
    var j = I.select(".max-snp-pvalue").selectAll("form").data([""]).enter(), U = j.append("form").classed("bootstrap", !0).attr("id", "snp-pvalue-form").attr("class", "bootstrap form-inline");
    U.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), U.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), U.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), it("#snp-pvalue-form").submit(function(Ee) {
      t.maxSnpPValueProperty(it("#max-snp-pvalue-input").val()), Ee.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(Ee) {
      it("#max-snp-pvalue-input").val(Ee);
    });
    var ne = I.select(".nperrow-spinner"), Se = ne.selectAll("input").data(["nPerRowSpinner"]).enter();
    Se.append("span").append("label").classed("bootstrap", !0).attr("for", (Ee) => Ee).html("Num per row:&nbsp;"), Se.append("span").append("input").attr("id", (Ee) => Ee).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (Ee) => Ee), He(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), it("#nPerRowSpinner").on("change", function(Ee) {
      t.onSetNumberPerRowClick(it("#nPerRowSpinner").val());
    }), I.select(".export-all-btn").attr("title", "export all to PNG").on("click", t.onExportAllBtnClick), I.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(Ee) {
      return Ee;
    }), I.select(".labelsize-label").classed("bootstrap", !0), I.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var Ce = I.select(".labelsize-dropdown");
    Ce.text(""), g(
      Ce,
      "labelsize-dropdown",
      [
        ["10", 10],
        ["15", 15],
        ["20", 20],
        ["25", 25]
      ],
      t.annotationLabelSizeProperty,
      t.annotationLabelSizeProperty()
    ), t.annotationLabelSizeProperty.addListener(function(Ee) {
      it("#select-labelsize-dropdown").selectpicker("val", [
        Ee,
        Ee
      ]);
    });
  };
  function w(m) {
    m.each(function(x) {
      var s = this;
      a = s, b();
    });
  }
  return w.onNetworkBtnClick = function(m) {
    return arguments.length ? (t.onNetworkBtnClick = m, w) : t.onNetworkBtnClick;
  }, w.onTagBtnClick = function(m) {
    return arguments.length ? (t.onTagBtnClick = m, w) : t.onTagBtnClick;
  }, w.onLabelBtnClick = function(m) {
    return arguments.length ? (t.onLabelBtnClick = m, w) : t.onLabelBtnClick;
  }, w.onQtlBtnClick = function(m) {
    return arguments.length ? (t.onQtlBtnClick = m, w) : t.onQtlBtnClick;
  }, w.onFitBtnClick = function(m) {
    return arguments.length ? (t.onFitBtnClick = m, w) : t.onFitBtnClick;
  }, w.onResetBtnClick = function(m) {
    return arguments.length ? (t.onResetBtnClick = m, w) : t.onResetBtnClick;
  }, w.onSetNumberPerRowClick = function(m) {
    return arguments.length ? (t.onSetNumberPerRowClick = m, w) : t.onSetNumberPerRowClick;
  }, w.initialMaxGenes = function(m) {
    return arguments.length ? (t.initialMaxGenes = m, w) : t.initialMaxGenes;
  }, w.initialNPerRow = function(m) {
    return arguments.length ? (t.initialNPerRow = m, w) : t.initialNPerRow;
  }, w.onExportBtnClick = function(m) {
    return arguments.length ? (t.onExportBtnClick = m, w) : t.onExportBtnClick;
  }, w.onExportAllBtnClick = function(m) {
    return arguments.length ? (t.onExportAllBtnClick = m, w) : t.onExportAllBtnClick;
  }, w.onExpandBtnClick = function(m) {
    return arguments.length ? (t.onExpandBtnClick = m, w) : t.onExpandBtnClick;
  }, w.maxSnpPValueProperty = function(m) {
    return arguments.length ? (t.maxSnpPValueProperty = m, w) : t.maxSnpPValueProperty;
  }, w.nGenesToDisplayProperty = function(m) {
    return arguments.length ? (t.nGenesToDisplayProperty = m, w) : t.nGenesToDisplayProperty;
  }, w.annotationLabelSizeProperty = function(m) {
    return arguments.length ? (t.annotationLabelSizeProperty = m, w) : t.annotationLabelSizeProperty;
  }, w.setTabButtonState = function(m) {
    var x = He(a).select(".tag-btn");
    m === "show" ? (x.classed("show-label", !0), x.classed("hide-label", !1), x.classed("auto-label", !1), x.classed("manual-label", !1), x.attr("title", "Show Labels")) : m === "hide" ? (x.classed("show-label", !1), x.classed("hide-label", !0), x.classed("auto-label", !1), x.classed("manual-label", !1), x.attr("title", "Hide Labels")) : m === "manual" ? (x.classed("show-label", !1), x.classed("hide-label", !1), x.classed("auto-label", !1), x.classed("manual-label", !0), x.attr("title", "Manual Labels")) : (x.classed("show-label", !1), x.classed("hide-label", !1), x.classed("auto-label", !0), x.classed("manual-label", !1), x.attr("title", "Automatic Labels"));
  }, w.getTagButtonState = function() {
    var m = He(a).select(".tag-btn");
    return m.classed("show-label") ? "show" : m.classed("hide-label") ? "hide" : m.classed("auto-label") ? "auto" : "manual";
  }, w.setFitButtonEnabled = function(m) {
    He(a).select(".fit-btn").classed("disabled", !m);
  }, w.setNetworkButtonEnabled = function(m) {
    He(a).select(".network-btn").classed("disabled", !m);
  }, w;
};
class pL {
  constructor(n, t, a) {
    this.distance = n, this.linkage = t, this.threshold = a ?? 1 / 0;
  }
  cluster(n, t, a) {
    this.clusters = [], this.dists = [], this.mins = [], this.index = [];
    for (let d = 0; d < n.length; d++) {
      const v = {
        value: n[d],
        key: d,
        index: d,
        size: 1
      };
      this.clusters[d] = v, this.index[d] = v, this.dists[d] = [], this.mins[d] = 0;
    }
    for (let d = 0; d < this.clusters.length; d++)
      for (let v = 0; v <= d; v++) {
        const p = d === v ? 1 / 0 : this.distance(this.clusters[d].value, this.clusters[v].value);
        this.dists[d][v] = p, this.dists[v][d] = p, p < this.dists[d][this.mins[d]] && (this.mins[d] = v);
      }
    let u = this.mergeClosest(), f = 0;
    for (; u; )
      a && f++ % t === 0 && a(this.clusters), u = this.mergeClosest();
    return this.clusters.forEach((d) => {
      delete d.key, delete d.index;
    }), this.clusters;
  }
  mergeClosest() {
    let n = 0, t = 1 / 0;
    for (let d = 0; d < this.clusters.length; d++) {
      const v = this.clusters[d].key, p = this.dists[v][this.mins[v]];
      p < t && (n = v, t = p);
    }
    if (t >= this.threshold)
      return !1;
    const a = this.index[n], u = this.index[this.mins[n]], f = {
      left: a,
      right: u,
      key: a.key,
      size: a.size + u.size
    };
    this.clusters[a.index] = f, this.clusters.splice(u.index, 1), this.index[a.key] = f;
    for (let d = 0; d < this.clusters.length; d++) {
      const v = this.clusters[d];
      let p;
      a.key === v.key ? p = 1 / 0 : this.linkage === "single" ? (p = this.dists[a.key][v.key], this.dists[a.key][v.key] > this.dists[u.key][v.key] && (p = this.dists[u.key][v.key])) : this.linkage === "complete" ? (p = this.dists[a.key][v.key], this.dists[a.key][v.key] < this.dists[u.key][v.key] && (p = this.dists[u.key][v.key])) : this.linkage === "average" ? p = (this.dists[a.key][v.key] * a.size + this.dists[u.key][v.key] * u.size) / (a.size + u.size) : p = this.distance(v.value, a.value), this.dists[a.key][v.key] = this.dists[v.key][a.key] = p;
    }
    for (let d = 0; d < this.clusters.length; d++) {
      const v = this.clusters[d].key;
      if (this.mins[v] === a.key || this.mins[v] === u.key) {
        let p = v;
        for (let g = 0; g < this.clusters.length; g++) {
          const b = this.clusters[g].key;
          this.dists[v][b] < this.dists[v][p] && (p = b);
        }
        this.mins[v] = p;
      }
      this.clusters[d].index = d;
    }
    return delete a.key, delete u.key, delete a.index, delete u.index, !0;
  }
}
function gL(e, n, t, a, u, f) {
  return t = t || "average", new pL(
    n,
    t,
    a
  ).cluster(e, u, f);
}
const mL = function() {
  var e = {};
  return e.positionAnnotations = function(n, t, a, u, f, d) {
    for (var v = u, p = d, g = f, b = function(j, U) {
      return v(j) < p(U) && v(U) < p(j);
    }, w = n.sort(function(j, U) {
      return g(j) - g(U);
    }), m = [], x = 0; x < w.length; x++) {
      for (var s = n[x], $ = [], E = 0; E < m.length; E++) {
        var A = w[m[E]];
        b(s, A) || $.push(m[E]);
      }
      var I = _.difference(m, $), F = I.map(function(j) {
        return t(w[j]);
      }), k = 0;
      for (k = 1; k < F.length + 1 && F.indexOf(k) !== -1; k++)
        ;
      a(s, k), m.push(x);
    }
    return w;
  }, e.sortQTLAnnotations = function(n) {
    return e.positionAnnotations(
      n,
      function(t) {
        return t.position;
      },
      function(t, a) {
        t.position = a;
      },
      function(t) {
        return t.start;
      },
      function(t) {
        return t.midpoint;
      },
      function(t) {
        return t.end;
      }
    );
  }, e.sortQTLLabels = function(n, t, a) {
    var u = n, f = 0.6, d = f * a;
    return e.positionAnnotations(
      u,
      function(v) {
        return v.labelPosition;
      },
      function(v, p) {
        v.labelPosition = p;
      },
      function(v) {
        return t(v.midpoint) - d * v.screenLabel.length / 2;
      },
      function(v) {
        return v.midpoint;
      },
      function(v) {
        return t(v.midpoint) + d * v.screenLabel.length / 2;
      }
    );
  }, e.sortQTLAnnotationsWithLabels = function(n, t, a) {
    var u = n;
    return e.positionAnnotations(
      u,
      function(f) {
        return f.comboPosition;
      },
      function(f, d) {
        f.comboPosition = d;
      },
      function(f) {
        return Math.min(
          t(f.midpoint) - f.label.length * a / 2,
          f.start
        );
      },
      function(f) {
        return f.midpoint;
      },
      function(f) {
        return Math.max(
          t(f.midpoint) + f.label.length * a / 2,
          f.end
        );
      }
    );
  }, e;
}, vL = function(e) {
  var n = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = kt.merge({}, n, e), a = mL(), u = function() {
    return _o().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, f = function(s) {
    return s.map(function($) {
      var E = m($), A = E.reduce(function(U, ne) {
        return Math.min(U, ne.start);
      }, 1 / 0), I = E.reduce(function(U, ne) {
        return Math.max(U, ne.end);
      }, 0), F = E.reduce(function(U, ne) {
        return U + (U ? "|" : "") + ne.start + "-" + ne.end;
      }, ""), k = (A + I) / 2;
      let j;
      return E.length == 1 ? (j = E[0], j.type = "qtl", j.index = $.index, j.parentIndex = $.parentIndex) : j = {
        cluster: $,
        index: $.index,
        parentIndex: $.parentIndex,
        qtlList: E,
        color: E[0].color,
        count: E.length,
        start: A,
        end: I,
        midpoint: k,
        chromosome: E[0].chromosome,
        type: "qtllist",
        id: F
      }, j;
    });
  }, d = function(s) {
    var $ = [];
    if (t.showAllQTLs) {
      s.layout.qtlDisplayClusters = s.layout.qtlClusters.slice();
      for (var E = s.layout.qtlDisplayClusters, A = Math.ceil(Math.floor(t.scale - 0.1) / 2); A--; )
        E = w(E);
      for (var I = E.length; ; ) {
        $ = f(E), $ = a.sortQTLAnnotations($);
        var F = $.reduce(function(k, j) {
          return Math.max(k, j.position);
        }, 0);
        if (F < 2) {
          if (E = w(E), I == E.length)
            break;
          I = E.length;
        } else
          break;
      }
    } else t.showSelectedQTLs && (s.layout.qtlDisplayClusters = s.annotations.qtls.filter(
      function(k) {
        return k.selected;
      }
    ), E = s.layout.qtlDisplayClusters, $ = E.map(function(k) {
      let j = k;
      return j.type = "qtl", j;
    }));
    return $;
  }, v = function(s) {
    var $ = kt.groupBy(s, "position");
    return kt.forOwn($, function(E) {
      var A = 14 / t.scale, I = u();
      E = a.sortQTLLabels(E, I, A), E.forEach(function(F) {
        F.labelPosition > 1 ? F.displayLabel = !1 : (F.displayLabel = !0, F.labelPosition = F.position + 0.4);
      });
    }), s;
  }, p = function(s) {
    var $ = d(s);
    $.forEach(function(ne) {
      ne.displayLabel = !1;
    });
    var E = $.filter(function(ne) {
      return ne.type == "qtl";
    });
    if (t.showAutoQTLLabels) {
      $ = a.sortQTLAnnotations($);
      var A = $.reduce(function(ne, Se) {
        return Math.max(ne, Se.position);
      }, 0);
      E.forEach(function(ne) {
        ne.label.length > 15 ? ne.screenLabel = ne.label.substring(0, 12) + "..." : ne.screenLabel = ne.label;
      });
      var I = 14 / t.scale, F = I > 0.6 * t.layout.chromosomeWidth, k = A > 3;
      !k && !F ? (v(E), E.forEach(function(ne) {
        ne.fontSize = I;
      })) : E.forEach(function(ne) {
        ne.displayLabel = !1;
      });
    }
    if (t.showSelectedQTLLabels && !t.showAutoQTLLabels) {
      var j = $.filter(function(ne) {
        return ne.selected;
      });
      I = 14 / t.scale;
      var U = 0.3 * t.layout.chromosomeWidth;
      j.forEach(function(ne) {
        ne.displayLabel = !0, ne.screenLabel = ne.label, ne.fontSize = Math.min(I, 2 * U);
      }), j = a.sortQTLAnnotationsWithLabels(
        j,
        u(),
        t.annotationLabelSize
      ), j.forEach(function(ne) {
        ne.position = ne.comboPosition, ne.labelPosition = ne.comboPosition + 0.4;
      });
    }
    return $;
  }, g = function(s, $) {
    if (s.index = $.index, $.index = $.index + 1, s.value)
      s.unit = !0, s.start = s.value.start, s.end = s.value.end;
    else {
      var E = s.left, A = s.right;
      E.parentIndex = s.index, A.parentIndex = s.index, g(E, $), g(A, $), s.unit = E.unit && A.unit && E.start == A.start && E.end == A.end, s.start = Math.min(s.left.start, s.right.start), s.end = Math.max(s.left.end, s.right.end);
    }
  }, b = function(s) {
    var $ = gL(
      s.annotations.qtls,
      function(A, I) {
        if (A.end == I.end && A.start == I.start)
          return 0;
        var F = Math.min(A.end, I.end) - Math.max(A.start, I.start), k = A.end - A.start, j = I.end - I.start, U = F, ne = Math.abs(k - j);
        return Math.max(0.1, ne - U);
      },
      "single",
      null
    ), E = { index: 0 };
    return $.forEach(function(A) {
      g(A, E);
    }), $;
  }, w = function(s) {
    var $ = [];
    return s.forEach(function(E) {
      if (E.value || E.unit)
        $.push(E);
      else {
        var A = E.left, I = E.right;
        $.push(A), $.push(I);
      }
    }), $;
  }, m = function(s) {
    return s.size == 1 ? [s.value] : m(s.left).concat(m(s.right));
  };
  let x = {};
  return x.layoutChromosome = function(s) {
    s.layout.qtlNodes = p(s) || s.layout.qtlNodes;
  }, x.computeChromosomeClusters = function(s) {
    s.layout.qtlClusters = b(s);
  }, x;
}, yL = Kg || K1;
let Fi = {};
Fi.vectorEffectSupport = !0;
Fi.Listener = function(e) {
  var n = e, t = [], a = function(u) {
    if (!arguments.length || u == n)
      return n;
    n = u, t.forEach(function(f) {
      f(n);
    });
  };
  return a.addListener = function(u) {
    return t.push(u), a;
  }, a.removeListener = function(u) {
    return kt.pull(t, u), a;
  }, a;
};
Fi.GeneMap = function(e) {
  var n = {
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
  }, t = kt.merge({}, n, e), a, u, f, d, v, p, g, b, w, m, x, s, $, E, A, I, F = !1, k = {}, j = function() {
    if (F) {
      var ue = it(a).height();
      t.height = ue - 80, t.width = "100%";
    }
  }, U = function() {
    F ? (t.height = k.height, t.width = k.width, He(a).classed("fullscreen", !1), F = !1) : (k.height = t.height, k.width = t.width, He(a).classed("fullscreen", !0), F = !0), j(), _e(), Ce(), Ke();
  }, ne = function() {
    var ue = { width: t.width, height: t.height };
    if (ue.width.toString().indexOf("%") >= 0 || ue.height.toString().indexOf("%") >= 0) {
      var we = He(a).select("svg").node().getBoundingClientRect();
      ue.width.toString().indexOf("%") >= 0 && (ue.width = we.width), ue.height.toString().indexOf("%") >= 0 && (ue.height = we.height);
    }
    return ue;
  }, Se = function() {
    const ue = Yo(u.node()), we = ue.k, $e = [ue.x, ue.y];
    return $e[0] !== 0 || $e[1] !== 0 || we !== 1;
  }, Ce = function() {
    const ue = Yo(u.node()), we = ue.k, $e = [ue.x, ue.y];
    we === 1 && kt.isEqual($e, [0, 0]) || (p.translate([0, 0]), p.scale(1), f.attr(
      "transform",
      "translate(" + p.translate() + ")scale(" + p.scale() + ")"
    ), s.setFitButtonEnabled(Se()), be(), Ke());
  }, Ee = function() {
    f.select(".drawing_outline").attr("width", w.drawing.width).attr("height", w.drawing.height);
  }, Ae = function() {
    var ue = w.drawing, we = w.margin;
    f.select(".drawing_margin").attr("x", we.left).attr("y", we.top).attr("width", ue.width - we.left - we.right).attr("height", ue.height - we.top - we.bottom);
  }, We = function() {
    f.attr("transform", "translate(0,0)scale(1)"), f.attr(
      "transform",
      "translate(" + p.translate() + ")scale(" + p.scale() + ")"
    );
  }, Fe = function() {
    var ue = He(a).select(".mapview").node();
    yL.saveSvgAsPng(ue, "genemap.png");
  };
  g = function() {
    var ue = Yo(this), we = [ue.x, ue.y], $e = ue.k;
    if (w) {
      var at = u.node().getBoundingClientRect(), vt = -w.drawing.width * $e + at.width * (1 - t.extraPanArea) + w.drawing.margin.right * $e, xt = at.width * t.extraPanArea - w.drawing.margin.left * $e;
      we[0] = kt.clamp(we[0], vt, xt);
      var Ut = -w.drawing.height * $e + at.height * (1 - t.extraPanArea) + w.drawing.margin.bottom * $e, Nt = at.height * t.extraPanArea - w.drawing.margin.top * $e;
      we[1] = kt.clamp(we[1], Ut, Nt);
    }
    (ue.x !== we[0] || ue.y !== we[1]) && p.translateBy(
      u,
      we[0] - ue.x,
      we[1] - ue.y
    ), $e !== b && (be(), Ke(), b = $e), s.setFitButtonEnabled(Se()), f.attr(
      "transform",
      "translate(" + we[0] + "," + we[1] + ")scale(" + $e + ")"
    ), _e(), d.text(
      "translate: [ " + we[0].toFixed(1) + "," + we[1].toFixed(1) + "]  zoom:" + $e.toFixed(2)
    );
  };
  var J = function(ue) {
    ue.preventDefault();
  }, _e = function() {
    it(".gene-annotation-popover").remove();
  }, oe = function() {
    var ue = function($e) {
      $e.target !== "undefined" && $e.target.tagName.toLowerCase() === "a" || it($e.target).closest(".genemap-advanced-menu").length > 0 || it($e.target).closest(".color-picker-modal").length > 0 || _e();
    }, we = "mousedown mousewheel DOMMouseScroll touchstart ";
    it(a).off(we).on(we, ue), it("body").on("click", function($e) {
      it($e.target).closest(a).length < 1 && F == !0 && U();
    });
  }, pe = function(ue) {
    ue == "auto" ? ($ = !0, E = !0, w.chromosomes.forEach(function(we) {
      we.annotations.genes.forEach(function($e) {
        $e.selected == !0 && ($e.visible = !0);
      });
    })) : ue == "show" ? ($ = !1, E = !0) : ue == "hide" && ($ = !1, E = !1), w.chromosomes.forEach(function(we) {
      we.annotations.genes.forEach(function($e) {
        ue === "auto" ? delete $e.showLabel : $e.showLabel = ue;
      });
    }), console.log("genome", w), be(), Ke();
  }, ke = function() {
    var ue = w.chromosomes.some(function(we) {
      return we.annotations.genes.some(function($e) {
        return $e.selected;
      });
    });
    Ie.onAnonationLabelSelectFunction && Ie.onAnonationLabelSelectFunction(Ie.getSelectedGenes()), be(), Ke(), He(".network-btn").classed("disabled", !ue);
  }, Ne = function(ue) {
    x ? (w = m, x = !1) : (w = { chromosomes: [ue] }, x = !0), Ie.onAnonationLabelSelectFunction(Ie.getSelectedGenes()), Ce(), be(), Ke();
  }, ae = function() {
    kt.flatMap(
      w.chromosomes.map(function(ue) {
        return ue.annotations.genes.filter(function(we) {
          return we.selected;
        }).map(function(we) {
          var $e = we.link, at = $e.substring($e.indexOf("list="), $e.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              at.replace(/\+/g, " ")
            )
          );
        });
      })
    ), t.apiUrl + "";
  }, R = function() {
    var ue = s.getTagButtonState(), we;
    ue === "auto" ? we = "show" : ue === "show" ? we = "hide" : we = "auto", s.setTabButtonState(we), pe(we), Ke();
  }, te = function() {
    w.chromosomes.forEach(function(ue) {
      ue.annotations.allGenes.forEach(function(we) {
        we.selected = !1, we.visible = !1, we.hidden = !1;
      });
    }), be(), Ke();
  }, Y = function(ue) {
    t.layout.numberPerRow = ue, re(), be(), Ke();
  }, L = function(ue) {
    ue == "all" ? (A = !0, I = !0) : ue == "selected" ? (A = !1, I = "true") : (A = !1, I = !1), xe(), be(), Ke();
  }, B = function() {
    const we = Yo(u.node()).k;
    var $e = rA(t.layout).width(ne().width).height(ne().height).scale(we);
    w = $e.decorateGenome(w);
  }, re = function() {
    w.chromosomes.forEach(function(ue) {
      ue.layout = ue.layout || {}, ue.layout.annotationDisplayClusters = null, ue.layout.geneBandDisplayClusters = null;
    });
  }, xe = function() {
    w.chromosomes.forEach(function(ue) {
      ue.layout = ue.layout || {}, ue.layout.qtlDisplayClusters = null;
    });
  }, be = function() {
    const we = Yo(u.node()).k;
    B();
    var $e = fL({
      longestChromosome: w.cellLayout.longestChromosome,
      layout: w.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: w.cellLayout.annotations.marker.size,
      annotationLabelSize: w.cellLayout.annotations.label.size,
      scale: we,
      autoLabels: $,
      manualLabels: E,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), at = dL({
      longestChromosome: w.cellLayout.longestChromosome,
      layout: w.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: we,
      nGenesToDisplay: t.nGenesToDisplay
    }), vt = vL({
      longestChromosome: w.cellLayout.longestChromosome,
      layout: w.cellLayout.qtlAnnotationPosition,
      scale: we,
      showAllQTLs: A,
      showSelectedQTLs: I,
      showAutoQTLLabels: A,
      showSelectedQTLLabels: I,
      annotationLabelSize: w.cellLayout.annotations.label.size
    });
    w.chromosomes.forEach(function(xt) {
      xt.layout = xt.layout || {}, xt.layout.annotationDisplayClusters || $e.computeChromosomeClusters(xt), $e.layoutChromosome(xt), xt.layout.geneBandDisplayClusters || at.computeChromosomeClusters(xt), at.layoutChromosome(xt), xt.layout.qtlDisplayClusters || vt.computeChromosomeClusters(xt), vt.layoutChromosome(xt);
    }), $e.computeNormalisedGeneScores(w.chromosomes);
  }, Ge = function(ue, we) {
    var $e = /* @__PURE__ */ new Set(), at = [];
    we.chromosomes.forEach(function(Ut) {
      Ut.annotations.snps.forEach(function(Nt) {
        $e.has(Nt.trait) || Nt.trait != null && at.push({ trait: Nt.trait, color: Nt.color }), $e.add(Nt.trait);
      });
    }), at.length > 0 ? ue.text("SNP legend: ") : ue.text("");
    var vt = ue.selectAll("span").data(at), xt = vt.enter().append("span").classed("key-item", !0);
    xt.append("span").style("background-color", function(Ut) {
      return Ut.color;
    }).classed("colorbox", !0).append("svg"), xt.append("span").text(function(Ut) {
      return Ut.trait;
    }), vt.exit().remove();
  }, et = function(ue) {
    var we = ue.append("div").attr("class", "mapview-wrapper"), $e = we.append("svg").attr("width", t.width).attr("height", t.height).attr("class", "mapview").attr("flex", t.flex);
    d = ue.append("div").append("span").attr("class", "logger").attr("id", "logbar"), v = ue.append("div").attr("class", "key").attr("id", "keybar"), Fi.vectorEffectSupport = "vectorEffect" in $e.node().style, oe(), $e.on("contextmenu", J), $e.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && ue.select(".zoom_window").append("rect").classed("drawing_margin", !0), b = 1, p = vN().scaleExtent([0.5, 60]), p.on("start", function() {
      $e.classed("dragging", !0);
    }).on("zoom", g).on("end", function() {
      $e.classed("dragging", !1);
    }), ue.select("svg").call(p);
    var at = ue.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return at.append("div").attr("class", "arrow"), at.append("h3").attr("class", "popover-title").text("Cluster"), at.append("div").attr("class", "popover-content"), $e;
  }, Ke = function() {
    He(a).select("svg").node() ? (u = He(a).select("svg"), u.attr("width", t.width).attr("height", t.height)) : u = et(He(a)), B();
    var ue = w.chromosomes.every(function($e) {
      return $e.layout;
    });
    ue || be(), u.datum(w), f = u.select(".zoom_window"), Ee(), t.contentBorder && Ae();
    var we = oL().onAnnotationSelectFunction(ke).onLabelSelectFunction(Ne).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(u);
    f.call(we);
  };
  function Ie(ue) {
    ue.each(function(we) {
      var $e = this;
      a = $e, m = we, w = m, x = !1, s || (s = hL().onTagBtnClick(R).onFitBtnClick(Ce).onLabelBtnClick(pe).onQtlBtnClick(L).onNetworkBtnClick(ae).onResetBtnClick(te).onSetNumberPerRowClick(Y).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(Fe).onExportAllBtnClick(We).onExpandBtnClick(U).maxSnpPValueProperty(Ie.maxSnpPValue).nGenesToDisplayProperty(Ie.nGenesToDisplay).annotationLabelSizeProperty(Ie.annotationLabelSize)), He(a).call(s), s.setNetworkButtonEnabled(!1), s.setFitButtonEnabled(!1), s.setTabButtonState("auto"), Ke();
    });
  }
  return Ie.resetZoom = Ce, Ie.width = function(ue) {
    return arguments.length ? (t.width = ue, Ie) : t.width;
  }, Ie.height = function(ue) {
    return arguments.length ? (t.height = ue, Ie) : t.height;
  }, Ie.layout = function(ue) {
    return arguments.length ? (t.layout = kt.merge(t.layout, ue), Ie) : t.layout;
  }, Ie.draw = async function(ue, we, $e, at = !1) {
    var vt = tA();
    if ($e)
      vt.readData(we, $e, at).then(function(xt) {
        Ie._draw(ue, xt, at);
      });
    else {
      const xt = await vt.readData(we, $e, at);
      Ie._draw(ue, xt, at);
    }
  }, Ie._draw = function(ue, we) {
    var $e = He(ue).selectAll("div").data(["genemap-target"]);
    $e.enter().append("div").attr("id", function(at) {
      return at;
    }), a = He(ue).select("#genemap-target").node(), He(a).datum(we).call(Ie), Ie.nGenesToDisplay(t.initialMaxGenes), Ce(), Ge(v, w);
  }, Ie.changeQtlColor = function(ue, we, $e) {
    w.chromosomes.forEach(function(at) {
      at.layout.qtlNodes.forEach(function(vt) {
        vt.id === ue && (vt.color = we, vt.label = $e);
      });
    }), be(), Ke();
  }, Ie.changeColor = function(ue) {
    He("#map").style("background-color", ue), be(), Ke();
  }, Ie.redraw = function(ue) {
    a = He(ue).select("#genemap-target")[0][0], j(), He(a).call(Ie), _e();
  }, Ie.setGeneLabels = function(ue) {
    a && pe(ue);
  }, Ie.maxSnpPValue = Fi.Listener(t.maxSnpPValue).addListener(function(ue) {
    var we = Number(ue);
    isNaN(we) && Ie.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(ue), be(), Ke();
  }), Ie.nGenesToDisplay = Fi.Listener(t.nGenesToDisplay).addListener(
    function(ue) {
      var we = t.nGenesToDisplay;
      t.nGenesToDisplay = ue, ue != we && (re(), be(), Ke());
    }
  ), Ie.annotationLabelSize = Fi.Listener(
    t.annotationLabelSize
  ).addListener(function(ue) {
    t.annotationLabelSize = ue, re(), be(), Ke();
  }), Ie.setQtlLabels = function(ue) {
    if (a) {
      var we = He(a).datum();
      we.chromosomes.forEach(function($e) {
        $e.annotations.qtls.forEach(function(at) {
          ue === "auto" ? delete at.showLabel : at.showLabel = ue;
        });
      });
    }
  }, Ie.onAnonationLabelSelectFunction = function() {
  }, Ie.loggingOn = function() {
    d.style("display", "initial");
  }, Ie.loggingOff = function() {
    d.style("display", "none");
  }, Ie.getSelectedGenes = function() {
    var ue = [];
    return w.chromosomes.forEach(function(we) {
      we.annotations.genes.forEach(function($e) {
        $e.selected && ue.push($e);
      });
    }), ue;
  }, Ie.getGenome = function() {
    return w;
  }, Ie;
};
const ra = Fi.GeneMap().width("100%").height("100%");
function wL() {
  const e = document.getElementById("show-gene-labels"), n = e.options[e.selectedIndex].value;
  ra.setGeneLabels(n);
  const t = document.getElementById("show-qtl-labels"), a = t.options[t.selectedIndex].value;
  ra.setQtlLabels(a), ra.redraw("#map");
}
function bL() {
  ra.changeQtlColor("C6", "#000");
}
async function _L(e) {
  e && ra.resetZoom();
  const n = await import("./arabidopsis-DWsJl-zt.js"), t = await import("./arabidopsis-BWR4fnku.js");
  ra.draw("#map", n.default, t.default, !0);
}
export {
  bL as changeQtlColor,
  ra as chart,
  _L as redraw,
  wL as updateLabel
};
