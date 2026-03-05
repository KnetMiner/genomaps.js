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
var Ji = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function xc(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var Vd = { exports: {} }, rv = {}, qn = {}, ro = {}, Rs = {}, ye = {}, xs = {};
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
        const O = d(U[H - 1], U[H + 1]);
        if (O !== void 0) {
          U.splice(H - 1, 3, O);
          continue;
        }
        U[H++] = "+";
      }
      H++;
    }
  }
  function d(U, H) {
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
var Wd = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ValueScope = A.ValueScopeName = A.Scope = A.varKinds = A.UsedValueState = void 0;
  const e = xs;
  class t extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
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
    constructor({ prefixes: d, parent: w } = {}) {
      this._names = {}, this._prefixes = d, this._parent = w;
    }
    toName(d) {
      return d instanceof e.Name ? d : this.name(d);
    }
    name(d) {
      return new e.Name(this._newName(d));
    }
    _newName(d) {
      const w = this._names[d] || this._nameGroup(d);
      return `${d}${w.index++}`;
    }
    _nameGroup(d) {
      var w, B;
      if (!((B = (w = this._parent) === null || w === void 0 ? void 0 : w._prefixes) === null || B === void 0) && B.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  A.Scope = i;
  class o extends e.Name {
    constructor(d, w) {
      super(w), this.prefix = d;
    }
    setValue(d, { property: w, itemIndex: B }) {
      this.value = d, this.scopePath = (0, e._)`.${new e.Name(w)}[${B}]`;
    }
  }
  A.ValueScopeName = o;
  const l = (0, e._)`\n`;
  class f extends i {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? l : e.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new o(d, this._newName(d));
    }
    value(d, w) {
      var B;
      if (w.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const g = this.toName(d), { prefix: v } = g, u = (B = w.key) !== null && B !== void 0 ? B : w.ref;
      let C = this._values[v];
      if (C) {
        const H = C.get(u);
        if (H)
          return H;
      } else
        C = this._values[v] = /* @__PURE__ */ new Map();
      C.set(u, g);
      const F = this._scope[v] || (this._scope[v] = []), U = F.length;
      return F[U] = w.ref, g.setValue(w, { property: v, itemIndex: U }), g;
    }
    getValue(d, w) {
      const B = this._values[d];
      if (B)
        return B.get(w);
    }
    scopeRefs(d, w = this._values) {
      return this._reduceValues(w, (B) => {
        if (B.scopePath === void 0)
          throw new Error(`CodeGen: name "${B}" has no value`);
        return (0, e._)`${d}${B.scopePath}`;
      });
    }
    scopeCode(d = this._values, w, B) {
      return this._reduceValues(d, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, w, B);
    }
    _reduceValues(d, w, B = {}, g) {
      let v = e.nil;
      for (const u in d) {
        const C = d[u];
        if (!C)
          continue;
        const F = B[u] = B[u] || /* @__PURE__ */ new Map();
        C.forEach((U) => {
          if (F.has(U))
            return;
          F.set(U, n.Started);
          let H = w(U);
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
})(Wd);
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.or = A.and = A.not = A.CodeGen = A.operators = A.varKinds = A.ValueScopeName = A.ValueScope = A.Scope = A.Name = A.regexpCode = A.stringify = A.getProperty = A.nil = A.strConcat = A.str = A._ = void 0;
  const e = xs, t = Wd;
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
  var i = Wd;
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
      const nA = L ? t.varKinds.var : this.varKind, QA = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${nA} ${this.name}${QA};` + R;
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
    constructor(L, R, nA, QA) {
      super(L, nA, QA), this.op = R;
    }
    render({ _n: L }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + L;
    }
  }
  class d extends o {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `${this.label}:` + L;
    }
  }
  class w extends o {
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
      let QA = nA.length;
      for (; QA--; ) {
        const UA = nA[QA];
        UA.optimizeNames(L, R) || (yA(L, UA.names), nA.splice(QA, 1));
      }
      return nA.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((L, R) => NA(L, R.names), {});
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
      return _A(L, this.condition), this.else && NA(L, this.else.names), L;
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
      return NA(super.names, this.iteration.names);
    }
  }
  class _ extends H {
    constructor(L, R, nA, QA) {
      super(), this.varKind = L, this.name = R, this.from = nA, this.to = QA;
    }
    render(L) {
      const R = L.es5 ? t.varKinds.var : this.varKind, { name: nA, from: QA, to: UA } = this;
      return `for(${R} ${nA}=${QA}; ${nA}<${UA}; ${nA}++)` + super.render(L);
    }
    get names() {
      const L = _A(super.names, this.from);
      return _A(L, this.to);
    }
  }
  class M extends H {
    constructor(L, R, nA, QA) {
      super(), this.loop = L, this.varKind = R, this.name = nA, this.iterable = QA;
    }
    render(L) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(L);
    }
    optimizeNames(L, R) {
      if (super.optimizeNames(L, R))
        return this.iterable = W(this.iterable, L, R), this;
    }
    get names() {
      return NA(super.names, this.iterable.names);
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
      var nA, QA;
      return super.optimizeNames(L, R), (nA = this.catch) === null || nA === void 0 || nA.optimizeNames(L, R), (QA = this.finally) === null || QA === void 0 || QA.optimizeNames(L, R), this;
    }
    get names() {
      const L = super.names;
      return this.catch && NA(L, this.catch.names), this.finally && NA(L, this.finally.names), L;
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
  class FA {
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
    _def(L, R, nA, QA) {
      const UA = this._scope.toName(R);
      return nA !== void 0 && QA && (this._constants[UA.str] = nA), this._leafNode(new l(L, UA, nA)), UA;
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
      for (const [nA, QA] of L)
        R.length > 1 && R.push(","), R.push(nA), (nA !== QA || this.opts.es5) && (R.push(":"), (0, e.addCodeArg)(R, QA));
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
    forRange(L, R, nA, QA, UA = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const qA = this._scope.toName(L);
      return this._for(new _(UA, qA, R, nA), () => QA(qA));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(L, R, nA, QA = t.varKinds.const) {
      const UA = this._scope.toName(L);
      if (this.opts.es5) {
        const qA = R instanceof e.Name ? R : this.var("_arr", R);
        return this.forRange("_i", 0, (0, e._)`${qA}.length`, (te) => {
          this.var(UA, (0, e._)`${qA}[${te}]`), nA(UA);
        });
      }
      return this._for(new M("of", QA, UA, R), () => nA(UA));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(L, R, nA, QA = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(L, (0, e._)`Object.keys(${R})`, nA);
      const UA = this._scope.toName(L);
      return this._for(new M("in", QA, UA, R), () => nA(UA));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(H);
    }
    // `label` statement
    label(L) {
      return this._leafNode(new d(L));
    }
    // `break` statement
    break(L) {
      return this._leafNode(new w(L));
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
      const QA = new cA();
      if (this._blockNode(QA), this.code(L), R) {
        const UA = this.name("e");
        this._currNode = QA.catch = new sA(UA), R(UA);
      }
      return nA && (this._currNode = QA.finally = new gA(), this.code(nA)), this._endBlockNode(sA, gA);
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
    func(L, R = e.nil, nA, QA) {
      return this._blockNode(new K(L, R, nA)), QA && this.code(QA).endFunc(), this;
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
  A.CodeGen = FA;
  function NA(J, L) {
    for (const R in L)
      J[R] = (J[R] || 0) + (L[R] || 0);
    return J;
  }
  function _A(J, L) {
    return L instanceof e._CodeOrName ? NA(J, L.names) : J;
  }
  function W(J, L, R) {
    if (J instanceof e.Name)
      return nA(J);
    if (!QA(J))
      return J;
    return new e._Code(J._items.reduce((UA, qA) => (qA instanceof e.Name && (qA = nA(qA)), qA instanceof e._Code ? UA.push(...qA._items) : UA.push(qA), UA), []));
    function nA(UA) {
      const qA = R[UA.str];
      return qA === void 0 || L[UA.str] !== 1 ? UA : (delete L[UA.str], qA);
    }
    function QA(UA) {
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
  function EA(...J) {
    return J.reduce(fA);
  }
  A.and = EA;
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
})(ye);
var PA = {};
Object.defineProperty(PA, "__esModule", { value: !0 });
PA.checkStrictMode = PA.getErrorPath = PA.Type = PA.useFunc = PA.setEvaluated = PA.evaluatedPropsToName = PA.mergeEvaluated = PA.eachItem = PA.unescapeJsonPointer = PA.escapeJsonPointer = PA.escapeFragment = PA.unescapeFragment = PA.schemaRefOrVal = PA.schemaHasRulesButRef = PA.schemaHasRules = PA.checkUnknownRules = PA.alwaysValidSchema = PA.toHash = void 0;
const Ge = ye, i1 = xs;
function a1(A) {
  const e = {};
  for (const t of A)
    e[t] = !0;
  return e;
}
PA.toHash = a1;
function o1(A, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (iv(A, e), !av(e, A.self.RULES.all));
}
PA.alwaysValidSchema = o1;
function iv(A, e = A.schema) {
  const { opts: t, self: n } = A;
  if (!t.strictSchema || typeof e == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const o in e)
    i[o] || uv(A, `unknown keyword: "${o}"`);
}
PA.checkUnknownRules = iv;
function av(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e[t])
      return !0;
  return !1;
}
PA.schemaHasRules = av;
function s1(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (t !== "$ref" && e.all[t])
      return !0;
  return !1;
}
PA.schemaHasRulesButRef = s1;
function u1({ topSchemaRef: A, schemaPath: e }, t, n, i) {
  if (!i) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, Ge._)`${t}`;
  }
  return (0, Ge._)`${A}${e}${(0, Ge.getProperty)(n)}`;
}
PA.schemaRefOrVal = u1;
function l1(A) {
  return ov(decodeURIComponent(A));
}
PA.unescapeFragment = l1;
function c1(A) {
  return encodeURIComponent(Rh(A));
}
PA.escapeFragment = c1;
function Rh(A) {
  return typeof A == "number" ? `${A}` : A.replace(/~/g, "~0").replace(/\//g, "~1");
}
PA.escapeJsonPointer = Rh;
function ov(A) {
  return A.replace(/~1/g, "/").replace(/~0/g, "~");
}
PA.unescapeJsonPointer = ov;
function f1(A, e) {
  if (Array.isArray(A))
    for (const t of A)
      e(t);
  else
    e(A);
}
PA.eachItem = f1;
function kB({ mergeNames: A, mergeToName: e, mergeValues: t, resultToName: n }) {
  return (i, o, l, f) => {
    const c = l === void 0 ? o : l instanceof Ge.Name ? (o instanceof Ge.Name ? A(i, o, l) : e(i, o, l), l) : o instanceof Ge.Name ? (e(i, l, o), o) : t(o, l);
    return f === Ge.Name && !(c instanceof Ge.Name) ? n(i, c) : c;
  };
}
PA.mergeEvaluated = {
  props: kB({
    mergeNames: (A, e, t) => A.if((0, Ge._)`${t} !== true && ${e} !== undefined`, () => {
      A.if((0, Ge._)`${e} === true`, () => A.assign(t, !0), () => A.assign(t, (0, Ge._)`${t} || {}`).code((0, Ge._)`Object.assign(${t}, ${e})`));
    }),
    mergeToName: (A, e, t) => A.if((0, Ge._)`${t} !== true`, () => {
      e === !0 ? A.assign(t, !0) : (A.assign(t, (0, Ge._)`${t} || {}`), kh(A, t, e));
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
  return e !== void 0 && kh(A, t, e), t;
}
PA.evaluatedPropsToName = sv;
function kh(A, e, t) {
  Object.keys(t).forEach((n) => A.assign((0, Ge._)`${e}${(0, Ge.getProperty)(n)}`, !0));
}
PA.setEvaluated = kh;
const $B = {};
function d1(A, e) {
  return A.scopeValue("func", {
    ref: e,
    code: $B[e.code] || ($B[e.code] = new i1._Code(e.code))
  });
}
PA.useFunc = d1;
var Xd;
(function(A) {
  A[A.Num = 0] = "Num", A[A.Str = 1] = "Str";
})(Xd || (PA.Type = Xd = {}));
function h1(A, e, t) {
  if (A instanceof Ge.Name) {
    const n = e === Xd.Num;
    return t ? n ? (0, Ge._)`"[" + ${A} + "]"` : (0, Ge._)`"['" + ${A} + "']"` : n ? (0, Ge._)`"/" + ${A}` : (0, Ge._)`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, Ge.getProperty)(A).toString() : "/" + Rh(A);
}
PA.getErrorPath = h1;
function uv(A, e, t = A.opts.strictSchema) {
  if (t) {
    if (e = `strict mode: ${e}`, t === !0)
      throw new Error(e);
    A.self.logger.warn(e);
  }
}
PA.checkStrictMode = uv;
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
const Dt = ye, p1 = {
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
pr.default = p1;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.extendErrors = A.resetErrorsCount = A.reportExtraError = A.reportError = A.keyword$DataError = A.keywordError = void 0;
  const e = ye, t = PA, n = pr;
  A.keywordError = {
    message: ({ keyword: F }) => (0, e.str)`must pass "${F}" keyword validation`
  }, A.keyword$DataError = {
    message: ({ keyword: F, schemaType: U }) => U ? (0, e.str)`"${F}" keyword must be ${U} ($data)` : (0, e.str)`"${F}" keyword is invalid ($data)`
  };
  function i(F, U = A.keywordError, H, O) {
    const { it: _ } = F, { gen: M, compositeRule: K, allErrors: z } = _, cA = B(F, U, H);
    O ?? (K || z) ? c(M, cA) : d(_, (0, e._)`[${cA}]`);
  }
  A.reportError = i;
  function o(F, U = A.keywordError, H) {
    const { it: O } = F, { gen: _, compositeRule: M, allErrors: K } = O, z = B(F, U, H);
    c(_, z), M || K || d(O, n.default.vErrors);
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
  function d(F, U) {
    const { gen: H, validateName: O, schemaEnv: _ } = F;
    _.$async ? H.throw((0, e._)`new ${F.ValidationError}(${U})`) : (H.assign((0, e._)`${O}.errors`, U), H.return(!1));
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
    return H && (_ = (0, e.str)`${_}${(0, t.getErrorPath)(H, t.Type.Str)}`), [w.schemaPath, _];
  }
  function C(F, { params: U, message: H }, O) {
    const { keyword: _, data: M, schemaValue: K, it: z } = F, { opts: cA, propertyName: sA, topSchemaRef: gA, schemaPath: FA } = z;
    O.push([w.keyword, _], [w.params, typeof U == "function" ? U(F) : U || (0, e._)`{}`]), cA.messages && O.push([w.message, typeof H == "function" ? H(F) : H]), cA.verbose && O.push([w.schema, K], [w.parentSchema, (0, e._)`${gA}${FA}`], [n.default.data, M]), sA && O.push([w.propertyName, sA]);
  }
})(Rs);
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.boolOrEmptySchema = ro.topBoolOrEmptySchema = void 0;
const g1 = Rs, B1 = ye, w1 = pr, m1 = {
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
var dt = {}, sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
sa.getRules = sa.isJSONType = void 0;
const C1 = ["string", "number", "integer", "boolean", "null", "object", "array"], Q1 = new Set(C1);
function F1(A) {
  return typeof A == "string" && Q1.has(A);
}
sa.isJSONType = F1;
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
sa.getRules = U1;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.shouldUseRule = Rr.shouldUseGroup = Rr.schemaHasRulesForType = void 0;
function b1({ schema: A, self: e }, t) {
  const n = e.RULES.types[t];
  return n && n !== !0 && cv(A, n);
}
Rr.schemaHasRulesForType = b1;
function cv(A, e) {
  return e.rules.some((t) => fv(A, t));
}
Rr.shouldUseGroup = cv;
function fv(A, e) {
  var t;
  return A[e.keyword] !== void 0 || ((t = e.definition.implements) === null || t === void 0 ? void 0 : t.some((n) => A[n] !== void 0));
}
Rr.shouldUseRule = fv;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.reportTypeError = dt.checkDataTypes = dt.checkDataType = dt.coerceAndCheckDataType = dt.getJSONTypes = dt.getSchemaTypes = dt.DataType = void 0;
const E1 = sa, _1 = Rr, x1 = Rs, pe = ye, dv = PA;
var Za;
(function(A) {
  A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong";
})(Za || (dt.DataType = Za = {}));
function I1(A) {
  const e = hv(A.type);
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
dt.getSchemaTypes = I1;
function hv(A) {
  const e = Array.isArray(A) ? A : A ? [A] : [];
  if (e.every(E1.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
dt.getJSONTypes = hv;
function H1(A, e) {
  const { gen: t, data: n, opts: i } = A, o = S1(e, i.coerceTypes), l = e.length > 0 && !(o.length === 0 && e.length === 1 && (0, _1.schemaHasRulesForType)(A, e[0]));
  if (l) {
    const f = $h(e, n, i.strictNumbers, Za.Wrong);
    t.if(f, () => {
      o.length ? L1(A, e, o) : Gh(A);
    });
  }
  return l;
}
dt.coerceAndCheckDataType = H1;
const pv = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function S1(A, e) {
  return e ? A.filter((t) => pv.has(t) || e === "array" && t === "array") : [];
}
function L1(A, e, t) {
  const { gen: n, data: i, opts: o } = A, l = n.let("dataType", (0, pe._)`typeof ${i}`), f = n.let("coerced", (0, pe._)`undefined`);
  o.coerceTypes === "array" && n.if((0, pe._)`${l} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, pe._)`${i}[0]`).assign(l, (0, pe._)`typeof ${i}`).if($h(e, i, o.strictNumbers), () => n.assign(f, i))), n.if((0, pe._)`${f} !== undefined`);
  for (const d of t)
    (pv.has(d) || d === "array" && o.coerceTypes === "array") && c(d);
  n.else(), Gh(A), n.endIf(), n.if((0, pe._)`${f} !== undefined`, () => {
    n.assign(i, f), T1(A, f);
  });
  function c(d) {
    switch (d) {
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
function T1({ gen: A, parentData: e, parentDataProperty: t }, n) {
  A.if((0, pe._)`${e} !== undefined`, () => A.assign((0, pe._)`${e}[${t}]`, n));
}
function qd(A, e, t, n = Za.Correct) {
  const i = n === Za.Correct ? pe.operators.EQ : pe.operators.NEQ;
  let o;
  switch (A) {
    case "null":
      return (0, pe._)`${e} ${i} null`;
    case "array":
      o = (0, pe._)`Array.isArray(${e})`;
      break;
    case "object":
      o = (0, pe._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      o = l((0, pe._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      o = l();
      break;
    default:
      return (0, pe._)`typeof ${e} ${i} ${A}`;
  }
  return n === Za.Correct ? o : (0, pe.not)(o);
  function l(f = pe.nil) {
    return (0, pe.and)((0, pe._)`typeof ${e} == "number"`, f, t ? (0, pe._)`isFinite(${e})` : pe.nil);
  }
}
dt.checkDataType = qd;
function $h(A, e, t, n) {
  if (A.length === 1)
    return qd(A[0], e, t, n);
  let i;
  const o = (0, dv.toHash)(A);
  if (o.array && o.object) {
    const l = (0, pe._)`typeof ${e} != "object"`;
    i = o.null ? l : (0, pe._)`!${e} || ${l}`, delete o.null, delete o.array, delete o.object;
  } else
    i = pe.nil;
  o.number && delete o.integer;
  for (const l in o)
    i = (0, pe.and)(i, qd(l, e, t, n));
  return i;
}
dt.checkDataTypes = $h;
const D1 = {
  message: ({ schema: A }) => `must be ${A}`,
  params: ({ schema: A, schemaValue: e }) => typeof A == "string" ? (0, pe._)`{type: ${A}}` : (0, pe._)`{type: ${e}}`
};
function Gh(A) {
  const e = O1(A);
  (0, x1.reportError)(e, D1);
}
dt.reportTypeError = Gh;
function O1(A) {
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
var Ic = {};
Object.defineProperty(Ic, "__esModule", { value: !0 });
Ic.assignDefaults = void 0;
const Ma = ye, N1 = PA;
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
  const f = (0, Ma._)`${o}${(0, Ma.getProperty)(e)}`;
  if (i) {
    (0, N1.checkStrictMode)(A, `default is ignored for: ${f}`);
    return;
  }
  let c = (0, Ma._)`${f} === undefined`;
  l.useDefaults === "empty" && (c = (0, Ma._)`${c} || ${f} === null || ${f} === ""`), n.if(c, (0, Ma._)`${f} = ${(0, Ma.stringify)(t)}`);
}
var lr = {}, ve = {};
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.validateUnion = ve.validateArray = ve.usePattern = ve.callValidateCode = ve.schemaProperties = ve.allSchemaProperties = ve.noPropertyInData = ve.propertyInData = ve.isOwnProperty = ve.hasPropFunc = ve.reportMissingProp = ve.checkMissingProp = ve.checkReportMissingProp = void 0;
const ze = ye, Vh = PA, di = pr, P1 = PA;
function K1(A, e) {
  const { gen: t, data: n, it: i } = A;
  t.if(Xh(t, n, e, i.opts.ownProperties), () => {
    A.setParams({ missingProperty: (0, ze._)`${e}` }, !0), A.error();
  });
}
ve.checkReportMissingProp = K1;
function R1({ gen: A, data: e, it: { opts: t } }, n, i) {
  return (0, ze.or)(...n.map((o) => (0, ze.and)(Xh(A, e, o, t.ownProperties), (0, ze._)`${i} = ${o}`)));
}
ve.checkMissingProp = R1;
function k1(A, e) {
  A.setParams({ missingProperty: e }, !0), A.error();
}
ve.reportMissingProp = k1;
function gv(A) {
  return A.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ze._)`Object.prototype.hasOwnProperty`
  });
}
ve.hasPropFunc = gv;
function Wh(A, e, t) {
  return (0, ze._)`${gv(A)}.call(${e}, ${t})`;
}
ve.isOwnProperty = Wh;
function $1(A, e, t, n) {
  const i = (0, ze._)`${e}${(0, ze.getProperty)(t)} !== undefined`;
  return n ? (0, ze._)`${i} && ${Wh(A, e, t)}` : i;
}
ve.propertyInData = $1;
function Xh(A, e, t, n) {
  const i = (0, ze._)`${e}${(0, ze.getProperty)(t)} === undefined`;
  return n ? (0, ze.or)(i, (0, ze.not)(Wh(A, e, t))) : i;
}
ve.noPropertyInData = Xh;
function Bv(A) {
  return A ? Object.keys(A).filter((e) => e !== "__proto__") : [];
}
ve.allSchemaProperties = Bv;
function G1(A, e) {
  return Bv(e).filter((t) => !(0, Vh.alwaysValidSchema)(A, e[t]));
}
ve.schemaProperties = G1;
function V1({ schemaCode: A, data: e, it: { gen: t, topSchemaRef: n, schemaPath: i, errorPath: o }, it: l }, f, c, d) {
  const w = d ? (0, ze._)`${A}, ${e}, ${n}${i}` : e, B = [
    [di.default.instancePath, (0, ze.strConcat)(di.default.instancePath, o)],
    [di.default.parentData, l.parentData],
    [di.default.parentDataProperty, l.parentDataProperty],
    [di.default.rootData, di.default.rootData]
  ];
  l.opts.dynamicRef && B.push([di.default.dynamicAnchors, di.default.dynamicAnchors]);
  const g = (0, ze._)`${w}, ${t.object(...B)}`;
  return c !== ze.nil ? (0, ze._)`${f}.call(${c}, ${g})` : (0, ze._)`${f}(${g})`;
}
ve.callValidateCode = V1;
const W1 = (0, ze._)`new RegExp`;
function X1({ gen: A, it: { opts: e } }, t) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: i } = e.code, o = i(t, n);
  return A.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, ze._)`${i.code === "new RegExp" ? W1 : (0, P1.useFunc)(A, i)}(${t}, ${n})`
  });
}
ve.usePattern = X1;
function q1(A) {
  const { gen: e, data: t, keyword: n, it: i } = A, o = e.name("valid");
  if (i.allErrors) {
    const f = e.let("valid", !0);
    return l(() => e.assign(f, !1)), f;
  }
  return e.var(o, !0), l(() => e.break()), o;
  function l(f) {
    const c = e.const("len", (0, ze._)`${t}.length`);
    e.forRange("i", 0, c, (d) => {
      A.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Vh.Type.Num
      }, o), e.if((0, ze.not)(o), f);
    });
  }
}
ve.validateArray = q1;
function z1(A) {
  const { gen: e, schema: t, keyword: n, it: i } = A;
  if (!Array.isArray(t))
    throw new Error("ajv implementation error");
  if (t.some((c) => (0, Vh.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const l = e.let("valid", !1), f = e.name("_valid");
  e.block(() => t.forEach((c, d) => {
    const w = A.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, f);
    e.assign(l, (0, ze._)`${l} || ${f}`), A.mergeValidEvaluated(w, f) || e.if((0, ze.not)(l));
  })), A.result(l, () => A.reset(), () => A.error(!0));
}
ve.validateUnion = z1;
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.validateKeywordUsage = lr.validSchemaType = lr.funcKeywordCode = lr.macroKeywordCode = void 0;
const Vt = ye, ji = pr, J1 = ve, j1 = Rs;
function Y1(A, e) {
  const { gen: t, keyword: n, schema: i, parentSchema: o, it: l } = A, f = e.macro.call(l.self, i, o, l), c = wv(t, n, f);
  l.opts.validateSchema !== !1 && l.self.validateSchema(f, !0);
  const d = t.name("valid");
  A.subschema({
    schema: f,
    schemaPath: Vt.nil,
    errSchemaPath: `${l.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), A.pass(d, () => A.error(!0));
}
lr.macroKeywordCode = Y1;
function Z1(A, e) {
  var t;
  const { gen: n, keyword: i, schema: o, parentSchema: l, $data: f, it: c } = A;
  e_(c, e);
  const d = !f && e.compile ? e.compile.call(c.self, o, l, c) : e.validate, w = wv(n, i, d), B = n.let("valid");
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
    const U = (0, Vt._)`${w}.errors`;
    return n.assign(U, null), C(Vt.nil), U;
  }
  function C(U = e.async ? (0, Vt._)`await ` : Vt.nil) {
    const H = c.opts.passContext ? ji.default.this : ji.default.self, O = !("compile" in e && !f || e.schema === !1);
    n.assign(B, (0, Vt._)`${U}${(0, J1.callValidateCode)(A, w, H, O)}`, e.modifying);
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
    t.assign(ji.default.vErrors, (0, Vt._)`${ji.default.vErrors} === null ? ${e} : ${ji.default.vErrors}.concat(${e})`).assign(ji.default.errors, (0, Vt._)`${ji.default.vErrors}.length`), (0, j1.extendErrors)(A);
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
const ur = ye, mv = PA;
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
    const { errorPath: d, dataPathArr: w, opts: B } = e, g = f.let("data", (0, ur._)`${e.data}${(0, ur.getProperty)(t)}`, !0);
    c(g), A.errorPath = (0, ur.str)`${d}${(0, mv.getErrorPath)(t, n, B.jsPropertySyntax)}`, A.parentDataProperty = (0, ur._)`${t}`, A.dataPathArr = [...w, A.parentDataProperty];
  }
  if (i !== void 0) {
    const d = i instanceof ur.Name ? i : f.let("data", i, !0);
    c(d), l !== void 0 && (A.propertyName = l);
  }
  o && (A.dataTypes = o);
  function c(d) {
    A.data = d, A.dataLevel = e.dataLevel + 1, A.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), A.parentData = e.data, A.dataNames = [...e.dataNames, d];
  }
}
Qi.extendSubschemaData = i_;
function a_(A, { jtdDiscriminator: e, jtdMetadata: t, compositeRule: n, createErrors: i, allErrors: o }) {
  n !== void 0 && (A.compositeRule = n), i !== void 0 && (A.createErrors = i), o !== void 0 && (A.allErrors = o), A.jtdDiscriminator = e, A.jtdMetadata = t;
}
Qi.extendSubschemaMode = a_;
var Ut = {}, vv = function A(e, t) {
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
function Kl(A, e, t, n, i, o, l, f, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, i, o, l, f, c, d);
    for (var w in n) {
      var B = n[w];
      if (Array.isArray(B)) {
        if (w in mi.arrayKeywords)
          for (var g = 0; g < B.length; g++)
            Kl(A, e, t, B[g], i + "/" + w + "/" + g, o, i, w, n, g);
      } else if (w in mi.propsKeywords) {
        if (B && typeof B == "object")
          for (var v in B)
            Kl(A, e, t, B[v], i + "/" + w + "/" + o_(v), o, i, w, n, v);
      } else (w in mi.keywords || A.allKeys && !(w in mi.skipKeywords)) && Kl(A, e, t, B, i + "/" + w, o, i, w, n);
    }
    t(n, i, o, l, f, c, d);
  }
}
function o_(A) {
  return A.replace(/~/g, "~0").replace(/\//g, "~1");
}
var s_ = yv.exports;
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.getSchemaRefs = Ut.resolveUrl = Ut.normalizeId = Ut._getFullPath = Ut.getFullPath = Ut.inlineRef = void 0;
const u_ = PA, l_ = vv, c_ = s_, f_ = /* @__PURE__ */ new Set([
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
  return typeof A == "boolean" ? !0 : e === !0 ? !zd(A) : e ? Cv(A) <= e : !1;
}
Ut.inlineRef = d_;
const h_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function zd(A) {
  for (const e in A) {
    if (h_.has(e))
      return !0;
    const t = A[e];
    if (Array.isArray(t) && t.some(zd) || typeof t == "object" && zd(t))
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
  t !== !1 && (e = Ao(e));
  const n = A.parse(e);
  return Fv(A, n);
}
Ut.getFullPath = Qv;
function Fv(A, e) {
  return A.serialize(e).split("#")[0] + "#";
}
Ut._getFullPath = Fv;
const p_ = /#\/?$/;
function Ao(A) {
  return A ? A.replace(p_, "") : "";
}
Ut.normalizeId = Ao;
function g_(A, e, t) {
  return t = Ao(t), A.resolve(e, t);
}
Ut.resolveUrl = g_;
const B_ = /^[a-z_][-a-z0-9._]*$/i;
function w_(A, e) {
  if (typeof A == "boolean")
    return {};
  const { schemaId: t, uriResolver: n } = this.opts, i = Ao(A[t] || e), o = { "": i }, l = Qv(n, i, !1), f = {}, c = /* @__PURE__ */ new Set();
  return c_(A, { allKeys: !0 }, (B, g, v, u) => {
    if (u === void 0)
      return;
    const C = l + g;
    let F = o[u];
    typeof B[t] == "string" && (F = U.call(this, B[t])), H.call(this, B.$anchor), H.call(this, B.$dynamicAnchor), o[g] = F;
    function U(O) {
      const _ = this.opts.uriResolver.resolve;
      if (O = Ao(F ? _(F, O) : O), c.has(O))
        throw w(O);
      c.add(O);
      let M = this.refs[O];
      return typeof M == "string" && (M = this.refs[M]), typeof M == "object" ? d(B, M.schema, O) : O !== Ao(C) && (O[0] === "#" ? (d(B, f[O], O), f[O] = B) : this.refs[O] = C), O;
    }
    function H(O) {
      if (typeof O == "string") {
        if (!B_.test(O))
          throw new Error(`invalid anchor "${O}"`);
        U.call(this, `#${O}`);
      }
    }
  }), f;
  function d(B, g, v) {
    if (g !== void 0 && !l_(B, g))
      throw w(v);
  }
  function w(B) {
    return new Error(`reference "${B}" resolves to more than one schema`);
  }
}
Ut.getSchemaRefs = w_;
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.getData = qn.KeywordCxt = qn.validateFunctionCode = void 0;
const Uv = ro, WB = dt, qh = Rr, ec = dt, m_ = Ic, gs = lr, ld = Qi, kA = ye, se = pr, v_ = Ut, kr = PA, Jo = Rs;
function y_(A) {
  if (_v(A) && (xv(A), Ev(A))) {
    F_(A);
    return;
  }
  bv(A, () => (0, Uv.topBoolOrEmptySchema)(A));
}
qn.validateFunctionCode = y_;
function bv({ gen: A, validateName: e, schema: t, schemaEnv: n, opts: i }, o) {
  i.code.es5 ? A.func(e, (0, kA._)`${se.default.data}, ${se.default.valCxt}`, n.$async, () => {
    A.code((0, kA._)`"use strict"; ${XB(t, i)}`), Q_(A, i), A.code(o);
  }) : A.func(e, (0, kA._)`${se.default.data}, ${C_(i)}`, n.$async, () => A.code(XB(t, i)).code(o));
}
function C_(A) {
  return (0, kA._)`{${se.default.instancePath}="", ${se.default.parentData}, ${se.default.parentDataProperty}, ${se.default.rootData}=${se.default.data}${A.dynamicRef ? (0, kA._)`, ${se.default.dynamicAnchors}={}` : kA.nil}}={}`;
}
function Q_(A, e) {
  A.if(se.default.valCxt, () => {
    A.var(se.default.instancePath, (0, kA._)`${se.default.valCxt}.${se.default.instancePath}`), A.var(se.default.parentData, (0, kA._)`${se.default.valCxt}.${se.default.parentData}`), A.var(se.default.parentDataProperty, (0, kA._)`${se.default.valCxt}.${se.default.parentDataProperty}`), A.var(se.default.rootData, (0, kA._)`${se.default.valCxt}.${se.default.rootData}`), e.dynamicRef && A.var(se.default.dynamicAnchors, (0, kA._)`${se.default.valCxt}.${se.default.dynamicAnchors}`);
  }, () => {
    A.var(se.default.instancePath, (0, kA._)`""`), A.var(se.default.parentData, (0, kA._)`undefined`), A.var(se.default.parentDataProperty, (0, kA._)`undefined`), A.var(se.default.rootData, se.default.data), e.dynamicRef && A.var(se.default.dynamicAnchors, (0, kA._)`{}`);
  });
}
function F_(A) {
  const { schema: e, opts: t, gen: n } = A;
  bv(A, () => {
    t.$comment && e.$comment && Hv(A), x_(A), n.let(se.default.vErrors, null), n.let(se.default.errors, 0), t.unevaluated && U_(A), Iv(A), S_(A);
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
function b_(A, e) {
  if (_v(A) && (xv(A), Ev(A))) {
    E_(A, e);
    return;
  }
  (0, Uv.boolOrEmptySchema)(A, e);
}
function Ev({ schema: A, self: e }) {
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
function E_(A, e) {
  const { schema: t, gen: n, opts: i } = A;
  i.$comment && t.$comment && Hv(A), I_(A), H_(A);
  const o = n.const("_errs", se.default.errors);
  Iv(A, o), n.var(e, (0, kA._)`${o} === ${se.default.errors}`);
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
    A.code((0, kA._)`${se.default.self}.logger.log(${o})`);
  else if (typeof i.$comment == "function") {
    const l = (0, kA.str)`${n}/$comment`, f = A.scopeValue("root", { ref: e.root });
    A.code((0, kA._)`${se.default.self}.opts.$comment(${o}, ${l}, ${f}.schema)`);
  }
}
function S_(A) {
  const { gen: e, schemaEnv: t, validateName: n, ValidationError: i, opts: o } = A;
  t.$async ? e.if((0, kA._)`${se.default.errors} === 0`, () => e.return(se.default.data), () => e.throw((0, kA._)`new ${i}(${se.default.vErrors})`)) : (e.assign((0, kA._)`${n}.errors`, se.default.vErrors), o.unevaluated && L_(A), e.return((0, kA._)`${se.default.errors} === 0`));
}
function L_({ gen: A, evaluated: e, props: t, items: n }) {
  t instanceof kA.Name && A.assign((0, kA._)`${e}.props`, t), n instanceof kA.Name && A.assign((0, kA._)`${e}.items`, n);
}
function qB(A, e, t, n) {
  const { gen: i, schema: o, data: l, allErrors: f, opts: c, self: d } = A, { RULES: w } = d;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, kr.schemaHasRulesButRef)(o, w))) {
    i.block(() => Tv(A, "$ref", w.all.$ref.definition));
    return;
  }
  c.jtd || T_(A, e), i.block(() => {
    for (const g of w.rules)
      B(g);
    B(w.post);
  });
  function B(g) {
    (0, qh.shouldUseGroup)(o, g) && (g.type ? (i.if((0, ec.checkDataType)(g.type, l, c.strictNumbers)), zB(A, g), e.length === 1 && e[0] === g.type && t && (i.else(), (0, ec.reportTypeError)(A)), i.endIf()) : zB(A, g), f || i.if((0, kA._)`${se.default.errors} === ${n || 0}`));
  }
}
function zB(A, e) {
  const { gen: t, schema: n, opts: { useDefaults: i } } = A;
  i && (0, m_.assignDefaults)(A, e.type), t.block(() => {
    for (const o of e.rules)
      (0, qh.shouldUseRule)(n, o) && Tv(A, o.keyword, o.definition, e.type);
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
      Sv(A.dataTypes, t) || zh(A, `type "${t}" not allowed by context "${A.dataTypes.join(",")}"`);
    }), P_(A, e);
  }
}
function O_(A, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && zh(A, "use allowUnionTypes to allow union type keyword");
}
function N_(A, e) {
  const t = A.self.RULES.all;
  for (const n in t) {
    const i = t[n];
    if (typeof i == "object" && (0, qh.shouldUseRule)(A.schema, i)) {
      const { type: o } = i.definition;
      o.length && !o.some((l) => M_(e, l)) && zh(A, `missing type "${o.join(",")}" for keyword "${n}"`);
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
function zh(A, e) {
  const t = A.schemaEnv.baseId + A.errSchemaPath;
  e += ` at "${t}" (strictTypes)`, (0, kr.checkStrictMode)(A, e, A.opts.strictTypes);
}
class Lv {
  constructor(e, t, n) {
    if ((0, gs.validateKeywordUsage)(e, t, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, kr.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = t.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = t, this.$data)
      this.schemaCode = e.gen.const("vSchema", Dv(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, gs.validSchemaType)(this.schema, t.schemaType, t.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);
    ("code" in t ? t.trackErrors : t.errors !== !1) && (this.errsCount = e.gen.const("_errs", se.default.errors));
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
    const n = (0, ld.getSubschema)(this.it, e);
    (0, ld.extendSubschemaData)(n, this.it, e), (0, ld.extendSubschemaMode)(n, e);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return b_(i, t), i;
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
    return se.default.rootData;
  if (A[0] === "/") {
    if (!K_.test(A))
      throw new Error(`Invalid JSON-pointer: ${A}`);
    i = A, o = se.default.rootData;
  } else {
    const d = R_.exec(A);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${A}`);
    const w = +d[1];
    if (i = d[2], i === "#") {
      if (w >= e)
        throw new Error(c("property/index", w));
      return n[e - w];
    }
    if (w > e)
      throw new Error(c("data", w));
    if (o = t[e - w], !i)
      return o;
  }
  let l = o;
  const f = i.split("/");
  for (const d of f)
    d && (o = (0, kA._)`${o}${(0, kA.getProperty)((0, kr.unescapeJsonPointer)(d))}`, l = (0, kA._)`${l} && ${o}`);
  return l;
  function c(d, w) {
    return `Cannot access ${d} ${w} levels up, current level is ${e}`;
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
const cd = Ut;
class $_ extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`), this.missingRef = (0, cd.resolveUrl)(e, t, n), this.missingSchema = (0, cd.normalizeId)((0, cd.getFullPath)(e, this.missingRef));
  }
}
po.default = $_;
var An = {};
Object.defineProperty(An, "__esModule", { value: !0 });
An.resolveSchema = An.getCompilingSchema = An.resolveRef = An.compileSchema = An.SchemaEnv = void 0;
const Rn = ye, G_ = ks, Wi = pr, Wn = Ut, JB = PA, V_ = qn;
class Hc {
  constructor(e) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (t = e.baseId) !== null && t !== void 0 ? t : (0, Wn.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
An.SchemaEnv = Hc;
function Jh(A) {
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
  const d = {
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
  let w;
  try {
    this._compilations.add(A), (0, V_.validateFunctionCode)(d), l.optimize(this.opts.code.optimize);
    const B = l.toString();
    w = `${l.scopeRefs(Wi.default.scope)}return ${B}`, this.opts.code.process && (w = this.opts.code.process(w, A));
    const v = new Function(`${Wi.default.self}`, `${Wi.default.scope}`, w)(this, this.scope.get());
    if (this.scope.value(c, { ref: v }), v.errors = null, v.schema = A.schema, v.schemaEnv = A, A.$async && (v.$async = !0), this.opts.code.source === !0 && (v.source = { validateName: c, validateCode: B, scopeValues: l._values }), this.opts.unevaluated) {
      const { props: u, items: C } = d;
      v.evaluated = {
        props: u instanceof Rn.Name ? void 0 : u,
        items: C instanceof Rn.Name ? void 0 : C,
        dynamicProps: u instanceof Rn.Name,
        dynamicItems: C instanceof Rn.Name
      }, v.source && (v.source.evaluated = (0, Rn.stringify)(v.evaluated));
    }
    return A.validate = v, A;
  } catch (B) {
    throw delete A.validate, delete A.validateName, w && this.logger.error("Error compiling schema, function code:", w), B;
  } finally {
    this._compilations.delete(A);
  }
}
An.compileSchema = Jh;
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
  return (0, Wn.inlineRef)(A.schema, this.opts.inlineRefs) ? A.schema : A.validate ? A : Jh.call(this, A);
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
    return fd.call(this, t, A);
  const o = (0, Wn.normalizeId)(n), l = this.refs[o] || this.schemas[o];
  if (typeof l == "string") {
    const f = Sc.call(this, A, l);
    return typeof (f == null ? void 0 : f.schema) != "object" ? void 0 : fd.call(this, t, f);
  }
  if (typeof (l == null ? void 0 : l.schema) == "object") {
    if (l.validate || Jh.call(this, l), o === (0, Wn.normalizeId)(e)) {
      const { schema: f } = l, { schemaId: c } = this.opts, d = f[c];
      return d && (i = (0, Wn.resolveUrl)(this.opts.uriResolver, i, d)), new Hc({ schema: f, schemaId: c, root: A, baseId: i });
    }
    return fd.call(this, t, l);
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
function fd(A, { baseId: e, schema: t, root: n }) {
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
    const d = typeof t == "object" && t[this.opts.schemaId];
    !J_.has(f) && d && (e = (0, Wn.resolveUrl)(this.opts.uriResolver, e, d));
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
var jh = {}, Lc = { exports: {} };
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
function Jd(A, e = !1) {
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
        const d = Jd(i);
        if (d !== void 0)
          n.push(d);
        else
          return t.error = !0, !1;
      }
      i.length = 0;
    }
    return !0;
  }
  for (let d = 0; d < A.length; d++) {
    const w = A[d];
    if (!(w === "[" || w === "]"))
      if (w === ":") {
        if (l === !0 && (f = !0), !c())
          break;
        if (e++, n.push(":"), e > 7) {
          t.error = !0;
          break;
        }
        d - 1 >= 0 && A[d - 1] === ":" && (l = !0);
        continue;
      } else if (w === "%") {
        if (!c())
          break;
        o = !0;
      } else {
        i.push(w);
        continue;
      }
  }
  return i.length && (o ? t.zone = i.join("") : f ? n.push(i.join("")) : n.push(Jd(i))), t.address = n.join(""), t;
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
var dx = {
  recomposeAuthority: fx,
  normalizeComponentEncoding: cx,
  removeDotSegments: lx,
  normalizeIPv4: Nv,
  normalizeIPv6: Mv,
  stringArrayToHexStripped: Jd
};
const hx = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, px = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
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
    const i = `${n}:${e.nid || A.nid}`, o = Yh[i];
    A.path = void 0, o && (A = o.parse(A, e));
  } else
    A.error = A.error || "URN can not be parsed.";
  return A;
}
function mx(A, e) {
  const t = e.scheme || A.scheme || "urn", n = A.nid.toLowerCase(), i = `${t}:${e.nid || n}`, o = Yh[i];
  o && (A = o.serialize(A, e));
  const l = A, f = A.nss;
  return l.path = `${n || e.nid}:${f}`, e.skipEscape = !0, l;
}
function vx(A, e) {
  const t = A;
  return t.uuid = t.nss, t.nss = void 0, !e.tolerant && (!t.uuid || !hx.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
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
}, Yh = {
  http: $v,
  https: Cx,
  ws: Rl,
  wss: Qx,
  urn: Fx,
  "urn:uuid": Ux
};
var bx = Yh;
const { normalizeIPv6: Ex, normalizeIPv4: _x, removeDotSegments: is, recomposeAuthority: xx, normalizeComponentEncoding: tl } = dx, Zh = bx;
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
  }, n = Object.assign({}, e), i = [], o = Zh[(n.scheme || t.scheme || "").toLowerCase()];
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
        const d = Ex(c.host, { isIPV4: !1 });
        n.host = d.host.toLowerCase(), o = d.isIPV6;
      } else
        n.host = c.host, o = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && !n.path && n.query === void 0 ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
    const f = Zh[(t.scheme || n.scheme || "").toLowerCase()];
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
  SCHEMES: Zh,
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
Object.defineProperty(jh, "__esModule", { value: !0 });
const Vv = Ox;
Vv.code = 'require("ajv/dist/runtime/uri").default';
jh.default = Vv;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.CodeGen = A.Name = A.nil = A.stringify = A.str = A._ = A.KeywordCxt = void 0;
  var e = qn;
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
  const n = ks, i = po, o = sa, l = An, f = ye, c = Ut, d = dt, w = PA, B = nx, g = jh, v = (iA, T) => new RegExp(iA, T);
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
    var T, AA, J, L, R, nA, QA, UA, qA, te, zA, SA, aA, wA, bA, jA, ge, fe, lt, ke, Be, Le, ne, Ve, Et;
    const Mt = iA.strict, _t = (T = iA.code) === null || T === void 0 ? void 0 : T.optimize, mt = _t === !0 || _t === void 0 ? 1 : _t || 0, fn = (J = (AA = iA.code) === null || AA === void 0 ? void 0 : AA.regExp) !== null && J !== void 0 ? J : v, mr = (L = iA.uriResolver) !== null && L !== void 0 ? L : g.default;
    return {
      strictSchema: (nA = (R = iA.strictSchema) !== null && R !== void 0 ? R : Mt) !== null && nA !== void 0 ? nA : !0,
      strictNumbers: (UA = (QA = iA.strictNumbers) !== null && QA !== void 0 ? QA : Mt) !== null && UA !== void 0 ? UA : !0,
      strictTypes: (te = (qA = iA.strictTypes) !== null && qA !== void 0 ? qA : Mt) !== null && te !== void 0 ? te : "log",
      strictTuples: (SA = (zA = iA.strictTuples) !== null && zA !== void 0 ? zA : Mt) !== null && SA !== void 0 ? SA : "log",
      strictRequired: (wA = (aA = iA.strictRequired) !== null && aA !== void 0 ? aA : Mt) !== null && wA !== void 0 ? wA : !1,
      code: iA.code ? { ...iA.code, optimize: mt, regExp: fn } : { optimize: mt, regExp: fn },
      loopRequired: (bA = iA.loopRequired) !== null && bA !== void 0 ? bA : H,
      loopEnum: (jA = iA.loopEnum) !== null && jA !== void 0 ? jA : H,
      meta: (ge = iA.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (fe = iA.messages) !== null && fe !== void 0 ? fe : !0,
      inlineRefs: (lt = iA.inlineRefs) !== null && lt !== void 0 ? lt : !0,
      schemaId: (ke = iA.schemaId) !== null && ke !== void 0 ? ke : "$id",
      addUsedSchema: (Be = iA.addUsedSchema) !== null && Be !== void 0 ? Be : !0,
      validateSchema: (Le = iA.validateSchema) !== null && Le !== void 0 ? Le : !0,
      validateFormats: (ne = iA.validateFormats) !== null && ne !== void 0 ? ne : !0,
      unicodeRegExp: (Ve = iA.unicodeRegExp) !== null && Ve !== void 0 ? Ve : !0,
      int32range: (Et = iA.int32range) !== null && Et !== void 0 ? Et : !0,
      uriResolver: mr
    };
  }
  class _ {
    constructor(T = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), T = this.opts = { ...T, ...O(T) };
      const { es5: AA, lines: J } = this.opts.code;
      this.scope = new f.ValueScope({ scope: {}, prefixes: C, es5: AA, lines: J }), this.logger = NA(T.logger);
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
        const SA = this._addSchema(te, zA);
        return SA.validate || nA.call(this, SA);
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
          return QA.call(this, zA), await UA.call(this, zA.missingSchema), nA.call(this, te);
        }
      }
      function QA({ missingSchema: te, missingRef: zA }) {
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
        return (0, w.eachItem)(J, (R) => yA.call(this, R)), this;
      fA.call(this, AA);
      const L = {
        ...AA,
        type: (0, d.getJSONTypes)(AA.type),
        schemaType: (0, d.getJSONTypes)(AA.schemaType)
      };
      return (0, w.eachItem)(J, L.type.length === 0 ? (R) => yA.call(this, R, L) : (R) => L.type.forEach((nA) => yA.call(this, R, L, nA))), this;
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
        for (const QA of R)
          nA = nA[QA];
        for (const QA in J) {
          const UA = J[QA];
          if (typeof UA != "object")
            continue;
          const { $data: qA } = UA.definition, te = nA[QA];
          qA && te && (nA[QA] = xA(te));
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
      const { schemaId: QA } = this.opts;
      if (typeof T == "object")
        nA = T[QA];
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
      return UA = new l.SchemaEnv({ schema: T, schemaId: QA, meta: AA, baseId: J, localRefs: qA }), this._cache.set(UA.schema, UA), R && !J.startsWith("#") && (J && this._checkUnique(J), this.refs[J] = UA), L && this.validateSchema(T, !0), UA;
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
  const FA = { log() {
  }, warn() {
  }, error() {
  } };
  function NA(iA) {
    if (iA === !1)
      return FA;
    if (iA === void 0)
      return console;
    if (iA.log && iA.warn && iA.error)
      return iA;
    throw new Error("logger must implement log, warn and error methods");
  }
  const _A = /^[a-z_$][a-z0-9_$:-]*$/i;
  function W(iA, T) {
    const { RULES: AA } = this;
    if ((0, w.eachItem)(iA, (J) => {
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
    const QA = {
      keyword: iA,
      definition: {
        ...T,
        type: (0, d.getJSONTypes)(T.type),
        schemaType: (0, d.getJSONTypes)(T.schemaType)
      }
    };
    T.before ? eA.call(this, nA, QA, T.before) : nA.rules.push(QA), R.all[iA] = QA, (J = T.implements) === null || J === void 0 || J.forEach((UA) => this.addKeyword(UA));
  }
  function eA(iA, T, AA) {
    const J = iA.rules.findIndex((L) => L.keyword === AA);
    J >= 0 ? iA.rules.splice(J, 0, T) : (iA.rules.push(T), this.logger.warn(`rule ${AA} is not defined`));
  }
  function fA(iA) {
    let { metaSchema: T } = iA;
    T !== void 0 && (iA.$data && this.opts.$data && (T = xA(T)), iA.validateSchema = this.compile(T, !0));
  }
  const EA = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function xA(iA) {
    return { anyOf: [iA, EA] };
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
var ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
ua.callRef = ua.getValidate = void 0;
const Mx = po, Aw = ve, Yt = ye, Pa = pr, ew = An, nl = PA, Px = {
  keyword: "$ref",
  schemaType: "string",
  code(A) {
    const { gen: e, schema: t, it: n } = A, { baseId: i, schemaEnv: o, validateName: l, opts: f, self: c } = n, { root: d } = o;
    if ((t === "#" || t === "#/") && i === d.baseId)
      return B();
    const w = ew.resolveRef.call(c, d, i, t);
    if (w === void 0)
      throw new Mx.default(n.opts.uriResolver, i, t);
    if (w instanceof ew.SchemaEnv)
      return g(w);
    return v(w);
    function B() {
      if (o === d)
        return kl(A, l, o, o.$async);
      const u = e.scopeValue("root", { ref: d });
      return kl(A, (0, Yt._)`${u}.validate`, d, d.$async);
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
ua.getValidate = Wv;
function kl(A, e, t, n) {
  const { gen: i, it: o } = A, { allErrors: l, schemaEnv: f, opts: c } = o, d = c.passContext ? Pa.default.this : Yt.nil;
  n ? w() : B();
  function w() {
    if (!f.$async)
      throw new Error("async schema referenced by sync schema");
    const u = i.let("valid");
    i.try(() => {
      i.code((0, Yt._)`await ${(0, Aw.callValidateCode)(A, e, d)}`), v(e), l || i.assign(u, !0);
    }, (C) => {
      i.if((0, Yt._)`!(${C} instanceof ${o.ValidationError})`, () => i.throw(C)), g(C), l || i.assign(u, !1);
    }), A.ok(u);
  }
  function B() {
    A.result((0, Aw.callValidateCode)(A, e, d), () => v(e), () => g(e));
  }
  function g(u) {
    const C = (0, Yt._)`${u}.errors`;
    i.assign(Pa.default.vErrors, (0, Yt._)`${Pa.default.vErrors} === null ? ${C} : ${Pa.default.vErrors}.concat(${C})`), i.assign(Pa.default.errors, (0, Yt._)`${Pa.default.vErrors}.length`);
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
ua.callRef = kl;
ua.default = Px;
Object.defineProperty(tp, "__esModule", { value: !0 });
const Kx = np, Rx = ua, kx = [
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
const tc = ye, hi = tc.operators, nc = {
  maximum: { okStr: "<=", ok: hi.LTE, fail: hi.GT },
  minimum: { okStr: ">=", ok: hi.GTE, fail: hi.LT },
  exclusiveMaximum: { okStr: "<", ok: hi.LT, fail: hi.GTE },
  exclusiveMinimum: { okStr: ">", ok: hi.GT, fail: hi.LTE }
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
const Bs = ye, Vx = {
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
const Yi = ye, Xx = PA, qx = sp, zx = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxLength" ? "more" : "fewer";
    return (0, Yi.str)`must NOT have ${t} than ${e} characters`;
  },
  params: ({ schemaCode: A }) => (0, Yi._)`{limit: ${A}}`
}, Jx = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: zx,
  code(A) {
    const { keyword: e, data: t, schemaCode: n, it: i } = A, o = e === "maxLength" ? Yi.operators.GT : Yi.operators.LT, l = i.opts.unicode === !1 ? (0, Yi._)`${t}.length` : (0, Yi._)`${(0, Xx.useFunc)(A.gen, qx.default)}(${t})`;
    A.fail$data((0, Yi._)`${l} ${o} ${n}`);
  }
};
op.default = Jx;
var up = {};
Object.defineProperty(up, "__esModule", { value: !0 });
const jx = ve, rc = ye, Yx = {
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
const ws = ye, AI = {
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
const jo = ve, ms = ye, tI = PA, nI = {
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
    if (l.allErrors ? d() : w(), f.strictRequired) {
      const v = A.parentSchema.properties, { definedProperties: u } = A.it;
      for (const C of t)
        if ((v == null ? void 0 : v[C]) === void 0 && !u.has(C)) {
          const F = l.schemaEnv.baseId + l.errSchemaPath, U = `required property "${C}" is not defined at "${F}" (strictRequired)`;
          (0, tI.checkStrictMode)(l, U, l.opts.strictRequired);
        }
    }
    function d() {
      if (c || o)
        A.block$data(ms.nil, B);
      else
        for (const v of t)
          (0, jo.checkReportMissingProp)(A, v);
    }
    function w() {
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
const vs = ye, iI = {
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
var dp = {}, $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const qv = vv;
qv.code = 'require("ajv/dist/runtime/equal").default';
$s.default = qv;
Object.defineProperty(dp, "__esModule", { value: !0 });
const dd = dt, Qt = ye, oI = PA, sI = $s, uI = {
  message: ({ params: { i: A, j: e } }) => (0, Qt.str)`must NOT have duplicate items (items ## ${e} and ${A} are identical)`,
  params: ({ params: { i: A, j: e } }) => (0, Qt._)`{i: ${A}, j: ${e}}`
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
    const c = e.let("valid"), d = o.items ? (0, dd.getSchemaTypes)(o.items) : [];
    A.block$data(c, w, (0, Qt._)`${l} === false`), A.ok(c);
    function w() {
      const u = e.let("i", (0, Qt._)`${t}.length`), C = e.let("j");
      A.setParams({ i: u, j: C }), e.assign(c, !0), e.if((0, Qt._)`${u} > 1`, () => (B() ? g : v)(u, C));
    }
    function B() {
      return d.length > 0 && !d.some((u) => u === "object" || u === "array");
    }
    function g(u, C) {
      const F = e.name("item"), U = (0, dd.checkDataTypes)(d, F, f.opts.strictNumbers, dd.DataType.Wrong), H = e.const("indices", (0, Qt._)`{}`);
      e.for((0, Qt._)`;${u}--;`, () => {
        e.let(F, (0, Qt._)`${t}[${u}]`), e.if(U, (0, Qt._)`continue`), d.length > 1 && e.if((0, Qt._)`typeof ${F} == "string"`, (0, Qt._)`${F} += "_"`), e.if((0, Qt._)`typeof ${H}[${F}] == "number"`, () => {
          e.assign(C, (0, Qt._)`${H}[${F}]`), A.error(), e.assign(c, !1).break();
        }).code((0, Qt._)`${H}[${F}] = ${u}`);
      });
    }
    function v(u, C) {
      const F = (0, oI.useFunc)(e, sI.default), U = e.name("outer");
      e.label(U).for((0, Qt._)`;${u}--;`, () => e.for((0, Qt._)`${C} = ${u}; ${C}--;`, () => e.if((0, Qt._)`${F}(${t}[${u}], ${t}[${C}])`, () => {
        A.error(), e.assign(c, !1).break(U);
      })));
    }
  }
};
dp.default = lI;
var hp = {};
Object.defineProperty(hp, "__esModule", { value: !0 });
const jd = ye, cI = PA, fI = $s, dI = {
  message: "must be equal to constant",
  params: ({ schemaCode: A }) => (0, jd._)`{allowedValue: ${A}}`
}, hI = {
  keyword: "const",
  $data: !0,
  error: dI,
  code(A) {
    const { gen: e, data: t, $data: n, schemaCode: i, schema: o } = A;
    n || o && typeof o == "object" ? A.fail$data((0, jd._)`!${(0, cI.useFunc)(e, fI.default)}(${t}, ${i})`) : A.fail((0, jd._)`${o} !== ${t}`);
  }
};
hp.default = hI;
var pp = {};
Object.defineProperty(pp, "__esModule", { value: !0 });
const as = ye, pI = PA, gI = $s, BI = {
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
    const d = () => c ?? (c = (0, pI.useFunc)(e, gI.default));
    let w;
    if (f || n)
      w = e.let("valid"), A.block$data(w, B);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const v = e.const("vSchema", o);
      w = (0, as.or)(...i.map((u, C) => g(v, C)));
    }
    A.pass(w);
    function B() {
      e.assign(w, !1), e.forOf("v", o, (v) => e.if((0, as._)`${d()}(${t}, ${v})`, () => e.assign(w, !0).break()));
    }
    function g(v, u) {
      const C = i[u];
      return typeof C == "object" && C !== null ? (0, as._)`${d()}(${t}, ${v}[${u}])` : (0, as._)`${t} === ${C}`;
    }
  }
};
pp.default = wI;
Object.defineProperty(rp, "__esModule", { value: !0 });
const mI = ip, vI = ap, yI = op, CI = up, QI = lp, FI = cp, UI = fp, bI = dp, EI = hp, _I = pp, xI = [
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
  bI.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  EI.default,
  _I.default
];
rp.default = xI;
var gp = {}, go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
go.validateAdditionalItems = void 0;
const Zi = ye, Yd = PA, II = {
  message: ({ params: { len: A } }) => (0, Zi.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, Zi._)`{limit: ${A}}`
}, HI = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: II,
  code(A) {
    const { parentSchema: e, it: t } = A, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, Yd.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    zv(A, n);
  }
};
function zv(A, e) {
  const { gen: t, schema: n, data: i, keyword: o, it: l } = A;
  l.items = !0;
  const f = t.const("len", (0, Zi._)`${i}.length`);
  if (n === !1)
    A.setParams({ len: e.length }), A.pass((0, Zi._)`${f} <= ${e.length}`);
  else if (typeof n == "object" && !(0, Yd.alwaysValidSchema)(l, n)) {
    const d = t.var("valid", (0, Zi._)`${f} <= ${e.length}`);
    t.if((0, Zi.not)(d), () => c(d)), A.ok(d);
  }
  function c(d) {
    t.forRange("i", e.length, f, (w) => {
      A.subschema({ keyword: o, dataProp: w, dataPropType: Yd.Type.Num }, d), l.allErrors || t.if((0, Zi.not)(d), () => t.break());
    });
  }
}
go.validateAdditionalItems = zv;
go.default = HI;
var Bp = {}, Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.validateTuple = void 0;
const tw = ye, $l = PA, SI = ve, LI = {
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
  w(i), f.opts.unevaluated && t.length && f.items !== !0 && (f.items = $l.mergeEvaluated.items(n, t.length, f.items));
  const c = n.name("valid"), d = n.const("len", (0, tw._)`${o}.length`);
  t.forEach((B, g) => {
    (0, $l.alwaysValidSchema)(f, B) || (n.if((0, tw._)`${d} > ${g}`, () => A.subschema({
      keyword: l,
      schemaProp: g,
      dataProp: g
    }, c)), A.ok(c));
  });
  function w(B) {
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
const nw = ye, OI = PA, NI = ve, MI = go, PI = {
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
const yn = ye, rl = PA, RI = {
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
    const { minContains: c, maxContains: d } = n;
    o.opts.next ? (l = c === void 0 ? 1 : c, f = d) : l = 1;
    const w = e.const("len", (0, yn._)`${i}.length`);
    if (A.setParams({ min: l, max: f }), f === void 0 && l === 0) {
      (0, rl.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (f !== void 0 && l > f) {
      (0, rl.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), A.fail();
      return;
    }
    if ((0, rl.alwaysValidSchema)(o, t)) {
      let C = (0, yn._)`${w} >= ${l}`;
      f !== void 0 && (C = (0, yn._)`${C} && ${w} <= ${f}`), A.pass(C);
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
      e.forRange("i", 0, w, (U) => {
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
  const e = ye, t = PA, n = ve;
  A.error = {
    message: ({ params: { property: c, depsCount: d, deps: w } }) => {
      const B = d === 1 ? "property" : "properties";
      return (0, e.str)`must have ${B} ${w} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: w, missingProperty: B } }) => (0, e._)`{property: ${c},
    missingProperty: ${B},
    depsCount: ${d},
    deps: ${w}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: A.error,
    code(c) {
      const [d, w] = o(c);
      l(c, d), f(c, w);
    }
  };
  function o({ schema: c }) {
    const d = {}, w = {};
    for (const B in c) {
      if (B === "__proto__")
        continue;
      const g = Array.isArray(c[B]) ? d : w;
      g[B] = c[B];
    }
    return [d, w];
  }
  function l(c, d = c.schema) {
    const { gen: w, data: B, it: g } = c;
    if (Object.keys(d).length === 0)
      return;
    const v = w.let("missing");
    for (const u in d) {
      const C = d[u];
      if (C.length === 0)
        continue;
      const F = (0, n.propertyInData)(w, B, u, g.opts.ownProperties);
      c.setParams({
        property: u,
        depsCount: C.length,
        deps: C.join(", ")
      }), g.allErrors ? w.if(F, () => {
        for (const U of C)
          (0, n.checkReportMissingProp)(c, U);
      }) : (w.if((0, e._)`${F} && (${(0, n.checkMissingProp)(c, C, v)})`), (0, n.reportMissingProp)(c, v), w.else());
    }
  }
  A.validatePropertyDeps = l;
  function f(c, d = c.schema) {
    const { gen: w, data: B, keyword: g, it: v } = c, u = w.name("valid");
    for (const C in d)
      (0, t.alwaysValidSchema)(v, d[C]) || (w.if(
        (0, n.propertyInData)(w, B, C, v.opts.ownProperties),
        () => {
          const F = c.subschema({ keyword: g, schemaProp: C }, u);
          c.mergeValidEvaluated(F, u);
        },
        () => w.var(u, !0)
        // TODO var
      ), c.ok(u));
  }
  A.validateSchemaDeps = f, A.default = i;
})(jv);
var vp = {};
Object.defineProperty(vp, "__esModule", { value: !0 });
const Yv = ye, $I = PA, GI = {
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
const il = ve, kn = ye, WI = pr, al = PA, XI = {
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
    const d = (0, il.allSchemaProperties)(n.properties), w = (0, il.allSchemaProperties)(n.patternProperties);
    B(), A.ok((0, kn._)`${o} === ${WI.default.errors}`);
    function B() {
      e.forIn("key", i, (F) => {
        !d.length && !w.length ? u(F) : e.if(g(F), () => u(F));
      });
    }
    function g(F) {
      let U;
      if (d.length > 8) {
        const H = (0, al.schemaRefOrVal)(l, n.properties, "properties");
        U = (0, il.isOwnProperty)(e, H, F);
      } else d.length ? U = (0, kn.or)(...d.map((H) => (0, kn._)`${F} === ${H}`)) : U = kn.nil;
      return w.length && (U = (0, kn.or)(U, ...w.map((H) => (0, kn._)`${(0, il.usePattern)(A, H)}.test(${F})`))), (0, kn.not)(U);
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
const zI = qn, rw = ve, hd = PA, iw = Tc, JI = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: o } = A;
    o.opts.removeAdditional === "all" && n.additionalProperties === void 0 && iw.default.code(new zI.KeywordCxt(o, iw.default, "additionalProperties"));
    const l = (0, rw.allSchemaProperties)(t);
    for (const B of l)
      o.definedProperties.add(B);
    o.opts.unevaluated && l.length && o.props !== !0 && (o.props = hd.mergeEvaluated.props(e, (0, hd.toHash)(l), o.props));
    const f = l.filter((B) => !(0, hd.alwaysValidSchema)(o, t[B]));
    if (f.length === 0)
      return;
    const c = e.name("valid");
    for (const B of f)
      d(B) ? w(B) : (e.if((0, rw.propertyInData)(e, i, B, o.opts.ownProperties)), w(B), o.allErrors || e.else().var(c, !0), e.endIf()), A.it.definedProperties.add(B), A.ok(c);
    function d(B) {
      return o.opts.useDefaults && !o.compositeRule && t[B].default !== void 0;
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
yp.default = JI;
var Cp = {};
Object.defineProperty(Cp, "__esModule", { value: !0 });
const aw = ve, ol = ye, ow = PA, sw = PA, jI = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, data: n, parentSchema: i, it: o } = A, { opts: l } = o, f = (0, aw.allSchemaProperties)(t), c = f.filter((C) => (0, ow.alwaysValidSchema)(o, t[C]));
    if (f.length === 0 || c.length === f.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const d = l.strictSchema && !l.allowMatchingProperties && i.properties, w = e.name("valid");
    o.props !== !0 && !(o.props instanceof ol.Name) && (o.props = (0, sw.evaluatedPropsToName)(e, o.props));
    const { props: B } = o;
    g();
    function g() {
      for (const C of f)
        d && v(C), o.allErrors ? u(C) : (e.var(w, !0), u(C), e.if(w));
    }
    function v(C) {
      for (const F in d)
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
          }, w), o.opts.unevaluated && B !== !0 ? e.assign((0, ol._)`${B}[${F}]`, !0) : !U && !o.allErrors && e.if((0, ol.not)(w), () => e.break());
        });
      });
    }
  }
};
Cp.default = jI;
var Qp = {};
Object.defineProperty(Qp, "__esModule", { value: !0 });
const YI = PA, ZI = {
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
const AH = ve, eH = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: AH.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Fp.default = eH;
var Up = {};
Object.defineProperty(Up, "__esModule", { value: !0 });
const Gl = ye, tH = PA, nH = {
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
    A.setParams({ passing: f }), e.block(d), A.result(l, () => A.reset(), () => A.error(!0));
    function d() {
      o.forEach((w, B) => {
        let g;
        (0, tH.alwaysValidSchema)(i, w) ? e.var(c, !0) : g = A.subschema({
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
var bp = {};
Object.defineProperty(bp, "__esModule", { value: !0 });
const iH = PA, aH = {
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
bp.default = aH;
var Ep = {};
Object.defineProperty(Ep, "__esModule", { value: !0 });
const ic = ye, Zv = PA, oH = {
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
      const w = e.let("ifClause");
      A.setParams({ ifClause: w }), e.if(f, d("then", w), d("else", w));
    } else i ? e.if(f, d("then")) : e.if((0, ic.not)(f), d("else"));
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
    function d(w, B) {
      return () => {
        const g = A.subschema({ keyword: w }, f);
        e.assign(l, f), A.mergeValidEvaluated(g, l), B ? e.assign(B, (0, ic._)`${w}`) : A.setParams({ ifClause: w });
      };
    }
  }
};
function uw(A, e) {
  const t = A.schema[e];
  return t !== void 0 && !(0, Zv.alwaysValidSchema)(A, t);
}
Ep.default = sH;
var _p = {};
Object.defineProperty(_p, "__esModule", { value: !0 });
const uH = PA, lH = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: A, parentSchema: e, it: t }) {
    e.if === void 0 && (0, uH.checkStrictMode)(t, `"${A}" without "if" is ignored`);
  }
};
_p.default = lH;
Object.defineProperty(gp, "__esModule", { value: !0 });
const cH = go, fH = Bp, dH = Bo, hH = wp, pH = mp, gH = jv, BH = vp, wH = Tc, mH = yp, vH = Cp, yH = Qp, CH = Fp, QH = Up, FH = bp, UH = Ep, bH = _p;
function EH(A = !1) {
  const e = [
    // any
    yH.default,
    CH.default,
    QH.default,
    FH.default,
    UH.default,
    bH.default,
    // object
    BH.default,
    wH.default,
    gH.default,
    mH.default,
    vH.default
  ];
  return A ? e.push(fH.default, hH.default) : e.push(cH.default, dH.default), e.push(pH.default), e;
}
gp.default = EH;
var xp = {}, Ip = {};
Object.defineProperty(Ip, "__esModule", { value: !0 });
const at = ye, _H = {
  message: ({ schemaCode: A }) => (0, at.str)`must match format "${A}"`,
  params: ({ schemaCode: A }) => (0, at._)`{format: ${A}}`
}, xH = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: _H,
  code(A, e) {
    const { gen: t, data: n, $data: i, schema: o, schemaCode: l, it: f } = A, { opts: c, errSchemaPath: d, schemaEnv: w, self: B } = f;
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
        const _ = w.$async ? (0, at._)`(${C}.async ? await ${U}(${n}) : ${U}(${n}))` : (0, at._)`${U}(${n})`, M = (0, at._)`(typeof ${U} == "function" ? ${_} : ${U}.test(${n}))`;
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
          return `unknown format "${o}" ignored in schema at path "${d}"`;
        }
      }
      function O(M) {
        const K = M instanceof RegExp ? (0, at.regexpCode)(M) : c.code.formats ? (0, at._)`${c.code.formats}${(0, at.getProperty)(o)}` : void 0, z = t.scopeValue("formats", { key: o, ref: M, code: K });
        return typeof M == "object" && !(M instanceof RegExp) ? [M.type || "string", M.validate, (0, at._)`${z}.validate`] : ["string", M, z];
      }
      function _() {
        if (typeof u == "object" && !(u instanceof RegExp) && u.async) {
          if (!w.$async)
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
const Xa = ye, Zd = Dc, fw = An, NH = po, MH = PA, PH = {
  message: ({ params: { discrError: A, tagName: e } }) => A === Zd.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: A, tag: e, tagName: t } }) => (0, Xa._)`{error: ${A}, tag: ${t}, tagValue: ${e}}`
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
    const c = e.let("valid", !1), d = e.const("tag", (0, Xa._)`${t}${(0, Xa.getProperty)(f)}`);
    e.if((0, Xa._)`typeof ${d} == "string"`, () => w(), () => A.error(!1, { discrError: Zd.DiscrError.Tag, tag: d, tagName: f })), A.ok(c);
    function w() {
      const v = g();
      e.if(!1);
      for (const u in v)
        e.elseIf((0, Xa._)`${d} === ${u}`), e.assign(c, B(v[u]));
      e.else(), A.error(!1, { discrError: Zd.DiscrError.Mapping, tag: d, tagName: f }), e.endIf();
    }
    function B(v) {
      const u = e.name("valid"), C = A.subschema({ keyword: "oneOf", schemaProp: v }, u);
      return A.mergeEvaluated(C, Xa.Name), u;
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
  var d = qn;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
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
  var B = ks;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return B.default;
  } });
  var g = po;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return g.default;
  } });
})(Vd, Vd.exports);
var qH = Vd.exports;
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
}, eS = new A0(), dw = eS.compile(AS), tS = function() {
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
      let n = await (await fetch(e)).json();
      return Array.isArray(n) && n.length > 0 && (n = n[0]), n.genoMapsJSON && (n = n.genoMapsJSON), A(n);
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
}, uS = new A0(), hw = uS.compile(sS), lS = function() {
  var A = function(e) {
    if (!hw(e))
      throw console.log("json:", e), console.log("Invalid data:", hw.errors), new Error("Invalid data");
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
}, cS = function() {
  var A = function(n) {
    if (n == null || n === "") return "#333";
    var i = String(n);
    if (i.charAt(0) === "#")
      return i.length >= 7 ? i : "#" + i.slice(1).padStart(6, "0");
    var o = new Array(8 - i.length + 1).join("0");
    let l = "#" + o + i.substring(2, i.length);
    return l == "#00FF00" && (l = "#208000"), l;
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
    return typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] data_reader: annotations.features.length =", o && o.features && o.features.length || 0, "basemap chromosomes =", i.chromosomes && i.chromosomes.length || 0), o.features.forEach(function(l) {
      l.color = A(l.color);
    }), o.features.filter(function(l) {
      return l.type.toLowerCase() === "gene";
    }).forEach(function(l, f) {
      l.globalIndex = f;
    }), i.chromosomes.forEach(function(l) {
      var f = o.features.filter(function(F) {
        return String(F.chromosome) === String(l.number);
      }), c = f.filter(function(F) {
        return F.type.toLowerCase() === "gene";
      }), d = f.filter(function(F) {
        return F.type.toLowerCase() === "qtl";
      }), w = f.filter(function(F) {
        return F.type.toLowerCase() === "snp";
      });
      typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] data_reader: chr", l.number, "features matched:", {
        total: f.length,
        genes: c.length,
        qtls: d.length,
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
      }), d.forEach(function(F, U) {
        F.id = l.number + "_" + U, F.selected = !1;
      }), d.reduce(function(F, U) {
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
        qtls: d,
        snps: w
      };
    }), i;
  };
  return {
    readData: async function(n, i, o) {
      var l = lS();
      let f;
      if (o ? f = l.readBasemapFromRawJSON(n) : f = await l.readBasemap(n), i) {
        var c = tS();
        let w;
        o ? w = c.readAnnotationJSONFromRawJSON(i) : w = c.readAnnotation(i);
        var d = Promise.all([f, w]).then(
          t,
          function(B) {
            return f.then(e);
          }
        );
        return d;
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
    var t, n = "4.17.21", i = 200, o = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", f = "Invalid `variable` option passed into `_.template`", c = "__lodash_hash_undefined__", d = 500, w = "__lodash_placeholder__", B = 1, g = 2, v = 4, u = 1, C = 2, F = 1, U = 2, H = 4, O = 8, _ = 16, M = 32, K = 64, z = 128, cA = 256, sA = 512, gA = 30, FA = "...", NA = 800, _A = 16, W = 1, yA = 2, eA = 3, fA = 1 / 0, EA = 9007199254740991, xA = 17976931348623157e292, iA = NaN, T = 4294967295, AA = T - 1, J = T >>> 1, L = [
      ["ary", z],
      ["bind", F],
      ["bindKey", U],
      ["curry", O],
      ["curryRight", _],
      ["flip", sA],
      ["partial", M],
      ["partialRight", K],
      ["rearg", cA]
    ], R = "[object Arguments]", nA = "[object Array]", QA = "[object AsyncFunction]", UA = "[object Boolean]", qA = "[object Date]", te = "[object DOMException]", zA = "[object Error]", SA = "[object Function]", aA = "[object GeneratorFunction]", wA = "[object Map]", bA = "[object Number]", jA = "[object Null]", ge = "[object Object]", fe = "[object Promise]", lt = "[object Proxy]", ke = "[object RegExp]", Be = "[object Set]", Le = "[object String]", ne = "[object Symbol]", Ve = "[object Undefined]", Et = "[object WeakMap]", Mt = "[object WeakSet]", _t = "[object ArrayBuffer]", mt = "[object DataView]", fn = "[object Float32Array]", mr = "[object Float64Array]", _i = "[object Int8Array]", qr = "[object Int16Array]", zr = "[object Int32Array]", lA = "[object Uint8Array]", DA = "[object Uint8ClampedArray]", WA = "[object Uint16Array]", Ce = "[object Uint32Array]", Qe = /\b__p \+= '';/g, st = /\b(__p \+=) '' \+/g, xt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, _n = /&(?:amp|lt|gt|quot|#39);/g, xi = /[&<>"']/g, xn = RegExp(_n.source), Ii = RegExp(xi.source), Jr = /<%-([\s\S]+?)%>/g, dn = /<%([\s\S]+?)%>/g, Hi = /<%=([\s\S]+?)%>/g, jr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, vr = /^\w*$/, js = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, mo = /[\\^$.*+?()[\]{}|]/g, yr = RegExp(mo.source), ha = /^\s+/, Si = /\s/, Ys = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Zs = /\{\n\/\* \[wrapped with (.+)\] \*/, pa = /,? & /, Au = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, ga = /[()=,{}\[\]\/\s]/, vo = /\\(\\)?/g, eu = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, jn = /\w*$/, Yn = /^[-+]0x[0-9a-f]+$/i, jc = /^0b[01]+$/i, yo = /^\[object .+?Constructor\]$/, Co = /^0o[0-7]+$/i, Yc = /^(?:0|[1-9]\d*)$/, Zc = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Ba = /($^)/, Af = /['\n\r\u2028\u2029\\]/g, Li = "\\ud800-\\udfff", tu = "\\u0300-\\u036f", nu = "\\ufe20-\\ufe2f", ru = "\\u20d0-\\u20ff", Qo = tu + nu + ru, Fo = "\\u2700-\\u27bf", Uo = "a-z\\xdf-\\xf6\\xf8-\\xff", iu = "\\xac\\xb1\\xd7\\xf7", It = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Yr = "\\u2000-\\u206f", wa = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", au = "A-Z\\xc0-\\xd6\\xd8-\\xde", ou = "\\ufe0e\\ufe0f", bo = iu + It + Yr + wa, Zr = "['’]", su = "[" + Li + "]", uu = "[" + bo + "]", ma = "[" + Qo + "]", Xt = "\\d+", ef = "[" + Fo + "]", lu = "[" + Uo + "]", Cr = "[^" + Li + bo + Xt + Fo + Uo + au + "]", va = "\\ud83c[\\udffb-\\udfff]", In = "(?:" + ma + "|" + va + ")", ya = "[^" + Li + "]", Hn = "(?:\\ud83c[\\udde6-\\uddff]){2}", Ai = "[\\ud800-\\udbff][\\udc00-\\udfff]", ei = "[" + au + "]", cu = "\\u200d", Ca = "(?:" + lu + "|" + Cr + ")", Qr = "(?:" + ei + "|" + Cr + ")", fu = "(?:" + Zr + "(?:d|ll|m|re|s|t|ve))?", Qa = "(?:" + Zr + "(?:D|LL|M|RE|S|T|VE))?", Fa = In + "?", du = "[" + ou + "]?", tf = "(?:" + cu + "(?:" + [ya, Hn, Ai].join("|") + ")" + du + Fa + ")*", hu = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", nf = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", pu = du + Fa + tf, rf = "(?:" + [ef, Hn, Ai].join("|") + ")" + pu, af = "(?:" + [ya + ma + "?", ma, Hn, Ai, su].join("|") + ")", gu = RegExp(Zr, "g"), Bu = RegExp(ma, "g"), Ti = RegExp(va + "(?=" + va + ")|" + af + pu, "g"), wu = RegExp([
      ei + "?" + lu + "+" + fu + "(?=" + [uu, ei, "$"].join("|") + ")",
      Qr + "+" + Qa + "(?=" + [uu, ei + Ca, "$"].join("|") + ")",
      ei + "?" + Ca + "+" + fu,
      ei + "+" + Qa,
      nf,
      hu,
      Xt,
      rf
    ].join("|"), "g"), Eo = RegExp("[" + cu + Li + Qo + ou + "]"), ti = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, mu = [
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
    ], vu = -1, Me = {};
    Me[fn] = Me[mr] = Me[_i] = Me[qr] = Me[zr] = Me[lA] = Me[DA] = Me[WA] = Me[Ce] = !0, Me[R] = Me[nA] = Me[_t] = Me[UA] = Me[mt] = Me[qA] = Me[zA] = Me[SA] = Me[wA] = Me[bA] = Me[ge] = Me[ke] = Me[Be] = Me[Le] = Me[Et] = !1;
    var Pe = {};
    Pe[R] = Pe[nA] = Pe[_t] = Pe[mt] = Pe[UA] = Pe[qA] = Pe[fn] = Pe[mr] = Pe[_i] = Pe[qr] = Pe[zr] = Pe[wA] = Pe[bA] = Pe[ge] = Pe[ke] = Pe[Be] = Pe[Le] = Pe[ne] = Pe[lA] = Pe[DA] = Pe[WA] = Pe[Ce] = !0, Pe[zA] = Pe[SA] = Pe[Et] = !1;
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
    }, cf = parseFloat, yu = parseInt, Cu = typeof Ji == "object" && Ji && Ji.Object === Object && Ji, ff = typeof self == "object" && self && self.Object === Object && self, At = Cu || ff || Function("return this")(), _o = e && !e.nodeType && e, hn = _o && !0 && A && !A.nodeType && A, ni = hn && hn.exports === _o, Di = ni && Cu.process, Pt = function() {
      try {
        var j = hn && hn.require && hn.require("util").types;
        return j || Di && Di.binding && Di.binding("util");
      } catch {
      }
    }(), xo = Pt && Pt.isArrayBuffer, Ua = Pt && Pt.isDate, Io = Pt && Pt.isMap, Ho = Pt && Pt.isRegExp, Qu = Pt && Pt.isSet, Fu = Pt && Pt.isTypedArray;
    function s(j, oA, rA) {
      switch (rA.length) {
        case 0:
          return j.call(oA);
        case 1:
          return j.call(oA, rA[0]);
        case 2:
          return j.call(oA, rA[0], rA[1]);
        case 3:
          return j.call(oA, rA[0], rA[1], rA[2]);
      }
      return j.apply(oA, rA);
    }
    function h(j, oA, rA, OA) {
      for (var ae = -1, He = j == null ? 0 : j.length; ++ae < He; ) {
        var et = j[ae];
        oA(OA, et, rA(et), j);
      }
      return OA;
    }
    function m(j, oA) {
      for (var rA = -1, OA = j == null ? 0 : j.length; ++rA < OA && oA(j[rA], rA, j) !== !1; )
        ;
      return j;
    }
    function y(j, oA) {
      for (var rA = j == null ? 0 : j.length; rA-- && oA(j[rA], rA, j) !== !1; )
        ;
      return j;
    }
    function b(j, oA) {
      for (var rA = -1, OA = j == null ? 0 : j.length; ++rA < OA; )
        if (!oA(j[rA], rA, j))
          return !1;
      return !0;
    }
    function E(j, oA) {
      for (var rA = -1, OA = j == null ? 0 : j.length, ae = 0, He = []; ++rA < OA; ) {
        var et = j[rA];
        oA(et, rA, j) && (He[ae++] = et);
      }
      return He;
    }
    function I(j, oA) {
      var rA = j == null ? 0 : j.length;
      return !!rA && Je(j, oA, 0) > -1;
    }
    function P(j, oA, rA) {
      for (var OA = -1, ae = j == null ? 0 : j.length; ++OA < ae; )
        if (rA(oA, j[OA]))
          return !0;
      return !1;
    }
    function V(j, oA) {
      for (var rA = -1, OA = j == null ? 0 : j.length, ae = Array(OA); ++rA < OA; )
        ae[rA] = oA(j[rA], rA, j);
      return ae;
    }
    function X(j, oA) {
      for (var rA = -1, OA = oA.length, ae = j.length; ++rA < OA; )
        j[ae + rA] = oA[rA];
      return j;
    }
    function Z(j, oA, rA, OA) {
      var ae = -1, He = j == null ? 0 : j.length;
      for (OA && He && (rA = j[++ae]); ++ae < He; )
        rA = oA(rA, j[ae], ae, j);
      return rA;
    }
    function mA(j, oA, rA, OA) {
      var ae = j == null ? 0 : j.length;
      for (OA && ae && (rA = j[--ae]); ae--; )
        rA = oA(rA, j[ae], ae, j);
      return rA;
    }
    function HA(j, oA) {
      for (var rA = -1, OA = j == null ? 0 : j.length; ++rA < OA; )
        if (oA(j[rA], rA, j))
          return !0;
      return !1;
    }
    var vA = le("length");
    function ie(j) {
      return j.split("");
    }
    function YA(j) {
      return j.match(Au) || [];
    }
    function ue(j, oA, rA) {
      var OA;
      return rA(j, function(ae, He, et) {
        if (oA(ae, He, et))
          return OA = He, !1;
      }), OA;
    }
    function pt(j, oA, rA, OA) {
      for (var ae = j.length, He = rA + (OA ? 1 : -1); OA ? He-- : ++He < ae; )
        if (oA(j[He], He, j))
          return He;
      return -1;
    }
    function Je(j, oA, rA) {
      return oA === oA ? xa(j, oA, rA) : pt(j, KA, rA);
    }
    function Zn(j, oA, rA, OA) {
      for (var ae = rA - 1, He = j.length; ++ae < He; )
        if (OA(j[ae], oA))
          return ae;
      return -1;
    }
    function KA(j) {
      return j !== j;
    }
    function ct(j, oA) {
      var rA = j == null ? 0 : j.length;
      return rA ? Ht(j, oA) / rA : iA;
    }
    function le(j) {
      return function(oA) {
        return oA == null ? t : oA[j];
      };
    }
    function qe(j) {
      return function(oA) {
        return j == null ? t : j[oA];
      };
    }
    function Sn(j, oA, rA, OA, ae) {
      return ae(j, function(He, et, Ee) {
        rA = OA ? (OA = !1, He) : oA(rA, He, et, Ee);
      }), rA;
    }
    function ba(j, oA) {
      var rA = j.length;
      for (j.sort(oA); rA--; )
        j[rA] = j[rA].value;
      return j;
    }
    function Ht(j, oA) {
      for (var rA, OA = -1, ae = j.length; ++OA < ae; ) {
        var He = oA(j[OA]);
        He !== t && (rA = rA === t ? He : rA + He);
      }
      return rA;
    }
    function Ln(j, oA) {
      for (var rA = -1, OA = Array(j); ++rA < j; )
        OA[rA] = oA(rA);
      return OA;
    }
    function Ar(j, oA) {
      return V(oA, function(rA) {
        return [rA, j[rA]];
      });
    }
    function Tn(j) {
      return j && j.slice(0, _u(j) + 1).replace(ha, "");
    }
    function Ke(j) {
      return function(oA) {
        return j(oA);
      };
    }
    function St(j, oA) {
      return V(oA, function(rA) {
        return j[rA];
      });
    }
    function Oi(j, oA) {
      return j.has(oA);
    }
    function Dn(j, oA) {
      for (var rA = -1, OA = j.length; ++rA < OA && Je(oA, j[rA], 0) > -1; )
        ;
      return rA;
    }
    function So(j, oA) {
      for (var rA = j.length; rA-- && Je(oA, j[rA], 0) > -1; )
        ;
      return rA;
    }
    function Fr(j, oA) {
      for (var rA = j.length, OA = 0; rA--; )
        j[rA] === oA && ++OA;
      return OA;
    }
    var Lo = qe(of), De = qe(sf);
    function Ur(j) {
      return "\\" + lf[j];
    }
    function Uu(j, oA) {
      return j == null ? t : j[oA];
    }
    function er(j) {
      return Eo.test(j);
    }
    function df(j) {
      return ti.test(j);
    }
    function Ea(j) {
      for (var oA, rA = []; !(oA = j.next()).done; )
        rA.push(oA.value);
      return rA;
    }
    function To(j) {
      var oA = -1, rA = Array(j.size);
      return j.forEach(function(OA, ae) {
        rA[++oA] = [ae, OA];
      }), rA;
    }
    function bu(j, oA) {
      return function(rA) {
        return j(oA(rA));
      };
    }
    function tr(j, oA) {
      for (var rA = -1, OA = j.length, ae = 0, He = []; ++rA < OA; ) {
        var et = j[rA];
        (et === oA || et === w) && (j[rA] = w, He[ae++] = rA);
      }
      return He;
    }
    function _a(j) {
      var oA = -1, rA = Array(j.size);
      return j.forEach(function(OA) {
        rA[++oA] = OA;
      }), rA;
    }
    function Eu(j) {
      var oA = -1, rA = Array(j.size);
      return j.forEach(function(OA) {
        rA[++oA] = [OA, OA];
      }), rA;
    }
    function xa(j, oA, rA) {
      for (var OA = rA - 1, ae = j.length; ++OA < ae; )
        if (j[OA] === oA)
          return OA;
      return -1;
    }
    function hf(j, oA, rA) {
      for (var OA = rA + 1; OA--; )
        if (j[OA] === oA)
          return OA;
      return OA;
    }
    function ri(j) {
      return er(j) ? pf(j) : vA(j);
    }
    function vt(j) {
      return er(j) ? On(j) : ie(j);
    }
    function _u(j) {
      for (var oA = j.length; oA-- && Si.test(j.charAt(oA)); )
        ;
      return oA;
    }
    var Do = qe(uf);
    function pf(j) {
      for (var oA = Ti.lastIndex = 0; Ti.test(j); )
        ++oA;
      return oA;
    }
    function On(j) {
      return j.match(Ti) || [];
    }
    function Nn(j) {
      return j.match(wu) || [];
    }
    var xu = function j(oA) {
      oA = oA == null ? At : Ie.defaults(At.Object(), oA, Ie.pick(At, mu));
      var rA = oA.Array, OA = oA.Date, ae = oA.Error, He = oA.Function, et = oA.Math, Ee = oA.Object, Ni = oA.RegExp, Iu = oA.String, yt = oA.TypeError, ii = rA.prototype, Oo = He.prototype, ai = Ee.prototype, br = oA["__core-js_shared__"], oi = Oo.toString, Se = ai.hasOwnProperty, gf = 0, N = function() {
        var r = /[^.]+$/.exec(br && br.keys && br.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), $ = ai.toString, q = oi.call(Ee), uA = At._, tA = Ni(
        "^" + oi.call(Se).replace(mo, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), BA = ni ? oA.Buffer : t, dA = oA.Symbol, IA = oA.Uint8Array, $A = BA ? BA.allocUnsafe : t, re = bu(Ee.getPrototypeOf, Ee), GA = Ee.create, ZA = ai.propertyIsEnumerable, de = ii.splice, Te = dA ? dA.isConcatSpreadable : t, XA = dA ? dA.iterator : t, $e = dA ? dA.toStringTag : t, tt = function() {
        try {
          var r = $i(Ee, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), Kt = oA.clearTimeout !== At.clearTimeout && oA.clearTimeout, We = OA && OA.now !== At.Date.now && OA.now, Mi = oA.setTimeout !== At.setTimeout && oA.setTimeout, nr = et.ceil, gt = et.floor, Bf = Ee.getOwnPropertySymbols, aC = BA ? BA.isBuffer : t, rg = oA.isFinite, oC = ii.join, sC = bu(Ee.keys, Ee), ft = et.max, Lt = et.min, uC = OA.now, lC = oA.parseInt, ig = et.random, cC = ii.reverse, wf = $i(oA, "DataView"), No = $i(oA, "Map"), mf = $i(oA, "Promise"), Ia = $i(oA, "Set"), Mo = $i(oA, "WeakMap"), Po = $i(Ee, "create"), Hu = Mo && new Mo(), Ha = {}, fC = Gi(wf), dC = Gi(No), hC = Gi(mf), pC = Gi(Ia), gC = Gi(Mo), Su = dA ? dA.prototype : t, Ko = Su ? Su.valueOf : t, ag = Su ? Su.toString : t;
      function S(r) {
        if (Ze(r) && !ce(r) && !(r instanceof Ue)) {
          if (r instanceof pn)
            return r;
          if (Se.call(r, "__wrapped__"))
            return oB(r);
        }
        return new pn(r);
      }
      var Sa = /* @__PURE__ */ function() {
        function r() {
        }
        return function(a) {
          if (!Ye(a))
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
        evaluate: dn,
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
      }, S.prototype = Lu.prototype, S.prototype.constructor = S, pn.prototype = Sa(Lu.prototype), pn.prototype.constructor = pn;
      function Ue(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = T, this.__views__ = [];
      }
      function BC() {
        var r = new Ue(this.__wrapped__);
        return r.__actions__ = qt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = qt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = qt(this.__views__), r;
      }
      function wC() {
        if (this.__filtered__) {
          var r = new Ue(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function mC() {
        var r = this.__wrapped__.value(), a = this.__dir__, p = ce(r), Q = a < 0, x = p ? r.length : 0, D = HQ(0, x, this.__views__), k = D.start, G = D.end, Y = G - k, hA = Q ? G : k - 1, pA = this.__iteratees__, CA = pA.length, LA = 0, RA = Lt(Y, this.__takeCount__);
        if (!p || !Q && x == Y && RA == Y)
          return Ig(r, this.__actions__);
        var Ae = [];
        A:
          for (; Y-- && LA < RA; ) {
            hA += a;
            for (var we = -1, ee = r[hA]; ++we < CA; ) {
              var Fe = pA[we], _e = Fe.iteratee, on = Fe.type, $t = _e(ee);
              if (on == yA)
                ee = $t;
              else if (!$t) {
                if (on == W)
                  continue A;
                break A;
              }
            }
            Ae[LA++] = ee;
          }
        return Ae;
      }
      Ue.prototype = Sa(Lu.prototype), Ue.prototype.constructor = Ue;
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
        return Se.call(a, r) ? a[r] : t;
      }
      function QC(r) {
        var a = this.__data__;
        return Po ? a[r] !== t : Se.call(a, r);
      }
      function FC(r, a) {
        var p = this.__data__;
        return this.size += this.has(r) ? 0 : 1, p[r] = Po && a === t ? c : a, this;
      }
      Pi.prototype.clear = vC, Pi.prototype.delete = yC, Pi.prototype.get = CC, Pi.prototype.has = QC, Pi.prototype.set = FC;
      function Er(r) {
        var a = -1, p = r == null ? 0 : r.length;
        for (this.clear(); ++a < p; ) {
          var Q = r[a];
          this.set(Q[0], Q[1]);
        }
      }
      function UC() {
        this.__data__ = [], this.size = 0;
      }
      function bC(r) {
        var a = this.__data__, p = Tu(a, r);
        if (p < 0)
          return !1;
        var Q = a.length - 1;
        return p == Q ? a.pop() : de.call(a, p, 1), --this.size, !0;
      }
      function EC(r) {
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
      Er.prototype.clear = UC, Er.prototype.delete = bC, Er.prototype.get = EC, Er.prototype.has = _C, Er.prototype.set = xC;
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
          map: new (No || Er)(),
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
        var a = this.__data__ = new Er(r);
        this.size = a.size;
      }
      function NC() {
        this.__data__ = new Er(), this.size = 0;
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
        if (p instanceof Er) {
          var Q = p.__data__;
          if (!No || Q.length < i - 1)
            return Q.push([r, a]), this.size = ++p.size, this;
          p = this.__data__ = new _r(Q);
        }
        return p.set(r, a), this.size = p.size, this;
      }
      Mn.prototype.clear = NC, Mn.prototype.delete = MC, Mn.prototype.get = PC, Mn.prototype.has = KC, Mn.prototype.set = RC;
      function og(r, a) {
        var p = ce(r), Q = !p && Vi(r), x = !p && !Q && fi(r), D = !p && !Q && !x && Oa(r), k = p || Q || x || D, G = k ? Ln(r.length, Iu) : [], Y = G.length;
        for (var hA in r)
          (a || Se.call(r, hA)) && !(k && // Safari 9 has enumerable `arguments.length` in strict mode.
          (hA == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          x && (hA == "offset" || hA == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          D && (hA == "buffer" || hA == "byteLength" || hA == "byteOffset") || // Skip index properties.
          Sr(hA, Y))) && G.push(hA);
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
        (!(Se.call(r, a) && Pn(Q, p)) || p === t && !(a in r)) && xr(r, a, p);
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
        return r && ir(a, Bt(a), r);
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
          x[p] = D ? t : ed(r, a[p]);
        return x;
      }
      function Ri(r, a, p) {
        return r === r && (p !== t && (r = r <= p ? r : p), a !== t && (r = r >= a ? r : a)), r;
      }
      function gn(r, a, p, Q, x, D) {
        var k, G = a & B, Y = a & g, hA = a & v;
        if (p && (k = x ? p(r, Q, x, D) : p(r)), k !== t)
          return k;
        if (!Ye(r))
          return r;
        var pA = ce(r);
        if (pA) {
          if (k = LQ(r), !G)
            return qt(r, k);
        } else {
          var CA = Tt(r), LA = CA == SA || CA == aA;
          if (fi(r))
            return Lg(r, G);
          if (CA == ge || CA == R || LA && !x) {
            if (k = Y || LA ? {} : Yg(r), !G)
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
        D.set(r, k), EB(r) ? r.forEach(function(ee) {
          k.add(gn(ee, a, p, ee, r, D));
        }) : UB(r) && r.forEach(function(ee, Fe) {
          k.set(Fe, gn(ee, a, p, Fe, r, D));
        });
        var Ae = hA ? Y ? Rf : Kf : Y ? Jt : Bt, we = pA ? t : Ae(r);
        return m(we || r, function(ee, Fe) {
          we && (Fe = ee, ee = r[Fe]), Ro(k, Fe, gn(ee, a, p, Fe, r, D));
        }), k;
      }
      function WC(r) {
        var a = Bt(r);
        return function(p) {
          return lg(p, r, a);
        };
      }
      function lg(r, a, p) {
        var Q = p.length;
        if (r == null)
          return !Q;
        for (r = Ee(r); Q--; ) {
          var x = p[Q], D = a[x], k = r[x];
          if (k === t && !(x in r) || !D(k))
            return !1;
        }
        return !0;
      }
      function cg(r, a, p) {
        if (typeof r != "function")
          throw new yt(l);
        return qo(function() {
          r.apply(t, p);
        }, a);
      }
      function ko(r, a, p, Q) {
        var x = -1, D = I, k = !0, G = r.length, Y = [], hA = a.length;
        if (!G)
          return Y;
        p && (a = V(a, Ke(p))), Q ? (D = P, k = !1) : a.length >= i && (D = Oi, k = !1, a = new Ki(a));
        A:
          for (; ++x < G; ) {
            var pA = r[x], CA = p == null ? pA : p(pA);
            if (pA = Q || pA !== 0 ? pA : 0, k && CA === CA) {
              for (var LA = hA; LA--; )
                if (a[LA] === CA)
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
        for (p = he(p), p < 0 && (p = -p > x ? 0 : x + p), Q = Q === t || Q > x ? x : he(Q), Q < 0 && (Q += x), Q = p > Q ? 0 : xB(Q); p < Q; )
          r[p++] = a;
        return r;
      }
      function dg(r, a) {
        var p = [];
        return si(r, function(Q, x, D) {
          a(Q, x, D) && p.push(Q);
        }), p;
      }
      function Ct(r, a, p, Q, x) {
        var D = -1, k = r.length;
        for (p || (p = OQ), x || (x = []); ++D < k; ) {
          var G = r[D];
          a > 0 && p(G) ? a > 1 ? Ct(G, a - 1, p, Q, x) : X(x, G) : Q || (x[x.length] = G);
        }
        return x;
      }
      var Cf = Pg(), hg = Pg(!0);
      function rr(r, a) {
        return r && Cf(r, a, Bt);
      }
      function Qf(r, a) {
        return r && hg(r, a, Bt);
      }
      function Ou(r, a) {
        return E(a, function(p) {
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
        return ce(r) ? Q : X(Q, p(r));
      }
      function Rt(r) {
        return r == null ? r === t ? Ve : jA : $e && $e in Ee(r) ? IQ(r) : $Q(r);
      }
      function Ff(r, a) {
        return r > a;
      }
      function zC(r, a) {
        return r != null && Se.call(r, a);
      }
      function JC(r, a) {
        return r != null && a in Ee(r);
      }
      function jC(r, a, p) {
        return r >= Lt(a, p) && r < ft(a, p);
      }
      function Uf(r, a, p) {
        for (var Q = p ? P : I, x = r[0].length, D = r.length, k = D, G = rA(D), Y = 1 / 0, hA = []; k--; ) {
          var pA = r[k];
          k && a && (pA = V(pA, Ke(a))), Y = Lt(pA.length, Y), G[k] = !p && (a || x >= 120 && pA.length >= 120) ? new Ki(k && pA) : t;
        }
        pA = r[0];
        var CA = -1, LA = G[0];
        A:
          for (; ++CA < x && hA.length < Y; ) {
            var RA = pA[CA], Ae = a ? a(RA) : RA;
            if (RA = p || RA !== 0 ? RA : 0, !(LA ? Oi(LA, Ae) : Q(hA, Ae, p))) {
              for (k = D; --k; ) {
                var we = G[k];
                if (!(we ? Oi(we, Ae) : Q(r[k], Ae, p)))
                  continue A;
              }
              LA && LA.push(Ae), hA.push(RA);
            }
          }
        return hA;
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
        return Ze(r) && Rt(r) == _t;
      }
      function AQ(r) {
        return Ze(r) && Rt(r) == qA;
      }
      function Go(r, a, p, Q, x) {
        return r === a ? !0 : r == null || a == null || !Ze(r) && !Ze(a) ? r !== r && a !== a : eQ(r, a, p, Q, Go, x);
      }
      function eQ(r, a, p, Q, x, D) {
        var k = ce(r), G = ce(a), Y = k ? nA : Tt(r), hA = G ? nA : Tt(a);
        Y = Y == R ? ge : Y, hA = hA == R ? ge : hA;
        var pA = Y == ge, CA = hA == ge, LA = Y == hA;
        if (LA && fi(r)) {
          if (!fi(a))
            return !1;
          k = !0, pA = !1;
        }
        if (LA && !pA)
          return D || (D = new Mn()), k || Oa(r) ? zg(r, a, p, Q, x, D) : _Q(r, a, Y, p, Q, x, D);
        if (!(p & u)) {
          var RA = pA && Se.call(r, "__wrapped__"), Ae = CA && Se.call(a, "__wrapped__");
          if (RA || Ae) {
            var we = RA ? r.value() : r, ee = Ae ? a.value() : a;
            return D || (D = new Mn()), x(we, ee, p, Q, D);
          }
        }
        return LA ? (D || (D = new Mn()), xQ(r, a, p, Q, x, D)) : !1;
      }
      function tQ(r) {
        return Ze(r) && Tt(r) == wA;
      }
      function bf(r, a, p, Q) {
        var x = p.length, D = x, k = !Q;
        if (r == null)
          return !D;
        for (r = Ee(r); x--; ) {
          var G = p[x];
          if (k && G[2] ? G[1] !== r[G[0]] : !(G[0] in r))
            return !1;
        }
        for (; ++x < D; ) {
          G = p[x];
          var Y = G[0], hA = r[Y], pA = G[1];
          if (k && G[2]) {
            if (hA === t && !(Y in r))
              return !1;
          } else {
            var CA = new Mn();
            if (Q)
              var LA = Q(hA, pA, Y, r, a, CA);
            if (!(LA === t ? Go(pA, hA, u | C, Q, CA) : LA))
              return !1;
          }
        }
        return !0;
      }
      function Bg(r) {
        if (!Ye(r) || MQ(r))
          return !1;
        var a = Lr(r) ? tA : yo;
        return a.test(Gi(r));
      }
      function nQ(r) {
        return Ze(r) && Rt(r) == ke;
      }
      function rQ(r) {
        return Ze(r) && Tt(r) == Be;
      }
      function iQ(r) {
        return Ze(r) && Zu(r.length) && !!Me[Rt(r)];
      }
      function wg(r) {
        return typeof r == "function" ? r : r == null ? jt : typeof r == "object" ? ce(r) ? yg(r[0], r[1]) : vg(r) : KB(r);
      }
      function Ef(r) {
        if (!Xo(r))
          return sC(r);
        var a = [];
        for (var p in Ee(r))
          Se.call(r, p) && p != "constructor" && a.push(p);
        return a;
      }
      function aQ(r) {
        if (!Ye(r))
          return kQ(r);
        var a = Xo(r), p = [];
        for (var Q in r)
          Q == "constructor" && (a || !Se.call(r, Q)) || p.push(Q);
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
          return p === r || bf(p, r, a);
        };
      }
      function yg(r, a) {
        return Vf(r) && Zg(a) ? AB(ar(r), a) : function(p) {
          var Q = ed(p, r);
          return Q === t && Q === a ? td(p, r) : Go(a, Q, u | C);
        };
      }
      function Nu(r, a, p, Q, x) {
        r !== a && Cf(a, function(D, k) {
          if (x || (x = new Mn()), Ye(D))
            oQ(r, a, k, p, Nu, Q, x);
          else {
            var G = Q ? Q(Xf(r, k), D, k + "", r, a, x) : t;
            G === t && (G = D), vf(r, k, G);
          }
        }, Jt);
      }
      function oQ(r, a, p, Q, x, D, k) {
        var G = Xf(r, p), Y = Xf(a, p), hA = k.get(Y);
        if (hA) {
          vf(r, p, hA);
          return;
        }
        var pA = D ? D(G, Y, p + "", r, a, k) : t, CA = pA === t;
        if (CA) {
          var LA = ce(Y), RA = !LA && fi(Y), Ae = !LA && !RA && Oa(Y);
          pA = Y, LA || RA || Ae ? ce(G) ? pA = G : nt(G) ? pA = qt(G) : RA ? (CA = !1, pA = Lg(Y, !0)) : Ae ? (CA = !1, pA = Tg(Y, !0)) : pA = [] : zo(Y) || Vi(Y) ? (pA = G, Vi(G) ? pA = IB(G) : (!Ye(G) || Lr(G)) && (pA = Yg(Y))) : CA = !1;
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
          return ce(D) ? function(k) {
            return ki(k, D.length === 1 ? D[0] : D);
          } : D;
        }) : a = [jt];
        var Q = -1;
        a = V(a, Ke(JA()));
        var x = mg(r, function(D, k, G) {
          var Y = V(a, function(hA) {
            return hA(D);
          });
          return { criteria: Y, index: ++Q, value: D };
        });
        return ba(x, function(D, k) {
          return vQ(D, k, p);
        });
      }
      function sQ(r, a) {
        return Fg(r, a, function(p, Q) {
          return td(r, Q);
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
        var x = Q ? Zn : Je, D = -1, k = a.length, G = r;
        for (r === a && (a = qt(a)), p && (G = V(r, Ke(p))); ++D < k; )
          for (var Y = 0, hA = a[D], pA = p ? p(hA) : hA; (Y = x(G, pA, Y, Q)) > -1; )
            G !== r && de.call(G, Y, 1), de.call(r, Y, 1);
        return r;
      }
      function Ug(r, a) {
        for (var p = r ? a.length : 0, Q = p - 1; p--; ) {
          var x = a[p];
          if (p == Q || x !== D) {
            var D = x;
            Sr(x) ? de.call(r, x, 1) : Lf(r, x);
          }
        }
        return r;
      }
      function If(r, a) {
        return r + gt(ig() * (a - r + 1));
      }
      function lQ(r, a, p, Q) {
        for (var x = -1, D = ft(nr((a - r) / (p || 1)), 0), k = rA(D); D--; )
          k[Q ? D : ++x] = r, r += p;
        return k;
      }
      function Hf(r, a) {
        var p = "";
        if (!r || a < 1 || a > EA)
          return p;
        do
          a % 2 && (p += r), a = gt(a / 2), a && (r += r);
        while (a);
        return p;
      }
      function me(r, a) {
        return qf(eB(r, a, jt), r + "");
      }
      function cQ(r) {
        return sg(Na(r));
      }
      function fQ(r, a) {
        var p = Na(r);
        return Xu(p, Ri(a, 0, p.length));
      }
      function Vo(r, a, p, Q) {
        if (!Ye(r))
          return r;
        a = li(a, r);
        for (var x = -1, D = a.length, k = D - 1, G = r; G != null && ++x < D; ) {
          var Y = ar(a[x]), hA = p;
          if (Y === "__proto__" || Y === "constructor" || Y === "prototype")
            return r;
          if (x != k) {
            var pA = G[Y];
            hA = Q ? Q(pA, Y, G) : t, hA === t && (hA = Ye(pA) ? pA : Sr(a[x + 1]) ? [] : {});
          }
          Ro(G, Y, hA), G = G[Y];
        }
        return r;
      }
      var bg = Hu ? function(r, a) {
        return Hu.set(r, a), r;
      } : jt, dQ = tt ? function(r, a) {
        return tt(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: rd(a),
          writable: !0
        });
      } : jt;
      function hQ(r) {
        return Xu(Na(r));
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
        for (var k = a !== a, G = a === null, Y = an(a), hA = a === t; x < D; ) {
          var pA = gt((x + D) / 2), CA = p(r[pA]), LA = CA !== t, RA = CA === null, Ae = CA === CA, we = an(CA);
          if (k)
            var ee = Q || Ae;
          else hA ? ee = Ae && (Q || LA) : G ? ee = Ae && LA && (Q || !RA) : Y ? ee = Ae && LA && !RA && (Q || !we) : RA || we ? ee = !1 : ee = Q ? CA <= a : CA < a;
          ee ? x = pA + 1 : D = pA;
        }
        return Lt(D, AA);
      }
      function Eg(r, a) {
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
        if (ce(r))
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
          var hA = a ? null : bQ(r);
          if (hA)
            return _a(hA);
          k = !1, x = Oi, Y = new Ki();
        } else
          Y = a ? [] : G;
        A:
          for (; ++Q < D; ) {
            var pA = r[Q], CA = a ? a(pA) : pA;
            if (pA = p || pA !== 0 ? pA : 0, k && CA === CA) {
              for (var LA = Y.length; LA--; )
                if (Y[LA] === CA)
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
        return p instanceof Ue && (p = p.value()), Z(a, function(Q, x) {
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
        return ui(Ct(D, 1), a, p);
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
        return ce(r) ? r : Vf(r, a) ? [r] : aB(Oe(r));
      }
      var gQ = me;
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
        return Ko ? Ee(Ko.call(r)) : {};
      }
      function Tg(r, a) {
        var p = a ? Nf(r.buffer) : r.buffer;
        return new r.constructor(p, r.byteOffset, r.length);
      }
      function Dg(r, a) {
        if (r !== a) {
          var p = r !== t, Q = r === null, x = r === r, D = an(r), k = a !== t, G = a === null, Y = a === a, hA = an(a);
          if (!G && !hA && !D && r > a || D && k && Y && !G && !hA || Q && k && Y || !p && Y || !x)
            return 1;
          if (!Q && !D && !hA && r < a || hA && p && x && !Q && !D || G && p && x || !k && x || !Y)
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
            var hA = p[Q];
            return Y * (hA == "desc" ? -1 : 1);
          }
        }
        return r.index - a.index;
      }
      function Og(r, a, p, Q) {
        for (var x = -1, D = r.length, k = p.length, G = -1, Y = a.length, hA = ft(D - k, 0), pA = rA(Y + hA), CA = !Q; ++G < Y; )
          pA[G] = a[G];
        for (; ++x < k; )
          (CA || x < D) && (pA[p[x]] = r[x]);
        for (; hA--; )
          pA[G++] = r[x++];
        return pA;
      }
      function Ng(r, a, p, Q) {
        for (var x = -1, D = r.length, k = -1, G = p.length, Y = -1, hA = a.length, pA = ft(D - G, 0), CA = rA(pA + hA), LA = !Q; ++x < pA; )
          CA[x] = r[x];
        for (var RA = x; ++Y < hA; )
          CA[RA + Y] = a[Y];
        for (; ++k < G; )
          (LA || x < D) && (CA[RA + p[k]] = r[x++]);
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
          var x = ce(p) ? h : GC, D = a ? a() : {};
          return x(p, r, JA(Q, 2), D);
        };
      }
      function La(r) {
        return me(function(a, p) {
          var Q = -1, x = p.length, D = x > 1 ? p[x - 1] : t, k = x > 2 ? p[2] : t;
          for (D = r.length > 3 && typeof D == "function" ? (x--, D) : t, k && kt(p[0], p[1], k) && (D = x < 3 ? t : D, x = 1), a = Ee(a); ++Q < x; ) {
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
          for (var x = p.length, D = a ? x : -1, k = Ee(p); (a ? D-- : ++D < x) && Q(k[D], D, k) !== !1; )
            ;
          return p;
        };
      }
      function Pg(r) {
        return function(a, p, Q) {
          for (var x = -1, D = Ee(a), k = Q(a), G = k.length; G--; ) {
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
          a = Oe(a);
          var p = er(a) ? vt(a) : t, Q = p ? p[0] : a.charAt(0), x = p ? ci(p, 1).join("") : a.slice(1);
          return Q[r]() + x;
        };
      }
      function Ta(r) {
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
          var p = Sa(r.prototype), Q = r.apply(p, a);
          return Ye(Q) ? Q : p;
        };
      }
      function FQ(r, a, p) {
        var Q = Wo(r);
        function x() {
          for (var D = arguments.length, k = rA(D), G = D, Y = Da(x); G--; )
            k[G] = arguments[G];
          var hA = D < 3 && k[0] !== Y && k[D - 1] !== Y ? [] : tr(k, Y);
          if (D -= hA.length, D < p)
            return Vg(
              r,
              a,
              Ru,
              x.placeholder,
              t,
              k,
              hA,
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
          var x = Ee(a);
          if (!zt(a)) {
            var D = JA(p, 3);
            a = Bt(a), p = function(G) {
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
              throw new yt(l);
            if (x && !k && Vu(D) == "wrapper")
              var k = new pn([], !0);
          }
          for (Q = k ? Q : p; ++Q < p; ) {
            D = a[Q];
            var G = Vu(D), Y = G == "wrapper" ? kf(D) : t;
            Y && Wf(Y[0]) && Y[1] == (z | O | M | cA) && !Y[4].length && Y[9] == 1 ? k = k[Vu(Y[0])].apply(k, Y[3]) : k = D.length == 1 && Wf(D) ? k[G]() : k.thru(D);
          }
          return function() {
            var hA = arguments, pA = hA[0];
            if (k && hA.length == 1 && ce(pA))
              return k.plant(pA).value();
            for (var CA = 0, LA = p ? a[CA].apply(this, hA) : pA; ++CA < p; )
              LA = a[CA].call(this, LA);
            return LA;
          };
        });
      }
      function Ru(r, a, p, Q, x, D, k, G, Y, hA) {
        var pA = a & z, CA = a & F, LA = a & U, RA = a & (O | _), Ae = a & sA, we = LA ? t : Wo(r);
        function ee() {
          for (var Fe = arguments.length, _e = rA(Fe), on = Fe; on--; )
            _e[on] = arguments[on];
          if (RA)
            var $t = Da(ee), sn = Fr(_e, $t);
          if (Q && (_e = Og(_e, Q, x, RA)), D && (_e = Ng(_e, D, k, RA)), Fe -= sn, RA && Fe < hA) {
            var rt = tr(_e, $t);
            return Vg(
              r,
              a,
              Ru,
              ee.placeholder,
              p,
              _e,
              rt,
              G,
              Y,
              hA - Fe
            );
          }
          var Kn = CA ? p : this, Dr = LA ? Kn[r] : r;
          return Fe = _e.length, G ? _e = GQ(_e, G) : Ae && Fe > 1 && _e.reverse(), pA && Y < Fe && (_e.length = Y), this && this !== At && this instanceof ee && (Dr = we || Wo(Dr)), Dr.apply(Kn, _e);
        }
        return ee;
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
          return a = V(a, Ke(JA())), me(function(p) {
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
        return er(a) ? ci(vt(Q), 0, r).join("") : Q.slice(0, r);
      }
      function UQ(r, a, p, Q) {
        var x = a & F, D = Wo(r);
        function k() {
          for (var G = -1, Y = arguments.length, hA = -1, pA = Q.length, CA = rA(pA + Y), LA = this && this !== At && this instanceof k ? D : r; ++hA < pA; )
            CA[hA] = Q[hA];
          for (; Y--; )
            CA[hA++] = arguments[++G];
          return s(LA, x ? p : this, CA);
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
      function Vg(r, a, p, Q, x, D, k, G, Y, hA) {
        var pA = a & O, CA = pA ? k : t, LA = pA ? t : k, RA = pA ? D : t, Ae = pA ? t : D;
        a |= pA ? M : K, a &= ~(pA ? K : M), a & H || (a &= ~(F | U));
        var we = [
          r,
          a,
          x,
          RA,
          CA,
          Ae,
          LA,
          G,
          Y,
          hA
        ], ee = p.apply(t, we);
        return Wf(r) && nB(ee, we), ee.placeholder = Q, rB(ee, r, a);
      }
      function Pf(r) {
        var a = et[r];
        return function(p, Q) {
          if (p = mn(p), Q = Q == null ? 0 : Lt(he(Q), 292), Q && rg(p)) {
            var x = (Oe(p) + "e").split("e"), D = a(x[0] + "e" + (+x[1] + Q));
            return x = (Oe(D) + "e").split("e"), +(x[0] + "e" + (+x[1] - Q));
          }
          return a(p);
        };
      }
      var bQ = Ia && 1 / _a(new Ia([, -0]))[1] == fA ? function(r) {
        return new Ia(r);
      } : od;
      function Wg(r) {
        return function(a) {
          var p = Tt(a);
          return p == wA ? To(a) : p == Be ? Eu(a) : Ar(a, r(a));
        };
      }
      function Ir(r, a, p, Q, x, D, k, G) {
        var Y = a & U;
        if (!Y && typeof r != "function")
          throw new yt(l);
        var hA = Q ? Q.length : 0;
        if (hA || (a &= ~(M | K), Q = x = t), k = k === t ? k : ft(he(k), 0), G = G === t ? G : he(G), hA -= x ? x.length : 0, a & K) {
          var pA = Q, CA = x;
          Q = x = t;
        }
        var LA = Y ? t : kf(r), RA = [
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
        if (LA && RQ(RA, LA), r = RA[0], a = RA[1], p = RA[2], Q = RA[3], x = RA[4], G = RA[9] = RA[9] === t ? Y ? 0 : r.length : ft(RA[9] - hA, 0), !G && a & (O | _) && (a &= ~(O | _)), !a || a == F)
          var Ae = QQ(r, a, p);
        else a == O || a == _ ? Ae = FQ(r, a, G) : (a == M || a == (F | M)) && !x.length ? Ae = UQ(r, a, p, Q) : Ae = Ru.apply(t, RA);
        var we = LA ? bg : nB;
        return rB(we(Ae, RA), r, a);
      }
      function Xg(r, a, p, Q) {
        return r === t || Pn(r, ai[p]) && !Se.call(Q, p) ? a : r;
      }
      function qg(r, a, p, Q, x, D) {
        return Ye(r) && Ye(a) && (D.set(a, r), Nu(r, a, t, qg, D), D.delete(a)), r;
      }
      function EQ(r) {
        return zo(r) ? t : r;
      }
      function zg(r, a, p, Q, x, D) {
        var k = p & u, G = r.length, Y = a.length;
        if (G != Y && !(k && Y > G))
          return !1;
        var hA = D.get(r), pA = D.get(a);
        if (hA && pA)
          return hA == a && pA == r;
        var CA = -1, LA = !0, RA = p & C ? new Ki() : t;
        for (D.set(r, a), D.set(a, r); ++CA < G; ) {
          var Ae = r[CA], we = a[CA];
          if (Q)
            var ee = k ? Q(we, Ae, CA, a, r, D) : Q(Ae, we, CA, r, a, D);
          if (ee !== t) {
            if (ee)
              continue;
            LA = !1;
            break;
          }
          if (RA) {
            if (!HA(a, function(Fe, _e) {
              if (!Oi(RA, _e) && (Ae === Fe || x(Ae, Fe, p, Q, D)))
                return RA.push(_e);
            })) {
              LA = !1;
              break;
            }
          } else if (!(Ae === we || x(Ae, we, p, Q, D))) {
            LA = !1;
            break;
          }
        }
        return D.delete(r), D.delete(a), LA;
      }
      function _Q(r, a, p, Q, x, D, k) {
        switch (p) {
          case mt:
            if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
              return !1;
            r = r.buffer, a = a.buffer;
          case _t:
            return !(r.byteLength != a.byteLength || !D(new IA(r), new IA(a)));
          case UA:
          case qA:
          case bA:
            return Pn(+r, +a);
          case zA:
            return r.name == a.name && r.message == a.message;
          case ke:
          case Le:
            return r == a + "";
          case wA:
            var G = To;
          case Be:
            var Y = Q & u;
            if (G || (G = _a), r.size != a.size && !Y)
              return !1;
            var hA = k.get(r);
            if (hA)
              return hA == a;
            Q |= C, k.set(r, a);
            var pA = zg(G(r), G(a), Q, x, D, k);
            return k.delete(r), pA;
          case ne:
            if (Ko)
              return Ko.call(r) == Ko.call(a);
        }
        return !1;
      }
      function xQ(r, a, p, Q, x, D) {
        var k = p & u, G = Kf(r), Y = G.length, hA = Kf(a), pA = hA.length;
        if (Y != pA && !k)
          return !1;
        for (var CA = Y; CA--; ) {
          var LA = G[CA];
          if (!(k ? LA in a : Se.call(a, LA)))
            return !1;
        }
        var RA = D.get(r), Ae = D.get(a);
        if (RA && Ae)
          return RA == a && Ae == r;
        var we = !0;
        D.set(r, a), D.set(a, r);
        for (var ee = k; ++CA < Y; ) {
          LA = G[CA];
          var Fe = r[LA], _e = a[LA];
          if (Q)
            var on = k ? Q(_e, Fe, LA, a, r, D) : Q(Fe, _e, LA, r, a, D);
          if (!(on === t ? Fe === _e || x(Fe, _e, p, Q, D) : on)) {
            we = !1;
            break;
          }
          ee || (ee = LA == "constructor");
        }
        if (we && !ee) {
          var $t = r.constructor, sn = a.constructor;
          $t != sn && "constructor" in r && "constructor" in a && !(typeof $t == "function" && $t instanceof $t && typeof sn == "function" && sn instanceof sn) && (we = !1);
        }
        return D.delete(r), D.delete(a), we;
      }
      function Hr(r) {
        return qf(eB(r, t, lB), r + "");
      }
      function Kf(r) {
        return pg(r, Bt, Gf);
      }
      function Rf(r) {
        return pg(r, Jt, Jg);
      }
      var kf = Hu ? function(r) {
        return Hu.get(r);
      } : od;
      function Vu(r) {
        for (var a = r.name + "", p = Ha[a], Q = Se.call(Ha, a) ? p.length : 0; Q--; ) {
          var x = p[Q], D = x.func;
          if (D == null || D == r)
            return x.name;
        }
        return a;
      }
      function Da(r) {
        var a = Se.call(S, "placeholder") ? S : r;
        return a.placeholder;
      }
      function JA() {
        var r = S.iteratee || id;
        return r = r === id ? wg : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Wu(r, a) {
        var p = r.__data__;
        return NQ(a) ? p[typeof a == "string" ? "string" : "hash"] : p.map;
      }
      function $f(r) {
        for (var a = Bt(r), p = a.length; p--; ) {
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
        var a = Se.call(r, $e), p = r[$e];
        try {
          r[$e] = t;
          var Q = !0;
        } catch {
        }
        var x = $.call(r);
        return Q && (a ? r[$e] = p : delete r[$e]), x;
      }
      var Gf = Bf ? function(r) {
        return r == null ? [] : (r = Ee(r), E(Bf(r), function(a) {
          return ZA.call(r, a);
        }));
      } : sd, Jg = Bf ? function(r) {
        for (var a = []; r; )
          X(a, Gf(r)), r = re(r);
        return a;
      } : sd, Tt = Rt;
      (wf && Tt(new wf(new ArrayBuffer(1))) != mt || No && Tt(new No()) != wA || mf && Tt(mf.resolve()) != fe || Ia && Tt(new Ia()) != Be || Mo && Tt(new Mo()) != Et) && (Tt = function(r) {
        var a = Rt(r), p = a == ge ? r.constructor : t, Q = p ? Gi(p) : "";
        if (Q)
          switch (Q) {
            case fC:
              return mt;
            case dC:
              return wA;
            case hC:
              return fe;
            case pC:
              return Be;
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
              a = Lt(a, r + k);
              break;
            case "takeRight":
              r = ft(r, a - k);
              break;
          }
        }
        return { start: r, end: a };
      }
      function SQ(r) {
        var a = r.match(Zs);
        return a ? a[1].split(pa) : [];
      }
      function jg(r, a, p) {
        a = li(a, r);
        for (var Q = -1, x = a.length, D = !1; ++Q < x; ) {
          var k = ar(a[Q]);
          if (!(D = r != null && p(r, k)))
            break;
          r = r[k];
        }
        return D || ++Q != x ? D : (x = r == null ? 0 : r.length, !!x && Zu(x) && Sr(k, x) && (ce(r) || Vi(r)));
      }
      function LQ(r) {
        var a = r.length, p = new r.constructor(a);
        return a && typeof r[0] == "string" && Se.call(r, "index") && (p.index = r.index, p.input = r.input), p;
      }
      function Yg(r) {
        return typeof r.constructor == "function" && !Xo(r) ? Sa(re(r)) : {};
      }
      function TQ(r, a, p) {
        var Q = r.constructor;
        switch (a) {
          case _t:
            return Nf(r);
          case UA:
          case qA:
            return new Q(+r);
          case mt:
            return BQ(r, p);
          case fn:
          case mr:
          case _i:
          case qr:
          case zr:
          case lA:
          case DA:
          case WA:
          case Ce:
            return Tg(r, p);
          case wA:
            return new Q();
          case bA:
          case Le:
            return new Q(r);
          case ke:
            return wQ(r);
          case Be:
            return new Q();
          case ne:
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
        return ce(r) || Vi(r) || !!(Te && r && r[Te]);
      }
      function Sr(r, a) {
        var p = typeof r;
        return a = a ?? EA, !!a && (p == "number" || p != "symbol" && Yc.test(r)) && r > -1 && r % 1 == 0 && r < a;
      }
      function kt(r, a, p) {
        if (!Ye(p))
          return !1;
        var Q = typeof a;
        return (Q == "number" ? zt(p) && Sr(a, p.length) : Q == "string" && a in p) ? Pn(p[a], r) : !1;
      }
      function Vf(r, a) {
        if (ce(r))
          return !1;
        var p = typeof r;
        return p == "number" || p == "symbol" || p == "boolean" || r == null || an(r) ? !0 : vr.test(r) || !jr.test(r) || a != null && r in Ee(a);
      }
      function NQ(r) {
        var a = typeof r;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
      }
      function Wf(r) {
        var a = Vu(r), p = S[a];
        if (typeof p != "function" || !(a in Ue.prototype))
          return !1;
        if (r === p)
          return !0;
        var Q = kf(p);
        return !!Q && r === Q[0];
      }
      function MQ(r) {
        return !!N && N in r;
      }
      var PQ = br ? Lr : ud;
      function Xo(r) {
        var a = r && r.constructor, p = typeof a == "function" && a.prototype || ai;
        return r === p;
      }
      function Zg(r) {
        return r === r && !Ye(r);
      }
      function AB(r, a) {
        return function(p) {
          return p == null ? !1 : p[r] === a && (a !== t || r in Ee(p));
        };
      }
      function KQ(r) {
        var a = ju(r, function(Q) {
          return p.size === d && p.clear(), Q;
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
          r[3] = Y ? Og(Y, G, a[4]) : G, r[4] = Y ? tr(r[3], w) : a[4];
        }
        return G = a[5], G && (Y = r[5], r[5] = Y ? Ng(Y, G, a[6]) : G, r[6] = Y ? tr(r[5], w) : a[6]), G = a[7], G && (r[7] = G), Q & z && (r[8] = r[8] == null ? a[8] : Lt(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = x, r;
      }
      function kQ(r) {
        var a = [];
        if (r != null)
          for (var p in Ee(r))
            a.push(p);
        return a;
      }
      function $Q(r) {
        return $.call(r);
      }
      function eB(r, a, p) {
        return a = ft(a === t ? r.length - 1 : a, 0), function() {
          for (var Q = arguments, x = -1, D = ft(Q.length - a, 0), k = rA(D); ++x < D; )
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
        for (var p = r.length, Q = Lt(a.length, p), x = qt(r); Q--; ) {
          var D = a[Q];
          r[Q] = Sr(D, p) ? x[D] : t;
        }
        return r;
      }
      function Xf(r, a) {
        if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
          return r[a];
      }
      var nB = iB(bg), qo = Mi || function(r, a) {
        return At.setTimeout(r, a);
      }, qf = iB(dQ);
      function rB(r, a, p) {
        var Q = a + "";
        return qf(r, DQ(Q, VQ(SQ(Q), p)));
      }
      function iB(r) {
        var a = 0, p = 0;
        return function() {
          var Q = uC(), x = _A - (Q - p);
          if (p = Q, x > 0) {
            if (++a >= NA)
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
        return m(L, function(p) {
          var Q = "_." + p[0];
          a & p[1] && !I(r, Q) && r.push(Q);
        }), r.sort();
      }
      function oB(r) {
        if (r instanceof Ue)
          return r.clone();
        var a = new pn(r.__wrapped__, r.__chain__);
        return a.__actions__ = qt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
      }
      function WQ(r, a, p) {
        (p ? kt(r, a, p) : a === t) ? a = 1 : a = ft(he(a), 0);
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
        return X(ce(p) ? qt(p) : [p], Ct(a, 1));
      }
      var zQ = me(function(r, a) {
        return nt(r) ? ko(r, Ct(a, 1, nt, !0)) : [];
      }), JQ = me(function(r, a) {
        var p = wn(a);
        return nt(p) && (p = t), nt(r) ? ko(r, Ct(a, 1, nt, !0), JA(p, 2)) : [];
      }), jQ = me(function(r, a) {
        var p = wn(a);
        return nt(p) && (p = t), nt(r) ? ko(r, Ct(a, 1, nt, !0), t, p) : [];
      });
      function YQ(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : he(a), Bn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function ZQ(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : he(a), a = Q - a, Bn(r, 0, a < 0 ? 0 : a)) : [];
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
        var x = p == null ? 0 : he(p);
        return x < 0 && (x = ft(Q + x, 0)), pt(r, JA(a, 3), x);
      }
      function uB(r, a, p) {
        var Q = r == null ? 0 : r.length;
        if (!Q)
          return -1;
        var x = Q - 1;
        return p !== t && (x = he(p), x = p < 0 ? ft(Q + x, 0) : Lt(x, Q - 1)), pt(r, JA(a, 3), x, !0);
      }
      function lB(r) {
        var a = r == null ? 0 : r.length;
        return a ? Ct(r, 1) : [];
      }
      function nF(r) {
        var a = r == null ? 0 : r.length;
        return a ? Ct(r, fA) : [];
      }
      function rF(r, a) {
        var p = r == null ? 0 : r.length;
        return p ? (a = a === t ? 1 : he(a), Ct(r, a)) : [];
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
        var x = p == null ? 0 : he(p);
        return x < 0 && (x = ft(Q + x, 0)), Je(r, a, x);
      }
      function oF(r) {
        var a = r == null ? 0 : r.length;
        return a ? Bn(r, 0, -1) : [];
      }
      var sF = me(function(r) {
        var a = V(r, Df);
        return a.length && a[0] === r[0] ? Uf(a) : [];
      }), uF = me(function(r) {
        var a = wn(r), p = V(r, Df);
        return a === wn(p) ? a = t : p.pop(), p.length && p[0] === r[0] ? Uf(p, JA(a, 2)) : [];
      }), lF = me(function(r) {
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
        return p !== t && (x = he(p), x = x < 0 ? ft(Q + x, 0) : Lt(x, Q - 1)), a === a ? hf(r, a, x) : pt(r, KA, x, !0);
      }
      function dF(r, a) {
        return r && r.length ? Cg(r, he(a)) : t;
      }
      var hF = me(fB);
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
        return Q ? (p && typeof p != "number" && kt(r, a, p) ? (a = 0, p = Q) : (a = a == null ? 0 : he(a), p = p === t ? Q : he(p)), Bn(r, a, p)) : [];
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
      function bF(r) {
        return r && r.length ? Eg(r) : [];
      }
      function EF(r, a) {
        return r && r.length ? Eg(r, JA(a, 2)) : [];
      }
      function _F(r) {
        var a = r == null ? 0 : r.length;
        return a ? Bn(r, 1, a) : [];
      }
      function xF(r, a, p) {
        return r && r.length ? (a = p || a === t ? 1 : he(a), Bn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function IF(r, a, p) {
        var Q = r == null ? 0 : r.length;
        return Q ? (a = p || a === t ? 1 : he(a), a = Q - a, Bn(r, a < 0 ? 0 : a, Q)) : [];
      }
      function HF(r, a) {
        return r && r.length ? Pu(r, JA(a, 3), !1, !0) : [];
      }
      function SF(r, a) {
        return r && r.length ? Pu(r, JA(a, 3)) : [];
      }
      var LF = me(function(r) {
        return ui(Ct(r, 1, nt, !0));
      }), TF = me(function(r) {
        var a = wn(r);
        return nt(a) && (a = t), ui(Ct(r, 1, nt, !0), JA(a, 2));
      }), DF = me(function(r) {
        var a = wn(r);
        return a = typeof a == "function" ? a : t, ui(Ct(r, 1, nt, !0), t, a);
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
        return r = E(r, function(p) {
          if (nt(p))
            return a = ft(p.length, a), !0;
        }), Ln(a, function(p) {
          return V(r, le(p));
        });
      }
      function dB(r, a) {
        if (!(r && r.length))
          return [];
        var p = Jf(r);
        return a == null ? p : V(p, function(Q) {
          return s(a, t, Q);
        });
      }
      var PF = me(function(r, a) {
        return nt(r) ? ko(r, a) : [];
      }), KF = me(function(r) {
        return Tf(E(r, nt));
      }), RF = me(function(r) {
        var a = wn(r);
        return nt(a) && (a = t), Tf(E(r, nt), JA(a, 2));
      }), kF = me(function(r) {
        var a = wn(r);
        return a = typeof a == "function" ? a : t, Tf(E(r, nt), t, a);
      }), $F = me(Jf);
      function GF(r, a) {
        return Hg(r || [], a || [], Ro);
      }
      function VF(r, a) {
        return Hg(r || [], a || [], Vo);
      }
      var WF = me(function(r) {
        var a = r.length, p = a > 1 ? r[a - 1] : t;
        return p = typeof p == "function" ? (r.pop(), p) : t, dB(r, p);
      });
      function hB(r) {
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
        return a > 1 || this.__actions__.length || !(Q instanceof Ue) || !Sr(p) ? this.thru(x) : (Q = Q.slice(p, +p + (a ? 1 : 0)), Q.__actions__.push({
          func: qu,
          args: [x],
          thisArg: t
        }), new pn(Q, this.__chain__).thru(function(D) {
          return a && !D.length && D.push(t), D;
        }));
      });
      function zF() {
        return hB(this);
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
        if (r instanceof Ue) {
          var a = r;
          return this.__actions__.length && (a = new Ue(this)), a = a.reverse(), a.__actions__.push({
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
        Se.call(r, p) ? ++r[p] : xr(r, p, 1);
      });
      function nU(r, a, p) {
        var Q = ce(r) ? b : XC;
        return p && kt(r, a, p) && (a = t), Q(r, JA(a, 3));
      }
      function rU(r, a) {
        var p = ce(r) ? E : dg;
        return p(r, JA(a, 3));
      }
      var iU = Rg(sB), aU = Rg(uB);
      function oU(r, a) {
        return Ct(zu(r, a), 1);
      }
      function sU(r, a) {
        return Ct(zu(r, a), fA);
      }
      function uU(r, a, p) {
        return p = p === t ? 1 : he(p), Ct(zu(r, a), p);
      }
      function pB(r, a) {
        var p = ce(r) ? m : si;
        return p(r, JA(a, 3));
      }
      function gB(r, a) {
        var p = ce(r) ? y : fg;
        return p(r, JA(a, 3));
      }
      var lU = Ku(function(r, a, p) {
        Se.call(r, p) ? r[p].push(a) : xr(r, p, [a]);
      });
      function cU(r, a, p, Q) {
        r = zt(r) ? r : Na(r), p = p && !Q ? he(p) : 0;
        var x = r.length;
        return p < 0 && (p = ft(x + p, 0)), Al(r) ? p <= x && r.indexOf(a, p) > -1 : !!x && Je(r, a, p) > -1;
      }
      var fU = me(function(r, a, p) {
        var Q = -1, x = typeof a == "function", D = zt(r) ? rA(r.length) : [];
        return si(r, function(k) {
          D[++Q] = x ? s(a, k, p) : $o(k, a, p);
        }), D;
      }), dU = Ku(function(r, a, p) {
        xr(r, p, a);
      });
      function zu(r, a) {
        var p = ce(r) ? V : mg;
        return p(r, JA(a, 3));
      }
      function hU(r, a, p, Q) {
        return r == null ? [] : (ce(a) || (a = a == null ? [] : [a]), p = Q ? t : p, ce(p) || (p = p == null ? [] : [p]), Qg(r, a, p));
      }
      var pU = Ku(function(r, a, p) {
        r[p ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function gU(r, a, p) {
        var Q = ce(r) ? Z : Sn, x = arguments.length < 3;
        return Q(r, JA(a, 4), p, x, si);
      }
      function BU(r, a, p) {
        var Q = ce(r) ? mA : Sn, x = arguments.length < 3;
        return Q(r, JA(a, 4), p, x, fg);
      }
      function wU(r, a) {
        var p = ce(r) ? E : dg;
        return p(r, Yu(JA(a, 3)));
      }
      function mU(r) {
        var a = ce(r) ? sg : cQ;
        return a(r);
      }
      function vU(r, a, p) {
        (p ? kt(r, a, p) : a === t) ? a = 1 : a = he(a);
        var Q = ce(r) ? kC : fQ;
        return Q(r, a);
      }
      function yU(r) {
        var a = ce(r) ? $C : hQ;
        return a(r);
      }
      function CU(r) {
        if (r == null)
          return 0;
        if (zt(r))
          return Al(r) ? ri(r) : r.length;
        var a = Tt(r);
        return a == wA || a == Be ? r.size : Ef(r).length;
      }
      function QU(r, a, p) {
        var Q = ce(r) ? HA : pQ;
        return p && kt(r, a, p) && (a = t), Q(r, JA(a, 3));
      }
      var FU = me(function(r, a) {
        if (r == null)
          return [];
        var p = a.length;
        return p > 1 && kt(r, a[0], a[1]) ? a = [] : p > 2 && kt(a[0], a[1], a[2]) && (a = [a[0]]), Qg(r, Ct(a, 1), []);
      }), Ju = We || function() {
        return At.Date.now();
      };
      function UU(r, a) {
        if (typeof a != "function")
          throw new yt(l);
        return r = he(r), function() {
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
          throw new yt(l);
        return r = he(r), function() {
          return --r > 0 && (p = a.apply(this, arguments)), r <= 1 && (a = t), p;
        };
      }
      var jf = me(function(r, a, p) {
        var Q = F;
        if (p.length) {
          var x = tr(p, Da(jf));
          Q |= M;
        }
        return Ir(r, Q, a, p, x);
      }), mB = me(function(r, a, p) {
        var Q = F | U;
        if (p.length) {
          var x = tr(p, Da(mB));
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
        var Q, x, D, k, G, Y, hA = 0, pA = !1, CA = !1, LA = !0;
        if (typeof r != "function")
          throw new yt(l);
        a = mn(a) || 0, Ye(p) && (pA = !!p.leading, CA = "maxWait" in p, D = CA ? ft(mn(p.maxWait) || 0, a) : D, LA = "trailing" in p ? !!p.trailing : LA);
        function RA(rt) {
          var Kn = Q, Dr = x;
          return Q = x = t, hA = rt, k = r.apply(Dr, Kn), k;
        }
        function Ae(rt) {
          return hA = rt, G = qo(Fe, a), pA ? RA(rt) : k;
        }
        function we(rt) {
          var Kn = rt - Y, Dr = rt - hA, RB = a - Kn;
          return CA ? Lt(RB, D - Dr) : RB;
        }
        function ee(rt) {
          var Kn = rt - Y, Dr = rt - hA;
          return Y === t || Kn >= a || Kn < 0 || CA && Dr >= D;
        }
        function Fe() {
          var rt = Ju();
          if (ee(rt))
            return _e(rt);
          G = qo(Fe, we(rt));
        }
        function _e(rt) {
          return G = t, LA && Q ? RA(rt) : (Q = x = t, k);
        }
        function on() {
          G !== t && Sg(G), hA = 0, Q = Y = x = G = t;
        }
        function $t() {
          return G === t ? k : _e(Ju());
        }
        function sn() {
          var rt = Ju(), Kn = ee(rt);
          if (Q = arguments, x = this, Y = rt, Kn) {
            if (G === t)
              return Ae(Y);
            if (CA)
              return Sg(G), G = qo(Fe, a), RA(Y);
          }
          return G === t && (G = qo(Fe, a)), k;
        }
        return sn.cancel = on, sn.flush = $t, sn;
      }
      var bU = me(function(r, a) {
        return cg(r, 1, a);
      }), EU = me(function(r, a, p) {
        return cg(r, mn(a) || 0, p);
      });
      function _U(r) {
        return Ir(r, sA);
      }
      function ju(r, a) {
        if (typeof r != "function" || a != null && typeof a != "function")
          throw new yt(l);
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
      function xU(r) {
        return wB(2, r);
      }
      var IU = gQ(function(r, a) {
        a = a.length == 1 && ce(a[0]) ? V(a[0], Ke(JA())) : V(Ct(a, 1), Ke(JA()));
        var p = a.length;
        return me(function(Q) {
          for (var x = -1, D = Lt(Q.length, p); ++x < D; )
            Q[x] = a[x].call(this, Q[x]);
          return s(r, this, Q);
        });
      }), Yf = me(function(r, a) {
        var p = tr(a, Da(Yf));
        return Ir(r, M, t, a, p);
      }), QB = me(function(r, a) {
        var p = tr(a, Da(QB));
        return Ir(r, K, t, a, p);
      }), HU = Hr(function(r, a) {
        return Ir(r, cA, t, t, t, a);
      });
      function SU(r, a) {
        if (typeof r != "function")
          throw new yt(l);
        return a = a === t ? a : he(a), me(r, a);
      }
      function LU(r, a) {
        if (typeof r != "function")
          throw new yt(l);
        return a = a == null ? 0 : ft(he(a), 0), me(function(p) {
          var Q = p[a], x = ci(p, 0, a);
          return Q && X(x, Q), s(r, this, x);
        });
      }
      function TU(r, a, p) {
        var Q = !0, x = !0;
        if (typeof r != "function")
          throw new yt(l);
        return Ye(p) && (Q = "leading" in p ? !!p.leading : Q, x = "trailing" in p ? !!p.trailing : x), CB(r, a, {
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
        return ce(r) ? r : [r];
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
        return a == null || lg(r, a, Bt(a));
      }
      function Pn(r, a) {
        return r === a || r !== r && a !== a;
      }
      var $U = Gu(Ff), GU = Gu(function(r, a) {
        return r >= a;
      }), Vi = gg(/* @__PURE__ */ function() {
        return arguments;
      }()) ? gg : function(r) {
        return Ze(r) && Se.call(r, "callee") && !ZA.call(r, "callee");
      }, ce = rA.isArray, VU = xo ? Ke(xo) : ZC;
      function zt(r) {
        return r != null && Zu(r.length) && !Lr(r);
      }
      function nt(r) {
        return Ze(r) && zt(r);
      }
      function WU(r) {
        return r === !0 || r === !1 || Ze(r) && Rt(r) == UA;
      }
      var fi = aC || ud, XU = Ua ? Ke(Ua) : AQ;
      function qU(r) {
        return Ze(r) && r.nodeType === 1 && !zo(r);
      }
      function zU(r) {
        if (r == null)
          return !0;
        if (zt(r) && (ce(r) || typeof r == "string" || typeof r.splice == "function" || fi(r) || Oa(r) || Vi(r)))
          return !r.length;
        var a = Tt(r);
        if (a == wA || a == Be)
          return !r.size;
        if (Xo(r))
          return !Ef(r).length;
        for (var p in r)
          if (Se.call(r, p))
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
        if (!Ye(r))
          return !1;
        var a = Rt(r);
        return a == SA || a == aA || a == QA || a == lt;
      }
      function FB(r) {
        return typeof r == "number" && r == he(r);
      }
      function Zu(r) {
        return typeof r == "number" && r > -1 && r % 1 == 0 && r <= EA;
      }
      function Ye(r) {
        var a = typeof r;
        return r != null && (a == "object" || a == "function");
      }
      function Ze(r) {
        return r != null && typeof r == "object";
      }
      var UB = Io ? Ke(Io) : tQ;
      function ZU(r, a) {
        return r === a || bf(r, a, $f(a));
      }
      function Ab(r, a, p) {
        return p = typeof p == "function" ? p : t, bf(r, a, $f(a), p);
      }
      function eb(r) {
        return bB(r) && r != +r;
      }
      function tb(r) {
        if (PQ(r))
          throw new ae(o);
        return Bg(r);
      }
      function nb(r) {
        return r === null;
      }
      function rb(r) {
        return r == null;
      }
      function bB(r) {
        return typeof r == "number" || Ze(r) && Rt(r) == bA;
      }
      function zo(r) {
        if (!Ze(r) || Rt(r) != ge)
          return !1;
        var a = re(r);
        if (a === null)
          return !0;
        var p = Se.call(a, "constructor") && a.constructor;
        return typeof p == "function" && p instanceof p && oi.call(p) == q;
      }
      var Ad = Ho ? Ke(Ho) : nQ;
      function ib(r) {
        return FB(r) && r >= -EA && r <= EA;
      }
      var EB = Qu ? Ke(Qu) : rQ;
      function Al(r) {
        return typeof r == "string" || !ce(r) && Ze(r) && Rt(r) == Le;
      }
      function an(r) {
        return typeof r == "symbol" || Ze(r) && Rt(r) == ne;
      }
      var Oa = Fu ? Ke(Fu) : iQ;
      function ab(r) {
        return r === t;
      }
      function ob(r) {
        return Ze(r) && Tt(r) == Et;
      }
      function sb(r) {
        return Ze(r) && Rt(r) == Mt;
      }
      var ub = Gu(_f), lb = Gu(function(r, a) {
        return r <= a;
      });
      function _B(r) {
        if (!r)
          return [];
        if (zt(r))
          return Al(r) ? vt(r) : qt(r);
        if (XA && r[XA])
          return Ea(r[XA]());
        var a = Tt(r), p = a == wA ? To : a == Be ? _a : Na;
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
      function he(r) {
        var a = Tr(r), p = a % 1;
        return a === a ? p ? a - p : a : 0;
      }
      function xB(r) {
        return r ? Ri(he(r), 0, T) : 0;
      }
      function mn(r) {
        if (typeof r == "number")
          return r;
        if (an(r))
          return iA;
        if (Ye(r)) {
          var a = typeof r.valueOf == "function" ? r.valueOf() : r;
          r = Ye(a) ? a + "" : a;
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
      function cb(r) {
        return r ? Ri(he(r), -EA, EA) : r === 0 ? r : 0;
      }
      function Oe(r) {
        return r == null ? "" : rn(r);
      }
      var fb = La(function(r, a) {
        if (Xo(a) || zt(a)) {
          ir(a, Bt(a), r);
          return;
        }
        for (var p in a)
          Se.call(a, p) && Ro(r, p, a[p]);
      }), HB = La(function(r, a) {
        ir(a, Jt(a), r);
      }), el = La(function(r, a, p, Q) {
        ir(a, Jt(a), r, Q);
      }), db = La(function(r, a, p, Q) {
        ir(a, Bt(a), r, Q);
      }), hb = Hr(yf);
      function pb(r, a) {
        var p = Sa(r);
        return a == null ? p : ug(p, a);
      }
      var gb = me(function(r, a) {
        r = Ee(r);
        var p = -1, Q = a.length, x = Q > 2 ? a[2] : t;
        for (x && kt(a[0], a[1], x) && (Q = 1); ++p < Q; )
          for (var D = a[p], k = Jt(D), G = -1, Y = k.length; ++G < Y; ) {
            var hA = k[G], pA = r[hA];
            (pA === t || Pn(pA, ai[hA]) && !Se.call(r, hA)) && (r[hA] = D[hA]);
          }
        return r;
      }), Bb = me(function(r) {
        return r.push(t, qg), s(SB, t, r);
      });
      function wb(r, a) {
        return ue(r, JA(a, 3), rr);
      }
      function mb(r, a) {
        return ue(r, JA(a, 3), Qf);
      }
      function vb(r, a) {
        return r == null ? r : Cf(r, JA(a, 3), Jt);
      }
      function yb(r, a) {
        return r == null ? r : hg(r, JA(a, 3), Jt);
      }
      function Cb(r, a) {
        return r && rr(r, JA(a, 3));
      }
      function Qb(r, a) {
        return r && Qf(r, JA(a, 3));
      }
      function Fb(r) {
        return r == null ? [] : Ou(r, Bt(r));
      }
      function Ub(r) {
        return r == null ? [] : Ou(r, Jt(r));
      }
      function ed(r, a, p) {
        var Q = r == null ? t : ki(r, a);
        return Q === t ? p : Q;
      }
      function bb(r, a) {
        return r != null && jg(r, a, zC);
      }
      function td(r, a) {
        return r != null && jg(r, a, JC);
      }
      var Eb = $g(function(r, a, p) {
        a != null && typeof a.toString != "function" && (a = $.call(a)), r[a] = p;
      }, rd(jt)), _b = $g(function(r, a, p) {
        a != null && typeof a.toString != "function" && (a = $.call(a)), Se.call(r, a) ? r[a].push(p) : r[a] = [p];
      }, JA), xb = me($o);
      function Bt(r) {
        return zt(r) ? og(r) : Ef(r);
      }
      function Jt(r) {
        return zt(r) ? og(r, !0) : aQ(r);
      }
      function Ib(r, a) {
        var p = {};
        return a = JA(a, 3), rr(r, function(Q, x, D) {
          xr(p, a(Q, x, D), Q);
        }), p;
      }
      function Hb(r, a) {
        var p = {};
        return a = JA(a, 3), rr(r, function(Q, x, D) {
          xr(p, x, a(Q, x, D));
        }), p;
      }
      var Sb = La(function(r, a, p) {
        Nu(r, a, p);
      }), SB = La(function(r, a, p, Q) {
        Nu(r, a, p, Q);
      }), Lb = Hr(function(r, a) {
        var p = {};
        if (r == null)
          return p;
        var Q = !1;
        a = V(a, function(D) {
          return D = li(D, r), Q || (Q = D.length > 1), D;
        }), ir(r, Rf(r), p), Q && (p = gn(p, B | g | v, EQ));
        for (var x = a.length; x--; )
          Lf(p, a[x]);
        return p;
      });
      function Tb(r, a) {
        return LB(r, Yu(JA(a)));
      }
      var Db = Hr(function(r, a) {
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
      function Ob(r, a, p) {
        a = li(a, r);
        var Q = -1, x = a.length;
        for (x || (x = 1, r = t); ++Q < x; ) {
          var D = r == null ? t : r[ar(a[Q])];
          D === t && (Q = x, D = p), r = Lr(D) ? D.call(r) : D;
        }
        return r;
      }
      function Nb(r, a, p) {
        return r == null ? r : Vo(r, a, p);
      }
      function Mb(r, a, p, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : Vo(r, a, p, Q);
      }
      var TB = Wg(Bt), DB = Wg(Jt);
      function Pb(r, a, p) {
        var Q = ce(r), x = Q || fi(r) || Oa(r);
        if (a = JA(a, 4), p == null) {
          var D = r && r.constructor;
          x ? p = Q ? new D() : [] : Ye(r) ? p = Lr(D) ? Sa(re(r)) : {} : p = {};
        }
        return (x ? m : rr)(r, function(k, G, Y) {
          return a(p, k, G, Y);
        }), p;
      }
      function Kb(r, a) {
        return r == null ? !0 : Lf(r, a);
      }
      function Rb(r, a, p) {
        return r == null ? r : xg(r, a, Of(p));
      }
      function kb(r, a, p, Q) {
        return Q = typeof Q == "function" ? Q : t, r == null ? r : xg(r, a, Of(p), Q);
      }
      function Na(r) {
        return r == null ? [] : St(r, Bt(r));
      }
      function $b(r) {
        return r == null ? [] : St(r, Jt(r));
      }
      function Gb(r, a, p) {
        return p === t && (p = a, a = t), p !== t && (p = mn(p), p = p === p ? p : 0), a !== t && (a = mn(a), a = a === a ? a : 0), Ri(mn(r), a, p);
      }
      function Vb(r, a, p) {
        return a = Tr(a), p === t ? (p = a, a = 0) : p = Tr(p), r = mn(r), jC(r, a, p);
      }
      function Wb(r, a, p) {
        if (p && typeof p != "boolean" && kt(r, a, p) && (a = p = t), p === t && (typeof a == "boolean" ? (p = a, a = t) : typeof r == "boolean" && (p = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = Tr(r), a === t ? (a = r, r = 0) : a = Tr(a)), r > a) {
          var Q = r;
          r = a, a = Q;
        }
        if (p || r % 1 || a % 1) {
          var x = ig();
          return Lt(r + x * (a - r + cf("1e-" + ((x + "").length - 1))), a);
        }
        return If(r, a);
      }
      var Xb = Ta(function(r, a, p) {
        return a = a.toLowerCase(), r + (p ? OB(a) : a);
      });
      function OB(r) {
        return nd(Oe(r).toLowerCase());
      }
      function NB(r) {
        return r = Oe(r), r && r.replace(Zc, Lo).replace(Bu, "");
      }
      function qb(r, a, p) {
        r = Oe(r), a = rn(a);
        var Q = r.length;
        p = p === t ? Q : Ri(he(p), 0, Q);
        var x = p;
        return p -= a.length, p >= 0 && r.slice(p, x) == a;
      }
      function zb(r) {
        return r = Oe(r), r && Ii.test(r) ? r.replace(xi, De) : r;
      }
      function Jb(r) {
        return r = Oe(r), r && yr.test(r) ? r.replace(mo, "\\$&") : r;
      }
      var jb = Ta(function(r, a, p) {
        return r + (p ? "-" : "") + a.toLowerCase();
      }), Yb = Ta(function(r, a, p) {
        return r + (p ? " " : "") + a.toLowerCase();
      }), Zb = Kg("toLowerCase");
      function AE(r, a, p) {
        r = Oe(r), a = he(a);
        var Q = a ? ri(r) : 0;
        if (!a || Q >= a)
          return r;
        var x = (a - Q) / 2;
        return $u(gt(x), p) + r + $u(nr(x), p);
      }
      function eE(r, a, p) {
        r = Oe(r), a = he(a);
        var Q = a ? ri(r) : 0;
        return a && Q < a ? r + $u(a - Q, p) : r;
      }
      function tE(r, a, p) {
        r = Oe(r), a = he(a);
        var Q = a ? ri(r) : 0;
        return a && Q < a ? $u(a - Q, p) + r : r;
      }
      function nE(r, a, p) {
        return p || a == null ? a = 0 : a && (a = +a), lC(Oe(r).replace(ha, ""), a || 0);
      }
      function rE(r, a, p) {
        return (p ? kt(r, a, p) : a === t) ? a = 1 : a = he(a), Hf(Oe(r), a);
      }
      function iE() {
        var r = arguments, a = Oe(r[0]);
        return r.length < 3 ? a : a.replace(r[1], r[2]);
      }
      var aE = Ta(function(r, a, p) {
        return r + (p ? "_" : "") + a.toLowerCase();
      });
      function oE(r, a, p) {
        return p && typeof p != "number" && kt(r, a, p) && (a = p = t), p = p === t ? T : p >>> 0, p ? (r = Oe(r), r && (typeof a == "string" || a != null && !Ad(a)) && (a = rn(a), !a && er(r)) ? ci(vt(r), 0, p) : r.split(a, p)) : [];
      }
      var sE = Ta(function(r, a, p) {
        return r + (p ? " " : "") + nd(a);
      });
      function uE(r, a, p) {
        return r = Oe(r), p = p == null ? 0 : Ri(he(p), 0, r.length), a = rn(a), r.slice(p, p + a.length) == a;
      }
      function lE(r, a, p) {
        var Q = S.templateSettings;
        p && kt(r, a, p) && (a = t), r = Oe(r), a = el({}, a, Q, Xg);
        var x = el({}, a.imports, Q.imports, Xg), D = Bt(x), k = St(x, D), G, Y, hA = 0, pA = a.interpolate || Ba, CA = "__p += '", LA = Ni(
          (a.escape || Ba).source + "|" + pA.source + "|" + (pA === Hi ? eu : Ba).source + "|" + (a.evaluate || Ba).source + "|$",
          "g"
        ), RA = "//# sourceURL=" + (Se.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++vu + "]") + `
`;
        r.replace(LA, function(ee, Fe, _e, on, $t, sn) {
          return _e || (_e = on), CA += r.slice(hA, sn).replace(Af, Ur), Fe && (G = !0, CA += `' +
__e(` + Fe + `) +
'`), $t && (Y = !0, CA += `';
` + $t + `;
__p += '`), _e && (CA += `' +
((__t = (` + _e + `)) == null ? '' : __t) +
'`), hA = sn + ee.length, ee;
        }), CA += `';
`;
        var Ae = Se.call(a, "variable") && a.variable;
        if (!Ae)
          CA = `with (obj) {
` + CA + `
}
`;
        else if (ga.test(Ae))
          throw new ae(f);
        CA = (Y ? CA.replace(Qe, "") : CA).replace(st, "$1").replace(xt, "$1;"), CA = "function(" + (Ae || "obj") + `) {
` + (Ae ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (G ? ", __e = _.escape" : "") + (Y ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + CA + `return __p
}`;
        var we = PB(function() {
          return He(D, RA + "return " + CA).apply(t, k);
        });
        if (we.source = CA, Zf(we))
          throw we;
        return we;
      }
      function cE(r) {
        return Oe(r).toLowerCase();
      }
      function fE(r) {
        return Oe(r).toUpperCase();
      }
      function dE(r, a, p) {
        if (r = Oe(r), r && (p || a === t))
          return Tn(r);
        if (!r || !(a = rn(a)))
          return r;
        var Q = vt(r), x = vt(a), D = Dn(Q, x), k = So(Q, x) + 1;
        return ci(Q, D, k).join("");
      }
      function hE(r, a, p) {
        if (r = Oe(r), r && (p || a === t))
          return r.slice(0, _u(r) + 1);
        if (!r || !(a = rn(a)))
          return r;
        var Q = vt(r), x = So(Q, vt(a)) + 1;
        return ci(Q, 0, x).join("");
      }
      function pE(r, a, p) {
        if (r = Oe(r), r && (p || a === t))
          return r.replace(ha, "");
        if (!r || !(a = rn(a)))
          return r;
        var Q = vt(r), x = Dn(Q, vt(a));
        return ci(Q, x).join("");
      }
      function gE(r, a) {
        var p = gA, Q = FA;
        if (Ye(a)) {
          var x = "separator" in a ? a.separator : x;
          p = "length" in a ? he(a.length) : p, Q = "omission" in a ? rn(a.omission) : Q;
        }
        r = Oe(r);
        var D = r.length;
        if (er(r)) {
          var k = vt(r);
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
        if (k && (G += Y.length - G), Ad(x)) {
          if (r.slice(G).search(x)) {
            var hA, pA = Y;
            for (x.global || (x = Ni(x.source, Oe(jn.exec(x)) + "g")), x.lastIndex = 0; hA = x.exec(pA); )
              var CA = hA.index;
            Y = Y.slice(0, CA === t ? G : CA);
          }
        } else if (r.indexOf(rn(x), G) != G) {
          var LA = Y.lastIndexOf(x);
          LA > -1 && (Y = Y.slice(0, LA));
        }
        return Y + Q;
      }
      function BE(r) {
        return r = Oe(r), r && xn.test(r) ? r.replace(_n, Do) : r;
      }
      var wE = Ta(function(r, a, p) {
        return r + (p ? " " : "") + a.toUpperCase();
      }), nd = Kg("toUpperCase");
      function MB(r, a, p) {
        return r = Oe(r), a = p ? t : a, a === t ? df(r) ? Nn(r) : YA(r) : r.match(a) || [];
      }
      var PB = me(function(r, a) {
        try {
          return s(r, t, a);
        } catch (p) {
          return Zf(p) ? p : new ae(p);
        }
      }), mE = Hr(function(r, a) {
        return m(a, function(p) {
          p = ar(p), xr(r, p, jf(r[p], r));
        }), r;
      });
      function vE(r) {
        var a = r == null ? 0 : r.length, p = JA();
        return r = a ? V(r, function(Q) {
          if (typeof Q[1] != "function")
            throw new yt(l);
          return [p(Q[0]), Q[1]];
        }) : [], me(function(Q) {
          for (var x = -1; ++x < a; ) {
            var D = r[x];
            if (s(D[0], this, Q))
              return s(D[1], this, Q);
          }
        });
      }
      function yE(r) {
        return WC(gn(r, B));
      }
      function rd(r) {
        return function() {
          return r;
        };
      }
      function CE(r, a) {
        return r == null || r !== r ? a : r;
      }
      var QE = kg(), FE = kg(!0);
      function jt(r) {
        return r;
      }
      function id(r) {
        return wg(typeof r == "function" ? r : gn(r, B));
      }
      function UE(r) {
        return vg(gn(r, B));
      }
      function bE(r, a) {
        return yg(r, gn(a, B));
      }
      var EE = me(function(r, a) {
        return function(p) {
          return $o(p, r, a);
        };
      }), _E = me(function(r, a) {
        return function(p) {
          return $o(r, p, a);
        };
      });
      function ad(r, a, p) {
        var Q = Bt(a), x = Ou(a, Q);
        p == null && !(Ye(a) && (x.length || !Q.length)) && (p = a, a = r, r = this, x = Ou(a, Bt(a)));
        var D = !(Ye(p) && "chain" in p) || !!p.chain, k = Lr(r);
        return m(x, function(G) {
          var Y = a[G];
          r[G] = Y, k && (r.prototype[G] = function() {
            var hA = this.__chain__;
            if (D || hA) {
              var pA = r(this.__wrapped__), CA = pA.__actions__ = qt(this.__actions__);
              return CA.push({ func: Y, args: arguments, thisArg: r }), pA.__chain__ = hA, pA;
            }
            return Y.apply(r, X([this.value()], arguments));
          });
        }), r;
      }
      function xE() {
        return At._ === this && (At._ = uA), this;
      }
      function od() {
      }
      function IE(r) {
        return r = he(r), me(function(a) {
          return Cg(a, r);
        });
      }
      var HE = Mf(V), SE = Mf(b), LE = Mf(HA);
      function KB(r) {
        return Vf(r) ? le(ar(r)) : uQ(r);
      }
      function TE(r) {
        return function(a) {
          return r == null ? t : ki(r, a);
        };
      }
      var DE = Gg(), OE = Gg(!0);
      function sd() {
        return [];
      }
      function ud() {
        return !1;
      }
      function NE() {
        return {};
      }
      function ME() {
        return "";
      }
      function PE() {
        return !0;
      }
      function KE(r, a) {
        if (r = he(r), r < 1 || r > EA)
          return [];
        var p = T, Q = Lt(r, T);
        a = JA(a), r -= T;
        for (var x = Ln(Q, a); ++p < r; )
          a(p);
        return x;
      }
      function RE(r) {
        return ce(r) ? V(r, ar) : an(r) ? [r] : qt(aB(Oe(r)));
      }
      function kE(r) {
        var a = ++gf;
        return Oe(r) + a;
      }
      var $E = ku(function(r, a) {
        return r + a;
      }, 0), GE = Pf("ceil"), VE = ku(function(r, a) {
        return r / a;
      }, 1), WE = Pf("floor");
      function XE(r) {
        return r && r.length ? Du(r, jt, Ff) : t;
      }
      function qE(r, a) {
        return r && r.length ? Du(r, JA(a, 2), Ff) : t;
      }
      function zE(r) {
        return ct(r, jt);
      }
      function JE(r, a) {
        return ct(r, JA(a, 2));
      }
      function jE(r) {
        return r && r.length ? Du(r, jt, _f) : t;
      }
      function YE(r, a) {
        return r && r.length ? Du(r, JA(a, 2), _f) : t;
      }
      var ZE = ku(function(r, a) {
        return r * a;
      }, 1), A1 = Pf("round"), e1 = ku(function(r, a) {
        return r - a;
      }, 0);
      function t1(r) {
        return r && r.length ? Ht(r, jt) : 0;
      }
      function n1(r, a) {
        return r && r.length ? Ht(r, JA(a, 2)) : 0;
      }
      return S.after = UU, S.ary = BB, S.assign = fb, S.assignIn = HB, S.assignInWith = el, S.assignWith = db, S.at = hb, S.before = wB, S.bind = jf, S.bindAll = mE, S.bindKey = mB, S.castArray = NU, S.chain = hB, S.chunk = WQ, S.compact = XQ, S.concat = qQ, S.cond = vE, S.conforms = yE, S.constant = rd, S.countBy = tU, S.create = pb, S.curry = vB, S.curryRight = yB, S.debounce = CB, S.defaults = gb, S.defaultsDeep = Bb, S.defer = bU, S.delay = EU, S.difference = zQ, S.differenceBy = JQ, S.differenceWith = jQ, S.drop = YQ, S.dropRight = ZQ, S.dropRightWhile = AF, S.dropWhile = eF, S.fill = tF, S.filter = rU, S.flatMap = oU, S.flatMapDeep = sU, S.flatMapDepth = uU, S.flatten = lB, S.flattenDeep = nF, S.flattenDepth = rF, S.flip = _U, S.flow = QE, S.flowRight = FE, S.fromPairs = iF, S.functions = Fb, S.functionsIn = Ub, S.groupBy = lU, S.initial = oF, S.intersection = sF, S.intersectionBy = uF, S.intersectionWith = lF, S.invert = Eb, S.invertBy = _b, S.invokeMap = fU, S.iteratee = id, S.keyBy = dU, S.keys = Bt, S.keysIn = Jt, S.map = zu, S.mapKeys = Ib, S.mapValues = Hb, S.matches = UE, S.matchesProperty = bE, S.memoize = ju, S.merge = Sb, S.mergeWith = SB, S.method = EE, S.methodOf = _E, S.mixin = ad, S.negate = Yu, S.nthArg = IE, S.omit = Lb, S.omitBy = Tb, S.once = xU, S.orderBy = hU, S.over = HE, S.overArgs = IU, S.overEvery = SE, S.overSome = LE, S.partial = Yf, S.partialRight = QB, S.partition = pU, S.pick = Db, S.pickBy = LB, S.property = KB, S.propertyOf = TE, S.pull = hF, S.pullAll = fB, S.pullAllBy = pF, S.pullAllWith = gF, S.pullAt = BF, S.range = DE, S.rangeRight = OE, S.rearg = HU, S.reject = wU, S.remove = wF, S.rest = SU, S.reverse = zf, S.sampleSize = vU, S.set = Nb, S.setWith = Mb, S.shuffle = yU, S.slice = mF, S.sortBy = FU, S.sortedUniq = bF, S.sortedUniqBy = EF, S.split = oE, S.spread = LU, S.tail = _F, S.take = xF, S.takeRight = IF, S.takeRightWhile = HF, S.takeWhile = SF, S.tap = XF, S.throttle = TU, S.thru = qu, S.toArray = _B, S.toPairs = TB, S.toPairsIn = DB, S.toPath = RE, S.toPlainObject = IB, S.transform = Pb, S.unary = DU, S.union = LF, S.unionBy = TF, S.unionWith = DF, S.uniq = OF, S.uniqBy = NF, S.uniqWith = MF, S.unset = Kb, S.unzip = Jf, S.unzipWith = dB, S.update = Rb, S.updateWith = kb, S.values = Na, S.valuesIn = $b, S.without = PF, S.words = MB, S.wrap = OU, S.xor = KF, S.xorBy = RF, S.xorWith = kF, S.zip = $F, S.zipObject = GF, S.zipObjectDeep = VF, S.zipWith = WF, S.entries = TB, S.entriesIn = DB, S.extend = HB, S.extendWith = el, ad(S, S), S.add = $E, S.attempt = PB, S.camelCase = Xb, S.capitalize = OB, S.ceil = GE, S.clamp = Gb, S.clone = MU, S.cloneDeep = KU, S.cloneDeepWith = RU, S.cloneWith = PU, S.conformsTo = kU, S.deburr = NB, S.defaultTo = CE, S.divide = VE, S.endsWith = qb, S.eq = Pn, S.escape = zb, S.escapeRegExp = Jb, S.every = nU, S.find = iU, S.findIndex = sB, S.findKey = wb, S.findLast = aU, S.findLastIndex = uB, S.findLastKey = mb, S.floor = WE, S.forEach = pB, S.forEachRight = gB, S.forIn = vb, S.forInRight = yb, S.forOwn = Cb, S.forOwnRight = Qb, S.get = ed, S.gt = $U, S.gte = GU, S.has = bb, S.hasIn = td, S.head = cB, S.identity = jt, S.includes = cU, S.indexOf = aF, S.inRange = Vb, S.invoke = xb, S.isArguments = Vi, S.isArray = ce, S.isArrayBuffer = VU, S.isArrayLike = zt, S.isArrayLikeObject = nt, S.isBoolean = WU, S.isBuffer = fi, S.isDate = XU, S.isElement = qU, S.isEmpty = zU, S.isEqual = JU, S.isEqualWith = jU, S.isError = Zf, S.isFinite = YU, S.isFunction = Lr, S.isInteger = FB, S.isLength = Zu, S.isMap = UB, S.isMatch = ZU, S.isMatchWith = Ab, S.isNaN = eb, S.isNative = tb, S.isNil = rb, S.isNull = nb, S.isNumber = bB, S.isObject = Ye, S.isObjectLike = Ze, S.isPlainObject = zo, S.isRegExp = Ad, S.isSafeInteger = ib, S.isSet = EB, S.isString = Al, S.isSymbol = an, S.isTypedArray = Oa, S.isUndefined = ab, S.isWeakMap = ob, S.isWeakSet = sb, S.join = cF, S.kebabCase = jb, S.last = wn, S.lastIndexOf = fF, S.lowerCase = Yb, S.lowerFirst = Zb, S.lt = ub, S.lte = lb, S.max = XE, S.maxBy = qE, S.mean = zE, S.meanBy = JE, S.min = jE, S.minBy = YE, S.stubArray = sd, S.stubFalse = ud, S.stubObject = NE, S.stubString = ME, S.stubTrue = PE, S.multiply = ZE, S.nth = dF, S.noConflict = xE, S.noop = od, S.now = Ju, S.pad = AE, S.padEnd = eE, S.padStart = tE, S.parseInt = nE, S.random = Wb, S.reduce = gU, S.reduceRight = BU, S.repeat = rE, S.replace = iE, S.result = Ob, S.round = A1, S.runInContext = j, S.sample = mU, S.size = CU, S.snakeCase = aE, S.some = QU, S.sortedIndex = vF, S.sortedIndexBy = yF, S.sortedIndexOf = CF, S.sortedLastIndex = QF, S.sortedLastIndexBy = FF, S.sortedLastIndexOf = UF, S.startCase = sE, S.startsWith = uE, S.subtract = e1, S.sum = t1, S.sumBy = n1, S.template = lE, S.times = KE, S.toFinite = Tr, S.toInteger = he, S.toLength = xB, S.toLower = cE, S.toNumber = mn, S.toSafeInteger = cb, S.toString = Oe, S.toUpper = fE, S.trim = dE, S.trimEnd = hE, S.trimStart = pE, S.truncate = gE, S.unescape = BE, S.uniqueId = kE, S.upperCase = wE, S.upperFirst = nd, S.each = pB, S.eachRight = gB, S.first = cB, ad(S, function() {
        var r = {};
        return rr(S, function(a, p) {
          Se.call(S.prototype, p) || (r[p] = a);
        }), r;
      }(), { chain: !1 }), S.VERSION = n, m(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        S[r].placeholder = S;
      }), m(["drop", "take"], function(r, a) {
        Ue.prototype[r] = function(p) {
          p = p === t ? 1 : ft(he(p), 0);
          var Q = this.__filtered__ && !a ? new Ue(this) : this.clone();
          return Q.__filtered__ ? Q.__takeCount__ = Lt(p, Q.__takeCount__) : Q.__views__.push({
            size: Lt(p, T),
            type: r + (Q.__dir__ < 0 ? "Right" : "")
          }), Q;
        }, Ue.prototype[r + "Right"] = function(p) {
          return this.reverse()[r](p).reverse();
        };
      }), m(["filter", "map", "takeWhile"], function(r, a) {
        var p = a + 1, Q = p == W || p == eA;
        Ue.prototype[r] = function(x) {
          var D = this.clone();
          return D.__iteratees__.push({
            iteratee: JA(x, 3),
            type: p
          }), D.__filtered__ = D.__filtered__ || Q, D;
        };
      }), m(["head", "last"], function(r, a) {
        var p = "take" + (a ? "Right" : "");
        Ue.prototype[r] = function() {
          return this[p](1).value()[0];
        };
      }), m(["initial", "tail"], function(r, a) {
        var p = "drop" + (a ? "" : "Right");
        Ue.prototype[r] = function() {
          return this.__filtered__ ? new Ue(this) : this[p](1);
        };
      }), Ue.prototype.compact = function() {
        return this.filter(jt);
      }, Ue.prototype.find = function(r) {
        return this.filter(r).head();
      }, Ue.prototype.findLast = function(r) {
        return this.reverse().find(r);
      }, Ue.prototype.invokeMap = me(function(r, a) {
        return typeof r == "function" ? new Ue(this) : this.map(function(p) {
          return $o(p, r, a);
        });
      }), Ue.prototype.reject = function(r) {
        return this.filter(Yu(JA(r)));
      }, Ue.prototype.slice = function(r, a) {
        r = he(r);
        var p = this;
        return p.__filtered__ && (r > 0 || a < 0) ? new Ue(p) : (r < 0 ? p = p.takeRight(-r) : r && (p = p.drop(r)), a !== t && (a = he(a), p = a < 0 ? p.dropRight(-a) : p.take(a - r)), p);
      }, Ue.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, Ue.prototype.toArray = function() {
        return this.take(T);
      }, rr(Ue.prototype, function(r, a) {
        var p = /^(?:filter|find|map|reject)|While$/.test(a), Q = /^(?:head|last)$/.test(a), x = S[Q ? "take" + (a == "last" ? "Right" : "") : a], D = Q || /^find/.test(a);
        x && (S.prototype[a] = function() {
          var k = this.__wrapped__, G = Q ? [1] : arguments, Y = k instanceof Ue, hA = G[0], pA = Y || ce(k), CA = function(Fe) {
            var _e = x.apply(S, X([Fe], G));
            return Q && LA ? _e[0] : _e;
          };
          pA && p && typeof hA == "function" && hA.length != 1 && (Y = pA = !1);
          var LA = this.__chain__, RA = !!this.__actions__.length, Ae = D && !LA, we = Y && !RA;
          if (!D && pA) {
            k = we ? k : new Ue(this);
            var ee = r.apply(k, G);
            return ee.__actions__.push({ func: qu, args: [CA], thisArg: t }), new pn(ee, LA);
          }
          return Ae && we ? r.apply(this, G) : (ee = this.thru(CA), Ae ? Q ? ee.value()[0] : ee.value() : ee);
        });
      }), m(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var a = ii[r], p = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", Q = /^(?:pop|shift)$/.test(r);
        S.prototype[r] = function() {
          var x = arguments;
          if (Q && !this.__chain__) {
            var D = this.value();
            return a.apply(ce(D) ? D : [], x);
          }
          return this[p](function(k) {
            return a.apply(ce(k) ? k : [], x);
          });
        };
      }), rr(Ue.prototype, function(r, a) {
        var p = S[a];
        if (p) {
          var Q = p.name + "";
          Se.call(Ha, Q) || (Ha[Q] = []), Ha[Q].push({ name: a, func: p });
        }
      }), Ha[Ru(t, U).name] = [{
        name: "wrapper",
        func: t
      }], Ue.prototype.clone = BC, Ue.prototype.reverse = wC, Ue.prototype.value = mC, S.prototype.at = qF, S.prototype.chain = zF, S.prototype.commit = JF, S.prototype.next = jF, S.prototype.plant = ZF, S.prototype.reverse = AU, S.prototype.toJSON = S.prototype.valueOf = S.prototype.value = eU, S.prototype.first = S.prototype.head, XA && (S.prototype[XA] = YF), S;
    }, Ie = xu();
    hn ? ((hn.exports = Ie)._ = Ie, _o._ = Ie) : At._ = Ie;
  }).call(Ji);
})(ac, ac.exports);
var fS = ac.exports;
const xe = /* @__PURE__ */ xc(fS), dS = function(A) {
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
  }, t = xe.merge({}, e, A), n = function(i, o) {
    var l = xe.cloneDeep(i);
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
      }, f = Math.min(t.numberPerRow, o.chromosomes.length), c = Math.ceil(o.chromosomes.length / f), d = {
        width: l.width / f,
        height: l.height / c
      }, w = {
        top: d.height * t.cellMargin.top,
        bottom: d.height * t.cellMargin.bottom,
        left: d.width * t.cellMargin.left,
        right: d.width * t.cellMargin.right
      }, B = t.labelHeight * d.height, g = t.labelHeight * d.height, v = d.height - B - g - w.top - w.bottom, u = Math.min(
        65 / t.scale,
        v * t.chromosomeAspectRatio
      ), C = d.width - u - w.left - w.right, F = C / 2, U = Math.max.apply(
        null,
        o.chromosomes.map(function(_) {
          return _.length;
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
      var O = {
        chromosomePosition: {
          height: v,
          width: u,
          x: w.left + F,
          y: w.top + B
        },
        labelPosition: {
          height: B,
          width: d.width - w.left - w.right,
          chromosomeWidth: u,
          x: w.left,
          y: w.top
        },
        sizeLabelPosition: {
          cellHeight: v,
          height: g,
          width: d.width - w.left - w.right,
          x: w.left,
          y: w.top + B
        },
        qtlAnnotationPosition: {
          height: v,
          width: F,
          chromosomeWidth: u,
          x: w.left,
          y: w.top + B
        },
        geneAnnotationPosition: {
          height: v,
          width: F,
          x: w.left + F + u,
          y: w.top + B
        },
        longestChromosome: U,
        annotations: H,
        scale: t.scale
      };
      return o.chromosomes.length == 1 && (O.chromosomePosition.x = w.left + 0.5 * F, O.geneAnnotationPosition.x = w.left + 0.5 * F + u, O.qtlAnnotationPosition.width = F * 0.5, O.geneAnnotationPosition.width = F * 1.5, O.labelPosition.x = w.left + 0.5 * F, O.labelPosition.width = u, O.sizeLabelPosition.x = w.left + 0.5 * F, O.sizeLabelPosition.width = u), o.drawing = xe.pick(t, ["width", "height"]), o.drawing.margin = {
        top: t.margin.top * o.drawing.height,
        left: t.margin.left * o.drawing.width,
        bottom: t.margin.bottom * o.drawing.height,
        right: t.margin.right * o.drawing.width
      }, o.chromosomes.forEach(function(_, M) {
        var K = M % t.numberPerRow, z = Math.floor(M / t.numberPerRow);
        _.cell = {
          y: z * d.height + t.margin.top * t.height,
          x: K * d.width + t.margin.left * t.width,
          width: d.width,
          height: d.height
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
function Vl(A, e) {
  return A == null || e == null ? NaN : A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function hS(A, e) {
  return A == null || e == null ? NaN : e < A ? -1 : e > A ? 1 : e >= A ? 0 : NaN;
}
function e0(A) {
  let e, t, n;
  A.length !== 2 ? (e = Vl, t = (f, c) => Vl(A(f), c), n = (f, c) => A(f) - c) : (e = A === Vl || A === hS ? A : pS, t = A, n = A);
  function i(f, c, d = 0, w = f.length) {
    if (d < w) {
      if (e(c, c) !== 0) return w;
      do {
        const B = d + w >>> 1;
        t(f[B], c) < 0 ? d = B + 1 : w = B;
      } while (d < w);
    }
    return d;
  }
  function o(f, c, d = 0, w = f.length) {
    if (d < w) {
      if (e(c, c) !== 0) return w;
      do {
        const B = d + w >>> 1;
        t(f[B], c) <= 0 ? d = B + 1 : w = B;
      } while (d < w);
    }
    return d;
  }
  function l(f, c, d = 0, w = f.length) {
    const B = i(f, c, d, w - 1);
    return B > d && n(f[B - 1], c) > -n(f[B], c) ? B - 1 : B;
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
  let f, c, d;
  return i < 0 ? (d = Math.pow(10, -i) / l, f = Math.round(A * d), c = Math.round(e * d), f / d < A && ++f, c / d > e && --c, d = -d) : (d = Math.pow(10, i) * l, f = Math.round(A / d), c = Math.round(e / d), f * d < A && ++f, c * d > e && --c), c < f && 0.5 <= t && t < 2 ? oc(A, e, t * 2) : [f, c, d];
}
function CS(A, e, t) {
  if (e = +e, A = +A, t = +t, !(t > 0)) return [];
  if (A === e) return [A];
  const n = e < A, [i, o, l] = n ? oc(e, A, t) : oc(A, e, t);
  if (!(o >= i)) return [];
  const f = o - i + 1, c = new Array(f);
  if (n)
    if (l < 0) for (let d = 0; d < f; ++d) c[d] = (o - d) / -l;
    else for (let d = 0; d < f; ++d) c[d] = (o - d) * l;
  else if (l < 0) for (let d = 0; d < f; ++d) c[d] = (i + d) / -l;
  else for (let d = 0; d < f; ++d) c[d] = (i + d) * l;
  return c;
}
function Ah(A, e, t) {
  return e = +e, A = +A, t = +t, oc(A, e, t)[2];
}
function QS(A, e, t) {
  e = +e, A = +A, t = +t;
  const n = e < A, i = n ? Ah(e, A, t) : Ah(A, e, t);
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
      for (; ++o < l; ) if ((i = (A = n[o]).type) && (i = bS(t[i], A.name))) return i;
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
function bS(A, e) {
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
var eh = "http://www.w3.org/1999/xhtml";
const gw = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: eh,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Nc(A) {
  var e = A += "", t = e.indexOf(":");
  return t >= 0 && (e = A.slice(0, t)) !== "xmlns" && (A = A.slice(t + 1)), gw.hasOwnProperty(e) ? { space: gw[e], local: A } : A;
}
function ES(A) {
  return function() {
    var e = this.ownerDocument, t = this.namespaceURI;
    return t === eh && e.documentElement.namespaceURI === eh ? e.createElement(A) : e.createElementNS(t, A);
  };
}
function _S(A) {
  return function() {
    return this.ownerDocument.createElementNS(A.space, A.local);
  };
}
function t0(A) {
  var e = Nc(A);
  return (e.local ? _S : ES)(e);
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
    for (var o = e[i], l = o.length, f = n[i] = new Array(l), c, d, w = 0; w < l; ++w)
      (c = o[w]) && (d = A.call(c, c.__data__, w, o)) && ("__data__" in c && (d.__data__ = c.__data__), f[w] = d);
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
    for (var l = e[o], f = l.length, c, d = 0; d < f; ++d)
      (c = l[d]) && (n.push(A.call(c, c.__data__, d, l)), i.push(c));
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
    for (var o = e[i], l = o.length, f = n[i] = [], c, d = 0; d < l; ++d)
      (c = o[d]) && A.call(c, c.__data__, d, o) && f.push(c);
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
  for (var l = 0, f, c = e.length, d = o.length; l < d; ++l)
    (f = e[l]) ? (f.__data__ = o[l], n[l] = f) : t[l] = new sc(A, o[l]);
  for (; l < c; ++l)
    (f = e[l]) && (i[l] = f);
}
function WS(A, e, t, n, i, o, l) {
  var f, c, d = /* @__PURE__ */ new Map(), w = e.length, B = o.length, g = new Array(w), v;
  for (f = 0; f < w; ++f)
    (c = e[f]) && (g[f] = v = l.call(c, c.__data__, f, e) + "", d.has(v) ? i[f] = c : d.set(v, c));
  for (f = 0; f < B; ++f)
    v = l.call(A, o[f], f, o) + "", (c = d.get(v)) ? (n[f] = c, c.__data__ = o[f], d.delete(v)) : t[f] = new sc(A, o[f]);
  for (f = 0; f < w; ++f)
    (c = e[f]) && d.get(g[f]) === c && (i[f] = c);
}
function XS(A) {
  return A.__data__;
}
function qS(A, e) {
  if (!arguments.length) return Array.from(this, XS);
  var t = e ? WS : VS, n = this._parents, i = this._groups;
  typeof A != "function" && (A = GS(A));
  for (var o = i.length, l = new Array(o), f = new Array(o), c = new Array(o), d = 0; d < o; ++d) {
    var w = n[d], B = i[d], g = B.length, v = zS(A.call(w, w && w.__data__, d, n)), u = v.length, C = f[d] = new Array(u), F = l[d] = new Array(u), U = c[d] = new Array(g);
    t(w, B, C, F, U, v, e);
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
    for (var d = t[c], w = n[c], B = d.length, g = f[c] = new Array(B), v, u = 0; u < B; ++u)
      (v = d[u] || w[u]) && (g[u] = v);
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
    for (var l = t[o], f = l.length, c = i[o] = new Array(f), d, w = 0; w < f; ++w)
      (d = l[w]) && (c[w] = d);
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
function dL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttributeNS(A.space, A.local) : this.setAttributeNS(A.space, A.local, t);
  };
}
function hL(A, e) {
  var t = Nc(A);
  if (arguments.length < 2) {
    var n = this.node();
    return t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t);
  }
  return this.each((e == null ? t.local ? uL : sL : typeof e == "function" ? t.local ? dL : fL : t.local ? cL : lL)(t, e));
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
function bL(A, e) {
  var t = u0(A + "");
  if (arguments.length < 2) {
    for (var n = Lp(this.node()), i = -1, o = t.length; ++i < o; ) if (!n.contains(t[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? UL : e ? QL : FL)(t, e));
}
function EL() {
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
  return arguments.length ? this.each(A == null ? EL : (typeof A == "function" ? xL : _L)(A)) : this.node().textContent;
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
      for (var c = 0, d = f.length, w; c < d; ++c)
        for (i = 0, w = f[c]; i < o; ++i)
          if ((l = n[i]).type === w.type && l.name === w.name)
            return w.value;
    }
    return;
  }
  for (f = e ? jL : JL, i = 0; i < o; ++i) this.each(f(n[i], e, t));
  return this;
}
function d0(A, e, t) {
  var n = s0(A), i = n.CustomEvent;
  typeof i == "function" ? i = new i(e, t) : (i = n.document.createEvent("Event"), t ? (i.initEvent(e, t.bubbles, t.cancelable), i.detail = t.detail) : i.initEvent(e, !1, !1)), A.dispatchEvent(i);
}
function ZL(A, e) {
  return function() {
    return d0(this, A, e);
  };
}
function AT(A, e) {
  return function() {
    return d0(this, A, e.apply(this, arguments));
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
  attr: hL,
  style: wL,
  property: CL,
  classed: bL,
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
function th(A) {
  return typeof A == "string" ? new Wt([document.querySelectorAll(A)], [document.documentElement]) : new Wt([n0(A)], Tp);
}
const iT = { passive: !1 }, Is = { capture: !0, passive: !1 };
function pd(A) {
  A.stopImmediatePropagation();
}
function eo(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function h0(A) {
  var e = A.document.documentElement, t = VA(A).on("dragstart.drag", eo, Is);
  "onselectstart" in e ? t.on("selectstart.drag", eo, Is) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function p0(A, e) {
  var t = A.document.documentElement, n = VA(A).on("dragstart.drag", null);
  e && (n.on("click.drag", eo, Is), setTimeout(function() {
    n.on("click.drag", null);
  }, 0)), "onselectstart" in t ? n.on("selectstart.drag", null) : (t.style.MozUserSelect = t.__noselect, delete t.__noselect);
}
const sl = (A) => () => A;
function nh(A, {
  sourceEvent: e,
  subject: t,
  target: n,
  identifier: i,
  active: o,
  x: l,
  y: f,
  dx: c,
  dy: d,
  dispatch: w
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
    dy: { value: d, enumerable: !0, configurable: !0 },
    _: { value: w }
  });
}
nh.prototype.on = function() {
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
  var A = aT, e = oT, t = sT, n = uT, i = {}, o = Oc("start", "drag", "end"), l = 0, f, c, d, w, B = 0;
  function g(_) {
    _.on("mousedown.drag", v).filter(n).on("touchstart.drag", F).on("touchmove.drag", U, iT).on("touchend.drag touchcancel.drag", H).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(_, M) {
    if (!(w || !A.call(this, _, M))) {
      var K = O(this, e.call(this, _, M), _, M, "mouse");
      K && (VA(_.view).on("mousemove.drag", u, Is).on("mouseup.drag", C, Is), h0(_.view), pd(_), d = !1, f = _.clientX, c = _.clientY, K("start", _));
    }
  }
  function u(_) {
    if (eo(_), !d) {
      var M = _.clientX - f, K = _.clientY - c;
      d = M * M + K * K > B;
    }
    i.mouse("drag", _);
  }
  function C(_) {
    VA(_.view).on("mousemove.drag mouseup.drag", null), p0(_.view, d), eo(_), i.mouse("end", _);
  }
  function F(_, M) {
    if (A.call(this, _, M)) {
      var K = _.changedTouches, z = e.call(this, _, M), cA = K.length, sA, gA;
      for (sA = 0; sA < cA; ++sA)
        (gA = O(this, z, _, M, K[sA].identifier, K[sA])) && (pd(_), gA("start", _, K[sA]));
    }
  }
  function U(_) {
    var M = _.changedTouches, K = M.length, z, cA;
    for (z = 0; z < K; ++z)
      (cA = i[M[z].identifier]) && (eo(_), cA("drag", _, M[z]));
  }
  function H(_) {
    var M = _.changedTouches, K = M.length, z, cA;
    for (w && clearTimeout(w), w = setTimeout(function() {
      w = null;
    }, 500), z = 0; z < K; ++z)
      (cA = i[M[z].identifier]) && (pd(_), cA("end", _, M[z]));
  }
  function O(_, M, K, z, cA, sA) {
    var gA = o.copy(), FA = Gn(sA || K, M), NA, _A, W;
    if ((W = t.call(_, new nh("beforestart", {
      sourceEvent: K,
      target: g,
      identifier: cA,
      active: l,
      x: FA[0],
      y: FA[1],
      dx: 0,
      dy: 0,
      dispatch: gA
    }), z)) != null)
      return NA = W.x - FA[0] || 0, _A = W.y - FA[1] || 0, function yA(eA, fA, EA) {
        var xA = FA, iA;
        switch (eA) {
          case "start":
            i[cA] = yA, iA = l++;
            break;
          case "end":
            delete i[cA], --l;
          case "drag":
            FA = Gn(EA || fA, M), iA = l;
            break;
        }
        gA.call(
          eA,
          _,
          new nh(eA, {
            sourceEvent: fA,
            subject: W,
            target: g,
            identifier: cA,
            active: iA,
            x: FA[0] + NA,
            y: FA[1] + _A,
            dx: FA[0] - xA[0],
            dy: FA[1] - xA[1],
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
var Hs = 0.7, uc = 1 / Hs, to = "\\s*([+-]?\\d+)\\s*", Ss = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", fr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", cT = /^#([0-9a-f]{3,8})$/, fT = new RegExp(`^rgb\\(${to},${to},${to}\\)$`), dT = new RegExp(`^rgb\\(${fr},${fr},${fr}\\)$`), hT = new RegExp(`^rgba\\(${to},${to},${to},${Ss}\\)$`), pT = new RegExp(`^rgba\\(${fr},${fr},${fr},${Ss}\\)$`), gT = new RegExp(`^hsl\\(${Ss},${fr},${fr}\\)$`), BT = new RegExp(`^hsla\\(${Ss},${fr},${fr},${Ss}\\)$`), Bw = {
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
Dp(Vs, la, {
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
function la(A) {
  var e, t;
  return A = (A + "").trim().toLowerCase(), (e = cT.exec(A)) ? (t = e[1].length, e = parseInt(e[1], 16), t === 6 ? vw(e) : t === 3 ? new en(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : t === 8 ? ul(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : t === 4 ? ul(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = fT.exec(A)) ? new en(e[1], e[2], e[3], 1) : (e = dT.exec(A)) ? new en(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = hT.exec(A)) ? ul(e[1], e[2], e[3], e[4]) : (e = pT.exec(A)) ? ul(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = gT.exec(A)) ? Qw(e[1], e[2] / 100, e[3] / 100, 1) : (e = BT.exec(A)) ? Qw(e[1], e[2] / 100, e[3] / 100, e[4]) : Bw.hasOwnProperty(A) ? vw(Bw[A]) : A === "transparent" ? new en(NaN, NaN, NaN, 0) : null;
}
function vw(A) {
  return new en(A >> 16 & 255, A >> 8 & 255, A & 255, 1);
}
function ul(A, e, t, n) {
  return n <= 0 && (A = e = t = NaN), new en(A, e, t, n);
}
function vT(A) {
  return A instanceof Vs || (A = la(A)), A ? (A = A.rgb(), new en(A.r, A.g, A.b, A.opacity)) : new en();
}
function rh(A, e, t, n) {
  return arguments.length === 1 ? vT(A) : new en(A, e, t, n ?? 1);
}
function en(A, e, t, n) {
  this.r = +A, this.g = +e, this.b = +t, this.opacity = +n;
}
Dp(en, rh, g0(Vs, {
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
    return new en(na(this.r), na(this.g), na(this.b), lc(this.opacity));
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
  return `#${ea(this.r)}${ea(this.g)}${ea(this.b)}`;
}
function yT() {
  return `#${ea(this.r)}${ea(this.g)}${ea(this.b)}${ea((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Cw() {
  const A = lc(this.opacity);
  return `${A === 1 ? "rgb(" : "rgba("}${na(this.r)}, ${na(this.g)}, ${na(this.b)}${A === 1 ? ")" : `, ${A})`}`;
}
function lc(A) {
  return isNaN(A) ? 1 : Math.max(0, Math.min(1, A));
}
function na(A) {
  return Math.max(0, Math.min(255, Math.round(A) || 0));
}
function ea(A) {
  return A = na(A), (A < 16 ? "0" : "") + A.toString(16);
}
function Qw(A, e, t, n) {
  return n <= 0 ? A = e = t = NaN : t <= 0 || t >= 1 ? A = e = NaN : e <= 0 && (A = NaN), new Xn(A, e, t, n);
}
function B0(A) {
  if (A instanceof Xn) return new Xn(A.h, A.s, A.l, A.opacity);
  if (A instanceof Vs || (A = la(A)), !A) return new Xn();
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
      gd(A >= 240 ? A - 240 : A + 120, i, n),
      gd(A, i, n),
      gd(A < 120 ? A + 240 : A - 120, i, n),
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
function gd(A, e, t) {
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
    var l = t((i = rh(i)).r, (o = rh(o)).r), f = t(i.g, o.g), c = t(i.b, o.b), d = w0(i.opacity, o.opacity);
    return function(w) {
      return i.r = l(w), i.g = f(w), i.b = c(w), i.opacity = d(w), i + "";
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
function ET(A) {
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
var ih = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Bd = new RegExp(ih.source, "g");
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
  var t = ih.lastIndex = Bd.lastIndex = 0, n, i, o, l = -1, f = [], c = [];
  for (A = A + "", e = e + ""; (n = ih.exec(A)) && (i = Bd.exec(e)); )
    (o = i.index) > t && (o = e.slice(t, o), f[l] ? f[l] += o : f[++l] = o), (n = n[0]) === (i = i[0]) ? f[l] ? f[l] += i : f[++l] = i : (f[++l] = null, c.push({ i: l, x: Vn(n, i) })), t = Bd.lastIndex;
  return t < e.length && (o = e.slice(t), f[l] ? f[l] += o : f[++l] = o), f.length < 2 ? c[0] ? ST(c[0].x) : HT(e) : (e = c.length, function(d) {
    for (var w = 0, B; w < e; ++w) f[(B = c[w]).i] = B.x(d);
    return f.join("");
  });
}
function Np(A, e) {
  var t = typeof e, n;
  return e == null || t === "boolean" ? Op(e) : (t === "number" ? Vn : t === "string" ? (n = la(e)) ? (e = n, cc) : m0 : e instanceof la ? cc : e instanceof Date ? xT : ET(e) ? bT : Array.isArray(e) ? _T : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? IT : Vn)(A, e);
}
function LT(A, e) {
  return A = +A, e = +e, function(t) {
    return Math.round(A * (1 - t) + e * t);
  };
}
var Uw = 180 / Math.PI, ah = {
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
  return e.isIdentity ? ah : v0(e.a, e.b, e.c, e.d, e.e, e.f);
}
function DT(A) {
  return A == null || (cl || (cl = document.createElementNS("http://www.w3.org/2000/svg", "g")), cl.setAttribute("transform", A), !(A = cl.transform.baseVal.consolidate())) ? ah : (A = A.matrix, v0(A.a, A.b, A.c, A.d, A.e, A.f));
}
function y0(A, e, t, n) {
  function i(d) {
    return d.length ? d.pop() + " " : "";
  }
  function o(d, w, B, g, v, u) {
    if (d !== B || w !== g) {
      var C = v.push("translate(", null, e, null, t);
      u.push({ i: C - 4, x: Vn(d, B) }, { i: C - 2, x: Vn(w, g) });
    } else (B || g) && v.push("translate(" + B + e + g + t);
  }
  function l(d, w, B, g) {
    d !== w ? (d - w > 180 ? w += 360 : w - d > 180 && (d += 360), g.push({ i: B.push(i(B) + "rotate(", null, n) - 2, x: Vn(d, w) })) : w && B.push(i(B) + "rotate(" + w + n);
  }
  function f(d, w, B, g) {
    d !== w ? g.push({ i: B.push(i(B) + "skewX(", null, n) - 2, x: Vn(d, w) }) : w && B.push(i(B) + "skewX(" + w + n);
  }
  function c(d, w, B, g, v, u) {
    if (d !== B || w !== g) {
      var C = v.push(i(v) + "scale(", null, ",", null, ")");
      u.push({ i: C - 4, x: Vn(d, B) }, { i: C - 2, x: Vn(w, g) });
    } else (B !== 1 || g !== 1) && v.push(i(v) + "scale(" + B + "," + g + ")");
  }
  return function(d, w) {
    var B = [], g = [];
    return d = A(d), w = A(w), o(d.translateX, d.translateY, w.translateX, w.translateY, B, g), l(d.rotate, w.rotate, B, g), f(d.skewX, w.skewX, B, g), c(d.scaleX, d.scaleY, w.scaleX, w.scaleY, B, g), d = w = null, function(v) {
      for (var u = -1, C = g.length, F; ++u < C; ) B[(F = g[u]).i] = F.x(v);
      return B.join("");
    };
  };
}
var OT = y0(TT, "px, ", "px)", "deg)"), NT = y0(DT, ", ", ")", ")"), MT = 1e-12;
function bw(A) {
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
    var f = o[0], c = o[1], d = o[2], w = l[0], B = l[1], g = l[2], v = w - f, u = B - c, C = v * v + u * u, F, U;
    if (C < MT)
      U = Math.log(g / d) / e, F = function(z) {
        return [
          f + z * v,
          c + z * u,
          d * Math.exp(e * z * U)
        ];
      };
    else {
      var H = Math.sqrt(C), O = (g * g - d * d + n * C) / (2 * d * t * H), _ = (g * g - d * d - n * C) / (2 * g * t * H), M = Math.log(Math.sqrt(O * O + 1) - O), K = Math.log(Math.sqrt(_ * _ + 1) - _);
      U = (K - M) / e, F = function(z) {
        var cA = z * U, sA = bw(M), gA = d / (t * H) * (sA * KT(e * cA + M) - PT(M));
        return [
          f + gA * v,
          c + gA * u,
          d * sA / bw(e * cA + M)
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
var oo = 0, os = 0, Yo = 0, C0 = 1e3, fc, ss, dc = 0, ca = 0, Mc = 0, Ls = typeof performance == "object" && performance.now ? performance : Date, Q0 = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(A) {
  setTimeout(A, 17);
};
function Mp() {
  return ca || (Q0(kT), ca = Ls.now() + Mc);
}
function kT() {
  ca = 0;
}
function hc() {
  this._call = this._time = this._next = null;
}
hc.prototype = F0.prototype = {
  constructor: hc,
  restart: function(A, e, t) {
    if (typeof A != "function") throw new TypeError("callback is not a function");
    t = (t == null ? Mp() : +t) + (e == null ? 0 : +e), !this._next && ss !== this && (ss ? ss._next = this : fc = this, ss = this), this._call = A, this._time = t, oh();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, oh());
  }
};
function F0(A, e, t) {
  var n = new hc();
  return n.restart(A, e, t), n;
}
function $T() {
  Mp(), ++oo;
  for (var A = fc, e; A; )
    (e = ca - A._time) >= 0 && A._call.call(void 0, e), A = A._next;
  --oo;
}
function Ew() {
  ca = (dc = Ls.now()) + Mc, oo = os = 0;
  try {
    $T();
  } finally {
    oo = 0, VT(), ca = 0;
  }
}
function GT() {
  var A = Ls.now(), e = A - dc;
  e > C0 && (Mc -= e, dc = A);
}
function VT() {
  for (var A, e = fc, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), A = e, e = e._next) : (t = e._next, e._next = null, e = A ? A._next = t : fc = t);
  ss = A, oh(n);
}
function oh(A) {
  if (!oo) {
    os && (os = clearTimeout(os));
    var e = A - ca;
    e > 24 ? (A < 1 / 0 && (os = setTimeout(Ew, A - Ls.now() - Mc)), Yo && (Yo = clearInterval(Yo))) : (Yo || (dc = Ls.now(), Yo = setInterval(GT, C0)), oo = 1, Q0(Ew));
  }
}
function _w(A, e, t) {
  var n = new hc();
  return e = e == null ? 0 : +e, n.restart((i) => {
    n.stop(), A(i + e);
  }, e, t), n;
}
var WT = Oc("start", "end", "cancel", "interrupt"), XT = [], U0 = 0, xw = 1, sh = 2, Xl = 3, Iw = 4, uh = 5, ql = 6;
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
  function o(d) {
    t.state = xw, t.timer.restart(l, t.delay, t.time), t.delay <= d && l(d - t.delay);
  }
  function l(d) {
    var w, B, g, v;
    if (t.state !== xw) return c();
    for (w in n)
      if (v = n[w], v.name === t.name) {
        if (v.state === Xl) return _w(l);
        v.state === Iw ? (v.state = ql, v.timer.stop(), v.on.call("interrupt", A, A.__data__, v.index, v.group), delete n[w]) : +w < e && (v.state = ql, v.timer.stop(), v.on.call("cancel", A, A.__data__, v.index, v.group), delete n[w]);
      }
    if (_w(function() {
      t.state === Xl && (t.state = Iw, t.timer.restart(f, t.delay, t.time), f(d));
    }), t.state = sh, t.on.call("start", A, A.__data__, t.index, t.group), t.state === sh) {
      for (t.state = Xl, i = new Array(g = t.tween.length), w = 0, B = -1; w < g; ++w)
        (v = t.tween[w].value.call(A, A.__data__, t.index, t.group)) && (i[++B] = v);
      i.length = B + 1;
    }
  }
  function f(d) {
    for (var w = d < t.duration ? t.ease.call(null, d / t.duration) : (t.timer.restart(c), t.state = uh, 1), B = -1, g = i.length; ++B < g; )
      i[B].call(A, w);
    t.state === uh && (t.on.call("end", A, A.__data__, t.index, t.group), c());
  }
  function c() {
    t.state = ql, t.timer.stop(), delete n[e];
    for (var d in n) return;
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
      i = n.state > sh && n.state < uh, n.state = ql, n.timer.stop(), n.on.call(i ? "interrupt" : "cancel", A, A.__data__, n.index, n.group), delete t[l];
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
      for (var f = { name: e, value: t }, c = 0, d = i.length; c < d; ++c)
        if (i[c].name === e) {
          i[c] = f;
          break;
        }
      c === d && i.push(f);
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
function b0(A, e) {
  var t;
  return (typeof e == "number" ? Vn : e instanceof la ? cc : (t = la(e)) ? (e = t, cc) : m0)(A, e);
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
  var t = Nc(A), n = t === "transform" ? NT : b0;
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
function dD(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? cD : fD)(e, A)) : zn(this.node(), e).delay;
}
function hD(A, e) {
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
  return arguments.length ? this.each((typeof A == "function" ? hD : pD)(e, A)) : zn(this.node(), e).duration;
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
    for (var o = e[i], l = o.length, f = n[i] = [], c, d = 0; d < l; ++d)
      (c = o[d]) && A.call(c, c.__data__, d, o) && f.push(c);
  return new Vr(n, this._parents, this._name, this._id);
}
function CD(A) {
  if (A._id !== this._id) throw new Error();
  for (var e = this._groups, t = A._groups, n = e.length, i = t.length, o = Math.min(n, i), l = new Array(n), f = 0; f < o; ++f)
    for (var c = e[f], d = t[f], w = c.length, B = l[f] = new Array(w), g, v = 0; v < w; ++v)
      (g = c[v] || d[v]) && (B[v] = g);
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
function bD(A) {
  return function() {
    var e = this.parentNode;
    for (var t in this.__transition) if (+t !== A) return;
    e && e.removeChild(this);
  };
}
function ED() {
  return this.on("end.remove", bD(this._id));
}
function _D(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Sp(A));
  for (var n = this._groups, i = n.length, o = new Array(i), l = 0; l < i; ++l)
    for (var f = n[l], c = f.length, d = o[l] = new Array(c), w, B, g = 0; g < c; ++g)
      (w = f[g]) && (B = A.call(w, w.__data__, g, f)) && ("__data__" in w && (B.__data__ = w.__data__), d[g] = B, Pc(d[g], e, t, g, d, zn(w, t)));
  return new Vr(o, this._parents, e, t);
}
function xD(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = r0(A));
  for (var n = this._groups, i = n.length, o = [], l = [], f = 0; f < i; ++f)
    for (var c = n[f], d = c.length, w, B = 0; B < d; ++B)
      if (w = c[B]) {
        for (var g = A.call(w, w.__data__, B, c), v, u = zn(w, t), C = 0, F = g.length; C < F; ++C)
          (v = g[C]) && Pc(v, e, t, C, g, u);
        o.push(g), l.push(w);
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
function E0(A) {
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
    var c = gr(this, A), d = c.on, w = c.value[o] == null ? f || (f = E0(e)) : void 0;
    (d !== t || i !== w) && (n = (t = d).copy()).on(l, i = w), c.on = n;
  };
}
function OD(A, e, t) {
  var n = (A += "") == "transform" ? OT : b0;
  return e == null ? this.styleTween(A, SD(A, n)).on("end.style." + A, E0(A)) : typeof e == "function" ? this.styleTween(A, TD(A, n, Kp(this, "style." + A, e))).each(DD(this._id, A)) : this.styleTween(A, LD(A, n, e), t).on("end.style." + A, null);
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
    for (var l = n[o], f = l.length, c, d = 0; d < f; ++d)
      if (c = l[d]) {
        var w = zn(c, e);
        Pc(c, A, t, d, l, {
          time: w.time + w.delay + w.duration,
          delay: 0,
          duration: w.duration,
          ease: w.ease
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
      var d = gr(this, n), w = d.on;
      w !== A && (e = (A = w).copy(), e._.cancel.push(f), e._.interrupt.push(f), e._.end.push(c)), d.on = e;
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
  remove: ED,
  tween: YT,
  delay: dD,
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
    for (var l = n[o], f = l.length, c, d = 0; d < f; ++d)
      (c = l[d]) && Pc(c, A, e, d, l, t || jD(c, e));
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
  function d(B) {
    B = gc(B);
    var g = B.fill, v = B.align, u = B.sign, C = B.symbol, F = B.zero, U = B.width, H = B.comma, O = B.precision, _ = B.trim, M = B.type;
    M === "n" ? (H = !0, M = "g") : Sw[M] || (O === void 0 && (O = 12), _ = !0, M = "g"), (F || g === "0" && v === "=") && (F = !0, g = "0", v = "=");
    var K = C === "$" ? t : C === "#" && /[boxX]/.test(M) ? "0" + M.toLowerCase() : "", z = C === "$" ? n : /[%p]/.test(M) ? l : "", cA = Sw[M], sA = /[defgprs%]/.test(M);
    O = O === void 0 ? 6 : /[gprs]/.test(M) ? Math.max(1, Math.min(21, O)) : Math.max(0, Math.min(20, O));
    function gA(FA) {
      var NA = K, _A = z, W, yA, eA;
      if (M === "c")
        _A = cA(FA) + _A, FA = "";
      else {
        FA = +FA;
        var fA = FA < 0 || 1 / FA < 0;
        if (FA = isNaN(FA) ? c : cA(Math.abs(FA), O), _ && (FA = nO(FA)), fA && +FA == 0 && u !== "+" && (fA = !1), NA = (fA ? u === "(" ? u : f : u === "-" || u === "(" ? "" : u) + NA, _A = (M === "s" ? Dw[8 + x0 / 3] : "") + _A + (fA && u === "(" ? ")" : ""), sA) {
          for (W = -1, yA = FA.length; ++W < yA; )
            if (eA = FA.charCodeAt(W), 48 > eA || eA > 57) {
              _A = (eA === 46 ? i + FA.slice(W + 1) : FA.slice(W)) + _A, FA = FA.slice(0, W);
              break;
            }
        }
      }
      H && !F && (FA = e(FA, 1 / 0));
      var EA = NA.length + FA.length + _A.length, xA = EA < U ? new Array(U - EA + 1).join(g) : "";
      switch (H && F && (FA = e(xA + FA, xA.length ? U - _A.length : 1 / 0), xA = ""), v) {
        case "<":
          FA = NA + FA + _A + xA;
          break;
        case "=":
          FA = NA + xA + FA + _A;
          break;
        case "^":
          FA = xA.slice(0, EA = xA.length >> 1) + NA + FA + _A + xA.slice(EA);
          break;
        default:
          FA = xA + NA + FA + _A;
          break;
      }
      return o(FA);
    }
    return gA.toString = function() {
      return B + "";
    }, gA;
  }
  function w(B, g) {
    var v = d((B = gc(B), B.type = "f", B)), u = Math.max(-8, Math.min(8, Math.floor(so(g) / 3))) * 3, C = Math.pow(10, -u), F = Dw[8 + u / 3];
    return function(U) {
      return v(C * U) + F;
    };
  }
  return {
    format: d,
    formatPrefix: w
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
function ja(A) {
  return A;
}
function lh(A, e) {
  return (e -= A = +A) ? function(t) {
    return (t - A) / e;
  } : cO(isNaN(e) ? NaN : 0.5);
}
function dO(A, e) {
  var t;
  return A > e && (t = A, A = e, e = t), function(n) {
    return Math.max(A, Math.min(e, n));
  };
}
function hO(A, e, t) {
  var n = A[0], i = A[1], o = e[0], l = e[1];
  return i < n ? (n = lh(i, n), o = t(l, o)) : (n = lh(n, i), o = t(o, l)), function(f) {
    return o(n(f));
  };
}
function pO(A, e, t) {
  var n = Math.min(A.length, e.length) - 1, i = new Array(n), o = new Array(n), l = -1;
  for (A[n] < A[0] && (A = A.slice().reverse(), e = e.slice().reverse()); ++l < n; )
    i[l] = lh(A[l], A[l + 1]), o[l] = t(e[l], e[l + 1]);
  return function(f) {
    var c = wS(A, f, 1, n) - 1;
    return o[c](i[c](f));
  };
}
function gO(A, e) {
  return e.domain(A.domain()).range(A.range()).interpolate(A.interpolate()).clamp(A.clamp()).unknown(A.unknown());
}
function BO() {
  var A = Ow, e = Ow, t = Np, n, i, o, l = ja, f, c, d;
  function w() {
    var g = Math.min(A.length, e.length);
    return l !== ja && (l = dO(A[0], A[g - 1])), f = g > 2 ? pO : hO, c = d = null, B;
  }
  function B(g) {
    return g == null || isNaN(g = +g) ? o : (c || (c = f(A.map(n), e, t)))(n(l(g)));
  }
  return B.invert = function(g) {
    return l(i((d || (d = f(e, A.map(n), Vn)))(g)));
  }, B.domain = function(g) {
    return arguments.length ? (A = Array.from(g, fO), w()) : A.slice();
  }, B.range = function(g) {
    return arguments.length ? (e = Array.from(g), w()) : e.slice();
  }, B.rangeRound = function(g) {
    return e = Array.from(g), t = LT, w();
  }, B.clamp = function(g) {
    return arguments.length ? (l = g ? !0 : ja, w()) : l !== ja;
  }, B.interpolate = function(g) {
    return arguments.length ? (t = g, w()) : t;
  }, B.unknown = function(g) {
    return arguments.length ? (o = g, B) : o;
  }, function(g, v) {
    return n = g, i = v, w();
  };
}
function wO() {
  return BO()(ja, ja);
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
    var n = e(), i = 0, o = n.length - 1, l = n[i], f = n[o], c, d, w = 10;
    for (f < l && (d = l, l = f, f = d, d = i, i = o, o = d); w-- > 0; ) {
      if (d = Ah(l, f, t), d === c)
        return n[i] = l, n[o] = f, e(n);
      if (d > 0)
        l = Math.floor(l / d) * d, f = Math.ceil(f / d) * d;
      else if (d < 0)
        l = Math.ceil(l * d) / d, f = Math.floor(f * d) / d;
      else
        break;
      c = d;
    }
    return A;
  }, A;
}
function da() {
  var A = wO();
  return A.copy = function() {
    return gO(A, da());
  }, lO.apply(A, arguments), vO(A);
}
const dl = (A) => () => A;
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
qi.prototype = Kr.prototype;
function qi(A) {
  for (; !A.__zoom; ) if (!(A = A.parentNode)) return kp;
  return A.__zoom;
}
function wd(A) {
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
function bO(A, e, t) {
  var n = A.invertX(e[0][0]) - t[0][0], i = A.invertX(e[1][0]) - t[1][0], o = A.invertY(e[0][1]) - t[0][1], l = A.invertY(e[1][1]) - t[1][1];
  return A.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    l > o ? (o + l) / 2 : Math.min(0, o) || Math.max(0, l)
  );
}
function EO() {
  var A = CO, e = QO, t = bO, n = FO, i = UO, o = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], f = 250, c = RT, d = Oc("start", "zoom", "end"), w, B, g, v = 500, u = 150, C = 0, F = 10;
  function U(W) {
    W.property("__zoom", Nw).on("wheel.zoom", cA, { passive: !1 }).on("mousedown.zoom", sA).on("dblclick.zoom", gA).filter(i).on("touchstart.zoom", FA).on("touchmove.zoom", NA).on("touchend.zoom touchcancel.zoom", _A).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  U.transform = function(W, yA, eA, fA) {
    var EA = W.selection ? W.selection() : W;
    EA.property("__zoom", Nw), W !== EA ? M(W, yA, eA, fA) : EA.interrupt().each(function() {
      K(this, arguments).event(fA).start().zoom(null, typeof yA == "function" ? yA.apply(this, arguments) : yA).end();
    });
  }, U.scaleBy = function(W, yA, eA, fA) {
    U.scaleTo(W, function() {
      var EA = this.__zoom.k, xA = typeof yA == "function" ? yA.apply(this, arguments) : yA;
      return EA * xA;
    }, eA, fA);
  }, U.scaleTo = function(W, yA, eA, fA) {
    U.transform(W, function() {
      var EA = e.apply(this, arguments), xA = this.__zoom, iA = eA == null ? _(EA) : typeof eA == "function" ? eA.apply(this, arguments) : eA, T = xA.invert(iA), AA = typeof yA == "function" ? yA.apply(this, arguments) : yA;
      return t(O(H(xA, AA), iA, T), EA, l);
    }, eA, fA);
  }, U.translateBy = function(W, yA, eA, fA) {
    U.transform(W, function() {
      return t(this.__zoom.translate(
        typeof yA == "function" ? yA.apply(this, arguments) : yA,
        typeof eA == "function" ? eA.apply(this, arguments) : eA
      ), e.apply(this, arguments), l);
    }, null, fA);
  }, U.translateTo = function(W, yA, eA, fA, EA) {
    U.transform(W, function() {
      var xA = e.apply(this, arguments), iA = this.__zoom, T = fA == null ? _(xA) : typeof fA == "function" ? fA.apply(this, arguments) : fA;
      return t(kp.translate(T[0], T[1]).scale(iA.k).translate(
        typeof yA == "function" ? -yA.apply(this, arguments) : -yA,
        typeof eA == "function" ? -eA.apply(this, arguments) : -eA
      ), xA, l);
    }, fA, EA);
  };
  function H(W, yA) {
    return yA = Math.max(o[0], Math.min(o[1], yA)), yA === W.k ? W : new Kr(yA, W.x, W.y);
  }
  function O(W, yA, eA) {
    var fA = yA[0] - eA[0] * W.k, EA = yA[1] - eA[1] * W.k;
    return fA === W.x && EA === W.y ? W : new Kr(W.k, fA, EA);
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
      var EA = this, xA = arguments, iA = K(EA, xA).event(fA), T = e.apply(EA, xA), AA = eA == null ? _(T) : typeof eA == "function" ? eA.apply(EA, xA) : eA, J = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), L = EA.__zoom, R = typeof yA == "function" ? yA.apply(EA, xA) : yA, nA = c(L.invert(AA).concat(J / L.k), R.invert(AA).concat(J / R.k));
      return function(QA) {
        if (QA === 1) QA = R;
        else {
          var UA = nA(QA), qA = J / UA[2];
          QA = new Kr(qA, AA[0] - UA[0] * qA, AA[1] - UA[1] * qA);
        }
        iA.zoom(null, QA);
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
      d.call(
        W,
        this.that,
        new yO(W, {
          sourceEvent: this.sourceEvent,
          target: U,
          type: W,
          transform: this.that.__zoom,
          dispatch: d
        }),
        yA
      );
    }
  };
  function cA(W, ...yA) {
    if (!A.apply(this, arguments)) return;
    var eA = K(this, yA).event(W), fA = this.__zoom, EA = Math.max(o[0], Math.min(o[1], fA.k * Math.pow(2, n.apply(this, arguments)))), xA = Gn(W);
    if (eA.wheel)
      (eA.mouse[0][0] !== xA[0] || eA.mouse[0][1] !== xA[1]) && (eA.mouse[1] = fA.invert(eA.mouse[0] = xA)), clearTimeout(eA.wheel);
    else {
      if (fA.k === EA) return;
      eA.mouse = [xA, fA.invert(xA)], zl(this), eA.start();
    }
    Zo(W), eA.wheel = setTimeout(iA, u), eA.zoom("mouse", t(O(H(fA, EA), eA.mouse[0], eA.mouse[1]), eA.extent, l));
    function iA() {
      eA.wheel = null, eA.end();
    }
  }
  function sA(W, ...yA) {
    if (g || !A.apply(this, arguments)) return;
    var eA = W.currentTarget, fA = K(this, yA, !0).event(W), EA = VA(W.view).on("mousemove.zoom", AA, !0).on("mouseup.zoom", J, !0), xA = Gn(W, eA), iA = W.clientX, T = W.clientY;
    h0(W.view), wd(W), fA.mouse = [xA, this.__zoom.invert(xA)], zl(this), fA.start();
    function AA(L) {
      if (Zo(L), !fA.moved) {
        var R = L.clientX - iA, nA = L.clientY - T;
        fA.moved = R * R + nA * nA > C;
      }
      fA.event(L).zoom("mouse", t(O(fA.that.__zoom, fA.mouse[0] = Gn(L, eA), fA.mouse[1]), fA.extent, l));
    }
    function J(L) {
      EA.on("mousemove.zoom mouseup.zoom", null), p0(L.view, fA.moved), Zo(L), fA.event(L).end();
    }
  }
  function gA(W, ...yA) {
    if (A.apply(this, arguments)) {
      var eA = this.__zoom, fA = Gn(W.changedTouches ? W.changedTouches[0] : W, this), EA = eA.invert(fA), xA = eA.k * (W.shiftKey ? 0.5 : 2), iA = t(O(H(eA, xA), fA, EA), e.apply(this, yA), l);
      Zo(W), f > 0 ? VA(this).transition().duration(f).call(M, iA, fA, W) : VA(this).call(U.transform, iA, fA, W);
    }
  }
  function FA(W, ...yA) {
    if (A.apply(this, arguments)) {
      var eA = W.touches, fA = eA.length, EA = K(this, yA, W.changedTouches.length === fA).event(W), xA, iA, T, AA;
      for (wd(W), iA = 0; iA < fA; ++iA)
        T = eA[iA], AA = Gn(T, this), AA = [AA, this.__zoom.invert(AA), T.identifier], EA.touch0 ? !EA.touch1 && EA.touch0[2] !== AA[2] && (EA.touch1 = AA, EA.taps = 0) : (EA.touch0 = AA, xA = !0, EA.taps = 1 + !!w);
      w && (w = clearTimeout(w)), xA && (EA.taps < 2 && (B = AA[0], w = setTimeout(function() {
        w = null;
      }, v)), zl(this), EA.start());
    }
  }
  function NA(W, ...yA) {
    if (this.__zooming) {
      var eA = K(this, yA).event(W), fA = W.changedTouches, EA = fA.length, xA, iA, T, AA;
      for (Zo(W), xA = 0; xA < EA; ++xA)
        iA = fA[xA], T = Gn(iA, this), eA.touch0 && eA.touch0[2] === iA.identifier ? eA.touch0[0] = T : eA.touch1 && eA.touch1[2] === iA.identifier && (eA.touch1[0] = T);
      if (iA = eA.that.__zoom, eA.touch1) {
        var J = eA.touch0[0], L = eA.touch0[1], R = eA.touch1[0], nA = eA.touch1[1], QA = (QA = R[0] - J[0]) * QA + (QA = R[1] - J[1]) * QA, UA = (UA = nA[0] - L[0]) * UA + (UA = nA[1] - L[1]) * UA;
        iA = H(iA, Math.sqrt(QA / UA)), T = [(J[0] + R[0]) / 2, (J[1] + R[1]) / 2], AA = [(L[0] + nA[0]) / 2, (L[1] + nA[1]) / 2];
      } else if (eA.touch0) T = eA.touch0[0], AA = eA.touch0[1];
      else return;
      eA.zoom("touch", t(O(iA, T, AA), eA.extent, l));
    }
  }
  function _A(W, ...yA) {
    if (this.__zooming) {
      var eA = K(this, yA).event(W), fA = W.changedTouches, EA = fA.length, xA, iA;
      for (wd(W), g && clearTimeout(g), g = setTimeout(function() {
        g = null;
      }, v), xA = 0; xA < EA; ++xA)
        iA = fA[xA], eA.touch0 && eA.touch0[2] === iA.identifier ? delete eA.touch0 : eA.touch1 && eA.touch1[2] === iA.identifier && delete eA.touch1;
      if (eA.touch1 && !eA.touch0 && (eA.touch0 = eA.touch1, delete eA.touch1), eA.touch0) eA.touch0[1] = this.__zoom.invert(eA.touch0[0]);
      else if (eA.end(), eA.taps === 2 && (iA = Gn(iA, this), Math.hypot(B[0] - iA[0], B[1] - iA[1]) < F)) {
        var T = VA(this).on("dblclick.zoom");
        T && T.apply(this, arguments);
      }
    }
  }
  return U.wheelDelta = function(W) {
    return arguments.length ? (n = typeof W == "function" ? W : dl(+W), U) : n;
  }, U.filter = function(W) {
    return arguments.length ? (A = typeof W == "function" ? W : dl(!!W), U) : A;
  }, U.touchable = function(W) {
    return arguments.length ? (i = typeof W == "function" ? W : dl(!!W), U) : i;
  }, U.extent = function(W) {
    return arguments.length ? (e = typeof W == "function" ? W : dl([[+W[0][0], +W[0][1]], [+W[1][0], +W[1][1]]]), U) : e;
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
    var W = d.on.apply(d, arguments);
    return W === d ? U : W;
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
  })(typeof window < "u" ? window : Ji, function(e, t) {
    var n = [], i = e.document, o = n.slice, l = n.concat, f = n.push, c = n.indexOf, d = {}, w = d.toString, B = d.hasOwnProperty, g = {}, v = "1.12.4", u = function(s, h) {
      return new u.fn.init(s, h);
    }, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, F = /^-ms-/, U = /-([\da-z])/gi, H = function(s, h) {
      return h.toUpperCase();
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
        var h = u.merge(this.constructor(), s);
        return h.prevObject = this, h.context = this.context, h;
      },
      // Execute a callback for every element in the matched set.
      each: function(s) {
        return u.each(this, s);
      },
      map: function(s) {
        return this.pushStack(u.map(this, function(h, m) {
          return s.call(h, m, h);
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
        var h = this.length, m = +s + (s < 0 ? h : 0);
        return this.pushStack(m >= 0 && m < h ? [this[m]] : []);
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
      var s, h, m, y, b, E, I = arguments[0] || {}, P = 1, V = arguments.length, X = !1;
      for (typeof I == "boolean" && (X = I, I = arguments[P] || {}, P++), typeof I != "object" && !u.isFunction(I) && (I = {}), P === V && (I = this, P--); P < V; P++)
        if ((b = arguments[P]) != null)
          for (y in b)
            s = I[y], m = b[y], I !== m && (X && m && (u.isPlainObject(m) || (h = u.isArray(m))) ? (h ? (h = !1, E = s && u.isArray(s) ? s : []) : E = s && u.isPlainObject(s) ? s : {}, I[y] = u.extend(X, E, m)) : m !== void 0 && (I[y] = m));
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
        var h = s && s.toString();
        return !u.isArray(s) && h - parseFloat(h) + 1 >= 0;
      },
      isEmptyObject: function(s) {
        var h;
        for (h in s)
          return !1;
        return !0;
      },
      isPlainObject: function(s) {
        var h;
        if (!s || u.type(s) !== "object" || s.nodeType || u.isWindow(s))
          return !1;
        try {
          if (s.constructor && !B.call(s, "constructor") && !B.call(s.constructor.prototype, "isPrototypeOf"))
            return !1;
        } catch {
          return !1;
        }
        if (!g.ownFirst)
          for (h in s)
            return B.call(s, h);
        for (h in s)
          ;
        return h === void 0 || B.call(s, h);
      },
      type: function(s) {
        return s == null ? s + "" : typeof s == "object" || typeof s == "function" ? d[w.call(s)] || "object" : typeof s;
      },
      // Workarounds based on findings by Jim Driscoll
      // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
      globalEval: function(s) {
        s && u.trim(s) && (e.execScript || function(h) {
          e.eval.call(e, h);
        })(s);
      },
      // Convert dashed to camelCase; used by the css and data modules
      // Microsoft forgot to hump their vendor prefix (#9572)
      camelCase: function(s) {
        return s.replace(F, "ms-").replace(U, H);
      },
      nodeName: function(s, h) {
        return s.nodeName && s.nodeName.toLowerCase() === h.toLowerCase();
      },
      each: function(s, h) {
        var m, y = 0;
        if (O(s))
          for (m = s.length; y < m && h.call(s[y], y, s[y]) !== !1; y++)
            ;
        else
          for (y in s)
            if (h.call(s[y], y, s[y]) === !1)
              break;
        return s;
      },
      // Support: Android<4.1, IE<9
      trim: function(s) {
        return s == null ? "" : (s + "").replace(C, "");
      },
      // results is for internal usage only
      makeArray: function(s, h) {
        var m = h || [];
        return s != null && (O(Object(s)) ? u.merge(
          m,
          typeof s == "string" ? [s] : s
        ) : f.call(m, s)), m;
      },
      inArray: function(s, h, m) {
        var y;
        if (h) {
          if (c)
            return c.call(h, s, m);
          for (y = h.length, m = m ? m < 0 ? Math.max(0, y + m) : m : 0; m < y; m++)
            if (m in h && h[m] === s)
              return m;
        }
        return -1;
      },
      merge: function(s, h) {
        for (var m = +h.length, y = 0, b = s.length; y < m; )
          s[b++] = h[y++];
        if (m !== m)
          for (; h[y] !== void 0; )
            s[b++] = h[y++];
        return s.length = b, s;
      },
      grep: function(s, h, m) {
        for (var y, b = [], E = 0, I = s.length, P = !m; E < I; E++)
          y = !h(s[E], E), y !== P && b.push(s[E]);
        return b;
      },
      // arg is for internal usage only
      map: function(s, h, m) {
        var y, b, E = 0, I = [];
        if (O(s))
          for (y = s.length; E < y; E++)
            b = h(s[E], E, m), b != null && I.push(b);
        else
          for (E in s)
            b = h(s[E], E, m), b != null && I.push(b);
        return l.apply([], I);
      },
      // A global GUID counter for objects
      guid: 1,
      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function(s, h) {
        var m, y, b;
        if (typeof h == "string" && (b = s[h], h = s, s = b), !!u.isFunction(s))
          return m = o.call(arguments, 2), y = function() {
            return s.apply(h || this, m.concat(o.call(arguments)));
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
      function(s, h) {
        d["[object " + h + "]"] = h.toLowerCase();
      }
    );
    function O(s) {
      var h = !!s && "length" in s && s.length, m = u.type(s);
      return m === "function" || u.isWindow(s) ? !1 : m === "array" || h === 0 || typeof h == "number" && h > 0 && h - 1 in s;
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
        var h, m, y, b, E, I, P, V, X, Z, mA, HA, vA, ie, YA, ue, pt, Je, Zn, KA = "sizzle" + 1 * /* @__PURE__ */ new Date(), ct = s.document, le = 0, qe = 0, Sn = j(), ba = j(), Ht = j(), Ln = function(N, $) {
          return N === $ && (mA = !0), 0;
        }, Ar = 1 << 31, Tn = {}.hasOwnProperty, Ke = [], St = Ke.pop, Oi = Ke.push, Dn = Ke.push, So = Ke.slice, Fr = function(N, $) {
          for (var q = 0, uA = N.length; q < uA; q++)
            if (N[q] === $)
              return q;
          return -1;
        }, Lo = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", De = "[\\x20\\t\\r\\n\\f]", Ur = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", Uu = "\\[" + De + "*(" + Ur + ")(?:" + De + // Operator (capture 2)
        "*([*^$|!~]?=)" + De + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Ur + "))|)" + De + "*\\]", er = ":(" + Ur + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Uu + ")*)|.*)\\)|)", df = new RegExp(De + "+", "g"), Ea = new RegExp("^" + De + "+|((?:^|[^\\\\])(?:\\\\.)*)" + De + "+$", "g"), To = new RegExp("^" + De + "*," + De + "*"), bu = new RegExp("^" + De + "*([>+~]|" + De + ")" + De + "*"), tr = new RegExp("=" + De + `*([^\\]'"]*?)` + De + "*\\]", "g"), _a = new RegExp(er), Eu = new RegExp("^" + Ur + "$"), xa = {
          ID: new RegExp("^#(" + Ur + ")"),
          CLASS: new RegExp("^\\.(" + Ur + ")"),
          TAG: new RegExp("^(" + Ur + "|[*])"),
          ATTR: new RegExp("^" + Uu),
          PSEUDO: new RegExp("^" + er),
          CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + De + "*(even|odd|(([+-]|)(\\d*)n|)" + De + "*(?:([+-]|)" + De + "*(\\d+)|))" + De + "*\\)|)", "i"),
          bool: new RegExp("^(?:" + Lo + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + De + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + De + "*((?:-\\d)?\\d*)" + De + "*\\)|)(?=[^-]|$)", "i")
        }, hf = /^(?:input|select|textarea|button)$/i, ri = /^h\d$/i, vt = /^[^{]+\{\s*\[native \w/, _u = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Do = /[+~]/, pf = /'|\\/g, On = new RegExp("\\\\([\\da-f]{1,6}" + De + "?|(" + De + ")|.)", "ig"), Nn = function(N, $, q) {
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
            Ke = So.call(ct.childNodes),
            ct.childNodes
          ), Ke[ct.childNodes.length].nodeType;
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
        function Ie(N, $, q, uA) {
          var tA, BA, dA, IA, $A, re, GA, ZA, de = $ && $.ownerDocument, Te = $ ? $.nodeType : 9;
          if (q = q || [], typeof N != "string" || !N || Te !== 1 && Te !== 9 && Te !== 11)
            return q;
          if (!uA && (($ ? $.ownerDocument || $ : ct) !== vA && HA($), $ = $ || vA, YA)) {
            if (Te !== 11 && (re = _u.exec(N)))
              if (tA = re[1]) {
                if (Te === 9)
                  if (dA = $.getElementById(tA)) {
                    if (dA.id === tA)
                      return q.push(dA), q;
                  } else
                    return q;
                else if (de && (dA = de.getElementById(tA)) && Zn($, dA) && dA.id === tA)
                  return q.push(dA), q;
              } else {
                if (re[2])
                  return Dn.apply(q, $.getElementsByTagName(N)), q;
                if ((tA = re[3]) && m.getElementsByClassName && $.getElementsByClassName)
                  return Dn.apply(q, $.getElementsByClassName(tA)), q;
              }
            if (m.qsa && !Ht[N + " "] && (!ue || !ue.test(N))) {
              if (Te !== 1)
                de = $, ZA = N;
              else if ($.nodeName.toLowerCase() !== "object") {
                for ((IA = $.getAttribute("id")) ? IA = IA.replace(pf, "\\$&") : $.setAttribute("id", IA = KA), GA = I(N), BA = GA.length, $A = Eu.test(IA) ? "#" + IA : "[id='" + IA + "']"; BA--; )
                  GA[BA] = $A + " " + yt(GA[BA]);
                ZA = GA.join(","), de = Do.test(N) && Ni($.parentNode) || $;
              }
              if (ZA)
                try {
                  return Dn.apply(
                    q,
                    de.querySelectorAll(ZA)
                  ), q;
                } catch {
                } finally {
                  IA === KA && $.removeAttribute("id");
                }
            }
          }
          return V(N.replace(Ea, "$1"), $, q, uA);
        }
        function j() {
          var N = [];
          function $(q, uA) {
            return N.push(q + " ") > y.cacheLength && delete $[N.shift()], $[q + " "] = uA;
          }
          return $;
        }
        function oA(N) {
          return N[KA] = !0, N;
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
        function OA(N, $) {
          for (var q = N.split("|"), uA = q.length; uA--; )
            y.attrHandle[q[uA]] = $;
        }
        function ae(N, $) {
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
        function He(N) {
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
        function Ee(N) {
          return oA(function($) {
            return $ = +$, oA(function(q, uA) {
              for (var tA, BA = N([], q.length, $), dA = BA.length; dA--; )
                q[tA = BA[dA]] && (q[tA] = !(uA[tA] = q[tA]));
            });
          });
        }
        function Ni(N) {
          return N && typeof N.getElementsByTagName < "u" && N;
        }
        m = Ie.support = {}, E = Ie.isXML = function(N) {
          var $ = N && (N.ownerDocument || N).documentElement;
          return $ ? $.nodeName !== "HTML" : !1;
        }, HA = Ie.setDocument = function(N) {
          var $, q, uA = N ? N.ownerDocument || N : ct;
          return uA === vA || uA.nodeType !== 9 || !uA.documentElement || (vA = uA, ie = vA.documentElement, YA = !E(vA), (q = vA.defaultView) && q.top !== q && (q.addEventListener ? q.addEventListener("unload", xu, !1) : q.attachEvent && q.attachEvent("onunload", xu)), m.attributes = rA(function(tA) {
            return tA.className = "i", !tA.getAttribute("className");
          }), m.getElementsByTagName = rA(function(tA) {
            return tA.appendChild(vA.createComment("")), !tA.getElementsByTagName("*").length;
          }), m.getElementsByClassName = vt.test(vA.getElementsByClassName), m.getById = rA(function(tA) {
            return ie.appendChild(tA).id = KA, !vA.getElementsByName || !vA.getElementsByName(KA).length;
          }), m.getById ? (y.find.ID = function(tA, BA) {
            if (typeof BA.getElementById < "u" && YA) {
              var dA = BA.getElementById(tA);
              return dA ? [dA] : [];
            }
          }, y.filter.ID = function(tA) {
            var BA = tA.replace(On, Nn);
            return function(dA) {
              return dA.getAttribute("id") === BA;
            };
          }) : (delete y.find.ID, y.filter.ID = function(tA) {
            var BA = tA.replace(On, Nn);
            return function(dA) {
              var IA = typeof dA.getAttributeNode < "u" && dA.getAttributeNode("id");
              return IA && IA.value === BA;
            };
          }), y.find.TAG = m.getElementsByTagName ? function(tA, BA) {
            if (typeof BA.getElementsByTagName < "u")
              return BA.getElementsByTagName(tA);
            if (m.qsa)
              return BA.querySelectorAll(tA);
          } : function(tA, BA) {
            var dA, IA = [], $A = 0, re = BA.getElementsByTagName(tA);
            if (tA === "*") {
              for (; dA = re[$A++]; )
                dA.nodeType === 1 && IA.push(dA);
              return IA;
            }
            return re;
          }, y.find.CLASS = m.getElementsByClassName && function(tA, BA) {
            if (typeof BA.getElementsByClassName < "u" && YA)
              return BA.getElementsByClassName(tA);
          }, pt = [], ue = [], (m.qsa = vt.test(vA.querySelectorAll)) && (rA(function(tA) {
            ie.appendChild(tA).innerHTML = "<a id='" + KA + "'></a><select id='" + KA + "-\r\\' msallowcapture=''><option selected=''></option></select>", tA.querySelectorAll("[msallowcapture^='']").length && ue.push("[*^$]=" + De + `*(?:''|"")`), tA.querySelectorAll("[selected]").length || ue.push("\\[" + De + "*(?:value|" + Lo + ")"), tA.querySelectorAll("[id~=" + KA + "-]").length || ue.push("~="), tA.querySelectorAll(":checked").length || ue.push(":checked"), tA.querySelectorAll("a#" + KA + "+*").length || ue.push(".#.+[+~]");
          }), rA(function(tA) {
            var BA = vA.createElement("input");
            BA.setAttribute("type", "hidden"), tA.appendChild(BA).setAttribute("name", "D"), tA.querySelectorAll("[name=d]").length && ue.push("name" + De + "*[*^$|!~]?="), tA.querySelectorAll(":enabled").length || ue.push(":enabled", ":disabled"), tA.querySelectorAll("*,:x"), ue.push(",.*:");
          })), (m.matchesSelector = vt.test(Je = ie.matches || ie.webkitMatchesSelector || ie.mozMatchesSelector || ie.oMatchesSelector || ie.msMatchesSelector)) && rA(function(tA) {
            m.disconnectedMatch = Je.call(tA, "div"), Je.call(tA, "[s!='']:x"), pt.push("!=", er);
          }), ue = ue.length && new RegExp(ue.join("|")), pt = pt.length && new RegExp(pt.join("|")), $ = vt.test(ie.compareDocumentPosition), Zn = $ || vt.test(ie.contains) ? function(tA, BA) {
            var dA = tA.nodeType === 9 ? tA.documentElement : tA, IA = BA && BA.parentNode;
            return tA === IA || !!(IA && IA.nodeType === 1 && (dA.contains ? dA.contains(IA) : tA.compareDocumentPosition && tA.compareDocumentPosition(IA) & 16));
          } : function(tA, BA) {
            if (BA) {
              for (; BA = BA.parentNode; )
                if (BA === tA)
                  return !0;
            }
            return !1;
          }, Ln = $ ? function(tA, BA) {
            if (tA === BA)
              return mA = !0, 0;
            var dA = !tA.compareDocumentPosition - !BA.compareDocumentPosition;
            return dA || (dA = (tA.ownerDocument || tA) === (BA.ownerDocument || BA) ? tA.compareDocumentPosition(BA) : (
              // Otherwise we know they are disconnected
              1
            ), dA & 1 || !m.sortDetached && BA.compareDocumentPosition(tA) === dA ? tA === vA || tA.ownerDocument === ct && Zn(ct, tA) ? -1 : BA === vA || BA.ownerDocument === ct && Zn(ct, BA) ? 1 : Z ? Fr(Z, tA) - Fr(Z, BA) : 0 : dA & 4 ? -1 : 1);
          } : function(tA, BA) {
            if (tA === BA)
              return mA = !0, 0;
            var dA, IA = 0, $A = tA.parentNode, re = BA.parentNode, GA = [tA], ZA = [BA];
            if (!$A || !re)
              return tA === vA ? -1 : BA === vA ? 1 : $A ? -1 : re ? 1 : Z ? Fr(Z, tA) - Fr(Z, BA) : 0;
            if ($A === re)
              return ae(tA, BA);
            for (dA = tA; dA = dA.parentNode; )
              GA.unshift(dA);
            for (dA = BA; dA = dA.parentNode; )
              ZA.unshift(dA);
            for (; GA[IA] === ZA[IA]; )
              IA++;
            return IA ? (
              // Do a sibling check if the nodes have a common ancestor
              ae(GA[IA], ZA[IA])
            ) : (
              // Otherwise nodes in our document sort first
              GA[IA] === ct ? -1 : ZA[IA] === ct ? 1 : 0
            );
          }), vA;
        }, Ie.matches = function(N, $) {
          return Ie(N, null, null, $);
        }, Ie.matchesSelector = function(N, $) {
          if ((N.ownerDocument || N) !== vA && HA(N), $ = $.replace(tr, "='$1']"), m.matchesSelector && YA && !Ht[$ + " "] && (!pt || !pt.test($)) && (!ue || !ue.test($)))
            try {
              var q = Je.call(N, $);
              if (q || m.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              N.document && N.document.nodeType !== 11)
                return q;
            } catch {
            }
          return Ie($, vA, null, [N]).length > 0;
        }, Ie.contains = function(N, $) {
          return (N.ownerDocument || N) !== vA && HA(N), Zn(N, $);
        }, Ie.attr = function(N, $) {
          (N.ownerDocument || N) !== vA && HA(N);
          var q = y.attrHandle[$.toLowerCase()], uA = q && Tn.call(y.attrHandle, $.toLowerCase()) ? q(N, $, !YA) : void 0;
          return uA !== void 0 ? uA : m.attributes || !YA ? N.getAttribute($) : (uA = N.getAttributeNode($)) && uA.specified ? uA.value : null;
        }, Ie.error = function(N) {
          throw new Error("Syntax error, unrecognized expression: " + N);
        }, Ie.uniqueSort = function(N) {
          var $, q = [], uA = 0, tA = 0;
          if (mA = !m.detectDuplicates, Z = !m.sortStable && N.slice(0), N.sort(Ln), mA) {
            for (; $ = N[tA++]; )
              $ === N[tA] && (uA = q.push(tA));
            for (; uA--; )
              N.splice(q[uA], 1);
          }
          return Z = null, N;
        }, b = Ie.getText = function(N) {
          var $, q = "", uA = 0, tA = N.nodeType;
          if (tA) {
            if (tA === 1 || tA === 9 || tA === 11) {
              if (typeof N.textContent == "string")
                return N.textContent;
              for (N = N.firstChild; N; N = N.nextSibling)
                q += b(N);
            } else if (tA === 3 || tA === 4)
              return N.nodeValue;
          } else for (; $ = N[uA++]; )
            q += b($);
          return q;
        }, y = Ie.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: oA,
          match: xa,
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
              return N[1] = N[1].toLowerCase(), N[1].slice(0, 3) === "nth" ? (N[3] || Ie.error(N[0]), N[4] = +(N[4] ? N[5] + (N[6] || 1) : 2 * (N[3] === "even" || N[3] === "odd")), N[5] = +(N[7] + N[8] || N[3] === "odd")) : N[3] && Ie.error(N[0]), N;
            },
            PSEUDO: function(N) {
              var $, q = !N[6] && N[2];
              return xa.CHILD.test(N[0]) ? null : (N[3] ? N[2] = N[4] || N[5] || "" : q && _a.test(q) && // Get excess from tokenize (recursively)
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
              return $ || ($ = new RegExp("(^|" + De + ")" + N + "(" + De + "|$)")) && Sn(N, function(q) {
                return $.test(typeof q.className == "string" && q.className || typeof q.getAttribute < "u" && q.getAttribute("class") || "");
              });
            },
            ATTR: function(N, $, q) {
              return function(uA) {
                var tA = Ie.attr(uA, N);
                return tA == null ? $ === "!=" : $ ? (tA += "", $ === "=" ? tA === q : $ === "!=" ? tA !== q : $ === "^=" ? q && tA.indexOf(q) === 0 : $ === "*=" ? q && tA.indexOf(q) > -1 : $ === "$=" ? q && tA.slice(-q.length) === q : $ === "~=" ? (" " + tA.replace(df, " ") + " ").indexOf(q) > -1 : $ === "|=" ? tA === q || tA.slice(0, q.length + 1) === q + "-" : !1) : !0;
              };
            },
            CHILD: function(N, $, q, uA, tA) {
              var BA = N.slice(0, 3) !== "nth", dA = N.slice(-4) !== "last", IA = $ === "of-type";
              return uA === 1 && tA === 0 ? (
                // Shortcut for :nth-*(n)
                function($A) {
                  return !!$A.parentNode;
                }
              ) : function($A, re, GA) {
                var ZA, de, Te, XA, $e, tt, Kt = BA !== dA ? "nextSibling" : "previousSibling", We = $A.parentNode, Mi = IA && $A.nodeName.toLowerCase(), nr = !GA && !IA, gt = !1;
                if (We) {
                  if (BA) {
                    for (; Kt; ) {
                      for (XA = $A; XA = XA[Kt]; )
                        if (IA ? XA.nodeName.toLowerCase() === Mi : XA.nodeType === 1)
                          return !1;
                      tt = Kt = N === "only" && !tt && "nextSibling";
                    }
                    return !0;
                  }
                  if (tt = [dA ? We.firstChild : We.lastChild], dA && nr) {
                    for (XA = We, Te = XA[KA] || (XA[KA] = {}), de = Te[XA.uniqueID] || (Te[XA.uniqueID] = {}), ZA = de[N] || [], $e = ZA[0] === le && ZA[1], gt = $e && ZA[2], XA = $e && We.childNodes[$e]; XA = ++$e && XA && XA[Kt] || // Fallback to seeking `elem` from the start
                    (gt = $e = 0) || tt.pop(); )
                      if (XA.nodeType === 1 && ++gt && XA === $A) {
                        de[N] = [le, $e, gt];
                        break;
                      }
                  } else if (nr && (XA = $A, Te = XA[KA] || (XA[KA] = {}), de = Te[XA.uniqueID] || (Te[XA.uniqueID] = {}), ZA = de[N] || [], $e = ZA[0] === le && ZA[1], gt = $e), gt === !1)
                    for (; (XA = ++$e && XA && XA[Kt] || (gt = $e = 0) || tt.pop()) && !((IA ? XA.nodeName.toLowerCase() === Mi : XA.nodeType === 1) && ++gt && (nr && (Te = XA[KA] || (XA[KA] = {}), de = Te[XA.uniqueID] || (Te[XA.uniqueID] = {}), de[N] = [le, gt]), XA === $A)); )
                      ;
                  return gt -= tA, gt === uA || gt % uA === 0 && gt / uA >= 0;
                }
              };
            },
            PSEUDO: function(N, $) {
              var q, uA = y.pseudos[N] || y.setFilters[N.toLowerCase()] || Ie.error("unsupported pseudo: " + N);
              return uA[KA] ? uA($) : uA.length > 1 ? (q = [N, N, "", $], y.setFilters.hasOwnProperty(N.toLowerCase()) ? oA(function(tA, BA) {
                for (var dA, IA = uA(tA, $), $A = IA.length; $A--; )
                  dA = Fr(tA, IA[$A]), tA[dA] = !(BA[dA] = IA[$A]);
              }) : function(tA) {
                return uA(tA, 0, q);
              }) : uA;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: oA(function(N) {
              var $ = [], q = [], uA = P(N.replace(Ea, "$1"));
              return uA[KA] ? oA(function(tA, BA, dA, IA) {
                for (var $A, re = uA(tA, null, IA, []), GA = tA.length; GA--; )
                  ($A = re[GA]) && (tA[GA] = !(BA[GA] = $A));
              }) : function(tA, BA, dA) {
                return $[0] = tA, uA($, null, dA, q), $[0] = null, !q.pop();
              };
            }),
            has: oA(function(N) {
              return function($) {
                return Ie(N, $).length > 0;
              };
            }),
            contains: oA(function(N) {
              return N = N.replace(On, Nn), function($) {
                return ($.textContent || $.innerText || b($)).indexOf(N) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            lang: oA(function(N) {
              return Eu.test(N || "") || Ie.error("unsupported lang: " + N), N = N.replace(On, Nn).toLowerCase(), function($) {
                var q;
                do
                  if (q = YA ? $.lang : $.getAttribute("xml:lang") || $.getAttribute("lang"))
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
              return N === ie;
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
              return hf.test(N.nodeName);
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
            first: Ee(function() {
              return [0];
            }),
            last: Ee(function(N, $) {
              return [$ - 1];
            }),
            eq: Ee(function(N, $, q) {
              return [q < 0 ? q + $ : q];
            }),
            even: Ee(function(N, $) {
              for (var q = 0; q < $; q += 2)
                N.push(q);
              return N;
            }),
            odd: Ee(function(N, $) {
              for (var q = 1; q < $; q += 2)
                N.push(q);
              return N;
            }),
            lt: Ee(function(N, $, q) {
              for (var uA = q < 0 ? q + $ : q; --uA >= 0; )
                N.push(uA);
              return N;
            }),
            gt: Ee(function(N, $, q) {
              for (var uA = q < 0 ? q + $ : q; ++uA < $; )
                N.push(uA);
              return N;
            })
          }
        }, y.pseudos.nth = y.pseudos.eq;
        for (h in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          y.pseudos[h] = He(h);
        for (h in { submit: !0, reset: !0 })
          y.pseudos[h] = et(h);
        function Iu() {
        }
        Iu.prototype = y.filters = y.pseudos, y.setFilters = new Iu(), I = Ie.tokenize = function(N, $) {
          var q, uA, tA, BA, dA, IA, $A, re = ba[N + " "];
          if (re)
            return $ ? 0 : re.slice(0);
          for (dA = N, IA = [], $A = y.preFilter; dA; ) {
            (!q || (uA = To.exec(dA))) && (uA && (dA = dA.slice(uA[0].length) || dA), IA.push(tA = [])), q = !1, (uA = bu.exec(dA)) && (q = uA.shift(), tA.push({
              value: q,
              // Cast descendant combinators to space
              type: uA[0].replace(Ea, " ")
            }), dA = dA.slice(q.length));
            for (BA in y.filter)
              (uA = xa[BA].exec(dA)) && (!$A[BA] || (uA = $A[BA](uA))) && (q = uA.shift(), tA.push({
                value: q,
                type: BA,
                matches: uA
              }), dA = dA.slice(q.length));
            if (!q)
              break;
          }
          return $ ? dA.length : dA ? Ie.error(N) : (
            // Cache the tokens
            ba(N, IA).slice(0)
          );
        };
        function yt(N) {
          for (var $ = 0, q = N.length, uA = ""; $ < q; $++)
            uA += N[$].value;
          return uA;
        }
        function ii(N, $, q) {
          var uA = $.dir, tA = q && uA === "parentNode", BA = qe++;
          return $.first ? (
            // Check against closest ancestor/preceding element
            function(dA, IA, $A) {
              for (; dA = dA[uA]; )
                if (dA.nodeType === 1 || tA)
                  return N(dA, IA, $A);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(dA, IA, $A) {
              var re, GA, ZA, de = [le, BA];
              if ($A) {
                for (; dA = dA[uA]; )
                  if ((dA.nodeType === 1 || tA) && N(dA, IA, $A))
                    return !0;
              } else
                for (; dA = dA[uA]; )
                  if (dA.nodeType === 1 || tA) {
                    if (ZA = dA[KA] || (dA[KA] = {}), GA = ZA[dA.uniqueID] || (ZA[dA.uniqueID] = {}), (re = GA[uA]) && re[0] === le && re[1] === BA)
                      return de[2] = re[2];
                    if (GA[uA] = de, de[2] = N(dA, IA, $A))
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
            Ie(N, $[uA], q);
          return q;
        }
        function br(N, $, q, uA, tA) {
          for (var BA, dA = [], IA = 0, $A = N.length, re = $ != null; IA < $A; IA++)
            (BA = N[IA]) && (!q || q(BA, uA, tA)) && (dA.push(BA), re && $.push(IA));
          return dA;
        }
        function oi(N, $, q, uA, tA, BA) {
          return uA && !uA[KA] && (uA = oi(uA)), tA && !tA[KA] && (tA = oi(tA, BA)), oA(function(dA, IA, $A, re) {
            var GA, ZA, de, Te = [], XA = [], $e = IA.length, tt = dA || ai($ || "*", $A.nodeType ? [$A] : $A, []), Kt = N && (dA || !$) ? br(tt, Te, N, $A, re) : tt, We = q ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              tA || (dA ? N : $e || uA) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                IA
              )
            ) : Kt;
            if (q && q(Kt, We, $A, re), uA)
              for (GA = br(We, XA), uA(GA, [], $A, re), ZA = GA.length; ZA--; )
                (de = GA[ZA]) && (We[XA[ZA]] = !(Kt[XA[ZA]] = de));
            if (dA) {
              if (tA || N) {
                if (tA) {
                  for (GA = [], ZA = We.length; ZA--; )
                    (de = We[ZA]) && GA.push(Kt[ZA] = de);
                  tA(null, We = [], GA, re);
                }
                for (ZA = We.length; ZA--; )
                  (de = We[ZA]) && (GA = tA ? Fr(dA, de) : Te[ZA]) > -1 && (dA[GA] = !(IA[GA] = de));
              }
            } else
              We = br(
                We === IA ? We.splice($e, We.length) : We
              ), tA ? tA(null, IA, We, re) : Dn.apply(IA, We);
          });
        }
        function Se(N) {
          for (var $, q, uA, tA = N.length, BA = y.relative[N[0].type], dA = BA || y.relative[" "], IA = BA ? 1 : 0, $A = ii(function(ZA) {
            return ZA === $;
          }, dA, !0), re = ii(function(ZA) {
            return Fr($, ZA) > -1;
          }, dA, !0), GA = [function(ZA, de, Te) {
            var XA = !BA && (Te || de !== X) || (($ = de).nodeType ? $A(ZA, de, Te) : re(ZA, de, Te));
            return $ = null, XA;
          }]; IA < tA; IA++)
            if (q = y.relative[N[IA].type])
              GA = [ii(Oo(GA), q)];
            else {
              if (q = y.filter[N[IA].type].apply(null, N[IA].matches), q[KA]) {
                for (uA = ++IA; uA < tA && !y.relative[N[uA].type]; uA++)
                  ;
                return oi(
                  IA > 1 && Oo(GA),
                  IA > 1 && yt(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    N.slice(0, IA - 1).concat({ value: N[IA - 2].type === " " ? "*" : "" })
                  ).replace(Ea, "$1"),
                  q,
                  IA < uA && Se(N.slice(IA, uA)),
                  uA < tA && Se(N = N.slice(uA)),
                  uA < tA && yt(N)
                );
              }
              GA.push(q);
            }
          return Oo(GA);
        }
        function gf(N, $) {
          var q = $.length > 0, uA = N.length > 0, tA = function(BA, dA, IA, $A, re) {
            var GA, ZA, de, Te = 0, XA = "0", $e = BA && [], tt = [], Kt = X, We = BA || uA && y.find.TAG("*", re), Mi = le += Kt == null ? 1 : Math.random() || 0.1, nr = We.length;
            for (re && (X = dA === vA || dA || re); XA !== nr && (GA = We[XA]) != null; XA++) {
              if (uA && GA) {
                for (ZA = 0, !dA && GA.ownerDocument !== vA && (HA(GA), IA = !YA); de = N[ZA++]; )
                  if (de(GA, dA || vA, IA)) {
                    $A.push(GA);
                    break;
                  }
                re && (le = Mi);
              }
              q && ((GA = !de && GA) && Te--, BA && $e.push(GA));
            }
            if (Te += XA, q && XA !== Te) {
              for (ZA = 0; de = $[ZA++]; )
                de($e, tt, dA, IA);
              if (BA) {
                if (Te > 0)
                  for (; XA--; )
                    $e[XA] || tt[XA] || (tt[XA] = St.call($A));
                tt = br(tt);
              }
              Dn.apply($A, tt), re && !BA && tt.length > 0 && Te + $.length > 1 && Ie.uniqueSort($A);
            }
            return re && (le = Mi, X = Kt), $e;
          };
          return q ? oA(tA) : tA;
        }
        return P = Ie.compile = function(N, $) {
          var q, uA = [], tA = [], BA = Ht[N + " "];
          if (!BA) {
            for ($ || ($ = I(N)), q = $.length; q--; )
              BA = Se($[q]), BA[KA] ? uA.push(BA) : tA.push(BA);
            BA = Ht(N, gf(tA, uA)), BA.selector = N;
          }
          return BA;
        }, V = Ie.select = function(N, $, q, uA) {
          var tA, BA, dA, IA, $A, re = typeof N == "function" && N, GA = !uA && I(N = re.selector || N);
          if (q = q || [], GA.length === 1) {
            if (BA = GA[0] = GA[0].slice(0), BA.length > 2 && (dA = BA[0]).type === "ID" && m.getById && $.nodeType === 9 && YA && y.relative[BA[1].type]) {
              if ($ = (y.find.ID(dA.matches[0].replace(On, Nn), $) || [])[0], $)
                re && ($ = $.parentNode);
              else return q;
              N = N.slice(BA.shift().value.length);
            }
            for (tA = xa.needsContext.test(N) ? 0 : BA.length; tA-- && (dA = BA[tA], !y.relative[IA = dA.type]); )
              if (($A = y.find[IA]) && (uA = $A(
                dA.matches[0].replace(On, Nn),
                Do.test(BA[0].type) && Ni($.parentNode) || $
              ))) {
                if (BA.splice(tA, 1), N = uA.length && yt(BA), !N)
                  return Dn.apply(q, uA), q;
                break;
              }
          }
          return (re || P(N, GA))(
            uA,
            $,
            !YA,
            q,
            !$ || Do.test(N) && Ni($.parentNode) || $
          ), q;
        }, m.sortStable = KA.split("").sort(Ln).join("") === KA, m.detectDuplicates = !!mA, HA(), m.sortDetached = rA(function(N) {
          return N.compareDocumentPosition(vA.createElement("div")) & 1;
        }), rA(function(N) {
          return N.innerHTML = "<a href='#'></a>", N.firstChild.getAttribute("href") === "#";
        }) || OA("type|href|height|width", function(N, $, q) {
          if (!q)
            return N.getAttribute($, $.toLowerCase() === "type" ? 1 : 2);
        }), (!m.attributes || !rA(function(N) {
          return N.innerHTML = "<input/>", N.firstChild.setAttribute("value", ""), N.firstChild.getAttribute("value") === "";
        })) && OA("value", function(N, $, q) {
          if (!q && N.nodeName.toLowerCase() === "input")
            return N.defaultValue;
        }), rA(function(N) {
          return N.getAttribute("disabled") == null;
        }) || OA(Lo, function(N, $, q) {
          var uA;
          if (!q)
            return N[$] === !0 ? $.toLowerCase() : (uA = N.getAttributeNode($)) && uA.specified ? uA.value : null;
        }), Ie;
      }(e)
    );
    u.find = _, u.expr = _.selectors, u.expr[":"] = u.expr.pseudos, u.uniqueSort = u.unique = _.uniqueSort, u.text = _.getText, u.isXMLDoc = _.isXML, u.contains = _.contains;
    var M = function(s, h, m) {
      for (var y = [], b = m !== void 0; (s = s[h]) && s.nodeType !== 9; )
        if (s.nodeType === 1) {
          if (b && u(s).is(m))
            break;
          y.push(s);
        }
      return y;
    }, K = function(s, h) {
      for (var m = []; s; s = s.nextSibling)
        s.nodeType === 1 && s !== h && m.push(s);
      return m;
    }, z = u.expr.match.needsContext, cA = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, sA = /^.[^:#\[\.,]*$/;
    function gA(s, h, m) {
      if (u.isFunction(h))
        return u.grep(s, function(y, b) {
          return !!h.call(y, b, y) !== m;
        });
      if (h.nodeType)
        return u.grep(s, function(y) {
          return y === h !== m;
        });
      if (typeof h == "string") {
        if (sA.test(h))
          return u.filter(h, s, m);
        h = u.filter(h, s);
      }
      return u.grep(s, function(y) {
        return u.inArray(y, h) > -1 !== m;
      });
    }
    u.filter = function(s, h, m) {
      var y = h[0];
      return m && (s = ":not(" + s + ")"), h.length === 1 && y.nodeType === 1 ? u.find.matchesSelector(y, s) ? [y] : [] : u.find.matches(s, u.grep(h, function(b) {
        return b.nodeType === 1;
      }));
    }, u.fn.extend({
      find: function(s) {
        var h, m = [], y = this, b = y.length;
        if (typeof s != "string")
          return this.pushStack(u(s).filter(function() {
            for (h = 0; h < b; h++)
              if (u.contains(y[h], this))
                return !0;
          }));
        for (h = 0; h < b; h++)
          u.find(s, y[h], m);
        return m = this.pushStack(b > 1 ? u.unique(m) : m), m.selector = this.selector ? this.selector + " " + s : s, m;
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
    var FA, NA = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, _A = u.fn.init = function(s, h, m) {
      var y, b;
      if (!s)
        return this;
      if (m = m || FA, typeof s == "string")
        if (s.charAt(0) === "<" && s.charAt(s.length - 1) === ">" && s.length >= 3 ? y = [null, s, null] : y = NA.exec(s), y && (y[1] || !h))
          if (y[1]) {
            if (h = h instanceof u ? h[0] : h, u.merge(this, u.parseHTML(
              y[1],
              h && h.nodeType ? h.ownerDocument || h : i,
              !0
            )), cA.test(y[1]) && u.isPlainObject(h))
              for (y in h)
                u.isFunction(this[y]) ? this[y](h[y]) : this.attr(y, h[y]);
            return this;
          } else {
            if (b = i.getElementById(y[2]), b && b.parentNode) {
              if (b.id !== y[2])
                return FA.find(s);
              this.length = 1, this[0] = b;
            }
            return this.context = i, this.selector = s, this;
          }
        else return !h || h.jquery ? (h || m).find(s) : this.constructor(h).find(s);
      else {
        if (s.nodeType)
          return this.context = this[0] = s, this.length = 1, this;
        if (u.isFunction(s))
          return typeof m.ready < "u" ? m.ready(s) : (
            // Execute immediately if ready is not present
            s(u)
          );
      }
      return s.selector !== void 0 && (this.selector = s.selector, this.context = s.context), u.makeArray(s, this);
    };
    _A.prototype = u.fn, FA = u(i);
    var W = /^(?:parents|prev(?:Until|All))/, yA = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
    u.fn.extend({
      has: function(s) {
        var h, m = u(s, this), y = m.length;
        return this.filter(function() {
          for (h = 0; h < y; h++)
            if (u.contains(this, m[h]))
              return !0;
        });
      },
      closest: function(s, h) {
        for (var m, y = 0, b = this.length, E = [], I = z.test(s) || typeof s != "string" ? u(s, h || this.context) : 0; y < b; y++)
          for (m = this[y]; m && m !== h; m = m.parentNode)
            if (m.nodeType < 11 && (I ? I.index(m) > -1 : (
              // Don't pass non-elements to Sizzle
              m.nodeType === 1 && u.find.matchesSelector(m, s)
            ))) {
              E.push(m);
              break;
            }
        return this.pushStack(E.length > 1 ? u.uniqueSort(E) : E);
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
      add: function(s, h) {
        return this.pushStack(
          u.uniqueSort(
            u.merge(this.get(), u(s, h))
          )
        );
      },
      addBack: function(s) {
        return this.add(
          s == null ? this.prevObject : this.prevObject.filter(s)
        );
      }
    });
    function eA(s, h) {
      do
        s = s[h];
      while (s && s.nodeType !== 1);
      return s;
    }
    u.each({
      parent: function(s) {
        var h = s.parentNode;
        return h && h.nodeType !== 11 ? h : null;
      },
      parents: function(s) {
        return M(s, "parentNode");
      },
      parentsUntil: function(s, h, m) {
        return M(s, "parentNode", m);
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
      nextUntil: function(s, h, m) {
        return M(s, "nextSibling", m);
      },
      prevUntil: function(s, h, m) {
        return M(s, "previousSibling", m);
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
    }, function(s, h) {
      u.fn[s] = function(m, y) {
        var b = u.map(this, h, m);
        return s.slice(-5) !== "Until" && (y = m), y && typeof y == "string" && (b = u.filter(y, b)), this.length > 1 && (yA[s] || (b = u.uniqueSort(b)), W.test(s) && (b = b.reverse())), this.pushStack(b);
      };
    });
    var fA = /\S+/g;
    function EA(s) {
      var h = {};
      return u.each(s.match(fA) || [], function(m, y) {
        h[y] = !0;
      }), h;
    }
    u.Callbacks = function(s) {
      s = typeof s == "string" ? EA(s) : u.extend({}, s);
      var h, m, y, b, E = [], I = [], P = -1, V = function() {
        for (b = s.once, y = h = !0; I.length; P = -1)
          for (m = I.shift(); ++P < E.length; )
            E[P].apply(m[0], m[1]) === !1 && s.stopOnFalse && (P = E.length, m = !1);
        s.memory || (m = !1), h = !1, b && (m ? E = [] : E = "");
      }, X = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return E && (m && !h && (P = E.length - 1, I.push(m)), function Z(mA) {
            u.each(mA, function(HA, vA) {
              u.isFunction(vA) ? (!s.unique || !X.has(vA)) && E.push(vA) : vA && vA.length && u.type(vA) !== "string" && Z(vA);
            });
          }(arguments), m && !h && V()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return u.each(arguments, function(Z, mA) {
            for (var HA; (HA = u.inArray(mA, E, HA)) > -1; )
              E.splice(HA, 1), HA <= P && P--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(Z) {
          return Z ? u.inArray(Z, E) > -1 : E.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return E && (E = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return b = I = [], E = m = "", this;
        },
        disabled: function() {
          return !E;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return b = !0, m || X.disable(), this;
        },
        locked: function() {
          return !!b;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(Z, mA) {
          return b || (mA = mA || [], mA = [Z, mA.slice ? mA.slice() : mA], I.push(mA), h || V()), this;
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
        var h = [
          // action, add listener, listener list, final state
          ["resolve", "done", u.Callbacks("once memory"), "resolved"],
          ["reject", "fail", u.Callbacks("once memory"), "rejected"],
          ["notify", "progress", u.Callbacks("memory")]
        ], m = "pending", y = {
          state: function() {
            return m;
          },
          always: function() {
            return b.done(arguments).fail(arguments), this;
          },
          then: function() {
            var E = arguments;
            return u.Deferred(function(I) {
              u.each(h, function(P, V) {
                var X = u.isFunction(E[P]) && E[P];
                b[V[1]](function() {
                  var Z = X && X.apply(this, arguments);
                  Z && u.isFunction(Z.promise) ? Z.promise().progress(I.notify).done(I.resolve).fail(I.reject) : I[V[0] + "With"](
                    this === y ? I.promise() : this,
                    X ? [Z] : arguments
                  );
                });
              }), E = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(E) {
            return E != null ? u.extend(E, y) : y;
          }
        }, b = {};
        return y.pipe = y.then, u.each(h, function(E, I) {
          var P = I[2], V = I[3];
          y[I[1]] = P.add, V && P.add(function() {
            m = V;
          }, h[E ^ 1][2].disable, h[2][2].lock), b[I[0]] = function() {
            return b[I[0] + "With"](this === b ? y : this, arguments), this;
          }, b[I[0] + "With"] = P.fireWith;
        }), y.promise(b), s && s.call(b, b), b;
      },
      // Deferred helper
      when: function(s) {
        var h = 0, m = o.call(arguments), y = m.length, b = y !== 1 || s && u.isFunction(s.promise) ? y : 0, E = b === 1 ? s : u.Deferred(), I = function(Z, mA, HA) {
          return function(vA) {
            mA[Z] = this, HA[Z] = arguments.length > 1 ? o.call(arguments) : vA, HA === P ? E.notifyWith(mA, HA) : --b || E.resolveWith(mA, HA);
          };
        }, P, V, X;
        if (y > 1)
          for (P = new Array(y), V = new Array(y), X = new Array(y); h < y; h++)
            m[h] && u.isFunction(m[h].promise) ? m[h].promise().progress(I(h, V, P)).done(I(h, X, m)).fail(E.reject) : --b;
        return b || E.resolveWith(X, m), E.promise();
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
          var h = !1;
          try {
            h = e.frameElement == null && i.documentElement;
          } catch {
          }
          h && h.doScroll && function m() {
            if (!u.isReady) {
              try {
                h.doScroll("left");
              } catch {
                return e.setTimeout(m, 50);
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
      var s, h, m, y;
      m = i.getElementsByTagName("body")[0], !(!m || !m.style) && (h = i.createElement("div"), y = i.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", m.appendChild(y).appendChild(h), typeof h.style.zoom < "u" && (h.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", g.inlineBlockNeedsLayout = s = h.offsetWidth === 3, s && (m.style.zoom = 1)), m.removeChild(y));
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
      var h = u.noData[(s.nodeName + " ").toLowerCase()], m = +s.nodeType || 1;
      return m !== 1 && m !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !h || h !== !0 && s.getAttribute("classid") === h
      );
    }, L = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, R = /([A-Z])/g;
    function nA(s, h, m) {
      if (m === void 0 && s.nodeType === 1) {
        var y = "data-" + h.replace(R, "-$1").toLowerCase();
        if (m = s.getAttribute(y), typeof m == "string") {
          try {
            m = m === "true" ? !0 : m === "false" ? !1 : m === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +m + "" === m ? +m : L.test(m) ? u.parseJSON(m) : m
            );
          } catch {
          }
          u.data(s, h, m);
        } else
          m = void 0;
      }
      return m;
    }
    function QA(s) {
      var h;
      for (h in s)
        if (!(h === "data" && u.isEmptyObject(s[h])) && h !== "toJSON")
          return !1;
      return !0;
    }
    function UA(s, h, m, y) {
      if (J(s)) {
        var b, E, I = u.expando, P = s.nodeType, V = P ? u.cache : s, X = P ? s[I] : s[I] && I;
        if (!((!X || !V[X] || !y && !V[X].data) && m === void 0 && typeof h == "string"))
          return X || (P ? X = s[I] = n.pop() || u.guid++ : X = I), V[X] || (V[X] = P ? {} : { toJSON: u.noop }), (typeof h == "object" || typeof h == "function") && (y ? V[X] = u.extend(V[X], h) : V[X].data = u.extend(V[X].data, h)), E = V[X], y || (E.data || (E.data = {}), E = E.data), m !== void 0 && (E[u.camelCase(h)] = m), typeof h == "string" ? (b = E[h], b == null && (b = E[u.camelCase(h)])) : b = E, b;
      }
    }
    function qA(s, h, m) {
      if (J(s)) {
        var y, b, E = s.nodeType, I = E ? u.cache : s, P = E ? s[u.expando] : u.expando;
        if (I[P]) {
          if (h && (y = m ? I[P] : I[P].data, y)) {
            for (u.isArray(h) ? h = h.concat(u.map(h, u.camelCase)) : (h in y) ? h = [h] : (h = u.camelCase(h), h in y ? h = [h] : h = h.split(" ")), b = h.length; b--; )
              delete y[h[b]];
            if (m ? !QA(y) : !u.isEmptyObject(y))
              return;
          }
          !m && (delete I[P].data, !QA(I[P])) || (E ? u.cleanData([s], !0) : g.deleteExpando || I != I.window ? delete I[P] : I[P] = void 0);
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
        return s = s.nodeType ? u.cache[s[u.expando]] : s[u.expando], !!s && !QA(s);
      },
      data: function(s, h, m) {
        return UA(s, h, m);
      },
      removeData: function(s, h) {
        return qA(s, h);
      },
      // For internal use only.
      _data: function(s, h, m) {
        return UA(s, h, m, !0);
      },
      _removeData: function(s, h) {
        return qA(s, h, !0);
      }
    }), u.fn.extend({
      data: function(s, h) {
        var m, y, b, E = this[0], I = E && E.attributes;
        if (s === void 0) {
          if (this.length && (b = u.data(E), E.nodeType === 1 && !u._data(E, "parsedAttrs"))) {
            for (m = I.length; m--; )
              I[m] && (y = I[m].name, y.indexOf("data-") === 0 && (y = u.camelCase(y.slice(5)), nA(E, y, b[y])));
            u._data(E, "parsedAttrs", !0);
          }
          return b;
        }
        return typeof s == "object" ? this.each(function() {
          u.data(this, s);
        }) : arguments.length > 1 ? (
          // Sets one value
          this.each(function() {
            u.data(this, s, h);
          })
        ) : (
          // Gets one value
          // Try to fetch any internally stored data first
          E ? nA(E, s, u.data(E, s)) : void 0
        );
      },
      removeData: function(s) {
        return this.each(function() {
          u.removeData(this, s);
        });
      }
    }), u.extend({
      queue: function(s, h, m) {
        var y;
        if (s)
          return h = (h || "fx") + "queue", y = u._data(s, h), m && (!y || u.isArray(m) ? y = u._data(s, h, u.makeArray(m)) : y.push(m)), y || [];
      },
      dequeue: function(s, h) {
        h = h || "fx";
        var m = u.queue(s, h), y = m.length, b = m.shift(), E = u._queueHooks(s, h), I = function() {
          u.dequeue(s, h);
        };
        b === "inprogress" && (b = m.shift(), y--), b && (h === "fx" && m.unshift("inprogress"), delete E.stop, b.call(s, I, E)), !y && E && E.empty.fire();
      },
      // not intended for public consumption - generates a queueHooks object,
      // or returns the current one
      _queueHooks: function(s, h) {
        var m = h + "queueHooks";
        return u._data(s, m) || u._data(s, m, {
          empty: u.Callbacks("once memory").add(function() {
            u._removeData(s, h + "queue"), u._removeData(s, m);
          })
        });
      }
    }), u.fn.extend({
      queue: function(s, h) {
        var m = 2;
        return typeof s != "string" && (h = s, s = "fx", m--), arguments.length < m ? u.queue(this[0], s) : h === void 0 ? this : this.each(function() {
          var y = u.queue(this, s, h);
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
      promise: function(s, h) {
        var m, y = 1, b = u.Deferred(), E = this, I = this.length, P = function() {
          --y || b.resolveWith(E, [E]);
        };
        for (typeof s != "string" && (h = s, s = void 0), s = s || "fx"; I--; )
          m = u._data(E[I], s + "queueHooks"), m && m.empty && (y++, m.empty.add(P));
        return P(), b.promise(h);
      }
    }), function() {
      var s;
      g.shrinkWrapBlocks = function() {
        if (s != null)
          return s;
        s = !1;
        var h, m, y;
        if (m = i.getElementsByTagName("body")[0], !(!m || !m.style))
          return h = i.createElement("div"), y = i.createElement("div"), y.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", m.appendChild(y).appendChild(h), typeof h.style.zoom < "u" && (h.style.cssText = // Support: Firefox<29, Android 2.3
          // Vendor-prefix box-sizing
          "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", h.appendChild(i.createElement("div")).style.width = "5px", s = h.offsetWidth !== 3), m.removeChild(y), s;
      };
    }();
    var te = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, zA = new RegExp("^(?:([+-])=|)(" + te + ")([a-z%]*)$", "i"), SA = ["Top", "Right", "Bottom", "Left"], aA = function(s, h) {
      return s = h || s, u.css(s, "display") === "none" || !u.contains(s.ownerDocument, s);
    };
    function wA(s, h, m, y) {
      var b, E = 1, I = 20, P = y ? function() {
        return y.cur();
      } : function() {
        return u.css(s, h, "");
      }, V = P(), X = m && m[3] || (u.cssNumber[h] ? "" : "px"), Z = (u.cssNumber[h] || X !== "px" && +V) && zA.exec(u.css(s, h));
      if (Z && Z[3] !== X) {
        X = X || Z[3], m = m || [], Z = +V || 1;
        do
          E = E || ".5", Z = Z / E, u.style(s, h, Z + X);
        while (E !== (E = P() / V) && E !== 1 && --I);
      }
      return m && (Z = +Z || +V || 0, b = m[1] ? Z + (m[1] + 1) * m[2] : +m[2], y && (y.unit = X, y.start = Z, y.end = b)), b;
    }
    var bA = function(s, h, m, y, b, E, I) {
      var P = 0, V = s.length, X = m == null;
      if (u.type(m) === "object") {
        b = !0;
        for (P in m)
          bA(s, h, P, m[P], !0, E, I);
      } else if (y !== void 0 && (b = !0, u.isFunction(y) || (I = !0), X && (I ? (h.call(s, y), h = null) : (X = h, h = function(Z, mA, HA) {
        return X.call(u(Z), HA);
      })), h))
        for (; P < V; P++)
          h(
            s[P],
            m,
            I ? y : y.call(s[P], P, h(s[P], m))
          );
      return b ? s : (
        // Gets
        X ? h.call(s) : V ? h(s[0], m) : E
      );
    }, jA = /^(?:checkbox|radio)$/i, ge = /<([\w:-]+)/, fe = /^$|\/(?:java|ecma)script/i, lt = /^\s+/, ke = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function Be(s) {
      var h = ke.split("|"), m = s.createDocumentFragment();
      if (m.createElement)
        for (; h.length; )
          m.createElement(
            h.pop()
          );
      return m;
    }
    (function() {
      var s = i.createElement("div"), h = i.createDocumentFragment(), m = i.createElement("input");
      s.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", g.leadingWhitespace = s.firstChild.nodeType === 3, g.tbody = !s.getElementsByTagName("tbody").length, g.htmlSerialize = !!s.getElementsByTagName("link").length, g.html5Clone = i.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", m.type = "checkbox", m.checked = !0, h.appendChild(m), g.appendChecked = m.checked, s.innerHTML = "<textarea>x</textarea>", g.noCloneChecked = !!s.cloneNode(!0).lastChild.defaultValue, h.appendChild(s), m = i.createElement("input"), m.setAttribute("type", "radio"), m.setAttribute("checked", "checked"), m.setAttribute("name", "t"), s.appendChild(m), g.checkClone = s.cloneNode(!0).cloneNode(!0).lastChild.checked, g.noCloneEvent = !!s.addEventListener, s[u.expando] = 1, g.attributes = !s.getAttribute(u.expando);
    })();
    var Le = {
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
    Le.optgroup = Le.option, Le.tbody = Le.tfoot = Le.colgroup = Le.caption = Le.thead, Le.th = Le.td;
    function ne(s, h) {
      var m, y, b = 0, E = typeof s.getElementsByTagName < "u" ? s.getElementsByTagName(h || "*") : typeof s.querySelectorAll < "u" ? s.querySelectorAll(h || "*") : void 0;
      if (!E)
        for (E = [], m = s.childNodes || s; (y = m[b]) != null; b++)
          !h || u.nodeName(y, h) ? E.push(y) : u.merge(E, ne(y, h));
      return h === void 0 || h && u.nodeName(s, h) ? u.merge([s], E) : E;
    }
    function Ve(s, h) {
      for (var m, y = 0; (m = s[y]) != null; y++)
        u._data(
          m,
          "globalEval",
          !h || u._data(h[y], "globalEval")
        );
    }
    var Et = /<|&#?\w+;/, Mt = /<tbody/i;
    function _t(s) {
      jA.test(s.type) && (s.defaultChecked = s.checked);
    }
    function mt(s, h, m, y, b) {
      for (var E, I, P, V, X, Z, mA, HA = s.length, vA = Be(h), ie = [], YA = 0; YA < HA; YA++)
        if (I = s[YA], I || I === 0)
          if (u.type(I) === "object")
            u.merge(ie, I.nodeType ? [I] : I);
          else if (!Et.test(I))
            ie.push(h.createTextNode(I));
          else {
            for (V = V || vA.appendChild(h.createElement("div")), X = (ge.exec(I) || ["", ""])[1].toLowerCase(), mA = Le[X] || Le._default, V.innerHTML = mA[1] + u.htmlPrefilter(I) + mA[2], E = mA[0]; E--; )
              V = V.lastChild;
            if (!g.leadingWhitespace && lt.test(I) && ie.push(h.createTextNode(lt.exec(I)[0])), !g.tbody)
              for (I = X === "table" && !Mt.test(I) ? V.firstChild : (
                // String was a bare <thead> or <tfoot>
                mA[1] === "<table>" && !Mt.test(I) ? V : 0
              ), E = I && I.childNodes.length; E--; )
                u.nodeName(Z = I.childNodes[E], "tbody") && !Z.childNodes.length && I.removeChild(Z);
            for (u.merge(ie, V.childNodes), V.textContent = ""; V.firstChild; )
              V.removeChild(V.firstChild);
            V = vA.lastChild;
          }
      for (V && vA.removeChild(V), g.appendChecked || u.grep(ne(ie, "input"), _t), YA = 0; I = ie[YA++]; ) {
        if (y && u.inArray(I, y) > -1) {
          b && b.push(I);
          continue;
        }
        if (P = u.contains(I.ownerDocument, I), V = ne(vA.appendChild(I), "script"), P && Ve(V), m)
          for (E = 0; I = V[E++]; )
            fe.test(I.type || "") && m.push(I);
      }
      return V = null, vA;
    }
    (function() {
      var s, h, m = i.createElement("div");
      for (s in { submit: !0, change: !0, focusin: !0 })
        h = "on" + s, (g[s] = h in e) || (m.setAttribute(h, "t"), g[s] = m.attributes[h].expando === !1);
      m = null;
    })();
    var fn = /^(?:input|select|textarea)$/i, mr = /^key/, _i = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, qr = /^(?:focusinfocus|focusoutblur)$/, zr = /^([^.]*)(?:\.(.+)|)/;
    function lA() {
      return !0;
    }
    function DA() {
      return !1;
    }
    function WA() {
      try {
        return i.activeElement;
      } catch {
      }
    }
    function Ce(s, h, m, y, b, E) {
      var I, P;
      if (typeof h == "object") {
        typeof m != "string" && (y = y || m, m = void 0);
        for (P in h)
          Ce(s, P, m, y, h[P], E);
        return s;
      }
      if (y == null && b == null ? (b = m, y = m = void 0) : b == null && (typeof m == "string" ? (b = y, y = void 0) : (b = y, y = m, m = void 0)), b === !1)
        b = DA;
      else if (!b)
        return s;
      return E === 1 && (I = b, b = function(V) {
        return u().off(V), I.apply(this, arguments);
      }, b.guid = I.guid || (I.guid = u.guid++)), s.each(function() {
        u.event.add(this, h, b, y, m);
      });
    }
    u.event = {
      global: {},
      add: function(s, h, m, y, b) {
        var E, I, P, V, X, Z, mA, HA, vA, ie, YA, ue = u._data(s);
        if (ue) {
          for (m.handler && (V = m, m = V.handler, b = V.selector), m.guid || (m.guid = u.guid++), (I = ue.events) || (I = ue.events = {}), (Z = ue.handle) || (Z = ue.handle = function(pt) {
            return typeof u < "u" && (!pt || u.event.triggered !== pt.type) ? u.event.dispatch.apply(Z.elem, arguments) : void 0;
          }, Z.elem = s), h = (h || "").match(fA) || [""], P = h.length; P--; )
            E = zr.exec(h[P]) || [], vA = YA = E[1], ie = (E[2] || "").split(".").sort(), vA && (X = u.event.special[vA] || {}, vA = (b ? X.delegateType : X.bindType) || vA, X = u.event.special[vA] || {}, mA = u.extend({
              type: vA,
              origType: YA,
              data: y,
              handler: m,
              guid: m.guid,
              selector: b,
              needsContext: b && u.expr.match.needsContext.test(b),
              namespace: ie.join(".")
            }, V), (HA = I[vA]) || (HA = I[vA] = [], HA.delegateCount = 0, (!X.setup || X.setup.call(s, y, ie, Z) === !1) && (s.addEventListener ? s.addEventListener(vA, Z, !1) : s.attachEvent && s.attachEvent("on" + vA, Z))), X.add && (X.add.call(s, mA), mA.handler.guid || (mA.handler.guid = m.guid)), b ? HA.splice(HA.delegateCount++, 0, mA) : HA.push(mA), u.event.global[vA] = !0);
          s = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(s, h, m, y, b) {
        var E, I, P, V, X, Z, mA, HA, vA, ie, YA, ue = u.hasData(s) && u._data(s);
        if (!(!ue || !(Z = ue.events))) {
          for (h = (h || "").match(fA) || [""], X = h.length; X--; ) {
            if (P = zr.exec(h[X]) || [], vA = YA = P[1], ie = (P[2] || "").split(".").sort(), !vA) {
              for (vA in Z)
                u.event.remove(s, vA + h[X], m, y, !0);
              continue;
            }
            for (mA = u.event.special[vA] || {}, vA = (y ? mA.delegateType : mA.bindType) || vA, HA = Z[vA] || [], P = P[2] && new RegExp("(^|\\.)" + ie.join("\\.(?:.*\\.|)") + "(\\.|$)"), V = E = HA.length; E--; )
              I = HA[E], (b || YA === I.origType) && (!m || m.guid === I.guid) && (!P || P.test(I.namespace)) && (!y || y === I.selector || y === "**" && I.selector) && (HA.splice(E, 1), I.selector && HA.delegateCount--, mA.remove && mA.remove.call(s, I));
            V && !HA.length && ((!mA.teardown || mA.teardown.call(s, ie, ue.handle) === !1) && u.removeEvent(s, vA, ue.handle), delete Z[vA]);
          }
          u.isEmptyObject(Z) && (delete ue.handle, u._removeData(s, "events"));
        }
      },
      trigger: function(s, h, m, y) {
        var b, E, I, P, V, X, Z, mA = [m || i], HA = B.call(s, "type") ? s.type : s, vA = B.call(s, "namespace") ? s.namespace.split(".") : [];
        if (I = X = m = m || i, !(m.nodeType === 3 || m.nodeType === 8) && !qr.test(HA + u.event.triggered) && (HA.indexOf(".") > -1 && (vA = HA.split("."), HA = vA.shift(), vA.sort()), E = HA.indexOf(":") < 0 && "on" + HA, s = s[u.expando] ? s : new u.Event(HA, typeof s == "object" && s), s.isTrigger = y ? 2 : 3, s.namespace = vA.join("."), s.rnamespace = s.namespace ? new RegExp("(^|\\.)" + vA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, s.result = void 0, s.target || (s.target = m), h = h == null ? [s] : u.makeArray(h, [s]), V = u.event.special[HA] || {}, !(!y && V.trigger && V.trigger.apply(m, h) === !1))) {
          if (!y && !V.noBubble && !u.isWindow(m)) {
            for (P = V.delegateType || HA, qr.test(P + HA) || (I = I.parentNode); I; I = I.parentNode)
              mA.push(I), X = I;
            X === (m.ownerDocument || i) && mA.push(X.defaultView || X.parentWindow || e);
          }
          for (Z = 0; (I = mA[Z++]) && !s.isPropagationStopped(); )
            s.type = Z > 1 ? P : V.bindType || HA, b = (u._data(I, "events") || {})[s.type] && u._data(I, "handle"), b && b.apply(I, h), b = E && I[E], b && b.apply && J(I) && (s.result = b.apply(I, h), s.result === !1 && s.preventDefault());
          if (s.type = HA, !y && !s.isDefaultPrevented() && (!V._default || V._default.apply(mA.pop(), h) === !1) && J(m) && E && m[HA] && !u.isWindow(m)) {
            X = m[E], X && (m[E] = null), u.event.triggered = HA;
            try {
              m[HA]();
            } catch {
            }
            u.event.triggered = void 0, X && (m[E] = X);
          }
          return s.result;
        }
      },
      dispatch: function(s) {
        s = u.event.fix(s);
        var h, m, y, b, E, I = [], P = o.call(arguments), V = (u._data(this, "events") || {})[s.type] || [], X = u.event.special[s.type] || {};
        if (P[0] = s, s.delegateTarget = this, !(X.preDispatch && X.preDispatch.call(this, s) === !1)) {
          for (I = u.event.handlers.call(this, s, V), h = 0; (b = I[h++]) && !s.isPropagationStopped(); )
            for (s.currentTarget = b.elem, m = 0; (E = b.handlers[m++]) && !s.isImmediatePropagationStopped(); )
              (!s.rnamespace || s.rnamespace.test(E.namespace)) && (s.handleObj = E, s.data = E.data, y = ((u.event.special[E.origType] || {}).handle || E.handler).apply(b.elem, P), y !== void 0 && (s.result = y) === !1 && (s.preventDefault(), s.stopPropagation()));
          return X.postDispatch && X.postDispatch.call(this, s), s.result;
        }
      },
      handlers: function(s, h) {
        var m, y, b, E, I = [], P = h.delegateCount, V = s.target;
        if (P && V.nodeType && (s.type !== "click" || isNaN(s.button) || s.button < 1)) {
          for (; V != this; V = V.parentNode || this)
            if (V.nodeType === 1 && (V.disabled !== !0 || s.type !== "click")) {
              for (y = [], m = 0; m < P; m++)
                E = h[m], b = E.selector + " ", y[b] === void 0 && (y[b] = E.needsContext ? u(b, this).index(V) > -1 : u.find(b, this, null, [V]).length), y[b] && y.push(E);
              y.length && I.push({ elem: V, handlers: y });
            }
        }
        return P < h.length && I.push({ elem: this, handlers: h.slice(P) }), I;
      },
      fix: function(s) {
        if (s[u.expando])
          return s;
        var h, m, y, b = s.type, E = s, I = this.fixHooks[b];
        for (I || (this.fixHooks[b] = I = _i.test(b) ? this.mouseHooks : mr.test(b) ? this.keyHooks : {}), y = I.props ? this.props.concat(I.props) : this.props, s = new u.Event(E), h = y.length; h--; )
          m = y[h], s[m] = E[m];
        return s.target || (s.target = E.srcElement || i), s.target.nodeType === 3 && (s.target = s.target.parentNode), s.metaKey = !!s.metaKey, I.filter ? I.filter(s, E) : s;
      },
      // Includes some event props shared by KeyEvent and MouseEvent
      props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(s, h) {
          return s.which == null && (s.which = h.charCode != null ? h.charCode : h.keyCode), s;
        }
      },
      mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(s, h) {
          var m, y, b, E = h.button, I = h.fromElement;
          return s.pageX == null && h.clientX != null && (y = s.target.ownerDocument || i, b = y.documentElement, m = y.body, s.pageX = h.clientX + (b && b.scrollLeft || m && m.scrollLeft || 0) - (b && b.clientLeft || m && m.clientLeft || 0), s.pageY = h.clientY + (b && b.scrollTop || m && m.scrollTop || 0) - (b && b.clientTop || m && m.clientTop || 0)), !s.relatedTarget && I && (s.relatedTarget = I === s.target ? h.toElement : I), !s.which && E !== void 0 && (s.which = E & 1 ? 1 : E & 2 ? 3 : E & 4 ? 2 : 0), s;
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
      simulate: function(s, h, m) {
        var y = u.extend(
          new u.Event(),
          m,
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
        u.event.trigger(y, null, h), y.isDefaultPrevented() && m.preventDefault();
      }
    }, u.removeEvent = i.removeEventListener ? function(s, h, m) {
      s.removeEventListener && s.removeEventListener(h, m);
    } : function(s, h, m) {
      var y = "on" + h;
      s.detachEvent && (typeof s[y] > "u" && (s[y] = null), s.detachEvent(y, m));
    }, u.Event = function(s, h) {
      if (!(this instanceof u.Event))
        return new u.Event(s, h);
      s && s.type ? (this.originalEvent = s, this.type = s.type, this.isDefaultPrevented = s.defaultPrevented || s.defaultPrevented === void 0 && // Support: IE < 9, Android < 4.0
      s.returnValue === !1 ? lA : DA) : this.type = s, h && u.extend(this, h), this.timeStamp = s && s.timeStamp || u.now(), this[u.expando] = !0;
    }, u.Event.prototype = {
      constructor: u.Event,
      isDefaultPrevented: DA,
      isPropagationStopped: DA,
      isImmediatePropagationStopped: DA,
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
    }, function(s, h) {
      u.event.special[s] = {
        delegateType: h,
        bindType: h,
        handle: function(m) {
          var y, b = this, E = m.relatedTarget, I = m.handleObj;
          return (!E || E !== b && !u.contains(b, E)) && (m.type = I.origType, y = I.handler.apply(this, arguments), m.type = h), y;
        }
      };
    }), g.submit || (u.event.special.submit = {
      setup: function() {
        if (u.nodeName(this, "form"))
          return !1;
        u.event.add(this, "click._submit keypress._submit", function(s) {
          var h = s.target, m = u.nodeName(h, "input") || u.nodeName(h, "button") ? (
            // Support: IE <=8
            // We use jQuery.prop instead of elem.form
            // to allow fixing the IE8 delegated submit issue (gh-2332)
            // by 3rd party polyfills/workarounds.
            u.prop(h, "form")
          ) : void 0;
          m && !u._data(m, "submit") && (u.event.add(m, "submit._submit", function(y) {
            y._submitBubble = !0;
          }), u._data(m, "submit", !0));
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
          var h = s.target;
          fn.test(h.nodeName) && !u._data(h, "change") && (u.event.add(h, "change._change", function(m) {
            this.parentNode && !m.isSimulated && !m.isTrigger && u.event.simulate("change", this.parentNode, m);
          }), u._data(h, "change", !0));
        });
      },
      handle: function(s) {
        var h = s.target;
        if (this !== h || s.isSimulated || s.isTrigger || h.type !== "radio" && h.type !== "checkbox")
          return s.handleObj.handler.apply(this, arguments);
      },
      teardown: function() {
        return u.event.remove(this, "._change"), !fn.test(this.nodeName);
      }
    }), g.focusin || u.each({ focus: "focusin", blur: "focusout" }, function(s, h) {
      var m = function(y) {
        u.event.simulate(h, y.target, u.event.fix(y));
      };
      u.event.special[h] = {
        setup: function() {
          var y = this.ownerDocument || this, b = u._data(y, h);
          b || y.addEventListener(s, m, !0), u._data(y, h, (b || 0) + 1);
        },
        teardown: function() {
          var y = this.ownerDocument || this, b = u._data(y, h) - 1;
          b ? u._data(y, h, b) : (y.removeEventListener(s, m, !0), u._removeData(y, h));
        }
      };
    }), u.fn.extend({
      on: function(s, h, m, y) {
        return Ce(this, s, h, m, y);
      },
      one: function(s, h, m, y) {
        return Ce(this, s, h, m, y, 1);
      },
      off: function(s, h, m) {
        var y, b;
        if (s && s.preventDefault && s.handleObj)
          return y = s.handleObj, u(s.delegateTarget).off(
            y.namespace ? y.origType + "." + y.namespace : y.origType,
            y.selector,
            y.handler
          ), this;
        if (typeof s == "object") {
          for (b in s)
            this.off(b, h, s[b]);
          return this;
        }
        return (h === !1 || typeof h == "function") && (m = h, h = void 0), m === !1 && (m = DA), this.each(function() {
          u.event.remove(this, s, m, h);
        });
      },
      trigger: function(s, h) {
        return this.each(function() {
          u.event.trigger(s, h, this);
        });
      },
      triggerHandler: function(s, h) {
        var m = this[0];
        if (m)
          return u.event.trigger(s, h, m, !0);
      }
    });
    var Qe = / jQuery\d+="(?:null|\d+)"/g, st = new RegExp("<(?:" + ke + ")[\\s/>]", "i"), xt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, _n = /<script|<style|<link/i, xi = /checked\s*(?:[^=]|=\s*.checked.)/i, xn = /^true\/(.*)/, Ii = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Jr = Be(i), dn = Jr.appendChild(i.createElement("div"));
    function Hi(s, h) {
      return u.nodeName(s, "table") && u.nodeName(h.nodeType !== 11 ? h : h.firstChild, "tr") ? s.getElementsByTagName("tbody")[0] || s.appendChild(s.ownerDocument.createElement("tbody")) : s;
    }
    function jr(s) {
      return s.type = (u.find.attr(s, "type") !== null) + "/" + s.type, s;
    }
    function vr(s) {
      var h = xn.exec(s.type);
      return h ? s.type = h[1] : s.removeAttribute("type"), s;
    }
    function js(s, h) {
      if (!(h.nodeType !== 1 || !u.hasData(s))) {
        var m, y, b, E = u._data(s), I = u._data(h, E), P = E.events;
        if (P) {
          delete I.handle, I.events = {};
          for (m in P)
            for (y = 0, b = P[m].length; y < b; y++)
              u.event.add(h, m, P[m][y]);
        }
        I.data && (I.data = u.extend({}, I.data));
      }
    }
    function mo(s, h) {
      var m, y, b;
      if (h.nodeType === 1) {
        if (m = h.nodeName.toLowerCase(), !g.noCloneEvent && h[u.expando]) {
          b = u._data(h);
          for (y in b.events)
            u.removeEvent(h, y, b.handle);
          h.removeAttribute(u.expando);
        }
        m === "script" && h.text !== s.text ? (jr(h).text = s.text, vr(h)) : m === "object" ? (h.parentNode && (h.outerHTML = s.outerHTML), g.html5Clone && s.innerHTML && !u.trim(h.innerHTML) && (h.innerHTML = s.innerHTML)) : m === "input" && jA.test(s.type) ? (h.defaultChecked = h.checked = s.checked, h.value !== s.value && (h.value = s.value)) : m === "option" ? h.defaultSelected = h.selected = s.defaultSelected : (m === "input" || m === "textarea") && (h.defaultValue = s.defaultValue);
      }
    }
    function yr(s, h, m, y) {
      h = l.apply([], h);
      var b, E, I, P, V, X, Z = 0, mA = s.length, HA = mA - 1, vA = h[0], ie = u.isFunction(vA);
      if (ie || mA > 1 && typeof vA == "string" && !g.checkClone && xi.test(vA))
        return s.each(function(YA) {
          var ue = s.eq(YA);
          ie && (h[0] = vA.call(this, YA, ue.html())), yr(ue, h, m, y);
        });
      if (mA && (X = mt(h, s[0].ownerDocument, !1, s, y), b = X.firstChild, X.childNodes.length === 1 && (X = b), b || y)) {
        for (P = u.map(ne(X, "script"), jr), I = P.length; Z < mA; Z++)
          E = X, Z !== HA && (E = u.clone(E, !0, !0), I && u.merge(P, ne(E, "script"))), m.call(s[Z], E, Z);
        if (I)
          for (V = P[P.length - 1].ownerDocument, u.map(P, vr), Z = 0; Z < I; Z++)
            E = P[Z], fe.test(E.type || "") && !u._data(E, "globalEval") && u.contains(V, E) && (E.src ? u._evalUrl && u._evalUrl(E.src) : u.globalEval(
              (E.text || E.textContent || E.innerHTML || "").replace(Ii, "")
            ));
        X = b = null;
      }
      return s;
    }
    function ha(s, h, m) {
      for (var y, b = h ? u.filter(h, s) : s, E = 0; (y = b[E]) != null; E++)
        !m && y.nodeType === 1 && u.cleanData(ne(y)), y.parentNode && (m && u.contains(y.ownerDocument, y) && Ve(ne(y, "script")), y.parentNode.removeChild(y));
      return s;
    }
    u.extend({
      htmlPrefilter: function(s) {
        return s.replace(xt, "<$1></$2>");
      },
      clone: function(s, h, m) {
        var y, b, E, I, P, V = u.contains(s.ownerDocument, s);
        if (g.html5Clone || u.isXMLDoc(s) || !st.test("<" + s.nodeName + ">") ? E = s.cloneNode(!0) : (dn.innerHTML = s.outerHTML, dn.removeChild(E = dn.firstChild)), (!g.noCloneEvent || !g.noCloneChecked) && (s.nodeType === 1 || s.nodeType === 11) && !u.isXMLDoc(s))
          for (y = ne(E), P = ne(s), I = 0; (b = P[I]) != null; ++I)
            y[I] && mo(b, y[I]);
        if (h)
          if (m)
            for (P = P || ne(s), y = y || ne(E), I = 0; (b = P[I]) != null; I++)
              js(b, y[I]);
          else
            js(s, E);
        return y = ne(E, "script"), y.length > 0 && Ve(y, !V && ne(s, "script")), y = P = b = null, E;
      },
      cleanData: function(s, h) {
        for (var m, y, b, E, I = 0, P = u.expando, V = u.cache, X = g.attributes, Z = u.event.special; (m = s[I]) != null; I++)
          if ((h || J(m)) && (b = m[P], E = b && V[b], E)) {
            if (E.events)
              for (y in E.events)
                Z[y] ? u.event.remove(m, y) : u.removeEvent(m, y, E.handle);
            V[b] && (delete V[b], !X && typeof m.removeAttribute < "u" ? m.removeAttribute(P) : m[P] = void 0, n.push(b));
          }
      }
    }), u.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: yr,
      detach: function(s) {
        return ha(this, s, !0);
      },
      remove: function(s) {
        return ha(this, s);
      },
      text: function(s) {
        return bA(this, function(h) {
          return h === void 0 ? u.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || i).createTextNode(h)
          );
        }, null, s, arguments.length);
      },
      append: function() {
        return yr(this, arguments, function(s) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var h = Hi(this, s);
            h.appendChild(s);
          }
        });
      },
      prepend: function() {
        return yr(this, arguments, function(s) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var h = Hi(this, s);
            h.insertBefore(s, h.firstChild);
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
        for (var s, h = 0; (s = this[h]) != null; h++) {
          for (s.nodeType === 1 && u.cleanData(ne(s, !1)); s.firstChild; )
            s.removeChild(s.firstChild);
          s.options && u.nodeName(s, "select") && (s.options.length = 0);
        }
        return this;
      },
      clone: function(s, h) {
        return s = s ?? !1, h = h ?? s, this.map(function() {
          return u.clone(this, s, h);
        });
      },
      html: function(s) {
        return bA(this, function(h) {
          var m = this[0] || {}, y = 0, b = this.length;
          if (h === void 0)
            return m.nodeType === 1 ? m.innerHTML.replace(Qe, "") : void 0;
          if (typeof h == "string" && !_n.test(h) && (g.htmlSerialize || !st.test(h)) && (g.leadingWhitespace || !lt.test(h)) && !Le[(ge.exec(h) || ["", ""])[1].toLowerCase()]) {
            h = u.htmlPrefilter(h);
            try {
              for (; y < b; y++)
                m = this[y] || {}, m.nodeType === 1 && (u.cleanData(ne(m, !1)), m.innerHTML = h);
              m = 0;
            } catch {
            }
          }
          m && this.empty().append(h);
        }, null, s, arguments.length);
      },
      replaceWith: function() {
        var s = [];
        return yr(this, arguments, function(h) {
          var m = this.parentNode;
          u.inArray(this, s) < 0 && (u.cleanData(ne(this)), m && m.replaceChild(h, this));
        }, s);
      }
    }), u.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(s, h) {
      u.fn[s] = function(m) {
        for (var y, b = 0, E = [], I = u(m), P = I.length - 1; b <= P; b++)
          y = b === P ? this : this.clone(!0), u(I[b])[h](y), f.apply(E, y.get());
        return this.pushStack(E);
      };
    });
    var Si, Ys = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function Zs(s, h) {
      var m = u(h.createElement(s)).appendTo(h.body), y = u.css(m[0], "display");
      return m.detach(), y;
    }
    function pa(s) {
      var h = i, m = Ys[s];
      return m || (m = Zs(s, h), (m === "none" || !m) && (Si = (Si || u("<iframe frameborder='0' width='0' height='0'/>")).appendTo(h.documentElement), h = (Si[0].contentWindow || Si[0].contentDocument).document, h.write(), h.close(), m = Zs(s, h), Si.detach()), Ys[s] = m), m;
    }
    var Au = /^margin/, ga = new RegExp("^(" + te + ")(?!px)[a-z%]+$", "i"), vo = function(s, h, m, y) {
      var b, E, I = {};
      for (E in h)
        I[E] = s.style[E], s.style[E] = h[E];
      b = m.apply(s, y || []);
      for (E in h)
        s.style[E] = I[E];
      return b;
    }, eu = i.documentElement;
    (function() {
      var s, h, m, y, b, E, I = i.createElement("div"), P = i.createElement("div");
      if (!P.style)
        return;
      P.style.cssText = "float:left;opacity:.5", g.opacity = P.style.opacity === "0.5", g.cssFloat = !!P.style.cssFloat, P.style.backgroundClip = "content-box", P.cloneNode(!0).style.backgroundClip = "", g.clearCloneStyle = P.style.backgroundClip === "content-box", I = i.createElement("div"), I.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", P.innerHTML = "", I.appendChild(P), g.boxSizing = P.style.boxSizing === "" || P.style.MozBoxSizing === "" || P.style.WebkitBoxSizing === "", u.extend(g, {
        reliableHiddenOffsets: function() {
          return s == null && V(), y;
        },
        boxSizingReliable: function() {
          return s == null && V(), m;
        },
        pixelMarginRight: function() {
          return s == null && V(), h;
        },
        pixelPosition: function() {
          return s == null && V(), s;
        },
        reliableMarginRight: function() {
          return s == null && V(), b;
        },
        reliableMarginLeft: function() {
          return s == null && V(), E;
        }
      });
      function V() {
        var X, Z, mA = i.documentElement;
        mA.appendChild(I), P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", s = m = E = !1, h = b = !0, e.getComputedStyle && (Z = e.getComputedStyle(P), s = (Z || {}).top !== "1%", E = (Z || {}).marginLeft === "2px", m = (Z || { width: "4px" }).width === "4px", P.style.marginRight = "50%", h = (Z || { marginRight: "4px" }).marginRight === "4px", X = P.appendChild(i.createElement("div")), X.style.cssText = P.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", X.style.marginRight = X.style.width = "0", P.style.width = "1px", b = !parseFloat((e.getComputedStyle(X) || {}).marginRight), P.removeChild(X)), P.style.display = "none", y = P.getClientRects().length === 0, y && (P.style.display = "", P.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", P.childNodes[0].style.borderCollapse = "separate", X = P.getElementsByTagName("td"), X[0].style.cssText = "margin:0;border:0;padding:0;display:none", y = X[0].offsetHeight === 0, y && (X[0].style.display = "", X[1].style.display = "none", y = X[0].offsetHeight === 0)), mA.removeChild(I);
      }
    })();
    var jn, Yn, jc = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (jn = function(s) {
      var h = s.ownerDocument.defaultView;
      return (!h || !h.opener) && (h = e), h.getComputedStyle(s);
    }, Yn = function(s, h, m) {
      var y, b, E, I, P = s.style;
      return m = m || jn(s), I = m ? m.getPropertyValue(h) || m[h] : void 0, (I === "" || I === void 0) && !u.contains(s.ownerDocument, s) && (I = u.style(s, h)), m && !g.pixelMarginRight() && ga.test(I) && Au.test(h) && (y = P.width, b = P.minWidth, E = P.maxWidth, P.minWidth = P.maxWidth = P.width = I, I = m.width, P.width = y, P.minWidth = b, P.maxWidth = E), I === void 0 ? I : I + "";
    }) : eu.currentStyle && (jn = function(s) {
      return s.currentStyle;
    }, Yn = function(s, h, m) {
      var y, b, E, I, P = s.style;
      return m = m || jn(s), I = m ? m[h] : void 0, I == null && P && P[h] && (I = P[h]), ga.test(I) && !jc.test(h) && (y = P.left, b = s.runtimeStyle, E = b && b.left, E && (b.left = s.currentStyle.left), P.left = h === "fontSize" ? "1em" : I, I = P.pixelLeft + "px", P.left = y, E && (b.left = E)), I === void 0 ? I : I + "" || "auto";
    });
    function yo(s, h) {
      return {
        get: function() {
          if (s()) {
            delete this.get;
            return;
          }
          return (this.get = h).apply(this, arguments);
        }
      };
    }
    var Co = /alpha\([^)]*\)/i, Yc = /opacity\s*=\s*([^)]*)/i, Zc = /^(none|table(?!-c[ea]).+)/, Ba = new RegExp("^(" + te + ")(.*)$", "i"), Af = { position: "absolute", visibility: "hidden", display: "block" }, Li = {
      letterSpacing: "0",
      fontWeight: "400"
    }, tu = ["Webkit", "O", "Moz", "ms"], nu = i.createElement("div").style;
    function ru(s) {
      if (s in nu)
        return s;
      for (var h = s.charAt(0).toUpperCase() + s.slice(1), m = tu.length; m--; )
        if (s = tu[m] + h, s in nu)
          return s;
    }
    function Qo(s, h) {
      for (var m, y, b, E = [], I = 0, P = s.length; I < P; I++)
        y = s[I], y.style && (E[I] = u._data(y, "olddisplay"), m = y.style.display, h ? (!E[I] && m === "none" && (y.style.display = ""), y.style.display === "" && aA(y) && (E[I] = u._data(y, "olddisplay", pa(y.nodeName)))) : (b = aA(y), (m && m !== "none" || !b) && u._data(
          y,
          "olddisplay",
          b ? m : u.css(y, "display")
        )));
      for (I = 0; I < P; I++)
        y = s[I], y.style && (!h || y.style.display === "none" || y.style.display === "") && (y.style.display = h ? E[I] || "" : "none");
      return s;
    }
    function Fo(s, h, m) {
      var y = Ba.exec(h);
      return y ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, y[1] - (m || 0)) + (y[2] || "px")
      ) : h;
    }
    function Uo(s, h, m, y, b) {
      for (var E = m === (y ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        h === "width" ? 1 : 0
      ), I = 0; E < 4; E += 2)
        m === "margin" && (I += u.css(s, m + SA[E], !0, b)), y ? (m === "content" && (I -= u.css(s, "padding" + SA[E], !0, b)), m !== "margin" && (I -= u.css(s, "border" + SA[E] + "Width", !0, b))) : (I += u.css(s, "padding" + SA[E], !0, b), m !== "padding" && (I += u.css(s, "border" + SA[E] + "Width", !0, b)));
      return I;
    }
    function iu(s, h, m) {
      var y = !0, b = h === "width" ? s.offsetWidth : s.offsetHeight, E = jn(s), I = g.boxSizing && u.css(s, "boxSizing", !1, E) === "border-box";
      if (b <= 0 || b == null) {
        if (b = Yn(s, h, E), (b < 0 || b == null) && (b = s.style[h]), ga.test(b))
          return b;
        y = I && (g.boxSizingReliable() || b === s.style[h]), b = parseFloat(b) || 0;
      }
      return b + Uo(
        s,
        h,
        m || (I ? "border" : "content"),
        y,
        E
      ) + "px";
    }
    u.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
        opacity: {
          get: function(s, h) {
            if (h) {
              var m = Yn(s, "opacity");
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
        float: g.cssFloat ? "cssFloat" : "styleFloat"
      },
      // Get and set the style property on a DOM Node
      style: function(s, h, m, y) {
        if (!(!s || s.nodeType === 3 || s.nodeType === 8 || !s.style)) {
          var b, E, I, P = u.camelCase(h), V = s.style;
          if (h = u.cssProps[P] || (u.cssProps[P] = ru(P) || P), I = u.cssHooks[h] || u.cssHooks[P], m !== void 0) {
            if (E = typeof m, E === "string" && (b = zA.exec(m)) && b[1] && (m = wA(s, h, b), E = "number"), m == null || m !== m)
              return;
            if (E === "number" && (m += b && b[3] || (u.cssNumber[P] ? "" : "px")), !g.clearCloneStyle && m === "" && h.indexOf("background") === 0 && (V[h] = "inherit"), !I || !("set" in I) || (m = I.set(s, m, y)) !== void 0)
              try {
                V[h] = m;
              } catch {
              }
          } else
            return I && "get" in I && (b = I.get(s, !1, y)) !== void 0 ? b : V[h];
        }
      },
      css: function(s, h, m, y) {
        var b, E, I, P = u.camelCase(h);
        return h = u.cssProps[P] || (u.cssProps[P] = ru(P) || P), I = u.cssHooks[h] || u.cssHooks[P], I && "get" in I && (E = I.get(s, !0, m)), E === void 0 && (E = Yn(s, h, y)), E === "normal" && h in Li && (E = Li[h]), m === "" || m ? (b = parseFloat(E), m === !0 || isFinite(b) ? b || 0 : E) : E;
      }
    }), u.each(["height", "width"], function(s, h) {
      u.cssHooks[h] = {
        get: function(m, y, b) {
          if (y)
            return Zc.test(u.css(m, "display")) && m.offsetWidth === 0 ? vo(m, Af, function() {
              return iu(m, h, b);
            }) : iu(m, h, b);
        },
        set: function(m, y, b) {
          var E = b && jn(m);
          return Fo(
            m,
            y,
            b ? Uo(
              m,
              h,
              b,
              g.boxSizing && u.css(m, "boxSizing", !1, E) === "border-box",
              E
            ) : 0
          );
        }
      };
    }), g.opacity || (u.cssHooks.opacity = {
      get: function(s, h) {
        return Yc.test((h && s.currentStyle ? s.currentStyle.filter : s.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : h ? "1" : "";
      },
      set: function(s, h) {
        var m = s.style, y = s.currentStyle, b = u.isNumeric(h) ? "alpha(opacity=" + h * 100 + ")" : "", E = y && y.filter || m.filter || "";
        m.zoom = 1, !((h >= 1 || h === "") && u.trim(E.replace(Co, "")) === "" && m.removeAttribute && (m.removeAttribute("filter"), h === "" || y && !y.filter)) && (m.filter = Co.test(E) ? E.replace(Co, b) : E + " " + b);
      }
    }), u.cssHooks.marginRight = yo(
      g.reliableMarginRight,
      function(s, h) {
        if (h)
          return vo(
            s,
            { display: "inline-block" },
            Yn,
            [s, "marginRight"]
          );
      }
    ), u.cssHooks.marginLeft = yo(
      g.reliableMarginLeft,
      function(s, h) {
        if (h)
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
    }, function(s, h) {
      u.cssHooks[s + h] = {
        expand: function(m) {
          for (var y = 0, b = {}, E = typeof m == "string" ? m.split(" ") : [m]; y < 4; y++)
            b[s + SA[y] + h] = E[y] || E[y - 2] || E[0];
          return b;
        }
      }, Au.test(s) || (u.cssHooks[s + h].set = Fo);
    }), u.fn.extend({
      css: function(s, h) {
        return bA(this, function(m, y, b) {
          var E, I, P = {}, V = 0;
          if (u.isArray(y)) {
            for (E = jn(m), I = y.length; V < I; V++)
              P[y[V]] = u.css(m, y[V], !1, E);
            return P;
          }
          return b !== void 0 ? u.style(m, y, b) : u.css(m, y);
        }, s, h, arguments.length > 1);
      },
      show: function() {
        return Qo(this, !0);
      },
      hide: function() {
        return Qo(this);
      },
      toggle: function(s) {
        return typeof s == "boolean" ? s ? this.show() : this.hide() : this.each(function() {
          aA(this) ? u(this).show() : u(this).hide();
        });
      }
    });
    function It(s, h, m, y, b) {
      return new It.prototype.init(s, h, m, y, b);
    }
    u.Tween = It, It.prototype = {
      constructor: It,
      init: function(s, h, m, y, b, E) {
        this.elem = s, this.prop = m, this.easing = b || u.easing._default, this.options = h, this.start = this.now = this.cur(), this.end = y, this.unit = E || (u.cssNumber[m] ? "" : "px");
      },
      cur: function() {
        var s = It.propHooks[this.prop];
        return s && s.get ? s.get(this) : It.propHooks._default.get(this);
      },
      run: function(s) {
        var h, m = It.propHooks[this.prop];
        return this.options.duration ? this.pos = h = u.easing[this.easing](
          s,
          this.options.duration * s,
          0,
          1,
          this.options.duration
        ) : this.pos = h = s, this.now = (this.end - this.start) * h + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), m && m.set ? m.set(this) : It.propHooks._default.set(this), this;
      }
    }, It.prototype.init.prototype = It.prototype, It.propHooks = {
      _default: {
        get: function(s) {
          var h;
          return s.elem.nodeType !== 1 || s.elem[s.prop] != null && s.elem.style[s.prop] == null ? s.elem[s.prop] : (h = u.css(s.elem, s.prop, ""), !h || h === "auto" ? 0 : h);
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
    var Yr, wa, au = /^(?:toggle|show|hide)$/, ou = /queueHooks$/;
    function bo() {
      return e.setTimeout(function() {
        Yr = void 0;
      }), Yr = u.now();
    }
    function Zr(s, h) {
      var m, y = { height: s }, b = 0;
      for (h = h ? 1 : 0; b < 4; b += 2 - h)
        m = SA[b], y["margin" + m] = y["padding" + m] = s;
      return h && (y.opacity = y.width = s), y;
    }
    function su(s, h, m) {
      for (var y, b = (Xt.tweeners[h] || []).concat(Xt.tweeners["*"]), E = 0, I = b.length; E < I; E++)
        if (y = b[E].call(m, h, s))
          return y;
    }
    function uu(s, h, m) {
      var y, b, E, I, P, V, X, Z, mA = this, HA = {}, vA = s.style, ie = s.nodeType && aA(s), YA = u._data(s, "fxshow");
      m.queue || (P = u._queueHooks(s, "fx"), P.unqueued == null && (P.unqueued = 0, V = P.empty.fire, P.empty.fire = function() {
        P.unqueued || V();
      }), P.unqueued++, mA.always(function() {
        mA.always(function() {
          P.unqueued--, u.queue(s, "fx").length || P.empty.fire();
        });
      })), s.nodeType === 1 && ("height" in h || "width" in h) && (m.overflow = [vA.overflow, vA.overflowX, vA.overflowY], X = u.css(s, "display"), Z = X === "none" ? u._data(s, "olddisplay") || pa(s.nodeName) : X, Z === "inline" && u.css(s, "float") === "none" && (!g.inlineBlockNeedsLayout || pa(s.nodeName) === "inline" ? vA.display = "inline-block" : vA.zoom = 1)), m.overflow && (vA.overflow = "hidden", g.shrinkWrapBlocks() || mA.always(function() {
        vA.overflow = m.overflow[0], vA.overflowX = m.overflow[1], vA.overflowY = m.overflow[2];
      }));
      for (y in h)
        if (b = h[y], au.exec(b)) {
          if (delete h[y], E = E || b === "toggle", b === (ie ? "hide" : "show"))
            if (b === "show" && YA && YA[y] !== void 0)
              ie = !0;
            else
              continue;
          HA[y] = YA && YA[y] || u.style(s, y);
        } else
          X = void 0;
      if (u.isEmptyObject(HA))
        (X === "none" ? pa(s.nodeName) : X) === "inline" && (vA.display = X);
      else {
        YA ? "hidden" in YA && (ie = YA.hidden) : YA = u._data(s, "fxshow", {}), E && (YA.hidden = !ie), ie ? u(s).show() : mA.done(function() {
          u(s).hide();
        }), mA.done(function() {
          var ue;
          u._removeData(s, "fxshow");
          for (ue in HA)
            u.style(s, ue, HA[ue]);
        });
        for (y in HA)
          I = su(ie ? YA[y] : 0, y, mA), y in YA || (YA[y] = I.start, ie && (I.end = I.start, I.start = y === "width" || y === "height" ? 1 : 0));
      }
    }
    function ma(s, h) {
      var m, y, b, E, I;
      for (m in s)
        if (y = u.camelCase(m), b = h[y], E = s[m], u.isArray(E) && (b = E[1], E = s[m] = E[0]), m !== y && (s[y] = E, delete s[m]), I = u.cssHooks[y], I && "expand" in I) {
          E = I.expand(E), delete s[y];
          for (m in E)
            m in s || (s[m] = E[m], h[m] = b);
        } else
          h[y] = b;
    }
    function Xt(s, h, m) {
      var y, b, E = 0, I = Xt.prefilters.length, P = u.Deferred().always(function() {
        delete V.elem;
      }), V = function() {
        if (b)
          return !1;
        for (var mA = Yr || bo(), HA = Math.max(0, X.startTime + X.duration - mA), vA = HA / X.duration || 0, ie = 1 - vA, YA = 0, ue = X.tweens.length; YA < ue; YA++)
          X.tweens[YA].run(ie);
        return P.notifyWith(s, [X, ie, HA]), ie < 1 && ue ? HA : (P.resolveWith(s, [X]), !1);
      }, X = P.promise({
        elem: s,
        props: u.extend({}, h),
        opts: u.extend(!0, {
          specialEasing: {},
          easing: u.easing._default
        }, m),
        originalProperties: h,
        originalOptions: m,
        startTime: Yr || bo(),
        duration: m.duration,
        tweens: [],
        createTween: function(mA, HA) {
          var vA = u.Tween(
            s,
            X.opts,
            mA,
            HA,
            X.opts.specialEasing[mA] || X.opts.easing
          );
          return X.tweens.push(vA), vA;
        },
        stop: function(mA) {
          var HA = 0, vA = mA ? X.tweens.length : 0;
          if (b)
            return this;
          for (b = !0; HA < vA; HA++)
            X.tweens[HA].run(1);
          return mA ? (P.notifyWith(s, [X, 1, 0]), P.resolveWith(s, [X, mA])) : P.rejectWith(s, [X, mA]), this;
        }
      }), Z = X.props;
      for (ma(Z, X.opts.specialEasing); E < I; E++)
        if (y = Xt.prefilters[E].call(X, s, Z, X.opts), y)
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
        "*": [function(s, h) {
          var m = this.createTween(s, h);
          return wA(m.elem, s, zA.exec(h), m), m;
        }]
      },
      tweener: function(s, h) {
        u.isFunction(s) ? (h = s, s = ["*"]) : s = s.match(fA);
        for (var m, y = 0, b = s.length; y < b; y++)
          m = s[y], Xt.tweeners[m] = Xt.tweeners[m] || [], Xt.tweeners[m].unshift(h);
      },
      prefilters: [uu],
      prefilter: function(s, h) {
        h ? Xt.prefilters.unshift(s) : Xt.prefilters.push(s);
      }
    }), u.speed = function(s, h, m) {
      var y = s && typeof s == "object" ? u.extend({}, s) : {
        complete: m || !m && h || u.isFunction(s) && s,
        duration: s,
        easing: m && h || h && !u.isFunction(h) && h
      };
      return y.duration = u.fx.off ? 0 : typeof y.duration == "number" ? y.duration : y.duration in u.fx.speeds ? u.fx.speeds[y.duration] : u.fx.speeds._default, (y.queue == null || y.queue === !0) && (y.queue = "fx"), y.old = y.complete, y.complete = function() {
        u.isFunction(y.old) && y.old.call(this), y.queue && u.dequeue(this, y.queue);
      }, y;
    }, u.fn.extend({
      fadeTo: function(s, h, m, y) {
        return this.filter(aA).css("opacity", 0).show().end().animate({ opacity: h }, s, m, y);
      },
      animate: function(s, h, m, y) {
        var b = u.isEmptyObject(s), E = u.speed(h, m, y), I = function() {
          var P = Xt(this, u.extend({}, s), E);
          (b || u._data(this, "finish")) && P.stop(!0);
        };
        return I.finish = I, b || E.queue === !1 ? this.each(I) : this.queue(E.queue, I);
      },
      stop: function(s, h, m) {
        var y = function(b) {
          var E = b.stop;
          delete b.stop, E(m);
        };
        return typeof s != "string" && (m = h, h = s, s = void 0), h && s !== !1 && this.queue(s || "fx", []), this.each(function() {
          var b = !0, E = s != null && s + "queueHooks", I = u.timers, P = u._data(this);
          if (E)
            P[E] && P[E].stop && y(P[E]);
          else
            for (E in P)
              P[E] && P[E].stop && ou.test(E) && y(P[E]);
          for (E = I.length; E--; )
            I[E].elem === this && (s == null || I[E].queue === s) && (I[E].anim.stop(m), b = !1, I.splice(E, 1));
          (b || !m) && u.dequeue(this, s);
        });
      },
      finish: function(s) {
        return s !== !1 && (s = s || "fx"), this.each(function() {
          var h, m = u._data(this), y = m[s + "queue"], b = m[s + "queueHooks"], E = u.timers, I = y ? y.length : 0;
          for (m.finish = !0, u.queue(this, s, []), b && b.stop && b.stop.call(this, !0), h = E.length; h--; )
            E[h].elem === this && E[h].queue === s && (E[h].anim.stop(!0), E.splice(h, 1));
          for (h = 0; h < I; h++)
            y[h] && y[h].finish && y[h].finish.call(this);
          delete m.finish;
        });
      }
    }), u.each(["toggle", "show", "hide"], function(s, h) {
      var m = u.fn[h];
      u.fn[h] = function(y, b, E) {
        return y == null || typeof y == "boolean" ? m.apply(this, arguments) : this.animate(Zr(h, !0), y, b, E);
      };
    }), u.each({
      slideDown: Zr("show"),
      slideUp: Zr("hide"),
      slideToggle: Zr("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(s, h) {
      u.fn[s] = function(m, y, b) {
        return this.animate(h, m, y, b);
      };
    }), u.timers = [], u.fx.tick = function() {
      var s, h = u.timers, m = 0;
      for (Yr = u.now(); m < h.length; m++)
        s = h[m], !s() && h[m] === s && h.splice(m--, 1);
      h.length || u.fx.stop(), Yr = void 0;
    }, u.fx.timer = function(s) {
      u.timers.push(s), s() ? u.fx.start() : u.timers.pop();
    }, u.fx.interval = 13, u.fx.start = function() {
      wa || (wa = e.setInterval(u.fx.tick, u.fx.interval));
    }, u.fx.stop = function() {
      e.clearInterval(wa), wa = null;
    }, u.fx.speeds = {
      slow: 600,
      fast: 200,
      // Default speed
      _default: 400
    }, u.fn.delay = function(s, h) {
      return s = u.fx && u.fx.speeds[s] || s, h = h || "fx", this.queue(h, function(m, y) {
        var b = e.setTimeout(m, s);
        y.stop = function() {
          e.clearTimeout(b);
        };
      });
    }, function() {
      var s, h = i.createElement("input"), m = i.createElement("div"), y = i.createElement("select"), b = y.appendChild(i.createElement("option"));
      m = i.createElement("div"), m.setAttribute("className", "t"), m.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", s = m.getElementsByTagName("a")[0], h.setAttribute("type", "checkbox"), m.appendChild(h), s = m.getElementsByTagName("a")[0], s.style.cssText = "top:1px", g.getSetAttribute = m.className !== "t", g.style = /top/.test(s.getAttribute("style")), g.hrefNormalized = s.getAttribute("href") === "/a", g.checkOn = !!h.value, g.optSelected = b.selected, g.enctype = !!i.createElement("form").enctype, y.disabled = !0, g.optDisabled = !b.disabled, h = i.createElement("input"), h.setAttribute("value", ""), g.input = h.getAttribute("value") === "", h.value = "t", h.setAttribute("type", "radio"), g.radioValue = h.value === "t";
    }();
    var ef = /\r/g, lu = /[\x20\t\r\n\f]+/g;
    u.fn.extend({
      val: function(s) {
        var h, m, y, b = this[0];
        return arguments.length ? (y = u.isFunction(s), this.each(function(E) {
          var I;
          this.nodeType === 1 && (y ? I = s.call(this, E, u(this).val()) : I = s, I == null ? I = "" : typeof I == "number" ? I += "" : u.isArray(I) && (I = u.map(I, function(P) {
            return P == null ? "" : P + "";
          })), h = u.valHooks[this.type] || u.valHooks[this.nodeName.toLowerCase()], (!h || !("set" in h) || h.set(this, I, "value") === void 0) && (this.value = I));
        })) : b ? (h = u.valHooks[b.type] || u.valHooks[b.nodeName.toLowerCase()], h && "get" in h && (m = h.get(b, "value")) !== void 0 ? m : (m = b.value, typeof m == "string" ? (
          // handle most common string cases
          m.replace(ef, "")
        ) : (
          // handle cases where value is null/undef or number
          m ?? ""
        ))) : void 0;
      }
    }), u.extend({
      valHooks: {
        option: {
          get: function(s) {
            var h = u.find.attr(s, "value");
            return h ?? // Support: IE10-11+
            // option.text throws exceptions (#14686, #14858)
            // Strip and collapse whitespace
            // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
            u.trim(u.text(s)).replace(lu, " ");
          }
        },
        select: {
          get: function(s) {
            for (var h, m, y = s.options, b = s.selectedIndex, E = s.type === "select-one" || b < 0, I = E ? null : [], P = E ? b + 1 : y.length, V = b < 0 ? P : E ? b : 0; V < P; V++)
              if (m = y[V], (m.selected || V === b) && // Don't return options that are disabled or in a disabled optgroup
              (g.optDisabled ? !m.disabled : m.getAttribute("disabled") === null) && (!m.parentNode.disabled || !u.nodeName(m.parentNode, "optgroup"))) {
                if (h = u(m).val(), E)
                  return h;
                I.push(h);
              }
            return I;
          },
          set: function(s, h) {
            for (var m, y, b = s.options, E = u.makeArray(h), I = b.length; I--; )
              if (y = b[I], u.inArray(u.valHooks.option.get(y), E) > -1)
                try {
                  y.selected = m = !0;
                } catch {
                  y.scrollHeight;
                }
              else
                y.selected = !1;
            return m || (s.selectedIndex = -1), b;
          }
        }
      }
    }), u.each(["radio", "checkbox"], function() {
      u.valHooks[this] = {
        set: function(s, h) {
          if (u.isArray(h))
            return s.checked = u.inArray(u(s).val(), h) > -1;
        }
      }, g.checkOn || (u.valHooks[this].get = function(s) {
        return s.getAttribute("value") === null ? "on" : s.value;
      });
    });
    var Cr, va, In = u.expr.attrHandle, ya = /^(?:checked|selected)$/i, Hn = g.getSetAttribute, Ai = g.input;
    u.fn.extend({
      attr: function(s, h) {
        return bA(this, u.attr, s, h, arguments.length > 1);
      },
      removeAttr: function(s) {
        return this.each(function() {
          u.removeAttr(this, s);
        });
      }
    }), u.extend({
      attr: function(s, h, m) {
        var y, b, E = s.nodeType;
        if (!(E === 3 || E === 8 || E === 2)) {
          if (typeof s.getAttribute > "u")
            return u.prop(s, h, m);
          if ((E !== 1 || !u.isXMLDoc(s)) && (h = h.toLowerCase(), b = u.attrHooks[h] || (u.expr.match.bool.test(h) ? va : Cr)), m !== void 0) {
            if (m === null) {
              u.removeAttr(s, h);
              return;
            }
            return b && "set" in b && (y = b.set(s, m, h)) !== void 0 ? y : (s.setAttribute(h, m + ""), m);
          }
          return b && "get" in b && (y = b.get(s, h)) !== null ? y : (y = u.find.attr(s, h), y ?? void 0);
        }
      },
      attrHooks: {
        type: {
          set: function(s, h) {
            if (!g.radioValue && h === "radio" && u.nodeName(s, "input")) {
              var m = s.value;
              return s.setAttribute("type", h), m && (s.value = m), h;
            }
          }
        }
      },
      removeAttr: function(s, h) {
        var m, y, b = 0, E = h && h.match(fA);
        if (E && s.nodeType === 1)
          for (; m = E[b++]; )
            y = u.propFix[m] || m, u.expr.match.bool.test(m) ? Ai && Hn || !ya.test(m) ? s[y] = !1 : s[u.camelCase("default-" + m)] = s[y] = !1 : u.attr(s, m, ""), s.removeAttribute(Hn ? m : y);
      }
    }), va = {
      set: function(s, h, m) {
        return h === !1 ? u.removeAttr(s, m) : Ai && Hn || !ya.test(m) ? s.setAttribute(!Hn && u.propFix[m] || m, m) : s[u.camelCase("default-" + m)] = s[m] = !0, m;
      }
    }, u.each(u.expr.match.bool.source.match(/\w+/g), function(s, h) {
      var m = In[h] || u.find.attr;
      Ai && Hn || !ya.test(h) ? In[h] = function(y, b, E) {
        var I, P;
        return E || (P = In[b], In[b] = I, I = m(y, b, E) != null ? b.toLowerCase() : null, In[b] = P), I;
      } : In[h] = function(y, b, E) {
        if (!E)
          return y[u.camelCase("default-" + b)] ? b.toLowerCase() : null;
      };
    }), (!Ai || !Hn) && (u.attrHooks.value = {
      set: function(s, h, m) {
        if (u.nodeName(s, "input"))
          s.defaultValue = h;
        else
          return Cr && Cr.set(s, h, m);
      }
    }), Hn || (Cr = {
      set: function(s, h, m) {
        var y = s.getAttributeNode(m);
        if (y || s.setAttributeNode(
          y = s.ownerDocument.createAttribute(m)
        ), y.value = h += "", m === "value" || h === s.getAttribute(m))
          return h;
      }
    }, In.id = In.name = In.coords = function(s, h, m) {
      var y;
      if (!m)
        return (y = s.getAttributeNode(h)) && y.value !== "" ? y.value : null;
    }, u.valHooks.button = {
      get: function(s, h) {
        var m = s.getAttributeNode(h);
        if (m && m.specified)
          return m.value;
      },
      set: Cr.set
    }, u.attrHooks.contenteditable = {
      set: function(s, h, m) {
        Cr.set(s, h === "" ? !1 : h, m);
      }
    }, u.each(["width", "height"], function(s, h) {
      u.attrHooks[h] = {
        set: function(m, y) {
          if (y === "")
            return m.setAttribute(h, "auto"), y;
        }
      };
    })), g.style || (u.attrHooks.style = {
      get: function(s) {
        return s.style.cssText || void 0;
      },
      set: function(s, h) {
        return s.style.cssText = h + "";
      }
    });
    var ei = /^(?:input|select|textarea|button|object)$/i, cu = /^(?:a|area)$/i;
    u.fn.extend({
      prop: function(s, h) {
        return bA(this, u.prop, s, h, arguments.length > 1);
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
      prop: function(s, h, m) {
        var y, b, E = s.nodeType;
        if (!(E === 3 || E === 8 || E === 2))
          return (E !== 1 || !u.isXMLDoc(s)) && (h = u.propFix[h] || h, b = u.propHooks[h]), m !== void 0 ? b && "set" in b && (y = b.set(s, m, h)) !== void 0 ? y : s[h] = m : b && "get" in b && (y = b.get(s, h)) !== null ? y : s[h];
      },
      propHooks: {
        tabIndex: {
          get: function(s) {
            var h = u.find.attr(s, "tabindex");
            return h ? parseInt(h, 10) : ei.test(s.nodeName) || cu.test(s.nodeName) && s.href ? 0 : -1;
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), g.hrefNormalized || u.each(["href", "src"], function(s, h) {
      u.propHooks[h] = {
        get: function(m) {
          return m.getAttribute(h, 4);
        }
      };
    }), g.optSelected || (u.propHooks.selected = {
      get: function(s) {
        var h = s.parentNode;
        return h && (h.selectedIndex, h.parentNode && h.parentNode.selectedIndex), null;
      },
      set: function(s) {
        var h = s.parentNode;
        h && (h.selectedIndex, h.parentNode && h.parentNode.selectedIndex);
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
    var Ca = /[\t\r\n\f]/g;
    function Qr(s) {
      return u.attr(s, "class") || "";
    }
    u.fn.extend({
      addClass: function(s) {
        var h, m, y, b, E, I, P, V = 0;
        if (u.isFunction(s))
          return this.each(function(X) {
            u(this).addClass(s.call(this, X, Qr(this)));
          });
        if (typeof s == "string" && s) {
          for (h = s.match(fA) || []; m = this[V++]; )
            if (b = Qr(m), y = m.nodeType === 1 && (" " + b + " ").replace(Ca, " "), y) {
              for (I = 0; E = h[I++]; )
                y.indexOf(" " + E + " ") < 0 && (y += E + " ");
              P = u.trim(y), b !== P && u.attr(m, "class", P);
            }
        }
        return this;
      },
      removeClass: function(s) {
        var h, m, y, b, E, I, P, V = 0;
        if (u.isFunction(s))
          return this.each(function(X) {
            u(this).removeClass(s.call(this, X, Qr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof s == "string" && s) {
          for (h = s.match(fA) || []; m = this[V++]; )
            if (b = Qr(m), y = m.nodeType === 1 && (" " + b + " ").replace(Ca, " "), y) {
              for (I = 0; E = h[I++]; )
                for (; y.indexOf(" " + E + " ") > -1; )
                  y = y.replace(" " + E + " ", " ");
              P = u.trim(y), b !== P && u.attr(m, "class", P);
            }
        }
        return this;
      },
      toggleClass: function(s, h) {
        var m = typeof s;
        return typeof h == "boolean" && m === "string" ? h ? this.addClass(s) : this.removeClass(s) : u.isFunction(s) ? this.each(function(y) {
          u(this).toggleClass(
            s.call(this, y, Qr(this), h),
            h
          );
        }) : this.each(function() {
          var y, b, E, I;
          if (m === "string")
            for (b = 0, E = u(this), I = s.match(fA) || []; y = I[b++]; )
              E.hasClass(y) ? E.removeClass(y) : E.addClass(y);
          else (s === void 0 || m === "boolean") && (y = Qr(this), y && u._data(this, "__className__", y), u.attr(
            this,
            "class",
            y || s === !1 ? "" : u._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(s) {
        var h, m, y = 0;
        for (h = " " + s + " "; m = this[y++]; )
          if (m.nodeType === 1 && (" " + Qr(m) + " ").replace(Ca, " ").indexOf(h) > -1)
            return !0;
        return !1;
      }
    }), u.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
      function(s, h) {
        u.fn[h] = function(m, y) {
          return arguments.length > 0 ? this.on(h, null, m, y) : this.trigger(h);
        };
      }
    ), u.fn.extend({
      hover: function(s, h) {
        return this.mouseenter(s).mouseleave(h || s);
      }
    });
    var fu = e.location, Qa = u.now(), Fa = /\?/, du = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    u.parseJSON = function(s) {
      if (e.JSON && e.JSON.parse)
        return e.JSON.parse(s + "");
      var h, m = null, y = u.trim(s + "");
      return y && !u.trim(y.replace(du, function(b, E, I, P) {
        return h && E && (m = 0), m === 0 ? b : (h = I || E, m += !P - !I, "");
      })) ? Function("return " + y)() : u.error("Invalid JSON: " + s);
    }, u.parseXML = function(s) {
      var h, m;
      if (!s || typeof s != "string")
        return null;
      try {
        e.DOMParser ? (m = new e.DOMParser(), h = m.parseFromString(s, "text/xml")) : (h = new e.ActiveXObject("Microsoft.XMLDOM"), h.async = "false", h.loadXML(s));
      } catch {
        h = void 0;
      }
      return (!h || !h.documentElement || h.getElementsByTagName("parsererror").length) && u.error("Invalid XML: " + s), h;
    };
    var tf = /#.*$/, hu = /([?&])_=[^&]*/, nf = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, pu = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rf = /^(?:GET|HEAD)$/, af = /^\/\//, gu = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Bu = {}, Ti = {}, wu = "*/".concat("*"), Eo = fu.href, ti = gu.exec(Eo.toLowerCase()) || [];
    function mu(s) {
      return function(h, m) {
        typeof h != "string" && (m = h, h = "*");
        var y, b = 0, E = h.toLowerCase().match(fA) || [];
        if (u.isFunction(m))
          for (; y = E[b++]; )
            y.charAt(0) === "+" ? (y = y.slice(1) || "*", (s[y] = s[y] || []).unshift(m)) : (s[y] = s[y] || []).push(m);
      };
    }
    function vu(s, h, m, y) {
      var b = {}, E = s === Ti;
      function I(P) {
        var V;
        return b[P] = !0, u.each(s[P] || [], function(X, Z) {
          var mA = Z(h, m, y);
          if (typeof mA == "string" && !E && !b[mA])
            return h.dataTypes.unshift(mA), I(mA), !1;
          if (E)
            return !(V = mA);
        }), V;
      }
      return I(h.dataTypes[0]) || !b["*"] && I("*");
    }
    function Me(s, h) {
      var m, y, b = u.ajaxSettings.flatOptions || {};
      for (y in h)
        h[y] !== void 0 && ((b[y] ? s : m || (m = {}))[y] = h[y]);
      return m && u.extend(!0, s, m), s;
    }
    function Pe(s, h, m) {
      for (var y, b, E, I, P = s.contents, V = s.dataTypes; V[0] === "*"; )
        V.shift(), b === void 0 && (b = s.mimeType || h.getResponseHeader("Content-Type"));
      if (b) {
        for (I in P)
          if (P[I] && P[I].test(b)) {
            V.unshift(I);
            break;
          }
      }
      if (V[0] in m)
        E = V[0];
      else {
        for (I in m) {
          if (!V[0] || s.converters[I + " " + V[0]]) {
            E = I;
            break;
          }
          y || (y = I);
        }
        E = E || y;
      }
      if (E)
        return E !== V[0] && V.unshift(E), m[E];
    }
    function of(s, h, m, y) {
      var b, E, I, P, V, X = {}, Z = s.dataTypes.slice();
      if (Z[1])
        for (I in s.converters)
          X[I.toLowerCase()] = s.converters[I];
      for (E = Z.shift(); E; )
        if (s.responseFields[E] && (m[s.responseFields[E]] = h), !V && y && s.dataFilter && (h = s.dataFilter(h, s.dataType)), V = E, E = Z.shift(), E) {
          if (E === "*")
            E = V;
          else if (V !== "*" && V !== E) {
            if (I = X[V + " " + E] || X["* " + E], !I) {
              for (b in X)
                if (P = b.split(" "), P[1] === E && (I = X[V + " " + P[0]] || X["* " + P[0]], I)) {
                  I === !0 ? I = X[b] : X[b] !== !0 && (E = P[0], Z.unshift(P[1]));
                  break;
                }
            }
            if (I !== !0)
              if (I && s.throws)
                h = I(h);
              else
                try {
                  h = I(h);
                } catch (mA) {
                  return {
                    state: "parsererror",
                    error: I ? mA : "No conversion from " + V + " to " + E
                  };
                }
          }
        }
      return { state: "success", data: h };
    }
    u.extend({
      // Counter for holding the number of active queries
      active: 0,
      // Last-Modified header cache for next request
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: Eo,
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
      ajaxSetup: function(s, h) {
        return h ? (
          // Building a settings object
          Me(Me(s, u.ajaxSettings), h)
        ) : (
          // Extending ajaxSettings
          Me(u.ajaxSettings, s)
        );
      },
      ajaxPrefilter: mu(Bu),
      ajaxTransport: mu(Ti),
      // Main method
      ajax: function(s, h) {
        typeof s == "object" && (h = s, s = void 0), h = h || {};
        var m, y, b, E, I, P, V, X, Z = u.ajaxSetup({}, h), mA = Z.context || Z, HA = Z.context && (mA.nodeType || mA.jquery) ? u(mA) : u.event, vA = u.Deferred(), ie = u.Callbacks("once memory"), YA = Z.statusCode || {}, ue = {}, pt = {}, Je = 0, Zn = "canceled", KA = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(le) {
            var qe;
            if (Je === 2) {
              if (!X)
                for (X = {}; qe = nf.exec(E); )
                  X[qe[1].toLowerCase()] = qe[2];
              qe = X[le.toLowerCase()];
            }
            return qe ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return Je === 2 ? E : null;
          },
          // Caches the header
          setRequestHeader: function(le, qe) {
            var Sn = le.toLowerCase();
            return Je || (le = pt[Sn] = pt[Sn] || le, ue[le] = qe), this;
          },
          // Overrides response content-type header
          overrideMimeType: function(le) {
            return Je || (Z.mimeType = le), this;
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
            var qe = le || Zn;
            return V && V.abort(qe), ct(0, qe), this;
          }
        };
        if (vA.promise(KA).complete = ie.add, KA.success = KA.done, KA.error = KA.fail, Z.url = ((s || Z.url || Eo) + "").replace(tf, "").replace(af, ti[1] + "//"), Z.type = h.method || h.type || Z.method || Z.type, Z.dataTypes = u.trim(Z.dataType || "*").toLowerCase().match(fA) || [""], Z.crossDomain == null && (m = gu.exec(Z.url.toLowerCase()), Z.crossDomain = !!(m && (m[1] !== ti[1] || m[2] !== ti[2] || (m[3] || (m[1] === "http:" ? "80" : "443")) !== (ti[3] || (ti[1] === "http:" ? "80" : "443"))))), Z.data && Z.processData && typeof Z.data != "string" && (Z.data = u.param(Z.data, Z.traditional)), vu(Bu, Z, h, KA), Je === 2)
          return KA;
        P = u.event && Z.global, P && u.active++ === 0 && u.event.trigger("ajaxStart"), Z.type = Z.type.toUpperCase(), Z.hasContent = !rf.test(Z.type), b = Z.url, Z.hasContent || (Z.data && (b = Z.url += (Fa.test(b) ? "&" : "?") + Z.data, delete Z.data), Z.cache === !1 && (Z.url = hu.test(b) ? (
          // If there is already a '_' parameter, set its value
          b.replace(hu, "$1_=" + Qa++)
        ) : (
          // Otherwise add one to the end
          b + (Fa.test(b) ? "&" : "?") + "_=" + Qa++
        ))), Z.ifModified && (u.lastModified[b] && KA.setRequestHeader("If-Modified-Since", u.lastModified[b]), u.etag[b] && KA.setRequestHeader("If-None-Match", u.etag[b])), (Z.data && Z.hasContent && Z.contentType !== !1 || h.contentType) && KA.setRequestHeader("Content-Type", Z.contentType), KA.setRequestHeader(
          "Accept",
          Z.dataTypes[0] && Z.accepts[Z.dataTypes[0]] ? Z.accepts[Z.dataTypes[0]] + (Z.dataTypes[0] !== "*" ? ", " + wu + "; q=0.01" : "") : Z.accepts["*"]
        );
        for (y in Z.headers)
          KA.setRequestHeader(y, Z.headers[y]);
        if (Z.beforeSend && (Z.beforeSend.call(mA, KA, Z) === !1 || Je === 2))
          return KA.abort();
        Zn = "abort";
        for (y in { success: 1, error: 1, complete: 1 })
          KA[y](Z[y]);
        if (V = vu(Ti, Z, h, KA), !V)
          ct(-1, "No Transport");
        else {
          if (KA.readyState = 1, P && HA.trigger("ajaxSend", [KA, Z]), Je === 2)
            return KA;
          Z.async && Z.timeout > 0 && (I = e.setTimeout(function() {
            KA.abort("timeout");
          }, Z.timeout));
          try {
            Je = 1, V.send(ue, ct);
          } catch (le) {
            if (Je < 2)
              ct(-1, le);
            else
              throw le;
          }
        }
        function ct(le, qe, Sn, ba) {
          var Ht, Ln, Ar, Tn, Ke, St = qe;
          Je !== 2 && (Je = 2, I && e.clearTimeout(I), V = void 0, E = ba || "", KA.readyState = le > 0 ? 4 : 0, Ht = le >= 200 && le < 300 || le === 304, Sn && (Tn = Pe(Z, KA, Sn)), Tn = of(Z, Tn, KA, Ht), Ht ? (Z.ifModified && (Ke = KA.getResponseHeader("Last-Modified"), Ke && (u.lastModified[b] = Ke), Ke = KA.getResponseHeader("etag"), Ke && (u.etag[b] = Ke)), le === 204 || Z.type === "HEAD" ? St = "nocontent" : le === 304 ? St = "notmodified" : (St = Tn.state, Ln = Tn.data, Ar = Tn.error, Ht = !Ar)) : (Ar = St, (le || !St) && (St = "error", le < 0 && (le = 0))), KA.status = le, KA.statusText = (qe || St) + "", Ht ? vA.resolveWith(mA, [Ln, St, KA]) : vA.rejectWith(mA, [KA, St, Ar]), KA.statusCode(YA), YA = void 0, P && HA.trigger(
            Ht ? "ajaxSuccess" : "ajaxError",
            [KA, Z, Ht ? Ln : Ar]
          ), ie.fireWith(mA, [KA, St]), P && (HA.trigger("ajaxComplete", [KA, Z]), --u.active || u.event.trigger("ajaxStop")));
        }
        return KA;
      },
      getJSON: function(s, h, m) {
        return u.get(s, h, m, "json");
      },
      getScript: function(s, h) {
        return u.get(s, void 0, h, "script");
      }
    }), u.each(["get", "post"], function(s, h) {
      u[h] = function(m, y, b, E) {
        return u.isFunction(y) && (E = E || b, b = y, y = void 0), u.ajax(u.extend({
          url: m,
          type: h,
          dataType: E,
          data: y,
          success: b
        }, u.isPlainObject(m) && m));
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
          return this.each(function(m) {
            u(this).wrapAll(s.call(this, m));
          });
        if (this[0]) {
          var h = u(s, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && h.insertBefore(this[0]), h.map(function() {
            for (var m = this; m.firstChild && m.firstChild.nodeType === 1; )
              m = m.firstChild;
            return m;
          }).append(this);
        }
        return this;
      },
      wrapInner: function(s) {
        return u.isFunction(s) ? this.each(function(h) {
          u(this).wrapInner(s.call(this, h));
        }) : this.each(function() {
          var h = u(this), m = h.contents();
          m.length ? m.wrapAll(s) : h.append(s);
        });
      },
      wrap: function(s) {
        var h = u.isFunction(s);
        return this.each(function(m) {
          u(this).wrapAll(h ? s.call(this, m) : s);
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
    function At(s, h, m, y) {
      var b;
      if (u.isArray(h))
        u.each(h, function(E, I) {
          m || cf.test(s) ? y(s, I) : At(
            s + "[" + (typeof I == "object" && I != null ? E : "") + "]",
            I,
            m,
            y
          );
        });
      else if (!m && u.type(h) === "object")
        for (b in h)
          At(s + "[" + b + "]", h[b], m, y);
      else
        y(s, h);
    }
    u.param = function(s, h) {
      var m, y = [], b = function(E, I) {
        I = u.isFunction(I) ? I() : I ?? "", y[y.length] = encodeURIComponent(E) + "=" + encodeURIComponent(I);
      };
      if (h === void 0 && (h = u.ajaxSettings && u.ajaxSettings.traditional), u.isArray(s) || s.jquery && !u.isPlainObject(s))
        u.each(s, function() {
          b(this.name, this.value);
        });
      else
        for (m in s)
          At(m, s[m], h, b);
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
          return this.name && !u(this).is(":disabled") && ff.test(this.nodeName) && !Cu.test(s) && (this.checked || !jA.test(s));
        }).map(function(s, h) {
          var m = u(this).val();
          return m == null ? null : u.isArray(m) ? u.map(m, function(y) {
            return { name: h.name, value: y.replace(yu, `\r
`) };
          }) : { name: h.name, value: m.replace(yu, `\r
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
    var _o = 0, hn = {}, ni = u.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
      for (var s in hn)
        hn[s](void 0, !0);
    }), g.cors = !!ni && "withCredentials" in ni, ni = g.ajax = !!ni, ni && u.ajaxTransport(function(s) {
      if (!s.crossDomain || g.cors) {
        var h;
        return {
          send: function(m, y) {
            var b, E = s.xhr(), I = ++_o;
            if (E.open(
              s.type,
              s.url,
              s.async,
              s.username,
              s.password
            ), s.xhrFields)
              for (b in s.xhrFields)
                E[b] = s.xhrFields[b];
            s.mimeType && E.overrideMimeType && E.overrideMimeType(s.mimeType), !s.crossDomain && !m["X-Requested-With"] && (m["X-Requested-With"] = "XMLHttpRequest");
            for (b in m)
              m[b] !== void 0 && E.setRequestHeader(b, m[b] + "");
            E.send(s.hasContent && s.data || null), h = function(P, V) {
              var X, Z, mA;
              if (h && (V || E.readyState === 4))
                if (delete hn[I], h = void 0, E.onreadystatechange = u.noop, V)
                  E.readyState !== 4 && E.abort();
                else {
                  mA = {}, X = E.status, typeof E.responseText == "string" && (mA.text = E.responseText);
                  try {
                    Z = E.statusText;
                  } catch {
                    Z = "";
                  }
                  !X && s.isLocal && !s.crossDomain ? X = mA.text ? 200 : 404 : X === 1223 && (X = 204);
                }
              mA && y(X, Z, mA, E.getAllResponseHeaders());
            }, s.async ? E.readyState === 4 ? e.setTimeout(h) : E.onreadystatechange = hn[I] = h : h();
          },
          abort: function() {
            h && h(void 0, !0);
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
        var h, m = i.head || u("head")[0] || i.documentElement;
        return {
          send: function(y, b) {
            h = i.createElement("script"), h.async = !0, s.scriptCharset && (h.charset = s.scriptCharset), h.src = s.url, h.onload = h.onreadystatechange = function(E, I) {
              (I || !h.readyState || /loaded|complete/.test(h.readyState)) && (h.onload = h.onreadystatechange = null, h.parentNode && h.parentNode.removeChild(h), h = null, I || b(200, "success"));
            }, m.insertBefore(h, m.firstChild);
          },
          abort: function() {
            h && h.onload(void 0, !0);
          }
        };
      }
    });
    var xo = [], Ua = /(=)\?(?=&|$)|\?\?/;
    u.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var s = xo.pop() || u.expando + "_" + Qa++;
        return this[s] = !0, s;
      }
    }), u.ajaxPrefilter("json jsonp", function(s, h, m) {
      var y, b, E, I = s.jsonp !== !1 && (Ua.test(s.url) ? "url" : typeof s.data == "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Ua.test(s.data) && "data");
      if (I || s.dataTypes[0] === "jsonp")
        return y = s.jsonpCallback = u.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, I ? s[I] = s[I].replace(Ua, "$1" + y) : s.jsonp !== !1 && (s.url += (Fa.test(s.url) ? "&" : "?") + s.jsonp + "=" + y), s.converters["script json"] = function() {
          return E || u.error(y + " was not called"), E[0];
        }, s.dataTypes[0] = "json", b = e[y], e[y] = function() {
          E = arguments;
        }, m.always(function() {
          b === void 0 ? u(e).removeProp(y) : e[y] = b, s[y] && (s.jsonpCallback = h.jsonpCallback, xo.push(y)), E && u.isFunction(b) && b(E[0]), E = b = void 0;
        }), "script";
    }), u.parseHTML = function(s, h, m) {
      if (!s || typeof s != "string")
        return null;
      typeof h == "boolean" && (m = h, h = !1), h = h || i;
      var y = cA.exec(s), b = !m && [];
      return y ? [h.createElement(y[1])] : (y = mt([s], h, b), b && b.length && u(b).remove(), u.merge([], y.childNodes));
    };
    var Io = u.fn.load;
    u.fn.load = function(s, h, m) {
      if (typeof s != "string" && Io)
        return Io.apply(this, arguments);
      var y, b, E, I = this, P = s.indexOf(" ");
      return P > -1 && (y = u.trim(s.slice(P, s.length)), s = s.slice(0, P)), u.isFunction(h) ? (m = h, h = void 0) : h && typeof h == "object" && (b = "POST"), I.length > 0 && u.ajax({
        url: s,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: b || "GET",
        dataType: "html",
        data: h
      }).done(function(V) {
        E = arguments, I.html(y ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          u("<div>").append(u.parseHTML(V)).find(y)
        ) : (
          // Otherwise use the full result
          V
        ));
      }).always(m && function(V, X) {
        I.each(function() {
          m.apply(this, E || [V.responseText, X, V]);
        });
      }), this;
    }, u.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(s, h) {
      u.fn[h] = function(m) {
        return this.on(h, m);
      };
    }), u.expr.filters.animated = function(s) {
      return u.grep(u.timers, function(h) {
        return s === h.elem;
      }).length;
    };
    function Ho(s) {
      return u.isWindow(s) ? s : s.nodeType === 9 ? s.defaultView || s.parentWindow : !1;
    }
    u.offset = {
      setOffset: function(s, h, m) {
        var y, b, E, I, P, V, X, Z = u.css(s, "position"), mA = u(s), HA = {};
        Z === "static" && (s.style.position = "relative"), P = mA.offset(), E = u.css(s, "top"), V = u.css(s, "left"), X = (Z === "absolute" || Z === "fixed") && u.inArray("auto", [E, V]) > -1, X ? (y = mA.position(), I = y.top, b = y.left) : (I = parseFloat(E) || 0, b = parseFloat(V) || 0), u.isFunction(h) && (h = h.call(s, m, u.extend({}, P))), h.top != null && (HA.top = h.top - P.top + I), h.left != null && (HA.left = h.left - P.left + b), "using" in h ? h.using.call(s, HA) : mA.css(HA);
      }
    }, u.fn.extend({
      offset: function(s) {
        if (arguments.length)
          return s === void 0 ? this : this.each(function(I) {
            u.offset.setOffset(this, s, I);
          });
        var h, m, y = { top: 0, left: 0 }, b = this[0], E = b && b.ownerDocument;
        if (E)
          return h = E.documentElement, u.contains(h, b) ? (typeof b.getBoundingClientRect < "u" && (y = b.getBoundingClientRect()), m = Ho(E), {
            top: y.top + (m.pageYOffset || h.scrollTop) - (h.clientTop || 0),
            left: y.left + (m.pageXOffset || h.scrollLeft) - (h.clientLeft || 0)
          }) : y;
      },
      position: function() {
        if (this[0]) {
          var s, h, m = { top: 0, left: 0 }, y = this[0];
          return u.css(y, "position") === "fixed" ? h = y.getBoundingClientRect() : (s = this.offsetParent(), h = this.offset(), u.nodeName(s[0], "html") || (m = s.offset()), m.top += u.css(s[0], "borderTopWidth", !0), m.left += u.css(s[0], "borderLeftWidth", !0)), {
            top: h.top - m.top - u.css(y, "marginTop", !0),
            left: h.left - m.left - u.css(y, "marginLeft", !0)
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
    }), u.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(s, h) {
      var m = /Y/.test(h);
      u.fn[s] = function(y) {
        return bA(this, function(b, E, I) {
          var P = Ho(b);
          if (I === void 0)
            return P ? h in P ? P[h] : P.document.documentElement[E] : b[E];
          P ? P.scrollTo(
            m ? u(P).scrollLeft() : I,
            m ? I : u(P).scrollTop()
          ) : b[E] = I;
        }, s, y, arguments.length, null);
      };
    }), u.each(["top", "left"], function(s, h) {
      u.cssHooks[h] = yo(
        g.pixelPosition,
        function(m, y) {
          if (y)
            return y = Yn(m, h), ga.test(y) ? u(m).position()[h] + "px" : y;
        }
      );
    }), u.each({ Height: "height", Width: "width" }, function(s, h) {
      u.each(
        { padding: "inner" + s, content: h, "": "outer" + s },
        function(m, y) {
          u.fn[y] = function(b, E) {
            var I = arguments.length && (m || typeof b != "boolean"), P = m || (b === !0 || E === !0 ? "margin" : "border");
            return bA(this, function(V, X, Z) {
              var mA;
              return u.isWindow(V) ? V.document.documentElement["client" + s] : V.nodeType === 9 ? (mA = V.documentElement, Math.max(
                V.body["scroll" + s],
                mA["scroll" + s],
                V.body["offset" + s],
                mA["offset" + s],
                mA["client" + s]
              )) : Z === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                u.css(V, X, P)
              ) : (
                // Set width or height on the element
                u.style(V, X, Z, P)
              );
            }, h, I ? b : void 0, I, null);
          };
        }
      );
    }), u.fn.extend({
      bind: function(s, h, m) {
        return this.on(s, null, h, m);
      },
      unbind: function(s, h) {
        return this.off(s, null, h);
      },
      delegate: function(s, h, m, y) {
        return this.on(h, s, m, y);
      },
      undelegate: function(s, h, m) {
        return arguments.length === 1 ? this.off(s, "**") : this.off(h, s || "**", m);
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
const oe = /* @__PURE__ */ xc(_O), xO = function(A) {
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
  }, t = xe.merge({}, e, A), n = function(o) {
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
      var d = VA(this).selectAll(".chromosome-size-label").data([l]);
      c = d.enter().append("g").attr("class", "chromosome-size-label"), c.append("text");
      var w = 10 + t.sizeLayout.y + t.sizeLayout.cellHeight * l.length / t.longestChromosome, B = 1.2 * t.labelSize / Math.min(5, t.scale) + "px";
      VA(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + t.sizeLayout.x + "," + w + ")"
      ), d = VA(this).selectAll(".chromosome-size-label").select("text").attr("x", t.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", B).text(n(l.length)), d.exit().remove();
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
    onAnnotationSelectFunction: oe.noop(),
    drawing: null
  }, t = xe.merge({}, e, A), n = function() {
    return da().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(d) {
    var w = n(), B = w(d.length), g = VA(this);
    g.attr("id", "chromosome_" + d.number).attr(
      "transform",
      "translate(" + t.layout.x + "," + t.layout.y + ")"
    ), g.select("defs").html("").append("mask").attr("id", "chromosome_mask_" + d.number).append("rect").attr("class", "mask_rect"), g.select("#chromosome_mask_" + d.number).attr("width", t.layout.width).attr("height", B);
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
      var _ = w.invert(u[0].start), M = w.invert(u[0].end);
      if (_ > M) {
        var K = _;
        _ = M, M = K;
      }
      var z = d.layout.geneBandNodes.filter(function(cA) {
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
    t.bands == "basemap" ? H = o : t.bands == "genes" && (H = f), H(U, d), g.select(".bands_container").style("mask", "url(#chromosome_mask_" + d.number + ")");
  }, o = function(d, w) {
    var B = n(), g = d.selectAll("rect.band").data(w.bands);
    g.enter().append("rect").attr("class", "band"), g.attr("width", t.layout.width).attr("y", function(v) {
      return B(v.start);
    }).attr("height", function(v) {
      return B(v.end - v.start);
    }).attr("fill", function(v) {
      return v.color;
    }), g.exit().remove();
  }, l = function(d, w) {
    var B = w.end - w.start, g = d(B), v;
    if (g * t.scale > 2)
      v = { y: d(w.start), height: g };
    else {
      let u = Math.min(2 / t.scale, 2);
      v = { y: d(w.midpoint) - u / 2, height: u };
    }
    return v.fill = w.color, v.width = t.layout.width, v["fill-opacity"] = 0.8, v["stroke-dasharray"] = [
      0,
      t.layout.width,
      v.height,
      t.layout.width + v.height
    ], v["stroke-width"] = t.layout.width / 5, v;
  }, f = function(d, w) {
    var B = n(), g = d.selectAll("rect.band"), v = g.data(w.layout.geneBandNodes);
    v.enter().append("rect").attr("id", function(C) {
      return C.data.id;
    }).attr("class", "band geneline infobox"), v.each(function(C) {
      let F = l(B, C);
      VA(this).attr("y", F.y).attr("height", F.height).attr("fill", F.fill).attr("width", F.width).attr("fill-opacity", F["fill-opacity"]).attr("stroke-dasharray", F["stroke-dasharray"]).attr("stroke-width", F["stroke-width"]);
    }), v.classed("selected", function(C) {
      return C.data.selected;
    });
    var u = g.data(w.bands);
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
  function c(d) {
    d.each(function(w) {
      var B = VA(this).selectAll(".chromosome").data([w]), g = B.enter().append("g").attr("class", "chromosome");
      g.append("defs"), g.append("rect").classed("background", !0), g.append("g").classed("bands_container", !0), g.append("rect").classed("outline", !0), t.border && g.append("rect").classed("border", !0), VA(this).selectAll(".chromosome").each(i), B.exit().remove();
    });
  }
  return c.onAnnotationSelectFunction = function(d) {
    return arguments.length ? (t.onAnnotationSelectFunction = d, c) : t.onAnnotationSelectFunction;
  }, c.layout = function(d) {
    return arguments.length ? (t.layout = d, c) : t.layout;
  }, c.drawing = function(d) {
    return arguments.length ? (t.drawing = d, c) : t.drawing;
  }, c.longestChromosome = function(d) {
    return arguments.length ? (t.longestChromosome = d, c) : t.longestChromosome;
  }, c.bands = function(d) {
    return arguments.length ? (t.bands = d, c) : t.bands;
  }, c.scale = function(d) {
    return arguments.length ? (t.scale = d, c) : t.scale;
  }, c.infoBoxManager = function(d) {
    return arguments.length ? (t.infoBoxManager = d, c) : t.infoBoxManager;
  }, c;
};
var tn = "top", bn = "bottom", En = "right", nn = "left", $p = "auto", Ws = [tn, bn, En, nn], uo = "start", Ts = "end", HO = "clippingParents", L0 = "viewport", As = "popper", SO = "reference", Mw = /* @__PURE__ */ Ws.reduce(function(A, e) {
  return A.concat([e + "-" + uo, e + "-" + Ts]);
}, []), T0 = /* @__PURE__ */ [].concat(Ws, [$p]).reduce(function(A, e) {
  return A.concat([e, e + "-" + uo, e + "-" + Ts]);
}, []), LO = "beforeRead", TO = "read", DO = "afterRead", OO = "beforeMain", NO = "main", MO = "afterMain", PO = "beforeWrite", KO = "write", RO = "afterWrite", kO = [LO, TO, DO, OO, NO, MO, PO, KO, RO];
function hr(A) {
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
function fa(A) {
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
    !Un(o) || !hr(o) || (Object.assign(o.style, n), Object.keys(i).forEach(function(l) {
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
      var i = e.elements[n], o = e.attributes[n] || {}, l = Object.keys(e.styles.hasOwnProperty(n) ? e.styles[n] : t[n]), f = l.reduce(function(c, d) {
        return c[d] = "", c;
      }, {});
      !Un(i) || !hr(i) || (Object.assign(i.style, f), Object.keys(o).forEach(function(c) {
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
function dr(A) {
  return A.split("-")[0];
}
var ra = Math.max, Bc = Math.min, lo = Math.round;
function ch() {
  var A = navigator.userAgentData;
  return A != null && A.brands && Array.isArray(A.brands) ? A.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function O0() {
  return !/^((?!chrome|android).)*safari/i.test(ch());
}
function co(A, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var n = A.getBoundingClientRect(), i = 1, o = 1;
  e && Un(A) && (i = A.offsetWidth > 0 && lo(n.width) / A.offsetWidth || 1, o = A.offsetHeight > 0 && lo(n.height) / A.offsetHeight || 1);
  var l = fa(A) ? cn(A) : window, f = l.visualViewport, c = !O0() && t, d = (n.left + (c && f ? f.offsetLeft : 0)) / i, w = (n.top + (c && f ? f.offsetTop : 0)) / o, B = n.width / i, g = n.height / o;
  return {
    width: B,
    height: g,
    top: w,
    right: d + B,
    bottom: w + g,
    left: d,
    x: d,
    y: w
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
  return ["table", "td", "th"].indexOf(hr(A)) >= 0;
}
function Ei(A) {
  return ((fa(A) ? A.ownerDocument : (
    // $FlowFixMe[prop-missing]
    A.document
  )) || window.document).documentElement;
}
function Kc(A) {
  return hr(A) === "html" ? A : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    A.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    A.parentNode || // DOM Element detected
    (Gp(A) ? A.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Ei(A)
  );
}
function Pw(A) {
  return !Un(A) || // https://github.com/popperjs/popper-core/issues/837
  Wr(A).position === "fixed" ? null : A.offsetParent;
}
function WO(A) {
  var e = /firefox/i.test(ch()), t = /Trident/i.test(ch());
  if (t && Un(A)) {
    var n = Wr(A);
    if (n.position === "fixed")
      return null;
  }
  var i = Kc(A);
  for (Gp(i) && (i = i.host); Un(i) && ["html", "body"].indexOf(hr(i)) < 0; ) {
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
  return t && (hr(t) === "html" || hr(t) === "body" && Wr(t).position === "static") ? e : t || WO(A) || e;
}
function Wp(A) {
  return ["top", "bottom"].indexOf(A) >= 0 ? "x" : "y";
}
function ys(A, e, t) {
  return ra(A, Bc(e, t));
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
  var e, t = A.state, n = A.name, i = A.options, o = t.elements.arrow, l = t.modifiersData.popperOffsets, f = dr(t.placement), c = Wp(f), d = [nn, En].indexOf(f) >= 0, w = d ? "height" : "width";
  if (!(!o || !l)) {
    var B = qO(i.padding, t), g = Vp(o), v = c === "y" ? tn : nn, u = c === "y" ? bn : En, C = t.rects.reference[w] + t.rects.reference[c] - l[c] - t.rects.popper[w], F = l[c] - t.rects.reference[c], U = Xs(o), H = U ? c === "y" ? U.clientHeight || 0 : U.clientWidth || 0 : 0, O = C / 2 - F / 2, _ = B[v], M = H - g[w] - B[u], K = H / 2 - g[w] / 2 + O, z = ys(_, K, M), cA = c;
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
  var e, t = A.popper, n = A.popperRect, i = A.placement, o = A.variation, l = A.offsets, f = A.position, c = A.gpuAcceleration, d = A.adaptive, w = A.roundOffsets, B = A.isFixed, g = l.x, v = g === void 0 ? 0 : g, u = l.y, C = u === void 0 ? 0 : u, F = typeof w == "function" ? w({
    x: v,
    y: C
  }) : {
    x: v,
    y: C
  };
  v = F.x, C = F.y;
  var U = l.hasOwnProperty("x"), H = l.hasOwnProperty("y"), O = nn, _ = tn, M = window;
  if (d) {
    var K = Xs(t), z = "clientHeight", cA = "clientWidth";
    if (K === cn(t) && (K = Ei(t), Wr(K).position !== "static" && f === "absolute" && (z = "scrollHeight", cA = "scrollWidth")), K = K, i === tn || (i === nn || i === En) && o === Ts) {
      _ = bn;
      var sA = B && K === M && M.visualViewport ? M.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        K[z]
      );
      C -= sA - n.height, C *= c ? 1 : -1;
    }
    if (i === nn || (i === tn || i === bn) && o === Ts) {
      O = En;
      var gA = B && K === M && M.visualViewport ? M.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        K[cA]
      );
      v -= gA - n.width, v *= c ? 1 : -1;
    }
  }
  var FA = Object.assign({
    position: f
  }, d && YO), NA = w === !0 ? ZO({
    x: v,
    y: C
  }, cn(t)) : {
    x: v,
    y: C
  };
  if (v = NA.x, C = NA.y, c) {
    var _A;
    return Object.assign({}, FA, (_A = {}, _A[_] = H ? "0" : "", _A[O] = U ? "0" : "", _A.transform = (M.devicePixelRatio || 1) <= 1 ? "translate(" + v + "px, " + C + "px)" : "translate3d(" + v + "px, " + C + "px, 0)", _A));
  }
  return Object.assign({}, FA, (e = {}, e[_] = H ? C + "px" : "", e[O] = U ? v + "px" : "", e.transform = "", e));
}
function A4(A) {
  var e = A.state, t = A.options, n = t.gpuAcceleration, i = n === void 0 ? !0 : n, o = t.adaptive, l = o === void 0 ? !0 : o, f = t.roundOffsets, c = f === void 0 ? !0 : f, d = {
    placement: dr(e.placement),
    variation: fo(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, Kw(Object.assign({}, d, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: l,
    roundOffsets: c
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, Kw(Object.assign({}, d, {
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
var hl = {
  passive: !0
};
function t4(A) {
  var e = A.state, t = A.instance, n = A.options, i = n.scroll, o = i === void 0 ? !0 : i, l = n.resize, f = l === void 0 ? !0 : l, c = cn(e.elements.popper), d = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return o && d.forEach(function(w) {
    w.addEventListener("scroll", t.update, hl);
  }), f && c.addEventListener("resize", t.update, hl), function() {
    o && d.forEach(function(w) {
      w.removeEventListener("scroll", t.update, hl);
    }), f && c.removeEventListener("resize", t.update, hl);
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
  return co(Ei(A)).left + Xp(A).scrollLeft;
}
function a4(A, e) {
  var t = cn(A), n = Ei(A), i = t.visualViewport, o = n.clientWidth, l = n.clientHeight, f = 0, c = 0;
  if (i) {
    o = i.width, l = i.height;
    var d = O0();
    (d || !d && e === "fixed") && (f = i.offsetLeft, c = i.offsetTop);
  }
  return {
    width: o,
    height: l,
    x: f + qp(A),
    y: c
  };
}
function o4(A) {
  var e, t = Ei(A), n = Xp(A), i = (e = A.ownerDocument) == null ? void 0 : e.body, o = ra(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), l = ra(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), f = -n.scrollLeft + qp(A), c = -n.scrollTop;
  return Wr(i || t).direction === "rtl" && (f += ra(t.clientWidth, i ? i.clientWidth : 0) - o), {
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
  return ["html", "body", "#document"].indexOf(hr(A)) >= 0 ? A.ownerDocument.body : Un(A) && zp(A) ? A : R0(Kc(A));
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
function fh(A) {
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
  return e === L0 ? fh(a4(A, t)) : fa(e) ? s4(e, t) : fh(o4(Ei(A)));
}
function u4(A) {
  var e = Cs(Kc(A)), t = ["absolute", "fixed"].indexOf(Wr(A).position) >= 0, n = t && Un(A) ? Xs(A) : A;
  return fa(n) ? e.filter(function(i) {
    return fa(i) && N0(i, n) && hr(i) !== "body";
  }) : [];
}
function l4(A, e, t, n) {
  var i = e === "clippingParents" ? u4(A) : [].concat(e), o = [].concat(i, [t]), l = o[0], f = o.reduce(function(c, d) {
    var w = kw(A, d, n);
    return c.top = ra(w.top, c.top), c.right = Bc(w.right, c.right), c.bottom = Bc(w.bottom, c.bottom), c.left = ra(w.left, c.left), c;
  }, kw(A, l, n));
  return f.width = f.right - f.left, f.height = f.bottom - f.top, f.x = f.left, f.y = f.top, f;
}
function k0(A) {
  var e = A.reference, t = A.element, n = A.placement, i = n ? dr(n) : null, o = n ? fo(n) : null, l = e.x + e.width / 2 - t.width / 2, f = e.y + e.height / 2 - t.height / 2, c;
  switch (i) {
    case tn:
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
    case En:
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
  var d = i ? Wp(i) : null;
  if (d != null) {
    var w = d === "y" ? "height" : "width";
    switch (o) {
      case uo:
        c[d] = c[d] - (e[w] / 2 - t[w] / 2);
        break;
      case Ts:
        c[d] = c[d] + (e[w] / 2 - t[w] / 2);
        break;
    }
  }
  return c;
}
function Ds(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = n === void 0 ? A.placement : n, o = t.strategy, l = o === void 0 ? A.strategy : o, f = t.boundary, c = f === void 0 ? HO : f, d = t.rootBoundary, w = d === void 0 ? L0 : d, B = t.elementContext, g = B === void 0 ? As : B, v = t.altBoundary, u = v === void 0 ? !1 : v, C = t.padding, F = C === void 0 ? 0 : C, U = P0(typeof F != "number" ? F : K0(F, Ws)), H = g === As ? SO : As, O = A.rects.popper, _ = A.elements[u ? H : g], M = l4(fa(_) ? _ : _.contextElement || Ei(A.elements.popper), c, w, l), K = co(A.elements.reference), z = k0({
    reference: K,
    element: O,
    strategy: "absolute",
    placement: i
  }), cA = fh(Object.assign({}, O, z)), sA = g === As ? cA : K, gA = {
    top: M.top - sA.top + U.top,
    bottom: sA.bottom - M.bottom + U.bottom,
    left: M.left - sA.left + U.left,
    right: sA.right - M.right + U.right
  }, FA = A.modifiersData.offset;
  if (g === As && FA) {
    var NA = FA[i];
    Object.keys(gA).forEach(function(_A) {
      var W = [En, bn].indexOf(_A) >= 0 ? 1 : -1, yA = [tn, bn].indexOf(_A) >= 0 ? "y" : "x";
      gA[_A] += NA[yA] * W;
    });
  }
  return gA;
}
function c4(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = t.boundary, o = t.rootBoundary, l = t.padding, f = t.flipVariations, c = t.allowedAutoPlacements, d = c === void 0 ? T0 : c, w = fo(n), B = w ? f ? Mw : Mw.filter(function(u) {
    return fo(u) === w;
  }) : Ws, g = B.filter(function(u) {
    return d.indexOf(u) >= 0;
  });
  g.length === 0 && (g = B);
  var v = g.reduce(function(u, C) {
    return u[C] = Ds(A, {
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
function f4(A) {
  if (dr(A) === $p)
    return [];
  var e = Jl(A);
  return [Rw(A), e, Rw(e)];
}
function d4(A) {
  var e = A.state, t = A.options, n = A.name;
  if (!e.modifiersData[n]._skip) {
    for (var i = t.mainAxis, o = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !0 : l, c = t.fallbackPlacements, d = t.padding, w = t.boundary, B = t.rootBoundary, g = t.altBoundary, v = t.flipVariations, u = v === void 0 ? !0 : v, C = t.allowedAutoPlacements, F = e.options.placement, U = dr(F), H = U === F, O = c || (H || !u ? [Jl(F)] : f4(F)), _ = [F].concat(O).reduce(function(L, R) {
      return L.concat(dr(R) === $p ? c4(e, {
        placement: R,
        boundary: w,
        rootBoundary: B,
        padding: d,
        flipVariations: u,
        allowedAutoPlacements: C
      }) : R);
    }, []), M = e.rects.reference, K = e.rects.popper, z = /* @__PURE__ */ new Map(), cA = !0, sA = _[0], gA = 0; gA < _.length; gA++) {
      var FA = _[gA], NA = dr(FA), _A = fo(FA) === uo, W = [tn, bn].indexOf(NA) >= 0, yA = W ? "width" : "height", eA = Ds(e, {
        placement: FA,
        boundary: w,
        rootBoundary: B,
        altBoundary: g,
        padding: d
      }), fA = W ? _A ? En : nn : _A ? bn : tn;
      M[yA] > K[yA] && (fA = Jl(fA));
      var EA = Jl(fA), xA = [];
      if (o && xA.push(eA[NA] <= 0), f && xA.push(eA[fA] <= 0, eA[EA] <= 0), xA.every(function(L) {
        return L;
      })) {
        sA = FA, cA = !1;
        break;
      }
      z.set(FA, xA);
    }
    if (cA)
      for (var iA = u ? 3 : 1, T = function(R) {
        var nA = _.find(function(QA) {
          var UA = z.get(QA);
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
const h4 = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: d4,
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
  return [tn, En, bn, nn].some(function(e) {
    return A[e] >= 0;
  });
}
function p4(A) {
  var e = A.state, t = A.name, n = e.rects.reference, i = e.rects.popper, o = e.modifiersData.preventOverflow, l = Ds(e, {
    elementContext: "reference"
  }), f = Ds(e, {
    altBoundary: !0
  }), c = $w(l, n), d = $w(f, i, o), w = Gw(c), B = Gw(d);
  e.modifiersData[t] = {
    referenceClippingOffsets: c,
    popperEscapeOffsets: d,
    isReferenceHidden: w,
    hasPopperEscaped: B
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": w,
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
  var n = dr(A), i = [nn, tn].indexOf(n) >= 0 ? -1 : 1, o = typeof t == "function" ? t(Object.assign({}, e, {
    placement: A
  })) : t, l = o[0], f = o[1];
  return l = l || 0, f = (f || 0) * i, [nn, En].indexOf(n) >= 0 ? {
    x: f,
    y: l
  } : {
    x: l,
    y: f
  };
}
function w4(A) {
  var e = A.state, t = A.options, n = A.name, i = t.offset, o = i === void 0 ? [0, 0] : i, l = T0.reduce(function(w, B) {
    return w[B] = B4(B, e.rects, o), w;
  }, {}), f = l[e.placement], c = f.x, d = f.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += c, e.modifiersData.popperOffsets.y += d), e.modifiersData[n] = l;
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
  var e = A.state, t = A.options, n = A.name, i = t.mainAxis, o = i === void 0 ? !0 : i, l = t.altAxis, f = l === void 0 ? !1 : l, c = t.boundary, d = t.rootBoundary, w = t.altBoundary, B = t.padding, g = t.tether, v = g === void 0 ? !0 : g, u = t.tetherOffset, C = u === void 0 ? 0 : u, F = Ds(e, {
    boundary: c,
    rootBoundary: d,
    padding: B,
    altBoundary: w
  }), U = dr(e.placement), H = fo(e.placement), O = !H, _ = Wp(U), M = C4(_), K = e.modifiersData.popperOffsets, z = e.rects.reference, cA = e.rects.popper, sA = typeof C == "function" ? C(Object.assign({}, e.rects, {
    placement: e.placement
  })) : C, gA = typeof sA == "number" ? {
    mainAxis: sA,
    altAxis: sA
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, sA), FA = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, NA = {
    x: 0,
    y: 0
  };
  if (K) {
    if (o) {
      var _A, W = _ === "y" ? tn : nn, yA = _ === "y" ? bn : En, eA = _ === "y" ? "height" : "width", fA = K[_], EA = fA + F[W], xA = fA - F[yA], iA = v ? -cA[eA] / 2 : 0, T = H === uo ? z[eA] : cA[eA], AA = H === uo ? -cA[eA] : -z[eA], J = e.elements.arrow, L = v && J ? Vp(J) : {
        width: 0,
        height: 0
      }, R = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : M0(), nA = R[W], QA = R[yA], UA = ys(0, z[eA], L[eA]), qA = O ? z[eA] / 2 - iA - UA - nA - gA.mainAxis : T - UA - nA - gA.mainAxis, te = O ? -z[eA] / 2 + iA + UA + QA + gA.mainAxis : AA + UA + QA + gA.mainAxis, zA = e.elements.arrow && Xs(e.elements.arrow), SA = zA ? _ === "y" ? zA.clientTop || 0 : zA.clientLeft || 0 : 0, aA = (_A = FA == null ? void 0 : FA[_]) != null ? _A : 0, wA = fA + qA - aA - SA, bA = fA + te - aA, jA = ys(v ? Bc(EA, wA) : EA, fA, v ? ra(xA, bA) : xA);
      K[_] = jA, NA[_] = jA - fA;
    }
    if (f) {
      var ge, fe = _ === "x" ? tn : nn, lt = _ === "x" ? bn : En, ke = K[M], Be = M === "y" ? "height" : "width", Le = ke + F[fe], ne = ke - F[lt], Ve = [tn, nn].indexOf(U) !== -1, Et = (ge = FA == null ? void 0 : FA[M]) != null ? ge : 0, Mt = Ve ? Le : ke - z[Be] - cA[Be] - Et + gA.altAxis, _t = Ve ? ke + z[Be] + cA[Be] - Et - gA.altAxis : ne, mt = v && Ve ? XO(Mt, ke, _t) : ys(v ? Mt : Le, ke, v ? _t : ne);
      K[M] = mt, NA[M] = mt - ke;
    }
    e.modifiersData[n] = NA;
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
function b4(A) {
  return A === cn(A) || !Un(A) ? Xp(A) : U4(A);
}
function E4(A) {
  var e = A.getBoundingClientRect(), t = lo(e.width) / A.offsetWidth || 1, n = lo(e.height) / A.offsetHeight || 1;
  return t !== 1 || n !== 1;
}
function _4(A, e, t) {
  t === void 0 && (t = !1);
  var n = Un(e), i = Un(e) && E4(e), o = Ei(e), l = co(A, i, t), f = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (n || !n && !t) && ((hr(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  zp(o)) && (f = b4(e)), Un(e) ? (c = co(e, !0), c.x += e.clientLeft, c.y += e.clientTop) : o && (c.x = qp(o))), {
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
  return function(f, c, d) {
    d === void 0 && (d = o);
    var w = {
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
      state: w,
      setOptions: function(U) {
        var H = typeof U == "function" ? U(w.options) : U;
        C(), w.options = Object.assign({}, o, w.options, H), w.scrollParents = {
          reference: fa(f) ? Cs(f) : f.contextElement ? Cs(f.contextElement) : [],
          popper: Cs(c)
        };
        var O = I4(S4([].concat(n, w.options.modifiers)));
        return w.orderedModifiers = O.filter(function(_) {
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
          var U = w.elements, H = U.reference, O = U.popper;
          if (Ww(H, O)) {
            w.rects = {
              reference: _4(H, Xs(O), w.options.strategy === "fixed"),
              popper: Vp(O)
            }, w.reset = !1, w.placement = w.options.placement, w.orderedModifiers.forEach(function(gA) {
              return w.modifiersData[gA.name] = Object.assign({}, gA.data);
            });
            for (var _ = 0; _ < w.orderedModifiers.length; _++) {
              if (w.reset === !0) {
                w.reset = !1, _ = -1;
                continue;
              }
              var M = w.orderedModifiers[_], K = M.fn, z = M.options, cA = z === void 0 ? {} : z, sA = M.name;
              typeof K == "function" && (w = K({
                state: w,
                options: cA,
                name: sA,
                instance: v
              }) || w);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: H4(function() {
        return new Promise(function(F) {
          v.forceUpdate(), F(w);
        });
      }),
      destroy: function() {
        C(), g = !0;
      }
    };
    if (!Ww(f, c))
      return v;
    v.setOptions(d).then(function(F) {
      !g && d.onFirstUpdate && d.onFirstUpdate(F);
    });
    function u() {
      w.orderedModifiers.forEach(function(F) {
        var U = F.name, H = F.options, O = H === void 0 ? {} : H, _ = F.effect;
        if (typeof _ == "function") {
          var M = _({
            state: w,
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
var T4 = [n4, y4, e4, D0, m4, h4, F4, jO, g4], D4 = /* @__PURE__ */ L4({
  defaultModifiers: T4
}), O4 = "tippy-box", $0 = "tippy-content", N4 = "tippy-backdrop", G0 = "tippy-arrow", V0 = "tippy-svg-arrow", zi = {
  passive: !0,
  capture: !0
}, W0 = function() {
  return document.body;
};
function M4(A, e) {
  return {}.hasOwnProperty.call(A, e);
}
function md(A, e, t) {
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
function qa(A) {
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
function vd(A, e) {
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
  var e, t = qa(A), n = t[0];
  return n != null && (e = n.ownerDocument) != null && e.body ? n.ownerDocument : document;
}
function q4(A, e) {
  var t = e.clientX, n = e.clientY;
  return A.every(function(i) {
    var o = i.popperRect, l = i.popperState, f = i.props, c = f.interactiveBorder, d = k4(l.placement), w = l.modifiersData.offset;
    if (!w)
      return !0;
    var B = d === "bottom" ? w.top.y : 0, g = d === "top" ? w.bottom.y : 0, v = d === "right" ? w.left.x : 0, u = d === "left" ? w.right.x : 0, C = o.top - n + B > c, F = n - o.bottom - g > c, U = o.left - t + v > c, H = t - o.right - u > c;
    return C || F || U || H;
  });
}
function yd(A, e, t) {
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
  document.addEventListener("touchstart", z4, zi), window.addEventListener("blur", J4);
}
var Y4 = typeof window < "u" && typeof document < "u", Z4 = Y4 ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function Ka(A) {
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
function dh(A, e) {
  if (A && !Ns.has(e)) {
    var t;
    Ns.add(e), (t = console).error.apply(t, z0(e));
  }
}
function tN(A) {
  var e = !A, t = Object.prototype.toString.call(A) === "[object Object]" && !A.addEventListener;
  dh(e, ["tippy() was passed", "`" + String(A) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), dh(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
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
function hh(A, e) {
  A[oN()] = e;
}
function em(A) {
  var e = Qs();
  return A === !0 ? e.className = G0 : (e.className = V0, Os(A) ? e.appendChild(A) : hh(e, A)), e;
}
function tm(A, e) {
  Os(e.content) ? (hh(A, ""), A.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? hh(A, e.content) : A.textContent = e.content);
}
function ph(A) {
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
    var f = ph(e), c = f.box, d = f.content, w = f.arrow;
    l.theme ? c.setAttribute("data-theme", l.theme) : c.removeAttribute("data-theme"), typeof l.animation == "string" ? c.setAttribute("data-animation", l.animation) : c.removeAttribute("data-animation"), l.inertia ? c.setAttribute("data-inertia", "") : c.removeAttribute("data-inertia"), c.style.maxWidth = typeof l.maxWidth == "number" ? l.maxWidth + "px" : l.maxWidth, l.role ? c.setAttribute("role", l.role) : c.removeAttribute("role"), (o.content !== l.content || o.allowHTML !== l.allowHTML) && tm(d, A.props), l.arrow ? w ? o.arrow !== l.arrow && (c.removeChild(w), c.appendChild(em(l.arrow))) : c.appendChild(em(l.arrow)) : w && c.removeChild(w);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
Z0.$$tippy = !0;
var sN = 1, pl = [], Cd = [];
function uN(A, e) {
  var t = Am(A, Object.assign({}, ln, j0(zw(e)))), n, i, o, l = !1, f = !1, c = !1, d = !1, w, B, g, v = [], u = Xw(wA, t.interactiveDebounce), C, F = sN++, U = null, H = R4(t.plugins), O = {
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
    setProps: _t,
    setContent: mt,
    show: fn,
    hide: mr,
    hideWithInteractivity: _i,
    enable: Ve,
    disable: Et,
    unmount: qr,
    destroy: zr
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && dh(!0, "render() function has not been supplied."), _;
  var M = t.render(_), K = M.popper, z = M.onUpdate;
  K.setAttribute("data-tippy-root", ""), K.id = "tippy-" + _.id, _.popper = K, A._tippy = _, K._tippy = _;
  var cA = H.map(function(lA) {
    return lA.fn(_);
  }), sA = A.hasAttribute("aria-expanded");
  return zA(), iA(), fA(), EA("onCreate", [_]), t.showOnCreate && Le(), K.addEventListener("mouseenter", function() {
    _.props.interactive && _.state.isVisible && _.clearDelayTimeouts();
  }), K.addEventListener("mouseleave", function() {
    _.props.interactive && _.props.trigger.indexOf("mouseenter") >= 0 && W().addEventListener("mousemove", u);
  }), _;
  function gA() {
    var lA = _.props.touch;
    return Array.isArray(lA) ? lA : [lA, 0];
  }
  function FA() {
    return gA()[0] === "hold";
  }
  function NA() {
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
    return ph(K);
  }
  function eA(lA) {
    return _.state.isMounted && !_.state.isVisible || sr.isTouch || w && w.type === "focus" ? 0 : md(_.props.delay, lA ? 0 : 1, ln.delay);
  }
  function fA(lA) {
    lA === void 0 && (lA = !1), K.style.pointerEvents = _.props.interactive && !lA ? "" : "none", K.style.zIndex = "" + _.props.zIndex;
  }
  function EA(lA, DA, WA) {
    if (WA === void 0 && (WA = !0), cA.forEach(function(Qe) {
      Qe[lA] && Qe[lA].apply(Qe, DA);
    }), WA) {
      var Ce;
      (Ce = _.props)[lA].apply(Ce, DA);
    }
  }
  function xA() {
    var lA = _.props.aria;
    if (lA.content) {
      var DA = "aria-" + lA.content, WA = K.id, Ce = qa(_.props.triggerTarget || A);
      Ce.forEach(function(Qe) {
        var st = Qe.getAttribute(DA);
        if (_.state.isVisible)
          Qe.setAttribute(DA, st ? st + " " + WA : WA);
        else {
          var xt = st && st.replace(WA, "").trim();
          xt ? Qe.setAttribute(DA, xt) : Qe.removeAttribute(DA);
        }
      });
    }
  }
  function iA() {
    if (!(sA || !_.props.aria.expanded)) {
      var lA = qa(_.props.triggerTarget || A);
      lA.forEach(function(DA) {
        _.props.interactive ? DA.setAttribute("aria-expanded", _.state.isVisible && DA === _A() ? "true" : "false") : DA.removeAttribute("aria-expanded");
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
      var DA = lA.composedPath && lA.composedPath()[0] || lA.target;
      if (!(_.props.interactive && jw(K, DA))) {
        if (qa(_.props.triggerTarget || A).some(function(WA) {
          return jw(WA, DA);
        })) {
          if (sr.isTouch || _.state.isVisible && _.props.trigger.indexOf("click") >= 0)
            return;
        } else
          EA("onClickOutside", [_, lA]);
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
    lA.addEventListener("mousedown", AA, !0), lA.addEventListener("touchend", AA, zi), lA.addEventListener("touchstart", L, zi), lA.addEventListener("touchmove", J, zi);
  }
  function nA() {
    var lA = W();
    lA.removeEventListener("mousedown", AA, !0), lA.removeEventListener("touchend", AA, zi), lA.removeEventListener("touchstart", L, zi), lA.removeEventListener("touchmove", J, zi);
  }
  function QA(lA, DA) {
    qA(lA, function() {
      !_.state.isVisible && K.parentNode && K.parentNode.contains(K) && DA();
    });
  }
  function UA(lA, DA) {
    qA(lA, DA);
  }
  function qA(lA, DA) {
    var WA = yA().box;
    function Ce(Qe) {
      Qe.target === WA && (yd(WA, "remove", Ce), DA());
    }
    if (lA === 0)
      return DA();
    yd(WA, "remove", B), yd(WA, "add", Ce), B = Ce;
  }
  function te(lA, DA, WA) {
    WA === void 0 && (WA = !1);
    var Ce = qa(_.props.triggerTarget || A);
    Ce.forEach(function(Qe) {
      Qe.addEventListener(lA, DA, WA), v.push({
        node: Qe,
        eventType: lA,
        handler: DA,
        options: WA
      });
    });
  }
  function zA() {
    FA() && (te("touchstart", aA, {
      passive: !0
    }), te("touchend", bA, {
      passive: !0
    })), K4(_.props.trigger).forEach(function(lA) {
      if (lA !== "manual")
        switch (te(lA, aA), lA) {
          case "mouseenter":
            te("mouseleave", bA);
            break;
          case "focus":
            te(Z4 ? "focusout" : "blur", jA);
            break;
          case "focusin":
            te("focusout", jA);
            break;
        }
    });
  }
  function SA() {
    v.forEach(function(lA) {
      var DA = lA.node, WA = lA.eventType, Ce = lA.handler, Qe = lA.options;
      DA.removeEventListener(WA, Ce, Qe);
    }), v = [];
  }
  function aA(lA) {
    var DA, WA = !1;
    if (!(!_.state.isEnabled || ge(lA) || f)) {
      var Ce = ((DA = w) == null ? void 0 : DA.type) === "focus";
      w = lA, C = lA.currentTarget, iA(), !_.state.isVisible && G4(lA) && pl.forEach(function(Qe) {
        return Qe(lA);
      }), lA.type === "click" && (_.props.trigger.indexOf("mouseenter") < 0 || l) && _.props.hideOnClick !== !1 && _.state.isVisible ? WA = !0 : Le(lA), lA.type === "click" && (l = !WA), WA && !Ce && ne(lA);
    }
  }
  function wA(lA) {
    var DA = lA.target, WA = _A().contains(DA) || K.contains(DA);
    if (!(lA.type === "mousemove" && WA)) {
      var Ce = Be().concat(K).map(function(Qe) {
        var st, xt = Qe._tippy, _n = (st = xt.popperInstance) == null ? void 0 : st.state;
        return _n ? {
          popperRect: Qe.getBoundingClientRect(),
          popperState: _n,
          props: t
        } : null;
      }).filter(Boolean);
      q4(Ce, lA) && (T(), ne(lA));
    }
  }
  function bA(lA) {
    var DA = ge(lA) || _.props.trigger.indexOf("click") >= 0 && l;
    if (!DA) {
      if (_.props.interactive) {
        _.hideWithInteractivity(lA);
        return;
      }
      ne(lA);
    }
  }
  function jA(lA) {
    _.props.trigger.indexOf("focusin") < 0 && lA.target !== _A() || _.props.interactive && lA.relatedTarget && K.contains(lA.relatedTarget) || ne(lA);
  }
  function ge(lA) {
    return sr.isTouch ? FA() !== lA.type.indexOf("touch") >= 0 : !1;
  }
  function fe() {
    lt();
    var lA = _.props, DA = lA.popperOptions, WA = lA.placement, Ce = lA.offset, Qe = lA.getReferenceClientRect, st = lA.moveTransition, xt = NA() ? ph(K).arrow : null, _n = Qe ? {
      getBoundingClientRect: Qe,
      contextElement: Qe.contextElement || _A()
    } : A, xi = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Jr) {
        var dn = Jr.state;
        if (NA()) {
          var Hi = yA(), jr = Hi.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(vr) {
            vr === "placement" ? jr.setAttribute("data-placement", dn.placement) : dn.attributes.popper["data-popper-" + vr] ? jr.setAttribute("data-" + vr, "") : jr.removeAttribute("data-" + vr);
          }), dn.attributes.popper = {};
        }
      }
    }, xn = [{
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
        adaptive: !st
      }
    }, xi];
    NA() && xt && xn.push({
      name: "arrow",
      options: {
        element: xt,
        padding: 3
      }
    }), xn.push.apply(xn, (DA == null ? void 0 : DA.modifiers) || []), _.popperInstance = D4(_n, K, Object.assign({}, DA, {
      placement: WA,
      onFirstUpdate: g,
      modifiers: xn
    }));
  }
  function lt() {
    _.popperInstance && (_.popperInstance.destroy(), _.popperInstance = null);
  }
  function ke() {
    var lA = _.props.appendTo, DA, WA = _A();
    _.props.interactive && lA === W0 || lA === "parent" ? DA = WA.parentNode : DA = X0(lA, [WA]), DA.contains(K) || DA.appendChild(K), _.state.isMounted = !0, fe(), process.env.NODE_ENV !== "production" && Pr(_.props.interactive && lA === ln.appendTo && WA.nextElementSibling !== K, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function Be() {
    return wc(K.querySelectorAll("[data-tippy-root]"));
  }
  function Le(lA) {
    _.clearDelayTimeouts(), lA && EA("onTrigger", [_, lA]), R();
    var DA = eA(!0), WA = gA(), Ce = WA[0], Qe = WA[1];
    sr.isTouch && Ce === "hold" && Qe && (DA = Qe), DA ? n = setTimeout(function() {
      _.show();
    }, DA) : _.show();
  }
  function ne(lA) {
    if (_.clearDelayTimeouts(), EA("onUntrigger", [_, lA]), !_.state.isVisible) {
      nA();
      return;
    }
    if (!(_.props.trigger.indexOf("mouseenter") >= 0 && _.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(lA.type) >= 0 && l)) {
      var DA = eA(!1);
      DA ? i = setTimeout(function() {
        _.state.isVisible && _.hide();
      }, DA) : o = requestAnimationFrame(function() {
        _.hide();
      });
    }
  }
  function Ve() {
    _.state.isEnabled = !0;
  }
  function Et() {
    _.hide(), _.state.isEnabled = !1;
  }
  function Mt() {
    clearTimeout(n), clearTimeout(i), cancelAnimationFrame(o);
  }
  function _t(lA) {
    if (process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ka("setProps")), !_.state.isDestroyed) {
      EA("onBeforeUpdate", [_, lA]), SA();
      var DA = _.props, WA = Am(A, Object.assign({}, DA, zw(lA), {
        ignoreAttributes: !0
      }));
      _.props = WA, zA(), DA.interactiveDebounce !== WA.interactiveDebounce && (T(), u = Xw(wA, WA.interactiveDebounce)), DA.triggerTarget && !WA.triggerTarget ? qa(DA.triggerTarget).forEach(function(Ce) {
        Ce.removeAttribute("aria-expanded");
      }) : WA.triggerTarget && A.removeAttribute("aria-expanded"), iA(), fA(), z && z(DA, WA), _.popperInstance && (fe(), Be().forEach(function(Ce) {
        requestAnimationFrame(Ce._tippy.popperInstance.forceUpdate);
      })), EA("onAfterUpdate", [_, lA]);
    }
  }
  function mt(lA) {
    _.setProps({
      content: lA
    });
  }
  function fn() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ka("show"));
    var lA = _.state.isVisible, DA = _.state.isDestroyed, WA = !_.state.isEnabled, Ce = sr.isTouch && !_.props.touch, Qe = md(_.props.duration, 0, ln.duration);
    if (!(lA || DA || WA || Ce) && !_A().hasAttribute("disabled") && (EA("onShow", [_], !1), _.props.onShow(_) !== !1)) {
      if (_.state.isVisible = !0, NA() && (K.style.visibility = "visible"), fA(), R(), _.state.isMounted || (K.style.transition = "none"), NA()) {
        var st = yA(), xt = st.box, _n = st.content;
        vd([xt, _n], 0);
      }
      g = function() {
        var xn;
        if (!(!_.state.isVisible || d)) {
          if (d = !0, K.offsetHeight, K.style.transition = _.props.moveTransition, NA() && _.props.animation) {
            var Ii = yA(), Jr = Ii.box, dn = Ii.content;
            vd([Jr, dn], Qe), Jw([Jr, dn], "visible");
          }
          xA(), iA(), qw(Cd, _), (xn = _.popperInstance) == null || xn.forceUpdate(), EA("onMount", [_]), _.props.animation && NA() && UA(Qe, function() {
            _.state.isShown = !0, EA("onShown", [_]);
          });
        }
      }, ke();
    }
  }
  function mr() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ka("hide"));
    var lA = !_.state.isVisible, DA = _.state.isDestroyed, WA = !_.state.isEnabled, Ce = md(_.props.duration, 1, ln.duration);
    if (!(lA || DA || WA) && (EA("onHide", [_], !1), _.props.onHide(_) !== !1)) {
      if (_.state.isVisible = !1, _.state.isShown = !1, d = !1, l = !1, NA() && (K.style.visibility = "hidden"), T(), nA(), fA(!0), NA()) {
        var Qe = yA(), st = Qe.box, xt = Qe.content;
        _.props.animation && (vd([st, xt], Ce), Jw([st, xt], "hidden"));
      }
      xA(), iA(), _.props.animation ? NA() && QA(Ce, _.unmount) : _.unmount();
    }
  }
  function _i(lA) {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ka("hideWithInteractivity")), W().addEventListener("mousemove", u), qw(pl, u), u(lA);
  }
  function qr() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ka("unmount")), _.state.isVisible && _.hide(), _.state.isMounted && (lt(), Be().forEach(function(lA) {
      lA._tippy.unmount();
    }), K.parentNode && K.parentNode.removeChild(K), Cd = Cd.filter(function(lA) {
      return lA !== _;
    }), _.state.isMounted = !1, EA("onHidden", [_]));
  }
  function zr() {
    process.env.NODE_ENV !== "production" && Pr(_.state.isDestroyed, Ka("destroy")), !_.state.isDestroyed && (_.clearDelayTimeouts(), _.unmount(), SA(), delete A._tippy, _.state.isDestroyed = !0, EA("onDestroy", [_]));
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
  var f = i.reduce(function(c, d) {
    var w = d && uN(d, n);
    return w && c.push(w), c;
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
    onAnnotationSelectFunction: oe.noop(),
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
  }, i = function(c, d) {
    c.select("span.genelabel").text(function(g) {
      return g.label;
    }).style("font-weight", function(g) {
      return g.selected ? "bold" : "normal";
    }).style("opacity", function(g) {
      return g.visible || g.selected ? 1 : g.normedScore ? g.normedScore : g.importance;
    }).style("color", function(g) {
      return d.visible || d.selected ? d.color : null;
    });
    var w = c.select("div.btn-group");
    w.selectAll("a").data(["show", "hide", "auto"]).classed("disabled", function(g) {
      return g == "show" && d.visible || g == "hide" && d.hidden && !d.visible || g == "auto" && !d.hidden && !d.visible;
    });
  }, o = function(c, d, w) {
    var B = w.data.genesList, g = d.selectAll("p").data(B);
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
  }, l = function(c, d, w) {
    var B = w.data;
    c.append("a").attr("href", B.link).text(B.label), d.append("p").text(
      "Chromosome " + B.chromosome + ": " + B.start + "-" + B.end
    ), B.score && d.append("p").text("Score: " + parseFloat(B.score).toFixed(3)), d.append("hr");
    var g = d.append("p").style("float", "right").classed(gl.btnGroup, !0), v = function() {
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
  return f.geneAnnotationsPopoverFunction = function(c, d) {
    var w = c.data.type == "geneslist";
    VA(t.popoverId).attr("class", "popover");
    let B = VA(t.popoverId).select(".popover-title"), g = VA(t.popoverId).select(".popover-content");
    B.selectAll("*").remove(), B.text(""), g.selectAll("*").remove(), g.text(""), w ? o(B, g, c) : l(B, g, c);
    var v = d.target;
    oe(".gene-annotation-popover").remove(), qs(v, {
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
  }, t = xe.merge({}, e, A), n = null, i = function() {
    return da().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, o = function(c, d) {
    xe.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", n = fN(t);
    var w = i(), B = c.selectAll("g.gene-annotation").data(d.layout.annotationNodes, function(C) {
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
      F.data.type == "gene" && (F.data.selected = !F.data.selected, F.data.selected && (F.data.visible = !0), t.onAnnotationSelectFunction()), F.data.type == "geneslist" && t.onExpandClusterFunction(d, F.data);
    }), c.selectAll("g.gene-annotation").on("contextmenu", function(C, F) {
      n.geneAnnotationsPopoverFunction(F, C);
    });
    var u = c.selectAll("g.gene-annotation").exit();
    u.remove();
  }, l = function(c) {
    c.select("rect.border").empty() && c.append("rect").classed("border", !0), c.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  };
  function f(c) {
    c.each(function(d) {
      var w = VA(this).selectAll(".gene-annotations").data([d]);
      w.enter().append("g").attr("class", "gene-annotations"), w.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ).attr("id", function(B) {
        return "annotation_" + B.number;
      }), o(w, d), w.exit().remove(), t.border && l(w);
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
}, hN = function(A) {
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
  }, t = xe.merge({}, e, A), n = function() {
    return da().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(d, w, B, g) {
    var v = {};
    g.map(function(M, K) {
      v[M] = K;
    });
    var u = n(), C = d.selectAll("rect.snp-annotation").data(B, function(M) {
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
  }, o = function(d, w, B) {
    var g = 500, v = n();
    t.layout.width;
    var u = 0.3 * t.layout.chromosomeWidth, C = 0.4 * t.layout.chromosomeWidth, F = w.layout.qtlNodes.some(function(T) {
      return T.displayLabel;
    });
    F && (C = C * 1.5);
    var U = B * 0.2 * t.layout.chromosomeWidth, H = function(T) {
      return t.layout.width - T.labelPosition * (C + u) - U;
    }, O = function(T) {
      return t.layout.width - T.position * (C + u) - U;
    }, _ = d.selectAll("g.qtl-annotation").data(w.layout.qtlNodes, function(T) {
      return T.id;
    }), M = _.enter().append("g").classed("qtl-annotation infobox", !0);
    M.append("rect").classed("qtl-hoverbox", !0);
    var K = M.append("rect").classed("qtl-selector infobox", !0), z = {}, cA = {};
    _.exit().select("rect").each(function(T) {
      z[T.index] = xe.pick(this, ["x", "y", "width", "height"]), z[T.index].midpoint = T.midpoint, z[T.index].position = T.position;
    }), K.each(function(T) {
      cA[T.index] = xe.pick(this, ["x", "y", "width", "height"]), cA[T.index].midpoint = T.midpoint, cA[T.index].position = T.position;
    });
    var sA = function(T, AA, J, L) {
      return xe.has(T, AA) ? T[AA][J].animVal.value : L;
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
    }, FA = function(T) {
      return T.displayLabel === "show" ? "visible" : T.displayLabel === "hide" ? "hidden" : !0;
    }, NA = M.append("g").classed("qtl-count-group", !0), _A = _.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(T) {
        var AA = T.type == "qtllist" ? [T] : [];
        return AA;
      },
      function(T) {
        return "label_" + T.id;
      }
    ), W = _A.enter(), yA = W.append("g").classed("qtllist", !0);
    yA.append("circle").classed("qtl-count", !0), yA.append("text").classed("qtl-count", !0), NA.each(function(T) {
      if (xe.has(cA, T.index))
        if (xe.has(z, T.parentIndex)) {
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
    var EA = fA.enter(), xA = EA.append("g").classed("qtl", !0).attr("transform", function(T) {
      return "translate(" + (H(T) + 0.5 * u) + "," + gA(T) + ")";
    });
    xA.append("text").classed("qtl-label", !0), _.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(T) {
      return T.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", FA).text(function(T) {
      return T.screenLabel;
    });
    var iA = function(T) {
      T.on("mouseenter", function(AA) {
        AA.hover = !0, o(d, w, B);
      }).on("mouseout", function(AA) {
        AA.hover = !1, o(d, w, B);
      }).on("click", function(AA) {
        AA.hover = !AA.hover, o(d, w, B);
      });
    };
    iA(_.select("rect.qtl-selector")), iA(_.select("circle.qtl-count")), iA(_.select("text.qtl-count")), _.on("contextmenu", function(T) {
      var AA = VA("#clusterPopover");
      AA.attr("class", "popover");
      var J = AA.select(".popover-title");
      J.selectAll("*").remove(), J.text(""), J.text(
        "Chromosome " + T.chromosome + ": " + T.start + "-" + T.end
      ), oe.fn.redraw = function() {
        return oe(this).each(function() {
          this.offsetHeight;
        });
      }, L = AA.select(".popover-content"), L.selectAll("*").remove(), L.text("");
      var L = AA.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        T.type == "qtllist" ? T.qtlList : [T]
      ), R = L.enter();
      R.append("p").classed("popover-annotation", !0);
      var nA = L.append("div").attr("class", "checkbox").append("label");
      nA.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(QA) {
        return QA.selected;
      }).on("click", function(QA) {
        QA.selected = !QA.selected, L.classed("selected", function(UA) {
          return UA.selected;
        }), t.onAnnotationSelectFunction();
      }), nA.append("a").attr("href", function(QA) {
        return QA.link;
      }).attr("target", "_blank").text(function(QA) {
        return QA.label;
      }), L.classed("selected", function(QA) {
        return QA.selected;
      });
    });
  }, l = function(d) {
    d.select("rect.border").empty() && d.append("rect").classed("border", !0), d.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  }, f = function(d) {
    var w = /* @__PURE__ */ new Set();
    d.map(function(g) {
      w.add(g.trait);
    });
    var B = Array.from(w).sort();
    return B;
  };
  function c(d) {
    d.each(function(w) {
      var B = w.annotations.snps.filter(function(C) {
        return !(C.pvalue > t.maxSnpPValue);
      }), g = f(B), v = VA(this).selectAll(".qtl-annotations").data([w]);
      v.enter().append("g").attr("class", "qtl-annotations"), v.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), o(v, w, g.length), t.border && l(v), v.exit().remove();
      var u = VA(this).selectAll(".snp-annotations").data([w]);
      u.enter().append("g").attr("class", "snp-annotations"), u.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), i(u, w, B, g), u.exit().remove();
    });
  }
  return c.onAnnotationSelectFunction = function(d) {
    return arguments.length ? (t.onAnnotationSelectFunction = d, c) : t.onAnnotationSelectFunction;
  }, c.layout = function(d) {
    return arguments.length ? (t.layout = d, c) : t.layout;
  }, c.drawing = function(d) {
    return arguments.length ? (t.drawing = d, c) : t.drawing;
  }, c.longestChromosome = function(d) {
    return arguments.length ? (t.longestChromosome = d, c) : t.longestChromosome;
  }, c.chromosomeWidth = function(d) {
    return arguments.length ? (t.chromosomeWidth = d, c) : t.chromosomeWidth;
  }, c.annotationLabelSize = function(d) {
    return arguments.length ? (t.annotationLabelSize = d, c) : t.annotationLabelSize;
  }, c.annotationMarkerSize = function(d) {
    return arguments.length ? (t.annotationMarkerSize = d, c) : t.annotationMarkerSize;
  }, c.showAnnotationLabels = function(d) {
    return arguments.length ? (t.showAnnotationLabels = d, c) : t.showAnnotationLabels;
  }, c.maxSnpPValue = function(d) {
    return arguments.length ? (t.maxSnpPValue = d, c) : t.maxSnpPValue;
  }, c.infoBoxManager = function(d) {
    return arguments.length ? (t.infoBoxManager = d, c) : t.infoBoxManager;
  }, c.scale = function(d) {
    return arguments.length ? (t.scale = d, c) : t.scale;
  }, c;
}, pN = function(A) {
  var e = {
    border: !1,
    onAnnotationSelectFunction: oe.noop(),
    onExpandClusterFunction: oe.noop(),
    onLabelSelectFunction: oe.noop(),
    maxAnnotationLayers: 3,
    maxSnpPValue: 1,
    svg: null
  }, t = xe.merge({}, e, A);
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
      var d = dN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(l.geneAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).drawing(t.svg).scale(l.scale);
      th(".chromosome-cell").call(d);
      var w = IO().layout(l.chromosomePosition).longestChromosome(l.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(l.scale).bands("genes").drawing(t.svg);
      th(".chromosome-cell").call(w);
      var B = xO().layout(l.labelPosition).sizeLayout(l.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(l.longestChromosome).scale(l.scale);
      f.call(B);
      var g = hN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(l.qtlAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).showAnnotationLabels(l.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(l.scale);
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
        function f(c, d) {
          for (var w = 0; w < d.length; w++) {
            var B = d[w];
            B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(c, B.key, B);
          }
        }
        return function(c, d, w) {
          return d && f(c.prototype, d), w && f(c, w), c;
        };
      }(), l = function() {
        function f(c, d, w) {
          i(this, f), this.idealPos = c, this.currentPos = c, this.width = d, this.data = w, this.layerIndex = 0;
        }
        return o(f, [{ key: "distanceFrom", value: function(c) {
          var d = this.width / 2, w = c.width / 2;
          return Math.max(this.currentPos - d, c.currentPos - w) - Math.min(this.currentPos + d, c.currentPos + w);
        } }, { key: "moveToIdealPosition", value: function() {
          return this.currentPos = this.idealPos, this;
        } }, { key: "displacement", value: function() {
          return this.idealPos - this.currentPos;
        } }, { key: "overlapWithNode", value: function(c) {
          var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return this.distanceFrom(c) - d < 0;
        } }, { key: "overlapWithPoint", value: function(c) {
          var d = this.width / 2;
          return c >= this.currentPos - d && c <= this.currentPos + d;
        } }, { key: "positionBefore", value: function(c) {
          var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return c.currentLeft() - this.width / 2 - d;
        } }, { key: "positionAfter", value: function(c) {
          var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return c.currentRight() + this.width / 2 + d;
        } }, { key: "currentRight", value: function() {
          return this.currentPos + this.width / 2;
        } }, { key: "currentLeft", value: function() {
          return this.currentPos - this.width / 2;
        } }, { key: "idealRight", value: function() {
          return this.idealPos + this.width / 2;
        } }, { key: "idealLeft", value: function() {
          return this.idealPos - this.width / 2;
        } }, { key: "createStub", value: function(c) {
          var d = new f(this.idealPos, c, this.data);
          return d.currentPos = this.currentPos, d.child = this, this.parent = d, d;
        } }, { key: "removeStub", value: function() {
          return this.parent && (this.parent.child = null, this.parent = null), this;
        } }, { key: "isStub", value: function() {
          return !!this.child;
        } }, { key: "getPathToRoot", value: function() {
          for (var c = [], d = this; d; ) c.push(d), d = d.parent;
          return c;
        } }, { key: "getPathFromRoot", value: function() {
          return this.getPathToRoot().reverse();
        } }, { key: "getPathToRootLength", value: function() {
          for (var c = 0, d = this; d; ) {
            var w = d.parent ? d.parent.currentPos : d.idealPos;
            c += Math.abs(d.currentPos - w), d = d.parent;
          }
          return c;
        } }, { key: "getRoot", value: function() {
          for (var c = this, d = this; d; ) c = d, d = d.parent;
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
      var o = i(3), l = i(4), f = i(8), c = { nodeSpacing: 3, minPos: 0, maxPos: null, algorithm: "overlap", removeOverlap: !0, density: 0.85, stubWidth: 1 }, d = function(w) {
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
        }, B.options(w), B.compute = function() {
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
      d.DEFAULT_OPTIONS = c, t.exports = d;
    }, function(t, n, i) {
      var o = i(4), l = i(6), f = { algorithm: "overlap", layerWidth: 1e3, density: 0.75, nodeSpacing: 3, stubWidth: 1 }, c = function(d) {
        var w = {};
        d = o.extend({}, f, d), w.options = function(g) {
          return arguments.length ? (d = o.extend(d, g), w) : d;
        }, w.computeRequiredWidth = function(g) {
          return o.sum(g, function(v) {
            return v.width + d.nodeSpacing;
          }) - d.nodeSpacing;
        }, w.maxWidthPerLayer = function() {
          return d.density * d.layerWidth;
        }, w.needToSplit = function(g) {
          return w.estimateRequiredLayers(g) > 1;
        }, w.estimateRequiredLayers = function(g) {
          return d.layerWidth ? Math.ceil(w.computeRequiredWidth(g) / w.maxWidthPerLayer()) : 1;
        };
        var B = { simple: function(g) {
          for (var v = w.estimateRequiredLayers(g), u = [], C = 0; C < v; C++) u.push([]);
          return g.forEach(function(F, U) {
            var H = U % v;
            u[H].push(F);
            for (var O = F, _ = H - 1; _ >= 0; _--) O = O.createStub(d.stubWidth), u[_].push(O);
          }), u;
        }, roundRobin: function(g) {
          var v = [];
          return v;
        }, overlap: function(g) {
          for (var v = [], u = w.maxWidthPerLayer(), C = g.concat(), F = w.computeRequiredWidth(C); F > u; ) {
            w.countIdealOverlaps(C);
            var U = C.concat(), H = F;
            for (C = []; U.length > 2 && H > u; ) {
              U.sort(function(gA, FA) {
                return FA.overlapCount - gA.overlapCount;
              });
              var O = U.shift();
              H -= O.width, H += d.stubWidth, O.overlaps.forEach(function(gA) {
                gA.overlapCount--;
              }), C.push(O);
            }
            v.push(U), F = w.computeRequiredWidth(C);
          }
          C.length > 0 && v.push(C);
          for (var _ = v.length - 1; _ >= 1; _--) for (var M = v[_], K = 0; K < M.length; K++) {
            var z = M[K];
            if (!z.isStub()) for (var cA = z, sA = _ - 1; sA >= 0; sA--) cA = cA.createStub(d.stubWidth), v[sA].push(cA);
          }
          return v;
        } };
        return w.countIdealOverlaps = function(g) {
          var v = new l(d.layerWidth / 2);
          return g.forEach(function(u) {
            v.add([u.idealLeft(), u.idealRight(), u]);
          }), g.forEach(function(u) {
            var C = v.search(u.idealLeft(), u.idealRight());
            u.overlaps = C.map(function(F) {
              return F.data[2];
            }), u.overlapCount = C.length;
          }), g;
        }, w.distribute = function(g) {
          if (!g || g.length === 0) return [];
          if (d.algorithm == "none" || !o.isDefined(d.algorithm)) return [g];
          if (!w.needToSplit(g)) return [g];
          var v = g.concat().sort(function(u, C) {
            return u.idealPos - C.idealPos;
          });
          if (typeof d.algorithm == "function") return d.algorithm(v, d);
          if (B.hasOwnProperty(d.algorithm)) return B[d.algorithm](v);
          throw "Unknown algorithm: " + d.algorithm;
        }, w;
      };
      c.DEFAULT_OPTIONS = f, t.exports = c;
    }, function(t, n, i) {
      var o = { isDefined: function(l) {
        return l != null;
      }, last: function(l) {
        return l.length > 0 ? l[l.length - 1] : null;
      }, pick: function(l, f) {
        return f.reduce(function(c, d) {
          return c[d] = l[d], c;
        }, {});
      }, sum: function(l, f) {
        return l.map(f).reduce(function(c, d) {
          return c + d;
        }, 0);
      } };
      o.extend = i(5), t.exports = o;
    }, function(t, n) {
      var i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(d) {
        return typeof d;
      } : function(d) {
        return d && typeof Symbol == "function" && d.constructor === Symbol && d !== Symbol.prototype ? "symbol" : typeof d;
      }, o = Object.prototype.hasOwnProperty, l = Object.prototype.toString, f = function(d) {
        return typeof Array.isArray == "function" ? Array.isArray(d) : l.call(d) === "[object Array]";
      }, c = function(d) {
        if (!d || l.call(d) !== "[object Object]") return !1;
        var w = o.call(d, "constructor"), B = d.constructor && d.constructor.prototype && o.call(d.constructor.prototype, "isPrototypeOf");
        if (d.constructor && !w && !B) return !1;
        var g;
        for (g in d) ;
        return g === void 0 || o.call(d, g);
      };
      t.exports = function d() {
        var w, B, g, v, u, C, F = arguments[0], U = 1, H = arguments.length, O = !1;
        for (typeof F == "boolean" ? (O = F, F = arguments[1] || {}, U = 2) : ((typeof F > "u" ? "undefined" : i(F)) !== "object" && typeof F != "function" || F == null) && (F = {}); U < H; ++U) if (w = arguments[U], w != null) for (B in w) g = F[B], v = w[B], F !== v && (O && v && (c(v) || (u = f(v))) ? (u ? (u = !1, C = g && f(g) ? g : []) : C = g && c(g) ? g : {}, F[B] = d(O, C, v)) : v !== void 0 && (F[B] = v));
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
        this.root = new d(g);
      }
      function l(g, v) {
        return v.end < g.idx ? (g.left || (g.left = new d(v.start + v.end >> 1)), l.call(this, g.left, v)) : g.idx < v.start ? (g.right || (g.right = new d(v.start + v.end >> 1)), l.call(this, g.right, v)) : g.insert(v);
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
      function d(g) {
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
      function w(g, v, u, C) {
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
        var u = new w(g, v, this.startKey, this.endKey);
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
      }, d.prototype.insert = function(g) {
        this.starts.insert(g), this.ends.insert(g);
      }, w.prototype.result = function(g, v) {
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
        var f = null, c = {}, d = arguments;
        ["0", "1"].forEach(function(w) {
          var B = d[w];
          Array.isArray(B) ? f = B : B && (typeof B > "u" ? "undefined" : i(B)) == "object" && (c = B);
        }), typeof c.filter == "function" && (this._filter = c.filter), typeof c.compare == "function" ? this._compare = c.compare : typeof c.compare == "string" && l.compares[c.compare] && (this._compare = l.compares[c.compare]), this._unique = !!c.unique, c.resume && f ? f.forEach(function(w, B) {
          this.push(w);
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
        for (var f, c = 0, d = this.length; d - c > 1; ) {
          f = Math.floor((c + d) / 2);
          var w = this[f], B = this._compare(l, w);
          if (B == 0) return f;
          B > 0 ? c = f : d = f;
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
        for (var d = f; d >= 0 && this._compare(this[d], l) == 0; ) c.push(d), d--;
        var w = this.length;
        for (d = f + 1; d < w && this._compare(this[d], l) == 0; ) c.push(d), d++;
        return c.length ? c : null;
      }, o.prototype.unique = function(l) {
        if (l) return this.filter(function(c, d) {
          return d == 0 || this._compare(this[d - 1], c) != 0;
        }, this);
        var f = 0;
        return this.map(function(c, d) {
          return d == 0 || this._compare(this[d - 1], c) != 0 ? null : d - f++;
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
      function o(w) {
        var B = new c.Variable(w.targetPos);
        return B.node = w, B;
      }
      function l(w, B) {
        if (w.length > 0) {
          B = f.extend(d, B), w.forEach(function(K, z) {
            K.targetPos = K.parent ? K.parent.currentPos : K.idealPos, K.index = z;
          });
          for (var g = w.concat().sort(function(K, z) {
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
        return w;
      }
      var f = i(4), c = i(9), d = { lineSpacing: 2, nodeSpacing: 3, minPos: 0, maxPos: null };
      l.DEFAULT_OPTIONS = d, t.exports = l;
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
      var d = function() {
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
            C !== null && C.lm < w.LAGRANGIAN_TOLERANCE && (u = C.left.block, c.split(C).forEach(function(F) {
              return v.insert(F);
            }), v.remove(u), g.push(C));
          });
        }, B;
      }();
      i.Blocks = d;
      var w = function() {
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
          }), this.bs = new d(this.vs), this.bs.forEach(function(v, u) {
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
          this.bs == null && (this.bs = new d(this.vs)), this.bs.split(this.inactive);
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
      i.Solver = w, t.exports = i;
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
      function d(g, v) {
        var u = (g[1] + v[1]) / 2;
        return c([g[0], u], [v[0], u], v);
      }
      function w(g, v) {
        var u = (g[0] + v[0]) / 2;
        return c([u, g[1]], [u, v[1]], v);
      }
      var B = i(4);
      o.lineTo = l, o.moveTo = f, o.curveTo = c, o.vCurveBetween = d, o.hCurveBetween = w, o.prototype.getWaypoints = function(g) {
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
          return F.push(w(U[U.length - 1], H[0])), O < C.length - 1 && F.push(l(H[1])), H;
        }) : C.reduce(function(U, H, O) {
          return F.push(d(U[U.length - 1], H[0])), O < C.length - 1 && F.push(l(H[1])), H;
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
function gh(A, e, t, n) {
  var i;
  if (A > 0) {
    var o = (t[e] - t[A - 1]) / (e - A + 1);
    i = n[e] - n[A - 1] - (e - A + 1) * o * o;
  } else
    i = n[e] - t[e] * t[e] / (e + 1);
  return i < 0 ? 0 : i;
}
function Bh(A, e, t, n, i, o, l) {
  if (!(A > e)) {
    var f = Math.floor((A + e) / 2);
    n[t][f] = n[t - 1][f - 1], i[t][f] = f;
    var c = t;
    A > t && (c = Math.max(c, i[t][A - 1] || 0)), c = Math.max(c, i[t - 1][f] || 0);
    var d = f - 1;
    e < n[0].length - 1 && (d = Math.min(d, i[t][e + 1] || 0));
    for (var w, B, g, v, u = d; u >= c && (w = gh(u, f, o, l), !(w + n[t - 1][c - 1] >= n[t][f])); --u)
      B = gh(c, f, o, l), g = B + n[t - 1][c - 1], g < n[t][f] && (n[t][f] = g, i[t][f] = c), c++, v = w + n[t - 1][u - 1], v < n[t][f] && (n[t][f] = v, i[t][f] = u);
    Bh(
      A,
      f - 1,
      t,
      n,
      i,
      o,
      l
    ), Bh(
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
    )), e[0][f] = gh(0, f, o, l), t[0][f] = 0;
  for (var d, w = 1; w < e.length; ++w)
    w < e.length - 1 ? d = w : d = n - 1, Bh(
      d,
      n - 1,
      w,
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
    var d = o[c][f];
    l[c] = t.slice(d, f + 1), c > 0 && (f = d - 1);
  }
  return l;
}
const rm = function(A) {
  var e = {}, t = { nClusters: 6 }, n = xe.merge({}, t, A);
  return e.createClustersFromGenes = function(i) {
    var o = [];
    if (i.length < 1)
      return o;
    var l = Math.min(n.nClusters, i.length), f = i.map(function(B) {
      return B.midpoint;
    });
    let c = vN(f, l);
    for (var d = [], w = 0; w < c.length; w++)
      d.push([]);
    return i.map(function(B) {
      let g = c.findIndex(function(v) {
        return v.includes(B.midpoint);
      });
      d[g].push(B);
    }), d.map(function(B) {
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
var Qd = ty || gN;
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
  }, t = xe.merge({}, e, A), n = function() {
    return da().range([0, t.layout.height]).domain([0, t.longestChromosome]);
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
      return new Qd.Node(g(F.midpoint), v.setFontSize, F);
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
    var K = new Qd.Force(M);
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
      var FA = sA.map(function(eA) {
        return eA.getLayerIndex();
      });
      gA = Math.max.apply(null, FA);
    }
    if (!sA || gA > 3) {
      var NA = rm().nClusters(Math.max(O.nLabels, 1));
      try {
        var _A = NA.createClustersFromGenes(cA);
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
    var yA = new Qd.Renderer(W);
    return yA.layout(sA), sA.forEach(function(eA) {
      eA.data.path = yA.generatePath(eA);
    }), t.manualLabels || th(".gene-annotation").remove(), sA;
  }, d = function(B) {
    var g = rm(), v = B.annotations.genes, u = g.createClustersFromGenes(v);
    return u;
  };
  let w = {};
  return w.layoutChromosome = function(B) {
    B.layout.annotationNodes = c(B) || B.layout.annotationNodes;
  }, w.computeChromosomeClusters = function(B) {
    B.layout.annotationClusters = d(B), B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice();
  }, w.expandAllChromosomeClusters = function(B) {
    B.layout.annotationDisplayClusters = B.annotations.genes;
  }, w.collapseAllChromosomeClusters = function(B) {
    B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice();
  }, w.expandAChromosomeCluster = function(B, g) {
    B.layout.annotationDisplayClusters = B.layout.annotationClusters.slice(), g.genesList.forEach(function(u) {
      B.layout.annotationDisplayClusters.push(u);
    });
    var v = B.layout.annotationDisplayClusters.indexOf(g);
    B.layout.annotationDisplayClusters.splice(v, 1);
  }, w.computeNormalisedGeneScores = function(B) {
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
  }, w;
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
  }, t = xe.merge({}, e, A), n = function() {
    return da().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(c) {
    if (c.type == "gene") {
      var d = c;
      return {
        start: d.start,
        end: d.end,
        midpoint: d.midpoint,
        color: d.color,
        data: d
      };
    } else if (c.type == "geneslist") {
      let w = c.genesList.reduce(function(v, u) {
        return Math.max(v, u.end);
      }, 0);
      return {
        start: c.genesList.reduce(function(v, u) {
          return Math.min(v, u.start);
        }, 1 / 0),
        end: w,
        midpoint: c.midpoint,
        color: "#0000FF",
        data: c
      };
    }
  }, o = function(c) {
    n();
    var d = c.layout.geneBandDisplayClusters, w = d.map(i);
    return w;
  }, l = function(c) {
    var d = c.annotations.allGenes.filter(function(C) {
      return C.globalIndex < t.nGenesToDisplay;
    });
    d.sort(function(C, F) {
      return C.midpoint - F.midpoint;
    });
    for (var w = [], B = 0; B < d.length; ) {
      let C = B;
      for (; C < d.length && d[B].midpoint == d[C].midpoint; )
        C++;
      if (C - B == 1)
        w.push(d[B]), B++;
      else {
        var g = d.slice(B, C), v = g.reduce(function(U, H) {
          return U + H.id.toString();
        }, ""), u = {
          genesList: g,
          midpoint: g[0].midpoint,
          type: "geneslist",
          id: v
        };
        w.push(u), B = C;
      }
    }
    return w.sort(function(C, F) {
      return C.midpoint < F.midpoint;
    }), w;
  };
  let f = {};
  return f.layoutChromosome = function(c) {
    c.layout.geneBandNodes = o(c);
  }, f.computeChromosomeClusters = function(c) {
    let d = c.layout;
    d.geneBandClusters = l(c), d.geneBandDisplayClusters = d.geneBandClusters.slice();
  }, f.expandAllChromosomeClusters = function(c) {
    let d = c.layout;
    d.geneBandDisplayClusters = c.annotations.allGenes;
  }, f.collapseAllChromosomeClusters = function(c) {
    let d = c.layout;
    d.geneBandDisplayClusters = d.geneBandClusters.slice();
  }, f.expandAChromosomeCluster = function(c, d) {
    let w = c.layout;
    w.geneBandDisplayClusters = w.geneBandClusters.slice(), d.genesList.forEach(function(g) {
      w.geneBandDisplayClusters.push(g);
    });
    var B = w.geneBandDisplayClusters.indexOf(d);
    w.geneBandDisplayClusters.splice(B, 1);
  }, f;
}, QN = function(A) {
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
  }, t = xe.merge({}, e, A), n, i = function() {
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
  }, d = function(g, v, u, C, F) {
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
  }, w = function() {
    var g = VA(n).selectAll(".genemap-menu").data([null]);
    g.enter().append("div").classed("genemap-menu", !0);
    var v = g.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), u = v.selectAll("span").data(function(gA, FA) {
      return gA;
    });
    u.enter().append("span"), v.selectAll("span").attr("class", function(gA) {
      return gA;
    }), g.select(".network-btn").attr("title", "Launch network view").on("click", i), g.select(".tag-btn").on("click", o);
    var C = g.select(".label-btn");
    d(
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
    F.text(""), d(
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
      oe("#select-ngenes-dropdown").selectpicker("val", [
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
    d(
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
    K.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), K.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), K.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), oe("#snp-pvalue-form").submit(function(gA) {
      t.maxSnpPValueProperty(oe("#max-snp-pvalue-input").val()), gA.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(gA) {
      oe("#max-snp-pvalue-input").val(gA);
    });
    var z = H.select(".nperrow-spinner"), cA = z.selectAll("input").data(["nPerRowSpinner"]).enter();
    cA.append("span").append("label").classed("bootstrap", !0).attr("for", (gA) => gA).html("Num per row:&nbsp;"), cA.append("span").append("input").attr("id", (gA) => gA).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (gA) => gA), VA(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), oe("#nPerRowSpinner").on("change", function(gA) {
      t.onSetNumberPerRowClick(oe("#nPerRowSpinner").val());
    }), H.select(".export-all-btn").attr("title", "export all to PNG").on("click", t.onExportAllBtnClick), H.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(gA) {
      return gA;
    }), H.select(".labelsize-label").classed("bootstrap", !0), H.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var sA = H.select(".labelsize-dropdown");
    sA.text(""), d(
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
      oe("#select-labelsize-dropdown").selectpicker("val", [
        gA,
        gA
      ]);
    });
  };
  function B(g) {
    g.each(function(v) {
      var u = this;
      n = u, w();
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
        for (let d = 0; d < this.clusters.length; d++) {
          const w = this.clusters[d].key;
          this.dists[f][w] < this.dists[f][c] && (c = w);
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
const bN = function() {
  var A = {};
  return A.positionAnnotations = function(e, t, n, i, o, l) {
    for (var f = i, c = l, d = o, w = function(M, K) {
      return f(M) < c(K) && f(K) < c(M);
    }, B = e.sort(function(M, K) {
      return d(M) - d(K);
    }), g = [], v = 0; v < B.length; v++) {
      for (var u = e[v], C = [], F = 0; F < g.length; F++) {
        var U = B[g[F]];
        w(u, U) || C.push(g[F]);
      }
      var H = xe.difference(g, C), O = H.map(function(M) {
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
}, EN = function(A) {
  var e = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = xe.merge({}, e, A), n = bN(), i = function() {
    return da().range([0, t.layout.height]).domain([0, t.longestChromosome]);
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
    var C = xe.groupBy(u, "position");
    return xe.forOwn(C, function(F) {
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
  }, d = function(u, C) {
    if (u.index = C.index, C.index = C.index + 1, u.value)
      u.unit = !0, u.start = u.value.start, u.end = u.value.end;
    else {
      var F = u.left, U = u.right;
      F.parentIndex = u.index, U.parentIndex = u.index, d(F, C), d(U, C), u.unit = F.unit && U.unit && F.start == U.start && F.end == U.end, u.start = Math.min(u.left.start, u.right.start), u.end = Math.max(u.left.end, u.right.end);
    }
  }, w = function(u) {
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
      d(U, F);
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
    u.layout.qtlClusters = w(u);
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
var wh = function(A, e) {
  return wh = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, wh(A, e);
};
function Jn(A, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  wh(A, e);
  function t() {
    this.constructor = A;
  }
  A.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var mh = function() {
  return mh = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
    }
    return e;
  }, mh.apply(this, arguments);
};
function Gt(A, e, t, n) {
  function i(o) {
    return o instanceof t ? o : new t(function(l) {
      l(o);
    });
  }
  return new (t || (t = Promise))(function(o, l) {
    function f(w) {
      try {
        d(n.next(w));
      } catch (B) {
        l(B);
      }
    }
    function c(w) {
      try {
        d(n.throw(w));
      } catch (B) {
        l(B);
      }
    }
    function d(w) {
      w.done ? o(w.value) : i(w.value).then(f, c);
    }
    d((n = n.apply(A, [])).next());
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
  function f(d) {
    return function(w) {
      return c([d, w]);
    };
  }
  function c(d) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; t; ) try {
      if (n = 1, i && (o = d[0] & 2 ? i.return : d[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, d[1])).done) return o;
      switch (i = 0, o && (d = [d[0] & 2, o.value]), d[0]) {
        case 0:
        case 1:
          o = d;
          break;
        case 4:
          return t.label++, { value: d[1], done: !1 };
        case 5:
          t.label++, i = d[1], d = [0];
          continue;
        case 7:
          d = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (o = t.trys, !(o = o.length > 0 && o[o.length - 1]) && (d[0] === 6 || d[0] === 2)) {
            t = 0;
            continue;
          }
          if (d[0] === 3 && (!o || d[1] > o[0] && d[1] < o[3])) {
            t.label = d[1];
            break;
          }
          if (d[0] === 6 && t.label < o[1]) {
            t.label = o[1], o = d;
            break;
          }
          if (o && t.label < o[2]) {
            t.label = o[2], t.ops.push(d);
            break;
          }
          o[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      d = e.call(A, t);
    } catch (w) {
      d = [6, w], i = 0;
    } finally {
      n = o = 0;
    }
    if (d[0] & 5) throw d[1];
    return { value: d[0] ? d[1] : void 0, done: !0 };
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
  var d = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(d) ? d : new Uint8Array(d);
  for (n = 0; n < t; n += 4)
    o = us[A.charCodeAt(n)], l = us[A.charCodeAt(n + 1)], f = us[A.charCodeAt(n + 2)], c = us[A.charCodeAt(n + 3)], w[i++] = o << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return d;
}, HN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, SN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ia = 5, jp = 11, Fd = 2, LN = jp - ia, ny = 65536 >> ia, TN = 1 << ia, Ud = TN - 1, DN = 1024 >> ia, ON = ny + DN, NN = ON, MN = 32, PN = NN + MN, KN = 65536 >> jp, RN = 1 << LN, kN = RN - 1, om = function(A, e, t) {
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
          return t = this.index[e >> ia], t = (t << Fd) + (e & Ud), this.data[t];
        if (e <= 65535)
          return t = this.index[ny + (e - 55296 >> ia)], t = (t << Fd) + (e & Ud), this.data[t];
        if (e < this.highStart)
          return t = PN - KN + (e >> jp), t = this.index[t], t += e >> ia & kN, t = this.index[t], t = (t << Fd) + (e & Ud), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), sm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", WN = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var vl = 0; vl < sm.length; vl++)
  WN[sm.charCodeAt(vl)] = vl;
var XN = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", um = 50, qN = 1, ry = 2, iy = 3, zN = 4, JN = 5, lm = 7, ay = 8, cm = 9, vi = 10, vh = 11, fm = 12, yh = 13, jN = 14, ls = 15, Ch = 16, yl = 17, es = 18, YN = 19, dm = 20, Qh = 21, ts = 22, bd = 23, Ra = 24, un = 25, cs = 26, fs = 27, ka = 28, ZN = 29, Aa = 30, AM = 31, Cl = 32, Ql = 33, Fh = 34, Uh = 35, bh = 36, Ms = 37, Eh = 38, jl = 39, Yl = 40, Ed = 41, oy = 42, eM = 43, tM = [9001, 65288], sy = "!", be = "×", Fl = "÷", _h = GN(XN), Nr = [Aa, bh], xh = [qN, ry, iy, JN], uy = [vi, ay], hm = [fs, cs], nM = xh.concat(uy), pm = [Eh, jl, Yl, Fh, Uh], rM = [ls, yh], iM = function(A, e) {
  e === void 0 && (e = "strict");
  var t = [], n = [], i = [];
  return A.forEach(function(o, l) {
    var f = _h.get(o);
    if (f > um ? (i.push(!0), f -= um) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(o) !== -1)
      return n.push(l), t.push(Ch);
    if (f === zN || f === vh) {
      if (l === 0)
        return n.push(l), t.push(Aa);
      var c = t[l - 1];
      return nM.indexOf(c) === -1 ? (n.push(n[l - 1]), t.push(c)) : (n.push(l), t.push(Aa));
    }
    if (n.push(l), f === AM)
      return t.push(e === "strict" ? Qh : Ms);
    if (f === oy || f === ZN)
      return t.push(Aa);
    if (f === eM)
      return o >= 131072 && o <= 196605 || o >= 196608 && o <= 262141 ? t.push(Ms) : t.push(Aa);
    t.push(f);
  }), [n, t, i];
}, _d = function(A, e, t, n) {
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
    return be;
  var o = n - 1;
  if (Array.isArray(i) && i[o] === !0)
    return be;
  var l = o - 1, f = o + 1, c = e[o], d = l >= 0 ? e[l] : 0, w = e[f];
  if (c === ry && w === iy)
    return be;
  if (xh.indexOf(c) !== -1)
    return sy;
  if (xh.indexOf(w) !== -1 || uy.indexOf(w) !== -1)
    return be;
  if (gm(o, e) === ay)
    return Fl;
  if (_h.get(A[o]) === vh || (c === Cl || c === Ql) && _h.get(A[f]) === vh || c === lm || w === lm || c === cm || [vi, yh, ls].indexOf(c) === -1 && w === cm || [yl, es, YN, Ra, ka].indexOf(w) !== -1 || gm(o, e) === ts || _d(bd, ts, o, e) || _d([yl, es], Qh, o, e) || _d(fm, fm, o, e))
    return be;
  if (c === vi)
    return Fl;
  if (c === bd || w === bd)
    return be;
  if (w === Ch || c === Ch)
    return Fl;
  if ([yh, ls, Qh].indexOf(w) !== -1 || c === jN || d === bh && rM.indexOf(c) !== -1 || c === ka && w === bh || w === dm || Nr.indexOf(w) !== -1 && c === un || Nr.indexOf(c) !== -1 && w === un || c === fs && [Ms, Cl, Ql].indexOf(w) !== -1 || [Ms, Cl, Ql].indexOf(c) !== -1 && w === cs || Nr.indexOf(c) !== -1 && hm.indexOf(w) !== -1 || hm.indexOf(c) !== -1 && Nr.indexOf(w) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [fs, cs].indexOf(c) !== -1 && (w === un || [ts, ls].indexOf(w) !== -1 && e[f + 1] === un) || // ( OP | HY ) × NU
  [ts, ls].indexOf(c) !== -1 && w === un || // NU ×	(NU | SY | IS)
  c === un && [un, ka, Ra].indexOf(w) !== -1)
    return be;
  if ([un, ka, Ra, yl, es].indexOf(w) !== -1)
    for (var B = o; B >= 0; ) {
      var g = e[B];
      if (g === un)
        return be;
      if ([ka, Ra].indexOf(g) !== -1)
        B--;
      else
        break;
    }
  if ([fs, cs].indexOf(w) !== -1)
    for (var B = [yl, es].indexOf(c) !== -1 ? l : o; B >= 0; ) {
      var g = e[B];
      if (g === un)
        return be;
      if ([ka, Ra].indexOf(g) !== -1)
        B--;
      else
        break;
    }
  if (Eh === c && [Eh, jl, Fh, Uh].indexOf(w) !== -1 || [jl, Fh].indexOf(c) !== -1 && [jl, Yl].indexOf(w) !== -1 || [Yl, Uh].indexOf(c) !== -1 && w === Yl || pm.indexOf(c) !== -1 && [dm, cs].indexOf(w) !== -1 || pm.indexOf(w) !== -1 && c === fs || Nr.indexOf(c) !== -1 && Nr.indexOf(w) !== -1 || c === Ra && Nr.indexOf(w) !== -1 || Nr.concat(un).indexOf(c) !== -1 && w === ts && tM.indexOf(A[f]) === -1 || Nr.concat(un).indexOf(w) !== -1 && c === es)
    return be;
  if (c === Ed && w === Ed) {
    for (var v = t[o], u = 1; v > 0 && (v--, e[v] === Ed); )
      u++;
    if (u % 2 !== 0)
      return be;
  }
  return c === Cl && w === Ql ? be : Fl;
}, oM = function(A, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = iM(A, e.lineBreak), n = t[0], i = t[1], o = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(f) {
    return [un, Aa, oy].indexOf(f) !== -1 ? Ms : f;
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
  var t = kc(A), n = oM(t, e), i = n[0], o = n[1], l = n[2], f = t.length, c = 0, d = 0;
  return {
    next: function() {
      if (d >= f)
        return { done: !0, value: null };
      for (var w = be; d < f && (w = aM(t, o, i, ++d, l)) === be; )
        ;
      if (w !== be || d === f) {
        var B = new sM(t, w, c, d);
        return c = d, { value: B, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, lM = 1, cM = 2, zs = 4, Bm = 8, mc = 10, wm = 47, Fs = 92, fM = 9, dM = 32, Ul = 34, ns = 61, hM = 35, pM = 36, gM = 37, bl = 39, El = 40, rs = 41, BM = 95, Zt = 45, wM = 33, mM = 60, vM = 62, yM = 64, CM = 91, QM = 93, FM = 61, UM = 123, _l = 63, bM = 125, mm = 124, EM = 126, _M = 128, vm = 65533, xd = 42, ta = 43, xM = 44, IM = 58, HM = 59, Ps = 46, SM = 0, LM = 8, TM = 11, DM = 14, OM = 31, NM = 127, or = -1, ly = 48, cy = 97, fy = 101, MM = 102, PM = 117, KM = 122, dy = 65, hy = 69, py = 70, RM = 85, kM = 90, Nt = function(A) {
  return A >= ly && A <= 57;
}, $M = function(A) {
  return A >= 55296 && A <= 57343;
}, $a = function(A) {
  return Nt(A) || A >= dy && A <= py || A >= cy && A <= MM;
}, GM = function(A) {
  return A >= cy && A <= KM;
}, VM = function(A) {
  return A >= dy && A <= kM;
}, WM = function(A) {
  return GM(A) || VM(A);
}, XM = function(A) {
  return A >= _M;
}, xl = function(A) {
  return A === mc || A === fM || A === dM;
}, vc = function(A) {
  return WM(A) || XM(A) || A === BM;
}, ym = function(A) {
  return vc(A) || Nt(A) || A === Zt;
}, qM = function(A) {
  return A >= SM && A <= LM || A === TM || A >= DM && A <= OM || A === NM;
}, Bi = function(A, e) {
  return A !== Fs ? !1 : e !== mc;
}, Il = function(A, e, t) {
  return A === Zt ? vc(e) || Bi(e, t) : vc(A) ? !0 : !!(A === Fs && Bi(A, e));
}, Id = function(A, e, t) {
  return A === ta || A === Zt ? Nt(e) ? !0 : e === Ps && Nt(t) : Nt(A === Ps ? e : A);
}, zM = function(A) {
  var e = 0, t = 1;
  (A[e] === ta || A[e] === Zt) && (A[e] === Zt && (t = -1), e++);
  for (var n = []; Nt(A[e]); )
    n.push(A[e++]);
  var i = n.length ? parseInt(ot.apply(void 0, n), 10) : 0;
  A[e] === Ps && e++;
  for (var o = []; Nt(A[e]); )
    o.push(A[e++]);
  var l = o.length, f = l ? parseInt(ot.apply(void 0, o), 10) : 0;
  (A[e] === hy || A[e] === fy) && e++;
  var c = 1;
  (A[e] === ta || A[e] === Zt) && (A[e] === Zt && (c = -1), e++);
  for (var d = []; Nt(A[e]); )
    d.push(A[e++]);
  var w = d.length ? parseInt(ot.apply(void 0, d), 10) : 0;
  return t * (i + f * Math.pow(10, -l)) * Math.pow(10, c * w);
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
}, dP = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, hP = {
  type: 31
  /* WHITESPACE_TOKEN */
}, Ih = {
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
      for (var e = [], t = this.consumeToken(); t !== Ih; )
        e.push(t), t = this.consumeToken();
      return e;
    }, A.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case Ul:
          return this.consumeStringToken(Ul);
        case hM:
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
        case bl:
          return this.consumeStringToken(bl);
        case El:
          return JM;
        case rs:
          return jM;
        case xd:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), aP;
          break;
        case ta:
          if (Id(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case xM:
          return YM;
        case Zt:
          var f = e, c = this.peekCodePoint(0), d = this.peekCodePoint(1);
          if (Id(f, c, d))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (Il(f, c, d))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (c === Zt && d === vM)
            return this.consumeCodePoint(), this.consumeCodePoint(), uP;
          break;
        case Ps:
          if (Id(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case wm:
          if (this.peekCodePoint(0) === xd)
            for (this.consumeCodePoint(); ; ) {
              var w = this.consumeCodePoint();
              if (w === xd && (w = this.consumeCodePoint(), w === wm))
                return this.consumeToken();
              if (w === or)
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
          return dP;
        case FM:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), AP;
          break;
        case UM:
          return rP;
        case bM:
          return iP;
        case PM:
        case RM:
          var u = this.peekCodePoint(0), C = this.peekCodePoint(1);
          return u === ta && ($a(C) || C === _l) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case mm:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), tP;
          if (this.peekCodePoint(0) === mm)
            return this.consumeCodePoint(), eP;
          break;
        case EM:
          if (this.peekCodePoint(0) === ns)
            return this.consumeCodePoint(), nP;
          break;
        case or:
          return Ih;
      }
      return xl(e) ? (this.consumeWhiteSpace(), hP) : Nt(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : vc(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: ot(e) };
    }, A.prototype.consumeCodePoint = function() {
      var e = this._value.shift();
      return typeof e > "u" ? -1 : e;
    }, A.prototype.reconsumeCodePoint = function(e) {
      this._value.unshift(e);
    }, A.prototype.peekCodePoint = function(e) {
      return e >= this._value.length ? -1 : this._value[e];
    }, A.prototype.consumeUnicodeRangeToken = function() {
      for (var e = [], t = this.consumeCodePoint(); $a(t) && e.length < 6; )
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
      if (this.peekCodePoint(0) === Zt && $a(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var f = []; $a(t) && f.length < 6; )
          f.push(t), t = this.consumeCodePoint();
        var o = parseInt(ot.apply(void 0, f), 16);
        return { type: 30, start: l, end: o };
      } else
        return { type: 30, start: l, end: l };
    }, A.prototype.consumeIdentLikeToken = function() {
      var e = this.consumeName();
      return e.toLowerCase() === "url" && this.peekCodePoint(0) === El ? (this.consumeCodePoint(), this.consumeUrlToken()) : this.peekCodePoint(0) === El ? (this.consumeCodePoint(), { type: 19, value: e }) : { type: 20, value: e };
    }, A.prototype.consumeUrlToken = function() {
      var e = [];
      if (this.consumeWhiteSpace(), this.peekCodePoint(0) === or)
        return { type: 22, value: "" };
      var t = this.peekCodePoint(0);
      if (t === bl || t === Ul) {
        var n = this.consumeStringToken(this.consumeCodePoint());
        return n.type === 0 && (this.consumeWhiteSpace(), this.peekCodePoint(0) === or || this.peekCodePoint(0) === rs) ? (this.consumeCodePoint(), { type: 22, value: n.value }) : (this.consumeBadUrlRemnants(), Hl);
      }
      for (; ; ) {
        var i = this.consumeCodePoint();
        if (i === or || i === rs)
          return { type: 22, value: ot.apply(void 0, e) };
        if (xl(i))
          return this.consumeWhiteSpace(), this.peekCodePoint(0) === or || this.peekCodePoint(0) === rs ? (this.consumeCodePoint(), { type: 22, value: ot.apply(void 0, e) }) : (this.consumeBadUrlRemnants(), Hl);
        if (i === Ul || i === bl || i === El || qM(i))
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
      for ((n === ta || n === Zt) && e.push(this.consumeCodePoint()); Nt(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Ps && Nt(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Bm; Nt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var o = this.peekCodePoint(2);
      if ((n === hy || n === fy) && ((i === ta || i === Zt) && Nt(o) || Nt(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Bm; Nt(this.peekCodePoint(0)); )
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
      if ($a(e)) {
        for (var t = ot(e); $a(this.peekCodePoint(0)) && t.length < 6; )
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
      return typeof e > "u" ? Ih : e;
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
}, Hh = function(A, e) {
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
}, bi = function(A) {
  return A.type === 17 || A.type === 15;
}, ut = function(A) {
  return A.type === 16 || bi(A);
}, my = function(A) {
  return A.length > 1 ? [A[0], A[1]] : [A[0]];
}, bt = {
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
}, ds = function(A, e, t) {
  var n = A[0], i = A[1];
  return [Xe(n, e), Xe(typeof i < "u" ? i : n, t)];
}, Xe = function(A, e) {
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
      return [bt, bt];
    case "to top":
    case "bottom":
      return Qn(0);
    case "to bottom left":
    case "to left bottom":
    case "right top":
    case "top right":
      return [bt, yi];
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
      return [yi, bt];
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
}, wt = function(A) {
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
function Hd(A, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - A) * t * 6 + A : t < 1 / 2 ? e : t < 2 / 3 ? (e - A) * 6 * (2 / 3 - t) + A : A;
}
var Fm = function(A, e) {
  var t = e.filter(ho), n = t[0], i = t[1], o = t[2], l = t[3], f = (n.type === 17 ? Qn(n.number) : $c.parse(A, n)) / (Math.PI * 2), c = ut(i) ? i.number / 100 : 0, d = ut(o) ? o.number / 100 : 0, w = typeof l < "u" && ut(l) ? Xe(l, 1) : 1;
  if (c === 0)
    return Ci(d * 255, d * 255, d * 255, 1);
  var B = d <= 0.5 ? d * (c + 1) : d + c - d * c, g = d * 2 - B, v = Hd(g, B, f + 1 / 3), u = Hd(g, B, f), C = Hd(g, B, f - 1 / 3);
  return Ci(v * 255, u * 255, C * 255, w);
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
  t.stop === null && (t.stop = bt), n.stop === null && (n.stop = yi);
  for (var i = [], o = 0, l = 0; l < A.length; l++) {
    var f = A[l].stop;
    if (f !== null) {
      var c = Xe(f, e);
      c > o ? i.push(c) : i.push(o), o = c;
    } else
      i.push(null);
  }
  for (var d = null, l = 0; l < i.length; l++) {
    var w = i[l];
    if (w === null)
      d === null && (d = l);
    else if (d !== null) {
      for (var B = l - d, g = i[d - 1], v = (w - g) / (B + 1), u = 1; u <= B; u++)
        i[d + u - 1] = v * u;
      d = null;
    }
  }
  return A.map(function(C, F) {
    var U = C.color;
    return { color: U, stop: Math.max(Math.min(1, i[F] / e), 0) };
  });
}, vP = function(A, e, t) {
  var n = e / 2, i = t / 2, o = Xe(A[0], e) - n, l = i - Xe(A[1], t);
  return (Math.atan2(l, o) + Math.PI * 2) % (Math.PI * 2);
}, yP = function(A, e, t) {
  var n = typeof A == "number" ? A : vP(A, e, t), i = Math.abs(e * Math.sin(n)) + Math.abs(t * Math.cos(n)), o = e / 2, l = t / 2, f = i / 2, c = Math.sin(n - Math.PI / 2) * f, d = Math.cos(n - Math.PI / 2) * f;
  return [i, o - d, o + d, l - c, l + c];
}, $n = function(A, e) {
  return Math.sqrt(A * A + e * e);
}, bm = function(A, e, t, n, i) {
  var o = [
    [0, 0],
    [0, e],
    [A, 0],
    [A, e]
  ];
  return o.reduce(function(l, f) {
    var c = f[0], d = f[1], w = $n(t - c, n - d);
    return (i ? w < l.optimumDistance : w > l.optimumDistance) ? {
      optimumCorner: f,
      optimumDistance: w
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
        var f = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - n)), c = bm(n, i, e, t, !0), d = c[0], w = c[1];
        o = $n(d - e, (w - t) / f), l = f * o;
      }
      break;
    case 1:
      A.shape === 0 ? o = l = Math.max(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (o = Math.max(Math.abs(e), Math.abs(e - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (A.shape === 0)
        o = l = Math.max($n(e, t), $n(e, t - i), $n(e - n, t), $n(e - n, t - i));
      else if (A.shape === 1) {
        var f = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - n)), B = bm(n, i, e, t, !1), d = B[0], w = B[1];
        o = $n(d - e, (w - t) / f), l = f * o;
      }
      break;
  }
  return Array.isArray(A.size) && (o = Xe(A.size[0], n), l = A.size.length === 2 ? Xe(A.size[1], i) : o), [o, l];
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
  return Br(e).forEach(function(c, d) {
    var w = c[0];
    if (d === 0) {
      if (Re(w) && w.value === "linear") {
        i = 1;
        return;
      } else if (Re(w) && w.value === "radial") {
        i = 2;
        return;
      }
    }
    if (w.type === 18) {
      if (w.name === "from") {
        var B = Fi.parse(A, w.values[0]);
        n.push({ stop: bt, color: B });
      } else if (w.name === "to") {
        var B = Fi.parse(A, w.values[0]);
        n.push({ stop: yi, color: B });
      } else if (w.name === "color-stop") {
        var g = w.values.filter(ho);
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
}, by = "closest-side", Ey = "farthest-side", _y = "closest-corner", xy = "farthest-corner", Iy = "circle", Hy = "ellipse", Sy = "cover", Ly = "contain", UP = function(A, e) {
  var t = 0, n = 3, i = [], o = [];
  return Br(e).forEach(function(l, f) {
    var c = !0;
    if (f === 0) {
      var d = !1;
      c = l.reduce(function(B, g) {
        if (d)
          if (Re(g))
            switch (g.value) {
              case "center":
                return o.push(Yp), B;
              case "top":
              case "left":
                return o.push(bt), B;
              case "right":
              case "bottom":
                return o.push(yi), B;
            }
          else (ut(g) || bi(g)) && o.push(g);
        else if (Re(g))
          switch (g.value) {
            case Iy:
              return t = 0, !1;
            case Hy:
              return t = 1, !1;
            case "at":
              return d = !0, !1;
            case by:
              return n = 0, !1;
            case Sy:
            case Ey:
              return n = 1, !1;
            case Ly:
            case _y:
              return n = 2, !1;
            case xy:
              return n = 3, !1;
          }
        else if (bi(g) || ut(g))
          return Array.isArray(n) || (n = []), n.push(g), !1;
        return B;
      }, c);
    }
    if (c) {
      var w = Gc(A, l);
      i.push(w);
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
    if (f === 0 ? c = l.reduce(function(w, B) {
      if (Re(B))
        switch (B.value) {
          case "center":
            return o.push(Yp), !1;
          case "top":
          case "left":
            return o.push(bt), !1;
          case "right":
          case "bottom":
            return o.push(yi), !1;
        }
      else if (ut(B) || bi(B))
        return o.push(B), !1;
      return w;
    }, c) : f === 1 && (c = l.reduce(function(w, B) {
      if (Re(B))
        switch (B.value) {
          case Iy:
            return t = 0, !1;
          case Hy:
            return t = 1, !1;
          case Ly:
          case by:
            return n = 0, !1;
          case Ey:
            return n = 1, !1;
          case _y:
            return n = 2, !1;
          case Sy:
          case xy:
            return n = 3, !1;
        }
      else if (bi(B) || ut(B))
        return Array.isArray(n) || (n = []), n.push(B), !1;
      return w;
    }, c)), c) {
      var d = Gc(A, l);
      i.push(d);
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
}, EP = function(A) {
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
}, no;
(function(A) {
  A.AUTO = "auto", A.CONTAIN = "contain", A.COVER = "cover";
})(no || (no = {}));
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
}, Em = function(A, e) {
  return Re(A) && A.value === "normal" ? 1.2 * e : A.type === 17 ? e * A.number : ut(A) ? Xe(A, e) : e;
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
}, Sh = {
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
}, Jc = function(A) {
  return {
    name: "padding-" + A,
    initialValue: "0",
    prefix: !1,
    type: 3,
    format: "length-percentage"
  };
}, hK = Jc("top"), pK = Jc("right"), gK = Jc("bottom"), BK = Jc("left"), wK = {
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
    return e.length === 1 && Hh(e[0], "none") ? [] : Br(e).map(function(t) {
      for (var n = {
        color: $r.TRANSPARENT,
        offsetX: bt,
        offsetY: bt,
        blur: bt
      }, i = 0, o = 0; o < t.length; o++) {
        var l = t[o];
        bi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = Fi.parse(A, l);
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
}, bK = [_m, _m], EK = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    var t = e.filter(ut);
    return t.length !== 2 ? bK : [t[0], t[1]];
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
}, bs;
(function(A) {
  A.NORMAL = "normal", A.BREAK_ALL = "break-all", A.KEEP_ALL = "keep-all";
})(bs || (bs = {}));
var xK = {
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
    return e.length === 1 && Hh(e[0], "none") ? [] : Br(e).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: bt,
        offsetY: bt,
        blur: bt,
        spread: bt,
        inset: !1
      }, i = 0, o = 0; o < t.length; o++) {
        var l = t[o];
        Hh(l, "inset") ? n.inset = !0 : bi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = Fi.parse(A, l);
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
      this.animationDuration = MA(e, kK, t.animationDuration), this.backgroundClip = MA(e, wP, t.backgroundClip), this.backgroundColor = MA(e, mP, t.backgroundColor), this.backgroundImage = MA(e, xP, t.backgroundImage), this.backgroundOrigin = MA(e, IP, t.backgroundOrigin), this.backgroundPosition = MA(e, HP, t.backgroundPosition), this.backgroundRepeat = MA(e, SP, t.backgroundRepeat), this.backgroundSize = MA(e, TP, t.backgroundSize), this.borderTopColor = MA(e, OP, t.borderTopColor), this.borderRightColor = MA(e, NP, t.borderRightColor), this.borderBottomColor = MA(e, MP, t.borderBottomColor), this.borderLeftColor = MA(e, PP, t.borderLeftColor), this.borderTopLeftRadius = MA(e, KP, t.borderTopLeftRadius), this.borderTopRightRadius = MA(e, RP, t.borderTopRightRadius), this.borderBottomRightRadius = MA(e, kP, t.borderBottomRightRadius), this.borderBottomLeftRadius = MA(e, $P, t.borderBottomLeftRadius), this.borderTopStyle = MA(e, GP, t.borderTopStyle), this.borderRightStyle = MA(e, VP, t.borderRightStyle), this.borderBottomStyle = MA(e, WP, t.borderBottomStyle), this.borderLeftStyle = MA(e, XP, t.borderLeftStyle), this.borderTopWidth = MA(e, qP, t.borderTopWidth), this.borderRightWidth = MA(e, zP, t.borderRightWidth), this.borderBottomWidth = MA(e, JP, t.borderBottomWidth), this.borderLeftWidth = MA(e, jP, t.borderLeftWidth), this.boxShadow = MA(e, GK, t.boxShadow), this.color = MA(e, YP, t.color), this.direction = MA(e, ZP, t.direction), this.display = MA(e, AK, t.display), this.float = MA(e, tK, t.cssFloat), this.fontFamily = MA(e, TK, t.fontFamily), this.fontSize = MA(e, DK, t.fontSize), this.fontStyle = MA(e, MK, t.fontStyle), this.fontVariant = MA(e, NK, t.fontVariant), this.fontWeight = MA(e, OK, t.fontWeight), this.letterSpacing = MA(e, nK, t.letterSpacing), this.lineBreak = MA(e, rK, t.lineBreak), this.lineHeight = MA(e, iK, t.lineHeight), this.listStyleImage = MA(e, aK, t.listStyleImage), this.listStylePosition = MA(e, oK, t.listStylePosition), this.listStyleType = MA(e, Sh, t.listStyleType), this.marginTop = MA(e, sK, t.marginTop), this.marginRight = MA(e, uK, t.marginRight), this.marginBottom = MA(e, lK, t.marginBottom), this.marginLeft = MA(e, cK, t.marginLeft), this.opacity = MA(e, HK, t.opacity);
      var o = MA(e, fK, t.overflow);
      this.overflowX = o[0], this.overflowY = o[o.length > 1 ? 1 : 0], this.overflowWrap = MA(e, dK, t.overflowWrap), this.paddingTop = MA(e, hK, t.paddingTop), this.paddingRight = MA(e, pK, t.paddingRight), this.paddingBottom = MA(e, gK, t.paddingBottom), this.paddingLeft = MA(e, BK, t.paddingLeft), this.paintOrder = MA(e, VK, t.paintOrder), this.position = MA(e, mK, t.position), this.textAlign = MA(e, wK, t.textAlign), this.textDecorationColor = MA(e, SK, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = MA(e, LK, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = MA(e, vK, t.textShadow), this.textTransform = MA(e, yK, t.textTransform), this.transform = MA(e, CK, t.transform), this.transformOrigin = MA(e, EK, t.transformOrigin), this.visibility = MA(e, _K, t.visibility), this.webkitTextStrokeColor = MA(e, WK, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = MA(e, XK, t.webkitTextStrokeWidth), this.wordBreak = MA(e, xK, t.wordBreak), this.zIndex = MA(e, IK, t.zIndex);
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
      this.content = MA(e, PK, t.content), this.quotes = MA(e, $K, t.quotes);
    }
    return A;
  }()
), Im = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.counterIncrement = MA(e, KK, t.counterIncrement), this.counterReset = MA(e, RK, t.counterReset);
    }
    return A;
  }()
), MA = function(A, e, t) {
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
          return bi(f) ? f : bt;
        case "length-percentage":
          var c = o.parseComponentValue();
          return ut(c) ? c : bt;
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
}, Lh = function(A, e) {
  var t = jK(A);
  return t === 1 || e === t;
}, wr = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, Lh(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new qK(e, window.getComputedStyle(t, null)), Oh(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = Rc(this.context, t), Lh(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return A;
  }()
), YK = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", Hm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", hs = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Tl = 0; Tl < Hm.length; Tl++)
  hs[Hm.charCodeAt(Tl)] = Tl;
var ZK = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, o, l, f, c;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var d = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), w = Array.isArray(d) ? d : new Uint8Array(d);
  for (n = 0; n < t; n += 4)
    o = hs[A.charCodeAt(n)], l = hs[A.charCodeAt(n + 1)], f = hs[A.charCodeAt(n + 2)], c = hs[A.charCodeAt(n + 3)], w[i++] = o << 2 | l >> 4, w[i++] = (l & 15) << 4 | f >> 2, w[i++] = (f & 3) << 6 | c & 63;
  return d;
}, AR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, eR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, aa = 5, Ag = 11, Sd = 2, tR = Ag - aa, Oy = 65536 >> aa, nR = 1 << aa, Ld = nR - 1, rR = 1024 >> aa, iR = Oy + rR, aR = iR, oR = 32, sR = aR + oR, uR = 65536 >> Ag, lR = 1 << tR, cR = lR - 1, Sm = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, fR = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, dR = function(A, e) {
  var t = ZK(A), n = Array.isArray(t) ? eR(t) : new Uint32Array(t), i = Array.isArray(t) ? AR(t) : new Uint16Array(t), o = 24, l = Sm(i, o / 2, n[4] / 2), f = n[5] === 2 ? Sm(i, (o + n[4]) / 2) : fR(n, Math.ceil((o + n[4]) / 4));
  return new hR(n[0], n[1], n[2], n[3], l, f);
}, hR = (
  /** @class */
  function() {
    function A(e, t, n, i, o, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = o, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> aa], t = (t << Sd) + (e & Ld), this.data[t];
        if (e <= 65535)
          return t = this.index[Oy + (e - 55296 >> aa)], t = (t << Sd) + (e & Ld), this.data[t];
        if (e < this.highStart)
          return t = sR - uR + (e >> Ag), t = this.index[t], t += e >> aa & cR, t = this.index[t], t = (t << Sd) + (e & Ld), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Lm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", pR = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Dl = 0; Dl < Lm.length; Dl++)
  pR[Lm.charCodeAt(Dl)] = Dl;
var gR = 1, Td = 2, Dd = 3, Tm = 4, Dm = 5, BR = 7, Om = 8, Od = 9, Nd = 10, Nm = 11, Mm = 12, Pm = 13, Km = 14, Md = 15, wR = function(A) {
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
}, vR = dR(YK), vn = "×", Pd = "÷", yR = function(A) {
  return vR.get(A);
}, CR = function(A, e, t) {
  var n = t - 2, i = e[n], o = e[t - 1], l = e[t];
  if (o === Td && l === Dd)
    return vn;
  if (o === Td || o === Dd || o === Tm || l === Td || l === Dd || l === Tm)
    return Pd;
  if (o === Om && [Om, Od, Nm, Mm].indexOf(l) !== -1 || (o === Nm || o === Od) && (l === Od || l === Nd) || (o === Mm || o === Nd) && l === Nd || l === Pm || l === Dm || l === BR || o === gR)
    return vn;
  if (o === Pm && l === Km) {
    for (; i === Dm; )
      i = e[--n];
    if (i === Km)
      return vn;
  }
  if (o === Md && l === Md) {
    for (var f = 0; i === Md; )
      f++, i = e[--n];
    if (f % 2 === 0)
      return vn;
  }
  return Pd;
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
}, bR = function(A) {
  var e = A.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", A.body.appendChild(e);
  var t = A.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = e.firstChild, i = kc(n.data).map(function(c) {
    return ot(c);
  }), o = 0, l = {}, f = i.every(function(c, d) {
    t.setStart(n, o), t.setEnd(n, o + c.length);
    var w = t.getBoundingClientRect();
    o += c.length;
    var B = w.x > l.x || w.y > l.y;
    return l = w, d === 0 ? !0 : B;
  });
  return A.body.removeChild(e), f;
}, ER = function() {
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
  var l = Th(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), km(l).then(function(f) {
    n.drawImage(f, 0, 0);
    var c = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var d = A.createElement("div");
    return d.style.backgroundImage = "url(" + o + ")", d.style.height = t + "px", Rm(c) ? km(Th(t, t, 0, 0, d)) : Promise.reject(!1);
  }).then(function(f) {
    return n.drawImage(f, 0, 0), Rm(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Th = function(A, e, t, n, i) {
  var o = "http://www.w3.org/2000/svg", l = document.createElementNS(o, "svg"), f = document.createElementNS(o, "foreignObject");
  return l.setAttributeNS(null, "width", A.toString()), l.setAttributeNS(null, "height", e.toString()), f.setAttributeNS(null, "width", "100%"), f.setAttributeNS(null, "height", "100%"), f.setAttributeNS(null, "x", t.toString()), f.setAttributeNS(null, "y", n.toString()), f.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(f), f.appendChild(i), l;
}, km = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      return e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, Ft = {
  get SUPPORT_RANGE_BOUNDS() {
    var A = UR(document);
    return Object.defineProperty(Ft, "SUPPORT_RANGE_BOUNDS", { value: A }), A;
  },
  get SUPPORT_WORD_BREAKING() {
    var A = Ft.SUPPORT_RANGE_BOUNDS && bR(document);
    return Object.defineProperty(Ft, "SUPPORT_WORD_BREAKING", { value: A }), A;
  },
  get SUPPORT_SVG_DRAWING() {
    var A = xR(document);
    return Object.defineProperty(Ft, "SUPPORT_SVG_DRAWING", { value: A }), A;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var A = typeof Array.from == "function" && typeof window.fetch == "function" ? IR(document) : Promise.resolve(!1);
    return Object.defineProperty(Ft, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A }), A;
  },
  get SUPPORT_CORS_IMAGES() {
    var A = ER();
    return Object.defineProperty(Ft, "SUPPORT_CORS_IMAGES", { value: A }), A;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var A = _R();
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
}, Es = (
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
      if (Ft.SUPPORT_RANGE_BOUNDS) {
        var c = $m(n, l, f.length).getClientRects();
        if (c.length > 1) {
          var d = eg(f), w = 0;
          d.forEach(function(g) {
            o.push(new Es(g, Xr.fromDOMRectList(A, $m(n, w + l, g.length).getClientRects()))), w += g.length;
          });
        } else
          o.push(new Es(f, Xr.fromDOMRectList(A, c)));
      } else {
        var B = n.splitText(f.length);
        o.push(new Es(f, SR(A, n))), n = B;
      }
    else Ft.SUPPORT_RANGE_BOUNDS || (n = n.splitText(f.length));
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
  if (Ft.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var e = new Intl.Segmenter(void 0, { granularity: "grapheme" });
    return Array.from(e.segment(A)).map(function(t) {
      return t.segment;
    });
  }
  return FR(A);
}, LR = function(A, e) {
  if (Ft.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
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
      f.forEach(function(d) {
        DR.indexOf(d) === -1 ? c += ot(d) : (c.length && n.push(c), n.push(ot(d)), c = "");
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
), Dh = (
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
    else if (Ya(i))
      if (Jy(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(f) {
          return Zl(A, f, t, n);
        });
      else {
        var l = Gy(A, i);
        l.styles.isVisible() && (XR(i, l, n) ? l.flags |= 4 : qR(l.styles) && (l.flags |= 2), WR.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Zl(A, i.shadowRoot, l, n) : !Fc(i) && !Xy(i) && !Uc(i) && Zl(A, i, l, n));
      }
}, Gy = function(A, e) {
  return Nh(e) ? new Ny(A, e) : qy(e) ? new My(A, e) : Xy(e) ? new Py(A, e) : zR(e) ? new Ky(A, e) : JR(e) ? new Dh(A, e) : jR(e) ? new tg(A, e) : Uc(e) ? new Ry(A, e) : Fc(e) ? new ky(A, e) : zy(e) ? new $y(A, e) : new wr(A, e);
}, Vy = function(A, e) {
  var t = Gy(A, e);
  return t.flags |= 4, Zl(A, e, t, t), t;
}, XR = function(A, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || ng(A) && t.styles.isTransparent();
}, qR = function(A) {
  return A.isPositioned() || A.isFloating();
}, Wy = function(A) {
  return A.nodeType === Node.TEXT_NODE;
}, Ya = function(A) {
  return A.nodeType === Node.ELEMENT_NODE;
}, Oh = function(A) {
  return Ya(A) && typeof A.style < "u" && !Ac(A);
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
}, Nh = function(A) {
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
}, Ga = function(A, e, t, n, i, o) {
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
}, za = 1, pi = 2, gi = 4, ps = 8, Mr = function(A, e, t, n, i, o) {
  if (A < -9999 || A > 9999)
    return Ks(A, 4, i.length > 0);
  var l = Math.abs(A), f = i;
  if (l === 0)
    return e[0] + f;
  for (var c = 0; l > 0 && c <= 4; c++) {
    var d = l % 10;
    d === 0 && ht(o, za) && f !== "" ? f = e[d] + f : d > 1 || d === 1 && c === 0 || d === 1 && c === 1 && ht(o, pi) || d === 1 && c === 1 && ht(o, gi) && A > 100 || d === 1 && c > 1 && ht(o, ps) ? f = e[d] + (c > 0 ? t[c - 1] : "") + f : d === 1 && c > 0 && (f = t[c - 1] + f), l = Math.floor(l / 10);
  }
  return (A < 0 ? n : "") + f;
}, Jm = "十百千萬", jm = "拾佰仟萬", Ym = "マイナス", Kd = "마이너스", Ks = function(A, e, t) {
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
      return Ga(A, 1, 3999, qm, 3, n).toLowerCase();
    case 7:
      return Ga(A, 1, 3999, qm, 3, n);
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
      return Ga(A, 1, 9999, zm, 3, n);
    case 35:
      return Ga(A, 1, 9999, zm, 3, n).toLowerCase();
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
      return Mr(A, "零壹貳參肆伍陸柒捌玖", jm, "負", i, za | pi | gi | ps);
    case 42:
      return Mr(A, "零一二三四五六七八九", Jm, "负", i, pi | gi | ps);
    case 41:
      return Mr(A, "零壹贰叁肆伍陆柒捌玖", jm, "负", i, za | pi | gi | ps);
    case 26:
      return Mr(A, "〇一二三四五六七八九", "十百千万", Ym, i, 0);
    case 25:
      return Mr(A, "零壱弐参四伍六七八九", "拾百千万", Ym, i, za | pi | gi);
    case 31:
      return Mr(A, "영일이삼사오육칠팔구", "십백천만", Kd, o, za | pi | gi);
    case 33:
      return Mr(A, "零一二三四五六七八九", "十百千萬", Kd, o, 0);
    case 32:
      return Mr(A, "零壹貳參四五六七八九", "拾百千", Kd, o, za | pi | gi);
    case 18:
      return it(A, 2406, 2415, !0, n);
    case 20:
      return Ga(A, 1, 19999, tk, 3, n);
    case 21:
      return it(A, 2790, 2799, !0, n);
    case 22:
      return it(A, 2662, 2671, !0, n);
    case 22:
      return Ga(A, 1, 10999, ek, 3, n);
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
      var o = e.defaultView.pageXOffset, l = e.defaultView.pageYOffset, f = i.contentWindow, c = f.document, d = ak(i).then(function() {
        return Gt(n, void 0, void 0, function() {
          var w, B;
          return Ot(this, function(g) {
            switch (g.label) {
              case 0:
                return this.scrolledElements.forEach(lk), f && (f.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (f.scrollY !== t.top || f.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(f.scrollX - t.left, f.scrollY - t.top, 0, 0))), w = this.options.onclone, B = this.clonedReferenceElement, typeof B > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : c.fonts && c.fonts.ready ? [4, c.fonts.ready] : [3, 2];
              case 1:
                g.sent(), g.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, ik(c)] : [3, 4];
              case 3:
                g.sent(), g.label = 4;
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
      return c.open(), c.write(sk(document.doctype) + "<html></html>"), uk(this.referenceElement.ownerDocument, o, l), c.replaceChild(c.adoptNode(this.documentElement), c.documentElement), c.close(), d;
    }, A.prototype.createElementClone = function(e) {
      if (Lh(
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
      return Nh(t) && (Nh(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Xm(t) ? this.createCustomElementClone(t) : t;
    }, A.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return Rd(e.style, t), t;
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
      (!Ya(t) || !ZR(t) && !t.hasAttribute(Yy) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !Ya(t) || !Wm(t)) && e.appendChild(this.cloneNode(t, n));
    }, A.prototype.cloneChildNodes = function(e, t, n) {
      for (var i = this, o = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; o; o = o.nextSibling)
        if (Ya(o) && Jy(o) && typeof o.assignedNodes == "function") {
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
      if (n && Ya(e) && (Oh(e) || Ac(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var o = n.getComputedStyle(e), l = n.getComputedStyle(e, ":before"), f = n.getComputedStyle(e, ":after");
        this.referenceElement === e && Oh(i) && (this.clonedReferenceElement = i), ng(i) && dk(i);
        var c = this.counters.parse(new Im(this.context, o)), d = this.resolvePseudoContent(e, i, l, _s.BEFORE);
        Xm(e) && (t = !0), Vm(e) || this.cloneChildNodes(e, i, t), d && i.insertBefore(d, i.firstChild);
        var w = this.resolvePseudoContent(e, i, f, _s.AFTER);
        return w && i.appendChild(w), this.counters.pop(c), (o && (this.options.copyStyles || Ac(e)) && !zy(e) || t) && Rd(o, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (Fc(e) || Uc(e)) && (Fc(i) || Uc(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, A.prototype.resolvePseudoContent = function(e, t, n, i) {
      var o = this;
      if (n) {
        var l = n.content, f = t.ownerDocument;
        if (!(!f || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new Im(this.context, n));
          var c = new zK(this.context, n), d = f.createElement("html2canvaspseudoelement");
          Rd(n, d), c.content.forEach(function(B) {
            if (B.type === 0)
              d.appendChild(f.createTextNode(B.value));
            else if (B.type === 22) {
              var g = f.createElement("img");
              g.src = B.value, g.style.opacity = "1", d.appendChild(g);
            } else if (B.type === 18) {
              if (B.name === "attr") {
                var v = B.values.filter(Re);
                v.length && d.appendChild(f.createTextNode(e.getAttribute(v[0].value) || ""));
              } else if (B.name === "counter") {
                var u = B.values.filter(ho), C = u[0], F = u[1];
                if (C && Re(C)) {
                  var U = o.counters.getCounterValue(C.value), H = F && Re(F) ? Sh.parse(o.context, F.value) : 3;
                  d.appendChild(f.createTextNode(Ks(U, H, !1)));
                }
              } else if (B.name === "counters") {
                var O = B.values.filter(ho), C = O[0], _ = O[1], F = O[2];
                if (C && Re(C)) {
                  var M = o.counters.getCounterValues(C.value), K = F && Re(F) ? Sh.parse(o.context, F.value) : 3, z = _ && _.type === 0 ? _.value : "", cA = M.map(function(FA) {
                    return Ks(FA, K, !1);
                  }).join(z);
                  d.appendChild(f.createTextNode(cA));
                }
              }
            } else if (B.type === 20)
              switch (B.value) {
                case "open-quote":
                  d.appendChild(f.createTextNode(xm(c.quotes, o.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  d.appendChild(f.createTextNode(xm(c.quotes, --o.quoteDepth, !1)));
                  break;
                default:
                  d.appendChild(f.createTextNode(B.value));
              }
          }), d.className = Mh + " " + Ph;
          var w = i === _s.BEFORE ? " " + Mh : " " + Ph;
          return Ac(t) ? t.className.baseValue += w : t.className += w, d;
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
], Rd = function(A, e) {
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
}, ck = ":before", fk = ":after", Mh = "___html2canvas___pseudoelement_before", Ph = "___html2canvas___pseudoelement_after", Av = `{
    content: "" !important;
    display: none !important;
}`, dk = function(A) {
  hk(A, "." + Mh + ck + Av + `
         .` + Ph + fk + Av);
}, hk = function(A, e) {
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
      return this.has(e) || ($d(e) || mk(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, A.prototype.match = function(e) {
      return this._cache[e];
    }, A.prototype.loadImage = function(e) {
      return Gt(this, void 0, void 0, function() {
        var t, n, i, o, l = this;
        return Ot(this, function(f) {
          switch (f.label) {
            case 0:
              return t = Zy.isSameOrigin(e), n = !kd(e) && this._options.useCORS === !0 && Ft.SUPPORT_CORS_IMAGES && !t, i = !kd(e) && !t && !$d(e) && typeof this._options.proxy == "string" && Ft.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !kd(e) && !$d(e) && !i && !n ? [
                2
                /*return*/
              ] : (o = e, i ? [4, this.proxy(o)] : [3, 2]);
            case 1:
              o = f.sent(), f.label = 2;
            case 2:
              return this.context.logger.debug("Added image " + e.substring(0, 256)), [4, new Promise(function(c, d) {
                var w = new Image();
                w.onload = function() {
                  return c(w);
                }, w.onerror = d, (vk(o) || n) && (w.crossOrigin = "anonymous"), w.src = o, w.complete === !0 && setTimeout(function() {
                  return c(w);
                }, 500), l._options.imageTimeout > 0 && setTimeout(function() {
                  return d("Timed out (" + l._options.imageTimeout + "ms) loading image");
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
        var d = n.indexOf("?") > -1 ? "&" : "?";
        if (c.open("GET", "" + n + d + "url=" + encodeURIComponent(e) + "&responseType=" + f), f !== "text" && c instanceof XMLHttpRequest && (c.responseType = f), t._options.imageTimeout) {
          var w = t._options.imageTimeout;
          c.timeout = w, c.ontimeout = function() {
            return l("Timed out (" + w + "ms) proxying " + i);
          };
        }
        c.send();
      });
    }, A;
  }()
), gk = /^data:image\/svg\+xml/i, Bk = /^data:image\/.*;base64,/i, wk = /^data:image\/.*/i, mk = function(A) {
  return Ft.SUPPORT_SVG_DRAWING || !yk(A);
}, kd = function(A) {
  return wk.test(A);
}, vk = function(A) {
  return Bk.test(A);
}, $d = function(A) {
  return A.substr(0, 4) === "blob";
}, yk = function(A) {
  return A.substr(-3).toLowerCase() === "svg" || gk.test(A);
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
), Va = function(A, e, t) {
  return new TA(A.x + (e.x - A.x) * t, A.y + (e.y - A.y) * t);
}, Ol = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = n, this.end = i;
    }
    return A.prototype.subdivide = function(e, t) {
      var n = Va(this.start, this.startControl, e), i = Va(this.startControl, this.endControl, e), o = Va(this.endControl, this.end, e), l = Va(n, i, e), f = Va(i, o, e), c = Va(l, f, e);
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
      var t = e.styles, n = e.bounds, i = ds(t.borderTopLeftRadius, n.width, n.height), o = i[0], l = i[1], f = ds(t.borderTopRightRadius, n.width, n.height), c = f[0], d = f[1], w = ds(t.borderBottomRightRadius, n.width, n.height), B = w[0], g = w[1], v = ds(t.borderBottomLeftRadius, n.width, n.height), u = v[0], C = v[1], F = [];
      F.push((o + c) / n.width), F.push((u + B) / n.width), F.push((l + C) / n.height), F.push((d + g) / n.height);
      var U = Math.max.apply(Math, F);
      U > 1 && (o /= U, l /= U, c /= U, d /= U, B /= U, g /= U, u /= U, C /= U);
      var H = n.width - c, O = n.height - g, _ = n.width - B, M = n.height - C, K = t.borderTopWidth, z = t.borderRightWidth, cA = t.borderBottomWidth, sA = t.borderLeftWidth, gA = Xe(t.paddingTop, e.bounds.width), FA = Xe(t.paddingRight, e.bounds.width), NA = Xe(t.paddingBottom, e.bounds.width), _A = Xe(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = o > 0 || l > 0 ? je(n.left + sA / 3, n.top + K / 3, o - sA / 3, l - K / 3, Ne.TOP_LEFT) : new TA(n.left + sA / 3, n.top + K / 3), this.topRightBorderDoubleOuterBox = o > 0 || l > 0 ? je(n.left + H, n.top + K / 3, c - z / 3, d - K / 3, Ne.TOP_RIGHT) : new TA(n.left + n.width - z / 3, n.top + K / 3), this.bottomRightBorderDoubleOuterBox = B > 0 || g > 0 ? je(n.left + _, n.top + O, B - z / 3, g - cA / 3, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - z / 3, n.top + n.height - cA / 3), this.bottomLeftBorderDoubleOuterBox = u > 0 || C > 0 ? je(n.left + sA / 3, n.top + M, u - sA / 3, C - cA / 3, Ne.BOTTOM_LEFT) : new TA(n.left + sA / 3, n.top + n.height - cA / 3), this.topLeftBorderDoubleInnerBox = o > 0 || l > 0 ? je(n.left + sA * 2 / 3, n.top + K * 2 / 3, o - sA * 2 / 3, l - K * 2 / 3, Ne.TOP_LEFT) : new TA(n.left + sA * 2 / 3, n.top + K * 2 / 3), this.topRightBorderDoubleInnerBox = o > 0 || l > 0 ? je(n.left + H, n.top + K * 2 / 3, c - z * 2 / 3, d - K * 2 / 3, Ne.TOP_RIGHT) : new TA(n.left + n.width - z * 2 / 3, n.top + K * 2 / 3), this.bottomRightBorderDoubleInnerBox = B > 0 || g > 0 ? je(n.left + _, n.top + O, B - z * 2 / 3, g - cA * 2 / 3, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - z * 2 / 3, n.top + n.height - cA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = u > 0 || C > 0 ? je(n.left + sA * 2 / 3, n.top + M, u - sA * 2 / 3, C - cA * 2 / 3, Ne.BOTTOM_LEFT) : new TA(n.left + sA * 2 / 3, n.top + n.height - cA * 2 / 3), this.topLeftBorderStroke = o > 0 || l > 0 ? je(n.left + sA / 2, n.top + K / 2, o - sA / 2, l - K / 2, Ne.TOP_LEFT) : new TA(n.left + sA / 2, n.top + K / 2), this.topRightBorderStroke = o > 0 || l > 0 ? je(n.left + H, n.top + K / 2, c - z / 2, d - K / 2, Ne.TOP_RIGHT) : new TA(n.left + n.width - z / 2, n.top + K / 2), this.bottomRightBorderStroke = B > 0 || g > 0 ? je(n.left + _, n.top + O, B - z / 2, g - cA / 2, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - z / 2, n.top + n.height - cA / 2), this.bottomLeftBorderStroke = u > 0 || C > 0 ? je(n.left + sA / 2, n.top + M, u - sA / 2, C - cA / 2, Ne.BOTTOM_LEFT) : new TA(n.left + sA / 2, n.top + n.height - cA / 2), this.topLeftBorderBox = o > 0 || l > 0 ? je(n.left, n.top, o, l, Ne.TOP_LEFT) : new TA(n.left, n.top), this.topRightBorderBox = c > 0 || d > 0 ? je(n.left + H, n.top, c, d, Ne.TOP_RIGHT) : new TA(n.left + n.width, n.top), this.bottomRightBorderBox = B > 0 || g > 0 ? je(n.left + _, n.top + O, B, g, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = u > 0 || C > 0 ? je(n.left, n.top + M, u, C, Ne.BOTTOM_LEFT) : new TA(n.left, n.top + n.height), this.topLeftPaddingBox = o > 0 || l > 0 ? je(n.left + sA, n.top + K, Math.max(0, o - sA), Math.max(0, l - K), Ne.TOP_LEFT) : new TA(n.left + sA, n.top + K), this.topRightPaddingBox = c > 0 || d > 0 ? je(n.left + Math.min(H, n.width - z), n.top + K, H > n.width + z ? 0 : Math.max(0, c - z), Math.max(0, d - K), Ne.TOP_RIGHT) : new TA(n.left + n.width - z, n.top + K), this.bottomRightPaddingBox = B > 0 || g > 0 ? je(n.left + Math.min(_, n.width - sA), n.top + Math.min(O, n.height - cA), Math.max(0, B - z), Math.max(0, g - cA), Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - z, n.top + n.height - cA), this.bottomLeftPaddingBox = u > 0 || C > 0 ? je(n.left + sA, n.top + Math.min(M, n.height - cA), Math.max(0, u - sA), Math.max(0, C - cA), Ne.BOTTOM_LEFT) : new TA(n.left + sA, n.top + n.height - cA), this.topLeftContentBox = o > 0 || l > 0 ? je(n.left + sA + _A, n.top + K + gA, Math.max(0, o - (sA + _A)), Math.max(0, l - (K + gA)), Ne.TOP_LEFT) : new TA(n.left + sA + _A, n.top + K + gA), this.topRightContentBox = c > 0 || d > 0 ? je(n.left + Math.min(H, n.width + sA + _A), n.top + K + gA, H > n.width + sA + _A ? 0 : c - sA + _A, d - (K + gA), Ne.TOP_RIGHT) : new TA(n.left + n.width - (z + FA), n.top + K + gA), this.bottomRightContentBox = B > 0 || g > 0 ? je(n.left + Math.min(_, n.width - (sA + _A)), n.top + Math.min(O, n.height + K + gA), Math.max(0, B - (z + FA)), g - (cA + NA), Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - (z + FA), n.top + n.height - (cA + NA)), this.bottomLeftContentBox = u > 0 || C > 0 ? je(n.left + sA + _A, n.top + M, Math.max(0, u - (sA + _A)), C - (cA + NA), Ne.BOTTOM_LEFT) : new TA(n.left + sA + _A, n.top + n.height - (cA + NA));
    }
    return A;
  }()
), Ne;
(function(A) {
  A[A.TOP_LEFT = 0] = "TOP_LEFT", A[A.TOP_RIGHT = 1] = "TOP_RIGHT", A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(Ne || (Ne = {}));
var je = function(A, e, t, n, i) {
  var o = 4 * ((Math.sqrt(2) - 1) / 3), l = t * o, f = n * o, c = A + t, d = e + n;
  switch (i) {
    case Ne.TOP_LEFT:
      return new Ol(new TA(A, d), new TA(A, d - f), new TA(c - l, e), new TA(c, e));
    case Ne.TOP_RIGHT:
      return new Ol(new TA(A, e), new TA(A + l, e), new TA(c, d - f), new TA(c, d));
    case Ne.BOTTOM_RIGHT:
      return new Ol(new TA(c, e), new TA(c, e + f), new TA(A + l, d), new TA(A, d));
    case Ne.BOTTOM_LEFT:
    default:
      return new Ol(new TA(c, d), new TA(c - l, d), new TA(A, e + f), new TA(A, e));
  }
}, bc = function(A) {
  return [A.topLeftBorderBox, A.topRightBorderBox, A.bottomRightBorderBox, A.bottomLeftBorderBox];
}, Qk = function(A) {
  return [
    A.topLeftContentBox,
    A.topRightContentBox,
    A.bottomRightContentBox,
    A.bottomLeftContentBox
  ];
}, Ec = function(A) {
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
), bk = function(A) {
  return A.type === 0;
}, AC = function(A) {
  return A.type === 1;
}, Ek = function(A) {
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
        var l = bc(this.curves), f = Ec(this.curves);
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
            var l = bc(n.curves), f = Ec(n.curves);
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
), Kh = function(A, e, t, n) {
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
      var d = o || i.styles.isPositioned() ? t : e, w = new eC(f);
      if (i.styles.isPositioned() || i.styles.opacity < 1 || i.styles.isTransformed()) {
        var B = i.styles.zIndex.order;
        if (B < 0) {
          var g = 0;
          d.negativeZIndex.some(function(u, C) {
            return B > u.element.container.styles.zIndex.order ? (g = C, !1) : g > 0;
          }), d.negativeZIndex.splice(g, 0, w);
        } else if (B > 0) {
          var v = 0;
          d.positiveZIndex.some(function(u, C) {
            return B >= u.element.container.styles.zIndex.order ? (v = C + 1, !1) : v > 0;
          }), d.positiveZIndex.splice(v, 0, w);
        } else
          d.zeroOrAutoZIndexOrTransformedOrOpacity.push(w);
      } else
        i.styles.isFloating() ? d.nonPositionedFloats.push(w) : d.nonPositionedInlineLevel.push(w);
      Kh(f, w, o ? w : t, c);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(f) : e.nonInlineLevel.push(f), Kh(f, e, t, c);
    ht(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && nC(i, c);
  });
}, nC = function(A, e) {
  for (var t = A instanceof Dh ? A.start : 1, n = A instanceof Dh ? A.reversed : !1, i = 0; i < e.length; i++) {
    var o = e[i];
    o.container instanceof Ky && typeof o.container.value == "number" && o.container.value !== 0 && (t = o.container.value), o.listValue = Ks(t, o.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, xk = function(A) {
  var e = new tC(A, null), t = new eC(e), n = [];
  return Kh(e, t, t, n), nC(e.container, n), t;
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
  var e = A.styles, t = A.bounds, n = Xe(e.paddingLeft, t.width), i = Xe(e.paddingRight, t.width), o = Xe(e.paddingTop, t.width), l = Xe(e.paddingBottom, t.width);
  return t.add(n + e.borderLeftWidth, o + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + n + i), -(e.borderTopWidth + e.borderBottomWidth + o + l));
}, Lk = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? _c(e) : rC(e);
}, Tk = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? _c(e) : rC(e);
}, Gd = function(A, e, t) {
  var n = Lk(Ja(A.styles.backgroundOrigin, e), A), i = Tk(Ja(A.styles.backgroundClip, e), A), o = Dk(Ja(A.styles.backgroundSize, e), t, n), l = o[0], f = o[1], c = ds(Ja(A.styles.backgroundPosition, e), n.width - l, n.height - f), d = Ok(Ja(A.styles.backgroundRepeat, e), c, o, n, i), w = Math.round(n.left + c[0]), B = Math.round(n.top + c[1]);
  return [d, w, B, l, f];
}, Wa = function(A) {
  return Re(A) && A.value === no.AUTO;
}, Pl = function(A) {
  return typeof A == "number";
}, Dk = function(A, e, t) {
  var n = e[0], i = e[1], o = e[2], l = A[0], f = A[1];
  if (!l)
    return [0, 0];
  if (ut(l) && f && ut(f))
    return [Xe(l, t.width), Xe(f, t.height)];
  var c = Pl(o);
  if (Re(l) && (l.value === no.CONTAIN || l.value === no.COVER)) {
    if (Pl(o)) {
      var d = t.width / t.height;
      return d < o != (l.value === no.COVER) ? [t.width, t.width / o] : [t.height * o, t.height];
    }
    return [t.width, t.height];
  }
  var w = Pl(n), B = Pl(i), g = w || B;
  if (Wa(l) && (!f || Wa(f))) {
    if (w && B)
      return [n, i];
    if (!c && !g)
      return [t.width, t.height];
    if (g && c) {
      var v = w ? n : i * o, u = B ? i : n / o;
      return [v, u];
    }
    var C = w ? n : t.width, F = B ? i : t.height;
    return [C, F];
  }
  if (c) {
    var U = 0, H = 0;
    return ut(l) ? U = Xe(l, t.width) : ut(f) && (H = Xe(f, t.height)), Wa(l) ? U = H * o : (!f || Wa(f)) && (H = U / o), [U, H];
  }
  var O = null, _ = null;
  if (ut(l) ? O = Xe(l, t.width) : f && ut(f) && (_ = Xe(f, t.height)), O !== null && (!f || Wa(f)) && (_ = w && B ? O / n * i : t.height), _ !== null && Wa(l) && (O = w && B ? _ / i * n : t.width), O !== null && _ !== null)
    return [O, _];
  throw new Error("Unable to calculate background-size for element");
}, Ja = function(A, e) {
  var t = A[e];
  return typeof t > "u" ? A[0] : t;
}, Ok = function(A, e, t, n, i) {
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
      this.ctx.save(), Ek(t) && (this.ctx.globalAlpha = t.opacity), bk(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), AC(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
    }, e.prototype.popEffect = function() {
      this._activeEffects.pop(), this.ctx.restore();
    }, e.prototype.renderStack = function(t) {
      return Gt(this, void 0, void 0, function() {
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
      return Gt(this, void 0, void 0, function() {
        return Ot(this, function(n) {
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
        var i, o, l, f, c, d, w, B, g = this;
        return Ot(this, function(v) {
          return i = this.createFontStyle(n), o = i[0], l = i[1], f = i[2], this.ctx.font = o, this.ctx.direction = n.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", c = this.fontMetrics.getMetrics(l, f), d = c.baseline, w = c.middle, B = n.paintOrder, t.textBounds.forEach(function(u) {
            B.forEach(function(C) {
              switch (C) {
                case 0:
                  g.ctx.fillStyle = wt(n.color), g.renderTextWithLetterSpacing(u, n.letterSpacing, d);
                  var F = n.textShadow;
                  F.length && u.text.trim().length && (F.slice(0).reverse().forEach(function(U) {
                    g.ctx.shadowColor = wt(U.color), g.ctx.shadowOffsetX = U.offsetX.number * g.options.scale, g.ctx.shadowOffsetY = U.offsetY.number * g.options.scale, g.ctx.shadowBlur = U.blur.number, g.renderTextWithLetterSpacing(u, n.letterSpacing, d);
                  }), g.ctx.shadowColor = "", g.ctx.shadowOffsetX = 0, g.ctx.shadowOffsetY = 0, g.ctx.shadowBlur = 0), n.textDecorationLine.length && (g.ctx.fillStyle = wt(n.textDecorationColor || n.color), n.textDecorationLine.forEach(function(U) {
                    switch (U) {
                      case 1:
                        g.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top + d), u.bounds.width, 1);
                        break;
                      case 2:
                        g.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top), u.bounds.width, 1);
                        break;
                      case 3:
                        g.ctx.fillRect(u.bounds.left, Math.ceil(u.bounds.top + w), u.bounds.width, 1);
                        break;
                    }
                  }));
                  break;
                case 1:
                  n.webkitTextStrokeWidth && u.text.trim().length && (g.ctx.strokeStyle = wt(n.webkitTextStrokeColor), g.ctx.lineWidth = n.webkitTextStrokeWidth, g.ctx.lineJoin = window.chrome ? "miter" : "round", g.ctx.strokeText(u.text, u.bounds.left, u.bounds.top + d)), g.ctx.strokeStyle = "", g.ctx.lineWidth = 0, g.ctx.lineJoin = "miter";
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
        var o = _c(t), l = Ec(n);
        this.path(l), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, o.left, o.top, o.width, o.height), this.ctx.restore();
      }
    }, e.prototype.renderNodeContent = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n, i, o, l, f, c, H, H, d, w, B, g, _, v, u, M, C, F, U, H, O, _, M;
        return Ot(this, function(K) {
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
              return n instanceof $y && n.tree ? (d = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: n.backgroundColor,
                x: 0,
                y: 0,
                width: n.width,
                height: n.height
              }), [4, d.render(n.tree)]) : [3, 14];
            case 13:
              w = K.sent(), n.width && n.height && this.ctx.drawImage(w, 0, 0, n.width, n.height, n.bounds.left, n.bounds.top, n.bounds.width, n.bounds.height), K.label = 14;
            case 14:
              if (n instanceof tg && (B = Math.min(n.bounds.width, n.bounds.height), n.type === Cc ? n.checked && (this.ctx.save(), this.path([
                new TA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79),
                new TA(n.bounds.left + B * 0.16, n.bounds.top + B * 0.5549),
                new TA(n.bounds.left + B * 0.27347, n.bounds.top + B * 0.44071),
                new TA(n.bounds.left + B * 0.39694, n.bounds.top + B * 0.5649),
                new TA(n.bounds.left + B * 0.72983, n.bounds.top + B * 0.23),
                new TA(n.bounds.left + B * 0.84, n.bounds.top + B * 0.34085),
                new TA(n.bounds.left + B * 0.39363, n.bounds.top + B * 0.79)
              ]), this.ctx.fillStyle = wt(Gm), this.ctx.fill(), this.ctx.restore()) : n.type === Qc && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + B / 2, n.bounds.top + B / 2, B / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = wt(Gm), this.ctx.fill(), this.ctx.restore())), Rk(n) && n.value.length) {
                switch (g = this.createFontStyle(o), _ = g[0], v = g[1], u = this.fontMetrics.getMetrics(_, v).baseline, this.ctx.font = _, this.ctx.fillStyle = wt(o.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = $k(n.styles.textAlign), M = _c(n), C = 0, n.styles.textAlign) {
                  case 1:
                    C += M.width / 2;
                    break;
                  case 2:
                    C += M.width;
                    break;
                }
                F = M.add(C, 0, 0, -M.height / 2 + 1), this.ctx.save(), this.path([
                  new TA(M.left, M.top),
                  new TA(M.left + M.width, M.top),
                  new TA(M.left + M.width, M.top + M.height),
                  new TA(M.left, M.top + M.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new Es(n.value, F), o.letterSpacing, u), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
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
              t.listValue && n.styles.listStyleType !== -1 && (_ = this.createFontStyle(o)[0], this.ctx.font = _, this.ctx.fillStyle = wt(o.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", M = new Xr(n.bounds.left, n.bounds.top + Xe(n.styles.paddingTop, n.bounds.width), n.bounds.width, Em(o.lineHeight, o.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new Es(t.listValue, M), o.letterSpacing, Em(o.lineHeight, o.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), K.label = 20;
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
        var n, i, U, o, l, U, f, c, U, d, w, U, B, g, U, v, u, U, C, F, U;
        return Ot(this, function(H) {
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
              d = 0, w = t.nonPositionedInlineLevel, H.label = 15;
            case 15:
              return d < w.length ? (U = w[d], [4, this.renderStack(U)]) : [3, 18];
            case 16:
              H.sent(), H.label = 17;
            case 17:
              return d++, [3, 15];
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
        return Ot(this, function(d) {
          switch (d.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(w) {
                var B, g, v, gA, eA, fA, _A, W, cA, u, gA, eA, fA, _A, W, C, F, U, H, O, _, M, K, z, cA, sA, gA, FA, NA, _A, W, yA, eA, fA, EA, xA, iA, T, AA, J, L, R;
                return Ot(this, function(nA) {
                  switch (nA.label) {
                    case 0:
                      if (w.type !== 0) return [3, 5];
                      B = void 0, g = w.url, nA.label = 1;
                    case 1:
                      return nA.trys.push([1, 3, , 4]), [4, o.context.cache.match(g)];
                    case 2:
                      return B = nA.sent(), [3, 4];
                    case 3:
                      return nA.sent(), o.context.logger.error("Error loading background-image " + g), [3, 4];
                    case 4:
                      return B && (v = Gd(t, n, [
                        B.width,
                        B.height,
                        B.width / B.height
                      ]), gA = v[0], eA = v[1], fA = v[2], _A = v[3], W = v[4], cA = o.ctx.createPattern(o.resizeImage(B, _A, W), "repeat"), o.renderRepeat(gA, cA, eA, fA)), [3, 6];
                    case 5:
                      bP(w) ? (u = Gd(t, n, [null, null, null]), gA = u[0], eA = u[1], fA = u[2], _A = u[3], W = u[4], C = yP(w.angle, _A, W), F = C[0], U = C[1], H = C[2], O = C[3], _ = C[4], M = document.createElement("canvas"), M.width = _A, M.height = W, K = M.getContext("2d"), z = K.createLinearGradient(U, O, H, _), Um(w.stops, F).forEach(function(QA) {
                        return z.addColorStop(QA.stop, wt(QA.color));
                      }), K.fillStyle = z, K.fillRect(0, 0, _A, W), _A > 0 && W > 0 && (cA = o.ctx.createPattern(M, "repeat"), o.renderRepeat(gA, cA, eA, fA))) : EP(w) && (sA = Gd(t, n, [
                        null,
                        null,
                        null
                      ]), gA = sA[0], FA = sA[1], NA = sA[2], _A = sA[3], W = sA[4], yA = w.position.length === 0 ? [Yp] : w.position, eA = Xe(yA[0], _A), fA = Xe(yA[yA.length - 1], W), EA = CP(w, eA, fA, _A, W), xA = EA[0], iA = EA[1], xA > 0 && iA > 0 && (T = o.ctx.createRadialGradient(FA + eA, NA + fA, 0, FA + eA, NA + fA, xA), Um(w.stops, xA * 2).forEach(function(QA) {
                        return T.addColorStop(QA.stop, wt(QA.color));
                      }), o.path(gA), o.ctx.fillStyle = T, xA !== iA ? (AA = t.bounds.left + 0.5 * t.bounds.width, J = t.bounds.top + 0.5 * t.bounds.height, L = iA / xA, R = 1 / L, o.ctx.save(), o.ctx.translate(AA, J), o.ctx.transform(1, 0, 0, L, 0, 0), o.ctx.translate(-AA, -J), o.ctx.fillRect(FA, R * (NA - J) + J, _A, W * R), o.ctx.restore()) : o.ctx.fill())), nA.label = 6;
                    case 6:
                      return n--, [
                        2
                        /*return*/
                      ];
                  }
                });
              }, o = this, l = 0, f = t.styles.backgroundImage.slice(0).reverse(), d.label = 1;
            case 1:
              return l < f.length ? (c = f[l], [5, i(c)]) : [3, 4];
            case 2:
              d.sent(), d.label = 3;
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
        return Ot(this, function(o) {
          return this.path(tv(i, n)), this.ctx.fillStyle = wt(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, n, i, o) {
      return Gt(this, void 0, void 0, function() {
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
              return l = Ik(o, i), this.path(l), this.ctx.fillStyle = wt(t), this.ctx.fill(), f = Hk(o, i), this.path(f), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n, i, o, l, f, c, d, w, B = this;
        return Ot(this, function(g) {
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
              ], l = kk(Ja(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), Ui(n.backgroundColor) || (this.ctx.fillStyle = wt(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              g.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(v) {
                B.ctx.save();
                var u = bc(t.curves), C = v.inset ? 0 : Pk, F = _k(u, -C + (v.inset ? 1 : -1) * v.spread.number, (v.inset ? 1 : -1) * v.spread.number, v.spread.number * (v.inset ? -2 : 2), v.spread.number * (v.inset ? -2 : 2));
                v.inset ? (B.path(u), B.ctx.clip(), B.mask(F)) : (B.mask(u), B.ctx.clip(), B.path(F)), B.ctx.shadowOffsetX = v.offsetX.number + C, B.ctx.shadowOffsetY = v.offsetY.number, B.ctx.shadowColor = wt(v.color), B.ctx.shadowBlur = v.blur.number, B.ctx.fillStyle = v.inset ? wt(v.color) : "rgba(0,0,0,1)", B.ctx.fill(), B.ctx.restore();
              }), g.label = 2;
            case 2:
              f = 0, c = 0, d = o, g.label = 3;
            case 3:
              return c < d.length ? (w = d[c], w.style !== 0 && !Ui(w.color) && w.width > 0 ? w.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
                w.color,
                w.width,
                f,
                t.curves,
                2
                /* DASHED */
              )] : [3, 11]) : [3, 13];
            case 4:
              return g.sent(), [3, 11];
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
              return g.sent(), [3, 11];
            case 7:
              return w.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(w.color, w.width, f, t.curves)];
            case 8:
              return g.sent(), [3, 11];
            case 9:
              return [4, this.renderSolidBorder(w.color, f, t.curves)];
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
        var f, c, d, w, B, g, v, u, C, F, U, H, O, _, M, K, M, K;
        return Ot(this, function(z) {
          return this.ctx.save(), f = Sk(o, i), c = tv(o, i), l === 2 && (this.path(c), this.ctx.clip()), Cn(c[0]) ? (d = c[0].start.x, w = c[0].start.y) : (d = c[0].x, w = c[0].y), Cn(c[1]) ? (B = c[1].end.x, g = c[1].end.y) : (B = c[1].x, g = c[1].y), i === 0 || i === 2 ? v = Math.abs(d - B) : v = Math.abs(w - g), this.ctx.beginPath(), l === 3 ? this.formatPath(f) : this.formatPath(c.slice(0, 2)), u = n < 3 ? n * 3 : n * 2, C = n < 3 ? n * 2 : n, l === 3 && (u = n, C = n), F = !0, v <= u * 2 ? F = !1 : v <= u * 2 + C ? (U = v / (2 * u + C), u *= U, C *= U) : (H = Math.floor((v + C) / (u + C)), O = (v - H * u) / (H - 1), _ = (v - (H + 1) * u) / H, C = _ <= 0 || Math.abs(C - O) < Math.abs(C - _) ? O : _), F && (l === 3 ? this.ctx.setLineDash([0, u + C]) : this.ctx.setLineDash([u, C])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = wt(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (Cn(c[0]) && (M = c[3], K = c[0], this.ctx.beginPath(), this.formatPath([new TA(M.end.x, M.end.y), new TA(K.start.x, K.start.y)]), this.ctx.stroke()), Cn(c[1]) && (M = c[1], K = c[2], this.ctx.beginPath(), this.formatPath([new TA(M.end.x, M.end.y), new TA(K.start.x, K.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.render = function(t) {
      return Gt(this, void 0, void 0, function() {
        var n;
        return Ot(this, function(i) {
          switch (i.label) {
            case 0:
              return this.options.backgroundColor && (this.ctx.fillStyle = wt(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = xk(t), [4, this.renderStack(n)];
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
      return bc(e);
    case 2:
      return Qk(e);
    case 1:
    default:
      return Ec(e);
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
        return Ot(this, function(o) {
          switch (o.label) {
            case 0:
              return n = Th(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, Xk(n)];
            case 1:
              return i = o.sent(), this.options.backgroundColor && (this.ctx.fillStyle = wt(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
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
    var t, n, i, o, l, f, c, d, w, B, g, v, u, C, F, U, H, O, _, M, z, K, z, cA, sA, gA, FA, NA, _A, W, yA, eA, fA, EA, xA, iA, T, AA, J, L;
    return Ot(this, function(R) {
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
          }, o = mh({ logging: (FA = e.logging) !== null && FA !== void 0 ? FA : !0, cache: e.cache }, i), l = {
            windowWidth: (NA = e.windowWidth) !== null && NA !== void 0 ? NA : n.innerWidth,
            windowHeight: (_A = e.windowHeight) !== null && _A !== void 0 ? _A : n.innerHeight,
            scrollX: (W = e.scrollX) !== null && W !== void 0 ? W : n.pageXOffset,
            scrollY: (yA = e.scrollY) !== null && yA !== void 0 ? yA : n.pageYOffset
          }, f = new Xr(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), c = new zk(o, f), d = (eA = e.foreignObjectRendering) !== null && eA !== void 0 ? eA : !1, w = {
            allowTaint: (fA = e.allowTaint) !== null && fA !== void 0 ? fA : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: d,
            copyStyles: d
          }, c.logger.debug("Starting document clone with size " + f.width + "x" + f.height + " scrolled to " + -f.left + "," + -f.top), B = new Zm(c, A, w), g = B.clonedReferenceElement, g ? [4, B.toIFrame(t, f)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return v = R.sent(), u = ng(g) || YR(g) ? _N(g.ownerDocument) : Rc(c, g), C = u.width, F = u.height, U = u.left, H = u.top, O = Yk(c, g, e.backgroundColor), _ = {
            canvas: e.canvas,
            backgroundColor: O,
            scale: (xA = (EA = e.scale) !== null && EA !== void 0 ? EA : n.devicePixelRatio) !== null && xA !== void 0 ? xA : 1,
            x: ((iA = e.x) !== null && iA !== void 0 ? iA : 0) + U,
            y: ((T = e.y) !== null && T !== void 0 ? T : 0) + H,
            width: (AA = e.width) !== null && AA !== void 0 ? AA : Math.ceil(C),
            height: (J = e.height) !== null && J !== void 0 ? J : Math.ceil(F)
          }, d ? (c.logger.debug("Document cloned, using foreign object rendering"), z = new Wk(c, _), [4, z.render(g)]) : [3, 3];
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
    return xe.pull(t, i), n;
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
  }, t = xe.merge({}, e, A), n, i, o, l, f, c, d, w, B, g, v, u, C, F, U, H, O = !1, _ = {}, M = function() {
    if (O) {
      var aA = oe(n).height();
      t.height = aA - 80, t.width = "100%";
    }
  }, K = function() {
    O ? (t.height = _.height, t.width = _.width, VA(n).classed("fullscreen", !1), O = !1) : (_.height = t.height, _.width = t.width, VA(n).classed("fullscreen", !0), O = !0), M(), yA(), sA(), zA();
  }, z = function() {
    var aA = { width: t.width, height: t.height };
    if (aA.width.toString().indexOf("%") >= 0 || aA.height.toString().indexOf("%") >= 0) {
      var wA = VA(n).select("svg").node().getBoundingClientRect();
      aA.width.toString().indexOf("%") >= 0 && (aA.width = wA.width), aA.height.toString().indexOf("%") >= 0 && (aA.height = wA.height);
    }
    return aA;
  }, cA = function() {
    const aA = qi(i.node()), wA = aA.k, bA = [aA.x, aA.y];
    return bA[0] !== 0 || bA[1] !== 0 || wA !== 1;
  }, sA = function() {
    const aA = qi(i.node()), wA = aA.k, bA = [aA.x, aA.y];
    wA === 1 && xe.isEqual(bA, [0, 0]) || (c.translate([0, 0]), c.scale(1), o.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    ), u.setFitButtonEnabled(cA()), UA(), zA());
  }, gA = function() {
    o.select(".drawing_outline").attr("width", B.drawing.width).attr("height", B.drawing.height);
  }, FA = function() {
    var aA = B.drawing, wA = B.margin;
    o.select(".drawing_margin").attr("x", wA.left).attr("y", wA.top).attr("width", aA.width - wA.left - wA.right).attr("height", aA.height - wA.top - wA.bottom);
  }, NA = function() {
    o.attr("transform", "translate(0,0)scale(1)"), o.attr(
      "transform",
      "translate(" + c.translate() + ")scale(" + c.scale() + ")"
    );
  }, _A = async function() {
    const aA = document.querySelector(".mapview-wrapper");
    Jk(aA).then((wA) => {
      const bA = wA.toDataURL("image/png"), jA = document.createElement("a");
      jA.href = bA, jA.download = "capture.png", jA.click();
    }).catch((wA) => {
      console.error("Error capturing the element:", wA);
    });
  };
  d = function() {
    var aA = qi(this), wA = [aA.x, aA.y], bA = aA.k;
    if (B) {
      var jA = i.node().getBoundingClientRect(), ge = -B.drawing.width * bA + jA.width * (1 - t.extraPanArea) + B.drawing.margin.right * bA, fe = jA.width * t.extraPanArea - B.drawing.margin.left * bA;
      wA[0] = xe.clamp(wA[0], ge, fe);
      var lt = -B.drawing.height * bA + jA.height * (1 - t.extraPanArea) + B.drawing.margin.bottom * bA, ke = jA.height * t.extraPanArea - B.drawing.margin.top * bA;
      wA[1] = xe.clamp(wA[1], lt, ke);
    }
    (aA.x !== wA[0] || aA.y !== wA[1]) && c.translateBy(
      i,
      wA[0] - aA.x,
      wA[1] - aA.y
    ), bA !== w && (UA(), zA(), w = bA), u.setFitButtonEnabled(cA()), o.attr(
      "transform",
      "translate(" + wA[0] + "," + wA[1] + ")scale(" + bA + ")"
    ), yA(), l.text(
      "translate: [ " + wA[0].toFixed(1) + "," + wA[1].toFixed(1) + "]  zoom:" + bA.toFixed(2)
    );
  };
  var W = function(aA) {
    aA.preventDefault();
  }, yA = function() {
    oe(".gene-annotation-popover").remove();
  }, eA = function() {
    var aA = function(bA) {
      bA.target !== "undefined" && bA.target.tagName.toLowerCase() === "a" || oe(bA.target).closest(".genemap-advanced-menu").length > 0 || oe(bA.target).closest(".color-picker-modal").length > 0 || yA();
    }, wA = "mousedown mousewheel DOMMouseScroll touchstart ";
    oe(n).off(wA).on(wA, aA), oe("body").on("click", function(bA) {
      oe(bA.target).closest(n).length < 1 && O == !0 && K();
    });
  }, fA = function(aA) {
    aA == "auto" ? (C = !0, F = !0, B.chromosomes.forEach(function(wA) {
      wA.annotations.genes.forEach(function(bA) {
        bA.selected == !0 && (bA.visible = !0);
      });
    })) : aA == "show" ? (C = !1, F = !0) : aA == "hide" && (C = !1, F = !1), B.chromosomes.forEach(function(wA) {
      wA.annotations.genes.forEach(function(bA) {
        aA === "auto" ? delete bA.showLabel : bA.showLabel = aA;
      });
    }), UA(), zA();
  }, EA = function() {
    var aA = B.chromosomes.some(function(wA) {
      return wA.annotations.genes.some(function(bA) {
        return bA.selected;
      });
    });
    SA.onAnonationLabelSelectFunction && SA.onAnonationLabelSelectFunction(SA.getSelectedGenes()), UA(), zA(), VA(".network-btn").classed("disabled", !aA);
  }, xA = function(aA) {
    v ? (B = g, v = !1) : (B = { chromosomes: [aA] }, v = !0), SA.onAnonationLabelSelectFunction(SA.getSelectedGenes()), sA(), UA(), zA();
  }, iA = function() {
    xe.flatMap(
      B.chromosomes.map(function(aA) {
        return aA.annotations.genes.filter(function(wA) {
          return wA.selected;
        }).map(function(wA) {
          var bA = wA.link, jA = bA.substring(bA.indexOf("list="), bA.length).split("=")[1];
          return (
            /*gene.label*/
            decodeURIComponent(
              jA.replace(/\+/g, " ")
            )
          );
        });
      })
    ), t.apiUrl + "";
  }, T = function() {
    var aA = u.getTagButtonState(), wA;
    aA === "auto" ? wA = "show" : aA === "show" ? wA = "hide" : wA = "auto", u.setTabButtonState(wA), fA(wA), zA();
  }, AA = function() {
    B.chromosomes.forEach(function(aA) {
      aA.annotations.allGenes.forEach(function(wA) {
        wA.selected = !1, wA.visible = !1, wA.hidden = !1;
      });
    }), UA(), zA();
  }, J = function(aA) {
    t.layout.numberPerRow = aA, nA(), UA(), zA();
  }, L = function(aA) {
    aA == "all" ? (U = !0, H = !0) : aA == "selected" ? (U = !1, H = "true") : (U = !1, H = !1), QA(), UA(), zA();
  }, R = function() {
    const wA = qi(i.node()).k;
    var bA = dS(t.layout).width(z().width).height(z().height).scale(wA);
    B = bA.decorateGenome(B);
  }, nA = function() {
    B.chromosomes.forEach(function(aA) {
      aA.layout = aA.layout || {}, aA.layout.annotationDisplayClusters = null, aA.layout.geneBandDisplayClusters = null;
    });
  }, QA = function() {
    B.chromosomes.forEach(function(aA) {
      aA.layout = aA.layout || {}, aA.layout.qtlDisplayClusters = null;
    });
  }, UA = function() {
    const wA = qi(i.node()).k;
    R();
    var bA = yN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: B.cellLayout.annotations.marker.size,
      annotationLabelSize: B.cellLayout.annotations.label.size,
      scale: wA,
      autoLabels: C,
      manualLabels: F,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), jA = CN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: wA,
      nGenesToDisplay: t.nGenesToDisplay
    }), ge = EN({
      longestChromosome: B.cellLayout.longestChromosome,
      layout: B.cellLayout.qtlAnnotationPosition,
      scale: wA,
      showAllQTLs: U,
      showSelectedQTLs: H,
      showAutoQTLLabels: U,
      showSelectedQTLLabels: H,
      annotationLabelSize: B.cellLayout.annotations.label.size
    });
    B.chromosomes.forEach(function(fe) {
      fe.layout = fe.layout || {}, fe.layout.annotationDisplayClusters || bA.computeChromosomeClusters(fe), bA.layoutChromosome(fe), fe.layout.geneBandDisplayClusters || jA.computeChromosomeClusters(fe), jA.layoutChromosome(fe), fe.layout.qtlDisplayClusters || ge.computeChromosomeClusters(fe), ge.layoutChromosome(fe);
    }), bA.computeNormalisedGeneScores(B.chromosomes);
  }, qA = function(aA, wA) {
    var bA = /* @__PURE__ */ new Set(), jA = [];
    function ge(Be, Le) {
      Be != null && Be !== "" && !bA.has(Be) && (bA.add(Be), jA.push({ trait: Be, color: Le || "#333" }));
    }
    var fe = wA && wA.chromosomes || [];
    typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] updateLegend: genome.chromosomes.length =", fe.length), fe.forEach(function(Be, Le) {
      var ne = Be.annotations || {};
      typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] updateLegend: chr", Le, "number=" + Be.number, {
        snps: (ne.snps || []).length,
        qtls: (ne.qtls || []).length,
        genes: (ne.genes || []).length,
        allGenes: (ne.allGenes || []).length,
        sampleTrait: ne.snps && ne.snps[0] && ne.snps[0].trait || ne.genes && ne.genes[0] && ne.genes[0].trait
      }), (ne.snps || []).forEach(function(Ve) {
        ge(Ve.trait, Ve.color);
      }), (ne.qtls || []).forEach(function(Ve) {
        ge(Ve.trait || Ve.label, Ve.color);
      }), (ne.genes || ne.allGenes || []).forEach(function(Ve) {
        Ve.trait && ge(Ve.trait, Ve.color);
      });
    }), typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] updateLegend: traitColors =", jA, "keyTarget.empty =", aA.empty && aA.empty()), jA.length > 0 ? aA.text("Study Legend: ") : aA.text("");
    var lt = aA.selectAll("span.key-item").data(jA);
    lt.exit().remove();
    var ke = lt.enter().append("span").classed("key-item", !0);
    ke.append("span").style("background-color", function(Be) {
      return Be.color;
    }).style("display", "inline-block").style("width", "12px").style("height", "12px").style("margin", "0 6px 0 0").style("vertical-align", "middle").classed("colorbox", !0).append("svg"), ke.append("span").text(function(Be) {
      return Be.trait;
    }).style("margin-right", "12px").style("vertical-align", "middle");
  }, te = function(aA) {
    var wA = aA.append("div").attr("class", "mapview-wrapper"), bA = wA.append("svg").attr("width", t.width).attr("height", t.height).attr("class", "mapview").attr("flex", t.flex);
    l = aA.append("div").append("span").attr("class", "logger").attr("id", "logbar"), f = aA.append("div").attr("class", "key").attr("id", "keybar").attr("data-genomaps", "legend").style("min-height", "20px").style("flex-shrink", "0").style("display", "block").style("visibility", "visible").style("overflow", "visible").style("padding", "8px 12px").style("background", "#f5f5f5").style("border-top", "1px solid #e0e0e0").style("font-size", "13px").style("line-height", "1.4"), wi.vectorEffectSupport = "vectorEffect" in bA.node().style, eA(), bA.on("contextmenu", W), bA.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && aA.select(".zoom_window").append("rect").classed("drawing_margin", !0), w = 1, c = EO().scaleExtent([0.5, 60]), c.on("start", function() {
      bA.classed("dragging", !0);
    }).on("zoom", d).on("end", function() {
      bA.classed("dragging", !1);
    }), aA.select("svg").call(c);
    var jA = aA.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return jA.append("div").attr("class", "arrow"), jA.append("h3").attr("class", "popover-title").text("Cluster"), jA.append("div").attr("class", "popover-content"), bA;
  }, zA = function() {
    VA(n).select("svg").node() ? (i = VA(n).select("svg"), i.attr("width", t.width).attr("height", t.height)) : i = te(VA(n)), R();
    var aA = B.chromosomes.every(function(bA) {
      return bA.layout;
    });
    aA || UA(), i.datum(B), o = i.select(".zoom_window"), gA(), t.contentBorder && FA();
    var wA = pN().onAnnotationSelectFunction(EA).onLabelSelectFunction(xA).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(i);
    o.call(wA);
  };
  function SA(aA) {
    aA.each(function(wA) {
      var bA = this;
      n = bA, g = wA, B = g, v = !1, u || (u = QN().onTagBtnClick(T).onFitBtnClick(sA).onLabelBtnClick(fA).onQtlBtnClick(L).onNetworkBtnClick(iA).onResetBtnClick(AA).onSetNumberPerRowClick(J).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(_A).onExportAllBtnClick(NA).onExpandBtnClick(K).maxSnpPValueProperty(SA.maxSnpPValue).nGenesToDisplayProperty(SA.nGenesToDisplay).annotationLabelSizeProperty(SA.annotationLabelSize)), VA(n).call(u), u.setNetworkButtonEnabled(!1), u.setFitButtonEnabled(!1), u.setTabButtonState("auto"), zA();
    });
  }
  return SA.resetZoom = sA, SA.getZoom = function() {
    return !i || !i.node() ? 1 : qi(i.node()).k;
  }, SA.setZoom = function(aA) {
    return !i || !i.node() || (aA = xe.clamp(aA, 0.5, 60), c.scaleTo(i, aA)), SA;
  }, SA.zoomIn = function(aA) {
    return !i || !i.node() || (aA = aA || 1.5, c.scaleBy(i, aA)), SA;
  }, SA.zoomOut = function(aA) {
    return !i || !i.node() || (aA = aA || 1 / 1.5, c.scaleBy(i, aA)), SA;
  }, SA.width = function(aA) {
    return arguments.length ? (t.width = aA, SA) : t.width;
  }, SA.height = function(aA) {
    return arguments.length ? (t.height = aA, SA) : t.height;
  }, SA.layout = function(aA) {
    return arguments.length ? (t.layout = xe.merge(t.layout, aA), SA) : t.layout;
  }, SA.draw = async function(aA, wA, bA, jA = !1) {
    var ge = cS(), fe;
    bA ? (fe = await ge.readData(wA, bA, jA), SA._draw(aA, fe)) : (fe = await ge.readData(wA, bA, jA), SA._draw(aA, fe));
  }, SA._draw = function(aA, wA) {
    var bA = VA(aA), jA = bA.select(".genomaps-container");
    jA.empty() && (jA = bA.append("div").attr("class", "genomaps-container").style("height", "100%").style("width", "100%"));
    var ge = jA.selectAll("div.genomaps-inner").data(["genemap-target"]);
    ge.enter().append("div").attr("class", "genomaps-inner").attr("id", "genemap-target"), n = bA.select("#genemap-target").node(), VA(n).datum(wA).call(SA), SA.nGenesToDisplay(t.initialMaxGenes), sA();
    var fe = VA(n).select("#keybar");
    typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.log("[genomaps] _draw: target =", n, "keybar.empty =", fe.empty && fe.empty(), "legendSpan.empty =", f && f.empty && f.empty()), fe.empty() ? f && !f.empty() ? qA(f, B) : typeof window < "u" && window.__GENOMAPS_DEBUG__ && console.warn("[genomaps] _draw: no #keybar or legendSpan found, legend not updated") : qA(fe, B);
  }, SA.changeQtlColor = function(aA, wA, bA) {
    B.chromosomes.forEach(function(jA) {
      jA.layout.qtlNodes.forEach(function(ge) {
        ge.id === aA && (ge.color = wA, ge.label = bA);
      });
    }), UA(), zA();
  }, SA.changeColor = function(aA) {
    VA("#map").style("background-color", aA), UA(), zA();
  }, SA.redraw = function(aA) {
    n = VA(aA).select("#genemap-target")[0][0], M(), VA(n).call(SA), yA();
  }, SA.forceLayout = function() {
    return !B || !i || !i.node() || (nA(), QA(), UA(), zA()), SA;
  }, SA.setGeneLabels = function(aA) {
    n && fA(aA);
  }, SA.maxSnpPValue = wi.Listener(t.maxSnpPValue).addListener(
    function(aA) {
      var wA = Number(aA);
      isNaN(wA) && SA.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(aA), UA(), zA();
    }
  ), SA.nGenesToDisplay = wi.Listener(t.nGenesToDisplay).addListener(
    function(aA) {
      var wA = t.nGenesToDisplay;
      t.nGenesToDisplay = aA, aA != wA && (nA(), UA(), zA());
    }
  ), SA.annotationLabelSize = wi.Listener(
    t.annotationLabelSize
  ).addListener(function(aA) {
    t.annotationLabelSize = aA, nA(), UA(), zA();
  }), SA.setQtlLabels = function(aA) {
    if (n) {
      var wA = VA(n).datum();
      wA.chromosomes.forEach(function(bA) {
        bA.annotations.qtls.forEach(function(jA) {
          aA === "auto" ? delete jA.showLabel : jA.showLabel = aA;
        });
      });
    }
  }, SA.onAnonationLabelSelectFunction = function() {
  }, SA.loggingOn = function() {
    l.style("display", "initial");
  }, SA.loggingOff = function() {
    l.style("display", "none");
  }, SA.getSelectedGenes = function() {
    var aA = [];
    return B.chromosomes.forEach(function(wA) {
      wA.annotations.genes.forEach(function(bA) {
        bA.selected && aA.push(bA);
      });
    }), aA;
  }, SA.getGenome = function() {
    return B;
  }, SA;
};
const oa = wi.GeneMap().width("100%").height("100%");
function Zk() {
  const A = document.getElementById("show-gene-labels"), e = A.options[A.selectedIndex].value;
  oa.setGeneLabels(e);
  const t = document.getElementById("show-qtl-labels"), n = t.options[t.selectedIndex].value;
  oa.setQtlLabels(n), oa.redraw("#map");
}
function A$() {
  oa.changeQtlColor("C6", "#000");
}
async function e$(A) {
  const e = document.getElementById("basemap-file");
  if (!e) return;
  const t = e.options[e.selectedIndex].value, n = "./src/test/data/basemap/" + t + ".json", i = document.getElementById("chromosome_per_row");
  if (i) {
    const c = +i.value;
    oa.layout().numberPerRow = c;
  }
  A && oa.resetZoom();
  const o = document.getElementById("show-qtl-labels");
  o && (o.options[2].selected = !0);
  let l = null;
  const f = document.getElementById("chk-annotations");
  f && f.checked && (l = "./src/test/data/annotations/" + t + ".json"), await oa.draw("#map", n, l, !1);
}
export {
  A$ as changeQtlColor,
  oa as chart,
  e$ as redraw,
  Zk as updateLabel
};
