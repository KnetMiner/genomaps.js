import './chart.css';function r1(A, e) {
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
var zi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function xc(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var Vh = { exports: {} }, rv = {}, qn = {}, ro = {}, Rs = {}, Be = {}, xs = {};
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
      return (H = this._str) !== null && H !== void 0 ? H : this._str = this._items.reduce((O, _) => `${O}${_}`, "");
    }
    get names() {
      var H;
      return (H = this._names) !== null && H !== void 0 ? H : this._names = this._items.reduce((O, _) => (_ instanceof t && (O[_.str] = (O[_.str] || 0) + 1), O), {});
    }
  }
  A._Code = n, A.nil = new n("");
  function i(U, ...H) {
    const O = [U[0]];
    let _ = 0;
    for (; _ < H.length; )
      f(O, H[_]), O.push(U[++_]);
    return new n(O);
  }
  A._ = i;
  const o = new n("+");
  function l(U, ...H) {
    const O = [v(U[0])];
    let _ = 0;
    for (; _ < H.length; )
      O.push(o), f(O, H[_]), O.push(o, v(U[++_]));
    return c(O), new n(O);
  }
  A.str = l;
  function f(U, H) {
    H instanceof n ? U.push(...H._items) : H instanceof t ? U.push(H) : U.push(B(H));
  }
  A.addCodeArg = f;
  function c(U) {
    let H = 1;
    for (; H < U.length - 1; ) {
      if (U[H] === o) {
        const O = h(U[H - 1], U[H + 1]);
        if (O !== void 0) {
          U.splice(H - 1, 3, O);
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
  function m(U, H) {
    return H.emptyStr() ? U : U.emptyStr() ? H : l`${U}${H}`;
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
})(xs);
var Wh = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ValueScope = A.ValueScopeName = A.Scope = A.varKinds = A.UsedValueState = void 0;
  const e = xs;
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
        const H = C.get(u);
        if (H)
          return H;
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
          let H = m(U);
          if (H) {
            const O = this.opts.es5 ? A.varKinds.var : A.varKinds.const;
            v = (0, e._)`${v}${O} ${U} = ${H};${this.opts._n}`;
          } else if (H = g == null ? void 0 : g(U))
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
})(Wh);
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.or = A.and = A.not = A.CodeGen = A.operators = A.varKinds = A.ValueScopeName = A.ValueScope = A.Scope = A.Name = A.regexpCode = A.stringify = A.getProperty = A.nil = A.strConcat = A.str = A._ = void 0;
  const e = xs, t = Wh;
  var n = xs;
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
  var i = Wh;
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
    optimizeNames(L, R) {
      return this;
    }
  }
  class l extends o {
    constructor(L, R, nA) {
      super(), this.varKind = L, this.name = R, this.rhs = nA;
    }
    render({ es5: L, _n: R }) {
      const nA = L ? t.varKinds.var : this.varKind, FA = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${nA} ${this.name}${FA};` + R;
    }
    optimizeNames(L, R) {
      if (L[this.name.str])
        return this.rhs && (this.rhs = W(this.rhs, L, R)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class f extends o {
    constructor(L, R, nA) {
      super(), this.lhs = L, this.rhs = R, this.sideEffects = nA;
    }
    render({ _n: L }) {
      return `${this.lhs} = ${this.rhs};` + L;
    }
    optimizeNames(L, R) {
      if (!(this.lhs instanceof e.Name && !L[this.lhs.str] && !this.sideEffects))
        return this.rhs = W(this.rhs, L, R), this;
    }
    get names() {
      const L = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return _A(L, this.rhs);
    }
  }
  class c extends f {
    constructor(L, R, nA, FA) {
      super(L, nA, FA), this.op = R;
    }
    render({ _n: L }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + L;
    }
  }
  class h extends o {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `${this.label}:` + L;
    }
  }
  class m extends o {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `break${this.label ? ` ${this.label}` : ""};` + L;
    }
  }
  class B extends o {
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
  class g extends o {
    constructor(L) {
      super(), this.code = L;
    }
    render({ _n: L }) {
      return `${this.code};` + L;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(L, R) {
      return this.code = W(this.code, L, R), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class v extends o {
    constructor(L = []) {
      super(), this.nodes = L;
    }
    render(L) {
      return this.nodes.reduce((R, nA) => R + nA.render(L), "");
    }
    optimizeNodes() {
      const { nodes: L } = this;
      let R = L.length;
      for (; R--; ) {
        const nA = L[R].optimizeNodes();
        Array.isArray(nA) ? L.splice(R, 1, ...nA) : nA ? L[R] = nA : L.splice(R, 1);
      }
      return L.length > 0 ? this : void 0;
    }
    optimizeNames(L, R) {
      const { nodes: nA } = this;
      let FA = nA.length;
      for (; FA--; ) {
        const UA = nA[FA];
        UA.optimizeNames(L, R) || (yA(L, UA.names), nA.splice(FA, 1));
      }
      return nA.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((L, R) => OA(L, R.names), {});
    }
  }
  class u extends v {
    render(L) {
      return "{" + L._n + super.render(L) + "}" + L._n;
    }
  }
  class C extends v {
  }
  class F extends u {
  }
  F.kind = "else";
  class U extends u {
    constructor(L, R) {
      super(R), this.condition = L;
    }
    render(L) {
      let R = `if(${this.condition})` + super.render(L);
      return this.else && (R += "else " + this.else.render(L)), R;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const L = this.condition;
      if (L === !0)
        return this.nodes;
      let R = this.else;
      if (R) {
        const nA = R.optimizeNodes();
        R = this.else = Array.isArray(nA) ? new F(nA) : nA;
      }
      if (R)
        return L === !1 ? R instanceof U ? R : R.nodes : this.nodes.length ? this : new U(eA(L), R instanceof U ? [R] : R.nodes);
      if (!(L === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(L, R) {
      var nA;
      if (this.else = (nA = this.else) === null || nA === void 0 ? void 0 : nA.optimizeNames(L, R), !!(super.optimizeNames(L, R) || this.else))
        return this.condition = W(this.condition, L, R), this;
    }
    get names() {
      const L = super.names;
      return _A(L, this.condition), this.else && OA(L, this.else.names), L;
    }
  }
  U.kind = "if";
  class H extends u {
  }
  H.kind = "for";
  class O extends H {
    constructor(L) {
      super(), this.iteration = L;
    }
    render(L) {
      return `for(${this.iteration})` + super.render(L);
    }
    optimizeNames(L, R) {
      if (super.optimizeNames(L, R))
        return this.iteration = W(this.iteration, L, R), this;
    }
    get names() {
      return OA(super.names, this.iteration.names);
    }
  }
  class _ extends H {
    constructor(L, R, nA, FA) {
      super(), this.varKind = L, this.name = R, this.from = nA, this.to = FA;
    }
    render(L) {
      const R = L.es5 ? t.varKinds.var : this.varKind, { name: nA, from: FA, to: UA } = this;
      return `for(${R} ${nA}=${FA}; ${nA}<${UA}; ${nA}++)` + super.render(L);
    }
    get names() {
      const L = _A(super.names, this.from);
      return _A(L, this.to);
    }
  }
  class M extends H {
    constructor(L, R, nA, FA) {
      super(), this.loop = L, this.varKind = R, this.name = nA, this.iterable = FA;
    }
    render(L) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(L);
    }
    optimizeNames(L, R) {
      if (super.optimizeNames(L, R))
        return this.iterable = W(this.iterable, L, R), this;
    }
    get names() {
      return OA(super.names, this.iterable.names);
    }
  }
  class K extends u {
    constructor(L, R, nA) {
      super(), this.name = L, this.args = R, this.async = nA;
    }
    render(L) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(L);
    }
  }
  K.kind = "func";
  class z extends v {
    render(L) {
      return "return " + super.render(L);
    }
  }
  z.kind = "return";
  class cA extends u {
    render(L) {
      let R = "try" + super.render(L);
      return this.catch && (R += this.catch.render(L)), this.finally && (R += this.finally.render(L)), R;
    }
    optimizeNodes() {
      var L, R;
      return super.optimizeNodes(), (L = this.catch) === null || L === void 0 || L.optimizeNodes(), (R = this.finally) === null || R === void 0 || R.optimizeNodes(), this;
    }
    optimizeNames(L, R) {
      var nA, FA;
      return super.optimizeNames(L, R), (nA = this.catch) === null || nA === void 0 || nA.optimizeNames(L, R), (FA = this.finally) === null || FA === void 0 || FA.optimizeNames(L, R), this;
    }
    get names() {
      const L = super.names;
      return this.catch && OA(L, this.catch.names), this.finally && OA(L, this.finally.names), L;
    }
  }
  class sA extends u {
    constructor(L) {
      super(), this.error = L;
    }
    render(L) {
      return `catch(${this.error})` + super.render(L);
    }
  }
  sA.kind = "catch";
  class gA extends u {
    render(L) {
      return "finally" + super.render(L);
    }
  }
  gA.kind = "finally";
  class QA {
    constructor(L, R = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...R, _n: R.lines ? `
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
    scopeValue(L, R) {
      const nA = this._extScope.value(L, R);
      return (this._values[nA.prefix] || (this._values[nA.prefix] = /* @__PURE__ */ new Set())).add(nA), nA;
    }
    getScopeValue(L, R) {
      return this._extScope.getValue(L, R);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(L) {
      return this._extScope.scopeRefs(L, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(L, R, nA, FA) {
      const UA = this._scope.toName(R);
      return nA !== void 0 && FA && (this._constants[UA.str] = nA), this._leafNode(new l(L, UA, nA)), UA;
    }
    // `const` declaration (`var` in es5 mode)
    const(L, R, nA) {
      return this._def(t.varKinds.const, L, R, nA);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(L, R, nA) {
      return this._def(t.varKinds.let, L, R, nA);
    }
    // `var` declaration with optional assignment
    var(L, R, nA) {
      return this._def(t.varKinds.var, L, R, nA);
    }
    // assignment code
    assign(L, R, nA) {
      return this._leafNode(new f(L, R, nA));
    }
    // `+=` code
    add(L, R) {
      return this._leafNode(new c(L, A.operators.ADD, R));
    }
    // appends passed SafeExpr to code or executes Block
    code(L) {
      return typeof L == "function" ? L() : L !== e.nil && this._leafNode(new g(L)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...L) {
      const R = ["{"];
      for (const [nA, FA] of L)
        R.length > 1 && R.push(","), R.push(nA), (nA !== FA || this.opts.es5) && (R.push(":"), (0, e.addCodeArg)(R, FA));
      return R.push("}"), new e._Code(R);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(L, R, nA) {
      if (this._blockNode(new U(L)), R && nA)
        this.code(R).else().code(nA).endIf();
      else if (R)
        this.code(R).endIf();
      else if (nA)
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
    _for(L, R) {
      return this._blockNode(L), R && this.code(R).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(L, R) {
      return this._for(new O(L), R);
    }
    // `for` statement for a range of values
    forRange(L, R, nA, FA, UA = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const qA = this._scope.toName(L);
      return this._for(new _(UA, qA, R, nA), () => FA(qA));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(L, R, nA, FA = t.varKinds.const) {
      const UA = this._scope.toName(L);
      if (this.opts.es5) {
        const qA = R instanceof e.Name ? R : this.var("_arr", R);
        return this.forRange("_i", 0, (0, e._)`${qA}.length`, (te) => {
          this.var(UA, (0, e._)`${qA}[${te}]`), nA(UA);
        });
      }
      return this._for(new M("of", FA, UA, R), () => nA(UA));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(L, R, nA, FA = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(L, (0, e._)`Object.keys(${R})`, nA);
      const UA = this._scope.toName(L);
      return this._for(new M("in", FA, UA, R), () => nA(UA));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(H);
    }
    // `label` statement
    label(L) {
      return this._leafNode(new h(L));
    }
    // `break` statement
    break(L) {
      return this._leafNode(new m(L));
    }
    // `return` statement
    return(L) {
      const R = new z();
      if (this._blockNode(R), this.code(L), R.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(z);
    }
    // `try` statement
    try(L, R, nA) {
      if (!R && !nA)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const FA = new cA();
      if (this._blockNode(FA), this.code(L), R) {
        const UA = this.name("e");
        this._currNode = FA.catch = new sA(UA), R(UA);
      }
      return nA && (this._currNode = FA.finally = new gA(), this.code(nA)), this._endBlockNode(sA, gA);
    }
    // `throw` statement
    throw(L) {
      return this._leafNode(new B(L));
    }
    // start self-balancing block
    block(L, R) {
      return this._blockStarts.push(this._nodes.length), L && this.code(L).endBlock(R), this;
    }
    // end the current self-balancing block
    endBlock(L) {
      const R = this._blockStarts.pop();
      if (R === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const nA = this._nodes.length - R;
      if (nA < 0 || L !== void 0 && nA !== L)
        throw new Error(`CodeGen: wrong number of nodes: ${nA} vs ${L} expected`);
      return this._nodes.length = R, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(L, R = e.nil, nA, FA) {
      return this._blockNode(new K(L, R, nA)), FA && this.code(FA).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
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
    _endBlockNode(L, R) {
      const nA = this._currNode;
      if (nA instanceof L || R && nA instanceof R)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${R ? `${L.kind}/${R.kind}` : L.kind}"`);
    }
    _elseNode(L) {
      const R = this._currNode;
      if (!(R instanceof U))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = R.else = L, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const L = this._nodes;
      return L[L.length - 1];
    }
    set _currNode(L) {
      const R = this._nodes;
      R[R.length - 1] = L;
    }
  }
  A.CodeGen = QA;
  function OA(J, L) {
    for (const R in L)
      J[R] = (J[R] || 0) + (L[R] || 0);
    return J;
  }
  function _A(J, L) {
    return L instanceof e._CodeOrName ? OA(J, L.names) : J;
  }
  function W(J, L, R) {
    if (J instanceof e.Name)
      return nA(J);
    if (!FA(J))
      return J;
    return new e._Code(J._items.reduce((UA, qA) => (qA instanceof e.Name && (qA = nA(qA)), qA instanceof e._Code ? UA.push(...qA._items) : UA.push(qA), UA), []));
    function nA(UA) {
      const qA = R[UA.str];
      return qA === void 0 || L[UA.str] !== 1 ? UA : (delete L[UA.str], qA);
    }
    function FA(UA) {
      return UA instanceof e._Code && UA._items.some((qA) => qA instanceof e.Name && L[qA.str] === 1 && R[qA.str] !== void 0);
    }
  }
  function yA(J, L) {
    for (const R in L)
      J[R] = (J[R] || 0) - (L[R] || 0);
  }
  function eA(J) {
    return typeof J == "boolean" || typeof J == "number" || J === null ? !J : (0, e._)`!${AA(J)}`;
  }
  A.not = eA;
  const fA = T(A.operators.AND);
  function bA(...J) {
    return J.reduce(fA);
  }
  A.and = bA;
  const xA = T(A.operators.OR);
  function iA(...J) {
    return J.reduce(xA);
  }
  A.or = iA;
  function T(J) {
    return (L, R) => L === e.nil ? R : R === e.nil ? L : (0, e._)`${AA(L)} ${J} ${AA(R)}`;
  }
  function AA(J) {
    return J instanceof e.Name ? J : (0, e._)`(${J})`;
  }
})(Be);
var MA = {};
Object.defineProperty(MA, "__esModule", { value: !0 });
MA.checkStrictMode = MA.getErrorPath = MA.Type = MA.useFunc = MA.setEvaluated = MA.evaluatedPropsToName = MA.mergeEvaluated = MA.eachItem = MA.unescapeJsonPointer = MA.escapeJsonPointer = MA.escapeFragment = MA.unescapeFragment = MA.schemaRefOrVal = MA.schemaHasRulesButRef = MA.schemaHasRules = MA.checkUnknownRules = MA.alwaysValidSchema = MA.toHash = void 0;
const Ge = Be, i1 = xs;
function a1(A) {
  const e = {};
  for (const t of A)
    e[t] = !0;
  return e;
}
MA.toHash = a1;
function o1(A, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (iv(A, e), !av(e, A.self.RULES.all));
}
MA.alwaysValidSchema = o1;
function iv(A, e = A.schema) {
  const { opts: t, self: n } = A;
  if (!t.strictSchema || typeof e == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const o in e)
    i[o] || uv(A, `unknown keyword: "${o}"`);
}
MA.checkUnknownRules = iv;
function av(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e[t])
      return !0;
  return !1;
}
MA.schemaHasRules = av;
function s1(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (t !== "$ref" && e.all[t])
      return !0;
  return !1;
}
MA.schemaHasRulesButRef = s1;
function u1({ topSchemaRef: A, schemaPath: e }, t, n, i) {
  if (!i) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, Ge._)`${t}`;
  }
  return (0, Ge._)`${A}${e}${(0, Ge.getProperty)(n)}`;
}
MA.schemaRefOrVal = u1;
function l1(A) {
  return ov(decodeURIComponent(A));
}
MA.unescapeFragment = l1;
function c1(A) {
  return encodeURIComponent(Rd(A));
}
MA.escapeFragment = c1;
function Rd(A) {
  return typeof A == "number" ? `${A}` : A.replace(/~/g, "~0").replace(/\//g, "~1");
}
MA.escapeJsonPointer = Rd;
function ov(A) {
  return A.replace(/~1/g, "/").replace(/~0/g, "~");
}
MA.unescapeJsonPointer = ov;
function f1(A, e) {
  if (Array.isArray(A))
    for (const t of A)
      e(t);
  else
    e(A);
}
MA.eachItem = f1;
function kB({ mergeNames: A, mergeToName: e, mergeValues: t, resultToName: n }) {
  return (i, o, l, f) => {
    const c = l === void 0 ? o : l instanceof Ge.Name ? (o instanceof Ge.Name ? A(i, o, l) : e(i, o, l), l) : o instanceof Ge.Name ? (e(i, l, o), o) : t(o, l);
    return f === Ge.Name && !(c instanceof Ge.Name) ? n(i, c) : c;
  };
}
MA.mergeEvaluated = {
  props: kB({
    mergeNames: (A, e, t) => A.if((0, Ge._)`${t} !== true && ${e} !== undefined`, () => {
      A.if((0, Ge._)`${e} === true`, () => A.assign(t, !0), () => A.assign(t, (0, Ge._)`${t} || {}`).code((0, Ge._)`Object.assign(${t}, ${e})`));
    }),
    mergeToName: (A, e, t) => A.if((0, Ge._)`${t} !== true`, () => {
      e === !0 ? A.assign(t, !0) : (A.assign(t, (0, Ge._)`${t} || {}`), kd(A, t, e));
    }),
    mergeValues: (A, e) => A === !0 ? !0 : { ...A, ...e },
    resultToName: sv
  }),
  items: kB({
    mergeNames: (A, e, t) => A.if((0, Ge._)`${t} !== true && ${e} !== undefined`, () => A.assign(t, (0, Ge._)`${e} === true ? true : ${t} > ${e} ? ${t} : ${e}`)),
    mergeToName: (A, e, t) => A.if((0, Ge._)`${t} !== true`, () => A.assign(t, e === !0 ? !0 : (0, Ge._)`${t} > ${e} ? ${t} : ${e}`)),
    mergeValues: (A, e) => A === !0 ? !0 : Math.max(A, e),
    resultToName: (A, e) => A.var("items", e)
  })
};
function sv(A, e) {
  if (e === !0)
    return A.var("props", !0);
  const t = A.var("props", (0, Ge._)`{}`);
  return e !== void 0 && kd(A, t, e), t;
}
MA.evaluatedPropsToName = sv;
function kd(A, e, t) {
  Object.keys(t).forEach((n) => A.assign((0, Ge._)`${e}${(0, Ge.getProperty)(n)}`, !0));
}
MA.setEvaluated = kd;
const $B = {};
function h1(A, e) {
  return A.scopeValue("func", {
    ref: e,
    code: $B[e.code] || ($B[e.code] = new i1._Code(e.code))
  });
}
MA.useFunc = h1;
var Xh;
(function(A) {
  A[A.Num = 0] = "Num", A[A.Str = 1] = "Str";
})(Xh || (MA.Type = Xh = {}));
function d1(A, e, t) {
  if (A instanceof Ge.Name) {
    const n = e === Xh.Num;
    return t ? n ? (0, Ge._)`"[" + ${A} + "]"` : (0, Ge._)`"['" + ${A} + "']"` : n ? (0, Ge._)`"/" + ${A}` : (0, Ge._)`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, Ge.getProperty)(A).toString() : "/" + Rd(A);
}
MA.getErrorPath = d1;
function uv(A, e, t = A.opts.strictSchema) {
  if (t) {
    if (e = `strict mode: ${e}`, t === !0)
      throw new Error(e);
    A.self.logger.warn(e);
  }
}
MA.checkStrictMode = uv;
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
const Tt = Be, p1 = {
  // validation function arguments
  data: new Tt.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Tt.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Tt.Name("instancePath"),
  parentData: new Tt.Name("parentData"),
  parentDataProperty: new Tt.Name("parentDataProperty"),
  rootData: new Tt.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Tt.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Tt.Name("vErrors"),
  // null or array of validation errors
  errors: new Tt.Name("errors"),
  // counter of validation errors
  this: new Tt.Name("this"),
  // "globals"
  self: new Tt.Name("self"),
  scope: new Tt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Tt.Name("json"),
  jsonPos: new Tt.Name("jsonPos"),
  jsonLen: new Tt.Name("jsonLen"),
  jsonPart: new Tt.Name("jsonPart")
};
pr.default = p1;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.extendErrors = A.resetErrorsCount = A.reportExtraError = A.reportError = A.keyword$DataError = A.keywordError = void 0;
  const e = Be, t = MA, n = pr;
  A.keywordError = {
    message: ({ keyword: F }) => (0, e.str)`must pass "${F}" keyword validation`
  }, A.keyword$DataError = {
    message: ({ keyword: F, schemaType: U }) => U ? (0, e.str)`"${F}" keyword must be ${U} ($data)` : (0, e.str)`"${F}" keyword is invalid ($data)`
  };
  function i(F, U = A.keywordError, H, O) {
    const { it: _ } = F, { gen: M, compositeRule: K, allErrors: z } = _, cA = B(F, U, H);
    O ?? (K || z) ? c(M, cA) : h(_, (0, e._)`[${cA}]`);
  }
  A.reportError = i;
  function o(F, U = A.keywordError, H) {
    const { it: O } = F, { gen: _, compositeRule: M, allErrors: K } = O, z = B(F, U, H);
    c(_, z), M || K || h(O, n.default.vErrors);
  }
  A.reportExtraError = o;
  function l(F, U) {
    F.assign(n.default.errors, U), F.if((0, e._)`${n.default.vErrors} !== null`, () => F.if(U, () => F.assign((0, e._)`${n.default.vErrors}.length`, U), () => F.assign(n.default.vErrors, null)));
  }
  A.resetErrorsCount = l;
  function f({ gen: F, keyword: U, schemaValue: H, data: O, errsCount: _, it: M }) {
    if (_ === void 0)
      throw new Error("ajv implementation error");
    const K = F.name("err");
    F.forRange("i", _, n.default.errors, (z) => {
      F.const(K, (0, e._)`${n.default.vErrors}[${z}]`), F.if((0, e._)`${K}.instancePath === undefined`, () => F.assign((0, e._)`${K}.instancePath`, (0, e.strConcat)(n.default.instancePath, M.errorPath))), F.assign((0, e._)`${K}.schemaPath`, (0, e.str)`${M.errSchemaPath}/${U}`), M.opts.verbose && (F.assign((0, e._)`${K}.schema`, H), F.assign((0, e._)`${K}.data`, O));
    });
  }
  A.extendErrors = f;
  function c(F, U) {
    const H = F.const("err", U);
    F.if((0, e._)`${n.default.vErrors} === null`, () => F.assign(n.default.vErrors, (0, e._)`[${H}]`), (0, e._)`${n.default.vErrors}.push(${H})`), F.code((0, e._)`${n.default.errors}++`);
  }
  function h(F, U) {
    const { gen: H, validateName: O, schemaEnv: _ } = F;
    _.$async ? H.throw((0, e._)`new ${F.ValidationError}(${U})`) : (H.assign((0, e._)`${O}.errors`, U), H.return(!1));
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
  function B(F, U, H) {
    const { createErrors: O } = F.it;
    return O === !1 ? (0, e._)`{}` : g(F, U, H);
  }
  function g(F, U, H = {}) {
    const { gen: O, it: _ } = F, M = [
      v(_, H),
      u(F, H)
    ];
    return C(F, U, M), O.object(...M);
  }
  function v({ errorPath: F }, { instancePath: U }) {
    const H = U ? (0, e.str)`${F}${(0, t.getErrorPath)(U, t.Type.Str)}` : F;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, H)];
  }
  function u({ keyword: F, it: { errSchemaPath: U } }, { schemaPath: H, parentSchema: O }) {
    let _ = O ? U : (0, e.str)`${U}/${F}`;
    return H && (_ = (0, e.str)`${_}${(0, t.getErrorPath)(H, t.Type.Str)}`), [m.schemaPath, _];
  }
  function C(F, { params: U, message: H }, O) {
    const { keyword: _, data: M, schemaValue: K, it: z } = F, { opts: cA, propertyName: sA, topSchemaRef: gA, schemaPath: QA } = z;
    O.push([m.keyword, _], [m.params, typeof U == "function" ? U(F) : U || (0, e._)`{}`]), cA.messages && O.push([m.message, typeof H == "function" ? H(F) : H]), cA.verbose && O.push([m.schema, K], [m.parentSchema, (0, e._)`${gA}${QA}`], [n.default.data, M]), sA && O.push([m.propertyName, sA]);
  }
})(Rs);
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.boolOrEmptySchema = ro.topBoolOrEmptySchema = void 0;
const g1 = Rs, B1 = Be, w1 = pr, m1 = {
  message: "boolean schema is false"
};
function v1(A) {
  const { gen: e, schema: t, validateName: n } = A;
  t === !1 ? lv(A, !1) : typeof t == "object" && t.$async === !0 ? e.return(w1.default.data) : (e.assign((0, B1._)`${n}.errors`, null), e.return(!0));
}
ro.topBoolOrEmptySchema = v1;
function y1(A, e) {
  const { gen: t, schema: n } = A;
  n === !1 ? (t.var(e, !1), lv(A)) : t.var(e, !0);
}
ro.boolOrEmptySchema = y1;
function lv(A, e) {
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
  (0, g1.reportError)(i, m1, void 0, e);
}
var ft = {}, aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.getRules = aa.isJSONType = void 0;
const C1 = ["string", "number", "integer", "boolean", "null", "object", "array"], Q1 = new Set(C1);
function F1(A) {
  return typeof A == "string" && Q1.has(A);
}
aa.isJSONType = F1;
function U1() {
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
aa.getRules = U1;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.shouldUseRule = Rr.shouldUseGroup = Rr.schemaHasRulesForType = void 0;
function E1({ schema: A, self: e }, t) {
  const n = e.RULES.types[t];
  return n && n !== !0 && cv(A, n);
}
Rr.schemaHasRulesForType = E1;
function cv(A, e) {
  return e.rules.some((t) => fv(A, t));
}
Rr.shouldUseGroup = cv;
function fv(A, e) {
  var t;
  return A[e.keyword] !== void 0 || ((t = e.definition.implements) === null || t === void 0 ? void 0 : t.some((n) => A[n] !== void 0));
}
Rr.shouldUseRule = fv;
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.reportTypeError = ft.checkDataTypes = ft.checkDataType = ft.coerceAndCheckDataType = ft.getJSONTypes = ft.getSchemaTypes = ft.DataType = void 0;
const b1 = aa, _1 = Rr, x1 = Rs, he = Be, hv = MA;
var Ya;
(function(A) {
  A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong";
})(Ya || (ft.DataType = Ya = {}));
function I1(A) {
  const e = dv(A.type);
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
ft.getSchemaTypes = I1;
function dv(A) {
  const e = Array.isArray(A) ? A : A ? [A] : [];
  if (e.every(b1.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
ft.getJSONTypes = dv;
function H1(A, e) {
  const { gen: t, data: n, opts: i } = A, o = S1(e, i.coerceTypes), l = e.length > 0 && !(o.length === 0 && e.length === 1 && (0, _1.schemaHasRulesForType)(A, e[0]));
  if (l) {
    const f = $d(e, n, i.strictNumbers, Ya.Wrong);
    t.if(f, () => {
      o.length ? L1(A, e, o) : Gd(A);
    });
  }
  return l;
}
ft.coerceAndCheckDataType = H1;
const pv = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function S1(A, e) {
  return e ? A.filter((t) => pv.has(t) || e === "array" && t === "array") : [];
}
function L1(A, e, t) {
  const { gen: n, data: i, opts: o } = A, l = n.let("dataType", (0, he._)`typeof ${i}`), f = n.let("coerced", (0, he._)`undefined`);
  o.coerceTypes === "array" && n.if((0, he._)`${l} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, he._)`${i}[0]`).assign(l, (0, he._)`typeof ${i}`).if($d(e, i, o.strictNumbers), () => n.assign(f, i))), n.if((0, he._)`${f} !== undefined`);
  for (const h of t)
    (pv.has(h) || h === "array" && o.coerceTypes === "array") && c(h);
  n.else(), Gd(A), n.endIf(), n.if((0, he._)`${f} !== undefined`, () => {
    n.assign(i, f), T1(A, f);
  });
  function c(h) {
    switch (h) {
      case "string":
        n.elseIf((0, he._)`${l} == "number" || ${l} == "boolean"`).assign(f, (0, he._)`"" + ${i}`).elseIf((0, he._)`${i} === null`).assign(f, (0, he._)`""`);
        return;
      case "number":
        n.elseIf((0, he._)`${l} == "boolean" || ${i} === null
              || (${l} == "string" && ${i} && ${i} == +${i})`).assign(f, (0, he._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, he._)`${l} === "boolean" || ${i} === null
              || (${l} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(f, (0, he._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, he._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(f, !1).elseIf((0, he._)`${i} === "true" || ${i} === 1`).assign(f, !0);
        return;
      case "null":
        n.elseIf((0, he._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(f, null);
        return;
      case "array":
        n.elseIf((0, he._)`${l} === "string" || ${l} === "number"
              || ${l} === "boolean" || ${i} === null`).assign(f, (0, he._)`[${i}]`);
    }
  }
}
function T1({ gen: A, parentData: e, parentDataProperty: t }, n) {
  A.if((0, he._)`${e} !== undefined`, () => A.assign((0, he._)`${e}[${t}]`, n));
}
function qh(A, e, t, n = Ya.Correct) {
  const i = n === Ya.Correct ? he.operators.EQ : he.operators.NEQ;
  let o;
  switch (A) {
    case "null":
      return (0, he._)`${e} ${i} null`;
    case "array":
      o = (0, he._)`Array.isArray(${e})`;
      break;
    case "object":
      o = (0, he._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      o = l((0, he._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      o = l();
      break;
    default:
      return (0, he._)`typeof ${e} ${i} ${A}`;
  }
  return n === Ya.Correct ? o : (0, he.not)(o);
  function l(f = he.nil) {
    return (0, he.and)((0, he._)`typeof ${e} == "number"`, f, t ? (0, he._)`isFinite(${e})` : he.nil);
  }
}
ft.checkDataType = qh;
function $d(A, e, t, n) {
  if (A.length === 1)
    return qh(A[0], e, t, n);
  let i;
  const o = (0, hv.toHash)(A);
  if (o.array && o.object) {
    const l = (0, he._)`typeof ${e} != "object"`;
    i = o.null ? l : (0, he._)`!${e} || ${l}`, delete o.null, delete o.array, delete o.object;
  } else
    i = he.nil;
  o.number && delete o.integer;
  for (const l in o)
    i = (0, he.and)(i, qh(l, e, t, n));
  return i;
}
ft.checkDataTypes = $d;
const D1 = {
  message: ({ schema: A }) => `must be ${A}`,
  params: ({ schema: A, schemaValue: e }) => typeof A == "string" ? (0, he._)`{type: ${A}}` : (0, he._)`{type: ${e}}`
};
function Gd(A) {
  const e = O1(A);
  (0, x1.reportError)(e, D1);
}
ft.reportTypeError = Gd;
function O1(A) {
  const { gen: e, data: t, schema: n } = A, i = (0, hv.schemaRefOrVal)(A, n, "type");
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
var Ic = {};
Object.defineProperty(Ic, "__esModule", { value: !0 });
Ic.assignDefaults = void 0;
const Oa = Be, N1 = MA;
function M1(A, e) {
  const { properties: t, items: n } = A.schema;
  if (e === "object" && t)
    for (const i in t)
      GB(A, i, t[i].default);
  else e === "array" && Array.isArray(n) && n.forEach((i, o) => GB(A, o, i.default));
}
Ic.assignDefaults = M1;
function GB(A, e, t) {
  const { gen: n, compositeRule: i, data: o, opts: l } = A;
  if (t === void 0)
    return;
  const f = (0, Oa._)`${o}${(0, Oa.getProperty)(e)}`;
  if (i) {
    (0, N1.checkStrictMode)(A, `default is ignored for: ${f}`);
    return;
  }
  let c = (0, Oa._)`${f} === undefined`;
  l.useDefaults === "empty" && (c = (0, Oa._)`${c} || ${f} === null || ${f} === ""`), n.if(c, (0, Oa._)`${f} = ${(0, Oa.stringify)(t)}`);
}
var lr = {}, ge = {};
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.validateUnion = ge.validateArray = ge.usePattern = ge.callValidateCode = ge.schemaProperties = ge.allSchemaProperties = ge.noPropertyInData = ge.propertyInData = ge.isOwnProperty = ge.hasPropFunc = ge.reportMissingProp = ge.checkMissingProp = ge.checkReportMissingProp = void 0;
const qe = Be, Vd = MA, hi = pr, P1 = MA;
function K1(A, e) {
  const { gen: t, data: n, it: i } = A;
  t.if(Xd(t, n, e, i.opts.ownProperties), () => {
    A.setParams({ missingProperty: (0, qe._)`${e}` }, !0), A.error();
  });
}
ge.checkReportMissingProp = K1;
function R1({ gen: A, data: e, it: { opts: t } }, n, i) {
  return (0, qe.or)(...n.map((o) => (0, qe.and)(Xd(A, e, o, t.ownProperties), (0, qe._)`${i} = ${o}`)));
}
ge.checkMissingProp = R1;
function k1(A, e) {
  A.setParams({ missingProperty: e }, !0), A.error();
}
ge.reportMissingProp = k1;
function gv(A) {
  return A.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, qe._)`Object.prototype.hasOwnProperty`
  });
}
ge.hasPropFunc = gv;
function Wd(A, e, t) {
  return (0, qe._)`${gv(A)}.call(${e}, ${t})`;
}
ge.isOwnProperty = Wd;
function $1(A, e, t, n) {
  const i = (0, qe._)`${e}${(0, qe.getProperty)(t)} !== undefined`;
  return n ? (0, qe._)`${i} && ${Wd(A, e, t)}` : i;
}
ge.propertyInData = $1;
function Xd(A, e, t, n) {
  const i = (0, qe._)`${e}${(0, qe.getProperty)(t)} === undefined`;
  return n ? (0, qe.or)(i, (0, qe.not)(Wd(A, e, t))) : i;
}
ge.noPropertyInData = Xd;
function Bv(A) {
  return A ? Object.keys(A).filter((e) => e !== "__proto__") : [];
}
ge.allSchemaProperties = Bv;
function G1(A, e) {
  return Bv(e).filter((t) => !(0, Vd.alwaysValidSchema)(A, e[t]));
}
ge.schemaProperties = G1;
function V1({ schemaCode: A, data: e, it: { gen: t, topSchemaRef: n, schemaPath: i, errorPath: o }, it: l }, f, c, h) {
  const m = h ? (0, qe._)`${A}, ${e}, ${n}${i}` : e, B = [
    [hi.default.instancePath, (0, qe.strConcat)(hi.default.instancePath, o)],
    [hi.default.parentData, l.parentData],
    [hi.default.parentDataProperty, l.parentDataProperty],
    [hi.default.rootData, hi.default.rootData]
  ];
  l.opts.dynamicRef && B.push([hi.default.dynamicAnchors, hi.default.dynamicAnchors]);
  const g = (0, qe._)`${m}, ${t.object(...B)}`;
  return c !== qe.nil ? (0, qe._)`${f}.call(${c}, ${g})` : (0, qe._)`${f}(${g})`;
}
ge.callValidateCode = V1;
const W1 = (0, qe._)`new RegExp`;
function X1({ gen: A, it: { opts: e } }, t) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: i } = e.code, o = i(t, n);
  return A.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, qe._)`${i.code === "new RegExp" ? W1 : (0, P1.useFunc)(A, i)}(${t}, ${n})`
  });
}
ge.usePattern = X1;
function q1(A) {
  const { gen: e, data: t, keyword: n, it: i } = A, o = e.name("valid");
  if (i.allErrors) {
    const f = e.let("valid", !0);
    return l(() => e.assign(f, !1)), f;
  }
  return e.var(o, !0), l(() => e.break()), o;
  function l(f) {
    const c = e.const("len", (0, qe._)`${t}.length`);
    e.forRange("i", 0, c, (h) => {
      A.subschema({
        keyword: n,
        dataProp: h,
        dataPropType: Vd.Type.Num
      }, o), e.if((0, qe.not)(o), f);
    });
  }
}
ge.validateArray = q1;
function z1(A) {
  const { gen: e, schema: t, keyword: n, it: i } = A;
  if (!Array.isArray(t))
    throw new Error("ajv implementation error");
  if (t.some((c) => (0, Vd.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const l = e.let("valid", !1), f = e.name("_valid");
  e.block(() => t.forEach((c, h) => {
    const m = A.subschema({
      keyword: n,
      schemaProp: h,
      compositeRule: !0
    }, f);
    e.assign(l, (0, qe._)`${l} || ${f}`), A.mergeValidEvaluated(m, f) || e.if((0, qe.not)(l));
  })), A.result(l, () => A.reset(), () => A.error(!0));
}
ge.validateUnion = z1;
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.validateKeywordUsage = lr.validSchemaType = lr.funcKeywordCode = lr.macroKeywordCode = void 0;
const Vt = Be, Ji = pr, J1 = ge, j1 = Rs;
function Y1(A, e) {
  const { gen: t, keyword: n, schema: i, parentSchema: o, it: l } = A, f = e.macro.call(l.self, i, o, l), c = wv(t, n, f);
  l.opts.validateSchema !== !1 && l.self.validateSchema(f, !0);
  const h = t.name("valid");
  A.subschema({
    schema: f,
    schemaPath: Vt.nil,
    errSchemaPath: `${l.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, h), A.pass(h, () => A.error(!0));
}
lr.macroKeywordCode = Y1;
function Z1(A, e) {
  var t;
  const { gen: n, keyword: i, schema: o, parentSchema: l, $data: f, it: c } = A;
  e_(c, e);
  const h = !f && e.compile ? e.compile.call(c.self, o, l, c) : e.validate, m = wv(n, i, h), B = n.let("valid");
  A.block$data(B, g), A.ok((t = e.valid) !== null && t !== void 0 ? t : B);
  function g() {
    if (e.errors === !1)
      C(), e.modifying && VB(A), F(() => A.error());
    else {
      const U = e.async ? v() : u();
      e.modifying && VB(A), F(() => A_(A, U));
    }
  }
  function v() {
    const U = n.let("ruleErrs", null);
    return n.try(() => C((0, Vt._)`await `), (H) => n.assign(B, !1).if((0, Vt._)`${H} instanceof ${c.ValidationError}`, () => n.assign(U, (0, Vt._)`${H}.errors`), () => n.throw(H))), U;
  }
  function u() {
    const U = (0, Vt._)`${m}.errors`;
    return n.assign(U, null), C(Vt.nil), U;
  }
  function C(U = e.async ? (0, Vt._)`await ` : Vt.nil) {
    const H = c.opts.passContext ? Ji.default.this : Ji.default.self, O = !("compile" in e && !f || e.schema === !1);
    n.assign(B, (0, Vt._)`${U}${(0, J1.callValidateCode)(A, m, H, O)}`, e.modifying);
  }
  function F(U) {
    var H;
    n.if((0, Vt.not)((H = e.valid) !== null && H !== void 0 ? H : B), U);
  }
}
lr.funcKeywordCode = Z1;
function VB(A) {
  const { gen: e, data: t, it: n } = A;
  e.if(n.parentData, () => e.assign(t, (0, Vt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function A_(A, e) {
  const { gen: t } = A;
  t.if((0, Vt._)`Array.isArray(${e})`, () => {
    t.assign(Ji.default.vErrors, (0, Vt._)`${Ji.default.vErrors} === null ? ${e} : ${Ji.default.vErrors}.concat(${e})`).assign(Ji.default.errors, (0, Vt._)`${Ji.default.vErrors}.length`), (0, j1.extendErrors)(A);
  }, () => A.error());
}
function e_({ schemaEnv: A }, e) {
  if (e.async && !A.$async)
    throw new Error("async keyword in sync schema");
}
function wv(A, e, t) {
  if (t === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return A.scopeValue("keyword", typeof t == "function" ? { ref: t } : { ref: t, code: (0, Vt.stringify)(t) });
}
function t_(A, e, t = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(A) : n === "object" ? A && typeof A == "object" && !Array.isArray(A) : typeof A == n || t && typeof A > "u");
}
lr.validSchemaType = t_;
function n_({ schema: A, opts: e, self: t, errSchemaPath: n }, i, o) {
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
lr.validateKeywordUsage = n_;
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.extendSubschemaMode = Qi.extendSubschemaData = Qi.getSubschema = void 0;
const ur = Be, mv = MA;
function r_(A, { keyword: e, schemaProp: t, schema: n, schemaPath: i, errSchemaPath: o, topSchemaRef: l }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const f = A.schema[e];
    return t === void 0 ? {
      schema: f,
      schemaPath: (0, ur._)`${A.schemaPath}${(0, ur.getProperty)(e)}`,
      errSchemaPath: `${A.errSchemaPath}/${e}`
    } : {
      schema: f[t],
      schemaPath: (0, ur._)`${A.schemaPath}${(0, ur.getProperty)(e)}${(0, ur.getProperty)(t)}`,
      errSchemaPath: `${A.errSchemaPath}/${e}/${(0, mv.escapeFragment)(t)}`
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
Qi.getSubschema = r_;
function i_(A, e, { dataProp: t, dataPropType: n, data: i, dataTypes: o, propertyName: l }) {
  if (i !== void 0 && t !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: f } = e;
  if (t !== void 0) {
    const { errorPath: h, dataPathArr: m, opts: B } = e, g = f.let("data", (0, ur._)`${e.data}${(0, ur.getProperty)(t)}`, !0);
    c(g), A.errorPath = (0, ur.str)`${h}${(0, mv.getErrorPath)(t, n, B.jsPropertySyntax)}`, A.parentDataProperty = (0, ur._)`${t}`, A.dataPathArr = [...m, A.parentDataProperty];
  }
  if (i !== void 0) {
    const h = i instanceof ur.Name ? i : f.let("data", i, !0);
    c(h), l !== void 0 && (A.propertyName = l);
  }
  o && (A.dataTypes = o);
  function c(h) {
    A.data = h, A.dataLevel = e.dataLevel + 1, A.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), A.parentData = e.data, A.dataNames = [...e.dataNames, h];
  }
}
Qi.extendSubschemaData = i_;
function a_(A, { jtdDiscriminator: e, jtdMetadata: t, compositeRule: n, createErrors: i, allErrors: o }) {
  n !== void 0 && (A.compositeRule = n), i !== void 0 && (A.createErrors = i), o !== void 0 && (A.allErrors = o), A.jtdDiscriminator = e, A.jtdMetadata = t;
}
Qi.extendSubschemaMode = a_;
var Ft = {}, vv = function A(e, t) {
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
}, yv = { exports: {} }, mi = yv.exports = function(A, e, t) {
  typeof e == "function" && (t = e, e = {}), t = e.cb || t;
  var n = typeof t == "function" ? t : t.pre || function() {
  }, i = t.post || function() {
  };
  Kl(e, n, i, A, "", A);
};
mi.keywords = {
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
mi.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
mi.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
mi.skipKeywords = {
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
function Kl(A, e, t, n, i, o, l, f, c, h) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, i, o, l, f, c, h);
    for (var m in n) {
      var B = n[m];
      if (Array.isArray(B)) {
        if (m in mi.arrayKeywords)
          for (var g = 0; g < B.length; g++)
            Kl(A, e, t, B[g], i + "/" + m + "/" + g, o, i, m, n, g);
      } else if (m in mi.propsKeywords) {
        if (B && typeof B == "object")
          for (var v in B)
            Kl(A, e, t, B[v], i + "/" + m + "/" + o_(v), o, i, m, n, v);
      } else (m in mi.keywords || A.allKeys && !(m in mi.skipKeywords)) && Kl(A, e, t, B, i + "/" + m, o, i, m, n);
    }
    t(n, i, o, l, f, c, h);
  }
}
function o_(A) {
  return A.replace(/~/g, "~0").replace(/\//g, "~1");
}
var s_ = yv.exports;
Object.defineProperty(Ft, "__esModule", { value: !0 });
Ft.getSchemaRefs = Ft.resolveUrl = Ft.normalizeId = Ft._getFullPath = Ft.getFullPath = Ft.inlineRef = void 0;
const u_ = MA, l_ = vv, c_ = s_, f_ = /* @__PURE__ */ new Set([
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
function h_(A, e = !0) {
  return typeof A == "boolean" ? !0 : e === !0 ? !zh(A) : e ? Cv(A) <= e : !1;
}
Ft.inlineRef = h_;
const d_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function zh(A) {
  for (const e in A) {
    if (d_.has(e))
      return !0;
    const t = A[e];
    if (Array.isArray(t) && t.some(zh) || typeof t == "object" && zh(t))
      return !0;
  }
  return !1;
}
function Cv(A) {
  let e = 0;
  for (const t in A) {
    if (t === "$ref")
      return 1 / 0;
    if (e++, !f_.has(t) && (typeof A[t] == "object" && (0, u_.eachItem)(A[t], (n) => e += Cv(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function Qv(A, e = "", t) {
  t !== !1 && (e = Za(e));
  const n = A.parse(e);
  return Fv(A, n);
}
Ft.getFullPath = Qv;
function Fv(A, e) {
  return A.serialize(e).split("#")[0] + "#";
}
Ft._getFullPath = Fv;
const p_ = /#\/?$/;
function Za(A) {
  return A ? A.replace(p_, "") : "";
}
Ft.normalizeId = Za;
function g_(A, e, t) {
  return t = Za(t), A.resolve(e, t);
}
Ft.resolveUrl = g_;
const B_ = /^[a-z_][-a-z0-9._]*$/i;
function w_(A, e) {
  if (typeof A == "boolean")
    return {};
  const { schemaId: t, uriResolver: n } = this.opts, i = Za(A[t] || e), o = { "": i }, l = Qv(n, i, !1), f = {}, c = /* @__PURE__ */ new Set();
  return c_(A, { allKeys: !0 }, (B, g, v, u) => {
    if (u === void 0)
      return;
    const C = l + g;
    let F = o[u];
    typeof B[t] == "string" && (F = U.call(this, B[t])), H.call(this, B.$anchor), H.call(this, B.$dynamicAnchor), o[g] = F;
    function U(O) {
      const _ = this.opts.uriResolver.resolve;
      if (O = Za(F ? _(F, O) : O), c.has(O))
        throw m(O);
      c.add(O);
      let M = this.refs[O];
      return typeof M == "string" && (M = this.refs[M]), typeof M == "object" ? h(B, M.schema, O) : O !== Za(C) && (O[0] === "#" ? (h(B, f[O], O), f[O] = B) : this.refs[O] = C), O;
    }
    function H(O) {
      if (typeof O == "string") {
        if (!B_.test(O))
          throw new Error(`invalid anchor "${O}"`);
        U.call(this, `#${O}`);
      }
    }
  }), f;
  function h(B, g, v) {
    if (g !== void 0 && !l_(B, g))
      throw m(v);
  }
  function m(B) {
    return new Error(`reference "${B}" resolves to more than one schema`);
  }
}
Ft.getSchemaRefs = w_;
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.getData = qn.KeywordCxt = qn.validateFunctionCode = void 0;
const Uv = ro, WB = ft, qd = Rr, ec = ft, m_ = Ic, gs = lr, lh = Qi, kA = Be, oe = pr, v_ = Ft, kr = MA, Jo = Rs;
function y_(A) {
  if (_v(A) && (xv(A), bv(A))) {
    F_(A);
    return;
  }
  Ev(A, () => (0, Uv.topBoolOrEmptySchema)(A));
}
qn.validateFunctionCode = y_;
function Ev({ gen: A, validateName: e, schema: t, schemaEnv: n, opts: i }, o) {
  i.code.es5 ? A.func(e, (0, kA._)`${oe.default.data}, ${oe.default.valCxt}`, n.$async, () => {
    A.code((0, kA._)`"use strict"; ${XB(t, i)}`), Q_(A, i), A.code(o);
  }) : A.func(e, (0, kA._)`${oe.default.data}, ${C_(i)}`, n.$async, () => A.code(XB(t, i)).code(o));
}
function C_(A) {
  return (0, kA._)`{${oe.default.instancePath}="", ${oe.default.parentData}, ${oe.default.parentDataProperty}, ${oe.default.rootData}=${oe.default.data}${A.dynamicRef ? (0, kA._)`, ${oe.default.dynamicAnchors}={}` : kA.nil}}={}`;
}
function Q_(A, e) {
  A.if(oe.default.valCxt, () => {
    A.var(oe.default.instancePath, (0, kA._)`${oe.default.valCxt}.${oe.default.instancePath}`), A.var(oe.default.parentData, (0, kA._)`${oe.default.valCxt}.${oe.default.parentData}`), A.var(oe.default.parentDataProperty, (0, kA._)`${oe.default.valCxt}.${oe.default.parentDataProperty}`), A.var(oe.default.rootData, (0, kA._)`${oe.default.valCxt}.${oe.default.rootData}`), e.dynamicRef && A.var(oe.default.dynamicAnchors, (0, kA._)`${oe.default.valCxt}.${oe.default.dynamicAnchors}`);
  }, () => {
    A.var(oe.default.instancePath, (0, kA._)`""`), A.var(oe.default.parentData, (0, kA._)`undefined`), A.var(oe.default.parentDataProperty, (0, kA._)`undefined`), A.var(oe.default.rootData, oe.default.data), e.dynamicRef && A.var(oe.default.dynamicAnchors, (0, kA._)`{}`);
  });
}
function F_(A) {
  const { schema: e, opts: t, gen: n } = A;
  Ev(A, () => {
    t.$comment && e.$comment && Hv(A), x_(A), n.let(oe.default.vErrors, null), n.let(oe.default.errors, 0), t.unevaluated && U_(A), Iv(A), S_(A);
  });
}
function U_(A) {
  const { gen: e, validateName: t } = A;
  A.evaluated = e.const("evaluated", (0, kA._)`${t}.evaluated`), e.if((0, kA._)`${A.evaluated}.dynamicProps`, () => e.assign((0, kA._)`${A.evaluated}.props`, (0, kA._)`undefined`)), e.if((0, kA._)`${A.evaluated}.dynamicItems`, () => e.assign((0, kA._)`${A.evaluated}.items`, (0, kA._)`undefined`));
}
function XB(A, e) {
  const t = typeof A == "object" && A[e.schemaId];
  return t && (e.code.source || e.code.process) ? (0, kA._)`/*# sourceURL=${t} */` : kA.nil;
}
function E_(A, e) {
  if (_v(A) && (xv(A), bv(A))) {
    b_(A, e);
    return;
  }
  (0, Uv.boolOrEmptySchema)(A, e);
}
function bv({ schema: A, self: e }) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e.RULES.all[t])
      return !0;
  return !1;
}
function _v(A) {
  return typeof A.schema != "boolean";
}
function b_(A, e) {
  const { schema: t, gen: n, opts: i } = A;
  i.$comment && t.$comment && Hv(A), I_(A), H_(A);
  const o = n.const("_errs", oe.default.errors);
  Iv(A, o), n.var(e, (0, kA._)`${o} === ${oe.default.errors}`);
}
function xv(A) {
  (0, kr.checkUnknownRules)(A), __(A);
}
function Iv(A, e) {
  if (A.opts.jtd)
    return qB(A, [], !1, e);
  const t = (0, WB.getSchemaTypes)(A.schema), n = (0, WB.coerceAndCheckDataType)(A, t);
  qB(A, t, !n, e);
}
function __(A) {
  const { schema: e, errSchemaPath: t, opts: n, self: i } = A;
  e.$ref && n.ignoreKeywordsWithRef && (0, kr.schemaHasRulesButRef)(e, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${t}"`);
}
function x_(A) {
  const { schema: e, opts: t } = A;
  e.default !== void 0 && t.useDefaults && t.strictSchema && (0, kr.checkStrictMode)(A, "default is ignored in the schema root");
}
function I_(A) {
  const e = A.schema[A.opts.schemaId];
  e && (A.baseId = (0, v_.resolveUrl)(A.opts.uriResolver, A.baseId, e));
}
function H_(A) {
  if (A.schema.$async && !A.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Hv({ gen: A, schemaEnv: e, schema: t, errSchemaPath: n, opts: i }) {
  const o = t.$comment;
  if (i.$comment === !0)
    A.code((0, kA._)`${oe.default.self}.logger.log(${o})`);
  else if (typeof i.$comment == "function") {
    const l = (0, kA.str)`${n}/$comment`, f = A.scopeValue("root", { ref: e.root });
    A.code((0, kA._)`${oe.default.self}.opts.$comment(${o}, ${l}, ${f}.schema)`);
  }
}
function S_(A) {
  const { gen: e, schemaEnv: t, validateName: n, ValidationError: i, opts: o } = A;
  t.$async ? e.if((0, kA._)`${oe.default.errors} === 0`, () => e.return(oe.default.data), () => e.throw((0, kA._)`new ${i}(${oe.default.vErrors})`)) : (e.assign((0, kA._)`${n}.errors`, oe.default.vErrors), o.unevaluated && L_(A), e.return((0, kA._)`${oe.default.errors} === 0`));
}
function L_({ gen: A, evaluated: e, props: t, items: n }) {
  t instanceof kA.Name && A.assign((0, kA._)`${e}.props`, t), n instanceof kA.Name && A.assign((0, kA._)`${e}.items`, n);
}
function qB(A, e, t, n) {
  const { gen: i, schema: o, data: l, allErrors: f, opts: c, self: h } = A, { RULES: m } = h;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, kr.schemaHasRulesButRef)(o, m))) {
    i.block(() => Tv(A, "$ref", m.all.$ref.definition));
    return;
  }
  c.jtd || T_(A, e), i.block(() => {
    for (const g of m.rules)
      B(g);
    B(m.post);
  });
  function B(g) {
    (0, qd.shouldUseGroup)(o, g) && (g.type ? (i.if((0, ec.checkDataType)(g.type, l, c.strictNumbers)), zB(A, g), e.length === 1 && e[0] === g.type && t && (i.else(), (0, ec.reportTypeError)(A)), i.endIf()) : zB(A, g), f || i.if((0, kA._)`${oe.default.errors} === ${n || 0}`));
  }
}
function zB(A, e) {
  const { gen: t, schema: n, opts: { useDefaults: i } } = A;
  i && (0, m_.assignDefaults)(A, e.type), t.block(() => {
    for (const o of e.rules)
      (0, qd.shouldUseRule)(n, o) && Tv(A, o.keyword, o.definition, e.type);
  });
}
function T_(A, e) {
  A.schemaEnv.meta || !A.opts.strictTypes || (D_(A, e), A.opts.allowUnionTypes || O_(A, e), N_(A, A.dataTypes));
}
function D_(A, e) {
  if (e.length) {
    if (!A.dataTypes.length) {
      A.dataTypes = e;
      return;
    }
    e.forEach((t) => {
      Sv(A.dataTypes, t) || zd(A, `type "${t}" not allowed by context "${A.dataTypes.join(",")}"`);
    }), P_(A, e);
  }
}
function O_(A, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && zd(A, "use allowUnionTypes to allow union type keyword");
}
function N_(A, e) {
  const t = A.self.RULES.all;
  for (const n in t) {
    const i = t[n];
    if (typeof i == "object" && (0, qd.shouldUseRule)(A.schema, i)) {
      const { type: o } = i.definition;
      o.length && !o.some((l) => M_(e, l)) && zd(A, `missing type "${o.join(",")}" for keyword "${n}"`);
    }
  }
}
function M_(A, e) {
  return A.includes(e) || e === "number" && A.includes("integer");
}
function Sv(A, e) {
  return A.includes(e) || e === "integer" && A.includes("number");
}
function P_(A, e) {
  const t = [];
  for (const n of A.dataTypes)
    Sv(e, n) ? t.push(n) : e.includes("integer") && n === "number" && t.push("integer");
  A.dataTypes = t;
}
function zd(A, e) {
  const t = A.schemaEnv.baseId + A.errSchemaPath;
  e += ` at "${t}" (strictTypes)`, (0, kr.checkStrictMode)(A, e, A.opts.strictTypes);
}
class Lv {
  constructor(e, t, n) {
    if ((0, gs.validateKeywordUsage)(e, t, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, kr.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = t.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = t, this.$data)
      this.schemaCode = e.gen.const("vSchema", Dv(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, gs.validSchemaType)(this.schema, t.schemaType, t.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);
    ("code" in t ? t.trackErrors : t.errors !== !1) && (this.errsCount = e.gen.const("_errs", oe.default.errors));
  }
  result(e, t, n) {
    this.failResult((0, kA.not)(e), t, n);
  }
  failResult(e, t, n) {
    this.gen.if(e), n ? n() : this.error(), t ? (this.gen.else(), t(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(e, t) {
    this.failResult((0, kA.not)(e), void 0, t);
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
    this.fail((0, kA._)`${t} !== undefined && (${(0, kA.or)(this.invalid$data(), e)})`);
  }
  error(e, t, n) {
    if (t) {
      this.setParams(t), this._error(e, n), this.setParams({});
      return;
    }
    this._error(e, n);
  }
  _error(e, t) {
    (e ? Jo.reportExtraError : Jo.reportError)(this, this.def.error, t);
  }
  $dataError() {
    (0, Jo.reportError)(this, this.def.$dataError || Jo.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Jo.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(e) {
    this.allErrors || this.gen.if(e);
  }
  setParams(e, t) {
    t ? Object.assign(this.params, e) : this.params = e;
  }
  block$data(e, t, n = kA.nil) {
    this.gen.block(() => {
      this.check$data(e, n), t();
    });
  }
  check$data(e = kA.nil, t = kA.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: o, def: l } = this;
    n.if((0, kA.or)((0, kA._)`${i} === undefined`, t)), e !== kA.nil && n.assign(e, !0), (o.length || l.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== kA.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: t, schemaType: n, def: i, it: o } = this;
    return (0, kA.or)(l(), f());
    function l() {
      if (n.length) {
        if (!(t instanceof kA.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, kA._)`${(0, ec.checkDataTypes)(c, t, o.opts.strictNumbers, ec.DataType.Wrong)}`;
      }
      return kA.nil;
    }
    function f() {
      if (i.validateSchema) {
        const c = e.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, kA._)`!${c}(${t})`;
      }
      return kA.nil;
    }
  }
  subschema(e, t) {
    const n = (0, lh.getSubschema)(this.it, e);
    (0, lh.extendSubschemaData)(n, this.it, e), (0, lh.extendSubschemaMode)(n, e);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return E_(i, t), i;
  }
  mergeEvaluated(e, t) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = kr.mergeEvaluated.props(i, e.props, n.props, t)), n.items !== !0 && e.items !== void 0 && (n.items = kr.mergeEvaluated.items(i, e.items, n.items, t)));
  }
  mergeValidEvaluated(e, t) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(t, () => this.mergeEvaluated(e, kA.Name)), !0;
  }
}
qn.KeywordCxt = Lv;
function Tv(A, e, t, n) {
  const i = new Lv(A, t, e);
  "code" in t ? t.code(i, n) : i.$data && t.validate ? (0, gs.funcKeywordCode)(i, t) : "macro" in t ? (0, gs.macroKeywordCode)(i, t) : (t.compile || t.validate) && (0, gs.funcKeywordCode)(i, t);
}
const K_ = /^\/(?:[^~]|~0|~1)*$/, R_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Dv(A, { dataLevel: e, dataNames: t, dataPathArr: n }) {
  let i, o;
  if (A === "")
    return oe.default.rootData;
  if (A[0] === "/") {
    if (!K_.test(A))
      throw new Error(`Invalid JSON-pointer: ${A}`);
    i = A, o = oe.default.rootData;
  } else {
    const h = R_.exec(A);
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
    h && (o = (0, kA._)`${o}${(0, kA.getProperty)((0, kr.unescapeJsonPointer)(h))}`, l = (0, kA._)`${l} && ${o}`);
  return l;
  function c(h, m) {
    return `Cannot access ${h} ${m} levels up, current level is ${e}`;
  }
}
qn.getData = Dv;
var ks = {};
Object.defineProperty(ks, "__esModule", { value: !0 });
class k_ extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
ks.default = k_;
var po = {};
Object.defineProperty(po, "__esModule", { value: !0 });
const ch = Ft;
class $_ extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`), this.missingRef = (0, ch.resolveUrl)(e, t, n), this.missingSchema = (0, ch.normalizeId)((0, ch.getFullPath)(e, this.missingRef));
  }
}
po.default = $_;
var An = {};
Object.defineProperty(An, "__esModule", { value: !0 });
An.resolveSchema = An.getCompilingSchema = An.resolveRef = An.compileSchema = An.SchemaEnv = void 0;
const Rn = Be, G_ = ks, Wi = pr, Wn = Ft, JB = MA, V_ = qn;
class Hc {
  constructor(e) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (t = e.baseId) !== null && t !== void 0 ? t : (0, Wn.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
An.SchemaEnv = Hc;
function Jd(A) {
  const e = Ov.call(this, A);
  if (e)
    return e;
  const t = (0, Wn.getFullPath)(this.opts.uriResolver, A.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: o } = this.opts, l = new Rn.CodeGen(this.scope, { es5: n, lines: i, ownProperties: o });
  let f;
  A.$async && (f = l.scopeValue("Error", {
    ref: G_.default,
    code: (0, Rn._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = l.scopeName("validate");
  A.validateName = c;
  const h = {
    gen: l,
    allErrors: this.opts.allErrors,
    data: Wi.default.data,
    parentData: Wi.default.parentData,
    parentDataProperty: Wi.default.parentDataProperty,
    dataNames: [Wi.default.data],
    dataPathArr: [Rn.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: l.scopeValue("schema", this.opts.code.source === !0 ? { ref: A.schema, code: (0, Rn.stringify)(A.schema) } : { ref: A.schema }),
    validateName: c,
    ValidationError: f,
    schema: A.schema,
    schemaEnv: A,
    rootId: t,
    baseId: A.baseId || t,
    schemaPath: Rn.nil,
    errSchemaPath: A.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Rn._)`""`,
    opts: this.opts,
    self: this
  };
  let m;
  try {
    this._compilations.add(A), (0, V_.validateFunctionCode)(h), l.optimize(this.opts.code.optimize);
    const B = l.toString();
    m = `${l.scopeRefs(Wi.default.scope)}return ${B}`, this.opts.code.process && (m = this.opts.code.process(m, A));
    const v = new Function(`${Wi.default.self}`, `${Wi.default.scope}`, m)(this, this.scope.get());
    if (this.scope.value(c, { ref: v }), v.errors = null, v.schema = A.schema, v.schemaEnv = A, A.$async && (v.$async = !0), this.opts.code.source === !0 && (v.source = { validateName: c, validateCode: B, scopeValues: l._values }), this.opts.unevaluated) {
      const { props: u, items: C } = h;
      v.evaluated = {
        props: u instanceof Rn.Name ? void 0 : u,
        items: C instanceof Rn.Name ? void 0 : C,
        dynamicProps: u instanceof Rn.Name,
        dynamicItems: C instanceof Rn.Name
      }, v.source && (v.source.evaluated = (0, Rn.stringify)(v.evaluated));
    }
    return A.validate = v, A;
  } catch (B) {
    throw delete A.validate, delete A.validateName, m && this.logger.error("Error compiling schema, function code:", m), B;
  } finally {
    this._compilations.delete(A);
  }
}
An.compileSchema = Jd;
function W_(A, e, t) {
  var n;
  t = (0, Wn.resolveUrl)(this.opts.uriResolver, e, t);
  const i = A.refs[t];
  if (i)
    return i;
  let o = z_.call(this, A, t);
  if (o === void 0) {
    const l = (n = A.localRefs) === null || n === void 0 ? void 0 : n[t], { schemaId: f } = this.opts;
    l && (o = new Hc({ schema: l, schemaId: f, root: A, baseId: e }));
  }
  if (o !== void 0)
    return A.refs[t] = X_.call(this, o);
}
An.resolveRef = W_;
function X_(A) {
  return (0, Wn.inlineRef)(A.schema, this.opts.inlineRefs) ? A.schema : A.validate ? A : Jd.call(this, A);
}
function Ov(A) {
  for (const e of this._compilations)
    if (q_(e, A))
      return e;
}
An.getCompilingSchema = Ov;
function q_(A, e) {
  return A.schema === e.schema && A.root === e.root && A.baseId === e.baseId;
}
function z_(A, e) {
  let t;
  for (; typeof (t = this.refs[e]) == "string"; )
    e = t;
  return t || this.schemas[e] || Sc.call(this, A, e);
}
function Sc(A, e) {
  const t = this.opts.uriResolver.parse(e), n = (0, Wn._getFullPath)(this.opts.uriResolver, t);
  let i = (0, Wn.getFullPath)(this.opts.uriResolver, A.baseId, void 0);
  if (Object.keys(A.schema).length > 0 && n === i)
    return fh.call(this, t, A);
  const o = (0, Wn.normalizeId)(n), l = this.refs[o] || this.schemas[o];
  if (typeof l == "string") {
    const f = Sc.call(this, A, l);
    return typeof (f == null ? void 0 : f.schema) != "object" ? void 0 : fh.call(this, t, f);
  }
  if (typeof (l == null ? void 0 : l.schema) == "object") {
    if (l.validate || Jd.call(this, l), o === (0, Wn.normalizeId)(e)) {
      const { schema: f } = l, { schemaId: c } = this.opts, h = f[c];
      return h && (i = (0, Wn.resolveUrl)(this.opts.uriResolver, i, h)), new Hc({ schema: f, schemaId: c, root: A, baseId: i });
    }
    return fh.call(this, t, l);
  }
}
An.resolveSchema = Sc;
const J_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function fh(A, { baseId: e, schema: t, root: n }) {
  var i;
  if (((i = A.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const f of A.fragment.slice(1).split("/")) {
    if (typeof t == "boolean")
      return;
    const c = t[(0, JB.unescapeFragment)(f)];
    if (c === void 0)
      return;
    t = c;
    const h = typeof t == "object" && t[this.opts.schemaId];
    !J_.has(f) && h && (e = (0, Wn.resolveUrl)(this.opts.uriResolver, e, h));
  }
  let o;
  if (typeof t != "boolean" && t.$ref && !(0, JB.schemaHasRulesButRef)(t, this.RULES)) {
    const f = (0, Wn.resolveUrl)(this.opts.uriResolver, e, t.$ref);
    o = Sc.call(this, n, f);
  }
  const { schemaId: l } = this.opts;
  if (o = o || new Hc({ schema: t, schemaId: l, root: n, baseId: e }), o.schema !== o.root.schema)
    return o;
}
const j_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Y_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Z_ = "object", Ax = [
  "$data"
], ex = {
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
}, tx = !1, nx = {
  $id: j_,
  description: Y_,
  type: Z_,
  required: Ax,
  properties: ex,
  additionalProperties: tx
};
var jd = {}, Lc = { exports: {} };
const rx = {
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
var ix = {
  HEX: rx
};
const { HEX: ax } = ix;
function Nv(A) {
  if (Pv(A, ".") < 3)
    return { host: A, isIPV4: !1 };
  const e = A.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u) || [], [t] = e;
  return t ? { host: sx(t, "."), isIPV4: !0 } : { host: A, isIPV4: !1 };
}
function Jh(A, e = !1) {
  let t = "", n = !0;
  for (const i of A) {
    if (ax[i] === void 0) return;
    i !== "0" && n === !0 && (n = !1), n || (t += i);
  }
  return e && t.length === 0 && (t = "0"), t;
}
function ox(A) {
  let e = 0;
  const t = { error: !1, address: "", zone: "" }, n = [], i = [];
  let o = !1, l = !1, f = !1;
  function c() {
    if (i.length) {
      if (o === !1) {
        const h = Jh(i);
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
  return i.length && (o ? t.zone = i.join("") : f ? n.push(i.join("")) : n.push(Jh(i))), t.address = n.join(""), t;
}
function Mv(A, e = {}) {
  if (Pv(A, ":") < 2)
    return { host: A, isIPV6: !1 };
  const t = ox(A);
  if (t.error)
    return { host: A, isIPV6: !1 };
  {
    let n = t.address, i = t.address;
    return t.zone && (n += "%" + t.zone, i += "%25" + t.zone), { host: n, escapedHost: i, isIPV6: !0 };
  }
}
function sx(A, e) {
  let t = "", n = !0;
  const i = A.length;
  for (let o = 0; o < i; o++) {
    const l = A[o];
    l === "0" && n ? (o + 1 <= i && A[o + 1] === e || o + 1 === i) && (t += l, n = !1) : (l === e ? n = !0 : n = !1, t += l);
  }
  return t;
}
function Pv(A, e) {
  let t = 0;
  for (let n = 0; n < A.length; n++)
    A[n] === e && t++;
  return t;
}
const jB = /^\.\.?\//u, YB = /^\/\.(?:\/|$)/u, ZB = /^\/\.\.(?:\/|$)/u, ux = /^\/?(?:.|\n)*?(?=\/|$)/u;
function lx(A) {
  const e = [];
  for (; A.length; )
    if (A.match(jB))
      A = A.replace(jB, "");
    else if (A.match(YB))
      A = A.replace(YB, "/");
    else if (A.match(ZB))
      A = A.replace(ZB, "/"), e.pop();
    else if (A === "." || A === "..")
      A = "";
    else {
      const t = A.match(ux);
      if (t) {
        const n = t[0];
        A = A.slice(n.length), e.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return e.join("");
}
function cx(A, e) {
  const t = e !== !0 ? escape : unescape;
  return A.scheme !== void 0 && (A.scheme = t(A.scheme)), A.userinfo !== void 0 && (A.userinfo = t(A.userinfo)), A.host !== void 0 && (A.host = t(A.host)), A.path !== void 0 && (A.path = t(A.path)), A.query !== void 0 && (A.query = t(A.query)), A.fragment !== void 0 && (A.fragment = t(A.fragment)), A;
}
function fx(A, e) {
  const t = [];
  if (A.userinfo !== void 0 && (t.push(A.userinfo), t.push("@")), A.host !== void 0) {
    let n = unescape(A.host);
    const i = Nv(n);
    if (i.isIPV4)
      n = i.host;
    else {
      const o = Mv(i.host, { isIPV4: !1 });
      o.isIPV6 === !0 ? n = `[${o.escapedHost}]` : n = A.host;
    }
    t.push(n);
  }
  return (typeof A.port == "number" || typeof A.port == "string") && (t.push(":"), t.push(String(A.port))), t.length ? t.join("") : void 0;
}
var hx = {
  recomposeAuthority: fx,
  normalizeComponentEncoding: cx,
  removeDotSegments: lx,
  normalizeIPv4: Nv,
  normalizeIPv6: Mv,
  stringArrayToHexStripped: Jh
};
const dx = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, px = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Kv(A) {
  return typeof A.secure == "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss";
}
function Rv(A) {
  return A.host || (A.error = A.error || "HTTP URIs must have a host."), A;
}
function kv(A) {
  const e = String(A.scheme).toLowerCase() === "https";
  return (A.port === (e ? 443 : 80) || A.port === "") && (A.port = void 0), A.path || (A.path = "/"), A;
}
function gx(A) {
  return A.secure = Kv(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A;
}
function Bx(A) {
  if ((A.port === (Kv(A) ? 443 : 80) || A.port === "") && (A.port = void 0), typeof A.secure == "boolean" && (A.scheme = A.secure ? "wss" : "ws", A.secure = void 0), A.resourceName) {
    const [e, t] = A.resourceName.split("?");
    A.path = e && e !== "/" ? e : void 0, A.query = t, A.resourceName = void 0;
  }
  return A.fragment = void 0, A;
}
function wx(A, e) {
  if (!A.path)
    return A.error = "URN can not be parsed", A;
  const t = A.path.match(px);
  if (t) {
    const n = e.scheme || A.scheme || "urn";
    A.nid = t[1].toLowerCase(), A.nss = t[2];
    const i = `${n}:${e.nid || A.nid}`, o = Yd[i];
    A.path = void 0, o && (A = o.parse(A, e));
  } else
    A.error = A.error || "URN can not be parsed.";
  return A;
}
function mx(A, e) {
  const t = e.scheme || A.scheme || "urn", n = A.nid.toLowerCase(), i = `${t}:${e.nid || n}`, o = Yd[i];
  o && (A = o.serialize(A, e));
  const l = A, f = A.nss;
  return l.path = `${n || e.nid}:${f}`, e.skipEscape = !0, l;
}
function vx(A, e) {
  const t = A;
  return t.uuid = t.nss, t.nss = void 0, !e.tolerant && (!t.uuid || !dx.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
}
function yx(A) {
  const e = A;
  return e.nss = (A.uuid || "").toLowerCase(), e;
}
const $v = {
  scheme: "http",
  domainHost: !0,
  parse: Rv,
  serialize: kv
}, Cx = {
  scheme: "https",
  domainHost: $v.domainHost,
  parse: Rv,
  serialize: kv
}, Rl = {
  scheme: "ws",
  domainHost: !0,
  parse: gx,
  serialize: Bx
}, Qx = {
  scheme: "wss",
  domainHost: Rl.domainHost,
  parse: Rl.parse,
  serialize: Rl.serialize
}, Fx = {
  scheme: "urn",
  parse: wx,
  serialize: mx,
  skipNormalize: !0
}, Ux = {
  scheme: "urn:uuid",
  parse: vx,
  serialize: yx,
  skipNormalize: !0
}, Yd = {
  http: $v,
  https: Cx,
  ws: Rl,
  wss: Qx,
  urn: Fx,
  "urn:uuid": Ux
};
var Ex = Yd;
const { normalizeIPv6: bx, normalizeIPv4: _x, removeDotSegments: is, recomposeAuthority: xx, normalizeComponentEncoding: tl } = hx, Zd = Ex;
function Ix(A, e) {
  return typeof A == "string" ? A = cr(Gr(A, e), e) : typeof A == "object" && (A = Gr(cr(A, e), e)), A;
}
function Hx(A, e, t) {
  const n = Object.assign({ scheme: "null" }, t), i = Gv(Gr(A, n), Gr(e, n), n, !0);
  return cr(i, { ...n, skipEscape: !0 });
}
function Gv(A, e, t, n) {
  const i = {};
  return n || (A = Gr(cr(A, t), t), e = Gr(cr(e, t), t)), t = t || {}, !t.tolerant && e.scheme ? (i.scheme = e.scheme, i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = is(e.path || ""), i.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = is(e.path || ""), i.query = e.query) : (e.path ? (e.path.charAt(0) === "/" ? i.path = is(e.path) : ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path ? i.path = "/" + e.path : A.path ? i.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + e.path : i.path = e.path, i.path = is(i.path)), i.query = e.query) : (i.path = A.path, e.query !== void 0 ? i.query = e.query : i.query = A.query), i.userinfo = A.userinfo, i.host = A.host, i.port = A.port), i.scheme = A.scheme), i.fragment = e.fragment, i;
}
function Sx(A, e, t) {
  return typeof A == "string" ? (A = unescape(A), A = cr(tl(Gr(A, t), !0), { ...t, skipEscape: !0 })) : typeof A == "object" && (A = cr(tl(A, !0), { ...t, skipEscape: !0 })), typeof e == "string" ? (e = unescape(e), e = cr(tl(Gr(e, t), !0), { ...t, skipEscape: !0 })) : typeof e == "object" && (e = cr(tl(e, !0), { ...t, skipEscape: !0 })), A.toLowerCase() === e.toLowerCase();
}
function cr(A, e) {
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
  }, n = Object.assign({}, e), i = [], o = Zd[(n.scheme || t.scheme || "").toLowerCase()];
  o && o.serialize && o.serialize(t, n), t.path !== void 0 && (n.skipEscape ? t.path = unescape(t.path) : (t.path = escape(t.path), t.scheme !== void 0 && (t.path = t.path.split("%3A").join(":")))), n.reference !== "suffix" && t.scheme && (i.push(t.scheme), i.push(":"));
  const l = xx(t, n);
  if (l !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(l), t.path && t.path.charAt(0) !== "/" && i.push("/")), t.path !== void 0) {
    let f = t.path;
    !n.absolutePath && (!o || !o.absolutePath) && (f = is(f)), l === void 0 && (f = f.replace(/^\/\//u, "/%2F")), i.push(f);
  }
  return t.query !== void 0 && (i.push("?"), i.push(t.query)), t.fragment !== void 0 && (i.push("#"), i.push(t.fragment)), i.join("");
}
const Lx = Array.from({ length: 127 }, (A, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
function Tx(A) {
  let e = 0;
  for (let t = 0, n = A.length; t < n; ++t)
    if (e = A.charCodeAt(t), e > 126 || Lx[e])
      return !0;
  return !1;
}
const Dx = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Gr(A, e) {
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
  const l = A.match(Dx);
  if (l) {
    if (n.scheme = l[1], n.userinfo = l[3], n.host = l[4], n.port = parseInt(l[5], 10), n.path = l[6] || "", n.query = l[7], n.fragment = l[8], isNaN(n.port) && (n.port = l[5]), n.host) {
      const c = _x(n.host);
      if (c.isIPV4 === !1) {
        const h = bx(c.host, { isIPV4: !1 });
        n.host = h.host.toLowerCase(), o = h.isIPV6;
      } else
        n.host = c.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && !n.path && n.query === void 0 ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
    const f = Zd[(t.scheme || n.scheme || "").toLowerCase()];
    if (!t.unicodeSupport && (!f || !f.unicodeSupport) && n.host && (t.domainHost || f && f.domainHost) && o === !1 && Tx(n.host))
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
const Ap = {
  SCHEMES: Zd,
  normalize: Ix,
  resolve: Hx,
  resolveComponents: Gv,
  equal: Sx,
  serialize: cr,
  parse: Gr
};
Lc.exports = Ap;
Lc.exports.default = Ap;
Lc.exports.fastUri = Ap;
var Ox = Lc.exports;
Object.defineProperty(jd, "__esModule", { value: !0 });
const Vv = Ox;
Vv.code = 'require("ajv/dist/runtime/uri").default';
jd.default = Vv;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.CodeGen = A.Name = A.nil = A.stringify = A.str = A._ = A.KeywordCxt = void 0;
  var e = qn;
  Object.defineProperty(A, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var t = Be;
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
  const n = ks, i = po, o = aa, l = An, f = Be, c = Ft, h = ft, m = MA, B = nx, g = jd, v = (iA, T) => new RegExp(iA, T);
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
  }, H = 200;
  function O(iA) {
    var T, AA, J, L, R, nA, FA, UA, qA, te, zA, KA, oA, mA, EA, ee, we, Fe, Ye, Le, ke, Me, be, Nt, Et;
    const Mt = iA.strict, bt = (T = iA.code) === null || T === void 0 ? void 0 : T.optimize, wt = bt === !0 || bt === void 0 ? 1 : bt || 0, fn = (J = (AA = iA.code) === null || AA === void 0 ? void 0 : AA.regExp) !== null && J !== void 0 ? J : v, mr = (L = iA.uriResolver) !== null && L !== void 0 ? L : g.default;
    return {
      strictSchema: (nA = (R = iA.strictSchema) !== null && R !== void 0 ? R : Mt) !== null && nA !== void 0 ? nA : !0,
      strictNumbers: (UA = (FA = iA.strictNumbers) !== null && FA !== void 0 ? FA : Mt) !== null && UA !== void 0 ? UA : !0,
      strictTypes: (te = (qA = iA.strictTypes) !== null && qA !== void 0 ? qA : Mt) !== null && te !== void 0 ? te : "log",
      strictTuples: (KA = (zA = iA.strictTuples) !== null && zA !== void 0 ? zA : Mt) !== null && KA !== void 0 ? KA : "log",
      strictRequired: (mA = (oA = iA.strictRequired) !== null && oA !== void 0 ? oA : Mt) !== null && mA !== void 0 ? mA : !1,
      code: iA.code ? { ...iA.code, optimize: wt, regExp: fn } : { optimize: wt, regExp: fn },
      loopRequired: (EA = iA.loopRequired) !== null && EA !== void 0 ? EA : H,
      loopEnum: (ee = iA.loopEnum) !== null && ee !== void 0 ? ee : H,
      meta: (we = iA.meta) !== null && we !== void 0 ? we : !0,
      messages: (Fe = iA.messages) !== null && Fe !== void 0 ? Fe : !0,
      inlineRefs: (Ye = iA.inlineRefs) !== null && Ye !== void 0 ? Ye : !0,
      schemaId: (Le = iA.schemaId) !== null && Le !== void 0 ? Le : "$id",
      addUsedSchema: (ke = iA.addUsedSchema) !== null && ke !== void 0 ? ke : !0,
      validateSchema: (Me = iA.validateSchema) !== null && Me !== void 0 ? Me : !0,
      validateFormats: (be = iA.validateFormats) !== null && be !== void 0 ? be : !0,
      unicodeRegExp: (Nt = iA.unicodeRegExp) !== null && Nt !== void 0 ? Nt : !0,
      int32range: (Et = iA.int32range) !== null && Et !== void 0 ? Et : !0,
      uriResolver: mr
    };
  }
  class _ {
    constructor(T = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), T = this.opts = { ...T, ...O(T) };
      const { es5: AA, lines: J } = this.opts.code;
      this.scope = new f.ValueScope({ scope: {}, prefixes: C, es5: AA, lines: J }), this.logger = OA(T.logger);
      const L = T.validateFormats;
      T.validateFormats = !1, this.RULES = (0, o.getRules)(), M.call(this, F, T, "NOT SUPPORTED"), M.call(this, U, T, "DEPRECATED", "warn"), this._metaOpts = gA.call(this), T.formats && cA.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), T.keywords && sA.call(this, T.keywords), typeof T.meta == "object" && this.addMetaSchema(T.meta), z.call(this), T.validateFormats = L;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: T, meta: AA, schemaId: J } = this.opts;
      let L = B;
      J === "id" && (L = { ...B }, L.id = L.$id, delete L.$id), AA && T && this.addMetaSchema(L, L[J], !1);
    }
    defaultMeta() {
      const { meta: T, schemaId: AA } = this.opts;
      return this.opts.defaultMeta = typeof T == "object" ? T[AA] || T : void 0;
    }
    validate(T, AA) {
      let J;
      if (typeof T == "string") {
        if (J = this.getSchema(T), !J)
          throw new Error(`no schema with key or ref "${T}"`);
      } else
        J = this.compile(T);
      const L = J(AA);
      return "$async" in J || (this.errors = J.errors), L;
    }
    compile(T, AA) {
      const J = this._addSchema(T, AA);
      return J.validate || this._compileSchemaEnv(J);
    }
    compileAsync(T, AA) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: J } = this.opts;
      return L.call(this, T, AA);
      async function L(te, zA) {
        await R.call(this, te.$schema);
        const KA = this._addSchema(te, zA);
        return KA.validate || nA.call(this, KA);
      }
      async function R(te) {
        te && !this.getSchema(te) && await L.call(this, { $ref: te }, !0);
      }
      async function nA(te) {
        try {
          return this._compileSchemaEnv(te);
        } catch (zA) {
          if (!(zA instanceof i.default))
            throw zA;
          return FA.call(this, zA), await UA.call(this, zA.missingSchema), nA.call(this, te);
        }
      }
      function FA({ missingSchema: te, missingRef: zA }) {
        if (this.refs[te])
          throw new Error(`AnySchema ${te} is loaded but ${zA} cannot be resolved`);
      }
      async function UA(te) {
        const zA = await qA.call(this, te);
        this.refs[te] || await R.call(this, zA.$schema), this.refs[te] || this.addSchema(zA, te, AA);
      }
      async function qA(te) {
        const zA = this._loading[te];
        if (zA)
          return zA;
        try {
          return await (this._loading[te] = J(te));
        } finally {
          delete this._loading[te];
        }
      }
    }
    // Adds schema to the instance
    addSchema(T, AA, J, L = this.opts.validateSchema) {
      if (Array.isArray(T)) {
        for (const nA of T)
          this.addSchema(nA, void 0, J, L);
        return this;
      }
      let R;
      if (typeof T == "object") {
        const { schemaId: nA } = this.opts;
        if (R = T[nA], R !== void 0 && typeof R != "string")
          throw new Error(`schema ${nA} must be string`);
      }
      return AA = (0, c.normalizeId)(AA || R), this._checkUnique(AA), this.schemas[AA] = this._addSchema(T, J, AA, L, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(T, AA, J = this.opts.validateSchema) {
      return this.addSchema(T, AA, !0, J), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(T, AA) {
      if (typeof T == "boolean")
        return !0;
      let J;
      if (J = T.$schema, J !== void 0 && typeof J != "string")
        throw new Error("$schema must be a string");
      if (J = J || this.opts.defaultMeta || this.defaultMeta(), !J)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const L = this.validate(J, T);
      if (!L && AA) {
        const R = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(R);
        else
          throw new Error(R);
      }
      return L;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(T) {
      let AA;
      for (; typeof (AA = K.call(this, T)) == "string"; )
        T = AA;
      if (AA === void 0) {
        const { schemaId: J } = this.opts, L = new l.SchemaEnv({ schema: {}, schemaId: J });
        if (AA = l.resolveSchema.call(this, L, T), !AA)
          return;
        this.refs[T] = AA;
      }
      return AA.validate || this._compileSchemaEnv(AA);
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
          const AA = K.call(this, T);
          return typeof AA == "object" && this._cache.delete(AA.schema), delete this.schemas[T], delete this.refs[T], this;
        }
        case "object": {
          const AA = T;
          this._cache.delete(AA);
          let J = T[this.opts.schemaId];
          return J && (J = (0, c.normalizeId)(J), delete this.schemas[J], delete this.refs[J]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(T) {
      for (const AA of T)
        this.addKeyword(AA);
      return this;
    }
    addKeyword(T, AA) {
      let J;
      if (typeof T == "string")
        J = T, typeof AA == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), AA.keyword = J);
      else if (typeof T == "object" && AA === void 0) {
        if (AA = T, J = AA.keyword, Array.isArray(J) && !J.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (W.call(this, J, AA), !AA)
        return (0, m.eachItem)(J, (R) => yA.call(this, R)), this;
      fA.call(this, AA);
      const L = {
        ...AA,
        type: (0, h.getJSONTypes)(AA.type),
        schemaType: (0, h.getJSONTypes)(AA.schemaType)
      };
      return (0, m.eachItem)(J, L.type.length === 0 ? (R) => yA.call(this, R, L) : (R) => L.type.forEach((nA) => yA.call(this, R, L, nA))), this;
    }
    getKeyword(T) {
      const AA = this.RULES.all[T];
      return typeof AA == "object" ? AA.definition : !!AA;
    }
    // Remove keyword
    removeKeyword(T) {
      const { RULES: AA } = this;
      delete AA.keywords[T], delete AA.all[T];
      for (const J of AA.rules) {
        const L = J.rules.findIndex((R) => R.keyword === T);
        L >= 0 && J.rules.splice(L, 1);
      }
      return this;
    }
    // Add format
    addFormat(T, AA) {
      return typeof AA == "string" && (AA = new RegExp(AA)), this.formats[T] = AA, this;
    }
    errorsText(T = this.errors, { separator: AA = ", ", dataVar: J = "data" } = {}) {
      return !T || T.length === 0 ? "No errors" : T.map((L) => `${J}${L.instancePath} ${L.message}`).reduce((L, R) => L + AA + R);
    }
    $dataMetaSchema(T, AA) {
      const J = this.RULES.all;
      T = JSON.parse(JSON.stringify(T));
      for (const L of AA) {
        const R = L.split("/").slice(1);
        let nA = T;
        for (const FA of R)
          nA = nA[FA];
        for (const FA in J) {
          const UA = J[FA];
          if (typeof UA != "object")
            continue;
          const { $data: qA } = UA.definition, te = nA[FA];
          qA && te && (nA[FA] = xA(te));
        }
      }
      return T;
    }
    _removeAllSchemas(T, AA) {
      for (const J in T) {
        const L = T[J];
        (!AA || AA.test(J)) && (typeof L == "string" ? delete T[J] : L && !L.meta && (this._cache.delete(L.schema), delete T[J]));
      }
    }
    _addSchema(T, AA, J, L = this.opts.validateSchema, R = this.opts.addUsedSchema) {
      let nA;
      const { schemaId: FA } = this.opts;
      if (typeof T == "object")
        nA = T[FA];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof T != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let UA = this._cache.get(T);
      if (UA !== void 0)
        return UA;
      J = (0, c.normalizeId)(nA || J);
      const qA = c.getSchemaRefs.call(this, T, J);
      return UA = new l.SchemaEnv({ schema: T, schemaId: FA, meta: AA, baseId: J, localRefs: qA }), this._cache.set(UA.schema, UA), R && !J.startsWith("#") && (J && this._checkUnique(J), this.refs[J] = UA), L && this.validateSchema(T, !0), UA;
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
      const AA = this.opts;
      this.opts = this._metaOpts;
      try {
        l.compileSchema.call(this, T);
      } finally {
        this.opts = AA;
      }
    }
  }
  _.ValidationError = n.default, _.MissingRefError = i.default, A.default = _;
  function M(iA, T, AA, J = "error") {
    for (const L in iA) {
      const R = L;
      R in T && this.logger[J](`${AA}: option ${L}. ${iA[R]}`);
    }
  }
  function K(iA) {
    return iA = (0, c.normalizeId)(iA), this.schemas[iA] || this.refs[iA];
  }
  function z() {
    const iA = this.opts.schemas;
    if (iA)
      if (Array.isArray(iA))
        this.addSchema(iA);
      else
        for (const T in iA)
          this.addSchema(iA[T], T);
  }
  function cA() {
    for (const iA in this.opts.formats) {
      const T = this.opts.formats[iA];
      T && this.addFormat(iA, T);
    }
  }
  function sA(iA) {
    if (Array.isArray(iA)) {
      this.addVocabulary(iA);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const T in iA) {
      const AA = iA[T];
      AA.keyword || (AA.keyword = T), this.addKeyword(AA);
    }
  }
  function gA() {
    const iA = { ...this.opts };
    for (const T of u)
      delete iA[T];
    return iA;
  }
  const QA = { log() {
  }, warn() {
  }, error() {
  } };
  function OA(iA) {
    if (iA === !1)
      return QA;
    if (iA === void 0)
      return console;
    if (iA.log && iA.warn && iA.error)
      return iA;
    throw new Error("logger must implement log, warn and error methods");
  }
  const _A = /^[a-z_$][a-z0-9_$:-]*$/i;
  function W(iA, T) {
    const { RULES: AA } = this;
    if ((0, m.eachItem)(iA, (J) => {
      if (AA.keywords[J])
        throw new Error(`Keyword ${J} is already defined`);
      if (!_A.test(J))
        throw new Error(`Keyword ${J} has invalid name`);
    }), !!T && T.$data && !("code" in T || "validate" in T))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function yA(iA, T, AA) {
    var J;
    const L = T == null ? void 0 : T.post;
    if (AA && L)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: R } = this;
    let nA = L ? R.post : R.rules.find(({ type: UA }) => UA === AA);
    if (nA || (nA = { type: AA, rules: [] }, R.rules.push(nA)), R.keywords[iA] = !0, !T)
      return;
    const FA = {
      keyword: iA,
      definition: {
        ...T,
        type: (0, h.getJSONTypes)(T.type),
        schemaType: (0, h.getJSONTypes)(T.schemaType)
      }
    };
    T.before ? eA.call(this, nA, FA, T.before) : nA.rules.push(FA), R.all[iA] = FA, (J = T.implements) === null || J === void 0 || J.forEach((UA) => this.addKeyword(UA));
  }
  function eA(iA, T, AA) {
    const J = iA.rules.findIndex((L) => L.keyword === AA);
    J >= 0 ? iA.rules.splice(J, 0, T) : (iA.rules.push(T), this.logger.warn(`rule ${AA} is not defined`));
  }
  function fA(iA) {
    let { metaSchema: T } = iA;
    T !== void 0 && (iA.$data && this.opts.$data && (T = xA(T)), iA.validateSchema = this.compile(T, !0));
  }
  const bA = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function xA(iA) {
    return { anyOf: [iA, bA] };
  }
})(rv);
var ep = {}, tp = {}, np = {};
Object.defineProperty(np, "__esModule", { value: !0 });
const Nx = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
np.default = Nx;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.callRef = oa.getValidate = void 0;
const Mx = po, Aw = ge, Yt = Be, Na = pr, ew = An, nl = MA, Px = {
  keyword: "$ref",
  schemaType: "string",
  code(A) {
    const { gen: e, schema: t, it: n } = A, { baseId: i, schemaEnv: o, validateName: l, opts: f, self: c } = n, { root: h } = o;
    if ((t === "#" || t === "#/") && i === h.baseId)
      return B();
    const m = ew.resolveRef.call(c, h, i, t);
    if (m === void 0)
      throw new Mx.default(n.opts.uriResolver, i, t);
    if (m instanceof ew.SchemaEnv)
      return g(m);
    return v(m);
    function B() {
      if (o === h)
        return kl(A, l, o, o.$async);
      const u = e.scopeValue("root", { ref: h });
      return kl(A, (0, Yt._)`${u}.validate`, h, h.$async);
    }
    function g(u) {
      const C = Wv(A, u);
      kl(A, C, u, u.$async);
    }
    function v(u) {
      const C = e.scopeValue("schema", f.code.source === !0 ? { ref: u, code: (0, Yt.stringify)(u) } : { ref: u }), F = e.name("valid"), U = A.subschema({
        schema: u,
        dataTypes: [],
        schemaPath: Yt.nil,
        topSchemaRef: C,
        errSchemaPath: t
      }, F);
      A.mergeEvaluated(U), A.ok(F);
    }
  }
};
function Wv(A, e) {
  const { gen: t } = A;
  return e.validate ? t.scopeValue("validate", { ref: e.validate }) : (0, Yt._)`${t.scopeValue("wrapper", { ref: e })}.validate`;
}
oa.getValidate = Wv;
function kl(A, e, t, n) {
  const { gen: i, it: o } = A, { allErrors: l, schemaEnv: f, opts: c } = o, h = c.passContext ? Na.default.this : Yt.nil;
  n ? m() : B();
  function m() {
    if (!f.$async)
      throw new Error("async schema referenced by sync schema");
    const u = i.let("valid");
    i.try(() => {
      i.code((0, Yt._)`await ${(0, Aw.callValidateCode)(A, e, h)}`), v(e), l || i.assign(u, !0);
    }, (C) => {
      i.if((0, Yt._)`!(${C} instanceof ${o.ValidationError})`, () => i.throw(C)), g(C), l || i.assign(u, !1);
    }), A.ok(u);
  }
  function B() {
    A.result((0, Aw.callValidateCode)(A, e, h), () => v(e), () => g(e));
  }
  function g(u) {
    const C = (0, Yt._)`${u}.errors`;
    i.assign(Na.default.vErrors, (0, Yt._)`${Na.default.vErrors} === null ? ${C} : ${Na.default.vErrors}.concat(${C})`), i.assign(Na.default.errors, (0, Yt._)`${Na.default.vErrors}.length`);
  }
  function v(u) {
    var C;
    if (!o.opts.unevaluated)
      return;
    const F = (C = t == null ? void 0 : t.validate) === null || C === void 0 ? void 0 : C.evaluated;
    if (o.props !== !0)
      if (F && !F.dynamicProps)
        F.props !== void 0 && (o.props = nl.mergeEvaluated.props(i, F.props, o.props));
      else {
        const U = i.var("props", (0, Yt._)`${u}.evaluated.props`);
        o.props = nl.mergeEvaluated.props(i, U, o.props, Yt.Name);
      }
    if (o.items !== !0)
      if (F && !F.dynamicItems)
        F.items !== void 0 && (o.items = nl.mergeEvaluated.items(i, F.items, o.items));
      else {
        const U = i.var("items", (0, Yt._)`${u}.evaluated.items`);
        o.items = nl.mergeEvaluated.items(i, U, o.items, Yt.Name);
      }
  }
}
oa.callRef = kl;
oa.default = Px;
Object.defineProperty(tp, "__esModule", { value: !0 });
const Kx = np, Rx = oa, kx = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Kx.default,
  Rx.default
];
tp.default = kx;
var rp = {}, ip = {};
Object.defineProperty(ip, "__esModule", { value: !0 });
const tc = Be, di = tc.operators, nc = {
  maximum: { okStr: "<=", ok: di.LTE, fail: di.GT },
  minimum: { okStr: ">=", ok: di.GTE, fail: di.LT },
  exclusiveMaximum: { okStr: "<", ok: di.LT, fail: di.GTE },
  exclusiveMinimum: { okStr: ">", ok: di.GT, fail: di.LTE }
}, $x = {
  message: ({ keyword: A, schemaCode: e }) => (0, tc.str)`must be ${nc[A].okStr} ${e}`,
  params: ({ keyword: A, schemaCode: e }) => (0, tc._)`{comparison: ${nc[A].okStr}, limit: ${e}}`
}, Gx = {
  keyword: Object.keys(nc),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: $x,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A;
    A.fail$data((0, tc._)`${t} ${nc[e].fail} ${n} || isNaN(${t})`);
  }
};
ip.default = Gx;
var ap = {};
Object.defineProperty(ap, "__esModule", { value: !0 });
const Bs = Be, Vx = {
  message: ({ schemaCode: A }) => (0, Bs.str)`must be multiple of ${A}`,
  params: ({ schemaCode: A }) => (0, Bs._)`{multipleOf: ${A}}`
}, Wx = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Vx,
  code(A) {
    const { gen: e, data: t, schemaCode: n, it: i } = A, o = i.opts.multipleOfPrecision, l = e.let("res"), f = o ? (0, Bs._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${o}` : (0, Bs._)`${l} !== parseInt(${l})`;
    A.fail$data((0, Bs._)`(${n} === 0 || (${l} = ${t}/${n}, ${f}))`);
  }
};
ap.default = Wx;
var op = {}, sp = {};
Object.defineProperty(sp, "__esModule", { value: !0 });
function Xv(A) {
  const e = A.length;
  let t = 0, n = 0, i;
  for (; n < e; )
    t++, i = A.charCodeAt(n++), i >= 55296 && i <= 56319 && n < e && (i = A.charCodeAt(n), (i & 64512) === 56320 && n++);
  return t;
}
sp.default = Xv;
Xv.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(op, "__esModule", { value: !0 });
const ji = Be, Xx = MA, qx = sp, zx = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxLength" ? "more" : "fewer";
    return (0, ji.str)`must NOT have ${t} than ${e} characters`;
  },
  params: ({ schemaCode: A }) => (0, ji._)`{limit: ${A}}`
}, Jx = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: zx,
  code(A) {
    const { keyword: e, data: t, schemaCode: n, it: i } = A, o = e === "maxLength" ? ji.operators.GT : ji.operators.LT, l = i.opts.unicode === !1 ? (0, ji._)`${t}.length` : (0, ji._)`${(0, Xx.useFunc)(A.gen, qx.default)}(${t})`;
    A.fail$data((0, ji._)`${l} ${o} ${n}`);
  }
};
op.default = Jx;
var up = {};
Object.defineProperty(up, "__esModule", { value: !0 });
const jx = ge, rc = Be, Yx = {
  message: ({ schemaCode: A }) => (0, rc.str)`must match pattern "${A}"`,
  params: ({ schemaCode: A }) => (0, rc._)`{pattern: ${A}}`
}, Zx = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Yx,
  code(A) {
    const { data: e, $data: t, schema: n, schemaCode: i, it: o } = A, l = o.opts.unicodeRegExp ? "u" : "", f = t ? (0, rc._)`(new RegExp(${i}, ${l}))` : (0, jx.usePattern)(A, n);
    A.fail$data((0, rc._)`!${f}.test(${e})`);
  }
};
up.default = Zx;
var lp = {};
Object.defineProperty(lp, "__esModule", { value: !0 });
const ws = Be, AI = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxProperties" ? "more" : "fewer";
    return (0, ws.str)`must NOT have ${t} than ${e} properties`;
  },
  params: ({ schemaCode: A }) => (0, ws._)`{limit: ${A}}`
}, eI = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: AI,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxProperties" ? ws.operators.GT : ws.operators.LT;
    A.fail$data((0, ws._)`Object.keys(${t}).length ${i} ${n}`);
  }
};
lp.default = eI;
var cp = {};
Object.defineProperty(cp, "__esModule", { value: !0 });
const jo = ge, ms = Be, tI = MA, nI = {
  message: ({ params: { missingProperty: A } }) => (0, ms.str)`must have required property '${A}'`,
  params: ({ params: { missingProperty: A } }) => (0, ms._)`{missingProperty: ${A}}`
}, rI = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: nI,
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
          (0, tI.checkStrictMode)(l, U, l.opts.strictRequired);
        }
    }
    function h() {
      if (c || o)
        A.block$data(ms.nil, B);
      else
        for (const v of t)
          (0, jo.checkReportMissingProp)(A, v);
    }
    function m() {
      const v = e.let("missing");
      if (c || o) {
        const u = e.let("valid", !0);
        A.block$data(u, () => g(v, u)), A.ok(u);
      } else
        e.if((0, jo.checkMissingProp)(A, t, v)), (0, jo.reportMissingProp)(A, v), e.else();
    }
    function B() {
      e.forOf("prop", n, (v) => {
        A.setParams({ missingProperty: v }), e.if((0, jo.noPropertyInData)(e, i, v, f.ownProperties), () => A.error());
      });
    }
    function g(v, u) {
      A.setParams({ missingProperty: v }), e.forOf(v, n, () => {
        e.assign(u, (0, jo.propertyInData)(e, i, v, f.ownProperties)), e.if((0, ms.not)(u), () => {
          A.error(), e.break();
        });
      }, ms.nil);
    }
  }
};
cp.default = rI;
var fp = {};
Object.defineProperty(fp, "__esModule", { value: !0 });
const vs = Be, iI = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxItems" ? "more" : "fewer";
    return (0, vs.str)`must NOT have ${t} than ${e} items`;
  },
  params: ({ schemaCode: A }) => (0, vs._)`{limit: ${A}}`
}, aI = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: iI,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxItems" ? vs.operators.GT : vs.operators.LT;
    A.fail$data((0, vs._)`${t}.length ${i} ${n}`);
  }
};
fp.default = aI;
var hp = {}, $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const qv = vv;
qv.code = 'require("ajv/dist/runtime/equal").default';
$s.default = qv;
Object.defineProperty(hp, "__esModule", { value: !0 });
const hh = ft, Ct = Be, oI = MA, sI = $s, uI = {
  message: ({ params: { i: A, j: e } }) => (0, Ct.str)`must NOT have duplicate items (items ## ${e} and ${A} are identical)`,
  params: ({ params: { i: A, j: e } }) => (0, Ct._)`{i: ${A}, j: ${e}}`
}, lI = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: uI,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, parentSchema: o, schemaCode: l, it: f } = A;
    if (!n && !i)
      return;
    const c = e.let("valid"), h = o.items ? (0, hh.getSchemaTypes)(o.items) : [];
    A.block$data(c, m, (0, Ct._)`${l} === false`), A.ok(c);
    function m() {
      const u = e.let("i", (0, Ct._)`${t}.length`), C = e.let("j");
      A.setParams({ i: u, j: C }), e.assign(c, !0), e.if((0, Ct._)`${u} > 1`, () => (B() ? g : v)(u, C));
    }
    function B() {
      return h.length > 0 && !h.some((u) => u === "object" || u === "array");
    }
    function g(u, C) {
      const F = e.name("item"), U = (0, hh.checkDataTypes)(h, F, f.opts.strictNumbers, hh.DataType.Wrong), H = e.const("indices", (0, Ct._)`{}`);
      e.for((0, Ct._)`;${u}--;`, () => {
        e.let(F, (0, Ct._)`${t}[${u}]`), e.if(U, (0, Ct._)`continue`), h.length > 1 && e.if((0, Ct._)`typeof ${F} == "string"`, (0, Ct._)`${F} += "_"`), e.if((0, Ct._)`typeof ${H}[${F}] == "number"`, () => {
          e.assign(C, (0, Ct._)`${H}[${F}]`), A.error(), e.assign(c, !1).break();
        }).code((0, Ct._)`${H}[${F}] = ${u}`);
      });
    }
    function v(u, C) {
      const F = (0, oI.useFunc)(e, sI.default), U = e.name("outer");
      e.label(U).for((0, Ct._)`;${u}--;`, () => e.for((0, Ct._)`${C} = ${u}; ${C}--;`, () => e.if((0, Ct._)`${F}(${t}[${u}], ${t}[${C}])`, () => {
        A.error(), e.assign(c, !1).break(U);
      })));
    }
  }
};
hp.default = lI;
var dp = {};
Object.defineProperty(dp, "__esModule", { value: !0 });
const jh = Be, cI = MA, fI = $s, hI = {
  message: "must be equal to constant",
  params: ({ schemaCode: A }) => (0, jh._)`{allowedValue: ${A}}`
}, dI = {
  keyword: "const",
  $data: !0,
  error: hI,
  code(A) {
    const { gen: e, data: t, $data: n, schemaCode: i, schema: o } = A;
    n || o && typeof o == "object" ? A.fail$data((0, jh._)`!${(0, cI.useFunc)(e, fI.default)}(${t}, ${i})`) : A.fail((0, jh._)`${o} !== ${t}`);
  }
};
dp.default = dI;
var pp = {};
Object.defineProperty(pp, "__esModule", { value: !0 });
const as = Be, pI = MA, gI = $s, BI = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: A }) => (0, as._)`{allowedValues: ${A}}`
}, wI = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: BI,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, schemaCode: o, it: l } = A;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const f = i.length >= l.opts.loopEnum;
    let c;
    const h = () => c ?? (c = (0, pI.useFunc)(e, gI.default));
    let m;
    if (f || n)
      m = e.let("valid"), A.block$data(m, B);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const v = e.const("vSchema", o);
      m = (0, as.or)(...i.map((u, C) => g(v, C)));
    }
    A.pass(m);
    function B() {
      e.assign(m, !1), e.forOf("v", o, (v) => e.if((0, as._)`${h()}(${t}, ${v})`, () => e.assign(m, !0).break()));
    }
    function g(v, u) {
      const C = i[u];
      return typeof C == "object" && C !== null ? (0, as._)`${h()}(${t}, ${v}[${u}])` : (0, as._)`${t} === ${C}`;
    }
  }
};
pp.default = wI;
Object.defineProperty(rp, "__esModule", { value: !0 });
const mI = ip, vI = ap, yI = op, CI = up, QI = lp, FI = cp, UI = fp, EI = hp, bI = dp, _I = pp, xI = [
  // number
  mI.default,
  vI.default,
  // string
  yI.default,
  CI.default,
  // object
  QI.default,
  FI.default,
  // array
  UI.default,
  EI.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  bI.default,
  _I.default
];
rp.default = xI;
var gp = {}, go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
go.validateAdditionalItems = void 0;
const Yi = Be, Yh = MA, II = {
  message: ({ params: { len: A } }) => (0, Yi.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, Yi._)`{limit: ${A}}`
}, HI = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: II,
  code(A) {
    const { parentSchema: e, it: t } = A, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, Yh.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    zv(A, n);
  }
};
function zv(A, e) {
  const { gen: t, schema: n, data: i, keyword: o, it: l } = A;
  l.items = !0;
  const f = t.const("len", (0, Yi._)`${i}.length`);
  if (n === !1)
    A.setParams({ len: e.length }), A.pass((0, Yi._)`${f} <= ${e.length}`);
  else if (typeof n == "object" && !(0, Yh.alwaysValidSchema)(l, n)) {
    const h = t.var("valid", (0, Yi._)`${f} <= ${e.length}`);
    t.if((0, Yi.not)(h), () => c(h)), A.ok(h);
  }
  function c(h) {
    t.forRange("i", e.length, f, (m) => {
      A.subschema({ keyword: o, dataProp: m, dataPropType: Yh.Type.Num }, h), l.allErrors || t.if((0, Yi.not)(h), () => t.break());
    });
  }
}
go.validateAdditionalItems = zv;
go.default = HI;
var Bp = {}, Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.validateTuple = void 0;
const tw = Be, $l = MA, SI = ge, LI = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(A) {
    const { schema: e, it: t } = A;
    if (Array.isArray(e))
      return Jv(A, "additionalItems", e);
    t.items = !0, !(0, $l.alwaysValidSchema)(t, e) && A.ok((0, SI.validateArray)(A));
  }
};
function Jv(A, e, t = A.schema) {
  const { gen: n, parentSchema: i, data: o, keyword: l, it: f } = A;
  m(i), f.opts.unevaluated && t.length && f.items !== !0 && (f.items = $l.mergeEvaluated.items(n, t.length, f.items));
  const c = n.name("valid"), h = n.const("len", (0, tw._)`${o}.length`);
  t.forEach((B, g) => {
    (0, $l.alwaysValidSchema)(f, B) || (n.if((0, tw._)`${h} > ${g}`, () => A.subschema({
      keyword: l,
      schemaProp: g,
      dataProp: g
    }, c)), A.ok(c));
  });
  function m(B) {
    const { opts: g, errSchemaPath: v } = f, u = t.length, C = u === B.minItems && (u === B.maxItems || B[e] === !1);
    if (g.strictTuples && !C) {
      const F = `"${l}" is ${u}-tuple, but minItems or maxItems/${e} are not specified or different at path "${v}"`;
      (0, $l.checkStrictMode)(f, F, g.strictTuples);
    }
  }
}
Bo.validateTuple = Jv;
Bo.default = LI;
Object.defineProperty(Bp, "__esModule", { value: !0 });
const TI = Bo, DI = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (A) => (0, TI.validateTuple)(A, "items")
};
Bp.default = DI;
var wp = {};
Object.defineProperty(wp, "__esModule", { value: !0 });
const nw = Be, OI = MA, NI = ge, MI = go, PI = {
  message: ({ params: { len: A } }) => (0, nw.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, nw._)`{limit: ${A}}`
}, KI = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: PI,
  code(A) {
    const { schema: e, parentSchema: t, it: n } = A, { prefixItems: i } = t;
    n.items = !0, !(0, OI.alwaysValidSchema)(n, e) && (i ? (0, MI.validateAdditionalItems)(A, i) : A.ok((0, NI.validateArray)(A)));
  }
};
wp.default = KI;
var mp = {};
Object.defineProperty(mp, "__esModule", { value: !0 });
const yn = Be, rl = MA, RI = {
  message: ({ params: { min: A, max: e } }) => e === void 0 ? (0, yn.str)`must contain at least ${A} valid item(s)` : (0, yn.str)`must contain at least ${A} and no more than ${e} valid item(s)`,
  params: ({ params: { min: A, max: e } }) => e === void 0 ? (0, yn._)`{minContains: ${A}}` : (0, yn._)`{minContains: ${A}, maxContains: ${e}}`
}, kI = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: RI,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: o } = A;
    let l, f;
    const { minContains: c, maxContains: h } = n;
    o.opts.next ? (l = c === void 0 ? 1 : c, f = h) : l = 1;
    const m = e.const("len", (0, yn._)`${i}.length`);
    if (A.setParams({ min: l, max: f }), f === void 0 && l === 0) {
      (0, rl.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (f !== void 0 && l > f) {
      (0, rl.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), A.fail();
      return;
    }
    if ((0, rl.alwaysValidSchema)(o, t)) {
      let C = (0, yn._)`${m} >= ${l}`;
      f !== void 0 && (C = (0, yn._)`${C} && ${m} <= ${f}`), A.pass(C);
      return;
    }
    o.items = !0;
    const B = e.name("valid");
    f === void 0 && l === 1 ? v(B, () => e.if(B, () => e.break())) : l === 0 ? (e.let(B, !0), f !== void 0 && e.if((0, yn._)`${i}.length > 0`, g)) : (e.let(B, !1), g()), A.result(B, () => A.reset());
    function g() {
      const C = e.name("_valid"), F = e.let("count", 0);
      v(C, () => e.if(C, () => u(F)));
    }
    function v(C, F) {
      e.forRange("i", 0, m, (U) => {
        A.subschema({
          keyword: "contains",
          dataProp: U,
          dataPropType: rl.Type.Num,
          compositeRule: !0
        }, C), F();
      });
    }
    function u(C) {
      e.code((0, yn._)`${C}++`), f === void 0 ? e.if((0, yn._)`${C} >= ${l}`, () => e.assign(B, !0).break()) : (e.if((0, yn._)`${C} > ${f}`, () => e.assign(B, !1).break()), l === 1 ? e.assign(B, !0) : e.if((0, yn._)`${C} >= ${l}`, () => e.assign(B, !0)));
    }
  }
};
mp.default = kI;
var jv = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.validateSchemaDeps = A.validatePropertyDeps = A.error = void 0;
  const e = Be, t = MA, n = ge;
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
})(jv);
var vp = {};
Object.defineProperty(vp, "__esModule", { value: !0 });
const Yv = Be, $I = MA, GI = {
  message: "property name must be valid",
  params: ({ params: A }) => (0, Yv._)`{propertyName: ${A.propertyName}}`
}, VI = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: GI,
  code(A) {
    const { gen: e, schema: t, data: n, it: i } = A;
    if ((0, $I.alwaysValidSchema)(i, t))
      return;
    const o = e.name("valid");
    e.forIn("key", n, (l) => {
      A.setParams({ propertyName: l }), A.subschema({
        keyword: "propertyNames",
        data: l,
        dataTypes: ["string"],
        propertyName: l,
        compositeRule: !0
      }, o), e.if((0, Yv.not)(o), () => {
        A.error(!0), i.allErrors || e.break();
      });
    }), A.ok(o);
  }
};
vp.default = VI;
var Tc = {};
Object.defineProperty(Tc, "__esModule", { value: !0 });
const il = ge, kn = Be, WI = pr, al = MA, XI = {
  message: "must NOT have additional properties",
  params: ({ params: A }) => (0, kn._)`{additionalProperty: ${A.additionalProperty}}`
}, qI = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: XI,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, errsCount: o, it: l } = A;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: f, opts: c } = l;
    if (l.props = !0, c.removeAdditional !== "all" && (0, al.alwaysValidSchema)(l, t))
      return;
    const h = (0, il.allSchemaProperties)(n.properties), m = (0, il.allSchemaProperties)(n.patternProperties);
    B(), A.ok((0, kn._)`${o} === ${WI.default.errors}`);
    function B() {
      e.forIn("key", i, (F) => {
        !h.length && !m.length ? u(F) : e.if(g(F), () => u(F));
      });
    }
    function g(F) {
      let U;
      if (h.length > 8) {
        const H = (0, al.schemaRefOrVal)(l, n.properties, "properties");
        U = (0, il.isOwnProperty)(e, H, F);
      } else h.length ? U = (0, kn.or)(...h.map((H) => (0, kn._)`${F} === ${H}`)) : U = kn.nil;
      return m.length && (U = (0, kn.or)(U, ...m.map((H) => (0, kn._)`${(0, il.usePattern)(A, H)}.test(${F})`))), (0, kn.not)(U);
    }
    function v(F) {
      e.code((0, kn._)`delete ${i}[${F}]`);
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
      if (typeof t == "object" && !(0, al.alwaysValidSchema)(l, t)) {
        const U = e.name("valid");
        c.removeAdditional === "failing" ? (C(F, U, !1), e.if((0, kn.not)(U), () => {
          A.reset(), v(F);
        })) : (C(F, U), f || e.if((0, kn.not)(U), () => e.break()));
      }
    }
    function C(F, U, H) {
      const O = {
        keyword: "additionalProperties",
        dataProp: F,
        dataPropType: al.Type.Str
      };
      H === !1 && Object.assign(O, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), A.subschema(O, U);
    }
  }
};
Tc.default = qI;
var yp = {};
Object.defineProperty(yp, "__esModule", { value: !0 });
const zI = qn, rw = ge, dh = MA, iw = Tc, JI = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: o } = A;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && iw.default.code(new zI.KeywordCxt(o, iw.default, "additionalProperties"));
    const l = (0, rw.allSchemaProperties)(t);
    for (const B of l)
      o.definedProperties.add(B);
    o.opts.unevaluated && l.length && o.props !== !0 && (o.props = dh.mergeEvaluated.props(e, (0, dh.toHash)(l), o.props));
    const f = l.filter((B) => !(0, dh.alwaysValidSchema)(o, t[B]));
    if (f.length === 0)
      return;
    const c = e.name("valid");
    for (const B of f)
      h(B) ? m(B) : (e.if((0, rw.propertyInData)(e, i, B, o.opts.ownProperties)), m(B), o.allErrors || e.else().var(c, !0), e.endIf()), A.it.definedProperties.add(B), A.ok(c);
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
yp.default = JI;
var Cp = {};
Object.defineProperty(Cp, "__esModule", { value: !0 });
const aw = ge, ol = Be, ow = MA, sw = MA, jI = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, data: n, parentSchema: i, it: o } = A, { opts: l } = o, f = (0, aw.allSchemaProperties)(t), c = f.filter((C) => (0, ow.alwaysValidSchema)(o, t[C]));
    if (f.length === 0 || c.length === f.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const h = l.strictSchema && !l.allowMatchingProperties && i.properties, m = e.name("valid");
    o.props !== !0 && !(o.props instanceof ol.Name) && (o.props = (0, sw.evaluatedPropsToName)(e, o.props));
    const { props: B } = o;
    g();
    function g() {
      for (const C of f)
        h && v(C), o.allErrors ? u(C) : (e.var(m, !0), u(C), e.if(m));
    }
    function v(C) {
      for (const F in h)
        new RegExp(C).test(F) && (0, ow.checkStrictMode)(o, `property ${F} matches pattern ${C} (use allowMatchingProperties)`);
    }
    function u(C) {
      e.forIn("key", n, (F) => {
        e.if((0, ol._)`${(0, aw.usePattern)(A, C)}.test(${F})`, () => {
          const U = c.includes(C);
          U || A.subschema({
            keyword: "patternProperties",
            schemaProp: C,
            dataProp: F,
            dataPropType: sw.Type.Str
          }, m), o.opts.unevaluated && B !== !0 ? e.assign((0, ol._)`${B}[${F}]`, !0) : !U && !o.allErrors && e.if((0, ol.not)(m), () => e.break());
        });
      });
    }
  }
};
Cp.default = jI;
var Qp = {};
Object.defineProperty(Qp, "__esModule", { value: !0 });
const YI = MA, ZI = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if ((0, YI.alwaysValidSchema)(n, t)) {
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
Qp.default = ZI;
var Fp = {};
Object.defineProperty(Fp, "__esModule", { value: !0 });
const AH = ge, eH = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: AH.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Fp.default = eH;
var Up = {};
Object.defineProperty(Up, "__esModule", { value: !0 });
const Gl = Be, tH = MA, nH = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: A }) => (0, Gl._)`{passingSchemas: ${A.passing}}`
}, rH = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: nH,
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
        (0, tH.alwaysValidSchema)(i, m) ? e.var(c, !0) : g = A.subschema({
          keyword: "oneOf",
          schemaProp: B,
          compositeRule: !0
        }, c), B > 0 && e.if((0, Gl._)`${c} && ${l}`).assign(l, !1).assign(f, (0, Gl._)`[${f}, ${B}]`).else(), e.if(c, () => {
          e.assign(l, !0), e.assign(f, B), g && A.mergeEvaluated(g, Gl.Name);
        });
      });
    }
  }
};
Up.default = rH;
var Ep = {};
Object.defineProperty(Ep, "__esModule", { value: !0 });
const iH = MA, aH = {
  keyword: "allOf",
  schemaType: "array",
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    const i = e.name("valid");
    t.forEach((o, l) => {
      if ((0, iH.alwaysValidSchema)(n, o))
        return;
      const f = A.subschema({ keyword: "allOf", schemaProp: l }, i);
      A.ok(i), A.mergeEvaluated(f);
    });
  }
};
Ep.default = aH;
var bp = {};
Object.defineProperty(bp, "__esModule", { value: !0 });
const ic = Be, Zv = MA, oH = {
  message: ({ params: A }) => (0, ic.str)`must match "${A.ifClause}" schema`,
  params: ({ params: A }) => (0, ic._)`{failingKeyword: ${A.ifClause}}`
}, sH = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: oH,
  code(A) {
    const { gen: e, parentSchema: t, it: n } = A;
    t.then === void 0 && t.else === void 0 && (0, Zv.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = uw(n, "then"), o = uw(n, "else");
    if (!i && !o)
      return;
    const l = e.let("valid", !0), f = e.name("_valid");
    if (c(), A.reset(), i && o) {
      const m = e.let("ifClause");
      A.setParams({ ifClause: m }), e.if(f, h("then", m), h("else", m));
    } else i ? e.if(f, h("then")) : e.if((0, ic.not)(f), h("else"));
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
        e.assign(l, f), A.mergeValidEvaluated(g, l), B ? e.assign(B, (0, ic._)`${m}`) : A.setParams({ ifClause: m });
      };
    }
  }
};
function uw(A, e) {
  const t = A.schema[e];
  return t !== void 0 && !(0, Zv.alwaysValidSchema)(A, t);
}
bp.default = sH;
var _p = {};
Object.defineProperty(_p, "__esModule", { value: !0 });
const uH = MA, lH = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: A, parentSchema: e, it: t }) {
    e.if === void 0 && (0, uH.checkStrictMode)(t, `"${A}" without "if" is ignored`);
  }
};
_p.default = lH;
Object.defineProperty(gp, "__esModule", { value: !0 });
const cH = go, fH = Bp, hH = Bo, dH = wp, pH = mp, gH = jv, BH = vp, wH = Tc, mH = yp, vH = Cp, yH = Qp, CH = Fp, QH = Up, FH = Ep, UH = bp, EH = _p;
function bH(A = !1) {
  const e = [
    // any
    yH.default,
    CH.default,
    QH.default,
    FH.default,
    UH.default,
    EH.default,
    // object
    BH.default,
    wH.default,
    gH.default,
    mH.default,
    vH.default
  ];
  return A ? e.push(fH.default, dH.default) : e.push(cH.default, hH.default), e.push(pH.default), e;
}
gp.default = bH;
var xp = {}, Ip = {};
Object.defineProperty(Ip, "__esModule", { value: !0 });
const at = Be, _H = {
  message: ({ schemaCode: A }) => (0, at.str)`must match format "${A}"`,
  params: ({ schemaCode: A }) => (0, at._)`{format: ${A}}`
}, xH = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: _H,
  code(A, e) {
    const { gen: t, data: n, $data: i, schema: o, schemaCode: l, it: f } = A, { opts: c, errSchemaPath: h, schemaEnv: m, self: B } = f;
    if (!c.validateFormats)
      return;
    i ? g() : v();
    function g() {
      const u = t.scopeValue("formats", {
        ref: B.formats,
        code: c.code.formats
      }), C = t.const("fDef", (0, at._)`${u}[${l}]`), F = t.let("fType"), U = t.let("format");
      t.if((0, at._)`typeof ${C} == "object" && !(${C} instanceof RegExp)`, () => t.assign(F, (0, at._)`${C}.type || "string"`).assign(U, (0, at._)`${C}.validate`), () => t.assign(F, (0, at._)`"string"`).assign(U, C)), A.fail$data((0, at.or)(H(), O()));
      function H() {
        return c.strictSchema === !1 ? at.nil : (0, at._)`${l} && !${U}`;
      }
      function O() {
        const _ = m.$async ? (0, at._)`(${C}.async ? await ${U}(${n}) : ${U}(${n}))` : (0, at._)`${U}(${n})`, M = (0, at._)`(typeof ${U} == "function" ? ${_} : ${U}.test(${n}))`;
        return (0, at._)`${U} && ${U} !== true && ${F} === ${e} && !${M}`;
      }
    }
    function v() {
      const u = B.formats[o];
      if (!u) {
        H();
        return;
      }
      if (u === !0)
        return;
      const [C, F, U] = O(u);
      C === e && A.pass(_());
      function H() {
        if (c.strictSchema === !1) {
          B.logger.warn(M());
          return;
        }
        throw new Error(M());
        function M() {
          return `unknown format "${o}" ignored in schema at path "${h}"`;
        }
      }
      function O(M) {
        const K = M instanceof RegExp ? (0, at.regexpCode)(M) : c.code.formats ? (0, at._)`${c.code.formats}${(0, at.getProperty)(o)}` : void 0, z = t.scopeValue("formats", { key: o, ref: M, code: K });
        return typeof M == "object" && !(M instanceof RegExp) ? [M.type || "string", M.validate, (0, at._)`${z}.validate`] : ["string", M, z];
      }
      function _() {
        if (typeof u == "object" && !(u instanceof RegExp) && u.async) {
          if (!m.$async)
            throw new Error("async format in sync schema");
          return (0, at._)`await ${U}(${n})`;
        }
        return typeof F == "function" ? (0, at._)`${U}(${n})` : (0, at._)`${U}.test(${n})`;
      }
    }
  }
};
Ip.default = xH;
Object.defineProperty(xp, "__esModule", { value: !0 });
const IH = Ip, HH = [IH.default];
xp.default = HH;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
io.contentVocabulary = io.metadataVocabulary = void 0;
io.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
io.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ep, "__esModule", { value: !0 });
const SH = tp, LH = rp, TH = gp, DH = xp, lw = io, OH = [
  SH.default,
  LH.default,
  (0, TH.default)(),
  DH.default,
  lw.metadataVocabulary,
  lw.contentVocabulary
];
ep.default = OH;
var Hp = {}, Dc = {};
Object.defineProperty(Dc, "__esModule", { value: !0 });
Dc.DiscrError = void 0;
var cw;
(function(A) {
  A.Tag = "tag", A.Mapping = "mapping";
})(cw || (Dc.DiscrError = cw = {}));
Object.defineProperty(Hp, "__esModule", { value: !0 });
const Va = Be, Zh = Dc, fw = An, NH = po, MH = MA, PH = {
  message: ({ params: { discrError: A, tagName: e } }) => A === Zh.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: A, tag: e, tagName: t } }) => (0, Va._)`{error: ${A}, tag: ${t}, tagValue: ${e}}`
}, KH = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: PH,
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
    const c = e.let("valid", !1), h = e.const("tag", (0, Va._)`${t}${(0, Va.getProperty)(f)}`);
    e.if((0, Va._)`typeof ${h} == "string"`, () => m(), () => A.error(!1, { discrError: Zh.DiscrError.Tag, tag: h, tagName: f })), A.ok(c);
    function m() {
      const v = g();
      e.if(!1);
      for (const u in v)
        e.elseIf((0, Va._)`${h} === ${u}`), e.assign(c, B(v[u]));
      e.else(), A.error(!1, { discrError: Zh.DiscrError.Mapping, tag: h, tagName: f }), e.endIf();
    }
    function B(v) {
      const u = e.name("valid"), C = A.subschema({ keyword: "oneOf", schemaProp: v }, u);
      return A.mergeEvaluated(C, Va.Name), u;
    }
    function g() {
      var v;
      const u = {}, C = U(i);
      let F = !0;
      for (let _ = 0; _ < l.length; _++) {
        let M = l[_];
        if (M != null && M.$ref && !(0, MH.schemaHasRulesButRef)(M, o.self.RULES)) {
          const z = M.$ref;
          if (M = fw.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, z), M instanceof fw.SchemaEnv && (M = M.schema), M === void 0)
            throw new NH.default(o.opts.uriResolver, o.baseId, z);
        }
        const K = (v = M == null ? void 0 : M.properties) === null || v === void 0 ? void 0 : v[f];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${f}"`);
        F = F && (C || U(M)), H(K, _);
      }
      if (!F)
        throw new Error(`discriminator: "${f}" must be required`);
      return u;
      function U({ required: _ }) {
        return Array.isArray(_) && _.includes(f);
      }
      function H(_, M) {
        if (_.const)
          O(_.const, M);
        else if (_.enum)
          for (const K of _.enum)
            O(K, M);
        else
          throw new Error(`discriminator: "properties/${f}" must have "const" or "enum"`);
      }
      function O(_, M) {
        if (typeof _ != "string" || _ in u)
          throw new Error(`discriminator: "${f}" values must be unique strings`);
        u[_] = M;
      }
    }
  }
};
Hp.default = KH;
const RH = "http://json-schema.org/draft-07/schema#", kH = "http://json-schema.org/draft-07/schema#", $H = "Core schema meta-schema", GH = {
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
}, VH = [
  "object",
  "boolean"
], WH = {
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
}, XH = {
  $schema: RH,
  $id: kH,
  title: $H,
  definitions: GH,
  type: VH,
  properties: WH,
  default: !0
};
(function(A, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const t = rv, n = ep, i = Hp, o = XH, l = ["/properties"], f = "http://json-schema.org/draft-07/schema";
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
  var h = qn;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return h.KeywordCxt;
  } });
  var m = Be;
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
  var B = ks;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return B.default;
  } });
  var g = po;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return g.default;
  } });
})(Vh, Vh.exports);
var qH = Vh.exports;
const A0 = /* @__PURE__ */ xc(qH), zH = "http://json-schema.org/draft-07/schema#", JH = "Generated schema for Root", jH = "object", YH = {
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
}, ZH = [
  "genome"
], AS = {
  $schema: zH,
  title: JH,
  type: jH,
  properties: YH,
  required: ZH
}, eS = new A0(), hw = eS.compile(AS), tS = function() {
  var A = function(e) {
    var i;
    if (!hw(e))
      throw console.log("annotation json:", e), console.log("Invalid data:", hw.errors), new Error("Invalid data");
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
}, nS = "http://json-schema.org/draft-07/schema#", rS = "Generated schema for Root", iS = "object", aS = {
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
}, oS = [
  "chromosomes"
], sS = {
  $schema: nS,
  title: rS,
  type: iS,
  properties: aS,
  required: oS
}, uS = new A0(), dw = uS.compile(sS), lS = function() {
  var A = function(e) {
    if (console.log("json", e), !dw(e))
      throw console.log("json:", e), console.log("Invalid data:", dw.errors), new Error("Invalid data");
    var n = {};
    return n.chromosomes = e == null ? void 0 : e.chromosomes, console.log("genome", n), n;
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
}, cS = function() {
  var A = function(n) {
    var i = new Array(8 - n.length + 1).join("0");
    let o = "#" + i + n.substring(2, n.length);
    return o == "#00FF00" && (o = "#208000"), o;
  }, e = function(n) {
    return n.chromosomes.forEach(function(i) {
      console.log("chromosome", i), i.annotations = {
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
      var l = lS();
      let f;
      if (o ? f = l.readBasemapFromRawJSON(n) : f = await l.readBasemap(n), i) {
        var c = tS();
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
var ac = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
ac.exports;
(function(A, e) {
  (function() {
    var t, n = "4.17.21", i = 200, o = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", f = "Invalid `variable` option passed into `_.template`", c = "__lodash_hash_undefined__", h = 500, m = "__lodash_placeholder__", B = 1, g = 2, v = 4, u = 1, C = 2, F = 1, U = 2, H = 4, O = 8, _ = 16, M = 32, K = 64, z = 128, cA = 256, sA = 512, gA = 30, QA = "...", OA = 800, _A = 16, W = 1, yA = 2, eA = 3, fA = 1 / 0, bA = 9007199254740991, xA = 17976931348623157e292, iA = NaN, T = 4294967295, AA = T - 1, J = T >>> 1, L = [
      ["ary", z],
      ["bind", F],
      ["bindKey", U],
      ["curry", O],
      ["curryRight", _],
      ["flip", sA],
      ["partial", M],
      ["partialRight", K],
      ["rearg", cA]
    ], R = "[object Arguments]", nA = "[object Array]", FA = "[object AsyncFunction]", UA = "[object Boolean]", qA = "[object Date]", te = "[object DOMException]", zA = "[object Error]", KA = "[object Function]", oA = "[object GeneratorFunction]", mA = "[object Map]", EA = "[object Number]", ee = "[object Null]", we = "[object Object]", Fe = "[object Promise]", Ye = "[object Proxy]", Le = "[object RegExp]", ke = "[object Set]", Me = "[object String]", be = "[object Symbol]", Nt = "[object Undefined]", Et = "[object WeakMap]", Mt = "[object WeakSet]", bt = "[object ArrayBuffer]", wt = "[object DataView]", fn = "[object Float32Array]", mr = "[object Float64Array]", _i = "[object Int8Array]", qr = "[object Int16Array]", zr = "[object Int32Array]", lA = "[object Uint8Array]", TA = "[object Uint8ClampedArray]", WA = "[object Uint16Array]", me = "[object Uint32Array]", ve = /\b__p \+= '';/g, st = /\b(__p \+=) '' \+/g, _t = /(__e\(.*?\)|\b__t\)) \+\n'';/g, _n = /&(?:amp|lt|gt|quot|#39);/g, xi = /[&<>"']/g, xn = RegExp(_n.source), Ii = RegExp(xi.source), Jr = /<%-([\s\S]+?)%>/g, hn = /<%([\s\S]+?)%>/g, Hi = /<%=([\s\S]+?)%>/g, jr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, vr = /^\w*$/, js = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, mo = /[\\^$.*+?()[\]{}|]/g, yr = RegExp(mo.source), fa = /^\s+/, Si = /\s/, Ys = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Zs = /\{\n\/\* \[wrapped with (.+)\] \*/, ha = /,? & /, Au = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, da = /[()=,{}\[\]\/\s]/, vo = /\\(\\)?/g, eu = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, jn = /\w*$/, Yn = /^[-+]0x[0-9a-f]+$/i, jc = /^0b[01]+$/i, yo = /^\[object .+?Constructor\]$/, Co = /^0o[0-7]+$/i, Yc = /^(?:0|[1-9]\d*)$/, Zc = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, pa = /($^)/, Af = /['\n\r\u2028\u2029\\]/g, Li = "\\ud800-\\udfff", tu = "\\u0300-\\u036f", nu = "\\ufe20-\\ufe2f", ru = "\\u20d0-\\u20ff", Qo = tu + nu + ru, Fo = "\\u2700-\\u27bf", Uo = "a-z\\xdf-\\xf6\\xf8-\\xff", iu = "\\xac\\xb1\\xd7\\xf7", xt = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Yr = "\\u2000-\\u206f", ga = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", au = "A-Z\\xc0-\\xd6\\xd8-\\xde", ou = "\\ufe0e\\ufe0f", Eo = iu + xt + Yr + ga, Zr = "['’]", su = "[" + Li + "]", uu = "[" + Eo + "]", Ba = "[" + Qo + "]", Xt = "\\d+", ef = "[" + Fo + "]", lu = "[" + Uo + "]", Cr = "[^" + Li + Eo + Xt + Fo + Uo + au + "]", wa = "\\ud83c[\\udffb-\\udfff]", In = "(?:" + Ba + "|" + wa + ")", ma = "[^" + Li + "]", Hn = "(?:\\ud83c[\\udde6-\\uddff]){2}", Ai = "[\\ud800-\\udbff][\\udc00-\\udfff]", ei = "[" + au + "]", cu = "\\u200d", va = "(?:" + lu + "|" + Cr + ")", Qr = "(?:" + ei + "|" + Cr + ")", fu = "(?:" + Zr + "(?:d|ll|m|re|s|t|ve))?", ya = "(?:" + Zr + "(?:D|LL|M|RE|S|T|VE))?", Ca = In + "?", hu = "[" + ou + "]?", tf = "(?:" + cu + "(?:" + [ma, Hn, Ai].join("|") + ")" + hu + Ca + ")*", du = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", nf = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", pu = hu + Ca + tf, rf = "(?:" + [ef, Hn, Ai].join("|") + ")" + pu, af = "(?:" + [ma + Ba + "?", Ba, Hn, Ai, su].join("|") + ")", gu = RegExp(Zr, "g"), Bu = RegExp(Ba, "g"), Ti = RegExp(wa + "(?=" + wa + ")|" + af + pu, "g"), wu = RegExp([
      ei + "?" + lu + "+" + fu + "(?=" + [uu, ei, "$"].join("|") + ")",
      Qr + "+" + ya + "(?=" + [uu, ei + va, "$"].join("|") + ")",
      ei + "?" + va + "+" + fu,
      ei + "+" + ya,
      nf,
      du,
      Xt,
      rf
    ].join("|"), "g"), bo = RegExp("[" + cu + Li + Qo + ou + "]"), ti = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, mu = [
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
    ], vu = -1, Ne = {};
    Ne[fn] = Ne[mr] = Ne[_i] = Ne[qr] = Ne[zr] = Ne[lA] = Ne[TA] = Ne[WA] = Ne[me] = !0, Ne[R] = Ne[nA] = Ne[bt] = Ne[UA] = Ne[wt] = Ne[qA] = Ne[zA] = Ne[KA] = Ne[mA] = Ne[EA] = Ne[we] = Ne[Le] = Ne[ke] = Ne[Me] = Ne[Et] = !1;
    var Pe = {};
    Pe[R] = Pe[nA] = Pe[bt] = Pe[wt] = Pe[UA] = Pe[qA] = Pe[fn] = Pe[mr] = Pe[_i] = Pe[qr] = Pe[zr] = Pe[mA] = Pe[EA] = Pe[we] = Pe[Le] = Pe[ke] = Pe[Me] = Pe[be] = Pe[lA] = Pe[TA] = Pe[WA] = Pe[me] = !0, Pe[zA] = Pe[KA] = Pe[Et] = !1;
    var of = {
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
    }, sf = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, uf = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, lf = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, cf = parseFloat, yu = parseInt, Cu = typeof zi == "object" && zi && zi.Object === Object && zi, ff = typeof self == "object" && self && self.Object === Object && self, At = Cu || ff || Function("return this")(), _o = e && !e.nodeType && e, dn = _o && !0 && A && !A.nodeType && A, ni = dn && dn.exports === _o, Di = ni && Cu.process, Pt = function() {
      try {
        var j = dn && dn.require && dn.require("util").types;
        return j || Di && Di.binding && Di.binding("util");
      } catch {
      }
    }(), xo = Pt && Pt.isArrayBuffer, Qa = Pt && Pt.isDate, Io = Pt && Pt.isMap, Ho = Pt && Pt.isRegExp, Qu = Pt && Pt.isSet, Fu = Pt && Pt.isTypedArray;
    function s(j, aA, rA) {
      switch (rA.length) {
        case 0:
          return j.call(aA);
        case 1:
          return j.call(aA, rA[0]);
        case 2:
          return j.call(aA, rA[0], rA[1]);
        case 3:
          return j.call(aA, rA[0], rA[1], rA[2]);
      }
      return j.apply(aA, rA);
    }
    function d(j, aA, rA, DA) {
      for (var ie = -1, xe = j == null ? 0 : j.length; ++ie < xe; ) {
        var et = j[ie];
        aA(DA, et, rA(et), j);
      }
      return DA;
    }
    function w(j, aA) {
      for (var rA = -1, DA = j == null ? 0 : j.length; ++rA < DA && aA(j[rA], rA, j) !== !1; )
        ;
      return j;
    }
    function y(j, aA) {
      for (var rA = j == null ? 0 : j.length; rA-- && aA(j[rA], rA, j) !== !1; )
        ;
      return j;
    }
    function E(j, aA) {
      for (var rA = -1, DA = j == null ? 0 : j.length; ++rA < DA; )
        if (!aA(j[rA], rA, j))
          return !1;
      return !0;
    }
    function b(j, aA) {
      for (var rA = -1, DA = j == null ? 0 : j.length, ie = 0, xe = []; ++rA < DA; ) {
        var et = j[rA];
        aA(et, rA, j) && (xe[ie++] = et);
      }
      return xe;
    }
    function I(j, aA) {
      var rA = j == null ? 0 : j.length;
      return !!rA && ze(j, aA, 0) > -1;
    }
    function P(j, aA, rA) {
      for (var DA = -1, ie = j == null ? 0 : j.length; ++DA < ie; )
        if (rA(aA, j[DA]))
          return !0;
      return !1;
    }
    function V(j, aA) {
      for (var rA = -1, DA = j == null ? 0 : j.length, ie = Array(DA); ++rA < DA; )
        ie[rA] = aA(j[rA], rA, j);
      return ie;
    }
    function X(j, aA) {
      for (var rA = -1, DA = aA.length, ie = j.length; ++rA < DA; )
        j[ie + rA] = aA[rA];
      return j;
    }
    function Z(j, aA, rA, DA) {
      var ie = -1, xe = j == null ? 0 : j.length;
      for (DA && xe && (rA = j[++ie]); ++ie < xe; )
        rA = aA(rA, j[ie], ie, j);
      return rA;
    }
    function wA(j, aA, rA, DA) {
      var ie = j == null ? 0 : j.length;
      for (DA && ie && (rA = j[--ie]); ie--; )
        rA = aA(rA, j[ie], ie, j);
      return rA;
    }
    function HA(j, aA) {
      for (var rA = -1, DA = j == null ? 0 : j.length; ++rA < DA; )
        if (aA(j[rA], rA, j))
          return !0;
      return !1;
    }
    var vA = ue("length");
    function re(j) {
      return j.split("");
    }
    function jA(j) {
      return j.match(Au) || [];
    }
    function se(j, aA, rA) {
      var DA;
      return rA(j, function(ie, xe, et) {
        if (aA(ie, xe, et))
          return DA = xe, !1;
      }), DA;
    }
    function dt(j, aA, rA, DA) {
      for (var ie = j.length, xe = rA + (DA ? 1 : -1); DA ? xe-- : ++xe < ie; )
        if (aA(j[xe], xe, j))
          return xe;
      return -1;
    }
    function ze(j, aA, rA) {
      return aA === aA ? ba(j, aA, rA) : dt(j, PA, rA);
    }
    function Zn(j, aA, rA, DA) {
      for (var ie = rA - 1, xe = j.length; ++ie < xe; )
        if (DA(j[ie], aA))
          return ie;
      return -1;
    }
    function PA(j) {
      return j !== j;
    }
    function lt(j, aA) {
      var rA = j == null ? 0 : j.length;
      return rA ? It(j, aA) / rA : iA;
    }
    function ue(j) {
      return function(aA) {
        return aA == null ? t : aA[j];
      };
    }
    function Xe(j) {
      return function(aA) {
        return j == null ? t : j[aA];
      };
    }
    function Sn(j, aA, rA, DA, ie) {
      return ie(j, function(xe, et, Ue) {
        rA = DA ? (DA = !1, xe) : aA(rA, xe, et, Ue);
      }), rA;
    }
    function Fa(j, aA) {
      var rA = j.length;
      for (j.sort(aA); rA--; )
        j[rA] = j[rA].value;
      return j;
    }
    function It(j, aA) {
      for (var rA, DA = -1, ie = j.length; ++DA < ie; ) {
        var xe = aA(j[DA]);
        xe !== t && (rA = rA === t ? xe : rA + xe);
      }
      return rA;
    }
    function Ln(j, aA) {
      for (var rA = -1, DA = Array(j); ++rA < j; )
        DA[rA] = aA(rA);
      return DA;
    }
    function Ar(j, aA) {
      return V(aA, function(rA) {
        return [rA, j[rA]];
      });
    }
    function Tn(j) {
      return j && j.slice(0, _u(j) + 1).replace(fa, "");
    }
    function Ke(j) {
      return function(aA) {
        return j(aA);
      };
    }
    function Ht(j, aA) {
      return V(aA, function(rA) {
        return j[rA];
      });
    }
    function Oi(j, aA) {
      return j.has(aA);
    }
    function Dn(j, aA) {
      for (var rA = -1, DA = j.length; ++rA < DA && ze(aA, j[rA], 0) > -1; )
        ;
      return rA;
    }
    function So(j, aA) {
      for (var rA = j.length; rA-- && ze(aA, j[rA], 0) > -1; )
        ;
      return rA;
    }
    function Fr(j, aA) {
      for (var rA = j.length, DA = 0; rA--; )
        j[rA] === aA && ++DA;
      return DA;
    }
    var Lo = Xe(of), Te = Xe(sf);
    function Ur(j) {
      return "\\" + lf[j];
    }
    function Uu(j, aA) {
      return j == null ? t : j[aA];
    }
    function er(j) {
      return bo.test(j);
    }
    function hf(j) {
      return ti.test(j);
    }
    function Ua(j) {
      for (var aA, rA = []; !(aA = j.next()).done; )
        rA.push(aA.value);
      return rA;
    }
    function To(j) {
      var aA = -1, rA = Array(j.size);
      return j.forEach(function(DA, ie) {
        rA[++aA] = [ie, DA];
      }), rA;
    }
    function Eu(j, aA) {
      return function(rA) {
        return j(aA(rA));
      };
    }
    function tr(j, aA) {
      for (var rA = -1, DA = j.length, ie = 0, xe = []; ++rA < DA; ) {
        var et = j[rA];
        (et === aA || et === m) && (j[rA] = m, xe[ie++] = rA);
      }
      return xe;
    }
    function Ea(j) {
      var aA = -1, rA = Array(j.size);
      return j.forEach(function(DA) {
        rA[++aA] = DA;
      }), rA;
    }
    function bu(j) {
      var aA = -1, rA = Array(j.size);
      return j.forEach(function(DA) {
        rA[++aA] = [DA, DA];
      }), rA;
    }
    function ba(j, aA, rA) {
      for (var DA = rA - 1, ie = j.length; ++DA < ie; )
        if (j[DA] === aA)
          return DA;
      return -1;
    }
    function df(j, aA, rA) {
      for (var DA = rA + 1; DA--; )
        if (j[DA] === aA)
          return DA;
      return DA;
    }
    function ri(j) {
      return er(j) ? pf(j) : vA(j);
    }
    function mt(j) {
      return er(j) ? On(j) : re(j);
    }
    function _u(j) {
      for (var aA = j.length; aA-- && Si.test(j.charAt(aA)); )
        ;
      return aA;
    }
    var Do = Xe(uf);
    function pf(j) {
      for (var aA = Ti.lastIndex = 0; Ti.test(j); )
        ++aA;
      return aA;
    }
    function On(j) {
      return j.match(Ti) || [];
    }
    function Nn(j) {
      return j.match(wu) || [];
    }
    var xu = function j(aA) {
      aA = aA == null ? At : _e.defaults(At.Object(), aA, _e.pick(At, mu));
      var rA = aA.Array, DA = aA.Date, ie = aA.Error, xe = aA.Function, et = aA.Math, Ue = aA.Object, Ni = aA.RegExp, Iu = aA.String, vt = aA.TypeError, ii = rA.prototype, Oo = xe.prototype, ai = Ue.prototype, Er = aA["__core-js_shared__"], oi = Oo.toString, Ie = ai.hasOwnProperty, gf = 0, N = function() {
        var r = /[^.]+$/.exec(Er && Er.keys && Er.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), $ = ai.toString, q = oi.call(Ue), uA = At._, tA = Ni(
        "^" + oi.call(Ie).replace(mo, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), BA = ni ? aA.Buffer : t, hA = aA.Symbol, IA = aA.Uint8Array, $A = BA ? BA.allocUnsafe : t, ne = Eu(Ue.getPrototypeOf, Ue), GA = Ue.create, YA = ai.propertyIsEnumerable, ce = ii.splice, Se = hA ? hA.isConcatSpreadable : t, XA = hA ? hA.iterator : t, $e = hA ? hA.toStringTag : t, tt = function() {
        try {
          var r = $i(Ue, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), Kt = aA.clearTimeout !== At.clearTimeout && aA.clearTimeout, Ve = DA && DA.now !== At.Date.now && DA.now, Mi = aA.setTimeout !== At.setTimeout && aA.setTimeout, nr = et.ceil, pt = et.floor, Bf = Ue.getOwnPropertySymbols, aC = BA ? BA.isBuffer : t, rg = aA.isFinite, oC = ii.join, sC = Eu(Ue.keys, Ue), ct = et.max, St = et.min, uC = DA.now, lC = aA.parseInt, ig = et.random, cC = ii.reverse, wf = $i(aA, "DataView"), No = $i(aA, "Map"), mf = $i(aA, "Promise"), _a = $i(aA, "Set"), Mo = $i(aA, "WeakMap"), Po = $i(Ue, "create"), Hu = Mo && new Mo(), xa = {}, fC = Gi(wf), hC = Gi(No), dC = Gi(mf), pC = Gi(_a), gC = Gi(Mo), Su = hA ? hA.prototype : t, Ko = Su ? Su.valueOf : t, ag = Su ? Su.toString : t;
      function S(r) {
        if (Ze(r) && !le(r) && !(r instanceof Ce)) {
          if (r instanceof pn)
            return r;
          if (Ie.call(r, "__wrapped__"))
            return oB(r);
        }
        return new pn(r);
      }
      var Ia = /* @__PURE__ */ function() {
        function r() {
        }
        return function(a) {
          if (!je(a))
            return {};
          if (GA)
            return GA(a);
          r.prototype = a;
          var p = new r();
          return r.prototype = t, p;
        };
      }();
      function Lu() {
      }
      function pn(r, a) {
        this.__wrapped__ = r, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
      }
      S.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: Jr,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: hn,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: Hi,
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
          _: S
        }
      }, S.prototype = Lu.prototype, S.prototype.constructor = S, pn.prototype = Ia(Lu.prototype), pn.prototype.constructor = pn;
      function Ce(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = T, this.__views__ = [];
      }
      function BC() {
        var r = new Ce(this.__wrapped__);
        return r.__actions__ = qt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = qt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = qt(this.__views__), r;
      }
      function wC() {
        if (this.__filtered__) {
          var r = new Ce(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function mC() {
        var r = this.__wrapped__.value(), a = this.__dir__, p = le(r), Q = a < 0, x = p ? r.length : 0, D = HQ(0, x, this.__views__), k = D.start, G = D.end, Y = G - k, dA = Q ? G : k - 1, pA = this.__iteratees__, CA = pA.length, SA = 0, RA = St(Y, this.__takeCount__);
        if (!p || !Q && x == Y && RA == Y)
          return Ig(r, this.__actions__);
        var ZA = [];
        A:
          for (; Y-- && SA < RA; ) {
            dA += a;
            for (var de = -1, Ae = r[dA]; ++de < CA; ) {
              var ye = pA[de], Ee = ye.iteratee, on = ye.type, $t = Ee(Ae);
              if (on == yA)
                Ae = $t;
              else if (!$t) {
                if (on == W)
                  continue A;
                break A;
              }
            }
            ZA[SA++] = Ae;
          }
        return ZA;
      }
      Ce.prototype = Ia(Lu.prototype), Ce.prototype.constructor = Ce;
      function Pi(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.clear(); ++a < p; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function vC() {
        this.__data__ = Po ? Po(null) : {}, this.size = 0;
      }
      function yC(r) {
        var a = this.has(r) && delete this.__data__[r];
        return this.size -= a ? 1 : 0, a;
      }
      function CC(r) {
        var a = this.__data__;
        if (Po) {
          var p = a[r];
          return p === c ? t : p;
        }
        return Ie.call(a, r) ? a[r] : t;
      }
      function QC(r) {
        var a = this.__data__;
        return Po ? a[r] !== t : Ie.call(a, r);
      }
      function FC(r, a) {
        var p = this.__data__;
        return this.size += this.has(r) ? 0 : 1, p[r] = Po && a === t ? c : a, this;
      }
      Pi.prototype.clear = vC, Pi.prototype.delete = yC, Pi.prototype.get = CC, Pi.prototype.has = QC, Pi.prototype.set = FC;
      function br(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.clear(); ++a < p; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function UC() {
        this.__data__ = [], this.size = 0;
      }
      function EC(r) {
        var a = this.__data__, p = Tu(a, r);
        if (p < 0)
          return !1;
        var Q = a.length - 1;
        return p == Q ? a.pop() : ce.call(a, p, 1), --this.size, !0;
      }
      function bC(r) {
        var a = this.__data__, p = Tu(a, r);
        return p < 0 ? t : a[p][1];
      }
      function _C(r) {
        return Tu(this.__data__, r) > -1;
      }
      function xC(r, a) {
        var p = this.__data__, Q = Tu(p, r);
        return Q < 0 ? (++this.size, p.push([r, a])) : p[Q][1] = a, this;
      }
      br.prototype.clear = UC, br.prototype.delete = EC, br.prototype.get = bC, br.prototype.has = _C, br.prototype.set = xC;
      function _r(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.clear(); ++a < p; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function IC() {
        this.size = 0, this.__data__ = {
          hash: new Pi(),
          map: new (No || br)(),
          string: new Pi()
        };
      }
      function HC(r) {
        var a = Wu(this, r).delete(r);
        return this.size -= a ? 1 : 0, a;
      }
      function SC(r) {
        return Wu(this, r).get(r);
      }
      function LC(r) {
        return Wu(this, r).has(r);
      }
      function TC(r, a) {
        var p = Wu(this, r), Q = p.size;
        return p.set(r, a), this.size += p.size == Q ? 0 : 1, this;
      }
      _r.prototype.clear = IC, _r.prototype.delete = HC, _r.prototype.get = SC, _r.prototype.has = LC, _r.prototype.set = TC;
      function Ki(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.__data__ = new _r(); ++a < p; )
          this.add(r[a]);
      }
      function DC(r) {
        return this.__data__.set(r, c), this;
      }
      function OC(r) {
        return this.__data__.has(r);
      }
      Ki.prototype.add = Ki.prototype.push = DC, Ki.prototype.has = OC;
      function Mn(r) {
        var a = this.__data__ = new br(r);
        this.size = a.size;
      }
      function NC() {
        this.__data__ = new br(), this.size = 0;
      }
      function MC(r) {
        var a = this.__data__, p = a.delete(r);
        return this.size = a.size, p;
      }
      function PC(r) {
        return this.__data__.get(r);
      }
      function KC(r) {
        return this.__data__.has(r);
      }
      function RC(r, a) {
        var p = this.__data__;
        if (p instanceof br) {
          var Q = p.__data__;
          if (!No || Q.length < i - 1)
            return Q.push([r, a]), this.size = ++p.size, this;
          p = this.__data__ = new _r(Q);
        }
        return p.set(r, a), this.size = p.size, this;
      }
      Mn.prototype.clear = NC, Mn.prototype.delete = MC, Mn.prototype.get = PC, Mn.prototype.has = KC, Mn.prototype.set = RC;
      function og(r, a) {
        var p = le(r), Q = !p && Vi(r), x = !p && !Q && fi(r), D = !p && !Q && !x && Ta(r), k = p || Q || x || D, G = k ? Ln(r.length, Iu) : [], Y = G.length;
        for (var dA in r)
          (a || Ie.call(r, dA)) && !(k && // Safari 9 has enumerable `arguments.length` in strict mode.
          (dA == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          x && (dA == "offset" || dA == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          D && (dA == "buffer" || dA == "byteLength" || dA == "byteOffset") || // Skip index properties.
          Sr(dA, Y))) && G.push(dA);
        return G;
      }
      function sg(r) {
        var a = r.length;
        return a ? r[If(0, a - 1)] : t;
      }
      function kC(r, a) {
        return Xu(qt(r), Ri(a, 0, r.length));
      }
      function $C(r) {
        return Xu(qt(r));
      }
      function vf(r, a, p) {
        (p !== t && !Pn(r[a], p) || p === t && !(a in r)) && xr(r, a, p);
      }
      function Ro(r, a, p) {
        var Q = r[a];
        (!(Ie.call(r, a) && Pn(Q, p)) || p === t && !(a in r)) && xr(r, a, p);
      }
      function Tu(r, a) {
        for (var p = r.length; p--; )
          if (Pn(r[p][0], a))
            return p;
        return -1;
      }
      function GC(r, a, p, Q) {
        return si(r, function(x, D, k) {
          a(Q, x, p(x), k);
        }), Q;
      }
      function ug(r, a) {
        return r && ir(a, gt(a), r);
      }
      function VC(r, a) {
        return r && ir(a, Jt(a), r);
      }
      function xr(r, a, p) {
        a == "__proto__" && tt ? tt(r, a, {
          configurable: !0,
          enumerable: !0,
          value: p,
          writable: !0
        }) : r[a] = p;
      }
      function yf(r, a) {
        for (var p = -1, Q = a.length, x = rA(Q), D = r == null; ++p < Q; )
          x[p] = D ? t : eh(r, a[p]);
        return x;
      }
      function Ri(r, a, p) {
        return r === r && (p !== t && (r = r <= p ? r : p), a !== t && (r = r >= a ? r : a)), r;
      }
      function gn(r, a, p, Q, x, D) {
        var k, G = a & B, Y = a & g, dA = a & v;
        if (p && (k = x ? p(r, Q, x, D) : p(r)), k !== t)
          return k;
        if (!je(r))
          return r;
        var pA = le(r);
        if (pA) {
          if (k = LQ(r), !G)
            return qt(r, k);
        } else {
          var CA = Lt(r), SA = CA == KA || CA == oA;
          if (fi(r))
            return Lg(r, G);
          if (CA == we || CA == R || SA && !x) {
            if (k = Y || SA ? {} : Yg(r), !G)
              return Y ? CQ(r, VC(k, r)) : yQ(r, ug(k, r));
          } else {
            if (!Pe[CA])
              return x ? r : {};
            k = TQ(r, CA, G);
          }
        }
        D || (D = new Mn());
        var RA = D.get(r);
        if (RA)
          return RA;
        D.set(r, k), bB(r) ? r.forEach(function(Ae) {
          k.add(gn(Ae, a, p, Ae, r, D));
        }) : UB(r) && r.forEach(function(Ae, ye) {
          k.set(ye, gn(Ae, a, p, ye, r, D));
        });
        var ZA = dA ? Y ? Rf : Kf : Y ? Jt : gt, de = pA ? t : ZA(r);
        return w(de || r, function(Ae, ye) {
          de && (ye = Ae, Ae = r[ye]), Ro(k, ye, gn(Ae, a, p, ye, r, D));
        }), k;
      }
      function WC(r) {
        var a = gt(r);
        return function(p) {
          return lg(p, r, a);
        };
      }
      function lg(r, a, p) {
        var Q = p.length;
        if (r == null)
          return !Q;
        for (r = Ue(r); Q--; ) {
          var x = p[Q], D = a[x], k = r[x];
          if (k === t && !(x in r) || !D(k))
            return !1;
        }
        return !0;
      }
      function cg(r, a, p) {
        if (typeof r != "function")
          throw new vt(l);
        return qo(function() {
          r.apply(t, p);
        }, a);
      }
      function ko(r, a, p, Q) {
        var x = -1, D = I, k = !0, G = r.length, Y = [], dA = a.length;
        if (!G)
          return Y;
        p && (a = V(a, Ke(p))), Q ? (D = P, k = !1) : a.length >= i && (D = Oi, k = !1, a = new Ki(a));
        A:
          for (; ++x < G; ) {
            var pA = r[x], CA = p == null ? pA : p(pA);
            if (pA = Q || pA !== 0 ? pA : 0, k && CA === CA) {
              for (var SA = dA; SA--; )
                if (a[SA] === CA)
                  continue A;
              Y.push(pA);
            } else D(a, CA, Q) || Y.push(pA);
          }
        return Y;
      }
      var si = Mg(rr), fg = Mg(Qf, !0);
      function XC(r, a) {
        var p = !0;
        return si(r, function(Q, x, D) {
          return p = !!a(Q, x, D), p;
        }), p;
      }
      function Du(r, a, p) {
        for (var Q = -1, x = r.length; ++Q < x; ) {
          var D = r[Q], k = a(D);
          if (k != null && (G === t ? k === k && !an(k) : p(k, G)))
            var G = k, Y = D;
        }
        return Y;
      }
      function qC(r, a, p, Q) {
        var x = r.length;
        for (p = fe(p), p < 0 && (p = -p > x ? 0 : x + p), Q = Q === t || Q > x ? x : fe(Q), Q < 0 && (Q += x), Q = p > Q ? 0 : xB(Q); p < Q; )
          r[p++] = a;
        return r;
      }
      function hg(r, a) {
        var p = [];
        return si(r, function(Q, x, D) {
          a(Q, x, D) && p.push(Q);
        }), p;
      }
      function yt(r, a, p, Q, x) {
        var D = -1, k = r.length;
        for (p || (p = OQ), x || (x = []); ++D < k; ) {
          var G = r[D];
          a > 0 && p(G) ? a > 1 ? yt(G, a - 1, p, Q, x) : X(x, G) : Q || (x[x.length] = G);
        }
        return x;
      }
      var Cf = Pg(), dg = Pg(!0);
      function rr(r, a) {
        return r && Cf(r, a, gt);
      }
      function Qf(r, a) {
        return r && dg(r, a, gt);
      }
      function Ou(r, a) {
        return b(a, function(p) {
          return Lr(r[p]);
        });
      }
      function ki(r, a) {
        a = li(a, r);
        for (var p = 0, Q = a.length; r != null && p < Q; )
          r = r[ar(a[p++])];
        return p && p == Q ? r : t;
      }
      function pg(r, a, p) {
        var Q = a(r);
        return le(r) ? Q : X(Q, p(r));
      }
      function Rt(r) {
        return r == null ? r === t ? Nt : ee : $e && $e in Ue(r) ? IQ(r) : $Q(r);
      }
      function Ff(r, a) {
        return r > a;
      }
      function zC(r, a) {
        return r != null && Ie.call(r, a);
      }
      function JC(r, a) {
        return r != null && a in Ue(r);
      }
      function jC(r, a, p) {
        return r >= St(a, p) && r < ct(a, p);
      }
      function Uf(r, a, p) {
        for (var Q = p ? P : I, x = r[0].length, D = r.length, k = D, G = rA(D), Y = 1 / 0, dA = []; k--; ) {
          var pA = r[k];
          k && a && (pA = V(pA, Ke(a))), Y = St(pA.length, Y), G[k] = !p && (a || x >= 120 && pA.length >= 120) ? new Ki(k && pA) : t;
        }
        pA = r[0];
        var CA = -1, SA = G[0];
        A:
          for (; ++CA < x && dA.length < Y; ) {
            var RA = pA[CA], ZA = a ? a(RA) : RA;
            if (RA = p || RA !== 0 ? RA : 0, !(SA ? Oi(SA, ZA) : Q(dA, ZA, p))) {
              for (k = D; --k; ) {
                var de = G[k];
                if (!(de ? Oi(de, ZA) : Q(r[k], ZA, p)))
                  continue A;
              }
              SA && SA.push(ZA), dA.push(RA);
            }
          }
        return dA;
      }
      function YC(r, a, p, Q) {
        return rr(r, function(x, D, k) {
          a(Q, p(x), D, k);
        }), Q;
      }
      function $o(r, a, p) {
        a = li(a, r), r = tB(r, a);
        var Q = r == null ? r : r[ar(wn(a))];
        return Q == null ? t : s(Q, r, p);
      }
      function gg(r) {
        return Ze(r) && Rt(r) == R;
      }
      function ZC(r) {
        return Ze(r) && Rt(r) == bt;
      }
      function AQ(r) {
        return Ze(r) && Rt(r) == qA;
      }
      function Go(r, a, p, Q, x) {
        return r === a ? !0 : r == null || a == null || !Ze(r) && !Ze(a) ? r !== r && a !== a : eQ(r, a, p, Q, Go, x);
      }
      function eQ(r, a, p, Q, x, D) {
        var k = le(r), G = le(a), Y = k ? nA : Lt(r), dA = G ? nA : Lt(a);
        Y = Y == R ? we : Y, dA = dA == R ? we : dA;
        var pA = Y == we, CA = dA == we, SA = Y == dA;
        if (SA && fi(r)) {
          if (!fi(a))
            return !1;
          k = !0, pA = !1;
        }
        if (SA && !pA)
          return D || (D = new Mn()), k || Ta(r) ? zg(r, a, p, Q, x, D) : _Q(r, a, Y, p, Q, x, D);
        if (!(p & u)) {
          var RA = pA && Ie.call(r, "__wrapped__"), ZA = CA && Ie.call(a, "__wrapped__");
          if (RA || ZA) {
            var de = RA ? r.value() : r, Ae = ZA ? a.value() : a;
            return D || (D = new Mn()), x(de, Ae, p, Q, D);
          }
        }
        return SA ? (D || (D = new Mn()), xQ(r, a, p, Q, x, D)) : !1;
      }
      function tQ(r) {
        return Ze(r) && Lt(r) == mA;
      }
      function Ef(r, a, p, Q) {
        var x = p.length, D = x, k = !Q;
        if (r == null)
          return !D;
        for (r = Ue(r); x--; ) {
          var G = p[x];
          if (k && G[2] ? G[1] !== r[G[0]] : !(G[0] in r))
            return !1;
        }
        for (; ++x < D; ) {
          G = p[x];
          var Y = G[0], dA = r[Y], pA = G[1];
          if (k && G[2]) {
            if (dA === t && !(Y in r))
              return !1;
          } else {
            var CA = new Mn();
            if (Q)
              var SA = Q(dA, pA, Y, r, a, CA);
            if (!(SA === t ? Go(pA, dA, u | C, Q, CA) : SA))
              return !1;
          }
        }
        return !0;
      }
      function Bg(r) {
        if (!je(r) || MQ(r))
          return !1;
        var a = Lr(r) ? tA : yo;
        return a.test(Gi(r));
      }
      function nQ(r) {
        return Ze(r) && Rt(r) == Le;
      }
      function rQ(r) {
        return Ze(r) && Lt(r) == ke;
      }
      function iQ(r) {
        return Ze(r) && Zu(r.length) && !!Ne[Rt(r)];
      }
      function wg(r) {
        return typeof r == "function" ? r : r == null ? jt : typeof r == "object" ? le(r) ? yg(r[0], r[1]) : vg(r) : KB(r);
      }
      function bf(r) {
        if (!Xo(r))
          return sC(r);
        var a = [];
        for (var p in Ue(r))
          Ie.call(r, p) && p != "constructor" && a.push(p);
        return a;
      }
      function aQ(r) {
        if (!je(r))
          return kQ(r);
        var a = Xo(r), p = [];
        for (var Q in r)
          Q == "constructor" && (a || !Ie.call(r, Q)) || p.push(Q);
        return p;
      }
      function _f(r, a) {
        return r < a;
      }
      function mg(r, a) {
        var p = -1, Q = zt(r) ? rA(r.length) : [];
        return si(r, function(x, D, k) {
          Q[++p] = a(x, D, k);
        }), Q;
      }
      function vg(r) {
        var a = $f(r);
        return a.length == 1 && a[0][2] ? AB(a[0][0], a[0][1]) : function(p) {
          return p === r || Ef(p, r, a);
        };
      }
      function yg(r, a) {
        return Vf(r) && Zg(a) ? AB(ar(r), a) : function(p) {
          var Q = eh(p, r);
          return Q === t && Q === a ? th(p, r) : Go(a, Q, u | C);
        };
      }
      function Nu(r, a, p, Q, x) {
        r !== a && Cf(a, function(D, k) {
          if (x || (x = new Mn()), je(D))
            oQ(r, a, k, p, Nu, Q, x);
          else {
            var G = Q ? Q(Xf(r, k), D, k + "", r, a, x) : t;
            G === t && (G = D), vf(r, k, G);
          }
        }, Jt);
      }
      function oQ(r, a, p, Q, x, D, k) {
        var G = Xf(r, p), Y = Xf(a, p), dA = k.get(Y);
        if (dA) {
          vf(r, p, dA);
          return;
        }
        var pA = D ? D(G, Y, p + "", r, a, k) : t, CA = pA === t;
        if (CA) {
          var SA = le(Y), RA = !SA && fi(Y), ZA = !SA && !RA && Ta(Y);
          pA = Y, SA || RA || ZA ? le(G) ? pA = G : nt(G) ? pA = qt(G) : RA ? (CA = !1, pA = Lg(Y, !0)) : ZA ? (CA = !1, pA = Tg(Y, !0)) : pA = [] : zo(Y) || Vi(Y) ? (pA = G, Vi(G) ? pA = IB(G) : (!je(G) || Lr(G)) && (pA = Yg(Y))) : CA = !1;
        }
        CA && (k.set(Y, pA), x(pA, Y, Q, D, k), k.delete(Y)), vf(r, p, pA);
      }
      function Cg(r, a) {
        var p = r.length;
        if (p)
          return a += a < 0 ? p : 0, Sr(a, p) ? r[a] : t;
      }
      function Qg(r, a, p) {
        a.length ? a = V(a, function(D) {
          return le(D) ? function(k) {
            return ki(k, D.length === 1 ? D[0] : D);
          } : D;
        }) : a = [jt];
        var Q = -1;
        a = V(a, Ke(JA()));
        var x = mg(r, function(D, k, G) {
          var Y = V(a, function(dA) {
            return dA(D);
          });
          return { criteria: Y, index: ++Q, value: D };
        });
        return Fa(x, function(D, k) {
          return vQ(D, k, p);
        });
      }
      function sQ(r, a) {
        return Fg(r, a, function(p, Q) {
          return th(r, Q);
        });
      }
      function Fg(r, a, p) {
        for (var Q = -1, x = a.length, D = {}; ++Q < x; ) {
          var k = a[Q], G = ki(r, k);
          p(G, k) && Vo(D, li(k, r), G);
        }
        return D;
      }
      function uQ(r) {
        return function(a) {
          return ki(a, r);
        };
      }
      function xf(r, a, p, Q) {
        var x = Q ? Zn : ze, D = -1, k = a.length, G = r;
        for (r === a && (a = qt(a)), p && (G = V(r, Ke(p))); ++D < k; )
          for (var Y = 0, dA = a[D], pA = p ? p(dA) : dA; (Y = x(G, pA, Y, Q)) > -1; )
            G !== r && ce.call(G, Y, 1), ce.call(r, Y, 1);
        return r;
      }
      function Ug(r, a) {
        for (var p = r ? a.length : 0, Q = p - 1; p--; ) {
          var x = a[p];
          if (p == Q || x !== D) {
            var D = x;
            Sr(x) ? ce.call(r, x, 1) : Lf(r, x);
          }
        }
        return r;
      }
      function If(r, a) {
        return r + pt(ig() * (a - r + 1));
      }
      function lQ(r, a, p, Q) {
        for (var x = -1, D = ct(nr((a - r) / (p || 1)), 0), k = rA(D); D--; )
          k[Q ? D : ++x] = r, r += p;
        return k;
      }
      function Hf(r, a) {
        var p = "";
        if (!r || a < 1 || a > bA)
          return p;
        do
          a % 2 && (p += r), a = pt(a / 2), a && (r += r);
        while (a);
        return p;
      }
      function pe(r, a) {
        return qf(eB(r, a, jt), r + "");
      }
      function cQ(r) {
        return sg(Da(r));
      }
      function fQ(r, a) {
        var p = Da(r);
        return Xu(p, Ri(a, 0, p.length));
      }
      function Vo(r, a, p, Q) {
        if (!je(r))
          return r;
        a = li(a, r);
        for (var x = -1, D = a.length, k = D - 1, G = r; G != null && ++x < D; ) {
          var Y = ar(a[x]), dA = p;
          if (Y === "__proto__" || Y === "constructor" || Y === "prototype")
            return r;
          if (x != k) {
            var pA = G[Y];
            dA = Q ? Q(pA, Y, G) : t, dA === t && (dA = je(pA) ? pA : Sr(a[x + 1]) ? [] : {});
          }
          Ro(G, Y, dA), G = G[Y];
        }
        return r;
      }
      var Eg = Hu ? function(r, a) {
        return Hu.set(r, a), r;
      } : jt, hQ = tt ? function(r, a) {
        return tt(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: rh(a),
          writable: !0
        });
      } : jt;
      function dQ(r) {
        return Xu(Da(r));
      }
      function Bn(r, a, p) {
        var Q = -1, x = r.length;
        a < 0 && (a = -a > x ? 0 : x + a), p = p > x ? x : p, p < 0 && (p += x), x = a > p ? 0 : p - a >>> 0, a >>>= 0;
        for (var D = rA(x); ++Q < x; )
          D[Q] = r[Q + a];
        return D;
      }
      function pQ(r, a) {
        var p;
        return si(r, function(Q, x, D) {
          return p = a(Q, x, D), !p;
        }), !!p;
      }
      function Mu(r, a, p) {
        var Q = 0, x = r == null ? Q : r.length;
        if (typeof a == "number" && a === a && x <= J) {
          for (; Q < x; ) {
            var D = Q + x >>> 1, k = r[D];
            k !== null && !an(k) && (p ? k <= a : k < a) ? Q = D + 1 : x = D;
          }
          return x;
        }
        return Sf(r, a, jt, p);
      }
      function Sf(r, a, p, Q) {
        var x = 0, D = r == null ? 0 : r.length;
        if (D === 0)
          return 0;
        a = p(a);
        for (var k = a !== a, G = a === null, Y = an(a), dA = a === t; x < D; ) {
          var pA = pt((x + D) / 2), CA = p(r[pA]), SA = CA !== t, RA = CA === null, ZA = CA === CA, de = an(CA);
          if (k)
            var Ae = Q || ZA;
          else dA ? Ae = ZA && (Q || SA) : G ? Ae = ZA && SA && (Q || !RA) : Y ? Ae = ZA && SA && !RA && (Q || !de) : RA || de ? Ae = !1 : Ae = Q ? CA <= a : CA < a;
          Ae ? x = pA + 1 : D = pA;
        }
        return St(D, AA);
      }
      function bg(r, a) {
        for (var p = -1, Q = r.length, x = 0, D = []; ++p < Q; ) {
          var k = r[p], G = a ? a(k) : k;
          if (!p || !Pn(G, Y)) {
            var Y = G;
            D[x++] = k === 0 ? 0 : k;
          }
        }
        return D;
      }
      function _g(r) {
        return typeof r == "number" ? r : an(r) ? iA : +r;
      }
      function rn(r) {
        if (typeof r == "string")
          return r;
        if (le(r))
          return V(r, rn) + "";
        if (an(r))
          return ag ? ag.call(r) : "";
        var a = r + "";
        return a == "0" && 1 / r == -fA ? "-0" : a;
      }
      function ui(r, a, p) {
        var Q = -1, x = I, D = r.length, k = !0, G = [], Y = G;
        if (p)
          k = !1, x = P;
        else if (D >= i) {
          var dA = a ? null : EQ(r);
          if (dA)
            return Ea(dA);
          k = !1, x = Oi, Y = new Ki();
        } else
          Y = a ? [] : G;
        A:
          for (; ++Q < D; ) {
            var pA = r[Q], CA = a ? a(pA) : pA;
            if (pA = p || pA !== 0 ? pA : 0, k && CA === CA) {
              for (var SA = Y.length; SA--; )
                if (Y[SA] === CA)
                  continue A;
              a && Y.push(CA), G.push(pA);
            } else x(Y, CA, p) || (Y !== G && Y.push(CA), G.push(pA));
          }
        return G;
      }
      function Lf(r, a) {
        return a = li(a, r), r = tB(r, a), r == null || delete r[ar(wn(a))];
      }
      function xg(r, a, p, Q) {
        return Vo(r, a, p(ki(r, a)), Q);
      }
      function Pu(r, a, p, Q) {
        for (var x = r.length, D = Q ? x : -1; (Q ? D-- : ++D < x) && a(r[D], D, r); )
          ;
        return p ? Bn(r, Q ? 0 : D, Q ? D + 1 : x) : Bn(r, Q ? D + 1 : 0, Q ? x : D);
      }
      function Ig(r, a) {
        var p = r;
        return p instanceof Ce && (p = p.value()), Z(a, function(Q, x) {
          return x.func.apply(x.thisArg, X([Q], x.args));
        }, p);
      }
      function Tf(r, a, p) {
        var Q = r.length;
        if (Q < 2)
          return Q ? ui(r[0]) : [];
        for (var x = -1, D = rA(Q); ++x < Q; )
          for (var k = r[x], G = -1; ++G < Q; )
            G != x && (D[x] = ko(D[x] || k, r[G], a, p));
        return ui(yt(D, 1), a, p);
      }
      function Hg(r, a, p) {
        for (var Q = -1, x = r.length, D = a.length, k = {}; ++Q < x; ) {
          var G = Q < D ? a[Q] : t;
          p(k, r[Q], G);
        }
        return k;
      }
      function Df(r) {
        return nt(r) ? r : [];
      }
      function Of(r) {
        return typeof r == "function" ? r : jt;
      }
      function li(r, a) {
        return le(r) ? r : Vf(r, a) ? [r] : aB(De(r));
      }
      var gQ = pe;
      function ci(r, a, p) {
        var Q = r.length;
        return p = p === t ? Q : p, !a && p >= Q ? r : Bn(r, a, p);
      }
      var Sg = Kt || function(r) {
        return At.clearTimeout(r);
      };
      function Lg(r, a) {
        if (a)
          return r.slice();
        var p = r.length, Q = $A ? $A(p) : new r.constructor(p);
        return r.copy(Q), Q;
      }
      function Nf(r) {
        var a = new r.constructor(r.byteLength);
        return new IA(a).set(new IA(r)), a;
      }
      function BQ(r, a) {
        var p = a ? Nf(r.buffer) : r.buffer;
        return new r.constructor(p, r.byteOffset, r.byteLength);
      }
      function wQ(r) {
        var a = new r.constructor(r.source, jn.exec(r));
        return a.lastIndex = r.lastIndex, a;
      }
      function mQ(r) {
        return Ko ? Ue(Ko.call(r)) : {};
      }
      function Tg(r, a) {
        var p = a ? Nf(r.buffer) : r.buffer;
        return new r.constructor(p, r.byteOffset, r.length);
      }
      function Dg(r, a) {
        if (r !== a) {
          var p = r !== t, Q = r === null, x = r === r, D = an(r), k = a !== t, G = a === null, Y = a === a, dA = an(a);
          if (!G && !dA && !D && r > a || D && k && Y && !G && !dA || Q && k && Y || !p && Y || !x)
            return 1;
          if (!Q && !D && !dA && r < a || dA && p && x && !Q && !D || G && p && x || !k && x || !Y)
            return -1;
        }
        return 0;
      }
      function vQ(r, a, p) {
        for (var Q = -1, x = r.criteria, D = a.criteria, k = x.length, G = p.length; ++Q < k; ) {
          var Y = Dg(x[Q], D[Q]);
          if (Y) {
            if (Q >= G)
              return Y;
            var dA = p[Q];
            return Y * (dA == "desc" ? -1 : 1);
          }
        }
        return r.index - a.index;
      }
      function Og(r, a, p, Q) {
        for (var x = -1, D = r.length, k = p.length, G = -1, Y = a.length, dA = ct(D - k, 0), pA = rA(Y + dA), CA = !Q; ++G < Y; )
          pA[G] = a[G];
        for (; ++x < k; )
          (CA || x < D) && (pA[p[x]] = r[x]);
        for (; dA--; )
          pA[G++] = r[x++];
        return pA;
      }
      function Ng(r, a, p, Q) {
        for (var x = -1, D = r.length, k = -1, G = p.length, Y = -1, dA = a.length, pA = ct(D - G, 0), CA = rA(pA + dA), SA = !Q; ++x < pA; )
          CA[x] = r[x];
        for (var RA = x; ++Y < dA; )
          CA[RA + Y] = a[Y];
        for (; ++k < G; )
          (SA || x < D) && (CA[RA + p[k]] = r[x++]);
        return CA;
      }
      function qt(r, a) {
        var p = -1, Q = r.length;
        for (a || (a = rA(Q)); ++p < Q; )
          a[p] = r[p];
        return a;
      }
      function ir(r, a, p, Q) {
        var x = !p;
        p || (p = {});
        for (var D = -1, k = a.length; ++D < k; ) {
          var G = a[D], Y = Q ? Q(p[G], r[G], G, p, r) : t;
          Y === t && (Y = r[G]), x ? xr(p, G, Y) : Ro(p, G, Y);
        }
        return p;
      }
      function yQ(r, a) {
        return ir(r, Gf(r), a);
      }
      function CQ(r, a) {
        return ir(r, Jg(r), a);
      }
      function Ku(r, a) {
        return function(p, Q) {
          var x = le(p) ? d : GC, D = a ? a() : {};
          return x(p, r, JA(Q, 2), D);
        };
      }
      function Ha(r) {
        return pe(function(a, p) {
          var Q = -1, x = p.length, D = x > 1 ? p[x - 1] : t, k = x > 2 ? p[2] : t;
          for (D = r.length > 3 && typeof D == "function" ? (x--, D) : t, k && kt(p[0], p[1], k) && (D = x < 3 ? t : D, x = 1), a = Ue(a); ++Q < x; ) {
            var G = p[Q];
            G && r(a, G, Q, D);
          }
          return a;
        });
      }
      function Mg(r, a) {
        return function(p, Q) {
          if (p == null)
            return p;
          if (!zt(p))
            return r(p, Q);
          for (var x = p.length, D = a ? x : -1, k = Ue(p); (a ? D-- : ++D < x) && Q(k[D], D, k) !== !1; )
            ;
          return p;
        };
      }
      function Pg(r) {
        return function(a, p, Q) {
          for (var x = -1, D = Ue(a), k = Q(a), G = k.length; G--; ) {
            var Y = k[r ? G : ++x];
            if (p(D[Y], Y, D) === !1)
              break;
          }
          return a;
        };
      }
      function QQ(r, a, p) {
        var Q = a & F, x = Wo(r);
        function D() {
          var k = this && this !== At && this instanceof D ? x : r;
          return k.apply(Q ? p : this, arguments);
        }
        return D;
      }
      function Kg(r) {
        return function(a) {
          a = De(a);
          var p = er(a) ? mt(a) : t, Q = p ? p[0] : a.charAt(0), x = p ? ci(p, 1).join("") : a.slice(1);
          return Q[r]() + x;
        };
      }
      function Sa(r) {
        return function(a) {
          return Z(MB(NB(a).replace(gu, "")), r, "");
        };
      }
      function Wo(r) {
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
          var p = Ia(r.prototype), Q = r.apply(p, a);
          return je(Q) ? Q : p;
        };
      }
      function FQ(r, a, p) {
        var Q = Wo(r);
        function x() {
          for (var D = arguments.length, k = rA(D), G = D, Y = La(x); G--; )
            k[G] = arguments[G];
          var dA = D < 3 && k[0] !== Y && k[D - 1] !== Y ? [] : tr(k, Y);
          if (D -= dA.length, D < p)
            return Vg(
              r,
              a,
              Ru,
              x.placeholder,
              t,
              k,
              dA,
              t,
              t,
              p - D
            );
          var pA = this && this !== At && this instanceof x ? Q : r;
          return s(pA, this, k);
        }
        return x;
      }
      function Rg(r) {
        return function(a, p, Q) {
          var x = Ue(a);
          if (!zt(a)) {
            var D = JA(p, 3);
            a = gt(a), p = function(G) {
              return D(x[G], G, x);
            };
          }
          var k = r(a, p, Q);
          return k > -1 ? x[D ? a[k] : k] : t;
        };
      }
      function kg(r) {
        return Hr(function(a) {
          var p = a.length, Q = p, x = pn.prototype.thru;
          for (r && a.reverse(); Q--; ) {
            var D = a[Q];
            if (typeof D != "function")
              throw new vt(l);
            if (x && !k && Vu(D) == "wrapper")
              var k = new pn([], !0);
          }
          for (Q = k ? Q : p; ++Q < p; ) {
            D = a[Q];
            var G = Vu(D), Y = G == "wrapper" ? kf(D) : t;
            Y && Wf(Y[0]) && Y[1] == (z | O | M | cA) && !Y[4].length && Y[9] == 1 ? k = k[Vu(Y[0])].apply(k, Y[3]) : k = D.length == 1 && Wf(D) ? k[G]() : k.thru(D);
          }
          return function() {
            var dA = arguments, pA = dA[0];
            if (k && dA.length == 1 && le(pA))
              return k.plant(pA).value();
            for (var CA = 0, SA = p ? a[CA].apply(this, dA) : pA; ++CA < p; )
              SA = a[CA].call(this, SA);
            return SA;
          };
        });
      }
      function Ru(r, a, p, Q, x, D, k, G, Y, dA) {
        var pA = a & z, CA = a & F, SA = a & U, RA = a & (O | _), ZA = a & sA, de = SA ? t : Wo(r);
        function Ae() {
          for (var ye = arguments.length, Ee = rA(ye), on = ye; on--; )
            Ee[on] = arguments[on];
          if (RA)
            var $t = La(Ae), sn = Fr(Ee, $t);
          if (Q && (Ee = Og(Ee, Q, x, RA)), D && (Ee = Ng(Ee, D, k, RA)), ye -= sn, RA && ye < dA) {
            var rt = tr(Ee, $t);
            return Vg(
              r,
              a,
              Ru,
              Ae.placeholder,
              p,
              Ee,
              rt,
              G,
              Y,
              dA - ye
            );
          }
          var Kn = CA ? p : this, Dr = SA ? Kn[r] : r;
          return ye = Ee.length, G ? Ee = GQ(Ee, G) : ZA && ye > 1 && Ee.reverse(), pA && Y < ye && (Ee.length = Y), this && this !== At && this instanceof Ae && (Dr = de || Wo(Dr)), Dr.apply(Kn, Ee);
        }
        return Ae;
      }
      function $g(r, a) {
        return function(p, Q) {
          return YC(p, r, a(Q), {});
        };
      }
      function ku(r, a) {
        return function(p, Q) {
          var x;
          if (p === t && Q === t)
            return a;
          if (p !== t && (x = p), Q !== t) {
            if (x === t)
              return Q;
            typeof p == "string" || typeof Q == "string" ? (p = rn(p), Q = rn(Q)) : (p = _g(p), Q = _g(Q)), x = r(p, Q);
          }
          return x;
        };
      }
      function Mf(r) {
        return Hr(function(a) {
          return a = V(a, Ke(JA())), pe(function(p) {
            var Q = this;
            return r(a, function(x) {
              return s(x, Q, p);
            });
          });
        });
      }
      function $u(r, a) {
        a = a === t ? " " : rn(a);
        var p = a.length;
        if (p < 2)
          return p ? Hf(a, r) : a;
        var Q = Hf(a, nr(r / ri(a)));
        return er(a) ? ci(mt(Q), 0, r).join("") : Q.slice(0, r);
      }
      function UQ(r, a, p, Q) {
        var x = a & F, D = Wo(r);
        function k() {
          for (var G = -1, Y = arguments.length, dA = -1, pA = Q.length, CA = rA(pA + Y), SA = this && this !== At && this instanceof k ? D : r; ++dA < pA; )
            CA[dA] = Q[dA];
          for (; Y--; )
            CA[dA++] = arguments[++G];
          return s(SA, x ? p : this, CA);
        }
        return k;
      }
      function Gg(r) {
        return function(a, p, Q) {
          return Q && typeof Q != "number" && kt(a, p, Q) && (p = Q = t), a = Tr(a), p === t ? (p = a, a = 0) : p = Tr(p), Q = Q === t ? a < p ? 1 : -1 : Tr(Q), lQ(a, p, Q, r);
        };
      }
      function Gu(r) {
        return function(a, p) {
          return typeof a == "string" && typeof p == "string" || (a = mn(a), p = mn(p)), r(a, p);
        };
      }
      function Vg(r, a, p, Q, x, D, k, G, Y, dA) {
        var pA = a & O, CA = pA ? k : t, SA = pA ? t : k, RA = pA ? D : t, ZA = pA ? t : D;
        a |= pA ? M : K, a &= ~(pA ? K : M), a & H || (a &= ~(F | U));
        var de = [
          r,
          a,
          x,
          RA,
          CA,
          ZA,
          SA,
          G,
          Y,
          dA
        ], Ae = p.apply(t, de);
        return Wf(r) && nB(Ae, de), Ae.placeholder = Q, rB(Ae, r, a);
      }
      function Pf(r) {
        var a = et[r];
        return function(p, Q) {
          if (p = mn(p), Q = Q == null ? 0 : St(fe(Q), 292), Q && rg(p)) {
            var x = (De(p) + "e").split("e"), D = a(x[0] + "e" + (+x[1] + Q));
            return x = (De(D) + "e").split("e"), +(x[0] + "e" + (+x[1] - Q));
          }
          return a(p);
        };
      }
      var EQ = _a && 1 / Ea(new _a([, -0]))[1] == fA ? function(r) {
        return new _a(r);
      } : oh;
      function Wg(r) {
        return function(a) {
          var p = Lt(a);
          return p == mA ? To(a) : p == ke ? bu(a) : Ar(a, r(a));
        };
      }
      function Ir(r, a, p, Q, x, D, k, G) {
        var Y = a & U;
        if (!Y && typeof r != "function")
          throw new vt(l);
        var dA = Q ? Q.length : 0;
        if (dA || (a &= ~(M | K), Q = x = t), k = k === t ? k : ct(fe(k), 0), G = G === t ? G : fe(G), dA -= x ? x.length : 0, a & K) {
          var pA = Q, CA = x;
          Q = x = t;
        }
        var SA = Y ? t : kf(r), RA = [
          r,
          a,
          p,
          Q,
          x,
          pA,
          CA,
          D,
          k,
          G
        ];
        if (SA && RQ(RA, SA), r = RA[0], a = RA[1], p = RA[2], Q = RA[3], x = RA[4], G = RA[9] = RA[9] === t ? Y ? 0 : r.length : ct(RA[9] - dA, 0), !G && a & (O | _) && (a &= ~(O | _)), !a || a == F)
          var ZA = QQ(r, a, p);
        else a == O || a == _ ? ZA = FQ(r, a, G) : (a == M || a == (F | M)) && !x.length ? ZA = UQ(r, a, p, Q) : ZA = Ru.apply(t, RA);
        var de = SA ? Eg : nB;
        return rB(de(ZA, RA), r, a);
      }
      function Xg(r, a, p, Q) {
        return r === t || Pn(r, ai[p]) && !Ie.call(Q, p) ? a : r;
      }
      function qg(r, a, p, Q, x, D) {
        return je(r) && je(a) && (D.set(a, r), Nu(r, a, t, qg, D), D.delete(a)), r;
      }
      function bQ(r) {
        return zo(r) ? t : r;
      }
      function zg(r, a, p, Q, x, D) {
        var k = p & u, G = r.length, Y = a.length;
        if (G != Y && !(k && Y > G))
          return !1;
        var dA = D.get(r), pA = D.get(a);
        if (dA && pA)
          return dA == a && pA == r;
        var CA = -1, SA = !0, RA = p & C ? new Ki() : t;
        for (D.set(r, a), D.set(a, r); ++CA < G; ) {
          var ZA = r[CA], de = a[CA];
          if (Q)
            var Ae = k ? Q(de, ZA, CA, a, r, D) : Q(ZA, de, CA, r, a, D);
          if (Ae !== t) {
            if (Ae)
              continue;
            SA = !1;
            break;
          }
          if (RA) {
            if (!HA(a, function(ye, Ee) {
              if (!Oi(RA, Ee) && (ZA === ye || x(ZA, ye, p, Q, D)))
                return RA.push(Ee);
            })) {
              SA = !1;
              break;
            }
          } else if (!(ZA === de || x(ZA, de, p, Q, D))) {
            SA = !1;
            break;
          }
        }
        return D.delete(r), D.delete(a), SA;
      }
      function _Q(r, a, p, Q, x, D, k) {
        switch (p) {
          case wt:
            if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
              return !1;
            r = r.buffer, a = a.buffer;
          case bt:
            return !(r.byteLength != a.byteLength || !D(new IA(r), new IA(a)));
          case UA:
          case qA:
          case EA:
            return Pn(+r, +a);
          case zA:
            return r.name == a.name && r.message == a.message;
          case Le:
          case Me:
            return r == a + "";
          case mA:
            var G = To;
          case ke:
            var Y = Q & u;
            if (G || (G = Ea), r.size != a.size && !Y)
              return !1;
            var dA = k.get(r);
            if (dA)
              return dA == a;
            Q |= C, k.set(r, a);
            var pA = zg(G(r), G(a), Q, x, D, k);
            return k.delete(r), pA;
          case be:
            if (Ko)
              return Ko.call(r) == Ko.call(a);
        }
        return !1;
      }
      function xQ(r, a, p, Q, x, D) {
        var k = p & u, G = Kf(r), Y = G.length, dA = Kf(a), pA = dA.length;
        if (Y != pA && !k)
          return !1;
        for (var CA = Y; CA--; ) {
          var SA = G[CA];
          if (!(k ? SA in a : Ie.call(a, SA)))
            return !1;
        }
        var RA = D.get(r), ZA = D.get(a);
        if (RA && ZA)
          return RA == a && ZA == r;
        var de = !0;
        D.set(r, a), D.set(a, r);
        for (var Ae = k; ++CA < Y; ) {
          SA = G[CA];
          var ye = r[SA], Ee = a[SA];
          if (Q)
            var on = k ? Q(Ee, ye, SA, a, r, D) : Q(ye, Ee, SA, r, a, D);
          if (!(on === t ? ye === Ee || x(ye, Ee, p, Q, D) : on)) {
            de = !1;
            break;
          }
          Ae || (Ae = SA == "constructor");
        }
        if (de && !Ae) {
          var $t = r.constructor, sn = a.constructor;
          $t != sn && "constructor" in r && "constructor" in a && !(typeof $t == "function" && $t instanceof $t && typeof sn == "function" && sn instanceof sn) && (de = !1);
        }
        return D.delete(r), D.delete(a), de;
      }
      function Hr(r) {
        return qf(eB(r, t, lB), r + "");
      }
      function Kf(r) {
        return pg(r, gt, Gf);
      }
      function Rf(r) {
        return pg(r, Jt, Jg);
      }
      var kf = Hu ? function(r) {
        return Hu.get(r);
      } : oh;
      function Vu(r) {
        for (var a = r.name + "", p = xa[a], Q = Ie.call(xa, a) ? p.length : 0; Q--; ) {
          var x = p[Q], D = x.func;
          if (D == null || D == r)
            return x.name;
        }
        return a;
      }
      function La(r) {
        var a = Ie.call(S, "placeholder") ? S : r;
        return a.placeholder;
      }
      function JA() {
        var r = S.iteratee || ih;
        return r = r === ih ? wg : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Wu(r, a) {
        var p = r.__data__;
        return NQ(a) ? p[typeof a == "string" ? "string" : "hash"] : p.map;
      }
      function $f(r) {
        for (var a = gt(r), p = a.length; p--; ) {
          var Q = a[p], x = r[Q];
          a[p] = [Q, x, Zg(x)];
        }
        return a;
      }
      function $i(r, a) {
        var p = Uu(r, a);
        return Bg(p) ? p : t;
      }
      function IQ(r) {
        var a = Ie.call(r, $e), p = r[$e];
        try {
          r[$e] = t;
          var Q = !0;
        } catch {
        }
        var x = $.call(r);
        return Q && (a ? r[$e] = p : delete r[$e]), x;
      }
      var Gf = Bf ? function(r) {
        return r == null ? [] : (r = Ue(r), b(Bf(r), function(a) {
          return YA.call(r, a);
        }));
      } : sh, Jg = Bf ? function(r) {
        for (var a = []; r; )
          X(a, Gf(r)), r = ne(r);
        return a;
      } : sh, Lt = Rt;
      (wf && Lt(new wf(new ArrayBuffer(1))) != wt || No && Lt(new No()) != mA || mf && Lt(mf.resolve()) != Fe || _a && Lt(new _a()) != ke || Mo && Lt(new Mo()) != Et) && (Lt = function(r) {
        var a = Rt(r), p = a == we ? r.constructor : t, Q = p ? Gi(p) : "";
        if (Q)
          switch (Q) {
            case fC:
              return wt;
            case hC:
              return mA;
            case dC:
              return Fe;
            case pC:
              return ke;
            case gC:
              return Et;
          }
        return a;
      });
      function HQ(r, a, p) {
        for (var Q = -1, x = p.length; ++Q < x; ) {
          var D = p[Q], k = D.size;
          switch (D.type) {
            case "drop":
              r += k;
              break;
            case "dropRight":
              a -= k;
              break;
            case "take":
              a = St(a, r + k);
              break;
            case "takeRight":
              r = ct(r, a - k);
              break;
          }
        }
        return { start: r, end: a };
      }
      function SQ(r) {
        var a = r.match(Zs);
        return a ? a[1].split(ha) : [];
      }
      function jg(r, a, p) {
        a = li(a, r);
        for (var Q = -1, x = a.length, D = !1; ++Q < x; ) {
          var k = ar(a[Q]);
          if (!(D = r != null && p(r, k)))
            break;
          r = r[k];
        }
        return D || ++Q != x ? D : (x = r == null ? 0 : r.length, !!x && Zu(x) && Sr(k, x) && (le(r) || Vi(r)));
      }
      function LQ(r) {
        var a = r.length, p = new r.constructor(a);
        return a && typeof r[0] == "string" && Ie.call(r, "index") && (p.index = r.index, p.input = r.input), p;
      }
      function Yg(r) {
        return typeof r.constructor == "function" && !Xo(r) ? Ia(ne(r)) : {};
      }
      function TQ(r, a, p) {
        var Q = r.constructor;
        switch (a) {
          case bt:
            return Nf(r);
          case UA:
          case qA:
            return new Q(+r);
          case wt:
            return BQ(r, p);
          case fn:
          case mr:
          case _i:
          case qr:
          case zr:
          case lA:
          case TA:
          case WA:
          case me:
            return Tg(r, p);
          case mA:
            return new Q();
          case EA:
          case Me:
            return new Q(r);
          case Le:
            return wQ(r);
          case ke:
            return new Q();
          case be:
            return mQ(r);
        }
      }
      function DQ(r, a) {
        var p = a.length;
        if (!p)
          return r;
        var Q = p - 1;
        return a[Q] = (p > 1 ? "& " : "") + a[Q], a = a.join(p > 2 ? ", " : " "), r.replace(Ys, `{
/* [wrapped with ` + a + `] */
`);
      }
      function OQ(r) {
        return le(r) || Vi(r) || !!(Se && r && r[Se]);
      }
      function Sr(r, a) {
        var p = typeof r;
        return a = a ?? bA, !!a && (p == "number" || p != "symbol" && Yc.test(r)) && r > -1 && r % 1 == 0 && r < a;
      }
      function kt(r, a, p) {
        if (!je(p))
          return !1;
        var Q = typeof a;
        return (Q == "number" ? zt(p) && Sr(a, p.length) : Q == "string" && a in p) ? Pn(p[a], r) : !1;
      }
      function Vf(r, a) {
        if (le(r))
          return !1;
        var p = typeof r;
        return p == "number" || p == "symbol" || p == "boolean" || r == null || an(r) ? !0 : vr.test(r) || !jr.test(r) || a != null && r in Ue(a);
      }
      function NQ(r) {
        var a = typeof r;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
      }
      function Wf(r) {
        var a = Vu(r), p = S[a];
        if (typeof p != "function" || !(a in Ce.prototype))
          return !1;
        if (r === p)
          return !0;
        var Q = kf(p);
        return !!Q && r === Q[0];
      }
      function MQ(r) {
        return !!N && N in r;
      }
      var PQ = Er ? Lr : uh;
      function Xo(r) {
        var a = r && r.constructor, p = typeof a == "function" && a.prototype || ai;
        return r === p;
      }
      function Zg(r) {
        return r === r && !je(r);
      }
      function AB(r, a) {
        return function(p) {
          return p == null ? !1 : p[r] === a && (a !== t || r in Ue(p));
        };
      }
      function KQ(r) {
        var a = ju(r, function(Q) {
          return p.size === h && p.clear(), Q;
        }), p = a.cache;
        return a;
      }
      function RQ(r, a) {
        var p = r[1], Q = a[1], x = p | Q, D = x < (F | U | z), k = Q == z && p == O || Q == z && p == cA && r[7].length <= a[8] || Q == (z | cA) && a[7].length <= a[8] && p == O;
        if (!(D || k))
          return r;
        Q & F && (r[2] = a[2], x |= p & F ? 0 : H);
        var G = a[3];
        if (G) {
          var Y = r[3];
          r[3] = Y ? Og(Y, G, a[4]) : G, r[4] = Y ? tr(r[3], m) : a[4];
        }
        return G = a[5], G && (Y = r[5], r[5] = Y ? Ng(Y, G, a[6]) : G, r[6] = Y ? tr(r[5], m) : a[6]), G = a[7], G && (r[7] = G), Q & z && (r[8] = r[8] == null ? a[8] : St(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = x, r;
      }
      function kQ(r) {
        var a = [];
        if (r != null)
          for (var p in Ue(r))
            a.push(p);
        return a;
      }
      function $Q(r) {
        return $.call(r);
      }
      function eB(r, a, p) {
        return a = ct(a === t ? r.length - 1 : a, 0), function() {
          for (var Q = arguments, x = -1, D = ct(Q.length - a, 0), k = rA(D); ++x < D; )
            k[x] = Q[a + x];
          x = -1;
          for (var G = rA(a + 1); ++x < a; )
            G[x] = Q[x];
          return G[a] = p(k), s(r, this, G);
        };
      }
      function tB(r, a) {
        return a.length < 2 ? r : ki(r, Bn(a, 0, -1));
      }
      function GQ(r, a) {
        for (var p = r.length, Q = St(a.length, p), x = qt(r); Q--; ) {
          var D = a[Q];
          r[Q] = Sr(D, p) ? x[D] : t;
        }
        return r;
      }
      function Xf(r, a) {
        if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
          return r[a];
      }
      var nB = iB(Eg), qo = Mi || function(r, a) {
        return At.setTimeout(r, a);
      }, qf = iB(hQ);
      function rB(r, a, p) {
        var Q = a + "";
        return qf(r, DQ(Q, VQ(SQ(Q), p)));
      }
      function iB(r) {
        var a = 0, p = 0;
        return function() {
          var Q = uC(), x = _A - (Q - p);
          if (p = Q, x > 0) {
            if (++a >= OA)
              return arguments[0];
          } else
            a = 0;
          return r.apply(t, arguments);
        };
      }
      function Xu(r, a) {
        var p = -1, Q = r.length, x = Q - 1;
        for (a = a === t ? Q : a; ++p < a; ) {
          var D = If(p, x), k = r[D];
          r[D] = r[p], r[p] = k;
        }
        return r.length = a, r;
      }
      var aB = KQ(function(r) {
        var a = [];
        return r.charCodeAt(0) === 46 && a.push(""), r.replace(js, function(p, Q, x, D) {
          a.push(x ? D.replace(vo, "$1") : Q || p);
        }), a;
      });
      function ar(r) {
        if (typeof r == "string" || an(r))
          return r;
        var a = r + "";
        return a == "0" && 1 / r == -fA ? "-0" : a;
      }
      function Gi(r) {
        if (r != null) {
          try {
            return oi.call(r);
          } catch {
          }
          try {
            return r + "";
          } catch {
          }
        }
        return "";
      }
      function VQ(r, a) {
        return w(L, function(p) {
          var Q = "_." + p[0];
          a & p[1] && !I(r, Q) && r.push(Q);
        }), r.sort();
      }
      function oB(r) {
        if (r instanceof Ce)
          return r.clone();
        var a = new pn(r.__wrapped__, r.__chain__);
        return a.__actions__ = qt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
      }
      function WQ(r, a, p) {
        (p ? kt(r, a, p) : a === t) ? a = 1 : a = ct(fe(a), 0);
        var Q = r == null ? 0 : r.length;
        if (!Q || a < 1)
          return [];
        for (var x = 0, D = 0, k = rA(nr(Q / a)); x < Q; )
          k[D++] = Bn(r, x, x += a);
        return k;
      }
      function XQ(r) {
        for (var a = -1, p = r == null ? 0 : r.length, Q = 0, x = []; ++a < p; ) {
          var D = r[a];
          D && (x[Q++] = D);
        }
        return x;
      }
      function qQ() {
        var r = arguments.length;
        if (!r)
          return [];
        for (var a = rA(r - 1), p = arguments[0], Q = r; Q--; )
          a[Q - 1] = arguments[Q];
        return X(le(p) ? qt(p) : [p], yt(a, 1));
      }
      var zQ = pe(function(r, a) {
        return nt(r) ? ko(r, yt(a, 1, nt, !0)) : [];
      }), JQ = pe(function(r, a) {
        var p = wn(a);
        return nt(p) && (p = t), nt(r) ? ko(r, yt(a, 1, nt, !0), JA(p, 2)) : [];
      }), jQ = pe(function(r, a) {
        var p = wn(a);
        return nt(p) && (p = t), nt(r) ? ko(r, yt(a, 1, nt, !0), t, p) : [];
      });
      function YQ(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : fe(a), Bn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function ZQ(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : fe(a), a = Q - a, Bn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function AF(r, a) {
        return r && r.length ? Pu(r, JA(a, 3), !0, !0) : [];
      }
      function eF(r, a) {
        return r && r.length ? Pu(r, JA(a, 3), !0) : [];
      }
      function tF(r, a, p, Q) {
        var x = r == null ? 0 : r.length;
        return x ? (p && typeof p != "number" && kt(r, a, p) && (p = 0, Q = x), qC(r, a, p, Q)) : [];
      }
      function sB(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = p == null ? 0 : fe(p);
        return x < 0 && (x = ct(Q + x, 0)), dt(r, JA(a, 3), x);
      }
      function uB(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = Q - 1;
        return p !== t && (x = fe(p), x = p < 0 ? ct(Q + x, 0) : St(x, Q - 1)), dt(r, JA(a, 3), x, !0);
      }
      function lB(r) {
        var a = r == null ? 0 : r.length;
        return a ? yt(r, 1) : [];
      }
      function nF(r) {
        var a = r == null ? 0 : r.length;
        return a ? yt(r, fA) : [];
      }
      function rF(r, a) {
        var p = r == null ? 0 : r.length;
        return p ? (a = a === t ? 1 : fe(a), yt(r, a)) : [];
      }
      function iF(r) {
        for (var a = -1, p = r == null ? 0 : r.length, Q = {}; ++a < p; ) {
          var x = r[a];
          Q[x[0]] = x[1];
        }
        return Q;
      }
      function cB(r) {
        return r && r.length ? r[0] : t;
      }
      function aF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = p == null ? 0 : fe(p);
        return x < 0 && (x = ct(Q + x, 0)), ze(r, a, x);
      }
      function oF(r) {
        var a = r == null ? 0 : r.length;
        return a ? Bn(r, 0, -1) : [];
      }
      var sF = pe(function(r) {
        var a = V(r, Df);
        return a.length && a[0] === r[0] ? Uf(a) : [];
      }), uF = pe(function(r) {
        var a = wn(r), p = V(r, Df);
        return a === wn(p) ? a = t : p.pop(), p.length && p[0] === r[0] ? Uf(p, JA(a, 2)) : [];
      }), lF = pe(function(r) {
        var a = wn(r), p = V(r, Df);
        return a = typeof a == "function" ? a : t, a && p.pop(), p.length && p[0] === r[0] ? Uf(p, t, a) : [];
      });
      function cF(r, a) {
        return r == null ? "" : oC.call(r, a);
      }
      function wn(r) {
        var a = r == null ? 0 : r.length;
        return a ? r[a - 1] : t;
      }
      function fF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = Q;
        return p !== t && (x = fe(p), x = x < 0 ? ct(Q + x, 0) : St(x, Q - 1)), a === a ? df(r, a, x) : dt(r, PA, x, !0);
      }
      function hF(r, a) {
        return r && r.length ? Cg(r, fe(a)) : t;
      }
      var dF = pe(fB);
      function fB(r, a) {
        return r && r.length && a && a.length ? xf(r, a) : r;
      }
      function pF(r, a, p) {
        return r && r.length && a && a.length ? xf(r, a, JA(p, 2)) : r;
      }
      function gF(r, a, p) {
        return r && r.length && a && a.length ? xf(r, a, t, p) : r;
      }
      var BF = Hr(function(r, a) {
        var p = r == null ? 0 : r.length, Q = yf(r, a);
        return Ug(r, V(a, function(x) {
          return Sr(x, p) ? +x : x;
        }).sort(Dg)), Q;
      });
      function wF(r, a) {
        var p = [];
        if (!(r && r.length))
          return p;
        var Q = -1, x = [], D = r.length;
        for (a = JA(a, 3); ++Q < D; ) {
          var k = r[Q];
          a(k, Q, r) && (p.push(k), x.push(Q));
        }
        return Ug(r, x), p;
      }
      function zf(r) {
        return r == null ? r : cC.call(r);
      }
      function mF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (p && typeof p != "number" && kt(r, a, p) ? (a = 0, p = Q) : (a = a == null ? 0 : fe(a), p = p === t ? Q : fe(p)), Bn(r, a, p)) : [];
      }
      function vF(r, a) {
        return Mu(r, a);
      }
      function yF(r, a, p) {
        return Sf(r, a, JA(p, 2));
      }
      function CF(r, a) {
        var p = r == null ? 0 : r.length;
        if (p) {
          var Q = Mu(r, a);
          if (Q < p && Pn(r[Q], a))
            return Q;
        }
        return -1;
      }
      function QF(r, a) {
        return Mu(r, a, !0);
      }
      function FF(r, a, p) {
        return Sf(r, a, JA(p, 2), !0);
      }
      function UF(r, a) {
        var p = r == null ? 0 : r.length;
        if (p) {
          var Q = Mu(r, a, !0) - 1;
          if (Pn(r[Q], a))
            return Q;
        }
        return -1;
      }
      function EF(r) {
        return r && r.length ? bg(r) : [];
      }
      function bF(r, a) {
        return r && r.length ? bg(r, JA(a, 2)) : [];
      }
      function _F(r) {
        var a = r == null ? 0 : r.length;
        return a ? Bn(r, 1, a) : [];
      }
      function xF(r, a, p) {
        return r && r.length ? (a = p || a === t ? 1 : fe(a), Bn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function IF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : fe(a), a = Q - a, Bn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function HF(r, a) {
        return r && r.length ? Pu(r, JA(a, 3), !1, !0) : [];
      }
      function SF(r, a) {
        return r && r.length ? Pu(r, JA(a, 3)) : [];
      }
      var LF = pe(function(r) {
        return ui(yt(r, 1, nt, !0));
      }), TF = pe(function(r) {
        var a = wn(r);
        return nt(a) && (a = t), ui(yt(r, 1, nt, !0), JA(a, 2));
      }), DF = pe(function(r) {
        var a = wn(r);
        return a = typeof a == "function" ? a : t, ui(yt(r, 1, nt, !0), t, a);
      });
      function OF(r) {
        return r && r.length ? ui(r) : [];
      }
      function NF(r, a) {
        return r && r.length ? ui(r, JA(a, 2)) : [];
      }
      function MF(r, a) {
        return a = typeof a == "function" ? a : t, r && r.length ? ui(r, t, a) : [];
      }
      function Jf(r) {
        if (!(r && r.length))
          return [];
        var a = 0;
        return r = b(r, function(p) {
          if (nt(p))
            return a = ct(p.length, a), !0;
        }), Ln(a, function(p) {
          return V(r, ue(p));
        });
      }
      function hB(r, a) {
        if (!(r && r.length))
          return [];
        var p = Jf(r);
        return a == null ? p : V(p, function(Q) {
          return s(a, t, Q);
        });
      }
      var PF = pe(function(r, a) {
        return nt(r) ? ko(r, a) : [];
      }), KF = pe(function(r) {
        return Tf(b(r, nt));
      }), RF = pe(function(r) {
        var a = wn(r);
        return nt(a) && (a = t), Tf(b(r, nt), JA(a, 2));
      }), kF = pe(function(r) {
        var a = wn(r);
        return a = typeof a == "function" ? a : t, Tf(b(r, nt), t, a);
      }), $F = pe(Jf);
      function GF(r, a) {
        return Hg(r || [], a || [], Ro);
      }
      function VF(r, a) {
        return Hg(r || [], a || [], Vo);
      }
      var WF = pe(function(r) {
        var a = r.length, p = a > 1 ? r[a - 1] : t;
        return p = typeof p == "function" ? (r.pop(), p) : t, hB(r, p);
      });
      function dB(r) {
        var a = S(r);
        return a.__chain__ = !0, a;
      }
      function XF(r, a) {
        return a(r), r;
      }
      function qu(r, a) {
        return a(r);
      }
      var qF = Hr(function(r) {
        var a = r.length, p = a ? r[0] : 0, Q = this.__wrapped__, x = function(D) {
          return yf(D, r);
        };
        return a > 1 || this.__actions__.length || !(Q instanceof Ce) || !Sr(p) ? this.thru(x) : (Q = Q.slice(p, +p + (a ? 1 : 0)), Q.__actions__.push({
          func: qu,
          args: [x],
          thisArg: t
        }), new pn(Q, this.__chain__).thru(function(D) {
          return a && !D.length && D.push(t), D;
        }));
      });
      function zF() {
        return dB(this);
      }
      function JF() {
        return new pn(this.value(), this.__chain__);
      }
      function jF() {
        this.__values__ === t && (this.__values__ = _B(this.value()));
        var r = this.__index__ >= this.__values__.length, a = r ? t : this.__values__[this.__index__++];
        return { done: r, value: a };
      }
      function YF() {
        return this;
      }
      function ZF(r) {
        for (var a, p = this; p instanceof Lu; ) {
          var Q = oB(p);
          Q.__index__ = 0, Q.__values__ = t, a ? x.__wrapped__ = Q : a = Q;
          var x = Q;
          p = p.__wrapped__;
        }
        return x.__wrapped__ = r, a;
      }
      function AU() {
        var r = this.__wrapped__;
        if (r instanceof Ce) {
          var a = r;
          return this.__actions__.length && (a = new Ce(this)), a = a.reverse(), a.__actions__.push({
            func: qu,
            args: [zf],
            thisArg: t
          }), new pn(a, this.__chain__);
        }
        return this.thru(zf);
      }
      function eU() {
        return Ig(this.__wrapped__, this.__actions__);
      }
      var tU = Ku(function(r, a, p) {
        Ie.call(r, p) ? ++r[p] : xr(r, p, 1);
      });
      function nU(r, a, p) {
        var Q = le(r) ? E : XC;
        return p && kt(r, a, p) && (a = t), Q(r, JA(a, 3));
      }
      function rU(r, a) {
        var p = le(r) ? b : hg;
        return p(r, JA(a, 3));
      }
      var iU = Rg(sB), aU = Rg(uB);
      function oU(r, a) {
        return yt(zu(r, a), 1);
      }
      function sU(r, a) {
        return yt(zu(r, a), fA);
      }
      function uU(r, a, p) {
        return p = p === t ? 1 : fe(p), yt(zu(r, a), p);
      }
      function pB(r, a) {
        var p = le(r) ? w : si;
        return p(r, JA(a, 3));
      }
      function gB(r, a) {
        var p = le(r) ? y : fg;
        return p(r, JA(a, 3));
      }
      var lU = Ku(function(r, a, p) {
        Ie.call(r, p) ? r[p].push(a) : xr(r, p, [a]);
      });
      function cU(r, a, p, Q) {
        r = zt(r) ? r : Da(r), p = p && !Q ? fe(p) : 0;
        var x = r.length;
        return p < 0 && (p = ct(x + p, 0)), Al(r) ? p <= x && r.indexOf(a, p) > -1 : !!x && ze(r, a, p) > -1;
      }
      var fU = pe(function(r, a, p) {
        var Q = -1, x = typeof a == "function", D = zt(r) ? rA(r.length) : [];
        return si(r, function(k) {
          D[++Q] = x ? s(a, k, p) : $o(k, a, p);
        }), D;
      }), hU = Ku(function(r, a, p) {
        xr(r, p, a);
      });
      function zu(r, a) {
        var p = le(r) ? V : mg;
        return p(r, JA(a, 3));
      }
      function dU(r, a, p, Q) {
        return r == null ? [] : (le(a) || (a = a == null ? [] : [a]), p = Q ? t : p, le(p) || (p = p == null ? [] : [p]), Qg(r, a, p));
      }
      var pU = Ku(function(r, a, p) {
        r[p ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function gU(r, a, p) {
        var Q = le(r) ? Z : Sn, x = arguments.length < 3;
        return Q(r, JA(a, 4), p, x, si);
      }
      function BU(r, a, p) {
        var Q = le(r) ? wA : Sn, x = arguments.length < 3;
        return Q(r, JA(a, 4), p, x, fg);
      }
      function wU(r, a) {
        var p = le(r) ? b : hg;
        return p(r, Yu(JA(a, 3)));
      }
      function mU(r) {
        var a = le(r) ? sg : cQ;
        return a(r);
      }
      function vU(r, a, p) {
        (p ? kt(r, a, p) : a === t) ? a = 1 : a = fe(a);
        var Q = le(r) ? kC : fQ;
        return Q(r, a);
      }
      function yU(r) {
        var a = le(r) ? $C : dQ;
        return a(r);
      }
      function CU(r) {
        if (r == null)
          return 0;
        if (zt(r))
          return Al(r) ? ri(r) : r.length;
        var a = Lt(r);
        return a == mA || a == ke ? r.size : bf(r).length;
      }
      function QU(r, a, p) {
        var Q = le(r) ? HA : pQ;
        return p && kt(r, a, p) && (a = t), Q(r, JA(a, 3));
      }
      var FU = pe(function(r, a) {
        if (r == null)
          return [];
        var p = a.length;
        return p > 1 && kt(r, a[0], a[1]) ? a = [] : p > 2 && kt(a[0], a[1], a[2]) && (a = [a[0]]), Qg(r, yt(a, 1), []);
      }), Ju = Ve || function() {
        return At.Date.now();
      };
      function UU(r, a) {
        if (typeof a != "function")
          throw new vt(l);
        return r = fe(r), function() {
          if (--r < 1)
            return a.apply(this, arguments);
        };
      }
      function BB(r, a, p) {
        return a = p ? t : a, a = r && a == null ? r.length : a, Ir(r, z, t, t, t, t, a);
      }
      function wB(r, a) {
        var p;
        if (typeof a != "function")
          throw new vt(l);
        return r = fe(r), function() {
          return --r > 0 && (p = a.apply(this, arguments)), r <= 1 && (a = t), p;
        };
      }
      var jf = pe(function(r, a, p) {
        var Q = F;
        if (p.length) {
          var x = tr(p, La(jf));
          Q |= M;
        }
        return Ir(r, Q, a, p, x);
      }), mB = pe(function(r, a, p) {
        var Q = F | U;
        if (p.length) {
          var x = tr(p, La(mB));
          Q |= M;
        }
        return Ir(a, Q, r, p, x);
      });
      function vB(r, a, p) {
        a = p ? t : a;
        var Q = Ir(r, O, t, t, t, t, t, a);
        return Q.placeholder = vB.placeholder, Q;
      }
      function yB(r, a, p) {
        a = p ? t : a;
        var Q = Ir(r, _, t, t, t, t, t, a);
        return Q.placeholder = yB.placeholder, Q;
      }
      function CB(r, a, p) {
        var Q, x, D, k, G, Y, dA = 0, pA = !1, CA = !1, SA = !0;
        if (typeof r != "function")
          throw new vt(l);
        a = mn(a) || 0, je(p) && (pA = !!p.leading, CA = "maxWait" in p, D = CA ? ct(mn(p.maxWait) || 0, a) : D, SA = "trailing" in p ? !!p.trailing : SA);
        function RA(rt) {
          var Kn = Q, Dr = x;
          return Q = x = t, dA = rt, k = r.apply(Dr, Kn), k;
        }
        function ZA(rt) {
          return dA = rt, G = qo(ye, a), pA ? RA(rt) : k;
        }
        function de(rt) {
          var Kn = rt - Y, Dr = rt - dA, RB = a - Kn;
          return CA ? St(RB, D - Dr) : RB;
        }
        function Ae(rt) {
          var Kn = rt - Y, Dr = rt - dA;
          return Y === t || Kn >= a || Kn < 0 || CA && Dr >= D;
        }
        function ye() {
          var rt = Ju();
          if (Ae(rt))
            return Ee(rt);
          G = qo(ye, de(rt));
        }
        function Ee(rt) {
          return G = t, SA && Q ? RA(rt) : (Q = x = t, k);
        }
        function on() {
          G !== t && Sg(G), dA = 0, Q = Y = x = G = t;
        }
        function $t() {
          return G === t ? k : Ee(Ju());
        }
        function sn() {
          var rt = Ju(), Kn = Ae(rt);
          if (Q = arguments, x = this, Y = rt, Kn) {
            if (G === t)
              return ZA(Y);
            if (CA)
              return Sg(G), G = qo(ye, a), RA(Y);
          }
          return G === t && (G = qo(ye, a)), k;
        }
        return sn.cancel = on, sn.flush = $t, sn;
      }
      var EU = pe(function(r, a) {
        return cg(r, 1, a);
      }), bU = pe(function(r, a, p) {
        return cg(r, mn(a) || 0, p);
      });
      function _U(r) {
        return Ir(r, sA);
      }
      function ju(r, a) {
        if (typeof r != "function" || a != null && typeof a != "function")
          throw new vt(l);
        var p = function() {
          var Q = arguments, x = a ? a.apply(this, Q) : Q[0], D = p.cache;
          if (D.has(x))
            return D.get(x);
          var k = r.apply(this, Q);
          return p.cache = D.set(x, k) || D, k;
        };
        return p.cache = new (ju.Cache || _r)(), p;
      }
      ju.Cache = _r;
      function Yu(r) {
        if (typeof r != "function")
          throw new vt(l);
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
      function xU(r) {
        return wB(2, r);
      }
      var IU = gQ(function(r, a) {
        a = a.length == 1 && le(a[0]) ? V(a[0], Ke(JA())) : V(yt(a, 1), Ke(JA()));
        var p = a.length;
        return pe(function(Q) {
          for (var x = -1, D = St(Q.length, p); ++x < D; )
            Q[x] = a[x].call(this, Q[x]);
          return s(r, this, Q);
        });
      }), Yf = pe(function(r, a) {
        var p = tr(a, La(Yf));
        return Ir(r, M, t, a, p);
      }), QB = pe(function(r, a) {
        var p = tr(a, La(QB));
        return Ir(r, K, t, a, p);
      }), HU = Hr(function(r, a) {
        return Ir(r, cA, t, t, t, a);
      });
      function SU(r, a) {
        if (typeof r != "function")
          throw new vt(l);
        return a = a === t ? a : fe(a), pe(r, a);
      }
      function LU(r, a) {
        if (typeof r != "function")
          throw new vt(l);
        return a = a == null ? 0 : ct(fe(a), 0), pe(function(p) {
          var Q = p[a], x = ci(p, 0, a);
          return Q && X(x, Q), s(r, this, x);
        });
      }
      function TU(r, a, p) {
        var Q = !0, x = !0;
        if (typeof r != "function")
          throw new vt(l);
        return je(p) && (Q = "leading" in p ? !!p.leading : Q, x = "trailing" in p ? !!p.trailing : x), CB(r, a, {
          leading: Q,
          maxWait: a,
          trailing: x
        });
      }
      function DU(r) {
        return BB(r, 1);
      }
      function OU(r, a) {
        return Yf(Of(a), r);
      }
      function NU() {
        if (!arguments.length)
          return [];
        var r = arguments[0];
        return le(r) ? r : [r];
      }
      function MU(r) {
        return gn(r, v);
      }
      function PU(r, a) {
        return a = typeof a == "function" ? a : t, gn(r, v, a);
      }
      function KU(r) {
        return gn(r, B | v);
      }
      function RU(r, a) {
        return a = typeof a == "function" ? a : t, gn(r, B | v, a);
      }
      function kU(r, a) {
        return a == null || lg(r, a, gt(a));
      }
      function Pn(r, a) {
        return r === a || r !== r && a !== a;
      }
      var $U = Gu(Ff), GU = Gu(function(r, a) {
        return r >= a;
      }), Vi = gg(/* @__PURE__ */ function() {
        return arguments;
      }()) ? gg : function(r) {
        return Ze(r) && Ie.call(r, "callee") && !YA.call(r, "callee");
      }, le = rA.isArray, VU = xo ? Ke(xo) : ZC;
      function zt(r) {
        return r != null && Zu(r.length) && !Lr(r);
      }
      function nt(r) {
        return Ze(r) && zt(r);
      }
      function WU(r) {
        return r === !0 || r === !1 || Ze(r) && Rt(r) == UA;
      }
      var fi = aC || uh, XU = Qa ? Ke(Qa) : AQ;
      function qU(r) {
        return Ze(r) && r.nodeType === 1 && !zo(r);
      }
      function zU(r) {
        if (r == null)
          return !0;
        if (zt(r) && (le(r) || typeof r == "string" || typeof r.splice == "function" || fi(r) || Ta(r) || Vi(r)))
          return !r.length;
        var a = Lt(r);
        if (a == mA || a == ke)
          return !r.size;
        if (Xo(r))
          return !bf(r).length;
        for (var p in r)
          if (Ie.call(r, p))
            return !1;
        return !0;
      }
      function JU(r, a) {
        return Go(r, a);
      }
      function jU(r, a, p) {
        p = typeof p == "function" ? p : t;
        var Q = p ? p(r, a) : t;
        return Q === t ? Go(r, a, t, p) : !!Q;
      }
      function Zf(r) {
        if (!Ze(r))
          return !1;
        var a = Rt(r);
        return a == zA || a == te || typeof r.message == "string" && typeof r.name == "string" && !zo(r);
      }
      function YU(r) {
        return typeof r == "number" && rg(r);
      }
      function Lr(r) {
        if (!je(r))
          return !1;
        var a = Rt(r);
        return a == KA || a == oA || a == FA || a == Ye;
      }
      function FB(r) {
        return typeof r == "number" && r == fe(r);
      }
      function Zu(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= bA;
      }
      function je(r) {
        var a = typeof r;
        return r != null && (a == "object" || a == "function");
      }
      function Ze(r) {
        return r != null && typeof r == "object";
      }
      var UB = Io ? Ke(Io) : tQ;
      function ZU(r, a) {
        return r === a || Ef(r, a, $f(a));
      }
      function AE(r, a, p) {
        return p = typeof p == "function" ? p : t, Ef(r, a, $f(a), p);
      }
      function eE(r) {
        return EB(r) && r != +r;
      }
      function tE(r) {
        if (PQ(r))
          throw new ie(o);
        return Bg(r);
      }
      function nE(r) {
        return r === null;
      }
      function rE(r) {
        return r == null;
      }
      function EB(r) {
        return typeof r == "number" || Ze(r) && Rt(r) == EA;
      }
      function zo(r) {
        if (!Ze(r) || Rt(r) != we)
          return !1;
        var a = ne(r);
        if (a === null)
          return !0;
        var p = Ie.call(a, "constructor") && a.constructor;
        return typeof p == "function" && p instanceof p && oi.call(p) == q;
      }
      var Ah = Ho ? Ke(Ho) : nQ;
      function iE(r) {
        return FB(r) && r >= -bA && r <= bA;
      }
      var bB = Qu ? Ke(Qu) : rQ;
      function Al(r) {
        return typeof r == "string" || !le(r) && Ze(r) && Rt(r) == Me;
      }
      function an(r) {
        return typeof r == "symbol" || Ze(r) && Rt(r) == be;
      }
      var Ta = Fu ? Ke(Fu) : iQ;
      function aE(r) {
        return r === t;
      }
      function oE(r) {
        return Ze(r) && Lt(r) == Et;
      }
      function sE(r) {
        return Ze(r) && Rt(r) == Mt;
      }
      var uE = Gu(_f), lE = Gu(function(r, a) {
        return r <= a;
      });
      function _B(r) {
        if (!r)
          return [];
        if (zt(r))
          return Al(r) ? mt(r) : qt(r);
        if (XA && r[XA])
          return Ua(r[XA]());
        var a = Lt(r), p = a == mA ? To : a == ke ? Ea : Da;
        return p(r);
      }
      function Tr(r) {
        if (!r)
          return r === 0 ? r : 0;
        if (r = mn(r), r === fA || r === -fA) {
          var a = r < 0 ? -1 : 1;
          return a * xA;
        }
        return r === r ? r : 0;
      }
      function fe(r) {
        var a = Tr(r), p = a % 1;
        return a === a ? p ? a - p : a : 0;
      }
      function xB(r) {
        return r ? Ri(fe(r), 0, T) : 0;
      }
      function mn(r) {
        if (typeof r == "number")
          return r;
        if (an(r))
          return iA;
        if (je(r)) {
          var a = typeof r.valueOf == "function" ? r.valueOf() : r;
          r = je(a) ? a + "" : a;
        }
        if (typeof r != "string")
          return r === 0 ? r : +r;
        r = Tn(r);
        var p = jc.test(r);
        return p || Co.test(r) ? yu(r.slice(2), p ? 2 : 8) : Yn.test(r) ? iA : +r;
      }
      function IB(r) {
        return ir(r, Jt(r));
      }
      function cE(r) {
        return r ? Ri(fe(r), -bA, bA) : r === 0 ? r : 0;
      }
      function De(r) {
        return r == null ? "" : rn(r);
      }
      var fE = Ha(function(r, a) {
        if (Xo(a) || zt(a)) {
          ir(a, gt(a), r);
          return;
        }
        for (var p in a)
          Ie.call(a, p) && Ro(r, p, a[p]);
      }), HB = Ha(function(r, a) {
        ir(a, Jt(a), r);
      }), el = Ha(function(r, a, p, Q) {
        ir(a, Jt(a), r, Q);
      }), hE = Ha(function(r, a, p, Q) {
        ir(a, gt(a), r, Q);
      }), dE = Hr(yf);
      function pE(r, a) {
        var p = Ia(r);
        return a == null ? p : ug(p, a);
      }
      var gE = pe(function(r, a) {
        r = Ue(r);
        var p = -1, Q = a.length, x = Q > 2 ? a[2] : t;
        for (x && kt(a[0], a[1], x) && (Q = 1); ++p < Q; )
          for (var D = a[p], k = Jt(D), G = -1, Y = k.length; ++G < Y; ) {
            var dA = k[G], pA = r[dA];
            (pA === t || Pn(pA, ai[dA]) && !Ie.call(r, dA)) && (r[dA] = D[dA]);
          }
        return r;
      }), BE = pe(function(r) {
        return r.push(t, qg), s(SB, t, r);
      });
      function wE(r, a) {
        return se(r, JA(a, 3), rr);
      }
      function mE(r, a) {
        return se(r, JA(a, 3), Qf);
      }
      function vE(r, a) {
        return r == null ? r : Cf(r, JA(a, 3), Jt);
      }
      function yE(r, a) {
        return r == null ? r : dg(r, JA(a, 3), Jt);
      }
      function CE(r, a) {
        return r && rr(r, JA(a, 3));
      }
      function QE(r, a) {
        return r && Qf(r, JA(a, 3));
      }
      function FE(r) {
        return r == null ? [] : Ou(r, gt(r));
      }
      function UE(r) {
        return r == null ? [] : Ou(r, Jt(r));
      }
      function eh(r, a, p) {
        var Q = r == null ? t : ki(r, a);
        return Q === t ? p : Q;
      }
      function EE(r, a) {
        return r != null && jg(r, a, zC);
      }
      function th(r, a) {
        return r != null && jg(r, a, JC);
      }
      var bE = $g(function(r, a, p) {
        a != null && typeof a.toString != "function" && (a = $.call(a)), r[a] = p;
      }, rh(jt)), _E = $g(function(r, a, p) {
        a != null && typeof a.toString != "function" && (a = $.call(a)), Ie.call(r, a) ? r[a].push(p) : r[a] = [p];
      }, JA), xE = pe($o);
      function gt(r) {
        return zt(r) ? og(r) : bf(r);
      }
      function Jt(r) {
        return zt(r) ? og(r, !0) : aQ(r);
      }
      function IE(r, a) {
        var p = {};
        return a = JA(a, 3), rr(r, function(Q, x, D) {
          xr(p, a(Q, x, D), Q);
        }), p;
      }
      function HE(r, a) {
        var p = {};
        return a = JA(a, 3), rr(r, function(Q, x, D) {
          xr(p, x, a(Q, x, D));
        }), p;
      }
      var SE = Ha(function(r, a, p) {
        Nu(r, a, p);
      }), SB = Ha(function(r, a, p, Q) {
        Nu(r, a, p, Q);
      }), LE = Hr(function(r, a) {
        var p = {};
        if (r == null)
          return p;
        var Q = !1;
        a = V(a, function(D) {
          return D = li(D, r), Q || (Q = D.length > 1), D;
        }), ir(r, Rf(r), p), Q && (p = gn(p, B | g | v, bQ));
        for (var x = a.length; x--; )
          Lf(p, a[x]);
        return p;
      });
      function TE(r, a) {
        return LB(r, Yu(JA(a)));
      }
      var DE = Hr(function(r, a) {
        return r == null ? {} : sQ(r, a);
      });
      function LB(r, a) {
        if (r == null)
          return {};
        var p = V(Rf(r), function(Q) {
          return [Q];
        });
        return a = JA(a), Fg(r, p, function(Q, x) {
          return a(Q, x[0]);
        });
      }
      function OE(r, a, p) {
        a = li(a, r);
        var Q = -1, x = a.length;
        for (x || (x = 1, r = t); ++Q < x; ) {
          var D = r == null ? t : r[ar(a[Q])];
          D === t && (Q = x, D = p), r = Lr(D) ? D.call(r) : D;
        }
        return r;
      }
      function NE(r, a, p) {
        return r == null ? r : Vo(r, a, p);
      }
      function ME(r, a, p, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Vo(r, a, p, Q);
      }
      var TB = Wg(gt), DB = Wg(Jt);
      function PE(r, a, p) {
        var Q = le(r), x = Q || fi(r) || Ta(r);
        if (a = JA(a, 4), p == null) {
          var D = r && r.constructor;
          x ? p = Q ? new D() : [] : je(r) ? p = Lr(D) ? Ia(ne(r)) : {} : p = {};
        }
        return (x ? w : rr)(r, function(k, G, Y) {
          return a(p, k, G, Y);
        }), p;
      }
      function KE(r, a) {
        return r == null ? !0 : Lf(r, a);
      }
      function RE(r, a, p) {
        return r == null ? r : xg(r, a, Of(p));
      }
      function kE(r, a, p, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : xg(r, a, Of(p), Q);
      }
      function Da(r) {
        return r == null ? [] : Ht(r, gt(r));
      }
      function $E(r) {
        return r == null ? [] : Ht(r, Jt(r));
      }
      function GE(r, a, p) {
        return p === t && (p = a, a = t), p !== t && (p = mn(p), p = p === p ? p : 0), a !== t && (a = mn(a), a = a === a ? a : 0), Ri(mn(r), a, p);
      }
      function VE(r, a, p) {
        return a = Tr(a), p === t ? (p = a, a = 0) : p = Tr(p), r = mn(r), jC(r, a, p);
      }
      function WE(r, a, p) {
        if (p && typeof p != "boolean" && kt(r, a, p) && (a = p = t), p === t && (typeof a == "boolean" ? (p = a, a = t) : typeof r == "boolean" && (p = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = Tr(r), a === t ? (a = r, r = 0) : a = Tr(a)), r > a) {
          var Q = r;
          r = a, a = Q;
        }
        if (p || r % 1 || a % 1) {
          var x = ig();
          return St(r + x * (a - r + cf("1e-" + ((x + "").length - 1))), a);
        }
        return If(r, a);
      }
      var XE = Sa(function(r, a, p) {
        return a = a.toLowerCase(), r + (p ? OB(a) : a);
      });
      function OB(r) {
        return nh(De(r).toLowerCase());
      }
      function NB(r) {
        return r = De(r), r && r.replace(Zc, Lo).replace(Bu, "");
      }
      function qE(r, a, p) {
        r = De(r), a = rn(a);
        var Q = r.length;
        p = p === t ? Q : Ri(fe(p), 0, Q);
        var x = p;
        return p -= a.length, p >= 0 && r.slice(p, x) == a;
      }
      function zE(r) {
        return r = De(r), r && Ii.test(r) ? r.replace(xi, Te) : r;
      }
      function JE(r) {
        return r = De(r), r && yr.test(r) ? r.replace(mo, "\\$&") : r;
      }
      var jE = Sa(function(r, a, p) {
        return r + (p ? "-" : "") + a.toLowerCase();
      }), YE = Sa(function(r, a, p) {
        return r + (p ? " " : "") + a.toLowerCase();
      }), ZE = Kg("toLowerCase");
      function Ab(r, a, p) {
        r = De(r), a = fe(a);
        var Q = a ? ri(r) : 0;
        if (!a || Q >= a)
          return r;
        var x = (a - Q) / 2;
        return $u(pt(x), p) + r + $u(nr(x), p);
      }
      function eb(r, a, p) {
        r = De(r), a = fe(a);
        var Q = a ? ri(r) : 0;
        return a && Q < a ? r + $u(a - Q, p) : r;
      }
      function tb(r, a, p) {
        r = De(r), a = fe(a);
        var Q = a ? ri(r) : 0;
        return a && Q < a ? $u(a - Q, p) + r : r;
      }
      function nb(r, a, p) {
        return p || a == null ? a = 0 : a && (a = +a), lC(De(r).replace(fa, ""), a || 0);
      }
      function rb(r, a, p) {
        return (p ? kt(r, a, p) : a === t) ? a = 1 : a = fe(a), Hf(De(r), a);
      }
      function ib() {
        var r = arguments, a = De(r[0]);
        return r.length < 3 ? a : a.replace(r[1], r[2]);
      }
      var ab = Sa(function(r, a, p) {
        return r + (p ? "_" : "") + a.toLowerCase();
      });
      function ob(r, a, p) {
        return p && typeof p != "number" && kt(r, a, p) && (a = p = t), p = p === t ? T : p >>> 0, p ? (r = De(r), r && (typeof a == "string" || a != null && !Ah(a)) && (a = rn(a), !a && er(r)) ? ci(mt(r), 0, p) : r.split(a, p)) : [];
      }
      var sb = Sa(function(r, a, p) {
        return r + (p ? " " : "") + nh(a);
      });
      function ub(r, a, p) {
        return r = De(r), p = p == null ? 0 : Ri(fe(p), 0, r.length), a = rn(a), r.slice(p, p + a.length) == a;
      }
      function lb(r, a, p) {
        var Q = S.templateSettings;
        p && kt(r, a, p) && (a = t), r = De(r), a = el({}, a, Q, Xg);
        var x = el({}, a.imports, Q.imports, Xg), D = gt(x), k = Ht(x, D), G, Y, dA = 0, pA = a.interpolate || pa, CA = "__p += '", SA = Ni(
          (a.escape || pa).source + "|" + pA.source + "|" + (pA === Hi ? eu : pa).source + "|" + (a.evaluate || pa).source + "|$",
          "g"
        ), RA = "//# sourceURL=" + (Ie.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++vu + "]") + `
`;
        r.replace(SA, function(Ae, ye, Ee, on, $t, sn) {
          return Ee || (Ee = on), CA += r.slice(dA, sn).replace(Af, Ur), ye && (G = !0, CA += `' +
__e(` + ye + `) +
'`), $t && (Y = !0, CA += `';
` + $t + `;
__p += '`), Ee && (CA += `' +
((__t = (` + Ee + `)) == null ? '' : __t) +
'`), dA = sn + Ae.length, Ae;
        }), CA += `';
`;
        var ZA = Ie.call(a, "variable") && a.variable;
        if (!ZA)
          CA = `with (obj) {
` + CA + `
}
`;
        else if (da.test(ZA))
          throw new ie(f);
        CA = (Y ? CA.replace(ve, "") : CA).replace(st, "$1").replace(_t, "$1;"), CA = "function(" + (ZA || "obj") + `) {
` + (ZA ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (G ? ", __e = _.escape" : "") + (Y ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + CA + `return __p
}`;
        var de = PB(function() {
          return xe(D, RA + "return " + CA).apply(t, k);
        });
        if (de.source = CA, Zf(de))
          throw de;
        return de;
      }
      function cb(r) {
        return De(r).toLowerCase();
      }
      function fb(r) {
        return De(r).toUpperCase();
      }
      function hb(r, a, p) {
        if (r = De(r), r && (p || a === t))
          return Tn(r);
        if (!r || !(a = rn(a)))
          return r;
        var Q = mt(r), x = mt(a), D = Dn(Q, x), k = So(Q, x) + 1;
        return ci(Q, D, k).join("");
      }
      function db(r, a, p) {
        if (r = De(r), r && (p || a === t))
          return r.slice(0, _u(r) + 1);
        if (!r || !(a = rn(a)))
          return r;
        var Q = mt(r), x = So(Q, mt(a)) + 1;
        return ci(Q, 0, x).join("");
      }
      function pb(r, a, p) {
        if (r = De(r), r && (p || a === t))
          return r.replace(fa, "");
        if (!r || !(a = rn(a)))
          return r;
        var Q = mt(r), x = Dn(Q, mt(a));
        return ci(Q, x).join("");
      }
      function gb(r, a) {
        var p = gA, Q = QA;
        if (je(a)) {
          var x = "separator" in a ? a.separator : x;
          p = "length" in a ? fe(a.length) : p, Q = "omission" in a ? rn(a.omission) : Q;
        }
        r = De(r);
        var D = r.length;
        if (er(r)) {
          var k = mt(r);
          D = k.length;
        }
        if (p >= D)
          return r;
        var G = p - ri(Q);
        if (G < 1)
          return Q;
        var Y = k ? ci(k, 0, G).join("") : r.slice(0, G);
        if (x === t)
          return Y + Q;
        if (k && (G += Y.length - G), Ah(x)) {
          if (r.slice(G).search(x)) {
            var dA, pA = Y;
            for (x.global || (x = Ni(x.source, De(jn.exec(x)) + "g")), x.lastIndex = 0; dA = x.exec(pA); )
              var CA = dA.index;
            Y = Y.slice(0, CA === t ? G : CA);
          }
        } else if (r.indexOf(rn(x), G) != G) {
          var SA = Y.lastIndexOf(x);
          SA > -1 && (Y = Y.slice(0, SA));
        }
        return Y + Q;
      }
      function Bb(r) {
        return r = De(r), r && xn.test(r) ? r.replace(_n, Do) : r;
      }
      var wb = Sa(function(r, a, p) {
        return r + (p ? " " : "") + a.toUpperCase();
      }), nh = Kg("toUpperCase");
      function MB(r, a, p) {
        return r = De(r), a = p ? t : a, a === t ? hf(r) ? Nn(r) : jA(r) : r.match(a) || [];
      }
      var PB = pe(function(r, a) {
        try {
          return s(r, t, a);
        } catch (p) {
          return Zf(p) ? p : new ie(p);
        }
      }), mb = Hr(function(r, a) {
        return w(a, function(p) {
          p = ar(p), xr(r, p, jf(r[p], r));
        }), r;
      });
      function vb(r) {
        var a = r == null ? 0 : r.length, p = JA();
        return r = a ? V(r, function(Q) {
          if (typeof Q[1] != "function")
            throw new vt(l);
          return [p(Q[0]), Q[1]];
        }) : [], pe(function(Q) {
          for (var x = -1; ++x < a; ) {
            var D = r[x];
            if (s(D[0], this, Q))
              return s(D[1], this, Q);
          }
        });
      }
      function yb(r) {
        return WC(gn(r, B));
      }
      function rh(r) {
        return function() {
          return r;
        };
      }
      function Cb(r, a) {
        return r == null || r !== r ? a : r;
      }
      var Qb = kg(), Fb = kg(!0);
      function jt(r) {
        return r;
      }
      function ih(r) {
        return wg(typeof r == "function" ? r : gn(r, B));
      }
      function Ub(r) {
        return vg(gn(r, B));
      }
      function Eb(r, a) {
        return yg(r, gn(a, B));
      }
      var bb = pe(function(r, a) {
        return function(p) {
          return $o(p, r, a);
        };
      }), _b = pe(function(r, a) {
        return function(p) {
          return $o(r, p, a);
        };
      });
      function ah(r, a, p) {
        var Q = gt(a), x = Ou(a, Q);
        p == null && !(je(a) && (x.length || !Q.length)) && (p = a, a = r, r = this, x = Ou(a, gt(a)));
        var D = !(je(p) && "chain" in p) || !!p.chain, k = Lr(r);
        return w(x, function(G) {
          var Y = a[G];
          r[G] = Y, k && (r.prototype[G] = function() {
            var dA = this.__chain__;
            if (D || dA) {
              var pA = r(this.__wrapped__), CA = pA.__actions__ = qt(this.__actions__);
              return CA.push({ func: Y, args: arguments, thisArg: r }), pA.__chain__ = dA, pA;
            }
            return Y.apply(r, X([this.value()], arguments));
          });
        }), r;
      }
      function xb() {
        return At._ === this && (At._ = uA), this;
      }
      function oh() {
      }
      function Ib(r) {
        return r = fe(r), pe(function(a) {
          return Cg(a, r);
        });
      }
      var Hb = Mf(V), Sb = Mf(E), Lb = Mf(HA);
      function KB(r) {
        return Vf(r) ? ue(ar(r)) : uQ(r);
      }
      function Tb(r) {
        return function(a) {
          return r == null ? t : ki(r, a);
        };
      }
      var Db = Gg(), Ob = Gg(!0);
      function sh() {
        return [];
      }
      function uh() {
        return !1;
      }
      function Nb() {
        return {};
      }
      function Mb() {
        return "";
      }
      function Pb() {
        return !0;
      }
      function Kb(r, a) {
        if (r = fe(r), r < 1 || r > bA)
          return [];
        var p = T, Q = St(r, T);
        a = JA(a), r -= T;
        for (var x = Ln(Q, a); ++p < r; )
          a(p);
        return x;
      }
      function Rb(r) {
        return le(r) ? V(r, ar) : an(r) ? [r] : qt(aB(De(r)));
      }
      function kb(r) {
        var a = ++gf;
        return De(r) + a;
      }
      var $b = ku(function(r, a) {
        return r + a;
      }, 0), Gb = Pf("ceil"), Vb = ku(function(r, a) {
        return r / a;
      }, 1), Wb = Pf("floor");
      function Xb(r) {
        return r && r.length ? Du(r, jt, Ff) : t;
      }
      function qb(r, a) {
        return r && r.length ? Du(r, JA(a, 2), Ff) : t;
      }
      function zb(r) {
        return lt(r, jt);
      }
      function Jb(r, a) {
        return lt(r, JA(a, 2));
      }
      function jb(r) {
        return r && r.length ? Du(r, jt, _f) : t;
      }
      function Yb(r, a) {
        return r && r.length ? Du(r, JA(a, 2), _f) : t;
      }
      var Zb = ku(function(r, a) {
        return r * a;
      }, 1), A1 = Pf("round"), e1 = ku(function(r, a) {
        return r - a;
      }, 0);
      function t1(r) {
        return r && r.length ? It(r, jt) : 0;
      }
      function n1(r, a) {
        return r && r.length ? It(r, JA(a, 2)) : 0;
      }
      return S.after = UU, S.ary = BB, S.assign = fE, S.assignIn = HB, S.assignInWith = el, S.assignWith = hE, S.at = dE, S.before = wB, S.bind = jf, S.bindAll = mb, S.bindKey = mB, S.castArray = NU, S.chain = dB, S.chunk = WQ, S.compact = XQ, S.concat = qQ, S.cond = vb, S.conforms = yb, S.constant = rh, S.countBy = tU, S.create = pE, S.curry = vB, S.curryRight = yB, S.debounce = CB, S.defaults = gE, S.defaultsDeep = BE, S.defer = EU, S.delay = bU, S.difference = zQ, S.differenceBy = JQ, S.differenceWith = jQ, S.drop = YQ, S.dropRight = ZQ, S.dropRightWhile = AF, S.dropWhile = eF, S.fill = tF, S.filter = rU, S.flatMap = oU, S.flatMapDeep = sU, S.flatMapDepth = uU, S.flatten = lB, S.flattenDeep = nF, S.flattenDepth = rF, S.flip = _U, S.flow = Qb, S.flowRight = Fb, S.fromPairs = iF, S.functions = FE, S.functionsIn = UE, S.groupBy = lU, S.initial = oF, S.intersection = sF, S.intersectionBy = uF, S.intersectionWith = lF, S.invert = bE, S.invertBy = _E, S.invokeMap = fU, S.iteratee = ih, S.keyBy = hU, S.keys = gt, S.keysIn = Jt, S.map = zu, S.mapKeys = IE, S.mapValues = HE, S.matches = Ub, S.matchesProperty = Eb, S.memoize = ju, S.merge = SE, S.mergeWith = SB, S.method = bb, S.methodOf = _b, S.mixin = ah, S.negate = Yu, S.nthArg = Ib, S.omit = LE, S.omitBy = TE, S.once = xU, S.orderBy = dU, S.over = Hb, S.overArgs = IU, S.overEvery = Sb, S.overSome = Lb, S.partial = Yf, S.partialRight = QB, S.partition = pU, S.pick = DE, S.pickBy = LB, S.property = KB, S.propertyOf = Tb, S.pull = dF, S.pullAll = fB, S.pullAllBy = pF, S.pullAllWith = gF, S.pullAt = BF, S.range = Db, S.rangeRight = Ob, S.rearg = HU, S.reject = wU, S.remove = wF, S.rest = SU, S.reverse = zf, S.sampleSize = vU, S.set = NE, S.setWith = ME, S.shuffle = yU, S.slice = mF, S.sortBy = FU, S.sortedUniq = EF, S.sortedUniqBy = bF, S.split = ob, S.spread = LU, S.tail = _F, S.take = xF, S.takeRight = IF, S.takeRightWhile = HF, S.takeWhile = SF, S.tap = XF, S.throttle = TU, S.thru = qu, S.toArray = _B, S.toPairs = TB, S.toPairsIn = DB, S.toPath = Rb, S.toPlainObject = IB, S.transform = PE, S.unary = DU, S.union = LF, S.unionBy = TF, S.unionWith = DF, S.uniq = OF, S.uniqBy = NF, S.uniqWith = MF, S.unset = KE, S.unzip = Jf, S.unzipWith = hB, S.update = RE, S.updateWith = kE, S.values = Da, S.valuesIn = $E, S.without = PF, S.words = MB, S.wrap = OU, S.xor = KF, S.xorBy = RF, S.xorWith = kF, S.zip = $F, S.zipObject = GF, S.zipObjectDeep = VF, S.zipWith = WF, S.entries = TB, S.entriesIn = DB, S.extend = HB, S.extendWith = el, ah(S, S), S.add = $b, S.attempt = PB, S.camelCase = XE, S.capitalize = OB, S.ceil = Gb, S.clamp = GE, S.clone = MU, S.cloneDeep = KU, S.cloneDeepWith = RU, S.cloneWith = PU, S.conformsTo = kU, S.deburr = NB, S.defaultTo = Cb, S.divide = Vb, S.endsWith = qE, S.eq = Pn, S.escape = zE, S.escapeRegExp = JE, S.every = nU, S.find = iU, S.findIndex = sB, S.findKey = wE, S.findLast = aU, S.findLastIndex = uB, S.findLastKey = mE, S.floor = Wb, S.forEach = pB, S.forEachRight = gB, S.forIn = vE, S.forInRight = yE, S.forOwn = CE, S.forOwnRight = QE, S.get = eh, S.gt = $U, S.gte = GU, S.has = EE, S.hasIn = th, S.head = cB, S.identity = jt, S.includes = cU, S.indexOf = aF, S.inRange = VE, S.invoke = xE, S.isArguments = Vi, S.isArray = le, S.isArrayBuffer = VU, S.isArrayLike = zt, S.isArrayLikeObject = nt, S.isBoolean = WU, S.isBuffer = fi, S.isDate = XU, S.isElement = qU, S.isEmpty = zU, S.isEqual = JU, S.isEqualWith = jU, S.isError = Zf, S.isFinite = YU, S.isFunction = Lr, S.isInteger = FB, S.isLength = Zu, S.isMap = UB, S.isMatch = ZU, S.isMatchWith = AE, S.isNaN = eE, S.isNative = tE, S.isNil = rE, S.isNull = nE, S.isNumber = EB, S.isObject = je, S.isObjectLike = Ze, S.isPlainObject = zo, S.isRegExp = Ah, S.isSafeInteger = iE, S.isSet = bB, S.isString = Al, S.isSymbol = an, S.isTypedArray = Ta, S.isUndefined = aE, S.isWeakMap = oE, S.isWeakSet = sE, S.join = cF, S.kebabCase = jE, S.last = wn, S.lastIndexOf = fF, S.lowerCase = YE, S.lowerFirst = ZE, S.lt = uE, S.lte = lE, S.max = Xb, S.maxBy = qb, S.mean = zb, S.meanBy = Jb, S.min = jb, S.minBy = Yb, S.stubArray = sh, S.stubFalse = uh, S.stubObject = Nb, S.stubString = Mb, S.stubTrue = Pb, S.multiply = Zb, S.nth = hF, S.noConflict = xb, S.noop = oh, S.now = Ju, S.pad = Ab, S.padEnd = eb, S.padStart = tb, S.parseInt = nb, S.random = WE, S.reduce = gU, S.reduceRight = BU, S.repeat = rb, S.replace = ib, S.result = OE, S.round = A1, S.runInContext = j, S.sample = mU, S.size = CU, S.snakeCase = ab, S.some = QU, S.sortedIndex = vF, S.sortedIndexBy = yF, S.sortedIndexOf = CF, S.sortedLastIndex = QF, S.sortedLastIndexBy = FF, S.sortedLastIndexOf = UF, S.startCase = sb, S.startsWith = ub, S.subtract = e1, S.sum = t1, S.sumBy = n1, S.template = lb, S.times = Kb, S.toFinite = Tr, S.toInteger = fe, S.toLength = xB, S.toLower = cb, S.toNumber = mn, S.toSafeInteger = cE, S.toString = De, S.toUpper = fb, S.trim = hb, S.trimEnd = db, S.trimStart = pb, S.truncate = gb, S.unescape = Bb, S.uniqueId = kb, S.upperCase = wb, S.upperFirst = nh, S.each = pB, S.eachRight = gB, S.first = cB, ah(S, function() {
        var r = {};
        return rr(S, function(a, p) {
          Ie.call(S.prototype, p) || (r[p] = a);
        }), r;
      }(), { chain: !1 }), S.VERSION = n, w(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        S[r].placeholder = S;
      }), w(["drop", "take"], function(r, a) {
        Ce.prototype[r] = function(p) {
          p = p === t ? 1 : ct(fe(p), 0);
          var Q = this.__filtered__ && !a ? new Ce(this) : this.clone();
          return Q.__filtered__ ? Q.__takeCount__ = St(p, Q.__takeCount__) : Q.__views__.push({
            size: St(p, T),
            type: r + (Q.__dir__ < 0 ? "Right" : "")
          }), Q;
        }, Ce.prototype[r + "Right"] = function(p) {
          return this.reverse()[r](p).reverse();
        };
      }), w(["filter", "map", "takeWhile"], function(r, a) {
        var p = a + 1, Q = p == W || p == eA;
        Ce.prototype[r] = function(x) {
          var D = this.clone();
          return D.__iteratees__.push({
            iteratee: JA(x, 3),
            type: p
          }), D.__filtered__ = D.__filtered__ || Q, D;
        };
      }), w(["head", "last"], function(r, a) {
        var p = "take" + (a ? "Right" : "");
        Ce.prototype[r] = function() {
          return this[p](1).value()[0];
        };
      }), w(["initial", "tail"], function(r, a) {
        var p = "drop" + (a ? "" : "Right");
        Ce.prototype[r] = function() {
          return this.__filtered__ ? new Ce(this) : this[p](1);
        };
      }), Ce.prototype.compact = function() {
        return this.filter(jt);
      }, Ce.prototype.find = function(r) {
        return this.filter(r).head();
      }, Ce.prototype.findLast = function(r) {
        return this.reverse().find(r);
      }, Ce.prototype.invokeMap = pe(function(r, a) {
        return typeof r == "function" ? new Ce(this) : this.map(function(p) {
          return $o(p, r, a);
        });
      }), Ce.prototype.reject = function(r) {
        return this.filter(Yu(JA(r)));
      }, Ce.prototype.slice = function(r, a) {
        r = fe(r);
        var p = this;
        return p.__filtered__ && (r > 0 || a < 0) ? new Ce(p) : (r < 0 ? p = p.takeRight(-r) : r && (p = p.drop(r)), a !== t && (a = fe(a), p = a < 0 ? p.dropRight(-a) : p.take(a - r)), p);
      }, Ce.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, Ce.prototype.toArray = function() {
        return this.take(T);
      }, rr(Ce.prototype, function(r, a) {
        var p = /^(?:filter|find|map|reject)|While$/.test(a), Q = /^(?:head|last)$/.test(a), x = S[Q ? "take" + (a == "last" ? "Right" : "") : a], D = Q || /^find/.test(a);
        x && (S.prototype[a] = function() {
          var k = this.__wrapped__, G = Q ? [1] : arguments, Y = k instanceof Ce, dA = G[0], pA = Y || le(k), CA = function(ye) {
            var Ee = x.apply(S, X([ye], G));
            return Q && SA ? Ee[0] : Ee;
          };
          pA && p && typeof dA == "function" && dA.length != 1 && (Y = pA = !1);
          var SA = this.__chain__, RA = !!this.__actions__.length, ZA = D && !SA, de = Y && !RA;
          if (!D && pA) {
            k = de ? k : new Ce(this);
            var Ae = r.apply(k, G);
            return Ae.__actions__.push({ func: qu, args: [CA], thisArg: t }), new pn(Ae, SA);
          }
          return ZA && de ? r.apply(this, G) : (Ae = this.thru(CA), ZA ? Q ? Ae.value()[0] : Ae.value() : Ae);
        });
      }), w(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var a = ii[r], p = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", Q = /^(?:pop|shift)$/.test(r);
        S.prototype[r] = function() {
          var x = arguments;
          if (Q && !this.__chain__) {
            var D = this.value();
            return a.apply(le(D) ? D : [], x);
          }
          return this[p](function(k) {
            return a.apply(le(k) ? k : [], x);
          });
        };
      }), rr(Ce.prototype, function(r, a) {
        var p = S[a];
        if (p) {
          var Q = p.name + "";
          Ie.call(xa, Q) || (xa[Q] = []), xa[Q].push({ name: a, func: p });
        }
      }), xa[Ru(t, U).name] = [{
        name: "wrapper",
        func: t
      }], Ce.prototype.clone = BC, Ce.prototype.reverse = wC, Ce.prototype.value = mC, S.prototype.at = qF, S.prototype.chain = zF, S.prototype.commit = JF, S.prototype.next = jF, S.prototype.plant = ZF, S.prototype.reverse = AU, S.prototype.toJSON = S.prototype.valueOf = S.prototype.value = eU, S.prototype.first = S.prototype.head, XA && (S.prototype[XA] = YF), S;
    }, _e = xu();
    dn ? ((dn.exports = _e)._ = _e, _o._ = _e) : At._ = _e;
  }).call(zi);
})(ac, ac.exports);
var fS = ac.exports;
const He = /* @__PURE__ */ xc(fS), hS = function(A) {
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
  }, t = He.merge({}, e, A), n = function(i, o) {
    var l = He.cloneDeep(i);
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
        o.chromosomes.map(function(_) {
          return _.length;
        })
      ), H = {
        label: He.pick(t.annotations.label, ["size", "show"]),
        marker: He.pick(t.annotations.marker, ["size", "show"])
      };
      H.label = n(
        H.label,
        t.annotations.label
      ), H.marker = n(
        H.marker,
        t.annotations.marker
      );
      var O = {
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
        annotations: H,
        scale: t.scale
      };
      return o.chromosomes.length == 1 && (O.chromosomePosition.x = m.left + 0.5 * F, O.geneAnnotationPosition.x = m.left + 0.5 * F + u, O.qtlAnnotationPosition.width = F * 0.5, O.geneAnnotationPosition.width = F * 1.5, O.labelPosition.x = m.left + 0.5 * F, O.labelPosition.width = u, O.sizeLabelPosition.x = m.left + 0.5 * F, O.sizeLabelPosition.width = u), o.drawing = He.pick(t, ["width", "height"]), o.drawing.margin = {
        top: t.margin.top * o.drawing.height,
        left: t.margin.left * o.drawing.width,
        bottom: t.margin.bottom * o.drawing.height,
        right: t.margin.right * o.drawing.width
      }, o.chromosomes.forEach(function(_, M) {
        var K = M % t.numberPerRow, z = Math.floor(M / t.numberPerRow);
        _.cell = {
          y: z * h.height + t.margin.top * t.height,
          x: K * h.width + t.margin.left * t.width,
          width: h.width,
          height: h.height
        };
      }), o.cellLayout = O, o;
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
      return arguments.length ? (t.margin = He.merge(t.margin, i), this) : t.margin;
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
function Vl(A, e) {
  return A == null || e == null ? NaN : A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function dS(A, e) {
  return A == null || e == null ? NaN : e < A ? -1 : e > A ? 1 : e >= A ? 0 : NaN;
}
function e0(A) {
  let e, t, n;
  A.length !== 2 ? (e = Vl, t = (f, c) => Vl(A(f), c), n = (f, c) => A(f) - c) : (e = A === Vl || A === dS ? A : pS, t = A, n = A);
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
function pS() {
  return 0;
}
function gS(A) {
  return A === null ? NaN : +A;
}
const BS = e0(Vl), wS = BS.right;
e0(gS).center;
const mS = Math.sqrt(50), vS = Math.sqrt(10), yS = Math.sqrt(2);
function oc(A, e, t) {
  const n = (e - A) / Math.max(0, t), i = Math.floor(Math.log10(n)), o = n / Math.pow(10, i), l = o >= mS ? 10 : o >= vS ? 5 : o >= yS ? 2 : 1;
  let f, c, h;
  return i < 0 ? (h = Math.pow(10, -i) / l, f = Math.round(A * h), c = Math.round(e * h), f / h < A && ++f, c / h > e && --c, h = -h) : (h = Math.pow(10, i) * l, f = Math.round(A / h), c = Math.round(e / h), f * h < A && ++f, c * h > e && --c), c < f && 0.5 <= t && t < 2 ? oc(A, e, t * 2) : [f, c, h];
}
function CS(A, e, t) {
  if (e = +e, A = +A, t = +t, !(t > 0)) return [];
  if (A === e) return [A];
  const n = e < A, [i, o, l] = n ? oc(e, A, t) : oc(A, e, t);
  if (!(o >= i)) return [];
  const f = o - i + 1, c = new Array(f);
  if (n)
    if (l < 0) for (let h = 0; h < f; ++h) c[h] = (o - h) / -l;
    else for (let h = 0; h < f; ++h) c[h] = (o - h) * l;
  else if (l < 0) for (let h = 0; h < f; ++h) c[h] = (i + h) / -l;
  else for (let h = 0; h < f; ++h) c[h] = (i + h) * l;
  return c;
}
function Ad(A, e, t) {
  return e = +e, A = +A, t = +t, oc(A, e, t)[2];
}
function QS(A, e, t) {
  e = +e, A = +A, t = +t;
  const n = e < A, i = n ? Ad(e, A, t) : Ad(A, e, t);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var FS = { value: function() {
} };
function Oc() {
  for (var A = 0, e = arguments.length, t = {}, n; A < e; ++A) {
    if (!(n = arguments[A] + "") || n in t || /[\s.]/.test(n)) throw new Error("illegal type: " + n);
    t[n] = [];
  }
  return new Wl(t);
}
function Wl(A) {
  this._ = A;
}
function US(A, e) {
  return A.trim().split(/^|\s+/).map(function(t) {
    var n = "", i = t.indexOf(".");
    if (i >= 0 && (n = t.slice(i + 1), t = t.slice(0, i)), t && !e.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: n };
  });
}
Wl.prototype = Oc.prototype = {
  constructor: Wl,
  on: function(A, e) {
    var t = this._, n = US(A + "", t), i, o = -1, l = n.length;
    if (arguments.length < 2) {
      for (; ++o < l; ) if ((i = (A = n[o]).type) && (i = ES(t[i], A.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++o < l; )
      if (i = (A = n[o]).type) t[i] = pw(t[i], A.name, e);
      else if (e == null) for (i in t) t[i] = pw(t[i], A.name, null);
    return this;
  },
  copy: function() {
    var A = {}, e = this._;
    for (var t in e) A[t] = e[t].slice();
    return new Wl(A);
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
function ES(A, e) {
  for (var t = 0, n = A.length, i; t < n; ++t)
    if ((i = A[t]).name === e)
      return i.value;
}
function pw(A, e, t) {
  for (var n = 0, i = A.length; n < i; ++n)
    if (A[n].name === e) {
      A[n] = FS, A = A.slice(0, n).concat(A.slice(n + 1));
      break;
    }
  return t != null && A.push({ name: e, value: t }), A;
}
var ed = "http://www.w3.org/1999/xhtml";
const gw = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ed,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Nc(A) {
  var e = A += "", t = e.indexOf(":");
  return t >= 0 && (e = A.slice(0, t)) !== "xmlns" && (A = A.slice(t + 1)), gw.hasOwnProperty(e) ? { space: gw[e], local: A } : A;
}
function bS(A) {
  return function() {
    var e = this.ownerDocument, t = this.namespaceURI;
    return t === ed && e.documentElement.namespaceURI === ed ? e.createElement(A) : e.createElementNS(t, A);
  };
}
function _S(A) {
  return function() {
    return this.ownerDocument.createElementNS(A.space, A.local);
  };
}
function t0(A) {
  var e = Nc(A);
  return (e.local ? _S : bS)(e);
}
function xS() {
}
function Sp(A) {
  return A == null ? xS : function() {
    return this.querySelector(A);
  };
}
function IS(A) {
  typeof A != "function" && (A = Sp(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var o = e[i], l = o.length, f = n[i] = new Array(l), c, h, m = 0; m < l; ++m)
      (c = o[m]) && (h = A.call(c, c.__data__, m, o)) && ("__data__" in c && (h.__data__ = c.__data__), f[m] = h);
  return new Wt(n, this._parents);
}
function n0(A) {
  return A == null ? [] : Array.isArray(A) ? A : Array.from(A);
}
function HS() {
  return [];
}
function r0(A) {
  return A == null ? HS : function() {
    return this.querySelectorAll(A);
  };
}
function SS(A) {
  return function() {
    return n0(A.apply(this, arguments));
  };
}
function LS(A) {
  typeof A == "function" ? A = SS(A) : A = r0(A);
  for (var e = this._groups, t = e.length, n = [], i = [], o = 0; o < t; ++o)
    for (var l = e[o], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && (n.push(A.call(c, c.__data__, h, l)), i.push(c));
  return new Wt(n, i);
}
function i0(A) {
  return function() {
    return this.matches(A);
  };
}
function a0(A) {
  return function(e) {
    return e.matches(A);
  };
}
var TS = Array.prototype.find;
function DS(A) {
  return function() {
    return TS.call(this.children, A);
  };
}
function OS() {
  return this.firstElementChild;
}
function NS(A) {
  return this.select(A == null ? OS : DS(typeof A == "function" ? A : a0(A)));
}
var MS = Array.prototype.filter;
function PS() {
  return Array.from(this.children);
}
function KS(A) {
  return function() {
    return MS.call(this.children, A);
  };
}
function RS(A) {
  return this.selectAll(A == null ? PS : KS(typeof A == "function" ? A : a0(A)));
}
function kS(A) {
  typeof A != "function" && (A = i0(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var o = e[i], l = o.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = o[h]) && A.call(c, c.__data__, h, o) && f.push(c);
  return new Wt(n, this._parents);
}
function o0(A) {
  return new Array(A.length);
}
function $S() {
  return new Wt(this._enter || this._groups.map(o0), this._parents);
}
function sc(A, e) {
  this.ownerDocument = A.ownerDocument, this.namespaceURI = A.namespaceURI, this._next = null, this._parent = A, this.__data__ = e;
}
sc.prototype = {
  constructor: sc,
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
function GS(A) {
  return function() {
    return A;
  };
}
function VS(A, e, t, n, i, o) {
  for (var l = 0, f, c = e.length, h = o.length; l < h; ++l)
    (f = e[l]) ? (f.__data__ = o[l], n[l] = f) : t[l] = new sc(A, o[l]);
  for (; l < c; ++l)
    (f = e[l]) && (i[l] = f);
}
function WS(A, e, t, n, i, o, l) {
  var f, c, h = /* @__PURE__ */ new Map(), m = e.length, B = o.length, g = new Array(m), v;
  for (f = 0; f < m; ++f)
    (c = e[f]) && (g[f] = v = l.call(c, c.__data__, f, e) + "", h.has(v) ? i[f] = c : h.set(v, c));
  for (f = 0; f < B; ++f)
    v = l.call(A, o[f], f, o) + "", (c = h.get(v)) ? (n[f] = c, c.__data__ = o[f], h.delete(v)) : t[f] = new sc(A, o[f]);
  for (f = 0; f < m; ++f)
    (c = e[f]) && h.get(g[f]) === c && (i[f] = c);
}
function XS(A) {
  return A.__data__;
}
function qS(A, e) {
  if (!arguments.length) return Array.from(this, XS);
  var t = e ? WS : VS, n = this._parents, i = this._groups;
  typeof A != "function" && (A = GS(A));
  for (var o = i.length, l = new Array(o), f = new Array(o), c = new Array(o), h = 0; h < o; ++h) {
    var m = n[h], B = i[h], g = B.length, v = zS(A.call(m, m && m.__data__, h, n)), u = v.length, C = f[h] = new Array(u), F = l[h] = new Array(u), U = c[h] = new Array(g);
    t(m, B, C, F, U, v, e);
    for (var H = 0, O = 0, _, M; H < u; ++H)
      if (_ = C[H]) {
        for (H >= O && (O = H + 1); !(M = F[O]) && ++O < u; ) ;
        _._next = M || null;
      }
  }
  return l = new Wt(l, n), l._enter = f, l._exit = c, l;
}
function zS(A) {
  return typeof A == "object" && "length" in A ? A : Array.from(A);
}
function JS() {
  return new Wt(this._exit || this._groups.map(o0), this._parents);
}
function jS(A, e, t) {
  var n = this.enter(), i = this, o = this.exit();
  return typeof A == "function" ? (n = A(n), n && (n = n.selection())) : n = n.append(A + ""), e != null && (i = e(i), i && (i = i.selection())), t == null ? o.remove() : t(o), n && i ? n.merge(i).order() : i;
}
function YS(A) {
  for (var e = A.selection ? A.selection() : A, t = this._groups, n = e._groups, i = t.length, o = n.length, l = Math.min(i, o), f = new Array(i), c = 0; c < l; ++c)
    for (var h = t[c], m = n[c], B = h.length, g = f[c] = new Array(B), v, u = 0; u < B; ++u)
      (v = h[u] || m[u]) && (g[u] = v);
  for (; c < i; ++c)
    f[c] = t[c];
  return new Wt(f, this._parents);
}
function ZS() {
  for (var A = this._groups, e = -1, t = A.length; ++e < t; )
    for (var n = A[e], i = n.length - 1, o = n[i], l; --i >= 0; )
      (l = n[i]) && (o && l.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(l, o), o = l);
  return this;
}
function AL(A) {
  A || (A = eL);
  function e(B, g) {
    return B && g ? A(B.__data__, g.__data__) : !B - !g;
  }
  for (var t = this._groups, n = t.length, i = new Array(n), o = 0; o < n; ++o) {
    for (var l = t[o], f = l.length, c = i[o] = new Array(f), h, m = 0; m < f; ++m)
      (h = l[m]) && (c[m] = h);
    c.sort(e);
  }
  return new Wt(i, this._parents).order();
}
function eL(A, e) {
  return A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function tL() {
  var A = arguments[0];
  return arguments[0] = this, A.apply(null, arguments), this;
}
function nL() {
  return Array.from(this);
}
function rL() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, o = n.length; i < o; ++i) {
      var l = n[i];
      if (l) return l;
    }
  return null;
}
function iL() {
  let A = 0;
  for (const e of this) ++A;
  return A;
}
function aL() {
  return !this.node();
}
function oL(A) {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var i = e[t], o = 0, l = i.length, f; o < l; ++o)
      (f = i[o]) && A.call(f, f.__data__, o, i);
  return this;
}
function sL(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function uL(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function lL(A, e) {
  return function() {
    this.setAttribute(A, e);
  };
}
function cL(A, e) {
  return function() {
    this.setAttributeNS(A.space, A.local, e);
  };
}
function fL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttribute(A) : this.setAttribute(A, t);
  };
}
function hL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttributeNS(A.space, A.local) : this.setAttributeNS(A.space, A.local, t);
  };
}
function dL(A, e) {
  var t = Nc(A);
  if (arguments.length < 2) {
    var n = this.node();
    return t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t);
  }
  return this.each((e == null ? t.local ? uL : sL : typeof e == "function" ? t.local ? hL : fL : t.local ? cL : lL)(t, e));
}
function s0(A) {
  return A.ownerDocument && A.ownerDocument.defaultView || A.document && A || A.defaultView;
}
function pL(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function gL(A, e, t) {
  return function() {
    this.style.setProperty(A, e, t);
  };
}
function BL(A, e, t) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.style.removeProperty(A) : this.style.setProperty(A, n, t);
  };
}
function wL(A, e, t) {
  return arguments.length > 1 ? this.each((e == null ? pL : typeof e == "function" ? BL : gL)(A, e, t ?? "")) : ao(this.node(), A);
}
function ao(A, e) {
  return A.style.getPropertyValue(e) || s0(A).getComputedStyle(A, null).getPropertyValue(e);
}
function mL(A) {
  return function() {
    delete this[A];
  };
}
function vL(A, e) {
  return function() {
    this[A] = e;
  };
}
function yL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? delete this[A] : this[A] = t;
  };
}
function CL(A, e) {
  return arguments.length > 1 ? this.each((e == null ? mL : typeof e == "function" ? yL : vL)(A, e)) : this.node()[A];
}
function u0(A) {
  return A.trim().split(/^|\s+/);
}
function Lp(A) {
  return A.classList || new l0(A);
}
function l0(A) {
  this._node = A, this._names = u0(A.getAttribute("class") || "");
}
l0.prototype = {
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
function c0(A, e) {
  for (var t = Lp(A), n = -1, i = e.length; ++n < i; ) t.add(e[n]);
}
function f0(A, e) {
  for (var t = Lp(A), n = -1, i = e.length; ++n < i; ) t.remove(e[n]);
}
function QL(A) {
  return function() {
    c0(this, A);
  };
}
function FL(A) {
  return function() {
    f0(this, A);
  };
}
function UL(A, e) {
  return function() {
    (e.apply(this, arguments) ? c0 : f0)(this, A);
  };
}
function EL(A, e) {
  var t = u0(A + "");
  if (arguments.length < 2) {
    for (var n = Lp(this.node()), i = -1, o = t.length; ++i < o; ) if (!n.contains(t[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? UL : e ? QL : FL)(t, e));
}
function bL() {
  this.textContent = "";
}
function _L(A) {
  return function() {
    this.textContent = A;
  };
}
function xL(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function IL(A) {
  return arguments.length ? this.each(A == null ? bL : (typeof A == "function" ? xL : _L)(A)) : this.node().textContent;
}
function HL() {
  this.innerHTML = "";
}
function SL(A) {
  return function() {
    this.innerHTML = A;
  };
}
function LL(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function TL(A) {
  return arguments.length ? this.each(A == null ? HL : (typeof A == "function" ? LL : SL)(A)) : this.node().innerHTML;
}
function DL() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function OL() {
  return this.each(DL);
}
function NL() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ML() {
  return this.each(NL);
}
function PL(A) {
  var e = typeof A == "function" ? A : t0(A);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function KL() {
  return null;
}
function RL(A, e) {
  var t = typeof A == "function" ? A : t0(A), n = e == null ? KL : typeof e == "function" ? e : Sp(e);
  return this.select(function() {
    return this.insertBefore(t.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function kL() {
  var A = this.parentNode;
  A && A.removeChild(this);
}
function $L() {
  return this.each(kL);
}
function GL() {
  var A = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function VL() {
  var A = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function WL(A) {
  return this.select(A ? VL : GL);
}
function XL(A) {
  return arguments.length ? this.property("__data__", A) : this.node().__data__;
}
function qL(A) {
  return function(e) {
    A.call(this, e, this.__data__);
  };
}
function zL(A) {
  return A.trim().split(/^|\s+/).map(function(e) {
    var t = "", n = e.indexOf(".");
    return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), { type: e, name: t };
  });
}
function JL(A) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var t = 0, n = -1, i = e.length, o; t < i; ++t)
        o = e[t], (!A.type || o.type === A.type) && o.name === A.name ? this.removeEventListener(o.type, o.listener, o.options) : e[++n] = o;
      ++n ? e.length = n : delete this.__on;
    }
  };
}
function jL(A, e, t) {
  return function() {
    var n = this.__on, i, o = qL(e);
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
function YL(A, e, t) {
  var n = zL(A + ""), i, o = n.length, l;
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
  for (f = e ? jL : JL, i = 0; i < o; ++i) this.each(f(n[i], e, t));
  return this;
}
function h0(A, e, t) {
  var n = s0(A), i = n.CustomEvent;
  typeof i == "function" ? i = new i(e, t) : (i = n.document.createEvent("Event"), t ? (i.initEvent(e, t.bubbles, t.cancelable), i.detail = t.detail) : i.initEvent(e, !1, !1)), A.dispatchEvent(i);
}
function ZL(A, e) {
  return function() {
    return h0(this, A, e);
  };
}
function AT(A, e) {
  return function() {
    return h0(this, A, e.apply(this, arguments));
  };
}
function eT(A, e) {
  return this.each((typeof e == "function" ? AT : ZL)(A, e));
}
function* tT() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, o = n.length, l; i < o; ++i)
      (l = n[i]) && (yield l);
}
var Tp = [null];
function Wt(A, e) {
  this._groups = A, this._parents = e;
}
function Gs() {
  return new Wt([[document.documentElement]], Tp);
}
function nT() {
  return this;
}
Wt.prototype = Gs.prototype = {
  constructor: Wt,
  select: IS,
  selectAll: LS,
  selectChild: NS,
  selectChildren: RS,
  filter: kS,
  data: qS,
  enter: $S,
  exit: JS,
  join: jS,
  merge: YS,
  selection: nT,
  order: ZS,
  sort: AL,
  call: tL,
  nodes: nL,
  node: rL,
  size: iL,
  empty: aL,
  each: oL,
  attr: dL,
  style: wL,
  property: CL,
  classed: EL,
  text: IL,
  html: TL,
  raise: OL,
  lower: ML,
  append: PL,
  insert: RL,
  remove: $L,
  clone: WL,
  datum: XL,
  on: YL,
  dispatch: eT,
  [Symbol.iterator]: tT
};
function VA(A) {
  return typeof A == "string" ? new Wt([[document.querySelector(A)]], [document.documentElement]) : new Wt([[A]], Tp);
}
function rT(A) {
  let e;
  for (; e = A.sourceEvent; ) A = e;
  return A;
}
function Gn(A, e) {
  if (A = rT(A), e === void 0 && (e = A.currentTarget), e) {
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
function td(A) {
  return typeof A == "string" ? new Wt([document.querySelectorAll(A)], [document.documentElement]) : new Wt([n0(A)], Tp);
}
const iT = { passive: !1 }, Is = { capture: !0, passive: !1 };
function ph(A) {
  A.stopImmediatePropagation();
}
function Ao(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function d0(A) {
  var e = A.document.documentElement, t = VA(A).on("dragstart.drag", Ao, Is);
  "onselectstart" in e ? t.on("selectstart.drag", Ao, Is) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function p0(A, e) {
  var t = A.document.documentElement, n = VA(A).on("dragstart.drag", null);
  e && (n.on("click.drag", Ao, Is), setTimeout(function() {
    n.on("click.drag", null);
  }, 0)), "onselectstart" in t ? n.on("selectstart.drag", null) : (t.style.MozUserSelect = t.__noselect, delete t.__noselect);
}
const sl = (A) => () => A;
function nd(A, {
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
nd.prototype.on = function() {
  var A = this._.on.apply(this._, arguments);
  return A === this._ ? this : A;
};
function aT(A) {
  return !A.ctrlKey && !A.button;
}
function oT() {
  return this.parentNode;
}
function sT(A, e) {
  return e ?? { x: A.x, y: A.y };
}
function uT() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function lT() {
  var A = aT, e = oT, t = sT, n = uT, i = {}, o = Oc("start", "drag", "end"), l = 0, f, c, h, m, B = 0;
  function g(_) {
    _.on("mousedown.drag", v).filter(n).on("touchstart.drag", F).on("touchmove.drag", U, iT).on("touchend.drag touchcancel.drag", H).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(_, M) {
    if (!(m || !A.call(this, _, M))) {
      var K = O(this, e.call(this, _, M), _, M, "mouse");
      K && (VA(_.view).on("mousemove.drag", u, Is).on("mouseup.drag", C, Is), d0(_.view), ph(_), h = !1, f = _.clientX, c = _.clientY, K("start", _));
    }
  }
  function u(_) {
    if (Ao(_), !h) {
      var M = _.clientX - f, K = _.clientY - c;
      h = M * M + K * K > B;
    }
    i.mouse("drag", _);
  }
  function C(_) {
    VA(_.view).on("mousemove.drag mouseup.drag", null), p0(_.view, h), Ao(_), i.mouse("end", _);
  }
  function F(_, M) {
    if (A.call(this, _, M)) {
      var K = _.changedTouches, z = e.call(this, _, M), cA = K.length, sA, gA;
      for (sA = 0; sA < cA; ++sA)
        (gA = O(this, z, _, M, K[sA].identifier, K[sA])) && (ph(_), gA("start", _, K[sA]));
    }
  }
  function U(_) {
    var M = _.changedTouches, K = M.length, z, cA;
    for (z = 0; z < K; ++z)
      (cA = i[M[z].identifier]) && (Ao(_), cA("drag", _, M[z]));
  }
  function H(_) {
    var M = _.changedTouches, K = M.length, z, cA;
    for (m && clearTimeout(m), m = setTimeout(function() {
      m = null;
    }, 500), z = 0; z < K; ++z)
      (cA = i[M[z].identifier]) && (ph(_), cA("end", _, M[z]));
  }
  function O(_, M, K, z, cA, sA) {
    var gA = o.copy(), QA = Gn(sA || K, M), OA, _A, W;
    if ((W = t.call(_, new nd("beforestart", {
      sourceEvent: K,
      target: g,
      identifier: cA,
      active: l,
      x: QA[0],
      y: QA[1],
      dx: 0,
      dy: 0,
      dispatch: gA
    }), z)) != null)
      return OA = W.x - QA[0] || 0, _A = W.y - QA[1] || 0, function yA(eA, fA, bA) {
        var xA = QA, iA;
        switch (eA) {
          case "start":
            i[cA] = yA, iA = l++;
            break;
          case "end":
            delete i[cA], --l;
          case "drag":
            QA = Gn(bA || fA, M), iA = l;
            break;
        }
        gA.call(
          eA,
          _,
          new nd(eA, {
            sourceEvent: fA,
            subject: W,
            target: g,
            identifier: cA,
            active: iA,
            x: QA[0] + OA,
            y: QA[1] + _A,
            dx: QA[0] - xA[0],
            dy: QA[1] - xA[1],
            dispatch: gA
          }),
          z
        );
      };
  }
  return g.filter = function(_) {
    return arguments.length ? (A = typeof _ == "function" ? _ : sl(!!_), g) : A;
  }, g.container = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : sl(_), g) : e;
  }, g.subject = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : sl(_), g) : t;
  }, g.touchable = function(_) {
    return arguments.length ? (n = typeof _ == "function" ? _ : sl(!!_), g) : n;
  }, g.on = function() {
    var _ = o.on.apply(o, arguments);
    return _ === o ? g : _;
  }, g.clickDistance = function(_) {
    return arguments.length ? (B = (_ = +_) * _, g) : Math.sqrt(B);
  }, g;
}
function Dp(A, e, t) {
  A.prototype = e.prototype = t, t.constructor = A;
}
function g0(A, e) {
  var t = Object.create(A.prototype);
  for (var n in e) t[n] = e[n];
  return t;
}
function Vs() {
}
var Hs = 0.7, uc = 1 / Hs, eo = "\\s*([+-]?\\d+)\\s*", Ss = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", fr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", cT = /^#([0-9a-f]{3,8})$/, fT = new RegExp(`^rgb\\(${eo},${eo},${eo}\\)$`), hT = new RegExp(`^rgb\\(${fr},${fr},${fr}\\)$`), dT = new RegExp(`^rgba\\(${eo},${eo},${eo},${Ss}\\)$`), pT = new RegExp(`^rgba\\(${fr},${fr},${fr},${Ss}\\)$`), gT = new RegExp(`^hsl\\(${Ss},${fr},${fr}\\)$`), BT = new RegExp(`^hsla\\(${Ss},${fr},${fr},${Ss}\\)$`), Bw = {
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
Dp(Vs, sa, {
  copy(A) {
    return Object.assign(new this.constructor(), this, A);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ww,
  // Deprecated! Use color.formatHex.
  formatHex: ww,
  formatHex8: wT,
  formatHsl: mT,
  formatRgb: mw,
  toString: mw
});
function ww() {
  return this.rgb().formatHex();
}
function wT() {
  return this.rgb().formatHex8();
}
function mT() {
  return B0(this).formatHsl();
}
function mw() {
  return this.rgb().formatRgb();
}
function sa(A) {
  var e, t;
  return A = (A + "").trim().toLowerCase(), (e = cT.exec(A)) ? (t = e[1].length, e = parseInt(e[1], 16), t === 6 ? vw(e) : t === 3 ? new en(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : t === 8 ? ul(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : t === 4 ? ul(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = fT.exec(A)) ? new en(e[1], e[2], e[3], 1) : (e = hT.exec(A)) ? new en(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = dT.exec(A)) ? ul(e[1], e[2], e[3], e[4]) : (e = pT.exec(A)) ? ul(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = gT.exec(A)) ? Qw(e[1], e[2] / 100, e[3] / 100, 1) : (e = BT.exec(A)) ? Qw(e[1], e[2] / 100, e[3] / 100, e[4]) : Bw.hasOwnProperty(A) ? vw(Bw[A]) : A === "transparent" ? new en(NaN, NaN, NaN, 0) : null;
}
function vw(A) {
  return new en(A >> 16 & 255, A >> 8 & 255, A & 255, 1);
}
function ul(A, e, t, n) {
  return n <= 0 && (A = e = t = NaN), new en(A, e, t, n);
}
function vT(A) {
  return A instanceof Vs || (A = sa(A)), A ? (A = A.rgb(), new en(A.r, A.g, A.b, A.opacity)) : new en();
}
function rd(A, e, t, n) {
  return arguments.length === 1 ? vT(A) : new en(A, e, t, n ?? 1);
}
function en(A, e, t, n) {
  this.r = +A, this.g = +e, this.b = +t, this.opacity = +n;
}
Dp(en, rd, g0(Vs, {
  brighter(A) {
    return A = A == null ? uc : Math.pow(uc, A), new en(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Hs : Math.pow(Hs, A), new en(this.r * A, this.g * A, this.b * A, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new en(ta(this.r), ta(this.g), ta(this.b), lc(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: yw,
  // Deprecated! Use color.formatHex.
  formatHex: yw,
  formatHex8: yT,
  formatRgb: Cw,
  toString: Cw
}));
function yw() {
  return `#${Aa(this.r)}${Aa(this.g)}${Aa(this.b)}`;
}
function yT() {
  return `#${Aa(this.r)}${Aa(this.g)}${Aa(this.b)}${Aa((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Cw() {
  const A = lc(this.opacity);
  return `${A === 1 ? "rgb(" : "rgba("}${ta(this.r)}, ${ta(this.g)}, ${ta(this.b)}${A === 1 ? ")" : `, ${A})`}`;
}
function lc(A) {
  return isNaN(A) ? 1 : Math.max(0, Math.min(1, A));
}
function ta(A) {
  return Math.max(0, Math.min(255, Math.round(A) || 0));
}
function Aa(A) {
  return A = ta(A), (A < 16 ? "0" : "") + A.toString(16);
}
function Qw(A, e, t, n) {
  return n <= 0 ? A = e = t = NaN : t <= 0 || t >= 1 ? A = e = NaN : e <= 0 && (A = NaN), new Xn(A, e, t, n);
}
function B0(A) {
  if (A instanceof Xn) return new Xn(A.h, A.s, A.l, A.opacity);
  if (A instanceof Vs || (A = sa(A)), !A) return new Xn();
  if (A instanceof Xn) return A;
  A = A.rgb();
  var e = A.r / 255, t = A.g / 255, n = A.b / 255, i = Math.min(e, t, n), o = Math.max(e, t, n), l = NaN, f = o - i, c = (o + i) / 2;
  return f ? (e === o ? l = (t - n) / f + (t < n) * 6 : t === o ? l = (n - e) / f + 2 : l = (e - t) / f + 4, f /= c < 0.5 ? o + i : 2 - o - i, l *= 60) : f = c > 0 && c < 1 ? 0 : l, new Xn(l, f, c, A.opacity);
}
function CT(A, e, t, n) {
  return arguments.length === 1 ? B0(A) : new Xn(A, e, t, n ?? 1);
}
function Xn(A, e, t, n) {
  this.h = +A, this.s = +e, this.l = +t, this.opacity = +n;
}
Dp(Xn, CT, g0(Vs, {
  brighter(A) {
    return A = A == null ? uc : Math.pow(uc, A), new Xn(this.h, this.s, this.l * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Hs : Math.pow(Hs, A), new Xn(this.h, this.s, this.l * A, this.opacity);
  },
  rgb() {
    var A = this.h % 360 + (this.h < 0) * 360, e = isNaN(A) || isNaN(this.s) ? 0 : this.s, t = this.l, n = t + (t < 0.5 ? t : 1 - t) * e, i = 2 * t - n;
    return new en(
      gh(A >= 240 ? A - 240 : A + 120, i, n),
      gh(A, i, n),
      gh(A < 120 ? A + 240 : A - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new Xn(Fw(this.h), ll(this.s), ll(this.l), lc(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const A = lc(this.opacity);
    return `${A === 1 ? "hsl(" : "hsla("}${Fw(this.h)}, ${ll(this.s) * 100}%, ${ll(this.l) * 100}%${A === 1 ? ")" : `, ${A})`}`;
  }
}));
function Fw(A) {
  return A = (A || 0) % 360, A < 0 ? A + 360 : A;
}
function ll(A) {
  return Math.max(0, Math.min(1, A || 0));
}
function gh(A, e, t) {
  return (A < 60 ? e + (t - e) * A / 60 : A < 180 ? t : A < 240 ? e + (t - e) * (240 - A) / 60 : e) * 255;
}
const Op = (A) => () => A;
function QT(A, e) {
  return function(t) {
    return A + t * e;
  };
}
function FT(A, e, t) {
  return A = Math.pow(A, t), e = Math.pow(e, t) - A, t = 1 / t, function(n) {
    return Math.pow(A + n * e, t);
  };
}
function UT(A) {
  return (A = +A) == 1 ? w0 : function(e, t) {
    return t - e ? FT(e, t, A) : Op(isNaN(e) ? t : e);
  };
}
function w0(A, e) {
  var t = e - A;
  return t ? QT(A, t) : Op(isNaN(A) ? e : A);
}
const cc = function A(e) {
  var t = UT(e);
  function n(i, o) {
    var l = t((i = rd(i)).r, (o = rd(o)).r), f = t(i.g, o.g), c = t(i.b, o.b), h = w0(i.opacity, o.opacity);
    return function(m) {
      return i.r = l(m), i.g = f(m), i.b = c(m), i.opacity = h(m), i + "";
    };
  }
  return n.gamma = A, n;
}(1);
function ET(A, e) {
  e || (e = []);
  var t = A ? Math.min(e.length, A.length) : 0, n = e.slice(), i;
  return function(o) {
    for (i = 0; i < t; ++i) n[i] = A[i] * (1 - o) + e[i] * o;
    return n;
  };
}
function bT(A) {
  return ArrayBuffer.isView(A) && !(A instanceof DataView);
}
function _T(A, e) {
  var t = e ? e.length : 0, n = A ? Math.min(t, A.length) : 0, i = new Array(n), o = new Array(t), l;
  for (l = 0; l < n; ++l) i[l] = Np(A[l], e[l]);
  for (; l < t; ++l) o[l] = e[l];
  return function(f) {
    for (l = 0; l < n; ++l) o[l] = i[l](f);
    return o;
  };
}
function xT(A, e) {
  var t = /* @__PURE__ */ new Date();
  return A = +A, e = +e, function(n) {
    return t.setTime(A * (1 - n) + e * n), t;
  };
}
function Vn(A, e) {
  return A = +A, e = +e, function(t) {
    return A * (1 - t) + e * t;
  };
}
function IT(A, e) {
  var t = {}, n = {}, i;
  (A === null || typeof A != "object") && (A = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in A ? t[i] = Np(A[i], e[i]) : n[i] = e[i];
  return function(o) {
    for (i in t) n[i] = t[i](o);
    return n;
  };
}
var id = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Bh = new RegExp(id.source, "g");
function HT(A) {
  return function() {
    return A;
  };
}
function ST(A) {
  return function(e) {
    return A(e) + "";
  };
}
function m0(A, e) {
  var t = id.lastIndex = Bh.lastIndex = 0, n, i, o, l = -1, f = [], c = [];
  for (A = A + "", e = e + ""; (n = id.exec(A)) && (i = Bh.exec(e)); )
    (o = i.index) > t && (o = e.slice(t, o), f[l] ? f[l] += o : f[++l] = o), (n = n[0]) === (i = i[0]) ? f[l] ? f[l] += i : f[++l] = i : (f[++l] = null, c.push({ i: l, x: Vn(n, i) })), t = Bh.lastIndex;
  return t < e.length && (o = e.slice(t), f[l] ? f[l] += o : f[++l] = o), f.length < 2 ? c[0] ? ST(c[0].x) : HT(e) : (e = c.length, function(h) {
    for (var m = 0, B; m < e; ++m) f[(B = c[m]).i] = B.x(h);
    return f.join("");
  });
}
function Np(A, e) {
  var t = typeof e, n;
  return e == null || t === "boolean" ? Op(e) : (t === "number" ? Vn : t === "string" ? (n = sa(e)) ? (e = n, cc) : m0 : e instanceof sa ? cc : e instanceof Date ? xT : bT(e) ? ET : Array.isArray(e) ? _T : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? IT : Vn)(A, e);
}
function LT(A, e) {
  return A = +A, e = +e, function(t) {
    return Math.round(A * (1 - t) + e * t);
  };
}
var Uw = 180 / Math.PI, ad = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function v0(A, e, t, n, i, o) {
  var l, f, c;
  return (l = Math.sqrt(A * A + e * e)) && (A /= l, e /= l), (c = A * t + e * n) && (t -= A * c, n -= e * c), (f = Math.sqrt(t * t + n * n)) && (t /= f, n /= f, c /= f), A * n < e * t && (A = -A, e = -e, c = -c, l = -l), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(e, A) * Uw,
    skewX: Math.atan(c) * Uw,
    scaleX: l,
    scaleY: f
  };
}
var cl;
function TT(A) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(A + "");
  return e.isIdentity ? ad : v0(e.a, e.b, e.c, e.d, e.e, e.f);
}
function DT(A) {
  return A == null || (cl || (cl = document.createElementNS("http://www.w3.org/2000/svg", "g")), cl.setAttribute("transform", A), !(A = cl.transform.baseVal.consolidate())) ? ad : (A = A.matrix, v0(A.a, A.b, A.c, A.d, A.e, A.f));
}
function y0(A, e, t, n) {
  function i(h) {
    return h.length ? h.pop() + " " : "";
  }
  function o(h, m, B, g, v, u) {
    if (h !== B || m !== g) {
      var C = v.push("translate(", null, e, null, t);
      u.push({ i: C - 4, x: Vn(h, B) }, { i: C - 2, x: Vn(m, g) });
    } else (B || g) && v.push("translate(" + B + e + g + t);
  }
  function l(h, m, B, g) {
    h !== m ? (h - m > 180 ? m += 360 : m - h > 180 && (h += 360), g.push({ i: B.push(i(B) + "rotate(", null, n) - 2, x: Vn(h, m) })) : m && B.push(i(B) + "rotate(" + m + n);
  }
  function f(h, m, B, g) {
    h !== m ? g.push({ i: B.push(i(B) + "skewX(", null, n) - 2, x: Vn(h, m) }) : m && B.push(i(B) + "skewX(" + m + n);
  }
  function c(h, m, B, g, v, u) {
    if (h !== B || m !== g) {
      var C = v.push(i(v) + "scale(", null, ",", null, ")");
      u.push({ i: C - 4, x: Vn(h, B) }, { i: C - 2, x: Vn(m, g) });
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
var OT = y0(TT, "px, ", "px)", "deg)"), NT = y0(DT, ", ", ")", ")"), MT = 1e-12;
function Ew(A) {
  return ((A = Math.exp(A)) + 1 / A) / 2;
}
function PT(A) {
  return ((A = Math.exp(A)) - 1 / A) / 2;
}
function KT(A) {
  return ((A = Math.exp(2 * A)) - 1) / (A + 1);
}
const RT = function A(e, t, n) {
  function i(o, l) {
    var f = o[0], c = o[1], h = o[2], m = l[0], B = l[1], g = l[2], v = m - f, u = B - c, C = v * v + u * u, F, U;
    if (C < MT)
      U = Math.log(g / h) / e, F = function(z) {
        return [
          f + z * v,
          c + z * u,
          h * Math.exp(e * z * U)
        ];
      };
    else {
      var H = Math.sqrt(C), O = (g * g - h * h + n * C) / (2 * h * t * H), _ = (g * g - h * h - n * C) / (2 * g * t * H), M = Math.log(Math.sqrt(O * O + 1) - O), K = Math.log(Math.sqrt(_ * _ + 1) - _);
      U = (K - M) / e, F = function(z) {
        var cA = z * U, sA = Ew(M), gA = h / (t * H) * (sA * KT(e * cA + M) - PT(M));
        return [
          f + gA * v,
          c + gA * u,
          h * sA / Ew(e * cA + M)
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
var oo = 0, os = 0, Yo = 0, C0 = 1e3, fc, ss, hc = 0, ua = 0, Mc = 0, Ls = typeof performance == "object" && performance.now ? performance : Date, Q0 = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(A) {
  setTimeout(A, 17);
};
function Mp() {
  return ua || (Q0(kT), ua = Ls.now() + Mc);
}
function kT() {
  ua = 0;
}
function dc() {
  this._call = this._time = this._next = null;
}
dc.prototype = F0.prototype = {
  constructor: dc,
  restart: function(A, e, t) {
    if (typeof A != "function") throw new TypeError("callback is not a function");
    t = (t == null ? Mp() : +t) + (e == null ? 0 : +e), !this._next && ss !== this && (ss ? ss._next = this : fc = this, ss = this), this._call = A, this._time = t, od();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, od());
  }
};
function F0(A, e, t) {
  var n = new dc();
  return n.restart(A, e, t), n;
}
function $T() {
  Mp(), ++oo;
  for (var A = fc, e; A; )
    (e = ua - A._time) >= 0 && A._call.call(void 0, e), A = A._next;
  --oo;
}
function bw() {
  ua = (hc = Ls.now()) + Mc, oo = os = 0;
  try {
    $T();
  } finally {
    oo = 0, VT(), ua = 0;
  }
}
function GT() {
  var A = Ls.now(), e = A - hc;
  e > C0 && (Mc -= e, hc = A);
}
function VT() {
  for (var A, e = fc, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), A = e, e = e._next) : (t = e._next, e._next = null, e = A ? A._next = t : fc = t);
  ss = A, od(n);
}
function od(A) {
  if (!oo) {
    os && (os = clearTimeout(os));
    var e = A - ua;
    e > 24 ? (A < 1 / 0 && (os = setTimeout(bw, A - Ls.now() - Mc)), Yo && (Yo = clearInterval(Yo))) : (Yo || (hc = Ls.now(), Yo = setInterval(GT, C0)), oo = 1, Q0(bw));
  }
}
function _w(A, e, t) {
  var n = new dc();
  return e = e == null ? 0 : +e, n.restart((i) => {
    n.stop(), A(i + e);
  }, e, t), n;
}
var WT = Oc("start", "end", "cancel", "interrupt"), XT = [], U0 = 0, xw = 1, sd = 2, Xl = 3, Iw = 4, ud = 5, ql = 6;
function Pc(A, e, t, n, i, o) {
  var l = A.__transition;
  if (!l) A.__transition = {};
  else if (t in l) return;
  qT(A, t, {
    name: e,
    index: n,
    // For context during callback.
    group: i,
    // For context during callback.
    on: WT,
    tween: XT,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: U0
  });
}
function Pp(A, e) {
  var t = zn(A, e);
  if (t.state > U0) throw new Error("too late; already scheduled");
  return t;
}
function gr(A, e) {
  var t = zn(A, e);
  if (t.state > Xl) throw new Error("too late; already running");
  return t;
}
function zn(A, e) {
  var t = A.__transition;
  if (!t || !(t = t[e])) throw new Error("transition not found");
  return t;
}
function qT(A, e, t) {
  var n = A.__transition, i;
  n[e] = t, t.timer = F0(o, 0, t.time);
  function o(h) {
    t.state = xw, t.timer.restart(l, t.delay, t.time), t.delay <= h && l(h - t.delay);
  }
  function l(h) {
    var m, B, g, v;
    if (t.state !== xw) return c();
    for (m in n)
      if (v = n[m], v.name === t.name) {
        if (v.state === Xl) return _w(l);
        v.state === Iw ? (v.state = ql, v.timer.stop(), v.on.call("interrupt", A, A.__data__, v.index, v.group), delete n[m]) : +m < e && (v.state = ql, v.timer.stop(), v.on.call("cancel", A, A.__data__, v.index, v.group), delete n[m]);
      }
    if (_w(function() {
      t.state === Xl && (t.state = Iw, t.timer.restart(f, t.delay, t.time), f(h));
    }), t.state = sd, t.on.call("start", A, A.__data__, t.index, t.group), t.state === sd) {
      for (t.state = Xl, i = new Array(g = t.tween.length), m = 0, B = -1; m < g; ++m)
        (v = t.tween[m].value.call(A, A.__data__, t.index, t.group)) && (i[++B] = v);
      i.length = B + 1;
    }
  }
  function f(h) {
    for (var m = h < t.duration ? t.ease.call(null, h / t.duration) : (t.timer.restart(c), t.state = ud, 1), B = -1, g = i.length; ++B < g; )
      i[B].call(A, m);
    t.state === ud && (t.on.call("end", A, A.__data__, t.index, t.group), c());
  }
  function c() {
    t.state = ql, t.timer.stop(), delete n[e];
    for (var h in n) return;
    delete A.__transition;
  }
}
function zl(A, e) {
  var t = A.__transition, n, i, o = !0, l;
  if (t) {
    e = e == null ? null : e + "";
    for (l in t) {
      if ((n = t[l]).name !== e) {
        o = !1;
        continue;
      }
      i = n.state > sd && n.state < ud, n.state = ql, n.timer.stop(), n.on.call(i ? "interrupt" : "cancel", A, A.__data__, n.index, n.group), delete t[l];
    }
    o && delete A.__transition;
  }
}
function zT(A) {
  return this.each(function() {
    zl(this, A);
  });
}
function JT(A, e) {
  var t, n;
  return function() {
    var i = gr(this, A), o = i.tween;
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
function jT(A, e, t) {
  var n, i;
  if (typeof t != "function") throw new Error();
  return function() {
    var o = gr(this, A), l = o.tween;
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
function YT(A, e) {
  var t = this._id;
  if (A += "", arguments.length < 2) {
    for (var n = zn(this.node(), t).tween, i = 0, o = n.length, l; i < o; ++i)
      if ((l = n[i]).name === A)
        return l.value;
    return null;
  }
  return this.each((e == null ? JT : jT)(t, A, e));
}
function Kp(A, e, t) {
  var n = A._id;
  return A.each(function() {
    var i = gr(this, n);
    (i.value || (i.value = {}))[e] = t.apply(this, arguments);
  }), function(i) {
    return zn(i, n).value[e];
  };
}
function E0(A, e) {
  var t;
  return (typeof e == "number" ? Vn : e instanceof sa ? cc : (t = sa(e)) ? (e = t, cc) : m0)(A, e);
}
function ZT(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function AD(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function eD(A, e, t) {
  var n, i = t + "", o;
  return function() {
    var l = this.getAttribute(A);
    return l === i ? null : l === n ? o : o = e(n = l, t);
  };
}
function tD(A, e, t) {
  var n, i = t + "", o;
  return function() {
    var l = this.getAttributeNS(A.space, A.local);
    return l === i ? null : l === n ? o : o = e(n = l, t);
  };
}
function nD(A, e, t) {
  var n, i, o;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttribute(A) : (l = this.getAttribute(A), c = f + "", l === c ? null : l === n && c === i ? o : (i = c, o = e(n = l, f)));
  };
}
function rD(A, e, t) {
  var n, i, o;
  return function() {
    var l, f = t(this), c;
    return f == null ? void this.removeAttributeNS(A.space, A.local) : (l = this.getAttributeNS(A.space, A.local), c = f + "", l === c ? null : l === n && c === i ? o : (i = c, o = e(n = l, f)));
  };
}
function iD(A, e) {
  var t = Nc(A), n = t === "transform" ? NT : E0;
  return this.attrTween(A, typeof e == "function" ? (t.local ? rD : nD)(t, n, Kp(this, "attr." + A, e)) : e == null ? (t.local ? AD : ZT)(t) : (t.local ? tD : eD)(t, n, e));
}
function aD(A, e) {
  return function(t) {
    this.setAttribute(A, e.call(this, t));
  };
}
function oD(A, e) {
  return function(t) {
    this.setAttributeNS(A.space, A.local, e.call(this, t));
  };
}
function sD(A, e) {
  var t, n;
  function i() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && oD(A, o)), t;
  }
  return i._value = e, i;
}
function uD(A, e) {
  var t, n;
  function i() {
    var o = e.apply(this, arguments);
    return o !== n && (t = (n = o) && aD(A, o)), t;
  }
  return i._value = e, i;
}
function lD(A, e) {
  var t = "attr." + A;
  if (arguments.length < 2) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  var n = Nc(A);
  return this.tween(t, (n.local ? sD : uD)(n, e));
}
function cD(A, e) {
  return function() {
    Pp(this, A).delay = +e.apply(this, arguments);
  };
}
function fD(A, e) {
  return e = +e, function() {
    Pp(this, A).delay = e;
  };
}
function hD(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? cD : fD)(e, A)) : zn(this.node(), e).delay;
}
function dD(A, e) {
  return function() {
    gr(this, A).duration = +e.apply(this, arguments);
  };
}
function pD(A, e) {
  return e = +e, function() {
    gr(this, A).duration = e;
  };
}
function gD(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? dD : pD)(e, A)) : zn(this.node(), e).duration;
}
function BD(A, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    gr(this, A).ease = e;
  };
}
function wD(A) {
  var e = this._id;
  return arguments.length ? this.each(BD(e, A)) : zn(this.node(), e).ease;
}
function mD(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    if (typeof t != "function") throw new Error();
    gr(this, A).ease = t;
  };
}
function vD(A) {
  if (typeof A != "function") throw new Error();
  return this.each(mD(this._id, A));
}
function yD(A) {
  typeof A != "function" && (A = i0(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var o = e[i], l = o.length, f = n[i] = [], c, h = 0; h < l; ++h)
      (c = o[h]) && A.call(c, c.__data__, h, o) && f.push(c);
  return new Vr(n, this._parents, this._name, this._id);
}
function CD(A) {
  if (A._id !== this._id) throw new Error();
  for (var e = this._groups, t = A._groups, n = e.length, i = t.length, o = Math.min(n, i), l = new Array(n), f = 0; f < o; ++f)
    for (var c = e[f], h = t[f], m = c.length, B = l[f] = new Array(m), g, v = 0; v < m; ++v)
      (g = c[v] || h[v]) && (B[v] = g);
  for (; f < n; ++f)
    l[f] = e[f];
  return new Vr(l, this._parents, this._name, this._id);
}
function QD(A) {
  return (A + "").trim().split(/^|\s+/).every(function(e) {
    var t = e.indexOf(".");
    return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
  });
}
function FD(A, e, t) {
  var n, i, o = QD(e) ? Pp : gr;
  return function() {
    var l = o(this, A), f = l.on;
    f !== n && (i = (n = f).copy()).on(e, t), l.on = i;
  };
}
function UD(A, e) {
  var t = this._id;
  return arguments.length < 2 ? zn(this.node(), t).on.on(A) : this.each(FD(t, A, e));
}
function ED(A) {
  return function() {
    var e = this.parentNode;
    for (var t in this.__transition) if (+t !== A) return;
    e && e.removeChild(this);
  };
}
function bD() {
  return this.on("end.remove", ED(this._id));
}
function _D(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Sp(A));
  for (var n = this._groups, i = n.length, o = new Array(i), l = 0; l < i; ++l)
    for (var f = n[l], c = f.length, h = o[l] = new Array(c), m, B, g = 0; g < c; ++g)
      (m = f[g]) && (B = A.call(m, m.__data__, g, f)) && ("__data__" in m && (B.__data__ = m.__data__), h[g] = B, Pc(h[g], e, t, g, h, zn(m, t)));
  return new Vr(o, this._parents, e, t);
}
function xD(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = r0(A));
  for (var n = this._groups, i = n.length, o = [], l = [], f = 0; f < i; ++f)
    for (var c = n[f], h = c.length, m, B = 0; B < h; ++B)
      if (m = c[B]) {
        for (var g = A.call(m, m.__data__, B, c), v, u = zn(m, t), C = 0, F = g.length; C < F; ++C)
          (v = g[C]) && Pc(v, e, t, C, g, u);
        o.push(g), l.push(m);
      }
  return new Vr(o, l, e, t);
}
var ID = Gs.prototype.constructor;
function HD() {
  return new ID(this._groups, this._parents);
}
function SD(A, e) {
  var t, n, i;
  return function() {
    var o = ao(this, A), l = (this.style.removeProperty(A), ao(this, A));
    return o === l ? null : o === t && l === n ? i : i = e(t = o, n = l);
  };
}
function b0(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function LD(A, e, t) {
  var n, i = t + "", o;
  return function() {
    var l = ao(this, A);
    return l === i ? null : l === n ? o : o = e(n = l, t);
  };
}
function TD(A, e, t) {
  var n, i, o;
  return function() {
    var l = ao(this, A), f = t(this), c = f + "";
    return f == null && (c = f = (this.style.removeProperty(A), ao(this, A))), l === c ? null : l === n && c === i ? o : (i = c, o = e(n = l, f));
  };
}
function DD(A, e) {
  var t, n, i, o = "style." + e, l = "end." + o, f;
  return function() {
    var c = gr(this, A), h = c.on, m = c.value[o] == null ? f || (f = b0(e)) : void 0;
    (h !== t || i !== m) && (n = (t = h).copy()).on(l, i = m), c.on = n;
  };
}
function OD(A, e, t) {
  var n = (A += "") == "transform" ? OT : E0;
  return e == null ? this.styleTween(A, SD(A, n)).on("end.style." + A, b0(A)) : typeof e == "function" ? this.styleTween(A, TD(A, n, Kp(this, "style." + A, e))).each(DD(this._id, A)) : this.styleTween(A, LD(A, n, e), t).on("end.style." + A, null);
}
function ND(A, e, t) {
  return function(n) {
    this.style.setProperty(A, e.call(this, n), t);
  };
}
function MD(A, e, t) {
  var n, i;
  function o() {
    var l = e.apply(this, arguments);
    return l !== i && (n = (i = l) && ND(A, l, t)), n;
  }
  return o._value = e, o;
}
function PD(A, e, t) {
  var n = "style." + (A += "");
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, MD(A, e, t ?? ""));
}
function KD(A) {
  return function() {
    this.textContent = A;
  };
}
function RD(A) {
  return function() {
    var e = A(this);
    this.textContent = e ?? "";
  };
}
function kD(A) {
  return this.tween("text", typeof A == "function" ? RD(Kp(this, "text", A)) : KD(A == null ? "" : A + ""));
}
function $D(A) {
  return function(e) {
    this.textContent = A.call(this, e);
  };
}
function GD(A) {
  var e, t;
  function n() {
    var i = A.apply(this, arguments);
    return i !== t && (e = (t = i) && $D(i)), e;
  }
  return n._value = A, n;
}
function VD(A) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (A == null) return this.tween(e, null);
  if (typeof A != "function") throw new Error();
  return this.tween(e, GD(A));
}
function WD() {
  for (var A = this._name, e = this._id, t = _0(), n = this._groups, i = n.length, o = 0; o < i; ++o)
    for (var l = n[o], f = l.length, c, h = 0; h < f; ++h)
      if (c = l[h]) {
        var m = zn(c, e);
        Pc(c, A, t, h, l, {
          time: m.time + m.delay + m.duration,
          delay: 0,
          duration: m.duration,
          ease: m.ease
        });
      }
  return new Vr(n, this._parents, A, t);
}
function XD() {
  var A, e, t = this, n = t._id, i = t.size();
  return new Promise(function(o, l) {
    var f = { value: l }, c = { value: function() {
      --i === 0 && o();
    } };
    t.each(function() {
      var h = gr(this, n), m = h.on;
      m !== A && (e = (A = m).copy(), e._.cancel.push(f), e._.interrupt.push(f), e._.end.push(c)), h.on = e;
    }), i === 0 && o();
  });
}
var qD = 0;
function Vr(A, e, t, n) {
  this._groups = A, this._parents = e, this._name = t, this._id = n;
}
function _0() {
  return ++qD;
}
var Or = Gs.prototype;
Vr.prototype = {
  constructor: Vr,
  select: _D,
  selectAll: xD,
  selectChild: Or.selectChild,
  selectChildren: Or.selectChildren,
  filter: yD,
  merge: CD,
  selection: HD,
  transition: WD,
  call: Or.call,
  nodes: Or.nodes,
  node: Or.node,
  size: Or.size,
  empty: Or.empty,
  each: Or.each,
  on: UD,
  attr: iD,
  attrTween: lD,
  style: OD,
  styleTween: PD,
  text: kD,
  textTween: VD,
  remove: bD,
  tween: YT,
  delay: hD,
  duration: gD,
  ease: wD,
  easeVarying: vD,
  end: XD,
  [Symbol.iterator]: Or[Symbol.iterator]
};
function zD(A) {
  return ((A *= 2) <= 1 ? A * A * A : (A -= 2) * A * A + 2) / 2;
}
var JD = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: zD
};
function jD(A, e) {
  for (var t; !(t = A.__transition) || !(t = t[e]); )
    if (!(A = A.parentNode))
      throw new Error(`transition ${e} not found`);
  return t;
}
function YD(A) {
  var e, t;
  A instanceof Vr ? (e = A._id, A = A._name) : (e = _0(), (t = JD).time = Mp(), A = A == null ? null : A + "");
  for (var n = this._groups, i = n.length, o = 0; o < i; ++o)
    for (var l = n[o], f = l.length, c, h = 0; h < f; ++h)
      (c = l[h]) && Pc(c, A, e, h, l, t || jD(c, e));
  return new Vr(n, this._parents, A, e);
}
Gs.prototype.interrupt = zT;
Gs.prototype.transition = YD;
function ZD(A) {
  return Math.abs(A = Math.round(A)) >= 1e21 ? A.toLocaleString("en").replace(/,/g, "") : A.toString(10);
}
function pc(A, e) {
  if ((t = (A = e ? A.toExponential(e - 1) : A.toExponential()).indexOf("e")) < 0) return null;
  var t, n = A.slice(0, t);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +A.slice(t + 1)
  ];
}
function so(A) {
  return A = pc(Math.abs(A)), A ? A[1] : NaN;
}
function AO(A, e) {
  return function(t, n) {
    for (var i = t.length, o = [], l = 0, f = A[0], c = 0; i > 0 && f > 0 && (c + f + 1 > n && (f = Math.max(1, n - c)), o.push(t.substring(i -= f, i + f)), !((c += f + 1) > n)); )
      f = A[l = (l + 1) % A.length];
    return o.reverse().join(e);
  };
}
function eO(A) {
  return function(e) {
    return e.replace(/[0-9]/g, function(t) {
      return A[+t];
    });
  };
}
var tO = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function gc(A) {
  if (!(e = tO.exec(A))) throw new Error("invalid format: " + A);
  var e;
  return new Rp({
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
gc.prototype = Rp.prototype;
function Rp(A) {
  this.fill = A.fill === void 0 ? " " : A.fill + "", this.align = A.align === void 0 ? ">" : A.align + "", this.sign = A.sign === void 0 ? "-" : A.sign + "", this.symbol = A.symbol === void 0 ? "" : A.symbol + "", this.zero = !!A.zero, this.width = A.width === void 0 ? void 0 : +A.width, this.comma = !!A.comma, this.precision = A.precision === void 0 ? void 0 : +A.precision, this.trim = !!A.trim, this.type = A.type === void 0 ? "" : A.type + "";
}
Rp.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function nO(A) {
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
var x0;
function rO(A, e) {
  var t = pc(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1], o = i - (x0 = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, l = n.length;
  return o === l ? n : o > l ? n + new Array(o - l + 1).join("0") : o > 0 ? n.slice(0, o) + "." + n.slice(o) : "0." + new Array(1 - o).join("0") + pc(A, Math.max(0, e + o - 1))[0];
}
function Hw(A, e) {
  var t = pc(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const Sw = {
  "%": (A, e) => (A * 100).toFixed(e),
  b: (A) => Math.round(A).toString(2),
  c: (A) => A + "",
  d: ZD,
  e: (A, e) => A.toExponential(e),
  f: (A, e) => A.toFixed(e),
  g: (A, e) => A.toPrecision(e),
  o: (A) => Math.round(A).toString(8),
  p: (A, e) => Hw(A * 100, e),
  r: Hw,
  s: rO,
  X: (A) => Math.round(A).toString(16).toUpperCase(),
  x: (A) => Math.round(A).toString(16)
};
function Lw(A) {
  return A;
}
var Tw = Array.prototype.map, Dw = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function iO(A) {
  var e = A.grouping === void 0 || A.thousands === void 0 ? Lw : AO(Tw.call(A.grouping, Number), A.thousands + ""), t = A.currency === void 0 ? "" : A.currency[0] + "", n = A.currency === void 0 ? "" : A.currency[1] + "", i = A.decimal === void 0 ? "." : A.decimal + "", o = A.numerals === void 0 ? Lw : eO(Tw.call(A.numerals, String)), l = A.percent === void 0 ? "%" : A.percent + "", f = A.minus === void 0 ? "−" : A.minus + "", c = A.nan === void 0 ? "NaN" : A.nan + "";
  function h(B) {
    B = gc(B);
    var g = B.fill, v = B.align, u = B.sign, C = B.symbol, F = B.zero, U = B.width, H = B.comma, O = B.precision, _ = B.trim, M = B.type;
    M === "n" ? (H = !0, M = "g") : Sw[M] || (O === void 0 && (O = 12), _ = !0, M = "g"), (F || g === "0" && v === "=") && (F = !0, g = "0", v = "=");
    var K = C === "$" ? t : C === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", z = C === "$" ? n : /[%p]/.test(M) ? l : "", cA = Sw[M], sA = /[defgprs%]/.test(M);
    O = O === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, O)) : Math.max(0, Math.min(20, O));
    function gA(QA) {
      var OA = K, _A = z, W, yA, eA;
      if (M === "c")
        _A = cA(QA) + _A, QA = "";
      else {
        QA = +QA;
        var fA = QA < 0 || 1 / QA < 0;
        if (QA = isNaN(QA) ? c : cA(Math.abs(QA), O), _ && (QA = nO(QA)), fA && +QA == 0 && u !== "+" && (fA = !1), OA = (fA ? u === "(" ? u : f : u === "-" || u === "(" ? "" : u) + OA, _A = (M === "s" ? Dw[8 + x0 / 3] : "") + _A + (fA && u === "(" ? ")" : ""), sA) {
          for (W = -1, yA = QA.length; ++W < yA; )
            if (eA = QA.charCodeAt(W), 48 > eA || eA > 57) {
              _A = (eA === 46 ? i + QA.slice(W + 1) : QA.slice(W)) + _A, QA = QA.slice(0, W);
              break;
            }
        }
      }
      H && !F && (QA = e(QA, 1 / 0));
      var bA = OA.length + QA.length + _A.length, xA = bA < U ? new Array(U - bA + 1).join(g) : "";
      switch (H && F && (QA = e(xA + QA, xA.length ? U - _A.length : 1 / 0), xA = ""), v) {
        case "<":
          QA = OA + QA + _A + xA;
          break;
        case "=":
          QA = OA + xA + QA + _A;
          break;
        case "^":
          QA = xA.slice(0, bA = xA.length >> 1) + OA + QA + _A + xA.slice(bA);
          break;
        default:
          QA = xA + OA + QA + _A;
          break;
      }
      return o(QA);
    }
    return gA.toString = function() {
      return B + "";
    }, gA;
  }
  function m(B, g) {
    var v = h((B = gc(B), B.type = "f", B)), u = Math.max(-8, Math.min(8, Math.floor(so(g) / 3))) * 3, C = Math.pow(10, -u), F = Dw[8 + u / 3];
    return function(U) {
      return v(C * U) + F;
    };
  }
  return {
    format: h,
    formatPrefix: m
  };
}
var fl, I0, H0;
aO({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function aO(A) {
  return fl = iO(A), I0 = fl.format, H0 = fl.formatPrefix, fl;
}
function oO(A) {
  return Math.max(0, -so(Math.abs(A)));
}
function sO(A, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(so(e) / 3))) * 3 - so(Math.abs(A)));
}
function uO(A, e) {
  return A = Math.abs(A), e = Math.abs(e) - A, Math.max(0, so(e) - so(A)) + 1;
}
function lO(A, e) {
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
function cO(A) {
  return function() {
    return A;
  };
}
function fO(A) {
  return +A;
}
var Ow = [0, 1];
function Ja(A) {
  return A;
}
function ld(A, e) {
  return (e -= A = +A) ? function(t) {
    return (t - A) / e;
  } : cO(isNaN(e) ? NaN : 0.5);
}
function hO(A, e) {
  var t;
  return A > e && (t = A, A = e, e = t), function(n) {
    return Math.max(A, Math.min(e, n));
  };
}
function dO(A, e, t) {
  var n = A[0], i = A[1], o = e[0], l = e[1];
  return i < n ? (n = ld(i, n), o = t(l, o)) : (n = ld(n, i), o = t(o, l)), function(f) {
    return o(n(f));
  };
}
function pO(A, e, t) {
  var n = Math.min(A.length, e.length) - 1, i = new Array(n), o = new Array(n), l = -1;
  for (A[n] < A[0] && (A = A.slice().reverse(), e = e.slice().reverse()); ++l < n; )
    i[l] = ld(A[l], A[l + 1]), o[l] = t(e[l], e[l + 1]);
  return function(f) {
    var c = wS(A, f, 1, n) - 1;
    return o[c](i[c](f));
  };
}
function gO(A, e) {
  return e.domain(A.domain()).range(A.range()).interpolate(A.interpolate()).clamp(A.clamp()).unknown(A.unknown());
}
function BO() {
  var A = Ow, e = Ow, t = Np, n, i, o, l = Ja, f, c, h;
  function m() {
    var g = Math.min(A.length, e.length);
    return l !== Ja && (l = hO(A[0], A[g - 1])), f = g > 2 ? pO : dO, c = h = null, B;
  }
  function B(g) {
    return g == null || isNaN(g = +g) ? o : (c || (c = f(A.map(n), e, t)))(n(l(g)));
  }
  return B.invert = function(g) {
    return l(i((h || (h = f(e, A.map(n), Vn)))(g)));
  }, B.domain = function(g) {
    return arguments.length ? (A = Array.from(g, fO), m()) : A.slice();
  }, B.range = function(g) {
    return arguments.length ? (e = Array.from(g), m()) : e.slice();
  }, B.rangeRound = function(g) {
    return e = Array.from(g), t = LT, m();
  }, B.clamp = function(g) {
    return arguments.length ? (l = g ? !0 : Ja, m()) : l !== Ja;
  }, B.interpolate = function(g) {
    return arguments.length ? (t = g, m()) : t;
  }, B.unknown = function(g) {
    return arguments.length ? (o = g, B) : o;
  }, function(g, v) {
    return n = g, i = v, m();
  };
}
function wO() {
  return BO()(Ja, Ja);
}
function mO(A, e, t, n) {
  var i = QS(A, e, t), o;
  switch (n = gc(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(A), Math.abs(e));
      return n.precision == null && !isNaN(o = sO(i, l)) && (n.precision = o), H0(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(o = uO(i, Math.max(Math.abs(A), Math.abs(e)))) && (n.precision = o - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(o = oO(i)) && (n.precision = o - (n.type === "%") * 2);
      break;
    }
  }
  return I0(n);
}
function vO(A) {
  var e = A.domain;
  return A.ticks = function(t) {
    var n = e();
    return CS(n[0], n[n.length - 1], t ?? 10);
  }, A.tickFormat = function(t, n) {
    var i = e();
    return mO(i[0], i[i.length - 1], t ?? 10, n);
  }, A.nice = function(t) {
    t == null && (t = 10);
    var n = e(), i = 0, o = n.length - 1, l = n[i], f = n[o], c, h, m = 10;
    for (f < l && (h = l, l = f, f = h, h = i, i = o, o = h); m-- > 0; ) {
      if (h = Ad(l, f, t), h === c)
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
function ca() {
  var A = wO();
  return A.copy = function() {
    return gO(A, ca());
  }, lO.apply(A, arguments), vO(A);
}
const hl = (A) => () => A;
function yO(A, {
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
function Kr(A, e, t) {
  this.k = A, this.x = e, this.y = t;
}
Kr.prototype = {
  constructor: Kr,
  scale: function(A) {
    return A === 1 ? this : new Kr(this.k * A, this.x, this.y);
  },
  translate: function(A, e) {
    return A === 0 & e === 0 ? this : new Kr(this.k, this.x + this.k * A, this.y + this.k * e);
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
var kp = new Kr(1, 0, 0);
Wa.prototype = Kr.prototype;
function Wa(A) {
  for (; !A.__zoom; ) if (!(A = A.parentNode)) return kp;
  return A.__zoom;
}
function wh(A) {
  A.stopImmediatePropagation();
}
function Zo(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function CO(A) {
  return (!A.ctrlKey || A.type === "wheel") && !A.button;
}
function QO() {
  var A = this;
  return A instanceof SVGElement ? (A = A.ownerSVGElement || A, A.hasAttribute("viewBox") ? (A = A.viewBox.baseVal, [[A.x, A.y], [A.x + A.width, A.y + A.height]]) : [[0, 0], [A.width.baseVal.value, A.height.baseVal.value]]) : [[0, 0], [A.clientWidth, A.clientHeight]];
}
function Nw() {
  return this.__zoom || kp;
}
function FO(A) {
  return -A.deltaY * (A.deltaMode === 1 ? 0.05 : A.deltaMode ? 1 : 2e-3) * (A.ctrlKey ? 10 : 1);
}
function UO() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function EO(A, e, t) {
  var n = A.invertX(e[0][0]) - t[0][0], i = A.invertX(e[1][0]) - t[1][0], o = A.invertY(e[0][1]) - t[0][1], l = A.invertY(e[1][1]) - t[1][1];
  return A.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    l > o ? (o + l) / 2 : Math.min(0, o) || Math.max(0, l)
  );
}
function bO() {
  var A = CO, e = QO, t = EO, n = FO, i = UO, o = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], f = 250, c = RT, h = Oc("start", "zoom", "end"), m, B, g, v = 500, u = 150, C = 0, F = 10;
  function U(W) {
    W.property("__zoom", Nw).on("wheel.zoom", cA, { passive: !1 }).on("mousedown.zoom", sA).on("dblclick.zoom", gA).filter(i).on("touchstart.zoom", QA).on("touchmove.zoom", OA).on("touchend.zoom touchcancel.zoom", _A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  U.transform = function(W, yA, eA, fA) {
    var bA = W.selection ? W.selection() : W;
    bA.property("__zoom", Nw), W !== bA ? M(W, yA, eA, fA) : bA.interrupt().each(function() {
      K(this, arguments).event(fA).start().zoom(null, typeof yA == "function" ? yA.apply(this, arguments) : yA).end();
    });
  }, U.scaleBy = function(W, yA, eA, fA) {
    U.scaleTo(W, function() {
      var bA = this.__zoom.k, xA = typeof yA == "function" ? yA.apply(this, arguments) : yA;
      return bA * xA;
    }, eA, fA);
  }, U.scaleTo = function(W, yA, eA, fA) {
    U.transform(W, function() {
      var bA = e.apply(this, arguments), xA = this.__zoom, iA = eA == null ? _(bA) : typeof eA == "function" ? eA.apply(this, arguments) : eA, T = xA.invert(iA), AA = typeof yA == "function" ? yA.apply(this, arguments) : yA;
      return t(O(H(xA, AA), iA, T), bA, l);
    }, eA, fA);
  }, U.translateBy = function(W, yA, eA, fA) {
    U.transform(W, function() {
      return t(this.__zoom.translate(
        typeof yA == "function" ? yA.apply(this, arguments) : yA,
        typeof eA == "function" ? eA.apply(this, arguments) : eA
      ), e.apply(this, arguments), l);
    }, null, fA);
  }, U.translateTo = function(W, yA, eA, fA, bA) {
    U.transform(W, function() {
      var xA = e.apply(this, arguments), iA = this.__zoom, T = fA == null ? _(xA) : typeof fA == "function" ? fA.apply(this, arguments) : fA;
      return t(kp.translate(T[0], T[1]).scale(iA.k).translate(
        typeof yA == "function" ? -yA.apply(this, arguments) : -yA,
        typeof eA == "function" ? -eA.apply(this, arguments) : -eA
      ), xA, l);
    }, fA, bA);
  };
  function H(W, yA) {
    return yA = Math.max(o[0], Math.min(o[1], yA)), yA === W.k ? W : new Kr(yA, W.x, W.y);
  }
  function O(W, yA, eA) {
    var fA = yA[0] - eA[0] * W.k, bA = yA[1] - eA[1] * W.k;
    return fA === W.x && bA === W.y ? W : new Kr(W.k, fA, bA);
  }
  function _(W) {
    return [(+W[0][0] + +W[1][0]) / 2, (+W[0][1] + +W[1][1]) / 2];
  }
  function M(W, yA, eA, fA) {
    W.on("start.zoom", function() {
      K(this, arguments).event(fA).start();
    }).on("interrupt.zoom end.zoom", function() {
      K(this, arguments).event(fA).end();
    }).tween("zoom", function() {
      var bA = this, xA = arguments, iA = K(bA, xA).event(fA), T = e.apply(bA, xA), AA = eA == null ? _(T) : typeof eA == "function" ? eA.apply(bA, xA) : eA, J = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), L = bA.__zoom, R = typeof yA == "function" ? yA.apply(bA, xA) : yA, nA = c(L.invert(AA).concat(J / L.k), R.invert(AA).concat(J / R.k));
      return function(FA) {
        if (FA === 1) FA = R;
        else {
          var UA = nA(FA), qA = J / UA[2];
          FA = new Kr(qA, AA[0] - UA[0] * qA, AA[1] - UA[1] * qA);
        }
        iA.zoom(null, FA);
      };
    });
  }
  function K(W, yA, eA) {
    return !eA && W.__zooming || new z(W, yA);
  }
  function z(W, yA) {
    this.that = W, this.args = yA, this.active = 0, this.sourceEvent = null, this.extent = e.apply(W, yA), this.taps = 0;
  }
  z.prototype = {
    event: function(W) {
      return W && (this.sourceEvent = W), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(W, yA) {
      return this.mouse && W !== "mouse" && (this.mouse[1] = yA.invert(this.mouse[0])), this.touch0 && W !== "touch" && (this.touch0[1] = yA.invert(this.touch0[0])), this.touch1 && W !== "touch" && (this.touch1[1] = yA.invert(this.touch1[0])), this.that.__zoom = yA, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(W) {
      var yA = VA(this.that).datum();
      h.call(
        W,
        this.that,
        new yO(W, {
          sourceEvent: this.sourceEvent,
          target: U,
          type: W,
          transform: this.that.__zoom,
          dispatch: h
        }),
        yA
      );
    }
  };
  function cA(W, ...yA) {
    if (!A.apply(this, arguments)) return;
    var eA = K(this, yA).event(W), fA = this.__zoom, bA = Math.max(o[0], Math.min(o[1], fA.k * Math.pow(2, n.apply(this, arguments)))), xA = Gn(W);
    if (eA.wheel)
      (eA.mouse[0][0] !== xA[0] || eA.mouse[0][1] !== xA[1]) && (eA.mouse[1] = fA.invert(eA.mouse[0] = xA)), clearTimeout(eA.wheel);
    else {
      if (fA.k === bA) return;
      eA.mouse = [xA, fA.invert(xA)], zl(this), eA.start();
    }
    Zo(W), eA.wheel = setTimeout(iA, u), eA.zoom("mouse", t(O(H(fA, bA), eA.mouse[0], eA.mouse[1]), eA.extent, l));
    function iA() {
      eA.wheel = null, eA.end();
    }
  }
  function sA(W, ...yA) {
    if (g || !A.apply(this, arguments)) return;
    var eA = W.currentTarget, fA = K(this, yA, !0).event(W), bA = VA(W.view).on("mousemove.zoom", AA, !0).on("mouseup.zoom", J, !0), xA = Gn(W, eA), iA = W.clientX, T = W.clientY;
    d0(W.view), wh(W), fA.mouse = [xA, this.__zoom.invert(xA)], zl(this), fA.start();
    function AA(L) {
      if (Zo(L), !fA.moved) {
        var R = L.clientX - iA, nA = L.clientY - T;
        fA.moved = R * R + nA * nA > C;
      }
      fA.event(L).zoom("mouse", t(O(fA.that.__zoom, fA.mouse[0] = Gn(L, eA), fA.mouse[1]), fA.extent, l));
    }
    function J(L) {
      bA.on("mousemove.zoom mouseup.zoom", null), p0(L.view, fA.moved), Zo(L), fA.event(L).end();
    }
  }
  function gA(W, ...yA) {
    if (A.apply(this, arguments)) {
      var eA = this.__zoom, fA = Gn(W.changedTouches ? W.changedTouches[0] : W, this), bA = eA.invert(fA), xA = eA.k * (W.shiftKey ? 0.5 : 2), iA = t(O(H(eA, xA), fA, bA), e.apply(this, yA), l);
      Zo(W), f > 0 ? VA(this).transition().duration(f).call(M, iA, fA, W) : VA(this).call(U.transform, iA, fA, W);
    }
  }
  function QA(W, ...yA) {
    if (A.apply(this, arguments)) {
      var eA = W.touches, fA = eA.length, bA = K(this, yA, W.changedTouches.length === fA).event(W), xA, iA, T, AA;
      for (wh(W), iA = 0; iA < fA; ++iA)
        T = eA[iA], AA = Gn(T, this), AA = [AA, this.__zoom.invert(AA), T.identifier], bA.touch0 ? !bA.touch1 && bA.touch0[2] !== AA[2] && (bA.touch1 = AA, bA.taps = 0) : (bA.touch0 = AA, xA = !0, bA.taps = 1 + !!m);
      m && (m = clearTimeout(m)), xA && (bA.taps < 2 && (B = AA[0], m = setTimeout(function() {
        m = null;
      }, v)), zl(this), bA.start());
    }
  }
  function OA(W, ...yA) {
    if (this.__zooming) {
      var eA = K(this, yA).event(W), fA = W.changedTouches, bA = fA.length, xA, iA, T, AA;
      for (Zo(W), xA = 0; xA < bA; ++xA)
        iA = fA[xA], T = Gn(iA, this), eA.touch0 && eA.touch0[2] === iA.identifier ? eA.touch0[0] = T : eA.touch1 && eA.touch1[2] === iA.identifier && (eA.touch1[0] = T);
      if (iA = eA.that.__zoom, eA.touch1) {
        var J = eA.touch0[0], L = eA.touch0[1], R = eA.touch1[0], nA = eA.touch1[1], FA = (FA = R[0] - J[0]) * FA + (FA = R[1] - J[1]) * FA, UA = (UA = nA[0] - L[0]) * UA + (UA = nA[1] - L[1]) * UA;
        iA = H(iA, Math.sqrt(FA / UA)), T = [(J[0] + R[0]) / 2, (J[1] + R[1]) / 2], AA = [(L[0] + nA[0]) / 2, (L[1] + nA[1]) / 2];
      } else if (eA.touch0) T = eA.touch0[0], AA = eA.touch0[1];
      else return;
      eA.zoom("touch", t(O(iA, T, AA), eA.extent, l));
    }
  }
  function _A(W, ...yA) {
    if (this.__zooming) {
      var eA = K(this, yA).event(W), fA = W.changedTouches, bA = fA.length, xA, iA;
      for (wh(W), g && clearTimeout(g), g = setTimeout(function() {
        g = null;
      }, v), xA = 0; xA < bA; ++xA)
        iA = fA[xA], eA.touch0 && eA.touch0[2] === iA.identifier ? delete eA.touch0 : eA.touch1 && eA.touch1[2] === iA.identifier && delete eA.touch1;
      if (eA.touch1 && !eA.touch0 && (eA.touch0 = eA.touch1, delete eA.touch1), eA.touch0) eA.touch0[1] = this.__zoom.invert(eA.touch0[0]);
      else if (eA.end(), eA.taps === 2 && (iA = Gn(iA, this), Math.hypot(B[0] - iA[0], B[1] - iA[1]) < F)) {
        var T = VA(this).on("dblclick.zoom");
        T && T.apply(this, arguments);
      }
    }
  }
  return U.wheelDelta = function(W) {
    return arguments.length ? (n = typeof W == "function" ? W : hl(+W), U) : n;
  }, U.filter = function(W) {
    return arguments.length ? (A = typeof W == "function" ? W : hl(!!W), U) : A;
  }, U.touchable = function(W) {
    return arguments.length ? (i = typeof W == "function" ? W : hl(!!W), U) : i;
  }, U.extent = function(W) {
    return arguments.length ? (e = typeof W == "function" ? W : hl([[+W[0][0], +W[0][1]], [+W[1][0], +W[1][1]]]), U) : e;
  }, U.scaleExtent = function(W) {
    return arguments.length ? (o[0] = +W[0], o[1] = +W[1], U) : [o[0], o[1]];
  }, U.translateExtent = function(W) {
    return arguments.length ? (l[0][0] = +W[0][0], l[1][0] = +W[1][0], l[0][1] = +W[0][1], l[1][1] = +W[1][1], U) : [[l[0][0], l[0][1]], [l[1][0], l[1][1]]];
  }, U.constrain = function(W) {
    return arguments.length ? (t = W, U) : t;
  }, U.duration = function(W) {
    return arguments.length ? (f = +W, U) : f;
  }, U.interpolate = function(W) {
    return arguments.length ? (c = W, U) : c;
  }, U.on = function() {
    var W = h.on.apply(h, arguments);
    return W === h ? U : W;
  }, U.clickDistance = function(W) {
    return arguments.length ? (C = (W = +W) * W, U) : Math.sqrt(C);
  }, U.tapDistance = function(W) {
    return arguments.length ? (F = +W, U) : F;
  }, U;
}
var S0 = { exports: {} };
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
  })(typeof window < "u" ? window : zi, function(e, t) {
    var n = [], i = e.document, o = n.slice, l = n.concat, f = n.push, c = n.indexOf, h = {}, m = h.toString, B = h.hasOwnProperty, g = {}, v = "1.12.4", u = function(s, d) {
      return new u.fn.init(s, d);
    }, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, F = /^-ms-/, U = /-([\da-z])/gi, H = function(s, d) {
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
      var s, d, w, y, E, b, I = arguments[0] || {}, P = 1, V = arguments.length, X = !1;
      for (typeof I == "boolean" && (X = I, I = arguments[P] || {}, P++), typeof I != "object" && !u.isFunction(I) && (I = {}), P === V && (I = this, P--); P < V; P++)
        if ((E = arguments[P]) != null)
          for (y in E)
            s = I[y], w = E[y], I !== w && (X && w && (u.isPlainObject(w) || (d = u.isArray(w))) ? (d ? (d = !1, b = s && u.isArray(s) ? s : []) : b = s && u.isPlainObject(s) ? s : {}, I[y] = u.extend(X, b, w)) : w !== void 0 && (I[y] = w));
      return I;
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
        return s.replace(F, "ms-").replace(U, H);
      },
      nodeName: function(s, d) {
        return s.nodeName && s.nodeName.toLowerCase() === d.toLowerCase();
      },
      each: function(s, d) {
        var w, y = 0;
        if (O(s))
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
        return s != null && (O(Object(s)) ? u.merge(
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
        for (var y, E = [], b = 0, I = s.length, P = !w; b < I; b++)
          y = !d(s[b], b), y !== P && E.push(s[b]);
        return E;
      },
      // arg is for internal usage only
      map: function(s, d, w) {
        var y, E, b = 0, I = [];
        if (O(s))
          for (y = s.length; b < y; b++)
            E = d(s[b], b, w), E != null && I.push(E);
        else
          for (b in s)
            E = d(s[b], b, w), E != null && I.push(E);
        return l.apply([], I);
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
    function O(s) {
      var d = !!s && "length" in s && s.length, w = u.type(s);
      return w === "function" || u.isWindow(s) ? !1 : w === "array" || d === 0 || typeof d == "number" && d > 0 && d - 1 in s;
    }
    var _ = (
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
        var d, w, y, E, b, I, P, V, X, Z, wA, HA, vA, re, jA, se, dt, ze, Zn, PA = "sizzle" + 1 * /* @__PURE__ */ new Date(), lt = s.document, ue = 0, Xe = 0, Sn = j(), Fa = j(), It = j(), Ln = function(N, $) {
          return N === $ && (wA = !0), 0;
        }, Ar = 1 << 31, Tn = {}.hasOwnProperty, Ke = [], Ht = Ke.pop, Oi = Ke.push, Dn = Ke.push, So = Ke.slice, Fr = function(N, $) {
          for (var q = 0, uA = N.length; q < uA; q++)
            if (N[q] === $)
              return q;
          return -1;
        }, Lo = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", Te = "[\\x20\\t\\r\\n\\f]", Ur = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", Uu = "\\[" + Te + "*(" + Ur + ")(?:" + Te + // Operator (capture 2)
        "*([*^$|!~]?=)" + Te + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Ur + "))|)" + Te + "*\\]", er = ":(" + Ur + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Uu + ")*)|.*)\\)|)", hf = new RegExp(Te + "+", "g"), Ua = new RegExp("^" + Te + "+|((?:^|[^\\\\])(?:\\\\.)*)" + Te + "+$", "g"), To = new RegExp("^" + Te + "*," + Te + "*"), Eu = new RegExp("^" + Te + "*([>+~]|" + Te + ")" + Te + "*"), tr = new RegExp("=" + Te + `*([^\\]'"]*?)` + Te + "*\\]", "g"), Ea = new RegExp(er), bu = new RegExp("^" + Ur + "$"), ba = {
          ID: new RegExp("^#(" + Ur + ")"),
          CLASS: new RegExp("^\\.(" + Ur + ")"),
          TAG: new RegExp("^(" + Ur + "|[*])"),
          ATTR: new RegExp("^" + Uu),
          PSEUDO: new RegExp("^" + er),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + Te + "*(even|odd|(([+-]|)(\\d*)n|)" + Te + "*(?:([+-]|)" + Te + "*(\\d+)|))" + Te + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + Lo + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + Te + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + Te + "*((?:-\\d)?\\d*)" + Te + "*\\)|)(?=[^-]|$)", "i")
        }, df = /^(?:input|select|textarea|button)$/i, ri = /^h\d$/i, mt = /^[^{]+\{\s*\[native \w/, _u = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Do = /[+~]/, pf = /'|\\/g, On = new RegExp("\\\\([\\da-f]{1,6}" + Te + "?|(" + Te + ")|.)", "ig"), Nn = function(N, $, q) {
          var uA = "0x" + $ - 65536;
          return uA !== uA || q ? $ : uA < 0 ? (
            // BMP codepoint
            String.fromCharCode(uA + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(uA >> 10 | 55296, uA & 1023 | 56320)
          );
        }, xu = function() {
          HA();
        };
        try {
          Dn.apply(
            Ke = So.call(lt.childNodes),
            lt.childNodes
          ), Ke[lt.childNodes.length].nodeType;
        } catch {
          Dn = {
            apply: Ke.length ? (
              // Leverage slice if possible
              function($, q) {
                Oi.apply($, So.call(q));
              }
            ) : (
              // Support: IE<9
              // Otherwise append directly
              function($, q) {
                for (var uA = $.length, tA = 0; $[uA++] = q[tA++]; )
                  ;
                $.length = uA - 1;
              }
            )
          };
        }
        function _e(N, $, q, uA) {
          var tA, BA, hA, IA, $A, ne, GA, YA, ce = $ && $.ownerDocument, Se = $ ? $.nodeType : 9;
          if (q = q || [], typeof N != "string" || !N || Se !== 1 && Se !== 9 && Se !== 11)
            return q;
          if (!uA && (($ ? $.ownerDocument || $ : lt) !== vA && HA($), $ = $ || vA, jA)) {
            if (Se !== 11 && (ne = _u.exec(N)))
              if (tA = ne[1]) {
                if (Se === 9)
                  if (hA = $.getElementById(tA)) {
                    if (hA.id === tA)
                      return q.push(hA), q;
                  } else
                    return q;
                else if (ce && (hA = ce.getElementById(tA)) && Zn($, hA) && hA.id === tA)
                  return q.push(hA), q;
              } else {
                if (ne[2])
                  return Dn.apply(q, $.getElementsByTagName(N)), q;
                if ((tA = ne[3]) && w.getElementsByClassName && $.getElementsByClassName)
                  return Dn.apply(q, $.getElementsByClassName(tA)), q;
              }
            if (w.qsa && !It[N + " "] && (!se || !se.test(N))) {
              if (Se !== 1)
                ce = $, YA = N;
              else if ($.nodeName.toLowerCase() !== "object") {
                for ((IA = $.getAttribute("id")) ? IA = IA.replace(pf, "\\$&") : $.setAttribute("id", IA = PA), GA = I(N), BA = GA.length, $A = bu.test(IA) ? "#" + IA : "[id='" + IA + "']"; BA--; )
                  GA[BA] = $A + " " + vt(GA[BA]);
                YA = GA.join(","), ce = Do.test(N) && Ni($.parentNode) || $;
              }
              if (YA)
                try {
                  return Dn.apply(
                    q,
                    ce.querySelectorAll(YA)
                  ), q;
                } catch {
                } finally {
                  IA === PA && $.removeAttribute("id");
                }
            }
          }
          return V(N.replace(Ua, "$1"), $, q, uA);
        }
        function j() {
          var N = [];
          function $(q, uA) {
            return N.push(q + " ") > y.cacheLength && delete $[N.shift()], $[q + " "] = uA;
          }
          return $;
        }
        function aA(N) {
          return N[PA] = !0, N;
        }
        function rA(N) {
          var $ = vA.createElement("div");
          try {
            return !!N($);
          } catch {
            return !1;
          } finally {
            $.parentNode && $.parentNode.removeChild($), $ = null;
          }
        }
        function DA(N, $) {
          for (var q = N.split("|"), uA = q.length; uA--; )
            y.attrHandle[q[uA]] = $;
        }
        function ie(N, $) {
          var q = $ && N, uA = q && N.nodeType === 1 && $.nodeType === 1 && (~$.sourceIndex || Ar) - (~N.sourceIndex || Ar);
          if (uA)
            return uA;
          if (q) {
            for (; q = q.nextSibling; )
              if (q === $)
                return -1;
          }
          return N ? 1 : -1;
        }
        function xe(N) {
          return function($) {
            var q = $.nodeName.toLowerCase();
            return q === "input" && $.type === N;
          };
        }
        function et(N) {
          return function($) {
            var q = $.nodeName.toLowerCase();
            return (q === "input" || q === "button") && $.type === N;
          };
        }
        function Ue(N) {
          return aA(function($) {
            return $ = +$, aA(function(q, uA) {
              for (var tA, BA = N([], q.length, $), hA = BA.length; hA--; )
                q[tA = BA[hA]] && (q[tA] = !(uA[tA] = q[tA]));
            });
          });
        }
        function Ni(N) {
          return N && typeof N.getElementsByTagName < "u" && N;
        }
        w = _e.support = {}, b = _e.isXML = function(N) {
          var $ = N && (N.ownerDocument || N).documentElement;
          return $ ? $.nodeName !== "HTML" : !1;
        }, HA = _e.setDocument = function(N) {
          var $, q, uA = N ? N.ownerDocument || N : lt;
          return uA === vA || uA.nodeType !== 9 || !uA.documentElement || (vA = uA, re = vA.documentElement, jA = !b(vA), (q = vA.defaultView) && q.top !== q && (q.addEventListener ? q.addEventListener("unload", xu, !1) : q.attachEvent && q.attachEvent("onunload", xu)), w.attributes = rA(function(tA) {
            return tA.className = "i", !tA.getAttribute("className");
          }), w.getElementsByTagName = rA(function(tA) {
            return tA.appendChild(vA.createComment("")), !tA.getElementsByTagName("*").length;
          }), w.getElementsByClassName = mt.test(vA.getElementsByClassName), w.getById = rA(function(tA) {
            return re.appendChild(tA).id = PA, !vA.getElementsByName || !vA.getElementsByName(PA).length;
          }), w.getById ? (y.find.ID = function(tA, BA) {
            if (typeof BA.getElementById < "u" && jA) {
              var hA = BA.getElementById(tA);
              return hA ? [hA] : [];
            }
          }, y.filter.ID = function(tA) {
            var BA = tA.replace(On, Nn);
            return function(hA) {
              return hA.getAttribute("id") === BA;
            };
          }) : (delete y.find.ID, y.filter.ID = function(tA) {
            var BA = tA.replace(On, Nn);
            return function(hA) {
              var IA = typeof hA.getAttributeNode < "u" && hA.getAttributeNode("id");
              return IA && IA.value === BA;
            };
          }), y.find.TAG = w.getElementsByTagName ? function(tA, BA) {
            if (typeof BA.getElementsByTagName < "u")
              return BA.getElementsByTagName(tA);
            if (w.qsa)
              return BA.querySelectorAll(tA);
          } : function(tA, BA) {
            var hA, IA = [], $A = 0, ne = BA.getElementsByTagName(tA);
            if (tA === "*") {
              for (; hA = ne[$A++]; )
                hA.nodeType === 1 && IA.push(hA);
              return IA;
            }
            return ne;
          }, y.find.CLASS = w.getElementsByClassName && function(tA, BA) {
            if (typeof BA.getElementsByClassName < "u" && jA)
              return BA.getElementsByClassName(tA);
          }, dt = [], se = [], (w.qsa = mt.test(vA.querySelectorAll)) && (rA(function(tA) {
            re.appendChild(tA).innerHTML = "<a id='" + PA + "'></a><select id='" + PA + "-\r\\' msallowcapture=''><option selected=''></option></select>", tA.querySelectorAll("[msallowcapture^='']").length && se.push("[*^$]=" + Te + `*(?:''|"")`), tA.querySelectorAll("[selected]").length || se.push("\\[" + Te + "*(?:value|" + Lo + ")"), tA.querySelectorAll("[id~=" + PA + "-]").length || se.push("~="), tA.querySelectorAll(":checked").length || se.push(":checked"), tA.querySelectorAll("a#" + PA + "+*").length || se.push(".#.+[+~]");
          }), rA(function(tA) {
            var BA = vA.createElement("input");
            BA.setAttribute("type", "hidden"), tA.appendChild(BA).setAttribute("name", "D"), tA.querySelectorAll("[name=d]").length && se.push("name" + Te + "*[*^$|!~]?="), tA.querySelectorAll(":enabled").length || se.push(":enabled", ":disabled"), tA.querySelectorAll("*,:x"), se.push(",.*:");
          })), (w.matchesSelector = mt.test(ze = re.matches || re.webkitMatchesSelector || re.mozMatchesSelector || re.oMatchesSelector || re.msMatchesSelector)) && rA(function(tA) {
            w.disconnectedMatch = ze.call(tA, "div"), ze.call(tA, "[s!='']:x"), dt.push("!=", er);
          }), se = se.length && new RegExp(se.join("|")), dt = dt.length && new RegExp(dt.join("|")), $ = mt.test(re.compareDocumentPosition), Zn = $ || mt.test(re.contains) ? function(tA, BA) {
            var hA = tA.nodeType === 9 ? tA.documentElement : tA, IA = BA && BA.parentNode;
            return tA === IA || !!(IA && IA.nodeType === 1 && (hA.contains ? hA.contains(IA) : tA.compareDocumentPosition && tA.compareDocumentPosition(IA) & 16));
          } : function(tA, BA) {
            if (BA) {
              for (; BA = BA.parentNode; )
                if (BA === tA)
                  return !0;
            }
            return !1;
          }, Ln = $ ? function(tA, BA) {
            if (tA === BA)
              return wA = !0, 0;
            var hA = !tA.compareDocumentPosition - !BA.compareDocumentPosition;
            return hA || (hA = (tA.ownerDocument || tA) === (BA.ownerDocument || BA) ? tA.compareDocumentPosition(BA) : (
              // Otherwise we know they are disconnected
              1
            ), hA & 1 || !w.sortDetached && BA.compareDocumentPosition(tA) === hA ? tA === vA || tA.ownerDocument === lt && Zn(lt, tA) ? -1 : BA === vA || BA.ownerDocument === lt && Zn(lt, BA) ? 1 : Z ? Fr(Z, tA) - Fr(Z, BA) : 0 : hA & 4 ? -1 : 1);
          } : function(tA, BA) {
            if (tA === BA)
              return wA = !0, 0;
            var hA, IA = 0, $A = tA.parentNode, ne = BA.parentNode, GA = [tA], YA = [BA];
            if (!$A || !ne)
              return tA === vA ? -1 : BA === vA ? 1 : $A ? -1 : ne ? 1 : Z ? Fr(Z, tA) - Fr(Z, BA) : 0;
            if ($A === ne)
              return ie(tA, BA);
            for (hA = tA; hA = hA.parentNode; )
              GA.unshift(hA);
            for (hA = BA; hA = hA.parentNode; )
              YA.unshift(hA);
            for (; GA[IA] === YA[IA]; )
              IA++;
            return IA ? (
              // Do a sibling check if the nodes have a common ancestor
              ie(GA[IA], YA[IA])
            ) : (
              // Otherwise nodes in our document sort first
              GA[IA] === lt ? -1 : YA[IA] === lt ? 1 : 0
            );
          }), vA;
        }, _e.matches = function(N, $) {
          return _e(N, null, null, $);
        }, _e.matchesSelector = function(N, $) {
          if ((N.ownerDocument || N) !== vA && HA(N), $ = $.replace(tr, "='$1']"), w.matchesSelector && jA && !It[$ + " "] && (!dt || !dt.test($)) && (!se || !se.test($)))
            try {
              var q = ze.call(N, $);
              if (q || w.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              N.document && N.document.nodeType !== 11)
                return q;
            } catch {
            }
          return _e($, vA, null, [N]).length > 0;
        }, _e.contains = function(N, $) {
          return (N.ownerDocument || N) !== vA && HA(N), Zn(N, $);
        }, _e.attr = function(N, $) {
          (N.ownerDocument || N) !== vA && HA(N);
          var q = y.attrHandle[$.toLowerCase()], uA = q && Tn.call(y.attrHandle, $.toLowerCase()) ? q(N, $, !jA) : void 0;
          return uA !== void 0 ? uA : w.attributes || !jA ? N.getAttribute($) : (uA = N.getAttributeNode($)) && uA.specified ? uA.value : null;
        }, _e.error = function(N) {
          throw new Error("Syntax error, unrecognized expression: " + N);
        }, _e.uniqueSort = function(N) {
          var $, q = [], uA = 0, tA = 0;
          if (wA = !w.detectDuplicates, Z = !w.sortStable && N.slice(0), N.sort(Ln), wA) {
            for (; $ = N[tA++]; )
              $ === N[tA] && (uA = q.push(tA));
            for (; uA--; )
              N.splice(q[uA], 1);
          }
          return Z = null, N;
        }, E = _e.getText = function(N) {
          var $, q = "", uA = 0, tA = N.nodeType;
          if (tA) {
            if (tA === 1 || tA === 9 || tA === 11) {
              if (typeof N.textContent == "string")
                return N.textContent;
              for (N = N.firstChild; N; N = N.nextSibling)
                q += E(N);
            } else if (tA === 3 || tA === 4)
              return N.nodeValue;
          } else for (; $ = N[uA++]; )
            q += E($);
          return q;
        }, y = _e.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: aA,
          match: ba,
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
              return N[1] = N[1].replace(On, Nn), N[3] = (N[3] || N[4] || N[5] || "").replace(On, Nn), N[2] === "~=" && (N[3] = " " + N[3] + " "), N.slice(0, 4);
            },
            CHILD: function(N) {
              return N[1] = N[1].toLowerCase(), N[1].slice(0, 3) === "nth" ? (N[3] || _e.error(N[0]), N[4] = +(N[4] ? N[5] + (N[6] || 1) : 2 * (N[3] === "even" || N[3] === "odd")), N[5] = +(N[7] + N[8] || N[3] === "odd")) : N[3] && _e.error(N[0]), N;
            },
            PSEUDO: function(N) {
              var $, q = !N[6] && N[2];
              return ba.CHILD.test(N[0]) ? null : (N[3] ? N[2] = N[4] || N[5] || "" : q && Ea.test(q) && // Get excess from tokenize (recursively)
              ($ = I(q, !0)) && // advance to the next closing parenthesis
              ($ = q.indexOf(")", q.length - $) - q.length) && (N[0] = N[0].slice(0, $), N[2] = q.slice(0, $)), N.slice(0, 3));
            }
          },
          filter: {
            TAG: function(N) {
              var $ = N.replace(On, Nn).toLowerCase();
              return N === "*" ? function() {
                return !0;
              } : function(q) {
                return q.nodeName && q.nodeName.toLowerCase() === $;
              };
            },
            CLASS: function(N) {
              var $ = Sn[N + " "];
              return $ || ($ = new RegExp("(^|" + Te + ")" + N + "(" + Te + "|$)")) && Sn(N, function(q) {
                return $.test(typeof q.className == "string" && q.className || typeof q.getAttribute < "u" && q.getAttribute("class") || "");
              });
            },
            ATTR: function(N, $, q) {
              return function(uA) {
                var tA = _e.attr(uA, N);
                return tA == null ? $ === "!=" : $ ? (tA += "", $ === "=" ? tA === q : $ === "!=" ? tA !== q : $ === "^=" ? q && tA.indexOf(q) === 0 : $ === "*=" ? q && tA.indexOf(q) > -1 : $ === "$=" ? q && tA.slice(-q.length) === q : $ === "~=" ? (" " + tA.replace(hf, " ") + " ").indexOf(q) > -1 : $ === "|=" ? tA === q || tA.slice(0, q.length + 1) === q + "-" : !1) : !0;
              };
            },
            CHILD: function(N, $, q, uA, tA) {
              var BA = N.slice(0, 3) !== "nth", hA = N.slice(-4) !== "last", IA = $ === "of-type";
              return uA === 1 && tA === 0 ? (
                // Shortcut for :nth-*(n)
                function($A) {
                  return !!$A.parentNode;
                }
              ) : function($A, ne, GA) {
                var YA, ce, Se, XA, $e, tt, Kt = BA !== hA ? "nextSibling" : "previousSibling", Ve = $A.parentNode, Mi = IA && $A.nodeName.toLowerCase(), nr = !GA && !IA, pt = !1;
                if (Ve) {
                  if (BA) {
                    for (; Kt; ) {
                      for (XA = $A; XA = XA[Kt]; )
                        if (IA ? XA.nodeName.toLowerCase() === Mi : XA.nodeType === 1)
                          return !1;
                      tt = Kt = N === "only" && !tt && "nextSibling";
                    }
                    return !0;
                  }
                  if (tt = [hA ? Ve.firstChild : Ve.lastChild], hA && nr) {
                    for (XA = Ve, Se = XA[PA] || (XA[PA] = {}), ce = Se[XA.uniqueID] || (Se[XA.uniqueID] = {}), YA = ce[N] || [], $e = YA[0] === ue && YA[1], pt = $e && YA[2], XA = $e && Ve.childNodes[$e]; XA = ++$e && XA && XA[Kt] || // Fallback to seeking `elem` from the start
                    (pt = $e = 0) || tt.pop(); )
                      if (XA.nodeType === 1 && ++pt && XA === $A) {
                        ce[N] = [ue, $e, pt];
                        break;
                      }
                  } else if (nr && (XA = $A, Se = XA[PA] || (XA[PA] = {}), ce = Se[XA.uniqueID] || (Se[XA.uniqueID] = {}), YA = ce[N] || [], $e = YA[0] === ue && YA[1], pt = $e), pt === !1)
                    for (; (XA = ++$e && XA && XA[Kt] || (pt = $e = 0) || tt.pop()) && !((IA ? XA.nodeName.toLowerCase() === Mi : XA.nodeType === 1) && ++pt && (nr && (Se = XA[PA] || (XA[PA] = {}), ce = Se[XA.uniqueID] || (Se[XA.uniqueID] = {}), ce[N] = [ue, pt]), XA === $A)); )
                      ;
                  return pt -= tA, pt === uA || pt % uA === 0 && pt / uA >= 0;
                }
              };
            },
            PSEUDO: function(N, $) {
              var q, uA = y.pseudos[N] || y.setFilters[N.toLowerCase()] || _e.error("unsupported pseudo: " + N);
              return uA[PA] ? uA($) : uA.length > 1 ? (q = [N, N, "", $], y.setFilters.hasOwnProperty(N.toLowerCase()) ? aA(function(tA, BA) {
                for (var hA, IA = uA(tA, $), $A = IA.length; $A--; )
                  hA = Fr(tA, IA[$A]), tA[hA] = !(BA[hA] = IA[$A]);
              }) : function(tA) {
                return uA(tA, 0, q);
              }) : uA;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: aA(function(N) {
              var $ = [], q = [], uA = P(N.replace(Ua, "$1"));
              return uA[PA] ? aA(function(tA, BA, hA, IA) {
                for (var $A, ne = uA(tA, null, IA, []), GA = tA.length; GA--; )
                  ($A = ne[GA]) && (tA[GA] = !(BA[GA] = $A));
              }) : function(tA, BA, hA) {
                return $[0] = tA, uA($, null, hA, q), $[0] = null, !q.pop();
              };
            }),
            has: aA(function(N) {
              return function($) {
                return _e(N, $).length > 0;
              };
            }),
            contains: aA(function(N) {
              return N = N.replace(On, Nn), function($) {
                return ($.textContent || $.innerText || E($)).indexOf(N) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            lang: aA(function(N) {
              return bu.test(N || "") || _e.error("unsupported lang: " + N), N = N.replace(On, Nn).toLowerCase(), function($) {
                var q;
                do
                  if (q = jA ? $.lang : $.getAttribute("xml:lang") || $.getAttribute("lang"))
                    return q = q.toLowerCase(), q === N || q.indexOf(N + "-") === 0;
                while (($ = $.parentNode) && $.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(N) {
              var $ = s.location && s.location.hash;
              return $ && $.slice(1) === N.id;
            },
            root: function(N) {
              return N === re;
            },
            focus: function(N) {
              return N === vA.activeElement && (!vA.hasFocus || vA.hasFocus()) && !!(N.type || N.href || ~N.tabIndex);
            },
            // Boolean properties
            enabled: function(N) {
              return N.disabled === !1;
            },
            disabled: function(N) {
              return N.disabled === !0;
            },
            checked: function(N) {
              var $ = N.nodeName.toLowerCase();
              return $ === "input" && !!N.checked || $ === "option" && !!N.selected;
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
              return ri.test(N.nodeName);
            },
            input: function(N) {
              return df.test(N.nodeName);
            },
            button: function(N) {
              var $ = N.nodeName.toLowerCase();
              return $ === "input" && N.type === "button" || $ === "button";
            },
            text: function(N) {
              var $;
              return N.nodeName.toLowerCase() === "input" && N.type === "text" && // Support: IE<8
              // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
              (($ = N.getAttribute("type")) == null || $.toLowerCase() === "text");
            },
            // Position-in-collection
            first: Ue(function() {
              return [0];
            }),
            last: Ue(function(N, $) {
              return [$ - 1];
            }),
            eq: Ue(function(N, $, q) {
              return [q < 0 ? q + $ : q];
            }),
            even: Ue(function(N, $) {
              for (var q = 0; q < $; q += 2)
                N.push(q);
              return N;
            }),
            odd: Ue(function(N, $) {
              for (var q = 1; q < $; q += 2)
                N.push(q);
              return N;
            }),
            lt: Ue(function(N, $, q) {
              for (var uA = q < 0 ? q + $ : q; --uA >= 0; )
                N.push(uA);
              return N;
            }),
            gt: Ue(function(N, $, q) {
              for (var uA = q < 0 ? q + $ : q; ++uA < $; )
                N.push(uA);
              return N;
            })
          }
        }, y.pseudos.nth = y.pseudos.eq;
        for (d in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          y.pseudos[d] = xe(d);
        for (d in { submit: !0, reset: !0 })
          y.pseudos[d] = et(d);
        function Iu() {
        }
        Iu.prototype = y.filters = y.pseudos, y.setFilters = new Iu(), I = _e.tokenize = function(N, $) {
          var q, uA, tA, BA, hA, IA, $A, ne = Fa[N + " "];
          if (ne)
            return $ ? 0 : ne.slice(0);
          for (hA = N, IA = [], $A = y.preFilter; hA; ) {
            (!q || (uA = To.exec(hA))) && (uA && (hA = hA.slice(uA[0].length) || hA), IA.push(tA = [])), q = !1, (uA = Eu.exec(hA)) && (q = uA.shift(), tA.push({
              value: q,
              // Cast descendant combinators to space
              type: uA[0].replace(Ua, " ")
            }), hA = hA.slice(q.length));
            for (BA in y.filter)
              (uA = ba[BA].exec(hA)) && (!$A[BA] || (uA = $A[BA](uA))) && (q = uA.shift(), tA.push({
                value: q,
                type: BA,
                matches: uA
              }), hA = hA.slice(q.length));
            if (!q)
              break;
          }
          return $ ? hA.length : hA ? _e.error(N) : (
            // Cache the tokens
            Fa(N, IA).slice(0)
          );
        };
        function vt(N) {
          for (var $ = 0, q = N.length, uA = ""; $ < q; $++)
            uA += N[$].value;
          return uA;
        }
        function ii(N, $, q) {
          var uA = $.dir, tA = q && uA === "parentNode", BA = Xe++;
          return $.first ? (
            // Check against closest ancestor/preceding element
            function(hA, IA, $A) {
              for (; hA = hA[uA]; )
                if (hA.nodeType === 1 || tA)
                  return N(hA, IA, $A);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(hA, IA, $A) {
              var ne, GA, YA, ce = [ue, BA];
              if ($A) {
                for (; hA = hA[uA]; )
                  if ((hA.nodeType === 1 || tA) && N(hA, IA, $A))
                    return !0;
              } else
                for (; hA = hA[uA]; )
                  if (hA.nodeType === 1 || tA) {
                    if (YA = hA[PA] || (hA[PA] = {}), GA = YA[hA.uniqueID] || (YA[hA.uniqueID] = {}), (ne = GA[uA]) && ne[0] === ue && ne[1] === BA)
                      return ce[2] = ne[2];
                    if (GA[uA] = ce, ce[2] = N(hA, IA, $A))
                      return !0;
                  }
            }
          );
        }
        function Oo(N) {
          return N.length > 1 ? function($, q, uA) {
            for (var tA = N.length; tA--; )
              if (!N[tA]($, q, uA))
                return !1;
            return !0;
          } : N[0];
        }
        function ai(N, $, q) {
          for (var uA = 0, tA = $.length; uA < tA; uA++)
            _e(N, $[uA], q);
          return q;
        }
        function Er(N, $, q, uA, tA) {
          for (var BA, hA = [], IA = 0, $A = N.length, ne = $ != null; IA < $A; IA++)
            (BA = N[IA]) && (!q || q(BA, uA, tA)) && (hA.push(BA), ne && $.push(IA));
          return hA;
        }
        function oi(N, $, q, uA, tA, BA) {
          return uA && !uA[PA] && (uA = oi(uA)), tA && !tA[PA] && (tA = oi(tA, BA)), aA(function(hA, IA, $A, ne) {
            var GA, YA, ce, Se = [], XA = [], $e = IA.length, tt = hA || ai($ || "*", $A.nodeType ? [$A] : $A, []), Kt = N && (hA || !$) ? Er(tt, Se, N, $A, ne) : tt, Ve = q ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              tA || (hA ? N : $e || uA) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                IA
              )
            ) : Kt;
            if (q && q(Kt, Ve, $A, ne), uA)
              for (GA = Er(Ve, XA), uA(GA, [], $A, ne), YA = GA.length; YA--; )
                (ce = GA[YA]) && (Ve[XA[YA]] = !(Kt[XA[YA]] = ce));
            if (hA) {
              if (tA || N) {
                if (tA) {
                  for (GA = [], YA = Ve.length; YA--; )
                    (ce = Ve[YA]) && GA.push(Kt[YA] = ce);
                  tA(null, Ve = [], GA, ne);
                }
                for (YA = Ve.length; YA--; )
                  (ce = Ve[YA]) && (GA = tA ? Fr(hA, ce) : Se[YA]) > -1 && (hA[GA] = !(IA[GA] = ce));
              }
            } else
              Ve = Er(
                Ve === IA ? Ve.splice($e, Ve.length) : Ve
              ), tA ? tA(null, IA, Ve, ne) : Dn.apply(IA, Ve);
          });
        }
        function Ie(N) {
          for (var $, q, uA, tA = N.length, BA = y.relative[N[0].type], hA = BA || y.relative[" "], IA = BA ? 1 : 0, $A = ii(function(YA) {
            return YA === $;
          }, hA, !0), ne = ii(function(YA) {
            return Fr($, YA) > -1;
          }, hA, !0), GA = [function(YA, ce, Se) {
            var XA = !BA && (Se || ce !== X) || (($ = ce).nodeType ? $A(YA, ce, Se) : ne(YA, ce, Se));
            return $ = null, XA;
          }]; IA < tA; IA++)
            if (q = y.relative[N[IA].type])
              GA = [ii(Oo(GA), q)];
            else {
              if (q = y.filter[N[IA].type].apply(null, N[IA].matches), q[PA]) {
                for (uA = ++IA; uA < tA && !y.relative[N[uA].type]; uA++)
                  ;
                return oi(
                  IA > 1 && Oo(GA),
                  IA > 1 && vt(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    N.slice(0, IA - 1).concat({ value: N[IA - 2].type === " " ? "*" : "" })
                  ).replace(Ua, "$1"),
                  q,
                  IA < uA && Ie(N.slice(IA, uA)),
                  uA < tA && Ie(N = N.slice(uA)),
                  uA < tA && vt(N)
                );
              }
              GA.push(q);
            }
          return Oo(GA);
        }
        function gf(N, $) {
          var q = $.length > 0, uA = N.length > 0, tA = function(BA, hA, IA, $A, ne) {
            var GA, YA, ce, Se = 0, XA = "0", $e = BA && [], tt = [], Kt = X, Ve = BA || uA && y.find.TAG("*", ne), Mi = ue += Kt == null ? 1 : Math.random() || 0.1, nr = Ve.length;
            for (ne && (X = hA === vA || hA || ne); XA !== nr && (GA = Ve[XA]) != null; XA++) {
              if (uA && GA) {
                for (YA = 0, !hA && GA.ownerDocument !== vA && (HA(GA), IA = !jA); ce = N[YA++]; )
                  if (ce(GA, hA || vA, IA)) {
                    $A.push(GA);
                    break;
                  }
                ne && (ue = Mi);
              }
              q && ((GA = !ce && GA) && Se--, BA && $e.push(GA));
            }
            if (Se += XA, q && XA !== Se) {
              for (YA = 0; ce = $[YA++]; )
                ce($e, tt, hA, IA);
              if (BA) {
                if (Se > 0)
                  for (; XA--; )
                    $e[XA] || tt[XA] || (tt[XA] = Ht.call($A));
                tt = Er(tt);
              }
              Dn.apply($A, tt), ne && !BA && tt.length > 0 && Se + $.length > 1 && _e.uniqueSort($A);
            }
            return ne && (ue = Mi, X = Kt), $e;
          };
          return q ? aA(tA) : tA;
        }
        return P = _e.compile = function(N, $) {
          var q, uA = [], tA = [], BA = It[N + " "];
          if (!BA) {
            for ($ || ($ = I(N)), q = $.length; q--; )
              BA = Ie($[q]), BA[PA] ? uA.push(BA) : tA.push(BA);
            BA = It(N, gf(tA, uA)), BA.selector = N;
          }
          return BA;
        }, V = _e.select = function(N, $, q, uA) {
          var tA, BA, hA, IA, $A, ne = typeof N == "function" && N, GA = !uA && I(N = ne.selector || N);
          if (q = q || [], GA.length === 1) {
            if (BA = GA[0] = GA[0].slice(0), BA.length > 2 && (hA = BA[0]).type === "ID" && w.getById && $.nodeType === 9 && jA && y.relative[BA[1].type]) {
              if ($ = (y.find.ID(hA.matches[0].replace(On, Nn), $) || [])[0], $)
                ne && ($ = $.parentNode);
              else return q;
              N = N.slice(BA.shift().value.length);
            }
            for (tA = ba.needsContext.test(N) ? 0 : BA.length; tA-- && (hA = BA[tA], !y.relative[IA = hA.type]); )
              if (($A = y.find[IA]) && (uA = $A(
                hA.matches[0].replace(On, Nn),
                Do.test(BA[0].type) && Ni($.parentNode) || $
              ))) {
                if (BA.splice(tA, 1), N = uA.length && vt(BA), !N)
                  return Dn.apply(q, uA), q;
                break;
              }
          }
          return (ne || P(N, GA))(
            uA,
            $,
            !jA,
            q,
            !$ || Do.test(N) && Ni($.parentNode) || $
          ), q;
        }, w.sortStable = PA.split("").sort(Ln).join("") === PA, w.detectDuplicates = !!wA, HA(), w.sortDetached = rA(function(N) {
          return N.compareDocumentPosition(vA.createElement("div")) & 1;
        }), rA(function(N) {
          return N.innerHTML = "<a href='#'></a>", N.firstChild.getAttribute("href") === "#";
        }) || DA("type|href|height|width", function(N, $, q) {
          if (!q)
            return N.getAttribute($, $.toLowerCase() === "type" ? 1 : 2);
        }), (!w.attributes || !rA(function(N) {
          return N.innerHTML = "<input/>", N.firstChild.setAttribute("value", ""), N.firstChild.getAttribute("value") === "";
        })) && DA("value", function(N, $, q) {
          if (!q && N.nodeName.toLowerCase() === "input")
            return N.defaultValue;
        }), rA(function(N) {
          return N.getAttribute("disabled") == null;
        }) || DA(Lo, function(N, $, q) {
          var uA;
          if (!q)
            return N[$] === !0 ? $.toLowerCase() : (uA = N.getAttributeNode($)) && uA.specified ? uA.value : null;
        }), _e;
      }(e)
    );
    u.find = _, u.expr = _.selectors, u.expr[":"] = u.expr.pseudos, u.uniqueSort = u.unique = _.uniqueSort, u.text = _.getText, u.isXMLDoc = _.isXML, u.contains = _.contains;
    var M = function(s, d, w) {
      for (var y = [], E = w !== void 0; (s = s[d]) && s.nodeType !== 9; )
        if (s.nodeType === 1) {
          if (E && u(s).is(w))
            break;
          y.push(s);
        }
      return y;
    }, K = function(s, d) {
      for (var w = []; s; s = s.nextSibling)
        s.nodeType === 1 && s !== d && w.push(s);
      return w;
    }, z = u.expr.match.needsContext, cA = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, sA = /^.[^:#\[\.,]*$/;
    function gA(s, d, w) {
      if (u.isFunction(d))
        return u.grep(s, function(y, E) {
          return !!d.call(y, E, y) !== w;
        });
      if (d.nodeType)
        return u.grep(s, function(y) {
          return y === d !== w;
        });
      if (typeof d == "string") {
        if (sA.test(d))
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
        return this.pushStack(gA(this, s || [], !1));
      },
      not: function(s) {
        return this.pushStack(gA(this, s || [], !0));
      },
      is: function(s) {
        return !!gA(
          this,
          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof s == "string" && z.test(s) ? u(s) : s || [],
          !1
        ).length;
      }
    });
    var QA, OA = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, _A = u.fn.init = function(s, d, w) {
      var y, E;
      if (!s)
        return this;
      if (w = w || QA, typeof s == "string")
        if (s.charAt(0) === "<" && s.charAt(s.length - 1) === ">" && s.length >= 3 ? y = [null, s, null] : y = OA.exec(s), y && (y[1] || !d))
          if (y[1]) {
            if (d = d instanceof u ? d[0] : d, u.merge(this, u.parseHTML(
              y[1],
              d && d.nodeType ? d.ownerDocument || d : i,
              !0
            )), cA.test(y[1]) && u.isPlainObject(d))
              for (y in d)
                u.isFunction(this[y]) ? this[y](d[y]) : this.attr(y, d[y]);
            return this;
          } else {
            if (E = i.getElementById(y[2]), E && E.parentNode) {
              if (E.id !== y[2])
                return QA.find(s);
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
    _A.prototype = u.fn, QA = u(i);
    var W = /^(?:parents|prev(?:Until|All))/, yA = {
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
        for (var w, y = 0, E = this.length, b = [], I = z.test(s) || typeof s != "string" ? u(s, d || this.context) : 0; y < E; y++)
          for (w = this[y]; w && w !== d; w = w.parentNode)
            if (w.nodeType < 11 && (I ? I.index(w) > -1 : (
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
    function eA(s, d) {
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
        return M(s, "parentNode");
      },
      parentsUntil: function(s, d, w) {
        return M(s, "parentNode", w);
      },
      next: function(s) {
        return eA(s, "nextSibling");
      },
      prev: function(s) {
        return eA(s, "previousSibling");
      },
      nextAll: function(s) {
        return M(s, "nextSibling");
      },
      prevAll: function(s) {
        return M(s, "previousSibling");
      },
      nextUntil: function(s, d, w) {
        return M(s, "nextSibling", w);
      },
      prevUntil: function(s, d, w) {
        return M(s, "previousSibling", w);
      },
      siblings: function(s) {
        return K((s.parentNode || {}).firstChild, s);
      },
      children: function(s) {
        return K(s.firstChild);
      },
      contents: function(s) {
        return u.nodeName(s, "iframe") ? s.contentDocument || s.contentWindow.document : u.merge([], s.childNodes);
      }
    }, function(s, d) {
      u.fn[s] = function(w, y) {
        var E = u.map(this, d, w);
        return s.slice(-5) !== "Until" && (y = w), y && typeof y == "string" && (E = u.filter(y, E)), this.length > 1 && (yA[s] || (E = u.uniqueSort(E)), W.test(s) && (E = E.reverse())), this.pushStack(E);
      };
    });
    var fA = /\S+/g;
    function bA(s) {
      var d = {};
      return u.each(s.match(fA) || [], function(w, y) {
        d[y] = !0;
      }), d;
    }
    u.Callbacks = function(s) {
      s = typeof s == "string" ? bA(s) : u.extend({}, s);
      var d, w, y, E, b = [], I = [], P = -1, V = function() {
        for (E = s.once, y = d = !0; I.length; P = -1)
          for (w = I.shift(); ++P < b.length; )
            b[P].apply(w[0], w[1]) === !1 && s.stopOnFalse && (P = b.length, w = !1);
        s.memory || (w = !1), d = !1, E && (w ? b = [] : b = "");
      }, X = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return b && (w && !d && (P = b.length - 1, I.push(w)), function Z(wA) {
            u.each(wA, function(HA, vA) {
              u.isFunction(vA) ? (!s.unique || !X.has(vA)) && b.push(vA) : vA && vA.length && u.type(vA) !== "string" && Z(vA);
            });
          }(arguments), w && !d && V()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return u.each(arguments, function(Z, wA) {
            for (var HA; (HA = u.inArray(wA, b, HA)) > -1; )
              b.splice(HA, 1), HA <= P && P--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(Z) {
          return Z ? u.inArray(Z, b) > -1 : b.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return b && (b = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return E = I = [], b = w = "", this;
        },
        disabled: function() {
          return !b;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return E = !0, w || X.disable(), this;
        },
        locked: function() {
          return !!E;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(Z, wA) {
          return E || (wA = wA || [], wA = [Z, wA.slice ? wA.slice() : wA], I.push(wA), d || V()), this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          return X.fireWith(this, arguments), this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!y;
        }
      };
      return X;
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
            return u.Deferred(function(I) {
              u.each(d, function(P, V) {
                var X = u.isFunction(b[P]) && b[P];
                E[V[1]](function() {
                  var Z = X && X.apply(this, arguments);
                  Z && u.isFunction(Z.promise) ? Z.promise().progress(I.notify).done(I.resolve).fail(I.reject) : I[V[0] + "With"](
                    this === y ? I.promise() : this,
                    X ? [Z] : arguments
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
        return y.pipe = y.then, u.each(d, function(b, I) {
          var P = I[2], V = I[3];
          y[I[1]] = P.add, V && P.add(function() {
            w = V;
          }, d[b ^ 1][2].disable, d[2][2].lock), E[I[0]] = function() {
            return E[I[0] + "With"](this === E ? y : this, arguments), this;
          }, E[I[0] + "With"] = P.fireWith;
        }), y.promise(E), s && s.call(E, E), E;
      },
      // Deferred helper
      when: function(s) {
        var d = 0, w = o.call(arguments), y = w.length, E = y !== 1 || s && u.isFunction(s.promise) ? y : 0, b = E === 1 ? s : u.Deferred(), I = function(Z, wA, HA) {
          return function(vA) {
            wA[Z] = this, HA[Z] = arguments.length > 1 ? o.call(arguments) : vA, HA === P ? b.notifyWith(wA, HA) : --E || b.resolveWith(wA, HA);
          };
        }, P, V, X;
        if (y > 1)
          for (P = new Array(y), V = new Array(y), X = new Array(y); d < y; d++)
            w[d] && u.isFunction(w[d].promise) ? w[d].promise().progress(I(d, V, P)).done(I(d, X, w)).fail(b.reject) : --E;
        return E || b.resolveWith(X, w), b.promise();
      }
    });
    var xA;
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
        (s === !0 ? --u.readyWait : u.isReady) || (u.isReady = !0, !(s !== !0 && --u.readyWait > 0) && (xA.resolveWith(i, [u]), u.fn.triggerHandler && (u(i).triggerHandler("ready"), u(i).off("ready"))));
      }
    });
    function iA() {
      i.addEventListener ? (i.removeEventListener("DOMContentLoaded", T), e.removeEventListener("load", T)) : (i.detachEvent("onreadystatechange", T), e.detachEvent("onload", T));
    }
    function T() {
      (i.addEventListener || e.event.type === "load" || i.readyState === "complete") && (iA(), u.ready());
    }
    u.ready.promise = function(s) {
      if (!xA)
        if (xA = u.Deferred(), i.readyState === "complete" || i.readyState !== "loading" && !i.documentElement.doScroll)
          e.setTimeout(u.ready);
        else if (i.addEventListener)
          i.addEventListener("DOMContentLoaded", T), e.addEventListener("load", T);
        else {
          i.attachEvent("onreadystatechange", T), e.attachEvent("onload", T);
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
              iA(), u.ready();
            }
          }();
        }
      return xA.promise(s);
    }, u.ready.promise();
    var AA;
    for (AA in u(g))
      break;
    g.ownFirst = AA === "0", g.inlineBlockNeedsLayout = !1, u(function() {
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
    var J = function(s) {
      var d = u.noData[(s.nodeName + " ").toLowerCase()], w = +s.nodeType || 1;
      return w !== 1 && w !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !d || d !== !0 && s.getAttribute("classid") === d
      );
    }, L = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, R = /([A-Z])/g;
    function nA(s, d, w) {
      if (w === void 0 && s.nodeType === 1) {
        var y = "data-" + d.replace(R, "-$1").toLowerCase();
        if (w = s.getAttribute(y), typeof w == "string") {
          try {
            w = w === "true" ? !0 : w === "false" ? !1 : w === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +w + "" === w ? +w : L.test(w) ? u.parseJSON(w) : w
            );
          } catch {
          }
          u.data(s, d, w);
        } else
          w = void 0;
      }
      return w;
    }
    function FA(s) {
      var d;
      for (d in s)
        if (!(d === "data" && u.isEmptyObject(s[d])) && d !== "toJSON")
          return !1;
      return !0;
    }
    function UA(s, d, w, y) {
      if (J(s)) {
        var E, b, I = u.expando, P = s.nodeType, V = P ? u.cache : s, X = P ? s[I] : s[I] && I;
        if (!((!X || !V[X] || !y && !V[X].data) && w === void 0 && typeof d == "string"))
          return X || (P ? X = s[I] = n.pop() || u.guid++ : X = I), V[X] || (V[X] = P ? {} : { toJSON: u.noop }), (typeof d == "object" || typeof d == "function") && (y ? V[X] = u.extend(V[X], d) : V[X].data = u.extend(V[X].data, d)), b = V[X], y || (b.data || (b.data = {}), b = b.data), w !== void 0 && (b[u.camelCase(d)] = w), typeof d == "string" ? (E = b[d], E == null && (E = b[u.camelCase(d)])) : E = b, E;
      }
    }
    function qA(s, d, w) {
      if (J(s)) {
        var y, E, b = s.nodeType, I = b ? u.cache : s, P = b ? s[u.expando] : u.expando;
        if (I[P]) {
          if (d && (y = w ? I[P] : I[P].data, y)) {
            for (u.isArray(d) ? d = d.concat(u.map(d, u.camelCase)) : (d in y) ? d = [d] : (d = u.camelCase(d), d in y ? d = [d] : d = d.split(" ")), E = d.length; E--; )
              delete y[d[E]];
            if (w ? !FA(y) : !u.isEmptyObject(y))
              return;
          }
          !w && (delete I[P].data, !FA(I[P])) || (b ? u.cleanData([s], !0) : g.deleteExpando || I != I.window ? delete I[P] : I[P] = void 0);
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
        return s = s.nodeType ? u.cache[s[u.expando]] : s[u.expando], !!s && !FA(s);
      },
      data: function(s, d, w) {
        return UA(s, d, w);
      },
      removeData: function(s, d) {
        return qA(s, d);
      },
      // For internal use only.
      _data: function(s, d, w) {
        return UA(s, d, w, !0);
      },
      _removeData: function(s, d) {
        return qA(s, d, !0);
      }
    }), u.fn.extend({
      data: function(s, d) {
        var w, y, E, b = this[0], I = b && b.attributes;
        if (s === void 0) {
          if (this.length && (E = u.data(b), b.nodeType === 1 && !u._data(b, "parsedAttrs"))) {
            for (w = I.length; w--; )
              I[w] && (y = I[w].name, y.indexOf("data-") === 0 && (y = u.camelCase(y.slice(5)), nA(b, y, E[y])));
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
          b ? nA(b, s, u.data(b, s)) : void 0
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
        var w = u.queue(s, d), y = w.length, E = w.shift(), b = u._queueHooks(s, d), I = function() {
          u.dequeue(s, d);
        };
        E === "inprogress" && (E = w.shift(), y--), E && (d === "fx" && w.unshift("inprogress"), delete b.stop, E.call(s, I, b)), !y && b && b.empty.fire();
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
        var w, y = 1, E = u.Deferred(), b = this, I = this.length, P = function() {
          --y || E.resolveWith(b, [b]);
        };
        for (typeof s != "string" && (d = s, s = void 0), s = s || "fx"; I--; )
          w = u._data(b[I], s + "queueHooks"), w && w.empty && (y++, w.empty.add(P));
        return P(), E.promise(d);
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
    var te = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, zA = new RegExp("^(?:([+-])=|)(" + te + ")([a-z%]*)$", "i"), KA = ["Top", "Right", "Bottom", "Left"], oA = function(s, d) {
      return s = d || s, u.css(s, "display") === "none" || !u.contains(s.ownerDocument, s);
    };
    function mA(s, d, w, y) {
      var E, b = 1, I = 20, P = y ? function() {
        return y.cur();
      } : function() {
        return u.css(s, d, "");
      }, V = P(), X = w && w[3] || (u.cssNumber[d] ? "" : "px"), Z = (u.cssNumber[d] || X !== "px" && +V) && zA.exec(u.css(s, d));
      if (Z && Z[3] !== X) {
        X = X || Z[3], w = w || [], Z = +V || 1;
        do
          b = b || ".5", Z = Z / b, u.style(s, d, Z + X);
        while (b !== (b = P() / V) && b !== 1 && --I);
      }
      return w && (Z = +Z || +V || 0, E = w[1] ? Z + (w[1] + 1) * w[2] : +w[2], y && (y.unit = X, y.start = Z, y.end = E)), E;
    }
    var EA = function(s, d, w, y, E, b, I) {
      var P = 0, V = s.length, X = w == null;
      if (u.type(w) === "object") {
        E = !0;
        for (P in w)
          EA(s, d, P, w[P], !0, b, I);
      } else if (y !== void 0 && (E = !0, u.isFunction(y) || (I = !0), X && (I ? (d.call(s, y), d = null) : (X = d, d = function(Z, wA, HA) {
        return X.call(u(Z), HA);
      })), d))
        for (; P < V; P++)
          d(
            s[P],
            w,
            I ? y : y.call(s[P], P, d(s[P], w))
          );
      return E ? s : (
        // Gets
        X ? d.call(s) : V ? d(s[0], w) : b
      );
    }, ee = /^(?:checkbox|radio)$/i, we = /<([\w:-]+)/, Fe = /^$|\/(?:java|ecma)script/i, Ye = /^\s+/, Le = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function ke(s) {
      var d = Le.split("|"), w = s.createDocumentFragment();
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
      _default: g.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Me.optgroup = Me.option, Me.tbody = Me.tfoot = Me.colgroup = Me.caption = Me.thead, Me.th = Me.td;
    function be(s, d) {
      var w, y, E = 0, b = typeof s.getElementsByTagName < "u" ? s.getElementsByTagName(d || "*") : typeof s.querySelectorAll < "u" ? s.querySelectorAll(d || "*") : void 0;
      if (!b)
        for (b = [], w = s.childNodes || s; (y = w[E]) != null; E++)
          !d || u.nodeName(y, d) ? b.push(y) : u.merge(b, be(y, d));
      return d === void 0 || d && u.nodeName(s, d) ? u.merge([s], b) : b;
    }
    function Nt(s, d) {
      for (var w, y = 0; (w = s[y]) != null; y++)
        u._data(
          w,
          "globalEval",
          !d || u._data(d[y], "globalEval")
        );
    }
    var Et = /<|&#?\w+;/, Mt = /<tbody/i;
    function bt(s) {
      ee.test(s.type) && (s.defaultChecked = s.checked);
    }
    function wt(s, d, w, y, E) {
      for (var b, I, P, V, X, Z, wA, HA = s.length, vA = ke(d), re = [], jA = 0; jA < HA; jA++)
        if (I = s[jA], I || I === 0)
          if (u.type(I) === "object")
            u.merge(re, I.nodeType ? [I] : I);
          else if (!Et.test(I))
            re.push(d.createTextNode(I));
          else {
            for (V = V || vA.appendChild(d.createElement("div")), X = (we.exec(I) || ["", ""])[1].toLowerCase(), wA = Me[X] || Me._default, V.innerHTML = wA[1] + u.htmlPrefilter(I) + wA[2], b = wA[0]; b--; )
              V = V.lastChild;
            if (!g.leadingWhitespace && Ye.test(I) && re.push(d.createTextNode(Ye.exec(I)[0])), !g.tbody)
              for (I = X === "table" && !Mt.test(I) ? V.firstChild : (
                // String was a bare <thead> or <tfoot>
                wA[1] === "<table>" && !Mt.test(I) ? V : 0
              ), b = I && I.childNodes.length; b--; )
                u.nodeName(Z = I.childNodes[b], "tbody") && !Z.childNodes.length && I.removeChild(Z);
            for (u.merge(re, V.childNodes), V.textContent = ""; V.firstChild; )
              V.removeChild(V.firstChild);
            V = vA.lastChild;
          }
      for (V && vA.removeChild(V), g.appendChecked || u.grep(be(re, "input"), bt), jA = 0; I = re[jA++]; ) {
        if (y && u.inArray(I, y) > -1) {
          E && E.push(I);
          continue;
        }
        if (P = u.contains(I.ownerDocument, I), V = be(vA.appendChild(I), "script"), P && Nt(V), w)
          for (b = 0; I = V[b++]; )
            Fe.test(I.type || "") && w.push(I);
      }
      return V = null, vA;
    }
    (function() {
      var s, d, w = i.createElement("div");
      for (s in { submit: !0, change: !0, focusin: !0 })
        d = "on" + s, (g[s] = d in e) || (w.setAttribute(d, "t"), g[s] = w.attributes[d].expando === !1);
      w = null;
    })();
    var fn = /^(?:input|select|textarea)$/i, mr = /^key/, _i = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, qr = /^(?:focusinfocus|focusoutblur)$/, zr = /^([^.]*)(?:\.(.+)|)/;
    function lA() {
      return !0;
    }
    function TA() {
      return !1;
    }
    function WA() {
      try {
        return i.activeElement;
      } catch {
      }
    }
    function me(s, d, w, y, E, b) {
      var I, P;
      if (typeof d == "object") {
        typeof w != "string" && (y = y || w, w = void 0);
        for (P in d)
          me(s, P, w, y, d[P], b);
        return s;
      }
      if (y == null && E == null ? (E = w, y = w = void 0) : E == null && (typeof w == "string" ? (E = y, y = void 0) : (E = y, y = w, w = void 0)), E === !1)
        E = TA;
      else if (!E)
        return s;
      return b === 1 && (I = E, E = function(V) {
        return u().off(V), I.apply(this, arguments);
      }, E.guid = I.guid || (I.guid = u.guid++)), s.each(function() {
        u.event.add(this, d, E, y, w);
      });
    }
    u.event = {
      global: {},
      add: function(s, d, w, y, E) {
        var b, I, P, V, X, Z, wA, HA, vA, re, jA, se = u._data(s);
        if (se) {
          for (w.handler && (V = w, w = V.handler, E = V.selector), w.guid || (w.guid = u.guid++), (I = se.events) || (I = se.events = {}), (Z = se.handle) || (Z = se.handle = function(dt) {
            return typeof u < "u" && (!dt || u.event.triggered !== dt.type) ? u.event.dispatch.apply(Z.elem, arguments) : void 0;
          }, Z.elem = s), d = (d || "").match(fA) || [""], P = d.length; P--; )
            b = zr.exec(d[P]) || [], vA = jA = b[1], re = (b[2] || "").split(".").sort(), vA && (X = u.event.special[vA] || {}, vA = (E ? X.delegateType : X.bindType) || vA, X = u.event.special[vA] || {}, wA = u.extend({
              type: vA,
              origType: jA,
              data: y,
              handler: w,
              guid: w.guid,
              selector: E,
              needsContext: E && u.expr.match.needsContext.test(E),
              namespace: re.join(".")
            }, V), (HA = I[vA]) || (HA = I[vA] = [], HA.delegateCount = 0, (!X.setup || X.setup.call(s, y, re, Z) === !1) && (s.addEventListener ? s.addEventListener(vA, Z, !1) : s.attachEvent && s.attachEvent("on" + vA, Z))), X.add && (X.add.call(s, wA), wA.handler.guid || (wA.handler.guid = w.guid)), E ? HA.splice(HA.delegateCount++, 0, wA) : HA.push(wA), u.event.global[vA] = !0);
          s = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(s, d, w, y, E) {
        var b, I, P, V, X, Z, wA, HA, vA, re, jA, se = u.hasData(s) && u._data(s);
        if (!(!se || !(Z = se.events))) {
          for (d = (d || "").match(fA) || [""], X = d.length; X--; ) {
            if (P = zr.exec(d[X]) || [], vA = jA = P[1], re = (P[2] || "").split(".").sort(), !vA) {
              for (vA in Z)
                u.event.remove(s, vA + d[X], w, y, !0);
              continue;
            }
            for (wA = u.event.special[vA] || {}, vA = (y ? wA.delegateType : wA.bindType) || vA, HA = Z[vA] || [], P = P[2] && new RegExp("(^|\\.)" + re.join("\\.(?:.*\\.|)") + "(\\.|$)"), V = b = HA.length; b--; )
              I = HA[b], (E || jA === I.origType) && (!w || w.guid === I.guid) && (!P || P.test(I.namespace)) && (!y || y === I.selector || y === "**" && I.selector) && (HA.splice(b, 1), I.selector && HA.delegateCount--, wA.remove && wA.remove.call(s, I));
            V && !HA.length && ((!wA.teardown || wA.teardown.call(s, re, se.handle) === !1) && u.removeEvent(s, vA, se.handle), delete Z[vA]);
          }
          u.isEmptyObject(Z) && (delete se.handle, u._removeData(s, "events"));
        }
      },
      trigger: function(s, d, w, y) {
        var E, b, I, P, V, X, Z, wA = [w || i], HA = B.call(s, "type") ? s.type : s, vA = B.call(s, "namespace") ? s.namespace.split(".") : [];
        if (I = X = w = w || i, !(w.nodeType === 3 || w.nodeType === 8) && !qr.test(HA + u.event.triggered) && (HA.indexOf(".") > -1 && (vA = HA.split("."), HA = vA.shift(), vA.sort()), b = HA.indexOf(":") < 0 && "on" + HA, s = s[u.expando] ? s : new u.Event(HA, typeof s == "object" && s), s.isTrigger = y ? 2 : 3, s.namespace = vA.join("."), s.rnamespace = s.namespace ? new RegExp("(^|\\.)" + vA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, s.result = void 0, s.target || (s.target = w), d = d == null ? [s] : u.makeArray(d, [s]), V = u.event.special[HA] || {}, !(!y && V.trigger && V.trigger.apply(w, d) === !1))) {
          if (!y && !V.noBubble && !u.isWindow(w)) {
            for (P = V.delegateType || HA, qr.test(P + HA) || (I = I.parentNode); I; I = I.parentNode)
              wA.push(I), X = I;
            X === (w.ownerDocument || i) && wA.push(X.defaultView || X.parentWindow || e);
          }
          for (Z = 0; (I = wA[Z++]) && !s.isPropagationStopped(); )
            s.type = Z > 1 ? P : V.bindType || HA, E = (u._data(I, "events") || {})[s.type] && u._data(I, "handle"), E && E.apply(I, d), E = b && I[b], E && E.apply && J(I) && (s.result = E.apply(I, d), s.result === !1 && s.preventDefault());
          if (s.type = HA, !y && !s.isDefaultPrevented() && (!V._default || V._default.apply(wA.pop(), d) === !1) && J(w) && b && w[HA] && !u.isWindow(w)) {
            X = w[b], X && (w[b] = null), u.event.triggered = HA;
            try {
              w[HA]();
            } catch {
            }
            u.event.triggered = void 0, X && (w[b] = X);
          }
          return s.result;
        }
      },
      dispatch: function(s) {
        s = u.event.fix(s);
        var d, w, y, E, b, I = [], P = o.call(arguments), V = (u._data(this, "events") || {})[s.type] || [], X = u.event.special[s.type] || {};
        if (P[0] = s, s.delegateTarget = this, !(X.preDispatch && X.preDispatch.call(this, s) === !1)) {
          for (I = u.event.handlers.call(this, s, V), d = 0; (E = I[d++]) && !s.isPropagationStopped(); )
            for (s.currentTarget = E.elem, w = 0; (b = E.handlers[w++]) && !s.isImmediatePropagationStopped(); )
              (!s.rnamespace || s.rnamespace.test(b.namespace)) && (s.handleObj = b, s.data = b.data, y = ((u.event.special[b.origType] || {}).handle || b.handler).apply(E.elem, P), y !== void 0 && (s.result = y) === !1 && (s.preventDefault(), s.stopPropagation()));
          return X.postDispatch && X.postDispatch.call(this, s), s.result;
        }
      },
      handlers: function(s, d) {
        var w, y, E, b, I = [], P = d.delegateCount, V = s.target;
        if (P && V.nodeType && (s.type !== "click" || isNaN(s.button) || s.button < 1)) {
          for (; V != this; V = V.parentNode || this)
            if (V.nodeType === 1 && (V.disabled !== !0 || s.type !== "click")) {
              for (y = [], w = 0; w < P; w++)
                b = d[w], E = b.selector + " ", y[E] === void 0 && (y[E] = b.needsContext ? u(E, this).index(V) > -1 : u.find(E, this, null, [V]).length), y[E] && y.push(b);
              y.length && I.push({ elem: V, handlers: y });
            }
        }
        return P < d.length && I.push({ elem: this, handlers: d.slice(P) }), I;
      },
      fix: function(s) {
        if (s[u.expando])
          return s;
        var d, w, y, E = s.type, b = s, I = this.fixHooks[E];
        for (I || (this.fixHooks[E] = I = _i.test(E) ? this.mouseHooks : mr.test(E) ? this.keyHooks : {}), y = I.props ? this.props.concat(I.props) : this.props, s = new u.Event(b), d = y.length; d--; )
          w = y[d], s[w] = b[w];
        return s.target || (s.target = b.srcElement || i), s.target.nodeType === 3 && (s.target = s.target.parentNode), s.metaKey = !!s.metaKey, I.filter ? I.filter(s, b) : s;
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
          var w, y, E, b = d.button, I = d.fromElement;
          return s.pageX == null && d.clientX != null && (y = s.target.ownerDocument || i, E = y.documentElement, w = y.body, s.pageX = d.clientX + (E && E.scrollLeft || w && w.scrollLeft || 0) - (E && E.clientLeft || w && w.clientLeft || 0), s.pageY = d.clientY + (E && E.scrollTop || w && w.scrollTop || 0) - (E && E.clientTop || w && w.clientTop || 0)), !s.relatedTarget && I && (s.relatedTarget = I === s.target ? d.toElement : I), !s.which && b !== void 0 && (s.which = b & 1 ? 1 : b & 2 ? 3 : b & 4 ? 2 : 0), s;
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
            if (this !== WA() && this.focus)
              try {
                return this.focus(), !1;
              } catch {
              }
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            if (this === WA() && this.blur)
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
      s.returnValue === !1 ? lA : TA) : this.type = s, d && u.extend(this, d), this.timeStamp = s && s.timeStamp || u.now(), this[u.expando] = !0;
    }, u.Event.prototype = {
      constructor: u.Event,
      isDefaultPrevented: TA,
      isPropagationStopped: TA,
      isImmediatePropagationStopped: TA,
      preventDefault: function() {
        var s = this.originalEvent;
        this.isDefaultPrevented = lA, s && (s.preventDefault ? s.preventDefault() : s.returnValue = !1);
      },
      stopPropagation: function() {
        var s = this.originalEvent;
        this.isPropagationStopped = lA, !(!s || this.isSimulated) && (s.stopPropagation && s.stopPropagation(), s.cancelBubble = !0);
      },
      stopImmediatePropagation: function() {
        var s = this.originalEvent;
        this.isImmediatePropagationStopped = lA, s && s.stopImmediatePropagation && s.stopImmediatePropagation(), this.stopPropagation();
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
          var y, E = this, b = w.relatedTarget, I = w.handleObj;
          return (!b || b !== E && !u.contains(E, b)) && (w.type = I.origType, y = I.handler.apply(this, arguments), w.type = d), y;
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
        if (fn.test(this.nodeName))
          return (this.type === "checkbox" || this.type === "radio") && (u.event.add(this, "propertychange._change", function(s) {
            s.originalEvent.propertyName === "checked" && (this._justChanged = !0);
          }), u.event.add(this, "click._change", function(s) {
            this._justChanged && !s.isTrigger && (this._justChanged = !1), u.event.simulate("change", this, s);
          })), !1;
        u.event.add(this, "beforeactivate._change", function(s) {
          var d = s.target;
          fn.test(d.nodeName) && !u._data(d, "change") && (u.event.add(d, "change._change", function(w) {
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
        return u.event.remove(this, "._change"), !fn.test(this.nodeName);
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
        return me(this, s, d, w, y);
      },
      one: function(s, d, w, y) {
        return me(this, s, d, w, y, 1);
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
        return (d === !1 || typeof d == "function") && (w = d, d = void 0), w === !1 && (w = TA), this.each(function() {
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
    var ve = / jQuery\d+="(?:null|\d+)"/g, st = new RegExp("<(?:" + Le + ")[\\s/>]", "i"), _t = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, _n = /<script|<style|<link/i, xi = /checked\s*(?:[^=]|=\s*.checked.)/i, xn = /^true\/(.*)/, Ii = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Jr = ke(i), hn = Jr.appendChild(i.createElement("div"));
    function Hi(s, d) {
      return u.nodeName(s, "table") && u.nodeName(d.nodeType !== 11 ? d : d.firstChild, "tr") ? s.getElementsByTagName("tbody")[0] || s.appendChild(s.ownerDocument.createElement("tbody")) : s;
    }
    function jr(s) {
      return s.type = (u.find.attr(s, "type") !== null) + "/" + s.type, s;
    }
    function vr(s) {
      var d = xn.exec(s.type);
      return d ? s.type = d[1] : s.removeAttribute("type"), s;
    }
    function js(s, d) {
      if (!(d.nodeType !== 1 || !u.hasData(s))) {
        var w, y, E, b = u._data(s), I = u._data(d, b), P = b.events;
        if (P) {
          delete I.handle, I.events = {};
          for (w in P)
            for (y = 0, E = P[w].length; y < E; y++)
              u.event.add(d, w, P[w][y]);
        }
        I.data && (I.data = u.extend({}, I.data));
      }
    }
    function mo(s, d) {
      var w, y, E;
      if (d.nodeType === 1) {
        if (w = d.nodeName.toLowerCase(), !g.noCloneEvent && d[u.expando]) {
          E = u._data(d);
          for (y in E.events)
            u.removeEvent(d, y, E.handle);
          d.removeAttribute(u.expando);
        }
        w === "script" && d.text !== s.text ? (jr(d).text = s.text, vr(d)) : w === "object" ? (d.parentNode && (d.outerHTML = s.outerHTML), g.html5Clone && s.innerHTML && !u.trim(d.innerHTML) && (d.innerHTML = s.innerHTML)) : w === "input" && ee.test(s.type) ? (d.defaultChecked = d.checked = s.checked, d.value !== s.value && (d.value = s.value)) : w === "option" ? d.defaultSelected = d.selected = s.defaultSelected : (w === "input" || w === "textarea") && (d.defaultValue = s.defaultValue);
      }
    }
    function yr(s, d, w, y) {
      d = l.apply([], d);
      var E, b, I, P, V, X, Z = 0, wA = s.length, HA = wA - 1, vA = d[0], re = u.isFunction(vA);
      if (re || wA > 1 && typeof vA == "string" && !g.checkClone && xi.test(vA))
        return s.each(function(jA) {
          var se = s.eq(jA);
          re && (d[0] = vA.call(this, jA, se.html())), yr(se, d, w, y);
        });
      if (wA && (X = wt(d, s[0].ownerDocument, !1, s, y), E = X.firstChild, X.childNodes.length === 1 && (X = E), E || y)) {
        for (P = u.map(be(X, "script"), jr), I = P.length; Z < wA; Z++)
          b = X, Z !== HA && (b = u.clone(b, !0, !0), I && u.merge(P, be(b, "script"))), w.call(s[Z], b, Z);
        if (I)
          for (V = P[P.length - 1].ownerDocument, u.map(P, vr), Z = 0; Z < I; Z++)
            b = P[Z], Fe.test(b.type || "") && !u._data(b, "globalEval") && u.contains(V, b) && (b.src ? u._evalUrl && u._evalUrl(b.src) : u.globalEval(
              (b.text || b.textContent || b.innerHTML || "").replace(Ii, "")
            ));
        X = E = null;
      }
      return s;
    }
    function fa(s, d, w) {
      for (var y, E = d ? u.filter(d, s) : s, b = 0; (y = E[b]) != null; b++)
        !w && y.nodeType === 1 && u.cleanData(be(y)), y.parentNode && (w && u.contains(y.ownerDocument, y) && Nt(be(y, "script")), y.parentNode.removeChild(y));
      return s;
    }
    u.extend({
      htmlPrefilter: function(s) {
        return s.replace(_t, "<$1></$2>");
      },
      clone: function(s, d, w) {
        var y, E, b, I, P, V = u.contains(s.ownerDocument, s);
        if (g.html5Clone || u.isXMLDoc(s) || !st.test("<" + s.nodeName + ">") ? b = s.cloneNode(!0) : (hn.innerHTML = s.outerHTML, hn.removeChild(b = hn.firstChild)), (!g.noCloneEvent || !g.noCloneChecked) && (s.nodeType === 1 || s.nodeType === 11) && !u.isXMLDoc(s))
          for (y = be(b), P = be(s), I = 0; (E = P[I]) != null; ++I)
            y[I] && mo(E, y[I]);
        if (d)
          if (w)
            for (P = P || be(s), y = y || be(b), I = 0; (E = P[I]) != null; I++)
              js(E, y[I]);
          else
            js(s, b);
        return y = be(b, "script"), y.length > 0 && Nt(y, !V && be(s, "script")), y = P = E = null, b;
      },
      cleanData: function(s, d) {
        for (var w, y, E, b, I = 0, P = u.expando, V = u.cache, X = g.attributes, Z = u.event.special; (w = s[I]) != null; I++)
          if ((d || J(w)) && (E = w[P], b = E && V[E], b)) {
            if (b.events)
              for (y in b.events)
                Z[y] ? u.event.remove(w, y) : u.removeEvent(w, y, b.handle);
            V[E] && (delete V[E], !X && typeof w.removeAttribute < "u" ? w.removeAttribute(P) : w[P] = void 0, n.push(E));
          }
      }
    }), u.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: yr,
      detach: function(s) {
        return fa(this, s, !0);
      },
      remove: function(s) {
        return fa(this, s);
      },
      text: function(s) {
        return EA(this, function(d) {
          return d === void 0 ? u.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || i).createTextNode(d)
          );
        }, null, s, arguments.length);
      },
      append: function() {
        return yr(this, arguments, function(s) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Hi(this, s);
            d.appendChild(s);
          }
        });
      },
      prepend: function() {
        return yr(this, arguments, function(s) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Hi(this, s);
            d.insertBefore(s, d.firstChild);
          }
        });
      },
      before: function() {
        return yr(this, arguments, function(s) {
          this.parentNode && this.parentNode.insertBefore(s, this);
        });
      },
      after: function() {
        return yr(this, arguments, function(s) {
          this.parentNode && this.parentNode.insertBefore(s, this.nextSibling);
        });
      },
      empty: function() {
        for (var s, d = 0; (s = this[d]) != null; d++) {
          for (s.nodeType === 1 && u.cleanData(be(s, !1)); s.firstChild; )
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
        return EA(this, function(d) {
          var w = this[0] || {}, y = 0, E = this.length;
          if (d === void 0)
            return w.nodeType === 1 ? w.innerHTML.replace(ve, "") : void 0;
          if (typeof d == "string" && !_n.test(d) && (g.htmlSerialize || !st.test(d)) && (g.leadingWhitespace || !Ye.test(d)) && !Me[(we.exec(d) || ["", ""])[1].toLowerCase()]) {
            d = u.htmlPrefilter(d);
            try {
              for (; y < E; y++)
                w = this[y] || {}, w.nodeType === 1 && (u.cleanData(be(w, !1)), w.innerHTML = d);
              w = 0;
            } catch {
            }
          }
          w && this.empty().append(d);
        }, null, s, arguments.length);
      },
      replaceWith: function() {
        var s = [];
        return yr(this, arguments, function(d) {
          var w = this.parentNode;
          u.inArray(this, s) < 0 && (u.cleanData(be(this)), w && w.replaceChild(d, this));
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
        for (var y, E = 0, b = [], I = u(w), P = I.length - 1; E <= P; E++)
          y = E === P ? this : this.clone(!0), u(I[E])[d](y), f.apply(b, y.get());
        return this.pushStack(b);
      };
    });
    var Si, Ys = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function Zs(s, d) {
      var w = u(d.createElement(s)).appendTo(d.body), y = u.css(w[0], "display");
      return w.detach(), y;
    }
    function ha(s) {
      var d = i, w = Ys[s];
      return w || (w = Zs(s, d), (w === "none" || !w) && (Si = (Si || u("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (Si[0].contentWindow || Si[0].contentDocument).document, d.write(), d.close(), w = Zs(s, d), Si.detach()), Ys[s] = w), w;
    }
    var Au = /^margin/, da = new RegExp("^(" + te + ")(?!px)[a-z%]+$", "i"), vo = function(s, d, w, y) {
      var E, b, I = {};
      for (b in d)
        I[b] = s.style[b], s.style[b] = d[b];
      E = w.apply(s, y || []);
      for (b in d)
        s.style[b] = I[b];
      return E;
    }, eu = i.documentElement;
    (function() {
      var s, d, w, y, E, b, I = i.createElement("div"), P = i.createElement("div");
      if (!P.style)
        return;
      P.style.cssText = "float:left;opacity:.5", g.opacity = P.style.opacity === "0.5", g.cssFloat = !!P.style.cssFloat, P.style.backgroundClip = "content-box", P.cloneNode(!0).style.backgroundClip = "", g.clearCloneStyle = P.style.backgroundClip === "content-box", I = i.createElement("div"), I.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", P.innerHTML = "", I.appendChild(P), g.boxSizing = P.style.boxSizing === "" || P.style.MozBoxSizing === "" || P.style.WebkitBoxSizing === "", u.extend(g, {
        reliableHiddenOffsets: function() {
          return s == null && V(), y;
        },
        boxSizingReliable: function() {
          return s == null && V(), w;
        },
        pixelMarginRight: function() {
          return s == null && V(), d;
        },
        pixelPosition: function() {
          return s == null && V(), s;
        },
        reliableMarginRight: function() {
          return s == null && V(), E;
        },
        reliableMarginLeft: function() {
          return s == null && V(), b;
        }
      });
      function V() {
        var X, Z, wA = i.documentElement;
        wA.appendChild(I), P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", s = w = b = !1, d = E = !0, e.getComputedStyle && (Z = e.getComputedStyle(P), s = (Z || {}).top !== "1%", b = (Z || {}).marginLeft === "2px", w = (Z || { width: "4px" }).width === "4px", P.style.marginRight = "50%", d = (Z || { marginRight: "4px" }).marginRight === "4px", X = P.appendChild(i.createElement("div")), X.style.cssText = P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", X.style.marginRight = X.style.width = "0", P.style.width = "1px", E = !parseFloat((e.getComputedStyle(X) || {}).marginRight), P.removeChild(X)), P.style.display = "none", y = P.getClientRects().length === 0, y && (P.style.display = "", P.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", P.childNodes[0].style.borderCollapse = "separate", X = P.getElementsByTagName("td"), X[0].style.cssText = "margin:0;border:0;padding:0;display:none", y = X[0].offsetHeight === 0, y && (X[0].style.display = "", X[1].style.display = "none", y = X[0].offsetHeight === 0)), wA.removeChild(I);
      }
    })();
    var jn, Yn, jc = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (jn = function(s) {
      var d = s.ownerDocument.defaultView;
      return (!d || !d.opener) && (d = e), d.getComputedStyle(s);
    }, Yn = function(s, d, w) {
      var y, E, b, I, P = s.style;
      return w = w || jn(s), I = w ? w.getPropertyValue(d) || w[d] : void 0, (I === "" || I === void 0) && !u.contains(s.ownerDocument, s) && (I = u.style(s, d)), w && !g.pixelMarginRight() && da.test(I) && Au.test(d) && (y = P.width, E = P.minWidth, b = P.maxWidth, P.minWidth = P.maxWidth = P.width = I, I = w.width, P.width = y, P.minWidth = E, P.maxWidth = b), I === void 0 ? I : I + "";
    }) : eu.currentStyle && (jn = function(s) {
      return s.currentStyle;
    }, Yn = function(s, d, w) {
      var y, E, b, I, P = s.style;
      return w = w || jn(s), I = w ? w[d] : void 0, I == null && P && P[d] && (I = P[d]), da.test(I) && !jc.test(d) && (y = P.left, E = s.runtimeStyle, b = E && E.left, b && (E.left = s.currentStyle.left), P.left = d === "fontSize" ? "1em" : I, I = P.pixelLeft + "px", P.left = y, b && (E.left = b)), I === void 0 ? I : I + "" || "auto";
    });
    function yo(s, d) {
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
    var Co = /alpha\([^)]*\)/i, Yc = /opacity\s*=\s*([^)]*)/i, Zc = /^(none|table(?!-c[ea]).+)/, pa = new RegExp("^(" + te + ")(.*)$", "i"), Af = { position: "absolute", visibility: "hidden", display: "block" }, Li = {
      letterSpacing: "0",
      fontWeight: "400"
    }, tu = ["Webkit", "O", "Moz", "ms"], nu = i.createElement("div").style;
    function ru(s) {
      if (s in nu)
        return s;
      for (var d = s.charAt(0).toUpperCase() + s.slice(1), w = tu.length; w--; )
        if (s = tu[w] + d, s in nu)
          return s;
    }
    function Qo(s, d) {
      for (var w, y, E, b = [], I = 0, P = s.length; I < P; I++)
        y = s[I], y.style && (b[I] = u._data(y, "olddisplay"), w = y.style.display, d ? (!b[I] && w === "none" && (y.style.display = ""), y.style.display === "" && oA(y) && (b[I] = u._data(y, "olddisplay", ha(y.nodeName)))) : (E = oA(y), (w && w !== "none" || !E) && u._data(
          y,
          "olddisplay",
          E ? w : u.css(y, "display")
        )));
      for (I = 0; I < P; I++)
        y = s[I], y.style && (!d || y.style.display === "none" || y.style.display === "") && (y.style.display = d ? b[I] || "" : "none");
      return s;
    }
    function Fo(s, d, w) {
      var y = pa.exec(d);
      return y ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, y[1] - (w || 0)) + (y[2] || "px")
      ) : d;
    }
    function Uo(s, d, w, y, E) {
      for (var b = w === (y ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        d === "width" ? 1 : 0
      ), I = 0; b < 4; b += 2)
        w === "margin" && (I += u.css(s, w + KA[b], !0, E)), y ? (w === "content" && (I -= u.css(s, "padding" + KA[b], !0, E)), w !== "margin" && (I -= u.css(s, "border" + KA[b] + "Width", !0, E))) : (I += u.css(s, "padding" + KA[b], !0, E), w !== "padding" && (I += u.css(s, "border" + KA[b] + "Width", !0, E)));
      return I;
    }
    function iu(s, d, w) {
      var y = !0, E = d === "width" ? s.offsetWidth : s.offsetHeight, b = jn(s), I = g.boxSizing && u.css(s, "boxSizing", !1, b) === "border-box";
      if (E <= 0 || E == null) {
        if (E = Yn(s, d, b), (E < 0 || E == null) && (E = s.style[d]), da.test(E))
          return E;
        y = I && (g.boxSizingReliable() || E === s.style[d]), E = parseFloat(E) || 0;
      }
      return E + Uo(
        s,
        d,
        w || (I ? "border" : "content"),
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
              var w = Yn(s, "opacity");
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
          var E, b, I, P = u.camelCase(d), V = s.style;
          if (d = u.cssProps[P] || (u.cssProps[P] = ru(P) || P), I = u.cssHooks[d] || u.cssHooks[P], w !== void 0) {
            if (b = typeof w, b === "string" && (E = zA.exec(w)) && E[1] && (w = mA(s, d, E), b = "number"), w == null || w !== w)
              return;
            if (b === "number" && (w += E && E[3] || (u.cssNumber[P] ? "" : "px")), !g.clearCloneStyle && w === "" && d.indexOf("background") === 0 && (V[d] = "inherit"), !I || !("set" in I) || (w = I.set(s, w, y)) !== void 0)
              try {
                V[d] = w;
              } catch {
              }
          } else
            return I && "get" in I && (E = I.get(s, !1, y)) !== void 0 ? E : V[d];
        }
      },
      css: function(s, d, w, y) {
        var E, b, I, P = u.camelCase(d);
        return d = u.cssProps[P] || (u.cssProps[P] = ru(P) || P), I = u.cssHooks[d] || u.cssHooks[P], I && "get" in I && (b = I.get(s, !0, w)), b === void 0 && (b = Yn(s, d, y)), b === "normal" && d in Li && (b = Li[d]), w === "" || w ? (E = parseFloat(b), w === !0 || isFinite(E) ? E || 0 : b) : b;
      }
    }), u.each(["height", "width"], function(s, d) {
      u.cssHooks[d] = {
        get: function(w, y, E) {
          if (y)
            return Zc.test(u.css(w, "display")) && w.offsetWidth === 0 ? vo(w, Af, function() {
              return iu(w, d, E);
            }) : iu(w, d, E);
        },
        set: function(w, y, E) {
          var b = E && jn(w);
          return Fo(
            w,
            y,
            E ? Uo(
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
        return Yc.test((d && s.currentStyle ? s.currentStyle.filter : s.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : d ? "1" : "";
      },
      set: function(s, d) {
        var w = s.style, y = s.currentStyle, E = u.isNumeric(d) ? "alpha(opacity=" + d * 100 + ")" : "", b = y && y.filter || w.filter || "";
        w.zoom = 1, !((d >= 1 || d === "") && u.trim(b.replace(Co, "")) === "" && w.removeAttribute && (w.removeAttribute("filter"), d === "" || y && !y.filter)) && (w.filter = Co.test(b) ? b.replace(Co, E) : b + " " + E);
      }
    }), u.cssHooks.marginRight = yo(
      g.reliableMarginRight,
      function(s, d) {
        if (d)
          return vo(
            s,
            { display: "inline-block" },
            Yn,
            [s, "marginRight"]
          );
      }
    ), u.cssHooks.marginLeft = yo(
      g.reliableMarginLeft,
      function(s, d) {
        if (d)
          return (parseFloat(Yn(s, "marginLeft")) || // Support: IE<=11+
          // Running getBoundingClientRect on a disconnected node in IE throws an error
          // Support: IE8 only
          // getClientRects() errors on disconnected elems
          (u.contains(s.ownerDocument, s) ? s.getBoundingClientRect().left - vo(s, { marginLeft: 0 }, function() {
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
            E[s + KA[y] + d] = b[y] || b[y - 2] || b[0];
          return E;
        }
      }, Au.test(s) || (u.cssHooks[s + d].set = Fo);
    }), u.fn.extend({
      css: function(s, d) {
        return EA(this, function(w, y, E) {
          var b, I, P = {}, V = 0;
          if (u.isArray(y)) {
            for (b = jn(w), I = y.length; V < I; V++)
              P[y[V]] = u.css(w, y[V], !1, b);
            return P;
          }
          return E !== void 0 ? u.style(w, y, E) : u.css(w, y);
        }, s, d, arguments.length > 1);
      },
      show: function() {
        return Qo(this, !0);
      },
      hide: function() {
        return Qo(this);
      },
      toggle: function(s) {
        return typeof s == "boolean" ? s ? this.show() : this.hide() : this.each(function() {
          oA(this) ? u(this).show() : u(this).hide();
        });
      }
    });
    function xt(s, d, w, y, E) {
      return new xt.prototype.init(s, d, w, y, E);
    }
    u.Tween = xt, xt.prototype = {
      constructor: xt,
      init: function(s, d, w, y, E, b) {
        this.elem = s, this.prop = w, this.easing = E || u.easing._default, this.options = d, this.start = this.now = this.cur(), this.end = y, this.unit = b || (u.cssNumber[w] ? "" : "px");
      },
      cur: function() {
        var s = xt.propHooks[this.prop];
        return s && s.get ? s.get(this) : xt.propHooks._default.get(this);
      },
      run: function(s) {
        var d, w = xt.propHooks[this.prop];
        return this.options.duration ? this.pos = d = u.easing[this.easing](
          s,
          this.options.duration * s,
          0,
          1,
          this.options.duration
        ) : this.pos = d = s, this.now = (this.end - this.start) * d + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), w && w.set ? w.set(this) : xt.propHooks._default.set(this), this;
      }
    }, xt.prototype.init.prototype = xt.prototype, xt.propHooks = {
      _default: {
        get: function(s) {
          var d;
          return s.elem.nodeType !== 1 || s.elem[s.prop] != null && s.elem.style[s.prop] == null ? s.elem[s.prop] : (d = u.css(s.elem, s.prop, ""), !d || d === "auto" ? 0 : d);
        },
        set: function(s) {
          u.fx.step[s.prop] ? u.fx.step[s.prop](s) : s.elem.nodeType === 1 && (s.elem.style[u.cssProps[s.prop]] != null || u.cssHooks[s.prop]) ? u.style(s.elem, s.prop, s.now + s.unit) : s.elem[s.prop] = s.now;
        }
      }
    }, xt.propHooks.scrollTop = xt.propHooks.scrollLeft = {
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
    }, u.fx = xt.prototype.init, u.fx.step = {};
    var Yr, ga, au = /^(?:toggle|show|hide)$/, ou = /queueHooks$/;
    function Eo() {
      return e.setTimeout(function() {
        Yr = void 0;
      }), Yr = u.now();
    }
    function Zr(s, d) {
      var w, y = { height: s }, E = 0;
      for (d = d ? 1 : 0; E < 4; E += 2 - d)
        w = KA[E], y["margin" + w] = y["padding" + w] = s;
      return d && (y.opacity = y.width = s), y;
    }
    function su(s, d, w) {
      for (var y, E = (Xt.tweeners[d] || []).concat(Xt.tweeners["*"]), b = 0, I = E.length; b < I; b++)
        if (y = E[b].call(w, d, s))
          return y;
    }
    function uu(s, d, w) {
      var y, E, b, I, P, V, X, Z, wA = this, HA = {}, vA = s.style, re = s.nodeType && oA(s), jA = u._data(s, "fxshow");
      w.queue || (P = u._queueHooks(s, "fx"), P.unqueued == null && (P.unqueued = 0, V = P.empty.fire, P.empty.fire = function() {
        P.unqueued || V();
      }), P.unqueued++, wA.always(function() {
        wA.always(function() {
          P.unqueued--, u.queue(s, "fx").length || P.empty.fire();
        });
      })), s.nodeType === 1 && ("height" in d || "width" in d) && (w.overflow = [vA.overflow, vA.overflowX, vA.overflowY], X = u.css(s, "display"), Z = X === "none" ? u._data(s, "olddisplay") || ha(s.nodeName) : X, Z === "inline" && u.css(s, "float") === "none" && (!g.inlineBlockNeedsLayout || ha(s.nodeName) === "inline" ? vA.display = "inline-block" : vA.zoom = 1)), w.overflow && (vA.overflow = "hidden", g.shrinkWrapBlocks() || wA.always(function() {
        vA.overflow = w.overflow[0], vA.overflowX = w.overflow[1], vA.overflowY = w.overflow[2];
      }));
      for (y in d)
        if (E = d[y], au.exec(E)) {
          if (delete d[y], b = b || E === "toggle", E === (re ? "hide" : "show"))
            if (E === "show" && jA && jA[y] !== void 0)
              re = !0;
            else
              continue;
          HA[y] = jA && jA[y] || u.style(s, y);
        } else
          X = void 0;
      if (u.isEmptyObject(HA))
        (X === "none" ? ha(s.nodeName) : X) === "inline" && (vA.display = X);
      else {
        jA ? "hidden" in jA && (re = jA.hidden) : jA = u._data(s, "fxshow", {}), b && (jA.hidden = !re), re ? u(s).show() : wA.done(function() {
          u(s).hide();
        }), wA.done(function() {
          var se;
          u._removeData(s, "fxshow");
          for (se in HA)
            u.style(s, se, HA[se]);
        });
        for (y in HA)
          I = su(re ? jA[y] : 0, y, wA), y in jA || (jA[y] = I.start, re && (I.end = I.start, I.start = y === "width" || y === "height" ? 1 : 0));
      }
    }
    function Ba(s, d) {
      var w, y, E, b, I;
      for (w in s)
        if (y = u.camelCase(w), E = d[y], b = s[w], u.isArray(b) && (E = b[1], b = s[w] = b[0]), w !== y && (s[y] = b, delete s[w]), I = u.cssHooks[y], I && "expand" in I) {
          b = I.expand(b), delete s[y];
          for (w in b)
            w in s || (s[w] = b[w], d[w] = E);
        } else
          d[y] = E;
    }
    function Xt(s, d, w) {
      var y, E, b = 0, I = Xt.prefilters.length, P = u.Deferred().always(function() {
        delete V.elem;
      }), V = function() {
        if (E)
          return !1;
        for (var wA = Yr || Eo(), HA = Math.max(0, X.startTime + X.duration - wA), vA = HA / X.duration || 0, re = 1 - vA, jA = 0, se = X.tweens.length; jA < se; jA++)
          X.tweens[jA].run(re);
        return P.notifyWith(s, [X, re, HA]), re < 1 && se ? HA : (P.resolveWith(s, [X]), !1);
      }, X = P.promise({
        elem: s,
        props: u.extend({}, d),
        opts: u.extend(!0, {
          specialEasing: {},
          easing: u.easing._default
        }, w),
        originalProperties: d,
        originalOptions: w,
        startTime: Yr || Eo(),
        duration: w.duration,
        tweens: [],
        createTween: function(wA, HA) {
          var vA = u.Tween(
            s,
            X.opts,
            wA,
            HA,
            X.opts.specialEasing[wA] || X.opts.easing
          );
          return X.tweens.push(vA), vA;
        },
        stop: function(wA) {
          var HA = 0, vA = wA ? X.tweens.length : 0;
          if (E)
            return this;
          for (E = !0; HA < vA; HA++)
            X.tweens[HA].run(1);
          return wA ? (P.notifyWith(s, [X, 1, 0]), P.resolveWith(s, [X, wA])) : P.rejectWith(s, [X, wA]), this;
        }
      }), Z = X.props;
      for (Ba(Z, X.opts.specialEasing); b < I; b++)
        if (y = Xt.prefilters[b].call(X, s, Z, X.opts), y)
          return u.isFunction(y.stop) && (u._queueHooks(X.elem, X.opts.queue).stop = u.proxy(y.stop, y)), y;
      return u.map(Z, su, X), u.isFunction(X.opts.start) && X.opts.start.call(s, X), u.fx.timer(
        u.extend(V, {
          elem: s,
          anim: X,
          queue: X.opts.queue
        })
      ), X.progress(X.opts.progress).done(X.opts.done, X.opts.complete).fail(X.opts.fail).always(X.opts.always);
    }
    u.Animation = u.extend(Xt, {
      tweeners: {
        "*": [function(s, d) {
          var w = this.createTween(s, d);
          return mA(w.elem, s, zA.exec(d), w), w;
        }]
      },
      tweener: function(s, d) {
        u.isFunction(s) ? (d = s, s = ["*"]) : s = s.match(fA);
        for (var w, y = 0, E = s.length; y < E; y++)
          w = s[y], Xt.tweeners[w] = Xt.tweeners[w] || [], Xt.tweeners[w].unshift(d);
      },
      prefilters: [uu],
      prefilter: function(s, d) {
        d ? Xt.prefilters.unshift(s) : Xt.prefilters.push(s);
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
        return this.filter(oA).css("opacity", 0).show().end().animate({ opacity: d }, s, w, y);
      },
      animate: function(s, d, w, y) {
        var E = u.isEmptyObject(s), b = u.speed(d, w, y), I = function() {
          var P = Xt(this, u.extend({}, s), b);
          (E || u._data(this, "finish")) && P.stop(!0);
        };
        return I.finish = I, E || b.queue === !1 ? this.each(I) : this.queue(b.queue, I);
      },
      stop: function(s, d, w) {
        var y = function(E) {
          var b = E.stop;
          delete E.stop, b(w);
        };
        return typeof s != "string" && (w = d, d = s, s = void 0), d && s !== !1 && this.queue(s || "fx", []), this.each(function() {
          var E = !0, b = s != null && s + "queueHooks", I = u.timers, P = u._data(this);
          if (b)
            P[b] && P[b].stop && y(P[b]);
          else
            for (b in P)
              P[b] && P[b].stop && ou.test(b) && y(P[b]);
          for (b = I.length; b--; )
            I[b].elem === this && (s == null || I[b].queue === s) && (I[b].anim.stop(w), E = !1, I.splice(b, 1));
          (E || !w) && u.dequeue(this, s);
        });
      },
      finish: function(s) {
        return s !== !1 && (s = s || "fx"), this.each(function() {
          var d, w = u._data(this), y = w[s + "queue"], E = w[s + "queueHooks"], b = u.timers, I = y ? y.length : 0;
          for (w.finish = !0, u.queue(this, s, []), E && E.stop && E.stop.call(this, !0), d = b.length; d--; )
            b[d].elem === this && b[d].queue === s && (b[d].anim.stop(!0), b.splice(d, 1));
          for (d = 0; d < I; d++)
            y[d] && y[d].finish && y[d].finish.call(this);
          delete w.finish;
        });
      }
    }), u.each(["toggle", "show", "hide"], function(s, d) {
      var w = u.fn[d];
      u.fn[d] = function(y, E, b) {
        return y == null || typeof y == "boolean" ? w.apply(this, arguments) : this.animate(Zr(d, !0), y, E, b);
      };
    }), u.each({
      slideDown: Zr("show"),
      slideUp: Zr("hide"),
      slideToggle: Zr("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(s, d) {
      u.fn[s] = function(w, y, E) {
        return this.animate(d, w, y, E);
      };
    }), u.timers = [], u.fx.tick = function() {
      var s, d = u.timers, w = 0;
      for (Yr = u.now(); w < d.length; w++)
        s = d[w], !s() && d[w] === s && d.splice(w--, 1);
      d.length || u.fx.stop(), Yr = void 0;
    }, u.fx.timer = function(s) {
      u.timers.push(s), s() ? u.fx.start() : u.timers.pop();
    }, u.fx.interval = 13, u.fx.start = function() {
      ga || (ga = e.setInterval(u.fx.tick, u.fx.interval));
    }, u.fx.stop = function() {
      e.clearInterval(ga), ga = null;
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
    var ef = /\r/g, lu = /[\x20\t\r\n\f]+/g;
    u.fn.extend({
      val: function(s) {
        var d, w, y, E = this[0];
        return arguments.length ? (y = u.isFunction(s), this.each(function(b) {
          var I;
          this.nodeType === 1 && (y ? I = s.call(this, b, u(this).val()) : I = s, I == null ? I = "" : typeof I == "number" ? I += "" : u.isArray(I) && (I = u.map(I, function(P) {
            return P == null ? "" : P + "";
          })), d = u.valHooks[this.type] || u.valHooks[this.nodeName.toLowerCase()], (!d || !("set" in d) || d.set(this, I, "value") === void 0) && (this.value = I));
        })) : E ? (d = u.valHooks[E.type] || u.valHooks[E.nodeName.toLowerCase()], d && "get" in d && (w = d.get(E, "value")) !== void 0 ? w : (w = E.value, typeof w == "string" ? (
          // handle most common string cases
          w.replace(ef, "")
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
            u.trim(u.text(s)).replace(lu, " ");
          }
        },
        select: {
          get: function(s) {
            for (var d, w, y = s.options, E = s.selectedIndex, b = s.type === "select-one" || E < 0, I = b ? null : [], P = b ? E + 1 : y.length, V = E < 0 ? P : b ? E : 0; V < P; V++)
              if (w = y[V], (w.selected || V === E) && // Don't return options that are disabled or in a disabled optgroup
              (g.optDisabled ? !w.disabled : w.getAttribute("disabled") === null) && (!w.parentNode.disabled || !u.nodeName(w.parentNode, "optgroup"))) {
                if (d = u(w).val(), b)
                  return d;
                I.push(d);
              }
            return I;
          },
          set: function(s, d) {
            for (var w, y, E = s.options, b = u.makeArray(d), I = E.length; I--; )
              if (y = E[I], u.inArray(u.valHooks.option.get(y), b) > -1)
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
    var Cr, wa, In = u.expr.attrHandle, ma = /^(?:checked|selected)$/i, Hn = g.getSetAttribute, Ai = g.input;
    u.fn.extend({
      attr: function(s, d) {
        return EA(this, u.attr, s, d, arguments.length > 1);
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
          if ((b !== 1 || !u.isXMLDoc(s)) && (d = d.toLowerCase(), E = u.attrHooks[d] || (u.expr.match.bool.test(d) ? wa : Cr)), w !== void 0) {
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
        var w, y, E = 0, b = d && d.match(fA);
        if (b && s.nodeType === 1)
          for (; w = b[E++]; )
            y = u.propFix[w] || w, u.expr.match.bool.test(w) ? Ai && Hn || !ma.test(w) ? s[y] = !1 : s[u.camelCase("default-" + w)] = s[y] = !1 : u.attr(s, w, ""), s.removeAttribute(Hn ? w : y);
      }
    }), wa = {
      set: function(s, d, w) {
        return d === !1 ? u.removeAttr(s, w) : Ai && Hn || !ma.test(w) ? s.setAttribute(!Hn && u.propFix[w] || w, w) : s[u.camelCase("default-" + w)] = s[w] = !0, w;
      }
    }, u.each(u.expr.match.bool.source.match(/\w+/g), function(s, d) {
      var w = In[d] || u.find.attr;
      Ai && Hn || !ma.test(d) ? In[d] = function(y, E, b) {
        var I, P;
        return b || (P = In[E], In[E] = I, I = w(y, E, b) != null ? E.toLowerCase() : null, In[E] = P), I;
      } : In[d] = function(y, E, b) {
        if (!b)
          return y[u.camelCase("default-" + E)] ? E.toLowerCase() : null;
      };
    }), (!Ai || !Hn) && (u.attrHooks.value = {
      set: function(s, d, w) {
        if (u.nodeName(s, "input"))
          s.defaultValue = d;
        else
          return Cr && Cr.set(s, d, w);
      }
    }), Hn || (Cr = {
      set: function(s, d, w) {
        var y = s.getAttributeNode(w);
        if (y || s.setAttributeNode(
          y = s.ownerDocument.createAttribute(w)
        ), y.value = d += "", w === "value" || d === s.getAttribute(w))
          return d;
      }
    }, In.id = In.name = In.coords = function(s, d, w) {
      var y;
      if (!w)
        return (y = s.getAttributeNode(d)) && y.value !== "" ? y.value : null;
    }, u.valHooks.button = {
      get: function(s, d) {
        var w = s.getAttributeNode(d);
        if (w && w.specified)
          return w.value;
      },
      set: Cr.set
    }, u.attrHooks.contenteditable = {
      set: function(s, d, w) {
        Cr.set(s, d === "" ? !1 : d, w);
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
    var ei = /^(?:input|select|textarea|button|object)$/i, cu = /^(?:a|area)$/i;
    u.fn.extend({
      prop: function(s, d) {
        return EA(this, u.prop, s, d, arguments.length > 1);
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
            return d ? parseInt(d, 10) : ei.test(s.nodeName) || cu.test(s.nodeName) && s.href ? 0 : -1;
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
    var va = /[\t\r\n\f]/g;
    function Qr(s) {
      return u.attr(s, "class") || "";
    }
    u.fn.extend({
      addClass: function(s) {
        var d, w, y, E, b, I, P, V = 0;
        if (u.isFunction(s))
          return this.each(function(X) {
            u(this).addClass(s.call(this, X, Qr(this)));
          });
        if (typeof s == "string" && s) {
          for (d = s.match(fA) || []; w = this[V++]; )
            if (E = Qr(w), y = w.nodeType === 1 && (" " + E + " ").replace(va, " "), y) {
              for (I = 0; b = d[I++]; )
                y.indexOf(" " + b + " ") < 0 && (y += b + " ");
              P = u.trim(y), E !== P && u.attr(w, "class", P);
            }
        }
        return this;
      },
      removeClass: function(s) {
        var d, w, y, E, b, I, P, V = 0;
        if (u.isFunction(s))
          return this.each(function(X) {
            u(this).removeClass(s.call(this, X, Qr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof s == "string" && s) {
          for (d = s.match(fA) || []; w = this[V++]; )
            if (E = Qr(w), y = w.nodeType === 1 && (" " + E + " ").replace(va, " "), y) {
              for (I = 0; b = d[I++]; )
                for (; y.indexOf(" " + b + " ") > -1; )
                  y = y.replace(" " + b + " ", " ");
              P = u.trim(y), E !== P && u.attr(w, "class", P);
            }
        }
        return this;
      },
      toggleClass: function(s, d) {
        var w = typeof s;
        return typeof d == "boolean" && w === "string" ? d ? this.addClass(s) : this.removeClass(s) : u.isFunction(s) ? this.each(function(y) {
          u(this).toggleClass(
            s.call(this, y, Qr(this), d),
            d
          );
        }) : this.each(function() {
          var y, E, b, I;
          if (w === "string")
            for (E = 0, b = u(this), I = s.match(fA) || []; y = I[E++]; )
              b.hasClass(y) ? b.removeClass(y) : b.addClass(y);
          else (s === void 0 || w === "boolean") && (y = Qr(this), y && u._data(this, "__className__", y), u.attr(
            this,
            "class",
            y || s === !1 ? "" : u._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(s) {
        var d, w, y = 0;
        for (d = " " + s + " "; w = this[y++]; )
          if (w.nodeType === 1 && (" " + Qr(w) + " ").replace(va, " ").indexOf(d) > -1)
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
    var fu = e.location, ya = u.now(), Ca = /\?/, hu = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    u.parseJSON = function(s) {
      if (e.JSON && e.JSON.parse)
        return e.JSON.parse(s + "");
      var d, w = null, y = u.trim(s + "");
      return y && !u.trim(y.replace(hu, function(E, b, I, P) {
        return d && b && (w = 0), w === 0 ? E : (d = I || b, w += !P - !I, "");
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
    var tf = /#.*$/, du = /([?&])_=[^&]*/, nf = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, pu = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rf = /^(?:GET|HEAD)$/, af = /^\/\//, gu = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Bu = {}, Ti = {}, wu = "*/".concat("*"), bo = fu.href, ti = gu.exec(bo.toLowerCase()) || [];
    function mu(s) {
      return function(d, w) {
        typeof d != "string" && (w = d, d = "*");
        var y, E = 0, b = d.toLowerCase().match(fA) || [];
        if (u.isFunction(w))
          for (; y = b[E++]; )
            y.charAt(0) === "+" ? (y = y.slice(1) || "*", (s[y] = s[y] || []).unshift(w)) : (s[y] = s[y] || []).push(w);
      };
    }
    function vu(s, d, w, y) {
      var E = {}, b = s === Ti;
      function I(P) {
        var V;
        return E[P] = !0, u.each(s[P] || [], function(X, Z) {
          var wA = Z(d, w, y);
          if (typeof wA == "string" && !b && !E[wA])
            return d.dataTypes.unshift(wA), I(wA), !1;
          if (b)
            return !(V = wA);
        }), V;
      }
      return I(d.dataTypes[0]) || !E["*"] && I("*");
    }
    function Ne(s, d) {
      var w, y, E = u.ajaxSettings.flatOptions || {};
      for (y in d)
        d[y] !== void 0 && ((E[y] ? s : w || (w = {}))[y] = d[y]);
      return w && u.extend(!0, s, w), s;
    }
    function Pe(s, d, w) {
      for (var y, E, b, I, P = s.contents, V = s.dataTypes; V[0] === "*"; )
        V.shift(), E === void 0 && (E = s.mimeType || d.getResponseHeader("Content-Type"));
      if (E) {
        for (I in P)
          if (P[I] && P[I].test(E)) {
            V.unshift(I);
            break;
          }
      }
      if (V[0] in w)
        b = V[0];
      else {
        for (I in w) {
          if (!V[0] || s.converters[I + " " + V[0]]) {
            b = I;
            break;
          }
          y || (y = I);
        }
        b = b || y;
      }
      if (b)
        return b !== V[0] && V.unshift(b), w[b];
    }
    function of(s, d, w, y) {
      var E, b, I, P, V, X = {}, Z = s.dataTypes.slice();
      if (Z[1])
        for (I in s.converters)
          X[I.toLowerCase()] = s.converters[I];
      for (b = Z.shift(); b; )
        if (s.responseFields[b] && (w[s.responseFields[b]] = d), !V && y && s.dataFilter && (d = s.dataFilter(d, s.dataType)), V = b, b = Z.shift(), b) {
          if (b === "*")
            b = V;
          else if (V !== "*" && V !== b) {
            if (I = X[V + " " + b] || X["* " + b], !I) {
              for (E in X)
                if (P = E.split(" "), P[1] === b && (I = X[V + " " + P[0]] || X["* " + P[0]], I)) {
                  I === !0 ? I = X[E] : X[E] !== !0 && (b = P[0], Z.unshift(P[1]));
                  break;
                }
            }
            if (I !== !0)
              if (I && s.throws)
                d = I(d);
              else
                try {
                  d = I(d);
                } catch (wA) {
                  return {
                    state: "parsererror",
                    error: I ? wA : "No conversion from " + V + " to " + b
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
        url: bo,
        type: "GET",
        isLocal: pu.test(ti[1]),
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
          "*": wu,
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
          Ne(Ne(s, u.ajaxSettings), d)
        ) : (
          // Extending ajaxSettings
          Ne(u.ajaxSettings, s)
        );
      },
      ajaxPrefilter: mu(Bu),
      ajaxTransport: mu(Ti),
      // Main method
      ajax: function(s, d) {
        typeof s == "object" && (d = s, s = void 0), d = d || {};
        var w, y, E, b, I, P, V, X, Z = u.ajaxSetup({}, d), wA = Z.context || Z, HA = Z.context && (wA.nodeType || wA.jquery) ? u(wA) : u.event, vA = u.Deferred(), re = u.Callbacks("once memory"), jA = Z.statusCode || {}, se = {}, dt = {}, ze = 0, Zn = "canceled", PA = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(ue) {
            var Xe;
            if (ze === 2) {
              if (!X)
                for (X = {}; Xe = nf.exec(b); )
                  X[Xe[1].toLowerCase()] = Xe[2];
              Xe = X[ue.toLowerCase()];
            }
            return Xe ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return ze === 2 ? b : null;
          },
          // Caches the header
          setRequestHeader: function(ue, Xe) {
            var Sn = ue.toLowerCase();
            return ze || (ue = dt[Sn] = dt[Sn] || ue, se[ue] = Xe), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(ue) {
            return ze || (Z.mimeType = ue), this;
          },
          // Status-dependent callbacks
          statusCode: function(ue) {
            var Xe;
            if (ue)
              if (ze < 2)
                for (Xe in ue)
                  jA[Xe] = [jA[Xe], ue[Xe]];
              else
                PA.always(ue[PA.status]);
            return this;
          },
          // Cancel the request
          abort: function(ue) {
            var Xe = ue || Zn;
            return V && V.abort(Xe), lt(0, Xe), this;
          }
        };
        if (vA.promise(PA).complete = re.add, PA.success = PA.done, PA.error = PA.fail, Z.url = ((s || Z.url || bo) + "").replace(tf, "").replace(af, ti[1] + "//"), Z.type = d.method || d.type || Z.method || Z.type, Z.dataTypes = u.trim(Z.dataType || "*").toLowerCase().match(fA) || [""], Z.crossDomain == null && (w = gu.exec(Z.url.toLowerCase()), Z.crossDomain = !!(w && (w[1] !== ti[1] || w[2] !== ti[2] || (w[3] || (w[1] === "http:" ? "80" : "443")) !== (ti[3] || (ti[1] === "http:" ? "80" : "443"))))), Z.data && Z.processData && typeof Z.data != "string" && (Z.data = u.param(Z.data, Z.traditional)), vu(Bu, Z, d, PA), ze === 2)
          return PA;
        P = u.event && Z.global, P && u.active++ === 0 && u.event.trigger("ajaxStart"), Z.type = Z.type.toUpperCase(), Z.hasContent = !rf.test(Z.type), E = Z.url, Z.hasContent || (Z.data && (E = Z.url += (Ca.test(E) ? "&" : "?") + Z.data, delete Z.data), Z.cache === !1 && (Z.url = du.test(E) ? (
          // If there is already a '_' parameter, set its value
          E.replace(du, "$1_=" + ya++)
        ) : (
          // Otherwise add one to the end
          E + (Ca.test(E) ? "&" : "?") + "_=" + ya++
        ))), Z.ifModified && (u.lastModified[E] && PA.setRequestHeader("If-Modified-Since", u.lastModified[E]), u.etag[E] && PA.setRequestHeader("If-None-Match", u.etag[E])), (Z.data && Z.hasContent && Z.contentType !== !1 || d.contentType) && PA.setRequestHeader("Content-Type", Z.contentType), PA.setRequestHeader(
          "Accept",
          Z.dataTypes[0] && Z.accepts[Z.dataTypes[0]] ? Z.accepts[Z.dataTypes[0]] + (Z.dataTypes[0] !== "*" ? ", " + wu + "; q=0.01" : "") : Z.accepts["*"]
        );
        for (y in Z.headers)
          PA.setRequestHeader(y, Z.headers[y]);
        if (Z.beforeSend && (Z.beforeSend.call(wA, PA, Z) === !1 || ze === 2))
          return PA.abort();
        Zn = "abort";
        for (y in { success: 1, error: 1, complete: 1 })
          PA[y](Z[y]);
        if (V = vu(Ti, Z, d, PA), !V)
          lt(-1, "No Transport");
        else {
          if (PA.readyState = 1, P && HA.trigger("ajaxSend", [PA, Z]), ze === 2)
            return PA;
          Z.async && Z.timeout > 0 && (I = e.setTimeout(function() {
            PA.abort("timeout");
          }, Z.timeout));
          try {
            ze = 1, V.send(se, lt);
          } catch (ue) {
            if (ze < 2)
              lt(-1, ue);
            else
              throw ue;
          }
        }
        function lt(ue, Xe, Sn, Fa) {
          var It, Ln, Ar, Tn, Ke, Ht = Xe;
          ze !== 2 && (ze = 2, I && e.clearTimeout(I), V = void 0, b = Fa || "", PA.readyState = ue > 0 ? 4 : 0, It = ue >= 200 && ue < 300 || ue === 304, Sn && (Tn = Pe(Z, PA, Sn)), Tn = of(Z, Tn, PA, It), It ? (Z.ifModified && (Ke = PA.getResponseHeader("Last-Modified"), Ke && (u.lastModified[E] = Ke), Ke = PA.getResponseHeader("etag"), Ke && (u.etag[E] = Ke)), ue === 204 || Z.type === "HEAD" ? Ht = "nocontent" : ue === 304 ? Ht = "notmodified" : (Ht = Tn.state, Ln = Tn.data, Ar = Tn.error, It = !Ar)) : (Ar = Ht, (ue || !Ht) && (Ht = "error", ue < 0 && (ue = 0))), PA.status = ue, PA.statusText = (Xe || Ht) + "", It ? vA.resolveWith(wA, [Ln, Ht, PA]) : vA.rejectWith(wA, [PA, Ht, Ar]), PA.statusCode(jA), jA = void 0, P && HA.trigger(
            It ? "ajaxSuccess" : "ajaxError",
            [PA, Z, It ? Ln : Ar]
          ), re.fireWith(wA, [PA, Ht]), P && (HA.trigger("ajaxComplete", [PA, Z]), --u.active || u.event.trigger("ajaxStop")));
        }
        return PA;
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
    function sf(s) {
      return s.style && s.style.display || u.css(s, "display");
    }
    function uf(s) {
      if (!u.contains(s.ownerDocument || i, s))
        return !0;
      for (; s && s.nodeType === 1; ) {
        if (sf(s) === "none" || s.type === "hidden")
          return !0;
        s = s.parentNode;
      }
      return !1;
    }
    u.expr.filters.hidden = function(s) {
      return g.reliableHiddenOffsets() ? s.offsetWidth <= 0 && s.offsetHeight <= 0 && !s.getClientRects().length : uf(s);
    }, u.expr.filters.visible = function(s) {
      return !u.expr.filters.hidden(s);
    };
    var lf = /%20/g, cf = /\[\]$/, yu = /\r?\n/g, Cu = /^(?:submit|button|image|reset|file)$/i, ff = /^(?:input|select|textarea|keygen)/i;
    function At(s, d, w, y) {
      var E;
      if (u.isArray(d))
        u.each(d, function(b, I) {
          w || cf.test(s) ? y(s, I) : At(
            s + "[" + (typeof I == "object" && I != null ? b : "") + "]",
            I,
            w,
            y
          );
        });
      else if (!w && u.type(d) === "object")
        for (E in d)
          At(s + "[" + E + "]", d[E], w, y);
      else
        y(s, d);
    }
    u.param = function(s, d) {
      var w, y = [], E = function(b, I) {
        I = u.isFunction(I) ? I() : I ?? "", y[y.length] = encodeURIComponent(b) + "=" + encodeURIComponent(I);
      };
      if (d === void 0 && (d = u.ajaxSettings && u.ajaxSettings.traditional), u.isArray(s) || s.jquery && !u.isPlainObject(s))
        u.each(s, function() {
          E(this.name, this.value);
        });
      else
        for (w in s)
          At(w, s[w], d, E);
      return y.join("&").replace(lf, "+");
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
          return this.name && !u(this).is(":disabled") && ff.test(this.nodeName) && !Cu.test(s) && (this.checked || !ee.test(s));
        }).map(function(s, d) {
          var w = u(this).val();
          return w == null ? null : u.isArray(w) ? u.map(w, function(y) {
            return { name: d.name, value: y.replace(yu, `\r
`) };
          }) : { name: d.name, value: w.replace(yu, `\r
`) };
        }).get();
      }
    }), u.ajaxSettings.xhr = e.ActiveXObject !== void 0 ? (
      // Support: IE6-IE8
      function() {
        return this.isLocal ? Pt() : i.documentMode > 8 ? Di() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Di() || Pt();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      Di
    );
    var _o = 0, dn = {}, ni = u.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
      for (var s in dn)
        dn[s](void 0, !0);
    }), g.cors = !!ni && "withCredentials" in ni, ni = g.ajax = !!ni, ni && u.ajaxTransport(function(s) {
      if (!s.crossDomain || g.cors) {
        var d;
        return {
          send: function(w, y) {
            var E, b = s.xhr(), I = ++_o;
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
            b.send(s.hasContent && s.data || null), d = function(P, V) {
              var X, Z, wA;
              if (d && (V || b.readyState === 4))
                if (delete dn[I], d = void 0, b.onreadystatechange = u.noop, V)
                  b.readyState !== 4 && b.abort();
                else {
                  wA = {}, X = b.status, typeof b.responseText == "string" && (wA.text = b.responseText);
                  try {
                    Z = b.statusText;
                  } catch {
                    Z = "";
                  }
                  !X && s.isLocal && !s.crossDomain ? X = wA.text ? 200 : 404 : X === 1223 && (X = 204);
                }
              wA && y(X, Z, wA, b.getAllResponseHeaders());
            }, s.async ? b.readyState === 4 ? e.setTimeout(d) : b.onreadystatechange = dn[I] = d : d();
          },
          abort: function() {
            d && d(void 0, !0);
          }
        };
      }
    });
    function Di() {
      try {
        return new e.XMLHttpRequest();
      } catch {
      }
    }
    function Pt() {
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
            d = i.createElement("script"), d.async = !0, s.scriptCharset && (d.charset = s.scriptCharset), d.src = s.url, d.onload = d.onreadystatechange = function(b, I) {
              (I || !d.readyState || /loaded|complete/.test(d.readyState)) && (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), d = null, I || E(200, "success"));
            }, w.insertBefore(d, w.firstChild);
          },
          abort: function() {
            d && d.onload(void 0, !0);
          }
        };
      }
    });
    var xo = [], Qa = /(=)\?(?=&|$)|\?\?/;
    u.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var s = xo.pop() || u.expando + "_" + ya++;
        return this[s] = !0, s;
      }
    }), u.ajaxPrefilter("json jsonp", function(s, d, w) {
      var y, E, b, I = s.jsonp !== !1 && (Qa.test(s.url) ? "url" : typeof s.data == "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Qa.test(s.data) && "data");
      if (I || s.dataTypes[0] === "jsonp")
        return y = s.jsonpCallback = u.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, I ? s[I] = s[I].replace(Qa, "$1" + y) : s.jsonp !== !1 && (s.url += (Ca.test(s.url) ? "&" : "?") + s.jsonp + "=" + y), s.converters["script json"] = function() {
          return b || u.error(y + " was not called"), b[0];
        }, s.dataTypes[0] = "json", E = e[y], e[y] = function() {
          b = arguments;
        }, w.always(function() {
          E === void 0 ? u(e).removeProp(y) : e[y] = E, s[y] && (s.jsonpCallback = d.jsonpCallback, xo.push(y)), b && u.isFunction(E) && E(b[0]), b = E = void 0;
        }), "script";
    }), u.parseHTML = function(s, d, w) {
      if (!s || typeof s != "string")
        return null;
      typeof d == "boolean" && (w = d, d = !1), d = d || i;
      var y = cA.exec(s), E = !w && [];
      return y ? [d.createElement(y[1])] : (y = wt([s], d, E), E && E.length && u(E).remove(), u.merge([], y.childNodes));
    };
    var Io = u.fn.load;
    u.fn.load = function(s, d, w) {
      if (typeof s != "string" && Io)
        return Io.apply(this, arguments);
      var y, E, b, I = this, P = s.indexOf(" ");
      return P > -1 && (y = u.trim(s.slice(P, s.length)), s = s.slice(0, P)), u.isFunction(d) ? (w = d, d = void 0) : d && typeof d == "object" && (E = "POST"), I.length > 0 && u.ajax({
        url: s,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: E || "GET",
        dataType: "html",
        data: d
      }).done(function(V) {
        b = arguments, I.html(y ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          u("<div>").append(u.parseHTML(V)).find(y)
        ) : (
          // Otherwise use the full result
          V
        ));
      }).always(w && function(V, X) {
        I.each(function() {
          w.apply(this, b || [V.responseText, X, V]);
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
    function Ho(s) {
      return u.isWindow(s) ? s : s.nodeType === 9 ? s.defaultView || s.parentWindow : !1;
    }
    u.offset = {
      setOffset: function(s, d, w) {
        var y, E, b, I, P, V, X, Z = u.css(s, "position"), wA = u(s), HA = {};
        Z === "static" && (s.style.position = "relative"), P = wA.offset(), b = u.css(s, "top"), V = u.css(s, "left"), X = (Z === "absolute" || Z === "fixed") && u.inArray("auto", [b, V]) > -1, X ? (y = wA.position(), I = y.top, E = y.left) : (I = parseFloat(b) || 0, E = parseFloat(V) || 0), u.isFunction(d) && (d = d.call(s, w, u.extend({}, P))), d.top != null && (HA.top = d.top - P.top + I), d.left != null && (HA.left = d.left - P.left + E), "using" in d ? d.using.call(s, HA) : wA.css(HA);
      }
    }, u.fn.extend({
      offset: function(s) {
        if (arguments.length)
          return s === void 0 ? this : this.each(function(I) {
            u.offset.setOffset(this, s, I);
          });
        var d, w, y = { top: 0, left: 0 }, E = this[0], b = E && E.ownerDocument;
        if (b)
          return d = b.documentElement, u.contains(d, E) ? (typeof E.getBoundingClientRect < "u" && (y = E.getBoundingClientRect()), w = Ho(b), {
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
          return s || eu;
        });
      }
    }), u.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(s, d) {
      var w = /Y/.test(d);
      u.fn[s] = function(y) {
        return EA(this, function(E, b, I) {
          var P = Ho(E);
          if (I === void 0)
            return P ? d in P ? P[d] : P.document.documentElement[b] : E[b];
          P ? P.scrollTo(
            w ? u(P).scrollLeft() : I,
            w ? I : u(P).scrollTop()
          ) : E[b] = I;
        }, s, y, arguments.length, null);
      };
    }), u.each(["top", "left"], function(s, d) {
      u.cssHooks[d] = yo(
        g.pixelPosition,
        function(w, y) {
          if (y)
            return y = Yn(w, d), da.test(y) ? u(w).position()[d] + "px" : y;
        }
      );
    }), u.each({ Height: "height", Width: "width" }, function(s, d) {
      u.each(
        { padding: "inner" + s, content: d, "": "outer" + s },
        function(w, y) {
          u.fn[y] = function(E, b) {
            var I = arguments.length && (w || typeof E != "boolean"), P = w || (E === !0 || b === !0 ? "margin" : "border");
            return EA(this, function(V, X, Z) {
              var wA;
              return u.isWindow(V) ? V.document.documentElement["client" + s] : V.nodeType === 9 ? (wA = V.documentElement, Math.max(
                V.body["scroll" + s],
                wA["scroll" + s],
                V.body["offset" + s],
                wA["offset" + s],
                wA["client" + s]
              )) : Z === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                u.css(V, X, P)
              ) : (
                // Set width or height on the element
                u.style(V, X, Z, P)
              );
            }, d, I ? E : void 0, I, null);
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
    var Qu = e.jQuery, Fu = e.$;
    return u.noConflict = function(s) {
      return e.$ === u && (e.$ = Fu), s && e.jQuery === u && (e.jQuery = Qu), u;
    }, t || (e.jQuery = e.$ = u), u;
  });
})(S0);
var _O = S0.exports;
const ae = /* @__PURE__ */ xc(_O), xO = function(A) {
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
  }, t = He.merge({}, e, A), n = function(o) {
    return o < 1e3 ? o : o < 1e6 ? (o / 1e3).toFixed(1) + "Kb" : (o / 1e6).toFixed(1) + "Mb";
  };
  function i(o) {
    o.each(function(l) {
      var f = VA(this).selectAll(".chromosome-label").data([l]), c = f.enter().append("g").attr("class", "chromosome-label");
      c.append("text"), t.border && c.append("rect").classed("border", !0), VA(this).selectAll(".chromosome-label").attr("transform", function(g) {
        return "translate(" + t.layout.x + "," + t.layout.y + ")";
      }), VA(this).selectAll(".chromosome-label").selectAll("text").attr("x", t.layout.width * 0.5).attr("y", t.layout.height * 0.5).style(
        "font-size",
        Math.max(14 / t.scale, t.layout.chromosomeWidth * 1.2) + "px"
      ).text(l.number).on("click", t.onLabelSelectFunction), t.border && f.select("rect").attr("width", t.layout.width).attr("height", t.layout.height), f.exit().remove();
      var h = VA(this).selectAll(".chromosome-size-label").data([l]);
      c = h.enter().append("g").attr("class", "chromosome-size-label"), c.append("text");
      var m = 10 + t.sizeLayout.y + t.sizeLayout.cellHeight * l.length / t.longestChromosome, B = 1.2 * t.labelSize / Math.min(5, t.scale) + "px";
      VA(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + t.sizeLayout.x + "," + m + ")"
      ), h = VA(this).selectAll(".chromosome-size-label").select("text").attr("x", t.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", B).text(n(l.length)), h.exit().remove();
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
}, IO = function(A) {
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
    onAnnotationSelectFunction: ae.noop(),
    drawing: null
  }, t = He.merge({}, e, A), n = function() {
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h) {
    var m = n(), B = m(h.length), g = VA(this);
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
      var O = g.selectAll("rect.selection").data(u);
      O.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), O.attr("x", 0).attr("y", function(_) {
        return Math.min(_.start, _.end);
      }).attr("width", t.layout.width).attr("height", function(_) {
        return Math.abs(_.end - _.start);
      }), O.exit().remove();
    }, F = lT().on("start", function(O) {
      var _ = Gn(O, this);
      u.push({
        start: _[1],
        end: _[1]
      }), C(), O.sourceEvent.stopPropagation();
    }).on("drag", function(O) {
      u[0].end = Gn(O, this)[1], C(), O.sourceEvent.stopPropagation(), O.sourceEvent.preventDefault();
    }).on("end", function(O) {
      O.sourceEvent.stopPropagation();
      var _ = m.invert(u[0].start), M = m.invert(u[0].end);
      if (_ > M) {
        var K = _;
        _ = M, M = K;
      }
      var z = h.layout.geneBandNodes.filter(function(cA) {
        return cA.data.midpoint > _ && cA.data.midpoint < M;
      });
      z.forEach(function(cA) {
        cA.data.type == "gene" ? cA.data.visible = !0 : cA.data.type == "geneslist" && cA.data.genesList.forEach(function(sA) {
          sA.visible = !0;
        });
      }), t.onAnnotationSelectFunction(), u = [], C();
    });
    g.select("rect.background").call(F), t.border && g.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
    var U = g.select(".bands_container"), H;
    t.bands == "basemap" ? H = o : t.bands == "genes" && (H = f), H(U, h), g.select(".bands_container").style("mask", "url(#chromosome_mask_" + h.number + ")");
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
      VA(this).attr("y", F.y).attr("height", F.height).attr("fill", F.fill).attr("width", F.width).attr("fill-opacity", F["fill-opacity"]).attr("stroke-dasharray", F["stroke-dasharray"]).attr("stroke-width", F["stroke-width"]);
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
    h.each(function(m) {
      var B = VA(this).selectAll(".chromosome").data([m]), g = B.enter().append("g").attr("class", "chromosome");
      g.append("defs"), g.append("rect").classed("background", !0), g.append("g").classed("bands_container", !0), g.append("rect").classed("outline", !0), t.border && g.append("rect").classed("border", !0), VA(this).selectAll(".chromosome").each(i), B.exit().remove();
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
var tn = "top", En = "bottom", bn = "right", nn = "left", $p = "auto", Ws = [tn, En, bn, nn], uo = "start", Ts = "end", HO = "clippingParents", L0 = "viewport", As = "popper", SO = "reference", Mw = /* @__PURE__ */ Ws.reduce(function(A, e) {
  return A.concat([e + "-" + uo, e + "-" + Ts]);
}, []), T0 = /* @__PURE__ */ [].concat(Ws, [$p]).reduce(function(A, e) {
  return A.concat([e, e + "-" + uo, e + "-" + Ts]);
}, []), LO = "beforeRead", TO = "read", DO = "afterRead", OO = "beforeMain", NO = "main", MO = "afterMain", PO = "beforeWrite", KO = "write", RO = "afterWrite", kO = [LO, TO, DO, OO, NO, MO, PO, KO, RO];
function dr(A) {
  return A ? (A.nodeName || "").toLowerCase() : null;
}
function cn(A) {
  if (A == null)
    return window;
  if (A.toString() !== "[object Window]") {
    var e = A.ownerDocument;
    return e && e.defaultView || window;
  }
  return A;
}
function la(A) {
  var e = cn(A).Element;
  return A instanceof e || A instanceof Element;
}
function Un(A) {
  var e = cn(A).HTMLElement;
  return A instanceof e || A instanceof HTMLElement;
}
function Gp(A) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = cn(A).ShadowRoot;
  return A instanceof e || A instanceof ShadowRoot;
}
function $O(A) {
  var e = A.state;
  Object.keys(e.elements).forEach(function(t) {
    var n = e.styles[t] || {}, i = e.attributes[t] || {}, o = e.elements[t];
    !Un(o) || !dr(o) || (Object.assign(o.style, n), Object.keys(i).forEach(function(l) {
      var f = i[l];
      f === !1 ? o.removeAttribute(l) : o.setAttribute(l, f === !0 ? "" : f);
    }));
  });
}
function GO(A) {
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
      !Un(i) || !dr(i) || (Object.assign(i.style, f), Object.keys(o).forEach(function(c) {
        i.removeAttribute(c);
      }));
    });
  };
}
const D0 = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: $O,
  effect: GO,
  requires: ["computeStyles"]
};
function hr(A) {
  return A.split("-")[0];
}
var na = Math.max, Bc = Math.min, lo = Math.round;
function cd() {
  var A = navigator.userAgentData;
  return A != null && A.brands && Array.isArray(A.brands) ? A.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function O0() {
  return !/^((?!chrome|android).)*safari/i.test(cd());
}
function co(A, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var n = A.getBoundingClientRect(), i = 1, o = 1;
  e && Un(A) && (i = A.offsetWidth > 0 && lo(n.width) / A.offsetWidth || 1, o = A.offsetHeight > 0 && lo(n.height) / A.offsetHeight || 1);
  var l = la(A) ? cn(A) : window, f = l.visualViewport, c = !O0() && t, h = (n.left + (c && f ? f.offsetLeft : 0)) / i, m = (n.top + (c && f ? f.offsetTop : 0)) / o, B = n.width / i, g = n.height / o;
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
function Vp(A) {
  var e = co(A), t = A.offsetWidth, n = A.offsetHeight;
  return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - n) <= 1 && (n = e.height), {
    x: A.offsetLeft,
    y: A.offsetTop,
    width: t,
    height: n
  };
}
function N0(A, e) {
  var t = e.getRootNode && e.getRootNode();
  if (A.contains(e))
    return !0;
  if (t && Gp(t)) {
    var n = e;
    do {
      if (n && A.isSameNode(n))
        return !0;
      n = n.parentNode || n.host;
    } while (n);
  }
  return !1;
}
function Wr(A) {
  return cn(A).getComputedStyle(A);
}
function VO(A) {
  return ["table", "td", "th"].indexOf(dr(A)) >= 0;
}
function bi(A) {
  return ((la(A) ? A.ownerDocument : (
    // $FlowFixMe[prop-missing]
    A.document
  )) || window.document).documentElement;
}
function Kc(A) {
  return dr(A) === "html" ? A : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    A.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    A.parentNode || // DOM Element detected
    (Gp(A) ? A.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    bi(A)
  );
}
function Pw(A) {
  return !Un(A) || // https://github.com/popperjs/popper-core/issues/837
  Wr(A).position === "fixed" ? null : A.offsetParent;
}
function WO(A) {
  var e = /firefox/i.test(cd()), t = /Trident/i.test(cd());
  if (t && Un(A)) {
    var n = Wr(A);
    if (n.position === "fixed")
      return null;
  }
  var i = Kc(A);
  for (Gp(i) && (i = i.host); Un(i) && ["html", "body"].indexOf(dr(i)) < 0; ) {
    var o = Wr(i);
    if (o.transform !== "none" || o.perspective !== "none" || o.contain === "paint" || ["transform", "perspective"].indexOf(o.willChange) !== -1 || e && o.willChange === "filter" || e && o.filter && o.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function Xs(A) {
  for (var e = cn(A), t = Pw(A); t && VO(t) && Wr(t).position === "static"; )
    t = Pw(t);
  return t && (dr(t) === "html" || dr(t) === "body" && Wr(t).position === "static") ? e : t || WO(A) || e;
}
function Wp(A) {
  return ["top", "bottom"].indexOf(A) >= 0 ? "x" : "y";
}
function ys(A, e, t) {
  return na(A, Bc(e, t));
}
function XO(A, e, t) {
  var n = ys(A, e, t);
  return n > t ? t : n;
}
function M0() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function P0(A) {
  return Object.assign({}, M0(), A);
}
function K0(A, e) {
  return e.reduce(function(t, n) {
    return t[n] = A, t;
  }, {});
}
var qO = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, P0(typeof e != "number" ? e : K0(e, Ws));
};
function zO(A) {
  var e, t = A.state, n = A.name, i = A.options, o = t.elements.arrow, l = t.modifiersData.popperOffsets, f = hr(t.placement), c = Wp(f), h = [nn, bn].indexOf(f) >= 0, m = h ? "height" : "width";
  if (!(!o || !l)) {
    var B = qO(i.padding, t), g = Vp(o), v = c === "y" ? tn : nn, u = c === "y" ? En : bn, C = t.rects.reference[m] + t.rects.reference[c] - l[c] - t.rects.popper[m], F = l[c] - t.rects.reference[c], U = Xs(o), H = U ? c === "y" ? U.clientHeight || 0 : U.clientWidth || 0 : 0, O = C / 2 - F / 2, _ = B[v], M = H - g[m] - B[u], K = H / 2 - g[m] / 2 + O, z = ys(_, K, M), cA = c;
    t.modifiersData[n] = (e = {}, e[cA] = z, e.centerOffset = z - K, e);
  }
}
function JO(A) {
  var e = A.state, t = A.options, n = t.element, i = n === void 0 ? "[data-popper-arrow]" : n;
  i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || N0(e.elements.popper, i) && (e.elements.arrow = i));
}
const jO = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: zO,
  effect: JO,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function fo(A) {
  return A.split("-")[1];
}
var YO = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function ZO(A, e) {
  var t = A.x, n = A.y, i = e.devicePixelRatio || 1;
  return {
    x: lo(t * i) / i || 0,
    y: lo(n * i) / i || 0
  };
}
function Kw(A) {
  var e, t = A.popper, n = A.popperRect, i = A.placement, o = A.variation, l = A.offsets, f = A.position, c = A.gpuAcceleration, h = A.adaptive, m = A.roundOffsets, B = A.isFixed, g = l.x, v = g === void 0 ? 0 : g, u = l.y, C = u === void 0 ? 0 : u, F = typeof m == "function" ? m({
    x: v,
    y: C
  }) : {
    x: v,
    y: C
  };
  v = F.x, C = F.y;
  var U = l.hasOwnProperty("x"), H = l.hasOwnProperty("y"), O = nn, _ = tn, M = window;
  if (h) {
    var K = Xs(t), z = "clientHeight", cA = "clientWidth";
    if (K === cn(t) && (K = bi(t), Wr(K).position !== "static" && f === "absolute" && (z = "scrollHeight", cA = "scrollWidth")), K = K, i === tn || (i === nn || i === bn) && o === Ts) {
      _ = En;
      var sA = B && K === M && M.visualViewport ? M.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        K[z]
      );
      C -= sA - n.height, C *= c ? 1 : -1;
    }
    if (i === nn || (i === tn || i === En) && o === Ts) {
      O = bn;
      var gA = B && K === M && M.visualViewport ? M.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        K[cA]
      );
      v -= gA - n.width, v *= c ? 1 : -1;
    }
  }
  var QA = Object.assign({
    position: f
  }, h && YO), OA = m === !0 ? ZO({
    x: v,
    y: C
  }, cn(t)) : {
    x: v,
    y: C
  };
  if (v = OA.x, C = OA.y, c) {
    var _A;
    return Object.assign({}, QA, (_A = {}, _A[_] = H ? "0" : "", _A[O] = U ? "0" : "", _A.transform = (M.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + C + "px)" : "translate3d(" + v + "px, " + C + "px, 0)", _A));
  }
  return Object.assign({}, QA, (e = {}, e[_] = H ? C + "px" : "", e[O] = U ? v + "px" : "", e.transform = "", e));
}
function A4(A) {
  var e = A.state, t = A.options, n = t.gpuAcceleration, i = n === void 0 ? !0 : n, o = t.adaptive, l = o === void 0 ? !0 : o, f = t.roundOffsets, c = f === void 0 ? !0 : f, h = {
    placement: hr(e.placement),
    variation: fo(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, Kw(Object.assign({}, h, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: l,
    roundOffsets: c
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, Kw(Object.assign({}, h, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: c
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const e4 = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: A4,
  data: {}
};
var dl = {
  passive: !0
};
function t4(A) {
  var e = A.state, t = A.instance, n = A.options, i = n.scroll, o = i === void 0 ? !0 : i, l = n.resize, f = l === void 0 ? !0 : l, c = cn(e.elements.popper), h = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return o && h.forEach(function(m) {
    m.addEventListener("scroll", t.update, dl);
  }), f && c.addEventListener("resize", t.update, dl), function() {
    o && h.forEach(function(m) {
      m.removeEventListener("scroll", t.update, dl);
    }), f && c.removeEventListener("resize", t.update, dl);
  };
}
const n4 = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: t4,
  data: {}
};
var r4 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Jl(A) {
  return A.replace(/left|right|bottom|top/g, function(e) {
    return r4[e];
  });
}
var i4 = {
  start: "end",
  end: "start"
};
function Rw(A) {
  return A.replace(/start|end/g, function(e) {
    return i4[e];
  });
}
function Xp(A) {
  var e = cn(A), t = e.pageXOffset, n = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: n
  };
}
function qp(A) {
  return co(bi(A)).left + Xp(A).scrollLeft;
}
function a4(A, e) {
  var t = cn(A), n = bi(A), i = t.visualViewport, o = n.clientWidth, l = n.clientHeight, f = 0, c = 0;
  if (i) {
    o = i.width, l = i.height;
    var h = O0();
    (h || !h && e === "fixed") && (f = i.offsetLeft, c = i.offsetTop);
  }
  return {
    width: o,
    height: l,
    x: f + qp(A),
    y: c
  };
}
function o4(A) {
  var e, t = bi(A), n = Xp(A), i = (e = A.ownerDocument) == null ? void 0 : e.body, o = na(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), l = na(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), f = -n.scrollLeft + qp(A), c = -n.scrollTop;
  return Wr(i || t).direction === "rtl" && (f += na(t.clientWidth, i ? i.clientWidth : 0) - o), {
    width: o,
    height: l,
    x: f,
    y: c
  };
}
function zp(A) {
  var e = Wr(A), t = e.overflow, n = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + n);
}
function R0(A) {
  return ["html", "body", "#document"].indexOf(dr(A)) >= 0 ? A.ownerDocument.body : Un(A) && zp(A) ? A : R0(Kc(A));
}
function Cs(A, e) {
  var t;
  e === void 0 && (e = []);
  var n = R0(A), i = n === ((t = A.ownerDocument) == null ? void 0 : t.body), o = cn(n), l = i ? [o].concat(o.visualViewport || [], zp(n) ? n : []) : n, f = e.concat(l);
  return i ? f : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    f.concat(Cs(Kc(l)))
  );
}
function fd(A) {
  return Object.assign({}, A, {
    left: A.x,
    top: A.y,
    right: A.x + A.width,
    bottom: A.y + A.height
  });
}
function s4(A, e) {
  var t = co(A, !1, e === "fixed");
  return t.top = t.top + A.clientTop, t.left = t.left + A.clientLeft, t.bottom = t.top + A.clientHeight, t.right = t.left + A.clientWidth, t.width = A.clientWidth, t.height = A.clientHeight, t.x = t.left, t.y = t.top, t;
}
function kw(A, e, t) {
  return e === L0 ? fd(a4(A, t)) : la(e) ? s4(e, t) : fd(o4(bi(A)));
}
function u4(A) {
  var e = Cs(Kc(A)), t = ["absolute", "fixed"].indexOf(Wr(A).position) >= 0, n = t && Un(A) ? Xs(A) : A;
  return la(n) ? e.filter(function(i) {
    return la(i) && N0(i, n) && dr(i) !== "body";
  }) : [];
}
function l4(A, e, t, n) {
  var i = e === "clippingParents" ? u4(A) : [].concat(e), o = [].concat(i, [t]), l = o[0], f = o.reduce(function(c, h) {
    var m = kw(A, h, n);
    return c.top = na(m.top, c.top), c.right = Bc(m.right, c.right), c.bottom = Bc(m.bottom, c.bottom), c.left = na(m.left, c.left), c;
  }, kw(A, l, n));
  return f.width = f.right - f.left, f.height = f.bottom - f.top, f.x = f.left, f.y = f.top, f;
}
function k0(A) {
  var e = A.reference, t = A.element, n = A.placement, i = n ? hr(n) : null, o = n ? fo(n) : null, l = e.x + e.width / 2 - t.width / 2, f = e.y + e.height / 2 - t.height / 2, c;
  switch (i) {
    case tn:
      c = {
        x: l,
        y: e.y - t.height
      };
      break;
    case En:
      c = {
        x: l,
        y: e.y + e.height
      };
      break;
    case bn:
      c = {
        x: e.x + e.width,
        y: f
      };
      break;
    case nn:
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
  var h = i ? Wp(i) : null;
  if (h != null) {
    var m = h === "y" ? "height" : "width";
    switch (o) {
      case uo:
        c[h] = c[h] - (e[m] / 2 - t[m] / 2);
        break;
      case Ts:
        c[h] = c[h] + (e[m] / 2 - t[m] / 2);
        break;
    }
  }
  return c;
}
function Ds(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = n === void 0 ? A.placement : n, o = t.strategy, l = o === void 0 ? A.strategy : o, f = t.boundary, c = f === void 0 ? HO : f, h = t.rootBoundary, m = h === void 0 ? L0 : h, B = t.elementContext, g = B === void 0 ? As : B, v = t.altBoundary, u = v === void 0 ? !1 : v, C = t.padding, F = C === void 0 ? 0 : C, U = P0(typeof F != "number" ? F : K0(F, Ws)), H = g === As ? SO : As, O = A.rects.popper, _ = A.elements[u ? H : g], M = l4(la(_) ? _ : _.contextElement || bi(A.elements.popper), c, m, l), K = co(A.elements.reference), z = k0({
    reference: K,
    element: O,
    strategy: "absolute",
    placement: i
  }), cA = fd(Object.assign({}, O, z)), sA = g === As ? cA : K, gA = {
    top: M.top - sA.top + U.top,
    bottom: sA.bottom - M.bottom + U.bottom,
    left: M.left - sA.left + U.left,
    right: sA.right - M.right + U.right
  }, QA = A.modifiersData.offset;
  if (g === As && QA) {
    var OA = QA[i];
    Object.keys(gA).forEach(function(_A) {
      var W = [bn, En].indexOf(_A) >= 0 ? 1 : -1, yA = [tn, En].indexOf(_A) >= 0 ? "y" : "x";
      gA[_A] += OA[yA] * W;
    });
  }
  return gA;
}
function c4(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = t.boundary, o = t.rootBoundary, l = t.padding, f = t.flipVariations, c = t.allowedAutoPlacements, h = c === void 0 ? T0 : c, m = fo(n), B = m ? f ? Mw : Mw.filter(function(u) {
    return fo(u) === m;
  }) : Ws, g = B.filter(function(u) {
    return h.indexOf(u) >= 0;
  });
  g.length === 0 && (g = B);
  var v = g.reduce(function(u, C) {
    return u[C] = Ds(A, {
      placement: C,
      boundary: i,
      rootBoundary: o,
      padding: l
    })[hr(C)], u;
  }, {});
  return Object.keys(v).sort(function(u, C) {
    return v[u] - v[C];
  });
}
function f4(A) {
  if (hr(A) === $p)
    return [];
  var e = Jl(A);
  return [Rw(A), e, Rw(e)];
}
function h4(A) {
  var e = A.state, t = A.options, n = A.name;
  if (!e.modifiersData[n]._skip) {
    for (var i = t.mainAxis, o = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !0 : l, c = t.fallbackPlacements, h = t.padding, m = t.boundary, B = t.rootBoundary, g = t.altBoundary, v = t.flipVariations, u = v === void 0 ? !0 : v, C = t.allowedAutoPlacements, F = e.options.placement, U = hr(F), H = U === F, O = c || (H || !u ? [Jl(F)] : f4(F)), _ = [F].concat(O).reduce(function(L, R) {
      return L.concat(hr(R) === $p ? c4(e, {
        placement: R,
        boundary: m,
        rootBoundary: B,
        padding: h,
        flipVariations: u,
        allowedAutoPlacements: C
      }) : R);
    }, []), M = e.rects.reference, K = e.rects.popper, z = /* @__PURE__ */ new Map(), cA = !0, sA = _[0], gA = 0; gA < _.length; gA++) {
      var QA = _[gA], OA = hr(QA), _A = fo(QA) === uo, W = [tn, En].indexOf(OA) >= 0, yA = W ? "width" : "height", eA = Ds(e, {
        placement: QA,
        boundary: m,
        rootBoundary: B,
        altBoundary: g,
        padding: h
      }), fA = W ? _A ? bn : nn : _A ? En : tn;
      M[yA] > K[yA] && (fA = Jl(fA));
      var bA = Jl(fA), xA = [];
      if (o && xA.push(eA[OA] <= 0), f && xA.push(eA[fA] <= 0, eA[bA] <= 0), xA.every(function(L) {
        return L;
      })) {
        sA = QA, cA = !1;
        break;
      }
      z.set(QA, xA);
    }
    if (cA)
      for (var iA = u ? 3 : 1, T = function(R) {
        var nA = _.find(function(FA) {
          var UA = z.get(FA);
          if (UA)
            return UA.slice(0, R).every(function(qA) {
              return qA;
            });
        });
        if (nA)
          return sA = nA, "break";
      }, AA = iA; AA > 0; AA--) {
        var J = T(AA);
        if (J === "break") break;
      }
    e.placement !== sA && (e.modifiersData[n]._skip = !0, e.placement = sA, e.reset = !0);
  }
}
const d4 = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: h4,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function $w(A, e, t) {
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
function Gw(A) {
  return [tn, bn, En, nn].some(function(e) {
    return A[e] >= 0;
  });
}
function p4(A) {
  var e = A.state, t = A.name, n = e.rects.reference, i = e.rects.popper, o = e.modifiersData.preventOverflow, l = Ds(e, {
    elementContext: "reference"
  }), f = Ds(e, {
    altBoundary: !0
  }), c = $w(l, n), h = $w(f, i, o), m = Gw(c), B = Gw(h);
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
const g4 = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: p4
};
function B4(A, e, t) {
  var n = hr(A), i = [nn, tn].indexOf(n) >= 0 ? -1 : 1, o = typeof t == "function" ? t(Object.assign({}, e, {
    placement: A
  })) : t, l = o[0], f = o[1];
  return l = l || 0, f = (f || 0) * i, [nn, bn].indexOf(n) >= 0 ? {
    x: f,
    y: l
  } : {
    x: l,
    y: f
  };
}
function w4(A) {
  var e = A.state, t = A.options, n = A.name, i = t.offset, o = i === void 0 ? [0, 0] : i, l = T0.reduce(function(m, B) {
    return m[B] = B4(B, e.rects, o), m;
  }, {}), f = l[e.placement], c = f.x, h = f.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += c, e.modifiersData.popperOffsets.y += h), e.modifiersData[n] = l;
}
const m4 = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: w4
};
function v4(A) {
  var e = A.state, t = A.name;
  e.modifiersData[t] = k0({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const y4 = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: v4,
  data: {}
};
function C4(A) {
  return A === "x" ? "y" : "x";
}
function Q4(A) {
  var e = A.state, t = A.options, n = A.name, i = t.mainAxis, o = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !1 : l, c = t.boundary, h = t.rootBoundary, m = t.altBoundary, B = t.padding, g = t.tether, v = g === void 0 ? !0 : g, u = t.tetherOffset, C = u === void 0 ? 0 : u, F = Ds(e, {
    boundary: c,
    rootBoundary: h,
    padding: B,
    altBoundary: m
  }), U = hr(e.placement), H = fo(e.placement), O = !H, _ = Wp(U), M = C4(_), K = e.modifiersData.popperOffsets, z = e.rects.reference, cA = e.rects.popper, sA = typeof C == "function" ? C(Object.assign({}, e.rects, {
    placement: e.placement
  })) : C, gA = typeof sA == "number" ? {
    mainAxis: sA,
    altAxis: sA
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, sA), QA = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, OA = {
    x: 0,
    y: 0
  };
  if (K) {
    if (o) {
      var _A, W = _ === "y" ? tn : nn, yA = _ === "y" ? En : bn, eA = _ === "y" ? "height" : "width", fA = K[_], bA = fA + F[W], xA = fA - F[yA], iA = v ? -cA[eA] / 2 : 0, T = H === uo ? z[eA] : cA[eA], AA = H === uo ? -cA[eA] : -z[eA], J = e.elements.arrow, L = v && J ? Vp(J) : {
        width: 0,
        height: 0
      }, R = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : M0(), nA = R[W], FA = R[yA], UA = ys(0, z[eA], L[eA]), qA = O ? z[eA] / 2 - iA - UA - nA - gA.mainAxis : T - UA - nA - gA.mainAxis, te = O ? -z[eA] / 2 + iA + UA + FA + gA.mainAxis : AA + UA + FA + gA.mainAxis, zA = e.elements.arrow && Xs(e.elements.arrow), KA = zA ? _ === "y" ? zA.clientTop || 0 : zA.clientLeft || 0 : 0, oA = (_A = QA == null ? void 0 : QA[_]) != null ? _A : 0, mA = fA + qA - oA - KA, EA = fA + te - oA, ee = ys(v ? Bc(bA, mA) : bA, fA, v ? na(xA, EA) : xA);
      K[_] = ee, OA[_] = ee - fA;
    }
    if (f) {
      var we, Fe = _ === "x" ? tn : nn, Ye = _ === "x" ? En : bn, Le = K[M], ke = M === "y" ? "height" : "width", Me = Le + F[Fe], be = Le - F[Ye], Nt = [tn, nn].indexOf(U) !== -1, Et = (we = QA == null ? void 0 : QA[M]) != null ? we : 0, Mt = Nt ? Me : Le - z[ke] - cA[ke] - Et + gA.altAxis, bt = Nt ? Le + z[ke] + cA[ke] - Et - gA.altAxis : be, wt = v && Nt ? XO(Mt, Le, bt) : ys(v ? Mt : Me, Le, v ? bt : be);
      K[M] = wt, OA[M] = wt - Le;
    }
    e.modifiersData[n] = OA;
  }
}
const F4 = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: Q4,
  requiresIfExists: ["offset"]
};
function U4(A) {
  return {
    scrollLeft: A.scrollLeft,
    scrollTop: A.scrollTop
  };
}
function E4(A) {
  return A === cn(A) || !Un(A) ? Xp(A) : U4(A);
}
function b4(A) {
  var e = A.getBoundingClientRect(), t = lo(e.width) / A.offsetWidth || 1, n = lo(e.height) / A.offsetHeight || 1;
  return t !== 1 || n !== 1;
}
function _4(A, e, t) {
  t === void 0 && (t = !1);
  var n = Un(e), i = Un(e) && b4(e), o = bi(e), l = co(A, i, t), f = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (n || !n && !t) && ((dr(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  zp(o)) && (f = E4(e)), Un(e) ? (c = co(e, !0), c.x += e.clientLeft, c.y += e.clientTop) : o && (c.x = qp(o))), {
    x: l.left + f.scrollLeft - c.x,
    y: l.top + f.scrollTop - c.y,
    width: l.width,
    height: l.height
  };
}
function x4(A) {
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
function I4(A) {
  var e = x4(A);
  return kO.reduce(function(t, n) {
    return t.concat(e.filter(function(i) {
      return i.phase === n;
    }));
  }, []);
}
function H4(A) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(A());
      });
    })), e;
  };
}
function S4(A) {
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
var Vw = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Ww() {
  for (var A = arguments.length, e = new Array(A), t = 0; t < A; t++)
    e[t] = arguments[t];
  return !e.some(function(n) {
    return !(n && typeof n.getBoundingClientRect == "function");
  });
}
function L4(A) {
  A === void 0 && (A = {});
  var e = A, t = e.defaultModifiers, n = t === void 0 ? [] : t, i = e.defaultOptions, o = i === void 0 ? Vw : i;
  return function(f, c, h) {
    h === void 0 && (h = o);
    var m = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Vw, o),
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
        var H = typeof U == "function" ? U(m.options) : U;
        C(), m.options = Object.assign({}, o, m.options, H), m.scrollParents = {
          reference: la(f) ? Cs(f) : f.contextElement ? Cs(f.contextElement) : [],
          popper: Cs(c)
        };
        var O = I4(S4([].concat(n, m.options.modifiers)));
        return m.orderedModifiers = O.filter(function(_) {
          return _.enabled;
        }), u(), v.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!g) {
          var U = m.elements, H = U.reference, O = U.popper;
          if (Ww(H, O)) {
            m.rects = {
              reference: _4(H, Xs(O), m.options.strategy === "fixed"),
              popper: Vp(O)
            }, m.reset = !1, m.placement = m.options.placement, m.orderedModifiers.forEach(function(gA) {
              return m.modifiersData[gA.name] = Object.assign({}, gA.data);
            });
            for (var _ = 0; _ < m.orderedModifiers.length; _++) {
              if (m.reset === !0) {
                m.reset = !1, _ = -1;
                continue;
              }
              var M = m.orderedModifiers[_], K = M.fn, z = M.options, cA = z === void 0 ? {} : z, sA = M.name;
              typeof K == "function" && (m = K({
                state: m,
                options: cA,
                name: sA,
                instance: v
              }) || m);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: H4(function() {
        return new Promise(function(F) {
          v.forceUpdate(), F(m);
        });
      }),
      destroy: function() {
        C(), g = !0;
      }
    };
    if (!Ww(f, c))
      return v;
    v.setOptions(h).then(function(F) {
      !g && h.onFirstUpdate && h.onFirstUpdate(F);
    });
    function u() {
      m.orderedModifiers.forEach(function(F) {
        var U = F.name, H = F.options, O = H === void 0 ? {} : H, _ = F.effect;
        if (typeof _ == "function") {
          var M = _({
            state: m,
            name: U,
            instance: v,
            options: O
          }), K = function() {
          };
          B.push(M || K);
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
var T4 = [n4, y4, e4, D0, m4, d4, F4, jO, g4], D4 = /* @__PURE__ */ L4({
  defaultModifiers: T4
}), O4 = "tippy-box", $0 = "tippy-content", N4 = "tippy-backdrop", G0 = "tippy-arrow", V0 = "tippy-svg-arrow", qi = {
  passive: !0,
  capture: !0
}, W0 = function() {
  return document.body;
};
function M4(A, e) {
  return {}.hasOwnProperty.call(A, e);
}
function mh(A, e, t) {
  if (Array.isArray(A)) {
    var n = A[e];
    return n ?? (Array.isArray(t) ? t[e] : t);
  }
  return A;
}
function Jp(A, e) {
  var t = {}.toString.call(A);
  return t.indexOf("[object") === 0 && t.indexOf(e + "]") > -1;
}
function X0(A, e) {
  return typeof A == "function" ? A.apply(void 0, e) : A;
}
function Xw(A, e) {
  if (e === 0)
    return A;
  var t;
  return function(n) {
    clearTimeout(t), t = setTimeout(function() {
      A(n);
    }, e);
  };
}
function P4(A, e) {
  var t = Object.assign({}, A);
  return e.forEach(function(n) {
    delete t[n];
  }), t;
}
function K4(A) {
  return A.split(/\s+/).filter(Boolean);
}
function Xa(A) {
  return [].concat(A);
}
function qw(A, e) {
  A.indexOf(e) === -1 && A.push(e);
}
function R4(A) {
  return A.filter(function(e, t) {
    return A.indexOf(e) === t;
  });
}
function k4(A) {
  return A.split("-")[0];
}
function wc(A) {
  return [].slice.call(A);
}
function zw(A) {
  return Object.keys(A).reduce(function(e, t) {
    return A[t] !== void 0 && (e[t] = A[t]), e;
  }, {});
}
function Qs() {
  return document.createElement("div");
}
function Os(A) {
  return ["Element", "Fragment"].some(function(e) {
    return Jp(A, e);
  });
}
function $4(A) {
  return Jp(A, "NodeList");
}
function G4(A) {
  return Jp(A, "MouseEvent");
}
function V4(A) {
  return !!(A && A._tippy && A._tippy.reference === A);
}
function W4(A) {
  return Os(A) ? [A] : $4(A) ? wc(A) : Array.isArray(A) ? A : wc(document.querySelectorAll(A));
}
function vh(A, e) {
  A.forEach(function(t) {
    t && (t.style.transitionDuration = e + "ms");
  });
}
function Jw(A, e) {
  A.forEach(function(t) {
    t && t.setAttribute("data-state", e);
  });
}
function X4(A) {
  var e, t = Xa(A), n = t[0];
  return n != null && (e = n.ownerDocument) != null && e.body ? n.ownerDocument : document;
}
function q4(A, e) {
  var t = e.clientX, n = e.clientY;
  return A.every(function(i) {
    var o = i.popperRect, l = i.popperState, f = i.props, c = f.interactiveBorder, h = k4(l.placement), m = l.modifiersData.offset;
    if (!m)
      return !0;
    var B = h === "bottom" ? m.top.y : 0, g = h === "top" ? m.bottom.y : 0, v = h === "right" ? m.left.x : 0, u = h === "left" ? m.right.x : 0, C = o.top - n + B > c, F = n - o.bottom - g > c, U = o.left - t + v > c, H = t - o.right - u > c;
    return C || F || U || H;
  });
}
function yh(A, e, t) {
  var n = e + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(i) {
    A[n](i, t);
  });
}
function jw(A, e) {
  for (var t = e; t; ) {
    var n;
    if (A.contains(t))
      return !0;
    t = t.getRootNode == null || (n = t.getRootNode()) == null ? void 0 : n.host;
  }
  return !1;
}
var sr = {
  isTouch: !1
}, Yw = 0;
function z4() {
  sr.isTouch || (sr.isTouch = !0, window.performance && document.addEventListener("mousemove", q0));
}
function q0() {
  var A = performance.now();
  A - Yw < 20 && (sr.isTouch = !1, document.removeEventListener("mousemove", q0)), Yw = A;
}
function J4() {
  var A = document.activeElement;
  if (V4(A)) {
    var e = A._tippy;
    A.blur && !e.state.isVisible && A.blur();
  }
}
function j4() {
  document.addEventListener("touchstart", z4, qi), window.addEventListener("blur", J4);
}
var Y4 = typeof window < "u" && typeof document < "u", Z4 = Y4 ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function Ma(A) {
  var e = A === "destroy" ? "n already-" : " ";
  return [A + "() was called on a" + e + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function Zw(A) {
  var e = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return A.replace(e, " ").replace(t, "").trim();
}
function AN(A) {
  return Zw(`
  %ctippy.js

  %c` + Zw(A) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function z0(A) {
  return [
    AN(A),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var Ns;
process.env.NODE_ENV !== "production" && eN();
function eN() {
  Ns = /* @__PURE__ */ new Set();
}
function Pr(A, e) {
  if (A && !Ns.has(e)) {
    var t;
    Ns.add(e), (t = console).warn.apply(t, z0(e));
  }
}
function hd(A, e) {
  if (A && !Ns.has(e)) {
    var t;
    Ns.add(e), (t = console).error.apply(t, z0(e));
  }
}
function tN(A) {
  var e = !A, t = Object.prototype.toString.call(A) === "[object Object]" && !A.addEventListener;
  hd(e, ["tippy() was passed", "`" + String(A) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), hd(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var J0 = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, nN = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, ln = Object.assign({
  appendTo: W0,
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
}, J0, nN), rN = Object.keys(ln), iN = function(e) {
  process.env.NODE_ENV !== "production" && Y0(e, []);
  var t = Object.keys(e);
  t.forEach(function(n) {
    ln[n] = e[n];
  });
};
function j0(A) {
  var e = A.plugins || [], t = e.reduce(function(n, i) {
    var o = i.name, l = i.defaultValue;
    if (o) {
      var f;
      n[o] = A[o] !== void 0 ? A[o] : (f = ln[o]) != null ? f : l;
    }
    return n;
  }, {});
  return Object.assign({}, A, t);
}
function aN(A, e) {
  var t = e ? Object.keys(j0(Object.assign({}, ln, {
    plugins: e
  }))) : rN, n = t.reduce(function(i, o) {
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
function Am(A, e) {
  var t = Object.assign({}, e, {
    content: X0(e.content, [A])
  }, e.ignoreAttributes ? {} : aN(A, e.plugins));
  return t.aria = Object.assign({}, ln.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function Y0(A, e) {
  A === void 0 && (A = {}), e === void 0 && (e = []);
  var t = Object.keys(A);
  t.forEach(function(n) {
    var i = P4(ln, Object.keys(J0)), o = !M4(i, n);
    o && (o = e.filter(function(l) {
      return l.name === n;
    }).length === 0), Pr(o, ["`" + n + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var oN = function() {
  return "innerHTML";
};
function dd(A, e) {
  A[oN()] = e;
}
function em(A) {
  var e = Qs();
  return A === !0 ? e.className = G0 : (e.className = V0, Os(A) ? e.appendChild(A) : dd(e, A)), e;
}
function tm(A, e) {
  Os(e.content) ? (dd(A, ""), A.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? dd(A, e.content) : A.textContent = e.content);
}
function pd(A) {
  var e = A.firstElementChild, t = wc(e.children);
  return {
    box: e,
    content: t.find(function(n) {
      return n.classList.contains($0);
    }),
    arrow: t.find(function(n) {
      return n.classList.contains(G0) || n.classList.contains(V0);
    }),
    backdrop: t.find(function(n) {
      return n.classList.contains(N4);
    })
  };
}
function Z0(A) {
  var e = Qs(), t = Qs();
  t.className = O4, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var n = Qs();
  n.className = $0, n.setAttribute("data-state", "hidden"), tm(n, A.props), e.appendChild(t), t.appendChild(n), i(A.props, A.props);
  function i(o, l) {
    var f = pd(e), c = f.box, h = f.content, m = f.arrow;
    l.theme ? c.setAttribute("data-theme", l.theme) : c.removeAttribute("data-theme"), typeof l.animation == "string" ? c.setAttribute("data-animation", l.animation) : c.removeAttribute("data-animation"), l.inertia ? c.setAttribute("data-inertia", "") : c.removeAttribute("data-inertia"), c.style.maxWidth = typeof l.maxWidth == "number" ? l.maxWidth + "px" : l.maxWidth, l.role ? c.setAttribute("role", l.role) : c.removeAttribute("role"), (o.content !== l.content || o.allowHTML !== l.allowHTML) && tm(h, A.props), l.arrow ? m ? o.arrow !== l.arrow && (c.removeChild(m), c.appendChild(em(l.arrow))) : c.appendChild(em(l.arrow)) : m && c.removeChild(m);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
Z0.$$tippy = !0;
var sN = 1, pl = [], Ch = [];
function uN(A, e) {
  var t = Am(A, Object.assign({}, ln, j0(zw(e)))), n, i, o, l = !1, f = !1, c = !1, h = !1, m, B, g, v = [], u = Xw(mA, t.interactiveDebounce), C, F = sN++, U = null, H = R4(t.plugins), O = {
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
  }, _ = {
    // properties
    id: F,
    reference: A,
    popper: Qs(),
    popperInstance: U,
    props: t,
    state: O,
    plugins: H,
    // methods
    clearDelayTimeouts: Mt,
    setProps: bt,
    setContent: wt,
    show: fn,
    hide: mr,
    hideWithInteractivity: _i,
    enable: Nt,
    disable: Et,
    unmount: qr,
    destroy: zr
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && hd(!0, "render() function has not been supplied."), _;
  var M = t.render(_), K = M.popper, z = M.onUpdate;
  K.setAttribute("data-tippy-root", ""), K.id = "tippy-" + _.id, _.popper = K, A._tippy = _, K._tippy = _;
  var cA = H.map(function(lA) {
    return lA.fn(_);
  }), sA = A.hasAttribute("aria-expanded");
  return zA(), iA(), fA(), bA("onCreate", [_]), t.showOnCreate && Me(), K.addEventListener("mouseenter", function() {
    _.props.interactive && _.state.isVisible && _.clearDelayTimeouts();
  }), K.addEventListener("mouseleave", function() {
    _.props.interactive && _.props.trigger.indexOf("mouseenter") >= 0 && W().addEventListener("mousemove", u);
  }), _;
  function gA() {
    var lA = _.props.touch;
    return Array.isArray(lA) ? lA : [lA, 0];
  }
  function QA() {
    return gA()[0] === "hold";
  }
  function OA() {
    var lA;
    return !!((lA = _.props.render) != null && lA.$$tippy);
  }
  function _A() {
    return C || A;
  }
  function W() {
    var lA = _A().parentNode;
    return lA ? X4(lA) : document;
  }
  function yA() {
    return pd(K);
  }
  function eA(lA) {
    return _.state.isMounted && !_.state.isVisible || sr.isTouch || m && m.type === "focus" ? 0 : mh(_.props.delay, lA ? 0 : 1, ln.delay);
  }
  function fA(lA) {
    lA === void 0 && (lA = !1), K.style.pointerEvents = _.props.interactive && !lA ? "" : "none", K.style.zIndex = "" + _.props.zIndex;
  }
  function bA(lA, TA, WA) {
    if (WA === void 0 && (WA = !0), cA.forEach(function(ve) {
      ve[lA] && ve[lA].apply(ve, TA);
    }), WA) {
      var me;
      (me = _.props)[lA].apply(me, TA);
    }
  }
  function xA() {
    var lA = _.props.aria;
    if (lA.content) {
      var TA = "aria-" + lA.content, WA = K.id, me = Xa(_.props.triggerTarget || A);
      me.forEach(function(ve) {
        var st = ve.getAttribute(TA);
        if (_.state.isVisible)
          ve.setAttribute(TA, st ? st + " " + WA : WA);
        else {
          var _t = st && st.replace(WA, "").trim();
          _t ? ve.setAttribute(TA, _t) : ve.removeAttribute(TA);
        }
      });
    }
  }
  function iA() {
    if (!(sA || !_.props.aria.expanded)) {
      var lA = Xa(_.props.triggerTarget || A);
      lA.forEach(function(TA) {
        _.props.interactive ? TA.setAttribute("aria-expanded", _.state.isVisible && TA === _A() ? "true" : "false") : TA.removeAttribute("aria-expanded");
      });
    }
  }
  function T() {
    W().removeEventListener("mousemove", u), pl = pl.filter(function(lA) {
      return lA !== u;
    });
  }
  function AA(lA) {
    if (!(sr.isTouch && (c || lA.type === "mousedown"))) {
      var TA = lA.composedPath && lA.composedPath()[0] || lA.target;
      if (!(_.props.interactive && jw(K, TA))) {
        if (Xa(_.props.triggerTarget || A).some(function(WA) {
          return jw(WA, TA);
        })) {
          if (sr.isTouch || _.state.isVisible && _.props.trigger.indexOf("click") >= 0)
            return;
        } else
          bA("onClickOutside", [_, lA]);
        _.props.hideOnClick === !0 && (_.clearDelayTimeouts(), _.hide(), f = !0, setTimeout(function() {
          f = !1;
        }), _.state.isMounted || nA());
      }
    }
  }
  function J() {
    c = !0;
  }
  function L() {
    c = !1;
  }
  function R() {
    var lA = W();
    lA.addEventListener("mousedown", AA, !0), lA.addEventListener("touchend", AA, qi), lA.addEventListener("touchstart", L, qi), lA.addEventListener("touchmove", J, qi);
  }
  function nA() {
    var lA = W();
    lA.removeEventListener("mousedown", AA, !0), lA.removeEventListener("touchend", AA, qi), lA.removeEventListener("touchstart", L, qi), lA.removeEventListener("touchmove", J, qi);
  }
  function FA(lA, TA) {
    qA(lA, function() {
      !_.state.isVisible && K.parentNode && K.parentNode.contains(K) && TA();
    });
  }
  function UA(lA, TA) {
    qA(lA, TA);
  }
  function qA(lA, TA) {
    var WA = yA().box;
    function me(ve) {
      ve.target === WA && (yh(WA, "remove", me), TA());
    }
    if (lA === 0)
      return TA();
    yh(WA, "remove", B), yh(WA, "add", me), B = me;
  }
  function te(lA, TA, WA) {
    WA === void 0 && (WA = !1);
    var me = Xa(_.props.triggerTarget || A);
    me.forEach(function(ve) {
      ve.addEventListener(lA, TA, WA), v.push({
        node: ve,
        eventType: lA,
        handler: TA,
        options: WA
      });
    });
  }
  function zA() {
    QA() && (te("touchstart", oA, {
      passive: !0
    }), te("touchend", EA, {
      passive: !0
    })), K4(_.props.trigger).forEach(function(lA) {
      if (lA !== "manual")
        switch (te(lA, oA), lA) {
          case "mouseenter":
            te("mouseleave", EA);
            break;
          case "focus":
            te(Z4 ? "focusout" : "blur", ee);
            break;
          case "focusin":
            te("focusout", ee);
            break;
        }
    });
  }
  function KA() {
    v.forEach(function(lA) {
      var TA = lA.node, WA = lA.eventType, me = lA.handler, ve = lA.options;
      TA.removeEventListener(WA, me, ve);
    }), v = [];
  }
  function oA(lA) {
    var TA, WA = !1;
    if (!(!_.state.isEnabled || we(lA) || f)) {
      var me = ((TA = m) == null ? void 0 : TA.type) === "focus";
      m = lA, C = lA.currentTarget, iA(), !_.state.isVisible && G4(lA) && pl.forEach(function(ve) {
        return ve(lA);
      }), lA.type === "click" && (_.props.trigger.indexOf("mouseenter") < 0 || l) && _.props.hideOnClick !== !1 && _.state.isVisible ? WA = !0 : Me(lA), lA.type === "click" && (l = !WA), WA && !me && be(lA);
    }
  }
  function mA(lA) {
    var TA = lA.target, WA = _A().contains(TA) || K.contains(TA);
    if (!(lA.type === "mousemove" && WA)) {
      var me = ke().concat(K).map(function(ve) {
        var st, _t = ve._tippy, _n = (st = _t.popperInstance) == null ? void 0 : st.state;
        return _n ? {
          popperRect: ve.getBoundingClientRect(),
          popperState: _n,
          props: t
        } : null;
      }).filter(Boolean);
      q4(me, lA) && (T(), be(lA));
    }
  }
  function EA(lA) {
    var TA = we(lA) || _.props.trigger.indexOf("click") >= 0 && l;
    if (!TA) {
      if (_.props.interactive) {
        _.hideWithInteractivity(lA);
        return;
      }
      be(lA);
    }
  }
  function ee(lA) {
    _.props.trigger.indexOf("focusin") < 0 && lA.target !== _A() || _.props.interactive && lA.relatedTarget && K.contains(lA.relatedTarget) || be(lA);
  }
  function we(lA) {
    return sr.isTouch ? QA() !== lA.type.indexOf("touch") >= 0 : !1;
  }
  function Fe() {
    Ye();
    var lA = _.props, TA = lA.popperOptions, WA = lA.placement, me = lA.offset, ve = lA.getReferenceClientRect, st = lA.moveTransition, _t = OA() ? pd(K).arrow : null, _n = ve ? {
      getBoundingClientRect: ve,
      contextElement: ve.contextElement || _A()
    } : A, xi = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Jr) {
        var hn = Jr.state;
        if (OA()) {
          var Hi = yA(), jr = Hi.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(vr) {
            vr === "placement" ? jr.setAttribute("data-placement", hn.placement) : hn.attributes.popper["data-popper-" + vr] ? jr.setAttribute("data-" + vr, "") : jr.removeAttribute("data-" + vr);
          }), hn.attributes.popper = {};
        }
      }
    }, xn = [{
      name: "offset",
      options: {
        offset: me
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
        adaptive: !st
      }
    }, xi];
    OA() && _t && xn.push({
      name: "arrow",
      options: {
        element: _t,
        padding: 3
      }
    }), xn.push.apply(xn, (TA == null ? void 0 : TA.modifiers) || []), _.popperInstance = D4(_n, K, Object.assign({}, TA, {
      placement: WA,
      onFirstUpdate: g,
      modifiers: xn
    }));
  }
  function Ye() {
    _.popperInstance && (_.popperInstance.destroy(), _.popperInstance = null);
  }
  function Le() {
    var lA = _.props.appendTo, TA, WA = _A();
    _.props.interactive && lA === W0 || lA === "parent" ? TA = WA.parentNode : TA = X0(lA, [WA]), TA.contains(K) || TA.appendChild(K), _.state.isMounted = !0, Fe(), process.env.NODE_ENV !== "production" && Pr(_.props.interactive && lA === ln.appendTo && WA.nextElementSibling !== K, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function ke() {
    return wc(K.querySelectorAll("[data-tippy-root]"));
  }
  function Me(lA) {
    _.clearDelayTimeouts(), lA && bA("onTrigger", [_, lA]), R();
    var TA = eA(!0), WA = gA(), me = WA[0], ve = WA[1];
    sr.isTouch && me === "hold" && ve && (TA = ve), TA ? n = setTimeout(function() {
      _.show();
    }, TA) : _.show();
  }
  function be(lA) {
    if (_.clearDelayTimeouts(), bA("onUntrigger", [_, lA]), !_.state.isVisible) {
      nA();
      return;
    }
    if (!(_.props.trigger.indexOf("mouseenter") >= 0 && _.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(lA.type) >= 0 && l)) {
      var TA = eA(!1);
      TA ? i = setTimeout(function() {
        _.state.isVisible && _.hide();
      }, TA) : o = requestAnimationFrame(function() {
        _.hide();
      });
    }
  }
  function Nt() {
    _.state.isEnabled = !0;
  }
  function Et() {
    _.hide(), _.state.isEnabled = !1;
  }
  function Mt() {
    clearTimeout(n), clearTimeout(i), cancelAnimationFrame(o);
  }
  function bt(lA) {
    if (process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ma("setProps")), !_.state.isDestroyed) {
      bA("onBeforeUpdate", [_, lA]), KA();
      var TA = _.props, WA = Am(A, Object.assign({}, TA, zw(lA), {
        ignoreAttributes: !0
      }));
      _.props = WA, zA(), TA.interactiveDebounce !== WA.interactiveDebounce && (T(), u = Xw(mA, WA.interactiveDebounce)), TA.triggerTarget && !WA.triggerTarget ? Xa(TA.triggerTarget).forEach(function(me) {
        me.removeAttribute("aria-expanded");
      }) : WA.triggerTarget && A.removeAttribute("aria-expanded"), iA(), fA(), z && z(TA, WA), _.popperInstance && (Fe(), ke().forEach(function(me) {
        requestAnimationFrame(me._tippy.popperInstance.forceUpdate);
      })), bA("onAfterUpdate", [_, lA]);
    }
  }
  function wt(lA) {
    _.setProps({
      content: lA
    });
  }
  function fn() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ma("show"));
    var lA = _.state.isVisible, TA = _.state.isDestroyed, WA = !_.state.isEnabled, me = sr.isTouch && !_.props.touch, ve = mh(_.props.duration, 0, ln.duration);
    if (!(lA || TA || WA || me) && !_A().hasAttribute("disabled") && (bA("onShow", [_], !1), _.props.onShow(_) !== !1)) {
      if (_.state.isVisible = !0, OA() && (K.style.visibility = "visible"), fA(), R(), _.state.isMounted || (K.style.transition = "none"), OA()) {
        var st = yA(), _t = st.box, _n = st.content;
        vh([_t, _n], 0);
      }
      g = function() {
        var xn;
        if (!(!_.state.isVisible || h)) {
          if (h = !0, K.offsetHeight, K.style.transition = _.props.moveTransition, OA() && _.props.animation) {
            var Ii = yA(), Jr = Ii.box, hn = Ii.content;
            vh([Jr, hn], ve), Jw([Jr, hn], "visible");
          }
          xA(), iA(), qw(Ch, _), (xn = _.popperInstance) == null || xn.forceUpdate(), bA("onMount", [_]), _.props.animation && OA() && UA(ve, function() {
            _.state.isShown = !0, bA("onShown", [_]);
          });
        }
      }, Le();
    }
  }
  function mr() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ma("hide"));
    var lA = !_.state.isVisible, TA = _.state.isDestroyed, WA = !_.state.isEnabled, me = mh(_.props.duration, 1, ln.duration);
    if (!(lA || TA || WA) && (bA("onHide", [_], !1), _.props.onHide(_) !== !1)) {
      if (_.state.isVisible = !1, _.state.isShown = !1, h = !1, l = !1, OA() && (K.style.visibility = "hidden"), T(), nA(), fA(!0), OA()) {
        var ve = yA(), st = ve.box, _t = ve.content;
        _.props.animation && (vh([st, _t], me), Jw([st, _t], "hidden"));
      }
      xA(), iA(), _.props.animation ? OA() && FA(me, _.unmount) : _.unmount();
    }
  }
  function _i(lA) {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ma("hideWithInteractivity")), W().addEventListener("mousemove", u), qw(pl, u), u(lA);
  }
  function qr() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ma("unmount")), _.state.isVisible && _.hide(), _.state.isMounted && (Ye(), ke().forEach(function(lA) {
      lA._tippy.unmount();
    }), K.parentNode && K.parentNode.removeChild(K), Ch = Ch.filter(function(lA) {
      return lA !== _;
    }), _.state.isMounted = !1, bA("onHidden", [_]));
  }
  function zr() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ma("destroy")), !_.state.isDestroyed && (_.clearDelayTimeouts(), _.unmount(), KA(), delete A._tippy, _.state.isDestroyed = !0, bA("onDestroy", [_]));
  }
}
function qs(A, e) {
  e === void 0 && (e = {});
  var t = ln.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (tN(A), Y0(e, t)), j4();
  var n = Object.assign({}, e, {
    plugins: t
  }), i = W4(A);
  if (process.env.NODE_ENV !== "production") {
    var o = Os(n.content), l = i.length > 1;
    Pr(o && l, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var f = i.reduce(function(c, h) {
    var m = h && uN(h, n);
    return m && c.push(m), c;
  }, []);
  return Os(A) ? f[0] : f;
}
qs.defaultProps = ln;
qs.setDefaultProps = iN;
qs.currentInput = sr;
Object.assign({}, D0, {
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
qs.setDefaultProps({
  render: Z0
});
const lN = "_btn_pqsxd_1", cN = "_btnGroup_pqsxd_4", gl = {
  btn: lN,
  btnGroup: cN
}, fN = function(A) {
  var e = {
    onAnnotationSelectFunction: ae.noop(),
    drawing: null,
    popoverId: ""
  }, t = He.merge({}, e, A), n = {
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
    }).classed(`${gl.btn}`, !0)``.on("click", function(F) {
      var U = n[F];
      B.forEach(U), g.each(function(H) {
        var O = VA(this);
        i(O, H);
      }), t.onAnnotationSelectFunction();
    });
    var u = g.enter(), C = u.append("p");
    C.append("span").classed("genelabel", !0), C.append("div").classed("btn-group", !0), g.each(function(F) {
      var U = VA(this), H = U.select("div.btn-group");
      H.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(_) {
        return _;
      }).classed(`${gl.btn}`, !0).on("click", function(_) {
        var M = n[_];
        M(F), t.onAnnotationSelectFunction(), i(U, F);
      });
    }), g.each(function(F) {
      var U = VA(this);
      i(U, F);
    });
  }, l = function(c, h, m) {
    var B = m.data;
    c.append("a").attr("href", B.link).text(B.label), h.append("p").text(
      "Chromosome " + B.chromosome + ": " + B.start + "-" + B.end
    ), B.score && h.append("p").text("Score: " + parseFloat(B.score).toFixed(3)), h.append("hr");
    var g = h.append("p").style("float", "right").classed(gl.btnGroup, !0), v = function() {
      let u = g.selectAll("a").data(["show", "hide", "auto"]);
      u.enter().append("a").attr("href", "#").text(function(C) {
        return C;
      }).classed(`${gl.btn}`, !0).on("click", function(C) {
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
    VA(t.popoverId).attr("class", "popover");
    let B = VA(t.popoverId).select(".popover-title"), g = VA(t.popoverId).select(".popover-content");
    B.selectAll("*").remove(), B.text(""), g.selectAll("*").remove(), g.text(""), m ? o(B, g, c) : l(B, g, c);
    var v = h.target;
    ae(".gene-annotation-popover").remove(), qs(v, {
      content: ae(t.popoverId).html(),
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
    }), v._tippy.show(), ae(document).on("click", function(u) {
      ae(u.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || ae(".gene-annotation-popover").remove();
    }), ae(t.popoverId).on("mousedown mousewheel", function(u) {
      u.stopPropagation();
    });
  }, f;
}, hN = function(A) {
  var e = {
    border: !1,
    labelRectangles: !1,
    onAnnotationSelectFunction: ae.noop(),
    onExpandClusterFunction: ae.noop(),
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
  }, t = He.merge({}, e, A), n = null, i = function() {
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, o = function(c, h) {
    He.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", n = fN(t);
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
      var m = VA(this).selectAll(".gene-annotations").data([h]);
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
}, dN = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: ae.noop(),
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
  }, t = He.merge({}, e, A), n = function() {
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(h, m, B, g) {
    var v = {};
    g.map(function(M, K) {
      v[M] = K;
    });
    var u = n(), C = h.selectAll("rect.snp-annotation").data(B, function(M) {
      return M.id;
    }), F = 4, U = function(M) {
      return t.layout.width - 0.2 * t.layout.chromosomeWidth * (1 + v[M.trait]);
    }, H = function(M) {
      return u(M.midpoint) - 0.5 * Math.max(F / t.scale, u(10));
    }, O = Math.max(F / t.scale, u(10)), _ = 0.2 * t.layout.chromosomeWidth;
    C.attr("x", U).attr("y", H).attr("width", _).attr("height", O), C.enter().append("rect").attr("fill", function(M) {
      return M.color;
    }).attr("opacity", function(M) {
      return M.importance;
    }).attr("class", "snp-annotation").attr("x", U).attr("y", H).attr("width", _).attr("height", O), C.exit().remove(), C.on("contextmenu", function(M) {
    });
  }, o = function(h, m, B) {
    var g = 500, v = n();
    t.layout.width;
    var u = 0.3 * t.layout.chromosomeWidth, C = 0.4 * t.layout.chromosomeWidth, F = m.layout.qtlNodes.some(function(T) {
      return T.displayLabel;
    });
    F && (C = C * 1.5);
    var U = B * 0.2 * t.layout.chromosomeWidth, H = function(T) {
      return t.layout.width - T.labelPosition * (C + u) - U;
    }, O = function(T) {
      return t.layout.width - T.position * (C + u) - U;
    }, _ = h.selectAll("g.qtl-annotation").data(m.layout.qtlNodes, function(T) {
      return T.id;
    }), M = _.enter().append("g").classed("qtl-annotation infobox", !0);
    M.append("rect").classed("qtl-hoverbox", !0);
    var K = M.append("rect").classed("qtl-selector infobox", !0), z = {}, cA = {};
    _.exit().select("rect").each(function(T) {
      z[T.index] = He.pick(this, ["x", "y", "width", "height"]), z[T.index].midpoint = T.midpoint, z[T.index].position = T.position;
    }), K.each(function(T) {
      cA[T.index] = He.pick(this, ["x", "y", "width", "height"]), cA[T.index].midpoint = T.midpoint, cA[T.index].position = T.position;
    });
    var sA = function(T, AA, J, L) {
      return He.has(T, AA) ? T[AA][J].animVal.value : L;
    };
    K.attr("x", function(T) {
      return sA(z, T.parentIndex, "x", O(T));
    }).attr("y", function(T) {
      return sA(z, T.parentIndex, "y", v(T.start));
    }).attr("width", u).attr("height", function(T) {
      return sA(
        z,
        T.parentIndex,
        "height",
        v(T.end) - v(T.start)
      );
    }), _.attr("id", function(T) {
      return "feature_" + T.id;
    }), _.select("rect.qtl-hoverbox").attr("x", function(T) {
      return O(T);
    }).attr("y", function(T) {
      return v(T.start);
    }).attr("width", function(T) {
      return T.position * (C + u) + t.chromosomeWidth + U;
    }).attr("height", function(T) {
      return v(T.end) - v(T.start);
    }).attr("fill", function(T) {
      return T.color;
    }).attr("visibility", function(T) {
      return T.hover ? "visible" : "hidden";
    }), _.select("rect.qtl-selector").transition().duration(g).attr("x", O).attr("y", function(T) {
      return v(T.start);
    }).attr("width", u).attr("height", function(T) {
      return v(T.end) - v(T.start);
    }), _.select("rect.qtl-selector").style("fill", function(T) {
      return T.color;
    }), _.exit().select("rect").transition().duration(g).attr("x", function(T) {
      return sA(cA, T.parentIndex, "x", O(T));
    }).attr("y", function(T) {
      return sA(cA, T.parentIndex, "y", v(T.start));
    }).attr("width", function(T) {
      return u;
    }).attr("height", function(T) {
      return sA(
        cA,
        T.parentIndex,
        "height",
        v(T.end) - v(T.start)
      );
    }).remove(), _.exit().remove();
    var gA = function(T) {
      return v(T.midpoint);
    }, QA = function(T) {
      return T.displayLabel === "show" ? "visible" : T.displayLabel === "hide" ? "hidden" : !0;
    }, OA = M.append("g").classed("qtl-count-group", !0), _A = _.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(T) {
        var AA = T.type == "qtllist" ? [T] : [];
        return AA;
      },
      function(T) {
        return "label_" + T.id;
      }
    ), W = _A.enter(), yA = W.append("g").classed("qtllist", !0);
    yA.append("circle").classed("qtl-count", !0), yA.append("text").classed("qtl-count", !0), OA.each(function(T) {
      if (He.has(cA, T.index))
        if (He.has(z, T.parentIndex)) {
          let L = z[T.parentIndex];
          var AA = t.layout.width - L.position * (C + u), J = v(L.midpoint);
          VA(this).attr(
            "transform",
            "translate(" + (AA + 0.5 * u) + "," + J + ")"
          );
        } else
          VA(this).attr("transform", function(L) {
            return L ? "translate(" + (O(L) + 0.5 * u) + "," + gA(L) + ")" : "translate(0,0)";
          });
    }), _.select("g.qtl-count-group").transition().duration(g).attr("transform", function(T) {
      return T ? "translate(" + (O(T) + 0.5 * u) + "," + gA(T) + ")" : "translate(0,0)";
    }), _.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", u + "px").style("visibility", "visible").style("fill", function(T) {
      return T.color;
    }).attr("id", function(T) {
      return T.id;
    });
    var eA = Math.min(
      Math.max(10 / t.scale, u),
      14 / t.scale
    );
    _.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", eA + "px").style(
      "visibility",
      eA < 2 * u ? "visible" : "hidden"
    ).text(function(T) {
      return T.count;
    }), _A.exit().remove(), M.append("g").classed("qtl-label-group", !0);
    var fA = _.select("g.qtl-label-group").selectAll("g.qtl").data(
      function(T) {
        var AA = T.displayLabel ? [T] : [];
        return AA;
      },
      function(T) {
        return "label_" + T.id;
      }
    );
    fA.exit().remove(), fA.transition().duration(g).attr("transform", function(T) {
      return "translate(" + (H(T) + 0.5 * u) + "," + gA(T) + ")";
    });
    var bA = fA.enter(), xA = bA.append("g").classed("qtl", !0).attr("transform", function(T) {
      return "translate(" + (H(T) + 0.5 * u) + "," + gA(T) + ")";
    });
    xA.append("text").classed("qtl-label", !0), _.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(T) {
      return T.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", QA).text(function(T) {
      return T.screenLabel;
    });
    var iA = function(T) {
      T.on("mouseenter", function(AA) {
        AA.hover = !0, o(h, m, B);
      }).on("mouseout", function(AA) {
        AA.hover = !1, o(h, m, B);
      }).on("click", function(AA) {
        AA.hover = !AA.hover, o(h, m, B);
      });
    };
    iA(_.select("rect.qtl-selector")), iA(_.select("circle.qtl-count")), iA(_.select("text.qtl-count")), _.on("contextmenu", function(T) {
      var AA = VA("#clusterPopover");
      AA.attr("class", "popover");
      var J = AA.select(".popover-title");
      J.selectAll("*").remove(), J.text(""), J.text(
        "Chromosome " + T.chromosome + ": " + T.start + "-" + T.end
      ), ae.fn.redraw = function() {
        return ae(this).each(function() {
          this.offsetHeight;
        });
      }, L = AA.select(".popover-content"), L.selectAll("*").remove(), L.text("");
      var L = AA.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        T.type == "qtllist" ? T.qtlList : [T]
      ), R = L.enter();
      R.append("p").classed("popover-annotation", !0);
      var nA = L.append("div").attr("class", "checkbox").append("label");
      nA.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(FA) {
        return FA.selected;
      }).on("click", function(FA) {
        FA.selected = !FA.selected, L.classed("selected", function(UA) {
          return UA.selected;
        }), t.onAnnotationSelectFunction();
      }), nA.append("a").attr("href", function(FA) {
        return FA.link;
      }).attr("target", "_blank").text(function(FA) {
        return FA.label;
      }), L.classed("selected", function(FA) {
        return FA.selected;
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
      }), g = f(B), v = VA(this).selectAll(".qtl-annotations").data([m]);
      v.enter().append("g").attr("class", "qtl-annotations"), v.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), o(v, m, g.length), t.border && l(v), v.exit().remove();
      var u = VA(this).selectAll(".snp-annotations").data([m]);
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
}, pN = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: ae.noop(),
    onExpandClusterFunction: ae.noop(),
    onLabelSelectFunction: ae.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, t = He.merge({}, e, A);
  function n(i) {
    i.each(function(o) {
      var l = o.cellLayout, f = VA(this).selectAll(".chromosome-cell").data(o.chromosomes), c = f.enter().append("g").attr("class", "chromosome-cell");
      t.border && c.append("rect").classed("border", !0), VA(this).selectAll(".chromosome-cell").attr("transform", function(v) {
        return "translate(" + v.cell.x + "," + v.cell.y + ")";
      }), t.border && f.select("rect").attr("x", 0).attr("y", 0).attr("width", function(v) {
        return v.cell.width;
      }).attr("height", function(v) {
        return v.cell.height;
      });
      var h = hN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(l.geneAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).drawing(t.svg).scale(l.scale);
      td(".chromosome-cell").call(h);
      var m = IO().layout(l.chromosomePosition).longestChromosome(l.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(l.scale).bands("genes").drawing(t.svg);
      td(".chromosome-cell").call(m);
      var B = xO().layout(l.labelPosition).sizeLayout(l.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(l.longestChromosome).scale(l.scale);
      f.call(B);
      var g = dN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(l.qtlAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).showAnnotationLabels(l.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(l.scale);
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
var Ay = { exports: {} };
(function(A, e) {
  (function(t, n) {
    A.exports = n();
  })(zi, function() {
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
          }), C = v.distribute(u), C.map(function(U, H) {
            U.forEach(function(O) {
              O.layerIndex = H;
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
            var H = U % v;
            u[H].push(F);
            for (var O = F, _ = H - 1; _ >= 0; _--) O = O.createStub(h.stubWidth), u[_].push(O);
          }), u;
        }, roundRobin: function(g) {
          var v = [];
          return v;
        }, overlap: function(g) {
          for (var v = [], u = m.maxWidthPerLayer(), C = g.concat(), F = m.computeRequiredWidth(C); F > u; ) {
            m.countIdealOverlaps(C);
            var U = C.concat(), H = F;
            for (C = []; U.length > 2 && H > u; ) {
              U.sort(function(gA, QA) {
                return QA.overlapCount - gA.overlapCount;
              });
              var O = U.shift();
              H -= O.width, H += h.stubWidth, O.overlaps.forEach(function(gA) {
                gA.overlapCount--;
              }), C.push(O);
            }
            v.push(U), F = m.computeRequiredWidth(C);
          }
          C.length > 0 && v.push(C);
          for (var _ = v.length - 1; _ >= 1; _--) for (var M = v[_], K = 0; K < M.length; K++) {
            var z = M[K];
            if (!z.isStub()) for (var cA = z, sA = _ - 1; sA >= 0; sA--) cA = cA.createStub(h.stubWidth), v[sA].push(cA);
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
        var m, B, g, v, u, C, F = arguments[0], U = 1, H = arguments.length, O = !1;
        for (typeof F == "boolean" ? (O = F, F = arguments[1] || {}, U = 2) : ((typeof F > "u" ? "undefined" : i(F)) !== "object" && typeof F != "function" || F == null) && (F = {}); U < H; ++U) if (m = arguments[U], m != null) for (B in m) g = F[B], v = m[B], F !== v && (O && v && (c(v) || (u = f(v))) ? (u ? (u = !1, C = g && f(g) ? g : []) : C = g && c(g) ? g : {}, F[B] = h(O, C, v)) : v !== void 0 && (F[B] = v));
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
        f.call(this, this.root, g + v >> 1, F, !0), F.forEach(function(M) {
          C[M.id] = !0;
        });
        for (var U = this.pointTree.bsearch([g, null]), H = this.pointTree; U >= 0 && H[U][0] == g; ) U--;
        var O = this.pointTree.bsearch([v, null]);
        if (O >= 0) {
          for (var _ = H.length - 1; O <= _ && H[O][0] <= v; ) O++;
          H.slice(U + 1, O).forEach(function(M) {
            var K = M[1];
            C[K] = !0;
          }, this), Object.keys(C).forEach(function(M) {
            var K = this.intervalHash[M];
            u.push(K.result(g, v));
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
          B = f.extend(h, B), m.forEach(function(K, z) {
            K.targetPos = K.parent ? K.parent.currentPos : K.idealPos, K.index = z;
          });
          for (var g = m.concat().sort(function(K, z) {
            var cA = K.targetPos - z.targetPos;
            if (cA !== 0) return cA;
            var sA = K.isStub() - z.isStub();
            return sA !== 0 ? sA : K.index - z.index;
          }).map(o), v = [], u = 1; u < g.length; u++) {
            var C = g[u - 1], F = g[u], U = void 0;
            U = C.node.isStub() && F.node.isStub() ? (C.node.width + F.node.width) / 2 + B.lineSpacing : (C.node.width + F.node.width) / 2 + B.nodeSpacing, v.push(new c.Constraint(C, F, U));
          }
          if (f.isDefined(B.minPos)) {
            var H = new c.Variable(B.minPos, 1e10), O = g[0];
            v.push(new c.Constraint(H, O, O.node.width / 2)), g.unshift(H);
          }
          if (f.isDefined(B.maxPos)) {
            var _ = new c.Variable(B.maxPos, 1e10), M = f.last(g);
            v.push(new c.Constraint(M, _, M.node.width / 2)), g.push(_);
          }
          new c.Solver(g, v).solve(), g.filter(function(K) {
            return K.node;
          }).map(function(K) {
            return K.node.currentPos = Math.round(K.position()), K;
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
          return g.visitNeighbours(v, function(U, H) {
            var O = C.compute_lm(H, g, u);
            H === U.right ? (F += O * U.left.scale, U.lm = O) : (F += O * U.right.scale, U.lm = -O), u(U);
          }), F / g.scale;
        }, B.prototype.populateSplitBlock = function(g, v) {
          var u = this;
          g.visitNeighbours(v, function(C, F) {
            F.offset = g.offset + (F === C.right ? C.gap : -C.gap), u.addVariable(F), u.populateSplitBlock(F, g);
          });
        }, B.prototype.traverse = function(g, v, u, C) {
          var F = this;
          u === void 0 && (u = this.vars[0]), C === void 0 && (C = null), u.visitNeighbours(C, function(U, H) {
            v.push(g(U)), F.traverse(g, v, H, u);
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
          return g.visitNeighbours(v, function(H, O) {
            U || O !== u && !F.findPath(O, g, u, C) || (U = !0, C(H, O));
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
            var H = u[U];
            if (!H.unsatisfiable) {
              var O = H.slack();
              if ((H.equality || O < g) && (g = O, v = H, F = U, H.equality)) break;
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
        return u === "left" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, H) {
          var O = F * (H + 1) * -1;
          return [[O + v.nodeHeight, U.currentPos], [O, U.currentPos]];
        })) : u === "right" ? [[[0, C[0].idealPos]]].concat(C.map(function(U, H) {
          var O = F * (H + 1);
          return [[O - v.nodeHeight, U.currentPos], [O, U.currentPos]];
        })) : u === "up" ? [[[C[0].idealPos, 0]]].concat(C.map(function(U, H) {
          var O = F * (H + 1) * -1;
          return [[U.currentPos, O + v.nodeHeight], [U.currentPos, O]];
        })) : [[[C[0].idealPos, 0]]].concat(C.map(function(U, H) {
          var O = F * (H + 1);
          return [[U.currentPos, O - v.nodeHeight], [U.currentPos, O]];
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
        return u === "left" || u === "right" ? C.reduce(function(U, H, O) {
          return F.push(m(U[U.length - 1], H[0])), O < C.length - 1 && F.push(l(H[1])), H;
        }) : C.reduce(function(U, H, O) {
          return F.push(h(U[U.length - 1], H[0])), O < C.length - 1 && F.push(l(H[1])), H;
        }), F.join(" ");
      }, t.exports = o;
    }]);
  });
})(Ay);
var ey = Ay.exports;
const ty = /* @__PURE__ */ xc(ey), gN = /* @__PURE__ */ r1({
  __proto__: null,
  default: ty
}, [ey]);
function BN(A) {
  return A.slice().sort(function(e, t) {
    return e - t;
  });
}
function nm(A, e) {
  for (var t = [], n = 0; n < A; n++) {
    for (var i = [], o = 0; o < e; o++)
      i.push(0);
    t.push(i);
  }
  return t;
}
function wN(A) {
  for (var e = 0, t, n = 0; n < A.length; n++)
    (n === 0 || A[n] !== t) && (t = A[n], e++);
  return e;
}
function gd(A, e, t, n) {
  var i;
  if (A > 0) {
    var o = (t[e] - t[A - 1]) / (e - A + 1);
    i = n[e] - n[A - 1] - (e - A + 1) * o * o;
  } else
    i = n[e] - t[e] * t[e] / (e + 1);
  return i < 0 ? 0 : i;
}
function Bd(A, e, t, n, i, o, l) {
  if (!(A > e)) {
    var f = Math.floor((A + e) / 2);
    n[t][f] = n[t - 1][f - 1], i[t][f] = f;
    var c = t;
    A > t && (c = Math.max(c, i[t][A - 1] || 0)), c = Math.max(c, i[t - 1][f] || 0);
    var h = f - 1;
    e < n[0].length - 1 && (h = Math.min(h, i[t][e + 1] || 0));
    for (var m, B, g, v, u = h; u >= c && (m = gd(u, f, o, l), !(m + n[t - 1][c - 1] >= n[t][f])); --u)
      B = gd(c, f, o, l), g = B + n[t - 1][c - 1], g < n[t][f] && (n[t][f] = g, i[t][f] = c), c++, v = m + n[t - 1][u - 1], v < n[t][f] && (n[t][f] = v, i[t][f] = u);
    Bd(
      A,
      f - 1,
      t,
      n,
      i,
      o,
      l
    ), Bd(
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
function mN(A, e, t) {
  for (var n = e[0].length, i = A[Math.floor(n / 2)], o = [], l = [], f = 0, c = void 0; f < n; ++f)
    c = A[f] - i, f === 0 ? (o.push(c), l.push(c * c)) : (o.push(o[f - 1] + c), l.push(
      l[f - 1] + c * c
    )), e[0][f] = gd(0, f, o, l), t[0][f] = 0;
  for (var h, m = 1; m < e.length; ++m)
    m < e.length - 1 ? h = m : h = n - 1, Bd(
      h,
      n - 1,
      m,
      e,
      t,
      o,
      l
    );
}
function vN(A, e) {
  if (e > A.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var t = BN(A), n = wN(t);
  if (n === 1)
    return [t];
  var i = nm(e, t.length), o = nm(e, t.length);
  mN(t, i, o);
  for (var l = [], f = o[0].length - 1, c = o.length - 1; c >= 0; c--) {
    var h = o[c][f];
    l[c] = t.slice(h, f + 1), c > 0 && (f = h - 1);
  }
  return l;
}
const rm = function(A) {
  var e = {}, t = { nClusters: 6 }, n = He.merge({}, t, A);
  return e.createClustersFromGenes = function(i) {
    var o = [];
    if (i.length < 1)
      return o;
    var l = Math.min(n.nClusters, i.length), f = i.map(function(B) {
      return B.midpoint;
    });
    let c = vN(f, l);
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
var Qh = ty || gN;
const yN = function(A) {
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
  }, t = He.merge({}, e, A), n = function() {
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(B, g, v, u) {
    var C = 4, F = g / 3, U = F / v * C, H = U * B > u;
    if (H)
      return 2;
    var O = g * (0.1 + 0.1 / B);
    return F = g - O, U = F / v * C, H = U * B > u, H ? 1 : 0;
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
      return new Qh.Node(g(F.midpoint), v.setFontSize, F);
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
    let g = B.annotations.allGenes.filter(function(eA) {
      return eA.globalIndex < t.nGenesToDisplay;
    });
    var v = t.layout.width, u = t.layout.height * Math.min(1, 0.2 + B.length / t.longestChromosome), C = g.reduce(function(eA, fA) {
      return Math.max(eA, fA.label.length);
    }, 0), F = 1.1 * t.displayedFontSize, U = 0.9 * t.displayedFontSize, H = i(
      t.scale,
      v,
      C,
      F
    ), O;
    H == 2 ? O = l(
      t.scale,
      v,
      C,
      U,
      u
    ) : H == 1 ? O = o(
      t.scale,
      v,
      C,
      U,
      u
    ) : H == 0 && (O = o(
      t.scale,
      v,
      C,
      U,
      u
    ), O.nLabels = 0);
    var _ = n();
    let M = {
      nodeSpacing: O.nodeSpacing,
      lineSpacing: O.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: O.availableHeight,
      density: O.density
    };
    var K = new Qh.Force(M);
    g.forEach(function(eA) {
      eA.displayed = !1;
    });
    var z = t.manualLabels ? new Set(
      g.filter(function(eA) {
        return eA.visible;
      })
    ) : /* @__PURE__ */ new Set();
    t.autoLabels && g.slice(0, O.nLabels).filter(function(eA) {
      return !eA.hidden;
    }).forEach(function(eA) {
      z.add(eA);
    });
    var cA = Array.from(z), sA = f(K, _, O, cA);
    !sA == 0 && (K.options({ algorithm: "simple" }), sA = f(K, _, O, cA));
    var gA;
    if (sA && sA.length > 0) {
      var QA = sA.map(function(eA) {
        return eA.getLayerIndex();
      });
      gA = Math.max.apply(null, QA);
    }
    if (!sA || gA > 3) {
      var OA = rm().nClusters(Math.max(O.nLabels, 1));
      try {
        var _A = OA.createClustersFromGenes(cA);
      } catch {
        _A = [];
      }
      sA = f(K, _, O, _A);
    }
    let W = {
      direction: "right",
      layerGap: O.layerGap,
      nodeHeight: O.spaceForLabel
    };
    var yA = new Qh.Renderer(W);
    return yA.layout(sA), sA.forEach(function(eA) {
      eA.data.path = yA.generatePath(eA);
    }), t.manualLabels || td(".gene-annotation").remove(), sA;
  }, h = function(B) {
    var g = rm(), v = B.annotations.genes, u = g.createClustersFromGenes(v);
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
        U.annotations.genes.filter(function(H) {
          return H.displayed;
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
}, CN = function(A) {
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
  }, t = He.merge({}, e, A), n = function() {
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
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
        var g = h.slice(B, C), v = g.reduce(function(U, H) {
          return U + H.id.toString();
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
}, QN = function(A) {
  var e = {
    onNetworkBtnClick: ae.noop,
    onFitBtnClick: ae.noop,
    onTagBtnClick: ae.noop,
    onLabelBtnClick: ae.noop,
    onQtlBtnClick: ae.noop,
    onResetBtnClick: ae.noop,
    onSetNumberPerRowClick: ae.noop,
    onExportBtnClick: ae.noop,
    onExportAllBtnClick: ae.noop,
    onExpandBtnClick: ae.noop,
    maxSnpPValueProperty: ae.noop,
    nGenesToDisplayProperty: ae.noop,
    annotationLabelSizeProperty: ae.noop,
    initialMaxGenes: 200,
    initialNPerRow: 10
  }, t = He.merge({}, e, A), n, i = function() {
    ae(this).hasClass("disabled") || t.onNetworkBtnClick();
  }, o = function() {
    ae(this).hasClass("disabled") || t.onTagBtnClick();
  }, l = function() {
    ae(this).hasClass("disabled") || t.onFitBtnClick();
  }, f = function() {
    if (ae(this).hasClass("disabled"))
      return;
    const g = new Event("change"), v = document.getElementById("select-label-btn");
    v.value = "auto", v.dispatchEvent(g);
    const u = document.getElementById("select-ngenes-dropdown");
    u.value = "50", u.dispatchEvent(g), t.onResetBtnClick();
  }, c = function() {
    t.onExpandBtnClick();
  }, h = function(g, v, u, C, F) {
    var U = "select-" + v, H = g.selectAll("select").data([null]);
    H.enter().append("select").attr("id", U).attr("name", U).attr("class", "menu-dropdown");
    const O = document.getElementById(U);
    O && (O.innerHTML = "", u.forEach(function(_) {
      var M = document.createElement("option");
      M.value = _[1], M.textContent = _[0], _[1] === F && (M.selected = !0), O.appendChild(M);
    }), O.addEventListener("change", function() {
      var _ = O.options[O.selectedIndex], M = _.value;
      C(M);
    }));
  }, m = function() {
    var g = VA(n).selectAll(".genemap-menu").data([null]);
    g.enter().append("div").classed("genemap-menu", !0);
    var v = g.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), u = v.selectAll("span").data(function(gA, QA) {
      return gA;
    });
    u.enter().append("span"), v.selectAll("span").attr("class", function(gA) {
      return gA;
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
    ), t.nGenesToDisplayProperty.addListener(function(gA) {
      ae("#select-ngenes-dropdown").selectpicker("val", [
        gA + " genes",
        gA
      ]);
    }), g.select(".export-btn").attr("title", "Export to PNG").on("click", t.onExportBtnClick), g.select(".expand-btn").attr("title", "Toggle full screen").on("click", c);
    var U = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    g.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(U, "_blank");
    });
    var H = VA(n).selectAll(".genemap-advanced-menu").data([null]), O = H.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    O.enter().append("div").attr("class", function(gA) {
      return gA;
    });
    var _ = H.select(".qtl-btn");
    h(
      _,
      "qtl-btn",
      [
        ["All QTLs", "all"],
        ["Checked QTLs", "selected"],
        ["No QTLs", "none"]
      ],
      t.onQtlBtnClick,
      "All QTLs"
    );
    var M = H.select(".max-snp-pvalue").selectAll("form").data([""]).enter(), K = M.append("form").classed("bootstrap", !0).attr("id", "snp-pvalue-form").attr("class", "bootstrap form-inline");
    K.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), K.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), K.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), ae("#snp-pvalue-form").submit(function(gA) {
      t.maxSnpPValueProperty(ae("#max-snp-pvalue-input").val()), gA.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(gA) {
      ae("#max-snp-pvalue-input").val(gA);
    });
    var z = H.select(".nperrow-spinner"), cA = z.selectAll("input").data(["nPerRowSpinner"]).enter();
    cA.append("span").append("label").classed("bootstrap", !0).attr("for", (gA) => gA).html("Num per row:&nbsp;"), cA.append("span").append("input").attr("id", (gA) => gA).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (gA) => gA), VA(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), ae("#nPerRowSpinner").on("change", function(gA) {
      t.onSetNumberPerRowClick(ae("#nPerRowSpinner").val());
    }), H.select(".export-all-btn").attr("title", "export all to PNG").on("click", t.onExportAllBtnClick), H.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(gA) {
      return gA;
    }), H.select(".labelsize-label").classed("bootstrap", !0), H.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var sA = H.select(".labelsize-dropdown");
    sA.text(""), h(
      sA,
      "labelsize-dropdown",
      [
        ["10", 10],
        ["15", 15],
        ["20", 20],
        ["25", 25]
      ],
      t.annotationLabelSizeProperty,
      t.annotationLabelSizeProperty()
    ), t.annotationLabelSizeProperty.addListener(function(gA) {
      ae("#select-labelsize-dropdown").selectpicker("val", [
        gA,
        gA
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
    var v = VA(n).select(".tag-btn");
    g === "show" ? (v.classed("show-label", !0), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Show Labels")) : g === "hide" ? (v.classed("show-label", !1), v.classed("hide-label", !0), v.classed("auto-label", !1), v.classed("manual-label", !1), v.attr("title", "Hide Labels")) : g === "manual" ? (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !1), v.classed("manual-label", !0), v.attr("title", "Manual Labels")) : (v.classed("show-label", !1), v.classed("hide-label", !1), v.classed("auto-label", !0), v.classed("manual-label", !1), v.attr("title", "Automatic Labels"));
  }, B.getTagButtonState = function() {
    var g = VA(n).select(".tag-btn");
    return g.classed("show-label") ? "show" : g.classed("hide-label") ? "hide" : g.classed("auto-label") ? "auto" : "manual";
  }, B.setFitButtonEnabled = function(g) {
    VA(n).select(".fit-btn").classed("disabled", !g);
  }, B.setNetworkButtonEnabled = function(g) {
    VA(n).select(".network-btn").classed("disabled", !g);
  }, B;
};
class FN {
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
function UN(A, e, t, n, i, o) {
  return t = t || "average", new FN(
    e,
    t,
    n
  ).cluster(A, i, o);
}
const EN = function() {
  var A = {};
  return A.positionAnnotations = function(e, t, n, i, o, l) {
    for (var f = i, c = l, h = o, m = function(M, K) {
      return f(M) < c(K) && f(K) < c(M);
    }, B = e.sort(function(M, K) {
      return h(M) - h(K);
    }), g = [], v = 0; v < B.length; v++) {
      for (var u = e[v], C = [], F = 0; F < g.length; F++) {
        var U = B[g[F]];
        m(u, U) || C.push(g[F]);
      }
      var H = He.difference(g, C), O = H.map(function(M) {
        return t(B[M]);
      }), _ = 0;
      for (_ = 1; _ < O.length + 1 && O.indexOf(_) !== -1; _++)
        ;
      n(u, _), g.push(v);
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
}, bN = function(A) {
  var e = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = He.merge({}, e, A), n = EN(), i = function() {
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, o = function(u) {
    return u.map(function(C) {
      var F = g(C), U = F.reduce(function(K, z) {
        return Math.min(K, z.start);
      }, 1 / 0), H = F.reduce(function(K, z) {
        return Math.max(K, z.end);
      }, 0), O = F.reduce(function(K, z) {
        return K + (K ? "|" : "") + z.start + "-" + z.end;
      }, ""), _ = (U + H) / 2;
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
        midpoint: _,
        chromosome: F[0].chromosome,
        type: "qtllist",
        id: O
      }, M;
    });
  }, l = function(u) {
    var C = [];
    if (t.showAllQTLs) {
      u.layout.qtlDisplayClusters = u.layout.qtlClusters.slice();
      for (var F = u.layout.qtlDisplayClusters, U = Math.ceil(Math.floor(t.scale - 0.1) / 2); U--; )
        F = B(F);
      for (var H = F.length; ; ) {
        C = o(F), C = n.sortQTLAnnotations(C);
        var O = C.reduce(function(_, M) {
          return Math.max(_, M.position);
        }, 0);
        if (O < 2) {
          if (F = B(F), H == F.length)
            break;
          H = F.length;
        } else
          break;
      }
    } else t.showSelectedQTLs && (u.layout.qtlDisplayClusters = u.annotations.qtls.filter(
      function(_) {
        return _.selected;
      }
    ), F = u.layout.qtlDisplayClusters, C = F.map(function(_) {
      let M = _;
      return M.type = "qtl", M;
    }));
    return C;
  }, f = function(u) {
    var C = He.groupBy(u, "position");
    return He.forOwn(C, function(F) {
      var U = 14 / t.scale, H = i();
      F = n.sortQTLLabels(F, H, U), F.forEach(function(O) {
        O.labelPosition > 1 ? O.displayLabel = !1 : (O.displayLabel = !0, O.labelPosition = O.position + 0.4);
      });
    }), u;
  }, c = function(u) {
    var C = l(u);
    C.forEach(function(z) {
      z.displayLabel = !1;
    });
    var F = C.filter(function(z) {
      return z.type == "qtl";
    });
    if (t.showAutoQTLLabels) {
      C = n.sortQTLAnnotations(C);
      var U = C.reduce(function(z, cA) {
        return Math.max(z, cA.position);
      }, 0);
      F.forEach(function(z) {
        z.label.length > 15 ? z.screenLabel = z.label.substring(0, 12) + "..." : z.screenLabel = z.label;
      });
      var H = 14 / t.scale, O = H > 0.6 * t.layout.chromosomeWidth, _ = U > 3;
      !_ && !O ? (f(F), F.forEach(function(z) {
        z.fontSize = H;
      })) : F.forEach(function(z) {
        z.displayLabel = !1;
      });
    }
    if (t.showSelectedQTLLabels && !t.showAutoQTLLabels) {
      var M = C.filter(function(z) {
        return z.selected;
      });
      H = 14 / t.scale;
      var K = 0.3 * t.layout.chromosomeWidth;
      M.forEach(function(z) {
        z.displayLabel = !0, z.screenLabel = z.label, z.fontSize = Math.min(H, 2 * K);
      }), M = n.sortQTLAnnotationsWithLabels(
        M,
        i(),
        t.annotationLabelSize
      ), M.forEach(function(z) {
        z.position = z.comboPosition, z.labelPosition = z.comboPosition + 0.4;
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
    var C = UN(
      u.annotations.qtls,
      function(U, H) {
        if (U.end == H.end && U.start == H.start)
          return 0;
        var O = Math.min(U.end, H.end) - Math.max(U.start, H.start), _ = U.end - U.start, M = H.end - H.start, K = O, z = Math.abs(_ - M);
        return Math.max(0.1, z - K);
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
        var U = F.left, H = F.right;
        C.push(U), C.push(H);
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
var wd = function(A, e) {
  return wd = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, wd(A, e);
};
function Jn(A, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  wd(A, e);
  function t() {
    this.constructor = A;
  }
  A.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var md = function() {
  return md = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
    }
    return e;
  }, md.apply(this, arguments);
};
function Gt(A, e, t, n) {
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
function Dt(A, e) {
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
function Bl(A, e, t) {
  if (arguments.length === 2) for (var n = 0, i = e.length, o; n < i; n++)
    (o || !(n in e)) && (o || (o = Array.prototype.slice.call(e, 0, n)), o[n] = e[n]);
  return A.concat(o || e);
}
var Xr = (
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
), Rc = function(A, e) {
  return Xr.fromClientRect(A, e.getBoundingClientRect());
}, _N = function(A) {
  var e = A.body, t = A.documentElement;
  if (!e || !t)
    throw new Error("Unable to get document size");
  var n = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth)), i = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
  return new Xr(0, 0, n, i);
}, kc = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var o = A.charCodeAt(t++);
      (o & 64512) === 56320 ? e.push(((i & 1023) << 10) + (o & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, ot = function() {
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
}, im = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", xN = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var wl = 0; wl < im.length; wl++)
  xN[im.charCodeAt(wl)] = wl;
var am = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", us = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ml = 0; ml < am.length; ml++)
  us[am.charCodeAt(ml)] = ml;
var IN = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, o, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), m = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    o = us[A.charCodeAt(n)], l = us[A.charCodeAt(n + 1)], f = us[A.charCodeAt(n + 2)], c = us[A.charCodeAt(n + 3)], m[i++] = o << 2 | l >> 4, m[i++] = (l & 15) << 4 | f >> 2, m[i++] = (f & 3) << 6 | c & 63;
  return h;
}, HN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, SN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ra = 5, jp = 11, Fh = 2, LN = jp - ra, ny = 65536 >> ra, TN = 1 << ra, Uh = TN - 1, DN = 1024 >> ra, ON = ny + DN, NN = ON, MN = 32, PN = NN + MN, KN = 65536 >> jp, RN = 1 << LN, kN = RN - 1, om = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, $N = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, GN = function(A, e) {
  var t = IN(A), n = Array.isArray(t) ? SN(t) : new Uint32Array(t), i = Array.isArray(t) ? HN(t) : new Uint16Array(t), o = 24, l = om(i, o / 2, n[4] / 2), f = n[5] === 2 ? om(i, (o + n[4]) / 2) : $N(n, Math.ceil((o + n[4]) / 4));
  return new VN(n[0], n[1], n[2], n[3], l, f);
}, VN = (
  /** @class */
  function() {
    function A(e, t, n, i, o, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = o, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> ra], t = (t << Fh) + (e & Uh), this.data[t];
        if (e <= 65535)
          return t = this.index[ny + (e - 55296 >> ra)], t = (t << Fh) + (e & Uh), this.data[t];
        if (e < this.highStart)
          return t = PN - KN + (e >> jp), t = this.index[t], t += e >> ra & kN, t = this.index[t], t = (t << Fh) + (e & Uh), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), sm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", WN = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var vl = 0; vl < sm.length; vl++)
  WN[sm.charCodeAt(vl)] = vl;
var XN = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", um = 50, qN = 1, ry = 2, iy = 3, zN = 4, JN = 5, lm = 7, ay = 8, cm = 9, vi = 10, vd = 11, fm = 12, yd = 13, jN = 14, ls = 15, Cd = 16, yl = 17, es = 18, YN = 19, hm = 20, Qd = 21, ts = 22, Eh = 23, Pa = 24, un = 25, cs = 26, fs = 27, Ka = 28, ZN = 29, Zi = 30, AM = 31, Cl = 32, Ql = 33, Fd = 34, Ud = 35, Ed = 36, Ms = 37, bd = 38, jl = 39, Yl = 40, bh = 41, oy = 42, eM = 43, tM = [9001, 65288], sy = "!", Qe = "×", Fl = "÷", _d = GN(XN), Nr = [Zi, Ed], xd = [qN, ry, iy, JN], uy = [vi, ay], dm = [fs, cs], nM = xd.concat(uy), pm = [bd, jl, Yl, Fd, Ud], rM = [ls, yd], iM = function(A, e) {
  e === void 0 && (e = "strict");
  var t = [], n = [], i = [];
  return A.forEach(function(o, l) {
    var f = _d.get(o);
    if (f > um ? (i.push(!0), f -= um) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(o) !== -1)
      return n.push(l), t.push(Cd);
    if (f === zN || f === vd) {
      if (l === 0)
        return n.push(l), t.push(Zi);
      var c = t[l - 1];
      return nM.indexOf(c) === -1 ? (n.push(n[l - 1]), t.push(c)) : (n.push(l), t.push(Zi));
    }
    if (n.push(l), f === AM)
      return t.push(e === "strict" ? Qd : Ms);
    if (f === oy || f === ZN)
      return t.push(Zi);
    if (f === eM)
      return o >= 131072 && o <= 196605 || o >= 196608 && o <= 262141 ? t.push(Ms) : t.push(Zi);
    t.push(f);
  }), [n, t, i];
}, _h = function(A, e, t, n) {
  var i = n[t];
  if (Array.isArray(A) ? A.indexOf(i) !== -1 : A === i)
    for (var o = t; o <= n.length; ) {
      o++;
      var l = n[o];
      if (l === e)
        return !0;
      if (l !== vi)
        break;
    }
  if (i === vi)
    for (var o = t; o > 0; ) {
      o--;
      var f = n[o];
      if (Array.isArray(A) ? A.indexOf(f) !== -1 : A === f)
        for (var c = t; c <= n.length; ) {
          c++;
          var l = n[c];
          if (l === e)
            return !0;
          if (l !== vi)
            break;
        }
      if (f !== vi)
        break;
    }
  return !1;
}, gm = function(A, e) {
  for (var t = A; t >= 0; ) {
    var n = e[t];
    if (n === vi)
      t--;
    else
      return n;
  }
  return 0;
}, aM = function(A, e, t, n, i) {
  if (t[n] === 0)
    return Qe;
  var o = n - 1;
  if (Array.isArray(i) && i[o] === !0)
    return Qe;
  var l = o - 1, f = o + 1, c = e[o], h = l >= 0 ? e[l] : 0, m = e[f];
  if (c === ry && m === iy)
    return Qe;
  if (xd.indexOf(c) !== -1)
    return sy;
  if (xd.indexOf(m) !== -1 || uy.indexOf(m) !== -1)
    return Qe;
  if (gm(o, e) === ay)
    return Fl;
  if (_d.get(A[o]) === vd || (c === Cl || c === Ql) && _d.get(A[f]) === vd || c === lm || m === lm || c === cm || [vi, yd, ls].indexOf(c) === -1 && m === cm || [yl, es, YN, Pa, Ka].indexOf(m) !== -1 || gm(o, e) === ts || _h(Eh, ts, o, e) || _h([yl, es], Qd, o, e) || _h(fm, fm, o, e))
    return Qe;
  if (c === vi)
    return Fl;
  if (c === Eh || m === Eh)
    return Qe;
  if (m === Cd || c === Cd)
    return Fl;
  if ([yd, ls, Qd].indexOf(m) !== -1 || c === jN || h === Ed && rM.indexOf(c) !== -1 || c === Ka && m === Ed || m === hm || Nr.indexOf(m) !== -1 && c === un || Nr.indexOf(c) !== -1 && m === un || c === fs && [Ms, Cl, Ql].indexOf(m) !== -1 || [Ms, Cl, Ql].indexOf(c) !== -1 && m === cs || Nr.indexOf(c) !== -1 && dm.indexOf(m) !== -1 || dm.indexOf(c) !== -1 && Nr.indexOf(m) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [fs, cs].indexOf(c) !== -1 && (m === un || [ts, ls].indexOf(m) !== -1 && e[f + 1] === un) || // ( OP | HY ) × NU
  [ts, ls].indexOf(c) !== -1 && m === un || // NU ×	(NU | SY | IS)
  c === un && [un, Ka, Pa].indexOf(m) !== -1)
    return Qe;
  if ([un, Ka, Pa, yl, es].indexOf(m) !== -1)
    for (var B = o; B >= 0; ) {
      var g = e[B];
      if (g === un)
        return Qe;
      if ([Ka, Pa].indexOf(g) !== -1)
        B--;
      else
        break;
    }
  if ([fs, cs].indexOf(m) !== -1)
    for (var B = [yl, es].indexOf(c) !== -1 ? l : o; B >= 0; ) {
      var g = e[B];
      if (g === un)
        return Qe;
      if ([Ka, Pa].indexOf(g) !== -1)
        B--;
      else
        break;
    }
  if (bd === c && [bd, jl, Fd, Ud].indexOf(m) !== -1 || [jl, Fd].indexOf(c) !== -1 && [jl, Yl].indexOf(m) !== -1 || [Yl, Ud].indexOf(c) !== -1 && m === Yl || pm.indexOf(c) !== -1 && [hm, cs].indexOf(m) !== -1 || pm.indexOf(m) !== -1 && c === fs || Nr.indexOf(c) !== -1 && Nr.indexOf(m) !== -1 || c === Pa && Nr.indexOf(m) !== -1 || Nr.concat(un).indexOf(c) !== -1 && m === ts && tM.indexOf(A[f]) === -1 || Nr.concat(un).indexOf(m) !== -1 && c === es)
    return Qe;
  if (c === bh && m === bh) {
    for (var v = t[o], u = 1; v > 0 && (v--, e[v] === bh); )
      u++;
    if (u % 2 !== 0)
      return Qe;
  }
  return c === Cl && m === Ql ? Qe : Fl;
}, oM = function(A, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = iM(A, e.lineBreak), n = t[0], i = t[1], o = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(f) {
    return [un, Zi, oy].indexOf(f) !== -1 ? Ms : f;
  }));
  var l = e.wordBreak === "keep-all" ? o.map(function(f, c) {
    return f && A[c] >= 19968 && A[c] <= 40959;
  }) : void 0;
  return [n, i, l];
}, sM = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.codePoints = e, this.required = t === sy, this.start = n, this.end = i;
    }
    return A.prototype.slice = function() {
      return ot.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, A;
  }()
), uM = function(A, e) {
  var t = kc(A), n = oM(t, e), i = n[0], o = n[1], l = n[2], f = t.length, c = 0, h = 0;
  return {
    next: function() {
      if (h >= f)
        return { done: !0, value: null };
      for (var m = Qe; h < f && (m = aM(t, o, i, ++h, l)) === Qe; )
        ;
      if (m !== Qe || h === f) {
        var B = new sM(t, m, c, h);
        return c = h, { value: B, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, lM = 1, cM = 2, zs = 4, Bm = 8, mc = 10, wm = 47, Fs = 92, fM = 9, hM = 32, Ul = 34, ns = 61, dM = 35, pM = 36, gM = 37, El = 39, bl = 40, rs = 41, BM = 95, Zt = 45, wM = 33, mM = 60, vM = 62, yM = 64, CM = 91, QM = 93, FM = 61, UM = 123, _l = 63, EM = 125, mm = 124, bM = 126, _M = 128, vm = 65533, xh = 42, ea = 43, xM = 44, IM = 58, HM = 59, Ps = 46, SM = 0, LM = 8, TM = 11, DM = 14, OM = 31, NM = 127, or = -1, ly = 48, cy = 97, fy = 101, MM = 102, PM = 117, KM = 122, hy = 65, dy = 69, py = 70, RM = 85, kM = 90, Ot = function(A) {
  return A >= ly && A <= 57;
}, $M = function(A) {
  return A >= 55296 && A <= 57343;
}, Ra = function(A) {
  return Ot(A) || A >= hy && A <= py || A >= cy && A <= MM;
}, GM = function(A) {
  return A >= cy && A <= KM;
}, VM = function(A) {
  return A >= hy && A <= kM;
}, WM = function(A) {
  return GM(A) || VM(A);
}, XM = function(A) {
  return A >= _M;
}, xl = function(A) {
  return A === mc || A === fM || A === hM;
}, vc = function(A) {
  return WM(A) || XM(A) || A === BM;
}, ym = function(A) {
  return vc(A) || Ot(A) || A === Zt;
}, qM = function(A) {
  return A >= SM && A <= LM || A === TM || A >= DM && A <= OM || A === NM;
}, Bi = function(A, e) {
  return A !== Fs ? !1 : e !== mc;
}, Il = function(A, e, t) {
  return A === Zt ? vc(e) || Bi(e, t) : vc(A) ? !0 : !!(A === Fs && Bi(A, e));
}, Ih = function(A, e, t) {
  return A === ea || A === Zt ? Ot(e) ? !0 : e === Ps && Ot(t) : Ot(A === Ps ? e : A);
}, zM = function(A) {
  var e = 0, t = 1;
  (A[e] === ea || A[e] === Zt) && (A[e] === Zt && (t = -1), e++);
  for (var n = []; Ot(A[e]); )
    n.push(A[e++]);
  var i = n.length ? parseInt(ot.apply(void 0, n), 10) : 0;
  A[e] === Ps && e++;
  for (var o = []; Ot(A[e]); )
    o.push(A[e++]);
  var l = o.length, f = l ? parseInt(ot.apply(void 0, o), 10) : 0;
  (A[e] === dy || A[e] === fy) && e++;
  var c = 1;
  (A[e] === ea || A[e] === Zt) && (A[e] === Zt && (c = -1), e++);
  for (var h = []; Ot(A[e]); )
    h.push(A[e++]);
  var m = h.length ? parseInt(ot.apply(void 0, h), 10) : 0;
  return t * (i + f * Math.pow(10, -l)) * Math.pow(10, c * m);
}, JM = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, jM = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, YM = {
  type: 4
  /* COMMA_TOKEN */
}, ZM = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, AP = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, eP = {
  type: 21
  /* COLUMN_TOKEN */
}, tP = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, nP = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, rP = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, iP = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, aP = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Hl = {
  type: 23
  /* BAD_URL_TOKEN */
}, oP = {
  type: 1
  /* BAD_STRING_TOKEN */
}, sP = {
  type: 25
  /* CDO_TOKEN */
}, uP = {
  type: 24
  /* CDC_TOKEN */
}, lP = {
  type: 26
  /* COLON_TOKEN */
}, cP = {
  type: 27
  /* SEMICOLON_TOKEN */
}, fP = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, hP = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, dP = {
  type: 31
  /* WHITESPACE_TOKEN */
}, Id = {
  type: 32
  /* EOF_TOKEN */
}, gy = (
  /** @class */
  function() {
    function A() {
      this._value = [];
    }
    return A.prototype.write = function(e) {
      this._value = this._value.concat(kc(e));
    }, A.prototype.read = function() {
      for (var e = [], t = this.consumeToken(); t !== Id; )
        e.push(t), t = this.consumeToken();
      return e;
    }, A.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case Ul:
          return this.consumeStringToken(Ul);
        case dM:
          var t = this.peekCodePoint(0), n = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (ym(t) || Bi(n, i)) {
            var o = Il(t, n, i) ? cM : lM, l = this.consumeName();
            return { type: 5, value: l, flags: o };
          }
          break;
        case pM:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), ZM;
          break;
        case El:
          return this.consumeStringToken(El);
        case bl:
          return JM;
        case rs:
          return jM;
        case xh:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), aP;
          break;
        case ea:
          if (Ih(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case xM:
          return YM;
        case Zt:
          var f = e, c = this.peekCodePoint(0), h = this.peekCodePoint(1);
          if (Ih(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (Il(f, c, h))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (c === Zt && h === vM)
            return this.consumeCodePoint(), this.consumeCodePoint(), uP;
          break;
        case Ps:
          if (Ih(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case wm:
          if (this.peekCodePoint(0) === xh)
            for (this.consumeCodePoint(); ; ) {
              var m = this.consumeCodePoint();
              if (m === xh && (m = this.consumeCodePoint(), m === wm))
                return this.consumeToken();
              if (m === or)
                return this.consumeToken();
            }
          break;
        case IM:
          return lP;
        case HM:
          return cP;
        case mM:
          if (this.peekCodePoint(0) === wM && this.peekCodePoint(1) === Zt && this.peekCodePoint(2) === Zt)
            return this.consumeCodePoint(), this.consumeCodePoint(), sP;
          break;
        case yM:
          var B = this.peekCodePoint(0), g = this.peekCodePoint(1), v = this.peekCodePoint(2);
          if (Il(B, g, v)) {
            var l = this.consumeName();
            return { type: 7, value: l };
          }
          break;
        case CM:
          return fP;
        case Fs:
          if (Bi(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case QM:
          return hP;
        case FM:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), AP;
          break;
        case UM:
          return rP;
        case EM:
          return iP;
        case PM:
        case RM:
          var u = this.peekCodePoint(0), C = this.peekCodePoint(1);
          return u === ea && (Ra(C) || C === _l) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case mm:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), tP;
          if (this.peekCodePoint(0) === mm)
            return this.consumeCodePoint(), eP;
          break;
        case bM:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), nP;
          break;
        case or:
          return Id;
      }
      return xl(e) ? (this.consumeWhiteSpace(), dP) : Ot(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : vc(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: ot(e) };
    }, A.prototype.consumeCodePoint = function() {
      var e = this._value.shift();
      return typeof e > "u" ? -1 : e;
    }, A.prototype.reconsumeCodePoint = function(e) {
      this._value.unshift(e);
    }, A.prototype.peekCodePoint = function(e) {
      return e >= this._value.length ? -1 : this._value[e];
    }, A.prototype.consumeUnicodeRangeToken = function() {
      for (var e = [], t = this.consumeCodePoint(); Ra(t) && e.length < 6; )
        e.push(t), t = this.consumeCodePoint();
      for (var n = !1; t === _l && e.length < 6; )
        e.push(t), t = this.consumeCodePoint(), n = !0;
      if (n) {
        var i = parseInt(ot.apply(void 0, e.map(function(c) {
          return c === _l ? ly : c;
        })), 16), o = parseInt(ot.apply(void 0, e.map(function(c) {
          return c === _l ? py : c;
        })), 16);
        return { type: 30, start: i, end: o };
      }
      var l = parseInt(ot.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === Zt && Ra(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var f = []; Ra(t) && f.length < 6; )
          f.push(t), t = this.consumeCodePoint();
        var o = parseInt(ot.apply(void 0, f), 16);
        return { type: 30, start: l, end: o };
      } else
        return { type: 30, start: l, end: l };
    }, A.prototype.consumeIdentLikeToken = function() {
      var e = this.consumeName();
      return e.toLowerCase() === "url" && this.peekCodePoint(0) === bl ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === bl ? (this.consumeCodePoint(), { type: 19, value: e }) : { type: 20, value: e };
    }, A.prototype.consumeUrlToken = function() {
      var e = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === or)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === El || t === Ul) {
        var n = this.consumeStringToken(this.consumeCodePoint());
        return n.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === or || this.peekCodePoint(0) === rs) ? (this.consumeCodePoint(), { type: 22, value: n.value }) : (this.consumeBadUrlRemnants(), Hl);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === or || i === rs)
          return { type: 22, value: ot.apply(void 0, e) };
        if (xl(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === or || this.peekCodePoint(0) === rs ? (this.consumeCodePoint(), { type: 22, value: ot.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), Hl);
        if (i === Ul || i === El || i === bl || qM(i))
          return this.consumeBadUrlRemnants(), Hl;
        if (i === Fs)
          if (Bi(i, this.peekCodePoint(0)))
            e.push(this.consumeEscapedCodePoint());
          else
            return this.consumeBadUrlRemnants(), Hl;
        else
          e.push(i);
      }
    }, A.prototype.consumeWhiteSpace = function() {
      for (; xl(this.peekCodePoint(0)); )
        this.consumeCodePoint();
    }, A.prototype.consumeBadUrlRemnants = function() {
      for (; ; ) {
        var e = this.consumeCodePoint();
        if (e === rs || e === or)
          return;
        Bi(e, this.peekCodePoint(0)) && this.consumeEscapedCodePoint();
      }
    }, A.prototype.consumeStringSlice = function(e) {
      for (var t = 5e4, n = ""; e > 0; ) {
        var i = Math.min(t, e);
        n += ot.apply(void 0, this._value.splice(0, i)), e -= i;
      }
      return this._value.shift(), n;
    }, A.prototype.consumeStringToken = function(e) {
      var t = "", n = 0;
      do {
        var i = this._value[n];
        if (i === or || i === void 0 || i === e)
          return t += this.consumeStringSlice(n), { type: 0, value: t };
        if (i === mc)
          return this._value.splice(0, n), oP;
        if (i === Fs) {
          var o = this._value[n + 1];
          o !== or && o !== void 0 && (o === mc ? (t += this.consumeStringSlice(n), n = -1, this._value.shift()) : Bi(i, o) && (t += this.consumeStringSlice(n), t += ot(this.consumeEscapedCodePoint()), n = -1));
        }
        n++;
      } while (!0);
    }, A.prototype.consumeNumber = function() {
      var e = [], t = zs, n = this.peekCodePoint(0);
      for ((n === ea || n === Zt) && e.push(this.consumeCodePoint()); Ot(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Ps && Ot(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Bm; Ot(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var o = this.peekCodePoint(2);
      if ((n === dy || n === fy) && ((i === ea || i === Zt) && Ot(o) || Ot(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Bm; Ot(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [zM(e), t];
    }, A.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], n = e[1], i = this.peekCodePoint(0), o = this.peekCodePoint(1), l = this.peekCodePoint(2);
      if (Il(i, o, l)) {
        var f = this.consumeName();
        return { type: 15, number: t, flags: n, unit: f };
      }
      return i === gM ? (this.consumeCodePoint(), { type: 16, number: t, flags: n }) : { type: 17, number: t, flags: n };
    }, A.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if (Ra(e)) {
        for (var t = ot(e); Ra(this.peekCodePoint(0)) && t.length < 6; )
          t += ot(this.consumeCodePoint());
        xl(this.peekCodePoint(0)) && this.consumeCodePoint();
        var n = parseInt(t, 16);
        return n === 0 || $M(n) || n > 1114111 ? vm : n;
      }
      return e === or ? vm : e;
    }, A.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (ym(t))
          e += ot(t);
        else if (Bi(t, this.peekCodePoint(0)))
          e += ot(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, A;
  }()
), By = (
  /** @class */
  function() {
    function A(e) {
      this._tokens = e;
    }
    return A.create = function(e) {
      var t = new gy();
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
        if (n.type === 32 || gP(n, e))
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
      return typeof e > "u" ? Id : e;
    }, A.prototype.reconsumeToken = function(e) {
      this._tokens.unshift(e);
    }, A;
  }()
), Js = function(A) {
  return A.type === 15;
}, wo = function(A) {
  return A.type === 17;
}, Re = function(A) {
  return A.type === 20;
}, pP = function(A) {
  return A.type === 0;
}, Hd = function(A, e) {
  return Re(A) && A.value === e;
}, wy = function(A) {
  return A.type !== 31;
}, ho = function(A) {
  return A.type !== 31 && A.type !== 4;
}, Br = function(A) {
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
}, gP = function(A, e) {
  return e === 11 && A.type === 12 || e === 28 && A.type === 29 ? !0 : e === 2 && A.type === 3;
}, Ei = function(A) {
  return A.type === 17 || A.type === 15;
}, ut = function(A) {
  return A.type === 16 || Ei(A);
}, my = function(A) {
  return A.length > 1 ? [A[0], A[1]] : [A[0]];
}, Ut = {
  type: 17,
  number: 0,
  flags: zs
}, Yp = {
  type: 16,
  number: 50,
  flags: zs
}, yi = {
  type: 16,
  number: 100,
  flags: zs
}, hs = function(A, e, t) {
  var n = A[0], i = A[1];
  return [We(n, e), We(typeof i < "u" ? i : n, t)];
}, We = function(A, e) {
  if (A.type === 16)
    return A.number / 100 * e;
  if (Js(A))
    switch (A.unit) {
      case "rem":
      case "em":
        return 16 * A.number;
      case "px":
      default:
        return A.number;
    }
  return A.number;
}, vy = "deg", yy = "grad", Cy = "rad", Qy = "turn", $c = {
  name: "angle",
  parse: function(A, e) {
    if (e.type === 15)
      switch (e.unit) {
        case vy:
          return Math.PI * e.number / 180;
        case yy:
          return Math.PI / 200 * e.number;
        case Cy:
          return e.number;
        case Qy:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, Fy = function(A) {
  return A.type === 15 && (A.unit === vy || A.unit === yy || A.unit === Cy || A.unit === Qy);
}, Uy = function(A) {
  var e = A.filter(Re).map(function(t) {
    return t.value;
  }).join(" ");
  switch (e) {
    case "to bottom right":
    case "to right bottom":
    case "left top":
    case "top left":
      return [Ut, Ut];
    case "to top":
    case "bottom":
      return Qn(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [Ut, yi];
    case "to right":
    case "left":
      return Qn(90);
    case "to top left":
    case "to left top":
    case "right bottom":
    case "bottom right":
      return [yi, yi];
    case "to bottom":
    case "top":
      return Qn(180);
    case "to top right":
    case "to right top":
    case "left bottom":
    case "bottom left":
      return [yi, Ut];
    case "to left":
    case "right":
      return Qn(270);
  }
  return 0;
}, Qn = function(A) {
  return Math.PI * A / 180;
}, Fi = {
  name: "color",
  parse: function(A, e) {
    if (e.type === 18) {
      var t = BP[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + e.name + '"');
      return t(A, e.values);
    }
    if (e.type === 5) {
      if (e.value.length === 3) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), o = e.value.substring(2, 3);
        return Ci(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(o + o, 16), 1);
      }
      if (e.value.length === 4) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), o = e.value.substring(2, 3), l = e.value.substring(3, 4);
        return Ci(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(o + o, 16), parseInt(l + l, 16) / 255);
      }
      if (e.value.length === 6) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), o = e.value.substring(4, 6);
        return Ci(parseInt(n, 16), parseInt(i, 16), parseInt(o, 16), 1);
      }
      if (e.value.length === 8) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), o = e.value.substring(4, 6), l = e.value.substring(6, 8);
        return Ci(parseInt(n, 16), parseInt(i, 16), parseInt(o, 16), parseInt(l, 16) / 255);
      }
    }
    if (e.type === 20) {
      var f = $r[e.value.toUpperCase()];
      if (typeof f < "u")
        return f;
    }
    return $r.TRANSPARENT;
  }
}, Ui = function(A) {
  return (255 & A) === 0;
}, Bt = function(A) {
  var e = 255 & A, t = 255 & A >> 8, n = 255 & A >> 16, i = 255 & A >> 24;
  return e < 255 ? "rgba(" + i + "," + n + "," + t + "," + e / 255 + ")" : "rgb(" + i + "," + n + "," + t + ")";
}, Ci = function(A, e, t, n) {
  return (A << 24 | e << 16 | t << 8 | Math.round(n * 255) << 0) >>> 0;
}, Cm = function(A, e) {
  if (A.type === 17)
    return A.number;
  if (A.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? A.number / 100 * t : Math.round(A.number / 100 * t);
  }
  return 0;
}, Qm = function(A, e) {
  var t = e.filter(ho);
  if (t.length === 3) {
    var n = t.map(Cm), i = n[0], o = n[1], l = n[2];
    return Ci(i, o, l, 1);
  }
  if (t.length === 4) {
    var f = t.map(Cm), i = f[0], o = f[1], l = f[2], c = f[3];
    return Ci(i, o, l, c);
  }
  return 0;
};
function Hh(A, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - A) * t * 6 + A : t < 1 / 2 ? e : t < 2 / 3 ? (e - A) * 6 * (2 / 3 - t) + A : A;
}
var Fm = function(A, e) {
  var t = e.filter(ho), n = t[0], i = t[1], o = t[2], l = t[3], f = (n.type === 17 ? Qn(n.number) : $c.parse(A, n)) / (Math.PI * 2), c = ut(i) ? i.number / 100 : 0, h = ut(o) ? o.number / 100 : 0, m = typeof l < "u" && ut(l) ? We(l, 1) : 1;
  if (c === 0)
    return Ci(h * 255, h * 255, h * 255, 1);
  var B = h <= 0.5 ? h * (c + 1) : h + c - h * c, g = h * 2 - B, v = Hh(g, B, f + 1 / 3), u = Hh(g, B, f), C = Hh(g, B, f - 1 / 3);
  return Ci(v * 255, u * 255, C * 255, m);
}, BP = {
  hsl: Fm,
  hsla: Fm,
  rgb: Qm,
  rgba: Qm
}, Us = function(A, e) {
  return Fi.parse(A, By.create(e).parseComponentValue());
}, $r = {
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
}, wP = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (Re(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, mP = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Gc = function(A, e) {
  var t = Fi.parse(A, e[0]), n = e[1];
  return n && ut(n) ? { color: t, stop: n } : { color: t, stop: null };
}, Um = function(A, e) {
  var t = A[0], n = A[A.length - 1];
  t.stop === null && (t.stop = Ut), n.stop === null && (n.stop = yi);
  for (var i = [], o = 0, l = 0; l < A.length; l++) {
    var f = A[l].stop;
    if (f !== null) {
      var c = We(f, e);
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
}, vP = function(A, e, t) {
  var n = e / 2, i = t / 2, o = We(A[0], e) - n, l = i - We(A[1], t);
  return (Math.atan2(l, o) + Math.PI * 2) % (Math.PI * 2);
}, yP = function(A, e, t) {
  var n = typeof A == "number" ? A : vP(A, e, t), i = Math.abs(e * Math.sin(n)) + Math.abs(t * Math.cos(n)), o = e / 2, l = t / 2, f = i / 2, c = Math.sin(n - Math.PI / 2) * f, h = Math.cos(n - Math.PI / 2) * f;
  return [i, o - h, o + h, l - c, l + c];
}, $n = function(A, e) {
  return Math.sqrt(A * A + e * e);
}, Em = function(A, e, t, n, i) {
  var o = [
    [0, 0],
    [0, e],
    [A, 0],
    [A, e]
  ];
  return o.reduce(function(l, f) {
    var c = f[0], h = f[1], m = $n(t - c, n - h);
    return (i ? m < l.optimumDistance : m > l.optimumDistance) ? {
      optimumCorner: f,
      optimumDistance: m
    } : l;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, CP = function(A, e, t, n, i) {
  var o = 0, l = 0;
  switch (A.size) {
    case 0:
      A.shape === 0 ? o = l = Math.min(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (o = Math.min(Math.abs(e), Math.abs(e - n)), l = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (A.shape === 0)
        o = l = Math.min($n(e, t), $n(e, t - i), $n(e - n, t), $n(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - n)), c = Em(n, i, e, t, !0), h = c[0], m = c[1];
        o = $n(h - e, (m - t) / f), l = f * o;
      }
      break;
    case 1:
      A.shape === 0 ? o = l = Math.max(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (o = Math.max(Math.abs(e), Math.abs(e - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (A.shape === 0)
        o = l = Math.max($n(e, t), $n(e, t - i), $n(e - n, t), $n(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - n)), B = Em(n, i, e, t, !1), h = B[0], m = B[1];
        o = $n(h - e, (m - t) / f), l = f * o;
      }
      break;
  }
  return Array.isArray(A.size) && (o = We(A.size[0], n), l = A.size.length === 2 ? We(A.size[1], i) : o), [o, l];
}, QP = function(A, e) {
  var t = Qn(180), n = [];
  return Br(e).forEach(function(i, o) {
    if (o === 0) {
      var l = i[0];
      if (l.type === 20 && l.value === "to") {
        t = Uy(i);
        return;
      } else if (Fy(l)) {
        t = $c.parse(A, l);
        return;
      }
    }
    var f = Gc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Sl = function(A, e) {
  var t = Qn(180), n = [];
  return Br(e).forEach(function(i, o) {
    if (o === 0) {
      var l = i[0];
      if (l.type === 20 && ["top", "left", "right", "bottom"].indexOf(l.value) !== -1) {
        t = Uy(i);
        return;
      } else if (Fy(l)) {
        t = ($c.parse(A, l) + Qn(270)) % Qn(360);
        return;
      }
    }
    var f = Gc(A, i);
    n.push(f);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, FP = function(A, e) {
  var t = Qn(180), n = [], i = 1, o = 0, l = 3, f = [];
  return Br(e).forEach(function(c, h) {
    var m = c[0];
    if (h === 0) {
      if (Re(m) && m.value === "linear") {
        i = 1;
        return;
      } else if (Re(m) && m.value === "radial") {
        i = 2;
        return;
      }
    }
    if (m.type === 18) {
      if (m.name === "from") {
        var B = Fi.parse(A, m.values[0]);
        n.push({ stop: Ut, color: B });
      } else if (m.name === "to") {
        var B = Fi.parse(A, m.values[0]);
        n.push({ stop: yi, color: B });
      } else if (m.name === "color-stop") {
        var g = m.values.filter(ho);
        if (g.length === 2) {
          var B = Fi.parse(A, g[1]), v = g[0];
          wo(v) && n.push({
            stop: { type: 16, number: v.number * 100, flags: v.flags },
            color: B
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + Qn(180)) % Qn(360),
    stops: n,
    type: i
  } : { size: l, shape: o, stops: n, position: f, type: i };
}, Ey = "closest-side", by = "farthest-side", _y = "closest-corner", xy = "farthest-corner", Iy = "circle", Hy = "ellipse", Sy = "cover", Ly = "contain", UP = function(A, e) {
  var t = 0, n = 3, i = [], o = [];
  return Br(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0) {
      var h = !1;
      c = l.reduce(function(B, g) {
        if (h)
          if (Re(g))
            switch (g.value) {
              case "center":
                return o.push(Yp), B;
              case "top":
              case "left":
                return o.push(Ut), B;
              case "right":
              case "bottom":
                return o.push(yi), B;
            }
          else (ut(g) || Ei(g)) && o.push(g);
        else if (Re(g))
          switch (g.value) {
            case Iy:
              return t = 0, !1;
            case Hy:
              return t = 1, !1;
            case "at":
              return h = !0, !1;
            case Ey:
              return n = 0, !1;
            case Sy:
            case by:
              return n = 1, !1;
            case Ly:
            case _y:
              return n = 2, !1;
            case xy:
              return n = 3, !1;
          }
        else if (Ei(g) || ut(g))
          return Array.isArray(n) || (n = []), n.push(g), !1;
        return B;
      }, c);
    }
    if (c) {
      var m = Gc(A, l);
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
}, Ll = function(A, e) {
  var t = 0, n = 3, i = [], o = [];
  return Br(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0 ? c = l.reduce(function(m, B) {
      if (Re(B))
        switch (B.value) {
          case "center":
            return o.push(Yp), !1;
          case "top":
          case "left":
            return o.push(Ut), !1;
          case "right":
          case "bottom":
            return o.push(yi), !1;
        }
      else if (ut(B) || Ei(B))
        return o.push(B), !1;
      return m;
    }, c) : f === 1 && (c = l.reduce(function(m, B) {
      if (Re(B))
        switch (B.value) {
          case Iy:
            return t = 0, !1;
          case Hy:
            return t = 1, !1;
          case Ly:
          case Ey:
            return n = 0, !1;
          case by:
            return n = 1, !1;
          case _y:
            return n = 2, !1;
          case Sy:
          case xy:
            return n = 3, !1;
        }
      else if (Ei(B) || ut(B))
        return Array.isArray(n) || (n = []), n.push(B), !1;
      return m;
    }, c)), c) {
      var h = Gc(A, l);
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
}, EP = function(A) {
  return A.type === 1;
}, bP = function(A) {
  return A.type === 2;
}, Zp = {
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
      var n = Ty[e.name];
      if (typeof n > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return n(A, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function _P(A) {
  return !(A.type === 20 && A.value === "none") && (A.type !== 18 || !!Ty[A.name]);
}
var Ty = {
  "linear-gradient": QP,
  "-moz-linear-gradient": Sl,
  "-ms-linear-gradient": Sl,
  "-o-linear-gradient": Sl,
  "-webkit-linear-gradient": Sl,
  "radial-gradient": UP,
  "-moz-radial-gradient": Ll,
  "-ms-radial-gradient": Ll,
  "-o-radial-gradient": Ll,
  "-webkit-radial-gradient": Ll,
  "-webkit-gradient": FP
}, xP = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(n) {
      return ho(n) && _P(n);
    }).map(function(n) {
      return Zp.parse(A, n);
    });
  }
}, IP = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (Re(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, HP = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return Br(e).map(function(t) {
      return t.filter(ut);
    }).map(my);
  }
}, SP = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return Br(e).map(function(t) {
      return t.filter(Re).map(function(n) {
        return n.value;
      }).join(" ");
    }).map(LP);
  }
}, LP = function(A) {
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
}, to;
(function(A) {
  A.AUTO = "auto", A.CONTAIN = "contain", A.COVER = "cover";
})(to || (to = {}));
var TP = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return Br(e).map(function(t) {
      return t.filter(DP);
    });
  }
}, DP = function(A) {
  return Re(A) || ut(A);
}, Vc = function(A) {
  return {
    name: "border-" + A + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, OP = Vc("top"), NP = Vc("right"), MP = Vc("bottom"), PP = Vc("left"), Wc = function(A) {
  return {
    name: "border-radius-" + A,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return my(t.filter(ut));
    }
  };
}, KP = Wc("top-left"), RP = Wc("top-right"), kP = Wc("bottom-right"), $P = Wc("bottom-left"), Xc = function(A) {
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
}, GP = Xc("top"), VP = Xc("right"), WP = Xc("bottom"), XP = Xc("left"), qc = function(A) {
  return {
    name: "border-" + A + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return Js(t) ? t.number : 0;
    }
  };
}, qP = qc("top"), zP = qc("right"), JP = qc("bottom"), jP = qc("left"), YP = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, ZP = {
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
}, AK = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Re).reduce(
      function(t, n) {
        return t | eK(n.value);
      },
      0
      /* NONE */
    );
  }
}, eK = function(A) {
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
}, tK = {
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
}, nK = {
  name: "letter-spacing",
  initialValue: "0",
  prefix: !1,
  type: 0,
  parse: function(A, e) {
    return e.type === 20 && e.value === "normal" ? 0 : e.type === 17 || e.type === 15 ? e.number : 0;
  }
}, yc;
(function(A) {
  A.NORMAL = "normal", A.STRICT = "strict";
})(yc || (yc = {}));
var rK = {
  name: "line-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "strict":
        return yc.STRICT;
      case "normal":
      default:
        return yc.NORMAL;
    }
  }
}, iK = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, bm = function(A, e) {
  return Re(A) && A.value === "normal" ? 1.2 * e : A.type === 17 ? e * A.number : ut(A) ? We(A, e) : e;
}, aK = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return e.type === 20 && e.value === "none" ? null : Zp.parse(A, e);
  }
}, oK = {
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
}, Sd = {
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
}, zc = function(A) {
  return {
    name: "margin-" + A,
    initialValue: "0",
    prefix: !1,
    type: 4
    /* TOKEN_VALUE */
  };
}, sK = zc("top"), uK = zc("right"), lK = zc("bottom"), cK = zc("left"), fK = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Re).map(function(t) {
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
}, hK = {
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
}, Jc = function(A) {
  return {
    name: "padding-" + A,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, dK = Jc("top"), pK = Jc("right"), gK = Jc("bottom"), BK = Jc("left"), wK = {
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
}, mK = {
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
}, vK = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Hd(e[0], "none") ? [] : Br(e).map(function(t) {
      for (var n = {
        color: $r.TRANSPARENT,
        offsetX: Ut,
        offsetY: Ut,
        blur: Ut
      }, i = 0, o = 0; o < t.length; o++) {
        var l = t[o];
        Ei(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = Fi.parse(A, l);
      }
      return n;
    });
  }
}, yK = {
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
}, CK = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = UK[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, QK = function(A) {
  var e = A.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, FK = function(A) {
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
}, UK = {
  matrix: QK,
  matrix3d: FK
}, _m = {
  type: 16,
  number: 50,
  flags: zs
}, EK = [_m, _m], bK = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    var t = e.filter(ut);
    return t.length !== 2 ? EK : [t[0], t[1]];
  }
}, _K = {
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
}, Es;
(function(A) {
  A.NORMAL = "normal", A.BREAK_ALL = "break-all", A.KEEP_ALL = "keep-all";
})(Es || (Es = {}));
var xK = {
  name: "word-break",
  initialValue: "normal",
  prefix: !1,
  type: 2,
  parse: function(A, e) {
    switch (e) {
      case "break-all":
        return Es.BREAK_ALL;
      case "keep-all":
        return Es.KEEP_ALL;
      case "normal":
      default:
        return Es.NORMAL;
    }
  }
}, IK = {
  name: "z-index",
  initialValue: "auto",
  prefix: !1,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20)
      return { auto: !0, order: 0 };
    if (wo(e))
      return { auto: !1, order: e.number };
    throw new Error("Invalid z-index number parsed");
  }
}, Dy = {
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
}, HK = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return wo(e) ? e.number : 1;
  }
}, SK = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, LK = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Re).map(function(t) {
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
}, TK = {
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
}, DK = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, OK = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    if (wo(e))
      return e.number;
    if (Re(e))
      switch (e.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    return 400;
  }
}, NK = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.filter(Re).map(function(t) {
      return t.value;
    });
  }
}, MK = {
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
}, ht = function(A, e) {
  return (A & e) !== 0;
}, PK = {
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
}, KK = {
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
    for (var n = [], i = e.filter(wy), o = 0; o < i.length; o++) {
      var l = i[o], f = i[o + 1];
      if (l.type === 20) {
        var c = f && wo(f) ? f.number : 1;
        n.push({ counter: l.value, increment: c });
      }
    }
    return n;
  }
}, RK = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    for (var t = [], n = e.filter(wy), i = 0; i < n.length; i++) {
      var o = n[i], l = n[i + 1];
      if (Re(o) && o.value !== "none") {
        var f = l && wo(l) ? l.number : 0;
        t.push({ counter: o.value, reset: f });
      }
    }
    return t;
  }
}, kK = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Js).map(function(t) {
      return Dy.parse(A, t);
    });
  }
}, $K = {
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
    var n = [], i = e.filter(pP);
    if (i.length % 2 !== 0)
      return null;
    for (var o = 0; o < i.length; o += 2) {
      var l = i[o].value, f = i[o + 1].value;
      n.push({ open: l, close: f });
    }
    return n;
  }
}, xm = function(A, e, t) {
  if (!A)
    return "";
  var n = A[Math.min(e, A.length - 1)];
  return n ? t ? n.open : n.close : "";
}, GK = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Hd(e[0], "none") ? [] : Br(e).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: Ut,
        offsetY: Ut,
        blur: Ut,
        spread: Ut,
        inset: !1
      }, i = 0, o = 0; o < t.length; o++) {
        var l = t[o];
        Hd(l, "inset") ? n.inset = !0 : Ei(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = Fi.parse(A, l);
      }
      return n;
    });
  }
}, VK = {
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
    return e.filter(Re).forEach(function(i) {
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
}, WK = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, XK = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return Js(e) ? e.number : 0;
  }
}, qK = (
  /** @class */
  function() {
    function A(e, t) {
      var n, i;
      this.animationDuration = NA(e, kK, t.animationDuration), this.backgroundClip = NA(e, wP, t.backgroundClip), this.backgroundColor = NA(e, mP, t.backgroundColor), this.backgroundImage = NA(e, xP, t.backgroundImage), this.backgroundOrigin = NA(e, IP, t.backgroundOrigin), this.backgroundPosition = NA(e, HP, t.backgroundPosition), this.backgroundRepeat = NA(e, SP, t.backgroundRepeat), this.backgroundSize = NA(e, TP, t.backgroundSize), this.borderTopColor = NA(e, OP, t.borderTopColor), this.borderRightColor = NA(e, NP, t.borderRightColor), this.borderBottomColor = NA(e, MP, t.borderBottomColor), this.borderLeftColor = NA(e, PP, t.borderLeftColor), this.borderTopLeftRadius = NA(e, KP, t.borderTopLeftRadius), this.borderTopRightRadius = NA(e, RP, t.borderTopRightRadius), this.borderBottomRightRadius = NA(e, kP, t.borderBottomRightRadius), this.borderBottomLeftRadius = NA(e, $P, t.borderBottomLeftRadius), this.borderTopStyle = NA(e, GP, t.borderTopStyle), this.borderRightStyle = NA(e, VP, t.borderRightStyle), this.borderBottomStyle = NA(e, WP, t.borderBottomStyle), this.borderLeftStyle = NA(e, XP, t.borderLeftStyle), this.borderTopWidth = NA(e, qP, t.borderTopWidth), this.borderRightWidth = NA(e, zP, t.borderRightWidth), this.borderBottomWidth = NA(e, JP, t.borderBottomWidth), this.borderLeftWidth = NA(e, jP, t.borderLeftWidth), this.boxShadow = NA(e, GK, t.boxShadow), this.color = NA(e, YP, t.color), this.direction = NA(e, ZP, t.direction), this.display = NA(e, AK, t.display), this.float = NA(e, tK, t.cssFloat), this.fontFamily = NA(e, TK, t.fontFamily), this.fontSize = NA(e, DK, t.fontSize), this.fontStyle = NA(e, MK, t.fontStyle), this.fontVariant = NA(e, NK, t.fontVariant), this.fontWeight = NA(e, OK, t.fontWeight), this.letterSpacing = NA(e, nK, t.letterSpacing), this.lineBreak = NA(e, rK, t.lineBreak), this.lineHeight = NA(e, iK, t.lineHeight), this.listStyleImage = NA(e, aK, t.listStyleImage), this.listStylePosition = NA(e, oK, t.listStylePosition), this.listStyleType = NA(e, Sd, t.listStyleType), this.marginTop = NA(e, sK, t.marginTop), this.marginRight = NA(e, uK, t.marginRight), this.marginBottom = NA(e, lK, t.marginBottom), this.marginLeft = NA(e, cK, t.marginLeft), this.opacity = NA(e, HK, t.opacity);
      var o = NA(e, fK, t.overflow);
      this.overflowX = o[0], this.overflowY = o[o.length > 1 ? 1 : 0], this.overflowWrap = NA(e, hK, t.overflowWrap), this.paddingTop = NA(e, dK, t.paddingTop), this.paddingRight = NA(e, pK, t.paddingRight), this.paddingBottom = NA(e, gK, t.paddingBottom), this.paddingLeft = NA(e, BK, t.paddingLeft), this.paintOrder = NA(e, VK, t.paintOrder), this.position = NA(e, mK, t.position), this.textAlign = NA(e, wK, t.textAlign), this.textDecorationColor = NA(e, SK, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = NA(e, LK, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = NA(e, vK, t.textShadow), this.textTransform = NA(e, yK, t.textTransform), this.transform = NA(e, CK, t.transform), this.transformOrigin = NA(e, bK, t.transformOrigin), this.visibility = NA(e, _K, t.visibility), this.webkitTextStrokeColor = NA(e, WK, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = NA(e, XK, t.webkitTextStrokeWidth), this.wordBreak = NA(e, xK, t.wordBreak), this.zIndex = NA(e, IK, t.zIndex);
    }
    return A.prototype.isVisible = function() {
      return this.display > 0 && this.opacity > 0 && this.visibility === 0;
    }, A.prototype.isTransparent = function() {
      return Ui(this.backgroundColor);
    }, A.prototype.isTransformed = function() {
      return this.transform !== null;
    }, A.prototype.isPositioned = function() {
      return this.position !== 0;
    }, A.prototype.isPositionedWithZIndex = function() {
      return this.isPositioned() && !this.zIndex.auto;
    }, A.prototype.isFloating = function() {
      return this.float !== 0;
    }, A.prototype.isInlineLevel = function() {
      return ht(
        this.display,
        4
        /* INLINE */
      ) || ht(
        this.display,
        33554432
        /* INLINE_BLOCK */
      ) || ht(
        this.display,
        268435456
        /* INLINE_FLEX */
      ) || ht(
        this.display,
        536870912
        /* INLINE_GRID */
      ) || ht(
        this.display,
        67108864
        /* INLINE_LIST_ITEM */
      ) || ht(
        this.display,
        134217728
        /* INLINE_TABLE */
      );
    }, A;
  }()
), zK = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.content = NA(e, PK, t.content), this.quotes = NA(e, $K, t.quotes);
    }
    return A;
  }()
), Im = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.counterIncrement = NA(e, KK, t.counterIncrement), this.counterReset = NA(e, RK, t.counterReset);
    }
    return A;
  }()
), NA = function(A, e, t) {
  var n = new gy(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  n.write(i);
  var o = new By(n.read());
  switch (e.type) {
    case 2:
      var l = o.parseComponentValue();
      return e.parse(A, Re(l) ? l.value : e.initialValue);
    case 0:
      return e.parse(A, o.parseComponentValue());
    case 1:
      return e.parse(A, o.parseComponentValues());
    case 4:
      return o.parseComponentValue();
    case 3:
      switch (e.format) {
        case "angle":
          return $c.parse(A, o.parseComponentValue());
        case "color":
          return Fi.parse(A, o.parseComponentValue());
        case "image":
          return Zp.parse(A, o.parseComponentValue());
        case "length":
          var f = o.parseComponentValue();
          return Ei(f) ? f : Ut;
        case "length-percentage":
          var c = o.parseComponentValue();
          return ut(c) ? c : Ut;
        case "time":
          return Dy.parse(A, o.parseComponentValue());
      }
      break;
  }
}, JK = "data-html2canvas-debug", jK = function(A) {
  var e = A.getAttribute(JK);
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
}, Ld = function(A, e) {
  var t = jK(A);
  return t === 1 || e === t;
}, wr = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, Ld(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new qK(e, window.getComputedStyle(t, null)), Od(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = Rc(this.context, t), Ld(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return A;
  }()
), YK = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", Hm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ds = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Tl = 0; Tl < Hm.length; Tl++)
  ds[Hm.charCodeAt(Tl)] = Tl;
var ZK = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, o, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var h = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), m = Array.isArray(h) ? h : new Uint8Array(h);
  for (n = 0; n < t; n += 4)
    o = ds[A.charCodeAt(n)], l = ds[A.charCodeAt(n + 1)], f = ds[A.charCodeAt(n + 2)], c = ds[A.charCodeAt(n + 3)], m[i++] = o << 2 | l >> 4, m[i++] = (l & 15) << 4 | f >> 2, m[i++] = (f & 3) << 6 | c & 63;
  return h;
}, AR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, eR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ia = 5, Ag = 11, Sh = 2, tR = Ag - ia, Oy = 65536 >> ia, nR = 1 << ia, Lh = nR - 1, rR = 1024 >> ia, iR = Oy + rR, aR = iR, oR = 32, sR = aR + oR, uR = 65536 >> Ag, lR = 1 << tR, cR = lR - 1, Sm = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, fR = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, hR = function(A, e) {
  var t = ZK(A), n = Array.isArray(t) ? eR(t) : new Uint32Array(t), i = Array.isArray(t) ? AR(t) : new Uint16Array(t), o = 24, l = Sm(i, o / 2, n[4] / 2), f = n[5] === 2 ? Sm(i, (o + n[4]) / 2) : fR(n, Math.ceil((o + n[4]) / 4));
  return new dR(n[0], n[1], n[2], n[3], l, f);
}, dR = (
  /** @class */
  function() {
    function A(e, t, n, i, o, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = o, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> ia], t = (t << Sh) + (e & Lh), this.data[t];
        if (e <= 65535)
          return t = this.index[Oy + (e - 55296 >> ia)], t = (t << Sh) + (e & Lh), this.data[t];
        if (e < this.highStart)
          return t = sR - uR + (e >> Ag), t = this.index[t], t += e >> ia & cR, t = this.index[t], t = (t << Sh) + (e & Lh), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Lm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", pR = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Dl = 0; Dl < Lm.length; Dl++)
  pR[Lm.charCodeAt(Dl)] = Dl;
var gR = 1, Th = 2, Dh = 3, Tm = 4, Dm = 5, BR = 7, Om = 8, Oh = 9, Nh = 10, Nm = 11, Mm = 12, Pm = 13, Km = 14, Mh = 15, wR = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var o = A.charCodeAt(t++);
      (o & 64512) === 56320 ? e.push(((i & 1023) << 10) + (o & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, mR = function() {
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
}, vR = hR(YK), vn = "×", Ph = "÷", yR = function(A) {
  return vR.get(A);
}, CR = function(A, e, t) {
  var n = t - 2, i = e[n], o = e[t - 1], l = e[t];
  if (o === Th && l === Dh)
    return vn;
  if (o === Th || o === Dh || o === Tm || l === Th || l === Dh || l === Tm)
    return Ph;
  if (o === Om && [Om, Oh, Nm, Mm].indexOf(l) !== -1 || (o === Nm || o === Oh) && (l === Oh || l === Nh) || (o === Mm || o === Nh) && l === Nh || l === Pm || l === Dm || l === BR || o === gR)
    return vn;
  if (o === Pm && l === Km) {
    for (; i === Dm; )
      i = e[--n];
    if (i === Km)
      return vn;
  }
  if (o === Mh && l === Mh) {
    for (var f = 0; i === Mh; )
      f++, i = e[--n];
    if (f % 2 === 0)
      return vn;
  }
  return Ph;
}, QR = function(A) {
  var e = wR(A), t = e.length, n = 0, i = 0, o = e.map(yR);
  return {
    next: function() {
      if (n >= t)
        return { done: !0, value: null };
      for (var l = vn; n < t && (l = CR(e, o, ++n)) === vn; )
        ;
      if (l !== vn || n === t) {
        var f = mR.apply(null, e.slice(i, n));
        return i = n, { value: f, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, FR = function(A) {
  for (var e = QR(A), t = [], n; !(n = e.next()).done; )
    n.value && t.push(n.value.slice());
  return t;
}, UR = function(A) {
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
}, ER = function(A) {
  var e = A.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", A.body.appendChild(e);
  var t = A.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = e.firstChild, i = kc(n.data).map(function(c) {
    return ot(c);
  }), o = 0, l = {}, f = i.every(function(c, h) {
    t.setStart(n, o), t.setEnd(n, o + c.length);
    var m = t.getBoundingClientRect();
    o += c.length;
    var B = m.x > l.x || m.y > l.y;
    return l = m, h === 0 ? !0 : B;
  });
  return A.body.removeChild(e), f;
}, bR = function() {
  return typeof new Image().crossOrigin < "u";
}, _R = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, xR = function(A) {
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
}, Rm = function(A) {
  return A[0] === 0 && A[1] === 255 && A[2] === 0 && A[3] === 255;
}, IR = function(A) {
  var e = A.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var n = e.getContext("2d");
  if (!n)
    return Promise.reject(!1);
  n.fillStyle = "rgb(0, 255, 0)", n.fillRect(0, 0, t, t);
  var i = new Image(), o = e.toDataURL();
  i.src = o;
  var l = Td(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), km(l).then(function(f) {
    n.drawImage(f, 0, 0);
    var c = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var h = A.createElement("div");
    return h.style.backgroundImage = "url(" + o + ")", h.style.height = t + "px", Rm(c) ? km(Td(t, t, 0, 0, h)) : Promise.reject(!1);
  }).then(function(f) {
    return n.drawImage(f, 0, 0), Rm(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Td = function(A, e, t, n, i) {
  var o = "http://www.w3.org/2000/svg", l = document.createElementNS(o, "svg"), f = document.createElementNS(o, "foreignObject");
  return l.setAttributeNS(null, "width", A.toString()), l.setAttributeNS(null, "height", e.toString()), f.setAttributeNS(null, "width", "100%"), f.setAttributeNS(null, "height", "100%"), f.setAttributeNS(null, "x", t.toString()), f.setAttributeNS(null, "y", n.toString()), f.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(f), f.appendChild(i), l;
}, km = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      return e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, Qt = {
  get SUPPORT_RANGE_BOUNDS() {
    var A = UR(document);
    return Object.defineProperty(Qt, "SUPPORT_RANGE_BOUNDS", { value: A }), A;
  },
  get SUPPORT_WORD_BREAKING() {
    var A = Qt.SUPPORT_RANGE_BOUNDS && ER(document);
    return Object.defineProperty(Qt, "SUPPORT_WORD_BREAKING", { value: A }), A;
  },
  get SUPPORT_SVG_DRAWING() {
    var A = xR(document);
    return Object.defineProperty(Qt, "SUPPORT_SVG_DRAWING", { value: A }), A;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var A = typeof Array.from == "function" && typeof window.fetch == "function" ? IR(document) : Promise.resolve(!1);
    return Object.defineProperty(Qt, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A }), A;
  },
  get SUPPORT_CORS_IMAGES() {
    var A = bR();
    return Object.defineProperty(Qt, "SUPPORT_CORS_IMAGES", { value: A }), A;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var A = _R();
    return Object.defineProperty(Qt, "SUPPORT_RESPONSE_TYPE", { value: A }), A;
  },
  get SUPPORT_CORS_XHR() {
    var A = "withCredentials" in new XMLHttpRequest();
    return Object.defineProperty(Qt, "SUPPORT_CORS_XHR", { value: A }), A;
  },
  get SUPPORT_NATIVE_TEXT_SEGMENTATION() {
    var A = !!(typeof Intl < "u" && Intl.Segmenter);
    return Object.defineProperty(Qt, "SUPPORT_NATIVE_TEXT_SEGMENTATION", { value: A }), A;
  }
}, bs = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.text = e, this.bounds = t;
    }
    return A;
  }()
), HR = function(A, e, t, n) {
  var i = TR(e, t), o = [], l = 0;
  return i.forEach(function(f) {
    if (t.textDecorationLine.length || f.trim().length > 0)
      if (Qt.SUPPORT_RANGE_BOUNDS) {
        var c = $m(n, l, f.length).getClientRects();
        if (c.length > 1) {
          var h = eg(f), m = 0;
          h.forEach(function(g) {
            o.push(new bs(g, Xr.fromDOMRectList(A, $m(n, m + l, g.length).getClientRects()))), m += g.length;
          });
        } else
          o.push(new bs(f, Xr.fromDOMRectList(A, c)));
      } else {
        var B = n.splitText(f.length);
        o.push(new bs(f, SR(A, n))), n = B;
      }
    else Qt.SUPPORT_RANGE_BOUNDS || (n = n.splitText(f.length));
    l += f.length;
  }), o;
}, SR = function(A, e) {
  var t = e.ownerDocument;
  if (t) {
    var n = t.createElement("html2canvaswrapper");
    n.appendChild(e.cloneNode(!0));
    var i = e.parentNode;
    if (i) {
      i.replaceChild(n, e);
      var o = Rc(A, n);
      return n.firstChild && i.replaceChild(n.firstChild, n), o;
    }
  }
  return Xr.EMPTY;
}, $m = function(A, e, t) {
  var n = A.ownerDocument;
  if (!n)
    throw new Error("Node has no owner document");
  var i = n.createRange();
  return i.setStart(A, e), i.setEnd(A, e + t), i;
}, eg = function(A) {
  if (Qt.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(A)).map(function(t) {
      return t.segment;
    });
  }
  return FR(A);
}, LR = function(A, e) {
  if (Qt.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(A)).map(function(n) {
      return n.segment;
    });
  }
  return OR(A, e);
}, TR = function(A, e) {
  return e.letterSpacing !== 0 ? eg(A) : LR(A, e);
}, DR = [32, 160, 4961, 65792, 65793, 4153, 4241], OR = function(A, e) {
  for (var t = uM(A, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), n = [], i, o = function() {
    if (i.value) {
      var l = i.value.slice(), f = kc(l), c = "";
      f.forEach(function(h) {
        DR.indexOf(h) === -1 ? c += ot(h) : (c.length && n.push(c), n.push(ot(h)), c = "");
      }), c.length && n.push(c);
    }
  }; !(i = t.next()).done; )
    o();
  return n;
}, NR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.text = MR(t.data, n.textTransform), this.textBounds = HR(e, this.text, n, t);
    }
    return A;
  }()
), MR = function(A, e) {
  switch (e) {
    case 1:
      return A.toLowerCase();
    case 3:
      return A.replace(PR, KR);
    case 2:
      return A.toUpperCase();
    default:
      return A;
  }
}, PR = /(^|\s|:|-|\(|\))([a-z])/g, KR = function(A, e, t) {
  return A.length > 0 ? e + t.toUpperCase() : A;
}, Ny = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.src = n.currentSrc || n.src, i.intrinsicWidth = n.naturalWidth, i.intrinsicHeight = n.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(wr)
), My = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n, i.intrinsicWidth = n.width, i.intrinsicHeight = n.height, i;
    }
    return e;
  }(wr)
), Py = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, o = new XMLSerializer(), l = Rc(t, n);
      return n.setAttribute("width", l.width + "px"), n.setAttribute("height", l.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(o.serializeToString(n)), i.intrinsicWidth = n.width.baseVal.value, i.intrinsicHeight = n.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(wr)
), Ky = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(wr)
), Dd = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.start = n.start, i.reversed = typeof n.reversed == "boolean" && n.reversed === !0, i;
    }
    return e;
  }(wr)
), RR = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], kR = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], $R = function(A) {
  return A.width > A.height ? new Xr(A.left + (A.width - A.height) / 2, A.top, A.height, A.height) : A.width < A.height ? new Xr(A.left, A.top + (A.height - A.width) / 2, A.width, A.width) : A;
}, GR = function(A) {
  var e = A.type === VR ? new Array(A.value.length + 1).join("•") : A.value;
  return e.length === 0 ? A.placeholder || "" : e;
}, Cc = "checkbox", Qc = "radio", VR = "password", Gm = 707406591, tg = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      switch (i.type = n.type.toLowerCase(), i.checked = n.checked, i.value = GR(n), (i.type === Cc || i.type === Qc) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = $R(i.bounds)), i.type) {
        case Cc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = RR;
          break;
        case Qc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = kR;
          break;
      }
      return i;
    }
    return e;
  }(wr)
), Ry = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, o = n.options[n.selectedIndex || 0];
      return i.value = o && o.text || "", i;
    }
    return e;
  }(wr)
), ky = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(wr)
), $y = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      i.src = n.src, i.width = parseInt(n.width, 10) || 0, i.height = parseInt(n.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (n.contentWindow && n.contentWindow.document && n.contentWindow.document.documentElement) {
          i.tree = Vy(t, n.contentWindow.document.documentElement);
          var o = n.contentWindow.document.documentElement ? Us(t, getComputedStyle(n.contentWindow.document.documentElement).backgroundColor) : $r.TRANSPARENT, l = n.contentWindow.document.body ? Us(t, getComputedStyle(n.contentWindow.document.body).backgroundColor) : $r.TRANSPARENT;
          i.backgroundColor = Ui(o) ? Ui(l) ? i.styles.backgroundColor : l : o;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(wr)
), WR = ["OL", "UL", "MENU"], Zl = function(A, e, t, n) {
  for (var i = e.firstChild, o = void 0; i; i = o)
    if (o = i.nextSibling, Wy(i) && i.data.trim().length > 0)
      t.textNodes.push(new NR(A, i, t.styles));
    else if (ja(i))
      if (Jy(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(f) {
          return Zl(A, f, t, n);
        });
      else {
        var l = Gy(A, i);
        l.styles.isVisible() && (XR(i, l, n) ? l.flags |= 4 : qR(l.styles) && (l.flags |= 2), WR.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Zl(A, i.shadowRoot, l, n) : !Fc(i) && !Xy(i) && !Uc(i) && Zl(A, i, l, n));
      }
}, Gy = function(A, e) {
  return Nd(e) ? new Ny(A, e) : qy(e) ? new My(A, e) : Xy(e) ? new Py(A, e) : zR(e) ? new Ky(A, e) : JR(e) ? new Dd(A, e) : jR(e) ? new tg(A, e) : Uc(e) ? new Ry(A, e) : Fc(e) ? new ky(A, e) : zy(e) ? new $y(A, e) : new wr(A, e);
}, Vy = function(A, e) {
  var t = Gy(A, e);
  return t.flags |= 4, Zl(A, e, t, t), t;
}, XR = function(A, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || ng(A) && t.styles.isTransparent();
}, qR = function(A) {
  return A.isPositioned() || A.isFloating();
}, Wy = function(A) {
  return A.nodeType === Node.TEXT_NODE;
}, ja = function(A) {
  return A.nodeType === Node.ELEMENT_NODE;
}, Od = function(A) {
  return ja(A) && typeof A.style < "u" && !Ac(A);
}, Ac = function(A) {
  return typeof A.className == "object";
}, zR = function(A) {
  return A.tagName === "LI";
}, JR = function(A) {
  return A.tagName === "OL";
}, jR = function(A) {
  return A.tagName === "INPUT";
}, YR = function(A) {
  return A.tagName === "HTML";
}, Xy = function(A) {
  return A.tagName === "svg";
}, ng = function(A) {
  return A.tagName === "BODY";
}, qy = function(A) {
  return A.tagName === "CANVAS";
}, Vm = function(A) {
  return A.tagName === "VIDEO";
}, Nd = function(A) {
  return A.tagName === "IMG";
}, zy = function(A) {
  return A.tagName === "IFRAME";
}, Wm = function(A) {
  return A.tagName === "STYLE";
}, ZR = function(A) {
  return A.tagName === "SCRIPT";
}, Fc = function(A) {
  return A.tagName === "TEXTAREA";
}, Uc = function(A) {
  return A.tagName === "SELECT";
}, Jy = function(A) {
  return A.tagName === "SLOT";
}, Xm = function(A) {
  return A.tagName.indexOf("-") > 0;
}, Ak = (
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
), qm = {
  integers: [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  values: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
}, zm = {
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
}, ek = {
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
}, ka = function(A, e, t, n, i, o) {
  return A < e || A > t ? Ks(A, i, o.length > 0) : n.integers.reduce(function(l, f, c) {
    for (; A >= f; )
      A -= f, l += n.values[c];
    return l;
  }, "") + o;
}, jy = function(A, e, t, n) {
  var i = "";
  do
    t || A--, i = n(A) + i, A /= e;
  while (A * e >= e);
  return i;
}, it = function(A, e, t, n, i) {
  var o = t - e + 1;
  return (A < 0 ? "-" : "") + (jy(Math.abs(A), o, n, function(l) {
    return ot(Math.floor(l % o) + e);
  }) + i);
}, Xi = function(A, e, t) {
  t === void 0 && (t = ". ");
  var n = e.length;
  return jy(Math.abs(A), n, !1, function(i) {
    return e[Math.floor(i % n)];
  }) + t;
}, qa = 1, pi = 2, gi = 4, ps = 8, Mr = function(A, e, t, n, i, o) {
  if (A < -9999 || A > 9999)
    return Ks(A, 4, i.length > 0);
  var l = Math.abs(A), f = i;
  if (l === 0)
    return e[0] + f;
  for (var c = 0; l > 0 && c <= 4; c++) {
    var h = l % 10;
    h === 0 && ht(o, qa) && f !== "" ? f = e[h] + f : h > 1 || h === 1 && c === 0 || h === 1 && c === 1 && ht(o, pi) || h === 1 && c === 1 && ht(o, gi) && A > 100 || h === 1 && c > 1 && ht(o, ps) ? f = e[h] + (c > 0 ? t[c - 1] : "") + f : h === 1 && c > 0 && (f = t[c - 1] + f), l = Math.floor(l / 10);
  }
  return (A < 0 ? n : "") + f;
}, Jm = "十百千萬", jm = "拾佰仟萬", Ym = "マイナス", Kh = "마이너스", Ks = function(A, e, t) {
  var n = t ? ". " : "", i = t ? "、" : "", o = t ? ", " : "", l = t ? " " : "";
  switch (e) {
    case 0:
      return "•" + l;
    case 1:
      return "◦" + l;
    case 2:
      return "◾" + l;
    case 5:
      var f = it(A, 48, 57, !0, n);
      return f.length < 4 ? "0" + f : f;
    case 4:
      return Xi(A, "〇一二三四五六七八九", i);
    case 6:
      return ka(A, 1, 3999, qm, 3, n).toLowerCase();
    case 7:
      return ka(A, 1, 3999, qm, 3, n);
    case 8:
      return it(A, 945, 969, !1, n);
    case 9:
      return it(A, 97, 122, !1, n);
    case 10:
      return it(A, 65, 90, !1, n);
    case 11:
      return it(A, 1632, 1641, !0, n);
    case 12:
    case 49:
      return ka(A, 1, 9999, zm, 3, n);
    case 35:
      return ka(A, 1, 9999, zm, 3, n).toLowerCase();
    case 13:
      return it(A, 2534, 2543, !0, n);
    case 14:
    case 30:
      return it(A, 6112, 6121, !0, n);
    case 15:
      return Xi(A, "子丑寅卯辰巳午未申酉戌亥", i);
    case 16:
      return Xi(A, "甲乙丙丁戊己庚辛壬癸", i);
    case 17:
    case 48:
      return Mr(A, "零一二三四五六七八九", Jm, "負", i, pi | gi | ps);
    case 47:
      return Mr(A, "零壹貳參肆伍陸柒捌玖", jm, "負", i, qa | pi | gi | ps);
    case 42:
      return Mr(A, "零一二三四五六七八九", Jm, "负", i, pi | gi | ps);
    case 41:
      return Mr(A, "零壹贰叁肆伍陆柒捌玖", jm, "负", i, qa | pi | gi | ps);
    case 26:
      return Mr(A, "〇一二三四五六七八九", "十百千万", Ym, i, 0);
    case 25:
      return Mr(A, "零壱弐参四伍六七八九", "拾百千万", Ym, i, qa | pi | gi);
    case 31:
      return Mr(A, "영일이삼사오육칠팔구", "십백천만", Kh, o, qa | pi | gi);
    case 33:
      return Mr(A, "零一二三四五六七八九", "十百千萬", Kh, o, 0);
    case 32:
      return Mr(A, "零壹貳參四五六七八九", "拾百千", Kh, o, qa | pi | gi);
    case 18:
      return it(A, 2406, 2415, !0, n);
    case 20:
      return ka(A, 1, 19999, tk, 3, n);
    case 21:
      return it(A, 2790, 2799, !0, n);
    case 22:
      return it(A, 2662, 2671, !0, n);
    case 22:
      return ka(A, 1, 10999, ek, 3, n);
    case 23:
      return Xi(A, "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");
    case 24:
      return Xi(A, "いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");
    case 27:
      return it(A, 3302, 3311, !0, n);
    case 28:
      return Xi(A, "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン", i);
    case 29:
      return Xi(A, "イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス", i);
    case 34:
      return it(A, 3792, 3801, !0, n);
    case 37:
      return it(A, 6160, 6169, !0, n);
    case 38:
      return it(A, 4160, 4169, !0, n);
    case 39:
      return it(A, 2918, 2927, !0, n);
    case 40:
      return it(A, 1776, 1785, !0, n);
    case 43:
      return it(A, 3046, 3055, !0, n);
    case 44:
      return it(A, 3174, 3183, !0, n);
    case 45:
      return it(A, 3664, 3673, !0, n);
    case 46:
      return it(A, 3872, 3881, !0, n);
    case 3:
    default:
      return it(A, 48, 57, !0, n);
  }
}, Yy = "data-html2canvas-ignore", Zm = (
  /** @class */
  function() {
    function A(e, t, n) {
      if (this.context = e, this.options = n, this.scrolledElements = [], this.referenceElement = t, this.counters = new Ak(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return A.prototype.toIFrame = function(e, t) {
      var n = this, i = nk(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var o = e.defaultView.pageXOffset, l = e.defaultView.pageYOffset, f = i.contentWindow, c = f.document, h = ak(i).then(function() {
        return Gt(n, void 0, void 0, function() {
          var m, B;
          return Dt(this, function(g) {
            switch (g.label) {
              case 0:
                return this.scrolledElements.forEach(lk), f && (f.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (f.scrollY !== t.top || f.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(f.scrollX - t.left, f.scrollY - t.top, 0, 0))), m = this.options.onclone, B = this.clonedReferenceElement, typeof B > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : c.fonts && c.fonts.ready ? [4, c.fonts.ready] : [3, 2];
              case 1:
                g.sent(), g.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, ik(c)] : [3, 4];
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
      return c.open(), c.write(sk(document.doctype) + "<html></html>"), uk(this.referenceElement.ownerDocument, o, l), c.replaceChild(c.adoptNode(this.documentElement), c.documentElement), c.close(), h;
    }, A.prototype.createElementClone = function(e) {
      if (Ld(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (qy(e))
        return this.createCanvasClone(e);
      if (Vm(e))
        return this.createVideoClone(e);
      if (Wm(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return Nd(t) && (Nd(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Xm(t) ? this.createCustomElementClone(t) : t;
    }, A.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return Rh(e.style, t), t;
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
      (!ja(t) || !ZR(t) && !t.hasAttribute(Yy) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !ja(t) || !Wm(t)) && e.appendChild(this.cloneNode(t, n));
    }, A.prototype.cloneChildNodes = function(e, t, n) {
      for (var i = this, o = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; o; o = o.nextSibling)
        if (ja(o) && Jy(o) && typeof o.assignedNodes == "function") {
          var l = o.assignedNodes();
          l.length && l.forEach(function(f) {
            return i.appendChildNode(t, f, n);
          });
        } else
          this.appendChildNode(t, o, n);
    }, A.prototype.cloneNode = function(e, t) {
      if (Wy(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var n = e.ownerDocument.defaultView;
      if (n && ja(e) && (Od(e) || Ac(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var o = n.getComputedStyle(e), l = n.getComputedStyle(e, ":before"), f = n.getComputedStyle(e, ":after");
        this.referenceElement === e && Od(i) && (this.clonedReferenceElement = i), ng(i) && hk(i);
        var c = this.counters.parse(new Im(this.context, o)), h = this.resolvePseudoContent(e, i, l, _s.BEFORE);
        Xm(e) && (t = !0), Vm(e) || this.cloneChildNodes(e, i, t), h && i.insertBefore(h, i.firstChild);
        var m = this.resolvePseudoContent(e, i, f, _s.AFTER);
        return m && i.appendChild(m), this.counters.pop(c), (o && (this.options.copyStyles || Ac(e)) && !zy(e) || t) && Rh(o, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (Fc(e) || Uc(e)) && (Fc(i) || Uc(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, A.prototype.resolvePseudoContent = function(e, t, n, i) {
      var o = this;
      if (n) {
        var l = n.content, f = t.ownerDocument;
        if (!(!f || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new Im(this.context, n));
          var c = new zK(this.context, n), h = f.createElement("html2canvaspseudoelement");
          Rh(n, h), c.content.forEach(function(B) {
            if (B.type === 0)
              h.appendChild(f.createTextNode(B.value));
            else if (B.type === 22) {
              var g = f.createElement("img");
              g.src = B.value, g.style.opacity = "1", h.appendChild(g);
            } else if (B.type === 18) {
              if (B.name === "attr") {
                var v = B.values.filter(Re);
                v.length && h.appendChild(f.createTextNode(e.getAttribute(v[0].value) || ""));
              } else if (B.name === "counter") {
                var u = B.values.filter(ho), C = u[0], F = u[1];
                if (C && Re(C)) {
                  var U = o.counters.getCounterValue(C.value), H = F && Re(F) ? Sd.parse(o.context, F.value) : 3;
                  h.appendChild(f.createTextNode(Ks(U, H, !1)));
                }
              } else if (B.name === "counters") {
                var O = B.values.filter(ho), C = O[0], _ = O[1], F = O[2];
                if (C && Re(C)) {
                  var M = o.counters.getCounterValues(C.value), K = F && Re(F) ? Sd.parse(o.context, F.value) : 3, z = _ && _.type === 0 ? _.value : "", cA = M.map(function(QA) {
                    return Ks(QA, K, !1);
                  }).join(z);
                  h.appendChild(f.createTextNode(cA));
                }
              }
            } else if (B.type === 20)
              switch (B.value) {
                case "open-quote":
                  h.appendChild(f.createTextNode(xm(c.quotes, o.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  h.appendChild(f.createTextNode(xm(c.quotes, --o.quoteDepth, !1)));
                  break;
                default:
                  h.appendChild(f.createTextNode(B.value));
              }
          }), h.className = Md + " " + Pd;
          var m = i === _s.BEFORE ? " " + Md : " " + Pd;
          return Ac(t) ? t.className.baseValue += m : t.className += m, h;
        }
      }
    }, A.destroy = function(e) {
      return e.parentNode ? (e.parentNode.removeChild(e), !0) : !1;
    }, A;
  }()
), _s;
(function(A) {
  A[A.BEFORE = 0] = "BEFORE", A[A.AFTER = 1] = "AFTER";
})(_s || (_s = {}));
var nk = function(A, e) {
  var t = A.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(Yy, "true"), A.body.appendChild(t), t;
}, rk = function(A) {
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
}, ik = function(A) {
  return Promise.all([].slice.call(A.images, 0).map(rk));
}, ak = function(A) {
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
}, ok = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], Rh = function(A, e) {
  for (var t = A.length - 1; t >= 0; t--) {
    var n = A.item(t);
    ok.indexOf(n) === -1 && e.style.setProperty(n, A.getPropertyValue(n));
  }
  return e;
}, sk = function(A) {
  var e = "";
  return A && (e += "<!DOCTYPE ", A.name && (e += A.name), A.internalSubset && (e += A.internalSubset), A.publicId && (e += '"' + A.publicId + '"'), A.systemId && (e += '"' + A.systemId + '"'), e += ">"), e;
}, uk = function(A, e, t) {
  A && A.defaultView && (e !== A.defaultView.pageXOffset || t !== A.defaultView.pageYOffset) && A.defaultView.scrollTo(e, t);
}, lk = function(A) {
  var e = A[0], t = A[1], n = A[2];
  e.scrollLeft = t, e.scrollTop = n;
}, ck = ":before", fk = ":after", Md = "___html2canvas___pseudoelement_before", Pd = "___html2canvas___pseudoelement_after", Av = `{
    content: "" !important;
    display: none !important;
}`, hk = function(A) {
  dk(A, "." + Md + ck + Av + `
         .` + Pd + fk + Av);
}, dk = function(A, e) {
  var t = A.ownerDocument;
  if (t) {
    var n = t.createElement("style");
    n.textContent = e, A.appendChild(n);
  }
}, Zy = (
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
), pk = (
  /** @class */
  function() {
    function A(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return A.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || ($h(e) || mk(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, A.prototype.match = function(e) {
      return this._cache[e];
    }, A.prototype.loadImage = function(e) {
      return Gt(this, void 0, void 0, function() {
        var t, n, i, o, l = this;
        return Dt(this, function(f) {
          switch (f.label) {
            case 0:
              return t = Zy.isSameOrigin(e), n = !kh(e) && this._options.useCORS === !0 && Qt.SUPPORT_CORS_IMAGES && !t, i = !kh(e) && !t && !$h(e) && typeof this._options.proxy == "string" && Qt.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !kh(e) && !$h(e) && !i && !n ? [
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
                }, m.onerror = h, (vk(o) || n) && (m.crossOrigin = "anonymous"), m.src = o, m.complete === !0 && setTimeout(function() {
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
        var f = Qt.SUPPORT_RESPONSE_TYPE ? "blob" : "text", c = new XMLHttpRequest();
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
), gk = /^data:image\/svg\+xml/i, Bk = /^data:image\/.*;base64,/i, wk = /^data:image\/.*/i, mk = function(A) {
  return Qt.SUPPORT_SVG_DRAWING || !yk(A);
}, kh = function(A) {
  return wk.test(A);
}, vk = function(A) {
  return Bk.test(A);
}, $h = function(A) {
  return A.substr(0, 4) === "blob";
}, yk = function(A) {
  return A.substr(-3).toLowerCase() === "svg" || gk.test(A);
}, LA = (
  /** @class */
  function() {
    function A(e, t) {
      this.type = 0, this.x = e, this.y = t;
    }
    return A.prototype.add = function(e, t) {
      return new A(this.x + e, this.y + t);
    }, A;
  }()
), $a = function(A, e, t) {
  return new LA(A.x + (e.x - A.x) * t, A.y + (e.y - A.y) * t);
}, Ol = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = n, this.end = i;
    }
    return A.prototype.subdivide = function(e, t) {
      var n = $a(this.start, this.startControl, e), i = $a(this.startControl, this.endControl, e), o = $a(this.endControl, this.end, e), l = $a(n, i, e), f = $a(i, o, e), c = $a(l, f, e);
      return t ? new A(this.start, n, l, c) : new A(c, f, o, this.end);
    }, A.prototype.add = function(e, t) {
      return new A(this.start.add(e, t), this.startControl.add(e, t), this.endControl.add(e, t), this.end.add(e, t));
    }, A.prototype.reverse = function() {
      return new A(this.end, this.endControl, this.startControl, this.start);
    }, A;
  }()
), Cn = function(A) {
  return A.type === 1;
}, Ck = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      var t = e.styles, n = e.bounds, i = hs(t.borderTopLeftRadius, n.width, n.height), o = i[0], l = i[1], f = hs(t.borderTopRightRadius, n.width, n.height), c = f[0], h = f[1], m = hs(t.borderBottomRightRadius, n.width, n.height), B = m[0], g = m[1], v = hs(t.borderBottomLeftRadius, n.width, n.height), u = v[0], C = v[1], F = [];
      F.push((o + c) / n.width), F.push((u + B) / n.width), F.push((l + C) / n.height), F.push((h + g) / n.height);
      var U = Math.max.apply(Math, F);
      U > 1 && (o /= U, l /= U, c /= U, h /= U, B /= U, g /= U, u /= U, C /= U);
      var H = n.width - c, O = n.height - g, _ = n.width - B, M = n.height - C, K = t.borderTopWidth, z = t.borderRightWidth, cA = t.borderBottomWidth, sA = t.borderLeftWidth, gA = We(t.paddingTop, e.bounds.width), QA = We(t.paddingRight, e.bounds.width), OA = We(t.paddingBottom, e.bounds.width), _A = We(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = o > 0 || l > 0 ? Je(n.left + sA / 3, n.top + K / 3, o - sA / 3, l - K / 3, Oe.TOP_LEFT) : new LA(n.left + sA / 3, n.top + K / 3), this.topRightBorderDoubleOuterBox = o > 0 || l > 0 ? Je(n.left + H, n.top + K / 3, c - z / 3, h - K / 3, Oe.TOP_RIGHT) : new LA(n.left + n.width - z / 3, n.top + K / 3), this.bottomRightBorderDoubleOuterBox = B > 0 || g > 0 ? Je(n.left + _, n.top + O, B - z / 3, g - cA / 3, Oe.BOTTOM_RIGHT) : new LA(n.left + n.width - z / 3, n.top + n.height - cA / 3), this.bottomLeftBorderDoubleOuterBox = u > 0 || C > 0 ? Je(n.left + sA / 3, n.top + M, u - sA / 3, C - cA / 3, Oe.BOTTOM_LEFT) : new LA(n.left + sA / 3, n.top + n.height - cA / 3), this.topLeftBorderDoubleInnerBox = o > 0 || l > 0 ? Je(n.left + sA * 2 / 3, n.top + K * 2 / 3, o - sA * 2 / 3, l - K * 2 / 3, Oe.TOP_LEFT) : new LA(n.left + sA * 2 / 3, n.top + K * 2 / 3), this.topRightBorderDoubleInnerBox = o > 0 || l > 0 ? Je(n.left + H, n.top + K * 2 / 3, c - z * 2 / 3, h - K * 2 / 3, Oe.TOP_RIGHT) : new LA(n.left + n.width - z * 2 / 3, n.top + K * 2 / 3), this.bottomRightBorderDoubleInnerBox = B > 0 || g > 0 ? Je(n.left + _, n.top + O, B - z * 2 / 3, g - cA * 2 / 3, Oe.BOTTOM_RIGHT) : new LA(n.left + n.width - z * 2 / 3, n.top + n.height - cA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = u > 0 || C > 0 ? Je(n.left + sA * 2 / 3, n.top + M, u - sA * 2 / 3, C - cA * 2 / 3, Oe.BOTTOM_LEFT) : new LA(n.left + sA * 2 / 3, n.top + n.height - cA * 2 / 3), this.topLeftBorderStroke = o > 0 || l > 0 ? Je(n.left + sA / 2, n.top + K / 2, o - sA / 2, l - K / 2, Oe.TOP_LEFT) : new LA(n.left + sA / 2, n.top + K / 2), this.topRightBorderStroke = o > 0 || l > 0 ? Je(n.left + H, n.top + K / 2, c - z / 2, h - K / 2, Oe.TOP_RIGHT) : new LA(n.left + n.width - z / 2, n.top + K / 2), this.bottomRightBorderStroke = B > 0 || g > 0 ? Je(n.left + _, n.top + O, B - z / 2, g - cA / 2, Oe.BOTTOM_RIGHT) : new LA(n.left + n.width - z / 2, n.top + n.height - cA / 2), this.bottomLeftBorderStroke = u > 0 || C > 0 ? Je(n.left + sA / 2, n.top + M, u - sA / 2, C - cA / 2, Oe.BOTTOM_LEFT) : new LA(n.left + sA / 2, n.top + n.height - cA / 2), this.topLeftBorderBox = o > 0 || l > 0 ? Je(n.left, n.top, o, l, Oe.TOP_LEFT) : new LA(n.left, n.top), this.topRightBorderBox = c > 0 || h > 0 ? Je(n.left + H, n.top, c, h, Oe.TOP_RIGHT) : new LA(n.left + n.width, n.top), this.bottomRightBorderBox = B > 0 || g > 0 ? Je(n.left + _, n.top + O, B, g, Oe.BOTTOM_RIGHT) : new LA(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = u > 0 || C > 0 ? Je(n.left, n.top + M, u, C, Oe.BOTTOM_LEFT) : new LA(n.left, n.top + n.height), this.topLeftPaddingBox = o > 0 || l > 0 ? Je(n.left + sA, n.top + K, Math.max(0, o - sA), Math.max(0, l - K), Oe.TOP_LEFT) : new LA(n.left + sA, n.top + K), this.topRightPaddingBox = c > 0 || h > 0 ? Je(n.left + Math.min(H, n.width - z), n.top + K, H > n.width + z ? 0 : Math.max(0, c - z), Math.max(0, h - K), Oe.TOP_RIGHT) : new LA(n.left + n.width - z, n.top + K), this.bottomRightPaddingBox = B > 0 || g > 0 ? Je(n.left + Math.min(_, n.width - sA), n.top + Math.min(O, n.height - cA), Math.max(0, B - z), Math.max(0, g - cA), Oe.BOTTOM_RIGHT) : new LA(n.left + n.width - z, n.top + n.height - cA), this.bottomLeftPaddingBox = u > 0 || C > 0 ? Je(n.left + sA, n.top + Math.min(M, n.height - cA), Math.max(0, u - sA), Math.max(0, C - cA), Oe.BOTTOM_LEFT) : new LA(n.left + sA, n.top + n.height - cA), this.topLeftContentBox = o > 0 || l > 0 ? Je(n.left + sA + _A, n.top + K + gA, Math.max(0, o - (sA + _A)), Math.max(0, l - (K + gA)), Oe.TOP_LEFT) : new LA(n.left + sA + _A, n.top + K + gA), this.topRightContentBox = c > 0 || h > 0 ? Je(n.left + Math.min(H, n.width + sA + _A), n.top + K + gA, H > n.width + sA + _A ? 0 : c - sA + _A, h - (K + gA), Oe.TOP_RIGHT) : new LA(n.left + n.width - (z + QA), n.top + K + gA), this.bottomRightContentBox = B > 0 || g > 0 ? Je(n.left + Math.min(_, n.width - (sA + _A)), n.top + Math.min(O, n.height + K + gA), Math.max(0, B - (z + QA)), g - (cA + OA), Oe.BOTTOM_RIGHT) : new LA(n.left + n.width - (z + QA), n.top + n.height - (cA + OA)), this.bottomLeftContentBox = u > 0 || C > 0 ? Je(n.left + sA + _A, n.top + M, Math.max(0, u - (sA + _A)), C - (cA + OA), Oe.BOTTOM_LEFT) : new LA(n.left + sA + _A, n.top + n.height - (cA + OA));
    }
    return A;
  }()
), Oe;
(function(A) {
  A[A.TOP_LEFT = 0] = "TOP_LEFT", A[A.TOP_RIGHT = 1] = "TOP_RIGHT", A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(Oe || (Oe = {}));
var Je = function(A, e, t, n, i) {
  var o = 4 * ((Math.sqrt(2) - 1) / 3), l = t * o, f = n * o, c = A + t, h = e + n;
  switch (i) {
    case Oe.TOP_LEFT:
      return new Ol(new LA(A, h), new LA(A, h - f), new LA(c - l, e), new LA(c, e));
    case Oe.TOP_RIGHT:
      return new Ol(new LA(A, e), new LA(A + l, e), new LA(c, h - f), new LA(c, h));
    case Oe.BOTTOM_RIGHT:
      return new Ol(new LA(c, e), new LA(c, e + f), new LA(A + l, h), new LA(A, h));
    case Oe.BOTTOM_LEFT:
    default:
      return new Ol(new LA(c, h), new LA(c - l, h), new LA(A, e + f), new LA(A, e));
  }
}, Ec = function(A) {
  return [A.topLeftBorderBox, A.topRightBorderBox, A.bottomRightBorderBox, A.bottomLeftBorderBox];
}, Qk = function(A) {
  return [
    A.topLeftContentBox,
    A.topRightContentBox,
    A.bottomRightContentBox,
    A.bottomLeftContentBox
  ];
}, bc = function(A) {
  return [
    A.topLeftPaddingBox,
    A.topRightPaddingBox,
    A.bottomRightPaddingBox,
    A.bottomLeftPaddingBox
  ];
}, Fk = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.offsetX = e, this.offsetY = t, this.matrix = n, this.type = 0, this.target = 6;
    }
    return A;
  }()
), Nl = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.path = e, this.target = t, this.type = 1;
    }
    return A;
  }()
), Uk = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return A;
  }()
), Ek = function(A) {
  return A.type === 0;
}, AC = function(A) {
  return A.type === 1;
}, bk = function(A) {
  return A.type === 2;
}, ev = function(A, e) {
  return A.length === e.length ? A.some(function(t, n) {
    return t === e[n];
  }) : !1;
}, _k = function(A, e, t, n, i) {
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
}, eC = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return A;
  }()
), tC = (
  /** @class */
  function() {
    function A(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new Ck(this.container), this.container.styles.opacity < 1 && this.effects.push(new Uk(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var n = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, o = this.container.styles.transform;
        this.effects.push(new Fk(n, i, o));
      }
      if (this.container.styles.overflowX !== 0) {
        var l = Ec(this.curves), f = bc(this.curves);
        ev(l, f) ? this.effects.push(new Nl(
          l,
          6
          /* CONTENT */
        )) : (this.effects.push(new Nl(
          l,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new Nl(
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
          return !AC(c);
        });
        if (t || n.container.styles.position !== 0 || !n.parent) {
          if (i.unshift.apply(i, o), t = [
            2,
            3
            /* FIXED */
          ].indexOf(n.container.styles.position) === -1, n.container.styles.overflowX !== 0) {
            var l = Ec(n.curves), f = bc(n.curves);
            ev(l, f) || i.unshift(new Nl(
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
        return ht(c.target, e);
      });
    }, A;
  }()
), Kd = function(A, e, t, n) {
  A.container.elements.forEach(function(i) {
    var o = ht(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), l = ht(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), f = new tC(i, A);
    ht(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && n.push(f);
    var c = ht(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : n;
    if (o || l) {
      var h = o || i.styles.isPositioned() ? t : e, m = new eC(f);
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
      Kd(f, m, o ? m : t, c);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(f) : e.nonInlineLevel.push(f), Kd(f, e, t, c);
    ht(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && nC(i, c);
  });
}, nC = function(A, e) {
  for (var t = A instanceof Dd ? A.start : 1, n = A instanceof Dd ? A.reversed : !1, i = 0; i < e.length; i++) {
    var o = e[i];
    o.container instanceof Ky && typeof o.container.value == "number" && o.container.value !== 0 && (t = o.container.value), o.listValue = Ks(t, o.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, xk = function(A) {
  var e = new tC(A, null), t = new eC(e), n = [];
  return Kd(e, t, t, n), nC(e.container, n), t;
}, tv = function(A, e) {
  switch (e) {
    case 0:
      return Fn(A.topLeftBorderBox, A.topLeftPaddingBox, A.topRightBorderBox, A.topRightPaddingBox);
    case 1:
      return Fn(A.topRightBorderBox, A.topRightPaddingBox, A.bottomRightBorderBox, A.bottomRightPaddingBox);
    case 2:
      return Fn(A.bottomRightBorderBox, A.bottomRightPaddingBox, A.bottomLeftBorderBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return Fn(A.bottomLeftBorderBox, A.bottomLeftPaddingBox, A.topLeftBorderBox, A.topLeftPaddingBox);
  }
}, Ik = function(A, e) {
  switch (e) {
    case 0:
      return Fn(A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox, A.topRightBorderBox, A.topRightBorderDoubleOuterBox);
    case 1:
      return Fn(A.topRightBorderBox, A.topRightBorderDoubleOuterBox, A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox);
    case 2:
      return Fn(A.bottomRightBorderBox, A.bottomRightBorderDoubleOuterBox, A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox);
    case 3:
    default:
      return Fn(A.bottomLeftBorderBox, A.bottomLeftBorderDoubleOuterBox, A.topLeftBorderBox, A.topLeftBorderDoubleOuterBox);
  }
}, Hk = function(A, e) {
  switch (e) {
    case 0:
      return Fn(A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox, A.topRightBorderDoubleInnerBox, A.topRightPaddingBox);
    case 1:
      return Fn(A.topRightBorderDoubleInnerBox, A.topRightPaddingBox, A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox);
    case 2:
      return Fn(A.bottomRightBorderDoubleInnerBox, A.bottomRightPaddingBox, A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox);
    case 3:
    default:
      return Fn(A.bottomLeftBorderDoubleInnerBox, A.bottomLeftPaddingBox, A.topLeftBorderDoubleInnerBox, A.topLeftPaddingBox);
  }
}, Sk = function(A, e) {
  switch (e) {
    case 0:
      return Ml(A.topLeftBorderStroke, A.topRightBorderStroke);
    case 1:
      return Ml(A.topRightBorderStroke, A.bottomRightBorderStroke);
    case 2:
      return Ml(A.bottomRightBorderStroke, A.bottomLeftBorderStroke);
    case 3:
    default:
      return Ml(A.bottomLeftBorderStroke, A.topLeftBorderStroke);
  }
}, Ml = function(A, e) {
  var t = [];
  return Cn(A) ? t.push(A.subdivide(0.5, !1)) : t.push(A), Cn(e) ? t.push(e.subdivide(0.5, !0)) : t.push(e), t;
}, Fn = function(A, e, t, n) {
  var i = [];
  return Cn(A) ? i.push(A.subdivide(0.5, !1)) : i.push(A), Cn(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), Cn(n) ? i.push(n.subdivide(0.5, !0).reverse()) : i.push(n), Cn(e) ? i.push(e.subdivide(0.5, !1).reverse()) : i.push(e), i;
}, rC = function(A) {
  var e = A.bounds, t = A.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, _c = function(A) {
  var e = A.styles, t = A.bounds, n = We(e.paddingLeft, t.width), i = We(e.paddingRight, t.width), o = We(e.paddingTop, t.width), l = We(e.paddingBottom, t.width);
  return t.add(n + e.borderLeftWidth, o + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + n + i), -(e.borderTopWidth + e.borderBottomWidth + o + l));
}, Lk = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? _c(e) : rC(e);
}, Tk = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? _c(e) : rC(e);
}, Gh = function(A, e, t) {
  var n = Lk(za(A.styles.backgroundOrigin, e), A), i = Tk(za(A.styles.backgroundClip, e), A), o = Dk(za(A.styles.backgroundSize, e), t, n), l = o[0], f = o[1], c = hs(za(A.styles.backgroundPosition, e), n.width - l, n.height - f), h = Ok(za(A.styles.backgroundRepeat, e), c, o, n, i), m = Math.round(n.left + c[0]), B = Math.round(n.top + c[1]);
  return [h, m, B, l, f];
}, Ga = function(A) {
  return Re(A) && A.value === to.AUTO;
}, Pl = function(A) {
  return typeof A == "number";
}, Dk = function(A, e, t) {
  var n = e[0], i = e[1], o = e[2], l = A[0], f = A[1];
  if (!l)
    return [0, 0];
  if (ut(l) && f && ut(f))
    return [We(l, t.width), We(f, t.height)];
  var c = Pl(o);
  if (Re(l) && (l.value === to.CONTAIN || l.value === to.COVER)) {
    if (Pl(o)) {
      var h = t.width / t.height;
      return h < o != (l.value === to.COVER) ? [t.width, t.width / o] : [t.height * o, t.height];
    }
    return [t.width, t.height];
  }
  var m = Pl(n), B = Pl(i), g = m || B;
  if (Ga(l) && (!f || Ga(f))) {
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
    var U = 0, H = 0;
    return ut(l) ? U = We(l, t.width) : ut(f) && (H = We(f, t.height)), Ga(l) ? U = H * o : (!f || Ga(f)) && (H = U / o), [U, H];
  }
  var O = null, _ = null;
  if (ut(l) ? O = We(l, t.width) : f && ut(f) && (_ = We(f, t.height)), O !== null && (!f || Ga(f)) && (_ = m && B ? O / n * i : t.height), _ !== null && Ga(l) && (O = m && B ? _ / i * n : t.width), O !== null && _ !== null)
    return [O, _];
  throw new Error("Unable to calculate background-size for element");
}, za = function(A, e) {
  var t = A[e];
  return typeof t > "u" ? A[0] : t;
}, Ok = function(A, e, t, n, i) {
  var o = e[0], l = e[1], f = t[0], c = t[1];
  switch (A) {
    case 2:
      return [
        new LA(Math.round(n.left), Math.round(n.top + l)),
        new LA(Math.round(n.left + n.width), Math.round(n.top + l)),
        new LA(Math.round(n.left + n.width), Math.round(c + n.top + l)),
        new LA(Math.round(n.left), Math.round(c + n.top + l))
      ];
    case 3:
      return [
        new LA(Math.round(n.left + o), Math.round(n.top)),
        new LA(Math.round(n.left + o + f), Math.round(n.top)),
        new LA(Math.round(n.left + o + f), Math.round(n.height + n.top)),
        new LA(Math.round(n.left + o), Math.round(n.height + n.top))
      ];
    case 1:
      return [
        new LA(Math.round(n.left + o), Math.round(n.top + l)),
        new LA(Math.round(n.left + o + f), Math.round(n.top + l)),
        new LA(Math.round(n.left + o + f), Math.round(n.top + l + c)),
        new LA(Math.round(n.left + o), Math.round(n.top + l + c))
      ];
    default:
      return [
        new LA(Math.round(i.left), Math.round(i.top)),
        new LA(Math.round(i.left + i.width), Math.round(i.top)),
        new LA(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new LA(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, Nk = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", nv = "Hidden Text", Mk = (
  /** @class */
  function() {
    function A(e) {
      this._data = {}, this._document = e;
    }
    return A.prototype.parseMetrics = function(e, t) {
      var n = this._document.createElement("div"), i = this._document.createElement("img"), o = this._document.createElement("span"), l = this._document.body;
      n.style.visibility = "hidden", n.style.fontFamily = e, n.style.fontSize = t, n.style.margin = "0", n.style.padding = "0", n.style.whiteSpace = "nowrap", l.appendChild(n), i.src = Nk, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", o.style.fontFamily = e, o.style.fontSize = t, o.style.margin = "0", o.style.padding = "0", o.appendChild(this._document.createTextNode(nv)), n.appendChild(o), n.appendChild(i);
      var f = i.offsetTop - o.offsetTop + 2;
      n.removeChild(o), n.appendChild(this._document.createTextNode(nv)), n.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var c = i.offsetTop - n.offsetTop + 2;
      return l.removeChild(n), { baseline: f, middle: c };
    }, A.prototype.getMetrics = function(e, t) {
      var n = e + " " + t;
      return typeof this._data[n] > "u" && (this._data[n] = this.parseMetrics(e, t)), this._data[n];
    }, A;
  }()
), iC = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.context = e, this.options = t;
    }
    return A;
  }()
), Pk = 1e4, Kk = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i._activeEffects = [], i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), n.canvas || (i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px"), i.fontMetrics = new Mk(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + n.width + "x" + n.height + ") with scale " + n.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var n = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return n.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), bk(t) && (this.ctx.globalAlpha = t.opacity), Ek(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), AC(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n;
        return Dt(this, function(i) {
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
      return Gt(this, void 0, void 0, function() {
        return Dt(this, function(n) {
          switch (n.label) {
            case 0:
              if (ht(
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
        var l = eg(t.text);
        l.reduce(function(f, c) {
          return o.ctx.fillText(c, f, t.bounds.top + i), f + o.ctx.measureText(c).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var n = t.fontVariant.filter(function(l) {
        return l === "normal" || l === "small-caps";
      }).join(""), i = Vk(t.fontFamily).join(", "), o = Js(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, n, t.fontWeight, o, i].join(" "),
        i,
        o
      ];
    }, e.prototype.renderTextNode = function(t, n) {
      return Gt(this, void 0, void 0, function() {
        var i, o, l, f, c, h, m, B, g = this;
        return Dt(this, function(v) {
          return i = this.createFontStyle(n), o = i[0], l = i[1], f = i[2], this.ctx.font = o, this.ctx.direction = n.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", c = this.fontMetrics.getMetrics(l, f), h = c.baseline, m = c.middle, B = n.paintOrder, t.textBounds.forEach(function(u) {
            B.forEach(function(C) {
              switch (C) {
                case 0:
                  g.ctx.fillStyle = Bt(n.color), g.renderTextWithLetterSpacing(u, n.letterSpacing, h);
                  var F = n.textShadow;
                  F.length && u.text.trim().length && (F.slice(0).reverse().forEach(function(U) {
                    g.ctx.shadowColor = Bt(U.color), g.ctx.shadowOffsetX = U.offsetX.number * g.options.scale, g.ctx.shadowOffsetY = U.offsetY.number * g.options.scale, g.ctx.shadowBlur = U.blur.number, g.renderTextWithLetterSpacing(u, n.letterSpacing, h);
                  }), g.ctx.shadowColor = "", g.ctx.shadowOffsetX = 0, g.ctx.shadowOffsetY = 0, g.ctx.shadowBlur = 0), n.textDecorationLine.length && (g.ctx.fillStyle = Bt(n.textDecorationColor || n.color), n.textDecorationLine.forEach(function(U) {
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
                  n.webkitTextStrokeWidth && u.text.trim().length && (g.ctx.strokeStyle = Bt(n.webkitTextStrokeColor), g.ctx.lineWidth = n.webkitTextStrokeWidth, g.ctx.lineJoin = window.chrome ? "miter" : "round", g.ctx.strokeText(u.text, u.bounds.left, u.bounds.top + h)), g.ctx.strokeStyle = "", g.ctx.lineWidth = 0, g.ctx.lineJoin = "miter";
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
        var o = _c(t), l = bc(n);
        this.path(l), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, o.left, o.top, o.width, o.height), this.ctx.restore();
      }
    }, e.prototype.renderNodeContent = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n, i, o, l, f, c, H, H, h, m, B, g, _, v, u, M, C, F, U, H, O, _, M;
        return Dt(this, function(K) {
          switch (K.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), n = t.container, i = t.curves, o = n.styles, l = 0, f = n.textNodes, K.label = 1;
            case 1:
              return l < f.length ? (c = f[l], [4, this.renderTextNode(c, o)]) : [3, 4];
            case 2:
              K.sent(), K.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              if (!(n instanceof Ny)) return [3, 8];
              K.label = 5;
            case 5:
              return K.trys.push([5, 7, , 8]), [4, this.context.cache.match(n.src)];
            case 6:
              return H = K.sent(), this.renderReplacedElement(n, i, H), [3, 8];
            case 7:
              return K.sent(), this.context.logger.error("Error loading image " + n.src), [3, 8];
            case 8:
              if (n instanceof My && this.renderReplacedElement(n, i, n.canvas), !(n instanceof Py)) return [3, 12];
              K.label = 9;
            case 9:
              return K.trys.push([9, 11, , 12]), [4, this.context.cache.match(n.svg)];
            case 10:
              return H = K.sent(), this.renderReplacedElement(n, i, H), [3, 12];
            case 11:
              return K.sent(), this.context.logger.error("Error loading svg " + n.svg.substring(0, 255)), [3, 12];
            case 12:
              return n instanceof $y && n.tree ? (h = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: n.backgroundColor,
                x: 0,
                y: 0,
                width: n.width,
                height: n.height
              }), [4, h.render(n.tree)]) : [3, 14];
            case 13:
              m = K.sent(), n.width && n.height && this.ctx.drawImage(m, 0, 0, n.width, n.height, n.bounds.left, n.bounds.top, n.bounds.width, n.bounds.height), K.label = 14;
            case 14:
              if (n instanceof tg && (B = Math.min(n.bounds.width, n.bounds.height), n.type === Cc ? n.checked && (this.ctx.save(), this.path([
                new LA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79),
                new LA(n.bounds.left + B * 0.16, n.bounds.top + B * 0.5549),
                new LA(n.bounds.left + B * 0.27347, n.bounds.top + B * 0.44071),
                new LA(n.bounds.left + B * 0.39694, n.bounds.top + B * 0.5649),
                new LA(n.bounds.left + B * 0.72983, n.bounds.top + B * 0.23),
                new LA(n.bounds.left + B * 0.84, n.bounds.top + B * 0.34085),
                new LA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79)
              ]), this.ctx.fillStyle = Bt(Gm), this.ctx.fill(), this.ctx.restore()) : n.type === Qc && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + B / 2, n.bounds.top + B / 2, B / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = Bt(Gm), this.ctx.fill(), this.ctx.restore())), Rk(n) && n.value.length) {
                switch (g = this.createFontStyle(o), _ = g[0], v = g[1], u = this.fontMetrics.getMetrics(_, v).baseline, this.ctx.font = _, this.ctx.fillStyle = Bt(o.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = $k(n.styles.textAlign), M = _c(n), C = 0, n.styles.textAlign) {
                  case 1:
                    C += M.width / 2;
                    break;
                  case 2:
                    C += M.width;
                    break;
                }
                F = M.add(C, 0, 0, -M.height / 2 + 1), this.ctx.save(), this.path([
                  new LA(M.left, M.top),
                  new LA(M.left + M.width, M.top),
                  new LA(M.left + M.width, M.top + M.height),
                  new LA(M.left, M.top + M.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new bs(n.value, F), o.letterSpacing, u), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!ht(
                n.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (n.styles.listStyleImage === null) return [3, 19];
              if (U = n.styles.listStyleImage, U.type !== 0) return [3, 18];
              H = void 0, O = U.url, K.label = 15;
            case 15:
              return K.trys.push([15, 17, , 18]), [4, this.context.cache.match(O)];
            case 16:
              return H = K.sent(), this.ctx.drawImage(H, n.bounds.left - (H.width + 10), n.bounds.top), [3, 18];
            case 17:
              return K.sent(), this.context.logger.error("Error loading list-style-image " + O), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && n.styles.listStyleType !== -1 && (_ = this.createFontStyle(o)[0], this.ctx.font = _, this.ctx.fillStyle = Bt(o.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", M = new Xr(n.bounds.left, n.bounds.top + We(n.styles.paddingTop, n.bounds.width), n.bounds.width, bm(o.lineHeight, o.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new bs(t.listValue, M), o.letterSpacing, bm(o.lineHeight, o.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), K.label = 20;
            case 20:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderStackContent = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n, i, U, o, l, U, f, c, U, h, m, U, B, g, U, v, u, U, C, F, U;
        return Dt(this, function(H) {
          switch (H.label) {
            case 0:
              if (ht(
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
              H.sent(), o = 0, l = t.nonInlineLevel, H.label = 7;
            case 7:
              return o < l.length ? (U = l[o], [4, this.renderNode(U)]) : [3, 10];
            case 8:
              H.sent(), H.label = 9;
            case 9:
              return o++, [3, 7];
            case 10:
              f = 0, c = t.nonPositionedFloats, H.label = 11;
            case 11:
              return f < c.length ? (U = c[f], [4, this.renderStack(U)]) : [3, 14];
            case 12:
              H.sent(), H.label = 13;
            case 13:
              return f++, [3, 11];
            case 14:
              h = 0, m = t.nonPositionedInlineLevel, H.label = 15;
            case 15:
              return h < m.length ? (U = m[h], [4, this.renderStack(U)]) : [3, 18];
            case 16:
              H.sent(), H.label = 17;
            case 17:
              return h++, [3, 15];
            case 18:
              B = 0, g = t.inlineLevel, H.label = 19;
            case 19:
              return B < g.length ? (U = g[B], [4, this.renderNode(U)]) : [3, 22];
            case 20:
              H.sent(), H.label = 21;
            case 21:
              return B++, [3, 19];
            case 22:
              v = 0, u = t.zeroOrAutoZIndexOrTransformedOrOpacity, H.label = 23;
            case 23:
              return v < u.length ? (U = u[v], [4, this.renderStack(U)]) : [3, 26];
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
      t.forEach(function(i, o) {
        var l = Cn(i) ? i.start : i;
        o === 0 ? n.ctx.moveTo(l.x, l.y) : n.ctx.lineTo(l.x, l.y), Cn(i) && n.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
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
      return Gt(this, void 0, void 0, function() {
        var n, i, o, l, f, c;
        return Dt(this, function(h) {
          switch (h.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(m) {
                var B, g, v, gA, eA, fA, _A, W, cA, u, gA, eA, fA, _A, W, C, F, U, H, O, _, M, K, z, cA, sA, gA, QA, OA, _A, W, yA, eA, fA, bA, xA, iA, T, AA, J, L, R;
                return Dt(this, function(nA) {
                  switch (nA.label) {
                    case 0:
                      if (m.type !== 0) return [3, 5];
                      B = void 0, g = m.url, nA.label = 1;
                    case 1:
                      return nA.trys.push([1, 3, , 4]), [4, o.context.cache.match(g)];
                    case 2:
                      return B = nA.sent(), [3, 4];
                    case 3:
                      return nA.sent(), o.context.logger.error("Error loading background-image " + g), [3, 4];
                    case 4:
                      return B && (v = Gh(t, n, [
                        B.width,
                        B.height,
                        B.width / B.height
                      ]), gA = v[0], eA = v[1], fA = v[2], _A = v[3], W = v[4], cA = o.ctx.createPattern(o.resizeImage(B, _A, W), "repeat"), o.renderRepeat(gA, cA, eA, fA)), [3, 6];
                    case 5:
                      EP(m) ? (u = Gh(t, n, [null, null, null]), gA = u[0], eA = u[1], fA = u[2], _A = u[3], W = u[4], C = yP(m.angle, _A, W), F = C[0], U = C[1], H = C[2], O = C[3], _ = C[4], M = document.createElement("canvas"), M.width = _A, M.height = W, K = M.getContext("2d"), z = K.createLinearGradient(U, O, H, _), Um(m.stops, F).forEach(function(FA) {
                        return z.addColorStop(FA.stop, Bt(FA.color));
                      }), K.fillStyle = z, K.fillRect(0, 0, _A, W), _A > 0 && W > 0 && (cA = o.ctx.createPattern(M, "repeat"), o.renderRepeat(gA, cA, eA, fA))) : bP(m) && (sA = Gh(t, n, [
                        null,
                        null,
                        null
                      ]), gA = sA[0], QA = sA[1], OA = sA[2], _A = sA[3], W = sA[4], yA = m.position.length === 0 ? [Yp] : m.position, eA = We(yA[0], _A), fA = We(yA[yA.length - 1], W), bA = CP(m, eA, fA, _A, W), xA = bA[0], iA = bA[1], xA > 0 && iA > 0 && (T = o.ctx.createRadialGradient(QA + eA, OA + fA, 0, QA + eA, OA + fA, xA), Um(m.stops, xA * 2).forEach(function(FA) {
                        return T.addColorStop(FA.stop, Bt(FA.color));
                      }), o.path(gA), o.ctx.fillStyle = T, xA !== iA ? (AA = t.bounds.left + 0.5 * t.bounds.width, J = t.bounds.top + 0.5 * t.bounds.height, L = iA / xA, R = 1 / L, o.ctx.save(), o.ctx.translate(AA, J), o.ctx.transform(1, 0, 0, L, 0, 0), o.ctx.translate(-AA, -J), o.ctx.fillRect(QA, R * (OA - J) + J, _A, W * R), o.ctx.restore()) : o.ctx.fill())), nA.label = 6;
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
      return Gt(this, void 0, void 0, function() {
        return Dt(this, function(o) {
          return this.path(tv(i, n)), this.ctx.fillStyle = Bt(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, n, i, o) {
      return Gt(this, void 0, void 0, function() {
        var l, f;
        return Dt(this, function(c) {
          switch (c.label) {
            case 0:
              return n < 3 ? [4, this.renderSolidBorder(t, i, o)] : [3, 2];
            case 1:
              return c.sent(), [
                2
                /*return*/
              ];
            case 2:
              return l = Ik(o, i), this.path(l), this.ctx.fillStyle = Bt(t), this.ctx.fill(), f = Hk(o, i), this.path(f), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n, i, o, l, f, c, h, m, B = this;
        return Dt(this, function(g) {
          switch (g.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), n = t.container.styles, i = !Ui(n.backgroundColor) || n.backgroundImage.length, o = [
                { style: n.borderTopStyle, color: n.borderTopColor, width: n.borderTopWidth },
                { style: n.borderRightStyle, color: n.borderRightColor, width: n.borderRightWidth },
                { style: n.borderBottomStyle, color: n.borderBottomColor, width: n.borderBottomWidth },
                { style: n.borderLeftStyle, color: n.borderLeftColor, width: n.borderLeftWidth }
              ], l = kk(za(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), Ui(n.backgroundColor) || (this.ctx.fillStyle = Bt(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              g.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(v) {
                B.ctx.save();
                var u = Ec(t.curves), C = v.inset ? 0 : Pk, F = _k(u, -C + (v.inset ? 1 : -1) * v.spread.number, (v.inset ? 1 : -1) * v.spread.number, v.spread.number * (v.inset ? -2 : 2), v.spread.number * (v.inset ? -2 : 2));
                v.inset ? (B.path(u), B.ctx.clip(), B.mask(F)) : (B.mask(u), B.ctx.clip(), B.path(F)), B.ctx.shadowOffsetX = v.offsetX.number + C, B.ctx.shadowOffsetY = v.offsetY.number, B.ctx.shadowColor = Bt(v.color), B.ctx.shadowBlur = v.blur.number, B.ctx.fillStyle = v.inset ? Bt(v.color) : "rgba(0,0,0,1)", B.ctx.fill(), B.ctx.restore();
              }), g.label = 2;
            case 2:
              f = 0, c = 0, h = o, g.label = 3;
            case 3:
              return c < h.length ? (m = h[c], m.style !== 0 && !Ui(m.color) && m.width > 0 ? m.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
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
      return Gt(this, void 0, void 0, function() {
        var f, c, h, m, B, g, v, u, C, F, U, H, O, _, M, K, M, K;
        return Dt(this, function(z) {
          return this.ctx.save(), f = Sk(o, i), c = tv(o, i), l === 2 && (this.path(c), this.ctx.clip()), Cn(c[0]) ? (h = c[0].start.x, m = c[0].start.y) : (h = c[0].x, m = c[0].y), Cn(c[1]) ? (B = c[1].end.x, g = c[1].end.y) : (B = c[1].x, g = c[1].y), i === 0 || i === 2 ? v = Math.abs(h - B) : v = Math.abs(m - g), this.ctx.beginPath(), l === 3 ? this.formatPath(f) : this.formatPath(c.slice(0, 2)), u = n < 3 ? n * 3 : n * 2, C = n < 3 ? n * 2 : n, l === 3 && (u = n, C = n), F = !0, v <= u * 2 ? F = !1 : v <= u * 2 + C ? (U = v / (2 * u + C), u *= U, C *= U) : (H = Math.floor((v + C) / (u + C)), O = (v - H * u) / (H - 1), _ = (v - (H + 1) * u) / H, C = _ <= 0 || Math.abs(C - O) < Math.abs(C - _) ? O : _), F && (l === 3 ? this.ctx.setLineDash([0, u + C]) : this.ctx.setLineDash([u, C])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = Bt(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (Cn(c[0]) && (M = c[3], K = c[0], this.ctx.beginPath(), this.formatPath([new LA(M.end.x, M.end.y), new LA(K.start.x, K.start.y)]), this.ctx.stroke()), Cn(c[1]) && (M = c[1], K = c[2], this.ctx.beginPath(), this.formatPath([new LA(M.end.x, M.end.y), new LA(K.start.x, K.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n;
        return Dt(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = Bt(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = xk(t), [4, this.renderStack(n)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(iC)
), Rk = function(A) {
  return A instanceof ky || A instanceof Ry ? !0 : A instanceof tg && A.type !== Qc && A.type !== Cc;
}, kk = function(A, e) {
  switch (A) {
    case 0:
      return Ec(e);
    case 2:
      return Qk(e);
    case 1:
    default:
      return bc(e);
  }
}, $k = function(A) {
  switch (A) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, Gk = ["-apple-system", "system-ui"], Vk = function(A) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? A.filter(function(e) {
    return Gk.indexOf(e) === -1;
  }) : A;
}, Wk = (
  /** @class */
  function(A) {
    Jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), i.options = n, i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px", i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized (" + n.width + "x" + n.height + " at " + n.x + "," + n.y + ") with scale " + n.scale), i;
    }
    return e.prototype.render = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n, i;
        return Dt(this, function(o) {
          switch (o.label) {
            case 0:
              return n = Td(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, Xk(n)];
            case 1:
              return i = o.sent(), this.options.backgroundColor && (this.ctx.fillStyle = Bt(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(iC)
), Xk = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, qk = (
  /** @class */
  function() {
    function A(e) {
      var t = e.id, n = e.enabled;
      this.id = t, this.enabled = n, this.start = Date.now();
    }
    return A.prototype.debug = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.debug == "function" ? console.debug.apply(console, Bl([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.prototype.getTime = function() {
      return Date.now() - this.start;
    }, A.prototype.info = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && typeof window < "u" && window.console && typeof console.info == "function" && console.info.apply(console, Bl([this.id, this.getTime() + "ms"], e));
    }, A.prototype.warn = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.warn == "function" ? console.warn.apply(console, Bl([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.prototype.error = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      this.enabled && (typeof window < "u" && window.console && typeof console.error == "function" ? console.error.apply(console, Bl([this.id, this.getTime() + "ms"], e)) : this.info.apply(this, e));
    }, A.instances = {}, A;
  }()
), zk = (
  /** @class */
  function() {
    function A(e, t) {
      var n;
      this.windowBounds = t, this.instanceName = "#" + A.instanceCount++, this.logger = new qk({ id: this.instanceName, enabled: e.logging }), this.cache = (n = e.cache) !== null && n !== void 0 ? n : new pk(this, e);
    }
    return A.instanceCount = 1, A;
  }()
), Jk = function(A, e) {
  return e === void 0 && (e = {}), jk(A, e);
};
typeof window < "u" && Zy.setContext(window);
var jk = function(A, e) {
  return Gt(void 0, void 0, void 0, function() {
    var t, n, i, o, l, f, c, h, m, B, g, v, u, C, F, U, H, O, _, M, z, K, z, cA, sA, gA, QA, OA, _A, W, yA, eA, fA, bA, xA, iA, T, AA, J, L;
    return Dt(this, function(R) {
      switch (R.label) {
        case 0:
          if (!A || typeof A != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = A.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (n = t.defaultView, !n)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (cA = e.allowTaint) !== null && cA !== void 0 ? cA : !1,
            imageTimeout: (sA = e.imageTimeout) !== null && sA !== void 0 ? sA : 15e3,
            proxy: e.proxy,
            useCORS: (gA = e.useCORS) !== null && gA !== void 0 ? gA : !1
          }, o = md({ logging: (QA = e.logging) !== null && QA !== void 0 ? QA : !0, cache: e.cache }, i), l = {
            windowWidth: (OA = e.windowWidth) !== null && OA !== void 0 ? OA : n.innerWidth,
            windowHeight: (_A = e.windowHeight) !== null && _A !== void 0 ? _A : n.innerHeight,
            scrollX: (W = e.scrollX) !== null && W !== void 0 ? W : n.pageXOffset,
            scrollY: (yA = e.scrollY) !== null && yA !== void 0 ? yA : n.pageYOffset
          }, f = new Xr(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), c = new zk(o, f), h = (eA = e.foreignObjectRendering) !== null && eA !== void 0 ? eA : !1, m = {
            allowTaint: (fA = e.allowTaint) !== null && fA !== void 0 ? fA : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: h,
            copyStyles: h
          }, c.logger.debug("Starting document clone with size " + f.width + "x" + f.height + " scrolled to " + -f.left + "," + -f.top), B = new Zm(c, A, m), g = B.clonedReferenceElement, g ? [4, B.toIFrame(t, f)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return v = R.sent(), u = ng(g) || YR(g) ? _N(g.ownerDocument) : Rc(c, g), C = u.width, F = u.height, U = u.left, H = u.top, O = Yk(c, g, e.backgroundColor), _ = {
            canvas: e.canvas,
            backgroundColor: O,
            scale: (xA = (bA = e.scale) !== null && bA !== void 0 ? bA : n.devicePixelRatio) !== null && xA !== void 0 ? xA : 1,
            x: ((iA = e.x) !== null && iA !== void 0 ? iA : 0) + U,
            y: ((T = e.y) !== null && T !== void 0 ? T : 0) + H,
            width: (AA = e.width) !== null && AA !== void 0 ? AA : Math.ceil(C),
            height: (J = e.height) !== null && J !== void 0 ? J : Math.ceil(F)
          }, h ? (c.logger.debug("Document cloned, using foreign object rendering"), z = new Wk(c, _), [4, z.render(g)]) : [3, 3];
        case 2:
          return M = R.sent(), [3, 5];
        case 3:
          return c.logger.debug("Document cloned, element located at " + U + "," + H + " with size " + C + "x" + F + " using computed rendering"), c.logger.debug("Starting DOM parsing"), K = Vy(c, g), O === K.styles.backgroundColor && (K.styles.backgroundColor = $r.TRANSPARENT), c.logger.debug("Starting renderer for element at " + _.x + "," + _.y + " with size " + _.width + "x" + _.height), z = new Kk(c, _), [4, z.render(K)];
        case 4:
          M = R.sent(), R.label = 5;
        case 5:
          return (!((L = e.removeContainer) !== null && L !== void 0) || L) && (Zm.destroy(v) || c.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), c.logger.debug("Finished rendering"), [2, M];
      }
    });
  });
}, Yk = function(A, e, t) {
  var n = e.ownerDocument, i = n.documentElement ? Us(A, getComputedStyle(n.documentElement).backgroundColor) : $r.TRANSPARENT, o = n.body ? Us(A, getComputedStyle(n.body).backgroundColor) : $r.TRANSPARENT, l = typeof t == "string" ? Us(A, t) : t === null ? $r.TRANSPARENT : 4294967295;
  return e === n.documentElement ? Ui(i) ? Ui(o) ? l : o : i : l;
};
let wi = {};
wi.vectorEffectSupport = !0;
wi.Listener = function(A) {
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
    return He.pull(t, i), n;
  }, n;
};
wi.GeneMap = function(A) {
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
  }, t = He.merge({}, e, A), n, i, o, l, f, c, h, m, B, g, v, u, C, F, U, H, O = !1, _ = {}, M = function() {
    if (O) {
      var oA = ae(n).height();
      t.height = oA - 80, t.width = "100%";
    }
  }, K = function() {
    O ? (t.height = _.height, t.width = _.width, VA(n).classed("fullscreen", !1), O = !1) : (_.height = t.height, _.width = t.width, VA(n).classed("fullscreen", !0), O = !0), M(), yA(), sA(), zA();
  }, z = function() {
    var oA = { width: t.width, height: t.height };
    if (oA.width.toString().indexOf("%") >= 0 || oA.height.toString().indexOf("%") >= 0) {
      var mA = VA(n).select("svg").node().getBoundingClientRect();
      oA.width.toString().indexOf("%") >= 0 && (oA.width = mA.width), oA.height.toString().indexOf("%") >= 0 && (oA.height = mA.height);
    }
    return oA;
  }, cA = function() {
    const oA = Wa(i.node()), mA = oA.k, EA = [oA.x, oA.y];
    return EA[0] !== 0 || EA[1] !== 0 || mA !== 1;
  }, sA = function() {
    const oA = Wa(i.node()), mA = oA.k, EA = [oA.x, oA.y];
    mA === 1 && He.isEqual(EA, [0, 0]) || (c.translate([0, 0]), c.scale(1), o.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    ), u.setFitButtonEnabled(cA()), UA(), zA());
  }, gA = function() {
    o.select(".drawing_outline").attr("width", B.drawing.width).attr("height", B.drawing.height);
  }, QA = function() {
    var oA = B.drawing, mA = B.margin;
    o.select(".drawing_margin").attr("x", mA.left).attr("y", mA.top).attr("width", oA.width - mA.left - mA.right).attr("height", oA.height - mA.top - mA.bottom);
  }, OA = function() {
    o.attr("transform", "translate(0,0)scale(1)"), o.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    );
  }, _A = async function() {
    const oA = document.querySelector(".mapview-wrapper");
    Jk(oA).then((mA) => {
      const EA = mA.toDataURL("image/png"), ee = document.createElement("a");
      ee.href = EA, ee.download = "capture.png", ee.click();
    }).catch((mA) => {
      console.error("Error capturing the element:", mA);
    });
  };
  h = function() {
    var oA = Wa(this), mA = [oA.x, oA.y], EA = oA.k;
    if (B) {
      var ee = i.node().getBoundingClientRect(), we = -B.drawing.width * EA + ee.width * (1 - t.extraPanArea) + B.drawing.margin.right * EA, Fe = ee.width * t.extraPanArea - B.drawing.margin.left * EA;
      mA[0] = He.clamp(mA[0], we, Fe);
      var Ye = -B.drawing.height * EA + ee.height * (1 - t.extraPanArea) + B.drawing.margin.bottom * EA, Le = ee.height * t.extraPanArea - B.drawing.margin.top * EA;
      mA[1] = He.clamp(mA[1], Ye, Le);
    }
    (oA.x !== mA[0] || oA.y !== mA[1]) && c.translateBy(
      i,
      mA[0] - oA.x,
      mA[1] - oA.y
    ), EA !== m && (UA(), zA(), m = EA), u.setFitButtonEnabled(cA()), o.attr(
      "transform",
      "translate(" + mA[0] + "," + mA[1] + ")scale(" + EA + ")"
    ), yA(), l.text(
      "translate: [ " + mA[0].toFixed(1) + "," + mA[1].toFixed(1) + "]  zoom:" + EA.toFixed(2)
    );
  };
  var W = function(oA) {
    oA.preventDefault();
  }, yA = function() {
    ae(".gene-annotation-popover").remove();
  }, eA = function() {
    var oA = function(EA) {
      EA.target !== "undefined" && EA.target.tagName.toLowerCase() === "a" || ae(EA.target).closest(".genemap-advanced-menu").length > 0 || ae(EA.target).closest(".color-picker-modal").length > 0 || yA();
    }, mA = "mousedown mousewheel DOMMouseScroll touchstart ";
    ae(n).off(mA).on(mA, oA), ae("body").on("click", function(EA) {
      ae(EA.target).closest(n).length < 1 && O == !0 && K();
    });
  }, fA = function(oA) {
    oA == "auto" ? (C = !0, F = !0, B.chromosomes.forEach(function(mA) {
      mA.annotations.genes.forEach(function(EA) {
        EA.selected == !0 && (EA.visible = !0);
      });
    })) : oA == "show" ? (C = !1, F = !0) : oA == "hide" && (C = !1, F = !1), B.chromosomes.forEach(function(mA) {
      mA.annotations.genes.forEach(function(EA) {
        oA === "auto" ? delete EA.showLabel : EA.showLabel = oA;
      });
    }), UA(), zA();
  }, bA = function() {
    var oA = B.chromosomes.some(function(mA) {
      return mA.annotations.genes.some(function(EA) {
        return EA.selected;
      });
    });
    KA.onAnonationLabelSelectFunction && KA.onAnonationLabelSelectFunction(KA.getSelectedGenes()), UA(), zA(), VA(".network-btn").classed("disabled", !oA);
  }, xA = function(oA) {
    v ? (B = g, v = !1) : (B = { chromosomes: [oA] }, v = !0), KA.onAnonationLabelSelectFunction(KA.getSelectedGenes()), sA(), UA(), zA();
  }, iA = function() {
    He.flatMap(
      B.chromosomes.map(function(oA) {
        return oA.annotations.genes.filter(function(mA) {
          return mA.selected;
        }).map(function(mA) {
          var EA = mA.link, ee = EA.substring(EA.indexOf("list="), EA.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              ee.replace(/\+/g, " ")
            )
          );
        });
      })
    ), t.apiUrl + "";
  }, T = function() {
    var oA = u.getTagButtonState(), mA;
    oA === "auto" ? mA = "show" : oA === "show" ? mA = "hide" : mA = "auto", u.setTabButtonState(mA), fA(mA), zA();
  }, AA = function() {
    B.chromosomes.forEach(function(oA) {
      oA.annotations.allGenes.forEach(function(mA) {
        mA.selected = !1, mA.visible = !1, mA.hidden = !1;
      });
    }), UA(), zA();
  }, J = function(oA) {
    t.layout.numberPerRow = oA, nA(), UA(), zA();
  }, L = function(oA) {
    oA == "all" ? (U = !0, H = !0) : oA == "selected" ? (U = !1, H = "true") : (U = !1, H = !1), FA(), UA(), zA();
  }, R = function() {
    const mA = Wa(i.node()).k;
    var EA = hS(t.layout).width(z().width).height(z().height).scale(mA);
    B = EA.decorateGenome(B);
  }, nA = function() {
    B.chromosomes.forEach(function(oA) {
      oA.layout = oA.layout || {}, oA.layout.annotationDisplayClusters = null, oA.layout.geneBandDisplayClusters = null;
    });
  }, FA = function() {
    B.chromosomes.forEach(function(oA) {
      oA.layout = oA.layout || {}, oA.layout.qtlDisplayClusters = null;
    });
  }, UA = function() {
    const mA = Wa(i.node()).k;
    R();
    var EA = yN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: B.cellLayout.annotations.marker.size,
      annotationLabelSize: B.cellLayout.annotations.label.size,
      scale: mA,
      autoLabels: C,
      manualLabels: F,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), ee = CN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: mA,
      nGenesToDisplay: t.nGenesToDisplay
    }), we = bN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.qtlAnnotationPosition,
      scale: mA,
      showAllQTLs: U,
      showSelectedQTLs: H,
      showAutoQTLLabels: U,
      showSelectedQTLLabels: H,
      annotationLabelSize: B.cellLayout.annotations.label.size
    });
    B.chromosomes.forEach(function(Fe) {
      Fe.layout = Fe.layout || {}, Fe.layout.annotationDisplayClusters || EA.computeChromosomeClusters(Fe), EA.layoutChromosome(Fe), Fe.layout.geneBandDisplayClusters || ee.computeChromosomeClusters(Fe), ee.layoutChromosome(Fe), Fe.layout.qtlDisplayClusters || we.computeChromosomeClusters(Fe), we.layoutChromosome(Fe);
    }), EA.computeNormalisedGeneScores(B.chromosomes);
  }, qA = function(oA, mA) {
    var EA = /* @__PURE__ */ new Set(), ee = [];
    mA.chromosomes.forEach(function(Ye) {
      Ye.annotations.snps.forEach(function(Le) {
        EA.has(Le.trait) || Le.trait != null && ee.push({ trait: Le.trait, color: Le.color }), EA.add(Le.trait);
      });
    }), ee.length > 0 ? oA.text("SNP legend: ") : oA.text("");
    var we = oA.selectAll("span").data(ee), Fe = we.enter().append("span").classed("key-item", !0);
    Fe.append("span").style("background-color", function(Ye) {
      return Ye.color;
    }).classed("colorbox", !0).append("svg"), Fe.append("span").text(function(Ye) {
      return Ye.trait;
    }), we.exit().remove();
  }, te = function(oA) {
    var mA = oA.append("div").attr("class", "mapview-wrapper"), EA = mA.append("svg").attr("width", t.width).attr("height", t.height).attr("class", "mapview").attr("flex", t.flex);
    l = oA.append("div").append("span").attr("class", "logger").attr("id", "logbar"), f = oA.append("div").attr("class", "key").attr("id", "keybar"), wi.vectorEffectSupport = "vectorEffect" in EA.node().style, eA(), EA.on("contextmenu", W), EA.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && oA.select(".zoom_window").append("rect").classed("drawing_margin", !0), m = 1, c = bO().scaleExtent([0.5, 60]), c.on("start", function() {
      EA.classed("dragging", !0);
    }).on("zoom", h).on("end", function() {
      EA.classed("dragging", !1);
    }), oA.select("svg").call(c);
    var ee = oA.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return ee.append("div").attr("class", "arrow"), ee.append("h3").attr("class", "popover-title").text("Cluster"), ee.append("div").attr("class", "popover-content"), EA;
  }, zA = function() {
    VA(n).select("svg").node() ? (i = VA(n).select("svg"), i.attr("width", t.width).attr("height", t.height)) : i = te(VA(n)), R();
    var oA = B.chromosomes.every(function(EA) {
      return EA.layout;
    });
    oA || UA(), i.datum(B), o = i.select(".zoom_window"), gA(), t.contentBorder && QA();
    var mA = pN().onAnnotationSelectFunction(bA).onLabelSelectFunction(xA).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(i);
    o.call(mA);
  };
  function KA(oA) {
    oA.each(function(mA) {
      var EA = this;
      n = EA, g = mA, B = g, v = !1, u || (u = QN().onTagBtnClick(T).onFitBtnClick(sA).onLabelBtnClick(fA).onQtlBtnClick(L).onNetworkBtnClick(iA).onResetBtnClick(AA).onSetNumberPerRowClick(J).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(_A).onExportAllBtnClick(OA).onExpandBtnClick(K).maxSnpPValueProperty(KA.maxSnpPValue).nGenesToDisplayProperty(KA.nGenesToDisplay).annotationLabelSizeProperty(KA.annotationLabelSize)), VA(n).call(u), u.setNetworkButtonEnabled(!1), u.setFitButtonEnabled(!1), u.setTabButtonState("auto"), zA();
    });
  }
  return KA.resetZoom = sA, KA.width = function(oA) {
    return arguments.length ? (t.width = oA, KA) : t.width;
  }, KA.height = function(oA) {
    return arguments.length ? (t.height = oA, KA) : t.height;
  }, KA.layout = function(oA) {
    return arguments.length ? (t.layout = He.merge(t.layout, oA), KA) : t.layout;
  }, KA.draw = async function(oA, mA, EA, ee = !1) {
    console.log("draw");
    var we = cS();
    if (EA)
      we.readData(mA, EA, ee).then(function(Fe) {
        KA._draw(oA, Fe, ee);
      });
    else {
      const Fe = await we.readData(mA, EA, ee);
      KA._draw(oA, Fe, ee);
    }
  }, KA._draw = function(oA, mA) {
    var EA = VA(oA).selectAll("div").data(["genemap-target"]);
    EA.enter().append("div").attr("id", function(ee) {
      return ee;
    }), n = VA(oA).select("#genemap-target").node(), VA(n).datum(mA).call(KA), KA.nGenesToDisplay(t.initialMaxGenes), sA(), qA(f, B);
  }, KA.changeQtlColor = function(oA, mA, EA) {
    B.chromosomes.forEach(function(ee) {
      ee.layout.qtlNodes.forEach(function(we) {
        we.id === oA && (we.color = mA, we.label = EA);
      });
    }), UA(), zA();
  }, KA.changeColor = function(oA) {
    VA("#map").style("background-color", oA), UA(), zA();
  }, KA.redraw = function(oA) {
    n = VA(oA).select("#genemap-target")[0][0], M(), VA(n).call(KA), yA();
  }, KA.setGeneLabels = function(oA) {
    n && fA(oA);
  }, KA.maxSnpPValue = wi.Listener(t.maxSnpPValue).addListener(function(oA) {
    var mA = Number(oA);
    isNaN(mA) && KA.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(oA), UA(), zA();
  }), KA.nGenesToDisplay = wi.Listener(t.nGenesToDisplay).addListener(
    function(oA) {
      var mA = t.nGenesToDisplay;
      t.nGenesToDisplay = oA, oA != mA && (nA(), UA(), zA());
    }
  ), KA.annotationLabelSize = wi.Listener(
    t.annotationLabelSize
  ).addListener(function(oA) {
    t.annotationLabelSize = oA, nA(), UA(), zA();
  }), KA.setQtlLabels = function(oA) {
    if (n) {
      var mA = VA(n).datum();
      mA.chromosomes.forEach(function(EA) {
        EA.annotations.qtls.forEach(function(ee) {
          oA === "auto" ? delete ee.showLabel : ee.showLabel = oA;
        });
      });
    }
  }, KA.onAnonationLabelSelectFunction = function() {
  }, KA.loggingOn = function() {
    l.style("display", "initial");
  }, KA.loggingOff = function() {
    l.style("display", "none");
  }, KA.getSelectedGenes = function() {
    var oA = [];
    return B.chromosomes.forEach(function(mA) {
      mA.annotations.genes.forEach(function(EA) {
        EA.selected && oA.push(EA);
      });
    }), oA;
  }, KA.getGenome = function() {
    return B;
  }, KA;
};
const no = wi.GeneMap().width("100%").height("100%");
function Zk() {
  const A = document.getElementById("show-gene-labels"), e = A.options[A.selectedIndex].value;
  no.setGeneLabels(e);
  const t = document.getElementById("show-qtl-labels"), n = t.options[t.selectedIndex].value;
  no.setQtlLabels(n), no.redraw("#map");
}
function A$() {
  no.changeQtlColor("C6", "#000");
}
async function e$(A) {
  A && no.resetZoom();
  const e = await import("./arabidopsis-DWsJl-zt.js"), t = await import("./arabidopsis-BWR4fnku.js");
  no.draw("#map", e.default, t.default, !0);
}
export {
  A$ as changeQtlColor,
  no as chart,
  e$ as redraw,
  Zk as updateLabel
};
