import './chart.css';function i1(A, e) {
  for (var t = 0; t < e.length; t++) {
    const n = e[t];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const i in n)
        if (i !== "default" && !(i in A)) {
          const o = Object.getOwnPropertyDescriptor(n, i);
          o && Object.defineProperty(A, i, o.get ? o : {
            enumerable: !0,
            get: () => n[i]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(A, Symbol.toStringTag, { value: "Module" }));
}
var Ji = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ic(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var Wh = { exports: {} }, iv = {}, zn = {}, io = {}, ks = {}, we = {}, Is = {};
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
      return (S = this._str) !== null && S !== void 0 ? S : this._str = this._items.reduce((N, x) => `${N}${x}`, "");
    }
    get names() {
      var S;
      return (S = this._names) !== null && S !== void 0 ? S : this._names = this._items.reduce((N, x) => (x instanceof t && (N[x.str] = (N[x.str] || 0) + 1), N), {});
    }
  }
  A._Code = n, A.nil = new n("");
  function i(U, ...S) {
    const N = [U[0]];
    let x = 0;
    for (; x < S.length; )
      f(N, S[x]), N.push(U[++x]);
    return new n(N);
  }
  A._ = i;
  const o = new n("+");
  function l(U, ...S) {
    const N = [v(U[0])];
    let x = 0;
    for (; x < S.length; )
      N.push(o), f(N, S[x]), N.push(o, v(U[++x]));
    return c(N), new n(N);
  }
  A.str = l;
  function f(U, S) {
    S instanceof n ? U.push(...S._items) : S instanceof t ? U.push(S) : U.push(B(S));
  }
  A.addCodeArg = f;
  function c(U) {
    let S = 1;
    for (; S < U.length - 1; ) {
      if (U[S] === o) {
        const N = h(U[S - 1], U[S + 1]);
        if (N !== void 0) {
          U.splice(S - 1, 3, N);
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
  function m(U, S) {
    return S.emptyStr() ? U : U.emptyStr() ? S : l`${U}${S}`;
  }
  A.strConcat = m;
  function B(U) {
    return typeof U == "number" || typeof U == "boolean" || U === null ? U : v(Array.isArray(U) ? U.join(",") : U);
  }
  function g(U) {
    return new n(v(U));
  }
  A.stringify = g;
  function v(U) {
    return JSON.stringify(U).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  A.safeStringify = v;
  function u(U) {
    return typeof U == "string" && A.IDENTIFIER.test(U) ? new n(`.${U}`) : i`[${U}]`;
  }
  A.getProperty = u;
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
})(Is);
var Xh = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ValueScope = A.ValueScopeName = A.Scope = A.varKinds = A.UsedValueState = void 0;
  const e = Is;
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
    constructor({ prefixes: h, parent: m } = {}) {
      this._names = {}, this._prefixes = h, this._parent = m;
    }
    toName(h) {
      return h instanceof e.Name ? h : this.name(h);
    }
    name(h) {
      return new e.Name(this._newName(h));
    }
    _newName(h) {
      const m = this._names[h] || this._nameGroup(h);
      return `${h}${m.index++}`;
    }
    _nameGroup(h) {
      var m, B;
      if (!((B = (m = this._parent) === null || m === void 0 ? void 0 : m._prefixes) === null || B === void 0) && B.has(h) || this._prefixes && !this._prefixes.has(h))
        throw new Error(`CodeGen: prefix "${h}" is not allowed in this scope`);
      return this._names[h] = { prefix: h, index: 0 };
    }
  }
  A.Scope = i;
  class o extends e.Name {
    constructor(h, m) {
      super(m), this.prefix = h;
    }
    setValue(h, { property: m, itemIndex: B }) {
      this.value = h, this.scopePath = (0, e._)`.${new e.Name(m)}[${B}]`;
    }
  }
  A.ValueScopeName = o;
  const l = (0, e._)`\n`;
  class f extends i {
    constructor(h) {
      super(h), this._values = {}, this._scope = h.scope, this.opts = { ...h, _n: h.lines ? l : e.nil };
    }
    get() {
      return this._scope;
    }
    name(h) {
      return new o(h, this._newName(h));
    }
    value(h, m) {
      var B;
      if (m.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const g = this.toName(h), { prefix: v } = g, u = (B = m.key) !== null && B !== void 0 ? B : m.ref;
      let C = this._values[v];
      if (C) {
        const S = C.get(u);
        if (S)
          return S;
      } else
        C = this._values[v] = /* @__PURE__ */ new Map();
      C.set(u, g);
      const F = this._scope[v] || (this._scope[v] = []), U = F.length;
      return F[U] = m.ref, g.setValue(m, { property: v, itemIndex: U }), g;
    }
    getValue(h, m) {
      const B = this._values[h];
      if (B)
        return B.get(m);
    }
    scopeRefs(h, m = this._values) {
      return this._reduceValues(m, (B) => {
        if (B.scopePath === void 0)
          throw new Error(`CodeGen: name "${B}" has no value`);
        return (0, e._)`${h}${B.scopePath}`;
      });
    }
    scopeCode(h = this._values, m, B) {
      return this._reduceValues(h, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, m, B);
    }
    _reduceValues(h, m, B = {}, g) {
      let v = e.nil;
      for (const u in h) {
        const C = h[u];
        if (!C)
          continue;
        const F = B[u] = B[u] || /* @__PURE__ */ new Map();
        C.forEach((U) => {
          if (F.has(U))
            return;
          F.set(U, n.Started);
          let S = m(U);
          if (S) {
            const N = this.opts.es5 ? A.varKinds.var : A.varKinds.const;
            v = (0, e._)`${v}${N} ${U} = ${S};${this.opts._n}`;
          } else if (S = g == null ? void 0 : g(U))
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
})(Xh);
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.or = A.and = A.not = A.CodeGen = A.operators = A.varKinds = A.ValueScopeName = A.ValueScope = A.Scope = A.Name = A.regexpCode = A.stringify = A.getProperty = A.nil = A.strConcat = A.str = A._ = void 0;
  const e = Is, t = Xh;
  var n = Is;
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
  var i = Xh;
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
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames(T, k) {
      return this;
    }
  }
  class l extends o {
    constructor(T, k, rA) {
      super(), this.varKind = T, this.name = k, this.rhs = rA;
    }
    render({ es5: T, _n: k }) {
      const rA = T ? t.varKinds.var : this.varKind, UA = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${rA} ${this.name}${UA};` + k;
    }
    optimizeNames(T, k) {
      if (T[this.name.str])
        return this.rhs && (this.rhs = X(this.rhs, T, k)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class f extends o {
    constructor(T, k, rA) {
      super(), this.lhs = T, this.rhs = k, this.sideEffects = rA;
    }
    render({ _n: T }) {
      return `${this.lhs} = ${this.rhs};` + T;
    }
    optimizeNames(T, k) {
      if (!(this.lhs instanceof e.Name && !T[this.lhs.str] && !this.sideEffects))
        return this.rhs = X(this.rhs, T, k), this;
    }
    get names() {
      const T = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return xA(T, this.rhs);
    }
  }
  class c extends f {
    constructor(T, k, rA, UA) {
      super(T, rA, UA), this.op = k;
    }
    render({ _n: T }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + T;
    }
  }
  class h extends o {
    constructor(T) {
      super(), this.label = T, this.names = {};
    }
    render({ _n: T }) {
      return `${this.label}:` + T;
    }
  }
  class m extends o {
    constructor(T) {
      super(), this.label = T, this.names = {};
    }
    render({ _n: T }) {
      return `break${this.label ? ` ${this.label}` : ""};` + T;
    }
  }
  class B extends o {
    constructor(T) {
      super(), this.error = T;
    }
    render({ _n: T }) {
      return `throw ${this.error};` + T;
    }
    get names() {
      return this.error.names;
    }
  }
  class g extends o {
    constructor(T) {
      super(), this.code = T;
    }
    render({ _n: T }) {
      return `${this.code};` + T;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(T, k) {
      return this.code = X(this.code, T, k), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class v extends o {
    constructor(T = []) {
      super(), this.nodes = T;
    }
    render(T) {
      return this.nodes.reduce((k, rA) => k + rA.render(T), "");
    }
    optimizeNodes() {
      const { nodes: T } = this;
      let k = T.length;
      for (; k--; ) {
        const rA = T[k].optimizeNodes();
        Array.isArray(rA) ? T.splice(k, 1, ...rA) : rA ? T[k] = rA : T.splice(k, 1);
      }
      return T.length > 0 ? this : void 0;
    }
    optimizeNames(T, k) {
      const { nodes: rA } = this;
      let UA = rA.length;
      for (; UA--; ) {
        const EA = rA[UA];
        EA.optimizeNames(T, k) || (CA(T, EA.names), rA.splice(UA, 1));
      }
      return rA.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((T, k) => NA(T, k.names), {});
    }
  }
  class u extends v {
    render(T) {
      return "{" + T._n + super.render(T) + "}" + T._n;
    }
  }
  class C extends v {
  }
  class F extends u {
  }
  F.kind = "else";
  class U extends u {
    constructor(T, k) {
      super(k), this.condition = T;
    }
    render(T) {
      let k = `if(${this.condition})` + super.render(T);
      return this.else && (k += "else " + this.else.render(T)), k;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const T = this.condition;
      if (T === !0)
        return this.nodes;
      let k = this.else;
      if (k) {
        const rA = k.optimizeNodes();
        k = this.else = Array.isArray(rA) ? new F(rA) : rA;
      }
      if (k)
        return T === !1 ? k instanceof U ? k : k.nodes : this.nodes.length ? this : new U(tA(T), k instanceof U ? [k] : k.nodes);
      if (!(T === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(T, k) {
      var rA;
      if (this.else = (rA = this.else) === null || rA === void 0 ? void 0 : rA.optimizeNames(T, k), !!(super.optimizeNames(T, k) || this.else))
        return this.condition = X(this.condition, T, k), this;
    }
    get names() {
      const T = super.names;
      return xA(T, this.condition), this.else && NA(T, this.else.names), T;
    }
  }
  U.kind = "if";
  class S extends u {
  }
  S.kind = "for";
  class N extends S {
    constructor(T) {
      super(), this.iteration = T;
    }
    render(T) {
      return `for(${this.iteration})` + super.render(T);
    }
    optimizeNames(T, k) {
      if (super.optimizeNames(T, k))
        return this.iteration = X(this.iteration, T, k), this;
    }
    get names() {
      return NA(super.names, this.iteration.names);
    }
  }
  class x extends S {
    constructor(T, k, rA, UA) {
      super(), this.varKind = T, this.name = k, this.from = rA, this.to = UA;
    }
    render(T) {
      const k = T.es5 ? t.varKinds.var : this.varKind, { name: rA, from: UA, to: EA } = this;
      return `for(${k} ${rA}=${UA}; ${rA}<${EA}; ${rA}++)` + super.render(T);
    }
    get names() {
      const T = xA(super.names, this.from);
      return xA(T, this.to);
    }
  }
  class P extends S {
    constructor(T, k, rA, UA) {
      super(), this.loop = T, this.varKind = k, this.name = rA, this.iterable = UA;
    }
    render(T) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(T);
    }
    optimizeNames(T, k) {
      if (super.optimizeNames(T, k))
        return this.iterable = X(this.iterable, T, k), this;
    }
    get names() {
      return NA(super.names, this.iterable.names);
    }
  }
  class R extends u {
    constructor(T, k, rA) {
      super(), this.name = T, this.args = k, this.async = rA;
    }
    render(T) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(T);
    }
  }
  R.kind = "func";
  class J extends v {
    render(T) {
      return "return " + super.render(T);
    }
  }
  J.kind = "return";
  class fA extends u {
    render(T) {
      let k = "try" + super.render(T);
      return this.catch && (k += this.catch.render(T)), this.finally && (k += this.finally.render(T)), k;
    }
    optimizeNodes() {
      var T, k;
      return super.optimizeNodes(), (T = this.catch) === null || T === void 0 || T.optimizeNodes(), (k = this.finally) === null || k === void 0 || k.optimizeNodes(), this;
    }
    optimizeNames(T, k) {
      var rA, UA;
      return super.optimizeNames(T, k), (rA = this.catch) === null || rA === void 0 || rA.optimizeNames(T, k), (UA = this.finally) === null || UA === void 0 || UA.optimizeNames(T, k), this;
    }
    get names() {
      const T = super.names;
      return this.catch && NA(T, this.catch.names), this.finally && NA(T, this.finally.names), T;
    }
  }
  class uA extends u {
    constructor(T) {
      super(), this.error = T;
    }
    render(T) {
      return `catch(${this.error})` + super.render(T);
    }
  }
  uA.kind = "catch";
  class BA extends u {
    render(T) {
      return "finally" + super.render(T);
    }
  }
  BA.kind = "finally";
  class FA {
    constructor(T, k = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...k, _n: k.lines ? `
` : "" }, this._extScope = T, this._scope = new t.Scope({ parent: T }), this._nodes = [new C()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(T) {
      return this._scope.name(T);
    }
    // reserves unique name in the external scope
    scopeName(T) {
      return this._extScope.name(T);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(T, k) {
      const rA = this._extScope.value(T, k);
      return (this._values[rA.prefix] || (this._values[rA.prefix] = /* @__PURE__ */ new Set())).add(rA), rA;
    }
    getScopeValue(T, k) {
      return this._extScope.getValue(T, k);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(T) {
      return this._extScope.scopeRefs(T, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(T, k, rA, UA) {
      const EA = this._scope.toName(k);
      return rA !== void 0 && UA && (this._constants[EA.str] = rA), this._leafNode(new l(T, EA, rA)), EA;
    }
    // `const` declaration (`var` in es5 mode)
    const(T, k, rA) {
      return this._def(t.varKinds.const, T, k, rA);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(T, k, rA) {
      return this._def(t.varKinds.let, T, k, rA);
    }
    // `var` declaration with optional assignment
    var(T, k, rA) {
      return this._def(t.varKinds.var, T, k, rA);
    }
    // assignment code
    assign(T, k, rA) {
      return this._leafNode(new f(T, k, rA));
    }
    // `+=` code
    add(T, k) {
      return this._leafNode(new c(T, A.operators.ADD, k));
    }
    // appends passed SafeExpr to code or executes Block
    code(T) {
      return typeof T == "function" ? T() : T !== e.nil && this._leafNode(new g(T)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...T) {
      const k = ["{"];
      for (const [rA, UA] of T)
        k.length > 1 && k.push(","), k.push(rA), (rA !== UA || this.opts.es5) && (k.push(":"), (0, e.addCodeArg)(k, UA));
      return k.push("}"), new e._Code(k);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(T, k, rA) {
      if (this._blockNode(new U(T)), k && rA)
        this.code(k).else().code(rA).endIf();
      else if (k)
        this.code(k).endIf();
      else if (rA)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(T) {
      return this._elseNode(new U(T));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new F());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(U, F);
    }
    _for(T, k) {
      return this._blockNode(T), k && this.code(k).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(T, k) {
      return this._for(new N(T), k);
    }
    // `for` statement for a range of values
    forRange(T, k, rA, UA, EA = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const zA = this._scope.toName(T);
      return this._for(new x(EA, zA, k, rA), () => UA(zA));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(T, k, rA, UA = t.varKinds.const) {
      const EA = this._scope.toName(T);
      if (this.opts.es5) {
        const zA = k instanceof e.Name ? k : this.var("_arr", k);
        return this.forRange("_i", 0, (0, e._)`${zA}.length`, (ne) => {
          this.var(EA, (0, e._)`${zA}[${ne}]`), rA(EA);
        });
      }
      return this._for(new P("of", UA, EA, k), () => rA(EA));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(T, k, rA, UA = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(T, (0, e._)`Object.keys(${k})`, rA);
      const EA = this._scope.toName(T);
      return this._for(new P("in", UA, EA, k), () => rA(EA));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(S);
    }
    // `label` statement
    label(T) {
      return this._leafNode(new h(T));
    }
    // `break` statement
    break(T) {
      return this._leafNode(new m(T));
    }
    // `return` statement
    return(T) {
      const k = new J();
      if (this._blockNode(k), this.code(T), k.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(T, k, rA) {
      if (!k && !rA)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const UA = new fA();
      if (this._blockNode(UA), this.code(T), k) {
        const EA = this.name("e");
        this._currNode = UA.catch = new uA(EA), k(EA);
      }
      return rA && (this._currNode = UA.finally = new BA(), this.code(rA)), this._endBlockNode(uA, BA);
    }
    // `throw` statement
    throw(T) {
      return this._leafNode(new B(T));
    }
    // start self-balancing block
    block(T, k) {
      return this._blockStarts.push(this._nodes.length), T && this.code(T).endBlock(k), this;
    }
    // end the current self-balancing block
    endBlock(T) {
      const k = this._blockStarts.pop();
      if (k === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const rA = this._nodes.length - k;
      if (rA < 0 || T !== void 0 && rA !== T)
        throw new Error(`CodeGen: wrong number of nodes: ${rA} vs ${T} expected`);
      return this._nodes.length = k, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(T, k = e.nil, rA, UA) {
      return this._blockNode(new R(T, k, rA)), UA && this.code(UA).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(R);
    }
    optimize(T = 1) {
      for (; T-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(T) {
      return this._currNode.nodes.push(T), this;
    }
    _blockNode(T) {
      this._currNode.nodes.push(T), this._nodes.push(T);
    }
    _endBlockNode(T, k) {
      const rA = this._currNode;
      if (rA instanceof T || k && rA instanceof k)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${k ? `${T.kind}/${k.kind}` : T.kind}"`);
    }
    _elseNode(T) {
      const k = this._currNode;
      if (!(k instanceof U))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = k.else = T, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const T = this._nodes;
      return T[T.length - 1];
    }
    set _currNode(T) {
      const k = this._nodes;
      k[k.length - 1] = T;
    }
  }
  A.CodeGen = FA;
  function NA(j, T) {
    for (const k in T)
      j[k] = (j[k] || 0) + (T[k] || 0);
    return j;
  }
  function xA(j, T) {
    return T instanceof e._CodeOrName ? NA(j, T.names) : j;
  }
  function X(j, T, k) {
    if (j instanceof e.Name)
      return rA(j);
    if (!UA(j))
      return j;
    return new e._Code(j._items.reduce((EA, zA) => (zA instanceof e.Name && (zA = rA(zA)), zA instanceof e._Code ? EA.push(...zA._items) : EA.push(zA), EA), []));
    function rA(EA) {
      const zA = k[EA.str];
      return zA === void 0 || T[EA.str] !== 1 ? EA : (delete T[EA.str], zA);
    }
    function UA(EA) {
      return EA instanceof e._Code && EA._items.some((zA) => zA instanceof e.Name && T[zA.str] === 1 && k[zA.str] !== void 0);
    }
  }
  function CA(j, T) {
    for (const k in T)
      j[k] = (j[k] || 0) - (T[k] || 0);
  }
  function tA(j) {
    return typeof j == "boolean" || typeof j == "number" || j === null ? !j : (0, e._)`!${eA(j)}`;
  }
  A.not = tA;
  const hA = D(A.operators.AND);
  function _A(...j) {
    return j.reduce(hA);
  }
  A.and = _A;
  const IA = D(A.operators.OR);
  function aA(...j) {
    return j.reduce(IA);
  }
  A.or = aA;
  function D(j) {
    return (T, k) => T === e.nil ? k : k === e.nil ? T : (0, e._)`${eA(T)} ${j} ${eA(k)}`;
  }
  function eA(j) {
    return j instanceof e.Name ? j : (0, e._)`(${j})`;
  }
})(we);
var PA = {};
Object.defineProperty(PA, "__esModule", { value: !0 });
PA.checkStrictMode = PA.getErrorPath = PA.Type = PA.useFunc = PA.setEvaluated = PA.evaluatedPropsToName = PA.mergeEvaluated = PA.eachItem = PA.unescapeJsonPointer = PA.escapeJsonPointer = PA.escapeFragment = PA.unescapeFragment = PA.schemaRefOrVal = PA.schemaHasRulesButRef = PA.schemaHasRules = PA.checkUnknownRules = PA.alwaysValidSchema = PA.toHash = void 0;
const Ve = we, a1 = Is;
function o1(A) {
  const e = {};
  for (const t of A)
    e[t] = !0;
  return e;
}
PA.toHash = o1;
function s1(A, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (av(A, e), !ov(e, A.self.RULES.all));
}
PA.alwaysValidSchema = s1;
function av(A, e = A.schema) {
  const { opts: t, self: n } = A;
  if (!t.strictSchema || typeof e == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const o in e)
    i[o] || lv(A, `unknown keyword: "${o}"`);
}
PA.checkUnknownRules = av;
function ov(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e[t])
      return !0;
  return !1;
}
PA.schemaHasRules = ov;
function u1(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (t !== "$ref" && e.all[t])
      return !0;
  return !1;
}
PA.schemaHasRulesButRef = u1;
function l1({ topSchemaRef: A, schemaPath: e }, t, n, i) {
  if (!i) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, Ve._)`${t}`;
  }
  return (0, Ve._)`${A}${e}${(0, Ve.getProperty)(n)}`;
}
PA.schemaRefOrVal = l1;
function c1(A) {
  return sv(decodeURIComponent(A));
}
PA.unescapeFragment = c1;
function f1(A) {
  return encodeURIComponent(kd(A));
}
PA.escapeFragment = f1;
function kd(A) {
  return typeof A == "number" ? `${A}` : A.replace(/~/g, "~0").replace(/\//g, "~1");
}
PA.escapeJsonPointer = kd;
function sv(A) {
  return A.replace(/~1/g, "/").replace(/~0/g, "~");
}
PA.unescapeJsonPointer = sv;
function h1(A, e) {
  if (Array.isArray(A))
    for (const t of A)
      e(t);
  else
    e(A);
}
PA.eachItem = h1;
function $B({ mergeNames: A, mergeToName: e, mergeValues: t, resultToName: n }) {
  return (i, o, l, f) => {
    const c = l === void 0 ? o : l instanceof Ve.Name ? (o instanceof Ve.Name ? A(i, o, l) : e(i, o, l), l) : o instanceof Ve.Name ? (e(i, l, o), o) : t(o, l);
    return f === Ve.Name && !(c instanceof Ve.Name) ? n(i, c) : c;
  };
}
PA.mergeEvaluated = {
  props: $B({
    mergeNames: (A, e, t) => A.if((0, Ve._)`${t} !== true && ${e} !== undefined`, () => {
      A.if((0, Ve._)`${e} === true`, () => A.assign(t, !0), () => A.assign(t, (0, Ve._)`${t} || {}`).code((0, Ve._)`Object.assign(${t}, ${e})`));
    }),
    mergeToName: (A, e, t) => A.if((0, Ve._)`${t} !== true`, () => {
      e === !0 ? A.assign(t, !0) : (A.assign(t, (0, Ve._)`${t} || {}`), $d(A, t, e));
    }),
    mergeValues: (A, e) => A === !0 ? !0 : { ...A, ...e },
    resultToName: uv
  }),
  items: $B({
    mergeNames: (A, e, t) => A.if((0, Ve._)`${t} !== true && ${e} !== undefined`, () => A.assign(t, (0, Ve._)`${e} === true ? true : ${t} > ${e} ? ${t} : ${e}`)),
    mergeToName: (A, e, t) => A.if((0, Ve._)`${t} !== true`, () => A.assign(t, e === !0 ? !0 : (0, Ve._)`${t} > ${e} ? ${t} : ${e}`)),
    mergeValues: (A, e) => A === !0 ? !0 : Math.max(A, e),
    resultToName: (A, e) => A.var("items", e)
  })
};
function uv(A, e) {
  if (e === !0)
    return A.var("props", !0);
  const t = A.var("props", (0, Ve._)`{}`);
  return e !== void 0 && $d(A, t, e), t;
}
PA.evaluatedPropsToName = uv;
function $d(A, e, t) {
  Object.keys(t).forEach((n) => A.assign((0, Ve._)`${e}${(0, Ve.getProperty)(n)}`, !0));
}
PA.setEvaluated = $d;
const GB = {};
function d1(A, e) {
  return A.scopeValue("func", {
    ref: e,
    code: GB[e.code] || (GB[e.code] = new a1._Code(e.code))
  });
}
PA.useFunc = d1;
var qh;
(function(A) {
  A[A.Num = 0] = "Num", A[A.Str = 1] = "Str";
})(qh || (PA.Type = qh = {}));
function p1(A, e, t) {
  if (A instanceof Ve.Name) {
    const n = e === qh.Num;
    return t ? n ? (0, Ve._)`"[" + ${A} + "]"` : (0, Ve._)`"['" + ${A} + "']"` : n ? (0, Ve._)`"/" + ${A}` : (0, Ve._)`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, Ve.getProperty)(A).toString() : "/" + kd(A);
}
PA.getErrorPath = p1;
function lv(A, e, t = A.opts.strictSchema) {
  if (t) {
    if (e = `strict mode: ${e}`, t === !0)
      throw new Error(e);
    A.self.logger.warn(e);
  }
}
PA.checkStrictMode = lv;
var gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
const Dt = we, g1 = {
  // validation function arguments
  data: new Dt.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Dt.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Dt.Name("instancePath"),
  parentData: new Dt.Name("parentData"),
  parentDataProperty: new Dt.Name("parentDataProperty"),
  rootData: new Dt.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Dt.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Dt.Name("vErrors"),
  // null or array of validation errors
  errors: new Dt.Name("errors"),
  // counter of validation errors
  this: new Dt.Name("this"),
  // "globals"
  self: new Dt.Name("self"),
  scope: new Dt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Dt.Name("json"),
  jsonPos: new Dt.Name("jsonPos"),
  jsonLen: new Dt.Name("jsonLen"),
  jsonPart: new Dt.Name("jsonPart")
};
gr.default = g1;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.extendErrors = A.resetErrorsCount = A.reportExtraError = A.reportError = A.keyword$DataError = A.keywordError = void 0;
  const e = we, t = PA, n = gr;
  A.keywordError = {
    message: ({ keyword: F }) => (0, e.str)`must pass "${F}" keyword validation`
  }, A.keyword$DataError = {
    message: ({ keyword: F, schemaType: U }) => U ? (0, e.str)`"${F}" keyword must be ${U} ($data)` : (0, e.str)`"${F}" keyword is invalid ($data)`
  };
  function i(F, U = A.keywordError, S, N) {
    const { it: x } = F, { gen: P, compositeRule: R, allErrors: J } = x, fA = B(F, U, S);
    N ?? (R || J) ? c(P, fA) : h(x, (0, e._)`[${fA}]`);
  }
  A.reportError = i;
  function o(F, U = A.keywordError, S) {
    const { it: N } = F, { gen: x, compositeRule: P, allErrors: R } = N, J = B(F, U, S);
    c(x, J), P || R || h(N, n.default.vErrors);
  }
  A.reportExtraError = o;
  function l(F, U) {
    F.assign(n.default.errors, U), F.if((0, e._)`${n.default.vErrors} !== null`, () => F.if(U, () => F.assign((0, e._)`${n.default.vErrors}.length`, U), () => F.assign(n.default.vErrors, null)));
  }
  A.resetErrorsCount = l;
  function f({ gen: F, keyword: U, schemaValue: S, data: N, errsCount: x, it: P }) {
    if (x === void 0)
      throw new Error("ajv implementation error");
    const R = F.name("err");
    F.forRange("i", x, n.default.errors, (J) => {
      F.const(R, (0, e._)`${n.default.vErrors}[${J}]`), F.if((0, e._)`${R}.instancePath === undefined`, () => F.assign((0, e._)`${R}.instancePath`, (0, e.strConcat)(n.default.instancePath, P.errorPath))), F.assign((0, e._)`${R}.schemaPath`, (0, e.str)`${P.errSchemaPath}/${U}`), P.opts.verbose && (F.assign((0, e._)`${R}.schema`, S), F.assign((0, e._)`${R}.data`, N));
    });
  }
  A.extendErrors = f;
  function c(F, U) {
    const S = F.const("err", U);
    F.if((0, e._)`${n.default.vErrors} === null`, () => F.assign(n.default.vErrors, (0, e._)`[${S}]`), (0, e._)`${n.default.vErrors}.push(${S})`), F.code((0, e._)`${n.default.errors}++`);
  }
  function h(F, U) {
    const { gen: S, validateName: N, schemaEnv: x } = F;
    x.$async ? S.throw((0, e._)`new ${F.ValidationError}(${U})`) : (S.assign((0, e._)`${N}.errors`, U), S.return(!1));
  }
  const m = {
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
    const { createErrors: N } = F.it;
    return N === !1 ? (0, e._)`{}` : g(F, U, S);
  }
  function g(F, U, S = {}) {
    const { gen: N, it: x } = F, P = [
      v(x, S),
      u(F, S)
    ];
    return C(F, U, P), N.object(...P);
  }
  function v({ errorPath: F }, { instancePath: U }) {
    const S = U ? (0, e.str)`${F}${(0, t.getErrorPath)(U, t.Type.Str)}` : F;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, S)];
  }
  function u({ keyword: F, it: { errSchemaPath: U } }, { schemaPath: S, parentSchema: N }) {
    let x = N ? U : (0, e.str)`${U}/${F}`;
    return S && (x = (0, e.str)`${x}${(0, t.getErrorPath)(S, t.Type.Str)}`), [m.schemaPath, x];
  }
  function C(F, { params: U, message: S }, N) {
    const { keyword: x, data: P, schemaValue: R, it: J } = F, { opts: fA, propertyName: uA, topSchemaRef: BA, schemaPath: FA } = J;
    N.push([m.keyword, x], [m.params, typeof U == "function" ? U(F) : U || (0, e._)`{}`]), fA.messages && N.push([m.message, typeof S == "function" ? S(F) : S]), fA.verbose && N.push([m.schema, R], [m.parentSchema, (0, e._)`${BA}${FA}`], [n.default.data, P]), uA && N.push([m.propertyName, uA]);
  }
})(ks);
Object.defineProperty(io, "__esModule", { value: !0 });
io.boolOrEmptySchema = io.topBoolOrEmptySchema = void 0;
const B1 = ks, w1 = we, m1 = gr, v1 = {
  message: "boolean schema is false"
};
function y1(A) {
  const { gen: e, schema: t, validateName: n } = A;
  t === !1 ? cv(A, !1) : typeof t == "object" && t.$async === !0 ? e.return(m1.default.data) : (e.assign((0, w1._)`${n}.errors`, null), e.return(!0));
}
io.topBoolOrEmptySchema = y1;
function C1(A, e) {
  const { gen: t, schema: n } = A;
  n === !1 ? (t.var(e, !1), cv(A)) : t.var(e, !0);
}
io.boolOrEmptySchema = C1;
function cv(A, e) {
  const { gen: t, data: n } = A, i = {
    gen: t,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: A
  };
  (0, B1.reportError)(i, v1, void 0, e);
}
var ht = {}, oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.getRules = oa.isJSONType = void 0;
const Q1 = ["string", "number", "integer", "boolean", "null", "object", "array"], F1 = new Set(Q1);
function U1(A) {
  return typeof A == "string" && F1.has(A);
}
oa.isJSONType = U1;
function E1() {
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
oa.getRules = E1;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.shouldUseRule = kr.shouldUseGroup = kr.schemaHasRulesForType = void 0;
function b1({ schema: A, self: e }, t) {
  const n = e.RULES.types[t];
  return n && n !== !0 && fv(A, n);
}
kr.schemaHasRulesForType = b1;
function fv(A, e) {
  return e.rules.some((t) => hv(A, t));
}
kr.shouldUseGroup = fv;
function hv(A, e) {
  var t;
  return A[e.keyword] !== void 0 || ((t = e.definition.implements) === null || t === void 0 ? void 0 : t.some((n) => A[n] !== void 0));
}
kr.shouldUseRule = hv;
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.reportTypeError = ht.checkDataTypes = ht.checkDataType = ht.coerceAndCheckDataType = ht.getJSONTypes = ht.getSchemaTypes = ht.DataType = void 0;
const _1 = oa, x1 = kr, I1 = ks, de = we, dv = PA;
var Za;
(function(A) {
  A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong";
})(Za || (ht.DataType = Za = {}));
function H1(A) {
  const e = pv(A.type);
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
ht.getSchemaTypes = H1;
function pv(A) {
  const e = Array.isArray(A) ? A : A ? [A] : [];
  if (e.every(_1.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
ht.getJSONTypes = pv;
function S1(A, e) {
  const { gen: t, data: n, opts: i } = A, o = L1(e, i.coerceTypes), l = e.length > 0 && !(o.length === 0 && e.length === 1 && (0, x1.schemaHasRulesForType)(A, e[0]));
  if (l) {
    const f = Gd(e, n, i.strictNumbers, Za.Wrong);
    t.if(f, () => {
      o.length ? T1(A, e, o) : Vd(A);
    });
  }
  return l;
}
ht.coerceAndCheckDataType = S1;
const gv = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function L1(A, e) {
  return e ? A.filter((t) => gv.has(t) || e === "array" && t === "array") : [];
}
function T1(A, e, t) {
  const { gen: n, data: i, opts: o } = A, l = n.let("dataType", (0, de._)`typeof ${i}`), f = n.let("coerced", (0, de._)`undefined`);
  o.coerceTypes === "array" && n.if((0, de._)`${l} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, de._)`${i}[0]`).assign(l, (0, de._)`typeof ${i}`).if(Gd(e, i, o.strictNumbers), () => n.assign(f, i))), n.if((0, de._)`${f} !== undefined`);
  for (const h of t)
    (gv.has(h) || h === "array" && o.coerceTypes === "array") && c(h);
  n.else(), Vd(A), n.endIf(), n.if((0, de._)`${f} !== undefined`, () => {
    n.assign(i, f), D1(A, f);
  });
  function c(h) {
    switch (h) {
      case "string":
        n.elseIf((0, de._)`${l} == "number" || ${l} == "boolean"`).assign(f, (0, de._)`"" + ${i}`).elseIf((0, de._)`${i} === null`).assign(f, (0, de._)`""`);
        return;
      case "number":
        n.elseIf((0, de._)`${l} == "boolean" || ${i} === null
              || (${l} == "string" && ${i} && ${i} == +${i})`).assign(f, (0, de._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, de._)`${l} === "boolean" || ${i} === null
              || (${l} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(f, (0, de._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, de._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(f, !1).elseIf((0, de._)`${i} === "true" || ${i} === 1`).assign(f, !0);
        return;
      case "null":
        n.elseIf((0, de._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(f, null);
        return;
      case "array":
        n.elseIf((0, de._)`${l} === "string" || ${l} === "number"
              || ${l} === "boolean" || ${i} === null`).assign(f, (0, de._)`[${i}]`);
    }
  }
}
function D1({ gen: A, parentData: e, parentDataProperty: t }, n) {
  A.if((0, de._)`${e} !== undefined`, () => A.assign((0, de._)`${e}[${t}]`, n));
}
function zh(A, e, t, n = Za.Correct) {
  const i = n === Za.Correct ? de.operators.EQ : de.operators.NEQ;
  let o;
  switch (A) {
    case "null":
      return (0, de._)`${e} ${i} null`;
    case "array":
      o = (0, de._)`Array.isArray(${e})`;
      break;
    case "object":
      o = (0, de._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      o = l((0, de._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      o = l();
      break;
    default:
      return (0, de._)`typeof ${e} ${i} ${A}`;
  }
  return n === Za.Correct ? o : (0, de.not)(o);
  function l(f = de.nil) {
    return (0, de.and)((0, de._)`typeof ${e} == "number"`, f, t ? (0, de._)`isFinite(${e})` : de.nil);
  }
}
ht.checkDataType = zh;
function Gd(A, e, t, n) {
  if (A.length === 1)
    return zh(A[0], e, t, n);
  let i;
  const o = (0, dv.toHash)(A);
  if (o.array && o.object) {
    const l = (0, de._)`typeof ${e} != "object"`;
    i = o.null ? l : (0, de._)`!${e} || ${l}`, delete o.null, delete o.array, delete o.object;
  } else
    i = de.nil;
  o.number && delete o.integer;
  for (const l in o)
    i = (0, de.and)(i, zh(l, e, t, n));
  return i;
}
ht.checkDataTypes = Gd;
const O1 = {
  message: ({ schema: A }) => `must be ${A}`,
  params: ({ schema: A, schemaValue: e }) => typeof A == "string" ? (0, de._)`{type: ${A}}` : (0, de._)`{type: ${e}}`
};
function Vd(A) {
  const e = N1(A);
  (0, I1.reportError)(e, O1);
}
ht.reportTypeError = Vd;
function N1(A) {
  const { gen: e, data: t, schema: n } = A, i = (0, dv.schemaRefOrVal)(A, n, "type");
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
var Hc = {};
Object.defineProperty(Hc, "__esModule", { value: !0 });
Hc.assignDefaults = void 0;
const Na = we, M1 = PA;
function P1(A, e) {
  const { properties: t, items: n } = A.schema;
  if (e === "object" && t)
    for (const i in t)
      VB(A, i, t[i].default);
  else e === "array" && Array.isArray(n) && n.forEach((i, o) => VB(A, o, i.default));
}
Hc.assignDefaults = P1;
function VB(A, e, t) {
  const { gen: n, compositeRule: i, data: o, opts: l } = A;
  if (t === void 0)
    return;
  const f = (0, Na._)`${o}${(0, Na.getProperty)(e)}`;
  if (i) {
    (0, M1.checkStrictMode)(A, `default is ignored for: ${f}`);
    return;
  }
  let c = (0, Na._)`${f} === undefined`;
  l.useDefaults === "empty" && (c = (0, Na._)`${c} || ${f} === null || ${f} === ""`), n.if(c, (0, Na._)`${f} = ${(0, Na.stringify)(t)}`);
}
var cr = {}, Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.validateUnion = Be.validateArray = Be.usePattern = Be.callValidateCode = Be.schemaProperties = Be.allSchemaProperties = Be.noPropertyInData = Be.propertyInData = Be.isOwnProperty = Be.hasPropFunc = Be.reportMissingProp = Be.checkMissingProp = Be.checkReportMissingProp = void 0;
const ze = we, Wd = PA, di = gr, K1 = PA;
function R1(A, e) {
  const { gen: t, data: n, it: i } = A;
  t.if(qd(t, n, e, i.opts.ownProperties), () => {
    A.setParams({ missingProperty: (0, ze._)`${e}` }, !0), A.error();
  });
}
Be.checkReportMissingProp = R1;
function k1({ gen: A, data: e, it: { opts: t } }, n, i) {
  return (0, ze.or)(...n.map((o) => (0, ze.and)(qd(A, e, o, t.ownProperties), (0, ze._)`${i} = ${o}`)));
}
Be.checkMissingProp = k1;
function $1(A, e) {
  A.setParams({ missingProperty: e }, !0), A.error();
}
Be.reportMissingProp = $1;
function Bv(A) {
  return A.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ze._)`Object.prototype.hasOwnProperty`
  });
}
Be.hasPropFunc = Bv;
function Xd(A, e, t) {
  return (0, ze._)`${Bv(A)}.call(${e}, ${t})`;
}
Be.isOwnProperty = Xd;
function G1(A, e, t, n) {
  const i = (0, ze._)`${e}${(0, ze.getProperty)(t)} !== undefined`;
  return n ? (0, ze._)`${i} && ${Xd(A, e, t)}` : i;
}
Be.propertyInData = G1;
function qd(A, e, t, n) {
  const i = (0, ze._)`${e}${(0, ze.getProperty)(t)} === undefined`;
  return n ? (0, ze.or)(i, (0, ze.not)(Xd(A, e, t))) : i;
}
Be.noPropertyInData = qd;
function wv(A) {
  return A ? Object.keys(A).filter((e) => e !== "__proto__") : [];
}
Be.allSchemaProperties = wv;
function V1(A, e) {
  return wv(e).filter((t) => !(0, Wd.alwaysValidSchema)(A, e[t]));
}
Be.schemaProperties = V1;
function W1({ schemaCode: A, data: e, it: { gen: t, topSchemaRef: n, schemaPath: i, errorPath: o }, it: l }, f, c, h) {
  const m = h ? (0, ze._)`${A}, ${e}, ${n}${i}` : e, B = [
    [di.default.instancePath, (0, ze.strConcat)(di.default.instancePath, o)],
    [di.default.parentData, l.parentData],
    [di.default.parentDataProperty, l.parentDataProperty],
    [di.default.rootData, di.default.rootData]
  ];
  l.opts.dynamicRef && B.push([di.default.dynamicAnchors, di.default.dynamicAnchors]);
  const g = (0, ze._)`${m}, ${t.object(...B)}`;
  return c !== ze.nil ? (0, ze._)`${f}.call(${c}, ${g})` : (0, ze._)`${f}(${g})`;
}
Be.callValidateCode = W1;
const X1 = (0, ze._)`new RegExp`;
function q1({ gen: A, it: { opts: e } }, t) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: i } = e.code, o = i(t, n);
  return A.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, ze._)`${i.code === "new RegExp" ? X1 : (0, K1.useFunc)(A, i)}(${t}, ${n})`
  });
}
Be.usePattern = q1;
function z1(A) {
  const { gen: e, data: t, keyword: n, it: i } = A, o = e.name("valid");
  if (i.allErrors) {
    const f = e.let("valid", !0);
    return l(() => e.assign(f, !1)), f;
  }
  return e.var(o, !0), l(() => e.break()), o;
  function l(f) {
    const c = e.const("len", (0, ze._)`${t}.length`);
    e.forRange("i", 0, c, (h) => {
      A.subschema({
        keyword: n,
        dataProp: h,
        dataPropType: Wd.Type.Num
      }, o), e.if((0, ze.not)(o), f);
    });
  }
}
Be.validateArray = z1;
function J1(A) {
  const { gen: e, schema: t, keyword: n, it: i } = A;
  if (!Array.isArray(t))
    throw new Error("ajv implementation error");
  if (t.some((c) => (0, Wd.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const l = e.let("valid", !1), f = e.name("_valid");
  e.block(() => t.forEach((c, h) => {
    const m = A.subschema({
      keyword: n,
      schemaProp: h,
      compositeRule: !0
    }, f);
    e.assign(l, (0, ze._)`${l} || ${f}`), A.mergeValidEvaluated(m, f) || e.if((0, ze.not)(l));
  })), A.result(l, () => A.reset(), () => A.error(!0));
}
Be.validateUnion = J1;
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.validateKeywordUsage = cr.validSchemaType = cr.funcKeywordCode = cr.macroKeywordCode = void 0;
const Wt = we, ji = gr, j1 = Be, Y1 = ks;
function Z1(A, e) {
  const { gen: t, keyword: n, schema: i, parentSchema: o, it: l } = A, f = e.macro.call(l.self, i, o, l), c = mv(t, n, f);
  l.opts.validateSchema !== !1 && l.self.validateSchema(f, !0);
  const h = t.name("valid");
  A.subschema({
    schema: f,
    schemaPath: Wt.nil,
    errSchemaPath: `${l.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, h), A.pass(h, () => A.error(!0));
}
cr.macroKeywordCode = Z1;
function A_(A, e) {
  var t;
  const { gen: n, keyword: i, schema: o, parentSchema: l, $data: f, it: c } = A;
  t_(c, e);
  const h = !f && e.compile ? e.compile.call(c.self, o, l, c) : e.validate, m = mv(n, i, h), B = n.let("valid");
  A.block$data(B, g), A.ok((t = e.valid) !== null && t !== void 0 ? t : B);
  function g() {
    if (e.errors === !1)
      C(), e.modifying && WB(A), F(() => A.error());
    else {
      const U = e.async ? v() : u();
      e.modifying && WB(A), F(() => e_(A, U));
    }
  }
  function v() {
    const U = n.let("ruleErrs", null);
    return n.try(() => C((0, Wt._)`await `), (S) => n.assign(B, !1).if((0, Wt._)`${S} instanceof ${c.ValidationError}`, () => n.assign(U, (0, Wt._)`${S}.errors`), () => n.throw(S))), U;
  }
  function u() {
    const U = (0, Wt._)`${m}.errors`;
    return n.assign(U, null), C(Wt.nil), U;
  }
  function C(U = e.async ? (0, Wt._)`await ` : Wt.nil) {
    const S = c.opts.passContext ? ji.default.this : ji.default.self, N = !("compile" in e && !f || e.schema === !1);
    n.assign(B, (0, Wt._)`${U}${(0, j1.callValidateCode)(A, m, S, N)}`, e.modifying);
  }
  function F(U) {
    var S;
    n.if((0, Wt.not)((S = e.valid) !== null && S !== void 0 ? S : B), U);
  }
}
cr.funcKeywordCode = A_;
function WB(A) {
  const { gen: e, data: t, it: n } = A;
  e.if(n.parentData, () => e.assign(t, (0, Wt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function e_(A, e) {
  const { gen: t } = A;
  t.if((0, Wt._)`Array.isArray(${e})`, () => {
    t.assign(ji.default.vErrors, (0, Wt._)`${ji.default.vErrors} === null ? ${e} : ${ji.default.vErrors}.concat(${e})`).assign(ji.default.errors, (0, Wt._)`${ji.default.vErrors}.length`), (0, Y1.extendErrors)(A);
  }, () => A.error());
}
function t_({ schemaEnv: A }, e) {
  if (e.async && !A.$async)
    throw new Error("async keyword in sync schema");
}
function mv(A, e, t) {
  if (t === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return A.scopeValue("keyword", typeof t == "function" ? { ref: t } : { ref: t, code: (0, Wt.stringify)(t) });
}
function n_(A, e, t = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(A) : n === "object" ? A && typeof A == "object" && !Array.isArray(A) : typeof A == n || t && typeof A > "u");
}
cr.validSchemaType = n_;
function r_({ schema: A, opts: e, self: t, errSchemaPath: n }, i, o) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(o) : i.keyword !== o)
    throw new Error("ajv implementation error");
  const l = i.dependencies;
  if (l != null && l.some((f) => !Object.prototype.hasOwnProperty.call(A, f)))
    throw new Error(`parent schema must have dependencies of ${o}: ${l.join(",")}`);
  if (i.validateSchema && !i.validateSchema(A[o])) {
    const c = `keyword "${o}" value is invalid at path "${n}": ` + t.errorsText(i.validateSchema.errors);
    if (e.validateSchema === "log")
      t.logger.error(c);
    else
      throw new Error(c);
  }
}
cr.validateKeywordUsage = r_;
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.extendSubschemaMode = Fi.extendSubschemaData = Fi.getSubschema = void 0;
const lr = we, vv = PA;
function i_(A, { keyword: e, schemaProp: t, schema: n, schemaPath: i, errSchemaPath: o, topSchemaRef: l }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const f = A.schema[e];
    return t === void 0 ? {
      schema: f,
      schemaPath: (0, lr._)`${A.schemaPath}${(0, lr.getProperty)(e)}`,
      errSchemaPath: `${A.errSchemaPath}/${e}`
    } : {
      schema: f[t],
      schemaPath: (0, lr._)`${A.schemaPath}${(0, lr.getProperty)(e)}${(0, lr.getProperty)(t)}`,
      errSchemaPath: `${A.errSchemaPath}/${e}/${(0, vv.escapeFragment)(t)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || o === void 0 || l === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: l,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Fi.getSubschema = i_;
function a_(A, e, { dataProp: t, dataPropType: n, data: i, dataTypes: o, propertyName: l }) {
  if (i !== void 0 && t !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: f } = e;
  if (t !== void 0) {
    const { errorPath: h, dataPathArr: m, opts: B } = e, g = f.let("data", (0, lr._)`${e.data}${(0, lr.getProperty)(t)}`, !0);
    c(g), A.errorPath = (0, lr.str)`${h}${(0, vv.getErrorPath)(t, n, B.jsPropertySyntax)}`, A.parentDataProperty = (0, lr._)`${t}`, A.dataPathArr = [...m, A.parentDataProperty];
  }
  if (i !== void 0) {
    const h = i instanceof lr.Name ? i : f.let("data", i, !0);
    c(h), l !== void 0 && (A.propertyName = l);
  }
  o && (A.dataTypes = o);
  function c(h) {
    A.data = h, A.dataLevel = e.dataLevel + 1, A.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), A.parentData = e.data, A.dataNames = [...e.dataNames, h];
  }
}
Fi.extendSubschemaData = a_;
function o_(A, { jtdDiscriminator: e, jtdMetadata: t, compositeRule: n, createErrors: i, allErrors: o }) {
  n !== void 0 && (A.compositeRule = n), i !== void 0 && (A.createErrors = i), o !== void 0 && (A.allErrors = o), A.jtdDiscriminator = e, A.jtdMetadata = t;
}
Fi.extendSubschemaMode = o_;
var Ut = {}, yv = function A(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var n, i, o;
    if (Array.isArray(e)) {
      if (n = e.length, n != t.length) return !1;
      for (i = n; i-- !== 0; )
        if (!A(e[i], t[i])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === t.toString();
    if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length) return !1;
    for (i = n; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, o[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var l = o[i];
      if (!A(e[l], t[l])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}, Cv = { exports: {} }, vi = Cv.exports = function(A, e, t) {
  typeof e == "function" && (t = e, e = {}), t = e.cb || t;
  var n = typeof t == "function" ? t : t.pre || function() {
  }, i = t.post || function() {
  };
  Rl(e, n, i, A, "", A);
};
vi.keywords = {
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
vi.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
vi.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
vi.skipKeywords = {
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
function Rl(A, e, t, n, i, o, l, f, c, h) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, i, o, l, f, c, h);
    for (var m in n) {
      var B = n[m];
      if (Array.isArray(B)) {
        if (m in vi.arrayKeywords)
          for (var g = 0; g < B.length; g++)
            Rl(A, e, t, B[g], i + "/" + m + "/" + g, o, i, m, n, g);
      } else if (m in vi.propsKeywords) {
        if (B && typeof B == "object")
          for (var v in B)
            Rl(A, e, t, B[v], i + "/" + m + "/" + s_(v), o, i, m, n, v);
      } else (m in vi.keywords || A.allKeys && !(m in vi.skipKeywords)) && Rl(A, e, t, B, i + "/" + m, o, i, m, n);
    }
    t(n, i, o, l, f, c, h);
  }
}
function s_(A) {
  return A.replace(/~/g, "~0").replace(/\//g, "~1");
}
var u_ = Cv.exports;
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.getSchemaRefs = Ut.resolveUrl = Ut.normalizeId = Ut._getFullPath = Ut.getFullPath = Ut.inlineRef = void 0;
const l_ = PA, c_ = yv, f_ = u_, h_ = /* @__PURE__ */ new Set([
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
function d_(A, e = !0) {
  return typeof A == "boolean" ? !0 : e === !0 ? !Jh(A) : e ? Qv(A) <= e : !1;
}
Ut.inlineRef = d_;
const p_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Jh(A) {
  for (const e in A) {
    if (p_.has(e))
      return !0;
    const t = A[e];
    if (Array.isArray(t) && t.some(Jh) || typeof t == "object" && Jh(t))
      return !0;
  }
  return !1;
}
function Qv(A) {
  let e = 0;
  for (const t in A) {
    if (t === "$ref")
      return 1 / 0;
    if (e++, !h_.has(t) && (typeof A[t] == "object" && (0, l_.eachItem)(A[t], (n) => e += Qv(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function Fv(A, e = "", t) {
  t !== !1 && (e = Ao(e));
  const n = A.parse(e);
  return Uv(A, n);
}
Ut.getFullPath = Fv;
function Uv(A, e) {
  return A.serialize(e).split("#")[0] + "#";
}
Ut._getFullPath = Uv;
const g_ = /#\/?$/;
function Ao(A) {
  return A ? A.replace(g_, "") : "";
}
Ut.normalizeId = Ao;
function B_(A, e, t) {
  return t = Ao(t), A.resolve(e, t);
}
Ut.resolveUrl = B_;
const w_ = /^[a-z_][-a-z0-9._]*$/i;
function m_(A, e) {
  if (typeof A == "boolean")
    return {};
  const { schemaId: t, uriResolver: n } = this.opts, i = Ao(A[t] || e), o = { "": i }, l = Fv(n, i, !1), f = {}, c = /* @__PURE__ */ new Set();
  return f_(A, { allKeys: !0 }, (B, g, v, u) => {
    if (u === void 0)
      return;
    const C = l + g;
    let F = o[u];
    typeof B[t] == "string" && (F = U.call(this, B[t])), S.call(this, B.$anchor), S.call(this, B.$dynamicAnchor), o[g] = F;
    function U(N) {
      const x = this.opts.uriResolver.resolve;
      if (N = Ao(F ? x(F, N) : N), c.has(N))
        throw m(N);
      c.add(N);
      let P = this.refs[N];
      return typeof P == "string" && (P = this.refs[P]), typeof P == "object" ? h(B, P.schema, N) : N !== Ao(C) && (N[0] === "#" ? (h(B, f[N], N), f[N] = B) : this.refs[N] = C), N;
    }
    function S(N) {
      if (typeof N == "string") {
        if (!w_.test(N))
          throw new Error(`invalid anchor "${N}"`);
        U.call(this, `#${N}`);
      }
    }
  }), f;
  function h(B, g, v) {
    if (g !== void 0 && !c_(B, g))
      throw m(v);
  }
  function m(B) {
    return new Error(`reference "${B}" resolves to more than one schema`);
  }
}
Ut.getSchemaRefs = m_;
Object.defineProperty(zn, "__esModule", { value: !0 });
zn.getData = zn.KeywordCxt = zn.validateFunctionCode = void 0;
const Ev = io, XB = ht, zd = kr, tc = ht, v_ = Hc, Bs = cr, ch = Fi, $A = we, se = gr, y_ = Ut, $r = PA, jo = ks;
function C_(A) {
  if (xv(A) && (Iv(A), _v(A))) {
    U_(A);
    return;
  }
  bv(A, () => (0, Ev.topBoolOrEmptySchema)(A));
}
zn.validateFunctionCode = C_;
function bv({ gen: A, validateName: e, schema: t, schemaEnv: n, opts: i }, o) {
  i.code.es5 ? A.func(e, (0, $A._)`${se.default.data}, ${se.default.valCxt}`, n.$async, () => {
    A.code((0, $A._)`"use strict"; ${qB(t, i)}`), F_(A, i), A.code(o);
  }) : A.func(e, (0, $A._)`${se.default.data}, ${Q_(i)}`, n.$async, () => A.code(qB(t, i)).code(o));
}
function Q_(A) {
  return (0, $A._)`{${se.default.instancePath}="", ${se.default.parentData}, ${se.default.parentDataProperty}, ${se.default.rootData}=${se.default.data}${A.dynamicRef ? (0, $A._)`, ${se.default.dynamicAnchors}={}` : $A.nil}}={}`;
}
function F_(A, e) {
  A.if(se.default.valCxt, () => {
    A.var(se.default.instancePath, (0, $A._)`${se.default.valCxt}.${se.default.instancePath}`), A.var(se.default.parentData, (0, $A._)`${se.default.valCxt}.${se.default.parentData}`), A.var(se.default.parentDataProperty, (0, $A._)`${se.default.valCxt}.${se.default.parentDataProperty}`), A.var(se.default.rootData, (0, $A._)`${se.default.valCxt}.${se.default.rootData}`), e.dynamicRef && A.var(se.default.dynamicAnchors, (0, $A._)`${se.default.valCxt}.${se.default.dynamicAnchors}`);
  }, () => {
    A.var(se.default.instancePath, (0, $A._)`""`), A.var(se.default.parentData, (0, $A._)`undefined`), A.var(se.default.parentDataProperty, (0, $A._)`undefined`), A.var(se.default.rootData, se.default.data), e.dynamicRef && A.var(se.default.dynamicAnchors, (0, $A._)`{}`);
  });
}
function U_(A) {
  const { schema: e, opts: t, gen: n } = A;
  bv(A, () => {
    t.$comment && e.$comment && Sv(A), I_(A), n.let(se.default.vErrors, null), n.let(se.default.errors, 0), t.unevaluated && E_(A), Hv(A), L_(A);
  });
}
function E_(A) {
  const { gen: e, validateName: t } = A;
  A.evaluated = e.const("evaluated", (0, $A._)`${t}.evaluated`), e.if((0, $A._)`${A.evaluated}.dynamicProps`, () => e.assign((0, $A._)`${A.evaluated}.props`, (0, $A._)`undefined`)), e.if((0, $A._)`${A.evaluated}.dynamicItems`, () => e.assign((0, $A._)`${A.evaluated}.items`, (0, $A._)`undefined`));
}
function qB(A, e) {
  const t = typeof A == "object" && A[e.schemaId];
  return t && (e.code.source || e.code.process) ? (0, $A._)`/*# sourceURL=${t} */` : $A.nil;
}
function b_(A, e) {
  if (xv(A) && (Iv(A), _v(A))) {
    __(A, e);
    return;
  }
  (0, Ev.boolOrEmptySchema)(A, e);
}
function _v({ schema: A, self: e }) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e.RULES.all[t])
      return !0;
  return !1;
}
function xv(A) {
  return typeof A.schema != "boolean";
}
function __(A, e) {
  const { schema: t, gen: n, opts: i } = A;
  i.$comment && t.$comment && Sv(A), H_(A), S_(A);
  const o = n.const("_errs", se.default.errors);
  Hv(A, o), n.var(e, (0, $A._)`${o} === ${se.default.errors}`);
}
function Iv(A) {
  (0, $r.checkUnknownRules)(A), x_(A);
}
function Hv(A, e) {
  if (A.opts.jtd)
    return zB(A, [], !1, e);
  const t = (0, XB.getSchemaTypes)(A.schema), n = (0, XB.coerceAndCheckDataType)(A, t);
  zB(A, t, !n, e);
}
function x_(A) {
  const { schema: e, errSchemaPath: t, opts: n, self: i } = A;
  e.$ref && n.ignoreKeywordsWithRef && (0, $r.schemaHasRulesButRef)(e, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${t}"`);
}
function I_(A) {
  const { schema: e, opts: t } = A;
  e.default !== void 0 && t.useDefaults && t.strictSchema && (0, $r.checkStrictMode)(A, "default is ignored in the schema root");
}
function H_(A) {
  const e = A.schema[A.opts.schemaId];
  e && (A.baseId = (0, y_.resolveUrl)(A.opts.uriResolver, A.baseId, e));
}
function S_(A) {
  if (A.schema.$async && !A.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Sv({ gen: A, schemaEnv: e, schema: t, errSchemaPath: n, opts: i }) {
  const o = t.$comment;
  if (i.$comment === !0)
    A.code((0, $A._)`${se.default.self}.logger.log(${o})`);
  else if (typeof i.$comment == "function") {
    const l = (0, $A.str)`${n}/$comment`, f = A.scopeValue("root", { ref: e.root });
    A.code((0, $A._)`${se.default.self}.opts.$comment(${o}, ${l}, ${f}.schema)`);
  }
}
function L_(A) {
  const { gen: e, schemaEnv: t, validateName: n, ValidationError: i, opts: o } = A;
  t.$async ? e.if((0, $A._)`${se.default.errors} === 0`, () => e.return(se.default.data), () => e.throw((0, $A._)`new ${i}(${se.default.vErrors})`)) : (e.assign((0, $A._)`${n}.errors`, se.default.vErrors), o.unevaluated && T_(A), e.return((0, $A._)`${se.default.errors} === 0`));
}
function T_({ gen: A, evaluated: e, props: t, items: n }) {
  t instanceof $A.Name && A.assign((0, $A._)`${e}.props`, t), n instanceof $A.Name && A.assign((0, $A._)`${e}.items`, n);
}
function zB(A, e, t, n) {
  const { gen: i, schema: o, data: l, allErrors: f, opts: c, self: h } = A, { RULES: m } = h;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, $r.schemaHasRulesButRef)(o, m))) {
    i.block(() => Dv(A, "$ref", m.all.$ref.definition));
    return;
  }
  c.jtd || D_(A, e), i.block(() => {
    for (const g of m.rules)
      B(g);
    B(m.post);
  });
  function B(g) {
    (0, zd.shouldUseGroup)(o, g) && (g.type ? (i.if((0, tc.checkDataType)(g.type, l, c.strictNumbers)), JB(A, g), e.length === 1 && e[0] === g.type && t && (i.else(), (0, tc.reportTypeError)(A)), i.endIf()) : JB(A, g), f || i.if((0, $A._)`${se.default.errors} === ${n || 0}`));
  }
}
function JB(A, e) {
  const { gen: t, schema: n, opts: { useDefaults: i } } = A;
  i && (0, v_.assignDefaults)(A, e.type), t.block(() => {
    for (const o of e.rules)
      (0, zd.shouldUseRule)(n, o) && Dv(A, o.keyword, o.definition, e.type);
  });
}
function D_(A, e) {
  A.schemaEnv.meta || !A.opts.strictTypes || (O_(A, e), A.opts.allowUnionTypes || N_(A, e), M_(A, A.dataTypes));
}
function O_(A, e) {
  if (e.length) {
    if (!A.dataTypes.length) {
      A.dataTypes = e;
      return;
    }
    e.forEach((t) => {
      Lv(A.dataTypes, t) || Jd(A, `type "${t}" not allowed by context "${A.dataTypes.join(",")}"`);
    }), K_(A, e);
  }
}
function N_(A, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && Jd(A, "use allowUnionTypes to allow union type keyword");
}
function M_(A, e) {
  const t = A.self.RULES.all;
  for (const n in t) {
    const i = t[n];
    if (typeof i == "object" && (0, zd.shouldUseRule)(A.schema, i)) {
      const { type: o } = i.definition;
      o.length && !o.some((l) => P_(e, l)) && Jd(A, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function P_(A, e) {
  return A.includes(e) || e === "number" && A.includes("integer");
}
function Lv(A, e) {
  return A.includes(e) || e === "integer" && A.includes("number");
}
function K_(A, e) {
  const t = [];
  for (const n of A.dataTypes)
    Lv(e, n) ? t.push(n) : e.includes("integer") && n === "number" && t.push("integer");
  A.dataTypes = t;
}
function Jd(A, e) {
  const t = A.schemaEnv.baseId + A.errSchemaPath;
  e += ` at "${t}" (strictTypes)`, (0, $r.checkStrictMode)(A, e, A.opts.strictTypes);
}
class Tv {
  constructor(e, t, n) {
    if ((0, Bs.validateKeywordUsage)(e, t, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, $r.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = t.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = t, this.$data)
      this.schemaCode = e.gen.const("vSchema", Ov(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, Bs.validSchemaType)(this.schema, t.schemaType, t.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);
    ("code" in t ? t.trackErrors : t.errors !== !1) && (this.errsCount = e.gen.const("_errs", se.default.errors));
  }
  result(e, t, n) {
    this.failResult((0, $A.not)(e), t, n);
  }
  failResult(e, t, n) {
    this.gen.if(e), n ? n() : this.error(), t ? (this.gen.else(), t(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(e, t) {
    this.failResult((0, $A.not)(e), void 0, t);
  }
  fail(e) {
    if (e === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(e) {
    if (!this.$data)
      return this.fail(e);
    const { schemaCode: t } = this;
    this.fail((0, $A._)`${t} !== undefined && (${(0, $A.or)(this.invalid$data(), e)})`);
  }
  error(e, t, n) {
    if (t) {
      this.setParams(t), this._error(e, n), this.setParams({});
      return;
    }
    this._error(e, n);
  }
  _error(e, t) {
    (e ? jo.reportExtraError : jo.reportError)(this, this.def.error, t);
  }
  $dataError() {
    (0, jo.reportError)(this, this.def.$dataError || jo.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, jo.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(e) {
    this.allErrors || this.gen.if(e);
  }
  setParams(e, t) {
    t ? Object.assign(this.params, e) : this.params = e;
  }
  block$data(e, t, n = $A.nil) {
    this.gen.block(() => {
      this.check$data(e, n), t();
    });
  }
  check$data(e = $A.nil, t = $A.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: o, def: l } = this;
    n.if((0, $A.or)((0, $A._)`${i} === undefined`, t)), e !== $A.nil && n.assign(e, !0), (o.length || l.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== $A.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: t, schemaType: n, def: i, it: o } = this;
    return (0, $A.or)(l(), f());
    function l() {
      if (n.length) {
        if (!(t instanceof $A.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, $A._)`${(0, tc.checkDataTypes)(c, t, o.opts.strictNumbers, tc.DataType.Wrong)}`;
      }
      return $A.nil;
    }
    function f() {
      if (i.validateSchema) {
        const c = e.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, $A._)`!${c}(${t})`;
      }
      return $A.nil;
    }
  }
  subschema(e, t) {
    const n = (0, ch.getSubschema)(this.it, e);
    (0, ch.extendSubschemaData)(n, this.it, e), (0, ch.extendSubschemaMode)(n, e);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return b_(i, t), i;
  }
  mergeEvaluated(e, t) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = $r.mergeEvaluated.props(i, e.props, n.props, t)), n.items !== !0 && e.items !== void 0 && (n.items = $r.mergeEvaluated.items(i, e.items, n.items, t)));
  }
  mergeValidEvaluated(e, t) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(t, () => this.mergeEvaluated(e, $A.Name)), !0;
  }
}
zn.KeywordCxt = Tv;
function Dv(A, e, t, n) {
  const i = new Tv(A, t, e);
  "code" in t ? t.code(i, n) : i.$data && t.validate ? (0, Bs.funcKeywordCode)(i, t) : "macro" in t ? (0, Bs.macroKeywordCode)(i, t) : (t.compile || t.validate) && (0, Bs.funcKeywordCode)(i, t);
}
const R_ = /^\/(?:[^~]|~0|~1)*$/, k_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ov(A, { dataLevel: e, dataNames: t, dataPathArr: n }) {
  let i, o;
  if (A === "")
    return se.default.rootData;
  if (A[0] === "/") {
    if (!R_.test(A))
      throw new Error(`Invalid JSON-pointer: ${A}`);
    i = A, o = se.default.rootData;
  } else {
    const h = k_.exec(A);
    if (!h)
      throw new Error(`Invalid JSON-pointer: ${A}`);
    const m = +h[1];
    if (i = h[2], i === "#") {
      if (m >= e)
        throw new Error(c("property/index", m));
      return n[e - m];
    }
    if (m > e)
      throw new Error(c("data", m));
    if (o = t[e - m], !i)
      return o;
  }
  let l = o;
  const f = i.split("/");
  for (const h of f)
    h && (o = (0, $A._)`${o}${(0, $A.getProperty)((0, $r.unescapeJsonPointer)(h))}`, l = (0, $A._)`${l} && ${o}`);
  return l;
  function c(h, m) {
    return `Cannot access ${h} ${m} levels up, current level is ${e}`;
  }
}
zn.getData = Ov;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
class $_ extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
$s.default = $_;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const fh = Ut;
class G_ extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`), this.missingRef = (0, fh.resolveUrl)(e, t, n), this.missingSchema = (0, fh.normalizeId)((0, fh.getFullPath)(e, this.missingRef));
  }
}
go.default = G_;
var en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.resolveSchema = en.getCompilingSchema = en.resolveRef = en.compileSchema = en.SchemaEnv = void 0;
const kn = we, V_ = $s, Xi = gr, Xn = Ut, jB = PA, W_ = zn;
class Sc {
  constructor(e) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (t = e.baseId) !== null && t !== void 0 ? t : (0, Xn.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
en.SchemaEnv = Sc;
function jd(A) {
  const e = Nv.call(this, A);
  if (e)
    return e;
  const t = (0, Xn.getFullPath)(this.opts.uriResolver, A.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: o } = this.opts, l = new kn.CodeGen(this.scope, { es5: n, lines: i, ownProperties: o });
  let f;
  A.$async && (f = l.scopeValue("Error", {
    ref: V_.default,
    code: (0, kn._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = l.scopeName("validate");
  A.validateName = c;
  const h = {
    gen: l,
    allErrors: this.opts.allErrors,
    data: Xi.default.data,
    parentData: Xi.default.parentData,
    parentDataProperty: Xi.default.parentDataProperty,
    dataNames: [Xi.default.data],
    dataPathArr: [kn.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: l.scopeValue("schema", this.opts.code.source === !0 ? { ref: A.schema, code: (0, kn.stringify)(A.schema) } : { ref: A.schema }),
    validateName: c,
    ValidationError: f,
    schema: A.schema,
    schemaEnv: A,
    rootId: t,
    baseId: A.baseId || t,
    schemaPath: kn.nil,
    errSchemaPath: A.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, kn._)`""`,
    opts: this.opts,
    self: this
  };
  let m;
  try {
    this._compilations.add(A), (0, W_.validateFunctionCode)(h), l.optimize(this.opts.code.optimize);
    const B = l.toString();
    m = `${l.scopeRefs(Xi.default.scope)}return ${B}`, this.opts.code.process && (m = this.opts.code.process(m, A));
    const v = new Function(`${Xi.default.self}`, `${Xi.default.scope}`, m)(this, this.scope.get());
    if (this.scope.value(c, { ref: v }), v.errors = null, v.schema = A.schema, v.schemaEnv = A, A.$async && (v.$async = !0), this.opts.code.source === !0 && (v.source = { validateName: c, validateCode: B, scopeValues: l._values }), this.opts.unevaluated) {
      const { props: u, items: C } = h;
      v.evaluated = {
        props: u instanceof kn.Name ? void 0 : u,
        items: C instanceof kn.Name ? void 0 : C,
        dynamicProps: u instanceof kn.Name,
        dynamicItems: C instanceof kn.Name
      }, v.source && (v.source.evaluated = (0, kn.stringify)(v.evaluated));
    }
    return A.validate = v, A;
  } catch (B) {
    throw delete A.validate, delete A.validateName, m && this.logger.error("Error compiling schema, function code:", m), B;
  } finally {
    this._compilations.delete(A);
  }
}
en.compileSchema = jd;
function X_(A, e, t) {
  var n;
  t = (0, Xn.resolveUrl)(this.opts.uriResolver, e, t);
  const i = A.refs[t];
  if (i)
    return i;
  let o = J_.call(this, A, t);
  if (o === void 0) {
    const l = (n = A.localRefs) === null || n === void 0 ? void 0 : n[t], { schemaId: f } = this.opts;
    l && (o = new Sc({ schema: l, schemaId: f, root: A, baseId: e }));
  }
  if (o !== void 0)
    return A.refs[t] = q_.call(this, o);
}
en.resolveRef = X_;
function q_(A) {
  return (0, Xn.inlineRef)(A.schema, this.opts.inlineRefs) ? A.schema : A.validate ? A : jd.call(this, A);
}
function Nv(A) {
  for (const e of this._compilations)
    if (z_(e, A))
      return e;
}
en.getCompilingSchema = Nv;
function z_(A, e) {
  return A.schema === e.schema && A.root === e.root && A.baseId === e.baseId;
}
function J_(A, e) {
  let t;
  for (; typeof (t = this.refs[e]) == "string"; )
    e = t;
  return t || this.schemas[e] || Lc.call(this, A, e);
}
function Lc(A, e) {
  const t = this.opts.uriResolver.parse(e), n = (0, Xn._getFullPath)(this.opts.uriResolver, t);
  let i = (0, Xn.getFullPath)(this.opts.uriResolver, A.baseId, void 0);
  if (Object.keys(A.schema).length > 0 && n === i)
    return hh.call(this, t, A);
  const o = (0, Xn.normalizeId)(n), l = this.refs[o] || this.schemas[o];
  if (typeof l == "string") {
    const f = Lc.call(this, A, l);
    return typeof (f == null ? void 0 : f.schema) != "object" ? void 0 : hh.call(this, t, f);
  }
  if (typeof (l == null ? void 0 : l.schema) == "object") {
    if (l.validate || jd.call(this, l), o === (0, Xn.normalizeId)(e)) {
      const { schema: f } = l, { schemaId: c } = this.opts, h = f[c];
      return h && (i = (0, Xn.resolveUrl)(this.opts.uriResolver, i, h)), new Sc({ schema: f, schemaId: c, root: A, baseId: i });
    }
    return hh.call(this, t, l);
  }
}
en.resolveSchema = Lc;
const j_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function hh(A, { baseId: e, schema: t, root: n }) {
  var i;
  if (((i = A.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const f of A.fragment.slice(1).split("/")) {
    if (typeof t == "boolean")
      return;
    const c = t[(0, jB.unescapeFragment)(f)];
    if (c === void 0)
      return;
    t = c;
    const h = typeof t == "object" && t[this.opts.schemaId];
    !j_.has(f) && h && (e = (0, Xn.resolveUrl)(this.opts.uriResolver, e, h));
  }
  let o;
  if (typeof t != "boolean" && t.$ref && !(0, jB.schemaHasRulesButRef)(t, this.RULES)) {
    const f = (0, Xn.resolveUrl)(this.opts.uriResolver, e, t.$ref);
    o = Lc.call(this, n, f);
  }
  const { schemaId: l } = this.opts;
  if (o = o || new Sc({ schema: t, schemaId: l, root: n, baseId: e }), o.schema !== o.root.schema)
    return o;
}
const Y_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Z_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Ax = "object", ex = [
  "$data"
], tx = {
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
}, nx = !1, rx = {
  $id: Y_,
  description: Z_,
  type: Ax,
  required: ex,
  properties: tx,
  additionalProperties: nx
};
var Yd = {}, Tc = { exports: {} };
const ix = {
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
var ax = {
  HEX: ix
};
const { HEX: ox } = ax;
function Mv(A) {
  if (Kv(A, ".") < 3)
    return { host: A, isIPV4: !1 };
  const e = A.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u) || [], [t] = e;
  return t ? { host: ux(t, "."), isIPV4: !0 } : { host: A, isIPV4: !1 };
}
function jh(A, e = !1) {
  let t = "", n = !0;
  for (const i of A) {
    if (ox[i] === void 0) return;
    i !== "0" && n === !0 && (n = !1), n || (t += i);
  }
  return e && t.length === 0 && (t = "0"), t;
}
function sx(A) {
  let e = 0;
  const t = { error: !1, address: "", zone: "" }, n = [], i = [];
  let o = !1, l = !1, f = !1;
  function c() {
    if (i.length) {
      if (o === !1) {
        const h = jh(i);
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
    const m = A[h];
    if (!(m === "[" || m === "]"))
      if (m === ":") {
        if (l === !0 && (f = !0), !c())
          break;
        if (e++, n.push(":"), e > 7) {
          t.error = !0;
          break;
        }
        h - 1 >= 0 && A[h - 1] === ":" && (l = !0);
        continue;
      } else if (m === "%") {
        if (!c())
          break;
        o = !0;
      } else {
        i.push(m);
        continue;
      }
  }
  return i.length && (o ? t.zone = i.join("") : f ? n.push(i.join("")) : n.push(jh(i))), t.address = n.join(""), t;
}
function Pv(A, e = {}) {
  if (Kv(A, ":") < 2)
    return { host: A, isIPV6: !1 };
  const t = sx(A);
  if (t.error)
    return { host: A, isIPV6: !1 };
  {
    let n = t.address, i = t.address;
    return t.zone && (n += "%" + t.zone, i += "%25" + t.zone), { host: n, escapedHost: i, isIPV6: !0 };
  }
}
function ux(A, e) {
  let t = "", n = !0;
  const i = A.length;
  for (let o = 0; o < i; o++) {
    const l = A[o];
    l === "0" && n ? (o + 1 <= i && A[o + 1] === e || o + 1 === i) && (t += l, n = !1) : (l === e ? n = !0 : n = !1, t += l);
  }
  return t;
}
function Kv(A, e) {
  let t = 0;
  for (let n = 0; n < A.length; n++)
    A[n] === e && t++;
  return t;
}
const YB = /^\.\.?\//u, ZB = /^\/\.(?:\/|$)/u, Aw = /^\/\.\.(?:\/|$)/u, lx = /^\/?(?:.|\n)*?(?=\/|$)/u;
function cx(A) {
  const e = [];
  for (; A.length; )
    if (A.match(YB))
      A = A.replace(YB, "");
    else if (A.match(ZB))
      A = A.replace(ZB, "/");
    else if (A.match(Aw))
      A = A.replace(Aw, "/"), e.pop();
    else if (A === "." || A === "..")
      A = "";
    else {
      const t = A.match(lx);
      if (t) {
        const n = t[0];
        A = A.slice(n.length), e.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return e.join("");
}
function fx(A, e) {
  const t = e !== !0 ? escape : unescape;
  return A.scheme !== void 0 && (A.scheme = t(A.scheme)), A.userinfo !== void 0 && (A.userinfo = t(A.userinfo)), A.host !== void 0 && (A.host = t(A.host)), A.path !== void 0 && (A.path = t(A.path)), A.query !== void 0 && (A.query = t(A.query)), A.fragment !== void 0 && (A.fragment = t(A.fragment)), A;
}
function hx(A, e) {
  const t = [];
  if (A.userinfo !== void 0 && (t.push(A.userinfo), t.push("@")), A.host !== void 0) {
    let n = unescape(A.host);
    const i = Mv(n);
    if (i.isIPV4)
      n = i.host;
    else {
      const o = Pv(i.host, { isIPV4: !1 });
      o.isIPV6 === !0 ? n = `[${o.escapedHost}]` : n = A.host;
    }
    t.push(n);
  }
  return (typeof A.port == "number" || typeof A.port == "string") && (t.push(":"), t.push(String(A.port))), t.length ? t.join("") : void 0;
}
var dx = {
  recomposeAuthority: hx,
  normalizeComponentEncoding: fx,
  removeDotSegments: cx,
  normalizeIPv4: Mv,
  normalizeIPv6: Pv,
  stringArrayToHexStripped: jh
};
const px = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, gx = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Rv(A) {
  return typeof A.secure == "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss";
}
function kv(A) {
  return A.host || (A.error = A.error || "HTTP URIs must have a host."), A;
}
function $v(A) {
  const e = String(A.scheme).toLowerCase() === "https";
  return (A.port === (e ? 443 : 80) || A.port === "") && (A.port = void 0), A.path || (A.path = "/"), A;
}
function Bx(A) {
  return A.secure = Rv(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A;
}
function wx(A) {
  if ((A.port === (Rv(A) ? 443 : 80) || A.port === "") && (A.port = void 0), typeof A.secure == "boolean" && (A.scheme = A.secure ? "wss" : "ws", A.secure = void 0), A.resourceName) {
    const [e, t] = A.resourceName.split("?");
    A.path = e && e !== "/" ? e : void 0, A.query = t, A.resourceName = void 0;
  }
  return A.fragment = void 0, A;
}
function mx(A, e) {
  if (!A.path)
    return A.error = "URN can not be parsed", A;
  const t = A.path.match(gx);
  if (t) {
    const n = e.scheme || A.scheme || "urn";
    A.nid = t[1].toLowerCase(), A.nss = t[2];
    const i = `${n}:${e.nid || A.nid}`, o = Zd[i];
    A.path = void 0, o && (A = o.parse(A, e));
  } else
    A.error = A.error || "URN can not be parsed.";
  return A;
}
function vx(A, e) {
  const t = e.scheme || A.scheme || "urn", n = A.nid.toLowerCase(), i = `${t}:${e.nid || n}`, o = Zd[i];
  o && (A = o.serialize(A, e));
  const l = A, f = A.nss;
  return l.path = `${n || e.nid}:${f}`, e.skipEscape = !0, l;
}
function yx(A, e) {
  const t = A;
  return t.uuid = t.nss, t.nss = void 0, !e.tolerant && (!t.uuid || !px.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
}
function Cx(A) {
  const e = A;
  return e.nss = (A.uuid || "").toLowerCase(), e;
}
const Gv = {
  scheme: "http",
  domainHost: !0,
  parse: kv,
  serialize: $v
}, Qx = {
  scheme: "https",
  domainHost: Gv.domainHost,
  parse: kv,
  serialize: $v
}, kl = {
  scheme: "ws",
  domainHost: !0,
  parse: Bx,
  serialize: wx
}, Fx = {
  scheme: "wss",
  domainHost: kl.domainHost,
  parse: kl.parse,
  serialize: kl.serialize
}, Ux = {
  scheme: "urn",
  parse: mx,
  serialize: vx,
  skipNormalize: !0
}, Ex = {
  scheme: "urn:uuid",
  parse: yx,
  serialize: Cx,
  skipNormalize: !0
}, Zd = {
  http: Gv,
  https: Qx,
  ws: kl,
  wss: Fx,
  urn: Ux,
  "urn:uuid": Ex
};
var bx = Zd;
const { normalizeIPv6: _x, normalizeIPv4: xx, removeDotSegments: as, recomposeAuthority: Ix, normalizeComponentEncoding: nl } = dx, Ap = bx;
function Hx(A, e) {
  return typeof A == "string" ? A = fr(Vr(A, e), e) : typeof A == "object" && (A = Vr(fr(A, e), e)), A;
}
function Sx(A, e, t) {
  const n = Object.assign({ scheme: "null" }, t), i = Vv(Vr(A, n), Vr(e, n), n, !0);
  return fr(i, { ...n, skipEscape: !0 });
}
function Vv(A, e, t, n) {
  const i = {};
  return n || (A = Vr(fr(A, t), t), e = Vr(fr(e, t), t)), t = t || {}, !t.tolerant && e.scheme ? (i.scheme = e.scheme, i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = as(e.path || ""), i.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = as(e.path || ""), i.query = e.query) : (e.path ? (e.path.charAt(0) === "/" ? i.path = as(e.path) : ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path ? i.path = "/" + e.path : A.path ? i.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + e.path : i.path = e.path, i.path = as(i.path)), i.query = e.query) : (i.path = A.path, e.query !== void 0 ? i.query = e.query : i.query = A.query), i.userinfo = A.userinfo, i.host = A.host, i.port = A.port), i.scheme = A.scheme), i.fragment = e.fragment, i;
}
function Lx(A, e, t) {
  return typeof A == "string" ? (A = unescape(A), A = fr(nl(Vr(A, t), !0), { ...t, skipEscape: !0 })) : typeof A == "object" && (A = fr(nl(A, !0), { ...t, skipEscape: !0 })), typeof e == "string" ? (e = unescape(e), e = fr(nl(Vr(e, t), !0), { ...t, skipEscape: !0 })) : typeof e == "object" && (e = fr(nl(e, !0), { ...t, skipEscape: !0 })), A.toLowerCase() === e.toLowerCase();
}
function fr(A, e) {
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
  }, n = Object.assign({}, e), i = [], o = Ap[(n.scheme || t.scheme || "").toLowerCase()];
  o && o.serialize && o.serialize(t, n), t.path !== void 0 && (n.skipEscape ? t.path = unescape(t.path) : (t.path = escape(t.path), t.scheme !== void 0 && (t.path = t.path.split("%3A").join(":")))), n.reference !== "suffix" && t.scheme && (i.push(t.scheme), i.push(":"));
  const l = Ix(t, n);
  if (l !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(l), t.path && t.path.charAt(0) !== "/" && i.push("/")), t.path !== void 0) {
    let f = t.path;
    !n.absolutePath && (!o || !o.absolutePath) && (f = as(f)), l === void 0 && (f = f.replace(/^\/\//u, "/%2F")), i.push(f);
  }
  return t.query !== void 0 && (i.push("?"), i.push(t.query)), t.fragment !== void 0 && (i.push("#"), i.push(t.fragment)), i.join("");
}
const Tx = Array.from({ length: 127 }, (A, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
function Dx(A) {
  let e = 0;
  for (let t = 0, n = A.length; t < n; ++t)
    if (e = A.charCodeAt(t), e > 126 || Tx[e])
      return !0;
  return !1;
}
const Ox = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Vr(A, e) {
  const t = Object.assign({}, e), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  }, i = A.indexOf("%") !== -1;
  let o = !1;
  t.reference === "suffix" && (A = (t.scheme ? t.scheme + ":" : "") + "//" + A);
  const l = A.match(Ox);
  if (l) {
    if (n.scheme = l[1], n.userinfo = l[3], n.host = l[4], n.port = parseInt(l[5], 10), n.path = l[6] || "", n.query = l[7], n.fragment = l[8], isNaN(n.port) && (n.port = l[5]), n.host) {
      const c = xx(n.host);
      if (c.isIPV4 === !1) {
        const h = _x(c.host, { isIPV4: !1 });
        n.host = h.host.toLowerCase(), o = h.isIPV6;
      } else
        n.host = c.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && !n.path && n.query === void 0 ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
    const f = Ap[(t.scheme || n.scheme || "").toLowerCase()];
    if (!t.unicodeSupport && (!f || !f.unicodeSupport) && n.host && (t.domainHost || f && f.domainHost) && o === !1 && Dx(n.host))
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
const ep = {
  SCHEMES: Ap,
  normalize: Hx,
  resolve: Sx,
  resolveComponents: Vv,
  equal: Lx,
  serialize: fr,
  parse: Vr
};
Tc.exports = ep;
Tc.exports.default = ep;
Tc.exports.fastUri = ep;
var Nx = Tc.exports;
Object.defineProperty(Yd, "__esModule", { value: !0 });
const Wv = Nx;
Wv.code = 'require("ajv/dist/runtime/uri").default';
Yd.default = Wv;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.CodeGen = A.Name = A.nil = A.stringify = A.str = A._ = A.KeywordCxt = void 0;
  var e = zn;
  Object.defineProperty(A, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var t = we;
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
  const n = $s, i = go, o = oa, l = en, f = we, c = Ut, h = ht, m = PA, B = rx, g = Yd, v = (aA, D) => new RegExp(aA, D);
  v.code = "new RegExp";
  const u = ["removeAdditional", "useDefaults", "coerceTypes"], C = /* @__PURE__ */ new Set([
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
  function N(aA) {
    var D, eA, j, T, k, rA, UA, EA, zA, ne, JA, RA, sA, vA, bA, te, me, Ue, Ze, Te, $e, Pe, _e, Mt, bt;
    const Pt = aA.strict, _t = (D = aA.code) === null || D === void 0 ? void 0 : D.optimize, mt = _t === !0 || _t === void 0 ? 1 : _t || 0, hn = (j = (eA = aA.code) === null || eA === void 0 ? void 0 : eA.regExp) !== null && j !== void 0 ? j : v, vr = (T = aA.uriResolver) !== null && T !== void 0 ? T : g.default;
    return {
      strictSchema: (rA = (k = aA.strictSchema) !== null && k !== void 0 ? k : Pt) !== null && rA !== void 0 ? rA : !0,
      strictNumbers: (EA = (UA = aA.strictNumbers) !== null && UA !== void 0 ? UA : Pt) !== null && EA !== void 0 ? EA : !0,
      strictTypes: (ne = (zA = aA.strictTypes) !== null && zA !== void 0 ? zA : Pt) !== null && ne !== void 0 ? ne : "log",
      strictTuples: (RA = (JA = aA.strictTuples) !== null && JA !== void 0 ? JA : Pt) !== null && RA !== void 0 ? RA : "log",
      strictRequired: (vA = (sA = aA.strictRequired) !== null && sA !== void 0 ? sA : Pt) !== null && vA !== void 0 ? vA : !1,
      code: aA.code ? { ...aA.code, optimize: mt, regExp: hn } : { optimize: mt, regExp: hn },
      loopRequired: (bA = aA.loopRequired) !== null && bA !== void 0 ? bA : S,
      loopEnum: (te = aA.loopEnum) !== null && te !== void 0 ? te : S,
      meta: (me = aA.meta) !== null && me !== void 0 ? me : !0,
      messages: (Ue = aA.messages) !== null && Ue !== void 0 ? Ue : !0,
      inlineRefs: (Ze = aA.inlineRefs) !== null && Ze !== void 0 ? Ze : !0,
      schemaId: (Te = aA.schemaId) !== null && Te !== void 0 ? Te : "$id",
      addUsedSchema: ($e = aA.addUsedSchema) !== null && $e !== void 0 ? $e : !0,
      validateSchema: (Pe = aA.validateSchema) !== null && Pe !== void 0 ? Pe : !0,
      validateFormats: (_e = aA.validateFormats) !== null && _e !== void 0 ? _e : !0,
      unicodeRegExp: (Mt = aA.unicodeRegExp) !== null && Mt !== void 0 ? Mt : !0,
      int32range: (bt = aA.int32range) !== null && bt !== void 0 ? bt : !0,
      uriResolver: vr
    };
  }
  class x {
    constructor(D = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), D = this.opts = { ...D, ...N(D) };
      const { es5: eA, lines: j } = this.opts.code;
      this.scope = new f.ValueScope({ scope: {}, prefixes: C, es5: eA, lines: j }), this.logger = NA(D.logger);
      const T = D.validateFormats;
      D.validateFormats = !1, this.RULES = (0, o.getRules)(), P.call(this, F, D, "NOT SUPPORTED"), P.call(this, U, D, "DEPRECATED", "warn"), this._metaOpts = BA.call(this), D.formats && fA.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), D.keywords && uA.call(this, D.keywords), typeof D.meta == "object" && this.addMetaSchema(D.meta), J.call(this), D.validateFormats = T;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: D, meta: eA, schemaId: j } = this.opts;
      let T = B;
      j === "id" && (T = { ...B }, T.id = T.$id, delete T.$id), eA && D && this.addMetaSchema(T, T[j], !1);
    }
    defaultMeta() {
      const { meta: D, schemaId: eA } = this.opts;
      return this.opts.defaultMeta = typeof D == "object" ? D[eA] || D : void 0;
    }
    validate(D, eA) {
      let j;
      if (typeof D == "string") {
        if (j = this.getSchema(D), !j)
          throw new Error(`no schema with key or ref "${D}"`);
      } else
        j = this.compile(D);
      const T = j(eA);
      return "$async" in j || (this.errors = j.errors), T;
    }
    compile(D, eA) {
      const j = this._addSchema(D, eA);
      return j.validate || this._compileSchemaEnv(j);
    }
    compileAsync(D, eA) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: j } = this.opts;
      return T.call(this, D, eA);
      async function T(ne, JA) {
        await k.call(this, ne.$schema);
        const RA = this._addSchema(ne, JA);
        return RA.validate || rA.call(this, RA);
      }
      async function k(ne) {
        ne && !this.getSchema(ne) && await T.call(this, { $ref: ne }, !0);
      }
      async function rA(ne) {
        try {
          return this._compileSchemaEnv(ne);
        } catch (JA) {
          if (!(JA instanceof i.default))
            throw JA;
          return UA.call(this, JA), await EA.call(this, JA.missingSchema), rA.call(this, ne);
        }
      }
      function UA({ missingSchema: ne, missingRef: JA }) {
        if (this.refs[ne])
          throw new Error(`AnySchema ${ne} is loaded but ${JA} cannot be resolved`);
      }
      async function EA(ne) {
        const JA = await zA.call(this, ne);
        this.refs[ne] || await k.call(this, JA.$schema), this.refs[ne] || this.addSchema(JA, ne, eA);
      }
      async function zA(ne) {
        const JA = this._loading[ne];
        if (JA)
          return JA;
        try {
          return await (this._loading[ne] = j(ne));
        } finally {
          delete this._loading[ne];
        }
      }
    }
    // Adds schema to the instance
    addSchema(D, eA, j, T = this.opts.validateSchema) {
      if (Array.isArray(D)) {
        for (const rA of D)
          this.addSchema(rA, void 0, j, T);
        return this;
      }
      let k;
      if (typeof D == "object") {
        const { schemaId: rA } = this.opts;
        if (k = D[rA], k !== void 0 && typeof k != "string")
          throw new Error(`schema ${rA} must be string`);
      }
      return eA = (0, c.normalizeId)(eA || k), this._checkUnique(eA), this.schemas[eA] = this._addSchema(D, j, eA, T, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(D, eA, j = this.opts.validateSchema) {
      return this.addSchema(D, eA, !0, j), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(D, eA) {
      if (typeof D == "boolean")
        return !0;
      let j;
      if (j = D.$schema, j !== void 0 && typeof j != "string")
        throw new Error("$schema must be a string");
      if (j = j || this.opts.defaultMeta || this.defaultMeta(), !j)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const T = this.validate(j, D);
      if (!T && eA) {
        const k = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(k);
        else
          throw new Error(k);
      }
      return T;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(D) {
      let eA;
      for (; typeof (eA = R.call(this, D)) == "string"; )
        D = eA;
      if (eA === void 0) {
        const { schemaId: j } = this.opts, T = new l.SchemaEnv({ schema: {}, schemaId: j });
        if (eA = l.resolveSchema.call(this, T, D), !eA)
          return;
        this.refs[D] = eA;
      }
      return eA.validate || this._compileSchemaEnv(eA);
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
          const eA = R.call(this, D);
          return typeof eA == "object" && this._cache.delete(eA.schema), delete this.schemas[D], delete this.refs[D], this;
        }
        case "object": {
          const eA = D;
          this._cache.delete(eA);
          let j = D[this.opts.schemaId];
          return j && (j = (0, c.normalizeId)(j), delete this.schemas[j], delete this.refs[j]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(D) {
      for (const eA of D)
        this.addKeyword(eA);
      return this;
    }
    addKeyword(D, eA) {
      let j;
      if (typeof D == "string")
        j = D, typeof eA == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), eA.keyword = j);
      else if (typeof D == "object" && eA === void 0) {
        if (eA = D, j = eA.keyword, Array.isArray(j) && !j.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (X.call(this, j, eA), !eA)
        return (0, m.eachItem)(j, (k) => CA.call(this, k)), this;
      hA.call(this, eA);
      const T = {
        ...eA,
        type: (0, h.getJSONTypes)(eA.type),
        schemaType: (0, h.getJSONTypes)(eA.schemaType)
      };
      return (0, m.eachItem)(j, T.type.length === 0 ? (k) => CA.call(this, k, T) : (k) => T.type.forEach((rA) => CA.call(this, k, T, rA))), this;
    }
    getKeyword(D) {
      const eA = this.RULES.all[D];
      return typeof eA == "object" ? eA.definition : !!eA;
    }
    // Remove keyword
    removeKeyword(D) {
      const { RULES: eA } = this;
      delete eA.keywords[D], delete eA.all[D];
      for (const j of eA.rules) {
        const T = j.rules.findIndex((k) => k.keyword === D);
        T >= 0 && j.rules.splice(T, 1);
      }
      return this;
    }
    // Add format
    addFormat(D, eA) {
      return typeof eA == "string" && (eA = new RegExp(eA)), this.formats[D] = eA, this;
    }
    errorsText(D = this.errors, { separator: eA = ", ", dataVar: j = "data" } = {}) {
      return !D || D.length === 0 ? "No errors" : D.map((T) => `${j}${T.instancePath} ${T.message}`).reduce((T, k) => T + eA + k);
    }
    $dataMetaSchema(D, eA) {
      const j = this.RULES.all;
      D = JSON.parse(JSON.stringify(D));
      for (const T of eA) {
        const k = T.split("/").slice(1);
        let rA = D;
        for (const UA of k)
          rA = rA[UA];
        for (const UA in j) {
          const EA = j[UA];
          if (typeof EA != "object")
            continue;
          const { $data: zA } = EA.definition, ne = rA[UA];
          zA && ne && (rA[UA] = IA(ne));
        }
      }
      return D;
    }
    _removeAllSchemas(D, eA) {
      for (const j in D) {
        const T = D[j];
        (!eA || eA.test(j)) && (typeof T == "string" ? delete D[j] : T && !T.meta && (this._cache.delete(T.schema), delete D[j]));
      }
    }
    _addSchema(D, eA, j, T = this.opts.validateSchema, k = this.opts.addUsedSchema) {
      let rA;
      const { schemaId: UA } = this.opts;
      if (typeof D == "object")
        rA = D[UA];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof D != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let EA = this._cache.get(D);
      if (EA !== void 0)
        return EA;
      j = (0, c.normalizeId)(rA || j);
      const zA = c.getSchemaRefs.call(this, D, j);
      return EA = new l.SchemaEnv({ schema: D, schemaId: UA, meta: eA, baseId: j, localRefs: zA }), this._cache.set(EA.schema, EA), k && !j.startsWith("#") && (j && this._checkUnique(j), this.refs[j] = EA), T && this.validateSchema(D, !0), EA;
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
      const eA = this.opts;
      this.opts = this._metaOpts;
      try {
        l.compileSchema.call(this, D);
      } finally {
        this.opts = eA;
      }
    }
  }
  x.ValidationError = n.default, x.MissingRefError = i.default, A.default = x;
  function P(aA, D, eA, j = "error") {
    for (const T in aA) {
      const k = T;
      k in D && this.logger[j](`${eA}: option ${T}. ${aA[k]}`);
    }
  }
  function R(aA) {
    return aA = (0, c.normalizeId)(aA), this.schemas[aA] || this.refs[aA];
  }
  function J() {
    const aA = this.opts.schemas;
    if (aA)
      if (Array.isArray(aA))
        this.addSchema(aA);
      else
        for (const D in aA)
          this.addSchema(aA[D], D);
  }
  function fA() {
    for (const aA in this.opts.formats) {
      const D = this.opts.formats[aA];
      D && this.addFormat(aA, D);
    }
  }
  function uA(aA) {
    if (Array.isArray(aA)) {
      this.addVocabulary(aA);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const D in aA) {
      const eA = aA[D];
      eA.keyword || (eA.keyword = D), this.addKeyword(eA);
    }
  }
  function BA() {
    const aA = { ...this.opts };
    for (const D of u)
      delete aA[D];
    return aA;
  }
  const FA = { log() {
  }, warn() {
  }, error() {
  } };
  function NA(aA) {
    if (aA === !1)
      return FA;
    if (aA === void 0)
      return console;
    if (aA.log && aA.warn && aA.error)
      return aA;
    throw new Error("logger must implement log, warn and error methods");
  }
  const xA = /^[a-z_$][a-z0-9_$:-]*$/i;
  function X(aA, D) {
    const { RULES: eA } = this;
    if ((0, m.eachItem)(aA, (j) => {
      if (eA.keywords[j])
        throw new Error(`Keyword ${j} is already defined`);
      if (!xA.test(j))
        throw new Error(`Keyword ${j} has invalid name`);
    }), !!D && D.$data && !("code" in D || "validate" in D))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function CA(aA, D, eA) {
    var j;
    const T = D == null ? void 0 : D.post;
    if (eA && T)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: k } = this;
    let rA = T ? k.post : k.rules.find(({ type: EA }) => EA === eA);
    if (rA || (rA = { type: eA, rules: [] }, k.rules.push(rA)), k.keywords[aA] = !0, !D)
      return;
    const UA = {
      keyword: aA,
      definition: {
        ...D,
        type: (0, h.getJSONTypes)(D.type),
        schemaType: (0, h.getJSONTypes)(D.schemaType)
      }
    };
    D.before ? tA.call(this, rA, UA, D.before) : rA.rules.push(UA), k.all[aA] = UA, (j = D.implements) === null || j === void 0 || j.forEach((EA) => this.addKeyword(EA));
  }
  function tA(aA, D, eA) {
    const j = aA.rules.findIndex((T) => T.keyword === eA);
    j >= 0 ? aA.rules.splice(j, 0, D) : (aA.rules.push(D), this.logger.warn(`rule ${eA} is not defined`));
  }
  function hA(aA) {
    let { metaSchema: D } = aA;
    D !== void 0 && (aA.$data && this.opts.$data && (D = IA(D)), aA.validateSchema = this.compile(D, !0));
  }
  const _A = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function IA(aA) {
    return { anyOf: [aA, _A] };
  }
})(iv);
var tp = {}, np = {}, rp = {};
Object.defineProperty(rp, "__esModule", { value: !0 });
const Mx = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
rp.default = Mx;
var sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
sa.callRef = sa.getValidate = void 0;
const Px = go, ew = Be, Zt = we, Ma = gr, tw = en, rl = PA, Kx = {
  keyword: "$ref",
  schemaType: "string",
  code(A) {
    const { gen: e, schema: t, it: n } = A, { baseId: i, schemaEnv: o, validateName: l, opts: f, self: c } = n, { root: h } = o;
    if ((t === "#" || t === "#/") && i === h.baseId)
      return B();
    const m = tw.resolveRef.call(c, h, i, t);
    if (m === void 0)
      throw new Px.default(n.opts.uriResolver, i, t);
    if (m instanceof tw.SchemaEnv)
      return g(m);
    return v(m);
    function B() {
      if (o === h)
        return $l(A, l, o, o.$async);
      const u = e.scopeValue("root", { ref: h });
      return $l(A, (0, Zt._)`${u}.validate`, h, h.$async);
    }
    function g(u) {
      const C = Xv(A, u);
      $l(A, C, u, u.$async);
    }
    function v(u) {
      const C = e.scopeValue("schema", f.code.source === !0 ? { ref: u, code: (0, Zt.stringify)(u) } : { ref: u }), F = e.name("valid"), U = A.subschema({
        schema: u,
        dataTypes: [],
        schemaPath: Zt.nil,
        topSchemaRef: C,
        errSchemaPath: t
      }, F);
      A.mergeEvaluated(U), A.ok(F);
    }
  }
};
function Xv(A, e) {
  const { gen: t } = A;
  return e.validate ? t.scopeValue("validate", { ref: e.validate }) : (0, Zt._)`${t.scopeValue("wrapper", { ref: e })}.validate`;
}
sa.getValidate = Xv;
function $l(A, e, t, n) {
  const { gen: i, it: o } = A, { allErrors: l, schemaEnv: f, opts: c } = o, h = c.passContext ? Ma.default.this : Zt.nil;
  n ? m() : B();
  function m() {
    if (!f.$async)
      throw new Error("async schema referenced by sync schema");
    const u = i.let("valid");
    i.try(() => {
      i.code((0, Zt._)`await ${(0, ew.callValidateCode)(A, e, h)}`), v(e), l || i.assign(u, !0);
    }, (C) => {
      i.if((0, Zt._)`!(${C} instanceof ${o.ValidationError})`, () => i.throw(C)), g(C), l || i.assign(u, !1);
    }), A.ok(u);
  }
  function B() {
    A.result((0, ew.callValidateCode)(A, e, h), () => v(e), () => g(e));
  }
  function g(u) {
    const C = (0, Zt._)`${u}.errors`;
    i.assign(Ma.default.vErrors, (0, Zt._)`${Ma.default.vErrors} === null ? ${C} : ${Ma.default.vErrors}.concat(${C})`), i.assign(Ma.default.errors, (0, Zt._)`${Ma.default.vErrors}.length`);
  }
  function v(u) {
    var C;
    if (!o.opts.unevaluated)
      return;
    const F = (C = t == null ? void 0 : t.validate) === null || C === void 0 ? void 0 : C.evaluated;
    if (o.props !== !0)
      if (F && !F.dynamicProps)
        F.props !== void 0 && (o.props = rl.mergeEvaluated.props(i, F.props, o.props));
      else {
        const U = i.var("props", (0, Zt._)`${u}.evaluated.props`);
        o.props = rl.mergeEvaluated.props(i, U, o.props, Zt.Name);
      }
    if (o.items !== !0)
      if (F && !F.dynamicItems)
        F.items !== void 0 && (o.items = rl.mergeEvaluated.items(i, F.items, o.items));
      else {
        const U = i.var("items", (0, Zt._)`${u}.evaluated.items`);
        o.items = rl.mergeEvaluated.items(i, U, o.items, Zt.Name);
      }
  }
}
sa.callRef = $l;
sa.default = Kx;
Object.defineProperty(np, "__esModule", { value: !0 });
const Rx = rp, kx = sa, $x = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Rx.default,
  kx.default
];
np.default = $x;
var ip = {}, ap = {};
Object.defineProperty(ap, "__esModule", { value: !0 });
const nc = we, pi = nc.operators, rc = {
  maximum: { okStr: "<=", ok: pi.LTE, fail: pi.GT },
  minimum: { okStr: ">=", ok: pi.GTE, fail: pi.LT },
  exclusiveMaximum: { okStr: "<", ok: pi.LT, fail: pi.GTE },
  exclusiveMinimum: { okStr: ">", ok: pi.GT, fail: pi.LTE }
}, Gx = {
  message: ({ keyword: A, schemaCode: e }) => (0, nc.str)`must be ${rc[A].okStr} ${e}`,
  params: ({ keyword: A, schemaCode: e }) => (0, nc._)`{comparison: ${rc[A].okStr}, limit: ${e}}`
}, Vx = {
  keyword: Object.keys(rc),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Gx,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A;
    A.fail$data((0, nc._)`${t} ${rc[e].fail} ${n} || isNaN(${t})`);
  }
};
ap.default = Vx;
var op = {};
Object.defineProperty(op, "__esModule", { value: !0 });
const ws = we, Wx = {
  message: ({ schemaCode: A }) => (0, ws.str)`must be multiple of ${A}`,
  params: ({ schemaCode: A }) => (0, ws._)`{multipleOf: ${A}}`
}, Xx = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Wx,
  code(A) {
    const { gen: e, data: t, schemaCode: n, it: i } = A, o = i.opts.multipleOfPrecision, l = e.let("res"), f = o ? (0, ws._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${o}` : (0, ws._)`${l} !== parseInt(${l})`;
    A.fail$data((0, ws._)`(${n} === 0 || (${l} = ${t}/${n}, ${f}))`);
  }
};
op.default = Xx;
var sp = {}, up = {};
Object.defineProperty(up, "__esModule", { value: !0 });
function qv(A) {
  const e = A.length;
  let t = 0, n = 0, i;
  for (; n < e; )
    t++, i = A.charCodeAt(n++), i >= 55296 && i <= 56319 && n < e && (i = A.charCodeAt(n), (i & 64512) === 56320 && n++);
  return t;
}
up.default = qv;
qv.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(sp, "__esModule", { value: !0 });
const Yi = we, qx = PA, zx = up, Jx = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxLength" ? "more" : "fewer";
    return (0, Yi.str)`must NOT have ${t} than ${e} characters`;
  },
  params: ({ schemaCode: A }) => (0, Yi._)`{limit: ${A}}`
}, jx = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Jx,
  code(A) {
    const { keyword: e, data: t, schemaCode: n, it: i } = A, o = e === "maxLength" ? Yi.operators.GT : Yi.operators.LT, l = i.opts.unicode === !1 ? (0, Yi._)`${t}.length` : (0, Yi._)`${(0, qx.useFunc)(A.gen, zx.default)}(${t})`;
    A.fail$data((0, Yi._)`${l} ${o} ${n}`);
  }
};
sp.default = jx;
var lp = {};
Object.defineProperty(lp, "__esModule", { value: !0 });
const Yx = Be, ic = we, Zx = {
  message: ({ schemaCode: A }) => (0, ic.str)`must match pattern "${A}"`,
  params: ({ schemaCode: A }) => (0, ic._)`{pattern: ${A}}`
}, AI = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Zx,
  code(A) {
    const { data: e, $data: t, schema: n, schemaCode: i, it: o } = A, l = o.opts.unicodeRegExp ? "u" : "", f = t ? (0, ic._)`(new RegExp(${i}, ${l}))` : (0, Yx.usePattern)(A, n);
    A.fail$data((0, ic._)`!${f}.test(${e})`);
  }
};
lp.default = AI;
var cp = {};
Object.defineProperty(cp, "__esModule", { value: !0 });
const ms = we, eI = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxProperties" ? "more" : "fewer";
    return (0, ms.str)`must NOT have ${t} than ${e} properties`;
  },
  params: ({ schemaCode: A }) => (0, ms._)`{limit: ${A}}`
}, tI = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: eI,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxProperties" ? ms.operators.GT : ms.operators.LT;
    A.fail$data((0, ms._)`Object.keys(${t}).length ${i} ${n}`);
  }
};
cp.default = tI;
var fp = {};
Object.defineProperty(fp, "__esModule", { value: !0 });
const Yo = Be, vs = we, nI = PA, rI = {
  message: ({ params: { missingProperty: A } }) => (0, vs.str)`must have required property '${A}'`,
  params: ({ params: { missingProperty: A } }) => (0, vs._)`{missingProperty: ${A}}`
}, iI = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: rI,
  code(A) {
    const { gen: e, schema: t, schemaCode: n, data: i, $data: o, it: l } = A, { opts: f } = l;
    if (!o && t.length === 0)
      return;
    const c = t.length >= f.loopRequired;
    if (l.allErrors ? h() : m(), f.strictRequired) {
      const v = A.parentSchema.properties, { definedProperties: u } = A.it;
      for (const C of t)
        if ((v == null ? void 0 : v[C]) === void 0 && !u.has(C)) {
          const F = l.schemaEnv.baseId + l.errSchemaPath, U = `required property "${C}" is not defined at "${F}" (strictRequired)`;
          (0, nI.checkStrictMode)(l, U, l.opts.strictRequired);
        }
    }
    function h() {
      if (c || o)
        A.block$data(vs.nil, B);
      else
        for (const v of t)
          (0, Yo.checkReportMissingProp)(A, v);
    }
    function m() {
      const v = e.let("missing");
      if (c || o) {
        const u = e.let("valid", !0);
        A.block$data(u, () => g(v, u)), A.ok(u);
      } else
        e.if((0, Yo.checkMissingProp)(A, t, v)), (0, Yo.reportMissingProp)(A, v), e.else();
    }
    function B() {
      e.forOf("prop", n, (v) => {
        A.setParams({ missingProperty: v }), e.if((0, Yo.noPropertyInData)(e, i, v, f.ownProperties), () => A.error());
      });
    }
    function g(v, u) {
      A.setParams({ missingProperty: v }), e.forOf(v, n, () => {
        e.assign(u, (0, Yo.propertyInData)(e, i, v, f.ownProperties)), e.if((0, vs.not)(u), () => {
          A.error(), e.break();
        });
      }, vs.nil);
    }
  }
};
fp.default = iI;
var hp = {};
Object.defineProperty(hp, "__esModule", { value: !0 });
const ys = we, aI = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxItems" ? "more" : "fewer";
    return (0, ys.str)`must NOT have ${t} than ${e} items`;
  },
  params: ({ schemaCode: A }) => (0, ys._)`{limit: ${A}}`
}, oI = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: aI,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxItems" ? ys.operators.GT : ys.operators.LT;
    A.fail$data((0, ys._)`${t}.length ${i} ${n}`);
  }
};
hp.default = oI;
var dp = {}, Gs = {};
Object.defineProperty(Gs, "__esModule", { value: !0 });
const zv = yv;
zv.code = 'require("ajv/dist/runtime/equal").default';
Gs.default = zv;
Object.defineProperty(dp, "__esModule", { value: !0 });
const dh = ht, Qt = we, sI = PA, uI = Gs, lI = {
  message: ({ params: { i: A, j: e } }) => (0, Qt.str)`must NOT have duplicate items (items ## ${e} and ${A} are identical)`,
  params: ({ params: { i: A, j: e } }) => (0, Qt._)`{i: ${A}, j: ${e}}`
}, cI = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: lI,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, parentSchema: o, schemaCode: l, it: f } = A;
    if (!n && !i)
      return;
    const c = e.let("valid"), h = o.items ? (0, dh.getSchemaTypes)(o.items) : [];
    A.block$data(c, m, (0, Qt._)`${l} === false`), A.ok(c);
    function m() {
      const u = e.let("i", (0, Qt._)`${t}.length`), C = e.let("j");
      A.setParams({ i: u, j: C }), e.assign(c, !0), e.if((0, Qt._)`${u} > 1`, () => (B() ? g : v)(u, C));
    }
    function B() {
      return h.length > 0 && !h.some((u) => u === "object" || u === "array");
    }
    function g(u, C) {
      const F = e.name("item"), U = (0, dh.checkDataTypes)(h, F, f.opts.strictNumbers, dh.DataType.Wrong), S = e.const("indices", (0, Qt._)`{}`);
      e.for((0, Qt._)`;${u}--;`, () => {
        e.let(F, (0, Qt._)`${t}[${u}]`), e.if(U, (0, Qt._)`continue`), h.length > 1 && e.if((0, Qt._)`typeof ${F} == "string"`, (0, Qt._)`${F} += "_"`), e.if((0, Qt._)`typeof ${S}[${F}] == "number"`, () => {
          e.assign(C, (0, Qt._)`${S}[${F}]`), A.error(), e.assign(c, !1).break();
        }).code((0, Qt._)`${S}[${F}] = ${u}`);
      });
    }
    function v(u, C) {
      const F = (0, sI.useFunc)(e, uI.default), U = e.name("outer");
      e.label(U).for((0, Qt._)`;${u}--;`, () => e.for((0, Qt._)`${C} = ${u}; ${C}--;`, () => e.if((0, Qt._)`${F}(${t}[${u}], ${t}[${C}])`, () => {
        A.error(), e.assign(c, !1).break(U);
      })));
    }
  }
};
dp.default = cI;
var pp = {};
Object.defineProperty(pp, "__esModule", { value: !0 });
const Yh = we, fI = PA, hI = Gs, dI = {
  message: "must be equal to constant",
  params: ({ schemaCode: A }) => (0, Yh._)`{allowedValue: ${A}}`
}, pI = {
  keyword: "const",
  $data: !0,
  error: dI,
  code(A) {
    const { gen: e, data: t, $data: n, schemaCode: i, schema: o } = A;
    n || o && typeof o == "object" ? A.fail$data((0, Yh._)`!${(0, fI.useFunc)(e, hI.default)}(${t}, ${i})`) : A.fail((0, Yh._)`${o} !== ${t}`);
  }
};
pp.default = pI;
var gp = {};
Object.defineProperty(gp, "__esModule", { value: !0 });
const os = we, gI = PA, BI = Gs, wI = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: A }) => (0, os._)`{allowedValues: ${A}}`
}, mI = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: wI,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, schemaCode: o, it: l } = A;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const f = i.length >= l.opts.loopEnum;
    let c;
    const h = () => c ?? (c = (0, gI.useFunc)(e, BI.default));
    let m;
    if (f || n)
      m = e.let("valid"), A.block$data(m, B);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const v = e.const("vSchema", o);
      m = (0, os.or)(...i.map((u, C) => g(v, C)));
    }
    A.pass(m);
    function B() {
      e.assign(m, !1), e.forOf("v", o, (v) => e.if((0, os._)`${h()}(${t}, ${v})`, () => e.assign(m, !0).break()));
    }
    function g(v, u) {
      const C = i[u];
      return typeof C == "object" && C !== null ? (0, os._)`${h()}(${t}, ${v}[${u}])` : (0, os._)`${t} === ${C}`;
    }
  }
};
gp.default = mI;
Object.defineProperty(ip, "__esModule", { value: !0 });
const vI = ap, yI = op, CI = sp, QI = lp, FI = cp, UI = fp, EI = hp, bI = dp, _I = pp, xI = gp, II = [
  // number
  vI.default,
  yI.default,
  // string
  CI.default,
  QI.default,
  // object
  FI.default,
  UI.default,
  // array
  EI.default,
  bI.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  _I.default,
  xI.default
];
ip.default = II;
var Bp = {}, Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.validateAdditionalItems = void 0;
const Zi = we, Zh = PA, HI = {
  message: ({ params: { len: A } }) => (0, Zi.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, Zi._)`{limit: ${A}}`
}, SI = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: HI,
  code(A) {
    const { parentSchema: e, it: t } = A, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, Zh.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Jv(A, n);
  }
};
function Jv(A, e) {
  const { gen: t, schema: n, data: i, keyword: o, it: l } = A;
  l.items = !0;
  const f = t.const("len", (0, Zi._)`${i}.length`);
  if (n === !1)
    A.setParams({ len: e.length }), A.pass((0, Zi._)`${f} <= ${e.length}`);
  else if (typeof n == "object" && !(0, Zh.alwaysValidSchema)(l, n)) {
    const h = t.var("valid", (0, Zi._)`${f} <= ${e.length}`);
    t.if((0, Zi.not)(h), () => c(h)), A.ok(h);
  }
  function c(h) {
    t.forRange("i", e.length, f, (m) => {
      A.subschema({ keyword: o, dataProp: m, dataPropType: Zh.Type.Num }, h), l.allErrors || t.if((0, Zi.not)(h), () => t.break());
    });
  }
}
Bo.validateAdditionalItems = Jv;
Bo.default = SI;
var wp = {}, wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.validateTuple = void 0;
const nw = we, Gl = PA, LI = Be, TI = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(A) {
    const { schema: e, it: t } = A;
    if (Array.isArray(e))
      return jv(A, "additionalItems", e);
    t.items = !0, !(0, Gl.alwaysValidSchema)(t, e) && A.ok((0, LI.validateArray)(A));
  }
};
function jv(A, e, t = A.schema) {
  const { gen: n, parentSchema: i, data: o, keyword: l, it: f } = A;
  m(i), f.opts.unevaluated && t.length && f.items !== !0 && (f.items = Gl.mergeEvaluated.items(n, t.length, f.items));
  const c = n.name("valid"), h = n.const("len", (0, nw._)`${o}.length`);
  t.forEach((B, g) => {
    (0, Gl.alwaysValidSchema)(f, B) || (n.if((0, nw._)`${h} > ${g}`, () => A.subschema({
      keyword: l,
      schemaProp: g,
      dataProp: g
    }, c)), A.ok(c));
  });
  function m(B) {
    const { opts: g, errSchemaPath: v } = f, u = t.length, C = u === B.minItems && (u === B.maxItems || B[e] === !1);
    if (g.strictTuples && !C) {
      const F = `"${l}" is ${u}-tuple, but minItems or maxItems/${e} are not specified or different at path "${v}"`;
      (0, Gl.checkStrictMode)(f, F, g.strictTuples);
    }
  }
}
wo.validateTuple = jv;
wo.default = TI;
Object.defineProperty(wp, "__esModule", { value: !0 });
const DI = wo, OI = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (A) => (0, DI.validateTuple)(A, "items")
};
wp.default = OI;
var mp = {};
Object.defineProperty(mp, "__esModule", { value: !0 });
const rw = we, NI = PA, MI = Be, PI = Bo, KI = {
  message: ({ params: { len: A } }) => (0, rw.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, rw._)`{limit: ${A}}`
}, RI = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: KI,
  code(A) {
    const { schema: e, parentSchema: t, it: n } = A, { prefixItems: i } = t;
    n.items = !0, !(0, NI.alwaysValidSchema)(n, e) && (i ? (0, PI.validateAdditionalItems)(A, i) : A.ok((0, MI.validateArray)(A)));
  }
};
mp.default = RI;
var vp = {};
Object.defineProperty(vp, "__esModule", { value: !0 });
const Cn = we, il = PA, kI = {
  message: ({ params: { min: A, max: e } }) => e === void 0 ? (0, Cn.str)`must contain at least ${A} valid item(s)` : (0, Cn.str)`must contain at least ${A} and no more than ${e} valid item(s)`,
  params: ({ params: { min: A, max: e } }) => e === void 0 ? (0, Cn._)`{minContains: ${A}}` : (0, Cn._)`{minContains: ${A}, maxContains: ${e}}`
}, $I = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: kI,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: o } = A;
    let l, f;
    const { minContains: c, maxContains: h } = n;
    o.opts.next ? (l = c === void 0 ? 1 : c, f = h) : l = 1;
    const m = e.const("len", (0, Cn._)`${i}.length`);
    if (A.setParams({ min: l, max: f }), f === void 0 && l === 0) {
      (0, il.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (f !== void 0 && l > f) {
      (0, il.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), A.fail();
      return;
    }
    if ((0, il.alwaysValidSchema)(o, t)) {
      let C = (0, Cn._)`${m} >= ${l}`;
      f !== void 0 && (C = (0, Cn._)`${C} && ${m} <= ${f}`), A.pass(C);
      return;
    }
    o.items = !0;
    const B = e.name("valid");
    f === void 0 && l === 1 ? v(B, () => e.if(B, () => e.break())) : l === 0 ? (e.let(B, !0), f !== void 0 && e.if((0, Cn._)`${i}.length > 0`, g)) : (e.let(B, !1), g()), A.result(B, () => A.reset());
    function g() {
      const C = e.name("_valid"), F = e.let("count", 0);
      v(C, () => e.if(C, () => u(F)));
    }
    function v(C, F) {
      e.forRange("i", 0, m, (U) => {
        A.subschema({
          keyword: "contains",
          dataProp: U,
          dataPropType: il.Type.Num,
          compositeRule: !0
        }, C), F();
      });
    }
    function u(C) {
      e.code((0, Cn._)`${C}++`), f === void 0 ? e.if((0, Cn._)`${C} >= ${l}`, () => e.assign(B, !0).break()) : (e.if((0, Cn._)`${C} > ${f}`, () => e.assign(B, !1).break()), l === 1 ? e.assign(B, !0) : e.if((0, Cn._)`${C} >= ${l}`, () => e.assign(B, !0)));
    }
  }
};
vp.default = $I;
var Yv = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.validateSchemaDeps = A.validatePropertyDeps = A.error = void 0;
  const e = we, t = PA, n = Be;
  A.error = {
    message: ({ params: { property: c, depsCount: h, deps: m } }) => {
      const B = h === 1 ? "property" : "properties";
      return (0, e.str)`must have ${B} ${m} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: h, deps: m, missingProperty: B } }) => (0, e._)`{property: ${c},
    missingProperty: ${B},
    depsCount: ${h},
    deps: ${m}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: A.error,
    code(c) {
      const [h, m] = o(c);
      l(c, h), f(c, m);
    }
  };
  function o({ schema: c }) {
    const h = {}, m = {};
    for (const B in c) {
      if (B === "__proto__")
        continue;
      const g = Array.isArray(c[B]) ? h : m;
      g[B] = c[B];
    }
    return [h, m];
  }
  function l(c, h = c.schema) {
    const { gen: m, data: B, it: g } = c;
    if (Object.keys(h).length === 0)
      return;
    const v = m.let("missing");
    for (const u in h) {
      const C = h[u];
      if (C.length === 0)
        continue;
      const F = (0, n.propertyInData)(m, B, u, g.opts.ownProperties);
      c.setParams({
        property: u,
        depsCount: C.length,
        deps: C.join(", ")
      }), g.allErrors ? m.if(F, () => {
        for (const U of C)
          (0, n.checkReportMissingProp)(c, U);
      }) : (m.if((0, e._)`${F} && (${(0, n.checkMissingProp)(c, C, v)})`), (0, n.reportMissingProp)(c, v), m.else());
    }
  }
  A.validatePropertyDeps = l;
  function f(c, h = c.schema) {
    const { gen: m, data: B, keyword: g, it: v } = c, u = m.name("valid");
    for (const C in h)
      (0, t.alwaysValidSchema)(v, h[C]) || (m.if(
        (0, n.propertyInData)(m, B, C, v.opts.ownProperties),
        () => {
          const F = c.subschema({ keyword: g, schemaProp: C }, u);
          c.mergeValidEvaluated(F, u);
        },
        () => m.var(u, !0)
        // TODO var
      ), c.ok(u));
  }
  A.validateSchemaDeps = f, A.default = i;
})(Yv);
var yp = {};
Object.defineProperty(yp, "__esModule", { value: !0 });
const Zv = we, GI = PA, VI = {
  message: "property name must be valid",
  params: ({ params: A }) => (0, Zv._)`{propertyName: ${A.propertyName}}`
}, WI = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: VI,
  code(A) {
    const { gen: e, schema: t, data: n, it: i } = A;
    if ((0, GI.alwaysValidSchema)(i, t))
      return;
    const o = e.name("valid");
    e.forIn("key", n, (l) => {
      A.setParams({ propertyName: l }), A.subschema({
        keyword: "propertyNames",
        data: l,
        dataTypes: ["string"],
        propertyName: l,
        compositeRule: !0
      }, o), e.if((0, Zv.not)(o), () => {
        A.error(!0), i.allErrors || e.break();
      });
    }), A.ok(o);
  }
};
yp.default = WI;
var Dc = {};
Object.defineProperty(Dc, "__esModule", { value: !0 });
const al = Be, $n = we, XI = gr, ol = PA, qI = {
  message: "must NOT have additional properties",
  params: ({ params: A }) => (0, $n._)`{additionalProperty: ${A.additionalProperty}}`
}, zI = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: qI,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, errsCount: o, it: l } = A;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: f, opts: c } = l;
    if (l.props = !0, c.removeAdditional !== "all" && (0, ol.alwaysValidSchema)(l, t))
      return;
    const h = (0, al.allSchemaProperties)(n.properties), m = (0, al.allSchemaProperties)(n.patternProperties);
    B(), A.ok((0, $n._)`${o} === ${XI.default.errors}`);
    function B() {
      e.forIn("key", i, (F) => {
        !h.length && !m.length ? u(F) : e.if(g(F), () => u(F));
      });
    }
    function g(F) {
      let U;
      if (h.length > 8) {
        const S = (0, ol.schemaRefOrVal)(l, n.properties, "properties");
        U = (0, al.isOwnProperty)(e, S, F);
      } else h.length ? U = (0, $n.or)(...h.map((S) => (0, $n._)`${F} === ${S}`)) : U = $n.nil;
      return m.length && (U = (0, $n.or)(U, ...m.map((S) => (0, $n._)`${(0, al.usePattern)(A, S)}.test(${F})`))), (0, $n.not)(U);
    }
    function v(F) {
      e.code((0, $n._)`delete ${i}[${F}]`);
    }
    function u(F) {
      if (c.removeAdditional === "all" || c.removeAdditional && t === !1) {
        v(F);
        return;
      }
      if (t === !1) {
        A.setParams({ additionalProperty: F }), A.error(), f || e.break();
        return;
      }
      if (typeof t == "object" && !(0, ol.alwaysValidSchema)(l, t)) {
        const U = e.name("valid");
        c.removeAdditional === "failing" ? (C(F, U, !1), e.if((0, $n.not)(U), () => {
          A.reset(), v(F);
        })) : (C(F, U), f || e.if((0, $n.not)(U), () => e.break()));
      }
    }
    function C(F, U, S) {
      const N = {
        keyword: "additionalProperties",
        dataProp: F,
        dataPropType: ol.Type.Str
      };
      S === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), A.subschema(N, U);
    }
  }
};
Dc.default = zI;
var Cp = {};
Object.defineProperty(Cp, "__esModule", { value: !0 });
const JI = zn, iw = Be, ph = PA, aw = Dc, jI = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: o } = A;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && aw.default.code(new JI.KeywordCxt(o, aw.default, "additionalProperties"));
    const l = (0, iw.allSchemaProperties)(t);
    for (const B of l)
      o.definedProperties.add(B);
    o.opts.unevaluated && l.length && o.props !== !0 && (o.props = ph.mergeEvaluated.props(e, (0, ph.toHash)(l), o.props));
    const f = l.filter((B) => !(0, ph.alwaysValidSchema)(o, t[B]));
    if (f.length === 0)
      return;
    const c = e.name("valid");
    for (const B of f)
      h(B) ? m(B) : (e.if((0, iw.propertyInData)(e, i, B, o.opts.ownProperties)), m(B), o.allErrors || e.else().var(c, !0), e.endIf()), A.it.definedProperties.add(B), A.ok(c);
    function h(B) {
      return o.opts.useDefaults && !o.compositeRule && t[B].default !== void 0;
    }
    function m(B) {
      A.subschema({
        keyword: "properties",
        schemaProp: B,
        dataProp: B
      }, c);
    }
  }
};
Cp.default = jI;
var Qp = {};
Object.defineProperty(Qp, "__esModule", { value: !0 });
const ow = Be, sl = we, sw = PA, uw = PA, YI = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, data: n, parentSchema: i, it: o } = A, { opts: l } = o, f = (0, ow.allSchemaProperties)(t), c = f.filter((C) => (0, sw.alwaysValidSchema)(o, t[C]));
    if (f.length === 0 || c.length === f.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const h = l.strictSchema && !l.allowMatchingProperties && i.properties, m = e.name("valid");
    o.props !== !0 && !(o.props instanceof sl.Name) && (o.props = (0, uw.evaluatedPropsToName)(e, o.props));
    const { props: B } = o;
    g();
    function g() {
      for (const C of f)
        h && v(C), o.allErrors ? u(C) : (e.var(m, !0), u(C), e.if(m));
    }
    function v(C) {
      for (const F in h)
        new RegExp(C).test(F) && (0, sw.checkStrictMode)(o, `property ${F} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function u(C) {
      e.forIn("key", n, (F) => {
        e.if((0, sl._)`${(0, ow.usePattern)(A, C)}.test(${F})`, () => {
          const U = c.includes(C);
          U || A.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: F,
            dataPropType: uw.Type.Str
          }, m), o.opts.unevaluated && B !== !0 ? e.assign((0, sl._)`${B}[${F}]`, !0) : !U && !o.allErrors && e.if((0, sl.not)(m), () => e.break());
        });
      });
    }
  }
};
Qp.default = YI;
var Fp = {};
Object.defineProperty(Fp, "__esModule", { value: !0 });
const ZI = PA, AH = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if ((0, ZI.alwaysValidSchema)(n, t)) {
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
Fp.default = AH;
var Up = {};
Object.defineProperty(Up, "__esModule", { value: !0 });
const eH = Be, tH = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: eH.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Up.default = tH;
var Ep = {};
Object.defineProperty(Ep, "__esModule", { value: !0 });
const Vl = we, nH = PA, rH = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: A }) => (0, Vl._)`{passingSchemas: ${A.passing}}`
}, iH = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: rH,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, it: i } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const o = t, l = e.let("valid", !1), f = e.let("passing", null), c = e.name("_valid");
    A.setParams({ passing: f }), e.block(h), A.result(l, () => A.reset(), () => A.error(!0));
    function h() {
      o.forEach((m, B) => {
        let g;
        (0, nH.alwaysValidSchema)(i, m) ? e.var(c, !0) : g = A.subschema({
          keyword: "oneOf",
          schemaProp: B,
          compositeRule: !0
        }, c), B > 0 && e.if((0, Vl._)`${c} && ${l}`).assign(l, !1).assign(f, (0, Vl._)`[${f}, ${B}]`).else(), e.if(c, () => {
          e.assign(l, !0), e.assign(f, B), g && A.mergeEvaluated(g, Vl.Name);
        });
      });
    }
  }
};
Ep.default = iH;
var bp = {};
Object.defineProperty(bp, "__esModule", { value: !0 });
const aH = PA, oH = {
  keyword: "allOf",
  schemaType: "array",
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    const i = e.name("valid");
    t.forEach((o, l) => {
      if ((0, aH.alwaysValidSchema)(n, o))
        return;
      const f = A.subschema({ keyword: "allOf", schemaProp: l }, i);
      A.ok(i), A.mergeEvaluated(f);
    });
  }
};
bp.default = oH;
var _p = {};
Object.defineProperty(_p, "__esModule", { value: !0 });
const ac = we, A0 = PA, sH = {
  message: ({ params: A }) => (0, ac.str)`must match "${A.ifClause}" schema`,
  params: ({ params: A }) => (0, ac._)`{failingKeyword: ${A.ifClause}}`
}, uH = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: sH,
  code(A) {
    const { gen: e, parentSchema: t, it: n } = A;
    t.then === void 0 && t.else === void 0 && (0, A0.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = lw(n, "then"), o = lw(n, "else");
    if (!i && !o)
      return;
    const l = e.let("valid", !0), f = e.name("_valid");
    if (c(), A.reset(), i && o) {
      const m = e.let("ifClause");
      A.setParams({ ifClause: m }), e.if(f, h("then", m), h("else", m));
    } else i ? e.if(f, h("then")) : e.if((0, ac.not)(f), h("else"));
    A.pass(l, () => A.error(!0));
    function c() {
      const m = A.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, f);
      A.mergeEvaluated(m);
    }
    function h(m, B) {
      return () => {
        const g = A.subschema({ keyword: m }, f);
        e.assign(l, f), A.mergeValidEvaluated(g, l), B ? e.assign(B, (0, ac._)`${m}`) : A.setParams({ ifClause: m });
      };
    }
  }
};
function lw(A, e) {
  const t = A.schema[e];
  return t !== void 0 && !(0, A0.alwaysValidSchema)(A, t);
}
_p.default = uH;
var xp = {};
Object.defineProperty(xp, "__esModule", { value: !0 });
const lH = PA, cH = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: A, parentSchema: e, it: t }) {
    e.if === void 0 && (0, lH.checkStrictMode)(t, `"${A}" without "if" is ignored`);
  }
};
xp.default = cH;
Object.defineProperty(Bp, "__esModule", { value: !0 });
const fH = Bo, hH = wp, dH = wo, pH = mp, gH = vp, BH = Yv, wH = yp, mH = Dc, vH = Cp, yH = Qp, CH = Fp, QH = Up, FH = Ep, UH = bp, EH = _p, bH = xp;
function _H(A = !1) {
  const e = [
    // any
    CH.default,
    QH.default,
    FH.default,
    UH.default,
    EH.default,
    bH.default,
    // object
    wH.default,
    mH.default,
    BH.default,
    vH.default,
    yH.default
  ];
  return A ? e.push(hH.default, pH.default) : e.push(fH.default, dH.default), e.push(gH.default), e;
}
Bp.default = _H;
var Ip = {}, Hp = {};
Object.defineProperty(Hp, "__esModule", { value: !0 });
const ot = we, xH = {
  message: ({ schemaCode: A }) => (0, ot.str)`must match format "${A}"`,
  params: ({ schemaCode: A }) => (0, ot._)`{format: ${A}}`
}, IH = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: xH,
  code(A, e) {
    const { gen: t, data: n, $data: i, schema: o, schemaCode: l, it: f } = A, { opts: c, errSchemaPath: h, schemaEnv: m, self: B } = f;
    if (!c.validateFormats)
      return;
    i ? g() : v();
    function g() {
      const u = t.scopeValue("formats", {
        ref: B.formats,
        code: c.code.formats
      }), C = t.const("fDef", (0, ot._)`${u}[${l}]`), F = t.let("fType"), U = t.let("format");
      t.if((0, ot._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => t.assign(F, (0, ot._)`${C}.type || "string"`).assign(U, (0, ot._)`${C}.validate`), () => t.assign(F, (0, ot._)`"string"`).assign(U, C)), A.fail$data((0, ot.or)(S(), N()));
      function S() {
        return c.strictSchema === !1 ? ot.nil : (0, ot._)`${l} && !${U}`;
      }
      function N() {
        const x = m.$async ? (0, ot._)`(${C}.async ? await ${U}(${n}) : ${U}(${n}))` : (0, ot._)`${U}(${n})`, P = (0, ot._)`(typeof ${U} == "function" ? ${x} : ${U}.test(${n}))`;
        return (0, ot._)`${U} && ${U} !== true && ${F} === ${e} && !${P}`;
      }
    }
    function v() {
      const u = B.formats[o];
      if (!u) {
        S();
        return;
      }
      if (u === !0)
        return;
      const [C, F, U] = N(u);
      C === e && A.pass(x());
      function S() {
        if (c.strictSchema === !1) {
          B.logger.warn(P());
          return;
        }
        throw new Error(P());
        function P() {
          return `unknown format "${o}" ignored in schema at path "${h}"`;
        }
      }
      function N(P) {
        const R = P instanceof RegExp ? (0, ot.regexpCode)(P) : c.code.formats ? (0, ot._)`${c.code.formats}${(0, ot.getProperty)(o)}` : void 0, J = t.scopeValue("formats", { key: o, ref: P, code: R });
        return typeof P == "object" && !(P instanceof RegExp) ? [P.type || "string", P.validate, (0, ot._)`${J}.validate`] : ["string", P, J];
      }
      function x() {
        if (typeof u == "object" && !(u instanceof RegExp) && u.async) {
          if (!m.$async)
            throw new Error("async format in sync schema");
          return (0, ot._)`await ${U}(${n})`;
        }
        return typeof F == "function" ? (0, ot._)`${U}(${n})` : (0, ot._)`${U}.test(${n})`;
      }
    }
  }
};
Hp.default = IH;
Object.defineProperty(Ip, "__esModule", { value: !0 });
const HH = Hp, SH = [HH.default];
Ip.default = SH;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.contentVocabulary = ao.metadataVocabulary = void 0;
ao.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
ao.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(tp, "__esModule", { value: !0 });
const LH = np, TH = ip, DH = Bp, OH = Ip, cw = ao, NH = [
  LH.default,
  TH.default,
  (0, DH.default)(),
  OH.default,
  cw.metadataVocabulary,
  cw.contentVocabulary
];
tp.default = NH;
var Sp = {}, Oc = {};
Object.defineProperty(Oc, "__esModule", { value: !0 });
Oc.DiscrError = void 0;
var fw;
(function(A) {
  A.Tag = "tag", A.Mapping = "mapping";
})(fw || (Oc.DiscrError = fw = {}));
Object.defineProperty(Sp, "__esModule", { value: !0 });
const Wa = we, Ad = Oc, hw = en, MH = go, PH = PA, KH = {
  message: ({ params: { discrError: A, tagName: e } }) => A === Ad.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: A, tag: e, tagName: t } }) => (0, Wa._)`{error: ${A}, tag: ${t}, tagValue: ${e}}`
}, RH = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: KH,
  code(A) {
    const { gen: e, data: t, schema: n, parentSchema: i, it: o } = A, { oneOf: l } = i;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const f = n.propertyName;
    if (typeof f != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!l)
      throw new Error("discriminator: requires oneOf keyword");
    const c = e.let("valid", !1), h = e.const("tag", (0, Wa._)`${t}${(0, Wa.getProperty)(f)}`);
    e.if((0, Wa._)`typeof ${h} == "string"`, () => m(), () => A.error(!1, { discrError: Ad.DiscrError.Tag, tag: h, tagName: f })), A.ok(c);
    function m() {
      const v = g();
      e.if(!1);
      for (const u in v)
        e.elseIf((0, Wa._)`${h} === ${u}`), e.assign(c, B(v[u]));
      e.else(), A.error(!1, { discrError: Ad.DiscrError.Mapping, tag: h, tagName: f }), e.endIf();
    }
    function B(v) {
      const u = e.name("valid"), C = A.subschema({ keyword: "oneOf", schemaProp: v }, u);
      return A.mergeEvaluated(C, Wa.Name), u;
    }
    function g() {
      var v;
      const u = {}, C = U(i);
      let F = !0;
      for (let x = 0; x < l.length; x++) {
        let P = l[x];
        if (P != null && P.$ref && !(0, PH.schemaHasRulesButRef)(P, o.self.RULES)) {
          const J = P.$ref;
          if (P = hw.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, J), P instanceof hw.SchemaEnv && (P = P.schema), P === void 0)
            throw new MH.default(o.opts.uriResolver, o.baseId, J);
        }
        const R = (v = P == null ? void 0 : P.properties) === null || v === void 0 ? void 0 : v[f];
        if (typeof R != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${f}"`);
        F = F && (C || U(P)), S(R, x);
      }
      if (!F)
        throw new Error(`discriminator: "${f}" must be required`);
      return u;
      function U({ required: x }) {
        return Array.isArray(x) && x.includes(f);
      }
      function S(x, P) {
        if (x.const)
          N(x.const, P);
        else if (x.enum)
          for (const R of x.enum)
            N(R, P);
        else
          throw new Error(`discriminator: "properties/${f}" must have "const" or "enum"`);
      }
      function N(x, P) {
        if (typeof x != "string" || x in u)
          throw new Error(`discriminator: "${f}" values must be unique strings`);
        u[x] = P;
      }
    }
  }
};
Sp.default = RH;
const kH = "http://json-schema.org/draft-07/schema#", $H = "http://json-schema.org/draft-07/schema#", GH = "Core schema meta-schema", VH = {
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
}, WH = [
  "object",
  "boolean"
], XH = {
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
}, qH = {
  $schema: kH,
  $id: $H,
  title: GH,
  definitions: VH,
  type: WH,
  properties: XH,
  default: !0
};
(function(A, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const t = iv, n = tp, i = Sp, o = qH, l = ["/properties"], f = "http://json-schema.org/draft-07/schema";
  class c extends t.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((u) => this.addVocabulary(u)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const u = this.opts.$data ? this.$dataMetaSchema(o, l) : o;
      this.addMetaSchema(u, f, !1), this.refs["http://json-schema.org/schema"] = f;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(f) ? f : void 0);
    }
  }
  e.Ajv = c, A.exports = e = c, A.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
  var h = zn;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return h.KeywordCxt;
  } });
  var m = we;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return m._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return m.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return m.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return m.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return m.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return m.CodeGen;
  } });
  var B = $s;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return B.default;
  } });
  var g = go;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return g.default;
  } });
})(Wh, Wh.exports);
var zH = Wh.exports;
const e0 = /* @__PURE__ */ Ic(zH), JH = "http://json-schema.org/draft-07/schema#", jH = "Generated schema for Root", YH = "object", ZH = {
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
}, AS = [
  "genome"
], eS = {
  $schema: JH,
  title: jH,
  type: YH,
  properties: ZH,
  required: AS
}, tS = new e0(), dw = tS.compile(eS), nS = function() {
  var A = function(e) {
    var i;
    if (!dw(e))
      throw console.log("annotation json:", e), console.log("Invalid data:", dw.errors), new Error("Invalid data");
    var n = {};
    return n.features = (i = e.genome.features) == null ? void 0 : i.map((o) => ({
      ...o,
      midpoint: (o.end - o.start) / 2 + o.start,
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
}, rS = "http://json-schema.org/draft-07/schema#", iS = "Generated schema for Root", aS = "object", oS = {
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
}, sS = [
  "chromosomes"
], uS = {
  $schema: rS,
  title: iS,
  type: aS,
  properties: oS,
  required: sS
}, lS = new e0(), pw = lS.compile(uS), cS = function() {
  var A = function(e) {
    if (!pw(e))
      throw console.log("json:", e), console.log("Invalid data:", pw.errors), new Error("Invalid data");
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
}, fS = function() {
  var A = function(n) {
    var i = new Array(8 - n.length + 1).join("0");
    let o = "#" + i + n.substring(2, n.length);
    return o == "#00FF00" && (o = "#208000"), o;
  }, e = function(n) {
    return n.chromosomes.forEach(function(i) {
      i.annotations = {
        allGenes: [],
        genes: [],
        qtls: [],
        snps: []
      }, i.bands || (i.bands = []), i.bands.forEach(function(o) {
        o.color = A(o.color);
      });
    }), n;
  }, t = function(n) {
    var i = e(n[0]), o = n[1];
    return o.features.forEach(function(l) {
      l.color = A(l.color);
    }), o.features.filter(function(l) {
      return l.type.toLowerCase() === "gene";
    }).forEach(function(l, f) {
      l.globalIndex = f;
    }), i.chromosomes.forEach(function(l) {
      var f = o.features.filter(function(F) {
        return F.chromosome === l.number;
      }), c = f.filter(function(F) {
        return F.type.toLowerCase() === "gene";
      }), h = f.filter(function(F) {
        return F.type.toLowerCase() === "qtl";
      }), m = f.filter(function(F) {
        return F.type.toLowerCase() === "snp";
      }), B = m.reduce(function(F, U) {
        return Math.min(F, U.pvalue);
      }, 1);
      m.forEach(function(F, U) {
        F.id = l.number + "_" + U, F.importance = Math.log(F.pvalue) / Math.log(B);
      }), h.forEach(function(F, U) {
        F.id = l.number + "_" + U, F.selected = !1;
      }), h.reduce(function(F, U) {
        return Math.max(F, U.score);
      }, 0);
      var g = 0.9, v = 3.5, u = function(F) {
        return g - 0.5 + 1 / (1 + Math.pow(F, v));
      };
      c.forEach(function(F, U) {
        F.visible = !1, F.hidden = !1, F.displayed = !1, F.importance = u(U);
      });
      var C = c.slice(0, 100);
      l.annotations = {
        genes: C,
        allGenes: c,
        qtls: h,
        snps: m
      };
    }), i;
  };
  return {
    readData: async function(n, i, o) {
      var l = cS();
      let f;
      if (o ? f = l.readBasemapFromRawJSON(n) : f = await l.readBasemap(n), i) {
        var c = nS();
        let m;
        o ? m = c.readAnnotationJSONFromRawJSON(i) : m = c.readAnnotation(i);
        var h = Promise.all([f, m]).then(
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
var oc = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
oc.exports;
(function(A, e) {
  (function() {
    var t, n = "4.17.21", i = 200, o = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", f = "Invalid `variable` option passed into `_.template`", c = "__lodash_hash_undefined__", h = 500, m = "__lodash_placeholder__", B = 1, g = 2, v = 4, u = 1, C = 2, F = 1, U = 2, S = 4, N = 8, x = 16, P = 32, R = 64, J = 128, fA = 256, uA = 512, BA = 30, FA = "...", NA = 800, xA = 16, X = 1, CA = 2, tA = 3, hA = 1 / 0, _A = 9007199254740991, IA = 17976931348623157e292, aA = NaN, D = 4294967295, eA = D - 1, j = D >>> 1, T = [
      ["ary", J],
      ["bind", F],
      ["bindKey", U],
      ["curry", N],
      ["curryRight", x],
      ["flip", uA],
      ["partial", P],
      ["partialRight", R],
      ["rearg", fA]
    ], k = "[object Arguments]", rA = "[object Array]", UA = "[object AsyncFunction]", EA = "[object Boolean]", zA = "[object Date]", ne = "[object DOMException]", JA = "[object Error]", RA = "[object Function]", sA = "[object GeneratorFunction]", vA = "[object Map]", bA = "[object Number]", te = "[object Null]", me = "[object Object]", Ue = "[object Promise]", Ze = "[object Proxy]", Te = "[object RegExp]", $e = "[object Set]", Pe = "[object String]", _e = "[object Symbol]", Mt = "[object Undefined]", bt = "[object WeakMap]", Pt = "[object WeakSet]", _t = "[object ArrayBuffer]", mt = "[object DataView]", hn = "[object Float32Array]", vr = "[object Float64Array]", xi = "[object Int8Array]", zr = "[object Int16Array]", Jr = "[object Int32Array]", cA = "[object Uint8Array]", DA = "[object Uint8ClampedArray]", XA = "[object Uint16Array]", ve = "[object Uint32Array]", ye = /\b__p \+= '';/g, ut = /\b(__p \+=) '' \+/g, xt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, xn = /&(?:amp|lt|gt|quot|#39);/g, Ii = /[&<>"']/g, In = RegExp(xn.source), Hi = RegExp(Ii.source), jr = /<%-([\s\S]+?)%>/g, dn = /<%([\s\S]+?)%>/g, Si = /<%=([\s\S]+?)%>/g, Yr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, yr = /^\w*$/, Ys = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, vo = /[\\^$.*+?()[\]{}|]/g, Cr = RegExp(vo.source), ha = /^\s+/, Li = /\s/, Zs = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Au = /\{\n\/\* \[wrapped with (.+)\] \*/, da = /,? & /, eu = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, pa = /[()=,{}\[\]\/\s]/, yo = /\\(\\)?/g, tu = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Yn = /\w*$/, Zn = /^[-+]0x[0-9a-f]+$/i, Yc = /^0b[01]+$/i, Co = /^\[object .+?Constructor\]$/, Qo = /^0o[0-7]+$/i, Zc = /^(?:0|[1-9]\d*)$/, Af = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, ga = /($^)/, ef = /['\n\r\u2028\u2029\\]/g, Ti = "\\ud800-\\udfff", nu = "\\u0300-\\u036f", ru = "\\ufe20-\\ufe2f", iu = "\\u20d0-\\u20ff", Fo = nu + ru + iu, Uo = "\\u2700-\\u27bf", Eo = "a-z\\xdf-\\xf6\\xf8-\\xff", au = "\\xac\\xb1\\xd7\\xf7", It = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Zr = "\\u2000-\\u206f", Ba = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", ou = "A-Z\\xc0-\\xd6\\xd8-\\xde", su = "\\ufe0e\\ufe0f", bo = au + It + Zr + Ba, Ai = "['’]", uu = "[" + Ti + "]", lu = "[" + bo + "]", wa = "[" + Fo + "]", qt = "\\d+", tf = "[" + Uo + "]", cu = "[" + Eo + "]", Qr = "[^" + Ti + bo + qt + Uo + Eo + ou + "]", ma = "\\ud83c[\\udffb-\\udfff]", Hn = "(?:" + wa + "|" + ma + ")", va = "[^" + Ti + "]", Sn = "(?:\\ud83c[\\udde6-\\uddff]){2}", ei = "[\\ud800-\\udbff][\\udc00-\\udfff]", ti = "[" + ou + "]", fu = "\\u200d", ya = "(?:" + cu + "|" + Qr + ")", Fr = "(?:" + ti + "|" + Qr + ")", hu = "(?:" + Ai + "(?:d|ll|m|re|s|t|ve))?", Ca = "(?:" + Ai + "(?:D|LL|M|RE|S|T|VE))?", Qa = Hn + "?", du = "[" + su + "]?", nf = "(?:" + fu + "(?:" + [va, Sn, ei].join("|") + ")" + du + Qa + ")*", pu = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rf = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", gu = du + Qa + nf, af = "(?:" + [tf, Sn, ei].join("|") + ")" + gu, of = "(?:" + [va + wa + "?", wa, Sn, ei, uu].join("|") + ")", Bu = RegExp(Ai, "g"), wu = RegExp(wa, "g"), Di = RegExp(ma + "(?=" + ma + ")|" + of + gu, "g"), mu = RegExp([
      ti + "?" + cu + "+" + hu + "(?=" + [lu, ti, "$"].join("|") + ")",
      Fr + "+" + Ca + "(?=" + [lu, ti + ya, "$"].join("|") + ")",
      ti + "?" + ya + "+" + hu,
      ti + "+" + Ca,
      rf,
      pu,
      qt,
      af
    ].join("|"), "g"), _o = RegExp("[" + fu + Ti + Fo + su + "]"), ni = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, vu = [
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
    ], yu = -1, Me = {};
    Me[hn] = Me[vr] = Me[xi] = Me[zr] = Me[Jr] = Me[cA] = Me[DA] = Me[XA] = Me[ve] = !0, Me[k] = Me[rA] = Me[_t] = Me[EA] = Me[mt] = Me[zA] = Me[JA] = Me[RA] = Me[vA] = Me[bA] = Me[me] = Me[Te] = Me[$e] = Me[Pe] = Me[bt] = !1;
    var Ke = {};
    Ke[k] = Ke[rA] = Ke[_t] = Ke[mt] = Ke[EA] = Ke[zA] = Ke[hn] = Ke[vr] = Ke[xi] = Ke[zr] = Ke[Jr] = Ke[vA] = Ke[bA] = Ke[me] = Ke[Te] = Ke[$e] = Ke[Pe] = Ke[_e] = Ke[cA] = Ke[DA] = Ke[XA] = Ke[ve] = !0, Ke[JA] = Ke[RA] = Ke[bt] = !1;
    var sf = {
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
    }, uf = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, lf = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, cf = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, ff = parseFloat, Cu = parseInt, Qu = typeof Ji == "object" && Ji && Ji.Object === Object && Ji, hf = typeof self == "object" && self && self.Object === Object && self, et = Qu || hf || Function("return this")(), xo = e && !e.nodeType && e, pn = xo && !0 && A && !A.nodeType && A, ri = pn && pn.exports === xo, Oi = ri && Qu.process, Kt = function() {
      try {
        var Y = pn && pn.require && pn.require("util").types;
        return Y || Oi && Oi.binding && Oi.binding("util");
      } catch {
      }
    }(), Io = Kt && Kt.isArrayBuffer, Fa = Kt && Kt.isDate, Ho = Kt && Kt.isMap, So = Kt && Kt.isRegExp, Fu = Kt && Kt.isSet, Uu = Kt && Kt.isTypedArray;
    function s(Y, oA, iA) {
      switch (iA.length) {
        case 0:
          return Y.call(oA);
        case 1:
          return Y.call(oA, iA[0]);
        case 2:
          return Y.call(oA, iA[0], iA[1]);
        case 3:
          return Y.call(oA, iA[0], iA[1], iA[2]);
      }
      return Y.apply(oA, iA);
    }
    function d(Y, oA, iA, OA) {
      for (var ae = -1, Ie = Y == null ? 0 : Y.length; ++ae < Ie; ) {
        var tt = Y[ae];
        oA(OA, tt, iA(tt), Y);
      }
      return OA;
    }
    function w(Y, oA) {
      for (var iA = -1, OA = Y == null ? 0 : Y.length; ++iA < OA && oA(Y[iA], iA, Y) !== !1; )
        ;
      return Y;
    }
    function y(Y, oA) {
      for (var iA = Y == null ? 0 : Y.length; iA-- && oA(Y[iA], iA, Y) !== !1; )
        ;
      return Y;
    }
    function E(Y, oA) {
      for (var iA = -1, OA = Y == null ? 0 : Y.length; ++iA < OA; )
        if (!oA(Y[iA], iA, Y))
          return !1;
      return !0;
    }
    function b(Y, oA) {
      for (var iA = -1, OA = Y == null ? 0 : Y.length, ae = 0, Ie = []; ++iA < OA; ) {
        var tt = Y[iA];
        oA(tt, iA, Y) && (Ie[ae++] = tt);
      }
      return Ie;
    }
    function H(Y, oA) {
      var iA = Y == null ? 0 : Y.length;
      return !!iA && Je(Y, oA, 0) > -1;
    }
    function K(Y, oA, iA) {
      for (var OA = -1, ae = Y == null ? 0 : Y.length; ++OA < ae; )
        if (iA(oA, Y[OA]))
          return !0;
      return !1;
    }
    function W(Y, oA) {
      for (var iA = -1, OA = Y == null ? 0 : Y.length, ae = Array(OA); ++iA < OA; )
        ae[iA] = oA(Y[iA], iA, Y);
      return ae;
    }
    function q(Y, oA) {
      for (var iA = -1, OA = oA.length, ae = Y.length; ++iA < OA; )
        Y[ae + iA] = oA[iA];
      return Y;
    }
    function AA(Y, oA, iA, OA) {
      var ae = -1, Ie = Y == null ? 0 : Y.length;
      for (OA && Ie && (iA = Y[++ae]); ++ae < Ie; )
        iA = oA(iA, Y[ae], ae, Y);
      return iA;
    }
    function mA(Y, oA, iA, OA) {
      var ae = Y == null ? 0 : Y.length;
      for (OA && ae && (iA = Y[--ae]); ae--; )
        iA = oA(iA, Y[ae], ae, Y);
      return iA;
    }
    function SA(Y, oA) {
      for (var iA = -1, OA = Y == null ? 0 : Y.length; ++iA < OA; )
        if (oA(Y[iA], iA, Y))
          return !0;
      return !1;
    }
    var yA = le("length");
    function ie(Y) {
      return Y.split("");
    }
    function YA(Y) {
      return Y.match(eu) || [];
    }
    function ue(Y, oA, iA) {
      var OA;
      return iA(Y, function(ae, Ie, tt) {
        if (oA(ae, Ie, tt))
          return OA = Ie, !1;
      }), OA;
    }
    function pt(Y, oA, iA, OA) {
      for (var ae = Y.length, Ie = iA + (OA ? 1 : -1); OA ? Ie-- : ++Ie < ae; )
        if (oA(Y[Ie], Ie, Y))
          return Ie;
      return -1;
    }
    function Je(Y, oA, iA) {
      return oA === oA ? _a(Y, oA, iA) : pt(Y, KA, iA);
    }
    function Ar(Y, oA, iA, OA) {
      for (var ae = iA - 1, Ie = Y.length; ++ae < Ie; )
        if (OA(Y[ae], oA))
          return ae;
      return -1;
    }
    function KA(Y) {
      return Y !== Y;
    }
    function ct(Y, oA) {
      var iA = Y == null ? 0 : Y.length;
      return iA ? Ht(Y, oA) / iA : aA;
    }
    function le(Y) {
      return function(oA) {
        return oA == null ? t : oA[Y];
      };
    }
    function qe(Y) {
      return function(oA) {
        return Y == null ? t : Y[oA];
      };
    }
    function Ln(Y, oA, iA, OA, ae) {
      return ae(Y, function(Ie, tt, Ee) {
        iA = OA ? (OA = !1, Ie) : oA(iA, Ie, tt, Ee);
      }), iA;
    }
    function Ua(Y, oA) {
      var iA = Y.length;
      for (Y.sort(oA); iA--; )
        Y[iA] = Y[iA].value;
      return Y;
    }
    function Ht(Y, oA) {
      for (var iA, OA = -1, ae = Y.length; ++OA < ae; ) {
        var Ie = oA(Y[OA]);
        Ie !== t && (iA = iA === t ? Ie : iA + Ie);
      }
      return iA;
    }
    function Tn(Y, oA) {
      for (var iA = -1, OA = Array(Y); ++iA < Y; )
        OA[iA] = oA(iA);
      return OA;
    }
    function er(Y, oA) {
      return W(oA, function(iA) {
        return [iA, Y[iA]];
      });
    }
    function Dn(Y) {
      return Y && Y.slice(0, xu(Y) + 1).replace(ha, "");
    }
    function Re(Y) {
      return function(oA) {
        return Y(oA);
      };
    }
    function St(Y, oA) {
      return W(oA, function(iA) {
        return Y[iA];
      });
    }
    function Ni(Y, oA) {
      return Y.has(oA);
    }
    function On(Y, oA) {
      for (var iA = -1, OA = Y.length; ++iA < OA && Je(oA, Y[iA], 0) > -1; )
        ;
      return iA;
    }
    function Lo(Y, oA) {
      for (var iA = Y.length; iA-- && Je(oA, Y[iA], 0) > -1; )
        ;
      return iA;
    }
    function Ur(Y, oA) {
      for (var iA = Y.length, OA = 0; iA--; )
        Y[iA] === oA && ++OA;
      return OA;
    }
    var To = qe(sf), De = qe(uf);
    function Er(Y) {
      return "\\" + cf[Y];
    }
    function Eu(Y, oA) {
      return Y == null ? t : Y[oA];
    }
    function tr(Y) {
      return _o.test(Y);
    }
    function df(Y) {
      return ni.test(Y);
    }
    function Ea(Y) {
      for (var oA, iA = []; !(oA = Y.next()).done; )
        iA.push(oA.value);
      return iA;
    }
    function Do(Y) {
      var oA = -1, iA = Array(Y.size);
      return Y.forEach(function(OA, ae) {
        iA[++oA] = [ae, OA];
      }), iA;
    }
    function bu(Y, oA) {
      return function(iA) {
        return Y(oA(iA));
      };
    }
    function nr(Y, oA) {
      for (var iA = -1, OA = Y.length, ae = 0, Ie = []; ++iA < OA; ) {
        var tt = Y[iA];
        (tt === oA || tt === m) && (Y[iA] = m, Ie[ae++] = iA);
      }
      return Ie;
    }
    function ba(Y) {
      var oA = -1, iA = Array(Y.size);
      return Y.forEach(function(OA) {
        iA[++oA] = OA;
      }), iA;
    }
    function _u(Y) {
      var oA = -1, iA = Array(Y.size);
      return Y.forEach(function(OA) {
        iA[++oA] = [OA, OA];
      }), iA;
    }
    function _a(Y, oA, iA) {
      for (var OA = iA - 1, ae = Y.length; ++OA < ae; )
        if (Y[OA] === oA)
          return OA;
      return -1;
    }
    function pf(Y, oA, iA) {
      for (var OA = iA + 1; OA--; )
        if (Y[OA] === oA)
          return OA;
      return OA;
    }
    function ii(Y) {
      return tr(Y) ? gf(Y) : yA(Y);
    }
    function vt(Y) {
      return tr(Y) ? Nn(Y) : ie(Y);
    }
    function xu(Y) {
      for (var oA = Y.length; oA-- && Li.test(Y.charAt(oA)); )
        ;
      return oA;
    }
    var Oo = qe(lf);
    function gf(Y) {
      for (var oA = Di.lastIndex = 0; Di.test(Y); )
        ++oA;
      return oA;
    }
    function Nn(Y) {
      return Y.match(Di) || [];
    }
    function Mn(Y) {
      return Y.match(mu) || [];
    }
    var Iu = function Y(oA) {
      oA = oA == null ? et : xe.defaults(et.Object(), oA, xe.pick(et, vu));
      var iA = oA.Array, OA = oA.Date, ae = oA.Error, Ie = oA.Function, tt = oA.Math, Ee = oA.Object, Mi = oA.RegExp, Hu = oA.String, yt = oA.TypeError, ai = iA.prototype, No = Ie.prototype, oi = Ee.prototype, br = oA["__core-js_shared__"], si = No.toString, He = oi.hasOwnProperty, Bf = 0, M = function() {
        var r = /[^.]+$/.exec(br && br.keys && br.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), G = oi.toString, z = si.call(Ee), lA = et._, nA = Mi(
        "^" + si.call(He).replace(vo, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), wA = ri ? oA.Buffer : t, dA = oA.Symbol, HA = oA.Uint8Array, GA = wA ? wA.allocUnsafe : t, re = bu(Ee.getPrototypeOf, Ee), VA = Ee.create, ZA = oi.propertyIsEnumerable, fe = ai.splice, Se = dA ? dA.isConcatSpreadable : t, qA = dA ? dA.iterator : t, Ge = dA ? dA.toStringTag : t, nt = function() {
        try {
          var r = Gi(Ee, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), Rt = oA.clearTimeout !== et.clearTimeout && oA.clearTimeout, We = OA && OA.now !== et.Date.now && OA.now, Pi = oA.setTimeout !== et.setTimeout && oA.setTimeout, rr = tt.ceil, gt = tt.floor, wf = Ee.getOwnPropertySymbols, oC = wA ? wA.isBuffer : t, ig = oA.isFinite, sC = ai.join, uC = bu(Ee.keys, Ee), ft = tt.max, Lt = tt.min, lC = OA.now, cC = oA.parseInt, ag = tt.random, fC = ai.reverse, mf = Gi(oA, "DataView"), Mo = Gi(oA, "Map"), vf = Gi(oA, "Promise"), xa = Gi(oA, "Set"), Po = Gi(oA, "WeakMap"), Ko = Gi(Ee, "create"), Su = Po && new Po(), Ia = {}, hC = Vi(mf), dC = Vi(Mo), pC = Vi(vf), gC = Vi(xa), BC = Vi(Po), Lu = dA ? dA.prototype : t, Ro = Lu ? Lu.valueOf : t, og = Lu ? Lu.toString : t;
      function L(r) {
        if (At(r) && !ce(r) && !(r instanceof Qe)) {
          if (r instanceof gn)
            return r;
          if (He.call(r, "__wrapped__"))
            return sB(r);
        }
        return new gn(r);
      }
      var Ha = /* @__PURE__ */ function() {
        function r() {
        }
        return function(a) {
          if (!Ye(a))
            return {};
          if (VA)
            return VA(a);
          r.prototype = a;
          var p = new r();
          return r.prototype = t, p;
        };
      }();
      function Tu() {
      }
      function gn(r, a) {
        this.__wrapped__ = r, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
      }
      L.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: jr,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: dn,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: Si,
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
      }, L.prototype = Tu.prototype, L.prototype.constructor = L, gn.prototype = Ha(Tu.prototype), gn.prototype.constructor = gn;
      function Qe(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = D, this.__views__ = [];
      }
      function wC() {
        var r = new Qe(this.__wrapped__);
        return r.__actions__ = zt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = zt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = zt(this.__views__), r;
      }
      function mC() {
        if (this.__filtered__) {
          var r = new Qe(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function vC() {
        var r = this.__wrapped__.value(), a = this.__dir__, p = ce(r), Q = a < 0, I = p ? r.length : 0, O = SQ(0, I, this.__views__), $ = O.start, V = O.end, Z = V - $, pA = Q ? V : $ - 1, gA = this.__iteratees__, QA = gA.length, LA = 0, kA = Lt(Z, this.__takeCount__);
        if (!p || !Q && I == Z && kA == Z)
          return Hg(r, this.__actions__);
        var Ae = [];
        A:
          for (; Z-- && LA < kA; ) {
            pA += a;
            for (var pe = -1, ee = r[pA]; ++pe < QA; ) {
              var Ce = gA[pe], be = Ce.iteratee, sn = Ce.type, Gt = be(ee);
              if (sn == CA)
                ee = Gt;
              else if (!Gt) {
                if (sn == X)
                  continue A;
                break A;
              }
            }
            Ae[LA++] = ee;
          }
        return Ae;
      }
      Qe.prototype = Ha(Tu.prototype), Qe.prototype.constructor = Qe;
      function Ki(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.clear(); ++a < p; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function yC() {
        this.__data__ = Ko ? Ko(null) : {}, this.size = 0;
      }
      function CC(r) {
        var a = this.has(r) && delete this.__data__[r];
        return this.size -= a ? 1 : 0, a;
      }
      function QC(r) {
        var a = this.__data__;
        if (Ko) {
          var p = a[r];
          return p === c ? t : p;
        }
        return He.call(a, r) ? a[r] : t;
      }
      function FC(r) {
        var a = this.__data__;
        return Ko ? a[r] !== t : He.call(a, r);
      }
      function UC(r, a) {
        var p = this.__data__;
        return this.size += this.has(r) ? 0 : 1, p[r] = Ko && a === t ? c : a, this;
      }
      Ki.prototype.clear = yC, Ki.prototype.delete = CC, Ki.prototype.get = QC, Ki.prototype.has = FC, Ki.prototype.set = UC;
      function _r(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.clear(); ++a < p; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function EC() {
        this.__data__ = [], this.size = 0;
      }
      function bC(r) {
        var a = this.__data__, p = Du(a, r);
        if (p < 0)
          return !1;
        var Q = a.length - 1;
        return p == Q ? a.pop() : fe.call(a, p, 1), --this.size, !0;
      }
      function _C(r) {
        var a = this.__data__, p = Du(a, r);
        return p < 0 ? t : a[p][1];
      }
      function xC(r) {
        return Du(this.__data__, r) > -1;
      }
      function IC(r, a) {
        var p = this.__data__, Q = Du(p, r);
        return Q < 0 ? (++this.size, p.push([r, a])) : p[Q][1] = a, this;
      }
      _r.prototype.clear = EC, _r.prototype.delete = bC, _r.prototype.get = _C, _r.prototype.has = xC, _r.prototype.set = IC;
      function xr(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.clear(); ++a < p; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function HC() {
        this.size = 0, this.__data__ = {
          hash: new Ki(),
          map: new (Mo || _r)(),
          string: new Ki()
        };
      }
      function SC(r) {
        var a = Xu(this, r).delete(r);
        return this.size -= a ? 1 : 0, a;
      }
      function LC(r) {
        return Xu(this, r).get(r);
      }
      function TC(r) {
        return Xu(this, r).has(r);
      }
      function DC(r, a) {
        var p = Xu(this, r), Q = p.size;
        return p.set(r, a), this.size += p.size == Q ? 0 : 1, this;
      }
      xr.prototype.clear = HC, xr.prototype.delete = SC, xr.prototype.get = LC, xr.prototype.has = TC, xr.prototype.set = DC;
      function Ri(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.__data__ = new xr(); ++a < p; )
          this.add(r[a]);
      }
      function OC(r) {
        return this.__data__.set(r, c), this;
      }
      function NC(r) {
        return this.__data__.has(r);
      }
      Ri.prototype.add = Ri.prototype.push = OC, Ri.prototype.has = NC;
      function Pn(r) {
        var a = this.__data__ = new _r(r);
        this.size = a.size;
      }
      function MC() {
        this.__data__ = new _r(), this.size = 0;
      }
      function PC(r) {
        var a = this.__data__, p = a.delete(r);
        return this.size = a.size, p;
      }
      function KC(r) {
        return this.__data__.get(r);
      }
      function RC(r) {
        return this.__data__.has(r);
      }
      function kC(r, a) {
        var p = this.__data__;
        if (p instanceof _r) {
          var Q = p.__data__;
          if (!Mo || Q.length < i - 1)
            return Q.push([r, a]), this.size = ++p.size, this;
          p = this.__data__ = new xr(Q);
        }
        return p.set(r, a), this.size = p.size, this;
      }
      Pn.prototype.clear = MC, Pn.prototype.delete = PC, Pn.prototype.get = KC, Pn.prototype.has = RC, Pn.prototype.set = kC;
      function sg(r, a) {
        var p = ce(r), Q = !p && Wi(r), I = !p && !Q && hi(r), O = !p && !Q && !I && Da(r), $ = p || Q || I || O, V = $ ? Tn(r.length, Hu) : [], Z = V.length;
        for (var pA in r)
          (a || He.call(r, pA)) && !($ && // Safari 9 has enumerable `arguments.length` in strict mode.
          (pA == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          I && (pA == "offset" || pA == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          O && (pA == "buffer" || pA == "byteLength" || pA == "byteOffset") || // Skip index properties.
          Lr(pA, Z))) && V.push(pA);
        return V;
      }
      function ug(r) {
        var a = r.length;
        return a ? r[Hf(0, a - 1)] : t;
      }
      function $C(r, a) {
        return qu(zt(r), ki(a, 0, r.length));
      }
      function GC(r) {
        return qu(zt(r));
      }
      function yf(r, a, p) {
        (p !== t && !Kn(r[a], p) || p === t && !(a in r)) && Ir(r, a, p);
      }
      function ko(r, a, p) {
        var Q = r[a];
        (!(He.call(r, a) && Kn(Q, p)) || p === t && !(a in r)) && Ir(r, a, p);
      }
      function Du(r, a) {
        for (var p = r.length; p--; )
          if (Kn(r[p][0], a))
            return p;
        return -1;
      }
      function VC(r, a, p, Q) {
        return ui(r, function(I, O, $) {
          a(Q, I, p(I), $);
        }), Q;
      }
      function lg(r, a) {
        return r && ar(a, Bt(a), r);
      }
      function WC(r, a) {
        return r && ar(a, jt(a), r);
      }
      function Ir(r, a, p) {
        a == "__proto__" && nt ? nt(r, a, {
          configurable: !0,
          enumerable: !0,
          value: p,
          writable: !0
        }) : r[a] = p;
      }
      function Cf(r, a) {
        for (var p = -1, Q = a.length, I = iA(Q), O = r == null; ++p < Q; )
          I[p] = O ? t : th(r, a[p]);
        return I;
      }
      function ki(r, a, p) {
        return r === r && (p !== t && (r = r <= p ? r : p), a !== t && (r = r >= a ? r : a)), r;
      }
      function Bn(r, a, p, Q, I, O) {
        var $, V = a & B, Z = a & g, pA = a & v;
        if (p && ($ = I ? p(r, Q, I, O) : p(r)), $ !== t)
          return $;
        if (!Ye(r))
          return r;
        var gA = ce(r);
        if (gA) {
          if ($ = TQ(r), !V)
            return zt(r, $);
        } else {
          var QA = Tt(r), LA = QA == RA || QA == sA;
          if (hi(r))
            return Tg(r, V);
          if (QA == me || QA == k || LA && !I) {
            if ($ = Z || LA ? {} : Zg(r), !V)
              return Z ? QQ(r, WC($, r)) : CQ(r, lg($, r));
          } else {
            if (!Ke[QA])
              return I ? r : {};
            $ = DQ(r, QA, V);
          }
        }
        O || (O = new Pn());
        var kA = O.get(r);
        if (kA)
          return kA;
        O.set(r, $), _B(r) ? r.forEach(function(ee) {
          $.add(Bn(ee, a, p, ee, r, O));
        }) : EB(r) && r.forEach(function(ee, Ce) {
          $.set(Ce, Bn(ee, a, p, Ce, r, O));
        });
        var Ae = pA ? Z ? kf : Rf : Z ? jt : Bt, pe = gA ? t : Ae(r);
        return w(pe || r, function(ee, Ce) {
          pe && (Ce = ee, ee = r[Ce]), ko($, Ce, Bn(ee, a, p, Ce, r, O));
        }), $;
      }
      function XC(r) {
        var a = Bt(r);
        return function(p) {
          return cg(p, r, a);
        };
      }
      function cg(r, a, p) {
        var Q = p.length;
        if (r == null)
          return !Q;
        for (r = Ee(r); Q--; ) {
          var I = p[Q], O = a[I], $ = r[I];
          if ($ === t && !(I in r) || !O($))
            return !1;
        }
        return !0;
      }
      function fg(r, a, p) {
        if (typeof r != "function")
          throw new yt(l);
        return zo(function() {
          r.apply(t, p);
        }, a);
      }
      function $o(r, a, p, Q) {
        var I = -1, O = H, $ = !0, V = r.length, Z = [], pA = a.length;
        if (!V)
          return Z;
        p && (a = W(a, Re(p))), Q ? (O = K, $ = !1) : a.length >= i && (O = Ni, $ = !1, a = new Ri(a));
        A:
          for (; ++I < V; ) {
            var gA = r[I], QA = p == null ? gA : p(gA);
            if (gA = Q || gA !== 0 ? gA : 0, $ && QA === QA) {
              for (var LA = pA; LA--; )
                if (a[LA] === QA)
                  continue A;
              Z.push(gA);
            } else O(a, QA, Q) || Z.push(gA);
          }
        return Z;
      }
      var ui = Pg(ir), hg = Pg(Ff, !0);
      function qC(r, a) {
        var p = !0;
        return ui(r, function(Q, I, O) {
          return p = !!a(Q, I, O), p;
        }), p;
      }
      function Ou(r, a, p) {
        for (var Q = -1, I = r.length; ++Q < I; ) {
          var O = r[Q], $ = a(O);
          if ($ != null && (V === t ? $ === $ && !on($) : p($, V)))
            var V = $, Z = O;
        }
        return Z;
      }
      function zC(r, a, p, Q) {
        var I = r.length;
        for (p = he(p), p < 0 && (p = -p > I ? 0 : I + p), Q = Q === t || Q > I ? I : he(Q), Q < 0 && (Q += I), Q = p > Q ? 0 : IB(Q); p < Q; )
          r[p++] = a;
        return r;
      }
      function dg(r, a) {
        var p = [];
        return ui(r, function(Q, I, O) {
          a(Q, I, O) && p.push(Q);
        }), p;
      }
      function Ct(r, a, p, Q, I) {
        var O = -1, $ = r.length;
        for (p || (p = NQ), I || (I = []); ++O < $; ) {
          var V = r[O];
          a > 0 && p(V) ? a > 1 ? Ct(V, a - 1, p, Q, I) : q(I, V) : Q || (I[I.length] = V);
        }
        return I;
      }
      var Qf = Kg(), pg = Kg(!0);
      function ir(r, a) {
        return r && Qf(r, a, Bt);
      }
      function Ff(r, a) {
        return r && pg(r, a, Bt);
      }
      function Nu(r, a) {
        return b(a, function(p) {
          return Tr(r[p]);
        });
      }
      function $i(r, a) {
        a = ci(a, r);
        for (var p = 0, Q = a.length; r != null && p < Q; )
          r = r[or(a[p++])];
        return p && p == Q ? r : t;
      }
      function gg(r, a, p) {
        var Q = a(r);
        return ce(r) ? Q : q(Q, p(r));
      }
      function kt(r) {
        return r == null ? r === t ? Mt : te : Ge && Ge in Ee(r) ? HQ(r) : GQ(r);
      }
      function Uf(r, a) {
        return r > a;
      }
      function JC(r, a) {
        return r != null && He.call(r, a);
      }
      function jC(r, a) {
        return r != null && a in Ee(r);
      }
      function YC(r, a, p) {
        return r >= Lt(a, p) && r < ft(a, p);
      }
      function Ef(r, a, p) {
        for (var Q = p ? K : H, I = r[0].length, O = r.length, $ = O, V = iA(O), Z = 1 / 0, pA = []; $--; ) {
          var gA = r[$];
          $ && a && (gA = W(gA, Re(a))), Z = Lt(gA.length, Z), V[$] = !p && (a || I >= 120 && gA.length >= 120) ? new Ri($ && gA) : t;
        }
        gA = r[0];
        var QA = -1, LA = V[0];
        A:
          for (; ++QA < I && pA.length < Z; ) {
            var kA = gA[QA], Ae = a ? a(kA) : kA;
            if (kA = p || kA !== 0 ? kA : 0, !(LA ? Ni(LA, Ae) : Q(pA, Ae, p))) {
              for ($ = O; --$; ) {
                var pe = V[$];
                if (!(pe ? Ni(pe, Ae) : Q(r[$], Ae, p)))
                  continue A;
              }
              LA && LA.push(Ae), pA.push(kA);
            }
          }
        return pA;
      }
      function ZC(r, a, p, Q) {
        return ir(r, function(I, O, $) {
          a(Q, p(I), O, $);
        }), Q;
      }
      function Go(r, a, p) {
        a = ci(a, r), r = nB(r, a);
        var Q = r == null ? r : r[or(mn(a))];
        return Q == null ? t : s(Q, r, p);
      }
      function Bg(r) {
        return At(r) && kt(r) == k;
      }
      function AQ(r) {
        return At(r) && kt(r) == _t;
      }
      function eQ(r) {
        return At(r) && kt(r) == zA;
      }
      function Vo(r, a, p, Q, I) {
        return r === a ? !0 : r == null || a == null || !At(r) && !At(a) ? r !== r && a !== a : tQ(r, a, p, Q, Vo, I);
      }
      function tQ(r, a, p, Q, I, O) {
        var $ = ce(r), V = ce(a), Z = $ ? rA : Tt(r), pA = V ? rA : Tt(a);
        Z = Z == k ? me : Z, pA = pA == k ? me : pA;
        var gA = Z == me, QA = pA == me, LA = Z == pA;
        if (LA && hi(r)) {
          if (!hi(a))
            return !1;
          $ = !0, gA = !1;
        }
        if (LA && !gA)
          return O || (O = new Pn()), $ || Da(r) ? Jg(r, a, p, Q, I, O) : xQ(r, a, Z, p, Q, I, O);
        if (!(p & u)) {
          var kA = gA && He.call(r, "__wrapped__"), Ae = QA && He.call(a, "__wrapped__");
          if (kA || Ae) {
            var pe = kA ? r.value() : r, ee = Ae ? a.value() : a;
            return O || (O = new Pn()), I(pe, ee, p, Q, O);
          }
        }
        return LA ? (O || (O = new Pn()), IQ(r, a, p, Q, I, O)) : !1;
      }
      function nQ(r) {
        return At(r) && Tt(r) == vA;
      }
      function bf(r, a, p, Q) {
        var I = p.length, O = I, $ = !Q;
        if (r == null)
          return !O;
        for (r = Ee(r); I--; ) {
          var V = p[I];
          if ($ && V[2] ? V[1] !== r[V[0]] : !(V[0] in r))
            return !1;
        }
        for (; ++I < O; ) {
          V = p[I];
          var Z = V[0], pA = r[Z], gA = V[1];
          if ($ && V[2]) {
            if (pA === t && !(Z in r))
              return !1;
          } else {
            var QA = new Pn();
            if (Q)
              var LA = Q(pA, gA, Z, r, a, QA);
            if (!(LA === t ? Vo(gA, pA, u | C, Q, QA) : LA))
              return !1;
          }
        }
        return !0;
      }
      function wg(r) {
        if (!Ye(r) || PQ(r))
          return !1;
        var a = Tr(r) ? nA : Co;
        return a.test(Vi(r));
      }
      function rQ(r) {
        return At(r) && kt(r) == Te;
      }
      function iQ(r) {
        return At(r) && Tt(r) == $e;
      }
      function aQ(r) {
        return At(r) && Al(r.length) && !!Me[kt(r)];
      }
      function mg(r) {
        return typeof r == "function" ? r : r == null ? Yt : typeof r == "object" ? ce(r) ? Cg(r[0], r[1]) : yg(r) : RB(r);
      }
      function _f(r) {
        if (!qo(r))
          return uC(r);
        var a = [];
        for (var p in Ee(r))
          He.call(r, p) && p != "constructor" && a.push(p);
        return a;
      }
      function oQ(r) {
        if (!Ye(r))
          return $Q(r);
        var a = qo(r), p = [];
        for (var Q in r)
          Q == "constructor" && (a || !He.call(r, Q)) || p.push(Q);
        return p;
      }
      function xf(r, a) {
        return r < a;
      }
      function vg(r, a) {
        var p = -1, Q = Jt(r) ? iA(r.length) : [];
        return ui(r, function(I, O, $) {
          Q[++p] = a(I, O, $);
        }), Q;
      }
      function yg(r) {
        var a = Gf(r);
        return a.length == 1 && a[0][2] ? eB(a[0][0], a[0][1]) : function(p) {
          return p === r || bf(p, r, a);
        };
      }
      function Cg(r, a) {
        return Wf(r) && AB(a) ? eB(or(r), a) : function(p) {
          var Q = th(p, r);
          return Q === t && Q === a ? nh(p, r) : Vo(a, Q, u | C);
        };
      }
      function Mu(r, a, p, Q, I) {
        r !== a && Qf(a, function(O, $) {
          if (I || (I = new Pn()), Ye(O))
            sQ(r, a, $, p, Mu, Q, I);
          else {
            var V = Q ? Q(qf(r, $), O, $ + "", r, a, I) : t;
            V === t && (V = O), yf(r, $, V);
          }
        }, jt);
      }
      function sQ(r, a, p, Q, I, O, $) {
        var V = qf(r, p), Z = qf(a, p), pA = $.get(Z);
        if (pA) {
          yf(r, p, pA);
          return;
        }
        var gA = O ? O(V, Z, p + "", r, a, $) : t, QA = gA === t;
        if (QA) {
          var LA = ce(Z), kA = !LA && hi(Z), Ae = !LA && !kA && Da(Z);
          gA = Z, LA || kA || Ae ? ce(V) ? gA = V : rt(V) ? gA = zt(V) : kA ? (QA = !1, gA = Tg(Z, !0)) : Ae ? (QA = !1, gA = Dg(Z, !0)) : gA = [] : Jo(Z) || Wi(Z) ? (gA = V, Wi(V) ? gA = HB(V) : (!Ye(V) || Tr(V)) && (gA = Zg(Z))) : QA = !1;
        }
        QA && ($.set(Z, gA), I(gA, Z, Q, O, $), $.delete(Z)), yf(r, p, gA);
      }
      function Qg(r, a) {
        var p = r.length;
        if (p)
          return a += a < 0 ? p : 0, Lr(a, p) ? r[a] : t;
      }
      function Fg(r, a, p) {
        a.length ? a = W(a, function(O) {
          return ce(O) ? function($) {
            return $i($, O.length === 1 ? O[0] : O);
          } : O;
        }) : a = [Yt];
        var Q = -1;
        a = W(a, Re(jA()));
        var I = vg(r, function(O, $, V) {
          var Z = W(a, function(pA) {
            return pA(O);
          });
          return { criteria: Z, index: ++Q, value: O };
        });
        return Ua(I, function(O, $) {
          return yQ(O, $, p);
        });
      }
      function uQ(r, a) {
        return Ug(r, a, function(p, Q) {
          return nh(r, Q);
        });
      }
      function Ug(r, a, p) {
        for (var Q = -1, I = a.length, O = {}; ++Q < I; ) {
          var $ = a[Q], V = $i(r, $);
          p(V, $) && Wo(O, ci($, r), V);
        }
        return O;
      }
      function lQ(r) {
        return function(a) {
          return $i(a, r);
        };
      }
      function If(r, a, p, Q) {
        var I = Q ? Ar : Je, O = -1, $ = a.length, V = r;
        for (r === a && (a = zt(a)), p && (V = W(r, Re(p))); ++O < $; )
          for (var Z = 0, pA = a[O], gA = p ? p(pA) : pA; (Z = I(V, gA, Z, Q)) > -1; )
            V !== r && fe.call(V, Z, 1), fe.call(r, Z, 1);
        return r;
      }
      function Eg(r, a) {
        for (var p = r ? a.length : 0, Q = p - 1; p--; ) {
          var I = a[p];
          if (p == Q || I !== O) {
            var O = I;
            Lr(I) ? fe.call(r, I, 1) : Tf(r, I);
          }
        }
        return r;
      }
      function Hf(r, a) {
        return r + gt(ag() * (a - r + 1));
      }
      function cQ(r, a, p, Q) {
        for (var I = -1, O = ft(rr((a - r) / (p || 1)), 0), $ = iA(O); O--; )
          $[Q ? O : ++I] = r, r += p;
        return $;
      }
      function Sf(r, a) {
        var p = "";
        if (!r || a < 1 || a > _A)
          return p;
        do
          a % 2 && (p += r), a = gt(a / 2), a && (r += r);
        while (a);
        return p;
      }
      function ge(r, a) {
        return zf(tB(r, a, Yt), r + "");
      }
      function fQ(r) {
        return ug(Oa(r));
      }
      function hQ(r, a) {
        var p = Oa(r);
        return qu(p, ki(a, 0, p.length));
      }
      function Wo(r, a, p, Q) {
        if (!Ye(r))
          return r;
        a = ci(a, r);
        for (var I = -1, O = a.length, $ = O - 1, V = r; V != null && ++I < O; ) {
          var Z = or(a[I]), pA = p;
          if (Z === "__proto__" || Z === "constructor" || Z === "prototype")
            return r;
          if (I != $) {
            var gA = V[Z];
            pA = Q ? Q(gA, Z, V) : t, pA === t && (pA = Ye(gA) ? gA : Lr(a[I + 1]) ? [] : {});
          }
          ko(V, Z, pA), V = V[Z];
        }
        return r;
      }
      var bg = Su ? function(r, a) {
        return Su.set(r, a), r;
      } : Yt, dQ = nt ? function(r, a) {
        return nt(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: ih(a),
          writable: !0
        });
      } : Yt;
      function pQ(r) {
        return qu(Oa(r));
      }
      function wn(r, a, p) {
        var Q = -1, I = r.length;
        a < 0 && (a = -a > I ? 0 : I + a), p = p > I ? I : p, p < 0 && (p += I), I = a > p ? 0 : p - a >>> 0, a >>>= 0;
        for (var O = iA(I); ++Q < I; )
          O[Q] = r[Q + a];
        return O;
      }
      function gQ(r, a) {
        var p;
        return ui(r, function(Q, I, O) {
          return p = a(Q, I, O), !p;
        }), !!p;
      }
      function Pu(r, a, p) {
        var Q = 0, I = r == null ? Q : r.length;
        if (typeof a == "number" && a === a && I <= j) {
          for (; Q < I; ) {
            var O = Q + I >>> 1, $ = r[O];
            $ !== null && !on($) && (p ? $ <= a : $ < a) ? Q = O + 1 : I = O;
          }
          return I;
        }
        return Lf(r, a, Yt, p);
      }
      function Lf(r, a, p, Q) {
        var I = 0, O = r == null ? 0 : r.length;
        if (O === 0)
          return 0;
        a = p(a);
        for (var $ = a !== a, V = a === null, Z = on(a), pA = a === t; I < O; ) {
          var gA = gt((I + O) / 2), QA = p(r[gA]), LA = QA !== t, kA = QA === null, Ae = QA === QA, pe = on(QA);
          if ($)
            var ee = Q || Ae;
          else pA ? ee = Ae && (Q || LA) : V ? ee = Ae && LA && (Q || !kA) : Z ? ee = Ae && LA && !kA && (Q || !pe) : kA || pe ? ee = !1 : ee = Q ? QA <= a : QA < a;
          ee ? I = gA + 1 : O = gA;
        }
        return Lt(O, eA);
      }
      function _g(r, a) {
        for (var p = -1, Q = r.length, I = 0, O = []; ++p < Q; ) {
          var $ = r[p], V = a ? a($) : $;
          if (!p || !Kn(V, Z)) {
            var Z = V;
            O[I++] = $ === 0 ? 0 : $;
          }
        }
        return O;
      }
      function xg(r) {
        return typeof r == "number" ? r : on(r) ? aA : +r;
      }
      function an(r) {
        if (typeof r == "string")
          return r;
        if (ce(r))
          return W(r, an) + "";
        if (on(r))
          return og ? og.call(r) : "";
        var a = r + "";
        return a == "0" && 1 / r == -hA ? "-0" : a;
      }
      function li(r, a, p) {
        var Q = -1, I = H, O = r.length, $ = !0, V = [], Z = V;
        if (p)
          $ = !1, I = K;
        else if (O >= i) {
          var pA = a ? null : bQ(r);
          if (pA)
            return ba(pA);
          $ = !1, I = Ni, Z = new Ri();
        } else
          Z = a ? [] : V;
        A:
          for (; ++Q < O; ) {
            var gA = r[Q], QA = a ? a(gA) : gA;
            if (gA = p || gA !== 0 ? gA : 0, $ && QA === QA) {
              for (var LA = Z.length; LA--; )
                if (Z[LA] === QA)
                  continue A;
              a && Z.push(QA), V.push(gA);
            } else I(Z, QA, p) || (Z !== V && Z.push(QA), V.push(gA));
          }
        return V;
      }
      function Tf(r, a) {
        return a = ci(a, r), r = nB(r, a), r == null || delete r[or(mn(a))];
      }
      function Ig(r, a, p, Q) {
        return Wo(r, a, p($i(r, a)), Q);
      }
      function Ku(r, a, p, Q) {
        for (var I = r.length, O = Q ? I : -1; (Q ? O-- : ++O < I) && a(r[O], O, r); )
          ;
        return p ? wn(r, Q ? 0 : O, Q ? O + 1 : I) : wn(r, Q ? O + 1 : 0, Q ? I : O);
      }
      function Hg(r, a) {
        var p = r;
        return p instanceof Qe && (p = p.value()), AA(a, function(Q, I) {
          return I.func.apply(I.thisArg, q([Q], I.args));
        }, p);
      }
      function Df(r, a, p) {
        var Q = r.length;
        if (Q < 2)
          return Q ? li(r[0]) : [];
        for (var I = -1, O = iA(Q); ++I < Q; )
          for (var $ = r[I], V = -1; ++V < Q; )
            V != I && (O[I] = $o(O[I] || $, r[V], a, p));
        return li(Ct(O, 1), a, p);
      }
      function Sg(r, a, p) {
        for (var Q = -1, I = r.length, O = a.length, $ = {}; ++Q < I; ) {
          var V = Q < O ? a[Q] : t;
          p($, r[Q], V);
        }
        return $;
      }
      function Of(r) {
        return rt(r) ? r : [];
      }
      function Nf(r) {
        return typeof r == "function" ? r : Yt;
      }
      function ci(r, a) {
        return ce(r) ? r : Wf(r, a) ? [r] : oB(Oe(r));
      }
      var BQ = ge;
      function fi(r, a, p) {
        var Q = r.length;
        return p = p === t ? Q : p, !a && p >= Q ? r : wn(r, a, p);
      }
      var Lg = Rt || function(r) {
        return et.clearTimeout(r);
      };
      function Tg(r, a) {
        if (a)
          return r.slice();
        var p = r.length, Q = GA ? GA(p) : new r.constructor(p);
        return r.copy(Q), Q;
      }
      function Mf(r) {
        var a = new r.constructor(r.byteLength);
        return new HA(a).set(new HA(r)), a;
      }
      function wQ(r, a) {
        var p = a ? Mf(r.buffer) : r.buffer;
        return new r.constructor(p, r.byteOffset, r.byteLength);
      }
      function mQ(r) {
        var a = new r.constructor(r.source, Yn.exec(r));
        return a.lastIndex = r.lastIndex, a;
      }
      function vQ(r) {
        return Ro ? Ee(Ro.call(r)) : {};
      }
      function Dg(r, a) {
        var p = a ? Mf(r.buffer) : r.buffer;
        return new r.constructor(p, r.byteOffset, r.length);
      }
      function Og(r, a) {
        if (r !== a) {
          var p = r !== t, Q = r === null, I = r === r, O = on(r), $ = a !== t, V = a === null, Z = a === a, pA = on(a);
          if (!V && !pA && !O && r > a || O && $ && Z && !V && !pA || Q && $ && Z || !p && Z || !I)
            return 1;
          if (!Q && !O && !pA && r < a || pA && p && I && !Q && !O || V && p && I || !$ && I || !Z)
            return -1;
        }
        return 0;
      }
      function yQ(r, a, p) {
        for (var Q = -1, I = r.criteria, O = a.criteria, $ = I.length, V = p.length; ++Q < $; ) {
          var Z = Og(I[Q], O[Q]);
          if (Z) {
            if (Q >= V)
              return Z;
            var pA = p[Q];
            return Z * (pA == "desc" ? -1 : 1);
          }
        }
        return r.index - a.index;
      }
      function Ng(r, a, p, Q) {
        for (var I = -1, O = r.length, $ = p.length, V = -1, Z = a.length, pA = ft(O - $, 0), gA = iA(Z + pA), QA = !Q; ++V < Z; )
          gA[V] = a[V];
        for (; ++I < $; )
          (QA || I < O) && (gA[p[I]] = r[I]);
        for (; pA--; )
          gA[V++] = r[I++];
        return gA;
      }
      function Mg(r, a, p, Q) {
        for (var I = -1, O = r.length, $ = -1, V = p.length, Z = -1, pA = a.length, gA = ft(O - V, 0), QA = iA(gA + pA), LA = !Q; ++I < gA; )
          QA[I] = r[I];
        for (var kA = I; ++Z < pA; )
          QA[kA + Z] = a[Z];
        for (; ++$ < V; )
          (LA || I < O) && (QA[kA + p[$]] = r[I++]);
        return QA;
      }
      function zt(r, a) {
        var p = -1, Q = r.length;
        for (a || (a = iA(Q)); ++p < Q; )
          a[p] = r[p];
        return a;
      }
      function ar(r, a, p, Q) {
        var I = !p;
        p || (p = {});
        for (var O = -1, $ = a.length; ++O < $; ) {
          var V = a[O], Z = Q ? Q(p[V], r[V], V, p, r) : t;
          Z === t && (Z = r[V]), I ? Ir(p, V, Z) : ko(p, V, Z);
        }
        return p;
      }
      function CQ(r, a) {
        return ar(r, Vf(r), a);
      }
      function QQ(r, a) {
        return ar(r, jg(r), a);
      }
      function Ru(r, a) {
        return function(p, Q) {
          var I = ce(p) ? d : VC, O = a ? a() : {};
          return I(p, r, jA(Q, 2), O);
        };
      }
      function Sa(r) {
        return ge(function(a, p) {
          var Q = -1, I = p.length, O = I > 1 ? p[I - 1] : t, $ = I > 2 ? p[2] : t;
          for (O = r.length > 3 && typeof O == "function" ? (I--, O) : t, $ && $t(p[0], p[1], $) && (O = I < 3 ? t : O, I = 1), a = Ee(a); ++Q < I; ) {
            var V = p[Q];
            V && r(a, V, Q, O);
          }
          return a;
        });
      }
      function Pg(r, a) {
        return function(p, Q) {
          if (p == null)
            return p;
          if (!Jt(p))
            return r(p, Q);
          for (var I = p.length, O = a ? I : -1, $ = Ee(p); (a ? O-- : ++O < I) && Q($[O], O, $) !== !1; )
            ;
          return p;
        };
      }
      function Kg(r) {
        return function(a, p, Q) {
          for (var I = -1, O = Ee(a), $ = Q(a), V = $.length; V--; ) {
            var Z = $[r ? V : ++I];
            if (p(O[Z], Z, O) === !1)
              break;
          }
          return a;
        };
      }
      function FQ(r, a, p) {
        var Q = a & F, I = Xo(r);
        function O() {
          var $ = this && this !== et && this instanceof O ? I : r;
          return $.apply(Q ? p : this, arguments);
        }
        return O;
      }
      function Rg(r) {
        return function(a) {
          a = Oe(a);
          var p = tr(a) ? vt(a) : t, Q = p ? p[0] : a.charAt(0), I = p ? fi(p, 1).join("") : a.slice(1);
          return Q[r]() + I;
        };
      }
      function La(r) {
        return function(a) {
          return AA(PB(MB(a).replace(Bu, "")), r, "");
        };
      }
      function Xo(r) {
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
          var p = Ha(r.prototype), Q = r.apply(p, a);
          return Ye(Q) ? Q : p;
        };
      }
      function UQ(r, a, p) {
        var Q = Xo(r);
        function I() {
          for (var O = arguments.length, $ = iA(O), V = O, Z = Ta(I); V--; )
            $[V] = arguments[V];
          var pA = O < 3 && $[0] !== Z && $[O - 1] !== Z ? [] : nr($, Z);
          if (O -= pA.length, O < p)
            return Wg(
              r,
              a,
              ku,
              I.placeholder,
              t,
              $,
              pA,
              t,
              t,
              p - O
            );
          var gA = this && this !== et && this instanceof I ? Q : r;
          return s(gA, this, $);
        }
        return I;
      }
      function kg(r) {
        return function(a, p, Q) {
          var I = Ee(a);
          if (!Jt(a)) {
            var O = jA(p, 3);
            a = Bt(a), p = function(V) {
              return O(I[V], V, I);
            };
          }
          var $ = r(a, p, Q);
          return $ > -1 ? I[O ? a[$] : $] : t;
        };
      }
      function $g(r) {
        return Sr(function(a) {
          var p = a.length, Q = p, I = gn.prototype.thru;
          for (r && a.reverse(); Q--; ) {
            var O = a[Q];
            if (typeof O != "function")
              throw new yt(l);
            if (I && !$ && Wu(O) == "wrapper")
              var $ = new gn([], !0);
          }
          for (Q = $ ? Q : p; ++Q < p; ) {
            O = a[Q];
            var V = Wu(O), Z = V == "wrapper" ? $f(O) : t;
            Z && Xf(Z[0]) && Z[1] == (J | N | P | fA) && !Z[4].length && Z[9] == 1 ? $ = $[Wu(Z[0])].apply($, Z[3]) : $ = O.length == 1 && Xf(O) ? $[V]() : $.thru(O);
          }
          return function() {
            var pA = arguments, gA = pA[0];
            if ($ && pA.length == 1 && ce(gA))
              return $.plant(gA).value();
            for (var QA = 0, LA = p ? a[QA].apply(this, pA) : gA; ++QA < p; )
              LA = a[QA].call(this, LA);
            return LA;
          };
        });
      }
      function ku(r, a, p, Q, I, O, $, V, Z, pA) {
        var gA = a & J, QA = a & F, LA = a & U, kA = a & (N | x), Ae = a & uA, pe = LA ? t : Xo(r);
        function ee() {
          for (var Ce = arguments.length, be = iA(Ce), sn = Ce; sn--; )
            be[sn] = arguments[sn];
          if (kA)
            var Gt = Ta(ee), un = Ur(be, Gt);
          if (Q && (be = Ng(be, Q, I, kA)), O && (be = Mg(be, O, $, kA)), Ce -= un, kA && Ce < pA) {
            var it = nr(be, Gt);
            return Wg(
              r,
              a,
              ku,
              ee.placeholder,
              p,
              be,
              it,
              V,
              Z,
              pA - Ce
            );
          }
          var Rn = QA ? p : this, Or = LA ? Rn[r] : r;
          return Ce = be.length, V ? be = VQ(be, V) : Ae && Ce > 1 && be.reverse(), gA && Z < Ce && (be.length = Z), this && this !== et && this instanceof ee && (Or = pe || Xo(Or)), Or.apply(Rn, be);
        }
        return ee;
      }
      function Gg(r, a) {
        return function(p, Q) {
          return ZC(p, r, a(Q), {});
        };
      }
      function $u(r, a) {
        return function(p, Q) {
          var I;
          if (p === t && Q === t)
            return a;
          if (p !== t && (I = p), Q !== t) {
            if (I === t)
              return Q;
            typeof p == "string" || typeof Q == "string" ? (p = an(p), Q = an(Q)) : (p = xg(p), Q = xg(Q)), I = r(p, Q);
          }
          return I;
        };
      }
      function Pf(r) {
        return Sr(function(a) {
          return a = W(a, Re(jA())), ge(function(p) {
            var Q = this;
            return r(a, function(I) {
              return s(I, Q, p);
            });
          });
        });
      }
      function Gu(r, a) {
        a = a === t ? " " : an(a);
        var p = a.length;
        if (p < 2)
          return p ? Sf(a, r) : a;
        var Q = Sf(a, rr(r / ii(a)));
        return tr(a) ? fi(vt(Q), 0, r).join("") : Q.slice(0, r);
      }
      function EQ(r, a, p, Q) {
        var I = a & F, O = Xo(r);
        function $() {
          for (var V = -1, Z = arguments.length, pA = -1, gA = Q.length, QA = iA(gA + Z), LA = this && this !== et && this instanceof $ ? O : r; ++pA < gA; )
            QA[pA] = Q[pA];
          for (; Z--; )
            QA[pA++] = arguments[++V];
          return s(LA, I ? p : this, QA);
        }
        return $;
      }
      function Vg(r) {
        return function(a, p, Q) {
          return Q && typeof Q != "number" && $t(a, p, Q) && (p = Q = t), a = Dr(a), p === t ? (p = a, a = 0) : p = Dr(p), Q = Q === t ? a < p ? 1 : -1 : Dr(Q), cQ(a, p, Q, r);
        };
      }
      function Vu(r) {
        return function(a, p) {
          return typeof a == "string" && typeof p == "string" || (a = vn(a), p = vn(p)), r(a, p);
        };
      }
      function Wg(r, a, p, Q, I, O, $, V, Z, pA) {
        var gA = a & N, QA = gA ? $ : t, LA = gA ? t : $, kA = gA ? O : t, Ae = gA ? t : O;
        a |= gA ? P : R, a &= ~(gA ? R : P), a & S || (a &= ~(F | U));
        var pe = [
          r,
          a,
          I,
          kA,
          QA,
          Ae,
          LA,
          V,
          Z,
          pA
        ], ee = p.apply(t, pe);
        return Xf(r) && rB(ee, pe), ee.placeholder = Q, iB(ee, r, a);
      }
      function Kf(r) {
        var a = tt[r];
        return function(p, Q) {
          if (p = vn(p), Q = Q == null ? 0 : Lt(he(Q), 292), Q && ig(p)) {
            var I = (Oe(p) + "e").split("e"), O = a(I[0] + "e" + (+I[1] + Q));
            return I = (Oe(O) + "e").split("e"), +(I[0] + "e" + (+I[1] - Q));
          }
          return a(p);
        };
      }
      var bQ = xa && 1 / ba(new xa([, -0]))[1] == hA ? function(r) {
        return new xa(r);
      } : sh;
      function Xg(r) {
        return function(a) {
          var p = Tt(a);
          return p == vA ? Do(a) : p == $e ? _u(a) : er(a, r(a));
        };
      }
      function Hr(r, a, p, Q, I, O, $, V) {
        var Z = a & U;
        if (!Z && typeof r != "function")
          throw new yt(l);
        var pA = Q ? Q.length : 0;
        if (pA || (a &= ~(P | R), Q = I = t), $ = $ === t ? $ : ft(he($), 0), V = V === t ? V : he(V), pA -= I ? I.length : 0, a & R) {
          var gA = Q, QA = I;
          Q = I = t;
        }
        var LA = Z ? t : $f(r), kA = [
          r,
          a,
          p,
          Q,
          I,
          gA,
          QA,
          O,
          $,
          V
        ];
        if (LA && kQ(kA, LA), r = kA[0], a = kA[1], p = kA[2], Q = kA[3], I = kA[4], V = kA[9] = kA[9] === t ? Z ? 0 : r.length : ft(kA[9] - pA, 0), !V && a & (N | x) && (a &= ~(N | x)), !a || a == F)
          var Ae = FQ(r, a, p);
        else a == N || a == x ? Ae = UQ(r, a, V) : (a == P || a == (F | P)) && !I.length ? Ae = EQ(r, a, p, Q) : Ae = ku.apply(t, kA);
        var pe = LA ? bg : rB;
        return iB(pe(Ae, kA), r, a);
      }
      function qg(r, a, p, Q) {
        return r === t || Kn(r, oi[p]) && !He.call(Q, p) ? a : r;
      }
      function zg(r, a, p, Q, I, O) {
        return Ye(r) && Ye(a) && (O.set(a, r), Mu(r, a, t, zg, O), O.delete(a)), r;
      }
      function _Q(r) {
        return Jo(r) ? t : r;
      }
      function Jg(r, a, p, Q, I, O) {
        var $ = p & u, V = r.length, Z = a.length;
        if (V != Z && !($ && Z > V))
          return !1;
        var pA = O.get(r), gA = O.get(a);
        if (pA && gA)
          return pA == a && gA == r;
        var QA = -1, LA = !0, kA = p & C ? new Ri() : t;
        for (O.set(r, a), O.set(a, r); ++QA < V; ) {
          var Ae = r[QA], pe = a[QA];
          if (Q)
            var ee = $ ? Q(pe, Ae, QA, a, r, O) : Q(Ae, pe, QA, r, a, O);
          if (ee !== t) {
            if (ee)
              continue;
            LA = !1;
            break;
          }
          if (kA) {
            if (!SA(a, function(Ce, be) {
              if (!Ni(kA, be) && (Ae === Ce || I(Ae, Ce, p, Q, O)))
                return kA.push(be);
            })) {
              LA = !1;
              break;
            }
          } else if (!(Ae === pe || I(Ae, pe, p, Q, O))) {
            LA = !1;
            break;
          }
        }
        return O.delete(r), O.delete(a), LA;
      }
      function xQ(r, a, p, Q, I, O, $) {
        switch (p) {
          case mt:
            if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
              return !1;
            r = r.buffer, a = a.buffer;
          case _t:
            return !(r.byteLength != a.byteLength || !O(new HA(r), new HA(a)));
          case EA:
          case zA:
          case bA:
            return Kn(+r, +a);
          case JA:
            return r.name == a.name && r.message == a.message;
          case Te:
          case Pe:
            return r == a + "";
          case vA:
            var V = Do;
          case $e:
            var Z = Q & u;
            if (V || (V = ba), r.size != a.size && !Z)
              return !1;
            var pA = $.get(r);
            if (pA)
              return pA == a;
            Q |= C, $.set(r, a);
            var gA = Jg(V(r), V(a), Q, I, O, $);
            return $.delete(r), gA;
          case _e:
            if (Ro)
              return Ro.call(r) == Ro.call(a);
        }
        return !1;
      }
      function IQ(r, a, p, Q, I, O) {
        var $ = p & u, V = Rf(r), Z = V.length, pA = Rf(a), gA = pA.length;
        if (Z != gA && !$)
          return !1;
        for (var QA = Z; QA--; ) {
          var LA = V[QA];
          if (!($ ? LA in a : He.call(a, LA)))
            return !1;
        }
        var kA = O.get(r), Ae = O.get(a);
        if (kA && Ae)
          return kA == a && Ae == r;
        var pe = !0;
        O.set(r, a), O.set(a, r);
        for (var ee = $; ++QA < Z; ) {
          LA = V[QA];
          var Ce = r[LA], be = a[LA];
          if (Q)
            var sn = $ ? Q(be, Ce, LA, a, r, O) : Q(Ce, be, LA, r, a, O);
          if (!(sn === t ? Ce === be || I(Ce, be, p, Q, O) : sn)) {
            pe = !1;
            break;
          }
          ee || (ee = LA == "constructor");
        }
        if (pe && !ee) {
          var Gt = r.constructor, un = a.constructor;
          Gt != un && "constructor" in r && "constructor" in a && !(typeof Gt == "function" && Gt instanceof Gt && typeof un == "function" && un instanceof un) && (pe = !1);
        }
        return O.delete(r), O.delete(a), pe;
      }
      function Sr(r) {
        return zf(tB(r, t, cB), r + "");
      }
      function Rf(r) {
        return gg(r, Bt, Vf);
      }
      function kf(r) {
        return gg(r, jt, jg);
      }
      var $f = Su ? function(r) {
        return Su.get(r);
      } : sh;
      function Wu(r) {
        for (var a = r.name + "", p = Ia[a], Q = He.call(Ia, a) ? p.length : 0; Q--; ) {
          var I = p[Q], O = I.func;
          if (O == null || O == r)
            return I.name;
        }
        return a;
      }
      function Ta(r) {
        var a = He.call(L, "placeholder") ? L : r;
        return a.placeholder;
      }
      function jA() {
        var r = L.iteratee || ah;
        return r = r === ah ? mg : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Xu(r, a) {
        var p = r.__data__;
        return MQ(a) ? p[typeof a == "string" ? "string" : "hash"] : p.map;
      }
      function Gf(r) {
        for (var a = Bt(r), p = a.length; p--; ) {
          var Q = a[p], I = r[Q];
          a[p] = [Q, I, AB(I)];
        }
        return a;
      }
      function Gi(r, a) {
        var p = Eu(r, a);
        return wg(p) ? p : t;
      }
      function HQ(r) {
        var a = He.call(r, Ge), p = r[Ge];
        try {
          r[Ge] = t;
          var Q = !0;
        } catch {
        }
        var I = G.call(r);
        return Q && (a ? r[Ge] = p : delete r[Ge]), I;
      }
      var Vf = wf ? function(r) {
        return r == null ? [] : (r = Ee(r), b(wf(r), function(a) {
          return ZA.call(r, a);
        }));
      } : uh, jg = wf ? function(r) {
        for (var a = []; r; )
          q(a, Vf(r)), r = re(r);
        return a;
      } : uh, Tt = kt;
      (mf && Tt(new mf(new ArrayBuffer(1))) != mt || Mo && Tt(new Mo()) != vA || vf && Tt(vf.resolve()) != Ue || xa && Tt(new xa()) != $e || Po && Tt(new Po()) != bt) && (Tt = function(r) {
        var a = kt(r), p = a == me ? r.constructor : t, Q = p ? Vi(p) : "";
        if (Q)
          switch (Q) {
            case hC:
              return mt;
            case dC:
              return vA;
            case pC:
              return Ue;
            case gC:
              return $e;
            case BC:
              return bt;
          }
        return a;
      });
      function SQ(r, a, p) {
        for (var Q = -1, I = p.length; ++Q < I; ) {
          var O = p[Q], $ = O.size;
          switch (O.type) {
            case "drop":
              r += $;
              break;
            case "dropRight":
              a -= $;
              break;
            case "take":
              a = Lt(a, r + $);
              break;
            case "takeRight":
              r = ft(r, a - $);
              break;
          }
        }
        return { start: r, end: a };
      }
      function LQ(r) {
        var a = r.match(Au);
        return a ? a[1].split(da) : [];
      }
      function Yg(r, a, p) {
        a = ci(a, r);
        for (var Q = -1, I = a.length, O = !1; ++Q < I; ) {
          var $ = or(a[Q]);
          if (!(O = r != null && p(r, $)))
            break;
          r = r[$];
        }
        return O || ++Q != I ? O : (I = r == null ? 0 : r.length, !!I && Al(I) && Lr($, I) && (ce(r) || Wi(r)));
      }
      function TQ(r) {
        var a = r.length, p = new r.constructor(a);
        return a && typeof r[0] == "string" && He.call(r, "index") && (p.index = r.index, p.input = r.input), p;
      }
      function Zg(r) {
        return typeof r.constructor == "function" && !qo(r) ? Ha(re(r)) : {};
      }
      function DQ(r, a, p) {
        var Q = r.constructor;
        switch (a) {
          case _t:
            return Mf(r);
          case EA:
          case zA:
            return new Q(+r);
          case mt:
            return wQ(r, p);
          case hn:
          case vr:
          case xi:
          case zr:
          case Jr:
          case cA:
          case DA:
          case XA:
          case ve:
            return Dg(r, p);
          case vA:
            return new Q();
          case bA:
          case Pe:
            return new Q(r);
          case Te:
            return mQ(r);
          case $e:
            return new Q();
          case _e:
            return vQ(r);
        }
      }
      function OQ(r, a) {
        var p = a.length;
        if (!p)
          return r;
        var Q = p - 1;
        return a[Q] = (p > 1 ? "& " : "") + a[Q], a = a.join(p > 2 ? ", " : " "), r.replace(Zs, `{
/* [wrapped with ` + a + `] */
`);
      }
      function NQ(r) {
        return ce(r) || Wi(r) || !!(Se && r && r[Se]);
      }
      function Lr(r, a) {
        var p = typeof r;
        return a = a ?? _A, !!a && (p == "number" || p != "symbol" && Zc.test(r)) && r > -1 && r % 1 == 0 && r < a;
      }
      function $t(r, a, p) {
        if (!Ye(p))
          return !1;
        var Q = typeof a;
        return (Q == "number" ? Jt(p) && Lr(a, p.length) : Q == "string" && a in p) ? Kn(p[a], r) : !1;
      }
      function Wf(r, a) {
        if (ce(r))
          return !1;
        var p = typeof r;
        return p == "number" || p == "symbol" || p == "boolean" || r == null || on(r) ? !0 : yr.test(r) || !Yr.test(r) || a != null && r in Ee(a);
      }
      function MQ(r) {
        var a = typeof r;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
      }
      function Xf(r) {
        var a = Wu(r), p = L[a];
        if (typeof p != "function" || !(a in Qe.prototype))
          return !1;
        if (r === p)
          return !0;
        var Q = $f(p);
        return !!Q && r === Q[0];
      }
      function PQ(r) {
        return !!M && M in r;
      }
      var KQ = br ? Tr : lh;
      function qo(r) {
        var a = r && r.constructor, p = typeof a == "function" && a.prototype || oi;
        return r === p;
      }
      function AB(r) {
        return r === r && !Ye(r);
      }
      function eB(r, a) {
        return function(p) {
          return p == null ? !1 : p[r] === a && (a !== t || r in Ee(p));
        };
      }
      function RQ(r) {
        var a = Yu(r, function(Q) {
          return p.size === h && p.clear(), Q;
        }), p = a.cache;
        return a;
      }
      function kQ(r, a) {
        var p = r[1], Q = a[1], I = p | Q, O = I < (F | U | J), $ = Q == J && p == N || Q == J && p == fA && r[7].length <= a[8] || Q == (J | fA) && a[7].length <= a[8] && p == N;
        if (!(O || $))
          return r;
        Q & F && (r[2] = a[2], I |= p & F ? 0 : S);
        var V = a[3];
        if (V) {
          var Z = r[3];
          r[3] = Z ? Ng(Z, V, a[4]) : V, r[4] = Z ? nr(r[3], m) : a[4];
        }
        return V = a[5], V && (Z = r[5], r[5] = Z ? Mg(Z, V, a[6]) : V, r[6] = Z ? nr(r[5], m) : a[6]), V = a[7], V && (r[7] = V), Q & J && (r[8] = r[8] == null ? a[8] : Lt(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = I, r;
      }
      function $Q(r) {
        var a = [];
        if (r != null)
          for (var p in Ee(r))
            a.push(p);
        return a;
      }
      function GQ(r) {
        return G.call(r);
      }
      function tB(r, a, p) {
        return a = ft(a === t ? r.length - 1 : a, 0), function() {
          for (var Q = arguments, I = -1, O = ft(Q.length - a, 0), $ = iA(O); ++I < O; )
            $[I] = Q[a + I];
          I = -1;
          for (var V = iA(a + 1); ++I < a; )
            V[I] = Q[I];
          return V[a] = p($), s(r, this, V);
        };
      }
      function nB(r, a) {
        return a.length < 2 ? r : $i(r, wn(a, 0, -1));
      }
      function VQ(r, a) {
        for (var p = r.length, Q = Lt(a.length, p), I = zt(r); Q--; ) {
          var O = a[Q];
          r[Q] = Lr(O, p) ? I[O] : t;
        }
        return r;
      }
      function qf(r, a) {
        if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
          return r[a];
      }
      var rB = aB(bg), zo = Pi || function(r, a) {
        return et.setTimeout(r, a);
      }, zf = aB(dQ);
      function iB(r, a, p) {
        var Q = a + "";
        return zf(r, OQ(Q, WQ(LQ(Q), p)));
      }
      function aB(r) {
        var a = 0, p = 0;
        return function() {
          var Q = lC(), I = xA - (Q - p);
          if (p = Q, I > 0) {
            if (++a >= NA)
              return arguments[0];
          } else
            a = 0;
          return r.apply(t, arguments);
        };
      }
      function qu(r, a) {
        var p = -1, Q = r.length, I = Q - 1;
        for (a = a === t ? Q : a; ++p < a; ) {
          var O = Hf(p, I), $ = r[O];
          r[O] = r[p], r[p] = $;
        }
        return r.length = a, r;
      }
      var oB = RQ(function(r) {
        var a = [];
        return r.charCodeAt(0) === 46 && a.push(""), r.replace(Ys, function(p, Q, I, O) {
          a.push(I ? O.replace(yo, "$1") : Q || p);
        }), a;
      });
      function or(r) {
        if (typeof r == "string" || on(r))
          return r;
        var a = r + "";
        return a == "0" && 1 / r == -hA ? "-0" : a;
      }
      function Vi(r) {
        if (r != null) {
          try {
            return si.call(r);
          } catch {
          }
          try {
            return r + "";
          } catch {
          }
        }
        return "";
      }
      function WQ(r, a) {
        return w(T, function(p) {
          var Q = "_." + p[0];
          a & p[1] && !H(r, Q) && r.push(Q);
        }), r.sort();
      }
      function sB(r) {
        if (r instanceof Qe)
          return r.clone();
        var a = new gn(r.__wrapped__, r.__chain__);
        return a.__actions__ = zt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
      }
      function XQ(r, a, p) {
        (p ? $t(r, a, p) : a === t) ? a = 1 : a = ft(he(a), 0);
        var Q = r == null ? 0 : r.length;
        if (!Q || a < 1)
          return [];
        for (var I = 0, O = 0, $ = iA(rr(Q / a)); I < Q; )
          $[O++] = wn(r, I, I += a);
        return $;
      }
      function qQ(r) {
        for (var a = -1, p = r == null ? 0 : r.length, Q = 0, I = []; ++a < p; ) {
          var O = r[a];
          O && (I[Q++] = O);
        }
        return I;
      }
      function zQ() {
        var r = arguments.length;
        if (!r)
          return [];
        for (var a = iA(r - 1), p = arguments[0], Q = r; Q--; )
          a[Q - 1] = arguments[Q];
        return q(ce(p) ? zt(p) : [p], Ct(a, 1));
      }
      var JQ = ge(function(r, a) {
        return rt(r) ? $o(r, Ct(a, 1, rt, !0)) : [];
      }), jQ = ge(function(r, a) {
        var p = mn(a);
        return rt(p) && (p = t), rt(r) ? $o(r, Ct(a, 1, rt, !0), jA(p, 2)) : [];
      }), YQ = ge(function(r, a) {
        var p = mn(a);
        return rt(p) && (p = t), rt(r) ? $o(r, Ct(a, 1, rt, !0), t, p) : [];
      });
      function ZQ(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : he(a), wn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function AF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : he(a), a = Q - a, wn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function eF(r, a) {
        return r && r.length ? Ku(r, jA(a, 3), !0, !0) : [];
      }
      function tF(r, a) {
        return r && r.length ? Ku(r, jA(a, 3), !0) : [];
      }
      function nF(r, a, p, Q) {
        var I = r == null ? 0 : r.length;
        return I ? (p && typeof p != "number" && $t(r, a, p) && (p = 0, Q = I), zC(r, a, p, Q)) : [];
      }
      function uB(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = p == null ? 0 : he(p);
        return I < 0 && (I = ft(Q + I, 0)), pt(r, jA(a, 3), I);
      }
      function lB(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = Q - 1;
        return p !== t && (I = he(p), I = p < 0 ? ft(Q + I, 0) : Lt(I, Q - 1)), pt(r, jA(a, 3), I, !0);
      }
      function cB(r) {
        var a = r == null ? 0 : r.length;
        return a ? Ct(r, 1) : [];
      }
      function rF(r) {
        var a = r == null ? 0 : r.length;
        return a ? Ct(r, hA) : [];
      }
      function iF(r, a) {
        var p = r == null ? 0 : r.length;
        return p ? (a = a === t ? 1 : he(a), Ct(r, a)) : [];
      }
      function aF(r) {
        for (var a = -1, p = r == null ? 0 : r.length, Q = {}; ++a < p; ) {
          var I = r[a];
          Q[I[0]] = I[1];
        }
        return Q;
      }
      function fB(r) {
        return r && r.length ? r[0] : t;
      }
      function oF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = p == null ? 0 : he(p);
        return I < 0 && (I = ft(Q + I, 0)), Je(r, a, I);
      }
      function sF(r) {
        var a = r == null ? 0 : r.length;
        return a ? wn(r, 0, -1) : [];
      }
      var uF = ge(function(r) {
        var a = W(r, Of);
        return a.length && a[0] === r[0] ? Ef(a) : [];
      }), lF = ge(function(r) {
        var a = mn(r), p = W(r, Of);
        return a === mn(p) ? a = t : p.pop(), p.length && p[0] === r[0] ? Ef(p, jA(a, 2)) : [];
      }), cF = ge(function(r) {
        var a = mn(r), p = W(r, Of);
        return a = typeof a == "function" ? a : t, a && p.pop(), p.length && p[0] === r[0] ? Ef(p, t, a) : [];
      });
      function fF(r, a) {
        return r == null ? "" : sC.call(r, a);
      }
      function mn(r) {
        var a = r == null ? 0 : r.length;
        return a ? r[a - 1] : t;
      }
      function hF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var I = Q;
        return p !== t && (I = he(p), I = I < 0 ? ft(Q + I, 0) : Lt(I, Q - 1)), a === a ? pf(r, a, I) : pt(r, KA, I, !0);
      }
      function dF(r, a) {
        return r && r.length ? Qg(r, he(a)) : t;
      }
      var pF = ge(hB);
      function hB(r, a) {
        return r && r.length && a && a.length ? If(r, a) : r;
      }
      function gF(r, a, p) {
        return r && r.length && a && a.length ? If(r, a, jA(p, 2)) : r;
      }
      function BF(r, a, p) {
        return r && r.length && a && a.length ? If(r, a, t, p) : r;
      }
      var wF = Sr(function(r, a) {
        var p = r == null ? 0 : r.length, Q = Cf(r, a);
        return Eg(r, W(a, function(I) {
          return Lr(I, p) ? +I : I;
        }).sort(Og)), Q;
      });
      function mF(r, a) {
        var p = [];
        if (!(r && r.length))
          return p;
        var Q = -1, I = [], O = r.length;
        for (a = jA(a, 3); ++Q < O; ) {
          var $ = r[Q];
          a($, Q, r) && (p.push($), I.push(Q));
        }
        return Eg(r, I), p;
      }
      function Jf(r) {
        return r == null ? r : fC.call(r);
      }
      function vF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (p && typeof p != "number" && $t(r, a, p) ? (a = 0, p = Q) : (a = a == null ? 0 : he(a), p = p === t ? Q : he(p)), wn(r, a, p)) : [];
      }
      function yF(r, a) {
        return Pu(r, a);
      }
      function CF(r, a, p) {
        return Lf(r, a, jA(p, 2));
      }
      function QF(r, a) {
        var p = r == null ? 0 : r.length;
        if (p) {
          var Q = Pu(r, a);
          if (Q < p && Kn(r[Q], a))
            return Q;
        }
        return -1;
      }
      function FF(r, a) {
        return Pu(r, a, !0);
      }
      function UF(r, a, p) {
        return Lf(r, a, jA(p, 2), !0);
      }
      function EF(r, a) {
        var p = r == null ? 0 : r.length;
        if (p) {
          var Q = Pu(r, a, !0) - 1;
          if (Kn(r[Q], a))
            return Q;
        }
        return -1;
      }
      function bF(r) {
        return r && r.length ? _g(r) : [];
      }
      function _F(r, a) {
        return r && r.length ? _g(r, jA(a, 2)) : [];
      }
      function xF(r) {
        var a = r == null ? 0 : r.length;
        return a ? wn(r, 1, a) : [];
      }
      function IF(r, a, p) {
        return r && r.length ? (a = p || a === t ? 1 : he(a), wn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function HF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : he(a), a = Q - a, wn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function SF(r, a) {
        return r && r.length ? Ku(r, jA(a, 3), !1, !0) : [];
      }
      function LF(r, a) {
        return r && r.length ? Ku(r, jA(a, 3)) : [];
      }
      var TF = ge(function(r) {
        return li(Ct(r, 1, rt, !0));
      }), DF = ge(function(r) {
        var a = mn(r);
        return rt(a) && (a = t), li(Ct(r, 1, rt, !0), jA(a, 2));
      }), OF = ge(function(r) {
        var a = mn(r);
        return a = typeof a == "function" ? a : t, li(Ct(r, 1, rt, !0), t, a);
      });
      function NF(r) {
        return r && r.length ? li(r) : [];
      }
      function MF(r, a) {
        return r && r.length ? li(r, jA(a, 2)) : [];
      }
      function PF(r, a) {
        return a = typeof a == "function" ? a : t, r && r.length ? li(r, t, a) : [];
      }
      function jf(r) {
        if (!(r && r.length))
          return [];
        var a = 0;
        return r = b(r, function(p) {
          if (rt(p))
            return a = ft(p.length, a), !0;
        }), Tn(a, function(p) {
          return W(r, le(p));
        });
      }
      function dB(r, a) {
        if (!(r && r.length))
          return [];
        var p = jf(r);
        return a == null ? p : W(p, function(Q) {
          return s(a, t, Q);
        });
      }
      var KF = ge(function(r, a) {
        return rt(r) ? $o(r, a) : [];
      }), RF = ge(function(r) {
        return Df(b(r, rt));
      }), kF = ge(function(r) {
        var a = mn(r);
        return rt(a) && (a = t), Df(b(r, rt), jA(a, 2));
      }), $F = ge(function(r) {
        var a = mn(r);
        return a = typeof a == "function" ? a : t, Df(b(r, rt), t, a);
      }), GF = ge(jf);
      function VF(r, a) {
        return Sg(r || [], a || [], ko);
      }
      function WF(r, a) {
        return Sg(r || [], a || [], Wo);
      }
      var XF = ge(function(r) {
        var a = r.length, p = a > 1 ? r[a - 1] : t;
        return p = typeof p == "function" ? (r.pop(), p) : t, dB(r, p);
      });
      function pB(r) {
        var a = L(r);
        return a.__chain__ = !0, a;
      }
      function qF(r, a) {
        return a(r), r;
      }
      function zu(r, a) {
        return a(r);
      }
      var zF = Sr(function(r) {
        var a = r.length, p = a ? r[0] : 0, Q = this.__wrapped__, I = function(O) {
          return Cf(O, r);
        };
        return a > 1 || this.__actions__.length || !(Q instanceof Qe) || !Lr(p) ? this.thru(I) : (Q = Q.slice(p, +p + (a ? 1 : 0)), Q.__actions__.push({
          func: zu,
          args: [I],
          thisArg: t
        }), new gn(Q, this.__chain__).thru(function(O) {
          return a && !O.length && O.push(t), O;
        }));
      });
      function JF() {
        return pB(this);
      }
      function jF() {
        return new gn(this.value(), this.__chain__);
      }
      function YF() {
        this.__values__ === t && (this.__values__ = xB(this.value()));
        var r = this.__index__ >= this.__values__.length, a = r ? t : this.__values__[this.__index__++];
        return { done: r, value: a };
      }
      function ZF() {
        return this;
      }
      function AU(r) {
        for (var a, p = this; p instanceof Tu; ) {
          var Q = sB(p);
          Q.__index__ = 0, Q.__values__ = t, a ? I.__wrapped__ = Q : a = Q;
          var I = Q;
          p = p.__wrapped__;
        }
        return I.__wrapped__ = r, a;
      }
      function eU() {
        var r = this.__wrapped__;
        if (r instanceof Qe) {
          var a = r;
          return this.__actions__.length && (a = new Qe(this)), a = a.reverse(), a.__actions__.push({
            func: zu,
            args: [Jf],
            thisArg: t
          }), new gn(a, this.__chain__);
        }
        return this.thru(Jf);
      }
      function tU() {
        return Hg(this.__wrapped__, this.__actions__);
      }
      var nU = Ru(function(r, a, p) {
        He.call(r, p) ? ++r[p] : Ir(r, p, 1);
      });
      function rU(r, a, p) {
        var Q = ce(r) ? E : qC;
        return p && $t(r, a, p) && (a = t), Q(r, jA(a, 3));
      }
      function iU(r, a) {
        var p = ce(r) ? b : dg;
        return p(r, jA(a, 3));
      }
      var aU = kg(uB), oU = kg(lB);
      function sU(r, a) {
        return Ct(Ju(r, a), 1);
      }
      function uU(r, a) {
        return Ct(Ju(r, a), hA);
      }
      function lU(r, a, p) {
        return p = p === t ? 1 : he(p), Ct(Ju(r, a), p);
      }
      function gB(r, a) {
        var p = ce(r) ? w : ui;
        return p(r, jA(a, 3));
      }
      function BB(r, a) {
        var p = ce(r) ? y : hg;
        return p(r, jA(a, 3));
      }
      var cU = Ru(function(r, a, p) {
        He.call(r, p) ? r[p].push(a) : Ir(r, p, [a]);
      });
      function fU(r, a, p, Q) {
        r = Jt(r) ? r : Oa(r), p = p && !Q ? he(p) : 0;
        var I = r.length;
        return p < 0 && (p = ft(I + p, 0)), el(r) ? p <= I && r.indexOf(a, p) > -1 : !!I && Je(r, a, p) > -1;
      }
      var hU = ge(function(r, a, p) {
        var Q = -1, I = typeof a == "function", O = Jt(r) ? iA(r.length) : [];
        return ui(r, function($) {
          O[++Q] = I ? s(a, $, p) : Go($, a, p);
        }), O;
      }), dU = Ru(function(r, a, p) {
        Ir(r, p, a);
      });
      function Ju(r, a) {
        var p = ce(r) ? W : vg;
        return p(r, jA(a, 3));
      }
      function pU(r, a, p, Q) {
        return r == null ? [] : (ce(a) || (a = a == null ? [] : [a]), p = Q ? t : p, ce(p) || (p = p == null ? [] : [p]), Fg(r, a, p));
      }
      var gU = Ru(function(r, a, p) {
        r[p ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function BU(r, a, p) {
        var Q = ce(r) ? AA : Ln, I = arguments.length < 3;
        return Q(r, jA(a, 4), p, I, ui);
      }
      function wU(r, a, p) {
        var Q = ce(r) ? mA : Ln, I = arguments.length < 3;
        return Q(r, jA(a, 4), p, I, hg);
      }
      function mU(r, a) {
        var p = ce(r) ? b : dg;
        return p(r, Zu(jA(a, 3)));
      }
      function vU(r) {
        var a = ce(r) ? ug : fQ;
        return a(r);
      }
      function yU(r, a, p) {
        (p ? $t(r, a, p) : a === t) ? a = 1 : a = he(a);
        var Q = ce(r) ? $C : hQ;
        return Q(r, a);
      }
      function CU(r) {
        var a = ce(r) ? GC : pQ;
        return a(r);
      }
      function QU(r) {
        if (r == null)
          return 0;
        if (Jt(r))
          return el(r) ? ii(r) : r.length;
        var a = Tt(r);
        return a == vA || a == $e ? r.size : _f(r).length;
      }
      function FU(r, a, p) {
        var Q = ce(r) ? SA : gQ;
        return p && $t(r, a, p) && (a = t), Q(r, jA(a, 3));
      }
      var UU = ge(function(r, a) {
        if (r == null)
          return [];
        var p = a.length;
        return p > 1 && $t(r, a[0], a[1]) ? a = [] : p > 2 && $t(a[0], a[1], a[2]) && (a = [a[0]]), Fg(r, Ct(a, 1), []);
      }), ju = We || function() {
        return et.Date.now();
      };
      function EU(r, a) {
        if (typeof a != "function")
          throw new yt(l);
        return r = he(r), function() {
          if (--r < 1)
            return a.apply(this, arguments);
        };
      }
      function wB(r, a, p) {
        return a = p ? t : a, a = r && a == null ? r.length : a, Hr(r, J, t, t, t, t, a);
      }
      function mB(r, a) {
        var p;
        if (typeof a != "function")
          throw new yt(l);
        return r = he(r), function() {
          return --r > 0 && (p = a.apply(this, arguments)), r <= 1 && (a = t), p;
        };
      }
      var Yf = ge(function(r, a, p) {
        var Q = F;
        if (p.length) {
          var I = nr(p, Ta(Yf));
          Q |= P;
        }
        return Hr(r, Q, a, p, I);
      }), vB = ge(function(r, a, p) {
        var Q = F | U;
        if (p.length) {
          var I = nr(p, Ta(vB));
          Q |= P;
        }
        return Hr(a, Q, r, p, I);
      });
      function yB(r, a, p) {
        a = p ? t : a;
        var Q = Hr(r, N, t, t, t, t, t, a);
        return Q.placeholder = yB.placeholder, Q;
      }
      function CB(r, a, p) {
        a = p ? t : a;
        var Q = Hr(r, x, t, t, t, t, t, a);
        return Q.placeholder = CB.placeholder, Q;
      }
      function QB(r, a, p) {
        var Q, I, O, $, V, Z, pA = 0, gA = !1, QA = !1, LA = !0;
        if (typeof r != "function")
          throw new yt(l);
        a = vn(a) || 0, Ye(p) && (gA = !!p.leading, QA = "maxWait" in p, O = QA ? ft(vn(p.maxWait) || 0, a) : O, LA = "trailing" in p ? !!p.trailing : LA);
        function kA(it) {
          var Rn = Q, Or = I;
          return Q = I = t, pA = it, $ = r.apply(Or, Rn), $;
        }
        function Ae(it) {
          return pA = it, V = zo(Ce, a), gA ? kA(it) : $;
        }
        function pe(it) {
          var Rn = it - Z, Or = it - pA, kB = a - Rn;
          return QA ? Lt(kB, O - Or) : kB;
        }
        function ee(it) {
          var Rn = it - Z, Or = it - pA;
          return Z === t || Rn >= a || Rn < 0 || QA && Or >= O;
        }
        function Ce() {
          var it = ju();
          if (ee(it))
            return be(it);
          V = zo(Ce, pe(it));
        }
        function be(it) {
          return V = t, LA && Q ? kA(it) : (Q = I = t, $);
        }
        function sn() {
          V !== t && Lg(V), pA = 0, Q = Z = I = V = t;
        }
        function Gt() {
          return V === t ? $ : be(ju());
        }
        function un() {
          var it = ju(), Rn = ee(it);
          if (Q = arguments, I = this, Z = it, Rn) {
            if (V === t)
              return Ae(Z);
            if (QA)
              return Lg(V), V = zo(Ce, a), kA(Z);
          }
          return V === t && (V = zo(Ce, a)), $;
        }
        return un.cancel = sn, un.flush = Gt, un;
      }
      var bU = ge(function(r, a) {
        return fg(r, 1, a);
      }), _U = ge(function(r, a, p) {
        return fg(r, vn(a) || 0, p);
      });
      function xU(r) {
        return Hr(r, uA);
      }
      function Yu(r, a) {
        if (typeof r != "function" || a != null && typeof a != "function")
          throw new yt(l);
        var p = function() {
          var Q = arguments, I = a ? a.apply(this, Q) : Q[0], O = p.cache;
          if (O.has(I))
            return O.get(I);
          var $ = r.apply(this, Q);
          return p.cache = O.set(I, $) || O, $;
        };
        return p.cache = new (Yu.Cache || xr)(), p;
      }
      Yu.Cache = xr;
      function Zu(r) {
        if (typeof r != "function")
          throw new yt(l);
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
      function IU(r) {
        return mB(2, r);
      }
      var HU = BQ(function(r, a) {
        a = a.length == 1 && ce(a[0]) ? W(a[0], Re(jA())) : W(Ct(a, 1), Re(jA()));
        var p = a.length;
        return ge(function(Q) {
          for (var I = -1, O = Lt(Q.length, p); ++I < O; )
            Q[I] = a[I].call(this, Q[I]);
          return s(r, this, Q);
        });
      }), Zf = ge(function(r, a) {
        var p = nr(a, Ta(Zf));
        return Hr(r, P, t, a, p);
      }), FB = ge(function(r, a) {
        var p = nr(a, Ta(FB));
        return Hr(r, R, t, a, p);
      }), SU = Sr(function(r, a) {
        return Hr(r, fA, t, t, t, a);
      });
      function LU(r, a) {
        if (typeof r != "function")
          throw new yt(l);
        return a = a === t ? a : he(a), ge(r, a);
      }
      function TU(r, a) {
        if (typeof r != "function")
          throw new yt(l);
        return a = a == null ? 0 : ft(he(a), 0), ge(function(p) {
          var Q = p[a], I = fi(p, 0, a);
          return Q && q(I, Q), s(r, this, I);
        });
      }
      function DU(r, a, p) {
        var Q = !0, I = !0;
        if (typeof r != "function")
          throw new yt(l);
        return Ye(p) && (Q = "leading" in p ? !!p.leading : Q, I = "trailing" in p ? !!p.trailing : I), QB(r, a, {
          leading: Q,
          maxWait: a,
          trailing: I
        });
      }
      function OU(r) {
        return wB(r, 1);
      }
      function NU(r, a) {
        return Zf(Nf(a), r);
      }
      function MU() {
        if (!arguments.length)
          return [];
        var r = arguments[0];
        return ce(r) ? r : [r];
      }
      function PU(r) {
        return Bn(r, v);
      }
      function KU(r, a) {
        return a = typeof a == "function" ? a : t, Bn(r, v, a);
      }
      function RU(r) {
        return Bn(r, B | v);
      }
      function kU(r, a) {
        return a = typeof a == "function" ? a : t, Bn(r, B | v, a);
      }
      function $U(r, a) {
        return a == null || cg(r, a, Bt(a));
      }
      function Kn(r, a) {
        return r === a || r !== r && a !== a;
      }
      var GU = Vu(Uf), VU = Vu(function(r, a) {
        return r >= a;
      }), Wi = Bg(/* @__PURE__ */ function() {
        return arguments;
      }()) ? Bg : function(r) {
        return At(r) && He.call(r, "callee") && !ZA.call(r, "callee");
      }, ce = iA.isArray, WU = Io ? Re(Io) : AQ;
      function Jt(r) {
        return r != null && Al(r.length) && !Tr(r);
      }
      function rt(r) {
        return At(r) && Jt(r);
      }
      function XU(r) {
        return r === !0 || r === !1 || At(r) && kt(r) == EA;
      }
      var hi = oC || lh, qU = Fa ? Re(Fa) : eQ;
      function zU(r) {
        return At(r) && r.nodeType === 1 && !Jo(r);
      }
      function JU(r) {
        if (r == null)
          return !0;
        if (Jt(r) && (ce(r) || typeof r == "string" || typeof r.splice == "function" || hi(r) || Da(r) || Wi(r)))
          return !r.length;
        var a = Tt(r);
        if (a == vA || a == $e)
          return !r.size;
        if (qo(r))
          return !_f(r).length;
        for (var p in r)
          if (He.call(r, p))
            return !1;
        return !0;
      }
      function jU(r, a) {
        return Vo(r, a);
      }
      function YU(r, a, p) {
        p = typeof p == "function" ? p : t;
        var Q = p ? p(r, a) : t;
        return Q === t ? Vo(r, a, t, p) : !!Q;
      }
      function Ah(r) {
        if (!At(r))
          return !1;
        var a = kt(r);
        return a == JA || a == ne || typeof r.message == "string" && typeof r.name == "string" && !Jo(r);
      }
      function ZU(r) {
        return typeof r == "number" && ig(r);
      }
      function Tr(r) {
        if (!Ye(r))
          return !1;
        var a = kt(r);
        return a == RA || a == sA || a == UA || a == Ze;
      }
      function UB(r) {
        return typeof r == "number" && r == he(r);
      }
      function Al(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= _A;
      }
      function Ye(r) {
        var a = typeof r;
        return r != null && (a == "object" || a == "function");
      }
      function At(r) {
        return r != null && typeof r == "object";
      }
      var EB = Ho ? Re(Ho) : nQ;
      function AE(r, a) {
        return r === a || bf(r, a, Gf(a));
      }
      function eE(r, a, p) {
        return p = typeof p == "function" ? p : t, bf(r, a, Gf(a), p);
      }
      function tE(r) {
        return bB(r) && r != +r;
      }
      function nE(r) {
        if (KQ(r))
          throw new ae(o);
        return wg(r);
      }
      function rE(r) {
        return r === null;
      }
      function iE(r) {
        return r == null;
      }
      function bB(r) {
        return typeof r == "number" || At(r) && kt(r) == bA;
      }
      function Jo(r) {
        if (!At(r) || kt(r) != me)
          return !1;
        var a = re(r);
        if (a === null)
          return !0;
        var p = He.call(a, "constructor") && a.constructor;
        return typeof p == "function" && p instanceof p && si.call(p) == z;
      }
      var eh = So ? Re(So) : rQ;
      function aE(r) {
        return UB(r) && r >= -_A && r <= _A;
      }
      var _B = Fu ? Re(Fu) : iQ;
      function el(r) {
        return typeof r == "string" || !ce(r) && At(r) && kt(r) == Pe;
      }
      function on(r) {
        return typeof r == "symbol" || At(r) && kt(r) == _e;
      }
      var Da = Uu ? Re(Uu) : aQ;
      function oE(r) {
        return r === t;
      }
      function sE(r) {
        return At(r) && Tt(r) == bt;
      }
      function uE(r) {
        return At(r) && kt(r) == Pt;
      }
      var lE = Vu(xf), cE = Vu(function(r, a) {
        return r <= a;
      });
      function xB(r) {
        if (!r)
          return [];
        if (Jt(r))
          return el(r) ? vt(r) : zt(r);
        if (qA && r[qA])
          return Ea(r[qA]());
        var a = Tt(r), p = a == vA ? Do : a == $e ? ba : Oa;
        return p(r);
      }
      function Dr(r) {
        if (!r)
          return r === 0 ? r : 0;
        if (r = vn(r), r === hA || r === -hA) {
          var a = r < 0 ? -1 : 1;
          return a * IA;
        }
        return r === r ? r : 0;
      }
      function he(r) {
        var a = Dr(r), p = a % 1;
        return a === a ? p ? a - p : a : 0;
      }
      function IB(r) {
        return r ? ki(he(r), 0, D) : 0;
      }
      function vn(r) {
        if (typeof r == "number")
          return r;
        if (on(r))
          return aA;
        if (Ye(r)) {
          var a = typeof r.valueOf == "function" ? r.valueOf() : r;
          r = Ye(a) ? a + "" : a;
        }
        if (typeof r != "string")
          return r === 0 ? r : +r;
        r = Dn(r);
        var p = Yc.test(r);
        return p || Qo.test(r) ? Cu(r.slice(2), p ? 2 : 8) : Zn.test(r) ? aA : +r;
      }
      function HB(r) {
        return ar(r, jt(r));
      }
      function fE(r) {
        return r ? ki(he(r), -_A, _A) : r === 0 ? r : 0;
      }
      function Oe(r) {
        return r == null ? "" : an(r);
      }
      var hE = Sa(function(r, a) {
        if (qo(a) || Jt(a)) {
          ar(a, Bt(a), r);
          return;
        }
        for (var p in a)
          He.call(a, p) && ko(r, p, a[p]);
      }), SB = Sa(function(r, a) {
        ar(a, jt(a), r);
      }), tl = Sa(function(r, a, p, Q) {
        ar(a, jt(a), r, Q);
      }), dE = Sa(function(r, a, p, Q) {
        ar(a, Bt(a), r, Q);
      }), pE = Sr(Cf);
      function gE(r, a) {
        var p = Ha(r);
        return a == null ? p : lg(p, a);
      }
      var BE = ge(function(r, a) {
        r = Ee(r);
        var p = -1, Q = a.length, I = Q > 2 ? a[2] : t;
        for (I && $t(a[0], a[1], I) && (Q = 1); ++p < Q; )
          for (var O = a[p], $ = jt(O), V = -1, Z = $.length; ++V < Z; ) {
            var pA = $[V], gA = r[pA];
            (gA === t || Kn(gA, oi[pA]) && !He.call(r, pA)) && (r[pA] = O[pA]);
          }
        return r;
      }), wE = ge(function(r) {
        return r.push(t, zg), s(LB, t, r);
      });
      function mE(r, a) {
        return ue(r, jA(a, 3), ir);
      }
      function vE(r, a) {
        return ue(r, jA(a, 3), Ff);
      }
      function yE(r, a) {
        return r == null ? r : Qf(r, jA(a, 3), jt);
      }
      function CE(r, a) {
        return r == null ? r : pg(r, jA(a, 3), jt);
      }
      function QE(r, a) {
        return r && ir(r, jA(a, 3));
      }
      function FE(r, a) {
        return r && Ff(r, jA(a, 3));
      }
      function UE(r) {
        return r == null ? [] : Nu(r, Bt(r));
      }
      function EE(r) {
        return r == null ? [] : Nu(r, jt(r));
      }
      function th(r, a, p) {
        var Q = r == null ? t : $i(r, a);
        return Q === t ? p : Q;
      }
      function bE(r, a) {
        return r != null && Yg(r, a, JC);
      }
      function nh(r, a) {
        return r != null && Yg(r, a, jC);
      }
      var _E = Gg(function(r, a, p) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), r[a] = p;
      }, ih(Yt)), xE = Gg(function(r, a, p) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), He.call(r, a) ? r[a].push(p) : r[a] = [p];
      }, jA), IE = ge(Go);
      function Bt(r) {
        return Jt(r) ? sg(r) : _f(r);
      }
      function jt(r) {
        return Jt(r) ? sg(r, !0) : oQ(r);
      }
      function HE(r, a) {
        var p = {};
        return a = jA(a, 3), ir(r, function(Q, I, O) {
          Ir(p, a(Q, I, O), Q);
        }), p;
      }
      function SE(r, a) {
        var p = {};
        return a = jA(a, 3), ir(r, function(Q, I, O) {
          Ir(p, I, a(Q, I, O));
        }), p;
      }
      var LE = Sa(function(r, a, p) {
        Mu(r, a, p);
      }), LB = Sa(function(r, a, p, Q) {
        Mu(r, a, p, Q);
      }), TE = Sr(function(r, a) {
        var p = {};
        if (r == null)
          return p;
        var Q = !1;
        a = W(a, function(O) {
          return O = ci(O, r), Q || (Q = O.length > 1), O;
        }), ar(r, kf(r), p), Q && (p = Bn(p, B | g | v, _Q));
        for (var I = a.length; I--; )
          Tf(p, a[I]);
        return p;
      });
      function DE(r, a) {
        return TB(r, Zu(jA(a)));
      }
      var OE = Sr(function(r, a) {
        return r == null ? {} : uQ(r, a);
      });
      function TB(r, a) {
        if (r == null)
          return {};
        var p = W(kf(r), function(Q) {
          return [Q];
        });
        return a = jA(a), Ug(r, p, function(Q, I) {
          return a(Q, I[0]);
        });
      }
      function NE(r, a, p) {
        a = ci(a, r);
        var Q = -1, I = a.length;
        for (I || (I = 1, r = t); ++Q < I; ) {
          var O = r == null ? t : r[or(a[Q])];
          O === t && (Q = I, O = p), r = Tr(O) ? O.call(r) : O;
        }
        return r;
      }
      function ME(r, a, p) {
        return r == null ? r : Wo(r, a, p);
      }
      function PE(r, a, p, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Wo(r, a, p, Q);
      }
      var DB = Xg(Bt), OB = Xg(jt);
      function KE(r, a, p) {
        var Q = ce(r), I = Q || hi(r) || Da(r);
        if (a = jA(a, 4), p == null) {
          var O = r && r.constructor;
          I ? p = Q ? new O() : [] : Ye(r) ? p = Tr(O) ? Ha(re(r)) : {} : p = {};
        }
        return (I ? w : ir)(r, function($, V, Z) {
          return a(p, $, V, Z);
        }), p;
      }
      function RE(r, a) {
        return r == null ? !0 : Tf(r, a);
      }
      function kE(r, a, p) {
        return r == null ? r : Ig(r, a, Nf(p));
      }
      function $E(r, a, p, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Ig(r, a, Nf(p), Q);
      }
      function Oa(r) {
        return r == null ? [] : St(r, Bt(r));
      }
      function GE(r) {
        return r == null ? [] : St(r, jt(r));
      }
      function VE(r, a, p) {
        return p === t && (p = a, a = t), p !== t && (p = vn(p), p = p === p ? p : 0), a !== t && (a = vn(a), a = a === a ? a : 0), ki(vn(r), a, p);
      }
      function WE(r, a, p) {
        return a = Dr(a), p === t ? (p = a, a = 0) : p = Dr(p), r = vn(r), YC(r, a, p);
      }
      function XE(r, a, p) {
        if (p && typeof p != "boolean" && $t(r, a, p) && (a = p = t), p === t && (typeof a == "boolean" ? (p = a, a = t) : typeof r == "boolean" && (p = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = Dr(r), a === t ? (a = r, r = 0) : a = Dr(a)), r > a) {
          var Q = r;
          r = a, a = Q;
        }
        if (p || r % 1 || a % 1) {
          var I = ag();
          return Lt(r + I * (a - r + ff("1e-" + ((I + "").length - 1))), a);
        }
        return Hf(r, a);
      }
      var qE = La(function(r, a, p) {
        return a = a.toLowerCase(), r + (p ? NB(a) : a);
      });
      function NB(r) {
        return rh(Oe(r).toLowerCase());
      }
      function MB(r) {
        return r = Oe(r), r && r.replace(Af, To).replace(wu, "");
      }
      function zE(r, a, p) {
        r = Oe(r), a = an(a);
        var Q = r.length;
        p = p === t ? Q : ki(he(p), 0, Q);
        var I = p;
        return p -= a.length, p >= 0 && r.slice(p, I) == a;
      }
      function JE(r) {
        return r = Oe(r), r && Hi.test(r) ? r.replace(Ii, De) : r;
      }
      function jE(r) {
        return r = Oe(r), r && Cr.test(r) ? r.replace(vo, "\\$&") : r;
      }
      var YE = La(function(r, a, p) {
        return r + (p ? "-" : "") + a.toLowerCase();
      }), ZE = La(function(r, a, p) {
        return r + (p ? " " : "") + a.toLowerCase();
      }), Ab = Rg("toLowerCase");
      function eb(r, a, p) {
        r = Oe(r), a = he(a);
        var Q = a ? ii(r) : 0;
        if (!a || Q >= a)
          return r;
        var I = (a - Q) / 2;
        return Gu(gt(I), p) + r + Gu(rr(I), p);
      }
      function tb(r, a, p) {
        r = Oe(r), a = he(a);
        var Q = a ? ii(r) : 0;
        return a && Q < a ? r + Gu(a - Q, p) : r;
      }
      function nb(r, a, p) {
        r = Oe(r), a = he(a);
        var Q = a ? ii(r) : 0;
        return a && Q < a ? Gu(a - Q, p) + r : r;
      }
      function rb(r, a, p) {
        return p || a == null ? a = 0 : a && (a = +a), cC(Oe(r).replace(ha, ""), a || 0);
      }
      function ib(r, a, p) {
        return (p ? $t(r, a, p) : a === t) ? a = 1 : a = he(a), Sf(Oe(r), a);
      }
      function ab() {
        var r = arguments, a = Oe(r[0]);
        return r.length < 3 ? a : a.replace(r[1], r[2]);
      }
      var ob = La(function(r, a, p) {
        return r + (p ? "_" : "") + a.toLowerCase();
      });
      function sb(r, a, p) {
        return p && typeof p != "number" && $t(r, a, p) && (a = p = t), p = p === t ? D : p >>> 0, p ? (r = Oe(r), r && (typeof a == "string" || a != null && !eh(a)) && (a = an(a), !a && tr(r)) ? fi(vt(r), 0, p) : r.split(a, p)) : [];
      }
      var ub = La(function(r, a, p) {
        return r + (p ? " " : "") + rh(a);
      });
      function lb(r, a, p) {
        return r = Oe(r), p = p == null ? 0 : ki(he(p), 0, r.length), a = an(a), r.slice(p, p + a.length) == a;
      }
      function cb(r, a, p) {
        var Q = L.templateSettings;
        p && $t(r, a, p) && (a = t), r = Oe(r), a = tl({}, a, Q, qg);
        var I = tl({}, a.imports, Q.imports, qg), O = Bt(I), $ = St(I, O), V, Z, pA = 0, gA = a.interpolate || ga, QA = "__p += '", LA = Mi(
          (a.escape || ga).source + "|" + gA.source + "|" + (gA === Si ? tu : ga).source + "|" + (a.evaluate || ga).source + "|$",
          "g"
        ), kA = "//# sourceURL=" + (He.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++yu + "]") + `
`;
        r.replace(LA, function(ee, Ce, be, sn, Gt, un) {
          return be || (be = sn), QA += r.slice(pA, un).replace(ef, Er), Ce && (V = !0, QA += `' +
__e(` + Ce + `) +
'`), Gt && (Z = !0, QA += `';
` + Gt + `;
__p += '`), be && (QA += `' +
((__t = (` + be + `)) == null ? '' : __t) +
'`), pA = un + ee.length, ee;
        }), QA += `';
`;
        var Ae = He.call(a, "variable") && a.variable;
        if (!Ae)
          QA = `with (obj) {
` + QA + `
}
`;
        else if (pa.test(Ae))
          throw new ae(f);
        QA = (Z ? QA.replace(ye, "") : QA).replace(ut, "$1").replace(xt, "$1;"), QA = "function(" + (Ae || "obj") + `) {
` + (Ae ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (V ? ", __e = _.escape" : "") + (Z ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + QA + `return __p
}`;
        var pe = KB(function() {
          return Ie(O, kA + "return " + QA).apply(t, $);
        });
        if (pe.source = QA, Ah(pe))
          throw pe;
        return pe;
      }
      function fb(r) {
        return Oe(r).toLowerCase();
      }
      function hb(r) {
        return Oe(r).toUpperCase();
      }
      function db(r, a, p) {
        if (r = Oe(r), r && (p || a === t))
          return Dn(r);
        if (!r || !(a = an(a)))
          return r;
        var Q = vt(r), I = vt(a), O = On(Q, I), $ = Lo(Q, I) + 1;
        return fi(Q, O, $).join("");
      }
      function pb(r, a, p) {
        if (r = Oe(r), r && (p || a === t))
          return r.slice(0, xu(r) + 1);
        if (!r || !(a = an(a)))
          return r;
        var Q = vt(r), I = Lo(Q, vt(a)) + 1;
        return fi(Q, 0, I).join("");
      }
      function gb(r, a, p) {
        if (r = Oe(r), r && (p || a === t))
          return r.replace(ha, "");
        if (!r || !(a = an(a)))
          return r;
        var Q = vt(r), I = On(Q, vt(a));
        return fi(Q, I).join("");
      }
      function Bb(r, a) {
        var p = BA, Q = FA;
        if (Ye(a)) {
          var I = "separator" in a ? a.separator : I;
          p = "length" in a ? he(a.length) : p, Q = "omission" in a ? an(a.omission) : Q;
        }
        r = Oe(r);
        var O = r.length;
        if (tr(r)) {
          var $ = vt(r);
          O = $.length;
        }
        if (p >= O)
          return r;
        var V = p - ii(Q);
        if (V < 1)
          return Q;
        var Z = $ ? fi($, 0, V).join("") : r.slice(0, V);
        if (I === t)
          return Z + Q;
        if ($ && (V += Z.length - V), eh(I)) {
          if (r.slice(V).search(I)) {
            var pA, gA = Z;
            for (I.global || (I = Mi(I.source, Oe(Yn.exec(I)) + "g")), I.lastIndex = 0; pA = I.exec(gA); )
              var QA = pA.index;
            Z = Z.slice(0, QA === t ? V : QA);
          }
        } else if (r.indexOf(an(I), V) != V) {
          var LA = Z.lastIndexOf(I);
          LA > -1 && (Z = Z.slice(0, LA));
        }
        return Z + Q;
      }
      function wb(r) {
        return r = Oe(r), r && In.test(r) ? r.replace(xn, Oo) : r;
      }
      var mb = La(function(r, a, p) {
        return r + (p ? " " : "") + a.toUpperCase();
      }), rh = Rg("toUpperCase");
      function PB(r, a, p) {
        return r = Oe(r), a = p ? t : a, a === t ? df(r) ? Mn(r) : YA(r) : r.match(a) || [];
      }
      var KB = ge(function(r, a) {
        try {
          return s(r, t, a);
        } catch (p) {
          return Ah(p) ? p : new ae(p);
        }
      }), vb = Sr(function(r, a) {
        return w(a, function(p) {
          p = or(p), Ir(r, p, Yf(r[p], r));
        }), r;
      });
      function yb(r) {
        var a = r == null ? 0 : r.length, p = jA();
        return r = a ? W(r, function(Q) {
          if (typeof Q[1] != "function")
            throw new yt(l);
          return [p(Q[0]), Q[1]];
        }) : [], ge(function(Q) {
          for (var I = -1; ++I < a; ) {
            var O = r[I];
            if (s(O[0], this, Q))
              return s(O[1], this, Q);
          }
        });
      }
      function Cb(r) {
        return XC(Bn(r, B));
      }
      function ih(r) {
        return function() {
          return r;
        };
      }
      function Qb(r, a) {
        return r == null || r !== r ? a : r;
      }
      var Fb = $g(), Ub = $g(!0);
      function Yt(r) {
        return r;
      }
      function ah(r) {
        return mg(typeof r == "function" ? r : Bn(r, B));
      }
      function Eb(r) {
        return yg(Bn(r, B));
      }
      function bb(r, a) {
        return Cg(r, Bn(a, B));
      }
      var _b = ge(function(r, a) {
        return function(p) {
          return Go(p, r, a);
        };
      }), xb = ge(function(r, a) {
        return function(p) {
          return Go(r, p, a);
        };
      });
      function oh(r, a, p) {
        var Q = Bt(a), I = Nu(a, Q);
        p == null && !(Ye(a) && (I.length || !Q.length)) && (p = a, a = r, r = this, I = Nu(a, Bt(a)));
        var O = !(Ye(p) && "chain" in p) || !!p.chain, $ = Tr(r);
        return w(I, function(V) {
          var Z = a[V];
          r[V] = Z, $ && (r.prototype[V] = function() {
            var pA = this.__chain__;
            if (O || pA) {
              var gA = r(this.__wrapped__), QA = gA.__actions__ = zt(this.__actions__);
              return QA.push({ func: Z, args: arguments, thisArg: r }), gA.__chain__ = pA, gA;
            }
            return Z.apply(r, q([this.value()], arguments));
          });
        }), r;
      }
      function Ib() {
        return et._ === this && (et._ = lA), this;
      }
      function sh() {
      }
      function Hb(r) {
        return r = he(r), ge(function(a) {
          return Qg(a, r);
        });
      }
      var Sb = Pf(W), Lb = Pf(E), Tb = Pf(SA);
      function RB(r) {
        return Wf(r) ? le(or(r)) : lQ(r);
      }
      function Db(r) {
        return function(a) {
          return r == null ? t : $i(r, a);
        };
      }
      var Ob = Vg(), Nb = Vg(!0);
      function uh() {
        return [];
      }
      function lh() {
        return !1;
      }
      function Mb() {
        return {};
      }
      function Pb() {
        return "";
      }
      function Kb() {
        return !0;
      }
      function Rb(r, a) {
        if (r = he(r), r < 1 || r > _A)
          return [];
        var p = D, Q = Lt(r, D);
        a = jA(a), r -= D;
        for (var I = Tn(Q, a); ++p < r; )
          a(p);
        return I;
      }
      function kb(r) {
        return ce(r) ? W(r, or) : on(r) ? [r] : zt(oB(Oe(r)));
      }
      function $b(r) {
        var a = ++Bf;
        return Oe(r) + a;
      }
      var Gb = $u(function(r, a) {
        return r + a;
      }, 0), Vb = Kf("ceil"), Wb = $u(function(r, a) {
        return r / a;
      }, 1), Xb = Kf("floor");
      function qb(r) {
        return r && r.length ? Ou(r, Yt, Uf) : t;
      }
      function zb(r, a) {
        return r && r.length ? Ou(r, jA(a, 2), Uf) : t;
      }
      function Jb(r) {
        return ct(r, Yt);
      }
      function jb(r, a) {
        return ct(r, jA(a, 2));
      }
      function Yb(r) {
        return r && r.length ? Ou(r, Yt, xf) : t;
      }
      function Zb(r, a) {
        return r && r.length ? Ou(r, jA(a, 2), xf) : t;
      }
      var A1 = $u(function(r, a) {
        return r * a;
      }, 1), e1 = Kf("round"), t1 = $u(function(r, a) {
        return r - a;
      }, 0);
      function n1(r) {
        return r && r.length ? Ht(r, Yt) : 0;
      }
      function r1(r, a) {
        return r && r.length ? Ht(r, jA(a, 2)) : 0;
      }
      return L.after = EU, L.ary = wB, L.assign = hE, L.assignIn = SB, L.assignInWith = tl, L.assignWith = dE, L.at = pE, L.before = mB, L.bind = Yf, L.bindAll = vb, L.bindKey = vB, L.castArray = MU, L.chain = pB, L.chunk = XQ, L.compact = qQ, L.concat = zQ, L.cond = yb, L.conforms = Cb, L.constant = ih, L.countBy = nU, L.create = gE, L.curry = yB, L.curryRight = CB, L.debounce = QB, L.defaults = BE, L.defaultsDeep = wE, L.defer = bU, L.delay = _U, L.difference = JQ, L.differenceBy = jQ, L.differenceWith = YQ, L.drop = ZQ, L.dropRight = AF, L.dropRightWhile = eF, L.dropWhile = tF, L.fill = nF, L.filter = iU, L.flatMap = sU, L.flatMapDeep = uU, L.flatMapDepth = lU, L.flatten = cB, L.flattenDeep = rF, L.flattenDepth = iF, L.flip = xU, L.flow = Fb, L.flowRight = Ub, L.fromPairs = aF, L.functions = UE, L.functionsIn = EE, L.groupBy = cU, L.initial = sF, L.intersection = uF, L.intersectionBy = lF, L.intersectionWith = cF, L.invert = _E, L.invertBy = xE, L.invokeMap = hU, L.iteratee = ah, L.keyBy = dU, L.keys = Bt, L.keysIn = jt, L.map = Ju, L.mapKeys = HE, L.mapValues = SE, L.matches = Eb, L.matchesProperty = bb, L.memoize = Yu, L.merge = LE, L.mergeWith = LB, L.method = _b, L.methodOf = xb, L.mixin = oh, L.negate = Zu, L.nthArg = Hb, L.omit = TE, L.omitBy = DE, L.once = IU, L.orderBy = pU, L.over = Sb, L.overArgs = HU, L.overEvery = Lb, L.overSome = Tb, L.partial = Zf, L.partialRight = FB, L.partition = gU, L.pick = OE, L.pickBy = TB, L.property = RB, L.propertyOf = Db, L.pull = pF, L.pullAll = hB, L.pullAllBy = gF, L.pullAllWith = BF, L.pullAt = wF, L.range = Ob, L.rangeRight = Nb, L.rearg = SU, L.reject = mU, L.remove = mF, L.rest = LU, L.reverse = Jf, L.sampleSize = yU, L.set = ME, L.setWith = PE, L.shuffle = CU, L.slice = vF, L.sortBy = UU, L.sortedUniq = bF, L.sortedUniqBy = _F, L.split = sb, L.spread = TU, L.tail = xF, L.take = IF, L.takeRight = HF, L.takeRightWhile = SF, L.takeWhile = LF, L.tap = qF, L.throttle = DU, L.thru = zu, L.toArray = xB, L.toPairs = DB, L.toPairsIn = OB, L.toPath = kb, L.toPlainObject = HB, L.transform = KE, L.unary = OU, L.union = TF, L.unionBy = DF, L.unionWith = OF, L.uniq = NF, L.uniqBy = MF, L.uniqWith = PF, L.unset = RE, L.unzip = jf, L.unzipWith = dB, L.update = kE, L.updateWith = $E, L.values = Oa, L.valuesIn = GE, L.without = KF, L.words = PB, L.wrap = NU, L.xor = RF, L.xorBy = kF, L.xorWith = $F, L.zip = GF, L.zipObject = VF, L.zipObjectDeep = WF, L.zipWith = XF, L.entries = DB, L.entriesIn = OB, L.extend = SB, L.extendWith = tl, oh(L, L), L.add = Gb, L.attempt = KB, L.camelCase = qE, L.capitalize = NB, L.ceil = Vb, L.clamp = VE, L.clone = PU, L.cloneDeep = RU, L.cloneDeepWith = kU, L.cloneWith = KU, L.conformsTo = $U, L.deburr = MB, L.defaultTo = Qb, L.divide = Wb, L.endsWith = zE, L.eq = Kn, L.escape = JE, L.escapeRegExp = jE, L.every = rU, L.find = aU, L.findIndex = uB, L.findKey = mE, L.findLast = oU, L.findLastIndex = lB, L.findLastKey = vE, L.floor = Xb, L.forEach = gB, L.forEachRight = BB, L.forIn = yE, L.forInRight = CE, L.forOwn = QE, L.forOwnRight = FE, L.get = th, L.gt = GU, L.gte = VU, L.has = bE, L.hasIn = nh, L.head = fB, L.identity = Yt, L.includes = fU, L.indexOf = oF, L.inRange = WE, L.invoke = IE, L.isArguments = Wi, L.isArray = ce, L.isArrayBuffer = WU, L.isArrayLike = Jt, L.isArrayLikeObject = rt, L.isBoolean = XU, L.isBuffer = hi, L.isDate = qU, L.isElement = zU, L.isEmpty = JU, L.isEqual = jU, L.isEqualWith = YU, L.isError = Ah, L.isFinite = ZU, L.isFunction = Tr, L.isInteger = UB, L.isLength = Al, L.isMap = EB, L.isMatch = AE, L.isMatchWith = eE, L.isNaN = tE, L.isNative = nE, L.isNil = iE, L.isNull = rE, L.isNumber = bB, L.isObject = Ye, L.isObjectLike = At, L.isPlainObject = Jo, L.isRegExp = eh, L.isSafeInteger = aE, L.isSet = _B, L.isString = el, L.isSymbol = on, L.isTypedArray = Da, L.isUndefined = oE, L.isWeakMap = sE, L.isWeakSet = uE, L.join = fF, L.kebabCase = YE, L.last = mn, L.lastIndexOf = hF, L.lowerCase = ZE, L.lowerFirst = Ab, L.lt = lE, L.lte = cE, L.max = qb, L.maxBy = zb, L.mean = Jb, L.meanBy = jb, L.min = Yb, L.minBy = Zb, L.stubArray = uh, L.stubFalse = lh, L.stubObject = Mb, L.stubString = Pb, L.stubTrue = Kb, L.multiply = A1, L.nth = dF, L.noConflict = Ib, L.noop = sh, L.now = ju, L.pad = eb, L.padEnd = tb, L.padStart = nb, L.parseInt = rb, L.random = XE, L.reduce = BU, L.reduceRight = wU, L.repeat = ib, L.replace = ab, L.result = NE, L.round = e1, L.runInContext = Y, L.sample = vU, L.size = QU, L.snakeCase = ob, L.some = FU, L.sortedIndex = yF, L.sortedIndexBy = CF, L.sortedIndexOf = QF, L.sortedLastIndex = FF, L.sortedLastIndexBy = UF, L.sortedLastIndexOf = EF, L.startCase = ub, L.startsWith = lb, L.subtract = t1, L.sum = n1, L.sumBy = r1, L.template = cb, L.times = Rb, L.toFinite = Dr, L.toInteger = he, L.toLength = IB, L.toLower = fb, L.toNumber = vn, L.toSafeInteger = fE, L.toString = Oe, L.toUpper = hb, L.trim = db, L.trimEnd = pb, L.trimStart = gb, L.truncate = Bb, L.unescape = wb, L.uniqueId = $b, L.upperCase = mb, L.upperFirst = rh, L.each = gB, L.eachRight = BB, L.first = fB, oh(L, function() {
        var r = {};
        return ir(L, function(a, p) {
          He.call(L.prototype, p) || (r[p] = a);
        }), r;
      }(), { chain: !1 }), L.VERSION = n, w(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        L[r].placeholder = L;
      }), w(["drop", "take"], function(r, a) {
        Qe.prototype[r] = function(p) {
          p = p === t ? 1 : ft(he(p), 0);
          var Q = this.__filtered__ && !a ? new Qe(this) : this.clone();
          return Q.__filtered__ ? Q.__takeCount__ = Lt(p, Q.__takeCount__) : Q.__views__.push({
            size: Lt(p, D),
            type: r + (Q.__dir__ < 0 ? "Right" : "")
          }), Q;
        }, Qe.prototype[r + "Right"] = function(p) {
          return this.reverse()[r](p).reverse();
        };
      }), w(["filter", "map", "takeWhile"], function(r, a) {
        var p = a + 1, Q = p == X || p == tA;
        Qe.prototype[r] = function(I) {
          var O = this.clone();
          return O.__iteratees__.push({
            iteratee: jA(I, 3),
            type: p
          }), O.__filtered__ = O.__filtered__ || Q, O;
        };
      }), w(["head", "last"], function(r, a) {
        var p = "take" + (a ? "Right" : "");
        Qe.prototype[r] = function() {
          return this[p](1).value()[0];
        };
      }), w(["initial", "tail"], function(r, a) {
        var p = "drop" + (a ? "" : "Right");
        Qe.prototype[r] = function() {
          return this.__filtered__ ? new Qe(this) : this[p](1);
        };
      }), Qe.prototype.compact = function() {
        return this.filter(Yt);
      }, Qe.prototype.find = function(r) {
        return this.filter(r).head();
      }, Qe.prototype.findLast = function(r) {
        return this.reverse().find(r);
      }, Qe.prototype.invokeMap = ge(function(r, a) {
        return typeof r == "function" ? new Qe(this) : this.map(function(p) {
          return Go(p, r, a);
        });
      }), Qe.prototype.reject = function(r) {
        return this.filter(Zu(jA(r)));
      }, Qe.prototype.slice = function(r, a) {
        r = he(r);
        var p = this;
        return p.__filtered__ && (r > 0 || a < 0) ? new Qe(p) : (r < 0 ? p = p.takeRight(-r) : r && (p = p.drop(r)), a !== t && (a = he(a), p = a < 0 ? p.dropRight(-a) : p.take(a - r)), p);
      }, Qe.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, Qe.prototype.toArray = function() {
        return this.take(D);
      }, ir(Qe.prototype, function(r, a) {
        var p = /^(?:filter|find|map|reject)|While$/.test(a), Q = /^(?:head|last)$/.test(a), I = L[Q ? "take" + (a == "last" ? "Right" : "") : a], O = Q || /^find/.test(a);
        I && (L.prototype[a] = function() {
          var $ = this.__wrapped__, V = Q ? [1] : arguments, Z = $ instanceof Qe, pA = V[0], gA = Z || ce($), QA = function(Ce) {
            var be = I.apply(L, q([Ce], V));
            return Q && LA ? be[0] : be;
          };
          gA && p && typeof pA == "function" && pA.length != 1 && (Z = gA = !1);
          var LA = this.__chain__, kA = !!this.__actions__.length, Ae = O && !LA, pe = Z && !kA;
          if (!O && gA) {
            $ = pe ? $ : new Qe(this);
            var ee = r.apply($, V);
            return ee.__actions__.push({ func: zu, args: [QA], thisArg: t }), new gn(ee, LA);
          }
          return Ae && pe ? r.apply(this, V) : (ee = this.thru(QA), Ae ? Q ? ee.value()[0] : ee.value() : ee);
        });
      }), w(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var a = ai[r], p = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", Q = /^(?:pop|shift)$/.test(r);
        L.prototype[r] = function() {
          var I = arguments;
          if (Q && !this.__chain__) {
            var O = this.value();
            return a.apply(ce(O) ? O : [], I);
          }
          return this[p](function($) {
            return a.apply(ce($) ? $ : [], I);
          });
        };
      }), ir(Qe.prototype, function(r, a) {
        var p = L[a];
        if (p) {
          var Q = p.name + "";
          He.call(Ia, Q) || (Ia[Q] = []), Ia[Q].push({ name: a, func: p });
        }
      }), Ia[ku(t, U).name] = [{
        name: "wrapper",
        func: t
      }], Qe.prototype.clone = wC, Qe.prototype.reverse = mC, Qe.prototype.value = vC, L.prototype.at = zF, L.prototype.chain = JF, L.prototype.commit = jF, L.prototype.next = YF, L.prototype.plant = AU, L.prototype.reverse = eU, L.prototype.toJSON = L.prototype.valueOf = L.prototype.value = tU, L.prototype.first = L.prototype.head, qA && (L.prototype[qA] = ZF), L;
    }, xe = Iu();
    pn ? ((pn.exports = xe)._ = xe, xo._ = xe) : et._ = xe;
  }).call(Ji);
})(oc, oc.exports);
var hS = oc.exports;
const Le = /* @__PURE__ */ Ic(hS), dS = function(A) {
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
  }, t = Le.merge({}, e, A), n = function(i, o) {
    var l = Le.cloneDeep(i);
    if (i.show) {
      var f = i.size * t.scale;
      o.showThreshold && (l.show = f >= o.showThreshold), o.maxSize && f > o.maxSize && (l.size = o.maxSize / t.scale);
    }
    return l;
  };
  return {
    decorateGenome: function(i) {
      var o = i, l = {
        width: t.width * (1 - t.margin.left - t.margin.right),
        height: t.height * (1 - t.margin.top - t.margin.bottom)
      }, f = Math.min(t.numberPerRow, o.chromosomes.length), c = Math.ceil(o.chromosomes.length / f), h = {
        width: l.width / f,
        height: l.height / c
      }, m = {
        top: h.height * t.cellMargin.top,
        bottom: h.height * t.cellMargin.bottom,
        left: h.width * t.cellMargin.left,
        right: h.width * t.cellMargin.right
      }, B = t.labelHeight * h.height, g = t.labelHeight * h.height, v = h.height - B - g - m.top - m.bottom, u = Math.min(
        65 / t.scale,
        v * t.chromosomeAspectRatio
      ), C = h.width - u - m.left - m.right, F = C / 2, U = Math.max.apply(
        null,
        o.chromosomes.map(function(x) {
          return x.length;
        })
      ), S = {
        label: Le.pick(t.annotations.label, ["size", "show"]),
        marker: Le.pick(t.annotations.marker, ["size", "show"])
      };
      S.label = n(
        S.label,
        t.annotations.label
      ), S.marker = n(
        S.marker,
        t.annotations.marker
      );
      var N = {
        chromosomePosition: {
          height: v,
          width: u,
          x: m.left + F,
          y: m.top + B
        },
        labelPosition: {
          height: B,
          width: h.width - m.left - m.right,
          chromosomeWidth: u,
          x: m.left,
          y: m.top
        },
        sizeLabelPosition: {
          cellHeight: v,
          height: g,
          width: h.width - m.left - m.right,
          x: m.left,
          y: m.top + B
        },
        qtlAnnotationPosition: {
          height: v,
          width: F,
          chromosomeWidth: u,
          x: m.left,
          y: m.top + B
        },
        geneAnnotationPosition: {
          height: v,
          width: F,
          x: m.left + F + u,
          y: m.top + B
        },
        longestChromosome: U,
        annotations: S,
        scale: t.scale
      };
      return o.chromosomes.length == 1 && (N.chromosomePosition.x = m.left + 0.5 * F, N.geneAnnotationPosition.x = m.left + 0.5 * F + u, N.qtlAnnotationPosition.width = F * 0.5, N.geneAnnotationPosition.width = F * 1.5, N.labelPosition.x = m.left + 0.5 * F, N.labelPosition.width = u, N.sizeLabelPosition.x = m.left + 0.5 * F, N.sizeLabelPosition.width = u), o.drawing = Le.pick(t, ["width", "height"]), o.drawing.margin = {
        top: t.margin.top * o.drawing.height,
        left: t.margin.left * o.drawing.width,
        bottom: t.margin.bottom * o.drawing.height,
        right: t.margin.right * o.drawing.width
      }, o.chromosomes.forEach(function(x, P) {
        var R = P % t.numberPerRow, J = Math.floor(P / t.numberPerRow);
        x.cell = {
          y: J * h.height + t.margin.top * t.height,
          x: R * h.width + t.margin.left * t.width,
          width: h.width,
          height: h.height
        };
      }), o.cellLayout = N, o;
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
      return arguments.length ? (t.margin = Le.merge(t.margin, i), this) : t.margin;
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
function Wl(A, e) {
  return A == null || e == null ? NaN : A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function pS(A, e) {
  return A == null || e == null ? NaN : e < A ? -1 : e > A ? 1 : e >= A ? 0 : NaN;
}
function t0(A) {
  let e, t, n;
  A.length !== 2 ? (e = Wl, t = (f, c) => Wl(A(f), c), n = (f, c) => A(f) - c) : (e = A === Wl || A === pS ? A : gS, t = A, n = A);
  function i(f, c, h = 0, m = f.length) {
    if (h < m) {
      if (e(c, c) !== 0) return m;
      do {
        const B = h + m >>> 1;
        t(f[B], c) < 0 ? h = B + 1 : m = B;
      } while (h < m);
    }
    return h;
  }
  function o(f, c, h = 0, m = f.length) {
    if (h < m) {
      if (e(c, c) !== 0) return m;
      do {
        const B = h + m >>> 1;
        t(f[B], c) <= 0 ? h = B + 1 : m = B;
      } while (h < m);
    }
    return h;
  }
  function l(f, c, h = 0, m = f.length) {
    const B = i(f, c, h, m - 1);
    return B > h && n(f[B - 1], c) > -n(f[B], c) ? B - 1 : B;
  }
  return { left: i, center: l, right: o };
}
function gS() {
  return 0;
}
function BS(A) {
  return A === null ? NaN : +A;
}
const wS = t0(Wl), mS = wS.right;
t0(BS).center;
const vS = Math.sqrt(50), yS = Math.sqrt(10), CS = Math.sqrt(2);
function sc(A, e, t) {
  const n = (e - A) / Math.max(0, t), i = Math.floor(Math.log10(n)), o = n / Math.pow(10, i), l = o >= vS ? 10 : o >= yS ? 5 : o >= CS ? 2 : 1;
  let f, c, h;
  return i < 0 ? (h = Math.pow(10, -i) / l, f = Math.round(A * h), c = Math.round(e * h), f / h < A && ++f, c / h > e && --c, h = -h) : (h = Math.pow(10, i) * l, f = Math.round(A / h), c = Math.round(e / h), f * h < A && ++f, c * h > e && --c), c < f && 0.5 <= t && t < 2 ? sc(A, e, t * 2) : [f, c, h];
}
function QS(A, e, t) {
  if (e = +e, A = +A, t = +t, !(t > 0)) return [];
  if (A === e) return [A];
  const n = e < A, [i, o, l] = n ? sc(e, A, t) : sc(A, e, t);
  if (!(o >= i)) return [];
  const f = o - i + 1, c = new Array(f);
  if (n)
    if (l < 0) for (let h = 0; h < f; ++h) c[h] = (o - h) / -l;
    else for (let h = 0; h < f; ++h) c[h] = (o - h) * l;
  else if (l < 0) for (let h = 0; h < f; ++h) c[h] = (i + h) / -l;
  else for (let h = 0; h < f; ++h) c[h] = (i + h) * l;
  return c;
}
function ed(A, e, t) {
  return e = +e, A = +A, t = +t, sc(A, e, t)[2];
}
function FS(A, e, t) {
  e = +e, A = +A, t = +t;
  const n = e < A, i = n ? ed(e, A, t) : ed(A, e, t);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var US = { value: function() {
} };
function Nc() {
  for (var A = 0, e = arguments.length, t = {}, n; A < e; ++A) {
    if (!(n = arguments[A] + "") || n in t || /[\s.]/.test(n)) throw new Error("illegal type: " + n);
    t[n] = [];
  }
  return new Xl(t);
}
function Xl(A) {
  this._ = A;
}
function ES(A, e) {
  return A.trim().split(/^|\s+/).map(function(t) {
    var n = "", i = t.indexOf(".");
    if (i >= 0 && (n = t.slice(i + 1), t = t.slice(0, i)), t && !e.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: n };
  });
}
Xl.prototype = Nc.prototype = {
  constructor: Xl,
  on: function(A, e) {
    var t = this._, n = ES(A + "", t), i, o = -1, l = n.length;
    if (arguments.length < 2) {
      for (; ++o < l; ) if ((i = (A = n[o]).type) && (i = bS(t[i], A.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++o < l; )
      if (i = (A = n[o]).type) t[i] = gw(t[i], A.name, e);
      else if (e == null) for (i in t) t[i] = gw(t[i], A.name, null);
    return this;
  },
  copy: function() {
    var A = {}, e = this._;
    for (var t in e) A[t] = e[t].slice();
    return new Xl(A);
  },
  call: function(A, e) {
    if ((i = arguments.length - 2) > 0) for (var t = new Array(i), n = 0, i, o; n < i; ++n) t[n] = arguments[n + 2];
    if (!this._.hasOwnProperty(A)) throw new Error("unknown type: " + A);
    for (o = this._[A], n = 0, i = o.length; n < i; ++n) o[n].value.apply(e, t);
  },
  apply: function(A, e, t) {
    if (!this._.hasOwnProperty(A)) throw new Error("unknown type: " + A);
    for (var n = this._[A], i = 0, o = n.length; i < o; ++i) n[i].value.apply(e, t);
  }
};
function bS(A, e) {
  for (var t = 0, n = A.length, i; t < n; ++t)
    if ((i = A[t]).name === e)
      return i.value;
}
function gw(A, e, t) {
  for (var n = 0, i = A.length; n < i; ++n)
    if (A[n].name === e) {
      A[n] = US, A = A.slice(0, n).concat(A.slice(n + 1));
      break;
    }
  return t != null && A.push({ name: e, value: t }), A;
}
var td = "http://www.w3.org/1999/xhtml";
const Bw = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: td,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Mc(A) {
  var e = A += "", t = e.indexOf(":");
  return t >= 0 && (e = A.slice(0, t)) !== "xmlns" && (A = A.slice(t + 1)), Bw.hasOwnProperty(e) ? { space: Bw[e], local: A } : A;
}
function _S(A) {
  return function() {
    var e = this.ownerDocument, t = this.namespaceURI;
    return t === td && e.documentElement.namespaceURI === td ? e.createElement(A) : e.createElementNS(t, A);
  };
}
function xS(A) {
  return function() {
    return this.ownerDocument.createElementNS(A.space, A.local);
  };
}
function n0(A) {
  var e = Mc(A);
  return (e.local ? xS : _S)(e);
}
function IS() {
}
function Lp(A) {
  return A == null ? IS : function() {
    return this.querySelector(A);
  };
}
function HS(A) {
  typeof A != "function" && (A = Lp(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var o = e[i], l = o.length, f = n[i] = new Array(l), c, h, m = 0; m < l; ++m)
      (c = o[m]) && (h = A.call(c, c.__data__, m, o)) && ("__data__" in c && (h.__data__ = c.__data__), f[m] = h);
  return new Xt(n, this._parents);
}
function r0(A) {
  return A == null ? [] : Array.isArray(A) ? A : Array.from(A);
}
function SS() {
  return [];
}
function i0(A) {
  return A == null ? SS : function() {
    return this.querySelectorAll(A);
  };
}
function LS(A) {
  return function() {
    return r0(A.apply(this, arguments));
  };
}
function TS(A) {
  typeof A == "function" ? A = LS(A) : A = i0(A);
  for (var e = this._groups, t = e.length, n = [], i = [], o = 0; o < t; ++o)
    for (var l = e[o], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && (n.push(A.call(c, c.__data__, h, l)), i.push(c));
  return new Xt(n, i);
}
function a0(A) {
  return function() {
    return this.matches(A);
  };
}
function o0(A) {
  return function(e) {
    return e.matches(A);
  };
}
var DS = Array.prototype.find;
function OS(A) {
  return function() {
    return DS.call(this.children, A);
  };
}
function NS() {
  return this.firstElementChild;
}
function MS(A) {
  return this.select(A == null ? NS : OS(typeof A == "function" ? A : o0(A)));
}
var PS = Array.prototype.filter;
function KS() {
  return Array.from(this.children);
}
function RS(A) {
  return function() {
    return PS.call(this.children, A);
  };
}
function kS(A) {
  return this.selectAll(A == null ? KS : RS(typeof A == "function" ? A : o0(A)));
}
function $S(A) {
  typeof A != "function" && (A = a0(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var o = e[i], l = o.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = o[h]) && A.call(c, c.__data__, h, o) && f.push(c);
  return new Xt(n, this._parents);
}
function s0(A) {
  return new Array(A.length);
}
function GS() {
  return new Xt(this._enter || this._groups.map(s0), this._parents);
}
function uc(A, e) {
  this.ownerDocument = A.ownerDocument, this.namespaceURI = A.namespaceURI, this._next = null, this._parent = A, this.__data__ = e;
}
uc.prototype = {
  constructor: uc,
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
function VS(A) {
  return function() {
    return A;
  };
}
function WS(A, e, t, n, i, o) {
  for (var l = 0, f, c = e.length, h = o.length; l < h; ++l)
    (f = e[l]) ? (f.__data__ = o[l], n[l] = f) : t[l] = new uc(A, o[l]);
  for (; l < c; ++l)
    (f = e[l]) && (i[l] = f);
}
function XS(A, e, t, n, i, o, l) {
  var f, c, h = /* @__PURE__ */ new Map(), m = e.length, B = o.length, g = new Array(m), v;
  for (f = 0; f < m; ++f)
    (c = e[f]) && (g[f] = v = l.call(c, c.__data__, f, e) + "", h.has(v) ? i[f] = c : h.set(v, c));
  for (f = 0; f < B; ++f)
    v = l.call(A, o[f], f, o) + "", (c = h.get(v)) ? (n[f] = c, c.__data__ = o[f], h.delete(v)) : t[f] = new uc(A, o[f]);
  for (f = 0; f < m; ++f)
    (c = e[f]) && h.get(g[f]) === c && (i[f] = c);
}
function qS(A) {
  return A.__data__;
}
function zS(A, e) {
  if (!arguments.length) return Array.from(this, qS);
  var t = e ? XS : WS, n = this._parents, i = this._groups;
  typeof A != "function" && (A = VS(A));
  for (var o = i.length, l = new Array(o), f = new Array(o), c = new Array(o), h = 0; h < o; ++h) {
    var m = n[h], B = i[h], g = B.length, v = JS(A.call(m, m && m.__data__, h, n)), u = v.length, C = f[h] = new Array(u), F = l[h] = new Array(u), U = c[h] = new Array(g);
    t(m, B, C, F, U, v, e);
    for (var S = 0, N = 0, x, P; S < u; ++S)
      if (x = C[S]) {
        for (S >= N && (N = S + 1); !(P = F[N]) && ++N < u; ) ;
        x._next = P || null;
      }
  }
  return l = new Xt(l, n), l._enter = f, l._exit = c, l;
}
function JS(A) {
  return typeof A == "object" && "length" in A ? A : Array.from(A);
}
function jS() {
  return new Xt(this._exit || this._groups.map(s0), this._parents);
}
function YS(A, e, t) {
  var n = this.enter(), i = this, o = this.exit();
  return typeof A == "function" ? (n = A(n), n && (n = n.selection())) : n = n.append(A + ""), e != null && (i = e(i), i && (i = i.selection())), t == null ? o.remove() : t(o), n && i ? n.merge(i).order() : i;
}
function ZS(A) {
  for (var e = A.selection ? A.selection() : A, t = this._groups, n = e._groups, i = t.length, o = n.length, l = Math.min(i, o), f = new Array(i), c = 0; c < l; ++c)
    for (var h = t[c], m = n[c], B = h.length, g = f[c] = new Array(B), v, u = 0; u < B; ++u)
      (v = h[u] || m[u]) && (g[u] = v);
  for (; c < i; ++c)
    f[c] = t[c];
  return new Xt(f, this._parents);
}
function AL() {
  for (var A = this._groups, e = -1, t = A.length; ++e < t; )
    for (var n = A[e], i = n.length - 1, o = n[i], l; --i >= 0; )
      (l = n[i]) && (o && l.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(l, o), o = l);
  return this;
}
function eL(A) {
  A || (A = tL);
  function e(B, g) {
    return B && g ? A(B.__data__, g.__data__) : !B - !g;
  }
  for (var t = this._groups, n = t.length, i = new Array(n), o = 0; o < n; ++o) {
    for (var l = t[o], f = l.length, c = i[o] = new Array(f), h, m = 0; m < f; ++m)
      (h = l[m]) && (c[m] = h);
    c.sort(e);
  }
  return new Xt(i, this._parents).order();
}
function tL(A, e) {
  return A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function nL() {
  var A = arguments[0];
  return arguments[0] = this, A.apply(null, arguments), this;
}
function rL() {
  return Array.from(this);
}
function iL() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, o = n.length; i < o; ++i) {
      var l = n[i];
      if (l) return l;
    }
  return null;
}
function aL() {
  let A = 0;
  for (const e of this) ++A;
  return A;
}
function oL() {
  return !this.node();
}
function sL(A) {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var i = e[t], o = 0, l = i.length, f; o < l; ++o)
      (f = i[o]) && A.call(f, f.__data__, o, i);
  return this;
}
function uL(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function lL(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function cL(A, e) {
  return function() {
    this.setAttribute(A, e);
  };
}
function fL(A, e) {
  return function() {
    this.setAttributeNS(A.space, A.local, e);
  };
}
function hL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttribute(A) : this.setAttribute(A, t);
  };
}
function dL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttributeNS(A.space, A.local) : this.setAttributeNS(A.space, A.local, t);
  };
}
function pL(A, e) {
  var t = Mc(A);
  if (arguments.length < 2) {
    var n = this.node();
    return t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t);
  }
  return this.each((e == null ? t.local ? lL : uL : typeof e == "function" ? t.local ? dL : hL : t.local ? fL : cL)(t, e));
}
function u0(A) {
  return A.ownerDocument && A.ownerDocument.defaultView || A.document && A || A.defaultView;
}
function gL(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function BL(A, e, t) {
  return function() {
    this.style.setProperty(A, e, t);
  };
}
function wL(A, e, t) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.style.removeProperty(A) : this.style.setProperty(A, n, t);
  };
}
function mL(A, e, t) {
  return arguments.length > 1 ? this.each((e == null ? gL : typeof e == "function" ? wL : BL)(A, e, t ?? "")) : oo(this.node(), A);
}
function oo(A, e) {
  return A.style.getPropertyValue(e) || u0(A).getComputedStyle(A, null).getPropertyValue(e);
}
function vL(A) {
  return function() {
    delete this[A];
  };
}
function yL(A, e) {
  return function() {
    this[A] = e;
  };
}
function CL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? delete this[A] : this[A] = t;
  };
}
function QL(A, e) {
  return arguments.length > 1 ? this.each((e == null ? vL : typeof e == "function" ? CL : yL)(A, e)) : this.node()[A];
}
function l0(A) {
  return A.trim().split(/^|\s+/);
}
function Tp(A) {
  return A.classList || new c0(A);
}
function c0(A) {
  this._node = A, this._names = l0(A.getAttribute("class") || "");
}
c0.prototype = {
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
function f0(A, e) {
  for (var t = Tp(A), n = -1, i = e.length; ++n < i; ) t.add(e[n]);
}
function h0(A, e) {
  for (var t = Tp(A), n = -1, i = e.length; ++n < i; ) t.remove(e[n]);
}
function FL(A) {
  return function() {
    f0(this, A);
  };
}
function UL(A) {
  return function() {
    h0(this, A);
  };
}
function EL(A, e) {
  return function() {
    (e.apply(this, arguments) ? f0 : h0)(this, A);
  };
}
function bL(A, e) {
  var t = l0(A + "");
  if (arguments.length < 2) {
    for (var n = Tp(this.node()), i = -1, o = t.length; ++i < o; ) if (!n.contains(t[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? EL : e ? FL : UL)(t, e));
}
function _L() {
  this.textContent = "";
}
function xL(A) {
  return function() {
    this.textContent = A;
  };
}
function IL(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function HL(A) {
  return arguments.length ? this.each(A == null ? _L : (typeof A == "function" ? IL : xL)(A)) : this.node().textContent;
}
function SL() {
  this.innerHTML = "";
}
function LL(A) {
  return function() {
    this.innerHTML = A;
  };
}
function TL(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function DL(A) {
  return arguments.length ? this.each(A == null ? SL : (typeof A == "function" ? TL : LL)(A)) : this.node().innerHTML;
}
function OL() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function NL() {
  return this.each(OL);
}
function ML() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function PL() {
  return this.each(ML);
}
function KL(A) {
  var e = typeof A == "function" ? A : n0(A);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function RL() {
  return null;
}
function kL(A, e) {
  var t = typeof A == "function" ? A : n0(A), n = e == null ? RL : typeof e == "function" ? e : Lp(e);
  return this.select(function() {
    return this.insertBefore(t.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function $L() {
  var A = this.parentNode;
  A && A.removeChild(this);
}
function GL() {
  return this.each($L);
}
function VL() {
  var A = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function WL() {
  var A = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function XL(A) {
  return this.select(A ? WL : VL);
}
function qL(A) {
  return arguments.length ? this.property("__data__", A) : this.node().__data__;
}
function zL(A) {
  return function(e) {
    A.call(this, e, this.__data__);
  };
}
function JL(A) {
  return A.trim().split(/^|\s+/).map(function(e) {
    var t = "", n = e.indexOf(".");
    return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), { type: e, name: t };
  });
}
function jL(A) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var t = 0, n = -1, i = e.length, o; t < i; ++t)
        o = e[t], (!A.type || o.type === A.type) && o.name === A.name ? this.removeEventListener(o.type, o.listener, o.options) : e[++n] = o;
      ++n ? e.length = n : delete this.__on;
    }
  };
}
function YL(A, e, t) {
  return function() {
    var n = this.__on, i, o = zL(e);
    if (n) {
      for (var l = 0, f = n.length; l < f; ++l)
        if ((i = n[l]).type === A.type && i.name === A.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = o, i.options = t), i.value = e;
          return;
        }
    }
    this.addEventListener(A.type, o, t), i = { type: A.type, name: A.name, value: e, listener: o, options: t }, n ? n.push(i) : this.__on = [i];
  };
}
function ZL(A, e, t) {
  var n = JL(A + ""), i, o = n.length, l;
  if (arguments.length < 2) {
    var f = this.node().__on;
    if (f) {
      for (var c = 0, h = f.length, m; c < h; ++c)
        for (i = 0, m = f[c]; i < o; ++i)
          if ((l = n[i]).type === m.type && l.name === m.name)
            return m.value;
    }
    return;
  }
  for (f = e ? YL : jL, i = 0; i < o; ++i) this.each(f(n[i], e, t));
  return this;
}
function d0(A, e, t) {
  var n = u0(A), i = n.CustomEvent;
  typeof i == "function" ? i = new i(e, t) : (i = n.document.createEvent("Event"), t ? (i.initEvent(e, t.bubbles, t.cancelable), i.detail = t.detail) : i.initEvent(e, !1, !1)), A.dispatchEvent(i);
}
function AT(A, e) {
  return function() {
    return d0(this, A, e);
  };
}
function eT(A, e) {
  return function() {
    return d0(this, A, e.apply(this, arguments));
  };
}
function tT(A, e) {
  return this.each((typeof e == "function" ? eT : AT)(A, e));
}
function* nT() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, o = n.length, l; i < o; ++i)
      (l = n[i]) && (yield l);
}
var Dp = [null];
function Xt(A, e) {
  this._groups = A, this._parents = e;
}
function Vs() {
  return new Xt([[document.documentElement]], Dp);
}
function rT() {
  return this;
}
Xt.prototype = Vs.prototype = {
  constructor: Xt,
  select: HS,
  selectAll: TS,
  selectChild: MS,
  selectChildren: kS,
  filter: $S,
  data: zS,
  enter: GS,
  exit: jS,
  join: YS,
  merge: ZS,
  selection: rT,
  order: AL,
  sort: eL,
  call: nL,
  nodes: rL,
  node: iL,
  size: aL,
  empty: oL,
  each: sL,
  attr: pL,
  style: mL,
  property: QL,
  classed: bL,
  text: HL,
  html: DL,
  raise: NL,
  lower: PL,
  append: KL,
  insert: kL,
  remove: GL,
  clone: XL,
  datum: qL,
  on: ZL,
  dispatch: tT,
  [Symbol.iterator]: nT
};
function WA(A) {
  return typeof A == "string" ? new Xt([[document.querySelector(A)]], [document.documentElement]) : new Xt([[A]], Dp);
}
function iT(A) {
  let e;
  for (; e = A.sourceEvent; ) A = e;
  return A;
}
function Vn(A, e) {
  if (A = iT(A), e === void 0 && (e = A.currentTarget), e) {
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
function nd(A) {
  return typeof A == "string" ? new Xt([document.querySelectorAll(A)], [document.documentElement]) : new Xt([r0(A)], Dp);
}
const aT = { passive: !1 }, Hs = { capture: !0, passive: !1 };
function gh(A) {
  A.stopImmediatePropagation();
}
function eo(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function p0(A) {
  var e = A.document.documentElement, t = WA(A).on("dragstart.drag", eo, Hs);
  "onselectstart" in e ? t.on("selectstart.drag", eo, Hs) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function g0(A, e) {
  var t = A.document.documentElement, n = WA(A).on("dragstart.drag", null);
  e && (n.on("click.drag", eo, Hs), setTimeout(function() {
    n.on("click.drag", null);
  }, 0)), "onselectstart" in t ? n.on("selectstart.drag", null) : (t.style.MozUserSelect = t.__noselect, delete t.__noselect);
}
const ul = (A) => () => A;
function rd(A, {
  sourceEvent: e,
  subject: t,
  target: n,
  identifier: i,
  active: o,
  x: l,
  y: f,
  dx: c,
  dy: h,
  dispatch: m
}) {
  Object.defineProperties(this, {
    type: { value: A, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    subject: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: o, enumerable: !0, configurable: !0 },
    x: { value: l, enumerable: !0, configurable: !0 },
    y: { value: f, enumerable: !0, configurable: !0 },
    dx: { value: c, enumerable: !0, configurable: !0 },
    dy: { value: h, enumerable: !0, configurable: !0 },
    _: { value: m }
  });
}
rd.prototype.on = function() {
  var A = this._.on.apply(this._, arguments);
  return A === this._ ? this : A;
};
function oT(A) {
  return !A.ctrlKey && !A.button;
}
function sT() {
  return this.parentNode;
}
function uT(A, e) {
  return e ?? { x: A.x, y: A.y };
}
function lT() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function cT() {
  var A = oT, e = sT, t = uT, n = lT, i = {}, o = Nc("start", "drag", "end"), l = 0, f, c, h, m, B = 0;
  function g(x) {
    x.on("mousedown.drag", v).filter(n).on("touchstart.drag", F).on("touchmove.drag", U, aT).on("touchend.drag touchcancel.drag", S).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(x, P) {
    if (!(m || !A.call(this, x, P))) {
      var R = N(this, e.call(this, x, P), x, P, "mouse");
      R && (WA(x.view).on("mousemove.drag", u, Hs).on("mouseup.drag", C, Hs), p0(x.view), gh(x), h = !1, f = x.clientX, c = x.clientY, R("start", x));
    }
  }
  function u(x) {
    if (eo(x), !h) {
      var P = x.clientX - f, R = x.clientY - c;
      h = P * P + R * R > B;
    }
    i.mouse("drag", x);
  }
  function C(x) {
    WA(x.view).on("mousemove.drag mouseup.drag", null), g0(x.view, h), eo(x), i.mouse("end", x);
  }
  function F(x, P) {
    if (A.call(this, x, P)) {
      var R = x.changedTouches, J = e.call(this, x, P), fA = R.length, uA, BA;
      for (uA = 0; uA < fA; ++uA)
        (BA = N(this, J, x, P, R[uA].identifier, R[uA])) && (gh(x), BA("start", x, R[uA]));
    }
  }
  function U(x) {
    var P = x.changedTouches, R = P.length, J, fA;
    for (J = 0; J < R; ++J)
      (fA = i[P[J].identifier]) && (eo(x), fA("drag", x, P[J]));
  }
  function S(x) {
    var P = x.changedTouches, R = P.length, J, fA;
    for (m && clearTimeout(m), m = setTimeout(function() {
      m = null;
    }, 500), J = 0; J < R; ++J)
      (fA = i[P[J].identifier]) && (gh(x), fA("end", x, P[J]));
  }
  function N(x, P, R, J, fA, uA) {
    var BA = o.copy(), FA = Vn(uA || R, P), NA, xA, X;
    if ((X = t.call(x, new rd("beforestart", {
      sourceEvent: R,
      target: g,
      identifier: fA,
      active: l,
      x: FA[0],
      y: FA[1],
      dx: 0,
      dy: 0,
      dispatch: BA
    }), J)) != null)
      return NA = X.x - FA[0] || 0, xA = X.y - FA[1] || 0, function CA(tA, hA, _A) {
        var IA = FA, aA;
        switch (tA) {
          case "start":
            i[fA] = CA, aA = l++;
            break;
          case "end":
            delete i[fA], --l;
          case "drag":
            FA = Vn(_A || hA, P), aA = l;
            break;
        }
        BA.call(
          tA,
          x,
          new rd(tA, {
            sourceEvent: hA,
            subject: X,
            target: g,
            identifier: fA,
            active: aA,
            x: FA[0] + NA,
            y: FA[1] + xA,
            dx: FA[0] - IA[0],
            dy: FA[1] - IA[1],
            dispatch: BA
          }),
          J
        );
      };
  }
  return g.filter = function(x) {
    return arguments.length ? (A = typeof x == "function" ? x : ul(!!x), g) : A;
  }, g.container = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : ul(x), g) : e;
  }, g.subject = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : ul(x), g) : t;
  }, g.touchable = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : ul(!!x), g) : n;
  }, g.on = function() {
    var x = o.on.apply(o, arguments);
    return x === o ? g : x;
  }, g.clickDistance = function(x) {
    return arguments.length ? (B = (x = +x) * x, g) : Math.sqrt(B);
  }, g;
}
function Op(A, e, t) {
  A.prototype = e.prototype = t, t.constructor = A;
}
function B0(A, e) {
  var t = Object.create(A.prototype);
  for (var n in e) t[n] = e[n];
  return t;
}
function Ws() {
}
var Ss = 0.7, lc = 1 / Ss, to = "\\s*([+-]?\\d+)\\s*", Ls = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", hr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", fT = /^#([0-9a-f]{3,8})$/, hT = new RegExp(`^rgb\\(${to},${to},${to}\\)$`), dT = new RegExp(`^rgb\\(${hr},${hr},${hr}\\)$`), pT = new RegExp(`^rgba\\(${to},${to},${to},${Ls}\\)$`), gT = new RegExp(`^rgba\\(${hr},${hr},${hr},${Ls}\\)$`), BT = new RegExp(`^hsl\\(${Ls},${hr},${hr}\\)$`), wT = new RegExp(`^hsla\\(${Ls},${hr},${hr},${Ls}\\)$`), ww = {
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
Op(Ws, ua, {
  copy(A) {
    return Object.assign(new this.constructor(), this, A);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: mw,
  // Deprecated! Use color.formatHex.
  formatHex: mw,
  formatHex8: mT,
  formatHsl: vT,
  formatRgb: vw,
  toString: vw
});
function mw() {
  return this.rgb().formatHex();
}
function mT() {
  return this.rgb().formatHex8();
}
function vT() {
  return w0(this).formatHsl();
}
function vw() {
  return this.rgb().formatRgb();
}
function ua(A) {
  var e, t;
  return A = (A + "").trim().toLowerCase(), (e = fT.exec(A)) ? (t = e[1].length, e = parseInt(e[1], 16), t === 6 ? yw(e) : t === 3 ? new tn(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : t === 8 ? ll(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : t === 4 ? ll(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = hT.exec(A)) ? new tn(e[1], e[2], e[3], 1) : (e = dT.exec(A)) ? new tn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = pT.exec(A)) ? ll(e[1], e[2], e[3], e[4]) : (e = gT.exec(A)) ? ll(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = BT.exec(A)) ? Fw(e[1], e[2] / 100, e[3] / 100, 1) : (e = wT.exec(A)) ? Fw(e[1], e[2] / 100, e[3] / 100, e[4]) : ww.hasOwnProperty(A) ? yw(ww[A]) : A === "transparent" ? new tn(NaN, NaN, NaN, 0) : null;
}
function yw(A) {
  return new tn(A >> 16 & 255, A >> 8 & 255, A & 255, 1);
}
function ll(A, e, t, n) {
  return n <= 0 && (A = e = t = NaN), new tn(A, e, t, n);
}
function yT(A) {
  return A instanceof Ws || (A = ua(A)), A ? (A = A.rgb(), new tn(A.r, A.g, A.b, A.opacity)) : new tn();
}
function id(A, e, t, n) {
  return arguments.length === 1 ? yT(A) : new tn(A, e, t, n ?? 1);
}
function tn(A, e, t, n) {
  this.r = +A, this.g = +e, this.b = +t, this.opacity = +n;
}
Op(tn, id, B0(Ws, {
  brighter(A) {
    return A = A == null ? lc : Math.pow(lc, A), new tn(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Ss : Math.pow(Ss, A), new tn(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new tn(na(this.r), na(this.g), na(this.b), cc(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Cw,
  // Deprecated! Use color.formatHex.
  formatHex: Cw,
  formatHex8: CT,
  formatRgb: Qw,
  toString: Qw
}));
function Cw() {
  return `#${ea(this.r)}${ea(this.g)}${ea(this.b)}`;
}
function CT() {
  return `#${ea(this.r)}${ea(this.g)}${ea(this.b)}${ea((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Qw() {
  const A = cc(this.opacity);
  return `${A === 1 ? "rgb(" : "rgba("}${na(this.r)}, ${na(this.g)}, ${na(this.b)}${A === 1 ? ")" : `, ${A})`}`;
}
function cc(A) {
  return isNaN(A) ? 1 : Math.max(0, Math.min(1, A));
}
function na(A) {
  return Math.max(0, Math.min(255, Math.round(A) || 0));
}
function ea(A) {
  return A = na(A), (A < 16 ? "0" : "") + A.toString(16);
}
function Fw(A, e, t, n) {
  return n <= 0 ? A = e = t = NaN : t <= 0 || t >= 1 ? A = e = NaN : e <= 0 && (A = NaN), new qn(A, e, t, n);
}
function w0(A) {
  if (A instanceof qn) return new qn(A.h, A.s, A.l, A.opacity);
  if (A instanceof Ws || (A = ua(A)), !A) return new qn();
  if (A instanceof qn) return A;
  A = A.rgb();
  var e = A.r / 255, t = A.g / 255, n = A.b / 255, i = Math.min(e, t, n), o = Math.max(e, t, n), l = NaN, f = o - i, c = (o + i) / 2;
  return f ? (e === o ? l = (t - n) / f + (t < n) * 6 : t === o ? l = (n - e) / f + 2 : l = (e - t) / f + 4, f /= c < 0.5 ? o + i : 2 - o - i, l *= 60) : f = c > 0 && c < 1 ? 0 : l, new qn(l, f, c, A.opacity);
}
function QT(A, e, t, n) {
  return arguments.length === 1 ? w0(A) : new qn(A, e, t, n ?? 1);
}
function qn(A, e, t, n) {
  this.h = +A, this.s = +e, this.l = +t, this.opacity = +n;
}
Op(qn, QT, B0(Ws, {
  brighter(A) {
    return A = A == null ? lc : Math.pow(lc, A), new qn(this.h, this.s, this.l * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Ss : Math.pow(Ss, A), new qn(this.h, this.s, this.l * A, this.opacity);
  },
  rgb() {
    var A = this.h % 360 + (this.h < 0) * 360, e = isNaN(A) || isNaN(this.s) ? 0 : this.s, t = this.l, n = t + (t < 0.5 ? t : 1 - t) * e, i = 2 * t - n;
    return new tn(
      Bh(A >= 240 ? A - 240 : A + 120, i, n),
      Bh(A, i, n),
      Bh(A < 120 ? A + 240 : A - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new qn(Uw(this.h), cl(this.s), cl(this.l), cc(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const A = cc(this.opacity);
    return `${A === 1 ? "hsl(" : "hsla("}${Uw(this.h)}, ${cl(this.s) * 100}%, ${cl(this.l) * 100}%${A === 1 ? ")" : `, ${A})`}`;
  }
}));
function Uw(A) {
  return A = (A || 0) % 360, A < 0 ? A + 360 : A;
}
function cl(A) {
  return Math.max(0, Math.min(1, A || 0));
}
function Bh(A, e, t) {
  return (A < 60 ? e + (t - e) * A / 60 : A < 180 ? t : A < 240 ? e + (t - e) * (240 - A) / 60 : e) * 255;
}
const Np = (A) => () => A;
function FT(A, e) {
  return function(t) {
    return A + t * e;
  };
}
function UT(A, e, t) {
  return A = Math.pow(A, t), e = Math.pow(e, t) - A, t = 1 / t, function(n) {
    return Math.pow(A + n * e, t);
  };
}
function ET(A) {
  return (A = +A) == 1 ? m0 : function(e, t) {
    return t - e ? UT(e, t, A) : Np(isNaN(e) ? t : e);
  };
}
function m0(A, e) {
  var t = e - A;
  return t ? FT(A, t) : Np(isNaN(A) ? e : A);
}
const fc = function A(e) {
  var t = ET(e);
  function n(i, o) {
    var l = t((i = id(i)).r, (o = id(o)).r), f = t(i.g, o.g), c = t(i.b, o.b), h = m0(i.opacity, o.opacity);
    return function(m) {
      return i.r = l(m), i.g = f(m), i.b = c(m), i.opacity = h(m), i + "";
    };
  }
  return n.gamma = A, n;
}(1);
function bT(A, e) {
  e || (e = []);
  var t = A ? Math.min(e.length, A.length) : 0, n = e.slice(), i;
  return function(o) {
    for (i = 0; i < t; ++i) n[i] = A[i] * (1 - o) + e[i] * o;
    return n;
  };
}
function _T(A) {
  return ArrayBuffer.isView(A) && !(A instanceof DataView);
}
function xT(A, e) {
  var t = e ? e.length : 0, n = A ? Math.min(t, A.length) : 0, i = new Array(n), o = new Array(t), l;
  for (l = 0; l < n; ++l) i[l] = Mp(A[l], e[l]);
  for (; l < t; ++l) o[l] = e[l];
  return function(f) {
    for (l = 0; l < n; ++l) o[l] = i[l](f);
    return o;
  };
}
function IT(A, e) {
  var t = /* @__PURE__ */ new Date();
  return A = +A, e = +e, function(n) {
    return t.setTime(A * (1 - n) + e * n), t;
  };
}
function Wn(A, e) {
  return A = +A, e = +e, function(t) {
    return A * (1 - t) + e * t;
  };
}
function HT(A, e) {
  var t = {}, n = {}, i;
  (A === null || typeof A != "object") && (A = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in A ? t[i] = Mp(A[i], e[i]) : n[i] = e[i];
  return function(o) {
    for (i in t) n[i] = t[i](o);
    return n;
  };
}
var ad = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, wh = new RegExp(ad.source, "g");
function ST(A) {
  return function() {
    return A;
  };
}
function LT(A) {
  return function(e) {
    return A(e) + "";
  };
}
function v0(A, e) {
  var t = ad.lastIndex = wh.lastIndex = 0, n, i, o, l = -1, f = [], c = [];
  for (A = A + "", e = e + ""; (n = ad.exec(A)) && (i = wh.exec(e)); )
    (o = i.index) > t && (o = e.slice(t, o), f[l] ? f[l] += o : f[++l] = o), (n = n[0]) === (i = i[0]) ? f[l] ? f[l] += i : f[++l] = i : (f[++l] = null, c.push({ i: l, x: Wn(n, i) })), t = wh.lastIndex;
  return t < e.length && (o = e.slice(t), f[l] ? f[l] += o : f[++l] = o), f.length < 2 ? c[0] ? LT(c[0].x) : ST(e) : (e = c.length, function(h) {
    for (var m = 0, B; m < e; ++m) f[(B = c[m]).i] = B.x(h);
    return f.join("");
  });
}
function Mp(A, e) {
  var t = typeof e, n;
  return e == null || t === "boolean" ? Np(e) : (t === "number" ? Wn : t === "string" ? (n = ua(e)) ? (e = n, fc) : v0 : e instanceof ua ? fc : e instanceof Date ? IT : _T(e) ? bT : Array.isArray(e) ? xT : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? HT : Wn)(A, e);
}
function TT(A, e) {
  return A = +A, e = +e, function(t) {
    return Math.round(A * (1 - t) + e * t);
  };
}
var Ew = 180 / Math.PI, od = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function y0(A, e, t, n, i, o) {
  var l, f, c;
  return (l = Math.sqrt(A * A + e * e)) && (A /= l, e /= l), (c = A * t + e * n) && (t -= A * c, n -= e * c), (f = Math.sqrt(t * t + n * n)) && (t /= f, n /= f, c /= f), A * n < e * t && (A = -A, e = -e, c = -c, l = -l), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(e, A) * Ew,
    skewX: Math.atan(c) * Ew,
    scaleX: l,
    scaleY: f
  };
}
var fl;
function DT(A) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(A + "");
  return e.isIdentity ? od : y0(e.a, e.b, e.c, e.d, e.e, e.f);
}
function OT(A) {
  return A == null || (fl || (fl = document.createElementNS("http://www.w3.org/2000/svg", "g")), fl.setAttribute("transform", A), !(A = fl.transform.baseVal.consolidate())) ? od : (A = A.matrix, y0(A.a, A.b, A.c, A.d, A.e, A.f));
}
function C0(A, e, t, n) {
  function i(h) {
    return h.length ? h.pop() + " " : "";
  }
  function o(h, m, B, g, v, u) {
    if (h !== B || m !== g) {
      var C = v.push("translate(", null, e, null, t);
      u.push({ i: C - 4, x: Wn(h, B) }, { i: C - 2, x: Wn(m, g) });
    } else (B || g) && v.push("translate(" + B + e + g + t);
  }
  function l(h, m, B, g) {
    h !== m ? (h - m > 180 ? m += 360 : m - h > 180 && (h += 360), g.push({ i: B.push(i(B) + "rotate(", null, n) - 2, x: Wn(h, m) })) : m && B.push(i(B) + "rotate(" + m + n);
  }
  function f(h, m, B, g) {
    h !== m ? g.push({ i: B.push(i(B) + "skewX(", null, n) - 2, x: Wn(h, m) }) : m && B.push(i(B) + "skewX(" + m + n);
  }
  function c(h, m, B, g, v, u) {
    if (h !== B || m !== g) {
      var C = v.push(i(v) + "scale(", null, ",", null, ")");
      u.push({ i: C - 4, x: Wn(h, B) }, { i: C - 2, x: Wn(m, g) });
    } else (B !== 1 || g !== 1) && v.push(i(v) + "scale(" + B + "," + g + ")");
  }
  return function(h, m) {
    var B = [], g = [];
    return h = A(h), m = A(m), o(h.translateX, h.translateY, m.translateX, m.translateY, B, g), l(h.rotate, m.rotate, B, g), f(h.skewX, m.skewX, B, g), c(h.scaleX, h.scaleY, m.scaleX, m.scaleY, B, g), h = m = null, function(v) {
      for (var u = -1, C = g.length, F; ++u < C; ) B[(F = g[u]).i] = F.x(v);
      return B.join("");
    };
  };
}
var NT = C0(DT, "px, ", "px)", "deg)"), MT = C0(OT, ", ", ")", ")"), PT = 1e-12;
function bw(A) {
  return ((A = Math.exp(A)) + 1 / A) / 2;
}
function KT(A) {
  return ((A = Math.exp(A)) - 1 / A) / 2;
}
function RT(A) {
  return ((A = Math.exp(2 * A)) - 1) / (A + 1);
}
const kT = function A(e, t, n) {
  function i(o, l) {
    var f = o[0], c = o[1], h = o[2], m = l[0], B = l[1], g = l[2], v = m - f, u = B - c, C = v * v + u * u, F, U;
    if (C < PT)
      U = Math.log(g / h) / e, F = function(J) {
        return [
          f + J * v,
          c + J * u,
          h * Math.exp(e * J * U)
        ];
      };
    else {
      var S = Math.sqrt(C), N = (g * g - h * h + n * C) / (2 * h * t * S), x = (g * g - h * h - n * C) / (2 * g * t * S), P = Math.log(Math.sqrt(N * N + 1) - N), R = Math.log(Math.sqrt(x * x + 1) - x);
      U = (R - P) / e, F = function(J) {
        var fA = J * U, uA = bw(P), BA = h / (t * S) * (uA * RT(e * fA + P) - KT(P));
        return [
          f + BA * v,
          c + BA * u,
          h * uA / bw(e * fA + P)
        ];
      };
    }
    return F.duration = U * 1e3 * e / Math.SQRT2, F;
  }
  return i.rho = function(o) {
    var l = Math.max(1e-3, +o), f = l * l, c = f * f;
    return A(l, f, c);
  }, i;
}(Math.SQRT2, 2, 4);
var so = 0, ss = 0, Zo = 0, Q0 = 1e3, hc, us, dc = 0, la = 0, Pc = 0, Ts = typeof performance == "object" && performance.now ? performance : Date, F0 = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(A) {
  setTimeout(A, 17);
};
function Pp() {
  return la || (F0($T), la = Ts.now() + Pc);
}
function $T() {
  la = 0;
}
function pc() {
  this._call = this._time = this._next = null;
}
pc.prototype = U0.prototype = {
  constructor: pc,
  restart: function(A, e, t) {
    if (typeof A != "function") throw new TypeError("callback is not a function");
    t = (t == null ? Pp() : +t) + (e == null ? 0 : +e), !this._next && us !== this && (us ? us._next = this : hc = this, us = this), this._call = A, this._time = t, sd();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, sd());
  }
};
function U0(A, e, t) {
  var n = new pc();
  return n.restart(A, e, t), n;
}
function GT() {
  Pp(), ++so;
  for (var A = hc, e; A; )
    (e = la - A._time) >= 0 && A._call.call(void 0, e), A = A._next;
  --so;
}
function _w() {
  la = (dc = Ts.now()) + Pc, so = ss = 0;
  try {
    GT();
  } finally {
    so = 0, WT(), la = 0;
  }
}
function VT() {
  var A = Ts.now(), e = A - dc;
  e > Q0 && (Pc -= e, dc = A);
}
function WT() {
  for (var A, e = hc, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), A = e, e = e._next) : (t = e._next, e._next = null, e = A ? A._next = t : hc = t);
  us = A, sd(n);
}
function sd(A) {
  if (!so) {
    ss && (ss = clearTimeout(ss));
    var e = A - la;
    e > 24 ? (A < 1 / 0 && (ss = setTimeout(_w, A - Ts.now() - Pc)), Zo && (Zo = clearInterval(Zo))) : (Zo || (dc = Ts.now(), Zo = setInterval(VT, Q0)), so = 1, F0(_w));
  }
}
function xw(A, e, t) {
  var n = new pc();
  return e = e == null ? 0 : +e, n.restart((i) => {
    n.stop(), A(i + e);
  }, e, t), n;
}
var XT = Nc("start", "end", "cancel", "interrupt"), qT = [], E0 = 0, Iw = 1, ud = 2, ql = 3, Hw = 4, ld = 5, zl = 6;
function Kc(A, e, t, n, i, o) {
  var l = A.__transition;
  if (!l) A.__transition = {};
  else if (t in l) return;
  zT(A, t, {
    name: e,
    index: n,
    // For context during callback.
    group: i,
    // For context during callback.
    on: XT,
    tween: qT,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: E0
  });
}
function Kp(A, e) {
  var t = Jn(A, e);
  if (t.state > E0) throw new Error("too late; already scheduled");
  return t;
}
function Br(A, e) {
  var t = Jn(A, e);
  if (t.state > ql) throw new Error("too late; already running");
  return t;
}
function Jn(A, e) {
  var t = A.__transition;
  if (!t || !(t = t[e])) throw new Error("transition not found");
  return t;
}
function zT(A, e, t) {
  var n = A.__transition, i;
  n[e] = t, t.timer = U0(o, 0, t.time);
  function o(h) {
    t.state = Iw, t.timer.restart(l, t.delay, t.time), t.delay <= h && l(h - t.delay);
  }
  function l(h) {
    var m, B, g, v;
    if (t.state !== Iw) return c();
    for (m in n)
      if (v = n[m], v.name === t.name) {
        if (v.state === ql) return xw(l);
        v.state === Hw ? (v.state = zl, v.timer.stop(), v.on.call("interrupt", A, A.__data__, v.index, v.group), delete n[m]) : +m < e && (v.state = zl, v.timer.stop(), v.on.call("cancel", A, A.__data__, v.index, v.group), delete n[m]);
      }
    if (xw(function() {
      t.state === ql && (t.state = Hw, t.timer.restart(f, t.delay, t.time), f(h));
    }), t.state = ud, t.on.call("start", A, A.__data__, t.index, t.group), t.state === ud) {
      for (t.state = ql, i = new Array(g = t.tween.length), m = 0, B = -1; m < g; ++m)
        (v = t.tween[m].value.call(A, A.__data__, t.index, t.group)) && (i[++B] = v);
      i.length = B + 1;
    }
  }
  function f(h) {
    for (var m = h < t.duration ? t.ease.call(null, h / t.duration) : (t.timer.restart(c), t.state = ld, 1), B = -1, g = i.length; ++B < g; )
      i[B].call(A, m);
    t.state === ld && (t.on.call("end", A, A.__data__, t.index, t.group), c());
  }
  function c() {
    t.state = zl, t.timer.stop(), delete n[e];
    for (var h in n) return;
    delete A.__transition;
  }
}
function Jl(A, e) {
  var t = A.__transition, n, i, o = !0, l;
  if (t) {
    e = e == null ? null : e + "";
    for (l in t) {
      if ((n = t[l]).name !== e) {
        o = !1;
        continue;
      }
      i = n.state > ud && n.state < ld, n.state = zl, n.timer.stop(), n.on.call(i ? "interrupt" : "cancel", A, A.__data__, n.index, n.group), delete t[l];
    }
    o && delete A.__transition;
  }
}
function JT(A) {
  return this.each(function() {
    Jl(this, A);
  });
}
function jT(A, e) {
  var t, n;
  return function() {
    var i = Br(this, A), o = i.tween;
    if (o !== t) {
      n = t = o;
      for (var l = 0, f = n.length; l < f; ++l)
        if (n[l].name === e) {
          n = n.slice(), n.splice(l, 1);
          break;
        }
    }
    i.tween = n;
  };
}
function YT(A, e, t) {
  var n, i;
  if (typeof t != "function") throw new Error();
  return function() {
    var o = Br(this, A), l = o.tween;
    if (l !== n) {
      i = (n = l).slice();
      for (var f = { name: e, value: t }, c = 0, h = i.length; c < h; ++c)
        if (i[c].name === e) {
          i[c] = f;
          break;
        }
      c === h && i.push(f);
    }
    o.tween = i;
  };
}
function ZT(A, e) {
  var t = this._id;
  if (A += "", arguments.length < 2) {
    for (var n = Jn(this.node(), t).tween, i = 0, o = n.length, l; i < o; ++i)
      if ((l = n[i]).name === A)
        return l.value;
    return null;
  }
  return this.each((e == null ? jT : YT)(t, A, e));
}
function Rp(A, e, t) {
  var n = A._id;
  return A.each(function() {
    var i = Br(this, n);
    (i.value || (i.value = {}))[e] = t.apply(this, arguments);
  }), function(i) {
    return Jn(i, n).value[e];
  };
}
function b0(A, e) {
  var t;
  return (typeof e == "number" ? Wn : e instanceof ua ? fc : (t = ua(e)) ? (e = t, fc) : v0)(A, e);
}
function AD(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function eD(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function tD(A, e, t) {
  var n, i = t + "", o;
  return function() {
    var l = this.getAttribute(A);
    return l === i ? null : l === n ? o : o = e(n = l, t);
  };
}
function nD(A, e, t) {
  var n, i = t + "", o;
  return function() {
    var l = this.getAttributeNS(A.space, A.local);
    return l === i ? null : l === n ? o : o = e(n = l, t);
  };
}
function rD(A, e, t) {
  var n, i, o;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttribute(A) : (l = this.getAttribute(A), c = f + "", l === c ? null : l === n && c === i ? o : (i = c, o = e(n = l, f)));
  };
}
function iD(A, e, t) {
  var n, i, o;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttributeNS(A.space, A.local) : (l = this.getAttributeNS(A.space, A.local), c = f + "", l === c ? null : l === n && c === i ? o : (i = c, o = e(n = l, f)));
  };
}
function aD(A, e) {
  var t = Mc(A), n = t === "transform" ? MT : b0;
  return this.attrTween(A, typeof e == "function" ? (t.local ? iD : rD)(t, n, Rp(this, "attr." + A, e)) : e == null ? (t.local ? eD : AD)(t) : (t.local ? nD : tD)(t, n, e));
}
function oD(A, e) {
  return function(t) {
    this.setAttribute(A, e.call(this, t));
  };
}
function sD(A, e) {
  return function(t) {
    this.setAttributeNS(A.space, A.local, e.call(this, t));
  };
}
function uD(A, e) {
  var t, n;
  function i() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && sD(A, o)), t;
  }
  return i._value = e, i;
}
function lD(A, e) {
  var t, n;
  function i() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && oD(A, o)), t;
  }
  return i._value = e, i;
}
function cD(A, e) {
  var t = "attr." + A;
  if (arguments.length < 2) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  var n = Mc(A);
  return this.tween(t, (n.local ? uD : lD)(n, e));
}
function fD(A, e) {
  return function() {
    Kp(this, A).delay = +e.apply(this, arguments);
  };
}
function hD(A, e) {
  return e = +e, function() {
    Kp(this, A).delay = e;
  };
}
function dD(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? fD : hD)(e, A)) : Jn(this.node(), e).delay;
}
function pD(A, e) {
  return function() {
    Br(this, A).duration = +e.apply(this, arguments);
  };
}
function gD(A, e) {
  return e = +e, function() {
    Br(this, A).duration = e;
  };
}
function BD(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? pD : gD)(e, A)) : Jn(this.node(), e).duration;
}
function wD(A, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Br(this, A).ease = e;
  };
}
function mD(A) {
  var e = this._id;
  return arguments.length ? this.each(wD(e, A)) : Jn(this.node(), e).ease;
}
function vD(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    if (typeof t != "function") throw new Error();
    Br(this, A).ease = t;
  };
}
function yD(A) {
  if (typeof A != "function") throw new Error();
  return this.each(vD(this._id, A));
}
function CD(A) {
  typeof A != "function" && (A = a0(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var o = e[i], l = o.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = o[h]) && A.call(c, c.__data__, h, o) && f.push(c);
  return new Wr(n, this._parents, this._name, this._id);
}
function QD(A) {
  if (A._id !== this._id) throw new Error();
  for (var e = this._groups, t = A._groups, n = e.length, i = t.length, o = Math.min(n, i), l = new Array(n), f = 0; f < o; ++f)
    for (var c = e[f], h = t[f], m = c.length, B = l[f] = new Array(m), g, v = 0; v < m; ++v)
      (g = c[v] || h[v]) && (B[v] = g);
  for (; f < n; ++f)
    l[f] = e[f];
  return new Wr(l, this._parents, this._name, this._id);
}
function FD(A) {
  return (A + "").trim().split(/^|\s+/).every(function(e) {
    var t = e.indexOf(".");
    return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
  });
}
function UD(A, e, t) {
  var n, i, o = FD(e) ? Kp : Br;
  return function() {
    var l = o(this, A), f = l.on;
    f !== n && (i = (n = f).copy()).on(e, t), l.on = i;
  };
}
function ED(A, e) {
  var t = this._id;
  return arguments.length < 2 ? Jn(this.node(), t).on.on(A) : this.each(UD(t, A, e));
}
function bD(A) {
  return function() {
    var e = this.parentNode;
    for (var t in this.__transition) if (+t !== A) return;
    e && e.removeChild(this);
  };
}
function _D() {
  return this.on("end.remove", bD(this._id));
}
function xD(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Lp(A));
  for (var n = this._groups, i = n.length, o = new Array(i), l = 0; l < i; ++l)
    for (var f = n[l], c = f.length, h = o[l] = new Array(c), m, B, g = 0; g < c; ++g)
      (m = f[g]) && (B = A.call(m, m.__data__, g, f)) && ("__data__" in m && (B.__data__ = m.__data__), h[g] = B, Kc(h[g], e, t, g, h, Jn(m, t)));
  return new Wr(o, this._parents, e, t);
}
function ID(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = i0(A));
  for (var n = this._groups, i = n.length, o = [], l = [], f = 0; f < i; ++f)
    for (var c = n[f], h = c.length, m, B = 0; B < h; ++B)
      if (m = c[B]) {
        for (var g = A.call(m, m.__data__, B, c), v, u = Jn(m, t), C = 0, F = g.length; C < F; ++C)
          (v = g[C]) && Kc(v, e, t, C, g, u);
        o.push(g), l.push(m);
      }
  return new Wr(o, l, e, t);
}
var HD = Vs.prototype.constructor;
function SD() {
  return new HD(this._groups, this._parents);
}
function LD(A, e) {
  var t, n, i;
  return function() {
    var o = oo(this, A), l = (this.style.removeProperty(A), oo(this, A));
    return o === l ? null : o === t && l === n ? i : i = e(t = o, n = l);
  };
}
function _0(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function TD(A, e, t) {
  var n, i = t + "", o;
  return function() {
    var l = oo(this, A);
    return l === i ? null : l === n ? o : o = e(n = l, t);
  };
}
function DD(A, e, t) {
  var n, i, o;
  return function() {
    var l = oo(this, A), f = t(this), c = f + "";
    return f == null && (c = f = (this.style.removeProperty(A), oo(this, A))), l === c ? null : l === n && c === i ? o : (i = c, o = e(n = l, f));
  };
}
function OD(A, e) {
  var t, n, i, o = "style." + e, l = "end." + o, f;
  return function() {
    var c = Br(this, A), h = c.on, m = c.value[o] == null ? f || (f = _0(e)) : void 0;
    (h !== t || i !== m) && (n = (t = h).copy()).on(l, i = m), c.on = n;
  };
}
function ND(A, e, t) {
  var n = (A += "") == "transform" ? NT : b0;
  return e == null ? this.styleTween(A, LD(A, n)).on("end.style." + A, _0(A)) : typeof e == "function" ? this.styleTween(A, DD(A, n, Rp(this, "style." + A, e))).each(OD(this._id, A)) : this.styleTween(A, TD(A, n, e), t).on("end.style." + A, null);
}
function MD(A, e, t) {
  return function(n) {
    this.style.setProperty(A, e.call(this, n), t);
  };
}
function PD(A, e, t) {
  var n, i;
  function o() {
    var l = e.apply(this, arguments);
    return l !== i && (n = (i = l) && MD(A, l, t)), n;
  }
  return o._value = e, o;
}
function KD(A, e, t) {
  var n = "style." + (A += "");
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, PD(A, e, t ?? ""));
}
function RD(A) {
  return function() {
    this.textContent = A;
  };
}
function kD(A) {
  return function() {
    var e = A(this);
    this.textContent = e ?? "";
  };
}
function $D(A) {
  return this.tween("text", typeof A == "function" ? kD(Rp(this, "text", A)) : RD(A == null ? "" : A + ""));
}
function GD(A) {
  return function(e) {
    this.textContent = A.call(this, e);
  };
}
function VD(A) {
  var e, t;
  function n() {
    var i = A.apply(this, arguments);
    return i !== t && (e = (t = i) && GD(i)), e;
  }
  return n._value = A, n;
}
function WD(A) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (A == null) return this.tween(e, null);
  if (typeof A != "function") throw new Error();
  return this.tween(e, VD(A));
}
function XD() {
  for (var A = this._name, e = this._id, t = x0(), n = this._groups, i = n.length, o = 0; o < i; ++o)
    for (var l = n[o], f = l.length, c, h = 0; h < f; ++h)
      if (c = l[h]) {
        var m = Jn(c, e);
        Kc(c, A, t, h, l, {
          time: m.time + m.delay + m.duration,
          delay: 0,
          duration: m.duration,
          ease: m.ease
        });
      }
  return new Wr(n, this._parents, A, t);
}
function qD() {
  var A, e, t = this, n = t._id, i = t.size();
  return new Promise(function(o, l) {
    var f = { value: l }, c = { value: function() {
      --i === 0 && o();
    } };
    t.each(function() {
      var h = Br(this, n), m = h.on;
      m !== A && (e = (A = m).copy(), e._.cancel.push(f), e._.interrupt.push(f), e._.end.push(c)), h.on = e;
    }), i === 0 && o();
  });
}
var zD = 0;
function Wr(A, e, t, n) {
  this._groups = A, this._parents = e, this._name = t, this._id = n;
}
function x0() {
  return ++zD;
}
var Nr = Vs.prototype;
Wr.prototype = {
  constructor: Wr,
  select: xD,
  selectAll: ID,
  selectChild: Nr.selectChild,
  selectChildren: Nr.selectChildren,
  filter: CD,
  merge: QD,
  selection: SD,
  transition: XD,
  call: Nr.call,
  nodes: Nr.nodes,
  node: Nr.node,
  size: Nr.size,
  empty: Nr.empty,
  each: Nr.each,
  on: ED,
  attr: aD,
  attrTween: cD,
  style: ND,
  styleTween: KD,
  text: $D,
  textTween: WD,
  remove: _D,
  tween: ZT,
  delay: dD,
  duration: BD,
  ease: mD,
  easeVarying: yD,
  end: qD,
  [Symbol.iterator]: Nr[Symbol.iterator]
};
function JD(A) {
  return ((A *= 2) <= 1 ? A * A * A : (A -= 2) * A * A + 2) / 2;
}
var jD = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: JD
};
function YD(A, e) {
  for (var t; !(t = A.__transition) || !(t = t[e]); )
    if (!(A = A.parentNode))
      throw new Error(`transition ${e} not found`);
  return t;
}
function ZD(A) {
  var e, t;
  A instanceof Wr ? (e = A._id, A = A._name) : (e = x0(), (t = jD).time = Pp(), A = A == null ? null : A + "");
  for (var n = this._groups, i = n.length, o = 0; o < i; ++o)
    for (var l = n[o], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && Kc(c, A, e, h, l, t || YD(c, e));
  return new Wr(n, this._parents, A, e);
}
Vs.prototype.interrupt = JT;
Vs.prototype.transition = ZD;
function AO(A) {
  return Math.abs(A = Math.round(A)) >= 1e21 ? A.toLocaleString("en").replace(/,/g, "") : A.toString(10);
}
function gc(A, e) {
  if ((t = (A = e ? A.toExponential(e - 1) : A.toExponential()).indexOf("e")) < 0) return null;
  var t, n = A.slice(0, t);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +A.slice(t + 1)
  ];
}
function uo(A) {
  return A = gc(Math.abs(A)), A ? A[1] : NaN;
}
function eO(A, e) {
  return function(t, n) {
    for (var i = t.length, o = [], l = 0, f = A[0], c = 0; i > 0 && f > 0 && (c + f + 1 > n && (f = Math.max(1, n - c)), o.push(t.substring(i -= f, i + f)), !((c += f + 1) > n)); )
      f = A[l = (l + 1) % A.length];
    return o.reverse().join(e);
  };
}
function tO(A) {
  return function(e) {
    return e.replace(/[0-9]/g, function(t) {
      return A[+t];
    });
  };
}
var nO = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Bc(A) {
  if (!(e = nO.exec(A))) throw new Error("invalid format: " + A);
  var e;
  return new kp({
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
Bc.prototype = kp.prototype;
function kp(A) {
  this.fill = A.fill === void 0 ? " " : A.fill + "", this.align = A.align === void 0 ? ">" : A.align + "", this.sign = A.sign === void 0 ? "-" : A.sign + "", this.symbol = A.symbol === void 0 ? "" : A.symbol + "", this.zero = !!A.zero, this.width = A.width === void 0 ? void 0 : +A.width, this.comma = !!A.comma, this.precision = A.precision === void 0 ? void 0 : +A.precision, this.trim = !!A.trim, this.type = A.type === void 0 ? "" : A.type + "";
}
kp.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function rO(A) {
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
var I0;
function iO(A, e) {
  var t = gc(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1], o = i - (I0 = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, l = n.length;
  return o === l ? n : o > l ? n + new Array(o - l + 1).join("0") : o > 0 ? n.slice(0, o) + "." + n.slice(o) : "0." + new Array(1 - o).join("0") + gc(A, Math.max(0, e + o - 1))[0];
}
function Sw(A, e) {
  var t = gc(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const Lw = {
  "%": (A, e) => (A * 100).toFixed(e),
  b: (A) => Math.round(A).toString(2),
  c: (A) => A + "",
  d: AO,
  e: (A, e) => A.toExponential(e),
  f: (A, e) => A.toFixed(e),
  g: (A, e) => A.toPrecision(e),
  o: (A) => Math.round(A).toString(8),
  p: (A, e) => Sw(A * 100, e),
  r: Sw,
  s: iO,
  X: (A) => Math.round(A).toString(16).toUpperCase(),
  x: (A) => Math.round(A).toString(16)
};
function Tw(A) {
  return A;
}
var Dw = Array.prototype.map, Ow = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function aO(A) {
  var e = A.grouping === void 0 || A.thousands === void 0 ? Tw : eO(Dw.call(A.grouping, Number), A.thousands + ""), t = A.currency === void 0 ? "" : A.currency[0] + "", n = A.currency === void 0 ? "" : A.currency[1] + "", i = A.decimal === void 0 ? "." : A.decimal + "", o = A.numerals === void 0 ? Tw : tO(Dw.call(A.numerals, String)), l = A.percent === void 0 ? "%" : A.percent + "", f = A.minus === void 0 ? "−" : A.minus + "", c = A.nan === void 0 ? "NaN" : A.nan + "";
  function h(B) {
    B = Bc(B);
    var g = B.fill, v = B.align, u = B.sign, C = B.symbol, F = B.zero, U = B.width, S = B.comma, N = B.precision, x = B.trim, P = B.type;
    P === "n" ? (S = !0, P = "g") : Lw[P] || (N === void 0 && (N = 12), x = !0, P = "g"), (F || g === "0" && v === "=") && (F = !0, g = "0", v = "=");
    var R = C === "$" ? t : C === "#" && /[boxX]/.test(P) ? "0" + P.toLowerCase() : "", J = C === "$" ? n : /[%p]/.test(P) ? l : "", fA = Lw[P], uA = /[defgprs%]/.test(P);
    N = N === void 0 ? 6 : /[gprs]/.test(P) ? Math.max(1, Math.min(21, N)) : Math.max(0, Math.min(20, N));
    function BA(FA) {
      var NA = R, xA = J, X, CA, tA;
      if (P === "c")
        xA = fA(FA) + xA, FA = "";
      else {
        FA = +FA;
        var hA = FA < 0 || 1 / FA < 0;
        if (FA = isNaN(FA) ? c : fA(Math.abs(FA), N), x && (FA = rO(FA)), hA && +FA == 0 && u !== "+" && (hA = !1), NA = (hA ? u === "(" ? u : f : u === "-" || u === "(" ? "" : u) + NA, xA = (P === "s" ? Ow[8 + I0 / 3] : "") + xA + (hA && u === "(" ? ")" : ""), uA) {
          for (X = -1, CA = FA.length; ++X < CA; )
            if (tA = FA.charCodeAt(X), 48 > tA || tA > 57) {
              xA = (tA === 46 ? i + FA.slice(X + 1) : FA.slice(X)) + xA, FA = FA.slice(0, X);
              break;
            }
        }
      }
      S && !F && (FA = e(FA, 1 / 0));
      var _A = NA.length + FA.length + xA.length, IA = _A < U ? new Array(U - _A + 1).join(g) : "";
      switch (S && F && (FA = e(IA + FA, IA.length ? U - xA.length : 1 / 0), IA = ""), v) {
        case "<":
          FA = NA + FA + xA + IA;
          break;
        case "=":
          FA = NA + IA + FA + xA;
          break;
        case "^":
          FA = IA.slice(0, _A = IA.length >> 1) + NA + FA + xA + IA.slice(_A);
          break;
        default:
          FA = IA + NA + FA + xA;
          break;
      }
      return o(FA);
    }
    return BA.toString = function() {
      return B + "";
    }, BA;
  }
  function m(B, g) {
    var v = h((B = Bc(B), B.type = "f", B)), u = Math.max(-8, Math.min(8, Math.floor(uo(g) / 3))) * 3, C = Math.pow(10, -u), F = Ow[8 + u / 3];
    return function(U) {
      return v(C * U) + F;
    };
  }
  return {
    format: h,
    formatPrefix: m
  };
}
var hl, H0, S0;
oO({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function oO(A) {
  return hl = aO(A), H0 = hl.format, S0 = hl.formatPrefix, hl;
}
function sO(A) {
  return Math.max(0, -uo(Math.abs(A)));
}
function uO(A, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(uo(e) / 3))) * 3 - uo(Math.abs(A)));
}
function lO(A, e) {
  return A = Math.abs(A), e = Math.abs(e) - A, Math.max(0, uo(e) - uo(A)) + 1;
}
function cO(A, e) {
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
function fO(A) {
  return function() {
    return A;
  };
}
function hO(A) {
  return +A;
}
var Nw = [0, 1];
function ja(A) {
  return A;
}
function cd(A, e) {
  return (e -= A = +A) ? function(t) {
    return (t - A) / e;
  } : fO(isNaN(e) ? NaN : 0.5);
}
function dO(A, e) {
  var t;
  return A > e && (t = A, A = e, e = t), function(n) {
    return Math.max(A, Math.min(e, n));
  };
}
function pO(A, e, t) {
  var n = A[0], i = A[1], o = e[0], l = e[1];
  return i < n ? (n = cd(i, n), o = t(l, o)) : (n = cd(n, i), o = t(o, l)), function(f) {
    return o(n(f));
  };
}
function gO(A, e, t) {
  var n = Math.min(A.length, e.length) - 1, i = new Array(n), o = new Array(n), l = -1;
  for (A[n] < A[0] && (A = A.slice().reverse(), e = e.slice().reverse()); ++l < n; )
    i[l] = cd(A[l], A[l + 1]), o[l] = t(e[l], e[l + 1]);
  return function(f) {
    var c = mS(A, f, 1, n) - 1;
    return o[c](i[c](f));
  };
}
function BO(A, e) {
  return e.domain(A.domain()).range(A.range()).interpolate(A.interpolate()).clamp(A.clamp()).unknown(A.unknown());
}
function wO() {
  var A = Nw, e = Nw, t = Mp, n, i, o, l = ja, f, c, h;
  function m() {
    var g = Math.min(A.length, e.length);
    return l !== ja && (l = dO(A[0], A[g - 1])), f = g > 2 ? gO : pO, c = h = null, B;
  }
  function B(g) {
    return g == null || isNaN(g = +g) ? o : (c || (c = f(A.map(n), e, t)))(n(l(g)));
  }
  return B.invert = function(g) {
    return l(i((h || (h = f(e, A.map(n), Wn)))(g)));
  }, B.domain = function(g) {
    return arguments.length ? (A = Array.from(g, hO), m()) : A.slice();
  }, B.range = function(g) {
    return arguments.length ? (e = Array.from(g), m()) : e.slice();
  }, B.rangeRound = function(g) {
    return e = Array.from(g), t = TT, m();
  }, B.clamp = function(g) {
    return arguments.length ? (l = g ? !0 : ja, m()) : l !== ja;
  }, B.interpolate = function(g) {
    return arguments.length ? (t = g, m()) : t;
  }, B.unknown = function(g) {
    return arguments.length ? (o = g, B) : o;
  }, function(g, v) {
    return n = g, i = v, m();
  };
}
function mO() {
  return wO()(ja, ja);
}
function vO(A, e, t, n) {
  var i = FS(A, e, t), o;
  switch (n = Bc(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(A), Math.abs(e));
      return n.precision == null && !isNaN(o = uO(i, l)) && (n.precision = o), S0(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(o = lO(i, Math.max(Math.abs(A), Math.abs(e)))) && (n.precision = o - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(o = sO(i)) && (n.precision = o - (n.type === "%") * 2);
      break;
    }
  }
  return H0(n);
}
function yO(A) {
  var e = A.domain;
  return A.ticks = function(t) {
    var n = e();
    return QS(n[0], n[n.length - 1], t ?? 10);
  }, A.tickFormat = function(t, n) {
    var i = e();
    return vO(i[0], i[i.length - 1], t ?? 10, n);
  }, A.nice = function(t) {
    t == null && (t = 10);
    var n = e(), i = 0, o = n.length - 1, l = n[i], f = n[o], c, h, m = 10;
    for (f < l && (h = l, l = f, f = h, h = i, i = o, o = h); m-- > 0; ) {
      if (h = ed(l, f, t), h === c)
        return n[i] = l, n[o] = f, e(n);
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
function fa() {
  var A = mO();
  return A.copy = function() {
    return BO(A, fa());
  }, cO.apply(A, arguments), yO(A);
}
const dl = (A) => () => A;
function CO(A, {
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
function Rr(A, e, t) {
  this.k = A, this.x = e, this.y = t;
}
Rr.prototype = {
  constructor: Rr,
  scale: function(A) {
    return A === 1 ? this : new Rr(this.k * A, this.x, this.y);
  },
  translate: function(A, e) {
    return A === 0 & e === 0 ? this : new Rr(this.k, this.x + this.k * A, this.y + this.k * e);
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
var $p = new Rr(1, 0, 0);
Xa.prototype = Rr.prototype;
function Xa(A) {
  for (; !A.__zoom; ) if (!(A = A.parentNode)) return $p;
  return A.__zoom;
}
function mh(A) {
  A.stopImmediatePropagation();
}
function As(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function QO(A) {
  return (!A.ctrlKey || A.type === "wheel") && !A.button;
}
function FO() {
  var A = this;
  return A instanceof SVGElement ? (A = A.ownerSVGElement || A, A.hasAttribute("viewBox") ? (A = A.viewBox.baseVal, [[A.x, A.y], [A.x + A.width, A.y + A.height]]) : [[0, 0], [A.width.baseVal.value, A.height.baseVal.value]]) : [[0, 0], [A.clientWidth, A.clientHeight]];
}
function Mw() {
  return this.__zoom || $p;
}
function UO(A) {
  return -A.deltaY * (A.deltaMode === 1 ? 0.05 : A.deltaMode ? 1 : 2e-3) * (A.ctrlKey ? 10 : 1);
}
function EO() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function bO(A, e, t) {
  var n = A.invertX(e[0][0]) - t[0][0], i = A.invertX(e[1][0]) - t[1][0], o = A.invertY(e[0][1]) - t[0][1], l = A.invertY(e[1][1]) - t[1][1];
  return A.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    l > o ? (o + l) / 2 : Math.min(0, o) || Math.max(0, l)
  );
}
function _O() {
  var A = QO, e = FO, t = bO, n = UO, i = EO, o = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], f = 250, c = kT, h = Nc("start", "zoom", "end"), m, B, g, v = 500, u = 150, C = 0, F = 10;
  function U(X) {
    X.property("__zoom", Mw).on("wheel.zoom", fA, { passive: !1 }).on("mousedown.zoom", uA).on("dblclick.zoom", BA).filter(i).on("touchstart.zoom", FA).on("touchmove.zoom", NA).on("touchend.zoom touchcancel.zoom", xA).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  U.transform = function(X, CA, tA, hA) {
    var _A = X.selection ? X.selection() : X;
    _A.property("__zoom", Mw), X !== _A ? P(X, CA, tA, hA) : _A.interrupt().each(function() {
      R(this, arguments).event(hA).start().zoom(null, typeof CA == "function" ? CA.apply(this, arguments) : CA).end();
    });
  }, U.scaleBy = function(X, CA, tA, hA) {
    U.scaleTo(X, function() {
      var _A = this.__zoom.k, IA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
      return _A * IA;
    }, tA, hA);
  }, U.scaleTo = function(X, CA, tA, hA) {
    U.transform(X, function() {
      var _A = e.apply(this, arguments), IA = this.__zoom, aA = tA == null ? x(_A) : typeof tA == "function" ? tA.apply(this, arguments) : tA, D = IA.invert(aA), eA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
      return t(N(S(IA, eA), aA, D), _A, l);
    }, tA, hA);
  }, U.translateBy = function(X, CA, tA, hA) {
    U.transform(X, function() {
      return t(this.__zoom.translate(
        typeof CA == "function" ? CA.apply(this, arguments) : CA,
        typeof tA == "function" ? tA.apply(this, arguments) : tA
      ), e.apply(this, arguments), l);
    }, null, hA);
  }, U.translateTo = function(X, CA, tA, hA, _A) {
    U.transform(X, function() {
      var IA = e.apply(this, arguments), aA = this.__zoom, D = hA == null ? x(IA) : typeof hA == "function" ? hA.apply(this, arguments) : hA;
      return t($p.translate(D[0], D[1]).scale(aA.k).translate(
        typeof CA == "function" ? -CA.apply(this, arguments) : -CA,
        typeof tA == "function" ? -tA.apply(this, arguments) : -tA
      ), IA, l);
    }, hA, _A);
  };
  function S(X, CA) {
    return CA = Math.max(o[0], Math.min(o[1], CA)), CA === X.k ? X : new Rr(CA, X.x, X.y);
  }
  function N(X, CA, tA) {
    var hA = CA[0] - tA[0] * X.k, _A = CA[1] - tA[1] * X.k;
    return hA === X.x && _A === X.y ? X : new Rr(X.k, hA, _A);
  }
  function x(X) {
    return [(+X[0][0] + +X[1][0]) / 2, (+X[0][1] + +X[1][1]) / 2];
  }
  function P(X, CA, tA, hA) {
    X.on("start.zoom", function() {
      R(this, arguments).event(hA).start();
    }).on("interrupt.zoom end.zoom", function() {
      R(this, arguments).event(hA).end();
    }).tween("zoom", function() {
      var _A = this, IA = arguments, aA = R(_A, IA).event(hA), D = e.apply(_A, IA), eA = tA == null ? x(D) : typeof tA == "function" ? tA.apply(_A, IA) : tA, j = Math.max(D[1][0] - D[0][0], D[1][1] - D[0][1]), T = _A.__zoom, k = typeof CA == "function" ? CA.apply(_A, IA) : CA, rA = c(T.invert(eA).concat(j / T.k), k.invert(eA).concat(j / k.k));
      return function(UA) {
        if (UA === 1) UA = k;
        else {
          var EA = rA(UA), zA = j / EA[2];
          UA = new Rr(zA, eA[0] - EA[0] * zA, eA[1] - EA[1] * zA);
        }
        aA.zoom(null, UA);
      };
    });
  }
  function R(X, CA, tA) {
    return !tA && X.__zooming || new J(X, CA);
  }
  function J(X, CA) {
    this.that = X, this.args = CA, this.active = 0, this.sourceEvent = null, this.extent = e.apply(X, CA), this.taps = 0;
  }
  J.prototype = {
    event: function(X) {
      return X && (this.sourceEvent = X), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(X, CA) {
      return this.mouse && X !== "mouse" && (this.mouse[1] = CA.invert(this.mouse[0])), this.touch0 && X !== "touch" && (this.touch0[1] = CA.invert(this.touch0[0])), this.touch1 && X !== "touch" && (this.touch1[1] = CA.invert(this.touch1[0])), this.that.__zoom = CA, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(X) {
      var CA = WA(this.that).datum();
      h.call(
        X,
        this.that,
        new CO(X, {
          sourceEvent: this.sourceEvent,
          target: U,
          type: X,
          transform: this.that.__zoom,
          dispatch: h
        }),
        CA
      );
    }
  };
  function fA(X, ...CA) {
    if (!A.apply(this, arguments)) return;
    var tA = R(this, CA).event(X), hA = this.__zoom, _A = Math.max(o[0], Math.min(o[1], hA.k * Math.pow(2, n.apply(this, arguments)))), IA = Vn(X);
    if (tA.wheel)
      (tA.mouse[0][0] !== IA[0] || tA.mouse[0][1] !== IA[1]) && (tA.mouse[1] = hA.invert(tA.mouse[0] = IA)), clearTimeout(tA.wheel);
    else {
      if (hA.k === _A) return;
      tA.mouse = [IA, hA.invert(IA)], Jl(this), tA.start();
    }
    As(X), tA.wheel = setTimeout(aA, u), tA.zoom("mouse", t(N(S(hA, _A), tA.mouse[0], tA.mouse[1]), tA.extent, l));
    function aA() {
      tA.wheel = null, tA.end();
    }
  }
  function uA(X, ...CA) {
    if (g || !A.apply(this, arguments)) return;
    var tA = X.currentTarget, hA = R(this, CA, !0).event(X), _A = WA(X.view).on("mousemove.zoom", eA, !0).on("mouseup.zoom", j, !0), IA = Vn(X, tA), aA = X.clientX, D = X.clientY;
    p0(X.view), mh(X), hA.mouse = [IA, this.__zoom.invert(IA)], Jl(this), hA.start();
    function eA(T) {
      if (As(T), !hA.moved) {
        var k = T.clientX - aA, rA = T.clientY - D;
        hA.moved = k * k + rA * rA > C;
      }
      hA.event(T).zoom("mouse", t(N(hA.that.__zoom, hA.mouse[0] = Vn(T, tA), hA.mouse[1]), hA.extent, l));
    }
    function j(T) {
      _A.on("mousemove.zoom mouseup.zoom", null), g0(T.view, hA.moved), As(T), hA.event(T).end();
    }
  }
  function BA(X, ...CA) {
    if (A.apply(this, arguments)) {
      var tA = this.__zoom, hA = Vn(X.changedTouches ? X.changedTouches[0] : X, this), _A = tA.invert(hA), IA = tA.k * (X.shiftKey ? 0.5 : 2), aA = t(N(S(tA, IA), hA, _A), e.apply(this, CA), l);
      As(X), f > 0 ? WA(this).transition().duration(f).call(P, aA, hA, X) : WA(this).call(U.transform, aA, hA, X);
    }
  }
  function FA(X, ...CA) {
    if (A.apply(this, arguments)) {
      var tA = X.touches, hA = tA.length, _A = R(this, CA, X.changedTouches.length === hA).event(X), IA, aA, D, eA;
      for (mh(X), aA = 0; aA < hA; ++aA)
        D = tA[aA], eA = Vn(D, this), eA = [eA, this.__zoom.invert(eA), D.identifier], _A.touch0 ? !_A.touch1 && _A.touch0[2] !== eA[2] && (_A.touch1 = eA, _A.taps = 0) : (_A.touch0 = eA, IA = !0, _A.taps = 1 + !!m);
      m && (m = clearTimeout(m)), IA && (_A.taps < 2 && (B = eA[0], m = setTimeout(function() {
        m = null;
      }, v)), Jl(this), _A.start());
    }
  }
  function NA(X, ...CA) {
    if (this.__zooming) {
      var tA = R(this, CA).event(X), hA = X.changedTouches, _A = hA.length, IA, aA, D, eA;
      for (As(X), IA = 0; IA < _A; ++IA)
        aA = hA[IA], D = Vn(aA, this), tA.touch0 && tA.touch0[2] === aA.identifier ? tA.touch0[0] = D : tA.touch1 && tA.touch1[2] === aA.identifier && (tA.touch1[0] = D);
      if (aA = tA.that.__zoom, tA.touch1) {
        var j = tA.touch0[0], T = tA.touch0[1], k = tA.touch1[0], rA = tA.touch1[1], UA = (UA = k[0] - j[0]) * UA + (UA = k[1] - j[1]) * UA, EA = (EA = rA[0] - T[0]) * EA + (EA = rA[1] - T[1]) * EA;
        aA = S(aA, Math.sqrt(UA / EA)), D = [(j[0] + k[0]) / 2, (j[1] + k[1]) / 2], eA = [(T[0] + rA[0]) / 2, (T[1] + rA[1]) / 2];
      } else if (tA.touch0) D = tA.touch0[0], eA = tA.touch0[1];
      else return;
      tA.zoom("touch", t(N(aA, D, eA), tA.extent, l));
    }
  }
  function xA(X, ...CA) {
    if (this.__zooming) {
      var tA = R(this, CA).event(X), hA = X.changedTouches, _A = hA.length, IA, aA;
      for (mh(X), g && clearTimeout(g), g = setTimeout(function() {
        g = null;
      }, v), IA = 0; IA < _A; ++IA)
        aA = hA[IA], tA.touch0 && tA.touch0[2] === aA.identifier ? delete tA.touch0 : tA.touch1 && tA.touch1[2] === aA.identifier && delete tA.touch1;
      if (tA.touch1 && !tA.touch0 && (tA.touch0 = tA.touch1, delete tA.touch1), tA.touch0) tA.touch0[1] = this.__zoom.invert(tA.touch0[0]);
      else if (tA.end(), tA.taps === 2 && (aA = Vn(aA, this), Math.hypot(B[0] - aA[0], B[1] - aA[1]) < F)) {
        var D = WA(this).on("dblclick.zoom");
        D && D.apply(this, arguments);
      }
    }
  }
  return U.wheelDelta = function(X) {
    return arguments.length ? (n = typeof X == "function" ? X : dl(+X), U) : n;
  }, U.filter = function(X) {
    return arguments.length ? (A = typeof X == "function" ? X : dl(!!X), U) : A;
  }, U.touchable = function(X) {
    return arguments.length ? (i = typeof X == "function" ? X : dl(!!X), U) : i;
  }, U.extent = function(X) {
    return arguments.length ? (e = typeof X == "function" ? X : dl([[+X[0][0], +X[0][1]], [+X[1][0], +X[1][1]]]), U) : e;
  }, U.scaleExtent = function(X) {
    return arguments.length ? (o[0] = +X[0], o[1] = +X[1], U) : [o[0], o[1]];
  }, U.translateExtent = function(X) {
    return arguments.length ? (l[0][0] = +X[0][0], l[1][0] = +X[1][0], l[0][1] = +X[0][1], l[1][1] = +X[1][1], U) : [[l[0][0], l[0][1]], [l[1][0], l[1][1]]];
  }, U.constrain = function(X) {
    return arguments.length ? (t = X, U) : t;
  }, U.duration = function(X) {
    return arguments.length ? (f = +X, U) : f;
  }, U.interpolate = function(X) {
    return arguments.length ? (c = X, U) : c;
  }, U.on = function() {
    var X = h.on.apply(h, arguments);
    return X === h ? U : X;
  }, U.clickDistance = function(X) {
    return arguments.length ? (C = (X = +X) * X, U) : Math.sqrt(C);
  }, U.tapDistance = function(X) {
    return arguments.length ? (F = +X, U) : F;
  }, U;
}
var L0 = { exports: {} };
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
  })(typeof window < "u" ? window : Ji, function(e, t) {
    var n = [], i = e.document, o = n.slice, l = n.concat, f = n.push, c = n.indexOf, h = {}, m = h.toString, B = h.hasOwnProperty, g = {}, v = "1.12.4", u = function(s, d) {
      return new u.fn.init(s, d);
    }, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, F = /^-ms-/, U = /-([\da-z])/gi, S = function(s, d) {
      return d.toUpperCase();
    };
    u.fn = u.prototype = {
      // The current version of jQuery being used
      jquery: v,
      constructor: u,
      // Start with an empty selector
      selector: "",
      // The default length of a jQuery object is 0
      length: 0,
      toArray: function() {
        return o.call(this);
      },
      // Get the Nth element in the matched element set OR
      // Get the whole matched element set as a clean array
      get: function(s) {
        return s != null ? (
          // Return just the one element from the set
          s < 0 ? this[s + this.length] : this[s]
        ) : (
          // Return all the elements in a clean array
          o.call(this)
        );
      },
      // Take an array of elements and push it onto the stack
      // (returning the new matched element set)
      pushStack: function(s) {
        var d = u.merge(this.constructor(), s);
        return d.prevObject = this, d.context = this.context, d;
      },
      // Execute a callback for every element in the matched set.
      each: function(s) {
        return u.each(this, s);
      },
      map: function(s) {
        return this.pushStack(u.map(this, function(d, w) {
          return s.call(d, w, d);
        }));
      },
      slice: function() {
        return this.pushStack(o.apply(this, arguments));
      },
      first: function() {
        return this.eq(0);
      },
      last: function() {
        return this.eq(-1);
      },
      eq: function(s) {
        var d = this.length, w = +s + (s < 0 ? d : 0);
        return this.pushStack(w >= 0 && w < d ? [this[w]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      // For internal use only.
      // Behaves like an Array's method, not like a jQuery method.
      push: f,
      sort: n.sort,
      splice: n.splice
    }, u.extend = u.fn.extend = function() {
      var s, d, w, y, E, b, H = arguments[0] || {}, K = 1, W = arguments.length, q = !1;
      for (typeof H == "boolean" && (q = H, H = arguments[K] || {}, K++), typeof H != "object" && !u.isFunction(H) && (H = {}), K === W && (H = this, K--); K < W; K++)
        if ((E = arguments[K]) != null)
          for (y in E)
            s = H[y], w = E[y], H !== w && (q && w && (u.isPlainObject(w) || (d = u.isArray(w))) ? (d ? (d = !1, b = s && u.isArray(s) ? s : []) : b = s && u.isPlainObject(s) ? s : {}, H[y] = u.extend(q, b, w)) : w !== void 0 && (H[y] = w));
      return H;
    }, u.extend({
      // Unique for each copy of jQuery on the page
      expando: "jQuery" + (v + Math.random()).replace(/\D/g, ""),
      // Assume jQuery is ready without the ready module
      isReady: !0,
      error: function(s) {
        throw new Error(s);
      },
      noop: function() {
      },
      // See test/unit/core.js for details concerning isFunction.
      // Since version 1.3, DOM methods and functions like alert
      // aren't supported. They return false on IE (#2968).
      isFunction: function(s) {
        return u.type(s) === "function";
      },
      isArray: Array.isArray || function(s) {
        return u.type(s) === "array";
      },
      isWindow: function(s) {
        return s != null && s == s.window;
      },
      isNumeric: function(s) {
        var d = s && s.toString();
        return !u.isArray(s) && d - parseFloat(d) + 1 >= 0;
      },
      isEmptyObject: function(s) {
        var d;
        for (d in s)
          return !1;
        return !0;
      },
      isPlainObject: function(s) {
        var d;
        if (!s || u.type(s) !== "object" || s.nodeType || u.isWindow(s))
          return !1;
        try {
          if (s.constructor && !B.call(s, "constructor") && !B.call(s.constructor.prototype, "isPrototypeOf"))
            return !1;
        } catch {
          return !1;
        }
        if (!g.ownFirst)
          for (d in s)
            return B.call(s, d);
        for (d in s)
          ;
        return d === void 0 || B.call(s, d);
      },
      type: function(s) {
        return s == null ? s + "" : typeof s == "object" || typeof s == "function" ? h[m.call(s)] || "object" : typeof s;
      },
      // Workarounds based on findings by Jim Driscoll
      // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
      globalEval: function(s) {
        s && u.trim(s) && (e.execScript || function(d) {
          e.eval.call(e, d);
        })(s);
      },
      // Convert dashed to camelCase; used by the css and data modules
      // Microsoft forgot to hump their vendor prefix (#9572)
      camelCase: function(s) {
        return s.replace(F, "ms-").replace(U, S);
      },
      nodeName: function(s, d) {
        return s.nodeName && s.nodeName.toLowerCase() === d.toLowerCase();
      },
      each: function(s, d) {
        var w, y = 0;
        if (N(s))
          for (w = s.length; y < w && d.call(s[y], y, s[y]) !== !1; y++)
            ;
        else
          for (y in s)
            if (d.call(s[y], y, s[y]) === !1)
              break;
        return s;
      },
      // Support: Android<4.1, IE<9
      trim: function(s) {
        return s == null ? "" : (s + "").replace(C, "");
      },
      // results is for internal usage only
      makeArray: function(s, d) {
        var w = d || [];
        return s != null && (N(Object(s)) ? u.merge(
          w,
          typeof s == "string" ? [s] : s
        ) : f.call(w, s)), w;
      },
      inArray: function(s, d, w) {
        var y;
        if (d) {
          if (c)
            return c.call(d, s, w);
          for (y = d.length, w = w ? w < 0 ? Math.max(0, y + w) : w : 0; w < y; w++)
            if (w in d && d[w] === s)
              return w;
        }
        return -1;
      },
      merge: function(s, d) {
        for (var w = +d.length, y = 0, E = s.length; y < w; )
          s[E++] = d[y++];
        if (w !== w)
          for (; d[y] !== void 0; )
            s[E++] = d[y++];
        return s.length = E, s;
      },
      grep: function(s, d, w) {
        for (var y, E = [], b = 0, H = s.length, K = !w; b < H; b++)
          y = !d(s[b], b), y !== K && E.push(s[b]);
        return E;
      },
      // arg is for internal usage only
      map: function(s, d, w) {
        var y, E, b = 0, H = [];
        if (N(s))
          for (y = s.length; b < y; b++)
            E = d(s[b], b, w), E != null && H.push(E);
        else
          for (b in s)
            E = d(s[b], b, w), E != null && H.push(E);
        return l.apply([], H);
      },
      // A global GUID counter for objects
      guid: 1,
      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function(s, d) {
        var w, y, E;
        if (typeof d == "string" && (E = s[d], d = s, s = E), !!u.isFunction(s))
          return w = o.call(arguments, 2), y = function() {
            return s.apply(d || this, w.concat(o.call(arguments)));
          }, y.guid = s.guid = s.guid || u.guid++, y;
      },
      now: function() {
        return +/* @__PURE__ */ new Date();
      },
      // jQuery.support is not used in Core but other projects attach their
      // properties to it so it needs to exist.
      support: g
    }), typeof Symbol == "function" && (u.fn[Symbol.iterator] = n[Symbol.iterator]), u.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
      function(s, d) {
        h["[object " + d + "]"] = d.toLowerCase();
      }
    );
    function N(s) {
      var d = !!s && "length" in s && s.length, w = u.type(s);
      return w === "function" || u.isWindow(s) ? !1 : w === "array" || d === 0 || typeof d == "number" && d > 0 && d - 1 in s;
    }
    var x = (
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
      function(s) {
        var d, w, y, E, b, H, K, W, q, AA, mA, SA, yA, ie, YA, ue, pt, Je, Ar, KA = "sizzle" + 1 * /* @__PURE__ */ new Date(), ct = s.document, le = 0, qe = 0, Ln = Y(), Ua = Y(), Ht = Y(), Tn = function(M, G) {
          return M === G && (mA = !0), 0;
        }, er = 1 << 31, Dn = {}.hasOwnProperty, Re = [], St = Re.pop, Ni = Re.push, On = Re.push, Lo = Re.slice, Ur = function(M, G) {
          for (var z = 0, lA = M.length; z < lA; z++)
            if (M[z] === G)
              return z;
          return -1;
        }, To = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", De = "[\\x20\\t\\r\\n\\f]", Er = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", Eu = "\\[" + De + "*(" + Er + ")(?:" + De + // Operator (capture 2)
        "*([*^$|!~]?=)" + De + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Er + "))|)" + De + "*\\]", tr = ":(" + Er + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Eu + ")*)|.*)\\)|)", df = new RegExp(De + "+", "g"), Ea = new RegExp("^" + De + "+|((?:^|[^\\\\])(?:\\\\.)*)" + De + "+$", "g"), Do = new RegExp("^" + De + "*," + De + "*"), bu = new RegExp("^" + De + "*([>+~]|" + De + ")" + De + "*"), nr = new RegExp("=" + De + `*([^\\]'"]*?)` + De + "*\\]", "g"), ba = new RegExp(tr), _u = new RegExp("^" + Er + "$"), _a = {
          ID: new RegExp("^#(" + Er + ")"),
          CLASS: new RegExp("^\\.(" + Er + ")"),
          TAG: new RegExp("^(" + Er + "|[*])"),
          ATTR: new RegExp("^" + Eu),
          PSEUDO: new RegExp("^" + tr),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + De + "*(even|odd|(([+-]|)(\\d*)n|)" + De + "*(?:([+-]|)" + De + "*(\\d+)|))" + De + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + To + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + De + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + De + "*((?:-\\d)?\\d*)" + De + "*\\)|)(?=[^-]|$)", "i")
        }, pf = /^(?:input|select|textarea|button)$/i, ii = /^h\d$/i, vt = /^[^{]+\{\s*\[native \w/, xu = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Oo = /[+~]/, gf = /'|\\/g, Nn = new RegExp("\\\\([\\da-f]{1,6}" + De + "?|(" + De + ")|.)", "ig"), Mn = function(M, G, z) {
          var lA = "0x" + G - 65536;
          return lA !== lA || z ? G : lA < 0 ? (
            // BMP codepoint
            String.fromCharCode(lA + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(lA >> 10 | 55296, lA & 1023 | 56320)
          );
        }, Iu = function() {
          SA();
        };
        try {
          On.apply(
            Re = Lo.call(ct.childNodes),
            ct.childNodes
          ), Re[ct.childNodes.length].nodeType;
        } catch {
          On = {
            apply: Re.length ? (
              // Leverage slice if possible
              function(G, z) {
                Ni.apply(G, Lo.call(z));
              }
            ) : (
              // Support: IE<9
              // Otherwise append directly
              function(G, z) {
                for (var lA = G.length, nA = 0; G[lA++] = z[nA++]; )
                  ;
                G.length = lA - 1;
              }
            )
          };
        }
        function xe(M, G, z, lA) {
          var nA, wA, dA, HA, GA, re, VA, ZA, fe = G && G.ownerDocument, Se = G ? G.nodeType : 9;
          if (z = z || [], typeof M != "string" || !M || Se !== 1 && Se !== 9 && Se !== 11)
            return z;
          if (!lA && ((G ? G.ownerDocument || G : ct) !== yA && SA(G), G = G || yA, YA)) {
            if (Se !== 11 && (re = xu.exec(M)))
              if (nA = re[1]) {
                if (Se === 9)
                  if (dA = G.getElementById(nA)) {
                    if (dA.id === nA)
                      return z.push(dA), z;
                  } else
                    return z;
                else if (fe && (dA = fe.getElementById(nA)) && Ar(G, dA) && dA.id === nA)
                  return z.push(dA), z;
              } else {
                if (re[2])
                  return On.apply(z, G.getElementsByTagName(M)), z;
                if ((nA = re[3]) && w.getElementsByClassName && G.getElementsByClassName)
                  return On.apply(z, G.getElementsByClassName(nA)), z;
              }
            if (w.qsa && !Ht[M + " "] && (!ue || !ue.test(M))) {
              if (Se !== 1)
                fe = G, ZA = M;
              else if (G.nodeName.toLowerCase() !== "object") {
                for ((HA = G.getAttribute("id")) ? HA = HA.replace(gf, "\\$&") : G.setAttribute("id", HA = KA), VA = H(M), wA = VA.length, GA = _u.test(HA) ? "#" + HA : "[id='" + HA + "']"; wA--; )
                  VA[wA] = GA + " " + yt(VA[wA]);
                ZA = VA.join(","), fe = Oo.test(M) && Mi(G.parentNode) || G;
              }
              if (ZA)
                try {
                  return On.apply(
                    z,
                    fe.querySelectorAll(ZA)
                  ), z;
                } catch {
                } finally {
                  HA === KA && G.removeAttribute("id");
                }
            }
          }
          return W(M.replace(Ea, "$1"), G, z, lA);
        }
        function Y() {
          var M = [];
          function G(z, lA) {
            return M.push(z + " ") > y.cacheLength && delete G[M.shift()], G[z + " "] = lA;
          }
          return G;
        }
        function oA(M) {
          return M[KA] = !0, M;
        }
        function iA(M) {
          var G = yA.createElement("div");
          try {
            return !!M(G);
          } catch {
            return !1;
          } finally {
            G.parentNode && G.parentNode.removeChild(G), G = null;
          }
        }
        function OA(M, G) {
          for (var z = M.split("|"), lA = z.length; lA--; )
            y.attrHandle[z[lA]] = G;
        }
        function ae(M, G) {
          var z = G && M, lA = z && M.nodeType === 1 && G.nodeType === 1 && (~G.sourceIndex || er) - (~M.sourceIndex || er);
          if (lA)
            return lA;
          if (z) {
            for (; z = z.nextSibling; )
              if (z === G)
                return -1;
          }
          return M ? 1 : -1;
        }
        function Ie(M) {
          return function(G) {
            var z = G.nodeName.toLowerCase();
            return z === "input" && G.type === M;
          };
        }
        function tt(M) {
          return function(G) {
            var z = G.nodeName.toLowerCase();
            return (z === "input" || z === "button") && G.type === M;
          };
        }
        function Ee(M) {
          return oA(function(G) {
            return G = +G, oA(function(z, lA) {
              for (var nA, wA = M([], z.length, G), dA = wA.length; dA--; )
                z[nA = wA[dA]] && (z[nA] = !(lA[nA] = z[nA]));
            });
          });
        }
        function Mi(M) {
          return M && typeof M.getElementsByTagName < "u" && M;
        }
        w = xe.support = {}, b = xe.isXML = function(M) {
          var G = M && (M.ownerDocument || M).documentElement;
          return G ? G.nodeName !== "HTML" : !1;
        }, SA = xe.setDocument = function(M) {
          var G, z, lA = M ? M.ownerDocument || M : ct;
          return lA === yA || lA.nodeType !== 9 || !lA.documentElement || (yA = lA, ie = yA.documentElement, YA = !b(yA), (z = yA.defaultView) && z.top !== z && (z.addEventListener ? z.addEventListener("unload", Iu, !1) : z.attachEvent && z.attachEvent("onunload", Iu)), w.attributes = iA(function(nA) {
            return nA.className = "i", !nA.getAttribute("className");
          }), w.getElementsByTagName = iA(function(nA) {
            return nA.appendChild(yA.createComment("")), !nA.getElementsByTagName("*").length;
          }), w.getElementsByClassName = vt.test(yA.getElementsByClassName), w.getById = iA(function(nA) {
            return ie.appendChild(nA).id = KA, !yA.getElementsByName || !yA.getElementsByName(KA).length;
          }), w.getById ? (y.find.ID = function(nA, wA) {
            if (typeof wA.getElementById < "u" && YA) {
              var dA = wA.getElementById(nA);
              return dA ? [dA] : [];
            }
          }, y.filter.ID = function(nA) {
            var wA = nA.replace(Nn, Mn);
            return function(dA) {
              return dA.getAttribute("id") === wA;
            };
          }) : (delete y.find.ID, y.filter.ID = function(nA) {
            var wA = nA.replace(Nn, Mn);
            return function(dA) {
              var HA = typeof dA.getAttributeNode < "u" && dA.getAttributeNode("id");
              return HA && HA.value === wA;
            };
          }), y.find.TAG = w.getElementsByTagName ? function(nA, wA) {
            if (typeof wA.getElementsByTagName < "u")
              return wA.getElementsByTagName(nA);
            if (w.qsa)
              return wA.querySelectorAll(nA);
          } : function(nA, wA) {
            var dA, HA = [], GA = 0, re = wA.getElementsByTagName(nA);
            if (nA === "*") {
              for (; dA = re[GA++]; )
                dA.nodeType === 1 && HA.push(dA);
              return HA;
            }
            return re;
          }, y.find.CLASS = w.getElementsByClassName && function(nA, wA) {
            if (typeof wA.getElementsByClassName < "u" && YA)
              return wA.getElementsByClassName(nA);
          }, pt = [], ue = [], (w.qsa = vt.test(yA.querySelectorAll)) && (iA(function(nA) {
            ie.appendChild(nA).innerHTML = "<a id='" + KA + "'></a><select id='" + KA + "-\r\\' msallowcapture=''><option selected=''></option></select>", nA.querySelectorAll("[msallowcapture^='']").length && ue.push("[*^$]=" + De + `*(?:''|"")`), nA.querySelectorAll("[selected]").length || ue.push("\\[" + De + "*(?:value|" + To + ")"), nA.querySelectorAll("[id~=" + KA + "-]").length || ue.push("~="), nA.querySelectorAll(":checked").length || ue.push(":checked"), nA.querySelectorAll("a#" + KA + "+*").length || ue.push(".#.+[+~]");
          }), iA(function(nA) {
            var wA = yA.createElement("input");
            wA.setAttribute("type", "hidden"), nA.appendChild(wA).setAttribute("name", "D"), nA.querySelectorAll("[name=d]").length && ue.push("name" + De + "*[*^$|!~]?="), nA.querySelectorAll(":enabled").length || ue.push(":enabled", ":disabled"), nA.querySelectorAll("*,:x"), ue.push(",.*:");
          })), (w.matchesSelector = vt.test(Je = ie.matches || ie.webkitMatchesSelector || ie.mozMatchesSelector || ie.oMatchesSelector || ie.msMatchesSelector)) && iA(function(nA) {
            w.disconnectedMatch = Je.call(nA, "div"), Je.call(nA, "[s!='']:x"), pt.push("!=", tr);
          }), ue = ue.length && new RegExp(ue.join("|")), pt = pt.length && new RegExp(pt.join("|")), G = vt.test(ie.compareDocumentPosition), Ar = G || vt.test(ie.contains) ? function(nA, wA) {
            var dA = nA.nodeType === 9 ? nA.documentElement : nA, HA = wA && wA.parentNode;
            return nA === HA || !!(HA && HA.nodeType === 1 && (dA.contains ? dA.contains(HA) : nA.compareDocumentPosition && nA.compareDocumentPosition(HA) & 16));
          } : function(nA, wA) {
            if (wA) {
              for (; wA = wA.parentNode; )
                if (wA === nA)
                  return !0;
            }
            return !1;
          }, Tn = G ? function(nA, wA) {
            if (nA === wA)
              return mA = !0, 0;
            var dA = !nA.compareDocumentPosition - !wA.compareDocumentPosition;
            return dA || (dA = (nA.ownerDocument || nA) === (wA.ownerDocument || wA) ? nA.compareDocumentPosition(wA) : (
              // Otherwise we know they are disconnected
              1
            ), dA & 1 || !w.sortDetached && wA.compareDocumentPosition(nA) === dA ? nA === yA || nA.ownerDocument === ct && Ar(ct, nA) ? -1 : wA === yA || wA.ownerDocument === ct && Ar(ct, wA) ? 1 : AA ? Ur(AA, nA) - Ur(AA, wA) : 0 : dA & 4 ? -1 : 1);
          } : function(nA, wA) {
            if (nA === wA)
              return mA = !0, 0;
            var dA, HA = 0, GA = nA.parentNode, re = wA.parentNode, VA = [nA], ZA = [wA];
            if (!GA || !re)
              return nA === yA ? -1 : wA === yA ? 1 : GA ? -1 : re ? 1 : AA ? Ur(AA, nA) - Ur(AA, wA) : 0;
            if (GA === re)
              return ae(nA, wA);
            for (dA = nA; dA = dA.parentNode; )
              VA.unshift(dA);
            for (dA = wA; dA = dA.parentNode; )
              ZA.unshift(dA);
            for (; VA[HA] === ZA[HA]; )
              HA++;
            return HA ? (
              // Do a sibling check if the nodes have a common ancestor
              ae(VA[HA], ZA[HA])
            ) : (
              // Otherwise nodes in our document sort first
              VA[HA] === ct ? -1 : ZA[HA] === ct ? 1 : 0
            );
          }), yA;
        }, xe.matches = function(M, G) {
          return xe(M, null, null, G);
        }, xe.matchesSelector = function(M, G) {
          if ((M.ownerDocument || M) !== yA && SA(M), G = G.replace(nr, "='$1']"), w.matchesSelector && YA && !Ht[G + " "] && (!pt || !pt.test(G)) && (!ue || !ue.test(G)))
            try {
              var z = Je.call(M, G);
              if (z || w.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              M.document && M.document.nodeType !== 11)
                return z;
            } catch {
            }
          return xe(G, yA, null, [M]).length > 0;
        }, xe.contains = function(M, G) {
          return (M.ownerDocument || M) !== yA && SA(M), Ar(M, G);
        }, xe.attr = function(M, G) {
          (M.ownerDocument || M) !== yA && SA(M);
          var z = y.attrHandle[G.toLowerCase()], lA = z && Dn.call(y.attrHandle, G.toLowerCase()) ? z(M, G, !YA) : void 0;
          return lA !== void 0 ? lA : w.attributes || !YA ? M.getAttribute(G) : (lA = M.getAttributeNode(G)) && lA.specified ? lA.value : null;
        }, xe.error = function(M) {
          throw new Error("Syntax error, unrecognized expression: " + M);
        }, xe.uniqueSort = function(M) {
          var G, z = [], lA = 0, nA = 0;
          if (mA = !w.detectDuplicates, AA = !w.sortStable && M.slice(0), M.sort(Tn), mA) {
            for (; G = M[nA++]; )
              G === M[nA] && (lA = z.push(nA));
            for (; lA--; )
              M.splice(z[lA], 1);
          }
          return AA = null, M;
        }, E = xe.getText = function(M) {
          var G, z = "", lA = 0, nA = M.nodeType;
          if (nA) {
            if (nA === 1 || nA === 9 || nA === 11) {
              if (typeof M.textContent == "string")
                return M.textContent;
              for (M = M.firstChild; M; M = M.nextSibling)
                z += E(M);
            } else if (nA === 3 || nA === 4)
              return M.nodeValue;
          } else for (; G = M[lA++]; )
            z += E(G);
          return z;
        }, y = xe.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: oA,
          match: _a,
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
              return M[1] = M[1].replace(Nn, Mn), M[3] = (M[3] || M[4] || M[5] || "").replace(Nn, Mn), M[2] === "~=" && (M[3] = " " + M[3] + " "), M.slice(0, 4);
            },
            CHILD: function(M) {
              return M[1] = M[1].toLowerCase(), M[1].slice(0, 3) === "nth" ? (M[3] || xe.error(M[0]), M[4] = +(M[4] ? M[5] + (M[6] || 1) : 2 * (M[3] === "even" || M[3] === "odd")), M[5] = +(M[7] + M[8] || M[3] === "odd")) : M[3] && xe.error(M[0]), M;
            },
            PSEUDO: function(M) {
              var G, z = !M[6] && M[2];
              return _a.CHILD.test(M[0]) ? null : (M[3] ? M[2] = M[4] || M[5] || "" : z && ba.test(z) && // Get excess from tokenize (recursively)
              (G = H(z, !0)) && // advance to the next closing parenthesis
              (G = z.indexOf(")", z.length - G) - z.length) && (M[0] = M[0].slice(0, G), M[2] = z.slice(0, G)), M.slice(0, 3));
            }
          },
          filter: {
            TAG: function(M) {
              var G = M.replace(Nn, Mn).toLowerCase();
              return M === "*" ? function() {
                return !0;
              } : function(z) {
                return z.nodeName && z.nodeName.toLowerCase() === G;
              };
            },
            CLASS: function(M) {
              var G = Ln[M + " "];
              return G || (G = new RegExp("(^|" + De + ")" + M + "(" + De + "|$)")) && Ln(M, function(z) {
                return G.test(typeof z.className == "string" && z.className || typeof z.getAttribute < "u" && z.getAttribute("class") || "");
              });
            },
            ATTR: function(M, G, z) {
              return function(lA) {
                var nA = xe.attr(lA, M);
                return nA == null ? G === "!=" : G ? (nA += "", G === "=" ? nA === z : G === "!=" ? nA !== z : G === "^=" ? z && nA.indexOf(z) === 0 : G === "*=" ? z && nA.indexOf(z) > -1 : G === "$=" ? z && nA.slice(-z.length) === z : G === "~=" ? (" " + nA.replace(df, " ") + " ").indexOf(z) > -1 : G === "|=" ? nA === z || nA.slice(0, z.length + 1) === z + "-" : !1) : !0;
              };
            },
            CHILD: function(M, G, z, lA, nA) {
              var wA = M.slice(0, 3) !== "nth", dA = M.slice(-4) !== "last", HA = G === "of-type";
              return lA === 1 && nA === 0 ? (
                // Shortcut for :nth-*(n)
                function(GA) {
                  return !!GA.parentNode;
                }
              ) : function(GA, re, VA) {
                var ZA, fe, Se, qA, Ge, nt, Rt = wA !== dA ? "nextSibling" : "previousSibling", We = GA.parentNode, Pi = HA && GA.nodeName.toLowerCase(), rr = !VA && !HA, gt = !1;
                if (We) {
                  if (wA) {
                    for (; Rt; ) {
                      for (qA = GA; qA = qA[Rt]; )
                        if (HA ? qA.nodeName.toLowerCase() === Pi : qA.nodeType === 1)
                          return !1;
                      nt = Rt = M === "only" && !nt && "nextSibling";
                    }
                    return !0;
                  }
                  if (nt = [dA ? We.firstChild : We.lastChild], dA && rr) {
                    for (qA = We, Se = qA[KA] || (qA[KA] = {}), fe = Se[qA.uniqueID] || (Se[qA.uniqueID] = {}), ZA = fe[M] || [], Ge = ZA[0] === le && ZA[1], gt = Ge && ZA[2], qA = Ge && We.childNodes[Ge]; qA = ++Ge && qA && qA[Rt] || // Fallback to seeking `elem` from the start
                    (gt = Ge = 0) || nt.pop(); )
                      if (qA.nodeType === 1 && ++gt && qA === GA) {
                        fe[M] = [le, Ge, gt];
                        break;
                      }
                  } else if (rr && (qA = GA, Se = qA[KA] || (qA[KA] = {}), fe = Se[qA.uniqueID] || (Se[qA.uniqueID] = {}), ZA = fe[M] || [], Ge = ZA[0] === le && ZA[1], gt = Ge), gt === !1)
                    for (; (qA = ++Ge && qA && qA[Rt] || (gt = Ge = 0) || nt.pop()) && !((HA ? qA.nodeName.toLowerCase() === Pi : qA.nodeType === 1) && ++gt && (rr && (Se = qA[KA] || (qA[KA] = {}), fe = Se[qA.uniqueID] || (Se[qA.uniqueID] = {}), fe[M] = [le, gt]), qA === GA)); )
                      ;
                  return gt -= nA, gt === lA || gt % lA === 0 && gt / lA >= 0;
                }
              };
            },
            PSEUDO: function(M, G) {
              var z, lA = y.pseudos[M] || y.setFilters[M.toLowerCase()] || xe.error("unsupported pseudo: " + M);
              return lA[KA] ? lA(G) : lA.length > 1 ? (z = [M, M, "", G], y.setFilters.hasOwnProperty(M.toLowerCase()) ? oA(function(nA, wA) {
                for (var dA, HA = lA(nA, G), GA = HA.length; GA--; )
                  dA = Ur(nA, HA[GA]), nA[dA] = !(wA[dA] = HA[GA]);
              }) : function(nA) {
                return lA(nA, 0, z);
              }) : lA;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: oA(function(M) {
              var G = [], z = [], lA = K(M.replace(Ea, "$1"));
              return lA[KA] ? oA(function(nA, wA, dA, HA) {
                for (var GA, re = lA(nA, null, HA, []), VA = nA.length; VA--; )
                  (GA = re[VA]) && (nA[VA] = !(wA[VA] = GA));
              }) : function(nA, wA, dA) {
                return G[0] = nA, lA(G, null, dA, z), G[0] = null, !z.pop();
              };
            }),
            has: oA(function(M) {
              return function(G) {
                return xe(M, G).length > 0;
              };
            }),
            contains: oA(function(M) {
              return M = M.replace(Nn, Mn), function(G) {
                return (G.textContent || G.innerText || E(G)).indexOf(M) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            lang: oA(function(M) {
              return _u.test(M || "") || xe.error("unsupported lang: " + M), M = M.replace(Nn, Mn).toLowerCase(), function(G) {
                var z;
                do
                  if (z = YA ? G.lang : G.getAttribute("xml:lang") || G.getAttribute("lang"))
                    return z = z.toLowerCase(), z === M || z.indexOf(M + "-") === 0;
                while ((G = G.parentNode) && G.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(M) {
              var G = s.location && s.location.hash;
              return G && G.slice(1) === M.id;
            },
            root: function(M) {
              return M === ie;
            },
            focus: function(M) {
              return M === yA.activeElement && (!yA.hasFocus || yA.hasFocus()) && !!(M.type || M.href || ~M.tabIndex);
            },
            // Boolean properties
            enabled: function(M) {
              return M.disabled === !1;
            },
            disabled: function(M) {
              return M.disabled === !0;
            },
            checked: function(M) {
              var G = M.nodeName.toLowerCase();
              return G === "input" && !!M.checked || G === "option" && !!M.selected;
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
              return ii.test(M.nodeName);
            },
            input: function(M) {
              return pf.test(M.nodeName);
            },
            button: function(M) {
              var G = M.nodeName.toLowerCase();
              return G === "input" && M.type === "button" || G === "button";
            },
            text: function(M) {
              var G;
              return M.nodeName.toLowerCase() === "input" && M.type === "text" && // Support: IE<8
              // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
              ((G = M.getAttribute("type")) == null || G.toLowerCase() === "text");
            },
            // Position-in-collection
            first: Ee(function() {
              return [0];
            }),
            last: Ee(function(M, G) {
              return [G - 1];
            }),
            eq: Ee(function(M, G, z) {
              return [z < 0 ? z + G : z];
            }),
            even: Ee(function(M, G) {
              for (var z = 0; z < G; z += 2)
                M.push(z);
              return M;
            }),
            odd: Ee(function(M, G) {
              for (var z = 1; z < G; z += 2)
                M.push(z);
              return M;
            }),
            lt: Ee(function(M, G, z) {
              for (var lA = z < 0 ? z + G : z; --lA >= 0; )
                M.push(lA);
              return M;
            }),
            gt: Ee(function(M, G, z) {
              for (var lA = z < 0 ? z + G : z; ++lA < G; )
                M.push(lA);
              return M;
            })
          }
        }, y.pseudos.nth = y.pseudos.eq;
        for (d in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          y.pseudos[d] = Ie(d);
        for (d in { submit: !0, reset: !0 })
          y.pseudos[d] = tt(d);
        function Hu() {
        }
        Hu.prototype = y.filters = y.pseudos, y.setFilters = new Hu(), H = xe.tokenize = function(M, G) {
          var z, lA, nA, wA, dA, HA, GA, re = Ua[M + " "];
          if (re)
            return G ? 0 : re.slice(0);
          for (dA = M, HA = [], GA = y.preFilter; dA; ) {
            (!z || (lA = Do.exec(dA))) && (lA && (dA = dA.slice(lA[0].length) || dA), HA.push(nA = [])), z = !1, (lA = bu.exec(dA)) && (z = lA.shift(), nA.push({
              value: z,
              // Cast descendant combinators to space
              type: lA[0].replace(Ea, " ")
            }), dA = dA.slice(z.length));
            for (wA in y.filter)
              (lA = _a[wA].exec(dA)) && (!GA[wA] || (lA = GA[wA](lA))) && (z = lA.shift(), nA.push({
                value: z,
                type: wA,
                matches: lA
              }), dA = dA.slice(z.length));
            if (!z)
              break;
          }
          return G ? dA.length : dA ? xe.error(M) : (
            // Cache the tokens
            Ua(M, HA).slice(0)
          );
        };
        function yt(M) {
          for (var G = 0, z = M.length, lA = ""; G < z; G++)
            lA += M[G].value;
          return lA;
        }
        function ai(M, G, z) {
          var lA = G.dir, nA = z && lA === "parentNode", wA = qe++;
          return G.first ? (
            // Check against closest ancestor/preceding element
            function(dA, HA, GA) {
              for (; dA = dA[lA]; )
                if (dA.nodeType === 1 || nA)
                  return M(dA, HA, GA);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(dA, HA, GA) {
              var re, VA, ZA, fe = [le, wA];
              if (GA) {
                for (; dA = dA[lA]; )
                  if ((dA.nodeType === 1 || nA) && M(dA, HA, GA))
                    return !0;
              } else
                for (; dA = dA[lA]; )
                  if (dA.nodeType === 1 || nA) {
                    if (ZA = dA[KA] || (dA[KA] = {}), VA = ZA[dA.uniqueID] || (ZA[dA.uniqueID] = {}), (re = VA[lA]) && re[0] === le && re[1] === wA)
                      return fe[2] = re[2];
                    if (VA[lA] = fe, fe[2] = M(dA, HA, GA))
                      return !0;
                  }
            }
          );
        }
        function No(M) {
          return M.length > 1 ? function(G, z, lA) {
            for (var nA = M.length; nA--; )
              if (!M[nA](G, z, lA))
                return !1;
            return !0;
          } : M[0];
        }
        function oi(M, G, z) {
          for (var lA = 0, nA = G.length; lA < nA; lA++)
            xe(M, G[lA], z);
          return z;
        }
        function br(M, G, z, lA, nA) {
          for (var wA, dA = [], HA = 0, GA = M.length, re = G != null; HA < GA; HA++)
            (wA = M[HA]) && (!z || z(wA, lA, nA)) && (dA.push(wA), re && G.push(HA));
          return dA;
        }
        function si(M, G, z, lA, nA, wA) {
          return lA && !lA[KA] && (lA = si(lA)), nA && !nA[KA] && (nA = si(nA, wA)), oA(function(dA, HA, GA, re) {
            var VA, ZA, fe, Se = [], qA = [], Ge = HA.length, nt = dA || oi(G || "*", GA.nodeType ? [GA] : GA, []), Rt = M && (dA || !G) ? br(nt, Se, M, GA, re) : nt, We = z ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              nA || (dA ? M : Ge || lA) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                HA
              )
            ) : Rt;
            if (z && z(Rt, We, GA, re), lA)
              for (VA = br(We, qA), lA(VA, [], GA, re), ZA = VA.length; ZA--; )
                (fe = VA[ZA]) && (We[qA[ZA]] = !(Rt[qA[ZA]] = fe));
            if (dA) {
              if (nA || M) {
                if (nA) {
                  for (VA = [], ZA = We.length; ZA--; )
                    (fe = We[ZA]) && VA.push(Rt[ZA] = fe);
                  nA(null, We = [], VA, re);
                }
                for (ZA = We.length; ZA--; )
                  (fe = We[ZA]) && (VA = nA ? Ur(dA, fe) : Se[ZA]) > -1 && (dA[VA] = !(HA[VA] = fe));
              }
            } else
              We = br(
                We === HA ? We.splice(Ge, We.length) : We
              ), nA ? nA(null, HA, We, re) : On.apply(HA, We);
          });
        }
        function He(M) {
          for (var G, z, lA, nA = M.length, wA = y.relative[M[0].type], dA = wA || y.relative[" "], HA = wA ? 1 : 0, GA = ai(function(ZA) {
            return ZA === G;
          }, dA, !0), re = ai(function(ZA) {
            return Ur(G, ZA) > -1;
          }, dA, !0), VA = [function(ZA, fe, Se) {
            var qA = !wA && (Se || fe !== q) || ((G = fe).nodeType ? GA(ZA, fe, Se) : re(ZA, fe, Se));
            return G = null, qA;
          }]; HA < nA; HA++)
            if (z = y.relative[M[HA].type])
              VA = [ai(No(VA), z)];
            else {
              if (z = y.filter[M[HA].type].apply(null, M[HA].matches), z[KA]) {
                for (lA = ++HA; lA < nA && !y.relative[M[lA].type]; lA++)
                  ;
                return si(
                  HA > 1 && No(VA),
                  HA > 1 && yt(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    M.slice(0, HA - 1).concat({ value: M[HA - 2].type === " " ? "*" : "" })
                  ).replace(Ea, "$1"),
                  z,
                  HA < lA && He(M.slice(HA, lA)),
                  lA < nA && He(M = M.slice(lA)),
                  lA < nA && yt(M)
                );
              }
              VA.push(z);
            }
          return No(VA);
        }
        function Bf(M, G) {
          var z = G.length > 0, lA = M.length > 0, nA = function(wA, dA, HA, GA, re) {
            var VA, ZA, fe, Se = 0, qA = "0", Ge = wA && [], nt = [], Rt = q, We = wA || lA && y.find.TAG("*", re), Pi = le += Rt == null ? 1 : Math.random() || 0.1, rr = We.length;
            for (re && (q = dA === yA || dA || re); qA !== rr && (VA = We[qA]) != null; qA++) {
              if (lA && VA) {
                for (ZA = 0, !dA && VA.ownerDocument !== yA && (SA(VA), HA = !YA); fe = M[ZA++]; )
                  if (fe(VA, dA || yA, HA)) {
                    GA.push(VA);
                    break;
                  }
                re && (le = Pi);
              }
              z && ((VA = !fe && VA) && Se--, wA && Ge.push(VA));
            }
            if (Se += qA, z && qA !== Se) {
              for (ZA = 0; fe = G[ZA++]; )
                fe(Ge, nt, dA, HA);
              if (wA) {
                if (Se > 0)
                  for (; qA--; )
                    Ge[qA] || nt[qA] || (nt[qA] = St.call(GA));
                nt = br(nt);
              }
              On.apply(GA, nt), re && !wA && nt.length > 0 && Se + G.length > 1 && xe.uniqueSort(GA);
            }
            return re && (le = Pi, q = Rt), Ge;
          };
          return z ? oA(nA) : nA;
        }
        return K = xe.compile = function(M, G) {
          var z, lA = [], nA = [], wA = Ht[M + " "];
          if (!wA) {
            for (G || (G = H(M)), z = G.length; z--; )
              wA = He(G[z]), wA[KA] ? lA.push(wA) : nA.push(wA);
            wA = Ht(M, Bf(nA, lA)), wA.selector = M;
          }
          return wA;
        }, W = xe.select = function(M, G, z, lA) {
          var nA, wA, dA, HA, GA, re = typeof M == "function" && M, VA = !lA && H(M = re.selector || M);
          if (z = z || [], VA.length === 1) {
            if (wA = VA[0] = VA[0].slice(0), wA.length > 2 && (dA = wA[0]).type === "ID" && w.getById && G.nodeType === 9 && YA && y.relative[wA[1].type]) {
              if (G = (y.find.ID(dA.matches[0].replace(Nn, Mn), G) || [])[0], G)
                re && (G = G.parentNode);
              else return z;
              M = M.slice(wA.shift().value.length);
            }
            for (nA = _a.needsContext.test(M) ? 0 : wA.length; nA-- && (dA = wA[nA], !y.relative[HA = dA.type]); )
              if ((GA = y.find[HA]) && (lA = GA(
                dA.matches[0].replace(Nn, Mn),
                Oo.test(wA[0].type) && Mi(G.parentNode) || G
              ))) {
                if (wA.splice(nA, 1), M = lA.length && yt(wA), !M)
                  return On.apply(z, lA), z;
                break;
              }
          }
          return (re || K(M, VA))(
            lA,
            G,
            !YA,
            z,
            !G || Oo.test(M) && Mi(G.parentNode) || G
          ), z;
        }, w.sortStable = KA.split("").sort(Tn).join("") === KA, w.detectDuplicates = !!mA, SA(), w.sortDetached = iA(function(M) {
          return M.compareDocumentPosition(yA.createElement("div")) & 1;
        }), iA(function(M) {
          return M.innerHTML = "<a href='#'></a>", M.firstChild.getAttribute("href") === "#";
        }) || OA("type|href|height|width", function(M, G, z) {
          if (!z)
            return M.getAttribute(G, G.toLowerCase() === "type" ? 1 : 2);
        }), (!w.attributes || !iA(function(M) {
          return M.innerHTML = "<input/>", M.firstChild.setAttribute("value", ""), M.firstChild.getAttribute("value") === "";
        })) && OA("value", function(M, G, z) {
          if (!z && M.nodeName.toLowerCase() === "input")
            return M.defaultValue;
        }), iA(function(M) {
          return M.getAttribute("disabled") == null;
        }) || OA(To, function(M, G, z) {
          var lA;
          if (!z)
            return M[G] === !0 ? G.toLowerCase() : (lA = M.getAttributeNode(G)) && lA.specified ? lA.value : null;
        }), xe;
      }(e)
    );
    u.find = x, u.expr = x.selectors, u.expr[":"] = u.expr.pseudos, u.uniqueSort = u.unique = x.uniqueSort, u.text = x.getText, u.isXMLDoc = x.isXML, u.contains = x.contains;
    var P = function(s, d, w) {
      for (var y = [], E = w !== void 0; (s = s[d]) && s.nodeType !== 9; )
        if (s.nodeType === 1) {
          if (E && u(s).is(w))
            break;
          y.push(s);
        }
      return y;
    }, R = function(s, d) {
      for (var w = []; s; s = s.nextSibling)
        s.nodeType === 1 && s !== d && w.push(s);
      return w;
    }, J = u.expr.match.needsContext, fA = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, uA = /^.[^:#\[\.,]*$/;
    function BA(s, d, w) {
      if (u.isFunction(d))
        return u.grep(s, function(y, E) {
          return !!d.call(y, E, y) !== w;
        });
      if (d.nodeType)
        return u.grep(s, function(y) {
          return y === d !== w;
        });
      if (typeof d == "string") {
        if (uA.test(d))
          return u.filter(d, s, w);
        d = u.filter(d, s);
      }
      return u.grep(s, function(y) {
        return u.inArray(y, d) > -1 !== w;
      });
    }
    u.filter = function(s, d, w) {
      var y = d[0];
      return w && (s = ":not(" + s + ")"), d.length === 1 && y.nodeType === 1 ? u.find.matchesSelector(y, s) ? [y] : [] : u.find.matches(s, u.grep(d, function(E) {
        return E.nodeType === 1;
      }));
    }, u.fn.extend({
      find: function(s) {
        var d, w = [], y = this, E = y.length;
        if (typeof s != "string")
          return this.pushStack(u(s).filter(function() {
            for (d = 0; d < E; d++)
              if (u.contains(y[d], this))
                return !0;
          }));
        for (d = 0; d < E; d++)
          u.find(s, y[d], w);
        return w = this.pushStack(E > 1 ? u.unique(w) : w), w.selector = this.selector ? this.selector + " " + s : s, w;
      },
      filter: function(s) {
        return this.pushStack(BA(this, s || [], !1));
      },
      not: function(s) {
        return this.pushStack(BA(this, s || [], !0));
      },
      is: function(s) {
        return !!BA(
          this,
          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof s == "string" && J.test(s) ? u(s) : s || [],
          !1
        ).length;
      }
    });
    var FA, NA = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, xA = u.fn.init = function(s, d, w) {
      var y, E;
      if (!s)
        return this;
      if (w = w || FA, typeof s == "string")
        if (s.charAt(0) === "<" && s.charAt(s.length - 1) === ">" && s.length >= 3 ? y = [null, s, null] : y = NA.exec(s), y && (y[1] || !d))
          if (y[1]) {
            if (d = d instanceof u ? d[0] : d, u.merge(this, u.parseHTML(
              y[1],
              d && d.nodeType ? d.ownerDocument || d : i,
              !0
            )), fA.test(y[1]) && u.isPlainObject(d))
              for (y in d)
                u.isFunction(this[y]) ? this[y](d[y]) : this.attr(y, d[y]);
            return this;
          } else {
            if (E = i.getElementById(y[2]), E && E.parentNode) {
              if (E.id !== y[2])
                return FA.find(s);
              this.length = 1, this[0] = E;
            }
            return this.context = i, this.selector = s, this;
          }
        else return !d || d.jquery ? (d || w).find(s) : this.constructor(d).find(s);
      else {
        if (s.nodeType)
          return this.context = this[0] = s, this.length = 1, this;
        if (u.isFunction(s))
          return typeof w.ready < "u" ? w.ready(s) : (
            // Execute immediately if ready is not present
            s(u)
          );
      }
      return s.selector !== void 0 && (this.selector = s.selector, this.context = s.context), u.makeArray(s, this);
    };
    xA.prototype = u.fn, FA = u(i);
    var X = /^(?:parents|prev(?:Until|All))/, CA = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
    u.fn.extend({
      has: function(s) {
        var d, w = u(s, this), y = w.length;
        return this.filter(function() {
          for (d = 0; d < y; d++)
            if (u.contains(this, w[d]))
              return !0;
        });
      },
      closest: function(s, d) {
        for (var w, y = 0, E = this.length, b = [], H = J.test(s) || typeof s != "string" ? u(s, d || this.context) : 0; y < E; y++)
          for (w = this[y]; w && w !== d; w = w.parentNode)
            if (w.nodeType < 11 && (H ? H.index(w) > -1 : (
              // Don't pass non-elements to Sizzle
              w.nodeType === 1 && u.find.matchesSelector(w, s)
            ))) {
              b.push(w);
              break;
            }
        return this.pushStack(b.length > 1 ? u.uniqueSort(b) : b);
      },
      // Determine the position of an element within
      // the matched set of elements
      index: function(s) {
        return s ? typeof s == "string" ? u.inArray(this[0], u(s)) : u.inArray(
          // If it receives a jQuery object, the first element is used
          s.jquery ? s[0] : s,
          this
        ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      },
      add: function(s, d) {
        return this.pushStack(
          u.uniqueSort(
            u.merge(this.get(), u(s, d))
          )
        );
      },
      addBack: function(s) {
        return this.add(
          s == null ? this.prevObject : this.prevObject.filter(s)
        );
      }
    });
    function tA(s, d) {
      do
        s = s[d];
      while (s && s.nodeType !== 1);
      return s;
    }
    u.each({
      parent: function(s) {
        var d = s.parentNode;
        return d && d.nodeType !== 11 ? d : null;
      },
      parents: function(s) {
        return P(s, "parentNode");
      },
      parentsUntil: function(s, d, w) {
        return P(s, "parentNode", w);
      },
      next: function(s) {
        return tA(s, "nextSibling");
      },
      prev: function(s) {
        return tA(s, "previousSibling");
      },
      nextAll: function(s) {
        return P(s, "nextSibling");
      },
      prevAll: function(s) {
        return P(s, "previousSibling");
      },
      nextUntil: function(s, d, w) {
        return P(s, "nextSibling", w);
      },
      prevUntil: function(s, d, w) {
        return P(s, "previousSibling", w);
      },
      siblings: function(s) {
        return R((s.parentNode || {}).firstChild, s);
      },
      children: function(s) {
        return R(s.firstChild);
      },
      contents: function(s) {
        return u.nodeName(s, "iframe") ? s.contentDocument || s.contentWindow.document : u.merge([], s.childNodes);
      }
    }, function(s, d) {
      u.fn[s] = function(w, y) {
        var E = u.map(this, d, w);
        return s.slice(-5) !== "Until" && (y = w), y && typeof y == "string" && (E = u.filter(y, E)), this.length > 1 && (CA[s] || (E = u.uniqueSort(E)), X.test(s) && (E = E.reverse())), this.pushStack(E);
      };
    });
    var hA = /\S+/g;
    function _A(s) {
      var d = {};
      return u.each(s.match(hA) || [], function(w, y) {
        d[y] = !0;
      }), d;
    }
    u.Callbacks = function(s) {
      s = typeof s == "string" ? _A(s) : u.extend({}, s);
      var d, w, y, E, b = [], H = [], K = -1, W = function() {
        for (E = s.once, y = d = !0; H.length; K = -1)
          for (w = H.shift(); ++K < b.length; )
            b[K].apply(w[0], w[1]) === !1 && s.stopOnFalse && (K = b.length, w = !1);
        s.memory || (w = !1), d = !1, E && (w ? b = [] : b = "");
      }, q = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return b && (w && !d && (K = b.length - 1, H.push(w)), function AA(mA) {
            u.each(mA, function(SA, yA) {
              u.isFunction(yA) ? (!s.unique || !q.has(yA)) && b.push(yA) : yA && yA.length && u.type(yA) !== "string" && AA(yA);
            });
          }(arguments), w && !d && W()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return u.each(arguments, function(AA, mA) {
            for (var SA; (SA = u.inArray(mA, b, SA)) > -1; )
              b.splice(SA, 1), SA <= K && K--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(AA) {
          return AA ? u.inArray(AA, b) > -1 : b.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return b && (b = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return E = H = [], b = w = "", this;
        },
        disabled: function() {
          return !b;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return E = !0, w || q.disable(), this;
        },
        locked: function() {
          return !!E;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(AA, mA) {
          return E || (mA = mA || [], mA = [AA, mA.slice ? mA.slice() : mA], H.push(mA), d || W()), this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          return q.fireWith(this, arguments), this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!y;
        }
      };
      return q;
    }, u.extend({
      Deferred: function(s) {
        var d = [
          // action, add listener, listener list, final state
          ["resolve", "done", u.Callbacks("once memory"), "resolved"],
          ["reject", "fail", u.Callbacks("once memory"), "rejected"],
          ["notify", "progress", u.Callbacks("memory")]
        ], w = "pending", y = {
          state: function() {
            return w;
          },
          always: function() {
            return E.done(arguments).fail(arguments), this;
          },
          then: function() {
            var b = arguments;
            return u.Deferred(function(H) {
              u.each(d, function(K, W) {
                var q = u.isFunction(b[K]) && b[K];
                E[W[1]](function() {
                  var AA = q && q.apply(this, arguments);
                  AA && u.isFunction(AA.promise) ? AA.promise().progress(H.notify).done(H.resolve).fail(H.reject) : H[W[0] + "With"](
                    this === y ? H.promise() : this,
                    q ? [AA] : arguments
                  );
                });
              }), b = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(b) {
            return b != null ? u.extend(b, y) : y;
          }
        }, E = {};
        return y.pipe = y.then, u.each(d, function(b, H) {
          var K = H[2], W = H[3];
          y[H[1]] = K.add, W && K.add(function() {
            w = W;
          }, d[b ^ 1][2].disable, d[2][2].lock), E[H[0]] = function() {
            return E[H[0] + "With"](this === E ? y : this, arguments), this;
          }, E[H[0] + "With"] = K.fireWith;
        }), y.promise(E), s && s.call(E, E), E;
      },
      // Deferred helper
      when: function(s) {
        var d = 0, w = o.call(arguments), y = w.length, E = y !== 1 || s && u.isFunction(s.promise) ? y : 0, b = E === 1 ? s : u.Deferred(), H = function(AA, mA, SA) {
          return function(yA) {
            mA[AA] = this, SA[AA] = arguments.length > 1 ? o.call(arguments) : yA, SA === K ? b.notifyWith(mA, SA) : --E || b.resolveWith(mA, SA);
          };
        }, K, W, q;
        if (y > 1)
          for (K = new Array(y), W = new Array(y), q = new Array(y); d < y; d++)
            w[d] && u.isFunction(w[d].promise) ? w[d].promise().progress(H(d, W, K)).done(H(d, q, w)).fail(b.reject) : --E;
        return E || b.resolveWith(q, w), b.promise();
      }
    });
    var IA;
    u.fn.ready = function(s) {
      return u.ready.promise().done(s), this;
    }, u.extend({
      // Is the DOM ready to be used? Set to true once it occurs.
      isReady: !1,
      // A counter to track how many items to wait for before
      // the ready event fires. See #6781
      readyWait: 1,
      // Hold (or release) the ready event
      holdReady: function(s) {
        s ? u.readyWait++ : u.ready(!0);
      },
      // Handle when the DOM is ready
      ready: function(s) {
        (s === !0 ? --u.readyWait : u.isReady) || (u.isReady = !0, !(s !== !0 && --u.readyWait > 0) && (IA.resolveWith(i, [u]), u.fn.triggerHandler && (u(i).triggerHandler("ready"), u(i).off("ready"))));
      }
    });
    function aA() {
      i.addEventListener ? (i.removeEventListener("DOMContentLoaded", D), e.removeEventListener("load", D)) : (i.detachEvent("onreadystatechange", D), e.detachEvent("onload", D));
    }
    function D() {
      (i.addEventListener || e.event.type === "load" || i.readyState === "complete") && (aA(), u.ready());
    }
    u.ready.promise = function(s) {
      if (!IA)
        if (IA = u.Deferred(), i.readyState === "complete" || i.readyState !== "loading" && !i.documentElement.doScroll)
          e.setTimeout(u.ready);
        else if (i.addEventListener)
          i.addEventListener("DOMContentLoaded", D), e.addEventListener("load", D);
        else {
          i.attachEvent("onreadystatechange", D), e.attachEvent("onload", D);
          var d = !1;
          try {
            d = e.frameElement == null && i.documentElement;
          } catch {
          }
          d && d.doScroll && function w() {
            if (!u.isReady) {
              try {
                d.doScroll("left");
              } catch {
                return e.setTimeout(w, 50);
              }
              aA(), u.ready();
            }
          }();
        }
      return IA.promise(s);
    }, u.ready.promise();
    var eA;
    for (eA in u(g))
      break;
    g.ownFirst = eA === "0", g.inlineBlockNeedsLayout = !1, u(function() {
      var s, d, w, y;
      w = i.getElementsByTagName("body")[0], !(!w || !w.style) && (d = i.createElement("div"), y = i.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", w.appendChild(y).appendChild(d), typeof d.style.zoom < "u" && (d.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", g.inlineBlockNeedsLayout = s = d.offsetWidth === 3, s && (w.style.zoom = 1)), w.removeChild(y));
    }), function() {
      var s = i.createElement("div");
      g.deleteExpando = !0;
      try {
        delete s.test;
      } catch {
        g.deleteExpando = !1;
      }
      s = null;
    }();
    var j = function(s) {
      var d = u.noData[(s.nodeName + " ").toLowerCase()], w = +s.nodeType || 1;
      return w !== 1 && w !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !d || d !== !0 && s.getAttribute("classid") === d
      );
    }, T = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, k = /([A-Z])/g;
    function rA(s, d, w) {
      if (w === void 0 && s.nodeType === 1) {
        var y = "data-" + d.replace(k, "-$1").toLowerCase();
        if (w = s.getAttribute(y), typeof w == "string") {
          try {
            w = w === "true" ? !0 : w === "false" ? !1 : w === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +w + "" === w ? +w : T.test(w) ? u.parseJSON(w) : w
            );
          } catch {
          }
          u.data(s, d, w);
        } else
          w = void 0;
      }
      return w;
    }
    function UA(s) {
      var d;
      for (d in s)
        if (!(d === "data" && u.isEmptyObject(s[d])) && d !== "toJSON")
          return !1;
      return !0;
    }
    function EA(s, d, w, y) {
      if (j(s)) {
        var E, b, H = u.expando, K = s.nodeType, W = K ? u.cache : s, q = K ? s[H] : s[H] && H;
        if (!((!q || !W[q] || !y && !W[q].data) && w === void 0 && typeof d == "string"))
          return q || (K ? q = s[H] = n.pop() || u.guid++ : q = H), W[q] || (W[q] = K ? {} : { toJSON: u.noop }), (typeof d == "object" || typeof d == "function") && (y ? W[q] = u.extend(W[q], d) : W[q].data = u.extend(W[q].data, d)), b = W[q], y || (b.data || (b.data = {}), b = b.data), w !== void 0 && (b[u.camelCase(d)] = w), typeof d == "string" ? (E = b[d], E == null && (E = b[u.camelCase(d)])) : E = b, E;
      }
    }
    function zA(s, d, w) {
      if (j(s)) {
        var y, E, b = s.nodeType, H = b ? u.cache : s, K = b ? s[u.expando] : u.expando;
        if (H[K]) {
          if (d && (y = w ? H[K] : H[K].data, y)) {
            for (u.isArray(d) ? d = d.concat(u.map(d, u.camelCase)) : (d in y) ? d = [d] : (d = u.camelCase(d), d in y ? d = [d] : d = d.split(" ")), E = d.length; E--; )
              delete y[d[E]];
            if (w ? !UA(y) : !u.isEmptyObject(y))
              return;
          }
          !w && (delete H[K].data, !UA(H[K])) || (b ? u.cleanData([s], !0) : g.deleteExpando || H != H.window ? delete H[K] : H[K] = void 0);
        }
      }
    }
    u.extend({
      cache: {},
      // The following elements (space-suffixed to avoid Object.prototype collisions)
      // throw uncatchable exceptions if you attempt to set expando properties
      noData: {
        "applet ": !0,
        "embed ": !0,
        // ...but Flash objects (which have this classid) *can* handle expandos
        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      },
      hasData: function(s) {
        return s = s.nodeType ? u.cache[s[u.expando]] : s[u.expando], !!s && !UA(s);
      },
      data: function(s, d, w) {
        return EA(s, d, w);
      },
      removeData: function(s, d) {
        return zA(s, d);
      },
      // For internal use only.
      _data: function(s, d, w) {
        return EA(s, d, w, !0);
      },
      _removeData: function(s, d) {
        return zA(s, d, !0);
      }
    }), u.fn.extend({
      data: function(s, d) {
        var w, y, E, b = this[0], H = b && b.attributes;
        if (s === void 0) {
          if (this.length && (E = u.data(b), b.nodeType === 1 && !u._data(b, "parsedAttrs"))) {
            for (w = H.length; w--; )
              H[w] && (y = H[w].name, y.indexOf("data-") === 0 && (y = u.camelCase(y.slice(5)), rA(b, y, E[y])));
            u._data(b, "parsedAttrs", !0);
          }
          return E;
        }
        return typeof s == "object" ? this.each(function() {
          u.data(this, s);
        }) : arguments.length > 1 ? (
          // Sets one value
          this.each(function() {
            u.data(this, s, d);
          })
        ) : (
          // Gets one value
          // Try to fetch any internally stored data first
          b ? rA(b, s, u.data(b, s)) : void 0
        );
      },
      removeData: function(s) {
        return this.each(function() {
          u.removeData(this, s);
        });
      }
    }), u.extend({
      queue: function(s, d, w) {
        var y;
        if (s)
          return d = (d || "fx") + "queue", y = u._data(s, d), w && (!y || u.isArray(w) ? y = u._data(s, d, u.makeArray(w)) : y.push(w)), y || [];
      },
      dequeue: function(s, d) {
        d = d || "fx";
        var w = u.queue(s, d), y = w.length, E = w.shift(), b = u._queueHooks(s, d), H = function() {
          u.dequeue(s, d);
        };
        E === "inprogress" && (E = w.shift(), y--), E && (d === "fx" && w.unshift("inprogress"), delete b.stop, E.call(s, H, b)), !y && b && b.empty.fire();
      },
      // not intended for public consumption - generates a queueHooks object,
      // or returns the current one
      _queueHooks: function(s, d) {
        var w = d + "queueHooks";
        return u._data(s, w) || u._data(s, w, {
          empty: u.Callbacks("once memory").add(function() {
            u._removeData(s, d + "queue"), u._removeData(s, w);
          })
        });
      }
    }), u.fn.extend({
      queue: function(s, d) {
        var w = 2;
        return typeof s != "string" && (d = s, s = "fx", w--), arguments.length < w ? u.queue(this[0], s) : d === void 0 ? this : this.each(function() {
          var y = u.queue(this, s, d);
          u._queueHooks(this, s), s === "fx" && y[0] !== "inprogress" && u.dequeue(this, s);
        });
      },
      dequeue: function(s) {
        return this.each(function() {
          u.dequeue(this, s);
        });
      },
      clearQueue: function(s) {
        return this.queue(s || "fx", []);
      },
      // Get a promise resolved when queues of a certain type
      // are emptied (fx is the type by default)
      promise: function(s, d) {
        var w, y = 1, E = u.Deferred(), b = this, H = this.length, K = function() {
          --y || E.resolveWith(b, [b]);
        };
        for (typeof s != "string" && (d = s, s = void 0), s = s || "fx"; H--; )
          w = u._data(b[H], s + "queueHooks"), w && w.empty && (y++, w.empty.add(K));
        return K(), E.promise(d);
      }
    }), function() {
      var s;
      g.shrinkWrapBlocks = function() {
        if (s != null)
          return s;
        s = !1;
        var d, w, y;
        if (w = i.getElementsByTagName("body")[0], !(!w || !w.style))
          return d = i.createElement("div"), y = i.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", w.appendChild(y).appendChild(d), typeof d.style.zoom < "u" && (d.style.cssText = // Support: Firefox<29, Android 2.3
          // Vendor-prefix box-sizing
          "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", d.appendChild(i.createElement("div")).style.width = "5px", s = d.offsetWidth !== 3), w.removeChild(y), s;
      };
    }();
    var ne = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, JA = new RegExp("^(?:([+-])=|)(" + ne + ")([a-z%]*)$", "i"), RA = ["Top", "Right", "Bottom", "Left"], sA = function(s, d) {
      return s = d || s, u.css(s, "display") === "none" || !u.contains(s.ownerDocument, s);
    };
    function vA(s, d, w, y) {
      var E, b = 1, H = 20, K = y ? function() {
        return y.cur();
      } : function() {
        return u.css(s, d, "");
      }, W = K(), q = w && w[3] || (u.cssNumber[d] ? "" : "px"), AA = (u.cssNumber[d] || q !== "px" && +W) && JA.exec(u.css(s, d));
      if (AA && AA[3] !== q) {
        q = q || AA[3], w = w || [], AA = +W || 1;
        do
          b = b || ".5", AA = AA / b, u.style(s, d, AA + q);
        while (b !== (b = K() / W) && b !== 1 && --H);
      }
      return w && (AA = +AA || +W || 0, E = w[1] ? AA + (w[1] + 1) * w[2] : +w[2], y && (y.unit = q, y.start = AA, y.end = E)), E;
    }
    var bA = function(s, d, w, y, E, b, H) {
      var K = 0, W = s.length, q = w == null;
      if (u.type(w) === "object") {
        E = !0;
        for (K in w)
          bA(s, d, K, w[K], !0, b, H);
      } else if (y !== void 0 && (E = !0, u.isFunction(y) || (H = !0), q && (H ? (d.call(s, y), d = null) : (q = d, d = function(AA, mA, SA) {
        return q.call(u(AA), SA);
      })), d))
        for (; K < W; K++)
          d(
            s[K],
            w,
            H ? y : y.call(s[K], K, d(s[K], w))
          );
      return E ? s : (
        // Gets
        q ? d.call(s) : W ? d(s[0], w) : b
      );
    }, te = /^(?:checkbox|radio)$/i, me = /<([\w:-]+)/, Ue = /^$|\/(?:java|ecma)script/i, Ze = /^\s+/, Te = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function $e(s) {
      var d = Te.split("|"), w = s.createDocumentFragment();
      if (w.createElement)
        for (; d.length; )
          w.createElement(
            d.pop()
          );
      return w;
    }
    (function() {
      var s = i.createElement("div"), d = i.createDocumentFragment(), w = i.createElement("input");
      s.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", g.leadingWhitespace = s.firstChild.nodeType === 3, g.tbody = !s.getElementsByTagName("tbody").length, g.htmlSerialize = !!s.getElementsByTagName("link").length, g.html5Clone = i.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", w.type = "checkbox", w.checked = !0, d.appendChild(w), g.appendChecked = w.checked, s.innerHTML = "<textarea>x</textarea>", g.noCloneChecked = !!s.cloneNode(!0).lastChild.defaultValue, d.appendChild(s), w = i.createElement("input"), w.setAttribute("type", "radio"), w.setAttribute("checked", "checked"), w.setAttribute("name", "t"), s.appendChild(w), g.checkClone = s.cloneNode(!0).cloneNode(!0).lastChild.checked, g.noCloneEvent = !!s.addEventListener, s[u.expando] = 1, g.attributes = !s.getAttribute(u.expando);
    })();
    var Pe = {
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
      _default: g.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Pe.optgroup = Pe.option, Pe.tbody = Pe.tfoot = Pe.colgroup = Pe.caption = Pe.thead, Pe.th = Pe.td;
    function _e(s, d) {
      var w, y, E = 0, b = typeof s.getElementsByTagName < "u" ? s.getElementsByTagName(d || "*") : typeof s.querySelectorAll < "u" ? s.querySelectorAll(d || "*") : void 0;
      if (!b)
        for (b = [], w = s.childNodes || s; (y = w[E]) != null; E++)
          !d || u.nodeName(y, d) ? b.push(y) : u.merge(b, _e(y, d));
      return d === void 0 || d && u.nodeName(s, d) ? u.merge([s], b) : b;
    }
    function Mt(s, d) {
      for (var w, y = 0; (w = s[y]) != null; y++)
        u._data(
          w,
          "globalEval",
          !d || u._data(d[y], "globalEval")
        );
    }
    var bt = /<|&#?\w+;/, Pt = /<tbody/i;
    function _t(s) {
      te.test(s.type) && (s.defaultChecked = s.checked);
    }
    function mt(s, d, w, y, E) {
      for (var b, H, K, W, q, AA, mA, SA = s.length, yA = $e(d), ie = [], YA = 0; YA < SA; YA++)
        if (H = s[YA], H || H === 0)
          if (u.type(H) === "object")
            u.merge(ie, H.nodeType ? [H] : H);
          else if (!bt.test(H))
            ie.push(d.createTextNode(H));
          else {
            for (W = W || yA.appendChild(d.createElement("div")), q = (me.exec(H) || ["", ""])[1].toLowerCase(), mA = Pe[q] || Pe._default, W.innerHTML = mA[1] + u.htmlPrefilter(H) + mA[2], b = mA[0]; b--; )
              W = W.lastChild;
            if (!g.leadingWhitespace && Ze.test(H) && ie.push(d.createTextNode(Ze.exec(H)[0])), !g.tbody)
              for (H = q === "table" && !Pt.test(H) ? W.firstChild : (
                // String was a bare <thead> or <tfoot>
                mA[1] === "<table>" && !Pt.test(H) ? W : 0
              ), b = H && H.childNodes.length; b--; )
                u.nodeName(AA = H.childNodes[b], "tbody") && !AA.childNodes.length && H.removeChild(AA);
            for (u.merge(ie, W.childNodes), W.textContent = ""; W.firstChild; )
              W.removeChild(W.firstChild);
            W = yA.lastChild;
          }
      for (W && yA.removeChild(W), g.appendChecked || u.grep(_e(ie, "input"), _t), YA = 0; H = ie[YA++]; ) {
        if (y && u.inArray(H, y) > -1) {
          E && E.push(H);
          continue;
        }
        if (K = u.contains(H.ownerDocument, H), W = _e(yA.appendChild(H), "script"), K && Mt(W), w)
          for (b = 0; H = W[b++]; )
            Ue.test(H.type || "") && w.push(H);
      }
      return W = null, yA;
    }
    (function() {
      var s, d, w = i.createElement("div");
      for (s in { submit: !0, change: !0, focusin: !0 })
        d = "on" + s, (g[s] = d in e) || (w.setAttribute(d, "t"), g[s] = w.attributes[d].expando === !1);
      w = null;
    })();
    var hn = /^(?:input|select|textarea)$/i, vr = /^key/, xi = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, zr = /^(?:focusinfocus|focusoutblur)$/, Jr = /^([^.]*)(?:\.(.+)|)/;
    function cA() {
      return !0;
    }
    function DA() {
      return !1;
    }
    function XA() {
      try {
        return i.activeElement;
      } catch {
      }
    }
    function ve(s, d, w, y, E, b) {
      var H, K;
      if (typeof d == "object") {
        typeof w != "string" && (y = y || w, w = void 0);
        for (K in d)
          ve(s, K, w, y, d[K], b);
        return s;
      }
      if (y == null && E == null ? (E = w, y = w = void 0) : E == null && (typeof w == "string" ? (E = y, y = void 0) : (E = y, y = w, w = void 0)), E === !1)
        E = DA;
      else if (!E)
        return s;
      return b === 1 && (H = E, E = function(W) {
        return u().off(W), H.apply(this, arguments);
      }, E.guid = H.guid || (H.guid = u.guid++)), s.each(function() {
        u.event.add(this, d, E, y, w);
      });
    }
    u.event = {
      global: {},
      add: function(s, d, w, y, E) {
        var b, H, K, W, q, AA, mA, SA, yA, ie, YA, ue = u._data(s);
        if (ue) {
          for (w.handler && (W = w, w = W.handler, E = W.selector), w.guid || (w.guid = u.guid++), (H = ue.events) || (H = ue.events = {}), (AA = ue.handle) || (AA = ue.handle = function(pt) {
            return typeof u < "u" && (!pt || u.event.triggered !== pt.type) ? u.event.dispatch.apply(AA.elem, arguments) : void 0;
          }, AA.elem = s), d = (d || "").match(hA) || [""], K = d.length; K--; )
            b = Jr.exec(d[K]) || [], yA = YA = b[1], ie = (b[2] || "").split(".").sort(), yA && (q = u.event.special[yA] || {}, yA = (E ? q.delegateType : q.bindType) || yA, q = u.event.special[yA] || {}, mA = u.extend({
              type: yA,
              origType: YA,
              data: y,
              handler: w,
              guid: w.guid,
              selector: E,
              needsContext: E && u.expr.match.needsContext.test(E),
              namespace: ie.join(".")
            }, W), (SA = H[yA]) || (SA = H[yA] = [], SA.delegateCount = 0, (!q.setup || q.setup.call(s, y, ie, AA) === !1) && (s.addEventListener ? s.addEventListener(yA, AA, !1) : s.attachEvent && s.attachEvent("on" + yA, AA))), q.add && (q.add.call(s, mA), mA.handler.guid || (mA.handler.guid = w.guid)), E ? SA.splice(SA.delegateCount++, 0, mA) : SA.push(mA), u.event.global[yA] = !0);
          s = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(s, d, w, y, E) {
        var b, H, K, W, q, AA, mA, SA, yA, ie, YA, ue = u.hasData(s) && u._data(s);
        if (!(!ue || !(AA = ue.events))) {
          for (d = (d || "").match(hA) || [""], q = d.length; q--; ) {
            if (K = Jr.exec(d[q]) || [], yA = YA = K[1], ie = (K[2] || "").split(".").sort(), !yA) {
              for (yA in AA)
                u.event.remove(s, yA + d[q], w, y, !0);
              continue;
            }
            for (mA = u.event.special[yA] || {}, yA = (y ? mA.delegateType : mA.bindType) || yA, SA = AA[yA] || [], K = K[2] && new RegExp("(^|\\.)" + ie.join("\\.(?:.*\\.|)") + "(\\.|$)"), W = b = SA.length; b--; )
              H = SA[b], (E || YA === H.origType) && (!w || w.guid === H.guid) && (!K || K.test(H.namespace)) && (!y || y === H.selector || y === "**" && H.selector) && (SA.splice(b, 1), H.selector && SA.delegateCount--, mA.remove && mA.remove.call(s, H));
            W && !SA.length && ((!mA.teardown || mA.teardown.call(s, ie, ue.handle) === !1) && u.removeEvent(s, yA, ue.handle), delete AA[yA]);
          }
          u.isEmptyObject(AA) && (delete ue.handle, u._removeData(s, "events"));
        }
      },
      trigger: function(s, d, w, y) {
        var E, b, H, K, W, q, AA, mA = [w || i], SA = B.call(s, "type") ? s.type : s, yA = B.call(s, "namespace") ? s.namespace.split(".") : [];
        if (H = q = w = w || i, !(w.nodeType === 3 || w.nodeType === 8) && !zr.test(SA + u.event.triggered) && (SA.indexOf(".") > -1 && (yA = SA.split("."), SA = yA.shift(), yA.sort()), b = SA.indexOf(":") < 0 && "on" + SA, s = s[u.expando] ? s : new u.Event(SA, typeof s == "object" && s), s.isTrigger = y ? 2 : 3, s.namespace = yA.join("."), s.rnamespace = s.namespace ? new RegExp("(^|\\.)" + yA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, s.result = void 0, s.target || (s.target = w), d = d == null ? [s] : u.makeArray(d, [s]), W = u.event.special[SA] || {}, !(!y && W.trigger && W.trigger.apply(w, d) === !1))) {
          if (!y && !W.noBubble && !u.isWindow(w)) {
            for (K = W.delegateType || SA, zr.test(K + SA) || (H = H.parentNode); H; H = H.parentNode)
              mA.push(H), q = H;
            q === (w.ownerDocument || i) && mA.push(q.defaultView || q.parentWindow || e);
          }
          for (AA = 0; (H = mA[AA++]) && !s.isPropagationStopped(); )
            s.type = AA > 1 ? K : W.bindType || SA, E = (u._data(H, "events") || {})[s.type] && u._data(H, "handle"), E && E.apply(H, d), E = b && H[b], E && E.apply && j(H) && (s.result = E.apply(H, d), s.result === !1 && s.preventDefault());
          if (s.type = SA, !y && !s.isDefaultPrevented() && (!W._default || W._default.apply(mA.pop(), d) === !1) && j(w) && b && w[SA] && !u.isWindow(w)) {
            q = w[b], q && (w[b] = null), u.event.triggered = SA;
            try {
              w[SA]();
            } catch {
            }
            u.event.triggered = void 0, q && (w[b] = q);
          }
          return s.result;
        }
      },
      dispatch: function(s) {
        s = u.event.fix(s);
        var d, w, y, E, b, H = [], K = o.call(arguments), W = (u._data(this, "events") || {})[s.type] || [], q = u.event.special[s.type] || {};
        if (K[0] = s, s.delegateTarget = this, !(q.preDispatch && q.preDispatch.call(this, s) === !1)) {
          for (H = u.event.handlers.call(this, s, W), d = 0; (E = H[d++]) && !s.isPropagationStopped(); )
            for (s.currentTarget = E.elem, w = 0; (b = E.handlers[w++]) && !s.isImmediatePropagationStopped(); )
              (!s.rnamespace || s.rnamespace.test(b.namespace)) && (s.handleObj = b, s.data = b.data, y = ((u.event.special[b.origType] || {}).handle || b.handler).apply(E.elem, K), y !== void 0 && (s.result = y) === !1 && (s.preventDefault(), s.stopPropagation()));
          return q.postDispatch && q.postDispatch.call(this, s), s.result;
        }
      },
      handlers: function(s, d) {
        var w, y, E, b, H = [], K = d.delegateCount, W = s.target;
        if (K && W.nodeType && (s.type !== "click" || isNaN(s.button) || s.button < 1)) {
          for (; W != this; W = W.parentNode || this)
            if (W.nodeType === 1 && (W.disabled !== !0 || s.type !== "click")) {
              for (y = [], w = 0; w < K; w++)
                b = d[w], E = b.selector + " ", y[E] === void 0 && (y[E] = b.needsContext ? u(E, this).index(W) > -1 : u.find(E, this, null, [W]).length), y[E] && y.push(b);
              y.length && H.push({ elem: W, handlers: y });
            }
        }
        return K < d.length && H.push({ elem: this, handlers: d.slice(K) }), H;
      },
      fix: function(s) {
        if (s[u.expando])
          return s;
        var d, w, y, E = s.type, b = s, H = this.fixHooks[E];
        for (H || (this.fixHooks[E] = H = xi.test(E) ? this.mouseHooks : vr.test(E) ? this.keyHooks : {}), y = H.props ? this.props.concat(H.props) : this.props, s = new u.Event(b), d = y.length; d--; )
          w = y[d], s[w] = b[w];
        return s.target || (s.target = b.srcElement || i), s.target.nodeType === 3 && (s.target = s.target.parentNode), s.metaKey = !!s.metaKey, H.filter ? H.filter(s, b) : s;
      },
      // Includes some event props shared by KeyEvent and MouseEvent
      props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(s, d) {
          return s.which == null && (s.which = d.charCode != null ? d.charCode : d.keyCode), s;
        }
      },
      mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(s, d) {
          var w, y, E, b = d.button, H = d.fromElement;
          return s.pageX == null && d.clientX != null && (y = s.target.ownerDocument || i, E = y.documentElement, w = y.body, s.pageX = d.clientX + (E && E.scrollLeft || w && w.scrollLeft || 0) - (E && E.clientLeft || w && w.clientLeft || 0), s.pageY = d.clientY + (E && E.scrollTop || w && w.scrollTop || 0) - (E && E.clientTop || w && w.clientTop || 0)), !s.relatedTarget && H && (s.relatedTarget = H === s.target ? d.toElement : H), !s.which && b !== void 0 && (s.which = b & 1 ? 1 : b & 2 ? 3 : b & 4 ? 2 : 0), s;
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
            if (this !== XA() && this.focus)
              try {
                return this.focus(), !1;
              } catch {
              }
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            if (this === XA() && this.blur)
              return this.blur(), !1;
          },
          delegateType: "focusout"
        },
        click: {
          // For checkbox, fire native event so checked state will be right
          trigger: function() {
            if (u.nodeName(this, "input") && this.type === "checkbox" && this.click)
              return this.click(), !1;
          },
          // For cross-browser consistency, don't fire native .click() on links
          _default: function(s) {
            return u.nodeName(s.target, "a");
          }
        },
        beforeunload: {
          postDispatch: function(s) {
            s.result !== void 0 && s.originalEvent && (s.originalEvent.returnValue = s.result);
          }
        }
      },
      // Piggyback on a donor event to simulate a different one
      simulate: function(s, d, w) {
        var y = u.extend(
          new u.Event(),
          w,
          {
            type: s,
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
        u.event.trigger(y, null, d), y.isDefaultPrevented() && w.preventDefault();
      }
    }, u.removeEvent = i.removeEventListener ? function(s, d, w) {
      s.removeEventListener && s.removeEventListener(d, w);
    } : function(s, d, w) {
      var y = "on" + d;
      s.detachEvent && (typeof s[y] > "u" && (s[y] = null), s.detachEvent(y, w));
    }, u.Event = function(s, d) {
      if (!(this instanceof u.Event))
        return new u.Event(s, d);
      s && s.type ? (this.originalEvent = s, this.type = s.type, this.isDefaultPrevented = s.defaultPrevented || s.defaultPrevented === void 0 && // Support: IE < 9, Android < 4.0
      s.returnValue === !1 ? cA : DA) : this.type = s, d && u.extend(this, d), this.timeStamp = s && s.timeStamp || u.now(), this[u.expando] = !0;
    }, u.Event.prototype = {
      constructor: u.Event,
      isDefaultPrevented: DA,
      isPropagationStopped: DA,
      isImmediatePropagationStopped: DA,
      preventDefault: function() {
        var s = this.originalEvent;
        this.isDefaultPrevented = cA, s && (s.preventDefault ? s.preventDefault() : s.returnValue = !1);
      },
      stopPropagation: function() {
        var s = this.originalEvent;
        this.isPropagationStopped = cA, !(!s || this.isSimulated) && (s.stopPropagation && s.stopPropagation(), s.cancelBubble = !0);
      },
      stopImmediatePropagation: function() {
        var s = this.originalEvent;
        this.isImmediatePropagationStopped = cA, s && s.stopImmediatePropagation && s.stopImmediatePropagation(), this.stopPropagation();
      }
    }, u.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(s, d) {
      u.event.special[s] = {
        delegateType: d,
        bindType: d,
        handle: function(w) {
          var y, E = this, b = w.relatedTarget, H = w.handleObj;
          return (!b || b !== E && !u.contains(E, b)) && (w.type = H.origType, y = H.handler.apply(this, arguments), w.type = d), y;
        }
      };
    }), g.submit || (u.event.special.submit = {
      setup: function() {
        if (u.nodeName(this, "form"))
          return !1;
        u.event.add(this, "click._submit keypress._submit", function(s) {
          var d = s.target, w = u.nodeName(d, "input") || u.nodeName(d, "button") ? (
            // Support: IE <=8
            // We use jQuery.prop instead of elem.form
            // to allow fixing the IE8 delegated submit issue (gh-2332)
            // by 3rd party polyfills/workarounds.
            u.prop(d, "form")
          ) : void 0;
          w && !u._data(w, "submit") && (u.event.add(w, "submit._submit", function(y) {
            y._submitBubble = !0;
          }), u._data(w, "submit", !0));
        });
      },
      postDispatch: function(s) {
        s._submitBubble && (delete s._submitBubble, this.parentNode && !s.isTrigger && u.event.simulate("submit", this.parentNode, s));
      },
      teardown: function() {
        if (u.nodeName(this, "form"))
          return !1;
        u.event.remove(this, "._submit");
      }
    }), g.change || (u.event.special.change = {
      setup: function() {
        if (hn.test(this.nodeName))
          return (this.type === "checkbox" || this.type === "radio") && (u.event.add(this, "propertychange._change", function(s) {
            s.originalEvent.propertyName === "checked" && (this._justChanged = !0);
          }), u.event.add(this, "click._change", function(s) {
            this._justChanged && !s.isTrigger && (this._justChanged = !1), u.event.simulate("change", this, s);
          })), !1;
        u.event.add(this, "beforeactivate._change", function(s) {
          var d = s.target;
          hn.test(d.nodeName) && !u._data(d, "change") && (u.event.add(d, "change._change", function(w) {
            this.parentNode && !w.isSimulated && !w.isTrigger && u.event.simulate("change", this.parentNode, w);
          }), u._data(d, "change", !0));
        });
      },
      handle: function(s) {
        var d = s.target;
        if (this !== d || s.isSimulated || s.isTrigger || d.type !== "radio" && d.type !== "checkbox")
          return s.handleObj.handler.apply(this, arguments);
      },
      teardown: function() {
        return u.event.remove(this, "._change"), !hn.test(this.nodeName);
      }
    }), g.focusin || u.each({ focus: "focusin", blur: "focusout" }, function(s, d) {
      var w = function(y) {
        u.event.simulate(d, y.target, u.event.fix(y));
      };
      u.event.special[d] = {
        setup: function() {
          var y = this.ownerDocument || this, E = u._data(y, d);
          E || y.addEventListener(s, w, !0), u._data(y, d, (E || 0) + 1);
        },
        teardown: function() {
          var y = this.ownerDocument || this, E = u._data(y, d) - 1;
          E ? u._data(y, d, E) : (y.removeEventListener(s, w, !0), u._removeData(y, d));
        }
      };
    }), u.fn.extend({
      on: function(s, d, w, y) {
        return ve(this, s, d, w, y);
      },
      one: function(s, d, w, y) {
        return ve(this, s, d, w, y, 1);
      },
      off: function(s, d, w) {
        var y, E;
        if (s && s.preventDefault && s.handleObj)
          return y = s.handleObj, u(s.delegateTarget).off(
            y.namespace ? y.origType + "." + y.namespace : y.origType,
            y.selector,
            y.handler
          ), this;
        if (typeof s == "object") {
          for (E in s)
            this.off(E, d, s[E]);
          return this;
        }
        return (d === !1 || typeof d == "function") && (w = d, d = void 0), w === !1 && (w = DA), this.each(function() {
          u.event.remove(this, s, w, d);
        });
      },
      trigger: function(s, d) {
        return this.each(function() {
          u.event.trigger(s, d, this);
        });
      },
      triggerHandler: function(s, d) {
        var w = this[0];
        if (w)
          return u.event.trigger(s, d, w, !0);
      }
    });
    var ye = / jQuery\d+="(?:null|\d+)"/g, ut = new RegExp("<(?:" + Te + ")[\\s/>]", "i"), xt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, xn = /<script|<style|<link/i, Ii = /checked\s*(?:[^=]|=\s*.checked.)/i, In = /^true\/(.*)/, Hi = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, jr = $e(i), dn = jr.appendChild(i.createElement("div"));
    function Si(s, d) {
      return u.nodeName(s, "table") && u.nodeName(d.nodeType !== 11 ? d : d.firstChild, "tr") ? s.getElementsByTagName("tbody")[0] || s.appendChild(s.ownerDocument.createElement("tbody")) : s;
    }
    function Yr(s) {
      return s.type = (u.find.attr(s, "type") !== null) + "/" + s.type, s;
    }
    function yr(s) {
      var d = In.exec(s.type);
      return d ? s.type = d[1] : s.removeAttribute("type"), s;
    }
    function Ys(s, d) {
      if (!(d.nodeType !== 1 || !u.hasData(s))) {
        var w, y, E, b = u._data(s), H = u._data(d, b), K = b.events;
        if (K) {
          delete H.handle, H.events = {};
          for (w in K)
            for (y = 0, E = K[w].length; y < E; y++)
              u.event.add(d, w, K[w][y]);
        }
        H.data && (H.data = u.extend({}, H.data));
      }
    }
    function vo(s, d) {
      var w, y, E;
      if (d.nodeType === 1) {
        if (w = d.nodeName.toLowerCase(), !g.noCloneEvent && d[u.expando]) {
          E = u._data(d);
          for (y in E.events)
            u.removeEvent(d, y, E.handle);
          d.removeAttribute(u.expando);
        }
        w === "script" && d.text !== s.text ? (Yr(d).text = s.text, yr(d)) : w === "object" ? (d.parentNode && (d.outerHTML = s.outerHTML), g.html5Clone && s.innerHTML && !u.trim(d.innerHTML) && (d.innerHTML = s.innerHTML)) : w === "input" && te.test(s.type) ? (d.defaultChecked = d.checked = s.checked, d.value !== s.value && (d.value = s.value)) : w === "option" ? d.defaultSelected = d.selected = s.defaultSelected : (w === "input" || w === "textarea") && (d.defaultValue = s.defaultValue);
      }
    }
    function Cr(s, d, w, y) {
      d = l.apply([], d);
      var E, b, H, K, W, q, AA = 0, mA = s.length, SA = mA - 1, yA = d[0], ie = u.isFunction(yA);
      if (ie || mA > 1 && typeof yA == "string" && !g.checkClone && Ii.test(yA))
        return s.each(function(YA) {
          var ue = s.eq(YA);
          ie && (d[0] = yA.call(this, YA, ue.html())), Cr(ue, d, w, y);
        });
      if (mA && (q = mt(d, s[0].ownerDocument, !1, s, y), E = q.firstChild, q.childNodes.length === 1 && (q = E), E || y)) {
        for (K = u.map(_e(q, "script"), Yr), H = K.length; AA < mA; AA++)
          b = q, AA !== SA && (b = u.clone(b, !0, !0), H && u.merge(K, _e(b, "script"))), w.call(s[AA], b, AA);
        if (H)
          for (W = K[K.length - 1].ownerDocument, u.map(K, yr), AA = 0; AA < H; AA++)
            b = K[AA], Ue.test(b.type || "") && !u._data(b, "globalEval") && u.contains(W, b) && (b.src ? u._evalUrl && u._evalUrl(b.src) : u.globalEval(
              (b.text || b.textContent || b.innerHTML || "").replace(Hi, "")
            ));
        q = E = null;
      }
      return s;
    }
    function ha(s, d, w) {
      for (var y, E = d ? u.filter(d, s) : s, b = 0; (y = E[b]) != null; b++)
        !w && y.nodeType === 1 && u.cleanData(_e(y)), y.parentNode && (w && u.contains(y.ownerDocument, y) && Mt(_e(y, "script")), y.parentNode.removeChild(y));
      return s;
    }
    u.extend({
      htmlPrefilter: function(s) {
        return s.replace(xt, "<$1></$2>");
      },
      clone: function(s, d, w) {
        var y, E, b, H, K, W = u.contains(s.ownerDocument, s);
        if (g.html5Clone || u.isXMLDoc(s) || !ut.test("<" + s.nodeName + ">") ? b = s.cloneNode(!0) : (dn.innerHTML = s.outerHTML, dn.removeChild(b = dn.firstChild)), (!g.noCloneEvent || !g.noCloneChecked) && (s.nodeType === 1 || s.nodeType === 11) && !u.isXMLDoc(s))
          for (y = _e(b), K = _e(s), H = 0; (E = K[H]) != null; ++H)
            y[H] && vo(E, y[H]);
        if (d)
          if (w)
            for (K = K || _e(s), y = y || _e(b), H = 0; (E = K[H]) != null; H++)
              Ys(E, y[H]);
          else
            Ys(s, b);
        return y = _e(b, "script"), y.length > 0 && Mt(y, !W && _e(s, "script")), y = K = E = null, b;
      },
      cleanData: function(s, d) {
        for (var w, y, E, b, H = 0, K = u.expando, W = u.cache, q = g.attributes, AA = u.event.special; (w = s[H]) != null; H++)
          if ((d || j(w)) && (E = w[K], b = E && W[E], b)) {
            if (b.events)
              for (y in b.events)
                AA[y] ? u.event.remove(w, y) : u.removeEvent(w, y, b.handle);
            W[E] && (delete W[E], !q && typeof w.removeAttribute < "u" ? w.removeAttribute(K) : w[K] = void 0, n.push(E));
          }
      }
    }), u.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: Cr,
      detach: function(s) {
        return ha(this, s, !0);
      },
      remove: function(s) {
        return ha(this, s);
      },
      text: function(s) {
        return bA(this, function(d) {
          return d === void 0 ? u.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || i).createTextNode(d)
          );
        }, null, s, arguments.length);
      },
      append: function() {
        return Cr(this, arguments, function(s) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Si(this, s);
            d.appendChild(s);
          }
        });
      },
      prepend: function() {
        return Cr(this, arguments, function(s) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Si(this, s);
            d.insertBefore(s, d.firstChild);
          }
        });
      },
      before: function() {
        return Cr(this, arguments, function(s) {
          this.parentNode && this.parentNode.insertBefore(s, this);
        });
      },
      after: function() {
        return Cr(this, arguments, function(s) {
          this.parentNode && this.parentNode.insertBefore(s, this.nextSibling);
        });
      },
      empty: function() {
        for (var s, d = 0; (s = this[d]) != null; d++) {
          for (s.nodeType === 1 && u.cleanData(_e(s, !1)); s.firstChild; )
            s.removeChild(s.firstChild);
          s.options && u.nodeName(s, "select") && (s.options.length = 0);
        }
        return this;
      },
      clone: function(s, d) {
        return s = s ?? !1, d = d ?? s, this.map(function() {
          return u.clone(this, s, d);
        });
      },
      html: function(s) {
        return bA(this, function(d) {
          var w = this[0] || {}, y = 0, E = this.length;
          if (d === void 0)
            return w.nodeType === 1 ? w.innerHTML.replace(ye, "") : void 0;
          if (typeof d == "string" && !xn.test(d) && (g.htmlSerialize || !ut.test(d)) && (g.leadingWhitespace || !Ze.test(d)) && !Pe[(me.exec(d) || ["", ""])[1].toLowerCase()]) {
            d = u.htmlPrefilter(d);
            try {
              for (; y < E; y++)
                w = this[y] || {}, w.nodeType === 1 && (u.cleanData(_e(w, !1)), w.innerHTML = d);
              w = 0;
            } catch {
            }
          }
          w && this.empty().append(d);
        }, null, s, arguments.length);
      },
      replaceWith: function() {
        var s = [];
        return Cr(this, arguments, function(d) {
          var w = this.parentNode;
          u.inArray(this, s) < 0 && (u.cleanData(_e(this)), w && w.replaceChild(d, this));
        }, s);
      }
    }), u.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(s, d) {
      u.fn[s] = function(w) {
        for (var y, E = 0, b = [], H = u(w), K = H.length - 1; E <= K; E++)
          y = E === K ? this : this.clone(!0), u(H[E])[d](y), f.apply(b, y.get());
        return this.pushStack(b);
      };
    });
    var Li, Zs = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function Au(s, d) {
      var w = u(d.createElement(s)).appendTo(d.body), y = u.css(w[0], "display");
      return w.detach(), y;
    }
    function da(s) {
      var d = i, w = Zs[s];
      return w || (w = Au(s, d), (w === "none" || !w) && (Li = (Li || u("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (Li[0].contentWindow || Li[0].contentDocument).document, d.write(), d.close(), w = Au(s, d), Li.detach()), Zs[s] = w), w;
    }
    var eu = /^margin/, pa = new RegExp("^(" + ne + ")(?!px)[a-z%]+$", "i"), yo = function(s, d, w, y) {
      var E, b, H = {};
      for (b in d)
        H[b] = s.style[b], s.style[b] = d[b];
      E = w.apply(s, y || []);
      for (b in d)
        s.style[b] = H[b];
      return E;
    }, tu = i.documentElement;
    (function() {
      var s, d, w, y, E, b, H = i.createElement("div"), K = i.createElement("div");
      if (!K.style)
        return;
      K.style.cssText = "float:left;opacity:.5", g.opacity = K.style.opacity === "0.5", g.cssFloat = !!K.style.cssFloat, K.style.backgroundClip = "content-box", K.cloneNode(!0).style.backgroundClip = "", g.clearCloneStyle = K.style.backgroundClip === "content-box", H = i.createElement("div"), H.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", K.innerHTML = "", H.appendChild(K), g.boxSizing = K.style.boxSizing === "" || K.style.MozBoxSizing === "" || K.style.WebkitBoxSizing === "", u.extend(g, {
        reliableHiddenOffsets: function() {
          return s == null && W(), y;
        },
        boxSizingReliable: function() {
          return s == null && W(), w;
        },
        pixelMarginRight: function() {
          return s == null && W(), d;
        },
        pixelPosition: function() {
          return s == null && W(), s;
        },
        reliableMarginRight: function() {
          return s == null && W(), E;
        },
        reliableMarginLeft: function() {
          return s == null && W(), b;
        }
      });
      function W() {
        var q, AA, mA = i.documentElement;
        mA.appendChild(H), K.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", s = w = b = !1, d = E = !0, e.getComputedStyle && (AA = e.getComputedStyle(K), s = (AA || {}).top !== "1%", b = (AA || {}).marginLeft === "2px", w = (AA || { width: "4px" }).width === "4px", K.style.marginRight = "50%", d = (AA || { marginRight: "4px" }).marginRight === "4px", q = K.appendChild(i.createElement("div")), q.style.cssText = K.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", q.style.marginRight = q.style.width = "0", K.style.width = "1px", E = !parseFloat((e.getComputedStyle(q) || {}).marginRight), K.removeChild(q)), K.style.display = "none", y = K.getClientRects().length === 0, y && (K.style.display = "", K.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", K.childNodes[0].style.borderCollapse = "separate", q = K.getElementsByTagName("td"), q[0].style.cssText = "margin:0;border:0;padding:0;display:none", y = q[0].offsetHeight === 0, y && (q[0].style.display = "", q[1].style.display = "none", y = q[0].offsetHeight === 0)), mA.removeChild(H);
      }
    })();
    var Yn, Zn, Yc = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (Yn = function(s) {
      var d = s.ownerDocument.defaultView;
      return (!d || !d.opener) && (d = e), d.getComputedStyle(s);
    }, Zn = function(s, d, w) {
      var y, E, b, H, K = s.style;
      return w = w || Yn(s), H = w ? w.getPropertyValue(d) || w[d] : void 0, (H === "" || H === void 0) && !u.contains(s.ownerDocument, s) && (H = u.style(s, d)), w && !g.pixelMarginRight() && pa.test(H) && eu.test(d) && (y = K.width, E = K.minWidth, b = K.maxWidth, K.minWidth = K.maxWidth = K.width = H, H = w.width, K.width = y, K.minWidth = E, K.maxWidth = b), H === void 0 ? H : H + "";
    }) : tu.currentStyle && (Yn = function(s) {
      return s.currentStyle;
    }, Zn = function(s, d, w) {
      var y, E, b, H, K = s.style;
      return w = w || Yn(s), H = w ? w[d] : void 0, H == null && K && K[d] && (H = K[d]), pa.test(H) && !Yc.test(d) && (y = K.left, E = s.runtimeStyle, b = E && E.left, b && (E.left = s.currentStyle.left), K.left = d === "fontSize" ? "1em" : H, H = K.pixelLeft + "px", K.left = y, b && (E.left = b)), H === void 0 ? H : H + "" || "auto";
    });
    function Co(s, d) {
      return {
        get: function() {
          if (s()) {
            delete this.get;
            return;
          }
          return (this.get = d).apply(this, arguments);
        }
      };
    }
    var Qo = /alpha\([^)]*\)/i, Zc = /opacity\s*=\s*([^)]*)/i, Af = /^(none|table(?!-c[ea]).+)/, ga = new RegExp("^(" + ne + ")(.*)$", "i"), ef = { position: "absolute", visibility: "hidden", display: "block" }, Ti = {
      letterSpacing: "0",
      fontWeight: "400"
    }, nu = ["Webkit", "O", "Moz", "ms"], ru = i.createElement("div").style;
    function iu(s) {
      if (s in ru)
        return s;
      for (var d = s.charAt(0).toUpperCase() + s.slice(1), w = nu.length; w--; )
        if (s = nu[w] + d, s in ru)
          return s;
    }
    function Fo(s, d) {
      for (var w, y, E, b = [], H = 0, K = s.length; H < K; H++)
        y = s[H], y.style && (b[H] = u._data(y, "olddisplay"), w = y.style.display, d ? (!b[H] && w === "none" && (y.style.display = ""), y.style.display === "" && sA(y) && (b[H] = u._data(y, "olddisplay", da(y.nodeName)))) : (E = sA(y), (w && w !== "none" || !E) && u._data(
          y,
          "olddisplay",
          E ? w : u.css(y, "display")
        )));
      for (H = 0; H < K; H++)
        y = s[H], y.style && (!d || y.style.display === "none" || y.style.display === "") && (y.style.display = d ? b[H] || "" : "none");
      return s;
    }
    function Uo(s, d, w) {
      var y = ga.exec(d);
      return y ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, y[1] - (w || 0)) + (y[2] || "px")
      ) : d;
    }
    function Eo(s, d, w, y, E) {
      for (var b = w === (y ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        d === "width" ? 1 : 0
      ), H = 0; b < 4; b += 2)
        w === "margin" && (H += u.css(s, w + RA[b], !0, E)), y ? (w === "content" && (H -= u.css(s, "padding" + RA[b], !0, E)), w !== "margin" && (H -= u.css(s, "border" + RA[b] + "Width", !0, E))) : (H += u.css(s, "padding" + RA[b], !0, E), w !== "padding" && (H += u.css(s, "border" + RA[b] + "Width", !0, E)));
      return H;
    }
    function au(s, d, w) {
      var y = !0, E = d === "width" ? s.offsetWidth : s.offsetHeight, b = Yn(s), H = g.boxSizing && u.css(s, "boxSizing", !1, b) === "border-box";
      if (E <= 0 || E == null) {
        if (E = Zn(s, d, b), (E < 0 || E == null) && (E = s.style[d]), pa.test(E))
          return E;
        y = H && (g.boxSizingReliable() || E === s.style[d]), E = parseFloat(E) || 0;
      }
      return E + Eo(
        s,
        d,
        w || (H ? "border" : "content"),
        y,
        b
      ) + "px";
    }
    u.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
        opacity: {
          get: function(s, d) {
            if (d) {
              var w = Zn(s, "opacity");
              return w === "" ? "1" : w;
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
        float: g.cssFloat ? "cssFloat" : "styleFloat"
      },
      // Get and set the style property on a DOM Node
      style: function(s, d, w, y) {
        if (!(!s || s.nodeType === 3 || s.nodeType === 8 || !s.style)) {
          var E, b, H, K = u.camelCase(d), W = s.style;
          if (d = u.cssProps[K] || (u.cssProps[K] = iu(K) || K), H = u.cssHooks[d] || u.cssHooks[K], w !== void 0) {
            if (b = typeof w, b === "string" && (E = JA.exec(w)) && E[1] && (w = vA(s, d, E), b = "number"), w == null || w !== w)
              return;
            if (b === "number" && (w += E && E[3] || (u.cssNumber[K] ? "" : "px")), !g.clearCloneStyle && w === "" && d.indexOf("background") === 0 && (W[d] = "inherit"), !H || !("set" in H) || (w = H.set(s, w, y)) !== void 0)
              try {
                W[d] = w;
              } catch {
              }
          } else
            return H && "get" in H && (E = H.get(s, !1, y)) !== void 0 ? E : W[d];
        }
      },
      css: function(s, d, w, y) {
        var E, b, H, K = u.camelCase(d);
        return d = u.cssProps[K] || (u.cssProps[K] = iu(K) || K), H = u.cssHooks[d] || u.cssHooks[K], H && "get" in H && (b = H.get(s, !0, w)), b === void 0 && (b = Zn(s, d, y)), b === "normal" && d in Ti && (b = Ti[d]), w === "" || w ? (E = parseFloat(b), w === !0 || isFinite(E) ? E || 0 : b) : b;
      }
    }), u.each(["height", "width"], function(s, d) {
      u.cssHooks[d] = {
        get: function(w, y, E) {
          if (y)
            return Af.test(u.css(w, "display")) && w.offsetWidth === 0 ? yo(w, ef, function() {
              return au(w, d, E);
            }) : au(w, d, E);
        },
        set: function(w, y, E) {
          var b = E && Yn(w);
          return Uo(
            w,
            y,
            E ? Eo(
              w,
              d,
              E,
              g.boxSizing && u.css(w, "boxSizing", !1, b) === "border-box",
              b
            ) : 0
          );
        }
      };
    }), g.opacity || (u.cssHooks.opacity = {
      get: function(s, d) {
        return Zc.test((d && s.currentStyle ? s.currentStyle.filter : s.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : d ? "1" : "";
      },
      set: function(s, d) {
        var w = s.style, y = s.currentStyle, E = u.isNumeric(d) ? "alpha(opacity=" + d * 100 + ")" : "", b = y && y.filter || w.filter || "";
        w.zoom = 1, !((d >= 1 || d === "") && u.trim(b.replace(Qo, "")) === "" && w.removeAttribute && (w.removeAttribute("filter"), d === "" || y && !y.filter)) && (w.filter = Qo.test(b) ? b.replace(Qo, E) : b + " " + E);
      }
    }), u.cssHooks.marginRight = Co(
      g.reliableMarginRight,
      function(s, d) {
        if (d)
          return yo(
            s,
            { display: "inline-block" },
            Zn,
            [s, "marginRight"]
          );
      }
    ), u.cssHooks.marginLeft = Co(
      g.reliableMarginLeft,
      function(s, d) {
        if (d)
          return (parseFloat(Zn(s, "marginLeft")) || // Support: IE<=11+
          // Running getBoundingClientRect on a disconnected node in IE throws an error
          // Support: IE8 only
          // getClientRects() errors on disconnected elems
          (u.contains(s.ownerDocument, s) ? s.getBoundingClientRect().left - yo(s, { marginLeft: 0 }, function() {
            return s.getBoundingClientRect().left;
          }) : 0)) + "px";
      }
    ), u.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(s, d) {
      u.cssHooks[s + d] = {
        expand: function(w) {
          for (var y = 0, E = {}, b = typeof w == "string" ? w.split(" ") : [w]; y < 4; y++)
            E[s + RA[y] + d] = b[y] || b[y - 2] || b[0];
          return E;
        }
      }, eu.test(s) || (u.cssHooks[s + d].set = Uo);
    }), u.fn.extend({
      css: function(s, d) {
        return bA(this, function(w, y, E) {
          var b, H, K = {}, W = 0;
          if (u.isArray(y)) {
            for (b = Yn(w), H = y.length; W < H; W++)
              K[y[W]] = u.css(w, y[W], !1, b);
            return K;
          }
          return E !== void 0 ? u.style(w, y, E) : u.css(w, y);
        }, s, d, arguments.length > 1);
      },
      show: function() {
        return Fo(this, !0);
      },
      hide: function() {
        return Fo(this);
      },
      toggle: function(s) {
        return typeof s == "boolean" ? s ? this.show() : this.hide() : this.each(function() {
          sA(this) ? u(this).show() : u(this).hide();
        });
      }
    });
    function It(s, d, w, y, E) {
      return new It.prototype.init(s, d, w, y, E);
    }
    u.Tween = It, It.prototype = {
      constructor: It,
      init: function(s, d, w, y, E, b) {
        this.elem = s, this.prop = w, this.easing = E || u.easing._default, this.options = d, this.start = this.now = this.cur(), this.end = y, this.unit = b || (u.cssNumber[w] ? "" : "px");
      },
      cur: function() {
        var s = It.propHooks[this.prop];
        return s && s.get ? s.get(this) : It.propHooks._default.get(this);
      },
      run: function(s) {
        var d, w = It.propHooks[this.prop];
        return this.options.duration ? this.pos = d = u.easing[this.easing](
          s,
          this.options.duration * s,
          0,
          1,
          this.options.duration
        ) : this.pos = d = s, this.now = (this.end - this.start) * d + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), w && w.set ? w.set(this) : It.propHooks._default.set(this), this;
      }
    }, It.prototype.init.prototype = It.prototype, It.propHooks = {
      _default: {
        get: function(s) {
          var d;
          return s.elem.nodeType !== 1 || s.elem[s.prop] != null && s.elem.style[s.prop] == null ? s.elem[s.prop] : (d = u.css(s.elem, s.prop, ""), !d || d === "auto" ? 0 : d);
        },
        set: function(s) {
          u.fx.step[s.prop] ? u.fx.step[s.prop](s) : s.elem.nodeType === 1 && (s.elem.style[u.cssProps[s.prop]] != null || u.cssHooks[s.prop]) ? u.style(s.elem, s.prop, s.now + s.unit) : s.elem[s.prop] = s.now;
        }
      }
    }, It.propHooks.scrollTop = It.propHooks.scrollLeft = {
      set: function(s) {
        s.elem.nodeType && s.elem.parentNode && (s.elem[s.prop] = s.now);
      }
    }, u.easing = {
      linear: function(s) {
        return s;
      },
      swing: function(s) {
        return 0.5 - Math.cos(s * Math.PI) / 2;
      },
      _default: "swing"
    }, u.fx = It.prototype.init, u.fx.step = {};
    var Zr, Ba, ou = /^(?:toggle|show|hide)$/, su = /queueHooks$/;
    function bo() {
      return e.setTimeout(function() {
        Zr = void 0;
      }), Zr = u.now();
    }
    function Ai(s, d) {
      var w, y = { height: s }, E = 0;
      for (d = d ? 1 : 0; E < 4; E += 2 - d)
        w = RA[E], y["margin" + w] = y["padding" + w] = s;
      return d && (y.opacity = y.width = s), y;
    }
    function uu(s, d, w) {
      for (var y, E = (qt.tweeners[d] || []).concat(qt.tweeners["*"]), b = 0, H = E.length; b < H; b++)
        if (y = E[b].call(w, d, s))
          return y;
    }
    function lu(s, d, w) {
      var y, E, b, H, K, W, q, AA, mA = this, SA = {}, yA = s.style, ie = s.nodeType && sA(s), YA = u._data(s, "fxshow");
      w.queue || (K = u._queueHooks(s, "fx"), K.unqueued == null && (K.unqueued = 0, W = K.empty.fire, K.empty.fire = function() {
        K.unqueued || W();
      }), K.unqueued++, mA.always(function() {
        mA.always(function() {
          K.unqueued--, u.queue(s, "fx").length || K.empty.fire();
        });
      })), s.nodeType === 1 && ("height" in d || "width" in d) && (w.overflow = [yA.overflow, yA.overflowX, yA.overflowY], q = u.css(s, "display"), AA = q === "none" ? u._data(s, "olddisplay") || da(s.nodeName) : q, AA === "inline" && u.css(s, "float") === "none" && (!g.inlineBlockNeedsLayout || da(s.nodeName) === "inline" ? yA.display = "inline-block" : yA.zoom = 1)), w.overflow && (yA.overflow = "hidden", g.shrinkWrapBlocks() || mA.always(function() {
        yA.overflow = w.overflow[0], yA.overflowX = w.overflow[1], yA.overflowY = w.overflow[2];
      }));
      for (y in d)
        if (E = d[y], ou.exec(E)) {
          if (delete d[y], b = b || E === "toggle", E === (ie ? "hide" : "show"))
            if (E === "show" && YA && YA[y] !== void 0)
              ie = !0;
            else
              continue;
          SA[y] = YA && YA[y] || u.style(s, y);
        } else
          q = void 0;
      if (u.isEmptyObject(SA))
        (q === "none" ? da(s.nodeName) : q) === "inline" && (yA.display = q);
      else {
        YA ? "hidden" in YA && (ie = YA.hidden) : YA = u._data(s, "fxshow", {}), b && (YA.hidden = !ie), ie ? u(s).show() : mA.done(function() {
          u(s).hide();
        }), mA.done(function() {
          var ue;
          u._removeData(s, "fxshow");
          for (ue in SA)
            u.style(s, ue, SA[ue]);
        });
        for (y in SA)
          H = uu(ie ? YA[y] : 0, y, mA), y in YA || (YA[y] = H.start, ie && (H.end = H.start, H.start = y === "width" || y === "height" ? 1 : 0));
      }
    }
    function wa(s, d) {
      var w, y, E, b, H;
      for (w in s)
        if (y = u.camelCase(w), E = d[y], b = s[w], u.isArray(b) && (E = b[1], b = s[w] = b[0]), w !== y && (s[y] = b, delete s[w]), H = u.cssHooks[y], H && "expand" in H) {
          b = H.expand(b), delete s[y];
          for (w in b)
            w in s || (s[w] = b[w], d[w] = E);
        } else
          d[y] = E;
    }
    function qt(s, d, w) {
      var y, E, b = 0, H = qt.prefilters.length, K = u.Deferred().always(function() {
        delete W.elem;
      }), W = function() {
        if (E)
          return !1;
        for (var mA = Zr || bo(), SA = Math.max(0, q.startTime + q.duration - mA), yA = SA / q.duration || 0, ie = 1 - yA, YA = 0, ue = q.tweens.length; YA < ue; YA++)
          q.tweens[YA].run(ie);
        return K.notifyWith(s, [q, ie, SA]), ie < 1 && ue ? SA : (K.resolveWith(s, [q]), !1);
      }, q = K.promise({
        elem: s,
        props: u.extend({}, d),
        opts: u.extend(!0, {
          specialEasing: {},
          easing: u.easing._default
        }, w),
        originalProperties: d,
        originalOptions: w,
        startTime: Zr || bo(),
        duration: w.duration,
        tweens: [],
        createTween: function(mA, SA) {
          var yA = u.Tween(
            s,
            q.opts,
            mA,
            SA,
            q.opts.specialEasing[mA] || q.opts.easing
          );
          return q.tweens.push(yA), yA;
        },
        stop: function(mA) {
          var SA = 0, yA = mA ? q.tweens.length : 0;
          if (E)
            return this;
          for (E = !0; SA < yA; SA++)
            q.tweens[SA].run(1);
          return mA ? (K.notifyWith(s, [q, 1, 0]), K.resolveWith(s, [q, mA])) : K.rejectWith(s, [q, mA]), this;
        }
      }), AA = q.props;
      for (wa(AA, q.opts.specialEasing); b < H; b++)
        if (y = qt.prefilters[b].call(q, s, AA, q.opts), y)
          return u.isFunction(y.stop) && (u._queueHooks(q.elem, q.opts.queue).stop = u.proxy(y.stop, y)), y;
      return u.map(AA, uu, q), u.isFunction(q.opts.start) && q.opts.start.call(s, q), u.fx.timer(
        u.extend(W, {
          elem: s,
          anim: q,
          queue: q.opts.queue
        })
      ), q.progress(q.opts.progress).done(q.opts.done, q.opts.complete).fail(q.opts.fail).always(q.opts.always);
    }
    u.Animation = u.extend(qt, {
      tweeners: {
        "*": [function(s, d) {
          var w = this.createTween(s, d);
          return vA(w.elem, s, JA.exec(d), w), w;
        }]
      },
      tweener: function(s, d) {
        u.isFunction(s) ? (d = s, s = ["*"]) : s = s.match(hA);
        for (var w, y = 0, E = s.length; y < E; y++)
          w = s[y], qt.tweeners[w] = qt.tweeners[w] || [], qt.tweeners[w].unshift(d);
      },
      prefilters: [lu],
      prefilter: function(s, d) {
        d ? qt.prefilters.unshift(s) : qt.prefilters.push(s);
      }
    }), u.speed = function(s, d, w) {
      var y = s && typeof s == "object" ? u.extend({}, s) : {
        complete: w || !w && d || u.isFunction(s) && s,
        duration: s,
        easing: w && d || d && !u.isFunction(d) && d
      };
      return y.duration = u.fx.off ? 0 : typeof y.duration == "number" ? y.duration : y.duration in u.fx.speeds ? u.fx.speeds[y.duration] : u.fx.speeds._default, (y.queue == null || y.queue === !0) && (y.queue = "fx"), y.old = y.complete, y.complete = function() {
        u.isFunction(y.old) && y.old.call(this), y.queue && u.dequeue(this, y.queue);
      }, y;
    }, u.fn.extend({
      fadeTo: function(s, d, w, y) {
        return this.filter(sA).css("opacity", 0).show().end().animate({ opacity: d }, s, w, y);
      },
      animate: function(s, d, w, y) {
        var E = u.isEmptyObject(s), b = u.speed(d, w, y), H = function() {
          var K = qt(this, u.extend({}, s), b);
          (E || u._data(this, "finish")) && K.stop(!0);
        };
        return H.finish = H, E || b.queue === !1 ? this.each(H) : this.queue(b.queue, H);
      },
      stop: function(s, d, w) {
        var y = function(E) {
          var b = E.stop;
          delete E.stop, b(w);
        };
        return typeof s != "string" && (w = d, d = s, s = void 0), d && s !== !1 && this.queue(s || "fx", []), this.each(function() {
          var E = !0, b = s != null && s + "queueHooks", H = u.timers, K = u._data(this);
          if (b)
            K[b] && K[b].stop && y(K[b]);
          else
            for (b in K)
              K[b] && K[b].stop && su.test(b) && y(K[b]);
          for (b = H.length; b--; )
            H[b].elem === this && (s == null || H[b].queue === s) && (H[b].anim.stop(w), E = !1, H.splice(b, 1));
          (E || !w) && u.dequeue(this, s);
        });
      },
      finish: function(s) {
        return s !== !1 && (s = s || "fx"), this.each(function() {
          var d, w = u._data(this), y = w[s + "queue"], E = w[s + "queueHooks"], b = u.timers, H = y ? y.length : 0;
          for (w.finish = !0, u.queue(this, s, []), E && E.stop && E.stop.call(this, !0), d = b.length; d--; )
            b[d].elem === this && b[d].queue === s && (b[d].anim.stop(!0), b.splice(d, 1));
          for (d = 0; d < H; d++)
            y[d] && y[d].finish && y[d].finish.call(this);
          delete w.finish;
        });
      }
    }), u.each(["toggle", "show", "hide"], function(s, d) {
      var w = u.fn[d];
      u.fn[d] = function(y, E, b) {
        return y == null || typeof y == "boolean" ? w.apply(this, arguments) : this.animate(Ai(d, !0), y, E, b);
      };
    }), u.each({
      slideDown: Ai("show"),
      slideUp: Ai("hide"),
      slideToggle: Ai("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(s, d) {
      u.fn[s] = function(w, y, E) {
        return this.animate(d, w, y, E);
      };
    }), u.timers = [], u.fx.tick = function() {
      var s, d = u.timers, w = 0;
      for (Zr = u.now(); w < d.length; w++)
        s = d[w], !s() && d[w] === s && d.splice(w--, 1);
      d.length || u.fx.stop(), Zr = void 0;
    }, u.fx.timer = function(s) {
      u.timers.push(s), s() ? u.fx.start() : u.timers.pop();
    }, u.fx.interval = 13, u.fx.start = function() {
      Ba || (Ba = e.setInterval(u.fx.tick, u.fx.interval));
    }, u.fx.stop = function() {
      e.clearInterval(Ba), Ba = null;
    }, u.fx.speeds = {
      slow: 600,
      fast: 200,
      // Default speed
      _default: 400
    }, u.fn.delay = function(s, d) {
      return s = u.fx && u.fx.speeds[s] || s, d = d || "fx", this.queue(d, function(w, y) {
        var E = e.setTimeout(w, s);
        y.stop = function() {
          e.clearTimeout(E);
        };
      });
    }, function() {
      var s, d = i.createElement("input"), w = i.createElement("div"), y = i.createElement("select"), E = y.appendChild(i.createElement("option"));
      w = i.createElement("div"), w.setAttribute("className", "t"), w.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", s = w.getElementsByTagName("a")[0], d.setAttribute("type", "checkbox"), w.appendChild(d), s = w.getElementsByTagName("a")[0], s.style.cssText = "top:1px", g.getSetAttribute = w.className !== "t", g.style = /top/.test(s.getAttribute("style")), g.hrefNormalized = s.getAttribute("href") === "/a", g.checkOn = !!d.value, g.optSelected = E.selected, g.enctype = !!i.createElement("form").enctype, y.disabled = !0, g.optDisabled = !E.disabled, d = i.createElement("input"), d.setAttribute("value", ""), g.input = d.getAttribute("value") === "", d.value = "t", d.setAttribute("type", "radio"), g.radioValue = d.value === "t";
    }();
    var tf = /\r/g, cu = /[\x20\t\r\n\f]+/g;
    u.fn.extend({
      val: function(s) {
        var d, w, y, E = this[0];
        return arguments.length ? (y = u.isFunction(s), this.each(function(b) {
          var H;
          this.nodeType === 1 && (y ? H = s.call(this, b, u(this).val()) : H = s, H == null ? H = "" : typeof H == "number" ? H += "" : u.isArray(H) && (H = u.map(H, function(K) {
            return K == null ? "" : K + "";
          })), d = u.valHooks[this.type] || u.valHooks[this.nodeName.toLowerCase()], (!d || !("set" in d) || d.set(this, H, "value") === void 0) && (this.value = H));
        })) : E ? (d = u.valHooks[E.type] || u.valHooks[E.nodeName.toLowerCase()], d && "get" in d && (w = d.get(E, "value")) !== void 0 ? w : (w = E.value, typeof w == "string" ? (
          // handle most common string cases
          w.replace(tf, "")
        ) : (
          // handle cases where value is null/undef or number
          w ?? ""
        ))) : void 0;
      }
    }), u.extend({
      valHooks: {
        option: {
          get: function(s) {
            var d = u.find.attr(s, "value");
            return d ?? // Support: IE10-11+
            // option.text throws exceptions (#14686, #14858)
            // Strip and collapse whitespace
            // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
            u.trim(u.text(s)).replace(cu, " ");
          }
        },
        select: {
          get: function(s) {
            for (var d, w, y = s.options, E = s.selectedIndex, b = s.type === "select-one" || E < 0, H = b ? null : [], K = b ? E + 1 : y.length, W = E < 0 ? K : b ? E : 0; W < K; W++)
              if (w = y[W], (w.selected || W === E) && // Don't return options that are disabled or in a disabled optgroup
              (g.optDisabled ? !w.disabled : w.getAttribute("disabled") === null) && (!w.parentNode.disabled || !u.nodeName(w.parentNode, "optgroup"))) {
                if (d = u(w).val(), b)
                  return d;
                H.push(d);
              }
            return H;
          },
          set: function(s, d) {
            for (var w, y, E = s.options, b = u.makeArray(d), H = E.length; H--; )
              if (y = E[H], u.inArray(u.valHooks.option.get(y), b) > -1)
                try {
                  y.selected = w = !0;
                } catch {
                  y.scrollHeight;
                }
              else
                y.selected = !1;
            return w || (s.selectedIndex = -1), E;
          }
        }
      }
    }), u.each(["radio", "checkbox"], function() {
      u.valHooks[this] = {
        set: function(s, d) {
          if (u.isArray(d))
            return s.checked = u.inArray(u(s).val(), d) > -1;
        }
      }, g.checkOn || (u.valHooks[this].get = function(s) {
        return s.getAttribute("value") === null ? "on" : s.value;
      });
    });
    var Qr, ma, Hn = u.expr.attrHandle, va = /^(?:checked|selected)$/i, Sn = g.getSetAttribute, ei = g.input;
    u.fn.extend({
      attr: function(s, d) {
        return bA(this, u.attr, s, d, arguments.length > 1);
      },
      removeAttr: function(s) {
        return this.each(function() {
          u.removeAttr(this, s);
        });
      }
    }), u.extend({
      attr: function(s, d, w) {
        var y, E, b = s.nodeType;
        if (!(b === 3 || b === 8 || b === 2)) {
          if (typeof s.getAttribute > "u")
            return u.prop(s, d, w);
          if ((b !== 1 || !u.isXMLDoc(s)) && (d = d.toLowerCase(), E = u.attrHooks[d] || (u.expr.match.bool.test(d) ? ma : Qr)), w !== void 0) {
            if (w === null) {
              u.removeAttr(s, d);
              return;
            }
            return E && "set" in E && (y = E.set(s, w, d)) !== void 0 ? y : (s.setAttribute(d, w + ""), w);
          }
          return E && "get" in E && (y = E.get(s, d)) !== null ? y : (y = u.find.attr(s, d), y ?? void 0);
        }
      },
      attrHooks: {
        type: {
          set: function(s, d) {
            if (!g.radioValue && d === "radio" && u.nodeName(s, "input")) {
              var w = s.value;
              return s.setAttribute("type", d), w && (s.value = w), d;
            }
          }
        }
      },
      removeAttr: function(s, d) {
        var w, y, E = 0, b = d && d.match(hA);
        if (b && s.nodeType === 1)
          for (; w = b[E++]; )
            y = u.propFix[w] || w, u.expr.match.bool.test(w) ? ei && Sn || !va.test(w) ? s[y] = !1 : s[u.camelCase("default-" + w)] = s[y] = !1 : u.attr(s, w, ""), s.removeAttribute(Sn ? w : y);
      }
    }), ma = {
      set: function(s, d, w) {
        return d === !1 ? u.removeAttr(s, w) : ei && Sn || !va.test(w) ? s.setAttribute(!Sn && u.propFix[w] || w, w) : s[u.camelCase("default-" + w)] = s[w] = !0, w;
      }
    }, u.each(u.expr.match.bool.source.match(/\w+/g), function(s, d) {
      var w = Hn[d] || u.find.attr;
      ei && Sn || !va.test(d) ? Hn[d] = function(y, E, b) {
        var H, K;
        return b || (K = Hn[E], Hn[E] = H, H = w(y, E, b) != null ? E.toLowerCase() : null, Hn[E] = K), H;
      } : Hn[d] = function(y, E, b) {
        if (!b)
          return y[u.camelCase("default-" + E)] ? E.toLowerCase() : null;
      };
    }), (!ei || !Sn) && (u.attrHooks.value = {
      set: function(s, d, w) {
        if (u.nodeName(s, "input"))
          s.defaultValue = d;
        else
          return Qr && Qr.set(s, d, w);
      }
    }), Sn || (Qr = {
      set: function(s, d, w) {
        var y = s.getAttributeNode(w);
        if (y || s.setAttributeNode(
          y = s.ownerDocument.createAttribute(w)
        ), y.value = d += "", w === "value" || d === s.getAttribute(w))
          return d;
      }
    }, Hn.id = Hn.name = Hn.coords = function(s, d, w) {
      var y;
      if (!w)
        return (y = s.getAttributeNode(d)) && y.value !== "" ? y.value : null;
    }, u.valHooks.button = {
      get: function(s, d) {
        var w = s.getAttributeNode(d);
        if (w && w.specified)
          return w.value;
      },
      set: Qr.set
    }, u.attrHooks.contenteditable = {
      set: function(s, d, w) {
        Qr.set(s, d === "" ? !1 : d, w);
      }
    }, u.each(["width", "height"], function(s, d) {
      u.attrHooks[d] = {
        set: function(w, y) {
          if (y === "")
            return w.setAttribute(d, "auto"), y;
        }
      };
    })), g.style || (u.attrHooks.style = {
      get: function(s) {
        return s.style.cssText || void 0;
      },
      set: function(s, d) {
        return s.style.cssText = d + "";
      }
    });
    var ti = /^(?:input|select|textarea|button|object)$/i, fu = /^(?:a|area)$/i;
    u.fn.extend({
      prop: function(s, d) {
        return bA(this, u.prop, s, d, arguments.length > 1);
      },
      removeProp: function(s) {
        return s = u.propFix[s] || s, this.each(function() {
          try {
            this[s] = void 0, delete this[s];
          } catch {
          }
        });
      }
    }), u.extend({
      prop: function(s, d, w) {
        var y, E, b = s.nodeType;
        if (!(b === 3 || b === 8 || b === 2))
          return (b !== 1 || !u.isXMLDoc(s)) && (d = u.propFix[d] || d, E = u.propHooks[d]), w !== void 0 ? E && "set" in E && (y = E.set(s, w, d)) !== void 0 ? y : s[d] = w : E && "get" in E && (y = E.get(s, d)) !== null ? y : s[d];
      },
      propHooks: {
        tabIndex: {
          get: function(s) {
            var d = u.find.attr(s, "tabindex");
            return d ? parseInt(d, 10) : ti.test(s.nodeName) || fu.test(s.nodeName) && s.href ? 0 : -1;
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), g.hrefNormalized || u.each(["href", "src"], function(s, d) {
      u.propHooks[d] = {
        get: function(w) {
          return w.getAttribute(d, 4);
        }
      };
    }), g.optSelected || (u.propHooks.selected = {
      get: function(s) {
        var d = s.parentNode;
        return d && (d.selectedIndex, d.parentNode && d.parentNode.selectedIndex), null;
      },
      set: function(s) {
        var d = s.parentNode;
        d && (d.selectedIndex, d.parentNode && d.parentNode.selectedIndex);
      }
    }), u.each([
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
      u.propFix[this.toLowerCase()] = this;
    }), g.enctype || (u.propFix.enctype = "encoding");
    var ya = /[\t\r\n\f]/g;
    function Fr(s) {
      return u.attr(s, "class") || "";
    }
    u.fn.extend({
      addClass: function(s) {
        var d, w, y, E, b, H, K, W = 0;
        if (u.isFunction(s))
          return this.each(function(q) {
            u(this).addClass(s.call(this, q, Fr(this)));
          });
        if (typeof s == "string" && s) {
          for (d = s.match(hA) || []; w = this[W++]; )
            if (E = Fr(w), y = w.nodeType === 1 && (" " + E + " ").replace(ya, " "), y) {
              for (H = 0; b = d[H++]; )
                y.indexOf(" " + b + " ") < 0 && (y += b + " ");
              K = u.trim(y), E !== K && u.attr(w, "class", K);
            }
        }
        return this;
      },
      removeClass: function(s) {
        var d, w, y, E, b, H, K, W = 0;
        if (u.isFunction(s))
          return this.each(function(q) {
            u(this).removeClass(s.call(this, q, Fr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof s == "string" && s) {
          for (d = s.match(hA) || []; w = this[W++]; )
            if (E = Fr(w), y = w.nodeType === 1 && (" " + E + " ").replace(ya, " "), y) {
              for (H = 0; b = d[H++]; )
                for (; y.indexOf(" " + b + " ") > -1; )
                  y = y.replace(" " + b + " ", " ");
              K = u.trim(y), E !== K && u.attr(w, "class", K);
            }
        }
        return this;
      },
      toggleClass: function(s, d) {
        var w = typeof s;
        return typeof d == "boolean" && w === "string" ? d ? this.addClass(s) : this.removeClass(s) : u.isFunction(s) ? this.each(function(y) {
          u(this).toggleClass(
            s.call(this, y, Fr(this), d),
            d
          );
        }) : this.each(function() {
          var y, E, b, H;
          if (w === "string")
            for (E = 0, b = u(this), H = s.match(hA) || []; y = H[E++]; )
              b.hasClass(y) ? b.removeClass(y) : b.addClass(y);
          else (s === void 0 || w === "boolean") && (y = Fr(this), y && u._data(this, "__className__", y), u.attr(
            this,
            "class",
            y || s === !1 ? "" : u._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(s) {
        var d, w, y = 0;
        for (d = " " + s + " "; w = this[y++]; )
          if (w.nodeType === 1 && (" " + Fr(w) + " ").replace(ya, " ").indexOf(d) > -1)
            return !0;
        return !1;
      }
    }), u.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
      function(s, d) {
        u.fn[d] = function(w, y) {
          return arguments.length > 0 ? this.on(d, null, w, y) : this.trigger(d);
        };
      }
    ), u.fn.extend({
      hover: function(s, d) {
        return this.mouseenter(s).mouseleave(d || s);
      }
    });
    var hu = e.location, Ca = u.now(), Qa = /\?/, du = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    u.parseJSON = function(s) {
      if (e.JSON && e.JSON.parse)
        return e.JSON.parse(s + "");
      var d, w = null, y = u.trim(s + "");
      return y && !u.trim(y.replace(du, function(E, b, H, K) {
        return d && b && (w = 0), w === 0 ? E : (d = H || b, w += !K - !H, "");
      })) ? Function("return " + y)() : u.error("Invalid JSON: " + s);
    }, u.parseXML = function(s) {
      var d, w;
      if (!s || typeof s != "string")
        return null;
      try {
        e.DOMParser ? (w = new e.DOMParser(), d = w.parseFromString(s, "text/xml")) : (d = new e.ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(s));
      } catch {
        d = void 0;
      }
      return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && u.error("Invalid XML: " + s), d;
    };
    var nf = /#.*$/, pu = /([?&])_=[^&]*/, rf = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, gu = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, af = /^(?:GET|HEAD)$/, of = /^\/\//, Bu = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, wu = {}, Di = {}, mu = "*/".concat("*"), _o = hu.href, ni = Bu.exec(_o.toLowerCase()) || [];
    function vu(s) {
      return function(d, w) {
        typeof d != "string" && (w = d, d = "*");
        var y, E = 0, b = d.toLowerCase().match(hA) || [];
        if (u.isFunction(w))
          for (; y = b[E++]; )
            y.charAt(0) === "+" ? (y = y.slice(1) || "*", (s[y] = s[y] || []).unshift(w)) : (s[y] = s[y] || []).push(w);
      };
    }
    function yu(s, d, w, y) {
      var E = {}, b = s === Di;
      function H(K) {
        var W;
        return E[K] = !0, u.each(s[K] || [], function(q, AA) {
          var mA = AA(d, w, y);
          if (typeof mA == "string" && !b && !E[mA])
            return d.dataTypes.unshift(mA), H(mA), !1;
          if (b)
            return !(W = mA);
        }), W;
      }
      return H(d.dataTypes[0]) || !E["*"] && H("*");
    }
    function Me(s, d) {
      var w, y, E = u.ajaxSettings.flatOptions || {};
      for (y in d)
        d[y] !== void 0 && ((E[y] ? s : w || (w = {}))[y] = d[y]);
      return w && u.extend(!0, s, w), s;
    }
    function Ke(s, d, w) {
      for (var y, E, b, H, K = s.contents, W = s.dataTypes; W[0] === "*"; )
        W.shift(), E === void 0 && (E = s.mimeType || d.getResponseHeader("Content-Type"));
      if (E) {
        for (H in K)
          if (K[H] && K[H].test(E)) {
            W.unshift(H);
            break;
          }
      }
      if (W[0] in w)
        b = W[0];
      else {
        for (H in w) {
          if (!W[0] || s.converters[H + " " + W[0]]) {
            b = H;
            break;
          }
          y || (y = H);
        }
        b = b || y;
      }
      if (b)
        return b !== W[0] && W.unshift(b), w[b];
    }
    function sf(s, d, w, y) {
      var E, b, H, K, W, q = {}, AA = s.dataTypes.slice();
      if (AA[1])
        for (H in s.converters)
          q[H.toLowerCase()] = s.converters[H];
      for (b = AA.shift(); b; )
        if (s.responseFields[b] && (w[s.responseFields[b]] = d), !W && y && s.dataFilter && (d = s.dataFilter(d, s.dataType)), W = b, b = AA.shift(), b) {
          if (b === "*")
            b = W;
          else if (W !== "*" && W !== b) {
            if (H = q[W + " " + b] || q["* " + b], !H) {
              for (E in q)
                if (K = E.split(" "), K[1] === b && (H = q[W + " " + K[0]] || q["* " + K[0]], H)) {
                  H === !0 ? H = q[E] : q[E] !== !0 && (b = K[0], AA.unshift(K[1]));
                  break;
                }
            }
            if (H !== !0)
              if (H && s.throws)
                d = H(d);
              else
                try {
                  d = H(d);
                } catch (mA) {
                  return {
                    state: "parsererror",
                    error: H ? mA : "No conversion from " + W + " to " + b
                  };
                }
          }
        }
      return { state: "success", data: d };
    }
    u.extend({
      // Counter for holding the number of active queries
      active: 0,
      // Last-Modified header cache for next request
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: _o,
        type: "GET",
        isLocal: gu.test(ni[1]),
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
          "*": mu,
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
          "text json": u.parseJSON,
          // Parse text as xml
          "text xml": u.parseXML
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
      ajaxSetup: function(s, d) {
        return d ? (
          // Building a settings object
          Me(Me(s, u.ajaxSettings), d)
        ) : (
          // Extending ajaxSettings
          Me(u.ajaxSettings, s)
        );
      },
      ajaxPrefilter: vu(wu),
      ajaxTransport: vu(Di),
      // Main method
      ajax: function(s, d) {
        typeof s == "object" && (d = s, s = void 0), d = d || {};
        var w, y, E, b, H, K, W, q, AA = u.ajaxSetup({}, d), mA = AA.context || AA, SA = AA.context && (mA.nodeType || mA.jquery) ? u(mA) : u.event, yA = u.Deferred(), ie = u.Callbacks("once memory"), YA = AA.statusCode || {}, ue = {}, pt = {}, Je = 0, Ar = "canceled", KA = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(le) {
            var qe;
            if (Je === 2) {
              if (!q)
                for (q = {}; qe = rf.exec(b); )
                  q[qe[1].toLowerCase()] = qe[2];
              qe = q[le.toLowerCase()];
            }
            return qe ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return Je === 2 ? b : null;
          },
          // Caches the header
          setRequestHeader: function(le, qe) {
            var Ln = le.toLowerCase();
            return Je || (le = pt[Ln] = pt[Ln] || le, ue[le] = qe), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(le) {
            return Je || (AA.mimeType = le), this;
          },
          // Status-dependent callbacks
          statusCode: function(le) {
            var qe;
            if (le)
              if (Je < 2)
                for (qe in le)
                  YA[qe] = [YA[qe], le[qe]];
              else
                KA.always(le[KA.status]);
            return this;
          },
          // Cancel the request
          abort: function(le) {
            var qe = le || Ar;
            return W && W.abort(qe), ct(0, qe), this;
          }
        };
        if (yA.promise(KA).complete = ie.add, KA.success = KA.done, KA.error = KA.fail, AA.url = ((s || AA.url || _o) + "").replace(nf, "").replace(of, ni[1] + "//"), AA.type = d.method || d.type || AA.method || AA.type, AA.dataTypes = u.trim(AA.dataType || "*").toLowerCase().match(hA) || [""], AA.crossDomain == null && (w = Bu.exec(AA.url.toLowerCase()), AA.crossDomain = !!(w && (w[1] !== ni[1] || w[2] !== ni[2] || (w[3] || (w[1] === "http:" ? "80" : "443")) !== (ni[3] || (ni[1] === "http:" ? "80" : "443"))))), AA.data && AA.processData && typeof AA.data != "string" && (AA.data = u.param(AA.data, AA.traditional)), yu(wu, AA, d, KA), Je === 2)
          return KA;
        K = u.event && AA.global, K && u.active++ === 0 && u.event.trigger("ajaxStart"), AA.type = AA.type.toUpperCase(), AA.hasContent = !af.test(AA.type), E = AA.url, AA.hasContent || (AA.data && (E = AA.url += (Qa.test(E) ? "&" : "?") + AA.data, delete AA.data), AA.cache === !1 && (AA.url = pu.test(E) ? (
          // If there is already a '_' parameter, set its value
          E.replace(pu, "$1_=" + Ca++)
        ) : (
          // Otherwise add one to the end
          E + (Qa.test(E) ? "&" : "?") + "_=" + Ca++
        ))), AA.ifModified && (u.lastModified[E] && KA.setRequestHeader("If-Modified-Since", u.lastModified[E]), u.etag[E] && KA.setRequestHeader("If-None-Match", u.etag[E])), (AA.data && AA.hasContent && AA.contentType !== !1 || d.contentType) && KA.setRequestHeader("Content-Type", AA.contentType), KA.setRequestHeader(
          "Accept",
          AA.dataTypes[0] && AA.accepts[AA.dataTypes[0]] ? AA.accepts[AA.dataTypes[0]] + (AA.dataTypes[0] !== "*" ? ", " + mu + "; q=0.01" : "") : AA.accepts["*"]
        );
        for (y in AA.headers)
          KA.setRequestHeader(y, AA.headers[y]);
        if (AA.beforeSend && (AA.beforeSend.call(mA, KA, AA) === !1 || Je === 2))
          return KA.abort();
        Ar = "abort";
        for (y in { success: 1, error: 1, complete: 1 })
          KA[y](AA[y]);
        if (W = yu(Di, AA, d, KA), !W)
          ct(-1, "No Transport");
        else {
          if (KA.readyState = 1, K && SA.trigger("ajaxSend", [KA, AA]), Je === 2)
            return KA;
          AA.async && AA.timeout > 0 && (H = e.setTimeout(function() {
            KA.abort("timeout");
          }, AA.timeout));
          try {
            Je = 1, W.send(ue, ct);
          } catch (le) {
            if (Je < 2)
              ct(-1, le);
            else
              throw le;
          }
        }
        function ct(le, qe, Ln, Ua) {
          var Ht, Tn, er, Dn, Re, St = qe;
          Je !== 2 && (Je = 2, H && e.clearTimeout(H), W = void 0, b = Ua || "", KA.readyState = le > 0 ? 4 : 0, Ht = le >= 200 && le < 300 || le === 304, Ln && (Dn = Ke(AA, KA, Ln)), Dn = sf(AA, Dn, KA, Ht), Ht ? (AA.ifModified && (Re = KA.getResponseHeader("Last-Modified"), Re && (u.lastModified[E] = Re), Re = KA.getResponseHeader("etag"), Re && (u.etag[E] = Re)), le === 204 || AA.type === "HEAD" ? St = "nocontent" : le === 304 ? St = "notmodified" : (St = Dn.state, Tn = Dn.data, er = Dn.error, Ht = !er)) : (er = St, (le || !St) && (St = "error", le < 0 && (le = 0))), KA.status = le, KA.statusText = (qe || St) + "", Ht ? yA.resolveWith(mA, [Tn, St, KA]) : yA.rejectWith(mA, [KA, St, er]), KA.statusCode(YA), YA = void 0, K && SA.trigger(
            Ht ? "ajaxSuccess" : "ajaxError",
            [KA, AA, Ht ? Tn : er]
          ), ie.fireWith(mA, [KA, St]), K && (SA.trigger("ajaxComplete", [KA, AA]), --u.active || u.event.trigger("ajaxStop")));
        }
        return KA;
      },
      getJSON: function(s, d, w) {
        return u.get(s, d, w, "json");
      },
      getScript: function(s, d) {
        return u.get(s, void 0, d, "script");
      }
    }), u.each(["get", "post"], function(s, d) {
      u[d] = function(w, y, E, b) {
        return u.isFunction(y) && (b = b || E, E = y, y = void 0), u.ajax(u.extend({
          url: w,
          type: d,
          dataType: b,
          data: y,
          success: E
        }, u.isPlainObject(w) && w));
      };
    }), u._evalUrl = function(s) {
      return u.ajax({
        url: s,
        // Make this explicit, since user can override this through ajaxSetup (#11264)
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        throws: !0
      });
    }, u.fn.extend({
      wrapAll: function(s) {
        if (u.isFunction(s))
          return this.each(function(w) {
            u(this).wrapAll(s.call(this, w));
          });
        if (this[0]) {
          var d = u(s, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && d.insertBefore(this[0]), d.map(function() {
            for (var w = this; w.firstChild && w.firstChild.nodeType === 1; )
              w = w.firstChild;
            return w;
          }).append(this);
        }
        return this;
      },
      wrapInner: function(s) {
        return u.isFunction(s) ? this.each(function(d) {
          u(this).wrapInner(s.call(this, d));
        }) : this.each(function() {
          var d = u(this), w = d.contents();
          w.length ? w.wrapAll(s) : d.append(s);
        });
      },
      wrap: function(s) {
        var d = u.isFunction(s);
        return this.each(function(w) {
          u(this).wrapAll(d ? s.call(this, w) : s);
        });
      },
      unwrap: function() {
        return this.parent().each(function() {
          u.nodeName(this, "body") || u(this).replaceWith(this.childNodes);
        }).end();
      }
    });
    function uf(s) {
      return s.style && s.style.display || u.css(s, "display");
    }
    function lf(s) {
      if (!u.contains(s.ownerDocument || i, s))
        return !0;
      for (; s && s.nodeType === 1; ) {
        if (uf(s) === "none" || s.type === "hidden")
          return !0;
        s = s.parentNode;
      }
      return !1;
    }
    u.expr.filters.hidden = function(s) {
      return g.reliableHiddenOffsets() ? s.offsetWidth <= 0 && s.offsetHeight <= 0 && !s.getClientRects().length : lf(s);
    }, u.expr.filters.visible = function(s) {
      return !u.expr.filters.hidden(s);
    };
    var cf = /%20/g, ff = /\[\]$/, Cu = /\r?\n/g, Qu = /^(?:submit|button|image|reset|file)$/i, hf = /^(?:input|select|textarea|keygen)/i;
    function et(s, d, w, y) {
      var E;
      if (u.isArray(d))
        u.each(d, function(b, H) {
          w || ff.test(s) ? y(s, H) : et(
            s + "[" + (typeof H == "object" && H != null ? b : "") + "]",
            H,
            w,
            y
          );
        });
      else if (!w && u.type(d) === "object")
        for (E in d)
          et(s + "[" + E + "]", d[E], w, y);
      else
        y(s, d);
    }
    u.param = function(s, d) {
      var w, y = [], E = function(b, H) {
        H = u.isFunction(H) ? H() : H ?? "", y[y.length] = encodeURIComponent(b) + "=" + encodeURIComponent(H);
      };
      if (d === void 0 && (d = u.ajaxSettings && u.ajaxSettings.traditional), u.isArray(s) || s.jquery && !u.isPlainObject(s))
        u.each(s, function() {
          E(this.name, this.value);
        });
      else
        for (w in s)
          et(w, s[w], d, E);
      return y.join("&").replace(cf, "+");
    }, u.fn.extend({
      serialize: function() {
        return u.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var s = u.prop(this, "elements");
          return s ? u.makeArray(s) : this;
        }).filter(function() {
          var s = this.type;
          return this.name && !u(this).is(":disabled") && hf.test(this.nodeName) && !Qu.test(s) && (this.checked || !te.test(s));
        }).map(function(s, d) {
          var w = u(this).val();
          return w == null ? null : u.isArray(w) ? u.map(w, function(y) {
            return { name: d.name, value: y.replace(Cu, `\r
`) };
          }) : { name: d.name, value: w.replace(Cu, `\r
`) };
        }).get();
      }
    }), u.ajaxSettings.xhr = e.ActiveXObject !== void 0 ? (
      // Support: IE6-IE8
      function() {
        return this.isLocal ? Kt() : i.documentMode > 8 ? Oi() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Oi() || Kt();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      Oi
    );
    var xo = 0, pn = {}, ri = u.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
      for (var s in pn)
        pn[s](void 0, !0);
    }), g.cors = !!ri && "withCredentials" in ri, ri = g.ajax = !!ri, ri && u.ajaxTransport(function(s) {
      if (!s.crossDomain || g.cors) {
        var d;
        return {
          send: function(w, y) {
            var E, b = s.xhr(), H = ++xo;
            if (b.open(
              s.type,
              s.url,
              s.async,
              s.username,
              s.password
            ), s.xhrFields)
              for (E in s.xhrFields)
                b[E] = s.xhrFields[E];
            s.mimeType && b.overrideMimeType && b.overrideMimeType(s.mimeType), !s.crossDomain && !w["X-Requested-With"] && (w["X-Requested-With"] = "XMLHttpRequest");
            for (E in w)
              w[E] !== void 0 && b.setRequestHeader(E, w[E] + "");
            b.send(s.hasContent && s.data || null), d = function(K, W) {
              var q, AA, mA;
              if (d && (W || b.readyState === 4))
                if (delete pn[H], d = void 0, b.onreadystatechange = u.noop, W)
                  b.readyState !== 4 && b.abort();
                else {
                  mA = {}, q = b.status, typeof b.responseText == "string" && (mA.text = b.responseText);
                  try {
                    AA = b.statusText;
                  } catch {
                    AA = "";
                  }
                  !q && s.isLocal && !s.crossDomain ? q = mA.text ? 200 : 404 : q === 1223 && (q = 204);
                }
              mA && y(q, AA, mA, b.getAllResponseHeaders());
            }, s.async ? b.readyState === 4 ? e.setTimeout(d) : b.onreadystatechange = pn[H] = d : d();
          },
          abort: function() {
            d && d(void 0, !0);
          }
        };
      }
    });
    function Oi() {
      try {
        return new e.XMLHttpRequest();
      } catch {
      }
    }
    function Kt() {
      try {
        return new e.ActiveXObject("Microsoft.XMLHTTP");
      } catch {
      }
    }
    u.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function(s) {
          return u.globalEval(s), s;
        }
      }
    }), u.ajaxPrefilter("script", function(s) {
      s.cache === void 0 && (s.cache = !1), s.crossDomain && (s.type = "GET", s.global = !1);
    }), u.ajaxTransport("script", function(s) {
      if (s.crossDomain) {
        var d, w = i.head || u("head")[0] || i.documentElement;
        return {
          send: function(y, E) {
            d = i.createElement("script"), d.async = !0, s.scriptCharset && (d.charset = s.scriptCharset), d.src = s.url, d.onload = d.onreadystatechange = function(b, H) {
              (H || !d.readyState || /loaded|complete/.test(d.readyState)) && (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), d = null, H || E(200, "success"));
            }, w.insertBefore(d, w.firstChild);
          },
          abort: function() {
            d && d.onload(void 0, !0);
          }
        };
      }
    });
    var Io = [], Fa = /(=)\?(?=&|$)|\?\?/;
    u.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var s = Io.pop() || u.expando + "_" + Ca++;
        return this[s] = !0, s;
      }
    }), u.ajaxPrefilter("json jsonp", function(s, d, w) {
      var y, E, b, H = s.jsonp !== !1 && (Fa.test(s.url) ? "url" : typeof s.data == "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Fa.test(s.data) && "data");
      if (H || s.dataTypes[0] === "jsonp")
        return y = s.jsonpCallback = u.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, H ? s[H] = s[H].replace(Fa, "$1" + y) : s.jsonp !== !1 && (s.url += (Qa.test(s.url) ? "&" : "?") + s.jsonp + "=" + y), s.converters["script json"] = function() {
          return b || u.error(y + " was not called"), b[0];
        }, s.dataTypes[0] = "json", E = e[y], e[y] = function() {
          b = arguments;
        }, w.always(function() {
          E === void 0 ? u(e).removeProp(y) : e[y] = E, s[y] && (s.jsonpCallback = d.jsonpCallback, Io.push(y)), b && u.isFunction(E) && E(b[0]), b = E = void 0;
        }), "script";
    }), u.parseHTML = function(s, d, w) {
      if (!s || typeof s != "string")
        return null;
      typeof d == "boolean" && (w = d, d = !1), d = d || i;
      var y = fA.exec(s), E = !w && [];
      return y ? [d.createElement(y[1])] : (y = mt([s], d, E), E && E.length && u(E).remove(), u.merge([], y.childNodes));
    };
    var Ho = u.fn.load;
    u.fn.load = function(s, d, w) {
      if (typeof s != "string" && Ho)
        return Ho.apply(this, arguments);
      var y, E, b, H = this, K = s.indexOf(" ");
      return K > -1 && (y = u.trim(s.slice(K, s.length)), s = s.slice(0, K)), u.isFunction(d) ? (w = d, d = void 0) : d && typeof d == "object" && (E = "POST"), H.length > 0 && u.ajax({
        url: s,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: E || "GET",
        dataType: "html",
        data: d
      }).done(function(W) {
        b = arguments, H.html(y ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          u("<div>").append(u.parseHTML(W)).find(y)
        ) : (
          // Otherwise use the full result
          W
        ));
      }).always(w && function(W, q) {
        H.each(function() {
          w.apply(this, b || [W.responseText, q, W]);
        });
      }), this;
    }, u.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(s, d) {
      u.fn[d] = function(w) {
        return this.on(d, w);
      };
    }), u.expr.filters.animated = function(s) {
      return u.grep(u.timers, function(d) {
        return s === d.elem;
      }).length;
    };
    function So(s) {
      return u.isWindow(s) ? s : s.nodeType === 9 ? s.defaultView || s.parentWindow : !1;
    }
    u.offset = {
      setOffset: function(s, d, w) {
        var y, E, b, H, K, W, q, AA = u.css(s, "position"), mA = u(s), SA = {};
        AA === "static" && (s.style.position = "relative"), K = mA.offset(), b = u.css(s, "top"), W = u.css(s, "left"), q = (AA === "absolute" || AA === "fixed") && u.inArray("auto", [b, W]) > -1, q ? (y = mA.position(), H = y.top, E = y.left) : (H = parseFloat(b) || 0, E = parseFloat(W) || 0), u.isFunction(d) && (d = d.call(s, w, u.extend({}, K))), d.top != null && (SA.top = d.top - K.top + H), d.left != null && (SA.left = d.left - K.left + E), "using" in d ? d.using.call(s, SA) : mA.css(SA);
      }
    }, u.fn.extend({
      offset: function(s) {
        if (arguments.length)
          return s === void 0 ? this : this.each(function(H) {
            u.offset.setOffset(this, s, H);
          });
        var d, w, y = { top: 0, left: 0 }, E = this[0], b = E && E.ownerDocument;
        if (b)
          return d = b.documentElement, u.contains(d, E) ? (typeof E.getBoundingClientRect < "u" && (y = E.getBoundingClientRect()), w = So(b), {
            top: y.top + (w.pageYOffset || d.scrollTop) - (d.clientTop || 0),
            left: y.left + (w.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
          }) : y;
      },
      position: function() {
        if (this[0]) {
          var s, d, w = { top: 0, left: 0 }, y = this[0];
          return u.css(y, "position") === "fixed" ? d = y.getBoundingClientRect() : (s = this.offsetParent(), d = this.offset(), u.nodeName(s[0], "html") || (w = s.offset()), w.top += u.css(s[0], "borderTopWidth", !0), w.left += u.css(s[0], "borderLeftWidth", !0)), {
            top: d.top - w.top - u.css(y, "marginTop", !0),
            left: d.left - w.left - u.css(y, "marginLeft", !0)
          };
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var s = this.offsetParent; s && !u.nodeName(s, "html") && u.css(s, "position") === "static"; )
            s = s.offsetParent;
          return s || tu;
        });
      }
    }), u.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(s, d) {
      var w = /Y/.test(d);
      u.fn[s] = function(y) {
        return bA(this, function(E, b, H) {
          var K = So(E);
          if (H === void 0)
            return K ? d in K ? K[d] : K.document.documentElement[b] : E[b];
          K ? K.scrollTo(
            w ? u(K).scrollLeft() : H,
            w ? H : u(K).scrollTop()
          ) : E[b] = H;
        }, s, y, arguments.length, null);
      };
    }), u.each(["top", "left"], function(s, d) {
      u.cssHooks[d] = Co(
        g.pixelPosition,
        function(w, y) {
          if (y)
            return y = Zn(w, d), pa.test(y) ? u(w).position()[d] + "px" : y;
        }
      );
    }), u.each({ Height: "height", Width: "width" }, function(s, d) {
      u.each(
        { padding: "inner" + s, content: d, "": "outer" + s },
        function(w, y) {
          u.fn[y] = function(E, b) {
            var H = arguments.length && (w || typeof E != "boolean"), K = w || (E === !0 || b === !0 ? "margin" : "border");
            return bA(this, function(W, q, AA) {
              var mA;
              return u.isWindow(W) ? W.document.documentElement["client" + s] : W.nodeType === 9 ? (mA = W.documentElement, Math.max(
                W.body["scroll" + s],
                mA["scroll" + s],
                W.body["offset" + s],
                mA["offset" + s],
                mA["client" + s]
              )) : AA === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                u.css(W, q, K)
              ) : (
                // Set width or height on the element
                u.style(W, q, AA, K)
              );
            }, d, H ? E : void 0, H, null);
          };
        }
      );
    }), u.fn.extend({
      bind: function(s, d, w) {
        return this.on(s, null, d, w);
      },
      unbind: function(s, d) {
        return this.off(s, null, d);
      },
      delegate: function(s, d, w, y) {
        return this.on(d, s, w, y);
      },
      undelegate: function(s, d, w) {
        return arguments.length === 1 ? this.off(s, "**") : this.off(d, s || "**", w);
      }
    }), u.fn.size = function() {
      return this.length;
    }, u.fn.andSelf = u.fn.addBack;
    var Fu = e.jQuery, Uu = e.$;
    return u.noConflict = function(s) {
      return e.$ === u && (e.$ = Uu), s && e.jQuery === u && (e.jQuery = Fu), u;
    }, t || (e.jQuery = e.$ = u), u;
  });
})(L0);
var xO = L0.exports;
const oe = /* @__PURE__ */ Ic(xO), IO = function(A) {
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
    onLabelSelectFunction: function(o) {
      alert("Click" + o.number);
    },
    labelSize: 10,
    longestChromosome: 100
  }, t = Le.merge({}, e, A), n = function(o) {
    return o < 1e3 ? o : o < 1e6 ? (o / 1e3).toFixed(1) + "Kb" : (o / 1e6).toFixed(1) + "Mb";
  };
  function i(o) {
    o.each(function(l) {
      var f = WA(this).selectAll(".chromosome-label").data([l]), c = f.enter().append("g").attr("class", "chromosome-label");
      c.append("text"), t.border && c.append("rect").classed("border", !0), WA(this).selectAll(".chromosome-label").attr("transform", function(g) {
        return "translate(" + t.layout.x + "," + t.layout.y + ")";
      }), WA(this).selectAll(".chromosome-label").selectAll("text").attr("x", t.layout.width * 0.5).attr("y", t.layout.height * 0.5).style(
        "font-size",
        Math.max(14 / t.scale, t.layout.chromosomeWidth * 1.2) + "px"
      ).text(l.number).on("click", t.onLabelSelectFunction), t.border && f.select("rect").attr("width", t.layout.width).attr("height", t.layout.height), f.exit().remove();
      var h = WA(this).selectAll(".chromosome-size-label").data([l]);
      c = h.enter().append("g").attr("class", "chromosome-size-label"), c.append("text");
      var m = 10 + t.sizeLayout.y + t.sizeLayout.cellHeight * l.length / t.longestChromosome, B = 1.2 * t.labelSize / Math.min(5, t.scale) + "px";
      WA(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + t.sizeLayout.x + "," + m + ")"
      ), h = WA(this).selectAll(".chromosome-size-label").select("text").attr("x", t.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", B).text(n(l.length)), h.exit().remove();
    });
  }
  return i.longestChromosome = function(o) {
    return arguments.length ? (t.longestChromosome = o, i) : t.longestChromosome;
  }, i.layout = function(o) {
    return arguments.length ? (t.layout = o, i) : t.layout;
  }, i.sizeLayout = function(o) {
    return arguments.length ? (t.sizeLayout = o, i) : t.sizeLayout;
  }, i.scale = function(o) {
    return arguments.length ? (t.scale = o, i) : t.scale;
  }, i.onLabelSelectFunction = function(o) {
    return arguments.length ? (t.onLabelSelectFunction = o, i) : t.onLabelSelectFunction;
  }, i;
}, HO = function(A) {
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
  }, t = Le.merge({}, e, A), n = function() {
    return fa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h) {
    var m = n(), B = m(h.length), g = WA(this);
    g.attr("id", "chromosome_" + h.number).attr(
      "transform",
      "translate(" + t.layout.x + "," + t.layout.y + ")"
    ), g.select("defs").html("").append("mask").attr("id", "chromosome_mask_" + h.number).append("rect").attr("class", "mask_rect"), g.select("#chromosome_mask_" + h.number).attr("width", t.layout.width).attr("height", B);
    var v = {
      width: t.layout.width,
      height: B,
      rx: Math.min(t.layout.width * 0.4, t.layout.height * 0.1),
      ry: Math.min(t.layout.width * 0.4, t.layout.height * 0.1)
    };
    g.select(".mask_rect").attr("width", v.width).attr("height", v.height).attr("rx", v.rx).attr("ry", v.ry), g.select("rect.background").attr("width", v.width).attr("height", v.height).attr("rx", v.rx).attr("ry", v.ry), g.select("rect.outline").attr("width", v.width).attr("height", v.height).attr("rx", v.rx).attr("ry", v.ry);
    var u = [], C = function() {
      var N = g.selectAll("rect.selection").data(u);
      N.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), N.attr("x", 0).attr("y", function(x) {
        return Math.min(x.start, x.end);
      }).attr("width", t.layout.width).attr("height", function(x) {
        return Math.abs(x.end - x.start);
      }), N.exit().remove();
    }, F = cT().on("start", function(N) {
      var x = Vn(N, this);
      u.push({
        start: x[1],
        end: x[1]
      }), C(), N.sourceEvent.stopPropagation();
    }).on("drag", function(N) {
      u[0].end = Vn(N, this)[1], C(), N.sourceEvent.stopPropagation(), N.sourceEvent.preventDefault();
    }).on("end", function(N) {
      N.sourceEvent.stopPropagation();
      var x = m.invert(u[0].start), P = m.invert(u[0].end);
      if (x > P) {
        var R = x;
        x = P, P = R;
      }
      var J = h.layout.geneBandNodes.filter(function(fA) {
        return fA.data.midpoint > x && fA.data.midpoint < P;
      });
      J.forEach(function(fA) {
        fA.data.type == "gene" ? fA.data.visible = !0 : fA.data.type == "geneslist" && fA.data.genesList.forEach(function(uA) {
          uA.visible = !0;
        });
      }), t.onAnnotationSelectFunction(), u = [], C();
    });
    g.select("rect.background").call(F), t.border && g.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
    var U = g.select(".bands_container"), S;
    t.bands == "basemap" ? S = o : t.bands == "genes" && (S = f), S(U, h), g.select(".bands_container").style("mask", "url(#chromosome_mask_" + h.number + ")");
  }, o = function(h, m) {
    var B = n(), g = h.selectAll("rect.band").data(m.bands);
    g.enter().append("rect").attr("class", "band"), g.attr("width", t.layout.width).attr("y", function(v) {
      return B(v.start);
    }).attr("height", function(v) {
      return B(v.end - v.start);
    }).attr("fill", function(v) {
      return v.color;
    }), g.exit().remove();
  }, l = function(h, m) {
    var B = m.end - m.start, g = h(B), v;
    if (g * t.scale > 2)
      v = { y: h(m.start), height: g };
    else {
      let u = Math.min(2 / t.scale, 2);
      v = { y: h(m.midpoint) - u / 2, height: u };
    }
    return v.fill = m.color, v.width = t.layout.width, v["fill-opacity"] = 0.8, v["stroke-dasharray"] = [
      0,
      t.layout.width,
      v.height,
      t.layout.width + v.height
    ], v["stroke-width"] = t.layout.width / 5, v;
  }, f = function(h, m) {
    var B = n(), g = h.selectAll("rect.band"), v = g.data(m.layout.geneBandNodes);
    v.enter().append("rect").attr("id", function(C) {
      return C.data.id;
    }).attr("class", "band geneline infobox"), v.each(function(C) {
      let F = l(B, C);
      WA(this).attr("y", F.y).attr("height", F.height).attr("fill", F.fill).attr("width", F.width).attr("fill-opacity", F["fill-opacity"]).attr("stroke-dasharray", F["stroke-dasharray"]).attr("stroke-width", F["stroke-width"]);
    }), v.classed("selected", function(C) {
      return C.data.selected;
    });
    var u = g.data(m.bands);
    u.attr("width", t.layout.width).attr("y", function(C) {
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
    h.each(function(m) {
      var B = WA(this).selectAll(".chromosome").data([m]), g = B.enter().append("g").attr("class", "chromosome");
      g.append("defs"), g.append("rect").classed("background", !0), g.append("g").classed("bands_container", !0), g.append("rect").classed("outline", !0), t.border && g.append("rect").classed("border", !0), WA(this).selectAll(".chromosome").each(i), B.exit().remove();
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
var nn = "top", bn = "bottom", _n = "right", rn = "left", Gp = "auto", Xs = [nn, bn, _n, rn], lo = "start", Ds = "end", SO = "clippingParents", T0 = "viewport", es = "popper", LO = "reference", Pw = /* @__PURE__ */ Xs.reduce(function(A, e) {
  return A.concat([e + "-" + lo, e + "-" + Ds]);
}, []), D0 = /* @__PURE__ */ [].concat(Xs, [Gp]).reduce(function(A, e) {
  return A.concat([e, e + "-" + lo, e + "-" + Ds]);
}, []), TO = "beforeRead", DO = "read", OO = "afterRead", NO = "beforeMain", MO = "main", PO = "afterMain", KO = "beforeWrite", RO = "write", kO = "afterWrite", $O = [TO, DO, OO, NO, MO, PO, KO, RO, kO];
function pr(A) {
  return A ? (A.nodeName || "").toLowerCase() : null;
}
function fn(A) {
  if (A == null)
    return window;
  if (A.toString() !== "[object Window]") {
    var e = A.ownerDocument;
    return e && e.defaultView || window;
  }
  return A;
}
function ca(A) {
  var e = fn(A).Element;
  return A instanceof e || A instanceof Element;
}
function En(A) {
  var e = fn(A).HTMLElement;
  return A instanceof e || A instanceof HTMLElement;
}
function Vp(A) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = fn(A).ShadowRoot;
  return A instanceof e || A instanceof ShadowRoot;
}
function GO(A) {
  var e = A.state;
  Object.keys(e.elements).forEach(function(t) {
    var n = e.styles[t] || {}, i = e.attributes[t] || {}, o = e.elements[t];
    !En(o) || !pr(o) || (Object.assign(o.style, n), Object.keys(i).forEach(function(l) {
      var f = i[l];
      f === !1 ? o.removeAttribute(l) : o.setAttribute(l, f === !0 ? "" : f);
    }));
  });
}
function VO(A) {
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
      var i = e.elements[n], o = e.attributes[n] || {}, l = Object.keys(e.styles.hasOwnProperty(n) ? e.styles[n] : t[n]), f = l.reduce(function(c, h) {
        return c[h] = "", c;
      }, {});
      !En(i) || !pr(i) || (Object.assign(i.style, f), Object.keys(o).forEach(function(c) {
        i.removeAttribute(c);
      }));
    });
  };
}
const O0 = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: GO,
  effect: VO,
  requires: ["computeStyles"]
};
function dr(A) {
  return A.split("-")[0];
}
var ra = Math.max, wc = Math.min, co = Math.round;
function fd() {
  var A = navigator.userAgentData;
  return A != null && A.brands && Array.isArray(A.brands) ? A.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function N0() {
  return !/^((?!chrome|android).)*safari/i.test(fd());
}
function fo(A, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var n = A.getBoundingClientRect(), i = 1, o = 1;
  e && En(A) && (i = A.offsetWidth > 0 && co(n.width) / A.offsetWidth || 1, o = A.offsetHeight > 0 && co(n.height) / A.offsetHeight || 1);
  var l = ca(A) ? fn(A) : window, f = l.visualViewport, c = !N0() && t, h = (n.left + (c && f ? f.offsetLeft : 0)) / i, m = (n.top + (c && f ? f.offsetTop : 0)) / o, B = n.width / i, g = n.height / o;
  return {
    width: B,
    height: g,
    top: m,
    right: h + B,
    bottom: m + g,
    left: h,
    x: h,
    y: m
  };
}
function Wp(A) {
  var e = fo(A), t = A.offsetWidth, n = A.offsetHeight;
  return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - n) <= 1 && (n = e.height), {
    x: A.offsetLeft,
    y: A.offsetTop,
    width: t,
    height: n
  };
}
function M0(A, e) {
  var t = e.getRootNode && e.getRootNode();
  if (A.contains(e))
    return !0;
  if (t && Vp(t)) {
    var n = e;
    do {
      if (n && A.isSameNode(n))
        return !0;
      n = n.parentNode || n.host;
    } while (n);
  }
  return !1;
}
function Xr(A) {
  return fn(A).getComputedStyle(A);
}
function WO(A) {
  return ["table", "td", "th"].indexOf(pr(A)) >= 0;
}
function _i(A) {
  return ((ca(A) ? A.ownerDocument : (
    // $FlowFixMe[prop-missing]
    A.document
  )) || window.document).documentElement;
}
function Rc(A) {
  return pr(A) === "html" ? A : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    A.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    A.parentNode || // DOM Element detected
    (Vp(A) ? A.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    _i(A)
  );
}
function Kw(A) {
  return !En(A) || // https://github.com/popperjs/popper-core/issues/837
  Xr(A).position === "fixed" ? null : A.offsetParent;
}
function XO(A) {
  var e = /firefox/i.test(fd()), t = /Trident/i.test(fd());
  if (t && En(A)) {
    var n = Xr(A);
    if (n.position === "fixed")
      return null;
  }
  var i = Rc(A);
  for (Vp(i) && (i = i.host); En(i) && ["html", "body"].indexOf(pr(i)) < 0; ) {
    var o = Xr(i);
    if (o.transform !== "none" || o.perspective !== "none" || o.contain === "paint" || ["transform", "perspective"].indexOf(o.willChange) !== -1 || e && o.willChange === "filter" || e && o.filter && o.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function qs(A) {
  for (var e = fn(A), t = Kw(A); t && WO(t) && Xr(t).position === "static"; )
    t = Kw(t);
  return t && (pr(t) === "html" || pr(t) === "body" && Xr(t).position === "static") ? e : t || XO(A) || e;
}
function Xp(A) {
  return ["top", "bottom"].indexOf(A) >= 0 ? "x" : "y";
}
function Cs(A, e, t) {
  return ra(A, wc(e, t));
}
function qO(A, e, t) {
  var n = Cs(A, e, t);
  return n > t ? t : n;
}
function P0() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function K0(A) {
  return Object.assign({}, P0(), A);
}
function R0(A, e) {
  return e.reduce(function(t, n) {
    return t[n] = A, t;
  }, {});
}
var zO = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, K0(typeof e != "number" ? e : R0(e, Xs));
};
function JO(A) {
  var e, t = A.state, n = A.name, i = A.options, o = t.elements.arrow, l = t.modifiersData.popperOffsets, f = dr(t.placement), c = Xp(f), h = [rn, _n].indexOf(f) >= 0, m = h ? "height" : "width";
  if (!(!o || !l)) {
    var B = zO(i.padding, t), g = Wp(o), v = c === "y" ? nn : rn, u = c === "y" ? bn : _n, C = t.rects.reference[m] + t.rects.reference[c] - l[c] - t.rects.popper[m], F = l[c] - t.rects.reference[c], U = qs(o), S = U ? c === "y" ? U.clientHeight || 0 : U.clientWidth || 0 : 0, N = C / 2 - F / 2, x = B[v], P = S - g[m] - B[u], R = S / 2 - g[m] / 2 + N, J = Cs(x, R, P), fA = c;
    t.modifiersData[n] = (e = {}, e[fA] = J, e.centerOffset = J - R, e);
  }
}
function jO(A) {
  var e = A.state, t = A.options, n = t.element, i = n === void 0 ? "[data-popper-arrow]" : n;
  i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || M0(e.elements.popper, i) && (e.elements.arrow = i));
}
const YO = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: JO,
  effect: jO,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function ho(A) {
  return A.split("-")[1];
}
var ZO = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function A4(A, e) {
  var t = A.x, n = A.y, i = e.devicePixelRatio || 1;
  return {
    x: co(t * i) / i || 0,
    y: co(n * i) / i || 0
  };
}
function Rw(A) {
  var e, t = A.popper, n = A.popperRect, i = A.placement, o = A.variation, l = A.offsets, f = A.position, c = A.gpuAcceleration, h = A.adaptive, m = A.roundOffsets, B = A.isFixed, g = l.x, v = g === void 0 ? 0 : g, u = l.y, C = u === void 0 ? 0 : u, F = typeof m == "function" ? m({
    x: v,
    y: C
  }) : {
    x: v,
    y: C
  };
  v = F.x, C = F.y;
  var U = l.hasOwnProperty("x"), S = l.hasOwnProperty("y"), N = rn, x = nn, P = window;
  if (h) {
    var R = qs(t), J = "clientHeight", fA = "clientWidth";
    if (R === fn(t) && (R = _i(t), Xr(R).position !== "static" && f === "absolute" && (J = "scrollHeight", fA = "scrollWidth")), R = R, i === nn || (i === rn || i === _n) && o === Ds) {
      x = bn;
      var uA = B && R === P && P.visualViewport ? P.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        R[J]
      );
      C -= uA - n.height, C *= c ? 1 : -1;
    }
    if (i === rn || (i === nn || i === bn) && o === Ds) {
      N = _n;
      var BA = B && R === P && P.visualViewport ? P.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        R[fA]
      );
      v -= BA - n.width, v *= c ? 1 : -1;
    }
  }
  var FA = Object.assign({
    position: f
  }, h && ZO), NA = m === !0 ? A4({
    x: v,
    y: C
  }, fn(t)) : {
    x: v,
    y: C
  };
  if (v = NA.x, C = NA.y, c) {
    var xA;
    return Object.assign({}, FA, (xA = {}, xA[x] = S ? "0" : "", xA[N] = U ? "0" : "", xA.transform = (P.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + C + "px)" : "translate3d(" + v + "px, " + C + "px, 0)", xA));
  }
  return Object.assign({}, FA, (e = {}, e[x] = S ? C + "px" : "", e[N] = U ? v + "px" : "", e.transform = "", e));
}
function e4(A) {
  var e = A.state, t = A.options, n = t.gpuAcceleration, i = n === void 0 ? !0 : n, o = t.adaptive, l = o === void 0 ? !0 : o, f = t.roundOffsets, c = f === void 0 ? !0 : f, h = {
    placement: dr(e.placement),
    variation: ho(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, Rw(Object.assign({}, h, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: l,
    roundOffsets: c
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, Rw(Object.assign({}, h, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: c
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const t4 = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: e4,
  data: {}
};
var pl = {
  passive: !0
};
function n4(A) {
  var e = A.state, t = A.instance, n = A.options, i = n.scroll, o = i === void 0 ? !0 : i, l = n.resize, f = l === void 0 ? !0 : l, c = fn(e.elements.popper), h = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return o && h.forEach(function(m) {
    m.addEventListener("scroll", t.update, pl);
  }), f && c.addEventListener("resize", t.update, pl), function() {
    o && h.forEach(function(m) {
      m.removeEventListener("scroll", t.update, pl);
    }), f && c.removeEventListener("resize", t.update, pl);
  };
}
const r4 = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: n4,
  data: {}
};
var i4 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function jl(A) {
  return A.replace(/left|right|bottom|top/g, function(e) {
    return i4[e];
  });
}
var a4 = {
  start: "end",
  end: "start"
};
function kw(A) {
  return A.replace(/start|end/g, function(e) {
    return a4[e];
  });
}
function qp(A) {
  var e = fn(A), t = e.pageXOffset, n = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: n
  };
}
function zp(A) {
  return fo(_i(A)).left + qp(A).scrollLeft;
}
function o4(A, e) {
  var t = fn(A), n = _i(A), i = t.visualViewport, o = n.clientWidth, l = n.clientHeight, f = 0, c = 0;
  if (i) {
    o = i.width, l = i.height;
    var h = N0();
    (h || !h && e === "fixed") && (f = i.offsetLeft, c = i.offsetTop);
  }
  return {
    width: o,
    height: l,
    x: f + zp(A),
    y: c
  };
}
function s4(A) {
  var e, t = _i(A), n = qp(A), i = (e = A.ownerDocument) == null ? void 0 : e.body, o = ra(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), l = ra(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), f = -n.scrollLeft + zp(A), c = -n.scrollTop;
  return Xr(i || t).direction === "rtl" && (f += ra(t.clientWidth, i ? i.clientWidth : 0) - o), {
    width: o,
    height: l,
    x: f,
    y: c
  };
}
function Jp(A) {
  var e = Xr(A), t = e.overflow, n = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + n);
}
function k0(A) {
  return ["html", "body", "#document"].indexOf(pr(A)) >= 0 ? A.ownerDocument.body : En(A) && Jp(A) ? A : k0(Rc(A));
}
function Qs(A, e) {
  var t;
  e === void 0 && (e = []);
  var n = k0(A), i = n === ((t = A.ownerDocument) == null ? void 0 : t.body), o = fn(n), l = i ? [o].concat(o.visualViewport || [], Jp(n) ? n : []) : n, f = e.concat(l);
  return i ? f : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    f.concat(Qs(Rc(l)))
  );
}
function hd(A) {
  return Object.assign({}, A, {
    left: A.x,
    top: A.y,
    right: A.x + A.width,
    bottom: A.y + A.height
  });
}
function u4(A, e) {
  var t = fo(A, !1, e === "fixed");
  return t.top = t.top + A.clientTop, t.left = t.left + A.clientLeft, t.bottom = t.top + A.clientHeight, t.right = t.left + A.clientWidth, t.width = A.clientWidth, t.height = A.clientHeight, t.x = t.left, t.y = t.top, t;
}
function $w(A, e, t) {
  return e === T0 ? hd(o4(A, t)) : ca(e) ? u4(e, t) : hd(s4(_i(A)));
}
function l4(A) {
  var e = Qs(Rc(A)), t = ["absolute", "fixed"].indexOf(Xr(A).position) >= 0, n = t && En(A) ? qs(A) : A;
  return ca(n) ? e.filter(function(i) {
    return ca(i) && M0(i, n) && pr(i) !== "body";
  }) : [];
}
function c4(A, e, t, n) {
  var i = e === "clippingParents" ? l4(A) : [].concat(e), o = [].concat(i, [t]), l = o[0], f = o.reduce(function(c, h) {
    var m = $w(A, h, n);
    return c.top = ra(m.top, c.top), c.right = wc(m.right, c.right), c.bottom = wc(m.bottom, c.bottom), c.left = ra(m.left, c.left), c;
  }, $w(A, l, n));
  return f.width = f.right - f.left, f.height = f.bottom - f.top, f.x = f.left, f.y = f.top, f;
}
function $0(A) {
  var e = A.reference, t = A.element, n = A.placement, i = n ? dr(n) : null, o = n ? ho(n) : null, l = e.x + e.width / 2 - t.width / 2, f = e.y + e.height / 2 - t.height / 2, c;
  switch (i) {
    case nn:
      c = {
        x: l,
        y: e.y - t.height
      };
      break;
    case bn:
      c = {
        x: l,
        y: e.y + e.height
      };
      break;
    case _n:
      c = {
        x: e.x + e.width,
        y: f
      };
      break;
    case rn:
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
  var h = i ? Xp(i) : null;
  if (h != null) {
    var m = h === "y" ? "height" : "width";
    switch (o) {
      case lo:
        c[h] = c[h] - (e[m] / 2 - t[m] / 2);
        break;
      case Ds:
        c[h] = c[h] + (e[m] / 2 - t[m] / 2);
        break;
    }
  }
  return c;
}
function Os(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = n === void 0 ? A.placement : n, o = t.strategy, l = o === void 0 ? A.strategy : o, f = t.boundary, c = f === void 0 ? SO : f, h = t.rootBoundary, m = h === void 0 ? T0 : h, B = t.elementContext, g = B === void 0 ? es : B, v = t.altBoundary, u = v === void 0 ? !1 : v, C = t.padding, F = C === void 0 ? 0 : C, U = K0(typeof F != "number" ? F : R0(F, Xs)), S = g === es ? LO : es, N = A.rects.popper, x = A.elements[u ? S : g], P = c4(ca(x) ? x : x.contextElement || _i(A.elements.popper), c, m, l), R = fo(A.elements.reference), J = $0({
    reference: R,
    element: N,
    strategy: "absolute",
    placement: i
  }), fA = hd(Object.assign({}, N, J)), uA = g === es ? fA : R, BA = {
    top: P.top - uA.top + U.top,
    bottom: uA.bottom - P.bottom + U.bottom,
    left: P.left - uA.left + U.left,
    right: uA.right - P.right + U.right
  }, FA = A.modifiersData.offset;
  if (g === es && FA) {
    var NA = FA[i];
    Object.keys(BA).forEach(function(xA) {
      var X = [_n, bn].indexOf(xA) >= 0 ? 1 : -1, CA = [nn, bn].indexOf(xA) >= 0 ? "y" : "x";
      BA[xA] += NA[CA] * X;
    });
  }
  return BA;
}
function f4(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = t.boundary, o = t.rootBoundary, l = t.padding, f = t.flipVariations, c = t.allowedAutoPlacements, h = c === void 0 ? D0 : c, m = ho(n), B = m ? f ? Pw : Pw.filter(function(u) {
    return ho(u) === m;
  }) : Xs, g = B.filter(function(u) {
    return h.indexOf(u) >= 0;
  });
  g.length === 0 && (g = B);
  var v = g.reduce(function(u, C) {
    return u[C] = Os(A, {
      placement: C,
      boundary: i,
      rootBoundary: o,
      padding: l
    })[dr(C)], u;
  }, {});
  return Object.keys(v).sort(function(u, C) {
    return v[u] - v[C];
  });
}
function h4(A) {
  if (dr(A) === Gp)
    return [];
  var e = jl(A);
  return [kw(A), e, kw(e)];
}
function d4(A) {
  var e = A.state, t = A.options, n = A.name;
  if (!e.modifiersData[n]._skip) {
    for (var i = t.mainAxis, o = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !0 : l, c = t.fallbackPlacements, h = t.padding, m = t.boundary, B = t.rootBoundary, g = t.altBoundary, v = t.flipVariations, u = v === void 0 ? !0 : v, C = t.allowedAutoPlacements, F = e.options.placement, U = dr(F), S = U === F, N = c || (S || !u ? [jl(F)] : h4(F)), x = [F].concat(N).reduce(function(T, k) {
      return T.concat(dr(k) === Gp ? f4(e, {
        placement: k,
        boundary: m,
        rootBoundary: B,
        padding: h,
        flipVariations: u,
        allowedAutoPlacements: C
      }) : k);
    }, []), P = e.rects.reference, R = e.rects.popper, J = /* @__PURE__ */ new Map(), fA = !0, uA = x[0], BA = 0; BA < x.length; BA++) {
      var FA = x[BA], NA = dr(FA), xA = ho(FA) === lo, X = [nn, bn].indexOf(NA) >= 0, CA = X ? "width" : "height", tA = Os(e, {
        placement: FA,
        boundary: m,
        rootBoundary: B,
        altBoundary: g,
        padding: h
      }), hA = X ? xA ? _n : rn : xA ? bn : nn;
      P[CA] > R[CA] && (hA = jl(hA));
      var _A = jl(hA), IA = [];
      if (o && IA.push(tA[NA] <= 0), f && IA.push(tA[hA] <= 0, tA[_A] <= 0), IA.every(function(T) {
        return T;
      })) {
        uA = FA, fA = !1;
        break;
      }
      J.set(FA, IA);
    }
    if (fA)
      for (var aA = u ? 3 : 1, D = function(k) {
        var rA = x.find(function(UA) {
          var EA = J.get(UA);
          if (EA)
            return EA.slice(0, k).every(function(zA) {
              return zA;
            });
        });
        if (rA)
          return uA = rA, "break";
      }, eA = aA; eA > 0; eA--) {
        var j = D(eA);
        if (j === "break") break;
      }
    e.placement !== uA && (e.modifiersData[n]._skip = !0, e.placement = uA, e.reset = !0);
  }
}
const p4 = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: d4,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function Gw(A, e, t) {
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
function Vw(A) {
  return [nn, _n, bn, rn].some(function(e) {
    return A[e] >= 0;
  });
}
function g4(A) {
  var e = A.state, t = A.name, n = e.rects.reference, i = e.rects.popper, o = e.modifiersData.preventOverflow, l = Os(e, {
    elementContext: "reference"
  }), f = Os(e, {
    altBoundary: !0
  }), c = Gw(l, n), h = Gw(f, i, o), m = Vw(c), B = Vw(h);
  e.modifiersData[t] = {
    referenceClippingOffsets: c,
    popperEscapeOffsets: h,
    isReferenceHidden: m,
    hasPopperEscaped: B
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": m,
    "data-popper-escaped": B
  });
}
const B4 = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: g4
};
function w4(A, e, t) {
  var n = dr(A), i = [rn, nn].indexOf(n) >= 0 ? -1 : 1, o = typeof t == "function" ? t(Object.assign({}, e, {
    placement: A
  })) : t, l = o[0], f = o[1];
  return l = l || 0, f = (f || 0) * i, [rn, _n].indexOf(n) >= 0 ? {
    x: f,
    y: l
  } : {
    x: l,
    y: f
  };
}
function m4(A) {
  var e = A.state, t = A.options, n = A.name, i = t.offset, o = i === void 0 ? [0, 0] : i, l = D0.reduce(function(m, B) {
    return m[B] = w4(B, e.rects, o), m;
  }, {}), f = l[e.placement], c = f.x, h = f.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += c, e.modifiersData.popperOffsets.y += h), e.modifiersData[n] = l;
}
const v4 = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: m4
};
function y4(A) {
  var e = A.state, t = A.name;
  e.modifiersData[t] = $0({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const C4 = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: y4,
  data: {}
};
function Q4(A) {
  return A === "x" ? "y" : "x";
}
function F4(A) {
  var e = A.state, t = A.options, n = A.name, i = t.mainAxis, o = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !1 : l, c = t.boundary, h = t.rootBoundary, m = t.altBoundary, B = t.padding, g = t.tether, v = g === void 0 ? !0 : g, u = t.tetherOffset, C = u === void 0 ? 0 : u, F = Os(e, {
    boundary: c,
    rootBoundary: h,
    padding: B,
    altBoundary: m
  }), U = dr(e.placement), S = ho(e.placement), N = !S, x = Xp(U), P = Q4(x), R = e.modifiersData.popperOffsets, J = e.rects.reference, fA = e.rects.popper, uA = typeof C == "function" ? C(Object.assign({}, e.rects, {
    placement: e.placement
  })) : C, BA = typeof uA == "number" ? {
    mainAxis: uA,
    altAxis: uA
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, uA), FA = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, NA = {
    x: 0,
    y: 0
  };
  if (R) {
    if (o) {
      var xA, X = x === "y" ? nn : rn, CA = x === "y" ? bn : _n, tA = x === "y" ? "height" : "width", hA = R[x], _A = hA + F[X], IA = hA - F[CA], aA = v ? -fA[tA] / 2 : 0, D = S === lo ? J[tA] : fA[tA], eA = S === lo ? -fA[tA] : -J[tA], j = e.elements.arrow, T = v && j ? Wp(j) : {
        width: 0,
        height: 0
      }, k = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : P0(), rA = k[X], UA = k[CA], EA = Cs(0, J[tA], T[tA]), zA = N ? J[tA] / 2 - aA - EA - rA - BA.mainAxis : D - EA - rA - BA.mainAxis, ne = N ? -J[tA] / 2 + aA + EA + UA + BA.mainAxis : eA + EA + UA + BA.mainAxis, JA = e.elements.arrow && qs(e.elements.arrow), RA = JA ? x === "y" ? JA.clientTop || 0 : JA.clientLeft || 0 : 0, sA = (xA = FA == null ? void 0 : FA[x]) != null ? xA : 0, vA = hA + zA - sA - RA, bA = hA + ne - sA, te = Cs(v ? wc(_A, vA) : _A, hA, v ? ra(IA, bA) : IA);
      R[x] = te, NA[x] = te - hA;
    }
    if (f) {
      var me, Ue = x === "x" ? nn : rn, Ze = x === "x" ? bn : _n, Te = R[P], $e = P === "y" ? "height" : "width", Pe = Te + F[Ue], _e = Te - F[Ze], Mt = [nn, rn].indexOf(U) !== -1, bt = (me = FA == null ? void 0 : FA[P]) != null ? me : 0, Pt = Mt ? Pe : Te - J[$e] - fA[$e] - bt + BA.altAxis, _t = Mt ? Te + J[$e] + fA[$e] - bt - BA.altAxis : _e, mt = v && Mt ? qO(Pt, Te, _t) : Cs(v ? Pt : Pe, Te, v ? _t : _e);
      R[P] = mt, NA[P] = mt - Te;
    }
    e.modifiersData[n] = NA;
  }
}
const U4 = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: F4,
  requiresIfExists: ["offset"]
};
function E4(A) {
  return {
    scrollLeft: A.scrollLeft,
    scrollTop: A.scrollTop
  };
}
function b4(A) {
  return A === fn(A) || !En(A) ? qp(A) : E4(A);
}
function _4(A) {
  var e = A.getBoundingClientRect(), t = co(e.width) / A.offsetWidth || 1, n = co(e.height) / A.offsetHeight || 1;
  return t !== 1 || n !== 1;
}
function x4(A, e, t) {
  t === void 0 && (t = !1);
  var n = En(e), i = En(e) && _4(e), o = _i(e), l = fo(A, i, t), f = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (n || !n && !t) && ((pr(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Jp(o)) && (f = b4(e)), En(e) ? (c = fo(e, !0), c.x += e.clientLeft, c.y += e.clientTop) : o && (c.x = zp(o))), {
    x: l.left + f.scrollLeft - c.x,
    y: l.top + f.scrollTop - c.y,
    width: l.width,
    height: l.height
  };
}
function I4(A) {
  var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), n = [];
  A.forEach(function(o) {
    e.set(o.name, o);
  });
  function i(o) {
    t.add(o.name);
    var l = [].concat(o.requires || [], o.requiresIfExists || []);
    l.forEach(function(f) {
      if (!t.has(f)) {
        var c = e.get(f);
        c && i(c);
      }
    }), n.push(o);
  }
  return A.forEach(function(o) {
    t.has(o.name) || i(o);
  }), n;
}
function H4(A) {
  var e = I4(A);
  return $O.reduce(function(t, n) {
    return t.concat(e.filter(function(i) {
      return i.phase === n;
    }));
  }, []);
}
function S4(A) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(A());
      });
    })), e;
  };
}
function L4(A) {
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
var Ww = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Xw() {
  for (var A = arguments.length, e = new Array(A), t = 0; t < A; t++)
    e[t] = arguments[t];
  return !e.some(function(n) {
    return !(n && typeof n.getBoundingClientRect == "function");
  });
}
function T4(A) {
  A === void 0 && (A = {});
  var e = A, t = e.defaultModifiers, n = t === void 0 ? [] : t, i = e.defaultOptions, o = i === void 0 ? Ww : i;
  return function(f, c, h) {
    h === void 0 && (h = o);
    var m = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Ww, o),
      modifiersData: {},
      elements: {
        reference: f,
        popper: c
      },
      attributes: {},
      styles: {}
    }, B = [], g = !1, v = {
      state: m,
      setOptions: function(U) {
        var S = typeof U == "function" ? U(m.options) : U;
        C(), m.options = Object.assign({}, o, m.options, S), m.scrollParents = {
          reference: ca(f) ? Qs(f) : f.contextElement ? Qs(f.contextElement) : [],
          popper: Qs(c)
        };
        var N = H4(L4([].concat(n, m.options.modifiers)));
        return m.orderedModifiers = N.filter(function(x) {
          return x.enabled;
        }), u(), v.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!g) {
          var U = m.elements, S = U.reference, N = U.popper;
          if (Xw(S, N)) {
            m.rects = {
              reference: x4(S, qs(N), m.options.strategy === "fixed"),
              popper: Wp(N)
            }, m.reset = !1, m.placement = m.options.placement, m.orderedModifiers.forEach(function(BA) {
              return m.modifiersData[BA.name] = Object.assign({}, BA.data);
            });
            for (var x = 0; x < m.orderedModifiers.length; x++) {
              if (m.reset === !0) {
                m.reset = !1, x = -1;
                continue;
              }
              var P = m.orderedModifiers[x], R = P.fn, J = P.options, fA = J === void 0 ? {} : J, uA = P.name;
              typeof R == "function" && (m = R({
                state: m,
                options: fA,
                name: uA,
                instance: v
              }) || m);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: S4(function() {
        return new Promise(function(F) {
          v.forceUpdate(), F(m);
        });
      }),
      destroy: function() {
        C(), g = !0;
      }
    };
    if (!Xw(f, c))
      return v;
    v.setOptions(h).then(function(F) {
      !g && h.onFirstUpdate && h.onFirstUpdate(F);
    });
    function u() {
      m.orderedModifiers.forEach(function(F) {
        var U = F.name, S = F.options, N = S === void 0 ? {} : S, x = F.effect;
        if (typeof x == "function") {
          var P = x({
            state: m,
            name: U,
            instance: v,
            options: N
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
var D4 = [r4, C4, t4, O0, v4, p4, U4, YO, B4], O4 = /* @__PURE__ */ T4({
  defaultModifiers: D4
}), N4 = "tippy-box", G0 = "tippy-content", M4 = "tippy-backdrop", V0 = "tippy-arrow", W0 = "tippy-svg-arrow", zi = {
  passive: !0,
  capture: !0
}, X0 = function() {
  return document.body;
};
function P4(A, e) {
  return {}.hasOwnProperty.call(A, e);
}
function vh(A, e, t) {
  if (Array.isArray(A)) {
    var n = A[e];
    return n ?? (Array.isArray(t) ? t[e] : t);
  }
  return A;
}
function jp(A, e) {
  var t = {}.toString.call(A);
  return t.indexOf("[object") === 0 && t.indexOf(e + "]") > -1;
}
function q0(A, e) {
  return typeof A == "function" ? A.apply(void 0, e) : A;
}
function qw(A, e) {
  if (e === 0)
    return A;
  var t;
  return function(n) {
    clearTimeout(t), t = setTimeout(function() {
      A(n);
    }, e);
  };
}
function K4(A, e) {
  var t = Object.assign({}, A);
  return e.forEach(function(n) {
    delete t[n];
  }), t;
}
function R4(A) {
  return A.split(/\s+/).filter(Boolean);
}
function qa(A) {
  return [].concat(A);
}
function zw(A, e) {
  A.indexOf(e) === -1 && A.push(e);
}
function k4(A) {
  return A.filter(function(e, t) {
    return A.indexOf(e) === t;
  });
}
function $4(A) {
  return A.split("-")[0];
}
function mc(A) {
  return [].slice.call(A);
}
function Jw(A) {
  return Object.keys(A).reduce(function(e, t) {
    return A[t] !== void 0 && (e[t] = A[t]), e;
  }, {});
}
function Fs() {
  return document.createElement("div");
}
function Ns(A) {
  return ["Element", "Fragment"].some(function(e) {
    return jp(A, e);
  });
}
function G4(A) {
  return jp(A, "NodeList");
}
function V4(A) {
  return jp(A, "MouseEvent");
}
function W4(A) {
  return !!(A && A._tippy && A._tippy.reference === A);
}
function X4(A) {
  return Ns(A) ? [A] : G4(A) ? mc(A) : Array.isArray(A) ? A : mc(document.querySelectorAll(A));
}
function yh(A, e) {
  A.forEach(function(t) {
    t && (t.style.transitionDuration = e + "ms");
  });
}
function jw(A, e) {
  A.forEach(function(t) {
    t && t.setAttribute("data-state", e);
  });
}
function q4(A) {
  var e, t = qa(A), n = t[0];
  return n != null && (e = n.ownerDocument) != null && e.body ? n.ownerDocument : document;
}
function z4(A, e) {
  var t = e.clientX, n = e.clientY;
  return A.every(function(i) {
    var o = i.popperRect, l = i.popperState, f = i.props, c = f.interactiveBorder, h = $4(l.placement), m = l.modifiersData.offset;
    if (!m)
      return !0;
    var B = h === "bottom" ? m.top.y : 0, g = h === "top" ? m.bottom.y : 0, v = h === "right" ? m.left.x : 0, u = h === "left" ? m.right.x : 0, C = o.top - n + B > c, F = n - o.bottom - g > c, U = o.left - t + v > c, S = t - o.right - u > c;
    return C || F || U || S;
  });
}
function Ch(A, e, t) {
  var n = e + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(i) {
    A[n](i, t);
  });
}
function Yw(A, e) {
  for (var t = e; t; ) {
    var n;
    if (A.contains(t))
      return !0;
    t = t.getRootNode == null || (n = t.getRootNode()) == null ? void 0 : n.host;
  }
  return !1;
}
var ur = {
  isTouch: !1
}, Zw = 0;
function J4() {
  ur.isTouch || (ur.isTouch = !0, window.performance && document.addEventListener("mousemove", z0));
}
function z0() {
  var A = performance.now();
  A - Zw < 20 && (ur.isTouch = !1, document.removeEventListener("mousemove", z0)), Zw = A;
}
function j4() {
  var A = document.activeElement;
  if (W4(A)) {
    var e = A._tippy;
    A.blur && !e.state.isVisible && A.blur();
  }
}
function Y4() {
  document.addEventListener("touchstart", J4, zi), window.addEventListener("blur", j4);
}
var Z4 = typeof window < "u" && typeof document < "u", AN = Z4 ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function Pa(A) {
  var e = A === "destroy" ? "n already-" : " ";
  return [A + "() was called on a" + e + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function Am(A) {
  var e = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return A.replace(e, " ").replace(t, "").trim();
}
function eN(A) {
  return Am(`
  %ctippy.js

  %c` + Am(A) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function J0(A) {
  return [
    eN(A),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var Ms;
process.env.NODE_ENV !== "production" && tN();
function tN() {
  Ms = /* @__PURE__ */ new Set();
}
function Kr(A, e) {
  if (A && !Ms.has(e)) {
    var t;
    Ms.add(e), (t = console).warn.apply(t, J0(e));
  }
}
function dd(A, e) {
  if (A && !Ms.has(e)) {
    var t;
    Ms.add(e), (t = console).error.apply(t, J0(e));
  }
}
function nN(A) {
  var e = !A, t = Object.prototype.toString.call(A) === "[object Object]" && !A.addEventListener;
  dd(e, ["tippy() was passed", "`" + String(A) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), dd(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var j0 = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, rN = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, cn = Object.assign({
  appendTo: X0,
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
}, j0, rN), iN = Object.keys(cn), aN = function(e) {
  process.env.NODE_ENV !== "production" && Z0(e, []);
  var t = Object.keys(e);
  t.forEach(function(n) {
    cn[n] = e[n];
  });
};
function Y0(A) {
  var e = A.plugins || [], t = e.reduce(function(n, i) {
    var o = i.name, l = i.defaultValue;
    if (o) {
      var f;
      n[o] = A[o] !== void 0 ? A[o] : (f = cn[o]) != null ? f : l;
    }
    return n;
  }, {});
  return Object.assign({}, A, t);
}
function oN(A, e) {
  var t = e ? Object.keys(Y0(Object.assign({}, cn, {
    plugins: e
  }))) : iN, n = t.reduce(function(i, o) {
    var l = (A.getAttribute("data-tippy-" + o) || "").trim();
    if (!l)
      return i;
    if (o === "content")
      i[o] = l;
    else
      try {
        i[o] = JSON.parse(l);
      } catch {
        i[o] = l;
      }
    return i;
  }, {});
  return n;
}
function em(A, e) {
  var t = Object.assign({}, e, {
    content: q0(e.content, [A])
  }, e.ignoreAttributes ? {} : oN(A, e.plugins));
  return t.aria = Object.assign({}, cn.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function Z0(A, e) {
  A === void 0 && (A = {}), e === void 0 && (e = []);
  var t = Object.keys(A);
  t.forEach(function(n) {
    var i = K4(cn, Object.keys(j0)), o = !P4(i, n);
    o && (o = e.filter(function(l) {
      return l.name === n;
    }).length === 0), Kr(o, ["`" + n + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var sN = function() {
  return "innerHTML";
};
function pd(A, e) {
  A[sN()] = e;
}
function tm(A) {
  var e = Fs();
  return A === !0 ? e.className = V0 : (e.className = W0, Ns(A) ? e.appendChild(A) : pd(e, A)), e;
}
function nm(A, e) {
  Ns(e.content) ? (pd(A, ""), A.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? pd(A, e.content) : A.textContent = e.content);
}
function gd(A) {
  var e = A.firstElementChild, t = mc(e.children);
  return {
    box: e,
    content: t.find(function(n) {
      return n.classList.contains(G0);
    }),
    arrow: t.find(function(n) {
      return n.classList.contains(V0) || n.classList.contains(W0);
    }),
    backdrop: t.find(function(n) {
      return n.classList.contains(M4);
    })
  };
}
function Ay(A) {
  var e = Fs(), t = Fs();
  t.className = N4, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var n = Fs();
  n.className = G0, n.setAttribute("data-state", "hidden"), nm(n, A.props), e.appendChild(t), t.appendChild(n), i(A.props, A.props);
  function i(o, l) {
    var f = gd(e), c = f.box, h = f.content, m = f.arrow;
    l.theme ? c.setAttribute("data-theme", l.theme) : c.removeAttribute("data-theme"), typeof l.animation == "string" ? c.setAttribute("data-animation", l.animation) : c.removeAttribute("data-animation"), l.inertia ? c.setAttribute("data-inertia", "") : c.removeAttribute("data-inertia"), c.style.maxWidth = typeof l.maxWidth == "number" ? l.maxWidth + "px" : l.maxWidth, l.role ? c.setAttribute("role", l.role) : c.removeAttribute("role"), (o.content !== l.content || o.allowHTML !== l.allowHTML) && nm(h, A.props), l.arrow ? m ? o.arrow !== l.arrow && (c.removeChild(m), c.appendChild(tm(l.arrow))) : c.appendChild(tm(l.arrow)) : m && c.removeChild(m);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
Ay.$$tippy = !0;
var uN = 1, gl = [], Qh = [];
function lN(A, e) {
  var t = em(A, Object.assign({}, cn, Y0(Jw(e)))), n, i, o, l = !1, f = !1, c = !1, h = !1, m, B, g, v = [], u = qw(vA, t.interactiveDebounce), C, F = uN++, U = null, S = k4(t.plugins), N = {
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
  }, x = {
    // properties
    id: F,
    reference: A,
    popper: Fs(),
    popperInstance: U,
    props: t,
    state: N,
    plugins: S,
    // methods
    clearDelayTimeouts: Pt,
    setProps: _t,
    setContent: mt,
    show: hn,
    hide: vr,
    hideWithInteractivity: xi,
    enable: Mt,
    disable: bt,
    unmount: zr,
    destroy: Jr
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && dd(!0, "render() function has not been supplied."), x;
  var P = t.render(x), R = P.popper, J = P.onUpdate;
  R.setAttribute("data-tippy-root", ""), R.id = "tippy-" + x.id, x.popper = R, A._tippy = x, R._tippy = x;
  var fA = S.map(function(cA) {
    return cA.fn(x);
  }), uA = A.hasAttribute("aria-expanded");
  return JA(), aA(), hA(), _A("onCreate", [x]), t.showOnCreate && Pe(), R.addEventListener("mouseenter", function() {
    x.props.interactive && x.state.isVisible && x.clearDelayTimeouts();
  }), R.addEventListener("mouseleave", function() {
    x.props.interactive && x.props.trigger.indexOf("mouseenter") >= 0 && X().addEventListener("mousemove", u);
  }), x;
  function BA() {
    var cA = x.props.touch;
    return Array.isArray(cA) ? cA : [cA, 0];
  }
  function FA() {
    return BA()[0] === "hold";
  }
  function NA() {
    var cA;
    return !!((cA = x.props.render) != null && cA.$$tippy);
  }
  function xA() {
    return C || A;
  }
  function X() {
    var cA = xA().parentNode;
    return cA ? q4(cA) : document;
  }
  function CA() {
    return gd(R);
  }
  function tA(cA) {
    return x.state.isMounted && !x.state.isVisible || ur.isTouch || m && m.type === "focus" ? 0 : vh(x.props.delay, cA ? 0 : 1, cn.delay);
  }
  function hA(cA) {
    cA === void 0 && (cA = !1), R.style.pointerEvents = x.props.interactive && !cA ? "" : "none", R.style.zIndex = "" + x.props.zIndex;
  }
  function _A(cA, DA, XA) {
    if (XA === void 0 && (XA = !0), fA.forEach(function(ye) {
      ye[cA] && ye[cA].apply(ye, DA);
    }), XA) {
      var ve;
      (ve = x.props)[cA].apply(ve, DA);
    }
  }
  function IA() {
    var cA = x.props.aria;
    if (cA.content) {
      var DA = "aria-" + cA.content, XA = R.id, ve = qa(x.props.triggerTarget || A);
      ve.forEach(function(ye) {
        var ut = ye.getAttribute(DA);
        if (x.state.isVisible)
          ye.setAttribute(DA, ut ? ut + " " + XA : XA);
        else {
          var xt = ut && ut.replace(XA, "").trim();
          xt ? ye.setAttribute(DA, xt) : ye.removeAttribute(DA);
        }
      });
    }
  }
  function aA() {
    if (!(uA || !x.props.aria.expanded)) {
      var cA = qa(x.props.triggerTarget || A);
      cA.forEach(function(DA) {
        x.props.interactive ? DA.setAttribute("aria-expanded", x.state.isVisible && DA === xA() ? "true" : "false") : DA.removeAttribute("aria-expanded");
      });
    }
  }
  function D() {
    X().removeEventListener("mousemove", u), gl = gl.filter(function(cA) {
      return cA !== u;
    });
  }
  function eA(cA) {
    if (!(ur.isTouch && (c || cA.type === "mousedown"))) {
      var DA = cA.composedPath && cA.composedPath()[0] || cA.target;
      if (!(x.props.interactive && Yw(R, DA))) {
        if (qa(x.props.triggerTarget || A).some(function(XA) {
          return Yw(XA, DA);
        })) {
          if (ur.isTouch || x.state.isVisible && x.props.trigger.indexOf("click") >= 0)
            return;
        } else
          _A("onClickOutside", [x, cA]);
        x.props.hideOnClick === !0 && (x.clearDelayTimeouts(), x.hide(), f = !0, setTimeout(function() {
          f = !1;
        }), x.state.isMounted || rA());
      }
    }
  }
  function j() {
    c = !0;
  }
  function T() {
    c = !1;
  }
  function k() {
    var cA = X();
    cA.addEventListener("mousedown", eA, !0), cA.addEventListener("touchend", eA, zi), cA.addEventListener("touchstart", T, zi), cA.addEventListener("touchmove", j, zi);
  }
  function rA() {
    var cA = X();
    cA.removeEventListener("mousedown", eA, !0), cA.removeEventListener("touchend", eA, zi), cA.removeEventListener("touchstart", T, zi), cA.removeEventListener("touchmove", j, zi);
  }
  function UA(cA, DA) {
    zA(cA, function() {
      !x.state.isVisible && R.parentNode && R.parentNode.contains(R) && DA();
    });
  }
  function EA(cA, DA) {
    zA(cA, DA);
  }
  function zA(cA, DA) {
    var XA = CA().box;
    function ve(ye) {
      ye.target === XA && (Ch(XA, "remove", ve), DA());
    }
    if (cA === 0)
      return DA();
    Ch(XA, "remove", B), Ch(XA, "add", ve), B = ve;
  }
  function ne(cA, DA, XA) {
    XA === void 0 && (XA = !1);
    var ve = qa(x.props.triggerTarget || A);
    ve.forEach(function(ye) {
      ye.addEventListener(cA, DA, XA), v.push({
        node: ye,
        eventType: cA,
        handler: DA,
        options: XA
      });
    });
  }
  function JA() {
    FA() && (ne("touchstart", sA, {
      passive: !0
    }), ne("touchend", bA, {
      passive: !0
    })), R4(x.props.trigger).forEach(function(cA) {
      if (cA !== "manual")
        switch (ne(cA, sA), cA) {
          case "mouseenter":
            ne("mouseleave", bA);
            break;
          case "focus":
            ne(AN ? "focusout" : "blur", te);
            break;
          case "focusin":
            ne("focusout", te);
            break;
        }
    });
  }
  function RA() {
    v.forEach(function(cA) {
      var DA = cA.node, XA = cA.eventType, ve = cA.handler, ye = cA.options;
      DA.removeEventListener(XA, ve, ye);
    }), v = [];
  }
  function sA(cA) {
    var DA, XA = !1;
    if (!(!x.state.isEnabled || me(cA) || f)) {
      var ve = ((DA = m) == null ? void 0 : DA.type) === "focus";
      m = cA, C = cA.currentTarget, aA(), !x.state.isVisible && V4(cA) && gl.forEach(function(ye) {
        return ye(cA);
      }), cA.type === "click" && (x.props.trigger.indexOf("mouseenter") < 0 || l) && x.props.hideOnClick !== !1 && x.state.isVisible ? XA = !0 : Pe(cA), cA.type === "click" && (l = !XA), XA && !ve && _e(cA);
    }
  }
  function vA(cA) {
    var DA = cA.target, XA = xA().contains(DA) || R.contains(DA);
    if (!(cA.type === "mousemove" && XA)) {
      var ve = $e().concat(R).map(function(ye) {
        var ut, xt = ye._tippy, xn = (ut = xt.popperInstance) == null ? void 0 : ut.state;
        return xn ? {
          popperRect: ye.getBoundingClientRect(),
          popperState: xn,
          props: t
        } : null;
      }).filter(Boolean);
      z4(ve, cA) && (D(), _e(cA));
    }
  }
  function bA(cA) {
    var DA = me(cA) || x.props.trigger.indexOf("click") >= 0 && l;
    if (!DA) {
      if (x.props.interactive) {
        x.hideWithInteractivity(cA);
        return;
      }
      _e(cA);
    }
  }
  function te(cA) {
    x.props.trigger.indexOf("focusin") < 0 && cA.target !== xA() || x.props.interactive && cA.relatedTarget && R.contains(cA.relatedTarget) || _e(cA);
  }
  function me(cA) {
    return ur.isTouch ? FA() !== cA.type.indexOf("touch") >= 0 : !1;
  }
  function Ue() {
    Ze();
    var cA = x.props, DA = cA.popperOptions, XA = cA.placement, ve = cA.offset, ye = cA.getReferenceClientRect, ut = cA.moveTransition, xt = NA() ? gd(R).arrow : null, xn = ye ? {
      getBoundingClientRect: ye,
      contextElement: ye.contextElement || xA()
    } : A, Ii = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(jr) {
        var dn = jr.state;
        if (NA()) {
          var Si = CA(), Yr = Si.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(yr) {
            yr === "placement" ? Yr.setAttribute("data-placement", dn.placement) : dn.attributes.popper["data-popper-" + yr] ? Yr.setAttribute("data-" + yr, "") : Yr.removeAttribute("data-" + yr);
          }), dn.attributes.popper = {};
        }
      }
    }, In = [{
      name: "offset",
      options: {
        offset: ve
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
        adaptive: !ut
      }
    }, Ii];
    NA() && xt && In.push({
      name: "arrow",
      options: {
        element: xt,
        padding: 3
      }
    }), In.push.apply(In, (DA == null ? void 0 : DA.modifiers) || []), x.popperInstance = O4(xn, R, Object.assign({}, DA, {
      placement: XA,
      onFirstUpdate: g,
      modifiers: In
    }));
  }
  function Ze() {
    x.popperInstance && (x.popperInstance.destroy(), x.popperInstance = null);
  }
  function Te() {
    var cA = x.props.appendTo, DA, XA = xA();
    x.props.interactive && cA === X0 || cA === "parent" ? DA = XA.parentNode : DA = q0(cA, [XA]), DA.contains(R) || DA.appendChild(R), x.state.isMounted = !0, Ue(), process.env.NODE_ENV !== "production" && Kr(x.props.interactive && cA === cn.appendTo && XA.nextElementSibling !== R, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function $e() {
    return mc(R.querySelectorAll("[data-tippy-root]"));
  }
  function Pe(cA) {
    x.clearDelayTimeouts(), cA && _A("onTrigger", [x, cA]), k();
    var DA = tA(!0), XA = BA(), ve = XA[0], ye = XA[1];
    ur.isTouch && ve === "hold" && ye && (DA = ye), DA ? n = setTimeout(function() {
      x.show();
    }, DA) : x.show();
  }
  function _e(cA) {
    if (x.clearDelayTimeouts(), _A("onUntrigger", [x, cA]), !x.state.isVisible) {
      rA();
      return;
    }
    if (!(x.props.trigger.indexOf("mouseenter") >= 0 && x.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(cA.type) >= 0 && l)) {
      var DA = tA(!1);
      DA ? i = setTimeout(function() {
        x.state.isVisible && x.hide();
      }, DA) : o = requestAnimationFrame(function() {
        x.hide();
      });
    }
  }
  function Mt() {
    x.state.isEnabled = !0;
  }
  function bt() {
    x.hide(), x.state.isEnabled = !1;
  }
  function Pt() {
    clearTimeout(n), clearTimeout(i), cancelAnimationFrame(o);
  }
  function _t(cA) {
    if (process.env.NODE_ENV !== "production" && Kr(x.state.isDestroyed, Pa("setProps")), !x.state.isDestroyed) {
      _A("onBeforeUpdate", [x, cA]), RA();
      var DA = x.props, XA = em(A, Object.assign({}, DA, Jw(cA), {
        ignoreAttributes: !0
      }));
      x.props = XA, JA(), DA.interactiveDebounce !== XA.interactiveDebounce && (D(), u = qw(vA, XA.interactiveDebounce)), DA.triggerTarget && !XA.triggerTarget ? qa(DA.triggerTarget).forEach(function(ve) {
        ve.removeAttribute("aria-expanded");
      }) : XA.triggerTarget && A.removeAttribute("aria-expanded"), aA(), hA(), J && J(DA, XA), x.popperInstance && (Ue(), $e().forEach(function(ve) {
        requestAnimationFrame(ve._tippy.popperInstance.forceUpdate);
      })), _A("onAfterUpdate", [x, cA]);
    }
  }
  function mt(cA) {
    x.setProps({
      content: cA
    });
  }
  function hn() {
    process.env.NODE_ENV !== "production" && Kr(x.state.isDestroyed, Pa("show"));
    var cA = x.state.isVisible, DA = x.state.isDestroyed, XA = !x.state.isEnabled, ve = ur.isTouch && !x.props.touch, ye = vh(x.props.duration, 0, cn.duration);
    if (!(cA || DA || XA || ve) && !xA().hasAttribute("disabled") && (_A("onShow", [x], !1), x.props.onShow(x) !== !1)) {
      if (x.state.isVisible = !0, NA() && (R.style.visibility = "visible"), hA(), k(), x.state.isMounted || (R.style.transition = "none"), NA()) {
        var ut = CA(), xt = ut.box, xn = ut.content;
        yh([xt, xn], 0);
      }
      g = function() {
        var In;
        if (!(!x.state.isVisible || h)) {
          if (h = !0, R.offsetHeight, R.style.transition = x.props.moveTransition, NA() && x.props.animation) {
            var Hi = CA(), jr = Hi.box, dn = Hi.content;
            yh([jr, dn], ye), jw([jr, dn], "visible");
          }
          IA(), aA(), zw(Qh, x), (In = x.popperInstance) == null || In.forceUpdate(), _A("onMount", [x]), x.props.animation && NA() && EA(ye, function() {
            x.state.isShown = !0, _A("onShown", [x]);
          });
        }
      }, Te();
    }
  }
  function vr() {
    process.env.NODE_ENV !== "production" && Kr(x.state.isDestroyed, Pa("hide"));
    var cA = !x.state.isVisible, DA = x.state.isDestroyed, XA = !x.state.isEnabled, ve = vh(x.props.duration, 1, cn.duration);
    if (!(cA || DA || XA) && (_A("onHide", [x], !1), x.props.onHide(x) !== !1)) {
      if (x.state.isVisible = !1, x.state.isShown = !1, h = !1, l = !1, NA() && (R.style.visibility = "hidden"), D(), rA(), hA(!0), NA()) {
        var ye = CA(), ut = ye.box, xt = ye.content;
        x.props.animation && (yh([ut, xt], ve), jw([ut, xt], "hidden"));
      }
      IA(), aA(), x.props.animation ? NA() && UA(ve, x.unmount) : x.unmount();
    }
  }
  function xi(cA) {
    process.env.NODE_ENV !== "production" && Kr(x.state.isDestroyed, Pa("hideWithInteractivity")), X().addEventListener("mousemove", u), zw(gl, u), u(cA);
  }
  function zr() {
    process.env.NODE_ENV !== "production" && Kr(x.state.isDestroyed, Pa("unmount")), x.state.isVisible && x.hide(), x.state.isMounted && (Ze(), $e().forEach(function(cA) {
      cA._tippy.unmount();
    }), R.parentNode && R.parentNode.removeChild(R), Qh = Qh.filter(function(cA) {
      return cA !== x;
    }), x.state.isMounted = !1, _A("onHidden", [x]));
  }
  function Jr() {
    process.env.NODE_ENV !== "production" && Kr(x.state.isDestroyed, Pa("destroy")), !x.state.isDestroyed && (x.clearDelayTimeouts(), x.unmount(), RA(), delete A._tippy, x.state.isDestroyed = !0, _A("onDestroy", [x]));
  }
}
function zs(A, e) {
  e === void 0 && (e = {});
  var t = cn.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (nN(A), Z0(e, t)), Y4();
  var n = Object.assign({}, e, {
    plugins: t
  }), i = X4(A);
  if (process.env.NODE_ENV !== "production") {
    var o = Ns(n.content), l = i.length > 1;
    Kr(o && l, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var f = i.reduce(function(c, h) {
    var m = h && lN(h, n);
    return m && c.push(m), c;
  }, []);
  return Ns(A) ? f[0] : f;
}
zs.defaultProps = cn;
zs.setDefaultProps = aN;
zs.currentInput = ur;
Object.assign({}, O0, {
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
zs.setDefaultProps({
  render: Ay
});
const cN = "_btn_pqsxd_1", fN = "_btnGroup_pqsxd_4", Bl = {
  btn: cN,
  btnGroup: fN
}, hN = function(A) {
  var e = {
    onAnnotationSelectFunction: oe.noop(),
    drawing: null,
    popoverId: ""
  }, t = Le.merge({}, e, A), n = {
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
    c.select("span.genelabel").text(function(g) {
      return g.label;
    }).style("font-weight", function(g) {
      return g.selected ? "bold" : "normal";
    }).style("opacity", function(g) {
      return g.visible || g.selected ? 1 : g.normedScore ? g.normedScore : g.importance;
    }).style("color", function(g) {
      return h.visible || h.selected ? h.color : null;
    });
    var m = c.select("div.btn-group");
    m.selectAll("a").data(["show", "hide", "auto"]).classed("disabled", function(g) {
      return g == "show" && h.visible || g == "hide" && h.hidden && !h.visible || g == "auto" && !h.hidden && !h.visible;
    });
  }, o = function(c, h, m) {
    var B = m.data.genesList, g = h.selectAll("p").data(B);
    c.append("span").text("Cluster"), c.append("div.btn-group").selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(F) {
      return F;
    }).classed(`${Bl.btn}`, !0)``.on("click", function(F) {
      var U = n[F];
      B.forEach(U), g.each(function(S) {
        var N = WA(this);
        i(N, S);
      }), t.onAnnotationSelectFunction();
    });
    var u = g.enter(), C = u.append("p");
    C.append("span").classed("genelabel", !0), C.append("div").classed("btn-group", !0), g.each(function(F) {
      var U = WA(this), S = U.select("div.btn-group");
      S.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(x) {
        return x;
      }).classed(`${Bl.btn}`, !0).on("click", function(x) {
        var P = n[x];
        P(F), t.onAnnotationSelectFunction(), i(U, F);
      });
    }), g.each(function(F) {
      var U = WA(this);
      i(U, F);
    });
  }, l = function(c, h, m) {
    var B = m.data;
    c.append("a").attr("href", B.link).text(B.label), h.append("p").text(
      "Chromosome " + B.chromosome + ": " + B.start + "-" + B.end
    ), B.score && h.append("p").text("Score: " + parseFloat(B.score).toFixed(3)), h.append("hr");
    var g = h.append("p").style("float", "right").classed(Bl.btnGroup, !0), v = function() {
      let u = g.selectAll("a").data(["show", "hide", "auto"]);
      u.enter().append("a").attr("href", "#").text(function(C) {
        return C;
      }).classed(`${Bl.btn}`, !0).on("click", function(C) {
        var F = n[C];
        F(B), t.onAnnotationSelectFunction(), v();
      }), u.classed("disabled", function(C) {
        return C == "show" && B.visible || C == "hide" && B.hidden && !B.visible || C == "auto" && !B.hidden && !B.visible;
      });
    };
    v();
  }, f = {};
  return f.geneAnnotationsPopoverFunction = function(c, h) {
    var m = c.data.type == "geneslist";
    WA(t.popoverId).attr("class", "popover");
    let B = WA(t.popoverId).select(".popover-title"), g = WA(t.popoverId).select(".popover-content");
    B.selectAll("*").remove(), B.text(""), g.selectAll("*").remove(), g.text(""), m ? o(B, g, c) : l(B, g, c);
    var v = h.target;
    oe(".gene-annotation-popover").remove(), zs(v, {
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
      onShow(u) {
      },
      onHide(u) {
      }
    }), v._tippy.show(), oe(document).on("click", function(u) {
      oe(u.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || oe(".gene-annotation-popover").remove();
    }), oe(t.popoverId).on("mousedown mousewheel", function(u) {
      u.stopPropagation();
    });
  }, f;
}, dN = function(A) {
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
  }, t = Le.merge({}, e, A), n = null, i = function() {
    return fa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, o = function(c, h) {
    Le.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", n = hN(t);
    var m = i(), B = c.selectAll("g.gene-annotation").data(h.layout.annotationNodes, function(C) {
      return C.data.id;
    }), g = B.enter().append("g").classed("gene-annotation", !0);
    g.append("line").classed("midpoint-line", !0), g.append("path").classed("link", !0).attr("d", function(C) {
      return C.data.path;
    }), t.labelRectangles && g.append("rect").classed("labella", !0), g.append("text").attr("x", function(C) {
      return C.x + 0.1 * t.annotationLabelSize;
    }).attr("y", function(C) {
      return C.y + 0.4 * t.annotationLabelSize;
    }), c.selectAll("g.gene-annotation").attr("id", function(C) {
      return "feature_" + C.data.id;
    }).attr("data-bs-toggle", "popover").attr("data-bs-trigger", "hover").attr("data-bs-html", "true"), c.selectAll("g.gene-annotation").classed("selected", function(C) {
      return C.data.selected;
    }), c.selectAll("g.gene-annotation").select("line.midpoint-line").attr("x1", -(t.chromosomeWidth * 0.5)).attr("y1", function(C) {
      return m(C.data.midpoint);
    }).attr("y2", function(C) {
      return m(C.data.midpoint);
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
    var u = c.selectAll("g.gene-annotation").exit();
    u.remove();
  }, l = function(c) {
    c.select("rect.border").empty() && c.append("rect").classed("border", !0), c.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  };
  function f(c) {
    c.each(function(h) {
      var m = WA(this).selectAll(".gene-annotations").data([h]);
      m.enter().append("g").attr("class", "gene-annotations"), m.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ).attr("id", function(B) {
        return "annotation_" + B.number;
      }), o(m, h), m.exit().remove(), t.border && l(m);
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
}, pN = function(A) {
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
  }, t = Le.merge({}, e, A), n = function() {
    return fa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h, m, B, g) {
    var v = {};
    g.map(function(P, R) {
      v[P] = R;
    });
    var u = n(), C = h.selectAll("rect.snp-annotation").data(B, function(P) {
      return P.id;
    }), F = 4, U = function(P) {
      return t.layout.width - 0.2 * t.layout.chromosomeWidth * (1 + v[P.trait]);
    }, S = function(P) {
      return u(P.midpoint) - 0.5 * Math.max(F / t.scale, u(10));
    }, N = Math.max(F / t.scale, u(10)), x = 0.2 * t.layout.chromosomeWidth;
    C.attr("x", U).attr("y", S).attr("width", x).attr("height", N), C.enter().append("rect").attr("fill", function(P) {
      return P.color;
    }).attr("opacity", function(P) {
      return P.importance;
    }).attr("class", "snp-annotation").attr("x", U).attr("y", S).attr("width", x).attr("height", N), C.exit().remove(), C.on("contextmenu", function(P) {
    });
  }, o = function(h, m, B) {
    var g = 500, v = n();
    t.layout.width;
    var u = 0.3 * t.layout.chromosomeWidth, C = 0.4 * t.layout.chromosomeWidth, F = m.layout.qtlNodes.some(function(D) {
      return D.displayLabel;
    });
    F && (C = C * 1.5);
    var U = B * 0.2 * t.layout.chromosomeWidth, S = function(D) {
      return t.layout.width - D.labelPosition * (C + u) - U;
    }, N = function(D) {
      return t.layout.width - D.position * (C + u) - U;
    }, x = h.selectAll("g.qtl-annotation").data(m.layout.qtlNodes, function(D) {
      return D.id;
    }), P = x.enter().append("g").classed("qtl-annotation infobox", !0);
    P.append("rect").classed("qtl-hoverbox", !0);
    var R = P.append("rect").classed("qtl-selector infobox", !0), J = {}, fA = {};
    x.exit().select("rect").each(function(D) {
      J[D.index] = Le.pick(this, ["x", "y", "width", "height"]), J[D.index].midpoint = D.midpoint, J[D.index].position = D.position;
    }), R.each(function(D) {
      fA[D.index] = Le.pick(this, ["x", "y", "width", "height"]), fA[D.index].midpoint = D.midpoint, fA[D.index].position = D.position;
    });
    var uA = function(D, eA, j, T) {
      return Le.has(D, eA) ? D[eA][j].animVal.value : T;
    };
    R.attr("x", function(D) {
      return uA(J, D.parentIndex, "x", N(D));
    }).attr("y", function(D) {
      return uA(J, D.parentIndex, "y", v(D.start));
    }).attr("width", u).attr("height", function(D) {
      return uA(
        J,
        D.parentIndex,
        "height",
        v(D.end) - v(D.start)
      );
    }), x.attr("id", function(D) {
      return "feature_" + D.id;
    }), x.select("rect.qtl-hoverbox").attr("x", function(D) {
      return N(D);
    }).attr("y", function(D) {
      return v(D.start);
    }).attr("width", function(D) {
      return D.position * (C + u) + t.chromosomeWidth + U;
    }).attr("height", function(D) {
      return v(D.end) - v(D.start);
    }).attr("fill", function(D) {
      return D.color;
    }).attr("visibility", function(D) {
      return D.hover ? "visible" : "hidden";
    }), x.select("rect.qtl-selector").transition().duration(g).attr("x", N).attr("y", function(D) {
      return v(D.start);
    }).attr("width", u).attr("height", function(D) {
      return v(D.end) - v(D.start);
    }), x.select("rect.qtl-selector").style("fill", function(D) {
      return D.color;
    }), x.exit().select("rect").transition().duration(g).attr("x", function(D) {
      return uA(fA, D.parentIndex, "x", N(D));
    }).attr("y", function(D) {
      return uA(fA, D.parentIndex, "y", v(D.start));
    }).attr("width", function(D) {
      return u;
    }).attr("height", function(D) {
      return uA(
        fA,
        D.parentIndex,
        "height",
        v(D.end) - v(D.start)
      );
    }).remove(), x.exit().remove();
    var BA = function(D) {
      return v(D.midpoint);
    }, FA = function(D) {
      return D.displayLabel === "show" ? "visible" : D.displayLabel === "hide" ? "hidden" : !0;
    }, NA = P.append("g").classed("qtl-count-group", !0), xA = x.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(D) {
        var eA = D.type == "qtllist" ? [D] : [];
        return eA;
      },
      function(D) {
        return "label_" + D.id;
      }
    ), X = xA.enter(), CA = X.append("g").classed("qtllist", !0);
    CA.append("circle").classed("qtl-count", !0), CA.append("text").classed("qtl-count", !0), NA.each(function(D) {
      if (Le.has(fA, D.index))
        if (Le.has(J, D.parentIndex)) {
          let T = J[D.parentIndex];
          var eA = t.layout.width - T.position * (C + u), j = v(T.midpoint);
          WA(this).attr(
            "transform",
            "translate(" + (eA + 0.5 * u) + "," + j + ")"
          );
        } else
          WA(this).attr("transform", function(T) {
            return T ? "translate(" + (N(T) + 0.5 * u) + "," + BA(T) + ")" : "translate(0,0)";
          });
    }), x.select("g.qtl-count-group").transition().duration(g).attr("transform", function(D) {
      return D ? "translate(" + (N(D) + 0.5 * u) + "," + BA(D) + ")" : "translate(0,0)";
    }), x.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", u + "px").style("visibility", "visible").style("fill", function(D) {
      return D.color;
    }).attr("id", function(D) {
      return D.id;
    });
    var tA = Math.min(
      Math.max(10 / t.scale, u),
      14 / t.scale
    );
    x.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", tA + "px").style(
      "visibility",
      tA < 2 * u ? "visible" : "hidden"
    ).text(function(D) {
      return D.count;
    }), xA.exit().remove(), P.append("g").classed("qtl-label-group", !0);
    var hA = x.select("g.qtl-label-group").selectAll("g.qtl").data(
      function(D) {
        var eA = D.displayLabel ? [D] : [];
        return eA;
      },
      function(D) {
        return "label_" + D.id;
      }
    );
    hA.exit().remove(), hA.transition().duration(g).attr("transform", function(D) {
      return "translate(" + (S(D) + 0.5 * u) + "," + BA(D) + ")";
    });
    var _A = hA.enter(), IA = _A.append("g").classed("qtl", !0).attr("transform", function(D) {
      return "translate(" + (S(D) + 0.5 * u) + "," + BA(D) + ")";
    });
    IA.append("text").classed("qtl-label", !0), x.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(D) {
      return D.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", FA).text(function(D) {
      return D.screenLabel;
    });
    var aA = function(D) {
      D.on("mouseenter", function(eA) {
        eA.hover = !0, o(h, m, B);
      }).on("mouseout", function(eA) {
        eA.hover = !1, o(h, m, B);
      }).on("click", function(eA) {
        eA.hover = !eA.hover, o(h, m, B);
      });
    };
    aA(x.select("rect.qtl-selector")), aA(x.select("circle.qtl-count")), aA(x.select("text.qtl-count")), x.on("contextmenu", function(D) {
      var eA = WA("#clusterPopover");
      eA.attr("class", "popover");
      var j = eA.select(".popover-title");
      j.selectAll("*").remove(), j.text(""), j.text(
        "Chromosome " + D.chromosome + ": " + D.start + "-" + D.end
      ), oe.fn.redraw = function() {
        return oe(this).each(function() {
          this.offsetHeight;
        });
      }, T = eA.select(".popover-content"), T.selectAll("*").remove(), T.text("");
      var T = eA.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        D.type == "qtllist" ? D.qtlList : [D]
      ), k = T.enter();
      k.append("p").classed("popover-annotation", !0);
      var rA = T.append("div").attr("class", "checkbox").append("label");
      rA.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(UA) {
        return UA.selected;
      }).on("click", function(UA) {
        UA.selected = !UA.selected, T.classed("selected", function(EA) {
          return EA.selected;
        }), t.onAnnotationSelectFunction();
      }), rA.append("a").attr("href", function(UA) {
        return UA.link;
      }).attr("target", "_blank").text(function(UA) {
        return UA.label;
      }), T.classed("selected", function(UA) {
        return UA.selected;
      });
    });
  }, l = function(h) {
    h.select("rect.border").empty() && h.append("rect").classed("border", !0), h.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  }, f = function(h) {
    var m = /* @__PURE__ */ new Set();
    h.map(function(g) {
      m.add(g.trait);
    });
    var B = Array.from(m).sort();
    return B;
  };
  function c(h) {
    h.each(function(m) {
      var B = m.annotations.snps.filter(function(C) {
        return !(C.pvalue > t.maxSnpPValue);
      }), g = f(B), v = WA(this).selectAll(".qtl-annotations").data([m]);
      v.enter().append("g").attr("class", "qtl-annotations"), v.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), o(v, m, g.length), t.border && l(v), v.exit().remove();
      var u = WA(this).selectAll(".snp-annotations").data([m]);
      u.enter().append("g").attr("class", "snp-annotations"), u.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), i(u, m, B, g), u.exit().remove();
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
}, gN = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: oe.noop(),
    onExpandClusterFunction: oe.noop(),
    onLabelSelectFunction: oe.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, t = Le.merge({}, e, A);
  function n(i) {
    i.each(function(o) {
      var l = o.cellLayout, f = WA(this).selectAll(".chromosome-cell").data(o.chromosomes), c = f.enter().append("g").attr("class", "chromosome-cell");
      t.border && c.append("rect").classed("border", !0), WA(this).selectAll(".chromosome-cell").attr("transform", function(v) {
        return "translate(" + v.cell.x + "," + v.cell.y + ")";
      }), t.border && f.select("rect").attr("x", 0).attr("y", 0).attr("width", function(v) {
        return v.cell.width;
      }).attr("height", function(v) {
        return v.cell.height;
      });
      var h = dN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(l.geneAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).drawing(t.svg).scale(l.scale);
      nd(".chromosome-cell").call(h);
      var m = HO().layout(l.chromosomePosition).longestChromosome(l.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(l.scale).bands("genes").drawing(t.svg);
      nd(".chromosome-cell").call(m);
      var B = IO().layout(l.labelPosition).sizeLayout(l.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(l.longestChromosome).scale(l.scale);
      f.call(B);
      var g = pN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(l.qtlAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).showAnnotationLabels(l.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(l.scale);
      f.call(g), f.exit().remove();
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
var ey = { exports: {} };
(function(A, e) {
  (function(t, n) {
    A.exports = n();
  })(Ji, function() {
    return function(t) {
      function n(o) {
        if (i[o]) return i[o].exports;
        var l = i[o] = { exports: {}, id: o, loaded: !1 };
        return t[o].call(l.exports, l, l.exports, n), l.loaded = !0, l.exports;
      }
      var i = {};
      return n.m = t, n.c = i, n.p = "", n(0);
    }([function(t, n, i) {
      t.exports = { Node: i(1), Force: i(2), Distributor: i(3), Renderer: i(10) };
    }, function(t, n) {
      function i(f, c) {
        if (!(f instanceof c)) throw new TypeError("Cannot call a class as a function");
      }
      var o = /* @__PURE__ */ function() {
        function f(c, h) {
          for (var m = 0; m < h.length; m++) {
            var B = h[m];
            B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(c, B.key, B);
          }
        }
        return function(c, h, m) {
          return h && f(c.prototype, h), m && f(c, m), c;
        };
      }(), l = function() {
        function f(c, h, m) {
          i(this, f), this.idealPos = c, this.currentPos = c, this.width = h, this.data = m, this.layerIndex = 0;
        }
        return o(f, [{ key: "distanceFrom", value: function(c) {
          var h = this.width / 2, m = c.width / 2;
          return Math.max(this.currentPos - h, c.currentPos - m) - Math.min(this.currentPos + h, c.currentPos + m);
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
            var m = h.parent ? h.parent.currentPos : h.idealPos;
            c += Math.abs(h.currentPos - m), h = h.parent;
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
      var o = i(3), l = i(4), f = i(8), c = { nodeSpacing: 3, minPos: 0, maxPos: null, algorithm: "overlap", removeOverlap: !0, density: 0.85, stubWidth: 1 }, h = function(m) {
        var B = {}, g = l.extend({}, c), v = new o(), u = [], C = null;
        return B.nodes = function(F) {
          return arguments.length ? (u = F, C = [F.concat()], B) : u;
        }, B.getLayers = function() {
          return C;
        }, B.options = function(F) {
          if (!arguments.length) return g;
          g = l.extend(g, F);
          var U = l.pick(g, Object.keys(o.DEFAULT_OPTIONS));
          return l.isDefined(g.minPos) && l.isDefined(g.maxPos) ? U.layerWidth = g.maxPos - g.minPos : U.layerWidth = null, v.options(U), B;
        }, B.options(m), B.compute = function() {
          var F = l.pick(g, Object.keys(f.DEFAULT_OPTIONS));
          return u.forEach(function(U) {
            U.removeStub();
          }), C = v.distribute(u), C.map(function(U, S) {
            U.forEach(function(N) {
              N.layerIndex = S;
            }), g.removeOverlap && f(U, F);
          }), B;
        }, B.start = function() {
          console.log("[warning] force.start() is deprecated. Please use force.compute() instead.");
        }, B;
      };
      h.DEFAULT_OPTIONS = c, t.exports = h;
    }, function(t, n, i) {
      var o = i(4), l = i(6), f = { algorithm: "overlap", layerWidth: 1e3, density: 0.75, nodeSpacing: 3, stubWidth: 1 }, c = function(h) {
        var m = {};
        h = o.extend({}, f, h), m.options = function(g) {
          return arguments.length ? (h = o.extend(h, g), m) : h;
        }, m.computeRequiredWidth = function(g) {
          return o.sum(g, function(v) {
            return v.width + h.nodeSpacing;
          }) - h.nodeSpacing;
        }, m.maxWidthPerLayer = function() {
          return h.density * h.layerWidth;
        }, m.needToSplit = function(g) {
          return m.estimateRequiredLayers(g) > 1;
        }, m.estimateRequiredLayers = function(g) {
          return h.layerWidth ? Math.ceil(m.computeRequiredWidth(g) / m.maxWidthPerLayer()) : 1;
        };
        var B = { simple: function(g) {
          for (var v = m.estimateRequiredLayers(g), u = [], C = 0; C < v; C++) u.push([]);
          return g.forEach(function(F, U) {
            var S = U % v;
            u[S].push(F);
            for (var N = F, x = S - 1; x >= 0; x--) N = N.createStub(h.stubWidth), u[x].push(N);
          }), u;
        }, roundRobin: function(g) {
          var v = [];
          return v;
        }, overlap: function(g) {
          for (var v = [], u = m.maxWidthPerLayer(), C = g.concat(), F = m.computeRequiredWidth(C); F > u; ) {
            m.countIdealOverlaps(C);
            var U = C.concat(), S = F;
            for (C = []; U.length > 2 && S > u; ) {
              U.sort(function(BA, FA) {
                return FA.overlapCount - BA.overlapCount;
              });
              var N = U.shift();
              S -= N.width, S += h.stubWidth, N.overlaps.forEach(function(BA) {
                BA.overlapCount--;
              }), C.push(N);
            }
            v.push(U), F = m.computeRequiredWidth(C);
          }
          C.length > 0 && v.push(C);
          for (var x = v.length - 1; x >= 1; x--) for (var P = v[x], R = 0; R < P.length; R++) {
            var J = P[R];
            if (!J.isStub()) for (var fA = J, uA = x - 1; uA >= 0; uA--) fA = fA.createStub(h.stubWidth), v[uA].push(fA);
          }
          return v;
        } };
        return m.countIdealOverlaps = function(g) {
          var v = new l(h.layerWidth / 2);
          return g.forEach(function(u) {
            v.add([u.idealLeft(), u.idealRight(), u]);
          }), g.forEach(function(u) {
            var C = v.search(u.idealLeft(), u.idealRight());
            u.overlaps = C.map(function(F) {
              return F.data[2];
            }), u.overlapCount = C.length;
          }), g;
        }, m.distribute = function(g) {
          if (!g || g.length === 0) return [];
          if (h.algorithm == "none" || !o.isDefined(h.algorithm)) return [g];
          if (!m.needToSplit(g)) return [g];
          var v = g.concat().sort(function(u, C) {
            return u.idealPos - C.idealPos;
          });
          if (typeof h.algorithm == "function") return h.algorithm(v, h);
          if (B.hasOwnProperty(h.algorithm)) return B[h.algorithm](v);
          throw "Unknown algorithm: " + h.algorithm;
        }, m;
      };
      c.DEFAULT_OPTIONS = f, t.exports = c;
    }, function(t, n, i) {
      var o = { isDefined: function(l) {
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
      o.extend = i(5), t.exports = o;
    }, function(t, n) {
      var i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(h) {
        return typeof h;
      } : function(h) {
        return h && typeof Symbol == "function" && h.constructor === Symbol && h !== Symbol.prototype ? "symbol" : typeof h;
      }, o = Object.prototype.hasOwnProperty, l = Object.prototype.toString, f = function(h) {
        return typeof Array.isArray == "function" ? Array.isArray(h) : l.call(h) === "[object Array]";
      }, c = function(h) {
        if (!h || l.call(h) !== "[object Object]") return !1;
        var m = o.call(h, "constructor"), B = h.constructor && h.constructor.prototype && o.call(h.constructor.prototype, "isPrototypeOf");
        if (h.constructor && !m && !B) return !1;
        var g;
        for (g in h) ;
        return g === void 0 || o.call(h, g);
      };
      t.exports = function h() {
        var m, B, g, v, u, C, F = arguments[0], U = 1, S = arguments.length, N = !1;
        for (typeof F == "boolean" ? (N = F, F = arguments[1] || {}, U = 2) : ((typeof F > "u" ? "undefined" : i(F)) !== "object" && typeof F != "function" || F == null) && (F = {}); U < S; ++U) if (m = arguments[U], m != null) for (B in m) g = F[B], v = m[B], F !== v && (N && v && (c(v) || (u = f(v))) ? (u ? (u = !1, C = g && f(g) ? g : []) : C = g && c(g) ? g : {}, F[B] = h(N, C, v)) : v !== void 0 && (F[B] = v));
        return F;
      };
    }, function(t, n, i) {
      function o(g, v) {
        if (v || (v = {}), this.startKey = v.startKey || 0, this.endKey = v.endKey || 1, this.intervalHash = {}, this.pointTree = new B({ compare: function(u, C) {
          if (u == null) return -1;
          if (C == null) return 1;
          var F = u[0] - C[0];
          return F > 0 ? 1 : F == 0 ? 0 : -1;
        } }), this._autoIncrement = 0, !g || typeof g != "number") throw new Error("you must specify center index as the 2nd argument.");
        this.root = new h(g);
      }
      function l(g, v) {
        return v.end < g.idx ? (g.left || (g.left = new h(v.start + v.end >> 1)), l.call(this, g.left, v)) : g.idx < v.start ? (g.right || (g.right = new h(v.start + v.end >> 1)), l.call(this, g.right, v)) : g.insert(v);
      }
      function f(g, v, u) {
        if (g) return v < g.idx ? (g.starts.every(function(C) {
          var F = C.start <= v;
          return F && u.push(C.result()), F;
        }), f.call(this, g.left, v, u)) : v > g.idx ? (g.ends.every(function(C) {
          var F = C.end >= v;
          return F && u.push(C.result()), F;
        }), f.call(this, g.right, v, u)) : void g.starts.map(function(C) {
          u.push(C.result());
        });
      }
      function c(g, v, u) {
        if (v - g <= 0) throw new Error("end must be greater than start. start: " + g + ", end: " + v);
        var C = {}, F = [];
        f.call(this, this.root, g + v >> 1, F, !0), F.forEach(function(P) {
          C[P.id] = !0;
        });
        for (var U = this.pointTree.bsearch([g, null]), S = this.pointTree; U >= 0 && S[U][0] == g; ) U--;
        var N = this.pointTree.bsearch([v, null]);
        if (N >= 0) {
          for (var x = S.length - 1; N <= x && S[N][0] <= v; ) N++;
          S.slice(U + 1, N).forEach(function(P) {
            var R = P[1];
            C[R] = !0;
          }, this), Object.keys(C).forEach(function(P) {
            var R = this.intervalHash[P];
            u.push(R.result(g, v));
          }, this);
        }
      }
      function h(g) {
        this.idx = g, this.starts = new B({ compare: function(v, u) {
          if (v == null) return -1;
          if (u == null) return 1;
          var C = v.start - u.start;
          return C > 0 ? 1 : C == 0 ? 0 : -1;
        } }), this.ends = new B({ compare: function(v, u) {
          if (v == null) return -1;
          if (u == null) return 1;
          var C = v.end - u.end;
          return C < 0 ? 1 : C == 0 ? 0 : -1;
        } });
      }
      function m(g, v, u, C) {
        if (this.id = v, this.start = g[u], this.end = g[C], this.data = g, typeof this.start != "number" || typeof this.end != "number") throw new Error("start, end must be number. start: " + this.start + ", end: " + this.end);
        if (this.start >= this.end) throw new Error("start must be smaller than end. start: " + this.start + ", end: " + this.end);
      }
      var B = i(7);
      o.prototype.add = function(g, v) {
        if (this.intervalHash[v]) throw new Error("id " + v + " is already registered.");
        if (v == null) {
          for (; this.intervalHash[this._autoIncrement]; ) this._autoIncrement++;
          v = this._autoIncrement;
        }
        var u = new m(g, v, this.startKey, this.endKey);
        this.pointTree.insert([u.start, v]), this.pointTree.insert([u.end, v]), this.intervalHash[v] = u, this._autoIncrement++, l.call(this, this.root, u);
      }, o.prototype.search = function(g, v) {
        var u = [];
        if (typeof g != "number") throw new Error(g + ": invalid input");
        if (v == null) f.call(this, this.root, g, u);
        else {
          if (typeof v != "number") throw new Error(g + "," + v + ": invalid input");
          c.call(this, g, v, u);
        }
        return u;
      }, o.prototype.remove = function(g) {
      }, h.prototype.insert = function(g) {
        this.starts.insert(g), this.ends.insert(g);
      }, m.prototype.result = function(g, v) {
        var u = { id: this.id, data: this.data };
        if (typeof g == "number" && typeof v == "number") {
          var C = Math.max(this.start, g), F = Math.min(this.end, v), U = F - C;
          u.rate1 = U / (v - g), u.rate2 = U / (this.end - this.start);
        }
        return u;
      }, t.exports = o;
    }, function(t, n) {
      var i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(l) {
        return typeof l;
      } : function(l) {
        return l && typeof Symbol == "function" && l.constructor === Symbol && l !== Symbol.prototype ? "symbol" : typeof l;
      }, o = function l() {
        var f = null, c = {}, h = arguments;
        ["0", "1"].forEach(function(m) {
          var B = h[m];
          Array.isArray(B) ? f = B : B && (typeof B > "u" ? "undefined" : i(B)) == "object" && (c = B);
        }), typeof c.filter == "function" && (this._filter = c.filter), typeof c.compare == "function" ? this._compare = c.compare : typeof c.compare == "string" && l.compares[c.compare] && (this._compare = l.compares[c.compare]), this._unique = !!c.unique, c.resume && f ? f.forEach(function(m, B) {
          this.push(m);
        }, this) : f && this.insert.apply(this, f);
      };
      o.create = function(l, f) {
        return new o(l, f);
      }, o.prototype = new Array(), o.prototype.constructor = Array.prototype.constructor, o.prototype.insertOne = function(l) {
        var f = this.bsearch(l);
        return (!this._unique || this.key(l, f) == null) && !!this._filter(l, f) && (this.splice(f + 1, 0, l), f + 1);
      }, o.prototype.insert = function() {
        return Array.prototype.map.call(arguments, function(l) {
          return this.insertOne(l);
        }, this);
      }, o.prototype.remove = function(l) {
        return this.splice(l, 1), this;
      }, o.prototype.bsearch = function(l) {
        if (!this.length) return -1;
        for (var f, c = 0, h = this.length; h - c > 1; ) {
          f = Math.floor((c + h) / 2);
          var m = this[f], B = this._compare(l, m);
          if (B == 0) return f;
          B > 0 ? c = f : h = f;
        }
        return c == 0 && this._compare(this[0], l) > 0 ? -1 : c;
      }, o.prototype.key = function(l, f) {
        f == null && (f = this.bsearch(l));
        var c = f;
        if (c == -1 || this._compare(this[c], l) < 0) return c + 1 < this.length && this._compare(this[c + 1], l) == 0 ? c + 1 : null;
        for (; c >= 1 && this._compare(this[c - 1], l) == 0; ) c--;
        return c;
      }, o.prototype.keys = function(l, f) {
        var c = [];
        f == null && (f = this.bsearch(l));
        for (var h = f; h >= 0 && this._compare(this[h], l) == 0; ) c.push(h), h--;
        var m = this.length;
        for (h = f + 1; h < m && this._compare(this[h], l) == 0; ) c.push(h), h++;
        return c.length ? c : null;
      }, o.prototype.unique = function(l) {
        if (l) return this.filter(function(c, h) {
          return h == 0 || this._compare(this[h - 1], c) != 0;
        }, this);
        var f = 0;
        return this.map(function(c, h) {
          return h == 0 || this._compare(this[h - 1], c) != 0 ? null : h - f++;
        }, this).forEach(function(c) {
          c != null && this.remove(c);
        }, this), this;
      }, o.prototype.toArray = function() {
        return this.slice();
      }, o.prototype._filter = function(l, f) {
        return !0;
      }, o.compares = { number: function(l, f) {
        var c = l - f;
        return c > 0 ? 1 : c == 0 ? 0 : -1;
      }, string: function(l, f) {
        return l > f ? 1 : l == f ? 0 : -1;
      } }, o.prototype._compare = o.compares.string, t.exports = o;
    }, function(t, n, i) {
      function o(m) {
        var B = new c.Variable(m.targetPos);
        return B.node = m, B;
      }
      function l(m, B) {
        if (m.length > 0) {
          B = f.extend(h, B), m.forEach(function(R, J) {
            R.targetPos = R.parent ? R.parent.currentPos : R.idealPos, R.index = J;
          });
          for (var g = m.concat().sort(function(R, J) {
            var fA = R.targetPos - J.targetPos;
            if (fA !== 0) return fA;
            var uA = R.isStub() - J.isStub();
            return uA !== 0 ? uA : R.index - J.index;
          }).map(o), v = [], u = 1; u < g.length; u++) {
            var C = g[u - 1], F = g[u], U = void 0;
            U = C.node.isStub() && F.node.isStub() ? (C.node.width + F.node.width) / 2 + B.lineSpacing : (C.node.width + F.node.width) / 2 + B.nodeSpacing, v.push(new c.Constraint(C, F, U));
          }
          if (f.isDefined(B.minPos)) {
            var S = new c.Variable(B.minPos, 1e10), N = g[0];
            v.push(new c.Constraint(S, N, N.node.width / 2)), g.unshift(S);
          }
          if (f.isDefined(B.maxPos)) {
            var x = new c.Variable(B.maxPos, 1e10), P = f.last(g);
            v.push(new c.Constraint(P, x, P.node.width / 2)), g.push(x);
          }
          new c.Solver(g, v).solve(), g.filter(function(R) {
            return R.node;
          }).map(function(R) {
            return R.node.currentPos = Math.round(R.position()), R;
          });
        }
        return m;
      }
      var f = i(4), c = i(9), h = { lineSpacing: 2, nodeSpacing: 3, minPos: 0, maxPos: null };
      l.DEFAULT_OPTIONS = h, t.exports = l;
    }, function(t, n) {
      var i = {}, o = function() {
        function B(g) {
          this.scale = g, this.AB = 0, this.AD = 0, this.A2 = 0;
        }
        return B.prototype.addVariable = function(g) {
          var v = this.scale / g.scale, u = g.offset / g.scale, C = g.weight;
          this.AB += C * v * u, this.AD += C * v * g.desiredPosition, this.A2 += C * v * v;
        }, B.prototype.getPosn = function() {
          return (this.AD - this.AB) / this.A2;
        }, B;
      }();
      i.PositionStats = o;
      var l = function() {
        function B(g, v, u, C) {
          C === void 0 && (C = !1), this.left = g, this.right = v, this.gap = u, this.equality = C, this.active = !1, this.unsatisfiable = !1, this.left = g, this.right = v, this.gap = u, this.equality = C;
        }
        return B.prototype.slack = function() {
          return this.unsatisfiable ? Number.MAX_VALUE : this.right.scale * this.right.position() - this.gap - this.left.scale * this.left.position();
        }, B;
      }();
      i.Constraint = l;
      var f = function() {
        function B(g, v, u) {
          v === void 0 && (v = 1), u === void 0 && (u = 1), this.desiredPosition = g, this.weight = v, this.scale = u, this.offset = 0;
        }
        return B.prototype.dfdv = function() {
          return 2 * this.weight * (this.position() - this.desiredPosition);
        }, B.prototype.position = function() {
          return (this.block.ps.scale * this.block.posn + this.offset) / this.scale;
        }, B.prototype.visitNeighbours = function(g, v) {
          var u = function(C, F) {
            return C.active && g !== F && v(C, F);
          };
          this.cOut.forEach(function(C) {
            return u(C, C.right);
          }), this.cIn.forEach(function(C) {
            return u(C, C.left);
          });
        }, B;
      }();
      i.Variable = f;
      var c = function() {
        function B(g) {
          this.vars = [], g.offset = 0, this.ps = new o(g.scale), this.addVariable(g);
        }
        return B.prototype.addVariable = function(g) {
          g.block = this, this.vars.push(g), this.ps.addVariable(g), this.posn = this.ps.getPosn();
        }, B.prototype.updateWeightedPosition = function() {
          this.ps.AB = this.ps.AD = this.ps.A2 = 0;
          for (var g = 0, v = this.vars.length; g < v; ++g) this.ps.addVariable(this.vars[g]);
          this.posn = this.ps.getPosn();
        }, B.prototype.compute_lm = function(g, v, u) {
          var C = this, F = g.dfdv();
          return g.visitNeighbours(v, function(U, S) {
            var N = C.compute_lm(S, g, u);
            S === U.right ? (F += N * U.left.scale, U.lm = N) : (F += N * U.right.scale, U.lm = -N), u(U);
          }), F / g.scale;
        }, B.prototype.populateSplitBlock = function(g, v) {
          var u = this;
          g.visitNeighbours(v, function(C, F) {
            F.offset = g.offset + (F === C.right ? C.gap : -C.gap), u.addVariable(F), u.populateSplitBlock(F, g);
          });
        }, B.prototype.traverse = function(g, v, u, C) {
          var F = this;
          u === void 0 && (u = this.vars[0]), C === void 0 && (C = null), u.visitNeighbours(C, function(U, S) {
            v.push(g(U)), F.traverse(g, v, S, u);
          });
        }, B.prototype.findMinLM = function() {
          var g = null;
          return this.compute_lm(this.vars[0], null, function(v) {
            !v.equality && (g === null || v.lm < g.lm) && (g = v);
          }), g;
        }, B.prototype.findMinLMBetween = function(g, v) {
          this.compute_lm(g, null, function() {
          });
          var u = null;
          return this.findPath(g, null, v, function(C, F) {
            !C.equality && C.right === F && (u === null || C.lm < u.lm) && (u = C);
          }), u;
        }, B.prototype.findPath = function(g, v, u, C) {
          var F = this, U = !1;
          return g.visitNeighbours(v, function(S, N) {
            U || N !== u && !F.findPath(N, g, u, C) || (U = !0, C(S, N));
          }), U;
        }, B.prototype.isActiveDirectedPathBetween = function(g, v) {
          if (g === v) return !0;
          for (var u = g.cOut.length; u--; ) {
            var C = g.cOut[u];
            if (C.active && this.isActiveDirectedPathBetween(C.right, v)) return !0;
          }
          return !1;
        }, B.split = function(g) {
          return g.active = !1, [B.createSplitBlock(g.left), B.createSplitBlock(g.right)];
        }, B.createSplitBlock = function(g) {
          var v = new B(g);
          return v.populateSplitBlock(g, null), v;
        }, B.prototype.splitBetween = function(g, v) {
          var u = this.findMinLMBetween(g, v);
          if (u !== null) {
            var C = B.split(u);
            return { constraint: u, lb: C[0], rb: C[1] };
          }
          return null;
        }, B.prototype.mergeAcross = function(g, v, u) {
          v.active = !0;
          for (var C = 0, F = g.vars.length; C < F; ++C) {
            var U = g.vars[C];
            U.offset += u, this.addVariable(U);
          }
          this.posn = this.ps.getPosn();
        }, B.prototype.cost = function() {
          for (var g = 0, v = this.vars.length; v--; ) {
            var u = this.vars[v], C = u.position() - u.desiredPosition;
            g += C * C * u.weight;
          }
          return g;
        }, B;
      }();
      i.Block = c;
      var h = function() {
        function B(g) {
          this.vs = g;
          var v = g.length;
          for (this.list = new Array(v); v--; ) {
            var u = new c(g[v]);
            this.list[v] = u, u.blockInd = v;
          }
        }
        return B.prototype.cost = function() {
          for (var g = 0, v = this.list.length; v--; ) g += this.list[v].cost();
          return g;
        }, B.prototype.insert = function(g) {
          g.blockInd = this.list.length, this.list.push(g);
        }, B.prototype.remove = function(g) {
          var v = this.list.length - 1, u = this.list[v];
          this.list.length = v, g !== u && (this.list[g.blockInd] = u, u.blockInd = g.blockInd);
        }, B.prototype.merge = function(g) {
          var v = g.left.block, u = g.right.block, C = g.right.offset - g.left.offset - g.gap;
          v.vars.length < u.vars.length ? (u.mergeAcross(v, g, C), this.remove(v)) : (v.mergeAcross(u, g, -C), this.remove(u));
        }, B.prototype.forEach = function(g) {
          this.list.forEach(g);
        }, B.prototype.updateBlockPositions = function() {
          this.list.forEach(function(g) {
            return g.updateWeightedPosition();
          });
        }, B.prototype.split = function(g) {
          var v = this;
          this.updateBlockPositions(), this.list.forEach(function(u) {
            var C = u.findMinLM();
            C !== null && C.lm < m.LAGRANGIAN_TOLERANCE && (u = C.left.block, c.split(C).forEach(function(F) {
              return v.insert(F);
            }), v.remove(u), g.push(C));
          });
        }, B;
      }();
      i.Blocks = h;
      var m = function() {
        function B(g, v) {
          this.vs = g, this.cs = v, this.vs = g, g.forEach(function(u) {
            u.cIn = [], u.cOut = [];
          }), this.cs = v, v.forEach(function(u) {
            u.left.cOut.push(u), u.right.cIn.push(u);
          }), this.inactive = v.map(function(u) {
            return u.active = !1, u;
          }), this.bs = null;
        }
        return B.prototype.cost = function() {
          return this.bs.cost();
        }, B.prototype.setStartingPositions = function(g) {
          this.inactive = this.cs.map(function(v) {
            return v.active = !1, v;
          }), this.bs = new h(this.vs), this.bs.forEach(function(v, u) {
            return v.posn = g[u];
          });
        }, B.prototype.setDesiredPositions = function(g) {
          this.vs.forEach(function(v, u) {
            return v.desiredPosition = g[u];
          });
        }, B.prototype.mostViolated = function() {
          for (var g = Number.MAX_VALUE, v = null, u = this.inactive, C = u.length, F = C, U = 0; U < C; ++U) {
            var S = u[U];
            if (!S.unsatisfiable) {
              var N = S.slack();
              if ((S.equality || N < g) && (g = N, v = S, F = U, S.equality)) break;
            }
          }
          return F !== C && (g < B.ZERO_UPPERBOUND && !v.active || v.equality) && (u[F] = u[C - 1], u.length = C - 1), v;
        }, B.prototype.satisfy = function() {
          this.bs == null && (this.bs = new h(this.vs)), this.bs.split(this.inactive);
          for (var g = null; (g = this.mostViolated()) && (g.equality || g.slack() < B.ZERO_UPPERBOUND && !g.active); ) {
            var v = g.left.block, u = g.right.block;
            if (v !== u) this.bs.merge(g);
            else {
              if (v.isActiveDirectedPathBetween(g.right, g.left)) {
                g.unsatisfiable = !0;
                continue;
              }
              var C = v.splitBetween(g.left, g.right);
              if (C === null) {
                g.unsatisfiable = !0;
                continue;
              }
              this.bs.insert(C.lb), this.bs.insert(C.rb), this.bs.remove(v), this.inactive.push(C.constraint), g.slack() >= 0 ? this.inactive.push(g) : this.bs.merge(g);
            }
          }
        }, B.prototype.solve = function() {
          this.satisfy();
          for (var g = Number.MAX_VALUE, v = this.bs.cost(); Math.abs(g - v) > 1e-4; ) this.satisfy(), g = v, v = this.bs.cost();
          return v;
        }, B.LAGRANGIAN_TOLERANCE = -1e-4, B.ZERO_UPPERBOUND = -1e-10, B;
      }();
      i.Solver = m, t.exports = i;
    }, function(t, n, i) {
      function o(g) {
        this.options = B.extend({ layerGap: 60, nodeHeight: 10, direction: "down" }, g);
      }
      function l(g) {
        return "L " + g.join(" ");
      }
      function f(g) {
        return "M " + g.join(" ");
      }
      function c(g, v, u) {
        return "C " + g.join(" ") + " " + v.join(" ") + " " + u.join(" ");
      }
      function h(g, v) {
        var u = (g[1] + v[1]) / 2;
        return c([g[0], u], [v[0], u], v);
      }
      function m(g, v) {
        var u = (g[0] + v[0]) / 2;
        return c([u, g[1]], [u, v[1]], v);
      }
      var B = i(4);
      o.lineTo = l, o.moveTo = f, o.curveTo = c, o.vCurveBetween = h, o.hCurveBetween = m, o.prototype.getWaypoints = function(g) {
        var v = this.options, u = v.direction, C = g.getPathFromRoot(), F = v.nodeHeight + v.layerGap;
        return u === "left" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, S) {
          var N = F * (S + 1) * -1;
          return [[N + v.nodeHeight, U.currentPos], [N, U.currentPos]];
        })) : u === "right" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, S) {
          var N = F * (S + 1);
          return [[N - v.nodeHeight, U.currentPos], [N, U.currentPos]];
        })) : u === "up" ? [[[C[0].idealPos, 0]]].concat(C.map(function(U, S) {
          var N = F * (S + 1) * -1;
          return [[U.currentPos, N + v.nodeHeight], [U.currentPos, N]];
        })) : [[[C[0].idealPos, 0]]].concat(C.map(function(U, S) {
          var N = F * (S + 1);
          return [[U.currentPos, N - v.nodeHeight], [U.currentPos, N]];
        }));
      }, o.prototype.layout = function(g) {
        var v = this.options, u = v.layerGap + v.nodeHeight;
        switch (v.direction) {
          case "left":
            g.forEach(function(C) {
              var F = C.getLayerIndex() * u + v.layerGap;
              C.x = -F - v.nodeHeight, C.y = C.currentPos, C.dx = v.nodeHeight, C.dy = C.width;
            });
            break;
          case "right":
            g.forEach(function(C) {
              var F = C.getLayerIndex() * u + v.layerGap;
              C.x = F, C.y = C.currentPos, C.dx = v.nodeHeight, C.dy = C.width;
            });
            break;
          case "up":
            g.forEach(function(C) {
              var F = C.getLayerIndex() * u + v.layerGap;
              C.x = C.currentPos, C.y = -F - v.nodeHeight, C.dx = C.width, C.dy = v.nodeHeight;
            });
            break;
          default:
          case "down":
            g.forEach(function(C) {
              var F = C.getLayerIndex() * u + v.layerGap;
              C.x = C.currentPos, C.y = F, C.dx = C.width, C.dy = v.nodeHeight;
            });
        }
        return g;
      }, o.prototype.generatePath = function(g) {
        var v = this.options, u = v.direction, C = this.getWaypoints(g, u), F = [f(C[0][0])];
        return u === "left" || u === "right" ? C.reduce(function(U, S, N) {
          return F.push(m(U[U.length - 1], S[0])), N < C.length - 1 && F.push(l(S[1])), S;
        }) : C.reduce(function(U, S, N) {
          return F.push(h(U[U.length - 1], S[0])), N < C.length - 1 && F.push(l(S[1])), S;
        }), F.join(" ");
      }, t.exports = o;
    }]);
  });
})(ey);
var ty = ey.exports;
const ny = /* @__PURE__ */ Ic(ty), BN = /* @__PURE__ */ i1({
  __proto__: null,
  default: ny
}, [ty]);
function wN(A) {
  return A.slice().sort(function(e, t) {
    return e - t;
  });
}
function rm(A, e) {
  for (var t = [], n = 0; n < A; n++) {
    for (var i = [], o = 0; o < e; o++)
      i.push(0);
    t.push(i);
  }
  return t;
}
function mN(A) {
  for (var e = 0, t, n = 0; n < A.length; n++)
    (n === 0 || A[n] !== t) && (t = A[n], e++);
  return e;
}
function Bd(A, e, t, n) {
  var i;
  if (A > 0) {
    var o = (t[e] - t[A - 1]) / (e - A + 1);
    i = n[e] - n[A - 1] - (e - A + 1) * o * o;
  } else
    i = n[e] - t[e] * t[e] / (e + 1);
  return i < 0 ? 0 : i;
}
function wd(A, e, t, n, i, o, l) {
  if (!(A > e)) {
    var f = Math.floor((A + e) / 2);
    n[t][f] = n[t - 1][f - 1], i[t][f] = f;
    var c = t;
    A > t && (c = Math.max(c, i[t][A - 1] || 0)), c = Math.max(c, i[t - 1][f] || 0);
    var h = f - 1;
    e < n[0].length - 1 && (h = Math.min(h, i[t][e + 1] || 0));
    for (var m, B, g, v, u = h; u >= c && (m = Bd(u, f, o, l), !(m + n[t - 1][c - 1] >= n[t][f])); --u)
      B = Bd(c, f, o, l), g = B + n[t - 1][c - 1], g < n[t][f] && (n[t][f] = g, i[t][f] = c), c++, v = m + n[t - 1][u - 1], v < n[t][f] && (n[t][f] = v, i[t][f] = u);
    wd(
      A,
      f - 1,
      t,
      n,
      i,
      o,
      l
    ), wd(
      f + 1,
      e,
      t,
      n,
      i,
      o,
      l
    );
  }
}
function vN(A, e, t) {
  for (var n = e[0].length, i = A[Math.floor(n / 2)], o = [], l = [], f = 0, c = void 0; f < n; ++f)
    c = A[f] - i, f === 0 ? (o.push(c), l.push(c * c)) : (o.push(o[f - 1] + c), l.push(
      l[f - 1] + c * c
    )), e[0][f] = Bd(0, f, o, l), t[0][f] = 0;
  for (var h, m = 1; m < e.length; ++m)
    m < e.length - 1 ? h = m : h = n - 1, wd(
      h,
      n - 1,
      m,
      e,
      t,
      o,
      l
    );
}
function yN(A, e) {
  if (e > A.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var t = wN(A), n = mN(t);
  if (n === 1)
    return [t];
  var i = rm(e, t.length), o = rm(e, t.length);
  vN(t, i, o);
  for (var l = [], f = o[0].length - 1, c = o.length - 1; c >= 0; c--) {
    var h = o[c][f];
    l[c] = t.slice(h, f + 1), c > 0 && (f = h - 1);
  }
  return l;
}
const im = function(A) {
  var e = {}, t = { nClusters: 6 }, n = Le.merge({}, t, A);
  return e.createClustersFromGenes = function(i) {
    var o = [];
    if (i.length < 1)
      return o;
    var l = Math.min(n.nClusters, i.length), f = i.map(function(B) {
      return B.midpoint;
    });
    let c = yN(f, l);
    for (var h = [], m = 0; m < c.length; m++)
      h.push([]);
    return i.map(function(B) {
      let g = c.findIndex(function(v) {
        return v.includes(B.midpoint);
      });
      h[g].push(B);
    }), h.map(function(B) {
      if (B.length < 2)
        o.push.apply(o, B);
      else {
        var g = B.reduce(function(C, F) {
          return C + F.midpoint;
        }, 0) / B.length, v = B.reduce(function(C, F) {
          return C + F.id.toString();
        }, ""), u = {
          genesList: B,
          midpoint: g,
          type: "geneslist",
          id: v.toString()
        };
        o.push(u);
      }
    }), o;
  }, e.nClusters = function(i) {
    return arguments.length ? (n.nClusters = i, e) : n.nClusters;
  }, e;
};
var Fh = ny || BN;
const CN = function(A) {
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
  }, t = Le.merge({}, e, A), n = function() {
    return fa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(B, g, v, u) {
    var C = 4, F = g / 3, U = F / v * C, S = U * B > u;
    if (S)
      return 2;
    var N = g * (0.1 + 0.1 / B);
    return F = g - N, U = F / v * C, S = U * B > u, S ? 1 : 0;
  }, o = function(B, g, v, u, C) {
    var F = 3.5;
    let U = {};
    return U.scale = B, U.availableHeight = C, U.lineSpacing = 1, U.layerGap = g * (0.1 + 0.1 / B), U.spaceForLabel = g - U.layerGap, U.setFontSize = Math.min(
      U.spaceForLabel / v * F,
      u / t.scale
    ), U.nodeSpacing = U.setFontSize, U.nLabels = 0.4 * C / (U.nodeSpacing + U.lineSpacing), U.density = 1, U;
  }, l = function(B, g, v, u, C) {
    var F = 3.5, U = {};
    return U.scale = B, U.availableHeight = C, U.lineSpacing = 1, U.setFontSize = Math.min(
      g / 3 / v * F,
      u / t.scale
    ), U.nodeSpacing = U.setFontSize, U.spaceForLabel = 1.3 * v * U.setFontSize / F, U.layerGap = Math.min(5 * U.setFontSize, g / 3), U.density = 0.9, U.nLabels = 0.6 * C / (U.nodeSpacing + U.lineSpacing), U;
  }, f = function(B, g, v, u) {
    u.forEach(function(F) {
      F.displayed = !0, F.fontSize = v.setFontSize;
    });
    var C = u.map(function(F) {
      return new Fh.Node(g(F.midpoint), v.setFontSize, F);
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
    let g = B.annotations.allGenes.filter(function(tA) {
      return tA.globalIndex < t.nGenesToDisplay;
    });
    var v = t.layout.width, u = t.layout.height * Math.min(1, 0.2 + B.length / t.longestChromosome), C = g.reduce(function(tA, hA) {
      return Math.max(tA, hA.label.length);
    }, 0), F = 1.1 * t.displayedFontSize, U = 0.9 * t.displayedFontSize, S = i(
      t.scale,
      v,
      C,
      F
    ), N;
    S == 2 ? N = l(
      t.scale,
      v,
      C,
      U,
      u
    ) : S == 1 ? N = o(
      t.scale,
      v,
      C,
      U,
      u
    ) : S == 0 && (N = o(
      t.scale,
      v,
      C,
      U,
      u
    ), N.nLabels = 0);
    var x = n();
    let P = {
      nodeSpacing: N.nodeSpacing,
      lineSpacing: N.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: N.availableHeight,
      density: N.density
    };
    var R = new Fh.Force(P);
    g.forEach(function(tA) {
      tA.displayed = !1;
    });
    var J = t.manualLabels ? new Set(
      g.filter(function(tA) {
        return tA.visible;
      })
    ) : /* @__PURE__ */ new Set();
    t.autoLabels && g.slice(0, N.nLabels).filter(function(tA) {
      return !tA.hidden;
    }).forEach(function(tA) {
      J.add(tA);
    });
    var fA = Array.from(J), uA = f(R, x, N, fA);
    !uA == 0 && (R.options({ algorithm: "simple" }), uA = f(R, x, N, fA));
    var BA;
    if (uA && uA.length > 0) {
      var FA = uA.map(function(tA) {
        return tA.getLayerIndex();
      });
      BA = Math.max.apply(null, FA);
    }
    if (!uA || BA > 3) {
      var NA = im().nClusters(Math.max(N.nLabels, 1));
      try {
        var xA = NA.createClustersFromGenes(fA);
      } catch {
        xA = [];
      }
      uA = f(R, x, N, xA);
    }
    let X = {
      direction: "right",
      layerGap: N.layerGap,
      nodeHeight: N.spaceForLabel
    };
    var CA = new Fh.Renderer(X);
    return CA.layout(uA), uA.forEach(function(tA) {
      tA.data.path = CA.generatePath(tA);
    }), t.manualLabels || nd(".gene-annotation").remove(), uA;
  }, h = function(B) {
    var g = im(), v = B.annotations.genes, u = g.createClustersFromGenes(v);
    return u;
  };
  let m = {};
  return m.layoutChromosome = function(B) {
    B.layout.annotationNodes = c(B) || B.layout.annotationNodes;
  }, m.computeChromosomeClusters = function(B) {
    B.layout.annotationClusters = h(B), B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice();
  }, m.expandAllChromosomeClusters = function(B) {
    B.layout.annotationDisplayClusters = B.annotations.genes;
  }, m.collapseAllChromosomeClusters = function(B) {
    B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice();
  }, m.expandAChromosomeCluster = function(B, g) {
    B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice(), g.genesList.forEach(function(u) {
      B.layout.annotationDisplayClusters.push(u);
    });
    var v = B.layout.annotationDisplayClusters.indexOf(g);
    B.layout.annotationDisplayClusters.splice(v, 1);
  }, m.computeNormalisedGeneScores = function(B) {
    var g = B.reduce(function(F, U) {
      return F.concat(
        U.annotations.genes.filter(function(S) {
          return S.displayed;
        })
      );
    }, []), v = g.every(function(F) {
      return F.score;
    });
    if (v) {
      var u = g.reduce(function(F, U) {
        return Math.max(F, U.score);
      }, 0), C = g.reduce(function(F, U) {
        return Math.min(F, U.score);
      }, 0);
      g.forEach(function(F) {
        F.normedScore = 0.5 * (F.score - C) / (u - C) + 0.5;
      });
    } else
      g.forEach(function(F) {
        F.normedScore = null;
      });
  }, m;
}, QN = function(A) {
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
  }, t = Le.merge({}, e, A), n = function() {
    return fa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
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
      let m = c.genesList.reduce(function(v, u) {
        return Math.max(v, u.end);
      }, 0);
      return {
        start: c.genesList.reduce(function(v, u) {
          return Math.min(v, u.start);
        }, 1 / 0),
        end: m,
        midpoint: c.midpoint,
        color: "#0000FF",
        data: c
      };
    }
  }, o = function(c) {
    n();
    var h = c.layout.geneBandDisplayClusters, m = h.map(i);
    return m;
  }, l = function(c) {
    var h = c.annotations.allGenes.filter(function(C) {
      return C.globalIndex < t.nGenesToDisplay;
    });
    h.sort(function(C, F) {
      return C.midpoint - F.midpoint;
    });
    for (var m = [], B = 0; B < h.length; ) {
      let C = B;
      for (; C < h.length && h[B].midpoint == h[C].midpoint; )
        C++;
      if (C - B == 1)
        m.push(h[B]), B++;
      else {
        var g = h.slice(B, C), v = g.reduce(function(U, S) {
          return U + S.id.toString();
        }, ""), u = {
          genesList: g,
          midpoint: g[0].midpoint,
          type: "geneslist",
          id: v
        };
        m.push(u), B = C;
      }
    }
    return m.sort(function(C, F) {
      return C.midpoint < F.midpoint;
    }), m;
  };
  let f = {};
  return f.layoutChromosome = function(c) {
    c.layout.geneBandNodes = o(c);
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
    let m = c.layout;
    m.geneBandDisplayClusters = m.geneBandClusters.slice(), h.genesList.forEach(function(g) {
      m.geneBandDisplayClusters.push(g);
    });
    var B = m.geneBandDisplayClusters.indexOf(h);
    m.geneBandDisplayClusters.splice(B, 1);
  }, f;
}, FN = function(A) {
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
  }, t = Le.merge({}, e, A), n, i = function() {
    oe(this).hasClass("disabled") || t.onNetworkBtnClick();
  }, o = function() {
    oe(this).hasClass("disabled") || t.onTagBtnClick();
  }, l = function() {
    oe(this).hasClass("disabled") || t.onFitBtnClick();
  }, f = function() {
    if (oe(this).hasClass("disabled"))
      return;
    const g = new Event("change"), v = document.getElementById("select-label-btn");
    v.value = "auto", v.dispatchEvent(g);
    const u = document.getElementById("select-ngenes-dropdown");
    u.value = "50", u.dispatchEvent(g), t.onResetBtnClick();
  }, c = function() {
    t.onExpandBtnClick();
  }, h = function(g, v, u, C, F) {
    var U = "select-" + v, S = g.selectAll("select").data([null]);
    S.enter().append("select").attr("id", U).attr("name", U).attr("class", "menu-dropdown");
    const N = document.getElementById(U);
    N && (N.innerHTML = "", u.forEach(function(x) {
      var P = document.createElement("option");
      P.value = x[1], P.textContent = x[0], x[1] === F && (P.selected = !0), N.appendChild(P);
    }), N.addEventListener("change", function() {
      var x = N.options[N.selectedIndex], P = x.value;
      C(P);
    }));
  }, m = function() {
    var g = WA(n).selectAll(".genemap-menu").data([null]);
    g.enter().append("div").classed("genemap-menu", !0);
    var v = g.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), u = v.selectAll("span").data(function(BA, FA) {
      return BA;
    });
    u.enter().append("span"), v.selectAll("span").attr("class", function(BA) {
      return BA;
    }), g.select(".network-btn").attr("title", "Launch network view").on("click", i), g.select(".tag-btn").on("click", o);
    var C = g.select(".label-btn");
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
    ), g.select(".fit-btn").attr("title", "Reset pan and zoom").on("click", l), g.select(".reset-btn").attr("title", "Reset selections").on("click", f);
    var F = g.select(".ngenes-dropdown");
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
    ), t.nGenesToDisplayProperty.addListener(function(BA) {
      oe("#select-ngenes-dropdown").selectpicker("val", [
        BA + " genes",
        BA
      ]);
    }), g.select(".export-btn").attr("title", "Export to PNG").on("click", t.onExportBtnClick), g.select(".expand-btn").attr("title", "Toggle full screen").on("click", c);
    var U = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    g.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(U, "_blank");
    });
    var S = WA(n).selectAll(".genemap-advanced-menu").data([null]), N = S.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    N.enter().append("div").attr("class", function(BA) {
      return BA;
    });
    var x = S.select(".qtl-btn");
    h(
      x,
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
    R.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), R.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), R.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), oe("#snp-pvalue-form").submit(function(BA) {
      t.maxSnpPValueProperty(oe("#max-snp-pvalue-input").val()), BA.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(BA) {
      oe("#max-snp-pvalue-input").val(BA);
    });
    var J = S.select(".nperrow-spinner"), fA = J.selectAll("input").data(["nPerRowSpinner"]).enter();
    fA.append("span").append("label").classed("bootstrap", !0).attr("for", (BA) => BA).html("Num per row:&nbsp;"), fA.append("span").append("input").attr("id", (BA) => BA).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (BA) => BA), WA(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), oe("#nPerRowSpinner").on("change", function(BA) {
      t.onSetNumberPerRowClick(oe("#nPerRowSpinner").val());
    }), S.select(".export-all-btn").attr("title", "export all to PNG").on("click", t.onExportAllBtnClick), S.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(BA) {
      return BA;
    }), S.select(".labelsize-label").classed("bootstrap", !0), S.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var uA = S.select(".labelsize-dropdown");
    uA.text(""), h(
      uA,
      "labelsize-dropdown",
      [
        ["10", 10],
        ["15", 15],
        ["20", 20],
        ["25", 25]
      ],
      t.annotationLabelSizeProperty,
      t.annotationLabelSizeProperty()
    ), t.annotationLabelSizeProperty.addListener(function(BA) {
      oe("#select-labelsize-dropdown").selectpicker("val", [
        BA,
        BA
      ]);
    });
  };
  function B(g) {
    g.each(function(v) {
      var u = this;
      n = u, m();
    });
  }
  return B.onNetworkBtnClick = function(g) {
    return arguments.length ? (t.onNetworkBtnClick = g, B) : t.onNetworkBtnClick;
  }, B.onTagBtnClick = function(g) {
    return arguments.length ? (t.onTagBtnClick = g, B) : t.onTagBtnClick;
  }, B.onLabelBtnClick = function(g) {
    return arguments.length ? (t.onLabelBtnClick = g, B) : t.onLabelBtnClick;
  }, B.onQtlBtnClick = function(g) {
    return arguments.length ? (t.onQtlBtnClick = g, B) : t.onQtlBtnClick;
  }, B.onFitBtnClick = function(g) {
    return arguments.length ? (t.onFitBtnClick = g, B) : t.onFitBtnClick;
  }, B.onResetBtnClick = function(g) {
    return arguments.length ? (t.onResetBtnClick = g, B) : t.onResetBtnClick;
  }, B.onSetNumberPerRowClick = function(g) {
    return arguments.length ? (t.onSetNumberPerRowClick = g, B) : t.onSetNumberPerRowClick;
  }, B.initialMaxGenes = function(g) {
    return arguments.length ? (t.initialMaxGenes = g, B) : t.initialMaxGenes;
  }, B.initialNPerRow = function(g) {
    return arguments.length ? (t.initialNPerRow = g, B) : t.initialNPerRow;
  }, B.onExportBtnClick = function(g) {
    return arguments.length ? (t.onExportBtnClick = g, B) : t.onExportBtnClick;
  }, B.onExportAllBtnClick = function(g) {
    return arguments.length ? (t.onExportAllBtnClick = g, B) : t.onExportAllBtnClick;
  }, B.onExpandBtnClick = function(g) {
    return arguments.length ? (t.onExpandBtnClick = g, B) : t.onExpandBtnClick;
  }, B.maxSnpPValueProperty = function(g) {
    return arguments.length ? (t.maxSnpPValueProperty = g, B) : t.maxSnpPValueProperty;
  }, B.nGenesToDisplayProperty = function(g) {
    return arguments.length ? (t.nGenesToDisplayProperty = g, B) : t.nGenesToDisplayProperty;
  }, B.annotationLabelSizeProperty = function(g) {
    return arguments.length ? (t.annotationLabelSizeProperty = g, B) : t.annotationLabelSizeProperty;
  }, B.setTabButtonState = function(g) {
    var v = WA(n).select(".tag-btn");
    g === "show" ? (v.classed("show-label", !0), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Show Labels")) : g === "hide" ? (v.classed("show-label", !1), v.classed("hide-label", !0), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Hide Labels")) : g === "manual" ? (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !0), v.attr("title", "Manual Labels")) : (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !0), v.classed("manual-label", !1), v.attr("title", "Automatic Labels"));
  }, B.getTagButtonState = function() {
    var g = WA(n).select(".tag-btn");
    return g.classed("show-label") ? "show" : g.classed("hide-label") ? "hide" : g.classed("auto-label") ? "auto" : "manual";
  }, B.setFitButtonEnabled = function(g) {
    WA(n).select(".fit-btn").classed("disabled", !g);
  }, B.setNetworkButtonEnabled = function(g) {
    WA(n).select(".network-btn").classed("disabled", !g);
  }, B;
};
class UN {
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
    let i = this.mergeClosest(), o = 0;
    for (; i; )
      n && o++ % t === 0 && n(this.clusters), i = this.mergeClosest();
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
    const n = this.index[e], i = this.index[this.mins[e]], o = {
      left: n,
      right: i,
      key: n.key,
      size: n.size + i.size
    };
    this.clusters[n.index] = o, this.clusters.splice(i.index, 1), this.index[n.key] = o;
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
          const m = this.clusters[h].key;
          this.dists[f][m] < this.dists[f][c] && (c = m);
        }
        this.mins[f] = c;
      }
      this.clusters[l].index = l;
    }
    return delete n.key, delete i.key, delete n.index, delete i.index, !0;
  }
}
function EN(A, e, t, n, i, o) {
  return t = t || "average", new UN(
    e,
    t,
    n
  ).cluster(A, i, o);
}
const bN = function() {
  var A = {};
  return A.positionAnnotations = function(e, t, n, i, o, l) {
    for (var f = i, c = l, h = o, m = function(P, R) {
      return f(P) < c(R) && f(R) < c(P);
    }, B = e.sort(function(P, R) {
      return h(P) - h(R);
    }), g = [], v = 0; v < B.length; v++) {
      for (var u = e[v], C = [], F = 0; F < g.length; F++) {
        var U = B[g[F]];
        m(u, U) || C.push(g[F]);
      }
      var S = _.difference(g, C), N = S.map(function(P) {
        return t(B[P]);
      }), x = 0;
      for (x = 1; x < N.length + 1 && N.indexOf(x) !== -1; x++)
        ;
      n(u, x), g.push(v);
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
    var i = e, o = 0.6, l = o * n;
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
      function(o) {
        return o.comboPosition;
      },
      function(o, l) {
        o.comboPosition = l;
      },
      function(o) {
        return Math.min(
          t(o.midpoint) - o.label.length * n / 2,
          o.start
        );
      },
      function(o) {
        return o.midpoint;
      },
      function(o) {
        return Math.max(
          t(o.midpoint) + o.label.length * n / 2,
          o.end
        );
      }
    );
  }, A;
}, _N = function(A) {
  var e = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = Le.merge({}, e, A), n = bN(), i = function() {
    return fa().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, o = function(u) {
    return u.map(function(C) {
      var F = g(C), U = F.reduce(function(R, J) {
        return Math.min(R, J.start);
      }, 1 / 0), S = F.reduce(function(R, J) {
        return Math.max(R, J.end);
      }, 0), N = F.reduce(function(R, J) {
        return R + (R ? "|" : "") + J.start + "-" + J.end;
      }, ""), x = (U + S) / 2;
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
        midpoint: x,
        chromosome: F[0].chromosome,
        type: "qtllist",
        id: N
      }, P;
    });
  }, l = function(u) {
    var C = [];
    if (t.showAllQTLs) {
      u.layout.qtlDisplayClusters = u.layout.qtlClusters.slice();
      for (var F = u.layout.qtlDisplayClusters, U = Math.ceil(Math.floor(t.scale - 0.1) / 2); U--; )
        F = B(F);
      for (var S = F.length; ; ) {
        C = o(F), C = n.sortQTLAnnotations(C);
        var N = C.reduce(function(x, P) {
          return Math.max(x, P.position);
        }, 0);
        if (N < 2) {
          if (F = B(F), S == F.length)
            break;
          S = F.length;
        } else
          break;
      }
    } else t.showSelectedQTLs && (u.layout.qtlDisplayClusters = u.annotations.qtls.filter(
      function(x) {
        return x.selected;
      }
    ), F = u.layout.qtlDisplayClusters, C = F.map(function(x) {
      let P = x;
      return P.type = "qtl", P;
    }));
    return C;
  }, f = function(u) {
    var C = Le.groupBy(u, "position");
    return Le.forOwn(C, function(F) {
      var U = 14 / t.scale, S = i();
      F = n.sortQTLLabels(F, S, U), F.forEach(function(N) {
        N.labelPosition > 1 ? N.displayLabel = !1 : (N.displayLabel = !0, N.labelPosition = N.position + 0.4);
      });
    }), u;
  }, c = function(u) {
    var C = l(u);
    C.forEach(function(J) {
      J.displayLabel = !1;
    });
    var F = C.filter(function(J) {
      return J.type == "qtl";
    });
    if (t.showAutoQTLLabels) {
      C = n.sortQTLAnnotations(C);
      var U = C.reduce(function(J, fA) {
        return Math.max(J, fA.position);
      }, 0);
      F.forEach(function(J) {
        J.label.length > 15 ? J.screenLabel = J.label.substring(0, 12) + "..." : J.screenLabel = J.label;
      });
      var S = 14 / t.scale, N = S > 0.6 * t.layout.chromosomeWidth, x = U > 3;
      !x && !N ? (f(F), F.forEach(function(J) {
        J.fontSize = S;
      })) : F.forEach(function(J) {
        J.displayLabel = !1;
      });
    }
    if (t.showSelectedQTLLabels && !t.showAutoQTLLabels) {
      var P = C.filter(function(J) {
        return J.selected;
      });
      S = 14 / t.scale;
      var R = 0.3 * t.layout.chromosomeWidth;
      P.forEach(function(J) {
        J.displayLabel = !0, J.screenLabel = J.label, J.fontSize = Math.min(S, 2 * R);
      }), P = n.sortQTLAnnotationsWithLabels(
        P,
        i(),
        t.annotationLabelSize
      ), P.forEach(function(J) {
        J.position = J.comboPosition, J.labelPosition = J.comboPosition + 0.4;
      });
    }
    return C;
  }, h = function(u, C) {
    if (u.index = C.index, C.index = C.index + 1, u.value)
      u.unit = !0, u.start = u.value.start, u.end = u.value.end;
    else {
      var F = u.left, U = u.right;
      F.parentIndex = u.index, U.parentIndex = u.index, h(F, C), h(U, C), u.unit = F.unit && U.unit && F.start == U.start && F.end == U.end, u.start = Math.min(u.left.start, u.right.start), u.end = Math.max(u.left.end, u.right.end);
    }
  }, m = function(u) {
    var C = EN(
      u.annotations.qtls,
      function(U, S) {
        if (U.end == S.end && U.start == S.start)
          return 0;
        var N = Math.min(U.end, S.end) - Math.max(U.start, S.start), x = U.end - U.start, P = S.end - S.start, R = N, J = Math.abs(x - P);
        return Math.max(0.1, J - R);
      },
      "single",
      null
    ), F = { index: 0 };
    return C.forEach(function(U) {
      h(U, F);
    }), C;
  }, B = function(u) {
    var C = [];
    return u.forEach(function(F) {
      if (F.value || F.unit)
        C.push(F);
      else {
        var U = F.left, S = F.right;
        C.push(U), C.push(S);
      }
    }), C;
  }, g = function(u) {
    return u.size == 1 ? [u.value] : g(u.left).concat(g(u.right));
  };
  let v = {};
  return v.layoutChromosome = function(u) {
    u.layout.qtlNodes = c(u) || u.layout.qtlNodes;
  }, v.computeChromosomeClusters = function(u) {
    u.layout.qtlClusters = m(u);
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
var md = function(A, e) {
  return md = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, md(A, e);
};
function jn(A, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  md(A, e);
  function t() {
    this.constructor = A;
  }
  A.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var vd = function() {
  return vd = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
    }
    return e;
  }, vd.apply(this, arguments);
};
function Vt(A, e, t, n) {
  function i(o) {
    return o instanceof t ? o : new t(function(l) {
      l(o);
    });
  }
  return new (t || (t = Promise))(function(o, l) {
    function f(m) {
      try {
        h(n.next(m));
      } catch (B) {
        l(B);
      }
    }
    function c(m) {
      try {
        h(n.throw(m));
      } catch (B) {
        l(B);
      }
    }
    function h(m) {
      m.done ? o(m.value) : i(m.value).then(f, c);
    }
    h((n = n.apply(A, [])).next());
  });
}
function Ot(A, e) {
  var t = { label: 0, sent: function() {
    if (o[0] & 1) throw o[1];
    return o[1];
  }, trys: [], ops: [] }, n, i, o, l;
  return l = { next: f(0), throw: f(1), return: f(2) }, typeof Symbol == "function" && (l[Symbol.iterator] = function() {
    return this;
  }), l;
  function f(h) {
    return function(m) {
      return c([h, m]);
    };
  }
  function c(h) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; t; ) try {
      if (n = 1, i && (o = h[0] & 2 ? i.return : h[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, h[1])).done) return o;
      switch (i = 0, o && (h = [h[0] & 2, o.value]), h[0]) {
        case 0:
        case 1:
          o = h;
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
          if (o = t.trys, !(o = o.length > 0 && o[o.length - 1]) && (h[0] === 6 || h[0] === 2)) {
            t = 0;
            continue;
          }
          if (h[0] === 3 && (!o || h[1] > o[0] && h[1] < o[3])) {
            t.label = h[1];
            break;
          }
          if (h[0] === 6 && t.label < o[1]) {
            t.label = o[1], o = h;
            break;
          }
          if (o && t.label < o[2]) {
            t.label = o[2], t.ops.push(h);
            break;
          }
          o[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      h = e.call(A, t);
    } catch (m) {
      h = [6, m], i = 0;
    } finally {
      n = o = 0;
    }
    if (h[0] & 5) throw h[1];
    return { value: h[0] ? h[1] : void 0, done: !0 };
  }
}
function wl(A, e, t) {
  if (arguments.length === 2) for (var n = 0, i = e.length, o; n < i; n++)
    (o || !(n in e)) && (o || (o = Array.prototype.slice.call(e, 0, n)), o[n] = e[n]);
  return A.concat(o || e);
}
var qr = (
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
), kc = function(A, e) {
  return qr.fromClientRect(A, e.getBoundingClientRect());
}, xN = function(A) {
  var e = A.body, t = A.documentElement;
  if (!e || !t)
    throw new Error("Unable to get document size");
  var n = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth)), i = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
  return new qr(0, 0, n, i);
}, $c = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var o = A.charCodeAt(t++);
      (o & 64512) === 56320 ? e.push(((i & 1023) << 10) + (o & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, st = function() {
  for (var A = [], e = 0; e < arguments.length; e++)
    A[e] = arguments[e];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, A);
  var t = A.length;
  if (!t)
    return "";
  for (var n = [], i = -1, o = ""; ++i < t; ) {
    var l = A[i];
    l <= 65535 ? n.push(l) : (l -= 65536, n.push((l >> 10) + 55296, l % 1024 + 56320)), (i + 1 === t || n.length > 16384) && (o += String.fromCharCode.apply(String, n), n.length = 0);
  }
  return o;
}, am = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", IN = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ml = 0; ml < am.length; ml++)
  IN[am.charCodeAt(ml)] = ml;
var om = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ls = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var vl = 0; vl < om.length; vl++)
  ls[om.charCodeAt(vl)] = vl;
var HN = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, o, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), m = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    o = ls[A.charCodeAt(n)], l = ls[A.charCodeAt(n + 1)], f = ls[A.charCodeAt(n + 2)], c = ls[A.charCodeAt(n + 3)], m[i++] = o << 2 | l >> 4, m[i++] = (l & 15) << 4 | f >> 2, m[i++] = (f & 3) << 6 | c & 63;
  return h;
}, SN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, LN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ia = 5, Yp = 11, Uh = 2, TN = Yp - ia, ry = 65536 >> ia, DN = 1 << ia, Eh = DN - 1, ON = 1024 >> ia, NN = ry + ON, MN = NN, PN = 32, KN = MN + PN, RN = 65536 >> Yp, kN = 1 << TN, $N = kN - 1, sm = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, GN = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, VN = function(A, e) {
  var t = HN(A), n = Array.isArray(t) ? LN(t) : new Uint32Array(t), i = Array.isArray(t) ? SN(t) : new Uint16Array(t), o = 24, l = sm(i, o / 2, n[4] / 2), f = n[5] === 2 ? sm(i, (o + n[4]) / 2) : GN(n, Math.ceil((o + n[4]) / 4));
  return new WN(n[0], n[1], n[2], n[3], l, f);
}, WN = (
  /** @class */
  function() {
    function A(e, t, n, i, o, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = o, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> ia], t = (t << Uh) + (e & Eh), this.data[t];
        if (e <= 65535)
          return t = this.index[ry + (e - 55296 >> ia)], t = (t << Uh) + (e & Eh), this.data[t];
        if (e < this.highStart)
          return t = KN - RN + (e >> Yp), t = this.index[t], t += e >> ia & $N, t = this.index[t], t = (t << Uh) + (e & Eh), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), um = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", XN = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var yl = 0; yl < um.length; yl++)
  XN[um.charCodeAt(yl)] = yl;
var qN = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", lm = 50, zN = 1, iy = 2, ay = 3, JN = 4, jN = 5, cm = 7, oy = 8, fm = 9, yi = 10, yd = 11, hm = 12, Cd = 13, YN = 14, cs = 15, Qd = 16, Cl = 17, ts = 18, ZN = 19, dm = 20, Fd = 21, ns = 22, bh = 23, Ka = 24, ln = 25, fs = 26, hs = 27, Ra = 28, AM = 29, Aa = 30, eM = 31, Ql = 32, Fl = 33, Ud = 34, Ed = 35, bd = 36, Ps = 37, _d = 38, Yl = 39, Zl = 40, _h = 41, sy = 42, tM = 43, nM = [9001, 65288], uy = "!", Fe = "×", Ul = "÷", xd = VN(qN), Mr = [Aa, bd], Id = [zN, iy, ay, jN], ly = [yi, oy], pm = [hs, fs], rM = Id.concat(ly), gm = [_d, Yl, Zl, Ud, Ed], iM = [cs, Cd], aM = function(A, e) {
  e === void 0 && (e = "strict");
  var t = [], n = [], i = [];
  return A.forEach(function(o, l) {
    var f = xd.get(o);
    if (f > lm ? (i.push(!0), f -= lm) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(o) !== -1)
      return n.push(l), t.push(Qd);
    if (f === JN || f === yd) {
      if (l === 0)
        return n.push(l), t.push(Aa);
      var c = t[l - 1];
      return rM.indexOf(c) === -1 ? (n.push(n[l - 1]), t.push(c)) : (n.push(l), t.push(Aa));
    }
    if (n.push(l), f === eM)
      return t.push(e === "strict" ? Fd : Ps);
    if (f === sy || f === AM)
      return t.push(Aa);
    if (f === tM)
      return o >= 131072 && o <= 196605 || o >= 196608 && o <= 262141 ? t.push(Ps) : t.push(Aa);
    t.push(f);
  }), [n, t, i];
}, xh = function(A, e, t, n) {
  var i = n[t];
  if (Array.isArray(A) ? A.indexOf(i) !== -1 : A === i)
    for (var o = t; o <= n.length; ) {
      o++;
      var l = n[o];
      if (l === e)
        return !0;
      if (l !== yi)
        break;
    }
  if (i === yi)
    for (var o = t; o > 0; ) {
      o--;
      var f = n[o];
      if (Array.isArray(A) ? A.indexOf(f) !== -1 : A === f)
        for (var c = t; c <= n.length; ) {
          c++;
          var l = n[c];
          if (l === e)
            return !0;
          if (l !== yi)
            break;
        }
      if (f !== yi)
        break;
    }
  return !1;
}, Bm = function(A, e) {
  for (var t = A; t >= 0; ) {
    var n = e[t];
    if (n === yi)
      t--;
    else
      return n;
  }
  return 0;
}, oM = function(A, e, t, n, i) {
  if (t[n] === 0)
    return Fe;
  var o = n - 1;
  if (Array.isArray(i) && i[o] === !0)
    return Fe;
  var l = o - 1, f = o + 1, c = e[o], h = l >= 0 ? e[l] : 0, m = e[f];
  if (c === iy && m === ay)
    return Fe;
  if (Id.indexOf(c) !== -1)
    return uy;
  if (Id.indexOf(m) !== -1 || ly.indexOf(m) !== -1)
    return Fe;
  if (Bm(o, e) === oy)
    return Ul;
  if (xd.get(A[o]) === yd || (c === Ql || c === Fl) && xd.get(A[f]) === yd || c === cm || m === cm || c === fm || [yi, Cd, cs].indexOf(c) === -1 && m === fm || [Cl, ts, ZN, Ka, Ra].indexOf(m) !== -1 || Bm(o, e) === ns || xh(bh, ns, o, e) || xh([Cl, ts], Fd, o, e) || xh(hm, hm, o, e))
    return Fe;
  if (c === yi)
    return Ul;
  if (c === bh || m === bh)
    return Fe;
  if (m === Qd || c === Qd)
    return Ul;
  if ([Cd, cs, Fd].indexOf(m) !== -1 || c === YN || h === bd && iM.indexOf(c) !== -1 || c === Ra && m === bd || m === dm || Mr.indexOf(m) !== -1 && c === ln || Mr.indexOf(c) !== -1 && m === ln || c === hs && [Ps, Ql, Fl].indexOf(m) !== -1 || [Ps, Ql, Fl].indexOf(c) !== -1 && m === fs || Mr.indexOf(c) !== -1 && pm.indexOf(m) !== -1 || pm.indexOf(c) !== -1 && Mr.indexOf(m) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [hs, fs].indexOf(c) !== -1 && (m === ln || [ns, cs].indexOf(m) !== -1 && e[f + 1] === ln) || // ( OP | HY ) × NU
  [ns, cs].indexOf(c) !== -1 && m === ln || // NU ×	(NU | SY | IS)
  c === ln && [ln, Ra, Ka].indexOf(m) !== -1)
    return Fe;
  if ([ln, Ra, Ka, Cl, ts].indexOf(m) !== -1)
    for (var B = o; B >= 0; ) {
      var g = e[B];
      if (g === ln)
        return Fe;
      if ([Ra, Ka].indexOf(g) !== -1)
        B--;
      else
        break;
    }
  if ([hs, fs].indexOf(m) !== -1)
    for (var B = [Cl, ts].indexOf(c) !== -1 ? l : o; B >= 0; ) {
      var g = e[B];
      if (g === ln)
        return Fe;
      if ([Ra, Ka].indexOf(g) !== -1)
        B--;
      else
        break;
    }
  if (_d === c && [_d, Yl, Ud, Ed].indexOf(m) !== -1 || [Yl, Ud].indexOf(c) !== -1 && [Yl, Zl].indexOf(m) !== -1 || [Zl, Ed].indexOf(c) !== -1 && m === Zl || gm.indexOf(c) !== -1 && [dm, fs].indexOf(m) !== -1 || gm.indexOf(m) !== -1 && c === hs || Mr.indexOf(c) !== -1 && Mr.indexOf(m) !== -1 || c === Ka && Mr.indexOf(m) !== -1 || Mr.concat(ln).indexOf(c) !== -1 && m === ns && nM.indexOf(A[f]) === -1 || Mr.concat(ln).indexOf(m) !== -1 && c === ts)
    return Fe;
  if (c === _h && m === _h) {
    for (var v = t[o], u = 1; v > 0 && (v--, e[v] === _h); )
      u++;
    if (u % 2 !== 0)
      return Fe;
  }
  return c === Ql && m === Fl ? Fe : Ul;
}, sM = function(A, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = aM(A, e.lineBreak), n = t[0], i = t[1], o = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(f) {
    return [ln, Aa, sy].indexOf(f) !== -1 ? Ps : f;
  }));
  var l = e.wordBreak === "keep-all" ? o.map(function(f, c) {
    return f && A[c] >= 19968 && A[c] <= 40959;
  }) : void 0;
  return [n, i, l];
}, uM = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.codePoints = e, this.required = t === uy, this.start = n, this.end = i;
    }
    return A.prototype.slice = function() {
      return st.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, A;
  }()
), lM = function(A, e) {
  var t = $c(A), n = sM(t, e), i = n[0], o = n[1], l = n[2], f = t.length, c = 0, h = 0;
  return {
    next: function() {
      if (h >= f)
        return { done: !0, value: null };
      for (var m = Fe; h < f && (m = oM(t, o, i, ++h, l)) === Fe; )
        ;
      if (m !== Fe || h === f) {
        var B = new uM(t, m, c, h);
        return c = h, { value: B, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, cM = 1, fM = 2, Js = 4, wm = 8, vc = 10, mm = 47, Us = 92, hM = 9, dM = 32, El = 34, rs = 61, pM = 35, gM = 36, BM = 37, bl = 39, _l = 40, is = 41, wM = 95, An = 45, mM = 33, vM = 60, yM = 62, CM = 64, QM = 91, FM = 93, UM = 61, EM = 123, xl = 63, bM = 125, vm = 124, _M = 126, xM = 128, ym = 65533, Ih = 42, ta = 43, IM = 44, HM = 58, SM = 59, Ks = 46, LM = 0, TM = 8, DM = 11, OM = 14, NM = 31, MM = 127, sr = -1, cy = 48, fy = 97, hy = 101, PM = 102, KM = 117, RM = 122, dy = 65, py = 69, gy = 70, kM = 85, $M = 90, Nt = function(A) {
  return A >= cy && A <= 57;
}, GM = function(A) {
  return A >= 55296 && A <= 57343;
}, ka = function(A) {
  return Nt(A) || A >= dy && A <= gy || A >= fy && A <= PM;
}, VM = function(A) {
  return A >= fy && A <= RM;
}, WM = function(A) {
  return A >= dy && A <= $M;
}, XM = function(A) {
  return VM(A) || WM(A);
}, qM = function(A) {
  return A >= xM;
}, Il = function(A) {
  return A === vc || A === hM || A === dM;
}, yc = function(A) {
  return XM(A) || qM(A) || A === wM;
}, Cm = function(A) {
  return yc(A) || Nt(A) || A === An;
}, zM = function(A) {
  return A >= LM && A <= TM || A === DM || A >= OM && A <= NM || A === MM;
}, wi = function(A, e) {
  return A !== Us ? !1 : e !== vc;
}, Hl = function(A, e, t) {
  return A === An ? yc(e) || wi(e, t) : yc(A) ? !0 : !!(A === Us && wi(A, e));
}, Hh = function(A, e, t) {
  return A === ta || A === An ? Nt(e) ? !0 : e === Ks && Nt(t) : Nt(A === Ks ? e : A);
}, JM = function(A) {
  var e = 0, t = 1;
  (A[e] === ta || A[e] === An) && (A[e] === An && (t = -1), e++);
  for (var n = []; Nt(A[e]); )
    n.push(A[e++]);
  var i = n.length ? parseInt(st.apply(void 0, n), 10) : 0;
  A[e] === Ks && e++;
  for (var o = []; Nt(A[e]); )
    o.push(A[e++]);
  var l = o.length, f = l ? parseInt(st.apply(void 0, o), 10) : 0;
  (A[e] === py || A[e] === hy) && e++;
  var c = 1;
  (A[e] === ta || A[e] === An) && (A[e] === An && (c = -1), e++);
  for (var h = []; Nt(A[e]); )
    h.push(A[e++]);
  var m = h.length ? parseInt(st.apply(void 0, h), 10) : 0;
  return t * (i + f * Math.pow(10, -l)) * Math.pow(10, c * m);
}, jM = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, YM = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, ZM = {
  type: 4
  /* COMMA_TOKEN */
}, AP = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, eP = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, tP = {
  type: 21
  /* COLUMN_TOKEN */
}, nP = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, rP = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, iP = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, aP = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, oP = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Sl = {
  type: 23
  /* BAD_URL_TOKEN */
}, sP = {
  type: 1
  /* BAD_STRING_TOKEN */
}, uP = {
  type: 25
  /* CDO_TOKEN */
}, lP = {
  type: 24
  /* CDC_TOKEN */
}, cP = {
  type: 26
  /* COLON_TOKEN */
}, fP = {
  type: 27
  /* SEMICOLON_TOKEN */
}, hP = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, dP = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, pP = {
  type: 31
  /* WHITESPACE_TOKEN */
}, Hd = {
  type: 32
  /* EOF_TOKEN */
}, By = (
  /** @class */
  function() {
    function A() {
      this._value = [];
    }
    return A.prototype.write = function(e) {
      this._value = this._value.concat($c(e));
    }, A.prototype.read = function() {
      for (var e = [], t = this.consumeToken(); t !== Hd; )
        e.push(t), t = this.consumeToken();
      return e;
    }, A.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case El:
          return this.consumeStringToken(El);
        case pM:
          var t = this.peekCodePoint(0), n = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (Cm(t) || wi(n, i)) {
            var o = Hl(t, n, i) ? fM : cM, l = this.consumeName();
            return { type: 5, value: l, flags: o };
          }
          break;
        case gM:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), AP;
          break;
        case bl:
          return this.consumeStringToken(bl);
        case _l:
          return jM;
        case is:
          return YM;
        case Ih:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), oP;
          break;
        case ta:
          if (Hh(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case IM:
          return ZM;
        case An:
          var f = e, c = this.peekCodePoint(0), h = this.peekCodePoint(1);
          if (Hh(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (Hl(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (c === An && h === yM)
            return this.consumeCodePoint(), this.consumeCodePoint(), lP;
          break;
        case Ks:
          if (Hh(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case mm:
          if (this.peekCodePoint(0) === Ih)
            for (this.consumeCodePoint(); ; ) {
              var m = this.consumeCodePoint();
              if (m === Ih && (m = this.consumeCodePoint(), m === mm))
                return this.consumeToken();
              if (m === sr)
                return this.consumeToken();
            }
          break;
        case HM:
          return cP;
        case SM:
          return fP;
        case vM:
          if (this.peekCodePoint(0) === mM && this.peekCodePoint(1) === An && this.peekCodePoint(2) === An)
            return this.consumeCodePoint(), this.consumeCodePoint(), uP;
          break;
        case CM:
          var B = this.peekCodePoint(0), g = this.peekCodePoint(1), v = this.peekCodePoint(2);
          if (Hl(B, g, v)) {
            var l = this.consumeName();
            return { type: 7, value: l };
          }
          break;
        case QM:
          return hP;
        case Us:
          if (wi(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case FM:
          return dP;
        case UM:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), eP;
          break;
        case EM:
          return iP;
        case bM:
          return aP;
        case KM:
        case kM:
          var u = this.peekCodePoint(0), C = this.peekCodePoint(1);
          return u === ta && (ka(C) || C === xl) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case vm:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), nP;
          if (this.peekCodePoint(0) === vm)
            return this.consumeCodePoint(), tP;
          break;
        case _M:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), rP;
          break;
        case sr:
          return Hd;
      }
      return Il(e) ? (this.consumeWhiteSpace(), pP) : Nt(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : yc(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: st(e) };
    }, A.prototype.consumeCodePoint = function() {
      var e = this._value.shift();
      return typeof e > "u" ? -1 : e;
    }, A.prototype.reconsumeCodePoint = function(e) {
      this._value.unshift(e);
    }, A.prototype.peekCodePoint = function(e) {
      return e >= this._value.length ? -1 : this._value[e];
    }, A.prototype.consumeUnicodeRangeToken = function() {
      for (var e = [], t = this.consumeCodePoint(); ka(t) && e.length < 6; )
        e.push(t), t = this.consumeCodePoint();
      for (var n = !1; t === xl && e.length < 6; )
        e.push(t), t = this.consumeCodePoint(), n = !0;
      if (n) {
        var i = parseInt(st.apply(void 0, e.map(function(c) {
          return c === xl ? cy : c;
        })), 16), o = parseInt(st.apply(void 0, e.map(function(c) {
          return c === xl ? gy : c;
        })), 16);
        return { type: 30, start: i, end: o };
      }
      var l = parseInt(st.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === An && ka(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var f = []; ka(t) && f.length < 6; )
          f.push(t), t = this.consumeCodePoint();
        var o = parseInt(st.apply(void 0, f), 16);
        return { type: 30, start: l, end: o };
      } else
        return { type: 30, start: l, end: l };
    }, A.prototype.consumeIdentLikeToken = function() {
      var e = this.consumeName();
      return e.toLowerCase() === "url" && this.peekCodePoint(0) === _l ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === _l ? (this.consumeCodePoint(), { type: 19, value: e }) : { type: 20, value: e };
    }, A.prototype.consumeUrlToken = function() {
      var e = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === sr)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === bl || t === El) {
        var n = this.consumeStringToken(this.consumeCodePoint());
        return n.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === sr || this.peekCodePoint(0) === is) ? (this.consumeCodePoint(), { type: 22, value: n.value }) : (this.consumeBadUrlRemnants(), Sl);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === sr || i === is)
          return { type: 22, value: st.apply(void 0, e) };
        if (Il(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === sr || this.peekCodePoint(0) === is ? (this.consumeCodePoint(), { type: 22, value: st.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), Sl);
        if (i === El || i === bl || i === _l || zM(i))
          return this.consumeBadUrlRemnants(), Sl;
        if (i === Us)
          if (wi(i, this.peekCodePoint(0)))
            e.push(this.consumeEscapedCodePoint());
          else
            return this.consumeBadUrlRemnants(), Sl;
        else
          e.push(i);
      }
    }, A.prototype.consumeWhiteSpace = function() {
      for (; Il(this.peekCodePoint(0)); )
        this.consumeCodePoint();
    }, A.prototype.consumeBadUrlRemnants = function() {
      for (; ; ) {
        var e = this.consumeCodePoint();
        if (e === is || e === sr)
          return;
        wi(e, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
      }
    }, A.prototype.consumeStringSlice = function(e) {
      for (var t = 5e4, n = ""; e > 0; ) {
        var i = Math.min(t, e);
        n += st.apply(void 0, this._value.splice(0, i)), e -= i;
      }
      return this._value.shift(), n;
    }, A.prototype.consumeStringToken = function(e) {
      var t = "", n = 0;
      do {
        var i = this._value[n];
        if (i === sr || i === void 0 || i === e)
          return t += this.consumeStringSlice(n), { type: 0, value: t };
        if (i === vc)
          return this._value.splice(0, n), sP;
        if (i === Us) {
          var o = this._value[n + 1];
          o !== sr && o !== void 0 && (o === vc ? (t += this.consumeStringSlice(n), n = -1, this._value.shift()) : wi(i, o) && (t += this.consumeStringSlice(n), t += st(this.consumeEscapedCodePoint()), n = -1));
        }
        n++;
      } while (!0);
    }, A.prototype.consumeNumber = function() {
      var e = [], t = Js, n = this.peekCodePoint(0);
      for ((n === ta || n === An) && e.push(this.consumeCodePoint()); Nt(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Ks && Nt(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = wm; Nt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var o = this.peekCodePoint(2);
      if ((n === py || n === hy) && ((i === ta || i === An) && Nt(o) || Nt(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = wm; Nt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [JM(e), t];
    }, A.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], n = e[1], i = this.peekCodePoint(0), o = this.peekCodePoint(1), l = this.peekCodePoint(2);
      if (Hl(i, o, l)) {
        var f = this.consumeName();
        return { type: 15, number: t, flags: n, unit: f };
      }
      return i === BM ? (this.consumeCodePoint(), { type: 16, number: t, flags: n }) : { type: 17, number: t, flags: n };
    }, A.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if (ka(e)) {
        for (var t = st(e); ka(this.peekCodePoint(0)) && t.length < 6; )
          t += st(this.consumeCodePoint());
        Il(this.peekCodePoint(0)) && this.consumeCodePoint();
        var n = parseInt(t, 16);
        return n === 0 || GM(n) || n > 1114111 ? ym : n;
      }
      return e === sr ? ym : e;
    }, A.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (Cm(t))
          e += st(t);
        else if (wi(t, this.peekCodePoint(0)))
          e += st(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, A;
  }()
), wy = (
  /** @class */
  function() {
    function A(e) {
      this._tokens = e;
    }
    return A.create = function(e) {
      var t = new By();
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
        if (n.type === 32 || BP(n, e))
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
      return typeof e > "u" ? Hd : e;
    }, A.prototype.reconsumeToken = function(e) {
      this._tokens.unshift(e);
    }, A;
  }()
), js = function(A) {
  return A.type === 15;
}, mo = function(A) {
  return A.type === 17;
}, ke = function(A) {
  return A.type === 20;
}, gP = function(A) {
  return A.type === 0;
}, Sd = function(A, e) {
  return ke(A) && A.value === e;
}, my = function(A) {
  return A.type !== 31;
}, po = function(A) {
  return A.type !== 31 && A.type !== 4;
}, wr = function(A) {
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
}, BP = function(A, e) {
  return e === 11 && A.type === 12 || e === 28 && A.type === 29 ? !0 : e === 2 && A.type === 3;
}, bi = function(A) {
  return A.type === 17 || A.type === 15;
}, lt = function(A) {
  return A.type === 16 || bi(A);
}, vy = function(A) {
  return A.length > 1 ? [A[0], A[1]] : [A[0]];
}, Et = {
  type: 17,
  number: 0,
  flags: Js
}, Zp = {
  type: 16,
  number: 50,
  flags: Js
}, Ci = {
  type: 16,
  number: 100,
  flags: Js
}, ds = function(A, e, t) {
  var n = A[0], i = A[1];
  return [Xe(n, e), Xe(typeof i < "u" ? i : n, t)];
}, Xe = function(A, e) {
  if (A.type === 16)
    return A.number / 100 * e;
  if (js(A))
    switch (A.unit) {
      case "rem":
      case "em":
        return 16 * A.number;
      case "px":
      default:
        return A.number;
    }
  return A.number;
}, yy = "deg", Cy = "grad", Qy = "rad", Fy = "turn", Gc = {
  name: "angle",
  parse: function(A, e) {
    if (e.type === 15)
      switch (e.unit) {
        case yy:
          return Math.PI * e.number / 180;
        case Cy:
          return Math.PI / 200 * e.number;
        case Qy:
          return e.number;
        case Fy:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, Uy = function(A) {
  return A.type === 15 && (A.unit === yy || A.unit === Cy || A.unit === Qy || A.unit === Fy);
}, Ey = function(A) {
  var e = A.filter(ke).map(function(t) {
    return t.value;
  }).join(" ");
  switch (e) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [Et, Et];
    case "to top":
    case "bottom":
      return Fn(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Et, Ci];
    case "to right":
    case "left":
      return Fn(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [Ci, Ci];
    case "to bottom":
    case "top":
      return Fn(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [Ci, Et];
    case "to left":
    case "right":
      return Fn(270);
  }
  return 0;
}, Fn = function(A) {
  return Math.PI * A / 180;
}, Ui = {
  name: "color",
  parse: function(A, e) {
    if (e.type === 18) {
      var t = wP[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + e.name + '"');
      return t(A, e.values);
    }
    if (e.type === 5) {
      if (e.value.length === 3) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), o = e.value.substring(2, 3);
        return Qi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(o + o, 16), 1);
      }
      if (e.value.length === 4) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), o = e.value.substring(2, 3), l = e.value.substring(3, 4);
        return Qi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(o + o, 16), parseInt(l + l, 16) / 255);
      }
      if (e.value.length === 6) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), o = e.value.substring(4, 6);
        return Qi(parseInt(n, 16), parseInt(i, 16), parseInt(o, 16), 1);
      }
      if (e.value.length === 8) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), o = e.value.substring(4, 6), l = e.value.substring(6, 8);
        return Qi(parseInt(n, 16), parseInt(i, 16), parseInt(o, 16), parseInt(l, 16) / 255);
      }
    }
    if (e.type === 20) {
      var f = Gr[e.value.toUpperCase()];
      if (typeof f < "u")
        return f;
    }
    return Gr.TRANSPARENT;
  }
}, Ei = function(A) {
  return (255 & A) === 0;
}, wt = function(A) {
  var e = 255 & A, t = 255 & A >> 8, n = 255 & A >> 16, i = 255 & A >> 24;
  return e < 255 ? "rgba(" + i + "," + n + "," + t + "," + e / 255 + ")" : "rgb(" + i + "," + n + "," + t + ")";
}, Qi = function(A, e, t, n) {
  return (A << 24 | e << 16 | t << 8 | Math.round(n * 255) << 0) >>> 0;
}, Qm = function(A, e) {
  if (A.type === 17)
    return A.number;
  if (A.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? A.number / 100 * t : Math.round(A.number / 100 * t);
  }
  return 0;
}, Fm = function(A, e) {
  var t = e.filter(po);
  if (t.length === 3) {
    var n = t.map(Qm), i = n[0], o = n[1], l = n[2];
    return Qi(i, o, l, 1);
  }
  if (t.length === 4) {
    var f = t.map(Qm), i = f[0], o = f[1], l = f[2], c = f[3];
    return Qi(i, o, l, c);
  }
  return 0;
};
function Sh(A, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - A) * t * 6 + A : t < 1 / 2 ? e : t < 2 / 3 ? (e - A) * 6 * (2 / 3 - t) + A : A;
}
var Um = function(A, e) {
  var t = e.filter(po), n = t[0], i = t[1], o = t[2], l = t[3], f = (n.type === 17 ? Fn(n.number) : Gc.parse(A, n)) / (Math.PI * 2), c = lt(i) ? i.number / 100 : 0, h = lt(o) ? o.number / 100 : 0, m = typeof l < "u" && lt(l) ? Xe(l, 1) : 1;
  if (c === 0)
    return Qi(h * 255, h * 255, h * 255, 1);
  var B = h <= 0.5 ? h * (c + 1) : h + c - h * c, g = h * 2 - B, v = Sh(g, B, f + 1 / 3), u = Sh(g, B, f), C = Sh(g, B, f - 1 / 3);
  return Qi(v * 255, u * 255, C * 255, m);
}, wP = {
  hsl: Um,
  hsla: Um,
  rgb: Fm,
  rgba: Fm
}, Es = function(A, e) {
  return Ui.parse(A, wy.create(e).parseComponentValue());
}, Gr = {
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
}, mP = {
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
}, vP = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Vc = function(A, e) {
  var t = Ui.parse(A, e[0]), n = e[1];
  return n && lt(n) ? { color: t, stop: n } : { color: t, stop: null };
}, Em = function(A, e) {
  var t = A[0], n = A[A.length - 1];
  t.stop === null && (t.stop = Et), n.stop === null && (n.stop = Ci);
  for (var i = [], o = 0, l = 0; l < A.length; l++) {
    var f = A[l].stop;
    if (f !== null) {
      var c = Xe(f, e);
      c > o ? i.push(c) : i.push(o), o = c;
    } else
      i.push(null);
  }
  for (var h = null, l = 0; l < i.length; l++) {
    var m = i[l];
    if (m === null)
      h === null && (h = l);
    else if (h !== null) {
      for (var B = l - h, g = i[h - 1], v = (m - g) / (B + 1), u = 1; u <= B; u++)
        i[h + u - 1] = v * u;
      h = null;
    }
  }
  return A.map(function(C, F) {
    var U = C.color;
    return { color: U, stop: Math.max(Math.min(1, i[F] / e), 0) };
  });
}, yP = function(A, e, t) {
  var n = e / 2, i = t / 2, o = Xe(A[0], e) - n, l = i - Xe(A[1], t);
  return (Math.atan2(l, o) + Math.PI * 2) % (Math.PI * 2);
}, CP = function(A, e, t) {
  var n = typeof A == "number" ? A : yP(A, e, t), i = Math.abs(e * Math.sin(n)) + Math.abs(t * Math.cos(n)), o = e / 2, l = t / 2, f = i / 2, c = Math.sin(n - Math.PI / 2) * f, h = Math.cos(n - Math.PI / 2) * f;
  return [i, o - h, o + h, l - c, l + c];
}, Gn = function(A, e) {
  return Math.sqrt(A * A + e * e);
}, bm = function(A, e, t, n, i) {
  var o = [
    [0, 0],
    [0, e],
    [A, 0],
    [A, e]
  ];
  return o.reduce(function(l, f) {
    var c = f[0], h = f[1], m = Gn(t - c, n - h);
    return (i ? m < l.optimumDistance : m > l.optimumDistance) ? {
      optimumCorner: f,
      optimumDistance: m
    } : l;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, QP = function(A, e, t, n, i) {
  var o = 0, l = 0;
  switch (A.size) {
    case 0:
      A.shape === 0 ? o = l = Math.min(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (o = Math.min(Math.abs(e), Math.abs(e - n)), l = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (A.shape === 0)
        o = l = Math.min(Gn(e, t), Gn(e, t - i), Gn(e - n, t), Gn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - n)), c = bm(n, i, e, t, !0), h = c[0], m = c[1];
        o = Gn(h - e, (m - t) / f), l = f * o;
      }
      break;
    case 1:
      A.shape === 0 ? o = l = Math.max(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (o = Math.max(Math.abs(e), Math.abs(e - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (A.shape === 0)
        o = l = Math.max(Gn(e, t), Gn(e, t - i), Gn(e - n, t), Gn(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - n)), B = bm(n, i, e, t, !1), h = B[0], m = B[1];
        o = Gn(h - e, (m - t) / f), l = f * o;
      }
      break;
  }
  return Array.isArray(A.size) && (o = Xe(A.size[0], n), l = A.size.length === 2 ? Xe(A.size[1], i) : o), [o, l];
}, FP = function(A, e) {
  var t = Fn(180), n = [];
  return wr(e).forEach(function(i, o) {
    if (o === 0) {
      var l = i[0];
      if (l.type === 20 && l.value === "to") {
        t = Ey(i);
        return;
      } else if (Uy(l)) {
        t = Gc.parse(A, l);
        return;
      }
    }
    var f = Vc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Ll = function(A, e) {
  var t = Fn(180), n = [];
  return wr(e).forEach(function(i, o) {
    if (o === 0) {
      var l = i[0];
      if (l.type === 20 && ["top", "left", "right", "bottom"].indexOf(l.value) !== -1) {
        t = Ey(i);
        return;
      } else if (Uy(l)) {
        t = (Gc.parse(A, l) + Fn(270)) % Fn(360);
        return;
      }
    }
    var f = Vc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, UP = function(A, e) {
  var t = Fn(180), n = [], i = 1, o = 0, l = 3, f = [];
  return wr(e).forEach(function(c, h) {
    var m = c[0];
    if (h === 0) {
      if (ke(m) && m.value === "linear") {
        i = 1;
        return;
      } else if (ke(m) && m.value === "radial") {
        i = 2;
        return;
      }
    }
    if (m.type === 18) {
      if (m.name === "from") {
        var B = Ui.parse(A, m.values[0]);
        n.push({ stop: Et, color: B });
      } else if (m.name === "to") {
        var B = Ui.parse(A, m.values[0]);
        n.push({ stop: Ci, color: B });
      } else if (m.name === "color-stop") {
        var g = m.values.filter(po);
        if (g.length === 2) {
          var B = Ui.parse(A, g[1]), v = g[0];
          mo(v) && n.push({
            stop: { type: 16, number: v.number * 100, flags: v.flags },
            color: B
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + Fn(180)) % Fn(360),
    stops: n,
    type: i
  } : { size: l, shape: o, stops: n, position: f, type: i };
}, by = "closest-side", _y = "farthest-side", xy = "closest-corner", Iy = "farthest-corner", Hy = "circle", Sy = "ellipse", Ly = "cover", Ty = "contain", EP = function(A, e) {
  var t = 0, n = 3, i = [], o = [];
  return wr(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0) {
      var h = !1;
      c = l.reduce(function(B, g) {
        if (h)
          if (ke(g))
            switch (g.value) {
              case "center":
                return o.push(Zp), B;
              case "top":
              case "left":
                return o.push(Et), B;
              case "right":
              case "bottom":
                return o.push(Ci), B;
            }
          else (lt(g) || bi(g)) && o.push(g);
        else if (ke(g))
          switch (g.value) {
            case Hy:
              return t = 0, !1;
            case Sy:
              return t = 1, !1;
            case "at":
              return h = !0, !1;
            case by:
              return n = 0, !1;
            case Ly:
            case _y:
              return n = 1, !1;
            case Ty:
            case xy:
              return n = 2, !1;
            case Iy:
              return n = 3, !1;
          }
        else if (bi(g) || lt(g))
          return Array.isArray(n) || (n = []), n.push(g), !1;
        return B;
      }, c);
    }
    if (c) {
      var m = Vc(A, l);
      i.push(m);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: o,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, Tl = function(A, e) {
  var t = 0, n = 3, i = [], o = [];
  return wr(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0 ? c = l.reduce(function(m, B) {
      if (ke(B))
        switch (B.value) {
          case "center":
            return o.push(Zp), !1;
          case "top":
          case "left":
            return o.push(Et), !1;
          case "right":
          case "bottom":
            return o.push(Ci), !1;
        }
      else if (lt(B) || bi(B))
        return o.push(B), !1;
      return m;
    }, c) : f === 1 && (c = l.reduce(function(m, B) {
      if (ke(B))
        switch (B.value) {
          case Hy:
            return t = 0, !1;
          case Sy:
            return t = 1, !1;
          case Ty:
          case by:
            return n = 0, !1;
          case _y:
            return n = 1, !1;
          case xy:
            return n = 2, !1;
          case Ly:
          case Iy:
            return n = 3, !1;
        }
      else if (bi(B) || lt(B))
        return Array.isArray(n) || (n = []), n.push(B), !1;
      return m;
    }, c)), c) {
      var h = Vc(A, l);
      i.push(h);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: o,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, bP = function(A) {
  return A.type === 1;
}, _P = function(A) {
  return A.type === 2;
}, Ag = {
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
      var n = Dy[e.name];
      if (typeof n > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return n(A, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function xP(A) {
  return !(A.type === 20 && A.value === "none") && (A.type !== 18 || !!Dy[A.name]);
}
var Dy = {
  "linear-gradient": FP,
  "-moz-linear-gradient": Ll,
  "-ms-linear-gradient": Ll,
  "-o-linear-gradient": Ll,
  "-webkit-linear-gradient": Ll,
  "radial-gradient": EP,
  "-moz-radial-gradient": Tl,
  "-ms-radial-gradient": Tl,
  "-o-radial-gradient": Tl,
  "-webkit-radial-gradient": Tl,
  "-webkit-gradient": UP
}, IP = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(n) {
      return po(n) && xP(n);
    }).map(function(n) {
      return Ag.parse(A, n);
    });
  }
}, HP = {
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
}, SP = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return wr(e).map(function(t) {
      return t.filter(lt);
    }).map(vy);
  }
}, LP = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return wr(e).map(function(t) {
      return t.filter(ke).map(function(n) {
        return n.value;
      }).join(" ");
    }).map(TP);
  }
}, TP = function(A) {
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
}, no;
(function(A) {
  A.AUTO = "auto", A.CONTAIN = "contain", A.COVER = "cover";
})(no || (no = {}));
var DP = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return wr(e).map(function(t) {
      return t.filter(OP);
    });
  }
}, OP = function(A) {
  return ke(A) || lt(A);
}, Wc = function(A) {
  return {
    name: "border-" + A + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, NP = Wc("top"), MP = Wc("right"), PP = Wc("bottom"), KP = Wc("left"), Xc = function(A) {
  return {
    name: "border-radius-" + A,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return vy(t.filter(lt));
    }
  };
}, RP = Xc("top-left"), kP = Xc("top-right"), $P = Xc("bottom-right"), GP = Xc("bottom-left"), qc = function(A) {
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
}, VP = qc("top"), WP = qc("right"), XP = qc("bottom"), qP = qc("left"), zc = function(A) {
  return {
    name: "border-" + A + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return js(t) ? t.number : 0;
    }
  };
}, zP = zc("top"), JP = zc("right"), jP = zc("bottom"), YP = zc("left"), ZP = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, AK = {
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
}, eK = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(ke).reduce(
      function(t, n) {
        return t | tK(n.value);
      },
      0
      /* NONE */
    );
  }
}, tK = function(A) {
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
}, nK = {
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
}, rK = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: !1,
  type: 0,
  parse: function(A, e) {
    return e.type === 20 && e.value === "normal" ? 0 : e.type === 17 || e.type === 15 ? e.number : 0;
  }
}, Cc;
(function(A) {
  A.NORMAL = "normal", A.STRICT = "strict";
})(Cc || (Cc = {}));
var iK = {
  name: "line-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "strict":
        return Cc.STRICT;
      case "normal":
      default:
        return Cc.NORMAL;
    }
  }
}, aK = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, _m = function(A, e) {
  return ke(A) && A.value === "normal" ? 1.2 * e : A.type === 17 ? e * A.number : lt(A) ? Xe(A, e) : e;
}, oK = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return e.type === 20 && e.value === "none" ? null : Ag.parse(A, e);
  }
}, sK = {
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
}, Ld = {
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
}, Jc = function(A) {
  return {
    name: "margin-" + A,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, uK = Jc("top"), lK = Jc("right"), cK = Jc("bottom"), fK = Jc("left"), hK = {
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
}, dK = {
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
}, jc = function(A) {
  return {
    name: "padding-" + A,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, pK = jc("top"), gK = jc("right"), BK = jc("bottom"), wK = jc("left"), mK = {
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
}, vK = {
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
}, yK = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Sd(e[0], "none") ? [] : wr(e).map(function(t) {
      for (var n = {
        color: Gr.TRANSPARENT,
        offsetX: Et,
        offsetY: Et,
        blur: Et
      }, i = 0, o = 0; o < t.length; o++) {
        var l = t[o];
        bi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = Ui.parse(A, l);
      }
      return n;
    });
  }
}, CK = {
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
}, QK = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = EK[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, FK = function(A) {
  var e = A.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, UK = function(A) {
  var e = A.filter(function(c) {
    return c.type === 17;
  }).map(function(c) {
    return c.number;
  }), t = e[0], n = e[1];
  e[2], e[3];
  var i = e[4], o = e[5];
  e[6], e[7], e[8], e[9], e[10], e[11];
  var l = e[12], f = e[13];
  return e[14], e[15], e.length === 16 ? [t, n, i, o, l, f] : null;
}, EK = {
  matrix: FK,
  matrix3d: UK
}, xm = {
  type: 16,
  number: 50,
  flags: Js
}, bK = [xm, xm], _K = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    var t = e.filter(lt);
    return t.length !== 2 ? bK : [t[0], t[1]];
  }
}, xK = {
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
}, bs;
(function(A) {
  A.NORMAL = "normal", A.BREAK_ALL = "break-all", A.KEEP_ALL = "keep-all";
})(bs || (bs = {}));
var IK = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "break-all":
        return bs.BREAK_ALL;
      case "keep-all":
        return bs.KEEP_ALL;
      case "normal":
      default:
        return bs.NORMAL;
    }
  }
}, HK = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20)
      return { auto: !0, order: 0 };
    if (mo(e))
      return { auto: !1, order: e.number };
    throw new Error("Invalid z-index number parsed");
  }
}, Oy = {
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
}, SK = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return mo(e) ? e.number : 1;
  }
}, LK = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, TK = {
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
}, DK = {
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
}, OK = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, NK = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    if (mo(e))
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
}, MK = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.filter(ke).map(function(t) {
      return t.value;
    });
  }
}, PK = {
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
}, dt = function(A, e) {
  return (A & e) !== 0;
}, KK = {
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
}, RK = {
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
    for (var n = [], i = e.filter(my), o = 0; o < i.length; o++) {
      var l = i[o], f = i[o + 1];
      if (l.type === 20) {
        var c = f && mo(f) ? f.number : 1;
        n.push({ counter: l.value, increment: c });
      }
    }
    return n;
  }
}, kK = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    for (var t = [], n = e.filter(my), i = 0; i < n.length; i++) {
      var o = n[i], l = n[i + 1];
      if (ke(o) && o.value !== "none") {
        var f = l && mo(l) ? l.number : 0;
        t.push({ counter: o.value, reset: f });
      }
    }
    return t;
  }
}, $K = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(js).map(function(t) {
      return Oy.parse(A, t);
    });
  }
}, GK = {
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
    var n = [], i = e.filter(gP);
    if (i.length % 2 !== 0)
      return null;
    for (var o = 0; o < i.length; o += 2) {
      var l = i[o].value, f = i[o + 1].value;
      n.push({ open: l, close: f });
    }
    return n;
  }
}, Im = function(A, e, t) {
  if (!A)
    return "";
  var n = A[Math.min(e, A.length - 1)];
  return n ? t ? n.open : n.close : "";
}, VK = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Sd(e[0], "none") ? [] : wr(e).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: Et,
        offsetY: Et,
        blur: Et,
        spread: Et,
        inset: !1
      }, i = 0, o = 0; o < t.length; o++) {
        var l = t[o];
        Sd(l, "inset") ? n.inset = !0 : bi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = Ui.parse(A, l);
      }
      return n;
    });
  }
}, WK = {
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
}, XK = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, qK = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return js(e) ? e.number : 0;
  }
}, zK = (
  /** @class */
  function() {
    function A(e, t) {
      var n, i;
      this.animationDuration = MA(e, $K, t.animationDuration), this.backgroundClip = MA(e, mP, t.backgroundClip), this.backgroundColor = MA(e, vP, t.backgroundColor), this.backgroundImage = MA(e, IP, t.backgroundImage), this.backgroundOrigin = MA(e, HP, t.backgroundOrigin), this.backgroundPosition = MA(e, SP, t.backgroundPosition), this.backgroundRepeat = MA(e, LP, t.backgroundRepeat), this.backgroundSize = MA(e, DP, t.backgroundSize), this.borderTopColor = MA(e, NP, t.borderTopColor), this.borderRightColor = MA(e, MP, t.borderRightColor), this.borderBottomColor = MA(e, PP, t.borderBottomColor), this.borderLeftColor = MA(e, KP, t.borderLeftColor), this.borderTopLeftRadius = MA(e, RP, t.borderTopLeftRadius), this.borderTopRightRadius = MA(e, kP, t.borderTopRightRadius), this.borderBottomRightRadius = MA(e, $P, t.borderBottomRightRadius), this.borderBottomLeftRadius = MA(e, GP, t.borderBottomLeftRadius), this.borderTopStyle = MA(e, VP, t.borderTopStyle), this.borderRightStyle = MA(e, WP, t.borderRightStyle), this.borderBottomStyle = MA(e, XP, t.borderBottomStyle), this.borderLeftStyle = MA(e, qP, t.borderLeftStyle), this.borderTopWidth = MA(e, zP, t.borderTopWidth), this.borderRightWidth = MA(e, JP, t.borderRightWidth), this.borderBottomWidth = MA(e, jP, t.borderBottomWidth), this.borderLeftWidth = MA(e, YP, t.borderLeftWidth), this.boxShadow = MA(e, VK, t.boxShadow), this.color = MA(e, ZP, t.color), this.direction = MA(e, AK, t.direction), this.display = MA(e, eK, t.display), this.float = MA(e, nK, t.cssFloat), this.fontFamily = MA(e, DK, t.fontFamily), this.fontSize = MA(e, OK, t.fontSize), this.fontStyle = MA(e, PK, t.fontStyle), this.fontVariant = MA(e, MK, t.fontVariant), this.fontWeight = MA(e, NK, t.fontWeight), this.letterSpacing = MA(e, rK, t.letterSpacing), this.lineBreak = MA(e, iK, t.lineBreak), this.lineHeight = MA(e, aK, t.lineHeight), this.listStyleImage = MA(e, oK, t.listStyleImage), this.listStylePosition = MA(e, sK, t.listStylePosition), this.listStyleType = MA(e, Ld, t.listStyleType), this.marginTop = MA(e, uK, t.marginTop), this.marginRight = MA(e, lK, t.marginRight), this.marginBottom = MA(e, cK, t.marginBottom), this.marginLeft = MA(e, fK, t.marginLeft), this.opacity = MA(e, SK, t.opacity);
      var o = MA(e, hK, t.overflow);
      this.overflowX = o[0], this.overflowY = o[o.length > 1 ? 1 : 0], this.overflowWrap = MA(e, dK, t.overflowWrap), this.paddingTop = MA(e, pK, t.paddingTop), this.paddingRight = MA(e, gK, t.paddingRight), this.paddingBottom = MA(e, BK, t.paddingBottom), this.paddingLeft = MA(e, wK, t.paddingLeft), this.paintOrder = MA(e, WK, t.paintOrder), this.position = MA(e, vK, t.position), this.textAlign = MA(e, mK, t.textAlign), this.textDecorationColor = MA(e, LK, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = MA(e, TK, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = MA(e, yK, t.textShadow), this.textTransform = MA(e, CK, t.textTransform), this.transform = MA(e, QK, t.transform), this.transformOrigin = MA(e, _K, t.transformOrigin), this.visibility = MA(e, xK, t.visibility), this.webkitTextStrokeColor = MA(e, XK, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = MA(e, qK, t.webkitTextStrokeWidth), this.wordBreak = MA(e, IK, t.wordBreak), this.zIndex = MA(e, HK, t.zIndex);
    }
    return A.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, A.prototype.isTransparent = function() {
      return Ei(this.backgroundColor);
    }, A.prototype.isTransformed = function() {
      return this.transform !== null;
    }, A.prototype.isPositioned = function() {
      return this.position !== 0;
    }, A.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    }, A.prototype.isFloating = function() {
      return this.float !== 0;
    }, A.prototype.isInlineLevel = function() {
      return dt(
        this.display,
        4
        /* INLINE */
      ) || dt(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || dt(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || dt(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || dt(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || dt(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, A;
  }()
), JK = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.content = MA(e, KK, t.content), this.quotes = MA(e, GK, t.quotes);
    }
    return A;
  }()
), Hm = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.counterIncrement = MA(e, RK, t.counterIncrement), this.counterReset = MA(e, kK, t.counterReset);
    }
    return A;
  }()
), MA = function(A, e, t) {
  var n = new By(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  n.write(i);
  var o = new wy(n.read());
  switch (e.type) {
    case 2:
      var l = o.parseComponentValue();
      return e.parse(A, ke(l) ? l.value : e.initialValue);
    case 0:
      return e.parse(A, o.parseComponentValue());
    case 1:
      return e.parse(A, o.parseComponentValues());
    case 4:
      return o.parseComponentValue();
    case 3:
      switch (e.format) {
        case "angle":
          return Gc.parse(A, o.parseComponentValue());
        case "color":
          return Ui.parse(A, o.parseComponentValue());
        case "image":
          return Ag.parse(A, o.parseComponentValue());
        case "length":
          var f = o.parseComponentValue();
          return bi(f) ? f : Et;
        case "length-percentage":
          var c = o.parseComponentValue();
          return lt(c) ? c : Et;
        case "time":
          return Oy.parse(A, o.parseComponentValue());
      }
      break;
  }
}, jK = "data-html2canvas-debug", YK = function(A) {
  var e = A.getAttribute(jK);
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
}, Td = function(A, e) {
  var t = YK(A);
  return t === 1 || e === t;
}, mr = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, Td(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new zK(e, window.getComputedStyle(t, null)), Nd(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = kc(this.context, t), Td(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return A;
  }()
), ZK = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", Sm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ps = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Dl = 0; Dl < Sm.length; Dl++)
  ps[Sm.charCodeAt(Dl)] = Dl;
var AR = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, o, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), m = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    o = ps[A.charCodeAt(n)], l = ps[A.charCodeAt(n + 1)], f = ps[A.charCodeAt(n + 2)], c = ps[A.charCodeAt(n + 3)], m[i++] = o << 2 | l >> 4, m[i++] = (l & 15) << 4 | f >> 2, m[i++] = (f & 3) << 6 | c & 63;
  return h;
}, eR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, tR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, aa = 5, eg = 11, Lh = 2, nR = eg - aa, Ny = 65536 >> aa, rR = 1 << aa, Th = rR - 1, iR = 1024 >> aa, aR = Ny + iR, oR = aR, sR = 32, uR = oR + sR, lR = 65536 >> eg, cR = 1 << nR, fR = cR - 1, Lm = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, hR = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, dR = function(A, e) {
  var t = AR(A), n = Array.isArray(t) ? tR(t) : new Uint32Array(t), i = Array.isArray(t) ? eR(t) : new Uint16Array(t), o = 24, l = Lm(i, o / 2, n[4] / 2), f = n[5] === 2 ? Lm(i, (o + n[4]) / 2) : hR(n, Math.ceil((o + n[4]) / 4));
  return new pR(n[0], n[1], n[2], n[3], l, f);
}, pR = (
  /** @class */
  function() {
    function A(e, t, n, i, o, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = o, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> aa], t = (t << Lh) + (e & Th), this.data[t];
        if (e <= 65535)
          return t = this.index[Ny + (e - 55296 >> aa)], t = (t << Lh) + (e & Th), this.data[t];
        if (e < this.highStart)
          return t = uR - lR + (e >> eg), t = this.index[t], t += e >> aa & fR, t = this.index[t], t = (t << Lh) + (e & Th), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Tm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", gR = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Ol = 0; Ol < Tm.length; Ol++)
  gR[Tm.charCodeAt(Ol)] = Ol;
var BR = 1, Dh = 2, Oh = 3, Dm = 4, Om = 5, wR = 7, Nm = 8, Nh = 9, Mh = 10, Mm = 11, Pm = 12, Km = 13, Rm = 14, Ph = 15, mR = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var o = A.charCodeAt(t++);
      (o & 64512) === 56320 ? e.push(((i & 1023) << 10) + (o & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, vR = function() {
  for (var A = [], e = 0; e < arguments.length; e++)
    A[e] = arguments[e];
  if (String.fromCodePoint)
    return String.fromCodePoint.apply(String, A);
  var t = A.length;
  if (!t)
    return "";
  for (var n = [], i = -1, o = ""; ++i < t; ) {
    var l = A[i];
    l <= 65535 ? n.push(l) : (l -= 65536, n.push((l >> 10) + 55296, l % 1024 + 56320)), (i + 1 === t || n.length > 16384) && (o += String.fromCharCode.apply(String, n), n.length = 0);
  }
  return o;
}, yR = dR(ZK), yn = "×", Kh = "÷", CR = function(A) {
  return yR.get(A);
}, QR = function(A, e, t) {
  var n = t - 2, i = e[n], o = e[t - 1], l = e[t];
  if (o === Dh && l === Oh)
    return yn;
  if (o === Dh || o === Oh || o === Dm || l === Dh || l === Oh || l === Dm)
    return Kh;
  if (o === Nm && [Nm, Nh, Mm, Pm].indexOf(l) !== -1 || (o === Mm || o === Nh) && (l === Nh || l === Mh) || (o === Pm || o === Mh) && l === Mh || l === Km || l === Om || l === wR || o === BR)
    return yn;
  if (o === Km && l === Rm) {
    for (; i === Om; )
      i = e[--n];
    if (i === Rm)
      return yn;
  }
  if (o === Ph && l === Ph) {
    for (var f = 0; i === Ph; )
      f++, i = e[--n];
    if (f % 2 === 0)
      return yn;
  }
  return Kh;
}, FR = function(A) {
  var e = mR(A), t = e.length, n = 0, i = 0, o = e.map(CR);
  return {
    next: function() {
      if (n >= t)
        return { done: !0, value: null };
      for (var l = yn; n < t && (l = QR(e, o, ++n)) === yn; )
        ;
      if (l !== yn || n === t) {
        var f = vR.apply(null, e.slice(i, n));
        return i = n, { value: f, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, UR = function(A) {
  for (var e = FR(A), t = [], n; !(n = e.next()).done; )
    n.value && t.push(n.value.slice());
  return t;
}, ER = function(A) {
  var e = 123;
  if (A.createRange) {
    var t = A.createRange();
    if (t.getBoundingClientRect) {
      var n = A.createElement("boundtest");
      n.style.height = e + "px", n.style.display = "block", A.body.appendChild(n), t.selectNode(n);
      var i = t.getBoundingClientRect(), o = Math.round(i.height);
      if (A.body.removeChild(n), o === e)
        return !0;
    }
  }
  return !1;
}, bR = function(A) {
  var e = A.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", A.body.appendChild(e);
  var t = A.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = e.firstChild, i = $c(n.data).map(function(c) {
    return st(c);
  }), o = 0, l = {}, f = i.every(function(c, h) {
    t.setStart(n, o), t.setEnd(n, o + c.length);
    var m = t.getBoundingClientRect();
    o += c.length;
    var B = m.x > l.x || m.y > l.y;
    return l = m, h === 0 ? !0 : B;
  });
  return A.body.removeChild(e), f;
}, _R = function() {
  return typeof new Image().crossOrigin < "u";
}, xR = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, IR = function(A) {
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
}, km = function(A) {
  return A[0] === 0 && A[1] === 255 && A[2] === 0 && A[3] === 255;
}, HR = function(A) {
  var e = A.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var n = e.getContext("2d");
  if (!n)
    return Promise.reject(!1);
  n.fillStyle = "rgb(0, 255, 0)", n.fillRect(0, 0, t, t);
  var i = new Image(), o = e.toDataURL();
  i.src = o;
  var l = Dd(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), $m(l).then(function(f) {
    n.drawImage(f, 0, 0);
    var c = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var h = A.createElement("div");
    return h.style.backgroundImage = "url(" + o + ")", h.style.height = t + "px", km(c) ? $m(Dd(t, t, 0, 0, h)) : Promise.reject(!1);
  }).then(function(f) {
    return n.drawImage(f, 0, 0), km(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Dd = function(A, e, t, n, i) {
  var o = "http://www.w3.org/2000/svg", l = document.createElementNS(o, "svg"), f = document.createElementNS(o, "foreignObject");
  return l.setAttributeNS(null, "width", A.toString()), l.setAttributeNS(null, "height", e.toString()), f.setAttributeNS(null, "width", "100%"), f.setAttributeNS(null, "height", "100%"), f.setAttributeNS(null, "x", t.toString()), f.setAttributeNS(null, "y", n.toString()), f.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(f), f.appendChild(i), l;
}, $m = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      return e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, Ft = {
  get SUPPORT_RANGE_BOUNDS() {
    var A = ER(document);
    return Object.defineProperty(Ft, "SUPPORT_RANGE_BOUNDS", { value: A }), A;
  },
  get SUPPORT_WORD_BREAKING() {
    var A = Ft.SUPPORT_RANGE_BOUNDS && bR(document);
    return Object.defineProperty(Ft, "SUPPORT_WORD_BREAKING", { value: A }), A;
  },
  get SUPPORT_SVG_DRAWING() {
    var A = IR(document);
    return Object.defineProperty(Ft, "SUPPORT_SVG_DRAWING", { value: A }), A;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var A = typeof Array.from == "function" && typeof window.fetch == "function" ? HR(document) : Promise.resolve(!1);
    return Object.defineProperty(Ft, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A }), A;
  },
  get SUPPORT_CORS_IMAGES() {
    var A = _R();
    return Object.defineProperty(Ft, "SUPPORT_CORS_IMAGES", { value: A }), A;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var A = xR();
    return Object.defineProperty(Ft, "SUPPORT_RESPONSE_TYPE", { value: A }), A;
  },
  get SUPPORT_CORS_XHR() {
    var A = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(Ft, "SUPPORT_CORS_XHR", { value: A }), A;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var A = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(Ft, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: A }), A;
  }
}, _s = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.text = e, this.bounds = t;
    }
    return A;
  }()
), SR = function(A, e, t, n) {
  var i = DR(e, t), o = [], l = 0;
  return i.forEach(function(f) {
    if (t.textDecorationLine.length || f.trim().length > 0)
      if (Ft.SUPPORT_RANGE_BOUNDS) {
        var c = Gm(n, l, f.length).getClientRects();
        if (c.length > 1) {
          var h = tg(f), m = 0;
          h.forEach(function(g) {
            o.push(new _s(g, qr.fromDOMRectList(A, Gm(n, m + l, g.length).getClientRects()))), m += g.length;
          });
        } else
          o.push(new _s(f, qr.fromDOMRectList(A, c)));
      } else {
        var B = n.splitText(f.length);
        o.push(new _s(f, LR(A, n))), n = B;
      }
    else Ft.SUPPORT_RANGE_BOUNDS || (n = n.splitText(f.length));
    l += f.length;
  }), o;
}, LR = function(A, e) {
  var t = e.ownerDocument;
  if (t) {
    var n = t.createElement("html2canvaswrapper");
    n.appendChild(e.cloneNode(!0));
    var i = e.parentNode;
    if (i) {
      i.replaceChild(n, e);
      var o = kc(A, n);
      return n.firstChild && i.replaceChild(n.firstChild, n), o;
    }
  }
  return qr.EMPTY;
}, Gm = function(A, e, t) {
  var n = A.ownerDocument;
  if (!n)
    throw new Error("Node has no owner document");
  var i = n.createRange();
  return i.setStart(A, e), i.setEnd(A, e + t), i;
}, tg = function(A) {
  if (Ft.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(A)).map(function(t) {
      return t.segment;
    });
  }
  return UR(A);
}, TR = function(A, e) {
  if (Ft.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(A)).map(function(n) {
      return n.segment;
    });
  }
  return NR(A, e);
}, DR = function(A, e) {
  return e.letterSpacing !== 0 ? tg(A) : TR(A, e);
}, OR = [32, 160, 4961, 65792, 65793, 4153, 4241], NR = function(A, e) {
  for (var t = lM(A, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), n = [], i, o = function() {
    if (i.value) {
      var l = i.value.slice(), f = $c(l), c = "";
      f.forEach(function(h) {
        OR.indexOf(h) === -1 ? c += st(h) : (c.length && n.push(c), n.push(st(h)), c = "");
      }), c.length && n.push(c);
    }
  }; !(i = t.next()).done; )
    o();
  return n;
}, MR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.text = PR(t.data, n.textTransform), this.textBounds = SR(e, this.text, n, t);
    }
    return A;
  }()
), PR = function(A, e) {
  switch (e) {
    case 1:
      return A.toLowerCase();
    case 3:
      return A.replace(KR, RR);
    case 2:
      return A.toUpperCase();
    default:
      return A;
  }
}, KR = /(^|\s|:|-|\(|\))([a-z])/g, RR = function(A, e, t) {
  return A.length > 0 ? e + t.toUpperCase() : A;
}, My = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.src = n.currentSrc || n.src, i.intrinsicWidth = n.naturalWidth, i.intrinsicHeight = n.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(mr)
), Py = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n, i.intrinsicWidth = n.width, i.intrinsicHeight = n.height, i;
    }
    return e;
  }(mr)
), Ky = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, o = new XMLSerializer(), l = kc(t, n);
      return n.setAttribute("width", l.width + "px"), n.setAttribute("height", l.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(o.serializeToString(n)), i.intrinsicWidth = n.width.baseVal.value, i.intrinsicHeight = n.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(mr)
), Ry = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(mr)
), Od = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.start = n.start, i.reversed = typeof n.reversed == "boolean" && n.reversed === !0, i;
    }
    return e;
  }(mr)
), kR = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], $R = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], GR = function(A) {
  return A.width > A.height ? new qr(A.left + (A.width - A.height) / 2, A.top, A.height, A.height) : A.width < A.height ? new qr(A.left, A.top + (A.height - A.width) / 2, A.width, A.width) : A;
}, VR = function(A) {
  var e = A.type === WR ? new Array(A.value.length + 1).join("•") : A.value;
  return e.length === 0 ? A.placeholder || "" : e;
}, Qc = "checkbox", Fc = "radio", WR = "password", Vm = 707406591, ng = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      switch (i.type = n.type.toLowerCase(), i.checked = n.checked, i.value = VR(n), (i.type === Qc || i.type === Fc) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = GR(i.bounds)), i.type) {
        case Qc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = kR;
          break;
        case Fc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = $R;
          break;
      }
      return i;
    }
    return e;
  }(mr)
), ky = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, o = n.options[n.selectedIndex || 0];
      return i.value = o && o.text || "", i;
    }
    return e;
  }(mr)
), $y = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(mr)
), Gy = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      i.src = n.src, i.width = parseInt(n.width, 10) || 0, i.height = parseInt(n.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (n.contentWindow && n.contentWindow.document && n.contentWindow.document.documentElement) {
          i.tree = Wy(t, n.contentWindow.document.documentElement);
          var o = n.contentWindow.document.documentElement ? Es(t, getComputedStyle(n.contentWindow.document.documentElement).backgroundColor) : Gr.TRANSPARENT, l = n.contentWindow.document.body ? Es(t, getComputedStyle(n.contentWindow.document.body).backgroundColor) : Gr.TRANSPARENT;
          i.backgroundColor = Ei(o) ? Ei(l) ? i.styles.backgroundColor : l : o;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(mr)
), XR = ["OL", "UL", "MENU"], Ac = function(A, e, t, n) {
  for (var i = e.firstChild, o = void 0; i; i = o)
    if (o = i.nextSibling, Xy(i) && i.data.trim().length > 0)
      t.textNodes.push(new MR(A, i, t.styles));
    else if (Ya(i))
      if (jy(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(f) {
          return Ac(A, f, t, n);
        });
      else {
        var l = Vy(A, i);
        l.styles.isVisible() && (qR(i, l, n) ? l.flags |= 4 : zR(l.styles) && (l.flags |= 2), XR.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Ac(A, i.shadowRoot, l, n) : !Uc(i) && !qy(i) && !Ec(i) && Ac(A, i, l, n));
      }
}, Vy = function(A, e) {
  return Md(e) ? new My(A, e) : zy(e) ? new Py(A, e) : qy(e) ? new Ky(A, e) : JR(e) ? new Ry(A, e) : jR(e) ? new Od(A, e) : YR(e) ? new ng(A, e) : Ec(e) ? new ky(A, e) : Uc(e) ? new $y(A, e) : Jy(e) ? new Gy(A, e) : new mr(A, e);
}, Wy = function(A, e) {
  var t = Vy(A, e);
  return t.flags |= 4, Ac(A, e, t, t), t;
}, qR = function(A, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || rg(A) && t.styles.isTransparent();
}, zR = function(A) {
  return A.isPositioned() || A.isFloating();
}, Xy = function(A) {
  return A.nodeType === Node.TEXT_NODE;
}, Ya = function(A) {
  return A.nodeType === Node.ELEMENT_NODE;
}, Nd = function(A) {
  return Ya(A) && typeof A.style < "u" && !ec(A);
}, ec = function(A) {
  return typeof A.className == "object";
}, JR = function(A) {
  return A.tagName === "LI";
}, jR = function(A) {
  return A.tagName === "OL";
}, YR = function(A) {
  return A.tagName === "INPUT";
}, ZR = function(A) {
  return A.tagName === "HTML";
}, qy = function(A) {
  return A.tagName === "svg";
}, rg = function(A) {
  return A.tagName === "BODY";
}, zy = function(A) {
  return A.tagName === "CANVAS";
}, Wm = function(A) {
  return A.tagName === "VIDEO";
}, Md = function(A) {
  return A.tagName === "IMG";
}, Jy = function(A) {
  return A.tagName === "IFRAME";
}, Xm = function(A) {
  return A.tagName === "STYLE";
}, Ak = function(A) {
  return A.tagName === "SCRIPT";
}, Uc = function(A) {
  return A.tagName === "TEXTAREA";
}, Ec = function(A) {
  return A.tagName === "SELECT";
}, jy = function(A) {
  return A.tagName === "SLOT";
}, qm = function(A) {
  return A.tagName.indexOf("-") > 0;
}, ek = (
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
      var t = this, n = e.counterIncrement, i = e.counterReset, o = !0;
      n !== null && n.forEach(function(f) {
        var c = t.counters[f.counter];
        c && f.increment !== 0 && (o = !1, c.length || c.push(1), c[Math.max(0, c.length - 1)] += f.increment);
      });
      var l = [];
      return o && i.forEach(function(f) {
        var c = t.counters[f.counter];
        l.push(f.counter), c || (c = t.counters[f.counter] = []), c.push(f.reset);
      }), l;
    }, A;
  }()
), zm = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, Jm = {
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
}, tk = {
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
}, nk = {
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
}, $a = function(A, e, t, n, i, o) {
  return A < e || A > t ? Rs(A, i, o.length > 0) : n.integers.reduce(function(l, f, c) {
    for (; A >= f; )
      A -= f, l += n.values[c];
    return l;
  }, "") + o;
}, Yy = function(A, e, t, n) {
  var i = "";
  do
    t || A--, i = n(A) + i, A /= e;
  while (A * e >= e);
  return i;
}, at = function(A, e, t, n, i) {
  var o = t - e + 1;
  return (A < 0 ? "-" : "") + (Yy(Math.abs(A), o, n, function(l) {
    return st(Math.floor(l % o) + e);
  }) + i);
}, qi = function(A, e, t) {
  t === void 0 && (t = ". ");
  var n = e.length;
  return Yy(Math.abs(A), n, !1, function(i) {
    return e[Math.floor(i % n)];
  }) + t;
}, za = 1, gi = 2, Bi = 4, gs = 8, Pr = function(A, e, t, n, i, o) {
  if (A < -9999 || A > 9999)
    return Rs(A, 4, i.length > 0);
  var l = Math.abs(A), f = i;
  if (l === 0)
    return e[0] + f;
  for (var c = 0; l > 0 && c <= 4; c++) {
    var h = l % 10;
    h === 0 && dt(o, za) && f !== "" ? f = e[h] + f : h > 1 || h === 1 && c === 0 || h === 1 && c === 1 && dt(o, gi) || h === 1 && c === 1 && dt(o, Bi) && A > 100 || h === 1 && c > 1 && dt(o, gs) ? f = e[h] + (c > 0 ? t[c - 1] : "") + f : h === 1 && c > 0 && (f = t[c - 1] + f), l = Math.floor(l / 10);
  }
  return (A < 0 ? n : "") + f;
}, jm = "十百千萬", Ym = "拾佰仟萬", Zm = "マイナス", Rh = "마이너스", Rs = function(A, e, t) {
  var n = t ? ". " : "", i = t ? "、" : "", o = t ? ", " : "", l = t ? " " : "";
  switch (e) {
    case 0:
      return "•" + l;
    case 1:
      return "◦" + l;
    case 2:
      return "◾" + l;
    case 5:
      var f = at(A, 48, 57, !0, n);
      return f.length < 4 ? "0" + f : f;
    case 4:
      return qi(A, "〇一二三四五六七八九", i);
    case 6:
      return $a(A, 1, 3999, zm, 3, n).toLowerCase();
    case 7:
      return $a(A, 1, 3999, zm, 3, n);
    case 8:
      return at(A, 945, 969, !1, n);
    case 9:
      return at(A, 97, 122, !1, n);
    case 10:
      return at(A, 65, 90, !1, n);
    case 11:
      return at(A, 1632, 1641, !0, n);
    case 12:
    case 49:
      return $a(A, 1, 9999, Jm, 3, n);
    case 35:
      return $a(A, 1, 9999, Jm, 3, n).toLowerCase();
    case 13:
      return at(A, 2534, 2543, !0, n);
    case 14:
    case 30:
      return at(A, 6112, 6121, !0, n);
    case 15:
      return qi(A, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return qi(A, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return Pr(A, "零一二三四五六七八九", jm, "負", i, gi | Bi | gs);
    case 47:
      return Pr(A, "零壹貳參肆伍陸柒捌玖", Ym, "負", i, za | gi | Bi | gs);
    case 42:
      return Pr(A, "零一二三四五六七八九", jm, "负", i, gi | Bi | gs);
    case 41:
      return Pr(A, "零壹贰叁肆伍陆柒捌玖", Ym, "负", i, za | gi | Bi | gs);
    case 26:
      return Pr(A, "〇一二三四五六七八九", "十百千万", Zm, i, 0);
    case 25:
      return Pr(A, "零壱弐参四伍六七八九", "拾百千万", Zm, i, za | gi | Bi);
    case 31:
      return Pr(A, "영일이삼사오육칠팔구", "십백천만", Rh, o, za | gi | Bi);
    case 33:
      return Pr(A, "零一二三四五六七八九", "十百千萬", Rh, o, 0);
    case 32:
      return Pr(A, "零壹貳參四五六七八九", "拾百千", Rh, o, za | gi | Bi);
    case 18:
      return at(A, 2406, 2415, !0, n);
    case 20:
      return $a(A, 1, 19999, nk, 3, n);
    case 21:
      return at(A, 2790, 2799, !0, n);
    case 22:
      return at(A, 2662, 2671, !0, n);
    case 22:
      return $a(A, 1, 10999, tk, 3, n);
    case 23:
      return qi(A, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return qi(A, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return at(A, 3302, 3311, !0, n);
    case 28:
      return qi(A, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return qi(A, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
    case 34:
      return at(A, 3792, 3801, !0, n);
    case 37:
      return at(A, 6160, 6169, !0, n);
    case 38:
      return at(A, 4160, 4169, !0, n);
    case 39:
      return at(A, 2918, 2927, !0, n);
    case 40:
      return at(A, 1776, 1785, !0, n);
    case 43:
      return at(A, 3046, 3055, !0, n);
    case 44:
      return at(A, 3174, 3183, !0, n);
    case 45:
      return at(A, 3664, 3673, !0, n);
    case 46:
      return at(A, 3872, 3881, !0, n);
    case 3:
    default:
      return at(A, 48, 57, !0, n);
  }
}, Zy = "data-html2canvas-ignore", Av = (
  /** @class */
  function() {
    function A(e, t, n) {
      if (this.context = e, this.options = n, this.scrolledElements = [], this.referenceElement = t, this.counters = new ek(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return A.prototype.toIFrame = function(e, t) {
      var n = this, i = rk(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var o = e.defaultView.pageXOffset, l = e.defaultView.pageYOffset, f = i.contentWindow, c = f.document, h = ok(i).then(function() {
        return Vt(n, void 0, void 0, function() {
          var m, B;
          return Ot(this, function(g) {
            switch (g.label) {
              case 0:
                return this.scrolledElements.forEach(ck), f && (f.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (f.scrollY !== t.top || f.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(f.scrollX - t.left, f.scrollY - t.top, 0, 0))), m = this.options.onclone, B = this.clonedReferenceElement, typeof B > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : c.fonts && c.fonts.ready ? [4, c.fonts.ready] : [3, 2];
              case 1:
                g.sent(), g.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, ak(c)] : [3, 4];
              case 3:
                g.sent(), g.label = 4;
              case 4:
                return typeof m == "function" ? [2, Promise.resolve().then(function() {
                  return m(c, B);
                }).then(function() {
                  return i;
                })] : [2, i];
            }
          });
        });
      });
      return c.open(), c.write(uk(document.doctype) + "<html></html>"), lk(this.referenceElement.ownerDocument, o, l), c.replaceChild(c.adoptNode(this.documentElement), c.documentElement), c.close(), h;
    }, A.prototype.createElementClone = function(e) {
      if (Td(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (zy(e))
        return this.createCanvasClone(e);
      if (Wm(e))
        return this.createVideoClone(e);
      if (Xm(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return Md(t) && (Md(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), qm(t) ? this.createCustomElementClone(t) : t;
    }, A.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return kh(e.style, t), t;
    }, A.prototype.createStyleClone = function(e) {
      try {
        var t = e.sheet;
        if (t && t.cssRules) {
          var n = [].slice.call(t.cssRules, 0).reduce(function(o, l) {
            return l && typeof l.cssText == "string" ? o + l.cssText : o;
          }, ""), i = e.cloneNode(!1);
          return i.textContent = n, i;
        }
      } catch (o) {
        if (this.context.logger.error("Unable to access cssRules property", o), o.name !== "SecurityError")
          throw o;
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
        var o = e.getContext("2d"), l = i.getContext("2d");
        if (l)
          if (!this.options.allowTaint && o)
            l.putImageData(o.getImageData(0, 0, e.width, e.height), 0, 0);
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
      (!Ya(t) || !Ak(t) && !t.hasAttribute(Zy) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !Ya(t) || !Xm(t)) && e.appendChild(this.cloneNode(t, n));
    }, A.prototype.cloneChildNodes = function(e, t, n) {
      for (var i = this, o = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; o; o = o.nextSibling)
        if (Ya(o) && jy(o) && typeof o.assignedNodes == "function") {
          var l = o.assignedNodes();
          l.length && l.forEach(function(f) {
            return i.appendChildNode(t, f, n);
          });
        } else
          this.appendChildNode(t, o, n);
    }, A.prototype.cloneNode = function(e, t) {
      if (Xy(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var n = e.ownerDocument.defaultView;
      if (n && Ya(e) && (Nd(e) || ec(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var o = n.getComputedStyle(e), l = n.getComputedStyle(e, ":before"), f = n.getComputedStyle(e, ":after");
        this.referenceElement === e && Nd(i) && (this.clonedReferenceElement = i), rg(i) && dk(i);
        var c = this.counters.parse(new Hm(this.context, o)), h = this.resolvePseudoContent(e, i, l, xs.BEFORE);
        qm(e) && (t = !0), Wm(e) || this.cloneChildNodes(e, i, t), h && i.insertBefore(h, i.firstChild);
        var m = this.resolvePseudoContent(e, i, f, xs.AFTER);
        return m && i.appendChild(m), this.counters.pop(c), (o && (this.options.copyStyles || ec(e)) && !Jy(e) || t) && kh(o, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (Uc(e) || Ec(e)) && (Uc(i) || Ec(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, A.prototype.resolvePseudoContent = function(e, t, n, i) {
      var o = this;
      if (n) {
        var l = n.content, f = t.ownerDocument;
        if (!(!f || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new Hm(this.context, n));
          var c = new JK(this.context, n), h = f.createElement("html2canvaspseudoelement");
          kh(n, h), c.content.forEach(function(B) {
            if (B.type === 0)
              h.appendChild(f.createTextNode(B.value));
            else if (B.type === 22) {
              var g = f.createElement("img");
              g.src = B.value, g.style.opacity = "1", h.appendChild(g);
            } else if (B.type === 18) {
              if (B.name === "attr") {
                var v = B.values.filter(ke);
                v.length && h.appendChild(f.createTextNode(e.getAttribute(v[0].value) || ""));
              } else if (B.name === "counter") {
                var u = B.values.filter(po), C = u[0], F = u[1];
                if (C && ke(C)) {
                  var U = o.counters.getCounterValue(C.value), S = F && ke(F) ? Ld.parse(o.context, F.value) : 3;
                  h.appendChild(f.createTextNode(Rs(U, S, !1)));
                }
              } else if (B.name === "counters") {
                var N = B.values.filter(po), C = N[0], x = N[1], F = N[2];
                if (C && ke(C)) {
                  var P = o.counters.getCounterValues(C.value), R = F && ke(F) ? Ld.parse(o.context, F.value) : 3, J = x && x.type === 0 ? x.value : "", fA = P.map(function(FA) {
                    return Rs(FA, R, !1);
                  }).join(J);
                  h.appendChild(f.createTextNode(fA));
                }
              }
            } else if (B.type === 20)
              switch (B.value) {
                case "open-quote":
                  h.appendChild(f.createTextNode(Im(c.quotes, o.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  h.appendChild(f.createTextNode(Im(c.quotes, --o.quoteDepth, !1)));
                  break;
                default:
                  h.appendChild(f.createTextNode(B.value));
              }
          }), h.className = Pd + " " + Kd;
          var m = i === xs.BEFORE ? " " + Pd : " " + Kd;
          return ec(t) ? t.className.baseValue += m : t.className += m, h;
        }
      }
    }, A.destroy = function(e) {
      return e.parentNode ? (e.parentNode.removeChild(e), !0) : !1;
    }, A;
  }()
), xs;
(function(A) {
  A[A.BEFORE = 0] = "BEFORE", A[A.AFTER = 1] = "AFTER";
})(xs || (xs = {}));
var rk = function(A, e) {
  var t = A.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(Zy, "true"), A.body.appendChild(t), t;
}, ik = function(A) {
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
}, ak = function(A) {
  return Promise.all([].slice.call(A.images, 0).map(ik));
}, ok = function(A) {
  return new Promise(function(e, t) {
    var n = A.contentWindow;
    if (!n)
      return t("No window assigned for iframe");
    var i = n.document;
    n.onload = A.onload = function() {
      n.onload = A.onload = null;
      var o = setInterval(function() {
        i.body.childNodes.length > 0 && i.readyState === "complete" && (clearInterval(o), e(A));
      }, 50);
    };
  });
}, sk = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], kh = function(A, e) {
  for (var t = A.length - 1; t >= 0; t--) {
    var n = A.item(t);
    sk.indexOf(n) === -1 && e.style.setProperty(n, A.getPropertyValue(n));
  }
  return e;
}, uk = function(A) {
  var e = "";
  return A && (e += "<!DOCTYPE ", A.name && (e += A.name), A.internalSubset && (e += A.internalSubset), A.publicId && (e += '"' + A.publicId + '"'), A.systemId && (e += '"' + A.systemId + '"'), e += ">"), e;
}, lk = function(A, e, t) {
  A && A.defaultView && (e !== A.defaultView.pageXOffset || t !== A.defaultView.pageYOffset) && A.defaultView.scrollTo(e, t);
}, ck = function(A) {
  var e = A[0], t = A[1], n = A[2];
  e.scrollLeft = t, e.scrollTop = n;
}, fk = ":before", hk = ":after", Pd = "___html2canvas___pseudoelement_before", Kd = "___html2canvas___pseudoelement_after", ev = `{
    content: "" !important;
    display: none !important;
}`, dk = function(A) {
  pk(A, "." + Pd + fk + ev + `
         .` + Kd + hk + ev);
}, pk = function(A, e) {
  var t = A.ownerDocument;
  if (t) {
    var n = t.createElement("style");
    n.textContent = e, A.appendChild(n);
  }
}, AC = (
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
), gk = (
  /** @class */
  function() {
    function A(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return A.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || (Gh(e) || vk(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, A.prototype.match = function(e) {
      return this._cache[e];
    }, A.prototype.loadImage = function(e) {
      return Vt(this, void 0, void 0, function() {
        var t, n, i, o, l = this;
        return Ot(this, function(f) {
          switch (f.label) {
            case 0:
              return t = AC.isSameOrigin(e), n = !$h(e) && this._options.useCORS === !0 && Ft.SUPPORT_CORS_IMAGES && !t, i = !$h(e) && !t && !Gh(e) && typeof this._options.proxy == "string" && Ft.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !$h(e) && !Gh(e) && !i && !n ? [
                2
                /*return*/
              ] : (o = e, i ? [4, this.proxy(o)] : [3, 2]);
            case 1:
              o = f.sent(), f.label = 2;
            case 2:
              return this.context.logger.debug("Added image " + e.substring(0, 256)), [4, new Promise(function(c, h) {
                var m = new Image();
                m.onload = function() {
                  return c(m);
                }, m.onerror = h, (yk(o) || n) && (m.crossOrigin = "anonymous"), m.src = o, m.complete === !0 && setTimeout(function() {
                  return c(m);
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
      return new Promise(function(o, l) {
        var f = Ft.SUPPORT_RESPONSE_TYPE ? "blob" : "text", c = new XMLHttpRequest();
        c.onload = function() {
          if (c.status === 200)
            if (f === "text")
              o(c.response);
            else {
              var B = new FileReader();
              B.addEventListener("load", function() {
                return o(B.result);
              }, !1), B.addEventListener("error", function(g) {
                return l(g);
              }, !1), B.readAsDataURL(c.response);
            }
          else
            l("Failed to proxy resource " + i + " with status code " + c.status);
        }, c.onerror = l;
        var h = n.indexOf("?") > -1 ? "&" : "?";
        if (c.open("GET", "" + n + h + "url=" + encodeURIComponent(e) + "&responseType=" + f), f !== "text" && c instanceof XMLHttpRequest && (c.responseType = f), t._options.imageTimeout) {
          var m = t._options.imageTimeout;
          c.timeout = m, c.ontimeout = function() {
            return l("Timed out (" + m + "ms) proxying " + i);
          };
        }
        c.send();
      });
    }, A;
  }()
), Bk = /^data:image\/svg\+xml/i, wk = /^data:image\/.*;base64,/i, mk = /^data:image\/.*/i, vk = function(A) {
  return Ft.SUPPORT_SVG_DRAWING || !Ck(A);
}, $h = function(A) {
  return mk.test(A);
}, yk = function(A) {
  return wk.test(A);
}, Gh = function(A) {
  return A.substr(0, 4) === "blob";
}, Ck = function(A) {
  return A.substr(-3).toLowerCase() === "svg" || Bk.test(A);
}, TA = (
  /** @class */
  function() {
    function A(e, t) {
      this.type = 0, this.x = e, this.y = t;
    }
    return A.prototype.add = function(e, t) {
      return new A(this.x + e, this.y + t);
    }, A;
  }()
), Ga = function(A, e, t) {
  return new TA(A.x + (e.x - A.x) * t, A.y + (e.y - A.y) * t);
}, Nl = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = n, this.end = i;
    }
    return A.prototype.subdivide = function(e, t) {
      var n = Ga(this.start, this.startControl, e), i = Ga(this.startControl, this.endControl, e), o = Ga(this.endControl, this.end, e), l = Ga(n, i, e), f = Ga(i, o, e), c = Ga(l, f, e);
      return t ? new A(this.start, n, l, c) : new A(c, f, o, this.end);
    }, A.prototype.add = function(e, t) {
      return new A(this.start.add(e, t), this.startControl.add(e, t), this.endControl.add(e, t), this.end.add(e, t));
    }, A.prototype.reverse = function() {
      return new A(this.end, this.endControl, this.startControl, this.start);
    }, A;
  }()
), Qn = function(A) {
  return A.type === 1;
}, Qk = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      var t = e.styles, n = e.bounds, i = ds(t.borderTopLeftRadius, n.width, n.height), o = i[0], l = i[1], f = ds(t.borderTopRightRadius, n.width, n.height), c = f[0], h = f[1], m = ds(t.borderBottomRightRadius, n.width, n.height), B = m[0], g = m[1], v = ds(t.borderBottomLeftRadius, n.width, n.height), u = v[0], C = v[1], F = [];
      F.push((o + c) / n.width), F.push((u + B) / n.width), F.push((l + C) / n.height), F.push((h + g) / n.height);
      var U = Math.max.apply(Math, F);
      U > 1 && (o /= U, l /= U, c /= U, h /= U, B /= U, g /= U, u /= U, C /= U);
      var S = n.width - c, N = n.height - g, x = n.width - B, P = n.height - C, R = t.borderTopWidth, J = t.borderRightWidth, fA = t.borderBottomWidth, uA = t.borderLeftWidth, BA = Xe(t.paddingTop, e.bounds.width), FA = Xe(t.paddingRight, e.bounds.width), NA = Xe(t.paddingBottom, e.bounds.width), xA = Xe(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = o > 0 || l > 0 ? je(n.left + uA / 3, n.top + R / 3, o - uA / 3, l - R / 3, Ne.TOP_LEFT) : new TA(n.left + uA / 3, n.top + R / 3), this.topRightBorderDoubleOuterBox = o > 0 || l > 0 ? je(n.left + S, n.top + R / 3, c - J / 3, h - R / 3, Ne.TOP_RIGHT) : new TA(n.left + n.width - J / 3, n.top + R / 3), this.bottomRightBorderDoubleOuterBox = B > 0 || g > 0 ? je(n.left + x, n.top + N, B - J / 3, g - fA / 3, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - J / 3, n.top + n.height - fA / 3), this.bottomLeftBorderDoubleOuterBox = u > 0 || C > 0 ? je(n.left + uA / 3, n.top + P, u - uA / 3, C - fA / 3, Ne.BOTTOM_LEFT) : new TA(n.left + uA / 3, n.top + n.height - fA / 3), this.topLeftBorderDoubleInnerBox = o > 0 || l > 0 ? je(n.left + uA * 2 / 3, n.top + R * 2 / 3, o - uA * 2 / 3, l - R * 2 / 3, Ne.TOP_LEFT) : new TA(n.left + uA * 2 / 3, n.top + R * 2 / 3), this.topRightBorderDoubleInnerBox = o > 0 || l > 0 ? je(n.left + S, n.top + R * 2 / 3, c - J * 2 / 3, h - R * 2 / 3, Ne.TOP_RIGHT) : new TA(n.left + n.width - J * 2 / 3, n.top + R * 2 / 3), this.bottomRightBorderDoubleInnerBox = B > 0 || g > 0 ? je(n.left + x, n.top + N, B - J * 2 / 3, g - fA * 2 / 3, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - J * 2 / 3, n.top + n.height - fA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = u > 0 || C > 0 ? je(n.left + uA * 2 / 3, n.top + P, u - uA * 2 / 3, C - fA * 2 / 3, Ne.BOTTOM_LEFT) : new TA(n.left + uA * 2 / 3, n.top + n.height - fA * 2 / 3), this.topLeftBorderStroke = o > 0 || l > 0 ? je(n.left + uA / 2, n.top + R / 2, o - uA / 2, l - R / 2, Ne.TOP_LEFT) : new TA(n.left + uA / 2, n.top + R / 2), this.topRightBorderStroke = o > 0 || l > 0 ? je(n.left + S, n.top + R / 2, c - J / 2, h - R / 2, Ne.TOP_RIGHT) : new TA(n.left + n.width - J / 2, n.top + R / 2), this.bottomRightBorderStroke = B > 0 || g > 0 ? je(n.left + x, n.top + N, B - J / 2, g - fA / 2, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - J / 2, n.top + n.height - fA / 2), this.bottomLeftBorderStroke = u > 0 || C > 0 ? je(n.left + uA / 2, n.top + P, u - uA / 2, C - fA / 2, Ne.BOTTOM_LEFT) : new TA(n.left + uA / 2, n.top + n.height - fA / 2), this.topLeftBorderBox = o > 0 || l > 0 ? je(n.left, n.top, o, l, Ne.TOP_LEFT) : new TA(n.left, n.top), this.topRightBorderBox = c > 0 || h > 0 ? je(n.left + S, n.top, c, h, Ne.TOP_RIGHT) : new TA(n.left + n.width, n.top), this.bottomRightBorderBox = B > 0 || g > 0 ? je(n.left + x, n.top + N, B, g, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = u > 0 || C > 0 ? je(n.left, n.top + P, u, C, Ne.BOTTOM_LEFT) : new TA(n.left, n.top + n.height), this.topLeftPaddingBox = o > 0 || l > 0 ? je(n.left + uA, n.top + R, Math.max(0, o - uA), Math.max(0, l - R), Ne.TOP_LEFT) : new TA(n.left + uA, n.top + R), this.topRightPaddingBox = c > 0 || h > 0 ? je(n.left + Math.min(S, n.width - J), n.top + R, S > n.width + J ? 0 : Math.max(0, c - J), Math.max(0, h - R), Ne.TOP_RIGHT) : new TA(n.left + n.width - J, n.top + R), this.bottomRightPaddingBox = B > 0 || g > 0 ? je(n.left + Math.min(x, n.width - uA), n.top + Math.min(N, n.height - fA), Math.max(0, B - J), Math.max(0, g - fA), Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - J, n.top + n.height - fA), this.bottomLeftPaddingBox = u > 0 || C > 0 ? je(n.left + uA, n.top + Math.min(P, n.height - fA), Math.max(0, u - uA), Math.max(0, C - fA), Ne.BOTTOM_LEFT) : new TA(n.left + uA, n.top + n.height - fA), this.topLeftContentBox = o > 0 || l > 0 ? je(n.left + uA + xA, n.top + R + BA, Math.max(0, o - (uA + xA)), Math.max(0, l - (R + BA)), Ne.TOP_LEFT) : new TA(n.left + uA + xA, n.top + R + BA), this.topRightContentBox = c > 0 || h > 0 ? je(n.left + Math.min(S, n.width + uA + xA), n.top + R + BA, S > n.width + uA + xA ? 0 : c - uA + xA, h - (R + BA), Ne.TOP_RIGHT) : new TA(n.left + n.width - (J + FA), n.top + R + BA), this.bottomRightContentBox = B > 0 || g > 0 ? je(n.left + Math.min(x, n.width - (uA + xA)), n.top + Math.min(N, n.height + R + BA), Math.max(0, B - (J + FA)), g - (fA + NA), Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - (J + FA), n.top + n.height - (fA + NA)), this.bottomLeftContentBox = u > 0 || C > 0 ? je(n.left + uA + xA, n.top + P, Math.max(0, u - (uA + xA)), C - (fA + NA), Ne.BOTTOM_LEFT) : new TA(n.left + uA + xA, n.top + n.height - (fA + NA));
    }
    return A;
  }()
), Ne;
(function(A) {
  A[A.TOP_LEFT = 0] = "TOP_LEFT", A[A.TOP_RIGHT = 1] = "TOP_RIGHT", A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(Ne || (Ne = {}));
var je = function(A, e, t, n, i) {
  var o = 4 * ((Math.sqrt(2) - 1) / 3), l = t * o, f = n * o, c = A + t, h = e + n;
  switch (i) {
    case Ne.TOP_LEFT:
      return new Nl(new TA(A, h), new TA(A, h - f), new TA(c - l, e), new TA(c, e));
    case Ne.TOP_RIGHT:
      return new Nl(new TA(A, e), new TA(A + l, e), new TA(c, h - f), new TA(c, h));
    case Ne.BOTTOM_RIGHT:
      return new Nl(new TA(c, e), new TA(c, e + f), new TA(A + l, h), new TA(A, h));
    case Ne.BOTTOM_LEFT:
    default:
      return new Nl(new TA(c, h), new TA(c - l, h), new TA(A, e + f), new TA(A, e));
  }
}, bc = function(A) {
  return [A.topLeftBorderBox, A.topRightBorderBox, A.bottomRightBorderBox, A.bottomLeftBorderBox];
}, Fk = function(A) {
  return [
    A.topLeftContentBox,
    A.topRightContentBox,
    A.bottomRightContentBox,
    A.bottomLeftContentBox
  ];
}, _c = function(A) {
  return [
    A.topLeftPaddingBox,
    A.topRightPaddingBox,
    A.bottomRightPaddingBox,
    A.bottomLeftPaddingBox
  ];
}, Uk = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.offsetX = e, this.offsetY = t, this.matrix = n, this.type = 0, this.target = 6;
    }
    return A;
  }()
), Ml = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.path = e, this.target = t, this.type = 1;
    }
    return A;
  }()
), Ek = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return A;
  }()
), bk = function(A) {
  return A.type === 0;
}, eC = function(A) {
  return A.type === 1;
}, _k = function(A) {
  return A.type === 2;
}, tv = function(A, e) {
  return A.length === e.length ? A.some(function(t, n) {
    return t === e[n];
  }) : !1;
}, xk = function(A, e, t, n, i) {
  return A.map(function(o, l) {
    switch (l) {
      case 0:
        return o.add(e, t);
      case 1:
        return o.add(e + n, t);
      case 2:
        return o.add(e + n, t + i);
      case 3:
        return o.add(e, t + i);
    }
    return o;
  });
}, tC = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return A;
  }()
), nC = (
  /** @class */
  function() {
    function A(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new Qk(this.container), this.container.styles.opacity < 1 && this.effects.push(new Ek(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var n = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, o = this.container.styles.transform;
        this.effects.push(new Uk(n, i, o));
      }
      if (this.container.styles.overflowX !== 0) {
        var l = bc(this.curves), f = _c(this.curves);
        tv(l, f) ? this.effects.push(new Ml(
          l,
          6
          /* CONTENT */
        )) : (this.effects.push(new Ml(
          l,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new Ml(
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
        var o = n.effects.filter(function(c) {
          return !eC(c);
        });
        if (t || n.container.styles.position !== 0 || !n.parent) {
          if (i.unshift.apply(i, o), t = [
            2,
            3
            /* FIXED */
          ].indexOf(n.container.styles.position) === -1, n.container.styles.overflowX !== 0) {
            var l = bc(n.curves), f = _c(n.curves);
            tv(l, f) || i.unshift(new Ml(
              f,
              6
              /* CONTENT */
            ));
          }
        } else
          i.unshift.apply(i, o);
        n = n.parent;
      }
      return i.filter(function(c) {
        return dt(c.target, e);
      });
    }, A;
  }()
), Rd = function(A, e, t, n) {
  A.container.elements.forEach(function(i) {
    var o = dt(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), l = dt(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), f = new nC(i, A);
    dt(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && n.push(f);
    var c = dt(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : n;
    if (o || l) {
      var h = o || i.styles.isPositioned() ? t : e, m = new tC(f);
      if (i.styles.isPositioned() || i.styles.opacity < 1 || i.styles.isTransformed()) {
        var B = i.styles.zIndex.order;
        if (B < 0) {
          var g = 0;
          h.negativeZIndex.some(function(u, C) {
            return B > u.element.container.styles.zIndex.order ? (g = C, !1) : g > 0;
          }), h.negativeZIndex.splice(g, 0, m);
        } else if (B > 0) {
          var v = 0;
          h.positiveZIndex.some(function(u, C) {
            return B >= u.element.container.styles.zIndex.order ? (v = C + 1, !1) : v > 0;
          }), h.positiveZIndex.splice(v, 0, m);
        } else
          h.zeroOrAutoZIndexOrTransformedOrOpacity.push(m);
      } else
        i.styles.isFloating() ? h.nonPositionedFloats.push(m) : h.nonPositionedInlineLevel.push(m);
      Rd(f, m, o ? m : t, c);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(f) : e.nonInlineLevel.push(f), Rd(f, e, t, c);
    dt(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && rC(i, c);
  });
}, rC = function(A, e) {
  for (var t = A instanceof Od ? A.start : 1, n = A instanceof Od ? A.reversed : !1, i = 0; i < e.length; i++) {
    var o = e[i];
    o.container instanceof Ry && typeof o.container.value == "number" && o.container.value !== 0 && (t = o.container.value), o.listValue = Rs(t, o.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, Ik = function(A) {
  var e = new nC(A, null), t = new tC(e), n = [];
  return Rd(e, t, t, n), rC(e.container, n), t;
}, nv = function(A, e) {
  switch (e) {
    case 0:
      return Un(A.topLeftBorderBox, A.topLeftPaddingBox, A.topRightBorderBox, A.topRightPaddingBox);
    case 1:
      return Un(A.topRightBorderBox, A.topRightPaddingBox, A.bottomRightBorderBox, A.bottomRightPaddingBox);
    case 2:
      return Un(A.bottomRightBorderBox, A.bottomRightPaddingBox, A.bottomLeftBorderBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return Un(A.bottomLeftBorderBox, A.bottomLeftPaddingBox, A.topLeftBorderBox, A.topLeftPaddingBox);
  }
}, Hk = function(A, e) {
  switch (e) {
    case 0:
      return Un(A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox, A.topRightBorderBox, A.topRightBorderDoubleOuterBox);
    case 1:
      return Un(A.topRightBorderBox, A.topRightBorderDoubleOuterBox, A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox);
    case 2:
      return Un(A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox, A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return Un(A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox, A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox);
  }
}, Sk = function(A, e) {
  switch (e) {
    case 0:
      return Un(A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox, A.topRightBorderDoubleInnerBox, A.topRightPaddingBox);
    case 1:
      return Un(A.topRightBorderDoubleInnerBox, A.topRightPaddingBox, A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox);
    case 2:
      return Un(A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox, A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return Un(A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox, A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox);
  }
}, Lk = function(A, e) {
  switch (e) {
    case 0:
      return Pl(A.topLeftBorderStroke, A.topRightBorderStroke);
    case 1:
      return Pl(A.topRightBorderStroke, A.bottomRightBorderStroke);
    case 2:
      return Pl(A.bottomRightBorderStroke, A.bottomLeftBorderStroke);
    case 3:
    default:
      return Pl(A.bottomLeftBorderStroke, A.topLeftBorderStroke);
  }
}, Pl = function(A, e) {
  var t = [];
  return Qn(A) ? t.push(A.subdivide(0.5, !1)) : t.push(A), Qn(e) ? t.push(e.subdivide(0.5, !0)) : t.push(e), t;
}, Un = function(A, e, t, n) {
  var i = [];
  return Qn(A) ? i.push(A.subdivide(0.5, !1)) : i.push(A), Qn(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), Qn(n) ? i.push(n.subdivide(0.5, !0).reverse()) : i.push(n), Qn(e) ? i.push(e.subdivide(0.5, !1).reverse()) : i.push(e), i;
}, iC = function(A) {
  var e = A.bounds, t = A.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, xc = function(A) {
  var e = A.styles, t = A.bounds, n = Xe(e.paddingLeft, t.width), i = Xe(e.paddingRight, t.width), o = Xe(e.paddingTop, t.width), l = Xe(e.paddingBottom, t.width);
  return t.add(n + e.borderLeftWidth, o + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + n + i), -(e.borderTopWidth + e.borderBottomWidth + o + l));
}, Tk = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? xc(e) : iC(e);
}, Dk = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? xc(e) : iC(e);
}, Vh = function(A, e, t) {
  var n = Tk(Ja(A.styles.backgroundOrigin, e), A), i = Dk(Ja(A.styles.backgroundClip, e), A), o = Ok(Ja(A.styles.backgroundSize, e), t, n), l = o[0], f = o[1], c = ds(Ja(A.styles.backgroundPosition, e), n.width - l, n.height - f), h = Nk(Ja(A.styles.backgroundRepeat, e), c, o, n, i), m = Math.round(n.left + c[0]), B = Math.round(n.top + c[1]);
  return [h, m, B, l, f];
}, Va = function(A) {
  return ke(A) && A.value === no.AUTO;
}, Kl = function(A) {
  return typeof A == "number";
}, Ok = function(A, e, t) {
  var n = e[0], i = e[1], o = e[2], l = A[0], f = A[1];
  if (!l)
    return [0, 0];
  if (lt(l) && f && lt(f))
    return [Xe(l, t.width), Xe(f, t.height)];
  var c = Kl(o);
  if (ke(l) && (l.value === no.CONTAIN || l.value === no.COVER)) {
    if (Kl(o)) {
      var h = t.width / t.height;
      return h < o != (l.value === no.COVER) ? [t.width, t.width / o] : [t.height * o, t.height];
    }
    return [t.width, t.height];
  }
  var m = Kl(n), B = Kl(i), g = m || B;
  if (Va(l) && (!f || Va(f))) {
    if (m && B)
      return [n, i];
    if (!c && !g)
      return [t.width, t.height];
    if (g && c) {
      var v = m ? n : i * o, u = B ? i : n / o;
      return [v, u];
    }
    var C = m ? n : t.width, F = B ? i : t.height;
    return [C, F];
  }
  if (c) {
    var U = 0, S = 0;
    return lt(l) ? U = Xe(l, t.width) : lt(f) && (S = Xe(f, t.height)), Va(l) ? U = S * o : (!f || Va(f)) && (S = U / o), [U, S];
  }
  var N = null, x = null;
  if (lt(l) ? N = Xe(l, t.width) : f && lt(f) && (x = Xe(f, t.height)), N !== null && (!f || Va(f)) && (x = m && B ? N / n * i : t.height), x !== null && Va(l) && (N = m && B ? x / i * n : t.width), N !== null && x !== null)
    return [N, x];
  throw new Error("Unable to calculate background-size for element");
}, Ja = function(A, e) {
  var t = A[e];
  return typeof t > "u" ? A[0] : t;
}, Nk = function(A, e, t, n, i) {
  var o = e[0], l = e[1], f = t[0], c = t[1];
  switch (A) {
    case 2:
      return [
        new TA(Math.round(n.left), Math.round(n.top + l)),
        new TA(Math.round(n.left + n.width), Math.round(n.top + l)),
        new TA(Math.round(n.left + n.width), Math.round(c + n.top + l)),
        new TA(Math.round(n.left), Math.round(c + n.top + l))
      ];
    case 3:
      return [
        new TA(Math.round(n.left + o), Math.round(n.top)),
        new TA(Math.round(n.left + o + f), Math.round(n.top)),
        new TA(Math.round(n.left + o + f), Math.round(n.height + n.top)),
        new TA(Math.round(n.left + o), Math.round(n.height + n.top))
      ];
    case 1:
      return [
        new TA(Math.round(n.left + o), Math.round(n.top + l)),
        new TA(Math.round(n.left + o + f), Math.round(n.top + l)),
        new TA(Math.round(n.left + o + f), Math.round(n.top + l + c)),
        new TA(Math.round(n.left + o), Math.round(n.top + l + c))
      ];
    default:
      return [
        new TA(Math.round(i.left), Math.round(i.top)),
        new TA(Math.round(i.left + i.width), Math.round(i.top)),
        new TA(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new TA(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, Mk = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", rv = "Hidden Text", Pk = (
  /** @class */
  function() {
    function A(e) {
      this._data = {}, this._document = e;
    }
    return A.prototype.parseMetrics = function(e, t) {
      var n = this._document.createElement("div"), i = this._document.createElement("img"), o = this._document.createElement("span"), l = this._document.body;
      n.style.visibility = "hidden", n.style.fontFamily = e, n.style.fontSize = t, n.style.margin = "0", n.style.padding = "0", n.style.whiteSpace = "nowrap", l.appendChild(n), i.src = Mk, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", o.style.fontFamily = e, o.style.fontSize = t, o.style.margin = "0", o.style.padding = "0", o.appendChild(this._document.createTextNode(rv)), n.appendChild(o), n.appendChild(i);
      var f = i.offsetTop - o.offsetTop + 2;
      n.removeChild(o), n.appendChild(this._document.createTextNode(rv)), n.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var c = i.offsetTop - n.offsetTop + 2;
      return l.removeChild(n), { baseline: f, middle: c };
    }, A.prototype.getMetrics = function(e, t) {
      var n = e + " " + t;
      return typeof this._data[n] > "u" && (this._data[n] = this.parseMetrics(e, t)), this._data[n];
    }, A;
  }()
), aC = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.context = e, this.options = t;
    }
    return A;
  }()
), Kk = 1e4, Rk = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i._activeEffects = [], i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), n.canvas || (i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px"), i.fontMetrics = new Pk(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + n.width + "x" + n.height + ") with scale " + n.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var n = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return n.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), _k(t) && (this.ctx.globalAlpha = t.opacity), bk(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), eC(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n;
        return Ot(this, function(i) {
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
      return Vt(this, void 0, void 0, function() {
        return Ot(this, function(n) {
          switch (n.label) {
            case 0:
              if (dt(
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
      var o = this;
      if (n === 0)
        this.ctx.fillText(t.text, t.bounds.left, t.bounds.top + i);
      else {
        var l = tg(t.text);
        l.reduce(function(f, c) {
          return o.ctx.fillText(c, f, t.bounds.top + i), f + o.ctx.measureText(c).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var n = t.fontVariant.filter(function(l) {
        return l === "normal" || l === "small-caps";
      }).join(""), i = Wk(t.fontFamily).join(", "), o = js(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, n, t.fontWeight, o, i].join(" "),
        i,
        o
      ];
    }, e.prototype.renderTextNode = function(t, n) {
      return Vt(this, void 0, void 0, function() {
        var i, o, l, f, c, h, m, B, g = this;
        return Ot(this, function(v) {
          return i = this.createFontStyle(n), o = i[0], l = i[1], f = i[2], this.ctx.font = o, this.ctx.direction = n.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", c = this.fontMetrics.getMetrics(l, f), h = c.baseline, m = c.middle, B = n.paintOrder, t.textBounds.forEach(function(u) {
            B.forEach(function(C) {
              switch (C) {
                case 0:
                  g.ctx.fillStyle = wt(n.color), g.renderTextWithLetterSpacing(u, n.letterSpacing, h);
                  var F = n.textShadow;
                  F.length && u.text.trim().length && (F.slice(0).reverse().forEach(function(U) {
                    g.ctx.shadowColor = wt(U.color), g.ctx.shadowOffsetX = U.offsetX.number * g.options.scale, g.ctx.shadowOffsetY = U.offsetY.number * g.options.scale, g.ctx.shadowBlur = U.blur.number, g.renderTextWithLetterSpacing(u, n.letterSpacing, h);
                  }), g.ctx.shadowColor = "", g.ctx.shadowOffsetX = 0, g.ctx.shadowOffsetY = 0, g.ctx.shadowBlur = 0), n.textDecorationLine.length && (g.ctx.fillStyle = wt(n.textDecorationColor || n.color), n.textDecorationLine.forEach(function(U) {
                    switch (U) {
                      case 1:
                        g.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top + h), u.bounds.width, 1);
                        break;
                      case 2:
                        g.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top), u.bounds.width, 1);
                        break;
                      case 3:
                        g.ctx.fillRect(u.bounds.left, Math.ceil(u.bounds.top + m), u.bounds.width, 1);
                        break;
                    }
                  }));
                  break;
                case 1:
                  n.webkitTextStrokeWidth && u.text.trim().length && (g.ctx.strokeStyle = wt(n.webkitTextStrokeColor), g.ctx.lineWidth = n.webkitTextStrokeWidth, g.ctx.lineJoin = window.chrome ? "miter" : "round", g.ctx.strokeText(u.text, u.bounds.left, u.bounds.top + h)), g.ctx.strokeStyle = "", g.ctx.lineWidth = 0, g.ctx.lineJoin = "miter";
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
        var o = xc(t), l = _c(n);
        this.path(l), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, o.left, o.top, o.width, o.height), this.ctx.restore();
      }
    }, e.prototype.renderNodeContent = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i, o, l, f, c, S, S, h, m, B, g, x, v, u, P, C, F, U, S, N, x, P;
        return Ot(this, function(R) {
          switch (R.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), n = t.container, i = t.curves, o = n.styles, l = 0, f = n.textNodes, R.label = 1;
            case 1:
              return l < f.length ? (c = f[l], [4, this.renderTextNode(c, o)]) : [3, 4];
            case 2:
              R.sent(), R.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              if (!(n instanceof My)) return [3, 8];
              R.label = 5;
            case 5:
              return R.trys.push([5, 7, , 8]), [4, this.context.cache.match(n.src)];
            case 6:
              return S = R.sent(), this.renderReplacedElement(n, i, S), [3, 8];
            case 7:
              return R.sent(), this.context.logger.error("Error loading image " + n.src), [3, 8];
            case 8:
              if (n instanceof Py && this.renderReplacedElement(n, i, n.canvas), !(n instanceof Ky)) return [3, 12];
              R.label = 9;
            case 9:
              return R.trys.push([9, 11, , 12]), [4, this.context.cache.match(n.svg)];
            case 10:
              return S = R.sent(), this.renderReplacedElement(n, i, S), [3, 12];
            case 11:
              return R.sent(), this.context.logger.error("Error loading svg " + n.svg.substring(0, 255)), [3, 12];
            case 12:
              return n instanceof Gy && n.tree ? (h = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: n.backgroundColor,
                x: 0,
                y: 0,
                width: n.width,
                height: n.height
              }), [4, h.render(n.tree)]) : [3, 14];
            case 13:
              m = R.sent(), n.width && n.height && this.ctx.drawImage(m, 0, 0, n.width, n.height, n.bounds.left, n.bounds.top, n.bounds.width, n.bounds.height), R.label = 14;
            case 14:
              if (n instanceof ng && (B = Math.min(n.bounds.width, n.bounds.height), n.type === Qc ? n.checked && (this.ctx.save(), this.path([
                new TA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79),
                new TA(n.bounds.left + B * 0.16, n.bounds.top + B * 0.5549),
                new TA(n.bounds.left + B * 0.27347, n.bounds.top + B * 0.44071),
                new TA(n.bounds.left + B * 0.39694, n.bounds.top + B * 0.5649),
                new TA(n.bounds.left + B * 0.72983, n.bounds.top + B * 0.23),
                new TA(n.bounds.left + B * 0.84, n.bounds.top + B * 0.34085),
                new TA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79)
              ]), this.ctx.fillStyle = wt(Vm), this.ctx.fill(), this.ctx.restore()) : n.type === Fc && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + B / 2, n.bounds.top + B / 2, B / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = wt(Vm), this.ctx.fill(), this.ctx.restore())), kk(n) && n.value.length) {
                switch (g = this.createFontStyle(o), x = g[0], v = g[1], u = this.fontMetrics.getMetrics(x, v).baseline, this.ctx.font = x, this.ctx.fillStyle = wt(o.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = Gk(n.styles.textAlign), P = xc(n), C = 0, n.styles.textAlign) {
                  case 1:
                    C += P.width / 2;
                    break;
                  case 2:
                    C += P.width;
                    break;
                }
                F = P.add(C, 0, 0, -P.height / 2 + 1), this.ctx.save(), this.path([
                  new TA(P.left, P.top),
                  new TA(P.left + P.width, P.top),
                  new TA(P.left + P.width, P.top + P.height),
                  new TA(P.left, P.top + P.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new _s(n.value, F), o.letterSpacing, u), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!dt(
                n.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (n.styles.listStyleImage === null) return [3, 19];
              if (U = n.styles.listStyleImage, U.type !== 0) return [3, 18];
              S = void 0, N = U.url, R.label = 15;
            case 15:
              return R.trys.push([15, 17, , 18]), [4, this.context.cache.match(N)];
            case 16:
              return S = R.sent(), this.ctx.drawImage(S, n.bounds.left - (S.width + 10), n.bounds.top), [3, 18];
            case 17:
              return R.sent(), this.context.logger.error("Error loading list-style-image " + N), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && n.styles.listStyleType !== -1 && (x = this.createFontStyle(o)[0], this.ctx.font = x, this.ctx.fillStyle = wt(o.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", P = new qr(n.bounds.left, n.bounds.top + Xe(n.styles.paddingTop, n.bounds.width), n.bounds.width, _m(o.lineHeight, o.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new _s(t.listValue, P), o.letterSpacing, _m(o.lineHeight, o.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), R.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderStackContent = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i, U, o, l, U, f, c, U, h, m, U, B, g, U, v, u, U, C, F, U;
        return Ot(this, function(S) {
          switch (S.label) {
            case 0:
              if (dt(
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
              S.sent(), o = 0, l = t.nonInlineLevel, S.label = 7;
            case 7:
              return o < l.length ? (U = l[o], [4, this.renderNode(U)]) : [3, 10];
            case 8:
              S.sent(), S.label = 9;
            case 9:
              return o++, [3, 7];
            case 10:
              f = 0, c = t.nonPositionedFloats, S.label = 11;
            case 11:
              return f < c.length ? (U = c[f], [4, this.renderStack(U)]) : [3, 14];
            case 12:
              S.sent(), S.label = 13;
            case 13:
              return f++, [3, 11];
            case 14:
              h = 0, m = t.nonPositionedInlineLevel, S.label = 15;
            case 15:
              return h < m.length ? (U = m[h], [4, this.renderStack(U)]) : [3, 18];
            case 16:
              S.sent(), S.label = 17;
            case 17:
              return h++, [3, 15];
            case 18:
              B = 0, g = t.inlineLevel, S.label = 19;
            case 19:
              return B < g.length ? (U = g[B], [4, this.renderNode(U)]) : [3, 22];
            case 20:
              S.sent(), S.label = 21;
            case 21:
              return B++, [3, 19];
            case 22:
              v = 0, u = t.zeroOrAutoZIndexOrTransformedOrOpacity, S.label = 23;
            case 23:
              return v < u.length ? (U = u[v], [4, this.renderStack(U)]) : [3, 26];
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
      t.forEach(function(i, o) {
        var l = Qn(i) ? i.start : i;
        o === 0 ? n.ctx.moveTo(l.x, l.y) : n.ctx.lineTo(l.x, l.y), Qn(i) && n.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
      });
    }, e.prototype.renderRepeat = function(t, n, i, o) {
      this.path(t), this.ctx.fillStyle = n, this.ctx.translate(i, o), this.ctx.fill(), this.ctx.translate(-i, -o);
    }, e.prototype.resizeImage = function(t, n, i) {
      var o;
      if (t.width === n && t.height === i)
        return t;
      var l = (o = this.canvas.ownerDocument) !== null && o !== void 0 ? o : document, f = l.createElement("canvas");
      f.width = Math.max(1, n), f.height = Math.max(1, i);
      var c = f.getContext("2d");
      return c.drawImage(t, 0, 0, t.width, t.height, 0, 0, n, i), f;
    }, e.prototype.renderBackgroundImage = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i, o, l, f, c;
        return Ot(this, function(h) {
          switch (h.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(m) {
                var B, g, v, BA, tA, hA, xA, X, fA, u, BA, tA, hA, xA, X, C, F, U, S, N, x, P, R, J, fA, uA, BA, FA, NA, xA, X, CA, tA, hA, _A, IA, aA, D, eA, j, T, k;
                return Ot(this, function(rA) {
                  switch (rA.label) {
                    case 0:
                      if (m.type !== 0) return [3, 5];
                      B = void 0, g = m.url, rA.label = 1;
                    case 1:
                      return rA.trys.push([1, 3, , 4]), [4, o.context.cache.match(g)];
                    case 2:
                      return B = rA.sent(), [3, 4];
                    case 3:
                      return rA.sent(), o.context.logger.error("Error loading background-image " + g), [3, 4];
                    case 4:
                      return B && (v = Vh(t, n, [
                        B.width,
                        B.height,
                        B.width / B.height
                      ]), BA = v[0], tA = v[1], hA = v[2], xA = v[3], X = v[4], fA = o.ctx.createPattern(o.resizeImage(B, xA, X), "repeat"), o.renderRepeat(BA, fA, tA, hA)), [3, 6];
                    case 5:
                      bP(m) ? (u = Vh(t, n, [null, null, null]), BA = u[0], tA = u[1], hA = u[2], xA = u[3], X = u[4], C = CP(m.angle, xA, X), F = C[0], U = C[1], S = C[2], N = C[3], x = C[4], P = document.createElement("canvas"), P.width = xA, P.height = X, R = P.getContext("2d"), J = R.createLinearGradient(U, N, S, x), Em(m.stops, F).forEach(function(UA) {
                        return J.addColorStop(UA.stop, wt(UA.color));
                      }), R.fillStyle = J, R.fillRect(0, 0, xA, X), xA > 0 && X > 0 && (fA = o.ctx.createPattern(P, "repeat"), o.renderRepeat(BA, fA, tA, hA))) : _P(m) && (uA = Vh(t, n, [
                        null,
                        null,
                        null
                      ]), BA = uA[0], FA = uA[1], NA = uA[2], xA = uA[3], X = uA[4], CA = m.position.length === 0 ? [Zp] : m.position, tA = Xe(CA[0], xA), hA = Xe(CA[CA.length - 1], X), _A = QP(m, tA, hA, xA, X), IA = _A[0], aA = _A[1], IA > 0 && aA > 0 && (D = o.ctx.createRadialGradient(FA + tA, NA + hA, 0, FA + tA, NA + hA, IA), Em(m.stops, IA * 2).forEach(function(UA) {
                        return D.addColorStop(UA.stop, wt(UA.color));
                      }), o.path(BA), o.ctx.fillStyle = D, IA !== aA ? (eA = t.bounds.left + 0.5 * t.bounds.width, j = t.bounds.top + 0.5 * t.bounds.height, T = aA / IA, k = 1 / T, o.ctx.save(), o.ctx.translate(eA, j), o.ctx.transform(1, 0, 0, T, 0, 0), o.ctx.translate(-eA, -j), o.ctx.fillRect(FA, k * (NA - j) + j, xA, X * k), o.ctx.restore()) : o.ctx.fill())), rA.label = 6;
                    case 6:
                      return n--, [
                        2
                        /*return*/
                      ];
                  }
                });
              }, o = this, l = 0, f = t.styles.backgroundImage.slice(0).reverse(), h.label = 1;
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
      return Vt(this, void 0, void 0, function() {
        return Ot(this, function(o) {
          return this.path(nv(i, n)), this.ctx.fillStyle = wt(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, n, i, o) {
      return Vt(this, void 0, void 0, function() {
        var l, f;
        return Ot(this, function(c) {
          switch (c.label) {
            case 0:
              return n < 3 ? [4, this.renderSolidBorder(t, i, o)] : [3, 2];
            case 1:
              return c.sent(), [
                2
                /*return*/
              ];
            case 2:
              return l = Hk(o, i), this.path(l), this.ctx.fillStyle = wt(t), this.ctx.fill(), f = Sk(o, i), this.path(f), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i, o, l, f, c, h, m, B = this;
        return Ot(this, function(g) {
          switch (g.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), n = t.container.styles, i = !Ei(n.backgroundColor) || n.backgroundImage.length, o = [
                { style: n.borderTopStyle, color: n.borderTopColor, width: n.borderTopWidth },
                { style: n.borderRightStyle, color: n.borderRightColor, width: n.borderRightWidth },
                { style: n.borderBottomStyle, color: n.borderBottomColor, width: n.borderBottomWidth },
                { style: n.borderLeftStyle, color: n.borderLeftColor, width: n.borderLeftWidth }
              ], l = $k(Ja(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), Ei(n.backgroundColor) || (this.ctx.fillStyle = wt(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              g.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(v) {
                B.ctx.save();
                var u = bc(t.curves), C = v.inset ? 0 : Kk, F = xk(u, -C + (v.inset ? 1 : -1) * v.spread.number, (v.inset ? 1 : -1) * v.spread.number, v.spread.number * (v.inset ? -2 : 2), v.spread.number * (v.inset ? -2 : 2));
                v.inset ? (B.path(u), B.ctx.clip(), B.mask(F)) : (B.mask(u), B.ctx.clip(), B.path(F)), B.ctx.shadowOffsetX = v.offsetX.number + C, B.ctx.shadowOffsetY = v.offsetY.number, B.ctx.shadowColor = wt(v.color), B.ctx.shadowBlur = v.blur.number, B.ctx.fillStyle = v.inset ? wt(v.color) : "rgba(0,0,0,1)", B.ctx.fill(), B.ctx.restore();
              }), g.label = 2;
            case 2:
              f = 0, c = 0, h = o, g.label = 3;
            case 3:
              return c < h.length ? (m = h[c], m.style !== 0 && !Ei(m.color) && m.width > 0 ? m.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
                m.color,
                m.width,
                f,
                t.curves,
                2
                /* DASHED */
              )] : [3, 11]) : [3, 13];
            case 4:
              return g.sent(), [3, 11];
            case 5:
              return m.style !== 3 ? [3, 7] : [4, this.renderDashedDottedBorder(
                m.color,
                m.width,
                f,
                t.curves,
                3
                /* DOTTED */
              )];
            case 6:
              return g.sent(), [3, 11];
            case 7:
              return m.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(m.color, m.width, f, t.curves)];
            case 8:
              return g.sent(), [3, 11];
            case 9:
              return [4, this.renderSolidBorder(m.color, f, t.curves)];
            case 10:
              g.sent(), g.label = 11;
            case 11:
              f++, g.label = 12;
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
    }, e.prototype.renderDashedDottedBorder = function(t, n, i, o, l) {
      return Vt(this, void 0, void 0, function() {
        var f, c, h, m, B, g, v, u, C, F, U, S, N, x, P, R, P, R;
        return Ot(this, function(J) {
          return this.ctx.save(), f = Lk(o, i), c = nv(o, i), l === 2 && (this.path(c), this.ctx.clip()), Qn(c[0]) ? (h = c[0].start.x, m = c[0].start.y) : (h = c[0].x, m = c[0].y), Qn(c[1]) ? (B = c[1].end.x, g = c[1].end.y) : (B = c[1].x, g = c[1].y), i === 0 || i === 2 ? v = Math.abs(h - B) : v = Math.abs(m - g), this.ctx.beginPath(), l === 3 ? this.formatPath(f) : this.formatPath(c.slice(0, 2)), u = n < 3 ? n * 3 : n * 2, C = n < 3 ? n * 2 : n, l === 3 && (u = n, C = n), F = !0, v <= u * 2 ? F = !1 : v <= u * 2 + C ? (U = v / (2 * u + C), u *= U, C *= U) : (S = Math.floor((v + C) / (u + C)), N = (v - S * u) / (S - 1), x = (v - (S + 1) * u) / S, C = x <= 0 || Math.abs(C - N) < Math.abs(C - x) ? N : x), F && (l === 3 ? this.ctx.setLineDash([0, u + C]) : this.ctx.setLineDash([u, C])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = wt(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (Qn(c[0]) && (P = c[3], R = c[0], this.ctx.beginPath(), this.formatPath([new TA(P.end.x, P.end.y), new TA(R.start.x, R.start.y)]), this.ctx.stroke()), Qn(c[1]) && (P = c[1], R = c[2], this.ctx.beginPath(), this.formatPath([new TA(P.end.x, P.end.y), new TA(R.start.x, R.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n;
        return Ot(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = wt(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = Ik(t), [4, this.renderStack(n)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(aC)
), kk = function(A) {
  return A instanceof $y || A instanceof ky ? !0 : A instanceof ng && A.type !== Fc && A.type !== Qc;
}, $k = function(A, e) {
  switch (A) {
    case 0:
      return bc(e);
    case 2:
      return Fk(e);
    case 1:
    default:
      return _c(e);
  }
}, Gk = function(A) {
  switch (A) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, Vk = ["-apple-system", "system-ui"], Wk = function(A) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? A.filter(function(e) {
    return Vk.indexOf(e) === -1;
  }) : A;
}, Xk = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), i.options = n, i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px", i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + n.width + "x" + n.height + " at " + n.x + "," + n.y + ") with scale " + n.scale), i;
    }
    return e.prototype.render = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i;
        return Ot(this, function(o) {
          switch (o.label) {
            case 0:
              return n = Dd(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, qk(n)];
            case 1:
              return i = o.sent(), this.options.backgroundColor && (this.ctx.fillStyle = wt(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(aC)
), qk = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, zk = (
  /** @class */
  function() {
    function A(e) {
      var t = e.id, n = e.enabled;
      this.id = t, this.enabled = n, this.start = Date.now();
    }
    return A.prototype.debug = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, wl([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.prototype.getTime = function() {
      return Date.now() - this.start;
    }, A.prototype.info = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, wl([this.id, this.getTime() + "ms"], e));
    }, A.prototype.warn = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, wl([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.prototype.error = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, wl([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.instances = {}, A;
  }()
), Jk = (
  /** @class */
  function() {
    function A(e, t) {
      var n;
      this.windowBounds = t, this.instanceName = "#" + A.instanceCount++, this.logger = new zk({ id: this.instanceName, enabled: e.logging }), this.cache = (n = e.cache) !== null && n !== void 0 ? n : new gk(this, e);
    }
    return A.instanceCount = 1, A;
  }()
), jk = function(A, e) {
  return e === void 0 && (e = {}), Yk(A, e);
};
typeof window < "u" && AC.setContext(window);
var Yk = function(A, e) {
  return Vt(void 0, void 0, void 0, function() {
    var t, n, i, o, l, f, c, h, m, B, g, v, u, C, F, U, S, N, x, P, J, R, J, fA, uA, BA, FA, NA, xA, X, CA, tA, hA, _A, IA, aA, D, eA, j, T;
    return Ot(this, function(k) {
      switch (k.label) {
        case 0:
          if (!A || typeof A != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = A.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (n = t.defaultView, !n)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (fA = e.allowTaint) !== null && fA !== void 0 ? fA : !1,
            imageTimeout: (uA = e.imageTimeout) !== null && uA !== void 0 ? uA : 15e3,
            proxy: e.proxy,
            useCORS: (BA = e.useCORS) !== null && BA !== void 0 ? BA : !1
          }, o = vd({ logging: (FA = e.logging) !== null && FA !== void 0 ? FA : !0, cache: e.cache }, i), l = {
            windowWidth: (NA = e.windowWidth) !== null && NA !== void 0 ? NA : n.innerWidth,
            windowHeight: (xA = e.windowHeight) !== null && xA !== void 0 ? xA : n.innerHeight,
            scrollX: (X = e.scrollX) !== null && X !== void 0 ? X : n.pageXOffset,
            scrollY: (CA = e.scrollY) !== null && CA !== void 0 ? CA : n.pageYOffset
          }, f = new qr(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), c = new Jk(o, f), h = (tA = e.foreignObjectRendering) !== null && tA !== void 0 ? tA : !1, m = {
            allowTaint: (hA = e.allowTaint) !== null && hA !== void 0 ? hA : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: h,
            copyStyles: h
          }, c.logger.debug("Starting document clone with size " + f.width + "x" + f.height + " scrolled to " + -f.left + "," + -f.top), B = new Av(c, A, m), g = B.clonedReferenceElement, g ? [4, B.toIFrame(t, f)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return v = k.sent(), u = rg(g) || ZR(g) ? xN(g.ownerDocument) : kc(c, g), C = u.width, F = u.height, U = u.left, S = u.top, N = Zk(c, g, e.backgroundColor), x = {
            canvas: e.canvas,
            backgroundColor: N,
            scale: (IA = (_A = e.scale) !== null && _A !== void 0 ? _A : n.devicePixelRatio) !== null && IA !== void 0 ? IA : 1,
            x: ((aA = e.x) !== null && aA !== void 0 ? aA : 0) + U,
            y: ((D = e.y) !== null && D !== void 0 ? D : 0) + S,
            width: (eA = e.width) !== null && eA !== void 0 ? eA : Math.ceil(C),
            height: (j = e.height) !== null && j !== void 0 ? j : Math.ceil(F)
          }, h ? (c.logger.debug("Document cloned, using foreign object rendering"), J = new Xk(c, x), [4, J.render(g)]) : [3, 3];
        case 2:
          return P = k.sent(), [3, 5];
        case 3:
          return c.logger.debug("Document cloned, element located at " + U + "," + S + " with size " + C + "x" + F + " using computed rendering"), c.logger.debug("Starting DOM parsing"), R = Wy(c, g), N === R.styles.backgroundColor && (R.styles.backgroundColor = Gr.TRANSPARENT), c.logger.debug("Starting renderer for element at " + x.x + "," + x.y + " with size " + x.width + "x" + x.height), J = new Rk(c, x), [4, J.render(R)];
        case 4:
          P = k.sent(), k.label = 5;
        case 5:
          return (!((T = e.removeContainer) !== null && T !== void 0) || T) && (Av.destroy(v) || c.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), c.logger.debug("Finished rendering"), [2, P];
      }
    });
  });
}, Zk = function(A, e, t) {
  var n = e.ownerDocument, i = n.documentElement ? Es(A, getComputedStyle(n.documentElement).backgroundColor) : Gr.TRANSPARENT, o = n.body ? Es(A, getComputedStyle(n.body).backgroundColor) : Gr.TRANSPARENT, l = typeof t == "string" ? Es(A, t) : t === null ? Gr.TRANSPARENT : 4294967295;
  return e === n.documentElement ? Ei(i) ? Ei(o) ? l : o : i : l;
};
let mi = {};
mi.vectorEffectSupport = !0;
mi.Listener = function(A) {
  var e = A, t = [], n = function(i) {
    if (!arguments.length || i == e)
      return e;
    e = i, t.forEach(function(o) {
      o(e);
    });
  };
  return n.addListener = function(i) {
    return t.push(i), n;
  }, n.removeListener = function(i) {
    return Le.pull(t, i), n;
  }, n;
};
mi.GeneMap = function(A) {
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
  }, t = Le.merge({}, e, A), n, i, o, l, f, c, h, m, B, g, v, u, C, F, U, S, N = !1, x = {}, P = function() {
    if (N) {
      var sA = oe(n).height();
      t.height = sA - 80, t.width = "100%";
    }
  }, R = function() {
    N ? (t.height = x.height, t.width = x.width, WA(n).classed("fullscreen", !1), N = !1) : (x.height = t.height, x.width = t.width, WA(n).classed("fullscreen", !0), N = !0), P(), CA(), uA(), JA();
  }, J = function() {
    var sA = { width: t.width, height: t.height };
    if (sA.width.toString().indexOf("%") >= 0 || sA.height.toString().indexOf("%") >= 0) {
      var vA = WA(n).select("svg").node().getBoundingClientRect();
      sA.width.toString().indexOf("%") >= 0 && (sA.width = vA.width), sA.height.toString().indexOf("%") >= 0 && (sA.height = vA.height);
    }
    return sA;
  }, fA = function() {
    const sA = Xa(i.node()), vA = sA.k, bA = [sA.x, sA.y];
    return bA[0] !== 0 || bA[1] !== 0 || vA !== 1;
  }, uA = function() {
    const sA = Xa(i.node()), vA = sA.k, bA = [sA.x, sA.y];
    vA === 1 && Le.isEqual(bA, [0, 0]) || (c.translate([0, 0]), c.scale(1), o.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    ), u.setFitButtonEnabled(fA()), EA(), JA());
  }, BA = function() {
    o.select(".drawing_outline").attr("width", B.drawing.width).attr("height", B.drawing.height);
  }, FA = function() {
    var sA = B.drawing, vA = B.margin;
    o.select(".drawing_margin").attr("x", vA.left).attr("y", vA.top).attr("width", sA.width - vA.left - vA.right).attr("height", sA.height - vA.top - vA.bottom);
  }, NA = function() {
    o.attr("transform", "translate(0,0)scale(1)"), o.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    );
  }, xA = async function() {
    const sA = document.querySelector(".mapview-wrapper");
    jk(sA).then((vA) => {
      const bA = vA.toDataURL("image/png"), te = document.createElement("a");
      te.href = bA, te.download = "capture.png", te.click();
    }).catch((vA) => {
      console.error("Error capturing the element:", vA);
    });
  };
  h = function() {
    var sA = Xa(this), vA = [sA.x, sA.y], bA = sA.k;
    if (B) {
      var te = i.node().getBoundingClientRect(), me = -B.drawing.width * bA + te.width * (1 - t.extraPanArea) + B.drawing.margin.right * bA, Ue = te.width * t.extraPanArea - B.drawing.margin.left * bA;
      vA[0] = Le.clamp(vA[0], me, Ue);
      var Ze = -B.drawing.height * bA + te.height * (1 - t.extraPanArea) + B.drawing.margin.bottom * bA, Te = te.height * t.extraPanArea - B.drawing.margin.top * bA;
      vA[1] = Le.clamp(vA[1], Ze, Te);
    }
    (sA.x !== vA[0] || sA.y !== vA[1]) && c.translateBy(
      i,
      vA[0] - sA.x,
      vA[1] - sA.y
    ), bA !== m && (EA(), JA(), m = bA), u.setFitButtonEnabled(fA()), o.attr(
      "transform",
      "translate(" + vA[0] + "," + vA[1] + ")scale(" + bA + ")"
    ), CA(), l.text(
      "translate: [ " + vA[0].toFixed(1) + "," + vA[1].toFixed(1) + "]  zoom:" + bA.toFixed(2)
    );
  };
  var X = function(sA) {
    sA.preventDefault();
  }, CA = function() {
    oe(".gene-annotation-popover").remove();
  }, tA = function() {
    var sA = function(bA) {
      bA.target !== "undefined" && bA.target.tagName.toLowerCase() === "a" || oe(bA.target).closest(".genemap-advanced-menu").length > 0 || oe(bA.target).closest(".color-picker-modal").length > 0 || CA();
    }, vA = "mousedown mousewheel DOMMouseScroll touchstart ";
    oe(n).off(vA).on(vA, sA), oe("body").on("click", function(bA) {
      oe(bA.target).closest(n).length < 1 && N == !0 && R();
    });
  }, hA = function(sA) {
    sA == "auto" ? (C = !0, F = !0, B.chromosomes.forEach(function(vA) {
      vA.annotations.genes.forEach(function(bA) {
        bA.selected == !0 && (bA.visible = !0);
      });
    })) : sA == "show" ? (C = !1, F = !0) : sA == "hide" && (C = !1, F = !1), B.chromosomes.forEach(function(vA) {
      vA.annotations.genes.forEach(function(bA) {
        sA === "auto" ? delete bA.showLabel : bA.showLabel = sA;
      });
    }), EA(), JA();
  }, _A = function() {
    var sA = B.chromosomes.some(function(vA) {
      return vA.annotations.genes.some(function(bA) {
        return bA.selected;
      });
    });
    RA.onAnonationLabelSelectFunction && RA.onAnonationLabelSelectFunction(RA.getSelectedGenes()), EA(), JA(), WA(".network-btn").classed("disabled", !sA);
  }, IA = function(sA) {
    v ? (B = g, v = !1) : (B = { chromosomes: [sA] }, v = !0), RA.onAnonationLabelSelectFunction(RA.getSelectedGenes()), uA(), EA(), JA();
  }, aA = function() {
    Le.flatMap(
      B.chromosomes.map(function(sA) {
        return sA.annotations.genes.filter(function(vA) {
          return vA.selected;
        }).map(function(vA) {
          var bA = vA.link, te = bA.substring(bA.indexOf("list="), bA.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              te.replace(/\+/g, " ")
            )
          );
        });
      })
    ), t.apiUrl + "";
  }, D = function() {
    var sA = u.getTagButtonState(), vA;
    sA === "auto" ? vA = "show" : sA === "show" ? vA = "hide" : vA = "auto", u.setTabButtonState(vA), hA(vA), JA();
  }, eA = function() {
    B.chromosomes.forEach(function(sA) {
      sA.annotations.allGenes.forEach(function(vA) {
        vA.selected = !1, vA.visible = !1, vA.hidden = !1;
      });
    }), EA(), JA();
  }, j = function(sA) {
    t.layout.numberPerRow = sA, rA(), EA(), JA();
  }, T = function(sA) {
    sA == "all" ? (U = !0, S = !0) : sA == "selected" ? (U = !1, S = "true") : (U = !1, S = !1), UA(), EA(), JA();
  }, k = function() {
    const vA = Xa(i.node()).k;
    var bA = dS(t.layout).width(J().width).height(J().height).scale(vA);
    B = bA.decorateGenome(B);
  }, rA = function() {
    B.chromosomes.forEach(function(sA) {
      sA.layout = sA.layout || {}, sA.layout.annotationDisplayClusters = null, sA.layout.geneBandDisplayClusters = null;
    });
  }, UA = function() {
    B.chromosomes.forEach(function(sA) {
      sA.layout = sA.layout || {}, sA.layout.qtlDisplayClusters = null;
    });
  }, EA = function() {
    const vA = Xa(i.node()).k;
    k();
    var bA = CN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: B.cellLayout.annotations.marker.size,
      annotationLabelSize: B.cellLayout.annotations.label.size,
      scale: vA,
      autoLabels: C,
      manualLabels: F,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), te = QN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: vA,
      nGenesToDisplay: t.nGenesToDisplay
    }), me = _N({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.qtlAnnotationPosition,
      scale: vA,
      showAllQTLs: U,
      showSelectedQTLs: S,
      showAutoQTLLabels: U,
      showSelectedQTLLabels: S,
      annotationLabelSize: B.cellLayout.annotations.label.size
    });
    B.chromosomes.forEach(function(Ue) {
      Ue.layout = Ue.layout || {}, Ue.layout.annotationDisplayClusters || bA.computeChromosomeClusters(Ue), bA.layoutChromosome(Ue), Ue.layout.geneBandDisplayClusters || te.computeChromosomeClusters(Ue), te.layoutChromosome(Ue), Ue.layout.qtlDisplayClusters || me.computeChromosomeClusters(Ue), me.layoutChromosome(Ue);
    }), bA.computeNormalisedGeneScores(B.chromosomes);
  }, zA = function(sA, vA) {
    var bA = /* @__PURE__ */ new Set(), te = [];
    vA.chromosomes.forEach(function(Ze) {
      Ze.annotations.snps.forEach(function(Te) {
        bA.has(Te.trait) || Te.trait != null && te.push({ trait: Te.trait, color: Te.color }), bA.add(Te.trait);
      });
    }), te.length > 0 ? sA.text("SNP legend: ") : sA.text("");
    var me = sA.selectAll("span").data(te), Ue = me.enter().append("span").classed("key-item", !0);
    Ue.append("span").style("background-color", function(Ze) {
      return Ze.color;
    }).classed("colorbox", !0).append("svg"), Ue.append("span").text(function(Ze) {
      return Ze.trait;
    }), me.exit().remove();
  }, ne = function(sA) {
    var vA = sA.append("div").attr("class", "mapview-wrapper"), bA = vA.append("svg").attr("width", t.width).attr("height", t.height).attr("class", "mapview").attr("flex", t.flex);
    l = sA.append("div").append("span").attr("class", "logger").attr("id", "logbar"), f = sA.append("div").attr("class", "key").attr("id", "keybar"), mi.vectorEffectSupport = "vectorEffect" in bA.node().style, tA(), bA.on("contextmenu", X), bA.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && sA.select(".zoom_window").append("rect").classed("drawing_margin", !0), m = 1, c = _O().scaleExtent([0.5, 60]), c.on("start", function() {
      bA.classed("dragging", !0);
    }).on("zoom", h).on("end", function() {
      bA.classed("dragging", !1);
    }), sA.select("svg").call(c);
    var te = sA.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return te.append("div").attr("class", "arrow"), te.append("h3").attr("class", "popover-title").text("Cluster"), te.append("div").attr("class", "popover-content"), bA;
  }, JA = function() {
    WA(n).select("svg").node() ? (i = WA(n).select("svg"), i.attr("width", t.width).attr("height", t.height)) : i = ne(WA(n)), k();
    var sA = B.chromosomes.every(function(bA) {
      return bA.layout;
    });
    sA || EA(), i.datum(B), o = i.select(".zoom_window"), BA(), t.contentBorder && FA();
    var vA = gN().onAnnotationSelectFunction(_A).onLabelSelectFunction(IA).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(i);
    o.call(vA);
  };
  function RA(sA) {
    sA.each(function(vA) {
      var bA = this;
      n = bA, g = vA, B = g, v = !1, u || (u = FN().onTagBtnClick(D).onFitBtnClick(uA).onLabelBtnClick(hA).onQtlBtnClick(T).onNetworkBtnClick(aA).onResetBtnClick(eA).onSetNumberPerRowClick(j).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(xA).onExportAllBtnClick(NA).onExpandBtnClick(R).maxSnpPValueProperty(RA.maxSnpPValue).nGenesToDisplayProperty(RA.nGenesToDisplay).annotationLabelSizeProperty(RA.annotationLabelSize)), WA(n).call(u), u.setNetworkButtonEnabled(!1), u.setFitButtonEnabled(!1), u.setTabButtonState("auto"), JA();
    });
  }
  return RA.resetZoom = uA, RA.width = function(sA) {
    return arguments.length ? (t.width = sA, RA) : t.width;
  }, RA.height = function(sA) {
    return arguments.length ? (t.height = sA, RA) : t.height;
  }, RA.layout = function(sA) {
    return arguments.length ? (t.layout = Le.merge(t.layout, sA), RA) : t.layout;
  }, RA.draw = async function(sA, vA, bA, te = !1) {
    var me = fS();
    if (bA)
      me.readData(vA, bA, te).then(function(Ue) {
        RA._draw(sA, Ue, te);
      });
    else {
      const Ue = await me.readData(vA, bA, te);
      RA._draw(sA, Ue, te);
    }
  }, RA._draw = function(sA, vA) {
    var bA = WA(sA).selectAll("div").data(["genemap-target"]);
    bA.enter().append("div").attr("id", function(te) {
      return te;
    }), n = WA(sA).select("#genemap-target").node(), WA(n).datum(vA).call(RA), RA.nGenesToDisplay(t.initialMaxGenes), uA(), zA(f, B);
  }, RA.changeQtlColor = function(sA, vA, bA) {
    B.chromosomes.forEach(function(te) {
      te.layout.qtlNodes.forEach(function(me) {
        me.id === sA && (me.color = vA, me.label = bA);
      });
    }), EA(), JA();
  }, RA.changeColor = function(sA) {
    WA("#map").style("background-color", sA), EA(), JA();
  }, RA.redraw = function(sA) {
    n = WA(sA).select("#genemap-target")[0][0], P(), WA(n).call(RA), CA();
  }, RA.setGeneLabels = function(sA) {
    n && hA(sA);
  }, RA.maxSnpPValue = mi.Listener(t.maxSnpPValue).addListener(function(sA) {
    var vA = Number(sA);
    isNaN(vA) && RA.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(sA), EA(), JA();
  }), RA.nGenesToDisplay = mi.Listener(t.nGenesToDisplay).addListener(
    function(sA) {
      var vA = t.nGenesToDisplay;
      t.nGenesToDisplay = sA, sA != vA && (rA(), EA(), JA());
    }
  ), RA.annotationLabelSize = mi.Listener(
    t.annotationLabelSize
  ).addListener(function(sA) {
    t.annotationLabelSize = sA, rA(), EA(), JA();
  }), RA.setQtlLabels = function(sA) {
    if (n) {
      var vA = WA(n).datum();
      vA.chromosomes.forEach(function(bA) {
        bA.annotations.qtls.forEach(function(te) {
          sA === "auto" ? delete te.showLabel : te.showLabel = sA;
        });
      });
    }
  }, RA.onAnonationLabelSelectFunction = function() {
  }, RA.loggingOn = function() {
    l.style("display", "initial");
  }, RA.loggingOff = function() {
    l.style("display", "none");
  }, RA.getSelectedGenes = function() {
    var sA = [];
    return B.chromosomes.forEach(function(vA) {
      vA.annotations.genes.forEach(function(bA) {
        bA.selected && sA.push(bA);
      });
    }), sA;
  }, RA.getGenome = function() {
    return B;
  }, RA;
};
const ro = mi.GeneMap().width("100%").height("100%");
function A$() {
  const A = document.getElementById("show-gene-labels"), e = A.options[A.selectedIndex].value;
  ro.setGeneLabels(e);
  const t = document.getElementById("show-qtl-labels"), n = t.options[t.selectedIndex].value;
  ro.setQtlLabels(n), ro.redraw("#map");
}
function e$() {
  ro.changeQtlColor("C6", "#000");
}
async function t$(A) {
  A && ro.resetZoom();
  const e = await import("./arabidopsis-DWsJl-zt.js"), t = await import("./arabidopsis-BWR4fnku.js");
  ro.draw("#map", e.default, t.default, !0);
}
export {
  e$ as changeQtlColor,
  ro as chart,
  t$ as redraw,
  A$ as updateLabel
};
