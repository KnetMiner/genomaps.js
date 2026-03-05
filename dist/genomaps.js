import './chart.css';function Lb(A, e) {
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
var Dh = { exports: {} }, Xm = {}, Hr = {}, Ki = {}, Ls = {}, ve = {}, ys = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.regexpCode = A.getEsmExportName = A.getProperty = A.safeStringify = A.stringify = A.strConcat = A.addCodeArg = A.str = A._ = A.nil = A._Code = A.Name = A.IDENTIFIER = A._CodeOrName = void 0;
  class e {
  }
  A._CodeOrName = e, A.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class t extends e {
    constructor(H) {
      if (super(), !A.IDENTIFIER.test(H))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = H;
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
    constructor(H) {
      super(), this._items = typeof H == "string" ? [H] : H;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const H = this._items[0];
      return H === "" || H === '""';
    }
    get str() {
      var H;
      return (H = this._str) !== null && H !== void 0 ? H : this._str = this._items.reduce((D, b) => `${D}${b}`, "");
    }
    get names() {
      var H;
      return (H = this._names) !== null && H !== void 0 ? H : this._names = this._items.reduce((D, b) => (b instanceof t && (D[b.str] = (D[b.str] || 0) + 1), D), {});
    }
  }
  A._Code = n, A.nil = new n("");
  function i(U, ...H) {
    const D = [U[0]];
    let b = 0;
    for (; b < H.length; )
      f(D, H[b]), D.push(U[++b]);
    return new n(D);
  }
  A._ = i;
  const s = new n("+");
  function l(U, ...H) {
    const D = [v(U[0])];
    let b = 0;
    for (; b < H.length; )
      D.push(s), f(D, H[b]), D.push(s, v(U[++b]));
    return c(D), new n(D);
  }
  A.str = l;
  function f(U, H) {
    H instanceof n ? U.push(...H._items) : H instanceof t ? U.push(H) : U.push(B(H));
  }
  A.addCodeArg = f;
  function c(U) {
    let H = 1;
    for (; H < U.length - 1; ) {
      if (U[H] === s) {
        const D = h(U[H - 1], U[H + 1]);
        if (D !== void 0) {
          U.splice(H - 1, 3, D);
          continue;
        }
        U[H++] = "+";
      }
      H++;
    }
  }
  function h(U, H) {
    if (H === '""')
      return U;
    if (U === '""')
      return H;
    if (typeof U == "string")
      return H instanceof t || U[U.length - 1] !== '"' ? void 0 : typeof H != "string" ? `${U.slice(0, -1)}${H}"` : H[0] === '"' ? U.slice(0, -1) + H.slice(1) : void 0;
    if (typeof H == "string" && H[0] === '"' && !(U instanceof t))
      return `"${U}${H.slice(1)}`;
  }
  function w(U, H) {
    return H.emptyStr() ? U : U.emptyStr() ? H : l`${U}${H}`;
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
})(ys);
var Oh = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ValueScope = A.ValueScopeName = A.Scope = A.varKinds = A.UsedValueState = void 0;
  const e = ys;
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
        const H = C.get(o);
        if (H)
          return H;
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
          let H = w(U);
          if (H) {
            const D = this.opts.es5 ? A.varKinds.var : A.varKinds.const;
            v = (0, e._)`${v}${D} ${U} = ${H};${this.opts._n}`;
          } else if (H = p == null ? void 0 : p(U))
            v = (0, e._)`${v}${H}${this.opts._n}`;
          else
            throw new t(U);
          F.set(U, n.Completed);
        });
      }
      return v;
    }
  }
  A.ValueScope = f;
})(Oh);
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.or = A.and = A.not = A.CodeGen = A.operators = A.varKinds = A.ValueScopeName = A.ValueScope = A.Scope = A.Name = A.regexpCode = A.stringify = A.getProperty = A.nil = A.strConcat = A.str = A._ = void 0;
  const e = ys, t = Oh;
  var n = ys;
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
  var i = Oh;
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
    optimizeNames(S, K) {
      return this;
    }
  }
  class l extends s {
    constructor(S, K, aA) {
      super(), this.varKind = S, this.name = K, this.rhs = aA;
    }
    render({ es5: S, _n: K }) {
      const aA = S ? t.varKinds.var : this.varKind, EA = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${aA} ${this.name}${EA};` + K;
    }
    optimizeNames(S, K) {
      if (S[this.name.str])
        return this.rhs && (this.rhs = q(this.rhs, S, K)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class f extends s {
    constructor(S, K, aA) {
      super(), this.lhs = S, this.rhs = K, this.sideEffects = aA;
    }
    render({ _n: S }) {
      return `${this.lhs} = ${this.rhs};` + S;
    }
    optimizeNames(S, K) {
      if (!(this.lhs instanceof e.Name && !S[this.lhs.str] && !this.sideEffects))
        return this.rhs = q(this.rhs, S, K), this;
    }
    get names() {
      const S = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return bA(S, this.rhs);
    }
  }
  class c extends f {
    constructor(S, K, aA, EA) {
      super(S, aA, EA), this.op = K;
    }
    render({ _n: S }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + S;
    }
  }
  class h extends s {
    constructor(S) {
      super(), this.label = S, this.names = {};
    }
    render({ _n: S }) {
      return `${this.label}:` + S;
    }
  }
  class w extends s {
    constructor(S) {
      super(), this.label = S, this.names = {};
    }
    render({ _n: S }) {
      return `break${this.label ? ` ${this.label}` : ""};` + S;
    }
  }
  class B extends s {
    constructor(S) {
      super(), this.error = S;
    }
    render({ _n: S }) {
      return `throw ${this.error};` + S;
    }
    get names() {
      return this.error.names;
    }
  }
  class p extends s {
    constructor(S) {
      super(), this.code = S;
    }
    render({ _n: S }) {
      return `${this.code};` + S;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(S, K) {
      return this.code = q(this.code, S, K), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class v extends s {
    constructor(S = []) {
      super(), this.nodes = S;
    }
    render(S) {
      return this.nodes.reduce((K, aA) => K + aA.render(S), "");
    }
    optimizeNodes() {
      const { nodes: S } = this;
      let K = S.length;
      for (; K--; ) {
        const aA = S[K].optimizeNodes();
        Array.isArray(aA) ? S.splice(K, 1, ...aA) : aA ? S[K] = aA : S.splice(K, 1);
      }
      return S.length > 0 ? this : void 0;
    }
    optimizeNames(S, K) {
      const { nodes: aA } = this;
      let EA = aA.length;
      for (; EA--; ) {
        const _A = aA[EA];
        _A.optimizeNames(S, K) || (CA(S, _A.names), aA.splice(EA, 1));
      }
      return aA.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((S, K) => OA(S, K.names), {});
    }
  }
  class o extends v {
    render(S) {
      return "{" + S._n + super.render(S) + "}" + S._n;
    }
  }
  class C extends v {
  }
  class F extends o {
  }
  F.kind = "else";
  class U extends o {
    constructor(S, K) {
      super(K), this.condition = S;
    }
    render(S) {
      let K = `if(${this.condition})` + super.render(S);
      return this.else && (K += "else " + this.else.render(S)), K;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const S = this.condition;
      if (S === !0)
        return this.nodes;
      let K = this.else;
      if (K) {
        const aA = K.optimizeNodes();
        K = this.else = Array.isArray(aA) ? new F(aA) : aA;
      }
      if (K)
        return S === !1 ? K instanceof U ? K : K.nodes : this.nodes.length ? this : new U(iA(S), K instanceof U ? [K] : K.nodes);
      if (!(S === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(S, K) {
      var aA;
      if (this.else = (aA = this.else) === null || aA === void 0 ? void 0 : aA.optimizeNames(S, K), !!(super.optimizeNames(S, K) || this.else))
        return this.condition = q(this.condition, S, K), this;
    }
    get names() {
      const S = super.names;
      return bA(S, this.condition), this.else && OA(S, this.else.names), S;
    }
  }
  U.kind = "if";
  class H extends o {
  }
  H.kind = "for";
  class D extends H {
    constructor(S) {
      super(), this.iteration = S;
    }
    render(S) {
      return `for(${this.iteration})` + super.render(S);
    }
    optimizeNames(S, K) {
      if (super.optimizeNames(S, K))
        return this.iteration = q(this.iteration, S, K), this;
    }
    get names() {
      return OA(super.names, this.iteration.names);
    }
  }
  class b extends H {
    constructor(S, K, aA, EA) {
      super(), this.varKind = S, this.name = K, this.from = aA, this.to = EA;
    }
    render(S) {
      const K = S.es5 ? t.varKinds.var : this.varKind, { name: aA, from: EA, to: _A } = this;
      return `for(${K} ${aA}=${EA}; ${aA}<${_A}; ${aA}++)` + super.render(S);
    }
    get names() {
      const S = bA(super.names, this.from);
      return bA(S, this.to);
    }
  }
  class M extends H {
    constructor(S, K, aA, EA) {
      super(), this.loop = S, this.varKind = K, this.name = aA, this.iterable = EA;
    }
    render(S) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(S);
    }
    optimizeNames(S, K) {
      if (super.optimizeNames(S, K))
        return this.iterable = q(this.iterable, S, K), this;
    }
    get names() {
      return OA(super.names, this.iterable.names);
    }
  }
  class R extends o {
    constructor(S, K, aA) {
      super(), this.name = S, this.args = K, this.async = aA;
    }
    render(S) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(S);
    }
  }
  R.kind = "func";
  class J extends v {
    render(S) {
      return "return " + super.render(S);
    }
  }
  J.kind = "return";
  class hA extends o {
    render(S) {
      let K = "try" + super.render(S);
      return this.catch && (K += this.catch.render(S)), this.finally && (K += this.finally.render(S)), K;
    }
    optimizeNodes() {
      var S, K;
      return super.optimizeNodes(), (S = this.catch) === null || S === void 0 || S.optimizeNodes(), (K = this.finally) === null || K === void 0 || K.optimizeNodes(), this;
    }
    optimizeNames(S, K) {
      var aA, EA;
      return super.optimizeNames(S, K), (aA = this.catch) === null || aA === void 0 || aA.optimizeNames(S, K), (EA = this.finally) === null || EA === void 0 || EA.optimizeNames(S, K), this;
    }
    get names() {
      const S = super.names;
      return this.catch && OA(S, this.catch.names), this.finally && OA(S, this.finally.names), S;
    }
  }
  class cA extends o {
    constructor(S) {
      super(), this.error = S;
    }
    render(S) {
      return `catch(${this.error})` + super.render(S);
    }
  }
  cA.kind = "catch";
  class wA extends o {
    render(S) {
      return "finally" + super.render(S);
    }
  }
  wA.kind = "finally";
  class QA {
    constructor(S, K = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...K, _n: K.lines ? `
` : "" }, this._extScope = S, this._scope = new t.Scope({ parent: S }), this._nodes = [new C()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(S) {
      return this._scope.name(S);
    }
    // reserves unique name in the external scope
    scopeName(S) {
      return this._extScope.name(S);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(S, K) {
      const aA = this._extScope.value(S, K);
      return (this._values[aA.prefix] || (this._values[aA.prefix] = /* @__PURE__ */ new Set())).add(aA), aA;
    }
    getScopeValue(S, K) {
      return this._extScope.getValue(S, K);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(S) {
      return this._extScope.scopeRefs(S, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(S, K, aA, EA) {
      const _A = this._scope.toName(K);
      return aA !== void 0 && EA && (this._constants[_A.str] = aA), this._leafNode(new l(S, _A, aA)), _A;
    }
    // `const` declaration (`var` in es5 mode)
    const(S, K, aA) {
      return this._def(t.varKinds.const, S, K, aA);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(S, K, aA) {
      return this._def(t.varKinds.let, S, K, aA);
    }
    // `var` declaration with optional assignment
    var(S, K, aA) {
      return this._def(t.varKinds.var, S, K, aA);
    }
    // assignment code
    assign(S, K, aA) {
      return this._leafNode(new f(S, K, aA));
    }
    // `+=` code
    add(S, K) {
      return this._leafNode(new c(S, A.operators.ADD, K));
    }
    // appends passed SafeExpr to code or executes Block
    code(S) {
      return typeof S == "function" ? S() : S !== e.nil && this._leafNode(new p(S)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...S) {
      const K = ["{"];
      for (const [aA, EA] of S)
        K.length > 1 && K.push(","), K.push(aA), (aA !== EA || this.opts.es5) && (K.push(":"), (0, e.addCodeArg)(K, EA));
      return K.push("}"), new e._Code(K);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(S, K, aA) {
      if (this._blockNode(new U(S)), K && aA)
        this.code(K).else().code(aA).endIf();
      else if (K)
        this.code(K).endIf();
      else if (aA)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(S) {
      return this._elseNode(new U(S));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new F());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(U, F);
    }
    _for(S, K) {
      return this._blockNode(S), K && this.code(K).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(S, K) {
      return this._for(new D(S), K);
    }
    // `for` statement for a range of values
    forRange(S, K, aA, EA, _A = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const qA = this._scope.toName(S);
      return this._for(new b(_A, qA, K, aA), () => EA(qA));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(S, K, aA, EA = t.varKinds.const) {
      const _A = this._scope.toName(S);
      if (this.opts.es5) {
        const qA = K instanceof e.Name ? K : this.var("_arr", K);
        return this.forRange("_i", 0, (0, e._)`${qA}.length`, (ZA) => {
          this.var(_A, (0, e._)`${qA}[${ZA}]`), aA(_A);
        });
      }
      return this._for(new M("of", EA, _A, K), () => aA(_A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(S, K, aA, EA = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(S, (0, e._)`Object.keys(${K})`, aA);
      const _A = this._scope.toName(S);
      return this._for(new M("in", EA, _A, K), () => aA(_A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(H);
    }
    // `label` statement
    label(S) {
      return this._leafNode(new h(S));
    }
    // `break` statement
    break(S) {
      return this._leafNode(new w(S));
    }
    // `return` statement
    return(S) {
      const K = new J();
      if (this._blockNode(K), this.code(S), K.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(S, K, aA) {
      if (!K && !aA)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const EA = new hA();
      if (this._blockNode(EA), this.code(S), K) {
        const _A = this.name("e");
        this._currNode = EA.catch = new cA(_A), K(_A);
      }
      return aA && (this._currNode = EA.finally = new wA(), this.code(aA)), this._endBlockNode(cA, wA);
    }
    // `throw` statement
    throw(S) {
      return this._leafNode(new B(S));
    }
    // start self-balancing block
    block(S, K) {
      return this._blockStarts.push(this._nodes.length), S && this.code(S).endBlock(K), this;
    }
    // end the current self-balancing block
    endBlock(S) {
      const K = this._blockStarts.pop();
      if (K === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const aA = this._nodes.length - K;
      if (aA < 0 || S !== void 0 && aA !== S)
        throw new Error(`CodeGen: wrong number of nodes: ${aA} vs ${S} expected`);
      return this._nodes.length = K, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(S, K = e.nil, aA, EA) {
      return this._blockNode(new R(S, K, aA)), EA && this.code(EA).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(R);
    }
    optimize(S = 1) {
      for (; S-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(S) {
      return this._currNode.nodes.push(S), this;
    }
    _blockNode(S) {
      this._currNode.nodes.push(S), this._nodes.push(S);
    }
    _endBlockNode(S, K) {
      const aA = this._currNode;
      if (aA instanceof S || K && aA instanceof K)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${K ? `${S.kind}/${K.kind}` : S.kind}"`);
    }
    _elseNode(S) {
      const K = this._currNode;
      if (!(K instanceof U))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = K.else = S, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const S = this._nodes;
      return S[S.length - 1];
    }
    set _currNode(S) {
      const K = this._nodes;
      K[K.length - 1] = S;
    }
  }
  A.CodeGen = QA;
  function OA(j, S) {
    for (const K in S)
      j[K] = (j[K] || 0) + (S[K] || 0);
    return j;
  }
  function bA(j, S) {
    return S instanceof e._CodeOrName ? OA(j, S.names) : j;
  }
  function q(j, S, K) {
    if (j instanceof e.Name)
      return aA(j);
    if (!EA(j))
      return j;
    return new e._Code(j._items.reduce((_A, qA) => (qA instanceof e.Name && (qA = aA(qA)), qA instanceof e._Code ? _A.push(...qA._items) : _A.push(qA), _A), []));
    function aA(_A) {
      const qA = K[_A.str];
      return qA === void 0 || S[_A.str] !== 1 ? _A : (delete S[_A.str], qA);
    }
    function EA(_A) {
      return _A instanceof e._Code && _A._items.some((qA) => qA instanceof e.Name && S[qA.str] === 1 && K[qA.str] !== void 0);
    }
  }
  function CA(j, S) {
    for (const K in S)
      j[K] = (j[K] || 0) - (S[K] || 0);
  }
  function iA(j) {
    return typeof j == "boolean" || typeof j == "number" || j === null ? !j : (0, e._)`!${rA(j)}`;
  }
  A.not = iA;
  const gA = T(A.operators.AND);
  function IA(...j) {
    return j.reduce(gA);
  }
  A.and = IA;
  const HA = T(A.operators.OR);
  function uA(...j) {
    return j.reduce(HA);
  }
  A.or = uA;
  function T(j) {
    return (S, K) => S === e.nil ? K : K === e.nil ? S : (0, e._)`${rA(S)} ${j} ${rA(K)}`;
  }
  function rA(j) {
    return j instanceof e.Name ? j : (0, e._)`(${j})`;
  }
})(ve);
var KA = {};
Object.defineProperty(KA, "__esModule", { value: !0 });
KA.checkStrictMode = KA.getErrorPath = KA.Type = KA.useFunc = KA.setEvaluated = KA.evaluatedPropsToName = KA.mergeEvaluated = KA.eachItem = KA.unescapeJsonPointer = KA.escapeJsonPointer = KA.escapeFragment = KA.unescapeFragment = KA.schemaRefOrVal = KA.schemaHasRulesButRef = KA.schemaHasRules = KA.checkUnknownRules = KA.alwaysValidSchema = KA.toHash = void 0;
const $e = ve, Tb = ys;
function Db(A) {
  const e = {};
  for (const t of A)
    e[t] = !0;
  return e;
}
KA.toHash = Db;
function Ob(A, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (qm(A, e), !zm(e, A.self.RULES.all));
}
KA.alwaysValidSchema = Ob;
function qm(A, e = A.schema) {
  const { opts: t, self: n } = A;
  if (!t.strictSchema || typeof e == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in e)
    i[s] || Ym(A, `unknown keyword: "${s}"`);
}
KA.checkUnknownRules = qm;
function zm(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e[t])
      return !0;
  return !1;
}
KA.schemaHasRules = zm;
function Nb(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (t !== "$ref" && e.all[t])
      return !0;
  return !1;
}
KA.schemaHasRulesButRef = Nb;
function Mb({ topSchemaRef: A, schemaPath: e }, t, n, i) {
  if (!i) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, $e._)`${t}`;
  }
  return (0, $e._)`${A}${e}${(0, $e.getProperty)(n)}`;
}
KA.schemaRefOrVal = Mb;
function Pb(A) {
  return Jm(decodeURIComponent(A));
}
KA.unescapeFragment = Pb;
function Rb(A) {
  return encodeURIComponent(Hd(A));
}
KA.escapeFragment = Rb;
function Hd(A) {
  return typeof A == "number" ? `${A}` : A.replace(/~/g, "~0").replace(/\//g, "~1");
}
KA.escapeJsonPointer = Hd;
function Jm(A) {
  return A.replace(/~1/g, "/").replace(/~0/g, "~");
}
KA.unescapeJsonPointer = Jm;
function Kb(A, e) {
  if (Array.isArray(A))
    for (const t of A)
      e(t);
  else
    e(A);
}
KA.eachItem = Kb;
function HB({ mergeNames: A, mergeToName: e, mergeValues: t, resultToName: n }) {
  return (i, s, l, f) => {
    const c = l === void 0 ? s : l instanceof $e.Name ? (s instanceof $e.Name ? A(i, s, l) : e(i, s, l), l) : s instanceof $e.Name ? (e(i, l, s), s) : t(s, l);
    return f === $e.Name && !(c instanceof $e.Name) ? n(i, c) : c;
  };
}
KA.mergeEvaluated = {
  props: HB({
    mergeNames: (A, e, t) => A.if((0, $e._)`${t} !== true && ${e} !== undefined`, () => {
      A.if((0, $e._)`${e} === true`, () => A.assign(t, !0), () => A.assign(t, (0, $e._)`${t} || {}`).code((0, $e._)`Object.assign(${t}, ${e})`));
    }),
    mergeToName: (A, e, t) => A.if((0, $e._)`${t} !== true`, () => {
      e === !0 ? A.assign(t, !0) : (A.assign(t, (0, $e._)`${t} || {}`), Sd(A, t, e));
    }),
    mergeValues: (A, e) => A === !0 ? !0 : { ...A, ...e },
    resultToName: jm
  }),
  items: HB({
    mergeNames: (A, e, t) => A.if((0, $e._)`${t} !== true && ${e} !== undefined`, () => A.assign(t, (0, $e._)`${e} === true ? true : ${t} > ${e} ? ${t} : ${e}`)),
    mergeToName: (A, e, t) => A.if((0, $e._)`${t} !== true`, () => A.assign(t, e === !0 ? !0 : (0, $e._)`${t} > ${e} ? ${t} : ${e}`)),
    mergeValues: (A, e) => A === !0 ? !0 : Math.max(A, e),
    resultToName: (A, e) => A.var("items", e)
  })
};
function jm(A, e) {
  if (e === !0)
    return A.var("props", !0);
  const t = A.var("props", (0, $e._)`{}`);
  return e !== void 0 && Sd(A, t, e), t;
}
KA.evaluatedPropsToName = jm;
function Sd(A, e, t) {
  Object.keys(t).forEach((n) => A.assign((0, $e._)`${e}${(0, $e.getProperty)(n)}`, !0));
}
KA.setEvaluated = Sd;
const SB = {};
function kb(A, e) {
  return A.scopeValue("func", {
    ref: e,
    code: SB[e.code] || (SB[e.code] = new Tb._Code(e.code))
  });
}
KA.useFunc = kb;
var Nh;
(function(A) {
  A[A.Num = 0] = "Num", A[A.Str = 1] = "Str";
})(Nh || (KA.Type = Nh = {}));
function $b(A, e, t) {
  if (A instanceof $e.Name) {
    const n = e === Nh.Num;
    return t ? n ? (0, $e._)`"[" + ${A} + "]"` : (0, $e._)`"['" + ${A} + "']"` : n ? (0, $e._)`"/" + ${A}` : (0, $e._)`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, $e.getProperty)(A).toString() : "/" + Hd(A);
}
KA.getErrorPath = $b;
function Ym(A, e, t = A.opts.strictSchema) {
  if (t) {
    if (e = `strict mode: ${e}`, t === !0)
      throw new Error(e);
    A.self.logger.warn(e);
  }
}
KA.checkStrictMode = Ym;
var lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
const Lt = ve, Gb = {
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
lr.default = Gb;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.extendErrors = A.resetErrorsCount = A.reportExtraError = A.reportError = A.keyword$DataError = A.keywordError = void 0;
  const e = ve, t = KA, n = lr;
  A.keywordError = {
    message: ({ keyword: F }) => (0, e.str)`must pass "${F}" keyword validation`
  }, A.keyword$DataError = {
    message: ({ keyword: F, schemaType: U }) => U ? (0, e.str)`"${F}" keyword must be ${U} ($data)` : (0, e.str)`"${F}" keyword is invalid ($data)`
  };
  function i(F, U = A.keywordError, H, D) {
    const { it: b } = F, { gen: M, compositeRule: R, allErrors: J } = b, hA = B(F, U, H);
    D ?? (R || J) ? c(M, hA) : h(b, (0, e._)`[${hA}]`);
  }
  A.reportError = i;
  function s(F, U = A.keywordError, H) {
    const { it: D } = F, { gen: b, compositeRule: M, allErrors: R } = D, J = B(F, U, H);
    c(b, J), M || R || h(D, n.default.vErrors);
  }
  A.reportExtraError = s;
  function l(F, U) {
    F.assign(n.default.errors, U), F.if((0, e._)`${n.default.vErrors} !== null`, () => F.if(U, () => F.assign((0, e._)`${n.default.vErrors}.length`, U), () => F.assign(n.default.vErrors, null)));
  }
  A.resetErrorsCount = l;
  function f({ gen: F, keyword: U, schemaValue: H, data: D, errsCount: b, it: M }) {
    if (b === void 0)
      throw new Error("ajv implementation error");
    const R = F.name("err");
    F.forRange("i", b, n.default.errors, (J) => {
      F.const(R, (0, e._)`${n.default.vErrors}[${J}]`), F.if((0, e._)`${R}.instancePath === undefined`, () => F.assign((0, e._)`${R}.instancePath`, (0, e.strConcat)(n.default.instancePath, M.errorPath))), F.assign((0, e._)`${R}.schemaPath`, (0, e.str)`${M.errSchemaPath}/${U}`), M.opts.verbose && (F.assign((0, e._)`${R}.schema`, H), F.assign((0, e._)`${R}.data`, D));
    });
  }
  A.extendErrors = f;
  function c(F, U) {
    const H = F.const("err", U);
    F.if((0, e._)`${n.default.vErrors} === null`, () => F.assign(n.default.vErrors, (0, e._)`[${H}]`), (0, e._)`${n.default.vErrors}.push(${H})`), F.code((0, e._)`${n.default.errors}++`);
  }
  function h(F, U) {
    const { gen: H, validateName: D, schemaEnv: b } = F;
    b.$async ? H.throw((0, e._)`new ${F.ValidationError}(${U})`) : (H.assign((0, e._)`${D}.errors`, U), H.return(!1));
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
  function B(F, U, H) {
    const { createErrors: D } = F.it;
    return D === !1 ? (0, e._)`{}` : p(F, U, H);
  }
  function p(F, U, H = {}) {
    const { gen: D, it: b } = F, M = [
      v(b, H),
      o(F, H)
    ];
    return C(F, U, M), D.object(...M);
  }
  function v({ errorPath: F }, { instancePath: U }) {
    const H = U ? (0, e.str)`${F}${(0, t.getErrorPath)(U, t.Type.Str)}` : F;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, H)];
  }
  function o({ keyword: F, it: { errSchemaPath: U } }, { schemaPath: H, parentSchema: D }) {
    let b = D ? U : (0, e.str)`${U}/${F}`;
    return H && (b = (0, e.str)`${b}${(0, t.getErrorPath)(H, t.Type.Str)}`), [w.schemaPath, b];
  }
  function C(F, { params: U, message: H }, D) {
    const { keyword: b, data: M, schemaValue: R, it: J } = F, { opts: hA, propertyName: cA, topSchemaRef: wA, schemaPath: QA } = J;
    D.push([w.keyword, b], [w.params, typeof U == "function" ? U(F) : U || (0, e._)`{}`]), hA.messages && D.push([w.message, typeof H == "function" ? H(F) : H]), hA.verbose && D.push([w.schema, R], [w.parentSchema, (0, e._)`${wA}${QA}`], [n.default.data, M]), cA && D.push([w.propertyName, cA]);
  }
})(Ls);
var LB;
function Vb() {
  if (LB) return Ki;
  LB = 1, Object.defineProperty(Ki, "__esModule", { value: !0 }), Ki.boolOrEmptySchema = Ki.topBoolOrEmptySchema = void 0;
  const A = Ls, e = ve, t = lr, n = {
    message: "boolean schema is false"
  };
  function i(f) {
    const { gen: c, schema: h, validateName: w } = f;
    h === !1 ? l(f, !1) : typeof h == "object" && h.$async === !0 ? c.return(t.default.data) : (c.assign((0, e._)`${w}.errors`, null), c.return(!0));
  }
  Ki.topBoolOrEmptySchema = i;
  function s(f, c) {
    const { gen: h, schema: w } = f;
    w === !1 ? (h.var(c, !1), l(f)) : h.var(c, !0);
  }
  Ki.boolOrEmptySchema = s;
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
  return Ki;
}
var ct = {}, na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.getRules = na.isJSONType = void 0;
const Wb = ["string", "number", "integer", "boolean", "null", "object", "array"], Xb = new Set(Wb);
function qb(A) {
  return typeof A == "string" && Xb.has(A);
}
na.isJSONType = qb;
function zb() {
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
na.getRules = zb;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.shouldUseRule = Mr.shouldUseGroup = Mr.schemaHasRulesForType = void 0;
function Jb({ schema: A, self: e }, t) {
  const n = e.RULES.types[t];
  return n && n !== !0 && Zm(A, n);
}
Mr.schemaHasRulesForType = Jb;
function Zm(A, e) {
  return e.rules.some((t) => Av(A, t));
}
Mr.shouldUseGroup = Zm;
function Av(A, e) {
  var t;
  return A[e.keyword] !== void 0 || ((t = e.definition.implements) === null || t === void 0 ? void 0 : t.some((n) => A[n] !== void 0));
}
Mr.shouldUseRule = Av;
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.reportTypeError = ct.checkDataTypes = ct.checkDataType = ct.coerceAndCheckDataType = ct.getJSONTypes = ct.getSchemaTypes = ct.DataType = void 0;
const jb = na, Yb = Mr, Zb = Ls, pe = ve, ev = KA;
var Xa;
(function(A) {
  A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong";
})(Xa || (ct.DataType = Xa = {}));
function A1(A) {
  const e = tv(A.type);
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
function tv(A) {
  const e = Array.isArray(A) ? A : A ? [A] : [];
  if (e.every(jb.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
ct.getJSONTypes = tv;
function e1(A, e) {
  const { gen: t, data: n, opts: i } = A, s = t1(e, i.coerceTypes), l = e.length > 0 && !(s.length === 0 && e.length === 1 && (0, Yb.schemaHasRulesForType)(A, e[0]));
  if (l) {
    const f = Ld(e, n, i.strictNumbers, Xa.Wrong);
    t.if(f, () => {
      s.length ? n1(A, e, s) : Td(A);
    });
  }
  return l;
}
ct.coerceAndCheckDataType = e1;
const nv = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function t1(A, e) {
  return e ? A.filter((t) => nv.has(t) || e === "array" && t === "array") : [];
}
function n1(A, e, t) {
  const { gen: n, data: i, opts: s } = A, l = n.let("dataType", (0, pe._)`typeof ${i}`), f = n.let("coerced", (0, pe._)`undefined`);
  s.coerceTypes === "array" && n.if((0, pe._)`${l} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, pe._)`${i}[0]`).assign(l, (0, pe._)`typeof ${i}`).if(Ld(e, i, s.strictNumbers), () => n.assign(f, i))), n.if((0, pe._)`${f} !== undefined`);
  for (const h of t)
    (nv.has(h) || h === "array" && s.coerceTypes === "array") && c(h);
  n.else(), Td(A), n.endIf(), n.if((0, pe._)`${f} !== undefined`, () => {
    n.assign(i, f), r1(A, f);
  });
  function c(h) {
    switch (h) {
      case "string":
        n.elseIf((0, pe._)`${l} == "number" || ${l} == "boolean"`).assign(f, (0, pe._)`"" + ${i}`).elseIf((0, pe._)`${i} === null`).assign(f, (0, pe._)`""`);
        return;
      case "number":
        n.elseIf((0, pe._)`${l} == "boolean" || ${i} === null
              || (${l} == "string" && ${i} && ${i} == +${i})`).assign(f, (0, pe._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, pe._)`${l} === "boolean" || ${i} === null
              || (${l} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(f, (0, pe._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, pe._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(f, !1).elseIf((0, pe._)`${i} === "true" || ${i} === 1`).assign(f, !0);
        return;
      case "null":
        n.elseIf((0, pe._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(f, null);
        return;
      case "array":
        n.elseIf((0, pe._)`${l} === "string" || ${l} === "number"
              || ${l} === "boolean" || ${i} === null`).assign(f, (0, pe._)`[${i}]`);
    }
  }
}
function r1({ gen: A, parentData: e, parentDataProperty: t }, n) {
  A.if((0, pe._)`${e} !== undefined`, () => A.assign((0, pe._)`${e}[${t}]`, n));
}
function Mh(A, e, t, n = Xa.Correct) {
  const i = n === Xa.Correct ? pe.operators.EQ : pe.operators.NEQ;
  let s;
  switch (A) {
    case "null":
      return (0, pe._)`${e} ${i} null`;
    case "array":
      s = (0, pe._)`Array.isArray(${e})`;
      break;
    case "object":
      s = (0, pe._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      s = l((0, pe._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      s = l();
      break;
    default:
      return (0, pe._)`typeof ${e} ${i} ${A}`;
  }
  return n === Xa.Correct ? s : (0, pe.not)(s);
  function l(f = pe.nil) {
    return (0, pe.and)((0, pe._)`typeof ${e} == "number"`, f, t ? (0, pe._)`isFinite(${e})` : pe.nil);
  }
}
ct.checkDataType = Mh;
function Ld(A, e, t, n) {
  if (A.length === 1)
    return Mh(A[0], e, t, n);
  let i;
  const s = (0, ev.toHash)(A);
  if (s.array && s.object) {
    const l = (0, pe._)`typeof ${e} != "object"`;
    i = s.null ? l : (0, pe._)`!${e} || ${l}`, delete s.null, delete s.array, delete s.object;
  } else
    i = pe.nil;
  s.number && delete s.integer;
  for (const l in s)
    i = (0, pe.and)(i, Mh(l, e, t, n));
  return i;
}
ct.checkDataTypes = Ld;
const i1 = {
  message: ({ schema: A }) => `must be ${A}`,
  params: ({ schema: A, schemaValue: e }) => typeof A == "string" ? (0, pe._)`{type: ${A}}` : (0, pe._)`{type: ${e}}`
};
function Td(A) {
  const e = a1(A);
  (0, Zb.reportError)(e, i1);
}
ct.reportTypeError = Td;
function a1(A) {
  const { gen: e, data: t, schema: n } = A, i = (0, ev.schemaRefOrVal)(A, n, "type");
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
var $o = {}, TB;
function o1() {
  if (TB) return $o;
  TB = 1, Object.defineProperty($o, "__esModule", { value: !0 }), $o.assignDefaults = void 0;
  const A = ve, e = KA;
  function t(i, s) {
    const { properties: l, items: f } = i.schema;
    if (s === "object" && l)
      for (const c in l)
        n(i, c, l[c].default);
    else s === "array" && Array.isArray(f) && f.forEach((c, h) => n(i, h, c.default));
  }
  $o.assignDefaults = t;
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
  return $o;
}
var Mn = {}, me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.validateUnion = me.validateArray = me.usePattern = me.callValidateCode = me.schemaProperties = me.allSchemaProperties = me.noPropertyInData = me.propertyInData = me.isOwnProperty = me.hasPropFunc = me.reportMissingProp = me.checkMissingProp = me.checkReportMissingProp = void 0;
const qe = ve, Dd = KA, ui = lr, s1 = KA;
function u1(A, e) {
  const { gen: t, data: n, it: i } = A;
  t.if(Nd(t, n, e, i.opts.ownProperties), () => {
    A.setParams({ missingProperty: (0, qe._)`${e}` }, !0), A.error();
  });
}
me.checkReportMissingProp = u1;
function l1({ gen: A, data: e, it: { opts: t } }, n, i) {
  return (0, qe.or)(...n.map((s) => (0, qe.and)(Nd(A, e, s, t.ownProperties), (0, qe._)`${i} = ${s}`)));
}
me.checkMissingProp = l1;
function c1(A, e) {
  A.setParams({ missingProperty: e }, !0), A.error();
}
me.reportMissingProp = c1;
function rv(A) {
  return A.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, qe._)`Object.prototype.hasOwnProperty`
  });
}
me.hasPropFunc = rv;
function Od(A, e, t) {
  return (0, qe._)`${rv(A)}.call(${e}, ${t})`;
}
me.isOwnProperty = Od;
function f1(A, e, t, n) {
  const i = (0, qe._)`${e}${(0, qe.getProperty)(t)} !== undefined`;
  return n ? (0, qe._)`${i} && ${Od(A, e, t)}` : i;
}
me.propertyInData = f1;
function Nd(A, e, t, n) {
  const i = (0, qe._)`${e}${(0, qe.getProperty)(t)} === undefined`;
  return n ? (0, qe.or)(i, (0, qe.not)(Od(A, e, t))) : i;
}
me.noPropertyInData = Nd;
function iv(A) {
  return A ? Object.keys(A).filter((e) => e !== "__proto__") : [];
}
me.allSchemaProperties = iv;
function h1(A, e) {
  return iv(e).filter((t) => !(0, Dd.alwaysValidSchema)(A, e[t]));
}
me.schemaProperties = h1;
function d1({ schemaCode: A, data: e, it: { gen: t, topSchemaRef: n, schemaPath: i, errorPath: s }, it: l }, f, c, h) {
  const w = h ? (0, qe._)`${A}, ${e}, ${n}${i}` : e, B = [
    [ui.default.instancePath, (0, qe.strConcat)(ui.default.instancePath, s)],
    [ui.default.parentData, l.parentData],
    [ui.default.parentDataProperty, l.parentDataProperty],
    [ui.default.rootData, ui.default.rootData]
  ];
  l.opts.dynamicRef && B.push([ui.default.dynamicAnchors, ui.default.dynamicAnchors]);
  const p = (0, qe._)`${w}, ${t.object(...B)}`;
  return c !== qe.nil ? (0, qe._)`${f}.call(${c}, ${p})` : (0, qe._)`${f}(${p})`;
}
me.callValidateCode = d1;
const p1 = (0, qe._)`new RegExp`;
function g1({ gen: A, it: { opts: e } }, t) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: i } = e.code, s = i(t, n);
  return A.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, qe._)`${i.code === "new RegExp" ? p1 : (0, s1.useFunc)(A, i)}(${t}, ${n})`
  });
}
me.usePattern = g1;
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
        dataPropType: Dd.Type.Num
      }, s), e.if((0, qe.not)(s), f);
    });
  }
}
me.validateArray = B1;
function w1(A) {
  const { gen: e, schema: t, keyword: n, it: i } = A;
  if (!Array.isArray(t))
    throw new Error("ajv implementation error");
  if (t.some((c) => (0, Dd.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
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
me.validateUnion = w1;
var DB;
function m1() {
  if (DB) return Mn;
  DB = 1, Object.defineProperty(Mn, "__esModule", { value: !0 }), Mn.validateKeywordUsage = Mn.validSchemaType = Mn.funcKeywordCode = Mn.macroKeywordCode = void 0;
  const A = ve, e = lr, t = me, n = Ls;
  function i(p, v) {
    const { gen: o, keyword: C, schema: F, parentSchema: U, it: H } = p, D = v.macro.call(H.self, F, U, H), b = h(o, C, D);
    H.opts.validateSchema !== !1 && H.self.validateSchema(D, !0);
    const M = o.name("valid");
    p.subschema({
      schema: D,
      schemaPath: A.nil,
      errSchemaPath: `${H.errSchemaPath}/${C}`,
      topSchemaRef: b,
      compositeRule: !0
    }, M), p.pass(M, () => p.error(!0));
  }
  Mn.macroKeywordCode = i;
  function s(p, v) {
    var o;
    const { gen: C, keyword: F, schema: U, parentSchema: H, $data: D, it: b } = p;
    c(b, v);
    const M = !D && v.compile ? v.compile.call(b.self, U, H, b) : v.validate, R = h(C, F, M), J = C.let("valid");
    p.block$data(J, hA), p.ok((o = v.valid) !== null && o !== void 0 ? o : J);
    function hA() {
      if (v.errors === !1)
        QA(), v.modifying && l(p), OA(() => p.error());
      else {
        const bA = v.async ? cA() : wA();
        v.modifying && l(p), OA(() => f(p, bA));
      }
    }
    function cA() {
      const bA = C.let("ruleErrs", null);
      return C.try(() => QA((0, A._)`await `), (q) => C.assign(J, !1).if((0, A._)`${q} instanceof ${b.ValidationError}`, () => C.assign(bA, (0, A._)`${q}.errors`), () => C.throw(q))), bA;
    }
    function wA() {
      const bA = (0, A._)`${R}.errors`;
      return C.assign(bA, null), QA(A.nil), bA;
    }
    function QA(bA = v.async ? (0, A._)`await ` : A.nil) {
      const q = b.opts.passContext ? e.default.this : e.default.self, CA = !("compile" in v && !D || v.schema === !1);
      C.assign(J, (0, A._)`${bA}${(0, t.callValidateCode)(p, R, q, CA)}`, v.modifying);
    }
    function OA(bA) {
      var q;
      C.if((0, A.not)((q = v.valid) !== null && q !== void 0 ? q : J), bA);
    }
  }
  Mn.funcKeywordCode = s;
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
  Mn.validSchemaType = w;
  function B({ schema: p, opts: v, self: o, errSchemaPath: C }, F, U) {
    if (Array.isArray(F.keyword) ? !F.keyword.includes(U) : F.keyword !== U)
      throw new Error("ajv implementation error");
    const H = F.dependencies;
    if (H != null && H.some((D) => !Object.prototype.hasOwnProperty.call(p, D)))
      throw new Error(`parent schema must have dependencies of ${U}: ${H.join(",")}`);
    if (F.validateSchema && !F.validateSchema(p[U])) {
      const b = `keyword "${U}" value is invalid at path "${C}": ` + o.errorsText(F.validateSchema.errors);
      if (v.validateSchema === "log")
        o.logger.error(b);
      else
        throw new Error(b);
    }
  }
  return Mn.validateKeywordUsage = B, Mn;
}
var Sr = {}, OB;
function v1() {
  if (OB) return Sr;
  OB = 1, Object.defineProperty(Sr, "__esModule", { value: !0 }), Sr.extendSubschemaMode = Sr.extendSubschemaData = Sr.getSubschema = void 0;
  const A = ve, e = KA;
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
  Sr.getSubschema = t;
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
  Sr.extendSubschemaData = n;
  function i(s, { jtdDiscriminator: l, jtdMetadata: f, compositeRule: c, createErrors: h, allErrors: w }) {
    c !== void 0 && (s.compositeRule = c), h !== void 0 && (s.createErrors = h), w !== void 0 && (s.allErrors = w), s.jtdDiscriminator = l, s.jtdMetadata = f;
  }
  return Sr.extendSubschemaMode = i, Sr;
}
var Qt = {}, av = function A(e, t) {
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
}, ov = { exports: {} }, pi = ov.exports = function(A, e, t) {
  typeof e == "function" && (t = e, e = {}), t = e.cb || t;
  var n = typeof t == "function" ? t : t.pre || function() {
  }, i = t.post || function() {
  };
  Sl(e, n, i, A, "", A);
};
pi.keywords = {
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
pi.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
pi.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
pi.skipKeywords = {
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
        if (w in pi.arrayKeywords)
          for (var p = 0; p < B.length; p++)
            Sl(A, e, t, B[p], i + "/" + w + "/" + p, s, i, w, n, p);
      } else if (w in pi.propsKeywords) {
        if (B && typeof B == "object")
          for (var v in B)
            Sl(A, e, t, B[v], i + "/" + w + "/" + y1(v), s, i, w, n, v);
      } else (w in pi.keywords || A.allKeys && !(w in pi.skipKeywords)) && Sl(A, e, t, B, i + "/" + w, s, i, w, n);
    }
    t(n, i, s, l, f, c, h);
  }
}
function y1(A) {
  return A.replace(/~/g, "~0").replace(/\//g, "~1");
}
var C1 = ov.exports;
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.getSchemaRefs = Qt.resolveUrl = Qt.normalizeId = Qt._getFullPath = Qt.getFullPath = Qt.inlineRef = void 0;
const Q1 = KA, F1 = av, U1 = C1, E1 = /* @__PURE__ */ new Set([
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
  return typeof A == "boolean" ? !0 : e === !0 ? !Ph(A) : e ? sv(A) <= e : !1;
}
Qt.inlineRef = b1;
const _1 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Ph(A) {
  for (const e in A) {
    if (_1.has(e))
      return !0;
    const t = A[e];
    if (Array.isArray(t) && t.some(Ph) || typeof t == "object" && Ph(t))
      return !0;
  }
  return !1;
}
function sv(A) {
  let e = 0;
  for (const t in A) {
    if (t === "$ref")
      return 1 / 0;
    if (e++, !E1.has(t) && (typeof A[t] == "object" && (0, Q1.eachItem)(A[t], (n) => e += sv(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function uv(A, e = "", t) {
  t !== !1 && (e = qa(e));
  const n = A.parse(e);
  return lv(A, n);
}
Qt.getFullPath = uv;
function lv(A, e) {
  return A.serialize(e).split("#")[0] + "#";
}
Qt._getFullPath = lv;
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
  const { schemaId: t, uriResolver: n } = this.opts, i = qa(A[t] || e), s = { "": i }, l = uv(n, i, !1), f = {}, c = /* @__PURE__ */ new Set();
  return U1(A, { allKeys: !0 }, (B, p, v, o) => {
    if (o === void 0)
      return;
    const C = l + p;
    let F = s[o];
    typeof B[t] == "string" && (F = U.call(this, B[t])), H.call(this, B.$anchor), H.call(this, B.$dynamicAnchor), s[p] = F;
    function U(D) {
      const b = this.opts.uriResolver.resolve;
      if (D = qa(F ? b(F, D) : D), c.has(D))
        throw w(D);
      c.add(D);
      let M = this.refs[D];
      return typeof M == "string" && (M = this.refs[M]), typeof M == "object" ? h(B, M.schema, D) : D !== qa(C) && (D[0] === "#" ? (h(B, f[D], D), f[D] = B) : this.refs[D] = C), D;
    }
    function H(D) {
      if (typeof D == "string") {
        if (!H1.test(D))
          throw new Error(`invalid anchor "${D}"`);
        U.call(this, `#${D}`);
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
var NB;
function yc() {
  if (NB) return Hr;
  NB = 1, Object.defineProperty(Hr, "__esModule", { value: !0 }), Hr.getData = Hr.KeywordCxt = Hr.validateFunctionCode = void 0;
  const A = Vb(), e = ct, t = Mr, n = ct, i = o1(), s = m1(), l = v1(), f = ve, c = lr, h = Qt, w = KA, B = Ls;
  function p(X) {
    if (M(X) && (J(X), b(X))) {
      F(X);
      return;
    }
    v(X, () => (0, A.topBoolOrEmptySchema)(X));
  }
  Hr.validateFunctionCode = p;
  function v({ gen: X, validateName: V, schema: k, schemaEnv: eA, opts: lA }, SA) {
    lA.code.es5 ? X.func(V, (0, f._)`${c.default.data}, ${c.default.valCxt}`, eA.$async, () => {
      X.code((0, f._)`"use strict"; ${H(k, lA)}`), C(X, lA), X.code(SA);
    }) : X.func(V, (0, f._)`${c.default.data}, ${o(lA)}`, eA.$async, () => X.code(H(k, lA)).code(SA));
  }
  function o(X) {
    return (0, f._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${X.dynamicRef ? (0, f._)`, ${c.default.dynamicAnchors}={}` : f.nil}}={}`;
  }
  function C(X, V) {
    X.if(c.default.valCxt, () => {
      X.var(c.default.instancePath, (0, f._)`${c.default.valCxt}.${c.default.instancePath}`), X.var(c.default.parentData, (0, f._)`${c.default.valCxt}.${c.default.parentData}`), X.var(c.default.parentDataProperty, (0, f._)`${c.default.valCxt}.${c.default.parentDataProperty}`), X.var(c.default.rootData, (0, f._)`${c.default.valCxt}.${c.default.rootData}`), V.dynamicRef && X.var(c.default.dynamicAnchors, (0, f._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      X.var(c.default.instancePath, (0, f._)`""`), X.var(c.default.parentData, (0, f._)`undefined`), X.var(c.default.parentDataProperty, (0, f._)`undefined`), X.var(c.default.rootData, c.default.data), V.dynamicRef && X.var(c.default.dynamicAnchors, (0, f._)`{}`);
    });
  }
  function F(X) {
    const { schema: V, opts: k, gen: eA } = X;
    v(X, () => {
      k.$comment && V.$comment && bA(X), wA(X), eA.let(c.default.vErrors, null), eA.let(c.default.errors, 0), k.unevaluated && U(X), hA(X), q(X);
    });
  }
  function U(X) {
    const { gen: V, validateName: k } = X;
    X.evaluated = V.const("evaluated", (0, f._)`${k}.evaluated`), V.if((0, f._)`${X.evaluated}.dynamicProps`, () => V.assign((0, f._)`${X.evaluated}.props`, (0, f._)`undefined`)), V.if((0, f._)`${X.evaluated}.dynamicItems`, () => V.assign((0, f._)`${X.evaluated}.items`, (0, f._)`undefined`));
  }
  function H(X, V) {
    const k = typeof X == "object" && X[V.schemaId];
    return k && (V.code.source || V.code.process) ? (0, f._)`/*# sourceURL=${k} */` : f.nil;
  }
  function D(X, V) {
    if (M(X) && (J(X), b(X))) {
      R(X, V);
      return;
    }
    (0, A.boolOrEmptySchema)(X, V);
  }
  function b({ schema: X, self: V }) {
    if (typeof X == "boolean")
      return !X;
    for (const k in X)
      if (V.RULES.all[k])
        return !0;
    return !1;
  }
  function M(X) {
    return typeof X.schema != "boolean";
  }
  function R(X, V) {
    const { schema: k, gen: eA, opts: lA } = X;
    lA.$comment && k.$comment && bA(X), QA(X), OA(X);
    const SA = eA.const("_errs", c.default.errors);
    hA(X, SA), eA.var(V, (0, f._)`${SA} === ${c.default.errors}`);
  }
  function J(X) {
    (0, w.checkUnknownRules)(X), cA(X);
  }
  function hA(X, V) {
    if (X.opts.jtd)
      return iA(X, [], !1, V);
    const k = (0, e.getSchemaTypes)(X.schema), eA = (0, e.coerceAndCheckDataType)(X, k);
    iA(X, k, !eA, V);
  }
  function cA(X) {
    const { schema: V, errSchemaPath: k, opts: eA, self: lA } = X;
    V.$ref && eA.ignoreKeywordsWithRef && (0, w.schemaHasRulesButRef)(V, lA.RULES) && lA.logger.warn(`$ref: keywords ignored in schema at path "${k}"`);
  }
  function wA(X) {
    const { schema: V, opts: k } = X;
    V.default !== void 0 && k.useDefaults && k.strictSchema && (0, w.checkStrictMode)(X, "default is ignored in the schema root");
  }
  function QA(X) {
    const V = X.schema[X.opts.schemaId];
    V && (X.baseId = (0, h.resolveUrl)(X.opts.uriResolver, X.baseId, V));
  }
  function OA(X) {
    if (X.schema.$async && !X.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function bA({ gen: X, schemaEnv: V, schema: k, errSchemaPath: eA, opts: lA }) {
    const SA = k.$comment;
    if (lA.$comment === !0)
      X.code((0, f._)`${c.default.self}.logger.log(${SA})`);
    else if (typeof lA.$comment == "function") {
      const zA = (0, f.str)`${eA}/$comment`, ie = X.scopeValue("root", { ref: V.root });
      X.code((0, f._)`${c.default.self}.opts.$comment(${SA}, ${zA}, ${ie}.schema)`);
    }
  }
  function q(X) {
    const { gen: V, schemaEnv: k, validateName: eA, ValidationError: lA, opts: SA } = X;
    k.$async ? V.if((0, f._)`${c.default.errors} === 0`, () => V.return(c.default.data), () => V.throw((0, f._)`new ${lA}(${c.default.vErrors})`)) : (V.assign((0, f._)`${eA}.errors`, c.default.vErrors), SA.unevaluated && CA(X), V.return((0, f._)`${c.default.errors} === 0`));
  }
  function CA({ gen: X, evaluated: V, props: k, items: eA }) {
    k instanceof f.Name && X.assign((0, f._)`${V}.props`, k), eA instanceof f.Name && X.assign((0, f._)`${V}.items`, eA);
  }
  function iA(X, V, k, eA) {
    const { gen: lA, schema: SA, data: zA, allErrors: ie, opts: Te, self: we } = X, { RULES: JA } = we;
    if (SA.$ref && (Te.ignoreKeywordsWithRef || !(0, w.schemaHasRulesButRef)(SA, JA))) {
      lA.block(() => EA(X, "$ref", JA.all.$ref.definition));
      return;
    }
    Te.jtd || IA(X, V), lA.block(() => {
      for (const GA of JA.rules)
        Ee(GA);
      Ee(JA.post);
    });
    function Ee(GA) {
      (0, t.shouldUseGroup)(SA, GA) && (GA.type ? (lA.if((0, n.checkDataType)(GA.type, zA, Te.strictNumbers)), gA(X, GA), V.length === 1 && V[0] === GA.type && k && (lA.else(), (0, n.reportTypeError)(X)), lA.endIf()) : gA(X, GA), ie || lA.if((0, f._)`${c.default.errors} === ${eA || 0}`));
    }
  }
  function gA(X, V) {
    const { gen: k, schema: eA, opts: { useDefaults: lA } } = X;
    lA && (0, i.assignDefaults)(X, V.type), k.block(() => {
      for (const SA of V.rules)
        (0, t.shouldUseRule)(eA, SA) && EA(X, SA.keyword, SA.definition, V.type);
    });
  }
  function IA(X, V) {
    X.schemaEnv.meta || !X.opts.strictTypes || (HA(X, V), X.opts.allowUnionTypes || uA(X, V), T(X, X.dataTypes));
  }
  function HA(X, V) {
    if (V.length) {
      if (!X.dataTypes.length) {
        X.dataTypes = V;
        return;
      }
      V.forEach((k) => {
        j(X.dataTypes, k) || K(X, `type "${k}" not allowed by context "${X.dataTypes.join(",")}"`);
      }), S(X, V);
    }
  }
  function uA(X, V) {
    V.length > 1 && !(V.length === 2 && V.includes("null")) && K(X, "use allowUnionTypes to allow union type keyword");
  }
  function T(X, V) {
    const k = X.self.RULES.all;
    for (const eA in k) {
      const lA = k[eA];
      if (typeof lA == "object" && (0, t.shouldUseRule)(X.schema, lA)) {
        const { type: SA } = lA.definition;
        SA.length && !SA.some((zA) => rA(V, zA)) && K(X, `missing type "${SA.join(",")}" for keyword "${eA}"`);
      }
    }
  }
  function rA(X, V) {
    return X.includes(V) || V === "number" && X.includes("integer");
  }
  function j(X, V) {
    return X.includes(V) || V === "integer" && X.includes("number");
  }
  function S(X, V) {
    const k = [];
    for (const eA of X.dataTypes)
      j(V, eA) ? k.push(eA) : V.includes("integer") && eA === "number" && k.push("integer");
    X.dataTypes = k;
  }
  function K(X, V) {
    const k = X.schemaEnv.baseId + X.errSchemaPath;
    V += ` at "${k}" (strictTypes)`, (0, w.checkStrictMode)(X, V, X.opts.strictTypes);
  }
  class aA {
    constructor(V, k, eA) {
      if ((0, s.validateKeywordUsage)(V, k, eA), this.gen = V.gen, this.allErrors = V.allErrors, this.keyword = eA, this.data = V.data, this.schema = V.schema[eA], this.$data = k.$data && V.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, w.schemaRefOrVal)(V, this.schema, eA, this.$data), this.schemaType = k.schemaType, this.parentSchema = V.schema, this.params = {}, this.it = V, this.def = k, this.$data)
        this.schemaCode = V.gen.const("vSchema", ZA(this.$data, V));
      else if (this.schemaCode = this.schemaValue, !(0, s.validSchemaType)(this.schema, k.schemaType, k.allowUndefined))
        throw new Error(`${eA} value must be ${JSON.stringify(k.schemaType)}`);
      ("code" in k ? k.trackErrors : k.errors !== !1) && (this.errsCount = V.gen.const("_errs", c.default.errors));
    }
    result(V, k, eA) {
      this.failResult((0, f.not)(V), k, eA);
    }
    failResult(V, k, eA) {
      this.gen.if(V), eA ? eA() : this.error(), k ? (this.gen.else(), k(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(V, k) {
      this.failResult((0, f.not)(V), void 0, k);
    }
    fail(V) {
      if (V === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(V), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(V) {
      if (!this.$data)
        return this.fail(V);
      const { schemaCode: k } = this;
      this.fail((0, f._)`${k} !== undefined && (${(0, f.or)(this.invalid$data(), V)})`);
    }
    error(V, k, eA) {
      if (k) {
        this.setParams(k), this._error(V, eA), this.setParams({});
        return;
      }
      this._error(V, eA);
    }
    _error(V, k) {
      (V ? B.reportExtraError : B.reportError)(this, this.def.error, k);
    }
    $dataError() {
      (0, B.reportError)(this, this.def.$dataError || B.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, B.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(V) {
      this.allErrors || this.gen.if(V);
    }
    setParams(V, k) {
      k ? Object.assign(this.params, V) : this.params = V;
    }
    block$data(V, k, eA = f.nil) {
      this.gen.block(() => {
        this.check$data(V, eA), k();
      });
    }
    check$data(V = f.nil, k = f.nil) {
      if (!this.$data)
        return;
      const { gen: eA, schemaCode: lA, schemaType: SA, def: zA } = this;
      eA.if((0, f.or)((0, f._)`${lA} === undefined`, k)), V !== f.nil && eA.assign(V, !0), (SA.length || zA.validateSchema) && (eA.elseIf(this.invalid$data()), this.$dataError(), V !== f.nil && eA.assign(V, !1)), eA.else();
    }
    invalid$data() {
      const { gen: V, schemaCode: k, schemaType: eA, def: lA, it: SA } = this;
      return (0, f.or)(zA(), ie());
      function zA() {
        if (eA.length) {
          if (!(k instanceof f.Name))
            throw new Error("ajv implementation error");
          const Te = Array.isArray(eA) ? eA : [eA];
          return (0, f._)`${(0, n.checkDataTypes)(Te, k, SA.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return f.nil;
      }
      function ie() {
        if (lA.validateSchema) {
          const Te = V.scopeValue("validate$data", { ref: lA.validateSchema });
          return (0, f._)`!${Te}(${k})`;
        }
        return f.nil;
      }
    }
    subschema(V, k) {
      const eA = (0, l.getSubschema)(this.it, V);
      (0, l.extendSubschemaData)(eA, this.it, V), (0, l.extendSubschemaMode)(eA, V);
      const lA = { ...this.it, ...eA, items: void 0, props: void 0 };
      return D(lA, k), lA;
    }
    mergeEvaluated(V, k) {
      const { it: eA, gen: lA } = this;
      eA.opts.unevaluated && (eA.props !== !0 && V.props !== void 0 && (eA.props = w.mergeEvaluated.props(lA, V.props, eA.props, k)), eA.items !== !0 && V.items !== void 0 && (eA.items = w.mergeEvaluated.items(lA, V.items, eA.items, k)));
    }
    mergeValidEvaluated(V, k) {
      const { it: eA, gen: lA } = this;
      if (eA.opts.unevaluated && (eA.props !== !0 || eA.items !== !0))
        return lA.if(k, () => this.mergeEvaluated(V, f.Name)), !0;
    }
  }
  Hr.KeywordCxt = aA;
  function EA(X, V, k, eA) {
    const lA = new aA(X, k, V);
    "code" in k ? k.code(lA, eA) : lA.$data && k.validate ? (0, s.funcKeywordCode)(lA, k) : "macro" in k ? (0, s.macroKeywordCode)(lA, k) : (k.compile || k.validate) && (0, s.funcKeywordCode)(lA, k);
  }
  const _A = /^\/(?:[^~]|~0|~1)*$/, qA = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function ZA(X, { dataLevel: V, dataNames: k, dataPathArr: eA }) {
    let lA, SA;
    if (X === "")
      return c.default.rootData;
    if (X[0] === "/") {
      if (!_A.test(X))
        throw new Error(`Invalid JSON-pointer: ${X}`);
      lA = X, SA = c.default.rootData;
    } else {
      const we = qA.exec(X);
      if (!we)
        throw new Error(`Invalid JSON-pointer: ${X}`);
      const JA = +we[1];
      if (lA = we[2], lA === "#") {
        if (JA >= V)
          throw new Error(Te("property/index", JA));
        return eA[V - JA];
      }
      if (JA > V)
        throw new Error(Te("data", JA));
      if (SA = k[V - JA], !lA)
        return SA;
    }
    let zA = SA;
    const ie = lA.split("/");
    for (const we of ie)
      we && (SA = (0, f._)`${SA}${(0, f.getProperty)((0, w.unescapeJsonPointer)(we))}`, zA = (0, f._)`${zA} && ${SA}`);
    return zA;
    function Te(we, JA) {
      return `Cannot access ${we} ${JA} levels up, current level is ${V}`;
    }
  }
  return Hr.getData = ZA, Hr;
}
var Xu = {}, MB;
function Md() {
  if (MB) return Xu;
  MB = 1, Object.defineProperty(Xu, "__esModule", { value: !0 });
  class A extends Error {
    constructor(t) {
      super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
    }
  }
  return Xu.default = A, Xu;
}
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const eh = Qt;
class L1 extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`), this.missingRef = (0, eh.resolveUrl)(e, t, n), this.missingSchema = (0, eh.normalizeId)((0, eh.getFullPath)(e, this.missingRef));
  }
}
oo.default = L1;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.resolveSchema = jt.getCompilingSchema = jt.resolveRef = jt.compileSchema = jt.SchemaEnv = void 0;
const Pn = ve, T1 = Md(), ki = lr, Gn = Qt, PB = KA, D1 = yc();
class Cc {
  constructor(e) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (t = e.baseId) !== null && t !== void 0 ? t : (0, Gn.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
jt.SchemaEnv = Cc;
function Pd(A) {
  const e = cv.call(this, A);
  if (e)
    return e;
  const t = (0, Gn.getFullPath)(this.opts.uriResolver, A.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, l = new Pn.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let f;
  A.$async && (f = l.scopeValue("Error", {
    ref: T1.default,
    code: (0, Pn._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = l.scopeName("validate");
  A.validateName = c;
  const h = {
    gen: l,
    allErrors: this.opts.allErrors,
    data: ki.default.data,
    parentData: ki.default.parentData,
    parentDataProperty: ki.default.parentDataProperty,
    dataNames: [ki.default.data],
    dataPathArr: [Pn.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: l.scopeValue("schema", this.opts.code.source === !0 ? { ref: A.schema, code: (0, Pn.stringify)(A.schema) } : { ref: A.schema }),
    validateName: c,
    ValidationError: f,
    schema: A.schema,
    schemaEnv: A,
    rootId: t,
    baseId: A.baseId || t,
    schemaPath: Pn.nil,
    errSchemaPath: A.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Pn._)`""`,
    opts: this.opts,
    self: this
  };
  let w;
  try {
    this._compilations.add(A), (0, D1.validateFunctionCode)(h), l.optimize(this.opts.code.optimize);
    const B = l.toString();
    w = `${l.scopeRefs(ki.default.scope)}return ${B}`, this.opts.code.process && (w = this.opts.code.process(w, A));
    const v = new Function(`${ki.default.self}`, `${ki.default.scope}`, w)(this, this.scope.get());
    if (this.scope.value(c, { ref: v }), v.errors = null, v.schema = A.schema, v.schemaEnv = A, A.$async && (v.$async = !0), this.opts.code.source === !0 && (v.source = { validateName: c, validateCode: B, scopeValues: l._values }), this.opts.unevaluated) {
      const { props: o, items: C } = h;
      v.evaluated = {
        props: o instanceof Pn.Name ? void 0 : o,
        items: C instanceof Pn.Name ? void 0 : C,
        dynamicProps: o instanceof Pn.Name,
        dynamicItems: C instanceof Pn.Name
      }, v.source && (v.source.evaluated = (0, Pn.stringify)(v.evaluated));
    }
    return A.validate = v, A;
  } catch (B) {
    throw delete A.validate, delete A.validateName, w && this.logger.error("Error compiling schema, function code:", w), B;
  } finally {
    this._compilations.delete(A);
  }
}
jt.compileSchema = Pd;
function O1(A, e, t) {
  var n;
  t = (0, Gn.resolveUrl)(this.opts.uriResolver, e, t);
  const i = A.refs[t];
  if (i)
    return i;
  let s = P1.call(this, A, t);
  if (s === void 0) {
    const l = (n = A.localRefs) === null || n === void 0 ? void 0 : n[t], { schemaId: f } = this.opts;
    l && (s = new Cc({ schema: l, schemaId: f, root: A, baseId: e }));
  }
  if (s !== void 0)
    return A.refs[t] = N1.call(this, s);
}
jt.resolveRef = O1;
function N1(A) {
  return (0, Gn.inlineRef)(A.schema, this.opts.inlineRefs) ? A.schema : A.validate ? A : Pd.call(this, A);
}
function cv(A) {
  for (const e of this._compilations)
    if (M1(e, A))
      return e;
}
jt.getCompilingSchema = cv;
function M1(A, e) {
  return A.schema === e.schema && A.root === e.root && A.baseId === e.baseId;
}
function P1(A, e) {
  let t;
  for (; typeof (t = this.refs[e]) == "string"; )
    e = t;
  return t || this.schemas[e] || Qc.call(this, A, e);
}
function Qc(A, e) {
  const t = this.opts.uriResolver.parse(e), n = (0, Gn._getFullPath)(this.opts.uriResolver, t);
  let i = (0, Gn.getFullPath)(this.opts.uriResolver, A.baseId, void 0);
  if (Object.keys(A.schema).length > 0 && n === i)
    return th.call(this, t, A);
  const s = (0, Gn.normalizeId)(n), l = this.refs[s] || this.schemas[s];
  if (typeof l == "string") {
    const f = Qc.call(this, A, l);
    return typeof (f == null ? void 0 : f.schema) != "object" ? void 0 : th.call(this, t, f);
  }
  if (typeof (l == null ? void 0 : l.schema) == "object") {
    if (l.validate || Pd.call(this, l), s === (0, Gn.normalizeId)(e)) {
      const { schema: f } = l, { schemaId: c } = this.opts, h = f[c];
      return h && (i = (0, Gn.resolveUrl)(this.opts.uriResolver, i, h)), new Cc({ schema: f, schemaId: c, root: A, baseId: i });
    }
    return th.call(this, t, l);
  }
}
jt.resolveSchema = Qc;
const R1 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function th(A, { baseId: e, schema: t, root: n }) {
  var i;
  if (((i = A.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const f of A.fragment.slice(1).split("/")) {
    if (typeof t == "boolean")
      return;
    const c = t[(0, PB.unescapeFragment)(f)];
    if (c === void 0)
      return;
    t = c;
    const h = typeof t == "object" && t[this.opts.schemaId];
    !R1.has(f) && h && (e = (0, Gn.resolveUrl)(this.opts.uriResolver, e, h));
  }
  let s;
  if (typeof t != "boolean" && t.$ref && !(0, PB.schemaHasRulesButRef)(t, this.RULES)) {
    const f = (0, Gn.resolveUrl)(this.opts.uriResolver, e, t.$ref);
    s = Qc.call(this, n, f);
  }
  const { schemaId: l } = this.opts;
  if (s = s || new Cc({ schema: t, schemaId: l, root: n, baseId: e }), s.schema !== s.root.schema)
    return s;
}
const K1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", k1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", $1 = "object", G1 = [
  "$data"
], V1 = {
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
}, W1 = !1, X1 = {
  $id: K1,
  description: k1,
  type: $1,
  required: G1,
  properties: V1,
  additionalProperties: W1
};
var Rd = {}, Fc = { exports: {} };
const q1 = {
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
var z1 = {
  HEX: q1
};
const { HEX: J1 } = z1;
function fv(A) {
  if (dv(A, ".") < 3)
    return { host: A, isIPV4: !1 };
  const e = A.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u) || [], [t] = e;
  return t ? { host: Y1(t, "."), isIPV4: !0 } : { host: A, isIPV4: !1 };
}
function Rh(A, e = !1) {
  let t = "", n = !0;
  for (const i of A) {
    if (J1[i] === void 0) return;
    i !== "0" && n === !0 && (n = !1), n || (t += i);
  }
  return e && t.length === 0 && (t = "0"), t;
}
function j1(A) {
  let e = 0;
  const t = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, l = !1, f = !1;
  function c() {
    if (i.length) {
      if (s === !1) {
        const h = Rh(i);
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
  return i.length && (s ? t.zone = i.join("") : f ? n.push(i.join("")) : n.push(Rh(i))), t.address = n.join(""), t;
}
function hv(A, e = {}) {
  if (dv(A, ":") < 2)
    return { host: A, isIPV6: !1 };
  const t = j1(A);
  if (t.error)
    return { host: A, isIPV6: !1 };
  {
    let n = t.address, i = t.address;
    return t.zone && (n += "%" + t.zone, i += "%25" + t.zone), { host: n, escapedHost: i, isIPV6: !0 };
  }
}
function Y1(A, e) {
  let t = "", n = !0;
  const i = A.length;
  for (let s = 0; s < i; s++) {
    const l = A[s];
    l === "0" && n ? (s + 1 <= i && A[s + 1] === e || s + 1 === i) && (t += l, n = !1) : (l === e ? n = !0 : n = !1, t += l);
  }
  return t;
}
function dv(A, e) {
  let t = 0;
  for (let n = 0; n < A.length; n++)
    A[n] === e && t++;
  return t;
}
const RB = /^\.\.?\//u, KB = /^\/\.(?:\/|$)/u, kB = /^\/\.\.(?:\/|$)/u, Z1 = /^\/?(?:.|\n)*?(?=\/|$)/u;
function A_(A) {
  const e = [];
  for (; A.length; )
    if (A.match(RB))
      A = A.replace(RB, "");
    else if (A.match(KB))
      A = A.replace(KB, "/");
    else if (A.match(kB))
      A = A.replace(kB, "/"), e.pop();
    else if (A === "." || A === "..")
      A = "";
    else {
      const t = A.match(Z1);
      if (t) {
        const n = t[0];
        A = A.slice(n.length), e.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return e.join("");
}
function e_(A, e) {
  const t = e !== !0 ? escape : unescape;
  return A.scheme !== void 0 && (A.scheme = t(A.scheme)), A.userinfo !== void 0 && (A.userinfo = t(A.userinfo)), A.host !== void 0 && (A.host = t(A.host)), A.path !== void 0 && (A.path = t(A.path)), A.query !== void 0 && (A.query = t(A.query)), A.fragment !== void 0 && (A.fragment = t(A.fragment)), A;
}
function t_(A, e) {
  const t = [];
  if (A.userinfo !== void 0 && (t.push(A.userinfo), t.push("@")), A.host !== void 0) {
    let n = unescape(A.host);
    const i = fv(n);
    if (i.isIPV4)
      n = i.host;
    else {
      const s = hv(i.host, { isIPV4: !1 });
      s.isIPV6 === !0 ? n = `[${s.escapedHost}]` : n = A.host;
    }
    t.push(n);
  }
  return (typeof A.port == "number" || typeof A.port == "string") && (t.push(":"), t.push(String(A.port))), t.length ? t.join("") : void 0;
}
var n_ = {
  recomposeAuthority: t_,
  normalizeComponentEncoding: e_,
  removeDotSegments: A_,
  normalizeIPv4: fv,
  normalizeIPv6: hv,
  stringArrayToHexStripped: Rh
};
const r_ = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, i_ = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function pv(A) {
  return typeof A.secure == "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss";
}
function gv(A) {
  return A.host || (A.error = A.error || "HTTP URIs must have a host."), A;
}
function Bv(A) {
  const e = String(A.scheme).toLowerCase() === "https";
  return (A.port === (e ? 443 : 80) || A.port === "") && (A.port = void 0), A.path || (A.path = "/"), A;
}
function a_(A) {
  return A.secure = pv(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A;
}
function o_(A) {
  if ((A.port === (pv(A) ? 443 : 80) || A.port === "") && (A.port = void 0), typeof A.secure == "boolean" && (A.scheme = A.secure ? "wss" : "ws", A.secure = void 0), A.resourceName) {
    const [e, t] = A.resourceName.split("?");
    A.path = e && e !== "/" ? e : void 0, A.query = t, A.resourceName = void 0;
  }
  return A.fragment = void 0, A;
}
function s_(A, e) {
  if (!A.path)
    return A.error = "URN can not be parsed", A;
  const t = A.path.match(i_);
  if (t) {
    const n = e.scheme || A.scheme || "urn";
    A.nid = t[1].toLowerCase(), A.nss = t[2];
    const i = `${n}:${e.nid || A.nid}`, s = Kd[i];
    A.path = void 0, s && (A = s.parse(A, e));
  } else
    A.error = A.error || "URN can not be parsed.";
  return A;
}
function u_(A, e) {
  const t = e.scheme || A.scheme || "urn", n = A.nid.toLowerCase(), i = `${t}:${e.nid || n}`, s = Kd[i];
  s && (A = s.serialize(A, e));
  const l = A, f = A.nss;
  return l.path = `${n || e.nid}:${f}`, e.skipEscape = !0, l;
}
function l_(A, e) {
  const t = A;
  return t.uuid = t.nss, t.nss = void 0, !e.tolerant && (!t.uuid || !r_.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
}
function c_(A) {
  const e = A;
  return e.nss = (A.uuid || "").toLowerCase(), e;
}
const wv = {
  scheme: "http",
  domainHost: !0,
  parse: gv,
  serialize: Bv
}, f_ = {
  scheme: "https",
  domainHost: wv.domainHost,
  parse: gv,
  serialize: Bv
}, Ll = {
  scheme: "ws",
  domainHost: !0,
  parse: a_,
  serialize: o_
}, h_ = {
  scheme: "wss",
  domainHost: Ll.domainHost,
  parse: Ll.parse,
  serialize: Ll.serialize
}, d_ = {
  scheme: "urn",
  parse: s_,
  serialize: u_,
  skipNormalize: !0
}, p_ = {
  scheme: "urn:uuid",
  parse: l_,
  serialize: c_,
  skipNormalize: !0
}, Kd = {
  http: wv,
  https: f_,
  ws: Ll,
  wss: h_,
  urn: d_,
  "urn:uuid": p_
};
var g_ = Kd;
const { normalizeIPv6: B_, normalizeIPv4: w_, removeDotSegments: Yo, recomposeAuthority: m_, normalizeComponentEncoding: qu } = n_, kd = g_;
function v_(A, e) {
  return typeof A == "string" ? A = ar(Rr(A, e), e) : typeof A == "object" && (A = Rr(ar(A, e), e)), A;
}
function y_(A, e, t) {
  const n = Object.assign({ scheme: "null" }, t), i = mv(Rr(A, n), Rr(e, n), n, !0);
  return ar(i, { ...n, skipEscape: !0 });
}
function mv(A, e, t, n) {
  const i = {};
  return n || (A = Rr(ar(A, t), t), e = Rr(ar(e, t), t)), t = t || {}, !t.tolerant && e.scheme ? (i.scheme = e.scheme, i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = Yo(e.path || ""), i.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = Yo(e.path || ""), i.query = e.query) : (e.path ? (e.path.charAt(0) === "/" ? i.path = Yo(e.path) : ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path ? i.path = "/" + e.path : A.path ? i.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + e.path : i.path = e.path, i.path = Yo(i.path)), i.query = e.query) : (i.path = A.path, e.query !== void 0 ? i.query = e.query : i.query = A.query), i.userinfo = A.userinfo, i.host = A.host, i.port = A.port), i.scheme = A.scheme), i.fragment = e.fragment, i;
}
function C_(A, e, t) {
  return typeof A == "string" ? (A = unescape(A), A = ar(qu(Rr(A, t), !0), { ...t, skipEscape: !0 })) : typeof A == "object" && (A = ar(qu(A, !0), { ...t, skipEscape: !0 })), typeof e == "string" ? (e = unescape(e), e = ar(qu(Rr(e, t), !0), { ...t, skipEscape: !0 })) : typeof e == "object" && (e = ar(qu(e, !0), { ...t, skipEscape: !0 })), A.toLowerCase() === e.toLowerCase();
}
function ar(A, e) {
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
  }, n = Object.assign({}, e), i = [], s = kd[(n.scheme || t.scheme || "").toLowerCase()];
  s && s.serialize && s.serialize(t, n), t.path !== void 0 && (n.skipEscape ? t.path = unescape(t.path) : (t.path = escape(t.path), t.scheme !== void 0 && (t.path = t.path.split("%3A").join(":")))), n.reference !== "suffix" && t.scheme && (i.push(t.scheme), i.push(":"));
  const l = m_(t, n);
  if (l !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(l), t.path && t.path.charAt(0) !== "/" && i.push("/")), t.path !== void 0) {
    let f = t.path;
    !n.absolutePath && (!s || !s.absolutePath) && (f = Yo(f)), l === void 0 && (f = f.replace(/^\/\//u, "/%2F")), i.push(f);
  }
  return t.query !== void 0 && (i.push("?"), i.push(t.query)), t.fragment !== void 0 && (i.push("#"), i.push(t.fragment)), i.join("");
}
const Q_ = Array.from({ length: 127 }, (A, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
function F_(A) {
  let e = 0;
  for (let t = 0, n = A.length; t < n; ++t)
    if (e = A.charCodeAt(t), e > 126 || Q_[e])
      return !0;
  return !1;
}
const U_ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
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
  const l = A.match(U_);
  if (l) {
    if (n.scheme = l[1], n.userinfo = l[3], n.host = l[4], n.port = parseInt(l[5], 10), n.path = l[6] || "", n.query = l[7], n.fragment = l[8], isNaN(n.port) && (n.port = l[5]), n.host) {
      const c = w_(n.host);
      if (c.isIPV4 === !1) {
        const h = B_(c.host, { isIPV4: !1 });
        n.host = h.host.toLowerCase(), s = h.isIPV6;
      } else
        n.host = c.host, s = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && !n.path && n.query === void 0 ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
    const f = kd[(t.scheme || n.scheme || "").toLowerCase()];
    if (!t.unicodeSupport && (!f || !f.unicodeSupport) && n.host && (t.domainHost || f && f.domainHost) && s === !1 && F_(n.host))
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
const $d = {
  SCHEMES: kd,
  normalize: v_,
  resolve: y_,
  resolveComponents: mv,
  equal: C_,
  serialize: ar,
  parse: Rr
};
Fc.exports = $d;
Fc.exports.default = $d;
Fc.exports.fastUri = $d;
var E_ = Fc.exports;
Object.defineProperty(Rd, "__esModule", { value: !0 });
const vv = E_;
vv.code = 'require("ajv/dist/runtime/uri").default';
Rd.default = vv;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.CodeGen = A.Name = A.nil = A.stringify = A.str = A._ = A.KeywordCxt = void 0;
  var e = yc();
  Object.defineProperty(A, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var t = ve;
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
  const n = Md(), i = oo, s = na, l = jt, f = ve, c = Qt, h = ct, w = KA, B = X1, p = Rd, v = (uA, T) => new RegExp(uA, T);
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
  }, H = 200;
  function D(uA) {
    var T, rA, j, S, K, aA, EA, _A, qA, ZA, X, V, k, eA, lA, SA, zA, ie, Te, we, JA, Ee, GA, Ge, Ut;
    const Ot = uA.strict, Et = (T = uA.code) === null || T === void 0 ? void 0 : T.optimize, Bt = Et === !0 || Et === void 0 ? 1 : Et || 0, un = (j = (rA = uA.code) === null || rA === void 0 ? void 0 : rA.regExp) !== null && j !== void 0 ? j : v, dr = (S = uA.uriResolver) !== null && S !== void 0 ? S : p.default;
    return {
      strictSchema: (aA = (K = uA.strictSchema) !== null && K !== void 0 ? K : Ot) !== null && aA !== void 0 ? aA : !0,
      strictNumbers: (_A = (EA = uA.strictNumbers) !== null && EA !== void 0 ? EA : Ot) !== null && _A !== void 0 ? _A : !0,
      strictTypes: (ZA = (qA = uA.strictTypes) !== null && qA !== void 0 ? qA : Ot) !== null && ZA !== void 0 ? ZA : "log",
      strictTuples: (V = (X = uA.strictTuples) !== null && X !== void 0 ? X : Ot) !== null && V !== void 0 ? V : "log",
      strictRequired: (eA = (k = uA.strictRequired) !== null && k !== void 0 ? k : Ot) !== null && eA !== void 0 ? eA : !1,
      code: uA.code ? { ...uA.code, optimize: Bt, regExp: un } : { optimize: Bt, regExp: un },
      loopRequired: (lA = uA.loopRequired) !== null && lA !== void 0 ? lA : H,
      loopEnum: (SA = uA.loopEnum) !== null && SA !== void 0 ? SA : H,
      meta: (zA = uA.meta) !== null && zA !== void 0 ? zA : !0,
      messages: (ie = uA.messages) !== null && ie !== void 0 ? ie : !0,
      inlineRefs: (Te = uA.inlineRefs) !== null && Te !== void 0 ? Te : !0,
      schemaId: (we = uA.schemaId) !== null && we !== void 0 ? we : "$id",
      addUsedSchema: (JA = uA.addUsedSchema) !== null && JA !== void 0 ? JA : !0,
      validateSchema: (Ee = uA.validateSchema) !== null && Ee !== void 0 ? Ee : !0,
      validateFormats: (GA = uA.validateFormats) !== null && GA !== void 0 ? GA : !0,
      unicodeRegExp: (Ge = uA.unicodeRegExp) !== null && Ge !== void 0 ? Ge : !0,
      int32range: (Ut = uA.int32range) !== null && Ut !== void 0 ? Ut : !0,
      uriResolver: dr
    };
  }
  class b {
    constructor(T = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), T = this.opts = { ...T, ...D(T) };
      const { es5: rA, lines: j } = this.opts.code;
      this.scope = new f.ValueScope({ scope: {}, prefixes: C, es5: rA, lines: j }), this.logger = OA(T.logger);
      const S = T.validateFormats;
      T.validateFormats = !1, this.RULES = (0, s.getRules)(), M.call(this, F, T, "NOT SUPPORTED"), M.call(this, U, T, "DEPRECATED", "warn"), this._metaOpts = wA.call(this), T.formats && hA.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), T.keywords && cA.call(this, T.keywords), typeof T.meta == "object" && this.addMetaSchema(T.meta), J.call(this), T.validateFormats = S;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: T, meta: rA, schemaId: j } = this.opts;
      let S = B;
      j === "id" && (S = { ...B }, S.id = S.$id, delete S.$id), rA && T && this.addMetaSchema(S, S[j], !1);
    }
    defaultMeta() {
      const { meta: T, schemaId: rA } = this.opts;
      return this.opts.defaultMeta = typeof T == "object" ? T[rA] || T : void 0;
    }
    validate(T, rA) {
      let j;
      if (typeof T == "string") {
        if (j = this.getSchema(T), !j)
          throw new Error(`no schema with key or ref "${T}"`);
      } else
        j = this.compile(T);
      const S = j(rA);
      return "$async" in j || (this.errors = j.errors), S;
    }
    compile(T, rA) {
      const j = this._addSchema(T, rA);
      return j.validate || this._compileSchemaEnv(j);
    }
    compileAsync(T, rA) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: j } = this.opts;
      return S.call(this, T, rA);
      async function S(ZA, X) {
        await K.call(this, ZA.$schema);
        const V = this._addSchema(ZA, X);
        return V.validate || aA.call(this, V);
      }
      async function K(ZA) {
        ZA && !this.getSchema(ZA) && await S.call(this, { $ref: ZA }, !0);
      }
      async function aA(ZA) {
        try {
          return this._compileSchemaEnv(ZA);
        } catch (X) {
          if (!(X instanceof i.default))
            throw X;
          return EA.call(this, X), await _A.call(this, X.missingSchema), aA.call(this, ZA);
        }
      }
      function EA({ missingSchema: ZA, missingRef: X }) {
        if (this.refs[ZA])
          throw new Error(`AnySchema ${ZA} is loaded but ${X} cannot be resolved`);
      }
      async function _A(ZA) {
        const X = await qA.call(this, ZA);
        this.refs[ZA] || await K.call(this, X.$schema), this.refs[ZA] || this.addSchema(X, ZA, rA);
      }
      async function qA(ZA) {
        const X = this._loading[ZA];
        if (X)
          return X;
        try {
          return await (this._loading[ZA] = j(ZA));
        } finally {
          delete this._loading[ZA];
        }
      }
    }
    // Adds schema to the instance
    addSchema(T, rA, j, S = this.opts.validateSchema) {
      if (Array.isArray(T)) {
        for (const aA of T)
          this.addSchema(aA, void 0, j, S);
        return this;
      }
      let K;
      if (typeof T == "object") {
        const { schemaId: aA } = this.opts;
        if (K = T[aA], K !== void 0 && typeof K != "string")
          throw new Error(`schema ${aA} must be string`);
      }
      return rA = (0, c.normalizeId)(rA || K), this._checkUnique(rA), this.schemas[rA] = this._addSchema(T, j, rA, S, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(T, rA, j = this.opts.validateSchema) {
      return this.addSchema(T, rA, !0, j), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(T, rA) {
      if (typeof T == "boolean")
        return !0;
      let j;
      if (j = T.$schema, j !== void 0 && typeof j != "string")
        throw new Error("$schema must be a string");
      if (j = j || this.opts.defaultMeta || this.defaultMeta(), !j)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const S = this.validate(j, T);
      if (!S && rA) {
        const K = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(K);
        else
          throw new Error(K);
      }
      return S;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(T) {
      let rA;
      for (; typeof (rA = R.call(this, T)) == "string"; )
        T = rA;
      if (rA === void 0) {
        const { schemaId: j } = this.opts, S = new l.SchemaEnv({ schema: {}, schemaId: j });
        if (rA = l.resolveSchema.call(this, S, T), !rA)
          return;
        this.refs[T] = rA;
      }
      return rA.validate || this._compileSchemaEnv(rA);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(T) {
      if (T instanceof RegExp)
        return this._removeAllSchemas(this.schemas, T), this._removeAllSchemas(this.refs, T), this;
      switch (typeof T) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const rA = R.call(this, T);
          return typeof rA == "object" && this._cache.delete(rA.schema), delete this.schemas[T], delete this.refs[T], this;
        }
        case "object": {
          const rA = T;
          this._cache.delete(rA);
          let j = T[this.opts.schemaId];
          return j && (j = (0, c.normalizeId)(j), delete this.schemas[j], delete this.refs[j]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(T) {
      for (const rA of T)
        this.addKeyword(rA);
      return this;
    }
    addKeyword(T, rA) {
      let j;
      if (typeof T == "string")
        j = T, typeof rA == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), rA.keyword = j);
      else if (typeof T == "object" && rA === void 0) {
        if (rA = T, j = rA.keyword, Array.isArray(j) && !j.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (q.call(this, j, rA), !rA)
        return (0, w.eachItem)(j, (K) => CA.call(this, K)), this;
      gA.call(this, rA);
      const S = {
        ...rA,
        type: (0, h.getJSONTypes)(rA.type),
        schemaType: (0, h.getJSONTypes)(rA.schemaType)
      };
      return (0, w.eachItem)(j, S.type.length === 0 ? (K) => CA.call(this, K, S) : (K) => S.type.forEach((aA) => CA.call(this, K, S, aA))), this;
    }
    getKeyword(T) {
      const rA = this.RULES.all[T];
      return typeof rA == "object" ? rA.definition : !!rA;
    }
    // Remove keyword
    removeKeyword(T) {
      const { RULES: rA } = this;
      delete rA.keywords[T], delete rA.all[T];
      for (const j of rA.rules) {
        const S = j.rules.findIndex((K) => K.keyword === T);
        S >= 0 && j.rules.splice(S, 1);
      }
      return this;
    }
    // Add format
    addFormat(T, rA) {
      return typeof rA == "string" && (rA = new RegExp(rA)), this.formats[T] = rA, this;
    }
    errorsText(T = this.errors, { separator: rA = ", ", dataVar: j = "data" } = {}) {
      return !T || T.length === 0 ? "No errors" : T.map((S) => `${j}${S.instancePath} ${S.message}`).reduce((S, K) => S + rA + K);
    }
    $dataMetaSchema(T, rA) {
      const j = this.RULES.all;
      T = JSON.parse(JSON.stringify(T));
      for (const S of rA) {
        const K = S.split("/").slice(1);
        let aA = T;
        for (const EA of K)
          aA = aA[EA];
        for (const EA in j) {
          const _A = j[EA];
          if (typeof _A != "object")
            continue;
          const { $data: qA } = _A.definition, ZA = aA[EA];
          qA && ZA && (aA[EA] = HA(ZA));
        }
      }
      return T;
    }
    _removeAllSchemas(T, rA) {
      for (const j in T) {
        const S = T[j];
        (!rA || rA.test(j)) && (typeof S == "string" ? delete T[j] : S && !S.meta && (this._cache.delete(S.schema), delete T[j]));
      }
    }
    _addSchema(T, rA, j, S = this.opts.validateSchema, K = this.opts.addUsedSchema) {
      let aA;
      const { schemaId: EA } = this.opts;
      if (typeof T == "object")
        aA = T[EA];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof T != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let _A = this._cache.get(T);
      if (_A !== void 0)
        return _A;
      j = (0, c.normalizeId)(aA || j);
      const qA = c.getSchemaRefs.call(this, T, j);
      return _A = new l.SchemaEnv({ schema: T, schemaId: EA, meta: rA, baseId: j, localRefs: qA }), this._cache.set(_A.schema, _A), K && !j.startsWith("#") && (j && this._checkUnique(j), this.refs[j] = _A), S && this.validateSchema(T, !0), _A;
    }
    _checkUnique(T) {
      if (this.schemas[T] || this.refs[T])
        throw new Error(`schema with key or id "${T}" already exists`);
    }
    _compileSchemaEnv(T) {
      if (T.meta ? this._compileMetaSchema(T) : l.compileSchema.call(this, T), !T.validate)
        throw new Error("ajv implementation error");
      return T.validate;
    }
    _compileMetaSchema(T) {
      const rA = this.opts;
      this.opts = this._metaOpts;
      try {
        l.compileSchema.call(this, T);
      } finally {
        this.opts = rA;
      }
    }
  }
  b.ValidationError = n.default, b.MissingRefError = i.default, A.default = b;
  function M(uA, T, rA, j = "error") {
    for (const S in uA) {
      const K = S;
      K in T && this.logger[j](`${rA}: option ${S}. ${uA[K]}`);
    }
  }
  function R(uA) {
    return uA = (0, c.normalizeId)(uA), this.schemas[uA] || this.refs[uA];
  }
  function J() {
    const uA = this.opts.schemas;
    if (uA)
      if (Array.isArray(uA))
        this.addSchema(uA);
      else
        for (const T in uA)
          this.addSchema(uA[T], T);
  }
  function hA() {
    for (const uA in this.opts.formats) {
      const T = this.opts.formats[uA];
      T && this.addFormat(uA, T);
    }
  }
  function cA(uA) {
    if (Array.isArray(uA)) {
      this.addVocabulary(uA);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const T in uA) {
      const rA = uA[T];
      rA.keyword || (rA.keyword = T), this.addKeyword(rA);
    }
  }
  function wA() {
    const uA = { ...this.opts };
    for (const T of o)
      delete uA[T];
    return uA;
  }
  const QA = { log() {
  }, warn() {
  }, error() {
  } };
  function OA(uA) {
    if (uA === !1)
      return QA;
    if (uA === void 0)
      return console;
    if (uA.log && uA.warn && uA.error)
      return uA;
    throw new Error("logger must implement log, warn and error methods");
  }
  const bA = /^[a-z_$][a-z0-9_$:-]*$/i;
  function q(uA, T) {
    const { RULES: rA } = this;
    if ((0, w.eachItem)(uA, (j) => {
      if (rA.keywords[j])
        throw new Error(`Keyword ${j} is already defined`);
      if (!bA.test(j))
        throw new Error(`Keyword ${j} has invalid name`);
    }), !!T && T.$data && !("code" in T || "validate" in T))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function CA(uA, T, rA) {
    var j;
    const S = T == null ? void 0 : T.post;
    if (rA && S)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: K } = this;
    let aA = S ? K.post : K.rules.find(({ type: _A }) => _A === rA);
    if (aA || (aA = { type: rA, rules: [] }, K.rules.push(aA)), K.keywords[uA] = !0, !T)
      return;
    const EA = {
      keyword: uA,
      definition: {
        ...T,
        type: (0, h.getJSONTypes)(T.type),
        schemaType: (0, h.getJSONTypes)(T.schemaType)
      }
    };
    T.before ? iA.call(this, aA, EA, T.before) : aA.rules.push(EA), K.all[uA] = EA, (j = T.implements) === null || j === void 0 || j.forEach((_A) => this.addKeyword(_A));
  }
  function iA(uA, T, rA) {
    const j = uA.rules.findIndex((S) => S.keyword === rA);
    j >= 0 ? uA.rules.splice(j, 0, T) : (uA.rules.push(T), this.logger.warn(`rule ${rA} is not defined`));
  }
  function gA(uA) {
    let { metaSchema: T } = uA;
    T !== void 0 && (uA.$data && this.opts.$data && (T = HA(T)), uA.validateSchema = this.compile(T, !0));
  }
  const IA = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function HA(uA) {
    return { anyOf: [uA, IA] };
  }
})(Xm);
var Gd = {}, Vd = {}, Wd = {};
Object.defineProperty(Wd, "__esModule", { value: !0 });
const b_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Wd.default = b_;
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
ra.callRef = ra.getValidate = void 0;
const __ = oo, $B = me, zt = ve, La = lr, GB = jt, zu = KA, x_ = {
  keyword: "$ref",
  schemaType: "string",
  code(A) {
    const { gen: e, schema: t, it: n } = A, { baseId: i, schemaEnv: s, validateName: l, opts: f, self: c } = n, { root: h } = s;
    if ((t === "#" || t === "#/") && i === h.baseId)
      return B();
    const w = GB.resolveRef.call(c, h, i, t);
    if (w === void 0)
      throw new __.default(n.opts.uriResolver, i, t);
    if (w instanceof GB.SchemaEnv)
      return p(w);
    return v(w);
    function B() {
      if (s === h)
        return Tl(A, l, s, s.$async);
      const o = e.scopeValue("root", { ref: h });
      return Tl(A, (0, zt._)`${o}.validate`, h, h.$async);
    }
    function p(o) {
      const C = yv(A, o);
      Tl(A, C, o, o.$async);
    }
    function v(o) {
      const C = e.scopeValue("schema", f.code.source === !0 ? { ref: o, code: (0, zt.stringify)(o) } : { ref: o }), F = e.name("valid"), U = A.subschema({
        schema: o,
        dataTypes: [],
        schemaPath: zt.nil,
        topSchemaRef: C,
        errSchemaPath: t
      }, F);
      A.mergeEvaluated(U), A.ok(F);
    }
  }
};
function yv(A, e) {
  const { gen: t } = A;
  return e.validate ? t.scopeValue("validate", { ref: e.validate }) : (0, zt._)`${t.scopeValue("wrapper", { ref: e })}.validate`;
}
ra.getValidate = yv;
function Tl(A, e, t, n) {
  const { gen: i, it: s } = A, { allErrors: l, schemaEnv: f, opts: c } = s, h = c.passContext ? La.default.this : zt.nil;
  n ? w() : B();
  function w() {
    if (!f.$async)
      throw new Error("async schema referenced by sync schema");
    const o = i.let("valid");
    i.try(() => {
      i.code((0, zt._)`await ${(0, $B.callValidateCode)(A, e, h)}`), v(e), l || i.assign(o, !0);
    }, (C) => {
      i.if((0, zt._)`!(${C} instanceof ${s.ValidationError})`, () => i.throw(C)), p(C), l || i.assign(o, !1);
    }), A.ok(o);
  }
  function B() {
    A.result((0, $B.callValidateCode)(A, e, h), () => v(e), () => p(e));
  }
  function p(o) {
    const C = (0, zt._)`${o}.errors`;
    i.assign(La.default.vErrors, (0, zt._)`${La.default.vErrors} === null ? ${C} : ${La.default.vErrors}.concat(${C})`), i.assign(La.default.errors, (0, zt._)`${La.default.vErrors}.length`);
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
        const U = i.var("props", (0, zt._)`${o}.evaluated.props`);
        s.props = zu.mergeEvaluated.props(i, U, s.props, zt.Name);
      }
    if (s.items !== !0)
      if (F && !F.dynamicItems)
        F.items !== void 0 && (s.items = zu.mergeEvaluated.items(i, F.items, s.items));
      else {
        const U = i.var("items", (0, zt._)`${o}.evaluated.items`);
        s.items = zu.mergeEvaluated.items(i, U, s.items, zt.Name);
      }
  }
}
ra.callRef = Tl;
ra.default = x_;
Object.defineProperty(Vd, "__esModule", { value: !0 });
const I_ = Wd, H_ = ra, S_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  I_.default,
  H_.default
];
Vd.default = S_;
var Xd = {}, qd = {};
Object.defineProperty(qd, "__esModule", { value: !0 });
const Xl = ve, li = Xl.operators, ql = {
  maximum: { okStr: "<=", ok: li.LTE, fail: li.GT },
  minimum: { okStr: ">=", ok: li.GTE, fail: li.LT },
  exclusiveMaximum: { okStr: "<", ok: li.LT, fail: li.GTE },
  exclusiveMinimum: { okStr: ">", ok: li.GT, fail: li.LTE }
}, L_ = {
  message: ({ keyword: A, schemaCode: e }) => (0, Xl.str)`must be ${ql[A].okStr} ${e}`,
  params: ({ keyword: A, schemaCode: e }) => (0, Xl._)`{comparison: ${ql[A].okStr}, limit: ${e}}`
}, T_ = {
  keyword: Object.keys(ql),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: L_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A;
    A.fail$data((0, Xl._)`${t} ${ql[e].fail} ${n} || isNaN(${t})`);
  }
};
qd.default = T_;
var zd = {};
Object.defineProperty(zd, "__esModule", { value: !0 });
const us = ve, D_ = {
  message: ({ schemaCode: A }) => (0, us.str)`must be multiple of ${A}`,
  params: ({ schemaCode: A }) => (0, us._)`{multipleOf: ${A}}`
}, O_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: D_,
  code(A) {
    const { gen: e, data: t, schemaCode: n, it: i } = A, s = i.opts.multipleOfPrecision, l = e.let("res"), f = s ? (0, us._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${s}` : (0, us._)`${l} !== parseInt(${l})`;
    A.fail$data((0, us._)`(${n} === 0 || (${l} = ${t}/${n}, ${f}))`);
  }
};
zd.default = O_;
var Jd = {}, jd = {};
Object.defineProperty(jd, "__esModule", { value: !0 });
function Cv(A) {
  const e = A.length;
  let t = 0, n = 0, i;
  for (; n < e; )
    t++, i = A.charCodeAt(n++), i >= 55296 && i <= 56319 && n < e && (i = A.charCodeAt(n), (i & 64512) === 56320 && n++);
  return t;
}
jd.default = Cv;
Cv.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Jd, "__esModule", { value: !0 });
const Xi = ve, N_ = KA, M_ = jd, P_ = {
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
  error: P_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n, it: i } = A, s = e === "maxLength" ? Xi.operators.GT : Xi.operators.LT, l = i.opts.unicode === !1 ? (0, Xi._)`${t}.length` : (0, Xi._)`${(0, N_.useFunc)(A.gen, M_.default)}(${t})`;
    A.fail$data((0, Xi._)`${l} ${s} ${n}`);
  }
};
Jd.default = R_;
var Yd = {};
Object.defineProperty(Yd, "__esModule", { value: !0 });
const K_ = me, zl = ve, k_ = {
  message: ({ schemaCode: A }) => (0, zl.str)`must match pattern "${A}"`,
  params: ({ schemaCode: A }) => (0, zl._)`{pattern: ${A}}`
}, $_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: k_,
  code(A) {
    const { data: e, $data: t, schema: n, schemaCode: i, it: s } = A, l = s.opts.unicodeRegExp ? "u" : "", f = t ? (0, zl._)`(new RegExp(${i}, ${l}))` : (0, K_.usePattern)(A, n);
    A.fail$data((0, zl._)`!${f}.test(${e})`);
  }
};
Yd.default = $_;
var Zd = {};
Object.defineProperty(Zd, "__esModule", { value: !0 });
const ls = ve, G_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxProperties" ? "more" : "fewer";
    return (0, ls.str)`must NOT have ${t} than ${e} properties`;
  },
  params: ({ schemaCode: A }) => (0, ls._)`{limit: ${A}}`
}, V_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: G_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxProperties" ? ls.operators.GT : ls.operators.LT;
    A.fail$data((0, ls._)`Object.keys(${t}).length ${i} ${n}`);
  }
};
Zd.default = V_;
var Ap = {};
Object.defineProperty(Ap, "__esModule", { value: !0 });
const Go = me, cs = ve, W_ = KA, X_ = {
  message: ({ params: { missingProperty: A } }) => (0, cs.str)`must have required property '${A}'`,
  params: ({ params: { missingProperty: A } }) => (0, cs._)`{missingProperty: ${A}}`
}, q_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: X_,
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
          (0, W_.checkStrictMode)(l, U, l.opts.strictRequired);
        }
    }
    function h() {
      if (c || s)
        A.block$data(cs.nil, B);
      else
        for (const v of t)
          (0, Go.checkReportMissingProp)(A, v);
    }
    function w() {
      const v = e.let("missing");
      if (c || s) {
        const o = e.let("valid", !0);
        A.block$data(o, () => p(v, o)), A.ok(o);
      } else
        e.if((0, Go.checkMissingProp)(A, t, v)), (0, Go.reportMissingProp)(A, v), e.else();
    }
    function B() {
      e.forOf("prop", n, (v) => {
        A.setParams({ missingProperty: v }), e.if((0, Go.noPropertyInData)(e, i, v, f.ownProperties), () => A.error());
      });
    }
    function p(v, o) {
      A.setParams({ missingProperty: v }), e.forOf(v, n, () => {
        e.assign(o, (0, Go.propertyInData)(e, i, v, f.ownProperties)), e.if((0, cs.not)(o), () => {
          A.error(), e.break();
        });
      }, cs.nil);
    }
  }
};
Ap.default = q_;
var ep = {};
Object.defineProperty(ep, "__esModule", { value: !0 });
const fs = ve, z_ = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxItems" ? "more" : "fewer";
    return (0, fs.str)`must NOT have ${t} than ${e} items`;
  },
  params: ({ schemaCode: A }) => (0, fs._)`{limit: ${A}}`
}, J_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: z_,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxItems" ? fs.operators.GT : fs.operators.LT;
    A.fail$data((0, fs._)`${t}.length ${i} ${n}`);
  }
};
ep.default = J_;
var tp = {}, Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
const Qv = av;
Qv.code = 'require("ajv/dist/runtime/equal").default';
Ts.default = Qv;
Object.defineProperty(tp, "__esModule", { value: !0 });
const nh = ct, yt = ve, j_ = KA, Y_ = Ts, Z_ = {
  message: ({ params: { i: A, j: e } }) => (0, yt.str)`must NOT have duplicate items (items ## ${e} and ${A} are identical)`,
  params: ({ params: { i: A, j: e } }) => (0, yt._)`{i: ${A}, j: ${e}}`
}, Ax = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Z_,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, parentSchema: s, schemaCode: l, it: f } = A;
    if (!n && !i)
      return;
    const c = e.let("valid"), h = s.items ? (0, nh.getSchemaTypes)(s.items) : [];
    A.block$data(c, w, (0, yt._)`${l} === false`), A.ok(c);
    function w() {
      const o = e.let("i", (0, yt._)`${t}.length`), C = e.let("j");
      A.setParams({ i: o, j: C }), e.assign(c, !0), e.if((0, yt._)`${o} > 1`, () => (B() ? p : v)(o, C));
    }
    function B() {
      return h.length > 0 && !h.some((o) => o === "object" || o === "array");
    }
    function p(o, C) {
      const F = e.name("item"), U = (0, nh.checkDataTypes)(h, F, f.opts.strictNumbers, nh.DataType.Wrong), H = e.const("indices", (0, yt._)`{}`);
      e.for((0, yt._)`;${o}--;`, () => {
        e.let(F, (0, yt._)`${t}[${o}]`), e.if(U, (0, yt._)`continue`), h.length > 1 && e.if((0, yt._)`typeof ${F} == "string"`, (0, yt._)`${F} += "_"`), e.if((0, yt._)`typeof ${H}[${F}] == "number"`, () => {
          e.assign(C, (0, yt._)`${H}[${F}]`), A.error(), e.assign(c, !1).break();
        }).code((0, yt._)`${H}[${F}] = ${o}`);
      });
    }
    function v(o, C) {
      const F = (0, j_.useFunc)(e, Y_.default), U = e.name("outer");
      e.label(U).for((0, yt._)`;${o}--;`, () => e.for((0, yt._)`${C} = ${o}; ${C}--;`, () => e.if((0, yt._)`${F}(${t}[${o}], ${t}[${C}])`, () => {
        A.error(), e.assign(c, !1).break(U);
      })));
    }
  }
};
tp.default = Ax;
var np = {};
Object.defineProperty(np, "__esModule", { value: !0 });
const Kh = ve, ex = KA, tx = Ts, nx = {
  message: "must be equal to constant",
  params: ({ schemaCode: A }) => (0, Kh._)`{allowedValue: ${A}}`
}, rx = {
  keyword: "const",
  $data: !0,
  error: nx,
  code(A) {
    const { gen: e, data: t, $data: n, schemaCode: i, schema: s } = A;
    n || s && typeof s == "object" ? A.fail$data((0, Kh._)`!${(0, ex.useFunc)(e, tx.default)}(${t}, ${i})`) : A.fail((0, Kh._)`${s} !== ${t}`);
  }
};
np.default = rx;
var rp = {};
Object.defineProperty(rp, "__esModule", { value: !0 });
const Zo = ve, ix = KA, ax = Ts, ox = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: A }) => (0, Zo._)`{allowedValues: ${A}}`
}, sx = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: ox,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, schemaCode: s, it: l } = A;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const f = i.length >= l.opts.loopEnum;
    let c;
    const h = () => c ?? (c = (0, ix.useFunc)(e, ax.default));
    let w;
    if (f || n)
      w = e.let("valid"), A.block$data(w, B);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const v = e.const("vSchema", s);
      w = (0, Zo.or)(...i.map((o, C) => p(v, C)));
    }
    A.pass(w);
    function B() {
      e.assign(w, !1), e.forOf("v", s, (v) => e.if((0, Zo._)`${h()}(${t}, ${v})`, () => e.assign(w, !0).break()));
    }
    function p(v, o) {
      const C = i[o];
      return typeof C == "object" && C !== null ? (0, Zo._)`${h()}(${t}, ${v}[${o}])` : (0, Zo._)`${t} === ${C}`;
    }
  }
};
rp.default = sx;
Object.defineProperty(Xd, "__esModule", { value: !0 });
const ux = qd, lx = zd, cx = Jd, fx = Yd, hx = Zd, dx = Ap, px = ep, gx = tp, Bx = np, wx = rp, mx = [
  // number
  ux.default,
  lx.default,
  // string
  cx.default,
  fx.default,
  // object
  hx.default,
  dx.default,
  // array
  px.default,
  gx.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Bx.default,
  wx.default
];
Xd.default = mx;
var ip = {}, so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
so.validateAdditionalItems = void 0;
const qi = ve, kh = KA, vx = {
  message: ({ params: { len: A } }) => (0, qi.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, qi._)`{limit: ${A}}`
}, yx = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: vx,
  code(A) {
    const { parentSchema: e, it: t } = A, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, kh.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Fv(A, n);
  }
};
function Fv(A, e) {
  const { gen: t, schema: n, data: i, keyword: s, it: l } = A;
  l.items = !0;
  const f = t.const("len", (0, qi._)`${i}.length`);
  if (n === !1)
    A.setParams({ len: e.length }), A.pass((0, qi._)`${f} <= ${e.length}`);
  else if (typeof n == "object" && !(0, kh.alwaysValidSchema)(l, n)) {
    const h = t.var("valid", (0, qi._)`${f} <= ${e.length}`);
    t.if((0, qi.not)(h), () => c(h)), A.ok(h);
  }
  function c(h) {
    t.forRange("i", e.length, f, (w) => {
      A.subschema({ keyword: s, dataProp: w, dataPropType: kh.Type.Num }, h), l.allErrors || t.if((0, qi.not)(h), () => t.break());
    });
  }
}
so.validateAdditionalItems = Fv;
so.default = yx;
var ap = {}, uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.validateTuple = void 0;
const VB = ve, Dl = KA, Cx = me, Qx = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(A) {
    const { schema: e, it: t } = A;
    if (Array.isArray(e))
      return Uv(A, "additionalItems", e);
    t.items = !0, !(0, Dl.alwaysValidSchema)(t, e) && A.ok((0, Cx.validateArray)(A));
  }
};
function Uv(A, e, t = A.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: l, it: f } = A;
  w(i), f.opts.unevaluated && t.length && f.items !== !0 && (f.items = Dl.mergeEvaluated.items(n, t.length, f.items));
  const c = n.name("valid"), h = n.const("len", (0, VB._)`${s}.length`);
  t.forEach((B, p) => {
    (0, Dl.alwaysValidSchema)(f, B) || (n.if((0, VB._)`${h} > ${p}`, () => A.subschema({
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
uo.validateTuple = Uv;
uo.default = Qx;
Object.defineProperty(ap, "__esModule", { value: !0 });
const Fx = uo, Ux = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (A) => (0, Fx.validateTuple)(A, "items")
};
ap.default = Ux;
var op = {};
Object.defineProperty(op, "__esModule", { value: !0 });
const WB = ve, Ex = KA, bx = me, _x = so, xx = {
  message: ({ params: { len: A } }) => (0, WB.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, WB._)`{limit: ${A}}`
}, Ix = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: xx,
  code(A) {
    const { schema: e, parentSchema: t, it: n } = A, { prefixItems: i } = t;
    n.items = !0, !(0, Ex.alwaysValidSchema)(n, e) && (i ? (0, _x.validateAdditionalItems)(A, i) : A.ok((0, bx.validateArray)(A)));
  }
};
op.default = Ix;
var sp = {};
Object.defineProperty(sp, "__esModule", { value: !0 });
const wn = ve, Ju = KA, Hx = {
  message: ({ params: { min: A, max: e } }) => e === void 0 ? (0, wn.str)`must contain at least ${A} valid item(s)` : (0, wn.str)`must contain at least ${A} and no more than ${e} valid item(s)`,
  params: ({ params: { min: A, max: e } }) => e === void 0 ? (0, wn._)`{minContains: ${A}}` : (0, wn._)`{minContains: ${A}, maxContains: ${e}}`
}, Sx = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Hx,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: s } = A;
    let l, f;
    const { minContains: c, maxContains: h } = n;
    s.opts.next ? (l = c === void 0 ? 1 : c, f = h) : l = 1;
    const w = e.const("len", (0, wn._)`${i}.length`);
    if (A.setParams({ min: l, max: f }), f === void 0 && l === 0) {
      (0, Ju.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (f !== void 0 && l > f) {
      (0, Ju.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), A.fail();
      return;
    }
    if ((0, Ju.alwaysValidSchema)(s, t)) {
      let C = (0, wn._)`${w} >= ${l}`;
      f !== void 0 && (C = (0, wn._)`${C} && ${w} <= ${f}`), A.pass(C);
      return;
    }
    s.items = !0;
    const B = e.name("valid");
    f === void 0 && l === 1 ? v(B, () => e.if(B, () => e.break())) : l === 0 ? (e.let(B, !0), f !== void 0 && e.if((0, wn._)`${i}.length > 0`, p)) : (e.let(B, !1), p()), A.result(B, () => A.reset());
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
      e.code((0, wn._)`${C}++`), f === void 0 ? e.if((0, wn._)`${C} >= ${l}`, () => e.assign(B, !0).break()) : (e.if((0, wn._)`${C} > ${f}`, () => e.assign(B, !1).break()), l === 1 ? e.assign(B, !0) : e.if((0, wn._)`${C} >= ${l}`, () => e.assign(B, !0)));
    }
  }
};
sp.default = Sx;
var Ev = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.validateSchemaDeps = A.validatePropertyDeps = A.error = void 0;
  const e = ve, t = KA, n = me;
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
})(Ev);
var up = {};
Object.defineProperty(up, "__esModule", { value: !0 });
const bv = ve, Lx = KA, Tx = {
  message: "property name must be valid",
  params: ({ params: A }) => (0, bv._)`{propertyName: ${A.propertyName}}`
}, Dx = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Tx,
  code(A) {
    const { gen: e, schema: t, data: n, it: i } = A;
    if ((0, Lx.alwaysValidSchema)(i, t))
      return;
    const s = e.name("valid");
    e.forIn("key", n, (l) => {
      A.setParams({ propertyName: l }), A.subschema({
        keyword: "propertyNames",
        data: l,
        dataTypes: ["string"],
        propertyName: l,
        compositeRule: !0
      }, s), e.if((0, bv.not)(s), () => {
        A.error(!0), i.allErrors || e.break();
      });
    }), A.ok(s);
  }
};
up.default = Dx;
var Uc = {};
Object.defineProperty(Uc, "__esModule", { value: !0 });
const ju = me, Rn = ve, Ox = lr, Yu = KA, Nx = {
  message: "must NOT have additional properties",
  params: ({ params: A }) => (0, Rn._)`{additionalProperty: ${A.additionalProperty}}`
}, Mx = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Nx,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, errsCount: s, it: l } = A;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: f, opts: c } = l;
    if (l.props = !0, c.removeAdditional !== "all" && (0, Yu.alwaysValidSchema)(l, t))
      return;
    const h = (0, ju.allSchemaProperties)(n.properties), w = (0, ju.allSchemaProperties)(n.patternProperties);
    B(), A.ok((0, Rn._)`${s} === ${Ox.default.errors}`);
    function B() {
      e.forIn("key", i, (F) => {
        !h.length && !w.length ? o(F) : e.if(p(F), () => o(F));
      });
    }
    function p(F) {
      let U;
      if (h.length > 8) {
        const H = (0, Yu.schemaRefOrVal)(l, n.properties, "properties");
        U = (0, ju.isOwnProperty)(e, H, F);
      } else h.length ? U = (0, Rn.or)(...h.map((H) => (0, Rn._)`${F} === ${H}`)) : U = Rn.nil;
      return w.length && (U = (0, Rn.or)(U, ...w.map((H) => (0, Rn._)`${(0, ju.usePattern)(A, H)}.test(${F})`))), (0, Rn.not)(U);
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
    function C(F, U, H) {
      const D = {
        keyword: "additionalProperties",
        dataProp: F,
        dataPropType: Yu.Type.Str
      };
      H === !1 && Object.assign(D, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), A.subschema(D, U);
    }
  }
};
Uc.default = Mx;
var lp = {};
Object.defineProperty(lp, "__esModule", { value: !0 });
const Px = yc(), XB = me, rh = KA, qB = Uc, Rx = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: s } = A;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && qB.default.code(new Px.KeywordCxt(s, qB.default, "additionalProperties"));
    const l = (0, XB.allSchemaProperties)(t);
    for (const B of l)
      s.definedProperties.add(B);
    s.opts.unevaluated && l.length && s.props !== !0 && (s.props = rh.mergeEvaluated.props(e, (0, rh.toHash)(l), s.props));
    const f = l.filter((B) => !(0, rh.alwaysValidSchema)(s, t[B]));
    if (f.length === 0)
      return;
    const c = e.name("valid");
    for (const B of f)
      h(B) ? w(B) : (e.if((0, XB.propertyInData)(e, i, B, s.opts.ownProperties)), w(B), s.allErrors || e.else().var(c, !0), e.endIf()), A.it.definedProperties.add(B), A.ok(c);
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
lp.default = Rx;
var cp = {};
Object.defineProperty(cp, "__esModule", { value: !0 });
const zB = me, Zu = ve, JB = KA, jB = KA, Kx = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, data: n, parentSchema: i, it: s } = A, { opts: l } = s, f = (0, zB.allSchemaProperties)(t), c = f.filter((C) => (0, JB.alwaysValidSchema)(s, t[C]));
    if (f.length === 0 || c.length === f.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const h = l.strictSchema && !l.allowMatchingProperties && i.properties, w = e.name("valid");
    s.props !== !0 && !(s.props instanceof Zu.Name) && (s.props = (0, jB.evaluatedPropsToName)(e, s.props));
    const { props: B } = s;
    p();
    function p() {
      for (const C of f)
        h && v(C), s.allErrors ? o(C) : (e.var(w, !0), o(C), e.if(w));
    }
    function v(C) {
      for (const F in h)
        new RegExp(C).test(F) && (0, JB.checkStrictMode)(s, `property ${F} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function o(C) {
      e.forIn("key", n, (F) => {
        e.if((0, Zu._)`${(0, zB.usePattern)(A, C)}.test(${F})`, () => {
          const U = c.includes(C);
          U || A.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: F,
            dataPropType: jB.Type.Str
          }, w), s.opts.unevaluated && B !== !0 ? e.assign((0, Zu._)`${B}[${F}]`, !0) : !U && !s.allErrors && e.if((0, Zu.not)(w), () => e.break());
        });
      });
    }
  }
};
cp.default = Kx;
var fp = {};
Object.defineProperty(fp, "__esModule", { value: !0 });
const kx = KA, $x = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if ((0, kx.alwaysValidSchema)(n, t)) {
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
fp.default = $x;
var hp = {};
Object.defineProperty(hp, "__esModule", { value: !0 });
const Gx = me, Vx = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Gx.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
hp.default = Vx;
var dp = {};
Object.defineProperty(dp, "__esModule", { value: !0 });
const Ol = ve, Wx = KA, Xx = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: A }) => (0, Ol._)`{passingSchemas: ${A.passing}}`
}, qx = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Xx,
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
        (0, Wx.alwaysValidSchema)(i, w) ? e.var(c, !0) : p = A.subschema({
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
dp.default = qx;
var pp = {};
Object.defineProperty(pp, "__esModule", { value: !0 });
const zx = KA, Jx = {
  keyword: "allOf",
  schemaType: "array",
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    const i = e.name("valid");
    t.forEach((s, l) => {
      if ((0, zx.alwaysValidSchema)(n, s))
        return;
      const f = A.subschema({ keyword: "allOf", schemaProp: l }, i);
      A.ok(i), A.mergeEvaluated(f);
    });
  }
};
pp.default = Jx;
var gp = {};
Object.defineProperty(gp, "__esModule", { value: !0 });
const Jl = ve, _v = KA, jx = {
  message: ({ params: A }) => (0, Jl.str)`must match "${A.ifClause}" schema`,
  params: ({ params: A }) => (0, Jl._)`{failingKeyword: ${A.ifClause}}`
}, Yx = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: jx,
  code(A) {
    const { gen: e, parentSchema: t, it: n } = A;
    t.then === void 0 && t.else === void 0 && (0, _v.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = YB(n, "then"), s = YB(n, "else");
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
function YB(A, e) {
  const t = A.schema[e];
  return t !== void 0 && !(0, _v.alwaysValidSchema)(A, t);
}
gp.default = Yx;
var Bp = {};
Object.defineProperty(Bp, "__esModule", { value: !0 });
const Zx = KA, AI = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: A, parentSchema: e, it: t }) {
    e.if === void 0 && (0, Zx.checkStrictMode)(t, `"${A}" without "if" is ignored`);
  }
};
Bp.default = AI;
Object.defineProperty(ip, "__esModule", { value: !0 });
const eI = so, tI = ap, nI = uo, rI = op, iI = sp, aI = Ev, oI = up, sI = Uc, uI = lp, lI = cp, cI = fp, fI = hp, hI = dp, dI = pp, pI = gp, gI = Bp;
function BI(A = !1) {
  const e = [
    // any
    cI.default,
    fI.default,
    hI.default,
    dI.default,
    pI.default,
    gI.default,
    // object
    oI.default,
    sI.default,
    aI.default,
    uI.default,
    lI.default
  ];
  return A ? e.push(tI.default, rI.default) : e.push(eI.default, nI.default), e.push(iI.default), e;
}
ip.default = BI;
var wp = {}, mp = {};
Object.defineProperty(mp, "__esModule", { value: !0 });
const it = ve, wI = {
  message: ({ schemaCode: A }) => (0, it.str)`must match format "${A}"`,
  params: ({ schemaCode: A }) => (0, it._)`{format: ${A}}`
}, mI = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: wI,
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
      t.if((0, it._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => t.assign(F, (0, it._)`${C}.type || "string"`).assign(U, (0, it._)`${C}.validate`), () => t.assign(F, (0, it._)`"string"`).assign(U, C)), A.fail$data((0, it.or)(H(), D()));
      function H() {
        return c.strictSchema === !1 ? it.nil : (0, it._)`${l} && !${U}`;
      }
      function D() {
        const b = w.$async ? (0, it._)`(${C}.async ? await ${U}(${n}) : ${U}(${n}))` : (0, it._)`${U}(${n})`, M = (0, it._)`(typeof ${U} == "function" ? ${b} : ${U}.test(${n}))`;
        return (0, it._)`${U} && ${U} !== true && ${F} === ${e} && !${M}`;
      }
    }
    function v() {
      const o = B.formats[s];
      if (!o) {
        H();
        return;
      }
      if (o === !0)
        return;
      const [C, F, U] = D(o);
      C === e && A.pass(b());
      function H() {
        if (c.strictSchema === !1) {
          B.logger.warn(M());
          return;
        }
        throw new Error(M());
        function M() {
          return `unknown format "${s}" ignored in schema at path "${h}"`;
        }
      }
      function D(M) {
        const R = M instanceof RegExp ? (0, it.regexpCode)(M) : c.code.formats ? (0, it._)`${c.code.formats}${(0, it.getProperty)(s)}` : void 0, J = t.scopeValue("formats", { key: s, ref: M, code: R });
        return typeof M == "object" && !(M instanceof RegExp) ? [M.type || "string", M.validate, (0, it._)`${J}.validate`] : ["string", M, J];
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
mp.default = mI;
Object.defineProperty(wp, "__esModule", { value: !0 });
const vI = mp, yI = [vI.default];
wp.default = yI;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
Ya.contentVocabulary = Ya.metadataVocabulary = void 0;
Ya.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ya.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Gd, "__esModule", { value: !0 });
const CI = Vd, QI = Xd, FI = ip, UI = wp, ZB = Ya, EI = [
  CI.default,
  QI.default,
  (0, FI.default)(),
  UI.default,
  ZB.metadataVocabulary,
  ZB.contentVocabulary
];
Gd.default = EI;
var vp = {}, Ec = {};
Object.defineProperty(Ec, "__esModule", { value: !0 });
Ec.DiscrError = void 0;
var Aw;
(function(A) {
  A.Tag = "tag", A.Mapping = "mapping";
})(Aw || (Ec.DiscrError = Aw = {}));
Object.defineProperty(vp, "__esModule", { value: !0 });
const Ka = ve, $h = Ec, ew = jt, bI = oo, _I = KA, xI = {
  message: ({ params: { discrError: A, tagName: e } }) => A === $h.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: A, tag: e, tagName: t } }) => (0, Ka._)`{error: ${A}, tag: ${t}, tagValue: ${e}}`
}, II = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: xI,
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
    e.if((0, Ka._)`typeof ${h} == "string"`, () => w(), () => A.error(!1, { discrError: $h.DiscrError.Tag, tag: h, tagName: f })), A.ok(c);
    function w() {
      const v = p();
      e.if(!1);
      for (const o in v)
        e.elseIf((0, Ka._)`${h} === ${o}`), e.assign(c, B(v[o]));
      e.else(), A.error(!1, { discrError: $h.DiscrError.Mapping, tag: h, tagName: f }), e.endIf();
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
        let M = l[b];
        if (M != null && M.$ref && !(0, _I.schemaHasRulesButRef)(M, s.self.RULES)) {
          const J = M.$ref;
          if (M = ew.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, J), M instanceof ew.SchemaEnv && (M = M.schema), M === void 0)
            throw new bI.default(s.opts.uriResolver, s.baseId, J);
        }
        const R = (v = M == null ? void 0 : M.properties) === null || v === void 0 ? void 0 : v[f];
        if (typeof R != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${f}"`);
        F = F && (C || U(M)), H(R, b);
      }
      if (!F)
        throw new Error(`discriminator: "${f}" must be required`);
      return o;
      function U({ required: b }) {
        return Array.isArray(b) && b.includes(f);
      }
      function H(b, M) {
        if (b.const)
          D(b.const, M);
        else if (b.enum)
          for (const R of b.enum)
            D(R, M);
        else
          throw new Error(`discriminator: "properties/${f}" must have "const" or "enum"`);
      }
      function D(b, M) {
        if (typeof b != "string" || b in o)
          throw new Error(`discriminator: "${f}" values must be unique strings`);
        o[b] = M;
      }
    }
  }
};
vp.default = II;
const HI = "http://json-schema.org/draft-07/schema#", SI = "http://json-schema.org/draft-07/schema#", LI = "Core schema meta-schema", TI = {
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
}, DI = [
  "object",
  "boolean"
], OI = {
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
}, NI = {
  $schema: HI,
  $id: SI,
  title: LI,
  definitions: TI,
  type: DI,
  properties: OI,
  default: !0
};
(function(A, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const t = Xm, n = Gd, i = vp, s = NI, l = ["/properties"], f = "http://json-schema.org/draft-07/schema";
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
  var h = yc();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return h.KeywordCxt;
  } });
  var w = ve;
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
  var B = Md();
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return B.default;
  } });
  var p = oo;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return p.default;
  } });
})(Dh, Dh.exports);
var MI = Dh.exports;
const xv = /* @__PURE__ */ vc(MI), PI = "http://json-schema.org/draft-07/schema#", RI = "Generated schema for Root", KI = "object", kI = {
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
}, $I = [
  "genome"
], GI = {
  $schema: PI,
  title: RI,
  type: KI,
  properties: kI,
  required: $I
}, VI = new xv(), tw = VI.compile(GI), WI = function() {
  var A = function(e) {
    var i;
    if (!tw(e))
      throw console.log("annotation json:", e), console.log("Invalid data:", tw.errors), new Error("Invalid data");
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
      let n = await (await fetch(e)).json();
      return Array.isArray(n) && n.length > 0 && (n = n[0]), n.genoMapsJSON && (n = n.genoMapsJSON), A(n);
    }
  };
}, XI = "http://json-schema.org/draft-07/schema#", qI = "Generated schema for Root", zI = "object", JI = {
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
}, jI = [
  "chromosomes"
], YI = {
  $schema: XI,
  title: qI,
  type: zI,
  properties: JI,
  required: jI
}, ZI = new xv(), nw = ZI.compile(YI), AH = function() {
  var A = function(e) {
    if (!nw(e))
      throw console.log("json:", e), console.log("Invalid data:", nw.errors), new Error("Invalid data");
    var n = {};
    return n.chromosomes = e == null ? void 0 : e.chromosomes, n;
  };
  return {
    readBasemap: async function(e) {
      let n = await (await fetch(e)).json();
      return Array.isArray(n) && n.length > 0 && (n = n[0]), A(n);
    },
    readBasemapFromRawJSON: function(e) {
      return A(e);
    }
  };
}, eH = function() {
  var A = function(n) {
    if (n == null || n === "") return "#333";
    var i = String(n);
    if (i.charAt(0) === "#")
      return i.length >= 7 ? i : "#" + i.slice(1).padStart(6, "0");
    var s = new Array(8 - i.length + 1).join("0");
    let l = "#" + s + i.substring(2, i.length);
    return l == "#00FF00" && (l = "#208000"), l;
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
    return typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] data_reader: annotations.features.length =", s && s.features && s.features.length || 0, "basemap chromosomes =", i.chromosomes && i.chromosomes.length || 0), s.features.forEach(function(l) {
      l.color = A(l.color);
    }), s.features.filter(function(l) {
      return l.type.toLowerCase() === "gene";
    }).forEach(function(l, f) {
      l.globalIndex = f;
    }), i.chromosomes.forEach(function(l) {
      var f = s.features.filter(function(F) {
        return String(F.chromosome) === String(l.number);
      }), c = f.filter(function(F) {
        return F.type.toLowerCase() === "gene";
      }), h = f.filter(function(F) {
        return F.type.toLowerCase() === "qtl";
      }), w = f.filter(function(F) {
        return F.type.toLowerCase() === "snp";
      });
      typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] data_reader: chr", l.number, "features matched:", {
        total: f.length,
        genes: c.length,
        qtls: h.length,
        snps: w.length,
        firstSnpTrait: w[0] && w[0].trait,
        firstGeneTrait: c[0] && c[0].trait
      });
      var B = w.reduce(function(F, U) {
        var H = U.pvalue != null ? U.pvalue : U.pValue;
        return Math.min(F, typeof H == "number" ? H : 1);
      }, 1);
      w.forEach(function(F, U) {
        F.id = l.number + "_" + U;
        var H = F.pvalue != null ? F.pvalue : F.pValue;
        F.importance = typeof H == "number" && B > 0 ? Math.log(H) / Math.log(B) : 1;
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
      var l = AH();
      let f;
      if (s ? f = l.readBasemapFromRawJSON(n) : f = await l.readBasemap(n), i) {
        var c = WI();
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
    var t, n = "4.17.21", i = 200, s = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", f = "Invalid `variable` option passed into `_.template`", c = "__lodash_hash_undefined__", h = 500, w = "__lodash_placeholder__", B = 1, p = 2, v = 4, o = 1, C = 2, F = 1, U = 2, H = 4, D = 8, b = 16, M = 32, R = 64, J = 128, hA = 256, cA = 512, wA = 30, QA = "...", OA = 800, bA = 16, q = 1, CA = 2, iA = 3, gA = 1 / 0, IA = 9007199254740991, HA = 17976931348623157e292, uA = NaN, T = 4294967295, rA = T - 1, j = T >>> 1, S = [
      ["ary", J],
      ["bind", F],
      ["bindKey", U],
      ["curry", D],
      ["curryRight", b],
      ["flip", cA],
      ["partial", M],
      ["partialRight", R],
      ["rearg", hA]
    ], K = "[object Arguments]", aA = "[object Array]", EA = "[object AsyncFunction]", _A = "[object Boolean]", qA = "[object Date]", ZA = "[object DOMException]", X = "[object Error]", V = "[object Function]", k = "[object GeneratorFunction]", eA = "[object Map]", lA = "[object Number]", SA = "[object Null]", zA = "[object Object]", ie = "[object Promise]", Te = "[object Proxy]", we = "[object RegExp]", JA = "[object Set]", Ee = "[object String]", GA = "[object Symbol]", Ge = "[object Undefined]", Ut = "[object WeakMap]", Ot = "[object WeakSet]", Et = "[object ArrayBuffer]", Bt = "[object DataView]", un = "[object Float32Array]", dr = "[object Float64Array]", Qi = "[object Int8Array]", Gr = "[object Int16Array]", Vr = "[object Int32Array]", pA = "[object Uint8Array]", MA = "[object Uint8ClampedArray]", jA = "[object Uint16Array]", ye = "[object Uint32Array]", Ce = /\b__p \+= '';/g, ot = /\b(__p \+=) '' \+/g, bt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Un = /&(?:amp|lt|gt|quot|#39);/g, Fi = /[&<>"']/g, En = RegExp(Un.source), Ui = RegExp(Fi.source), Wr = /<%-([\s\S]+?)%>/g, ln = /<%([\s\S]+?)%>/g, Ei = /<%=([\s\S]+?)%>/g, Xr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, pr = /^\w*$/, ks = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, co = /[\\^$.*+?()[\]{}|]/g, gr = RegExp(co.source), ua = /^\s+/, bi = /\s/, $s = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Gs = /\{\n\/\* \[wrapped with (.+)\] \*/, la = /,? & /, Vs = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, ca = /[()=,{}\[\]\/\s]/, fo = /\\(\\)?/g, Ws = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, qn = /\w*$/, zn = /^[-+]0x[0-9a-f]+$/i, kc = /^0b[01]+$/i, ho = /^\[object .+?Constructor\]$/, po = /^0o[0-7]+$/i, $c = /^(?:0|[1-9]\d*)$/, Gc = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, fa = /($^)/, Vc = /['\n\r\u2028\u2029\\]/g, _i = "\\ud800-\\udfff", Xs = "\\u0300-\\u036f", qs = "\\ufe20-\\ufe2f", zs = "\\u20d0-\\u20ff", go = Xs + qs + zs, Bo = "\\u2700-\\u27bf", wo = "a-z\\xdf-\\xf6\\xf8-\\xff", Js = "\\xac\\xb1\\xd7\\xf7", _t = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", qr = "\\u2000-\\u206f", ha = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", js = "A-Z\\xc0-\\xd6\\xd8-\\xde", Ys = "\\ufe0e\\ufe0f", mo = Js + _t + qr + ha, zr = "['’]", Zs = "[" + _i + "]", Au = "[" + mo + "]", da = "[" + go + "]", Gt = "\\d+", Wc = "[" + Bo + "]", eu = "[" + wo + "]", Br = "[^" + _i + mo + Gt + Bo + wo + js + "]", pa = "\\ud83c[\\udffb-\\udfff]", bn = "(?:" + da + "|" + pa + ")", ga = "[^" + _i + "]", _n = "(?:\\ud83c[\\udde6-\\uddff]){2}", Jr = "[\\ud800-\\udbff][\\udc00-\\udfff]", jr = "[" + js + "]", tu = "\\u200d", Ba = "(?:" + eu + "|" + Br + ")", wr = "(?:" + jr + "|" + Br + ")", nu = "(?:" + zr + "(?:d|ll|m|re|s|t|ve))?", wa = "(?:" + zr + "(?:D|LL|M|RE|S|T|VE))?", ma = bn + "?", ru = "[" + Ys + "]?", Xc = "(?:" + tu + "(?:" + [ga, _n, Jr].join("|") + ")" + ru + ma + ")*", iu = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", qc = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", au = ru + ma + Xc, zc = "(?:" + [Wc, _n, Jr].join("|") + ")" + au, Jc = "(?:" + [ga + da + "?", da, _n, Jr, Zs].join("|") + ")", ou = RegExp(zr, "g"), su = RegExp(da, "g"), xi = RegExp(pa + "(?=" + pa + ")|" + Jc + au, "g"), uu = RegExp([
      jr + "?" + eu + "+" + nu + "(?=" + [Au, jr, "$"].join("|") + ")",
      wr + "+" + wa + "(?=" + [Au, jr + Ba, "$"].join("|") + ")",
      jr + "?" + Ba + "+" + nu,
      jr + "+" + wa,
      qc,
      iu,
      Gt,
      zc
    ].join("|"), "g"), vo = RegExp("[" + tu + _i + go + Ys + "]"), Yr = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, lu = [
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
    ], cu = -1, Me = {};
    Me[un] = Me[dr] = Me[Qi] = Me[Gr] = Me[Vr] = Me[pA] = Me[MA] = Me[jA] = Me[ye] = !0, Me[K] = Me[aA] = Me[Et] = Me[_A] = Me[Bt] = Me[qA] = Me[X] = Me[V] = Me[eA] = Me[lA] = Me[zA] = Me[we] = Me[JA] = Me[Ee] = Me[Ut] = !1;
    var Pe = {};
    Pe[K] = Pe[aA] = Pe[Et] = Pe[Bt] = Pe[_A] = Pe[qA] = Pe[un] = Pe[dr] = Pe[Qi] = Pe[Gr] = Pe[Vr] = Pe[eA] = Pe[lA] = Pe[zA] = Pe[we] = Pe[JA] = Pe[Ee] = Pe[GA] = Pe[pA] = Pe[MA] = Pe[jA] = Pe[ye] = !0, Pe[X] = Pe[V] = Pe[Ut] = !1;
    var jc = {
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
    }, Yc = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, Zc = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, Af = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, ef = parseFloat, fu = parseInt, hu = typeof Wi == "object" && Wi && Wi.Object === Object && Wi, tf = typeof self == "object" && self && self.Object === Object && self, Ze = hu || tf || Function("return this")(), yo = e && !e.nodeType && e, cn = yo && !0 && A && !A.nodeType && A, Zr = cn && cn.exports === yo, Ii = Zr && hu.process, Nt = function() {
      try {
        var AA = cn && cn.require && cn.require("util").types;
        return AA || Ii && Ii.binding && Ii.binding("util");
      } catch {
      }
    }(), Co = Nt && Nt.isArrayBuffer, va = Nt && Nt.isDate, Qo = Nt && Nt.isMap, Fo = Nt && Nt.isRegExp, du = Nt && Nt.isSet, pu = Nt && Nt.isTypedArray;
    function u(AA, fA, sA) {
      switch (sA.length) {
        case 0:
          return AA.call(fA);
        case 1:
          return AA.call(fA, sA[0]);
        case 2:
          return AA.call(fA, sA[0], sA[1]);
        case 3:
          return AA.call(fA, sA[0], sA[1], sA[2]);
      }
      return AA.apply(fA, sA);
    }
    function d(AA, fA, sA, PA) {
      for (var se = -1, He = AA == null ? 0 : AA.length; ++se < He; ) {
        var At = AA[se];
        fA(PA, At, sA(At), AA);
      }
      return PA;
    }
    function m(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length; ++sA < PA && fA(AA[sA], sA, AA) !== !1; )
        ;
      return AA;
    }
    function y(AA, fA) {
      for (var sA = AA == null ? 0 : AA.length; sA-- && fA(AA[sA], sA, AA) !== !1; )
        ;
      return AA;
    }
    function E(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length; ++sA < PA; )
        if (!fA(AA[sA], sA, AA))
          return !1;
      return !0;
    }
    function _(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length, se = 0, He = []; ++sA < PA; ) {
        var At = AA[sA];
        fA(At, sA, AA) && (He[se++] = At);
      }
      return He;
    }
    function I(AA, fA) {
      var sA = AA == null ? 0 : AA.length;
      return !!sA && ze(AA, fA, 0) > -1;
    }
    function P(AA, fA, sA) {
      for (var PA = -1, se = AA == null ? 0 : AA.length; ++PA < se; )
        if (sA(fA, AA[PA]))
          return !0;
      return !1;
    }
    function z(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length, se = Array(PA); ++sA < PA; )
        se[sA] = fA(AA[sA], sA, AA);
      return se;
    }
    function Y(AA, fA) {
      for (var sA = -1, PA = fA.length, se = AA.length; ++sA < PA; )
        AA[se + sA] = fA[sA];
      return AA;
    }
    function nA(AA, fA, sA, PA) {
      var se = -1, He = AA == null ? 0 : AA.length;
      for (PA && He && (sA = AA[++se]); ++se < He; )
        sA = fA(sA, AA[se], se, AA);
      return sA;
    }
    function FA(AA, fA, sA, PA) {
      var se = AA == null ? 0 : AA.length;
      for (PA && se && (sA = AA[--se]); se--; )
        sA = fA(sA, AA[se], se, AA);
      return sA;
    }
    function TA(AA, fA) {
      for (var sA = -1, PA = AA == null ? 0 : AA.length; ++sA < PA; )
        if (fA(AA[sA], sA, AA))
          return !0;
      return !1;
    }
    var UA = ce("length");
    function oe(AA) {
      return AA.split("");
    }
    function ee(AA) {
      return AA.match(Vs) || [];
    }
    function le(AA, fA, sA) {
      var PA;
      return sA(AA, function(se, He, At) {
        if (fA(se, He, At))
          return PA = He, !1;
      }), PA;
    }
    function ht(AA, fA, sA, PA) {
      for (var se = AA.length, He = sA + (PA ? 1 : -1); PA ? He-- : ++He < se; )
        if (fA(AA[He], He, AA))
          return He;
      return -1;
    }
    function ze(AA, fA, sA) {
      return fA === fA ? Fa(AA, fA, sA) : ht(AA, kA, sA);
    }
    function Jn(AA, fA, sA, PA) {
      for (var se = sA - 1, He = AA.length; ++se < He; )
        if (PA(AA[se], fA))
          return se;
      return -1;
    }
    function kA(AA) {
      return AA !== AA;
    }
    function ut(AA, fA) {
      var sA = AA == null ? 0 : AA.length;
      return sA ? xt(AA, fA) / sA : uA;
    }
    function ce(AA) {
      return function(fA) {
        return fA == null ? t : fA[AA];
      };
    }
    function Xe(AA) {
      return function(fA) {
        return AA == null ? t : AA[fA];
      };
    }
    function xn(AA, fA, sA, PA, se) {
      return se(AA, function(He, At, be) {
        sA = PA ? (PA = !1, He) : fA(sA, He, At, be);
      }), sA;
    }
    function ya(AA, fA) {
      var sA = AA.length;
      for (AA.sort(fA); sA--; )
        AA[sA] = AA[sA].value;
      return AA;
    }
    function xt(AA, fA) {
      for (var sA, PA = -1, se = AA.length; ++PA < se; ) {
        var He = fA(AA[PA]);
        He !== t && (sA = sA === t ? He : sA + He);
      }
      return sA;
    }
    function In(AA, fA) {
      for (var sA = -1, PA = Array(AA); ++sA < AA; )
        PA[sA] = fA(sA);
      return PA;
    }
    function jn(AA, fA) {
      return z(fA, function(sA) {
        return [sA, AA[sA]];
      });
    }
    function Hn(AA) {
      return AA && AA.slice(0, mu(AA) + 1).replace(ua, "");
    }
    function Re(AA) {
      return function(fA) {
        return AA(fA);
      };
    }
    function It(AA, fA) {
      return z(fA, function(sA) {
        return AA[sA];
      });
    }
    function Hi(AA, fA) {
      return AA.has(fA);
    }
    function Sn(AA, fA) {
      for (var sA = -1, PA = AA.length; ++sA < PA && ze(fA, AA[sA], 0) > -1; )
        ;
      return sA;
    }
    function Uo(AA, fA) {
      for (var sA = AA.length; sA-- && ze(fA, AA[sA], 0) > -1; )
        ;
      return sA;
    }
    function mr(AA, fA) {
      for (var sA = AA.length, PA = 0; sA--; )
        AA[sA] === fA && ++PA;
      return PA;
    }
    var Eo = Xe(jc), De = Xe(Yc);
    function vr(AA) {
      return "\\" + Af[AA];
    }
    function gu(AA, fA) {
      return AA == null ? t : AA[fA];
    }
    function Yn(AA) {
      return vo.test(AA);
    }
    function nf(AA) {
      return Yr.test(AA);
    }
    function Ca(AA) {
      for (var fA, sA = []; !(fA = AA.next()).done; )
        sA.push(fA.value);
      return sA;
    }
    function bo(AA) {
      var fA = -1, sA = Array(AA.size);
      return AA.forEach(function(PA, se) {
        sA[++fA] = [se, PA];
      }), sA;
    }
    function Bu(AA, fA) {
      return function(sA) {
        return AA(fA(sA));
      };
    }
    function Zn(AA, fA) {
      for (var sA = -1, PA = AA.length, se = 0, He = []; ++sA < PA; ) {
        var At = AA[sA];
        (At === fA || At === w) && (AA[sA] = w, He[se++] = sA);
      }
      return He;
    }
    function Qa(AA) {
      var fA = -1, sA = Array(AA.size);
      return AA.forEach(function(PA) {
        sA[++fA] = PA;
      }), sA;
    }
    function wu(AA) {
      var fA = -1, sA = Array(AA.size);
      return AA.forEach(function(PA) {
        sA[++fA] = [PA, PA];
      }), sA;
    }
    function Fa(AA, fA, sA) {
      for (var PA = sA - 1, se = AA.length; ++PA < se; )
        if (AA[PA] === fA)
          return PA;
      return -1;
    }
    function rf(AA, fA, sA) {
      for (var PA = sA + 1; PA--; )
        if (AA[PA] === fA)
          return PA;
      return PA;
    }
    function Ai(AA) {
      return Yn(AA) ? af(AA) : UA(AA);
    }
    function wt(AA) {
      return Yn(AA) ? Ln(AA) : oe(AA);
    }
    function mu(AA) {
      for (var fA = AA.length; fA-- && bi.test(AA.charAt(fA)); )
        ;
      return fA;
    }
    var _o = Xe(Zc);
    function af(AA) {
      for (var fA = xi.lastIndex = 0; xi.test(AA); )
        ++fA;
      return fA;
    }
    function Ln(AA) {
      return AA.match(xi) || [];
    }
    function Tn(AA) {
      return AA.match(uu) || [];
    }
    var vu = function AA(fA) {
      fA = fA == null ? Ze : Ie.defaults(Ze.Object(), fA, Ie.pick(Ze, lu));
      var sA = fA.Array, PA = fA.Date, se = fA.Error, He = fA.Function, At = fA.Math, be = fA.Object, Si = fA.RegExp, yu = fA.String, mt = fA.TypeError, ei = sA.prototype, xo = He.prototype, ti = be.prototype, yr = fA["__core-js_shared__"], ni = xo.toString, Se = ti.hasOwnProperty, of = 0, N = function() {
        var r = /[^.]+$/.exec(yr && yr.keys && yr.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), G = ti.toString, Z = ni.call(be), dA = Ze._, oA = Si(
        "^" + ni.call(Se).replace(co, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), yA = Zr ? fA.Buffer : t, BA = fA.Symbol, LA = fA.Uint8Array, VA = yA ? yA.allocUnsafe : t, ae = Bu(be.getPrototypeOf, be), WA = be.create, te = ti.propertyIsEnumerable, he = ei.splice, Le = BA ? BA.isConcatSpreadable : t, YA = BA ? BA.iterator : t, ke = BA ? BA.toStringTag : t, et = function() {
        try {
          var r = Mi(be, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), Mt = fA.clearTimeout !== Ze.clearTimeout && fA.clearTimeout, Ve = PA && PA.now !== Ze.Date.now && PA.now, Li = fA.setTimeout !== Ze.setTimeout && fA.setTimeout, Ar = At.ceil, dt = At.floor, sf = be.getOwnPropertySymbols, Dy = yA ? yA.isBuffer : t, Xp = fA.isFinite, Oy = ei.join, Ny = Bu(be.keys, be), lt = At.max, Ht = At.min, My = PA.now, Py = fA.parseInt, qp = At.random, Ry = ei.reverse, uf = Mi(fA, "DataView"), Io = Mi(fA, "Map"), lf = Mi(fA, "Promise"), Ua = Mi(fA, "Set"), Ho = Mi(fA, "WeakMap"), So = Mi(be, "create"), Cu = Ho && new Ho(), Ea = {}, Ky = Pi(uf), ky = Pi(Io), $y = Pi(lf), Gy = Pi(Ua), Vy = Pi(Ho), Qu = BA ? BA.prototype : t, Lo = Qu ? Qu.valueOf : t, zp = Qu ? Qu.toString : t;
      function L(r) {
        if (Ye(r) && !fe(r) && !(r instanceof Fe)) {
          if (r instanceof fn)
            return r;
          if (Se.call(r, "__wrapped__"))
            return Jg(r);
        }
        return new fn(r);
      }
      var ba = /* @__PURE__ */ function() {
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
      function Fu() {
      }
      function fn(r, a) {
        this.__wrapped__ = r, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
      }
      L.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: Wr,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: ln,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: Ei,
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
          _: L
        }
      }, L.prototype = Fu.prototype, L.prototype.constructor = L, fn.prototype = ba(Fu.prototype), fn.prototype.constructor = fn;
      function Fe(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = T, this.__views__ = [];
      }
      function Wy() {
        var r = new Fe(this.__wrapped__);
        return r.__actions__ = Vt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = Vt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = Vt(this.__views__), r;
      }
      function Xy() {
        if (this.__filtered__) {
          var r = new Fe(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function qy() {
        var r = this.__wrapped__.value(), a = this.__dir__, g = fe(r), Q = a < 0, x = g ? r.length : 0, O = aQ(0, x, this.__views__), $ = O.start, W = O.end, tA = W - $, mA = Q ? W : $ - 1, vA = this.__iteratees__, xA = vA.length, DA = 0, $A = Ht(tA, this.__takeCount__);
        if (!g || !Q && x == tA && $A == tA)
          return mg(r, this.__actions__);
        var ne = [];
        A:
          for (; tA-- && DA < $A; ) {
            mA += a;
            for (var ge = -1, re = r[mA]; ++ge < xA; ) {
              var Qe = vA[ge], _e = Qe.iteratee, nn = Qe.type, Kt = _e(re);
              if (nn == CA)
                re = Kt;
              else if (!Kt) {
                if (nn == q)
                  continue A;
                break A;
              }
            }
            ne[DA++] = re;
          }
        return ne;
      }
      Fe.prototype = ba(Fu.prototype), Fe.prototype.constructor = Fe;
      function Ti(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function zy() {
        this.__data__ = So ? So(null) : {}, this.size = 0;
      }
      function Jy(r) {
        var a = this.has(r) && delete this.__data__[r];
        return this.size -= a ? 1 : 0, a;
      }
      function jy(r) {
        var a = this.__data__;
        if (So) {
          var g = a[r];
          return g === c ? t : g;
        }
        return Se.call(a, r) ? a[r] : t;
      }
      function Yy(r) {
        var a = this.__data__;
        return So ? a[r] !== t : Se.call(a, r);
      }
      function Zy(r, a) {
        var g = this.__data__;
        return this.size += this.has(r) ? 0 : 1, g[r] = So && a === t ? c : a, this;
      }
      Ti.prototype.clear = zy, Ti.prototype.delete = Jy, Ti.prototype.get = jy, Ti.prototype.has = Yy, Ti.prototype.set = Zy;
      function Cr(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function AC() {
        this.__data__ = [], this.size = 0;
      }
      function eC(r) {
        var a = this.__data__, g = Uu(a, r);
        if (g < 0)
          return !1;
        var Q = a.length - 1;
        return g == Q ? a.pop() : he.call(a, g, 1), --this.size, !0;
      }
      function tC(r) {
        var a = this.__data__, g = Uu(a, r);
        return g < 0 ? t : a[g][1];
      }
      function nC(r) {
        return Uu(this.__data__, r) > -1;
      }
      function rC(r, a) {
        var g = this.__data__, Q = Uu(g, r);
        return Q < 0 ? (++this.size, g.push([r, a])) : g[Q][1] = a, this;
      }
      Cr.prototype.clear = AC, Cr.prototype.delete = eC, Cr.prototype.get = tC, Cr.prototype.has = nC, Cr.prototype.set = rC;
      function Qr(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.clear(); ++a < g; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function iC() {
        this.size = 0, this.__data__ = {
          hash: new Ti(),
          map: new (Io || Cr)(),
          string: new Ti()
        };
      }
      function aC(r) {
        var a = Nu(this, r).delete(r);
        return this.size -= a ? 1 : 0, a;
      }
      function oC(r) {
        return Nu(this, r).get(r);
      }
      function sC(r) {
        return Nu(this, r).has(r);
      }
      function uC(r, a) {
        var g = Nu(this, r), Q = g.size;
        return g.set(r, a), this.size += g.size == Q ? 0 : 1, this;
      }
      Qr.prototype.clear = iC, Qr.prototype.delete = aC, Qr.prototype.get = oC, Qr.prototype.has = sC, Qr.prototype.set = uC;
      function Di(r) {
        var a = -1, g = r == null ? 0 : r.length;
        for (this.__data__ = new Qr(); ++a < g; )
          this.add(r[a]);
      }
      function lC(r) {
        return this.__data__.set(r, c), this;
      }
      function cC(r) {
        return this.__data__.has(r);
      }
      Di.prototype.add = Di.prototype.push = lC, Di.prototype.has = cC;
      function Dn(r) {
        var a = this.__data__ = new Cr(r);
        this.size = a.size;
      }
      function fC() {
        this.__data__ = new Cr(), this.size = 0;
      }
      function hC(r) {
        var a = this.__data__, g = a.delete(r);
        return this.size = a.size, g;
      }
      function dC(r) {
        return this.__data__.get(r);
      }
      function pC(r) {
        return this.__data__.has(r);
      }
      function gC(r, a) {
        var g = this.__data__;
        if (g instanceof Cr) {
          var Q = g.__data__;
          if (!Io || Q.length < i - 1)
            return Q.push([r, a]), this.size = ++g.size, this;
          g = this.__data__ = new Qr(Q);
        }
        return g.set(r, a), this.size = g.size, this;
      }
      Dn.prototype.clear = fC, Dn.prototype.delete = hC, Dn.prototype.get = dC, Dn.prototype.has = pC, Dn.prototype.set = gC;
      function Jp(r, a) {
        var g = fe(r), Q = !g && Ri(r), x = !g && !Q && si(r), O = !g && !Q && !x && Ha(r), $ = g || Q || x || O, W = $ ? In(r.length, yu) : [], tA = W.length;
        for (var mA in r)
          (a || Se.call(r, mA)) && !($ && // Safari 9 has enumerable `arguments.length` in strict mode.
          (mA == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          x && (mA == "offset" || mA == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          O && (mA == "buffer" || mA == "byteLength" || mA == "byteOffset") || // Skip index properties.
          br(mA, tA))) && W.push(mA);
        return W;
      }
      function jp(r) {
        var a = r.length;
        return a ? r[yf(0, a - 1)] : t;
      }
      function BC(r, a) {
        return Mu(Vt(r), Oi(a, 0, r.length));
      }
      function wC(r) {
        return Mu(Vt(r));
      }
      function cf(r, a, g) {
        (g !== t && !On(r[a], g) || g === t && !(a in r)) && Fr(r, a, g);
      }
      function To(r, a, g) {
        var Q = r[a];
        (!(Se.call(r, a) && On(Q, g)) || g === t && !(a in r)) && Fr(r, a, g);
      }
      function Uu(r, a) {
        for (var g = r.length; g--; )
          if (On(r[g][0], a))
            return g;
        return -1;
      }
      function mC(r, a, g, Q) {
        return ri(r, function(x, O, $) {
          a(Q, x, g(x), $);
        }), Q;
      }
      function Yp(r, a) {
        return r && tr(a, pt(a), r);
      }
      function vC(r, a) {
        return r && tr(a, Xt(a), r);
      }
      function Fr(r, a, g) {
        a == "__proto__" && et ? et(r, a, {
          configurable: !0,
          enumerable: !0,
          value: g,
          writable: !0
        }) : r[a] = g;
      }
      function ff(r, a) {
        for (var g = -1, Q = a.length, x = sA(Q), O = r == null; ++g < Q; )
          x[g] = O ? t : Wf(r, a[g]);
        return x;
      }
      function Oi(r, a, g) {
        return r === r && (g !== t && (r = r <= g ? r : g), a !== t && (r = r >= a ? r : a)), r;
      }
      function hn(r, a, g, Q, x, O) {
        var $, W = a & B, tA = a & p, mA = a & v;
        if (g && ($ = x ? g(r, Q, x, O) : g(r)), $ !== t)
          return $;
        if (!je(r))
          return r;
        var vA = fe(r);
        if (vA) {
          if ($ = sQ(r), !W)
            return Vt(r, $);
        } else {
          var xA = St(r), DA = xA == V || xA == k;
          if (si(r))
            return Cg(r, W);
          if (xA == zA || xA == K || DA && !x) {
            if ($ = tA || DA ? {} : Kg(r), !W)
              return tA ? jC(r, vC($, r)) : JC(r, Yp($, r));
          } else {
            if (!Pe[xA])
              return x ? r : {};
            $ = uQ(r, xA, W);
          }
        }
        O || (O = new Dn());
        var $A = O.get(r);
        if ($A)
          return $A;
        O.set(r, $), gB(r) ? r.forEach(function(re) {
          $.add(hn(re, a, g, re, r, O));
        }) : dB(r) && r.forEach(function(re, Qe) {
          $.set(Qe, hn(re, a, g, Qe, r, O));
        });
        var ne = mA ? tA ? Sf : Hf : tA ? Xt : pt, ge = vA ? t : ne(r);
        return m(ge || r, function(re, Qe) {
          ge && (Qe = re, re = r[Qe]), To($, Qe, hn(re, a, g, Qe, r, O));
        }), $;
      }
      function yC(r) {
        var a = pt(r);
        return function(g) {
          return Zp(g, r, a);
        };
      }
      function Zp(r, a, g) {
        var Q = g.length;
        if (r == null)
          return !Q;
        for (r = be(r); Q--; ) {
          var x = g[Q], O = a[x], $ = r[x];
          if ($ === t && !(x in r) || !O($))
            return !1;
        }
        return !0;
      }
      function Ag(r, a, g) {
        if (typeof r != "function")
          throw new mt(l);
        return Ko(function() {
          r.apply(t, g);
        }, a);
      }
      function Do(r, a, g, Q) {
        var x = -1, O = I, $ = !0, W = r.length, tA = [], mA = a.length;
        if (!W)
          return tA;
        g && (a = z(a, Re(g))), Q ? (O = P, $ = !1) : a.length >= i && (O = Hi, $ = !1, a = new Di(a));
        A:
          for (; ++x < W; ) {
            var vA = r[x], xA = g == null ? vA : g(vA);
            if (vA = Q || vA !== 0 ? vA : 0, $ && xA === xA) {
              for (var DA = mA; DA--; )
                if (a[DA] === xA)
                  continue A;
              tA.push(vA);
            } else O(a, xA, Q) || tA.push(vA);
          }
        return tA;
      }
      var ri = bg(er), eg = bg(df, !0);
      function CC(r, a) {
        var g = !0;
        return ri(r, function(Q, x, O) {
          return g = !!a(Q, x, O), g;
        }), g;
      }
      function Eu(r, a, g) {
        for (var Q = -1, x = r.length; ++Q < x; ) {
          var O = r[Q], $ = a(O);
          if ($ != null && (W === t ? $ === $ && !tn($) : g($, W)))
            var W = $, tA = O;
        }
        return tA;
      }
      function QC(r, a, g, Q) {
        var x = r.length;
        for (g = de(g), g < 0 && (g = -g > x ? 0 : x + g), Q = Q === t || Q > x ? x : de(Q), Q < 0 && (Q += x), Q = g > Q ? 0 : wB(Q); g < Q; )
          r[g++] = a;
        return r;
      }
      function tg(r, a) {
        var g = [];
        return ri(r, function(Q, x, O) {
          a(Q, x, O) && g.push(Q);
        }), g;
      }
      function vt(r, a, g, Q, x) {
        var O = -1, $ = r.length;
        for (g || (g = cQ), x || (x = []); ++O < $; ) {
          var W = r[O];
          a > 0 && g(W) ? a > 1 ? vt(W, a - 1, g, Q, x) : Y(x, W) : Q || (x[x.length] = W);
        }
        return x;
      }
      var hf = _g(), ng = _g(!0);
      function er(r, a) {
        return r && hf(r, a, pt);
      }
      function df(r, a) {
        return r && ng(r, a, pt);
      }
      function bu(r, a) {
        return _(a, function(g) {
          return _r(r[g]);
        });
      }
      function Ni(r, a) {
        a = ai(a, r);
        for (var g = 0, Q = a.length; r != null && g < Q; )
          r = r[nr(a[g++])];
        return g && g == Q ? r : t;
      }
      function rg(r, a, g) {
        var Q = a(r);
        return fe(r) ? Q : Y(Q, g(r));
      }
      function Pt(r) {
        return r == null ? r === t ? Ge : SA : ke && ke in be(r) ? iQ(r) : wQ(r);
      }
      function pf(r, a) {
        return r > a;
      }
      function FC(r, a) {
        return r != null && Se.call(r, a);
      }
      function UC(r, a) {
        return r != null && a in be(r);
      }
      function EC(r, a, g) {
        return r >= Ht(a, g) && r < lt(a, g);
      }
      function gf(r, a, g) {
        for (var Q = g ? P : I, x = r[0].length, O = r.length, $ = O, W = sA(O), tA = 1 / 0, mA = []; $--; ) {
          var vA = r[$];
          $ && a && (vA = z(vA, Re(a))), tA = Ht(vA.length, tA), W[$] = !g && (a || x >= 120 && vA.length >= 120) ? new Di($ && vA) : t;
        }
        vA = r[0];
        var xA = -1, DA = W[0];
        A:
          for (; ++xA < x && mA.length < tA; ) {
            var $A = vA[xA], ne = a ? a($A) : $A;
            if ($A = g || $A !== 0 ? $A : 0, !(DA ? Hi(DA, ne) : Q(mA, ne, g))) {
              for ($ = O; --$; ) {
                var ge = W[$];
                if (!(ge ? Hi(ge, ne) : Q(r[$], ne, g)))
                  continue A;
              }
              DA && DA.push(ne), mA.push($A);
            }
          }
        return mA;
      }
      function bC(r, a, g, Q) {
        return er(r, function(x, O, $) {
          a(Q, g(x), O, $);
        }), Q;
      }
      function Oo(r, a, g) {
        a = ai(a, r), r = Vg(r, a);
        var Q = r == null ? r : r[nr(pn(a))];
        return Q == null ? t : u(Q, r, g);
      }
      function ig(r) {
        return Ye(r) && Pt(r) == K;
      }
      function _C(r) {
        return Ye(r) && Pt(r) == Et;
      }
      function xC(r) {
        return Ye(r) && Pt(r) == qA;
      }
      function No(r, a, g, Q, x) {
        return r === a ? !0 : r == null || a == null || !Ye(r) && !Ye(a) ? r !== r && a !== a : IC(r, a, g, Q, No, x);
      }
      function IC(r, a, g, Q, x, O) {
        var $ = fe(r), W = fe(a), tA = $ ? aA : St(r), mA = W ? aA : St(a);
        tA = tA == K ? zA : tA, mA = mA == K ? zA : mA;
        var vA = tA == zA, xA = mA == zA, DA = tA == mA;
        if (DA && si(r)) {
          if (!si(a))
            return !1;
          $ = !0, vA = !1;
        }
        if (DA && !vA)
          return O || (O = new Dn()), $ || Ha(r) ? Mg(r, a, g, Q, x, O) : nQ(r, a, tA, g, Q, x, O);
        if (!(g & o)) {
          var $A = vA && Se.call(r, "__wrapped__"), ne = xA && Se.call(a, "__wrapped__");
          if ($A || ne) {
            var ge = $A ? r.value() : r, re = ne ? a.value() : a;
            return O || (O = new Dn()), x(ge, re, g, Q, O);
          }
        }
        return DA ? (O || (O = new Dn()), rQ(r, a, g, Q, x, O)) : !1;
      }
      function HC(r) {
        return Ye(r) && St(r) == eA;
      }
      function Bf(r, a, g, Q) {
        var x = g.length, O = x, $ = !Q;
        if (r == null)
          return !O;
        for (r = be(r); x--; ) {
          var W = g[x];
          if ($ && W[2] ? W[1] !== r[W[0]] : !(W[0] in r))
            return !1;
        }
        for (; ++x < O; ) {
          W = g[x];
          var tA = W[0], mA = r[tA], vA = W[1];
          if ($ && W[2]) {
            if (mA === t && !(tA in r))
              return !1;
          } else {
            var xA = new Dn();
            if (Q)
              var DA = Q(mA, vA, tA, r, a, xA);
            if (!(DA === t ? No(vA, mA, o | C, Q, xA) : DA))
              return !1;
          }
        }
        return !0;
      }
      function ag(r) {
        if (!je(r) || hQ(r))
          return !1;
        var a = _r(r) ? oA : ho;
        return a.test(Pi(r));
      }
      function SC(r) {
        return Ye(r) && Pt(r) == we;
      }
      function LC(r) {
        return Ye(r) && St(r) == JA;
      }
      function TC(r) {
        return Ye(r) && Gu(r.length) && !!Me[Pt(r)];
      }
      function og(r) {
        return typeof r == "function" ? r : r == null ? qt : typeof r == "object" ? fe(r) ? lg(r[0], r[1]) : ug(r) : xB(r);
      }
      function wf(r) {
        if (!Ro(r))
          return Ny(r);
        var a = [];
        for (var g in be(r))
          Se.call(r, g) && g != "constructor" && a.push(g);
        return a;
      }
      function DC(r) {
        if (!je(r))
          return BQ(r);
        var a = Ro(r), g = [];
        for (var Q in r)
          Q == "constructor" && (a || !Se.call(r, Q)) || g.push(Q);
        return g;
      }
      function mf(r, a) {
        return r < a;
      }
      function sg(r, a) {
        var g = -1, Q = Wt(r) ? sA(r.length) : [];
        return ri(r, function(x, O, $) {
          Q[++g] = a(x, O, $);
        }), Q;
      }
      function ug(r) {
        var a = Tf(r);
        return a.length == 1 && a[0][2] ? $g(a[0][0], a[0][1]) : function(g) {
          return g === r || Bf(g, r, a);
        };
      }
      function lg(r, a) {
        return Of(r) && kg(a) ? $g(nr(r), a) : function(g) {
          var Q = Wf(g, r);
          return Q === t && Q === a ? Xf(g, r) : No(a, Q, o | C);
        };
      }
      function _u(r, a, g, Q, x) {
        r !== a && hf(a, function(O, $) {
          if (x || (x = new Dn()), je(O))
            OC(r, a, $, g, _u, Q, x);
          else {
            var W = Q ? Q(Mf(r, $), O, $ + "", r, a, x) : t;
            W === t && (W = O), cf(r, $, W);
          }
        }, Xt);
      }
      function OC(r, a, g, Q, x, O, $) {
        var W = Mf(r, g), tA = Mf(a, g), mA = $.get(tA);
        if (mA) {
          cf(r, g, mA);
          return;
        }
        var vA = O ? O(W, tA, g + "", r, a, $) : t, xA = vA === t;
        if (xA) {
          var DA = fe(tA), $A = !DA && si(tA), ne = !DA && !$A && Ha(tA);
          vA = tA, DA || $A || ne ? fe(W) ? vA = W : tt(W) ? vA = Vt(W) : $A ? (xA = !1, vA = Cg(tA, !0)) : ne ? (xA = !1, vA = Qg(tA, !0)) : vA = [] : ko(tA) || Ri(tA) ? (vA = W, Ri(W) ? vA = mB(W) : (!je(W) || _r(W)) && (vA = Kg(tA))) : xA = !1;
        }
        xA && ($.set(tA, vA), x(vA, tA, Q, O, $), $.delete(tA)), cf(r, g, vA);
      }
      function cg(r, a) {
        var g = r.length;
        if (g)
          return a += a < 0 ? g : 0, br(a, g) ? r[a] : t;
      }
      function fg(r, a, g) {
        a.length ? a = z(a, function(O) {
          return fe(O) ? function($) {
            return Ni($, O.length === 1 ? O[0] : O);
          } : O;
        }) : a = [qt];
        var Q = -1;
        a = z(a, Re(Ae()));
        var x = sg(r, function(O, $, W) {
          var tA = z(a, function(mA) {
            return mA(O);
          });
          return { criteria: tA, index: ++Q, value: O };
        });
        return ya(x, function(O, $) {
          return zC(O, $, g);
        });
      }
      function NC(r, a) {
        return hg(r, a, function(g, Q) {
          return Xf(r, Q);
        });
      }
      function hg(r, a, g) {
        for (var Q = -1, x = a.length, O = {}; ++Q < x; ) {
          var $ = a[Q], W = Ni(r, $);
          g(W, $) && Mo(O, ai($, r), W);
        }
        return O;
      }
      function MC(r) {
        return function(a) {
          return Ni(a, r);
        };
      }
      function vf(r, a, g, Q) {
        var x = Q ? Jn : ze, O = -1, $ = a.length, W = r;
        for (r === a && (a = Vt(a)), g && (W = z(r, Re(g))); ++O < $; )
          for (var tA = 0, mA = a[O], vA = g ? g(mA) : mA; (tA = x(W, vA, tA, Q)) > -1; )
            W !== r && he.call(W, tA, 1), he.call(r, tA, 1);
        return r;
      }
      function dg(r, a) {
        for (var g = r ? a.length : 0, Q = g - 1; g--; ) {
          var x = a[g];
          if (g == Q || x !== O) {
            var O = x;
            br(x) ? he.call(r, x, 1) : Ff(r, x);
          }
        }
        return r;
      }
      function yf(r, a) {
        return r + dt(qp() * (a - r + 1));
      }
      function PC(r, a, g, Q) {
        for (var x = -1, O = lt(Ar((a - r) / (g || 1)), 0), $ = sA(O); O--; )
          $[Q ? O : ++x] = r, r += g;
        return $;
      }
      function Cf(r, a) {
        var g = "";
        if (!r || a < 1 || a > IA)
          return g;
        do
          a % 2 && (g += r), a = dt(a / 2), a && (r += r);
        while (a);
        return g;
      }
      function Be(r, a) {
        return Pf(Gg(r, a, qt), r + "");
      }
      function RC(r) {
        return jp(Sa(r));
      }
      function KC(r, a) {
        var g = Sa(r);
        return Mu(g, Oi(a, 0, g.length));
      }
      function Mo(r, a, g, Q) {
        if (!je(r))
          return r;
        a = ai(a, r);
        for (var x = -1, O = a.length, $ = O - 1, W = r; W != null && ++x < O; ) {
          var tA = nr(a[x]), mA = g;
          if (tA === "__proto__" || tA === "constructor" || tA === "prototype")
            return r;
          if (x != $) {
            var vA = W[tA];
            mA = Q ? Q(vA, tA, W) : t, mA === t && (mA = je(vA) ? vA : br(a[x + 1]) ? [] : {});
          }
          To(W, tA, mA), W = W[tA];
        }
        return r;
      }
      var pg = Cu ? function(r, a) {
        return Cu.set(r, a), r;
      } : qt, kC = et ? function(r, a) {
        return et(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: zf(a),
          writable: !0
        });
      } : qt;
      function $C(r) {
        return Mu(Sa(r));
      }
      function dn(r, a, g) {
        var Q = -1, x = r.length;
        a < 0 && (a = -a > x ? 0 : x + a), g = g > x ? x : g, g < 0 && (g += x), x = a > g ? 0 : g - a >>> 0, a >>>= 0;
        for (var O = sA(x); ++Q < x; )
          O[Q] = r[Q + a];
        return O;
      }
      function GC(r, a) {
        var g;
        return ri(r, function(Q, x, O) {
          return g = a(Q, x, O), !g;
        }), !!g;
      }
      function xu(r, a, g) {
        var Q = 0, x = r == null ? Q : r.length;
        if (typeof a == "number" && a === a && x <= j) {
          for (; Q < x; ) {
            var O = Q + x >>> 1, $ = r[O];
            $ !== null && !tn($) && (g ? $ <= a : $ < a) ? Q = O + 1 : x = O;
          }
          return x;
        }
        return Qf(r, a, qt, g);
      }
      function Qf(r, a, g, Q) {
        var x = 0, O = r == null ? 0 : r.length;
        if (O === 0)
          return 0;
        a = g(a);
        for (var $ = a !== a, W = a === null, tA = tn(a), mA = a === t; x < O; ) {
          var vA = dt((x + O) / 2), xA = g(r[vA]), DA = xA !== t, $A = xA === null, ne = xA === xA, ge = tn(xA);
          if ($)
            var re = Q || ne;
          else mA ? re = ne && (Q || DA) : W ? re = ne && DA && (Q || !$A) : tA ? re = ne && DA && !$A && (Q || !ge) : $A || ge ? re = !1 : re = Q ? xA <= a : xA < a;
          re ? x = vA + 1 : O = vA;
        }
        return Ht(O, rA);
      }
      function gg(r, a) {
        for (var g = -1, Q = r.length, x = 0, O = []; ++g < Q; ) {
          var $ = r[g], W = a ? a($) : $;
          if (!g || !On(W, tA)) {
            var tA = W;
            O[x++] = $ === 0 ? 0 : $;
          }
        }
        return O;
      }
      function Bg(r) {
        return typeof r == "number" ? r : tn(r) ? uA : +r;
      }
      function en(r) {
        if (typeof r == "string")
          return r;
        if (fe(r))
          return z(r, en) + "";
        if (tn(r))
          return zp ? zp.call(r) : "";
        var a = r + "";
        return a == "0" && 1 / r == -gA ? "-0" : a;
      }
      function ii(r, a, g) {
        var Q = -1, x = I, O = r.length, $ = !0, W = [], tA = W;
        if (g)
          $ = !1, x = P;
        else if (O >= i) {
          var mA = a ? null : eQ(r);
          if (mA)
            return Qa(mA);
          $ = !1, x = Hi, tA = new Di();
        } else
          tA = a ? [] : W;
        A:
          for (; ++Q < O; ) {
            var vA = r[Q], xA = a ? a(vA) : vA;
            if (vA = g || vA !== 0 ? vA : 0, $ && xA === xA) {
              for (var DA = tA.length; DA--; )
                if (tA[DA] === xA)
                  continue A;
              a && tA.push(xA), W.push(vA);
            } else x(tA, xA, g) || (tA !== W && tA.push(xA), W.push(vA));
          }
        return W;
      }
      function Ff(r, a) {
        return a = ai(a, r), r = Vg(r, a), r == null || delete r[nr(pn(a))];
      }
      function wg(r, a, g, Q) {
        return Mo(r, a, g(Ni(r, a)), Q);
      }
      function Iu(r, a, g, Q) {
        for (var x = r.length, O = Q ? x : -1; (Q ? O-- : ++O < x) && a(r[O], O, r); )
          ;
        return g ? dn(r, Q ? 0 : O, Q ? O + 1 : x) : dn(r, Q ? O + 1 : 0, Q ? x : O);
      }
      function mg(r, a) {
        var g = r;
        return g instanceof Fe && (g = g.value()), nA(a, function(Q, x) {
          return x.func.apply(x.thisArg, Y([Q], x.args));
        }, g);
      }
      function Uf(r, a, g) {
        var Q = r.length;
        if (Q < 2)
          return Q ? ii(r[0]) : [];
        for (var x = -1, O = sA(Q); ++x < Q; )
          for (var $ = r[x], W = -1; ++W < Q; )
            W != x && (O[x] = Do(O[x] || $, r[W], a, g));
        return ii(vt(O, 1), a, g);
      }
      function vg(r, a, g) {
        for (var Q = -1, x = r.length, O = a.length, $ = {}; ++Q < x; ) {
          var W = Q < O ? a[Q] : t;
          g($, r[Q], W);
        }
        return $;
      }
      function Ef(r) {
        return tt(r) ? r : [];
      }
      function bf(r) {
        return typeof r == "function" ? r : qt;
      }
      function ai(r, a) {
        return fe(r) ? r : Of(r, a) ? [r] : zg(Oe(r));
      }
      var VC = Be;
      function oi(r, a, g) {
        var Q = r.length;
        return g = g === t ? Q : g, !a && g >= Q ? r : dn(r, a, g);
      }
      var yg = Mt || function(r) {
        return Ze.clearTimeout(r);
      };
      function Cg(r, a) {
        if (a)
          return r.slice();
        var g = r.length, Q = VA ? VA(g) : new r.constructor(g);
        return r.copy(Q), Q;
      }
      function _f(r) {
        var a = new r.constructor(r.byteLength);
        return new LA(a).set(new LA(r)), a;
      }
      function WC(r, a) {
        var g = a ? _f(r.buffer) : r.buffer;
        return new r.constructor(g, r.byteOffset, r.byteLength);
      }
      function XC(r) {
        var a = new r.constructor(r.source, qn.exec(r));
        return a.lastIndex = r.lastIndex, a;
      }
      function qC(r) {
        return Lo ? be(Lo.call(r)) : {};
      }
      function Qg(r, a) {
        var g = a ? _f(r.buffer) : r.buffer;
        return new r.constructor(g, r.byteOffset, r.length);
      }
      function Fg(r, a) {
        if (r !== a) {
          var g = r !== t, Q = r === null, x = r === r, O = tn(r), $ = a !== t, W = a === null, tA = a === a, mA = tn(a);
          if (!W && !mA && !O && r > a || O && $ && tA && !W && !mA || Q && $ && tA || !g && tA || !x)
            return 1;
          if (!Q && !O && !mA && r < a || mA && g && x && !Q && !O || W && g && x || !$ && x || !tA)
            return -1;
        }
        return 0;
      }
      function zC(r, a, g) {
        for (var Q = -1, x = r.criteria, O = a.criteria, $ = x.length, W = g.length; ++Q < $; ) {
          var tA = Fg(x[Q], O[Q]);
          if (tA) {
            if (Q >= W)
              return tA;
            var mA = g[Q];
            return tA * (mA == "desc" ? -1 : 1);
          }
        }
        return r.index - a.index;
      }
      function Ug(r, a, g, Q) {
        for (var x = -1, O = r.length, $ = g.length, W = -1, tA = a.length, mA = lt(O - $, 0), vA = sA(tA + mA), xA = !Q; ++W < tA; )
          vA[W] = a[W];
        for (; ++x < $; )
          (xA || x < O) && (vA[g[x]] = r[x]);
        for (; mA--; )
          vA[W++] = r[x++];
        return vA;
      }
      function Eg(r, a, g, Q) {
        for (var x = -1, O = r.length, $ = -1, W = g.length, tA = -1, mA = a.length, vA = lt(O - W, 0), xA = sA(vA + mA), DA = !Q; ++x < vA; )
          xA[x] = r[x];
        for (var $A = x; ++tA < mA; )
          xA[$A + tA] = a[tA];
        for (; ++$ < W; )
          (DA || x < O) && (xA[$A + g[$]] = r[x++]);
        return xA;
      }
      function Vt(r, a) {
        var g = -1, Q = r.length;
        for (a || (a = sA(Q)); ++g < Q; )
          a[g] = r[g];
        return a;
      }
      function tr(r, a, g, Q) {
        var x = !g;
        g || (g = {});
        for (var O = -1, $ = a.length; ++O < $; ) {
          var W = a[O], tA = Q ? Q(g[W], r[W], W, g, r) : t;
          tA === t && (tA = r[W]), x ? Fr(g, W, tA) : To(g, W, tA);
        }
        return g;
      }
      function JC(r, a) {
        return tr(r, Df(r), a);
      }
      function jC(r, a) {
        return tr(r, Pg(r), a);
      }
      function Hu(r, a) {
        return function(g, Q) {
          var x = fe(g) ? d : mC, O = a ? a() : {};
          return x(g, r, Ae(Q, 2), O);
        };
      }
      function _a(r) {
        return Be(function(a, g) {
          var Q = -1, x = g.length, O = x > 1 ? g[x - 1] : t, $ = x > 2 ? g[2] : t;
          for (O = r.length > 3 && typeof O == "function" ? (x--, O) : t, $ && Rt(g[0], g[1], $) && (O = x < 3 ? t : O, x = 1), a = be(a); ++Q < x; ) {
            var W = g[Q];
            W && r(a, W, Q, O);
          }
          return a;
        });
      }
      function bg(r, a) {
        return function(g, Q) {
          if (g == null)
            return g;
          if (!Wt(g))
            return r(g, Q);
          for (var x = g.length, O = a ? x : -1, $ = be(g); (a ? O-- : ++O < x) && Q($[O], O, $) !== !1; )
            ;
          return g;
        };
      }
      function _g(r) {
        return function(a, g, Q) {
          for (var x = -1, O = be(a), $ = Q(a), W = $.length; W--; ) {
            var tA = $[r ? W : ++x];
            if (g(O[tA], tA, O) === !1)
              break;
          }
          return a;
        };
      }
      function YC(r, a, g) {
        var Q = a & F, x = Po(r);
        function O() {
          var $ = this && this !== Ze && this instanceof O ? x : r;
          return $.apply(Q ? g : this, arguments);
        }
        return O;
      }
      function xg(r) {
        return function(a) {
          a = Oe(a);
          var g = Yn(a) ? wt(a) : t, Q = g ? g[0] : a.charAt(0), x = g ? oi(g, 1).join("") : a.slice(1);
          return Q[r]() + x;
        };
      }
      function xa(r) {
        return function(a) {
          return nA(bB(EB(a).replace(ou, "")), r, "");
        };
      }
      function Po(r) {
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
          var g = ba(r.prototype), Q = r.apply(g, a);
          return je(Q) ? Q : g;
        };
      }
      function ZC(r, a, g) {
        var Q = Po(r);
        function x() {
          for (var O = arguments.length, $ = sA(O), W = O, tA = Ia(x); W--; )
            $[W] = arguments[W];
          var mA = O < 3 && $[0] !== tA && $[O - 1] !== tA ? [] : Zn($, tA);
          if (O -= mA.length, O < g)
            return Tg(
              r,
              a,
              Su,
              x.placeholder,
              t,
              $,
              mA,
              t,
              t,
              g - O
            );
          var vA = this && this !== Ze && this instanceof x ? Q : r;
          return u(vA, this, $);
        }
        return x;
      }
      function Ig(r) {
        return function(a, g, Q) {
          var x = be(a);
          if (!Wt(a)) {
            var O = Ae(g, 3);
            a = pt(a), g = function(W) {
              return O(x[W], W, x);
            };
          }
          var $ = r(a, g, Q);
          return $ > -1 ? x[O ? a[$] : $] : t;
        };
      }
      function Hg(r) {
        return Er(function(a) {
          var g = a.length, Q = g, x = fn.prototype.thru;
          for (r && a.reverse(); Q--; ) {
            var O = a[Q];
            if (typeof O != "function")
              throw new mt(l);
            if (x && !$ && Ou(O) == "wrapper")
              var $ = new fn([], !0);
          }
          for (Q = $ ? Q : g; ++Q < g; ) {
            O = a[Q];
            var W = Ou(O), tA = W == "wrapper" ? Lf(O) : t;
            tA && Nf(tA[0]) && tA[1] == (J | D | M | hA) && !tA[4].length && tA[9] == 1 ? $ = $[Ou(tA[0])].apply($, tA[3]) : $ = O.length == 1 && Nf(O) ? $[W]() : $.thru(O);
          }
          return function() {
            var mA = arguments, vA = mA[0];
            if ($ && mA.length == 1 && fe(vA))
              return $.plant(vA).value();
            for (var xA = 0, DA = g ? a[xA].apply(this, mA) : vA; ++xA < g; )
              DA = a[xA].call(this, DA);
            return DA;
          };
        });
      }
      function Su(r, a, g, Q, x, O, $, W, tA, mA) {
        var vA = a & J, xA = a & F, DA = a & U, $A = a & (D | b), ne = a & cA, ge = DA ? t : Po(r);
        function re() {
          for (var Qe = arguments.length, _e = sA(Qe), nn = Qe; nn--; )
            _e[nn] = arguments[nn];
          if ($A)
            var Kt = Ia(re), rn = mr(_e, Kt);
          if (Q && (_e = Ug(_e, Q, x, $A)), O && (_e = Eg(_e, O, $, $A)), Qe -= rn, $A && Qe < mA) {
            var nt = Zn(_e, Kt);
            return Tg(
              r,
              a,
              Su,
              re.placeholder,
              g,
              _e,
              nt,
              W,
              tA,
              mA - Qe
            );
          }
          var Nn = xA ? g : this, Ir = DA ? Nn[r] : r;
          return Qe = _e.length, W ? _e = mQ(_e, W) : ne && Qe > 1 && _e.reverse(), vA && tA < Qe && (_e.length = tA), this && this !== Ze && this instanceof re && (Ir = ge || Po(Ir)), Ir.apply(Nn, _e);
        }
        return re;
      }
      function Sg(r, a) {
        return function(g, Q) {
          return bC(g, r, a(Q), {});
        };
      }
      function Lu(r, a) {
        return function(g, Q) {
          var x;
          if (g === t && Q === t)
            return a;
          if (g !== t && (x = g), Q !== t) {
            if (x === t)
              return Q;
            typeof g == "string" || typeof Q == "string" ? (g = en(g), Q = en(Q)) : (g = Bg(g), Q = Bg(Q)), x = r(g, Q);
          }
          return x;
        };
      }
      function xf(r) {
        return Er(function(a) {
          return a = z(a, Re(Ae())), Be(function(g) {
            var Q = this;
            return r(a, function(x) {
              return u(x, Q, g);
            });
          });
        });
      }
      function Tu(r, a) {
        a = a === t ? " " : en(a);
        var g = a.length;
        if (g < 2)
          return g ? Cf(a, r) : a;
        var Q = Cf(a, Ar(r / Ai(a)));
        return Yn(a) ? oi(wt(Q), 0, r).join("") : Q.slice(0, r);
      }
      function AQ(r, a, g, Q) {
        var x = a & F, O = Po(r);
        function $() {
          for (var W = -1, tA = arguments.length, mA = -1, vA = Q.length, xA = sA(vA + tA), DA = this && this !== Ze && this instanceof $ ? O : r; ++mA < vA; )
            xA[mA] = Q[mA];
          for (; tA--; )
            xA[mA++] = arguments[++W];
          return u(DA, x ? g : this, xA);
        }
        return $;
      }
      function Lg(r) {
        return function(a, g, Q) {
          return Q && typeof Q != "number" && Rt(a, g, Q) && (g = Q = t), a = xr(a), g === t ? (g = a, a = 0) : g = xr(g), Q = Q === t ? a < g ? 1 : -1 : xr(Q), PC(a, g, Q, r);
        };
      }
      function Du(r) {
        return function(a, g) {
          return typeof a == "string" && typeof g == "string" || (a = gn(a), g = gn(g)), r(a, g);
        };
      }
      function Tg(r, a, g, Q, x, O, $, W, tA, mA) {
        var vA = a & D, xA = vA ? $ : t, DA = vA ? t : $, $A = vA ? O : t, ne = vA ? t : O;
        a |= vA ? M : R, a &= ~(vA ? R : M), a & H || (a &= ~(F | U));
        var ge = [
          r,
          a,
          x,
          $A,
          xA,
          ne,
          DA,
          W,
          tA,
          mA
        ], re = g.apply(t, ge);
        return Nf(r) && Wg(re, ge), re.placeholder = Q, Xg(re, r, a);
      }
      function If(r) {
        var a = At[r];
        return function(g, Q) {
          if (g = gn(g), Q = Q == null ? 0 : Ht(de(Q), 292), Q && Xp(g)) {
            var x = (Oe(g) + "e").split("e"), O = a(x[0] + "e" + (+x[1] + Q));
            return x = (Oe(O) + "e").split("e"), +(x[0] + "e" + (+x[1] - Q));
          }
          return a(g);
        };
      }
      var eQ = Ua && 1 / Qa(new Ua([, -0]))[1] == gA ? function(r) {
        return new Ua(r);
      } : Yf;
      function Dg(r) {
        return function(a) {
          var g = St(a);
          return g == eA ? bo(a) : g == JA ? wu(a) : jn(a, r(a));
        };
      }
      function Ur(r, a, g, Q, x, O, $, W) {
        var tA = a & U;
        if (!tA && typeof r != "function")
          throw new mt(l);
        var mA = Q ? Q.length : 0;
        if (mA || (a &= ~(M | R), Q = x = t), $ = $ === t ? $ : lt(de($), 0), W = W === t ? W : de(W), mA -= x ? x.length : 0, a & R) {
          var vA = Q, xA = x;
          Q = x = t;
        }
        var DA = tA ? t : Lf(r), $A = [
          r,
          a,
          g,
          Q,
          x,
          vA,
          xA,
          O,
          $,
          W
        ];
        if (DA && gQ($A, DA), r = $A[0], a = $A[1], g = $A[2], Q = $A[3], x = $A[4], W = $A[9] = $A[9] === t ? tA ? 0 : r.length : lt($A[9] - mA, 0), !W && a & (D | b) && (a &= ~(D | b)), !a || a == F)
          var ne = YC(r, a, g);
        else a == D || a == b ? ne = ZC(r, a, W) : (a == M || a == (F | M)) && !x.length ? ne = AQ(r, a, g, Q) : ne = Su.apply(t, $A);
        var ge = DA ? pg : Wg;
        return Xg(ge(ne, $A), r, a);
      }
      function Og(r, a, g, Q) {
        return r === t || On(r, ti[g]) && !Se.call(Q, g) ? a : r;
      }
      function Ng(r, a, g, Q, x, O) {
        return je(r) && je(a) && (O.set(a, r), _u(r, a, t, Ng, O), O.delete(a)), r;
      }
      function tQ(r) {
        return ko(r) ? t : r;
      }
      function Mg(r, a, g, Q, x, O) {
        var $ = g & o, W = r.length, tA = a.length;
        if (W != tA && !($ && tA > W))
          return !1;
        var mA = O.get(r), vA = O.get(a);
        if (mA && vA)
          return mA == a && vA == r;
        var xA = -1, DA = !0, $A = g & C ? new Di() : t;
        for (O.set(r, a), O.set(a, r); ++xA < W; ) {
          var ne = r[xA], ge = a[xA];
          if (Q)
            var re = $ ? Q(ge, ne, xA, a, r, O) : Q(ne, ge, xA, r, a, O);
          if (re !== t) {
            if (re)
              continue;
            DA = !1;
            break;
          }
          if ($A) {
            if (!TA(a, function(Qe, _e) {
              if (!Hi($A, _e) && (ne === Qe || x(ne, Qe, g, Q, O)))
                return $A.push(_e);
            })) {
              DA = !1;
              break;
            }
          } else if (!(ne === ge || x(ne, ge, g, Q, O))) {
            DA = !1;
            break;
          }
        }
        return O.delete(r), O.delete(a), DA;
      }
      function nQ(r, a, g, Q, x, O, $) {
        switch (g) {
          case Bt:
            if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
              return !1;
            r = r.buffer, a = a.buffer;
          case Et:
            return !(r.byteLength != a.byteLength || !O(new LA(r), new LA(a)));
          case _A:
          case qA:
          case lA:
            return On(+r, +a);
          case X:
            return r.name == a.name && r.message == a.message;
          case we:
          case Ee:
            return r == a + "";
          case eA:
            var W = bo;
          case JA:
            var tA = Q & o;
            if (W || (W = Qa), r.size != a.size && !tA)
              return !1;
            var mA = $.get(r);
            if (mA)
              return mA == a;
            Q |= C, $.set(r, a);
            var vA = Mg(W(r), W(a), Q, x, O, $);
            return $.delete(r), vA;
          case GA:
            if (Lo)
              return Lo.call(r) == Lo.call(a);
        }
        return !1;
      }
      function rQ(r, a, g, Q, x, O) {
        var $ = g & o, W = Hf(r), tA = W.length, mA = Hf(a), vA = mA.length;
        if (tA != vA && !$)
          return !1;
        for (var xA = tA; xA--; ) {
          var DA = W[xA];
          if (!($ ? DA in a : Se.call(a, DA)))
            return !1;
        }
        var $A = O.get(r), ne = O.get(a);
        if ($A && ne)
          return $A == a && ne == r;
        var ge = !0;
        O.set(r, a), O.set(a, r);
        for (var re = $; ++xA < tA; ) {
          DA = W[xA];
          var Qe = r[DA], _e = a[DA];
          if (Q)
            var nn = $ ? Q(_e, Qe, DA, a, r, O) : Q(Qe, _e, DA, r, a, O);
          if (!(nn === t ? Qe === _e || x(Qe, _e, g, Q, O) : nn)) {
            ge = !1;
            break;
          }
          re || (re = DA == "constructor");
        }
        if (ge && !re) {
          var Kt = r.constructor, rn = a.constructor;
          Kt != rn && "constructor" in r && "constructor" in a && !(typeof Kt == "function" && Kt instanceof Kt && typeof rn == "function" && rn instanceof rn) && (ge = !1);
        }
        return O.delete(r), O.delete(a), ge;
      }
      function Er(r) {
        return Pf(Gg(r, t, Zg), r + "");
      }
      function Hf(r) {
        return rg(r, pt, Df);
      }
      function Sf(r) {
        return rg(r, Xt, Pg);
      }
      var Lf = Cu ? function(r) {
        return Cu.get(r);
      } : Yf;
      function Ou(r) {
        for (var a = r.name + "", g = Ea[a], Q = Se.call(Ea, a) ? g.length : 0; Q--; ) {
          var x = g[Q], O = x.func;
          if (O == null || O == r)
            return x.name;
        }
        return a;
      }
      function Ia(r) {
        var a = Se.call(L, "placeholder") ? L : r;
        return a.placeholder;
      }
      function Ae() {
        var r = L.iteratee || Jf;
        return r = r === Jf ? og : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Nu(r, a) {
        var g = r.__data__;
        return fQ(a) ? g[typeof a == "string" ? "string" : "hash"] : g.map;
      }
      function Tf(r) {
        for (var a = pt(r), g = a.length; g--; ) {
          var Q = a[g], x = r[Q];
          a[g] = [Q, x, kg(x)];
        }
        return a;
      }
      function Mi(r, a) {
        var g = gu(r, a);
        return ag(g) ? g : t;
      }
      function iQ(r) {
        var a = Se.call(r, ke), g = r[ke];
        try {
          r[ke] = t;
          var Q = !0;
        } catch {
        }
        var x = G.call(r);
        return Q && (a ? r[ke] = g : delete r[ke]), x;
      }
      var Df = sf ? function(r) {
        return r == null ? [] : (r = be(r), _(sf(r), function(a) {
          return te.call(r, a);
        }));
      } : Zf, Pg = sf ? function(r) {
        for (var a = []; r; )
          Y(a, Df(r)), r = ae(r);
        return a;
      } : Zf, St = Pt;
      (uf && St(new uf(new ArrayBuffer(1))) != Bt || Io && St(new Io()) != eA || lf && St(lf.resolve()) != ie || Ua && St(new Ua()) != JA || Ho && St(new Ho()) != Ut) && (St = function(r) {
        var a = Pt(r), g = a == zA ? r.constructor : t, Q = g ? Pi(g) : "";
        if (Q)
          switch (Q) {
            case Ky:
              return Bt;
            case ky:
              return eA;
            case $y:
              return ie;
            case Gy:
              return JA;
            case Vy:
              return Ut;
          }
        return a;
      });
      function aQ(r, a, g) {
        for (var Q = -1, x = g.length; ++Q < x; ) {
          var O = g[Q], $ = O.size;
          switch (O.type) {
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
      function oQ(r) {
        var a = r.match(Gs);
        return a ? a[1].split(la) : [];
      }
      function Rg(r, a, g) {
        a = ai(a, r);
        for (var Q = -1, x = a.length, O = !1; ++Q < x; ) {
          var $ = nr(a[Q]);
          if (!(O = r != null && g(r, $)))
            break;
          r = r[$];
        }
        return O || ++Q != x ? O : (x = r == null ? 0 : r.length, !!x && Gu(x) && br($, x) && (fe(r) || Ri(r)));
      }
      function sQ(r) {
        var a = r.length, g = new r.constructor(a);
        return a && typeof r[0] == "string" && Se.call(r, "index") && (g.index = r.index, g.input = r.input), g;
      }
      function Kg(r) {
        return typeof r.constructor == "function" && !Ro(r) ? ba(ae(r)) : {};
      }
      function uQ(r, a, g) {
        var Q = r.constructor;
        switch (a) {
          case Et:
            return _f(r);
          case _A:
          case qA:
            return new Q(+r);
          case Bt:
            return WC(r, g);
          case un:
          case dr:
          case Qi:
          case Gr:
          case Vr:
          case pA:
          case MA:
          case jA:
          case ye:
            return Qg(r, g);
          case eA:
            return new Q();
          case lA:
          case Ee:
            return new Q(r);
          case we:
            return XC(r);
          case JA:
            return new Q();
          case GA:
            return qC(r);
        }
      }
      function lQ(r, a) {
        var g = a.length;
        if (!g)
          return r;
        var Q = g - 1;
        return a[Q] = (g > 1 ? "& " : "") + a[Q], a = a.join(g > 2 ? ", " : " "), r.replace($s, `{
/* [wrapped with ` + a + `] */
`);
      }
      function cQ(r) {
        return fe(r) || Ri(r) || !!(Le && r && r[Le]);
      }
      function br(r, a) {
        var g = typeof r;
        return a = a ?? IA, !!a && (g == "number" || g != "symbol" && $c.test(r)) && r > -1 && r % 1 == 0 && r < a;
      }
      function Rt(r, a, g) {
        if (!je(g))
          return !1;
        var Q = typeof a;
        return (Q == "number" ? Wt(g) && br(a, g.length) : Q == "string" && a in g) ? On(g[a], r) : !1;
      }
      function Of(r, a) {
        if (fe(r))
          return !1;
        var g = typeof r;
        return g == "number" || g == "symbol" || g == "boolean" || r == null || tn(r) ? !0 : pr.test(r) || !Xr.test(r) || a != null && r in be(a);
      }
      function fQ(r) {
        var a = typeof r;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
      }
      function Nf(r) {
        var a = Ou(r), g = L[a];
        if (typeof g != "function" || !(a in Fe.prototype))
          return !1;
        if (r === g)
          return !0;
        var Q = Lf(g);
        return !!Q && r === Q[0];
      }
      function hQ(r) {
        return !!N && N in r;
      }
      var dQ = yr ? _r : Ah;
      function Ro(r) {
        var a = r && r.constructor, g = typeof a == "function" && a.prototype || ti;
        return r === g;
      }
      function kg(r) {
        return r === r && !je(r);
      }
      function $g(r, a) {
        return function(g) {
          return g == null ? !1 : g[r] === a && (a !== t || r in be(g));
        };
      }
      function pQ(r) {
        var a = ku(r, function(Q) {
          return g.size === h && g.clear(), Q;
        }), g = a.cache;
        return a;
      }
      function gQ(r, a) {
        var g = r[1], Q = a[1], x = g | Q, O = x < (F | U | J), $ = Q == J && g == D || Q == J && g == hA && r[7].length <= a[8] || Q == (J | hA) && a[7].length <= a[8] && g == D;
        if (!(O || $))
          return r;
        Q & F && (r[2] = a[2], x |= g & F ? 0 : H);
        var W = a[3];
        if (W) {
          var tA = r[3];
          r[3] = tA ? Ug(tA, W, a[4]) : W, r[4] = tA ? Zn(r[3], w) : a[4];
        }
        return W = a[5], W && (tA = r[5], r[5] = tA ? Eg(tA, W, a[6]) : W, r[6] = tA ? Zn(r[5], w) : a[6]), W = a[7], W && (r[7] = W), Q & J && (r[8] = r[8] == null ? a[8] : Ht(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = x, r;
      }
      function BQ(r) {
        var a = [];
        if (r != null)
          for (var g in be(r))
            a.push(g);
        return a;
      }
      function wQ(r) {
        return G.call(r);
      }
      function Gg(r, a, g) {
        return a = lt(a === t ? r.length - 1 : a, 0), function() {
          for (var Q = arguments, x = -1, O = lt(Q.length - a, 0), $ = sA(O); ++x < O; )
            $[x] = Q[a + x];
          x = -1;
          for (var W = sA(a + 1); ++x < a; )
            W[x] = Q[x];
          return W[a] = g($), u(r, this, W);
        };
      }
      function Vg(r, a) {
        return a.length < 2 ? r : Ni(r, dn(a, 0, -1));
      }
      function mQ(r, a) {
        for (var g = r.length, Q = Ht(a.length, g), x = Vt(r); Q--; ) {
          var O = a[Q];
          r[Q] = br(O, g) ? x[O] : t;
        }
        return r;
      }
      function Mf(r, a) {
        if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
          return r[a];
      }
      var Wg = qg(pg), Ko = Li || function(r, a) {
        return Ze.setTimeout(r, a);
      }, Pf = qg(kC);
      function Xg(r, a, g) {
        var Q = a + "";
        return Pf(r, lQ(Q, vQ(oQ(Q), g)));
      }
      function qg(r) {
        var a = 0, g = 0;
        return function() {
          var Q = My(), x = bA - (Q - g);
          if (g = Q, x > 0) {
            if (++a >= OA)
              return arguments[0];
          } else
            a = 0;
          return r.apply(t, arguments);
        };
      }
      function Mu(r, a) {
        var g = -1, Q = r.length, x = Q - 1;
        for (a = a === t ? Q : a; ++g < a; ) {
          var O = yf(g, x), $ = r[O];
          r[O] = r[g], r[g] = $;
        }
        return r.length = a, r;
      }
      var zg = pQ(function(r) {
        var a = [];
        return r.charCodeAt(0) === 46 && a.push(""), r.replace(ks, function(g, Q, x, O) {
          a.push(x ? O.replace(fo, "$1") : Q || g);
        }), a;
      });
      function nr(r) {
        if (typeof r == "string" || tn(r))
          return r;
        var a = r + "";
        return a == "0" && 1 / r == -gA ? "-0" : a;
      }
      function Pi(r) {
        if (r != null) {
          try {
            return ni.call(r);
          } catch {
          }
          try {
            return r + "";
          } catch {
          }
        }
        return "";
      }
      function vQ(r, a) {
        return m(S, function(g) {
          var Q = "_." + g[0];
          a & g[1] && !I(r, Q) && r.push(Q);
        }), r.sort();
      }
      function Jg(r) {
        if (r instanceof Fe)
          return r.clone();
        var a = new fn(r.__wrapped__, r.__chain__);
        return a.__actions__ = Vt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
      }
      function yQ(r, a, g) {
        (g ? Rt(r, a, g) : a === t) ? a = 1 : a = lt(de(a), 0);
        var Q = r == null ? 0 : r.length;
        if (!Q || a < 1)
          return [];
        for (var x = 0, O = 0, $ = sA(Ar(Q / a)); x < Q; )
          $[O++] = dn(r, x, x += a);
        return $;
      }
      function CQ(r) {
        for (var a = -1, g = r == null ? 0 : r.length, Q = 0, x = []; ++a < g; ) {
          var O = r[a];
          O && (x[Q++] = O);
        }
        return x;
      }
      function QQ() {
        var r = arguments.length;
        if (!r)
          return [];
        for (var a = sA(r - 1), g = arguments[0], Q = r; Q--; )
          a[Q - 1] = arguments[Q];
        return Y(fe(g) ? Vt(g) : [g], vt(a, 1));
      }
      var FQ = Be(function(r, a) {
        return tt(r) ? Do(r, vt(a, 1, tt, !0)) : [];
      }), UQ = Be(function(r, a) {
        var g = pn(a);
        return tt(g) && (g = t), tt(r) ? Do(r, vt(a, 1, tt, !0), Ae(g, 2)) : [];
      }), EQ = Be(function(r, a) {
        var g = pn(a);
        return tt(g) && (g = t), tt(r) ? Do(r, vt(a, 1, tt, !0), t, g) : [];
      });
      function bQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : de(a), dn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function _Q(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : de(a), a = Q - a, dn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function xQ(r, a) {
        return r && r.length ? Iu(r, Ae(a, 3), !0, !0) : [];
      }
      function IQ(r, a) {
        return r && r.length ? Iu(r, Ae(a, 3), !0) : [];
      }
      function HQ(r, a, g, Q) {
        var x = r == null ? 0 : r.length;
        return x ? (g && typeof g != "number" && Rt(r, a, g) && (g = 0, Q = x), QC(r, a, g, Q)) : [];
      }
      function jg(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = g == null ? 0 : de(g);
        return x < 0 && (x = lt(Q + x, 0)), ht(r, Ae(a, 3), x);
      }
      function Yg(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = Q - 1;
        return g !== t && (x = de(g), x = g < 0 ? lt(Q + x, 0) : Ht(x, Q - 1)), ht(r, Ae(a, 3), x, !0);
      }
      function Zg(r) {
        var a = r == null ? 0 : r.length;
        return a ? vt(r, 1) : [];
      }
      function SQ(r) {
        var a = r == null ? 0 : r.length;
        return a ? vt(r, gA) : [];
      }
      function LQ(r, a) {
        var g = r == null ? 0 : r.length;
        return g ? (a = a === t ? 1 : de(a), vt(r, a)) : [];
      }
      function TQ(r) {
        for (var a = -1, g = r == null ? 0 : r.length, Q = {}; ++a < g; ) {
          var x = r[a];
          Q[x[0]] = x[1];
        }
        return Q;
      }
      function AB(r) {
        return r && r.length ? r[0] : t;
      }
      function DQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = g == null ? 0 : de(g);
        return x < 0 && (x = lt(Q + x, 0)), ze(r, a, x);
      }
      function OQ(r) {
        var a = r == null ? 0 : r.length;
        return a ? dn(r, 0, -1) : [];
      }
      var NQ = Be(function(r) {
        var a = z(r, Ef);
        return a.length && a[0] === r[0] ? gf(a) : [];
      }), MQ = Be(function(r) {
        var a = pn(r), g = z(r, Ef);
        return a === pn(g) ? a = t : g.pop(), g.length && g[0] === r[0] ? gf(g, Ae(a, 2)) : [];
      }), PQ = Be(function(r) {
        var a = pn(r), g = z(r, Ef);
        return a = typeof a == "function" ? a : t, a && g.pop(), g.length && g[0] === r[0] ? gf(g, t, a) : [];
      });
      function RQ(r, a) {
        return r == null ? "" : Oy.call(r, a);
      }
      function pn(r) {
        var a = r == null ? 0 : r.length;
        return a ? r[a - 1] : t;
      }
      function KQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = Q;
        return g !== t && (x = de(g), x = x < 0 ? lt(Q + x, 0) : Ht(x, Q - 1)), a === a ? rf(r, a, x) : ht(r, kA, x, !0);
      }
      function kQ(r, a) {
        return r && r.length ? cg(r, de(a)) : t;
      }
      var $Q = Be(eB);
      function eB(r, a) {
        return r && r.length && a && a.length ? vf(r, a) : r;
      }
      function GQ(r, a, g) {
        return r && r.length && a && a.length ? vf(r, a, Ae(g, 2)) : r;
      }
      function VQ(r, a, g) {
        return r && r.length && a && a.length ? vf(r, a, t, g) : r;
      }
      var WQ = Er(function(r, a) {
        var g = r == null ? 0 : r.length, Q = ff(r, a);
        return dg(r, z(a, function(x) {
          return br(x, g) ? +x : x;
        }).sort(Fg)), Q;
      });
      function XQ(r, a) {
        var g = [];
        if (!(r && r.length))
          return g;
        var Q = -1, x = [], O = r.length;
        for (a = Ae(a, 3); ++Q < O; ) {
          var $ = r[Q];
          a($, Q, r) && (g.push($), x.push(Q));
        }
        return dg(r, x), g;
      }
      function Rf(r) {
        return r == null ? r : Ry.call(r);
      }
      function qQ(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (g && typeof g != "number" && Rt(r, a, g) ? (a = 0, g = Q) : (a = a == null ? 0 : de(a), g = g === t ? Q : de(g)), dn(r, a, g)) : [];
      }
      function zQ(r, a) {
        return xu(r, a);
      }
      function JQ(r, a, g) {
        return Qf(r, a, Ae(g, 2));
      }
      function jQ(r, a) {
        var g = r == null ? 0 : r.length;
        if (g) {
          var Q = xu(r, a);
          if (Q < g && On(r[Q], a))
            return Q;
        }
        return -1;
      }
      function YQ(r, a) {
        return xu(r, a, !0);
      }
      function ZQ(r, a, g) {
        return Qf(r, a, Ae(g, 2), !0);
      }
      function AF(r, a) {
        var g = r == null ? 0 : r.length;
        if (g) {
          var Q = xu(r, a, !0) - 1;
          if (On(r[Q], a))
            return Q;
        }
        return -1;
      }
      function eF(r) {
        return r && r.length ? gg(r) : [];
      }
      function tF(r, a) {
        return r && r.length ? gg(r, Ae(a, 2)) : [];
      }
      function nF(r) {
        var a = r == null ? 0 : r.length;
        return a ? dn(r, 1, a) : [];
      }
      function rF(r, a, g) {
        return r && r.length ? (a = g || a === t ? 1 : de(a), dn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function iF(r, a, g) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = g || a === t ? 1 : de(a), a = Q - a, dn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function aF(r, a) {
        return r && r.length ? Iu(r, Ae(a, 3), !1, !0) : [];
      }
      function oF(r, a) {
        return r && r.length ? Iu(r, Ae(a, 3)) : [];
      }
      var sF = Be(function(r) {
        return ii(vt(r, 1, tt, !0));
      }), uF = Be(function(r) {
        var a = pn(r);
        return tt(a) && (a = t), ii(vt(r, 1, tt, !0), Ae(a, 2));
      }), lF = Be(function(r) {
        var a = pn(r);
        return a = typeof a == "function" ? a : t, ii(vt(r, 1, tt, !0), t, a);
      });
      function cF(r) {
        return r && r.length ? ii(r) : [];
      }
      function fF(r, a) {
        return r && r.length ? ii(r, Ae(a, 2)) : [];
      }
      function hF(r, a) {
        return a = typeof a == "function" ? a : t, r && r.length ? ii(r, t, a) : [];
      }
      function Kf(r) {
        if (!(r && r.length))
          return [];
        var a = 0;
        return r = _(r, function(g) {
          if (tt(g))
            return a = lt(g.length, a), !0;
        }), In(a, function(g) {
          return z(r, ce(g));
        });
      }
      function tB(r, a) {
        if (!(r && r.length))
          return [];
        var g = Kf(r);
        return a == null ? g : z(g, function(Q) {
          return u(a, t, Q);
        });
      }
      var dF = Be(function(r, a) {
        return tt(r) ? Do(r, a) : [];
      }), pF = Be(function(r) {
        return Uf(_(r, tt));
      }), gF = Be(function(r) {
        var a = pn(r);
        return tt(a) && (a = t), Uf(_(r, tt), Ae(a, 2));
      }), BF = Be(function(r) {
        var a = pn(r);
        return a = typeof a == "function" ? a : t, Uf(_(r, tt), t, a);
      }), wF = Be(Kf);
      function mF(r, a) {
        return vg(r || [], a || [], To);
      }
      function vF(r, a) {
        return vg(r || [], a || [], Mo);
      }
      var yF = Be(function(r) {
        var a = r.length, g = a > 1 ? r[a - 1] : t;
        return g = typeof g == "function" ? (r.pop(), g) : t, tB(r, g);
      });
      function nB(r) {
        var a = L(r);
        return a.__chain__ = !0, a;
      }
      function CF(r, a) {
        return a(r), r;
      }
      function Pu(r, a) {
        return a(r);
      }
      var QF = Er(function(r) {
        var a = r.length, g = a ? r[0] : 0, Q = this.__wrapped__, x = function(O) {
          return ff(O, r);
        };
        return a > 1 || this.__actions__.length || !(Q instanceof Fe) || !br(g) ? this.thru(x) : (Q = Q.slice(g, +g + (a ? 1 : 0)), Q.__actions__.push({
          func: Pu,
          args: [x],
          thisArg: t
        }), new fn(Q, this.__chain__).thru(function(O) {
          return a && !O.length && O.push(t), O;
        }));
      });
      function FF() {
        return nB(this);
      }
      function UF() {
        return new fn(this.value(), this.__chain__);
      }
      function EF() {
        this.__values__ === t && (this.__values__ = BB(this.value()));
        var r = this.__index__ >= this.__values__.length, a = r ? t : this.__values__[this.__index__++];
        return { done: r, value: a };
      }
      function bF() {
        return this;
      }
      function _F(r) {
        for (var a, g = this; g instanceof Fu; ) {
          var Q = Jg(g);
          Q.__index__ = 0, Q.__values__ = t, a ? x.__wrapped__ = Q : a = Q;
          var x = Q;
          g = g.__wrapped__;
        }
        return x.__wrapped__ = r, a;
      }
      function xF() {
        var r = this.__wrapped__;
        if (r instanceof Fe) {
          var a = r;
          return this.__actions__.length && (a = new Fe(this)), a = a.reverse(), a.__actions__.push({
            func: Pu,
            args: [Rf],
            thisArg: t
          }), new fn(a, this.__chain__);
        }
        return this.thru(Rf);
      }
      function IF() {
        return mg(this.__wrapped__, this.__actions__);
      }
      var HF = Hu(function(r, a, g) {
        Se.call(r, g) ? ++r[g] : Fr(r, g, 1);
      });
      function SF(r, a, g) {
        var Q = fe(r) ? E : CC;
        return g && Rt(r, a, g) && (a = t), Q(r, Ae(a, 3));
      }
      function LF(r, a) {
        var g = fe(r) ? _ : tg;
        return g(r, Ae(a, 3));
      }
      var TF = Ig(jg), DF = Ig(Yg);
      function OF(r, a) {
        return vt(Ru(r, a), 1);
      }
      function NF(r, a) {
        return vt(Ru(r, a), gA);
      }
      function MF(r, a, g) {
        return g = g === t ? 1 : de(g), vt(Ru(r, a), g);
      }
      function rB(r, a) {
        var g = fe(r) ? m : ri;
        return g(r, Ae(a, 3));
      }
      function iB(r, a) {
        var g = fe(r) ? y : eg;
        return g(r, Ae(a, 3));
      }
      var PF = Hu(function(r, a, g) {
        Se.call(r, g) ? r[g].push(a) : Fr(r, g, [a]);
      });
      function RF(r, a, g, Q) {
        r = Wt(r) ? r : Sa(r), g = g && !Q ? de(g) : 0;
        var x = r.length;
        return g < 0 && (g = lt(x + g, 0)), Vu(r) ? g <= x && r.indexOf(a, g) > -1 : !!x && ze(r, a, g) > -1;
      }
      var KF = Be(function(r, a, g) {
        var Q = -1, x = typeof a == "function", O = Wt(r) ? sA(r.length) : [];
        return ri(r, function($) {
          O[++Q] = x ? u(a, $, g) : Oo($, a, g);
        }), O;
      }), kF = Hu(function(r, a, g) {
        Fr(r, g, a);
      });
      function Ru(r, a) {
        var g = fe(r) ? z : sg;
        return g(r, Ae(a, 3));
      }
      function $F(r, a, g, Q) {
        return r == null ? [] : (fe(a) || (a = a == null ? [] : [a]), g = Q ? t : g, fe(g) || (g = g == null ? [] : [g]), fg(r, a, g));
      }
      var GF = Hu(function(r, a, g) {
        r[g ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function VF(r, a, g) {
        var Q = fe(r) ? nA : xn, x = arguments.length < 3;
        return Q(r, Ae(a, 4), g, x, ri);
      }
      function WF(r, a, g) {
        var Q = fe(r) ? FA : xn, x = arguments.length < 3;
        return Q(r, Ae(a, 4), g, x, eg);
      }
      function XF(r, a) {
        var g = fe(r) ? _ : tg;
        return g(r, $u(Ae(a, 3)));
      }
      function qF(r) {
        var a = fe(r) ? jp : RC;
        return a(r);
      }
      function zF(r, a, g) {
        (g ? Rt(r, a, g) : a === t) ? a = 1 : a = de(a);
        var Q = fe(r) ? BC : KC;
        return Q(r, a);
      }
      function JF(r) {
        var a = fe(r) ? wC : $C;
        return a(r);
      }
      function jF(r) {
        if (r == null)
          return 0;
        if (Wt(r))
          return Vu(r) ? Ai(r) : r.length;
        var a = St(r);
        return a == eA || a == JA ? r.size : wf(r).length;
      }
      function YF(r, a, g) {
        var Q = fe(r) ? TA : GC;
        return g && Rt(r, a, g) && (a = t), Q(r, Ae(a, 3));
      }
      var ZF = Be(function(r, a) {
        if (r == null)
          return [];
        var g = a.length;
        return g > 1 && Rt(r, a[0], a[1]) ? a = [] : g > 2 && Rt(a[0], a[1], a[2]) && (a = [a[0]]), fg(r, vt(a, 1), []);
      }), Ku = Ve || function() {
        return Ze.Date.now();
      };
      function AU(r, a) {
        if (typeof a != "function")
          throw new mt(l);
        return r = de(r), function() {
          if (--r < 1)
            return a.apply(this, arguments);
        };
      }
      function aB(r, a, g) {
        return a = g ? t : a, a = r && a == null ? r.length : a, Ur(r, J, t, t, t, t, a);
      }
      function oB(r, a) {
        var g;
        if (typeof a != "function")
          throw new mt(l);
        return r = de(r), function() {
          return --r > 0 && (g = a.apply(this, arguments)), r <= 1 && (a = t), g;
        };
      }
      var kf = Be(function(r, a, g) {
        var Q = F;
        if (g.length) {
          var x = Zn(g, Ia(kf));
          Q |= M;
        }
        return Ur(r, Q, a, g, x);
      }), sB = Be(function(r, a, g) {
        var Q = F | U;
        if (g.length) {
          var x = Zn(g, Ia(sB));
          Q |= M;
        }
        return Ur(a, Q, r, g, x);
      });
      function uB(r, a, g) {
        a = g ? t : a;
        var Q = Ur(r, D, t, t, t, t, t, a);
        return Q.placeholder = uB.placeholder, Q;
      }
      function lB(r, a, g) {
        a = g ? t : a;
        var Q = Ur(r, b, t, t, t, t, t, a);
        return Q.placeholder = lB.placeholder, Q;
      }
      function cB(r, a, g) {
        var Q, x, O, $, W, tA, mA = 0, vA = !1, xA = !1, DA = !0;
        if (typeof r != "function")
          throw new mt(l);
        a = gn(a) || 0, je(g) && (vA = !!g.leading, xA = "maxWait" in g, O = xA ? lt(gn(g.maxWait) || 0, a) : O, DA = "trailing" in g ? !!g.trailing : DA);
        function $A(nt) {
          var Nn = Q, Ir = x;
          return Q = x = t, mA = nt, $ = r.apply(Ir, Nn), $;
        }
        function ne(nt) {
          return mA = nt, W = Ko(Qe, a), vA ? $A(nt) : $;
        }
        function ge(nt) {
          var Nn = nt - tA, Ir = nt - mA, IB = a - Nn;
          return xA ? Ht(IB, O - Ir) : IB;
        }
        function re(nt) {
          var Nn = nt - tA, Ir = nt - mA;
          return tA === t || Nn >= a || Nn < 0 || xA && Ir >= O;
        }
        function Qe() {
          var nt = Ku();
          if (re(nt))
            return _e(nt);
          W = Ko(Qe, ge(nt));
        }
        function _e(nt) {
          return W = t, DA && Q ? $A(nt) : (Q = x = t, $);
        }
        function nn() {
          W !== t && yg(W), mA = 0, Q = tA = x = W = t;
        }
        function Kt() {
          return W === t ? $ : _e(Ku());
        }
        function rn() {
          var nt = Ku(), Nn = re(nt);
          if (Q = arguments, x = this, tA = nt, Nn) {
            if (W === t)
              return ne(tA);
            if (xA)
              return yg(W), W = Ko(Qe, a), $A(tA);
          }
          return W === t && (W = Ko(Qe, a)), $;
        }
        return rn.cancel = nn, rn.flush = Kt, rn;
      }
      var eU = Be(function(r, a) {
        return Ag(r, 1, a);
      }), tU = Be(function(r, a, g) {
        return Ag(r, gn(a) || 0, g);
      });
      function nU(r) {
        return Ur(r, cA);
      }
      function ku(r, a) {
        if (typeof r != "function" || a != null && typeof a != "function")
          throw new mt(l);
        var g = function() {
          var Q = arguments, x = a ? a.apply(this, Q) : Q[0], O = g.cache;
          if (O.has(x))
            return O.get(x);
          var $ = r.apply(this, Q);
          return g.cache = O.set(x, $) || O, $;
        };
        return g.cache = new (ku.Cache || Qr)(), g;
      }
      ku.Cache = Qr;
      function $u(r) {
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
      function rU(r) {
        return oB(2, r);
      }
      var iU = VC(function(r, a) {
        a = a.length == 1 && fe(a[0]) ? z(a[0], Re(Ae())) : z(vt(a, 1), Re(Ae()));
        var g = a.length;
        return Be(function(Q) {
          for (var x = -1, O = Ht(Q.length, g); ++x < O; )
            Q[x] = a[x].call(this, Q[x]);
          return u(r, this, Q);
        });
      }), $f = Be(function(r, a) {
        var g = Zn(a, Ia($f));
        return Ur(r, M, t, a, g);
      }), fB = Be(function(r, a) {
        var g = Zn(a, Ia(fB));
        return Ur(r, R, t, a, g);
      }), aU = Er(function(r, a) {
        return Ur(r, hA, t, t, t, a);
      });
      function oU(r, a) {
        if (typeof r != "function")
          throw new mt(l);
        return a = a === t ? a : de(a), Be(r, a);
      }
      function sU(r, a) {
        if (typeof r != "function")
          throw new mt(l);
        return a = a == null ? 0 : lt(de(a), 0), Be(function(g) {
          var Q = g[a], x = oi(g, 0, a);
          return Q && Y(x, Q), u(r, this, x);
        });
      }
      function uU(r, a, g) {
        var Q = !0, x = !0;
        if (typeof r != "function")
          throw new mt(l);
        return je(g) && (Q = "leading" in g ? !!g.leading : Q, x = "trailing" in g ? !!g.trailing : x), cB(r, a, {
          leading: Q,
          maxWait: a,
          trailing: x
        });
      }
      function lU(r) {
        return aB(r, 1);
      }
      function cU(r, a) {
        return $f(bf(a), r);
      }
      function fU() {
        if (!arguments.length)
          return [];
        var r = arguments[0];
        return fe(r) ? r : [r];
      }
      function hU(r) {
        return hn(r, v);
      }
      function dU(r, a) {
        return a = typeof a == "function" ? a : t, hn(r, v, a);
      }
      function pU(r) {
        return hn(r, B | v);
      }
      function gU(r, a) {
        return a = typeof a == "function" ? a : t, hn(r, B | v, a);
      }
      function BU(r, a) {
        return a == null || Zp(r, a, pt(a));
      }
      function On(r, a) {
        return r === a || r !== r && a !== a;
      }
      var wU = Du(pf), mU = Du(function(r, a) {
        return r >= a;
      }), Ri = ig(/* @__PURE__ */ function() {
        return arguments;
      }()) ? ig : function(r) {
        return Ye(r) && Se.call(r, "callee") && !te.call(r, "callee");
      }, fe = sA.isArray, vU = Co ? Re(Co) : _C;
      function Wt(r) {
        return r != null && Gu(r.length) && !_r(r);
      }
      function tt(r) {
        return Ye(r) && Wt(r);
      }
      function yU(r) {
        return r === !0 || r === !1 || Ye(r) && Pt(r) == _A;
      }
      var si = Dy || Ah, CU = va ? Re(va) : xC;
      function QU(r) {
        return Ye(r) && r.nodeType === 1 && !ko(r);
      }
      function FU(r) {
        if (r == null)
          return !0;
        if (Wt(r) && (fe(r) || typeof r == "string" || typeof r.splice == "function" || si(r) || Ha(r) || Ri(r)))
          return !r.length;
        var a = St(r);
        if (a == eA || a == JA)
          return !r.size;
        if (Ro(r))
          return !wf(r).length;
        for (var g in r)
          if (Se.call(r, g))
            return !1;
        return !0;
      }
      function UU(r, a) {
        return No(r, a);
      }
      function EU(r, a, g) {
        g = typeof g == "function" ? g : t;
        var Q = g ? g(r, a) : t;
        return Q === t ? No(r, a, t, g) : !!Q;
      }
      function Gf(r) {
        if (!Ye(r))
          return !1;
        var a = Pt(r);
        return a == X || a == ZA || typeof r.message == "string" && typeof r.name == "string" && !ko(r);
      }
      function bU(r) {
        return typeof r == "number" && Xp(r);
      }
      function _r(r) {
        if (!je(r))
          return !1;
        var a = Pt(r);
        return a == V || a == k || a == EA || a == Te;
      }
      function hB(r) {
        return typeof r == "number" && r == de(r);
      }
      function Gu(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= IA;
      }
      function je(r) {
        var a = typeof r;
        return r != null && (a == "object" || a == "function");
      }
      function Ye(r) {
        return r != null && typeof r == "object";
      }
      var dB = Qo ? Re(Qo) : HC;
      function _U(r, a) {
        return r === a || Bf(r, a, Tf(a));
      }
      function xU(r, a, g) {
        return g = typeof g == "function" ? g : t, Bf(r, a, Tf(a), g);
      }
      function IU(r) {
        return pB(r) && r != +r;
      }
      function HU(r) {
        if (dQ(r))
          throw new se(s);
        return ag(r);
      }
      function SU(r) {
        return r === null;
      }
      function LU(r) {
        return r == null;
      }
      function pB(r) {
        return typeof r == "number" || Ye(r) && Pt(r) == lA;
      }
      function ko(r) {
        if (!Ye(r) || Pt(r) != zA)
          return !1;
        var a = ae(r);
        if (a === null)
          return !0;
        var g = Se.call(a, "constructor") && a.constructor;
        return typeof g == "function" && g instanceof g && ni.call(g) == Z;
      }
      var Vf = Fo ? Re(Fo) : SC;
      function TU(r) {
        return hB(r) && r >= -IA && r <= IA;
      }
      var gB = du ? Re(du) : LC;
      function Vu(r) {
        return typeof r == "string" || !fe(r) && Ye(r) && Pt(r) == Ee;
      }
      function tn(r) {
        return typeof r == "symbol" || Ye(r) && Pt(r) == GA;
      }
      var Ha = pu ? Re(pu) : TC;
      function DU(r) {
        return r === t;
      }
      function OU(r) {
        return Ye(r) && St(r) == Ut;
      }
      function NU(r) {
        return Ye(r) && Pt(r) == Ot;
      }
      var MU = Du(mf), PU = Du(function(r, a) {
        return r <= a;
      });
      function BB(r) {
        if (!r)
          return [];
        if (Wt(r))
          return Vu(r) ? wt(r) : Vt(r);
        if (YA && r[YA])
          return Ca(r[YA]());
        var a = St(r), g = a == eA ? bo : a == JA ? Qa : Sa;
        return g(r);
      }
      function xr(r) {
        if (!r)
          return r === 0 ? r : 0;
        if (r = gn(r), r === gA || r === -gA) {
          var a = r < 0 ? -1 : 1;
          return a * HA;
        }
        return r === r ? r : 0;
      }
      function de(r) {
        var a = xr(r), g = a % 1;
        return a === a ? g ? a - g : a : 0;
      }
      function wB(r) {
        return r ? Oi(de(r), 0, T) : 0;
      }
      function gn(r) {
        if (typeof r == "number")
          return r;
        if (tn(r))
          return uA;
        if (je(r)) {
          var a = typeof r.valueOf == "function" ? r.valueOf() : r;
          r = je(a) ? a + "" : a;
        }
        if (typeof r != "string")
          return r === 0 ? r : +r;
        r = Hn(r);
        var g = kc.test(r);
        return g || po.test(r) ? fu(r.slice(2), g ? 2 : 8) : zn.test(r) ? uA : +r;
      }
      function mB(r) {
        return tr(r, Xt(r));
      }
      function RU(r) {
        return r ? Oi(de(r), -IA, IA) : r === 0 ? r : 0;
      }
      function Oe(r) {
        return r == null ? "" : en(r);
      }
      var KU = _a(function(r, a) {
        if (Ro(a) || Wt(a)) {
          tr(a, pt(a), r);
          return;
        }
        for (var g in a)
          Se.call(a, g) && To(r, g, a[g]);
      }), vB = _a(function(r, a) {
        tr(a, Xt(a), r);
      }), Wu = _a(function(r, a, g, Q) {
        tr(a, Xt(a), r, Q);
      }), kU = _a(function(r, a, g, Q) {
        tr(a, pt(a), r, Q);
      }), $U = Er(ff);
      function GU(r, a) {
        var g = ba(r);
        return a == null ? g : Yp(g, a);
      }
      var VU = Be(function(r, a) {
        r = be(r);
        var g = -1, Q = a.length, x = Q > 2 ? a[2] : t;
        for (x && Rt(a[0], a[1], x) && (Q = 1); ++g < Q; )
          for (var O = a[g], $ = Xt(O), W = -1, tA = $.length; ++W < tA; ) {
            var mA = $[W], vA = r[mA];
            (vA === t || On(vA, ti[mA]) && !Se.call(r, mA)) && (r[mA] = O[mA]);
          }
        return r;
      }), WU = Be(function(r) {
        return r.push(t, Ng), u(yB, t, r);
      });
      function XU(r, a) {
        return le(r, Ae(a, 3), er);
      }
      function qU(r, a) {
        return le(r, Ae(a, 3), df);
      }
      function zU(r, a) {
        return r == null ? r : hf(r, Ae(a, 3), Xt);
      }
      function JU(r, a) {
        return r == null ? r : ng(r, Ae(a, 3), Xt);
      }
      function jU(r, a) {
        return r && er(r, Ae(a, 3));
      }
      function YU(r, a) {
        return r && df(r, Ae(a, 3));
      }
      function ZU(r) {
        return r == null ? [] : bu(r, pt(r));
      }
      function AE(r) {
        return r == null ? [] : bu(r, Xt(r));
      }
      function Wf(r, a, g) {
        var Q = r == null ? t : Ni(r, a);
        return Q === t ? g : Q;
      }
      function eE(r, a) {
        return r != null && Rg(r, a, FC);
      }
      function Xf(r, a) {
        return r != null && Rg(r, a, UC);
      }
      var tE = Sg(function(r, a, g) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), r[a] = g;
      }, zf(qt)), nE = Sg(function(r, a, g) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), Se.call(r, a) ? r[a].push(g) : r[a] = [g];
      }, Ae), rE = Be(Oo);
      function pt(r) {
        return Wt(r) ? Jp(r) : wf(r);
      }
      function Xt(r) {
        return Wt(r) ? Jp(r, !0) : DC(r);
      }
      function iE(r, a) {
        var g = {};
        return a = Ae(a, 3), er(r, function(Q, x, O) {
          Fr(g, a(Q, x, O), Q);
        }), g;
      }
      function aE(r, a) {
        var g = {};
        return a = Ae(a, 3), er(r, function(Q, x, O) {
          Fr(g, x, a(Q, x, O));
        }), g;
      }
      var oE = _a(function(r, a, g) {
        _u(r, a, g);
      }), yB = _a(function(r, a, g, Q) {
        _u(r, a, g, Q);
      }), sE = Er(function(r, a) {
        var g = {};
        if (r == null)
          return g;
        var Q = !1;
        a = z(a, function(O) {
          return O = ai(O, r), Q || (Q = O.length > 1), O;
        }), tr(r, Sf(r), g), Q && (g = hn(g, B | p | v, tQ));
        for (var x = a.length; x--; )
          Ff(g, a[x]);
        return g;
      });
      function uE(r, a) {
        return CB(r, $u(Ae(a)));
      }
      var lE = Er(function(r, a) {
        return r == null ? {} : NC(r, a);
      });
      function CB(r, a) {
        if (r == null)
          return {};
        var g = z(Sf(r), function(Q) {
          return [Q];
        });
        return a = Ae(a), hg(r, g, function(Q, x) {
          return a(Q, x[0]);
        });
      }
      function cE(r, a, g) {
        a = ai(a, r);
        var Q = -1, x = a.length;
        for (x || (x = 1, r = t); ++Q < x; ) {
          var O = r == null ? t : r[nr(a[Q])];
          O === t && (Q = x, O = g), r = _r(O) ? O.call(r) : O;
        }
        return r;
      }
      function fE(r, a, g) {
        return r == null ? r : Mo(r, a, g);
      }
      function hE(r, a, g, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Mo(r, a, g, Q);
      }
      var QB = Dg(pt), FB = Dg(Xt);
      function dE(r, a, g) {
        var Q = fe(r), x = Q || si(r) || Ha(r);
        if (a = Ae(a, 4), g == null) {
          var O = r && r.constructor;
          x ? g = Q ? new O() : [] : je(r) ? g = _r(O) ? ba(ae(r)) : {} : g = {};
        }
        return (x ? m : er)(r, function($, W, tA) {
          return a(g, $, W, tA);
        }), g;
      }
      function pE(r, a) {
        return r == null ? !0 : Ff(r, a);
      }
      function gE(r, a, g) {
        return r == null ? r : wg(r, a, bf(g));
      }
      function BE(r, a, g, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : wg(r, a, bf(g), Q);
      }
      function Sa(r) {
        return r == null ? [] : It(r, pt(r));
      }
      function wE(r) {
        return r == null ? [] : It(r, Xt(r));
      }
      function mE(r, a, g) {
        return g === t && (g = a, a = t), g !== t && (g = gn(g), g = g === g ? g : 0), a !== t && (a = gn(a), a = a === a ? a : 0), Oi(gn(r), a, g);
      }
      function vE(r, a, g) {
        return a = xr(a), g === t ? (g = a, a = 0) : g = xr(g), r = gn(r), EC(r, a, g);
      }
      function yE(r, a, g) {
        if (g && typeof g != "boolean" && Rt(r, a, g) && (a = g = t), g === t && (typeof a == "boolean" ? (g = a, a = t) : typeof r == "boolean" && (g = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = xr(r), a === t ? (a = r, r = 0) : a = xr(a)), r > a) {
          var Q = r;
          r = a, a = Q;
        }
        if (g || r % 1 || a % 1) {
          var x = qp();
          return Ht(r + x * (a - r + ef("1e-" + ((x + "").length - 1))), a);
        }
        return yf(r, a);
      }
      var CE = xa(function(r, a, g) {
        return a = a.toLowerCase(), r + (g ? UB(a) : a);
      });
      function UB(r) {
        return qf(Oe(r).toLowerCase());
      }
      function EB(r) {
        return r = Oe(r), r && r.replace(Gc, Eo).replace(su, "");
      }
      function QE(r, a, g) {
        r = Oe(r), a = en(a);
        var Q = r.length;
        g = g === t ? Q : Oi(de(g), 0, Q);
        var x = g;
        return g -= a.length, g >= 0 && r.slice(g, x) == a;
      }
      function FE(r) {
        return r = Oe(r), r && Ui.test(r) ? r.replace(Fi, De) : r;
      }
      function UE(r) {
        return r = Oe(r), r && gr.test(r) ? r.replace(co, "\\$&") : r;
      }
      var EE = xa(function(r, a, g) {
        return r + (g ? "-" : "") + a.toLowerCase();
      }), bE = xa(function(r, a, g) {
        return r + (g ? " " : "") + a.toLowerCase();
      }), _E = xg("toLowerCase");
      function xE(r, a, g) {
        r = Oe(r), a = de(a);
        var Q = a ? Ai(r) : 0;
        if (!a || Q >= a)
          return r;
        var x = (a - Q) / 2;
        return Tu(dt(x), g) + r + Tu(Ar(x), g);
      }
      function IE(r, a, g) {
        r = Oe(r), a = de(a);
        var Q = a ? Ai(r) : 0;
        return a && Q < a ? r + Tu(a - Q, g) : r;
      }
      function HE(r, a, g) {
        r = Oe(r), a = de(a);
        var Q = a ? Ai(r) : 0;
        return a && Q < a ? Tu(a - Q, g) + r : r;
      }
      function SE(r, a, g) {
        return g || a == null ? a = 0 : a && (a = +a), Py(Oe(r).replace(ua, ""), a || 0);
      }
      function LE(r, a, g) {
        return (g ? Rt(r, a, g) : a === t) ? a = 1 : a = de(a), Cf(Oe(r), a);
      }
      function TE() {
        var r = arguments, a = Oe(r[0]);
        return r.length < 3 ? a : a.replace(r[1], r[2]);
      }
      var DE = xa(function(r, a, g) {
        return r + (g ? "_" : "") + a.toLowerCase();
      });
      function OE(r, a, g) {
        return g && typeof g != "number" && Rt(r, a, g) && (a = g = t), g = g === t ? T : g >>> 0, g ? (r = Oe(r), r && (typeof a == "string" || a != null && !Vf(a)) && (a = en(a), !a && Yn(r)) ? oi(wt(r), 0, g) : r.split(a, g)) : [];
      }
      var NE = xa(function(r, a, g) {
        return r + (g ? " " : "") + qf(a);
      });
      function ME(r, a, g) {
        return r = Oe(r), g = g == null ? 0 : Oi(de(g), 0, r.length), a = en(a), r.slice(g, g + a.length) == a;
      }
      function PE(r, a, g) {
        var Q = L.templateSettings;
        g && Rt(r, a, g) && (a = t), r = Oe(r), a = Wu({}, a, Q, Og);
        var x = Wu({}, a.imports, Q.imports, Og), O = pt(x), $ = It(x, O), W, tA, mA = 0, vA = a.interpolate || fa, xA = "__p += '", DA = Si(
          (a.escape || fa).source + "|" + vA.source + "|" + (vA === Ei ? Ws : fa).source + "|" + (a.evaluate || fa).source + "|$",
          "g"
        ), $A = "//# sourceURL=" + (Se.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++cu + "]") + `
`;
        r.replace(DA, function(re, Qe, _e, nn, Kt, rn) {
          return _e || (_e = nn), xA += r.slice(mA, rn).replace(Vc, vr), Qe && (W = !0, xA += `' +
__e(` + Qe + `) +
'`), Kt && (tA = !0, xA += `';
` + Kt + `;
__p += '`), _e && (xA += `' +
((__t = (` + _e + `)) == null ? '' : __t) +
'`), mA = rn + re.length, re;
        }), xA += `';
`;
        var ne = Se.call(a, "variable") && a.variable;
        if (!ne)
          xA = `with (obj) {
` + xA + `
}
`;
        else if (ca.test(ne))
          throw new se(f);
        xA = (tA ? xA.replace(Ce, "") : xA).replace(ot, "$1").replace(bt, "$1;"), xA = "function(" + (ne || "obj") + `) {
` + (ne ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (W ? ", __e = _.escape" : "") + (tA ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + xA + `return __p
}`;
        var ge = _B(function() {
          return He(O, $A + "return " + xA).apply(t, $);
        });
        if (ge.source = xA, Gf(ge))
          throw ge;
        return ge;
      }
      function RE(r) {
        return Oe(r).toLowerCase();
      }
      function KE(r) {
        return Oe(r).toUpperCase();
      }
      function kE(r, a, g) {
        if (r = Oe(r), r && (g || a === t))
          return Hn(r);
        if (!r || !(a = en(a)))
          return r;
        var Q = wt(r), x = wt(a), O = Sn(Q, x), $ = Uo(Q, x) + 1;
        return oi(Q, O, $).join("");
      }
      function $E(r, a, g) {
        if (r = Oe(r), r && (g || a === t))
          return r.slice(0, mu(r) + 1);
        if (!r || !(a = en(a)))
          return r;
        var Q = wt(r), x = Uo(Q, wt(a)) + 1;
        return oi(Q, 0, x).join("");
      }
      function GE(r, a, g) {
        if (r = Oe(r), r && (g || a === t))
          return r.replace(ua, "");
        if (!r || !(a = en(a)))
          return r;
        var Q = wt(r), x = Sn(Q, wt(a));
        return oi(Q, x).join("");
      }
      function VE(r, a) {
        var g = wA, Q = QA;
        if (je(a)) {
          var x = "separator" in a ? a.separator : x;
          g = "length" in a ? de(a.length) : g, Q = "omission" in a ? en(a.omission) : Q;
        }
        r = Oe(r);
        var O = r.length;
        if (Yn(r)) {
          var $ = wt(r);
          O = $.length;
        }
        if (g >= O)
          return r;
        var W = g - Ai(Q);
        if (W < 1)
          return Q;
        var tA = $ ? oi($, 0, W).join("") : r.slice(0, W);
        if (x === t)
          return tA + Q;
        if ($ && (W += tA.length - W), Vf(x)) {
          if (r.slice(W).search(x)) {
            var mA, vA = tA;
            for (x.global || (x = Si(x.source, Oe(qn.exec(x)) + "g")), x.lastIndex = 0; mA = x.exec(vA); )
              var xA = mA.index;
            tA = tA.slice(0, xA === t ? W : xA);
          }
        } else if (r.indexOf(en(x), W) != W) {
          var DA = tA.lastIndexOf(x);
          DA > -1 && (tA = tA.slice(0, DA));
        }
        return tA + Q;
      }
      function WE(r) {
        return r = Oe(r), r && En.test(r) ? r.replace(Un, _o) : r;
      }
      var XE = xa(function(r, a, g) {
        return r + (g ? " " : "") + a.toUpperCase();
      }), qf = xg("toUpperCase");
      function bB(r, a, g) {
        return r = Oe(r), a = g ? t : a, a === t ? nf(r) ? Tn(r) : ee(r) : r.match(a) || [];
      }
      var _B = Be(function(r, a) {
        try {
          return u(r, t, a);
        } catch (g) {
          return Gf(g) ? g : new se(g);
        }
      }), qE = Er(function(r, a) {
        return m(a, function(g) {
          g = nr(g), Fr(r, g, kf(r[g], r));
        }), r;
      });
      function zE(r) {
        var a = r == null ? 0 : r.length, g = Ae();
        return r = a ? z(r, function(Q) {
          if (typeof Q[1] != "function")
            throw new mt(l);
          return [g(Q[0]), Q[1]];
        }) : [], Be(function(Q) {
          for (var x = -1; ++x < a; ) {
            var O = r[x];
            if (u(O[0], this, Q))
              return u(O[1], this, Q);
          }
        });
      }
      function JE(r) {
        return yC(hn(r, B));
      }
      function zf(r) {
        return function() {
          return r;
        };
      }
      function jE(r, a) {
        return r == null || r !== r ? a : r;
      }
      var YE = Hg(), ZE = Hg(!0);
      function qt(r) {
        return r;
      }
      function Jf(r) {
        return og(typeof r == "function" ? r : hn(r, B));
      }
      function Ab(r) {
        return ug(hn(r, B));
      }
      function eb(r, a) {
        return lg(r, hn(a, B));
      }
      var tb = Be(function(r, a) {
        return function(g) {
          return Oo(g, r, a);
        };
      }), nb = Be(function(r, a) {
        return function(g) {
          return Oo(r, g, a);
        };
      });
      function jf(r, a, g) {
        var Q = pt(a), x = bu(a, Q);
        g == null && !(je(a) && (x.length || !Q.length)) && (g = a, a = r, r = this, x = bu(a, pt(a)));
        var O = !(je(g) && "chain" in g) || !!g.chain, $ = _r(r);
        return m(x, function(W) {
          var tA = a[W];
          r[W] = tA, $ && (r.prototype[W] = function() {
            var mA = this.__chain__;
            if (O || mA) {
              var vA = r(this.__wrapped__), xA = vA.__actions__ = Vt(this.__actions__);
              return xA.push({ func: tA, args: arguments, thisArg: r }), vA.__chain__ = mA, vA;
            }
            return tA.apply(r, Y([this.value()], arguments));
          });
        }), r;
      }
      function rb() {
        return Ze._ === this && (Ze._ = dA), this;
      }
      function Yf() {
      }
      function ib(r) {
        return r = de(r), Be(function(a) {
          return cg(a, r);
        });
      }
      var ab = xf(z), ob = xf(E), sb = xf(TA);
      function xB(r) {
        return Of(r) ? ce(nr(r)) : MC(r);
      }
      function ub(r) {
        return function(a) {
          return r == null ? t : Ni(r, a);
        };
      }
      var lb = Lg(), cb = Lg(!0);
      function Zf() {
        return [];
      }
      function Ah() {
        return !1;
      }
      function fb() {
        return {};
      }
      function hb() {
        return "";
      }
      function db() {
        return !0;
      }
      function pb(r, a) {
        if (r = de(r), r < 1 || r > IA)
          return [];
        var g = T, Q = Ht(r, T);
        a = Ae(a), r -= T;
        for (var x = In(Q, a); ++g < r; )
          a(g);
        return x;
      }
      function gb(r) {
        return fe(r) ? z(r, nr) : tn(r) ? [r] : Vt(zg(Oe(r)));
      }
      function Bb(r) {
        var a = ++of;
        return Oe(r) + a;
      }
      var wb = Lu(function(r, a) {
        return r + a;
      }, 0), mb = If("ceil"), vb = Lu(function(r, a) {
        return r / a;
      }, 1), yb = If("floor");
      function Cb(r) {
        return r && r.length ? Eu(r, qt, pf) : t;
      }
      function Qb(r, a) {
        return r && r.length ? Eu(r, Ae(a, 2), pf) : t;
      }
      function Fb(r) {
        return ut(r, qt);
      }
      function Ub(r, a) {
        return ut(r, Ae(a, 2));
      }
      function Eb(r) {
        return r && r.length ? Eu(r, qt, mf) : t;
      }
      function bb(r, a) {
        return r && r.length ? Eu(r, Ae(a, 2), mf) : t;
      }
      var _b = Lu(function(r, a) {
        return r * a;
      }, 1), xb = If("round"), Ib = Lu(function(r, a) {
        return r - a;
      }, 0);
      function Hb(r) {
        return r && r.length ? xt(r, qt) : 0;
      }
      function Sb(r, a) {
        return r && r.length ? xt(r, Ae(a, 2)) : 0;
      }
      return L.after = AU, L.ary = aB, L.assign = KU, L.assignIn = vB, L.assignInWith = Wu, L.assignWith = kU, L.at = $U, L.before = oB, L.bind = kf, L.bindAll = qE, L.bindKey = sB, L.castArray = fU, L.chain = nB, L.chunk = yQ, L.compact = CQ, L.concat = QQ, L.cond = zE, L.conforms = JE, L.constant = zf, L.countBy = HF, L.create = GU, L.curry = uB, L.curryRight = lB, L.debounce = cB, L.defaults = VU, L.defaultsDeep = WU, L.defer = eU, L.delay = tU, L.difference = FQ, L.differenceBy = UQ, L.differenceWith = EQ, L.drop = bQ, L.dropRight = _Q, L.dropRightWhile = xQ, L.dropWhile = IQ, L.fill = HQ, L.filter = LF, L.flatMap = OF, L.flatMapDeep = NF, L.flatMapDepth = MF, L.flatten = Zg, L.flattenDeep = SQ, L.flattenDepth = LQ, L.flip = nU, L.flow = YE, L.flowRight = ZE, L.fromPairs = TQ, L.functions = ZU, L.functionsIn = AE, L.groupBy = PF, L.initial = OQ, L.intersection = NQ, L.intersectionBy = MQ, L.intersectionWith = PQ, L.invert = tE, L.invertBy = nE, L.invokeMap = KF, L.iteratee = Jf, L.keyBy = kF, L.keys = pt, L.keysIn = Xt, L.map = Ru, L.mapKeys = iE, L.mapValues = aE, L.matches = Ab, L.matchesProperty = eb, L.memoize = ku, L.merge = oE, L.mergeWith = yB, L.method = tb, L.methodOf = nb, L.mixin = jf, L.negate = $u, L.nthArg = ib, L.omit = sE, L.omitBy = uE, L.once = rU, L.orderBy = $F, L.over = ab, L.overArgs = iU, L.overEvery = ob, L.overSome = sb, L.partial = $f, L.partialRight = fB, L.partition = GF, L.pick = lE, L.pickBy = CB, L.property = xB, L.propertyOf = ub, L.pull = $Q, L.pullAll = eB, L.pullAllBy = GQ, L.pullAllWith = VQ, L.pullAt = WQ, L.range = lb, L.rangeRight = cb, L.rearg = aU, L.reject = XF, L.remove = XQ, L.rest = oU, L.reverse = Rf, L.sampleSize = zF, L.set = fE, L.setWith = hE, L.shuffle = JF, L.slice = qQ, L.sortBy = ZF, L.sortedUniq = eF, L.sortedUniqBy = tF, L.split = OE, L.spread = sU, L.tail = nF, L.take = rF, L.takeRight = iF, L.takeRightWhile = aF, L.takeWhile = oF, L.tap = CF, L.throttle = uU, L.thru = Pu, L.toArray = BB, L.toPairs = QB, L.toPairsIn = FB, L.toPath = gb, L.toPlainObject = mB, L.transform = dE, L.unary = lU, L.union = sF, L.unionBy = uF, L.unionWith = lF, L.uniq = cF, L.uniqBy = fF, L.uniqWith = hF, L.unset = pE, L.unzip = Kf, L.unzipWith = tB, L.update = gE, L.updateWith = BE, L.values = Sa, L.valuesIn = wE, L.without = dF, L.words = bB, L.wrap = cU, L.xor = pF, L.xorBy = gF, L.xorWith = BF, L.zip = wF, L.zipObject = mF, L.zipObjectDeep = vF, L.zipWith = yF, L.entries = QB, L.entriesIn = FB, L.extend = vB, L.extendWith = Wu, jf(L, L), L.add = wb, L.attempt = _B, L.camelCase = CE, L.capitalize = UB, L.ceil = mb, L.clamp = mE, L.clone = hU, L.cloneDeep = pU, L.cloneDeepWith = gU, L.cloneWith = dU, L.conformsTo = BU, L.deburr = EB, L.defaultTo = jE, L.divide = vb, L.endsWith = QE, L.eq = On, L.escape = FE, L.escapeRegExp = UE, L.every = SF, L.find = TF, L.findIndex = jg, L.findKey = XU, L.findLast = DF, L.findLastIndex = Yg, L.findLastKey = qU, L.floor = yb, L.forEach = rB, L.forEachRight = iB, L.forIn = zU, L.forInRight = JU, L.forOwn = jU, L.forOwnRight = YU, L.get = Wf, L.gt = wU, L.gte = mU, L.has = eE, L.hasIn = Xf, L.head = AB, L.identity = qt, L.includes = RF, L.indexOf = DQ, L.inRange = vE, L.invoke = rE, L.isArguments = Ri, L.isArray = fe, L.isArrayBuffer = vU, L.isArrayLike = Wt, L.isArrayLikeObject = tt, L.isBoolean = yU, L.isBuffer = si, L.isDate = CU, L.isElement = QU, L.isEmpty = FU, L.isEqual = UU, L.isEqualWith = EU, L.isError = Gf, L.isFinite = bU, L.isFunction = _r, L.isInteger = hB, L.isLength = Gu, L.isMap = dB, L.isMatch = _U, L.isMatchWith = xU, L.isNaN = IU, L.isNative = HU, L.isNil = LU, L.isNull = SU, L.isNumber = pB, L.isObject = je, L.isObjectLike = Ye, L.isPlainObject = ko, L.isRegExp = Vf, L.isSafeInteger = TU, L.isSet = gB, L.isString = Vu, L.isSymbol = tn, L.isTypedArray = Ha, L.isUndefined = DU, L.isWeakMap = OU, L.isWeakSet = NU, L.join = RQ, L.kebabCase = EE, L.last = pn, L.lastIndexOf = KQ, L.lowerCase = bE, L.lowerFirst = _E, L.lt = MU, L.lte = PU, L.max = Cb, L.maxBy = Qb, L.mean = Fb, L.meanBy = Ub, L.min = Eb, L.minBy = bb, L.stubArray = Zf, L.stubFalse = Ah, L.stubObject = fb, L.stubString = hb, L.stubTrue = db, L.multiply = _b, L.nth = kQ, L.noConflict = rb, L.noop = Yf, L.now = Ku, L.pad = xE, L.padEnd = IE, L.padStart = HE, L.parseInt = SE, L.random = yE, L.reduce = VF, L.reduceRight = WF, L.repeat = LE, L.replace = TE, L.result = cE, L.round = xb, L.runInContext = AA, L.sample = qF, L.size = jF, L.snakeCase = DE, L.some = YF, L.sortedIndex = zQ, L.sortedIndexBy = JQ, L.sortedIndexOf = jQ, L.sortedLastIndex = YQ, L.sortedLastIndexBy = ZQ, L.sortedLastIndexOf = AF, L.startCase = NE, L.startsWith = ME, L.subtract = Ib, L.sum = Hb, L.sumBy = Sb, L.template = PE, L.times = pb, L.toFinite = xr, L.toInteger = de, L.toLength = wB, L.toLower = RE, L.toNumber = gn, L.toSafeInteger = RU, L.toString = Oe, L.toUpper = KE, L.trim = kE, L.trimEnd = $E, L.trimStart = GE, L.truncate = VE, L.unescape = WE, L.uniqueId = Bb, L.upperCase = XE, L.upperFirst = qf, L.each = rB, L.eachRight = iB, L.first = AB, jf(L, function() {
        var r = {};
        return er(L, function(a, g) {
          Se.call(L.prototype, g) || (r[g] = a);
        }), r;
      }(), { chain: !1 }), L.VERSION = n, m(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        L[r].placeholder = L;
      }), m(["drop", "take"], function(r, a) {
        Fe.prototype[r] = function(g) {
          g = g === t ? 1 : lt(de(g), 0);
          var Q = this.__filtered__ && !a ? new Fe(this) : this.clone();
          return Q.__filtered__ ? Q.__takeCount__ = Ht(g, Q.__takeCount__) : Q.__views__.push({
            size: Ht(g, T),
            type: r + (Q.__dir__ < 0 ? "Right" : "")
          }), Q;
        }, Fe.prototype[r + "Right"] = function(g) {
          return this.reverse()[r](g).reverse();
        };
      }), m(["filter", "map", "takeWhile"], function(r, a) {
        var g = a + 1, Q = g == q || g == iA;
        Fe.prototype[r] = function(x) {
          var O = this.clone();
          return O.__iteratees__.push({
            iteratee: Ae(x, 3),
            type: g
          }), O.__filtered__ = O.__filtered__ || Q, O;
        };
      }), m(["head", "last"], function(r, a) {
        var g = "take" + (a ? "Right" : "");
        Fe.prototype[r] = function() {
          return this[g](1).value()[0];
        };
      }), m(["initial", "tail"], function(r, a) {
        var g = "drop" + (a ? "" : "Right");
        Fe.prototype[r] = function() {
          return this.__filtered__ ? new Fe(this) : this[g](1);
        };
      }), Fe.prototype.compact = function() {
        return this.filter(qt);
      }, Fe.prototype.find = function(r) {
        return this.filter(r).head();
      }, Fe.prototype.findLast = function(r) {
        return this.reverse().find(r);
      }, Fe.prototype.invokeMap = Be(function(r, a) {
        return typeof r == "function" ? new Fe(this) : this.map(function(g) {
          return Oo(g, r, a);
        });
      }), Fe.prototype.reject = function(r) {
        return this.filter($u(Ae(r)));
      }, Fe.prototype.slice = function(r, a) {
        r = de(r);
        var g = this;
        return g.__filtered__ && (r > 0 || a < 0) ? new Fe(g) : (r < 0 ? g = g.takeRight(-r) : r && (g = g.drop(r)), a !== t && (a = de(a), g = a < 0 ? g.dropRight(-a) : g.take(a - r)), g);
      }, Fe.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, Fe.prototype.toArray = function() {
        return this.take(T);
      }, er(Fe.prototype, function(r, a) {
        var g = /^(?:filter|find|map|reject)|While$/.test(a), Q = /^(?:head|last)$/.test(a), x = L[Q ? "take" + (a == "last" ? "Right" : "") : a], O = Q || /^find/.test(a);
        x && (L.prototype[a] = function() {
          var $ = this.__wrapped__, W = Q ? [1] : arguments, tA = $ instanceof Fe, mA = W[0], vA = tA || fe($), xA = function(Qe) {
            var _e = x.apply(L, Y([Qe], W));
            return Q && DA ? _e[0] : _e;
          };
          vA && g && typeof mA == "function" && mA.length != 1 && (tA = vA = !1);
          var DA = this.__chain__, $A = !!this.__actions__.length, ne = O && !DA, ge = tA && !$A;
          if (!O && vA) {
            $ = ge ? $ : new Fe(this);
            var re = r.apply($, W);
            return re.__actions__.push({ func: Pu, args: [xA], thisArg: t }), new fn(re, DA);
          }
          return ne && ge ? r.apply(this, W) : (re = this.thru(xA), ne ? Q ? re.value()[0] : re.value() : re);
        });
      }), m(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var a = ei[r], g = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", Q = /^(?:pop|shift)$/.test(r);
        L.prototype[r] = function() {
          var x = arguments;
          if (Q && !this.__chain__) {
            var O = this.value();
            return a.apply(fe(O) ? O : [], x);
          }
          return this[g](function($) {
            return a.apply(fe($) ? $ : [], x);
          });
        };
      }), er(Fe.prototype, function(r, a) {
        var g = L[a];
        if (g) {
          var Q = g.name + "";
          Se.call(Ea, Q) || (Ea[Q] = []), Ea[Q].push({ name: a, func: g });
        }
      }), Ea[Su(t, U).name] = [{
        name: "wrapper",
        func: t
      }], Fe.prototype.clone = Wy, Fe.prototype.reverse = Xy, Fe.prototype.value = qy, L.prototype.at = QF, L.prototype.chain = FF, L.prototype.commit = UF, L.prototype.next = EF, L.prototype.plant = _F, L.prototype.reverse = xF, L.prototype.toJSON = L.prototype.valueOf = L.prototype.value = IF, L.prototype.first = L.prototype.head, YA && (L.prototype[YA] = bF), L;
    }, Ie = vu();
    cn ? ((cn.exports = Ie)._ = Ie, yo._ = Ie) : Ze._ = Ie;
  }).call(Wi);
})(jl, jl.exports);
var tH = jl.exports;
const xe = /* @__PURE__ */ vc(tH), nH = function(A) {
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
  }, t = xe.merge({}, e, A), n = function(i, s) {
    var l = xe.cloneDeep(i);
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
      ), H = {
        label: xe.pick(t.annotations.label, ["size", "show"]),
        marker: xe.pick(t.annotations.marker, ["size", "show"])
      };
      H.label = n(
        H.label,
        t.annotations.label
      ), H.marker = n(
        H.marker,
        t.annotations.marker
      );
      var D = {
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
        annotations: H,
        scale: t.scale
      };
      return s.chromosomes.length == 1 && (D.chromosomePosition.x = w.left + 0.5 * F, D.geneAnnotationPosition.x = w.left + 0.5 * F + o, D.qtlAnnotationPosition.width = F * 0.5, D.geneAnnotationPosition.width = F * 1.5, D.labelPosition.x = w.left + 0.5 * F, D.labelPosition.width = o, D.sizeLabelPosition.x = w.left + 0.5 * F, D.sizeLabelPosition.width = o), s.drawing = xe.pick(t, ["width", "height"]), s.drawing.margin = {
        top: t.margin.top * s.drawing.height,
        left: t.margin.left * s.drawing.width,
        bottom: t.margin.bottom * s.drawing.height,
        right: t.margin.right * s.drawing.width
      }, s.chromosomes.forEach(function(b, M) {
        var R = M % t.numberPerRow, J = Math.floor(M / t.numberPerRow);
        b.cell = {
          y: J * h.height + t.margin.top * t.height,
          x: R * h.width + t.margin.left * t.width,
          width: h.width,
          height: h.height
        };
      }), s.cellLayout = D, s;
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
      return arguments.length ? (t.margin = xe.merge(t.margin, i), this) : t.margin;
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
function rH(A, e) {
  return A == null || e == null ? NaN : e < A ? -1 : e > A ? 1 : e >= A ? 0 : NaN;
}
function Iv(A) {
  let e, t, n;
  A.length !== 2 ? (e = Nl, t = (f, c) => Nl(A(f), c), n = (f, c) => A(f) - c) : (e = A === Nl || A === rH ? A : iH, t = A, n = A);
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
function iH() {
  return 0;
}
function aH(A) {
  return A === null ? NaN : +A;
}
const oH = Iv(Nl), sH = oH.right;
Iv(aH).center;
const uH = Math.sqrt(50), lH = Math.sqrt(10), cH = Math.sqrt(2);
function Yl(A, e, t) {
  const n = (e - A) / Math.max(0, t), i = Math.floor(Math.log10(n)), s = n / Math.pow(10, i), l = s >= uH ? 10 : s >= lH ? 5 : s >= cH ? 2 : 1;
  let f, c, h;
  return i < 0 ? (h = Math.pow(10, -i) / l, f = Math.round(A * h), c = Math.round(e * h), f / h < A && ++f, c / h > e && --c, h = -h) : (h = Math.pow(10, i) * l, f = Math.round(A / h), c = Math.round(e / h), f * h < A && ++f, c * h > e && --c), c < f && 0.5 <= t && t < 2 ? Yl(A, e, t * 2) : [f, c, h];
}
function fH(A, e, t) {
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
function Gh(A, e, t) {
  return e = +e, A = +A, t = +t, Yl(A, e, t)[2];
}
function hH(A, e, t) {
  e = +e, A = +A, t = +t;
  const n = e < A, i = n ? Gh(e, A, t) : Gh(A, e, t);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var dH = { value: function() {
} };
function bc() {
  for (var A = 0, e = arguments.length, t = {}, n; A < e; ++A) {
    if (!(n = arguments[A] + "") || n in t || /[\s.]/.test(n)) throw new Error("illegal type: " + n);
    t[n] = [];
  }
  return new Ml(t);
}
function Ml(A) {
  this._ = A;
}
function pH(A, e) {
  return A.trim().split(/^|\s+/).map(function(t) {
    var n = "", i = t.indexOf(".");
    if (i >= 0 && (n = t.slice(i + 1), t = t.slice(0, i)), t && !e.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: n };
  });
}
Ml.prototype = bc.prototype = {
  constructor: Ml,
  on: function(A, e) {
    var t = this._, n = pH(A + "", t), i, s = -1, l = n.length;
    if (arguments.length < 2) {
      for (; ++s < l; ) if ((i = (A = n[s]).type) && (i = gH(t[i], A.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++s < l; )
      if (i = (A = n[s]).type) t[i] = rw(t[i], A.name, e);
      else if (e == null) for (i in t) t[i] = rw(t[i], A.name, null);
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
function gH(A, e) {
  for (var t = 0, n = A.length, i; t < n; ++t)
    if ((i = A[t]).name === e)
      return i.value;
}
function rw(A, e, t) {
  for (var n = 0, i = A.length; n < i; ++n)
    if (A[n].name === e) {
      A[n] = dH, A = A.slice(0, n).concat(A.slice(n + 1));
      break;
    }
  return t != null && A.push({ name: e, value: t }), A;
}
var Vh = "http://www.w3.org/1999/xhtml";
const iw = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Vh,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function _c(A) {
  var e = A += "", t = e.indexOf(":");
  return t >= 0 && (e = A.slice(0, t)) !== "xmlns" && (A = A.slice(t + 1)), iw.hasOwnProperty(e) ? { space: iw[e], local: A } : A;
}
function BH(A) {
  return function() {
    var e = this.ownerDocument, t = this.namespaceURI;
    return t === Vh && e.documentElement.namespaceURI === Vh ? e.createElement(A) : e.createElementNS(t, A);
  };
}
function wH(A) {
  return function() {
    return this.ownerDocument.createElementNS(A.space, A.local);
  };
}
function Hv(A) {
  var e = _c(A);
  return (e.local ? wH : BH)(e);
}
function mH() {
}
function yp(A) {
  return A == null ? mH : function() {
    return this.querySelector(A);
  };
}
function vH(A) {
  typeof A != "function" && (A = yp(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = new Array(l), c, h, w = 0; w < l; ++w)
      (c = s[w]) && (h = A.call(c, c.__data__, w, s)) && ("__data__" in c && (h.__data__ = c.__data__), f[w] = h);
  return new $t(n, this._parents);
}
function Sv(A) {
  return A == null ? [] : Array.isArray(A) ? A : Array.from(A);
}
function yH() {
  return [];
}
function Lv(A) {
  return A == null ? yH : function() {
    return this.querySelectorAll(A);
  };
}
function CH(A) {
  return function() {
    return Sv(A.apply(this, arguments));
  };
}
function QH(A) {
  typeof A == "function" ? A = CH(A) : A = Lv(A);
  for (var e = this._groups, t = e.length, n = [], i = [], s = 0; s < t; ++s)
    for (var l = e[s], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && (n.push(A.call(c, c.__data__, h, l)), i.push(c));
  return new $t(n, i);
}
function Tv(A) {
  return function() {
    return this.matches(A);
  };
}
function Dv(A) {
  return function(e) {
    return e.matches(A);
  };
}
var FH = Array.prototype.find;
function UH(A) {
  return function() {
    return FH.call(this.children, A);
  };
}
function EH() {
  return this.firstElementChild;
}
function bH(A) {
  return this.select(A == null ? EH : UH(typeof A == "function" ? A : Dv(A)));
}
var _H = Array.prototype.filter;
function xH() {
  return Array.from(this.children);
}
function IH(A) {
  return function() {
    return _H.call(this.children, A);
  };
}
function HH(A) {
  return this.selectAll(A == null ? xH : IH(typeof A == "function" ? A : Dv(A)));
}
function SH(A) {
  typeof A != "function" && (A = Tv(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = s[h]) && A.call(c, c.__data__, h, s) && f.push(c);
  return new $t(n, this._parents);
}
function Ov(A) {
  return new Array(A.length);
}
function LH() {
  return new $t(this._enter || this._groups.map(Ov), this._parents);
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
function TH(A) {
  return function() {
    return A;
  };
}
function DH(A, e, t, n, i, s) {
  for (var l = 0, f, c = e.length, h = s.length; l < h; ++l)
    (f = e[l]) ? (f.__data__ = s[l], n[l] = f) : t[l] = new Zl(A, s[l]);
  for (; l < c; ++l)
    (f = e[l]) && (i[l] = f);
}
function OH(A, e, t, n, i, s, l) {
  var f, c, h = /* @__PURE__ */ new Map(), w = e.length, B = s.length, p = new Array(w), v;
  for (f = 0; f < w; ++f)
    (c = e[f]) && (p[f] = v = l.call(c, c.__data__, f, e) + "", h.has(v) ? i[f] = c : h.set(v, c));
  for (f = 0; f < B; ++f)
    v = l.call(A, s[f], f, s) + "", (c = h.get(v)) ? (n[f] = c, c.__data__ = s[f], h.delete(v)) : t[f] = new Zl(A, s[f]);
  for (f = 0; f < w; ++f)
    (c = e[f]) && h.get(p[f]) === c && (i[f] = c);
}
function NH(A) {
  return A.__data__;
}
function MH(A, e) {
  if (!arguments.length) return Array.from(this, NH);
  var t = e ? OH : DH, n = this._parents, i = this._groups;
  typeof A != "function" && (A = TH(A));
  for (var s = i.length, l = new Array(s), f = new Array(s), c = new Array(s), h = 0; h < s; ++h) {
    var w = n[h], B = i[h], p = B.length, v = PH(A.call(w, w && w.__data__, h, n)), o = v.length, C = f[h] = new Array(o), F = l[h] = new Array(o), U = c[h] = new Array(p);
    t(w, B, C, F, U, v, e);
    for (var H = 0, D = 0, b, M; H < o; ++H)
      if (b = C[H]) {
        for (H >= D && (D = H + 1); !(M = F[D]) && ++D < o; ) ;
        b._next = M || null;
      }
  }
  return l = new $t(l, n), l._enter = f, l._exit = c, l;
}
function PH(A) {
  return typeof A == "object" && "length" in A ? A : Array.from(A);
}
function RH() {
  return new $t(this._exit || this._groups.map(Ov), this._parents);
}
function KH(A, e, t) {
  var n = this.enter(), i = this, s = this.exit();
  return typeof A == "function" ? (n = A(n), n && (n = n.selection())) : n = n.append(A + ""), e != null && (i = e(i), i && (i = i.selection())), t == null ? s.remove() : t(s), n && i ? n.merge(i).order() : i;
}
function kH(A) {
  for (var e = A.selection ? A.selection() : A, t = this._groups, n = e._groups, i = t.length, s = n.length, l = Math.min(i, s), f = new Array(i), c = 0; c < l; ++c)
    for (var h = t[c], w = n[c], B = h.length, p = f[c] = new Array(B), v, o = 0; o < B; ++o)
      (v = h[o] || w[o]) && (p[o] = v);
  for (; c < i; ++c)
    f[c] = t[c];
  return new $t(f, this._parents);
}
function $H() {
  for (var A = this._groups, e = -1, t = A.length; ++e < t; )
    for (var n = A[e], i = n.length - 1, s = n[i], l; --i >= 0; )
      (l = n[i]) && (s && l.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(l, s), s = l);
  return this;
}
function GH(A) {
  A || (A = VH);
  function e(B, p) {
    return B && p ? A(B.__data__, p.__data__) : !B - !p;
  }
  for (var t = this._groups, n = t.length, i = new Array(n), s = 0; s < n; ++s) {
    for (var l = t[s], f = l.length, c = i[s] = new Array(f), h, w = 0; w < f; ++w)
      (h = l[w]) && (c[w] = h);
    c.sort(e);
  }
  return new $t(i, this._parents).order();
}
function VH(A, e) {
  return A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function WH() {
  var A = arguments[0];
  return arguments[0] = this, A.apply(null, arguments), this;
}
function XH() {
  return Array.from(this);
}
function qH() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length; i < s; ++i) {
      var l = n[i];
      if (l) return l;
    }
  return null;
}
function zH() {
  let A = 0;
  for (const e of this) ++A;
  return A;
}
function JH() {
  return !this.node();
}
function jH(A) {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var i = e[t], s = 0, l = i.length, f; s < l; ++s)
      (f = i[s]) && A.call(f, f.__data__, s, i);
  return this;
}
function YH(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function ZH(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function AS(A, e) {
  return function() {
    this.setAttribute(A, e);
  };
}
function eS(A, e) {
  return function() {
    this.setAttributeNS(A.space, A.local, e);
  };
}
function tS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttribute(A) : this.setAttribute(A, t);
  };
}
function nS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttributeNS(A.space, A.local) : this.setAttributeNS(A.space, A.local, t);
  };
}
function rS(A, e) {
  var t = _c(A);
  if (arguments.length < 2) {
    var n = this.node();
    return t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t);
  }
  return this.each((e == null ? t.local ? ZH : YH : typeof e == "function" ? t.local ? nS : tS : t.local ? eS : AS)(t, e));
}
function Nv(A) {
  return A.ownerDocument && A.ownerDocument.defaultView || A.document && A || A.defaultView;
}
function iS(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function aS(A, e, t) {
  return function() {
    this.style.setProperty(A, e, t);
  };
}
function oS(A, e, t) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.style.removeProperty(A) : this.style.setProperty(A, n, t);
  };
}
function sS(A, e, t) {
  return arguments.length > 1 ? this.each((e == null ? iS : typeof e == "function" ? oS : aS)(A, e, t ?? "")) : Za(this.node(), A);
}
function Za(A, e) {
  return A.style.getPropertyValue(e) || Nv(A).getComputedStyle(A, null).getPropertyValue(e);
}
function uS(A) {
  return function() {
    delete this[A];
  };
}
function lS(A, e) {
  return function() {
    this[A] = e;
  };
}
function cS(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? delete this[A] : this[A] = t;
  };
}
function fS(A, e) {
  return arguments.length > 1 ? this.each((e == null ? uS : typeof e == "function" ? cS : lS)(A, e)) : this.node()[A];
}
function Mv(A) {
  return A.trim().split(/^|\s+/);
}
function Cp(A) {
  return A.classList || new Pv(A);
}
function Pv(A) {
  this._node = A, this._names = Mv(A.getAttribute("class") || "");
}
Pv.prototype = {
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
  for (var t = Cp(A), n = -1, i = e.length; ++n < i; ) t.add(e[n]);
}
function Kv(A, e) {
  for (var t = Cp(A), n = -1, i = e.length; ++n < i; ) t.remove(e[n]);
}
function hS(A) {
  return function() {
    Rv(this, A);
  };
}
function dS(A) {
  return function() {
    Kv(this, A);
  };
}
function pS(A, e) {
  return function() {
    (e.apply(this, arguments) ? Rv : Kv)(this, A);
  };
}
function gS(A, e) {
  var t = Mv(A + "");
  if (arguments.length < 2) {
    for (var n = Cp(this.node()), i = -1, s = t.length; ++i < s; ) if (!n.contains(t[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? pS : e ? hS : dS)(t, e));
}
function BS() {
  this.textContent = "";
}
function wS(A) {
  return function() {
    this.textContent = A;
  };
}
function mS(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function vS(A) {
  return arguments.length ? this.each(A == null ? BS : (typeof A == "function" ? mS : wS)(A)) : this.node().textContent;
}
function yS() {
  this.innerHTML = "";
}
function CS(A) {
  return function() {
    this.innerHTML = A;
  };
}
function QS(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function FS(A) {
  return arguments.length ? this.each(A == null ? yS : (typeof A == "function" ? QS : CS)(A)) : this.node().innerHTML;
}
function US() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function ES() {
  return this.each(US);
}
function bS() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function _S() {
  return this.each(bS);
}
function xS(A) {
  var e = typeof A == "function" ? A : Hv(A);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function IS() {
  return null;
}
function HS(A, e) {
  var t = typeof A == "function" ? A : Hv(A), n = e == null ? IS : typeof e == "function" ? e : yp(e);
  return this.select(function() {
    return this.insertBefore(t.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function SS() {
  var A = this.parentNode;
  A && A.removeChild(this);
}
function LS() {
  return this.each(SS);
}
function TS() {
  var A = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function DS() {
  var A = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function OS(A) {
  return this.select(A ? DS : TS);
}
function NS(A) {
  return arguments.length ? this.property("__data__", A) : this.node().__data__;
}
function MS(A) {
  return function(e) {
    A.call(this, e, this.__data__);
  };
}
function PS(A) {
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
function KS(A, e, t) {
  return function() {
    var n = this.__on, i, s = MS(e);
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
function kS(A, e, t) {
  var n = PS(A + ""), i, s = n.length, l;
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
  for (f = e ? KS : RS, i = 0; i < s; ++i) this.each(f(n[i], e, t));
  return this;
}
function kv(A, e, t) {
  var n = Nv(A), i = n.CustomEvent;
  typeof i == "function" ? i = new i(e, t) : (i = n.document.createEvent("Event"), t ? (i.initEvent(e, t.bubbles, t.cancelable), i.detail = t.detail) : i.initEvent(e, !1, !1)), A.dispatchEvent(i);
}
function $S(A, e) {
  return function() {
    return kv(this, A, e);
  };
}
function GS(A, e) {
  return function() {
    return kv(this, A, e.apply(this, arguments));
  };
}
function VS(A, e) {
  return this.each((typeof e == "function" ? GS : $S)(A, e));
}
function* WS() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length, l; i < s; ++i)
      (l = n[i]) && (yield l);
}
var Qp = [null];
function $t(A, e) {
  this._groups = A, this._parents = e;
}
function Ds() {
  return new $t([[document.documentElement]], Qp);
}
function XS() {
  return this;
}
$t.prototype = Ds.prototype = {
  constructor: $t,
  select: vH,
  selectAll: QH,
  selectChild: bH,
  selectChildren: HH,
  filter: SH,
  data: MH,
  enter: LH,
  exit: RH,
  join: KH,
  merge: kH,
  selection: XS,
  order: $H,
  sort: GH,
  call: WH,
  nodes: XH,
  node: qH,
  size: zH,
  empty: JH,
  each: jH,
  attr: rS,
  style: sS,
  property: fS,
  classed: gS,
  text: vS,
  html: FS,
  raise: ES,
  lower: _S,
  append: xS,
  insert: HS,
  remove: LS,
  clone: OS,
  datum: NS,
  on: kS,
  dispatch: VS,
  [Symbol.iterator]: WS
};
function XA(A) {
  return typeof A == "string" ? new $t([[document.querySelector(A)]], [document.documentElement]) : new $t([[A]], Qp);
}
function qS(A) {
  let e;
  for (; e = A.sourceEvent; ) A = e;
  return A;
}
function kn(A, e) {
  if (A = qS(A), e === void 0 && (e = A.currentTarget), e) {
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
function Wh(A) {
  return typeof A == "string" ? new $t([document.querySelectorAll(A)], [document.documentElement]) : new $t([Sv(A)], Qp);
}
const zS = { passive: !1 }, Cs = { capture: !0, passive: !1 };
function ih(A) {
  A.stopImmediatePropagation();
}
function za(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function $v(A) {
  var e = A.document.documentElement, t = XA(A).on("dragstart.drag", za, Cs);
  "onselectstart" in e ? t.on("selectstart.drag", za, Cs) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function Gv(A, e) {
  var t = A.document.documentElement, n = XA(A).on("dragstart.drag", null);
  e && (n.on("click.drag", za, Cs), setTimeout(function() {
    n.on("click.drag", null);
  }, 0)), "onselectstart" in t ? n.on("selectstart.drag", null) : (t.style.MozUserSelect = t.__noselect, delete t.__noselect);
}
const Al = (A) => () => A;
function Xh(A, {
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
Xh.prototype.on = function() {
  var A = this._.on.apply(this._, arguments);
  return A === this._ ? this : A;
};
function JS(A) {
  return !A.ctrlKey && !A.button;
}
function jS() {
  return this.parentNode;
}
function YS(A, e) {
  return e ?? { x: A.x, y: A.y };
}
function ZS() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function AL() {
  var A = JS, e = jS, t = YS, n = ZS, i = {}, s = bc("start", "drag", "end"), l = 0, f, c, h, w, B = 0;
  function p(b) {
    b.on("mousedown.drag", v).filter(n).on("touchstart.drag", F).on("touchmove.drag", U, zS).on("touchend.drag touchcancel.drag", H).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(b, M) {
    if (!(w || !A.call(this, b, M))) {
      var R = D(this, e.call(this, b, M), b, M, "mouse");
      R && (XA(b.view).on("mousemove.drag", o, Cs).on("mouseup.drag", C, Cs), $v(b.view), ih(b), h = !1, f = b.clientX, c = b.clientY, R("start", b));
    }
  }
  function o(b) {
    if (za(b), !h) {
      var M = b.clientX - f, R = b.clientY - c;
      h = M * M + R * R > B;
    }
    i.mouse("drag", b);
  }
  function C(b) {
    XA(b.view).on("mousemove.drag mouseup.drag", null), Gv(b.view, h), za(b), i.mouse("end", b);
  }
  function F(b, M) {
    if (A.call(this, b, M)) {
      var R = b.changedTouches, J = e.call(this, b, M), hA = R.length, cA, wA;
      for (cA = 0; cA < hA; ++cA)
        (wA = D(this, J, b, M, R[cA].identifier, R[cA])) && (ih(b), wA("start", b, R[cA]));
    }
  }
  function U(b) {
    var M = b.changedTouches, R = M.length, J, hA;
    for (J = 0; J < R; ++J)
      (hA = i[M[J].identifier]) && (za(b), hA("drag", b, M[J]));
  }
  function H(b) {
    var M = b.changedTouches, R = M.length, J, hA;
    for (w && clearTimeout(w), w = setTimeout(function() {
      w = null;
    }, 500), J = 0; J < R; ++J)
      (hA = i[M[J].identifier]) && (ih(b), hA("end", b, M[J]));
  }
  function D(b, M, R, J, hA, cA) {
    var wA = s.copy(), QA = kn(cA || R, M), OA, bA, q;
    if ((q = t.call(b, new Xh("beforestart", {
      sourceEvent: R,
      target: p,
      identifier: hA,
      active: l,
      x: QA[0],
      y: QA[1],
      dx: 0,
      dy: 0,
      dispatch: wA
    }), J)) != null)
      return OA = q.x - QA[0] || 0, bA = q.y - QA[1] || 0, function CA(iA, gA, IA) {
        var HA = QA, uA;
        switch (iA) {
          case "start":
            i[hA] = CA, uA = l++;
            break;
          case "end":
            delete i[hA], --l;
          case "drag":
            QA = kn(IA || gA, M), uA = l;
            break;
        }
        wA.call(
          iA,
          b,
          new Xh(iA, {
            sourceEvent: gA,
            subject: q,
            target: p,
            identifier: hA,
            active: uA,
            x: QA[0] + OA,
            y: QA[1] + bA,
            dx: QA[0] - HA[0],
            dy: QA[1] - HA[1],
            dispatch: wA
          }),
          J
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
function Fp(A, e, t) {
  A.prototype = e.prototype = t, t.constructor = A;
}
function Vv(A, e) {
  var t = Object.create(A.prototype);
  for (var n in e) t[n] = e[n];
  return t;
}
function Os() {
}
var Qs = 0.7, Ac = 1 / Qs, Ja = "\\s*([+-]?\\d+)\\s*", Fs = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", or = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", eL = /^#([0-9a-f]{3,8})$/, tL = new RegExp(`^rgb\\(${Ja},${Ja},${Ja}\\)$`), nL = new RegExp(`^rgb\\(${or},${or},${or}\\)$`), rL = new RegExp(`^rgba\\(${Ja},${Ja},${Ja},${Fs}\\)$`), iL = new RegExp(`^rgba\\(${or},${or},${or},${Fs}\\)$`), aL = new RegExp(`^hsl\\(${Fs},${or},${or}\\)$`), oL = new RegExp(`^hsla\\(${Fs},${or},${or},${Fs}\\)$`), aw = {
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
Fp(Os, ia, {
  copy(A) {
    return Object.assign(new this.constructor(), this, A);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ow,
  // Deprecated! Use color.formatHex.
  formatHex: ow,
  formatHex8: sL,
  formatHsl: uL,
  formatRgb: sw,
  toString: sw
});
function ow() {
  return this.rgb().formatHex();
}
function sL() {
  return this.rgb().formatHex8();
}
function uL() {
  return Wv(this).formatHsl();
}
function sw() {
  return this.rgb().formatRgb();
}
function ia(A) {
  var e, t;
  return A = (A + "").trim().toLowerCase(), (e = eL.exec(A)) ? (t = e[1].length, e = parseInt(e[1], 16), t === 6 ? uw(e) : t === 3 ? new Yt(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : t === 8 ? el(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : t === 4 ? el(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = tL.exec(A)) ? new Yt(e[1], e[2], e[3], 1) : (e = nL.exec(A)) ? new Yt(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = rL.exec(A)) ? el(e[1], e[2], e[3], e[4]) : (e = iL.exec(A)) ? el(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = aL.exec(A)) ? fw(e[1], e[2] / 100, e[3] / 100, 1) : (e = oL.exec(A)) ? fw(e[1], e[2] / 100, e[3] / 100, e[4]) : aw.hasOwnProperty(A) ? uw(aw[A]) : A === "transparent" ? new Yt(NaN, NaN, NaN, 0) : null;
}
function uw(A) {
  return new Yt(A >> 16 & 255, A >> 8 & 255, A & 255, 1);
}
function el(A, e, t, n) {
  return n <= 0 && (A = e = t = NaN), new Yt(A, e, t, n);
}
function lL(A) {
  return A instanceof Os || (A = ia(A)), A ? (A = A.rgb(), new Yt(A.r, A.g, A.b, A.opacity)) : new Yt();
}
function qh(A, e, t, n) {
  return arguments.length === 1 ? lL(A) : new Yt(A, e, t, n ?? 1);
}
function Yt(A, e, t, n) {
  this.r = +A, this.g = +e, this.b = +t, this.opacity = +n;
}
Fp(Yt, qh, Vv(Os, {
  brighter(A) {
    return A = A == null ? Ac : Math.pow(Ac, A), new Yt(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Qs : Math.pow(Qs, A), new Yt(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Yt(Yi(this.r), Yi(this.g), Yi(this.b), ec(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: lw,
  // Deprecated! Use color.formatHex.
  formatHex: lw,
  formatHex8: cL,
  formatRgb: cw,
  toString: cw
}));
function lw() {
  return `#${Ji(this.r)}${Ji(this.g)}${Ji(this.b)}`;
}
function cL() {
  return `#${Ji(this.r)}${Ji(this.g)}${Ji(this.b)}${Ji((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function cw() {
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
function fw(A, e, t, n) {
  return n <= 0 ? A = e = t = NaN : t <= 0 || t >= 1 ? A = e = NaN : e <= 0 && (A = NaN), new Vn(A, e, t, n);
}
function Wv(A) {
  if (A instanceof Vn) return new Vn(A.h, A.s, A.l, A.opacity);
  if (A instanceof Os || (A = ia(A)), !A) return new Vn();
  if (A instanceof Vn) return A;
  A = A.rgb();
  var e = A.r / 255, t = A.g / 255, n = A.b / 255, i = Math.min(e, t, n), s = Math.max(e, t, n), l = NaN, f = s - i, c = (s + i) / 2;
  return f ? (e === s ? l = (t - n) / f + (t < n) * 6 : t === s ? l = (n - e) / f + 2 : l = (e - t) / f + 4, f /= c < 0.5 ? s + i : 2 - s - i, l *= 60) : f = c > 0 && c < 1 ? 0 : l, new Vn(l, f, c, A.opacity);
}
function fL(A, e, t, n) {
  return arguments.length === 1 ? Wv(A) : new Vn(A, e, t, n ?? 1);
}
function Vn(A, e, t, n) {
  this.h = +A, this.s = +e, this.l = +t, this.opacity = +n;
}
Fp(Vn, fL, Vv(Os, {
  brighter(A) {
    return A = A == null ? Ac : Math.pow(Ac, A), new Vn(this.h, this.s, this.l * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Qs : Math.pow(Qs, A), new Vn(this.h, this.s, this.l * A, this.opacity);
  },
  rgb() {
    var A = this.h % 360 + (this.h < 0) * 360, e = isNaN(A) || isNaN(this.s) ? 0 : this.s, t = this.l, n = t + (t < 0.5 ? t : 1 - t) * e, i = 2 * t - n;
    return new Yt(
      ah(A >= 240 ? A - 240 : A + 120, i, n),
      ah(A, i, n),
      ah(A < 120 ? A + 240 : A - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new Vn(hw(this.h), tl(this.s), tl(this.l), ec(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const A = ec(this.opacity);
    return `${A === 1 ? "hsl(" : "hsla("}${hw(this.h)}, ${tl(this.s) * 100}%, ${tl(this.l) * 100}%${A === 1 ? ")" : `, ${A})`}`;
  }
}));
function hw(A) {
  return A = (A || 0) % 360, A < 0 ? A + 360 : A;
}
function tl(A) {
  return Math.max(0, Math.min(1, A || 0));
}
function ah(A, e, t) {
  return (A < 60 ? e + (t - e) * A / 60 : A < 180 ? t : A < 240 ? e + (t - e) * (240 - A) / 60 : e) * 255;
}
const Up = (A) => () => A;
function hL(A, e) {
  return function(t) {
    return A + t * e;
  };
}
function dL(A, e, t) {
  return A = Math.pow(A, t), e = Math.pow(e, t) - A, t = 1 / t, function(n) {
    return Math.pow(A + n * e, t);
  };
}
function pL(A) {
  return (A = +A) == 1 ? Xv : function(e, t) {
    return t - e ? dL(e, t, A) : Up(isNaN(e) ? t : e);
  };
}
function Xv(A, e) {
  var t = e - A;
  return t ? hL(A, t) : Up(isNaN(A) ? e : A);
}
const tc = function A(e) {
  var t = pL(e);
  function n(i, s) {
    var l = t((i = qh(i)).r, (s = qh(s)).r), f = t(i.g, s.g), c = t(i.b, s.b), h = Xv(i.opacity, s.opacity);
    return function(w) {
      return i.r = l(w), i.g = f(w), i.b = c(w), i.opacity = h(w), i + "";
    };
  }
  return n.gamma = A, n;
}(1);
function gL(A, e) {
  e || (e = []);
  var t = A ? Math.min(e.length, A.length) : 0, n = e.slice(), i;
  return function(s) {
    for (i = 0; i < t; ++i) n[i] = A[i] * (1 - s) + e[i] * s;
    return n;
  };
}
function BL(A) {
  return ArrayBuffer.isView(A) && !(A instanceof DataView);
}
function wL(A, e) {
  var t = e ? e.length : 0, n = A ? Math.min(t, A.length) : 0, i = new Array(n), s = new Array(t), l;
  for (l = 0; l < n; ++l) i[l] = Ep(A[l], e[l]);
  for (; l < t; ++l) s[l] = e[l];
  return function(f) {
    for (l = 0; l < n; ++l) s[l] = i[l](f);
    return s;
  };
}
function mL(A, e) {
  var t = /* @__PURE__ */ new Date();
  return A = +A, e = +e, function(n) {
    return t.setTime(A * (1 - n) + e * n), t;
  };
}
function $n(A, e) {
  return A = +A, e = +e, function(t) {
    return A * (1 - t) + e * t;
  };
}
function vL(A, e) {
  var t = {}, n = {}, i;
  (A === null || typeof A != "object") && (A = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in A ? t[i] = Ep(A[i], e[i]) : n[i] = e[i];
  return function(s) {
    for (i in t) n[i] = t[i](s);
    return n;
  };
}
var zh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, oh = new RegExp(zh.source, "g");
function yL(A) {
  return function() {
    return A;
  };
}
function CL(A) {
  return function(e) {
    return A(e) + "";
  };
}
function qv(A, e) {
  var t = zh.lastIndex = oh.lastIndex = 0, n, i, s, l = -1, f = [], c = [];
  for (A = A + "", e = e + ""; (n = zh.exec(A)) && (i = oh.exec(e)); )
    (s = i.index) > t && (s = e.slice(t, s), f[l] ? f[l] += s : f[++l] = s), (n = n[0]) === (i = i[0]) ? f[l] ? f[l] += i : f[++l] = i : (f[++l] = null, c.push({ i: l, x: $n(n, i) })), t = oh.lastIndex;
  return t < e.length && (s = e.slice(t), f[l] ? f[l] += s : f[++l] = s), f.length < 2 ? c[0] ? CL(c[0].x) : yL(e) : (e = c.length, function(h) {
    for (var w = 0, B; w < e; ++w) f[(B = c[w]).i] = B.x(h);
    return f.join("");
  });
}
function Ep(A, e) {
  var t = typeof e, n;
  return e == null || t === "boolean" ? Up(e) : (t === "number" ? $n : t === "string" ? (n = ia(e)) ? (e = n, tc) : qv : e instanceof ia ? tc : e instanceof Date ? mL : BL(e) ? gL : Array.isArray(e) ? wL : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? vL : $n)(A, e);
}
function QL(A, e) {
  return A = +A, e = +e, function(t) {
    return Math.round(A * (1 - t) + e * t);
  };
}
var dw = 180 / Math.PI, Jh = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function zv(A, e, t, n, i, s) {
  var l, f, c;
  return (l = Math.sqrt(A * A + e * e)) && (A /= l, e /= l), (c = A * t + e * n) && (t -= A * c, n -= e * c), (f = Math.sqrt(t * t + n * n)) && (t /= f, n /= f, c /= f), A * n < e * t && (A = -A, e = -e, c = -c, l = -l), {
    translateX: i,
    translateY: s,
    rotate: Math.atan2(e, A) * dw,
    skewX: Math.atan(c) * dw,
    scaleX: l,
    scaleY: f
  };
}
var nl;
function FL(A) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(A + "");
  return e.isIdentity ? Jh : zv(e.a, e.b, e.c, e.d, e.e, e.f);
}
function UL(A) {
  return A == null || (nl || (nl = document.createElementNS("http://www.w3.org/2000/svg", "g")), nl.setAttribute("transform", A), !(A = nl.transform.baseVal.consolidate())) ? Jh : (A = A.matrix, zv(A.a, A.b, A.c, A.d, A.e, A.f));
}
function Jv(A, e, t, n) {
  function i(h) {
    return h.length ? h.pop() + " " : "";
  }
  function s(h, w, B, p, v, o) {
    if (h !== B || w !== p) {
      var C = v.push("translate(", null, e, null, t);
      o.push({ i: C - 4, x: $n(h, B) }, { i: C - 2, x: $n(w, p) });
    } else (B || p) && v.push("translate(" + B + e + p + t);
  }
  function l(h, w, B, p) {
    h !== w ? (h - w > 180 ? w += 360 : w - h > 180 && (h += 360), p.push({ i: B.push(i(B) + "rotate(", null, n) - 2, x: $n(h, w) })) : w && B.push(i(B) + "rotate(" + w + n);
  }
  function f(h, w, B, p) {
    h !== w ? p.push({ i: B.push(i(B) + "skewX(", null, n) - 2, x: $n(h, w) }) : w && B.push(i(B) + "skewX(" + w + n);
  }
  function c(h, w, B, p, v, o) {
    if (h !== B || w !== p) {
      var C = v.push(i(v) + "scale(", null, ",", null, ")");
      o.push({ i: C - 4, x: $n(h, B) }, { i: C - 2, x: $n(w, p) });
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
var EL = Jv(FL, "px, ", "px)", "deg)"), bL = Jv(UL, ", ", ")", ")"), _L = 1e-12;
function pw(A) {
  return ((A = Math.exp(A)) + 1 / A) / 2;
}
function xL(A) {
  return ((A = Math.exp(A)) - 1 / A) / 2;
}
function IL(A) {
  return ((A = Math.exp(2 * A)) - 1) / (A + 1);
}
const HL = function A(e, t, n) {
  function i(s, l) {
    var f = s[0], c = s[1], h = s[2], w = l[0], B = l[1], p = l[2], v = w - f, o = B - c, C = v * v + o * o, F, U;
    if (C < _L)
      U = Math.log(p / h) / e, F = function(J) {
        return [
          f + J * v,
          c + J * o,
          h * Math.exp(e * J * U)
        ];
      };
    else {
      var H = Math.sqrt(C), D = (p * p - h * h + n * C) / (2 * h * t * H), b = (p * p - h * h - n * C) / (2 * p * t * H), M = Math.log(Math.sqrt(D * D + 1) - D), R = Math.log(Math.sqrt(b * b + 1) - b);
      U = (R - M) / e, F = function(J) {
        var hA = J * U, cA = pw(M), wA = h / (t * H) * (cA * IL(e * hA + M) - xL(M));
        return [
          f + wA * v,
          c + wA * o,
          h * cA / pw(e * hA + M)
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
var Ao = 0, As = 0, Vo = 0, jv = 1e3, nc, es, rc = 0, aa = 0, xc = 0, Us = typeof performance == "object" && performance.now ? performance : Date, Yv = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(A) {
  setTimeout(A, 17);
};
function bp() {
  return aa || (Yv(SL), aa = Us.now() + xc);
}
function SL() {
  aa = 0;
}
function ic() {
  this._call = this._time = this._next = null;
}
ic.prototype = Zv.prototype = {
  constructor: ic,
  restart: function(A, e, t) {
    if (typeof A != "function") throw new TypeError("callback is not a function");
    t = (t == null ? bp() : +t) + (e == null ? 0 : +e), !this._next && es !== this && (es ? es._next = this : nc = this, es = this), this._call = A, this._time = t, jh();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, jh());
  }
};
function Zv(A, e, t) {
  var n = new ic();
  return n.restart(A, e, t), n;
}
function LL() {
  bp(), ++Ao;
  for (var A = nc, e; A; )
    (e = aa - A._time) >= 0 && A._call.call(void 0, e), A = A._next;
  --Ao;
}
function gw() {
  aa = (rc = Us.now()) + xc, Ao = As = 0;
  try {
    LL();
  } finally {
    Ao = 0, DL(), aa = 0;
  }
}
function TL() {
  var A = Us.now(), e = A - rc;
  e > jv && (xc -= e, rc = A);
}
function DL() {
  for (var A, e = nc, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), A = e, e = e._next) : (t = e._next, e._next = null, e = A ? A._next = t : nc = t);
  es = A, jh(n);
}
function jh(A) {
  if (!Ao) {
    As && (As = clearTimeout(As));
    var e = A - aa;
    e > 24 ? (A < 1 / 0 && (As = setTimeout(gw, A - Us.now() - xc)), Vo && (Vo = clearInterval(Vo))) : (Vo || (rc = Us.now(), Vo = setInterval(TL, jv)), Ao = 1, Yv(gw));
  }
}
function Bw(A, e, t) {
  var n = new ic();
  return e = e == null ? 0 : +e, n.restart((i) => {
    n.stop(), A(i + e);
  }, e, t), n;
}
var OL = bc("start", "end", "cancel", "interrupt"), NL = [], A0 = 0, ww = 1, Yh = 2, Pl = 3, mw = 4, Zh = 5, Rl = 6;
function Ic(A, e, t, n, i, s) {
  var l = A.__transition;
  if (!l) A.__transition = {};
  else if (t in l) return;
  ML(A, t, {
    name: e,
    index: n,
    // For context during callback.
    group: i,
    // For context during callback.
    on: OL,
    tween: NL,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: A0
  });
}
function _p(A, e) {
  var t = Wn(A, e);
  if (t.state > A0) throw new Error("too late; already scheduled");
  return t;
}
function cr(A, e) {
  var t = Wn(A, e);
  if (t.state > Pl) throw new Error("too late; already running");
  return t;
}
function Wn(A, e) {
  var t = A.__transition;
  if (!t || !(t = t[e])) throw new Error("transition not found");
  return t;
}
function ML(A, e, t) {
  var n = A.__transition, i;
  n[e] = t, t.timer = Zv(s, 0, t.time);
  function s(h) {
    t.state = ww, t.timer.restart(l, t.delay, t.time), t.delay <= h && l(h - t.delay);
  }
  function l(h) {
    var w, B, p, v;
    if (t.state !== ww) return c();
    for (w in n)
      if (v = n[w], v.name === t.name) {
        if (v.state === Pl) return Bw(l);
        v.state === mw ? (v.state = Rl, v.timer.stop(), v.on.call("interrupt", A, A.__data__, v.index, v.group), delete n[w]) : +w < e && (v.state = Rl, v.timer.stop(), v.on.call("cancel", A, A.__data__, v.index, v.group), delete n[w]);
      }
    if (Bw(function() {
      t.state === Pl && (t.state = mw, t.timer.restart(f, t.delay, t.time), f(h));
    }), t.state = Yh, t.on.call("start", A, A.__data__, t.index, t.group), t.state === Yh) {
      for (t.state = Pl, i = new Array(p = t.tween.length), w = 0, B = -1; w < p; ++w)
        (v = t.tween[w].value.call(A, A.__data__, t.index, t.group)) && (i[++B] = v);
      i.length = B + 1;
    }
  }
  function f(h) {
    for (var w = h < t.duration ? t.ease.call(null, h / t.duration) : (t.timer.restart(c), t.state = Zh, 1), B = -1, p = i.length; ++B < p; )
      i[B].call(A, w);
    t.state === Zh && (t.on.call("end", A, A.__data__, t.index, t.group), c());
  }
  function c() {
    t.state = Rl, t.timer.stop(), delete n[e];
    for (var h in n) return;
    delete A.__transition;
  }
}
function Kl(A, e) {
  var t = A.__transition, n, i, s = !0, l;
  if (t) {
    e = e == null ? null : e + "";
    for (l in t) {
      if ((n = t[l]).name !== e) {
        s = !1;
        continue;
      }
      i = n.state > Yh && n.state < Zh, n.state = Rl, n.timer.stop(), n.on.call(i ? "interrupt" : "cancel", A, A.__data__, n.index, n.group), delete t[l];
    }
    s && delete A.__transition;
  }
}
function PL(A) {
  return this.each(function() {
    Kl(this, A);
  });
}
function RL(A, e) {
  var t, n;
  return function() {
    var i = cr(this, A), s = i.tween;
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
function KL(A, e, t) {
  var n, i;
  if (typeof t != "function") throw new Error();
  return function() {
    var s = cr(this, A), l = s.tween;
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
function kL(A, e) {
  var t = this._id;
  if (A += "", arguments.length < 2) {
    for (var n = Wn(this.node(), t).tween, i = 0, s = n.length, l; i < s; ++i)
      if ((l = n[i]).name === A)
        return l.value;
    return null;
  }
  return this.each((e == null ? RL : KL)(t, A, e));
}
function xp(A, e, t) {
  var n = A._id;
  return A.each(function() {
    var i = cr(this, n);
    (i.value || (i.value = {}))[e] = t.apply(this, arguments);
  }), function(i) {
    return Wn(i, n).value[e];
  };
}
function e0(A, e) {
  var t;
  return (typeof e == "number" ? $n : e instanceof ia ? tc : (t = ia(e)) ? (e = t, tc) : qv)(A, e);
}
function $L(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function GL(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function VL(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttribute(A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function WL(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttributeNS(A.space, A.local);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function XL(A, e, t) {
  var n, i, s;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttribute(A) : (l = this.getAttribute(A), c = f + "", l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f)));
  };
}
function qL(A, e, t) {
  var n, i, s;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttributeNS(A.space, A.local) : (l = this.getAttributeNS(A.space, A.local), c = f + "", l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f)));
  };
}
function zL(A, e) {
  var t = _c(A), n = t === "transform" ? bL : e0;
  return this.attrTween(A, typeof e == "function" ? (t.local ? qL : XL)(t, n, xp(this, "attr." + A, e)) : e == null ? (t.local ? GL : $L)(t) : (t.local ? WL : VL)(t, n, e));
}
function JL(A, e) {
  return function(t) {
    this.setAttribute(A, e.call(this, t));
  };
}
function jL(A, e) {
  return function(t) {
    this.setAttributeNS(A.space, A.local, e.call(this, t));
  };
}
function YL(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && jL(A, s)), t;
  }
  return i._value = e, i;
}
function ZL(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && JL(A, s)), t;
  }
  return i._value = e, i;
}
function AT(A, e) {
  var t = "attr." + A;
  if (arguments.length < 2) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  var n = _c(A);
  return this.tween(t, (n.local ? YL : ZL)(n, e));
}
function eT(A, e) {
  return function() {
    _p(this, A).delay = +e.apply(this, arguments);
  };
}
function tT(A, e) {
  return e = +e, function() {
    _p(this, A).delay = e;
  };
}
function nT(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? eT : tT)(e, A)) : Wn(this.node(), e).delay;
}
function rT(A, e) {
  return function() {
    cr(this, A).duration = +e.apply(this, arguments);
  };
}
function iT(A, e) {
  return e = +e, function() {
    cr(this, A).duration = e;
  };
}
function aT(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? rT : iT)(e, A)) : Wn(this.node(), e).duration;
}
function oT(A, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    cr(this, A).ease = e;
  };
}
function sT(A) {
  var e = this._id;
  return arguments.length ? this.each(oT(e, A)) : Wn(this.node(), e).ease;
}
function uT(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    if (typeof t != "function") throw new Error();
    cr(this, A).ease = t;
  };
}
function lT(A) {
  if (typeof A != "function") throw new Error();
  return this.each(uT(this._id, A));
}
function cT(A) {
  typeof A != "function" && (A = Tv(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = s[h]) && A.call(c, c.__data__, h, s) && f.push(c);
  return new Kr(n, this._parents, this._name, this._id);
}
function fT(A) {
  if (A._id !== this._id) throw new Error();
  for (var e = this._groups, t = A._groups, n = e.length, i = t.length, s = Math.min(n, i), l = new Array(n), f = 0; f < s; ++f)
    for (var c = e[f], h = t[f], w = c.length, B = l[f] = new Array(w), p, v = 0; v < w; ++v)
      (p = c[v] || h[v]) && (B[v] = p);
  for (; f < n; ++f)
    l[f] = e[f];
  return new Kr(l, this._parents, this._name, this._id);
}
function hT(A) {
  return (A + "").trim().split(/^|\s+/).every(function(e) {
    var t = e.indexOf(".");
    return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
  });
}
function dT(A, e, t) {
  var n, i, s = hT(e) ? _p : cr;
  return function() {
    var l = s(this, A), f = l.on;
    f !== n && (i = (n = f).copy()).on(e, t), l.on = i;
  };
}
function pT(A, e) {
  var t = this._id;
  return arguments.length < 2 ? Wn(this.node(), t).on.on(A) : this.each(dT(t, A, e));
}
function gT(A) {
  return function() {
    var e = this.parentNode;
    for (var t in this.__transition) if (+t !== A) return;
    e && e.removeChild(this);
  };
}
function BT() {
  return this.on("end.remove", gT(this._id));
}
function wT(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = yp(A));
  for (var n = this._groups, i = n.length, s = new Array(i), l = 0; l < i; ++l)
    for (var f = n[l], c = f.length, h = s[l] = new Array(c), w, B, p = 0; p < c; ++p)
      (w = f[p]) && (B = A.call(w, w.__data__, p, f)) && ("__data__" in w && (B.__data__ = w.__data__), h[p] = B, Ic(h[p], e, t, p, h, Wn(w, t)));
  return new Kr(s, this._parents, e, t);
}
function mT(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Lv(A));
  for (var n = this._groups, i = n.length, s = [], l = [], f = 0; f < i; ++f)
    for (var c = n[f], h = c.length, w, B = 0; B < h; ++B)
      if (w = c[B]) {
        for (var p = A.call(w, w.__data__, B, c), v, o = Wn(w, t), C = 0, F = p.length; C < F; ++C)
          (v = p[C]) && Ic(v, e, t, C, p, o);
        s.push(p), l.push(w);
      }
  return new Kr(s, l, e, t);
}
var vT = Ds.prototype.constructor;
function yT() {
  return new vT(this._groups, this._parents);
}
function CT(A, e) {
  var t, n, i;
  return function() {
    var s = Za(this, A), l = (this.style.removeProperty(A), Za(this, A));
    return s === l ? null : s === t && l === n ? i : i = e(t = s, n = l);
  };
}
function t0(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function QT(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = Za(this, A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function FT(A, e, t) {
  var n, i, s;
  return function() {
    var l = Za(this, A), f = t(this), c = f + "";
    return f == null && (c = f = (this.style.removeProperty(A), Za(this, A))), l === c ? null : l === n && c === i ? s : (i = c, s = e(n = l, f));
  };
}
function UT(A, e) {
  var t, n, i, s = "style." + e, l = "end." + s, f;
  return function() {
    var c = cr(this, A), h = c.on, w = c.value[s] == null ? f || (f = t0(e)) : void 0;
    (h !== t || i !== w) && (n = (t = h).copy()).on(l, i = w), c.on = n;
  };
}
function ET(A, e, t) {
  var n = (A += "") == "transform" ? EL : e0;
  return e == null ? this.styleTween(A, CT(A, n)).on("end.style." + A, t0(A)) : typeof e == "function" ? this.styleTween(A, FT(A, n, xp(this, "style." + A, e))).each(UT(this._id, A)) : this.styleTween(A, QT(A, n, e), t).on("end.style." + A, null);
}
function bT(A, e, t) {
  return function(n) {
    this.style.setProperty(A, e.call(this, n), t);
  };
}
function _T(A, e, t) {
  var n, i;
  function s() {
    var l = e.apply(this, arguments);
    return l !== i && (n = (i = l) && bT(A, l, t)), n;
  }
  return s._value = e, s;
}
function xT(A, e, t) {
  var n = "style." + (A += "");
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, _T(A, e, t ?? ""));
}
function IT(A) {
  return function() {
    this.textContent = A;
  };
}
function HT(A) {
  return function() {
    var e = A(this);
    this.textContent = e ?? "";
  };
}
function ST(A) {
  return this.tween("text", typeof A == "function" ? HT(xp(this, "text", A)) : IT(A == null ? "" : A + ""));
}
function LT(A) {
  return function(e) {
    this.textContent = A.call(this, e);
  };
}
function TT(A) {
  var e, t;
  function n() {
    var i = A.apply(this, arguments);
    return i !== t && (e = (t = i) && LT(i)), e;
  }
  return n._value = A, n;
}
function DT(A) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (A == null) return this.tween(e, null);
  if (typeof A != "function") throw new Error();
  return this.tween(e, TT(A));
}
function OT() {
  for (var A = this._name, e = this._id, t = n0(), n = this._groups, i = n.length, s = 0; s < i; ++s)
    for (var l = n[s], f = l.length, c, h = 0; h < f; ++h)
      if (c = l[h]) {
        var w = Wn(c, e);
        Ic(c, A, t, h, l, {
          time: w.time + w.delay + w.duration,
          delay: 0,
          duration: w.duration,
          ease: w.ease
        });
      }
  return new Kr(n, this._parents, A, t);
}
function NT() {
  var A, e, t = this, n = t._id, i = t.size();
  return new Promise(function(s, l) {
    var f = { value: l }, c = { value: function() {
      --i === 0 && s();
    } };
    t.each(function() {
      var h = cr(this, n), w = h.on;
      w !== A && (e = (A = w).copy(), e._.cancel.push(f), e._.interrupt.push(f), e._.end.push(c)), h.on = e;
    }), i === 0 && s();
  });
}
var MT = 0;
function Kr(A, e, t, n) {
  this._groups = A, this._parents = e, this._name = t, this._id = n;
}
function n0() {
  return ++MT;
}
var Lr = Ds.prototype;
Kr.prototype = {
  constructor: Kr,
  select: wT,
  selectAll: mT,
  selectChild: Lr.selectChild,
  selectChildren: Lr.selectChildren,
  filter: cT,
  merge: fT,
  selection: yT,
  transition: OT,
  call: Lr.call,
  nodes: Lr.nodes,
  node: Lr.node,
  size: Lr.size,
  empty: Lr.empty,
  each: Lr.each,
  on: pT,
  attr: zL,
  attrTween: AT,
  style: ET,
  styleTween: xT,
  text: ST,
  textTween: DT,
  remove: BT,
  tween: kL,
  delay: nT,
  duration: aT,
  ease: sT,
  easeVarying: lT,
  end: NT,
  [Symbol.iterator]: Lr[Symbol.iterator]
};
function PT(A) {
  return ((A *= 2) <= 1 ? A * A * A : (A -= 2) * A * A + 2) / 2;
}
var RT = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: PT
};
function KT(A, e) {
  for (var t; !(t = A.__transition) || !(t = t[e]); )
    if (!(A = A.parentNode))
      throw new Error(`transition ${e} not found`);
  return t;
}
function kT(A) {
  var e, t;
  A instanceof Kr ? (e = A._id, A = A._name) : (e = n0(), (t = RT).time = bp(), A = A == null ? null : A + "");
  for (var n = this._groups, i = n.length, s = 0; s < i; ++s)
    for (var l = n[s], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && Ic(c, A, e, h, l, t || KT(c, e));
  return new Kr(n, this._parents, A, e);
}
Ds.prototype.interrupt = PL;
Ds.prototype.transition = kT;
function $T(A) {
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
function eo(A) {
  return A = ac(Math.abs(A)), A ? A[1] : NaN;
}
function GT(A, e) {
  return function(t, n) {
    for (var i = t.length, s = [], l = 0, f = A[0], c = 0; i > 0 && f > 0 && (c + f + 1 > n && (f = Math.max(1, n - c)), s.push(t.substring(i -= f, i + f)), !((c += f + 1) > n)); )
      f = A[l = (l + 1) % A.length];
    return s.reverse().join(e);
  };
}
function VT(A) {
  return function(e) {
    return e.replace(/[0-9]/g, function(t) {
      return A[+t];
    });
  };
}
var WT = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function oc(A) {
  if (!(e = WT.exec(A))) throw new Error("invalid format: " + A);
  var e;
  return new Ip({
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
oc.prototype = Ip.prototype;
function Ip(A) {
  this.fill = A.fill === void 0 ? " " : A.fill + "", this.align = A.align === void 0 ? ">" : A.align + "", this.sign = A.sign === void 0 ? "-" : A.sign + "", this.symbol = A.symbol === void 0 ? "" : A.symbol + "", this.zero = !!A.zero, this.width = A.width === void 0 ? void 0 : +A.width, this.comma = !!A.comma, this.precision = A.precision === void 0 ? void 0 : +A.precision, this.trim = !!A.trim, this.type = A.type === void 0 ? "" : A.type + "";
}
Ip.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function XT(A) {
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
var r0;
function qT(A, e) {
  var t = ac(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1], s = i - (r0 = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, l = n.length;
  return s === l ? n : s > l ? n + new Array(s - l + 1).join("0") : s > 0 ? n.slice(0, s) + "." + n.slice(s) : "0." + new Array(1 - s).join("0") + ac(A, Math.max(0, e + s - 1))[0];
}
function vw(A, e) {
  var t = ac(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const yw = {
  "%": (A, e) => (A * 100).toFixed(e),
  b: (A) => Math.round(A).toString(2),
  c: (A) => A + "",
  d: $T,
  e: (A, e) => A.toExponential(e),
  f: (A, e) => A.toFixed(e),
  g: (A, e) => A.toPrecision(e),
  o: (A) => Math.round(A).toString(8),
  p: (A, e) => vw(A * 100, e),
  r: vw,
  s: qT,
  X: (A) => Math.round(A).toString(16).toUpperCase(),
  x: (A) => Math.round(A).toString(16)
};
function Cw(A) {
  return A;
}
var Qw = Array.prototype.map, Fw = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function zT(A) {
  var e = A.grouping === void 0 || A.thousands === void 0 ? Cw : GT(Qw.call(A.grouping, Number), A.thousands + ""), t = A.currency === void 0 ? "" : A.currency[0] + "", n = A.currency === void 0 ? "" : A.currency[1] + "", i = A.decimal === void 0 ? "." : A.decimal + "", s = A.numerals === void 0 ? Cw : VT(Qw.call(A.numerals, String)), l = A.percent === void 0 ? "%" : A.percent + "", f = A.minus === void 0 ? "−" : A.minus + "", c = A.nan === void 0 ? "NaN" : A.nan + "";
  function h(B) {
    B = oc(B);
    var p = B.fill, v = B.align, o = B.sign, C = B.symbol, F = B.zero, U = B.width, H = B.comma, D = B.precision, b = B.trim, M = B.type;
    M === "n" ? (H = !0, M = "g") : yw[M] || (D === void 0 && (D = 12), b = !0, M = "g"), (F || p === "0" && v === "=") && (F = !0, p = "0", v = "=");
    var R = C === "$" ? t : C === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", J = C === "$" ? n : /[%p]/.test(M) ? l : "", hA = yw[M], cA = /[defgprs%]/.test(M);
    D = D === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, D)) : Math.max(0, Math.min(20, D));
    function wA(QA) {
      var OA = R, bA = J, q, CA, iA;
      if (M === "c")
        bA = hA(QA) + bA, QA = "";
      else {
        QA = +QA;
        var gA = QA < 0 || 1 / QA < 0;
        if (QA = isNaN(QA) ? c : hA(Math.abs(QA), D), b && (QA = XT(QA)), gA && +QA == 0 && o !== "+" && (gA = !1), OA = (gA ? o === "(" ? o : f : o === "-" || o === "(" ? "" : o) + OA, bA = (M === "s" ? Fw[8 + r0 / 3] : "") + bA + (gA && o === "(" ? ")" : ""), cA) {
          for (q = -1, CA = QA.length; ++q < CA; )
            if (iA = QA.charCodeAt(q), 48 > iA || iA > 57) {
              bA = (iA === 46 ? i + QA.slice(q + 1) : QA.slice(q)) + bA, QA = QA.slice(0, q);
              break;
            }
        }
      }
      H && !F && (QA = e(QA, 1 / 0));
      var IA = OA.length + QA.length + bA.length, HA = IA < U ? new Array(U - IA + 1).join(p) : "";
      switch (H && F && (QA = e(HA + QA, HA.length ? U - bA.length : 1 / 0), HA = ""), v) {
        case "<":
          QA = OA + QA + bA + HA;
          break;
        case "=":
          QA = OA + HA + QA + bA;
          break;
        case "^":
          QA = HA.slice(0, IA = HA.length >> 1) + OA + QA + bA + HA.slice(IA);
          break;
        default:
          QA = HA + OA + QA + bA;
          break;
      }
      return s(QA);
    }
    return wA.toString = function() {
      return B + "";
    }, wA;
  }
  function w(B, p) {
    var v = h((B = oc(B), B.type = "f", B)), o = Math.max(-8, Math.min(8, Math.floor(eo(p) / 3))) * 3, C = Math.pow(10, -o), F = Fw[8 + o / 3];
    return function(U) {
      return v(C * U) + F;
    };
  }
  return {
    format: h,
    formatPrefix: w
  };
}
var rl, i0, a0;
JT({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function JT(A) {
  return rl = zT(A), i0 = rl.format, a0 = rl.formatPrefix, rl;
}
function jT(A) {
  return Math.max(0, -eo(Math.abs(A)));
}
function YT(A, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(eo(e) / 3))) * 3 - eo(Math.abs(A)));
}
function ZT(A, e) {
  return A = Math.abs(A), e = Math.abs(e) - A, Math.max(0, eo(e) - eo(A)) + 1;
}
function AD(A, e) {
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
function eD(A) {
  return function() {
    return A;
  };
}
function tD(A) {
  return +A;
}
var Uw = [0, 1];
function Va(A) {
  return A;
}
function Ad(A, e) {
  return (e -= A = +A) ? function(t) {
    return (t - A) / e;
  } : eD(isNaN(e) ? NaN : 0.5);
}
function nD(A, e) {
  var t;
  return A > e && (t = A, A = e, e = t), function(n) {
    return Math.max(A, Math.min(e, n));
  };
}
function rD(A, e, t) {
  var n = A[0], i = A[1], s = e[0], l = e[1];
  return i < n ? (n = Ad(i, n), s = t(l, s)) : (n = Ad(n, i), s = t(s, l)), function(f) {
    return s(n(f));
  };
}
function iD(A, e, t) {
  var n = Math.min(A.length, e.length) - 1, i = new Array(n), s = new Array(n), l = -1;
  for (A[n] < A[0] && (A = A.slice().reverse(), e = e.slice().reverse()); ++l < n; )
    i[l] = Ad(A[l], A[l + 1]), s[l] = t(e[l], e[l + 1]);
  return function(f) {
    var c = sH(A, f, 1, n) - 1;
    return s[c](i[c](f));
  };
}
function aD(A, e) {
  return e.domain(A.domain()).range(A.range()).interpolate(A.interpolate()).clamp(A.clamp()).unknown(A.unknown());
}
function oD() {
  var A = Uw, e = Uw, t = Ep, n, i, s, l = Va, f, c, h;
  function w() {
    var p = Math.min(A.length, e.length);
    return l !== Va && (l = nD(A[0], A[p - 1])), f = p > 2 ? iD : rD, c = h = null, B;
  }
  function B(p) {
    return p == null || isNaN(p = +p) ? s : (c || (c = f(A.map(n), e, t)))(n(l(p)));
  }
  return B.invert = function(p) {
    return l(i((h || (h = f(e, A.map(n), $n)))(p)));
  }, B.domain = function(p) {
    return arguments.length ? (A = Array.from(p, tD), w()) : A.slice();
  }, B.range = function(p) {
    return arguments.length ? (e = Array.from(p), w()) : e.slice();
  }, B.rangeRound = function(p) {
    return e = Array.from(p), t = QL, w();
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
function sD() {
  return oD()(Va, Va);
}
function uD(A, e, t, n) {
  var i = hH(A, e, t), s;
  switch (n = oc(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(A), Math.abs(e));
      return n.precision == null && !isNaN(s = YT(i, l)) && (n.precision = s), a0(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(s = ZT(i, Math.max(Math.abs(A), Math.abs(e)))) && (n.precision = s - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(s = jT(i)) && (n.precision = s - (n.type === "%") * 2);
      break;
    }
  }
  return i0(n);
}
function lD(A) {
  var e = A.domain;
  return A.ticks = function(t) {
    var n = e();
    return fH(n[0], n[n.length - 1], t ?? 10);
  }, A.tickFormat = function(t, n) {
    var i = e();
    return uD(i[0], i[i.length - 1], t ?? 10, n);
  }, A.nice = function(t) {
    t == null && (t = 10);
    var n = e(), i = 0, s = n.length - 1, l = n[i], f = n[s], c, h, w = 10;
    for (f < l && (h = l, l = f, f = h, h = i, i = s, s = h); w-- > 0; ) {
      if (h = Gh(l, f, t), h === c)
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
function sa() {
  var A = sD();
  return A.copy = function() {
    return aD(A, sa());
  }, AD.apply(A, arguments), lD(A);
}
const il = (A) => () => A;
function cD(A, {
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
function Nr(A, e, t) {
  this.k = A, this.x = e, this.y = t;
}
Nr.prototype = {
  constructor: Nr,
  scale: function(A) {
    return A === 1 ? this : new Nr(this.k * A, this.x, this.y);
  },
  translate: function(A, e) {
    return A === 0 & e === 0 ? this : new Nr(this.k, this.x + this.k * A, this.y + this.k * e);
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
var Hp = new Nr(1, 0, 0);
Gi.prototype = Nr.prototype;
function Gi(A) {
  for (; !A.__zoom; ) if (!(A = A.parentNode)) return Hp;
  return A.__zoom;
}
function sh(A) {
  A.stopImmediatePropagation();
}
function Wo(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function fD(A) {
  return (!A.ctrlKey || A.type === "wheel") && !A.button;
}
function hD() {
  var A = this;
  return A instanceof SVGElement ? (A = A.ownerSVGElement || A, A.hasAttribute("viewBox") ? (A = A.viewBox.baseVal, [[A.x, A.y], [A.x + A.width, A.y + A.height]]) : [[0, 0], [A.width.baseVal.value, A.height.baseVal.value]]) : [[0, 0], [A.clientWidth, A.clientHeight]];
}
function Ew() {
  return this.__zoom || Hp;
}
function dD(A) {
  return -A.deltaY * (A.deltaMode === 1 ? 0.05 : A.deltaMode ? 1 : 2e-3) * (A.ctrlKey ? 10 : 1);
}
function pD() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function gD(A, e, t) {
  var n = A.invertX(e[0][0]) - t[0][0], i = A.invertX(e[1][0]) - t[1][0], s = A.invertY(e[0][1]) - t[0][1], l = A.invertY(e[1][1]) - t[1][1];
  return A.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    l > s ? (s + l) / 2 : Math.min(0, s) || Math.max(0, l)
  );
}
function BD() {
  var A = fD, e = hD, t = gD, n = dD, i = pD, s = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], f = 250, c = HL, h = bc("start", "zoom", "end"), w, B, p, v = 500, o = 150, C = 0, F = 10;
  function U(q) {
    q.property("__zoom", Ew).on("wheel.zoom", hA, { passive: !1 }).on("mousedown.zoom", cA).on("dblclick.zoom", wA).filter(i).on("touchstart.zoom", QA).on("touchmove.zoom", OA).on("touchend.zoom touchcancel.zoom", bA).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  U.transform = function(q, CA, iA, gA) {
    var IA = q.selection ? q.selection() : q;
    IA.property("__zoom", Ew), q !== IA ? M(q, CA, iA, gA) : IA.interrupt().each(function() {
      R(this, arguments).event(gA).start().zoom(null, typeof CA == "function" ? CA.apply(this, arguments) : CA).end();
    });
  }, U.scaleBy = function(q, CA, iA, gA) {
    U.scaleTo(q, function() {
      var IA = this.__zoom.k, HA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
      return IA * HA;
    }, iA, gA);
  }, U.scaleTo = function(q, CA, iA, gA) {
    U.transform(q, function() {
      var IA = e.apply(this, arguments), HA = this.__zoom, uA = iA == null ? b(IA) : typeof iA == "function" ? iA.apply(this, arguments) : iA, T = HA.invert(uA), rA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
      return t(D(H(HA, rA), uA, T), IA, l);
    }, iA, gA);
  }, U.translateBy = function(q, CA, iA, gA) {
    U.transform(q, function() {
      return t(this.__zoom.translate(
        typeof CA == "function" ? CA.apply(this, arguments) : CA,
        typeof iA == "function" ? iA.apply(this, arguments) : iA
      ), e.apply(this, arguments), l);
    }, null, gA);
  }, U.translateTo = function(q, CA, iA, gA, IA) {
    U.transform(q, function() {
      var HA = e.apply(this, arguments), uA = this.__zoom, T = gA == null ? b(HA) : typeof gA == "function" ? gA.apply(this, arguments) : gA;
      return t(Hp.translate(T[0], T[1]).scale(uA.k).translate(
        typeof CA == "function" ? -CA.apply(this, arguments) : -CA,
        typeof iA == "function" ? -iA.apply(this, arguments) : -iA
      ), HA, l);
    }, gA, IA);
  };
  function H(q, CA) {
    return CA = Math.max(s[0], Math.min(s[1], CA)), CA === q.k ? q : new Nr(CA, q.x, q.y);
  }
  function D(q, CA, iA) {
    var gA = CA[0] - iA[0] * q.k, IA = CA[1] - iA[1] * q.k;
    return gA === q.x && IA === q.y ? q : new Nr(q.k, gA, IA);
  }
  function b(q) {
    return [(+q[0][0] + +q[1][0]) / 2, (+q[0][1] + +q[1][1]) / 2];
  }
  function M(q, CA, iA, gA) {
    q.on("start.zoom", function() {
      R(this, arguments).event(gA).start();
    }).on("interrupt.zoom end.zoom", function() {
      R(this, arguments).event(gA).end();
    }).tween("zoom", function() {
      var IA = this, HA = arguments, uA = R(IA, HA).event(gA), T = e.apply(IA, HA), rA = iA == null ? b(T) : typeof iA == "function" ? iA.apply(IA, HA) : iA, j = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), S = IA.__zoom, K = typeof CA == "function" ? CA.apply(IA, HA) : CA, aA = c(S.invert(rA).concat(j / S.k), K.invert(rA).concat(j / K.k));
      return function(EA) {
        if (EA === 1) EA = K;
        else {
          var _A = aA(EA), qA = j / _A[2];
          EA = new Nr(qA, rA[0] - _A[0] * qA, rA[1] - _A[1] * qA);
        }
        uA.zoom(null, EA);
      };
    });
  }
  function R(q, CA, iA) {
    return !iA && q.__zooming || new J(q, CA);
  }
  function J(q, CA) {
    this.that = q, this.args = CA, this.active = 0, this.sourceEvent = null, this.extent = e.apply(q, CA), this.taps = 0;
  }
  J.prototype = {
    event: function(q) {
      return q && (this.sourceEvent = q), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(q, CA) {
      return this.mouse && q !== "mouse" && (this.mouse[1] = CA.invert(this.mouse[0])), this.touch0 && q !== "touch" && (this.touch0[1] = CA.invert(this.touch0[0])), this.touch1 && q !== "touch" && (this.touch1[1] = CA.invert(this.touch1[0])), this.that.__zoom = CA, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(q) {
      var CA = XA(this.that).datum();
      h.call(
        q,
        this.that,
        new cD(q, {
          sourceEvent: this.sourceEvent,
          target: U,
          type: q,
          transform: this.that.__zoom,
          dispatch: h
        }),
        CA
      );
    }
  };
  function hA(q, ...CA) {
    if (!A.apply(this, arguments)) return;
    var iA = R(this, CA).event(q), gA = this.__zoom, IA = Math.max(s[0], Math.min(s[1], gA.k * Math.pow(2, n.apply(this, arguments)))), HA = kn(q);
    if (iA.wheel)
      (iA.mouse[0][0] !== HA[0] || iA.mouse[0][1] !== HA[1]) && (iA.mouse[1] = gA.invert(iA.mouse[0] = HA)), clearTimeout(iA.wheel);
    else {
      if (gA.k === IA) return;
      iA.mouse = [HA, gA.invert(HA)], Kl(this), iA.start();
    }
    Wo(q), iA.wheel = setTimeout(uA, o), iA.zoom("mouse", t(D(H(gA, IA), iA.mouse[0], iA.mouse[1]), iA.extent, l));
    function uA() {
      iA.wheel = null, iA.end();
    }
  }
  function cA(q, ...CA) {
    if (p || !A.apply(this, arguments)) return;
    var iA = q.currentTarget, gA = R(this, CA, !0).event(q), IA = XA(q.view).on("mousemove.zoom", rA, !0).on("mouseup.zoom", j, !0), HA = kn(q, iA), uA = q.clientX, T = q.clientY;
    $v(q.view), sh(q), gA.mouse = [HA, this.__zoom.invert(HA)], Kl(this), gA.start();
    function rA(S) {
      if (Wo(S), !gA.moved) {
        var K = S.clientX - uA, aA = S.clientY - T;
        gA.moved = K * K + aA * aA > C;
      }
      gA.event(S).zoom("mouse", t(D(gA.that.__zoom, gA.mouse[0] = kn(S, iA), gA.mouse[1]), gA.extent, l));
    }
    function j(S) {
      IA.on("mousemove.zoom mouseup.zoom", null), Gv(S.view, gA.moved), Wo(S), gA.event(S).end();
    }
  }
  function wA(q, ...CA) {
    if (A.apply(this, arguments)) {
      var iA = this.__zoom, gA = kn(q.changedTouches ? q.changedTouches[0] : q, this), IA = iA.invert(gA), HA = iA.k * (q.shiftKey ? 0.5 : 2), uA = t(D(H(iA, HA), gA, IA), e.apply(this, CA), l);
      Wo(q), f > 0 ? XA(this).transition().duration(f).call(M, uA, gA, q) : XA(this).call(U.transform, uA, gA, q);
    }
  }
  function QA(q, ...CA) {
    if (A.apply(this, arguments)) {
      var iA = q.touches, gA = iA.length, IA = R(this, CA, q.changedTouches.length === gA).event(q), HA, uA, T, rA;
      for (sh(q), uA = 0; uA < gA; ++uA)
        T = iA[uA], rA = kn(T, this), rA = [rA, this.__zoom.invert(rA), T.identifier], IA.touch0 ? !IA.touch1 && IA.touch0[2] !== rA[2] && (IA.touch1 = rA, IA.taps = 0) : (IA.touch0 = rA, HA = !0, IA.taps = 1 + !!w);
      w && (w = clearTimeout(w)), HA && (IA.taps < 2 && (B = rA[0], w = setTimeout(function() {
        w = null;
      }, v)), Kl(this), IA.start());
    }
  }
  function OA(q, ...CA) {
    if (this.__zooming) {
      var iA = R(this, CA).event(q), gA = q.changedTouches, IA = gA.length, HA, uA, T, rA;
      for (Wo(q), HA = 0; HA < IA; ++HA)
        uA = gA[HA], T = kn(uA, this), iA.touch0 && iA.touch0[2] === uA.identifier ? iA.touch0[0] = T : iA.touch1 && iA.touch1[2] === uA.identifier && (iA.touch1[0] = T);
      if (uA = iA.that.__zoom, iA.touch1) {
        var j = iA.touch0[0], S = iA.touch0[1], K = iA.touch1[0], aA = iA.touch1[1], EA = (EA = K[0] - j[0]) * EA + (EA = K[1] - j[1]) * EA, _A = (_A = aA[0] - S[0]) * _A + (_A = aA[1] - S[1]) * _A;
        uA = H(uA, Math.sqrt(EA / _A)), T = [(j[0] + K[0]) / 2, (j[1] + K[1]) / 2], rA = [(S[0] + aA[0]) / 2, (S[1] + aA[1]) / 2];
      } else if (iA.touch0) T = iA.touch0[0], rA = iA.touch0[1];
      else return;
      iA.zoom("touch", t(D(uA, T, rA), iA.extent, l));
    }
  }
  function bA(q, ...CA) {
    if (this.__zooming) {
      var iA = R(this, CA).event(q), gA = q.changedTouches, IA = gA.length, HA, uA;
      for (sh(q), p && clearTimeout(p), p = setTimeout(function() {
        p = null;
      }, v), HA = 0; HA < IA; ++HA)
        uA = gA[HA], iA.touch0 && iA.touch0[2] === uA.identifier ? delete iA.touch0 : iA.touch1 && iA.touch1[2] === uA.identifier && delete iA.touch1;
      if (iA.touch1 && !iA.touch0 && (iA.touch0 = iA.touch1, delete iA.touch1), iA.touch0) iA.touch0[1] = this.__zoom.invert(iA.touch0[0]);
      else if (iA.end(), iA.taps === 2 && (uA = kn(uA, this), Math.hypot(B[0] - uA[0], B[1] - uA[1]) < F)) {
        var T = XA(this).on("dblclick.zoom");
        T && T.apply(this, arguments);
      }
    }
  }
  return U.wheelDelta = function(q) {
    return arguments.length ? (n = typeof q == "function" ? q : il(+q), U) : n;
  }, U.filter = function(q) {
    return arguments.length ? (A = typeof q == "function" ? q : il(!!q), U) : A;
  }, U.touchable = function(q) {
    return arguments.length ? (i = typeof q == "function" ? q : il(!!q), U) : i;
  }, U.extent = function(q) {
    return arguments.length ? (e = typeof q == "function" ? q : il([[+q[0][0], +q[0][1]], [+q[1][0], +q[1][1]]]), U) : e;
  }, U.scaleExtent = function(q) {
    return arguments.length ? (s[0] = +q[0], s[1] = +q[1], U) : [s[0], s[1]];
  }, U.translateExtent = function(q) {
    return arguments.length ? (l[0][0] = +q[0][0], l[1][0] = +q[1][0], l[0][1] = +q[0][1], l[1][1] = +q[1][1], U) : [[l[0][0], l[0][1]], [l[1][0], l[1][1]]];
  }, U.constrain = function(q) {
    return arguments.length ? (t = q, U) : t;
  }, U.duration = function(q) {
    return arguments.length ? (f = +q, U) : f;
  }, U.interpolate = function(q) {
    return arguments.length ? (c = q, U) : c;
  }, U.on = function() {
    var q = h.on.apply(h, arguments);
    return q === h ? U : q;
  }, U.clickDistance = function(q) {
    return arguments.length ? (C = (q = +q) * q, U) : Math.sqrt(C);
  }, U.tapDistance = function(q) {
    return arguments.length ? (F = +q, U) : F;
  }, U;
}
var o0 = { exports: {} };
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
    }, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, F = /^-ms-/, U = /-([\da-z])/gi, H = function(u, d) {
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
      var u, d, m, y, E, _, I = arguments[0] || {}, P = 1, z = arguments.length, Y = !1;
      for (typeof I == "boolean" && (Y = I, I = arguments[P] || {}, P++), typeof I != "object" && !o.isFunction(I) && (I = {}), P === z && (I = this, P--); P < z; P++)
        if ((E = arguments[P]) != null)
          for (y in E)
            u = I[y], m = E[y], I !== m && (Y && m && (o.isPlainObject(m) || (d = o.isArray(m))) ? (d ? (d = !1, _ = u && o.isArray(u) ? u : []) : _ = u && o.isPlainObject(u) ? u : {}, I[y] = o.extend(Y, _, m)) : m !== void 0 && (I[y] = m));
      return I;
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
        return u.replace(F, "ms-").replace(U, H);
      },
      nodeName: function(u, d) {
        return u.nodeName && u.nodeName.toLowerCase() === d.toLowerCase();
      },
      each: function(u, d) {
        var m, y = 0;
        if (D(u))
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
        return u != null && (D(Object(u)) ? o.merge(
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
        for (var y, E = [], _ = 0, I = u.length, P = !m; _ < I; _++)
          y = !d(u[_], _), y !== P && E.push(u[_]);
        return E;
      },
      // arg is for internal usage only
      map: function(u, d, m) {
        var y, E, _ = 0, I = [];
        if (D(u))
          for (y = u.length; _ < y; _++)
            E = d(u[_], _, m), E != null && I.push(E);
        else
          for (_ in u)
            E = d(u[_], _, m), E != null && I.push(E);
        return l.apply([], I);
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
    function D(u) {
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
        var d, m, y, E, _, I, P, z, Y, nA, FA, TA, UA, oe, ee, le, ht, ze, Jn, kA = "sizzle" + 1 * /* @__PURE__ */ new Date(), ut = u.document, ce = 0, Xe = 0, xn = AA(), ya = AA(), xt = AA(), In = function(N, G) {
          return N === G && (FA = !0), 0;
        }, jn = 1 << 31, Hn = {}.hasOwnProperty, Re = [], It = Re.pop, Hi = Re.push, Sn = Re.push, Uo = Re.slice, mr = function(N, G) {
          for (var Z = 0, dA = N.length; Z < dA; Z++)
            if (N[Z] === G)
              return Z;
          return -1;
        }, Eo = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", De = "[\\x20\\t\\r\\n\\f]", vr = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", gu = "\\[" + De + "*(" + vr + ")(?:" + De + // Operator (capture 2)
        "*([*^$|!~]?=)" + De + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + vr + "))|)" + De + "*\\]", Yn = ":(" + vr + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + gu + ")*)|.*)\\)|)", nf = new RegExp(De + "+", "g"), Ca = new RegExp("^" + De + "+|((?:^|[^\\\\])(?:\\\\.)*)" + De + "+$", "g"), bo = new RegExp("^" + De + "*," + De + "*"), Bu = new RegExp("^" + De + "*([>+~]|" + De + ")" + De + "*"), Zn = new RegExp("=" + De + `*([^\\]'"]*?)` + De + "*\\]", "g"), Qa = new RegExp(Yn), wu = new RegExp("^" + vr + "$"), Fa = {
          ID: new RegExp("^#(" + vr + ")"),
          CLASS: new RegExp("^\\.(" + vr + ")"),
          TAG: new RegExp("^(" + vr + "|[*])"),
          ATTR: new RegExp("^" + gu),
          PSEUDO: new RegExp("^" + Yn),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + De + "*(even|odd|(([+-]|)(\\d*)n|)" + De + "*(?:([+-]|)" + De + "*(\\d+)|))" + De + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + Eo + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + De + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + De + "*((?:-\\d)?\\d*)" + De + "*\\)|)(?=[^-]|$)", "i")
        }, rf = /^(?:input|select|textarea|button)$/i, Ai = /^h\d$/i, wt = /^[^{]+\{\s*\[native \w/, mu = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, _o = /[+~]/, af = /'|\\/g, Ln = new RegExp("\\\\([\\da-f]{1,6}" + De + "?|(" + De + ")|.)", "ig"), Tn = function(N, G, Z) {
          var dA = "0x" + G - 65536;
          return dA !== dA || Z ? G : dA < 0 ? (
            // BMP codepoint
            String.fromCharCode(dA + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(dA >> 10 | 55296, dA & 1023 | 56320)
          );
        }, vu = function() {
          TA();
        };
        try {
          Sn.apply(
            Re = Uo.call(ut.childNodes),
            ut.childNodes
          ), Re[ut.childNodes.length].nodeType;
        } catch {
          Sn = {
            apply: Re.length ? (
              // Leverage slice if possible
              function(G, Z) {
                Hi.apply(G, Uo.call(Z));
              }
            ) : (
              // Support: IE<9
              // Otherwise append directly
              function(G, Z) {
                for (var dA = G.length, oA = 0; G[dA++] = Z[oA++]; )
                  ;
                G.length = dA - 1;
              }
            )
          };
        }
        function Ie(N, G, Z, dA) {
          var oA, yA, BA, LA, VA, ae, WA, te, he = G && G.ownerDocument, Le = G ? G.nodeType : 9;
          if (Z = Z || [], typeof N != "string" || !N || Le !== 1 && Le !== 9 && Le !== 11)
            return Z;
          if (!dA && ((G ? G.ownerDocument || G : ut) !== UA && TA(G), G = G || UA, ee)) {
            if (Le !== 11 && (ae = mu.exec(N)))
              if (oA = ae[1]) {
                if (Le === 9)
                  if (BA = G.getElementById(oA)) {
                    if (BA.id === oA)
                      return Z.push(BA), Z;
                  } else
                    return Z;
                else if (he && (BA = he.getElementById(oA)) && Jn(G, BA) && BA.id === oA)
                  return Z.push(BA), Z;
              } else {
                if (ae[2])
                  return Sn.apply(Z, G.getElementsByTagName(N)), Z;
                if ((oA = ae[3]) && m.getElementsByClassName && G.getElementsByClassName)
                  return Sn.apply(Z, G.getElementsByClassName(oA)), Z;
              }
            if (m.qsa && !xt[N + " "] && (!le || !le.test(N))) {
              if (Le !== 1)
                he = G, te = N;
              else if (G.nodeName.toLowerCase() !== "object") {
                for ((LA = G.getAttribute("id")) ? LA = LA.replace(af, "\\$&") : G.setAttribute("id", LA = kA), WA = I(N), yA = WA.length, VA = wu.test(LA) ? "#" + LA : "[id='" + LA + "']"; yA--; )
                  WA[yA] = VA + " " + mt(WA[yA]);
                te = WA.join(","), he = _o.test(N) && Si(G.parentNode) || G;
              }
              if (te)
                try {
                  return Sn.apply(
                    Z,
                    he.querySelectorAll(te)
                  ), Z;
                } catch {
                } finally {
                  LA === kA && G.removeAttribute("id");
                }
            }
          }
          return z(N.replace(Ca, "$1"), G, Z, dA);
        }
        function AA() {
          var N = [];
          function G(Z, dA) {
            return N.push(Z + " ") > y.cacheLength && delete G[N.shift()], G[Z + " "] = dA;
          }
          return G;
        }
        function fA(N) {
          return N[kA] = !0, N;
        }
        function sA(N) {
          var G = UA.createElement("div");
          try {
            return !!N(G);
          } catch {
            return !1;
          } finally {
            G.parentNode && G.parentNode.removeChild(G), G = null;
          }
        }
        function PA(N, G) {
          for (var Z = N.split("|"), dA = Z.length; dA--; )
            y.attrHandle[Z[dA]] = G;
        }
        function se(N, G) {
          var Z = G && N, dA = Z && N.nodeType === 1 && G.nodeType === 1 && (~G.sourceIndex || jn) - (~N.sourceIndex || jn);
          if (dA)
            return dA;
          if (Z) {
            for (; Z = Z.nextSibling; )
              if (Z === G)
                return -1;
          }
          return N ? 1 : -1;
        }
        function He(N) {
          return function(G) {
            var Z = G.nodeName.toLowerCase();
            return Z === "input" && G.type === N;
          };
        }
        function At(N) {
          return function(G) {
            var Z = G.nodeName.toLowerCase();
            return (Z === "input" || Z === "button") && G.type === N;
          };
        }
        function be(N) {
          return fA(function(G) {
            return G = +G, fA(function(Z, dA) {
              for (var oA, yA = N([], Z.length, G), BA = yA.length; BA--; )
                Z[oA = yA[BA]] && (Z[oA] = !(dA[oA] = Z[oA]));
            });
          });
        }
        function Si(N) {
          return N && typeof N.getElementsByTagName < "u" && N;
        }
        m = Ie.support = {}, _ = Ie.isXML = function(N) {
          var G = N && (N.ownerDocument || N).documentElement;
          return G ? G.nodeName !== "HTML" : !1;
        }, TA = Ie.setDocument = function(N) {
          var G, Z, dA = N ? N.ownerDocument || N : ut;
          return dA === UA || dA.nodeType !== 9 || !dA.documentElement || (UA = dA, oe = UA.documentElement, ee = !_(UA), (Z = UA.defaultView) && Z.top !== Z && (Z.addEventListener ? Z.addEventListener("unload", vu, !1) : Z.attachEvent && Z.attachEvent("onunload", vu)), m.attributes = sA(function(oA) {
            return oA.className = "i", !oA.getAttribute("className");
          }), m.getElementsByTagName = sA(function(oA) {
            return oA.appendChild(UA.createComment("")), !oA.getElementsByTagName("*").length;
          }), m.getElementsByClassName = wt.test(UA.getElementsByClassName), m.getById = sA(function(oA) {
            return oe.appendChild(oA).id = kA, !UA.getElementsByName || !UA.getElementsByName(kA).length;
          }), m.getById ? (y.find.ID = function(oA, yA) {
            if (typeof yA.getElementById < "u" && ee) {
              var BA = yA.getElementById(oA);
              return BA ? [BA] : [];
            }
          }, y.filter.ID = function(oA) {
            var yA = oA.replace(Ln, Tn);
            return function(BA) {
              return BA.getAttribute("id") === yA;
            };
          }) : (delete y.find.ID, y.filter.ID = function(oA) {
            var yA = oA.replace(Ln, Tn);
            return function(BA) {
              var LA = typeof BA.getAttributeNode < "u" && BA.getAttributeNode("id");
              return LA && LA.value === yA;
            };
          }), y.find.TAG = m.getElementsByTagName ? function(oA, yA) {
            if (typeof yA.getElementsByTagName < "u")
              return yA.getElementsByTagName(oA);
            if (m.qsa)
              return yA.querySelectorAll(oA);
          } : function(oA, yA) {
            var BA, LA = [], VA = 0, ae = yA.getElementsByTagName(oA);
            if (oA === "*") {
              for (; BA = ae[VA++]; )
                BA.nodeType === 1 && LA.push(BA);
              return LA;
            }
            return ae;
          }, y.find.CLASS = m.getElementsByClassName && function(oA, yA) {
            if (typeof yA.getElementsByClassName < "u" && ee)
              return yA.getElementsByClassName(oA);
          }, ht = [], le = [], (m.qsa = wt.test(UA.querySelectorAll)) && (sA(function(oA) {
            oe.appendChild(oA).innerHTML = "<a id='" + kA + "'></a><select id='" + kA + "-\r\\' msallowcapture=''><option selected=''></option></select>", oA.querySelectorAll("[msallowcapture^='']").length && le.push("[*^$]=" + De + `*(?:''|"")`), oA.querySelectorAll("[selected]").length || le.push("\\[" + De + "*(?:value|" + Eo + ")"), oA.querySelectorAll("[id~=" + kA + "-]").length || le.push("~="), oA.querySelectorAll(":checked").length || le.push(":checked"), oA.querySelectorAll("a#" + kA + "+*").length || le.push(".#.+[+~]");
          }), sA(function(oA) {
            var yA = UA.createElement("input");
            yA.setAttribute("type", "hidden"), oA.appendChild(yA).setAttribute("name", "D"), oA.querySelectorAll("[name=d]").length && le.push("name" + De + "*[*^$|!~]?="), oA.querySelectorAll(":enabled").length || le.push(":enabled", ":disabled"), oA.querySelectorAll("*,:x"), le.push(",.*:");
          })), (m.matchesSelector = wt.test(ze = oe.matches || oe.webkitMatchesSelector || oe.mozMatchesSelector || oe.oMatchesSelector || oe.msMatchesSelector)) && sA(function(oA) {
            m.disconnectedMatch = ze.call(oA, "div"), ze.call(oA, "[s!='']:x"), ht.push("!=", Yn);
          }), le = le.length && new RegExp(le.join("|")), ht = ht.length && new RegExp(ht.join("|")), G = wt.test(oe.compareDocumentPosition), Jn = G || wt.test(oe.contains) ? function(oA, yA) {
            var BA = oA.nodeType === 9 ? oA.documentElement : oA, LA = yA && yA.parentNode;
            return oA === LA || !!(LA && LA.nodeType === 1 && (BA.contains ? BA.contains(LA) : oA.compareDocumentPosition && oA.compareDocumentPosition(LA) & 16));
          } : function(oA, yA) {
            if (yA) {
              for (; yA = yA.parentNode; )
                if (yA === oA)
                  return !0;
            }
            return !1;
          }, In = G ? function(oA, yA) {
            if (oA === yA)
              return FA = !0, 0;
            var BA = !oA.compareDocumentPosition - !yA.compareDocumentPosition;
            return BA || (BA = (oA.ownerDocument || oA) === (yA.ownerDocument || yA) ? oA.compareDocumentPosition(yA) : (
              // Otherwise we know they are disconnected
              1
            ), BA & 1 || !m.sortDetached && yA.compareDocumentPosition(oA) === BA ? oA === UA || oA.ownerDocument === ut && Jn(ut, oA) ? -1 : yA === UA || yA.ownerDocument === ut && Jn(ut, yA) ? 1 : nA ? mr(nA, oA) - mr(nA, yA) : 0 : BA & 4 ? -1 : 1);
          } : function(oA, yA) {
            if (oA === yA)
              return FA = !0, 0;
            var BA, LA = 0, VA = oA.parentNode, ae = yA.parentNode, WA = [oA], te = [yA];
            if (!VA || !ae)
              return oA === UA ? -1 : yA === UA ? 1 : VA ? -1 : ae ? 1 : nA ? mr(nA, oA) - mr(nA, yA) : 0;
            if (VA === ae)
              return se(oA, yA);
            for (BA = oA; BA = BA.parentNode; )
              WA.unshift(BA);
            for (BA = yA; BA = BA.parentNode; )
              te.unshift(BA);
            for (; WA[LA] === te[LA]; )
              LA++;
            return LA ? (
              // Do a sibling check if the nodes have a common ancestor
              se(WA[LA], te[LA])
            ) : (
              // Otherwise nodes in our document sort first
              WA[LA] === ut ? -1 : te[LA] === ut ? 1 : 0
            );
          }), UA;
        }, Ie.matches = function(N, G) {
          return Ie(N, null, null, G);
        }, Ie.matchesSelector = function(N, G) {
          if ((N.ownerDocument || N) !== UA && TA(N), G = G.replace(Zn, "='$1']"), m.matchesSelector && ee && !xt[G + " "] && (!ht || !ht.test(G)) && (!le || !le.test(G)))
            try {
              var Z = ze.call(N, G);
              if (Z || m.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              N.document && N.document.nodeType !== 11)
                return Z;
            } catch {
            }
          return Ie(G, UA, null, [N]).length > 0;
        }, Ie.contains = function(N, G) {
          return (N.ownerDocument || N) !== UA && TA(N), Jn(N, G);
        }, Ie.attr = function(N, G) {
          (N.ownerDocument || N) !== UA && TA(N);
          var Z = y.attrHandle[G.toLowerCase()], dA = Z && Hn.call(y.attrHandle, G.toLowerCase()) ? Z(N, G, !ee) : void 0;
          return dA !== void 0 ? dA : m.attributes || !ee ? N.getAttribute(G) : (dA = N.getAttributeNode(G)) && dA.specified ? dA.value : null;
        }, Ie.error = function(N) {
          throw new Error("Syntax error, unrecognized expression: " + N);
        }, Ie.uniqueSort = function(N) {
          var G, Z = [], dA = 0, oA = 0;
          if (FA = !m.detectDuplicates, nA = !m.sortStable && N.slice(0), N.sort(In), FA) {
            for (; G = N[oA++]; )
              G === N[oA] && (dA = Z.push(oA));
            for (; dA--; )
              N.splice(Z[dA], 1);
          }
          return nA = null, N;
        }, E = Ie.getText = function(N) {
          var G, Z = "", dA = 0, oA = N.nodeType;
          if (oA) {
            if (oA === 1 || oA === 9 || oA === 11) {
              if (typeof N.textContent == "string")
                return N.textContent;
              for (N = N.firstChild; N; N = N.nextSibling)
                Z += E(N);
            } else if (oA === 3 || oA === 4)
              return N.nodeValue;
          } else for (; G = N[dA++]; )
            Z += E(G);
          return Z;
        }, y = Ie.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: fA,
          match: Fa,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(N) {
              return N[1] = N[1].replace(Ln, Tn), N[3] = (N[3] || N[4] || N[5] || "").replace(Ln, Tn), N[2] === "~=" && (N[3] = " " + N[3] + " "), N.slice(0, 4);
            },
            CHILD: function(N) {
              return N[1] = N[1].toLowerCase(), N[1].slice(0, 3) === "nth" ? (N[3] || Ie.error(N[0]), N[4] = +(N[4] ? N[5] + (N[6] || 1) : 2 * (N[3] === "even" || N[3] === "odd")), N[5] = +(N[7] + N[8] || N[3] === "odd")) : N[3] && Ie.error(N[0]), N;
            },
            PSEUDO: function(N) {
              var G, Z = !N[6] && N[2];
              return Fa.CHILD.test(N[0]) ? null : (N[3] ? N[2] = N[4] || N[5] || "" : Z && Qa.test(Z) && // Get excess from tokenize (recursively)
              (G = I(Z, !0)) && // advance to the next closing parenthesis
              (G = Z.indexOf(")", Z.length - G) - Z.length) && (N[0] = N[0].slice(0, G), N[2] = Z.slice(0, G)), N.slice(0, 3));
            }
          },
          filter: {
            TAG: function(N) {
              var G = N.replace(Ln, Tn).toLowerCase();
              return N === "*" ? function() {
                return !0;
              } : function(Z) {
                return Z.nodeName && Z.nodeName.toLowerCase() === G;
              };
            },
            CLASS: function(N) {
              var G = xn[N + " "];
              return G || (G = new RegExp("(^|" + De + ")" + N + "(" + De + "|$)")) && xn(N, function(Z) {
                return G.test(typeof Z.className == "string" && Z.className || typeof Z.getAttribute < "u" && Z.getAttribute("class") || "");
              });
            },
            ATTR: function(N, G, Z) {
              return function(dA) {
                var oA = Ie.attr(dA, N);
                return oA == null ? G === "!=" : G ? (oA += "", G === "=" ? oA === Z : G === "!=" ? oA !== Z : G === "^=" ? Z && oA.indexOf(Z) === 0 : G === "*=" ? Z && oA.indexOf(Z) > -1 : G === "$=" ? Z && oA.slice(-Z.length) === Z : G === "~=" ? (" " + oA.replace(nf, " ") + " ").indexOf(Z) > -1 : G === "|=" ? oA === Z || oA.slice(0, Z.length + 1) === Z + "-" : !1) : !0;
              };
            },
            CHILD: function(N, G, Z, dA, oA) {
              var yA = N.slice(0, 3) !== "nth", BA = N.slice(-4) !== "last", LA = G === "of-type";
              return dA === 1 && oA === 0 ? (
                // Shortcut for :nth-*(n)
                function(VA) {
                  return !!VA.parentNode;
                }
              ) : function(VA, ae, WA) {
                var te, he, Le, YA, ke, et, Mt = yA !== BA ? "nextSibling" : "previousSibling", Ve = VA.parentNode, Li = LA && VA.nodeName.toLowerCase(), Ar = !WA && !LA, dt = !1;
                if (Ve) {
                  if (yA) {
                    for (; Mt; ) {
                      for (YA = VA; YA = YA[Mt]; )
                        if (LA ? YA.nodeName.toLowerCase() === Li : YA.nodeType === 1)
                          return !1;
                      et = Mt = N === "only" && !et && "nextSibling";
                    }
                    return !0;
                  }
                  if (et = [BA ? Ve.firstChild : Ve.lastChild], BA && Ar) {
                    for (YA = Ve, Le = YA[kA] || (YA[kA] = {}), he = Le[YA.uniqueID] || (Le[YA.uniqueID] = {}), te = he[N] || [], ke = te[0] === ce && te[1], dt = ke && te[2], YA = ke && Ve.childNodes[ke]; YA = ++ke && YA && YA[Mt] || // Fallback to seeking `elem` from the start
                    (dt = ke = 0) || et.pop(); )
                      if (YA.nodeType === 1 && ++dt && YA === VA) {
                        he[N] = [ce, ke, dt];
                        break;
                      }
                  } else if (Ar && (YA = VA, Le = YA[kA] || (YA[kA] = {}), he = Le[YA.uniqueID] || (Le[YA.uniqueID] = {}), te = he[N] || [], ke = te[0] === ce && te[1], dt = ke), dt === !1)
                    for (; (YA = ++ke && YA && YA[Mt] || (dt = ke = 0) || et.pop()) && !((LA ? YA.nodeName.toLowerCase() === Li : YA.nodeType === 1) && ++dt && (Ar && (Le = YA[kA] || (YA[kA] = {}), he = Le[YA.uniqueID] || (Le[YA.uniqueID] = {}), he[N] = [ce, dt]), YA === VA)); )
                      ;
                  return dt -= oA, dt === dA || dt % dA === 0 && dt / dA >= 0;
                }
              };
            },
            PSEUDO: function(N, G) {
              var Z, dA = y.pseudos[N] || y.setFilters[N.toLowerCase()] || Ie.error("unsupported pseudo: " + N);
              return dA[kA] ? dA(G) : dA.length > 1 ? (Z = [N, N, "", G], y.setFilters.hasOwnProperty(N.toLowerCase()) ? fA(function(oA, yA) {
                for (var BA, LA = dA(oA, G), VA = LA.length; VA--; )
                  BA = mr(oA, LA[VA]), oA[BA] = !(yA[BA] = LA[VA]);
              }) : function(oA) {
                return dA(oA, 0, Z);
              }) : dA;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: fA(function(N) {
              var G = [], Z = [], dA = P(N.replace(Ca, "$1"));
              return dA[kA] ? fA(function(oA, yA, BA, LA) {
                for (var VA, ae = dA(oA, null, LA, []), WA = oA.length; WA--; )
                  (VA = ae[WA]) && (oA[WA] = !(yA[WA] = VA));
              }) : function(oA, yA, BA) {
                return G[0] = oA, dA(G, null, BA, Z), G[0] = null, !Z.pop();
              };
            }),
            has: fA(function(N) {
              return function(G) {
                return Ie(N, G).length > 0;
              };
            }),
            contains: fA(function(N) {
              return N = N.replace(Ln, Tn), function(G) {
                return (G.textContent || G.innerText || E(G)).indexOf(N) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            lang: fA(function(N) {
              return wu.test(N || "") || Ie.error("unsupported lang: " + N), N = N.replace(Ln, Tn).toLowerCase(), function(G) {
                var Z;
                do
                  if (Z = ee ? G.lang : G.getAttribute("xml:lang") || G.getAttribute("lang"))
                    return Z = Z.toLowerCase(), Z === N || Z.indexOf(N + "-") === 0;
                while ((G = G.parentNode) && G.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(N) {
              var G = u.location && u.location.hash;
              return G && G.slice(1) === N.id;
            },
            root: function(N) {
              return N === oe;
            },
            focus: function(N) {
              return N === UA.activeElement && (!UA.hasFocus || UA.hasFocus()) && !!(N.type || N.href || ~N.tabIndex);
            },
            // Boolean properties
            enabled: function(N) {
              return N.disabled === !1;
            },
            disabled: function(N) {
              return N.disabled === !0;
            },
            checked: function(N) {
              var G = N.nodeName.toLowerCase();
              return G === "input" && !!N.checked || G === "option" && !!N.selected;
            },
            selected: function(N) {
              return N.parentNode && N.parentNode.selectedIndex, N.selected === !0;
            },
            // Contents
            empty: function(N) {
              for (N = N.firstChild; N; N = N.nextSibling)
                if (N.nodeType < 6)
                  return !1;
              return !0;
            },
            parent: function(N) {
              return !y.pseudos.empty(N);
            },
            // Element/input types
            header: function(N) {
              return Ai.test(N.nodeName);
            },
            input: function(N) {
              return rf.test(N.nodeName);
            },
            button: function(N) {
              var G = N.nodeName.toLowerCase();
              return G === "input" && N.type === "button" || G === "button";
            },
            text: function(N) {
              var G;
              return N.nodeName.toLowerCase() === "input" && N.type === "text" && // Support: IE<8
              // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
              ((G = N.getAttribute("type")) == null || G.toLowerCase() === "text");
            },
            // Position-in-collection
            first: be(function() {
              return [0];
            }),
            last: be(function(N, G) {
              return [G - 1];
            }),
            eq: be(function(N, G, Z) {
              return [Z < 0 ? Z + G : Z];
            }),
            even: be(function(N, G) {
              for (var Z = 0; Z < G; Z += 2)
                N.push(Z);
              return N;
            }),
            odd: be(function(N, G) {
              for (var Z = 1; Z < G; Z += 2)
                N.push(Z);
              return N;
            }),
            lt: be(function(N, G, Z) {
              for (var dA = Z < 0 ? Z + G : Z; --dA >= 0; )
                N.push(dA);
              return N;
            }),
            gt: be(function(N, G, Z) {
              for (var dA = Z < 0 ? Z + G : Z; ++dA < G; )
                N.push(dA);
              return N;
            })
          }
        }, y.pseudos.nth = y.pseudos.eq;
        for (d in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          y.pseudos[d] = He(d);
        for (d in { submit: !0, reset: !0 })
          y.pseudos[d] = At(d);
        function yu() {
        }
        yu.prototype = y.filters = y.pseudos, y.setFilters = new yu(), I = Ie.tokenize = function(N, G) {
          var Z, dA, oA, yA, BA, LA, VA, ae = ya[N + " "];
          if (ae)
            return G ? 0 : ae.slice(0);
          for (BA = N, LA = [], VA = y.preFilter; BA; ) {
            (!Z || (dA = bo.exec(BA))) && (dA && (BA = BA.slice(dA[0].length) || BA), LA.push(oA = [])), Z = !1, (dA = Bu.exec(BA)) && (Z = dA.shift(), oA.push({
              value: Z,
              // Cast descendant combinators to space
              type: dA[0].replace(Ca, " ")
            }), BA = BA.slice(Z.length));
            for (yA in y.filter)
              (dA = Fa[yA].exec(BA)) && (!VA[yA] || (dA = VA[yA](dA))) && (Z = dA.shift(), oA.push({
                value: Z,
                type: yA,
                matches: dA
              }), BA = BA.slice(Z.length));
            if (!Z)
              break;
          }
          return G ? BA.length : BA ? Ie.error(N) : (
            // Cache the tokens
            ya(N, LA).slice(0)
          );
        };
        function mt(N) {
          for (var G = 0, Z = N.length, dA = ""; G < Z; G++)
            dA += N[G].value;
          return dA;
        }
        function ei(N, G, Z) {
          var dA = G.dir, oA = Z && dA === "parentNode", yA = Xe++;
          return G.first ? (
            // Check against closest ancestor/preceding element
            function(BA, LA, VA) {
              for (; BA = BA[dA]; )
                if (BA.nodeType === 1 || oA)
                  return N(BA, LA, VA);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(BA, LA, VA) {
              var ae, WA, te, he = [ce, yA];
              if (VA) {
                for (; BA = BA[dA]; )
                  if ((BA.nodeType === 1 || oA) && N(BA, LA, VA))
                    return !0;
              } else
                for (; BA = BA[dA]; )
                  if (BA.nodeType === 1 || oA) {
                    if (te = BA[kA] || (BA[kA] = {}), WA = te[BA.uniqueID] || (te[BA.uniqueID] = {}), (ae = WA[dA]) && ae[0] === ce && ae[1] === yA)
                      return he[2] = ae[2];
                    if (WA[dA] = he, he[2] = N(BA, LA, VA))
                      return !0;
                  }
            }
          );
        }
        function xo(N) {
          return N.length > 1 ? function(G, Z, dA) {
            for (var oA = N.length; oA--; )
              if (!N[oA](G, Z, dA))
                return !1;
            return !0;
          } : N[0];
        }
        function ti(N, G, Z) {
          for (var dA = 0, oA = G.length; dA < oA; dA++)
            Ie(N, G[dA], Z);
          return Z;
        }
        function yr(N, G, Z, dA, oA) {
          for (var yA, BA = [], LA = 0, VA = N.length, ae = G != null; LA < VA; LA++)
            (yA = N[LA]) && (!Z || Z(yA, dA, oA)) && (BA.push(yA), ae && G.push(LA));
          return BA;
        }
        function ni(N, G, Z, dA, oA, yA) {
          return dA && !dA[kA] && (dA = ni(dA)), oA && !oA[kA] && (oA = ni(oA, yA)), fA(function(BA, LA, VA, ae) {
            var WA, te, he, Le = [], YA = [], ke = LA.length, et = BA || ti(G || "*", VA.nodeType ? [VA] : VA, []), Mt = N && (BA || !G) ? yr(et, Le, N, VA, ae) : et, Ve = Z ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              oA || (BA ? N : ke || dA) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                LA
              )
            ) : Mt;
            if (Z && Z(Mt, Ve, VA, ae), dA)
              for (WA = yr(Ve, YA), dA(WA, [], VA, ae), te = WA.length; te--; )
                (he = WA[te]) && (Ve[YA[te]] = !(Mt[YA[te]] = he));
            if (BA) {
              if (oA || N) {
                if (oA) {
                  for (WA = [], te = Ve.length; te--; )
                    (he = Ve[te]) && WA.push(Mt[te] = he);
                  oA(null, Ve = [], WA, ae);
                }
                for (te = Ve.length; te--; )
                  (he = Ve[te]) && (WA = oA ? mr(BA, he) : Le[te]) > -1 && (BA[WA] = !(LA[WA] = he));
              }
            } else
              Ve = yr(
                Ve === LA ? Ve.splice(ke, Ve.length) : Ve
              ), oA ? oA(null, LA, Ve, ae) : Sn.apply(LA, Ve);
          });
        }
        function Se(N) {
          for (var G, Z, dA, oA = N.length, yA = y.relative[N[0].type], BA = yA || y.relative[" "], LA = yA ? 1 : 0, VA = ei(function(te) {
            return te === G;
          }, BA, !0), ae = ei(function(te) {
            return mr(G, te) > -1;
          }, BA, !0), WA = [function(te, he, Le) {
            var YA = !yA && (Le || he !== Y) || ((G = he).nodeType ? VA(te, he, Le) : ae(te, he, Le));
            return G = null, YA;
          }]; LA < oA; LA++)
            if (Z = y.relative[N[LA].type])
              WA = [ei(xo(WA), Z)];
            else {
              if (Z = y.filter[N[LA].type].apply(null, N[LA].matches), Z[kA]) {
                for (dA = ++LA; dA < oA && !y.relative[N[dA].type]; dA++)
                  ;
                return ni(
                  LA > 1 && xo(WA),
                  LA > 1 && mt(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    N.slice(0, LA - 1).concat({ value: N[LA - 2].type === " " ? "*" : "" })
                  ).replace(Ca, "$1"),
                  Z,
                  LA < dA && Se(N.slice(LA, dA)),
                  dA < oA && Se(N = N.slice(dA)),
                  dA < oA && mt(N)
                );
              }
              WA.push(Z);
            }
          return xo(WA);
        }
        function of(N, G) {
          var Z = G.length > 0, dA = N.length > 0, oA = function(yA, BA, LA, VA, ae) {
            var WA, te, he, Le = 0, YA = "0", ke = yA && [], et = [], Mt = Y, Ve = yA || dA && y.find.TAG("*", ae), Li = ce += Mt == null ? 1 : Math.random() || 0.1, Ar = Ve.length;
            for (ae && (Y = BA === UA || BA || ae); YA !== Ar && (WA = Ve[YA]) != null; YA++) {
              if (dA && WA) {
                for (te = 0, !BA && WA.ownerDocument !== UA && (TA(WA), LA = !ee); he = N[te++]; )
                  if (he(WA, BA || UA, LA)) {
                    VA.push(WA);
                    break;
                  }
                ae && (ce = Li);
              }
              Z && ((WA = !he && WA) && Le--, yA && ke.push(WA));
            }
            if (Le += YA, Z && YA !== Le) {
              for (te = 0; he = G[te++]; )
                he(ke, et, BA, LA);
              if (yA) {
                if (Le > 0)
                  for (; YA--; )
                    ke[YA] || et[YA] || (et[YA] = It.call(VA));
                et = yr(et);
              }
              Sn.apply(VA, et), ae && !yA && et.length > 0 && Le + G.length > 1 && Ie.uniqueSort(VA);
            }
            return ae && (ce = Li, Y = Mt), ke;
          };
          return Z ? fA(oA) : oA;
        }
        return P = Ie.compile = function(N, G) {
          var Z, dA = [], oA = [], yA = xt[N + " "];
          if (!yA) {
            for (G || (G = I(N)), Z = G.length; Z--; )
              yA = Se(G[Z]), yA[kA] ? dA.push(yA) : oA.push(yA);
            yA = xt(N, of(oA, dA)), yA.selector = N;
          }
          return yA;
        }, z = Ie.select = function(N, G, Z, dA) {
          var oA, yA, BA, LA, VA, ae = typeof N == "function" && N, WA = !dA && I(N = ae.selector || N);
          if (Z = Z || [], WA.length === 1) {
            if (yA = WA[0] = WA[0].slice(0), yA.length > 2 && (BA = yA[0]).type === "ID" && m.getById && G.nodeType === 9 && ee && y.relative[yA[1].type]) {
              if (G = (y.find.ID(BA.matches[0].replace(Ln, Tn), G) || [])[0], G)
                ae && (G = G.parentNode);
              else return Z;
              N = N.slice(yA.shift().value.length);
            }
            for (oA = Fa.needsContext.test(N) ? 0 : yA.length; oA-- && (BA = yA[oA], !y.relative[LA = BA.type]); )
              if ((VA = y.find[LA]) && (dA = VA(
                BA.matches[0].replace(Ln, Tn),
                _o.test(yA[0].type) && Si(G.parentNode) || G
              ))) {
                if (yA.splice(oA, 1), N = dA.length && mt(yA), !N)
                  return Sn.apply(Z, dA), Z;
                break;
              }
          }
          return (ae || P(N, WA))(
            dA,
            G,
            !ee,
            Z,
            !G || _o.test(N) && Si(G.parentNode) || G
          ), Z;
        }, m.sortStable = kA.split("").sort(In).join("") === kA, m.detectDuplicates = !!FA, TA(), m.sortDetached = sA(function(N) {
          return N.compareDocumentPosition(UA.createElement("div")) & 1;
        }), sA(function(N) {
          return N.innerHTML = "<a href='#'></a>", N.firstChild.getAttribute("href") === "#";
        }) || PA("type|href|height|width", function(N, G, Z) {
          if (!Z)
            return N.getAttribute(G, G.toLowerCase() === "type" ? 1 : 2);
        }), (!m.attributes || !sA(function(N) {
          return N.innerHTML = "<input/>", N.firstChild.setAttribute("value", ""), N.firstChild.getAttribute("value") === "";
        })) && PA("value", function(N, G, Z) {
          if (!Z && N.nodeName.toLowerCase() === "input")
            return N.defaultValue;
        }), sA(function(N) {
          return N.getAttribute("disabled") == null;
        }) || PA(Eo, function(N, G, Z) {
          var dA;
          if (!Z)
            return N[G] === !0 ? G.toLowerCase() : (dA = N.getAttributeNode(G)) && dA.specified ? dA.value : null;
        }), Ie;
      }(e)
    );
    o.find = b, o.expr = b.selectors, o.expr[":"] = o.expr.pseudos, o.uniqueSort = o.unique = b.uniqueSort, o.text = b.getText, o.isXMLDoc = b.isXML, o.contains = b.contains;
    var M = function(u, d, m) {
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
    }, J = o.expr.match.needsContext, hA = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, cA = /^.[^:#\[\.,]*$/;
    function wA(u, d, m) {
      if (o.isFunction(d))
        return o.grep(u, function(y, E) {
          return !!d.call(y, E, y) !== m;
        });
      if (d.nodeType)
        return o.grep(u, function(y) {
          return y === d !== m;
        });
      if (typeof d == "string") {
        if (cA.test(d))
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
        return this.pushStack(wA(this, u || [], !1));
      },
      not: function(u) {
        return this.pushStack(wA(this, u || [], !0));
      },
      is: function(u) {
        return !!wA(
          this,
          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof u == "string" && J.test(u) ? o(u) : u || [],
          !1
        ).length;
      }
    });
    var QA, OA = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, bA = o.fn.init = function(u, d, m) {
      var y, E;
      if (!u)
        return this;
      if (m = m || QA, typeof u == "string")
        if (u.charAt(0) === "<" && u.charAt(u.length - 1) === ">" && u.length >= 3 ? y = [null, u, null] : y = OA.exec(u), y && (y[1] || !d))
          if (y[1]) {
            if (d = d instanceof o ? d[0] : d, o.merge(this, o.parseHTML(
              y[1],
              d && d.nodeType ? d.ownerDocument || d : i,
              !0
            )), hA.test(y[1]) && o.isPlainObject(d))
              for (y in d)
                o.isFunction(this[y]) ? this[y](d[y]) : this.attr(y, d[y]);
            return this;
          } else {
            if (E = i.getElementById(y[2]), E && E.parentNode) {
              if (E.id !== y[2])
                return QA.find(u);
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
    bA.prototype = o.fn, QA = o(i);
    var q = /^(?:parents|prev(?:Until|All))/, CA = {
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
        for (var m, y = 0, E = this.length, _ = [], I = J.test(u) || typeof u != "string" ? o(u, d || this.context) : 0; y < E; y++)
          for (m = this[y]; m && m !== d; m = m.parentNode)
            if (m.nodeType < 11 && (I ? I.index(m) > -1 : (
              // Don't pass non-elements to Sizzle
              m.nodeType === 1 && o.find.matchesSelector(m, u)
            ))) {
              _.push(m);
              break;
            }
        return this.pushStack(_.length > 1 ? o.uniqueSort(_) : _);
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
    function iA(u, d) {
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
        return M(u, "parentNode");
      },
      parentsUntil: function(u, d, m) {
        return M(u, "parentNode", m);
      },
      next: function(u) {
        return iA(u, "nextSibling");
      },
      prev: function(u) {
        return iA(u, "previousSibling");
      },
      nextAll: function(u) {
        return M(u, "nextSibling");
      },
      prevAll: function(u) {
        return M(u, "previousSibling");
      },
      nextUntil: function(u, d, m) {
        return M(u, "nextSibling", m);
      },
      prevUntil: function(u, d, m) {
        return M(u, "previousSibling", m);
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
        return u.slice(-5) !== "Until" && (y = m), y && typeof y == "string" && (E = o.filter(y, E)), this.length > 1 && (CA[u] || (E = o.uniqueSort(E)), q.test(u) && (E = E.reverse())), this.pushStack(E);
      };
    });
    var gA = /\S+/g;
    function IA(u) {
      var d = {};
      return o.each(u.match(gA) || [], function(m, y) {
        d[y] = !0;
      }), d;
    }
    o.Callbacks = function(u) {
      u = typeof u == "string" ? IA(u) : o.extend({}, u);
      var d, m, y, E, _ = [], I = [], P = -1, z = function() {
        for (E = u.once, y = d = !0; I.length; P = -1)
          for (m = I.shift(); ++P < _.length; )
            _[P].apply(m[0], m[1]) === !1 && u.stopOnFalse && (P = _.length, m = !1);
        u.memory || (m = !1), d = !1, E && (m ? _ = [] : _ = "");
      }, Y = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return _ && (m && !d && (P = _.length - 1, I.push(m)), function nA(FA) {
            o.each(FA, function(TA, UA) {
              o.isFunction(UA) ? (!u.unique || !Y.has(UA)) && _.push(UA) : UA && UA.length && o.type(UA) !== "string" && nA(UA);
            });
          }(arguments), m && !d && z()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return o.each(arguments, function(nA, FA) {
            for (var TA; (TA = o.inArray(FA, _, TA)) > -1; )
              _.splice(TA, 1), TA <= P && P--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(nA) {
          return nA ? o.inArray(nA, _) > -1 : _.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return _ && (_ = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return E = I = [], _ = m = "", this;
        },
        disabled: function() {
          return !_;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return E = !0, m || Y.disable(), this;
        },
        locked: function() {
          return !!E;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(nA, FA) {
          return E || (FA = FA || [], FA = [nA, FA.slice ? FA.slice() : FA], I.push(FA), d || z()), this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          return Y.fireWith(this, arguments), this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!y;
        }
      };
      return Y;
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
            var _ = arguments;
            return o.Deferred(function(I) {
              o.each(d, function(P, z) {
                var Y = o.isFunction(_[P]) && _[P];
                E[z[1]](function() {
                  var nA = Y && Y.apply(this, arguments);
                  nA && o.isFunction(nA.promise) ? nA.promise().progress(I.notify).done(I.resolve).fail(I.reject) : I[z[0] + "With"](
                    this === y ? I.promise() : this,
                    Y ? [nA] : arguments
                  );
                });
              }), _ = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(_) {
            return _ != null ? o.extend(_, y) : y;
          }
        }, E = {};
        return y.pipe = y.then, o.each(d, function(_, I) {
          var P = I[2], z = I[3];
          y[I[1]] = P.add, z && P.add(function() {
            m = z;
          }, d[_ ^ 1][2].disable, d[2][2].lock), E[I[0]] = function() {
            return E[I[0] + "With"](this === E ? y : this, arguments), this;
          }, E[I[0] + "With"] = P.fireWith;
        }), y.promise(E), u && u.call(E, E), E;
      },
      // Deferred helper
      when: function(u) {
        var d = 0, m = s.call(arguments), y = m.length, E = y !== 1 || u && o.isFunction(u.promise) ? y : 0, _ = E === 1 ? u : o.Deferred(), I = function(nA, FA, TA) {
          return function(UA) {
            FA[nA] = this, TA[nA] = arguments.length > 1 ? s.call(arguments) : UA, TA === P ? _.notifyWith(FA, TA) : --E || _.resolveWith(FA, TA);
          };
        }, P, z, Y;
        if (y > 1)
          for (P = new Array(y), z = new Array(y), Y = new Array(y); d < y; d++)
            m[d] && o.isFunction(m[d].promise) ? m[d].promise().progress(I(d, z, P)).done(I(d, Y, m)).fail(_.reject) : --E;
        return E || _.resolveWith(Y, m), _.promise();
      }
    });
    var HA;
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
        (u === !0 ? --o.readyWait : o.isReady) || (o.isReady = !0, !(u !== !0 && --o.readyWait > 0) && (HA.resolveWith(i, [o]), o.fn.triggerHandler && (o(i).triggerHandler("ready"), o(i).off("ready"))));
      }
    });
    function uA() {
      i.addEventListener ? (i.removeEventListener("DOMContentLoaded", T), e.removeEventListener("load", T)) : (i.detachEvent("onreadystatechange", T), e.detachEvent("onload", T));
    }
    function T() {
      (i.addEventListener || e.event.type === "load" || i.readyState === "complete") && (uA(), o.ready());
    }
    o.ready.promise = function(u) {
      if (!HA)
        if (HA = o.Deferred(), i.readyState === "complete" || i.readyState !== "loading" && !i.documentElement.doScroll)
          e.setTimeout(o.ready);
        else if (i.addEventListener)
          i.addEventListener("DOMContentLoaded", T), e.addEventListener("load", T);
        else {
          i.attachEvent("onreadystatechange", T), e.attachEvent("onload", T);
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
              uA(), o.ready();
            }
          }();
        }
      return HA.promise(u);
    }, o.ready.promise();
    var rA;
    for (rA in o(p))
      break;
    p.ownFirst = rA === "0", p.inlineBlockNeedsLayout = !1, o(function() {
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
    var j = function(u) {
      var d = o.noData[(u.nodeName + " ").toLowerCase()], m = +u.nodeType || 1;
      return m !== 1 && m !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !d || d !== !0 && u.getAttribute("classid") === d
      );
    }, S = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, K = /([A-Z])/g;
    function aA(u, d, m) {
      if (m === void 0 && u.nodeType === 1) {
        var y = "data-" + d.replace(K, "-$1").toLowerCase();
        if (m = u.getAttribute(y), typeof m == "string") {
          try {
            m = m === "true" ? !0 : m === "false" ? !1 : m === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +m + "" === m ? +m : S.test(m) ? o.parseJSON(m) : m
            );
          } catch {
          }
          o.data(u, d, m);
        } else
          m = void 0;
      }
      return m;
    }
    function EA(u) {
      var d;
      for (d in u)
        if (!(d === "data" && o.isEmptyObject(u[d])) && d !== "toJSON")
          return !1;
      return !0;
    }
    function _A(u, d, m, y) {
      if (j(u)) {
        var E, _, I = o.expando, P = u.nodeType, z = P ? o.cache : u, Y = P ? u[I] : u[I] && I;
        if (!((!Y || !z[Y] || !y && !z[Y].data) && m === void 0 && typeof d == "string"))
          return Y || (P ? Y = u[I] = n.pop() || o.guid++ : Y = I), z[Y] || (z[Y] = P ? {} : { toJSON: o.noop }), (typeof d == "object" || typeof d == "function") && (y ? z[Y] = o.extend(z[Y], d) : z[Y].data = o.extend(z[Y].data, d)), _ = z[Y], y || (_.data || (_.data = {}), _ = _.data), m !== void 0 && (_[o.camelCase(d)] = m), typeof d == "string" ? (E = _[d], E == null && (E = _[o.camelCase(d)])) : E = _, E;
      }
    }
    function qA(u, d, m) {
      if (j(u)) {
        var y, E, _ = u.nodeType, I = _ ? o.cache : u, P = _ ? u[o.expando] : o.expando;
        if (I[P]) {
          if (d && (y = m ? I[P] : I[P].data, y)) {
            for (o.isArray(d) ? d = d.concat(o.map(d, o.camelCase)) : (d in y) ? d = [d] : (d = o.camelCase(d), d in y ? d = [d] : d = d.split(" ")), E = d.length; E--; )
              delete y[d[E]];
            if (m ? !EA(y) : !o.isEmptyObject(y))
              return;
          }
          !m && (delete I[P].data, !EA(I[P])) || (_ ? o.cleanData([u], !0) : p.deleteExpando || I != I.window ? delete I[P] : I[P] = void 0);
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
        return u = u.nodeType ? o.cache[u[o.expando]] : u[o.expando], !!u && !EA(u);
      },
      data: function(u, d, m) {
        return _A(u, d, m);
      },
      removeData: function(u, d) {
        return qA(u, d);
      },
      // For internal use only.
      _data: function(u, d, m) {
        return _A(u, d, m, !0);
      },
      _removeData: function(u, d) {
        return qA(u, d, !0);
      }
    }), o.fn.extend({
      data: function(u, d) {
        var m, y, E, _ = this[0], I = _ && _.attributes;
        if (u === void 0) {
          if (this.length && (E = o.data(_), _.nodeType === 1 && !o._data(_, "parsedAttrs"))) {
            for (m = I.length; m--; )
              I[m] && (y = I[m].name, y.indexOf("data-") === 0 && (y = o.camelCase(y.slice(5)), aA(_, y, E[y])));
            o._data(_, "parsedAttrs", !0);
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
          _ ? aA(_, u, o.data(_, u)) : void 0
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
        var m = o.queue(u, d), y = m.length, E = m.shift(), _ = o._queueHooks(u, d), I = function() {
          o.dequeue(u, d);
        };
        E === "inprogress" && (E = m.shift(), y--), E && (d === "fx" && m.unshift("inprogress"), delete _.stop, E.call(u, I, _)), !y && _ && _.empty.fire();
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
        var m, y = 1, E = o.Deferred(), _ = this, I = this.length, P = function() {
          --y || E.resolveWith(_, [_]);
        };
        for (typeof u != "string" && (d = u, u = void 0), u = u || "fx"; I--; )
          m = o._data(_[I], u + "queueHooks"), m && m.empty && (y++, m.empty.add(P));
        return P(), E.promise(d);
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
    var ZA = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, X = new RegExp("^(?:([+-])=|)(" + ZA + ")([a-z%]*)$", "i"), V = ["Top", "Right", "Bottom", "Left"], k = function(u, d) {
      return u = d || u, o.css(u, "display") === "none" || !o.contains(u.ownerDocument, u);
    };
    function eA(u, d, m, y) {
      var E, _ = 1, I = 20, P = y ? function() {
        return y.cur();
      } : function() {
        return o.css(u, d, "");
      }, z = P(), Y = m && m[3] || (o.cssNumber[d] ? "" : "px"), nA = (o.cssNumber[d] || Y !== "px" && +z) && X.exec(o.css(u, d));
      if (nA && nA[3] !== Y) {
        Y = Y || nA[3], m = m || [], nA = +z || 1;
        do
          _ = _ || ".5", nA = nA / _, o.style(u, d, nA + Y);
        while (_ !== (_ = P() / z) && _ !== 1 && --I);
      }
      return m && (nA = +nA || +z || 0, E = m[1] ? nA + (m[1] + 1) * m[2] : +m[2], y && (y.unit = Y, y.start = nA, y.end = E)), E;
    }
    var lA = function(u, d, m, y, E, _, I) {
      var P = 0, z = u.length, Y = m == null;
      if (o.type(m) === "object") {
        E = !0;
        for (P in m)
          lA(u, d, P, m[P], !0, _, I);
      } else if (y !== void 0 && (E = !0, o.isFunction(y) || (I = !0), Y && (I ? (d.call(u, y), d = null) : (Y = d, d = function(nA, FA, TA) {
        return Y.call(o(nA), TA);
      })), d))
        for (; P < z; P++)
          d(
            u[P],
            m,
            I ? y : y.call(u[P], P, d(u[P], m))
          );
      return E ? u : (
        // Gets
        Y ? d.call(u) : z ? d(u[0], m) : _
      );
    }, SA = /^(?:checkbox|radio)$/i, zA = /<([\w:-]+)/, ie = /^$|\/(?:java|ecma)script/i, Te = /^\s+/, we = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function JA(u) {
      var d = we.split("|"), m = u.createDocumentFragment();
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
    var Ee = {
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
    Ee.optgroup = Ee.option, Ee.tbody = Ee.tfoot = Ee.colgroup = Ee.caption = Ee.thead, Ee.th = Ee.td;
    function GA(u, d) {
      var m, y, E = 0, _ = typeof u.getElementsByTagName < "u" ? u.getElementsByTagName(d || "*") : typeof u.querySelectorAll < "u" ? u.querySelectorAll(d || "*") : void 0;
      if (!_)
        for (_ = [], m = u.childNodes || u; (y = m[E]) != null; E++)
          !d || o.nodeName(y, d) ? _.push(y) : o.merge(_, GA(y, d));
      return d === void 0 || d && o.nodeName(u, d) ? o.merge([u], _) : _;
    }
    function Ge(u, d) {
      for (var m, y = 0; (m = u[y]) != null; y++)
        o._data(
          m,
          "globalEval",
          !d || o._data(d[y], "globalEval")
        );
    }
    var Ut = /<|&#?\w+;/, Ot = /<tbody/i;
    function Et(u) {
      SA.test(u.type) && (u.defaultChecked = u.checked);
    }
    function Bt(u, d, m, y, E) {
      for (var _, I, P, z, Y, nA, FA, TA = u.length, UA = JA(d), oe = [], ee = 0; ee < TA; ee++)
        if (I = u[ee], I || I === 0)
          if (o.type(I) === "object")
            o.merge(oe, I.nodeType ? [I] : I);
          else if (!Ut.test(I))
            oe.push(d.createTextNode(I));
          else {
            for (z = z || UA.appendChild(d.createElement("div")), Y = (zA.exec(I) || ["", ""])[1].toLowerCase(), FA = Ee[Y] || Ee._default, z.innerHTML = FA[1] + o.htmlPrefilter(I) + FA[2], _ = FA[0]; _--; )
              z = z.lastChild;
            if (!p.leadingWhitespace && Te.test(I) && oe.push(d.createTextNode(Te.exec(I)[0])), !p.tbody)
              for (I = Y === "table" && !Ot.test(I) ? z.firstChild : (
                // String was a bare <thead> or <tfoot>
                FA[1] === "<table>" && !Ot.test(I) ? z : 0
              ), _ = I && I.childNodes.length; _--; )
                o.nodeName(nA = I.childNodes[_], "tbody") && !nA.childNodes.length && I.removeChild(nA);
            for (o.merge(oe, z.childNodes), z.textContent = ""; z.firstChild; )
              z.removeChild(z.firstChild);
            z = UA.lastChild;
          }
      for (z && UA.removeChild(z), p.appendChecked || o.grep(GA(oe, "input"), Et), ee = 0; I = oe[ee++]; ) {
        if (y && o.inArray(I, y) > -1) {
          E && E.push(I);
          continue;
        }
        if (P = o.contains(I.ownerDocument, I), z = GA(UA.appendChild(I), "script"), P && Ge(z), m)
          for (_ = 0; I = z[_++]; )
            ie.test(I.type || "") && m.push(I);
      }
      return z = null, UA;
    }
    (function() {
      var u, d, m = i.createElement("div");
      for (u in { submit: !0, change: !0, focusin: !0 })
        d = "on" + u, (p[u] = d in e) || (m.setAttribute(d, "t"), p[u] = m.attributes[d].expando === !1);
      m = null;
    })();
    var un = /^(?:input|select|textarea)$/i, dr = /^key/, Qi = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Gr = /^(?:focusinfocus|focusoutblur)$/, Vr = /^([^.]*)(?:\.(.+)|)/;
    function pA() {
      return !0;
    }
    function MA() {
      return !1;
    }
    function jA() {
      try {
        return i.activeElement;
      } catch {
      }
    }
    function ye(u, d, m, y, E, _) {
      var I, P;
      if (typeof d == "object") {
        typeof m != "string" && (y = y || m, m = void 0);
        for (P in d)
          ye(u, P, m, y, d[P], _);
        return u;
      }
      if (y == null && E == null ? (E = m, y = m = void 0) : E == null && (typeof m == "string" ? (E = y, y = void 0) : (E = y, y = m, m = void 0)), E === !1)
        E = MA;
      else if (!E)
        return u;
      return _ === 1 && (I = E, E = function(z) {
        return o().off(z), I.apply(this, arguments);
      }, E.guid = I.guid || (I.guid = o.guid++)), u.each(function() {
        o.event.add(this, d, E, y, m);
      });
    }
    o.event = {
      global: {},
      add: function(u, d, m, y, E) {
        var _, I, P, z, Y, nA, FA, TA, UA, oe, ee, le = o._data(u);
        if (le) {
          for (m.handler && (z = m, m = z.handler, E = z.selector), m.guid || (m.guid = o.guid++), (I = le.events) || (I = le.events = {}), (nA = le.handle) || (nA = le.handle = function(ht) {
            return typeof o < "u" && (!ht || o.event.triggered !== ht.type) ? o.event.dispatch.apply(nA.elem, arguments) : void 0;
          }, nA.elem = u), d = (d || "").match(gA) || [""], P = d.length; P--; )
            _ = Vr.exec(d[P]) || [], UA = ee = _[1], oe = (_[2] || "").split(".").sort(), UA && (Y = o.event.special[UA] || {}, UA = (E ? Y.delegateType : Y.bindType) || UA, Y = o.event.special[UA] || {}, FA = o.extend({
              type: UA,
              origType: ee,
              data: y,
              handler: m,
              guid: m.guid,
              selector: E,
              needsContext: E && o.expr.match.needsContext.test(E),
              namespace: oe.join(".")
            }, z), (TA = I[UA]) || (TA = I[UA] = [], TA.delegateCount = 0, (!Y.setup || Y.setup.call(u, y, oe, nA) === !1) && (u.addEventListener ? u.addEventListener(UA, nA, !1) : u.attachEvent && u.attachEvent("on" + UA, nA))), Y.add && (Y.add.call(u, FA), FA.handler.guid || (FA.handler.guid = m.guid)), E ? TA.splice(TA.delegateCount++, 0, FA) : TA.push(FA), o.event.global[UA] = !0);
          u = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(u, d, m, y, E) {
        var _, I, P, z, Y, nA, FA, TA, UA, oe, ee, le = o.hasData(u) && o._data(u);
        if (!(!le || !(nA = le.events))) {
          for (d = (d || "").match(gA) || [""], Y = d.length; Y--; ) {
            if (P = Vr.exec(d[Y]) || [], UA = ee = P[1], oe = (P[2] || "").split(".").sort(), !UA) {
              for (UA in nA)
                o.event.remove(u, UA + d[Y], m, y, !0);
              continue;
            }
            for (FA = o.event.special[UA] || {}, UA = (y ? FA.delegateType : FA.bindType) || UA, TA = nA[UA] || [], P = P[2] && new RegExp("(^|\\.)" + oe.join("\\.(?:.*\\.|)") + "(\\.|$)"), z = _ = TA.length; _--; )
              I = TA[_], (E || ee === I.origType) && (!m || m.guid === I.guid) && (!P || P.test(I.namespace)) && (!y || y === I.selector || y === "**" && I.selector) && (TA.splice(_, 1), I.selector && TA.delegateCount--, FA.remove && FA.remove.call(u, I));
            z && !TA.length && ((!FA.teardown || FA.teardown.call(u, oe, le.handle) === !1) && o.removeEvent(u, UA, le.handle), delete nA[UA]);
          }
          o.isEmptyObject(nA) && (delete le.handle, o._removeData(u, "events"));
        }
      },
      trigger: function(u, d, m, y) {
        var E, _, I, P, z, Y, nA, FA = [m || i], TA = B.call(u, "type") ? u.type : u, UA = B.call(u, "namespace") ? u.namespace.split(".") : [];
        if (I = Y = m = m || i, !(m.nodeType === 3 || m.nodeType === 8) && !Gr.test(TA + o.event.triggered) && (TA.indexOf(".") > -1 && (UA = TA.split("."), TA = UA.shift(), UA.sort()), _ = TA.indexOf(":") < 0 && "on" + TA, u = u[o.expando] ? u : new o.Event(TA, typeof u == "object" && u), u.isTrigger = y ? 2 : 3, u.namespace = UA.join("."), u.rnamespace = u.namespace ? new RegExp("(^|\\.)" + UA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, u.result = void 0, u.target || (u.target = m), d = d == null ? [u] : o.makeArray(d, [u]), z = o.event.special[TA] || {}, !(!y && z.trigger && z.trigger.apply(m, d) === !1))) {
          if (!y && !z.noBubble && !o.isWindow(m)) {
            for (P = z.delegateType || TA, Gr.test(P + TA) || (I = I.parentNode); I; I = I.parentNode)
              FA.push(I), Y = I;
            Y === (m.ownerDocument || i) && FA.push(Y.defaultView || Y.parentWindow || e);
          }
          for (nA = 0; (I = FA[nA++]) && !u.isPropagationStopped(); )
            u.type = nA > 1 ? P : z.bindType || TA, E = (o._data(I, "events") || {})[u.type] && o._data(I, "handle"), E && E.apply(I, d), E = _ && I[_], E && E.apply && j(I) && (u.result = E.apply(I, d), u.result === !1 && u.preventDefault());
          if (u.type = TA, !y && !u.isDefaultPrevented() && (!z._default || z._default.apply(FA.pop(), d) === !1) && j(m) && _ && m[TA] && !o.isWindow(m)) {
            Y = m[_], Y && (m[_] = null), o.event.triggered = TA;
            try {
              m[TA]();
            } catch {
            }
            o.event.triggered = void 0, Y && (m[_] = Y);
          }
          return u.result;
        }
      },
      dispatch: function(u) {
        u = o.event.fix(u);
        var d, m, y, E, _, I = [], P = s.call(arguments), z = (o._data(this, "events") || {})[u.type] || [], Y = o.event.special[u.type] || {};
        if (P[0] = u, u.delegateTarget = this, !(Y.preDispatch && Y.preDispatch.call(this, u) === !1)) {
          for (I = o.event.handlers.call(this, u, z), d = 0; (E = I[d++]) && !u.isPropagationStopped(); )
            for (u.currentTarget = E.elem, m = 0; (_ = E.handlers[m++]) && !u.isImmediatePropagationStopped(); )
              (!u.rnamespace || u.rnamespace.test(_.namespace)) && (u.handleObj = _, u.data = _.data, y = ((o.event.special[_.origType] || {}).handle || _.handler).apply(E.elem, P), y !== void 0 && (u.result = y) === !1 && (u.preventDefault(), u.stopPropagation()));
          return Y.postDispatch && Y.postDispatch.call(this, u), u.result;
        }
      },
      handlers: function(u, d) {
        var m, y, E, _, I = [], P = d.delegateCount, z = u.target;
        if (P && z.nodeType && (u.type !== "click" || isNaN(u.button) || u.button < 1)) {
          for (; z != this; z = z.parentNode || this)
            if (z.nodeType === 1 && (z.disabled !== !0 || u.type !== "click")) {
              for (y = [], m = 0; m < P; m++)
                _ = d[m], E = _.selector + " ", y[E] === void 0 && (y[E] = _.needsContext ? o(E, this).index(z) > -1 : o.find(E, this, null, [z]).length), y[E] && y.push(_);
              y.length && I.push({ elem: z, handlers: y });
            }
        }
        return P < d.length && I.push({ elem: this, handlers: d.slice(P) }), I;
      },
      fix: function(u) {
        if (u[o.expando])
          return u;
        var d, m, y, E = u.type, _ = u, I = this.fixHooks[E];
        for (I || (this.fixHooks[E] = I = Qi.test(E) ? this.mouseHooks : dr.test(E) ? this.keyHooks : {}), y = I.props ? this.props.concat(I.props) : this.props, u = new o.Event(_), d = y.length; d--; )
          m = y[d], u[m] = _[m];
        return u.target || (u.target = _.srcElement || i), u.target.nodeType === 3 && (u.target = u.target.parentNode), u.metaKey = !!u.metaKey, I.filter ? I.filter(u, _) : u;
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
          var m, y, E, _ = d.button, I = d.fromElement;
          return u.pageX == null && d.clientX != null && (y = u.target.ownerDocument || i, E = y.documentElement, m = y.body, u.pageX = d.clientX + (E && E.scrollLeft || m && m.scrollLeft || 0) - (E && E.clientLeft || m && m.clientLeft || 0), u.pageY = d.clientY + (E && E.scrollTop || m && m.scrollTop || 0) - (E && E.clientTop || m && m.clientTop || 0)), !u.relatedTarget && I && (u.relatedTarget = I === u.target ? d.toElement : I), !u.which && _ !== void 0 && (u.which = _ & 1 ? 1 : _ & 2 ? 3 : _ & 4 ? 2 : 0), u;
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
            if (this !== jA() && this.focus)
              try {
                return this.focus(), !1;
              } catch {
              }
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            if (this === jA() && this.blur)
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
      u.returnValue === !1 ? pA : MA) : this.type = u, d && o.extend(this, d), this.timeStamp = u && u.timeStamp || o.now(), this[o.expando] = !0;
    }, o.Event.prototype = {
      constructor: o.Event,
      isDefaultPrevented: MA,
      isPropagationStopped: MA,
      isImmediatePropagationStopped: MA,
      preventDefault: function() {
        var u = this.originalEvent;
        this.isDefaultPrevented = pA, u && (u.preventDefault ? u.preventDefault() : u.returnValue = !1);
      },
      stopPropagation: function() {
        var u = this.originalEvent;
        this.isPropagationStopped = pA, !(!u || this.isSimulated) && (u.stopPropagation && u.stopPropagation(), u.cancelBubble = !0);
      },
      stopImmediatePropagation: function() {
        var u = this.originalEvent;
        this.isImmediatePropagationStopped = pA, u && u.stopImmediatePropagation && u.stopImmediatePropagation(), this.stopPropagation();
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
          var y, E = this, _ = m.relatedTarget, I = m.handleObj;
          return (!_ || _ !== E && !o.contains(E, _)) && (m.type = I.origType, y = I.handler.apply(this, arguments), m.type = d), y;
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
        if (un.test(this.nodeName))
          return (this.type === "checkbox" || this.type === "radio") && (o.event.add(this, "propertychange._change", function(u) {
            u.originalEvent.propertyName === "checked" && (this._justChanged = !0);
          }), o.event.add(this, "click._change", function(u) {
            this._justChanged && !u.isTrigger && (this._justChanged = !1), o.event.simulate("change", this, u);
          })), !1;
        o.event.add(this, "beforeactivate._change", function(u) {
          var d = u.target;
          un.test(d.nodeName) && !o._data(d, "change") && (o.event.add(d, "change._change", function(m) {
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
        return o.event.remove(this, "._change"), !un.test(this.nodeName);
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
        return ye(this, u, d, m, y);
      },
      one: function(u, d, m, y) {
        return ye(this, u, d, m, y, 1);
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
        return (d === !1 || typeof d == "function") && (m = d, d = void 0), m === !1 && (m = MA), this.each(function() {
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
    var Ce = / jQuery\d+="(?:null|\d+)"/g, ot = new RegExp("<(?:" + we + ")[\\s/>]", "i"), bt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, Un = /<script|<style|<link/i, Fi = /checked\s*(?:[^=]|=\s*.checked.)/i, En = /^true\/(.*)/, Ui = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Wr = JA(i), ln = Wr.appendChild(i.createElement("div"));
    function Ei(u, d) {
      return o.nodeName(u, "table") && o.nodeName(d.nodeType !== 11 ? d : d.firstChild, "tr") ? u.getElementsByTagName("tbody")[0] || u.appendChild(u.ownerDocument.createElement("tbody")) : u;
    }
    function Xr(u) {
      return u.type = (o.find.attr(u, "type") !== null) + "/" + u.type, u;
    }
    function pr(u) {
      var d = En.exec(u.type);
      return d ? u.type = d[1] : u.removeAttribute("type"), u;
    }
    function ks(u, d) {
      if (!(d.nodeType !== 1 || !o.hasData(u))) {
        var m, y, E, _ = o._data(u), I = o._data(d, _), P = _.events;
        if (P) {
          delete I.handle, I.events = {};
          for (m in P)
            for (y = 0, E = P[m].length; y < E; y++)
              o.event.add(d, m, P[m][y]);
        }
        I.data && (I.data = o.extend({}, I.data));
      }
    }
    function co(u, d) {
      var m, y, E;
      if (d.nodeType === 1) {
        if (m = d.nodeName.toLowerCase(), !p.noCloneEvent && d[o.expando]) {
          E = o._data(d);
          for (y in E.events)
            o.removeEvent(d, y, E.handle);
          d.removeAttribute(o.expando);
        }
        m === "script" && d.text !== u.text ? (Xr(d).text = u.text, pr(d)) : m === "object" ? (d.parentNode && (d.outerHTML = u.outerHTML), p.html5Clone && u.innerHTML && !o.trim(d.innerHTML) && (d.innerHTML = u.innerHTML)) : m === "input" && SA.test(u.type) ? (d.defaultChecked = d.checked = u.checked, d.value !== u.value && (d.value = u.value)) : m === "option" ? d.defaultSelected = d.selected = u.defaultSelected : (m === "input" || m === "textarea") && (d.defaultValue = u.defaultValue);
      }
    }
    function gr(u, d, m, y) {
      d = l.apply([], d);
      var E, _, I, P, z, Y, nA = 0, FA = u.length, TA = FA - 1, UA = d[0], oe = o.isFunction(UA);
      if (oe || FA > 1 && typeof UA == "string" && !p.checkClone && Fi.test(UA))
        return u.each(function(ee) {
          var le = u.eq(ee);
          oe && (d[0] = UA.call(this, ee, le.html())), gr(le, d, m, y);
        });
      if (FA && (Y = Bt(d, u[0].ownerDocument, !1, u, y), E = Y.firstChild, Y.childNodes.length === 1 && (Y = E), E || y)) {
        for (P = o.map(GA(Y, "script"), Xr), I = P.length; nA < FA; nA++)
          _ = Y, nA !== TA && (_ = o.clone(_, !0, !0), I && o.merge(P, GA(_, "script"))), m.call(u[nA], _, nA);
        if (I)
          for (z = P[P.length - 1].ownerDocument, o.map(P, pr), nA = 0; nA < I; nA++)
            _ = P[nA], ie.test(_.type || "") && !o._data(_, "globalEval") && o.contains(z, _) && (_.src ? o._evalUrl && o._evalUrl(_.src) : o.globalEval(
              (_.text || _.textContent || _.innerHTML || "").replace(Ui, "")
            ));
        Y = E = null;
      }
      return u;
    }
    function ua(u, d, m) {
      for (var y, E = d ? o.filter(d, u) : u, _ = 0; (y = E[_]) != null; _++)
        !m && y.nodeType === 1 && o.cleanData(GA(y)), y.parentNode && (m && o.contains(y.ownerDocument, y) && Ge(GA(y, "script")), y.parentNode.removeChild(y));
      return u;
    }
    o.extend({
      htmlPrefilter: function(u) {
        return u.replace(bt, "<$1></$2>");
      },
      clone: function(u, d, m) {
        var y, E, _, I, P, z = o.contains(u.ownerDocument, u);
        if (p.html5Clone || o.isXMLDoc(u) || !ot.test("<" + u.nodeName + ">") ? _ = u.cloneNode(!0) : (ln.innerHTML = u.outerHTML, ln.removeChild(_ = ln.firstChild)), (!p.noCloneEvent || !p.noCloneChecked) && (u.nodeType === 1 || u.nodeType === 11) && !o.isXMLDoc(u))
          for (y = GA(_), P = GA(u), I = 0; (E = P[I]) != null; ++I)
            y[I] && co(E, y[I]);
        if (d)
          if (m)
            for (P = P || GA(u), y = y || GA(_), I = 0; (E = P[I]) != null; I++)
              ks(E, y[I]);
          else
            ks(u, _);
        return y = GA(_, "script"), y.length > 0 && Ge(y, !z && GA(u, "script")), y = P = E = null, _;
      },
      cleanData: function(u, d) {
        for (var m, y, E, _, I = 0, P = o.expando, z = o.cache, Y = p.attributes, nA = o.event.special; (m = u[I]) != null; I++)
          if ((d || j(m)) && (E = m[P], _ = E && z[E], _)) {
            if (_.events)
              for (y in _.events)
                nA[y] ? o.event.remove(m, y) : o.removeEvent(m, y, _.handle);
            z[E] && (delete z[E], !Y && typeof m.removeAttribute < "u" ? m.removeAttribute(P) : m[P] = void 0, n.push(E));
          }
      }
    }), o.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: gr,
      detach: function(u) {
        return ua(this, u, !0);
      },
      remove: function(u) {
        return ua(this, u);
      },
      text: function(u) {
        return lA(this, function(d) {
          return d === void 0 ? o.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || i).createTextNode(d)
          );
        }, null, u, arguments.length);
      },
      append: function() {
        return gr(this, arguments, function(u) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Ei(this, u);
            d.appendChild(u);
          }
        });
      },
      prepend: function() {
        return gr(this, arguments, function(u) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Ei(this, u);
            d.insertBefore(u, d.firstChild);
          }
        });
      },
      before: function() {
        return gr(this, arguments, function(u) {
          this.parentNode && this.parentNode.insertBefore(u, this);
        });
      },
      after: function() {
        return gr(this, arguments, function(u) {
          this.parentNode && this.parentNode.insertBefore(u, this.nextSibling);
        });
      },
      empty: function() {
        for (var u, d = 0; (u = this[d]) != null; d++) {
          for (u.nodeType === 1 && o.cleanData(GA(u, !1)); u.firstChild; )
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
        return lA(this, function(d) {
          var m = this[0] || {}, y = 0, E = this.length;
          if (d === void 0)
            return m.nodeType === 1 ? m.innerHTML.replace(Ce, "") : void 0;
          if (typeof d == "string" && !Un.test(d) && (p.htmlSerialize || !ot.test(d)) && (p.leadingWhitespace || !Te.test(d)) && !Ee[(zA.exec(d) || ["", ""])[1].toLowerCase()]) {
            d = o.htmlPrefilter(d);
            try {
              for (; y < E; y++)
                m = this[y] || {}, m.nodeType === 1 && (o.cleanData(GA(m, !1)), m.innerHTML = d);
              m = 0;
            } catch {
            }
          }
          m && this.empty().append(d);
        }, null, u, arguments.length);
      },
      replaceWith: function() {
        var u = [];
        return gr(this, arguments, function(d) {
          var m = this.parentNode;
          o.inArray(this, u) < 0 && (o.cleanData(GA(this)), m && m.replaceChild(d, this));
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
        for (var y, E = 0, _ = [], I = o(m), P = I.length - 1; E <= P; E++)
          y = E === P ? this : this.clone(!0), o(I[E])[d](y), f.apply(_, y.get());
        return this.pushStack(_);
      };
    });
    var bi, $s = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function Gs(u, d) {
      var m = o(d.createElement(u)).appendTo(d.body), y = o.css(m[0], "display");
      return m.detach(), y;
    }
    function la(u) {
      var d = i, m = $s[u];
      return m || (m = Gs(u, d), (m === "none" || !m) && (bi = (bi || o("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (bi[0].contentWindow || bi[0].contentDocument).document, d.write(), d.close(), m = Gs(u, d), bi.detach()), $s[u] = m), m;
    }
    var Vs = /^margin/, ca = new RegExp("^(" + ZA + ")(?!px)[a-z%]+$", "i"), fo = function(u, d, m, y) {
      var E, _, I = {};
      for (_ in d)
        I[_] = u.style[_], u.style[_] = d[_];
      E = m.apply(u, y || []);
      for (_ in d)
        u.style[_] = I[_];
      return E;
    }, Ws = i.documentElement;
    (function() {
      var u, d, m, y, E, _, I = i.createElement("div"), P = i.createElement("div");
      if (!P.style)
        return;
      P.style.cssText = "float:left;opacity:.5", p.opacity = P.style.opacity === "0.5", p.cssFloat = !!P.style.cssFloat, P.style.backgroundClip = "content-box", P.cloneNode(!0).style.backgroundClip = "", p.clearCloneStyle = P.style.backgroundClip === "content-box", I = i.createElement("div"), I.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", P.innerHTML = "", I.appendChild(P), p.boxSizing = P.style.boxSizing === "" || P.style.MozBoxSizing === "" || P.style.WebkitBoxSizing === "", o.extend(p, {
        reliableHiddenOffsets: function() {
          return u == null && z(), y;
        },
        boxSizingReliable: function() {
          return u == null && z(), m;
        },
        pixelMarginRight: function() {
          return u == null && z(), d;
        },
        pixelPosition: function() {
          return u == null && z(), u;
        },
        reliableMarginRight: function() {
          return u == null && z(), E;
        },
        reliableMarginLeft: function() {
          return u == null && z(), _;
        }
      });
      function z() {
        var Y, nA, FA = i.documentElement;
        FA.appendChild(I), P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", u = m = _ = !1, d = E = !0, e.getComputedStyle && (nA = e.getComputedStyle(P), u = (nA || {}).top !== "1%", _ = (nA || {}).marginLeft === "2px", m = (nA || { width: "4px" }).width === "4px", P.style.marginRight = "50%", d = (nA || { marginRight: "4px" }).marginRight === "4px", Y = P.appendChild(i.createElement("div")), Y.style.cssText = P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", Y.style.marginRight = Y.style.width = "0", P.style.width = "1px", E = !parseFloat((e.getComputedStyle(Y) || {}).marginRight), P.removeChild(Y)), P.style.display = "none", y = P.getClientRects().length === 0, y && (P.style.display = "", P.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", P.childNodes[0].style.borderCollapse = "separate", Y = P.getElementsByTagName("td"), Y[0].style.cssText = "margin:0;border:0;padding:0;display:none", y = Y[0].offsetHeight === 0, y && (Y[0].style.display = "", Y[1].style.display = "none", y = Y[0].offsetHeight === 0)), FA.removeChild(I);
      }
    })();
    var qn, zn, kc = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (qn = function(u) {
      var d = u.ownerDocument.defaultView;
      return (!d || !d.opener) && (d = e), d.getComputedStyle(u);
    }, zn = function(u, d, m) {
      var y, E, _, I, P = u.style;
      return m = m || qn(u), I = m ? m.getPropertyValue(d) || m[d] : void 0, (I === "" || I === void 0) && !o.contains(u.ownerDocument, u) && (I = o.style(u, d)), m && !p.pixelMarginRight() && ca.test(I) && Vs.test(d) && (y = P.width, E = P.minWidth, _ = P.maxWidth, P.minWidth = P.maxWidth = P.width = I, I = m.width, P.width = y, P.minWidth = E, P.maxWidth = _), I === void 0 ? I : I + "";
    }) : Ws.currentStyle && (qn = function(u) {
      return u.currentStyle;
    }, zn = function(u, d, m) {
      var y, E, _, I, P = u.style;
      return m = m || qn(u), I = m ? m[d] : void 0, I == null && P && P[d] && (I = P[d]), ca.test(I) && !kc.test(d) && (y = P.left, E = u.runtimeStyle, _ = E && E.left, _ && (E.left = u.currentStyle.left), P.left = d === "fontSize" ? "1em" : I, I = P.pixelLeft + "px", P.left = y, _ && (E.left = _)), I === void 0 ? I : I + "" || "auto";
    });
    function ho(u, d) {
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
    var po = /alpha\([^)]*\)/i, $c = /opacity\s*=\s*([^)]*)/i, Gc = /^(none|table(?!-c[ea]).+)/, fa = new RegExp("^(" + ZA + ")(.*)$", "i"), Vc = { position: "absolute", visibility: "hidden", display: "block" }, _i = {
      letterSpacing: "0",
      fontWeight: "400"
    }, Xs = ["Webkit", "O", "Moz", "ms"], qs = i.createElement("div").style;
    function zs(u) {
      if (u in qs)
        return u;
      for (var d = u.charAt(0).toUpperCase() + u.slice(1), m = Xs.length; m--; )
        if (u = Xs[m] + d, u in qs)
          return u;
    }
    function go(u, d) {
      for (var m, y, E, _ = [], I = 0, P = u.length; I < P; I++)
        y = u[I], y.style && (_[I] = o._data(y, "olddisplay"), m = y.style.display, d ? (!_[I] && m === "none" && (y.style.display = ""), y.style.display === "" && k(y) && (_[I] = o._data(y, "olddisplay", la(y.nodeName)))) : (E = k(y), (m && m !== "none" || !E) && o._data(
          y,
          "olddisplay",
          E ? m : o.css(y, "display")
        )));
      for (I = 0; I < P; I++)
        y = u[I], y.style && (!d || y.style.display === "none" || y.style.display === "") && (y.style.display = d ? _[I] || "" : "none");
      return u;
    }
    function Bo(u, d, m) {
      var y = fa.exec(d);
      return y ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, y[1] - (m || 0)) + (y[2] || "px")
      ) : d;
    }
    function wo(u, d, m, y, E) {
      for (var _ = m === (y ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        d === "width" ? 1 : 0
      ), I = 0; _ < 4; _ += 2)
        m === "margin" && (I += o.css(u, m + V[_], !0, E)), y ? (m === "content" && (I -= o.css(u, "padding" + V[_], !0, E)), m !== "margin" && (I -= o.css(u, "border" + V[_] + "Width", !0, E))) : (I += o.css(u, "padding" + V[_], !0, E), m !== "padding" && (I += o.css(u, "border" + V[_] + "Width", !0, E)));
      return I;
    }
    function Js(u, d, m) {
      var y = !0, E = d === "width" ? u.offsetWidth : u.offsetHeight, _ = qn(u), I = p.boxSizing && o.css(u, "boxSizing", !1, _) === "border-box";
      if (E <= 0 || E == null) {
        if (E = zn(u, d, _), (E < 0 || E == null) && (E = u.style[d]), ca.test(E))
          return E;
        y = I && (p.boxSizingReliable() || E === u.style[d]), E = parseFloat(E) || 0;
      }
      return E + wo(
        u,
        d,
        m || (I ? "border" : "content"),
        y,
        _
      ) + "px";
    }
    o.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
        opacity: {
          get: function(u, d) {
            if (d) {
              var m = zn(u, "opacity");
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
          var E, _, I, P = o.camelCase(d), z = u.style;
          if (d = o.cssProps[P] || (o.cssProps[P] = zs(P) || P), I = o.cssHooks[d] || o.cssHooks[P], m !== void 0) {
            if (_ = typeof m, _ === "string" && (E = X.exec(m)) && E[1] && (m = eA(u, d, E), _ = "number"), m == null || m !== m)
              return;
            if (_ === "number" && (m += E && E[3] || (o.cssNumber[P] ? "" : "px")), !p.clearCloneStyle && m === "" && d.indexOf("background") === 0 && (z[d] = "inherit"), !I || !("set" in I) || (m = I.set(u, m, y)) !== void 0)
              try {
                z[d] = m;
              } catch {
              }
          } else
            return I && "get" in I && (E = I.get(u, !1, y)) !== void 0 ? E : z[d];
        }
      },
      css: function(u, d, m, y) {
        var E, _, I, P = o.camelCase(d);
        return d = o.cssProps[P] || (o.cssProps[P] = zs(P) || P), I = o.cssHooks[d] || o.cssHooks[P], I && "get" in I && (_ = I.get(u, !0, m)), _ === void 0 && (_ = zn(u, d, y)), _ === "normal" && d in _i && (_ = _i[d]), m === "" || m ? (E = parseFloat(_), m === !0 || isFinite(E) ? E || 0 : _) : _;
      }
    }), o.each(["height", "width"], function(u, d) {
      o.cssHooks[d] = {
        get: function(m, y, E) {
          if (y)
            return Gc.test(o.css(m, "display")) && m.offsetWidth === 0 ? fo(m, Vc, function() {
              return Js(m, d, E);
            }) : Js(m, d, E);
        },
        set: function(m, y, E) {
          var _ = E && qn(m);
          return Bo(
            m,
            y,
            E ? wo(
              m,
              d,
              E,
              p.boxSizing && o.css(m, "boxSizing", !1, _) === "border-box",
              _
            ) : 0
          );
        }
      };
    }), p.opacity || (o.cssHooks.opacity = {
      get: function(u, d) {
        return $c.test((d && u.currentStyle ? u.currentStyle.filter : u.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : d ? "1" : "";
      },
      set: function(u, d) {
        var m = u.style, y = u.currentStyle, E = o.isNumeric(d) ? "alpha(opacity=" + d * 100 + ")" : "", _ = y && y.filter || m.filter || "";
        m.zoom = 1, !((d >= 1 || d === "") && o.trim(_.replace(po, "")) === "" && m.removeAttribute && (m.removeAttribute("filter"), d === "" || y && !y.filter)) && (m.filter = po.test(_) ? _.replace(po, E) : _ + " " + E);
      }
    }), o.cssHooks.marginRight = ho(
      p.reliableMarginRight,
      function(u, d) {
        if (d)
          return fo(
            u,
            { display: "inline-block" },
            zn,
            [u, "marginRight"]
          );
      }
    ), o.cssHooks.marginLeft = ho(
      p.reliableMarginLeft,
      function(u, d) {
        if (d)
          return (parseFloat(zn(u, "marginLeft")) || // Support: IE<=11+
          // Running getBoundingClientRect on a disconnected node in IE throws an error
          // Support: IE8 only
          // getClientRects() errors on disconnected elems
          (o.contains(u.ownerDocument, u) ? u.getBoundingClientRect().left - fo(u, { marginLeft: 0 }, function() {
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
          for (var y = 0, E = {}, _ = typeof m == "string" ? m.split(" ") : [m]; y < 4; y++)
            E[u + V[y] + d] = _[y] || _[y - 2] || _[0];
          return E;
        }
      }, Vs.test(u) || (o.cssHooks[u + d].set = Bo);
    }), o.fn.extend({
      css: function(u, d) {
        return lA(this, function(m, y, E) {
          var _, I, P = {}, z = 0;
          if (o.isArray(y)) {
            for (_ = qn(m), I = y.length; z < I; z++)
              P[y[z]] = o.css(m, y[z], !1, _);
            return P;
          }
          return E !== void 0 ? o.style(m, y, E) : o.css(m, y);
        }, u, d, arguments.length > 1);
      },
      show: function() {
        return go(this, !0);
      },
      hide: function() {
        return go(this);
      },
      toggle: function(u) {
        return typeof u == "boolean" ? u ? this.show() : this.hide() : this.each(function() {
          k(this) ? o(this).show() : o(this).hide();
        });
      }
    });
    function _t(u, d, m, y, E) {
      return new _t.prototype.init(u, d, m, y, E);
    }
    o.Tween = _t, _t.prototype = {
      constructor: _t,
      init: function(u, d, m, y, E, _) {
        this.elem = u, this.prop = m, this.easing = E || o.easing._default, this.options = d, this.start = this.now = this.cur(), this.end = y, this.unit = _ || (o.cssNumber[m] ? "" : "px");
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
    var qr, ha, js = /^(?:toggle|show|hide)$/, Ys = /queueHooks$/;
    function mo() {
      return e.setTimeout(function() {
        qr = void 0;
      }), qr = o.now();
    }
    function zr(u, d) {
      var m, y = { height: u }, E = 0;
      for (d = d ? 1 : 0; E < 4; E += 2 - d)
        m = V[E], y["margin" + m] = y["padding" + m] = u;
      return d && (y.opacity = y.width = u), y;
    }
    function Zs(u, d, m) {
      for (var y, E = (Gt.tweeners[d] || []).concat(Gt.tweeners["*"]), _ = 0, I = E.length; _ < I; _++)
        if (y = E[_].call(m, d, u))
          return y;
    }
    function Au(u, d, m) {
      var y, E, _, I, P, z, Y, nA, FA = this, TA = {}, UA = u.style, oe = u.nodeType && k(u), ee = o._data(u, "fxshow");
      m.queue || (P = o._queueHooks(u, "fx"), P.unqueued == null && (P.unqueued = 0, z = P.empty.fire, P.empty.fire = function() {
        P.unqueued || z();
      }), P.unqueued++, FA.always(function() {
        FA.always(function() {
          P.unqueued--, o.queue(u, "fx").length || P.empty.fire();
        });
      })), u.nodeType === 1 && ("height" in d || "width" in d) && (m.overflow = [UA.overflow, UA.overflowX, UA.overflowY], Y = o.css(u, "display"), nA = Y === "none" ? o._data(u, "olddisplay") || la(u.nodeName) : Y, nA === "inline" && o.css(u, "float") === "none" && (!p.inlineBlockNeedsLayout || la(u.nodeName) === "inline" ? UA.display = "inline-block" : UA.zoom = 1)), m.overflow && (UA.overflow = "hidden", p.shrinkWrapBlocks() || FA.always(function() {
        UA.overflow = m.overflow[0], UA.overflowX = m.overflow[1], UA.overflowY = m.overflow[2];
      }));
      for (y in d)
        if (E = d[y], js.exec(E)) {
          if (delete d[y], _ = _ || E === "toggle", E === (oe ? "hide" : "show"))
            if (E === "show" && ee && ee[y] !== void 0)
              oe = !0;
            else
              continue;
          TA[y] = ee && ee[y] || o.style(u, y);
        } else
          Y = void 0;
      if (o.isEmptyObject(TA))
        (Y === "none" ? la(u.nodeName) : Y) === "inline" && (UA.display = Y);
      else {
        ee ? "hidden" in ee && (oe = ee.hidden) : ee = o._data(u, "fxshow", {}), _ && (ee.hidden = !oe), oe ? o(u).show() : FA.done(function() {
          o(u).hide();
        }), FA.done(function() {
          var le;
          o._removeData(u, "fxshow");
          for (le in TA)
            o.style(u, le, TA[le]);
        });
        for (y in TA)
          I = Zs(oe ? ee[y] : 0, y, FA), y in ee || (ee[y] = I.start, oe && (I.end = I.start, I.start = y === "width" || y === "height" ? 1 : 0));
      }
    }
    function da(u, d) {
      var m, y, E, _, I;
      for (m in u)
        if (y = o.camelCase(m), E = d[y], _ = u[m], o.isArray(_) && (E = _[1], _ = u[m] = _[0]), m !== y && (u[y] = _, delete u[m]), I = o.cssHooks[y], I && "expand" in I) {
          _ = I.expand(_), delete u[y];
          for (m in _)
            m in u || (u[m] = _[m], d[m] = E);
        } else
          d[y] = E;
    }
    function Gt(u, d, m) {
      var y, E, _ = 0, I = Gt.prefilters.length, P = o.Deferred().always(function() {
        delete z.elem;
      }), z = function() {
        if (E)
          return !1;
        for (var FA = qr || mo(), TA = Math.max(0, Y.startTime + Y.duration - FA), UA = TA / Y.duration || 0, oe = 1 - UA, ee = 0, le = Y.tweens.length; ee < le; ee++)
          Y.tweens[ee].run(oe);
        return P.notifyWith(u, [Y, oe, TA]), oe < 1 && le ? TA : (P.resolveWith(u, [Y]), !1);
      }, Y = P.promise({
        elem: u,
        props: o.extend({}, d),
        opts: o.extend(!0, {
          specialEasing: {},
          easing: o.easing._default
        }, m),
        originalProperties: d,
        originalOptions: m,
        startTime: qr || mo(),
        duration: m.duration,
        tweens: [],
        createTween: function(FA, TA) {
          var UA = o.Tween(
            u,
            Y.opts,
            FA,
            TA,
            Y.opts.specialEasing[FA] || Y.opts.easing
          );
          return Y.tweens.push(UA), UA;
        },
        stop: function(FA) {
          var TA = 0, UA = FA ? Y.tweens.length : 0;
          if (E)
            return this;
          for (E = !0; TA < UA; TA++)
            Y.tweens[TA].run(1);
          return FA ? (P.notifyWith(u, [Y, 1, 0]), P.resolveWith(u, [Y, FA])) : P.rejectWith(u, [Y, FA]), this;
        }
      }), nA = Y.props;
      for (da(nA, Y.opts.specialEasing); _ < I; _++)
        if (y = Gt.prefilters[_].call(Y, u, nA, Y.opts), y)
          return o.isFunction(y.stop) && (o._queueHooks(Y.elem, Y.opts.queue).stop = o.proxy(y.stop, y)), y;
      return o.map(nA, Zs, Y), o.isFunction(Y.opts.start) && Y.opts.start.call(u, Y), o.fx.timer(
        o.extend(z, {
          elem: u,
          anim: Y,
          queue: Y.opts.queue
        })
      ), Y.progress(Y.opts.progress).done(Y.opts.done, Y.opts.complete).fail(Y.opts.fail).always(Y.opts.always);
    }
    o.Animation = o.extend(Gt, {
      tweeners: {
        "*": [function(u, d) {
          var m = this.createTween(u, d);
          return eA(m.elem, u, X.exec(d), m), m;
        }]
      },
      tweener: function(u, d) {
        o.isFunction(u) ? (d = u, u = ["*"]) : u = u.match(gA);
        for (var m, y = 0, E = u.length; y < E; y++)
          m = u[y], Gt.tweeners[m] = Gt.tweeners[m] || [], Gt.tweeners[m].unshift(d);
      },
      prefilters: [Au],
      prefilter: function(u, d) {
        d ? Gt.prefilters.unshift(u) : Gt.prefilters.push(u);
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
        return this.filter(k).css("opacity", 0).show().end().animate({ opacity: d }, u, m, y);
      },
      animate: function(u, d, m, y) {
        var E = o.isEmptyObject(u), _ = o.speed(d, m, y), I = function() {
          var P = Gt(this, o.extend({}, u), _);
          (E || o._data(this, "finish")) && P.stop(!0);
        };
        return I.finish = I, E || _.queue === !1 ? this.each(I) : this.queue(_.queue, I);
      },
      stop: function(u, d, m) {
        var y = function(E) {
          var _ = E.stop;
          delete E.stop, _(m);
        };
        return typeof u != "string" && (m = d, d = u, u = void 0), d && u !== !1 && this.queue(u || "fx", []), this.each(function() {
          var E = !0, _ = u != null && u + "queueHooks", I = o.timers, P = o._data(this);
          if (_)
            P[_] && P[_].stop && y(P[_]);
          else
            for (_ in P)
              P[_] && P[_].stop && Ys.test(_) && y(P[_]);
          for (_ = I.length; _--; )
            I[_].elem === this && (u == null || I[_].queue === u) && (I[_].anim.stop(m), E = !1, I.splice(_, 1));
          (E || !m) && o.dequeue(this, u);
        });
      },
      finish: function(u) {
        return u !== !1 && (u = u || "fx"), this.each(function() {
          var d, m = o._data(this), y = m[u + "queue"], E = m[u + "queueHooks"], _ = o.timers, I = y ? y.length : 0;
          for (m.finish = !0, o.queue(this, u, []), E && E.stop && E.stop.call(this, !0), d = _.length; d--; )
            _[d].elem === this && _[d].queue === u && (_[d].anim.stop(!0), _.splice(d, 1));
          for (d = 0; d < I; d++)
            y[d] && y[d].finish && y[d].finish.call(this);
          delete m.finish;
        });
      }
    }), o.each(["toggle", "show", "hide"], function(u, d) {
      var m = o.fn[d];
      o.fn[d] = function(y, E, _) {
        return y == null || typeof y == "boolean" ? m.apply(this, arguments) : this.animate(zr(d, !0), y, E, _);
      };
    }), o.each({
      slideDown: zr("show"),
      slideUp: zr("hide"),
      slideToggle: zr("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(u, d) {
      o.fn[u] = function(m, y, E) {
        return this.animate(d, m, y, E);
      };
    }), o.timers = [], o.fx.tick = function() {
      var u, d = o.timers, m = 0;
      for (qr = o.now(); m < d.length; m++)
        u = d[m], !u() && d[m] === u && d.splice(m--, 1);
      d.length || o.fx.stop(), qr = void 0;
    }, o.fx.timer = function(u) {
      o.timers.push(u), u() ? o.fx.start() : o.timers.pop();
    }, o.fx.interval = 13, o.fx.start = function() {
      ha || (ha = e.setInterval(o.fx.tick, o.fx.interval));
    }, o.fx.stop = function() {
      e.clearInterval(ha), ha = null;
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
    var Wc = /\r/g, eu = /[\x20\t\r\n\f]+/g;
    o.fn.extend({
      val: function(u) {
        var d, m, y, E = this[0];
        return arguments.length ? (y = o.isFunction(u), this.each(function(_) {
          var I;
          this.nodeType === 1 && (y ? I = u.call(this, _, o(this).val()) : I = u, I == null ? I = "" : typeof I == "number" ? I += "" : o.isArray(I) && (I = o.map(I, function(P) {
            return P == null ? "" : P + "";
          })), d = o.valHooks[this.type] || o.valHooks[this.nodeName.toLowerCase()], (!d || !("set" in d) || d.set(this, I, "value") === void 0) && (this.value = I));
        })) : E ? (d = o.valHooks[E.type] || o.valHooks[E.nodeName.toLowerCase()], d && "get" in d && (m = d.get(E, "value")) !== void 0 ? m : (m = E.value, typeof m == "string" ? (
          // handle most common string cases
          m.replace(Wc, "")
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
            o.trim(o.text(u)).replace(eu, " ");
          }
        },
        select: {
          get: function(u) {
            for (var d, m, y = u.options, E = u.selectedIndex, _ = u.type === "select-one" || E < 0, I = _ ? null : [], P = _ ? E + 1 : y.length, z = E < 0 ? P : _ ? E : 0; z < P; z++)
              if (m = y[z], (m.selected || z === E) && // Don't return options that are disabled or in a disabled optgroup
              (p.optDisabled ? !m.disabled : m.getAttribute("disabled") === null) && (!m.parentNode.disabled || !o.nodeName(m.parentNode, "optgroup"))) {
                if (d = o(m).val(), _)
                  return d;
                I.push(d);
              }
            return I;
          },
          set: function(u, d) {
            for (var m, y, E = u.options, _ = o.makeArray(d), I = E.length; I--; )
              if (y = E[I], o.inArray(o.valHooks.option.get(y), _) > -1)
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
    var Br, pa, bn = o.expr.attrHandle, ga = /^(?:checked|selected)$/i, _n = p.getSetAttribute, Jr = p.input;
    o.fn.extend({
      attr: function(u, d) {
        return lA(this, o.attr, u, d, arguments.length > 1);
      },
      removeAttr: function(u) {
        return this.each(function() {
          o.removeAttr(this, u);
        });
      }
    }), o.extend({
      attr: function(u, d, m) {
        var y, E, _ = u.nodeType;
        if (!(_ === 3 || _ === 8 || _ === 2)) {
          if (typeof u.getAttribute > "u")
            return o.prop(u, d, m);
          if ((_ !== 1 || !o.isXMLDoc(u)) && (d = d.toLowerCase(), E = o.attrHooks[d] || (o.expr.match.bool.test(d) ? pa : Br)), m !== void 0) {
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
        var m, y, E = 0, _ = d && d.match(gA);
        if (_ && u.nodeType === 1)
          for (; m = _[E++]; )
            y = o.propFix[m] || m, o.expr.match.bool.test(m) ? Jr && _n || !ga.test(m) ? u[y] = !1 : u[o.camelCase("default-" + m)] = u[y] = !1 : o.attr(u, m, ""), u.removeAttribute(_n ? m : y);
      }
    }), pa = {
      set: function(u, d, m) {
        return d === !1 ? o.removeAttr(u, m) : Jr && _n || !ga.test(m) ? u.setAttribute(!_n && o.propFix[m] || m, m) : u[o.camelCase("default-" + m)] = u[m] = !0, m;
      }
    }, o.each(o.expr.match.bool.source.match(/\w+/g), function(u, d) {
      var m = bn[d] || o.find.attr;
      Jr && _n || !ga.test(d) ? bn[d] = function(y, E, _) {
        var I, P;
        return _ || (P = bn[E], bn[E] = I, I = m(y, E, _) != null ? E.toLowerCase() : null, bn[E] = P), I;
      } : bn[d] = function(y, E, _) {
        if (!_)
          return y[o.camelCase("default-" + E)] ? E.toLowerCase() : null;
      };
    }), (!Jr || !_n) && (o.attrHooks.value = {
      set: function(u, d, m) {
        if (o.nodeName(u, "input"))
          u.defaultValue = d;
        else
          return Br && Br.set(u, d, m);
      }
    }), _n || (Br = {
      set: function(u, d, m) {
        var y = u.getAttributeNode(m);
        if (y || u.setAttributeNode(
          y = u.ownerDocument.createAttribute(m)
        ), y.value = d += "", m === "value" || d === u.getAttribute(m))
          return d;
      }
    }, bn.id = bn.name = bn.coords = function(u, d, m) {
      var y;
      if (!m)
        return (y = u.getAttributeNode(d)) && y.value !== "" ? y.value : null;
    }, o.valHooks.button = {
      get: function(u, d) {
        var m = u.getAttributeNode(d);
        if (m && m.specified)
          return m.value;
      },
      set: Br.set
    }, o.attrHooks.contenteditable = {
      set: function(u, d, m) {
        Br.set(u, d === "" ? !1 : d, m);
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
    var jr = /^(?:input|select|textarea|button|object)$/i, tu = /^(?:a|area)$/i;
    o.fn.extend({
      prop: function(u, d) {
        return lA(this, o.prop, u, d, arguments.length > 1);
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
        var y, E, _ = u.nodeType;
        if (!(_ === 3 || _ === 8 || _ === 2))
          return (_ !== 1 || !o.isXMLDoc(u)) && (d = o.propFix[d] || d, E = o.propHooks[d]), m !== void 0 ? E && "set" in E && (y = E.set(u, m, d)) !== void 0 ? y : u[d] = m : E && "get" in E && (y = E.get(u, d)) !== null ? y : u[d];
      },
      propHooks: {
        tabIndex: {
          get: function(u) {
            var d = o.find.attr(u, "tabindex");
            return d ? parseInt(d, 10) : jr.test(u.nodeName) || tu.test(u.nodeName) && u.href ? 0 : -1;
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
    var Ba = /[\t\r\n\f]/g;
    function wr(u) {
      return o.attr(u, "class") || "";
    }
    o.fn.extend({
      addClass: function(u) {
        var d, m, y, E, _, I, P, z = 0;
        if (o.isFunction(u))
          return this.each(function(Y) {
            o(this).addClass(u.call(this, Y, wr(this)));
          });
        if (typeof u == "string" && u) {
          for (d = u.match(gA) || []; m = this[z++]; )
            if (E = wr(m), y = m.nodeType === 1 && (" " + E + " ").replace(Ba, " "), y) {
              for (I = 0; _ = d[I++]; )
                y.indexOf(" " + _ + " ") < 0 && (y += _ + " ");
              P = o.trim(y), E !== P && o.attr(m, "class", P);
            }
        }
        return this;
      },
      removeClass: function(u) {
        var d, m, y, E, _, I, P, z = 0;
        if (o.isFunction(u))
          return this.each(function(Y) {
            o(this).removeClass(u.call(this, Y, wr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof u == "string" && u) {
          for (d = u.match(gA) || []; m = this[z++]; )
            if (E = wr(m), y = m.nodeType === 1 && (" " + E + " ").replace(Ba, " "), y) {
              for (I = 0; _ = d[I++]; )
                for (; y.indexOf(" " + _ + " ") > -1; )
                  y = y.replace(" " + _ + " ", " ");
              P = o.trim(y), E !== P && o.attr(m, "class", P);
            }
        }
        return this;
      },
      toggleClass: function(u, d) {
        var m = typeof u;
        return typeof d == "boolean" && m === "string" ? d ? this.addClass(u) : this.removeClass(u) : o.isFunction(u) ? this.each(function(y) {
          o(this).toggleClass(
            u.call(this, y, wr(this), d),
            d
          );
        }) : this.each(function() {
          var y, E, _, I;
          if (m === "string")
            for (E = 0, _ = o(this), I = u.match(gA) || []; y = I[E++]; )
              _.hasClass(y) ? _.removeClass(y) : _.addClass(y);
          else (u === void 0 || m === "boolean") && (y = wr(this), y && o._data(this, "__className__", y), o.attr(
            this,
            "class",
            y || u === !1 ? "" : o._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(u) {
        var d, m, y = 0;
        for (d = " " + u + " "; m = this[y++]; )
          if (m.nodeType === 1 && (" " + wr(m) + " ").replace(Ba, " ").indexOf(d) > -1)
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
    var nu = e.location, wa = o.now(), ma = /\?/, ru = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    o.parseJSON = function(u) {
      if (e.JSON && e.JSON.parse)
        return e.JSON.parse(u + "");
      var d, m = null, y = o.trim(u + "");
      return y && !o.trim(y.replace(ru, function(E, _, I, P) {
        return d && _ && (m = 0), m === 0 ? E : (d = I || _, m += !P - !I, "");
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
    var Xc = /#.*$/, iu = /([?&])_=[^&]*/, qc = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, au = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, zc = /^(?:GET|HEAD)$/, Jc = /^\/\//, ou = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, su = {}, xi = {}, uu = "*/".concat("*"), vo = nu.href, Yr = ou.exec(vo.toLowerCase()) || [];
    function lu(u) {
      return function(d, m) {
        typeof d != "string" && (m = d, d = "*");
        var y, E = 0, _ = d.toLowerCase().match(gA) || [];
        if (o.isFunction(m))
          for (; y = _[E++]; )
            y.charAt(0) === "+" ? (y = y.slice(1) || "*", (u[y] = u[y] || []).unshift(m)) : (u[y] = u[y] || []).push(m);
      };
    }
    function cu(u, d, m, y) {
      var E = {}, _ = u === xi;
      function I(P) {
        var z;
        return E[P] = !0, o.each(u[P] || [], function(Y, nA) {
          var FA = nA(d, m, y);
          if (typeof FA == "string" && !_ && !E[FA])
            return d.dataTypes.unshift(FA), I(FA), !1;
          if (_)
            return !(z = FA);
        }), z;
      }
      return I(d.dataTypes[0]) || !E["*"] && I("*");
    }
    function Me(u, d) {
      var m, y, E = o.ajaxSettings.flatOptions || {};
      for (y in d)
        d[y] !== void 0 && ((E[y] ? u : m || (m = {}))[y] = d[y]);
      return m && o.extend(!0, u, m), u;
    }
    function Pe(u, d, m) {
      for (var y, E, _, I, P = u.contents, z = u.dataTypes; z[0] === "*"; )
        z.shift(), E === void 0 && (E = u.mimeType || d.getResponseHeader("Content-Type"));
      if (E) {
        for (I in P)
          if (P[I] && P[I].test(E)) {
            z.unshift(I);
            break;
          }
      }
      if (z[0] in m)
        _ = z[0];
      else {
        for (I in m) {
          if (!z[0] || u.converters[I + " " + z[0]]) {
            _ = I;
            break;
          }
          y || (y = I);
        }
        _ = _ || y;
      }
      if (_)
        return _ !== z[0] && z.unshift(_), m[_];
    }
    function jc(u, d, m, y) {
      var E, _, I, P, z, Y = {}, nA = u.dataTypes.slice();
      if (nA[1])
        for (I in u.converters)
          Y[I.toLowerCase()] = u.converters[I];
      for (_ = nA.shift(); _; )
        if (u.responseFields[_] && (m[u.responseFields[_]] = d), !z && y && u.dataFilter && (d = u.dataFilter(d, u.dataType)), z = _, _ = nA.shift(), _) {
          if (_ === "*")
            _ = z;
          else if (z !== "*" && z !== _) {
            if (I = Y[z + " " + _] || Y["* " + _], !I) {
              for (E in Y)
                if (P = E.split(" "), P[1] === _ && (I = Y[z + " " + P[0]] || Y["* " + P[0]], I)) {
                  I === !0 ? I = Y[E] : Y[E] !== !0 && (_ = P[0], nA.unshift(P[1]));
                  break;
                }
            }
            if (I !== !0)
              if (I && u.throws)
                d = I(d);
              else
                try {
                  d = I(d);
                } catch (FA) {
                  return {
                    state: "parsererror",
                    error: I ? FA : "No conversion from " + z + " to " + _
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
        url: vo,
        type: "GET",
        isLocal: au.test(Yr[1]),
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
          "*": uu,
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
          Me(Me(u, o.ajaxSettings), d)
        ) : (
          // Extending ajaxSettings
          Me(o.ajaxSettings, u)
        );
      },
      ajaxPrefilter: lu(su),
      ajaxTransport: lu(xi),
      // Main method
      ajax: function(u, d) {
        typeof u == "object" && (d = u, u = void 0), d = d || {};
        var m, y, E, _, I, P, z, Y, nA = o.ajaxSetup({}, d), FA = nA.context || nA, TA = nA.context && (FA.nodeType || FA.jquery) ? o(FA) : o.event, UA = o.Deferred(), oe = o.Callbacks("once memory"), ee = nA.statusCode || {}, le = {}, ht = {}, ze = 0, Jn = "canceled", kA = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(ce) {
            var Xe;
            if (ze === 2) {
              if (!Y)
                for (Y = {}; Xe = qc.exec(_); )
                  Y[Xe[1].toLowerCase()] = Xe[2];
              Xe = Y[ce.toLowerCase()];
            }
            return Xe ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return ze === 2 ? _ : null;
          },
          // Caches the header
          setRequestHeader: function(ce, Xe) {
            var xn = ce.toLowerCase();
            return ze || (ce = ht[xn] = ht[xn] || ce, le[ce] = Xe), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(ce) {
            return ze || (nA.mimeType = ce), this;
          },
          // Status-dependent callbacks
          statusCode: function(ce) {
            var Xe;
            if (ce)
              if (ze < 2)
                for (Xe in ce)
                  ee[Xe] = [ee[Xe], ce[Xe]];
              else
                kA.always(ce[kA.status]);
            return this;
          },
          // Cancel the request
          abort: function(ce) {
            var Xe = ce || Jn;
            return z && z.abort(Xe), ut(0, Xe), this;
          }
        };
        if (UA.promise(kA).complete = oe.add, kA.success = kA.done, kA.error = kA.fail, nA.url = ((u || nA.url || vo) + "").replace(Xc, "").replace(Jc, Yr[1] + "//"), nA.type = d.method || d.type || nA.method || nA.type, nA.dataTypes = o.trim(nA.dataType || "*").toLowerCase().match(gA) || [""], nA.crossDomain == null && (m = ou.exec(nA.url.toLowerCase()), nA.crossDomain = !!(m && (m[1] !== Yr[1] || m[2] !== Yr[2] || (m[3] || (m[1] === "http:" ? "80" : "443")) !== (Yr[3] || (Yr[1] === "http:" ? "80" : "443"))))), nA.data && nA.processData && typeof nA.data != "string" && (nA.data = o.param(nA.data, nA.traditional)), cu(su, nA, d, kA), ze === 2)
          return kA;
        P = o.event && nA.global, P && o.active++ === 0 && o.event.trigger("ajaxStart"), nA.type = nA.type.toUpperCase(), nA.hasContent = !zc.test(nA.type), E = nA.url, nA.hasContent || (nA.data && (E = nA.url += (ma.test(E) ? "&" : "?") + nA.data, delete nA.data), nA.cache === !1 && (nA.url = iu.test(E) ? (
          // If there is already a '_' parameter, set its value
          E.replace(iu, "$1_=" + wa++)
        ) : (
          // Otherwise add one to the end
          E + (ma.test(E) ? "&" : "?") + "_=" + wa++
        ))), nA.ifModified && (o.lastModified[E] && kA.setRequestHeader("If-Modified-Since", o.lastModified[E]), o.etag[E] && kA.setRequestHeader("If-None-Match", o.etag[E])), (nA.data && nA.hasContent && nA.contentType !== !1 || d.contentType) && kA.setRequestHeader("Content-Type", nA.contentType), kA.setRequestHeader(
          "Accept",
          nA.dataTypes[0] && nA.accepts[nA.dataTypes[0]] ? nA.accepts[nA.dataTypes[0]] + (nA.dataTypes[0] !== "*" ? ", " + uu + "; q=0.01" : "") : nA.accepts["*"]
        );
        for (y in nA.headers)
          kA.setRequestHeader(y, nA.headers[y]);
        if (nA.beforeSend && (nA.beforeSend.call(FA, kA, nA) === !1 || ze === 2))
          return kA.abort();
        Jn = "abort";
        for (y in { success: 1, error: 1, complete: 1 })
          kA[y](nA[y]);
        if (z = cu(xi, nA, d, kA), !z)
          ut(-1, "No Transport");
        else {
          if (kA.readyState = 1, P && TA.trigger("ajaxSend", [kA, nA]), ze === 2)
            return kA;
          nA.async && nA.timeout > 0 && (I = e.setTimeout(function() {
            kA.abort("timeout");
          }, nA.timeout));
          try {
            ze = 1, z.send(le, ut);
          } catch (ce) {
            if (ze < 2)
              ut(-1, ce);
            else
              throw ce;
          }
        }
        function ut(ce, Xe, xn, ya) {
          var xt, In, jn, Hn, Re, It = Xe;
          ze !== 2 && (ze = 2, I && e.clearTimeout(I), z = void 0, _ = ya || "", kA.readyState = ce > 0 ? 4 : 0, xt = ce >= 200 && ce < 300 || ce === 304, xn && (Hn = Pe(nA, kA, xn)), Hn = jc(nA, Hn, kA, xt), xt ? (nA.ifModified && (Re = kA.getResponseHeader("Last-Modified"), Re && (o.lastModified[E] = Re), Re = kA.getResponseHeader("etag"), Re && (o.etag[E] = Re)), ce === 204 || nA.type === "HEAD" ? It = "nocontent" : ce === 304 ? It = "notmodified" : (It = Hn.state, In = Hn.data, jn = Hn.error, xt = !jn)) : (jn = It, (ce || !It) && (It = "error", ce < 0 && (ce = 0))), kA.status = ce, kA.statusText = (Xe || It) + "", xt ? UA.resolveWith(FA, [In, It, kA]) : UA.rejectWith(FA, [kA, It, jn]), kA.statusCode(ee), ee = void 0, P && TA.trigger(
            xt ? "ajaxSuccess" : "ajaxError",
            [kA, nA, xt ? In : jn]
          ), oe.fireWith(FA, [kA, It]), P && (TA.trigger("ajaxComplete", [kA, nA]), --o.active || o.event.trigger("ajaxStop")));
        }
        return kA;
      },
      getJSON: function(u, d, m) {
        return o.get(u, d, m, "json");
      },
      getScript: function(u, d) {
        return o.get(u, void 0, d, "script");
      }
    }), o.each(["get", "post"], function(u, d) {
      o[d] = function(m, y, E, _) {
        return o.isFunction(y) && (_ = _ || E, E = y, y = void 0), o.ajax(o.extend({
          url: m,
          type: d,
          dataType: _,
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
    function Yc(u) {
      return u.style && u.style.display || o.css(u, "display");
    }
    function Zc(u) {
      if (!o.contains(u.ownerDocument || i, u))
        return !0;
      for (; u && u.nodeType === 1; ) {
        if (Yc(u) === "none" || u.type === "hidden")
          return !0;
        u = u.parentNode;
      }
      return !1;
    }
    o.expr.filters.hidden = function(u) {
      return p.reliableHiddenOffsets() ? u.offsetWidth <= 0 && u.offsetHeight <= 0 && !u.getClientRects().length : Zc(u);
    }, o.expr.filters.visible = function(u) {
      return !o.expr.filters.hidden(u);
    };
    var Af = /%20/g, ef = /\[\]$/, fu = /\r?\n/g, hu = /^(?:submit|button|image|reset|file)$/i, tf = /^(?:input|select|textarea|keygen)/i;
    function Ze(u, d, m, y) {
      var E;
      if (o.isArray(d))
        o.each(d, function(_, I) {
          m || ef.test(u) ? y(u, I) : Ze(
            u + "[" + (typeof I == "object" && I != null ? _ : "") + "]",
            I,
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
      var m, y = [], E = function(_, I) {
        I = o.isFunction(I) ? I() : I ?? "", y[y.length] = encodeURIComponent(_) + "=" + encodeURIComponent(I);
      };
      if (d === void 0 && (d = o.ajaxSettings && o.ajaxSettings.traditional), o.isArray(u) || u.jquery && !o.isPlainObject(u))
        o.each(u, function() {
          E(this.name, this.value);
        });
      else
        for (m in u)
          Ze(m, u[m], d, E);
      return y.join("&").replace(Af, "+");
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
          return this.name && !o(this).is(":disabled") && tf.test(this.nodeName) && !hu.test(u) && (this.checked || !SA.test(u));
        }).map(function(u, d) {
          var m = o(this).val();
          return m == null ? null : o.isArray(m) ? o.map(m, function(y) {
            return { name: d.name, value: y.replace(fu, `\r
`) };
          }) : { name: d.name, value: m.replace(fu, `\r
`) };
        }).get();
      }
    }), o.ajaxSettings.xhr = e.ActiveXObject !== void 0 ? (
      // Support: IE6-IE8
      function() {
        return this.isLocal ? Nt() : i.documentMode > 8 ? Ii() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Ii() || Nt();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      Ii
    );
    var yo = 0, cn = {}, Zr = o.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
      for (var u in cn)
        cn[u](void 0, !0);
    }), p.cors = !!Zr && "withCredentials" in Zr, Zr = p.ajax = !!Zr, Zr && o.ajaxTransport(function(u) {
      if (!u.crossDomain || p.cors) {
        var d;
        return {
          send: function(m, y) {
            var E, _ = u.xhr(), I = ++yo;
            if (_.open(
              u.type,
              u.url,
              u.async,
              u.username,
              u.password
            ), u.xhrFields)
              for (E in u.xhrFields)
                _[E] = u.xhrFields[E];
            u.mimeType && _.overrideMimeType && _.overrideMimeType(u.mimeType), !u.crossDomain && !m["X-Requested-With"] && (m["X-Requested-With"] = "XMLHttpRequest");
            for (E in m)
              m[E] !== void 0 && _.setRequestHeader(E, m[E] + "");
            _.send(u.hasContent && u.data || null), d = function(P, z) {
              var Y, nA, FA;
              if (d && (z || _.readyState === 4))
                if (delete cn[I], d = void 0, _.onreadystatechange = o.noop, z)
                  _.readyState !== 4 && _.abort();
                else {
                  FA = {}, Y = _.status, typeof _.responseText == "string" && (FA.text = _.responseText);
                  try {
                    nA = _.statusText;
                  } catch {
                    nA = "";
                  }
                  !Y && u.isLocal && !u.crossDomain ? Y = FA.text ? 200 : 404 : Y === 1223 && (Y = 204);
                }
              FA && y(Y, nA, FA, _.getAllResponseHeaders());
            }, u.async ? _.readyState === 4 ? e.setTimeout(d) : _.onreadystatechange = cn[I] = d : d();
          },
          abort: function() {
            d && d(void 0, !0);
          }
        };
      }
    });
    function Ii() {
      try {
        return new e.XMLHttpRequest();
      } catch {
      }
    }
    function Nt() {
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
            d = i.createElement("script"), d.async = !0, u.scriptCharset && (d.charset = u.scriptCharset), d.src = u.url, d.onload = d.onreadystatechange = function(_, I) {
              (I || !d.readyState || /loaded|complete/.test(d.readyState)) && (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), d = null, I || E(200, "success"));
            }, m.insertBefore(d, m.firstChild);
          },
          abort: function() {
            d && d.onload(void 0, !0);
          }
        };
      }
    });
    var Co = [], va = /(=)\?(?=&|$)|\?\?/;
    o.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var u = Co.pop() || o.expando + "_" + wa++;
        return this[u] = !0, u;
      }
    }), o.ajaxPrefilter("json jsonp", function(u, d, m) {
      var y, E, _, I = u.jsonp !== !1 && (va.test(u.url) ? "url" : typeof u.data == "string" && (u.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && va.test(u.data) && "data");
      if (I || u.dataTypes[0] === "jsonp")
        return y = u.jsonpCallback = o.isFunction(u.jsonpCallback) ? u.jsonpCallback() : u.jsonpCallback, I ? u[I] = u[I].replace(va, "$1" + y) : u.jsonp !== !1 && (u.url += (ma.test(u.url) ? "&" : "?") + u.jsonp + "=" + y), u.converters["script json"] = function() {
          return _ || o.error(y + " was not called"), _[0];
        }, u.dataTypes[0] = "json", E = e[y], e[y] = function() {
          _ = arguments;
        }, m.always(function() {
          E === void 0 ? o(e).removeProp(y) : e[y] = E, u[y] && (u.jsonpCallback = d.jsonpCallback, Co.push(y)), _ && o.isFunction(E) && E(_[0]), _ = E = void 0;
        }), "script";
    }), o.parseHTML = function(u, d, m) {
      if (!u || typeof u != "string")
        return null;
      typeof d == "boolean" && (m = d, d = !1), d = d || i;
      var y = hA.exec(u), E = !m && [];
      return y ? [d.createElement(y[1])] : (y = Bt([u], d, E), E && E.length && o(E).remove(), o.merge([], y.childNodes));
    };
    var Qo = o.fn.load;
    o.fn.load = function(u, d, m) {
      if (typeof u != "string" && Qo)
        return Qo.apply(this, arguments);
      var y, E, _, I = this, P = u.indexOf(" ");
      return P > -1 && (y = o.trim(u.slice(P, u.length)), u = u.slice(0, P)), o.isFunction(d) ? (m = d, d = void 0) : d && typeof d == "object" && (E = "POST"), I.length > 0 && o.ajax({
        url: u,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: E || "GET",
        dataType: "html",
        data: d
      }).done(function(z) {
        _ = arguments, I.html(y ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          o("<div>").append(o.parseHTML(z)).find(y)
        ) : (
          // Otherwise use the full result
          z
        ));
      }).always(m && function(z, Y) {
        I.each(function() {
          m.apply(this, _ || [z.responseText, Y, z]);
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
    function Fo(u) {
      return o.isWindow(u) ? u : u.nodeType === 9 ? u.defaultView || u.parentWindow : !1;
    }
    o.offset = {
      setOffset: function(u, d, m) {
        var y, E, _, I, P, z, Y, nA = o.css(u, "position"), FA = o(u), TA = {};
        nA === "static" && (u.style.position = "relative"), P = FA.offset(), _ = o.css(u, "top"), z = o.css(u, "left"), Y = (nA === "absolute" || nA === "fixed") && o.inArray("auto", [_, z]) > -1, Y ? (y = FA.position(), I = y.top, E = y.left) : (I = parseFloat(_) || 0, E = parseFloat(z) || 0), o.isFunction(d) && (d = d.call(u, m, o.extend({}, P))), d.top != null && (TA.top = d.top - P.top + I), d.left != null && (TA.left = d.left - P.left + E), "using" in d ? d.using.call(u, TA) : FA.css(TA);
      }
    }, o.fn.extend({
      offset: function(u) {
        if (arguments.length)
          return u === void 0 ? this : this.each(function(I) {
            o.offset.setOffset(this, u, I);
          });
        var d, m, y = { top: 0, left: 0 }, E = this[0], _ = E && E.ownerDocument;
        if (_)
          return d = _.documentElement, o.contains(d, E) ? (typeof E.getBoundingClientRect < "u" && (y = E.getBoundingClientRect()), m = Fo(_), {
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
          return u || Ws;
        });
      }
    }), o.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(u, d) {
      var m = /Y/.test(d);
      o.fn[u] = function(y) {
        return lA(this, function(E, _, I) {
          var P = Fo(E);
          if (I === void 0)
            return P ? d in P ? P[d] : P.document.documentElement[_] : E[_];
          P ? P.scrollTo(
            m ? o(P).scrollLeft() : I,
            m ? I : o(P).scrollTop()
          ) : E[_] = I;
        }, u, y, arguments.length, null);
      };
    }), o.each(["top", "left"], function(u, d) {
      o.cssHooks[d] = ho(
        p.pixelPosition,
        function(m, y) {
          if (y)
            return y = zn(m, d), ca.test(y) ? o(m).position()[d] + "px" : y;
        }
      );
    }), o.each({ Height: "height", Width: "width" }, function(u, d) {
      o.each(
        { padding: "inner" + u, content: d, "": "outer" + u },
        function(m, y) {
          o.fn[y] = function(E, _) {
            var I = arguments.length && (m || typeof E != "boolean"), P = m || (E === !0 || _ === !0 ? "margin" : "border");
            return lA(this, function(z, Y, nA) {
              var FA;
              return o.isWindow(z) ? z.document.documentElement["client" + u] : z.nodeType === 9 ? (FA = z.documentElement, Math.max(
                z.body["scroll" + u],
                FA["scroll" + u],
                z.body["offset" + u],
                FA["offset" + u],
                FA["client" + u]
              )) : nA === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                o.css(z, Y, P)
              ) : (
                // Set width or height on the element
                o.style(z, Y, nA, P)
              );
            }, d, I ? E : void 0, I, null);
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
    var du = e.jQuery, pu = e.$;
    return o.noConflict = function(u) {
      return e.$ === o && (e.$ = pu), u && e.jQuery === o && (e.jQuery = du), o;
    }, t || (e.jQuery = e.$ = o), o;
  });
})(o0);
var wD = o0.exports;
const ue = /* @__PURE__ */ vc(wD), mD = function(A) {
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
  }, t = xe.merge({}, e, A), n = function(s) {
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
}, vD = function(A) {
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
    onAnnotationSelectFunction: ue.noop(),
    drawing: null
  }, t = xe.merge({}, e, A), n = function() {
    return sa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
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
      var D = p.selectAll("rect.selection").data(o);
      D.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), D.attr("x", 0).attr("y", function(b) {
        return Math.min(b.start, b.end);
      }).attr("width", t.layout.width).attr("height", function(b) {
        return Math.abs(b.end - b.start);
      }), D.exit().remove();
    }, F = AL().on("start", function(D) {
      var b = kn(D, this);
      o.push({
        start: b[1],
        end: b[1]
      }), C(), D.sourceEvent.stopPropagation();
    }).on("drag", function(D) {
      o[0].end = kn(D, this)[1], C(), D.sourceEvent.stopPropagation(), D.sourceEvent.preventDefault();
    }).on("end", function(D) {
      D.sourceEvent.stopPropagation();
      var b = w.invert(o[0].start), M = w.invert(o[0].end);
      if (b > M) {
        var R = b;
        b = M, M = R;
      }
      var J = h.layout.geneBandNodes.filter(function(hA) {
        return hA.data.midpoint > b && hA.data.midpoint < M;
      });
      J.forEach(function(hA) {
        hA.data.type == "gene" ? hA.data.visible = !0 : hA.data.type == "geneslist" && hA.data.genesList.forEach(function(cA) {
          cA.visible = !0;
        });
      }), t.onAnnotationSelectFunction(), o = [], C();
    });
    p.select("rect.background").call(F), t.border && p.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
    var U = p.select(".bands_container"), H;
    t.bands == "basemap" ? H = s : t.bands == "genes" && (H = f), H(U, h), p.select(".bands_container").style("mask", "url(#chromosome_mask_" + h.number + ")");
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
        let U = F.data.genesList.some(function(H) {
          return !H.displayed;
        });
        F.data.genesList.forEach(function(H) {
          H.visible = U, H.hidden = !U;
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
var Zt = "top", Qn = "bottom", Fn = "right", An = "left", Sp = "auto", Ns = [Zt, Qn, Fn, An], to = "start", Es = "end", yD = "clippingParents", s0 = "viewport", Xo = "popper", CD = "reference", bw = /* @__PURE__ */ Ns.reduce(function(A, e) {
  return A.concat([e + "-" + to, e + "-" + Es]);
}, []), u0 = /* @__PURE__ */ [].concat(Ns, [Sp]).reduce(function(A, e) {
  return A.concat([e, e + "-" + to, e + "-" + Es]);
}, []), QD = "beforeRead", FD = "read", UD = "afterRead", ED = "beforeMain", bD = "main", _D = "afterMain", xD = "beforeWrite", ID = "write", HD = "afterWrite", SD = [QD, FD, UD, ED, bD, _D, xD, ID, HD];
function ur(A) {
  return A ? (A.nodeName || "").toLowerCase() : null;
}
function sn(A) {
  if (A == null)
    return window;
  if (A.toString() !== "[object Window]") {
    var e = A.ownerDocument;
    return e && e.defaultView || window;
  }
  return A;
}
function oa(A) {
  var e = sn(A).Element;
  return A instanceof e || A instanceof Element;
}
function Cn(A) {
  var e = sn(A).HTMLElement;
  return A instanceof e || A instanceof HTMLElement;
}
function Lp(A) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = sn(A).ShadowRoot;
  return A instanceof e || A instanceof ShadowRoot;
}
function LD(A) {
  var e = A.state;
  Object.keys(e.elements).forEach(function(t) {
    var n = e.styles[t] || {}, i = e.attributes[t] || {}, s = e.elements[t];
    !Cn(s) || !ur(s) || (Object.assign(s.style, n), Object.keys(i).forEach(function(l) {
      var f = i[l];
      f === !1 ? s.removeAttribute(l) : s.setAttribute(l, f === !0 ? "" : f);
    }));
  });
}
function TD(A) {
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
      !Cn(i) || !ur(i) || (Object.assign(i.style, f), Object.keys(s).forEach(function(c) {
        i.removeAttribute(c);
      }));
    });
  };
}
const l0 = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: LD,
  effect: TD,
  requires: ["computeStyles"]
};
function sr(A) {
  return A.split("-")[0];
}
var Zi = Math.max, sc = Math.min, no = Math.round;
function ed() {
  var A = navigator.userAgentData;
  return A != null && A.brands && Array.isArray(A.brands) ? A.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function c0() {
  return !/^((?!chrome|android).)*safari/i.test(ed());
}
function ro(A, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var n = A.getBoundingClientRect(), i = 1, s = 1;
  e && Cn(A) && (i = A.offsetWidth > 0 && no(n.width) / A.offsetWidth || 1, s = A.offsetHeight > 0 && no(n.height) / A.offsetHeight || 1);
  var l = oa(A) ? sn(A) : window, f = l.visualViewport, c = !c0() && t, h = (n.left + (c && f ? f.offsetLeft : 0)) / i, w = (n.top + (c && f ? f.offsetTop : 0)) / s, B = n.width / i, p = n.height / s;
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
function Tp(A) {
  var e = ro(A), t = A.offsetWidth, n = A.offsetHeight;
  return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - n) <= 1 && (n = e.height), {
    x: A.offsetLeft,
    y: A.offsetTop,
    width: t,
    height: n
  };
}
function f0(A, e) {
  var t = e.getRootNode && e.getRootNode();
  if (A.contains(e))
    return !0;
  if (t && Lp(t)) {
    var n = e;
    do {
      if (n && A.isSameNode(n))
        return !0;
      n = n.parentNode || n.host;
    } while (n);
  }
  return !1;
}
function kr(A) {
  return sn(A).getComputedStyle(A);
}
function DD(A) {
  return ["table", "td", "th"].indexOf(ur(A)) >= 0;
}
function Ci(A) {
  return ((oa(A) ? A.ownerDocument : (
    // $FlowFixMe[prop-missing]
    A.document
  )) || window.document).documentElement;
}
function Hc(A) {
  return ur(A) === "html" ? A : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    A.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    A.parentNode || // DOM Element detected
    (Lp(A) ? A.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Ci(A)
  );
}
function _w(A) {
  return !Cn(A) || // https://github.com/popperjs/popper-core/issues/837
  kr(A).position === "fixed" ? null : A.offsetParent;
}
function OD(A) {
  var e = /firefox/i.test(ed()), t = /Trident/i.test(ed());
  if (t && Cn(A)) {
    var n = kr(A);
    if (n.position === "fixed")
      return null;
  }
  var i = Hc(A);
  for (Lp(i) && (i = i.host); Cn(i) && ["html", "body"].indexOf(ur(i)) < 0; ) {
    var s = kr(i);
    if (s.transform !== "none" || s.perspective !== "none" || s.contain === "paint" || ["transform", "perspective"].indexOf(s.willChange) !== -1 || e && s.willChange === "filter" || e && s.filter && s.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function Ms(A) {
  for (var e = sn(A), t = _w(A); t && DD(t) && kr(t).position === "static"; )
    t = _w(t);
  return t && (ur(t) === "html" || ur(t) === "body" && kr(t).position === "static") ? e : t || OD(A) || e;
}
function Dp(A) {
  return ["top", "bottom"].indexOf(A) >= 0 ? "x" : "y";
}
function hs(A, e, t) {
  return Zi(A, sc(e, t));
}
function ND(A, e, t) {
  var n = hs(A, e, t);
  return n > t ? t : n;
}
function h0() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function d0(A) {
  return Object.assign({}, h0(), A);
}
function p0(A, e) {
  return e.reduce(function(t, n) {
    return t[n] = A, t;
  }, {});
}
var MD = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, d0(typeof e != "number" ? e : p0(e, Ns));
};
function PD(A) {
  var e, t = A.state, n = A.name, i = A.options, s = t.elements.arrow, l = t.modifiersData.popperOffsets, f = sr(t.placement), c = Dp(f), h = [An, Fn].indexOf(f) >= 0, w = h ? "height" : "width";
  if (!(!s || !l)) {
    var B = MD(i.padding, t), p = Tp(s), v = c === "y" ? Zt : An, o = c === "y" ? Qn : Fn, C = t.rects.reference[w] + t.rects.reference[c] - l[c] - t.rects.popper[w], F = l[c] - t.rects.reference[c], U = Ms(s), H = U ? c === "y" ? U.clientHeight || 0 : U.clientWidth || 0 : 0, D = C / 2 - F / 2, b = B[v], M = H - p[w] - B[o], R = H / 2 - p[w] / 2 + D, J = hs(b, R, M), hA = c;
    t.modifiersData[n] = (e = {}, e[hA] = J, e.centerOffset = J - R, e);
  }
}
function RD(A) {
  var e = A.state, t = A.options, n = t.element, i = n === void 0 ? "[data-popper-arrow]" : n;
  i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || f0(e.elements.popper, i) && (e.elements.arrow = i));
}
const KD = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: PD,
  effect: RD,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function io(A) {
  return A.split("-")[1];
}
var kD = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function $D(A, e) {
  var t = A.x, n = A.y, i = e.devicePixelRatio || 1;
  return {
    x: no(t * i) / i || 0,
    y: no(n * i) / i || 0
  };
}
function xw(A) {
  var e, t = A.popper, n = A.popperRect, i = A.placement, s = A.variation, l = A.offsets, f = A.position, c = A.gpuAcceleration, h = A.adaptive, w = A.roundOffsets, B = A.isFixed, p = l.x, v = p === void 0 ? 0 : p, o = l.y, C = o === void 0 ? 0 : o, F = typeof w == "function" ? w({
    x: v,
    y: C
  }) : {
    x: v,
    y: C
  };
  v = F.x, C = F.y;
  var U = l.hasOwnProperty("x"), H = l.hasOwnProperty("y"), D = An, b = Zt, M = window;
  if (h) {
    var R = Ms(t), J = "clientHeight", hA = "clientWidth";
    if (R === sn(t) && (R = Ci(t), kr(R).position !== "static" && f === "absolute" && (J = "scrollHeight", hA = "scrollWidth")), R = R, i === Zt || (i === An || i === Fn) && s === Es) {
      b = Qn;
      var cA = B && R === M && M.visualViewport ? M.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        R[J]
      );
      C -= cA - n.height, C *= c ? 1 : -1;
    }
    if (i === An || (i === Zt || i === Qn) && s === Es) {
      D = Fn;
      var wA = B && R === M && M.visualViewport ? M.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        R[hA]
      );
      v -= wA - n.width, v *= c ? 1 : -1;
    }
  }
  var QA = Object.assign({
    position: f
  }, h && kD), OA = w === !0 ? $D({
    x: v,
    y: C
  }, sn(t)) : {
    x: v,
    y: C
  };
  if (v = OA.x, C = OA.y, c) {
    var bA;
    return Object.assign({}, QA, (bA = {}, bA[b] = H ? "0" : "", bA[D] = U ? "0" : "", bA.transform = (M.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + C + "px)" : "translate3d(" + v + "px, " + C + "px, 0)", bA));
  }
  return Object.assign({}, QA, (e = {}, e[b] = H ? C + "px" : "", e[D] = U ? v + "px" : "", e.transform = "", e));
}
function GD(A) {
  var e = A.state, t = A.options, n = t.gpuAcceleration, i = n === void 0 ? !0 : n, s = t.adaptive, l = s === void 0 ? !0 : s, f = t.roundOffsets, c = f === void 0 ? !0 : f, h = {
    placement: sr(e.placement),
    variation: io(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, xw(Object.assign({}, h, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: l,
    roundOffsets: c
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, xw(Object.assign({}, h, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: c
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const VD = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: GD,
  data: {}
};
var al = {
  passive: !0
};
function WD(A) {
  var e = A.state, t = A.instance, n = A.options, i = n.scroll, s = i === void 0 ? !0 : i, l = n.resize, f = l === void 0 ? !0 : l, c = sn(e.elements.popper), h = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return s && h.forEach(function(w) {
    w.addEventListener("scroll", t.update, al);
  }), f && c.addEventListener("resize", t.update, al), function() {
    s && h.forEach(function(w) {
      w.removeEventListener("scroll", t.update, al);
    }), f && c.removeEventListener("resize", t.update, al);
  };
}
const XD = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: WD,
  data: {}
};
var qD = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function kl(A) {
  return A.replace(/left|right|bottom|top/g, function(e) {
    return qD[e];
  });
}
var zD = {
  start: "end",
  end: "start"
};
function Iw(A) {
  return A.replace(/start|end/g, function(e) {
    return zD[e];
  });
}
function Op(A) {
  var e = sn(A), t = e.pageXOffset, n = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: n
  };
}
function Np(A) {
  return ro(Ci(A)).left + Op(A).scrollLeft;
}
function JD(A, e) {
  var t = sn(A), n = Ci(A), i = t.visualViewport, s = n.clientWidth, l = n.clientHeight, f = 0, c = 0;
  if (i) {
    s = i.width, l = i.height;
    var h = c0();
    (h || !h && e === "fixed") && (f = i.offsetLeft, c = i.offsetTop);
  }
  return {
    width: s,
    height: l,
    x: f + Np(A),
    y: c
  };
}
function jD(A) {
  var e, t = Ci(A), n = Op(A), i = (e = A.ownerDocument) == null ? void 0 : e.body, s = Zi(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), l = Zi(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), f = -n.scrollLeft + Np(A), c = -n.scrollTop;
  return kr(i || t).direction === "rtl" && (f += Zi(t.clientWidth, i ? i.clientWidth : 0) - s), {
    width: s,
    height: l,
    x: f,
    y: c
  };
}
function Mp(A) {
  var e = kr(A), t = e.overflow, n = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + n);
}
function g0(A) {
  return ["html", "body", "#document"].indexOf(ur(A)) >= 0 ? A.ownerDocument.body : Cn(A) && Mp(A) ? A : g0(Hc(A));
}
function ds(A, e) {
  var t;
  e === void 0 && (e = []);
  var n = g0(A), i = n === ((t = A.ownerDocument) == null ? void 0 : t.body), s = sn(n), l = i ? [s].concat(s.visualViewport || [], Mp(n) ? n : []) : n, f = e.concat(l);
  return i ? f : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    f.concat(ds(Hc(l)))
  );
}
function td(A) {
  return Object.assign({}, A, {
    left: A.x,
    top: A.y,
    right: A.x + A.width,
    bottom: A.y + A.height
  });
}
function YD(A, e) {
  var t = ro(A, !1, e === "fixed");
  return t.top = t.top + A.clientTop, t.left = t.left + A.clientLeft, t.bottom = t.top + A.clientHeight, t.right = t.left + A.clientWidth, t.width = A.clientWidth, t.height = A.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Hw(A, e, t) {
  return e === s0 ? td(JD(A, t)) : oa(e) ? YD(e, t) : td(jD(Ci(A)));
}
function ZD(A) {
  var e = ds(Hc(A)), t = ["absolute", "fixed"].indexOf(kr(A).position) >= 0, n = t && Cn(A) ? Ms(A) : A;
  return oa(n) ? e.filter(function(i) {
    return oa(i) && f0(i, n) && ur(i) !== "body";
  }) : [];
}
function AO(A, e, t, n) {
  var i = e === "clippingParents" ? ZD(A) : [].concat(e), s = [].concat(i, [t]), l = s[0], f = s.reduce(function(c, h) {
    var w = Hw(A, h, n);
    return c.top = Zi(w.top, c.top), c.right = sc(w.right, c.right), c.bottom = sc(w.bottom, c.bottom), c.left = Zi(w.left, c.left), c;
  }, Hw(A, l, n));
  return f.width = f.right - f.left, f.height = f.bottom - f.top, f.x = f.left, f.y = f.top, f;
}
function B0(A) {
  var e = A.reference, t = A.element, n = A.placement, i = n ? sr(n) : null, s = n ? io(n) : null, l = e.x + e.width / 2 - t.width / 2, f = e.y + e.height / 2 - t.height / 2, c;
  switch (i) {
    case Zt:
      c = {
        x: l,
        y: e.y - t.height
      };
      break;
    case Qn:
      c = {
        x: l,
        y: e.y + e.height
      };
      break;
    case Fn:
      c = {
        x: e.x + e.width,
        y: f
      };
      break;
    case An:
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
  var h = i ? Dp(i) : null;
  if (h != null) {
    var w = h === "y" ? "height" : "width";
    switch (s) {
      case to:
        c[h] = c[h] - (e[w] / 2 - t[w] / 2);
        break;
      case Es:
        c[h] = c[h] + (e[w] / 2 - t[w] / 2);
        break;
    }
  }
  return c;
}
function bs(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = n === void 0 ? A.placement : n, s = t.strategy, l = s === void 0 ? A.strategy : s, f = t.boundary, c = f === void 0 ? yD : f, h = t.rootBoundary, w = h === void 0 ? s0 : h, B = t.elementContext, p = B === void 0 ? Xo : B, v = t.altBoundary, o = v === void 0 ? !1 : v, C = t.padding, F = C === void 0 ? 0 : C, U = d0(typeof F != "number" ? F : p0(F, Ns)), H = p === Xo ? CD : Xo, D = A.rects.popper, b = A.elements[o ? H : p], M = AO(oa(b) ? b : b.contextElement || Ci(A.elements.popper), c, w, l), R = ro(A.elements.reference), J = B0({
    reference: R,
    element: D,
    strategy: "absolute",
    placement: i
  }), hA = td(Object.assign({}, D, J)), cA = p === Xo ? hA : R, wA = {
    top: M.top - cA.top + U.top,
    bottom: cA.bottom - M.bottom + U.bottom,
    left: M.left - cA.left + U.left,
    right: cA.right - M.right + U.right
  }, QA = A.modifiersData.offset;
  if (p === Xo && QA) {
    var OA = QA[i];
    Object.keys(wA).forEach(function(bA) {
      var q = [Fn, Qn].indexOf(bA) >= 0 ? 1 : -1, CA = [Zt, Qn].indexOf(bA) >= 0 ? "y" : "x";
      wA[bA] += OA[CA] * q;
    });
  }
  return wA;
}
function eO(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = t.boundary, s = t.rootBoundary, l = t.padding, f = t.flipVariations, c = t.allowedAutoPlacements, h = c === void 0 ? u0 : c, w = io(n), B = w ? f ? bw : bw.filter(function(o) {
    return io(o) === w;
  }) : Ns, p = B.filter(function(o) {
    return h.indexOf(o) >= 0;
  });
  p.length === 0 && (p = B);
  var v = p.reduce(function(o, C) {
    return o[C] = bs(A, {
      placement: C,
      boundary: i,
      rootBoundary: s,
      padding: l
    })[sr(C)], o;
  }, {});
  return Object.keys(v).sort(function(o, C) {
    return v[o] - v[C];
  });
}
function tO(A) {
  if (sr(A) === Sp)
    return [];
  var e = kl(A);
  return [Iw(A), e, Iw(e)];
}
function nO(A) {
  var e = A.state, t = A.options, n = A.name;
  if (!e.modifiersData[n]._skip) {
    for (var i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !0 : l, c = t.fallbackPlacements, h = t.padding, w = t.boundary, B = t.rootBoundary, p = t.altBoundary, v = t.flipVariations, o = v === void 0 ? !0 : v, C = t.allowedAutoPlacements, F = e.options.placement, U = sr(F), H = U === F, D = c || (H || !o ? [kl(F)] : tO(F)), b = [F].concat(D).reduce(function(S, K) {
      return S.concat(sr(K) === Sp ? eO(e, {
        placement: K,
        boundary: w,
        rootBoundary: B,
        padding: h,
        flipVariations: o,
        allowedAutoPlacements: C
      }) : K);
    }, []), M = e.rects.reference, R = e.rects.popper, J = /* @__PURE__ */ new Map(), hA = !0, cA = b[0], wA = 0; wA < b.length; wA++) {
      var QA = b[wA], OA = sr(QA), bA = io(QA) === to, q = [Zt, Qn].indexOf(OA) >= 0, CA = q ? "width" : "height", iA = bs(e, {
        placement: QA,
        boundary: w,
        rootBoundary: B,
        altBoundary: p,
        padding: h
      }), gA = q ? bA ? Fn : An : bA ? Qn : Zt;
      M[CA] > R[CA] && (gA = kl(gA));
      var IA = kl(gA), HA = [];
      if (s && HA.push(iA[OA] <= 0), f && HA.push(iA[gA] <= 0, iA[IA] <= 0), HA.every(function(S) {
        return S;
      })) {
        cA = QA, hA = !1;
        break;
      }
      J.set(QA, HA);
    }
    if (hA)
      for (var uA = o ? 3 : 1, T = function(K) {
        var aA = b.find(function(EA) {
          var _A = J.get(EA);
          if (_A)
            return _A.slice(0, K).every(function(qA) {
              return qA;
            });
        });
        if (aA)
          return cA = aA, "break";
      }, rA = uA; rA > 0; rA--) {
        var j = T(rA);
        if (j === "break") break;
      }
    e.placement !== cA && (e.modifiersData[n]._skip = !0, e.placement = cA, e.reset = !0);
  }
}
const rO = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: nO,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function Sw(A, e, t) {
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
function Lw(A) {
  return [Zt, Fn, Qn, An].some(function(e) {
    return A[e] >= 0;
  });
}
function iO(A) {
  var e = A.state, t = A.name, n = e.rects.reference, i = e.rects.popper, s = e.modifiersData.preventOverflow, l = bs(e, {
    elementContext: "reference"
  }), f = bs(e, {
    altBoundary: !0
  }), c = Sw(l, n), h = Sw(f, i, s), w = Lw(c), B = Lw(h);
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
const aO = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: iO
};
function oO(A, e, t) {
  var n = sr(A), i = [An, Zt].indexOf(n) >= 0 ? -1 : 1, s = typeof t == "function" ? t(Object.assign({}, e, {
    placement: A
  })) : t, l = s[0], f = s[1];
  return l = l || 0, f = (f || 0) * i, [An, Fn].indexOf(n) >= 0 ? {
    x: f,
    y: l
  } : {
    x: l,
    y: f
  };
}
function sO(A) {
  var e = A.state, t = A.options, n = A.name, i = t.offset, s = i === void 0 ? [0, 0] : i, l = u0.reduce(function(w, B) {
    return w[B] = oO(B, e.rects, s), w;
  }, {}), f = l[e.placement], c = f.x, h = f.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += c, e.modifiersData.popperOffsets.y += h), e.modifiersData[n] = l;
}
const uO = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: sO
};
function lO(A) {
  var e = A.state, t = A.name;
  e.modifiersData[t] = B0({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const cO = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: lO,
  data: {}
};
function fO(A) {
  return A === "x" ? "y" : "x";
}
function hO(A) {
  var e = A.state, t = A.options, n = A.name, i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !1 : l, c = t.boundary, h = t.rootBoundary, w = t.altBoundary, B = t.padding, p = t.tether, v = p === void 0 ? !0 : p, o = t.tetherOffset, C = o === void 0 ? 0 : o, F = bs(e, {
    boundary: c,
    rootBoundary: h,
    padding: B,
    altBoundary: w
  }), U = sr(e.placement), H = io(e.placement), D = !H, b = Dp(U), M = fO(b), R = e.modifiersData.popperOffsets, J = e.rects.reference, hA = e.rects.popper, cA = typeof C == "function" ? C(Object.assign({}, e.rects, {
    placement: e.placement
  })) : C, wA = typeof cA == "number" ? {
    mainAxis: cA,
    altAxis: cA
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, cA), QA = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, OA = {
    x: 0,
    y: 0
  };
  if (R) {
    if (s) {
      var bA, q = b === "y" ? Zt : An, CA = b === "y" ? Qn : Fn, iA = b === "y" ? "height" : "width", gA = R[b], IA = gA + F[q], HA = gA - F[CA], uA = v ? -hA[iA] / 2 : 0, T = H === to ? J[iA] : hA[iA], rA = H === to ? -hA[iA] : -J[iA], j = e.elements.arrow, S = v && j ? Tp(j) : {
        width: 0,
        height: 0
      }, K = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : h0(), aA = K[q], EA = K[CA], _A = hs(0, J[iA], S[iA]), qA = D ? J[iA] / 2 - uA - _A - aA - wA.mainAxis : T - _A - aA - wA.mainAxis, ZA = D ? -J[iA] / 2 + uA + _A + EA + wA.mainAxis : rA + _A + EA + wA.mainAxis, X = e.elements.arrow && Ms(e.elements.arrow), V = X ? b === "y" ? X.clientTop || 0 : X.clientLeft || 0 : 0, k = (bA = QA == null ? void 0 : QA[b]) != null ? bA : 0, eA = gA + qA - k - V, lA = gA + ZA - k, SA = hs(v ? sc(IA, eA) : IA, gA, v ? Zi(HA, lA) : HA);
      R[b] = SA, OA[b] = SA - gA;
    }
    if (f) {
      var zA, ie = b === "x" ? Zt : An, Te = b === "x" ? Qn : Fn, we = R[M], JA = M === "y" ? "height" : "width", Ee = we + F[ie], GA = we - F[Te], Ge = [Zt, An].indexOf(U) !== -1, Ut = (zA = QA == null ? void 0 : QA[M]) != null ? zA : 0, Ot = Ge ? Ee : we - J[JA] - hA[JA] - Ut + wA.altAxis, Et = Ge ? we + J[JA] + hA[JA] - Ut - wA.altAxis : GA, Bt = v && Ge ? ND(Ot, we, Et) : hs(v ? Ot : Ee, we, v ? Et : GA);
      R[M] = Bt, OA[M] = Bt - we;
    }
    e.modifiersData[n] = OA;
  }
}
const dO = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: hO,
  requiresIfExists: ["offset"]
};
function pO(A) {
  return {
    scrollLeft: A.scrollLeft,
    scrollTop: A.scrollTop
  };
}
function gO(A) {
  return A === sn(A) || !Cn(A) ? Op(A) : pO(A);
}
function BO(A) {
  var e = A.getBoundingClientRect(), t = no(e.width) / A.offsetWidth || 1, n = no(e.height) / A.offsetHeight || 1;
  return t !== 1 || n !== 1;
}
function wO(A, e, t) {
  t === void 0 && (t = !1);
  var n = Cn(e), i = Cn(e) && BO(e), s = Ci(e), l = ro(A, i, t), f = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (n || !n && !t) && ((ur(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Mp(s)) && (f = gO(e)), Cn(e) ? (c = ro(e, !0), c.x += e.clientLeft, c.y += e.clientTop) : s && (c.x = Np(s))), {
    x: l.left + f.scrollLeft - c.x,
    y: l.top + f.scrollTop - c.y,
    width: l.width,
    height: l.height
  };
}
function mO(A) {
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
function vO(A) {
  var e = mO(A);
  return SD.reduce(function(t, n) {
    return t.concat(e.filter(function(i) {
      return i.phase === n;
    }));
  }, []);
}
function yO(A) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(A());
      });
    })), e;
  };
}
function CO(A) {
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
var Tw = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Dw() {
  for (var A = arguments.length, e = new Array(A), t = 0; t < A; t++)
    e[t] = arguments[t];
  return !e.some(function(n) {
    return !(n && typeof n.getBoundingClientRect == "function");
  });
}
function QO(A) {
  A === void 0 && (A = {});
  var e = A, t = e.defaultModifiers, n = t === void 0 ? [] : t, i = e.defaultOptions, s = i === void 0 ? Tw : i;
  return function(f, c, h) {
    h === void 0 && (h = s);
    var w = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Tw, s),
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
        var H = typeof U == "function" ? U(w.options) : U;
        C(), w.options = Object.assign({}, s, w.options, H), w.scrollParents = {
          reference: oa(f) ? ds(f) : f.contextElement ? ds(f.contextElement) : [],
          popper: ds(c)
        };
        var D = vO(CO([].concat(n, w.options.modifiers)));
        return w.orderedModifiers = D.filter(function(b) {
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
          var U = w.elements, H = U.reference, D = U.popper;
          if (Dw(H, D)) {
            w.rects = {
              reference: wO(H, Ms(D), w.options.strategy === "fixed"),
              popper: Tp(D)
            }, w.reset = !1, w.placement = w.options.placement, w.orderedModifiers.forEach(function(wA) {
              return w.modifiersData[wA.name] = Object.assign({}, wA.data);
            });
            for (var b = 0; b < w.orderedModifiers.length; b++) {
              if (w.reset === !0) {
                w.reset = !1, b = -1;
                continue;
              }
              var M = w.orderedModifiers[b], R = M.fn, J = M.options, hA = J === void 0 ? {} : J, cA = M.name;
              typeof R == "function" && (w = R({
                state: w,
                options: hA,
                name: cA,
                instance: v
              }) || w);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: yO(function() {
        return new Promise(function(F) {
          v.forceUpdate(), F(w);
        });
      }),
      destroy: function() {
        C(), p = !0;
      }
    };
    if (!Dw(f, c))
      return v;
    v.setOptions(h).then(function(F) {
      !p && h.onFirstUpdate && h.onFirstUpdate(F);
    });
    function o() {
      w.orderedModifiers.forEach(function(F) {
        var U = F.name, H = F.options, D = H === void 0 ? {} : H, b = F.effect;
        if (typeof b == "function") {
          var M = b({
            state: w,
            name: U,
            instance: v,
            options: D
          }), R = function() {
          };
          B.push(M || R);
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
var FO = [XD, cO, VD, l0, uO, rO, dO, KD, aO], UO = /* @__PURE__ */ QO({
  defaultModifiers: FO
}), EO = "tippy-box", w0 = "tippy-content", bO = "tippy-backdrop", m0 = "tippy-arrow", v0 = "tippy-svg-arrow", Vi = {
  passive: !0,
  capture: !0
}, y0 = function() {
  return document.body;
};
function _O(A, e) {
  return {}.hasOwnProperty.call(A, e);
}
function uh(A, e, t) {
  if (Array.isArray(A)) {
    var n = A[e];
    return n ?? (Array.isArray(t) ? t[e] : t);
  }
  return A;
}
function Pp(A, e) {
  var t = {}.toString.call(A);
  return t.indexOf("[object") === 0 && t.indexOf(e + "]") > -1;
}
function C0(A, e) {
  return typeof A == "function" ? A.apply(void 0, e) : A;
}
function Ow(A, e) {
  if (e === 0)
    return A;
  var t;
  return function(n) {
    clearTimeout(t), t = setTimeout(function() {
      A(n);
    }, e);
  };
}
function xO(A, e) {
  var t = Object.assign({}, A);
  return e.forEach(function(n) {
    delete t[n];
  }), t;
}
function IO(A) {
  return A.split(/\s+/).filter(Boolean);
}
function ka(A) {
  return [].concat(A);
}
function Nw(A, e) {
  A.indexOf(e) === -1 && A.push(e);
}
function HO(A) {
  return A.filter(function(e, t) {
    return A.indexOf(e) === t;
  });
}
function SO(A) {
  return A.split("-")[0];
}
function uc(A) {
  return [].slice.call(A);
}
function Mw(A) {
  return Object.keys(A).reduce(function(e, t) {
    return A[t] !== void 0 && (e[t] = A[t]), e;
  }, {});
}
function ps() {
  return document.createElement("div");
}
function _s(A) {
  return ["Element", "Fragment"].some(function(e) {
    return Pp(A, e);
  });
}
function LO(A) {
  return Pp(A, "NodeList");
}
function TO(A) {
  return Pp(A, "MouseEvent");
}
function DO(A) {
  return !!(A && A._tippy && A._tippy.reference === A);
}
function OO(A) {
  return _s(A) ? [A] : LO(A) ? uc(A) : Array.isArray(A) ? A : uc(document.querySelectorAll(A));
}
function lh(A, e) {
  A.forEach(function(t) {
    t && (t.style.transitionDuration = e + "ms");
  });
}
function Pw(A, e) {
  A.forEach(function(t) {
    t && t.setAttribute("data-state", e);
  });
}
function NO(A) {
  var e, t = ka(A), n = t[0];
  return n != null && (e = n.ownerDocument) != null && e.body ? n.ownerDocument : document;
}
function MO(A, e) {
  var t = e.clientX, n = e.clientY;
  return A.every(function(i) {
    var s = i.popperRect, l = i.popperState, f = i.props, c = f.interactiveBorder, h = SO(l.placement), w = l.modifiersData.offset;
    if (!w)
      return !0;
    var B = h === "bottom" ? w.top.y : 0, p = h === "top" ? w.bottom.y : 0, v = h === "right" ? w.left.x : 0, o = h === "left" ? w.right.x : 0, C = s.top - n + B > c, F = n - s.bottom - p > c, U = s.left - t + v > c, H = t - s.right - o > c;
    return C || F || U || H;
  });
}
function ch(A, e, t) {
  var n = e + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(i) {
    A[n](i, t);
  });
}
function Rw(A, e) {
  for (var t = e; t; ) {
    var n;
    if (A.contains(t))
      return !0;
    t = t.getRootNode == null || (n = t.getRootNode()) == null ? void 0 : n.host;
  }
  return !1;
}
var ir = {
  isTouch: !1
}, Kw = 0;
function PO() {
  ir.isTouch || (ir.isTouch = !0, window.performance && document.addEventListener("mousemove", Q0));
}
function Q0() {
  var A = performance.now();
  A - Kw < 20 && (ir.isTouch = !1, document.removeEventListener("mousemove", Q0)), Kw = A;
}
function RO() {
  var A = document.activeElement;
  if (DO(A)) {
    var e = A._tippy;
    A.blur && !e.state.isVisible && A.blur();
  }
}
function KO() {
  document.addEventListener("touchstart", PO, Vi), window.addEventListener("blur", RO);
}
var kO = typeof window < "u" && typeof document < "u", $O = kO ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function Ta(A) {
  var e = A === "destroy" ? "n already-" : " ";
  return [A + "() was called on a" + e + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function kw(A) {
  var e = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return A.replace(e, " ").replace(t, "").trim();
}
function GO(A) {
  return kw(`
  %ctippy.js

  %c` + kw(A) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function F0(A) {
  return [
    GO(A),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var xs;
process.env.NODE_ENV !== "production" && VO();
function VO() {
  xs = /* @__PURE__ */ new Set();
}
function Or(A, e) {
  if (A && !xs.has(e)) {
    var t;
    xs.add(e), (t = console).warn.apply(t, F0(e));
  }
}
function nd(A, e) {
  if (A && !xs.has(e)) {
    var t;
    xs.add(e), (t = console).error.apply(t, F0(e));
  }
}
function WO(A) {
  var e = !A, t = Object.prototype.toString.call(A) === "[object Object]" && !A.addEventListener;
  nd(e, ["tippy() was passed", "`" + String(A) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), nd(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var U0 = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, XO = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, on = Object.assign({
  appendTo: y0,
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
}, U0, XO), qO = Object.keys(on), zO = function(e) {
  process.env.NODE_ENV !== "production" && b0(e, []);
  var t = Object.keys(e);
  t.forEach(function(n) {
    on[n] = e[n];
  });
};
function E0(A) {
  var e = A.plugins || [], t = e.reduce(function(n, i) {
    var s = i.name, l = i.defaultValue;
    if (s) {
      var f;
      n[s] = A[s] !== void 0 ? A[s] : (f = on[s]) != null ? f : l;
    }
    return n;
  }, {});
  return Object.assign({}, A, t);
}
function JO(A, e) {
  var t = e ? Object.keys(E0(Object.assign({}, on, {
    plugins: e
  }))) : qO, n = t.reduce(function(i, s) {
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
function $w(A, e) {
  var t = Object.assign({}, e, {
    content: C0(e.content, [A])
  }, e.ignoreAttributes ? {} : JO(A, e.plugins));
  return t.aria = Object.assign({}, on.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function b0(A, e) {
  A === void 0 && (A = {}), e === void 0 && (e = []);
  var t = Object.keys(A);
  t.forEach(function(n) {
    var i = xO(on, Object.keys(U0)), s = !_O(i, n);
    s && (s = e.filter(function(l) {
      return l.name === n;
    }).length === 0), Or(s, ["`" + n + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var jO = function() {
  return "innerHTML";
};
function rd(A, e) {
  A[jO()] = e;
}
function Gw(A) {
  var e = ps();
  return A === !0 ? e.className = m0 : (e.className = v0, _s(A) ? e.appendChild(A) : rd(e, A)), e;
}
function Vw(A, e) {
  _s(e.content) ? (rd(A, ""), A.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? rd(A, e.content) : A.textContent = e.content);
}
function id(A) {
  var e = A.firstElementChild, t = uc(e.children);
  return {
    box: e,
    content: t.find(function(n) {
      return n.classList.contains(w0);
    }),
    arrow: t.find(function(n) {
      return n.classList.contains(m0) || n.classList.contains(v0);
    }),
    backdrop: t.find(function(n) {
      return n.classList.contains(bO);
    })
  };
}
function _0(A) {
  var e = ps(), t = ps();
  t.className = EO, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var n = ps();
  n.className = w0, n.setAttribute("data-state", "hidden"), Vw(n, A.props), e.appendChild(t), t.appendChild(n), i(A.props, A.props);
  function i(s, l) {
    var f = id(e), c = f.box, h = f.content, w = f.arrow;
    l.theme ? c.setAttribute("data-theme", l.theme) : c.removeAttribute("data-theme"), typeof l.animation == "string" ? c.setAttribute("data-animation", l.animation) : c.removeAttribute("data-animation"), l.inertia ? c.setAttribute("data-inertia", "") : c.removeAttribute("data-inertia"), c.style.maxWidth = typeof l.maxWidth == "number" ? l.maxWidth + "px" : l.maxWidth, l.role ? c.setAttribute("role", l.role) : c.removeAttribute("role"), (s.content !== l.content || s.allowHTML !== l.allowHTML) && Vw(h, A.props), l.arrow ? w ? s.arrow !== l.arrow && (c.removeChild(w), c.appendChild(Gw(l.arrow))) : c.appendChild(Gw(l.arrow)) : w && c.removeChild(w);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
_0.$$tippy = !0;
var YO = 1, ol = [], fh = [];
function ZO(A, e) {
  var t = $w(A, Object.assign({}, on, E0(Mw(e)))), n, i, s, l = !1, f = !1, c = !1, h = !1, w, B, p, v = [], o = Ow(eA, t.interactiveDebounce), C, F = YO++, U = null, H = HO(t.plugins), D = {
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
    popper: ps(),
    popperInstance: U,
    props: t,
    state: D,
    plugins: H,
    // methods
    clearDelayTimeouts: Ot,
    setProps: Et,
    setContent: Bt,
    show: un,
    hide: dr,
    hideWithInteractivity: Qi,
    enable: Ge,
    disable: Ut,
    unmount: Gr,
    destroy: Vr
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && nd(!0, "render() function has not been supplied."), b;
  var M = t.render(b), R = M.popper, J = M.onUpdate;
  R.setAttribute("data-tippy-root", ""), R.id = "tippy-" + b.id, b.popper = R, A._tippy = b, R._tippy = b;
  var hA = H.map(function(pA) {
    return pA.fn(b);
  }), cA = A.hasAttribute("aria-expanded");
  return X(), uA(), gA(), IA("onCreate", [b]), t.showOnCreate && Ee(), R.addEventListener("mouseenter", function() {
    b.props.interactive && b.state.isVisible && b.clearDelayTimeouts();
  }), R.addEventListener("mouseleave", function() {
    b.props.interactive && b.props.trigger.indexOf("mouseenter") >= 0 && q().addEventListener("mousemove", o);
  }), b;
  function wA() {
    var pA = b.props.touch;
    return Array.isArray(pA) ? pA : [pA, 0];
  }
  function QA() {
    return wA()[0] === "hold";
  }
  function OA() {
    var pA;
    return !!((pA = b.props.render) != null && pA.$$tippy);
  }
  function bA() {
    return C || A;
  }
  function q() {
    var pA = bA().parentNode;
    return pA ? NO(pA) : document;
  }
  function CA() {
    return id(R);
  }
  function iA(pA) {
    return b.state.isMounted && !b.state.isVisible || ir.isTouch || w && w.type === "focus" ? 0 : uh(b.props.delay, pA ? 0 : 1, on.delay);
  }
  function gA(pA) {
    pA === void 0 && (pA = !1), R.style.pointerEvents = b.props.interactive && !pA ? "" : "none", R.style.zIndex = "" + b.props.zIndex;
  }
  function IA(pA, MA, jA) {
    if (jA === void 0 && (jA = !0), hA.forEach(function(Ce) {
      Ce[pA] && Ce[pA].apply(Ce, MA);
    }), jA) {
      var ye;
      (ye = b.props)[pA].apply(ye, MA);
    }
  }
  function HA() {
    var pA = b.props.aria;
    if (pA.content) {
      var MA = "aria-" + pA.content, jA = R.id, ye = ka(b.props.triggerTarget || A);
      ye.forEach(function(Ce) {
        var ot = Ce.getAttribute(MA);
        if (b.state.isVisible)
          Ce.setAttribute(MA, ot ? ot + " " + jA : jA);
        else {
          var bt = ot && ot.replace(jA, "").trim();
          bt ? Ce.setAttribute(MA, bt) : Ce.removeAttribute(MA);
        }
      });
    }
  }
  function uA() {
    if (!(cA || !b.props.aria.expanded)) {
      var pA = ka(b.props.triggerTarget || A);
      pA.forEach(function(MA) {
        b.props.interactive ? MA.setAttribute("aria-expanded", b.state.isVisible && MA === bA() ? "true" : "false") : MA.removeAttribute("aria-expanded");
      });
    }
  }
  function T() {
    q().removeEventListener("mousemove", o), ol = ol.filter(function(pA) {
      return pA !== o;
    });
  }
  function rA(pA) {
    if (!(ir.isTouch && (c || pA.type === "mousedown"))) {
      var MA = pA.composedPath && pA.composedPath()[0] || pA.target;
      if (!(b.props.interactive && Rw(R, MA))) {
        if (ka(b.props.triggerTarget || A).some(function(jA) {
          return Rw(jA, MA);
        })) {
          if (ir.isTouch || b.state.isVisible && b.props.trigger.indexOf("click") >= 0)
            return;
        } else
          IA("onClickOutside", [b, pA]);
        b.props.hideOnClick === !0 && (b.clearDelayTimeouts(), b.hide(), f = !0, setTimeout(function() {
          f = !1;
        }), b.state.isMounted || aA());
      }
    }
  }
  function j() {
    c = !0;
  }
  function S() {
    c = !1;
  }
  function K() {
    var pA = q();
    pA.addEventListener("mousedown", rA, !0), pA.addEventListener("touchend", rA, Vi), pA.addEventListener("touchstart", S, Vi), pA.addEventListener("touchmove", j, Vi);
  }
  function aA() {
    var pA = q();
    pA.removeEventListener("mousedown", rA, !0), pA.removeEventListener("touchend", rA, Vi), pA.removeEventListener("touchstart", S, Vi), pA.removeEventListener("touchmove", j, Vi);
  }
  function EA(pA, MA) {
    qA(pA, function() {
      !b.state.isVisible && R.parentNode && R.parentNode.contains(R) && MA();
    });
  }
  function _A(pA, MA) {
    qA(pA, MA);
  }
  function qA(pA, MA) {
    var jA = CA().box;
    function ye(Ce) {
      Ce.target === jA && (ch(jA, "remove", ye), MA());
    }
    if (pA === 0)
      return MA();
    ch(jA, "remove", B), ch(jA, "add", ye), B = ye;
  }
  function ZA(pA, MA, jA) {
    jA === void 0 && (jA = !1);
    var ye = ka(b.props.triggerTarget || A);
    ye.forEach(function(Ce) {
      Ce.addEventListener(pA, MA, jA), v.push({
        node: Ce,
        eventType: pA,
        handler: MA,
        options: jA
      });
    });
  }
  function X() {
    QA() && (ZA("touchstart", k, {
      passive: !0
    }), ZA("touchend", lA, {
      passive: !0
    })), IO(b.props.trigger).forEach(function(pA) {
      if (pA !== "manual")
        switch (ZA(pA, k), pA) {
          case "mouseenter":
            ZA("mouseleave", lA);
            break;
          case "focus":
            ZA($O ? "focusout" : "blur", SA);
            break;
          case "focusin":
            ZA("focusout", SA);
            break;
        }
    });
  }
  function V() {
    v.forEach(function(pA) {
      var MA = pA.node, jA = pA.eventType, ye = pA.handler, Ce = pA.options;
      MA.removeEventListener(jA, ye, Ce);
    }), v = [];
  }
  function k(pA) {
    var MA, jA = !1;
    if (!(!b.state.isEnabled || zA(pA) || f)) {
      var ye = ((MA = w) == null ? void 0 : MA.type) === "focus";
      w = pA, C = pA.currentTarget, uA(), !b.state.isVisible && TO(pA) && ol.forEach(function(Ce) {
        return Ce(pA);
      }), pA.type === "click" && (b.props.trigger.indexOf("mouseenter") < 0 || l) && b.props.hideOnClick !== !1 && b.state.isVisible ? jA = !0 : Ee(pA), pA.type === "click" && (l = !jA), jA && !ye && GA(pA);
    }
  }
  function eA(pA) {
    var MA = pA.target, jA = bA().contains(MA) || R.contains(MA);
    if (!(pA.type === "mousemove" && jA)) {
      var ye = JA().concat(R).map(function(Ce) {
        var ot, bt = Ce._tippy, Un = (ot = bt.popperInstance) == null ? void 0 : ot.state;
        return Un ? {
          popperRect: Ce.getBoundingClientRect(),
          popperState: Un,
          props: t
        } : null;
      }).filter(Boolean);
      MO(ye, pA) && (T(), GA(pA));
    }
  }
  function lA(pA) {
    var MA = zA(pA) || b.props.trigger.indexOf("click") >= 0 && l;
    if (!MA) {
      if (b.props.interactive) {
        b.hideWithInteractivity(pA);
        return;
      }
      GA(pA);
    }
  }
  function SA(pA) {
    b.props.trigger.indexOf("focusin") < 0 && pA.target !== bA() || b.props.interactive && pA.relatedTarget && R.contains(pA.relatedTarget) || GA(pA);
  }
  function zA(pA) {
    return ir.isTouch ? QA() !== pA.type.indexOf("touch") >= 0 : !1;
  }
  function ie() {
    Te();
    var pA = b.props, MA = pA.popperOptions, jA = pA.placement, ye = pA.offset, Ce = pA.getReferenceClientRect, ot = pA.moveTransition, bt = OA() ? id(R).arrow : null, Un = Ce ? {
      getBoundingClientRect: Ce,
      contextElement: Ce.contextElement || bA()
    } : A, Fi = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Wr) {
        var ln = Wr.state;
        if (OA()) {
          var Ei = CA(), Xr = Ei.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(pr) {
            pr === "placement" ? Xr.setAttribute("data-placement", ln.placement) : ln.attributes.popper["data-popper-" + pr] ? Xr.setAttribute("data-" + pr, "") : Xr.removeAttribute("data-" + pr);
          }), ln.attributes.popper = {};
        }
      }
    }, En = [{
      name: "offset",
      options: {
        offset: ye
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
    }, Fi];
    OA() && bt && En.push({
      name: "arrow",
      options: {
        element: bt,
        padding: 3
      }
    }), En.push.apply(En, (MA == null ? void 0 : MA.modifiers) || []), b.popperInstance = UO(Un, R, Object.assign({}, MA, {
      placement: jA,
      onFirstUpdate: p,
      modifiers: En
    }));
  }
  function Te() {
    b.popperInstance && (b.popperInstance.destroy(), b.popperInstance = null);
  }
  function we() {
    var pA = b.props.appendTo, MA, jA = bA();
    b.props.interactive && pA === y0 || pA === "parent" ? MA = jA.parentNode : MA = C0(pA, [jA]), MA.contains(R) || MA.appendChild(R), b.state.isMounted = !0, ie(), process.env.NODE_ENV !== "production" && Or(b.props.interactive && pA === on.appendTo && jA.nextElementSibling !== R, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function JA() {
    return uc(R.querySelectorAll("[data-tippy-root]"));
  }
  function Ee(pA) {
    b.clearDelayTimeouts(), pA && IA("onTrigger", [b, pA]), K();
    var MA = iA(!0), jA = wA(), ye = jA[0], Ce = jA[1];
    ir.isTouch && ye === "hold" && Ce && (MA = Ce), MA ? n = setTimeout(function() {
      b.show();
    }, MA) : b.show();
  }
  function GA(pA) {
    if (b.clearDelayTimeouts(), IA("onUntrigger", [b, pA]), !b.state.isVisible) {
      aA();
      return;
    }
    if (!(b.props.trigger.indexOf("mouseenter") >= 0 && b.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(pA.type) >= 0 && l)) {
      var MA = iA(!1);
      MA ? i = setTimeout(function() {
        b.state.isVisible && b.hide();
      }, MA) : s = requestAnimationFrame(function() {
        b.hide();
      });
    }
  }
  function Ge() {
    b.state.isEnabled = !0;
  }
  function Ut() {
    b.hide(), b.state.isEnabled = !1;
  }
  function Ot() {
    clearTimeout(n), clearTimeout(i), cancelAnimationFrame(s);
  }
  function Et(pA) {
    if (process.env.NODE_ENV !== "production" && Or(b.state.isDestroyed, Ta("setProps")), !b.state.isDestroyed) {
      IA("onBeforeUpdate", [b, pA]), V();
      var MA = b.props, jA = $w(A, Object.assign({}, MA, Mw(pA), {
        ignoreAttributes: !0
      }));
      b.props = jA, X(), MA.interactiveDebounce !== jA.interactiveDebounce && (T(), o = Ow(eA, jA.interactiveDebounce)), MA.triggerTarget && !jA.triggerTarget ? ka(MA.triggerTarget).forEach(function(ye) {
        ye.removeAttribute("aria-expanded");
      }) : jA.triggerTarget && A.removeAttribute("aria-expanded"), uA(), gA(), J && J(MA, jA), b.popperInstance && (ie(), JA().forEach(function(ye) {
        requestAnimationFrame(ye._tippy.popperInstance.forceUpdate);
      })), IA("onAfterUpdate", [b, pA]);
    }
  }
  function Bt(pA) {
    b.setProps({
      content: pA
    });
  }
  function un() {
    process.env.NODE_ENV !== "production" && Or(b.state.isDestroyed, Ta("show"));
    var pA = b.state.isVisible, MA = b.state.isDestroyed, jA = !b.state.isEnabled, ye = ir.isTouch && !b.props.touch, Ce = uh(b.props.duration, 0, on.duration);
    if (!(pA || MA || jA || ye) && !bA().hasAttribute("disabled") && (IA("onShow", [b], !1), b.props.onShow(b) !== !1)) {
      if (b.state.isVisible = !0, OA() && (R.style.visibility = "visible"), gA(), K(), b.state.isMounted || (R.style.transition = "none"), OA()) {
        var ot = CA(), bt = ot.box, Un = ot.content;
        lh([bt, Un], 0);
      }
      p = function() {
        var En;
        if (!(!b.state.isVisible || h)) {
          if (h = !0, R.offsetHeight, R.style.transition = b.props.moveTransition, OA() && b.props.animation) {
            var Ui = CA(), Wr = Ui.box, ln = Ui.content;
            lh([Wr, ln], Ce), Pw([Wr, ln], "visible");
          }
          HA(), uA(), Nw(fh, b), (En = b.popperInstance) == null || En.forceUpdate(), IA("onMount", [b]), b.props.animation && OA() && _A(Ce, function() {
            b.state.isShown = !0, IA("onShown", [b]);
          });
        }
      }, we();
    }
  }
  function dr() {
    process.env.NODE_ENV !== "production" && Or(b.state.isDestroyed, Ta("hide"));
    var pA = !b.state.isVisible, MA = b.state.isDestroyed, jA = !b.state.isEnabled, ye = uh(b.props.duration, 1, on.duration);
    if (!(pA || MA || jA) && (IA("onHide", [b], !1), b.props.onHide(b) !== !1)) {
      if (b.state.isVisible = !1, b.state.isShown = !1, h = !1, l = !1, OA() && (R.style.visibility = "hidden"), T(), aA(), gA(!0), OA()) {
        var Ce = CA(), ot = Ce.box, bt = Ce.content;
        b.props.animation && (lh([ot, bt], ye), Pw([ot, bt], "hidden"));
      }
      HA(), uA(), b.props.animation ? OA() && EA(ye, b.unmount) : b.unmount();
    }
  }
  function Qi(pA) {
    process.env.NODE_ENV !== "production" && Or(b.state.isDestroyed, Ta("hideWithInteractivity")), q().addEventListener("mousemove", o), Nw(ol, o), o(pA);
  }
  function Gr() {
    process.env.NODE_ENV !== "production" && Or(b.state.isDestroyed, Ta("unmount")), b.state.isVisible && b.hide(), b.state.isMounted && (Te(), JA().forEach(function(pA) {
      pA._tippy.unmount();
    }), R.parentNode && R.parentNode.removeChild(R), fh = fh.filter(function(pA) {
      return pA !== b;
    }), b.state.isMounted = !1, IA("onHidden", [b]));
  }
  function Vr() {
    process.env.NODE_ENV !== "production" && Or(b.state.isDestroyed, Ta("destroy")), !b.state.isDestroyed && (b.clearDelayTimeouts(), b.unmount(), V(), delete A._tippy, b.state.isDestroyed = !0, IA("onDestroy", [b]));
  }
}
function Ps(A, e) {
  e === void 0 && (e = {});
  var t = on.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (WO(A), b0(e, t)), KO();
  var n = Object.assign({}, e, {
    plugins: t
  }), i = OO(A);
  if (process.env.NODE_ENV !== "production") {
    var s = _s(n.content), l = i.length > 1;
    Or(s && l, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var f = i.reduce(function(c, h) {
    var w = h && ZO(h, n);
    return w && c.push(w), c;
  }, []);
  return _s(A) ? f[0] : f;
}
Ps.defaultProps = on;
Ps.setDefaultProps = zO;
Ps.currentInput = ir;
Object.assign({}, l0, {
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
Ps.setDefaultProps({
  render: _0
});
const A4 = "_btn_pqsxd_1", e4 = "_btnGroup_pqsxd_4", sl = {
  btn: A4,
  btnGroup: e4
}, t4 = function(A) {
  var e = {
    onAnnotationSelectFunction: ue.noop(),
    drawing: null,
    popoverId: ""
  }, t = xe.merge({}, e, A), n = {
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
      B.forEach(U), p.each(function(H) {
        var D = XA(this);
        i(D, H);
      }), t.onAnnotationSelectFunction();
    });
    var o = p.enter(), C = o.append("p");
    C.append("span").classed("genelabel", !0), C.append("div").classed("btn-group", !0), p.each(function(F) {
      var U = XA(this), H = U.select("div.btn-group");
      H.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(b) {
        return b;
      }).classed(`${sl.btn}`, !0).on("click", function(b) {
        var M = n[b];
        M(F), t.onAnnotationSelectFunction(), i(U, F);
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
    ue(".gene-annotation-popover").remove(), Ps(v, {
      content: ue(t.popoverId).html(),
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
      },
      onHide(o) {
      }
    }), v._tippy.show(), ue(document).on("click", function(o) {
      ue(o.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || ue(".gene-annotation-popover").remove();
    }), ue(t.popoverId).on("mousedown mousewheel", function(o) {
      o.stopPropagation();
    });
  }, f;
}, n4 = function(A) {
  var e = {
    border: !1,
    labelRectangles: !1,
    onAnnotationSelectFunction: ue.noop(),
    onExpandClusterFunction: ue.noop(),
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
  }, t = xe.merge({}, e, A), n = null, i = function() {
    return sa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(c, h) {
    xe.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", n = t4(t);
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
}, r4 = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: ue.noop(),
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
  }, t = xe.merge({}, e, A), n = function() {
    return sa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h, w, B, p) {
    var v = {};
    p.map(function(M, R) {
      v[M] = R;
    });
    var o = n(), C = h.selectAll("rect.snp-annotation").data(B, function(M) {
      return M.id;
    }), F = 4, U = function(M) {
      return t.layout.width - 0.2 * t.layout.chromosomeWidth * (1 + v[M.trait]);
    }, H = function(M) {
      return o(M.midpoint) - 0.5 * Math.max(F / t.scale, o(10));
    }, D = Math.max(F / t.scale, o(10)), b = 0.2 * t.layout.chromosomeWidth;
    C.attr("x", U).attr("y", H).attr("width", b).attr("height", D), C.enter().append("rect").attr("fill", function(M) {
      return M.color;
    }).attr("opacity", function(M) {
      return M.importance;
    }).attr("class", "snp-annotation").attr("x", U).attr("y", H).attr("width", b).attr("height", D), C.exit().remove(), C.on("contextmenu", function(M) {
    });
  }, s = function(h, w, B) {
    var p = 500, v = n();
    t.layout.width;
    var o = 0.3 * t.layout.chromosomeWidth, C = 0.4 * t.layout.chromosomeWidth, F = w.layout.qtlNodes.some(function(T) {
      return T.displayLabel;
    });
    F && (C = C * 1.5);
    var U = B * 0.2 * t.layout.chromosomeWidth, H = function(T) {
      return t.layout.width - T.labelPosition * (C + o) - U;
    }, D = function(T) {
      return t.layout.width - T.position * (C + o) - U;
    }, b = h.selectAll("g.qtl-annotation").data(w.layout.qtlNodes, function(T) {
      return T.id;
    }), M = b.enter().append("g").classed("qtl-annotation infobox", !0);
    M.append("rect").classed("qtl-hoverbox", !0);
    var R = M.append("rect").classed("qtl-selector infobox", !0), J = {}, hA = {};
    b.exit().select("rect").each(function(T) {
      J[T.index] = xe.pick(this, ["x", "y", "width", "height"]), J[T.index].midpoint = T.midpoint, J[T.index].position = T.position;
    }), R.each(function(T) {
      hA[T.index] = xe.pick(this, ["x", "y", "width", "height"]), hA[T.index].midpoint = T.midpoint, hA[T.index].position = T.position;
    });
    var cA = function(T, rA, j, S) {
      return xe.has(T, rA) ? T[rA][j].animVal.value : S;
    };
    R.attr("x", function(T) {
      return cA(J, T.parentIndex, "x", D(T));
    }).attr("y", function(T) {
      return cA(J, T.parentIndex, "y", v(T.start));
    }).attr("width", o).attr("height", function(T) {
      return cA(
        J,
        T.parentIndex,
        "height",
        v(T.end) - v(T.start)
      );
    }), b.attr("id", function(T) {
      return "feature_" + T.id;
    }), b.select("rect.qtl-hoverbox").attr("x", function(T) {
      return D(T);
    }).attr("y", function(T) {
      return v(T.start);
    }).attr("width", function(T) {
      return T.position * (C + o) + t.chromosomeWidth + U;
    }).attr("height", function(T) {
      return v(T.end) - v(T.start);
    }).attr("fill", function(T) {
      return T.color;
    }).attr("visibility", function(T) {
      return T.hover ? "visible" : "hidden";
    }), b.select("rect.qtl-selector").transition().duration(p).attr("x", D).attr("y", function(T) {
      return v(T.start);
    }).attr("width", o).attr("height", function(T) {
      return v(T.end) - v(T.start);
    }), b.select("rect.qtl-selector").style("fill", function(T) {
      return T.color;
    }), b.exit().select("rect").transition().duration(p).attr("x", function(T) {
      return cA(hA, T.parentIndex, "x", D(T));
    }).attr("y", function(T) {
      return cA(hA, T.parentIndex, "y", v(T.start));
    }).attr("width", function(T) {
      return o;
    }).attr("height", function(T) {
      return cA(
        hA,
        T.parentIndex,
        "height",
        v(T.end) - v(T.start)
      );
    }).remove(), b.exit().remove();
    var wA = function(T) {
      return v(T.midpoint);
    }, QA = function(T) {
      return T.displayLabel === "show" ? "visible" : T.displayLabel === "hide" ? "hidden" : !0;
    }, OA = M.append("g").classed("qtl-count-group", !0), bA = b.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(T) {
        var rA = T.type == "qtllist" ? [T] : [];
        return rA;
      },
      function(T) {
        return "label_" + T.id;
      }
    ), q = bA.enter(), CA = q.append("g").classed("qtllist", !0);
    CA.append("circle").classed("qtl-count", !0), CA.append("text").classed("qtl-count", !0), OA.each(function(T) {
      if (xe.has(hA, T.index))
        if (xe.has(J, T.parentIndex)) {
          let S = J[T.parentIndex];
          var rA = t.layout.width - S.position * (C + o), j = v(S.midpoint);
          XA(this).attr(
            "transform",
            "translate(" + (rA + 0.5 * o) + "," + j + ")"
          );
        } else
          XA(this).attr("transform", function(S) {
            return S ? "translate(" + (D(S) + 0.5 * o) + "," + wA(S) + ")" : "translate(0,0)";
          });
    }), b.select("g.qtl-count-group").transition().duration(p).attr("transform", function(T) {
      return T ? "translate(" + (D(T) + 0.5 * o) + "," + wA(T) + ")" : "translate(0,0)";
    }), b.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", o + "px").style("visibility", "visible").style("fill", function(T) {
      return T.color;
    }).attr("id", function(T) {
      return T.id;
    });
    var iA = Math.min(
      Math.max(10 / t.scale, o),
      14 / t.scale
    );
    b.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", iA + "px").style(
      "visibility",
      iA < 2 * o ? "visible" : "hidden"
    ).text(function(T) {
      return T.count;
    }), bA.exit().remove(), M.append("g").classed("qtl-label-group", !0);
    var gA = b.select("g.qtl-label-group").selectAll("g.qtl").data(
      function(T) {
        var rA = T.displayLabel ? [T] : [];
        return rA;
      },
      function(T) {
        return "label_" + T.id;
      }
    );
    gA.exit().remove(), gA.transition().duration(p).attr("transform", function(T) {
      return "translate(" + (H(T) + 0.5 * o) + "," + wA(T) + ")";
    });
    var IA = gA.enter(), HA = IA.append("g").classed("qtl", !0).attr("transform", function(T) {
      return "translate(" + (H(T) + 0.5 * o) + "," + wA(T) + ")";
    });
    HA.append("text").classed("qtl-label", !0), b.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(T) {
      return T.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", QA).text(function(T) {
      return T.screenLabel;
    });
    var uA = function(T) {
      T.on("mouseenter", function(rA) {
        rA.hover = !0, s(h, w, B);
      }).on("mouseout", function(rA) {
        rA.hover = !1, s(h, w, B);
      }).on("click", function(rA) {
        rA.hover = !rA.hover, s(h, w, B);
      });
    };
    uA(b.select("rect.qtl-selector")), uA(b.select("circle.qtl-count")), uA(b.select("text.qtl-count")), b.on("contextmenu", function(T) {
      var rA = XA("#clusterPopover");
      rA.attr("class", "popover");
      var j = rA.select(".popover-title");
      j.selectAll("*").remove(), j.text(""), j.text(
        "Chromosome " + T.chromosome + ": " + T.start + "-" + T.end
      ), ue.fn.redraw = function() {
        return ue(this).each(function() {
          this.offsetHeight;
        });
      }, S = rA.select(".popover-content"), S.selectAll("*").remove(), S.text("");
      var S = rA.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        T.type == "qtllist" ? T.qtlList : [T]
      ), K = S.enter();
      K.append("p").classed("popover-annotation", !0);
      var aA = S.append("div").attr("class", "checkbox").append("label");
      aA.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(EA) {
        return EA.selected;
      }).on("click", function(EA) {
        EA.selected = !EA.selected, S.classed("selected", function(_A) {
          return _A.selected;
        }), t.onAnnotationSelectFunction();
      }), aA.append("a").attr("href", function(EA) {
        return EA.link;
      }).attr("target", "_blank").text(function(EA) {
        return EA.label;
      }), S.classed("selected", function(EA) {
        return EA.selected;
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
}, i4 = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: ue.noop(),
    onExpandClusterFunction: ue.noop(),
    onLabelSelectFunction: ue.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, t = xe.merge({}, e, A);
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
      var h = n4().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(l.geneAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).drawing(t.svg).scale(l.scale);
      Wh(".chromosome-cell").call(h);
      var w = vD().layout(l.chromosomePosition).longestChromosome(l.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(l.scale).bands("genes").drawing(t.svg);
      Wh(".chromosome-cell").call(w);
      var B = mD().layout(l.labelPosition).sizeLayout(l.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(l.longestChromosome).scale(l.scale);
      f.call(B);
      var p = r4().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(l.qtlAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).showAnnotationLabels(l.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(l.scale);
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
var x0 = { exports: {} };
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
          }), C = v.distribute(o), C.map(function(U, H) {
            U.forEach(function(D) {
              D.layerIndex = H;
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
            var H = U % v;
            o[H].push(F);
            for (var D = F, b = H - 1; b >= 0; b--) D = D.createStub(h.stubWidth), o[b].push(D);
          }), o;
        }, roundRobin: function(p) {
          var v = [];
          return v;
        }, overlap: function(p) {
          for (var v = [], o = w.maxWidthPerLayer(), C = p.concat(), F = w.computeRequiredWidth(C); F > o; ) {
            w.countIdealOverlaps(C);
            var U = C.concat(), H = F;
            for (C = []; U.length > 2 && H > o; ) {
              U.sort(function(wA, QA) {
                return QA.overlapCount - wA.overlapCount;
              });
              var D = U.shift();
              H -= D.width, H += h.stubWidth, D.overlaps.forEach(function(wA) {
                wA.overlapCount--;
              }), C.push(D);
            }
            v.push(U), F = w.computeRequiredWidth(C);
          }
          C.length > 0 && v.push(C);
          for (var b = v.length - 1; b >= 1; b--) for (var M = v[b], R = 0; R < M.length; R++) {
            var J = M[R];
            if (!J.isStub()) for (var hA = J, cA = b - 1; cA >= 0; cA--) hA = hA.createStub(h.stubWidth), v[cA].push(hA);
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
        var w, B, p, v, o, C, F = arguments[0], U = 1, H = arguments.length, D = !1;
        for (typeof F == "boolean" ? (D = F, F = arguments[1] || {}, U = 2) : ((typeof F > "u" ? "undefined" : i(F)) !== "object" && typeof F != "function" || F == null) && (F = {}); U < H; ++U) if (w = arguments[U], w != null) for (B in w) p = F[B], v = w[B], F !== v && (D && v && (c(v) || (o = f(v))) ? (o ? (o = !1, C = p && f(p) ? p : []) : C = p && c(p) ? p : {}, F[B] = h(D, C, v)) : v !== void 0 && (F[B] = v));
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
        f.call(this, this.root, p + v >> 1, F, !0), F.forEach(function(M) {
          C[M.id] = !0;
        });
        for (var U = this.pointTree.bsearch([p, null]), H = this.pointTree; U >= 0 && H[U][0] == p; ) U--;
        var D = this.pointTree.bsearch([v, null]);
        if (D >= 0) {
          for (var b = H.length - 1; D <= b && H[D][0] <= v; ) D++;
          H.slice(U + 1, D).forEach(function(M) {
            var R = M[1];
            C[R] = !0;
          }, this), Object.keys(C).forEach(function(M) {
            var R = this.intervalHash[M];
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
          B = f.extend(h, B), w.forEach(function(R, J) {
            R.targetPos = R.parent ? R.parent.currentPos : R.idealPos, R.index = J;
          });
          for (var p = w.concat().sort(function(R, J) {
            var hA = R.targetPos - J.targetPos;
            if (hA !== 0) return hA;
            var cA = R.isStub() - J.isStub();
            return cA !== 0 ? cA : R.index - J.index;
          }).map(s), v = [], o = 1; o < p.length; o++) {
            var C = p[o - 1], F = p[o], U = void 0;
            U = C.node.isStub() && F.node.isStub() ? (C.node.width + F.node.width) / 2 + B.lineSpacing : (C.node.width + F.node.width) / 2 + B.nodeSpacing, v.push(new c.Constraint(C, F, U));
          }
          if (f.isDefined(B.minPos)) {
            var H = new c.Variable(B.minPos, 1e10), D = p[0];
            v.push(new c.Constraint(H, D, D.node.width / 2)), p.unshift(H);
          }
          if (f.isDefined(B.maxPos)) {
            var b = new c.Variable(B.maxPos, 1e10), M = f.last(p);
            v.push(new c.Constraint(M, b, M.node.width / 2)), p.push(b);
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
          return p.visitNeighbours(v, function(U, H) {
            var D = C.compute_lm(H, p, o);
            H === U.right ? (F += D * U.left.scale, U.lm = D) : (F += D * U.right.scale, U.lm = -D), o(U);
          }), F / p.scale;
        }, B.prototype.populateSplitBlock = function(p, v) {
          var o = this;
          p.visitNeighbours(v, function(C, F) {
            F.offset = p.offset + (F === C.right ? C.gap : -C.gap), o.addVariable(F), o.populateSplitBlock(F, p);
          });
        }, B.prototype.traverse = function(p, v, o, C) {
          var F = this;
          o === void 0 && (o = this.vars[0]), C === void 0 && (C = null), o.visitNeighbours(C, function(U, H) {
            v.push(p(U)), F.traverse(p, v, H, o);
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
          return p.visitNeighbours(v, function(H, D) {
            U || D !== o && !F.findPath(D, p, o, C) || (U = !0, C(H, D));
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
            var H = o[U];
            if (!H.unsatisfiable) {
              var D = H.slack();
              if ((H.equality || D < p) && (p = D, v = H, F = U, H.equality)) break;
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
        return o === "left" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, H) {
          var D = F * (H + 1) * -1;
          return [[D + v.nodeHeight, U.currentPos], [D, U.currentPos]];
        })) : o === "right" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, H) {
          var D = F * (H + 1);
          return [[D - v.nodeHeight, U.currentPos], [D, U.currentPos]];
        })) : o === "up" ? [[[C[0].idealPos, 0]]].concat(C.map(function(U, H) {
          var D = F * (H + 1) * -1;
          return [[U.currentPos, D + v.nodeHeight], [U.currentPos, D]];
        })) : [[[C[0].idealPos, 0]]].concat(C.map(function(U, H) {
          var D = F * (H + 1);
          return [[U.currentPos, D - v.nodeHeight], [U.currentPos, D]];
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
        return o === "left" || o === "right" ? C.reduce(function(U, H, D) {
          return F.push(w(U[U.length - 1], H[0])), D < C.length - 1 && F.push(l(H[1])), H;
        }) : C.reduce(function(U, H, D) {
          return F.push(h(U[U.length - 1], H[0])), D < C.length - 1 && F.push(l(H[1])), H;
        }), F.join(" ");
      }, t.exports = s;
    }]);
  });
})(x0);
var I0 = x0.exports;
const H0 = /* @__PURE__ */ vc(I0), a4 = /* @__PURE__ */ Lb({
  __proto__: null,
  default: H0
}, [I0]);
function o4(A) {
  return A.slice().sort(function(e, t) {
    return e - t;
  });
}
function Ww(A, e) {
  for (var t = [], n = 0; n < A; n++) {
    for (var i = [], s = 0; s < e; s++)
      i.push(0);
    t.push(i);
  }
  return t;
}
function s4(A) {
  for (var e = 0, t, n = 0; n < A.length; n++)
    (n === 0 || A[n] !== t) && (t = A[n], e++);
  return e;
}
function ad(A, e, t, n) {
  var i;
  if (A > 0) {
    var s = (t[e] - t[A - 1]) / (e - A + 1);
    i = n[e] - n[A - 1] - (e - A + 1) * s * s;
  } else
    i = n[e] - t[e] * t[e] / (e + 1);
  return i < 0 ? 0 : i;
}
function od(A, e, t, n, i, s, l) {
  if (!(A > e)) {
    var f = Math.floor((A + e) / 2);
    n[t][f] = n[t - 1][f - 1], i[t][f] = f;
    var c = t;
    A > t && (c = Math.max(c, i[t][A - 1] || 0)), c = Math.max(c, i[t - 1][f] || 0);
    var h = f - 1;
    e < n[0].length - 1 && (h = Math.min(h, i[t][e + 1] || 0));
    for (var w, B, p, v, o = h; o >= c && (w = ad(o, f, s, l), !(w + n[t - 1][c - 1] >= n[t][f])); --o)
      B = ad(c, f, s, l), p = B + n[t - 1][c - 1], p < n[t][f] && (n[t][f] = p, i[t][f] = c), c++, v = w + n[t - 1][o - 1], v < n[t][f] && (n[t][f] = v, i[t][f] = o);
    od(
      A,
      f - 1,
      t,
      n,
      i,
      s,
      l
    ), od(
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
function u4(A, e, t) {
  for (var n = e[0].length, i = A[Math.floor(n / 2)], s = [], l = [], f = 0, c = void 0; f < n; ++f)
    c = A[f] - i, f === 0 ? (s.push(c), l.push(c * c)) : (s.push(s[f - 1] + c), l.push(
      l[f - 1] + c * c
    )), e[0][f] = ad(0, f, s, l), t[0][f] = 0;
  for (var h, w = 1; w < e.length; ++w)
    w < e.length - 1 ? h = w : h = n - 1, od(
      h,
      n - 1,
      w,
      e,
      t,
      s,
      l
    );
}
function l4(A, e) {
  if (e > A.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var t = o4(A), n = s4(t);
  if (n === 1)
    return [t];
  var i = Ww(e, t.length), s = Ww(e, t.length);
  u4(t, i, s);
  for (var l = [], f = s[0].length - 1, c = s.length - 1; c >= 0; c--) {
    var h = s[c][f];
    l[c] = t.slice(h, f + 1), c > 0 && (f = h - 1);
  }
  return l;
}
const Xw = function(A) {
  var e = {}, t = { nClusters: 6 }, n = xe.merge({}, t, A);
  return e.createClustersFromGenes = function(i) {
    var s = [];
    if (i.length < 1)
      return s;
    var l = Math.min(n.nClusters, i.length), f = i.map(function(B) {
      return B.midpoint;
    });
    let c = l4(f, l);
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
var hh = H0 || a4;
const c4 = function(A) {
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
  }, t = xe.merge({}, e, A), n = function() {
    return sa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(B, p, v, o) {
    var C = 4, F = p / 3, U = F / v * C, H = U * B > o;
    if (H)
      return 2;
    var D = p * (0.1 + 0.1 / B);
    return F = p - D, U = F / v * C, H = U * B > o, H ? 1 : 0;
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
      return new hh.Node(p(F.midpoint), v.setFontSize, F);
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
    let p = B.annotations.allGenes.filter(function(iA) {
      return iA.globalIndex < t.nGenesToDisplay;
    });
    var v = t.layout.width, o = t.layout.height * Math.min(1, 0.2 + B.length / t.longestChromosome), C = p.reduce(function(iA, gA) {
      return Math.max(iA, gA.label.length);
    }, 0), F = 1.1 * t.displayedFontSize, U = 0.9 * t.displayedFontSize, H = i(
      t.scale,
      v,
      C,
      F
    ), D;
    H == 2 ? D = l(
      t.scale,
      v,
      C,
      U,
      o
    ) : H == 1 ? D = s(
      t.scale,
      v,
      C,
      U,
      o
    ) : H == 0 && (D = s(
      t.scale,
      v,
      C,
      U,
      o
    ), D.nLabels = 0);
    var b = n();
    let M = {
      nodeSpacing: D.nodeSpacing,
      lineSpacing: D.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: D.availableHeight,
      density: D.density
    };
    var R = new hh.Force(M);
    p.forEach(function(iA) {
      iA.displayed = !1;
    });
    var J = t.manualLabels ? new Set(
      p.filter(function(iA) {
        return iA.visible;
      })
    ) : /* @__PURE__ */ new Set();
    t.autoLabels && p.slice(0, D.nLabels).filter(function(iA) {
      return !iA.hidden;
    }).forEach(function(iA) {
      J.add(iA);
    });
    var hA = Array.from(J), cA = f(R, b, D, hA);
    !cA == 0 && (R.options({ algorithm: "simple" }), cA = f(R, b, D, hA));
    var wA;
    if (cA && cA.length > 0) {
      var QA = cA.map(function(iA) {
        return iA.getLayerIndex();
      });
      wA = Math.max.apply(null, QA);
    }
    if (!cA || wA > 3) {
      var OA = Xw().nClusters(Math.max(D.nLabels, 1));
      try {
        var bA = OA.createClustersFromGenes(hA);
      } catch {
        bA = [];
      }
      cA = f(R, b, D, bA);
    }
    let q = {
      direction: "right",
      layerGap: D.layerGap,
      nodeHeight: D.spaceForLabel
    };
    var CA = new hh.Renderer(q);
    return CA.layout(cA), cA.forEach(function(iA) {
      iA.data.path = CA.generatePath(iA);
    }), t.manualLabels || Wh(".gene-annotation").remove(), cA;
  }, h = function(B) {
    var p = Xw(), v = B.annotations.genes, o = p.createClustersFromGenes(v);
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
        U.annotations.genes.filter(function(H) {
          return H.displayed;
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
}, f4 = function(A) {
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
  }, t = xe.merge({}, e, A), n = function() {
    return sa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
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
        var p = h.slice(B, C), v = p.reduce(function(U, H) {
          return U + H.id.toString();
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
}, h4 = function(A) {
  var e = {
    onNetworkBtnClick: ue.noop,
    onFitBtnClick: ue.noop,
    onTagBtnClick: ue.noop,
    onLabelBtnClick: ue.noop,
    onQtlBtnClick: ue.noop,
    onResetBtnClick: ue.noop,
    onSetNumberPerRowClick: ue.noop,
    onExportBtnClick: ue.noop,
    onExportAllBtnClick: ue.noop,
    onExpandBtnClick: ue.noop,
    maxSnpPValueProperty: ue.noop,
    nGenesToDisplayProperty: ue.noop,
    annotationLabelSizeProperty: ue.noop,
    initialMaxGenes: 200,
    initialNPerRow: 10
  }, t = xe.merge({}, e, A), n, i = function() {
    ue(this).hasClass("disabled") || t.onNetworkBtnClick();
  }, s = function() {
    ue(this).hasClass("disabled") || t.onTagBtnClick();
  }, l = function() {
    ue(this).hasClass("disabled") || t.onFitBtnClick();
  }, f = function() {
    if (ue(this).hasClass("disabled"))
      return;
    const p = new Event("change"), v = document.getElementById("select-label-btn");
    v.value = "auto", v.dispatchEvent(p);
    const o = document.getElementById("select-ngenes-dropdown");
    o.value = "50", o.dispatchEvent(p), t.onResetBtnClick();
  }, c = function() {
    t.onExpandBtnClick();
  }, h = function(p, v, o, C, F) {
    var U = "select-" + v, H = p.selectAll("select").data([null]);
    H.enter().append("select").attr("id", U).attr("name", U).attr("class", "menu-dropdown");
    const D = document.getElementById(U);
    D && (D.innerHTML = "", o.forEach(function(b) {
      var M = document.createElement("option");
      M.value = b[1], M.textContent = b[0], b[1] === F && (M.selected = !0), D.appendChild(M);
    }), D.addEventListener("change", function() {
      var b = D.options[D.selectedIndex], M = b.value;
      C(M);
    }));
  }, w = function() {
    var p = XA(n).selectAll(".genemap-menu").data([null]);
    p.enter().append("div").classed("genemap-menu", !0);
    var v = p.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), o = v.selectAll("span").data(function(wA, QA) {
      return wA;
    });
    o.enter().append("span"), v.selectAll("span").attr("class", function(wA) {
      return wA;
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
    ), t.nGenesToDisplayProperty.addListener(function(wA) {
      ue("#select-ngenes-dropdown").selectpicker("val", [
        wA + " genes",
        wA
      ]);
    }), p.select(".export-btn").attr("title", "Export to PNG").on("click", t.onExportBtnClick), p.select(".expand-btn").attr("title", "Toggle full screen").on("click", c);
    var U = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    p.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(U, "_blank");
    });
    var H = XA(n).selectAll(".genemap-advanced-menu").data([null]), D = H.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    D.enter().append("div").attr("class", function(wA) {
      return wA;
    });
    var b = H.select(".qtl-btn");
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
    var M = H.select(".max-snp-pvalue").selectAll("form").data([""]).enter(), R = M.append("form").classed("bootstrap", !0).attr("id", "snp-pvalue-form").attr("class", "bootstrap form-inline");
    R.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), R.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), R.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), ue("#snp-pvalue-form").submit(function(wA) {
      t.maxSnpPValueProperty(ue("#max-snp-pvalue-input").val()), wA.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(wA) {
      ue("#max-snp-pvalue-input").val(wA);
    });
    var J = H.select(".nperrow-spinner"), hA = J.selectAll("input").data(["nPerRowSpinner"]).enter();
    hA.append("span").append("label").classed("bootstrap", !0).attr("for", (wA) => wA).html("Num per row:&nbsp;"), hA.append("span").append("input").attr("id", (wA) => wA).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (wA) => wA), XA(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), ue("#nPerRowSpinner").on("change", function(wA) {
      t.onSetNumberPerRowClick(ue("#nPerRowSpinner").val());
    }), H.select(".export-all-btn").attr("title", "export all to PNG").on("click", t.onExportAllBtnClick), H.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(wA) {
      return wA;
    }), H.select(".labelsize-label").classed("bootstrap", !0), H.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var cA = H.select(".labelsize-dropdown");
    cA.text(""), h(
      cA,
      "labelsize-dropdown",
      [
        ["10", 10],
        ["15", 15],
        ["20", 20],
        ["25", 25]
      ],
      t.annotationLabelSizeProperty,
      t.annotationLabelSizeProperty()
    ), t.annotationLabelSizeProperty.addListener(function(wA) {
      ue("#select-labelsize-dropdown").selectpicker("val", [
        wA,
        wA
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
class d4 {
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
function p4(A, e, t, n, i, s) {
  return t = t || "average", new d4(
    e,
    t,
    n
  ).cluster(A, i, s);
}
const g4 = function() {
  var A = {};
  return A.positionAnnotations = function(e, t, n, i, s, l) {
    for (var f = i, c = l, h = s, w = function(M, R) {
      return f(M) < c(R) && f(R) < c(M);
    }, B = e.sort(function(M, R) {
      return h(M) - h(R);
    }), p = [], v = 0; v < B.length; v++) {
      for (var o = e[v], C = [], F = 0; F < p.length; F++) {
        var U = B[p[F]];
        w(o, U) || C.push(p[F]);
      }
      var H = xe.difference(p, C), D = H.map(function(M) {
        return t(B[M]);
      }), b = 0;
      for (b = 1; b < D.length + 1 && D.indexOf(b) !== -1; b++)
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
}, B4 = function(A) {
  var e = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = xe.merge({}, e, A), n = g4(), i = function() {
    return sa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(o) {
    return o.map(function(C) {
      var F = p(C), U = F.reduce(function(R, J) {
        return Math.min(R, J.start);
      }, 1 / 0), H = F.reduce(function(R, J) {
        return Math.max(R, J.end);
      }, 0), D = F.reduce(function(R, J) {
        return R + (R ? "|" : "") + J.start + "-" + J.end;
      }, ""), b = (U + H) / 2;
      let M;
      return F.length == 1 ? (M = F[0], M.type = "qtl", M.index = C.index, M.parentIndex = C.parentIndex) : M = {
        cluster: C,
        index: C.index,
        parentIndex: C.parentIndex,
        qtlList: F,
        color: F[0].color,
        count: F.length,
        start: U,
        end: H,
        midpoint: b,
        chromosome: F[0].chromosome,
        type: "qtllist",
        id: D
      }, M;
    });
  }, l = function(o) {
    var C = [];
    if (t.showAllQTLs) {
      o.layout.qtlDisplayClusters = o.layout.qtlClusters.slice();
      for (var F = o.layout.qtlDisplayClusters, U = Math.ceil(Math.floor(t.scale - 0.1) / 2); U--; )
        F = B(F);
      for (var H = F.length; ; ) {
        C = s(F), C = n.sortQTLAnnotations(C);
        var D = C.reduce(function(b, M) {
          return Math.max(b, M.position);
        }, 0);
        if (D < 2) {
          if (F = B(F), H == F.length)
            break;
          H = F.length;
        } else
          break;
      }
    } else t.showSelectedQTLs && (o.layout.qtlDisplayClusters = o.annotations.qtls.filter(
      function(b) {
        return b.selected;
      }
    ), F = o.layout.qtlDisplayClusters, C = F.map(function(b) {
      let M = b;
      return M.type = "qtl", M;
    }));
    return C;
  }, f = function(o) {
    var C = xe.groupBy(o, "position");
    return xe.forOwn(C, function(F) {
      var U = 14 / t.scale, H = i();
      F = n.sortQTLLabels(F, H, U), F.forEach(function(D) {
        D.labelPosition > 1 ? D.displayLabel = !1 : (D.displayLabel = !0, D.labelPosition = D.position + 0.4);
      });
    }), o;
  }, c = function(o) {
    var C = l(o);
    C.forEach(function(J) {
      J.displayLabel = !1;
    });
    var F = C.filter(function(J) {
      return J.type == "qtl";
    });
    if (t.showAutoQTLLabels) {
      C = n.sortQTLAnnotations(C);
      var U = C.reduce(function(J, hA) {
        return Math.max(J, hA.position);
      }, 0);
      F.forEach(function(J) {
        J.label.length > 15 ? J.screenLabel = J.label.substring(0, 12) + "..." : J.screenLabel = J.label;
      });
      var H = 14 / t.scale, D = H > 0.6 * t.layout.chromosomeWidth, b = U > 3;
      !b && !D ? (f(F), F.forEach(function(J) {
        J.fontSize = H;
      })) : F.forEach(function(J) {
        J.displayLabel = !1;
      });
    }
    if (t.showSelectedQTLLabels && !t.showAutoQTLLabels) {
      var M = C.filter(function(J) {
        return J.selected;
      });
      H = 14 / t.scale;
      var R = 0.3 * t.layout.chromosomeWidth;
      M.forEach(function(J) {
        J.displayLabel = !0, J.screenLabel = J.label, J.fontSize = Math.min(H, 2 * R);
      }), M = n.sortQTLAnnotationsWithLabels(
        M,
        i(),
        t.annotationLabelSize
      ), M.forEach(function(J) {
        J.position = J.comboPosition, J.labelPosition = J.comboPosition + 0.4;
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
    var C = p4(
      o.annotations.qtls,
      function(U, H) {
        if (U.end == H.end && U.start == H.start)
          return 0;
        var D = Math.min(U.end, H.end) - Math.max(U.start, H.start), b = U.end - U.start, M = H.end - H.start, R = D, J = Math.abs(b - M);
        return Math.max(0.1, J - R);
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
        var U = F.left, H = F.right;
        C.push(U), C.push(H);
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
var sd = function(A, e) {
  return sd = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, sd(A, e);
};
function Xn(A, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  sd(A, e);
  function t() {
    this.constructor = A;
  }
  A.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var ud = function() {
  return ud = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, ud.apply(this, arguments);
};
function kt(A, e, t, n) {
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
var $r = (
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
), Sc = function(A, e) {
  return $r.fromClientRect(A, e.getBoundingClientRect());
}, w4 = function(A) {
  var e = A.body, t = A.documentElement;
  if (!e || !t)
    throw new Error("Unable to get document size");
  var n = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth)), i = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
  return new $r(0, 0, n, i);
}, Lc = function(A) {
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
}, qw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", m4 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ll = 0; ll < qw.length; ll++)
  m4[qw.charCodeAt(ll)] = ll;
var zw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ts = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var cl = 0; cl < zw.length; cl++)
  ts[zw.charCodeAt(cl)] = cl;
var v4 = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    s = ts[A.charCodeAt(n)], l = ts[A.charCodeAt(n + 1)], f = ts[A.charCodeAt(n + 2)], c = ts[A.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return h;
}, y4 = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, C4 = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, Aa = 5, Rp = 11, dh = 2, Q4 = Rp - Aa, S0 = 65536 >> Aa, F4 = 1 << Aa, ph = F4 - 1, U4 = 1024 >> Aa, E4 = S0 + U4, b4 = E4, _4 = 32, x4 = b4 + _4, I4 = 65536 >> Rp, H4 = 1 << Q4, S4 = H4 - 1, Jw = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, L4 = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, T4 = function(A, e) {
  var t = v4(A), n = Array.isArray(t) ? C4(t) : new Uint32Array(t), i = Array.isArray(t) ? y4(t) : new Uint16Array(t), s = 24, l = Jw(i, s / 2, n[4] / 2), f = n[5] === 2 ? Jw(i, (s + n[4]) / 2) : L4(n, Math.ceil((s + n[4]) / 4));
  return new D4(n[0], n[1], n[2], n[3], l, f);
}, D4 = (
  /** @class */
  function() {
    function A(e, t, n, i, s, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> Aa], t = (t << dh) + (e & ph), this.data[t];
        if (e <= 65535)
          return t = this.index[S0 + (e - 55296 >> Aa)], t = (t << dh) + (e & ph), this.data[t];
        if (e < this.highStart)
          return t = x4 - I4 + (e >> Rp), t = this.index[t], t += e >> Aa & S4, t = this.index[t], t = (t << dh) + (e & ph), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), jw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", O4 = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var fl = 0; fl < jw.length; fl++)
  O4[jw.charCodeAt(fl)] = fl;
var N4 = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", Yw = 50, M4 = 1, L0 = 2, T0 = 3, P4 = 4, R4 = 5, Zw = 7, D0 = 8, Am = 9, gi = 10, ld = 11, em = 12, cd = 13, K4 = 14, ns = 15, fd = 16, hl = 17, qo = 18, k4 = 19, tm = 20, hd = 21, zo = 22, gh = 23, Da = 24, an = 25, rs = 26, is = 27, Oa = 28, $4 = 29, zi = 30, G4 = 31, dl = 32, pl = 33, dd = 34, pd = 35, gd = 36, Is = 37, Bd = 38, $l = 39, Gl = 40, Bh = 41, O0 = 42, V4 = 43, W4 = [9001, 65288], N0 = "!", Ue = "×", gl = "÷", wd = T4(N4), Tr = [zi, gd], md = [M4, L0, T0, R4], M0 = [gi, D0], nm = [is, rs], X4 = md.concat(M0), rm = [Bd, $l, Gl, dd, pd], q4 = [ns, cd], z4 = function(A, e) {
  e === void 0 && (e = "strict");
  var t = [], n = [], i = [];
  return A.forEach(function(s, l) {
    var f = wd.get(s);
    if (f > Yw ? (i.push(!0), f -= Yw) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(s) !== -1)
      return n.push(l), t.push(fd);
    if (f === P4 || f === ld) {
      if (l === 0)
        return n.push(l), t.push(zi);
      var c = t[l - 1];
      return X4.indexOf(c) === -1 ? (n.push(n[l - 1]), t.push(c)) : (n.push(l), t.push(zi));
    }
    if (n.push(l), f === G4)
      return t.push(e === "strict" ? hd : Is);
    if (f === O0 || f === $4)
      return t.push(zi);
    if (f === V4)
      return s >= 131072 && s <= 196605 || s >= 196608 && s <= 262141 ? t.push(Is) : t.push(zi);
    t.push(f);
  }), [n, t, i];
}, wh = function(A, e, t, n) {
  var i = n[t];
  if (Array.isArray(A) ? A.indexOf(i) !== -1 : A === i)
    for (var s = t; s <= n.length; ) {
      s++;
      var l = n[s];
      if (l === e)
        return !0;
      if (l !== gi)
        break;
    }
  if (i === gi)
    for (var s = t; s > 0; ) {
      s--;
      var f = n[s];
      if (Array.isArray(A) ? A.indexOf(f) !== -1 : A === f)
        for (var c = t; c <= n.length; ) {
          c++;
          var l = n[c];
          if (l === e)
            return !0;
          if (l !== gi)
            break;
        }
      if (f !== gi)
        break;
    }
  return !1;
}, im = function(A, e) {
  for (var t = A; t >= 0; ) {
    var n = e[t];
    if (n === gi)
      t--;
    else
      return n;
  }
  return 0;
}, J4 = function(A, e, t, n, i) {
  if (t[n] === 0)
    return Ue;
  var s = n - 1;
  if (Array.isArray(i) && i[s] === !0)
    return Ue;
  var l = s - 1, f = s + 1, c = e[s], h = l >= 0 ? e[l] : 0, w = e[f];
  if (c === L0 && w === T0)
    return Ue;
  if (md.indexOf(c) !== -1)
    return N0;
  if (md.indexOf(w) !== -1 || M0.indexOf(w) !== -1)
    return Ue;
  if (im(s, e) === D0)
    return gl;
  if (wd.get(A[s]) === ld || (c === dl || c === pl) && wd.get(A[f]) === ld || c === Zw || w === Zw || c === Am || [gi, cd, ns].indexOf(c) === -1 && w === Am || [hl, qo, k4, Da, Oa].indexOf(w) !== -1 || im(s, e) === zo || wh(gh, zo, s, e) || wh([hl, qo], hd, s, e) || wh(em, em, s, e))
    return Ue;
  if (c === gi)
    return gl;
  if (c === gh || w === gh)
    return Ue;
  if (w === fd || c === fd)
    return gl;
  if ([cd, ns, hd].indexOf(w) !== -1 || c === K4 || h === gd && q4.indexOf(c) !== -1 || c === Oa && w === gd || w === tm || Tr.indexOf(w) !== -1 && c === an || Tr.indexOf(c) !== -1 && w === an || c === is && [Is, dl, pl].indexOf(w) !== -1 || [Is, dl, pl].indexOf(c) !== -1 && w === rs || Tr.indexOf(c) !== -1 && nm.indexOf(w) !== -1 || nm.indexOf(c) !== -1 && Tr.indexOf(w) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [is, rs].indexOf(c) !== -1 && (w === an || [zo, ns].indexOf(w) !== -1 && e[f + 1] === an) || // ( OP | HY ) × NU
  [zo, ns].indexOf(c) !== -1 && w === an || // NU ×	(NU | SY | IS)
  c === an && [an, Oa, Da].indexOf(w) !== -1)
    return Ue;
  if ([an, Oa, Da, hl, qo].indexOf(w) !== -1)
    for (var B = s; B >= 0; ) {
      var p = e[B];
      if (p === an)
        return Ue;
      if ([Oa, Da].indexOf(p) !== -1)
        B--;
      else
        break;
    }
  if ([is, rs].indexOf(w) !== -1)
    for (var B = [hl, qo].indexOf(c) !== -1 ? l : s; B >= 0; ) {
      var p = e[B];
      if (p === an)
        return Ue;
      if ([Oa, Da].indexOf(p) !== -1)
        B--;
      else
        break;
    }
  if (Bd === c && [Bd, $l, dd, pd].indexOf(w) !== -1 || [$l, dd].indexOf(c) !== -1 && [$l, Gl].indexOf(w) !== -1 || [Gl, pd].indexOf(c) !== -1 && w === Gl || rm.indexOf(c) !== -1 && [tm, rs].indexOf(w) !== -1 || rm.indexOf(w) !== -1 && c === is || Tr.indexOf(c) !== -1 && Tr.indexOf(w) !== -1 || c === Da && Tr.indexOf(w) !== -1 || Tr.concat(an).indexOf(c) !== -1 && w === zo && W4.indexOf(A[f]) === -1 || Tr.concat(an).indexOf(w) !== -1 && c === qo)
    return Ue;
  if (c === Bh && w === Bh) {
    for (var v = t[s], o = 1; v > 0 && (v--, e[v] === Bh); )
      o++;
    if (o % 2 !== 0)
      return Ue;
  }
  return c === dl && w === pl ? Ue : gl;
}, j4 = function(A, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = z4(A, e.lineBreak), n = t[0], i = t[1], s = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(f) {
    return [an, zi, O0].indexOf(f) !== -1 ? Is : f;
  }));
  var l = e.wordBreak === "keep-all" ? s.map(function(f, c) {
    return f && A[c] >= 19968 && A[c] <= 40959;
  }) : void 0;
  return [n, i, l];
}, Y4 = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.codePoints = e, this.required = t === N0, this.start = n, this.end = i;
    }
    return A.prototype.slice = function() {
      return at.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, A;
  }()
), Z4 = function(A, e) {
  var t = Lc(A), n = j4(t, e), i = n[0], s = n[1], l = n[2], f = t.length, c = 0, h = 0;
  return {
    next: function() {
      if (h >= f)
        return { done: !0, value: null };
      for (var w = Ue; h < f && (w = J4(t, s, i, ++h, l)) === Ue; )
        ;
      if (w !== Ue || h === f) {
        var B = new Y4(t, w, c, h);
        return c = h, { value: B, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, AN = 1, eN = 2, Rs = 4, am = 8, lc = 10, om = 47, gs = 92, tN = 9, nN = 32, Bl = 34, Jo = 61, rN = 35, iN = 36, aN = 37, wl = 39, ml = 40, jo = 41, oN = 95, Jt = 45, sN = 33, uN = 60, lN = 62, cN = 64, fN = 91, hN = 93, dN = 61, pN = 123, vl = 63, gN = 125, sm = 124, BN = 126, wN = 128, um = 65533, mh = 42, ji = 43, mN = 44, vN = 58, yN = 59, Hs = 46, CN = 0, QN = 8, FN = 11, UN = 14, EN = 31, bN = 127, rr = -1, P0 = 48, R0 = 97, K0 = 101, _N = 102, xN = 117, IN = 122, k0 = 65, $0 = 69, G0 = 70, HN = 85, SN = 90, Dt = function(A) {
  return A >= P0 && A <= 57;
}, LN = function(A) {
  return A >= 55296 && A <= 57343;
}, Na = function(A) {
  return Dt(A) || A >= k0 && A <= G0 || A >= R0 && A <= _N;
}, TN = function(A) {
  return A >= R0 && A <= IN;
}, DN = function(A) {
  return A >= k0 && A <= SN;
}, ON = function(A) {
  return TN(A) || DN(A);
}, NN = function(A) {
  return A >= wN;
}, yl = function(A) {
  return A === lc || A === tN || A === nN;
}, cc = function(A) {
  return ON(A) || NN(A) || A === oN;
}, lm = function(A) {
  return cc(A) || Dt(A) || A === Jt;
}, MN = function(A) {
  return A >= CN && A <= QN || A === FN || A >= UN && A <= EN || A === bN;
}, hi = function(A, e) {
  return A !== gs ? !1 : e !== lc;
}, Cl = function(A, e, t) {
  return A === Jt ? cc(e) || hi(e, t) : cc(A) ? !0 : !!(A === gs && hi(A, e));
}, vh = function(A, e, t) {
  return A === ji || A === Jt ? Dt(e) ? !0 : e === Hs && Dt(t) : Dt(A === Hs ? e : A);
}, PN = function(A) {
  var e = 0, t = 1;
  (A[e] === ji || A[e] === Jt) && (A[e] === Jt && (t = -1), e++);
  for (var n = []; Dt(A[e]); )
    n.push(A[e++]);
  var i = n.length ? parseInt(at.apply(void 0, n), 10) : 0;
  A[e] === Hs && e++;
  for (var s = []; Dt(A[e]); )
    s.push(A[e++]);
  var l = s.length, f = l ? parseInt(at.apply(void 0, s), 10) : 0;
  (A[e] === $0 || A[e] === K0) && e++;
  var c = 1;
  (A[e] === ji || A[e] === Jt) && (A[e] === Jt && (c = -1), e++);
  for (var h = []; Dt(A[e]); )
    h.push(A[e++]);
  var w = h.length ? parseInt(at.apply(void 0, h), 10) : 0;
  return t * (i + f * Math.pow(10, -l)) * Math.pow(10, c * w);
}, RN = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, KN = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, kN = {
  type: 4
  /* COMMA_TOKEN */
}, $N = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, GN = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, VN = {
  type: 21
  /* COLUMN_TOKEN */
}, WN = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, XN = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, qN = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, zN = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, JN = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Ql = {
  type: 23
  /* BAD_URL_TOKEN */
}, jN = {
  type: 1
  /* BAD_STRING_TOKEN */
}, YN = {
  type: 25
  /* CDO_TOKEN */
}, ZN = {
  type: 24
  /* CDC_TOKEN */
}, AM = {
  type: 26
  /* COLON_TOKEN */
}, eM = {
  type: 27
  /* SEMICOLON_TOKEN */
}, tM = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, nM = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, rM = {
  type: 31
  /* WHITESPACE_TOKEN */
}, vd = {
  type: 32
  /* EOF_TOKEN */
}, V0 = (
  /** @class */
  function() {
    function A() {
      this._value = [];
    }
    return A.prototype.write = function(e) {
      this._value = this._value.concat(Lc(e));
    }, A.prototype.read = function() {
      for (var e = [], t = this.consumeToken(); t !== vd; )
        e.push(t), t = this.consumeToken();
      return e;
    }, A.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case Bl:
          return this.consumeStringToken(Bl);
        case rN:
          var t = this.peekCodePoint(0), n = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (lm(t) || hi(n, i)) {
            var s = Cl(t, n, i) ? eN : AN, l = this.consumeName();
            return { type: 5, value: l, flags: s };
          }
          break;
        case iN:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), $N;
          break;
        case wl:
          return this.consumeStringToken(wl);
        case ml:
          return RN;
        case jo:
          return KN;
        case mh:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), JN;
          break;
        case ji:
          if (vh(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case mN:
          return kN;
        case Jt:
          var f = e, c = this.peekCodePoint(0), h = this.peekCodePoint(1);
          if (vh(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (Cl(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (c === Jt && h === lN)
            return this.consumeCodePoint(), this.consumeCodePoint(), ZN;
          break;
        case Hs:
          if (vh(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case om:
          if (this.peekCodePoint(0) === mh)
            for (this.consumeCodePoint(); ; ) {
              var w = this.consumeCodePoint();
              if (w === mh && (w = this.consumeCodePoint(), w === om))
                return this.consumeToken();
              if (w === rr)
                return this.consumeToken();
            }
          break;
        case vN:
          return AM;
        case yN:
          return eM;
        case uN:
          if (this.peekCodePoint(0) === sN && this.peekCodePoint(1) === Jt && this.peekCodePoint(2) === Jt)
            return this.consumeCodePoint(), this.consumeCodePoint(), YN;
          break;
        case cN:
          var B = this.peekCodePoint(0), p = this.peekCodePoint(1), v = this.peekCodePoint(2);
          if (Cl(B, p, v)) {
            var l = this.consumeName();
            return { type: 7, value: l };
          }
          break;
        case fN:
          return tM;
        case gs:
          if (hi(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case hN:
          return nM;
        case dN:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), GN;
          break;
        case pN:
          return qN;
        case gN:
          return zN;
        case xN:
        case HN:
          var o = this.peekCodePoint(0), C = this.peekCodePoint(1);
          return o === ji && (Na(C) || C === vl) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case sm:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), WN;
          if (this.peekCodePoint(0) === sm)
            return this.consumeCodePoint(), VN;
          break;
        case BN:
          if (this.peekCodePoint(0) === Jo)
            return this.consumeCodePoint(), XN;
          break;
        case rr:
          return vd;
      }
      return yl(e) ? (this.consumeWhiteSpace(), rM) : Dt(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : cc(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: at(e) };
    }, A.prototype.consumeCodePoint = function() {
      var e = this._value.shift();
      return typeof e > "u" ? -1 : e;
    }, A.prototype.reconsumeCodePoint = function(e) {
      this._value.unshift(e);
    }, A.prototype.peekCodePoint = function(e) {
      return e >= this._value.length ? -1 : this._value[e];
    }, A.prototype.consumeUnicodeRangeToken = function() {
      for (var e = [], t = this.consumeCodePoint(); Na(t) && e.length < 6; )
        e.push(t), t = this.consumeCodePoint();
      for (var n = !1; t === vl && e.length < 6; )
        e.push(t), t = this.consumeCodePoint(), n = !0;
      if (n) {
        var i = parseInt(at.apply(void 0, e.map(function(c) {
          return c === vl ? P0 : c;
        })), 16), s = parseInt(at.apply(void 0, e.map(function(c) {
          return c === vl ? G0 : c;
        })), 16);
        return { type: 30, start: i, end: s };
      }
      var l = parseInt(at.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === Jt && Na(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var f = []; Na(t) && f.length < 6; )
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
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === rr)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === wl || t === Bl) {
        var n = this.consumeStringToken(this.consumeCodePoint());
        return n.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === rr || this.peekCodePoint(0) === jo) ? (this.consumeCodePoint(), { type: 22, value: n.value }) : (this.consumeBadUrlRemnants(), Ql);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === rr || i === jo)
          return { type: 22, value: at.apply(void 0, e) };
        if (yl(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === rr || this.peekCodePoint(0) === jo ? (this.consumeCodePoint(), { type: 22, value: at.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), Ql);
        if (i === Bl || i === wl || i === ml || MN(i))
          return this.consumeBadUrlRemnants(), Ql;
        if (i === gs)
          if (hi(i, this.peekCodePoint(0)))
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
        if (e === jo || e === rr)
          return;
        hi(e, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
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
        if (i === rr || i === void 0 || i === e)
          return t += this.consumeStringSlice(n), { type: 0, value: t };
        if (i === lc)
          return this._value.splice(0, n), jN;
        if (i === gs) {
          var s = this._value[n + 1];
          s !== rr && s !== void 0 && (s === lc ? (t += this.consumeStringSlice(n), n = -1, this._value.shift()) : hi(i, s) && (t += this.consumeStringSlice(n), t += at(this.consumeEscapedCodePoint()), n = -1));
        }
        n++;
      } while (!0);
    }, A.prototype.consumeNumber = function() {
      var e = [], t = Rs, n = this.peekCodePoint(0);
      for ((n === ji || n === Jt) && e.push(this.consumeCodePoint()); Dt(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Hs && Dt(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = am; Dt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var s = this.peekCodePoint(2);
      if ((n === $0 || n === K0) && ((i === ji || i === Jt) && Dt(s) || Dt(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = am; Dt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [PN(e), t];
    }, A.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], n = e[1], i = this.peekCodePoint(0), s = this.peekCodePoint(1), l = this.peekCodePoint(2);
      if (Cl(i, s, l)) {
        var f = this.consumeName();
        return { type: 15, number: t, flags: n, unit: f };
      }
      return i === aN ? (this.consumeCodePoint(), { type: 16, number: t, flags: n }) : { type: 17, number: t, flags: n };
    }, A.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if (Na(e)) {
        for (var t = at(e); Na(this.peekCodePoint(0)) && t.length < 6; )
          t += at(this.consumeCodePoint());
        yl(this.peekCodePoint(0)) && this.consumeCodePoint();
        var n = parseInt(t, 16);
        return n === 0 || LN(n) || n > 1114111 ? um : n;
      }
      return e === rr ? um : e;
    }, A.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (lm(t))
          e += at(t);
        else if (hi(t, this.peekCodePoint(0)))
          e += at(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, A;
  }()
), W0 = (
  /** @class */
  function() {
    function A(e) {
      this._tokens = e;
    }
    return A.create = function(e) {
      var t = new V0();
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
        if (n.type === 32 || aM(n, e))
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
      return typeof e > "u" ? vd : e;
    }, A.prototype.reconsumeToken = function(e) {
      this._tokens.unshift(e);
    }, A;
  }()
), Ks = function(A) {
  return A.type === 15;
}, lo = function(A) {
  return A.type === 17;
}, Ke = function(A) {
  return A.type === 20;
}, iM = function(A) {
  return A.type === 0;
}, yd = function(A, e) {
  return Ke(A) && A.value === e;
}, X0 = function(A) {
  return A.type !== 31;
}, ao = function(A) {
  return A.type !== 31 && A.type !== 4;
}, fr = function(A) {
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
}, aM = function(A, e) {
  return e === 11 && A.type === 12 || e === 28 && A.type === 29 ? !0 : e === 2 && A.type === 3;
}, yi = function(A) {
  return A.type === 17 || A.type === 15;
}, st = function(A) {
  return A.type === 16 || yi(A);
}, q0 = function(A) {
  return A.length > 1 ? [A[0], A[1]] : [A[0]];
}, Ft = {
  type: 17,
  number: 0,
  flags: Rs
}, Kp = {
  type: 16,
  number: 50,
  flags: Rs
}, Bi = {
  type: 16,
  number: 100,
  flags: Rs
}, as = function(A, e, t) {
  var n = A[0], i = A[1];
  return [We(n, e), We(typeof i < "u" ? i : n, t)];
}, We = function(A, e) {
  if (A.type === 16)
    return A.number / 100 * e;
  if (Ks(A))
    switch (A.unit) {
      case "rem":
      case "em":
        return 16 * A.number;
      case "px":
      default:
        return A.number;
    }
  return A.number;
}, z0 = "deg", J0 = "grad", j0 = "rad", Y0 = "turn", Tc = {
  name: "angle",
  parse: function(A, e) {
    if (e.type === 15)
      switch (e.unit) {
        case z0:
          return Math.PI * e.number / 180;
        case J0:
          return Math.PI / 200 * e.number;
        case j0:
          return e.number;
        case Y0:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, Z0 = function(A) {
  return A.type === 15 && (A.unit === z0 || A.unit === J0 || A.unit === j0 || A.unit === Y0);
}, Ay = function(A) {
  var e = A.filter(Ke).map(function(t) {
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
      return vn(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Ft, Bi];
    case "to right":
    case "left":
      return vn(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [Bi, Bi];
    case "to bottom":
    case "top":
      return vn(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [Bi, Ft];
    case "to left":
    case "right":
      return vn(270);
  }
  return 0;
}, vn = function(A) {
  return Math.PI * A / 180;
}, mi = {
  name: "color",
  parse: function(A, e) {
    if (e.type === 18) {
      var t = oM[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + e.name + '"');
      return t(A, e.values);
    }
    if (e.type === 5) {
      if (e.value.length === 3) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3);
        return wi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), 1);
      }
      if (e.value.length === 4) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3), l = e.value.substring(3, 4);
        return wi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), parseInt(l + l, 16) / 255);
      }
      if (e.value.length === 6) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6);
        return wi(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), 1);
      }
      if (e.value.length === 8) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6), l = e.value.substring(6, 8);
        return wi(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), parseInt(l, 16) / 255);
      }
    }
    if (e.type === 20) {
      var f = Pr[e.value.toUpperCase()];
      if (typeof f < "u")
        return f;
    }
    return Pr.TRANSPARENT;
  }
}, vi = function(A) {
  return (255 & A) === 0;
}, gt = function(A) {
  var e = 255 & A, t = 255 & A >> 8, n = 255 & A >> 16, i = 255 & A >> 24;
  return e < 255 ? "rgba(" + i + "," + n + "," + t + "," + e / 255 + ")" : "rgb(" + i + "," + n + "," + t + ")";
}, wi = function(A, e, t, n) {
  return (A << 24 | e << 16 | t << 8 | Math.round(n * 255) << 0) >>> 0;
}, cm = function(A, e) {
  if (A.type === 17)
    return A.number;
  if (A.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? A.number / 100 * t : Math.round(A.number / 100 * t);
  }
  return 0;
}, fm = function(A, e) {
  var t = e.filter(ao);
  if (t.length === 3) {
    var n = t.map(cm), i = n[0], s = n[1], l = n[2];
    return wi(i, s, l, 1);
  }
  if (t.length === 4) {
    var f = t.map(cm), i = f[0], s = f[1], l = f[2], c = f[3];
    return wi(i, s, l, c);
  }
  return 0;
};
function yh(A, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - A) * t * 6 + A : t < 1 / 2 ? e : t < 2 / 3 ? (e - A) * 6 * (2 / 3 - t) + A : A;
}
var hm = function(A, e) {
  var t = e.filter(ao), n = t[0], i = t[1], s = t[2], l = t[3], f = (n.type === 17 ? vn(n.number) : Tc.parse(A, n)) / (Math.PI * 2), c = st(i) ? i.number / 100 : 0, h = st(s) ? s.number / 100 : 0, w = typeof l < "u" && st(l) ? We(l, 1) : 1;
  if (c === 0)
    return wi(h * 255, h * 255, h * 255, 1);
  var B = h <= 0.5 ? h * (c + 1) : h + c - h * c, p = h * 2 - B, v = yh(p, B, f + 1 / 3), o = yh(p, B, f), C = yh(p, B, f - 1 / 3);
  return wi(v * 255, o * 255, C * 255, w);
}, oM = {
  hsl: hm,
  hsla: hm,
  rgb: fm,
  rgba: fm
}, Bs = function(A, e) {
  return mi.parse(A, W0.create(e).parseComponentValue());
}, Pr = {
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
}, sM = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (Ke(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, uM = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Dc = function(A, e) {
  var t = mi.parse(A, e[0]), n = e[1];
  return n && st(n) ? { color: t, stop: n } : { color: t, stop: null };
}, dm = function(A, e) {
  var t = A[0], n = A[A.length - 1];
  t.stop === null && (t.stop = Ft), n.stop === null && (n.stop = Bi);
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
}, lM = function(A, e, t) {
  var n = e / 2, i = t / 2, s = We(A[0], e) - n, l = i - We(A[1], t);
  return (Math.atan2(l, s) + Math.PI * 2) % (Math.PI * 2);
}, cM = function(A, e, t) {
  var n = typeof A == "number" ? A : lM(A, e, t), i = Math.abs(e * Math.sin(n)) + Math.abs(t * Math.cos(n)), s = e / 2, l = t / 2, f = i / 2, c = Math.sin(n - Math.PI / 2) * f, h = Math.cos(n - Math.PI / 2) * f;
  return [i, s - h, s + h, l - c, l + c];
}, Kn = function(A, e) {
  return Math.sqrt(A * A + e * e);
}, pm = function(A, e, t, n, i) {
  var s = [
    [0, 0],
    [0, e],
    [A, 0],
    [A, e]
  ];
  return s.reduce(function(l, f) {
    var c = f[0], h = f[1], w = Kn(t - c, n - h);
    return (i ? w < l.optimumDistance : w > l.optimumDistance) ? {
      optimumCorner: f,
      optimumDistance: w
    } : l;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, fM = function(A, e, t, n, i) {
  var s = 0, l = 0;
  switch (A.size) {
    case 0:
      A.shape === 0 ? s = l = Math.min(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.min(Math.abs(e), Math.abs(e - n)), l = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (A.shape === 0)
        s = l = Math.min(Kn(e, t), Kn(e, t - i), Kn(e - n, t), Kn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - n)), c = pm(n, i, e, t, !0), h = c[0], w = c[1];
        s = Kn(h - e, (w - t) / f), l = f * s;
      }
      break;
    case 1:
      A.shape === 0 ? s = l = Math.max(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.max(Math.abs(e), Math.abs(e - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (A.shape === 0)
        s = l = Math.max(Kn(e, t), Kn(e, t - i), Kn(e - n, t), Kn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - n)), B = pm(n, i, e, t, !1), h = B[0], w = B[1];
        s = Kn(h - e, (w - t) / f), l = f * s;
      }
      break;
  }
  return Array.isArray(A.size) && (s = We(A.size[0], n), l = A.size.length === 2 ? We(A.size[1], i) : s), [s, l];
}, hM = function(A, e) {
  var t = vn(180), n = [];
  return fr(e).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && l.value === "to") {
        t = Ay(i);
        return;
      } else if (Z0(l)) {
        t = Tc.parse(A, l);
        return;
      }
    }
    var f = Dc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Fl = function(A, e) {
  var t = vn(180), n = [];
  return fr(e).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && ["top", "left", "right", "bottom"].indexOf(l.value) !== -1) {
        t = Ay(i);
        return;
      } else if (Z0(l)) {
        t = (Tc.parse(A, l) + vn(270)) % vn(360);
        return;
      }
    }
    var f = Dc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, dM = function(A, e) {
  var t = vn(180), n = [], i = 1, s = 0, l = 3, f = [];
  return fr(e).forEach(function(c, h) {
    var w = c[0];
    if (h === 0) {
      if (Ke(w) && w.value === "linear") {
        i = 1;
        return;
      } else if (Ke(w) && w.value === "radial") {
        i = 2;
        return;
      }
    }
    if (w.type === 18) {
      if (w.name === "from") {
        var B = mi.parse(A, w.values[0]);
        n.push({ stop: Ft, color: B });
      } else if (w.name === "to") {
        var B = mi.parse(A, w.values[0]);
        n.push({ stop: Bi, color: B });
      } else if (w.name === "color-stop") {
        var p = w.values.filter(ao);
        if (p.length === 2) {
          var B = mi.parse(A, p[1]), v = p[0];
          lo(v) && n.push({
            stop: { type: 16, number: v.number * 100, flags: v.flags },
            color: B
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + vn(180)) % vn(360),
    stops: n,
    type: i
  } : { size: l, shape: s, stops: n, position: f, type: i };
}, ey = "closest-side", ty = "farthest-side", ny = "closest-corner", ry = "farthest-corner", iy = "circle", ay = "ellipse", oy = "cover", sy = "contain", pM = function(A, e) {
  var t = 0, n = 3, i = [], s = [];
  return fr(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0) {
      var h = !1;
      c = l.reduce(function(B, p) {
        if (h)
          if (Ke(p))
            switch (p.value) {
              case "center":
                return s.push(Kp), B;
              case "top":
              case "left":
                return s.push(Ft), B;
              case "right":
              case "bottom":
                return s.push(Bi), B;
            }
          else (st(p) || yi(p)) && s.push(p);
        else if (Ke(p))
          switch (p.value) {
            case iy:
              return t = 0, !1;
            case ay:
              return t = 1, !1;
            case "at":
              return h = !0, !1;
            case ey:
              return n = 0, !1;
            case oy:
            case ty:
              return n = 1, !1;
            case sy:
            case ny:
              return n = 2, !1;
            case ry:
              return n = 3, !1;
          }
        else if (yi(p) || st(p))
          return Array.isArray(n) || (n = []), n.push(p), !1;
        return B;
      }, c);
    }
    if (c) {
      var w = Dc(A, l);
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
  return fr(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0 ? c = l.reduce(function(w, B) {
      if (Ke(B))
        switch (B.value) {
          case "center":
            return s.push(Kp), !1;
          case "top":
          case "left":
            return s.push(Ft), !1;
          case "right":
          case "bottom":
            return s.push(Bi), !1;
        }
      else if (st(B) || yi(B))
        return s.push(B), !1;
      return w;
    }, c) : f === 1 && (c = l.reduce(function(w, B) {
      if (Ke(B))
        switch (B.value) {
          case iy:
            return t = 0, !1;
          case ay:
            return t = 1, !1;
          case sy:
          case ey:
            return n = 0, !1;
          case ty:
            return n = 1, !1;
          case ny:
            return n = 2, !1;
          case oy:
          case ry:
            return n = 3, !1;
        }
      else if (yi(B) || st(B))
        return Array.isArray(n) || (n = []), n.push(B), !1;
      return w;
    }, c)), c) {
      var h = Dc(A, l);
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
}, gM = function(A) {
  return A.type === 1;
}, BM = function(A) {
  return A.type === 2;
}, kp = {
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
      var n = uy[e.name];
      if (typeof n > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return n(A, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function wM(A) {
  return !(A.type === 20 && A.value === "none") && (A.type !== 18 || !!uy[A.name]);
}
var uy = {
  "linear-gradient": hM,
  "-moz-linear-gradient": Fl,
  "-ms-linear-gradient": Fl,
  "-o-linear-gradient": Fl,
  "-webkit-linear-gradient": Fl,
  "radial-gradient": pM,
  "-moz-radial-gradient": Ul,
  "-ms-radial-gradient": Ul,
  "-o-radial-gradient": Ul,
  "-webkit-radial-gradient": Ul,
  "-webkit-gradient": dM
}, mM = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(n) {
      return ao(n) && wM(n);
    }).map(function(n) {
      return kp.parse(A, n);
    });
  }
}, vM = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (Ke(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, yM = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return fr(e).map(function(t) {
      return t.filter(st);
    }).map(q0);
  }
}, CM = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return fr(e).map(function(t) {
      return t.filter(Ke).map(function(n) {
        return n.value;
      }).join(" ");
    }).map(QM);
  }
}, QM = function(A) {
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
var FM = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return fr(e).map(function(t) {
      return t.filter(UM);
    });
  }
}, UM = function(A) {
  return Ke(A) || st(A);
}, Oc = function(A) {
  return {
    name: "border-" + A + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, EM = Oc("top"), bM = Oc("right"), _M = Oc("bottom"), xM = Oc("left"), Nc = function(A) {
  return {
    name: "border-radius-" + A,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return q0(t.filter(st));
    }
  };
}, IM = Nc("top-left"), HM = Nc("top-right"), SM = Nc("bottom-right"), LM = Nc("bottom-left"), Mc = function(A) {
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
}, TM = Mc("top"), DM = Mc("right"), OM = Mc("bottom"), NM = Mc("left"), Pc = function(A) {
  return {
    name: "border-" + A + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return Ks(t) ? t.number : 0;
    }
  };
}, MM = Pc("top"), PM = Pc("right"), RM = Pc("bottom"), KM = Pc("left"), kM = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, $M = {
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
}, GM = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Ke).reduce(
      function(t, n) {
        return t | VM(n.value);
      },
      0
      /* NONE */
    );
  }
}, VM = function(A) {
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
}, WM = {
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
}, XM = {
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
var qM = {
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
}, zM = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, gm = function(A, e) {
  return Ke(A) && A.value === "normal" ? 1.2 * e : A.type === 17 ? e * A.number : st(A) ? We(A, e) : e;
}, JM = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return e.type === 20 && e.value === "none" ? null : kp.parse(A, e);
  }
}, jM = {
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
}, Cd = {
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
}, YM = Rc("top"), ZM = Rc("right"), AP = Rc("bottom"), eP = Rc("left"), tP = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Ke).map(function(t) {
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
}, nP = {
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
}, Kc = function(A) {
  return {
    name: "padding-" + A,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, rP = Kc("top"), iP = Kc("right"), aP = Kc("bottom"), oP = Kc("left"), sP = {
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
}, uP = {
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
}, lP = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && yd(e[0], "none") ? [] : fr(e).map(function(t) {
      for (var n = {
        color: Pr.TRANSPARENT,
        offsetX: Ft,
        offsetY: Ft,
        blur: Ft
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        yi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = mi.parse(A, l);
      }
      return n;
    });
  }
}, cP = {
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
}, fP = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = pP[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, hP = function(A) {
  var e = A.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, dP = function(A) {
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
}, pP = {
  matrix: hP,
  matrix3d: dP
}, Bm = {
  type: 16,
  number: 50,
  flags: Rs
}, gP = [Bm, Bm], BP = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    var t = e.filter(st);
    return t.length !== 2 ? gP : [t[0], t[1]];
  }
}, wP = {
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
}, ws;
(function(A) {
  A.NORMAL = "normal", A.BREAK_ALL = "break-all", A.KEEP_ALL = "keep-all";
})(ws || (ws = {}));
var mP = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "break-all":
        return ws.BREAK_ALL;
      case "keep-all":
        return ws.KEEP_ALL;
      case "normal":
      default:
        return ws.NORMAL;
    }
  }
}, vP = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20)
      return { auto: !0, order: 0 };
    if (lo(e))
      return { auto: !1, order: e.number };
    throw new Error("Invalid z-index number parsed");
  }
}, ly = {
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
}, yP = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return lo(e) ? e.number : 1;
  }
}, CP = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, QP = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Ke).map(function(t) {
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
}, FP = {
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
}, UP = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, EP = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    if (lo(e))
      return e.number;
    if (Ke(e))
      switch (e.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    return 400;
  }
}, bP = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.filter(Ke).map(function(t) {
      return t.value;
    });
  }
}, _P = {
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
}, xP = {
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
}, IP = {
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
    for (var n = [], i = e.filter(X0), s = 0; s < i.length; s++) {
      var l = i[s], f = i[s + 1];
      if (l.type === 20) {
        var c = f && lo(f) ? f.number : 1;
        n.push({ counter: l.value, increment: c });
      }
    }
    return n;
  }
}, HP = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    for (var t = [], n = e.filter(X0), i = 0; i < n.length; i++) {
      var s = n[i], l = n[i + 1];
      if (Ke(s) && s.value !== "none") {
        var f = l && lo(l) ? l.number : 0;
        t.push({ counter: s.value, reset: f });
      }
    }
    return t;
  }
}, SP = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Ks).map(function(t) {
      return ly.parse(A, t);
    });
  }
}, LP = {
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
    var n = [], i = e.filter(iM);
    if (i.length % 2 !== 0)
      return null;
    for (var s = 0; s < i.length; s += 2) {
      var l = i[s].value, f = i[s + 1].value;
      n.push({ open: l, close: f });
    }
    return n;
  }
}, wm = function(A, e, t) {
  if (!A)
    return "";
  var n = A[Math.min(e, A.length - 1)];
  return n ? t ? n.open : n.close : "";
}, TP = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && yd(e[0], "none") ? [] : fr(e).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: Ft,
        offsetY: Ft,
        blur: Ft,
        spread: Ft,
        inset: !1
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        yd(l, "inset") ? n.inset = !0 : yi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = mi.parse(A, l);
      }
      return n;
    });
  }
}, DP = {
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
    return e.filter(Ke).forEach(function(i) {
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
}, OP = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, NP = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return Ks(e) ? e.number : 0;
  }
}, MP = (
  /** @class */
  function() {
    function A(e, t) {
      var n, i;
      this.animationDuration = RA(e, SP, t.animationDuration), this.backgroundClip = RA(e, sM, t.backgroundClip), this.backgroundColor = RA(e, uM, t.backgroundColor), this.backgroundImage = RA(e, mM, t.backgroundImage), this.backgroundOrigin = RA(e, vM, t.backgroundOrigin), this.backgroundPosition = RA(e, yM, t.backgroundPosition), this.backgroundRepeat = RA(e, CM, t.backgroundRepeat), this.backgroundSize = RA(e, FM, t.backgroundSize), this.borderTopColor = RA(e, EM, t.borderTopColor), this.borderRightColor = RA(e, bM, t.borderRightColor), this.borderBottomColor = RA(e, _M, t.borderBottomColor), this.borderLeftColor = RA(e, xM, t.borderLeftColor), this.borderTopLeftRadius = RA(e, IM, t.borderTopLeftRadius), this.borderTopRightRadius = RA(e, HM, t.borderTopRightRadius), this.borderBottomRightRadius = RA(e, SM, t.borderBottomRightRadius), this.borderBottomLeftRadius = RA(e, LM, t.borderBottomLeftRadius), this.borderTopStyle = RA(e, TM, t.borderTopStyle), this.borderRightStyle = RA(e, DM, t.borderRightStyle), this.borderBottomStyle = RA(e, OM, t.borderBottomStyle), this.borderLeftStyle = RA(e, NM, t.borderLeftStyle), this.borderTopWidth = RA(e, MM, t.borderTopWidth), this.borderRightWidth = RA(e, PM, t.borderRightWidth), this.borderBottomWidth = RA(e, RM, t.borderBottomWidth), this.borderLeftWidth = RA(e, KM, t.borderLeftWidth), this.boxShadow = RA(e, TP, t.boxShadow), this.color = RA(e, kM, t.color), this.direction = RA(e, $M, t.direction), this.display = RA(e, GM, t.display), this.float = RA(e, WM, t.cssFloat), this.fontFamily = RA(e, FP, t.fontFamily), this.fontSize = RA(e, UP, t.fontSize), this.fontStyle = RA(e, _P, t.fontStyle), this.fontVariant = RA(e, bP, t.fontVariant), this.fontWeight = RA(e, EP, t.fontWeight), this.letterSpacing = RA(e, XM, t.letterSpacing), this.lineBreak = RA(e, qM, t.lineBreak), this.lineHeight = RA(e, zM, t.lineHeight), this.listStyleImage = RA(e, JM, t.listStyleImage), this.listStylePosition = RA(e, jM, t.listStylePosition), this.listStyleType = RA(e, Cd, t.listStyleType), this.marginTop = RA(e, YM, t.marginTop), this.marginRight = RA(e, ZM, t.marginRight), this.marginBottom = RA(e, AP, t.marginBottom), this.marginLeft = RA(e, eP, t.marginLeft), this.opacity = RA(e, yP, t.opacity);
      var s = RA(e, tP, t.overflow);
      this.overflowX = s[0], this.overflowY = s[s.length > 1 ? 1 : 0], this.overflowWrap = RA(e, nP, t.overflowWrap), this.paddingTop = RA(e, rP, t.paddingTop), this.paddingRight = RA(e, iP, t.paddingRight), this.paddingBottom = RA(e, aP, t.paddingBottom), this.paddingLeft = RA(e, oP, t.paddingLeft), this.paintOrder = RA(e, DP, t.paintOrder), this.position = RA(e, uP, t.position), this.textAlign = RA(e, sP, t.textAlign), this.textDecorationColor = RA(e, CP, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = RA(e, QP, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = RA(e, lP, t.textShadow), this.textTransform = RA(e, cP, t.textTransform), this.transform = RA(e, fP, t.transform), this.transformOrigin = RA(e, BP, t.transformOrigin), this.visibility = RA(e, wP, t.visibility), this.webkitTextStrokeColor = RA(e, OP, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = RA(e, NP, t.webkitTextStrokeWidth), this.wordBreak = RA(e, mP, t.wordBreak), this.zIndex = RA(e, vP, t.zIndex);
    }
    return A.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, A.prototype.isTransparent = function() {
      return vi(this.backgroundColor);
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
), PP = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.content = RA(e, xP, t.content), this.quotes = RA(e, LP, t.quotes);
    }
    return A;
  }()
), mm = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.counterIncrement = RA(e, IP, t.counterIncrement), this.counterReset = RA(e, HP, t.counterReset);
    }
    return A;
  }()
), RA = function(A, e, t) {
  var n = new V0(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  n.write(i);
  var s = new W0(n.read());
  switch (e.type) {
    case 2:
      var l = s.parseComponentValue();
      return e.parse(A, Ke(l) ? l.value : e.initialValue);
    case 0:
      return e.parse(A, s.parseComponentValue());
    case 1:
      return e.parse(A, s.parseComponentValues());
    case 4:
      return s.parseComponentValue();
    case 3:
      switch (e.format) {
        case "angle":
          return Tc.parse(A, s.parseComponentValue());
        case "color":
          return mi.parse(A, s.parseComponentValue());
        case "image":
          return kp.parse(A, s.parseComponentValue());
        case "length":
          var f = s.parseComponentValue();
          return yi(f) ? f : Ft;
        case "length-percentage":
          var c = s.parseComponentValue();
          return st(c) ? c : Ft;
        case "time":
          return ly.parse(A, s.parseComponentValue());
      }
      break;
  }
}, RP = "data-html2canvas-debug", KP = function(A) {
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
}, Qd = function(A, e) {
  var t = KP(A);
  return t === 1 || e === t;
}, hr = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, Qd(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new MP(e, window.getComputedStyle(t, null)), Ed(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = Sc(this.context, t), Qd(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return A;
  }()
), kP = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", vm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", os = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var El = 0; El < vm.length; El++)
  os[vm.charCodeAt(El)] = El;
var $P = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    s = os[A.charCodeAt(n)], l = os[A.charCodeAt(n + 1)], f = os[A.charCodeAt(n + 2)], c = os[A.charCodeAt(n + 3)], w[i++] = s << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return h;
}, GP = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, VP = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ea = 5, $p = 11, Ch = 2, WP = $p - ea, cy = 65536 >> ea, XP = 1 << ea, Qh = XP - 1, qP = 1024 >> ea, zP = cy + qP, JP = zP, jP = 32, YP = JP + jP, ZP = 65536 >> $p, AR = 1 << WP, eR = AR - 1, ym = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, tR = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, nR = function(A, e) {
  var t = $P(A), n = Array.isArray(t) ? VP(t) : new Uint32Array(t), i = Array.isArray(t) ? GP(t) : new Uint16Array(t), s = 24, l = ym(i, s / 2, n[4] / 2), f = n[5] === 2 ? ym(i, (s + n[4]) / 2) : tR(n, Math.ceil((s + n[4]) / 4));
  return new rR(n[0], n[1], n[2], n[3], l, f);
}, rR = (
  /** @class */
  function() {
    function A(e, t, n, i, s, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> ea], t = (t << Ch) + (e & Qh), this.data[t];
        if (e <= 65535)
          return t = this.index[cy + (e - 55296 >> ea)], t = (t << Ch) + (e & Qh), this.data[t];
        if (e < this.highStart)
          return t = YP - ZP + (e >> $p), t = this.index[t], t += e >> ea & eR, t = this.index[t], t = (t << Ch) + (e & Qh), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Cm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", iR = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var bl = 0; bl < Cm.length; bl++)
  iR[Cm.charCodeAt(bl)] = bl;
var aR = 1, Fh = 2, Uh = 3, Qm = 4, Fm = 5, oR = 7, Um = 8, Eh = 9, bh = 10, Em = 11, bm = 12, _m = 13, xm = 14, _h = 15, sR = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = A.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, uR = function() {
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
}, lR = nR(kP), Bn = "×", xh = "÷", cR = function(A) {
  return lR.get(A);
}, fR = function(A, e, t) {
  var n = t - 2, i = e[n], s = e[t - 1], l = e[t];
  if (s === Fh && l === Uh)
    return Bn;
  if (s === Fh || s === Uh || s === Qm || l === Fh || l === Uh || l === Qm)
    return xh;
  if (s === Um && [Um, Eh, Em, bm].indexOf(l) !== -1 || (s === Em || s === Eh) && (l === Eh || l === bh) || (s === bm || s === bh) && l === bh || l === _m || l === Fm || l === oR || s === aR)
    return Bn;
  if (s === _m && l === xm) {
    for (; i === Fm; )
      i = e[--n];
    if (i === xm)
      return Bn;
  }
  if (s === _h && l === _h) {
    for (var f = 0; i === _h; )
      f++, i = e[--n];
    if (f % 2 === 0)
      return Bn;
  }
  return xh;
}, hR = function(A) {
  var e = sR(A), t = e.length, n = 0, i = 0, s = e.map(cR);
  return {
    next: function() {
      if (n >= t)
        return { done: !0, value: null };
      for (var l = Bn; n < t && (l = fR(e, s, ++n)) === Bn; )
        ;
      if (l !== Bn || n === t) {
        var f = uR.apply(null, e.slice(i, n));
        return i = n, { value: f, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, dR = function(A) {
  for (var e = hR(A), t = [], n; !(n = e.next()).done; )
    n.value && t.push(n.value.slice());
  return t;
}, pR = function(A) {
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
}, gR = function(A) {
  var e = A.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", A.body.appendChild(e);
  var t = A.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = e.firstChild, i = Lc(n.data).map(function(c) {
    return at(c);
  }), s = 0, l = {}, f = i.every(function(c, h) {
    t.setStart(n, s), t.setEnd(n, s + c.length);
    var w = t.getBoundingClientRect();
    s += c.length;
    var B = w.x > l.x || w.y > l.y;
    return l = w, h === 0 ? !0 : B;
  });
  return A.body.removeChild(e), f;
}, BR = function() {
  return typeof new Image().crossOrigin < "u";
}, wR = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, mR = function(A) {
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
}, Im = function(A) {
  return A[0] === 0 && A[1] === 255 && A[2] === 0 && A[3] === 255;
}, vR = function(A) {
  var e = A.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var n = e.getContext("2d");
  if (!n)
    return Promise.reject(!1);
  n.fillStyle = "rgb(0, 255, 0)", n.fillRect(0, 0, t, t);
  var i = new Image(), s = e.toDataURL();
  i.src = s;
  var l = Fd(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), Hm(l).then(function(f) {
    n.drawImage(f, 0, 0);
    var c = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var h = A.createElement("div");
    return h.style.backgroundImage = "url(" + s + ")", h.style.height = t + "px", Im(c) ? Hm(Fd(t, t, 0, 0, h)) : Promise.reject(!1);
  }).then(function(f) {
    return n.drawImage(f, 0, 0), Im(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Fd = function(A, e, t, n, i) {
  var s = "http://www.w3.org/2000/svg", l = document.createElementNS(s, "svg"), f = document.createElementNS(s, "foreignObject");
  return l.setAttributeNS(null, "width", A.toString()), l.setAttributeNS(null, "height", e.toString()), f.setAttributeNS(null, "width", "100%"), f.setAttributeNS(null, "height", "100%"), f.setAttributeNS(null, "x", t.toString()), f.setAttributeNS(null, "y", n.toString()), f.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(f), f.appendChild(i), l;
}, Hm = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      return e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, Ct = {
  get SUPPORT_RANGE_BOUNDS() {
    var A = pR(document);
    return Object.defineProperty(Ct, "SUPPORT_RANGE_BOUNDS", { value: A }), A;
  },
  get SUPPORT_WORD_BREAKING() {
    var A = Ct.SUPPORT_RANGE_BOUNDS && gR(document);
    return Object.defineProperty(Ct, "SUPPORT_WORD_BREAKING", { value: A }), A;
  },
  get SUPPORT_SVG_DRAWING() {
    var A = mR(document);
    return Object.defineProperty(Ct, "SUPPORT_SVG_DRAWING", { value: A }), A;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var A = typeof Array.from == "function" && typeof window.fetch == "function" ? vR(document) : Promise.resolve(!1);
    return Object.defineProperty(Ct, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A }), A;
  },
  get SUPPORT_CORS_IMAGES() {
    var A = BR();
    return Object.defineProperty(Ct, "SUPPORT_CORS_IMAGES", { value: A }), A;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var A = wR();
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
}, ms = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.text = e, this.bounds = t;
    }
    return A;
  }()
), yR = function(A, e, t, n) {
  var i = FR(e, t), s = [], l = 0;
  return i.forEach(function(f) {
    if (t.textDecorationLine.length || f.trim().length > 0)
      if (Ct.SUPPORT_RANGE_BOUNDS) {
        var c = Sm(n, l, f.length).getClientRects();
        if (c.length > 1) {
          var h = Gp(f), w = 0;
          h.forEach(function(p) {
            s.push(new ms(p, $r.fromDOMRectList(A, Sm(n, w + l, p.length).getClientRects()))), w += p.length;
          });
        } else
          s.push(new ms(f, $r.fromDOMRectList(A, c)));
      } else {
        var B = n.splitText(f.length);
        s.push(new ms(f, CR(A, n))), n = B;
      }
    else Ct.SUPPORT_RANGE_BOUNDS || (n = n.splitText(f.length));
    l += f.length;
  }), s;
}, CR = function(A, e) {
  var t = e.ownerDocument;
  if (t) {
    var n = t.createElement("html2canvaswrapper");
    n.appendChild(e.cloneNode(!0));
    var i = e.parentNode;
    if (i) {
      i.replaceChild(n, e);
      var s = Sc(A, n);
      return n.firstChild && i.replaceChild(n.firstChild, n), s;
    }
  }
  return $r.EMPTY;
}, Sm = function(A, e, t) {
  var n = A.ownerDocument;
  if (!n)
    throw new Error("Node has no owner document");
  var i = n.createRange();
  return i.setStart(A, e), i.setEnd(A, e + t), i;
}, Gp = function(A) {
  if (Ct.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(A)).map(function(t) {
      return t.segment;
    });
  }
  return dR(A);
}, QR = function(A, e) {
  if (Ct.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(A)).map(function(n) {
      return n.segment;
    });
  }
  return ER(A, e);
}, FR = function(A, e) {
  return e.letterSpacing !== 0 ? Gp(A) : QR(A, e);
}, UR = [32, 160, 4961, 65792, 65793, 4153, 4241], ER = function(A, e) {
  for (var t = Z4(A, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), n = [], i, s = function() {
    if (i.value) {
      var l = i.value.slice(), f = Lc(l), c = "";
      f.forEach(function(h) {
        UR.indexOf(h) === -1 ? c += at(h) : (c.length && n.push(c), n.push(at(h)), c = "");
      }), c.length && n.push(c);
    }
  }; !(i = t.next()).done; )
    s();
  return n;
}, bR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.text = _R(t.data, n.textTransform), this.textBounds = yR(e, this.text, n, t);
    }
    return A;
  }()
), _R = function(A, e) {
  switch (e) {
    case 1:
      return A.toLowerCase();
    case 3:
      return A.replace(xR, IR);
    case 2:
      return A.toUpperCase();
    default:
      return A;
  }
}, xR = /(^|\s|:|-|\(|\))([a-z])/g, IR = function(A, e, t) {
  return A.length > 0 ? e + t.toUpperCase() : A;
}, fy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.src = n.currentSrc || n.src, i.intrinsicWidth = n.naturalWidth, i.intrinsicHeight = n.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(hr)
), hy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n, i.intrinsicWidth = n.width, i.intrinsicHeight = n.height, i;
    }
    return e;
  }(hr)
), dy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = new XMLSerializer(), l = Sc(t, n);
      return n.setAttribute("width", l.width + "px"), n.setAttribute("height", l.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(n)), i.intrinsicWidth = n.width.baseVal.value, i.intrinsicHeight = n.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(hr)
), py = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(hr)
), Ud = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.start = n.start, i.reversed = typeof n.reversed == "boolean" && n.reversed === !0, i;
    }
    return e;
  }(hr)
), HR = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], SR = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], LR = function(A) {
  return A.width > A.height ? new $r(A.left + (A.width - A.height) / 2, A.top, A.height, A.height) : A.width < A.height ? new $r(A.left, A.top + (A.height - A.width) / 2, A.width, A.width) : A;
}, TR = function(A) {
  var e = A.type === DR ? new Array(A.value.length + 1).join("•") : A.value;
  return e.length === 0 ? A.placeholder || "" : e;
}, hc = "checkbox", dc = "radio", DR = "password", Lm = 707406591, Vp = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      switch (i.type = n.type.toLowerCase(), i.checked = n.checked, i.value = TR(n), (i.type === hc || i.type === dc) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = LR(i.bounds)), i.type) {
        case hc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = HR;
          break;
        case dc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = SR;
          break;
      }
      return i;
    }
    return e;
  }(hr)
), gy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = n.options[n.selectedIndex || 0];
      return i.value = s && s.text || "", i;
    }
    return e;
  }(hr)
), By = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(hr)
), wy = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      i.src = n.src, i.width = parseInt(n.width, 10) || 0, i.height = parseInt(n.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (n.contentWindow && n.contentWindow.document && n.contentWindow.document.documentElement) {
          i.tree = vy(t, n.contentWindow.document.documentElement);
          var s = n.contentWindow.document.documentElement ? Bs(t, getComputedStyle(n.contentWindow.document.documentElement).backgroundColor) : Pr.TRANSPARENT, l = n.contentWindow.document.body ? Bs(t, getComputedStyle(n.contentWindow.document.body).backgroundColor) : Pr.TRANSPARENT;
          i.backgroundColor = vi(s) ? vi(l) ? i.styles.backgroundColor : l : s;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(hr)
), OR = ["OL", "UL", "MENU"], Vl = function(A, e, t, n) {
  for (var i = e.firstChild, s = void 0; i; i = s)
    if (s = i.nextSibling, yy(i) && i.data.trim().length > 0)
      t.textNodes.push(new bR(A, i, t.styles));
    else if (Wa(i))
      if (Uy(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(f) {
          return Vl(A, f, t, n);
        });
      else {
        var l = my(A, i);
        l.styles.isVisible() && (NR(i, l, n) ? l.flags |= 4 : MR(l.styles) && (l.flags |= 2), OR.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Vl(A, i.shadowRoot, l, n) : !pc(i) && !Cy(i) && !gc(i) && Vl(A, i, l, n));
      }
}, my = function(A, e) {
  return bd(e) ? new fy(A, e) : Qy(e) ? new hy(A, e) : Cy(e) ? new dy(A, e) : PR(e) ? new py(A, e) : RR(e) ? new Ud(A, e) : KR(e) ? new Vp(A, e) : gc(e) ? new gy(A, e) : pc(e) ? new By(A, e) : Fy(e) ? new wy(A, e) : new hr(A, e);
}, vy = function(A, e) {
  var t = my(A, e);
  return t.flags |= 4, Vl(A, e, t, t), t;
}, NR = function(A, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || Wp(A) && t.styles.isTransparent();
}, MR = function(A) {
  return A.isPositioned() || A.isFloating();
}, yy = function(A) {
  return A.nodeType === Node.TEXT_NODE;
}, Wa = function(A) {
  return A.nodeType === Node.ELEMENT_NODE;
}, Ed = function(A) {
  return Wa(A) && typeof A.style < "u" && !Wl(A);
}, Wl = function(A) {
  return typeof A.className == "object";
}, PR = function(A) {
  return A.tagName === "LI";
}, RR = function(A) {
  return A.tagName === "OL";
}, KR = function(A) {
  return A.tagName === "INPUT";
}, kR = function(A) {
  return A.tagName === "HTML";
}, Cy = function(A) {
  return A.tagName === "svg";
}, Wp = function(A) {
  return A.tagName === "BODY";
}, Qy = function(A) {
  return A.tagName === "CANVAS";
}, Tm = function(A) {
  return A.tagName === "VIDEO";
}, bd = function(A) {
  return A.tagName === "IMG";
}, Fy = function(A) {
  return A.tagName === "IFRAME";
}, Dm = function(A) {
  return A.tagName === "STYLE";
}, $R = function(A) {
  return A.tagName === "SCRIPT";
}, pc = function(A) {
  return A.tagName === "TEXTAREA";
}, gc = function(A) {
  return A.tagName === "SELECT";
}, Uy = function(A) {
  return A.tagName === "SLOT";
}, Om = function(A) {
  return A.tagName.indexOf("-") > 0;
}, GR = (
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
), Nm = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, Mm = {
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
}, VR = {
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
}, WR = {
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
}, Ma = function(A, e, t, n, i, s) {
  return A < e || A > t ? Ss(A, i, s.length > 0) : n.integers.reduce(function(l, f, c) {
    for (; A >= f; )
      A -= f, l += n.values[c];
    return l;
  }, "") + s;
}, Ey = function(A, e, t, n) {
  var i = "";
  do
    t || A--, i = n(A) + i, A /= e;
  while (A * e >= e);
  return i;
}, rt = function(A, e, t, n, i) {
  var s = t - e + 1;
  return (A < 0 ? "-" : "") + (Ey(Math.abs(A), s, n, function(l) {
    return at(Math.floor(l % s) + e);
  }) + i);
}, $i = function(A, e, t) {
  t === void 0 && (t = ". ");
  var n = e.length;
  return Ey(Math.abs(A), n, !1, function(i) {
    return e[Math.floor(i % n)];
  }) + t;
}, $a = 1, ci = 2, fi = 4, ss = 8, Dr = function(A, e, t, n, i, s) {
  if (A < -9999 || A > 9999)
    return Ss(A, 4, i.length > 0);
  var l = Math.abs(A), f = i;
  if (l === 0)
    return e[0] + f;
  for (var c = 0; l > 0 && c <= 4; c++) {
    var h = l % 10;
    h === 0 && ft(s, $a) && f !== "" ? f = e[h] + f : h > 1 || h === 1 && c === 0 || h === 1 && c === 1 && ft(s, ci) || h === 1 && c === 1 && ft(s, fi) && A > 100 || h === 1 && c > 1 && ft(s, ss) ? f = e[h] + (c > 0 ? t[c - 1] : "") + f : h === 1 && c > 0 && (f = t[c - 1] + f), l = Math.floor(l / 10);
  }
  return (A < 0 ? n : "") + f;
}, Pm = "十百千萬", Rm = "拾佰仟萬", Km = "マイナス", Ih = "마이너스", Ss = function(A, e, t) {
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
      return $i(A, "〇一二三四五六七八九", i);
    case 6:
      return Ma(A, 1, 3999, Nm, 3, n).toLowerCase();
    case 7:
      return Ma(A, 1, 3999, Nm, 3, n);
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
      return Ma(A, 1, 9999, Mm, 3, n);
    case 35:
      return Ma(A, 1, 9999, Mm, 3, n).toLowerCase();
    case 13:
      return rt(A, 2534, 2543, !0, n);
    case 14:
    case 30:
      return rt(A, 6112, 6121, !0, n);
    case 15:
      return $i(A, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return $i(A, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return Dr(A, "零一二三四五六七八九", Pm, "負", i, ci | fi | ss);
    case 47:
      return Dr(A, "零壹貳參肆伍陸柒捌玖", Rm, "負", i, $a | ci | fi | ss);
    case 42:
      return Dr(A, "零一二三四五六七八九", Pm, "负", i, ci | fi | ss);
    case 41:
      return Dr(A, "零壹贰叁肆伍陆柒捌玖", Rm, "负", i, $a | ci | fi | ss);
    case 26:
      return Dr(A, "〇一二三四五六七八九", "十百千万", Km, i, 0);
    case 25:
      return Dr(A, "零壱弐参四伍六七八九", "拾百千万", Km, i, $a | ci | fi);
    case 31:
      return Dr(A, "영일이삼사오육칠팔구", "십백천만", Ih, s, $a | ci | fi);
    case 33:
      return Dr(A, "零一二三四五六七八九", "十百千萬", Ih, s, 0);
    case 32:
      return Dr(A, "零壹貳參四五六七八九", "拾百千", Ih, s, $a | ci | fi);
    case 18:
      return rt(A, 2406, 2415, !0, n);
    case 20:
      return Ma(A, 1, 19999, WR, 3, n);
    case 21:
      return rt(A, 2790, 2799, !0, n);
    case 22:
      return rt(A, 2662, 2671, !0, n);
    case 22:
      return Ma(A, 1, 10999, VR, 3, n);
    case 23:
      return $i(A, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return $i(A, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return rt(A, 3302, 3311, !0, n);
    case 28:
      return $i(A, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return $i(A, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
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
}, by = "data-html2canvas-ignore", km = (
  /** @class */
  function() {
    function A(e, t, n) {
      if (this.context = e, this.options = n, this.scrolledElements = [], this.referenceElement = t, this.counters = new GR(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return A.prototype.toIFrame = function(e, t) {
      var n = this, i = XR(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var s = e.defaultView.pageXOffset, l = e.defaultView.pageYOffset, f = i.contentWindow, c = f.document, h = JR(i).then(function() {
        return kt(n, void 0, void 0, function() {
          var w, B;
          return Tt(this, function(p) {
            switch (p.label) {
              case 0:
                return this.scrolledElements.forEach(AK), f && (f.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (f.scrollY !== t.top || f.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(f.scrollX - t.left, f.scrollY - t.top, 0, 0))), w = this.options.onclone, B = this.clonedReferenceElement, typeof B > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : c.fonts && c.fonts.ready ? [4, c.fonts.ready] : [3, 2];
              case 1:
                p.sent(), p.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, zR(c)] : [3, 4];
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
      return c.open(), c.write(YR(document.doctype) + "<html></html>"), ZR(this.referenceElement.ownerDocument, s, l), c.replaceChild(c.adoptNode(this.documentElement), c.documentElement), c.close(), h;
    }, A.prototype.createElementClone = function(e) {
      if (Qd(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (Qy(e))
        return this.createCanvasClone(e);
      if (Tm(e))
        return this.createVideoClone(e);
      if (Dm(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return bd(t) && (bd(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Om(t) ? this.createCustomElementClone(t) : t;
    }, A.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return Hh(e.style, t), t;
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
      (!Wa(t) || !$R(t) && !t.hasAttribute(by) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !Wa(t) || !Dm(t)) && e.appendChild(this.cloneNode(t, n));
    }, A.prototype.cloneChildNodes = function(e, t, n) {
      for (var i = this, s = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; s; s = s.nextSibling)
        if (Wa(s) && Uy(s) && typeof s.assignedNodes == "function") {
          var l = s.assignedNodes();
          l.length && l.forEach(function(f) {
            return i.appendChildNode(t, f, n);
          });
        } else
          this.appendChildNode(t, s, n);
    }, A.prototype.cloneNode = function(e, t) {
      if (yy(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var n = e.ownerDocument.defaultView;
      if (n && Wa(e) && (Ed(e) || Wl(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var s = n.getComputedStyle(e), l = n.getComputedStyle(e, ":before"), f = n.getComputedStyle(e, ":after");
        this.referenceElement === e && Ed(i) && (this.clonedReferenceElement = i), Wp(i) && nK(i);
        var c = this.counters.parse(new mm(this.context, s)), h = this.resolvePseudoContent(e, i, l, vs.BEFORE);
        Om(e) && (t = !0), Tm(e) || this.cloneChildNodes(e, i, t), h && i.insertBefore(h, i.firstChild);
        var w = this.resolvePseudoContent(e, i, f, vs.AFTER);
        return w && i.appendChild(w), this.counters.pop(c), (s && (this.options.copyStyles || Wl(e)) && !Fy(e) || t) && Hh(s, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (pc(e) || gc(e)) && (pc(i) || gc(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, A.prototype.resolvePseudoContent = function(e, t, n, i) {
      var s = this;
      if (n) {
        var l = n.content, f = t.ownerDocument;
        if (!(!f || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new mm(this.context, n));
          var c = new PP(this.context, n), h = f.createElement("html2canvaspseudoelement");
          Hh(n, h), c.content.forEach(function(B) {
            if (B.type === 0)
              h.appendChild(f.createTextNode(B.value));
            else if (B.type === 22) {
              var p = f.createElement("img");
              p.src = B.value, p.style.opacity = "1", h.appendChild(p);
            } else if (B.type === 18) {
              if (B.name === "attr") {
                var v = B.values.filter(Ke);
                v.length && h.appendChild(f.createTextNode(e.getAttribute(v[0].value) || ""));
              } else if (B.name === "counter") {
                var o = B.values.filter(ao), C = o[0], F = o[1];
                if (C && Ke(C)) {
                  var U = s.counters.getCounterValue(C.value), H = F && Ke(F) ? Cd.parse(s.context, F.value) : 3;
                  h.appendChild(f.createTextNode(Ss(U, H, !1)));
                }
              } else if (B.name === "counters") {
                var D = B.values.filter(ao), C = D[0], b = D[1], F = D[2];
                if (C && Ke(C)) {
                  var M = s.counters.getCounterValues(C.value), R = F && Ke(F) ? Cd.parse(s.context, F.value) : 3, J = b && b.type === 0 ? b.value : "", hA = M.map(function(QA) {
                    return Ss(QA, R, !1);
                  }).join(J);
                  h.appendChild(f.createTextNode(hA));
                }
              }
            } else if (B.type === 20)
              switch (B.value) {
                case "open-quote":
                  h.appendChild(f.createTextNode(wm(c.quotes, s.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  h.appendChild(f.createTextNode(wm(c.quotes, --s.quoteDepth, !1)));
                  break;
                default:
                  h.appendChild(f.createTextNode(B.value));
              }
          }), h.className = _d + " " + xd;
          var w = i === vs.BEFORE ? " " + _d : " " + xd;
          return Wl(t) ? t.className.baseValue += w : t.className += w, h;
        }
      }
    }, A.destroy = function(e) {
      return e.parentNode ? (e.parentNode.removeChild(e), !0) : !1;
    }, A;
  }()
), vs;
(function(A) {
  A[A.BEFORE = 0] = "BEFORE", A[A.AFTER = 1] = "AFTER";
})(vs || (vs = {}));
var XR = function(A, e) {
  var t = A.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(by, "true"), A.body.appendChild(t), t;
}, qR = function(A) {
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
}, zR = function(A) {
  return Promise.all([].slice.call(A.images, 0).map(qR));
}, JR = function(A) {
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
}, jR = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], Hh = function(A, e) {
  for (var t = A.length - 1; t >= 0; t--) {
    var n = A.item(t);
    jR.indexOf(n) === -1 && e.style.setProperty(n, A.getPropertyValue(n));
  }
  return e;
}, YR = function(A) {
  var e = "";
  return A && (e += "<!DOCTYPE ", A.name && (e += A.name), A.internalSubset && (e += A.internalSubset), A.publicId && (e += '"' + A.publicId + '"'), A.systemId && (e += '"' + A.systemId + '"'), e += ">"), e;
}, ZR = function(A, e, t) {
  A && A.defaultView && (e !== A.defaultView.pageXOffset || t !== A.defaultView.pageYOffset) && A.defaultView.scrollTo(e, t);
}, AK = function(A) {
  var e = A[0], t = A[1], n = A[2];
  e.scrollLeft = t, e.scrollTop = n;
}, eK = ":before", tK = ":after", _d = "___html2canvas___pseudoelement_before", xd = "___html2canvas___pseudoelement_after", $m = `{
    content: "" !important;
    display: none !important;
}`, nK = function(A) {
  rK(A, "." + _d + eK + $m + `
         .` + xd + tK + $m);
}, rK = function(A, e) {
  var t = A.ownerDocument;
  if (t) {
    var n = t.createElement("style");
    n.textContent = e, A.appendChild(n);
  }
}, _y = (
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
), iK = (
  /** @class */
  function() {
    function A(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return A.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || (Lh(e) || uK(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, A.prototype.match = function(e) {
      return this._cache[e];
    }, A.prototype.loadImage = function(e) {
      return kt(this, void 0, void 0, function() {
        var t, n, i, s, l = this;
        return Tt(this, function(f) {
          switch (f.label) {
            case 0:
              return t = _y.isSameOrigin(e), n = !Sh(e) && this._options.useCORS === !0 && Ct.SUPPORT_CORS_IMAGES && !t, i = !Sh(e) && !t && !Lh(e) && typeof this._options.proxy == "string" && Ct.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !Sh(e) && !Lh(e) && !i && !n ? [
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
                }, w.onerror = h, (lK(s) || n) && (w.crossOrigin = "anonymous"), w.src = s, w.complete === !0 && setTimeout(function() {
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
), aK = /^data:image\/svg\+xml/i, oK = /^data:image\/.*;base64,/i, sK = /^data:image\/.*/i, uK = function(A) {
  return Ct.SUPPORT_SVG_DRAWING || !cK(A);
}, Sh = function(A) {
  return sK.test(A);
}, lK = function(A) {
  return oK.test(A);
}, Lh = function(A) {
  return A.substr(0, 4) === "blob";
}, cK = function(A) {
  return A.substr(-3).toLowerCase() === "svg" || aK.test(A);
}, NA = (
  /** @class */
  function() {
    function A(e, t) {
      this.type = 0, this.x = e, this.y = t;
    }
    return A.prototype.add = function(e, t) {
      return new A(this.x + e, this.y + t);
    }, A;
  }()
), Pa = function(A, e, t) {
  return new NA(A.x + (e.x - A.x) * t, A.y + (e.y - A.y) * t);
}, _l = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = n, this.end = i;
    }
    return A.prototype.subdivide = function(e, t) {
      var n = Pa(this.start, this.startControl, e), i = Pa(this.startControl, this.endControl, e), s = Pa(this.endControl, this.end, e), l = Pa(n, i, e), f = Pa(i, s, e), c = Pa(l, f, e);
      return t ? new A(this.start, n, l, c) : new A(c, f, s, this.end);
    }, A.prototype.add = function(e, t) {
      return new A(this.start.add(e, t), this.startControl.add(e, t), this.endControl.add(e, t), this.end.add(e, t));
    }, A.prototype.reverse = function() {
      return new A(this.end, this.endControl, this.startControl, this.start);
    }, A;
  }()
), mn = function(A) {
  return A.type === 1;
}, fK = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      var t = e.styles, n = e.bounds, i = as(t.borderTopLeftRadius, n.width, n.height), s = i[0], l = i[1], f = as(t.borderTopRightRadius, n.width, n.height), c = f[0], h = f[1], w = as(t.borderBottomRightRadius, n.width, n.height), B = w[0], p = w[1], v = as(t.borderBottomLeftRadius, n.width, n.height), o = v[0], C = v[1], F = [];
      F.push((s + c) / n.width), F.push((o + B) / n.width), F.push((l + C) / n.height), F.push((h + p) / n.height);
      var U = Math.max.apply(Math, F);
      U > 1 && (s /= U, l /= U, c /= U, h /= U, B /= U, p /= U, o /= U, C /= U);
      var H = n.width - c, D = n.height - p, b = n.width - B, M = n.height - C, R = t.borderTopWidth, J = t.borderRightWidth, hA = t.borderBottomWidth, cA = t.borderLeftWidth, wA = We(t.paddingTop, e.bounds.width), QA = We(t.paddingRight, e.bounds.width), OA = We(t.paddingBottom, e.bounds.width), bA = We(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = s > 0 || l > 0 ? Je(n.left + cA / 3, n.top + R / 3, s - cA / 3, l - R / 3, Ne.TOP_LEFT) : new NA(n.left + cA / 3, n.top + R / 3), this.topRightBorderDoubleOuterBox = s > 0 || l > 0 ? Je(n.left + H, n.top + R / 3, c - J / 3, h - R / 3, Ne.TOP_RIGHT) : new NA(n.left + n.width - J / 3, n.top + R / 3), this.bottomRightBorderDoubleOuterBox = B > 0 || p > 0 ? Je(n.left + b, n.top + D, B - J / 3, p - hA / 3, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J / 3, n.top + n.height - hA / 3), this.bottomLeftBorderDoubleOuterBox = o > 0 || C > 0 ? Je(n.left + cA / 3, n.top + M, o - cA / 3, C - hA / 3, Ne.BOTTOM_LEFT) : new NA(n.left + cA / 3, n.top + n.height - hA / 3), this.topLeftBorderDoubleInnerBox = s > 0 || l > 0 ? Je(n.left + cA * 2 / 3, n.top + R * 2 / 3, s - cA * 2 / 3, l - R * 2 / 3, Ne.TOP_LEFT) : new NA(n.left + cA * 2 / 3, n.top + R * 2 / 3), this.topRightBorderDoubleInnerBox = s > 0 || l > 0 ? Je(n.left + H, n.top + R * 2 / 3, c - J * 2 / 3, h - R * 2 / 3, Ne.TOP_RIGHT) : new NA(n.left + n.width - J * 2 / 3, n.top + R * 2 / 3), this.bottomRightBorderDoubleInnerBox = B > 0 || p > 0 ? Je(n.left + b, n.top + D, B - J * 2 / 3, p - hA * 2 / 3, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J * 2 / 3, n.top + n.height - hA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = o > 0 || C > 0 ? Je(n.left + cA * 2 / 3, n.top + M, o - cA * 2 / 3, C - hA * 2 / 3, Ne.BOTTOM_LEFT) : new NA(n.left + cA * 2 / 3, n.top + n.height - hA * 2 / 3), this.topLeftBorderStroke = s > 0 || l > 0 ? Je(n.left + cA / 2, n.top + R / 2, s - cA / 2, l - R / 2, Ne.TOP_LEFT) : new NA(n.left + cA / 2, n.top + R / 2), this.topRightBorderStroke = s > 0 || l > 0 ? Je(n.left + H, n.top + R / 2, c - J / 2, h - R / 2, Ne.TOP_RIGHT) : new NA(n.left + n.width - J / 2, n.top + R / 2), this.bottomRightBorderStroke = B > 0 || p > 0 ? Je(n.left + b, n.top + D, B - J / 2, p - hA / 2, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J / 2, n.top + n.height - hA / 2), this.bottomLeftBorderStroke = o > 0 || C > 0 ? Je(n.left + cA / 2, n.top + M, o - cA / 2, C - hA / 2, Ne.BOTTOM_LEFT) : new NA(n.left + cA / 2, n.top + n.height - hA / 2), this.topLeftBorderBox = s > 0 || l > 0 ? Je(n.left, n.top, s, l, Ne.TOP_LEFT) : new NA(n.left, n.top), this.topRightBorderBox = c > 0 || h > 0 ? Je(n.left + H, n.top, c, h, Ne.TOP_RIGHT) : new NA(n.left + n.width, n.top), this.bottomRightBorderBox = B > 0 || p > 0 ? Je(n.left + b, n.top + D, B, p, Ne.BOTTOM_RIGHT) : new NA(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = o > 0 || C > 0 ? Je(n.left, n.top + M, o, C, Ne.BOTTOM_LEFT) : new NA(n.left, n.top + n.height), this.topLeftPaddingBox = s > 0 || l > 0 ? Je(n.left + cA, n.top + R, Math.max(0, s - cA), Math.max(0, l - R), Ne.TOP_LEFT) : new NA(n.left + cA, n.top + R), this.topRightPaddingBox = c > 0 || h > 0 ? Je(n.left + Math.min(H, n.width - J), n.top + R, H > n.width + J ? 0 : Math.max(0, c - J), Math.max(0, h - R), Ne.TOP_RIGHT) : new NA(n.left + n.width - J, n.top + R), this.bottomRightPaddingBox = B > 0 || p > 0 ? Je(n.left + Math.min(b, n.width - cA), n.top + Math.min(D, n.height - hA), Math.max(0, B - J), Math.max(0, p - hA), Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - J, n.top + n.height - hA), this.bottomLeftPaddingBox = o > 0 || C > 0 ? Je(n.left + cA, n.top + Math.min(M, n.height - hA), Math.max(0, o - cA), Math.max(0, C - hA), Ne.BOTTOM_LEFT) : new NA(n.left + cA, n.top + n.height - hA), this.topLeftContentBox = s > 0 || l > 0 ? Je(n.left + cA + bA, n.top + R + wA, Math.max(0, s - (cA + bA)), Math.max(0, l - (R + wA)), Ne.TOP_LEFT) : new NA(n.left + cA + bA, n.top + R + wA), this.topRightContentBox = c > 0 || h > 0 ? Je(n.left + Math.min(H, n.width + cA + bA), n.top + R + wA, H > n.width + cA + bA ? 0 : c - cA + bA, h - (R + wA), Ne.TOP_RIGHT) : new NA(n.left + n.width - (J + QA), n.top + R + wA), this.bottomRightContentBox = B > 0 || p > 0 ? Je(n.left + Math.min(b, n.width - (cA + bA)), n.top + Math.min(D, n.height + R + wA), Math.max(0, B - (J + QA)), p - (hA + OA), Ne.BOTTOM_RIGHT) : new NA(n.left + n.width - (J + QA), n.top + n.height - (hA + OA)), this.bottomLeftContentBox = o > 0 || C > 0 ? Je(n.left + cA + bA, n.top + M, Math.max(0, o - (cA + bA)), C - (hA + OA), Ne.BOTTOM_LEFT) : new NA(n.left + cA + bA, n.top + n.height - (hA + OA));
    }
    return A;
  }()
), Ne;
(function(A) {
  A[A.TOP_LEFT = 0] = "TOP_LEFT", A[A.TOP_RIGHT = 1] = "TOP_RIGHT", A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(Ne || (Ne = {}));
var Je = function(A, e, t, n, i) {
  var s = 4 * ((Math.sqrt(2) - 1) / 3), l = t * s, f = n * s, c = A + t, h = e + n;
  switch (i) {
    case Ne.TOP_LEFT:
      return new _l(new NA(A, h), new NA(A, h - f), new NA(c - l, e), new NA(c, e));
    case Ne.TOP_RIGHT:
      return new _l(new NA(A, e), new NA(A + l, e), new NA(c, h - f), new NA(c, h));
    case Ne.BOTTOM_RIGHT:
      return new _l(new NA(c, e), new NA(c, e + f), new NA(A + l, h), new NA(A, h));
    case Ne.BOTTOM_LEFT:
    default:
      return new _l(new NA(c, h), new NA(c - l, h), new NA(A, e + f), new NA(A, e));
  }
}, Bc = function(A) {
  return [A.topLeftBorderBox, A.topRightBorderBox, A.bottomRightBorderBox, A.bottomLeftBorderBox];
}, hK = function(A) {
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
}, dK = (
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
), pK = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return A;
  }()
), gK = function(A) {
  return A.type === 0;
}, xy = function(A) {
  return A.type === 1;
}, BK = function(A) {
  return A.type === 2;
}, Gm = function(A, e) {
  return A.length === e.length ? A.some(function(t, n) {
    return t === e[n];
  }) : !1;
}, wK = function(A, e, t, n, i) {
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
}, Iy = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return A;
  }()
), Hy = (
  /** @class */
  function() {
    function A(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new fK(this.container), this.container.styles.opacity < 1 && this.effects.push(new pK(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var n = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, s = this.container.styles.transform;
        this.effects.push(new dK(n, i, s));
      }
      if (this.container.styles.overflowX !== 0) {
        var l = Bc(this.curves), f = wc(this.curves);
        Gm(l, f) ? this.effects.push(new xl(
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
          return !xy(c);
        });
        if (t || n.container.styles.position !== 0 || !n.parent) {
          if (i.unshift.apply(i, s), t = [
            2,
            3
            /* FIXED */
          ].indexOf(n.container.styles.position) === -1, n.container.styles.overflowX !== 0) {
            var l = Bc(n.curves), f = wc(n.curves);
            Gm(l, f) || i.unshift(new xl(
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
), Id = function(A, e, t, n) {
  A.container.elements.forEach(function(i) {
    var s = ft(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), l = ft(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), f = new Hy(i, A);
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
      var h = s || i.styles.isPositioned() ? t : e, w = new Iy(f);
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
      Id(f, w, s ? w : t, c);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(f) : e.nonInlineLevel.push(f), Id(f, e, t, c);
    ft(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && Sy(i, c);
  });
}, Sy = function(A, e) {
  for (var t = A instanceof Ud ? A.start : 1, n = A instanceof Ud ? A.reversed : !1, i = 0; i < e.length; i++) {
    var s = e[i];
    s.container instanceof py && typeof s.container.value == "number" && s.container.value !== 0 && (t = s.container.value), s.listValue = Ss(t, s.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, mK = function(A) {
  var e = new Hy(A, null), t = new Iy(e), n = [];
  return Id(e, t, t, n), Sy(e.container, n), t;
}, Vm = function(A, e) {
  switch (e) {
    case 0:
      return yn(A.topLeftBorderBox, A.topLeftPaddingBox, A.topRightBorderBox, A.topRightPaddingBox);
    case 1:
      return yn(A.topRightBorderBox, A.topRightPaddingBox, A.bottomRightBorderBox, A.bottomRightPaddingBox);
    case 2:
      return yn(A.bottomRightBorderBox, A.bottomRightPaddingBox, A.bottomLeftBorderBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return yn(A.bottomLeftBorderBox, A.bottomLeftPaddingBox, A.topLeftBorderBox, A.topLeftPaddingBox);
  }
}, vK = function(A, e) {
  switch (e) {
    case 0:
      return yn(A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox, A.topRightBorderBox, A.topRightBorderDoubleOuterBox);
    case 1:
      return yn(A.topRightBorderBox, A.topRightBorderDoubleOuterBox, A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox);
    case 2:
      return yn(A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox, A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return yn(A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox, A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox);
  }
}, yK = function(A, e) {
  switch (e) {
    case 0:
      return yn(A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox, A.topRightBorderDoubleInnerBox, A.topRightPaddingBox);
    case 1:
      return yn(A.topRightBorderDoubleInnerBox, A.topRightPaddingBox, A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox);
    case 2:
      return yn(A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox, A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return yn(A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox, A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox);
  }
}, CK = function(A, e) {
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
  return mn(A) ? t.push(A.subdivide(0.5, !1)) : t.push(A), mn(e) ? t.push(e.subdivide(0.5, !0)) : t.push(e), t;
}, yn = function(A, e, t, n) {
  var i = [];
  return mn(A) ? i.push(A.subdivide(0.5, !1)) : i.push(A), mn(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), mn(n) ? i.push(n.subdivide(0.5, !0).reverse()) : i.push(n), mn(e) ? i.push(e.subdivide(0.5, !1).reverse()) : i.push(e), i;
}, Ly = function(A) {
  var e = A.bounds, t = A.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, mc = function(A) {
  var e = A.styles, t = A.bounds, n = We(e.paddingLeft, t.width), i = We(e.paddingRight, t.width), s = We(e.paddingTop, t.width), l = We(e.paddingBottom, t.width);
  return t.add(n + e.borderLeftWidth, s + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + n + i), -(e.borderTopWidth + e.borderBottomWidth + s + l));
}, QK = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? mc(e) : Ly(e);
}, FK = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? mc(e) : Ly(e);
}, Th = function(A, e, t) {
  var n = QK(Ga(A.styles.backgroundOrigin, e), A), i = FK(Ga(A.styles.backgroundClip, e), A), s = UK(Ga(A.styles.backgroundSize, e), t, n), l = s[0], f = s[1], c = as(Ga(A.styles.backgroundPosition, e), n.width - l, n.height - f), h = EK(Ga(A.styles.backgroundRepeat, e), c, s, n, i), w = Math.round(n.left + c[0]), B = Math.round(n.top + c[1]);
  return [h, w, B, l, f];
}, Ra = function(A) {
  return Ke(A) && A.value === ja.AUTO;
}, Hl = function(A) {
  return typeof A == "number";
}, UK = function(A, e, t) {
  var n = e[0], i = e[1], s = e[2], l = A[0], f = A[1];
  if (!l)
    return [0, 0];
  if (st(l) && f && st(f))
    return [We(l, t.width), We(f, t.height)];
  var c = Hl(s);
  if (Ke(l) && (l.value === ja.CONTAIN || l.value === ja.COVER)) {
    if (Hl(s)) {
      var h = t.width / t.height;
      return h < s != (l.value === ja.COVER) ? [t.width, t.width / s] : [t.height * s, t.height];
    }
    return [t.width, t.height];
  }
  var w = Hl(n), B = Hl(i), p = w || B;
  if (Ra(l) && (!f || Ra(f))) {
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
    var U = 0, H = 0;
    return st(l) ? U = We(l, t.width) : st(f) && (H = We(f, t.height)), Ra(l) ? U = H * s : (!f || Ra(f)) && (H = U / s), [U, H];
  }
  var D = null, b = null;
  if (st(l) ? D = We(l, t.width) : f && st(f) && (b = We(f, t.height)), D !== null && (!f || Ra(f)) && (b = w && B ? D / n * i : t.height), b !== null && Ra(l) && (D = w && B ? b / i * n : t.width), D !== null && b !== null)
    return [D, b];
  throw new Error("Unable to calculate background-size for element");
}, Ga = function(A, e) {
  var t = A[e];
  return typeof t > "u" ? A[0] : t;
}, EK = function(A, e, t, n, i) {
  var s = e[0], l = e[1], f = t[0], c = t[1];
  switch (A) {
    case 2:
      return [
        new NA(Math.round(n.left), Math.round(n.top + l)),
        new NA(Math.round(n.left + n.width), Math.round(n.top + l)),
        new NA(Math.round(n.left + n.width), Math.round(c + n.top + l)),
        new NA(Math.round(n.left), Math.round(c + n.top + l))
      ];
    case 3:
      return [
        new NA(Math.round(n.left + s), Math.round(n.top)),
        new NA(Math.round(n.left + s + f), Math.round(n.top)),
        new NA(Math.round(n.left + s + f), Math.round(n.height + n.top)),
        new NA(Math.round(n.left + s), Math.round(n.height + n.top))
      ];
    case 1:
      return [
        new NA(Math.round(n.left + s), Math.round(n.top + l)),
        new NA(Math.round(n.left + s + f), Math.round(n.top + l)),
        new NA(Math.round(n.left + s + f), Math.round(n.top + l + c)),
        new NA(Math.round(n.left + s), Math.round(n.top + l + c))
      ];
    default:
      return [
        new NA(Math.round(i.left), Math.round(i.top)),
        new NA(Math.round(i.left + i.width), Math.round(i.top)),
        new NA(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new NA(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, bK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", Wm = "Hidden Text", _K = (
  /** @class */
  function() {
    function A(e) {
      this._data = {}, this._document = e;
    }
    return A.prototype.parseMetrics = function(e, t) {
      var n = this._document.createElement("div"), i = this._document.createElement("img"), s = this._document.createElement("span"), l = this._document.body;
      n.style.visibility = "hidden", n.style.fontFamily = e, n.style.fontSize = t, n.style.margin = "0", n.style.padding = "0", n.style.whiteSpace = "nowrap", l.appendChild(n), i.src = bK, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", s.style.fontFamily = e, s.style.fontSize = t, s.style.margin = "0", s.style.padding = "0", s.appendChild(this._document.createTextNode(Wm)), n.appendChild(s), n.appendChild(i);
      var f = i.offsetTop - s.offsetTop + 2;
      n.removeChild(s), n.appendChild(this._document.createTextNode(Wm)), n.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var c = i.offsetTop - n.offsetTop + 2;
      return l.removeChild(n), { baseline: f, middle: c };
    }, A.prototype.getMetrics = function(e, t) {
      var n = e + " " + t;
      return typeof this._data[n] > "u" && (this._data[n] = this.parseMetrics(e, t)), this._data[n];
    }, A;
  }()
), Ty = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.context = e, this.options = t;
    }
    return A;
  }()
), xK = 1e4, IK = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i._activeEffects = [], i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), n.canvas || (i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px"), i.fontMetrics = new _K(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + n.width + "x" + n.height + ") with scale " + n.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var n = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return n.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), BK(t) && (this.ctx.globalAlpha = t.opacity), gK(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), xy(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return kt(this, void 0, void 0, function() {
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
      return kt(this, void 0, void 0, function() {
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
        var l = Gp(t.text);
        l.reduce(function(f, c) {
          return s.ctx.fillText(c, f, t.bounds.top + i), f + s.ctx.measureText(c).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var n = t.fontVariant.filter(function(l) {
        return l === "normal" || l === "small-caps";
      }).join(""), i = DK(t.fontFamily).join(", "), s = Ks(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, n, t.fontWeight, s, i].join(" "),
        i,
        s
      ];
    }, e.prototype.renderTextNode = function(t, n) {
      return kt(this, void 0, void 0, function() {
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
      return kt(this, void 0, void 0, function() {
        var n, i, s, l, f, c, H, H, h, w, B, p, b, v, o, M, C, F, U, H, D, b, M;
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
              if (!(n instanceof fy)) return [3, 8];
              R.label = 5;
            case 5:
              return R.trys.push([5, 7, , 8]), [4, this.context.cache.match(n.src)];
            case 6:
              return H = R.sent(), this.renderReplacedElement(n, i, H), [3, 8];
            case 7:
              return R.sent(), this.context.logger.error("Error loading image " + n.src), [3, 8];
            case 8:
              if (n instanceof hy && this.renderReplacedElement(n, i, n.canvas), !(n instanceof dy)) return [3, 12];
              R.label = 9;
            case 9:
              return R.trys.push([9, 11, , 12]), [4, this.context.cache.match(n.svg)];
            case 10:
              return H = R.sent(), this.renderReplacedElement(n, i, H), [3, 12];
            case 11:
              return R.sent(), this.context.logger.error("Error loading svg " + n.svg.substring(0, 255)), [3, 12];
            case 12:
              return n instanceof wy && n.tree ? (h = new e(this.context, {
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
              if (n instanceof Vp && (B = Math.min(n.bounds.width, n.bounds.height), n.type === hc ? n.checked && (this.ctx.save(), this.path([
                new NA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79),
                new NA(n.bounds.left + B * 0.16, n.bounds.top + B * 0.5549),
                new NA(n.bounds.left + B * 0.27347, n.bounds.top + B * 0.44071),
                new NA(n.bounds.left + B * 0.39694, n.bounds.top + B * 0.5649),
                new NA(n.bounds.left + B * 0.72983, n.bounds.top + B * 0.23),
                new NA(n.bounds.left + B * 0.84, n.bounds.top + B * 0.34085),
                new NA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79)
              ]), this.ctx.fillStyle = gt(Lm), this.ctx.fill(), this.ctx.restore()) : n.type === dc && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + B / 2, n.bounds.top + B / 2, B / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = gt(Lm), this.ctx.fill(), this.ctx.restore())), HK(n) && n.value.length) {
                switch (p = this.createFontStyle(s), b = p[0], v = p[1], o = this.fontMetrics.getMetrics(b, v).baseline, this.ctx.font = b, this.ctx.fillStyle = gt(s.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = LK(n.styles.textAlign), M = mc(n), C = 0, n.styles.textAlign) {
                  case 1:
                    C += M.width / 2;
                    break;
                  case 2:
                    C += M.width;
                    break;
                }
                F = M.add(C, 0, 0, -M.height / 2 + 1), this.ctx.save(), this.path([
                  new NA(M.left, M.top),
                  new NA(M.left + M.width, M.top),
                  new NA(M.left + M.width, M.top + M.height),
                  new NA(M.left, M.top + M.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new ms(n.value, F), s.letterSpacing, o), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!ft(
                n.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (n.styles.listStyleImage === null) return [3, 19];
              if (U = n.styles.listStyleImage, U.type !== 0) return [3, 18];
              H = void 0, D = U.url, R.label = 15;
            case 15:
              return R.trys.push([15, 17, , 18]), [4, this.context.cache.match(D)];
            case 16:
              return H = R.sent(), this.ctx.drawImage(H, n.bounds.left - (H.width + 10), n.bounds.top), [3, 18];
            case 17:
              return R.sent(), this.context.logger.error("Error loading list-style-image " + D), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && n.styles.listStyleType !== -1 && (b = this.createFontStyle(s)[0], this.ctx.font = b, this.ctx.fillStyle = gt(s.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", M = new $r(n.bounds.left, n.bounds.top + We(n.styles.paddingTop, n.bounds.width), n.bounds.width, gm(s.lineHeight, s.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new ms(t.listValue, M), s.letterSpacing, gm(s.lineHeight, s.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), R.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderStackContent = function(t) {
      return kt(this, void 0, void 0, function() {
        var n, i, U, s, l, U, f, c, U, h, w, U, B, p, U, v, o, U, C, F, U;
        return Tt(this, function(H) {
          switch (H.label) {
            case 0:
              if (ft(
                t.element.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return [4, this.renderNodeBackgroundAndBorders(t.element)];
            case 1:
              H.sent(), n = 0, i = t.negativeZIndex, H.label = 2;
            case 2:
              return n < i.length ? (U = i[n], [4, this.renderStack(U)]) : [3, 5];
            case 3:
              H.sent(), H.label = 4;
            case 4:
              return n++, [3, 2];
            case 5:
              return [4, this.renderNodeContent(t.element)];
            case 6:
              H.sent(), s = 0, l = t.nonInlineLevel, H.label = 7;
            case 7:
              return s < l.length ? (U = l[s], [4, this.renderNode(U)]) : [3, 10];
            case 8:
              H.sent(), H.label = 9;
            case 9:
              return s++, [3, 7];
            case 10:
              f = 0, c = t.nonPositionedFloats, H.label = 11;
            case 11:
              return f < c.length ? (U = c[f], [4, this.renderStack(U)]) : [3, 14];
            case 12:
              H.sent(), H.label = 13;
            case 13:
              return f++, [3, 11];
            case 14:
              h = 0, w = t.nonPositionedInlineLevel, H.label = 15;
            case 15:
              return h < w.length ? (U = w[h], [4, this.renderStack(U)]) : [3, 18];
            case 16:
              H.sent(), H.label = 17;
            case 17:
              return h++, [3, 15];
            case 18:
              B = 0, p = t.inlineLevel, H.label = 19;
            case 19:
              return B < p.length ? (U = p[B], [4, this.renderNode(U)]) : [3, 22];
            case 20:
              H.sent(), H.label = 21;
            case 21:
              return B++, [3, 19];
            case 22:
              v = 0, o = t.zeroOrAutoZIndexOrTransformedOrOpacity, H.label = 23;
            case 23:
              return v < o.length ? (U = o[v], [4, this.renderStack(U)]) : [3, 26];
            case 24:
              H.sent(), H.label = 25;
            case 25:
              return v++, [3, 23];
            case 26:
              C = 0, F = t.positiveZIndex, H.label = 27;
            case 27:
              return C < F.length ? (U = F[C], [4, this.renderStack(U)]) : [3, 30];
            case 28:
              H.sent(), H.label = 29;
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
        var l = mn(i) ? i.start : i;
        s === 0 ? n.ctx.moveTo(l.x, l.y) : n.ctx.lineTo(l.x, l.y), mn(i) && n.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
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
      return kt(this, void 0, void 0, function() {
        var n, i, s, l, f, c;
        return Tt(this, function(h) {
          switch (h.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(w) {
                var B, p, v, wA, iA, gA, bA, q, hA, o, wA, iA, gA, bA, q, C, F, U, H, D, b, M, R, J, hA, cA, wA, QA, OA, bA, q, CA, iA, gA, IA, HA, uA, T, rA, j, S, K;
                return Tt(this, function(aA) {
                  switch (aA.label) {
                    case 0:
                      if (w.type !== 0) return [3, 5];
                      B = void 0, p = w.url, aA.label = 1;
                    case 1:
                      return aA.trys.push([1, 3, , 4]), [4, s.context.cache.match(p)];
                    case 2:
                      return B = aA.sent(), [3, 4];
                    case 3:
                      return aA.sent(), s.context.logger.error("Error loading background-image " + p), [3, 4];
                    case 4:
                      return B && (v = Th(t, n, [
                        B.width,
                        B.height,
                        B.width / B.height
                      ]), wA = v[0], iA = v[1], gA = v[2], bA = v[3], q = v[4], hA = s.ctx.createPattern(s.resizeImage(B, bA, q), "repeat"), s.renderRepeat(wA, hA, iA, gA)), [3, 6];
                    case 5:
                      gM(w) ? (o = Th(t, n, [null, null, null]), wA = o[0], iA = o[1], gA = o[2], bA = o[3], q = o[4], C = cM(w.angle, bA, q), F = C[0], U = C[1], H = C[2], D = C[3], b = C[4], M = document.createElement("canvas"), M.width = bA, M.height = q, R = M.getContext("2d"), J = R.createLinearGradient(U, D, H, b), dm(w.stops, F).forEach(function(EA) {
                        return J.addColorStop(EA.stop, gt(EA.color));
                      }), R.fillStyle = J, R.fillRect(0, 0, bA, q), bA > 0 && q > 0 && (hA = s.ctx.createPattern(M, "repeat"), s.renderRepeat(wA, hA, iA, gA))) : BM(w) && (cA = Th(t, n, [
                        null,
                        null,
                        null
                      ]), wA = cA[0], QA = cA[1], OA = cA[2], bA = cA[3], q = cA[4], CA = w.position.length === 0 ? [Kp] : w.position, iA = We(CA[0], bA), gA = We(CA[CA.length - 1], q), IA = fM(w, iA, gA, bA, q), HA = IA[0], uA = IA[1], HA > 0 && uA > 0 && (T = s.ctx.createRadialGradient(QA + iA, OA + gA, 0, QA + iA, OA + gA, HA), dm(w.stops, HA * 2).forEach(function(EA) {
                        return T.addColorStop(EA.stop, gt(EA.color));
                      }), s.path(wA), s.ctx.fillStyle = T, HA !== uA ? (rA = t.bounds.left + 0.5 * t.bounds.width, j = t.bounds.top + 0.5 * t.bounds.height, S = uA / HA, K = 1 / S, s.ctx.save(), s.ctx.translate(rA, j), s.ctx.transform(1, 0, 0, S, 0, 0), s.ctx.translate(-rA, -j), s.ctx.fillRect(QA, K * (OA - j) + j, bA, q * K), s.ctx.restore()) : s.ctx.fill())), aA.label = 6;
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
      return kt(this, void 0, void 0, function() {
        return Tt(this, function(s) {
          return this.path(Vm(i, n)), this.ctx.fillStyle = gt(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, n, i, s) {
      return kt(this, void 0, void 0, function() {
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
              return l = vK(s, i), this.path(l), this.ctx.fillStyle = gt(t), this.ctx.fill(), f = yK(s, i), this.path(f), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return kt(this, void 0, void 0, function() {
        var n, i, s, l, f, c, h, w, B = this;
        return Tt(this, function(p) {
          switch (p.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), n = t.container.styles, i = !vi(n.backgroundColor) || n.backgroundImage.length, s = [
                { style: n.borderTopStyle, color: n.borderTopColor, width: n.borderTopWidth },
                { style: n.borderRightStyle, color: n.borderRightColor, width: n.borderRightWidth },
                { style: n.borderBottomStyle, color: n.borderBottomColor, width: n.borderBottomWidth },
                { style: n.borderLeftStyle, color: n.borderLeftColor, width: n.borderLeftWidth }
              ], l = SK(Ga(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), vi(n.backgroundColor) || (this.ctx.fillStyle = gt(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              p.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(v) {
                B.ctx.save();
                var o = Bc(t.curves), C = v.inset ? 0 : xK, F = wK(o, -C + (v.inset ? 1 : -1) * v.spread.number, (v.inset ? 1 : -1) * v.spread.number, v.spread.number * (v.inset ? -2 : 2), v.spread.number * (v.inset ? -2 : 2));
                v.inset ? (B.path(o), B.ctx.clip(), B.mask(F)) : (B.mask(o), B.ctx.clip(), B.path(F)), B.ctx.shadowOffsetX = v.offsetX.number + C, B.ctx.shadowOffsetY = v.offsetY.number, B.ctx.shadowColor = gt(v.color), B.ctx.shadowBlur = v.blur.number, B.ctx.fillStyle = v.inset ? gt(v.color) : "rgba(0,0,0,1)", B.ctx.fill(), B.ctx.restore();
              }), p.label = 2;
            case 2:
              f = 0, c = 0, h = s, p.label = 3;
            case 3:
              return c < h.length ? (w = h[c], w.style !== 0 && !vi(w.color) && w.width > 0 ? w.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
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
      return kt(this, void 0, void 0, function() {
        var f, c, h, w, B, p, v, o, C, F, U, H, D, b, M, R, M, R;
        return Tt(this, function(J) {
          return this.ctx.save(), f = CK(s, i), c = Vm(s, i), l === 2 && (this.path(c), this.ctx.clip()), mn(c[0]) ? (h = c[0].start.x, w = c[0].start.y) : (h = c[0].x, w = c[0].y), mn(c[1]) ? (B = c[1].end.x, p = c[1].end.y) : (B = c[1].x, p = c[1].y), i === 0 || i === 2 ? v = Math.abs(h - B) : v = Math.abs(w - p), this.ctx.beginPath(), l === 3 ? this.formatPath(f) : this.formatPath(c.slice(0, 2)), o = n < 3 ? n * 3 : n * 2, C = n < 3 ? n * 2 : n, l === 3 && (o = n, C = n), F = !0, v <= o * 2 ? F = !1 : v <= o * 2 + C ? (U = v / (2 * o + C), o *= U, C *= U) : (H = Math.floor((v + C) / (o + C)), D = (v - H * o) / (H - 1), b = (v - (H + 1) * o) / H, C = b <= 0 || Math.abs(C - D) < Math.abs(C - b) ? D : b), F && (l === 3 ? this.ctx.setLineDash([0, o + C]) : this.ctx.setLineDash([o, C])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = gt(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (mn(c[0]) && (M = c[3], R = c[0], this.ctx.beginPath(), this.formatPath([new NA(M.end.x, M.end.y), new NA(R.start.x, R.start.y)]), this.ctx.stroke()), mn(c[1]) && (M = c[1], R = c[2], this.ctx.beginPath(), this.formatPath([new NA(M.end.x, M.end.y), new NA(R.start.x, R.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return kt(this, void 0, void 0, function() {
        var n;
        return Tt(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = gt(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = mK(t), [4, this.renderStack(n)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Ty)
), HK = function(A) {
  return A instanceof By || A instanceof gy ? !0 : A instanceof Vp && A.type !== dc && A.type !== hc;
}, SK = function(A, e) {
  switch (A) {
    case 0:
      return Bc(e);
    case 2:
      return hK(e);
    case 1:
    default:
      return wc(e);
  }
}, LK = function(A) {
  switch (A) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, TK = ["-apple-system", "system-ui"], DK = function(A) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? A.filter(function(e) {
    return TK.indexOf(e) === -1;
  }) : A;
}, OK = (
  /** @class */
  function(A) {
    Xn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), i.options = n, i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px", i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + n.width + "x" + n.height + " at " + n.x + "," + n.y + ") with scale " + n.scale), i;
    }
    return e.prototype.render = function(t) {
      return kt(this, void 0, void 0, function() {
        var n, i;
        return Tt(this, function(s) {
          switch (s.label) {
            case 0:
              return n = Fd(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, NK(n)];
            case 1:
              return i = s.sent(), this.options.backgroundColor && (this.ctx.fillStyle = gt(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(Ty)
), NK = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, MK = (
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
), PK = (
  /** @class */
  function() {
    function A(e, t) {
      var n;
      this.windowBounds = t, this.instanceName = "#" + A.instanceCount++, this.logger = new MK({ id: this.instanceName, enabled: e.logging }), this.cache = (n = e.cache) !== null && n !== void 0 ? n : new iK(this, e);
    }
    return A.instanceCount = 1, A;
  }()
), RK = function(A, e) {
  return e === void 0 && (e = {}), KK(A, e);
};
typeof window < "u" && _y.setContext(window);
var KK = function(A, e) {
  return kt(void 0, void 0, void 0, function() {
    var t, n, i, s, l, f, c, h, w, B, p, v, o, C, F, U, H, D, b, M, J, R, J, hA, cA, wA, QA, OA, bA, q, CA, iA, gA, IA, HA, uA, T, rA, j, S;
    return Tt(this, function(K) {
      switch (K.label) {
        case 0:
          if (!A || typeof A != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = A.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (n = t.defaultView, !n)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (hA = e.allowTaint) !== null && hA !== void 0 ? hA : !1,
            imageTimeout: (cA = e.imageTimeout) !== null && cA !== void 0 ? cA : 15e3,
            proxy: e.proxy,
            useCORS: (wA = e.useCORS) !== null && wA !== void 0 ? wA : !1
          }, s = ud({ logging: (QA = e.logging) !== null && QA !== void 0 ? QA : !0, cache: e.cache }, i), l = {
            windowWidth: (OA = e.windowWidth) !== null && OA !== void 0 ? OA : n.innerWidth,
            windowHeight: (bA = e.windowHeight) !== null && bA !== void 0 ? bA : n.innerHeight,
            scrollX: (q = e.scrollX) !== null && q !== void 0 ? q : n.pageXOffset,
            scrollY: (CA = e.scrollY) !== null && CA !== void 0 ? CA : n.pageYOffset
          }, f = new $r(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), c = new PK(s, f), h = (iA = e.foreignObjectRendering) !== null && iA !== void 0 ? iA : !1, w = {
            allowTaint: (gA = e.allowTaint) !== null && gA !== void 0 ? gA : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: h,
            copyStyles: h
          }, c.logger.debug("Starting document clone with size " + f.width + "x" + f.height + " scrolled to " + -f.left + "," + -f.top), B = new km(c, A, w), p = B.clonedReferenceElement, p ? [4, B.toIFrame(t, f)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return v = K.sent(), o = Wp(p) || kR(p) ? w4(p.ownerDocument) : Sc(c, p), C = o.width, F = o.height, U = o.left, H = o.top, D = kK(c, p, e.backgroundColor), b = {
            canvas: e.canvas,
            backgroundColor: D,
            scale: (HA = (IA = e.scale) !== null && IA !== void 0 ? IA : n.devicePixelRatio) !== null && HA !== void 0 ? HA : 1,
            x: ((uA = e.x) !== null && uA !== void 0 ? uA : 0) + U,
            y: ((T = e.y) !== null && T !== void 0 ? T : 0) + H,
            width: (rA = e.width) !== null && rA !== void 0 ? rA : Math.ceil(C),
            height: (j = e.height) !== null && j !== void 0 ? j : Math.ceil(F)
          }, h ? (c.logger.debug("Document cloned, using foreign object rendering"), J = new OK(c, b), [4, J.render(p)]) : [3, 3];
        case 2:
          return M = K.sent(), [3, 5];
        case 3:
          return c.logger.debug("Document cloned, element located at " + U + "," + H + " with size " + C + "x" + F + " using computed rendering"), c.logger.debug("Starting DOM parsing"), R = vy(c, p), D === R.styles.backgroundColor && (R.styles.backgroundColor = Pr.TRANSPARENT), c.logger.debug("Starting renderer for element at " + b.x + "," + b.y + " with size " + b.width + "x" + b.height), J = new IK(c, b), [4, J.render(R)];
        case 4:
          M = K.sent(), K.label = 5;
        case 5:
          return (!((S = e.removeContainer) !== null && S !== void 0) || S) && (km.destroy(v) || c.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), c.logger.debug("Finished rendering"), [2, M];
      }
    });
  });
}, kK = function(A, e, t) {
  var n = e.ownerDocument, i = n.documentElement ? Bs(A, getComputedStyle(n.documentElement).backgroundColor) : Pr.TRANSPARENT, s = n.body ? Bs(A, getComputedStyle(n.body).backgroundColor) : Pr.TRANSPARENT, l = typeof t == "string" ? Bs(A, t) : t === null ? Pr.TRANSPARENT : 4294967295;
  return e === n.documentElement ? vi(i) ? vi(s) ? l : s : i : l;
};
let di = {};
di.vectorEffectSupport = !0;
di.Listener = function(A) {
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
    return xe.pull(t, i), n;
  }, n;
};
di.GeneMap = function(A) {
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
  }, t = xe.merge({}, e, A), n, i, s, l, f, c, h, w, B, p, v, o, C, F, U, H, D = !1, b = {}, M = function() {
    if (D) {
      var k = ue(n).height();
      t.height = k - 80, t.width = "100%";
    }
  }, R = function() {
    D ? (t.height = b.height, t.width = b.width, XA(n).classed("fullscreen", !1), D = !1) : (b.height = t.height, b.width = t.width, XA(n).classed("fullscreen", !0), D = !0), M(), CA(), cA(), X();
  }, J = function() {
    var k = { width: t.width, height: t.height };
    if (k.width.toString().indexOf("%") >= 0 || k.height.toString().indexOf("%") >= 0) {
      var eA = XA(n).select("svg").node().getBoundingClientRect();
      k.width.toString().indexOf("%") >= 0 && (k.width = eA.width), k.height.toString().indexOf("%") >= 0 && (k.height = eA.height);
    }
    return k;
  }, hA = function() {
    const k = Gi(i.node()), eA = k.k, lA = [k.x, k.y];
    return lA[0] !== 0 || lA[1] !== 0 || eA !== 1;
  }, cA = function() {
    const k = Gi(i.node()), eA = k.k, lA = [k.x, k.y];
    eA === 1 && xe.isEqual(lA, [0, 0]) || (c.translate([0, 0]), c.scale(1), s.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    ), o.setFitButtonEnabled(hA()), _A(), X());
  }, wA = function() {
    s.select(".drawing_outline").attr("width", B.drawing.width).attr("height", B.drawing.height);
  }, QA = function() {
    var k = B.drawing, eA = B.margin;
    s.select(".drawing_margin").attr("x", eA.left).attr("y", eA.top).attr("width", k.width - eA.left - eA.right).attr("height", k.height - eA.top - eA.bottom);
  }, OA = function() {
    s.attr("transform", "translate(0,0)scale(1)"), s.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    );
  }, bA = async function() {
    const k = document.querySelector(".mapview-wrapper");
    RK(k).then((eA) => {
      const lA = eA.toDataURL("image/png"), SA = document.createElement("a");
      SA.href = lA, SA.download = "capture.png", SA.click();
    }).catch((eA) => {
      console.error("Error capturing the element:", eA);
    });
  };
  h = function() {
    var k = Gi(this), eA = [k.x, k.y], lA = k.k;
    if (B) {
      var SA = i.node().getBoundingClientRect(), zA = -B.drawing.width * lA + SA.width * (1 - t.extraPanArea) + B.drawing.margin.right * lA, ie = SA.width * t.extraPanArea - B.drawing.margin.left * lA;
      eA[0] = xe.clamp(eA[0], zA, ie);
      var Te = -B.drawing.height * lA + SA.height * (1 - t.extraPanArea) + B.drawing.margin.bottom * lA, we = SA.height * t.extraPanArea - B.drawing.margin.top * lA;
      eA[1] = xe.clamp(eA[1], Te, we);
    }
    (k.x !== eA[0] || k.y !== eA[1]) && c.translateBy(
      i,
      eA[0] - k.x,
      eA[1] - k.y
    ), lA !== w && (_A(), X(), w = lA), o.setFitButtonEnabled(hA()), s.attr(
      "transform",
      "translate(" + eA[0] + "," + eA[1] + ")scale(" + lA + ")"
    ), CA(), l.text(
      "translate: [ " + eA[0].toFixed(1) + "," + eA[1].toFixed(1) + "]  zoom:" + lA.toFixed(2)
    );
  };
  var q = function(k) {
    k.preventDefault();
  }, CA = function() {
    ue(".gene-annotation-popover").remove();
  }, iA = function() {
    var k = function(lA) {
      lA.target !== "undefined" && lA.target.tagName.toLowerCase() === "a" || ue(lA.target).closest(".genemap-advanced-menu").length > 0 || ue(lA.target).closest(".color-picker-modal").length > 0 || CA();
    }, eA = "mousedown mousewheel DOMMouseScroll touchstart ";
    ue(n).off(eA).on(eA, k), ue("body").on("click", function(lA) {
      ue(lA.target).closest(n).length < 1 && D == !0 && R();
    });
  }, gA = function(k) {
    k == "auto" ? (C = !0, F = !0, B.chromosomes.forEach(function(eA) {
      eA.annotations.genes.forEach(function(lA) {
        lA.selected == !0 && (lA.visible = !0);
      });
    })) : k == "show" ? (C = !1, F = !0) : k == "hide" && (C = !1, F = !1), B.chromosomes.forEach(function(eA) {
      eA.annotations.genes.forEach(function(lA) {
        k === "auto" ? delete lA.showLabel : lA.showLabel = k;
      });
    }), _A(), X();
  }, IA = function() {
    var k = B.chromosomes.some(function(eA) {
      return eA.annotations.genes.some(function(lA) {
        return lA.selected;
      });
    });
    V.onAnonationLabelSelectFunction && V.onAnonationLabelSelectFunction(V.getSelectedGenes()), _A(), X(), XA(".network-btn").classed("disabled", !k);
  }, HA = function(k) {
    v ? (B = p, v = !1) : (B = { chromosomes: [k] }, v = !0), V.onAnonationLabelSelectFunction(V.getSelectedGenes()), cA(), _A(), X();
  }, uA = function() {
    xe.flatMap(
      B.chromosomes.map(function(k) {
        return k.annotations.genes.filter(function(eA) {
          return eA.selected;
        }).map(function(eA) {
          var lA = eA.link, SA = lA.substring(lA.indexOf("list="), lA.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              SA.replace(/\+/g, " ")
            )
          );
        });
      })
    ), t.apiUrl + "";
  }, T = function() {
    var k = o.getTagButtonState(), eA;
    k === "auto" ? eA = "show" : k === "show" ? eA = "hide" : eA = "auto", o.setTabButtonState(eA), gA(eA), X();
  }, rA = function() {
    B.chromosomes.forEach(function(k) {
      k.annotations.allGenes.forEach(function(eA) {
        eA.selected = !1, eA.visible = !1, eA.hidden = !1;
      });
    }), _A(), X();
  }, j = function(k) {
    t.layout.numberPerRow = k, aA(), _A(), X();
  }, S = function(k) {
    k == "all" ? (U = !0, H = !0) : k == "selected" ? (U = !1, H = "true") : (U = !1, H = !1), EA(), _A(), X();
  }, K = function() {
    const eA = Gi(i.node()).k;
    var lA = nH(t.layout).width(J().width).height(J().height).scale(eA);
    B = lA.decorateGenome(B);
  }, aA = function() {
    B.chromosomes.forEach(function(k) {
      k.layout = k.layout || {}, k.layout.annotationDisplayClusters = null, k.layout.geneBandDisplayClusters = null;
    });
  }, EA = function() {
    B.chromosomes.forEach(function(k) {
      k.layout = k.layout || {}, k.layout.qtlDisplayClusters = null;
    });
  }, _A = function() {
    const eA = Gi(i.node()).k;
    K();
    var lA = c4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: B.cellLayout.annotations.marker.size,
      annotationLabelSize: B.cellLayout.annotations.label.size,
      scale: eA,
      autoLabels: C,
      manualLabels: F,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), SA = f4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: eA,
      nGenesToDisplay: t.nGenesToDisplay
    }), zA = B4({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.qtlAnnotationPosition,
      scale: eA,
      showAllQTLs: U,
      showSelectedQTLs: H,
      showAutoQTLLabels: U,
      showSelectedQTLLabels: H,
      annotationLabelSize: B.cellLayout.annotations.label.size
    });
    B.chromosomes.forEach(function(ie) {
      ie.layout = ie.layout || {}, ie.layout.annotationDisplayClusters || lA.computeChromosomeClusters(ie), lA.layoutChromosome(ie), ie.layout.geneBandDisplayClusters || SA.computeChromosomeClusters(ie), SA.layoutChromosome(ie), ie.layout.qtlDisplayClusters || zA.computeChromosomeClusters(ie), zA.layoutChromosome(ie);
    }), lA.computeNormalisedGeneScores(B.chromosomes);
  }, qA = function(k, eA) {
    var lA = /* @__PURE__ */ new Set(), SA = [];
    function zA(JA, Ee) {
      JA != null && JA !== "" && !lA.has(JA) && (lA.add(JA), SA.push({ trait: JA, color: Ee || "#333" }));
    }
    var ie = eA && eA.chromosomes || [];
    typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] updateLegend: genome.chromosomes.length =", ie.length), ie.forEach(function(JA, Ee) {
      var GA = JA.annotations || {};
      typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] updateLegend: chr", Ee, "number=" + JA.number, {
        snps: (GA.snps || []).length,
        qtls: (GA.qtls || []).length,
        genes: (GA.genes || []).length,
        allGenes: (GA.allGenes || []).length,
        sampleTrait: GA.snps && GA.snps[0] && GA.snps[0].trait || GA.genes && GA.genes[0] && GA.genes[0].trait
      }), (GA.snps || []).forEach(function(Ge) {
        zA(Ge.trait, Ge.color);
      }), (GA.qtls || []).forEach(function(Ge) {
        zA(Ge.trait || Ge.label, Ge.color);
      }), (GA.genes || GA.allGenes || []).forEach(function(Ge) {
        Ge.trait && zA(Ge.trait, Ge.color);
      });
    }), typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] updateLegend: traitColors =", SA, "keyTarget.empty =", k.empty && k.empty()), SA.length > 0 ? k.text("Study Legend: ") : k.text("");
    var Te = k.selectAll("span.key-item").data(SA);
    Te.exit().remove();
    var we = Te.enter().append("span").classed("key-item", !0);
    we.append("span").style("background-color", function(JA) {
      return JA.color;
    }).classed("colorbox", !0).append("svg"), we.append("span").text(function(JA) {
      return JA.trait;
    });
  }, ZA = function(k) {
    var eA = k.append("div").attr("class", "mapview-wrapper"), lA = eA.append("svg").attr("width", t.width).attr("height", t.height).attr("class", "mapview").attr("flex", t.flex);
    l = k.append("div").append("span").attr("class", "logger").attr("id", "logbar"), f = k.append("div").attr("class", "key").attr("id", "keybar").style("min-height", "20px").style("flex-shrink", "0").style("display", "block").style("visibility", "visible"), di.vectorEffectSupport = "vectorEffect" in lA.node().style, iA(), lA.on("contextmenu", q), lA.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && k.select(".zoom_window").append("rect").classed("drawing_margin", !0), w = 1, c = BD().scaleExtent([0.5, 60]), c.on("start", function() {
      lA.classed("dragging", !0);
    }).on("zoom", h).on("end", function() {
      lA.classed("dragging", !1);
    }), k.select("svg").call(c);
    var SA = k.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return SA.append("div").attr("class", "arrow"), SA.append("h3").attr("class", "popover-title").text("Cluster"), SA.append("div").attr("class", "popover-content"), lA;
  }, X = function() {
    XA(n).select("svg").node() ? (i = XA(n).select("svg"), i.attr("width", t.width).attr("height", t.height)) : i = ZA(XA(n)), K();
    var k = B.chromosomes.every(function(lA) {
      return lA.layout;
    });
    k || _A(), i.datum(B), s = i.select(".zoom_window"), wA(), t.contentBorder && QA();
    var eA = i4().onAnnotationSelectFunction(IA).onLabelSelectFunction(HA).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(i);
    s.call(eA);
  };
  function V(k) {
    k.each(function(eA) {
      var lA = this;
      n = lA, p = eA, B = p, v = !1, o || (o = h4().onTagBtnClick(T).onFitBtnClick(cA).onLabelBtnClick(gA).onQtlBtnClick(S).onNetworkBtnClick(uA).onResetBtnClick(rA).onSetNumberPerRowClick(j).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(bA).onExportAllBtnClick(OA).onExpandBtnClick(R).maxSnpPValueProperty(V.maxSnpPValue).nGenesToDisplayProperty(V.nGenesToDisplay).annotationLabelSizeProperty(V.annotationLabelSize)), XA(n).call(o), o.setNetworkButtonEnabled(!1), o.setFitButtonEnabled(!1), o.setTabButtonState("auto"), X();
    });
  }
  return V.resetZoom = cA, V.getZoom = function() {
    return !i || !i.node() ? 1 : Gi(i.node()).k;
  }, V.setZoom = function(k) {
    return !i || !i.node() || (k = xe.clamp(k, 0.5, 60), c.scaleTo(i, k)), V;
  }, V.zoomIn = function(k) {
    return !i || !i.node() || (k = k || 1.5, c.scaleBy(i, k)), V;
  }, V.zoomOut = function(k) {
    return !i || !i.node() || (k = k || 1 / 1.5, c.scaleBy(i, k)), V;
  }, V.width = function(k) {
    return arguments.length ? (t.width = k, V) : t.width;
  }, V.height = function(k) {
    return arguments.length ? (t.height = k, V) : t.height;
  }, V.layout = function(k) {
    return arguments.length ? (t.layout = xe.merge(t.layout, k), V) : t.layout;
  }, V.draw = async function(k, eA, lA, SA = !1) {
    var zA = eH();
    if (lA)
      zA.readData(eA, lA, SA).then(function(ie) {
        V._draw(k, ie, SA);
      });
    else {
      const ie = await zA.readData(eA, lA, SA);
      V._draw(k, ie, SA);
    }
  }, V._draw = function(k, eA) {
    var lA = XA(k), SA = lA.select(".genomaps-container");
    SA.empty() && (SA = lA.append("div").attr("class", "genomaps-container").style("height", "100%").style("width", "100%"));
    var zA = SA.selectAll("div.genomaps-inner").data(["genemap-target"]);
    zA.enter().append("div").attr("class", "genomaps-inner").attr("id", "genemap-target"), n = lA.select("#genemap-target").node(), XA(n).datum(eA).call(V), V.nGenesToDisplay(t.initialMaxGenes), cA();
    var ie = XA(n).select("#keybar");
    typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] _draw: target =", n, "keybar.empty =", ie.empty && ie.empty(), "legendSpan.empty =", f && f.empty && f.empty()), ie.empty() ? f && !f.empty() ? qA(f, B) : typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.warn("[genomaps] _draw: no #keybar or legendSpan found, legend not updated") : qA(ie, B);
  }, V.changeQtlColor = function(k, eA, lA) {
    B.chromosomes.forEach(function(SA) {
      SA.layout.qtlNodes.forEach(function(zA) {
        zA.id === k && (zA.color = eA, zA.label = lA);
      });
    }), _A(), X();
  }, V.changeColor = function(k) {
    XA("#map").style("background-color", k), _A(), X();
  }, V.redraw = function(k) {
    n = XA(k).select("#genemap-target")[0][0], M(), XA(n).call(V), CA();
  }, V.forceLayout = function() {
    return !B || !i || !i.node() || (aA(), EA(), _A(), X()), V;
  }, V.setGeneLabels = function(k) {
    n && gA(k);
  }, V.maxSnpPValue = di.Listener(t.maxSnpPValue).addListener(
    function(k) {
      var eA = Number(k);
      isNaN(eA) && V.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(k), _A(), X();
    }
  ), V.nGenesToDisplay = di.Listener(t.nGenesToDisplay).addListener(
    function(k) {
      var eA = t.nGenesToDisplay;
      t.nGenesToDisplay = k, k != eA && (aA(), _A(), X());
    }
  ), V.annotationLabelSize = di.Listener(
    t.annotationLabelSize
  ).addListener(function(k) {
    t.annotationLabelSize = k, aA(), _A(), X();
  }), V.setQtlLabels = function(k) {
    if (n) {
      var eA = XA(n).datum();
      eA.chromosomes.forEach(function(lA) {
        lA.annotations.qtls.forEach(function(SA) {
          k === "auto" ? delete SA.showLabel : SA.showLabel = k;
        });
      });
    }
  }, V.onAnonationLabelSelectFunction = function() {
  }, V.loggingOn = function() {
    l.style("display", "initial");
  }, V.loggingOff = function() {
    l.style("display", "none");
  }, V.getSelectedGenes = function() {
    var k = [];
    return B.chromosomes.forEach(function(eA) {
      eA.annotations.genes.forEach(function(lA) {
        lA.selected && k.push(lA);
      });
    }), k;
  }, V.getGenome = function() {
    return B;
  }, V;
};
const ta = di.GeneMap().width("100%").height("100%");
function $K() {
  const A = document.getElementById("show-gene-labels"), e = A.options[A.selectedIndex].value;
  ta.setGeneLabels(e);
  const t = document.getElementById("show-qtl-labels"), n = t.options[t.selectedIndex].value;
  ta.setQtlLabels(n), ta.redraw("#map");
}
function GK() {
  ta.changeQtlColor("C6", "#000");
}
async function VK(A) {
  const e = document.getElementById("basemap-file");
  if (!e) return;
  const t = e.options[e.selectedIndex].value, n = "./src/test/data/basemap/" + t + ".json", i = document.getElementById("chromosome_per_row");
  if (i) {
    const c = +i.value;
    ta.layout().numberPerRow = c;
  }
  A && ta.resetZoom();
  const s = document.getElementById("show-qtl-labels");
  s && (s.options[2].selected = !0);
  let l = null;
  const f = document.getElementById("chk-annotations");
  f && f.checked && (l = "./src/test/data/annotations/" + t + ".json"), await ta.draw("#map", n, l, !1);
}
export {
  GK as changeQtlColor,
  ta as chart,
  VK as redraw,
  $K as updateLabel
};
