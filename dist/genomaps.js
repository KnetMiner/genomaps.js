import './chart.css';function Tb(A, e) {
  for (var t = 0; t < e.length; t++) {
    const n = e[t];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const i in n)
        if (i !== "default" && !(i in A)) {
          const s = Object.getOwnPropertyDescriptor(n, i);
          s && Object.defineProperty(A, i, s.get ? s : {
            enumerable: !0,
            get: () => n[i]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(A, Symbol.toStringTag, { value: "Module" }));
}
var Wi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function vc(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var Nh = { exports: {} }, zm = {}, Sr = {}, ki = {}, th = {}, ye = {}, Cs = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.regexpCode = A.getEsmExportName = A.getProperty = A.safeStringify = A.stringify = A.strConcat = A.addCodeArg = A.str = A._ = A.nil = A._Code = A.Name = A.IDENTIFIER = A._CodeOrName = void 0;
  class e {
  }
  A._CodeOrName = e, A.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class t extends e {
    constructor(S) {
      if (super(), !A.IDENTIFIER.test(S))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = S;
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
  A.Name = t;
  class n extends e {
    constructor(S) {
      super(), this._items = typeof S == "string" ? [S] : S;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const S = this._items[0];
      return S === "" || S === '""';
    }
    get str() {
      var S;
      return (S = this._str) !== null && S !== void 0 ? S : this._str = this._items.reduce((O, b) => `${O}${b}`, "");
    }
    get names() {
      var S;
      return (S = this._names) !== null && S !== void 0 ? S : this._names = this._items.reduce((O, b) => (b instanceof t && (O[b.str] = (O[b.str] || 0) + 1), O), {});
    }
  }
  A._Code = n, A.nil = new n("");
  function i(U, ...S) {
    const O = [U[0]];
    let b = 0;
    for (; b < S.length; )
      f(O, S[b]), O.push(U[++b]);
    return new n(O);
  }
  A._ = i;
  const s = new n("+");
  function l(U, ...S) {
    const O = [v(U[0])];
    let b = 0;
    for (; b < S.length; )
      O.push(s), f(O, S[b]), O.push(s, v(U[++b]));
    return c(O), new n(O);
  }
  A.str = l;
  function f(U, S) {
    S instanceof n ? U.push(...S._items) : S instanceof t ? U.push(S) : U.push(B(S));
  }
  A.addCodeArg = f;
  function c(U) {
    let S = 1;
    for (; S < U.length - 1; ) {
      if (U[S] === s) {
        const O = h(U[S - 1], U[S + 1]);
        if (O !== void 0) {
          U.splice(S - 1, 3, O);
          continue;
        }
        U[S++] = "+";
      }
      S++;
    }
  }
  function h(U, S) {
    if (S === '""')
      return U;
    if (U === '""')
      return S;
    if (typeof U == "string")
      return S instanceof t || U[U.length - 1] !== '"' ? void 0 : typeof S != "string" ? `${U.slice(0, -1)}${S}"` : S[0] === '"' ? U.slice(0, -1) + S.slice(1) : void 0;
    if (typeof S == "string" && S[0] === '"' && !(U instanceof t))
      return `"${U}${S.slice(1)}`;
  }
  function w(U, S) {
    return S.emptyStr() ? U : U.emptyStr() ? S : l`${U}${S}`;
  }
  A.strConcat = w;
  function B(U) {
    return typeof U == "number" || typeof U == "boolean" || U === null ? U : v(Array.isArray(U) ? U.join(",") : U);
  }
  function p(U) {
    return new n(v(U));
  }
  A.stringify = p;
  function v(U) {
    return JSON.stringify(U).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  A.safeStringify = v;
  function o(U) {
    return typeof U == "string" && A.IDENTIFIER.test(U) ? new n(`.${U}`) : i`[${U}]`;
  }
  A.getProperty = o;
  function C(U) {
    if (typeof U == "string" && A.IDENTIFIER.test(U))
      return new n(`${U}`);
    throw new Error(`CodeGen: invalid export name: ${U}, use explicit $id name mapping`);
  }
  A.getEsmExportName = C;
  function F(U) {
    return new n(U.toString());
  }
  A.regexpCode = F;
})(Cs);
var Mh = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ValueScope = A.ValueScopeName = A.Scope = A.varKinds = A.UsedValueState = void 0;
  const e = Cs;
  class t extends Error {
    constructor(h) {
      super(`CodeGen: "code" for ${h} not defined`), this.value = h.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (A.UsedValueState = n = {})), A.varKinds = {
    const: new e.Name("const"),
    let: new e.Name("let"),
    var: new e.Name("var")
  };
  class i {
    constructor({ prefixes: h, parent: w } = {}) {
      this._names = {}, this._prefixes = h, this._parent = w;
    }
    toName(h) {
      return h instanceof e.Name ? h : this.name(h);
    }
    name(h) {
      return new e.Name(this._newName(h));
    }
    _newName(h) {
      const w = this._names[h] || this._nameGroup(h);
      return `${h}${w.index++}`;
    }
    _nameGroup(h) {
      var w, B;
      if (!((B = (w = this._parent) === null || w === void 0 ? void 0 : w._prefixes) === null || B === void 0) && B.has(h) || this._prefixes && !this._prefixes.has(h))
        throw new Error(`CodeGen: prefix "${h}" is not allowed in this scope`);
      return this._names[h] = { prefix: h, index: 0 };
    }
  }
  A.Scope = i;
  class s extends e.Name {
    constructor(h, w) {
      super(w), this.prefix = h;
    }
    setValue(h, { property: w, itemIndex: B }) {
      this.value = h, this.scopePath = (0, e._)`.${new e.Name(w)}[${B}]`;
    }
  }
  A.ValueScopeName = s;
  const l = (0, e._)`\n`;
  class f extends i {
    constructor(h) {
      super(h), this._values = {}, this._scope = h.scope, this.opts = { ...h, _n: h.lines ? l : e.nil };
    }
    get() {
      return this._scope;
    }
    name(h) {
      return new s(h, this._newName(h));
    }
    value(h, w) {
      var B;
      if (w.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const p = this.toName(h), { prefix: v } = p, o = (B = w.key) !== null && B !== void 0 ? B : w.ref;
      let C = this._values[v];
      if (C) {
        const S = C.get(o);
        if (S)
          return S;
      } else
        C = this._values[v] = /* @__PURE__ */ new Map();
      C.set(o, p);
      const F = this._scope[v] || (this._scope[v] = []), U = F.length;
      return F[U] = w.ref, p.setValue(w, { property: v, itemIndex: U }), p;
    }
    getValue(h, w) {
      const B = this._values[h];
      if (B)
        return B.get(w);
    }
    scopeRefs(h, w = this._values) {
      return this._reduceValues(w, (B) => {
        if (B.scopePath === void 0)
          throw new Error(`CodeGen: name "${B}" has no value`);
        return (0, e._)`${h}${B.scopePath}`;
      });
    }
    scopeCode(h = this._values, w, B) {
      return this._reduceValues(h, (p) => {
        if (p.value === void 0)
          throw new Error(`CodeGen: name "${p}" has no value`);
        return p.value.code;
      }, w, B);
    }
    _reduceValues(h, w, B = {}, p) {
      let v = e.nil;
      for (const o in h) {
        const C = h[o];
        if (!C)
          continue;
        const F = B[o] = B[o] || /* @__PURE__ */ new Map();
        C.forEach((U) => {
          if (F.has(U))
            return;
          F.set(U, n.Started);
          let S = w(U);
          if (S) {
            const O = this.opts.es5 ? A.varKinds.var : A.varKinds.const;
            v = (0, e._)`${v}${O} ${U} = ${S};${this.opts._n}`;
          } else if (S = p == null ? void 0 : p(U))
            v = (0, e._)`${v}${S}${this.opts._n}`;
          else
            throw new t(U);
          F.set(U, n.Completed);
        });
      }
      return v;
    }
  }
  A.ValueScope = f;
})(Mh);
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.or = A.and = A.not = A.CodeGen = A.operators = A.varKinds = A.ValueScopeName = A.ValueScope = A.Scope = A.Name = A.regexpCode = A.stringify = A.getProperty = A.nil = A.strConcat = A.str = A._ = void 0;
  const e = Cs, t = Mh;
  var n = Cs;
  Object.defineProperty(A, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(A, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(A, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(A, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(A, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(A, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(A, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(A, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = Mh;
  Object.defineProperty(A, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(A, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(A, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(A, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
  } }), A.operators = {
    GT: new e._Code(">"),
    GTE: new e._Code(">="),
    LT: new e._Code("<"),
    LTE: new e._Code("<="),
    EQ: new e._Code("==="),
    NEQ: new e._Code("!=="),
    NOT: new e._Code("!"),
    OR: new e._Code("||"),
    AND: new e._Code("&&"),
    ADD: new e._Code("+")
  };
  class s {
    optimizeNodes() {
      return this;
    }
    optimizeNames(L, k) {
      return this;
    }
  }
  class l extends s {
    constructor(L, k, oA) {
      super(), this.varKind = L, this.name = k, this.rhs = oA;
    }
    render({ es5: L, _n: k }) {
      const oA = L ? t.varKinds.var : this.varKind, _A = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${oA} ${this.name}${_A};` + k;
    }
    optimizeNames(L, k) {
      if (L[this.name.str])
        return this.rhs && (this.rhs = z(this.rhs, L, k)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class f extends s {
    constructor(L, k, oA) {
      super(), this.lhs = L, this.rhs = k, this.sideEffects = oA;
    }
    render({ _n: L }) {
      return `${this.lhs} = ${this.rhs};` + L;
    }
    optimizeNames(L, k) {
      if (!(this.lhs instanceof e.Name && !L[this.lhs.str] && !this.sideEffects))
        return this.rhs = z(this.rhs, L, k), this;
    }
    get names() {
      const L = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return bA(L, this.rhs);
    }
  }
  class c extends f {
    constructor(L, k, oA, _A) {
      super(L, oA, _A), this.op = k;
    }
    render({ _n: L }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + L;
    }
  }
  class h extends s {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `${this.label}:` + L;
    }
  }
  class w extends s {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `break${this.label ? ` ${this.label}` : ""};` + L;
    }
  }
  class B extends s {
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
  class p extends s {
    constructor(L) {
      super(), this.code = L;
    }
    render({ _n: L }) {
      return `${this.code};` + L;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(L, k) {
      return this.code = z(this.code, L, k), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class v extends s {
    constructor(L = []) {
      super(), this.nodes = L;
    }
    render(L) {
      return this.nodes.reduce((k, oA) => k + oA.render(L), "");
    }
    optimizeNodes() {
      const { nodes: L } = this;
      let k = L.length;
      for (; k--; ) {
        const oA = L[k].optimizeNodes();
        Array.isArray(oA) ? L.splice(k, 1, ...oA) : oA ? L[k] = oA : L.splice(k, 1);
      }
      return L.length > 0 ? this : void 0;
    }
    optimizeNames(L, k) {
      const { nodes: oA } = this;
      let _A = oA.length;
      for (; _A--; ) {
        const IA = oA[_A];
        IA.optimizeNames(L, k) || (QA(L, IA.names), oA.splice(_A, 1));
      }
      return oA.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((L, k) => NA(L, k.names), {});
    }
  }
  class o extends v {
    render(L) {
      return "{" + L._n + super.render(L) + "}" + L._n;
    }
  }
  class C extends v {
  }
  class F extends o {
  }
  F.kind = "else";
  class U extends o {
    constructor(L, k) {
      super(k), this.condition = L;
    }
    render(L) {
      let k = `if(${this.condition})` + super.render(L);
      return this.else && (k += "else " + this.else.render(L)), k;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const L = this.condition;
      if (L === !0)
        return this.nodes;
      let k = this.else;
      if (k) {
        const oA = k.optimizeNodes();
        k = this.else = Array.isArray(oA) ? new F(oA) : oA;
      }
      if (k)
        return L === !1 ? k instanceof U ? k : k.nodes : this.nodes.length ? this : new U(aA(L), k instanceof U ? [k] : k.nodes);
      if (!(L === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(L, k) {
      var oA;
      if (this.else = (oA = this.else) === null || oA === void 0 ? void 0 : oA.optimizeNames(L, k), !!(super.optimizeNames(L, k) || this.else))
        return this.condition = z(this.condition, L, k), this;
    }
    get names() {
      const L = super.names;
      return bA(L, this.condition), this.else && NA(L, this.else.names), L;
    }
  }
  U.kind = "if";
  class S extends o {
  }
  S.kind = "for";
  class O extends S {
    constructor(L) {
      super(), this.iteration = L;
    }
    render(L) {
      return `for(${this.iteration})` + super.render(L);
    }
    optimizeNames(L, k) {
      if (super.optimizeNames(L, k))
        return this.iteration = z(this.iteration, L, k), this;
    }
    get names() {
      return NA(super.names, this.iteration.names);
    }
  }
  class b extends S {
    constructor(L, k, oA, _A) {
      super(), this.varKind = L, this.name = k, this.from = oA, this.to = _A;
    }
    render(L) {
      const k = L.es5 ? t.varKinds.var : this.varKind, { name: oA, from: _A, to: IA } = this;
      return `for(${k} ${oA}=${_A}; ${oA}<${IA}; ${oA}++)` + super.render(L);
    }
    get names() {
      const L = bA(super.names, this.from);
      return bA(L, this.to);
    }
  }
  class P extends S {
    constructor(L, k, oA, _A) {
      super(), this.loop = L, this.varKind = k, this.name = oA, this.iterable = _A;
    }
    render(L) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(L);
    }
    optimizeNames(L, k) {
      if (super.optimizeNames(L, k))
        return this.iterable = z(this.iterable, L, k), this;
    }
    get names() {
      return NA(super.names, this.iterable.names);
    }
  }
  class R extends o {
    constructor(L, k, oA) {
      super(), this.name = L, this.args = k, this.async = oA;
    }
    render(L) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(L);
    }
  }
  R.kind = "func";
  class j extends v {
    render(L) {
      return "return " + super.render(L);
    }
  }
  j.kind = "return";
  class dA extends o {
    render(L) {
      let k = "try" + super.render(L);
      return this.catch && (k += this.catch.render(L)), this.finally && (k += this.finally.render(L)), k;
    }
    optimizeNodes() {
      var L, k;
      return super.optimizeNodes(), (L = this.catch) === null || L === void 0 || L.optimizeNodes(), (k = this.finally) === null || k === void 0 || k.optimizeNodes(), this;
    }
    optimizeNames(L, k) {
      var oA, _A;
      return super.optimizeNames(L, k), (oA = this.catch) === null || oA === void 0 || oA.optimizeNames(L, k), (_A = this.finally) === null || _A === void 0 || _A.optimizeNames(L, k), this;
    }
    get names() {
      const L = super.names;
      return this.catch && NA(L, this.catch.names), this.finally && NA(L, this.finally.names), L;
    }
  }
  class fA extends o {
    constructor(L) {
      super(), this.error = L;
    }
    render(L) {
      return `catch(${this.error})` + super.render(L);
    }
  }
  fA.kind = "catch";
  class mA extends o {
    render(L) {
      return "finally" + super.render(L);
    }
  }
  mA.kind = "finally";
  class FA {
    constructor(L, k = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...k, _n: k.lines ? `
` : "" }, this._extScope = L, this._scope = new t.Scope({ parent: L }), this._nodes = [new C()];
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
    scopeValue(L, k) {
      const oA = this._extScope.value(L, k);
      return (this._values[oA.prefix] || (this._values[oA.prefix] = /* @__PURE__ */ new Set())).add(oA), oA;
    }
    getScopeValue(L, k) {
      return this._extScope.getValue(L, k);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(L) {
      return this._extScope.scopeRefs(L, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(L, k, oA, _A) {
      const IA = this._scope.toName(k);
      return oA !== void 0 && _A && (this._constants[IA.str] = oA), this._leafNode(new l(L, IA, oA)), IA;
    }
    // `const` declaration (`var` in es5 mode)
    const(L, k, oA) {
      return this._def(t.varKinds.const, L, k, oA);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(L, k, oA) {
      return this._def(t.varKinds.let, L, k, oA);
    }
    // `var` declaration with optional assignment
    var(L, k, oA) {
      return this._def(t.varKinds.var, L, k, oA);
    }
    // assignment code
    assign(L, k, oA) {
      return this._leafNode(new f(L, k, oA));
    }
    // `+=` code
    add(L, k) {
      return this._leafNode(new c(L, A.operators.ADD, k));
    }
    // appends passed SafeExpr to code or executes Block
    code(L) {
      return typeof L == "function" ? L() : L !== e.nil && this._leafNode(new p(L)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...L) {
      const k = ["{"];
      for (const [oA, _A] of L)
        k.length > 1 && k.push(","), k.push(oA), (oA !== _A || this.opts.es5) && (k.push(":"), (0, e.addCodeArg)(k, _A));
      return k.push("}"), new e._Code(k);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(L, k, oA) {
      if (this._blockNode(new U(L)), k && oA)
        this.code(k).else().code(oA).endIf();
      else if (k)
        this.code(k).endIf();
      else if (oA)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(L) {
      return this._elseNode(new U(L));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new F());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(U, F);
    }
    _for(L, k) {
      return this._blockNode(L), k && this.code(k).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(L, k) {
      return this._for(new O(L), k);
    }
    // `for` statement for a range of values
    forRange(L, k, oA, _A, IA = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const JA = this._scope.toName(L);
      return this._for(new b(IA, JA, k, oA), () => _A(JA));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(L, k, oA, _A = t.varKinds.const) {
      const IA = this._scope.toName(L);
      if (this.opts.es5) {
        const JA = k instanceof e.Name ? k : this.var("_arr", k);
        return this.forRange("_i", 0, (0, e._)`${JA}.length`, (jA) => {
          this.var(IA, (0, e._)`${JA}[${jA}]`), oA(IA);
        });
      }
      return this._for(new P("of", _A, IA, k), () => oA(IA));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(L, k, oA, _A = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(L, (0, e._)`Object.keys(${k})`, oA);
      const IA = this._scope.toName(L);
      return this._for(new P("in", _A, IA, k), () => oA(IA));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(S);
    }
    // `label` statement
    label(L) {
      return this._leafNode(new h(L));
    }
    // `break` statement
    break(L) {
      return this._leafNode(new w(L));
    }
    // `return` statement
    return(L) {
      const k = new j();
      if (this._blockNode(k), this.code(L), k.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(j);
    }
    // `try` statement
    try(L, k, oA) {
      if (!k && !oA)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const _A = new dA();
      if (this._blockNode(_A), this.code(L), k) {
        const IA = this.name("e");
        this._currNode = _A.catch = new fA(IA), k(IA);
      }
      return oA && (this._currNode = _A.finally = new mA(), this.code(oA)), this._endBlockNode(fA, mA);
    }
    // `throw` statement
    throw(L) {
      return this._leafNode(new B(L));
    }
    // start self-balancing block
    block(L, k) {
      return this._blockStarts.push(this._nodes.length), L && this.code(L).endBlock(k), this;
    }
    // end the current self-balancing block
    endBlock(L) {
      const k = this._blockStarts.pop();
      if (k === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const oA = this._nodes.length - k;
      if (oA < 0 || L !== void 0 && oA !== L)
        throw new Error(`CodeGen: wrong number of nodes: ${oA} vs ${L} expected`);
      return this._nodes.length = k, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(L, k = e.nil, oA, _A) {
      return this._blockNode(new R(L, k, oA)), _A && this.code(_A).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(R);
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
    _endBlockNode(L, k) {
      const oA = this._currNode;
      if (oA instanceof L || k && oA instanceof k)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${k ? `${L.kind}/${k.kind}` : L.kind}"`);
    }
    _elseNode(L) {
      const k = this._currNode;
      if (!(k instanceof U))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = k.else = L, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const L = this._nodes;
      return L[L.length - 1];
    }
    set _currNode(L) {
      const k = this._nodes;
      k[k.length - 1] = L;
    }
  }
  A.CodeGen = FA;
  function NA(Y, L) {
    for (const k in L)
      Y[k] = (Y[k] || 0) + (L[k] || 0);
    return Y;
  }
  function bA(Y, L) {
    return L instanceof e._CodeOrName ? NA(Y, L.names) : Y;
  }
  function z(Y, L, k) {
    if (Y instanceof e.Name)
      return oA(Y);
    if (!_A(Y))
      return Y;
    return new e._Code(Y._items.reduce((IA, JA) => (JA instanceof e.Name && (JA = oA(JA)), JA instanceof e._Code ? IA.push(...JA._items) : IA.push(JA), IA), []));
    function oA(IA) {
      const JA = k[IA.str];
      return JA === void 0 || L[IA.str] !== 1 ? IA : (delete L[IA.str], JA);
    }
    function _A(IA) {
      return IA instanceof e._Code && IA._items.some((JA) => JA instanceof e.Name && L[JA.str] === 1 && k[JA.str] !== void 0);
    }
  }
  function QA(Y, L) {
    for (const k in L)
      Y[k] = (Y[k] || 0) - (L[k] || 0);
  }
  function aA(Y) {
    return typeof Y == "boolean" || typeof Y == "number" || Y === null ? !Y : (0, e._)`!${iA(Y)}`;
  }
  A.not = aA;
  const BA = D(A.operators.AND);
  function HA(...Y) {
    return Y.reduce(BA);
  }
  A.and = HA;
  const SA = D(A.operators.OR);
  function lA(...Y) {
    return Y.reduce(SA);
  }
  A.or = lA;
  function D(Y) {
    return (L, k) => L === e.nil ? k : k === e.nil ? L : (0, e._)`${iA(L)} ${Y} ${iA(k)}`;
  }
  function iA(Y) {
    return Y instanceof e.Name ? Y : (0, e._)`(${Y})`;
  }
})(ye);
var kA = {};
Object.defineProperty(kA, "__esModule", { value: !0 });
kA.checkStrictMode = kA.getErrorPath = kA.Type = kA.useFunc = kA.setEvaluated = kA.evaluatedPropsToName = kA.mergeEvaluated = kA.eachItem = kA.unescapeJsonPointer = kA.escapeJsonPointer = kA.escapeFragment = kA.unescapeFragment = kA.schemaRefOrVal = kA.schemaHasRulesButRef = kA.schemaHasRules = kA.checkUnknownRules = kA.alwaysValidSchema = kA.toHash = void 0;
const Ge = ye, Db = Cs;
function Ob(A) {
  const e = {};
  for (const t of A)
    e[t] = !0;
  return e;
}
kA.toHash = Ob;
function Nb(A, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (Jm(A, e), !jm(e, A.self.RULES.all));
}
kA.alwaysValidSchema = Nb;
function Jm(A, e = A.schema) {
  const { opts: t, self: n } = A;
  if (!t.strictSchema || typeof e == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in e)
    i[s] || Av(A, `unknown keyword: "${s}"`);
}
kA.checkUnknownRules = Jm;
function jm(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e[t])
      return !0;
  return !1;
}
kA.schemaHasRules = jm;
function Mb(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (t !== "$ref" && e.all[t])
      return !0;
  return !1;
}
kA.schemaHasRulesButRef = Mb;
function Pb({ topSchemaRef: A, schemaPath: e }, t, n, i) {
  if (!i) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, Ge._)`${t}`;
  }
  return (0, Ge._)`${A}${e}${(0, Ge.getProperty)(n)}`;
}
kA.schemaRefOrVal = Pb;
function Kb(A) {
  return Ym(decodeURIComponent(A));
}
kA.unescapeFragment = Kb;
function Rb(A) {
  return encodeURIComponent(Ld(A));
}
kA.escapeFragment = Rb;
function Ld(A) {
  return typeof A == "number" ? `${A}` : A.replace(/~/g, "~0").replace(/\//g, "~1");
}
kA.escapeJsonPointer = Ld;
function Ym(A) {
  return A.replace(/~1/g, "/").replace(/~0/g, "~");
}
kA.unescapeJsonPointer = Ym;
function kb(A, e) {
  if (Array.isArray(A))
    for (const t of A)
      e(t);
  else
    e(A);
}
kA.eachItem = kb;
function SB({ mergeNames: A, mergeToName: e, mergeValues: t, resultToName: n }) {
  return (i, s, l, f) => {
    const c = l === void 0 ? s : l instanceof Ge.Name ? (s instanceof Ge.Name ? A(i, s, l) : e(i, s, l), l) : s instanceof Ge.Name ? (e(i, l, s), s) : t(s, l);
    return f === Ge.Name && !(c instanceof Ge.Name) ? n(i, c) : c;
  };
}
kA.mergeEvaluated = {
  props: SB({
    mergeNames: (A, e, t) => A.if((0, Ge._)`${t} !== true && ${e} !== undefined`, () => {
      A.if((0, Ge._)`${e} === true`, () => A.assign(t, !0), () => A.assign(t, (0, Ge._)`${t} || {}`).code((0, Ge._)`Object.assign(${t}, ${e})`));
    }),
    mergeToName: (A, e, t) => A.if((0, Ge._)`${t} !== true`, () => {
      e === !0 ? A.assign(t, !0) : (A.assign(t, (0, Ge._)`${t} || {}`), Td(A, t, e));
    }),
    mergeValues: (A, e) => A === !0 ? !0 : { ...A, ...e },
    resultToName: Zm
  }),
  items: SB({
    mergeNames: (A, e, t) => A.if((0, Ge._)`${t} !== true && ${e} !== undefined`, () => A.assign(t, (0, Ge._)`${e} === true ? true : ${t} > ${e} ? ${t} : ${e}`)),
    mergeToName: (A, e, t) => A.if((0, Ge._)`${t} !== true`, () => A.assign(t, e === !0 ? !0 : (0, Ge._)`${t} > ${e} ? ${t} : ${e}`)),
    mergeValues: (A, e) => A === !0 ? !0 : Math.max(A, e),
    resultToName: (A, e) => A.var("items", e)
  })
};
function Zm(A, e) {
  if (e === !0)
    return A.var("props", !0);
  const t = A.var("props", (0, Ge._)`{}`);
  return e !== void 0 && Td(A, t, e), t;
}
kA.evaluatedPropsToName = Zm;
function Td(A, e, t) {
  Object.keys(t).forEach((n) => A.assign((0, Ge._)`${e}${(0, Ge.getProperty)(n)}`, !0));
}
kA.setEvaluated = Td;
const LB = {};
function $b(A, e) {
  return A.scopeValue("func", {
    ref: e,
    code: LB[e.code] || (LB[e.code] = new Db._Code(e.code))
  });
}
kA.useFunc = $b;
var Ph;
(function(A) {
  A[A.Num = 0] = "Num", A[A.Str = 1] = "Str";
})(Ph || (kA.Type = Ph = {}));
function Gb(A, e, t) {
  if (A instanceof Ge.Name) {
    const n = e === Ph.Num;
    return t ? n ? (0, Ge._)`"[" + ${A} + "]"` : (0, Ge._)`"['" + ${A} + "']"` : n ? (0, Ge._)`"/" + ${A}` : (0, Ge._)`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, Ge.getProperty)(A).toString() : "/" + Ld(A);
}
kA.getErrorPath = Gb;
function Av(A, e, t = A.opts.strictSchema) {
  if (t) {
    if (e = `strict mode: ${e}`, t === !0)
      throw new Error(e);
    A.self.logger.warn(e);
  }
}
kA.checkStrictMode = Av;
var cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
const Lt = ye, Vb = {
  // validation function arguments
  data: new Lt.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Lt.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Lt.Name("instancePath"),
  parentData: new Lt.Name("parentData"),
  parentDataProperty: new Lt.Name("parentDataProperty"),
  rootData: new Lt.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Lt.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Lt.Name("vErrors"),
  // null or array of validation errors
  errors: new Lt.Name("errors"),
  // counter of validation errors
  this: new Lt.Name("this"),
  // "globals"
  self: new Lt.Name("self"),
  scope: new Lt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Lt.Name("json"),
  jsonPos: new Lt.Name("jsonPos"),
  jsonLen: new Lt.Name("jsonLen"),
  jsonPart: new Lt.Name("jsonPart")
};
cr.default = Vb;
var TB;
function yc() {
  return TB || (TB = 1, function(A) {
    Object.defineProperty(A, "__esModule", { value: !0 }), A.extendErrors = A.resetErrorsCount = A.reportExtraError = A.reportError = A.keyword$DataError = A.keywordError = void 0;
    const e = ye, t = kA, n = cr;
    A.keywordError = {
      message: ({ keyword: F }) => (0, e.str)`must pass "${F}" keyword validation`
    }, A.keyword$DataError = {
      message: ({ keyword: F, schemaType: U }) => U ? (0, e.str)`"${F}" keyword must be ${U} ($data)` : (0, e.str)`"${F}" keyword is invalid ($data)`
    };
    function i(F, U = A.keywordError, S, O) {
      const { it: b } = F, { gen: P, compositeRule: R, allErrors: j } = b, dA = B(F, U, S);
      O ?? (R || j) ? c(P, dA) : h(b, (0, e._)`[${dA}]`);
    }
    A.reportError = i;
    function s(F, U = A.keywordError, S) {
      const { it: O } = F, { gen: b, compositeRule: P, allErrors: R } = O, j = B(F, U, S);
      c(b, j), P || R || h(O, n.default.vErrors);
    }
    A.reportExtraError = s;
    function l(F, U) {
      F.assign(n.default.errors, U), F.if((0, e._)`${n.default.vErrors} !== null`, () => F.if(U, () => F.assign((0, e._)`${n.default.vErrors}.length`, U), () => F.assign(n.default.vErrors, null)));
    }
    A.resetErrorsCount = l;
    function f({ gen: F, keyword: U, schemaValue: S, data: O, errsCount: b, it: P }) {
      if (b === void 0)
        throw new Error("ajv implementation error");
      const R = F.name("err");
      F.forRange("i", b, n.default.errors, (j) => {
        F.const(R, (0, e._)`${n.default.vErrors}[${j}]`), F.if((0, e._)`${R}.instancePath === undefined`, () => F.assign((0, e._)`${R}.instancePath`, (0, e.strConcat)(n.default.instancePath, P.errorPath))), F.assign((0, e._)`${R}.schemaPath`, (0, e.str)`${P.errSchemaPath}/${U}`), P.opts.verbose && (F.assign((0, e._)`${R}.schema`, S), F.assign((0, e._)`${R}.data`, O));
      });
    }
    A.extendErrors = f;
    function c(F, U) {
      const S = F.const("err", U);
      F.if((0, e._)`${n.default.vErrors} === null`, () => F.assign(n.default.vErrors, (0, e._)`[${S}]`), (0, e._)`${n.default.vErrors}.push(${S})`), F.code((0, e._)`${n.default.errors}++`);
    }
    function h(F, U) {
      const { gen: S, validateName: O, schemaEnv: b } = F;
      b.$async ? S.throw((0, e._)`new ${F.ValidationError}(${U})`) : (S.assign((0, e._)`${O}.errors`, U), S.return(!1));
    }
    const w = {
      keyword: new e.Name("keyword"),
      schemaPath: new e.Name("schemaPath"),
      // also used in JTD errors
      params: new e.Name("params"),
      propertyName: new e.Name("propertyName"),
      message: new e.Name("message"),
      schema: new e.Name("schema"),
      parentSchema: new e.Name("parentSchema")
    };
    function B(F, U, S) {
      const { createErrors: O } = F.it;
      return O === !1 ? (0, e._)`{}` : p(F, U, S);
    }
    function p(F, U, S = {}) {
      const { gen: O, it: b } = F, P = [
        v(b, S),
        o(F, S)
      ];
      return C(F, U, P), O.object(...P);
    }
    function v({ errorPath: F }, { instancePath: U }) {
      const S = U ? (0, e.str)`${F}${(0, t.getErrorPath)(U, t.Type.Str)}` : F;
      return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, S)];
    }
    function o({ keyword: F, it: { errSchemaPath: U } }, { schemaPath: S, parentSchema: O }) {
      let b = O ? U : (0, e.str)`${U}/${F}`;
      return S && (b = (0, e.str)`${b}${(0, t.getErrorPath)(S, t.Type.Str)}`), [w.schemaPath, b];
    }
    function C(F, { params: U, message: S }, O) {
      const { keyword: b, data: P, schemaValue: R, it: j } = F, { opts: dA, propertyName: fA, topSchemaRef: mA, schemaPath: FA } = j;
      O.push([w.keyword, b], [w.params, typeof U == "function" ? U(F) : U || (0, e._)`{}`]), dA.messages && O.push([w.message, typeof S == "function" ? S(F) : S]), dA.verbose && O.push([w.schema, R], [w.parentSchema, (0, e._)`${mA}${FA}`], [n.default.data, P]), fA && O.push([w.propertyName, fA]);
    }
  }(th)), th;
}
var DB;
function Wb() {
  if (DB) return ki;
  DB = 1, Object.defineProperty(ki, "__esModule", { value: !0 }), ki.boolOrEmptySchema = ki.topBoolOrEmptySchema = void 0;
  const A = yc(), e = ye, t = cr, n = {
    message: "boolean schema is false"
  };
  function i(f) {
    const { gen: c, schema: h, validateName: w } = f;
    h === !1 ? l(f, !1) : typeof h == "object" && h.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${w}.errors`, null), c.return(!0));
  }
  ki.topBoolOrEmptySchema = i;
  function s(f, c) {
    const { gen: h, schema: w } = f;
    w === !1 ? (h.var(c, !1), l(f)) : h.var(c, !0);
  }
  ki.boolOrEmptySchema = s;
  function l(f, c) {
    const { gen: h, data: w } = f, B = {
      gen: h,
      keyword: "false schema",
      data: w,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: f
    };
    (0, A.reportError)(B, n, void 0, c);
  }
  return ki;
}
var ct = {}, ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
ta.getRules = ta.isJSONType = void 0;
const Xb = ["string", "number", "integer", "boolean", "null", "object", "array"], qb = new Set(Xb);
function zb(A) {
  return typeof A == "string" && qb.has(A);
}
ta.isJSONType = zb;
function Jb() {
  const A = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...A, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, A.number, A.string, A.array, A.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ta.getRules = Jb;
var Lr = {}, OB;
function ev() {
  if (OB) return Lr;
  OB = 1, Object.defineProperty(Lr, "__esModule", { value: !0 }), Lr.shouldUseRule = Lr.shouldUseGroup = Lr.schemaHasRulesForType = void 0;
  function A({ schema: n, self: i }, s) {
    const l = i.RULES.types[s];
    return l && l !== !0 && e(n, l);
  }
  Lr.schemaHasRulesForType = A;
  function e(n, i) {
    return i.rules.some((s) => t(n, s));
  }
  Lr.shouldUseGroup = e;
  function t(n, i) {
    var s;
    return n[i.keyword] !== void 0 || ((s = i.definition.implements) === null || s === void 0 ? void 0 : s.some((l) => n[l] !== void 0));
  }
  return Lr.shouldUseRule = t, Lr;
}
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.reportTypeError = ct.checkDataTypes = ct.checkDataType = ct.coerceAndCheckDataType = ct.getJSONTypes = ct.getSchemaTypes = ct.DataType = void 0;
const jb = ta, Yb = ev(), Zb = yc(), Be = ye, tv = kA;
var Xa;
(function(A) {
  A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong";
})(Xa || (ct.DataType = Xa = {}));
function A1(A) {
  const e = nv(A.type);
  if (e.includes("null")) {
    if (A.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!e.length && A.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    A.nullable === !0 && e.push("null");
  }
  return e;
}
ct.getSchemaTypes = A1;
function nv(A) {
  const e = Array.isArray(A) ? A : A ? [A] : [];
  if (e.every(jb.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
ct.getJSONTypes = nv;
function e1(A, e) {
  const { gen: t, data: n, opts: i } = A, s = t1(e, i.coerceTypes), l = e.length > 0 && !(s.length === 0 && e.length === 1 && (0, Yb.schemaHasRulesForType)(A, e[0]));
  if (l) {
    const f = Dd(e, n, i.strictNumbers, Xa.Wrong);
    t.if(f, () => {
      s.length ? n1(A, e, s) : Od(A);
    });
  }
  return l;
}
ct.coerceAndCheckDataType = e1;
const rv = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function t1(A, e) {
  return e ? A.filter((t) => rv.has(t) || e === "array" && t === "array") : [];
}
function n1(A, e, t) {
  const { gen: n, data: i, opts: s } = A, l = n.let("dataType", (0, Be._)`typeof ${i}`), f = n.let("coerced", (0, Be._)`undefined`);
  s.coerceTypes === "array" && n.if((0, Be._)`${l} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, Be._)`${i}[0]`).assign(l, (0, Be._)`typeof ${i}`).if(Dd(e, i, s.strictNumbers), () => n.assign(f, i))), n.if((0, Be._)`${f} !== undefined`);
  for (const h of t)
    (rv.has(h) || h === "array" && s.coerceTypes === "array") && c(h);
  n.else(), Od(A), n.endIf(), n.if((0, Be._)`${f} !== undefined`, () => {
    n.assign(i, f), r1(A, f);
  });
  function c(h) {
    switch (h) {
      case "string":
        n.elseIf((0, Be._)`${l} == "number" || ${l} == "boolean"`).assign(f, (0, Be._)`"" + ${i}`).elseIf((0, Be._)`${i} === null`).assign(f, (0, Be._)`""`);
        return;
      case "number":
        n.elseIf((0, Be._)`${l} == "boolean" || ${i} === null
              || (${l} == "string" && ${i} && ${i} == +${i})`).assign(f, (0, Be._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, Be._)`${l} === "boolean" || ${i} === null
              || (${l} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(f, (0, Be._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, Be._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(f, !1).elseIf((0, Be._)`${i} === "true" || ${i} === 1`).assign(f, !0);
        return;
      case "null":
        n.elseIf((0, Be._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(f, null);
        return;
      case "array":
        n.elseIf((0, Be._)`${l} === "string" || ${l} === "number"
              || ${l} === "boolean" || ${i} === null`).assign(f, (0, Be._)`[${i}]`);
    }
  }
}
function r1({ gen: A, parentData: e, parentDataProperty: t }, n) {
  A.if((0, Be._)`${e} !== undefined`, () => A.assign((0, Be._)`${e}[${t}]`, n));
}
function Kh(A, e, t, n = Xa.Correct) {
  const i = n === Xa.Correct ? Be.operators.EQ : Be.operators.NEQ;
  let s;
  switch (A) {
    case "null":
      return (0, Be._)`${e} ${i} null`;
    case "array":
      s = (0, Be._)`Array.isArray(${e})`;
      break;
    case "object":
      s = (0, Be._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      s = l((0, Be._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      s = l();
      break;
    default:
      return (0, Be._)`typeof ${e} ${i} ${A}`;
  }
  return n === Xa.Correct ? s : (0, Be.not)(s);
  function l(f = Be.nil) {
    return (0, Be.and)((0, Be._)`typeof ${e} == "number"`, f, t ? (0, Be._)`isFinite(${e})` : Be.nil);
  }
}
ct.checkDataType = Kh;
function Dd(A, e, t, n) {
  if (A.length === 1)
    return Kh(A[0], e, t, n);
  let i;
  const s = (0, tv.toHash)(A);
  if (s.array && s.object) {
    const l = (0, Be._)`typeof ${e} != "object"`;
    i = s.null ? l : (0, Be._)`!${e} || ${l}`, delete s.null, delete s.array, delete s.object;
  } else
    i = Be.nil;
  s.number && delete s.integer;
  for (const l in s)
    i = (0, Be.and)(i, Kh(l, e, t, n));
  return i;
}
ct.checkDataTypes = Dd;
const i1 = {
  message: ({ schema: A }) => `must be ${A}`,
  params: ({ schema: A, schemaValue: e }) => typeof A == "string" ? (0, Be._)`{type: ${A}}` : (0, Be._)`{type: ${e}}`
};
function Od(A) {
  const e = a1(A);
  (0, Zb.reportError)(e, i1);
}
ct.reportTypeError = Od;
function a1(A) {
  const { gen: e, data: t, schema: n } = A, i = (0, tv.schemaRefOrVal)(A, n, "type");
  return {
    gen: e,
    keyword: "type",
    data: t,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: A
  };
}
var Go = {}, NB;
function o1() {
  if (NB) return Go;
  NB = 1, Object.defineProperty(Go, "__esModule", { value: !0 }), Go.assignDefaults = void 0;
  const A = ye, e = kA;
  function t(i, s) {
    const { properties: l, items: f } = i.schema;
    if (s === "object" && l)
      for (const c in l)
        n(i, c, l[c].default);
    else s === "array" && Array.isArray(f) && f.forEach((c, h) => n(i, h, c.default));
  }
  Go.assignDefaults = t;
  function n(i, s, l) {
    const { gen: f, compositeRule: c, data: h, opts: w } = i;
    if (l === void 0)
      return;
    const B = (0, A._)`${h}${(0, A.getProperty)(s)}`;
    if (c) {
      (0, e.checkStrictMode)(i, `default is ignored for: ${B}`);
      return;
    }
    let p = (0, A._)`${B} === undefined`;
    w.useDefaults === "empty" && (p = (0, A._)`${p} || ${B} === null || ${B} === ""`), f.if(p, (0, A._)`${B} = ${(0, A.stringify)(l)}`);
  }
  return Go;
}
var Pn = {}, ve = {};
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.validateUnion = ve.validateArray = ve.usePattern = ve.callValidateCode = ve.schemaProperties = ve.allSchemaProperties = ve.noPropertyInData = ve.propertyInData = ve.isOwnProperty = ve.hasPropFunc = ve.reportMissingProp = ve.checkMissingProp = ve.checkReportMissingProp = void 0;
const qe = ye, Nd = kA, li = cr, s1 = kA;
function u1(A, e) {
  const { gen: t, data: n, it: i } = A;
  t.if(Pd(t, n, e, i.opts.ownProperties), () => {
    A.setParams({ missingProperty: (0, qe._)`${e}` }, !0), A.error();
  });
}
ve.checkReportMissingProp = u1;
function l1({ gen: A, data: e, it: { opts: t } }, n, i) {
  return (0, qe.or)(...n.map((s) => (0, qe.and)(Pd(A, e, s, t.ownProperties), (0, qe._)`${i} = ${s}`)));
}
ve.checkMissingProp = l1;
function c1(A, e) {
  A.setParams({ missingProperty: e }, !0), A.error();
}
ve.reportMissingProp = c1;
function iv(A) {
  return A.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, qe._)`Object.prototype.hasOwnProperty`
  });
}
ve.hasPropFunc = iv;
function Md(A, e, t) {
  return (0, qe._)`${iv(A)}.call(${e}, ${t})`;
}
ve.isOwnProperty = Md;
function f1(A, e, t, n) {
  const i = (0, qe._)`${e}${(0, qe.getProperty)(t)} !== undefined`;
  return n ? (0, qe._)`${i} && ${Md(A, e, t)}` : i;
}
ve.propertyInData = f1;
function Pd(A, e, t, n) {
  const i = (0, qe._)`${e}${(0, qe.getProperty)(t)} === undefined`;
  return n ? (0, qe.or)(i, (0, qe.not)(Md(A, e, t))) : i;
}
ve.noPropertyInData = Pd;
function av(A) {
  return A ? Object.keys(A).filter((e) => e !== "__proto__") : [];
}
ve.allSchemaProperties = av;
function h1(A, e) {
  return av(e).filter((t) => !(0, Nd.alwaysValidSchema)(A, e[t]));
}
ve.schemaProperties = h1;
function d1({ schemaCode: A, data: e, it: { gen: t, topSchemaRef: n, schemaPath: i, errorPath: s }, it: l }, f, c, h) {
  const w = h ? (0, qe._)`${A}, ${e}, ${n}${i}` : e, B = [
    [li.default.instancePath, (0, qe.strConcat)(li.default.instancePath, s)],
    [li.default.parentData, l.parentData],
    [li.default.parentDataProperty, l.parentDataProperty],
    [li.default.rootData, li.default.rootData]
  ];
  l.opts.dynamicRef && B.push([li.default.dynamicAnchors, li.default.dynamicAnchors]);
  const p = (0, qe._)`${w}, ${t.object(...B)}`;
  return c !== qe.nil ? (0, qe._)`${f}.call(${c}, ${p})` : (0, qe._)`${f}(${p})`;
}
ve.callValidateCode = d1;
const p1 = (0, qe._)`new RegExp`;
function g1({ gen: A, it: { opts: e } }, t) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: i } = e.code, s = i(t, n);
  return A.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, qe._)`${i.code === "new RegExp" ? p1 : (0, s1.useFunc)(A, i)}(${t}, ${n})`
  });
}
ve.usePattern = g1;
function B1(A) {
  const { gen: e, data: t, keyword: n, it: i } = A, s = e.name("valid");
  if (i.allErrors) {
    const f = e.let("valid", !0);
    return l(() => e.assign(f, !1)), f;
  }
  return e.var(s, !0), l(() => e.break()), s;
  function l(f) {
    const c = e.const("len", (0, qe._)`${t}.length`);
    e.forRange("i", 0, c, (h) => {
      A.subschema({
        keyword: n,
        dataProp: h,
        dataPropType: Nd.Type.Num
      }, s), e.if((0, qe.not)(s), f);
    });
  }
}
ve.validateArray = B1;
function w1(A) {
  const { gen: e, schema: t, keyword: n, it: i } = A;
  if (!Array.isArray(t))
    throw new Error("ajv implementation error");
  if (t.some((c) => (0, Nd.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const l = e.let("valid", !1), f = e.name("_valid");
  e.block(() => t.forEach((c, h) => {
    const w = A.subschema({
      keyword: n,
      schemaProp: h,
      compositeRule: !0
    }, f);
    e.assign(l, (0, qe._)`${l} || ${f}`), A.mergeValidEvaluated(w, f) || e.if((0, qe.not)(l));
  })), A.result(l, () => A.reset(), () => A.error(!0));
}
ve.validateUnion = w1;
var MB;
function m1() {
  if (MB) return Pn;
  MB = 1, Object.defineProperty(Pn, "__esModule", { value: !0 }), Pn.validateKeywordUsage = Pn.validSchemaType = Pn.funcKeywordCode = Pn.macroKeywordCode = void 0;
  const A = ye, e = cr, t = ve, n = yc();
  function i(p, v) {
    const { gen: o, keyword: C, schema: F, parentSchema: U, it: S } = p, O = v.macro.call(S.self, F, U, S), b = h(o, C, O);
    S.opts.validateSchema !== !1 && S.self.validateSchema(O, !0);
    const P = o.name("valid");
    p.subschema({
      schema: O,
      schemaPath: A.nil,
      errSchemaPath: `${S.errSchemaPath}/${C}`,
      topSchemaRef: b,
      compositeRule: !0
    }, P), p.pass(P, () => p.error(!0));
  }
  Pn.macroKeywordCode = i;
  function s(p, v) {
    var o;
    const { gen: C, keyword: F, schema: U, parentSchema: S, $data: O, it: b } = p;
    c(b, v);
    const P = !O && v.compile ? v.compile.call(b.self, U, S, b) : v.validate, R = h(C, F, P), j = C.let("valid");
    p.block$data(j, dA), p.ok((o = v.valid) !== null && o !== void 0 ? o : j);
    function dA() {
      if (v.errors === !1)
        FA(), v.modifying && l(p), NA(() => p.error());
      else {
        const bA = v.async ? fA() : mA();
        v.modifying && l(p), NA(() => f(p, bA));
      }
    }
    function fA() {
      const bA = C.let("ruleErrs", null);
      return C.try(() => FA((0, A._)`await `), (z) => C.assign(j, !1).if((0, A._)`${z} instanceof ${b.ValidationError}`, () => C.assign(bA, (0, A._)`${z}.errors`), () => C.throw(z))), bA;
    }
    function mA() {
      const bA = (0, A._)`${R}.errors`;
      return C.assign(bA, null), FA(A.nil), bA;
    }
    function FA(bA = v.async ? (0, A._)`await ` : A.nil) {
      const z = b.opts.passContext ? e.default.this : e.default.self, QA = !("compile" in v && !O || v.schema === !1);
      C.assign(j, (0, A._)`${bA}${(0, t.callValidateCode)(p, R, z, QA)}`, v.modifying);
    }
    function NA(bA) {
      var z;
      C.if((0, A.not)((z = v.valid) !== null && z !== void 0 ? z : j), bA);
    }
  }
  Pn.funcKeywordCode = s;
  function l(p) {
    const { gen: v, data: o, it: C } = p;
    v.if(C.parentData, () => v.assign(o, (0, A._)`${C.parentData}[${C.parentDataProperty}]`));
  }
  function f(p, v) {
    const { gen: o } = p;
    o.if((0, A._)`Array.isArray(${v})`, () => {
      o.assign(e.default.vErrors, (0, A._)`${e.default.vErrors} === null ? ${v} : ${e.default.vErrors}.concat(${v})`).assign(e.default.errors, (0, A._)`${e.default.vErrors}.length`), (0, n.extendErrors)(p);
    }, () => p.error());
  }
  function c({ schemaEnv: p }, v) {
    if (v.async && !p.$async)
      throw new Error("async keyword in sync schema");
  }
  function h(p, v, o) {
    if (o === void 0)
      throw new Error(`keyword "${v}" failed to compile`);
    return p.scopeValue("keyword", typeof o == "function" ? { ref: o } : { ref: o, code: (0, A.stringify)(o) });
  }
  function w(p, v, o = !1) {
    return !v.length || v.some((C) => C === "array" ? Array.isArray(p) : C === "object" ? p && typeof p == "object" && !Array.isArray(p) : typeof p == C || o && typeof p > "u");
  }
  Pn.validSchemaType = w;
  function B({ schema: p, opts: v, self: o, errSchemaPath: C }, F, U) {
    if (Array.isArray(F.keyword) ? !F.keyword.includes(U) : F.keyword !== U)
      throw new Error("ajv implementation error");
    const S = F.dependencies;
    if (S != null && S.some((O) => !Object.prototype.hasOwnProperty.call(p, O)))
      throw new Error(`parent schema must have dependencies of ${U}: ${S.join(",")}`);
    if (F.validateSchema && !F.validateSchema(p[U])) {
      const b = `keyword "${U}" value is invalid at path "${C}": ` + o.errorsText(F.validateSchema.errors);
      if (v.validateSchema === "log")
        o.logger.error(b);
      else
        throw new Error(b);
    }
  }
  return Pn.validateKeywordUsage = B, Pn;
}
var Tr = {}, PB;
function v1() {
  if (PB) return Tr;
  PB = 1, Object.defineProperty(Tr, "__esModule", { value: !0 }), Tr.extendSubschemaMode = Tr.extendSubschemaData = Tr.getSubschema = void 0;
  const A = ye, e = kA;
  function t(s, { keyword: l, schemaProp: f, schema: c, schemaPath: h, errSchemaPath: w, topSchemaRef: B }) {
    if (l !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (l !== void 0) {
      const p = s.schema[l];
      return f === void 0 ? {
        schema: p,
        schemaPath: (0, A._)`${s.schemaPath}${(0, A.getProperty)(l)}`,
        errSchemaPath: `${s.errSchemaPath}/${l}`
      } : {
        schema: p[f],
        schemaPath: (0, A._)`${s.schemaPath}${(0, A.getProperty)(l)}${(0, A.getProperty)(f)}`,
        errSchemaPath: `${s.errSchemaPath}/${l}/${(0, e.escapeFragment)(f)}`
      };
    }
    if (c !== void 0) {
      if (h === void 0 || w === void 0 || B === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: h,
        topSchemaRef: B,
        errSchemaPath: w
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Tr.getSubschema = t;
  function n(s, l, { dataProp: f, dataPropType: c, data: h, dataTypes: w, propertyName: B }) {
    if (h !== void 0 && f !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: p } = l;
    if (f !== void 0) {
      const { errorPath: o, dataPathArr: C, opts: F } = l, U = p.let("data", (0, A._)`${l.data}${(0, A.getProperty)(f)}`, !0);
      v(U), s.errorPath = (0, A.str)`${o}${(0, e.getErrorPath)(f, c, F.jsPropertySyntax)}`, s.parentDataProperty = (0, A._)`${f}`, s.dataPathArr = [...C, s.parentDataProperty];
    }
    if (h !== void 0) {
      const o = h instanceof A.Name ? h : p.let("data", h, !0);
      v(o), B !== void 0 && (s.propertyName = B);
    }
    w && (s.dataTypes = w);
    function v(o) {
      s.data = o, s.dataLevel = l.dataLevel + 1, s.dataTypes = [], l.definedProperties = /* @__PURE__ */ new Set(), s.parentData = l.data, s.dataNames = [...l.dataNames, o];
    }
  }
  Tr.extendSubschemaData = n;
  function i(s, { jtdDiscriminator: l, jtdMetadata: f, compositeRule: c, createErrors: h, allErrors: w }) {
    c !== void 0 && (s.compositeRule = c), h !== void 0 && (s.createErrors = h), w !== void 0 && (s.allErrors = w), s.jtdDiscriminator = l, s.jtdMetadata = f;
  }
  return Tr.extendSubschemaMode = i, Tr;
}
var Qt = {}, ov = function A(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var n, i, s;
    if (Array.isArray(e)) {
      if (n = e.length, n != t.length) return !1;
      for (i = n; i-- !== 0; )
        if (!A(e[i], t[i])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
    if (s = Object.keys(e), n = s.length, n !== Object.keys(t).length) return !1;
    for (i = n; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, s[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var l = s[i];
      if (!A(e[l], t[l])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}, sv = { exports: {} }, gi = sv.exports = function(A, e, t) {
  typeof e == "function" && (t = e, e = {}), t = e.cb || t;
  var n = typeof t == "function" ? t : t.pre || function() {
  }, i = t.post || function() {
  };
  Sl(e, n, i, A, "", A);
};
gi.keywords = {
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
gi.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
gi.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
gi.skipKeywords = {
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
function Sl(A, e, t, n, i, s, l, f, c, h) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, i, s, l, f, c, h);
    for (var w in n) {
      var B = n[w];
      if (Array.isArray(B)) {
        if (w in gi.arrayKeywords)
          for (var p = 0; p < B.length; p++)
            Sl(A, e, t, B[p], i + "/" + w + "/" + p, s, i, w, n, p);
      } else if (w in gi.propsKeywords) {
        if (B && typeof B == "object")
          for (var v in B)
            Sl(A, e, t, B[v], i + "/" + w + "/" + y1(v), s, i, w, n, v);
      } else (w in gi.keywords || A.allKeys && !(w in gi.skipKeywords)) && Sl(A, e, t, B, i + "/" + w, s, i, w, n);
    }
    t(n, i, s, l, f, c, h);
  }
}
function y1(A) {
  return A.replace(/~/g, "~0").replace(/\//g, "~1");
}
var C1 = sv.exports;
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.getSchemaRefs = Qt.resolveUrl = Qt.normalizeId = Qt._getFullPath = Qt.getFullPath = Qt.inlineRef = void 0;
const Q1 = kA, F1 = ov, U1 = C1, E1 = /* @__PURE__ */ new Set([
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
function b1(A, e = !0) {
  return typeof A == "boolean" ? !0 : e === !0 ? !Rh(A) : e ? uv(A) <= e : !1;
}
Qt.inlineRef = b1;
const _1 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Rh(A) {
  for (const e in A) {
    if (_1.has(e))
      return !0;
    const t = A[e];
    if (Array.isArray(t) && t.some(Rh) || typeof t == "object" && Rh(t))
      return !0;
  }
  return !1;
}
function uv(A) {
  let e = 0;
  for (const t in A) {
    if (t === "$ref")
      return 1 / 0;
    if (e++, !E1.has(t) && (typeof A[t] == "object" && (0, Q1.eachItem)(A[t], (n) => e += uv(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function lv(A, e = "", t) {
  t !== !1 && (e = qa(e));
  const n = A.parse(e);
  return cv(A, n);
}
Qt.getFullPath = lv;
function cv(A, e) {
  return A.serialize(e).split("#")[0] + "#";
}
Qt._getFullPath = cv;
const x1 = /#\/?$/;
function qa(A) {
  return A ? A.replace(x1, "") : "";
}
Qt.normalizeId = qa;
function I1(A, e, t) {
  return t = qa(t), A.resolve(e, t);
}
Qt.resolveUrl = I1;
const H1 = /^[a-z_][-a-z0-9._]*$/i;
function S1(A, e) {
  if (typeof A == "boolean")
    return {};
  const { schemaId: t, uriResolver: n } = this.opts, i = qa(A[t] || e), s = { "": i }, l = lv(n, i, !1), f = {}, c = /* @__PURE__ */ new Set();
  return U1(A, { allKeys: !0 }, (B, p, v, o) => {
    if (o === void 0)
      return;
    const C = l + p;
    let F = s[o];
    typeof B[t] == "string" && (F = U.call(this, B[t])), S.call(this, B.$anchor), S.call(this, B.$dynamicAnchor), s[p] = F;
    function U(O) {
      const b = this.opts.uriResolver.resolve;
      if (O = qa(F ? b(F, O) : O), c.has(O))
        throw w(O);
      c.add(O);
      let P = this.refs[O];
      return typeof P == "string" && (P = this.refs[P]), typeof P == "object" ? h(B, P.schema, O) : O !== qa(C) && (O[0] === "#" ? (h(B, f[O], O), f[O] = B) : this.refs[O] = C), O;
    }
    function S(O) {
      if (typeof O == "string") {
        if (!H1.test(O))
          throw new Error(`invalid anchor "${O}"`);
        U.call(this, `#${O}`);
      }
    }
  }), f;
  function h(B, p, v) {
    if (p !== void 0 && !F1(B, p))
      throw w(v);
  }
  function w(B) {
    return new Error(`reference "${B}" resolves to more than one schema`);
  }
}
Qt.getSchemaRefs = S1;
var KB;
function Cc() {
  if (KB) return Sr;
  KB = 1, Object.defineProperty(Sr, "__esModule", { value: !0 }), Sr.getData = Sr.KeywordCxt = Sr.validateFunctionCode = void 0;
  const A = Wb(), e = ct, t = ev(), n = ct, i = o1(), s = m1(), l = v1(), f = ye, c = cr, h = Qt, w = kA, B = yc();
  function p(q) {
    if (P(q) && (j(q), b(q))) {
      F(q);
      return;
    }
    v(q, () => (0, A.topBoolOrEmptySchema)(q));
  }
  Sr.validateFunctionCode = p;
  function v({ gen: q, validateName: X, schema: G, schemaEnv: tA, opts: cA }, DA) {
    cA.code.es5 ? q.func(X, (0, f._)`${c.default.data}, ${c.default.valCxt}`, tA.$async, () => {
      q.code((0, f._)`"use strict"; ${S(G, cA)}`), C(q, cA), q.code(DA);
    }) : q.func(X, (0, f._)`${c.default.data}, ${o(cA)}`, tA.$async, () => q.code(S(G, cA)).code(DA));
  }
  function o(q) {
    return (0, f._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${q.dynamicRef ? (0, f._)`, ${c.default.dynamicAnchors}={}` : f.nil}}={}`;
  }
  function C(q, X) {
    q.if(c.default.valCxt, () => {
      q.var(c.default.instancePath, (0, f._)`${c.default.valCxt}.${c.default.instancePath}`), q.var(c.default.parentData, (0, f._)`${c.default.valCxt}.${c.default.parentData}`), q.var(c.default.parentDataProperty, (0, f._)`${c.default.valCxt}.${c.default.parentDataProperty}`), q.var(c.default.rootData, (0, f._)`${c.default.valCxt}.${c.default.rootData}`), X.dynamicRef && q.var(c.default.dynamicAnchors, (0, f._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      q.var(c.default.instancePath, (0, f._)`""`), q.var(c.default.parentData, (0, f._)`undefined`), q.var(c.default.parentDataProperty, (0, f._)`undefined`), q.var(c.default.rootData, c.default.data), X.dynamicRef && q.var(c.default.dynamicAnchors, (0, f._)`{}`);
    });
  }
  function F(q) {
    const { schema: X, opts: G, gen: tA } = q;
    v(q, () => {
      G.$comment && X.$comment && bA(q), mA(q), tA.let(c.default.vErrors, null), tA.let(c.default.errors, 0), G.unevaluated && U(q), dA(q), z(q);
    });
  }
  function U(q) {
    const { gen: X, validateName: G } = q;
    q.evaluated = X.const("evaluated", (0, f._)`${G}.evaluated`), X.if((0, f._)`${q.evaluated}.dynamicProps`, () => X.assign((0, f._)`${q.evaluated}.props`, (0, f._)`undefined`)), X.if((0, f._)`${q.evaluated}.dynamicItems`, () => X.assign((0, f._)`${q.evaluated}.items`, (0, f._)`undefined`));
  }
  function S(q, X) {
    const G = typeof q == "object" && q[X.schemaId];
    return G && (X.code.source || X.code.process) ? (0, f._)`/*# sourceURL=${G} */` : f.nil;
  }
  function O(q, X) {
    if (P(q) && (j(q), b(q))) {
      R(q, X);
      return;
    }
    (0, A.boolOrEmptySchema)(q, X);
  }
  function b({ schema: q, self: X }) {
    if (typeof q == "boolean")
      return !q;
    for (const G in q)
      if (X.RULES.all[G])
        return !0;
    return !1;
  }
  function P(q) {
    return typeof q.schema != "boolean";
  }
  function R(q, X) {
    const { schema: G, gen: tA, opts: cA } = q;
    cA.$comment && G.$comment && bA(q), FA(q), NA(q);
    const DA = tA.const("_errs", c.default.errors);
    dA(q, DA), tA.var(X, (0, f._)`${DA} === ${c.default.errors}`);
  }
  function j(q) {
    (0, w.checkUnknownRules)(q), fA(q);
  }
  function dA(q, X) {
    if (q.opts.jtd)
      return aA(q, [], !1, X);
    const G = (0, e.getSchemaTypes)(q.schema), tA = (0, e.coerceAndCheckDataType)(q, G);
    aA(q, G, !tA, X);
  }
  function fA(q) {
    const { schema: X, errSchemaPath: G, opts: tA, self: cA } = q;
    X.$ref && tA.ignoreKeywordsWithRef && (0, w.schemaHasRulesButRef)(X, cA.RULES) && cA.logger.warn(`$ref: keywords ignored in schema at path "${G}"`);
  }
  function mA(q) {
    const { schema: X, opts: G } = q;
    X.default !== void 0 && G.useDefaults && G.strictSchema && (0, w.checkStrictMode)(q, "default is ignored in the schema root");
  }
  function FA(q) {
    const X = q.schema[q.opts.schemaId];
    X && (q.baseId = (0, h.resolveUrl)(q.opts.uriResolver, q.baseId, X));
  }
  function NA(q) {
    if (q.schema.$async && !q.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function bA({ gen: q, schemaEnv: X, schema: G, errSchemaPath: tA, opts: cA }) {
    const DA = G.$comment;
    if (cA.$comment === !0)
      q.code((0, f._)`${c.default.self}.logger.log(${DA})`);
    else if (typeof cA.$comment == "function") {
      const YA = (0, f.str)`${tA}/$comment`, ue = q.scopeValue("root", { ref: X.root });
      q.code((0, f._)`${c.default.self}.opts.$comment(${DA}, ${YA}, ${ue}.schema)`);
    }
  }
  function z(q) {
    const { gen: X, schemaEnv: G, validateName: tA, ValidationError: cA, opts: DA } = q;
    G.$async ? X.if((0, f._)`${c.default.errors} === 0`, () => X.return(c.default.data), () => X.throw((0, f._)`new ${cA}(${c.default.vErrors})`)) : (X.assign((0, f._)`${tA}.errors`, c.default.vErrors), DA.unevaluated && QA(q), X.return((0, f._)`${c.default.errors} === 0`));
  }
  function QA({ gen: q, evaluated: X, props: G, items: tA }) {
    G instanceof f.Name && q.assign((0, f._)`${X}.props`, G), tA instanceof f.Name && q.assign((0, f._)`${X}.items`, tA);
  }
  function aA(q, X, G, tA) {
    const { gen: cA, schema: DA, data: YA, allErrors: ue, opts: xe, self: he } = q, { RULES: de } = he;
    if (DA.$ref && (xe.ignoreKeywordsWithRef || !(0, w.schemaHasRulesButRef)(DA, de))) {
      cA.block(() => _A(q, "$ref", de.all.$ref.definition));
      return;
    }
    xe.jtd || HA(q, X), cA.block(() => {
      for (const fe of de.rules)
        De(fe);
      De(de.post);
    });
    function De(fe) {
      (0, t.shouldUseGroup)(DA, fe) && (fe.type ? (cA.if((0, n.checkDataType)(fe.type, YA, xe.strictNumbers)), BA(q, fe), X.length === 1 && X[0] === fe.type && G && (cA.else(), (0, n.reportTypeError)(q)), cA.endIf()) : BA(q, fe), ue || cA.if((0, f._)`${c.default.errors} === ${tA || 0}`));
    }
  }
  function BA(q, X) {
    const { gen: G, schema: tA, opts: { useDefaults: cA } } = q;
    cA && (0, i.assignDefaults)(q, X.type), G.block(() => {
      for (const DA of X.rules)
        (0, t.shouldUseRule)(tA, DA) && _A(q, DA.keyword, DA.definition, X.type);
    });
  }
  function HA(q, X) {
    q.schemaEnv.meta || !q.opts.strictTypes || (SA(q, X), q.opts.allowUnionTypes || lA(q, X), D(q, q.dataTypes));
  }
  function SA(q, X) {
    if (X.length) {
      if (!q.dataTypes.length) {
        q.dataTypes = X;
        return;
      }
      X.forEach((G) => {
        Y(q.dataTypes, G) || k(q, `type "${G}" not allowed by context "${q.dataTypes.join(",")}"`);
      }), L(q, X);
    }
  }
  function lA(q, X) {
    X.length > 1 && !(X.length === 2 && X.includes("null")) && k(q, "use allowUnionTypes to allow union type keyword");
  }
  function D(q, X) {
    const G = q.self.RULES.all;
    for (const tA in G) {
      const cA = G[tA];
      if (typeof cA == "object" && (0, t.shouldUseRule)(q.schema, cA)) {
        const { type: DA } = cA.definition;
        DA.length && !DA.some((YA) => iA(X, YA)) && k(q, `missing type "${DA.join(",")}" for keyword "${tA}"`);
      }
    }
  }
  function iA(q, X) {
    return q.includes(X) || X === "number" && q.includes("integer");
  }
  function Y(q, X) {
    return q.includes(X) || X === "integer" && q.includes("number");
  }
  function L(q, X) {
    const G = [];
    for (const tA of q.dataTypes)
      Y(X, tA) ? G.push(tA) : X.includes("integer") && tA === "number" && G.push("integer");
    q.dataTypes = G;
  }
  function k(q, X) {
    const G = q.schemaEnv.baseId + q.errSchemaPath;
    X += ` at "${G}" (strictTypes)`, (0, w.checkStrictMode)(q, X, q.opts.strictTypes);
  }
  class oA {
    constructor(X, G, tA) {
      if ((0, s.validateKeywordUsage)(X, G, tA), this.gen = X.gen, this.allErrors = X.allErrors, this.keyword = tA, this.data = X.data, this.schema = X.schema[tA], this.$data = G.$data && X.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, w.schemaRefOrVal)(X, this.schema, tA, this.$data), this.schemaType = G.schemaType, this.parentSchema = X.schema, this.params = {}, this.it = X, this.def = G, this.$data)
        this.schemaCode = X.gen.const("vSchema", jA(this.$data, X));
      else if (this.schemaCode = this.schemaValue, !(0, s.validSchemaType)(this.schema, G.schemaType, G.allowUndefined))
        throw new Error(`${tA} value must be ${JSON.stringify(G.schemaType)}`);
      ("code" in G ? G.trackErrors : G.errors !== !1) && (this.errsCount = X.gen.const("_errs", c.default.errors));
    }
    result(X, G, tA) {
      this.failResult((0, f.not)(X), G, tA);
    }
    failResult(X, G, tA) {
      this.gen.if(X), tA ? tA() : this.error(), G ? (this.gen.else(), G(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(X, G) {
      this.failResult((0, f.not)(X), void 0, G);
    }
    fail(X) {
      if (X === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(X), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(X) {
      if (!this.$data)
        return this.fail(X);
      const { schemaCode: G } = this;
      this.fail((0, f._)`${G} !== undefined && (${(0, f.or)(this.invalid$data(), X)})`);
    }
    error(X, G, tA) {
      if (G) {
        this.setParams(G), this._error(X, tA), this.setParams({});
        return;
      }
      this._error(X, tA);
    }
    _error(X, G) {
      (X ? B.reportExtraError : B.reportError)(this, this.def.error, G);
    }
    $dataError() {
      (0, B.reportError)(this, this.def.$dataError || B.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, B.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(X) {
      this.allErrors || this.gen.if(X);
    }
    setParams(X, G) {
      G ? Object.assign(this.params, X) : this.params = X;
    }
    block$data(X, G, tA = f.nil) {
      this.gen.block(() => {
        this.check$data(X, tA), G();
      });
    }
    check$data(X = f.nil, G = f.nil) {
      if (!this.$data)
        return;
      const { gen: tA, schemaCode: cA, schemaType: DA, def: YA } = this;
      tA.if((0, f.or)((0, f._)`${cA} === undefined`, G)), X !== f.nil && tA.assign(X, !0), (DA.length || YA.validateSchema) && (tA.elseIf(this.invalid$data()), this.$dataError(), X !== f.nil && tA.assign(X, !1)), tA.else();
    }
    invalid$data() {
      const { gen: X, schemaCode: G, schemaType: tA, def: cA, it: DA } = this;
      return (0, f.or)(YA(), ue());
      function YA() {
        if (tA.length) {
          if (!(G instanceof f.Name))
            throw new Error("ajv implementation error");
          const xe = Array.isArray(tA) ? tA : [tA];
          return (0, f._)`${(0, n.checkDataTypes)(xe, G, DA.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return f.nil;
      }
      function ue() {
        if (cA.validateSchema) {
          const xe = X.scopeValue("validate$data", { ref: cA.validateSchema });
          return (0, f._)`!${xe}(${G})`;
        }
        return f.nil;
      }
    }
    subschema(X, G) {
      const tA = (0, l.getSubschema)(this.it, X);
      (0, l.extendSubschemaData)(tA, this.it, X), (0, l.extendSubschemaMode)(tA, X);
      const cA = { ...this.it, ...tA, items: void 0, props: void 0 };
      return O(cA, G), cA;
    }
    mergeEvaluated(X, G) {
      const { it: tA, gen: cA } = this;
      tA.opts.unevaluated && (tA.props !== !0 && X.props !== void 0 && (tA.props = w.mergeEvaluated.props(cA, X.props, tA.props, G)), tA.items !== !0 && X.items !== void 0 && (tA.items = w.mergeEvaluated.items(cA, X.items, tA.items, G)));
    }
    mergeValidEvaluated(X, G) {
      const { it: tA, gen: cA } = this;
      if (tA.opts.unevaluated && (tA.props !== !0 || tA.items !== !0))
        return cA.if(G, () => this.mergeEvaluated(X, f.Name)), !0;
    }
  }
  Sr.KeywordCxt = oA;
  function _A(q, X, G, tA) {
    const cA = new oA(q, G, X);
    "code" in G ? G.code(cA, tA) : cA.$data && G.validate ? (0, s.funcKeywordCode)(cA, G) : "macro" in G ? (0, s.macroKeywordCode)(cA, G) : (G.compile || G.validate) && (0, s.funcKeywordCode)(cA, G);
  }
  const IA = /^\/(?:[^~]|~0|~1)*$/, JA = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function jA(q, { dataLevel: X, dataNames: G, dataPathArr: tA }) {
    let cA, DA;
    if (q === "")
      return c.default.rootData;
    if (q[0] === "/") {
      if (!IA.test(q))
        throw new Error(`Invalid JSON-pointer: ${q}`);
      cA = q, DA = c.default.rootData;
    } else {
      const he = JA.exec(q);
      if (!he)
        throw new Error(`Invalid JSON-pointer: ${q}`);
      const de = +he[1];
      if (cA = he[2], cA === "#") {
        if (de >= X)
          throw new Error(xe("property/index", de));
        return tA[X - de];
      }
      if (de > X)
        throw new Error(xe("data", de));
      if (DA = G[X - de], !cA)
        return DA;
    }
    let YA = DA;
    const ue = cA.split("/");
    for (const he of ue)
      he && (DA = (0, f._)`${DA}${(0, f.getProperty)((0, w.unescapeJsonPointer)(he))}`, YA = (0, f._)`${YA} && ${DA}`);
    return YA;
    function xe(he, de) {
      return `Cannot access ${he} ${de} levels up, current level is ${X}`;
    }
  }
  return Sr.getData = jA, Sr;
}
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
class L1 extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
Ts.default = L1;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const nh = Qt;
class T1 extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`), this.missingRef = (0, nh.resolveUrl)(e, t, n), this.missingSchema = (0, nh.normalizeId)((0, nh.getFullPath)(e, this.missingRef));
  }
}
so.default = T1;
var Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.resolveSchema = Yt.getCompilingSchema = Yt.resolveRef = Yt.compileSchema = Yt.SchemaEnv = void 0;
const Kn = ye, D1 = Ts, $i = cr, Vn = Qt, RB = kA, O1 = Cc();
class Qc {
  constructor(e) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (t = e.baseId) !== null && t !== void 0 ? t : (0, Vn.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Yt.SchemaEnv = Qc;
function Kd(A) {
  const e = fv.call(this, A);
  if (e)
    return e;
  const t = (0, Vn.getFullPath)(this.opts.uriResolver, A.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, l = new Kn.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let f;
  A.$async && (f = l.scopeValue("Error", {
    ref: D1.default,
    code: (0, Kn._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = l.scopeName("validate");
  A.validateName = c;
  const h = {
    gen: l,
    allErrors: this.opts.allErrors,
    data: $i.default.data,
    parentData: $i.default.parentData,
    parentDataProperty: $i.default.parentDataProperty,
    dataNames: [$i.default.data],
    dataPathArr: [Kn.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: l.scopeValue("schema", this.opts.code.source === !0 ? { ref: A.schema, code: (0, Kn.stringify)(A.schema) } : { ref: A.schema }),
    validateName: c,
    ValidationError: f,
    schema: A.schema,
    schemaEnv: A,
    rootId: t,
    baseId: A.baseId || t,
    schemaPath: Kn.nil,
    errSchemaPath: A.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Kn._)`""`,
    opts: this.opts,
    self: this
  };
  let w;
  try {
    this._compilations.add(A), (0, O1.validateFunctionCode)(h), l.optimize(this.opts.code.optimize);
    const B = l.toString();
    w = `${l.scopeRefs($i.default.scope)}return ${B}`, this.opts.code.process && (w = this.opts.code.process(w, A));
    const v = new Function(`${$i.default.self}`, `${$i.default.scope}`, w)(this, this.scope.get());
    if (this.scope.value(c, { ref: v }), v.errors = null, v.schema = A.schema, v.schemaEnv = A, A.$async && (v.$async = !0), this.opts.code.source === !0 && (v.source = { validateName: c, validateCode: B, scopeValues: l._values }), this.opts.unevaluated) {
      const { props: o, items: C } = h;
      v.evaluated = {
        props: o instanceof Kn.Name ? void 0 : o,
        items: C instanceof Kn.Name ? void 0 : C,
        dynamicProps: o instanceof Kn.Name,
        dynamicItems: C instanceof Kn.Name
      }, v.source && (v.source.evaluated = (0, Kn.stringify)(v.evaluated));
    }
    return A.validate = v, A;
  } catch (B) {
    throw delete A.validate, delete A.validateName, w && this.logger.error("Error compiling schema, function code:", w), B;
  } finally {
    this._compilations.delete(A);
  }
}
Yt.compileSchema = Kd;
function N1(A, e, t) {
  var n;
  t = (0, Vn.resolveUrl)(this.opts.uriResolver, e, t);
  const i = A.refs[t];
  if (i)
    return i;
  let s = K1.call(this, A, t);
  if (s === void 0) {
    const l = (n = A.localRefs) === null || n === void 0 ? void 0 : n[t], { schemaId: f } = this.opts;
    l && (s = new Qc({ schema: l, schemaId: f, root: A, baseId: e }));
  }
  if (s !== void 0)
    return A.refs[t] = M1.call(this, s);
}
Yt.resolveRef = N1;
function M1(A) {
  return (0, Vn.inlineRef)(A.schema, this.opts.inlineRefs) ? A.schema : A.validate ? A : Kd.call(this, A);
}
function fv(A) {
  for (const e of this._compilations)
    if (P1(e, A))
      return e;
}
Yt.getCompilingSchema = fv;
function P1(A, e) {
  return A.schema === e.schema && A.root === e.root && A.baseId === e.baseId;
}
function K1(A, e) {
  let t;
  for (; typeof (t = this.refs[e]) == "string"; )
    e = t;
  return t || this.schemas[e] || Fc.call(this, A, e);
}
function Fc(A, e) {
  const t = this.opts.uriResolver.parse(e), n = (0, Vn._getFullPath)(this.opts.uriResolver, t);
  let i = (0, Vn.getFullPath)(this.opts.uriResolver, A.baseId, void 0);
  if (Object.keys(A.schema).length > 0 && n === i)
    return rh.call(this, t, A);
  const s = (0, Vn.normalizeId)(n), l = this.refs[s] || this.schemas[s];
  if (typeof l == "string") {
    const f = Fc.call(this, A, l);
    return typeof (f == null ? void 0 : f.schema) != "object" ? void 0 : rh.call(this, t, f);
  }
  if (typeof (l == null ? void 0 : l.schema) == "object") {
    if (l.validate || Kd.call(this, l), s === (0, Vn.normalizeId)(e)) {
      const { schema: f } = l, { schemaId: c } = this.opts, h = f[c];
      return h && (i = (0, Vn.resolveUrl)(this.opts.uriResolver, i, h)), new Qc({ schema: f, schemaId: c, root: A, baseId: i });
    }
    return rh.call(this, t, l);
  }
}
Yt.resolveSchema = Fc;
const R1 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function rh(A, { baseId: e, schema: t, root: n }) {
  var i;
  if (((i = A.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const f of A.fragment.slice(1).split("/")) {
    if (typeof t == "boolean")
      return;
    const c = t[(0, RB.unescapeFragment)(f)];
    if (c === void 0)
      return;
    t = c;
    const h = typeof t == "object" && t[this.opts.schemaId];
    !R1.has(f) && h && (e = (0, Vn.resolveUrl)(this.opts.uriResolver, e, h));
  }
  let s;
  if (typeof t != "boolean" && t.$ref && !(0, RB.schemaHasRulesButRef)(t, this.RULES)) {
    const f = (0, Vn.resolveUrl)(this.opts.uriResolver, e, t.$ref);
    s = Fc.call(this, n, f);
  }
  const { schemaId: l } = this.opts;
  if (s = s || new Qc({ schema: t, schemaId: l, root: n, baseId: e }), s.schema !== s.root.schema)
    return s;
}
const k1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", $1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", G1 = "object", V1 = [
  "$data"
], W1 = {
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
}, X1 = !1, q1 = {
  $id: k1,
  description: $1,
  type: G1,
  required: V1,
  properties: W1,
  additionalProperties: X1
};
var Rd = {}, Uc = { exports: {} };
const z1 = {
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
var J1 = {
  HEX: z1
};
const { HEX: j1 } = J1;
function hv(A) {
  if (pv(A, ".") < 3)
    return { host: A, isIPV4: !1 };
  const e = A.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u) || [], [t] = e;
  return t ? { host: Z1(t, "."), isIPV4: !0 } : { host: A, isIPV4: !1 };
}
function kh(A, e = !1) {
  let t = "", n = !0;
  for (const i of A) {
    if (j1[i] === void 0) return;
    i !== "0" && n === !0 && (n = !1), n || (t += i);
  }
  return e && t.length === 0 && (t = "0"), t;
}
function Y1(A) {
  let e = 0;
  const t = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, l = !1, f = !1;
  function c() {
    if (i.length) {
      if (s === !1) {
        const h = kh(i);
        if (h !== void 0)
          n.push(h);
        else
          return t.error = !0, !1;
      }
      i.length = 0;
    }
    return !0;
  }
  for (let h = 0; h < A.length; h++) {
    const w = A[h];
    if (!(w === "[" || w === "]"))
      if (w === ":") {
        if (l === !0 && (f = !0), !c())
          break;
        if (e++, n.push(":"), e > 7) {
          t.error = !0;
          break;
        }
        h - 1 >= 0 && A[h - 1] === ":" && (l = !0);
        continue;
      } else if (w === "%") {
        if (!c())
          break;
        s = !0;
      } else {
        i.push(w);
        continue;
      }
  }
  return i.length && (s ? t.zone = i.join("") : f ? n.push(i.join("")) : n.push(kh(i))), t.address = n.join(""), t;
}
function dv(A, e = {}) {
  if (pv(A, ":") < 2)
    return { host: A, isIPV6: !1 };
  const t = Y1(A);
  if (t.error)
    return { host: A, isIPV6: !1 };
  {
    let n = t.address, i = t.address;
    return t.zone && (n += "%" + t.zone, i += "%25" + t.zone), { host: n, escapedHost: i, isIPV6: !0 };
  }
}
function Z1(A, e) {
  let t = "", n = !0;
  const i = A.length;
  for (let s = 0; s < i; s++) {
    const l = A[s];
    l === "0" && n ? (s + 1 <= i && A[s + 1] === e || s + 1 === i) && (t += l, n = !1) : (l === e ? n = !0 : n = !1, t += l);
  }
  return t;
}
function pv(A, e) {
  let t = 0;
  for (let n = 0; n < A.length; n++)
    A[n] === e && t++;
  return t;
}
const kB = /^\.\.?\//u, $B = /^\/\.(?:\/|$)/u, GB = /^\/\.\.(?:\/|$)/u, A_ = /^\/?(?:.|\n)*?(?=\/|$)/u;
function e_(A) {
  const e = [];
  for (; A.length; )
    if (A.match(kB))
      A = A.replace(kB, "");
    else if (A.match($B))
      A = A.replace($B, "/");
    else if (A.match(GB))
      A = A.replace(GB, "/"), e.pop();
    else if (A === "." || A === "..")
      A = "";
    else {
      const t = A.match(A_);
      if (t) {
        const n = t[0];
        A = A.slice(n.length), e.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return e.join("");
}
function t_(A, e) {
  const t = e !== !0 ? escape : unescape;
  return A.scheme !== void 0 && (A.scheme = t(A.scheme)), A.userinfo !== void 0 && (A.userinfo = t(A.userinfo)), A.host !== void 0 && (A.host = t(A.host)), A.path !== void 0 && (A.path = t(A.path)), A.query !== void 0 && (A.query = t(A.query)), A.fragment !== void 0 && (A.fragment = t(A.fragment)), A;
}
function n_(A, e) {
  const t = [];
  if (A.userinfo !== void 0 && (t.push(A.userinfo), t.push("@")), A.host !== void 0) {
    let n = unescape(A.host);
    const i = hv(n);
    if (i.isIPV4)
      n = i.host;
    else {
      const s = dv(i.host, { isIPV4: !1 });
      s.isIPV6 === !0 ? n = `[${s.escapedHost}]` : n = A.host;
    }
    t.push(n);
  }
  return (typeof A.port == "number" || typeof A.port == "string") && (t.push(":"), t.push(String(A.port))), t.length ? t.join("") : void 0;
}
var r_ = {
  recomposeAuthority: n_,
  normalizeComponentEncoding: t_,
  removeDotSegments: e_,
  normalizeIPv4: hv,
  normalizeIPv6: dv,
  stringArrayToHexStripped: kh
};
const i_ = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, a_ = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function gv(A) {
  return typeof A.secure == "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss";
}
function Bv(A) {
  return A.host || (A.error = A.error || "HTTP URIs must have a host."), A;
}
function wv(A) {
  const e = String(A.scheme).toLowerCase() === "https";
  return (A.port === (e ? 443 : 80) || A.port === "") && (A.port = void 0), A.path || (A.path = "/"), A;
}
function o_(A) {
  return A.secure = gv(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A;
}
function s_(A) {
  if ((A.port === (gv(A) ? 443 : 80) || A.port === "") && (A.port = void 0), typeof A.secure == "boolean" && (A.scheme = A.secure ? "wss" : "ws", A.secure = void 0), A.resourceName) {
    const [e, t] = A.resourceName.split("?");
    A.path = e && e !== "/" ? e : void 0, A.query = t, A.resourceName = void 0;
  }
  return A.fragment = void 0, A;
}
function u_(A, e) {
  if (!A.path)
    return A.error = "URN can not be parsed", A;
  const t = A.path.match(a_);
  if (t) {
    const n = e.scheme || A.scheme || "urn";
    A.nid = t[1].toLowerCase(), A.nss = t[2];
    const i = `${n}:${e.nid || A.nid}`, s = kd[i];
    A.path = void 0, s && (A = s.parse(A, e));
  } else
    A.error = A.error || "URN can not be parsed.";
  return A;
}
function l_(A, e) {
  const t = e.scheme || A.scheme || "urn", n = A.nid.toLowerCase(), i = `${t}:${e.nid || n}`, s = kd[i];
  s && (A = s.serialize(A, e));
  const l = A, f = A.nss;
  return l.path = `${n || e.nid}:${f}`, e.skipEscape = !0, l;
}
function c_(A, e) {
  const t = A;
  return t.uuid = t.nss, t.nss = void 0, !e.tolerant && (!t.uuid || !i_.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
}
function f_(A) {
  const e = A;
  return e.nss = (A.uuid || "").toLowerCase(), e;
}
const mv = {
  scheme: "http",
  domainHost: !0,
  parse: Bv,
  serialize: wv
}, h_ = {
  scheme: "https",
  domainHost: mv.domainHost,
  parse: Bv,
  serialize: wv
}, Ll = {
  scheme: "ws",
  domainHost: !0,
  parse: o_,
  serialize: s_
}, d_ = {
  scheme: "wss",
  domainHost: Ll.domainHost,
  parse: Ll.parse,
  serialize: Ll.serialize
}, p_ = {
  scheme: "urn",
  parse: u_,
  serialize: l_,
  skipNormalize: !0
}, g_ = {
  scheme: "urn:uuid",
  parse: c_,
  serialize: f_,
  skipNormalize: !0
}, kd = {
  http: mv,
  https: h_,
  ws: Ll,
  wss: d_,
  urn: p_,
  "urn:uuid": g_
};
var B_ = kd;
const { normalizeIPv6: w_, normalizeIPv4: m_, removeDotSegments: Zo, recomposeAuthority: v_, normalizeComponentEncoding: qu } = r_, $d = B_;
function y_(A, e) {
  return typeof A == "string" ? A = or(Rr(A, e), e) : typeof A == "object" && (A = Rr(or(A, e), e)), A;
}
function C_(A, e, t) {
  const n = Object.assign({ scheme: "null" }, t), i = vv(Rr(A, n), Rr(e, n), n, !0);
  return or(i, { ...n, skipEscape: !0 });
}
function vv(A, e, t, n) {
  const i = {};
  return n || (A = Rr(or(A, t), t), e = Rr(or(e, t), t)), t = t || {}, !t.tolerant && e.scheme ? (i.scheme = e.scheme, i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = Zo(e.path || ""), i.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = Zo(e.path || ""), i.query = e.query) : (e.path ? (e.path.charAt(0) === "/" ? i.path = Zo(e.path) : ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path ? i.path = "/" + e.path : A.path ? i.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + e.path : i.path = e.path, i.path = Zo(i.path)), i.query = e.query) : (i.path = A.path, e.query !== void 0 ? i.query = e.query : i.query = A.query), i.userinfo = A.userinfo, i.host = A.host, i.port = A.port), i.scheme = A.scheme), i.fragment = e.fragment, i;
}
function Q_(A, e, t) {
  return typeof A == "string" ? (A = unescape(A), A = or(qu(Rr(A, t), !0), { ...t, skipEscape: !0 })) : typeof A == "object" && (A = or(qu(A, !0), { ...t, skipEscape: !0 })), typeof e == "string" ? (e = unescape(e), e = or(qu(Rr(e, t), !0), { ...t, skipEscape: !0 })) : typeof e == "object" && (e = or(qu(e, !0), { ...t, skipEscape: !0 })), A.toLowerCase() === e.toLowerCase();
}
function or(A, e) {
  const t = {
    host: A.host,
    scheme: A.scheme,
    userinfo: A.userinfo,
    port: A.port,
    path: A.path,
    query: A.query,
    nid: A.nid,
    nss: A.nss,
    uuid: A.uuid,
    fragment: A.fragment,
    reference: A.reference,
    resourceName: A.resourceName,
    secure: A.secure,
    error: ""
  }, n = Object.assign({}, e), i = [], s = $d[(n.scheme || t.scheme || "").toLowerCase()];
  s && s.serialize && s.serialize(t, n), t.path !== void 0 && (n.skipEscape ? t.path = unescape(t.path) : (t.path = escape(t.path), t.scheme !== void 0 && (t.path = t.path.split("%3A").join(":")))), n.reference !== "suffix" && t.scheme && (i.push(t.scheme), i.push(":"));
  const l = v_(t, n);
  if (l !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(l), t.path && t.path.charAt(0) !== "/" && i.push("/")), t.path !== void 0) {
    let f = t.path;
    !n.absolutePath && (!s || !s.absolutePath) && (f = Zo(f)), l === void 0 && (f = f.replace(/^\/\//u, "/%2F")), i.push(f);
  }
  return t.query !== void 0 && (i.push("?"), i.push(t.query)), t.fragment !== void 0 && (i.push("#"), i.push(t.fragment)), i.join("");
}
const F_ = Array.from({ length: 127 }, (A, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
function U_(A) {
  let e = 0;
  for (let t = 0, n = A.length; t < n; ++t)
    if (e = A.charCodeAt(t), e > 126 || F_[e])
      return !0;
  return !1;
}
const E_ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Rr(A, e) {
  const t = Object.assign({}, e), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  }, i = A.indexOf("%") !== -1;
  let s = !1;
  t.reference === "suffix" && (A = (t.scheme ? t.scheme + ":" : "") + "//" + A);
  const l = A.match(E_);
  if (l) {
    if (n.scheme = l[1], n.userinfo = l[3], n.host = l[4], n.port = parseInt(l[5], 10), n.path = l[6] || "", n.query = l[7], n.fragment = l[8], isNaN(n.port) && (n.port = l[5]), n.host) {
      const c = m_(n.host);
      if (c.isIPV4 === !1) {
        const h = w_(c.host, { isIPV4: !1 });
        n.host = h.host.toLowerCase(), s = h.isIPV6;
      } else
        n.host = c.host, s = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && !n.path && n.query === void 0 ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
    const f = $d[(t.scheme || n.scheme || "").toLowerCase()];
    if (!t.unicodeSupport && (!f || !f.unicodeSupport) && n.host && (t.domainHost || f && f.domainHost) && s === !1 && U_(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (c) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + c;
      }
    (!f || f && !f.skipNormalize) && (i && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), i && n.userinfo !== void 0 && (n.userinfo = unescape(n.userinfo)), i && n.host !== void 0 && (n.host = unescape(n.host)), n.path !== void 0 && n.path.length && (n.path = escape(unescape(n.path))), n.fragment !== void 0 && n.fragment.length && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), f && f.parse && f.parse(n, t);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Gd = {
  SCHEMES: $d,
  normalize: y_,
  resolve: C_,
  resolveComponents: vv,
  equal: Q_,
  serialize: or,
  parse: Rr
};
Uc.exports = Gd;
Uc.exports.default = Gd;
Uc.exports.fastUri = Gd;
var b_ = Uc.exports;
Object.defineProperty(Rd, "__esModule", { value: !0 });
const yv = b_;
yv.code = 'require("ajv/dist/runtime/uri").default';
Rd.default = yv;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.CodeGen = A.Name = A.nil = A.stringify = A.str = A._ = A.KeywordCxt = void 0;
  var e = Cc();
  Object.defineProperty(A, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var t = ye;
  Object.defineProperty(A, "_", { enumerable: !0, get: function() {
    return t._;
  } }), Object.defineProperty(A, "str", { enumerable: !0, get: function() {
    return t.str;
  } }), Object.defineProperty(A, "stringify", { enumerable: !0, get: function() {
    return t.stringify;
  } }), Object.defineProperty(A, "nil", { enumerable: !0, get: function() {
    return t.nil;
  } }), Object.defineProperty(A, "Name", { enumerable: !0, get: function() {
    return t.Name;
  } }), Object.defineProperty(A, "CodeGen", { enumerable: !0, get: function() {
    return t.CodeGen;
  } });
  const n = Ts, i = so, s = ta, l = Yt, f = ye, c = Qt, h = ct, w = kA, B = q1, p = Rd, v = (lA, D) => new RegExp(lA, D);
  v.code = "new RegExp";
  const o = ["removeAdditional", "useDefaults", "coerceTypes"], C = /* @__PURE__ */ new Set([
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
  ]), F = {
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
  }, U = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, S = 200;
  function O(lA) {
    var D, iA, Y, L, k, oA, _A, IA, JA, jA, q, X, G, tA, cA, DA, YA, ue, xe, he, de, De, fe, Ot, Ut;
    const Nt = lA.strict, Et = (D = lA.code) === null || D === void 0 ? void 0 : D.optimize, Bt = Et === !0 || Et === void 0 ? 1 : Et || 0, ln = (Y = (iA = lA.code) === null || iA === void 0 ? void 0 : iA.regExp) !== null && Y !== void 0 ? Y : v, pr = (L = lA.uriResolver) !== null && L !== void 0 ? L : p.default;
    return {
      strictSchema: (oA = (k = lA.strictSchema) !== null && k !== void 0 ? k : Nt) !== null && oA !== void 0 ? oA : !0,
      strictNumbers: (IA = (_A = lA.strictNumbers) !== null && _A !== void 0 ? _A : Nt) !== null && IA !== void 0 ? IA : !0,
      strictTypes: (jA = (JA = lA.strictTypes) !== null && JA !== void 0 ? JA : Nt) !== null && jA !== void 0 ? jA : "log",
      strictTuples: (X = (q = lA.strictTuples) !== null && q !== void 0 ? q : Nt) !== null && X !== void 0 ? X : "log",
      strictRequired: (tA = (G = lA.strictRequired) !== null && G !== void 0 ? G : Nt) !== null && tA !== void 0 ? tA : !1,
      code: lA.code ? { ...lA.code, optimize: Bt, regExp: ln } : { optimize: Bt, regExp: ln },
      loopRequired: (cA = lA.loopRequired) !== null && cA !== void 0 ? cA : S,
      loopEnum: (DA = lA.loopEnum) !== null && DA !== void 0 ? DA : S,
      meta: (YA = lA.meta) !== null && YA !== void 0 ? YA : !0,
      messages: (ue = lA.messages) !== null && ue !== void 0 ? ue : !0,
      inlineRefs: (xe = lA.inlineRefs) !== null && xe !== void 0 ? xe : !0,
      schemaId: (he = lA.schemaId) !== null && he !== void 0 ? he : "$id",
      addUsedSchema: (de = lA.addUsedSchema) !== null && de !== void 0 ? de : !0,
      validateSchema: (De = lA.validateSchema) !== null && De !== void 0 ? De : !0,
      validateFormats: (fe = lA.validateFormats) !== null && fe !== void 0 ? fe : !0,
      unicodeRegExp: (Ot = lA.unicodeRegExp) !== null && Ot !== void 0 ? Ot : !0,
      int32range: (Ut = lA.int32range) !== null && Ut !== void 0 ? Ut : !0,
      uriResolver: pr
    };
  }
  class b {
    constructor(D = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), D = this.opts = { ...D, ...O(D) };
      const { es5: iA, lines: Y } = this.opts.code;
      this.scope = new f.ValueScope({ scope: {}, prefixes: C, es5: iA, lines: Y }), this.logger = NA(D.logger);
      const L = D.validateFormats;
      D.validateFormats = !1, this.RULES = (0, s.getRules)(), P.call(this, F, D, "NOT SUPPORTED"), P.call(this, U, D, "DEPRECATED", "warn"), this._metaOpts = mA.call(this), D.formats && dA.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), D.keywords && fA.call(this, D.keywords), typeof D.meta == "object" && this.addMetaSchema(D.meta), j.call(this), D.validateFormats = L;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: D, meta: iA, schemaId: Y } = this.opts;
      let L = B;
      Y === "id" && (L = { ...B }, L.id = L.$id, delete L.$id), iA && D && this.addMetaSchema(L, L[Y], !1);
    }
    defaultMeta() {
      const { meta: D, schemaId: iA } = this.opts;
      return this.opts.defaultMeta = typeof D == "object" ? D[iA] || D : void 0;
    }
    validate(D, iA) {
      let Y;
      if (typeof D == "string") {
        if (Y = this.getSchema(D), !Y)
          throw new Error(`no schema with key or ref "${D}"`);
      } else
        Y = this.compile(D);
      const L = Y(iA);
      return "$async" in Y || (this.errors = Y.errors), L;
    }
    compile(D, iA) {
      const Y = this._addSchema(D, iA);
      return Y.validate || this._compileSchemaEnv(Y);
    }
    compileAsync(D, iA) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: Y } = this.opts;
      return L.call(this, D, iA);
      async function L(jA, q) {
        await k.call(this, jA.$schema);
        const X = this._addSchema(jA, q);
        return X.validate || oA.call(this, X);
      }
      async function k(jA) {
        jA && !this.getSchema(jA) && await L.call(this, { $ref: jA }, !0);
      }
      async function oA(jA) {
        try {
          return this._compileSchemaEnv(jA);
        } catch (q) {
          if (!(q instanceof i.default))
            throw q;
          return _A.call(this, q), await IA.call(this, q.missingSchema), oA.call(this, jA);
        }
      }
      function _A({ missingSchema: jA, missingRef: q }) {
        if (this.refs[jA])
          throw new Error(`AnySchema ${jA} is loaded but ${q} cannot be resolved`);
      }
      async function IA(jA) {
        const q = await JA.call(this, jA);
        this.refs[jA] || await k.call(this, q.$schema), this.refs[jA] || this.addSchema(q, jA, iA);
      }
      async function JA(jA) {
        const q = this._loading[jA];
        if (q)
          return q;
        try {
          return await (this._loading[jA] = Y(jA));
        } finally {
          delete this._loading[jA];
        }
      }
    }
    // Adds schema to the instance
    addSchema(D, iA, Y, L = this.opts.validateSchema) {
      if (Array.isArray(D)) {
        for (const oA of D)
          this.addSchema(oA, void 0, Y, L);
        return this;
      }
      let k;
      if (typeof D == "object") {
        const { schemaId: oA } = this.opts;
        if (k = D[oA], k !== void 0 && typeof k != "string")
          throw new Error(`schema ${oA} must be string`);
      }
      return iA = (0, c.normalizeId)(iA || k), this._checkUnique(iA), this.schemas[iA] = this._addSchema(D, Y, iA, L, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(D, iA, Y = this.opts.validateSchema) {
      return this.addSchema(D, iA, !0, Y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(D, iA) {
      if (typeof D == "boolean")
        return !0;
      let Y;
      if (Y = D.$schema, Y !== void 0 && typeof Y != "string")
        throw new Error("$schema must be a string");
      if (Y = Y || this.opts.defaultMeta || this.defaultMeta(), !Y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const L = this.validate(Y, D);
      if (!L && iA) {
        const k = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(k);
        else
          throw new Error(k);
      }
      return L;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(D) {
      let iA;
      for (; typeof (iA = R.call(this, D)) == "string"; )
        D = iA;
      if (iA === void 0) {
        const { schemaId: Y } = this.opts, L = new l.SchemaEnv({ schema: {}, schemaId: Y });
        if (iA = l.resolveSchema.call(this, L, D), !iA)
          return;
        this.refs[D] = iA;
      }
      return iA.validate || this._compileSchemaEnv(iA);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(D) {
      if (D instanceof RegExp)
        return this._removeAllSchemas(this.schemas, D), this._removeAllSchemas(this.refs, D), this;
      switch (typeof D) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const iA = R.call(this, D);
          return typeof iA == "object" && this._cache.delete(iA.schema), delete this.schemas[D], delete this.refs[D], this;
        }
        case "object": {
          const iA = D;
          this._cache.delete(iA);
          let Y = D[this.opts.schemaId];
          return Y && (Y = (0, c.normalizeId)(Y), delete this.schemas[Y], delete this.refs[Y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(D) {
      for (const iA of D)
        this.addKeyword(iA);
      return this;
    }
    addKeyword(D, iA) {
      let Y;
      if (typeof D == "string")
        Y = D, typeof iA == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), iA.keyword = Y);
      else if (typeof D == "object" && iA === void 0) {
        if (iA = D, Y = iA.keyword, Array.isArray(Y) && !Y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (z.call(this, Y, iA), !iA)
        return (0, w.eachItem)(Y, (k) => QA.call(this, k)), this;
      BA.call(this, iA);
      const L = {
        ...iA,
        type: (0, h.getJSONTypes)(iA.type),
        schemaType: (0, h.getJSONTypes)(iA.schemaType)
      };
      return (0, w.eachItem)(Y, L.type.length === 0 ? (k) => QA.call(this, k, L) : (k) => L.type.forEach((oA) => QA.call(this, k, L, oA))), this;
    }
    getKeyword(D) {
      const iA = this.RULES.all[D];
      return typeof iA == "object" ? iA.definition : !!iA;
    }
    // Remove keyword
    removeKeyword(D) {
      const { RULES: iA } = this;
      delete iA.keywords[D], delete iA.all[D];
      for (const Y of iA.rules) {
        const L = Y.rules.findIndex((k) => k.keyword === D);
        L >= 0 && Y.rules.splice(L, 1);
      }
      return this;
    }
    // Add format
    addFormat(D, iA) {
      return typeof iA == "string" && (iA = new RegExp(iA)), this.formats[D] = iA, this;
    }
    errorsText(D = this.errors, { separator: iA = ", ", dataVar: Y = "data" } = {}) {
      return !D || D.length === 0 ? "No errors" : D.map((L) => `${Y}${L.instancePath} ${L.message}`).reduce((L, k) => L + iA + k);
    }
    $dataMetaSchema(D, iA) {
      const Y = this.RULES.all;
      D = JSON.parse(JSON.stringify(D));
      for (const L of iA) {
        const k = L.split("/").slice(1);
        let oA = D;
        for (const _A of k)
          oA = oA[_A];
        for (const _A in Y) {
          const IA = Y[_A];
          if (typeof IA != "object")
            continue;
          const { $data: JA } = IA.definition, jA = oA[_A];
          JA && jA && (oA[_A] = SA(jA));
        }
      }
      return D;
    }
    _removeAllSchemas(D, iA) {
      for (const Y in D) {
        const L = D[Y];
        (!iA || iA.test(Y)) && (typeof L == "string" ? delete D[Y] : L && !L.meta && (this._cache.delete(L.schema), delete D[Y]));
      }
    }
    _addSchema(D, iA, Y, L = this.opts.validateSchema, k = this.opts.addUsedSchema) {
      let oA;
      const { schemaId: _A } = this.opts;
      if (typeof D == "object")
        oA = D[_A];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof D != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let IA = this._cache.get(D);
      if (IA !== void 0)
        return IA;
      Y = (0, c.normalizeId)(oA || Y);
      const JA = c.getSchemaRefs.call(this, D, Y);
      return IA = new l.SchemaEnv({ schema: D, schemaId: _A, meta: iA, baseId: Y, localRefs: JA }), this._cache.set(IA.schema, IA), k && !Y.startsWith("#") && (Y && this._checkUnique(Y), this.refs[Y] = IA), L && this.validateSchema(D, !0), IA;
    }
    _checkUnique(D) {
      if (this.schemas[D] || this.refs[D])
        throw new Error(`schema with key or id "${D}" already exists`);
    }
    _compileSchemaEnv(D) {
      if (D.meta ? this._compileMetaSchema(D) : l.compileSchema.call(this, D), !D.validate)
        throw new Error("ajv implementation error");
      return D.validate;
    }
    _compileMetaSchema(D) {
      const iA = this.opts;
      this.opts = this._metaOpts;
      try {
        l.compileSchema.call(this, D);
      } finally {
        this.opts = iA;
      }
    }
  }
  b.ValidationError = n.default, b.MissingRefError = i.default, A.default = b;
  function P(lA, D, iA, Y = "error") {
    for (const L in lA) {
      const k = L;
      k in D && this.logger[Y](`${iA}: option ${L}. ${lA[k]}`);
    }
  }
  function R(lA) {
    return lA = (0, c.normalizeId)(lA), this.schemas[lA] || this.refs[lA];
  }
  function j() {
    const lA = this.opts.schemas;
    if (lA)
      if (Array.isArray(lA))
        this.addSchema(lA);
      else
        for (const D in lA)
          this.addSchema(lA[D], D);
  }
  function dA() {
    for (const lA in this.opts.formats) {
      const D = this.opts.formats[lA];
      D && this.addFormat(lA, D);
    }
  }
  function fA(lA) {
    if (Array.isArray(lA)) {
      this.addVocabulary(lA);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const D in lA) {
      const iA = lA[D];
      iA.keyword || (iA.keyword = D), this.addKeyword(iA);
    }
  }
  function mA() {
    const lA = { ...this.opts };
    for (const D of o)
      delete lA[D];
    return lA;
  }
  const FA = { log() {
  }, warn() {
  }, error() {
  } };
  function NA(lA) {
    if (lA === !1)
      return FA;
    if (lA === void 0)
      return console;
    if (lA.log && lA.warn && lA.error)
      return lA;
    throw new Error("logger must implement log, warn and error methods");
  }
  const bA = /^[a-z_$][a-z0-9_$:-]*$/i;
  function z(lA, D) {
    const { RULES: iA } = this;
    if ((0, w.eachItem)(lA, (Y) => {
      if (iA.keywords[Y])
        throw new Error(`Keyword ${Y} is already defined`);
      if (!bA.test(Y))
        throw new Error(`Keyword ${Y} has invalid name`);
    }), !!D && D.$data && !("code" in D || "validate" in D))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function QA(lA, D, iA) {
    var Y;
    const L = D == null ? void 0 : D.post;
    if (iA && L)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: k } = this;
    let oA = L ? k.post : k.rules.find(({ type: IA }) => IA === iA);
    if (oA || (oA = { type: iA, rules: [] }, k.rules.push(oA)), k.keywords[lA] = !0, !D)
      return;
    const _A = {
      keyword: lA,
      definition: {
        ...D,
        type: (0, h.getJSONTypes)(D.type),
        schemaType: (0, h.getJSONTypes)(D.schemaType)
      }
    };
    D.before ? aA.call(this, oA, _A, D.before) : oA.rules.push(_A), k.all[lA] = _A, (Y = D.implements) === null || Y === void 0 || Y.forEach((IA) => this.addKeyword(IA));
  }
  function aA(lA, D, iA) {
    const Y = lA.rules.findIndex((L) => L.keyword === iA);
    Y >= 0 ? lA.rules.splice(Y, 0, D) : (lA.rules.push(D), this.logger.warn(`rule ${iA} is not defined`));
  }
  function BA(lA) {
    let { metaSchema: D } = lA;
    D !== void 0 && (lA.$data && this.opts.$data && (D = SA(D)), lA.validateSchema = this.compile(D, !0));
  }
  const HA = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function SA(lA) {
    return { anyOf: [lA, HA] };
  }
})(zm);
var Vd = {}, Wd = {}, Xd = {};
Object.defineProperty(Xd, "__esModule", { value: !0 });
const __ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Xd.default = __;
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.callRef = na.getValidate = void 0;
const x_ = so, VB = ve, Jt = ye, Sa = cr, WB = Yt, zu = kA, I_ = {
  keyword: "$ref",
  schemaType: "string",
  code(A) {
    const { gen: e, schema: t, it: n } = A, { baseId: i, schemaEnv: s, validateName: l, opts: f, self: c } = n, { root: h } = s;
    if ((t === "#" || t === "#/") && i === h.baseId)
      return B();
    const w = WB.resolveRef.call(c, h, i, t);
    if (w === void 0)
      throw new x_.default(n.opts.uriResolver, i, t);
    if (w instanceof WB.SchemaEnv)
      return p(w);
    return v(w);
    function B() {
      if (s === h)
        return Tl(A, l, s, s.$async);
      const o = e.scopeValue("root", { ref: h });
      return Tl(A, (0, Jt._)`${o}.validate`, h, h.$async);
    }
    function p(o) {
      const C = Cv(A, o);
      Tl(A, C, o, o.$async);
    }
    function v(o) {
      const C = e.scopeValue("schema", f.code.source === !0 ? { ref: o, code: (0, Jt.stringify)(o) } : { ref: o }), F = e.name("valid"), U = A.subschema({
        schema: o,
        dataTypes: [],
        schemaPath: Jt.nil,
        topSchemaRef: C,
        errSchemaPath: t
      }, F);
      A.mergeEvaluated(U), A.ok(F);
    }
  }
};
function Cv(A, e) {
  const { gen: t } = A;
  return e.validate ? t.scopeValue("validate", { ref: e.validate }) : (0, Jt._)`${t.scopeValue("wrapper", { ref: e })}.validate`;
}
na.getValidate = Cv;
function Tl(A, e, t, n) {
  const { gen: i, it: s } = A, { allErrors: l, schemaEnv: f, opts: c } = s, h = c.passContext ? Sa.default.this : Jt.nil;
  n ? w() : B();
  function w() {
    if (!f.$async)
      throw new Error("async schema referenced by sync schema");
    const o = i.let("valid");
    i.try(() => {
      i.code((0, Jt._)`await ${(0, VB.callValidateCode)(A, e, h)}`), v(e), l || i.assign(o, !0);
    }, (C) => {
      i.if((0, Jt._)`!(${C} instanceof ${s.ValidationError})`, () => i.throw(C)), p(C), l || i.assign(o, !1);
    }), A.ok(o);
  }
  function B() {
    A.result((0, VB.callValidateCode)(A, e, h), () => v(e), () => p(e));
  }
  function p(o) {
    const C = (0, Jt._)`${o}.errors`;
    i.assign(Sa.default.vErrors, (0, Jt._)`${Sa.default.vErrors} === null ? ${C} : ${Sa.default.vErrors}.concat(${C})`), i.assign(Sa.default.errors, (0, Jt._)`${Sa.default.vErrors}.length`);
  }
  function v(o) {
    var C;
    if (!s.opts.unevaluated)
      return;
    const F = (C = t == null ? void 0 : t.validate) === null || C === void 0 ? void 0 : C.evaluated;
    if (s.props !== !0)
      if (F && !F.dynamicProps)
        F.props !== void 0 && (s.props = zu.mergeEvaluated.props(i, F.props, s.props));
      else {
        const U = i.var("props", (0, Jt._)`${o}.evaluated.props`);
        s.props = zu.mergeEvaluated.props(i, U, s.props, Jt.Name);
      }
    if (s.items !== !0)
      if (F && !F.dynamicItems)
        F.items !== void 0 && (s.items = zu.mergeEvaluated.items(i, F.items, s.items));
      else {
        const U = i.var("items", (0, Jt._)`${o}.evaluated.items`);
        s.items = zu.mergeEvaluated.items(i, U, s.items, Jt.Name);
      }
  }
}
na.callRef = Tl;
na.default = I_;
Object.defineProperty(Wd, "__esModule", { value: !0 });
const H_ = Xd, S_ = na, L_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  H_.default,
  S_.default
];
Wd.default = L_;
var qd = {}, zd = {};
Object.defineProperty(zd, "__esModule", { value: !0 });
const Xl = ye, ci = Xl.operators, ql = {
  maximum: { okStr: "<=", ok: ci.LTE, fail: ci.GT },
  minimum: { okStr: ">=", ok: ci.GTE, fail: ci.LT },
  exclusiveMaximum: { okStr: "<", ok: ci.LT, fail: ci.GTE },
  exclusiveMinimum: { okStr: ">", ok: ci.GT, fail: ci.LTE }
}, T_ = {
  message: ({ keyword: A, schemaCode: e }) => (0, Xl.str)`must be ${ql[A].okStr} ${e}`,
  params: ({ keyword: A, schemaCode: e }) => (0, Xl._)`{comparison: ${ql[A].okStr}, limit: ${e}}`
}, D_ = {
  keyword: Object.keys(ql),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: T_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A;
    A.fail$data((0, Xl._)`${t} ${ql[e].fail} ${n} || isNaN(${t})`);
  }
};
zd.default = D_;
var Jd = {};
Object.defineProperty(Jd, "__esModule", { value: !0 });
const ls = ye, O_ = {
  message: ({ schemaCode: A }) => (0, ls.str)`must be multiple of ${A}`,
  params: ({ schemaCode: A }) => (0, ls._)`{multipleOf: ${A}}`
}, N_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: O_,
  code(A) {
    const { gen: e, data: t, schemaCode: n, it: i } = A, s = i.opts.multipleOfPrecision, l = e.let("res"), f = s ? (0, ls._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${s}` : (0, ls._)`${l} !== parseInt(${l})`;
    A.fail$data((0, ls._)`(${n} === 0 || (${l} = ${t}/${n}, ${f}))`);
  }
};
Jd.default = N_;
var jd = {}, Yd = {};
Object.defineProperty(Yd, "__esModule", { value: !0 });
function Qv(A) {
  const e = A.length;
  let t = 0, n = 0, i;
  for (; n < e; )
    t++, i = A.charCodeAt(n++), i >= 55296 && i <= 56319 && n < e && (i = A.charCodeAt(n), (i & 64512) === 56320 && n++);
  return t;
}
Yd.default = Qv;
Qv.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(jd, "__esModule", { value: !0 });
const Xi = ye, M_ = kA, P_ = Yd, K_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxLength" ? "more" : "fewer";
    return (0, Xi.str)`must NOT have ${t} than ${e} characters`;
  },
  params: ({ schemaCode: A }) => (0, Xi._)`{limit: ${A}}`
}, R_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: K_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n, it: i } = A, s = e === "maxLength" ? Xi.operators.GT : Xi.operators.LT, l = i.opts.unicode === !1 ? (0, Xi._)`${t}.length` : (0, Xi._)`${(0, M_.useFunc)(A.gen, P_.default)}(${t})`;
    A.fail$data((0, Xi._)`${l} ${s} ${n}`);
  }
};
jd.default = R_;
var Zd = {};
Object.defineProperty(Zd, "__esModule", { value: !0 });
const k_ = ve, zl = ye, $_ = {
  message: ({ schemaCode: A }) => (0, zl.str)`must match pattern "${A}"`,
  params: ({ schemaCode: A }) => (0, zl._)`{pattern: ${A}}`
}, G_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: $_,
  code(A) {
    const { data: e, $data: t, schema: n, schemaCode: i, it: s } = A, l = s.opts.unicodeRegExp ? "u" : "", f = t ? (0, zl._)`(new RegExp(${i}, ${l}))` : (0, k_.usePattern)(A, n);
    A.fail$data((0, zl._)`!${f}.test(${e})`);
  }
};
Zd.default = G_;
var Ap = {};
Object.defineProperty(Ap, "__esModule", { value: !0 });
const cs = ye, V_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxProperties" ? "more" : "fewer";
    return (0, cs.str)`must NOT have ${t} than ${e} properties`;
  },
  params: ({ schemaCode: A }) => (0, cs._)`{limit: ${A}}`
}, W_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: V_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxProperties" ? cs.operators.GT : cs.operators.LT;
    A.fail$data((0, cs._)`Object.keys(${t}).length ${i} ${n}`);
  }
};
Ap.default = W_;
var ep = {};
Object.defineProperty(ep, "__esModule", { value: !0 });
const Vo = ve, fs = ye, X_ = kA, q_ = {
  message: ({ params: { missingProperty: A } }) => (0, fs.str)`must have required property '${A}'`,
  params: ({ params: { missingProperty: A } }) => (0, fs._)`{missingProperty: ${A}}`
}, z_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: q_,
  code(A) {
    const { gen: e, schema: t, schemaCode: n, data: i, $data: s, it: l } = A, { opts: f } = l;
    if (!s && t.length === 0)
      return;
    const c = t.length >= f.loopRequired;
    if (l.allErrors ? h() : w(), f.strictRequired) {
      const v = A.parentSchema.properties, { definedProperties: o } = A.it;
      for (const C of t)
        if ((v == null ? void 0 : v[C]) === void 0 && !o.has(C)) {
          const F = l.schemaEnv.baseId + l.errSchemaPath, U = `required property "${C}" is not defined at "${F}" (strictRequired)`;
          (0, X_.checkStrictMode)(l, U, l.opts.strictRequired);
        }
    }
    function h() {
      if (c || s)
        A.block$data(fs.nil, B);
      else
        for (const v of t)
          (0, Vo.checkReportMissingProp)(A, v);
    }
    function w() {
      const v = e.let("missing");
      if (c || s) {
        const o = e.let("valid", !0);
        A.block$data(o, () => p(v, o)), A.ok(o);
      } else
        e.if((0, Vo.checkMissingProp)(A, t, v)), (0, Vo.reportMissingProp)(A, v), e.else();
    }
    function B() {
      e.forOf("prop", n, (v) => {
        A.setParams({ missingProperty: v }), e.if((0, Vo.noPropertyInData)(e, i, v, f.ownProperties), () => A.error());
      });
    }
    function p(v, o) {
      A.setParams({ missingProperty: v }), e.forOf(v, n, () => {
        e.assign(o, (0, Vo.propertyInData)(e, i, v, f.ownProperties)), e.if((0, fs.not)(o), () => {
          A.error(), e.break();
        });
      }, fs.nil);
    }
  }
};
ep.default = z_;
var tp = {};
Object.defineProperty(tp, "__esModule", { value: !0 });
const hs = ye, J_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxItems" ? "more" : "fewer";
    return (0, hs.str)`must NOT have ${t} than ${e} items`;
  },
  params: ({ schemaCode: A }) => (0, hs._)`{limit: ${A}}`
}, j_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: J_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxItems" ? hs.operators.GT : hs.operators.LT;
    A.fail$data((0, hs._)`${t}.length ${i} ${n}`);
  }
};
tp.default = j_;
var np = {}, Ds = {};
Object.defineProperty(Ds, "__esModule", { value: !0 });
const Fv = ov;
Fv.code = 'require("ajv/dist/runtime/equal").default';
Ds.default = Fv;
Object.defineProperty(np, "__esModule", { value: !0 });
const ih = ct, yt = ye, Y_ = kA, Z_ = Ds, Ax = {
  message: ({ params: { i: A, j: e } }) => (0, yt.str)`must NOT have duplicate items (items ## ${e} and ${A} are identical)`,
  params: ({ params: { i: A, j: e } }) => (0, yt._)`{i: ${A}, j: ${e}}`
}, ex = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Ax,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, parentSchema: s, schemaCode: l, it: f } = A;
    if (!n && !i)
      return;
    const c = e.let("valid"), h = s.items ? (0, ih.getSchemaTypes)(s.items) : [];
    A.block$data(c, w, (0, yt._)`${l} === false`), A.ok(c);
    function w() {
      const o = e.let("i", (0, yt._)`${t}.length`), C = e.let("j");
      A.setParams({ i: o, j: C }), e.assign(c, !0), e.if((0, yt._)`${o} > 1`, () => (B() ? p : v)(o, C));
    }
    function B() {
      return h.length > 0 && !h.some((o) => o === "object" || o === "array");
    }
    function p(o, C) {
      const F = e.name("item"), U = (0, ih.checkDataTypes)(h, F, f.opts.strictNumbers, ih.DataType.Wrong), S = e.const("indices", (0, yt._)`{}`);
      e.for((0, yt._)`;${o}--;`, () => {
        e.let(F, (0, yt._)`${t}[${o}]`), e.if(U, (0, yt._)`continue`), h.length > 1 && e.if((0, yt._)`typeof ${F} == "string"`, (0, yt._)`${F} += "_"`), e.if((0, yt._)`typeof ${S}[${F}] == "number"`, () => {
          e.assign(C, (0, yt._)`${S}[${F}]`), A.error(), e.assign(c, !1).break();
        }).code((0, yt._)`${S}[${F}] = ${o}`);
      });
    }
    function v(o, C) {
      const F = (0, Y_.useFunc)(e, Z_.default), U = e.name("outer");
      e.label(U).for((0, yt._)`;${o}--;`, () => e.for((0, yt._)`${C} = ${o}; ${C}--;`, () => e.if((0, yt._)`${F}(${t}[${o}], ${t}[${C}])`, () => {
        A.error(), e.assign(c, !1).break(U);
      })));
    }
  }
};
np.default = ex;
var rp = {};
Object.defineProperty(rp, "__esModule", { value: !0 });
const $h = ye, tx = kA, nx = Ds, rx = {
  message: "must be equal to constant",
  params: ({ schemaCode: A }) => (0, $h._)`{allowedValue: ${A}}`
}, ix = {
  keyword: "const",
  $data: !0,
  error: rx,
  code(A) {
    const { gen: e, data: t, $data: n, schemaCode: i, schema: s } = A;
    n || s && typeof s == "object" ? A.fail$data((0, $h._)`!${(0, tx.useFunc)(e, nx.default)}(${t}, ${i})`) : A.fail((0, $h._)`${s} !== ${t}`);
  }
};
rp.default = ix;
var ip = {};
Object.defineProperty(ip, "__esModule", { value: !0 });
const As = ye, ax = kA, ox = Ds, sx = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: A }) => (0, As._)`{allowedValues: ${A}}`
}, ux = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: sx,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, schemaCode: s, it: l } = A;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const f = i.length >= l.opts.loopEnum;
    let c;
    const h = () => c ?? (c = (0, ax.useFunc)(e, ox.default));
    let w;
    if (f || n)
      w = e.let("valid"), A.block$data(w, B);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const v = e.const("vSchema", s);
      w = (0, As.or)(...i.map((o, C) => p(v, C)));
    }
    A.pass(w);
    function B() {
      e.assign(w, !1), e.forOf("v", s, (v) => e.if((0, As._)`${h()}(${t}, ${v})`, () => e.assign(w, !0).break()));
    }
    function p(v, o) {
      const C = i[o];
      return typeof C == "object" && C !== null ? (0, As._)`${h()}(${t}, ${v}[${o}])` : (0, As._)`${t} === ${C}`;
    }
  }
};
ip.default = ux;
Object.defineProperty(qd, "__esModule", { value: !0 });
const lx = zd, cx = Jd, fx = jd, hx = Zd, dx = Ap, px = ep, gx = tp, Bx = np, wx = rp, mx = ip, vx = [
  // number
  lx.default,
  cx.default,
  // string
  fx.default,
  hx.default,
  // object
  dx.default,
  px.default,
  // array
  gx.default,
  Bx.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  wx.default,
  mx.default
];
qd.default = vx;
var ap = {}, uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.validateAdditionalItems = void 0;
const qi = ye, Gh = kA, yx = {
  message: ({ params: { len: A } }) => (0, qi.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, qi._)`{limit: ${A}}`
}, Cx = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: yx,
  code(A) {
    const { parentSchema: e, it: t } = A, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, Gh.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Uv(A, n);
  }
};
function Uv(A, e) {
  const { gen: t, schema: n, data: i, keyword: s, it: l } = A;
  l.items = !0;
  const f = t.const("len", (0, qi._)`${i}.length`);
  if (n === !1)
    A.setParams({ len: e.length }), A.pass((0, qi._)`${f} <= ${e.length}`);
  else if (typeof n == "object" && !(0, Gh.alwaysValidSchema)(l, n)) {
    const h = t.var("valid", (0, qi._)`${f} <= ${e.length}`);
    t.if((0, qi.not)(h), () => c(h)), A.ok(h);
  }
  function c(h) {
    t.forRange("i", e.length, f, (w) => {
      A.subschema({ keyword: s, dataProp: w, dataPropType: Gh.Type.Num }, h), l.allErrors || t.if((0, qi.not)(h), () => t.break());
    });
  }
}
uo.validateAdditionalItems = Uv;
uo.default = Cx;
var op = {}, lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
lo.validateTuple = void 0;
const XB = ye, Dl = kA, Qx = ve, Fx = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(A) {
    const { schema: e, it: t } = A;
    if (Array.isArray(e))
      return Ev(A, "additionalItems", e);
    t.items = !0, !(0, Dl.alwaysValidSchema)(t, e) && A.ok((0, Qx.validateArray)(A));
  }
};
function Ev(A, e, t = A.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: l, it: f } = A;
  w(i), f.opts.unevaluated && t.length && f.items !== !0 && (f.items = Dl.mergeEvaluated.items(n, t.length, f.items));
  const c = n.name("valid"), h = n.const("len", (0, XB._)`${s}.length`);
  t.forEach((B, p) => {
    (0, Dl.alwaysValidSchema)(f, B) || (n.if((0, XB._)`${h} > ${p}`, () => A.subschema({
      keyword: l,
      schemaProp: p,
      dataProp: p
    }, c)), A.ok(c));
  });
  function w(B) {
    const { opts: p, errSchemaPath: v } = f, o = t.length, C = o === B.minItems && (o === B.maxItems || B[e] === !1);
    if (p.strictTuples && !C) {
      const F = `"${l}" is ${o}-tuple, but minItems or maxItems/${e} are not specified or different at path "${v}"`;
      (0, Dl.checkStrictMode)(f, F, p.strictTuples);
    }
  }
}
lo.validateTuple = Ev;
lo.default = Fx;
Object.defineProperty(op, "__esModule", { value: !0 });
const Ux = lo, Ex = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (A) => (0, Ux.validateTuple)(A, "items")
};
op.default = Ex;
var sp = {};
Object.defineProperty(sp, "__esModule", { value: !0 });
const qB = ye, bx = kA, _x = ve, xx = uo, Ix = {
  message: ({ params: { len: A } }) => (0, qB.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, qB._)`{limit: ${A}}`
}, Hx = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Ix,
  code(A) {
    const { schema: e, parentSchema: t, it: n } = A, { prefixItems: i } = t;
    n.items = !0, !(0, bx.alwaysValidSchema)(n, e) && (i ? (0, xx.validateAdditionalItems)(A, i) : A.ok((0, _x.validateArray)(A)));
  }
};
sp.default = Hx;
var up = {};
Object.defineProperty(up, "__esModule", { value: !0 });
const mn = ye, Ju = kA, Sx = {
  message: ({ params: { min: A, max: e } }) => e === void 0 ? (0, mn.str)`must contain at least ${A} valid item(s)` : (0, mn.str)`must contain at least ${A} and no more than ${e} valid item(s)`,
  params: ({ params: { min: A, max: e } }) => e === void 0 ? (0, mn._)`{minContains: ${A}}` : (0, mn._)`{minContains: ${A}, maxContains: ${e}}`
}, Lx = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Sx,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: s } = A;
    let l, f;
    const { minContains: c, maxContains: h } = n;
    s.opts.next ? (l = c === void 0 ? 1 : c, f = h) : l = 1;
    const w = e.const("len", (0, mn._)`${i}.length`);
    if (A.setParams({ min: l, max: f }), f === void 0 && l === 0) {
      (0, Ju.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (f !== void 0 && l > f) {
      (0, Ju.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), A.fail();
      return;
    }
    if ((0, Ju.alwaysValidSchema)(s, t)) {
      let C = (0, mn._)`${w} >= ${l}`;
      f !== void 0 && (C = (0, mn._)`${C} && ${w} <= ${f}`), A.pass(C);
      return;
    }
    s.items = !0;
    const B = e.name("valid");
    f === void 0 && l === 1 ? v(B, () => e.if(B, () => e.break())) : l === 0 ? (e.let(B, !0), f !== void 0 && e.if((0, mn._)`${i}.length > 0`, p)) : (e.let(B, !1), p()), A.result(B, () => A.reset());
    function p() {
      const C = e.name("_valid"), F = e.let("count", 0);
      v(C, () => e.if(C, () => o(F)));
    }
    function v(C, F) {
      e.forRange("i", 0, w, (U) => {
        A.subschema({
          keyword: "contains",
          dataProp: U,
          dataPropType: Ju.Type.Num,
          compositeRule: !0
        }, C), F();
      });
    }
    function o(C) {
      e.code((0, mn._)`${C}++`), f === void 0 ? e.if((0, mn._)`${C} >= ${l}`, () => e.assign(B, !0).break()) : (e.if((0, mn._)`${C} > ${f}`, () => e.assign(B, !1).break()), l === 1 ? e.assign(B, !0) : e.if((0, mn._)`${C} >= ${l}`, () => e.assign(B, !0)));
    }
  }
};
up.default = Lx;
var bv = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.validateSchemaDeps = A.validatePropertyDeps = A.error = void 0;
  const e = ye, t = kA, n = ve;
  A.error = {
    message: ({ params: { property: c, depsCount: h, deps: w } }) => {
      const B = h === 1 ? "property" : "properties";
      return (0, e.str)`must have ${B} ${w} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: h, deps: w, missingProperty: B } }) => (0, e._)`{property: ${c},
    missingProperty: ${B},
    depsCount: ${h},
    deps: ${w}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: A.error,
    code(c) {
      const [h, w] = s(c);
      l(c, h), f(c, w);
    }
  };
  function s({ schema: c }) {
    const h = {}, w = {};
    for (const B in c) {
      if (B === "__proto__")
        continue;
      const p = Array.isArray(c[B]) ? h : w;
      p[B] = c[B];
    }
    return [h, w];
  }
  function l(c, h = c.schema) {
    const { gen: w, data: B, it: p } = c;
    if (Object.keys(h).length === 0)
      return;
    const v = w.let("missing");
    for (const o in h) {
      const C = h[o];
      if (C.length === 0)
        continue;
      const F = (0, n.propertyInData)(w, B, o, p.opts.ownProperties);
      c.setParams({
        property: o,
        depsCount: C.length,
        deps: C.join(", ")
      }), p.allErrors ? w.if(F, () => {
        for (const U of C)
          (0, n.checkReportMissingProp)(c, U);
      }) : (w.if((0, e._)`${F} && (${(0, n.checkMissingProp)(c, C, v)})`), (0, n.reportMissingProp)(c, v), w.else());
    }
  }
  A.validatePropertyDeps = l;
  function f(c, h = c.schema) {
    const { gen: w, data: B, keyword: p, it: v } = c, o = w.name("valid");
    for (const C in h)
      (0, t.alwaysValidSchema)(v, h[C]) || (w.if(
        (0, n.propertyInData)(w, B, C, v.opts.ownProperties),
        () => {
          const F = c.subschema({ keyword: p, schemaProp: C }, o);
          c.mergeValidEvaluated(F, o);
        },
        () => w.var(o, !0)
        // TODO var
      ), c.ok(o));
  }
  A.validateSchemaDeps = f, A.default = i;
})(bv);
var lp = {};
Object.defineProperty(lp, "__esModule", { value: !0 });
const _v = ye, Tx = kA, Dx = {
  message: "property name must be valid",
  params: ({ params: A }) => (0, _v._)`{propertyName: ${A.propertyName}}`
}, Ox = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Dx,
  code(A) {
    const { gen: e, schema: t, data: n, it: i } = A;
    if ((0, Tx.alwaysValidSchema)(i, t))
      return;
    const s = e.name("valid");
    e.forIn("key", n, (l) => {
      A.setParams({ propertyName: l }), A.subschema({
        keyword: "propertyNames",
        data: l,
        dataTypes: ["string"],
        propertyName: l,
        compositeRule: !0
      }, s), e.if((0, _v.not)(s), () => {
        A.error(!0), i.allErrors || e.break();
      });
    }), A.ok(s);
  }
};
lp.default = Ox;
var Ec = {};
Object.defineProperty(Ec, "__esModule", { value: !0 });
const ju = ve, Rn = ye, Nx = cr, Yu = kA, Mx = {
  message: "must NOT have additional properties",
  params: ({ params: A }) => (0, Rn._)`{additionalProperty: ${A.additionalProperty}}`
}, Px = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Mx,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, errsCount: s, it: l } = A;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: f, opts: c } = l;
    if (l.props = !0, c.removeAdditional !== "all" && (0, Yu.alwaysValidSchema)(l, t))
      return;
    const h = (0, ju.allSchemaProperties)(n.properties), w = (0, ju.allSchemaProperties)(n.patternProperties);
    B(), A.ok((0, Rn._)`${s} === ${Nx.default.errors}`);
    function B() {
      e.forIn("key", i, (F) => {
        !h.length && !w.length ? o(F) : e.if(p(F), () => o(F));
      });
    }
    function p(F) {
      let U;
      if (h.length > 8) {
        const S = (0, Yu.schemaRefOrVal)(l, n.properties, "properties");
        U = (0, ju.isOwnProperty)(e, S, F);
      } else h.length ? U = (0, Rn.or)(...h.map((S) => (0, Rn._)`${F} === ${S}`)) : U = Rn.nil;
      return w.length && (U = (0, Rn.or)(U, ...w.map((S) => (0, Rn._)`${(0, ju.usePattern)(A, S)}.test(${F})`))), (0, Rn.not)(U);
    }
    function v(F) {
      e.code((0, Rn._)`delete ${i}[${F}]`);
    }
    function o(F) {
      if (c.removeAdditional === "all" || c.removeAdditional && t === !1) {
        v(F);
        return;
      }
      if (t === !1) {
        A.setParams({ additionalProperty: F }), A.error(), f || e.break();
        return;
      }
      if (typeof t == "object" && !(0, Yu.alwaysValidSchema)(l, t)) {
        const U = e.name("valid");
        c.removeAdditional === "failing" ? (C(F, U, !1), e.if((0, Rn.not)(U), () => {
          A.reset(), v(F);
        })) : (C(F, U), f || e.if((0, Rn.not)(U), () => e.break()));
      }
    }
    function C(F, U, S) {
      const O = {
        keyword: "additionalProperties",
        dataProp: F,
        dataPropType: Yu.Type.Str
      };
      S === !1 && Object.assign(O, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), A.subschema(O, U);
    }
  }
};
Ec.default = Px;
var cp = {};
Object.defineProperty(cp, "__esModule", { value: !0 });
const Kx = Cc(), zB = ve, ah = kA, JB = Ec, Rx = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: s } = A;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && JB.default.code(new Kx.KeywordCxt(s, JB.default, "additionalProperties"));
    const l = (0, zB.allSchemaProperties)(t);
    for (const B of l)
      s.definedProperties.add(B);
    s.opts.unevaluated && l.length && s.props !== !0 && (s.props = ah.mergeEvaluated.props(e, (0, ah.toHash)(l), s.props));
    const f = l.filter((B) => !(0, ah.alwaysValidSchema)(s, t[B]));
    if (f.length === 0)
      return;
    const c = e.name("valid");
    for (const B of f)
      h(B) ? w(B) : (e.if((0, zB.propertyInData)(e, i, B, s.opts.ownProperties)), w(B), s.allErrors || e.else().var(c, !0), e.endIf()), A.it.definedProperties.add(B), A.ok(c);
    function h(B) {
      return s.opts.useDefaults && !s.compositeRule && t[B].default !== void 0;
    }
    function w(B) {
      A.subschema({
        keyword: "properties",
        schemaProp: B,
        dataProp: B
      }, c);
    }
  }
};
cp.default = Rx;
var fp = {};
Object.defineProperty(fp, "__esModule", { value: !0 });
const jB = ve, Zu = ye, YB = kA, ZB = kA, kx = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, data: n, parentSchema: i, it: s } = A, { opts: l } = s, f = (0, jB.allSchemaProperties)(t), c = f.filter((C) => (0, YB.alwaysValidSchema)(s, t[C]));
    if (f.length === 0 || c.length === f.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const h = l.strictSchema && !l.allowMatchingProperties && i.properties, w = e.name("valid");
    s.props !== !0 && !(s.props instanceof Zu.Name) && (s.props = (0, ZB.evaluatedPropsToName)(e, s.props));
    const { props: B } = s;
    p();
    function p() {
      for (const C of f)
        h && v(C), s.allErrors ? o(C) : (e.var(w, !0), o(C), e.if(w));
    }
    function v(C) {
      for (const F in h)
        new RegExp(C).test(F) && (0, YB.checkStrictMode)(s, `property ${F} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function o(C) {
      e.forIn("key", n, (F) => {
        e.if((0, Zu._)`${(0, jB.usePattern)(A, C)}.test(${F})`, () => {
          const U = c.includes(C);
          U || A.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: F,
            dataPropType: ZB.Type.Str
          }, w), s.opts.unevaluated && B !== !0 ? e.assign((0, Zu._)`${B}[${F}]`, !0) : !U && !s.allErrors && e.if((0, Zu.not)(w), () => e.break());
        });
      });
    }
  }
};
fp.default = kx;
var hp = {};
Object.defineProperty(hp, "__esModule", { value: !0 });
const $x = kA, Gx = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if ((0, $x.alwaysValidSchema)(n, t)) {
      A.fail();
      return;
    }
    const i = e.name("valid");
    A.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), A.failResult(i, () => A.reset(), () => A.error());
  },
  error: { message: "must NOT be valid" }
};
hp.default = Gx;
var dp = {};
Object.defineProperty(dp, "__esModule", { value: !0 });
const Vx = ve, Wx = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Vx.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
dp.default = Wx;
var pp = {};
Object.defineProperty(pp, "__esModule", { value: !0 });
const Ol = ye, Xx = kA, qx = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: A }) => (0, Ol._)`{passingSchemas: ${A.passing}}`
}, zx = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: qx,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, it: i } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = t, l = e.let("valid", !1), f = e.let("passing", null), c = e.name("_valid");
    A.setParams({ passing: f }), e.block(h), A.result(l, () => A.reset(), () => A.error(!0));
    function h() {
      s.forEach((w, B) => {
        let p;
        (0, Xx.alwaysValidSchema)(i, w) ? e.var(c, !0) : p = A.subschema({
          keyword: "oneOf",
          schemaProp: B,
          compositeRule: !0
        }, c), B > 0 && e.if((0, Ol._)`${c} && ${l}`).assign(l, !1).assign(f, (0, Ol._)`[${f}, ${B}]`).else(), e.if(c, () => {
          e.assign(l, !0), e.assign(f, B), p && A.mergeEvaluated(p, Ol.Name);
        });
      });
    }
  }
};
pp.default = zx;
var gp = {};
Object.defineProperty(gp, "__esModule", { value: !0 });
const Jx = kA, jx = {
  keyword: "allOf",
  schemaType: "array",
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    const i = e.name("valid");
    t.forEach((s, l) => {
      if ((0, Jx.alwaysValidSchema)(n, s))
        return;
      const f = A.subschema({ keyword: "allOf", schemaProp: l }, i);
      A.ok(i), A.mergeEvaluated(f);
    });
  }
};
gp.default = jx;
var Bp = {};
Object.defineProperty(Bp, "__esModule", { value: !0 });
const Jl = ye, xv = kA, Yx = {
  message: ({ params: A }) => (0, Jl.str)`must match "${A.ifClause}" schema`,
  params: ({ params: A }) => (0, Jl._)`{failingKeyword: ${A.ifClause}}`
}, Zx = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Yx,
  code(A) {
    const { gen: e, parentSchema: t, it: n } = A;
    t.then === void 0 && t.else === void 0 && (0, xv.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Aw(n, "then"), s = Aw(n, "else");
    if (!i && !s)
      return;
    const l = e.let("valid", !0), f = e.name("_valid");
    if (c(), A.reset(), i && s) {
      const w = e.let("ifClause");
      A.setParams({ ifClause: w }), e.if(f, h("then", w), h("else", w));
    } else i ? e.if(f, h("then")) : e.if((0, Jl.not)(f), h("else"));
    A.pass(l, () => A.error(!0));
    function c() {
      const w = A.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, f);
      A.mergeEvaluated(w);
    }
    function h(w, B) {
      return () => {
        const p = A.subschema({ keyword: w }, f);
        e.assign(l, f), A.mergeValidEvaluated(p, l), B ? e.assign(B, (0, Jl._)`${w}`) : A.setParams({ ifClause: w });
      };
    }
  }
};
function Aw(A, e) {
  const t = A.schema[e];
  return t !== void 0 && !(0, xv.alwaysValidSchema)(A, t);
}
Bp.default = Zx;
var wp = {};
Object.defineProperty(wp, "__esModule", { value: !0 });
const AI = kA, eI = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: A, parentSchema: e, it: t }) {
    e.if === void 0 && (0, AI.checkStrictMode)(t, `"${A}" without "if" is ignored`);
  }
};
wp.default = eI;
Object.defineProperty(ap, "__esModule", { value: !0 });
const tI = uo, nI = op, rI = lo, iI = sp, aI = up, oI = bv, sI = lp, uI = Ec, lI = cp, cI = fp, fI = hp, hI = dp, dI = pp, pI = gp, gI = Bp, BI = wp;
function wI(A = !1) {
  const e = [
    // any
    fI.default,
    hI.default,
    dI.default,
    pI.default,
    gI.default,
    BI.default,
    // object
    sI.default,
    uI.default,
    oI.default,
    lI.default,
    cI.default
  ];
  return A ? e.push(nI.default, iI.default) : e.push(tI.default, rI.default), e.push(aI.default), e;
}
ap.default = wI;
var mp = {}, vp = {};
Object.defineProperty(vp, "__esModule", { value: !0 });
const it = ye, mI = {
  message: ({ schemaCode: A }) => (0, it.str)`must match format "${A}"`,
  params: ({ schemaCode: A }) => (0, it._)`{format: ${A}}`
}, vI = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: mI,
  code(A, e) {
    const { gen: t, data: n, $data: i, schema: s, schemaCode: l, it: f } = A, { opts: c, errSchemaPath: h, schemaEnv: w, self: B } = f;
    if (!c.validateFormats)
      return;
    i ? p() : v();
    function p() {
      const o = t.scopeValue("formats", {
        ref: B.formats,
        code: c.code.formats
      }), C = t.const("fDef", (0, it._)`${o}[${l}]`), F = t.let("fType"), U = t.let("format");
      t.if((0, it._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => t.assign(F, (0, it._)`${C}.type || "string"`).assign(U, (0, it._)`${C}.validate`), () => t.assign(F, (0, it._)`"string"`).assign(U, C)), A.fail$data((0, it.or)(S(), O()));
      function S() {
        return c.strictSchema === !1 ? it.nil : (0, it._)`${l} && !${U}`;
      }
      function O() {
        const b = w.$async ? (0, it._)`(${C}.async ? await ${U}(${n}) : ${U}(${n}))` : (0, it._)`${U}(${n})`, P = (0, it._)`(typeof ${U} == "function" ? ${b} : ${U}.test(${n}))`;
        return (0, it._)`${U} && ${U} !== true && ${F} === ${e} && !${P}`;
      }
    }
    function v() {
      const o = B.formats[s];
      if (!o) {
        S();
        return;
      }
      if (o === !0)
        return;
      const [C, F, U] = O(o);
      C === e && A.pass(b());
      function S() {
        if (c.strictSchema === !1) {
          B.logger.warn(P());
          return;
        }
        throw new Error(P());
        function P() {
          return `unknown format "${s}" ignored in schema at path "${h}"`;
        }
      }
      function O(P) {
        const R = P instanceof RegExp ? (0, it.regexpCode)(P) : c.code.formats ? (0, it._)`${c.code.formats}${(0, it.getProperty)(s)}` : void 0, j = t.scopeValue("formats", { key: s, ref: P, code: R });
        return typeof P == "object" && !(P instanceof RegExp) ? [P.type || "string", P.validate, (0, it._)`${j}.validate`] : ["string", P, j];
      }
      function b() {
        if (typeof o == "object" && !(o instanceof RegExp) && o.async) {
          if (!w.$async)
            throw new Error("async format in sync schema");
          return (0, it._)`await ${U}(${n})`;
        }
        return typeof F == "function" ? (0, it._)`${U}(${n})` : (0, it._)`${U}.test(${n})`;
      }
    }
  }
};
vp.default = vI;
Object.defineProperty(mp, "__esModule", { value: !0 });
const yI = vp, CI = [yI.default];
mp.default = CI;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
Za.contentVocabulary = Za.metadataVocabulary = void 0;
Za.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Za.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Vd, "__esModule", { value: !0 });
const QI = Wd, FI = qd, UI = ap, EI = mp, ew = Za, bI = [
  QI.default,
  FI.default,
  (0, UI.default)(),
  EI.default,
  ew.metadataVocabulary,
  ew.contentVocabulary
];
Vd.default = bI;
var yp = {}, bc = {};
Object.defineProperty(bc, "__esModule", { value: !0 });
bc.DiscrError = void 0;
var tw;
(function(A) {
  A.Tag = "tag", A.Mapping = "mapping";
})(tw || (bc.DiscrError = tw = {}));
Object.defineProperty(yp, "__esModule", { value: !0 });
const Ka = ye, Vh = bc, nw = Yt, _I = so, xI = kA, II = {
  message: ({ params: { discrError: A, tagName: e } }) => A === Vh.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: A, tag: e, tagName: t } }) => (0, Ka._)`{error: ${A}, tag: ${t}, tagValue: ${e}}`
}, HI = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: II,
  code(A) {
    const { gen: e, data: t, schema: n, parentSchema: i, it: s } = A, { oneOf: l } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const f = n.propertyName;
    if (typeof f != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!l)
      throw new Error("discriminator: requires oneOf keyword");
    const c = e.let("valid", !1), h = e.const("tag", (0, Ka._)`${t}${(0, Ka.getProperty)(f)}`);
    e.if((0, Ka._)`typeof ${h} == "string"`, () => w(), () => A.error(!1, { discrError: Vh.DiscrError.Tag, tag: h, tagName: f })), A.ok(c);
    function w() {
      const v = p();
      e.if(!1);
      for (const o in v)
        e.elseIf((0, Ka._)`${h} === ${o}`), e.assign(c, B(v[o]));
      e.else(), A.error(!1, { discrError: Vh.DiscrError.Mapping, tag: h, tagName: f }), e.endIf();
    }
    function B(v) {
      const o = e.name("valid"), C = A.subschema({ keyword: "oneOf", schemaProp: v }, o);
      return A.mergeEvaluated(C, Ka.Name), o;
    }
    function p() {
      var v;
      const o = {}, C = U(i);
      let F = !0;
      for (let b = 0; b < l.length; b++) {
        let P = l[b];
        if (P != null && P.$ref && !(0, xI.schemaHasRulesButRef)(P, s.self.RULES)) {
          const j = P.$ref;
          if (P = nw.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, j), P instanceof nw.SchemaEnv && (P = P.schema), P === void 0)
            throw new _I.default(s.opts.uriResolver, s.baseId, j);
        }
        const R = (v = P == null ? void 0 : P.properties) === null || v === void 0 ? void 0 : v[f];
        if (typeof R != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${f}"`);
        F = F && (C || U(P)), S(R, b);
      }
      if (!F)
        throw new Error(`discriminator: "${f}" must be required`);
      return o;
      function U({ required: b }) {
        return Array.isArray(b) && b.includes(f);
      }
      function S(b, P) {
        if (b.const)
          O(b.const, P);
        else if (b.enum)
          for (const R of b.enum)
            O(R, P);
        else
          throw new Error(`discriminator: "properties/${f}" must have "const" or "enum"`);
      }
      function O(b, P) {
        if (typeof b != "string" || b in o)
          throw new Error(`discriminator: "${f}" values must be unique strings`);
        o[b] = P;
      }
    }
  }
};
yp.default = HI;
const SI = "http://json-schema.org/draft-07/schema#", LI = "http://json-schema.org/draft-07/schema#", TI = "Core schema meta-schema", DI = {
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
}, OI = [
  "object",
  "boolean"
], NI = {
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
}, MI = {
  $schema: SI,
  $id: LI,
  title: TI,
  definitions: DI,
  type: OI,
  properties: NI,
  default: !0
};
(function(A, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const t = zm, n = Vd, i = yp, s = MI, l = ["/properties"], f = "http://json-schema.org/draft-07/schema";
  class c extends t.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((o) => this.addVocabulary(o)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const o = this.opts.$data ? this.$dataMetaSchema(s, l) : s;
      this.addMetaSchema(o, f, !1), this.refs["http://json-schema.org/schema"] = f;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(f) ? f : void 0);
    }
  }
  e.Ajv = c, A.exports = e = c, A.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
  var h = Cc();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return h.KeywordCxt;
  } });
  var w = ye;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return w._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return w.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return w.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return w.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return w.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return w.CodeGen;
  } });
  var B = Ts;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return B.default;
  } });
  var p = so;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return p.default;
  } });
})(Nh, Nh.exports);
var PI = Nh.exports;
const Iv = /* @__PURE__ */ vc(PI), KI = "http://json-schema.org/draft-07/schema#", RI = "Generated schema for Root", kI = "object", $I = {
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
}, GI = [
  "genome"
], VI = {
  $schema: KI,
  title: RI,
  type: kI,
  properties: $I,
  required: GI
}, WI = new Iv(), rw = WI.compile(VI), XI = function() {
  var A = function(e) {
    var i;
    if (!rw(e))
      throw console.log("annotation json:", e), console.log("Invalid data:", rw.errors), new Error("Invalid data");
    var n = {};
    return n.features = (i = e.genome.features) == null ? void 0 : i.map((s) => ({
      ...s,
      midpoint: (s.end - s.start) / 2 + s.start,
      selected: !1
    })), n;
  };
  return {
    readAnnotationJSONFromRawJSON: function(e) {
      return A(e);
    },
    readAnnotation: async function(e) {
      const t = await import(e);
      return A(t.default);
    }
  };
}, qI = "http://json-schema.org/draft-07/schema#", zI = "Generated schema for Root", JI = "object", jI = {
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
}, YI = [
  "chromosomes"
], ZI = {
  $schema: qI,
  title: zI,
  type: JI,
  properties: jI,
  required: YI
}, AH = new Iv(), iw = AH.compile(ZI), eH = function() {
  var A = function(e) {
    if (!iw(e))
      throw console.log("json:", e), console.log("Invalid data:", iw.errors), new Error("Invalid data");
    var n = {};
    return n.chromosomes = e == null ? void 0 : e.chromosomes, n;
  };
  return {
    readBasemap: async function(e) {
      const t = await import(e);
      return A(t.default);
    },
    readBasemapFromRawJSON: function(e) {
      return A(e);
    }
  };
}, tH = function() {
  var A = function(n) {
    var i = new Array(8 - n.length + 1).join("0");
    let s = "#" + i + n.substring(2, n.length);
    return s == "#00FF00" && (s = "#208000"), s;
  }, e = function(n) {
    return n.chromosomes.forEach(function(i) {
      i.annotations = {
        allGenes: [],
        genes: [],
        qtls: [],
        snps: []
      }, i.bands || (i.bands = []), i.bands.forEach(function(s) {
        s.color = A(s.color);
      });
    }), n;
  }, t = function(n) {
    var i = e(n[0]), s = n[1];
    return s.features.forEach(function(l) {
      l.color = A(l.color);
    }), s.features.filter(function(l) {
      return l.type.toLowerCase() === "gene";
    }).forEach(function(l, f) {
      l.globalIndex = f;
    }), i.chromosomes.forEach(function(l) {
      var f = s.features.filter(function(F) {
        return F.chromosome === l.number;
      }), c = f.filter(function(F) {
        return F.type.toLowerCase() === "gene";
      }), h = f.filter(function(F) {
        return F.type.toLowerCase() === "qtl";
      }), w = f.filter(function(F) {
        return F.type.toLowerCase() === "snp";
      }), B = w.reduce(function(F, U) {
        return Math.min(F, U.pvalue);
      }, 1);
      w.forEach(function(F, U) {
        F.id = l.number + "_" + U, F.importance = Math.log(F.pvalue) / Math.log(B);
      }), h.forEach(function(F, U) {
        F.id = l.number + "_" + U, F.selected = !1;
      }), h.reduce(function(F, U) {
        return Math.max(F, U.score);
      }, 0);
      var p = 0.9, v = 3.5, o = function(F) {
        return p - 0.5 + 1 / (1 + Math.pow(F, v));
      };
      c.forEach(function(F, U) {
        F.visible = !1, F.hidden = !1, F.displayed = !1, F.importance = o(U);
      });
      var C = c.slice(0, 100);
      l.annotations = {
        genes: C,
        allGenes: c,
        qtls: h,
        snps: w
      };
    }), i;
  };
  return {
    readData: async function(n, i, s) {
      var l = eH();
      let f;
      if (s ? f = l.readBasemapFromRawJSON(n) : f = await l.readBasemap(n), i) {
        var c = XI();
        let w;
        s ? w = c.readAnnotationJSONFromRawJSON(i) : w = c.readAnnotation(i);
        var h = Promise.all([f, w]).then(
          t,
          function(B) {
            return f.then(e);
          }
        );
        return h;
      }
      return e(f);
    }
  };
};
var jl = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
jl.exports;
(function(A, e) {
  (function() {
    var t, n = "4.17.21", i = 200, s = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", f = "Invalid `variable` option passed into `_.template`", c = "__lodash_hash_undefined__", h = 500, w = "__lodash_placeholder__", B = 1, p = 2, v = 4, o = 1, C = 2, F = 1, U = 2, S = 4, O = 8, b = 16, P = 32, R = 64, j = 128, dA = 256, fA = 512, mA = 30, FA = "...", NA = 800, bA = 16, z = 1, QA = 2, aA = 3, BA = 1 / 0, HA = 9007199254740991, SA = 17976931348623157e292, lA = NaN, D = 4294967295, iA = D - 1, Y = D >>> 1, L = [
      ["ary", j],
      ["bind", F],
      ["bindKey", U],
      ["curry", O],
      ["curryRight", b],
      ["flip", fA],
      ["partial", P],
      ["partialRight", R],
      ["rearg", dA]
    ], k = "[object Arguments]", oA = "[object Array]", _A = "[object AsyncFunction]", IA = "[object Boolean]", JA = "[object Date]", jA = "[object DOMException]", q = "[object Error]", X = "[object Function]", G = "[object GeneratorFunction]", tA = "[object Map]", cA = "[object Number]", DA = "[object Null]", YA = "[object Object]", ue = "[object Promise]", xe = "[object Proxy]", he = "[object RegExp]", de = "[object Set]", De = "[object String]", fe = "[object Symbol]", Ot = "[object Undefined]", Ut = "[object WeakMap]", Nt = "[object WeakSet]", Et = "[object ArrayBuffer]", Bt = "[object DataView]", ln = "[object Float32Array]", pr = "[object Float64Array]", Fi = "[object Int8Array]", Vr = "[object Int16Array]", Wr = "[object Int32Array]", gA = "[object Uint8Array]", PA = "[object Uint8ClampedArray]", qA = "[object Uint16Array]", Ce = "[object Uint32Array]", Qe = /\b__p \+= '';/g, ot = /\b(__p \+=) '' \+/g, bt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, En = /&(?:amp|lt|gt|quot|#39);/g, Ui = /[&<>"']/g, bn = RegExp(En.source), Ei = RegExp(Ui.source), Xr = /<%-([\s\S]+?)%>/g, cn = /<%([\s\S]+?)%>/g, bi = /<%=([\s\S]+?)%>/g, qr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, gr = /^\w*$/, $s = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, fo = /[\\^$.*+?()[\]{}|]/g, Br = RegExp(fo.source), sa = /^\s+/, _i = /\s/, Gs = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Vs = /\{\n\/\* \[wrapped with (.+)\] \*/, ua = /,? & /, Ws = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, la = /[()=,{}\[\]\/\s]/, ho = /\\(\\)?/g, Xs = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, zn = /\w*$/, Jn = /^[-+]0x[0-9a-f]+$/i, $c = /^0b[01]+$/i, po = /^\[object .+?Constructor\]$/, go = /^0o[0-7]+$/i, Gc = /^(?:0|[1-9]\d*)$/, Vc = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, ca = /($^)/, Wc = /['\n\r\u2028\u2029\\]/g, xi = "\\ud800-\\udfff", qs = "\\u0300-\\u036f", zs = "\\ufe20-\\ufe2f", Js = "\\u20d0-\\u20ff", Bo = qs + zs + Js, wo = "\\u2700-\\u27bf", mo = "a-z\\xdf-\\xf6\\xf8-\\xff", js = "\\xac\\xb1\\xd7\\xf7", _t = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", zr = "\\u2000-\\u206f", fa = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Ys = "A-Z\\xc0-\\xd6\\xd8-\\xde", Zs = "\\ufe0e\\ufe0f", vo = js + _t + zr + fa, Jr = "['’]", Au = "[" + xi + "]", eu = "[" + vo + "]", ha = "[" + Bo + "]", Vt = "\\d+", Xc = "[" + wo + "]", tu = "[" + mo + "]", wr = "[^" + xi + vo + Vt + wo + mo + Ys + "]", da = "\\ud83c[\\udffb-\\udfff]", _n = "(?:" + ha + "|" + da + ")", pa = "[^" + xi + "]", xn = "(?:\\ud83c[\\udde6-\\uddff]){2}", jr = "[\\ud800-\\udbff][\\udc00-\\udfff]", Yr = "[" + Ys + "]", nu = "\\u200d", ga = "(?:" + tu + "|" + wr + ")", mr = "(?:" + Yr + "|" + wr + ")", ru = "(?:" + Jr + "(?:d|ll|m|re|s|t|ve))?", Ba = "(?:" + Jr + "(?:D|LL|M|RE|S|T|VE))?", wa = _n + "?", iu = "[" + Zs + "]?", qc = "(?:" + nu + "(?:" + [pa, xn, jr].join("|") + ")" + iu + wa + ")*", au = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", zc = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ou = iu + wa + qc, Jc = "(?:" + [Xc, xn, jr].join("|") + ")" + ou, jc = "(?:" + [pa + ha + "?", ha, xn, jr, Au].join("|") + ")", su = RegExp(Jr, "g"), uu = RegExp(ha, "g"), Ii = RegExp(da + "(?=" + da + ")|" + jc + ou, "g"), lu = RegExp([
      Yr + "?" + tu + "+" + ru + "(?=" + [eu, Yr, "$"].join("|") + ")",
      mr + "+" + Ba + "(?=" + [eu, Yr + ga, "$"].join("|") + ")",
      Yr + "?" + ga + "+" + ru,
      Yr + "+" + Ba,
      zc,
      au,
      Vt,
      Jc
    ].join("|"), "g"), yo = RegExp("[" + nu + xi + Bo + Zs + "]"), Zr = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, cu = [
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
    ], fu = -1, Pe = {};
    Pe[ln] = Pe[pr] = Pe[Fi] = Pe[Vr] = Pe[Wr] = Pe[gA] = Pe[PA] = Pe[qA] = Pe[Ce] = !0, Pe[k] = Pe[oA] = Pe[Et] = Pe[IA] = Pe[Bt] = Pe[JA] = Pe[q] = Pe[X] = Pe[tA] = Pe[cA] = Pe[YA] = Pe[he] = Pe[de] = Pe[De] = Pe[Ut] = !1;
    var Ke = {};
    Ke[k] = Ke[oA] = Ke[Et] = Ke[Bt] = Ke[IA] = Ke[JA] = Ke[ln] = Ke[pr] = Ke[Fi] = Ke[Vr] = Ke[Wr] = Ke[tA] = Ke[cA] = Ke[YA] = Ke[he] = Ke[de] = Ke[De] = Ke[fe] = Ke[gA] = Ke[PA] = Ke[qA] = Ke[Ce] = !0, Ke[q] = Ke[X] = Ke[Ut] = !1;
    var Yc = {
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
    }, Zc = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, Af = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, ef = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, tf = parseFloat, hu = parseInt, du = typeof Wi == "object" && Wi && Wi.Object === Object && Wi, nf = typeof self == "object" && self && self.Object === Object && self, Ze = du || nf || Function("return this")(), Co = e && !e.nodeType && e, fn = Co && !0 && A && !A.nodeType && A, Ai = fn && fn.exports === Co, Hi = Ai && du.process, Mt = function() {
      try {
        var eA = fn && fn.require && fn.require("util").types;
        return eA || Hi && Hi.binding && Hi.binding("util");
      } catch {
      }
    }(), Qo = Mt && Mt.isArrayBuffer, ma = Mt && Mt.isDate, Fo = Mt && Mt.isMap, Uo = Mt && Mt.isRegExp, pu = Mt && Mt.isSet, gu = Mt && Mt.isTypedArray;
    function u(eA, hA, uA) {
      switch (uA.length) {
        case 0:
          return eA.call(hA);
        case 1:
          return eA.call(hA, uA[0]);
        case 2:
          return eA.call(hA, uA[0], uA[1]);
        case 3:
          return eA.call(hA, uA[0], uA[1], uA[2]);
      }
      return eA.apply(hA, uA);
    }
    function d(eA, hA, uA, KA) {
      for (var ae = -1, He = eA == null ? 0 : eA.length; ++ae < He; ) {
        var At = eA[ae];
        hA(KA, At, uA(At), eA);
      }
      return KA;
    }
    function m(eA, hA) {
      for (var uA = -1, KA = eA == null ? 0 : eA.length; ++uA < KA && hA(eA[uA], uA, eA) !== !1; )
        ;
      return eA;
    }
    function y(eA, hA) {
      for (var uA = eA == null ? 0 : eA.length; uA-- && hA(eA[uA], uA, eA) !== !1; )
        ;
      return eA;
    }
    function E(eA, hA) {
      for (var uA = -1, KA = eA == null ? 0 : eA.length; ++uA < KA; )
        if (!hA(eA[uA], uA, eA))
          return !1;
      return !0;
    }
    function x(eA, hA) {
      for (var uA = -1, KA = eA == null ? 0 : eA.length, ae = 0, He = []; ++uA < KA; ) {
        var At = eA[uA];
        hA(At, uA, eA) && (He[ae++] = At);
      }
      return He;
    }
    function H(eA, hA) {
      var uA = eA == null ? 0 : eA.length;
      return !!uA && ze(eA, hA, 0) > -1;
    }
    function K(eA, hA, uA) {
      for (var KA = -1, ae = eA == null ? 0 : eA.length; ++KA < ae; )
        if (uA(hA, eA[KA]))
          return !0;
      return !1;
    }
    function J(eA, hA) {
      for (var uA = -1, KA = eA == null ? 0 : eA.length, ae = Array(KA); ++uA < KA; )
        ae[uA] = hA(eA[uA], uA, eA);
      return ae;
    }
    function Z(eA, hA) {
      for (var uA = -1, KA = hA.length, ae = eA.length; ++uA < KA; )
        eA[ae + uA] = hA[uA];
      return eA;
    }
    function rA(eA, hA, uA, KA) {
      var ae = -1, He = eA == null ? 0 : eA.length;
      for (KA && He && (uA = eA[++ae]); ++ae < He; )
        uA = hA(uA, eA[ae], ae, eA);
      return uA;
    }
    function UA(eA, hA, uA, KA) {
      var ae = eA == null ? 0 : eA.length;
      for (KA && ae && (uA = eA[--ae]); ae--; )
        uA = hA(uA, eA[ae], ae, eA);
      return uA;
    }
    function TA(eA, hA) {
      for (var uA = -1, KA = eA == null ? 0 : eA.length; ++uA < KA; )
        if (hA(eA[uA], uA, eA))
          return !0;
      return !1;
    }
    var EA = le("length");
    function ie(eA) {
      return eA.split("");
    }
    function Ae(eA) {
      return eA.match(Ws) || [];
    }
    function se(eA, hA, uA) {
      var KA;
      return uA(eA, function(ae, He, At) {
        if (hA(ae, He, At))
          return KA = He, !1;
      }), KA;
    }
    function ht(eA, hA, uA, KA) {
      for (var ae = eA.length, He = uA + (KA ? 1 : -1); KA ? He-- : ++He < ae; )
        if (hA(eA[He], He, eA))
          return He;
      return -1;
    }
    function ze(eA, hA, uA) {
      return hA === hA ? Qa(eA, hA, uA) : ht(eA, $A, uA);
    }
    function jn(eA, hA, uA, KA) {
      for (var ae = uA - 1, He = eA.length; ++ae < He; )
        if (KA(eA[ae], hA))
          return ae;
      return -1;
    }
    function $A(eA) {
      return eA !== eA;
    }
    function ut(eA, hA) {
      var uA = eA == null ? 0 : eA.length;
      return uA ? xt(eA, hA) / uA : lA;
    }
    function le(eA) {
      return function(hA) {
        return hA == null ? t : hA[eA];
      };
    }
    function Xe(eA) {
      return function(hA) {
        return eA == null ? t : eA[hA];
      };
    }
    function In(eA, hA, uA, KA, ae) {
      return ae(eA, function(He, At, be) {
        uA = KA ? (KA = !1, He) : hA(uA, He, At, be);
      }), uA;
    }
    function va(eA, hA) {
      var uA = eA.length;
      for (eA.sort(hA); uA--; )
        eA[uA] = eA[uA].value;
      return eA;
    }
    function xt(eA, hA) {
      for (var uA, KA = -1, ae = eA.length; ++KA < ae; ) {
        var He = hA(eA[KA]);
        He !== t && (uA = uA === t ? He : uA + He);
      }
      return uA;
    }
    function Hn(eA, hA) {
      for (var uA = -1, KA = Array(eA); ++uA < eA; )
        KA[uA] = hA(uA);
      return KA;
    }
    function Yn(eA, hA) {
      return J(hA, function(uA) {
        return [uA, eA[uA]];
      });
    }
    function Sn(eA) {
      return eA && eA.slice(0, vu(eA) + 1).replace(sa, "");
    }
    function Re(eA) {
      return function(hA) {
        return eA(hA);
      };
    }
    function It(eA, hA) {
      return J(hA, function(uA) {
        return eA[uA];
      });
    }
    function Si(eA, hA) {
      return eA.has(hA);
    }
    function Ln(eA, hA) {
      for (var uA = -1, KA = eA.length; ++uA < KA && ze(hA, eA[uA], 0) > -1; )
        ;
      return uA;
    }
    function Eo(eA, hA) {
      for (var uA = eA.length; uA-- && ze(hA, eA[uA], 0) > -1; )
        ;
      return uA;
    }
    function vr(eA, hA) {
      for (var uA = eA.length, KA = 0; uA--; )
        eA[uA] === hA && ++KA;
      return KA;
    }
    var bo = Xe(Yc), Oe = Xe(Zc);
    function yr(eA) {
      return "\\" + ef[eA];
    }
    function Bu(eA, hA) {
      return eA == null ? t : eA[hA];
    }
    function Zn(eA) {
      return yo.test(eA);
    }
    function rf(eA) {
      return Zr.test(eA);
    }
    function ya(eA) {
      for (var hA, uA = []; !(hA = eA.next()).done; )
        uA.push(hA.value);
      return uA;
    }
    function _o(eA) {
      var hA = -1, uA = Array(eA.size);
      return eA.forEach(function(KA, ae) {
        uA[++hA] = [ae, KA];
      }), uA;
    }
    function wu(eA, hA) {
      return function(uA) {
        return eA(hA(uA));
      };
    }
    function Ar(eA, hA) {
      for (var uA = -1, KA = eA.length, ae = 0, He = []; ++uA < KA; ) {
        var At = eA[uA];
        (At === hA || At === w) && (eA[uA] = w, He[ae++] = uA);
      }
      return He;
    }
    function Ca(eA) {
      var hA = -1, uA = Array(eA.size);
      return eA.forEach(function(KA) {
        uA[++hA] = KA;
      }), uA;
    }
    function mu(eA) {
      var hA = -1, uA = Array(eA.size);
      return eA.forEach(function(KA) {
        uA[++hA] = [KA, KA];
      }), uA;
    }
    function Qa(eA, hA, uA) {
      for (var KA = uA - 1, ae = eA.length; ++KA < ae; )
        if (eA[KA] === hA)
          return KA;
      return -1;
    }
    function af(eA, hA, uA) {
      for (var KA = uA + 1; KA--; )
        if (eA[KA] === hA)
          return KA;
      return KA;
    }
    function ei(eA) {
      return Zn(eA) ? of(eA) : EA(eA);
    }
    function wt(eA) {
      return Zn(eA) ? Tn(eA) : ie(eA);
    }
    function vu(eA) {
      for (var hA = eA.length; hA-- && _i.test(eA.charAt(hA)); )
        ;
      return hA;
    }
    var xo = Xe(Af);
    function of(eA) {
      for (var hA = Ii.lastIndex = 0; Ii.test(eA); )
        ++hA;
      return hA;
    }
    function Tn(eA) {
      return eA.match(Ii) || [];
    }
    function Dn(eA) {
      return eA.match(lu) || [];
    }
    var yu = function eA(hA) {
      hA = hA == null ? Ze : Ie.defaults(Ze.Object(), hA, Ie.pick(Ze, cu));
      var uA = hA.Array, KA = hA.Date, ae = hA.Error, He = hA.Function, At = hA.Math, be = hA.Object, Li = hA.RegExp, Cu = hA.String, mt = hA.TypeError, ti = uA.prototype, Io = He.prototype, ni = be.prototype, Cr = hA["__core-js_shared__"], ri = Io.toString, Se = ni.hasOwnProperty, sf = 0, M = function() {
        var r = /[^.]+$/.exec(Cr && Cr.keys && Cr.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), V = ni.toString, AA = ri.call(be), pA = Ze._, sA = Li(
        "^" + ri.call(Se).replace(fo, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), CA = Ai ? hA.Buffer : t, wA = hA.Symbol, LA = hA.Uint8Array, VA = CA ? CA.allocUnsafe : t, re = wu(be.getPrototypeOf, be), WA = be.create, ee = ni.propertyIsEnumerable, pe = ti.splice, Le = wA ? wA.isConcatSpreadable : t, zA = wA ? wA.iterator : t, $e = wA ? wA.toStringTag : t, et = function() {
        try {
          var r = Pi(be, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), Pt = hA.clearTimeout !== Ze.clearTimeout && hA.clearTimeout, Ve = KA && KA.now !== Ze.Date.now && KA.now, Ti = hA.setTimeout !== Ze.setTimeout && hA.setTimeout, er = At.ceil, dt = At.floor, uf = be.getOwnPropertySymbols, Oy = CA ? CA.isBuffer : t, qp = hA.isFinite, Ny = ti.join, My = wu(be.keys, be), lt = At.max, Ht = At.min, Py = KA.now, Ky = hA.parseInt, zp = At.random, Ry = ti.reverse, lf = Pi(hA, "DataView"), Ho = Pi(hA, "Map"), cf = Pi(hA, "Promise"), Fa = Pi(hA, "Set"), So = Pi(hA, "WeakMap"), Lo = Pi(be, "create"), Qu = So && new So(), Ua = {}, ky = Ki(lf), $y = Ki(Ho), Gy = Ki(cf), Vy = Ki(Fa), Wy = Ki(So), Fu = wA ? wA.prototype : t, To = Fu ? Fu.valueOf : t, Jp = Fu ? Fu.toString : t;
      function T(r) {
        if (Ye(r) && !ce(r) && !(r instanceof Ue)) {
          if (r instanceof hn)
            return r;
          if (Se.call(r, "__wrapped__"))
            return jg(r);
        }
        return new hn(r);
      }
      var Ea = /* @__PURE__ */ function() {
        function r() {
        }
        return function(a) {
          if (!je(a))
            return {};
          if (WA)
            return WA(a);
          r.prototype = a;
          var g = new r();
          return r.prototype = t, g;
        };
      }();
      function Uu() {
      }
      function hn(r, a) {
        this.__wrapped__ = r, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
      }
      T.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: Xr,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: cn,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: bi,
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
          _: T
        }
      }, T.prototype = Uu.prototype, T.prototype.constructor = T, hn.prototype = Ea(Uu.prototype), hn.prototype.constructor = hn;
      function Ue(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = D, this.__views__ = [];
      }
      function Xy() {
        var r = new Ue(this.__wrapped__);
        return r.__actions__ = Wt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = Wt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = Wt(this.__views__), r;
      }
      function qy() {
        if (this.__filtered__) {
          var r = new Ue(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function zy() {
        var r = this.__wrapped__.value(), a = this.__dir__, g = ce(r), Q = a < 0, I = g ? r.length : 0, N = oQ(0, I, this.__views__), $ = N.start, W = N.end, nA = W - $, vA = Q ? W : $ - 1, yA = this.__iteratees__, xA = yA.length, OA = 0, GA = Ht(nA, this.__takeCount__);
        if (!g || !Q && I == nA && GA == nA)
          return vg(r, this.__actions__);
        var te = [];
        A:
          for (; nA-- && OA < GA; ) {
            vA += a;
            for (var we = -1, ne = r[vA]; ++we < xA; ) {
              var Fe = yA[we], _e = Fe.iteratee, rn = Fe.type, kt = _e(ne);
              if (rn == QA)
                ne = kt;
              else if (!kt) {
                if (rn == z)
                  continue A;
                break A;
              }
            }
            te[OA++] = ne;
          }
        return te;
      }
      Ue.prototype = Ea(Uu.prototype), Ue.prototype.constructor = Ue;
      function Di(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function Jy() {
        this.__data__ = Lo ? Lo(null) : {}, this.size = 0;
      }
      function jy(r) {
        var a = this.has(r) && delete this.__data__[r];
        return this.size -= a ? 1 : 0, a;
      }
      function Yy(r) {
        var a = this.__data__;
        if (Lo) {
          var g = a[r];
          return g === c ? t : g;
        }
        return Se.call(a, r) ? a[r] : t;
      }
      function Zy(r) {
        var a = this.__data__;
        return Lo ? a[r] !== t : Se.call(a, r);
      }
      function AC(r, a) {
        var g = this.__data__;
        return this.size += this.has(r) ? 0 : 1, g[r] = Lo && a === t ? c : a, this;
      }
      Di.prototype.clear = Jy, Di.prototype.delete = jy, Di.prototype.get = Yy, Di.prototype.has = Zy, Di.prototype.set = AC;
      function Qr(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function eC() {
        this.__data__ = [], this.size = 0;
      }
      function tC(r) {
        var a = this.__data__, g = Eu(a, r);
        if (g < 0)
          return !1;
        var Q = a.length - 1;
        return g == Q ? a.pop() : pe.call(a, g, 1), --this.size, !0;
      }
      function nC(r) {
        var a = this.__data__, g = Eu(a, r);
        return g < 0 ? t : a[g][1];
      }
      function rC(r) {
        return Eu(this.__data__, r) > -1;
      }
      function iC(r, a) {
        var g = this.__data__, Q = Eu(g, r);
        return Q < 0 ? (++this.size, g.push([r, a])) : g[Q][1] = a, this;
      }
      Qr.prototype.clear = eC, Qr.prototype.delete = tC, Qr.prototype.get = nC, Qr.prototype.has = rC, Qr.prototype.set = iC;
      function Fr(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function aC() {
        this.size = 0, this.__data__ = {
          hash: new Di(),
          map: new (Ho || Qr)(),
          string: new Di()
        };
      }
      function oC(r) {
        var a = Mu(this, r).delete(r);
        return this.size -= a ? 1 : 0, a;
      }
      function sC(r) {
        return Mu(this, r).get(r);
      }
      function uC(r) {
        return Mu(this, r).has(r);
      }
      function lC(r, a) {
        var g = Mu(this, r), Q = g.size;
        return g.set(r, a), this.size += g.size == Q ? 0 : 1, this;
      }
      Fr.prototype.clear = aC, Fr.prototype.delete = oC, Fr.prototype.get = sC, Fr.prototype.has = uC, Fr.prototype.set = lC;
      function Oi(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.__data__ = new Fr(); ++a < g; )
          this.add(r[a]);
      }
      function cC(r) {
        return this.__data__.set(r, c), this;
      }
      function fC(r) {
        return this.__data__.has(r);
      }
      Oi.prototype.add = Oi.prototype.push = cC, Oi.prototype.has = fC;
      function On(r) {
        var a = this.__data__ = new Qr(r);
        this.size = a.size;
      }
      function hC() {
        this.__data__ = new Qr(), this.size = 0;
      }
      function dC(r) {
        var a = this.__data__, g = a.delete(r);
        return this.size = a.size, g;
      }
      function pC(r) {
        return this.__data__.get(r);
      }
      function gC(r) {
        return this.__data__.has(r);
      }
      function BC(r, a) {
        var g = this.__data__;
        if (g instanceof Qr) {
          var Q = g.__data__;
          if (!Ho || Q.length < i - 1)
            return Q.push([r, a]), this.size = ++g.size, this;
          g = this.__data__ = new Fr(Q);
        }
        return g.set(r, a), this.size = g.size, this;
      }
      On.prototype.clear = hC, On.prototype.delete = dC, On.prototype.get = pC, On.prototype.has = gC, On.prototype.set = BC;
      function jp(r, a) {
        var g = ce(r), Q = !g && Ri(r), I = !g && !Q && ui(r), N = !g && !Q && !I && Ia(r), $ = g || Q || I || N, W = $ ? Hn(r.length, Cu) : [], nA = W.length;
        for (var vA in r)
          (a || Se.call(r, vA)) && !($ && // Safari 9 has enumerable `arguments.length` in strict mode.
          (vA == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          I && (vA == "offset" || vA == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          N && (vA == "buffer" || vA == "byteLength" || vA == "byteOffset") || // Skip index properties.
          _r(vA, nA))) && W.push(vA);
        return W;
      }
      function Yp(r) {
        var a = r.length;
        return a ? r[Cf(0, a - 1)] : t;
      }
      function wC(r, a) {
        return Pu(Wt(r), Ni(a, 0, r.length));
      }
      function mC(r) {
        return Pu(Wt(r));
      }
      function ff(r, a, g) {
        (g !== t && !Nn(r[a], g) || g === t && !(a in r)) && Ur(r, a, g);
      }
      function Do(r, a, g) {
        var Q = r[a];
        (!(Se.call(r, a) && Nn(Q, g)) || g === t && !(a in r)) && Ur(r, a, g);
      }
      function Eu(r, a) {
        for (var g = r.length; g--; )
          if (Nn(r[g][0], a))
            return g;
        return -1;
      }
      function vC(r, a, g, Q) {
        return ii(r, function(I, N, $) {
          a(Q, I, g(I), $);
        }), Q;
      }
      function Zp(r, a) {
        return r && nr(a, pt(a), r);
      }
      function yC(r, a) {
        return r && nr(a, qt(a), r);
      }
      function Ur(r, a, g) {
        a == "__proto__" && et ? et(r, a, {
          configurable: !0,
          enumerable: !0,
          value: g,
          writable: !0
        }) : r[a] = g;
      }
      function hf(r, a) {
        for (var g = -1, Q = a.length, I = uA(Q), N = r == null; ++g < Q; )
          I[g] = N ? t : Xf(r, a[g]);
        return I;
      }
      function Ni(r, a, g) {
        return r === r && (g !== t && (r = r <= g ? r : g), a !== t && (r = r >= a ? r : a)), r;
      }
      function dn(r, a, g, Q, I, N) {
        var $, W = a & B, nA = a & p, vA = a & v;
        if (g && ($ = I ? g(r, Q, I, N) : g(r)), $ !== t)
          return $;
        if (!je(r))
          return r;
        var yA = ce(r);
        if (yA) {
          if ($ = uQ(r), !W)
            return Wt(r, $);
        } else {
          var xA = St(r), OA = xA == X || xA == G;
          if (ui(r))
            return Qg(r, W);
          if (xA == YA || xA == k || OA && !I) {
            if ($ = nA || OA ? {} : kg(r), !W)
              return nA ? YC(r, yC($, r)) : jC(r, Zp($, r));
          } else {
            if (!Ke[xA])
              return I ? r : {};
            $ = lQ(r, xA, W);
          }
        }
        N || (N = new On());
        var GA = N.get(r);
        if (GA)
          return GA;
        N.set(r, $), BB(r) ? r.forEach(function(ne) {
          $.add(dn(ne, a, g, ne, r, N));
        }) : pB(r) && r.forEach(function(ne, Fe) {
          $.set(Fe, dn(ne, a, g, Fe, r, N));
        });
        var te = vA ? nA ? Lf : Sf : nA ? qt : pt, we = yA ? t : te(r);
        return m(we || r, function(ne, Fe) {
          we && (Fe = ne, ne = r[Fe]), Do($, Fe, dn(ne, a, g, Fe, r, N));
        }), $;
      }
      function CC(r) {
        var a = pt(r);
        return function(g) {
          return Ag(g, r, a);
        };
      }
      function Ag(r, a, g) {
        var Q = g.length;
        if (r == null)
          return !Q;
        for (r = be(r); Q--; ) {
          var I = g[Q], N = a[I], $ = r[I];
          if ($ === t && !(I in r) || !N($))
            return !1;
        }
        return !0;
      }
      function eg(r, a, g) {
        if (typeof r != "function")
          throw new mt(l);
        return ko(function() {
          r.apply(t, g);
        }, a);
      }
      function Oo(r, a, g, Q) {
        var I = -1, N = H, $ = !0, W = r.length, nA = [], vA = a.length;
        if (!W)
          return nA;
        g && (a = J(a, Re(g))), Q ? (N = K, $ = !1) : a.length >= i && (N = Si, $ = !1, a = new Oi(a));
        A:
          for (; ++I < W; ) {
            var yA = r[I], xA = g == null ? yA : g(yA);
            if (yA = Q || yA !== 0 ? yA : 0, $ && xA === xA) {
              for (var OA = vA; OA--; )
                if (a[OA] === xA)
                  continue A;
              nA.push(yA);
            } else N(a, xA, Q) || nA.push(yA);
          }
        return nA;
      }
      var ii = _g(tr), tg = _g(pf, !0);
      function QC(r, a) {
        var g = !0;
        return ii(r, function(Q, I, N) {
          return g = !!a(Q, I, N), g;
        }), g;
      }
      function bu(r, a, g) {
        for (var Q = -1, I = r.length; ++Q < I; ) {
          var N = r[Q], $ = a(N);
          if ($ != null && (W === t ? $ === $ && !nn($) : g($, W)))
            var W = $, nA = N;
        }
        return nA;
      }
      function FC(r, a, g, Q) {
        var I = r.length;
        for (g = ge(g), g < 0 && (g = -g > I ? 0 : I + g), Q = Q === t || Q > I ? I : ge(Q), Q < 0 && (Q += I), Q = g > Q ? 0 : mB(Q); g < Q; )
          r[g++] = a;
        return r;
      }
      function ng(r, a) {
        var g = [];
        return ii(r, function(Q, I, N) {
          a(Q, I, N) && g.push(Q);
        }), g;
      }
      function vt(r, a, g, Q, I) {
        var N = -1, $ = r.length;
        for (g || (g = fQ), I || (I = []); ++N < $; ) {
          var W = r[N];
          a > 0 && g(W) ? a > 1 ? vt(W, a - 1, g, Q, I) : Z(I, W) : Q || (I[I.length] = W);
        }
        return I;
      }
      var df = xg(), rg = xg(!0);
      function tr(r, a) {
        return r && df(r, a, pt);
      }
      function pf(r, a) {
        return r && rg(r, a, pt);
      }
      function _u(r, a) {
        return x(a, function(g) {
          return xr(r[g]);
        });
      }
      function Mi(r, a) {
        a = oi(a, r);
        for (var g = 0, Q = a.length; r != null && g < Q; )
          r = r[rr(a[g++])];
        return g && g == Q ? r : t;
      }
      function ig(r, a, g) {
        var Q = a(r);
        return ce(r) ? Q : Z(Q, g(r));
      }
      function Kt(r) {
        return r == null ? r === t ? Ot : DA : $e && $e in be(r) ? aQ(r) : mQ(r);
      }
      function gf(r, a) {
        return r > a;
      }
      function UC(r, a) {
        return r != null && Se.call(r, a);
      }
      function EC(r, a) {
        return r != null && a in be(r);
      }
      function bC(r, a, g) {
        return r >= Ht(a, g) && r < lt(a, g);
      }
      function Bf(r, a, g) {
        for (var Q = g ? K : H, I = r[0].length, N = r.length, $ = N, W = uA(N), nA = 1 / 0, vA = []; $--; ) {
          var yA = r[$];
          $ && a && (yA = J(yA, Re(a))), nA = Ht(yA.length, nA), W[$] = !g && (a || I >= 120 && yA.length >= 120) ? new Oi($ && yA) : t;
        }
        yA = r[0];
        var xA = -1, OA = W[0];
        A:
          for (; ++xA < I && vA.length < nA; ) {
            var GA = yA[xA], te = a ? a(GA) : GA;
            if (GA = g || GA !== 0 ? GA : 0, !(OA ? Si(OA, te) : Q(vA, te, g))) {
              for ($ = N; --$; ) {
                var we = W[$];
                if (!(we ? Si(we, te) : Q(r[$], te, g)))
                  continue A;
              }
              OA && OA.push(te), vA.push(GA);
            }
          }
        return vA;
      }
      function _C(r, a, g, Q) {
        return tr(r, function(I, N, $) {
          a(Q, g(I), N, $);
        }), Q;
      }
      function No(r, a, g) {
        a = oi(a, r), r = Wg(r, a);
        var Q = r == null ? r : r[rr(gn(a))];
        return Q == null ? t : u(Q, r, g);
      }
      function ag(r) {
        return Ye(r) && Kt(r) == k;
      }
      function xC(r) {
        return Ye(r) && Kt(r) == Et;
      }
      function IC(r) {
        return Ye(r) && Kt(r) == JA;
      }
      function Mo(r, a, g, Q, I) {
        return r === a ? !0 : r == null || a == null || !Ye(r) && !Ye(a) ? r !== r && a !== a : HC(r, a, g, Q, Mo, I);
      }
      function HC(r, a, g, Q, I, N) {
        var $ = ce(r), W = ce(a), nA = $ ? oA : St(r), vA = W ? oA : St(a);
        nA = nA == k ? YA : nA, vA = vA == k ? YA : vA;
        var yA = nA == YA, xA = vA == YA, OA = nA == vA;
        if (OA && ui(r)) {
          if (!ui(a))
            return !1;
          $ = !0, yA = !1;
        }
        if (OA && !yA)
          return N || (N = new On()), $ || Ia(r) ? Pg(r, a, g, Q, I, N) : rQ(r, a, nA, g, Q, I, N);
        if (!(g & o)) {
          var GA = yA && Se.call(r, "__wrapped__"), te = xA && Se.call(a, "__wrapped__");
          if (GA || te) {
            var we = GA ? r.value() : r, ne = te ? a.value() : a;
            return N || (N = new On()), I(we, ne, g, Q, N);
          }
        }
        return OA ? (N || (N = new On()), iQ(r, a, g, Q, I, N)) : !1;
      }
      function SC(r) {
        return Ye(r) && St(r) == tA;
      }
      function wf(r, a, g, Q) {
        var I = g.length, N = I, $ = !Q;
        if (r == null)
          return !N;
        for (r = be(r); I--; ) {
          var W = g[I];
          if ($ && W[2] ? W[1] !== r[W[0]] : !(W[0] in r))
            return !1;
        }
        for (; ++I < N; ) {
          W = g[I];
          var nA = W[0], vA = r[nA], yA = W[1];
          if ($ && W[2]) {
            if (vA === t && !(nA in r))
              return !1;
          } else {
            var xA = new On();
            if (Q)
              var OA = Q(vA, yA, nA, r, a, xA);
            if (!(OA === t ? Mo(yA, vA, o | C, Q, xA) : OA))
              return !1;
          }
        }
        return !0;
      }
      function og(r) {
        if (!je(r) || dQ(r))
          return !1;
        var a = xr(r) ? sA : po;
        return a.test(Ki(r));
      }
      function LC(r) {
        return Ye(r) && Kt(r) == he;
      }
      function TC(r) {
        return Ye(r) && St(r) == de;
      }
      function DC(r) {
        return Ye(r) && Vu(r.length) && !!Pe[Kt(r)];
      }
      function sg(r) {
        return typeof r == "function" ? r : r == null ? zt : typeof r == "object" ? ce(r) ? cg(r[0], r[1]) : lg(r) : IB(r);
      }
      function mf(r) {
        if (!Ro(r))
          return My(r);
        var a = [];
        for (var g in be(r))
          Se.call(r, g) && g != "constructor" && a.push(g);
        return a;
      }
      function OC(r) {
        if (!je(r))
          return wQ(r);
        var a = Ro(r), g = [];
        for (var Q in r)
          Q == "constructor" && (a || !Se.call(r, Q)) || g.push(Q);
        return g;
      }
      function vf(r, a) {
        return r < a;
      }
      function ug(r, a) {
        var g = -1, Q = Xt(r) ? uA(r.length) : [];
        return ii(r, function(I, N, $) {
          Q[++g] = a(I, N, $);
        }), Q;
      }
      function lg(r) {
        var a = Df(r);
        return a.length == 1 && a[0][2] ? Gg(a[0][0], a[0][1]) : function(g) {
          return g === r || wf(g, r, a);
        };
      }
      function cg(r, a) {
        return Nf(r) && $g(a) ? Gg(rr(r), a) : function(g) {
          var Q = Xf(g, r);
          return Q === t && Q === a ? qf(g, r) : Mo(a, Q, o | C);
        };
      }
      function xu(r, a, g, Q, I) {
        r !== a && df(a, function(N, $) {
          if (I || (I = new On()), je(N))
            NC(r, a, $, g, xu, Q, I);
          else {
            var W = Q ? Q(Pf(r, $), N, $ + "", r, a, I) : t;
            W === t && (W = N), ff(r, $, W);
          }
        }, qt);
      }
      function NC(r, a, g, Q, I, N, $) {
        var W = Pf(r, g), nA = Pf(a, g), vA = $.get(nA);
        if (vA) {
          ff(r, g, vA);
          return;
        }
        var yA = N ? N(W, nA, g + "", r, a, $) : t, xA = yA === t;
        if (xA) {
          var OA = ce(nA), GA = !OA && ui(nA), te = !OA && !GA && Ia(nA);
          yA = nA, OA || GA || te ? ce(W) ? yA = W : tt(W) ? yA = Wt(W) : GA ? (xA = !1, yA = Qg(nA, !0)) : te ? (xA = !1, yA = Fg(nA, !0)) : yA = [] : $o(nA) || Ri(nA) ? (yA = W, Ri(W) ? yA = vB(W) : (!je(W) || xr(W)) && (yA = kg(nA))) : xA = !1;
        }
        xA && ($.set(nA, yA), I(yA, nA, Q, N, $), $.delete(nA)), ff(r, g, yA);
      }
      function fg(r, a) {
        var g = r.length;
        if (g)
          return a += a < 0 ? g : 0, _r(a, g) ? r[a] : t;
      }
      function hg(r, a, g) {
        a.length ? a = J(a, function(N) {
          return ce(N) ? function($) {
            return Mi($, N.length === 1 ? N[0] : N);
          } : N;
        }) : a = [zt];
        var Q = -1;
        a = J(a, Re(ZA()));
        var I = ug(r, function(N, $, W) {
          var nA = J(a, function(vA) {
            return vA(N);
          });
          return { criteria: nA, index: ++Q, value: N };
        });
        return va(I, function(N, $) {
          return JC(N, $, g);
        });
      }
      function MC(r, a) {
        return dg(r, a, function(g, Q) {
          return qf(r, Q);
        });
      }
      function dg(r, a, g) {
        for (var Q = -1, I = a.length, N = {}; ++Q < I; ) {
          var $ = a[Q], W = Mi(r, $);
          g(W, $) && Po(N, oi($, r), W);
        }
        return N;
      }
      function PC(r) {
        return function(a) {
          return Mi(a, r);
        };
      }
      function yf(r, a, g, Q) {
        var I = Q ? jn : ze, N = -1, $ = a.length, W = r;
        for (r === a && (a = Wt(a)), g && (W = J(r, Re(g))); ++N < $; )
          for (var nA = 0, vA = a[N], yA = g ? g(vA) : vA; (nA = I(W, yA, nA, Q)) > -1; )
            W !== r && pe.call(W, nA, 1), pe.call(r, nA, 1);
        return r;
      }
      function pg(r, a) {
        for (var g = r ? a.length : 0, Q = g - 1; g--; ) {
          var I = a[g];
          if (g == Q || I !== N) {
            var N = I;
            _r(I) ? pe.call(r, I, 1) : Uf(r, I);
          }
        }
        return r;
      }
      function Cf(r, a) {
        return r + dt(zp() * (a - r + 1));
      }
      function KC(r, a, g, Q) {
        for (var I = -1, N = lt(er((a - r) / (g || 1)), 0), $ = uA(N); N--; )
          $[Q ? N : ++I] = r, r += g;
        return $;
      }
      function Qf(r, a) {
        var g = "";
        if (!r || a < 1 || a > HA)
          return g;
        do
          a % 2 && (g += r), a = dt(a / 2), a && (r += r);
        while (a);
        return g;
      }
      function me(r, a) {
        return Kf(Vg(r, a, zt), r + "");
      }
      function RC(r) {
        return Yp(Ha(r));
      }
      function kC(r, a) {
        var g = Ha(r);
        return Pu(g, Ni(a, 0, g.length));
      }
      function Po(r, a, g, Q) {
        if (!je(r))
          return r;
        a = oi(a, r);
        for (var I = -1, N = a.length, $ = N - 1, W = r; W != null && ++I < N; ) {
          var nA = rr(a[I]), vA = g;
          if (nA === "__proto__" || nA === "constructor" || nA === "prototype")
            return r;
          if (I != $) {
            var yA = W[nA];
            vA = Q ? Q(yA, nA, W) : t, vA === t && (vA = je(yA) ? yA : _r(a[I + 1]) ? [] : {});
          }
          Do(W, nA, vA), W = W[nA];
        }
        return r;
      }
      var gg = Qu ? function(r, a) {
        return Qu.set(r, a), r;
      } : zt, $C = et ? function(r, a) {
        return et(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: Jf(a),
          writable: !0
        });
      } : zt;
      function GC(r) {
        return Pu(Ha(r));
      }
      function pn(r, a, g) {
        var Q = -1, I = r.length;
        a < 0 && (a = -a > I ? 0 : I + a), g = g > I ? I : g, g < 0 && (g += I), I = a > g ? 0 : g - a >>> 0, a >>>= 0;
        for (var N = uA(I); ++Q < I; )
          N[Q] = r[Q + a];
        return N;
      }
      function VC(r, a) {
        var g;
        return ii(r, function(Q, I, N) {
          return g = a(Q, I, N), !g;
        }), !!g;
      }
      function Iu(r, a, g) {
        var Q = 0, I = r == null ? Q : r.length;
        if (typeof a == "number" && a === a && I <= Y) {
          for (; Q < I; ) {
            var N = Q + I >>> 1, $ = r[N];
            $ !== null && !nn($) && (g ? $ <= a : $ < a) ? Q = N + 1 : I = N;
          }
          return I;
        }
        return Ff(r, a, zt, g);
      }
      function Ff(r, a, g, Q) {
        var I = 0, N = r == null ? 0 : r.length;
        if (N === 0)
          return 0;
        a = g(a);
        for (var $ = a !== a, W = a === null, nA = nn(a), vA = a === t; I < N; ) {
          var yA = dt((I + N) / 2), xA = g(r[yA]), OA = xA !== t, GA = xA === null, te = xA === xA, we = nn(xA);
          if ($)
            var ne = Q || te;
          else vA ? ne = te && (Q || OA) : W ? ne = te && OA && (Q || !GA) : nA ? ne = te && OA && !GA && (Q || !we) : GA || we ? ne = !1 : ne = Q ? xA <= a : xA < a;
          ne ? I = yA + 1 : N = yA;
        }
        return Ht(N, iA);
      }
      function Bg(r, a) {
        for (var g = -1, Q = r.length, I = 0, N = []; ++g < Q; ) {
          var $ = r[g], W = a ? a($) : $;
          if (!g || !Nn(W, nA)) {
            var nA = W;
            N[I++] = $ === 0 ? 0 : $;
          }
        }
        return N;
      }
      function wg(r) {
        return typeof r == "number" ? r : nn(r) ? lA : +r;
      }
      function tn(r) {
        if (typeof r == "string")
          return r;
        if (ce(r))
          return J(r, tn) + "";
        if (nn(r))
          return Jp ? Jp.call(r) : "";
        var a = r + "";
        return a == "0" && 1 / r == -BA ? "-0" : a;
      }
      function ai(r, a, g) {
        var Q = -1, I = H, N = r.length, $ = !0, W = [], nA = W;
        if (g)
          $ = !1, I = K;
        else if (N >= i) {
          var vA = a ? null : tQ(r);
          if (vA)
            return Ca(vA);
          $ = !1, I = Si, nA = new Oi();
        } else
          nA = a ? [] : W;
        A:
          for (; ++Q < N; ) {
            var yA = r[Q], xA = a ? a(yA) : yA;
            if (yA = g || yA !== 0 ? yA : 0, $ && xA === xA) {
              for (var OA = nA.length; OA--; )
                if (nA[OA] === xA)
                  continue A;
              a && nA.push(xA), W.push(yA);
            } else I(nA, xA, g) || (nA !== W && nA.push(xA), W.push(yA));
          }
        return W;
      }
      function Uf(r, a) {
        return a = oi(a, r), r = Wg(r, a), r == null || delete r[rr(gn(a))];
      }
      function mg(r, a, g, Q) {
        return Po(r, a, g(Mi(r, a)), Q);
      }
      function Hu(r, a, g, Q) {
        for (var I = r.length, N = Q ? I : -1; (Q ? N-- : ++N < I) && a(r[N], N, r); )
          ;
        return g ? pn(r, Q ? 0 : N, Q ? N + 1 : I) : pn(r, Q ? N + 1 : 0, Q ? I : N);
      }
      function vg(r, a) {
        var g = r;
        return g instanceof Ue && (g = g.value()), rA(a, function(Q, I) {
          return I.func.apply(I.thisArg, Z([Q], I.args));
        }, g);
      }
      function Ef(r, a, g) {
        var Q = r.length;
        if (Q < 2)
          return Q ? ai(r[0]) : [];
        for (var I = -1, N = uA(Q); ++I < Q; )
          for (var $ = r[I], W = -1; ++W < Q; )
            W != I && (N[I] = Oo(N[I] || $, r[W], a, g));
        return ai(vt(N, 1), a, g);
      }
      function yg(r, a, g) {
        for (var Q = -1, I = r.length, N = a.length, $ = {}; ++Q < I; ) {
          var W = Q < N ? a[Q] : t;
          g($, r[Q], W);
        }
        return $;
      }
      function bf(r) {
        return tt(r) ? r : [];
      }
      function _f(r) {
        return typeof r == "function" ? r : zt;
      }
      function oi(r, a) {
        return ce(r) ? r : Nf(r, a) ? [r] : Jg(Ne(r));
      }
      var WC = me;
      function si(r, a, g) {
        var Q = r.length;
        return g = g === t ? Q : g, !a && g >= Q ? r : pn(r, a, g);
      }
      var Cg = Pt || function(r) {
        return Ze.clearTimeout(r);
      };
      function Qg(r, a) {
        if (a)
          return r.slice();
        var g = r.length, Q = VA ? VA(g) : new r.constructor(g);
        return r.copy(Q), Q;
      }
      function xf(r) {
        var a = new r.constructor(r.byteLength);
        return new LA(a).set(new LA(r)), a;
      }
      function XC(r, a) {
        var g = a ? xf(r.buffer) : r.buffer;
        return new r.constructor(g, r.byteOffset, r.byteLength);
      }
      function qC(r) {
        var a = new r.constructor(r.source, zn.exec(r));
        return a.lastIndex = r.lastIndex, a;
      }
      function zC(r) {
        return To ? be(To.call(r)) : {};
      }
      function Fg(r, a) {
        var g = a ? xf(r.buffer) : r.buffer;
        return new r.constructor(g, r.byteOffset, r.length);
      }
      function Ug(r, a) {
        if (r !== a) {
          var g = r !== t, Q = r === null, I = r === r, N = nn(r), $ = a !== t, W = a === null, nA = a === a, vA = nn(a);
          if (!W && !vA && !N && r > a || N && $ && nA && !W && !vA || Q && $ && nA || !g && nA || !I)
            return 1;
          if (!Q && !N && !vA && r < a || vA && g && I && !Q && !N || W && g && I || !$ && I || !nA)
            return -1;
        }
        return 0;
      }
      function JC(r, a, g) {
        for (var Q = -1, I = r.criteria, N = a.criteria, $ = I.length, W = g.length; ++Q < $; ) {
          var nA = Ug(I[Q], N[Q]);
          if (nA) {
            if (Q >= W)
              return nA;
            var vA = g[Q];
            return nA * (vA == "desc" ? -1 : 1);
          }
        }
        return r.index - a.index;
      }
      function Eg(r, a, g, Q) {
        for (var I = -1, N = r.length, $ = g.length, W = -1, nA = a.length, vA = lt(N - $, 0), yA = uA(nA + vA), xA = !Q; ++W < nA; )
          yA[W] = a[W];
        for (; ++I < $; )
          (xA || I < N) && (yA[g[I]] = r[I]);
        for (; vA--; )
          yA[W++] = r[I++];
        return yA;
      }
      function bg(r, a, g, Q) {
        for (var I = -1, N = r.length, $ = -1, W = g.length, nA = -1, vA = a.length, yA = lt(N - W, 0), xA = uA(yA + vA), OA = !Q; ++I < yA; )
          xA[I] = r[I];
        for (var GA = I; ++nA < vA; )
          xA[GA + nA] = a[nA];
        for (; ++$ < W; )
          (OA || I < N) && (xA[GA + g[$]] = r[I++]);
        return xA;
      }
      function Wt(r, a) {
        var g = -1, Q = r.length;
        for (a || (a = uA(Q)); ++g < Q; )
          a[g] = r[g];
        return a;
      }
      function nr(r, a, g, Q) {
        var I = !g;
        g || (g = {});
        for (var N = -1, $ = a.length; ++N < $; ) {
          var W = a[N], nA = Q ? Q(g[W], r[W], W, g, r) : t;
          nA === t && (nA = r[W]), I ? Ur(g, W, nA) : Do(g, W, nA);
        }
        return g;
      }
      function jC(r, a) {
        return nr(r, Of(r), a);
      }
      function YC(r, a) {
        return nr(r, Kg(r), a);
      }
      function Su(r, a) {
        return function(g, Q) {
          var I = ce(g) ? d : vC, N = a ? a() : {};
          return I(g, r, ZA(Q, 2), N);
        };
      }
      function ba(r) {
        return me(function(a, g) {
          var Q = -1, I = g.length, N = I > 1 ? g[I - 1] : t, $ = I > 2 ? g[2] : t;
          for (N = r.length > 3 && typeof N == "function" ? (I--, N) : t, $ && Rt(g[0], g[1], $) && (N = I < 3 ? t : N, I = 1), a = be(a); ++Q < I; ) {
            var W = g[Q];
            W && r(a, W, Q, N);
          }
          return a;
        });
      }
      function _g(r, a) {
        return function(g, Q) {
          if (g == null)
            return g;
          if (!Xt(g))
            return r(g, Q);
          for (var I = g.length, N = a ? I : -1, $ = be(g); (a ? N-- : ++N < I) && Q($[N], N, $) !== !1; )
            ;
          return g;
        };
      }
      function xg(r) {
        return function(a, g, Q) {
          for (var I = -1, N = be(a), $ = Q(a), W = $.length; W--; ) {
            var nA = $[r ? W : ++I];
            if (g(N[nA], nA, N) === !1)
              break;
          }
          return a;
        };
      }
      function ZC(r, a, g) {
        var Q = a & F, I = Ko(r);
        function N() {
          var $ = this && this !== Ze && this instanceof N ? I : r;
          return $.apply(Q ? g : this, arguments);
        }
        return N;
      }
      function Ig(r) {
        return function(a) {
          a = Ne(a);
          var g = Zn(a) ? wt(a) : t, Q = g ? g[0] : a.charAt(0), I = g ? si(g, 1).join("") : a.slice(1);
          return Q[r]() + I;
        };
      }
      function _a(r) {
        return function(a) {
          return rA(_B(bB(a).replace(su, "")), r, "");
        };
      }
      function Ko(r) {
        return function() {
          var a = arguments;
          switch (a.length) {
            case 0:
              return new r();
            case 1:
              return new r(a[0]);
            case 2:
              return new r(a[0], a[1]);
            case 3:
              return new r(a[0], a[1], a[2]);
            case 4:
              return new r(a[0], a[1], a[2], a[3]);
            case 5:
              return new r(a[0], a[1], a[2], a[3], a[4]);
            case 6:
              return new r(a[0], a[1], a[2], a[3], a[4], a[5]);
            case 7:
              return new r(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
          }
          var g = Ea(r.prototype), Q = r.apply(g, a);
          return je(Q) ? Q : g;
        };
      }
      function AQ(r, a, g) {
        var Q = Ko(r);
        function I() {
          for (var N = arguments.length, $ = uA(N), W = N, nA = xa(I); W--; )
            $[W] = arguments[W];
          var vA = N < 3 && $[0] !== nA && $[N - 1] !== nA ? [] : Ar($, nA);
          if (N -= vA.length, N < g)
            return Dg(
              r,
              a,
              Lu,
              I.placeholder,
              t,
              $,
              vA,
              t,
              t,
              g - N
            );
          var yA = this && this !== Ze && this instanceof I ? Q : r;
          return u(yA, this, $);
        }
        return I;
      }
      function Hg(r) {
        return function(a, g, Q) {
          var I = be(a);
          if (!Xt(a)) {
            var N = ZA(g, 3);
            a = pt(a), g = function(W) {
              return N(I[W], W, I);
            };
          }
          var $ = r(a, g, Q);
          return $ > -1 ? I[N ? a[$] : $] : t;
        };
      }
      function Sg(r) {
        return br(function(a) {
          var g = a.length, Q = g, I = hn.prototype.thru;
          for (r && a.reverse(); Q--; ) {
            var N = a[Q];
            if (typeof N != "function")
              throw new mt(l);
            if (I && !$ && Nu(N) == "wrapper")
              var $ = new hn([], !0);
          }
          for (Q = $ ? Q : g; ++Q < g; ) {
            N = a[Q];
            var W = Nu(N), nA = W == "wrapper" ? Tf(N) : t;
            nA && Mf(nA[0]) && nA[1] == (j | O | P | dA) && !nA[4].length && nA[9] == 1 ? $ = $[Nu(nA[0])].apply($, nA[3]) : $ = N.length == 1 && Mf(N) ? $[W]() : $.thru(N);
          }
          return function() {
            var vA = arguments, yA = vA[0];
            if ($ && vA.length == 1 && ce(yA))
              return $.plant(yA).value();
            for (var xA = 0, OA = g ? a[xA].apply(this, vA) : yA; ++xA < g; )
              OA = a[xA].call(this, OA);
            return OA;
          };
        });
      }
      function Lu(r, a, g, Q, I, N, $, W, nA, vA) {
        var yA = a & j, xA = a & F, OA = a & U, GA = a & (O | b), te = a & fA, we = OA ? t : Ko(r);
        function ne() {
          for (var Fe = arguments.length, _e = uA(Fe), rn = Fe; rn--; )
            _e[rn] = arguments[rn];
          if (GA)
            var kt = xa(ne), an = vr(_e, kt);
          if (Q && (_e = Eg(_e, Q, I, GA)), N && (_e = bg(_e, N, $, GA)), Fe -= an, GA && Fe < vA) {
            var nt = Ar(_e, kt);
            return Dg(
              r,
              a,
              Lu,
              ne.placeholder,
              g,
              _e,
              nt,
              W,
              nA,
              vA - Fe
            );
          }
          var Mn = xA ? g : this, Hr = OA ? Mn[r] : r;
          return Fe = _e.length, W ? _e = vQ(_e, W) : te && Fe > 1 && _e.reverse(), yA && nA < Fe && (_e.length = nA), this && this !== Ze && this instanceof ne && (Hr = we || Ko(Hr)), Hr.apply(Mn, _e);
        }
        return ne;
      }
      function Lg(r, a) {
        return function(g, Q) {
          return _C(g, r, a(Q), {});
        };
      }
      function Tu(r, a) {
        return function(g, Q) {
          var I;
          if (g === t && Q === t)
            return a;
          if (g !== t && (I = g), Q !== t) {
            if (I === t)
              return Q;
            typeof g == "string" || typeof Q == "string" ? (g = tn(g), Q = tn(Q)) : (g = wg(g), Q = wg(Q)), I = r(g, Q);
          }
          return I;
        };
      }
      function If(r) {
        return br(function(a) {
          return a = J(a, Re(ZA())), me(function(g) {
            var Q = this;
            return r(a, function(I) {
              return u(I, Q, g);
            });
          });
        });
      }
      function Du(r, a) {
        a = a === t ? " " : tn(a);
        var g = a.length;
        if (g < 2)
          return g ? Qf(a, r) : a;
        var Q = Qf(a, er(r / ei(a)));
        return Zn(a) ? si(wt(Q), 0, r).join("") : Q.slice(0, r);
      }
      function eQ(r, a, g, Q) {
        var I = a & F, N = Ko(r);
        function $() {
          for (var W = -1, nA = arguments.length, vA = -1, yA = Q.length, xA = uA(yA + nA), OA = this && this !== Ze && this instanceof $ ? N : r; ++vA < yA; )
            xA[vA] = Q[vA];
          for (; nA--; )
            xA[vA++] = arguments[++W];
          return u(OA, I ? g : this, xA);
        }
        return $;
      }
      function Tg(r) {
        return function(a, g, Q) {
          return Q && typeof Q != "number" && Rt(a, g, Q) && (g = Q = t), a = Ir(a), g === t ? (g = a, a = 0) : g = Ir(g), Q = Q === t ? a < g ? 1 : -1 : Ir(Q), KC(a, g, Q, r);
        };
      }
      function Ou(r) {
        return function(a, g) {
          return typeof a == "string" && typeof g == "string" || (a = Bn(a), g = Bn(g)), r(a, g);
        };
      }
      function Dg(r, a, g, Q, I, N, $, W, nA, vA) {
        var yA = a & O, xA = yA ? $ : t, OA = yA ? t : $, GA = yA ? N : t, te = yA ? t : N;
        a |= yA ? P : R, a &= ~(yA ? R : P), a & S || (a &= ~(F | U));
        var we = [
          r,
          a,
          I,
          GA,
          xA,
          te,
          OA,
          W,
          nA,
          vA
        ], ne = g.apply(t, we);
        return Mf(r) && Xg(ne, we), ne.placeholder = Q, qg(ne, r, a);
      }
      function Hf(r) {
        var a = At[r];
        return function(g, Q) {
          if (g = Bn(g), Q = Q == null ? 0 : Ht(ge(Q), 292), Q && qp(g)) {
            var I = (Ne(g) + "e").split("e"), N = a(I[0] + "e" + (+I[1] + Q));
            return I = (Ne(N) + "e").split("e"), +(I[0] + "e" + (+I[1] - Q));
          }
          return a(g);
        };
      }
      var tQ = Fa && 1 / Ca(new Fa([, -0]))[1] == BA ? function(r) {
        return new Fa(r);
      } : Zf;
      function Og(r) {
        return function(a) {
          var g = St(a);
          return g == tA ? _o(a) : g == de ? mu(a) : Yn(a, r(a));
        };
      }
      function Er(r, a, g, Q, I, N, $, W) {
        var nA = a & U;
        if (!nA && typeof r != "function")
          throw new mt(l);
        var vA = Q ? Q.length : 0;
        if (vA || (a &= ~(P | R), Q = I = t), $ = $ === t ? $ : lt(ge($), 0), W = W === t ? W : ge(W), vA -= I ? I.length : 0, a & R) {
          var yA = Q, xA = I;
          Q = I = t;
        }
        var OA = nA ? t : Tf(r), GA = [
          r,
          a,
          g,
          Q,
          I,
          yA,
          xA,
          N,
          $,
          W
        ];
        if (OA && BQ(GA, OA), r = GA[0], a = GA[1], g = GA[2], Q = GA[3], I = GA[4], W = GA[9] = GA[9] === t ? nA ? 0 : r.length : lt(GA[9] - vA, 0), !W && a & (O | b) && (a &= ~(O | b)), !a || a == F)
          var te = ZC(r, a, g);
        else a == O || a == b ? te = AQ(r, a, W) : (a == P || a == (F | P)) && !I.length ? te = eQ(r, a, g, Q) : te = Lu.apply(t, GA);
        var we = OA ? gg : Xg;
        return qg(we(te, GA), r, a);
      }
      function Ng(r, a, g, Q) {
        return r === t || Nn(r, ni[g]) && !Se.call(Q, g) ? a : r;
      }
      function Mg(r, a, g, Q, I, N) {
        return je(r) && je(a) && (N.set(a, r), xu(r, a, t, Mg, N), N.delete(a)), r;
      }
      function nQ(r) {
        return $o(r) ? t : r;
      }
      function Pg(r, a, g, Q, I, N) {
        var $ = g & o, W = r.length, nA = a.length;
        if (W != nA && !($ && nA > W))
          return !1;
        var vA = N.get(r), yA = N.get(a);
        if (vA && yA)
          return vA == a && yA == r;
        var xA = -1, OA = !0, GA = g & C ? new Oi() : t;
        for (N.set(r, a), N.set(a, r); ++xA < W; ) {
          var te = r[xA], we = a[xA];
          if (Q)
            var ne = $ ? Q(we, te, xA, a, r, N) : Q(te, we, xA, r, a, N);
          if (ne !== t) {
            if (ne)
              continue;
            OA = !1;
            break;
          }
          if (GA) {
            if (!TA(a, function(Fe, _e) {
              if (!Si(GA, _e) && (te === Fe || I(te, Fe, g, Q, N)))
                return GA.push(_e);
            })) {
              OA = !1;
              break;
            }
          } else if (!(te === we || I(te, we, g, Q, N))) {
            OA = !1;
            break;
          }
        }
        return N.delete(r), N.delete(a), OA;
      }
      function rQ(r, a, g, Q, I, N, $) {
        switch (g) {
          case Bt:
            if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
              return !1;
            r = r.buffer, a = a.buffer;
          case Et:
            return !(r.byteLength != a.byteLength || !N(new LA(r), new LA(a)));
          case IA:
          case JA:
          case cA:
            return Nn(+r, +a);
          case q:
            return r.name == a.name && r.message == a.message;
          case he:
          case De:
            return r == a + "";
          case tA:
            var W = _o;
          case de:
            var nA = Q & o;
            if (W || (W = Ca), r.size != a.size && !nA)
              return !1;
            var vA = $.get(r);
            if (vA)
              return vA == a;
            Q |= C, $.set(r, a);
            var yA = Pg(W(r), W(a), Q, I, N, $);
            return $.delete(r), yA;
          case fe:
            if (To)
              return To.call(r) == To.call(a);
        }
        return !1;
      }
      function iQ(r, a, g, Q, I, N) {
        var $ = g & o, W = Sf(r), nA = W.length, vA = Sf(a), yA = vA.length;
        if (nA != yA && !$)
          return !1;
        for (var xA = nA; xA--; ) {
          var OA = W[xA];
          if (!($ ? OA in a : Se.call(a, OA)))
            return !1;
        }
        var GA = N.get(r), te = N.get(a);
        if (GA && te)
          return GA == a && te == r;
        var we = !0;
        N.set(r, a), N.set(a, r);
        for (var ne = $; ++xA < nA; ) {
          OA = W[xA];
          var Fe = r[OA], _e = a[OA];
          if (Q)
            var rn = $ ? Q(_e, Fe, OA, a, r, N) : Q(Fe, _e, OA, r, a, N);
          if (!(rn === t ? Fe === _e || I(Fe, _e, g, Q, N) : rn)) {
            we = !1;
            break;
          }
          ne || (ne = OA == "constructor");
        }
        if (we && !ne) {
          var kt = r.constructor, an = a.constructor;
          kt != an && "constructor" in r && "constructor" in a && !(typeof kt == "function" && kt instanceof kt && typeof an == "function" && an instanceof an) && (we = !1);
        }
        return N.delete(r), N.delete(a), we;
      }
      function br(r) {
        return Kf(Vg(r, t, AB), r + "");
      }
      function Sf(r) {
        return ig(r, pt, Of);
      }
      function Lf(r) {
        return ig(r, qt, Kg);
      }
      var Tf = Qu ? function(r) {
        return Qu.get(r);
      } : Zf;
      function Nu(r) {
        for (var a = r.name + "", g = Ua[a], Q = Se.call(Ua, a) ? g.length : 0; Q--; ) {
          var I = g[Q], N = I.func;
          if (N == null || N == r)
            return I.name;
        }
        return a;
      }
      function xa(r) {
        var a = Se.call(T, "placeholder") ? T : r;
        return a.placeholder;
      }
      function ZA() {
        var r = T.iteratee || jf;
        return r = r === jf ? sg : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Mu(r, a) {
        var g = r.__data__;
        return hQ(a) ? g[typeof a == "string" ? "string" : "hash"] : g.map;
      }
      function Df(r) {
        for (var a = pt(r), g = a.length; g--; ) {
          var Q = a[g], I = r[Q];
          a[g] = [Q, I, $g(I)];
        }
        return a;
      }
      function Pi(r, a) {
        var g = Bu(r, a);
        return og(g) ? g : t;
      }
      function aQ(r) {
        var a = Se.call(r, $e), g = r[$e];
        try {
          r[$e] = t;
          var Q = !0;
        } catch {
        }
        var I = V.call(r);
        return Q && (a ? r[$e] = g : delete r[$e]), I;
      }
      var Of = uf ? function(r) {
        return r == null ? [] : (r = be(r), x(uf(r), function(a) {
          return ee.call(r, a);
        }));
      } : Ah, Kg = uf ? function(r) {
        for (var a = []; r; )
          Z(a, Of(r)), r = re(r);
        return a;
      } : Ah, St = Kt;
      (lf && St(new lf(new ArrayBuffer(1))) != Bt || Ho && St(new Ho()) != tA || cf && St(cf.resolve()) != ue || Fa && St(new Fa()) != de || So && St(new So()) != Ut) && (St = function(r) {
        var a = Kt(r), g = a == YA ? r.constructor : t, Q = g ? Ki(g) : "";
        if (Q)
          switch (Q) {
            case ky:
              return Bt;
            case $y:
              return tA;
            case Gy:
              return ue;
            case Vy:
              return de;
            case Wy:
              return Ut;
          }
        return a;
      });
      function oQ(r, a, g) {
        for (var Q = -1, I = g.length; ++Q < I; ) {
          var N = g[Q], $ = N.size;
          switch (N.type) {
            case "drop":
              r += $;
              break;
            case "dropRight":
              a -= $;
              break;
            case "take":
              a = Ht(a, r + $);
              break;
            case "takeRight":
              r = lt(r, a - $);
              break;
          }
        }
        return { start: r, end: a };
      }
      function sQ(r) {
        var a = r.match(Vs);
        return a ? a[1].split(ua) : [];
      }
      function Rg(r, a, g) {
        a = oi(a, r);
        for (var Q = -1, I = a.length, N = !1; ++Q < I; ) {
          var $ = rr(a[Q]);
          if (!(N = r != null && g(r, $)))
            break;
          r = r[$];
        }
        return N || ++Q != I ? N : (I = r == null ? 0 : r.length, !!I && Vu(I) && _r($, I) && (ce(r) || Ri(r)));
      }
      function uQ(r) {
        var a = r.length, g = new r.constructor(a);
        return a && typeof r[0] == "string" && Se.call(r, "index") && (g.index = r.index, g.input = r.input), g;
      }
      function kg(r) {
        return typeof r.constructor == "function" && !Ro(r) ? Ea(re(r)) : {};
      }
      function lQ(r, a, g) {
        var Q = r.constructor;
        switch (a) {
          case Et:
            return xf(r);
          case IA:
          case JA:
            return new Q(+r);
          case Bt:
            return XC(r, g);
          case ln:
          case pr:
          case Fi:
          case Vr:
          case Wr:
          case gA:
          case PA:
          case qA:
          case Ce:
            return Fg(r, g);
          case tA:
            return new Q();
          case cA:
          case De:
            return new Q(r);
          case he:
            return qC(r);
          case de:
            return new Q();
          case fe:
            return zC(r);
        }
      }
      function cQ(r, a) {
        var g = a.length;
        if (!g)
          return r;
        var Q = g - 1;
        return a[Q] = (g > 1 ? "& " : "") + a[Q], a = a.join(g > 2 ? ", " : " "), r.replace(Gs, `{
/* [wrapped with ` + a + `] */
`);
      }
      function fQ(r) {
        return ce(r) || Ri(r) || !!(Le && r && r[Le]);
      }
      function _r(r, a) {
        var g = typeof r;
        return a = a ?? HA, !!a && (g == "number" || g != "symbol" && Gc.test(r)) && r > -1 && r % 1 == 0 && r < a;
      }
      function Rt(r, a, g) {
        if (!je(g))
          return !1;
        var Q = typeof a;
        return (Q == "number" ? Xt(g) && _r(a, g.length) : Q == "string" && a in g) ? Nn(g[a], r) : !1;
      }
      function Nf(r, a) {
        if (ce(r))
          return !1;
        var g = typeof r;
        return g == "number" || g == "symbol" || g == "boolean" || r == null || nn(r) ? !0 : gr.test(r) || !qr.test(r) || a != null && r in be(a);
      }
      function hQ(r) {
        var a = typeof r;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
      }
      function Mf(r) {
        var a = Nu(r), g = T[a];
        if (typeof g != "function" || !(a in Ue.prototype))
          return !1;
        if (r === g)
          return !0;
        var Q = Tf(g);
        return !!Q && r === Q[0];
      }
      function dQ(r) {
        return !!M && M in r;
      }
      var pQ = Cr ? xr : eh;
      function Ro(r) {
        var a = r && r.constructor, g = typeof a == "function" && a.prototype || ni;
        return r === g;
      }
      function $g(r) {
        return r === r && !je(r);
      }
      function Gg(r, a) {
        return function(g) {
          return g == null ? !1 : g[r] === a && (a !== t || r in be(g));
        };
      }
      function gQ(r) {
        var a = $u(r, function(Q) {
          return g.size === h && g.clear(), Q;
        }), g = a.cache;
        return a;
      }
      function BQ(r, a) {
        var g = r[1], Q = a[1], I = g | Q, N = I < (F | U | j), $ = Q == j && g == O || Q == j && g == dA && r[7].length <= a[8] || Q == (j | dA) && a[7].length <= a[8] && g == O;
        if (!(N || $))
          return r;
        Q & F && (r[2] = a[2], I |= g & F ? 0 : S);
        var W = a[3];
        if (W) {
          var nA = r[3];
          r[3] = nA ? Eg(nA, W, a[4]) : W, r[4] = nA ? Ar(r[3], w) : a[4];
        }
        return W = a[5], W && (nA = r[5], r[5] = nA ? bg(nA, W, a[6]) : W, r[6] = nA ? Ar(r[5], w) : a[6]), W = a[7], W && (r[7] = W), Q & j && (r[8] = r[8] == null ? a[8] : Ht(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = I, r;
      }
      function wQ(r) {
        var a = [];
        if (r != null)
          for (var g in be(r))
            a.push(g);
        return a;
      }
      function mQ(r) {
        return V.call(r);
      }
      function Vg(r, a, g) {
        return a = lt(a === t ? r.length - 1 : a, 0), function() {
          for (var Q = arguments, I = -1, N = lt(Q.length - a, 0), $ = uA(N); ++I < N; )
            $[I] = Q[a + I];
          I = -1;
          for (var W = uA(a + 1); ++I < a; )
            W[I] = Q[I];
          return W[a] = g($), u(r, this, W);
        };
      }
      function Wg(r, a) {
        return a.length < 2 ? r : Mi(r, pn(a, 0, -1));
      }
      function vQ(r, a) {
        for (var g = r.length, Q = Ht(a.length, g), I = Wt(r); Q--; ) {
          var N = a[Q];
          r[Q] = _r(N, g) ? I[N] : t;
        }
        return r;
      }
      function Pf(r, a) {
        if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
          return r[a];
      }
      var Xg = zg(gg), ko = Ti || function(r, a) {
        return Ze.setTimeout(r, a);
      }, Kf = zg($C);
      function qg(r, a, g) {
        var Q = a + "";
        return Kf(r, cQ(Q, yQ(sQ(Q), g)));
      }
      function zg(r) {
        var a = 0, g = 0;
        return function() {
          var Q = Py(), I = bA - (Q - g);
          if (g = Q, I > 0) {
            if (++a >= NA)
              return arguments[0];
          } else
            a = 0;
          return r.apply(t, arguments);
        };
      }
      function Pu(r, a) {
        var g = -1, Q = r.length, I = Q - 1;
        for (a = a === t ? Q : a; ++g < a; ) {
          var N = Cf(g, I), $ = r[N];
          r[N] = r[g], r[g] = $;
        }
        return r.length = a, r;
      }
      var Jg = gQ(function(r) {
        var a = [];
        return r.charCodeAt(0) === 46 && a.push(""), r.replace($s, function(g, Q, I, N) {
          a.push(I ? N.replace(ho, "$1") : Q || g);
        }), a;
      });
      function rr(r) {
        if (typeof r == "string" || nn(r))
          return r;
        var a = r + "";
        return a == "0" && 1 / r == -BA ? "-0" : a;
      }
      function Ki(r) {
        if (r != null) {
          try {
            return ri.call(r);
          } catch {
          }
          try {
            return r + "";
          } catch {
          }
        }
        return "";
      }
      function yQ(r, a) {
        return m(L, function(g) {
          var Q = "_." + g[0];
          a & g[1] && !H(r, Q) && r.push(Q);
        }), r.sort();
      }
      function jg(r) {
        if (r instanceof Ue)
          return r.clone();
        var a = new hn(r.__wrapped__, r.__chain__);
        return a.__actions__ = Wt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
      }
      function CQ(r, a, g) {
        (g ? Rt(r, a, g) : a === t) ? a = 1 : a = lt(ge(a), 0);
        var Q = r == null ? 0 : r.length;
        if (!Q || a < 1)
          return [];
        for (var I = 0, N = 0, $ = uA(er(Q / a)); I < Q; )
          $[N++] = pn(r, I, I += a);
        return $;
      }
      function QQ(r) {
        for (var a = -1, g = r == null ? 0 : r.length, Q = 0, I = []; ++a < g; ) {
          var N = r[a];
          N && (I[Q++] = N);
        }
        return I;
      }
      function FQ() {
        var r = arguments.length;
        if (!r)
          return [];
        for (var a = uA(r - 1), g = arguments[0], Q = r; Q--; )
          a[Q - 1] = arguments[Q];
        return Z(ce(g) ? Wt(g) : [g], vt(a, 1));
      }
      var UQ = me(function(r, a) {
        return tt(r) ? Oo(r, vt(a, 1, tt, !0)) : [];
      }), EQ = me(function(r, a) {
        var g = gn(a);
        return tt(g) && (g = t), tt(r) ? Oo(r, vt(a, 1, tt, !0), ZA(g, 2)) : [];
      }), bQ = me(function(r, a) {
        var g = gn(a);
        return tt(g) && (g = t), tt(r) ? Oo(r, vt(a, 1, tt, !0), t, g) : [];
      });
      function _Q(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : ge(a), pn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function xQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : ge(a), a = Q - a, pn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function IQ(r, a) {
        return r && r.length ? Hu(r, ZA(a, 3), !0, !0) : [];
      }
      function HQ(r, a) {
        return r && r.length ? Hu(r, ZA(a, 3), !0) : [];
      }
      function SQ(r, a, g, Q) {
        var I = r == null ? 0 : r.length;
        return I ? (g && typeof g != "number" && Rt(r, a, g) && (g = 0, Q = I), FC(r, a, g, Q)) : [];
      }
      function Yg(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = g == null ? 0 : ge(g);
        return I < 0 && (I = lt(Q + I, 0)), ht(r, ZA(a, 3), I);
      }
      function Zg(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = Q - 1;
        return g !== t && (I = ge(g), I = g < 0 ? lt(Q + I, 0) : Ht(I, Q - 1)), ht(r, ZA(a, 3), I, !0);
      }
      function AB(r) {
        var a = r == null ? 0 : r.length;
        return a ? vt(r, 1) : [];
      }
      function LQ(r) {
        var a = r == null ? 0 : r.length;
        return a ? vt(r, BA) : [];
      }
      function TQ(r, a) {
        var g = r == null ? 0 : r.length;
        return g ? (a = a === t ? 1 : ge(a), vt(r, a)) : [];
      }
      function DQ(r) {
        for (var a = -1, g = r == null ? 0 : r.length, Q = {}; ++a < g; ) {
          var I = r[a];
          Q[I[0]] = I[1];
        }
        return Q;
      }
      function eB(r) {
        return r && r.length ? r[0] : t;
      }
      function OQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = g == null ? 0 : ge(g);
        return I < 0 && (I = lt(Q + I, 0)), ze(r, a, I);
      }
      function NQ(r) {
        var a = r == null ? 0 : r.length;
        return a ? pn(r, 0, -1) : [];
      }
      var MQ = me(function(r) {
        var a = J(r, bf);
        return a.length && a[0] === r[0] ? Bf(a) : [];
      }), PQ = me(function(r) {
        var a = gn(r), g = J(r, bf);
        return a === gn(g) ? a = t : g.pop(), g.length && g[0] === r[0] ? Bf(g, ZA(a, 2)) : [];
      }), KQ = me(function(r) {
        var a = gn(r), g = J(r, bf);
        return a = typeof a == "function" ? a : t, a && g.pop(), g.length && g[0] === r[0] ? Bf(g, t, a) : [];
      });
      function RQ(r, a) {
        return r == null ? "" : Ny.call(r, a);
      }
      function gn(r) {
        var a = r == null ? 0 : r.length;
        return a ? r[a - 1] : t;
      }
      function kQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = Q;
        return g !== t && (I = ge(g), I = I < 0 ? lt(Q + I, 0) : Ht(I, Q - 1)), a === a ? af(r, a, I) : ht(r, $A, I, !0);
      }
      function $Q(r, a) {
        return r && r.length ? fg(r, ge(a)) : t;
      }
      var GQ = me(tB);
      function tB(r, a) {
        return r && r.length && a && a.length ? yf(r, a) : r;
      }
      function VQ(r, a, g) {
        return r && r.length && a && a.length ? yf(r, a, ZA(g, 2)) : r;
      }
      function WQ(r, a, g) {
        return r && r.length && a && a.length ? yf(r, a, t, g) : r;
      }
      var XQ = br(function(r, a) {
        var g = r == null ? 0 : r.length, Q = hf(r, a);
        return pg(r, J(a, function(I) {
          return _r(I, g) ? +I : I;
        }).sort(Ug)), Q;
      });
      function qQ(r, a) {
        var g = [];
        if (!(r && r.length))
          return g;
        var Q = -1, I = [], N = r.length;
        for (a = ZA(a, 3); ++Q < N; ) {
          var $ = r[Q];
          a($, Q, r) && (g.push($), I.push(Q));
        }
        return pg(r, I), g;
      }
      function Rf(r) {
        return r == null ? r : Ry.call(r);
      }
      function zQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (g && typeof g != "number" && Rt(r, a, g) ? (a = 0, g = Q) : (a = a == null ? 0 : ge(a), g = g === t ? Q : ge(g)), pn(r, a, g)) : [];
      }
      function JQ(r, a) {
        return Iu(r, a);
      }
      function jQ(r, a, g) {
        return Ff(r, a, ZA(g, 2));
      }
      function YQ(r, a) {
        var g = r == null ? 0 : r.length;
        if (g) {
          var Q = Iu(r, a);
          if (Q < g && Nn(r[Q], a))
            return Q;
        }
        return -1;
      }
      function ZQ(r, a) {
        return Iu(r, a, !0);
      }
      function AF(r, a, g) {
        return Ff(r, a, ZA(g, 2), !0);
      }
      function eF(r, a) {
        var g = r == null ? 0 : r.length;
        if (g) {
          var Q = Iu(r, a, !0) - 1;
          if (Nn(r[Q], a))
            return Q;
        }
        return -1;
      }
      function tF(r) {
        return r && r.length ? Bg(r) : [];
      }
      function nF(r, a) {
        return r && r.length ? Bg(r, ZA(a, 2)) : [];
      }
      function rF(r) {
        var a = r == null ? 0 : r.length;
        return a ? pn(r, 1, a) : [];
      }
      function iF(r, a, g) {
        return r && r.length ? (a = g || a === t ? 1 : ge(a), pn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function aF(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : ge(a), a = Q - a, pn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function oF(r, a) {
        return r && r.length ? Hu(r, ZA(a, 3), !1, !0) : [];
      }
      function sF(r, a) {
        return r && r.length ? Hu(r, ZA(a, 3)) : [];
      }
      var uF = me(function(r) {
        return ai(vt(r, 1, tt, !0));
      }), lF = me(function(r) {
        var a = gn(r);
        return tt(a) && (a = t), ai(vt(r, 1, tt, !0), ZA(a, 2));
      }), cF = me(function(r) {
        var a = gn(r);
        return a = typeof a == "function" ? a : t, ai(vt(r, 1, tt, !0), t, a);
      });
      function fF(r) {
        return r && r.length ? ai(r) : [];
      }
      function hF(r, a) {
        return r && r.length ? ai(r, ZA(a, 2)) : [];
      }
      function dF(r, a) {
        return a = typeof a == "function" ? a : t, r && r.length ? ai(r, t, a) : [];
      }
      function kf(r) {
        if (!(r && r.length))
          return [];
        var a = 0;
        return r = x(r, function(g) {
          if (tt(g))
            return a = lt(g.length, a), !0;
        }), Hn(a, function(g) {
          return J(r, le(g));
        });
      }
      function nB(r, a) {
        if (!(r && r.length))
          return [];
        var g = kf(r);
        return a == null ? g : J(g, function(Q) {
          return u(a, t, Q);
        });
      }
      var pF = me(function(r, a) {
        return tt(r) ? Oo(r, a) : [];
      }), gF = me(function(r) {
        return Ef(x(r, tt));
      }), BF = me(function(r) {
        var a = gn(r);
        return tt(a) && (a = t), Ef(x(r, tt), ZA(a, 2));
      }), wF = me(function(r) {
        var a = gn(r);
        return a = typeof a == "function" ? a : t, Ef(x(r, tt), t, a);
      }), mF = me(kf);
      function vF(r, a) {
        return yg(r || [], a || [], Do);
      }
      function yF(r, a) {
        return yg(r || [], a || [], Po);
      }
      var CF = me(function(r) {
        var a = r.length, g = a > 1 ? r[a - 1] : t;
        return g = typeof g == "function" ? (r.pop(), g) : t, nB(r, g);
      });
      function rB(r) {
        var a = T(r);
        return a.__chain__ = !0, a;
      }
      function QF(r, a) {
        return a(r), r;
      }
      function Ku(r, a) {
        return a(r);
      }
      var FF = br(function(r) {
        var a = r.length, g = a ? r[0] : 0, Q = this.__wrapped__, I = function(N) {
          return hf(N, r);
        };
        return a > 1 || this.__actions__.length || !(Q instanceof Ue) || !_r(g) ? this.thru(I) : (Q = Q.slice(g, +g + (a ? 1 : 0)), Q.__actions__.push({
          func: Ku,
          args: [I],
          thisArg: t
        }), new hn(Q, this.__chain__).thru(function(N) {
          return a && !N.length && N.push(t), N;
        }));
      });
      function UF() {
        return rB(this);
      }
      function EF() {
        return new hn(this.value(), this.__chain__);
      }
      function bF() {
        this.__values__ === t && (this.__values__ = wB(this.value()));
        var r = this.__index__ >= this.__values__.length, a = r ? t : this.__values__[this.__index__++];
        return { done: r, value: a };
      }
      function _F() {
        return this;
      }
      function xF(r) {
        for (var a, g = this; g instanceof Uu; ) {
          var Q = jg(g);
          Q.__index__ = 0, Q.__values__ = t, a ? I.__wrapped__ = Q : a = Q;
          var I = Q;
          g = g.__wrapped__;
        }
        return I.__wrapped__ = r, a;
      }
      function IF() {
        var r = this.__wrapped__;
        if (r instanceof Ue) {
          var a = r;
          return this.__actions__.length && (a = new Ue(this)), a = a.reverse(), a.__actions__.push({
            func: Ku,
            args: [Rf],
            thisArg: t
          }), new hn(a, this.__chain__);
        }
        return this.thru(Rf);
      }
      function HF() {
        return vg(this.__wrapped__, this.__actions__);
      }
      var SF = Su(function(r, a, g) {
        Se.call(r, g) ? ++r[g] : Ur(r, g, 1);
      });
      function LF(r, a, g) {
        var Q = ce(r) ? E : QC;
        return g && Rt(r, a, g) && (a = t), Q(r, ZA(a, 3));
      }
      function TF(r, a) {
        var g = ce(r) ? x : ng;
        return g(r, ZA(a, 3));
      }
      var DF = Hg(Yg), OF = Hg(Zg);
      function NF(r, a) {
        return vt(Ru(r, a), 1);
      }
      function MF(r, a) {
        return vt(Ru(r, a), BA);
      }
      function PF(r, a, g) {
        return g = g === t ? 1 : ge(g), vt(Ru(r, a), g);
      }
      function iB(r, a) {
        var g = ce(r) ? m : ii;
        return g(r, ZA(a, 3));
      }
      function aB(r, a) {
        var g = ce(r) ? y : tg;
        return g(r, ZA(a, 3));
      }
      var KF = Su(function(r, a, g) {
        Se.call(r, g) ? r[g].push(a) : Ur(r, g, [a]);
      });
      function RF(r, a, g, Q) {
        r = Xt(r) ? r : Ha(r), g = g && !Q ? ge(g) : 0;
        var I = r.length;
        return g < 0 && (g = lt(I + g, 0)), Wu(r) ? g <= I && r.indexOf(a, g) > -1 : !!I && ze(r, a, g) > -1;
      }
      var kF = me(function(r, a, g) {
        var Q = -1, I = typeof a == "function", N = Xt(r) ? uA(r.length) : [];
        return ii(r, function($) {
          N[++Q] = I ? u(a, $, g) : No($, a, g);
        }), N;
      }), $F = Su(function(r, a, g) {
        Ur(r, g, a);
      });
      function Ru(r, a) {
        var g = ce(r) ? J : ug;
        return g(r, ZA(a, 3));
      }
      function GF(r, a, g, Q) {
        return r == null ? [] : (ce(a) || (a = a == null ? [] : [a]), g = Q ? t : g, ce(g) || (g = g == null ? [] : [g]), hg(r, a, g));
      }
      var VF = Su(function(r, a, g) {
        r[g ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function WF(r, a, g) {
        var Q = ce(r) ? rA : In, I = arguments.length < 3;
        return Q(r, ZA(a, 4), g, I, ii);
      }
      function XF(r, a, g) {
        var Q = ce(r) ? UA : In, I = arguments.length < 3;
        return Q(r, ZA(a, 4), g, I, tg);
      }
      function qF(r, a) {
        var g = ce(r) ? x : ng;
        return g(r, Gu(ZA(a, 3)));
      }
      function zF(r) {
        var a = ce(r) ? Yp : RC;
        return a(r);
      }
      function JF(r, a, g) {
        (g ? Rt(r, a, g) : a === t) ? a = 1 : a = ge(a);
        var Q = ce(r) ? wC : kC;
        return Q(r, a);
      }
      function jF(r) {
        var a = ce(r) ? mC : GC;
        return a(r);
      }
      function YF(r) {
        if (r == null)
          return 0;
        if (Xt(r))
          return Wu(r) ? ei(r) : r.length;
        var a = St(r);
        return a == tA || a == de ? r.size : mf(r).length;
      }
      function ZF(r, a, g) {
        var Q = ce(r) ? TA : VC;
        return g && Rt(r, a, g) && (a = t), Q(r, ZA(a, 3));
      }
      var AU = me(function(r, a) {
        if (r == null)
          return [];
        var g = a.length;
        return g > 1 && Rt(r, a[0], a[1]) ? a = [] : g > 2 && Rt(a[0], a[1], a[2]) && (a = [a[0]]), hg(r, vt(a, 1), []);
      }), ku = Ve || function() {
        return Ze.Date.now();
      };
      function eU(r, a) {
        if (typeof a != "function")
          throw new mt(l);
        return r = ge(r), function() {
          if (--r < 1)
            return a.apply(this, arguments);
        };
      }
      function oB(r, a, g) {
        return a = g ? t : a, a = r && a == null ? r.length : a, Er(r, j, t, t, t, t, a);
      }
      function sB(r, a) {
        var g;
        if (typeof a != "function")
          throw new mt(l);
        return r = ge(r), function() {
          return --r > 0 && (g = a.apply(this, arguments)), r <= 1 && (a = t), g;
        };
      }
      var $f = me(function(r, a, g) {
        var Q = F;
        if (g.length) {
          var I = Ar(g, xa($f));
          Q |= P;
        }
        return Er(r, Q, a, g, I);
      }), uB = me(function(r, a, g) {
        var Q = F | U;
        if (g.length) {
          var I = Ar(g, xa(uB));
          Q |= P;
        }
        return Er(a, Q, r, g, I);
      });
      function lB(r, a, g) {
        a = g ? t : a;
        var Q = Er(r, O, t, t, t, t, t, a);
        return Q.placeholder = lB.placeholder, Q;
      }
      function cB(r, a, g) {
        a = g ? t : a;
        var Q = Er(r, b, t, t, t, t, t, a);
        return Q.placeholder = cB.placeholder, Q;
      }
      function fB(r, a, g) {
        var Q, I, N, $, W, nA, vA = 0, yA = !1, xA = !1, OA = !0;
        if (typeof r != "function")
          throw new mt(l);
        a = Bn(a) || 0, je(g) && (yA = !!g.leading, xA = "maxWait" in g, N = xA ? lt(Bn(g.maxWait) || 0, a) : N, OA = "trailing" in g ? !!g.trailing : OA);
        function GA(nt) {
          var Mn = Q, Hr = I;
          return Q = I = t, vA = nt, $ = r.apply(Hr, Mn), $;
        }
        function te(nt) {
          return vA = nt, W = ko(Fe, a), yA ? GA(nt) : $;
        }
        function we(nt) {
          var Mn = nt - nA, Hr = nt - vA, HB = a - Mn;
          return xA ? Ht(HB, N - Hr) : HB;
        }
        function ne(nt) {
          var Mn = nt - nA, Hr = nt - vA;
          return nA === t || Mn >= a || Mn < 0 || xA && Hr >= N;
        }
        function Fe() {
          var nt = ku();
          if (ne(nt))
            return _e(nt);
          W = ko(Fe, we(nt));
        }
        function _e(nt) {
          return W = t, OA && Q ? GA(nt) : (Q = I = t, $);
        }
        function rn() {
          W !== t && Cg(W), vA = 0, Q = nA = I = W = t;
        }
        function kt() {
          return W === t ? $ : _e(ku());
        }
        function an() {
          var nt = ku(), Mn = ne(nt);
          if (Q = arguments, I = this, nA = nt, Mn) {
            if (W === t)
              return te(nA);
            if (xA)
              return Cg(W), W = ko(Fe, a), GA(nA);
          }
          return W === t && (W = ko(Fe, a)), $;
        }
        return an.cancel = rn, an.flush = kt, an;
      }
      var tU = me(function(r, a) {
        return eg(r, 1, a);
      }), nU = me(function(r, a, g) {
        return eg(r, Bn(a) || 0, g);
      });
      function rU(r) {
        return Er(r, fA);
      }
      function $u(r, a) {
        if (typeof r != "function" || a != null && typeof a != "function")
          throw new mt(l);
        var g = function() {
          var Q = arguments, I = a ? a.apply(this, Q) : Q[0], N = g.cache;
          if (N.has(I))
            return N.get(I);
          var $ = r.apply(this, Q);
          return g.cache = N.set(I, $) || N, $;
        };
        return g.cache = new ($u.Cache || Fr)(), g;
      }
      $u.Cache = Fr;
      function Gu(r) {
        if (typeof r != "function")
          throw new mt(l);
        return function() {
          var a = arguments;
          switch (a.length) {
            case 0:
              return !r.call(this);
            case 1:
              return !r.call(this, a[0]);
            case 2:
              return !r.call(this, a[0], a[1]);
            case 3:
              return !r.call(this, a[0], a[1], a[2]);
          }
          return !r.apply(this, a);
        };
      }
      function iU(r) {
        return sB(2, r);
      }
      var aU = WC(function(r, a) {
        a = a.length == 1 && ce(a[0]) ? J(a[0], Re(ZA())) : J(vt(a, 1), Re(ZA()));
        var g = a.length;
        return me(function(Q) {
          for (var I = -1, N = Ht(Q.length, g); ++I < N; )
            Q[I] = a[I].call(this, Q[I]);
          return u(r, this, Q);
        });
      }), Gf = me(function(r, a) {
        var g = Ar(a, xa(Gf));
        return Er(r, P, t, a, g);
      }), hB = me(function(r, a) {
        var g = Ar(a, xa(hB));
        return Er(r, R, t, a, g);
      }), oU = br(function(r, a) {
        return Er(r, dA, t, t, t, a);
      });
      function sU(r, a) {
        if (typeof r != "function")
          throw new mt(l);
        return a = a === t ? a : ge(a), me(r, a);
      }
      function uU(r, a) {
        if (typeof r != "function")
          throw new mt(l);
        return a = a == null ? 0 : lt(ge(a), 0), me(function(g) {
          var Q = g[a], I = si(g, 0, a);
          return Q && Z(I, Q), u(r, this, I);
        });
      }
      function lU(r, a, g) {
        var Q = !0, I = !0;
        if (typeof r != "function")
          throw new mt(l);
        return je(g) && (Q = "leading" in g ? !!g.leading : Q, I = "trailing" in g ? !!g.trailing : I), fB(r, a, {
          leading: Q,
          maxWait: a,
          trailing: I
        });
      }
      function cU(r) {
        return oB(r, 1);
      }
      function fU(r, a) {
        return Gf(_f(a), r);
      }
      function hU() {
        if (!arguments.length)
          return [];
        var r = arguments[0];
        return ce(r) ? r : [r];
      }
      function dU(r) {
        return dn(r, v);
      }
      function pU(r, a) {
        return a = typeof a == "function" ? a : t, dn(r, v, a);
      }
      function gU(r) {
        return dn(r, B | v);
      }
      function BU(r, a) {
        return a = typeof a == "function" ? a : t, dn(r, B | v, a);
      }
      function wU(r, a) {
        return a == null || Ag(r, a, pt(a));
      }
      function Nn(r, a) {
        return r === a || r !== r && a !== a;
      }
      var mU = Ou(gf), vU = Ou(function(r, a) {
        return r >= a;
      }), Ri = ag(/* @__PURE__ */ function() {
        return arguments;
      }()) ? ag : function(r) {
        return Ye(r) && Se.call(r, "callee") && !ee.call(r, "callee");
      }, ce = uA.isArray, yU = Qo ? Re(Qo) : xC;
      function Xt(r) {
        return r != null && Vu(r.length) && !xr(r);
      }
      function tt(r) {
        return Ye(r) && Xt(r);
      }
      function CU(r) {
        return r === !0 || r === !1 || Ye(r) && Kt(r) == IA;
      }
      var ui = Oy || eh, QU = ma ? Re(ma) : IC;
      function FU(r) {
        return Ye(r) && r.nodeType === 1 && !$o(r);
      }
      function UU(r) {
        if (r == null)
          return !0;
        if (Xt(r) && (ce(r) || typeof r == "string" || typeof r.splice == "function" || ui(r) || Ia(r) || Ri(r)))
          return !r.length;
        var a = St(r);
        if (a == tA || a == de)
          return !r.size;
        if (Ro(r))
          return !mf(r).length;
        for (var g in r)
          if (Se.call(r, g))
            return !1;
        return !0;
      }
      function EU(r, a) {
        return Mo(r, a);
      }
      function bU(r, a, g) {
        g = typeof g == "function" ? g : t;
        var Q = g ? g(r, a) : t;
        return Q === t ? Mo(r, a, t, g) : !!Q;
      }
      function Vf(r) {
        if (!Ye(r))
          return !1;
        var a = Kt(r);
        return a == q || a == jA || typeof r.message == "string" && typeof r.name == "string" && !$o(r);
      }
      function _U(r) {
        return typeof r == "number" && qp(r);
      }
      function xr(r) {
        if (!je(r))
          return !1;
        var a = Kt(r);
        return a == X || a == G || a == _A || a == xe;
      }
      function dB(r) {
        return typeof r == "number" && r == ge(r);
      }
      function Vu(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= HA;
      }
      function je(r) {
        var a = typeof r;
        return r != null && (a == "object" || a == "function");
      }
      function Ye(r) {
        return r != null && typeof r == "object";
      }
      var pB = Fo ? Re(Fo) : SC;
      function xU(r, a) {
        return r === a || wf(r, a, Df(a));
      }
      function IU(r, a, g) {
        return g = typeof g == "function" ? g : t, wf(r, a, Df(a), g);
      }
      function HU(r) {
        return gB(r) && r != +r;
      }
      function SU(r) {
        if (pQ(r))
          throw new ae(s);
        return og(r);
      }
      function LU(r) {
        return r === null;
      }
      function TU(r) {
        return r == null;
      }
      function gB(r) {
        return typeof r == "number" || Ye(r) && Kt(r) == cA;
      }
      function $o(r) {
        if (!Ye(r) || Kt(r) != YA)
          return !1;
        var a = re(r);
        if (a === null)
          return !0;
        var g = Se.call(a, "constructor") && a.constructor;
        return typeof g == "function" && g instanceof g && ri.call(g) == AA;
      }
      var Wf = Uo ? Re(Uo) : LC;
      function DU(r) {
        return dB(r) && r >= -HA && r <= HA;
      }
      var BB = pu ? Re(pu) : TC;
      function Wu(r) {
        return typeof r == "string" || !ce(r) && Ye(r) && Kt(r) == De;
      }
      function nn(r) {
        return typeof r == "symbol" || Ye(r) && Kt(r) == fe;
      }
      var Ia = gu ? Re(gu) : DC;
      function OU(r) {
        return r === t;
      }
      function NU(r) {
        return Ye(r) && St(r) == Ut;
      }
      function MU(r) {
        return Ye(r) && Kt(r) == Nt;
      }
      var PU = Ou(vf), KU = Ou(function(r, a) {
        return r <= a;
      });
      function wB(r) {
        if (!r)
          return [];
        if (Xt(r))
          return Wu(r) ? wt(r) : Wt(r);
        if (zA && r[zA])
          return ya(r[zA]());
        var a = St(r), g = a == tA ? _o : a == de ? Ca : Ha;
        return g(r);
      }
      function Ir(r) {
        if (!r)
          return r === 0 ? r : 0;
        if (r = Bn(r), r === BA || r === -BA) {
          var a = r < 0 ? -1 : 1;
          return a * SA;
        }
        return r === r ? r : 0;
      }
      function ge(r) {
        var a = Ir(r), g = a % 1;
        return a === a ? g ? a - g : a : 0;
      }
      function mB(r) {
        return r ? Ni(ge(r), 0, D) : 0;
      }
      function Bn(r) {
        if (typeof r == "number")
          return r;
        if (nn(r))
          return lA;
        if (je(r)) {
          var a = typeof r.valueOf == "function" ? r.valueOf() : r;
          r = je(a) ? a + "" : a;
        }
        if (typeof r != "string")
          return r === 0 ? r : +r;
        r = Sn(r);
        var g = $c.test(r);
        return g || go.test(r) ? hu(r.slice(2), g ? 2 : 8) : Jn.test(r) ? lA : +r;
      }
      function vB(r) {
        return nr(r, qt(r));
      }
      function RU(r) {
        return r ? Ni(ge(r), -HA, HA) : r === 0 ? r : 0;
      }
      function Ne(r) {
        return r == null ? "" : tn(r);
      }
      var kU = ba(function(r, a) {
        if (Ro(a) || Xt(a)) {
          nr(a, pt(a), r);
          return;
        }
        for (var g in a)
          Se.call(a, g) && Do(r, g, a[g]);
      }), yB = ba(function(r, a) {
        nr(a, qt(a), r);
      }), Xu = ba(function(r, a, g, Q) {
        nr(a, qt(a), r, Q);
      }), $U = ba(function(r, a, g, Q) {
        nr(a, pt(a), r, Q);
      }), GU = br(hf);
      function VU(r, a) {
        var g = Ea(r);
        return a == null ? g : Zp(g, a);
      }
      var WU = me(function(r, a) {
        r = be(r);
        var g = -1, Q = a.length, I = Q > 2 ? a[2] : t;
        for (I && Rt(a[0], a[1], I) && (Q = 1); ++g < Q; )
          for (var N = a[g], $ = qt(N), W = -1, nA = $.length; ++W < nA; ) {
            var vA = $[W], yA = r[vA];
            (yA === t || Nn(yA, ni[vA]) && !Se.call(r, vA)) && (r[vA] = N[vA]);
          }
        return r;
      }), XU = me(function(r) {
        return r.push(t, Mg), u(CB, t, r);
      });
      function qU(r, a) {
        return se(r, ZA(a, 3), tr);
      }
      function zU(r, a) {
        return se(r, ZA(a, 3), pf);
      }
      function JU(r, a) {
        return r == null ? r : df(r, ZA(a, 3), qt);
      }
      function jU(r, a) {
        return r == null ? r : rg(r, ZA(a, 3), qt);
      }
      function YU(r, a) {
        return r && tr(r, ZA(a, 3));
      }
      function ZU(r, a) {
        return r && pf(r, ZA(a, 3));
      }
      function AE(r) {
        return r == null ? [] : _u(r, pt(r));
      }
      function eE(r) {
        return r == null ? [] : _u(r, qt(r));
      }
      function Xf(r, a, g) {
        var Q = r == null ? t : Mi(r, a);
        return Q === t ? g : Q;
      }
      function tE(r, a) {
        return r != null && Rg(r, a, UC);
      }
      function qf(r, a) {
        return r != null && Rg(r, a, EC);
      }
      var nE = Lg(function(r, a, g) {
        a != null && typeof a.toString != "function" && (a = V.call(a)), r[a] = g;
      }, Jf(zt)), rE = Lg(function(r, a, g) {
        a != null && typeof a.toString != "function" && (a = V.call(a)), Se.call(r, a) ? r[a].push(g) : r[a] = [g];
      }, ZA), iE = me(No);
      function pt(r) {
        return Xt(r) ? jp(r) : mf(r);
      }
      function qt(r) {
        return Xt(r) ? jp(r, !0) : OC(r);
      }
      function aE(r, a) {
        var g = {};
        return a = ZA(a, 3), tr(r, function(Q, I, N) {
          Ur(g, a(Q, I, N), Q);
        }), g;
      }
      function oE(r, a) {
        var g = {};
        return a = ZA(a, 3), tr(r, function(Q, I, N) {
          Ur(g, I, a(Q, I, N));
        }), g;
      }
      var sE = ba(function(r, a, g) {
        xu(r, a, g);
      }), CB = ba(function(r, a, g, Q) {
        xu(r, a, g, Q);
      }), uE = br(function(r, a) {
        var g = {};
        if (r == null)
          return g;
        var Q = !1;
        a = J(a, function(N) {
          return N = oi(N, r), Q || (Q = N.length > 1), N;
        }), nr(r, Lf(r), g), Q && (g = dn(g, B | p | v, nQ));
        for (var I = a.length; I--; )
          Uf(g, a[I]);
        return g;
      });
      function lE(r, a) {
        return QB(r, Gu(ZA(a)));
      }
      var cE = br(function(r, a) {
        return r == null ? {} : MC(r, a);
      });
      function QB(r, a) {
        if (r == null)
          return {};
        var g = J(Lf(r), function(Q) {
          return [Q];
        });
        return a = ZA(a), dg(r, g, function(Q, I) {
          return a(Q, I[0]);
        });
      }
      function fE(r, a, g) {
        a = oi(a, r);
        var Q = -1, I = a.length;
        for (I || (I = 1, r = t); ++Q < I; ) {
          var N = r == null ? t : r[rr(a[Q])];
          N === t && (Q = I, N = g), r = xr(N) ? N.call(r) : N;
        }
        return r;
      }
      function hE(r, a, g) {
        return r == null ? r : Po(r, a, g);
      }
      function dE(r, a, g, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Po(r, a, g, Q);
      }
      var FB = Og(pt), UB = Og(qt);
      function pE(r, a, g) {
        var Q = ce(r), I = Q || ui(r) || Ia(r);
        if (a = ZA(a, 4), g == null) {
          var N = r && r.constructor;
          I ? g = Q ? new N() : [] : je(r) ? g = xr(N) ? Ea(re(r)) : {} : g = {};
        }
        return (I ? m : tr)(r, function($, W, nA) {
          return a(g, $, W, nA);
        }), g;
      }
      function gE(r, a) {
        return r == null ? !0 : Uf(r, a);
      }
      function BE(r, a, g) {
        return r == null ? r : mg(r, a, _f(g));
      }
      function wE(r, a, g, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : mg(r, a, _f(g), Q);
      }
      function Ha(r) {
        return r == null ? [] : It(r, pt(r));
      }
      function mE(r) {
        return r == null ? [] : It(r, qt(r));
      }
      function vE(r, a, g) {
        return g === t && (g = a, a = t), g !== t && (g = Bn(g), g = g === g ? g : 0), a !== t && (a = Bn(a), a = a === a ? a : 0), Ni(Bn(r), a, g);
      }
      function yE(r, a, g) {
        return a = Ir(a), g === t ? (g = a, a = 0) : g = Ir(g), r = Bn(r), bC(r, a, g);
      }
      function CE(r, a, g) {
        if (g && typeof g != "boolean" && Rt(r, a, g) && (a = g = t), g === t && (typeof a == "boolean" ? (g = a, a = t) : typeof r == "boolean" && (g = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = Ir(r), a === t ? (a = r, r = 0) : a = Ir(a)), r > a) {
          var Q = r;
          r = a, a = Q;
        }
        if (g || r % 1 || a % 1) {
          var I = zp();
          return Ht(r + I * (a - r + tf("1e-" + ((I + "").length - 1))), a);
        }
        return Cf(r, a);
      }
      var QE = _a(function(r, a, g) {
        return a = a.toLowerCase(), r + (g ? EB(a) : a);
      });
      function EB(r) {
        return zf(Ne(r).toLowerCase());
      }
      function bB(r) {
        return r = Ne(r), r && r.replace(Vc, bo).replace(uu, "");
      }
      function FE(r, a, g) {
        r = Ne(r), a = tn(a);
        var Q = r.length;
        g = g === t ? Q : Ni(ge(g), 0, Q);
        var I = g;
        return g -= a.length, g >= 0 && r.slice(g, I) == a;
      }
      function UE(r) {
        return r = Ne(r), r && Ei.test(r) ? r.replace(Ui, Oe) : r;
      }
      function EE(r) {
        return r = Ne(r), r && Br.test(r) ? r.replace(fo, "\\$&") : r;
      }
      var bE = _a(function(r, a, g) {
        return r + (g ? "-" : "") + a.toLowerCase();
      }), _E = _a(function(r, a, g) {
        return r + (g ? " " : "") + a.toLowerCase();
      }), xE = Ig("toLowerCase");
      function IE(r, a, g) {
        r = Ne(r), a = ge(a);
        var Q = a ? ei(r) : 0;
        if (!a || Q >= a)
          return r;
        var I = (a - Q) / 2;
        return Du(dt(I), g) + r + Du(er(I), g);
      }
      function HE(r, a, g) {
        r = Ne(r), a = ge(a);
        var Q = a ? ei(r) : 0;
        return a && Q < a ? r + Du(a - Q, g) : r;
      }
      function SE(r, a, g) {
        r = Ne(r), a = ge(a);
        var Q = a ? ei(r) : 0;
        return a && Q < a ? Du(a - Q, g) + r : r;
      }
      function LE(r, a, g) {
        return g || a == null ? a = 0 : a && (a = +a), Ky(Ne(r).replace(sa, ""), a || 0);
      }
      function TE(r, a, g) {
        return (g ? Rt(r, a, g) : a === t) ? a = 1 : a = ge(a), Qf(Ne(r), a);
      }
      function DE() {
        var r = arguments, a = Ne(r[0]);
        return r.length < 3 ? a : a.replace(r[1], r[2]);
      }
      var OE = _a(function(r, a, g) {
        return r + (g ? "_" : "") + a.toLowerCase();
      });
      function NE(r, a, g) {
        return g && typeof g != "number" && Rt(r, a, g) && (a = g = t), g = g === t ? D : g >>> 0, g ? (r = Ne(r), r && (typeof a == "string" || a != null && !Wf(a)) && (a = tn(a), !a && Zn(r)) ? si(wt(r), 0, g) : r.split(a, g)) : [];
      }
      var ME = _a(function(r, a, g) {
        return r + (g ? " " : "") + zf(a);
      });
      function PE(r, a, g) {
        return r = Ne(r), g = g == null ? 0 : Ni(ge(g), 0, r.length), a = tn(a), r.slice(g, g + a.length) == a;
      }
      function KE(r, a, g) {
        var Q = T.templateSettings;
        g && Rt(r, a, g) && (a = t), r = Ne(r), a = Xu({}, a, Q, Ng);
        var I = Xu({}, a.imports, Q.imports, Ng), N = pt(I), $ = It(I, N), W, nA, vA = 0, yA = a.interpolate || ca, xA = "__p += '", OA = Li(
          (a.escape || ca).source + "|" + yA.source + "|" + (yA === bi ? Xs : ca).source + "|" + (a.evaluate || ca).source + "|$",
          "g"
        ), GA = "//# sourceURL=" + (Se.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++fu + "]") + `
`;
        r.replace(OA, function(ne, Fe, _e, rn, kt, an) {
          return _e || (_e = rn), xA += r.slice(vA, an).replace(Wc, yr), Fe && (W = !0, xA += `' +
__e(` + Fe + `) +
'`), kt && (nA = !0, xA += `';
` + kt + `;
__p += '`), _e && (xA += `' +
((__t = (` + _e + `)) == null ? '' : __t) +
'`), vA = an + ne.length, ne;
        }), xA += `';
`;
        var te = Se.call(a, "variable") && a.variable;
        if (!te)
          xA = `with (obj) {
` + xA + `
}
`;
        else if (la.test(te))
          throw new ae(f);
        xA = (nA ? xA.replace(Qe, "") : xA).replace(ot, "$1").replace(bt, "$1;"), xA = "function(" + (te || "obj") + `) {
` + (te ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (W ? ", __e = _.escape" : "") + (nA ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + xA + `return __p
}`;
        var we = xB(function() {
          return He(N, GA + "return " + xA).apply(t, $);
        });
        if (we.source = xA, Vf(we))
          throw we;
        return we;
      }
      function RE(r) {
        return Ne(r).toLowerCase();
      }
      function kE(r) {
        return Ne(r).toUpperCase();
      }
      function $E(r, a, g) {
        if (r = Ne(r), r && (g || a === t))
          return Sn(r);
        if (!r || !(a = tn(a)))
          return r;
        var Q = wt(r), I = wt(a), N = Ln(Q, I), $ = Eo(Q, I) + 1;
        return si(Q, N, $).join("");
      }
      function GE(r, a, g) {
        if (r = Ne(r), r && (g || a === t))
          return r.slice(0, vu(r) + 1);
        if (!r || !(a = tn(a)))
          return r;
        var Q = wt(r), I = Eo(Q, wt(a)) + 1;
        return si(Q, 0, I).join("");
      }
      function VE(r, a, g) {
        if (r = Ne(r), r && (g || a === t))
          return r.replace(sa, "");
        if (!r || !(a = tn(a)))
          return r;
        var Q = wt(r), I = Ln(Q, wt(a));
        return si(Q, I).join("");
      }
      function WE(r, a) {
        var g = mA, Q = FA;
        if (je(a)) {
          var I = "separator" in a ? a.separator : I;
          g = "length" in a ? ge(a.length) : g, Q = "omission" in a ? tn(a.omission) : Q;
        }
        r = Ne(r);
        var N = r.length;
        if (Zn(r)) {
          var $ = wt(r);
          N = $.length;
        }
        if (g >= N)
          return r;
        var W = g - ei(Q);
        if (W < 1)
          return Q;
        var nA = $ ? si($, 0, W).join("") : r.slice(0, W);
        if (I === t)
          return nA + Q;
        if ($ && (W += nA.length - W), Wf(I)) {
          if (r.slice(W).search(I)) {
            var vA, yA = nA;
            for (I.global || (I = Li(I.source, Ne(zn.exec(I)) + "g")), I.lastIndex = 0; vA = I.exec(yA); )
              var xA = vA.index;
            nA = nA.slice(0, xA === t ? W : xA);
          }
        } else if (r.indexOf(tn(I), W) != W) {
          var OA = nA.lastIndexOf(I);
          OA > -1 && (nA = nA.slice(0, OA));
        }
        return nA + Q;
      }
      function XE(r) {
        return r = Ne(r), r && bn.test(r) ? r.replace(En, xo) : r;
      }
      var qE = _a(function(r, a, g) {
        return r + (g ? " " : "") + a.toUpperCase();
      }), zf = Ig("toUpperCase");
      function _B(r, a, g) {
        return r = Ne(r), a = g ? t : a, a === t ? rf(r) ? Dn(r) : Ae(r) : r.match(a) || [];
      }
      var xB = me(function(r, a) {
        try {
          return u(r, t, a);
        } catch (g) {
          return Vf(g) ? g : new ae(g);
        }
      }), zE = br(function(r, a) {
        return m(a, function(g) {
          g = rr(g), Ur(r, g, $f(r[g], r));
        }), r;
      });
      function JE(r) {
        var a = r == null ? 0 : r.length, g = ZA();
        return r = a ? J(r, function(Q) {
          if (typeof Q[1] != "function")
            throw new mt(l);
          return [g(Q[0]), Q[1]];
        }) : [], me(function(Q) {
          for (var I = -1; ++I < a; ) {
            var N = r[I];
            if (u(N[0], this, Q))
              return u(N[1], this, Q);
          }
        });
      }
      function jE(r) {
        return CC(dn(r, B));
      }
      function Jf(r) {
        return function() {
          return r;
        };
      }
      function YE(r, a) {
        return r == null || r !== r ? a : r;
      }
      var ZE = Sg(), Ab = Sg(!0);
      function zt(r) {
        return r;
      }
      function jf(r) {
        return sg(typeof r == "function" ? r : dn(r, B));
      }
      function eb(r) {
        return lg(dn(r, B));
      }
      function tb(r, a) {
        return cg(r, dn(a, B));
      }
      var nb = me(function(r, a) {
        return function(g) {
          return No(g, r, a);
        };
      }), rb = me(function(r, a) {
        return function(g) {
          return No(r, g, a);
        };
      });
      function Yf(r, a, g) {
        var Q = pt(a), I = _u(a, Q);
        g == null && !(je(a) && (I.length || !Q.length)) && (g = a, a = r, r = this, I = _u(a, pt(a)));
        var N = !(je(g) && "chain" in g) || !!g.chain, $ = xr(r);
        return m(I, function(W) {
          var nA = a[W];
          r[W] = nA, $ && (r.prototype[W] = function() {
            var vA = this.__chain__;
            if (N || vA) {
              var yA = r(this.__wrapped__), xA = yA.__actions__ = Wt(this.__actions__);
              return xA.push({ func: nA, args: arguments, thisArg: r }), yA.__chain__ = vA, yA;
            }
            return nA.apply(r, Z([this.value()], arguments));
          });
        }), r;
      }
      function ib() {
        return Ze._ === this && (Ze._ = pA), this;
      }
      function Zf() {
      }
      function ab(r) {
        return r = ge(r), me(function(a) {
          return fg(a, r);
        });
      }
      var ob = If(J), sb = If(E), ub = If(TA);
      function IB(r) {
        return Nf(r) ? le(rr(r)) : PC(r);
      }
      function lb(r) {
        return function(a) {
          return r == null ? t : Mi(r, a);
        };
      }
      var cb = Tg(), fb = Tg(!0);
      function Ah() {
        return [];
      }
      function eh() {
        return !1;
      }
      function hb() {
        return {};
      }
      function db() {
        return "";
      }
      function pb() {
        return !0;
      }
      function gb(r, a) {
        if (r = ge(r), r < 1 || r > HA)
          return [];
        var g = D, Q = Ht(r, D);
        a = ZA(a), r -= D;
        for (var I = Hn(Q, a); ++g < r; )
          a(g);
        return I;
      }
      function Bb(r) {
        return ce(r) ? J(r, rr) : nn(r) ? [r] : Wt(Jg(Ne(r)));
      }
      function wb(r) {
        var a = ++sf;
        return Ne(r) + a;
      }
      var mb = Tu(function(r, a) {
        return r + a;
      }, 0), vb = Hf("ceil"), yb = Tu(function(r, a) {
        return r / a;
      }, 1), Cb = Hf("floor");
      function Qb(r) {
        return r && r.length ? bu(r, zt, gf) : t;
      }
      function Fb(r, a) {
        return r && r.length ? bu(r, ZA(a, 2), gf) : t;
      }
      function Ub(r) {
        return ut(r, zt);
      }
      function Eb(r, a) {
        return ut(r, ZA(a, 2));
      }
      function bb(r) {
        return r && r.length ? bu(r, zt, vf) : t;
      }
      function _b(r, a) {
        return r && r.length ? bu(r, ZA(a, 2), vf) : t;
      }
      var xb = Tu(function(r, a) {
        return r * a;
      }, 1), Ib = Hf("round"), Hb = Tu(function(r, a) {
        return r - a;
      }, 0);
      function Sb(r) {
        return r && r.length ? xt(r, zt) : 0;
      }
      function Lb(r, a) {
        return r && r.length ? xt(r, ZA(a, 2)) : 0;
      }
      return T.after = eU, T.ary = oB, T.assign = kU, T.assignIn = yB, T.assignInWith = Xu, T.assignWith = $U, T.at = GU, T.before = sB, T.bind = $f, T.bindAll = zE, T.bindKey = uB, T.castArray = hU, T.chain = rB, T.chunk = CQ, T.compact = QQ, T.concat = FQ, T.cond = JE, T.conforms = jE, T.constant = Jf, T.countBy = SF, T.create = VU, T.curry = lB, T.curryRight = cB, T.debounce = fB, T.defaults = WU, T.defaultsDeep = XU, T.defer = tU, T.delay = nU, T.difference = UQ, T.differenceBy = EQ, T.differenceWith = bQ, T.drop = _Q, T.dropRight = xQ, T.dropRightWhile = IQ, T.dropWhile = HQ, T.fill = SQ, T.filter = TF, T.flatMap = NF, T.flatMapDeep = MF, T.flatMapDepth = PF, T.flatten = AB, T.flattenDeep = LQ, T.flattenDepth = TQ, T.flip = rU, T.flow = ZE, T.flowRight = Ab, T.fromPairs = DQ, T.functions = AE, T.functionsIn = eE, T.groupBy = KF, T.initial = NQ, T.intersection = MQ, T.intersectionBy = PQ, T.intersectionWith = KQ, T.invert = nE, T.invertBy = rE, T.invokeMap = kF, T.iteratee = jf, T.keyBy = $F, T.keys = pt, T.keysIn = qt, T.map = Ru, T.mapKeys = aE, T.mapValues = oE, T.matches = eb, T.matchesProperty = tb, T.memoize = $u, T.merge = sE, T.mergeWith = CB, T.method = nb, T.methodOf = rb, T.mixin = Yf, T.negate = Gu, T.nthArg = ab, T.omit = uE, T.omitBy = lE, T.once = iU, T.orderBy = GF, T.over = ob, T.overArgs = aU, T.overEvery = sb, T.overSome = ub, T.partial = Gf, T.partialRight = hB, T.partition = VF, T.pick = cE, T.pickBy = QB, T.property = IB, T.propertyOf = lb, T.pull = GQ, T.pullAll = tB, T.pullAllBy = VQ, T.pullAllWith = WQ, T.pullAt = XQ, T.range = cb, T.rangeRight = fb, T.rearg = oU, T.reject = qF, T.remove = qQ, T.rest = sU, T.reverse = Rf, T.sampleSize = JF, T.set = hE, T.setWith = dE, T.shuffle = jF, T.slice = zQ, T.sortBy = AU, T.sortedUniq = tF, T.sortedUniqBy = nF, T.split = NE, T.spread = uU, T.tail = rF, T.take = iF, T.takeRight = aF, T.takeRightWhile = oF, T.takeWhile = sF, T.tap = QF, T.throttle = lU, T.thru = Ku, T.toArray = wB, T.toPairs = FB, T.toPairsIn = UB, T.toPath = Bb, T.toPlainObject = vB, T.transform = pE, T.unary = cU, T.union = uF, T.unionBy = lF, T.unionWith = cF, T.uniq = fF, T.uniqBy = hF, T.uniqWith = dF, T.unset = gE, T.unzip = kf, T.unzipWith = nB, T.update = BE, T.updateWith = wE, T.values = Ha, T.valuesIn = mE, T.without = pF, T.words = _B, T.wrap = fU, T.xor = gF, T.xorBy = BF, T.xorWith = wF, T.zip = mF, T.zipObject = vF, T.zipObjectDeep = yF, T.zipWith = CF, T.entries = FB, T.entriesIn = UB, T.extend = yB, T.extendWith = Xu, Yf(T, T), T.add = mb, T.attempt = xB, T.camelCase = QE, T.capitalize = EB, T.ceil = vb, T.clamp = vE, T.clone = dU, T.cloneDeep = gU, T.cloneDeepWith = BU, T.cloneWith = pU, T.conformsTo = wU, T.deburr = bB, T.defaultTo = YE, T.divide = yb, T.endsWith = FE, T.eq = Nn, T.escape = UE, T.escapeRegExp = EE, T.every = LF, T.find = DF, T.findIndex = Yg, T.findKey = qU, T.findLast = OF, T.findLastIndex = Zg, T.findLastKey = zU, T.floor = Cb, T.forEach = iB, T.forEachRight = aB, T.forIn = JU, T.forInRight = jU, T.forOwn = YU, T.forOwnRight = ZU, T.get = Xf, T.gt = mU, T.gte = vU, T.has = tE, T.hasIn = qf, T.head = eB, T.identity = zt, T.includes = RF, T.indexOf = OQ, T.inRange = yE, T.invoke = iE, T.isArguments = Ri, T.isArray = ce, T.isArrayBuffer = yU, T.isArrayLike = Xt, T.isArrayLikeObject = tt, T.isBoolean = CU, T.isBuffer = ui, T.isDate = QU, T.isElement = FU, T.isEmpty = UU, T.isEqual = EU, T.isEqualWith = bU, T.isError = Vf, T.isFinite = _U, T.isFunction = xr, T.isInteger = dB, T.isLength = Vu, T.isMap = pB, T.isMatch = xU, T.isMatchWith = IU, T.isNaN = HU, T.isNative = SU, T.isNil = TU, T.isNull = LU, T.isNumber = gB, T.isObject = je, T.isObjectLike = Ye, T.isPlainObject = $o, T.isRegExp = Wf, T.isSafeInteger = DU, T.isSet = BB, T.isString = Wu, T.isSymbol = nn, T.isTypedArray = Ia, T.isUndefined = OU, T.isWeakMap = NU, T.isWeakSet = MU, T.join = RQ, T.kebabCase = bE, T.last = gn, T.lastIndexOf = kQ, T.lowerCase = _E, T.lowerFirst = xE, T.lt = PU, T.lte = KU, T.max = Qb, T.maxBy = Fb, T.mean = Ub, T.meanBy = Eb, T.min = bb, T.minBy = _b, T.stubArray = Ah, T.stubFalse = eh, T.stubObject = hb, T.stubString = db, T.stubTrue = pb, T.multiply = xb, T.nth = $Q, T.noConflict = ib, T.noop = Zf, T.now = ku, T.pad = IE, T.padEnd = HE, T.padStart = SE, T.parseInt = LE, T.random = CE, T.reduce = WF, T.reduceRight = XF, T.repeat = TE, T.replace = DE, T.result = fE, T.round = Ib, T.runInContext = eA, T.sample = zF, T.size = YF, T.snakeCase = OE, T.some = ZF, T.sortedIndex = JQ, T.sortedIndexBy = jQ, T.sortedIndexOf = YQ, T.sortedLastIndex = ZQ, T.sortedLastIndexBy = AF, T.sortedLastIndexOf = eF, T.startCase = ME, T.startsWith = PE, T.subtract = Hb, T.sum = Sb, T.sumBy = Lb, T.template = KE, T.times = gb, T.toFinite = Ir, T.toInteger = ge, T.toLength = mB, T.toLower = RE, T.toNumber = Bn, T.toSafeInteger = RU, T.toString = Ne, T.toUpper = kE, T.trim = $E, T.trimEnd = GE, T.trimStart = VE, T.truncate = WE, T.unescape = XE, T.uniqueId = wb, T.upperCase = qE, T.upperFirst = zf, T.each = iB, T.eachRight = aB, T.first = eB, Yf(T, function() {
        var r = {};
        return tr(T, function(a, g) {
          Se.call(T.prototype, g) || (r[g] = a);
        }), r;
      }(), { chain: !1 }), T.VERSION = n, m(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        T[r].placeholder = T;
      }), m(["drop", "take"], function(r, a) {
        Ue.prototype[r] = function(g) {
          g = g === t ? 1 : lt(ge(g), 0);
          var Q = this.__filtered__ && !a ? new Ue(this) : this.clone();
          return Q.__filtered__ ? Q.__takeCount__ = Ht(g, Q.__takeCount__) : Q.__views__.push({
            size: Ht(g, D),
            type: r + (Q.__dir__ < 0 ? "Right" : "")
          }), Q;
        }, Ue.prototype[r + "Right"] = function(g) {
          return this.reverse()[r](g).reverse();
        };
      }), m(["filter", "map", "takeWhile"], function(r, a) {
        var g = a + 1, Q = g == z || g == aA;
        Ue.prototype[r] = function(I) {
          var N = this.clone();
          return N.__iteratees__.push({
            iteratee: ZA(I, 3),
            type: g
          }), N.__filtered__ = N.__filtered__ || Q, N;
        };
      }), m(["head", "last"], function(r, a) {
        var g = "take" + (a ? "Right" : "");
        Ue.prototype[r] = function() {
          return this[g](1).value()[0];
        };
      }), m(["initial", "tail"], function(r, a) {
        var g = "drop" + (a ? "" : "Right");
        Ue.prototype[r] = function() {
          return this.__filtered__ ? new Ue(this) : this[g](1);
        };
      }), Ue.prototype.compact = function() {
        return this.filter(zt);
      }, Ue.prototype.find = function(r) {
        return this.filter(r).head();
      }, Ue.prototype.findLast = function(r) {
        return this.reverse().find(r);
      }, Ue.prototype.invokeMap = me(function(r, a) {
        return typeof r == "function" ? new Ue(this) : this.map(function(g) {
          return No(g, r, a);
        });
      }), Ue.prototype.reject = function(r) {
        return this.filter(Gu(ZA(r)));
      }, Ue.prototype.slice = function(r, a) {
        r = ge(r);
        var g = this;
        return g.__filtered__ && (r > 0 || a < 0) ? new Ue(g) : (r < 0 ? g = g.takeRight(-r) : r && (g = g.drop(r)), a !== t && (a = ge(a), g = a < 0 ? g.dropRight(-a) : g.take(a - r)), g);
      }, Ue.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, Ue.prototype.toArray = function() {
        return this.take(D);
      }, tr(Ue.prototype, function(r, a) {
        var g = /^(?:filter|find|map|reject)|While$/.test(a), Q = /^(?:head|last)$/.test(a), I = T[Q ? "take" + (a == "last" ? "Right" : "") : a], N = Q || /^find/.test(a);
        I && (T.prototype[a] = function() {
          var $ = this.__wrapped__, W = Q ? [1] : arguments, nA = $ instanceof Ue, vA = W[0], yA = nA || ce($), xA = function(Fe) {
            var _e = I.apply(T, Z([Fe], W));
            return Q && OA ? _e[0] : _e;
          };
          yA && g && typeof vA == "function" && vA.length != 1 && (nA = yA = !1);
          var OA = this.__chain__, GA = !!this.__actions__.length, te = N && !OA, we = nA && !GA;
          if (!N && yA) {
            $ = we ? $ : new Ue(this);
            var ne = r.apply($, W);
            return ne.__actions__.push({ func: Ku, args: [xA], thisArg: t }), new hn(ne, OA);
          }
          return te && we ? r.apply(this, W) : (ne = this.thru(xA), te ? Q ? ne.value()[0] : ne.value() : ne);
        });
      }), m(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var a = ti[r], g = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", Q = /^(?:pop|shift)$/.test(r);
        T.prototype[r] = function() {
          var I = arguments;
          if (Q && !this.__chain__) {
            var N = this.value();
            return a.apply(ce(N) ? N : [], I);
          }
          return this[g](function($) {
            return a.apply(ce($) ? $ : [], I);
          });
        };
      }), tr(Ue.prototype, function(r, a) {
        var g = T[a];
        if (g) {
          var Q = g.name + "";
          Se.call(Ua, Q) || (Ua[Q] = []), Ua[Q].push({ name: a, func: g });
        }
      }), Ua[Lu(t, U).name] = [{
        name: "wrapper",
        func: t
      }], Ue.prototype.clone = Xy, Ue.prototype.reverse = qy, Ue.prototype.value = zy, T.prototype.at = FF, T.prototype.chain = UF, T.prototype.commit = EF, T.prototype.next = bF, T.prototype.plant = xF, T.prototype.reverse = IF, T.prototype.toJSON = T.prototype.valueOf = T.prototype.value = HF, T.prototype.first = T.prototype.head, zA && (T.prototype[zA] = _F), T;
    }, Ie = yu();
    fn ? ((fn.exports = Ie)._ = Ie, Co._ = Ie) : Ze._ = Ie;
  }).call(Wi);
})(jl, jl.exports);
var nH = jl.exports;
const Te = /* @__PURE__ */ vc(nH), rH = function(A) {
  var e = {
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
  }, t = Te.merge({}, e, A), n = function(i, s) {
    var l = Te.cloneDeep(i);
    if (i.show) {
      var f = i.size * t.scale;
      s.showThreshold && (l.show = f >= s.showThreshold), s.maxSize && f > s.maxSize && (l.size = s.maxSize / t.scale);
    }
    return l;
  };
  return {
    decorateGenome: function(i) {
      var s = i, l = {
        width: t.width * (1 - t.margin.left - t.margin.right),
        height: t.height * (1 - t.margin.top - t.margin.bottom)
      }, f = Math.min(t.numberPerRow, s.chromosomes.length), c = Math.ceil(s.chromosomes.length / f), h = {
        width: l.width / f,
        height: l.height / c
      }, w = {
        top: h.height * t.cellMargin.top,
        bottom: h.height * t.cellMargin.bottom,
        left: h.width * t.cellMargin.left,
        right: h.width * t.cellMargin.right
      }, B = t.labelHeight * h.height, p = t.labelHeight * h.height, v = h.height - B - p - w.top - w.bottom, o = Math.min(
        65 / t.scale,
        v * t.chromosomeAspectRatio
      ), C = h.width - o - w.left - w.right, F = C / 2, U = Math.max.apply(
        null,
        s.chromosomes.map(function(b) {
          return b.length;
        })
      ), S = {
        label: Te.pick(t.annotations.label, ["size", "show"]),
        marker: Te.pick(t.annotations.marker, ["size", "show"])
      };
      S.label = n(
        S.label,
        t.annotations.label
      ), S.marker = n(
        S.marker,
        t.annotations.marker
      );
      var O = {
        chromosomePosition: {
          height: v,
          width: o,
          x: w.left + F,
          y: w.top + B
        },
        labelPosition: {
          height: B,
          width: h.width - w.left - w.right,
          chromosomeWidth: o,
          x: w.left,
          y: w.top
        },
        sizeLabelPosition: {
          cellHeight: v,
          height: p,
          width: h.width - w.left - w.right,
          x: w.left,
          y: w.top + B
        },
        qtlAnnotationPosition: {
          height: v,
          width: F,
          chromosomeWidth: o,
          x: w.left,
          y: w.top + B
        },
        geneAnnotationPosition: {
          height: v,
          width: F,
          x: w.left + F + o,
          y: w.top + B
        },
        longestChromosome: U,
        annotations: S,
        scale: t.scale
      };
      return s.chromosomes.length == 1 && (O.chromosomePosition.x = w.left + 0.5 * F, O.geneAnnotationPosition.x = w.left + 0.5 * F + o, O.qtlAnnotationPosition.width = F * 0.5, O.geneAnnotationPosition.width = F * 1.5, O.labelPosition.x = w.left + 0.5 * F, O.labelPosition.width = o, O.sizeLabelPosition.x = w.left + 0.5 * F, O.sizeLabelPosition.width = o), s.drawing = Te.pick(t, ["width", "height"]), s.drawing.margin = {
        top: t.margin.top * s.drawing.height,
        left: t.margin.left * s.drawing.width,
        bottom: t.margin.bottom * s.drawing.height,
        right: t.margin.right * s.drawing.width
      }, s.chromosomes.forEach(function(b, P) {
        var R = P % t.numberPerRow, j = Math.floor(P / t.numberPerRow);
        b.cell = {
          y: j * h.height + t.margin.top * t.height,
          x: R * h.width + t.margin.left * t.width,
          width: h.width,
          height: h.height
        };
      }), s.cellLayout = O, s;
    },
    width: function(i) {
      return arguments.length ? (t.width = i, this) : t.width;
    },
    height: function(i) {
      return arguments.length ? (t.height = i, this) : t.height;
    },
    numberPerRow: function(i) {
      return arguments.length ? (t.numberPerRow = i, this) : t.numberPerRow;
    },
    margin: function(i) {
      return arguments.length ? (t.margin = Te.merge(t.margin, i), this) : t.margin;
    },
    labelHeight: function(i) {
      return arguments.length ? (t.labelHeight = i, this) : t.labelHeight;
    },
    cellMargin: function(i) {
      return arguments.length ? (t.cellMargin = i, this) : t.cellMargin;
    },
    chromosomeAspectRatio: function(i) {
      return arguments.length ? (t.chromosomeAspectRatio = i, this) : t.chromosomeAspectRatio;
    },
    scale: function(i) {
      return arguments.length ? (t.scale = i, this) : t.scale;
    }
  };
};
function Nl(A, e) {
  return A == null || e == null ? NaN : A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function iH(A, e) {
  return A == null || e == null ? NaN : e < A ? -1 : e > A ? 1 : e >= A ? 0 : NaN;
}
function Hv(A) {
  let e, t, n;
  A.length !== 2 ? (e = Nl, t = (f, c) => Nl(A(f), c), n = (f, c) => A(f) - c) : (e = A === Nl || A === iH ? A : aH, t = A, n = A);
  function i(f, c, h = 0, w = f.length) {
    if (h < w) {
      if (e(c, c) !== 0) return w;
      do {
        const B = h + w >>> 1;
        t(f[B], c) < 0 ? h = B + 1 : w = B;
      } while (h < w);
    }
    return h;
  }
  function s(f, c, h = 0, w = f.length) {
    if (h < w) {
      if (e(c, c) !== 0) return w;
      do {
        const B = h + w >>> 1;
        t(f[B], c) <= 0 ? h = B + 1 : w = B;
      } while (h < w);
    }
    return h;
  }
  function l(f, c, h = 0, w = f.length) {
    const B = i(f, c, h, w - 1);
    return B > h && n(f[B - 1], c) > -n(f[B], c) ? B - 1 : B;
  }
  return { left: i, center: l, right: s };
}
function aH() {
  return 0;
}
function oH(A) {
  return A === null ? NaN : +A;
}
const sH = Hv(Nl), uH = sH.right;
Hv(oH).center;
const lH = Math.sqrt(50), cH = Math.sqrt(10), fH = Math.sqrt(2);
function Yl(A, e, t) {
  const n = (e - A) / Math.max(0, t), i = Math.floor(Math.log10(n)), s = n / Math.pow(10, i), l = s >= lH ? 10 : s >= cH ? 5 : s >= fH ? 2 : 1;
  let f, c, h;
  return i < 0 ? (h = Math.pow(10, -i) / l, f = Math.round(A * h), c = Math.round(e * h), f / h < A && ++f, c / h > e && --c, h = -h) : (h = Math.pow(10, i) * l, f = Math.round(A / h), c = Math.round(e / h), f * h < A && ++f, c * h > e && --c), c < f && 0.5 <= t && t < 2 ? Yl(A, e, t * 2) : [f, c, h];
}
function hH(A, e, t) {
  if (e = +e, A = +A, t = +t, !(t > 0)) return [];
  if (A === e) return [A];
  const n = e < A, [i, s, l] = n ? Yl(e, A, t) : Yl(A, e, t);
  if (!(s >= i)) return [];
  const f = s - i + 1, c = new Array(f);
  if (n)
    if (l < 0) for (let h = 0; h < f; ++h) c[h] = (s - h) / -l;
    else for (let h = 0; h < f; ++h) c[h] = (s - h) * l;
  else if (l < 0) for (let h = 0; h < f; ++h) c[h] = (i + h) / -l;
  else for (let h = 0; h < f; ++h) c[h] = (i + h) * l;
  return c;
}
function Wh(A, e, t) {
  return e = +e, A = +A, t = +t, Yl(A, e, t)[2];
}
function dH(A, e, t) {
  e = +e, A = +A, t = +t;
  const n = e < A, i = n ? Wh(e, A, t) : Wh(A, e, t);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var pH = { value: function() {
} };
function _c() {
  for (var A = 0, e = arguments.length, t = {}, n; A < e; ++A) {
    if (!(n = arguments[A] + "") || n in t || /[\s.]/.test(n)) throw new Error("illegal type: " + n);
    t[n] = [];
  }
  return new Ml(t);
}
function Ml(A) {
  this._ = A;
}
function gH(A, e) {
  return A.trim().split(/^|\s+/).map(function(t) {
    var n = "", i = t.indexOf(".");
    if (i >= 0 && (n = t.slice(i + 1), t = t.slice(0, i)), t && !e.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: n };
  });
}
Ml.prototype = _c.prototype = {
  constructor: Ml,
  on: function(A, e) {
    var t = this._, n = gH(A + "", t), i, s = -1, l = n.length;
    if (arguments.length < 2) {
      for (; ++s < l; ) if ((i = (A = n[s]).type) && (i = BH(t[i], A.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++s < l; )
      if (i = (A = n[s]).type) t[i] = aw(t[i], A.name, e);
      else if (e == null) for (i in t) t[i] = aw(t[i], A.name, null);
    return this;
  },
  copy: function() {
    var A = {}, e = this._;
    for (var t in e) A[t] = e[t].slice();
    return new Ml(A);
  },
  call: function(A, e) {
    if ((i = arguments.length - 2) > 0) for (var t = new Array(i), n = 0, i, s; n < i; ++n) t[n] = arguments[n + 2];
    if (!this._.hasOwnProperty(A)) throw new Error("unknown type: " + A);
    for (s = this._[A], n = 0, i = s.length; n < i; ++n) s[n].value.apply(e, t);
  },
  apply: function(A, e, t) {
    if (!this._.hasOwnProperty(A)) throw new Error("unknown type: " + A);
    for (var n = this._[A], i = 0, s = n.length; i < s; ++i) n[i].value.apply(e, t);
  }
};
function BH(A, e) {
  for (var t = 0, n = A.length, i; t < n; ++t)
    if ((i = A[t]).name === e)
      return i.value;
}
function aw(A, e, t) {
  for (var n = 0, i = A.length; n < i; ++n)
    if (A[n].name === e) {
      A[n] = pH, A = A.slice(0, n).concat(A.slice(n + 1));
      break;
    }
  return t != null && A.push({ name: e, value: t }), A;
}
var Xh = "http://www.w3.org/1999/xhtml";
const ow = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Xh,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function xc(A) {
  var e = A += "", t = e.indexOf(":");
  return t >= 0 && (e = A.slice(0, t)) !== "xmlns" && (A = A.slice(t + 1)), ow.hasOwnProperty(e) ? { space: ow[e], local: A } : A;
}
function wH(A) {
  return function() {
    var e = this.ownerDocument, t = this.namespaceURI;
    return t === Xh && e.documentElement.namespaceURI === Xh ? e.createElement(A) : e.createElementNS(t, A);
  };
}
function mH(A) {
  return function() {
    return this.ownerDocument.createElementNS(A.space, A.local);
  };
}
function Sv(A) {
  var e = xc(A);
  return (e.local ? mH : wH)(e);
}
function vH() {
}
function Cp(A) {
  return A == null ? vH : function() {
    return this.querySelector(A);
  };
}
function yH(A) {
  typeof A != "function" && (A = Cp(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = new Array(l), c, h, w = 0; w < l; ++w)
      (c = s[w]) && (h = A.call(c, c.__data__, w, s)) && ("__data__" in c && (h.__data__ = c.__data__), f[w] = h);
  return new Gt(n, this._parents);
}
function Lv(A) {
  return A == null ? [] : Array.isArray(A) ? A : Array.from(A);
}
function CH() {
  return [];
}
function Tv(A) {
  return A == null ? CH : function() {
    return this.querySelectorAll(A);
  };
}
function QH(A) {
  return function() {
    return Lv(A.apply(this, arguments));
  };
}
function FH(A) {
  typeof A == "function" ? A = QH(A) : A = Tv(A);
  for (var e = this._groups, t = e.length, n = [], i = [], s = 0; s < t; ++s)
    for (var l = e[s], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && (n.push(A.call(c, c.__data__, h, l)), i.push(c));
  return new Gt(n, i);
}
function Dv(A) {
  return function() {
    return this.matches(A);
  };
}
function Ov(A) {
  return function(e) {
    return e.matches(A);
  };
}
var UH = Array.prototype.find;
function EH(A) {
  return function() {
    return UH.call(this.children, A);
  };
}
function bH() {
  return this.firstElementChild;
}
function _H(A) {
  return this.select(A == null ? bH : EH(typeof A == "function" ? A : Ov(A)));
}
var xH = Array.prototype.filter;
function IH() {
  return Array.from(this.children);
}
function HH(A) {
  return function() {
    return xH.call(this.children, A);
  };
}
function SH(A) {
  return this.selectAll(A == null ? IH : HH(typeof A == "function" ? A : Ov(A)));
}
function LH(A) {
  typeof A != "function" && (A = Dv(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = s[h]) && A.call(c, c.__data__, h, s) && f.push(c);
  return new Gt(n, this._parents);
}
function Nv(A) {
  return new Array(A.length);
}
function TH() {
  return new Gt(this._enter || this._groups.map(Nv), this._parents);
}
function Zl(A, e) {
  this.ownerDocument = A.ownerDocument, this.namespaceURI = A.namespaceURI, this._next = null, this._parent = A, this.__data__ = e;
}
Zl.prototype = {
  constructor: Zl,
  appendChild: function(A) {
    return this._parent.insertBefore(A, this._next);
  },
  insertBefore: function(A, e) {
    return this._parent.insertBefore(A, e);
  },
  querySelector: function(A) {
    return this._parent.querySelector(A);
  },
  querySelectorAll: function(A) {
    return this._parent.querySelectorAll(A);
  }
};
function DH(A) {
  return function() {
    return A;
  };
}
function OH(A, e, t, n, i, s) {
  for (var l = 0, f, c = e.length, h = s.length; l < h; ++l)
    (f = e[l]) ? (f.__data__ = s[l], n[l] = f) : t[l] = new Zl(A, s[l]);
  for (; l < c; ++l)
    (f = e[l]) && (i[l] = f);
}
function NH(A, e, t, n, i, s, l) {
  var f, c, h = /* @__PURE__ */ new Map(), w = e.length, B = s.length, p = new Array(w), v;
  for (f = 0; f < w; ++f)
    (c = e[f]) && (p[f] = v = l.call(c, c.__data__, f, e) + "", h.has(v) ? i[f] = c : h.set(v, c));
  for (f = 0; f < B; ++f)
    v = l.call(A, s[f], f, s) + "", (c = h.get(v)) ? (n[f] = c, c.__data__ = s[f], h.delete(v)) : t[f] = new Zl(A, s[f]);
  for (f = 0; f < w; ++f)
    (c = e[f]) && h.get(p[f]) === c && (i[f] = c);
}
function MH(A) {
  return A.__data__;
}
function PH(A, e) {
  if (!arguments.length) return Array.from(this, MH);
  var t = e ? NH : OH, n = this._parents, i = this._groups;
  typeof A != "function" && (A = DH(A));
  for (var s = i.length, l = new Array(s), f = new Array(s), c = new Array(s), h = 0; h < s; ++h) {
    var w = n[h], B = i[h], p = B.length, v = KH(A.call(w, w && w.__data__, h, n)), o = v.length, C = f[h] = new Array(o), F = l[h] = new Array(o), U = c[h] = new Array(p);
    t(w, B, C, F, U, v, e);
    for (var S = 0, O = 0, b, P; S < o; ++S)
      if (b = C[S]) {
        for (S >= O && (O = S + 1); !(P = F[O]) && ++O < o; ) ;
        b._next = P || null;
      }
  }
  return l = new Gt(l, n), l._enter = f, l._exit = c, l;
}
function KH(A) {
  return typeof A == "object" && "length" in A ? A : Array.from(A);
}
function RH() {
  return new Gt(this._exit || this._groups.map(Nv), this._parents);
}
function kH(A, e, t) {
  var n = this.enter(), i = this, s = this.exit();
  return typeof A == "function" ? (n = A(n), n && (n = n.selection())) : n = n.append(A + ""), e != null && (i = e(i), i && (i = i.selection())), t == null ? s.remove() : t(s), n && i ? n.merge(i).order() : i;
}
function $H(A) {
  for (var e = A.selection ? A.selection() : A, t = this._groups, n = e._groups, i = t.length, s = n.length, l = Math.min(i, s), f = new Array(i), c = 0; c < l; ++c)
    for (var h = t[c], w = n[c], B = h.length, p = f[c] = new Array(B), v, o = 0; o < B; ++o)
      (v = h[o] || w[o]) && (p[o] = v);
  for (; c < i; ++c)
    f[c] = t[c];
  return new Gt(f, this._parents);
}
function GH() {
  for (var A = this._groups, e = -1, t = A.length; ++e < t; )
    for (var n = A[e], i = n.length - 1, s = n[i], l; --i >= 0; )
      (l = n[i]) && (s && l.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(l, s), s = l);
  return this;
}
function VH(A) {
  A || (A = WH);
  function e(B, p) {
    return B && p ? A(B.__data__, p.__data__) : !B - !p;
  }
  for (var t = this._groups, n = t.length, i = new Array(n), s = 0; s < n; ++s) {
    for (var l = t[s], f = l.length, c = i[s] = new Array(f), h, w = 0; w < f; ++w)
      (h = l[w]) && (c[w] = h);
    c.sort(e);
  }
  return new Gt(i, this._parents).order();
}
function WH(A, e) {
  return A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function XH() {
  var A = arguments[0];
  return arguments[0] = this, A.apply(null, arguments), this;
}
function qH() {
  return Array.from(this);
}
function zH() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length; i < s; ++i) {
      var l = n[i];
      if (l) return l;
    }
  return null;
}
function JH() {
  let A = 0;
  for (const e of this) ++A;
  return A;
}
function jH() {
  return !this.node();
}
function YH(A) {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var i = e[t], s = 0, l = i.length, f; s < l; ++s)
      (f = i[s]) && A.call(f, f.__data__, s, i);
  return this;
}
function ZH(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function AS(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function eS(A, e) {
  return function() {
    this.setAttribute(A, e);
  };
}
function tS(A, e) {
  return function() {
    this.setAttributeNS(A.space, A.local, e);
  };
}
function nS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttribute(A) : this.setAttribute(A, t);
  };
}
function rS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttributeNS(A.space, A.local) : this.setAttributeNS(A.space, A.local, t);
  };
}
function iS(A, e) {
  var t = xc(A);
  if (arguments.length < 2) {
    var n = this.node();
    return t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t);
  }
  return this.each((e == null ? t.local ? AS : ZH : typeof e == "function" ? t.local ? rS : nS : t.local ? tS : eS)(t, e));
}
function Mv(A) {
  return A.ownerDocument && A.ownerDocument.defaultView || A.document && A || A.defaultView;
}
function aS(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function oS(A, e, t) {
  return function() {
    this.style.setProperty(A, e, t);
  };
}
function sS(A, e, t) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.style.removeProperty(A) : this.style.setProperty(A, n, t);
  };
}
function uS(A, e, t) {
  return arguments.length > 1 ? this.each((e == null ? aS : typeof e == "function" ? sS : oS)(A, e, t ?? "")) : Ao(this.node(), A);
}
function Ao(A, e) {
  return A.style.getPropertyValue(e) || Mv(A).getComputedStyle(A, null).getPropertyValue(e);
}
function lS(A) {
  return function() {
    delete this[A];
  };
}
function cS(A, e) {
  return function() {
    this[A] = e;
  };
}
function fS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? delete this[A] : this[A] = t;
  };
}
function hS(A, e) {
  return arguments.length > 1 ? this.each((e == null ? lS : typeof e == "function" ? fS : cS)(A, e)) : this.node()[A];
}
function Pv(A) {
  return A.trim().split(/^|\s+/);
}
function Qp(A) {
  return A.classList || new Kv(A);
}
function Kv(A) {
  this._node = A, this._names = Pv(A.getAttribute("class") || "");
}
Kv.prototype = {
  add: function(A) {
    var e = this._names.indexOf(A);
    e < 0 && (this._names.push(A), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(A) {
    var e = this._names.indexOf(A);
    e >= 0 && (this._names.splice(e, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(A) {
    return this._names.indexOf(A) >= 0;
  }
};
function Rv(A, e) {
  for (var t = Qp(A), n = -1, i = e.length; ++n < i; ) t.add(e[n]);
}
function kv(A, e) {
  for (var t = Qp(A), n = -1, i = e.length; ++n < i; ) t.remove(e[n]);
}
function dS(A) {
  return function() {
    Rv(this, A);
  };
}
function pS(A) {
  return function() {
    kv(this, A);
  };
}
function gS(A, e) {
  return function() {
    (e.apply(this, arguments) ? Rv : kv)(this, A);
  };
}
function BS(A, e) {
  var t = Pv(A + "");
  if (arguments.length < 2) {
    for (var n = Qp(this.node()), i = -1, s = t.length; ++i < s; ) if (!n.contains(t[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? gS : e ? dS : pS)(t, e));
}
function wS() {
  this.textContent = "";
}
function mS(A) {
  return function() {
    this.textContent = A;
  };
}
function vS(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function yS(A) {
  return arguments.length ? this.each(A == null ? wS : (typeof A == "function" ? vS : mS)(A)) : this.node().textContent;
}
function CS() {
  this.innerHTML = "";
}
function QS(A) {
  return function() {
    this.innerHTML = A;
  };
}
function FS(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function US(A) {
  return arguments.length ? this.each(A == null ? CS : (typeof A == "function" ? FS : QS)(A)) : this.node().innerHTML;
}
function ES() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function bS() {
  return this.each(ES);
}
function _S() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function xS() {
  return this.each(_S);
}
function IS(A) {
  var e = typeof A == "function" ? A : Sv(A);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function HS() {
  return null;
}
function SS(A, e) {
  var t = typeof A == "function" ? A : Sv(A), n = e == null ? HS : typeof e == "function" ? e : Cp(e);
  return this.select(function() {
    return this.insertBefore(t.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function LS() {
  var A = this.parentNode;
  A && A.removeChild(this);
}
function TS() {
  return this.each(LS);
}
function DS() {
  var A = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function OS() {
  var A = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function NS(A) {
  return this.select(A ? OS : DS);
}
function MS(A) {
  return arguments.length ? this.property("__data__", A) : this.node().__data__;
}
function PS(A) {
  return function(e) {
    A.call(this, e, this.__data__);
  };
}
function KS(A) {
  return A.trim().split(/^|\s+/).map(function(e) {
    var t = "", n = e.indexOf(".");
    return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), { type: e, name: t };
  });
}
function RS(A) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var t = 0, n = -1, i = e.length, s; t < i; ++t)
        s = e[t], (!A.type || s.type === A.type) && s.name === A.name ? this.removeEventListener(s.type, s.listener, s.options) : e[++n] = s;
      ++n ? e.length = n : delete this.__on;
    }
  };
}
function kS(A, e, t) {
  return function() {
    var n = this.__on, i, s = PS(e);
    if (n) {
      for (var l = 0, f = n.length; l < f; ++l)
        if ((i = n[l]).type === A.type && i.name === A.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = s, i.options = t), i.value = e;
          return;
        }
    }
    this.addEventListener(A.type, s, t), i = { type: A.type, name: A.name, value: e, listener: s, options: t }, n ? n.push(i) : this.__on = [i];
  };
}
function $S(A, e, t) {
  var n = KS(A + ""), i, s = n.length, l;
  if (arguments.length < 2) {
    var f = this.node().__on;
    if (f) {
      for (var c = 0, h = f.length, w; c < h; ++c)
        for (i = 0, w = f[c]; i < s; ++i)
          if ((l = n[i]).type === w.type && l.name === w.name)
            return w.value;
    }
    return;
  }
  for (f = e ? kS : RS, i = 0; i < s; ++i) this.each(f(n[i], e, t));
  return this;
}
function $v(A, e, t) {
  var n = Mv(A), i = n.CustomEvent;
  typeof i == "function" ? i = new i(e, t) : (i = n.document.createEvent("Event"), t ? (i.initEvent(e, t.bubbles, t.cancelable), i.detail = t.detail) : i.initEvent(e, !1, !1)), A.dispatchEvent(i);
}
function GS(A, e) {
  return function() {
    return $v(this, A, e);
  };
}
function VS(A, e) {
  return function() {
    return $v(this, A, e.apply(this, arguments));
  };
}
function WS(A, e) {
  return this.each((typeof e == "function" ? VS : GS)(A, e));
}
function* XS() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length, l; i < s; ++i)
      (l = n[i]) && (yield l);
}
var Fp = [null];
function Gt(A, e) {
  this._groups = A, this._parents = e;
}
function Os() {
  return new Gt([[document.documentElement]], Fp);
}
function qS() {
  return this;
}
Gt.prototype = Os.prototype = {
  constructor: Gt,
  select: yH,
  selectAll: FH,
  selectChild: _H,
  selectChildren: SH,
  filter: LH,
  data: PH,
  enter: TH,
  exit: RH,
  join: kH,
  merge: $H,
  selection: qS,
  order: GH,
  sort: VH,
  call: XH,
  nodes: qH,
  node: zH,
  size: JH,
  empty: jH,
  each: YH,
  attr: iS,
  style: uS,
  property: hS,
  classed: BS,
  text: yS,
  html: US,
  raise: bS,
  lower: xS,
  append: IS,
  insert: SS,
  remove: TS,
  clone: NS,
  datum: MS,
  on: $S,
  dispatch: WS,
  [Symbol.iterator]: XS
};
function XA(A) {
  return typeof A == "string" ? new Gt([[document.querySelector(A)]], [document.documentElement]) : new Gt([[A]], Fp);
}
function zS(A) {
  let e;
  for (; e = A.sourceEvent; ) A = e;
  return A;
}
function $n(A, e) {
  if (A = zS(A), e === void 0 && (e = A.currentTarget), e) {
    var t = e.ownerSVGElement || e;
    if (t.createSVGPoint) {
      var n = t.createSVGPoint();
      return n.x = A.clientX, n.y = A.clientY, n = n.matrixTransform(e.getScreenCTM().inverse()), [n.x, n.y];
    }
    if (e.getBoundingClientRect) {
      var i = e.getBoundingClientRect();
      return [A.clientX - i.left - e.clientLeft, A.clientY - i.top - e.clientTop];
    }
  }
  return [A.pageX, A.pageY];
}
function qh(A) {
  return typeof A == "string" ? new Gt([document.querySelectorAll(A)], [document.documentElement]) : new Gt([Lv(A)], Fp);
}
const JS = { passive: !1 }, Qs = { capture: !0, passive: !1 };
function oh(A) {
  A.stopImmediatePropagation();
}
function za(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function Gv(A) {
  var e = A.document.documentElement, t = XA(A).on("dragstart.drag", za, Qs);
  "onselectstart" in e ? t.on("selectstart.drag", za, Qs) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function Vv(A, e) {
  var t = A.document.documentElement, n = XA(A).on("dragstart.drag", null);
  e && (n.on("click.drag", za, Qs), setTimeout(function() {
    n.on("click.drag", null);
  }, 0)), "onselectstart" in t ? n.on("selectstart.drag", null) : (t.style.MozUserSelect = t.__noselect, delete t.__noselect);
}
const Al = (A) => () => A;
function zh(A, {
  sourceEvent: e,
  subject: t,
  target: n,
  identifier: i,
  active: s,
  x: l,
  y: f,
  dx: c,
  dy: h,
  dispatch: w
}) {
  Object.defineProperties(this, {
    type: { value: A, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    subject: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: s, enumerable: !0, configurable: !0 },
    x: { value: l, enumerable: !0, configurable: !0 },
    y: { value: f, enumerable: !0, configurable: !0 },
    dx: { value: c, enumerable: !0, configurable: !0 },
    dy: { value: h, enumerable: !0, configurable: !0 },
    _: { value: w }
  });
}
zh.prototype.on = function() {
  var A = this._.on.apply(this._, arguments);
  return A === this._ ? this : A;
};
function jS(A) {
  return !A.ctrlKey && !A.button;
}
function YS() {
  return this.parentNode;
}
function ZS(A, e) {
  return e ?? { x: A.x, y: A.y };
}
function AL() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function eL() {
  var A = jS, e = YS, t = ZS, n = AL, i = {}, s = _c("start", "drag", "end"), l = 0, f, c, h, w, B = 0;
  function p(b) {
    b.on("mousedown.drag", v).filter(n).on("touchstart.drag", F).on("touchmove.drag", U, JS).on("touchend.drag touchcancel.drag", S).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(b, P) {
    if (!(w || !A.call(this, b, P))) {
      var R = O(this, e.call(this, b, P), b, P, "mouse");
      R && (XA(b.view).on("mousemove.drag", o, Qs).on("mouseup.drag", C, Qs), Gv(b.view), oh(b), h = !1, f = b.clientX, c = b.clientY, R("start", b));
    }
  }
  function o(b) {
    if (za(b), !h) {
      var P = b.clientX - f, R = b.clientY - c;
      h = P * P + R * R > B;
    }
    i.mouse("drag", b);
  }
  function C(b) {
    XA(b.view).on("mousemove.drag mouseup.drag", null), Vv(b.view, h), za(b), i.mouse("end", b);
  }
  function F(b, P) {
    if (A.call(this, b, P)) {
      var R = b.changedTouches, j = e.call(this, b, P), dA = R.length, fA, mA;
      for (fA = 0; fA < dA; ++fA)
        (mA = O(this, j, b, P, R[fA].identifier, R[fA])) && (oh(b), mA("start", b, R[fA]));
    }
  }
  function U(b) {
    var P = b.changedTouches, R = P.length, j, dA;
    for (j = 0; j < R; ++j)
      (dA = i[P[j].identifier]) && (za(b), dA("drag", b, P[j]));
  }
  function S(b) {
    var P = b.changedTouches, R = P.length, j, dA;
    for (w && clearTimeout(w), w = setTimeout(function() {
      w = null;
    }, 500), j = 0; j < R; ++j)
      (dA = i[P[j].identifier]) && (oh(b), dA("end", b, P[j]));
  }
  function O(b, P, R, j, dA, fA) {
    var mA = s.copy(), FA = $n(fA || R, P), NA, bA, z;
    if ((z = t.call(b, new zh("beforestart", {
      sourceEvent: R,
      target: p,
      identifier: dA,
      active: l,
      x: FA[0],
      y: FA[1],
      dx: 0,
      dy: 0,
      dispatch: mA
    }), j)) != null)
      return NA = z.x - FA[0] || 0, bA = z.y - FA[1] || 0, function QA(aA, BA, HA) {
        var SA = FA, lA;
        switch (aA) {
          case "start":
            i[dA] = QA, lA = l++;
            break;
          case "end":
            delete i[dA], --l;
          case "drag":
            FA = $n(HA || BA, P), lA = l;
            break;
        }
        mA.call(
          aA,
          b,
          new zh(aA, {
            sourceEvent: BA,
            subject: z,
            target: p,
            identifier: dA,
            active: lA,
            x: FA[0] + NA,
            y: FA[1] + bA,
            dx: FA[0] - SA[0],
            dy: FA[1] - SA[1],
            dispatch: mA
          }),
          j
        );
      };
  }
  return p.filter = function(b) {
    return arguments.length ? (A = typeof b == "function" ? b : Al(!!b), p) : A;
  }, p.container = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Al(b), p) : e;
  }, p.subject = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Al(b), p) : t;
  }, p.touchable = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : Al(!!b), p) : n;
  }, p.on = function() {
    var b = s.on.apply(s, arguments);
    return b === s ? p : b;
  }, p.clickDistance = function(b) {
    return arguments.length ? (B = (b = +b) * b, p) : Math.sqrt(B);
  }, p;
}
function Up(A, e, t) {
  A.prototype = e.prototype = t, t.constructor = A;
}
function Wv(A, e) {
  var t = Object.create(A.prototype);
  for (var n in e) t[n] = e[n];
  return t;
}
function Ns() {
}
var Fs = 0.7, Ac = 1 / Fs, Ja = "\\s*([+-]?\\d+)\\s*", Us = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", sr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", tL = /^#([0-9a-f]{3,8})$/, nL = new RegExp(`^rgb\\(${Ja},${Ja},${Ja}\\)$`), rL = new RegExp(`^rgb\\(${sr},${sr},${sr}\\)$`), iL = new RegExp(`^rgba\\(${Ja},${Ja},${Ja},${Us}\\)$`), aL = new RegExp(`^rgba\\(${sr},${sr},${sr},${Us}\\)$`), oL = new RegExp(`^hsl\\(${Us},${sr},${sr}\\)$`), sL = new RegExp(`^hsla\\(${Us},${sr},${sr},${Us}\\)$`), sw = {
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
Up(Ns, ra, {
  copy(A) {
    return Object.assign(new this.constructor(), this, A);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: uw,
  // Deprecated! Use color.formatHex.
  formatHex: uw,
  formatHex8: uL,
  formatHsl: lL,
  formatRgb: lw,
  toString: lw
});
function uw() {
  return this.rgb().formatHex();
}
function uL() {
  return this.rgb().formatHex8();
}
function lL() {
  return Xv(this).formatHsl();
}
function lw() {
  return this.rgb().formatRgb();
}
function ra(A) {
  var e, t;
  return A = (A + "").trim().toLowerCase(), (e = tL.exec(A)) ? (t = e[1].length, e = parseInt(e[1], 16), t === 6 ? cw(e) : t === 3 ? new Zt(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : t === 8 ? el(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : t === 4 ? el(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = nL.exec(A)) ? new Zt(e[1], e[2], e[3], 1) : (e = rL.exec(A)) ? new Zt(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = iL.exec(A)) ? el(e[1], e[2], e[3], e[4]) : (e = aL.exec(A)) ? el(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = oL.exec(A)) ? dw(e[1], e[2] / 100, e[3] / 100, 1) : (e = sL.exec(A)) ? dw(e[1], e[2] / 100, e[3] / 100, e[4]) : sw.hasOwnProperty(A) ? cw(sw[A]) : A === "transparent" ? new Zt(NaN, NaN, NaN, 0) : null;
}
function cw(A) {
  return new Zt(A >> 16 & 255, A >> 8 & 255, A & 255, 1);
}
function el(A, e, t, n) {
  return n <= 0 && (A = e = t = NaN), new Zt(A, e, t, n);
}
function cL(A) {
  return A instanceof Ns || (A = ra(A)), A ? (A = A.rgb(), new Zt(A.r, A.g, A.b, A.opacity)) : new Zt();
}
function Jh(A, e, t, n) {
  return arguments.length === 1 ? cL(A) : new Zt(A, e, t, n ?? 1);
}
function Zt(A, e, t, n) {
  this.r = +A, this.g = +e, this.b = +t, this.opacity = +n;
}
Up(Zt, Jh, Wv(Ns, {
  brighter(A) {
    return A = A == null ? Ac : Math.pow(Ac, A), new Zt(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Fs : Math.pow(Fs, A), new Zt(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Zt(Yi(this.r), Yi(this.g), Yi(this.b), ec(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: fw,
  // Deprecated! Use color.formatHex.
  formatHex: fw,
  formatHex8: fL,
  formatRgb: hw,
  toString: hw
}));
function fw() {
  return `#${Ji(this.r)}${Ji(this.g)}${Ji(this.b)}`;
}
function fL() {
  return `#${Ji(this.r)}${Ji(this.g)}${Ji(this.b)}${Ji((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function hw() {
  const A = ec(this.opacity);
  return `${A === 1 ? "rgb(" : "rgba("}${Yi(this.r)}, ${Yi(this.g)}, ${Yi(this.b)}${A === 1 ? ")" : `, ${A})`}`;
}
function ec(A) {
  return isNaN(A) ? 1 : Math.max(0, Math.min(1, A));
}
function Yi(A) {
  return Math.max(0, Math.min(255, Math.round(A) || 0));
}
function Ji(A) {
  return A = Yi(A), (A < 16 ? "0" : "") + A.toString(16);
}
function dw(A, e, t, n) {
  return n <= 0 ? A = e = t = NaN : t <= 0 || t >= 1 ? A = e = NaN : e <= 0 && (A = NaN), new Wn(A, e, t, n);
}
function Xv(A) {
  if (A instanceof Wn) return new Wn(A.h, A.s, A.l, A.opacity);
  if (A instanceof Ns || (A = ra(A)), !A) return new Wn();
  if (A instanceof Wn) return A;
  A = A.rgb();
  var e = A.r / 255, t = A.g / 255, n = A.b / 255, i = Math.min(e, t, n), s = Math.max(e, t, n), l = NaN, f = s - i, c = (s + i) / 2;
  return f ? (e === s ? l = (t - n) / f + (t < n) * 6 : t === s ? l = (n - e) / f + 2 : l = (e - t) / f + 4, f /= c < 0.5 ? s + i : 2 - s - i, l *= 60) : f = c > 0 && c < 1 ? 0 : l, new Wn(l, f, c, A.opacity);
}
function hL(A, e, t, n) {
  return arguments.length === 1 ? Xv(A) : new Wn(A, e, t, n ?? 1);
}
function Wn(A, e, t, n) {
  this.h = +A, this.s = +e, this.l = +t, this.opacity = +n;
}
Up(Wn, hL, Wv(Ns, {
  brighter(A) {
    return A = A == null ? Ac : Math.pow(Ac, A), new Wn(this.h, this.s, this.l * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Fs : Math.pow(Fs, A), new Wn(this.h, this.s, this.l * A, this.opacity);
  },
  rgb() {
    var A = this.h % 360 + (this.h < 0) * 360, e = isNaN(A) || isNaN(this.s) ? 0 : this.s, t = this.l, n = t + (t < 0.5 ? t : 1 - t) * e, i = 2 * t - n;
    return new Zt(
      sh(A >= 240 ? A - 240 : A + 120, i, n),
      sh(A, i, n),
      sh(A < 120 ? A + 240 : A - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new Wn(pw(this.h), tl(this.s), tl(this.l), ec(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const A = ec(this.opacity);
    return `${A === 1 ? "hsl(" : "hsla("}${pw(this.h)}, ${tl(this.s) * 100}%, ${tl(this.l) * 100}%${A === 1 ? ")" : `, ${A})`}`;
  }
}));
function pw(A) {
  return A = (A || 0) % 360, A < 0 ? A + 360 : A;
}
function tl(A) {
  return Math.max(0, Math.min(1, A || 0));
}
function sh(A, e, t) {
  return (A < 60 ? e + (t - e) * A / 60 : A < 180 ? t : A < 240 ? e + (t - e) * (240 - A) / 60 : e) * 255;
}
const Ep = (A) => () => A;
function dL(A, e) {
  return function(t) {
    return A + t * e;
  };
}
function pL(A, e, t) {
  return A = Math.pow(A, t), e = Math.pow(e, t) - A, t = 1 / t, function(n) {
    return Math.pow(A + n * e, t);
  };
}
function gL(A) {
  return (A = +A) == 1 ? qv : function(e, t) {
    return t - e ? pL(e, t, A) : Ep(isNaN(e) ? t : e);
  };
}
function qv(A, e) {
  var t = e - A;
  return t ? dL(A, t) : Ep(isNaN(A) ? e : A);
}
const tc = function A(e) {
  var t = gL(e);
  function n(i, s) {
    var l = t((i = Jh(i)).r, (s = Jh(s)).r), f = t(i.g, s.g), c = t(i.b, s.b), h = qv(i.opacity, s.opacity);
    return function(w) {
      return i.r = l(w), i.g = f(w), i.b = c(w), i.opacity = h(w), i + "";
    };
  }
  return n.gamma = A, n;
}(1);
function BL(A, e) {
  e || (e = []);
  var t = A ? Math.min(e.length, A.length) : 0, n = e.slice(), i;
  return function(s) {
    for (i = 0; i < t; ++i) n[i] = A[i] * (1 - s) + e[i] * s;
    return n;
  };
}
function wL(A) {
  return ArrayBuffer.isView(A) && !(A instanceof DataView);
}
function mL(A, e) {
  var t = e ? e.length : 0, n = A ? Math.min(t, A.length) : 0, i = new Array(n), s = new Array(t), l;
  for (l = 0; l < n; ++l) i[l] = bp(A[l], e[l]);
  for (; l < t; ++l) s[l] = e[l];
  return function(f) {
    for (l = 0; l < n; ++l) s[l] = i[l](f);
    return s;
  };
}
function vL(A, e) {
  var t = /* @__PURE__ */ new Date();
  return A = +A, e = +e, function(n) {
    return t.setTime(A * (1 - n) + e * n), t;
  };
}
function Gn(A, e) {
  return A = +A, e = +e, function(t) {
    return A * (1 - t) + e * t;
  };
}
function yL(A, e) {
  var t = {}, n = {}, i;
  (A === null || typeof A != "object") && (A = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in A ? t[i] = bp(A[i], e[i]) : n[i] = e[i];
  return function(s) {
    for (i in t) n[i] = t[i](s);
    return n;
  };
}
var jh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, uh = new RegExp(jh.source, "g");
function CL(A) {
  return function() {
    return A;
  };
}
function QL(A) {
  return function(e) {
    return A(e) + "";
  };
}
function zv(A, e) {
  var t = jh.lastIndex = uh.lastIndex = 0, n, i, s, l = -1, f = [], c = [];
  for (A = A + "", e = e + ""; (n = jh.exec(A)) && (i = uh.exec(e)); )
    (s = i.index) > t && (s = e.slice(t, s), f[l] ? f[l] += s : f[++l] = s), (n = n[0]) === (i = i[0]) ? f[l] ? f[l] += i : f[++l] = i : (f[++l] = null, c.push({ i: l, x: Gn(n, i) })), t = uh.lastIndex;
  return t < e.length && (s = e.slice(t), f[l] ? f[l] += s : f[++l] = s), f.length < 2 ? c[0] ? QL(c[0].x) : CL(e) : (e = c.length, function(h) {
    for (var w = 0, B; w < e; ++w) f[(B = c[w]).i] = B.x(h);
    return f.join("");
  });
}
function bp(A, e) {
  var t = typeof e, n;
  return e == null || t === "boolean" ? Ep(e) : (t === "number" ? Gn : t === "string" ? (n = ra(e)) ? (e = n, tc) : zv : e instanceof ra ? tc : e instanceof Date ? vL : wL(e) ? BL : Array.isArray(e) ? mL : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? yL : Gn)(A, e);
}
function FL(A, e) {
  return A = +A, e = +e, function(t) {
    return Math.round(A * (1 - t) + e * t);
  };
}
var gw = 180 / Math.PI, Yh = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Jv(A, e, t, n, i, s) {
  var l, f, c;
  return (l = Math.sqrt(A * A + e * e)) && (A /= l, e /= l), (c = A * t + e * n) && (t -= A * c, n -= e * c), (f = Math.sqrt(t * t + n * n)) && (t /= f, n /= f, c /= f), A * n < e * t && (A = -A, e = -e, c = -c, l = -l), {
    translateX: i,
    translateY: s,
    rotate: Math.atan2(e, A) * gw,
    skewX: Math.atan(c) * gw,
    scaleX: l,
    scaleY: f
  };
}
var nl;
function UL(A) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(A + "");
  return e.isIdentity ? Yh : Jv(e.a, e.b, e.c, e.d, e.e, e.f);
}
function EL(A) {
  return A == null || (nl || (nl = document.createElementNS("http://www.w3.org/2000/svg", "g")), nl.setAttribute("transform", A), !(A = nl.transform.baseVal.consolidate())) ? Yh : (A = A.matrix, Jv(A.a, A.b, A.c, A.d, A.e, A.f));
}
function jv(A, e, t, n) {
  function i(h) {
    return h.length ? h.pop() + " " : "";
  }
  function s(h, w, B, p, v, o) {
    if (h !== B || w !== p) {
      var C = v.push("translate(", null, e, null, t);
      o.push({ i: C - 4, x: Gn(h, B) }, { i: C - 2, x: Gn(w, p) });
    } else (B || p) && v.push("translate(" + B + e + p + t);
  }
  function l(h, w, B, p) {
    h !== w ? (h - w > 180 ? w += 360 : w - h > 180 && (h += 360), p.push({ i: B.push(i(B) + "rotate(", null, n) - 2, x: Gn(h, w) })) : w && B.push(i(B) + "rotate(" + w + n);
  }
  function f(h, w, B, p) {
    h !== w ? p.push({ i: B.push(i(B) + "skewX(", null, n) - 2, x: Gn(h, w) }) : w && B.push(i(B) + "skewX(" + w + n);
  }
  function c(h, w, B, p, v, o) {
    if (h !== B || w !== p) {
      var C = v.push(i(v) + "scale(", null, ",", null, ")");
      o.push({ i: C - 4, x: Gn(h, B) }, { i: C - 2, x: Gn(w, p) });
    } else (B !== 1 || p !== 1) && v.push(i(v) + "scale(" + B + "," + p + ")");
  }
  return function(h, w) {
    var B = [], p = [];
    return h = A(h), w = A(w), s(h.translateX, h.translateY, w.translateX, w.translateY, B, p), l(h.rotate, w.rotate, B, p), f(h.skewX, w.skewX, B, p), c(h.scaleX, h.scaleY, w.scaleX, w.scaleY, B, p), h = w = null, function(v) {
      for (var o = -1, C = p.length, F; ++o < C; ) B[(F = p[o]).i] = F.x(v);
      return B.join("");
    };
  };
}
var bL = jv(UL, "px, ", "px)", "deg)"), _L = jv(EL, ", ", ")", ")"), xL = 1e-12;
function Bw(A) {
  return ((A = Math.exp(A)) + 1 / A) / 2;
}
function IL(A) {
  return ((A = Math.exp(A)) - 1 / A) / 2;
}
function HL(A) {
  return ((A = Math.exp(2 * A)) - 1) / (A + 1);
}
const SL = function A(e, t, n) {
  function i(s, l) {
    var f = s[0], c = s[1], h = s[2], w = l[0], B = l[1], p = l[2], v = w - f, o = B - c, C = v * v + o * o, F, U;
    if (C < xL)
      U = Math.log(p / h) / e, F = function(j) {
        return [
          f + j * v,
          c + j * o,
          h * Math.exp(e * j * U)
        ];
      };
    else {
      var S = Math.sqrt(C), O = (p * p - h * h + n * C) / (2 * h * t * S), b = (p * p - h * h - n * C) / (2 * p * t * S), P = Math.log(Math.sqrt(O * O + 1) - O), R = Math.log(Math.sqrt(b * b + 1) - b);
      U = (R - P) / e, F = function(j) {
        var dA = j * U, fA = Bw(P), mA = h / (t * S) * (fA * HL(e * dA + P) - IL(P));
        return [
          f + mA * v,
          c + mA * o,
          h * fA / Bw(e * dA + P)
        ];
      };
    }
    return F.duration = U * 1e3 * e / Math.SQRT2, F;
  }
  return i.rho = function(s) {
    var l = Math.max(1e-3, +s), f = l * l, c = f * f;
    return A(l, f, c);
  }, i;
}(Math.SQRT2, 2, 4);
var eo = 0, es = 0, Wo = 0, Yv = 1e3, nc, ts, rc = 0, ia = 0, Ic = 0, Es = typeof performance == "object" && performance.now ? performance : Date, Zv = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(A) {
  setTimeout(A, 17);
};
function _p() {
  return ia || (Zv(LL), ia = Es.now() + Ic);
}
function LL() {
  ia = 0;
}
function ic() {
  this._call = this._time = this._next = null;
}
ic.prototype = A0.prototype = {
  constructor: ic,
  restart: function(A, e, t) {
    if (typeof A != "function") throw new TypeError("callback is not a function");
    t = (t == null ? _p() : +t) + (e == null ? 0 : +e), !this._next && ts !== this && (ts ? ts._next = this : nc = this, ts = this), this._call = A, this._time = t, Zh();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Zh());
  }
};
function A0(A, e, t) {
  var n = new ic();
  return n.restart(A, e, t), n;
}
function TL() {
  _p(), ++eo;
  for (var A = nc, e; A; )
    (e = ia - A._time) >= 0 && A._call.call(void 0, e), A = A._next;
  --eo;
}
function ww() {
  ia = (rc = Es.now()) + Ic, eo = es = 0;
  try {
    TL();
  } finally {
    eo = 0, OL(), ia = 0;
  }
}
function DL() {
  var A = Es.now(), e = A - rc;
  e > Yv && (Ic -= e, rc = A);
}
function OL() {
  for (var A, e = nc, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), A = e, e = e._next) : (t = e._next, e._next = null, e = A ? A._next = t : nc = t);
  ts = A, Zh(n);
}
function Zh(A) {
  if (!eo) {
    es && (es = clearTimeout(es));
    var e = A - ia;
    e > 24 ? (A < 1 / 0 && (es = setTimeout(ww, A - Es.now() - Ic)), Wo && (Wo = clearInterval(Wo))) : (Wo || (rc = Es.now(), Wo = setInterval(DL, Yv)), eo = 1, Zv(ww));
  }
}
function mw(A, e, t) {
  var n = new ic();
  return e = e == null ? 0 : +e, n.restart((i) => {
    n.stop(), A(i + e);
  }, e, t), n;
}
var NL = _c("start", "end", "cancel", "interrupt"), ML = [], e0 = 0, vw = 1, Ad = 2, Pl = 3, yw = 4, ed = 5, Kl = 6;
function Hc(A, e, t, n, i, s) {
  var l = A.__transition;
  if (!l) A.__transition = {};
  else if (t in l) return;
  PL(A, t, {
    name: e,
    index: n,
    // For context during callback.
    group: i,
    // For context during callback.
    on: NL,
    tween: ML,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: e0
  });
}
function xp(A, e) {
  var t = Xn(A, e);
  if (t.state > e0) throw new Error("too late; already scheduled");
  return t;
}
function fr(A, e) {
  var t = Xn(A, e);
  if (t.state > Pl) throw new Error("too late; already running");
  return t;
}
function Xn(A, e) {
  var t = A.__transition;
  if (!t || !(t = t[e])) throw new Error("transition not found");
  return t;
}
function PL(A, e, t) {
  var n = A.__transition, i;
  n[e] = t, t.timer = A0(s, 0, t.time);
  function s(h) {
    t.state = vw, t.timer.restart(l, t.delay, t.time), t.delay <= h && l(h - t.delay);
  }
  function l(h) {
    var w, B, p, v;
    if (t.state !== vw) return c();
    for (w in n)
      if (v = n[w], v.name === t.name) {
        if (v.state === Pl) return mw(l);
        v.state === yw ? (v.state = Kl, v.timer.stop(), v.on.call("interrupt", A, A.__data__, v.index, v.group), delete n[w]) : +w < e && (v.state = Kl, v.timer.stop(), v.on.call("cancel", A, A.__data__, v.index, v.group), delete n[w]);
      }
    if (mw(function() {
      t.state === Pl && (t.state = yw, t.timer.restart(f, t.delay, t.time), f(h));
    }), t.state = Ad, t.on.call("start", A, A.__data__, t.index, t.group), t.state === Ad) {
      for (t.state = Pl, i = new Array(p = t.tween.length), w = 0, B = -1; w < p; ++w)
        (v = t.tween[w].value.call(A, A.__data__, t.index, t.group)) && (i[++B] = v);
      i.length = B + 1;
    }
  }
  function f(h) {
    for (var w = h < t.duration ? t.ease.call(null, h / t.duration) : (t.timer.restart(c), t.state = ed, 1), B = -1, p = i.length; ++B < p; )
      i[B].call(A, w);
    t.state === ed && (t.on.call("end", A, A.__data__, t.index, t.group), c());
  }
  function c() {
    t.state = Kl, t.timer.stop(), delete n[e];
    for (var h in n) return;
    delete A.__transition;
  }
}
function Rl(A, e) {
  var t = A.__transition, n, i, s = !0, l;
  if (t) {
    e = e == null ? null : e + "";
    for (l in t) {
      if ((n = t[l]).name !== e) {
        s = !1;
        continue;
      }
      i = n.state > Ad && n.state < ed, n.state = Kl, n.timer.stop(), n.on.call(i ? "interrupt" : "cancel", A, A.__data__, n.index, n.group), delete t[l];
    }
    s && delete A.__transition;
  }
}
function KL(A) {
  return this.each(function() {
    Rl(this, A);
  });
}
function RL(A, e) {
  var t, n;
  return function() {
    var i = fr(this, A), s = i.tween;
    if (s !== t) {
      n = t = s;
      for (var l = 0, f = n.length; l < f; ++l)
        if (n[l].name === e) {
          n = n.slice(), n.splice(l, 1);
          break;
        }
    }
    i.tween = n;
  };
}
function kL(A, e, t) {
  var n, i;
  if (typeof t != "function") throw new Error();
  return function() {
    var s = fr(this, A), l = s.tween;
    if (l !== n) {
      i = (n = l).slice();
      for (var f = { name: e, value: t }, c = 0, h = i.length; c < h; ++c)
        if (i[c].name === e) {
          i[c] = f;
          break;
        }
      c === h && i.push(f);
    }
    s.tween = i;
  };
}
function $L(A, e) {
  var t = this._id;
  if (A += "", arguments.length < 2) {
    for (var n = Xn(this.node(), t).tween, i = 0, s = n.length, l; i < s; ++i)
      if ((l = n[i]).name === A)
        return l.value;
    return null;
  }
  return this.each((e == null ? RL : kL)(t, A, e));
}
function Ip(A, e, t) {
  var n = A._id;
  return A.each(function() {
    var i = fr(this, n);
    (i.value || (i.value = {}))[e] = t.apply(this, arguments);
  }), function(i) {
    return Xn(i, n).value[e];
  };
}
function t0(A, e) {
  var t;
  return (typeof e == "number" ? Gn : e instanceof ra ? tc : (t = ra(e)) ? (e = t, tc) : zv)(A, e);
}
function GL(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function VL(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function WL(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttribute(A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function XL(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttributeNS(A.space, A.local);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function qL(A, e, t) {
  var n, i, s;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttribute(A) : (l = this.getAttribute(A), c = f + "", l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f)));
  };
}
function zL(A, e, t) {
  var n, i, s;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttributeNS(A.space, A.local) : (l = this.getAttributeNS(A.space, A.local), c = f + "", l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f)));
  };
}
function JL(A, e) {
  var t = xc(A), n = t === "transform" ? _L : t0;
  return this.attrTween(A, typeof e == "function" ? (t.local ? zL : qL)(t, n, Ip(this, "attr." + A, e)) : e == null ? (t.local ? VL : GL)(t) : (t.local ? XL : WL)(t, n, e));
}
function jL(A, e) {
  return function(t) {
    this.setAttribute(A, e.call(this, t));
  };
}
function YL(A, e) {
  return function(t) {
    this.setAttributeNS(A.space, A.local, e.call(this, t));
  };
}
function ZL(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && YL(A, s)), t;
  }
  return i._value = e, i;
}
function AT(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && jL(A, s)), t;
  }
  return i._value = e, i;
}
function eT(A, e) {
  var t = "attr." + A;
  if (arguments.length < 2) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  var n = xc(A);
  return this.tween(t, (n.local ? ZL : AT)(n, e));
}
function tT(A, e) {
  return function() {
    xp(this, A).delay = +e.apply(this, arguments);
  };
}
function nT(A, e) {
  return e = +e, function() {
    xp(this, A).delay = e;
  };
}
function rT(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? tT : nT)(e, A)) : Xn(this.node(), e).delay;
}
function iT(A, e) {
  return function() {
    fr(this, A).duration = +e.apply(this, arguments);
  };
}
function aT(A, e) {
  return e = +e, function() {
    fr(this, A).duration = e;
  };
}
function oT(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? iT : aT)(e, A)) : Xn(this.node(), e).duration;
}
function sT(A, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    fr(this, A).ease = e;
  };
}
function uT(A) {
  var e = this._id;
  return arguments.length ? this.each(sT(e, A)) : Xn(this.node(), e).ease;
}
function lT(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    if (typeof t != "function") throw new Error();
    fr(this, A).ease = t;
  };
}
function cT(A) {
  if (typeof A != "function") throw new Error();
  return this.each(lT(this._id, A));
}
function fT(A) {
  typeof A != "function" && (A = Dv(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = s[h]) && A.call(c, c.__data__, h, s) && f.push(c);
  return new kr(n, this._parents, this._name, this._id);
}
function hT(A) {
  if (A._id !== this._id) throw new Error();
  for (var e = this._groups, t = A._groups, n = e.length, i = t.length, s = Math.min(n, i), l = new Array(n), f = 0; f < s; ++f)
    for (var c = e[f], h = t[f], w = c.length, B = l[f] = new Array(w), p, v = 0; v < w; ++v)
      (p = c[v] || h[v]) && (B[v] = p);
  for (; f < n; ++f)
    l[f] = e[f];
  return new kr(l, this._parents, this._name, this._id);
}
function dT(A) {
  return (A + "").trim().split(/^|\s+/).every(function(e) {
    var t = e.indexOf(".");
    return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
  });
}
function pT(A, e, t) {
  var n, i, s = dT(e) ? xp : fr;
  return function() {
    var l = s(this, A), f = l.on;
    f !== n && (i = (n = f).copy()).on(e, t), l.on = i;
  };
}
function gT(A, e) {
  var t = this._id;
  return arguments.length < 2 ? Xn(this.node(), t).on.on(A) : this.each(pT(t, A, e));
}
function BT(A) {
  return function() {
    var e = this.parentNode;
    for (var t in this.__transition) if (+t !== A) return;
    e && e.removeChild(this);
  };
}
function wT() {
  return this.on("end.remove", BT(this._id));
}
function mT(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Cp(A));
  for (var n = this._groups, i = n.length, s = new Array(i), l = 0; l < i; ++l)
    for (var f = n[l], c = f.length, h = s[l] = new Array(c), w, B, p = 0; p < c; ++p)
      (w = f[p]) && (B = A.call(w, w.__data__, p, f)) && ("__data__" in w && (B.__data__ = w.__data__), h[p] = B, Hc(h[p], e, t, p, h, Xn(w, t)));
  return new kr(s, this._parents, e, t);
}
function vT(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Tv(A));
  for (var n = this._groups, i = n.length, s = [], l = [], f = 0; f < i; ++f)
    for (var c = n[f], h = c.length, w, B = 0; B < h; ++B)
      if (w = c[B]) {
        for (var p = A.call(w, w.__data__, B, c), v, o = Xn(w, t), C = 0, F = p.length; C < F; ++C)
          (v = p[C]) && Hc(v, e, t, C, p, o);
        s.push(p), l.push(w);
      }
  return new kr(s, l, e, t);
}
var yT = Os.prototype.constructor;
function CT() {
  return new yT(this._groups, this._parents);
}
function QT(A, e) {
  var t, n, i;
  return function() {
    var s = Ao(this, A), l = (this.style.removeProperty(A), Ao(this, A));
    return s === l ? null : s === t && l === n ? i : i = e(t = s, n = l);
  };
}
function n0(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function FT(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = Ao(this, A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function UT(A, e, t) {
  var n, i, s;
  return function() {
    var l = Ao(this, A), f = t(this), c = f + "";
    return f == null && (c = f = (this.style.removeProperty(A), Ao(this, A))), l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f));
  };
}
function ET(A, e) {
  var t, n, i, s = "style." + e, l = "end." + s, f;
  return function() {
    var c = fr(this, A), h = c.on, w = c.value[s] == null ? f || (f = n0(e)) : void 0;
    (h !== t || i !== w) && (n = (t = h).copy()).on(l, i = w), c.on = n;
  };
}
function bT(A, e, t) {
  var n = (A += "") == "transform" ? bL : t0;
  return e == null ? this.styleTween(A, QT(A, n)).on("end.style." + A, n0(A)) : typeof e == "function" ? this.styleTween(A, UT(A, n, Ip(this, "style." + A, e))).each(ET(this._id, A)) : this.styleTween(A, FT(A, n, e), t).on("end.style." + A, null);
}
function _T(A, e, t) {
  return function(n) {
    this.style.setProperty(A, e.call(this, n), t);
  };
}
function xT(A, e, t) {
  var n, i;
  function s() {
    var l = e.apply(this, arguments);
    return l !== i && (n = (i = l) && _T(A, l, t)), n;
  }
  return s._value = e, s;
}
function IT(A, e, t) {
  var n = "style." + (A += "");
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, xT(A, e, t ?? ""));
}
function HT(A) {
  return function() {
    this.textContent = A;
  };
}
function ST(A) {
  return function() {
    var e = A(this);
    this.textContent = e ?? "";
  };
}
function LT(A) {
  return this.tween("text", typeof A == "function" ? ST(Ip(this, "text", A)) : HT(A == null ? "" : A + ""));
}
function TT(A) {
  return function(e) {
    this.textContent = A.call(this, e);
  };
}
function DT(A) {
  var e, t;
  function n() {
    var i = A.apply(this, arguments);
    return i !== t && (e = (t = i) && TT(i)), e;
  }
  return n._value = A, n;
}
function OT(A) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (A == null) return this.tween(e, null);
  if (typeof A != "function") throw new Error();
  return this.tween(e, DT(A));
}
function NT() {
  for (var A = this._name, e = this._id, t = r0(), n = this._groups, i = n.length, s = 0; s < i; ++s)
    for (var l = n[s], f = l.length, c, h = 0; h < f; ++h)
      if (c = l[h]) {
        var w = Xn(c, e);
        Hc(c, A, t, h, l, {
          time: w.time + w.delay + w.duration,
          delay: 0,
          duration: w.duration,
          ease: w.ease
        });
      }
  return new kr(n, this._parents, A, t);
}
function MT() {
  var A, e, t = this, n = t._id, i = t.size();
  return new Promise(function(s, l) {
    var f = { value: l }, c = { value: function() {
      --i === 0 && s();
    } };
    t.each(function() {
      var h = fr(this, n), w = h.on;
      w !== A && (e = (A = w).copy(), e._.cancel.push(f), e._.interrupt.push(f), e._.end.push(c)), h.on = e;
    }), i === 0 && s();
  });
}
var PT = 0;
function kr(A, e, t, n) {
  this._groups = A, this._parents = e, this._name = t, this._id = n;
}
function r0() {
  return ++PT;
}
var Dr = Os.prototype;
kr.prototype = {
  constructor: kr,
  select: mT,
  selectAll: vT,
  selectChild: Dr.selectChild,
  selectChildren: Dr.selectChildren,
  filter: fT,
  merge: hT,
  selection: CT,
  transition: NT,
  call: Dr.call,
  nodes: Dr.nodes,
  node: Dr.node,
  size: Dr.size,
  empty: Dr.empty,
  each: Dr.each,
  on: gT,
  attr: JL,
  attrTween: eT,
  style: bT,
  styleTween: IT,
  text: LT,
  textTween: OT,
  remove: wT,
  tween: $L,
  delay: rT,
  duration: oT,
  ease: uT,
  easeVarying: cT,
  end: MT,
  [Symbol.iterator]: Dr[Symbol.iterator]
};
function KT(A) {
  return ((A *= 2) <= 1 ? A * A * A : (A -= 2) * A * A + 2) / 2;
}
var RT = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: KT
};
function kT(A, e) {
  for (var t; !(t = A.__transition) || !(t = t[e]); )
    if (!(A = A.parentNode))
      throw new Error(`transition ${e} not found`);
  return t;
}
function $T(A) {
  var e, t;
  A instanceof kr ? (e = A._id, A = A._name) : (e = r0(), (t = RT).time = _p(), A = A == null ? null : A + "");
  for (var n = this._groups, i = n.length, s = 0; s < i; ++s)
    for (var l = n[s], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && Hc(c, A, e, h, l, t || kT(c, e));
  return new kr(n, this._parents, A, e);
}
Os.prototype.interrupt = KL;
Os.prototype.transition = $T;
function GT(A) {
  return Math.abs(A = Math.round(A)) >= 1e21 ? A.toLocaleString("en").replace(/,/g, "") : A.toString(10);
}
function ac(A, e) {
  if ((t = (A = e ? A.toExponential(e - 1) : A.toExponential()).indexOf("e")) < 0) return null;
  var t, n = A.slice(0, t);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +A.slice(t + 1)
  ];
}
function to(A) {
  return A = ac(Math.abs(A)), A ? A[1] : NaN;
}
function VT(A, e) {
  return function(t, n) {
    for (var i = t.length, s = [], l = 0, f = A[0], c = 0; i > 0 && f > 0 && (c + f + 1 > n && (f = Math.max(1, n - c)), s.push(t.substring(i -= f, i + f)), !((c += f + 1) > n)); )
      f = A[l = (l + 1) % A.length];
    return s.reverse().join(e);
  };
}
function WT(A) {
  return function(e) {
    return e.replace(/[0-9]/g, function(t) {
      return A[+t];
    });
  };
}
var XT = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function oc(A) {
  if (!(e = XT.exec(A))) throw new Error("invalid format: " + A);
  var e;
  return new Hp({
    fill: e[1],
    align: e[2],
    sign: e[3],
    symbol: e[4],
    zero: e[5],
    width: e[6],
    comma: e[7],
    precision: e[8] && e[8].slice(1),
    trim: e[9],
    type: e[10]
  });
}
oc.prototype = Hp.prototype;
function Hp(A) {
  this.fill = A.fill === void 0 ? " " : A.fill + "", this.align = A.align === void 0 ? ">" : A.align + "", this.sign = A.sign === void 0 ? "-" : A.sign + "", this.symbol = A.symbol === void 0 ? "" : A.symbol + "", this.zero = !!A.zero, this.width = A.width === void 0 ? void 0 : +A.width, this.comma = !!A.comma, this.precision = A.precision === void 0 ? void 0 : +A.precision, this.trim = !!A.trim, this.type = A.type === void 0 ? "" : A.type + "";
}
Hp.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function qT(A) {
  A: for (var e = A.length, t = 1, n = -1, i; t < e; ++t)
    switch (A[t]) {
      case ".":
        n = i = t;
        break;
      case "0":
        n === 0 && (n = t), i = t;
        break;
      default:
        if (!+A[t]) break A;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? A.slice(0, n) + A.slice(i + 1) : A;
}
var i0;
function zT(A, e) {
  var t = ac(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1], s = i - (i0 = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, l = n.length;
  return s === l ? n : s > l ? n + new Array(s - l + 1).join("0") : s > 0 ? n.slice(0, s) + "." + n.slice(s) : "0." + new Array(1 - s).join("0") + ac(A, Math.max(0, e + s - 1))[0];
}
function Cw(A, e) {
  var t = ac(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const Qw = {
  "%": (A, e) => (A * 100).toFixed(e),
  b: (A) => Math.round(A).toString(2),
  c: (A) => A + "",
  d: GT,
  e: (A, e) => A.toExponential(e),
  f: (A, e) => A.toFixed(e),
  g: (A, e) => A.toPrecision(e),
  o: (A) => Math.round(A).toString(8),
  p: (A, e) => Cw(A * 100, e),
  r: Cw,
  s: zT,
  X: (A) => Math.round(A).toString(16).toUpperCase(),
  x: (A) => Math.round(A).toString(16)
};
function Fw(A) {
  return A;
}
var Uw = Array.prototype.map, Ew = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function JT(A) {
  var e = A.grouping === void 0 || A.thousands === void 0 ? Fw : VT(Uw.call(A.grouping, Number), A.thousands + ""), t = A.currency === void 0 ? "" : A.currency[0] + "", n = A.currency === void 0 ? "" : A.currency[1] + "", i = A.decimal === void 0 ? "." : A.decimal + "", s = A.numerals === void 0 ? Fw : WT(Uw.call(A.numerals, String)), l = A.percent === void 0 ? "%" : A.percent + "", f = A.minus === void 0 ? "−" : A.minus + "", c = A.nan === void 0 ? "NaN" : A.nan + "";
  function h(B) {
    B = oc(B);
    var p = B.fill, v = B.align, o = B.sign, C = B.symbol, F = B.zero, U = B.width, S = B.comma, O = B.precision, b = B.trim, P = B.type;
    P === "n" ? (S = !0, P = "g") : Qw[P] || (O === void 0 && (O = 12), b = !0, P = "g"), (F || p === "0" && v === "=") && (F = !0, p = "0", v = "=");
    var R = C === "$" ? t : C === "#" && /[boxX]/.test(P) ? "0" + P.toLowerCase() : "", j = C === "$" ? n : /[%p]/.test(P) ? l : "", dA = Qw[P], fA = /[defgprs%]/.test(P);
    O = O === void 0 ? 6 : /[gprs]/.test(P) ? Math.max(1, Math.min(21, O)) : Math.max(0, Math.min(20, O));
    function mA(FA) {
      var NA = R, bA = j, z, QA, aA;
      if (P === "c")
        bA = dA(FA) + bA, FA = "";
      else {
        FA = +FA;
        var BA = FA < 0 || 1 / FA < 0;
        if (FA = isNaN(FA) ? c : dA(Math.abs(FA), O), b && (FA = qT(FA)), BA && +FA == 0 && o !== "+" && (BA = !1), NA = (BA ? o === "(" ? o : f : o === "-" || o === "(" ? "" : o) + NA, bA = (P === "s" ? Ew[8 + i0 / 3] : "") + bA + (BA && o === "(" ? ")" : ""), fA) {
          for (z = -1, QA = FA.length; ++z < QA; )
            if (aA = FA.charCodeAt(z), 48 > aA || aA > 57) {
              bA = (aA === 46 ? i + FA.slice(z + 1) : FA.slice(z)) + bA, FA = FA.slice(0, z);
              break;
            }
        }
      }
      S && !F && (FA = e(FA, 1 / 0));
      var HA = NA.length + FA.length + bA.length, SA = HA < U ? new Array(U - HA + 1).join(p) : "";
      switch (S && F && (FA = e(SA + FA, SA.length ? U - bA.length : 1 / 0), SA = ""), v) {
        case "<":
          FA = NA + FA + bA + SA;
          break;
        case "=":
          FA = NA + SA + FA + bA;
          break;
        case "^":
          FA = SA.slice(0, HA = SA.length >> 1) + NA + FA + bA + SA.slice(HA);
          break;
        default:
          FA = SA + NA + FA + bA;
          break;
      }
      return s(FA);
    }
    return mA.toString = function() {
      return B + "";
    }, mA;
  }
  function w(B, p) {
    var v = h((B = oc(B), B.type = "f", B)), o = Math.max(-8, Math.min(8, Math.floor(to(p) / 3))) * 3, C = Math.pow(10, -o), F = Ew[8 + o / 3];
    return function(U) {
      return v(C * U) + F;
    };
  }
  return {
    format: h,
    formatPrefix: w
  };
}
var rl, a0, o0;
jT({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function jT(A) {
  return rl = JT(A), a0 = rl.format, o0 = rl.formatPrefix, rl;
}
function YT(A) {
  return Math.max(0, -to(Math.abs(A)));
}
function ZT(A, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(to(e) / 3))) * 3 - to(Math.abs(A)));
}
function AD(A, e) {
  return A = Math.abs(A), e = Math.abs(e) - A, Math.max(0, to(e) - to(A)) + 1;
}
function eD(A, e) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(A);
      break;
    default:
      this.range(e).domain(A);
      break;
  }
  return this;
}
function tD(A) {
  return function() {
    return A;
  };
}
function nD(A) {
  return +A;
}
var bw = [0, 1];
function Va(A) {
  return A;
}
function td(A, e) {
  return (e -= A = +A) ? function(t) {
    return (t - A) / e;
  } : tD(isNaN(e) ? NaN : 0.5);
}
function rD(A, e) {
  var t;
  return A > e && (t = A, A = e, e = t), function(n) {
    return Math.max(A, Math.min(e, n));
  };
}
function iD(A, e, t) {
  var n = A[0], i = A[1], s = e[0], l = e[1];
  return i < n ? (n = td(i, n), s = t(l, s)) : (n = td(n, i), s = t(s, l)), function(f) {
    return s(n(f));
  };
}
function aD(A, e, t) {
  var n = Math.min(A.length, e.length) - 1, i = new Array(n), s = new Array(n), l = -1;
  for (A[n] < A[0] && (A = A.slice().reverse(), e = e.slice().reverse()); ++l < n; )
    i[l] = td(A[l], A[l + 1]), s[l] = t(e[l], e[l + 1]);
  return function(f) {
    var c = uH(A, f, 1, n) - 1;
    return s[c](i[c](f));
  };
}
function oD(A, e) {
  return e.domain(A.domain()).range(A.range()).interpolate(A.interpolate()).clamp(A.clamp()).unknown(A.unknown());
}
function sD() {
  var A = bw, e = bw, t = bp, n, i, s, l = Va, f, c, h;
  function w() {
    var p = Math.min(A.length, e.length);
    return l !== Va && (l = rD(A[0], A[p - 1])), f = p > 2 ? aD : iD, c = h = null, B;
  }
  function B(p) {
    return p == null || isNaN(p = +p) ? s : (c || (c = f(A.map(n), e, t)))(n(l(p)));
  }
  return B.invert = function(p) {
    return l(i((h || (h = f(e, A.map(n), Gn)))(p)));
  }, B.domain = function(p) {
    return arguments.length ? (A = Array.from(p, nD), w()) : A.slice();
  }, B.range = function(p) {
    return arguments.length ? (e = Array.from(p), w()) : e.slice();
  }, B.rangeRound = function(p) {
    return e = Array.from(p), t = FL, w();
  }, B.clamp = function(p) {
    return arguments.length ? (l = p ? !0 : Va, w()) : l !== Va;
  }, B.interpolate = function(p) {
    return arguments.length ? (t = p, w()) : t;
  }, B.unknown = function(p) {
    return arguments.length ? (s = p, B) : s;
  }, function(p, v) {
    return n = p, i = v, w();
  };
}
function uD() {
  return sD()(Va, Va);
}
function lD(A, e, t, n) {
  var i = dH(A, e, t), s;
  switch (n = oc(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(A), Math.abs(e));
      return n.precision == null && !isNaN(s = ZT(i, l)) && (n.precision = s), o0(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(s = AD(i, Math.max(Math.abs(A), Math.abs(e)))) && (n.precision = s - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(s = YT(i)) && (n.precision = s - (n.type === "%") * 2);
      break;
    }
  }
  return a0(n);
}
function cD(A) {
  var e = A.domain;
  return A.ticks = function(t) {
    var n = e();
    return hH(n[0], n[n.length - 1], t ?? 10);
  }, A.tickFormat = function(t, n) {
    var i = e();
    return lD(i[0], i[i.length - 1], t ?? 10, n);
  }, A.nice = function(t) {
    t == null && (t = 10);
    var n = e(), i = 0, s = n.length - 1, l = n[i], f = n[s], c, h, w = 10;
    for (f < l && (h = l, l = f, f = h, h = i, i = s, s = h); w-- > 0; ) {
      if (h = Wh(l, f, t), h === c)
        return n[i] = l, n[s] = f, e(n);
      if (h > 0)
        l = Math.floor(l / h) * h, f = Math.ceil(f / h) * h;
      else if (h < 0)
        l = Math.ceil(l * h) / h, f = Math.floor(f * h) / h;
      else
        break;
      c = h;
    }
    return A;
  }, A;
}
function oa() {
  var A = uD();
  return A.copy = function() {
    return oD(A, oa());
  }, eD.apply(A, arguments), cD(A);
}
const il = (A) => () => A;
function fD(A, {
  sourceEvent: e,
  target: t,
  transform: n,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: A, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: t, enumerable: !0, configurable: !0 },
    transform: { value: n, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function Pr(A, e, t) {
  this.k = A, this.x = e, this.y = t;
}
Pr.prototype = {
  constructor: Pr,
  scale: function(A) {
    return A === 1 ? this : new Pr(this.k * A, this.x, this.y);
  },
  translate: function(A, e) {
    return A === 0 & e === 0 ? this : new Pr(this.k, this.x + this.k * A, this.y + this.k * e);
  },
  apply: function(A) {
    return [A[0] * this.k + this.x, A[1] * this.k + this.y];
  },
  applyX: function(A) {
    return A * this.k + this.x;
  },
  applyY: function(A) {
    return A * this.k + this.y;
  },
  invert: function(A) {
    return [(A[0] - this.x) / this.k, (A[1] - this.y) / this.k];
  },
  invertX: function(A) {
    return (A - this.x) / this.k;
  },
  invertY: function(A) {
    return (A - this.y) / this.k;
  },
  rescaleX: function(A) {
    return A.copy().domain(A.range().map(this.invertX, this).map(A.invert, A));
  },
  rescaleY: function(A) {
    return A.copy().domain(A.range().map(this.invertY, this).map(A.invert, A));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var Sp = new Pr(1, 0, 0);
Ra.prototype = Pr.prototype;
function Ra(A) {
  for (; !A.__zoom; ) if (!(A = A.parentNode)) return Sp;
  return A.__zoom;
}
function lh(A) {
  A.stopImmediatePropagation();
}
function Xo(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function hD(A) {
  return (!A.ctrlKey || A.type === "wheel") && !A.button;
}
function dD() {
  var A = this;
  return A instanceof SVGElement ? (A = A.ownerSVGElement || A, A.hasAttribute("viewBox") ? (A = A.viewBox.baseVal, [[A.x, A.y], [A.x + A.width, A.y + A.height]]) : [[0, 0], [A.width.baseVal.value, A.height.baseVal.value]]) : [[0, 0], [A.clientWidth, A.clientHeight]];
}
function _w() {
  return this.__zoom || Sp;
}
function pD(A) {
  return -A.deltaY * (A.deltaMode === 1 ? 0.05 : A.deltaMode ? 1 : 2e-3) * (A.ctrlKey ? 10 : 1);
}
function gD() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function BD(A, e, t) {
  var n = A.invertX(e[0][0]) - t[0][0], i = A.invertX(e[1][0]) - t[1][0], s = A.invertY(e[0][1]) - t[0][1], l = A.invertY(e[1][1]) - t[1][1];
  return A.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    l > s ? (s + l) / 2 : Math.min(0, s) || Math.max(0, l)
  );
}
function wD() {
  var A = hD, e = dD, t = BD, n = pD, i = gD, s = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], f = 250, c = SL, h = _c("start", "zoom", "end"), w, B, p, v = 500, o = 150, C = 0, F = 10;
  function U(z) {
    z.property("__zoom", _w).on("wheel.zoom", dA, { passive: !1 }).on("mousedown.zoom", fA).on("dblclick.zoom", mA).filter(i).on("touchstart.zoom", FA).on("touchmove.zoom", NA).on("touchend.zoom touchcancel.zoom", bA).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  U.transform = function(z, QA, aA, BA) {
    var HA = z.selection ? z.selection() : z;
    HA.property("__zoom", _w), z !== HA ? P(z, QA, aA, BA) : HA.interrupt().each(function() {
      R(this, arguments).event(BA).start().zoom(null, typeof QA == "function" ? QA.apply(this, arguments) : QA).end();
    });
  }, U.scaleBy = function(z, QA, aA, BA) {
    U.scaleTo(z, function() {
      var HA = this.__zoom.k, SA = typeof QA == "function" ? QA.apply(this, arguments) : QA;
      return HA * SA;
    }, aA, BA);
  }, U.scaleTo = function(z, QA, aA, BA) {
    U.transform(z, function() {
      var HA = e.apply(this, arguments), SA = this.__zoom, lA = aA == null ? b(HA) : typeof aA == "function" ? aA.apply(this, arguments) : aA, D = SA.invert(lA), iA = typeof QA == "function" ? QA.apply(this, arguments) : QA;
      return t(O(S(SA, iA), lA, D), HA, l);
    }, aA, BA);
  }, U.translateBy = function(z, QA, aA, BA) {
    U.transform(z, function() {
      return t(this.__zoom.translate(
        typeof QA == "function" ? QA.apply(this, arguments) : QA,
        typeof aA == "function" ? aA.apply(this, arguments) : aA
      ), e.apply(this, arguments), l);
    }, null, BA);
  }, U.translateTo = function(z, QA, aA, BA, HA) {
    U.transform(z, function() {
      var SA = e.apply(this, arguments), lA = this.__zoom, D = BA == null ? b(SA) : typeof BA == "function" ? BA.apply(this, arguments) : BA;
      return t(Sp.translate(D[0], D[1]).scale(lA.k).translate(
        typeof QA == "function" ? -QA.apply(this, arguments) : -QA,
        typeof aA == "function" ? -aA.apply(this, arguments) : -aA
      ), SA, l);
    }, BA, HA);
  };
  function S(z, QA) {
    return QA = Math.max(s[0], Math.min(s[1], QA)), QA === z.k ? z : new Pr(QA, z.x, z.y);
  }
  function O(z, QA, aA) {
    var BA = QA[0] - aA[0] * z.k, HA = QA[1] - aA[1] * z.k;
    return BA === z.x && HA === z.y ? z : new Pr(z.k, BA, HA);
  }
  function b(z) {
    return [(+z[0][0] + +z[1][0]) / 2, (+z[0][1] + +z[1][1]) / 2];
  }
  function P(z, QA, aA, BA) {
    z.on("start.zoom", function() {
      R(this, arguments).event(BA).start();
    }).on("interrupt.zoom end.zoom", function() {
      R(this, arguments).event(BA).end();
    }).tween("zoom", function() {
      var HA = this, SA = arguments, lA = R(HA, SA).event(BA), D = e.apply(HA, SA), iA = aA == null ? b(D) : typeof aA == "function" ? aA.apply(HA, SA) : aA, Y = Math.max(D[1][0] - D[0][0], D[1][1] - D[0][1]), L = HA.__zoom, k = typeof QA == "function" ? QA.apply(HA, SA) : QA, oA = c(L.invert(iA).concat(Y / L.k), k.invert(iA).concat(Y / k.k));
      return function(_A) {
        if (_A === 1) _A = k;
        else {
          var IA = oA(_A), JA = Y / IA[2];
          _A = new Pr(JA, iA[0] - IA[0] * JA, iA[1] - IA[1] * JA);
        }
        lA.zoom(null, _A);
      };
    });
  }
  function R(z, QA, aA) {
    return !aA && z.__zooming || new j(z, QA);
  }
  function j(z, QA) {
    this.that = z, this.args = QA, this.active = 0, this.sourceEvent = null, this.extent = e.apply(z, QA), this.taps = 0;
  }
  j.prototype = {
    event: function(z) {
      return z && (this.sourceEvent = z), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(z, QA) {
      return this.mouse && z !== "mouse" && (this.mouse[1] = QA.invert(this.mouse[0])), this.touch0 && z !== "touch" && (this.touch0[1] = QA.invert(this.touch0[0])), this.touch1 && z !== "touch" && (this.touch1[1] = QA.invert(this.touch1[0])), this.that.__zoom = QA, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(z) {
      var QA = XA(this.that).datum();
      h.call(
        z,
        this.that,
        new fD(z, {
          sourceEvent: this.sourceEvent,
          target: U,
          type: z,
          transform: this.that.__zoom,
          dispatch: h
        }),
        QA
      );
    }
  };
  function dA(z, ...QA) {
    if (!A.apply(this, arguments)) return;
    var aA = R(this, QA).event(z), BA = this.__zoom, HA = Math.max(s[0], Math.min(s[1], BA.k * Math.pow(2, n.apply(this, arguments)))), SA = $n(z);
    if (aA.wheel)
      (aA.mouse[0][0] !== SA[0] || aA.mouse[0][1] !== SA[1]) && (aA.mouse[1] = BA.invert(aA.mouse[0] = SA)), clearTimeout(aA.wheel);
    else {
      if (BA.k === HA) return;
      aA.mouse = [SA, BA.invert(SA)], Rl(this), aA.start();
    }
    Xo(z), aA.wheel = setTimeout(lA, o), aA.zoom("mouse", t(O(S(BA, HA), aA.mouse[0], aA.mouse[1]), aA.extent, l));
    function lA() {
      aA.wheel = null, aA.end();
    }
  }
  function fA(z, ...QA) {
    if (p || !A.apply(this, arguments)) return;
    var aA = z.currentTarget, BA = R(this, QA, !0).event(z), HA = XA(z.view).on("mousemove.zoom", iA, !0).on("mouseup.zoom", Y, !0), SA = $n(z, aA), lA = z.clientX, D = z.clientY;
    Gv(z.view), lh(z), BA.mouse = [SA, this.__zoom.invert(SA)], Rl(this), BA.start();
    function iA(L) {
      if (Xo(L), !BA.moved) {
        var k = L.clientX - lA, oA = L.clientY - D;
        BA.moved = k * k + oA * oA > C;
      }
      BA.event(L).zoom("mouse", t(O(BA.that.__zoom, BA.mouse[0] = $n(L, aA), BA.mouse[1]), BA.extent, l));
    }
    function Y(L) {
      HA.on("mousemove.zoom mouseup.zoom", null), Vv(L.view, BA.moved), Xo(L), BA.event(L).end();
    }
  }
  function mA(z, ...QA) {
    if (A.apply(this, arguments)) {
      var aA = this.__zoom, BA = $n(z.changedTouches ? z.changedTouches[0] : z, this), HA = aA.invert(BA), SA = aA.k * (z.shiftKey ? 0.5 : 2), lA = t(O(S(aA, SA), BA, HA), e.apply(this, QA), l);
      Xo(z), f > 0 ? XA(this).transition().duration(f).call(P, lA, BA, z) : XA(this).call(U.transform, lA, BA, z);
    }
  }
  function FA(z, ...QA) {
    if (A.apply(this, arguments)) {
      var aA = z.touches, BA = aA.length, HA = R(this, QA, z.changedTouches.length === BA).event(z), SA, lA, D, iA;
      for (lh(z), lA = 0; lA < BA; ++lA)
        D = aA[lA], iA = $n(D, this), iA = [iA, this.__zoom.invert(iA), D.identifier], HA.touch0 ? !HA.touch1 && HA.touch0[2] !== iA[2] && (HA.touch1 = iA, HA.taps = 0) : (HA.touch0 = iA, SA = !0, HA.taps = 1 + !!w);
      w && (w = clearTimeout(w)), SA && (HA.taps < 2 && (B = iA[0], w = setTimeout(function() {
        w = null;
      }, v)), Rl(this), HA.start());
    }
  }
  function NA(z, ...QA) {
    if (this.__zooming) {
      var aA = R(this, QA).event(z), BA = z.changedTouches, HA = BA.length, SA, lA, D, iA;
      for (Xo(z), SA = 0; SA < HA; ++SA)
        lA = BA[SA], D = $n(lA, this), aA.touch0 && aA.touch0[2] === lA.identifier ? aA.touch0[0] = D : aA.touch1 && aA.touch1[2] === lA.identifier && (aA.touch1[0] = D);
      if (lA = aA.that.__zoom, aA.touch1) {
        var Y = aA.touch0[0], L = aA.touch0[1], k = aA.touch1[0], oA = aA.touch1[1], _A = (_A = k[0] - Y[0]) * _A + (_A = k[1] - Y[1]) * _A, IA = (IA = oA[0] - L[0]) * IA + (IA = oA[1] - L[1]) * IA;
        lA = S(lA, Math.sqrt(_A / IA)), D = [(Y[0] + k[0]) / 2, (Y[1] + k[1]) / 2], iA = [(L[0] + oA[0]) / 2, (L[1] + oA[1]) / 2];
      } else if (aA.touch0) D = aA.touch0[0], iA = aA.touch0[1];
      else return;
      aA.zoom("touch", t(O(lA, D, iA), aA.extent, l));
    }
  }
  function bA(z, ...QA) {
    if (this.__zooming) {
      var aA = R(this, QA).event(z), BA = z.changedTouches, HA = BA.length, SA, lA;
      for (lh(z), p && clearTimeout(p), p = setTimeout(function() {
        p = null;
      }, v), SA = 0; SA < HA; ++SA)
        lA = BA[SA], aA.touch0 && aA.touch0[2] === lA.identifier ? delete aA.touch0 : aA.touch1 && aA.touch1[2] === lA.identifier && delete aA.touch1;
      if (aA.touch1 && !aA.touch0 && (aA.touch0 = aA.touch1, delete aA.touch1), aA.touch0) aA.touch0[1] = this.__zoom.invert(aA.touch0[0]);
      else if (aA.end(), aA.taps === 2 && (lA = $n(lA, this), Math.hypot(B[0] - lA[0], B[1] - lA[1]) < F)) {
        var D = XA(this).on("dblclick.zoom");
        D && D.apply(this, arguments);
      }
    }
  }
  return U.wheelDelta = function(z) {
    return arguments.length ? (n = typeof z == "function" ? z : il(+z), U) : n;
  }, U.filter = function(z) {
    return arguments.length ? (A = typeof z == "function" ? z : il(!!z), U) : A;
  }, U.touchable = function(z) {
    return arguments.length ? (i = typeof z == "function" ? z : il(!!z), U) : i;
  }, U.extent = function(z) {
    return arguments.length ? (e = typeof z == "function" ? z : il([[+z[0][0], +z[0][1]], [+z[1][0], +z[1][1]]]), U) : e;
  }, U.scaleExtent = function(z) {
    return arguments.length ? (s[0] = +z[0], s[1] = +z[1], U) : [s[0], s[1]];
  }, U.translateExtent = function(z) {
    return arguments.length ? (l[0][0] = +z[0][0], l[1][0] = +z[1][0], l[0][1] = +z[0][1], l[1][1] = +z[1][1], U) : [[l[0][0], l[0][1]], [l[1][0], l[1][1]]];
  }, U.constrain = function(z) {
    return arguments.length ? (t = z, U) : t;
  }, U.duration = function(z) {
    return arguments.length ? (f = +z, U) : f;
  }, U.interpolate = function(z) {
    return arguments.length ? (c = z, U) : c;
  }, U.on = function() {
    var z = h.on.apply(h, arguments);
    return z === h ? U : z;
  }, U.clickDistance = function(z) {
    return arguments.length ? (C = (z = +z) * z, U) : Math.sqrt(C);
  }, U.tapDistance = function(z) {
    return arguments.length ? (F = +z, U) : F;
  }, U;
}
var s0 = { exports: {} };
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
(function(A) {
  (function(e, t) {
    A.exports = e.document ? t(e, !0) : function(n) {
      if (!n.document)
        throw new Error("jQuery requires a window with a document");
      return t(n);
    };
  })(typeof window < "u" ? window : Wi, function(e, t) {
    var n = [], i = e.document, s = n.slice, l = n.concat, f = n.push, c = n.indexOf, h = {}, w = h.toString, B = h.hasOwnProperty, p = {}, v = "1.12.4", o = function(u, d) {
      return new o.fn.init(u, d);
    }, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, F = /^-ms-/, U = /-([\da-z])/gi, S = function(u, d) {
      return d.toUpperCase();
    };
    o.fn = o.prototype = {
      // The current version of jQuery being used
      jquery: v,
      constructor: o,
      // Start with an empty selector
      selector: "",
      // The default length of a jQuery object is 0
      length: 0,
      toArray: function() {
        return s.call(this);
      },
      // Get the Nth element in the matched element set OR
      // Get the whole matched element set as a clean array
      get: function(u) {
        return u != null ? (
          // Return just the one element from the set
          u < 0 ? this[u + this.length] : this[u]
        ) : (
          // Return all the elements in a clean array
          s.call(this)
        );
      },
      // Take an array of elements and push it onto the stack
      // (returning the new matched element set)
      pushStack: function(u) {
        var d = o.merge(this.constructor(), u);
        return d.prevObject = this, d.context = this.context, d;
      },
      // Execute a callback for every element in the matched set.
      each: function(u) {
        return o.each(this, u);
      },
      map: function(u) {
        return this.pushStack(o.map(this, function(d, m) {
          return u.call(d, m, d);
        }));
      },
      slice: function() {
        return this.pushStack(s.apply(this, arguments));
      },
      first: function() {
        return this.eq(0);
      },
      last: function() {
        return this.eq(-1);
      },
      eq: function(u) {
        var d = this.length, m = +u + (u < 0 ? d : 0);
        return this.pushStack(m >= 0 && m < d ? [this[m]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      // For internal use only.
      // Behaves like an Array's method, not like a jQuery method.
      push: f,
      sort: n.sort,
      splice: n.splice
    }, o.extend = o.fn.extend = function() {
      var u, d, m, y, E, x, H = arguments[0] || {}, K = 1, J = arguments.length, Z = !1;
      for (typeof H == "boolean" && (Z = H, H = arguments[K] || {}, K++), typeof H != "object" && !o.isFunction(H) && (H = {}), K === J && (H = this, K--); K < J; K++)
        if ((E = arguments[K]) != null)
          for (y in E)
            u = H[y], m = E[y], H !== m && (Z && m && (o.isPlainObject(m) || (d = o.isArray(m))) ? (d ? (d = !1, x = u && o.isArray(u) ? u : []) : x = u && o.isPlainObject(u) ? u : {}, H[y] = o.extend(Z, x, m)) : m !== void 0 && (H[y] = m));
      return H;
    }, o.extend({
      // Unique for each copy of jQuery on the page
      expando: "jQuery" + (v + Math.random()).replace(/\D/g, ""),
      // Assume jQuery is ready without the ready module
      isReady: !0,
      error: function(u) {
        throw new Error(u);
      },
      noop: function() {
      },
      // See test/unit/core.js for details concerning isFunction.
      // Since version 1.3, DOM methods and functions like alert
      // aren't supported. They return false on IE (#2968).
      isFunction: function(u) {
        return o.type(u) === "function";
      },
      isArray: Array.isArray || function(u) {
        return o.type(u) === "array";
      },
      isWindow: function(u) {
        return u != null && u == u.window;
      },
      isNumeric: function(u) {
        var d = u && u.toString();
        return !o.isArray(u) && d - parseFloat(d) + 1 >= 0;
      },
      isEmptyObject: function(u) {
        var d;
        for (d in u)
          return !1;
        return !0;
      },
      isPlainObject: function(u) {
        var d;
        if (!u || o.type(u) !== "object" || u.nodeType || o.isWindow(u))
          return !1;
        try {
          if (u.constructor && !B.call(u, "constructor") && !B.call(u.constructor.prototype, "isPrototypeOf"))
            return !1;
        } catch {
          return !1;
        }
        if (!p.ownFirst)
          for (d in u)
            return B.call(u, d);
        for (d in u)
          ;
        return d === void 0 || B.call(u, d);
      },
      type: function(u) {
        return u == null ? u + "" : typeof u == "object" || typeof u == "function" ? h[w.call(u)] || "object" : typeof u;
      },
      // Workarounds based on findings by Jim Driscoll
      // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
      globalEval: function(u) {
        u && o.trim(u) && (e.execScript || function(d) {
          e.eval.call(e, d);
        })(u);
      },
      // Convert dashed to camelCase; used by the css and data modules
      // Microsoft forgot to hump their vendor prefix (#9572)
      camelCase: function(u) {
        return u.replace(F, "ms-").replace(U, S);
      },
      nodeName: function(u, d) {
        return u.nodeName && u.nodeName.toLowerCase() === d.toLowerCase();
      },
      each: function(u, d) {
        var m, y = 0;
        if (O(u))
          for (m = u.length; y < m && d.call(u[y], y, u[y]) !== !1; y++)
            ;
        else
          for (y in u)
            if (d.call(u[y], y, u[y]) === !1)
              break;
        return u;
      },
      // Support: Android<4.1, IE<9
      trim: function(u) {
        return u == null ? "" : (u + "").replace(C, "");
      },
      // results is for internal usage only
      makeArray: function(u, d) {
        var m = d || [];
        return u != null && (O(Object(u)) ? o.merge(
          m,
          typeof u == "string" ? [u] : u
        ) : f.call(m, u)), m;
      },
      inArray: function(u, d, m) {
        var y;
        if (d) {
          if (c)
            return c.call(d, u, m);
          for (y = d.length, m = m ? m < 0 ? Math.max(0, y + m) : m : 0; m < y; m++)
            if (m in d && d[m] === u)
              return m;
        }
        return -1;
      },
      merge: function(u, d) {
        for (var m = +d.length, y = 0, E = u.length; y < m; )
          u[E++] = d[y++];
        if (m !== m)
          for (; d[y] !== void 0; )
            u[E++] = d[y++];
        return u.length = E, u;
      },
      grep: function(u, d, m) {
        for (var y, E = [], x = 0, H = u.length, K = !m; x < H; x++)
          y = !d(u[x], x), y !== K && E.push(u[x]);
        return E;
      },
      // arg is for internal usage only
      map: function(u, d, m) {
        var y, E, x = 0, H = [];
        if (O(u))
          for (y = u.length; x < y; x++)
            E = d(u[x], x, m), E != null && H.push(E);
        else
          for (x in u)
            E = d(u[x], x, m), E != null && H.push(E);
        return l.apply([], H);
      },
      // A global GUID counter for objects
      guid: 1,
      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function(u, d) {
        var m, y, E;
        if (typeof d == "string" && (E = u[d], d = u, u = E), !!o.isFunction(u))
          return m = s.call(arguments, 2), y = function() {
            return u.apply(d || this, m.concat(s.call(arguments)));
          }, y.guid = u.guid = u.guid || o.guid++, y;
      },
      now: function() {
        return +/* @__PURE__ */ new Date();
      },
      // jQuery.support is not used in Core but other projects attach their
      // properties to it so it needs to exist.
      support: p
    }), typeof Symbol == "function" && (o.fn[Symbol.iterator] = n[Symbol.iterator]), o.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
      function(u, d) {
        h["[object " + d + "]"] = d.toLowerCase();
      }
    );
    function O(u) {
      var d = !!u && "length" in u && u.length, m = o.type(u);
      return m === "function" || o.isWindow(u) ? !1 : m === "array" || d === 0 || typeof d == "number" && d > 0 && d - 1 in u;
    }
    var b = (
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
      function(u) {
        var d, m, y, E, x, H, K, J, Z, rA, UA, TA, EA, ie, Ae, se, ht, ze, jn, $A = "sizzle" + 1 * /* @__PURE__ */ new Date(), ut = u.document, le = 0, Xe = 0, In = eA(), va = eA(), xt = eA(), Hn = function(M, V) {
          return M === V && (UA = !0), 0;
        }, Yn = 1 << 31, Sn = {}.hasOwnProperty, Re = [], It = Re.pop, Si = Re.push, Ln = Re.push, Eo = Re.slice, vr = function(M, V) {
          for (var AA = 0, pA = M.length; AA < pA; AA++)
            if (M[AA] === V)
              return AA;
          return -1;
        }, bo = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", Oe = "[\\x20\\t\\r\\n\\f]", yr = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", Bu = "\\[" + Oe + "*(" + yr + ")(?:" + Oe + // Operator (capture 2)
        "*([*^$|!~]?=)" + Oe + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + yr + "))|)" + Oe + "*\\]", Zn = ":(" + yr + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Bu + ")*)|.*)\\)|)", rf = new RegExp(Oe + "+", "g"), ya = new RegExp("^" + Oe + "+|((?:^|[^\\\\])(?:\\\\.)*)" + Oe + "+$", "g"), _o = new RegExp("^" + Oe + "*," + Oe + "*"), wu = new RegExp("^" + Oe + "*([>+~]|" + Oe + ")" + Oe + "*"), Ar = new RegExp("=" + Oe + `*([^\\]'"]*?)` + Oe + "*\\]", "g"), Ca = new RegExp(Zn), mu = new RegExp("^" + yr + "$"), Qa = {
          ID: new RegExp("^#(" + yr + ")"),
          CLASS: new RegExp("^\\.(" + yr + ")"),
          TAG: new RegExp("^(" + yr + "|[*])"),
          ATTR: new RegExp("^" + Bu),
          PSEUDO: new RegExp("^" + Zn),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + Oe + "*(even|odd|(([+-]|)(\\d*)n|)" + Oe + "*(?:([+-]|)" + Oe + "*(\\d+)|))" + Oe + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + bo + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + Oe + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + Oe + "*((?:-\\d)?\\d*)" + Oe + "*\\)|)(?=[^-]|$)", "i")
        }, af = /^(?:input|select|textarea|button)$/i, ei = /^h\d$/i, wt = /^[^{]+\{\s*\[native \w/, vu = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, xo = /[+~]/, of = /'|\\/g, Tn = new RegExp("\\\\([\\da-f]{1,6}" + Oe + "?|(" + Oe + ")|.)", "ig"), Dn = function(M, V, AA) {
          var pA = "0x" + V - 65536;
          return pA !== pA || AA ? V : pA < 0 ? (
            // BMP codepoint
            String.fromCharCode(pA + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(pA >> 10 | 55296, pA & 1023 | 56320)
          );
        }, yu = function() {
          TA();
        };
        try {
          Ln.apply(
            Re = Eo.call(ut.childNodes),
            ut.childNodes
          ), Re[ut.childNodes.length].nodeType;
        } catch {
          Ln = {
            apply: Re.length ? (
              // Leverage slice if possible
              function(V, AA) {
                Si.apply(V, Eo.call(AA));
              }
            ) : (
              // Support: IE<9
              // Otherwise append directly
              function(V, AA) {
                for (var pA = V.length, sA = 0; V[pA++] = AA[sA++]; )
                  ;
                V.length = pA - 1;
              }
            )
          };
        }
        function Ie(M, V, AA, pA) {
          var sA, CA, wA, LA, VA, re, WA, ee, pe = V && V.ownerDocument, Le = V ? V.nodeType : 9;
          if (AA = AA || [], typeof M != "string" || !M || Le !== 1 && Le !== 9 && Le !== 11)
            return AA;
          if (!pA && ((V ? V.ownerDocument || V : ut) !== EA && TA(V), V = V || EA, Ae)) {
            if (Le !== 11 && (re = vu.exec(M)))
              if (sA = re[1]) {
                if (Le === 9)
                  if (wA = V.getElementById(sA)) {
                    if (wA.id === sA)
                      return AA.push(wA), AA;
                  } else
                    return AA;
                else if (pe && (wA = pe.getElementById(sA)) && jn(V, wA) && wA.id === sA)
                  return AA.push(wA), AA;
              } else {
                if (re[2])
                  return Ln.apply(AA, V.getElementsByTagName(M)), AA;
                if ((sA = re[3]) && m.getElementsByClassName && V.getElementsByClassName)
                  return Ln.apply(AA, V.getElementsByClassName(sA)), AA;
              }
            if (m.qsa && !xt[M + " "] && (!se || !se.test(M))) {
              if (Le !== 1)
                pe = V, ee = M;
              else if (V.nodeName.toLowerCase() !== "object") {
                for ((LA = V.getAttribute("id")) ? LA = LA.replace(of, "\\$&") : V.setAttribute("id", LA = $A), WA = H(M), CA = WA.length, VA = mu.test(LA) ? "#" + LA : "[id='" + LA + "']"; CA--; )
                  WA[CA] = VA + " " + mt(WA[CA]);
                ee = WA.join(","), pe = xo.test(M) && Li(V.parentNode) || V;
              }
              if (ee)
                try {
                  return Ln.apply(
                    AA,
                    pe.querySelectorAll(ee)
                  ), AA;
                } catch {
                } finally {
                  LA === $A && V.removeAttribute("id");
                }
            }
          }
          return J(M.replace(ya, "$1"), V, AA, pA);
        }
        function eA() {
          var M = [];
          function V(AA, pA) {
            return M.push(AA + " ") > y.cacheLength && delete V[M.shift()], V[AA + " "] = pA;
          }
          return V;
        }
        function hA(M) {
          return M[$A] = !0, M;
        }
        function uA(M) {
          var V = EA.createElement("div");
          try {
            return !!M(V);
          } catch {
            return !1;
          } finally {
            V.parentNode && V.parentNode.removeChild(V), V = null;
          }
        }
        function KA(M, V) {
          for (var AA = M.split("|"), pA = AA.length; pA--; )
            y.attrHandle[AA[pA]] = V;
        }
        function ae(M, V) {
          var AA = V && M, pA = AA && M.nodeType === 1 && V.nodeType === 1 && (~V.sourceIndex || Yn) - (~M.sourceIndex || Yn);
          if (pA)
            return pA;
          if (AA) {
            for (; AA = AA.nextSibling; )
              if (AA === V)
                return -1;
          }
          return M ? 1 : -1;
        }
        function He(M) {
          return function(V) {
            var AA = V.nodeName.toLowerCase();
            return AA === "input" && V.type === M;
          };
        }
        function At(M) {
          return function(V) {
            var AA = V.nodeName.toLowerCase();
            return (AA === "input" || AA === "button") && V.type === M;
          };
        }
        function be(M) {
          return hA(function(V) {
            return V = +V, hA(function(AA, pA) {
              for (var sA, CA = M([], AA.length, V), wA = CA.length; wA--; )
                AA[sA = CA[wA]] && (AA[sA] = !(pA[sA] = AA[sA]));
            });
          });
        }
        function Li(M) {
          return M && typeof M.getElementsByTagName < "u" && M;
        }
        m = Ie.support = {}, x = Ie.isXML = function(M) {
          var V = M && (M.ownerDocument || M).documentElement;
          return V ? V.nodeName !== "HTML" : !1;
        }, TA = Ie.setDocument = function(M) {
          var V, AA, pA = M ? M.ownerDocument || M : ut;
          return pA === EA || pA.nodeType !== 9 || !pA.documentElement || (EA = pA, ie = EA.documentElement, Ae = !x(EA), (AA = EA.defaultView) && AA.top !== AA && (AA.addEventListener ? AA.addEventListener("unload", yu, !1) : AA.attachEvent && AA.attachEvent("onunload", yu)), m.attributes = uA(function(sA) {
            return sA.className = "i", !sA.getAttribute("className");
          }), m.getElementsByTagName = uA(function(sA) {
            return sA.appendChild(EA.createComment("")), !sA.getElementsByTagName("*").length;
          }), m.getElementsByClassName = wt.test(EA.getElementsByClassName), m.getById = uA(function(sA) {
            return ie.appendChild(sA).id = $A, !EA.getElementsByName || !EA.getElementsByName($A).length;
          }), m.getById ? (y.find.ID = function(sA, CA) {
            if (typeof CA.getElementById < "u" && Ae) {
              var wA = CA.getElementById(sA);
              return wA ? [wA] : [];
            }
          }, y.filter.ID = function(sA) {
            var CA = sA.replace(Tn, Dn);
            return function(wA) {
              return wA.getAttribute("id") === CA;
            };
          }) : (delete y.find.ID, y.filter.ID = function(sA) {
            var CA = sA.replace(Tn, Dn);
            return function(wA) {
              var LA = typeof wA.getAttributeNode < "u" && wA.getAttributeNode("id");
              return LA && LA.value === CA;
            };
          }), y.find.TAG = m.getElementsByTagName ? function(sA, CA) {
            if (typeof CA.getElementsByTagName < "u")
              return CA.getElementsByTagName(sA);
            if (m.qsa)
              return CA.querySelectorAll(sA);
          } : function(sA, CA) {
            var wA, LA = [], VA = 0, re = CA.getElementsByTagName(sA);
            if (sA === "*") {
              for (; wA = re[VA++]; )
                wA.nodeType === 1 && LA.push(wA);
              return LA;
            }
            return re;
          }, y.find.CLASS = m.getElementsByClassName && function(sA, CA) {
            if (typeof CA.getElementsByClassName < "u" && Ae)
              return CA.getElementsByClassName(sA);
          }, ht = [], se = [], (m.qsa = wt.test(EA.querySelectorAll)) && (uA(function(sA) {
            ie.appendChild(sA).innerHTML = "<a id='" + $A + "'></a><select id='" + $A + "-\r\\' msallowcapture=''><option selected=''></option></select>", sA.querySelectorAll("[msallowcapture^='']").length && se.push("[*^$]=" + Oe + `*(?:''|"")`), sA.querySelectorAll("[selected]").length || se.push("\\[" + Oe + "*(?:value|" + bo + ")"), sA.querySelectorAll("[id~=" + $A + "-]").length || se.push("~="), sA.querySelectorAll(":checked").length || se.push(":checked"), sA.querySelectorAll("a#" + $A + "+*").length || se.push(".#.+[+~]");
          }), uA(function(sA) {
            var CA = EA.createElement("input");
            CA.setAttribute("type", "hidden"), sA.appendChild(CA).setAttribute("name", "D"), sA.querySelectorAll("[name=d]").length && se.push("name" + Oe + "*[*^$|!~]?="), sA.querySelectorAll(":enabled").length || se.push(":enabled", ":disabled"), sA.querySelectorAll("*,:x"), se.push(",.*:");
          })), (m.matchesSelector = wt.test(ze = ie.matches || ie.webkitMatchesSelector || ie.mozMatchesSelector || ie.oMatchesSelector || ie.msMatchesSelector)) && uA(function(sA) {
            m.disconnectedMatch = ze.call(sA, "div"), ze.call(sA, "[s!='']:x"), ht.push("!=", Zn);
          }), se = se.length && new RegExp(se.join("|")), ht = ht.length && new RegExp(ht.join("|")), V = wt.test(ie.compareDocumentPosition), jn = V || wt.test(ie.contains) ? function(sA, CA) {
            var wA = sA.nodeType === 9 ? sA.documentElement : sA, LA = CA && CA.parentNode;
            return sA === LA || !!(LA && LA.nodeType === 1 && (wA.contains ? wA.contains(LA) : sA.compareDocumentPosition && sA.compareDocumentPosition(LA) & 16));
          } : function(sA, CA) {
            if (CA) {
              for (; CA = CA.parentNode; )
                if (CA === sA)
                  return !0;
            }
            return !1;
          }, Hn = V ? function(sA, CA) {
            if (sA === CA)
              return UA = !0, 0;
            var wA = !sA.compareDocumentPosition - !CA.compareDocumentPosition;
            return wA || (wA = (sA.ownerDocument || sA) === (CA.ownerDocument || CA) ? sA.compareDocumentPosition(CA) : (
              // Otherwise we know they are disconnected
              1
            ), wA & 1 || !m.sortDetached && CA.compareDocumentPosition(sA) === wA ? sA === EA || sA.ownerDocument === ut && jn(ut, sA) ? -1 : CA === EA || CA.ownerDocument === ut && jn(ut, CA) ? 1 : rA ? vr(rA, sA) - vr(rA, CA) : 0 : wA & 4 ? -1 : 1);
          } : function(sA, CA) {
            if (sA === CA)
              return UA = !0, 0;
            var wA, LA = 0, VA = sA.parentNode, re = CA.parentNode, WA = [sA], ee = [CA];
            if (!VA || !re)
              return sA === EA ? -1 : CA === EA ? 1 : VA ? -1 : re ? 1 : rA ? vr(rA, sA) - vr(rA, CA) : 0;
            if (VA === re)
              return ae(sA, CA);
            for (wA = sA; wA = wA.parentNode; )
              WA.unshift(wA);
            for (wA = CA; wA = wA.parentNode; )
              ee.unshift(wA);
            for (; WA[LA] === ee[LA]; )
              LA++;
            return LA ? (
              // Do a sibling check if the nodes have a common ancestor
              ae(WA[LA], ee[LA])
            ) : (
              // Otherwise nodes in our document sort first
              WA[LA] === ut ? -1 : ee[LA] === ut ? 1 : 0
            );
          }), EA;
        }, Ie.matches = function(M, V) {
          return Ie(M, null, null, V);
        }, Ie.matchesSelector = function(M, V) {
          if ((M.ownerDocument || M) !== EA && TA(M), V = V.replace(Ar, "='$1']"), m.matchesSelector && Ae && !xt[V + " "] && (!ht || !ht.test(V)) && (!se || !se.test(V)))
            try {
              var AA = ze.call(M, V);
              if (AA || m.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              M.document && M.document.nodeType !== 11)
                return AA;
            } catch {
            }
          return Ie(V, EA, null, [M]).length > 0;
        }, Ie.contains = function(M, V) {
          return (M.ownerDocument || M) !== EA && TA(M), jn(M, V);
        }, Ie.attr = function(M, V) {
          (M.ownerDocument || M) !== EA && TA(M);
          var AA = y.attrHandle[V.toLowerCase()], pA = AA && Sn.call(y.attrHandle, V.toLowerCase()) ? AA(M, V, !Ae) : void 0;
          return pA !== void 0 ? pA : m.attributes || !Ae ? M.getAttribute(V) : (pA = M.getAttributeNode(V)) && pA.specified ? pA.value : null;
        }, Ie.error = function(M) {
          throw new Error("Syntax error, unrecognized expression: " + M);
        }, Ie.uniqueSort = function(M) {
          var V, AA = [], pA = 0, sA = 0;
          if (UA = !m.detectDuplicates, rA = !m.sortStable && M.slice(0), M.sort(Hn), UA) {
            for (; V = M[sA++]; )
              V === M[sA] && (pA = AA.push(sA));
            for (; pA--; )
              M.splice(AA[pA], 1);
          }
          return rA = null, M;
        }, E = Ie.getText = function(M) {
          var V, AA = "", pA = 0, sA = M.nodeType;
          if (sA) {
            if (sA === 1 || sA === 9 || sA === 11) {
              if (typeof M.textContent == "string")
                return M.textContent;
              for (M = M.firstChild; M; M = M.nextSibling)
                AA += E(M);
            } else if (sA === 3 || sA === 4)
              return M.nodeValue;
          } else for (; V = M[pA++]; )
            AA += E(V);
          return AA;
        }, y = Ie.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: hA,
          match: Qa,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(M) {
              return M[1] = M[1].replace(Tn, Dn), M[3] = (M[3] || M[4] || M[5] || "").replace(Tn, Dn), M[2] === "~=" && (M[3] = " " + M[3] + " "), M.slice(0, 4);
            },
            CHILD: function(M) {
              return M[1] = M[1].toLowerCase(), M[1].slice(0, 3) === "nth" ? (M[3] || Ie.error(M[0]), M[4] = +(M[4] ? M[5] + (M[6] || 1) : 2 * (M[3] === "even" || M[3] === "odd")), M[5] = +(M[7] + M[8] || M[3] === "odd")) : M[3] && Ie.error(M[0]), M;
            },
            PSEUDO: function(M) {
              var V, AA = !M[6] && M[2];
              return Qa.CHILD.test(M[0]) ? null : (M[3] ? M[2] = M[4] || M[5] || "" : AA && Ca.test(AA) && // Get excess from tokenize (recursively)
              (V = H(AA, !0)) && // advance to the next closing parenthesis
              (V = AA.indexOf(")", AA.length - V) - AA.length) && (M[0] = M[0].slice(0, V), M[2] = AA.slice(0, V)), M.slice(0, 3));
            }
          },
          filter: {
            TAG: function(M) {
              var V = M.replace(Tn, Dn).toLowerCase();
              return M === "*" ? function() {
                return !0;
              } : function(AA) {
                return AA.nodeName && AA.nodeName.toLowerCase() === V;
              };
            },
            CLASS: function(M) {
              var V = In[M + " "];
              return V || (V = new RegExp("(^|" + Oe + ")" + M + "(" + Oe + "|$)")) && In(M, function(AA) {
                return V.test(typeof AA.className == "string" && AA.className || typeof AA.getAttribute < "u" && AA.getAttribute("class") || "");
              });
            },
            ATTR: function(M, V, AA) {
              return function(pA) {
                var sA = Ie.attr(pA, M);
                return sA == null ? V === "!=" : V ? (sA += "", V === "=" ? sA === AA : V === "!=" ? sA !== AA : V === "^=" ? AA && sA.indexOf(AA) === 0 : V === "*=" ? AA && sA.indexOf(AA) > -1 : V === "$=" ? AA && sA.slice(-AA.length) === AA : V === "~=" ? (" " + sA.replace(rf, " ") + " ").indexOf(AA) > -1 : V === "|=" ? sA === AA || sA.slice(0, AA.length + 1) === AA + "-" : !1) : !0;
              };
            },
            CHILD: function(M, V, AA, pA, sA) {
              var CA = M.slice(0, 3) !== "nth", wA = M.slice(-4) !== "last", LA = V === "of-type";
              return pA === 1 && sA === 0 ? (
                // Shortcut for :nth-*(n)
                function(VA) {
                  return !!VA.parentNode;
                }
              ) : function(VA, re, WA) {
                var ee, pe, Le, zA, $e, et, Pt = CA !== wA ? "nextSibling" : "previousSibling", Ve = VA.parentNode, Ti = LA && VA.nodeName.toLowerCase(), er = !WA && !LA, dt = !1;
                if (Ve) {
                  if (CA) {
                    for (; Pt; ) {
                      for (zA = VA; zA = zA[Pt]; )
                        if (LA ? zA.nodeName.toLowerCase() === Ti : zA.nodeType === 1)
                          return !1;
                      et = Pt = M === "only" && !et && "nextSibling";
                    }
                    return !0;
                  }
                  if (et = [wA ? Ve.firstChild : Ve.lastChild], wA && er) {
                    for (zA = Ve, Le = zA[$A] || (zA[$A] = {}), pe = Le[zA.uniqueID] || (Le[zA.uniqueID] = {}), ee = pe[M] || [], $e = ee[0] === le && ee[1], dt = $e && ee[2], zA = $e && Ve.childNodes[$e]; zA = ++$e && zA && zA[Pt] || // Fallback to seeking `elem` from the start
                    (dt = $e = 0) || et.pop(); )
                      if (zA.nodeType === 1 && ++dt && zA === VA) {
                        pe[M] = [le, $e, dt];
                        break;
                      }
                  } else if (er && (zA = VA, Le = zA[$A] || (zA[$A] = {}), pe = Le[zA.uniqueID] || (Le[zA.uniqueID] = {}), ee = pe[M] || [], $e = ee[0] === le && ee[1], dt = $e), dt === !1)
                    for (; (zA = ++$e && zA && zA[Pt] || (dt = $e = 0) || et.pop()) && !((LA ? zA.nodeName.toLowerCase() === Ti : zA.nodeType === 1) && ++dt && (er && (Le = zA[$A] || (zA[$A] = {}), pe = Le[zA.uniqueID] || (Le[zA.uniqueID] = {}), pe[M] = [le, dt]), zA === VA)); )
                      ;
                  return dt -= sA, dt === pA || dt % pA === 0 && dt / pA >= 0;
                }
              };
            },
            PSEUDO: function(M, V) {
              var AA, pA = y.pseudos[M] || y.setFilters[M.toLowerCase()] || Ie.error("unsupported pseudo: " + M);
              return pA[$A] ? pA(V) : pA.length > 1 ? (AA = [M, M, "", V], y.setFilters.hasOwnProperty(M.toLowerCase()) ? hA(function(sA, CA) {
                for (var wA, LA = pA(sA, V), VA = LA.length; VA--; )
                  wA = vr(sA, LA[VA]), sA[wA] = !(CA[wA] = LA[VA]);
              }) : function(sA) {
                return pA(sA, 0, AA);
              }) : pA;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: hA(function(M) {
              var V = [], AA = [], pA = K(M.replace(ya, "$1"));
              return pA[$A] ? hA(function(sA, CA, wA, LA) {
                for (var VA, re = pA(sA, null, LA, []), WA = sA.length; WA--; )
                  (VA = re[WA]) && (sA[WA] = !(CA[WA] = VA));
              }) : function(sA, CA, wA) {
                return V[0] = sA, pA(V, null, wA, AA), V[0] = null, !AA.pop();
              };
            }),
            has: hA(function(M) {
              return function(V) {
                return Ie(M, V).length > 0;
              };
            }),
            contains: hA(function(M) {
              return M = M.replace(Tn, Dn), function(V) {
                return (V.textContent || V.innerText || E(V)).indexOf(M) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            lang: hA(function(M) {
              return mu.test(M || "") || Ie.error("unsupported lang: " + M), M = M.replace(Tn, Dn).toLowerCase(), function(V) {
                var AA;
                do
                  if (AA = Ae ? V.lang : V.getAttribute("xml:lang") || V.getAttribute("lang"))
                    return AA = AA.toLowerCase(), AA === M || AA.indexOf(M + "-") === 0;
                while ((V = V.parentNode) && V.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(M) {
              var V = u.location && u.location.hash;
              return V && V.slice(1) === M.id;
            },
            root: function(M) {
              return M === ie;
            },
            focus: function(M) {
              return M === EA.activeElement && (!EA.hasFocus || EA.hasFocus()) && !!(M.type || M.href || ~M.tabIndex);
            },
            // Boolean properties
            enabled: function(M) {
              return M.disabled === !1;
            },
            disabled: function(M) {
              return M.disabled === !0;
            },
            checked: function(M) {
              var V = M.nodeName.toLowerCase();
              return V === "input" && !!M.checked || V === "option" && !!M.selected;
            },
            selected: function(M) {
              return M.parentNode && M.parentNode.selectedIndex, M.selected === !0;
            },
            // Contents
            empty: function(M) {
              for (M = M.firstChild; M; M = M.nextSibling)
                if (M.nodeType < 6)
                  return !1;
              return !0;
            },
            parent: function(M) {
              return !y.pseudos.empty(M);
            },
            // Element/input types
            header: function(M) {
              return ei.test(M.nodeName);
            },
            input: function(M) {
              return af.test(M.nodeName);
            },
            button: function(M) {
              var V = M.nodeName.toLowerCase();
              return V === "input" && M.type === "button" || V === "button";
            },
            text: function(M) {
              var V;
              return M.nodeName.toLowerCase() === "input" && M.type === "text" && // Support: IE<8
              // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
              ((V = M.getAttribute("type")) == null || V.toLowerCase() === "text");
            },
            // Position-in-collection
            first: be(function() {
              return [0];
            }),
            last: be(function(M, V) {
              return [V - 1];
            }),
            eq: be(function(M, V, AA) {
              return [AA < 0 ? AA + V : AA];
            }),
            even: be(function(M, V) {
              for (var AA = 0; AA < V; AA += 2)
                M.push(AA);
              return M;
            }),
            odd: be(function(M, V) {
              for (var AA = 1; AA < V; AA += 2)
                M.push(AA);
              return M;
            }),
            lt: be(function(M, V, AA) {
              for (var pA = AA < 0 ? AA + V : AA; --pA >= 0; )
                M.push(pA);
              return M;
            }),
            gt: be(function(M, V, AA) {
              for (var pA = AA < 0 ? AA + V : AA; ++pA < V; )
                M.push(pA);
              return M;
            })
          }
        }, y.pseudos.nth = y.pseudos.eq;
        for (d in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          y.pseudos[d] = He(d);
        for (d in { submit: !0, reset: !0 })
          y.pseudos[d] = At(d);
        function Cu() {
        }
        Cu.prototype = y.filters = y.pseudos, y.setFilters = new Cu(), H = Ie.tokenize = function(M, V) {
          var AA, pA, sA, CA, wA, LA, VA, re = va[M + " "];
          if (re)
            return V ? 0 : re.slice(0);
          for (wA = M, LA = [], VA = y.preFilter; wA; ) {
            (!AA || (pA = _o.exec(wA))) && (pA && (wA = wA.slice(pA[0].length) || wA), LA.push(sA = [])), AA = !1, (pA = wu.exec(wA)) && (AA = pA.shift(), sA.push({
              value: AA,
              // Cast descendant combinators to space
              type: pA[0].replace(ya, " ")
            }), wA = wA.slice(AA.length));
            for (CA in y.filter)
              (pA = Qa[CA].exec(wA)) && (!VA[CA] || (pA = VA[CA](pA))) && (AA = pA.shift(), sA.push({
                value: AA,
                type: CA,
                matches: pA
              }), wA = wA.slice(AA.length));
            if (!AA)
              break;
          }
          return V ? wA.length : wA ? Ie.error(M) : (
            // Cache the tokens
            va(M, LA).slice(0)
          );
        };
        function mt(M) {
          for (var V = 0, AA = M.length, pA = ""; V < AA; V++)
            pA += M[V].value;
          return pA;
        }
        function ti(M, V, AA) {
          var pA = V.dir, sA = AA && pA === "parentNode", CA = Xe++;
          return V.first ? (
            // Check against closest ancestor/preceding element
            function(wA, LA, VA) {
              for (; wA = wA[pA]; )
                if (wA.nodeType === 1 || sA)
                  return M(wA, LA, VA);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(wA, LA, VA) {
              var re, WA, ee, pe = [le, CA];
              if (VA) {
                for (; wA = wA[pA]; )
                  if ((wA.nodeType === 1 || sA) && M(wA, LA, VA))
                    return !0;
              } else
                for (; wA = wA[pA]; )
                  if (wA.nodeType === 1 || sA) {
                    if (ee = wA[$A] || (wA[$A] = {}), WA = ee[wA.uniqueID] || (ee[wA.uniqueID] = {}), (re = WA[pA]) && re[0] === le && re[1] === CA)
                      return pe[2] = re[2];
                    if (WA[pA] = pe, pe[2] = M(wA, LA, VA))
                      return !0;
                  }
            }
          );
        }
        function Io(M) {
          return M.length > 1 ? function(V, AA, pA) {
            for (var sA = M.length; sA--; )
              if (!M[sA](V, AA, pA))
                return !1;
            return !0;
          } : M[0];
        }
        function ni(M, V, AA) {
          for (var pA = 0, sA = V.length; pA < sA; pA++)
            Ie(M, V[pA], AA);
          return AA;
        }
        function Cr(M, V, AA, pA, sA) {
          for (var CA, wA = [], LA = 0, VA = M.length, re = V != null; LA < VA; LA++)
            (CA = M[LA]) && (!AA || AA(CA, pA, sA)) && (wA.push(CA), re && V.push(LA));
          return wA;
        }
        function ri(M, V, AA, pA, sA, CA) {
          return pA && !pA[$A] && (pA = ri(pA)), sA && !sA[$A] && (sA = ri(sA, CA)), hA(function(wA, LA, VA, re) {
            var WA, ee, pe, Le = [], zA = [], $e = LA.length, et = wA || ni(V || "*", VA.nodeType ? [VA] : VA, []), Pt = M && (wA || !V) ? Cr(et, Le, M, VA, re) : et, Ve = AA ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              sA || (wA ? M : $e || pA) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                LA
              )
            ) : Pt;
            if (AA && AA(Pt, Ve, VA, re), pA)
              for (WA = Cr(Ve, zA), pA(WA, [], VA, re), ee = WA.length; ee--; )
                (pe = WA[ee]) && (Ve[zA[ee]] = !(Pt[zA[ee]] = pe));
            if (wA) {
              if (sA || M) {
                if (sA) {
                  for (WA = [], ee = Ve.length; ee--; )
                    (pe = Ve[ee]) && WA.push(Pt[ee] = pe);
                  sA(null, Ve = [], WA, re);
                }
                for (ee = Ve.length; ee--; )
                  (pe = Ve[ee]) && (WA = sA ? vr(wA, pe) : Le[ee]) > -1 && (wA[WA] = !(LA[WA] = pe));
              }
            } else
              Ve = Cr(
                Ve === LA ? Ve.splice($e, Ve.length) : Ve
              ), sA ? sA(null, LA, Ve, re) : Ln.apply(LA, Ve);
          });
        }
        function Se(M) {
          for (var V, AA, pA, sA = M.length, CA = y.relative[M[0].type], wA = CA || y.relative[" "], LA = CA ? 1 : 0, VA = ti(function(ee) {
            return ee === V;
          }, wA, !0), re = ti(function(ee) {
            return vr(V, ee) > -1;
          }, wA, !0), WA = [function(ee, pe, Le) {
            var zA = !CA && (Le || pe !== Z) || ((V = pe).nodeType ? VA(ee, pe, Le) : re(ee, pe, Le));
            return V = null, zA;
          }]; LA < sA; LA++)
            if (AA = y.relative[M[LA].type])
              WA = [ti(Io(WA), AA)];
            else {
              if (AA = y.filter[M[LA].type].apply(null, M[LA].matches), AA[$A]) {
                for (pA = ++LA; pA < sA && !y.relative[M[pA].type]; pA++)
                  ;
                return ri(
                  LA > 1 && Io(WA),
                  LA > 1 && mt(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    M.slice(0, LA - 1).concat({ value: M[LA - 2].type === " " ? "*" : "" })
                  ).replace(ya, "$1"),
                  AA,
                  LA < pA && Se(M.slice(LA, pA)),
                  pA < sA && Se(M = M.slice(pA)),
                  pA < sA && mt(M)
                );
              }
              WA.push(AA);
            }
          return Io(WA);
        }
        function sf(M, V) {
          var AA = V.length > 0, pA = M.length > 0, sA = function(CA, wA, LA, VA, re) {
            var WA, ee, pe, Le = 0, zA = "0", $e = CA && [], et = [], Pt = Z, Ve = CA || pA && y.find.TAG("*", re), Ti = le += Pt == null ? 1 : Math.random() || 0.1, er = Ve.length;
            for (re && (Z = wA === EA || wA || re); zA !== er && (WA = Ve[zA]) != null; zA++) {
              if (pA && WA) {
                for (ee = 0, !wA && WA.ownerDocument !== EA && (TA(WA), LA = !Ae); pe = M[ee++]; )
                  if (pe(WA, wA || EA, LA)) {
                    VA.push(WA);
                    break;
                  }
                re && (le = Ti);
              }
              AA && ((WA = !pe && WA) && Le--, CA && $e.push(WA));
            }
            if (Le += zA, AA && zA !== Le) {
              for (ee = 0; pe = V[ee++]; )
                pe($e, et, wA, LA);
              if (CA) {
                if (Le > 0)
                  for (; zA--; )
                    $e[zA] || et[zA] || (et[zA] = It.call(VA));
                et = Cr(et);
              }
              Ln.apply(VA, et), re && !CA && et.length > 0 && Le + V.length > 1 && Ie.uniqueSort(VA);
            }
            return re && (le = Ti, Z = Pt), $e;
          };
          return AA ? hA(sA) : sA;
        }
        return K = Ie.compile = function(M, V) {
          var AA, pA = [], sA = [], CA = xt[M + " "];
          if (!CA) {
            for (V || (V = H(M)), AA = V.length; AA--; )
              CA = Se(V[AA]), CA[$A] ? pA.push(CA) : sA.push(CA);
            CA = xt(M, sf(sA, pA)), CA.selector = M;
          }
          return CA;
        }, J = Ie.select = function(M, V, AA, pA) {
          var sA, CA, wA, LA, VA, re = typeof M == "function" && M, WA = !pA && H(M = re.selector || M);
          if (AA = AA || [], WA.length === 1) {
            if (CA = WA[0] = WA[0].slice(0), CA.length > 2 && (wA = CA[0]).type === "ID" && m.getById && V.nodeType === 9 && Ae && y.relative[CA[1].type]) {
              if (V = (y.find.ID(wA.matches[0].replace(Tn, Dn), V) || [])[0], V)
                re && (V = V.parentNode);
              else return AA;
              M = M.slice(CA.shift().value.length);
            }
            for (sA = Qa.needsContext.test(M) ? 0 : CA.length; sA-- && (wA = CA[sA], !y.relative[LA = wA.type]); )
              if ((VA = y.find[LA]) && (pA = VA(
                wA.matches[0].replace(Tn, Dn),
                xo.test(CA[0].type) && Li(V.parentNode) || V
              ))) {
                if (CA.splice(sA, 1), M = pA.length && mt(CA), !M)
                  return Ln.apply(AA, pA), AA;
                break;
              }
          }
          return (re || K(M, WA))(
            pA,
            V,
            !Ae,
            AA,
            !V || xo.test(M) && Li(V.parentNode) || V
          ), AA;
        }, m.sortStable = $A.split("").sort(Hn).join("") === $A, m.detectDuplicates = !!UA, TA(), m.sortDetached = uA(function(M) {
          return M.compareDocumentPosition(EA.createElement("div")) & 1;
        }), uA(function(M) {
          return M.innerHTML = "<a href='#'></a>", M.firstChild.getAttribute("href") === "#";
        }) || KA("type|href|height|width", function(M, V, AA) {
          if (!AA)
            return M.getAttribute(V, V.toLowerCase() === "type" ? 1 : 2);
        }), (!m.attributes || !uA(function(M) {
          return M.innerHTML = "<input/>", M.firstChild.setAttribute("value", ""), M.firstChild.getAttribute("value") === "";
        })) && KA("value", function(M, V, AA) {
          if (!AA && M.nodeName.toLowerCase() === "input")
            return M.defaultValue;
        }), uA(function(M) {
          return M.getAttribute("disabled") == null;
        }) || KA(bo, function(M, V, AA) {
          var pA;
          if (!AA)
            return M[V] === !0 ? V.toLowerCase() : (pA = M.getAttributeNode(V)) && pA.specified ? pA.value : null;
        }), Ie;
      }(e)
    );
    o.find = b, o.expr = b.selectors, o.expr[":"] = o.expr.pseudos, o.uniqueSort = o.unique = b.uniqueSort, o.text = b.getText, o.isXMLDoc = b.isXML, o.contains = b.contains;
    var P = function(u, d, m) {
      for (var y = [], E = m !== void 0; (u = u[d]) && u.nodeType !== 9; )
        if (u.nodeType === 1) {
          if (E && o(u).is(m))
            break;
          y.push(u);
        }
      return y;
    }, R = function(u, d) {
      for (var m = []; u; u = u.nextSibling)
        u.nodeType === 1 && u !== d && m.push(u);
      return m;
    }, j = o.expr.match.needsContext, dA = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, fA = /^.[^:#\[\.,]*$/;
    function mA(u, d, m) {
      if (o.isFunction(d))
        return o.grep(u, function(y, E) {
          return !!d.call(y, E, y) !== m;
        });
      if (d.nodeType)
        return o.grep(u, function(y) {
          return y === d !== m;
        });
      if (typeof d == "string") {
        if (fA.test(d))
          return o.filter(d, u, m);
        d = o.filter(d, u);
      }
      return o.grep(u, function(y) {
        return o.inArray(y, d) > -1 !== m;
      });
    }
    o.filter = function(u, d, m) {
      var y = d[0];
      return m && (u = ":not(" + u + ")"), d.length === 1 && y.nodeType === 1 ? o.find.matchesSelector(y, u) ? [y] : [] : o.find.matches(u, o.grep(d, function(E) {
        return E.nodeType === 1;
      }));
    }, o.fn.extend({
      find: function(u) {
        var d, m = [], y = this, E = y.length;
        if (typeof u != "string")
          return this.pushStack(o(u).filter(function() {
            for (d = 0; d < E; d++)
              if (o.contains(y[d], this))
                return !0;
          }));
        for (d = 0; d < E; d++)
          o.find(u, y[d], m);
        return m = this.pushStack(E > 1 ? o.unique(m) : m), m.selector = this.selector ? this.selector + " " + u : u, m;
      },
      filter: function(u) {
        return this.pushStack(mA(this, u || [], !1));
      },
      not: function(u) {
        return this.pushStack(mA(this, u || [], !0));
      },
      is: function(u) {
        return !!mA(
          this,
          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof u == "string" && j.test(u) ? o(u) : u || [],
          !1
        ).length;
      }
    });
    var FA, NA = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, bA = o.fn.init = function(u, d, m) {
      var y, E;
      if (!u)
        return this;
      if (m = m || FA, typeof u == "string")
        if (u.charAt(0) === "<" && u.charAt(u.length - 1) === ">" && u.length >= 3 ? y = [null, u, null] : y = NA.exec(u), y && (y[1] || !d))
          if (y[1]) {
            if (d = d instanceof o ? d[0] : d, o.merge(this, o.parseHTML(
              y[1],
              d && d.nodeType ? d.ownerDocument || d : i,
              !0
            )), dA.test(y[1]) && o.isPlainObject(d))
              for (y in d)
                o.isFunction(this[y]) ? this[y](d[y]) : this.attr(y, d[y]);
            return this;
          } else {
            if (E = i.getElementById(y[2]), E && E.parentNode) {
              if (E.id !== y[2])
                return FA.find(u);
              this.length = 1, this[0] = E;
            }
            return this.context = i, this.selector = u, this;
          }
        else return !d || d.jquery ? (d || m).find(u) : this.constructor(d).find(u);
      else {
        if (u.nodeType)
          return this.context = this[0] = u, this.length = 1, this;
        if (o.isFunction(u))
          return typeof m.ready < "u" ? m.ready(u) : (
            // Execute immediately if ready is not present
            u(o)
          );
      }
      return u.selector !== void 0 && (this.selector = u.selector, this.context = u.context), o.makeArray(u, this);
    };
    bA.prototype = o.fn, FA = o(i);
    var z = /^(?:parents|prev(?:Until|All))/, QA = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
    o.fn.extend({
      has: function(u) {
        var d, m = o(u, this), y = m.length;
        return this.filter(function() {
          for (d = 0; d < y; d++)
            if (o.contains(this, m[d]))
              return !0;
        });
      },
      closest: function(u, d) {
        for (var m, y = 0, E = this.length, x = [], H = j.test(u) || typeof u != "string" ? o(u, d || this.context) : 0; y < E; y++)
          for (m = this[y]; m && m !== d; m = m.parentNode)
            if (m.nodeType < 11 && (H ? H.index(m) > -1 : (
              // Don't pass non-elements to Sizzle
              m.nodeType === 1 && o.find.matchesSelector(m, u)
            ))) {
              x.push(m);
              break;
            }
        return this.pushStack(x.length > 1 ? o.uniqueSort(x) : x);
      },
      // Determine the position of an element within
      // the matched set of elements
      index: function(u) {
        return u ? typeof u == "string" ? o.inArray(this[0], o(u)) : o.inArray(
          // If it receives a jQuery object, the first element is used
          u.jquery ? u[0] : u,
          this
        ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      },
      add: function(u, d) {
        return this.pushStack(
          o.uniqueSort(
            o.merge(this.get(), o(u, d))
          )
        );
      },
      addBack: function(u) {
        return this.add(
          u == null ? this.prevObject : this.prevObject.filter(u)
        );
      }
    });
    function aA(u, d) {
      do
        u = u[d];
      while (u && u.nodeType !== 1);
      return u;
    }
    o.each({
      parent: function(u) {
        var d = u.parentNode;
        return d && d.nodeType !== 11 ? d : null;
      },
      parents: function(u) {
        return P(u, "parentNode");
      },
      parentsUntil: function(u, d, m) {
        return P(u, "parentNode", m);
      },
      next: function(u) {
        return aA(u, "nextSibling");
      },
      prev: function(u) {
        return aA(u, "previousSibling");
      },
      nextAll: function(u) {
        return P(u, "nextSibling");
      },
      prevAll: function(u) {
        return P(u, "previousSibling");
      },
      nextUntil: function(u, d, m) {
        return P(u, "nextSibling", m);
      },
      prevUntil: function(u, d, m) {
        return P(u, "previousSibling", m);
      },
      siblings: function(u) {
        return R((u.parentNode || {}).firstChild, u);
      },
      children: function(u) {
        return R(u.firstChild);
      },
      contents: function(u) {
        return o.nodeName(u, "iframe") ? u.contentDocument || u.contentWindow.document : o.merge([], u.childNodes);
      }
    }, function(u, d) {
      o.fn[u] = function(m, y) {
        var E = o.map(this, d, m);
        return u.slice(-5) !== "Until" && (y = m), y && typeof y == "string" && (E = o.filter(y, E)), this.length > 1 && (QA[u] || (E = o.uniqueSort(E)), z.test(u) && (E = E.reverse())), this.pushStack(E);
      };
    });
    var BA = /\S+/g;
    function HA(u) {
      var d = {};
      return o.each(u.match(BA) || [], function(m, y) {
        d[y] = !0;
      }), d;
    }
    o.Callbacks = function(u) {
      u = typeof u == "string" ? HA(u) : o.extend({}, u);
      var d, m, y, E, x = [], H = [], K = -1, J = function() {
        for (E = u.once, y = d = !0; H.length; K = -1)
          for (m = H.shift(); ++K < x.length; )
            x[K].apply(m[0], m[1]) === !1 && u.stopOnFalse && (K = x.length, m = !1);
        u.memory || (m = !1), d = !1, E && (m ? x = [] : x = "");
      }, Z = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return x && (m && !d && (K = x.length - 1, H.push(m)), function rA(UA) {
            o.each(UA, function(TA, EA) {
              o.isFunction(EA) ? (!u.unique || !Z.has(EA)) && x.push(EA) : EA && EA.length && o.type(EA) !== "string" && rA(EA);
            });
          }(arguments), m && !d && J()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return o.each(arguments, function(rA, UA) {
            for (var TA; (TA = o.inArray(UA, x, TA)) > -1; )
              x.splice(TA, 1), TA <= K && K--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(rA) {
          return rA ? o.inArray(rA, x) > -1 : x.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return x && (x = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return E = H = [], x = m = "", this;
        },
        disabled: function() {
          return !x;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return E = !0, m || Z.disable(), this;
        },
        locked: function() {
          return !!E;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(rA, UA) {
          return E || (UA = UA || [], UA = [rA, UA.slice ? UA.slice() : UA], H.push(UA), d || J()), this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          return Z.fireWith(this, arguments), this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!y;
        }
      };
      return Z;
    }, o.extend({
      Deferred: function(u) {
        var d = [
          // action, add listener, listener list, final state
          ["resolve", "done", o.Callbacks("once memory"), "resolved"],
          ["reject", "fail", o.Callbacks("once memory"), "rejected"],
          ["notify", "progress", o.Callbacks("memory")]
        ], m = "pending", y = {
          state: function() {
            return m;
          },
          always: function() {
            return E.done(arguments).fail(arguments), this;
          },
          then: function() {
            var x = arguments;
            return o.Deferred(function(H) {
              o.each(d, function(K, J) {
                var Z = o.isFunction(x[K]) && x[K];
                E[J[1]](function() {
                  var rA = Z && Z.apply(this, arguments);
                  rA && o.isFunction(rA.promise) ? rA.promise().progress(H.notify).done(H.resolve).fail(H.reject) : H[J[0] + "With"](
                    this === y ? H.promise() : this,
                    Z ? [rA] : arguments
                  );
                });
              }), x = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(x) {
            return x != null ? o.extend(x, y) : y;
          }
        }, E = {};
        return y.pipe = y.then, o.each(d, function(x, H) {
          var K = H[2], J = H[3];
          y[H[1]] = K.add, J && K.add(function() {
            m = J;
          }, d[x ^ 1][2].disable, d[2][2].lock), E[H[0]] = function() {
            return E[H[0] + "With"](this === E ? y : this, arguments), this;
          }, E[H[0] + "With"] = K.fireWith;
        }), y.promise(E), u && u.call(E, E), E;
      },
      // Deferred helper
      when: function(u) {
        var d = 0, m = s.call(arguments), y = m.length, E = y !== 1 || u && o.isFunction(u.promise) ? y : 0, x = E === 1 ? u : o.Deferred(), H = function(rA, UA, TA) {
          return function(EA) {
            UA[rA] = this, TA[rA] = arguments.length > 1 ? s.call(arguments) : EA, TA === K ? x.notifyWith(UA, TA) : --E || x.resolveWith(UA, TA);
          };
        }, K, J, Z;
        if (y > 1)
          for (K = new Array(y), J = new Array(y), Z = new Array(y); d < y; d++)
            m[d] && o.isFunction(m[d].promise) ? m[d].promise().progress(H(d, J, K)).done(H(d, Z, m)).fail(x.reject) : --E;
        return E || x.resolveWith(Z, m), x.promise();
      }
    });
    var SA;
    o.fn.ready = function(u) {
      return o.ready.promise().done(u), this;
    }, o.extend({
      // Is the DOM ready to be used? Set to true once it occurs.
      isReady: !1,
      // A counter to track how many items to wait for before
      // the ready event fires. See #6781
      readyWait: 1,
      // Hold (or release) the ready event
      holdReady: function(u) {
        u ? o.readyWait++ : o.ready(!0);
      },
      // Handle when the DOM is ready
      ready: function(u) {
        (u === !0 ? --o.readyWait : o.isReady) || (o.isReady = !0, !(u !== !0 && --o.readyWait > 0) && (SA.resolveWith(i, [o]), o.fn.triggerHandler && (o(i).triggerHandler("ready"), o(i).off("ready"))));
      }
    });
    function lA() {
      i.addEventListener ? (i.removeEventListener("DOMContentLoaded", D), e.removeEventListener("load", D)) : (i.detachEvent("onreadystatechange", D), e.detachEvent("onload", D));
    }
    function D() {
      (i.addEventListener || e.event.type === "load" || i.readyState === "complete") && (lA(), o.ready());
    }
    o.ready.promise = function(u) {
      if (!SA)
        if (SA = o.Deferred(), i.readyState === "complete" || i.readyState !== "loading" && !i.documentElement.doScroll)
          e.setTimeout(o.ready);
        else if (i.addEventListener)
          i.addEventListener("DOMContentLoaded", D), e.addEventListener("load", D);
        else {
          i.attachEvent("onreadystatechange", D), e.attachEvent("onload", D);
          var d = !1;
          try {
            d = e.frameElement == null && i.documentElement;
          } catch {
          }
          d && d.doScroll && function m() {
            if (!o.isReady) {
              try {
                d.doScroll("left");
              } catch {
                return e.setTimeout(m, 50);
              }
              lA(), o.ready();
            }
          }();
        }
      return SA.promise(u);
    }, o.ready.promise();
    var iA;
    for (iA in o(p))
      break;
    p.ownFirst = iA === "0", p.inlineBlockNeedsLayout = !1, o(function() {
      var u, d, m, y;
      m = i.getElementsByTagName("body")[0], !(!m || !m.style) && (d = i.createElement("div"), y = i.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", m.appendChild(y).appendChild(d), typeof d.style.zoom < "u" && (d.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", p.inlineBlockNeedsLayout = u = d.offsetWidth === 3, u && (m.style.zoom = 1)), m.removeChild(y));
    }), function() {
      var u = i.createElement("div");
      p.deleteExpando = !0;
      try {
        delete u.test;
      } catch {
        p.deleteExpando = !1;
      }
      u = null;
    }();
    var Y = function(u) {
      var d = o.noData[(u.nodeName + " ").toLowerCase()], m = +u.nodeType || 1;
      return m !== 1 && m !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !d || d !== !0 && u.getAttribute("classid") === d
      );
    }, L = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, k = /([A-Z])/g;
    function oA(u, d, m) {
      if (m === void 0 && u.nodeType === 1) {
        var y = "data-" + d.replace(k, "-$1").toLowerCase();
        if (m = u.getAttribute(y), typeof m == "string") {
          try {
            m = m === "true" ? !0 : m === "false" ? !1 : m === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +m + "" === m ? +m : L.test(m) ? o.parseJSON(m) : m
            );
          } catch {
          }
          o.data(u, d, m);
        } else
          m = void 0;
      }
      return m;
    }
    function _A(u) {
      var d;
      for (d in u)
        if (!(d === "data" && o.isEmptyObject(u[d])) && d !== "toJSON")
          return !1;
      return !0;
    }
    function IA(u, d, m, y) {
      if (Y(u)) {
        var E, x, H = o.expando, K = u.nodeType, J = K ? o.cache : u, Z = K ? u[H] : u[H] && H;
        if (!((!Z || !J[Z] || !y && !J[Z].data) && m === void 0 && typeof d == "string"))
          return Z || (K ? Z = u[H] = n.pop() || o.guid++ : Z = H), J[Z] || (J[Z] = K ? {} : { toJSON: o.noop }), (typeof d == "object" || typeof d == "function") && (y ? J[Z] = o.extend(J[Z], d) : J[Z].data = o.extend(J[Z].data, d)), x = J[Z], y || (x.data || (x.data = {}), x = x.data), m !== void 0 && (x[o.camelCase(d)] = m), typeof d == "string" ? (E = x[d], E == null && (E = x[o.camelCase(d)])) : E = x, E;
      }
    }
    function JA(u, d, m) {
      if (Y(u)) {
        var y, E, x = u.nodeType, H = x ? o.cache : u, K = x ? u[o.expando] : o.expando;
        if (H[K]) {
          if (d && (y = m ? H[K] : H[K].data, y)) {
            for (o.isArray(d) ? d = d.concat(o.map(d, o.camelCase)) : (d in y) ? d = [d] : (d = o.camelCase(d), d in y ? d = [d] : d = d.split(" ")), E = d.length; E--; )
              delete y[d[E]];
            if (m ? !_A(y) : !o.isEmptyObject(y))
              return;
          }
          !m && (delete H[K].data, !_A(H[K])) || (x ? o.cleanData([u], !0) : p.deleteExpando || H != H.window ? delete H[K] : H[K] = void 0);
        }
      }
    }
    o.extend({
      cache: {},
      // The following elements (space-suffixed to avoid Object.prototype collisions)
      // throw uncatchable exceptions if you attempt to set expando properties
      noData: {
        "applet ": !0,
        "embed ": !0,
        // ...but Flash objects (which have this classid) *can* handle expandos
        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      },
      hasData: function(u) {
        return u = u.nodeType ? o.cache[u[o.expando]] : u[o.expando], !!u && !_A(u);
      },
      data: function(u, d, m) {
        return IA(u, d, m);
      },
      removeData: function(u, d) {
        return JA(u, d);
      },
      // For internal use only.
      _data: function(u, d, m) {
        return IA(u, d, m, !0);
      },
      _removeData: function(u, d) {
        return JA(u, d, !0);
      }
    }), o.fn.extend({
      data: function(u, d) {
        var m, y, E, x = this[0], H = x && x.attributes;
        if (u === void 0) {
          if (this.length && (E = o.data(x), x.nodeType === 1 && !o._data(x, "parsedAttrs"))) {
            for (m = H.length; m--; )
              H[m] && (y = H[m].name, y.indexOf("data-") === 0 && (y = o.camelCase(y.slice(5)), oA(x, y, E[y])));
            o._data(x, "parsedAttrs", !0);
          }
          return E;
        }
        return typeof u == "object" ? this.each(function() {
          o.data(this, u);
        }) : arguments.length > 1 ? (
          // Sets one value
          this.each(function() {
            o.data(this, u, d);
          })
        ) : (
          // Gets one value
          // Try to fetch any internally stored data first
          x ? oA(x, u, o.data(x, u)) : void 0
        );
      },
      removeData: function(u) {
        return this.each(function() {
          o.removeData(this, u);
        });
      }
    }), o.extend({
      queue: function(u, d, m) {
        var y;
        if (u)
          return d = (d || "fx") + "queue", y = o._data(u, d), m && (!y || o.isArray(m) ? y = o._data(u, d, o.makeArray(m)) : y.push(m)), y || [];
      },
      dequeue: function(u, d) {
        d = d || "fx";
        var m = o.queue(u, d), y = m.length, E = m.shift(), x = o._queueHooks(u, d), H = function() {
          o.dequeue(u, d);
        };
        E === "inprogress" && (E = m.shift(), y--), E && (d === "fx" && m.unshift("inprogress"), delete x.stop, E.call(u, H, x)), !y && x && x.empty.fire();
      },
      // not intended for public consumption - generates a queueHooks object,
      // or returns the current one
      _queueHooks: function(u, d) {
        var m = d + "queueHooks";
        return o._data(u, m) || o._data(u, m, {
          empty: o.Callbacks("once memory").add(function() {
            o._removeData(u, d + "queue"), o._removeData(u, m);
          })
        });
      }
    }), o.fn.extend({
      queue: function(u, d) {
        var m = 2;
        return typeof u != "string" && (d = u, u = "fx", m--), arguments.length < m ? o.queue(this[0], u) : d === void 0 ? this : this.each(function() {
          var y = o.queue(this, u, d);
          o._queueHooks(this, u), u === "fx" && y[0] !== "inprogress" && o.dequeue(this, u);
        });
      },
      dequeue: function(u) {
        return this.each(function() {
          o.dequeue(this, u);
        });
      },
      clearQueue: function(u) {
        return this.queue(u || "fx", []);
      },
      // Get a promise resolved when queues of a certain type
      // are emptied (fx is the type by default)
      promise: function(u, d) {
        var m, y = 1, E = o.Deferred(), x = this, H = this.length, K = function() {
          --y || E.resolveWith(x, [x]);
        };
        for (typeof u != "string" && (d = u, u = void 0), u = u || "fx"; H--; )
          m = o._data(x[H], u + "queueHooks"), m && m.empty && (y++, m.empty.add(K));
        return K(), E.promise(d);
      }
    }), function() {
      var u;
      p.shrinkWrapBlocks = function() {
        if (u != null)
          return u;
        u = !1;
        var d, m, y;
        if (m = i.getElementsByTagName("body")[0], !(!m || !m.style))
          return d = i.createElement("div"), y = i.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", m.appendChild(y).appendChild(d), typeof d.style.zoom < "u" && (d.style.cssText = // Support: Firefox<29, Android 2.3
          // Vendor-prefix box-sizing
          "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", d.appendChild(i.createElement("div")).style.width = "5px", u = d.offsetWidth !== 3), m.removeChild(y), u;
      };
    }();
    var jA = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, q = new RegExp("^(?:([+-])=|)(" + jA + ")([a-z%]*)$", "i"), X = ["Top", "Right", "Bottom", "Left"], G = function(u, d) {
      return u = d || u, o.css(u, "display") === "none" || !o.contains(u.ownerDocument, u);
    };
    function tA(u, d, m, y) {
      var E, x = 1, H = 20, K = y ? function() {
        return y.cur();
      } : function() {
        return o.css(u, d, "");
      }, J = K(), Z = m && m[3] || (o.cssNumber[d] ? "" : "px"), rA = (o.cssNumber[d] || Z !== "px" && +J) && q.exec(o.css(u, d));
      if (rA && rA[3] !== Z) {
        Z = Z || rA[3], m = m || [], rA = +J || 1;
        do
          x = x || ".5", rA = rA / x, o.style(u, d, rA + Z);
        while (x !== (x = K() / J) && x !== 1 && --H);
      }
      return m && (rA = +rA || +J || 0, E = m[1] ? rA + (m[1] + 1) * m[2] : +m[2], y && (y.unit = Z, y.start = rA, y.end = E)), E;
    }
    var cA = function(u, d, m, y, E, x, H) {
      var K = 0, J = u.length, Z = m == null;
      if (o.type(m) === "object") {
        E = !0;
        for (K in m)
          cA(u, d, K, m[K], !0, x, H);
      } else if (y !== void 0 && (E = !0, o.isFunction(y) || (H = !0), Z && (H ? (d.call(u, y), d = null) : (Z = d, d = function(rA, UA, TA) {
        return Z.call(o(rA), TA);
      })), d))
        for (; K < J; K++)
          d(
            u[K],
            m,
            H ? y : y.call(u[K], K, d(u[K], m))
          );
      return E ? u : (
        // Gets
        Z ? d.call(u) : J ? d(u[0], m) : x
      );
    }, DA = /^(?:checkbox|radio)$/i, YA = /<([\w:-]+)/, ue = /^$|\/(?:java|ecma)script/i, xe = /^\s+/, he = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function de(u) {
      var d = he.split("|"), m = u.createDocumentFragment();
      if (m.createElement)
        for (; d.length; )
          m.createElement(
            d.pop()
          );
      return m;
    }
    (function() {
      var u = i.createElement("div"), d = i.createDocumentFragment(), m = i.createElement("input");
      u.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", p.leadingWhitespace = u.firstChild.nodeType === 3, p.tbody = !u.getElementsByTagName("tbody").length, p.htmlSerialize = !!u.getElementsByTagName("link").length, p.html5Clone = i.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", m.type = "checkbox", m.checked = !0, d.appendChild(m), p.appendChecked = m.checked, u.innerHTML = "<textarea>x</textarea>", p.noCloneChecked = !!u.cloneNode(!0).lastChild.defaultValue, d.appendChild(u), m = i.createElement("input"), m.setAttribute("type", "radio"), m.setAttribute("checked", "checked"), m.setAttribute("name", "t"), u.appendChild(m), p.checkClone = u.cloneNode(!0).cloneNode(!0).lastChild.checked, p.noCloneEvent = !!u.addEventListener, u[o.expando] = 1, p.attributes = !u.getAttribute(o.expando);
    })();
    var De = {
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
      _default: p.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    De.optgroup = De.option, De.tbody = De.tfoot = De.colgroup = De.caption = De.thead, De.th = De.td;
    function fe(u, d) {
      var m, y, E = 0, x = typeof u.getElementsByTagName < "u" ? u.getElementsByTagName(d || "*") : typeof u.querySelectorAll < "u" ? u.querySelectorAll(d || "*") : void 0;
      if (!x)
        for (x = [], m = u.childNodes || u; (y = m[E]) != null; E++)
          !d || o.nodeName(y, d) ? x.push(y) : o.merge(x, fe(y, d));
      return d === void 0 || d && o.nodeName(u, d) ? o.merge([u], x) : x;
    }
    function Ot(u, d) {
      for (var m, y = 0; (m = u[y]) != null; y++)
        o._data(
          m,
          "globalEval",
          !d || o._data(d[y], "globalEval")
        );
    }
    var Ut = /<|&#?\w+;/, Nt = /<tbody/i;
    function Et(u) {
      DA.test(u.type) && (u.defaultChecked = u.checked);
    }
    function Bt(u, d, m, y, E) {
      for (var x, H, K, J, Z, rA, UA, TA = u.length, EA = de(d), ie = [], Ae = 0; Ae < TA; Ae++)
        if (H = u[Ae], H || H === 0)
          if (o.type(H) === "object")
            o.merge(ie, H.nodeType ? [H] : H);
          else if (!Ut.test(H))
            ie.push(d.createTextNode(H));
          else {
            for (J = J || EA.appendChild(d.createElement("div")), Z = (YA.exec(H) || ["", ""])[1].toLowerCase(), UA = De[Z] || De._default, J.innerHTML = UA[1] + o.htmlPrefilter(H) + UA[2], x = UA[0]; x--; )
              J = J.lastChild;
            if (!p.leadingWhitespace && xe.test(H) && ie.push(d.createTextNode(xe.exec(H)[0])), !p.tbody)
              for (H = Z === "table" && !Nt.test(H) ? J.firstChild : (
                // String was a bare <thead> or <tfoot>
                UA[1] === "<table>" && !Nt.test(H) ? J : 0
              ), x = H && H.childNodes.length; x--; )
                o.nodeName(rA = H.childNodes[x], "tbody") && !rA.childNodes.length && H.removeChild(rA);
            for (o.merge(ie, J.childNodes), J.textContent = ""; J.firstChild; )
              J.removeChild(J.firstChild);
            J = EA.lastChild;
          }
      for (J && EA.removeChild(J), p.appendChecked || o.grep(fe(ie, "input"), Et), Ae = 0; H = ie[Ae++]; ) {
        if (y && o.inArray(H, y) > -1) {
          E && E.push(H);
          continue;
        }
        if (K = o.contains(H.ownerDocument, H), J = fe(EA.appendChild(H), "script"), K && Ot(J), m)
          for (x = 0; H = J[x++]; )
            ue.test(H.type || "") && m.push(H);
      }
      return J = null, EA;
    }
    (function() {
      var u, d, m = i.createElement("div");
      for (u in { submit: !0, change: !0, focusin: !0 })
        d = "on" + u, (p[u] = d in e) || (m.setAttribute(d, "t"), p[u] = m.attributes[d].expando === !1);
      m = null;
    })();
    var ln = /^(?:input|select|textarea)$/i, pr = /^key/, Fi = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Vr = /^(?:focusinfocus|focusoutblur)$/, Wr = /^([^.]*)(?:\.(.+)|)/;
    function gA() {
      return !0;
    }
    function PA() {
      return !1;
    }
    function qA() {
      try {
        return i.activeElement;
      } catch {
      }
    }
    function Ce(u, d, m, y, E, x) {
      var H, K;
      if (typeof d == "object") {
        typeof m != "string" && (y = y || m, m = void 0);
        for (K in d)
          Ce(u, K, m, y, d[K], x);
        return u;
      }
      if (y == null && E == null ? (E = m, y = m = void 0) : E == null && (typeof m == "string" ? (E = y, y = void 0) : (E = y, y = m, m = void 0)), E === !1)
        E = PA;
      else if (!E)
        return u;
      return x === 1 && (H = E, E = function(J) {
        return o().off(J), H.apply(this, arguments);
      }, E.guid = H.guid || (H.guid = o.guid++)), u.each(function() {
        o.event.add(this, d, E, y, m);
      });
    }
    o.event = {
      global: {},
      add: function(u, d, m, y, E) {
        var x, H, K, J, Z, rA, UA, TA, EA, ie, Ae, se = o._data(u);
        if (se) {
          for (m.handler && (J = m, m = J.handler, E = J.selector), m.guid || (m.guid = o.guid++), (H = se.events) || (H = se.events = {}), (rA = se.handle) || (rA = se.handle = function(ht) {
            return typeof o < "u" && (!ht || o.event.triggered !== ht.type) ? o.event.dispatch.apply(rA.elem, arguments) : void 0;
          }, rA.elem = u), d = (d || "").match(BA) || [""], K = d.length; K--; )
            x = Wr.exec(d[K]) || [], EA = Ae = x[1], ie = (x[2] || "").split(".").sort(), EA && (Z = o.event.special[EA] || {}, EA = (E ? Z.delegateType : Z.bindType) || EA, Z = o.event.special[EA] || {}, UA = o.extend({
              type: EA,
              origType: Ae,
              data: y,
              handler: m,
              guid: m.guid,
              selector: E,
              needsContext: E && o.expr.match.needsContext.test(E),
              namespace: ie.join(".")
            }, J), (TA = H[EA]) || (TA = H[EA] = [], TA.delegateCount = 0, (!Z.setup || Z.setup.call(u, y, ie, rA) === !1) && (u.addEventListener ? u.addEventListener(EA, rA, !1) : u.attachEvent && u.attachEvent("on" + EA, rA))), Z.add && (Z.add.call(u, UA), UA.handler.guid || (UA.handler.guid = m.guid)), E ? TA.splice(TA.delegateCount++, 0, UA) : TA.push(UA), o.event.global[EA] = !0);
          u = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(u, d, m, y, E) {
        var x, H, K, J, Z, rA, UA, TA, EA, ie, Ae, se = o.hasData(u) && o._data(u);
        if (!(!se || !(rA = se.events))) {
          for (d = (d || "").match(BA) || [""], Z = d.length; Z--; ) {
            if (K = Wr.exec(d[Z]) || [], EA = Ae = K[1], ie = (K[2] || "").split(".").sort(), !EA) {
              for (EA in rA)
                o.event.remove(u, EA + d[Z], m, y, !0);
              continue;
            }
            for (UA = o.event.special[EA] || {}, EA = (y ? UA.delegateType : UA.bindType) || EA, TA = rA[EA] || [], K = K[2] && new RegExp("(^|\\.)" + ie.join("\\.(?:.*\\.|)") + "(\\.|$)"), J = x = TA.length; x--; )
              H = TA[x], (E || Ae === H.origType) && (!m || m.guid === H.guid) && (!K || K.test(H.namespace)) && (!y || y === H.selector || y === "**" && H.selector) && (TA.splice(x, 1), H.selector && TA.delegateCount--, UA.remove && UA.remove.call(u, H));
            J && !TA.length && ((!UA.teardown || UA.teardown.call(u, ie, se.handle) === !1) && o.removeEvent(u, EA, se.handle), delete rA[EA]);
          }
          o.isEmptyObject(rA) && (delete se.handle, o._removeData(u, "events"));
        }
      },
      trigger: function(u, d, m, y) {
        var E, x, H, K, J, Z, rA, UA = [m || i], TA = B.call(u, "type") ? u.type : u, EA = B.call(u, "namespace") ? u.namespace.split(".") : [];
        if (H = Z = m = m || i, !(m.nodeType === 3 || m.nodeType === 8) && !Vr.test(TA + o.event.triggered) && (TA.indexOf(".") > -1 && (EA = TA.split("."), TA = EA.shift(), EA.sort()), x = TA.indexOf(":") < 0 && "on" + TA, u = u[o.expando] ? u : new o.Event(TA, typeof u == "object" && u), u.isTrigger = y ? 2 : 3, u.namespace = EA.join("."), u.rnamespace = u.namespace ? new RegExp("(^|\\.)" + EA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, u.result = void 0, u.target || (u.target = m), d = d == null ? [u] : o.makeArray(d, [u]), J = o.event.special[TA] || {}, !(!y && J.trigger && J.trigger.apply(m, d) === !1))) {
          if (!y && !J.noBubble && !o.isWindow(m)) {
            for (K = J.delegateType || TA, Vr.test(K + TA) || (H = H.parentNode); H; H = H.parentNode)
              UA.push(H), Z = H;
            Z === (m.ownerDocument || i) && UA.push(Z.defaultView || Z.parentWindow || e);
          }
          for (rA = 0; (H = UA[rA++]) && !u.isPropagationStopped(); )
            u.type = rA > 1 ? K : J.bindType || TA, E = (o._data(H, "events") || {})[u.type] && o._data(H, "handle"), E && E.apply(H, d), E = x && H[x], E && E.apply && Y(H) && (u.result = E.apply(H, d), u.result === !1 && u.preventDefault());
          if (u.type = TA, !y && !u.isDefaultPrevented() && (!J._default || J._default.apply(UA.pop(), d) === !1) && Y(m) && x && m[TA] && !o.isWindow(m)) {
            Z = m[x], Z && (m[x] = null), o.event.triggered = TA;
            try {
              m[TA]();
            } catch {
            }
            o.event.triggered = void 0, Z && (m[x] = Z);
          }
          return u.result;
        }
      },
      dispatch: function(u) {
        u = o.event.fix(u);
        var d, m, y, E, x, H = [], K = s.call(arguments), J = (o._data(this, "events") || {})[u.type] || [], Z = o.event.special[u.type] || {};
        if (K[0] = u, u.delegateTarget = this, !(Z.preDispatch && Z.preDispatch.call(this, u) === !1)) {
          for (H = o.event.handlers.call(this, u, J), d = 0; (E = H[d++]) && !u.isPropagationStopped(); )
            for (u.currentTarget = E.elem, m = 0; (x = E.handlers[m++]) && !u.isImmediatePropagationStopped(); )
              (!u.rnamespace || u.rnamespace.test(x.namespace)) && (u.handleObj = x, u.data = x.data, y = ((o.event.special[x.origType] || {}).handle || x.handler).apply(E.elem, K), y !== void 0 && (u.result = y) === !1 && (u.preventDefault(), u.stopPropagation()));
          return Z.postDispatch && Z.postDispatch.call(this, u), u.result;
        }
      },
      handlers: function(u, d) {
        var m, y, E, x, H = [], K = d.delegateCount, J = u.target;
        if (K && J.nodeType && (u.type !== "click" || isNaN(u.button) || u.button < 1)) {
          for (; J != this; J = J.parentNode || this)
            if (J.nodeType === 1 && (J.disabled !== !0 || u.type !== "click")) {
              for (y = [], m = 0; m < K; m++)
                x = d[m], E = x.selector + " ", y[E] === void 0 && (y[E] = x.needsContext ? o(E, this).index(J) > -1 : o.find(E, this, null, [J]).length), y[E] && y.push(x);
              y.length && H.push({ elem: J, handlers: y });
            }
        }
        return K < d.length && H.push({ elem: this, handlers: d.slice(K) }), H;
      },
      fix: function(u) {
        if (u[o.expando])
          return u;
        var d, m, y, E = u.type, x = u, H = this.fixHooks[E];
        for (H || (this.fixHooks[E] = H = Fi.test(E) ? this.mouseHooks : pr.test(E) ? this.keyHooks : {}), y = H.props ? this.props.concat(H.props) : this.props, u = new o.Event(x), d = y.length; d--; )
          m = y[d], u[m] = x[m];
        return u.target || (u.target = x.srcElement || i), u.target.nodeType === 3 && (u.target = u.target.parentNode), u.metaKey = !!u.metaKey, H.filter ? H.filter(u, x) : u;
      },
      // Includes some event props shared by KeyEvent and MouseEvent
      props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(u, d) {
          return u.which == null && (u.which = d.charCode != null ? d.charCode : d.keyCode), u;
        }
      },
      mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(u, d) {
          var m, y, E, x = d.button, H = d.fromElement;
          return u.pageX == null && d.clientX != null && (y = u.target.ownerDocument || i, E = y.documentElement, m = y.body, u.pageX = d.clientX + (E && E.scrollLeft || m && m.scrollLeft || 0) - (E && E.clientLeft || m && m.clientLeft || 0), u.pageY = d.clientY + (E && E.scrollTop || m && m.scrollTop || 0) - (E && E.clientTop || m && m.clientTop || 0)), !u.relatedTarget && H && (u.relatedTarget = H === u.target ? d.toElement : H), !u.which && x !== void 0 && (u.which = x & 1 ? 1 : x & 2 ? 3 : x & 4 ? 2 : 0), u;
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
            if (this !== qA() && this.focus)
              try {
                return this.focus(), !1;
              } catch {
              }
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            if (this === qA() && this.blur)
              return this.blur(), !1;
          },
          delegateType: "focusout"
        },
        click: {
          // For checkbox, fire native event so checked state will be right
          trigger: function() {
            if (o.nodeName(this, "input") && this.type === "checkbox" && this.click)
              return this.click(), !1;
          },
          // For cross-browser consistency, don't fire native .click() on links
          _default: function(u) {
            return o.nodeName(u.target, "a");
          }
        },
        beforeunload: {
          postDispatch: function(u) {
            u.result !== void 0 && u.originalEvent && (u.originalEvent.returnValue = u.result);
          }
        }
      },
      // Piggyback on a donor event to simulate a different one
      simulate: function(u, d, m) {
        var y = o.extend(
          new o.Event(),
          m,
          {
            type: u,
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
        o.event.trigger(y, null, d), y.isDefaultPrevented() && m.preventDefault();
      }
    }, o.removeEvent = i.removeEventListener ? function(u, d, m) {
      u.removeEventListener && u.removeEventListener(d, m);
    } : function(u, d, m) {
      var y = "on" + d;
      u.detachEvent && (typeof u[y] > "u" && (u[y] = null), u.detachEvent(y, m));
    }, o.Event = function(u, d) {
      if (!(this instanceof o.Event))
        return new o.Event(u, d);
      u && u.type ? (this.originalEvent = u, this.type = u.type, this.isDefaultPrevented = u.defaultPrevented || u.defaultPrevented === void 0 && // Support: IE < 9, Android < 4.0
      u.returnValue === !1 ? gA : PA) : this.type = u, d && o.extend(this, d), this.timeStamp = u && u.timeStamp || o.now(), this[o.expando] = !0;
    }, o.Event.prototype = {
      constructor: o.Event,
      isDefaultPrevented: PA,
      isPropagationStopped: PA,
      isImmediatePropagationStopped: PA,
      preventDefault: function() {
        var u = this.originalEvent;
        this.isDefaultPrevented = gA, u && (u.preventDefault ? u.preventDefault() : u.returnValue = !1);
      },
      stopPropagation: function() {
        var u = this.originalEvent;
        this.isPropagationStopped = gA, !(!u || this.isSimulated) && (u.stopPropagation && u.stopPropagation(), u.cancelBubble = !0);
      },
      stopImmediatePropagation: function() {
        var u = this.originalEvent;
        this.isImmediatePropagationStopped = gA, u && u.stopImmediatePropagation && u.stopImmediatePropagation(), this.stopPropagation();
      }
    }, o.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(u, d) {
      o.event.special[u] = {
        delegateType: d,
        bindType: d,
        handle: function(m) {
          var y, E = this, x = m.relatedTarget, H = m.handleObj;
          return (!x || x !== E && !o.contains(E, x)) && (m.type = H.origType, y = H.handler.apply(this, arguments), m.type = d), y;
        }
      };
    }), p.submit || (o.event.special.submit = {
      setup: function() {
        if (o.nodeName(this, "form"))
          return !1;
        o.event.add(this, "click._submit keypress._submit", function(u) {
          var d = u.target, m = o.nodeName(d, "input") || o.nodeName(d, "button") ? (
            // Support: IE <=8
            // We use jQuery.prop instead of elem.form
            // to allow fixing the IE8 delegated submit issue (gh-2332)
            // by 3rd party polyfills/workarounds.
            o.prop(d, "form")
          ) : void 0;
          m && !o._data(m, "submit") && (o.event.add(m, "submit._submit", function(y) {
            y._submitBubble = !0;
          }), o._data(m, "submit", !0));
        });
      },
      postDispatch: function(u) {
        u._submitBubble && (delete u._submitBubble, this.parentNode && !u.isTrigger && o.event.simulate("submit", this.parentNode, u));
      },
      teardown: function() {
        if (o.nodeName(this, "form"))
          return !1;
        o.event.remove(this, "._submit");
      }
    }), p.change || (o.event.special.change = {
      setup: function() {
        if (ln.test(this.nodeName))
          return (this.type === "checkbox" || this.type === "radio") && (o.event.add(this, "propertychange._change", function(u) {
            u.originalEvent.propertyName === "checked" && (this._justChanged = !0);
          }), o.event.add(this, "click._change", function(u) {
            this._justChanged && !u.isTrigger && (this._justChanged = !1), o.event.simulate("change", this, u);
          })), !1;
        o.event.add(this, "beforeactivate._change", function(u) {
          var d = u.target;
          ln.test(d.nodeName) && !o._data(d, "change") && (o.event.add(d, "change._change", function(m) {
            this.parentNode && !m.isSimulated && !m.isTrigger && o.event.simulate("change", this.parentNode, m);
          }), o._data(d, "change", !0));
        });
      },
      handle: function(u) {
        var d = u.target;
        if (this !== d || u.isSimulated || u.isTrigger || d.type !== "radio" && d.type !== "checkbox")
          return u.handleObj.handler.apply(this, arguments);
      },
      teardown: function() {
        return o.event.remove(this, "._change"), !ln.test(this.nodeName);
      }
    }), p.focusin || o.each({ focus: "focusin", blur: "focusout" }, function(u, d) {
      var m = function(y) {
        o.event.simulate(d, y.target, o.event.fix(y));
      };
      o.event.special[d] = {
        setup: function() {
          var y = this.ownerDocument || this, E = o._data(y, d);
          E || y.addEventListener(u, m, !0), o._data(y, d, (E || 0) + 1);
        },
        teardown: function() {
          var y = this.ownerDocument || this, E = o._data(y, d) - 1;
          E ? o._data(y, d, E) : (y.removeEventListener(u, m, !0), o._removeData(y, d));
        }
      };
    }), o.fn.extend({
      on: function(u, d, m, y) {
        return Ce(this, u, d, m, y);
      },
      one: function(u, d, m, y) {
        return Ce(this, u, d, m, y, 1);
      },
      off: function(u, d, m) {
        var y, E;
        if (u && u.preventDefault && u.handleObj)
          return y = u.handleObj, o(u.delegateTarget).off(
            y.namespace ? y.origType + "." + y.namespace : y.origType,
            y.selector,
            y.handler
          ), this;
        if (typeof u == "object") {
          for (E in u)
            this.off(E, d, u[E]);
          return this;
        }
        return (d === !1 || typeof d == "function") && (m = d, d = void 0), m === !1 && (m = PA), this.each(function() {
          o.event.remove(this, u, m, d);
        });
      },
      trigger: function(u, d) {
        return this.each(function() {
          o.event.trigger(u, d, this);
        });
      },
      triggerHandler: function(u, d) {
        var m = this[0];
        if (m)
          return o.event.trigger(u, d, m, !0);
      }
    });
    var Qe = / jQuery\d+="(?:null|\d+)"/g, ot = new RegExp("<(?:" + he + ")[\\s/>]", "i"), bt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, En = /<script|<style|<link/i, Ui = /checked\s*(?:[^=]|=\s*.checked.)/i, bn = /^true\/(.*)/, Ei = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Xr = de(i), cn = Xr.appendChild(i.createElement("div"));
    function bi(u, d) {
      return o.nodeName(u, "table") && o.nodeName(d.nodeType !== 11 ? d : d.firstChild, "tr") ? u.getElementsByTagName("tbody")[0] || u.appendChild(u.ownerDocument.createElement("tbody")) : u;
    }
    function qr(u) {
      return u.type = (o.find.attr(u, "type") !== null) + "/" + u.type, u;
    }
    function gr(u) {
      var d = bn.exec(u.type);
      return d ? u.type = d[1] : u.removeAttribute("type"), u;
    }
    function $s(u, d) {
      if (!(d.nodeType !== 1 || !o.hasData(u))) {
        var m, y, E, x = o._data(u), H = o._data(d, x), K = x.events;
        if (K) {
          delete H.handle, H.events = {};
          for (m in K)
            for (y = 0, E = K[m].length; y < E; y++)
              o.event.add(d, m, K[m][y]);
        }
        H.data && (H.data = o.extend({}, H.data));
      }
    }
    function fo(u, d) {
      var m, y, E;
      if (d.nodeType === 1) {
        if (m = d.nodeName.toLowerCase(), !p.noCloneEvent && d[o.expando]) {
          E = o._data(d);
          for (y in E.events)
            o.removeEvent(d, y, E.handle);
          d.removeAttribute(o.expando);
        }
        m === "script" && d.text !== u.text ? (qr(d).text = u.text, gr(d)) : m === "object" ? (d.parentNode && (d.outerHTML = u.outerHTML), p.html5Clone && u.innerHTML && !o.trim(d.innerHTML) && (d.innerHTML = u.innerHTML)) : m === "input" && DA.test(u.type) ? (d.defaultChecked = d.checked = u.checked, d.value !== u.value && (d.value = u.value)) : m === "option" ? d.defaultSelected = d.selected = u.defaultSelected : (m === "input" || m === "textarea") && (d.defaultValue = u.defaultValue);
      }
    }
    function Br(u, d, m, y) {
      d = l.apply([], d);
      var E, x, H, K, J, Z, rA = 0, UA = u.length, TA = UA - 1, EA = d[0], ie = o.isFunction(EA);
      if (ie || UA > 1 && typeof EA == "string" && !p.checkClone && Ui.test(EA))
        return u.each(function(Ae) {
          var se = u.eq(Ae);
          ie && (d[0] = EA.call(this, Ae, se.html())), Br(se, d, m, y);
        });
      if (UA && (Z = Bt(d, u[0].ownerDocument, !1, u, y), E = Z.firstChild, Z.childNodes.length === 1 && (Z = E), E || y)) {
        for (K = o.map(fe(Z, "script"), qr), H = K.length; rA < UA; rA++)
          x = Z, rA !== TA && (x = o.clone(x, !0, !0), H && o.merge(K, fe(x, "script"))), m.call(u[rA], x, rA);
        if (H)
          for (J = K[K.length - 1].ownerDocument, o.map(K, gr), rA = 0; rA < H; rA++)
            x = K[rA], ue.test(x.type || "") && !o._data(x, "globalEval") && o.contains(J, x) && (x.src ? o._evalUrl && o._evalUrl(x.src) : o.globalEval(
              (x.text || x.textContent || x.innerHTML || "").replace(Ei, "")
            ));
        Z = E = null;
      }
      return u;
    }
    function sa(u, d, m) {
      for (var y, E = d ? o.filter(d, u) : u, x = 0; (y = E[x]) != null; x++)
        !m && y.nodeType === 1 && o.cleanData(fe(y)), y.parentNode && (m && o.contains(y.ownerDocument, y) && Ot(fe(y, "script")), y.parentNode.removeChild(y));
      return u;
    }
    o.extend({
      htmlPrefilter: function(u) {
        return u.replace(bt, "<$1></$2>");
      },
      clone: function(u, d, m) {
        var y, E, x, H, K, J = o.contains(u.ownerDocument, u);
        if (p.html5Clone || o.isXMLDoc(u) || !ot.test("<" + u.nodeName + ">") ? x = u.cloneNode(!0) : (cn.innerHTML = u.outerHTML, cn.removeChild(x = cn.firstChild)), (!p.noCloneEvent || !p.noCloneChecked) && (u.nodeType === 1 || u.nodeType === 11) && !o.isXMLDoc(u))
          for (y = fe(x), K = fe(u), H = 0; (E = K[H]) != null; ++H)
            y[H] && fo(E, y[H]);
        if (d)
          if (m)
            for (K = K || fe(u), y = y || fe(x), H = 0; (E = K[H]) != null; H++)
              $s(E, y[H]);
          else
            $s(u, x);
        return y = fe(x, "script"), y.length > 0 && Ot(y, !J && fe(u, "script")), y = K = E = null, x;
      },
      cleanData: function(u, d) {
        for (var m, y, E, x, H = 0, K = o.expando, J = o.cache, Z = p.attributes, rA = o.event.special; (m = u[H]) != null; H++)
          if ((d || Y(m)) && (E = m[K], x = E && J[E], x)) {
            if (x.events)
              for (y in x.events)
                rA[y] ? o.event.remove(m, y) : o.removeEvent(m, y, x.handle);
            J[E] && (delete J[E], !Z && typeof m.removeAttribute < "u" ? m.removeAttribute(K) : m[K] = void 0, n.push(E));
          }
      }
    }), o.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: Br,
      detach: function(u) {
        return sa(this, u, !0);
      },
      remove: function(u) {
        return sa(this, u);
      },
      text: function(u) {
        return cA(this, function(d) {
          return d === void 0 ? o.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || i).createTextNode(d)
          );
        }, null, u, arguments.length);
      },
      append: function() {
        return Br(this, arguments, function(u) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = bi(this, u);
            d.appendChild(u);
          }
        });
      },
      prepend: function() {
        return Br(this, arguments, function(u) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = bi(this, u);
            d.insertBefore(u, d.firstChild);
          }
        });
      },
      before: function() {
        return Br(this, arguments, function(u) {
          this.parentNode && this.parentNode.insertBefore(u, this);
        });
      },
      after: function() {
        return Br(this, arguments, function(u) {
          this.parentNode && this.parentNode.insertBefore(u, this.nextSibling);
        });
      },
      empty: function() {
        for (var u, d = 0; (u = this[d]) != null; d++) {
          for (u.nodeType === 1 && o.cleanData(fe(u, !1)); u.firstChild; )
            u.removeChild(u.firstChild);
          u.options && o.nodeName(u, "select") && (u.options.length = 0);
        }
        return this;
      },
      clone: function(u, d) {
        return u = u ?? !1, d = d ?? u, this.map(function() {
          return o.clone(this, u, d);
        });
      },
      html: function(u) {
        return cA(this, function(d) {
          var m = this[0] || {}, y = 0, E = this.length;
          if (d === void 0)
            return m.nodeType === 1 ? m.innerHTML.replace(Qe, "") : void 0;
          if (typeof d == "string" && !En.test(d) && (p.htmlSerialize || !ot.test(d)) && (p.leadingWhitespace || !xe.test(d)) && !De[(YA.exec(d) || ["", ""])[1].toLowerCase()]) {
            d = o.htmlPrefilter(d);
            try {
              for (; y < E; y++)
                m = this[y] || {}, m.nodeType === 1 && (o.cleanData(fe(m, !1)), m.innerHTML = d);
              m = 0;
            } catch {
            }
          }
          m && this.empty().append(d);
        }, null, u, arguments.length);
      },
      replaceWith: function() {
        var u = [];
        return Br(this, arguments, function(d) {
          var m = this.parentNode;
          o.inArray(this, u) < 0 && (o.cleanData(fe(this)), m && m.replaceChild(d, this));
        }, u);
      }
    }), o.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(u, d) {
      o.fn[u] = function(m) {
        for (var y, E = 0, x = [], H = o(m), K = H.length - 1; E <= K; E++)
          y = E === K ? this : this.clone(!0), o(H[E])[d](y), f.apply(x, y.get());
        return this.pushStack(x);
      };
    });
    var _i, Gs = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function Vs(u, d) {
      var m = o(d.createElement(u)).appendTo(d.body), y = o.css(m[0], "display");
      return m.detach(), y;
    }
    function ua(u) {
      var d = i, m = Gs[u];
      return m || (m = Vs(u, d), (m === "none" || !m) && (_i = (_i || o("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (_i[0].contentWindow || _i[0].contentDocument).document, d.write(), d.close(), m = Vs(u, d), _i.detach()), Gs[u] = m), m;
    }
    var Ws = /^margin/, la = new RegExp("^(" + jA + ")(?!px)[a-z%]+$", "i"), ho = function(u, d, m, y) {
      var E, x, H = {};
      for (x in d)
        H[x] = u.style[x], u.style[x] = d[x];
      E = m.apply(u, y || []);
      for (x in d)
        u.style[x] = H[x];
      return E;
    }, Xs = i.documentElement;
    (function() {
      var u, d, m, y, E, x, H = i.createElement("div"), K = i.createElement("div");
      if (!K.style)
        return;
      K.style.cssText = "float:left;opacity:.5", p.opacity = K.style.opacity === "0.5", p.cssFloat = !!K.style.cssFloat, K.style.backgroundClip = "content-box", K.cloneNode(!0).style.backgroundClip = "", p.clearCloneStyle = K.style.backgroundClip === "content-box", H = i.createElement("div"), H.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", K.innerHTML = "", H.appendChild(K), p.boxSizing = K.style.boxSizing === "" || K.style.MozBoxSizing === "" || K.style.WebkitBoxSizing === "", o.extend(p, {
        reliableHiddenOffsets: function() {
          return u == null && J(), y;
        },
        boxSizingReliable: function() {
          return u == null && J(), m;
        },
        pixelMarginRight: function() {
          return u == null && J(), d;
        },
        pixelPosition: function() {
          return u == null && J(), u;
        },
        reliableMarginRight: function() {
          return u == null && J(), E;
        },
        reliableMarginLeft: function() {
          return u == null && J(), x;
        }
      });
      function J() {
        var Z, rA, UA = i.documentElement;
        UA.appendChild(H), K.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", u = m = x = !1, d = E = !0, e.getComputedStyle && (rA = e.getComputedStyle(K), u = (rA || {}).top !== "1%", x = (rA || {}).marginLeft === "2px", m = (rA || { width: "4px" }).width === "4px", K.style.marginRight = "50%", d = (rA || { marginRight: "4px" }).marginRight === "4px", Z = K.appendChild(i.createElement("div")), Z.style.cssText = K.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", Z.style.marginRight = Z.style.width = "0", K.style.width = "1px", E = !parseFloat((e.getComputedStyle(Z) || {}).marginRight), K.removeChild(Z)), K.style.display = "none", y = K.getClientRects().length === 0, y && (K.style.display = "", K.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", K.childNodes[0].style.borderCollapse = "separate", Z = K.getElementsByTagName("td"), Z[0].style.cssText = "margin:0;border:0;padding:0;display:none", y = Z[0].offsetHeight === 0, y && (Z[0].style.display = "", Z[1].style.display = "none", y = Z[0].offsetHeight === 0)), UA.removeChild(H);
      }
    })();
    var zn, Jn, $c = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (zn = function(u) {
      var d = u.ownerDocument.defaultView;
      return (!d || !d.opener) && (d = e), d.getComputedStyle(u);
    }, Jn = function(u, d, m) {
      var y, E, x, H, K = u.style;
      return m = m || zn(u), H = m ? m.getPropertyValue(d) || m[d] : void 0, (H === "" || H === void 0) && !o.contains(u.ownerDocument, u) && (H = o.style(u, d)), m && !p.pixelMarginRight() && la.test(H) && Ws.test(d) && (y = K.width, E = K.minWidth, x = K.maxWidth, K.minWidth = K.maxWidth = K.width = H, H = m.width, K.width = y, K.minWidth = E, K.maxWidth = x), H === void 0 ? H : H + "";
    }) : Xs.currentStyle && (zn = function(u) {
      return u.currentStyle;
    }, Jn = function(u, d, m) {
      var y, E, x, H, K = u.style;
      return m = m || zn(u), H = m ? m[d] : void 0, H == null && K && K[d] && (H = K[d]), la.test(H) && !$c.test(d) && (y = K.left, E = u.runtimeStyle, x = E && E.left, x && (E.left = u.currentStyle.left), K.left = d === "fontSize" ? "1em" : H, H = K.pixelLeft + "px", K.left = y, x && (E.left = x)), H === void 0 ? H : H + "" || "auto";
    });
    function po(u, d) {
      return {
        get: function() {
          if (u()) {
            delete this.get;
            return;
          }
          return (this.get = d).apply(this, arguments);
        }
      };
    }
    var go = /alpha\([^)]*\)/i, Gc = /opacity\s*=\s*([^)]*)/i, Vc = /^(none|table(?!-c[ea]).+)/, ca = new RegExp("^(" + jA + ")(.*)$", "i"), Wc = { position: "absolute", visibility: "hidden", display: "block" }, xi = {
      letterSpacing: "0",
      fontWeight: "400"
    }, qs = ["Webkit", "O", "Moz", "ms"], zs = i.createElement("div").style;
    function Js(u) {
      if (u in zs)
        return u;
      for (var d = u.charAt(0).toUpperCase() + u.slice(1), m = qs.length; m--; )
        if (u = qs[m] + d, u in zs)
          return u;
    }
    function Bo(u, d) {
      for (var m, y, E, x = [], H = 0, K = u.length; H < K; H++)
        y = u[H], y.style && (x[H] = o._data(y, "olddisplay"), m = y.style.display, d ? (!x[H] && m === "none" && (y.style.display = ""), y.style.display === "" && G(y) && (x[H] = o._data(y, "olddisplay", ua(y.nodeName)))) : (E = G(y), (m && m !== "none" || !E) && o._data(
          y,
          "olddisplay",
          E ? m : o.css(y, "display")
        )));
      for (H = 0; H < K; H++)
        y = u[H], y.style && (!d || y.style.display === "none" || y.style.display === "") && (y.style.display = d ? x[H] || "" : "none");
      return u;
    }
    function wo(u, d, m) {
      var y = ca.exec(d);
      return y ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, y[1] - (m || 0)) + (y[2] || "px")
      ) : d;
    }
    function mo(u, d, m, y, E) {
      for (var x = m === (y ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        d === "width" ? 1 : 0
      ), H = 0; x < 4; x += 2)
        m === "margin" && (H += o.css(u, m + X[x], !0, E)), y ? (m === "content" && (H -= o.css(u, "padding" + X[x], !0, E)), m !== "margin" && (H -= o.css(u, "border" + X[x] + "Width", !0, E))) : (H += o.css(u, "padding" + X[x], !0, E), m !== "padding" && (H += o.css(u, "border" + X[x] + "Width", !0, E)));
      return H;
    }
    function js(u, d, m) {
      var y = !0, E = d === "width" ? u.offsetWidth : u.offsetHeight, x = zn(u), H = p.boxSizing && o.css(u, "boxSizing", !1, x) === "border-box";
      if (E <= 0 || E == null) {
        if (E = Jn(u, d, x), (E < 0 || E == null) && (E = u.style[d]), la.test(E))
          return E;
        y = H && (p.boxSizingReliable() || E === u.style[d]), E = parseFloat(E) || 0;
      }
      return E + mo(
        u,
        d,
        m || (H ? "border" : "content"),
        y,
        x
      ) + "px";
    }
    o.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
        opacity: {
          get: function(u, d) {
            if (d) {
              var m = Jn(u, "opacity");
              return m === "" ? "1" : m;
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
        float: p.cssFloat ? "cssFloat" : "styleFloat"
      },
      // Get and set the style property on a DOM Node
      style: function(u, d, m, y) {
        if (!(!u || u.nodeType === 3 || u.nodeType === 8 || !u.style)) {
          var E, x, H, K = o.camelCase(d), J = u.style;
          if (d = o.cssProps[K] || (o.cssProps[K] = Js(K) || K), H = o.cssHooks[d] || o.cssHooks[K], m !== void 0) {
            if (x = typeof m, x === "string" && (E = q.exec(m)) && E[1] && (m = tA(u, d, E), x = "number"), m == null || m !== m)
              return;
            if (x === "number" && (m += E && E[3] || (o.cssNumber[K] ? "" : "px")), !p.clearCloneStyle && m === "" && d.indexOf("background") === 0 && (J[d] = "inherit"), !H || !("set" in H) || (m = H.set(u, m, y)) !== void 0)
              try {
                J[d] = m;
              } catch {
              }
          } else
            return H && "get" in H && (E = H.get(u, !1, y)) !== void 0 ? E : J[d];
        }
      },
      css: function(u, d, m, y) {
        var E, x, H, K = o.camelCase(d);
        return d = o.cssProps[K] || (o.cssProps[K] = Js(K) || K), H = o.cssHooks[d] || o.cssHooks[K], H && "get" in H && (x = H.get(u, !0, m)), x === void 0 && (x = Jn(u, d, y)), x === "normal" && d in xi && (x = xi[d]), m === "" || m ? (E = parseFloat(x), m === !0 || isFinite(E) ? E || 0 : x) : x;
      }
    }), o.each(["height", "width"], function(u, d) {
      o.cssHooks[d] = {
        get: function(m, y, E) {
          if (y)
            return Vc.test(o.css(m, "display")) && m.offsetWidth === 0 ? ho(m, Wc, function() {
              return js(m, d, E);
            }) : js(m, d, E);
        },
        set: function(m, y, E) {
          var x = E && zn(m);
          return wo(
            m,
            y,
            E ? mo(
              m,
              d,
              E,
              p.boxSizing && o.css(m, "boxSizing", !1, x) === "border-box",
              x
            ) : 0
          );
        }
      };
    }), p.opacity || (o.cssHooks.opacity = {
      get: function(u, d) {
        return Gc.test((d && u.currentStyle ? u.currentStyle.filter : u.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : d ? "1" : "";
      },
      set: function(u, d) {
        var m = u.style, y = u.currentStyle, E = o.isNumeric(d) ? "alpha(opacity=" + d * 100 + ")" : "", x = y && y.filter || m.filter || "";
        m.zoom = 1, !((d >= 1 || d === "") && o.trim(x.replace(go, "")) === "" && m.removeAttribute && (m.removeAttribute("filter"), d === "" || y && !y.filter)) && (m.filter = go.test(x) ? x.replace(go, E) : x + " " + E);
      }
    }), o.cssHooks.marginRight = po(
      p.reliableMarginRight,
      function(u, d) {
        if (d)
          return ho(
            u,
            { display: "inline-block" },
            Jn,
            [u, "marginRight"]
          );
      }
    ), o.cssHooks.marginLeft = po(
      p.reliableMarginLeft,
      function(u, d) {
        if (d)
          return (parseFloat(Jn(u, "marginLeft")) || // Support: IE<=11+
          // Running getBoundingClientRect on a disconnected node in IE throws an error
          // Support: IE8 only
          // getClientRects() errors on disconnected elems
          (o.contains(u.ownerDocument, u) ? u.getBoundingClientRect().left - ho(u, { marginLeft: 0 }, function() {
            return u.getBoundingClientRect().left;
          }) : 0)) + "px";
      }
    ), o.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(u, d) {
      o.cssHooks[u + d] = {
        expand: function(m) {
          for (var y = 0, E = {}, x = typeof m == "string" ? m.split(" ") : [m]; y < 4; y++)
            E[u + X[y] + d] = x[y] || x[y - 2] || x[0];
          return E;
        }
      }, Ws.test(u) || (o.cssHooks[u + d].set = wo);
    }), o.fn.extend({
      css: function(u, d) {
        return cA(this, function(m, y, E) {
          var x, H, K = {}, J = 0;
          if (o.isArray(y)) {
            for (x = zn(m), H = y.length; J < H; J++)
              K[y[J]] = o.css(m, y[J], !1, x);
            return K;
          }
          return E !== void 0 ? o.style(m, y, E) : o.css(m, y);
        }, u, d, arguments.length > 1);
      },
      show: function() {
        return Bo(this, !0);
      },
      hide: function() {
        return Bo(this);
      },
      toggle: function(u) {
        return typeof u == "boolean" ? u ? this.show() : this.hide() : this.each(function() {
          G(this) ? o(this).show() : o(this).hide();
        });
      }
    });
    function _t(u, d, m, y, E) {
      return new _t.prototype.init(u, d, m, y, E);
    }
    o.Tween = _t, _t.prototype = {
      constructor: _t,
      init: function(u, d, m, y, E, x) {
        this.elem = u, this.prop = m, this.easing = E || o.easing._default, this.options = d, this.start = this.now = this.cur(), this.end = y, this.unit = x || (o.cssNumber[m] ? "" : "px");
      },
      cur: function() {
        var u = _t.propHooks[this.prop];
        return u && u.get ? u.get(this) : _t.propHooks._default.get(this);
      },
      run: function(u) {
        var d, m = _t.propHooks[this.prop];
        return this.options.duration ? this.pos = d = o.easing[this.easing](
          u,
          this.options.duration * u,
          0,
          1,
          this.options.duration
        ) : this.pos = d = u, this.now = (this.end - this.start) * d + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), m && m.set ? m.set(this) : _t.propHooks._default.set(this), this;
      }
    }, _t.prototype.init.prototype = _t.prototype, _t.propHooks = {
      _default: {
        get: function(u) {
          var d;
          return u.elem.nodeType !== 1 || u.elem[u.prop] != null && u.elem.style[u.prop] == null ? u.elem[u.prop] : (d = o.css(u.elem, u.prop, ""), !d || d === "auto" ? 0 : d);
        },
        set: function(u) {
          o.fx.step[u.prop] ? o.fx.step[u.prop](u) : u.elem.nodeType === 1 && (u.elem.style[o.cssProps[u.prop]] != null || o.cssHooks[u.prop]) ? o.style(u.elem, u.prop, u.now + u.unit) : u.elem[u.prop] = u.now;
        }
      }
    }, _t.propHooks.scrollTop = _t.propHooks.scrollLeft = {
      set: function(u) {
        u.elem.nodeType && u.elem.parentNode && (u.elem[u.prop] = u.now);
      }
    }, o.easing = {
      linear: function(u) {
        return u;
      },
      swing: function(u) {
        return 0.5 - Math.cos(u * Math.PI) / 2;
      },
      _default: "swing"
    }, o.fx = _t.prototype.init, o.fx.step = {};
    var zr, fa, Ys = /^(?:toggle|show|hide)$/, Zs = /queueHooks$/;
    function vo() {
      return e.setTimeout(function() {
        zr = void 0;
      }), zr = o.now();
    }
    function Jr(u, d) {
      var m, y = { height: u }, E = 0;
      for (d = d ? 1 : 0; E < 4; E += 2 - d)
        m = X[E], y["margin" + m] = y["padding" + m] = u;
      return d && (y.opacity = y.width = u), y;
    }
    function Au(u, d, m) {
      for (var y, E = (Vt.tweeners[d] || []).concat(Vt.tweeners["*"]), x = 0, H = E.length; x < H; x++)
        if (y = E[x].call(m, d, u))
          return y;
    }
    function eu(u, d, m) {
      var y, E, x, H, K, J, Z, rA, UA = this, TA = {}, EA = u.style, ie = u.nodeType && G(u), Ae = o._data(u, "fxshow");
      m.queue || (K = o._queueHooks(u, "fx"), K.unqueued == null && (K.unqueued = 0, J = K.empty.fire, K.empty.fire = function() {
        K.unqueued || J();
      }), K.unqueued++, UA.always(function() {
        UA.always(function() {
          K.unqueued--, o.queue(u, "fx").length || K.empty.fire();
        });
      })), u.nodeType === 1 && ("height" in d || "width" in d) && (m.overflow = [EA.overflow, EA.overflowX, EA.overflowY], Z = o.css(u, "display"), rA = Z === "none" ? o._data(u, "olddisplay") || ua(u.nodeName) : Z, rA === "inline" && o.css(u, "float") === "none" && (!p.inlineBlockNeedsLayout || ua(u.nodeName) === "inline" ? EA.display = "inline-block" : EA.zoom = 1)), m.overflow && (EA.overflow = "hidden", p.shrinkWrapBlocks() || UA.always(function() {
        EA.overflow = m.overflow[0], EA.overflowX = m.overflow[1], EA.overflowY = m.overflow[2];
      }));
      for (y in d)
        if (E = d[y], Ys.exec(E)) {
          if (delete d[y], x = x || E === "toggle", E === (ie ? "hide" : "show"))
            if (E === "show" && Ae && Ae[y] !== void 0)
              ie = !0;
            else
              continue;
          TA[y] = Ae && Ae[y] || o.style(u, y);
        } else
          Z = void 0;
      if (o.isEmptyObject(TA))
        (Z === "none" ? ua(u.nodeName) : Z) === "inline" && (EA.display = Z);
      else {
        Ae ? "hidden" in Ae && (ie = Ae.hidden) : Ae = o._data(u, "fxshow", {}), x && (Ae.hidden = !ie), ie ? o(u).show() : UA.done(function() {
          o(u).hide();
        }), UA.done(function() {
          var se;
          o._removeData(u, "fxshow");
          for (se in TA)
            o.style(u, se, TA[se]);
        });
        for (y in TA)
          H = Au(ie ? Ae[y] : 0, y, UA), y in Ae || (Ae[y] = H.start, ie && (H.end = H.start, H.start = y === "width" || y === "height" ? 1 : 0));
      }
    }
    function ha(u, d) {
      var m, y, E, x, H;
      for (m in u)
        if (y = o.camelCase(m), E = d[y], x = u[m], o.isArray(x) && (E = x[1], x = u[m] = x[0]), m !== y && (u[y] = x, delete u[m]), H = o.cssHooks[y], H && "expand" in H) {
          x = H.expand(x), delete u[y];
          for (m in x)
            m in u || (u[m] = x[m], d[m] = E);
        } else
          d[y] = E;
    }
    function Vt(u, d, m) {
      var y, E, x = 0, H = Vt.prefilters.length, K = o.Deferred().always(function() {
        delete J.elem;
      }), J = function() {
        if (E)
          return !1;
        for (var UA = zr || vo(), TA = Math.max(0, Z.startTime + Z.duration - UA), EA = TA / Z.duration || 0, ie = 1 - EA, Ae = 0, se = Z.tweens.length; Ae < se; Ae++)
          Z.tweens[Ae].run(ie);
        return K.notifyWith(u, [Z, ie, TA]), ie < 1 && se ? TA : (K.resolveWith(u, [Z]), !1);
      }, Z = K.promise({
        elem: u,
        props: o.extend({}, d),
        opts: o.extend(!0, {
          specialEasing: {},
          easing: o.easing._default
        }, m),
        originalProperties: d,
        originalOptions: m,
        startTime: zr || vo(),
        duration: m.duration,
        tweens: [],
        createTween: function(UA, TA) {
          var EA = o.Tween(
            u,
            Z.opts,
            UA,
            TA,
            Z.opts.specialEasing[UA] || Z.opts.easing
          );
          return Z.tweens.push(EA), EA;
        },
        stop: function(UA) {
          var TA = 0, EA = UA ? Z.tweens.length : 0;
          if (E)
            return this;
          for (E = !0; TA < EA; TA++)
            Z.tweens[TA].run(1);
          return UA ? (K.notifyWith(u, [Z, 1, 0]), K.resolveWith(u, [Z, UA])) : K.rejectWith(u, [Z, UA]), this;
        }
      }), rA = Z.props;
      for (ha(rA, Z.opts.specialEasing); x < H; x++)
        if (y = Vt.prefilters[x].call(Z, u, rA, Z.opts), y)
          return o.isFunction(y.stop) && (o._queueHooks(Z.elem, Z.opts.queue).stop = o.proxy(y.stop, y)), y;
      return o.map(rA, Au, Z), o.isFunction(Z.opts.start) && Z.opts.start.call(u, Z), o.fx.timer(
        o.extend(J, {
          elem: u,
          anim: Z,
          queue: Z.opts.queue
        })
      ), Z.progress(Z.opts.progress).done(Z.opts.done, Z.opts.complete).fail(Z.opts.fail).always(Z.opts.always);
    }
    o.Animation = o.extend(Vt, {
      tweeners: {
        "*": [function(u, d) {
          var m = this.createTween(u, d);
          return tA(m.elem, u, q.exec(d), m), m;
        }]
      },
      tweener: function(u, d) {
        o.isFunction(u) ? (d = u, u = ["*"]) : u = u.match(BA);
        for (var m, y = 0, E = u.length; y < E; y++)
          m = u[y], Vt.tweeners[m] = Vt.tweeners[m] || [], Vt.tweeners[m].unshift(d);
      },
      prefilters: [eu],
      prefilter: function(u, d) {
        d ? Vt.prefilters.unshift(u) : Vt.prefilters.push(u);
      }
    }), o.speed = function(u, d, m) {
      var y = u && typeof u == "object" ? o.extend({}, u) : {
        complete: m || !m && d || o.isFunction(u) && u,
        duration: u,
        easing: m && d || d && !o.isFunction(d) && d
      };
      return y.duration = o.fx.off ? 0 : typeof y.duration == "number" ? y.duration : y.duration in o.fx.speeds ? o.fx.speeds[y.duration] : o.fx.speeds._default, (y.queue == null || y.queue === !0) && (y.queue = "fx"), y.old = y.complete, y.complete = function() {
        o.isFunction(y.old) && y.old.call(this), y.queue && o.dequeue(this, y.queue);
      }, y;
    }, o.fn.extend({
      fadeTo: function(u, d, m, y) {
        return this.filter(G).css("opacity", 0).show().end().animate({ opacity: d }, u, m, y);
      },
      animate: function(u, d, m, y) {
        var E = o.isEmptyObject(u), x = o.speed(d, m, y), H = function() {
          var K = Vt(this, o.extend({}, u), x);
          (E || o._data(this, "finish")) && K.stop(!0);
        };
        return H.finish = H, E || x.queue === !1 ? this.each(H) : this.queue(x.queue, H);
      },
      stop: function(u, d, m) {
        var y = function(E) {
          var x = E.stop;
          delete E.stop, x(m);
        };
        return typeof u != "string" && (m = d, d = u, u = void 0), d && u !== !1 && this.queue(u || "fx", []), this.each(function() {
          var E = !0, x = u != null && u + "queueHooks", H = o.timers, K = o._data(this);
          if (x)
            K[x] && K[x].stop && y(K[x]);
          else
            for (x in K)
              K[x] && K[x].stop && Zs.test(x) && y(K[x]);
          for (x = H.length; x--; )
            H[x].elem === this && (u == null || H[x].queue === u) && (H[x].anim.stop(m), E = !1, H.splice(x, 1));
          (E || !m) && o.dequeue(this, u);
        });
      },
      finish: function(u) {
        return u !== !1 && (u = u || "fx"), this.each(function() {
          var d, m = o._data(this), y = m[u + "queue"], E = m[u + "queueHooks"], x = o.timers, H = y ? y.length : 0;
          for (m.finish = !0, o.queue(this, u, []), E && E.stop && E.stop.call(this, !0), d = x.length; d--; )
            x[d].elem === this && x[d].queue === u && (x[d].anim.stop(!0), x.splice(d, 1));
          for (d = 0; d < H; d++)
            y[d] && y[d].finish && y[d].finish.call(this);
          delete m.finish;
        });
      }
    }), o.each(["toggle", "show", "hide"], function(u, d) {
      var m = o.fn[d];
      o.fn[d] = function(y, E, x) {
        return y == null || typeof y == "boolean" ? m.apply(this, arguments) : this.animate(Jr(d, !0), y, E, x);
      };
    }), o.each({
      slideDown: Jr("show"),
      slideUp: Jr("hide"),
      slideToggle: Jr("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(u, d) {
      o.fn[u] = function(m, y, E) {
        return this.animate(d, m, y, E);
      };
    }), o.timers = [], o.fx.tick = function() {
      var u, d = o.timers, m = 0;
      for (zr = o.now(); m < d.length; m++)
        u = d[m], !u() && d[m] === u && d.splice(m--, 1);
      d.length || o.fx.stop(), zr = void 0;
    }, o.fx.timer = function(u) {
      o.timers.push(u), u() ? o.fx.start() : o.timers.pop();
    }, o.fx.interval = 13, o.fx.start = function() {
      fa || (fa = e.setInterval(o.fx.tick, o.fx.interval));
    }, o.fx.stop = function() {
      e.clearInterval(fa), fa = null;
    }, o.fx.speeds = {
      slow: 600,
      fast: 200,
      // Default speed
      _default: 400
    }, o.fn.delay = function(u, d) {
      return u = o.fx && o.fx.speeds[u] || u, d = d || "fx", this.queue(d, function(m, y) {
        var E = e.setTimeout(m, u);
        y.stop = function() {
          e.clearTimeout(E);
        };
      });
    }, function() {
      var u, d = i.createElement("input"), m = i.createElement("div"), y = i.createElement("select"), E = y.appendChild(i.createElement("option"));
      m = i.createElement("div"), m.setAttribute("className", "t"), m.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", u = m.getElementsByTagName("a")[0], d.setAttribute("type", "checkbox"), m.appendChild(d), u = m.getElementsByTagName("a")[0], u.style.cssText = "top:1px", p.getSetAttribute = m.className !== "t", p.style = /top/.test(u.getAttribute("style")), p.hrefNormalized = u.getAttribute("href") === "/a", p.checkOn = !!d.value, p.optSelected = E.selected, p.enctype = !!i.createElement("form").enctype, y.disabled = !0, p.optDisabled = !E.disabled, d = i.createElement("input"), d.setAttribute("value", ""), p.input = d.getAttribute("value") === "", d.value = "t", d.setAttribute("type", "radio"), p.radioValue = d.value === "t";
    }();
    var Xc = /\r/g, tu = /[\x20\t\r\n\f]+/g;
    o.fn.extend({
      val: function(u) {
        var d, m, y, E = this[0];
        return arguments.length ? (y = o.isFunction(u), this.each(function(x) {
          var H;
          this.nodeType === 1 && (y ? H = u.call(this, x, o(this).val()) : H = u, H == null ? H = "" : typeof H == "number" ? H += "" : o.isArray(H) && (H = o.map(H, function(K) {
            return K == null ? "" : K + "";
          })), d = o.valHooks[this.type] || o.valHooks[this.nodeName.toLowerCase()], (!d || !("set" in d) || d.set(this, H, "value") === void 0) && (this.value = H));
        })) : E ? (d = o.valHooks[E.type] || o.valHooks[E.nodeName.toLowerCase()], d && "get" in d && (m = d.get(E, "value")) !== void 0 ? m : (m = E.value, typeof m == "string" ? (
          // handle most common string cases
          m.replace(Xc, "")
        ) : (
          // handle cases where value is null/undef or number
          m ?? ""
        ))) : void 0;
      }
    }), o.extend({
      valHooks: {
        option: {
          get: function(u) {
            var d = o.find.attr(u, "value");
            return d ?? // Support: IE10-11+
            // option.text throws exceptions (#14686, #14858)
            // Strip and collapse whitespace
            // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
            o.trim(o.text(u)).replace(tu, " ");
          }
        },
        select: {
          get: function(u) {
            for (var d, m, y = u.options, E = u.selectedIndex, x = u.type === "select-one" || E < 0, H = x ? null : [], K = x ? E + 1 : y.length, J = E < 0 ? K : x ? E : 0; J < K; J++)
              if (m = y[J], (m.selected || J === E) && // Don't return options that are disabled or in a disabled optgroup
              (p.optDisabled ? !m.disabled : m.getAttribute("disabled") === null) && (!m.parentNode.disabled || !o.nodeName(m.parentNode, "optgroup"))) {
                if (d = o(m).val(), x)
                  return d;
                H.push(d);
              }
            return H;
          },
          set: function(u, d) {
            for (var m, y, E = u.options, x = o.makeArray(d), H = E.length; H--; )
              if (y = E[H], o.inArray(o.valHooks.option.get(y), x) > -1)
                try {
                  y.selected = m = !0;
                } catch {
                  y.scrollHeight;
                }
              else
                y.selected = !1;
            return m || (u.selectedIndex = -1), E;
          }
        }
      }
    }), o.each(["radio", "checkbox"], function() {
      o.valHooks[this] = {
        set: function(u, d) {
          if (o.isArray(d))
            return u.checked = o.inArray(o(u).val(), d) > -1;
        }
      }, p.checkOn || (o.valHooks[this].get = function(u) {
        return u.getAttribute("value") === null ? "on" : u.value;
      });
    });
    var wr, da, _n = o.expr.attrHandle, pa = /^(?:checked|selected)$/i, xn = p.getSetAttribute, jr = p.input;
    o.fn.extend({
      attr: function(u, d) {
        return cA(this, o.attr, u, d, arguments.length > 1);
      },
      removeAttr: function(u) {
        return this.each(function() {
          o.removeAttr(this, u);
        });
      }
    }), o.extend({
      attr: function(u, d, m) {
        var y, E, x = u.nodeType;
        if (!(x === 3 || x === 8 || x === 2)) {
          if (typeof u.getAttribute > "u")
            return o.prop(u, d, m);
          if ((x !== 1 || !o.isXMLDoc(u)) && (d = d.toLowerCase(), E = o.attrHooks[d] || (o.expr.match.bool.test(d) ? da : wr)), m !== void 0) {
            if (m === null) {
              o.removeAttr(u, d);
              return;
            }
            return E && "set" in E && (y = E.set(u, m, d)) !== void 0 ? y : (u.setAttribute(d, m + ""), m);
          }
          return E && "get" in E && (y = E.get(u, d)) !== null ? y : (y = o.find.attr(u, d), y ?? void 0);
        }
      },
      attrHooks: {
        type: {
          set: function(u, d) {
            if (!p.radioValue && d === "radio" && o.nodeName(u, "input")) {
              var m = u.value;
              return u.setAttribute("type", d), m && (u.value = m), d;
            }
          }
        }
      },
      removeAttr: function(u, d) {
        var m, y, E = 0, x = d && d.match(BA);
        if (x && u.nodeType === 1)
          for (; m = x[E++]; )
            y = o.propFix[m] || m, o.expr.match.bool.test(m) ? jr && xn || !pa.test(m) ? u[y] = !1 : u[o.camelCase("default-" + m)] = u[y] = !1 : o.attr(u, m, ""), u.removeAttribute(xn ? m : y);
      }
    }), da = {
      set: function(u, d, m) {
        return d === !1 ? o.removeAttr(u, m) : jr && xn || !pa.test(m) ? u.setAttribute(!xn && o.propFix[m] || m, m) : u[o.camelCase("default-" + m)] = u[m] = !0, m;
      }
    }, o.each(o.expr.match.bool.source.match(/\w+/g), function(u, d) {
      var m = _n[d] || o.find.attr;
      jr && xn || !pa.test(d) ? _n[d] = function(y, E, x) {
        var H, K;
        return x || (K = _n[E], _n[E] = H, H = m(y, E, x) != null ? E.toLowerCase() : null, _n[E] = K), H;
      } : _n[d] = function(y, E, x) {
        if (!x)
          return y[o.camelCase("default-" + E)] ? E.toLowerCase() : null;
      };
    }), (!jr || !xn) && (o.attrHooks.value = {
      set: function(u, d, m) {
        if (o.nodeName(u, "input"))
          u.defaultValue = d;
        else
          return wr && wr.set(u, d, m);
      }
    }), xn || (wr = {
      set: function(u, d, m) {
        var y = u.getAttributeNode(m);
        if (y || u.setAttributeNode(
          y = u.ownerDocument.createAttribute(m)
        ), y.value = d += "", m === "value" || d === u.getAttribute(m))
          return d;
      }
    }, _n.id = _n.name = _n.coords = function(u, d, m) {
      var y;
      if (!m)
        return (y = u.getAttributeNode(d)) && y.value !== "" ? y.value : null;
    }, o.valHooks.button = {
      get: function(u, d) {
        var m = u.getAttributeNode(d);
        if (m && m.specified)
          return m.value;
      },
      set: wr.set
    }, o.attrHooks.contenteditable = {
      set: function(u, d, m) {
        wr.set(u, d === "" ? !1 : d, m);
      }
    }, o.each(["width", "height"], function(u, d) {
      o.attrHooks[d] = {
        set: function(m, y) {
          if (y === "")
            return m.setAttribute(d, "auto"), y;
        }
      };
    })), p.style || (o.attrHooks.style = {
      get: function(u) {
        return u.style.cssText || void 0;
      },
      set: function(u, d) {
        return u.style.cssText = d + "";
      }
    });
    var Yr = /^(?:input|select|textarea|button|object)$/i, nu = /^(?:a|area)$/i;
    o.fn.extend({
      prop: function(u, d) {
        return cA(this, o.prop, u, d, arguments.length > 1);
      },
      removeProp: function(u) {
        return u = o.propFix[u] || u, this.each(function() {
          try {
            this[u] = void 0, delete this[u];
          } catch {
          }
        });
      }
    }), o.extend({
      prop: function(u, d, m) {
        var y, E, x = u.nodeType;
        if (!(x === 3 || x === 8 || x === 2))
          return (x !== 1 || !o.isXMLDoc(u)) && (d = o.propFix[d] || d, E = o.propHooks[d]), m !== void 0 ? E && "set" in E && (y = E.set(u, m, d)) !== void 0 ? y : u[d] = m : E && "get" in E && (y = E.get(u, d)) !== null ? y : u[d];
      },
      propHooks: {
        tabIndex: {
          get: function(u) {
            var d = o.find.attr(u, "tabindex");
            return d ? parseInt(d, 10) : Yr.test(u.nodeName) || nu.test(u.nodeName) && u.href ? 0 : -1;
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), p.hrefNormalized || o.each(["href", "src"], function(u, d) {
      o.propHooks[d] = {
        get: function(m) {
          return m.getAttribute(d, 4);
        }
      };
    }), p.optSelected || (o.propHooks.selected = {
      get: function(u) {
        var d = u.parentNode;
        return d && (d.selectedIndex, d.parentNode && d.parentNode.selectedIndex), null;
      },
      set: function(u) {
        var d = u.parentNode;
        d && (d.selectedIndex, d.parentNode && d.parentNode.selectedIndex);
      }
    }), o.each([
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
      o.propFix[this.toLowerCase()] = this;
    }), p.enctype || (o.propFix.enctype = "encoding");
    var ga = /[\t\r\n\f]/g;
    function mr(u) {
      return o.attr(u, "class") || "";
    }
    o.fn.extend({
      addClass: function(u) {
        var d, m, y, E, x, H, K, J = 0;
        if (o.isFunction(u))
          return this.each(function(Z) {
            o(this).addClass(u.call(this, Z, mr(this)));
          });
        if (typeof u == "string" && u) {
          for (d = u.match(BA) || []; m = this[J++]; )
            if (E = mr(m), y = m.nodeType === 1 && (" " + E + " ").replace(ga, " "), y) {
              for (H = 0; x = d[H++]; )
                y.indexOf(" " + x + " ") < 0 && (y += x + " ");
              K = o.trim(y), E !== K && o.attr(m, "class", K);
            }
        }
        return this;
      },
      removeClass: function(u) {
        var d, m, y, E, x, H, K, J = 0;
        if (o.isFunction(u))
          return this.each(function(Z) {
            o(this).removeClass(u.call(this, Z, mr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof u == "string" && u) {
          for (d = u.match(BA) || []; m = this[J++]; )
            if (E = mr(m), y = m.nodeType === 1 && (" " + E + " ").replace(ga, " "), y) {
              for (H = 0; x = d[H++]; )
                for (; y.indexOf(" " + x + " ") > -1; )
                  y = y.replace(" " + x + " ", " ");
              K = o.trim(y), E !== K && o.attr(m, "class", K);
            }
        }
        return this;
      },
      toggleClass: function(u, d) {
        var m = typeof u;
        return typeof d == "boolean" && m === "string" ? d ? this.addClass(u) : this.removeClass(u) : o.isFunction(u) ? this.each(function(y) {
          o(this).toggleClass(
            u.call(this, y, mr(this), d),
            d
          );
        }) : this.each(function() {
          var y, E, x, H;
          if (m === "string")
            for (E = 0, x = o(this), H = u.match(BA) || []; y = H[E++]; )
              x.hasClass(y) ? x.removeClass(y) : x.addClass(y);
          else (u === void 0 || m === "boolean") && (y = mr(this), y && o._data(this, "__className__", y), o.attr(
            this,
            "class",
            y || u === !1 ? "" : o._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(u) {
        var d, m, y = 0;
        for (d = " " + u + " "; m = this[y++]; )
          if (m.nodeType === 1 && (" " + mr(m) + " ").replace(ga, " ").indexOf(d) > -1)
            return !0;
        return !1;
      }
    }), o.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
      function(u, d) {
        o.fn[d] = function(m, y) {
          return arguments.length > 0 ? this.on(d, null, m, y) : this.trigger(d);
        };
      }
    ), o.fn.extend({
      hover: function(u, d) {
        return this.mouseenter(u).mouseleave(d || u);
      }
    });
    var ru = e.location, Ba = o.now(), wa = /\?/, iu = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    o.parseJSON = function(u) {
      if (e.JSON && e.JSON.parse)
        return e.JSON.parse(u + "");
      var d, m = null, y = o.trim(u + "");
      return y && !o.trim(y.replace(iu, function(E, x, H, K) {
        return d && x && (m = 0), m === 0 ? E : (d = H || x, m += !K - !H, "");
      })) ? Function("return " + y)() : o.error("Invalid JSON: " + u);
    }, o.parseXML = function(u) {
      var d, m;
      if (!u || typeof u != "string")
        return null;
      try {
        e.DOMParser ? (m = new e.DOMParser(), d = m.parseFromString(u, "text/xml")) : (d = new e.ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(u));
      } catch {
        d = void 0;
      }
      return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && o.error("Invalid XML: " + u), d;
    };
    var qc = /#.*$/, au = /([?&])_=[^&]*/, zc = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, ou = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Jc = /^(?:GET|HEAD)$/, jc = /^\/\//, su = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, uu = {}, Ii = {}, lu = "*/".concat("*"), yo = ru.href, Zr = su.exec(yo.toLowerCase()) || [];
    function cu(u) {
      return function(d, m) {
        typeof d != "string" && (m = d, d = "*");
        var y, E = 0, x = d.toLowerCase().match(BA) || [];
        if (o.isFunction(m))
          for (; y = x[E++]; )
            y.charAt(0) === "+" ? (y = y.slice(1) || "*", (u[y] = u[y] || []).unshift(m)) : (u[y] = u[y] || []).push(m);
      };
    }
    function fu(u, d, m, y) {
      var E = {}, x = u === Ii;
      function H(K) {
        var J;
        return E[K] = !0, o.each(u[K] || [], function(Z, rA) {
          var UA = rA(d, m, y);
          if (typeof UA == "string" && !x && !E[UA])
            return d.dataTypes.unshift(UA), H(UA), !1;
          if (x)
            return !(J = UA);
        }), J;
      }
      return H(d.dataTypes[0]) || !E["*"] && H("*");
    }
    function Pe(u, d) {
      var m, y, E = o.ajaxSettings.flatOptions || {};
      for (y in d)
        d[y] !== void 0 && ((E[y] ? u : m || (m = {}))[y] = d[y]);
      return m && o.extend(!0, u, m), u;
    }
    function Ke(u, d, m) {
      for (var y, E, x, H, K = u.contents, J = u.dataTypes; J[0] === "*"; )
        J.shift(), E === void 0 && (E = u.mimeType || d.getResponseHeader("Content-Type"));
      if (E) {
        for (H in K)
          if (K[H] && K[H].test(E)) {
            J.unshift(H);
            break;
          }
      }
      if (J[0] in m)
        x = J[0];
      else {
        for (H in m) {
          if (!J[0] || u.converters[H + " " + J[0]]) {
            x = H;
            break;
          }
          y || (y = H);
        }
        x = x || y;
      }
      if (x)
        return x !== J[0] && J.unshift(x), m[x];
    }
    function Yc(u, d, m, y) {
      var E, x, H, K, J, Z = {}, rA = u.dataTypes.slice();
      if (rA[1])
        for (H in u.converters)
          Z[H.toLowerCase()] = u.converters[H];
      for (x = rA.shift(); x; )
        if (u.responseFields[x] && (m[u.responseFields[x]] = d), !J && y && u.dataFilter && (d = u.dataFilter(d, u.dataType)), J = x, x = rA.shift(), x) {
          if (x === "*")
            x = J;
          else if (J !== "*" && J !== x) {
            if (H = Z[J + " " + x] || Z["* " + x], !H) {
              for (E in Z)
                if (K = E.split(" "), K[1] === x && (H = Z[J + " " + K[0]] || Z["* " + K[0]], H)) {
                  H === !0 ? H = Z[E] : Z[E] !== !0 && (x = K[0], rA.unshift(K[1]));
                  break;
                }
            }
            if (H !== !0)
              if (H && u.throws)
                d = H(d);
              else
                try {
                  d = H(d);
                } catch (UA) {
                  return {
                    state: "parsererror",
                    error: H ? UA : "No conversion from " + J + " to " + x
                  };
                }
          }
        }
      return { state: "success", data: d };
    }
    o.extend({
      // Counter for holding the number of active queries
      active: 0,
      // Last-Modified header cache for next request
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: yo,
        type: "GET",
        isLocal: ou.test(Zr[1]),
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
          "*": lu,
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
          "text json": o.parseJSON,
          // Parse text as xml
          "text xml": o.parseXML
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
      ajaxSetup: function(u, d) {
        return d ? (
          // Building a settings object
          Pe(Pe(u, o.ajaxSettings), d)
        ) : (
          // Extending ajaxSettings
          Pe(o.ajaxSettings, u)
        );
      },
      ajaxPrefilter: cu(uu),
      ajaxTransport: cu(Ii),
      // Main method
      ajax: function(u, d) {
        typeof u == "object" && (d = u, u = void 0), d = d || {};
        var m, y, E, x, H, K, J, Z, rA = o.ajaxSetup({}, d), UA = rA.context || rA, TA = rA.context && (UA.nodeType || UA.jquery) ? o(UA) : o.event, EA = o.Deferred(), ie = o.Callbacks("once memory"), Ae = rA.statusCode || {}, se = {}, ht = {}, ze = 0, jn = "canceled", $A = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(le) {
            var Xe;
            if (ze === 2) {
              if (!Z)
                for (Z = {}; Xe = zc.exec(x); )
                  Z[Xe[1].toLowerCase()] = Xe[2];
              Xe = Z[le.toLowerCase()];
            }
            return Xe ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return ze === 2 ? x : null;
          },
          // Caches the header
          setRequestHeader: function(le, Xe) {
            var In = le.toLowerCase();
            return ze || (le = ht[In] = ht[In] || le, se[le] = Xe), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(le) {
            return ze || (rA.mimeType = le), this;
          },
          // Status-dependent callbacks
          statusCode: function(le) {
            var Xe;
            if (le)
              if (ze < 2)
                for (Xe in le)
                  Ae[Xe] = [Ae[Xe], le[Xe]];
              else
                $A.always(le[$A.status]);
            return this;
          },
          // Cancel the request
          abort: function(le) {
            var Xe = le || jn;
            return J && J.abort(Xe), ut(0, Xe), this;
          }
        };
        if (EA.promise($A).complete = ie.add, $A.success = $A.done, $A.error = $A.fail, rA.url = ((u || rA.url || yo) + "").replace(qc, "").replace(jc, Zr[1] + "//"), rA.type = d.method || d.type || rA.method || rA.type, rA.dataTypes = o.trim(rA.dataType || "*").toLowerCase().match(BA) || [""], rA.crossDomain == null && (m = su.exec(rA.url.toLowerCase()), rA.crossDomain = !!(m && (m[1] !== Zr[1] || m[2] !== Zr[2] || (m[3] || (m[1] === "http:" ? "80" : "443")) !== (Zr[3] || (Zr[1] === "http:" ? "80" : "443"))))), rA.data && rA.processData && typeof rA.data != "string" && (rA.data = o.param(rA.data, rA.traditional)), fu(uu, rA, d, $A), ze === 2)
          return $A;
        K = o.event && rA.global, K && o.active++ === 0 && o.event.trigger("ajaxStart"), rA.type = rA.type.toUpperCase(), rA.hasContent = !Jc.test(rA.type), E = rA.url, rA.hasContent || (rA.data && (E = rA.url += (wa.test(E) ? "&" : "?") + rA.data, delete rA.data), rA.cache === !1 && (rA.url = au.test(E) ? (
          // If there is already a '_' parameter, set its value
          E.replace(au, "$1_=" + Ba++)
        ) : (
          // Otherwise add one to the end
          E + (wa.test(E) ? "&" : "?") + "_=" + Ba++
        ))), rA.ifModified && (o.lastModified[E] && $A.setRequestHeader("If-Modified-Since", o.lastModified[E]), o.etag[E] && $A.setRequestHeader("If-None-Match", o.etag[E])), (rA.data && rA.hasContent && rA.contentType !== !1 || d.contentType) && $A.setRequestHeader("Content-Type", rA.contentType), $A.setRequestHeader(
          "Accept",
          rA.dataTypes[0] && rA.accepts[rA.dataTypes[0]] ? rA.accepts[rA.dataTypes[0]] + (rA.dataTypes[0] !== "*" ? ", " + lu + "; q=0.01" : "") : rA.accepts["*"]
        );
        for (y in rA.headers)
          $A.setRequestHeader(y, rA.headers[y]);
        if (rA.beforeSend && (rA.beforeSend.call(UA, $A, rA) === !1 || ze === 2))
          return $A.abort();
        jn = "abort";
        for (y in { success: 1, error: 1, complete: 1 })
          $A[y](rA[y]);
        if (J = fu(Ii, rA, d, $A), !J)
          ut(-1, "No Transport");
        else {
          if ($A.readyState = 1, K && TA.trigger("ajaxSend", [$A, rA]), ze === 2)
            return $A;
          rA.async && rA.timeout > 0 && (H = e.setTimeout(function() {
            $A.abort("timeout");
          }, rA.timeout));
          try {
            ze = 1, J.send(se, ut);
          } catch (le) {
            if (ze < 2)
              ut(-1, le);
            else
              throw le;
          }
        }
        function ut(le, Xe, In, va) {
          var xt, Hn, Yn, Sn, Re, It = Xe;
          ze !== 2 && (ze = 2, H && e.clearTimeout(H), J = void 0, x = va || "", $A.readyState = le > 0 ? 4 : 0, xt = le >= 200 && le < 300 || le === 304, In && (Sn = Ke(rA, $A, In)), Sn = Yc(rA, Sn, $A, xt), xt ? (rA.ifModified && (Re = $A.getResponseHeader("Last-Modified"), Re && (o.lastModified[E] = Re), Re = $A.getResponseHeader("etag"), Re && (o.etag[E] = Re)), le === 204 || rA.type === "HEAD" ? It = "nocontent" : le === 304 ? It = "notmodified" : (It = Sn.state, Hn = Sn.data, Yn = Sn.error, xt = !Yn)) : (Yn = It, (le || !It) && (It = "error", le < 0 && (le = 0))), $A.status = le, $A.statusText = (Xe || It) + "", xt ? EA.resolveWith(UA, [Hn, It, $A]) : EA.rejectWith(UA, [$A, It, Yn]), $A.statusCode(Ae), Ae = void 0, K && TA.trigger(
            xt ? "ajaxSuccess" : "ajaxError",
            [$A, rA, xt ? Hn : Yn]
          ), ie.fireWith(UA, [$A, It]), K && (TA.trigger("ajaxComplete", [$A, rA]), --o.active || o.event.trigger("ajaxStop")));
        }
        return $A;
      },
      getJSON: function(u, d, m) {
        return o.get(u, d, m, "json");
      },
      getScript: function(u, d) {
        return o.get(u, void 0, d, "script");
      }
    }), o.each(["get", "post"], function(u, d) {
      o[d] = function(m, y, E, x) {
        return o.isFunction(y) && (x = x || E, E = y, y = void 0), o.ajax(o.extend({
          url: m,
          type: d,
          dataType: x,
          data: y,
          success: E
        }, o.isPlainObject(m) && m));
      };
    }), o._evalUrl = function(u) {
      return o.ajax({
        url: u,
        // Make this explicit, since user can override this through ajaxSetup (#11264)
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        throws: !0
      });
    }, o.fn.extend({
      wrapAll: function(u) {
        if (o.isFunction(u))
          return this.each(function(m) {
            o(this).wrapAll(u.call(this, m));
          });
        if (this[0]) {
          var d = o(u, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && d.insertBefore(this[0]), d.map(function() {
            for (var m = this; m.firstChild && m.firstChild.nodeType === 1; )
              m = m.firstChild;
            return m;
          }).append(this);
        }
        return this;
      },
      wrapInner: function(u) {
        return o.isFunction(u) ? this.each(function(d) {
          o(this).wrapInner(u.call(this, d));
        }) : this.each(function() {
          var d = o(this), m = d.contents();
          m.length ? m.wrapAll(u) : d.append(u);
        });
      },
      wrap: function(u) {
        var d = o.isFunction(u);
        return this.each(function(m) {
          o(this).wrapAll(d ? u.call(this, m) : u);
        });
      },
      unwrap: function() {
        return this.parent().each(function() {
          o.nodeName(this, "body") || o(this).replaceWith(this.childNodes);
        }).end();
      }
    });
    function Zc(u) {
      return u.style && u.style.display || o.css(u, "display");
    }
    function Af(u) {
      if (!o.contains(u.ownerDocument || i, u))
        return !0;
      for (; u && u.nodeType === 1; ) {
        if (Zc(u) === "none" || u.type === "hidden")
          return !0;
        u = u.parentNode;
      }
      return !1;
    }
    o.expr.filters.hidden = function(u) {
      return p.reliableHiddenOffsets() ? u.offsetWidth <= 0 && u.offsetHeight <= 0 && !u.getClientRects().length : Af(u);
    }, o.expr.filters.visible = function(u) {
      return !o.expr.filters.hidden(u);
    };
    var ef = /%20/g, tf = /\[\]$/, hu = /\r?\n/g, du = /^(?:submit|button|image|reset|file)$/i, nf = /^(?:input|select|textarea|keygen)/i;
    function Ze(u, d, m, y) {
      var E;
      if (o.isArray(d))
        o.each(d, function(x, H) {
          m || tf.test(u) ? y(u, H) : Ze(
            u + "[" + (typeof H == "object" && H != null ? x : "") + "]",
            H,
            m,
            y
          );
        });
      else if (!m && o.type(d) === "object")
        for (E in d)
          Ze(u + "[" + E + "]", d[E], m, y);
      else
        y(u, d);
    }
    o.param = function(u, d) {
      var m, y = [], E = function(x, H) {
        H = o.isFunction(H) ? H() : H ?? "", y[y.length] = encodeURIComponent(x) + "=" + encodeURIComponent(H);
      };
      if (d === void 0 && (d = o.ajaxSettings && o.ajaxSettings.traditional), o.isArray(u) || u.jquery && !o.isPlainObject(u))
        o.each(u, function() {
          E(this.name, this.value);
        });
      else
        for (m in u)
          Ze(m, u[m], d, E);
      return y.join("&").replace(ef, "+");
    }, o.fn.extend({
      serialize: function() {
        return o.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var u = o.prop(this, "elements");
          return u ? o.makeArray(u) : this;
        }).filter(function() {
          var u = this.type;
          return this.name && !o(this).is(":disabled") && nf.test(this.nodeName) && !du.test(u) && (this.checked || !DA.test(u));
        }).map(function(u, d) {
          var m = o(this).val();
          return m == null ? null : o.isArray(m) ? o.map(m, function(y) {
            return { name: d.name, value: y.replace(hu, `\r
`) };
          }) : { name: d.name, value: m.replace(hu, `\r
`) };
        }).get();
      }
    }), o.ajaxSettings.xhr = e.ActiveXObject !== void 0 ? (
      // Support: IE6-IE8
      function() {
        return this.isLocal ? Mt() : i.documentMode > 8 ? Hi() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Hi() || Mt();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      Hi
    );
    var Co = 0, fn = {}, Ai = o.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
      for (var u in fn)
        fn[u](void 0, !0);
    }), p.cors = !!Ai && "withCredentials" in Ai, Ai = p.ajax = !!Ai, Ai && o.ajaxTransport(function(u) {
      if (!u.crossDomain || p.cors) {
        var d;
        return {
          send: function(m, y) {
            var E, x = u.xhr(), H = ++Co;
            if (x.open(
              u.type,
              u.url,
              u.async,
              u.username,
              u.password
            ), u.xhrFields)
              for (E in u.xhrFields)
                x[E] = u.xhrFields[E];
            u.mimeType && x.overrideMimeType && x.overrideMimeType(u.mimeType), !u.crossDomain && !m["X-Requested-With"] && (m["X-Requested-With"] = "XMLHttpRequest");
            for (E in m)
              m[E] !== void 0 && x.setRequestHeader(E, m[E] + "");
            x.send(u.hasContent && u.data || null), d = function(K, J) {
              var Z, rA, UA;
              if (d && (J || x.readyState === 4))
                if (delete fn[H], d = void 0, x.onreadystatechange = o.noop, J)
                  x.readyState !== 4 && x.abort();
                else {
                  UA = {}, Z = x.status, typeof x.responseText == "string" && (UA.text = x.responseText);
                  try {
                    rA = x.statusText;
                  } catch {
                    rA = "";
                  }
                  !Z && u.isLocal && !u.crossDomain ? Z = UA.text ? 200 : 404 : Z === 1223 && (Z = 204);
                }
              UA && y(Z, rA, UA, x.getAllResponseHeaders());
            }, u.async ? x.readyState === 4 ? e.setTimeout(d) : x.onreadystatechange = fn[H] = d : d();
          },
          abort: function() {
            d && d(void 0, !0);
          }
        };
      }
    });
    function Hi() {
      try {
        return new e.XMLHttpRequest();
      } catch {
      }
    }
    function Mt() {
      try {
        return new e.ActiveXObject("Microsoft.XMLHTTP");
      } catch {
      }
    }
    o.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function(u) {
          return o.globalEval(u), u;
        }
      }
    }), o.ajaxPrefilter("script", function(u) {
      u.cache === void 0 && (u.cache = !1), u.crossDomain && (u.type = "GET", u.global = !1);
    }), o.ajaxTransport("script", function(u) {
      if (u.crossDomain) {
        var d, m = i.head || o("head")[0] || i.documentElement;
        return {
          send: function(y, E) {
            d = i.createElement("script"), d.async = !0, u.scriptCharset && (d.charset = u.scriptCharset), d.src = u.url, d.onload = d.onreadystatechange = function(x, H) {
              (H || !d.readyState || /loaded|complete/.test(d.readyState)) && (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), d = null, H || E(200, "success"));
            }, m.insertBefore(d, m.firstChild);
          },
          abort: function() {
            d && d.onload(void 0, !0);
          }
        };
      }
    });
    var Qo = [], ma = /(=)\?(?=&|$)|\?\?/;
    o.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var u = Qo.pop() || o.expando + "_" + Ba++;
        return this[u] = !0, u;
      }
    }), o.ajaxPrefilter("json jsonp", function(u, d, m) {
      var y, E, x, H = u.jsonp !== !1 && (ma.test(u.url) ? "url" : typeof u.data == "string" && (u.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && ma.test(u.data) && "data");
      if (H || u.dataTypes[0] === "jsonp")
        return y = u.jsonpCallback = o.isFunction(u.jsonpCallback) ? u.jsonpCallback() : u.jsonpCallback, H ? u[H] = u[H].replace(ma, "$1" + y) : u.jsonp !== !1 && (u.url += (wa.test(u.url) ? "&" : "?") + u.jsonp + "=" + y), u.converters["script json"] = function() {
          return x || o.error(y + " was not called"), x[0];
        }, u.dataTypes[0] = "json", E = e[y], e[y] = function() {
          x = arguments;
        }, m.always(function() {
          E === void 0 ? o(e).removeProp(y) : e[y] = E, u[y] && (u.jsonpCallback = d.jsonpCallback, Qo.push(y)), x && o.isFunction(E) && E(x[0]), x = E = void 0;
        }), "script";
    }), o.parseHTML = function(u, d, m) {
      if (!u || typeof u != "string")
        return null;
      typeof d == "boolean" && (m = d, d = !1), d = d || i;
      var y = dA.exec(u), E = !m && [];
      return y ? [d.createElement(y[1])] : (y = Bt([u], d, E), E && E.length && o(E).remove(), o.merge([], y.childNodes));
    };
    var Fo = o.fn.load;
    o.fn.load = function(u, d, m) {
      if (typeof u != "string" && Fo)
        return Fo.apply(this, arguments);
      var y, E, x, H = this, K = u.indexOf(" ");
      return K > -1 && (y = o.trim(u.slice(K, u.length)), u = u.slice(0, K)), o.isFunction(d) ? (m = d, d = void 0) : d && typeof d == "object" && (E = "POST"), H.length > 0 && o.ajax({
        url: u,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: E || "GET",
        dataType: "html",
        data: d
      }).done(function(J) {
        x = arguments, H.html(y ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          o("<div>").append(o.parseHTML(J)).find(y)
        ) : (
          // Otherwise use the full result
          J
        ));
      }).always(m && function(J, Z) {
        H.each(function() {
          m.apply(this, x || [J.responseText, Z, J]);
        });
      }), this;
    }, o.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(u, d) {
      o.fn[d] = function(m) {
        return this.on(d, m);
      };
    }), o.expr.filters.animated = function(u) {
      return o.grep(o.timers, function(d) {
        return u === d.elem;
      }).length;
    };
    function Uo(u) {
      return o.isWindow(u) ? u : u.nodeType === 9 ? u.defaultView || u.parentWindow : !1;
    }
    o.offset = {
      setOffset: function(u, d, m) {
        var y, E, x, H, K, J, Z, rA = o.css(u, "position"), UA = o(u), TA = {};
        rA === "static" && (u.style.position = "relative"), K = UA.offset(), x = o.css(u, "top"), J = o.css(u, "left"), Z = (rA === "absolute" || rA === "fixed") && o.inArray("auto", [x, J]) > -1, Z ? (y = UA.position(), H = y.top, E = y.left) : (H = parseFloat(x) || 0, E = parseFloat(J) || 0), o.isFunction(d) && (d = d.call(u, m, o.extend({}, K))), d.top != null && (TA.top = d.top - K.top + H), d.left != null && (TA.left = d.left - K.left + E), "using" in d ? d.using.call(u, TA) : UA.css(TA);
      }
    }, o.fn.extend({
      offset: function(u) {
        if (arguments.length)
          return u === void 0 ? this : this.each(function(H) {
            o.offset.setOffset(this, u, H);
          });
        var d, m, y = { top: 0, left: 0 }, E = this[0], x = E && E.ownerDocument;
        if (x)
          return d = x.documentElement, o.contains(d, E) ? (typeof E.getBoundingClientRect < "u" && (y = E.getBoundingClientRect()), m = Uo(x), {
            top: y.top + (m.pageYOffset || d.scrollTop) - (d.clientTop || 0),
            left: y.left + (m.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
          }) : y;
      },
      position: function() {
        if (this[0]) {
          var u, d, m = { top: 0, left: 0 }, y = this[0];
          return o.css(y, "position") === "fixed" ? d = y.getBoundingClientRect() : (u = this.offsetParent(), d = this.offset(), o.nodeName(u[0], "html") || (m = u.offset()), m.top += o.css(u[0], "borderTopWidth", !0), m.left += o.css(u[0], "borderLeftWidth", !0)), {
            top: d.top - m.top - o.css(y, "marginTop", !0),
            left: d.left - m.left - o.css(y, "marginLeft", !0)
          };
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var u = this.offsetParent; u && !o.nodeName(u, "html") && o.css(u, "position") === "static"; )
            u = u.offsetParent;
          return u || Xs;
        });
      }
    }), o.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(u, d) {
      var m = /Y/.test(d);
      o.fn[u] = function(y) {
        return cA(this, function(E, x, H) {
          var K = Uo(E);
          if (H === void 0)
            return K ? d in K ? K[d] : K.document.documentElement[x] : E[x];
          K ? K.scrollTo(
            m ? o(K).scrollLeft() : H,
            m ? H : o(K).scrollTop()
          ) : E[x] = H;
        }, u, y, arguments.length, null);
      };
    }), o.each(["top", "left"], function(u, d) {
      o.cssHooks[d] = po(
        p.pixelPosition,
        function(m, y) {
          if (y)
            return y = Jn(m, d), la.test(y) ? o(m).position()[d] + "px" : y;
        }
      );
    }), o.each({ Height: "height", Width: "width" }, function(u, d) {
      o.each(
        { padding: "inner" + u, content: d, "": "outer" + u },
        function(m, y) {
          o.fn[y] = function(E, x) {
            var H = arguments.length && (m || typeof E != "boolean"), K = m || (E === !0 || x === !0 ? "margin" : "border");
            return cA(this, function(J, Z, rA) {
              var UA;
              return o.isWindow(J) ? J.document.documentElement["client" + u] : J.nodeType === 9 ? (UA = J.documentElement, Math.max(
                J.body["scroll" + u],
                UA["scroll" + u],
                J.body["offset" + u],
                UA["offset" + u],
                UA["client" + u]
              )) : rA === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                o.css(J, Z, K)
              ) : (
                // Set width or height on the element
                o.style(J, Z, rA, K)
              );
            }, d, H ? E : void 0, H, null);
          };
        }
      );
    }), o.fn.extend({
      bind: function(u, d, m) {
        return this.on(u, null, d, m);
      },
      unbind: function(u, d) {
        return this.off(u, null, d);
      },
      delegate: function(u, d, m, y) {
        return this.on(d, u, m, y);
      },
      undelegate: function(u, d, m) {
        return arguments.length === 1 ? this.off(u, "**") : this.off(d, u || "**", m);
      }
    }), o.fn.size = function() {
      return this.length;
    }, o.fn.andSelf = o.fn.addBack;
    var pu = e.jQuery, gu = e.$;
    return o.noConflict = function(u) {
      return e.$ === o && (e.$ = gu), u && e.jQuery === o && (e.jQuery = pu), o;
    }, t || (e.jQuery = e.$ = o), o;
  });
})(s0);
var mD = s0.exports;
const oe = /* @__PURE__ */ vc(mD), vD = function(A) {
  var e = {
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
    onLabelSelectFunction: function(s) {
      alert("Click" + s.number);
    },
    labelSize: 10,
    longestChromosome: 100
  }, t = Te.merge({}, e, A), n = function(s) {
    return s < 1e3 ? s : s < 1e6 ? (s / 1e3).toFixed(1) + "Kb" : (s / 1e6).toFixed(1) + "Mb";
  };
  function i(s) {
    s.each(function(l) {
      var f = XA(this).selectAll(".chromosome-label").data([l]), c = f.enter().append("g").attr("class", "chromosome-label");
      c.append("text"), t.border && c.append("rect").classed("border", !0), XA(this).selectAll(".chromosome-label").attr("transform", function(p) {
        return "translate(" + t.layout.x + "," + t.layout.y + ")";
      }), XA(this).selectAll(".chromosome-label").selectAll("text").attr("x", t.layout.width * 0.5).attr("y", t.layout.height * 0.5).style(
        "font-size",
        Math.max(14 / t.scale, t.layout.chromosomeWidth * 1.2) + "px"
      ).text(l.number).on("click", t.onLabelSelectFunction), t.border && f.select("rect").attr("width", t.layout.width).attr("height", t.layout.height), f.exit().remove();
      var h = XA(this).selectAll(".chromosome-size-label").data([l]);
      c = h.enter().append("g").attr("class", "chromosome-size-label"), c.append("text");
      var w = 10 + t.sizeLayout.y + t.sizeLayout.cellHeight * l.length / t.longestChromosome, B = 1.2 * t.labelSize / Math.min(5, t.scale) + "px";
      XA(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + t.sizeLayout.x + "," + w + ")"
      ), h = XA(this).selectAll(".chromosome-size-label").select("text").attr("x", t.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", B).text(n(l.length)), h.exit().remove();
    });
  }
  return i.longestChromosome = function(s) {
    return arguments.length ? (t.longestChromosome = s, i) : t.longestChromosome;
  }, i.layout = function(s) {
    return arguments.length ? (t.layout = s, i) : t.layout;
  }, i.sizeLayout = function(s) {
    return arguments.length ? (t.sizeLayout = s, i) : t.sizeLayout;
  }, i.scale = function(s) {
    return arguments.length ? (t.scale = s, i) : t.scale;
  }, i.onLabelSelectFunction = function(s) {
    return arguments.length ? (t.onLabelSelectFunction = s, i) : t.onLabelSelectFunction;
  }, i;
}, yD = function(A) {
  var e = {
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
    onAnnotationSelectFunction: oe.noop(),
    drawing: null
  }, t = Te.merge({}, e, A), n = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h) {
    var w = n(), B = w(h.length), p = XA(this);
    p.attr("id", "chromosome_" + h.number).attr(
      "transform",
      "translate(" + t.layout.x + "," + t.layout.y + ")"
    ), p.select("defs").html("").append("mask").attr("id", "chromosome_mask_" + h.number).append("rect").attr("class", "mask_rect"), p.select("#chromosome_mask_" + h.number).attr("width", t.layout.width).attr("height", B);
    var v = {
      width: t.layout.width,
      height: B,
      rx: Math.min(t.layout.width * 0.4, t.layout.height * 0.1),
      ry: Math.min(t.layout.width * 0.4, t.layout.height * 0.1)
    };
    p.select(".mask_rect").attr("width", v.width).attr("height", v.height).attr("rx", v.rx).attr("ry", v.ry), p.select("rect.background").attr("width", v.width).attr("height", v.height).attr("rx", v.rx).attr("ry", v.ry), p.select("rect.outline").attr("width", v.width).attr("height", v.height).attr("rx", v.rx).attr("ry", v.ry);
    var o = [], C = function() {
      var O = p.selectAll("rect.selection").data(o);
      O.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), O.attr("x", 0).attr("y", function(b) {
        return Math.min(b.start, b.end);
      }).attr("width", t.layout.width).attr("height", function(b) {
        return Math.abs(b.end - b.start);
      }), O.exit().remove();
    }, F = eL().on("start", function(O) {
      var b = $n(O, this);
      o.push({
        start: b[1],
        end: b[1]
      }), C(), O.sourceEvent.stopPropagation();
    }).on("drag", function(O) {
      o[0].end = $n(O, this)[1], C(), O.sourceEvent.stopPropagation(), O.sourceEvent.preventDefault();
    }).on("end", function(O) {
      O.sourceEvent.stopPropagation();
      var b = w.invert(o[0].start), P = w.invert(o[0].end);
      if (b > P) {
        var R = b;
        b = P, P = R;
      }
      var j = h.layout.geneBandNodes.filter(function(dA) {
        return dA.data.midpoint > b && dA.data.midpoint < P;
      });
      j.forEach(function(dA) {
        dA.data.type == "gene" ? dA.data.visible = !0 : dA.data.type == "geneslist" && dA.data.genesList.forEach(function(fA) {
          fA.visible = !0;
        });
      }), t.onAnnotationSelectFunction(), o = [], C();
    });
    p.select("rect.background").call(F), t.border && p.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
    var U = p.select(".bands_container"), S;
    t.bands == "basemap" ? S = s : t.bands == "genes" && (S = f), S(U, h), p.select(".bands_container").style("mask", "url(#chromosome_mask_" + h.number + ")");
  }, s = function(h, w) {
    var B = n(), p = h.selectAll("rect.band").data(w.bands);
    p.enter().append("rect").attr("class", "band"), p.attr("width", t.layout.width).attr("y", function(v) {
      return B(v.start);
    }).attr("height", function(v) {
      return B(v.end - v.start);
    }).attr("fill", function(v) {
      return v.color;
    }), p.exit().remove();
  }, l = function(h, w) {
    var B = w.end - w.start, p = h(B), v;
    if (p * t.scale > 2)
      v = { y: h(w.start), height: p };
    else {
      let o = Math.min(2 / t.scale, 2);
      v = { y: h(w.midpoint) - o / 2, height: o };
    }
    return v.fill = w.color, v.width = t.layout.width, v["fill-opacity"] = 0.8, v["stroke-dasharray"] = [
      0,
      t.layout.width,
      v.height,
      t.layout.width + v.height
    ], v["stroke-width"] = t.layout.width / 5, v;
  }, f = function(h, w) {
    var B = n(), p = h.selectAll("rect.band"), v = p.data(w.layout.geneBandNodes);
    v.enter().append("rect").attr("id", function(C) {
      return C.data.id;
    }).attr("class", "band geneline infobox"), v.each(function(C) {
      let F = l(B, C);
      XA(this).attr("y", F.y).attr("height", F.height).attr("fill", F.fill).attr("width", F.width).attr("fill-opacity", F["fill-opacity"]).attr("stroke-dasharray", F["stroke-dasharray"]).attr("stroke-width", F["stroke-width"]);
    }), v.classed("selected", function(C) {
      return C.data.selected;
    });
    var o = p.data(w.bands);
    o.attr("width", t.layout.width).attr("y", function(C) {
      return B(C.start);
    }).attr("height", function(C) {
      return B(C.end - C.start);
    }).attr("fill", function(C) {
      return "white";
    }), v.on("click", function(C, F) {
      if (F.data.type == "gene" && (F.data.displayed && !F.data.visible && !F.data.hidden ? (F.data.visible = !1, F.data.hidden = !0) : F.data.visible = !F.data.visible, t.onAnnotationSelectFunction()), F.data.type == "geneslist") {
        let U = F.data.genesList.some(function(S) {
          return !S.displayed;
        });
        F.data.genesList.forEach(function(S) {
          S.visible = U, S.hidden = !U;
        }), t.onAnnotationSelectFunction();
      }
    }), v.exit().remove();
  };
  function c(h) {
    h.each(function(w) {
      var B = XA(this).selectAll(".chromosome").data([w]), p = B.enter().append("g").attr("class", "chromosome");
      p.append("defs"), p.append("rect").classed("background", !0), p.append("g").classed("bands_container", !0), p.append("rect").classed("outline", !0), t.border && p.append("rect").classed("border", !0), XA(this).selectAll(".chromosome").each(i), B.exit().remove();
    });
  }
  return c.onAnnotationSelectFunction = function(h) {
    return arguments.length ? (t.onAnnotationSelectFunction = h, c) : t.onAnnotationSelectFunction;
  }, c.layout = function(h) {
    return arguments.length ? (t.layout = h, c) : t.layout;
  }, c.drawing = function(h) {
    return arguments.length ? (t.drawing = h, c) : t.drawing;
  }, c.longestChromosome = function(h) {
    return arguments.length ? (t.longestChromosome = h, c) : t.longestChromosome;
  }, c.bands = function(h) {
    return arguments.length ? (t.bands = h, c) : t.bands;
  }, c.scale = function(h) {
    return arguments.length ? (t.scale = h, c) : t.scale;
  }, c.infoBoxManager = function(h) {
    return arguments.length ? (t.infoBoxManager = h, c) : t.infoBoxManager;
  }, c;
};
var An = "top", Fn = "bottom", Un = "right", en = "left", Lp = "auto", Ms = [An, Fn, Un, en], no = "start", bs = "end", CD = "clippingParents", u0 = "viewport", qo = "popper", QD = "reference", xw = /* @__PURE__ */ Ms.reduce(function(A, e) {
  return A.concat([e + "-" + no, e + "-" + bs]);
}, []), l0 = /* @__PURE__ */ [].concat(Ms, [Lp]).reduce(function(A, e) {
  return A.concat([e, e + "-" + no, e + "-" + bs]);
}, []), FD = "beforeRead", UD = "read", ED = "afterRead", bD = "beforeMain", _D = "main", xD = "afterMain", ID = "beforeWrite", HD = "write", SD = "afterWrite", LD = [FD, UD, ED, bD, _D, xD, ID, HD, SD];
function lr(A) {
  return A ? (A.nodeName || "").toLowerCase() : null;
}
function un(A) {
  if (A == null)
    return window;
  if (A.toString() !== "[object Window]") {
    var e = A.ownerDocument;
    return e && e.defaultView || window;
  }
  return A;
}
function aa(A) {
  var e = un(A).Element;
  return A instanceof e || A instanceof Element;
}
function Qn(A) {
  var e = un(A).HTMLElement;
  return A instanceof e || A instanceof HTMLElement;
}
function Tp(A) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = un(A).ShadowRoot;
  return A instanceof e || A instanceof ShadowRoot;
}
function TD(A) {
  var e = A.state;
  Object.keys(e.elements).forEach(function(t) {
    var n = e.styles[t] || {}, i = e.attributes[t] || {}, s = e.elements[t];
    !Qn(s) || !lr(s) || (Object.assign(s.style, n), Object.keys(i).forEach(function(l) {
      var f = i[l];
      f === !1 ? s.removeAttribute(l) : s.setAttribute(l, f === !0 ? "" : f);
    }));
  });
}
function DD(A) {
  var e = A.state, t = {
    popper: {
      position: e.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(e.elements.popper.style, t.popper), e.styles = t, e.elements.arrow && Object.assign(e.elements.arrow.style, t.arrow), function() {
    Object.keys(e.elements).forEach(function(n) {
      var i = e.elements[n], s = e.attributes[n] || {}, l = Object.keys(e.styles.hasOwnProperty(n) ? e.styles[n] : t[n]), f = l.reduce(function(c, h) {
        return c[h] = "", c;
      }, {});
      !Qn(i) || !lr(i) || (Object.assign(i.style, f), Object.keys(s).forEach(function(c) {
        i.removeAttribute(c);
      }));
    });
  };
}
const c0 = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: TD,
  effect: DD,
  requires: ["computeStyles"]
};
function ur(A) {
  return A.split("-")[0];
}
var Zi = Math.max, sc = Math.min, ro = Math.round;
function nd() {
  var A = navigator.userAgentData;
  return A != null && A.brands && Array.isArray(A.brands) ? A.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function f0() {
  return !/^((?!chrome|android).)*safari/i.test(nd());
}
function io(A, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var n = A.getBoundingClientRect(), i = 1, s = 1;
  e && Qn(A) && (i = A.offsetWidth > 0 && ro(n.width) / A.offsetWidth || 1, s = A.offsetHeight > 0 && ro(n.height) / A.offsetHeight || 1);
  var l = aa(A) ? un(A) : window, f = l.visualViewport, c = !f0() && t, h = (n.left + (c && f ? f.offsetLeft : 0)) / i, w = (n.top + (c && f ? f.offsetTop : 0)) / s, B = n.width / i, p = n.height / s;
  return {
    width: B,
    height: p,
    top: w,
    right: h + B,
    bottom: w + p,
    left: h,
    x: h,
    y: w
  };
}
function Dp(A) {
  var e = io(A), t = A.offsetWidth, n = A.offsetHeight;
  return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - n) <= 1 && (n = e.height), {
    x: A.offsetLeft,
    y: A.offsetTop,
    width: t,
    height: n
  };
}
function h0(A, e) {
  var t = e.getRootNode && e.getRootNode();
  if (A.contains(e))
    return !0;
  if (t && Tp(t)) {
    var n = e;
    do {
      if (n && A.isSameNode(n))
        return !0;
      n = n.parentNode || n.host;
    } while (n);
  }
  return !1;
}
function $r(A) {
  return un(A).getComputedStyle(A);
}
function OD(A) {
  return ["table", "td", "th"].indexOf(lr(A)) >= 0;
}
function Qi(A) {
  return ((aa(A) ? A.ownerDocument : (
    // $FlowFixMe[prop-missing]
    A.document
  )) || window.document).documentElement;
}
function Sc(A) {
  return lr(A) === "html" ? A : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    A.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    A.parentNode || // DOM Element detected
    (Tp(A) ? A.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Qi(A)
  );
}
function Iw(A) {
  return !Qn(A) || // https://github.com/popperjs/popper-core/issues/837
  $r(A).position === "fixed" ? null : A.offsetParent;
}
function ND(A) {
  var e = /firefox/i.test(nd()), t = /Trident/i.test(nd());
  if (t && Qn(A)) {
    var n = $r(A);
    if (n.position === "fixed")
      return null;
  }
  var i = Sc(A);
  for (Tp(i) && (i = i.host); Qn(i) && ["html", "body"].indexOf(lr(i)) < 0; ) {
    var s = $r(i);
    if (s.transform !== "none" || s.perspective !== "none" || s.contain === "paint" || ["transform", "perspective"].indexOf(s.willChange) !== -1 || e && s.willChange === "filter" || e && s.filter && s.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function Ps(A) {
  for (var e = un(A), t = Iw(A); t && OD(t) && $r(t).position === "static"; )
    t = Iw(t);
  return t && (lr(t) === "html" || lr(t) === "body" && $r(t).position === "static") ? e : t || ND(A) || e;
}
function Op(A) {
  return ["top", "bottom"].indexOf(A) >= 0 ? "x" : "y";
}
function ds(A, e, t) {
  return Zi(A, sc(e, t));
}
function MD(A, e, t) {
  var n = ds(A, e, t);
  return n > t ? t : n;
}
function d0() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function p0(A) {
  return Object.assign({}, d0(), A);
}
function g0(A, e) {
  return e.reduce(function(t, n) {
    return t[n] = A, t;
  }, {});
}
var PD = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, p0(typeof e != "number" ? e : g0(e, Ms));
};
function KD(A) {
  var e, t = A.state, n = A.name, i = A.options, s = t.elements.arrow, l = t.modifiersData.popperOffsets, f = ur(t.placement), c = Op(f), h = [en, Un].indexOf(f) >= 0, w = h ? "height" : "width";
  if (!(!s || !l)) {
    var B = PD(i.padding, t), p = Dp(s), v = c === "y" ? An : en, o = c === "y" ? Fn : Un, C = t.rects.reference[w] + t.rects.reference[c] - l[c] - t.rects.popper[w], F = l[c] - t.rects.reference[c], U = Ps(s), S = U ? c === "y" ? U.clientHeight || 0 : U.clientWidth || 0 : 0, O = C / 2 - F / 2, b = B[v], P = S - p[w] - B[o], R = S / 2 - p[w] / 2 + O, j = ds(b, R, P), dA = c;
    t.modifiersData[n] = (e = {}, e[dA] = j, e.centerOffset = j - R, e);
  }
}
function RD(A) {
  var e = A.state, t = A.options, n = t.element, i = n === void 0 ? "[data-popper-arrow]" : n;
  i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || h0(e.elements.popper, i) && (e.elements.arrow = i));
}
const kD = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: KD,
  effect: RD,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function ao(A) {
  return A.split("-")[1];
}
var $D = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function GD(A, e) {
  var t = A.x, n = A.y, i = e.devicePixelRatio || 1;
  return {
    x: ro(t * i) / i || 0,
    y: ro(n * i) / i || 0
  };
}
function Hw(A) {
  var e, t = A.popper, n = A.popperRect, i = A.placement, s = A.variation, l = A.offsets, f = A.position, c = A.gpuAcceleration, h = A.adaptive, w = A.roundOffsets, B = A.isFixed, p = l.x, v = p === void 0 ? 0 : p, o = l.y, C = o === void 0 ? 0 : o, F = typeof w == "function" ? w({
    x: v,
    y: C
  }) : {
    x: v,
    y: C
  };
  v = F.x, C = F.y;
  var U = l.hasOwnProperty("x"), S = l.hasOwnProperty("y"), O = en, b = An, P = window;
  if (h) {
    var R = Ps(t), j = "clientHeight", dA = "clientWidth";
    if (R === un(t) && (R = Qi(t), $r(R).position !== "static" && f === "absolute" && (j = "scrollHeight", dA = "scrollWidth")), R = R, i === An || (i === en || i === Un) && s === bs) {
      b = Fn;
      var fA = B && R === P && P.visualViewport ? P.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        R[j]
      );
      C -= fA - n.height, C *= c ? 1 : -1;
    }
    if (i === en || (i === An || i === Fn) && s === bs) {
      O = Un;
      var mA = B && R === P && P.visualViewport ? P.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        R[dA]
      );
      v -= mA - n.width, v *= c ? 1 : -1;
    }
  }
  var FA = Object.assign({
    position: f
  }, h && $D), NA = w === !0 ? GD({
    x: v,
    y: C
  }, un(t)) : {
    x: v,
    y: C
  };
  if (v = NA.x, C = NA.y, c) {
    var bA;
    return Object.assign({}, FA, (bA = {}, bA[b] = S ? "0" : "", bA[O] = U ? "0" : "", bA.transform = (P.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + C + "px)" : "translate3d(" + v + "px, " + C + "px, 0)", bA));
  }
  return Object.assign({}, FA, (e = {}, e[b] = S ? C + "px" : "", e[O] = U ? v + "px" : "", e.transform = "", e));
}
function VD(A) {
  var e = A.state, t = A.options, n = t.gpuAcceleration, i = n === void 0 ? !0 : n, s = t.adaptive, l = s === void 0 ? !0 : s, f = t.roundOffsets, c = f === void 0 ? !0 : f, h = {
    placement: ur(e.placement),
    variation: ao(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, Hw(Object.assign({}, h, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: l,
    roundOffsets: c
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, Hw(Object.assign({}, h, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: c
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const WD = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: VD,
  data: {}
};
var al = {
  passive: !0
};
function XD(A) {
  var e = A.state, t = A.instance, n = A.options, i = n.scroll, s = i === void 0 ? !0 : i, l = n.resize, f = l === void 0 ? !0 : l, c = un(e.elements.popper), h = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return s && h.forEach(function(w) {
    w.addEventListener("scroll", t.update, al);
  }), f && c.addEventListener("resize", t.update, al), function() {
    s && h.forEach(function(w) {
      w.removeEventListener("scroll", t.update, al);
    }), f && c.removeEventListener("resize", t.update, al);
  };
}
const qD = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: XD,
  data: {}
};
var zD = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function kl(A) {
  return A.replace(/left|right|bottom|top/g, function(e) {
    return zD[e];
  });
}
var JD = {
  start: "end",
  end: "start"
};
function Sw(A) {
  return A.replace(/start|end/g, function(e) {
    return JD[e];
  });
}
function Np(A) {
  var e = un(A), t = e.pageXOffset, n = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: n
  };
}
function Mp(A) {
  return io(Qi(A)).left + Np(A).scrollLeft;
}
function jD(A, e) {
  var t = un(A), n = Qi(A), i = t.visualViewport, s = n.clientWidth, l = n.clientHeight, f = 0, c = 0;
  if (i) {
    s = i.width, l = i.height;
    var h = f0();
    (h || !h && e === "fixed") && (f = i.offsetLeft, c = i.offsetTop);
  }
  return {
    width: s,
    height: l,
    x: f + Mp(A),
    y: c
  };
}
function YD(A) {
  var e, t = Qi(A), n = Np(A), i = (e = A.ownerDocument) == null ? void 0 : e.body, s = Zi(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), l = Zi(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), f = -n.scrollLeft + Mp(A), c = -n.scrollTop;
  return $r(i || t).direction === "rtl" && (f += Zi(t.clientWidth, i ? i.clientWidth : 0) - s), {
    width: s,
    height: l,
    x: f,
    y: c
  };
}
function Pp(A) {
  var e = $r(A), t = e.overflow, n = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + n);
}
function B0(A) {
  return ["html", "body", "#document"].indexOf(lr(A)) >= 0 ? A.ownerDocument.body : Qn(A) && Pp(A) ? A : B0(Sc(A));
}
function ps(A, e) {
  var t;
  e === void 0 && (e = []);
  var n = B0(A), i = n === ((t = A.ownerDocument) == null ? void 0 : t.body), s = un(n), l = i ? [s].concat(s.visualViewport || [], Pp(n) ? n : []) : n, f = e.concat(l);
  return i ? f : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    f.concat(ps(Sc(l)))
  );
}
function rd(A) {
  return Object.assign({}, A, {
    left: A.x,
    top: A.y,
    right: A.x + A.width,
    bottom: A.y + A.height
  });
}
function ZD(A, e) {
  var t = io(A, !1, e === "fixed");
  return t.top = t.top + A.clientTop, t.left = t.left + A.clientLeft, t.bottom = t.top + A.clientHeight, t.right = t.left + A.clientWidth, t.width = A.clientWidth, t.height = A.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Lw(A, e, t) {
  return e === u0 ? rd(jD(A, t)) : aa(e) ? ZD(e, t) : rd(YD(Qi(A)));
}
function AO(A) {
  var e = ps(Sc(A)), t = ["absolute", "fixed"].indexOf($r(A).position) >= 0, n = t && Qn(A) ? Ps(A) : A;
  return aa(n) ? e.filter(function(i) {
    return aa(i) && h0(i, n) && lr(i) !== "body";
  }) : [];
}
function eO(A, e, t, n) {
  var i = e === "clippingParents" ? AO(A) : [].concat(e), s = [].concat(i, [t]), l = s[0], f = s.reduce(function(c, h) {
    var w = Lw(A, h, n);
    return c.top = Zi(w.top, c.top), c.right = sc(w.right, c.right), c.bottom = sc(w.bottom, c.bottom), c.left = Zi(w.left, c.left), c;
  }, Lw(A, l, n));
  return f.width = f.right - f.left, f.height = f.bottom - f.top, f.x = f.left, f.y = f.top, f;
}
function w0(A) {
  var e = A.reference, t = A.element, n = A.placement, i = n ? ur(n) : null, s = n ? ao(n) : null, l = e.x + e.width / 2 - t.width / 2, f = e.y + e.height / 2 - t.height / 2, c;
  switch (i) {
    case An:
      c = {
        x: l,
        y: e.y - t.height
      };
      break;
    case Fn:
      c = {
        x: l,
        y: e.y + e.height
      };
      break;
    case Un:
      c = {
        x: e.x + e.width,
        y: f
      };
      break;
    case en:
      c = {
        x: e.x - t.width,
        y: f
      };
      break;
    default:
      c = {
        x: e.x,
        y: e.y
      };
  }
  var h = i ? Op(i) : null;
  if (h != null) {
    var w = h === "y" ? "height" : "width";
    switch (s) {
      case no:
        c[h] = c[h] - (e[w] / 2 - t[w] / 2);
        break;
      case bs:
        c[h] = c[h] + (e[w] / 2 - t[w] / 2);
        break;
    }
  }
  return c;
}
function _s(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = n === void 0 ? A.placement : n, s = t.strategy, l = s === void 0 ? A.strategy : s, f = t.boundary, c = f === void 0 ? CD : f, h = t.rootBoundary, w = h === void 0 ? u0 : h, B = t.elementContext, p = B === void 0 ? qo : B, v = t.altBoundary, o = v === void 0 ? !1 : v, C = t.padding, F = C === void 0 ? 0 : C, U = p0(typeof F != "number" ? F : g0(F, Ms)), S = p === qo ? QD : qo, O = A.rects.popper, b = A.elements[o ? S : p], P = eO(aa(b) ? b : b.contextElement || Qi(A.elements.popper), c, w, l), R = io(A.elements.reference), j = w0({
    reference: R,
    element: O,
    strategy: "absolute",
    placement: i
  }), dA = rd(Object.assign({}, O, j)), fA = p === qo ? dA : R, mA = {
    top: P.top - fA.top + U.top,
    bottom: fA.bottom - P.bottom + U.bottom,
    left: P.left - fA.left + U.left,
    right: fA.right - P.right + U.right
  }, FA = A.modifiersData.offset;
  if (p === qo && FA) {
    var NA = FA[i];
    Object.keys(mA).forEach(function(bA) {
      var z = [Un, Fn].indexOf(bA) >= 0 ? 1 : -1, QA = [An, Fn].indexOf(bA) >= 0 ? "y" : "x";
      mA[bA] += NA[QA] * z;
    });
  }
  return mA;
}
function tO(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = t.boundary, s = t.rootBoundary, l = t.padding, f = t.flipVariations, c = t.allowedAutoPlacements, h = c === void 0 ? l0 : c, w = ao(n), B = w ? f ? xw : xw.filter(function(o) {
    return ao(o) === w;
  }) : Ms, p = B.filter(function(o) {
    return h.indexOf(o) >= 0;
  });
  p.length === 0 && (p = B);
  var v = p.reduce(function(o, C) {
    return o[C] = _s(A, {
      placement: C,
      boundary: i,
      rootBoundary: s,
      padding: l
    })[ur(C)], o;
  }, {});
  return Object.keys(v).sort(function(o, C) {
    return v[o] - v[C];
  });
}
function nO(A) {
  if (ur(A) === Lp)
    return [];
  var e = kl(A);
  return [Sw(A), e, Sw(e)];
}
function rO(A) {
  var e = A.state, t = A.options, n = A.name;
  if (!e.modifiersData[n]._skip) {
    for (var i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !0 : l, c = t.fallbackPlacements, h = t.padding, w = t.boundary, B = t.rootBoundary, p = t.altBoundary, v = t.flipVariations, o = v === void 0 ? !0 : v, C = t.allowedAutoPlacements, F = e.options.placement, U = ur(F), S = U === F, O = c || (S || !o ? [kl(F)] : nO(F)), b = [F].concat(O).reduce(function(L, k) {
      return L.concat(ur(k) === Lp ? tO(e, {
        placement: k,
        boundary: w,
        rootBoundary: B,
        padding: h,
        flipVariations: o,
        allowedAutoPlacements: C
      }) : k);
    }, []), P = e.rects.reference, R = e.rects.popper, j = /* @__PURE__ */ new Map(), dA = !0, fA = b[0], mA = 0; mA < b.length; mA++) {
      var FA = b[mA], NA = ur(FA), bA = ao(FA) === no, z = [An, Fn].indexOf(NA) >= 0, QA = z ? "width" : "height", aA = _s(e, {
        placement: FA,
        boundary: w,
        rootBoundary: B,
        altBoundary: p,
        padding: h
      }), BA = z ? bA ? Un : en : bA ? Fn : An;
      P[QA] > R[QA] && (BA = kl(BA));
      var HA = kl(BA), SA = [];
      if (s && SA.push(aA[NA] <= 0), f && SA.push(aA[BA] <= 0, aA[HA] <= 0), SA.every(function(L) {
        return L;
      })) {
        fA = FA, dA = !1;
        break;
      }
      j.set(FA, SA);
    }
    if (dA)
      for (var lA = o ? 3 : 1, D = function(k) {
        var oA = b.find(function(_A) {
          var IA = j.get(_A);
          if (IA)
            return IA.slice(0, k).every(function(JA) {
              return JA;
            });
        });
        if (oA)
          return fA = oA, "break";
      }, iA = lA; iA > 0; iA--) {
        var Y = D(iA);
        if (Y === "break") break;
      }
    e.placement !== fA && (e.modifiersData[n]._skip = !0, e.placement = fA, e.reset = !0);
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
function Tw(A, e, t) {
  return t === void 0 && (t = {
    x: 0,
    y: 0
  }), {
    top: A.top - e.height - t.y,
    right: A.right - e.width + t.x,
    bottom: A.bottom - e.height + t.y,
    left: A.left - e.width - t.x
  };
}
function Dw(A) {
  return [An, Un, Fn, en].some(function(e) {
    return A[e] >= 0;
  });
}
function aO(A) {
  var e = A.state, t = A.name, n = e.rects.reference, i = e.rects.popper, s = e.modifiersData.preventOverflow, l = _s(e, {
    elementContext: "reference"
  }), f = _s(e, {
    altBoundary: !0
  }), c = Tw(l, n), h = Tw(f, i, s), w = Dw(c), B = Dw(h);
  e.modifiersData[t] = {
    referenceClippingOffsets: c,
    popperEscapeOffsets: h,
    isReferenceHidden: w,
    hasPopperEscaped: B
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": w,
    "data-popper-escaped": B
  });
}
const oO = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: aO
};
function sO(A, e, t) {
  var n = ur(A), i = [en, An].indexOf(n) >= 0 ? -1 : 1, s = typeof t == "function" ? t(Object.assign({}, e, {
    placement: A
  })) : t, l = s[0], f = s[1];
  return l = l || 0, f = (f || 0) * i, [en, Un].indexOf(n) >= 0 ? {
    x: f,
    y: l
  } : {
    x: l,
    y: f
  };
}
function uO(A) {
  var e = A.state, t = A.options, n = A.name, i = t.offset, s = i === void 0 ? [0, 0] : i, l = l0.reduce(function(w, B) {
    return w[B] = sO(B, e.rects, s), w;
  }, {}), f = l[e.placement], c = f.x, h = f.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += c, e.modifiersData.popperOffsets.y += h), e.modifiersData[n] = l;
}
const lO = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: uO
};
function cO(A) {
  var e = A.state, t = A.name;
  e.modifiersData[t] = w0({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const fO = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: cO,
  data: {}
};
function hO(A) {
  return A === "x" ? "y" : "x";
}
function dO(A) {
  var e = A.state, t = A.options, n = A.name, i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !1 : l, c = t.boundary, h = t.rootBoundary, w = t.altBoundary, B = t.padding, p = t.tether, v = p === void 0 ? !0 : p, o = t.tetherOffset, C = o === void 0 ? 0 : o, F = _s(e, {
    boundary: c,
    rootBoundary: h,
    padding: B,
    altBoundary: w
  }), U = ur(e.placement), S = ao(e.placement), O = !S, b = Op(U), P = hO(b), R = e.modifiersData.popperOffsets, j = e.rects.reference, dA = e.rects.popper, fA = typeof C == "function" ? C(Object.assign({}, e.rects, {
    placement: e.placement
  })) : C, mA = typeof fA == "number" ? {
    mainAxis: fA,
    altAxis: fA
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, fA), FA = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, NA = {
    x: 0,
    y: 0
  };
  if (R) {
    if (s) {
      var bA, z = b === "y" ? An : en, QA = b === "y" ? Fn : Un, aA = b === "y" ? "height" : "width", BA = R[b], HA = BA + F[z], SA = BA - F[QA], lA = v ? -dA[aA] / 2 : 0, D = S === no ? j[aA] : dA[aA], iA = S === no ? -dA[aA] : -j[aA], Y = e.elements.arrow, L = v && Y ? Dp(Y) : {
        width: 0,
        height: 0
      }, k = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : d0(), oA = k[z], _A = k[QA], IA = ds(0, j[aA], L[aA]), JA = O ? j[aA] / 2 - lA - IA - oA - mA.mainAxis : D - IA - oA - mA.mainAxis, jA = O ? -j[aA] / 2 + lA + IA + _A + mA.mainAxis : iA + IA + _A + mA.mainAxis, q = e.elements.arrow && Ps(e.elements.arrow), X = q ? b === "y" ? q.clientTop || 0 : q.clientLeft || 0 : 0, G = (bA = FA == null ? void 0 : FA[b]) != null ? bA : 0, tA = BA + JA - G - X, cA = BA + jA - G, DA = ds(v ? sc(HA, tA) : HA, BA, v ? Zi(SA, cA) : SA);
      R[b] = DA, NA[b] = DA - BA;
    }
    if (f) {
      var YA, ue = b === "x" ? An : en, xe = b === "x" ? Fn : Un, he = R[P], de = P === "y" ? "height" : "width", De = he + F[ue], fe = he - F[xe], Ot = [An, en].indexOf(U) !== -1, Ut = (YA = FA == null ? void 0 : FA[P]) != null ? YA : 0, Nt = Ot ? De : he - j[de] - dA[de] - Ut + mA.altAxis, Et = Ot ? he + j[de] + dA[de] - Ut - mA.altAxis : fe, Bt = v && Ot ? MD(Nt, he, Et) : ds(v ? Nt : De, he, v ? Et : fe);
      R[P] = Bt, NA[P] = Bt - he;
    }
    e.modifiersData[n] = NA;
  }
}
const pO = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: dO,
  requiresIfExists: ["offset"]
};
function gO(A) {
  return {
    scrollLeft: A.scrollLeft,
    scrollTop: A.scrollTop
  };
}
function BO(A) {
  return A === un(A) || !Qn(A) ? Np(A) : gO(A);
}
function wO(A) {
  var e = A.getBoundingClientRect(), t = ro(e.width) / A.offsetWidth || 1, n = ro(e.height) / A.offsetHeight || 1;
  return t !== 1 || n !== 1;
}
function mO(A, e, t) {
  t === void 0 && (t = !1);
  var n = Qn(e), i = Qn(e) && wO(e), s = Qi(e), l = io(A, i, t), f = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (n || !n && !t) && ((lr(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Pp(s)) && (f = BO(e)), Qn(e) ? (c = io(e, !0), c.x += e.clientLeft, c.y += e.clientTop) : s && (c.x = Mp(s))), {
    x: l.left + f.scrollLeft - c.x,
    y: l.top + f.scrollTop - c.y,
    width: l.width,
    height: l.height
  };
}
function vO(A) {
  var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), n = [];
  A.forEach(function(s) {
    e.set(s.name, s);
  });
  function i(s) {
    t.add(s.name);
    var l = [].concat(s.requires || [], s.requiresIfExists || []);
    l.forEach(function(f) {
      if (!t.has(f)) {
        var c = e.get(f);
        c && i(c);
      }
    }), n.push(s);
  }
  return A.forEach(function(s) {
    t.has(s.name) || i(s);
  }), n;
}
function yO(A) {
  var e = vO(A);
  return LD.reduce(function(t, n) {
    return t.concat(e.filter(function(i) {
      return i.phase === n;
    }));
  }, []);
}
function CO(A) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(A());
      });
    })), e;
  };
}
function QO(A) {
  var e = A.reduce(function(t, n) {
    var i = t[n.name];
    return t[n.name] = i ? Object.assign({}, i, n, {
      options: Object.assign({}, i.options, n.options),
      data: Object.assign({}, i.data, n.data)
    }) : n, t;
  }, {});
  return Object.keys(e).map(function(t) {
    return e[t];
  });
}
var Ow = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Nw() {
  for (var A = arguments.length, e = new Array(A), t = 0; t < A; t++)
    e[t] = arguments[t];
  return !e.some(function(n) {
    return !(n && typeof n.getBoundingClientRect == "function");
  });
}
function FO(A) {
  A === void 0 && (A = {});
  var e = A, t = e.defaultModifiers, n = t === void 0 ? [] : t, i = e.defaultOptions, s = i === void 0 ? Ow : i;
  return function(f, c, h) {
    h === void 0 && (h = s);
    var w = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Ow, s),
      modifiersData: {},
      elements: {
        reference: f,
        popper: c
      },
      attributes: {},
      styles: {}
    }, B = [], p = !1, v = {
      state: w,
      setOptions: function(U) {
        var S = typeof U == "function" ? U(w.options) : U;
        C(), w.options = Object.assign({}, s, w.options, S), w.scrollParents = {
          reference: aa(f) ? ps(f) : f.contextElement ? ps(f.contextElement) : [],
          popper: ps(c)
        };
        var O = yO(QO([].concat(n, w.options.modifiers)));
        return w.orderedModifiers = O.filter(function(b) {
          return b.enabled;
        }), o(), v.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!p) {
          var U = w.elements, S = U.reference, O = U.popper;
          if (Nw(S, O)) {
            w.rects = {
              reference: mO(S, Ps(O), w.options.strategy === "fixed"),
              popper: Dp(O)
            }, w.reset = !1, w.placement = w.options.placement, w.orderedModifiers.forEach(function(mA) {
              return w.modifiersData[mA.name] = Object.assign({}, mA.data);
            });
            for (var b = 0; b < w.orderedModifiers.length; b++) {
              if (w.reset === !0) {
                w.reset = !1, b = -1;
                continue;
              }
              var P = w.orderedModifiers[b], R = P.fn, j = P.options, dA = j === void 0 ? {} : j, fA = P.name;
              typeof R == "function" && (w = R({
                state: w,
                options: dA,
                name: fA,
                instance: v
              }) || w);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: CO(function() {
        return new Promise(function(F) {
          v.forceUpdate(), F(w);
        });
      }),
      destroy: function() {
        C(), p = !0;
      }
    };
    if (!Nw(f, c))
      return v;
    v.setOptions(h).then(function(F) {
      !p && h.onFirstUpdate && h.onFirstUpdate(F);
    });
    function o() {
      w.orderedModifiers.forEach(function(F) {
        var U = F.name, S = F.options, O = S === void 0 ? {} : S, b = F.effect;
        if (typeof b == "function") {
          var P = b({
            state: w,
            name: U,
            instance: v,
            options: O
          }), R = function() {
          };
          B.push(P || R);
        }
      });
    }
    function C() {
      B.forEach(function(F) {
        return F();
      }), B = [];
    }
    return v;
  };
}
var UO = [qD, fO, WD, c0, lO, iO, pO, kD, oO], EO = /* @__PURE__ */ FO({
  defaultModifiers: UO
}), bO = "tippy-box", m0 = "tippy-content", _O = "tippy-backdrop", v0 = "tippy-arrow", y0 = "tippy-svg-arrow", Vi = {
  passive: !0,
  capture: !0
}, C0 = function() {
  return document.body;
};
function xO(A, e) {
  return {}.hasOwnProperty.call(A, e);
}
function ch(A, e, t) {
  if (Array.isArray(A)) {
    var n = A[e];
    return n ?? (Array.isArray(t) ? t[e] : t);
  }
  return A;
}
function Kp(A, e) {
  var t = {}.toString.call(A);
  return t.indexOf("[object") === 0 && t.indexOf(e + "]") > -1;
}
function Q0(A, e) {
  return typeof A == "function" ? A.apply(void 0, e) : A;
}
function Mw(A, e) {
  if (e === 0)
    return A;
  var t;
  return function(n) {
    clearTimeout(t), t = setTimeout(function() {
      A(n);
    }, e);
  };
}
function IO(A, e) {
  var t = Object.assign({}, A);
  return e.forEach(function(n) {
    delete t[n];
  }), t;
}
function HO(A) {
  return A.split(/\s+/).filter(Boolean);
}
function ka(A) {
  return [].concat(A);
}
function Pw(A, e) {
  A.indexOf(e) === -1 && A.push(e);
}
function SO(A) {
  return A.filter(function(e, t) {
    return A.indexOf(e) === t;
  });
}
function LO(A) {
  return A.split("-")[0];
}
function uc(A) {
  return [].slice.call(A);
}
function Kw(A) {
  return Object.keys(A).reduce(function(e, t) {
    return A[t] !== void 0 && (e[t] = A[t]), e;
  }, {});
}
function gs() {
  return document.createElement("div");
}
function xs(A) {
  return ["Element", "Fragment"].some(function(e) {
    return Kp(A, e);
  });
}
function TO(A) {
  return Kp(A, "NodeList");
}
function DO(A) {
  return Kp(A, "MouseEvent");
}
function OO(A) {
  return !!(A && A._tippy && A._tippy.reference === A);
}
function NO(A) {
  return xs(A) ? [A] : TO(A) ? uc(A) : Array.isArray(A) ? A : uc(document.querySelectorAll(A));
}
function fh(A, e) {
  A.forEach(function(t) {
    t && (t.style.transitionDuration = e + "ms");
  });
}
function Rw(A, e) {
  A.forEach(function(t) {
    t && t.setAttribute("data-state", e);
  });
}
function MO(A) {
  var e, t = ka(A), n = t[0];
  return n != null && (e = n.ownerDocument) != null && e.body ? n.ownerDocument : document;
}
function PO(A, e) {
  var t = e.clientX, n = e.clientY;
  return A.every(function(i) {
    var s = i.popperRect, l = i.popperState, f = i.props, c = f.interactiveBorder, h = LO(l.placement), w = l.modifiersData.offset;
    if (!w)
      return !0;
    var B = h === "bottom" ? w.top.y : 0, p = h === "top" ? w.bottom.y : 0, v = h === "right" ? w.left.x : 0, o = h === "left" ? w.right.x : 0, C = s.top - n + B > c, F = n - s.bottom - p > c, U = s.left - t + v > c, S = t - s.right - o > c;
    return C || F || U || S;
  });
}
function hh(A, e, t) {
  var n = e + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(i) {
    A[n](i, t);
  });
}
function kw(A, e) {
  for (var t = e; t; ) {
    var n;
    if (A.contains(t))
      return !0;
    t = t.getRootNode == null || (n = t.getRootNode()) == null ? void 0 : n.host;
  }
  return !1;
}
var ar = {
  isTouch: !1
}, $w = 0;
function KO() {
  ar.isTouch || (ar.isTouch = !0, window.performance && document.addEventListener("mousemove", F0));
}
function F0() {
  var A = performance.now();
  A - $w < 20 && (ar.isTouch = !1, document.removeEventListener("mousemove", F0)), $w = A;
}
function RO() {
  var A = document.activeElement;
  if (OO(A)) {
    var e = A._tippy;
    A.blur && !e.state.isVisible && A.blur();
  }
}
function kO() {
  document.addEventListener("touchstart", KO, Vi), window.addEventListener("blur", RO);
}
var $O = typeof window < "u" && typeof document < "u", GO = $O ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function La(A) {
  var e = A === "destroy" ? "n already-" : " ";
  return [A + "() was called on a" + e + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function Gw(A) {
  var e = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return A.replace(e, " ").replace(t, "").trim();
}
function VO(A) {
  return Gw(`
  %ctippy.js

  %c` + Gw(A) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function U0(A) {
  return [
    VO(A),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var Is;
process.env.NODE_ENV !== "production" && WO();
function WO() {
  Is = /* @__PURE__ */ new Set();
}
function Mr(A, e) {
  if (A && !Is.has(e)) {
    var t;
    Is.add(e), (t = console).warn.apply(t, U0(e));
  }
}
function id(A, e) {
  if (A && !Is.has(e)) {
    var t;
    Is.add(e), (t = console).error.apply(t, U0(e));
  }
}
function XO(A) {
  var e = !A, t = Object.prototype.toString.call(A) === "[object Object]" && !A.addEventListener;
  id(e, ["tippy() was passed", "`" + String(A) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), id(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var E0 = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, qO = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, sn = Object.assign({
  appendTo: C0,
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
}, E0, qO), zO = Object.keys(sn), JO = function(e) {
  process.env.NODE_ENV !== "production" && _0(e, []);
  var t = Object.keys(e);
  t.forEach(function(n) {
    sn[n] = e[n];
  });
};
function b0(A) {
  var e = A.plugins || [], t = e.reduce(function(n, i) {
    var s = i.name, l = i.defaultValue;
    if (s) {
      var f;
      n[s] = A[s] !== void 0 ? A[s] : (f = sn[s]) != null ? f : l;
    }
    return n;
  }, {});
  return Object.assign({}, A, t);
}
function jO(A, e) {
  var t = e ? Object.keys(b0(Object.assign({}, sn, {
    plugins: e
  }))) : zO, n = t.reduce(function(i, s) {
    var l = (A.getAttribute("data-tippy-" + s) || "").trim();
    if (!l)
      return i;
    if (s === "content")
      i[s] = l;
    else
      try {
        i[s] = JSON.parse(l);
      } catch {
        i[s] = l;
      }
    return i;
  }, {});
  return n;
}
function Vw(A, e) {
  var t = Object.assign({}, e, {
    content: Q0(e.content, [A])
  }, e.ignoreAttributes ? {} : jO(A, e.plugins));
  return t.aria = Object.assign({}, sn.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function _0(A, e) {
  A === void 0 && (A = {}), e === void 0 && (e = []);
  var t = Object.keys(A);
  t.forEach(function(n) {
    var i = IO(sn, Object.keys(E0)), s = !xO(i, n);
    s && (s = e.filter(function(l) {
      return l.name === n;
    }).length === 0), Mr(s, ["`" + n + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var YO = function() {
  return "innerHTML";
};
function ad(A, e) {
  A[YO()] = e;
}
function Ww(A) {
  var e = gs();
  return A === !0 ? e.className = v0 : (e.className = y0, xs(A) ? e.appendChild(A) : ad(e, A)), e;
}
function Xw(A, e) {
  xs(e.content) ? (ad(A, ""), A.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? ad(A, e.content) : A.textContent = e.content);
}
function od(A) {
  var e = A.firstElementChild, t = uc(e.children);
  return {
    box: e,
    content: t.find(function(n) {
      return n.classList.contains(m0);
    }),
    arrow: t.find(function(n) {
      return n.classList.contains(v0) || n.classList.contains(y0);
    }),
    backdrop: t.find(function(n) {
      return n.classList.contains(_O);
    })
  };
}
function x0(A) {
  var e = gs(), t = gs();
  t.className = bO, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var n = gs();
  n.className = m0, n.setAttribute("data-state", "hidden"), Xw(n, A.props), e.appendChild(t), t.appendChild(n), i(A.props, A.props);
  function i(s, l) {
    var f = od(e), c = f.box, h = f.content, w = f.arrow;
    l.theme ? c.setAttribute("data-theme", l.theme) : c.removeAttribute("data-theme"), typeof l.animation == "string" ? c.setAttribute("data-animation", l.animation) : c.removeAttribute("data-animation"), l.inertia ? c.setAttribute("data-inertia", "") : c.removeAttribute("data-inertia"), c.style.maxWidth = typeof l.maxWidth == "number" ? l.maxWidth + "px" : l.maxWidth, l.role ? c.setAttribute("role", l.role) : c.removeAttribute("role"), (s.content !== l.content || s.allowHTML !== l.allowHTML) && Xw(h, A.props), l.arrow ? w ? s.arrow !== l.arrow && (c.removeChild(w), c.appendChild(Ww(l.arrow))) : c.appendChild(Ww(l.arrow)) : w && c.removeChild(w);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
x0.$$tippy = !0;
var ZO = 1, ol = [], dh = [];
function A4(A, e) {
  var t = Vw(A, Object.assign({}, sn, b0(Kw(e)))), n, i, s, l = !1, f = !1, c = !1, h = !1, w, B, p, v = [], o = Mw(tA, t.interactiveDebounce), C, F = ZO++, U = null, S = SO(t.plugins), O = {
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
  }, b = {
    // properties
    id: F,
    reference: A,
    popper: gs(),
    popperInstance: U,
    props: t,
    state: O,
    plugins: S,
    // methods
    clearDelayTimeouts: Nt,
    setProps: Et,
    setContent: Bt,
    show: ln,
    hide: pr,
    hideWithInteractivity: Fi,
    enable: Ot,
    disable: Ut,
    unmount: Vr,
    destroy: Wr
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && id(!0, "render() function has not been supplied."), b;
  var P = t.render(b), R = P.popper, j = P.onUpdate;
  R.setAttribute("data-tippy-root", ""), R.id = "tippy-" + b.id, b.popper = R, A._tippy = b, R._tippy = b;
  var dA = S.map(function(gA) {
    return gA.fn(b);
  }), fA = A.hasAttribute("aria-expanded");
  return q(), lA(), BA(), HA("onCreate", [b]), t.showOnCreate && De(), R.addEventListener("mouseenter", function() {
    b.props.interactive && b.state.isVisible && b.clearDelayTimeouts();
  }), R.addEventListener("mouseleave", function() {
    b.props.interactive && b.props.trigger.indexOf("mouseenter") >= 0 && z().addEventListener("mousemove", o);
  }), b;
  function mA() {
    var gA = b.props.touch;
    return Array.isArray(gA) ? gA : [gA, 0];
  }
  function FA() {
    return mA()[0] === "hold";
  }
  function NA() {
    var gA;
    return !!((gA = b.props.render) != null && gA.$$tippy);
  }
  function bA() {
    return C || A;
  }
  function z() {
    var gA = bA().parentNode;
    return gA ? MO(gA) : document;
  }
  function QA() {
    return od(R);
  }
  function aA(gA) {
    return b.state.isMounted && !b.state.isVisible || ar.isTouch || w && w.type === "focus" ? 0 : ch(b.props.delay, gA ? 0 : 1, sn.delay);
  }
  function BA(gA) {
    gA === void 0 && (gA = !1), R.style.pointerEvents = b.props.interactive && !gA ? "" : "none", R.style.zIndex = "" + b.props.zIndex;
  }
  function HA(gA, PA, qA) {
    if (qA === void 0 && (qA = !0), dA.forEach(function(Qe) {
      Qe[gA] && Qe[gA].apply(Qe, PA);
    }), qA) {
      var Ce;
      (Ce = b.props)[gA].apply(Ce, PA);
    }
  }
  function SA() {
    var gA = b.props.aria;
    if (gA.content) {
      var PA = "aria-" + gA.content, qA = R.id, Ce = ka(b.props.triggerTarget || A);
      Ce.forEach(function(Qe) {
        var ot = Qe.getAttribute(PA);
        if (b.state.isVisible)
          Qe.setAttribute(PA, ot ? ot + " " + qA : qA);
        else {
          var bt = ot && ot.replace(qA, "").trim();
          bt ? Qe.setAttribute(PA, bt) : Qe.removeAttribute(PA);
        }
      });
    }
  }
  function lA() {
    if (!(fA || !b.props.aria.expanded)) {
      var gA = ka(b.props.triggerTarget || A);
      gA.forEach(function(PA) {
        b.props.interactive ? PA.setAttribute("aria-expanded", b.state.isVisible && PA === bA() ? "true" : "false") : PA.removeAttribute("aria-expanded");
      });
    }
  }
  function D() {
    z().removeEventListener("mousemove", o), ol = ol.filter(function(gA) {
      return gA !== o;
    });
  }
  function iA(gA) {
    if (!(ar.isTouch && (c || gA.type === "mousedown"))) {
      var PA = gA.composedPath && gA.composedPath()[0] || gA.target;
      if (!(b.props.interactive && kw(R, PA))) {
        if (ka(b.props.triggerTarget || A).some(function(qA) {
          return kw(qA, PA);
        })) {
          if (ar.isTouch || b.state.isVisible && b.props.trigger.indexOf("click") >= 0)
            return;
        } else
          HA("onClickOutside", [b, gA]);
        b.props.hideOnClick === !0 && (b.clearDelayTimeouts(), b.hide(), f = !0, setTimeout(function() {
          f = !1;
        }), b.state.isMounted || oA());
      }
    }
  }
  function Y() {
    c = !0;
  }
  function L() {
    c = !1;
  }
  function k() {
    var gA = z();
    gA.addEventListener("mousedown", iA, !0), gA.addEventListener("touchend", iA, Vi), gA.addEventListener("touchstart", L, Vi), gA.addEventListener("touchmove", Y, Vi);
  }
  function oA() {
    var gA = z();
    gA.removeEventListener("mousedown", iA, !0), gA.removeEventListener("touchend", iA, Vi), gA.removeEventListener("touchstart", L, Vi), gA.removeEventListener("touchmove", Y, Vi);
  }
  function _A(gA, PA) {
    JA(gA, function() {
      !b.state.isVisible && R.parentNode && R.parentNode.contains(R) && PA();
    });
  }
  function IA(gA, PA) {
    JA(gA, PA);
  }
  function JA(gA, PA) {
    var qA = QA().box;
    function Ce(Qe) {
      Qe.target === qA && (hh(qA, "remove", Ce), PA());
    }
    if (gA === 0)
      return PA();
    hh(qA, "remove", B), hh(qA, "add", Ce), B = Ce;
  }
  function jA(gA, PA, qA) {
    qA === void 0 && (qA = !1);
    var Ce = ka(b.props.triggerTarget || A);
    Ce.forEach(function(Qe) {
      Qe.addEventListener(gA, PA, qA), v.push({
        node: Qe,
        eventType: gA,
        handler: PA,
        options: qA
      });
    });
  }
  function q() {
    FA() && (jA("touchstart", G, {
      passive: !0
    }), jA("touchend", cA, {
      passive: !0
    })), HO(b.props.trigger).forEach(function(gA) {
      if (gA !== "manual")
        switch (jA(gA, G), gA) {
          case "mouseenter":
            jA("mouseleave", cA);
            break;
          case "focus":
            jA(GO ? "focusout" : "blur", DA);
            break;
          case "focusin":
            jA("focusout", DA);
            break;
        }
    });
  }
  function X() {
    v.forEach(function(gA) {
      var PA = gA.node, qA = gA.eventType, Ce = gA.handler, Qe = gA.options;
      PA.removeEventListener(qA, Ce, Qe);
    }), v = [];
  }
  function G(gA) {
    var PA, qA = !1;
    if (!(!b.state.isEnabled || YA(gA) || f)) {
      var Ce = ((PA = w) == null ? void 0 : PA.type) === "focus";
      w = gA, C = gA.currentTarget, lA(), !b.state.isVisible && DO(gA) && ol.forEach(function(Qe) {
        return Qe(gA);
      }), gA.type === "click" && (b.props.trigger.indexOf("mouseenter") < 0 || l) && b.props.hideOnClick !== !1 && b.state.isVisible ? qA = !0 : De(gA), gA.type === "click" && (l = !qA), qA && !Ce && fe(gA);
    }
  }
  function tA(gA) {
    var PA = gA.target, qA = bA().contains(PA) || R.contains(PA);
    if (!(gA.type === "mousemove" && qA)) {
      var Ce = de().concat(R).map(function(Qe) {
        var ot, bt = Qe._tippy, En = (ot = bt.popperInstance) == null ? void 0 : ot.state;
        return En ? {
          popperRect: Qe.getBoundingClientRect(),
          popperState: En,
          props: t
        } : null;
      }).filter(Boolean);
      PO(Ce, gA) && (D(), fe(gA));
    }
  }
  function cA(gA) {
    var PA = YA(gA) || b.props.trigger.indexOf("click") >= 0 && l;
    if (!PA) {
      if (b.props.interactive) {
        b.hideWithInteractivity(gA);
        return;
      }
      fe(gA);
    }
  }
  function DA(gA) {
    b.props.trigger.indexOf("focusin") < 0 && gA.target !== bA() || b.props.interactive && gA.relatedTarget && R.contains(gA.relatedTarget) || fe(gA);
  }
  function YA(gA) {
    return ar.isTouch ? FA() !== gA.type.indexOf("touch") >= 0 : !1;
  }
  function ue() {
    xe();
    var gA = b.props, PA = gA.popperOptions, qA = gA.placement, Ce = gA.offset, Qe = gA.getReferenceClientRect, ot = gA.moveTransition, bt = NA() ? od(R).arrow : null, En = Qe ? {
      getBoundingClientRect: Qe,
      contextElement: Qe.contextElement || bA()
    } : A, Ui = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Xr) {
        var cn = Xr.state;
        if (NA()) {
          var bi = QA(), qr = bi.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(gr) {
            gr === "placement" ? qr.setAttribute("data-placement", cn.placement) : cn.attributes.popper["data-popper-" + gr] ? qr.setAttribute("data-" + gr, "") : qr.removeAttribute("data-" + gr);
          }), cn.attributes.popper = {};
        }
      }
    }, bn = [{
      name: "offset",
      options: {
        offset: Ce
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
        adaptive: !ot
      }
    }, Ui];
    NA() && bt && bn.push({
      name: "arrow",
      options: {
        element: bt,
        padding: 3
      }
    }), bn.push.apply(bn, (PA == null ? void 0 : PA.modifiers) || []), b.popperInstance = EO(En, R, Object.assign({}, PA, {
      placement: qA,
      onFirstUpdate: p,
      modifiers: bn
    }));
  }
  function xe() {
    b.popperInstance && (b.popperInstance.destroy(), b.popperInstance = null);
  }
  function he() {
    var gA = b.props.appendTo, PA, qA = bA();
    b.props.interactive && gA === C0 || gA === "parent" ? PA = qA.parentNode : PA = Q0(gA, [qA]), PA.contains(R) || PA.appendChild(R), b.state.isMounted = !0, ue(), process.env.NODE_ENV !== "production" && Mr(b.props.interactive && gA === sn.appendTo && qA.nextElementSibling !== R, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function de() {
    return uc(R.querySelectorAll("[data-tippy-root]"));
  }
  function De(gA) {
    b.clearDelayTimeouts(), gA && HA("onTrigger", [b, gA]), k();
    var PA = aA(!0), qA = mA(), Ce = qA[0], Qe = qA[1];
    ar.isTouch && Ce === "hold" && Qe && (PA = Qe), PA ? n = setTimeout(function() {
      b.show();
    }, PA) : b.show();
  }
  function fe(gA) {
    if (b.clearDelayTimeouts(), HA("onUntrigger", [b, gA]), !b.state.isVisible) {
      oA();
      return;
    }
    if (!(b.props.trigger.indexOf("mouseenter") >= 0 && b.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(gA.type) >= 0 && l)) {
      var PA = aA(!1);
      PA ? i = setTimeout(function() {
        b.state.isVisible && b.hide();
      }, PA) : s = requestAnimationFrame(function() {
        b.hide();
      });
    }
  }
  function Ot() {
    b.state.isEnabled = !0;
  }
  function Ut() {
    b.hide(), b.state.isEnabled = !1;
  }
  function Nt() {
    clearTimeout(n), clearTimeout(i), cancelAnimationFrame(s);
  }
  function Et(gA) {
    if (process.env.NODE_ENV !== "production" && Mr(b.state.isDestroyed, La("setProps")), !b.state.isDestroyed) {
      HA("onBeforeUpdate", [b, gA]), X();
      var PA = b.props, qA = Vw(A, Object.assign({}, PA, Kw(gA), {
        ignoreAttributes: !0
      }));
      b.props = qA, q(), PA.interactiveDebounce !== qA.interactiveDebounce && (D(), o = Mw(tA, qA.interactiveDebounce)), PA.triggerTarget && !qA.triggerTarget ? ka(PA.triggerTarget).forEach(function(Ce) {
        Ce.removeAttribute("aria-expanded");
      }) : qA.triggerTarget && A.removeAttribute("aria-expanded"), lA(), BA(), j && j(PA, qA), b.popperInstance && (ue(), de().forEach(function(Ce) {
        requestAnimationFrame(Ce._tippy.popperInstance.forceUpdate);
      })), HA("onAfterUpdate", [b, gA]);
    }
  }
  function Bt(gA) {
    b.setProps({
      content: gA
    });
  }
  function ln() {
    process.env.NODE_ENV !== "production" && Mr(b.state.isDestroyed, La("show"));
    var gA = b.state.isVisible, PA = b.state.isDestroyed, qA = !b.state.isEnabled, Ce = ar.isTouch && !b.props.touch, Qe = ch(b.props.duration, 0, sn.duration);
    if (!(gA || PA || qA || Ce) && !bA().hasAttribute("disabled") && (HA("onShow", [b], !1), b.props.onShow(b) !== !1)) {
      if (b.state.isVisible = !0, NA() && (R.style.visibility = "visible"), BA(), k(), b.state.isMounted || (R.style.transition = "none"), NA()) {
        var ot = QA(), bt = ot.box, En = ot.content;
        fh([bt, En], 0);
      }
      p = function() {
        var bn;
        if (!(!b.state.isVisible || h)) {
          if (h = !0, R.offsetHeight, R.style.transition = b.props.moveTransition, NA() && b.props.animation) {
            var Ei = QA(), Xr = Ei.box, cn = Ei.content;
            fh([Xr, cn], Qe), Rw([Xr, cn], "visible");
          }
          SA(), lA(), Pw(dh, b), (bn = b.popperInstance) == null || bn.forceUpdate(), HA("onMount", [b]), b.props.animation && NA() && IA(Qe, function() {
            b.state.isShown = !0, HA("onShown", [b]);
          });
        }
      }, he();
    }
  }
  function pr() {
    process.env.NODE_ENV !== "production" && Mr(b.state.isDestroyed, La("hide"));
    var gA = !b.state.isVisible, PA = b.state.isDestroyed, qA = !b.state.isEnabled, Ce = ch(b.props.duration, 1, sn.duration);
    if (!(gA || PA || qA) && (HA("onHide", [b], !1), b.props.onHide(b) !== !1)) {
      if (b.state.isVisible = !1, b.state.isShown = !1, h = !1, l = !1, NA() && (R.style.visibility = "hidden"), D(), oA(), BA(!0), NA()) {
        var Qe = QA(), ot = Qe.box, bt = Qe.content;
        b.props.animation && (fh([ot, bt], Ce), Rw([ot, bt], "hidden"));
      }
      SA(), lA(), b.props.animation ? NA() && _A(Ce, b.unmount) : b.unmount();
    }
  }
  function Fi(gA) {
    process.env.NODE_ENV !== "production" && Mr(b.state.isDestroyed, La("hideWithInteractivity")), z().addEventListener("mousemove", o), Pw(ol, o), o(gA);
  }
  function Vr() {
    process.env.NODE_ENV !== "production" && Mr(b.state.isDestroyed, La("unmount")), b.state.isVisible && b.hide(), b.state.isMounted && (xe(), de().forEach(function(gA) {
      gA._tippy.unmount();
    }), R.parentNode && R.parentNode.removeChild(R), dh = dh.filter(function(gA) {
      return gA !== b;
    }), b.state.isMounted = !1, HA("onHidden", [b]));
  }
  function Wr() {
    process.env.NODE_ENV !== "production" && Mr(b.state.isDestroyed, La("destroy")), !b.state.isDestroyed && (b.clearDelayTimeouts(), b.unmount(), X(), delete A._tippy, b.state.isDestroyed = !0, HA("onDestroy", [b]));
  }
}
function Ks(A, e) {
  e === void 0 && (e = {});
  var t = sn.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (XO(A), _0(e, t)), kO();
  var n = Object.assign({}, e, {
    plugins: t
  }), i = NO(A);
  if (process.env.NODE_ENV !== "production") {
    var s = xs(n.content), l = i.length > 1;
    Mr(s && l, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var f = i.reduce(function(c, h) {
    var w = h && A4(h, n);
    return w && c.push(w), c;
  }, []);
  return xs(A) ? f[0] : f;
}
Ks.defaultProps = sn;
Ks.setDefaultProps = JO;
Ks.currentInput = ar;
Object.assign({}, c0, {
  effect: function(e) {
    var t = e.state, n = {
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
    Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow);
  }
});
Ks.setDefaultProps({
  render: x0
});
const e4 = "_btn_pqsxd_1", t4 = "_btnGroup_pqsxd_4", sl = {
  btn: e4,
  btnGroup: t4
}, n4 = function(A) {
  var e = {
    onAnnotationSelectFunction: oe.noop(),
    drawing: null,
    popoverId: ""
  }, t = Te.merge({}, e, A), n = {
    show: function(c) {
      c.visible = !0;
    },
    hide: function(c) {
      c.visible = !1, c.hidden = !0;
    },
    auto: function(c) {
      c.visible = !1, c.hidden = !1;
    }
  }, i = function(c, h) {
    c.select("span.genelabel").text(function(p) {
      return p.label;
    }).style("font-weight", function(p) {
      return p.selected ? "bold" : "normal";
    }).style("opacity", function(p) {
      return p.visible || p.selected ? 1 : p.normedScore ? p.normedScore : p.importance;
    }).style("color", function(p) {
      return h.visible || h.selected ? h.color : null;
    });
    var w = c.select("div.btn-group");
    w.selectAll("a").data(["show", "hide", "auto"]).classed("disabled", function(p) {
      return p == "show" && h.visible || p == "hide" && h.hidden && !h.visible || p == "auto" && !h.hidden && !h.visible;
    });
  }, s = function(c, h, w) {
    var B = w.data.genesList, p = h.selectAll("p").data(B);
    c.append("span").text("Cluster"), c.append("div.btn-group").selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(F) {
      return F;
    }).classed(`${sl.btn}`, !0)``.on("click", function(F) {
      var U = n[F];
      B.forEach(U), p.each(function(S) {
        var O = XA(this);
        i(O, S);
      }), t.onAnnotationSelectFunction();
    });
    var o = p.enter(), C = o.append("p");
    C.append("span").classed("genelabel", !0), C.append("div").classed("btn-group", !0), p.each(function(F) {
      var U = XA(this), S = U.select("div.btn-group");
      S.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(b) {
        return b;
      }).classed(`${sl.btn}`, !0).on("click", function(b) {
        var P = n[b];
        P(F), t.onAnnotationSelectFunction(), i(U, F);
      });
    }), p.each(function(F) {
      var U = XA(this);
      i(U, F);
    });
  }, l = function(c, h, w) {
    var B = w.data;
    c.append("a").attr("href", B.link).text(B.label), h.append("p").text(
      "Chromosome " + B.chromosome + ": " + B.start + "-" + B.end
    ), B.score && h.append("p").text("Score: " + parseFloat(B.score).toFixed(3)), h.append("hr");
    var p = h.append("p").style("float", "right").classed(sl.btnGroup, !0), v = function() {
      let o = p.selectAll("a").data(["show", "hide", "auto"]);
      o.enter().append("a").attr("href", "#").text(function(C) {
        return C;
      }).classed(`${sl.btn}`, !0).on("click", function(C) {
        var F = n[C];
        F(B), t.onAnnotationSelectFunction(), v();
      }), o.classed("disabled", function(C) {
        return C == "show" && B.visible || C == "hide" && B.hidden && !B.visible || C == "auto" && !B.hidden && !B.visible;
      });
    };
    v();
  }, f = {};
  return f.geneAnnotationsPopoverFunction = function(c, h) {
    var w = c.data.type == "geneslist";
    XA(t.popoverId).attr("class", "popover");
    let B = XA(t.popoverId).select(".popover-title"), p = XA(t.popoverId).select(".popover-content");
    B.selectAll("*").remove(), B.text(""), p.selectAll("*").remove(), p.text(""), w ? s(B, p, c) : l(B, p, c);
    var v = h.target;
    oe(".gene-annotation-popover").remove(), Ks(v, {
      content: oe(t.popoverId).html(),
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
      onShow(o) {
        console.log("Popover is shown");
      },
      onHide(o) {
        console.log("Popover is hidden");
      }
    }), v._tippy.show(), oe(document).on("click", function(o) {
      oe(o.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || oe(".gene-annotation-popover").remove();
    }), oe(t.popoverId).on("mousedown mousewheel", function(o) {
      o.stopPropagation();
    });
  }, f;
}, r4 = function(A) {
  var e = {
    border: !1,
    labelRectangles: !1,
    onAnnotationSelectFunction: oe.noop(),
    onExpandClusterFunction: oe.noop(),
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
  }, t = Te.merge({}, e, A), n = null, i = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(c, h) {
    Te.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", n = n4(t);
    var w = i(), B = c.selectAll("g.gene-annotation").data(h.layout.annotationNodes, function(C) {
      return C.data.id;
    }), p = B.enter().append("g").classed("gene-annotation", !0);
    p.append("line").classed("midpoint-line", !0), p.append("path").classed("link", !0).attr("d", function(C) {
      return C.data.path;
    }), t.labelRectangles && p.append("rect").classed("labella", !0), p.append("text").attr("x", function(C) {
      return C.x + 0.1 * t.annotationLabelSize;
    }).attr("y", function(C) {
      return C.y + 0.4 * t.annotationLabelSize;
    }), c.selectAll("g.gene-annotation").attr("id", function(C) {
      return "feature_" + C.data.id;
    }).attr("data-bs-toggle", "popover").attr("data-bs-trigger", "hover").attr("data-bs-html", "true"), c.selectAll("g.gene-annotation").classed("selected", function(C) {
      return C.data.selected;
    }), c.selectAll("g.gene-annotation").select("line.midpoint-line").attr("x1", -(t.chromosomeWidth * 0.5)).attr("y1", function(C) {
      return w(C.data.midpoint);
    }).attr("y2", function(C) {
      return w(C.data.midpoint);
    }).attr("x2", 0), c.selectAll("g.gene-annotation").select("text").text(function(C) {
      if (C.data.type == "gene")
        return C.data.label;
      if (C.data.type == "geneslist")
        return "(" + C.data.genesList.length + ")";
    }), t.labelRectangles && c.selectAll("g.gene-annotation").select("rect.labella").attr("fill", "pink").attr("stroke", "none").attr("x", function(C) {
      return C.x;
    }).attr("y", function(C) {
      return C.y - C.dy / 2;
    }).attr("width", function(C) {
      return C.dx;
    }).attr("height", function(C) {
      return C.dy;
    });
    var v = "0.5";
    c.selectAll("g.gene-annotation").select("path.link").style("opacity", function(C) {
      return C.data.visible || C.data.selected ? 1 : C.data.normedScore ? C.data.normedScore : C.data.importance;
    }).style("stroke-width", function(C) {
      return v;
    }).style("stroke", function(C) {
      return C.data.visible || C.data.selected ? C.data.color : "gray";
    }), c.selectAll("g.gene-annotation").select("text").style("font-size", function(C) {
      return (C.data.selected ? 0.2 : 0) + C.data.fontSize + "px";
    }).style("font-weight", function(C) {
      return C.data.selected ? "bold" : "normal";
    }).style("fill", function(C) {
      return C.data.selected ? C.data.color : null;
    }), c.selectAll("g.gene-annotation").select("text").transition().duration(300).attr("x", function(C) {
      return C.x + 0.1 * t.annotationLabelSize;
    }).attr("y", function(C) {
      return C.y + 0.4 * t.annotationLabelSize;
    }), c.selectAll("g.gene-annotation").select("path.link").transition().duration(300).attr("d", function(C) {
      return C.data.path;
    }), c.selectAll("g.gene-annotation").on("click", function(C, F) {
      F.data.type == "gene" && (F.data.selected = !F.data.selected, F.data.selected && (F.data.visible = !0), t.onAnnotationSelectFunction()), F.data.type == "geneslist" && t.onExpandClusterFunction(h, F.data);
    }), c.selectAll("g.gene-annotation").on("contextmenu", function(C, F) {
      n.geneAnnotationsPopoverFunction(F, C);
    });
    var o = c.selectAll("g.gene-annotation").exit();
    o.remove();
  }, l = function(c) {
    c.select("rect.border").empty() && c.append("rect").classed("border", !0), c.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  };
  function f(c) {
    c.each(function(h) {
      var w = XA(this).selectAll(".gene-annotations").data([h]);
      w.enter().append("g").attr("class", "gene-annotations"), w.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ).attr("id", function(B) {
        return "annotation_" + B.number;
      }), s(w, h), w.exit().remove(), t.border && l(w);
    });
  }
  return f.onAnnotationSelectFunction = function(c) {
    return arguments.length ? (t.onAnnotationSelectFunction = c, f) : t.onAnnotationSelectFunction;
  }, f.onExpandClusterFunction = function(c) {
    return arguments.length ? (t.onExpandClusterFunction = c, f) : t.onExpandClusterFunction;
  }, f.layout = function(c) {
    return arguments.length ? (t.layout = c, f) : t.layout;
  }, f.drawing = function(c) {
    return arguments.length ? (t.drawing = c, f) : t.drawing;
  }, f.scale = function(c) {
    return arguments.length ? (t.scale = c, f) : t.scale;
  }, f.longestChromosome = function(c) {
    return arguments.length ? (t.longestChromosome = c, f) : t.longestChromosome;
  }, f.chromosomeWidth = function(c) {
    return arguments.length ? (t.chromosomeWidth = c, f) : t.chromosomeWidth;
  }, f.annotationLabelSize = function(c) {
    return arguments.length ? (t.annotationLabelSize = c, f) : t.annotationLabelSize;
  }, f.annotationMarkerSize = function(c) {
    return arguments.length ? (t.annotationMarkerSize = c, f) : t.annotationMarkerSize;
  }, f;
}, i4 = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: oe.noop(),
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
  }, t = Te.merge({}, e, A), n = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h, w, B, p) {
    var v = {};
    p.map(function(P, R) {
      v[P] = R;
    });
    var o = n(), C = h.selectAll("rect.snp-annotation").data(B, function(P) {
      return P.id;
    }), F = 4, U = function(P) {
      return t.layout.width - 0.2 * t.layout.chromosomeWidth * (1 + v[P.trait]);
    }, S = function(P) {
      return o(P.midpoint) - 0.5 * Math.max(F / t.scale, o(10));
    }, O = Math.max(F / t.scale, o(10)), b = 0.2 * t.layout.chromosomeWidth;
    C.attr("x", U).attr("y", S).attr("width", b).attr("height", O), C.enter().append("rect").attr("fill", function(P) {
      return P.color;
    }).attr("opacity", function(P) {
      return P.importance;
    }).attr("class", "snp-annotation").attr("x", U).attr("y", S).attr("width", b).attr("height", O), C.exit().remove(), C.on("contextmenu", function(P) {
    });
  }, s = function(h, w, B) {
    var p = 500, v = n();
    t.layout.width;
    var o = 0.3 * t.layout.chromosomeWidth, C = 0.4 * t.layout.chromosomeWidth, F = w.layout.qtlNodes.some(function(D) {
      return D.displayLabel;
    });
    F && (C = C * 1.5);
    var U = B * 0.2 * t.layout.chromosomeWidth, S = function(D) {
      return t.layout.width - D.labelPosition * (C + o) - U;
    }, O = function(D) {
      return t.layout.width - D.position * (C + o) - U;
    }, b = h.selectAll("g.qtl-annotation").data(w.layout.qtlNodes, function(D) {
      return D.id;
    }), P = b.enter().append("g").classed("qtl-annotation infobox", !0);
    P.append("rect").classed("qtl-hoverbox", !0);
    var R = P.append("rect").classed("qtl-selector infobox", !0), j = {}, dA = {};
    b.exit().select("rect").each(function(D) {
      j[D.index] = Te.pick(this, ["x", "y", "width", "height"]), j[D.index].midpoint = D.midpoint, j[D.index].position = D.position;
    }), R.each(function(D) {
      dA[D.index] = Te.pick(this, ["x", "y", "width", "height"]), dA[D.index].midpoint = D.midpoint, dA[D.index].position = D.position;
    });
    var fA = function(D, iA, Y, L) {
      return Te.has(D, iA) ? D[iA][Y].animVal.value : L;
    };
    R.attr("x", function(D) {
      return fA(j, D.parentIndex, "x", O(D));
    }).attr("y", function(D) {
      return fA(j, D.parentIndex, "y", v(D.start));
    }).attr("width", o).attr("height", function(D) {
      return fA(
        j,
        D.parentIndex,
        "height",
        v(D.end) - v(D.start)
      );
    }), b.attr("id", function(D) {
      return "feature_" + D.id;
    }), b.select("rect.qtl-hoverbox").attr("x", function(D) {
      return O(D);
    }).attr("y", function(D) {
      return v(D.start);
    }).attr("width", function(D) {
      return D.position * (C + o) + t.chromosomeWidth + U;
    }).attr("height", function(D) {
      return v(D.end) - v(D.start);
    }).attr("fill", function(D) {
      return D.color;
    }).attr("visibility", function(D) {
      return D.hover ? "visible" : "hidden";
    }), b.select("rect.qtl-selector").transition().duration(p).attr("x", O).attr("y", function(D) {
      return v(D.start);
    }).attr("width", o).attr("height", function(D) {
      return v(D.end) - v(D.start);
    }), b.select("rect.qtl-selector").style("fill", function(D) {
      return D.color;
    }), b.exit().select("rect").transition().duration(p).attr("x", function(D) {
      return fA(dA, D.parentIndex, "x", O(D));
    }).attr("y", function(D) {
      return fA(dA, D.parentIndex, "y", v(D.start));
    }).attr("width", function(D) {
      return o;
    }).attr("height", function(D) {
      return fA(
        dA,
        D.parentIndex,
        "height",
        v(D.end) - v(D.start)
      );
    }).remove(), b.exit().remove();
    var mA = function(D) {
      return v(D.midpoint);
    }, FA = function(D) {
      return D.displayLabel === "show" ? "visible" : D.displayLabel === "hide" ? "hidden" : !0;
    }, NA = P.append("g").classed("qtl-count-group", !0), bA = b.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(D) {
        var iA = D.type == "qtllist" ? [D] : [];
        return iA;
      },
      function(D) {
        return "label_" + D.id;
      }
    ), z = bA.enter(), QA = z.append("g").classed("qtllist", !0);
    QA.append("circle").classed("qtl-count", !0), QA.append("text").classed("qtl-count", !0), NA.each(function(D) {
      if (Te.has(dA, D.index))
        if (Te.has(j, D.parentIndex)) {
          let L = j[D.parentIndex];
          var iA = t.layout.width - L.position * (C + o), Y = v(L.midpoint);
          XA(this).attr(
            "transform",
            "translate(" + (iA + 0.5 * o) + "," + Y + ")"
          );
        } else
          XA(this).attr("transform", function(L) {
            return L ? "translate(" + (O(L) + 0.5 * o) + "," + mA(L) + ")" : "translate(0,0)";
          });
    }), b.select("g.qtl-count-group").transition().duration(p).attr("transform", function(D) {
      return D ? "translate(" + (O(D) + 0.5 * o) + "," + mA(D) + ")" : "translate(0,0)";
    }), b.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", o + "px").style("visibility", "visible").style("fill", function(D) {
      return D.color;
    }).attr("id", function(D) {
      return D.id;
    });
    var aA = Math.min(
      Math.max(10 / t.scale, o),
      14 / t.scale
    );
    b.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", aA + "px").style(
      "visibility",
      aA < 2 * o ? "visible" : "hidden"
    ).text(function(D) {
      return D.count;
    }), bA.exit().remove(), P.append("g").classed("qtl-label-group", !0);
    var BA = b.select("g.qtl-label-group").selectAll("g.qtl").data(
      function(D) {
        var iA = D.displayLabel ? [D] : [];
        return iA;
      },
      function(D) {
        return "label_" + D.id;
      }
    );
    BA.exit().remove(), BA.transition().duration(p).attr("transform", function(D) {
      return "translate(" + (S(D) + 0.5 * o) + "," + mA(D) + ")";
    });
    var HA = BA.enter(), SA = HA.append("g").classed("qtl", !0).attr("transform", function(D) {
      return "translate(" + (S(D) + 0.5 * o) + "," + mA(D) + ")";
    });
    SA.append("text").classed("qtl-label", !0), b.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(D) {
      return D.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", FA).text(function(D) {
      return D.screenLabel;
    });
    var lA = function(D) {
      D.on("mouseenter", function(iA) {
        iA.hover = !0, s(h, w, B);
      }).on("mouseout", function(iA) {
        iA.hover = !1, s(h, w, B);
      }).on("click", function(iA) {
        iA.hover = !iA.hover, s(h, w, B);
      });
    };
    lA(b.select("rect.qtl-selector")), lA(b.select("circle.qtl-count")), lA(b.select("text.qtl-count")), b.on("contextmenu", function(D) {
      var iA = XA("#clusterPopover");
      iA.attr("class", "popover");
      var Y = iA.select(".popover-title");
      Y.selectAll("*").remove(), Y.text(""), Y.text(
        "Chromosome " + D.chromosome + ": " + D.start + "-" + D.end
      ), oe.fn.redraw = function() {
        return oe(this).each(function() {
          this.offsetHeight;
        });
      }, L = iA.select(".popover-content"), L.selectAll("*").remove(), L.text("");
      var L = iA.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        D.type == "qtllist" ? D.qtlList : [D]
      ), k = L.enter();
      k.append("p").classed("popover-annotation", !0);
      var oA = L.append("div").attr("class", "checkbox").append("label");
      oA.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(_A) {
        return _A.selected;
      }).on("click", function(_A) {
        _A.selected = !_A.selected, L.classed("selected", function(IA) {
          return IA.selected;
        }), t.onAnnotationSelectFunction();
      }), oA.append("a").attr("href", function(_A) {
        return _A.link;
      }).attr("target", "_blank").text(function(_A) {
        return _A.label;
      }), L.classed("selected", function(_A) {
        return _A.selected;
      });
    });
  }, l = function(h) {
    h.select("rect.border").empty() && h.append("rect").classed("border", !0), h.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  }, f = function(h) {
    var w = /* @__PURE__ */ new Set();
    h.map(function(p) {
      w.add(p.trait);
    });
    var B = Array.from(w).sort();
    return B;
  };
  function c(h) {
    h.each(function(w) {
      var B = w.annotations.snps.filter(function(C) {
        return !(C.pvalue > t.maxSnpPValue);
      }), p = f(B), v = XA(this).selectAll(".qtl-annotations").data([w]);
      v.enter().append("g").attr("class", "qtl-annotations"), v.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), s(v, w, p.length), t.border && l(v), v.exit().remove();
      var o = XA(this).selectAll(".snp-annotations").data([w]);
      o.enter().append("g").attr("class", "snp-annotations"), o.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), i(o, w, B, p), o.exit().remove();
    });
  }
  return c.onAnnotationSelectFunction = function(h) {
    return arguments.length ? (t.onAnnotationSelectFunction = h, c) : t.onAnnotationSelectFunction;
  }, c.layout = function(h) {
    return arguments.length ? (t.layout = h, c) : t.layout;
  }, c.drawing = function(h) {
    return arguments.length ? (t.drawing = h, c) : t.drawing;
  }, c.longestChromosome = function(h) {
    return arguments.length ? (t.longestChromosome = h, c) : t.longestChromosome;
  }, c.chromosomeWidth = function(h) {
    return arguments.length ? (t.chromosomeWidth = h, c) : t.chromosomeWidth;
  }, c.annotationLabelSize = function(h) {
    return arguments.length ? (t.annotationLabelSize = h, c) : t.annotationLabelSize;
  }, c.annotationMarkerSize = function(h) {
    return arguments.length ? (t.annotationMarkerSize = h, c) : t.annotationMarkerSize;
  }, c.showAnnotationLabels = function(h) {
    return arguments.length ? (t.showAnnotationLabels = h, c) : t.showAnnotationLabels;
  }, c.maxSnpPValue = function(h) {
    return arguments.length ? (t.maxSnpPValue = h, c) : t.maxSnpPValue;
  }, c.infoBoxManager = function(h) {
    return arguments.length ? (t.infoBoxManager = h, c) : t.infoBoxManager;
  }, c.scale = function(h) {
    return arguments.length ? (t.scale = h, c) : t.scale;
  }, c;
}, a4 = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: oe.noop(),
    onExpandClusterFunction: oe.noop(),
    onLabelSelectFunction: oe.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, t = Te.merge({}, e, A);
  function n(i) {
    i.each(function(s) {
      var l = s.cellLayout, f = XA(this).selectAll(".chromosome-cell").data(s.chromosomes), c = f.enter().append("g").attr("class", "chromosome-cell");
      t.border && c.append("rect").classed("border", !0), XA(this).selectAll(".chromosome-cell").attr("transform", function(v) {
        return "translate(" + v.cell.x + "," + v.cell.y + ")";
      }), t.border && f.select("rect").attr("x", 0).attr("y", 0).attr("width", function(v) {
        return v.cell.width;
      }).attr("height", function(v) {
        return v.cell.height;
      });
      var h = r4().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(l.geneAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).drawing(t.svg).scale(l.scale);
      qh(".chromosome-cell").call(h);
      var w = yD().layout(l.chromosomePosition).longestChromosome(l.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(l.scale).bands("genes").drawing(t.svg);
      qh(".chromosome-cell").call(w);
      var B = vD().layout(l.labelPosition).sizeLayout(l.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(l.longestChromosome).scale(l.scale);
      f.call(B);
      var p = i4().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(l.qtlAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).showAnnotationLabels(l.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(l.scale);
      f.call(p), f.exit().remove();
    });
  }
  return n.onAnnotationSelectFunction = function(i) {
    return arguments.length ? (t.onAnnotationSelectFunction = i, n) : t.onAnnotationSelectFunction;
  }, n.onExpandClusterFunction = function(i) {
    return arguments.length ? (t.onExpandClusterFunction = i, n) : t.onExpandClusterFunction;
  }, n.onLabelSelectFunction = function(i) {
    return arguments.length ? (t.onLabelSelectFunction = i, n) : t.onLabelSelectFunction;
  }, n.infoBoxManager = function(i) {
    return arguments.length ? (t.infoBoxManager = i, n) : t.infoBoxManager;
  }, n.maxAnnotationLayers = function(i) {
    return arguments.length ? (t.maxAnnotationLayers = i, n) : t.maxAnnotationLayers;
  }, n.maxSnpPValue = function(i) {
    return arguments.length ? (t.maxSnpPValue = i, n) : t.maxSnpPValue;
  }, n.svg = function(i) {
    return arguments.length ? (t.svg = i, n) : t.svg;
  }, n;
};
var I0 = { exports: {} };
(function(A, e) {
  (function(t, n) {
    A.exports = n();
  })(Wi, function() {
    return function(t) {
      function n(s) {
        if (i[s]) return i[s].exports;
        var l = i[s] = { exports: {}, id: s, loaded: !1 };
        return t[s].call(l.exports, l, l.exports, n), l.loaded = !0, l.exports;
      }
      var i = {};
      return n.m = t, n.c = i, n.p = "", n(0);
    }([function(t, n, i) {
      t.exports = { Node: i(1), Force: i(2), Distributor: i(3), Renderer: i(10) };
    }, function(t, n) {
      function i(f, c) {
        if (!(f instanceof c)) throw new TypeError("Cannot call a class as a function");
      }
      var s = /* @__PURE__ */ function() {
        function f(c, h) {
          for (var w = 0; w < h.length; w++) {
            var B = h[w];
            B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(c, B.key, B);
          }
        }
        return function(c, h, w) {
          return h && f(c.prototype, h), w && f(c, w), c;
        };
      }(), l = function() {
        function f(c, h, w) {
          i(this, f), this.idealPos = c, this.currentPos = c, this.width = h, this.data = w, this.layerIndex = 0;
        }
        return s(f, [{ key: "distanceFrom", value: function(c) {
          var h = this.width / 2, w = c.width / 2;
          return Math.max(this.currentPos - h, c.currentPos - w) - Math.min(this.currentPos + h, c.currentPos + w);
        } }, { key: "moveToIdealPosition", value: function() {
          return this.currentPos = this.idealPos, this;
        } }, { key: "displacement", value: function() {
          return this.idealPos - this.currentPos;
        } }, { key: "overlapWithNode", value: function(c) {
          var h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return this.distanceFrom(c) - h < 0;
        } }, { key: "overlapWithPoint", value: function(c) {
          var h = this.width / 2;
          return c >= this.currentPos - h && c <= this.currentPos + h;
        } }, { key: "positionBefore", value: function(c) {
          var h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return c.currentLeft() - this.width / 2 - h;
        } }, { key: "positionAfter", value: function(c) {
          var h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return c.currentRight() + this.width / 2 + h;
        } }, { key: "currentRight", value: function() {
          return this.currentPos + this.width / 2;
        } }, { key: "currentLeft", value: function() {
          return this.currentPos - this.width / 2;
        } }, { key: "idealRight", value: function() {
          return this.idealPos + this.width / 2;
        } }, { key: "idealLeft", value: function() {
          return this.idealPos - this.width / 2;
        } }, { key: "createStub", value: function(c) {
          var h = new f(this.idealPos, c, this.data);
          return h.currentPos = this.currentPos, h.child = this, this.parent = h, h;
        } }, { key: "removeStub", value: function() {
          return this.parent && (this.parent.child = null, this.parent = null), this;
        } }, { key: "isStub", value: function() {
          return !!this.child;
        } }, { key: "getPathToRoot", value: function() {
          for (var c = [], h = this; h; ) c.push(h), h = h.parent;
          return c;
        } }, { key: "getPathFromRoot", value: function() {
          return this.getPathToRoot().reverse();
        } }, { key: "getPathToRootLength", value: function() {
          for (var c = 0, h = this; h; ) {
            var w = h.parent ? h.parent.currentPos : h.idealPos;
            c += Math.abs(h.currentPos - w), h = h.parent;
          }
          return c;
        } }, { key: "getRoot", value: function() {
          for (var c = this, h = this; h; ) c = h, h = h.parent;
          return c;
        } }, { key: "getLayerIndex", value: function() {
          return this.layerIndex;
        } }, { key: "clone", value: function() {
          var c = new f(this.idealPos, this.width, this.data);
          return c.currentPos = this.currentPos, c.layerIndex = this.layerIndex, c;
        } }]), f;
      }();
      t.exports = l;
    }, function(t, n, i) {
      var s = i(3), l = i(4), f = i(8), c = { nodeSpacing: 3, minPos: 0, maxPos: null, algorithm: "overlap", removeOverlap: !0, density: 0.85, stubWidth: 1 }, h = function(w) {
        var B = {}, p = l.extend({}, c), v = new s(), o = [], C = null;
        return B.nodes = function(F) {
          return arguments.length ? (o = F, C = [F.concat()], B) : o;
        }, B.getLayers = function() {
          return C;
        }, B.options = function(F) {
          if (!arguments.length) return p;
          p = l.extend(p, F);
          var U = l.pick(p, Object.keys(s.DEFAULT_OPTIONS));
          return l.isDefined(p.minPos) && l.isDefined(p.maxPos) ? U.layerWidth = p.maxPos - p.minPos : U.layerWidth = null, v.options(U), B;
        }, B.options(w), B.compute = function() {
          var F = l.pick(p, Object.keys(f.DEFAULT_OPTIONS));
          return o.forEach(function(U) {
            U.removeStub();
          }), C = v.distribute(o), C.map(function(U, S) {
            U.forEach(function(O) {
              O.layerIndex = S;
            }), p.removeOverlap && f(U, F);
          }), B;
        }, B.start = function() {
          console.log("[warning] force.start() is deprecated. Please use force.compute() instead.");
        }, B;
      };
      h.DEFAULT_OPTIONS = c, t.exports = h;
    }, function(t, n, i) {
      var s = i(4), l = i(6), f = { algorithm: "overlap", layerWidth: 1e3, density: 0.75, nodeSpacing: 3, stubWidth: 1 }, c = function(h) {
        var w = {};
        h = s.extend({}, f, h), w.options = function(p) {
          return arguments.length ? (h = s.extend(h, p), w) : h;
        }, w.computeRequiredWidth = function(p) {
          return s.sum(p, function(v) {
            return v.width + h.nodeSpacing;
          }) - h.nodeSpacing;
        }, w.maxWidthPerLayer = function() {
          return h.density * h.layerWidth;
        }, w.needToSplit = function(p) {
          return w.estimateRequiredLayers(p) > 1;
        }, w.estimateRequiredLayers = function(p) {
          return h.layerWidth ? Math.ceil(w.computeRequiredWidth(p) / w.maxWidthPerLayer()) : 1;
        };
        var B = { simple: function(p) {
          for (var v = w.estimateRequiredLayers(p), o = [], C = 0; C < v; C++) o.push([]);
          return p.forEach(function(F, U) {
            var S = U % v;
            o[S].push(F);
            for (var O = F, b = S - 1; b >= 0; b--) O = O.createStub(h.stubWidth), o[b].push(O);
          }), o;
        }, roundRobin: function(p) {
          var v = [];
          return v;
        }, overlap: function(p) {
          for (var v = [], o = w.maxWidthPerLayer(), C = p.concat(), F = w.computeRequiredWidth(C); F > o; ) {
            w.countIdealOverlaps(C);
            var U = C.concat(), S = F;
            for (C = []; U.length > 2 && S > o; ) {
              U.sort(function(mA, FA) {
                return FA.overlapCount - mA.overlapCount;
              });
              var O = U.shift();
              S -= O.width, S += h.stubWidth, O.overlaps.forEach(function(mA) {
                mA.overlapCount--;
              }), C.push(O);
            }
            v.push(U), F = w.computeRequiredWidth(C);
          }
          C.length > 0 && v.push(C);
          for (var b = v.length - 1; b >= 1; b--) for (var P = v[b], R = 0; R < P.length; R++) {
            var j = P[R];
            if (!j.isStub()) for (var dA = j, fA = b - 1; fA >= 0; fA--) dA = dA.createStub(h.stubWidth), v[fA].push(dA);
          }
          return v;
        } };
        return w.countIdealOverlaps = function(p) {
          var v = new l(h.layerWidth / 2);
          return p.forEach(function(o) {
            v.add([o.idealLeft(), o.idealRight(), o]);
          }), p.forEach(function(o) {
            var C = v.search(o.idealLeft(), o.idealRight());
            o.overlaps = C.map(function(F) {
              return F.data[2];
            }), o.overlapCount = C.length;
          }), p;
        }, w.distribute = function(p) {
          if (!p || p.length === 0) return [];
          if (h.algorithm == "none" || !s.isDefined(h.algorithm)) return [p];
          if (!w.needToSplit(p)) return [p];
          var v = p.concat().sort(function(o, C) {
            return o.idealPos - C.idealPos;
          });
          if (typeof h.algorithm == "function") return h.algorithm(v, h);
          if (B.hasOwnProperty(h.algorithm)) return B[h.algorithm](v);
          throw "Unknown algorithm: " + h.algorithm;
        }, w;
      };
      c.DEFAULT_OPTIONS = f, t.exports = c;
    }, function(t, n, i) {
      var s = { isDefined: function(l) {
        return l != null;
      }, last: function(l) {
        return l.length > 0 ? l[l.length - 1] : null;
      }, pick: function(l, f) {
        return f.reduce(function(c, h) {
          return c[h] = l[h], c;
        }, {});
      }, sum: function(l, f) {
        return l.map(f).reduce(function(c, h) {
          return c + h;
        }, 0);
      } };
      s.extend = i(5), t.exports = s;
    }, function(t, n) {
      var i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(h) {
        return typeof h;
      } : function(h) {
        return h && typeof Symbol == "function" && h.constructor === Symbol && h !== Symbol.prototype ? "symbol" : typeof h;
      }, s = Object.prototype.hasOwnProperty, l = Object.prototype.toString, f = function(h) {
        return typeof Array.isArray == "function" ? Array.isArray(h) : l.call(h) === "[object Array]";
      }, c = function(h) {
        if (!h || l.call(h) !== "[object Object]") return !1;
        var w = s.call(h, "constructor"), B = h.constructor && h.constructor.prototype && s.call(h.constructor.prototype, "isPrototypeOf");
        if (h.constructor && !w && !B) return !1;
        var p;
        for (p in h) ;
        return p === void 0 || s.call(h, p);
      };
      t.exports = function h() {
        var w, B, p, v, o, C, F = arguments[0], U = 1, S = arguments.length, O = !1;
        for (typeof F == "boolean" ? (O = F, F = arguments[1] || {}, U = 2) : ((typeof F > "u" ? "undefined" : i(F)) !== "object" && typeof F != "function" || F == null) && (F = {}); U < S; ++U) if (w = arguments[U], w != null) for (B in w) p = F[B], v = w[B], F !== v && (O && v && (c(v) || (o = f(v))) ? (o ? (o = !1, C = p && f(p) ? p : []) : C = p && c(p) ? p : {}, F[B] = h(O, C, v)) : v !== void 0 && (F[B] = v));
        return F;
      };
    }, function(t, n, i) {
      function s(p, v) {
        if (v || (v = {}), this.startKey = v.startKey || 0, this.endKey = v.endKey || 1, this.intervalHash = {}, this.pointTree = new B({ compare: function(o, C) {
          if (o == null) return -1;
          if (C == null) return 1;
          var F = o[0] - C[0];
          return F > 0 ? 1 : F == 0 ? 0 : -1;
        } }), this._autoIncrement = 0, !p || typeof p != "number") throw new Error("you must specify center index as the 2nd argument.");
        this.root = new h(p);
      }
      function l(p, v) {
        return v.end < p.idx ? (p.left || (p.left = new h(v.start + v.end >> 1)), l.call(this, p.left, v)) : p.idx < v.start ? (p.right || (p.right = new h(v.start + v.end >> 1)), l.call(this, p.right, v)) : p.insert(v);
      }
      function f(p, v, o) {
        if (p) return v < p.idx ? (p.starts.every(function(C) {
          var F = C.start <= v;
          return F && o.push(C.result()), F;
        }), f.call(this, p.left, v, o)) : v > p.idx ? (p.ends.every(function(C) {
          var F = C.end >= v;
          return F && o.push(C.result()), F;
        }), f.call(this, p.right, v, o)) : void p.starts.map(function(C) {
          o.push(C.result());
        });
      }
      function c(p, v, o) {
        if (v - p <= 0) throw new Error("end must be greater than start. start: " + p + ", end: " + v);
        var C = {}, F = [];
        f.call(this, this.root, p + v >> 1, F, !0), F.forEach(function(P) {
          C[P.id] = !0;
        });
        for (var U = this.pointTree.bsearch([p, null]), S = this.pointTree; U >= 0 && S[U][0] == p; ) U--;
        var O = this.pointTree.bsearch([v, null]);
        if (O >= 0) {
          for (var b = S.length - 1; O <= b && S[O][0] <= v; ) O++;
          S.slice(U + 1, O).forEach(function(P) {
            var R = P[1];
            C[R] = !0;
          }, this), Object.keys(C).forEach(function(P) {
            var R = this.intervalHash[P];
            o.push(R.result(p, v));
          }, this);
        }
      }
      function h(p) {
        this.idx = p, this.starts = new B({ compare: function(v, o) {
          if (v == null) return -1;
          if (o == null) return 1;
          var C = v.start - o.start;
          return C > 0 ? 1 : C == 0 ? 0 : -1;
        } }), this.ends = new B({ compare: function(v, o) {
          if (v == null) return -1;
          if (o == null) return 1;
          var C = v.end - o.end;
          return C < 0 ? 1 : C == 0 ? 0 : -1;
        } });
      }
      function w(p, v, o, C) {
        if (this.id = v, this.start = p[o], this.end = p[C], this.data = p, typeof this.start != "number" || typeof this.end != "number") throw new Error("start, end must be number. start: " + this.start + ", end: " + this.end);
        if (this.start >= this.end) throw new Error("start must be smaller than end. start: " + this.start + ", end: " + this.end);
      }
      var B = i(7);
      s.prototype.add = function(p, v) {
        if (this.intervalHash[v]) throw new Error("id " + v + " is already registered.");
        if (v == null) {
          for (; this.intervalHash[this._autoIncrement]; ) this._autoIncrement++;
          v = this._autoIncrement;
        }
        var o = new w(p, v, this.startKey, this.endKey);
        this.pointTree.insert([o.start, v]), this.pointTree.insert([o.end, v]), this.intervalHash[v] = o, this._autoIncrement++, l.call(this, this.root, o);
      }, s.prototype.search = function(p, v) {
        var o = [];
        if (typeof p != "number") throw new Error(p + ": invalid input");
        if (v == null) f.call(this, this.root, p, o);
        else {
          if (typeof v != "number") throw new Error(p + "," + v + ": invalid input");
          c.call(this, p, v, o);
        }
        return o;
      }, s.prototype.remove = function(p) {
      }, h.prototype.insert = function(p) {
        this.starts.insert(p), this.ends.insert(p);
      }, w.prototype.result = function(p, v) {
        var o = { id: this.id, data: this.data };
        if (typeof p == "number" && typeof v == "number") {
          var C = Math.max(this.start, p), F = Math.min(this.end, v), U = F - C;
          o.rate1 = U / (v - p), o.rate2 = U / (this.end - this.start);
        }
        return o;
      }, t.exports = s;
    }, function(t, n) {
      var i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(l) {
        return typeof l;
      } : function(l) {
        return l && typeof Symbol == "function" && l.constructor === Symbol && l !== Symbol.prototype ? "symbol" : typeof l;
      }, s = function l() {
        var f = null, c = {}, h = arguments;
        ["0", "1"].forEach(function(w) {
          var B = h[w];
          Array.isArray(B) ? f = B : B && (typeof B > "u" ? "undefined" : i(B)) == "object" && (c = B);
        }), typeof c.filter == "function" && (this._filter = c.filter), typeof c.compare == "function" ? this._compare = c.compare : typeof c.compare == "string" && l.compares[c.compare] && (this._compare = l.compares[c.compare]), this._unique = !!c.unique, c.resume && f ? f.forEach(function(w, B) {
          this.push(w);
        }, this) : f && this.insert.apply(this, f);
      };
      s.create = function(l, f) {
        return new s(l, f);
      }, s.prototype = new Array(), s.prototype.constructor = Array.prototype.constructor, s.prototype.insertOne = function(l) {
        var f = this.bsearch(l);
        return (!this._unique || this.key(l, f) == null) && !!this._filter(l, f) && (this.splice(f + 1, 0, l), f + 1);
      }, s.prototype.insert = function() {
        return Array.prototype.map.call(arguments, function(l) {
          return this.insertOne(l);
        }, this);
      }, s.prototype.remove = function(l) {
        return this.splice(l, 1), this;
      }, s.prototype.bsearch = function(l) {
        if (!this.length) return -1;
        for (var f, c = 0, h = this.length; h - c > 1; ) {
          f = Math.floor((c + h) / 2);
          var w = this[f], B = this._compare(l, w);
          if (B == 0) return f;
          B > 0 ? c = f : h = f;
        }
        return c == 0 && this._compare(this[0], l) > 0 ? -1 : c;
      }, s.prototype.key = function(l, f) {
        f == null && (f = this.bsearch(l));
        var c = f;
        if (c == -1 || this._compare(this[c], l) < 0) return c + 1 < this.length && this._compare(this[c + 1], l) == 0 ? c + 1 : null;
        for (; c >= 1 && this._compare(this[c - 1], l) == 0; ) c--;
        return c;
      }, s.prototype.keys = function(l, f) {
        var c = [];
        f == null && (f = this.bsearch(l));
        for (var h = f; h >= 0 && this._compare(this[h], l) == 0; ) c.push(h), h--;
        var w = this.length;
        for (h = f + 1; h < w && this._compare(this[h], l) == 0; ) c.push(h), h++;
        return c.length ? c : null;
      }, s.prototype.unique = function(l) {
        if (l) return this.filter(function(c, h) {
          return h == 0 || this._compare(this[h - 1], c) != 0;
        }, this);
        var f = 0;
        return this.map(function(c, h) {
          return h == 0 || this._compare(this[h - 1], c) != 0 ? null : h - f++;
        }, this).forEach(function(c) {
          c != null && this.remove(c);
        }, this), this;
      }, s.prototype.toArray = function() {
        return this.slice();
      }, s.prototype._filter = function(l, f) {
        return !0;
      }, s.compares = { number: function(l, f) {
        var c = l - f;
        return c > 0 ? 1 : c == 0 ? 0 : -1;
      }, string: function(l, f) {
        return l > f ? 1 : l == f ? 0 : -1;
      } }, s.prototype._compare = s.compares.string, t.exports = s;
    }, function(t, n, i) {
      function s(w) {
        var B = new c.Variable(w.targetPos);
        return B.node = w, B;
      }
      function l(w, B) {
        if (w.length > 0) {
          B = f.extend(h, B), w.forEach(function(R, j) {
            R.targetPos = R.parent ? R.parent.currentPos : R.idealPos, R.index = j;
          });
          for (var p = w.concat().sort(function(R, j) {
            var dA = R.targetPos - j.targetPos;
            if (dA !== 0) return dA;
            var fA = R.isStub() - j.isStub();
            return fA !== 0 ? fA : R.index - j.index;
          }).map(s), v = [], o = 1; o < p.length; o++) {
            var C = p[o - 1], F = p[o], U = void 0;
            U = C.node.isStub() && F.node.isStub() ? (C.node.width + F.node.width) / 2 + B.lineSpacing : (C.node.width + F.node.width) / 2 + B.nodeSpacing, v.push(new c.Constraint(C, F, U));
          }
          if (f.isDefined(B.minPos)) {
            var S = new c.Variable(B.minPos, 1e10), O = p[0];
            v.push(new c.Constraint(S, O, O.node.width / 2)), p.unshift(S);
          }
          if (f.isDefined(B.maxPos)) {
            var b = new c.Variable(B.maxPos, 1e10), P = f.last(p);
            v.push(new c.Constraint(P, b, P.node.width / 2)), p.push(b);
          }
          new c.Solver(p, v).solve(), p.filter(function(R) {
            return R.node;
          }).map(function(R) {
            return R.node.currentPos = Math.round(R.position()), R;
          });
        }
        return w;
      }
      var f = i(4), c = i(9), h = { lineSpacing: 2, nodeSpacing: 3, minPos: 0, maxPos: null };
      l.DEFAULT_OPTIONS = h, t.exports = l;
    }, function(t, n) {
      var i = {}, s = function() {
        function B(p) {
          this.scale = p, this.AB = 0, this.AD = 0, this.A2 = 0;
        }
        return B.prototype.addVariable = function(p) {
          var v = this.scale / p.scale, o = p.offset / p.scale, C = p.weight;
          this.AB += C * v * o, this.AD += C * v * p.desiredPosition, this.A2 += C * v * v;
        }, B.prototype.getPosn = function() {
          return (this.AD - this.AB) / this.A2;
        }, B;
      }();
      i.PositionStats = s;
      var l = function() {
        function B(p, v, o, C) {
          C === void 0 && (C = !1), this.left = p, this.right = v, this.gap = o, this.equality = C, this.active = !1, this.unsatisfiable = !1, this.left = p, this.right = v, this.gap = o, this.equality = C;
        }
        return B.prototype.slack = function() {
          return this.unsatisfiable ? Number.MAX_VALUE : this.right.scale * this.right.position() - this.gap - this.left.scale * this.left.position();
        }, B;
      }();
      i.Constraint = l;
      var f = function() {
        function B(p, v, o) {
          v === void 0 && (v = 1), o === void 0 && (o = 1), this.desiredPosition = p, this.weight = v, this.scale = o, this.offset = 0;
        }
        return B.prototype.dfdv = function() {
          return 2 * this.weight * (this.position() - this.desiredPosition);
        }, B.prototype.position = function() {
          return (this.block.ps.scale * this.block.posn + this.offset) / this.scale;
        }, B.prototype.visitNeighbours = function(p, v) {
          var o = function(C, F) {
            return C.active && p !== F && v(C, F);
          };
          this.cOut.forEach(function(C) {
            return o(C, C.right);
          }), this.cIn.forEach(function(C) {
            return o(C, C.left);
          });
        }, B;
      }();
      i.Variable = f;
      var c = function() {
        function B(p) {
          this.vars = [], p.offset = 0, this.ps = new s(p.scale), this.addVariable(p);
        }
        return B.prototype.addVariable = function(p) {
          p.block = this, this.vars.push(p), this.ps.addVariable(p), this.posn = this.ps.getPosn();
        }, B.prototype.updateWeightedPosition = function() {
          this.ps.AB = this.ps.AD = this.ps.A2 = 0;
          for (var p = 0, v = this.vars.length; p < v; ++p) this.ps.addVariable(this.vars[p]);
          this.posn = this.ps.getPosn();
        }, B.prototype.compute_lm = function(p, v, o) {
          var C = this, F = p.dfdv();
          return p.visitNeighbours(v, function(U, S) {
            var O = C.compute_lm(S, p, o);
            S === U.right ? (F += O * U.left.scale, U.lm = O) : (F += O * U.right.scale, U.lm = -O), o(U);
          }), F / p.scale;
        }, B.prototype.populateSplitBlock = function(p, v) {
          var o = this;
          p.visitNeighbours(v, function(C, F) {
            F.offset = p.offset + (F === C.right ? C.gap : -C.gap), o.addVariable(F), o.populateSplitBlock(F, p);
          });
        }, B.prototype.traverse = function(p, v, o, C) {
          var F = this;
          o === void 0 && (o = this.vars[0]), C === void 0 && (C = null), o.visitNeighbours(C, function(U, S) {
            v.push(p(U)), F.traverse(p, v, S, o);
          });
        }, B.prototype.findMinLM = function() {
          var p = null;
          return this.compute_lm(this.vars[0], null, function(v) {
            !v.equality && (p === null || v.lm < p.lm) && (p = v);
          }), p;
        }, B.prototype.findMinLMBetween = function(p, v) {
          this.compute_lm(p, null, function() {
          });
          var o = null;
          return this.findPath(p, null, v, function(C, F) {
            !C.equality && C.right === F && (o === null || C.lm < o.lm) && (o = C);
          }), o;
        }, B.prototype.findPath = function(p, v, o, C) {
          var F = this, U = !1;
          return p.visitNeighbours(v, function(S, O) {
            U || O !== o && !F.findPath(O, p, o, C) || (U = !0, C(S, O));
          }), U;
        }, B.prototype.isActiveDirectedPathBetween = function(p, v) {
          if (p === v) return !0;
          for (var o = p.cOut.length; o--; ) {
            var C = p.cOut[o];
            if (C.active && this.isActiveDirectedPathBetween(C.right, v)) return !0;
          }
          return !1;
        }, B.split = function(p) {
          return p.active = !1, [B.createSplitBlock(p.left), B.createSplitBlock(p.right)];
        }, B.createSplitBlock = function(p) {
          var v = new B(p);
          return v.populateSplitBlock(p, null), v;
        }, B.prototype.splitBetween = function(p, v) {
          var o = this.findMinLMBetween(p, v);
          if (o !== null) {
            var C = B.split(o);
            return { constraint: o, lb: C[0], rb: C[1] };
          }
          return null;
        }, B.prototype.mergeAcross = function(p, v, o) {
          v.active = !0;
          for (var C = 0, F = p.vars.length; C < F; ++C) {
            var U = p.vars[C];
            U.offset += o, this.addVariable(U);
          }
          this.posn = this.ps.getPosn();
        }, B.prototype.cost = function() {
          for (var p = 0, v = this.vars.length; v--; ) {
            var o = this.vars[v], C = o.position() - o.desiredPosition;
            p += C * C * o.weight;
          }
          return p;
        }, B;
      }();
      i.Block = c;
      var h = function() {
        function B(p) {
          this.vs = p;
          var v = p.length;
          for (this.list = new Array(v); v--; ) {
            var o = new c(p[v]);
            this.list[v] = o, o.blockInd = v;
          }
        }
        return B.prototype.cost = function() {
          for (var p = 0, v = this.list.length; v--; ) p += this.list[v].cost();
          return p;
        }, B.prototype.insert = function(p) {
          p.blockInd = this.list.length, this.list.push(p);
        }, B.prototype.remove = function(p) {
          var v = this.list.length - 1, o = this.list[v];
          this.list.length = v, p !== o && (this.list[p.blockInd] = o, o.blockInd = p.blockInd);
        }, B.prototype.merge = function(p) {
          var v = p.left.block, o = p.right.block, C = p.right.offset - p.left.offset - p.gap;
          v.vars.length < o.vars.length ? (o.mergeAcross(v, p, C), this.remove(v)) : (v.mergeAcross(o, p, -C), this.remove(o));
        }, B.prototype.forEach = function(p) {
          this.list.forEach(p);
        }, B.prototype.updateBlockPositions = function() {
          this.list.forEach(function(p) {
            return p.updateWeightedPosition();
          });
        }, B.prototype.split = function(p) {
          var v = this;
          this.updateBlockPositions(), this.list.forEach(function(o) {
            var C = o.findMinLM();
            C !== null && C.lm < w.LAGRANGIAN_TOLERANCE && (o = C.left.block, c.split(C).forEach(function(F) {
              return v.insert(F);
            }), v.remove(o), p.push(C));
          });
        }, B;
      }();
      i.Blocks = h;
      var w = function() {
        function B(p, v) {
          this.vs = p, this.cs = v, this.vs = p, p.forEach(function(o) {
            o.cIn = [], o.cOut = [];
          }), this.cs = v, v.forEach(function(o) {
            o.left.cOut.push(o), o.right.cIn.push(o);
          }), this.inactive = v.map(function(o) {
            return o.active = !1, o;
          }), this.bs = null;
        }
        return B.prototype.cost = function() {
          return this.bs.cost();
        }, B.prototype.setStartingPositions = function(p) {
          this.inactive = this.cs.map(function(v) {
            return v.active = !1, v;
          }), this.bs = new h(this.vs), this.bs.forEach(function(v, o) {
            return v.posn = p[o];
          });
        }, B.prototype.setDesiredPositions = function(p) {
          this.vs.forEach(function(v, o) {
            return v.desiredPosition = p[o];
          });
        }, B.prototype.mostViolated = function() {
          for (var p = Number.MAX_VALUE, v = null, o = this.inactive, C = o.length, F = C, U = 0; U < C; ++U) {
            var S = o[U];
            if (!S.unsatisfiable) {
              var O = S.slack();
              if ((S.equality || O < p) && (p = O, v = S, F = U, S.equality)) break;
            }
          }
          return F !== C && (p < B.ZERO_UPPERBOUND && !v.active || v.equality) && (o[F] = o[C - 1], o.length = C - 1), v;
        }, B.prototype.satisfy = function() {
          this.bs == null && (this.bs = new h(this.vs)), this.bs.split(this.inactive);
          for (var p = null; (p = this.mostViolated()) && (p.equality || p.slack() < B.ZERO_UPPERBOUND && !p.active); ) {
            var v = p.left.block, o = p.right.block;
            if (v !== o) this.bs.merge(p);
            else {
              if (v.isActiveDirectedPathBetween(p.right, p.left)) {
                p.unsatisfiable = !0;
                continue;
              }
              var C = v.splitBetween(p.left, p.right);
              if (C === null) {
                p.unsatisfiable = !0;
                continue;
              }
              this.bs.insert(C.lb), this.bs.insert(C.rb), this.bs.remove(v), this.inactive.push(C.constraint), p.slack() >= 0 ? this.inactive.push(p) : this.bs.merge(p);
            }
          }
        }, B.prototype.solve = function() {
          this.satisfy();
          for (var p = Number.MAX_VALUE, v = this.bs.cost(); Math.abs(p - v) > 1e-4; ) this.satisfy(), p = v, v = this.bs.cost();
          return v;
        }, B.LAGRANGIAN_TOLERANCE = -1e-4, B.ZERO_UPPERBOUND = -1e-10, B;
      }();
      i.Solver = w, t.exports = i;
    }, function(t, n, i) {
      function s(p) {
        this.options = B.extend({ layerGap: 60, nodeHeight: 10, direction: "down" }, p);
      }
      function l(p) {
        return "L " + p.join(" ");
      }
      function f(p) {
        return "M " + p.join(" ");
      }
      function c(p, v, o) {
        return "C " + p.join(" ") + " " + v.join(" ") + " " + o.join(" ");
      }
      function h(p, v) {
        var o = (p[1] + v[1]) / 2;
        return c([p[0], o], [v[0], o], v);
      }
      function w(p, v) {
        var o = (p[0] + v[0]) / 2;
        return c([o, p[1]], [o, v[1]], v);
      }
      var B = i(4);
      s.lineTo = l, s.moveTo = f, s.curveTo = c, s.vCurveBetween = h, s.hCurveBetween = w, s.prototype.getWaypoints = function(p) {
        var v = this.options, o = v.direction, C = p.getPathFromRoot(), F = v.nodeHeight + v.layerGap;
        return o === "left" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, S) {
          var O = F * (S + 1) * -1;
          return [[O + v.nodeHeight, U.currentPos], [O, U.currentPos]];
        })) : o === "right" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, S) {
          var O = F * (S + 1);
          return [[O - v.nodeHeight, U.currentPos], [O, U.currentPos]];
        })) : o === "up" ? [[[C[0].idealPos, 0]]].concat(C.map(function(U, S) {
          var O = F * (S + 1) * -1;
          return [[U.currentPos, O + v.nodeHeight], [U.currentPos, O]];
        })) : [[[C[0].idealPos, 0]]].concat(C.map(function(U, S) {
          var O = F * (S + 1);
          return [[U.currentPos, O - v.nodeHeight], [U.currentPos, O]];
        }));
      }, s.prototype.layout = function(p) {
        var v = this.options, o = v.layerGap + v.nodeHeight;
        switch (v.direction) {
          case "left":
            p.forEach(function(C) {
              var F = C.getLayerIndex() * o + v.layerGap;
              C.x = -F - v.nodeHeight, C.y = C.currentPos, C.dx = v.nodeHeight, C.dy = C.width;
            });
            break;
          case "right":
            p.forEach(function(C) {
              var F = C.getLayerIndex() * o + v.layerGap;
              C.x = F, C.y = C.currentPos, C.dx = v.nodeHeight, C.dy = C.width;
            });
            break;
          case "up":
            p.forEach(function(C) {
              var F = C.getLayerIndex() * o + v.layerGap;
              C.x = C.currentPos, C.y = -F - v.nodeHeight, C.dx = C.width, C.dy = v.nodeHeight;
            });
            break;
          default:
          case "down":
            p.forEach(function(C) {
              var F = C.getLayerIndex() * o + v.layerGap;
              C.x = C.currentPos, C.y = F, C.dx = C.width, C.dy = v.nodeHeight;
            });
        }
        return p;
      }, s.prototype.generatePath = function(p) {
        var v = this.options, o = v.direction, C = this.getWaypoints(p, o), F = [f(C[0][0])];
        return o === "left" || o === "right" ? C.reduce(function(U, S, O) {
          return F.push(w(U[U.length - 1], S[0])), O < C.length - 1 && F.push(l(S[1])), S;
        }) : C.reduce(function(U, S, O) {
          return F.push(h(U[U.length - 1], S[0])), O < C.length - 1 && F.push(l(S[1])), S;
        }), F.join(" ");
      }, t.exports = s;
    }]);
  });
})(I0);
var H0 = I0.exports;
const S0 = /* @__PURE__ */ vc(H0), o4 = /* @__PURE__ */ Tb({
  __proto__: null,
  default: S0
}, [H0]);
function s4(A) {
  return A.slice().sort(function(e, t) {
    return e - t;
  });
}
function qw(A, e) {
  for (var t = [], n = 0; n < A; n++) {
    for (var i = [], s = 0; s < e; s++)
      i.push(0);
    t.push(i);
  }
  return t;
}
function u4(A) {
  for (var e = 0, t, n = 0; n < A.length; n++)
    (n === 0 || A[n] !== t) && (t = A[n], e++);
  return e;
}
function sd(A, e, t, n) {
  var i;
  if (A > 0) {
    var s = (t[e] - t[A - 1]) / (e - A + 1);
    i = n[e] - n[A - 1] - (e - A + 1) * s * s;
  } else
    i = n[e] - t[e] * t[e] / (e + 1);
  return i < 0 ? 0 : i;
}
function ud(A, e, t, n, i, s, l) {
  if (!(A > e)) {
    var f = Math.floor((A + e) / 2);
    n[t][f] = n[t - 1][f - 1], i[t][f] = f;
    var c = t;
    A > t && (c = Math.max(c, i[t][A - 1] || 0)), c = Math.max(c, i[t - 1][f] || 0);
    var h = f - 1;
    e < n[0].length - 1 && (h = Math.min(h, i[t][e + 1] || 0));
    for (var w, B, p, v, o = h; o >= c && (w = sd(o, f, s, l), !(w + n[t - 1][c - 1] >= n[t][f])); --o)
      B = sd(c, f, s, l), p = B + n[t - 1][c - 1], p < n[t][f] && (n[t][f] = p, i[t][f] = c), c++, v = w + n[t - 1][o - 1], v < n[t][f] && (n[t][f] = v, i[t][f] = o);
    ud(
      A,
      f - 1,
      t,
      n,
      i,
      s,
      l
    ), ud(
      f + 1,
      e,
      t,
      n,
      i,
      s,
      l
    );
  }
}
function l4(A, e, t) {
  for (var n = e[0].length, i = A[Math.floor(n / 2)], s = [], l = [], f = 0, c = void 0; f < n; ++f)
    c = A[f] - i, f === 0 ? (s.push(c), l.push(c * c)) : (s.push(s[f - 1] + c), l.push(
      l[f - 1] + c * c
    )), e[0][f] = sd(0, f, s, l), t[0][f] = 0;
  for (var h, w = 1; w < e.length; ++w)
    w < e.length - 1 ? h = w : h = n - 1, ud(
      h,
      n - 1,
      w,
      e,
      t,
      s,
      l
    );
}
function c4(A, e) {
  if (e > A.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var t = s4(A), n = u4(t);
  if (n === 1)
    return [t];
  var i = qw(e, t.length), s = qw(e, t.length);
  l4(t, i, s);
  for (var l = [], f = s[0].length - 1, c = s.length - 1; c >= 0; c--) {
    var h = s[c][f];
    l[c] = t.slice(h, f + 1), c > 0 && (f = h - 1);
  }
  return l;
}
const zw = function(A) {
  var e = {}, t = { nClusters: 6 }, n = Te.merge({}, t, A);
  return e.createClustersFromGenes = function(i) {
    var s = [];
    if (i.length < 1)
      return s;
    var l = Math.min(n.nClusters, i.length), f = i.map(function(B) {
      return B.midpoint;
    });
    let c = c4(f, l);
    for (var h = [], w = 0; w < c.length; w++)
      h.push([]);
    return i.map(function(B) {
      let p = c.findIndex(function(v) {
        return v.includes(B.midpoint);
      });
      h[p].push(B);
    }), h.map(function(B) {
      if (B.length < 2)
        s.push.apply(s, B);
      else {
        var p = B.reduce(function(C, F) {
          return C + F.midpoint;
        }, 0) / B.length, v = B.reduce(function(C, F) {
          return C + F.id.toString();
        }, ""), o = {
          genesList: B,
          midpoint: p,
          type: "geneslist",
          id: v.toString()
        };
        s.push(o);
      }
    }), s;
  }, e.nClusters = function(i) {
    return arguments.length ? (n.nClusters = i, e) : n.nClusters;
  }, e;
};
var ph = S0 || o4;
const f4 = function(A) {
  var e = {
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
  }, t = Te.merge({}, e, A), n = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(B, p, v, o) {
    var C = 4, F = p / 3, U = F / v * C, S = U * B > o;
    if (S)
      return 2;
    var O = p * (0.1 + 0.1 / B);
    return F = p - O, U = F / v * C, S = U * B > o, S ? 1 : 0;
  }, s = function(B, p, v, o, C) {
    var F = 3.5;
    let U = {};
    return U.scale = B, U.availableHeight = C, U.lineSpacing = 1, U.layerGap = p * (0.1 + 0.1 / B), U.spaceForLabel = p - U.layerGap, U.setFontSize = Math.min(
      U.spaceForLabel / v * F,
      o / t.scale
    ), U.nodeSpacing = U.setFontSize, U.nLabels = 0.4 * C / (U.nodeSpacing + U.lineSpacing), U.density = 1, U;
  }, l = function(B, p, v, o, C) {
    var F = 3.5, U = {};
    return U.scale = B, U.availableHeight = C, U.lineSpacing = 1, U.setFontSize = Math.min(
      p / 3 / v * F,
      o / t.scale
    ), U.nodeSpacing = U.setFontSize, U.spaceForLabel = 1.3 * v * U.setFontSize / F, U.layerGap = Math.min(5 * U.setFontSize, p / 3), U.density = 0.9, U.nLabels = 0.6 * C / (U.nodeSpacing + U.lineSpacing), U;
  }, f = function(B, p, v, o) {
    o.forEach(function(F) {
      F.displayed = !0, F.fontSize = v.setFontSize;
    });
    var C = o.map(function(F) {
      return new ph.Node(p(F.midpoint), v.setFontSize, F);
    });
    try {
      B.nodes(C).compute();
    } catch (F) {
      if (F instanceof RangeError)
        return null;
      throw F;
    }
    return C;
  }, c = function(B) {
    let p = B.annotations.allGenes.filter(function(aA) {
      return aA.globalIndex < t.nGenesToDisplay;
    });
    var v = t.layout.width, o = t.layout.height * Math.min(1, 0.2 + B.length / t.longestChromosome), C = p.reduce(function(aA, BA) {
      return Math.max(aA, BA.label.length);
    }, 0), F = 1.1 * t.displayedFontSize, U = 0.9 * t.displayedFontSize, S = i(
      t.scale,
      v,
      C,
      F
    ), O;
    S == 2 ? O = l(
      t.scale,
      v,
      C,
      U,
      o
    ) : S == 1 ? O = s(
      t.scale,
      v,
      C,
      U,
      o
    ) : S == 0 && (O = s(
      t.scale,
      v,
      C,
      U,
      o
    ), O.nLabels = 0);
    var b = n();
    let P = {
      nodeSpacing: O.nodeSpacing,
      lineSpacing: O.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: O.availableHeight,
      density: O.density
    };
    var R = new ph.Force(P);
    p.forEach(function(aA) {
      aA.displayed = !1;
    });
    var j = t.manualLabels ? new Set(
      p.filter(function(aA) {
        return aA.visible;
      })
    ) : /* @__PURE__ */ new Set();
    t.autoLabels && p.slice(0, O.nLabels).filter(function(aA) {
      return !aA.hidden;
    }).forEach(function(aA) {
      j.add(aA);
    });
    var dA = Array.from(j), fA = f(R, b, O, dA);
    !fA == 0 && (R.options({ algorithm: "simple" }), fA = f(R, b, O, dA));
    var mA;
    if (fA && fA.length > 0) {
      var FA = fA.map(function(aA) {
        return aA.getLayerIndex();
      });
      mA = Math.max.apply(null, FA);
    }
    if (!fA || mA > 3) {
      var NA = zw().nClusters(Math.max(O.nLabels, 1));
      try {
        var bA = NA.createClustersFromGenes(dA);
      } catch {
        bA = [];
      }
      fA = f(R, b, O, bA);
    }
    let z = {
      direction: "right",
      layerGap: O.layerGap,
      nodeHeight: O.spaceForLabel
    };
    var QA = new ph.Renderer(z);
    return QA.layout(fA), fA.forEach(function(aA) {
      aA.data.path = QA.generatePath(aA);
    }), t.manualLabels || qh(".gene-annotation").remove(), fA;
  }, h = function(B) {
    var p = zw(), v = B.annotations.genes, o = p.createClustersFromGenes(v);
    return o;
  };
  let w = {};
  return w.layoutChromosome = function(B) {
    B.layout.annotationNodes = c(B) || B.layout.annotationNodes;
  }, w.computeChromosomeClusters = function(B) {
    B.layout.annotationClusters = h(B), B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice();
  }, w.expandAllChromosomeClusters = function(B) {
    B.layout.annotationDisplayClusters = B.annotations.genes;
  }, w.collapseAllChromosomeClusters = function(B) {
    B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice();
  }, w.expandAChromosomeCluster = function(B, p) {
    B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice(), p.genesList.forEach(function(o) {
      B.layout.annotationDisplayClusters.push(o);
    });
    var v = B.layout.annotationDisplayClusters.indexOf(p);
    B.layout.annotationDisplayClusters.splice(v, 1);
  }, w.computeNormalisedGeneScores = function(B) {
    var p = B.reduce(function(F, U) {
      return F.concat(
        U.annotations.genes.filter(function(S) {
          return S.displayed;
        })
      );
    }, []), v = p.every(function(F) {
      return F.score;
    });
    if (v) {
      var o = p.reduce(function(F, U) {
        return Math.max(F, U.score);
      }, 0), C = p.reduce(function(F, U) {
        return Math.min(F, U.score);
      }, 0);
      p.forEach(function(F) {
        F.normedScore = 0.5 * (F.score - C) / (o - C) + 0.5;
      });
    } else
      p.forEach(function(F) {
        F.normedScore = null;
      });
  }, w;
}, h4 = function(A) {
  var e = {
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
  }, t = Te.merge({}, e, A), n = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(c) {
    if (c.type == "gene") {
      var h = c;
      return {
        start: h.start,
        end: h.end,
        midpoint: h.midpoint,
        color: h.color,
        data: h
      };
    } else if (c.type == "geneslist") {
      let w = c.genesList.reduce(function(v, o) {
        return Math.max(v, o.end);
      }, 0);
      return {
        start: c.genesList.reduce(function(v, o) {
          return Math.min(v, o.start);
        }, 1 / 0),
        end: w,
        midpoint: c.midpoint,
        color: "#0000FF",
        data: c
      };
    }
  }, s = function(c) {
    n();
    var h = c.layout.geneBandDisplayClusters, w = h.map(i);
    return w;
  }, l = function(c) {
    var h = c.annotations.allGenes.filter(function(C) {
      return C.globalIndex < t.nGenesToDisplay;
    });
    h.sort(function(C, F) {
      return C.midpoint - F.midpoint;
    });
    for (var w = [], B = 0; B < h.length; ) {
      let C = B;
      for (; C < h.length && h[B].midpoint == h[C].midpoint; )
        C++;
      if (C - B == 1)
        w.push(h[B]), B++;
      else {
        var p = h.slice(B, C), v = p.reduce(function(U, S) {
          return U + S.id.toString();
        }, ""), o = {
          genesList: p,
          midpoint: p[0].midpoint,
          type: "geneslist",
          id: v
        };
        w.push(o), B = C;
      }
    }
    return w.sort(function(C, F) {
      return C.midpoint < F.midpoint;
    }), w;
  };
  let f = {};
  return f.layoutChromosome = function(c) {
    c.layout.geneBandNodes = s(c);
  }, f.computeChromosomeClusters = function(c) {
    let h = c.layout;
    h.geneBandClusters = l(c), h.geneBandDisplayClusters = h.geneBandClusters.slice();
  }, f.expandAllChromosomeClusters = function(c) {
    let h = c.layout;
    h.geneBandDisplayClusters = c.annotations.allGenes;
  }, f.collapseAllChromosomeClusters = function(c) {
    let h = c.layout;
    h.geneBandDisplayClusters = h.geneBandClusters.slice();
  }, f.expandAChromosomeCluster = function(c, h) {
    let w = c.layout;
    w.geneBandDisplayClusters = w.geneBandClusters.slice(), h.genesList.forEach(function(p) {
      w.geneBandDisplayClusters.push(p);
    });
    var B = w.geneBandDisplayClusters.indexOf(h);
    w.geneBandDisplayClusters.splice(B, 1);
  }, f;
}, d4 = function(A) {
  var e = {
    onNetworkBtnClick: oe.noop,
    onFitBtnClick: oe.noop,
    onTagBtnClick: oe.noop,
    onLabelBtnClick: oe.noop,
    onQtlBtnClick: oe.noop,
    onResetBtnClick: oe.noop,
    onSetNumberPerRowClick: oe.noop,
    onExportBtnClick: oe.noop,
    onExportAllBtnClick: oe.noop,
    onExpandBtnClick: oe.noop,
    maxSnpPValueProperty: oe.noop,
    nGenesToDisplayProperty: oe.noop,
    annotationLabelSizeProperty: oe.noop,
    initialMaxGenes: 200,
    initialNPerRow: 10
  }, t = Te.merge({}, e, A), n, i = function() {
    oe(this).hasClass("disabled") || t.onNetworkBtnClick();
  }, s = function() {
    oe(this).hasClass("disabled") || t.onTagBtnClick();
  }, l = function() {
    oe(this).hasClass("disabled") || t.onFitBtnClick();
  }, f = function() {
    if (oe(this).hasClass("disabled"))
      return;
    const p = new Event("change"), v = document.getElementById("select-label-btn");
    v.value = "auto", v.dispatchEvent(p);
    const o = document.getElementById("select-ngenes-dropdown");
    o.value = "50", o.dispatchEvent(p), t.onResetBtnClick();
  }, c = function() {
    t.onExpandBtnClick();
  }, h = function(p, v, o, C, F) {
    var U = "select-" + v, S = p.selectAll("select").data([null]);
    S.enter().append("select").attr("id", U).attr("name", U).attr("class", "menu-dropdown");
    const O = document.getElementById(U);
    if (!O) {
      console.log("Failed to find the select element.");
      return;
    }
    O.innerHTML = "", o.forEach(function(b) {
      var P = document.createElement("option");
      P.value = b[1], P.textContent = b[0], b[1] === F && (P.selected = !0), O.appendChild(P);
    }), O.addEventListener("change", function() {
      var b = O.options[O.selectedIndex], P = b.value;
      C(P);
    });
  }, w = function() {
    var p = XA(n).selectAll(".genemap-menu").data([null]);
    p.enter().append("div").classed("genemap-menu", !0);
    var v = p.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), o = v.selectAll("span").data(function(mA, FA) {
      return mA;
    });
    o.enter().append("span"), v.selectAll("span").attr("class", function(mA) {
      return mA;
    }), p.select(".network-btn").attr("title", "Launch network view").on("click", i), p.select(".tag-btn").on("click", s);
    var C = p.select(".label-btn");
    h(
      C,
      "label-btn",
      [
        ["Auto labels", "auto"],
        ["Checked labels", "show"],
        ["No labels", "hide"]
      ],
      t.onLabelBtnClick,
      "Auto labels"
    ), p.select(".fit-btn").attr("title", "Reset pan and zoom").on("click", l), p.select(".reset-btn").attr("title", "Reset selections").on("click", f);
    var F = p.select(".ngenes-dropdown");
    F.text(""), h(
      F,
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
    ), t.nGenesToDisplayProperty.addListener(function(mA) {
      oe("#select-ngenes-dropdown").selectpicker("val", [
        mA + " genes",
        mA
      ]);
    }), p.select(".export-btn").attr("title", "Export to PNG").on("click", t.onExportBtnClick), p.select(".expand-btn").attr("title", "Toggle full screen").on("click", c);
    var U = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    p.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(U, "_blank");
    });
    var S = XA(n).selectAll(".genemap-advanced-menu").data([null]), O = S.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    O.enter().append("div").attr("class", function(mA) {
      return mA;
    });
    var b = S.select(".qtl-btn");
    h(
      b,
      "qtl-btn",
      [
        ["All QTLs", "all"],
        ["Checked QTLs", "selected"],
        ["No QTLs", "none"]
      ],
      t.onQtlBtnClick,
      "All QTLs"
    );
    var P = S.select(".max-snp-pvalue").selectAll("form").data([""]).enter(), R = P.append("form").classed("bootstrap", !0).attr("id", "snp-pvalue-form").attr("class", "bootstrap form-inline");
    R.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), R.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), R.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), oe("#snp-pvalue-form").submit(function(mA) {
      t.maxSnpPValueProperty(oe("#max-snp-pvalue-input").val()), mA.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(mA) {
      oe("#max-snp-pvalue-input").val(mA);
    });
    var j = S.select(".nperrow-spinner"), dA = j.selectAll("input").data(["nPerRowSpinner"]).enter();
    dA.append("span").append("label").classed("bootstrap", !0).attr("for", (mA) => mA).html("Num per row:&nbsp;"), dA.append("span").append("input").attr("id", (mA) => mA).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (mA) => mA), XA(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), oe("#nPerRowSpinner").on("change", function(mA) {
      t.onSetNumberPerRowClick(oe("#nPerRowSpinner").val());
    }), S.select(".export-all-btn").attr("title", "export all to PNG").on("click", t.onExportAllBtnClick), S.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(mA) {
      return mA;
    }), S.select(".labelsize-label").classed("bootstrap", !0), S.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var fA = S.select(".labelsize-dropdown");
    fA.text(""), h(
      fA,
      "labelsize-dropdown",
      [
        ["10", 10],
        ["15", 15],
        ["20", 20],
        ["25", 25]
      ],
      t.annotationLabelSizeProperty,
      t.annotationLabelSizeProperty()
    ), t.annotationLabelSizeProperty.addListener(function(mA) {
      oe("#select-labelsize-dropdown").selectpicker("val", [
        mA,
        mA
      ]);
    });
  };
  function B(p) {
    p.each(function(v) {
      var o = this;
      n = o, w();
    });
  }
  return B.onNetworkBtnClick = function(p) {
    return arguments.length ? (t.onNetworkBtnClick = p, B) : t.onNetworkBtnClick;
  }, B.onTagBtnClick = function(p) {
    return arguments.length ? (t.onTagBtnClick = p, B) : t.onTagBtnClick;
  }, B.onLabelBtnClick = function(p) {
    return arguments.length ? (t.onLabelBtnClick = p, B) : t.onLabelBtnClick;
  }, B.onQtlBtnClick = function(p) {
    return arguments.length ? (t.onQtlBtnClick = p, B) : t.onQtlBtnClick;
  }, B.onFitBtnClick = function(p) {
    return arguments.length ? (t.onFitBtnClick = p, B) : t.onFitBtnClick;
  }, B.onResetBtnClick = function(p) {
    return arguments.length ? (t.onResetBtnClick = p, B) : t.onResetBtnClick;
  }, B.onSetNumberPerRowClick = function(p) {
    return arguments.length ? (t.onSetNumberPerRowClick = p, B) : t.onSetNumberPerRowClick;
  }, B.initialMaxGenes = function(p) {
    return arguments.length ? (t.initialMaxGenes = p, B) : t.initialMaxGenes;
  }, B.initialNPerRow = function(p) {
    return arguments.length ? (t.initialNPerRow = p, B) : t.initialNPerRow;
  }, B.onExportBtnClick = function(p) {
    return arguments.length ? (t.onExportBtnClick = p, B) : t.onExportBtnClick;
  }, B.onExportAllBtnClick = function(p) {
    return arguments.length ? (t.onExportAllBtnClick = p, B) : t.onExportAllBtnClick;
  }, B.onExpandBtnClick = function(p) {
    return arguments.length ? (t.onExpandBtnClick = p, B) : t.onExpandBtnClick;
  }, B.maxSnpPValueProperty = function(p) {
    return arguments.length ? (t.maxSnpPValueProperty = p, B) : t.maxSnpPValueProperty;
  }, B.nGenesToDisplayProperty = function(p) {
    return arguments.length ? (t.nGenesToDisplayProperty = p, B) : t.nGenesToDisplayProperty;
  }, B.annotationLabelSizeProperty = function(p) {
    return arguments.length ? (t.annotationLabelSizeProperty = p, B) : t.annotationLabelSizeProperty;
  }, B.setTabButtonState = function(p) {
    var v = XA(n).select(".tag-btn");
    p === "show" ? (v.classed("show-label", !0), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Show Labels")) : p === "hide" ? (v.classed("show-label", !1), v.classed("hide-label", !0), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Hide Labels")) : p === "manual" ? (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !0), v.attr("title", "Manual Labels")) : (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !0), v.classed("manual-label", !1), v.attr("title", "Automatic Labels"));
  }, B.getTagButtonState = function() {
    var p = XA(n).select(".tag-btn");
    return p.classed("show-label") ? "show" : p.classed("hide-label") ? "hide" : p.classed("auto-label") ? "auto" : "manual";
  }, B.setFitButtonEnabled = function(p) {
    XA(n).select(".fit-btn").classed("disabled", !p);
  }, B.setNetworkButtonEnabled = function(p) {
    XA(n).select(".network-btn").classed("disabled", !p);
  }, B;
};
class p4 {
  constructor(e, t, n) {
    this.distance = e, this.linkage = t, this.threshold = n ?? 1 / 0;
  }
  cluster(e, t, n) {
    this.clusters = [], this.dists = [], this.mins = [], this.index = [];
    for (let l = 0; l < e.length; l++) {
      const f = {
        value: e[l],
        key: l,
        index: l,
        size: 1
      };
      this.clusters[l] = f, this.index[l] = f, this.dists[l] = [], this.mins[l] = 0;
    }
    for (let l = 0; l < this.clusters.length; l++)
      for (let f = 0; f <= l; f++) {
        const c = l === f ? 1 / 0 : this.distance(this.clusters[l].value, this.clusters[f].value);
        this.dists[l][f] = c, this.dists[f][l] = c, c < this.dists[l][this.mins[l]] && (this.mins[l] = f);
      }
    let i = this.mergeClosest(), s = 0;
    for (; i; )
      n && s++ % t === 0 && n(this.clusters), i = this.mergeClosest();
    return this.clusters.forEach((l) => {
      delete l.key, delete l.index;
    }), this.clusters;
  }
  mergeClosest() {
    let e = 0, t = 1 / 0;
    for (let l = 0; l < this.clusters.length; l++) {
      const f = this.clusters[l].key, c = this.dists[f][this.mins[f]];
      c < t && (e = f, t = c);
    }
    if (t >= this.threshold)
      return !1;
    const n = this.index[e], i = this.index[this.mins[e]], s = {
      left: n,
      right: i,
      key: n.key,
      size: n.size + i.size
    };
    this.clusters[n.index] = s, this.clusters.splice(i.index, 1), this.index[n.key] = s;
    for (let l = 0; l < this.clusters.length; l++) {
      const f = this.clusters[l];
      let c;
      n.key === f.key ? c = 1 / 0 : this.linkage === "single" ? (c = this.dists[n.key][f.key], this.dists[n.key][f.key] > this.dists[i.key][f.key] && (c = this.dists[i.key][f.key])) : this.linkage === "complete" ? (c = this.dists[n.key][f.key], this.dists[n.key][f.key] < this.dists[i.key][f.key] && (c = this.dists[i.key][f.key])) : this.linkage === "average" ? c = (this.dists[n.key][f.key] * n.size + this.dists[i.key][f.key] * i.size) / (n.size + i.size) : c = this.distance(f.value, n.value), this.dists[n.key][f.key] = this.dists[f.key][n.key] = c;
    }
    for (let l = 0; l < this.clusters.length; l++) {
      const f = this.clusters[l].key;
      if (this.mins[f] === n.key || this.mins[f] === i.key) {
        let c = f;
        for (let h = 0; h < this.clusters.length; h++) {
          const w = this.clusters[h].key;
          this.dists[f][w] < this.dists[f][c] && (c = w);
        }
        this.mins[f] = c;
      }
      this.clusters[l].index = l;
    }
    return delete n.key, delete i.key, delete n.index, delete i.index, !0;
  }
}
function g4(A, e, t, n, i, s) {
  return t = t || "average", new p4(
    e,
    t,
    n
  ).cluster(A, i, s);
}
const B4 = function() {
  var A = {};
  return A.positionAnnotations = function(e, t, n, i, s, l) {
    for (var f = i, c = l, h = s, w = function(P, R) {
      return f(P) < c(R) && f(R) < c(P);
    }, B = e.sort(function(P, R) {
      return h(P) - h(R);
    }), p = [], v = 0; v < B.length; v++) {
      for (var o = e[v], C = [], F = 0; F < p.length; F++) {
        var U = B[p[F]];
        w(o, U) || C.push(p[F]);
      }
      var S = _.difference(p, C), O = S.map(function(P) {
        return t(B[P]);
      }), b = 0;
      for (b = 1; b < O.length + 1 && O.indexOf(b) !== -1; b++)
        ;
      n(o, b), p.push(v);
    }
    return B;
  }, A.sortQTLAnnotations = function(e) {
    return A.positionAnnotations(
      e,
      function(t) {
        return t.position;
      },
      function(t, n) {
        t.position = n;
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
  }, A.sortQTLLabels = function(e, t, n) {
    var i = e, s = 0.6, l = s * n;
    return A.positionAnnotations(
      i,
      function(f) {
        return f.labelPosition;
      },
      function(f, c) {
        f.labelPosition = c;
      },
      function(f) {
        return t(f.midpoint) - l * f.screenLabel.length / 2;
      },
      function(f) {
        return f.midpoint;
      },
      function(f) {
        return t(f.midpoint) + l * f.screenLabel.length / 2;
      }
    );
  }, A.sortQTLAnnotationsWithLabels = function(e, t, n) {
    var i = e;
    return A.positionAnnotations(
      i,
      function(s) {
        return s.comboPosition;
      },
      function(s, l) {
        s.comboPosition = l;
      },
      function(s) {
        return Math.min(
          t(s.midpoint) - s.label.length * n / 2,
          s.start
        );
      },
      function(s) {
        return s.midpoint;
      },
      function(s) {
        return Math.max(
          t(s.midpoint) + s.label.length * n / 2,
          s.end
        );
      }
    );
  }, A;
}, w4 = function(A) {
  var e = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = Te.merge({}, e, A), n = B4(), i = function() {
    return oa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(o) {
    return o.map(function(C) {
      var F = p(C), U = F.reduce(function(R, j) {
        return Math.min(R, j.start);
      }, 1 / 0), S = F.reduce(function(R, j) {
        return Math.max(R, j.end);
      }, 0), O = F.reduce(function(R, j) {
        return R + (R ? "|" : "") + j.start + "-" + j.end;
      }, ""), b = (U + S) / 2;
      let P;
      return F.length == 1 ? (P = F[0], P.type = "qtl", P.index = C.index, P.parentIndex = C.parentIndex) : P = {
        cluster: C,
        index: C.index,
        parentIndex: C.parentIndex,
        qtlList: F,
        color: F[0].color,
        count: F.length,
        start: U,
        end: S,
        midpoint: b,
        chromosome: F[0].chromosome,
        type: "qtllist",
        id: O
      }, P;
    });
  }, l = function(o) {
    var C = [];
    if (t.showAllQTLs) {
      o.layout.qtlDisplayClusters = o.layout.qtlClusters.slice();
      for (var F = o.layout.qtlDisplayClusters, U = Math.ceil(Math.floor(t.scale - 0.1) / 2); U--; )
        F = B(F);
      for (var S = F.length; ; ) {
        C = s(F), C = n.sortQTLAnnotations(C);
        var O = C.reduce(function(b, P) {
          return Math.max(b, P.position);
        }, 0);
        if (O < 2) {
          if (F = B(F), S == F.length)
            break;
          S = F.length;
        } else
          break;
      }
    } else t.showSelectedQTLs && (o.layout.qtlDisplayClusters = o.annotations.qtls.filter(
      function(b) {
        return b.selected;
      }
    ), F = o.layout.qtlDisplayClusters, C = F.map(function(b) {
      let P = b;
      return P.type = "qtl", P;
    }));
    return C;
  }, f = function(o) {
    var C = Te.groupBy(o, "position");
    return Te.forOwn(C, function(F) {
      var U = 14 / t.scale, S = i();
      F = n.sortQTLLabels(F, S, U), F.forEach(function(O) {
        O.labelPosition > 1 ? O.displayLabel = !1 : (O.displayLabel = !0, O.labelPosition = O.position + 0.4);
      });
    }), o;
  }, c = function(o) {
    var C = l(o);
    C.forEach(function(j) {
      j.displayLabel = !1;
    });
    var F = C.filter(function(j) {
      return j.type == "qtl";
    });
    if (t.showAutoQTLLabels) {
      C = n.sortQTLAnnotations(C);
      var U = C.reduce(function(j, dA) {
        return Math.max(j, dA.position);
      }, 0);
      F.forEach(function(j) {
        j.label.length > 15 ? j.screenLabel = j.label.substring(0, 12) + "..." : j.screenLabel = j.label;
      });
      var S = 14 / t.scale, O = S > 0.6 * t.layout.chromosomeWidth, b = U > 3;
      !b && !O ? (f(F), F.forEach(function(j) {
        j.fontSize = S;
      })) : F.forEach(function(j) {
        j.displayLabel = !1;
      });
    }
    if (t.showSelectedQTLLabels && !t.showAutoQTLLabels) {
      var P = C.filter(function(j) {
        return j.selected;
      });
      S = 14 / t.scale;
      var R = 0.3 * t.layout.chromosomeWidth;
      P.forEach(function(j) {
        j.displayLabel = !0, j.screenLabel = j.label, j.fontSize = Math.min(S, 2 * R);
      }), P = n.sortQTLAnnotationsWithLabels(
        P,
        i(),
        t.annotationLabelSize
      ), P.forEach(function(j) {
        j.position = j.comboPosition, j.labelPosition = j.comboPosition + 0.4;
      });
    }
    return C;
  }, h = function(o, C) {
    if (o.index = C.index, C.index = C.index + 1, o.value)
      o.unit = !0, o.start = o.value.start, o.end = o.value.end;
    else {
      var F = o.left, U = o.right;
      F.parentIndex = o.index, U.parentIndex = o.index, h(F, C), h(U, C), o.unit = F.unit && U.unit && F.start == U.start && F.end == U.end, o.start = Math.min(o.left.start, o.right.start), o.end = Math.max(o.left.end, o.right.end);
    }
  }, w = function(o) {
    var C = g4(
      o.annotations.qtls,
      function(U, S) {
        if (U.end == S.end && U.start == S.start)
          return 0;
        var O = Math.min(U.end, S.end) - Math.max(U.start, S.start), b = U.end - U.start, P = S.end - S.start, R = O, j = Math.abs(b - P);
        return Math.max(0.1, j - R);
      },
      "single",
      null
    ), F = { index: 0 };
    return C.forEach(function(U) {
      h(U, F);
    }), C;
  }, B = function(o) {
    var C = [];
    return o.forEach(function(F) {
      if (F.value || F.unit)
        C.push(F);
      else {
        var U = F.left, S = F.right;
        C.push(U), C.push(S);
      }
    }), C;
  }, p = function(o) {
    return o.size == 1 ? [o.value] : p(o.left).concat(p(o.right));
  };
  let v = {};
  return v.layoutChromosome = function(o) {
    o.layout.qtlNodes = c(o) || o.layout.qtlNodes;
  }, v.computeChromosomeClusters = function(o) {
    o.layout.qtlClusters = w(o);
  }, v;
};
/*!
 * html2canvas 1.4.1 <https://html2canvas.hertzen.com>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ld = function(A, e) {
  return ld = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, ld(A, e);
};
function qn(A, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  ld(A, e);
  function t() {
    this.constructor = A;
  }
  A.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var cd = function() {
  return cd = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, cd.apply(this, arguments);
};
function $t(A, e, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(l) {
      l(s);
    });
  }
  return new (t || (t = Promise))(function(s, l) {
    function f(w) {
      try {
        h(n.next(w));
      } catch (B) {
        l(B);
      }
    }
    function c(w) {
      try {
        h(n.throw(w));
      } catch (B) {
        l(B);
      }
    }
    function h(w) {
      w.done ? s(w.value) : i(w.value).then(f, c);
    }
    h((n = n.apply(A, [])).next());
  });
}
function Tt(A, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, l;
  return l = { next: f(0), throw: f(1), return: f(2) }, typeof Symbol == "function" && (l[Symbol.iterator] = function() {
    return this;
  }), l;
  function f(h) {
    return function(w) {
      return c([h, w]);
    };
  }
  function c(h) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; t; ) try {
      if (n = 1, i && (s = h[0] & 2 ? i.return : h[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, h[1])).done) return s;
      switch (i = 0, s && (h = [h[0] & 2, s.value]), h[0]) {
        case 0:
        case 1:
          s = h;
          break;
        case 4:
          return t.label++, { value: h[1], done: !1 };
        case 5:
          t.label++, i = h[1], h = [0];
          continue;
        case 7:
          h = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (h[0] === 6 || h[0] === 2)) {
            t = 0;
            continue;
          }
          if (h[0] === 3 && (!s || h[1] > s[0] && h[1] < s[3])) {
            t.label = h[1];
            break;
          }
          if (h[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = h;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(h);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      h = e.call(A, t);
    } catch (w) {
      h = [6, w], i = 0;
    } finally {
      n = s = 0;
    }
    if (h[0] & 5) throw h[1];
    return { value: h[0] ? h[1] : void 0, done: !0 };
  }
}
function ul(A, e, t) {
  if (arguments.length === 2) for (var n = 0, i = e.length, s; n < i; n++)
    (s || !(n in e)) && (s || (s = Array.prototype.slice.call(e, 0, n)), s[n] = e[n]);
  return A.concat(s || e);
}
var Gr = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.left = e, this.top = t, this.width = n, this.height = i;
    }
    return A.prototype.add = function(e, t, n, i) {
      return new A(this.left + e, this.top + t, this.width + n, this.height + i);
    }, A.fromClientRect = function(e, t) {
      return new A(t.left + e.windowBounds.left, t.top + e.windowBounds.top, t.width, t.height);
    }, A.fromDOMRectList = function(e, t) {
      var n = Array.from(t).find(function(i) {
        return i.width !== 0;
      });
      return n ? new A(n.left + e.windowBounds.left, n.top + e.windowBounds.top, n.width, n.height) : A.EMPTY;
    }, A.EMPTY = new A(0, 0, 0, 0), A;
  }()
), Lc = function(A, e) {
  return Gr.fromClientRect(A, e.getBoundingClientRect());
}, m4 = function(A) {
  var e = A.body, t = A.documentElement;
  if (!e || !t)
    throw new Error("Unable to get document size");
  var n = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth)), i = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
  return new Gr(0, 0, n, i);
}, Tc = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = A.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, at = function() {
  for (var A = [], e = 0; e < arguments.length; e++)
    A[e] = arguments[e];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, A);
  var t = A.length;
  if (!t)
    return "";
  for (var n = [], i = -1, s = ""; ++i < t; ) {
    var l = A[i];
    l <= 65535 ? n.push(l) : (l -= 65536, n.push((l >> 10) + 55296, l % 1024 + 56320)), (i + 1 === t || n.length > 16384) && (s += String.fromCharCode.apply(String, n), n.length = 0);
  }
  return s;
}, Jw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", v4 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ll = 0; ll < Jw.length; ll++)
  v4[Jw.charCodeAt(ll)] = ll;
var jw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ns = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var cl = 0; cl < jw.length; cl++)
  ns[jw.charCodeAt(cl)] = cl;
var y4 = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    s = ns[A.charCodeAt(n)], l = ns[A.charCodeAt(n + 1)], f = ns[A.charCodeAt(n + 2)], c = ns[A.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return h;
}, C4 = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, Q4 = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, Aa = 5, Rp = 11, gh = 2, F4 = Rp - Aa, L0 = 65536 >> Aa, U4 = 1 << Aa, Bh = U4 - 1, E4 = 1024 >> Aa, b4 = L0 + E4, _4 = b4, x4 = 32, I4 = _4 + x4, H4 = 65536 >> Rp, S4 = 1 << F4, L4 = S4 - 1, Yw = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, T4 = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, D4 = function(A, e) {
  var t = y4(A), n = Array.isArray(t) ? Q4(t) : new Uint32Array(t), i = Array.isArray(t) ? C4(t) : new Uint16Array(t), s = 24, l = Yw(i, s / 2, n[4] / 2), f = n[5] === 2 ? Yw(i, (s + n[4]) / 2) : T4(n, Math.ceil((s + n[4]) / 4));
  return new O4(n[0], n[1], n[2], n[3], l, f);
}, O4 = (
  /** @class */
  function() {
    function A(e, t, n, i, s, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> Aa], t = (t << gh) + (e & Bh), this.data[t];
        if (e <= 65535)
          return t = this.index[L0 + (e - 55296 >> Aa)], t = (t << gh) + (e & Bh), this.data[t];
        if (e < this.highStart)
          return t = I4 - H4 + (e >> Rp), t = this.index[t], t += e >> Aa & L4, t = this.index[t], t = (t << gh) + (e & Bh), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Zw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", N4 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var fl = 0; fl < Zw.length; fl++)
  N4[Zw.charCodeAt(fl)] = fl;
var M4 = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", Am = 50, P4 = 1, T0 = 2, D0 = 3, K4 = 4, R4 = 5, em = 7, O0 = 8, tm = 9, Bi = 10, fd = 11, nm = 12, hd = 13, k4 = 14, rs = 15, dd = 16, hl = 17, zo = 18, $4 = 19, rm = 20, pd = 21, Jo = 22, wh = 23, Ta = 24, on = 25, is = 26, as = 27, Da = 28, G4 = 29, zi = 30, V4 = 31, dl = 32, pl = 33, gd = 34, Bd = 35, wd = 36, Hs = 37, md = 38, $l = 39, Gl = 40, mh = 41, N0 = 42, W4 = 43, X4 = [9001, 65288], M0 = "!", Ee = "×", gl = "÷", vd = D4(M4), Or = [zi, wd], yd = [P4, T0, D0, R4], P0 = [Bi, O0], im = [as, is], q4 = yd.concat(P0), am = [md, $l, Gl, gd, Bd], z4 = [rs, hd], J4 = function(A, e) {
  e === void 0 && (e = "strict");
  var t = [], n = [], i = [];
  return A.forEach(function(s, l) {
    var f = vd.get(s);
    if (f > Am ? (i.push(!0), f -= Am) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(s) !== -1)
      return n.push(l), t.push(dd);
    if (f === K4 || f === fd) {
      if (l === 0)
        return n.push(l), t.push(zi);
      var c = t[l - 1];
      return q4.indexOf(c) === -1 ? (n.push(n[l - 1]), t.push(c)) : (n.push(l), t.push(zi));
    }
    if (n.push(l), f === V4)
      return t.push(e === "strict" ? pd : Hs);
    if (f === N0 || f === G4)
      return t.push(zi);
    if (f === W4)
      return s >= 131072 && s <= 196605 || s >= 196608 && s <= 262141 ? t.push(Hs) : t.push(zi);
    t.push(f);
  }), [n, t, i];
}, vh = function(A, e, t, n) {
  var i = n[t];
  if (Array.isArray(A) ? A.indexOf(i) !== -1 : A === i)
    for (var s = t; s <= n.length; ) {
      s++;
      var l = n[s];
      if (l === e)
        return !0;
      if (l !== Bi)
        break;
    }
  if (i === Bi)
    for (var s = t; s > 0; ) {
      s--;
      var f = n[s];
      if (Array.isArray(A) ? A.indexOf(f) !== -1 : A === f)
        for (var c = t; c <= n.length; ) {
          c++;
          var l = n[c];
          if (l === e)
            return !0;
          if (l !== Bi)
            break;
        }
      if (f !== Bi)
        break;
    }
  return !1;
}, om = function(A, e) {
  for (var t = A; t >= 0; ) {
    var n = e[t];
    if (n === Bi)
      t--;
    else
      return n;
  }
  return 0;
}, j4 = function(A, e, t, n, i) {
  if (t[n] === 0)
    return Ee;
  var s = n - 1;
  if (Array.isArray(i) && i[s] === !0)
    return Ee;
  var l = s - 1, f = s + 1, c = e[s], h = l >= 0 ? e[l] : 0, w = e[f];
  if (c === T0 && w === D0)
    return Ee;
  if (yd.indexOf(c) !== -1)
    return M0;
  if (yd.indexOf(w) !== -1 || P0.indexOf(w) !== -1)
    return Ee;
  if (om(s, e) === O0)
    return gl;
  if (vd.get(A[s]) === fd || (c === dl || c === pl) && vd.get(A[f]) === fd || c === em || w === em || c === tm || [Bi, hd, rs].indexOf(c) === -1 && w === tm || [hl, zo, $4, Ta, Da].indexOf(w) !== -1 || om(s, e) === Jo || vh(wh, Jo, s, e) || vh([hl, zo], pd, s, e) || vh(nm, nm, s, e))
    return Ee;
  if (c === Bi)
    return gl;
  if (c === wh || w === wh)
    return Ee;
  if (w === dd || c === dd)
    return gl;
  if ([hd, rs, pd].indexOf(w) !== -1 || c === k4 || h === wd && z4.indexOf(c) !== -1 || c === Da && w === wd || w === rm || Or.indexOf(w) !== -1 && c === on || Or.indexOf(c) !== -1 && w === on || c === as && [Hs, dl, pl].indexOf(w) !== -1 || [Hs, dl, pl].indexOf(c) !== -1 && w === is || Or.indexOf(c) !== -1 && im.indexOf(w) !== -1 || im.indexOf(c) !== -1 && Or.indexOf(w) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [as, is].indexOf(c) !== -1 && (w === on || [Jo, rs].indexOf(w) !== -1 && e[f + 1] === on) || // ( OP | HY ) × NU
  [Jo, rs].indexOf(c) !== -1 && w === on || // NU ×	(NU | SY | IS)
  c === on && [on, Da, Ta].indexOf(w) !== -1)
    return Ee;
  if ([on, Da, Ta, hl, zo].indexOf(w) !== -1)
    for (var B = s; B >= 0; ) {
      var p = e[B];
      if (p === on)
        return Ee;
      if ([Da, Ta].indexOf(p) !== -1)
        B--;
      else
        break;
    }
  if ([as, is].indexOf(w) !== -1)
    for (var B = [hl, zo].indexOf(c) !== -1 ? l : s; B >= 0; ) {
      var p = e[B];
      if (p === on)
        return Ee;
      if ([Da, Ta].indexOf(p) !== -1)
        B--;
      else
        break;
    }
  if (md === c && [md, $l, gd, Bd].indexOf(w) !== -1 || [$l, gd].indexOf(c) !== -1 && [$l, Gl].indexOf(w) !== -1 || [Gl, Bd].indexOf(c) !== -1 && w === Gl || am.indexOf(c) !== -1 && [rm, is].indexOf(w) !== -1 || am.indexOf(w) !== -1 && c === as || Or.indexOf(c) !== -1 && Or.indexOf(w) !== -1 || c === Ta && Or.indexOf(w) !== -1 || Or.concat(on).indexOf(c) !== -1 && w === Jo && X4.indexOf(A[f]) === -1 || Or.concat(on).indexOf(w) !== -1 && c === zo)
    return Ee;
  if (c === mh && w === mh) {
    for (var v = t[s], o = 1; v > 0 && (v--, e[v] === mh); )
      o++;
    if (o % 2 !== 0)
      return Ee;
  }
  return c === dl && w === pl ? Ee : gl;
}, Y4 = function(A, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = J4(A, e.lineBreak), n = t[0], i = t[1], s = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(f) {
    return [on, zi, N0].indexOf(f) !== -1 ? Hs : f;
  }));
  var l = e.wordBreak === "keep-all" ? s.map(function(f, c) {
    return f && A[c] >= 19968 && A[c] <= 40959;
  }) : void 0;
  return [n, i, l];
}, Z4 = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.codePoints = e, this.required = t === M0, this.start = n, this.end = i;
    }
    return A.prototype.slice = function() {
      return at.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, A;
  }()
), AN = function(A, e) {
  var t = Tc(A), n = Y4(t, e), i = n[0], s = n[1], l = n[2], f = t.length, c = 0, h = 0;
  return {
    next: function() {
      if (h >= f)
        return { done: !0, value: null };
      for (var w = Ee; h < f && (w = j4(t, s, i, ++h, l)) === Ee; )
        ;
      if (w !== Ee || h === f) {
        var B = new Z4(t, w, c, h);
        return c = h, { value: B, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, eN = 1, tN = 2, Rs = 4, sm = 8, lc = 10, um = 47, Bs = 92, nN = 9, rN = 32, Bl = 34, jo = 61, iN = 35, aN = 36, oN = 37, wl = 39, ml = 40, Yo = 41, sN = 95, jt = 45, uN = 33, lN = 60, cN = 62, fN = 64, hN = 91, dN = 93, pN = 61, gN = 123, vl = 63, BN = 125, lm = 124, wN = 126, mN = 128, cm = 65533, yh = 42, ji = 43, vN = 44, yN = 58, CN = 59, Ss = 46, QN = 0, FN = 8, UN = 11, EN = 14, bN = 31, _N = 127, ir = -1, K0 = 48, R0 = 97, k0 = 101, xN = 102, IN = 117, HN = 122, $0 = 65, G0 = 69, V0 = 70, SN = 85, LN = 90, Dt = function(A) {
  return A >= K0 && A <= 57;
}, TN = function(A) {
  return A >= 55296 && A <= 57343;
}, Oa = function(A) {
  return Dt(A) || A >= $0 && A <= V0 || A >= R0 && A <= xN;
}, DN = function(A) {
  return A >= R0 && A <= HN;
}, ON = function(A) {
  return A >= $0 && A <= LN;
}, NN = function(A) {
  return DN(A) || ON(A);
}, MN = function(A) {
  return A >= mN;
}, yl = function(A) {
  return A === lc || A === nN || A === rN;
}, cc = function(A) {
  return NN(A) || MN(A) || A === sN;
}, fm = function(A) {
  return cc(A) || Dt(A) || A === jt;
}, PN = function(A) {
  return A >= QN && A <= FN || A === UN || A >= EN && A <= bN || A === _N;
}, di = function(A, e) {
  return A !== Bs ? !1 : e !== lc;
}, Cl = function(A, e, t) {
  return A === jt ? cc(e) || di(e, t) : cc(A) ? !0 : !!(A === Bs && di(A, e));
}, Ch = function(A, e, t) {
  return A === ji || A === jt ? Dt(e) ? !0 : e === Ss && Dt(t) : Dt(A === Ss ? e : A);
}, KN = function(A) {
  var e = 0, t = 1;
  (A[e] === ji || A[e] === jt) && (A[e] === jt && (t = -1), e++);
  for (var n = []; Dt(A[e]); )
    n.push(A[e++]);
  var i = n.length ? parseInt(at.apply(void 0, n), 10) : 0;
  A[e] === Ss && e++;
  for (var s = []; Dt(A[e]); )
    s.push(A[e++]);
  var l = s.length, f = l ? parseInt(at.apply(void 0, s), 10) : 0;
  (A[e] === G0 || A[e] === k0) && e++;
  var c = 1;
  (A[e] === ji || A[e] === jt) && (A[e] === jt && (c = -1), e++);
  for (var h = []; Dt(A[e]); )
    h.push(A[e++]);
  var w = h.length ? parseInt(at.apply(void 0, h), 10) : 0;
  return t * (i + f * Math.pow(10, -l)) * Math.pow(10, c * w);
}, RN = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, kN = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, $N = {
  type: 4
  /* COMMA_TOKEN */
}, GN = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, VN = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, WN = {
  type: 21
  /* COLUMN_TOKEN */
}, XN = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, qN = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, zN = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, JN = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, jN = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Ql = {
  type: 23
  /* BAD_URL_TOKEN */
}, YN = {
  type: 1
  /* BAD_STRING_TOKEN */
}, ZN = {
  type: 25
  /* CDO_TOKEN */
}, AM = {
  type: 24
  /* CDC_TOKEN */
}, eM = {
  type: 26
  /* COLON_TOKEN */
}, tM = {
  type: 27
  /* SEMICOLON_TOKEN */
}, nM = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, rM = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, iM = {
  type: 31
  /* WHITESPACE_TOKEN */
}, Cd = {
  type: 32
  /* EOF_TOKEN */
}, W0 = (
  /** @class */
  function() {
    function A() {
      this._value = [];
    }
    return A.prototype.write = function(e) {
      this._value = this._value.concat(Tc(e));
    }, A.prototype.read = function() {
      for (var e = [], t = this.consumeToken(); t !== Cd; )
        e.push(t), t = this.consumeToken();
      return e;
    }, A.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case Bl:
          return this.consumeStringToken(Bl);
        case iN:
          var t = this.peekCodePoint(0), n = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (fm(t) || di(n, i)) {
            var s = Cl(t, n, i) ? tN : eN, l = this.consumeName();
            return { type: 5, value: l, flags: s };
          }
          break;
        case aN:
          if (this.peekCodePoint(0) === jo)
            return this.consumeCodePoint(), GN;
          break;
        case wl:
          return this.consumeStringToken(wl);
        case ml:
          return RN;
        case Yo:
          return kN;
        case yh:
          if (this.peekCodePoint(0) === jo)
            return this.consumeCodePoint(), jN;
          break;
        case ji:
          if (Ch(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case vN:
          return $N;
        case jt:
          var f = e, c = this.peekCodePoint(0), h = this.peekCodePoint(1);
          if (Ch(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (Cl(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (c === jt && h === cN)
            return this.consumeCodePoint(), this.consumeCodePoint(), AM;
          break;
        case Ss:
          if (Ch(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case um:
          if (this.peekCodePoint(0) === yh)
            for (this.consumeCodePoint(); ; ) {
              var w = this.consumeCodePoint();
              if (w === yh && (w = this.consumeCodePoint(), w === um))
                return this.consumeToken();
              if (w === ir)
                return this.consumeToken();
            }
          break;
        case yN:
          return eM;
        case CN:
          return tM;
        case lN:
          if (this.peekCodePoint(0) === uN && this.peekCodePoint(1) === jt && this.peekCodePoint(2) === jt)
            return this.consumeCodePoint(), this.consumeCodePoint(), ZN;
          break;
        case fN:
          var B = this.peekCodePoint(0), p = this.peekCodePoint(1), v = this.peekCodePoint(2);
          if (Cl(B, p, v)) {
            var l = this.consumeName();
            return { type: 7, value: l };
          }
          break;
        case hN:
          return nM;
        case Bs:
          if (di(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case dN:
          return rM;
        case pN:
          if (this.peekCodePoint(0) === jo)
            return this.consumeCodePoint(), VN;
          break;
        case gN:
          return zN;
        case BN:
          return JN;
        case IN:
        case SN:
          var o = this.peekCodePoint(0), C = this.peekCodePoint(1);
          return o === ji && (Oa(C) || C === vl) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case lm:
          if (this.peekCodePoint(0) === jo)
            return this.consumeCodePoint(), XN;
          if (this.peekCodePoint(0) === lm)
            return this.consumeCodePoint(), WN;
          break;
        case wN:
          if (this.peekCodePoint(0) === jo)
            return this.consumeCodePoint(), qN;
          break;
        case ir:
          return Cd;
      }
      return yl(e) ? (this.consumeWhiteSpace(), iM) : Dt(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : cc(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: at(e) };
    }, A.prototype.consumeCodePoint = function() {
      var e = this._value.shift();
      return typeof e > "u" ? -1 : e;
    }, A.prototype.reconsumeCodePoint = function(e) {
      this._value.unshift(e);
    }, A.prototype.peekCodePoint = function(e) {
      return e >= this._value.length ? -1 : this._value[e];
    }, A.prototype.consumeUnicodeRangeToken = function() {
      for (var e = [], t = this.consumeCodePoint(); Oa(t) && e.length < 6; )
        e.push(t), t = this.consumeCodePoint();
      for (var n = !1; t === vl && e.length < 6; )
        e.push(t), t = this.consumeCodePoint(), n = !0;
      if (n) {
        var i = parseInt(at.apply(void 0, e.map(function(c) {
          return c === vl ? K0 : c;
        })), 16), s = parseInt(at.apply(void 0, e.map(function(c) {
          return c === vl ? V0 : c;
        })), 16);
        return { type: 30, start: i, end: s };
      }
      var l = parseInt(at.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === jt && Oa(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var f = []; Oa(t) && f.length < 6; )
          f.push(t), t = this.consumeCodePoint();
        var s = parseInt(at.apply(void 0, f), 16);
        return { type: 30, start: l, end: s };
      } else
        return { type: 30, start: l, end: l };
    }, A.prototype.consumeIdentLikeToken = function() {
      var e = this.consumeName();
      return e.toLowerCase() === "url" && this.peekCodePoint(0) === ml ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === ml ? (this.consumeCodePoint(), { type: 19, value: e }) : { type: 20, value: e };
    }, A.prototype.consumeUrlToken = function() {
      var e = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === ir)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === wl || t === Bl) {
        var n = this.consumeStringToken(this.consumeCodePoint());
        return n.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === ir || this.peekCodePoint(0) === Yo) ? (this.consumeCodePoint(), { type: 22, value: n.value }) : (this.consumeBadUrlRemnants(), Ql);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === ir || i === Yo)
          return { type: 22, value: at.apply(void 0, e) };
        if (yl(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === ir || this.peekCodePoint(0) === Yo ? (this.consumeCodePoint(), { type: 22, value: at.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), Ql);
        if (i === Bl || i === wl || i === ml || PN(i))
          return this.consumeBadUrlRemnants(), Ql;
        if (i === Bs)
          if (di(i, this.peekCodePoint(0)))
            e.push(this.consumeEscapedCodePoint());
          else
            return this.consumeBadUrlRemnants(), Ql;
        else
          e.push(i);
      }
    }, A.prototype.consumeWhiteSpace = function() {
      for (; yl(this.peekCodePoint(0)); )
        this.consumeCodePoint();
    }, A.prototype.consumeBadUrlRemnants = function() {
      for (; ; ) {
        var e = this.consumeCodePoint();
        if (e === Yo || e === ir)
          return;
        di(e, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
      }
    }, A.prototype.consumeStringSlice = function(e) {
      for (var t = 5e4, n = ""; e > 0; ) {
        var i = Math.min(t, e);
        n += at.apply(void 0, this._value.splice(0, i)), e -= i;
      }
      return this._value.shift(), n;
    }, A.prototype.consumeStringToken = function(e) {
      var t = "", n = 0;
      do {
        var i = this._value[n];
        if (i === ir || i === void 0 || i === e)
          return t += this.consumeStringSlice(n), { type: 0, value: t };
        if (i === lc)
          return this._value.splice(0, n), YN;
        if (i === Bs) {
          var s = this._value[n + 1];
          s !== ir && s !== void 0 && (s === lc ? (t += this.consumeStringSlice(n), n = -1, this._value.shift()) : di(i, s) && (t += this.consumeStringSlice(n), t += at(this.consumeEscapedCodePoint()), n = -1));
        }
        n++;
      } while (!0);
    }, A.prototype.consumeNumber = function() {
      var e = [], t = Rs, n = this.peekCodePoint(0);
      for ((n === ji || n === jt) && e.push(this.consumeCodePoint()); Dt(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Ss && Dt(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = sm; Dt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var s = this.peekCodePoint(2);
      if ((n === G0 || n === k0) && ((i === ji || i === jt) && Dt(s) || Dt(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = sm; Dt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [KN(e), t];
    }, A.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], n = e[1], i = this.peekCodePoint(0), s = this.peekCodePoint(1), l = this.peekCodePoint(2);
      if (Cl(i, s, l)) {
        var f = this.consumeName();
        return { type: 15, number: t, flags: n, unit: f };
      }
      return i === oN ? (this.consumeCodePoint(), { type: 16, number: t, flags: n }) : { type: 17, number: t, flags: n };
    }, A.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if (Oa(e)) {
        for (var t = at(e); Oa(this.peekCodePoint(0)) && t.length < 6; )
          t += at(this.consumeCodePoint());
        yl(this.peekCodePoint(0)) && this.consumeCodePoint();
        var n = parseInt(t, 16);
        return n === 0 || TN(n) || n > 1114111 ? cm : n;
      }
      return e === ir ? cm : e;
    }, A.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (fm(t))
          e += at(t);
        else if (di(t, this.peekCodePoint(0)))
          e += at(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, A;
  }()
), X0 = (
  /** @class */
  function() {
    function A(e) {
      this._tokens = e;
    }
    return A.create = function(e) {
      var t = new W0();
      return t.write(e), new A(t.read());
    }, A.parseValue = function(e) {
      return A.create(e).parseComponentValue();
    }, A.parseValues = function(e) {
      return A.create(e).parseComponentValues();
    }, A.prototype.parseComponentValue = function() {
      for (var e = this.consumeToken(); e.type === 31; )
        e = this.consumeToken();
      if (e.type === 32)
        throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
      this.reconsumeToken(e);
      var t = this.consumeComponentValue();
      do
        e = this.consumeToken();
      while (e.type === 31);
      if (e.type === 32)
        return t;
      throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
    }, A.prototype.parseComponentValues = function() {
      for (var e = []; ; ) {
        var t = this.consumeComponentValue();
        if (t.type === 32)
          return e;
        e.push(t), e.push();
      }
    }, A.prototype.consumeComponentValue = function() {
      var e = this.consumeToken();
      switch (e.type) {
        case 11:
        case 28:
        case 2:
          return this.consumeSimpleBlock(e.type);
        case 19:
          return this.consumeFunction(e);
      }
      return e;
    }, A.prototype.consumeSimpleBlock = function(e) {
      for (var t = { type: e, values: [] }, n = this.consumeToken(); ; ) {
        if (n.type === 32 || oM(n, e))
          return t;
        this.reconsumeToken(n), t.values.push(this.consumeComponentValue()), n = this.consumeToken();
      }
    }, A.prototype.consumeFunction = function(e) {
      for (var t = {
        name: e.value,
        values: [],
        type: 18
        /* FUNCTION */
      }; ; ) {
        var n = this.consumeToken();
        if (n.type === 32 || n.type === 3)
          return t;
        this.reconsumeToken(n), t.values.push(this.consumeComponentValue());
      }
    }, A.prototype.consumeToken = function() {
      var e = this._tokens.shift();
      return typeof e > "u" ? Cd : e;
    }, A.prototype.reconsumeToken = function(e) {
      this._tokens.unshift(e);
    }, A;
  }()
), ks = function(A) {
  return A.type === 15;
}, co = function(A) {
  return A.type === 17;
}, ke = function(A) {
  return A.type === 20;
}, aM = function(A) {
  return A.type === 0;
}, Qd = function(A, e) {
  return ke(A) && A.value === e;
}, q0 = function(A) {
  return A.type !== 31;
}, oo = function(A) {
  return A.type !== 31 && A.type !== 4;
}, hr = function(A) {
  var e = [], t = [];
  return A.forEach(function(n) {
    if (n.type === 4) {
      if (t.length === 0)
        throw new Error("Error parsing function args, zero tokens for arg");
      e.push(t), t = [];
      return;
    }
    n.type !== 31 && t.push(n);
  }), t.length && e.push(t), e;
}, oM = function(A, e) {
  return e === 11 && A.type === 12 || e === 28 && A.type === 29 ? !0 : e === 2 && A.type === 3;
}, Ci = function(A) {
  return A.type === 17 || A.type === 15;
}, st = function(A) {
  return A.type === 16 || Ci(A);
}, z0 = function(A) {
  return A.length > 1 ? [A[0], A[1]] : [A[0]];
}, Ft = {
  type: 17,
  number: 0,
  flags: Rs
}, kp = {
  type: 16,
  number: 50,
  flags: Rs
}, wi = {
  type: 16,
  number: 100,
  flags: Rs
}, os = function(A, e, t) {
  var n = A[0], i = A[1];
  return [We(n, e), We(typeof i < "u" ? i : n, t)];
}, We = function(A, e) {
  if (A.type === 16)
    return A.number / 100 * e;
  if (ks(A))
    switch (A.unit) {
      case "rem":
      case "em":
        return 16 * A.number;
      case "px":
      default:
        return A.number;
    }
  return A.number;
}, J0 = "deg", j0 = "grad", Y0 = "rad", Z0 = "turn", Dc = {
  name: "angle",
  parse: function(A, e) {
    if (e.type === 15)
      switch (e.unit) {
        case J0:
          return Math.PI * e.number / 180;
        case j0:
          return Math.PI / 200 * e.number;
        case Y0:
          return e.number;
        case Z0:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, Ay = function(A) {
  return A.type === 15 && (A.unit === J0 || A.unit === j0 || A.unit === Y0 || A.unit === Z0);
}, ey = function(A) {
  var e = A.filter(ke).map(function(t) {
    return t.value;
  }).join(" ");
  switch (e) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [Ft, Ft];
    case "to top":
    case "bottom":
      return yn(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Ft, wi];
    case "to right":
    case "left":
      return yn(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [wi, wi];
    case "to bottom":
    case "top":
      return yn(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [wi, Ft];
    case "to left":
    case "right":
      return yn(270);
  }
  return 0;
}, yn = function(A) {
  return Math.PI * A / 180;
}, vi = {
  name: "color",
  parse: function(A, e) {
    if (e.type === 18) {
      var t = sM[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + e.name + '"');
      return t(A, e.values);
    }
    if (e.type === 5) {
      if (e.value.length === 3) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3);
        return mi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), 1);
      }
      if (e.value.length === 4) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3), l = e.value.substring(3, 4);
        return mi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), parseInt(l + l, 16) / 255);
      }
      if (e.value.length === 6) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6);
        return mi(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), 1);
      }
      if (e.value.length === 8) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6), l = e.value.substring(6, 8);
        return mi(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), parseInt(l, 16) / 255);
      }
    }
    if (e.type === 20) {
      var f = Kr[e.value.toUpperCase()];
      if (typeof f < "u")
        return f;
    }
    return Kr.TRANSPARENT;
  }
}, yi = function(A) {
  return (255 & A) === 0;
}, gt = function(A) {
  var e = 255 & A, t = 255 & A >> 8, n = 255 & A >> 16, i = 255 & A >> 24;
  return e < 255 ? "rgba(" + i + "," + n + "," + t + "," + e / 255 + ")" : "rgb(" + i + "," + n + "," + t + ")";
}, mi = function(A, e, t, n) {
  return (A << 24 | e << 16 | t << 8 | Math.round(n * 255) << 0) >>> 0;
}, hm = function(A, e) {
  if (A.type === 17)
    return A.number;
  if (A.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? A.number / 100 * t : Math.round(A.number / 100 * t);
  }
  return 0;
}, dm = function(A, e) {
  var t = e.filter(oo);
  if (t.length === 3) {
    var n = t.map(hm), i = n[0], s = n[1], l = n[2];
    return mi(i, s, l, 1);
  }
  if (t.length === 4) {
    var f = t.map(hm), i = f[0], s = f[1], l = f[2], c = f[3];
    return mi(i, s, l, c);
  }
  return 0;
};
function Qh(A, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - A) * t * 6 + A : t < 1 / 2 ? e : t < 2 / 3 ? (e - A) * 6 * (2 / 3 - t) + A : A;
}
var pm = function(A, e) {
  var t = e.filter(oo), n = t[0], i = t[1], s = t[2], l = t[3], f = (n.type === 17 ? yn(n.number) : Dc.parse(A, n)) / (Math.PI * 2), c = st(i) ? i.number / 100 : 0, h = st(s) ? s.number / 100 : 0, w = typeof l < "u" && st(l) ? We(l, 1) : 1;
  if (c === 0)
    return mi(h * 255, h * 255, h * 255, 1);
  var B = h <= 0.5 ? h * (c + 1) : h + c - h * c, p = h * 2 - B, v = Qh(p, B, f + 1 / 3), o = Qh(p, B, f), C = Qh(p, B, f - 1 / 3);
  return mi(v * 255, o * 255, C * 255, w);
}, sM = {
  hsl: pm,
  hsla: pm,
  rgb: dm,
  rgba: dm
}, ws = function(A, e) {
  return vi.parse(A, X0.create(e).parseComponentValue());
}, Kr = {
  ALICEBLUE: 4042850303,
  ANTIQUEWHITE: 4209760255,
  AQUA: 16777215,
  AQUAMARINE: 2147472639,
  AZURE: 4043309055,
  BEIGE: 4126530815,
  BISQUE: 4293182719,
  BLACK: 255,
  BLANCHEDALMOND: 4293643775,
  BLUE: 65535,
  BLUEVIOLET: 2318131967,
  BROWN: 2771004159,
  BURLYWOOD: 3736635391,
  CADETBLUE: 1604231423,
  CHARTREUSE: 2147418367,
  CHOCOLATE: 3530104575,
  CORAL: 4286533887,
  CORNFLOWERBLUE: 1687547391,
  CORNSILK: 4294499583,
  CRIMSON: 3692313855,
  CYAN: 16777215,
  DARKBLUE: 35839,
  DARKCYAN: 9145343,
  DARKGOLDENROD: 3095837695,
  DARKGRAY: 2846468607,
  DARKGREEN: 6553855,
  DARKGREY: 2846468607,
  DARKKHAKI: 3182914559,
  DARKMAGENTA: 2332068863,
  DARKOLIVEGREEN: 1433087999,
  DARKORANGE: 4287365375,
  DARKORCHID: 2570243327,
  DARKRED: 2332033279,
  DARKSALMON: 3918953215,
  DARKSEAGREEN: 2411499519,
  DARKSLATEBLUE: 1211993087,
  DARKSLATEGRAY: 793726975,
  DARKSLATEGREY: 793726975,
  DARKTURQUOISE: 13554175,
  DARKVIOLET: 2483082239,
  DEEPPINK: 4279538687,
  DEEPSKYBLUE: 12582911,
  DIMGRAY: 1768516095,
  DIMGREY: 1768516095,
  DODGERBLUE: 512819199,
  FIREBRICK: 2988581631,
  FLORALWHITE: 4294635775,
  FORESTGREEN: 579543807,
  FUCHSIA: 4278255615,
  GAINSBORO: 3705462015,
  GHOSTWHITE: 4177068031,
  GOLD: 4292280575,
  GOLDENROD: 3668254975,
  GRAY: 2155905279,
  GREEN: 8388863,
  GREENYELLOW: 2919182335,
  GREY: 2155905279,
  HONEYDEW: 4043305215,
  HOTPINK: 4285117695,
  INDIANRED: 3445382399,
  INDIGO: 1258324735,
  IVORY: 4294963455,
  KHAKI: 4041641215,
  LAVENDER: 3873897215,
  LAVENDERBLUSH: 4293981695,
  LAWNGREEN: 2096890111,
  LEMONCHIFFON: 4294626815,
  LIGHTBLUE: 2916673279,
  LIGHTCORAL: 4034953471,
  LIGHTCYAN: 3774873599,
  LIGHTGOLDENRODYELLOW: 4210742015,
  LIGHTGRAY: 3553874943,
  LIGHTGREEN: 2431553791,
  LIGHTGREY: 3553874943,
  LIGHTPINK: 4290167295,
  LIGHTSALMON: 4288707327,
  LIGHTSEAGREEN: 548580095,
  LIGHTSKYBLUE: 2278488831,
  LIGHTSLATEGRAY: 2005441023,
  LIGHTSLATEGREY: 2005441023,
  LIGHTSTEELBLUE: 2965692159,
  LIGHTYELLOW: 4294959359,
  LIME: 16711935,
  LIMEGREEN: 852308735,
  LINEN: 4210091775,
  MAGENTA: 4278255615,
  MAROON: 2147483903,
  MEDIUMAQUAMARINE: 1724754687,
  MEDIUMBLUE: 52735,
  MEDIUMORCHID: 3126187007,
  MEDIUMPURPLE: 2473647103,
  MEDIUMSEAGREEN: 1018393087,
  MEDIUMSLATEBLUE: 2070474495,
  MEDIUMSPRINGGREEN: 16423679,
  MEDIUMTURQUOISE: 1221709055,
  MEDIUMVIOLETRED: 3340076543,
  MIDNIGHTBLUE: 421097727,
  MINTCREAM: 4127193855,
  MISTYROSE: 4293190143,
  MOCCASIN: 4293178879,
  NAVAJOWHITE: 4292783615,
  NAVY: 33023,
  OLDLACE: 4260751103,
  OLIVE: 2155872511,
  OLIVEDRAB: 1804477439,
  ORANGE: 4289003775,
  ORANGERED: 4282712319,
  ORCHID: 3664828159,
  PALEGOLDENROD: 4008225535,
  PALEGREEN: 2566625535,
  PALETURQUOISE: 2951671551,
  PALEVIOLETRED: 3681588223,
  PAPAYAWHIP: 4293907967,
  PEACHPUFF: 4292524543,
  PERU: 3448061951,
  PINK: 4290825215,
  PLUM: 3718307327,
  POWDERBLUE: 2967529215,
  PURPLE: 2147516671,
  REBECCAPURPLE: 1714657791,
  RED: 4278190335,
  ROSYBROWN: 3163525119,
  ROYALBLUE: 1097458175,
  SADDLEBROWN: 2336560127,
  SALMON: 4202722047,
  SANDYBROWN: 4104413439,
  SEAGREEN: 780883967,
  SEASHELL: 4294307583,
  SIENNA: 2689740287,
  SILVER: 3233857791,
  SKYBLUE: 2278484991,
  SLATEBLUE: 1784335871,
  SLATEGRAY: 1887473919,
  SLATEGREY: 1887473919,
  SNOW: 4294638335,
  SPRINGGREEN: 16744447,
  STEELBLUE: 1182971135,
  TAN: 3535047935,
  TEAL: 8421631,
  THISTLE: 3636451583,
  TOMATO: 4284696575,
  TRANSPARENT: 0,
  TURQUOISE: 1088475391,
  VIOLET: 4001558271,
  WHEAT: 4125012991,
  WHITE: 4294967295,
  WHITESMOKE: 4126537215,
  YELLOW: 4294902015,
  YELLOWGREEN: 2597139199
}, uM = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (ke(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, lM = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Oc = function(A, e) {
  var t = vi.parse(A, e[0]), n = e[1];
  return n && st(n) ? { color: t, stop: n } : { color: t, stop: null };
}, gm = function(A, e) {
  var t = A[0], n = A[A.length - 1];
  t.stop === null && (t.stop = Ft), n.stop === null && (n.stop = wi);
  for (var i = [], s = 0, l = 0; l < A.length; l++) {
    var f = A[l].stop;
    if (f !== null) {
      var c = We(f, e);
      c > s ? i.push(c) : i.push(s), s = c;
    } else
      i.push(null);
  }
  for (var h = null, l = 0; l < i.length; l++) {
    var w = i[l];
    if (w === null)
      h === null && (h = l);
    else if (h !== null) {
      for (var B = l - h, p = i[h - 1], v = (w - p) / (B + 1), o = 1; o <= B; o++)
        i[h + o - 1] = v * o;
      h = null;
    }
  }
  return A.map(function(C, F) {
    var U = C.color;
    return { color: U, stop: Math.max(Math.min(1, i[F] / e), 0) };
  });
}, cM = function(A, e, t) {
  var n = e / 2, i = t / 2, s = We(A[0], e) - n, l = i - We(A[1], t);
  return (Math.atan2(l, s) + Math.PI * 2) % (Math.PI * 2);
}, fM = function(A, e, t) {
  var n = typeof A == "number" ? A : cM(A, e, t), i = Math.abs(e * Math.sin(n)) + Math.abs(t * Math.cos(n)), s = e / 2, l = t / 2, f = i / 2, c = Math.sin(n - Math.PI / 2) * f, h = Math.cos(n - Math.PI / 2) * f;
  return [i, s - h, s + h, l - c, l + c];
}, kn = function(A, e) {
  return Math.sqrt(A * A + e * e);
}, Bm = function(A, e, t, n, i) {
  var s = [
    [0, 0],
    [0, e],
    [A, 0],
    [A, e]
  ];
  return s.reduce(function(l, f) {
    var c = f[0], h = f[1], w = kn(t - c, n - h);
    return (i ? w < l.optimumDistance : w > l.optimumDistance) ? {
      optimumCorner: f,
      optimumDistance: w
    } : l;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, hM = function(A, e, t, n, i) {
  var s = 0, l = 0;
  switch (A.size) {
    case 0:
      A.shape === 0 ? s = l = Math.min(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.min(Math.abs(e), Math.abs(e - n)), l = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (A.shape === 0)
        s = l = Math.min(kn(e, t), kn(e, t - i), kn(e - n, t), kn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - n)), c = Bm(n, i, e, t, !0), h = c[0], w = c[1];
        s = kn(h - e, (w - t) / f), l = f * s;
      }
      break;
    case 1:
      A.shape === 0 ? s = l = Math.max(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.max(Math.abs(e), Math.abs(e - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (A.shape === 0)
        s = l = Math.max(kn(e, t), kn(e, t - i), kn(e - n, t), kn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - n)), B = Bm(n, i, e, t, !1), h = B[0], w = B[1];
        s = kn(h - e, (w - t) / f), l = f * s;
      }
      break;
  }
  return Array.isArray(A.size) && (s = We(A.size[0], n), l = A.size.length === 2 ? We(A.size[1], i) : s), [s, l];
}, dM = function(A, e) {
  var t = yn(180), n = [];
  return hr(e).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && l.value === "to") {
        t = ey(i);
        return;
      } else if (Ay(l)) {
        t = Dc.parse(A, l);
        return;
      }
    }
    var f = Oc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Fl = function(A, e) {
  var t = yn(180), n = [];
  return hr(e).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && ["top", "left", "right", "bottom"].indexOf(l.value) !== -1) {
        t = ey(i);
        return;
      } else if (Ay(l)) {
        t = (Dc.parse(A, l) + yn(270)) % yn(360);
        return;
      }
    }
    var f = Oc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, pM = function(A, e) {
  var t = yn(180), n = [], i = 1, s = 0, l = 3, f = [];
  return hr(e).forEach(function(c, h) {
    var w = c[0];
    if (h === 0) {
      if (ke(w) && w.value === "linear") {
        i = 1;
        return;
      } else if (ke(w) && w.value === "radial") {
        i = 2;
        return;
      }
    }
    if (w.type === 18) {
      if (w.name === "from") {
        var B = vi.parse(A, w.values[0]);
        n.push({ stop: Ft, color: B });
      } else if (w.name === "to") {
        var B = vi.parse(A, w.values[0]);
        n.push({ stop: wi, color: B });
      } else if (w.name === "color-stop") {
        var p = w.values.filter(oo);
        if (p.length === 2) {
          var B = vi.parse(A, p[1]), v = p[0];
          co(v) && n.push({
            stop: { type: 16, number: v.number * 100, flags: v.flags },
            color: B
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + yn(180)) % yn(360),
    stops: n,
    type: i
  } : { size: l, shape: s, stops: n, position: f, type: i };
}, ty = "closest-side", ny = "farthest-side", ry = "closest-corner", iy = "farthest-corner", ay = "circle", oy = "ellipse", sy = "cover", uy = "contain", gM = function(A, e) {
  var t = 0, n = 3, i = [], s = [];
  return hr(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0) {
      var h = !1;
      c = l.reduce(function(B, p) {
        if (h)
          if (ke(p))
            switch (p.value) {
              case "center":
                return s.push(kp), B;
              case "top":
              case "left":
                return s.push(Ft), B;
              case "right":
              case "bottom":
                return s.push(wi), B;
            }
          else (st(p) || Ci(p)) && s.push(p);
        else if (ke(p))
          switch (p.value) {
            case ay:
              return t = 0, !1;
            case oy:
              return t = 1, !1;
            case "at":
              return h = !0, !1;
            case ty:
              return n = 0, !1;
            case sy:
            case ny:
              return n = 1, !1;
            case uy:
            case ry:
              return n = 2, !1;
            case iy:
              return n = 3, !1;
          }
        else if (Ci(p) || st(p))
          return Array.isArray(n) || (n = []), n.push(p), !1;
        return B;
      }, c);
    }
    if (c) {
      var w = Oc(A, l);
      i.push(w);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, Ul = function(A, e) {
  var t = 0, n = 3, i = [], s = [];
  return hr(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0 ? c = l.reduce(function(w, B) {
      if (ke(B))
        switch (B.value) {
          case "center":
            return s.push(kp), !1;
          case "top":
          case "left":
            return s.push(Ft), !1;
          case "right":
          case "bottom":
            return s.push(wi), !1;
        }
      else if (st(B) || Ci(B))
        return s.push(B), !1;
      return w;
    }, c) : f === 1 && (c = l.reduce(function(w, B) {
      if (ke(B))
        switch (B.value) {
          case ay:
            return t = 0, !1;
          case oy:
            return t = 1, !1;
          case uy:
          case ty:
            return n = 0, !1;
          case ny:
            return n = 1, !1;
          case ry:
            return n = 2, !1;
          case sy:
          case iy:
            return n = 3, !1;
        }
      else if (Ci(B) || st(B))
        return Array.isArray(n) || (n = []), n.push(B), !1;
      return w;
    }, c)), c) {
      var h = Oc(A, l);
      i.push(h);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, BM = function(A) {
  return A.type === 1;
}, wM = function(A) {
  return A.type === 2;
}, $p = {
  name: "image",
  parse: function(A, e) {
    if (e.type === 22) {
      var t = {
        url: e.value,
        type: 0
        /* URL */
      };
      return A.cache.addImage(e.value), t;
    }
    if (e.type === 18) {
      var n = ly[e.name];
      if (typeof n > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return n(A, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function mM(A) {
  return !(A.type === 20 && A.value === "none") && (A.type !== 18 || !!ly[A.name]);
}
var ly = {
  "linear-gradient": dM,
  "-moz-linear-gradient": Fl,
  "-ms-linear-gradient": Fl,
  "-o-linear-gradient": Fl,
  "-webkit-linear-gradient": Fl,
  "radial-gradient": gM,
  "-moz-radial-gradient": Ul,
  "-ms-radial-gradient": Ul,
  "-o-radial-gradient": Ul,
  "-webkit-radial-gradient": Ul,
  "-webkit-gradient": pM
}, vM = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(n) {
      return oo(n) && mM(n);
    }).map(function(n) {
      return $p.parse(A, n);
    });
  }
}, yM = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (ke(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, CM = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return hr(e).map(function(t) {
      return t.filter(st);
    }).map(z0);
  }
}, QM = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return hr(e).map(function(t) {
      return t.filter(ke).map(function(n) {
        return n.value;
      }).join(" ");
    }).map(FM);
  }
}, FM = function(A) {
  switch (A) {
    case "no-repeat":
      return 1;
    case "repeat-x":
    case "repeat no-repeat":
      return 2;
    case "repeat-y":
    case "no-repeat repeat":
      return 3;
    case "repeat":
    default:
      return 0;
  }
}, ja;
(function(A) {
  A.AUTO = "auto", A.CONTAIN = "contain", A.COVER = "cover";
})(ja || (ja = {}));
var UM = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return hr(e).map(function(t) {
      return t.filter(EM);
    });
  }
}, EM = function(A) {
  return ke(A) || st(A);
}, Nc = function(A) {
  return {
    name: "border-" + A + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, bM = Nc("top"), _M = Nc("right"), xM = Nc("bottom"), IM = Nc("left"), Mc = function(A) {
  return {
    name: "border-radius-" + A,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return z0(t.filter(st));
    }
  };
}, HM = Mc("top-left"), SM = Mc("top-right"), LM = Mc("bottom-right"), TM = Mc("bottom-left"), Pc = function(A) {
  return {
    name: "border-" + A + "-style",
    initialValue: "solid",
    prefix: !1,
    type: 2,
    parse: function(e, t) {
      switch (t) {
        case "none":
          return 0;
        case "dashed":
          return 2;
        case "dotted":
          return 3;
        case "double":
          return 4;
      }
      return 1;
    }
  };
}, DM = Pc("top"), OM = Pc("right"), NM = Pc("bottom"), MM = Pc("left"), Kc = function(A) {
  return {
    name: "border-" + A + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return ks(t) ? t.number : 0;
    }
  };
}, PM = Kc("top"), KM = Kc("right"), RM = Kc("bottom"), kM = Kc("left"), $M = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, GM = {
  name: "direction",
  initialValue: "ltr",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "rtl":
        return 1;
      case "ltr":
      default:
        return 0;
    }
  }
}, VM = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(ke).reduce(
      function(t, n) {
        return t | WM(n.value);
      },
      0
      /* NONE */
    );
  }
}, WM = function(A) {
  switch (A) {
    case "block":
    case "-webkit-box":
      return 2;
    case "inline":
      return 4;
    case "run-in":
      return 8;
    case "flow":
      return 16;
    case "flow-root":
      return 32;
    case "table":
      return 64;
    case "flex":
    case "-webkit-flex":
      return 128;
    case "grid":
    case "-ms-grid":
      return 256;
    case "ruby":
      return 512;
    case "subgrid":
      return 1024;
    case "list-item":
      return 2048;
    case "table-row-group":
      return 4096;
    case "table-header-group":
      return 8192;
    case "table-footer-group":
      return 16384;
    case "table-row":
      return 32768;
    case "table-cell":
      return 65536;
    case "table-column-group":
      return 131072;
    case "table-column":
      return 262144;
    case "table-caption":
      return 524288;
    case "ruby-base":
      return 1048576;
    case "ruby-text":
      return 2097152;
    case "ruby-base-container":
      return 4194304;
    case "ruby-text-container":
      return 8388608;
    case "contents":
      return 16777216;
    case "inline-block":
      return 33554432;
    case "inline-list-item":
      return 67108864;
    case "inline-table":
      return 134217728;
    case "inline-flex":
      return 268435456;
    case "inline-grid":
      return 536870912;
  }
  return 0;
}, XM = {
  name: "float",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "left":
        return 1;
      case "right":
        return 2;
      case "inline-start":
        return 3;
      case "inline-end":
        return 4;
    }
    return 0;
  }
}, qM = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: !1,
  type: 0,
  parse: function(A, e) {
    return e.type === 20 && e.value === "normal" ? 0 : e.type === 17 || e.type === 15 ? e.number : 0;
  }
}, fc;
(function(A) {
  A.NORMAL = "normal", A.STRICT = "strict";
})(fc || (fc = {}));
var zM = {
  name: "line-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "strict":
        return fc.STRICT;
      case "normal":
      default:
        return fc.NORMAL;
    }
  }
}, JM = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, wm = function(A, e) {
  return ke(A) && A.value === "normal" ? 1.2 * e : A.type === 17 ? e * A.number : st(A) ? We(A, e) : e;
}, jM = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return e.type === 20 && e.value === "none" ? null : $p.parse(A, e);
  }
}, YM = {
  name: "list-style-position",
  initialValue: "outside",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "inside":
        return 0;
      case "outside":
      default:
        return 1;
    }
  }
}, Fd = {
  name: "list-style-type",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "disc":
        return 0;
      case "circle":
        return 1;
      case "square":
        return 2;
      case "decimal":
        return 3;
      case "cjk-decimal":
        return 4;
      case "decimal-leading-zero":
        return 5;
      case "lower-roman":
        return 6;
      case "upper-roman":
        return 7;
      case "lower-greek":
        return 8;
      case "lower-alpha":
        return 9;
      case "upper-alpha":
        return 10;
      case "arabic-indic":
        return 11;
      case "armenian":
        return 12;
      case "bengali":
        return 13;
      case "cambodian":
        return 14;
      case "cjk-earthly-branch":
        return 15;
      case "cjk-heavenly-stem":
        return 16;
      case "cjk-ideographic":
        return 17;
      case "devanagari":
        return 18;
      case "ethiopic-numeric":
        return 19;
      case "georgian":
        return 20;
      case "gujarati":
        return 21;
      case "gurmukhi":
        return 22;
      case "hebrew":
        return 22;
      case "hiragana":
        return 23;
      case "hiragana-iroha":
        return 24;
      case "japanese-formal":
        return 25;
      case "japanese-informal":
        return 26;
      case "kannada":
        return 27;
      case "katakana":
        return 28;
      case "katakana-iroha":
        return 29;
      case "khmer":
        return 30;
      case "korean-hangul-formal":
        return 31;
      case "korean-hanja-formal":
        return 32;
      case "korean-hanja-informal":
        return 33;
      case "lao":
        return 34;
      case "lower-armenian":
        return 35;
      case "malayalam":
        return 36;
      case "mongolian":
        return 37;
      case "myanmar":
        return 38;
      case "oriya":
        return 39;
      case "persian":
        return 40;
      case "simp-chinese-formal":
        return 41;
      case "simp-chinese-informal":
        return 42;
      case "tamil":
        return 43;
      case "telugu":
        return 44;
      case "thai":
        return 45;
      case "tibetan":
        return 46;
      case "trad-chinese-formal":
        return 47;
      case "trad-chinese-informal":
        return 48;
      case "upper-armenian":
        return 49;
      case "disclosure-open":
        return 50;
      case "disclosure-closed":
        return 51;
      case "none":
      default:
        return -1;
    }
  }
}, Rc = function(A) {
  return {
    name: "margin-" + A,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, ZM = Rc("top"), AP = Rc("right"), eP = Rc("bottom"), tP = Rc("left"), nP = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(ke).map(function(t) {
      switch (t.value) {
        case "hidden":
          return 1;
        case "scroll":
          return 2;
        case "clip":
          return 3;
        case "auto":
          return 4;
        case "visible":
        default:
          return 0;
      }
    });
  }
}, rP = {
  name: "overflow-wrap",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "break-word":
        return "break-word";
      case "normal":
      default:
        return "normal";
    }
  }
}, kc = function(A) {
  return {
    name: "padding-" + A,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, iP = kc("top"), aP = kc("right"), oP = kc("bottom"), sP = kc("left"), uP = {
  name: "text-align",
  initialValue: "left",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "right":
        return 2;
      case "center":
      case "justify":
        return 1;
      case "left":
      default:
        return 0;
    }
  }
}, lP = {
  name: "position",
  initialValue: "static",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "relative":
        return 1;
      case "absolute":
        return 2;
      case "fixed":
        return 3;
      case "sticky":
        return 4;
    }
    return 0;
  }
}, cP = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Qd(e[0], "none") ? [] : hr(e).map(function(t) {
      for (var n = {
        color: Kr.TRANSPARENT,
        offsetX: Ft,
        offsetY: Ft,
        blur: Ft
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        Ci(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = vi.parse(A, l);
      }
      return n;
    });
  }
}, fP = {
  name: "text-transform",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "uppercase":
        return 2;
      case "lowercase":
        return 1;
      case "capitalize":
        return 3;
    }
    return 0;
  }
}, hP = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = gP[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, dP = function(A) {
  var e = A.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, pP = function(A) {
  var e = A.filter(function(c) {
    return c.type === 17;
  }).map(function(c) {
    return c.number;
  }), t = e[0], n = e[1];
  e[2], e[3];
  var i = e[4], s = e[5];
  e[6], e[7], e[8], e[9], e[10], e[11];
  var l = e[12], f = e[13];
  return e[14], e[15], e.length === 16 ? [t, n, i, s, l, f] : null;
}, gP = {
  matrix: dP,
  matrix3d: pP
}, mm = {
  type: 16,
  number: 50,
  flags: Rs
}, BP = [mm, mm], wP = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    var t = e.filter(st);
    return t.length !== 2 ? BP : [t[0], t[1]];
  }
}, mP = {
  name: "visible",
  initialValue: "none",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "hidden":
        return 1;
      case "collapse":
        return 2;
      case "visible":
      default:
        return 0;
    }
  }
}, ms;
(function(A) {
  A.NORMAL = "normal", A.BREAK_ALL = "break-all", A.KEEP_ALL = "keep-all";
})(ms || (ms = {}));
var vP = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "break-all":
        return ms.BREAK_ALL;
      case "keep-all":
        return ms.KEEP_ALL;
      case "normal":
      default:
        return ms.NORMAL;
    }
  }
}, yP = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20)
      return { auto: !0, order: 0 };
    if (co(e))
      return { auto: !1, order: e.number };
    throw new Error("Invalid z-index number parsed");
  }
}, cy = {
  name: "time",
  parse: function(A, e) {
    if (e.type === 15)
      switch (e.unit.toLowerCase()) {
        case "s":
          return 1e3 * e.number;
        case "ms":
          return e.number;
      }
    throw new Error("Unsupported time type");
  }
}, CP = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return co(e) ? e.number : 1;
  }
}, QP = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, FP = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(ke).map(function(t) {
      switch (t.value) {
        case "underline":
          return 1;
        case "overline":
          return 2;
        case "line-through":
          return 3;
        case "none":
          return 4;
      }
      return 0;
    }).filter(function(t) {
      return t !== 0;
    });
  }
}, UP = {
  name: "font-family",
  initialValue: "",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    var t = [], n = [];
    return e.forEach(function(i) {
      switch (i.type) {
        case 20:
        case 0:
          t.push(i.value);
          break;
        case 17:
          t.push(i.number.toString());
          break;
        case 4:
          n.push(t.join(" ")), t.length = 0;
          break;
      }
    }), t.length && n.push(t.join(" ")), n.map(function(i) {
      return i.indexOf(" ") === -1 ? i : "'" + i + "'";
    });
  }
}, EP = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, bP = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    if (co(e))
      return e.number;
    if (ke(e))
      switch (e.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    return 400;
  }
}, _P = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.filter(ke).map(function(t) {
      return t.value;
    });
  }
}, xP = {
  name: "font-style",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "oblique":
        return "oblique";
      case "italic":
        return "italic";
      case "normal":
      default:
        return "normal";
    }
  }
}, ft = function(A, e) {
  return (A & e) !== 0;
}, IP = {
  name: "content",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e;
  }
}, HP = {
  name: "counter-increment",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return null;
    var t = e[0];
    if (t.type === 20 && t.value === "none")
      return null;
    for (var n = [], i = e.filter(q0), s = 0; s < i.length; s++) {
      var l = i[s], f = i[s + 1];
      if (l.type === 20) {
        var c = f && co(f) ? f.number : 1;
        n.push({ counter: l.value, increment: c });
      }
    }
    return n;
  }
}, SP = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    for (var t = [], n = e.filter(q0), i = 0; i < n.length; i++) {
      var s = n[i], l = n[i + 1];
      if (ke(s) && s.value !== "none") {
        var f = l && co(l) ? l.number : 0;
        t.push({ counter: s.value, reset: f });
      }
    }
    return t;
  }
}, LP = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(ks).map(function(t) {
      return cy.parse(A, t);
    });
  }
}, TP = {
  name: "quotes",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return null;
    var t = e[0];
    if (t.type === 20 && t.value === "none")
      return null;
    var n = [], i = e.filter(aM);
    if (i.length % 2 !== 0)
      return null;
    for (var s = 0; s < i.length; s += 2) {
      var l = i[s].value, f = i[s + 1].value;
      n.push({ open: l, close: f });
    }
    return n;
  }
}, vm = function(A, e, t) {
  if (!A)
    return "";
  var n = A[Math.min(e, A.length - 1)];
  return n ? t ? n.open : n.close : "";
}, DP = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Qd(e[0], "none") ? [] : hr(e).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: Ft,
        offsetY: Ft,
        blur: Ft,
        spread: Ft,
        inset: !1
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        Qd(l, "inset") ? n.inset = !0 : Ci(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = vi.parse(A, l);
      }
      return n;
    });
  }
}, OP = {
  name: "paint-order",
  initialValue: "normal",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    var t = [
      0,
      1,
      2
      /* MARKERS */
    ], n = [];
    return e.filter(ke).forEach(function(i) {
      switch (i.value) {
        case "stroke":
          n.push(
            1
            /* STROKE */
          );
          break;
        case "fill":
          n.push(
            0
            /* FILL */
          );
          break;
        case "markers":
          n.push(
            2
            /* MARKERS */
          );
          break;
      }
    }), t.forEach(function(i) {
      n.indexOf(i) === -1 && n.push(i);
    }), n;
  }
}, NP = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, MP = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return ks(e) ? e.number : 0;
  }
}, PP = (
  /** @class */
  function() {
    function A(e, t) {
      var n, i;
      this.animationDuration = RA(e, LP, t.animationDuration), this.backgroundClip = RA(e, uM, t.backgroundClip), this.backgroundColor = RA(e, lM, t.backgroundColor), this.backgroundImage = RA(e, vM, t.backgroundImage), this.backgroundOrigin = RA(e, yM, t.backgroundOrigin), this.backgroundPosition = RA(e, CM, t.backgroundPosition), this.backgroundRepeat = RA(e, QM, t.backgroundRepeat), this.backgroundSize = RA(e, UM, t.backgroundSize), this.borderTopColor = RA(e, bM, t.borderTopColor), this.borderRightColor = RA(e, _M, t.borderRightColor), this.borderBottomColor = RA(e, xM, t.borderBottomColor), this.borderLeftColor = RA(e, IM, t.borderLeftColor), this.borderTopLeftRadius = RA(e, HM, t.borderTopLeftRadius), this.borderTopRightRadius = RA(e, SM, t.borderTopRightRadius), this.borderBottomRightRadius = RA(e, LM, t.borderBottomRightRadius), this.borderBottomLeftRadius = RA(e, TM, t.borderBottomLeftRadius), this.borderTopStyle = RA(e, DM, t.borderTopStyle), this.borderRightStyle = RA(e, OM, t.borderRightStyle), this.borderBottomStyle = RA(e, NM, t.borderBottomStyle), this.borderLeftStyle = RA(e, MM, t.borderLeftStyle), this.borderTopWidth = RA(e, PM, t.borderTopWidth), this.borderRightWidth = RA(e, KM, t.borderRightWidth), this.borderBottomWidth = RA(e, RM, t.borderBottomWidth), this.borderLeftWidth = RA(e, kM, t.borderLeftWidth), this.boxShadow = RA(e, DP, t.boxShadow), this.color = RA(e, $M, t.color), this.direction = RA(e, GM, t.direction), this.display = RA(e, VM, t.display), this.float = RA(e, XM, t.cssFloat), this.fontFamily = RA(e, UP, t.fontFamily), this.fontSize = RA(e, EP, t.fontSize), this.fontStyle = RA(e, xP, t.fontStyle), this.fontVariant = RA(e, _P, t.fontVariant), this.fontWeight = RA(e, bP, t.fontWeight), this.letterSpacing = RA(e, qM, t.letterSpacing), this.lineBreak = RA(e, zM, t.lineBreak), this.lineHeight = RA(e, JM, t.lineHeight), this.listStyleImage = RA(e, jM, t.listStyleImage), this.listStylePosition = RA(e, YM, t.listStylePosition), this.listStyleType = RA(e, Fd, t.listStyleType), this.marginTop = RA(e, ZM, t.marginTop), this.marginRight = RA(e, AP, t.marginRight), this.marginBottom = RA(e, eP, t.marginBottom), this.marginLeft = RA(e, tP, t.marginLeft), this.opacity = RA(e, CP, t.opacity);
      var s = RA(e, nP, t.overflow);
      this.overflowX = s[0], this.overflowY = s[s.length > 1 ? 1 : 0], this.overflowWrap = RA(e, rP, t.overflowWrap), this.paddingTop = RA(e, iP, t.paddingTop), this.paddingRight = RA(e, aP, t.paddingRight), this.paddingBottom = RA(e, oP, t.paddingBottom), this.paddingLeft = RA(e, sP, t.paddingLeft), this.paintOrder = RA(e, OP, t.paintOrder), this.position = RA(e, lP, t.position), this.textAlign = RA(e, uP, t.textAlign), this.textDecorationColor = RA(e, QP, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = RA(e, FP, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = RA(e, cP, t.textShadow), this.textTransform = RA(e, fP, t.textTransform), this.transform = RA(e, hP, t.transform), this.transformOrigin = RA(e, wP, t.transformOrigin), this.visibility = RA(e, mP, t.visibility), this.webkitTextStrokeColor = RA(e, NP, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = RA(e, MP, t.webkitTextStrokeWidth), this.wordBreak = RA(e, vP, t.wordBreak), this.zIndex = RA(e, yP, t.zIndex);
    }
    return A.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, A.prototype.isTransparent = function() {
      return yi(this.backgroundColor);
    }, A.prototype.isTransformed = function() {
      return this.transform !== null;
    }, A.prototype.isPositioned = function() {
      return this.position !== 0;
    }, A.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    }, A.prototype.isFloating = function() {
      return this.float !== 0;
    }, A.prototype.isInlineLevel = function() {
      return ft(
        this.display,
        4
        /* INLINE */
      ) || ft(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || ft(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || ft(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || ft(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || ft(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, A;
  }()
), KP = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.content = RA(e, IP, t.content), this.quotes = RA(e, TP, t.quotes);
    }
    return A;
  }()
), ym = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.counterIncrement = RA(e, HP, t.counterIncrement), this.counterReset = RA(e, SP, t.counterReset);
    }
    return A;
  }()
), RA = function(A, e, t) {
  var n = new W0(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  n.write(i);
  var s = new X0(n.read());
  switch (e.type) {
    case 2:
      var l = s.parseComponentValue();
      return e.parse(A, ke(l) ? l.value : e.initialValue);
    case 0:
      return e.parse(A, s.parseComponentValue());
    case 1:
      return e.parse(A, s.parseComponentValues());
    case 4:
      return s.parseComponentValue();
    case 3:
      switch (e.format) {
        case "angle":
          return Dc.parse(A, s.parseComponentValue());
        case "color":
          return vi.parse(A, s.parseComponentValue());
        case "image":
          return $p.parse(A, s.parseComponentValue());
        case "length":
          var f = s.parseComponentValue();
          return Ci(f) ? f : Ft;
        case "length-percentage":
          var c = s.parseComponentValue();
          return st(c) ? c : Ft;
        case "time":
          return cy.parse(A, s.parseComponentValue());
      }
      break;
  }
}, RP = "data-html2canvas-debug", kP = function(A) {
  var e = A.getAttribute(RP);
  switch (e) {
    case "all":
      return 1;
    case "clone":
      return 2;
    case "parse":
      return 3;
    case "render":
      return 4;
    default:
      return 0;
  }
}, Ud = function(A, e) {
  var t = kP(A);
  return t === 1 || e === t;
}, dr = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, Ud(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new PP(e, window.getComputedStyle(t, null)), _d(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = Lc(this.context, t), Ud(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return A;
  }()
), $P = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", Cm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ss = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var El = 0; El < Cm.length; El++)
  ss[Cm.charCodeAt(El)] = El;
var GP = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    s = ss[A.charCodeAt(n)], l = ss[A.charCodeAt(n + 1)], f = ss[A.charCodeAt(n + 2)], c = ss[A.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return h;
}, VP = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, WP = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ea = 5, Gp = 11, Fh = 2, XP = Gp - ea, fy = 65536 >> ea, qP = 1 << ea, Uh = qP - 1, zP = 1024 >> ea, JP = fy + zP, jP = JP, YP = 32, ZP = jP + YP, AK = 65536 >> Gp, eK = 1 << XP, tK = eK - 1, Qm = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, nK = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, rK = function(A, e) {
  var t = GP(A), n = Array.isArray(t) ? WP(t) : new Uint32Array(t), i = Array.isArray(t) ? VP(t) : new Uint16Array(t), s = 24, l = Qm(i, s / 2, n[4] / 2), f = n[5] === 2 ? Qm(i, (s + n[4]) / 2) : nK(n, Math.ceil((s + n[4]) / 4));
  return new iK(n[0], n[1], n[2], n[3], l, f);
}, iK = (
  /** @class */
  function() {
    function A(e, t, n, i, s, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> ea], t = (t << Fh) + (e & Uh), this.data[t];
        if (e <= 65535)
          return t = this.index[fy + (e - 55296 >> ea)], t = (t << Fh) + (e & Uh), this.data[t];
        if (e < this.highStart)
          return t = ZP - AK + (e >> Gp), t = this.index[t], t += e >> ea & tK, t = this.index[t], t = (t << Fh) + (e & Uh), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Fm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", aK = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var bl = 0; bl < Fm.length; bl++)
  aK[Fm.charCodeAt(bl)] = bl;
var oK = 1, Eh = 2, bh = 3, Um = 4, Em = 5, sK = 7, bm = 8, _h = 9, xh = 10, _m = 11, xm = 12, Im = 13, Hm = 14, Ih = 15, uK = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = A.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, lK = function() {
  for (var A = [], e = 0; e < arguments.length; e++)
    A[e] = arguments[e];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, A);
  var t = A.length;
  if (!t)
    return "";
  for (var n = [], i = -1, s = ""; ++i < t; ) {
    var l = A[i];
    l <= 65535 ? n.push(l) : (l -= 65536, n.push((l >> 10) + 55296, l % 1024 + 56320)), (i + 1 === t || n.length > 16384) && (s += String.fromCharCode.apply(String, n), n.length = 0);
  }
  return s;
}, cK = rK($P), wn = "×", Hh = "÷", fK = function(A) {
  return cK.get(A);
}, hK = function(A, e, t) {
  var n = t - 2, i = e[n], s = e[t - 1], l = e[t];
  if (s === Eh && l === bh)
    return wn;
  if (s === Eh || s === bh || s === Um || l === Eh || l === bh || l === Um)
    return Hh;
  if (s === bm && [bm, _h, _m, xm].indexOf(l) !== -1 || (s === _m || s === _h) && (l === _h || l === xh) || (s === xm || s === xh) && l === xh || l === Im || l === Em || l === sK || s === oK)
    return wn;
  if (s === Im && l === Hm) {
    for (; i === Em; )
      i = e[--n];
    if (i === Hm)
      return wn;
  }
  if (s === Ih && l === Ih) {
    for (var f = 0; i === Ih; )
      f++, i = e[--n];
    if (f % 2 === 0)
      return wn;
  }
  return Hh;
}, dK = function(A) {
  var e = uK(A), t = e.length, n = 0, i = 0, s = e.map(fK);
  return {
    next: function() {
      if (n >= t)
        return { done: !0, value: null };
      for (var l = wn; n < t && (l = hK(e, s, ++n)) === wn; )
        ;
      if (l !== wn || n === t) {
        var f = lK.apply(null, e.slice(i, n));
        return i = n, { value: f, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, pK = function(A) {
  for (var e = dK(A), t = [], n; !(n = e.next()).done; )
    n.value && t.push(n.value.slice());
  return t;
}, gK = function(A) {
  var e = 123;
  if (A.createRange) {
    var t = A.createRange();
    if (t.getBoundingClientRect) {
      var n = A.createElement("boundtest");
      n.style.height = e + "px", n.style.display = "block", A.body.appendChild(n), t.selectNode(n);
      var i = t.getBoundingClientRect(), s = Math.round(i.height);
      if (A.body.removeChild(n), s === e)
        return !0;
    }
  }
  return !1;
}, BK = function(A) {
  var e = A.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", A.body.appendChild(e);
  var t = A.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = e.firstChild, i = Tc(n.data).map(function(c) {
    return at(c);
  }), s = 0, l = {}, f = i.every(function(c, h) {
    t.setStart(n, s), t.setEnd(n, s + c.length);
    var w = t.getBoundingClientRect();
    s += c.length;
    var B = w.x > l.x || w.y > l.y;
    return l = w, h === 0 ? !0 : B;
  });
  return A.body.removeChild(e), f;
}, wK = function() {
  return typeof new Image().crossOrigin < "u";
}, mK = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, vK = function(A) {
  var e = new Image(), t = A.createElement("canvas"), n = t.getContext("2d");
  if (!n)
    return !1;
  e.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
  try {
    n.drawImage(e, 0, 0), t.toDataURL();
  } catch {
    return !1;
  }
  return !0;
}, Sm = function(A) {
  return A[0] === 0 && A[1] === 255 && A[2] === 0 && A[3] === 255;
}, yK = function(A) {
  var e = A.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var n = e.getContext("2d");
  if (!n)
    return Promise.reject(!1);
  n.fillStyle = "rgb(0, 255, 0)", n.fillRect(0, 0, t, t);
  var i = new Image(), s = e.toDataURL();
  i.src = s;
  var l = Ed(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), Lm(l).then(function(f) {
    n.drawImage(f, 0, 0);
    var c = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var h = A.createElement("div");
    return h.style.backgroundImage = "url(" + s + ")", h.style.height = t + "px", Sm(c) ? Lm(Ed(t, t, 0, 0, h)) : Promise.reject(!1);
  }).then(function(f) {
    return n.drawImage(f, 0, 0), Sm(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Ed = function(A, e, t, n, i) {
  var s = "http://www.w3.org/2000/svg", l = document.createElementNS(s, "svg"), f = document.createElementNS(s, "foreignObject");
  return l.setAttributeNS(null, "width", A.toString()), l.setAttributeNS(null, "height", e.toString()), f.setAttributeNS(null, "width", "100%"), f.setAttributeNS(null, "height", "100%"), f.setAttributeNS(null, "x", t.toString()), f.setAttributeNS(null, "y", n.toString()), f.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(f), f.appendChild(i), l;
}, Lm = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      return e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, Ct = {
  get SUPPORT_RANGE_BOUNDS() {
    var A = gK(document);
    return Object.defineProperty(Ct, "SUPPORT_RANGE_BOUNDS", { value: A }), A;
  },
  get SUPPORT_WORD_BREAKING() {
    var A = Ct.SUPPORT_RANGE_BOUNDS && BK(document);
    return Object.defineProperty(Ct, "SUPPORT_WORD_BREAKING", { value: A }), A;
  },
  get SUPPORT_SVG_DRAWING() {
    var A = vK(document);
    return Object.defineProperty(Ct, "SUPPORT_SVG_DRAWING", { value: A }), A;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var A = typeof Array.from == "function" && typeof window.fetch == "function" ? yK(document) : Promise.resolve(!1);
    return Object.defineProperty(Ct, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A }), A;
  },
  get SUPPORT_CORS_IMAGES() {
    var A = wK();
    return Object.defineProperty(Ct, "SUPPORT_CORS_IMAGES", { value: A }), A;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var A = mK();
    return Object.defineProperty(Ct, "SUPPORT_RESPONSE_TYPE", { value: A }), A;
  },
  get SUPPORT_CORS_XHR() {
    var A = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(Ct, "SUPPORT_CORS_XHR", { value: A }), A;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var A = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(Ct, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: A }), A;
  }
}, vs = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.text = e, this.bounds = t;
    }
    return A;
  }()
), CK = function(A, e, t, n) {
  var i = UK(e, t), s = [], l = 0;
  return i.forEach(function(f) {
    if (t.textDecorationLine.length || f.trim().length > 0)
      if (Ct.SUPPORT_RANGE_BOUNDS) {
        var c = Tm(n, l, f.length).getClientRects();
        if (c.length > 1) {
          var h = Vp(f), w = 0;
          h.forEach(function(p) {
            s.push(new vs(p, Gr.fromDOMRectList(A, Tm(n, w + l, p.length).getClientRects()))), w += p.length;
          });
        } else
          s.push(new vs(f, Gr.fromDOMRectList(A, c)));
      } else {
        var B = n.splitText(f.length);
        s.push(new vs(f, QK(A, n))), n = B;
      }
    else Ct.SUPPORT_RANGE_BOUNDS || (n = n.splitText(f.length));
    l += f.length;
  }), s;
}, QK = function(A, e) {
  var t = e.ownerDocument;
  if (t) {
    var n = t.createElement("html2canvaswrapper");
    n.appendChild(e.cloneNode(!0));
    var i = e.parentNode;
    if (i) {
      i.replaceChild(n, e);
      var s = Lc(A, n);
      return n.firstChild && i.replaceChild(n.firstChild, n), s;
    }
  }
  return Gr.EMPTY;
}, Tm = function(A, e, t) {
  var n = A.ownerDocument;
  if (!n)
    throw new Error("Node has no owner document");
  var i = n.createRange();
  return i.setStart(A, e), i.setEnd(A, e + t), i;
}, Vp = function(A) {
  if (Ct.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(A)).map(function(t) {
      return t.segment;
    });
  }
  return pK(A);
}, FK = function(A, e) {
  if (Ct.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(A)).map(function(n) {
      return n.segment;
    });
  }
  return bK(A, e);
}, UK = function(A, e) {
  return e.letterSpacing !== 0 ? Vp(A) : FK(A, e);
}, EK = [32, 160, 4961, 65792, 65793, 4153, 4241], bK = function(A, e) {
  for (var t = AN(A, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), n = [], i, s = function() {
    if (i.value) {
      var l = i.value.slice(), f = Tc(l), c = "";
      f.forEach(function(h) {
        EK.indexOf(h) === -1 ? c += at(h) : (c.length && n.push(c), n.push(at(h)), c = "");
      }), c.length && n.push(c);
    }
  }; !(i = t.next()).done; )
    s();
  return n;
}, _K = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.text = xK(t.data, n.textTransform), this.textBounds = CK(e, this.text, n, t);
    }
    return A;
  }()
), xK = function(A, e) {
  switch (e) {
    case 1:
      return A.toLowerCase();
    case 3:
      return A.replace(IK, HK);
    case 2:
      return A.toUpperCase();
    default:
      return A;
  }
}, IK = /(^|\s|:|-|\(|\))([a-z])/g, HK = function(A, e, t) {
  return A.length > 0 ? e + t.toUpperCase() : A;
}, hy = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.src = n.currentSrc || n.src, i.intrinsicWidth = n.naturalWidth, i.intrinsicHeight = n.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(dr)
), dy = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n, i.intrinsicWidth = n.width, i.intrinsicHeight = n.height, i;
    }
    return e;
  }(dr)
), py = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = new XMLSerializer(), l = Lc(t, n);
      return n.setAttribute("width", l.width + "px"), n.setAttribute("height", l.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(n)), i.intrinsicWidth = n.width.baseVal.value, i.intrinsicHeight = n.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(dr)
), gy = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(dr)
), bd = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.start = n.start, i.reversed = typeof n.reversed == "boolean" && n.reversed === !0, i;
    }
    return e;
  }(dr)
), SK = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], LK = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], TK = function(A) {
  return A.width > A.height ? new Gr(A.left + (A.width - A.height) / 2, A.top, A.height, A.height) : A.width < A.height ? new Gr(A.left, A.top + (A.height - A.width) / 2, A.width, A.width) : A;
}, DK = function(A) {
  var e = A.type === OK ? new Array(A.value.length + 1).join("•") : A.value;
  return e.length === 0 ? A.placeholder || "" : e;
}, hc = "checkbox", dc = "radio", OK = "password", Dm = 707406591, Wp = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      switch (i.type = n.type.toLowerCase(), i.checked = n.checked, i.value = DK(n), (i.type === hc || i.type === dc) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = TK(i.bounds)), i.type) {
        case hc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = SK;
          break;
        case dc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = LK;
          break;
      }
      return i;
    }
    return e;
  }(dr)
), By = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = n.options[n.selectedIndex || 0];
      return i.value = s && s.text || "", i;
    }
    return e;
  }(dr)
), wy = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(dr)
), my = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      i.src = n.src, i.width = parseInt(n.width, 10) || 0, i.height = parseInt(n.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (n.contentWindow && n.contentWindow.document && n.contentWindow.document.documentElement) {
          i.tree = yy(t, n.contentWindow.document.documentElement);
          var s = n.contentWindow.document.documentElement ? ws(t, getComputedStyle(n.contentWindow.document.documentElement).backgroundColor) : Kr.TRANSPARENT, l = n.contentWindow.document.body ? ws(t, getComputedStyle(n.contentWindow.document.body).backgroundColor) : Kr.TRANSPARENT;
          i.backgroundColor = yi(s) ? yi(l) ? i.styles.backgroundColor : l : s;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(dr)
), NK = ["OL", "UL", "MENU"], Vl = function(A, e, t, n) {
  for (var i = e.firstChild, s = void 0; i; i = s)
    if (s = i.nextSibling, Cy(i) && i.data.trim().length > 0)
      t.textNodes.push(new _K(A, i, t.styles));
    else if (Wa(i))
      if (Ey(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(f) {
          return Vl(A, f, t, n);
        });
      else {
        var l = vy(A, i);
        l.styles.isVisible() && (MK(i, l, n) ? l.flags |= 4 : PK(l.styles) && (l.flags |= 2), NK.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Vl(A, i.shadowRoot, l, n) : !pc(i) && !Qy(i) && !gc(i) && Vl(A, i, l, n));
      }
}, vy = function(A, e) {
  return xd(e) ? new hy(A, e) : Fy(e) ? new dy(A, e) : Qy(e) ? new py(A, e) : KK(e) ? new gy(A, e) : RK(e) ? new bd(A, e) : kK(e) ? new Wp(A, e) : gc(e) ? new By(A, e) : pc(e) ? new wy(A, e) : Uy(e) ? new my(A, e) : new dr(A, e);
}, yy = function(A, e) {
  var t = vy(A, e);
  return t.flags |= 4, Vl(A, e, t, t), t;
}, MK = function(A, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || Xp(A) && t.styles.isTransparent();
}, PK = function(A) {
  return A.isPositioned() || A.isFloating();
}, Cy = function(A) {
  return A.nodeType === Node.TEXT_NODE;
}, Wa = function(A) {
  return A.nodeType === Node.ELEMENT_NODE;
}, _d = function(A) {
  return Wa(A) && typeof A.style < "u" && !Wl(A);
}, Wl = function(A) {
  return typeof A.className == "object";
}, KK = function(A) {
  return A.tagName === "LI";
}, RK = function(A) {
  return A.tagName === "OL";
}, kK = function(A) {
  return A.tagName === "INPUT";
}, $K = function(A) {
  return A.tagName === "HTML";
}, Qy = function(A) {
  return A.tagName === "svg";
}, Xp = function(A) {
  return A.tagName === "BODY";
}, Fy = function(A) {
  return A.tagName === "CANVAS";
}, Om = function(A) {
  return A.tagName === "VIDEO";
}, xd = function(A) {
  return A.tagName === "IMG";
}, Uy = function(A) {
  return A.tagName === "IFRAME";
}, Nm = function(A) {
  return A.tagName === "STYLE";
}, GK = function(A) {
  return A.tagName === "SCRIPT";
}, pc = function(A) {
  return A.tagName === "TEXTAREA";
}, gc = function(A) {
  return A.tagName === "SELECT";
}, Ey = function(A) {
  return A.tagName === "SLOT";
}, Mm = function(A) {
  return A.tagName.indexOf("-") > 0;
}, VK = (
  /** @class */
  function() {
    function A() {
      this.counters = {};
    }
    return A.prototype.getCounterValue = function(e) {
      var t = this.counters[e];
      return t && t.length ? t[t.length - 1] : 1;
    }, A.prototype.getCounterValues = function(e) {
      var t = this.counters[e];
      return t || [];
    }, A.prototype.pop = function(e) {
      var t = this;
      e.forEach(function(n) {
        return t.counters[n].pop();
      });
    }, A.prototype.parse = function(e) {
      var t = this, n = e.counterIncrement, i = e.counterReset, s = !0;
      n !== null && n.forEach(function(f) {
        var c = t.counters[f.counter];
        c && f.increment !== 0 && (s = !1, c.length || c.push(1), c[Math.max(0, c.length - 1)] += f.increment);
      });
      var l = [];
      return s && i.forEach(function(f) {
        var c = t.counters[f.counter];
        l.push(f.counter), c || (c = t.counters[f.counter] = []), c.push(f.reset);
      }), l;
    }, A;
  }()
), Pm = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, Km = {
  integers: [
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "Ք",
    "Փ",
    "Ւ",
    "Ց",
    "Ր",
    "Տ",
    "Վ",
    "Ս",
    "Ռ",
    "Ջ",
    "Պ",
    "Չ",
    "Ո",
    "Շ",
    "Ն",
    "Յ",
    "Մ",
    "Ճ",
    "Ղ",
    "Ձ",
    "Հ",
    "Կ",
    "Ծ",
    "Խ",
    "Լ",
    "Ի",
    "Ժ",
    "Թ",
    "Ը",
    "Է",
    "Զ",
    "Ե",
    "Դ",
    "Գ",
    "Բ",
    "Ա"
  ]
}, WK = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    19,
    18,
    17,
    16,
    15,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "י׳",
    "ט׳",
    "ח׳",
    "ז׳",
    "ו׳",
    "ה׳",
    "ד׳",
    "ג׳",
    "ב׳",
    "א׳",
    "ת",
    "ש",
    "ר",
    "ק",
    "צ",
    "פ",
    "ע",
    "ס",
    "נ",
    "מ",
    "ל",
    "כ",
    "יט",
    "יח",
    "יז",
    "טז",
    "טו",
    "י",
    "ט",
    "ח",
    "ז",
    "ו",
    "ה",
    "ד",
    "ג",
    "ב",
    "א"
  ]
}, XK = {
  integers: [
    1e4,
    9e3,
    8e3,
    7e3,
    6e3,
    5e3,
    4e3,
    3e3,
    2e3,
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ],
  values: [
    "ჵ",
    "ჰ",
    "ჯ",
    "ჴ",
    "ხ",
    "ჭ",
    "წ",
    "ძ",
    "ც",
    "ჩ",
    "შ",
    "ყ",
    "ღ",
    "ქ",
    "ფ",
    "ჳ",
    "ტ",
    "ს",
    "რ",
    "ჟ",
    "პ",
    "ო",
    "ჲ",
    "ნ",
    "მ",
    "ლ",
    "კ",
    "ი",
    "თ",
    "ჱ",
    "ზ",
    "ვ",
    "ე",
    "დ",
    "გ",
    "ბ",
    "ა"
  ]
}, Na = function(A, e, t, n, i, s) {
  return A < e || A > t ? Ls(A, i, s.length > 0) : n.integers.reduce(function(l, f, c) {
    for (; A >= f; )
      A -= f, l += n.values[c];
    return l;
  }, "") + s;
}, by = function(A, e, t, n) {
  var i = "";
  do
    t || A--, i = n(A) + i, A /= e;
  while (A * e >= e);
  return i;
}, rt = function(A, e, t, n, i) {
  var s = t - e + 1;
  return (A < 0 ? "-" : "") + (by(Math.abs(A), s, n, function(l) {
    return at(Math.floor(l % s) + e);
  }) + i);
}, Gi = function(A, e, t) {
  t === void 0 && (t = ". ");
  var n = e.length;
  return by(Math.abs(A), n, !1, function(i) {
    return e[Math.floor(i % n)];
  }) + t;
}, $a = 1, fi = 2, hi = 4, us = 8, Nr = function(A, e, t, n, i, s) {
  if (A < -9999 || A > 9999)
    return Ls(A, 4, i.length > 0);
  var l = Math.abs(A), f = i;
  if (l === 0)
    return e[0] + f;
  for (var c = 0; l > 0 && c <= 4; c++) {
    var h = l % 10;
    h === 0 && ft(s, $a) && f !== "" ? f = e[h] + f : h > 1 || h === 1 && c === 0 || h === 1 && c === 1 && ft(s, fi) || h === 1 && c === 1 && ft(s, hi) && A > 100 || h === 1 && c > 1 && ft(s, us) ? f = e[h] + (c > 0 ? t[c - 1] : "") + f : h === 1 && c > 0 && (f = t[c - 1] + f), l = Math.floor(l / 10);
  }
  return (A < 0 ? n : "") + f;
}, Rm = "十百千萬", km = "拾佰仟萬", $m = "マイナス", Sh = "마이너스", Ls = function(A, e, t) {
  var n = t ? ". " : "", i = t ? "、" : "", s = t ? ", " : "", l = t ? " " : "";
  switch (e) {
    case 0:
      return "•" + l;
    case 1:
      return "◦" + l;
    case 2:
      return "◾" + l;
    case 5:
      var f = rt(A, 48, 57, !0, n);
      return f.length < 4 ? "0" + f : f;
    case 4:
      return Gi(A, "〇一二三四五六七八九", i);
    case 6:
      return Na(A, 1, 3999, Pm, 3, n).toLowerCase();
    case 7:
      return Na(A, 1, 3999, Pm, 3, n);
    case 8:
      return rt(A, 945, 969, !1, n);
    case 9:
      return rt(A, 97, 122, !1, n);
    case 10:
      return rt(A, 65, 90, !1, n);
    case 11:
      return rt(A, 1632, 1641, !0, n);
    case 12:
    case 49:
      return Na(A, 1, 9999, Km, 3, n);
    case 35:
      return Na(A, 1, 9999, Km, 3, n).toLowerCase();
    case 13:
      return rt(A, 2534, 2543, !0, n);
    case 14:
    case 30:
      return rt(A, 6112, 6121, !0, n);
    case 15:
      return Gi(A, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return Gi(A, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return Nr(A, "零一二三四五六七八九", Rm, "負", i, fi | hi | us);
    case 47:
      return Nr(A, "零壹貳參肆伍陸柒捌玖", km, "負", i, $a | fi | hi | us);
    case 42:
      return Nr(A, "零一二三四五六七八九", Rm, "负", i, fi | hi | us);
    case 41:
      return Nr(A, "零壹贰叁肆伍陆柒捌玖", km, "负", i, $a | fi | hi | us);
    case 26:
      return Nr(A, "〇一二三四五六七八九", "十百千万", $m, i, 0);
    case 25:
      return Nr(A, "零壱弐参四伍六七八九", "拾百千万", $m, i, $a | fi | hi);
    case 31:
      return Nr(A, "영일이삼사오육칠팔구", "십백천만", Sh, s, $a | fi | hi);
    case 33:
      return Nr(A, "零一二三四五六七八九", "十百千萬", Sh, s, 0);
    case 32:
      return Nr(A, "零壹貳參四五六七八九", "拾百千", Sh, s, $a | fi | hi);
    case 18:
      return rt(A, 2406, 2415, !0, n);
    case 20:
      return Na(A, 1, 19999, XK, 3, n);
    case 21:
      return rt(A, 2790, 2799, !0, n);
    case 22:
      return rt(A, 2662, 2671, !0, n);
    case 22:
      return Na(A, 1, 10999, WK, 3, n);
    case 23:
      return Gi(A, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return Gi(A, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return rt(A, 3302, 3311, !0, n);
    case 28:
      return Gi(A, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return Gi(A, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
    case 34:
      return rt(A, 3792, 3801, !0, n);
    case 37:
      return rt(A, 6160, 6169, !0, n);
    case 38:
      return rt(A, 4160, 4169, !0, n);
    case 39:
      return rt(A, 2918, 2927, !0, n);
    case 40:
      return rt(A, 1776, 1785, !0, n);
    case 43:
      return rt(A, 3046, 3055, !0, n);
    case 44:
      return rt(A, 3174, 3183, !0, n);
    case 45:
      return rt(A, 3664, 3673, !0, n);
    case 46:
      return rt(A, 3872, 3881, !0, n);
    case 3:
    default:
      return rt(A, 48, 57, !0, n);
  }
}, _y = "data-html2canvas-ignore", Gm = (
  /** @class */
  function() {
    function A(e, t, n) {
      if (this.context = e, this.options = n, this.scrolledElements = [], this.referenceElement = t, this.counters = new VK(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return A.prototype.toIFrame = function(e, t) {
      var n = this, i = qK(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var s = e.defaultView.pageXOffset, l = e.defaultView.pageYOffset, f = i.contentWindow, c = f.document, h = jK(i).then(function() {
        return $t(n, void 0, void 0, function() {
          var w, B;
          return Tt(this, function(p) {
            switch (p.label) {
              case 0:
                return this.scrolledElements.forEach(eR), f && (f.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (f.scrollY !== t.top || f.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(f.scrollX - t.left, f.scrollY - t.top, 0, 0))), w = this.options.onclone, B = this.clonedReferenceElement, typeof B > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : c.fonts && c.fonts.ready ? [4, c.fonts.ready] : [3, 2];
              case 1:
                p.sent(), p.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, JK(c)] : [3, 4];
              case 3:
                p.sent(), p.label = 4;
              case 4:
                return typeof w == "function" ? [2, Promise.resolve().then(function() {
                  return w(c, B);
                }).then(function() {
                  return i;
                })] : [2, i];
            }
          });
        });
      });
      return c.open(), c.write(ZK(document.doctype) + "<html></html>"), AR(this.referenceElement.ownerDocument, s, l), c.replaceChild(c.adoptNode(this.documentElement), c.documentElement), c.close(), h;
    }, A.prototype.createElementClone = function(e) {
      if (Ud(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (Fy(e))
        return this.createCanvasClone(e);
      if (Om(e))
        return this.createVideoClone(e);
      if (Nm(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return xd(t) && (xd(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Mm(t) ? this.createCustomElementClone(t) : t;
    }, A.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return Lh(e.style, t), t;
    }, A.prototype.createStyleClone = function(e) {
      try {
        var t = e.sheet;
        if (t && t.cssRules) {
          var n = [].slice.call(t.cssRules, 0).reduce(function(s, l) {
            return l && typeof l.cssText == "string" ? s + l.cssText : s;
          }, ""), i = e.cloneNode(!1);
          return i.textContent = n, i;
        }
      } catch (s) {
        if (this.context.logger.error("Unable to access cssRules property", s), s.name !== "SecurityError")
          throw s;
      }
      return e.cloneNode(!1);
    }, A.prototype.createCanvasClone = function(e) {
      var t;
      if (this.options.inlineImages && e.ownerDocument) {
        var n = e.ownerDocument.createElement("img");
        try {
          return n.src = e.toDataURL(), n;
        } catch {
          this.context.logger.info("Unable to inline canvas contents, canvas is tainted", e);
        }
      }
      var i = e.cloneNode(!1);
      try {
        i.width = e.width, i.height = e.height;
        var s = e.getContext("2d"), l = i.getContext("2d");
        if (l)
          if (!this.options.allowTaint && s)
            l.putImageData(s.getImageData(0, 0, e.width, e.height), 0, 0);
          else {
            var f = (t = e.getContext("webgl2")) !== null && t !== void 0 ? t : e.getContext("webgl");
            if (f) {
              var c = f.getContextAttributes();
              (c == null ? void 0 : c.preserveDrawingBuffer) === !1 && this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", e);
            }
            l.drawImage(e, 0, 0);
          }
        return i;
      } catch {
        this.context.logger.info("Unable to clone canvas as it is tainted", e);
      }
      return i;
    }, A.prototype.createVideoClone = function(e) {
      var t = e.ownerDocument.createElement("canvas");
      t.width = e.offsetWidth, t.height = e.offsetHeight;
      var n = t.getContext("2d");
      try {
        return n && (n.drawImage(e, 0, 0, t.width, t.height), this.options.allowTaint || n.getImageData(0, 0, t.width, t.height)), t;
      } catch {
        this.context.logger.info("Unable to clone video as it is tainted", e);
      }
      var i = e.ownerDocument.createElement("canvas");
      return i.width = e.offsetWidth, i.height = e.offsetHeight, i;
    }, A.prototype.appendChildNode = function(e, t, n) {
      (!Wa(t) || !GK(t) && !t.hasAttribute(_y) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !Wa(t) || !Nm(t)) && e.appendChild(this.cloneNode(t, n));
    }, A.prototype.cloneChildNodes = function(e, t, n) {
      for (var i = this, s = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; s; s = s.nextSibling)
        if (Wa(s) && Ey(s) && typeof s.assignedNodes == "function") {
          var l = s.assignedNodes();
          l.length && l.forEach(function(f) {
            return i.appendChildNode(t, f, n);
          });
        } else
          this.appendChildNode(t, s, n);
    }, A.prototype.cloneNode = function(e, t) {
      if (Cy(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var n = e.ownerDocument.defaultView;
      if (n && Wa(e) && (_d(e) || Wl(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var s = n.getComputedStyle(e), l = n.getComputedStyle(e, ":before"), f = n.getComputedStyle(e, ":after");
        this.referenceElement === e && _d(i) && (this.clonedReferenceElement = i), Xp(i) && rR(i);
        var c = this.counters.parse(new ym(this.context, s)), h = this.resolvePseudoContent(e, i, l, ys.BEFORE);
        Mm(e) && (t = !0), Om(e) || this.cloneChildNodes(e, i, t), h && i.insertBefore(h, i.firstChild);
        var w = this.resolvePseudoContent(e, i, f, ys.AFTER);
        return w && i.appendChild(w), this.counters.pop(c), (s && (this.options.copyStyles || Wl(e)) && !Uy(e) || t) && Lh(s, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (pc(e) || gc(e)) && (pc(i) || gc(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, A.prototype.resolvePseudoContent = function(e, t, n, i) {
      var s = this;
      if (n) {
        var l = n.content, f = t.ownerDocument;
        if (!(!f || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new ym(this.context, n));
          var c = new KP(this.context, n), h = f.createElement("html2canvaspseudoelement");
          Lh(n, h), c.content.forEach(function(B) {
            if (B.type === 0)
              h.appendChild(f.createTextNode(B.value));
            else if (B.type === 22) {
              var p = f.createElement("img");
              p.src = B.value, p.style.opacity = "1", h.appendChild(p);
            } else if (B.type === 18) {
              if (B.name === "attr") {
                var v = B.values.filter(ke);
                v.length && h.appendChild(f.createTextNode(e.getAttribute(v[0].value) || ""));
              } else if (B.name === "counter") {
                var o = B.values.filter(oo), C = o[0], F = o[1];
                if (C && ke(C)) {
                  var U = s.counters.getCounterValue(C.value), S = F && ke(F) ? Fd.parse(s.context, F.value) : 3;
                  h.appendChild(f.createTextNode(Ls(U, S, !1)));
                }
              } else if (B.name === "counters") {
                var O = B.values.filter(oo), C = O[0], b = O[1], F = O[2];
                if (C && ke(C)) {
                  var P = s.counters.getCounterValues(C.value), R = F && ke(F) ? Fd.parse(s.context, F.value) : 3, j = b && b.type === 0 ? b.value : "", dA = P.map(function(FA) {
                    return Ls(FA, R, !1);
                  }).join(j);
                  h.appendChild(f.createTextNode(dA));
                }
              }
            } else if (B.type === 20)
              switch (B.value) {
                case "open-quote":
                  h.appendChild(f.createTextNode(vm(c.quotes, s.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  h.appendChild(f.createTextNode(vm(c.quotes, --s.quoteDepth, !1)));
                  break;
                default:
                  h.appendChild(f.createTextNode(B.value));
              }
          }), h.className = Id + " " + Hd;
          var w = i === ys.BEFORE ? " " + Id : " " + Hd;
          return Wl(t) ? t.className.baseValue += w : t.className += w, h;
        }
      }
    }, A.destroy = function(e) {
      return e.parentNode ? (e.parentNode.removeChild(e), !0) : !1;
    }, A;
  }()
), ys;
(function(A) {
  A[A.BEFORE = 0] = "BEFORE", A[A.AFTER = 1] = "AFTER";
})(ys || (ys = {}));
var qK = function(A, e) {
  var t = A.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(_y, "true"), A.body.appendChild(t), t;
}, zK = function(A) {
  return new Promise(function(e) {
    if (A.complete) {
      e();
      return;
    }
    if (!A.src) {
      e();
      return;
    }
    A.onload = e, A.onerror = e;
  });
}, JK = function(A) {
  return Promise.all([].slice.call(A.images, 0).map(zK));
}, jK = function(A) {
  return new Promise(function(e, t) {
    var n = A.contentWindow;
    if (!n)
      return t("No window assigned for iframe");
    var i = n.document;
    n.onload = A.onload = function() {
      n.onload = A.onload = null;
      var s = setInterval(function() {
        i.body.childNodes.length > 0 && i.readyState === "complete" && (clearInterval(s), e(A));
      }, 50);
    };
  });
}, YK = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], Lh = function(A, e) {
  for (var t = A.length - 1; t >= 0; t--) {
    var n = A.item(t);
    YK.indexOf(n) === -1 && e.style.setProperty(n, A.getPropertyValue(n));
  }
  return e;
}, ZK = function(A) {
  var e = "";
  return A && (e += "<!DOCTYPE ", A.name && (e += A.name), A.internalSubset && (e += A.internalSubset), A.publicId && (e += '"' + A.publicId + '"'), A.systemId && (e += '"' + A.systemId + '"'), e += ">"), e;
}, AR = function(A, e, t) {
  A && A.defaultView && (e !== A.defaultView.pageXOffset || t !== A.defaultView.pageYOffset) && A.defaultView.scrollTo(e, t);
}, eR = function(A) {
  var e = A[0], t = A[1], n = A[2];
  e.scrollLeft = t, e.scrollTop = n;
}, tR = ":before", nR = ":after", Id = "___html2canvas___pseudoelement_before", Hd = "___html2canvas___pseudoelement_after", Vm = `{
    content: "" !important;
    display: none !important;
}`, rR = function(A) {
  iR(A, "." + Id + tR + Vm + `
         .` + Hd + nR + Vm);
}, iR = function(A, e) {
  var t = A.ownerDocument;
  if (t) {
    var n = t.createElement("style");
    n.textContent = e, A.appendChild(n);
  }
}, xy = (
  /** @class */
  function() {
    function A() {
    }
    return A.getOrigin = function(e) {
      var t = A._link;
      return t ? (t.href = e, t.href = t.href, t.protocol + t.hostname + t.port) : "about:blank";
    }, A.isSameOrigin = function(e) {
      return A.getOrigin(e) === A._origin;
    }, A.setContext = function(e) {
      A._link = e.document.createElement("a"), A._origin = A.getOrigin(e.location.href);
    }, A._origin = "about:blank", A;
  }()
), aR = (
  /** @class */
  function() {
    function A(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return A.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || (Dh(e) || lR(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, A.prototype.match = function(e) {
      return this._cache[e];
    }, A.prototype.loadImage = function(e) {
      return $t(this, void 0, void 0, function() {
        var t, n, i, s, l = this;
        return Tt(this, function(f) {
          switch (f.label) {
            case 0:
              return t = xy.isSameOrigin(e), n = !Th(e) && this._options.useCORS === !0 && Ct.SUPPORT_CORS_IMAGES && !t, i = !Th(e) && !t && !Dh(e) && typeof this._options.proxy == "string" && Ct.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !Th(e) && !Dh(e) && !i && !n ? [
                2
                /*return*/
              ] : (s = e, i ? [4, this.proxy(s)] : [3, 2]);
            case 1:
              s = f.sent(), f.label = 2;
            case 2:
              return this.context.logger.debug("Added image " + e.substring(0, 256)), [4, new Promise(function(c, h) {
                var w = new Image();
                w.onload = function() {
                  return c(w);
                }, w.onerror = h, (cR(s) || n) && (w.crossOrigin = "anonymous"), w.src = s, w.complete === !0 && setTimeout(function() {
                  return c(w);
                }, 500), l._options.imageTimeout > 0 && setTimeout(function() {
                  return h("Timed out (" + l._options.imageTimeout + "ms) loading image");
                }, l._options.imageTimeout);
              })];
            case 3:
              return [2, f.sent()];
          }
        });
      });
    }, A.prototype.has = function(e) {
      return typeof this._cache[e] < "u";
    }, A.prototype.keys = function() {
      return Promise.resolve(Object.keys(this._cache));
    }, A.prototype.proxy = function(e) {
      var t = this, n = this._options.proxy;
      if (!n)
        throw new Error("No proxy defined");
      var i = e.substring(0, 256);
      return new Promise(function(s, l) {
        var f = Ct.SUPPORT_RESPONSE_TYPE ? "blob" : "text", c = new XMLHttpRequest();
        c.onload = function() {
          if (c.status === 200)
            if (f === "text")
              s(c.response);
            else {
              var B = new FileReader();
              B.addEventListener("load", function() {
                return s(B.result);
              }, !1), B.addEventListener("error", function(p) {
                return l(p);
              }, !1), B.readAsDataURL(c.response);
            }
          else
            l("Failed to proxy resource " + i + " with status code " + c.status);
        }, c.onerror = l;
        var h = n.indexOf("?") > -1 ? "&" : "?";
        if (c.open("GET", "" + n + h + "url=" + encodeURIComponent(e) + "&responseType=" + f), f !== "text" && c instanceof XMLHttpRequest && (c.responseType = f), t._options.imageTimeout) {
          var w = t._options.imageTimeout;
          c.timeout = w, c.ontimeout = function() {
            return l("Timed out (" + w + "ms) proxying " + i);
          };
        }
        c.send();
      });
    }, A;
  }()
), oR = /^data:image\/svg\+xml/i, sR = /^data:image\/.*;base64,/i, uR = /^data:image\/.*/i, lR = function(A) {
  return Ct.SUPPORT_SVG_DRAWING || !fR(A);
}, Th = function(A) {
  return uR.test(A);
}, cR = function(A) {
  return sR.test(A);
}, Dh = function(A) {
  return A.substr(0, 4) === "blob";
}, fR = function(A) {
  return A.substr(-3).toLowerCase() === "svg" || oR.test(A);
}, MA = (
  /** @class */
  function() {
    function A(e, t) {
      this.type = 0, this.x = e, this.y = t;
    }
    return A.prototype.add = function(e, t) {
      return new A(this.x + e, this.y + t);
    }, A;
  }()
), Ma = function(A, e, t) {
  return new MA(A.x + (e.x - A.x) * t, A.y + (e.y - A.y) * t);
}, _l = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = n, this.end = i;
    }
    return A.prototype.subdivide = function(e, t) {
      var n = Ma(this.start, this.startControl, e), i = Ma(this.startControl, this.endControl, e), s = Ma(this.endControl, this.end, e), l = Ma(n, i, e), f = Ma(i, s, e), c = Ma(l, f, e);
      return t ? new A(this.start, n, l, c) : new A(c, f, s, this.end);
    }, A.prototype.add = function(e, t) {
      return new A(this.start.add(e, t), this.startControl.add(e, t), this.endControl.add(e, t), this.end.add(e, t));
    }, A.prototype.reverse = function() {
      return new A(this.end, this.endControl, this.startControl, this.start);
    }, A;
  }()
), vn = function(A) {
  return A.type === 1;
}, hR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      var t = e.styles, n = e.bounds, i = os(t.borderTopLeftRadius, n.width, n.height), s = i[0], l = i[1], f = os(t.borderTopRightRadius, n.width, n.height), c = f[0], h = f[1], w = os(t.borderBottomRightRadius, n.width, n.height), B = w[0], p = w[1], v = os(t.borderBottomLeftRadius, n.width, n.height), o = v[0], C = v[1], F = [];
      F.push((s + c) / n.width), F.push((o + B) / n.width), F.push((l + C) / n.height), F.push((h + p) / n.height);
      var U = Math.max.apply(Math, F);
      U > 1 && (s /= U, l /= U, c /= U, h /= U, B /= U, p /= U, o /= U, C /= U);
      var S = n.width - c, O = n.height - p, b = n.width - B, P = n.height - C, R = t.borderTopWidth, j = t.borderRightWidth, dA = t.borderBottomWidth, fA = t.borderLeftWidth, mA = We(t.paddingTop, e.bounds.width), FA = We(t.paddingRight, e.bounds.width), NA = We(t.paddingBottom, e.bounds.width), bA = We(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = s > 0 || l > 0 ? Je(n.left + fA / 3, n.top + R / 3, s - fA / 3, l - R / 3, Me.TOP_LEFT) : new MA(n.left + fA / 3, n.top + R / 3), this.topRightBorderDoubleOuterBox = s > 0 || l > 0 ? Je(n.left + S, n.top + R / 3, c - j / 3, h - R / 3, Me.TOP_RIGHT) : new MA(n.left + n.width - j / 3, n.top + R / 3), this.bottomRightBorderDoubleOuterBox = B > 0 || p > 0 ? Je(n.left + b, n.top + O, B - j / 3, p - dA / 3, Me.BOTTOM_RIGHT) : new MA(n.left + n.width - j / 3, n.top + n.height - dA / 3), this.bottomLeftBorderDoubleOuterBox = o > 0 || C > 0 ? Je(n.left + fA / 3, n.top + P, o - fA / 3, C - dA / 3, Me.BOTTOM_LEFT) : new MA(n.left + fA / 3, n.top + n.height - dA / 3), this.topLeftBorderDoubleInnerBox = s > 0 || l > 0 ? Je(n.left + fA * 2 / 3, n.top + R * 2 / 3, s - fA * 2 / 3, l - R * 2 / 3, Me.TOP_LEFT) : new MA(n.left + fA * 2 / 3, n.top + R * 2 / 3), this.topRightBorderDoubleInnerBox = s > 0 || l > 0 ? Je(n.left + S, n.top + R * 2 / 3, c - j * 2 / 3, h - R * 2 / 3, Me.TOP_RIGHT) : new MA(n.left + n.width - j * 2 / 3, n.top + R * 2 / 3), this.bottomRightBorderDoubleInnerBox = B > 0 || p > 0 ? Je(n.left + b, n.top + O, B - j * 2 / 3, p - dA * 2 / 3, Me.BOTTOM_RIGHT) : new MA(n.left + n.width - j * 2 / 3, n.top + n.height - dA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = o > 0 || C > 0 ? Je(n.left + fA * 2 / 3, n.top + P, o - fA * 2 / 3, C - dA * 2 / 3, Me.BOTTOM_LEFT) : new MA(n.left + fA * 2 / 3, n.top + n.height - dA * 2 / 3), this.topLeftBorderStroke = s > 0 || l > 0 ? Je(n.left + fA / 2, n.top + R / 2, s - fA / 2, l - R / 2, Me.TOP_LEFT) : new MA(n.left + fA / 2, n.top + R / 2), this.topRightBorderStroke = s > 0 || l > 0 ? Je(n.left + S, n.top + R / 2, c - j / 2, h - R / 2, Me.TOP_RIGHT) : new MA(n.left + n.width - j / 2, n.top + R / 2), this.bottomRightBorderStroke = B > 0 || p > 0 ? Je(n.left + b, n.top + O, B - j / 2, p - dA / 2, Me.BOTTOM_RIGHT) : new MA(n.left + n.width - j / 2, n.top + n.height - dA / 2), this.bottomLeftBorderStroke = o > 0 || C > 0 ? Je(n.left + fA / 2, n.top + P, o - fA / 2, C - dA / 2, Me.BOTTOM_LEFT) : new MA(n.left + fA / 2, n.top + n.height - dA / 2), this.topLeftBorderBox = s > 0 || l > 0 ? Je(n.left, n.top, s, l, Me.TOP_LEFT) : new MA(n.left, n.top), this.topRightBorderBox = c > 0 || h > 0 ? Je(n.left + S, n.top, c, h, Me.TOP_RIGHT) : new MA(n.left + n.width, n.top), this.bottomRightBorderBox = B > 0 || p > 0 ? Je(n.left + b, n.top + O, B, p, Me.BOTTOM_RIGHT) : new MA(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = o > 0 || C > 0 ? Je(n.left, n.top + P, o, C, Me.BOTTOM_LEFT) : new MA(n.left, n.top + n.height), this.topLeftPaddingBox = s > 0 || l > 0 ? Je(n.left + fA, n.top + R, Math.max(0, s - fA), Math.max(0, l - R), Me.TOP_LEFT) : new MA(n.left + fA, n.top + R), this.topRightPaddingBox = c > 0 || h > 0 ? Je(n.left + Math.min(S, n.width - j), n.top + R, S > n.width + j ? 0 : Math.max(0, c - j), Math.max(0, h - R), Me.TOP_RIGHT) : new MA(n.left + n.width - j, n.top + R), this.bottomRightPaddingBox = B > 0 || p > 0 ? Je(n.left + Math.min(b, n.width - fA), n.top + Math.min(O, n.height - dA), Math.max(0, B - j), Math.max(0, p - dA), Me.BOTTOM_RIGHT) : new MA(n.left + n.width - j, n.top + n.height - dA), this.bottomLeftPaddingBox = o > 0 || C > 0 ? Je(n.left + fA, n.top + Math.min(P, n.height - dA), Math.max(0, o - fA), Math.max(0, C - dA), Me.BOTTOM_LEFT) : new MA(n.left + fA, n.top + n.height - dA), this.topLeftContentBox = s > 0 || l > 0 ? Je(n.left + fA + bA, n.top + R + mA, Math.max(0, s - (fA + bA)), Math.max(0, l - (R + mA)), Me.TOP_LEFT) : new MA(n.left + fA + bA, n.top + R + mA), this.topRightContentBox = c > 0 || h > 0 ? Je(n.left + Math.min(S, n.width + fA + bA), n.top + R + mA, S > n.width + fA + bA ? 0 : c - fA + bA, h - (R + mA), Me.TOP_RIGHT) : new MA(n.left + n.width - (j + FA), n.top + R + mA), this.bottomRightContentBox = B > 0 || p > 0 ? Je(n.left + Math.min(b, n.width - (fA + bA)), n.top + Math.min(O, n.height + R + mA), Math.max(0, B - (j + FA)), p - (dA + NA), Me.BOTTOM_RIGHT) : new MA(n.left + n.width - (j + FA), n.top + n.height - (dA + NA)), this.bottomLeftContentBox = o > 0 || C > 0 ? Je(n.left + fA + bA, n.top + P, Math.max(0, o - (fA + bA)), C - (dA + NA), Me.BOTTOM_LEFT) : new MA(n.left + fA + bA, n.top + n.height - (dA + NA));
    }
    return A;
  }()
), Me;
(function(A) {
  A[A.TOP_LEFT = 0] = "TOP_LEFT", A[A.TOP_RIGHT = 1] = "TOP_RIGHT", A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(Me || (Me = {}));
var Je = function(A, e, t, n, i) {
  var s = 4 * ((Math.sqrt(2) - 1) / 3), l = t * s, f = n * s, c = A + t, h = e + n;
  switch (i) {
    case Me.TOP_LEFT:
      return new _l(new MA(A, h), new MA(A, h - f), new MA(c - l, e), new MA(c, e));
    case Me.TOP_RIGHT:
      return new _l(new MA(A, e), new MA(A + l, e), new MA(c, h - f), new MA(c, h));
    case Me.BOTTOM_RIGHT:
      return new _l(new MA(c, e), new MA(c, e + f), new MA(A + l, h), new MA(A, h));
    case Me.BOTTOM_LEFT:
    default:
      return new _l(new MA(c, h), new MA(c - l, h), new MA(A, e + f), new MA(A, e));
  }
}, Bc = function(A) {
  return [A.topLeftBorderBox, A.topRightBorderBox, A.bottomRightBorderBox, A.bottomLeftBorderBox];
}, dR = function(A) {
  return [
    A.topLeftContentBox,
    A.topRightContentBox,
    A.bottomRightContentBox,
    A.bottomLeftContentBox
  ];
}, wc = function(A) {
  return [
    A.topLeftPaddingBox,
    A.topRightPaddingBox,
    A.bottomRightPaddingBox,
    A.bottomLeftPaddingBox
  ];
}, pR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.offsetX = e, this.offsetY = t, this.matrix = n, this.type = 0, this.target = 6;
    }
    return A;
  }()
), xl = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.path = e, this.target = t, this.type = 1;
    }
    return A;
  }()
), gR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return A;
  }()
), BR = function(A) {
  return A.type === 0;
}, Iy = function(A) {
  return A.type === 1;
}, wR = function(A) {
  return A.type === 2;
}, Wm = function(A, e) {
  return A.length === e.length ? A.some(function(t, n) {
    return t === e[n];
  }) : !1;
}, mR = function(A, e, t, n, i) {
  return A.map(function(s, l) {
    switch (l) {
      case 0:
        return s.add(e, t);
      case 1:
        return s.add(e + n, t);
      case 2:
        return s.add(e + n, t + i);
      case 3:
        return s.add(e, t + i);
    }
    return s;
  });
}, Hy = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return A;
  }()
), Sy = (
  /** @class */
  function() {
    function A(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new hR(this.container), this.container.styles.opacity < 1 && this.effects.push(new gR(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var n = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, s = this.container.styles.transform;
        this.effects.push(new pR(n, i, s));
      }
      if (this.container.styles.overflowX !== 0) {
        var l = Bc(this.curves), f = wc(this.curves);
        Wm(l, f) ? this.effects.push(new xl(
          l,
          6
          /* CONTENT */
        )) : (this.effects.push(new xl(
          l,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new xl(
          f,
          4
          /* CONTENT */
        )));
      }
    }
    return A.prototype.getEffects = function(e) {
      for (var t = [
        2,
        3
        /* FIXED */
      ].indexOf(this.container.styles.position) === -1, n = this.parent, i = this.effects.slice(0); n; ) {
        var s = n.effects.filter(function(c) {
          return !Iy(c);
        });
        if (t || n.container.styles.position !== 0 || !n.parent) {
          if (i.unshift.apply(i, s), t = [
            2,
            3
            /* FIXED */
          ].indexOf(n.container.styles.position) === -1, n.container.styles.overflowX !== 0) {
            var l = Bc(n.curves), f = wc(n.curves);
            Wm(l, f) || i.unshift(new xl(
              f,
              6
              /* CONTENT */
            ));
          }
        } else
          i.unshift.apply(i, s);
        n = n.parent;
      }
      return i.filter(function(c) {
        return ft(c.target, e);
      });
    }, A;
  }()
), Sd = function(A, e, t, n) {
  A.container.elements.forEach(function(i) {
    var s = ft(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), l = ft(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), f = new Sy(i, A);
    ft(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && n.push(f);
    var c = ft(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : n;
    if (s || l) {
      var h = s || i.styles.isPositioned() ? t : e, w = new Hy(f);
      if (i.styles.isPositioned() || i.styles.opacity < 1 || i.styles.isTransformed()) {
        var B = i.styles.zIndex.order;
        if (B < 0) {
          var p = 0;
          h.negativeZIndex.some(function(o, C) {
            return B > o.element.container.styles.zIndex.order ? (p = C, !1) : p > 0;
          }), h.negativeZIndex.splice(p, 0, w);
        } else if (B > 0) {
          var v = 0;
          h.positiveZIndex.some(function(o, C) {
            return B >= o.element.container.styles.zIndex.order ? (v = C + 1, !1) : v > 0;
          }), h.positiveZIndex.splice(v, 0, w);
        } else
          h.zeroOrAutoZIndexOrTransformedOrOpacity.push(w);
      } else
        i.styles.isFloating() ? h.nonPositionedFloats.push(w) : h.nonPositionedInlineLevel.push(w);
      Sd(f, w, s ? w : t, c);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(f) : e.nonInlineLevel.push(f), Sd(f, e, t, c);
    ft(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && Ly(i, c);
  });
}, Ly = function(A, e) {
  for (var t = A instanceof bd ? A.start : 1, n = A instanceof bd ? A.reversed : !1, i = 0; i < e.length; i++) {
    var s = e[i];
    s.container instanceof gy && typeof s.container.value == "number" && s.container.value !== 0 && (t = s.container.value), s.listValue = Ls(t, s.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, vR = function(A) {
  var e = new Sy(A, null), t = new Hy(e), n = [];
  return Sd(e, t, t, n), Ly(e.container, n), t;
}, Xm = function(A, e) {
  switch (e) {
    case 0:
      return Cn(A.topLeftBorderBox, A.topLeftPaddingBox, A.topRightBorderBox, A.topRightPaddingBox);
    case 1:
      return Cn(A.topRightBorderBox, A.topRightPaddingBox, A.bottomRightBorderBox, A.bottomRightPaddingBox);
    case 2:
      return Cn(A.bottomRightBorderBox, A.bottomRightPaddingBox, A.bottomLeftBorderBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return Cn(A.bottomLeftBorderBox, A.bottomLeftPaddingBox, A.topLeftBorderBox, A.topLeftPaddingBox);
  }
}, yR = function(A, e) {
  switch (e) {
    case 0:
      return Cn(A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox, A.topRightBorderBox, A.topRightBorderDoubleOuterBox);
    case 1:
      return Cn(A.topRightBorderBox, A.topRightBorderDoubleOuterBox, A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox);
    case 2:
      return Cn(A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox, A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return Cn(A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox, A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox);
  }
}, CR = function(A, e) {
  switch (e) {
    case 0:
      return Cn(A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox, A.topRightBorderDoubleInnerBox, A.topRightPaddingBox);
    case 1:
      return Cn(A.topRightBorderDoubleInnerBox, A.topRightPaddingBox, A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox);
    case 2:
      return Cn(A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox, A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return Cn(A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox, A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox);
  }
}, QR = function(A, e) {
  switch (e) {
    case 0:
      return Il(A.topLeftBorderStroke, A.topRightBorderStroke);
    case 1:
      return Il(A.topRightBorderStroke, A.bottomRightBorderStroke);
    case 2:
      return Il(A.bottomRightBorderStroke, A.bottomLeftBorderStroke);
    case 3:
    default:
      return Il(A.bottomLeftBorderStroke, A.topLeftBorderStroke);
  }
}, Il = function(A, e) {
  var t = [];
  return vn(A) ? t.push(A.subdivide(0.5, !1)) : t.push(A), vn(e) ? t.push(e.subdivide(0.5, !0)) : t.push(e), t;
}, Cn = function(A, e, t, n) {
  var i = [];
  return vn(A) ? i.push(A.subdivide(0.5, !1)) : i.push(A), vn(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), vn(n) ? i.push(n.subdivide(0.5, !0).reverse()) : i.push(n), vn(e) ? i.push(e.subdivide(0.5, !1).reverse()) : i.push(e), i;
}, Ty = function(A) {
  var e = A.bounds, t = A.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, mc = function(A) {
  var e = A.styles, t = A.bounds, n = We(e.paddingLeft, t.width), i = We(e.paddingRight, t.width), s = We(e.paddingTop, t.width), l = We(e.paddingBottom, t.width);
  return t.add(n + e.borderLeftWidth, s + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + n + i), -(e.borderTopWidth + e.borderBottomWidth + s + l));
}, FR = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? mc(e) : Ty(e);
}, UR = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? mc(e) : Ty(e);
}, Oh = function(A, e, t) {
  var n = FR(Ga(A.styles.backgroundOrigin, e), A), i = UR(Ga(A.styles.backgroundClip, e), A), s = ER(Ga(A.styles.backgroundSize, e), t, n), l = s[0], f = s[1], c = os(Ga(A.styles.backgroundPosition, e), n.width - l, n.height - f), h = bR(Ga(A.styles.backgroundRepeat, e), c, s, n, i), w = Math.round(n.left + c[0]), B = Math.round(n.top + c[1]);
  return [h, w, B, l, f];
}, Pa = function(A) {
  return ke(A) && A.value === ja.AUTO;
}, Hl = function(A) {
  return typeof A == "number";
}, ER = function(A, e, t) {
  var n = e[0], i = e[1], s = e[2], l = A[0], f = A[1];
  if (!l)
    return [0, 0];
  if (st(l) && f && st(f))
    return [We(l, t.width), We(f, t.height)];
  var c = Hl(s);
  if (ke(l) && (l.value === ja.CONTAIN || l.value === ja.COVER)) {
    if (Hl(s)) {
      var h = t.width / t.height;
      return h < s != (l.value === ja.COVER) ? [t.width, t.width / s] : [t.height * s, t.height];
    }
    return [t.width, t.height];
  }
  var w = Hl(n), B = Hl(i), p = w || B;
  if (Pa(l) && (!f || Pa(f))) {
    if (w && B)
      return [n, i];
    if (!c && !p)
      return [t.width, t.height];
    if (p && c) {
      var v = w ? n : i * s, o = B ? i : n / s;
      return [v, o];
    }
    var C = w ? n : t.width, F = B ? i : t.height;
    return [C, F];
  }
  if (c) {
    var U = 0, S = 0;
    return st(l) ? U = We(l, t.width) : st(f) && (S = We(f, t.height)), Pa(l) ? U = S * s : (!f || Pa(f)) && (S = U / s), [U, S];
  }
  var O = null, b = null;
  if (st(l) ? O = We(l, t.width) : f && st(f) && (b = We(f, t.height)), O !== null && (!f || Pa(f)) && (b = w && B ? O / n * i : t.height), b !== null && Pa(l) && (O = w && B ? b / i * n : t.width), O !== null && b !== null)
    return [O, b];
  throw new Error("Unable to calculate background-size for element");
}, Ga = function(A, e) {
  var t = A[e];
  return typeof t > "u" ? A[0] : t;
}, bR = function(A, e, t, n, i) {
  var s = e[0], l = e[1], f = t[0], c = t[1];
  switch (A) {
    case 2:
      return [
        new MA(Math.round(n.left), Math.round(n.top + l)),
        new MA(Math.round(n.left + n.width), Math.round(n.top + l)),
        new MA(Math.round(n.left + n.width), Math.round(c + n.top + l)),
        new MA(Math.round(n.left), Math.round(c + n.top + l))
      ];
    case 3:
      return [
        new MA(Math.round(n.left + s), Math.round(n.top)),
        new MA(Math.round(n.left + s + f), Math.round(n.top)),
        new MA(Math.round(n.left + s + f), Math.round(n.height + n.top)),
        new MA(Math.round(n.left + s), Math.round(n.height + n.top))
      ];
    case 1:
      return [
        new MA(Math.round(n.left + s), Math.round(n.top + l)),
        new MA(Math.round(n.left + s + f), Math.round(n.top + l)),
        new MA(Math.round(n.left + s + f), Math.round(n.top + l + c)),
        new MA(Math.round(n.left + s), Math.round(n.top + l + c))
      ];
    default:
      return [
        new MA(Math.round(i.left), Math.round(i.top)),
        new MA(Math.round(i.left + i.width), Math.round(i.top)),
        new MA(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new MA(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, _R = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", qm = "Hidden Text", xR = (
  /** @class */
  function() {
    function A(e) {
      this._data = {}, this._document = e;
    }
    return A.prototype.parseMetrics = function(e, t) {
      var n = this._document.createElement("div"), i = this._document.createElement("img"), s = this._document.createElement("span"), l = this._document.body;
      n.style.visibility = "hidden", n.style.fontFamily = e, n.style.fontSize = t, n.style.margin = "0", n.style.padding = "0", n.style.whiteSpace = "nowrap", l.appendChild(n), i.src = _R, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", s.style.fontFamily = e, s.style.fontSize = t, s.style.margin = "0", s.style.padding = "0", s.appendChild(this._document.createTextNode(qm)), n.appendChild(s), n.appendChild(i);
      var f = i.offsetTop - s.offsetTop + 2;
      n.removeChild(s), n.appendChild(this._document.createTextNode(qm)), n.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var c = i.offsetTop - n.offsetTop + 2;
      return l.removeChild(n), { baseline: f, middle: c };
    }, A.prototype.getMetrics = function(e, t) {
      var n = e + " " + t;
      return typeof this._data[n] > "u" && (this._data[n] = this.parseMetrics(e, t)), this._data[n];
    }, A;
  }()
), Dy = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.context = e, this.options = t;
    }
    return A;
  }()
), IR = 1e4, HR = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i._activeEffects = [], i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), n.canvas || (i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px"), i.fontMetrics = new xR(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + n.width + "x" + n.height + ") with scale " + n.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var n = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return n.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), wR(t) && (this.ctx.globalAlpha = t.opacity), BR(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), Iy(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return $t(this, void 0, void 0, function() {
        var n;
        return Tt(this, function(i) {
          switch (i.label) {
            case 0:
              return n = t.element.container.styles, n.isVisible() ? [4, this.renderStackContent(t)] : [3, 2];
            case 1:
              i.sent(), i.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNode = function(t) {
      return $t(this, void 0, void 0, function() {
        return Tt(this, function(n) {
          switch (n.label) {
            case 0:
              if (ft(
                t.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return t.container.styles.isVisible() ? [4, this.renderNodeBackgroundAndBorders(t)] : [3, 3];
            case 1:
              return n.sent(), [4, this.renderNodeContent(t)];
            case 2:
              n.sent(), n.label = 3;
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderTextWithLetterSpacing = function(t, n, i) {
      var s = this;
      if (n === 0)
        this.ctx.fillText(t.text, t.bounds.left, t.bounds.top + i);
      else {
        var l = Vp(t.text);
        l.reduce(function(f, c) {
          return s.ctx.fillText(c, f, t.bounds.top + i), f + s.ctx.measureText(c).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var n = t.fontVariant.filter(function(l) {
        return l === "normal" || l === "small-caps";
      }).join(""), i = OR(t.fontFamily).join(", "), s = ks(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, n, t.fontWeight, s, i].join(" "),
        i,
        s
      ];
    }, e.prototype.renderTextNode = function(t, n) {
      return $t(this, void 0, void 0, function() {
        var i, s, l, f, c, h, w, B, p = this;
        return Tt(this, function(v) {
          return i = this.createFontStyle(n), s = i[0], l = i[1], f = i[2], this.ctx.font = s, this.ctx.direction = n.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", c = this.fontMetrics.getMetrics(l, f), h = c.baseline, w = c.middle, B = n.paintOrder, t.textBounds.forEach(function(o) {
            B.forEach(function(C) {
              switch (C) {
                case 0:
                  p.ctx.fillStyle = gt(n.color), p.renderTextWithLetterSpacing(o, n.letterSpacing, h);
                  var F = n.textShadow;
                  F.length && o.text.trim().length && (F.slice(0).reverse().forEach(function(U) {
                    p.ctx.shadowColor = gt(U.color), p.ctx.shadowOffsetX = U.offsetX.number * p.options.scale, p.ctx.shadowOffsetY = U.offsetY.number * p.options.scale, p.ctx.shadowBlur = U.blur.number, p.renderTextWithLetterSpacing(o, n.letterSpacing, h);
                  }), p.ctx.shadowColor = "", p.ctx.shadowOffsetX = 0, p.ctx.shadowOffsetY = 0, p.ctx.shadowBlur = 0), n.textDecorationLine.length && (p.ctx.fillStyle = gt(n.textDecorationColor || n.color), n.textDecorationLine.forEach(function(U) {
                    switch (U) {
                      case 1:
                        p.ctx.fillRect(o.bounds.left, Math.round(o.bounds.top + h), o.bounds.width, 1);
                        break;
                      case 2:
                        p.ctx.fillRect(o.bounds.left, Math.round(o.bounds.top), o.bounds.width, 1);
                        break;
                      case 3:
                        p.ctx.fillRect(o.bounds.left, Math.ceil(o.bounds.top + w), o.bounds.width, 1);
                        break;
                    }
                  }));
                  break;
                case 1:
                  n.webkitTextStrokeWidth && o.text.trim().length && (p.ctx.strokeStyle = gt(n.webkitTextStrokeColor), p.ctx.lineWidth = n.webkitTextStrokeWidth, p.ctx.lineJoin = window.chrome ? "miter" : "round", p.ctx.strokeText(o.text, o.bounds.left, o.bounds.top + h)), p.ctx.strokeStyle = "", p.ctx.lineWidth = 0, p.ctx.lineJoin = "miter";
                  break;
              }
            });
          }), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderReplacedElement = function(t, n, i) {
      if (i && t.intrinsicWidth > 0 && t.intrinsicHeight > 0) {
        var s = mc(t), l = wc(n);
        this.path(l), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, s.left, s.top, s.width, s.height), this.ctx.restore();
      }
    }, e.prototype.renderNodeContent = function(t) {
      return $t(this, void 0, void 0, function() {
        var n, i, s, l, f, c, S, S, h, w, B, p, b, v, o, P, C, F, U, S, O, b, P;
        return Tt(this, function(R) {
          switch (R.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), n = t.container, i = t.curves, s = n.styles, l = 0, f = n.textNodes, R.label = 1;
            case 1:
              return l < f.length ? (c = f[l], [4, this.renderTextNode(c, s)]) : [3, 4];
            case 2:
              R.sent(), R.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              if (!(n instanceof hy)) return [3, 8];
              R.label = 5;
            case 5:
              return R.trys.push([5, 7, , 8]), [4, this.context.cache.match(n.src)];
            case 6:
              return S = R.sent(), this.renderReplacedElement(n, i, S), [3, 8];
            case 7:
              return R.sent(), this.context.logger.error("Error loading image " + n.src), [3, 8];
            case 8:
              if (n instanceof dy && this.renderReplacedElement(n, i, n.canvas), !(n instanceof py)) return [3, 12];
              R.label = 9;
            case 9:
              return R.trys.push([9, 11, , 12]), [4, this.context.cache.match(n.svg)];
            case 10:
              return S = R.sent(), this.renderReplacedElement(n, i, S), [3, 12];
            case 11:
              return R.sent(), this.context.logger.error("Error loading svg " + n.svg.substring(0, 255)), [3, 12];
            case 12:
              return n instanceof my && n.tree ? (h = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: n.backgroundColor,
                x: 0,
                y: 0,
                width: n.width,
                height: n.height
              }), [4, h.render(n.tree)]) : [3, 14];
            case 13:
              w = R.sent(), n.width && n.height && this.ctx.drawImage(w, 0, 0, n.width, n.height, n.bounds.left, n.bounds.top, n.bounds.width, n.bounds.height), R.label = 14;
            case 14:
              if (n instanceof Wp && (B = Math.min(n.bounds.width, n.bounds.height), n.type === hc ? n.checked && (this.ctx.save(), this.path([
                new MA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79),
                new MA(n.bounds.left + B * 0.16, n.bounds.top + B * 0.5549),
                new MA(n.bounds.left + B * 0.27347, n.bounds.top + B * 0.44071),
                new MA(n.bounds.left + B * 0.39694, n.bounds.top + B * 0.5649),
                new MA(n.bounds.left + B * 0.72983, n.bounds.top + B * 0.23),
                new MA(n.bounds.left + B * 0.84, n.bounds.top + B * 0.34085),
                new MA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79)
              ]), this.ctx.fillStyle = gt(Dm), this.ctx.fill(), this.ctx.restore()) : n.type === dc && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + B / 2, n.bounds.top + B / 2, B / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = gt(Dm), this.ctx.fill(), this.ctx.restore())), SR(n) && n.value.length) {
                switch (p = this.createFontStyle(s), b = p[0], v = p[1], o = this.fontMetrics.getMetrics(b, v).baseline, this.ctx.font = b, this.ctx.fillStyle = gt(s.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = TR(n.styles.textAlign), P = mc(n), C = 0, n.styles.textAlign) {
                  case 1:
                    C += P.width / 2;
                    break;
                  case 2:
                    C += P.width;
                    break;
                }
                F = P.add(C, 0, 0, -P.height / 2 + 1), this.ctx.save(), this.path([
                  new MA(P.left, P.top),
                  new MA(P.left + P.width, P.top),
                  new MA(P.left + P.width, P.top + P.height),
                  new MA(P.left, P.top + P.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new vs(n.value, F), s.letterSpacing, o), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!ft(
                n.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (n.styles.listStyleImage === null) return [3, 19];
              if (U = n.styles.listStyleImage, U.type !== 0) return [3, 18];
              S = void 0, O = U.url, R.label = 15;
            case 15:
              return R.trys.push([15, 17, , 18]), [4, this.context.cache.match(O)];
            case 16:
              return S = R.sent(), this.ctx.drawImage(S, n.bounds.left - (S.width + 10), n.bounds.top), [3, 18];
            case 17:
              return R.sent(), this.context.logger.error("Error loading list-style-image " + O), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && n.styles.listStyleType !== -1 && (b = this.createFontStyle(s)[0], this.ctx.font = b, this.ctx.fillStyle = gt(s.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", P = new Gr(n.bounds.left, n.bounds.top + We(n.styles.paddingTop, n.bounds.width), n.bounds.width, wm(s.lineHeight, s.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new vs(t.listValue, P), s.letterSpacing, wm(s.lineHeight, s.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), R.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderStackContent = function(t) {
      return $t(this, void 0, void 0, function() {
        var n, i, U, s, l, U, f, c, U, h, w, U, B, p, U, v, o, U, C, F, U;
        return Tt(this, function(S) {
          switch (S.label) {
            case 0:
              if (ft(
                t.element.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return [4, this.renderNodeBackgroundAndBorders(t.element)];
            case 1:
              S.sent(), n = 0, i = t.negativeZIndex, S.label = 2;
            case 2:
              return n < i.length ? (U = i[n], [4, this.renderStack(U)]) : [3, 5];
            case 3:
              S.sent(), S.label = 4;
            case 4:
              return n++, [3, 2];
            case 5:
              return [4, this.renderNodeContent(t.element)];
            case 6:
              S.sent(), s = 0, l = t.nonInlineLevel, S.label = 7;
            case 7:
              return s < l.length ? (U = l[s], [4, this.renderNode(U)]) : [3, 10];
            case 8:
              S.sent(), S.label = 9;
            case 9:
              return s++, [3, 7];
            case 10:
              f = 0, c = t.nonPositionedFloats, S.label = 11;
            case 11:
              return f < c.length ? (U = c[f], [4, this.renderStack(U)]) : [3, 14];
            case 12:
              S.sent(), S.label = 13;
            case 13:
              return f++, [3, 11];
            case 14:
              h = 0, w = t.nonPositionedInlineLevel, S.label = 15;
            case 15:
              return h < w.length ? (U = w[h], [4, this.renderStack(U)]) : [3, 18];
            case 16:
              S.sent(), S.label = 17;
            case 17:
              return h++, [3, 15];
            case 18:
              B = 0, p = t.inlineLevel, S.label = 19;
            case 19:
              return B < p.length ? (U = p[B], [4, this.renderNode(U)]) : [3, 22];
            case 20:
              S.sent(), S.label = 21;
            case 21:
              return B++, [3, 19];
            case 22:
              v = 0, o = t.zeroOrAutoZIndexOrTransformedOrOpacity, S.label = 23;
            case 23:
              return v < o.length ? (U = o[v], [4, this.renderStack(U)]) : [3, 26];
            case 24:
              S.sent(), S.label = 25;
            case 25:
              return v++, [3, 23];
            case 26:
              C = 0, F = t.positiveZIndex, S.label = 27;
            case 27:
              return C < F.length ? (U = F[C], [4, this.renderStack(U)]) : [3, 30];
            case 28:
              S.sent(), S.label = 29;
            case 29:
              return C++, [3, 27];
            case 30:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.mask = function(t) {
      this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.lineTo(this.canvas.width, 0), this.ctx.lineTo(this.canvas.width, this.canvas.height), this.ctx.lineTo(0, this.canvas.height), this.ctx.lineTo(0, 0), this.formatPath(t.slice(0).reverse()), this.ctx.closePath();
    }, e.prototype.path = function(t) {
      this.ctx.beginPath(), this.formatPath(t), this.ctx.closePath();
    }, e.prototype.formatPath = function(t) {
      var n = this;
      t.forEach(function(i, s) {
        var l = vn(i) ? i.start : i;
        s === 0 ? n.ctx.moveTo(l.x, l.y) : n.ctx.lineTo(l.x, l.y), vn(i) && n.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
      });
    }, e.prototype.renderRepeat = function(t, n, i, s) {
      this.path(t), this.ctx.fillStyle = n, this.ctx.translate(i, s), this.ctx.fill(), this.ctx.translate(-i, -s);
    }, e.prototype.resizeImage = function(t, n, i) {
      var s;
      if (t.width === n && t.height === i)
        return t;
      var l = (s = this.canvas.ownerDocument) !== null && s !== void 0 ? s : document, f = l.createElement("canvas");
      f.width = Math.max(1, n), f.height = Math.max(1, i);
      var c = f.getContext("2d");
      return c.drawImage(t, 0, 0, t.width, t.height, 0, 0, n, i), f;
    }, e.prototype.renderBackgroundImage = function(t) {
      return $t(this, void 0, void 0, function() {
        var n, i, s, l, f, c;
        return Tt(this, function(h) {
          switch (h.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(w) {
                var B, p, v, mA, aA, BA, bA, z, dA, o, mA, aA, BA, bA, z, C, F, U, S, O, b, P, R, j, dA, fA, mA, FA, NA, bA, z, QA, aA, BA, HA, SA, lA, D, iA, Y, L, k;
                return Tt(this, function(oA) {
                  switch (oA.label) {
                    case 0:
                      if (w.type !== 0) return [3, 5];
                      B = void 0, p = w.url, oA.label = 1;
                    case 1:
                      return oA.trys.push([1, 3, , 4]), [4, s.context.cache.match(p)];
                    case 2:
                      return B = oA.sent(), [3, 4];
                    case 3:
                      return oA.sent(), s.context.logger.error("Error loading background-image " + p), [3, 4];
                    case 4:
                      return B && (v = Oh(t, n, [
                        B.width,
                        B.height,
                        B.width / B.height
                      ]), mA = v[0], aA = v[1], BA = v[2], bA = v[3], z = v[4], dA = s.ctx.createPattern(s.resizeImage(B, bA, z), "repeat"), s.renderRepeat(mA, dA, aA, BA)), [3, 6];
                    case 5:
                      BM(w) ? (o = Oh(t, n, [null, null, null]), mA = o[0], aA = o[1], BA = o[2], bA = o[3], z = o[4], C = fM(w.angle, bA, z), F = C[0], U = C[1], S = C[2], O = C[3], b = C[4], P = document.createElement("canvas"), P.width = bA, P.height = z, R = P.getContext("2d"), j = R.createLinearGradient(U, O, S, b), gm(w.stops, F).forEach(function(_A) {
                        return j.addColorStop(_A.stop, gt(_A.color));
                      }), R.fillStyle = j, R.fillRect(0, 0, bA, z), bA > 0 && z > 0 && (dA = s.ctx.createPattern(P, "repeat"), s.renderRepeat(mA, dA, aA, BA))) : wM(w) && (fA = Oh(t, n, [
                        null,
                        null,
                        null
                      ]), mA = fA[0], FA = fA[1], NA = fA[2], bA = fA[3], z = fA[4], QA = w.position.length === 0 ? [kp] : w.position, aA = We(QA[0], bA), BA = We(QA[QA.length - 1], z), HA = hM(w, aA, BA, bA, z), SA = HA[0], lA = HA[1], SA > 0 && lA > 0 && (D = s.ctx.createRadialGradient(FA + aA, NA + BA, 0, FA + aA, NA + BA, SA), gm(w.stops, SA * 2).forEach(function(_A) {
                        return D.addColorStop(_A.stop, gt(_A.color));
                      }), s.path(mA), s.ctx.fillStyle = D, SA !== lA ? (iA = t.bounds.left + 0.5 * t.bounds.width, Y = t.bounds.top + 0.5 * t.bounds.height, L = lA / SA, k = 1 / L, s.ctx.save(), s.ctx.translate(iA, Y), s.ctx.transform(1, 0, 0, L, 0, 0), s.ctx.translate(-iA, -Y), s.ctx.fillRect(FA, k * (NA - Y) + Y, bA, z * k), s.ctx.restore()) : s.ctx.fill())), oA.label = 6;
                    case 6:
                      return n--, [
                        2
                        /*return*/
                      ];
                  }
                });
              }, s = this, l = 0, f = t.styles.backgroundImage.slice(0).reverse(), h.label = 1;
            case 1:
              return l < f.length ? (c = f[l], [5, i(c)]) : [3, 4];
            case 2:
              h.sent(), h.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderSolidBorder = function(t, n, i) {
      return $t(this, void 0, void 0, function() {
        return Tt(this, function(s) {
          return this.path(Xm(i, n)), this.ctx.fillStyle = gt(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, n, i, s) {
      return $t(this, void 0, void 0, function() {
        var l, f;
        return Tt(this, function(c) {
          switch (c.label) {
            case 0:
              return n < 3 ? [4, this.renderSolidBorder(t, i, s)] : [3, 2];
            case 1:
              return c.sent(), [
                2
                /*return*/
              ];
            case 2:
              return l = yR(s, i), this.path(l), this.ctx.fillStyle = gt(t), this.ctx.fill(), f = CR(s, i), this.path(f), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return $t(this, void 0, void 0, function() {
        var n, i, s, l, f, c, h, w, B = this;
        return Tt(this, function(p) {
          switch (p.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), n = t.container.styles, i = !yi(n.backgroundColor) || n.backgroundImage.length, s = [
                { style: n.borderTopStyle, color: n.borderTopColor, width: n.borderTopWidth },
                { style: n.borderRightStyle, color: n.borderRightColor, width: n.borderRightWidth },
                { style: n.borderBottomStyle, color: n.borderBottomColor, width: n.borderBottomWidth },
                { style: n.borderLeftStyle, color: n.borderLeftColor, width: n.borderLeftWidth }
              ], l = LR(Ga(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), yi(n.backgroundColor) || (this.ctx.fillStyle = gt(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              p.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(v) {
                B.ctx.save();
                var o = Bc(t.curves), C = v.inset ? 0 : IR, F = mR(o, -C + (v.inset ? 1 : -1) * v.spread.number, (v.inset ? 1 : -1) * v.spread.number, v.spread.number * (v.inset ? -2 : 2), v.spread.number * (v.inset ? -2 : 2));
                v.inset ? (B.path(o), B.ctx.clip(), B.mask(F)) : (B.mask(o), B.ctx.clip(), B.path(F)), B.ctx.shadowOffsetX = v.offsetX.number + C, B.ctx.shadowOffsetY = v.offsetY.number, B.ctx.shadowColor = gt(v.color), B.ctx.shadowBlur = v.blur.number, B.ctx.fillStyle = v.inset ? gt(v.color) : "rgba(0,0,0,1)", B.ctx.fill(), B.ctx.restore();
              }), p.label = 2;
            case 2:
              f = 0, c = 0, h = s, p.label = 3;
            case 3:
              return c < h.length ? (w = h[c], w.style !== 0 && !yi(w.color) && w.width > 0 ? w.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
                w.color,
                w.width,
                f,
                t.curves,
                2
                /* DASHED */
              )] : [3, 11]) : [3, 13];
            case 4:
              return p.sent(), [3, 11];
            case 5:
              return w.style !== 3 ? [3, 7] : [4, this.renderDashedDottedBorder(
                w.color,
                w.width,
                f,
                t.curves,
                3
                /* DOTTED */
              )];
            case 6:
              return p.sent(), [3, 11];
            case 7:
              return w.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(w.color, w.width, f, t.curves)];
            case 8:
              return p.sent(), [3, 11];
            case 9:
              return [4, this.renderSolidBorder(w.color, f, t.curves)];
            case 10:
              p.sent(), p.label = 11;
            case 11:
              f++, p.label = 12;
            case 12:
              return c++, [3, 3];
            case 13:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderDashedDottedBorder = function(t, n, i, s, l) {
      return $t(this, void 0, void 0, function() {
        var f, c, h, w, B, p, v, o, C, F, U, S, O, b, P, R, P, R;
        return Tt(this, function(j) {
          return this.ctx.save(), f = QR(s, i), c = Xm(s, i), l === 2 && (this.path(c), this.ctx.clip()), vn(c[0]) ? (h = c[0].start.x, w = c[0].start.y) : (h = c[0].x, w = c[0].y), vn(c[1]) ? (B = c[1].end.x, p = c[1].end.y) : (B = c[1].x, p = c[1].y), i === 0 || i === 2 ? v = Math.abs(h - B) : v = Math.abs(w - p), this.ctx.beginPath(), l === 3 ? this.formatPath(f) : this.formatPath(c.slice(0, 2)), o = n < 3 ? n * 3 : n * 2, C = n < 3 ? n * 2 : n, l === 3 && (o = n, C = n), F = !0, v <= o * 2 ? F = !1 : v <= o * 2 + C ? (U = v / (2 * o + C), o *= U, C *= U) : (S = Math.floor((v + C) / (o + C)), O = (v - S * o) / (S - 1), b = (v - (S + 1) * o) / S, C = b <= 0 || Math.abs(C - O) < Math.abs(C - b) ? O : b), F && (l === 3 ? this.ctx.setLineDash([0, o + C]) : this.ctx.setLineDash([o, C])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = gt(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (vn(c[0]) && (P = c[3], R = c[0], this.ctx.beginPath(), this.formatPath([new MA(P.end.x, P.end.y), new MA(R.start.x, R.start.y)]), this.ctx.stroke()), vn(c[1]) && (P = c[1], R = c[2], this.ctx.beginPath(), this.formatPath([new MA(P.end.x, P.end.y), new MA(R.start.x, R.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return $t(this, void 0, void 0, function() {
        var n;
        return Tt(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = gt(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = vR(t), [4, this.renderStack(n)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Dy)
), SR = function(A) {
  return A instanceof wy || A instanceof By ? !0 : A instanceof Wp && A.type !== dc && A.type !== hc;
}, LR = function(A, e) {
  switch (A) {
    case 0:
      return Bc(e);
    case 2:
      return dR(e);
    case 1:
    default:
      return wc(e);
  }
}, TR = function(A) {
  switch (A) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, DR = ["-apple-system", "system-ui"], OR = function(A) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? A.filter(function(e) {
    return DR.indexOf(e) === -1;
  }) : A;
}, NR = (
  /** @class */
  function(A) {
    qn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), i.options = n, i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px", i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + n.width + "x" + n.height + " at " + n.x + "," + n.y + ") with scale " + n.scale), i;
    }
    return e.prototype.render = function(t) {
      return $t(this, void 0, void 0, function() {
        var n, i;
        return Tt(this, function(s) {
          switch (s.label) {
            case 0:
              return n = Ed(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, MR(n)];
            case 1:
              return i = s.sent(), this.options.backgroundColor && (this.ctx.fillStyle = gt(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Dy)
), MR = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, PR = (
  /** @class */
  function() {
    function A(e) {
      var t = e.id, n = e.enabled;
      this.id = t, this.enabled = n, this.start = Date.now();
    }
    return A.prototype.debug = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, ul([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.prototype.getTime = function() {
      return Date.now() - this.start;
    }, A.prototype.info = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, ul([this.id, this.getTime() + "ms"], e));
    }, A.prototype.warn = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, ul([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.prototype.error = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, ul([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.instances = {}, A;
  }()
), KR = (
  /** @class */
  function() {
    function A(e, t) {
      var n;
      this.windowBounds = t, this.instanceName = "#" + A.instanceCount++, this.logger = new PR({ id: this.instanceName, enabled: e.logging }), this.cache = (n = e.cache) !== null && n !== void 0 ? n : new aR(this, e);
    }
    return A.instanceCount = 1, A;
  }()
), RR = function(A, e) {
  return e === void 0 && (e = {}), kR(A, e);
};
typeof window < "u" && xy.setContext(window);
var kR = function(A, e) {
  return $t(void 0, void 0, void 0, function() {
    var t, n, i, s, l, f, c, h, w, B, p, v, o, C, F, U, S, O, b, P, j, R, j, dA, fA, mA, FA, NA, bA, z, QA, aA, BA, HA, SA, lA, D, iA, Y, L;
    return Tt(this, function(k) {
      switch (k.label) {
        case 0:
          if (!A || typeof A != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = A.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (n = t.defaultView, !n)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (dA = e.allowTaint) !== null && dA !== void 0 ? dA : !1,
            imageTimeout: (fA = e.imageTimeout) !== null && fA !== void 0 ? fA : 15e3,
            proxy: e.proxy,
            useCORS: (mA = e.useCORS) !== null && mA !== void 0 ? mA : !1
          }, s = cd({ logging: (FA = e.logging) !== null && FA !== void 0 ? FA : !0, cache: e.cache }, i), l = {
            windowWidth: (NA = e.windowWidth) !== null && NA !== void 0 ? NA : n.innerWidth,
            windowHeight: (bA = e.windowHeight) !== null && bA !== void 0 ? bA : n.innerHeight,
            scrollX: (z = e.scrollX) !== null && z !== void 0 ? z : n.pageXOffset,
            scrollY: (QA = e.scrollY) !== null && QA !== void 0 ? QA : n.pageYOffset
          }, f = new Gr(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), c = new KR(s, f), h = (aA = e.foreignObjectRendering) !== null && aA !== void 0 ? aA : !1, w = {
            allowTaint: (BA = e.allowTaint) !== null && BA !== void 0 ? BA : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: h,
            copyStyles: h
          }, c.logger.debug("Starting document clone with size " + f.width + "x" + f.height + " scrolled to " + -f.left + "," + -f.top), B = new Gm(c, A, w), p = B.clonedReferenceElement, p ? [4, B.toIFrame(t, f)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return v = k.sent(), o = Xp(p) || $K(p) ? m4(p.ownerDocument) : Lc(c, p), C = o.width, F = o.height, U = o.left, S = o.top, O = $R(c, p, e.backgroundColor), b = {
            canvas: e.canvas,
            backgroundColor: O,
            scale: (SA = (HA = e.scale) !== null && HA !== void 0 ? HA : n.devicePixelRatio) !== null && SA !== void 0 ? SA : 1,
            x: ((lA = e.x) !== null && lA !== void 0 ? lA : 0) + U,
            y: ((D = e.y) !== null && D !== void 0 ? D : 0) + S,
            width: (iA = e.width) !== null && iA !== void 0 ? iA : Math.ceil(C),
            height: (Y = e.height) !== null && Y !== void 0 ? Y : Math.ceil(F)
          }, h ? (c.logger.debug("Document cloned, using foreign object rendering"), j = new NR(c, b), [4, j.render(p)]) : [3, 3];
        case 2:
          return P = k.sent(), [3, 5];
        case 3:
          return c.logger.debug("Document cloned, element located at " + U + "," + S + " with size " + C + "x" + F + " using computed rendering"), c.logger.debug("Starting DOM parsing"), R = yy(c, p), O === R.styles.backgroundColor && (R.styles.backgroundColor = Kr.TRANSPARENT), c.logger.debug("Starting renderer for element at " + b.x + "," + b.y + " with size " + b.width + "x" + b.height), j = new HR(c, b), [4, j.render(R)];
        case 4:
          P = k.sent(), k.label = 5;
        case 5:
          return (!((L = e.removeContainer) !== null && L !== void 0) || L) && (Gm.destroy(v) || c.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), c.logger.debug("Finished rendering"), [2, P];
      }
    });
  });
}, $R = function(A, e, t) {
  var n = e.ownerDocument, i = n.documentElement ? ws(A, getComputedStyle(n.documentElement).backgroundColor) : Kr.TRANSPARENT, s = n.body ? ws(A, getComputedStyle(n.body).backgroundColor) : Kr.TRANSPARENT, l = typeof t == "string" ? ws(A, t) : t === null ? Kr.TRANSPARENT : 4294967295;
  return e === n.documentElement ? yi(i) ? yi(s) ? l : s : i : l;
};
let pi = {};
pi.vectorEffectSupport = !0;
pi.Listener = function(A) {
  var e = A, t = [], n = function(i) {
    if (!arguments.length || i == e)
      return e;
    e = i, t.forEach(function(s) {
      s(e);
    });
  };
  return n.addListener = function(i) {
    return t.push(i), n;
  }, n.removeListener = function(i) {
    return Te.pull(t, i), n;
  }, n;
};
pi.GeneMap = function(A) {
  var e = {
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
  }, t = Te.merge({}, e, A), n, i, s, l, f, c, h, w, B, p, v, o, C, F, U, S, O = !1, b = {}, P = function() {
    if (O) {
      var G = oe(n).height();
      t.height = G - 80, t.width = "100%";
    }
  }, R = function() {
    O ? (t.height = b.height, t.width = b.width, XA(n).classed("fullscreen", !1), O = !1) : (b.height = t.height, b.width = t.width, XA(n).classed("fullscreen", !0), O = !0), P(), QA(), fA(), q();
  }, j = function() {
    var G = { width: t.width, height: t.height };
    if (G.width.toString().indexOf("%") >= 0 || G.height.toString().indexOf("%") >= 0) {
      var tA = XA(n).select("svg").node().getBoundingClientRect();
      G.width.toString().indexOf("%") >= 0 && (G.width = tA.width), G.height.toString().indexOf("%") >= 0 && (G.height = tA.height);
    }
    return G;
  }, dA = function() {
    const G = Ra(i.node()), tA = G.k, cA = [G.x, G.y];
    return cA[0] !== 0 || cA[1] !== 0 || tA !== 1;
  }, fA = function() {
    const G = Ra(i.node()), tA = G.k, cA = [G.x, G.y];
    tA === 1 && Te.isEqual(cA, [0, 0]) || (c.translate([0, 0]), c.scale(1), s.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    ), o.setFitButtonEnabled(dA()), IA(), q());
  }, mA = function() {
    s.select(".drawing_outline").attr("width", B.drawing.width).attr("height", B.drawing.height);
  }, FA = function() {
    var G = B.drawing, tA = B.margin;
    s.select(".drawing_margin").attr("x", tA.left).attr("y", tA.top).attr("width", G.width - tA.left - tA.right).attr("height", G.height - tA.top - tA.bottom);
  }, NA = function() {
    s.attr("transform", "translate(0,0)scale(1)"), s.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    );
  }, bA = async function() {
    const G = document.querySelector(".mapview-wrapper");
    RR(G).then((tA) => {
      const cA = tA.toDataURL("image/png"), DA = document.createElement("a");
      DA.href = cA, DA.download = "capture.png", DA.click();
    }).catch((tA) => {
      console.error("Error capturing the element:", tA);
    });
  };
  h = function() {
    var G = Ra(this), tA = [G.x, G.y], cA = G.k;
    if (B) {
      var DA = i.node().getBoundingClientRect(), YA = -B.drawing.width * cA + DA.width * (1 - t.extraPanArea) + B.drawing.margin.right * cA, ue = DA.width * t.extraPanArea - B.drawing.margin.left * cA;
      tA[0] = Te.clamp(tA[0], YA, ue);
      var xe = -B.drawing.height * cA + DA.height * (1 - t.extraPanArea) + B.drawing.margin.bottom * cA, he = DA.height * t.extraPanArea - B.drawing.margin.top * cA;
      tA[1] = Te.clamp(tA[1], xe, he);
    }
    (G.x !== tA[0] || G.y !== tA[1]) && c.translateBy(
      i,
      tA[0] - G.x,
      tA[1] - G.y
    ), cA !== w && (IA(), q(), w = cA), o.setFitButtonEnabled(dA()), s.attr(
      "transform",
      "translate(" + tA[0] + "," + tA[1] + ")scale(" + cA + ")"
    ), QA(), l.text(
      "translate: [ " + tA[0].toFixed(1) + "," + tA[1].toFixed(1) + "]  zoom:" + cA.toFixed(2)
    );
  };
  var z = function(G) {
    G.preventDefault();
  }, QA = function() {
    oe(".gene-annotation-popover").remove();
  }, aA = function() {
    var G = function(cA) {
      cA.target !== "undefined" && cA.target.tagName.toLowerCase() === "a" || oe(cA.target).closest(".genemap-advanced-menu").length > 0 || oe(cA.target).closest(".color-picker-modal").length > 0 || QA();
    }, tA = "mousedown mousewheel DOMMouseScroll touchstart ";
    oe(n).off(tA).on(tA, G), oe("body").on("click", function(cA) {
      oe(cA.target).closest(n).length < 1 && O == !0 && R();
    });
  }, BA = function(G) {
    G == "auto" ? (C = !0, F = !0, B.chromosomes.forEach(function(tA) {
      tA.annotations.genes.forEach(function(cA) {
        cA.selected == !0 && (cA.visible = !0);
      });
    })) : G == "show" ? (C = !1, F = !0) : G == "hide" && (C = !1, F = !1), B.chromosomes.forEach(function(tA) {
      tA.annotations.genes.forEach(function(cA) {
        G === "auto" ? delete cA.showLabel : cA.showLabel = G;
      });
    }), console.log("genome", B), IA(), q();
  }, HA = function() {
    var G = B.chromosomes.some(function(tA) {
      return tA.annotations.genes.some(function(cA) {
        return cA.selected;
      });
    });
    X.onAnonationLabelSelectFunction && X.onAnonationLabelSelectFunction(X.getSelectedGenes()), IA(), q(), XA(".network-btn").classed("disabled", !G);
  }, SA = function(G) {
    v ? (B = p, v = !1) : (B = { chromosomes: [G] }, v = !0), X.onAnonationLabelSelectFunction(X.getSelectedGenes()), fA(), IA(), q();
  }, lA = function() {
    Te.flatMap(
      B.chromosomes.map(function(G) {
        return G.annotations.genes.filter(function(tA) {
          return tA.selected;
        }).map(function(tA) {
          var cA = tA.link, DA = cA.substring(cA.indexOf("list="), cA.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              DA.replace(/\+/g, " ")
            )
          );
        });
      })
    ), t.apiUrl + "";
  }, D = function() {
    var G = o.getTagButtonState(), tA;
    G === "auto" ? tA = "show" : G === "show" ? tA = "hide" : tA = "auto", o.setTabButtonState(tA), BA(tA), q();
  }, iA = function() {
    B.chromosomes.forEach(function(G) {
      G.annotations.allGenes.forEach(function(tA) {
        tA.selected = !1, tA.visible = !1, tA.hidden = !1;
      });
    }), IA(), q();
  }, Y = function(G) {
    t.layout.numberPerRow = G, oA(), IA(), q();
  }, L = function(G) {
    G == "all" ? (U = !0, S = !0) : G == "selected" ? (U = !1, S = "true") : (U = !1, S = !1), _A(), IA(), q();
  }, k = function() {
    const tA = Ra(i.node()).k;
    var cA = rH(t.layout).width(j().width).height(j().height).scale(tA);
    B = cA.decorateGenome(B);
  }, oA = function() {
    B.chromosomes.forEach(function(G) {
      G.layout = G.layout || {}, G.layout.annotationDisplayClusters = null, G.layout.geneBandDisplayClusters = null;
    });
  }, _A = function() {
    B.chromosomes.forEach(function(G) {
      G.layout = G.layout || {}, G.layout.qtlDisplayClusters = null;
    });
  }, IA = function() {
    const tA = Ra(i.node()).k;
    k();
    var cA = f4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: B.cellLayout.annotations.marker.size,
      annotationLabelSize: B.cellLayout.annotations.label.size,
      scale: tA,
      autoLabels: C,
      manualLabels: F,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), DA = h4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: tA,
      nGenesToDisplay: t.nGenesToDisplay
    }), YA = w4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.qtlAnnotationPosition,
      scale: tA,
      showAllQTLs: U,
      showSelectedQTLs: S,
      showAutoQTLLabels: U,
      showSelectedQTLLabels: S,
      annotationLabelSize: B.cellLayout.annotations.label.size
    });
    B.chromosomes.forEach(function(ue) {
      ue.layout = ue.layout || {}, ue.layout.annotationDisplayClusters || cA.computeChromosomeClusters(ue), cA.layoutChromosome(ue), ue.layout.geneBandDisplayClusters || DA.computeChromosomeClusters(ue), DA.layoutChromosome(ue), ue.layout.qtlDisplayClusters || YA.computeChromosomeClusters(ue), YA.layoutChromosome(ue);
    }), cA.computeNormalisedGeneScores(B.chromosomes);
  }, JA = function(G, tA) {
    var cA = /* @__PURE__ */ new Set(), DA = [];
    tA.chromosomes.forEach(function(xe) {
      xe.annotations.snps.forEach(function(he) {
        cA.has(he.trait) || he.trait != null && DA.push({ trait: he.trait, color: he.color }), cA.add(he.trait);
      });
    }), DA.length > 0 ? G.text("SNP legend: ") : G.text("");
    var YA = G.selectAll("span").data(DA), ue = YA.enter().append("span").classed("key-item", !0);
    ue.append("span").style("background-color", function(xe) {
      return xe.color;
    }).classed("colorbox", !0).append("svg"), ue.append("span").text(function(xe) {
      return xe.trait;
    }), YA.exit().remove();
  }, jA = function(G) {
    var tA = G.append("div").attr("class", "mapview-wrapper"), cA = tA.append("svg").attr("width", t.width).attr("height", t.height).attr("class", "mapview").attr("flex", t.flex);
    l = G.append("div").append("span").attr("class", "logger").attr("id", "logbar"), f = G.append("div").attr("class", "key").attr("id", "keybar"), pi.vectorEffectSupport = "vectorEffect" in cA.node().style, aA(), cA.on("contextmenu", z), cA.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && G.select(".zoom_window").append("rect").classed("drawing_margin", !0), w = 1, c = wD().scaleExtent([0.5, 60]), c.on("start", function() {
      cA.classed("dragging", !0);
    }).on("zoom", h).on("end", function() {
      cA.classed("dragging", !1);
    }), G.select("svg").call(c);
    var DA = G.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return DA.append("div").attr("class", "arrow"), DA.append("h3").attr("class", "popover-title").text("Cluster"), DA.append("div").attr("class", "popover-content"), cA;
  }, q = function() {
    XA(n).select("svg").node() ? (i = XA(n).select("svg"), i.attr("width", t.width).attr("height", t.height)) : i = jA(XA(n)), k();
    var G = B.chromosomes.every(function(cA) {
      return cA.layout;
    });
    G || IA(), i.datum(B), s = i.select(".zoom_window"), mA(), t.contentBorder && FA();
    var tA = a4().onAnnotationSelectFunction(HA).onLabelSelectFunction(SA).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(i);
    s.call(tA);
  };
  function X(G) {
    G.each(function(tA) {
      var cA = this;
      n = cA, p = tA, B = p, v = !1, o || (o = d4().onTagBtnClick(D).onFitBtnClick(fA).onLabelBtnClick(BA).onQtlBtnClick(L).onNetworkBtnClick(lA).onResetBtnClick(iA).onSetNumberPerRowClick(Y).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(bA).onExportAllBtnClick(NA).onExpandBtnClick(R).maxSnpPValueProperty(X.maxSnpPValue).nGenesToDisplayProperty(X.nGenesToDisplay).annotationLabelSizeProperty(X.annotationLabelSize)), XA(n).call(o), o.setNetworkButtonEnabled(!1), o.setFitButtonEnabled(!1), o.setTabButtonState("auto"), q();
    });
  }
  return X.resetZoom = fA, X.width = function(G) {
    return arguments.length ? (t.width = G, X) : t.width;
  }, X.height = function(G) {
    return arguments.length ? (t.height = G, X) : t.height;
  }, X.layout = function(G) {
    return arguments.length ? (t.layout = Te.merge(t.layout, G), X) : t.layout;
  }, X.draw = async function(G, tA, cA, DA = !1) {
    var YA = tH();
    if (cA)
      YA.readData(tA, cA, DA).then(function(ue) {
        X._draw(G, ue, DA);
      });
    else {
      const ue = await YA.readData(tA, cA, DA);
      X._draw(G, ue, DA);
    }
  }, X._draw = function(G, tA) {
    var cA = XA(G).selectAll("div").data(["genemap-target"]);
    cA.enter().append("div").attr("id", function(DA) {
      return DA;
    }), n = XA(G).select("#genemap-target").node(), XA(n).datum(tA).call(X), X.nGenesToDisplay(t.initialMaxGenes), fA(), JA(f, B);
  }, X.changeQtlColor = function(G, tA, cA) {
    B.chromosomes.forEach(function(DA) {
      DA.layout.qtlNodes.forEach(function(YA) {
        YA.id === G && (YA.color = tA, YA.label = cA);
      });
    }), IA(), q();
  }, X.changeColor = function(G) {
    XA("#map").style("background-color", G), IA(), q();
  }, X.redraw = function(G) {
    n = XA(G).select("#genemap-target")[0][0], P(), XA(n).call(X), QA();
  }, X.setGeneLabels = function(G) {
    n && BA(G);
  }, X.maxSnpPValue = pi.Listener(t.maxSnpPValue).addListener(function(G) {
    var tA = Number(G);
    isNaN(tA) && X.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(G), IA(), q();
  }), X.nGenesToDisplay = pi.Listener(t.nGenesToDisplay).addListener(
    function(G) {
      var tA = t.nGenesToDisplay;
      t.nGenesToDisplay = G, G != tA && (oA(), IA(), q());
    }
  ), X.annotationLabelSize = pi.Listener(
    t.annotationLabelSize
  ).addListener(function(G) {
    t.annotationLabelSize = G, oA(), IA(), q();
  }), X.setQtlLabels = function(G) {
    if (n) {
      var tA = XA(n).datum();
      tA.chromosomes.forEach(function(cA) {
        cA.annotations.qtls.forEach(function(DA) {
          G === "auto" ? delete DA.showLabel : DA.showLabel = G;
        });
      });
    }
  }, X.onAnonationLabelSelectFunction = function() {
  }, X.loggingOn = function() {
    l.style("display", "initial");
  }, X.loggingOff = function() {
    l.style("display", "none");
  }, X.getSelectedGenes = function() {
    var G = [];
    return B.chromosomes.forEach(function(tA) {
      tA.annotations.genes.forEach(function(cA) {
        cA.selected && G.push(cA);
      });
    }), G;
  }, X.getGenome = function() {
    return B;
  }, X;
};
const Ya = pi.GeneMap().width("100%").height("100%");
function GR() {
  const A = document.getElementById("show-gene-labels"), e = A.options[A.selectedIndex].value;
  Ya.setGeneLabels(e);
  const t = document.getElementById("show-qtl-labels"), n = t.options[t.selectedIndex].value;
  Ya.setQtlLabels(n), Ya.redraw("#map");
}
function VR() {
  Ya.changeQtlColor("C6", "#000");
}
async function WR(A) {
  A && Ya.resetZoom();
  const e = await import("./arabidopsis-DWsJl-zt.js"), t = await import("./arabidopsis-BWR4fnku.js");
  Ya.draw("#map", e.default, t.default, !0);
}
export {
  VR as changeQtlColor,
  Ya as chart,
  WR as redraw,
  GR as updateLabel
};
