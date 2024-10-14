import './chart.css';var Va = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Rh(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var Gd = { exports: {} }, rv = {}, zn = {}, io = {}, Ps = {}, we = {}, Is = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.regexpCode = A.getEsmExportName = A.getProperty = A.safeStringify = A.stringify = A.strConcat = A.addCodeArg = A.str = A._ = A.nil = A._Code = A.Name = A.IDENTIFIER = A._CodeOrName = void 0;
  class e {
  }
  A._CodeOrName = e, A.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class t extends e {
    constructor(D) {
      if (super(), !A.IDENTIFIER.test(D))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = D;
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
    constructor(D) {
      super(), this._items = typeof D == "string" ? [D] : D;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const D = this._items[0];
      return D === "" || D === '""';
    }
    get str() {
      var D;
      return (D = this._str) !== null && D !== void 0 ? D : this._str = this._items.reduce((R, x) => `${R}${x}`, "");
    }
    get names() {
      var D;
      return (D = this._names) !== null && D !== void 0 ? D : this._names = this._items.reduce((R, x) => (x instanceof t && (R[x.str] = (R[x.str] || 0) + 1), R), {});
    }
  }
  A._Code = n, A.nil = new n("");
  function i(E, ...D) {
    const R = [E[0]];
    let x = 0;
    for (; x < D.length; )
      c(R, D[x]), R.push(E[++x]);
    return new n(R);
  }
  A._ = i;
  const s = new n("+");
  function l(E, ...D) {
    const R = [Q(E[0])];
    let x = 0;
    for (; x < D.length; )
      R.push(s), c(R, D[x]), R.push(s, Q(E[++x]));
    return f(R), new n(R);
  }
  A.str = l;
  function c(E, D) {
    D instanceof n ? E.push(...D._items) : D instanceof t ? E.push(D) : E.push(w(D));
  }
  A.addCodeArg = c;
  function f(E) {
    let D = 1;
    for (; D < E.length - 1; ) {
      if (E[D] === s) {
        const R = p(E[D - 1], E[D + 1]);
        if (R !== void 0) {
          E.splice(D - 1, 3, R);
          continue;
        }
        E[D++] = "+";
      }
      D++;
    }
  }
  function p(E, D) {
    if (D === '""')
      return E;
    if (E === '""')
      return D;
    if (typeof E == "string")
      return D instanceof t || E[E.length - 1] !== '"' ? void 0 : typeof D != "string" ? `${E.slice(0, -1)}${D}"` : D[0] === '"' ? E.slice(0, -1) + D.slice(1) : void 0;
    if (typeof D == "string" && D[0] === '"' && !(E instanceof t))
      return `"${E}${D.slice(1)}`;
  }
  function B(E, D) {
    return D.emptyStr() ? E : E.emptyStr() ? D : l`${E}${D}`;
  }
  A.strConcat = B;
  function w(E) {
    return typeof E == "number" || typeof E == "boolean" || E === null ? E : Q(Array.isArray(E) ? E.join(",") : E);
  }
  function v(E) {
    return new n(Q(E));
  }
  A.stringify = v;
  function Q(E) {
    return JSON.stringify(E).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  A.safeStringify = Q;
  function u(E) {
    return typeof E == "string" && A.IDENTIFIER.test(E) ? new n(`.${E}`) : i`[${E}]`;
  }
  A.getProperty = u;
  function U(E) {
    if (typeof E == "string" && A.IDENTIFIER.test(E))
      return new n(`${E}`);
    throw new Error(`CodeGen: invalid export name: ${E}, use explicit $id name mapping`);
  }
  A.getEsmExportName = U;
  function b(E) {
    return new n(E.toString());
  }
  A.regexpCode = b;
})(Is);
var Vd = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.ValueScope = A.ValueScopeName = A.Scope = A.varKinds = A.UsedValueState = void 0;
  const e = Is;
  class t extends Error {
    constructor(p) {
      super(`CodeGen: "code" for ${p} not defined`), this.value = p.value;
    }
  }
  var n;
  (function(f) {
    f[f.Started = 0] = "Started", f[f.Completed = 1] = "Completed";
  })(n || (A.UsedValueState = n = {})), A.varKinds = {
    const: new e.Name("const"),
    let: new e.Name("let"),
    var: new e.Name("var")
  };
  class i {
    constructor({ prefixes: p, parent: B } = {}) {
      this._names = {}, this._prefixes = p, this._parent = B;
    }
    toName(p) {
      return p instanceof e.Name ? p : this.name(p);
    }
    name(p) {
      return new e.Name(this._newName(p));
    }
    _newName(p) {
      const B = this._names[p] || this._nameGroup(p);
      return `${p}${B.index++}`;
    }
    _nameGroup(p) {
      var B, w;
      if (!((w = (B = this._parent) === null || B === void 0 ? void 0 : B._prefixes) === null || w === void 0) && w.has(p) || this._prefixes && !this._prefixes.has(p))
        throw new Error(`CodeGen: prefix "${p}" is not allowed in this scope`);
      return this._names[p] = { prefix: p, index: 0 };
    }
  }
  A.Scope = i;
  class s extends e.Name {
    constructor(p, B) {
      super(B), this.prefix = p;
    }
    setValue(p, { property: B, itemIndex: w }) {
      this.value = p, this.scopePath = (0, e._)`.${new e.Name(B)}[${w}]`;
    }
  }
  A.ValueScopeName = s;
  const l = (0, e._)`\n`;
  class c extends i {
    constructor(p) {
      super(p), this._values = {}, this._scope = p.scope, this.opts = { ...p, _n: p.lines ? l : e.nil };
    }
    get() {
      return this._scope;
    }
    name(p) {
      return new s(p, this._newName(p));
    }
    value(p, B) {
      var w;
      if (B.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const v = this.toName(p), { prefix: Q } = v, u = (w = B.key) !== null && w !== void 0 ? w : B.ref;
      let U = this._values[Q];
      if (U) {
        const D = U.get(u);
        if (D)
          return D;
      } else
        U = this._values[Q] = /* @__PURE__ */ new Map();
      U.set(u, v);
      const b = this._scope[Q] || (this._scope[Q] = []), E = b.length;
      return b[E] = B.ref, v.setValue(B, { property: Q, itemIndex: E }), v;
    }
    getValue(p, B) {
      const w = this._values[p];
      if (w)
        return w.get(B);
    }
    scopeRefs(p, B = this._values) {
      return this._reduceValues(B, (w) => {
        if (w.scopePath === void 0)
          throw new Error(`CodeGen: name "${w}" has no value`);
        return (0, e._)`${p}${w.scopePath}`;
      });
    }
    scopeCode(p = this._values, B, w) {
      return this._reduceValues(p, (v) => {
        if (v.value === void 0)
          throw new Error(`CodeGen: name "${v}" has no value`);
        return v.value.code;
      }, B, w);
    }
    _reduceValues(p, B, w = {}, v) {
      let Q = e.nil;
      for (const u in p) {
        const U = p[u];
        if (!U)
          continue;
        const b = w[u] = w[u] || /* @__PURE__ */ new Map();
        U.forEach((E) => {
          if (b.has(E))
            return;
          b.set(E, n.Started);
          let D = B(E);
          if (D) {
            const R = this.opts.es5 ? A.varKinds.var : A.varKinds.const;
            Q = (0, e._)`${Q}${R} ${E} = ${D};${this.opts._n}`;
          } else if (D = v == null ? void 0 : v(E))
            Q = (0, e._)`${Q}${D}${this.opts._n}`;
          else
            throw new t(E);
          b.set(E, n.Completed);
        });
      }
      return Q;
    }
  }
  A.ValueScope = c;
})(Vd);
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.or = A.and = A.not = A.CodeGen = A.operators = A.varKinds = A.ValueScopeName = A.ValueScope = A.Scope = A.Name = A.regexpCode = A.stringify = A.getProperty = A.nil = A.strConcat = A.str = A._ = void 0;
  const e = Is, t = Vd;
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
  var i = Vd;
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
    optimizeNames(L, $) {
      return this;
    }
  }
  class l extends s {
    constructor(L, $, rA) {
      super(), this.varKind = L, this.name = $, this.rhs = rA;
    }
    render({ es5: L, _n: $ }) {
      const rA = L ? t.varKinds.var : this.varKind, FA = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${rA} ${this.name}${FA};` + $;
    }
    optimizeNames(L, $) {
      if (L[this.name.str])
        return this.rhs && (this.rhs = X(this.rhs, L, $)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends s {
    constructor(L, $, rA) {
      super(), this.lhs = L, this.rhs = $, this.sideEffects = rA;
    }
    render({ _n: L }) {
      return `${this.lhs} = ${this.rhs};` + L;
    }
    optimizeNames(L, $) {
      if (!(this.lhs instanceof e.Name && !L[this.lhs.str] && !this.sideEffects))
        return this.rhs = X(this.rhs, L, $), this;
    }
    get names() {
      const L = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return xA(L, this.rhs);
    }
  }
  class f extends c {
    constructor(L, $, rA, FA) {
      super(L, rA, FA), this.op = $;
    }
    render({ _n: L }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + L;
    }
  }
  class p extends s {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `${this.label}:` + L;
    }
  }
  class B extends s {
    constructor(L) {
      super(), this.label = L, this.names = {};
    }
    render({ _n: L }) {
      return `break${this.label ? ` ${this.label}` : ""};` + L;
    }
  }
  class w extends s {
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
  class v extends s {
    constructor(L) {
      super(), this.code = L;
    }
    render({ _n: L }) {
      return `${this.code};` + L;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(L, $) {
      return this.code = X(this.code, L, $), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class Q extends s {
    constructor(L = []) {
      super(), this.nodes = L;
    }
    render(L) {
      return this.nodes.reduce(($, rA) => $ + rA.render(L), "");
    }
    optimizeNodes() {
      const { nodes: L } = this;
      let $ = L.length;
      for (; $--; ) {
        const rA = L[$].optimizeNodes();
        Array.isArray(rA) ? L.splice($, 1, ...rA) : rA ? L[$] = rA : L.splice($, 1);
      }
      return L.length > 0 ? this : void 0;
    }
    optimizeNames(L, $) {
      const { nodes: rA } = this;
      let FA = rA.length;
      for (; FA--; ) {
        const UA = rA[FA];
        UA.optimizeNames(L, $) || (CA(L, UA.names), rA.splice(FA, 1));
      }
      return rA.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((L, $) => NA(L, $.names), {});
    }
  }
  class u extends Q {
    render(L) {
      return "{" + L._n + super.render(L) + "}" + L._n;
    }
  }
  class U extends Q {
  }
  class b extends u {
  }
  b.kind = "else";
  class E extends u {
    constructor(L, $) {
      super($), this.condition = L;
    }
    render(L) {
      let $ = `if(${this.condition})` + super.render(L);
      return this.else && ($ += "else " + this.else.render(L)), $;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const L = this.condition;
      if (L === !0)
        return this.nodes;
      let $ = this.else;
      if ($) {
        const rA = $.optimizeNodes();
        $ = this.else = Array.isArray(rA) ? new b(rA) : rA;
      }
      if ($)
        return L === !1 ? $ instanceof E ? $ : $.nodes : this.nodes.length ? this : new E(tA(L), $ instanceof E ? [$] : $.nodes);
      if (!(L === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(L, $) {
      var rA;
      if (this.else = (rA = this.else) === null || rA === void 0 ? void 0 : rA.optimizeNames(L, $), !!(super.optimizeNames(L, $) || this.else))
        return this.condition = X(this.condition, L, $), this;
    }
    get names() {
      const L = super.names;
      return xA(L, this.condition), this.else && NA(L, this.else.names), L;
    }
  }
  E.kind = "if";
  class D extends u {
  }
  D.kind = "for";
  class R extends D {
    constructor(L) {
      super(), this.iteration = L;
    }
    render(L) {
      return `for(${this.iteration})` + super.render(L);
    }
    optimizeNames(L, $) {
      if (super.optimizeNames(L, $))
        return this.iteration = X(this.iteration, L, $), this;
    }
    get names() {
      return NA(super.names, this.iteration.names);
    }
  }
  class x extends D {
    constructor(L, $, rA, FA) {
      super(), this.varKind = L, this.name = $, this.from = rA, this.to = FA;
    }
    render(L) {
      const $ = L.es5 ? t.varKinds.var : this.varKind, { name: rA, from: FA, to: UA } = this;
      return `for(${$} ${rA}=${FA}; ${rA}<${UA}; ${rA}++)` + super.render(L);
    }
    get names() {
      const L = xA(super.names, this.from);
      return xA(L, this.to);
    }
  }
  class K extends D {
    constructor(L, $, rA, FA) {
      super(), this.loop = L, this.varKind = $, this.name = rA, this.iterable = FA;
    }
    render(L) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(L);
    }
    optimizeNames(L, $) {
      if (super.optimizeNames(L, $))
        return this.iterable = X(this.iterable, L, $), this;
    }
    get names() {
      return NA(super.names, this.iterable.names);
    }
  }
  class k extends u {
    constructor(L, $, rA) {
      super(), this.name = L, this.args = $, this.async = rA;
    }
    render(L) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(L);
    }
  }
  k.kind = "func";
  class Y extends Q {
    render(L) {
      return "return " + super.render(L);
    }
  }
  Y.kind = "return";
  class dA extends u {
    render(L) {
      let $ = "try" + super.render(L);
      return this.catch && ($ += this.catch.render(L)), this.finally && ($ += this.finally.render(L)), $;
    }
    optimizeNodes() {
      var L, $;
      return super.optimizeNodes(), (L = this.catch) === null || L === void 0 || L.optimizeNodes(), ($ = this.finally) === null || $ === void 0 || $.optimizeNodes(), this;
    }
    optimizeNames(L, $) {
      var rA, FA;
      return super.optimizeNames(L, $), (rA = this.catch) === null || rA === void 0 || rA.optimizeNames(L, $), (FA = this.finally) === null || FA === void 0 || FA.optimizeNames(L, $), this;
    }
    get names() {
      const L = super.names;
      return this.catch && NA(L, this.catch.names), this.finally && NA(L, this.finally.names), L;
    }
  }
  class cA extends u {
    constructor(L) {
      super(), this.error = L;
    }
    render(L) {
      return `catch(${this.error})` + super.render(L);
    }
  }
  cA.kind = "catch";
  class wA extends u {
    render(L) {
      return "finally" + super.render(L);
    }
  }
  wA.kind = "finally";
  class EA {
    constructor(L, $ = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...$, _n: $.lines ? `
` : "" }, this._extScope = L, this._scope = new t.Scope({ parent: L }), this._nodes = [new U()];
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
    scopeValue(L, $) {
      const rA = this._extScope.value(L, $);
      return (this._values[rA.prefix] || (this._values[rA.prefix] = /* @__PURE__ */ new Set())).add(rA), rA;
    }
    getScopeValue(L, $) {
      return this._extScope.getValue(L, $);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(L) {
      return this._extScope.scopeRefs(L, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(L, $, rA, FA) {
      const UA = this._scope.toName($);
      return rA !== void 0 && FA && (this._constants[UA.str] = rA), this._leafNode(new l(L, UA, rA)), UA;
    }
    // `const` declaration (`var` in es5 mode)
    const(L, $, rA) {
      return this._def(t.varKinds.const, L, $, rA);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(L, $, rA) {
      return this._def(t.varKinds.let, L, $, rA);
    }
    // `var` declaration with optional assignment
    var(L, $, rA) {
      return this._def(t.varKinds.var, L, $, rA);
    }
    // assignment code
    assign(L, $, rA) {
      return this._leafNode(new c(L, $, rA));
    }
    // `+=` code
    add(L, $) {
      return this._leafNode(new f(L, A.operators.ADD, $));
    }
    // appends passed SafeExpr to code or executes Block
    code(L) {
      return typeof L == "function" ? L() : L !== e.nil && this._leafNode(new v(L)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...L) {
      const $ = ["{"];
      for (const [rA, FA] of L)
        $.length > 1 && $.push(","), $.push(rA), (rA !== FA || this.opts.es5) && ($.push(":"), (0, e.addCodeArg)($, FA));
      return $.push("}"), new e._Code($);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(L, $, rA) {
      if (this._blockNode(new E(L)), $ && rA)
        this.code($).else().code(rA).endIf();
      else if ($)
        this.code($).endIf();
      else if (rA)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(L) {
      return this._elseNode(new E(L));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new b());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(E, b);
    }
    _for(L, $) {
      return this._blockNode(L), $ && this.code($).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(L, $) {
      return this._for(new R(L), $);
    }
    // `for` statement for a range of values
    forRange(L, $, rA, FA, UA = this.opts.es5 ? t.varKinds.var : t.varKinds.let) {
      const zA = this._scope.toName(L);
      return this._for(new x(UA, zA, $, rA), () => FA(zA));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(L, $, rA, FA = t.varKinds.const) {
      const UA = this._scope.toName(L);
      if (this.opts.es5) {
        const zA = $ instanceof e.Name ? $ : this.var("_arr", $);
        return this.forRange("_i", 0, (0, e._)`${zA}.length`, (ne) => {
          this.var(UA, (0, e._)`${zA}[${ne}]`), rA(UA);
        });
      }
      return this._for(new K("of", FA, UA, $), () => rA(UA));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(L, $, rA, FA = this.opts.es5 ? t.varKinds.var : t.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(L, (0, e._)`Object.keys(${$})`, rA);
      const UA = this._scope.toName(L);
      return this._for(new K("in", FA, UA, $), () => rA(UA));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(D);
    }
    // `label` statement
    label(L) {
      return this._leafNode(new p(L));
    }
    // `break` statement
    break(L) {
      return this._leafNode(new B(L));
    }
    // `return` statement
    return(L) {
      const $ = new Y();
      if (this._blockNode($), this.code(L), $.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Y);
    }
    // `try` statement
    try(L, $, rA) {
      if (!$ && !rA)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const FA = new dA();
      if (this._blockNode(FA), this.code(L), $) {
        const UA = this.name("e");
        this._currNode = FA.catch = new cA(UA), $(UA);
      }
      return rA && (this._currNode = FA.finally = new wA(), this.code(rA)), this._endBlockNode(cA, wA);
    }
    // `throw` statement
    throw(L) {
      return this._leafNode(new w(L));
    }
    // start self-balancing block
    block(L, $) {
      return this._blockStarts.push(this._nodes.length), L && this.code(L).endBlock($), this;
    }
    // end the current self-balancing block
    endBlock(L) {
      const $ = this._blockStarts.pop();
      if ($ === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const rA = this._nodes.length - $;
      if (rA < 0 || L !== void 0 && rA !== L)
        throw new Error(`CodeGen: wrong number of nodes: ${rA} vs ${L} expected`);
      return this._nodes.length = $, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(L, $ = e.nil, rA, FA) {
      return this._blockNode(new k(L, $, rA)), FA && this.code(FA).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(k);
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
    _endBlockNode(L, $) {
      const rA = this._currNode;
      if (rA instanceof L || $ && rA instanceof $)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${$ ? `${L.kind}/${$.kind}` : L.kind}"`);
    }
    _elseNode(L) {
      const $ = this._currNode;
      if (!($ instanceof E))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = $.else = L, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const L = this._nodes;
      return L[L.length - 1];
    }
    set _currNode(L) {
      const $ = this._nodes;
      $[$.length - 1] = L;
    }
  }
  A.CodeGen = EA;
  function NA(J, L) {
    for (const $ in L)
      J[$] = (J[$] || 0) + (L[$] || 0);
    return J;
  }
  function xA(J, L) {
    return L instanceof e._CodeOrName ? NA(J, L.names) : J;
  }
  function X(J, L, $) {
    if (J instanceof e.Name)
      return rA(J);
    if (!FA(J))
      return J;
    return new e._Code(J._items.reduce((UA, zA) => (zA instanceof e.Name && (zA = rA(zA)), zA instanceof e._Code ? UA.push(...zA._items) : UA.push(zA), UA), []));
    function rA(UA) {
      const zA = $[UA.str];
      return zA === void 0 || L[UA.str] !== 1 ? UA : (delete L[UA.str], zA);
    }
    function FA(UA) {
      return UA instanceof e._Code && UA._items.some((zA) => zA instanceof e.Name && L[zA.str] === 1 && $[zA.str] !== void 0);
    }
  }
  function CA(J, L) {
    for (const $ in L)
      J[$] = (J[$] || 0) - (L[$] || 0);
  }
  function tA(J) {
    return typeof J == "boolean" || typeof J == "number" || J === null ? !J : (0, e._)`!${eA(J)}`;
  }
  A.not = tA;
  const fA = T(A.operators.AND);
  function _A(...J) {
    return J.reduce(fA);
  }
  A.and = _A;
  const IA = T(A.operators.OR);
  function aA(...J) {
    return J.reduce(IA);
  }
  A.or = aA;
  function T(J) {
    return (L, $) => L === e.nil ? $ : $ === e.nil ? L : (0, e._)`${eA(L)} ${J} ${eA($)}`;
  }
  function eA(J) {
    return J instanceof e.Name ? J : (0, e._)`(${J})`;
  }
})(we);
var KA = {};
Object.defineProperty(KA, "__esModule", { value: !0 });
KA.checkStrictMode = KA.getErrorPath = KA.Type = KA.useFunc = KA.setEvaluated = KA.evaluatedPropsToName = KA.mergeEvaluated = KA.eachItem = KA.unescapeJsonPointer = KA.escapeJsonPointer = KA.escapeFragment = KA.unescapeFragment = KA.schemaRefOrVal = KA.schemaHasRulesButRef = KA.schemaHasRules = KA.checkUnknownRules = KA.alwaysValidSchema = KA.toHash = void 0;
const Ve = we, e1 = Is;
function t1(A) {
  const e = {};
  for (const t of A)
    e[t] = !0;
  return e;
}
KA.toHash = t1;
function n1(A, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (iv(A, e), !av(e, A.self.RULES.all));
}
KA.alwaysValidSchema = n1;
function iv(A, e = A.schema) {
  const { opts: t, self: n } = A;
  if (!t.strictSchema || typeof e == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in e)
    i[s] || uv(A, `unknown keyword: "${s}"`);
}
KA.checkUnknownRules = iv;
function av(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (e[t])
      return !0;
  return !1;
}
KA.schemaHasRules = av;
function r1(A, e) {
  if (typeof A == "boolean")
    return !A;
  for (const t in A)
    if (t !== "$ref" && e.all[t])
      return !0;
  return !1;
}
KA.schemaHasRulesButRef = r1;
function i1({ topSchemaRef: A, schemaPath: e }, t, n, i) {
  if (!i) {
    if (typeof t == "number" || typeof t == "boolean")
      return t;
    if (typeof t == "string")
      return (0, Ve._)`${t}`;
  }
  return (0, Ve._)`${A}${e}${(0, Ve.getProperty)(n)}`;
}
KA.schemaRefOrVal = i1;
function a1(A) {
  return ov(decodeURIComponent(A));
}
KA.unescapeFragment = a1;
function o1(A) {
  return encodeURIComponent($h(A));
}
KA.escapeFragment = o1;
function $h(A) {
  return typeof A == "number" ? `${A}` : A.replace(/~/g, "~0").replace(/\//g, "~1");
}
KA.escapeJsonPointer = $h;
function ov(A) {
  return A.replace(/~1/g, "/").replace(/~0/g, "~");
}
KA.unescapeJsonPointer = ov;
function s1(A, e) {
  if (Array.isArray(A))
    for (const t of A)
      e(t);
  else
    e(A);
}
KA.eachItem = s1;
function PB({ mergeNames: A, mergeToName: e, mergeValues: t, resultToName: n }) {
  return (i, s, l, c) => {
    const f = l === void 0 ? s : l instanceof Ve.Name ? (s instanceof Ve.Name ? A(i, s, l) : e(i, s, l), l) : s instanceof Ve.Name ? (e(i, l, s), s) : t(s, l);
    return c === Ve.Name && !(f instanceof Ve.Name) ? n(i, f) : f;
  };
}
KA.mergeEvaluated = {
  props: PB({
    mergeNames: (A, e, t) => A.if((0, Ve._)`${t} !== true && ${e} !== undefined`, () => {
      A.if((0, Ve._)`${e} === true`, () => A.assign(t, !0), () => A.assign(t, (0, Ve._)`${t} || {}`).code((0, Ve._)`Object.assign(${t}, ${e})`));
    }),
    mergeToName: (A, e, t) => A.if((0, Ve._)`${t} !== true`, () => {
      e === !0 ? A.assign(t, !0) : (A.assign(t, (0, Ve._)`${t} || {}`), Ph(A, t, e));
    }),
    mergeValues: (A, e) => A === !0 ? !0 : { ...A, ...e },
    resultToName: sv
  }),
  items: PB({
    mergeNames: (A, e, t) => A.if((0, Ve._)`${t} !== true && ${e} !== undefined`, () => A.assign(t, (0, Ve._)`${e} === true ? true : ${t} > ${e} ? ${t} : ${e}`)),
    mergeToName: (A, e, t) => A.if((0, Ve._)`${t} !== true`, () => A.assign(t, e === !0 ? !0 : (0, Ve._)`${t} > ${e} ? ${t} : ${e}`)),
    mergeValues: (A, e) => A === !0 ? !0 : Math.max(A, e),
    resultToName: (A, e) => A.var("items", e)
  })
};
function sv(A, e) {
  if (e === !0)
    return A.var("props", !0);
  const t = A.var("props", (0, Ve._)`{}`);
  return e !== void 0 && Ph(A, t, e), t;
}
KA.evaluatedPropsToName = sv;
function Ph(A, e, t) {
  Object.keys(t).forEach((n) => A.assign((0, Ve._)`${e}${(0, Ve.getProperty)(n)}`, !0));
}
KA.setEvaluated = Ph;
const kB = {};
function u1(A, e) {
  return A.scopeValue("func", {
    ref: e,
    code: kB[e.code] || (kB[e.code] = new e1._Code(e.code))
  });
}
KA.useFunc = u1;
var Wd;
(function(A) {
  A[A.Num = 0] = "Num", A[A.Str = 1] = "Str";
})(Wd || (KA.Type = Wd = {}));
function l1(A, e, t) {
  if (A instanceof Ve.Name) {
    const n = e === Wd.Num;
    return t ? n ? (0, Ve._)`"[" + ${A} + "]"` : (0, Ve._)`"['" + ${A} + "']"` : n ? (0, Ve._)`"/" + ${A}` : (0, Ve._)`"/" + ${A}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return t ? (0, Ve.getProperty)(A).toString() : "/" + $h(A);
}
KA.getErrorPath = l1;
function uv(A, e, t = A.opts.strictSchema) {
  if (t) {
    if (e = `strict mode: ${e}`, t === !0)
      throw new Error(e);
    A.self.logger.warn(e);
  }
}
KA.checkStrictMode = uv;
var gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
const Dt = we, c1 = {
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
gr.default = c1;
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.extendErrors = A.resetErrorsCount = A.reportExtraError = A.reportError = A.keyword$DataError = A.keywordError = void 0;
  const e = we, t = KA, n = gr;
  A.keywordError = {
    message: ({ keyword: b }) => (0, e.str)`must pass "${b}" keyword validation`
  }, A.keyword$DataError = {
    message: ({ keyword: b, schemaType: E }) => E ? (0, e.str)`"${b}" keyword must be ${E} ($data)` : (0, e.str)`"${b}" keyword is invalid ($data)`
  };
  function i(b, E = A.keywordError, D, R) {
    const { it: x } = b, { gen: K, compositeRule: k, allErrors: Y } = x, dA = w(b, E, D);
    R ?? (k || Y) ? f(K, dA) : p(x, (0, e._)`[${dA}]`);
  }
  A.reportError = i;
  function s(b, E = A.keywordError, D) {
    const { it: R } = b, { gen: x, compositeRule: K, allErrors: k } = R, Y = w(b, E, D);
    f(x, Y), K || k || p(R, n.default.vErrors);
  }
  A.reportExtraError = s;
  function l(b, E) {
    b.assign(n.default.errors, E), b.if((0, e._)`${n.default.vErrors} !== null`, () => b.if(E, () => b.assign((0, e._)`${n.default.vErrors}.length`, E), () => b.assign(n.default.vErrors, null)));
  }
  A.resetErrorsCount = l;
  function c({ gen: b, keyword: E, schemaValue: D, data: R, errsCount: x, it: K }) {
    if (x === void 0)
      throw new Error("ajv implementation error");
    const k = b.name("err");
    b.forRange("i", x, n.default.errors, (Y) => {
      b.const(k, (0, e._)`${n.default.vErrors}[${Y}]`), b.if((0, e._)`${k}.instancePath === undefined`, () => b.assign((0, e._)`${k}.instancePath`, (0, e.strConcat)(n.default.instancePath, K.errorPath))), b.assign((0, e._)`${k}.schemaPath`, (0, e.str)`${K.errSchemaPath}/${E}`), K.opts.verbose && (b.assign((0, e._)`${k}.schema`, D), b.assign((0, e._)`${k}.data`, R));
    });
  }
  A.extendErrors = c;
  function f(b, E) {
    const D = b.const("err", E);
    b.if((0, e._)`${n.default.vErrors} === null`, () => b.assign(n.default.vErrors, (0, e._)`[${D}]`), (0, e._)`${n.default.vErrors}.push(${D})`), b.code((0, e._)`${n.default.errors}++`);
  }
  function p(b, E) {
    const { gen: D, validateName: R, schemaEnv: x } = b;
    x.$async ? D.throw((0, e._)`new ${b.ValidationError}(${E})`) : (D.assign((0, e._)`${R}.errors`, E), D.return(!1));
  }
  const B = {
    keyword: new e.Name("keyword"),
    schemaPath: new e.Name("schemaPath"),
    // also used in JTD errors
    params: new e.Name("params"),
    propertyName: new e.Name("propertyName"),
    message: new e.Name("message"),
    schema: new e.Name("schema"),
    parentSchema: new e.Name("parentSchema")
  };
  function w(b, E, D) {
    const { createErrors: R } = b.it;
    return R === !1 ? (0, e._)`{}` : v(b, E, D);
  }
  function v(b, E, D = {}) {
    const { gen: R, it: x } = b, K = [
      Q(x, D),
      u(b, D)
    ];
    return U(b, E, K), R.object(...K);
  }
  function Q({ errorPath: b }, { instancePath: E }) {
    const D = E ? (0, e.str)`${b}${(0, t.getErrorPath)(E, t.Type.Str)}` : b;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, D)];
  }
  function u({ keyword: b, it: { errSchemaPath: E } }, { schemaPath: D, parentSchema: R }) {
    let x = R ? E : (0, e.str)`${E}/${b}`;
    return D && (x = (0, e.str)`${x}${(0, t.getErrorPath)(D, t.Type.Str)}`), [B.schemaPath, x];
  }
  function U(b, { params: E, message: D }, R) {
    const { keyword: x, data: K, schemaValue: k, it: Y } = b, { opts: dA, propertyName: cA, topSchemaRef: wA, schemaPath: EA } = Y;
    R.push([B.keyword, x], [B.params, typeof E == "function" ? E(b) : E || (0, e._)`{}`]), dA.messages && R.push([B.message, typeof D == "function" ? D(b) : D]), dA.verbose && R.push([B.schema, k], [B.parentSchema, (0, e._)`${wA}${EA}`], [n.default.data, K]), cA && R.push([B.propertyName, cA]);
  }
})(Ps);
Object.defineProperty(io, "__esModule", { value: !0 });
io.boolOrEmptySchema = io.topBoolOrEmptySchema = void 0;
const f1 = Ps, d1 = we, h1 = gr, p1 = {
  message: "boolean schema is false"
};
function g1(A) {
  const { gen: e, schema: t, validateName: n } = A;
  t === !1 ? lv(A, !1) : typeof t == "object" && t.$async === !0 ? e.return(h1.default.data) : (e.assign((0, d1._)`${n}.errors`, null), e.return(!0));
}
io.topBoolOrEmptySchema = g1;
function B1(A, e) {
  const { gen: t, schema: n } = A;
  n === !1 ? (t.var(e, !1), lv(A)) : t.var(e, !0);
}
io.boolOrEmptySchema = B1;
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
  (0, f1.reportError)(i, p1, void 0, e);
}
var dt = {}, aa = {};
Object.defineProperty(aa, "__esModule", { value: !0 });
aa.getRules = aa.isJSONType = void 0;
const w1 = ["string", "number", "integer", "boolean", "null", "object", "array"], m1 = new Set(w1);
function v1(A) {
  return typeof A == "string" && m1.has(A);
}
aa.isJSONType = v1;
function y1() {
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
aa.getRules = y1;
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.shouldUseRule = Pr.shouldUseGroup = Pr.schemaHasRulesForType = void 0;
function C1({ schema: A, self: e }, t) {
  const n = e.RULES.types[t];
  return n && n !== !0 && cv(A, n);
}
Pr.schemaHasRulesForType = C1;
function cv(A, e) {
  return e.rules.some((t) => fv(A, t));
}
Pr.shouldUseGroup = cv;
function fv(A, e) {
  var t;
  return A[e.keyword] !== void 0 || ((t = e.definition.implements) === null || t === void 0 ? void 0 : t.some((n) => A[n] !== void 0));
}
Pr.shouldUseRule = fv;
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.reportTypeError = dt.checkDataTypes = dt.checkDataType = dt.coerceAndCheckDataType = dt.getJSONTypes = dt.getSchemaTypes = dt.DataType = void 0;
const Q1 = aa, F1 = Pr, U1 = Ps, he = we, dv = KA;
var Za;
(function(A) {
  A[A.Correct = 0] = "Correct", A[A.Wrong = 1] = "Wrong";
})(Za || (dt.DataType = Za = {}));
function E1(A) {
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
dt.getSchemaTypes = E1;
function hv(A) {
  const e = Array.isArray(A) ? A : A ? [A] : [];
  if (e.every(Q1.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
dt.getJSONTypes = hv;
function b1(A, e) {
  const { gen: t, data: n, opts: i } = A, s = _1(e, i.coerceTypes), l = e.length > 0 && !(s.length === 0 && e.length === 1 && (0, F1.schemaHasRulesForType)(A, e[0]));
  if (l) {
    const c = kh(e, n, i.strictNumbers, Za.Wrong);
    t.if(c, () => {
      s.length ? x1(A, e, s) : Gh(A);
    });
  }
  return l;
}
dt.coerceAndCheckDataType = b1;
const pv = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function _1(A, e) {
  return e ? A.filter((t) => pv.has(t) || e === "array" && t === "array") : [];
}
function x1(A, e, t) {
  const { gen: n, data: i, opts: s } = A, l = n.let("dataType", (0, he._)`typeof ${i}`), c = n.let("coerced", (0, he._)`undefined`);
  s.coerceTypes === "array" && n.if((0, he._)`${l} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, he._)`${i}[0]`).assign(l, (0, he._)`typeof ${i}`).if(kh(e, i, s.strictNumbers), () => n.assign(c, i))), n.if((0, he._)`${c} !== undefined`);
  for (const p of t)
    (pv.has(p) || p === "array" && s.coerceTypes === "array") && f(p);
  n.else(), Gh(A), n.endIf(), n.if((0, he._)`${c} !== undefined`, () => {
    n.assign(i, c), I1(A, c);
  });
  function f(p) {
    switch (p) {
      case "string":
        n.elseIf((0, he._)`${l} == "number" || ${l} == "boolean"`).assign(c, (0, he._)`"" + ${i}`).elseIf((0, he._)`${i} === null`).assign(c, (0, he._)`""`);
        return;
      case "number":
        n.elseIf((0, he._)`${l} == "boolean" || ${i} === null
              || (${l} == "string" && ${i} && ${i} == +${i})`).assign(c, (0, he._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, he._)`${l} === "boolean" || ${i} === null
              || (${l} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(c, (0, he._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, he._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(c, !1).elseIf((0, he._)`${i} === "true" || ${i} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, he._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, he._)`${l} === "string" || ${l} === "number"
              || ${l} === "boolean" || ${i} === null`).assign(c, (0, he._)`[${i}]`);
    }
  }
}
function I1({ gen: A, parentData: e, parentDataProperty: t }, n) {
  A.if((0, he._)`${e} !== undefined`, () => A.assign((0, he._)`${e}[${t}]`, n));
}
function Xd(A, e, t, n = Za.Correct) {
  const i = n === Za.Correct ? he.operators.EQ : he.operators.NEQ;
  let s;
  switch (A) {
    case "null":
      return (0, he._)`${e} ${i} null`;
    case "array":
      s = (0, he._)`Array.isArray(${e})`;
      break;
    case "object":
      s = (0, he._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      s = l((0, he._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      s = l();
      break;
    default:
      return (0, he._)`typeof ${e} ${i} ${A}`;
  }
  return n === Za.Correct ? s : (0, he.not)(s);
  function l(c = he.nil) {
    return (0, he.and)((0, he._)`typeof ${e} == "number"`, c, t ? (0, he._)`isFinite(${e})` : he.nil);
  }
}
dt.checkDataType = Xd;
function kh(A, e, t, n) {
  if (A.length === 1)
    return Xd(A[0], e, t, n);
  let i;
  const s = (0, dv.toHash)(A);
  if (s.array && s.object) {
    const l = (0, he._)`typeof ${e} != "object"`;
    i = s.null ? l : (0, he._)`!${e} || ${l}`, delete s.null, delete s.array, delete s.object;
  } else
    i = he.nil;
  s.number && delete s.integer;
  for (const l in s)
    i = (0, he.and)(i, Xd(l, e, t, n));
  return i;
}
dt.checkDataTypes = kh;
const H1 = {
  message: ({ schema: A }) => `must be ${A}`,
  params: ({ schema: A, schemaValue: e }) => typeof A == "string" ? (0, he._)`{type: ${A}}` : (0, he._)`{type: ${e}}`
};
function Gh(A) {
  const e = S1(A);
  (0, U1.reportError)(e, H1);
}
dt.reportTypeError = Gh;
function S1(A) {
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
const Oa = we, L1 = KA;
function T1(A, e) {
  const { properties: t, items: n } = A.schema;
  if (e === "object" && t)
    for (const i in t)
      GB(A, i, t[i].default);
  else e === "array" && Array.isArray(n) && n.forEach((i, s) => GB(A, s, i.default));
}
Ic.assignDefaults = T1;
function GB(A, e, t) {
  const { gen: n, compositeRule: i, data: s, opts: l } = A;
  if (t === void 0)
    return;
  const c = (0, Oa._)`${s}${(0, Oa.getProperty)(e)}`;
  if (i) {
    (0, L1.checkStrictMode)(A, `default is ignored for: ${c}`);
    return;
  }
  let f = (0, Oa._)`${c} === undefined`;
  l.useDefaults === "empty" && (f = (0, Oa._)`${f} || ${c} === null || ${c} === ""`), n.if(f, (0, Oa._)`${c} = ${(0, Oa.stringify)(t)}`);
}
var cr = {}, Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.validateUnion = Be.validateArray = Be.usePattern = Be.callValidateCode = Be.schemaProperties = Be.allSchemaProperties = Be.noPropertyInData = Be.propertyInData = Be.isOwnProperty = Be.hasPropFunc = Be.reportMissingProp = Be.checkMissingProp = Be.checkReportMissingProp = void 0;
const ze = we, Vh = KA, hi = gr, D1 = KA;
function O1(A, e) {
  const { gen: t, data: n, it: i } = A;
  t.if(Xh(t, n, e, i.opts.ownProperties), () => {
    A.setParams({ missingProperty: (0, ze._)`${e}` }, !0), A.error();
  });
}
Be.checkReportMissingProp = O1;
function N1({ gen: A, data: e, it: { opts: t } }, n, i) {
  return (0, ze.or)(...n.map((s) => (0, ze.and)(Xh(A, e, s, t.ownProperties), (0, ze._)`${i} = ${s}`)));
}
Be.checkMissingProp = N1;
function M1(A, e) {
  A.setParams({ missingProperty: e }, !0), A.error();
}
Be.reportMissingProp = M1;
function gv(A) {
  return A.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ze._)`Object.prototype.hasOwnProperty`
  });
}
Be.hasPropFunc = gv;
function Wh(A, e, t) {
  return (0, ze._)`${gv(A)}.call(${e}, ${t})`;
}
Be.isOwnProperty = Wh;
function K1(A, e, t, n) {
  const i = (0, ze._)`${e}${(0, ze.getProperty)(t)} !== undefined`;
  return n ? (0, ze._)`${i} && ${Wh(A, e, t)}` : i;
}
Be.propertyInData = K1;
function Xh(A, e, t, n) {
  const i = (0, ze._)`${e}${(0, ze.getProperty)(t)} === undefined`;
  return n ? (0, ze.or)(i, (0, ze.not)(Wh(A, e, t))) : i;
}
Be.noPropertyInData = Xh;
function Bv(A) {
  return A ? Object.keys(A).filter((e) => e !== "__proto__") : [];
}
Be.allSchemaProperties = Bv;
function R1(A, e) {
  return Bv(e).filter((t) => !(0, Vh.alwaysValidSchema)(A, e[t]));
}
Be.schemaProperties = R1;
function $1({ schemaCode: A, data: e, it: { gen: t, topSchemaRef: n, schemaPath: i, errorPath: s }, it: l }, c, f, p) {
  const B = p ? (0, ze._)`${A}, ${e}, ${n}${i}` : e, w = [
    [hi.default.instancePath, (0, ze.strConcat)(hi.default.instancePath, s)],
    [hi.default.parentData, l.parentData],
    [hi.default.parentDataProperty, l.parentDataProperty],
    [hi.default.rootData, hi.default.rootData]
  ];
  l.opts.dynamicRef && w.push([hi.default.dynamicAnchors, hi.default.dynamicAnchors]);
  const v = (0, ze._)`${B}, ${t.object(...w)}`;
  return f !== ze.nil ? (0, ze._)`${c}.call(${f}, ${v})` : (0, ze._)`${c}(${v})`;
}
Be.callValidateCode = $1;
const P1 = (0, ze._)`new RegExp`;
function k1({ gen: A, it: { opts: e } }, t) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: i } = e.code, s = i(t, n);
  return A.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, ze._)`${i.code === "new RegExp" ? P1 : (0, D1.useFunc)(A, i)}(${t}, ${n})`
  });
}
Be.usePattern = k1;
function G1(A) {
  const { gen: e, data: t, keyword: n, it: i } = A, s = e.name("valid");
  if (i.allErrors) {
    const c = e.let("valid", !0);
    return l(() => e.assign(c, !1)), c;
  }
  return e.var(s, !0), l(() => e.break()), s;
  function l(c) {
    const f = e.const("len", (0, ze._)`${t}.length`);
    e.forRange("i", 0, f, (p) => {
      A.subschema({
        keyword: n,
        dataProp: p,
        dataPropType: Vh.Type.Num
      }, s), e.if((0, ze.not)(s), c);
    });
  }
}
Be.validateArray = G1;
function V1(A) {
  const { gen: e, schema: t, keyword: n, it: i } = A;
  if (!Array.isArray(t))
    throw new Error("ajv implementation error");
  if (t.some((f) => (0, Vh.alwaysValidSchema)(i, f)) && !i.opts.unevaluated)
    return;
  const l = e.let("valid", !1), c = e.name("_valid");
  e.block(() => t.forEach((f, p) => {
    const B = A.subschema({
      keyword: n,
      schemaProp: p,
      compositeRule: !0
    }, c);
    e.assign(l, (0, ze._)`${l} || ${c}`), A.mergeValidEvaluated(B, c) || e.if((0, ze.not)(l));
  })), A.result(l, () => A.reset(), () => A.error(!0));
}
Be.validateUnion = V1;
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.validateKeywordUsage = cr.validSchemaType = cr.funcKeywordCode = cr.macroKeywordCode = void 0;
const Wt = we, Ji = gr, W1 = Be, X1 = Ps;
function q1(A, e) {
  const { gen: t, keyword: n, schema: i, parentSchema: s, it: l } = A, c = e.macro.call(l.self, i, s, l), f = wv(t, n, c);
  l.opts.validateSchema !== !1 && l.self.validateSchema(c, !0);
  const p = t.name("valid");
  A.subschema({
    schema: c,
    schemaPath: Wt.nil,
    errSchemaPath: `${l.errSchemaPath}/${n}`,
    topSchemaRef: f,
    compositeRule: !0
  }, p), A.pass(p, () => A.error(!0));
}
cr.macroKeywordCode = q1;
function z1(A, e) {
  var t;
  const { gen: n, keyword: i, schema: s, parentSchema: l, $data: c, it: f } = A;
  j1(f, e);
  const p = !c && e.compile ? e.compile.call(f.self, s, l, f) : e.validate, B = wv(n, i, p), w = n.let("valid");
  A.block$data(w, v), A.ok((t = e.valid) !== null && t !== void 0 ? t : w);
  function v() {
    if (e.errors === !1)
      U(), e.modifying && VB(A), b(() => A.error());
    else {
      const E = e.async ? Q() : u();
      e.modifying && VB(A), b(() => J1(A, E));
    }
  }
  function Q() {
    const E = n.let("ruleErrs", null);
    return n.try(() => U((0, Wt._)`await `), (D) => n.assign(w, !1).if((0, Wt._)`${D} instanceof ${f.ValidationError}`, () => n.assign(E, (0, Wt._)`${D}.errors`), () => n.throw(D))), E;
  }
  function u() {
    const E = (0, Wt._)`${B}.errors`;
    return n.assign(E, null), U(Wt.nil), E;
  }
  function U(E = e.async ? (0, Wt._)`await ` : Wt.nil) {
    const D = f.opts.passContext ? Ji.default.this : Ji.default.self, R = !("compile" in e && !c || e.schema === !1);
    n.assign(w, (0, Wt._)`${E}${(0, W1.callValidateCode)(A, B, D, R)}`, e.modifying);
  }
  function b(E) {
    var D;
    n.if((0, Wt.not)((D = e.valid) !== null && D !== void 0 ? D : w), E);
  }
}
cr.funcKeywordCode = z1;
function VB(A) {
  const { gen: e, data: t, it: n } = A;
  e.if(n.parentData, () => e.assign(t, (0, Wt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function J1(A, e) {
  const { gen: t } = A;
  t.if((0, Wt._)`Array.isArray(${e})`, () => {
    t.assign(Ji.default.vErrors, (0, Wt._)`${Ji.default.vErrors} === null ? ${e} : ${Ji.default.vErrors}.concat(${e})`).assign(Ji.default.errors, (0, Wt._)`${Ji.default.vErrors}.length`), (0, X1.extendErrors)(A);
  }, () => A.error());
}
function j1({ schemaEnv: A }, e) {
  if (e.async && !A.$async)
    throw new Error("async keyword in sync schema");
}
function wv(A, e, t) {
  if (t === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return A.scopeValue("keyword", typeof t == "function" ? { ref: t } : { ref: t, code: (0, Wt.stringify)(t) });
}
function Y1(A, e, t = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(A) : n === "object" ? A && typeof A == "object" && !Array.isArray(A) : typeof A == n || t && typeof A > "u");
}
cr.validSchemaType = Y1;
function Z1({ schema: A, opts: e, self: t, errSchemaPath: n }, i, s) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(s) : i.keyword !== s)
    throw new Error("ajv implementation error");
  const l = i.dependencies;
  if (l != null && l.some((c) => !Object.prototype.hasOwnProperty.call(A, c)))
    throw new Error(`parent schema must have dependencies of ${s}: ${l.join(",")}`);
  if (i.validateSchema && !i.validateSchema(A[s])) {
    const f = `keyword "${s}" value is invalid at path "${n}": ` + t.errorsText(i.validateSchema.errors);
    if (e.validateSchema === "log")
      t.logger.error(f);
    else
      throw new Error(f);
  }
}
cr.validateKeywordUsage = Z1;
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.extendSubschemaMode = Fi.extendSubschemaData = Fi.getSubschema = void 0;
const lr = we, mv = KA;
function A_(A, { keyword: e, schemaProp: t, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: l }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const c = A.schema[e];
    return t === void 0 ? {
      schema: c,
      schemaPath: (0, lr._)`${A.schemaPath}${(0, lr.getProperty)(e)}`,
      errSchemaPath: `${A.errSchemaPath}/${e}`
    } : {
      schema: c[t],
      schemaPath: (0, lr._)`${A.schemaPath}${(0, lr.getProperty)(e)}${(0, lr.getProperty)(t)}`,
      errSchemaPath: `${A.errSchemaPath}/${e}/${(0, mv.escapeFragment)(t)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || s === void 0 || l === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: l,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Fi.getSubschema = A_;
function e_(A, e, { dataProp: t, dataPropType: n, data: i, dataTypes: s, propertyName: l }) {
  if (i !== void 0 && t !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: c } = e;
  if (t !== void 0) {
    const { errorPath: p, dataPathArr: B, opts: w } = e, v = c.let("data", (0, lr._)`${e.data}${(0, lr.getProperty)(t)}`, !0);
    f(v), A.errorPath = (0, lr.str)`${p}${(0, mv.getErrorPath)(t, n, w.jsPropertySyntax)}`, A.parentDataProperty = (0, lr._)`${t}`, A.dataPathArr = [...B, A.parentDataProperty];
  }
  if (i !== void 0) {
    const p = i instanceof lr.Name ? i : c.let("data", i, !0);
    f(p), l !== void 0 && (A.propertyName = l);
  }
  s && (A.dataTypes = s);
  function f(p) {
    A.data = p, A.dataLevel = e.dataLevel + 1, A.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), A.parentData = e.data, A.dataNames = [...e.dataNames, p];
  }
}
Fi.extendSubschemaData = e_;
function t_(A, { jtdDiscriminator: e, jtdMetadata: t, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (A.compositeRule = n), i !== void 0 && (A.createErrors = i), s !== void 0 && (A.allErrors = s), A.jtdDiscriminator = e, A.jtdMetadata = t;
}
Fi.extendSubschemaMode = t_;
var Ut = {}, vv = function A(e, t) {
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
}, yv = { exports: {} }, vi = yv.exports = function(A, e, t) {
  typeof e == "function" && (t = e, e = {}), t = e.cb || t;
  var n = typeof t == "function" ? t : t.pre || function() {
  }, i = t.post || function() {
  };
  $l(e, n, i, A, "", A);
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
function $l(A, e, t, n, i, s, l, c, f, p) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, i, s, l, c, f, p);
    for (var B in n) {
      var w = n[B];
      if (Array.isArray(w)) {
        if (B in vi.arrayKeywords)
          for (var v = 0; v < w.length; v++)
            $l(A, e, t, w[v], i + "/" + B + "/" + v, s, i, B, n, v);
      } else if (B in vi.propsKeywords) {
        if (w && typeof w == "object")
          for (var Q in w)
            $l(A, e, t, w[Q], i + "/" + B + "/" + n_(Q), s, i, B, n, Q);
      } else (B in vi.keywords || A.allKeys && !(B in vi.skipKeywords)) && $l(A, e, t, w, i + "/" + B, s, i, B, n);
    }
    t(n, i, s, l, c, f, p);
  }
}
function n_(A) {
  return A.replace(/~/g, "~0").replace(/\//g, "~1");
}
var r_ = yv.exports;
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.getSchemaRefs = Ut.resolveUrl = Ut.normalizeId = Ut._getFullPath = Ut.getFullPath = Ut.inlineRef = void 0;
const i_ = KA, a_ = vv, o_ = r_, s_ = /* @__PURE__ */ new Set([
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
function u_(A, e = !0) {
  return typeof A == "boolean" ? !0 : e === !0 ? !qd(A) : e ? Cv(A) <= e : !1;
}
Ut.inlineRef = u_;
const l_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function qd(A) {
  for (const e in A) {
    if (l_.has(e))
      return !0;
    const t = A[e];
    if (Array.isArray(t) && t.some(qd) || typeof t == "object" && qd(t))
      return !0;
  }
  return !1;
}
function Cv(A) {
  let e = 0;
  for (const t in A) {
    if (t === "$ref")
      return 1 / 0;
    if (e++, !s_.has(t) && (typeof A[t] == "object" && (0, i_.eachItem)(A[t], (n) => e += Cv(n)), e === 1 / 0))
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
const c_ = /#\/?$/;
function Ao(A) {
  return A ? A.replace(c_, "") : "";
}
Ut.normalizeId = Ao;
function f_(A, e, t) {
  return t = Ao(t), A.resolve(e, t);
}
Ut.resolveUrl = f_;
const d_ = /^[a-z_][-a-z0-9._]*$/i;
function h_(A, e) {
  if (typeof A == "boolean")
    return {};
  const { schemaId: t, uriResolver: n } = this.opts, i = Ao(A[t] || e), s = { "": i }, l = Qv(n, i, !1), c = {}, f = /* @__PURE__ */ new Set();
  return o_(A, { allKeys: !0 }, (w, v, Q, u) => {
    if (u === void 0)
      return;
    const U = l + v;
    let b = s[u];
    typeof w[t] == "string" && (b = E.call(this, w[t])), D.call(this, w.$anchor), D.call(this, w.$dynamicAnchor), s[v] = b;
    function E(R) {
      const x = this.opts.uriResolver.resolve;
      if (R = Ao(b ? x(b, R) : R), f.has(R))
        throw B(R);
      f.add(R);
      let K = this.refs[R];
      return typeof K == "string" && (K = this.refs[K]), typeof K == "object" ? p(w, K.schema, R) : R !== Ao(U) && (R[0] === "#" ? (p(w, c[R], R), c[R] = w) : this.refs[R] = U), R;
    }
    function D(R) {
      if (typeof R == "string") {
        if (!d_.test(R))
          throw new Error(`invalid anchor "${R}"`);
        E.call(this, `#${R}`);
      }
    }
  }), c;
  function p(w, v, Q) {
    if (v !== void 0 && !a_(w, v))
      throw B(Q);
  }
  function B(w) {
    return new Error(`reference "${w}" resolves to more than one schema`);
  }
}
Ut.getSchemaRefs = h_;
Object.defineProperty(zn, "__esModule", { value: !0 });
zn.getData = zn.KeywordCxt = zn.validateFunctionCode = void 0;
const Uv = io, WB = dt, qh = Pr, tc = dt, p_ = Ic, Bs = cr, ld = Fi, kA = we, se = gr, g_ = Ut, kr = KA, jo = Ps;
function B_(A) {
  if (_v(A) && (xv(A), bv(A))) {
    v_(A);
    return;
  }
  Ev(A, () => (0, Uv.topBoolOrEmptySchema)(A));
}
zn.validateFunctionCode = B_;
function Ev({ gen: A, validateName: e, schema: t, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? A.func(e, (0, kA._)`${se.default.data}, ${se.default.valCxt}`, n.$async, () => {
    A.code((0, kA._)`"use strict"; ${XB(t, i)}`), m_(A, i), A.code(s);
  }) : A.func(e, (0, kA._)`${se.default.data}, ${w_(i)}`, n.$async, () => A.code(XB(t, i)).code(s));
}
function w_(A) {
  return (0, kA._)`{${se.default.instancePath}="", ${se.default.parentData}, ${se.default.parentDataProperty}, ${se.default.rootData}=${se.default.data}${A.dynamicRef ? (0, kA._)`, ${se.default.dynamicAnchors}={}` : kA.nil}}={}`;
}
function m_(A, e) {
  A.if(se.default.valCxt, () => {
    A.var(se.default.instancePath, (0, kA._)`${se.default.valCxt}.${se.default.instancePath}`), A.var(se.default.parentData, (0, kA._)`${se.default.valCxt}.${se.default.parentData}`), A.var(se.default.parentDataProperty, (0, kA._)`${se.default.valCxt}.${se.default.parentDataProperty}`), A.var(se.default.rootData, (0, kA._)`${se.default.valCxt}.${se.default.rootData}`), e.dynamicRef && A.var(se.default.dynamicAnchors, (0, kA._)`${se.default.valCxt}.${se.default.dynamicAnchors}`);
  }, () => {
    A.var(se.default.instancePath, (0, kA._)`""`), A.var(se.default.parentData, (0, kA._)`undefined`), A.var(se.default.parentDataProperty, (0, kA._)`undefined`), A.var(se.default.rootData, se.default.data), e.dynamicRef && A.var(se.default.dynamicAnchors, (0, kA._)`{}`);
  });
}
function v_(A) {
  const { schema: e, opts: t, gen: n } = A;
  Ev(A, () => {
    t.$comment && e.$comment && Hv(A), U_(A), n.let(se.default.vErrors, null), n.let(se.default.errors, 0), t.unevaluated && y_(A), Iv(A), __(A);
  });
}
function y_(A) {
  const { gen: e, validateName: t } = A;
  A.evaluated = e.const("evaluated", (0, kA._)`${t}.evaluated`), e.if((0, kA._)`${A.evaluated}.dynamicProps`, () => e.assign((0, kA._)`${A.evaluated}.props`, (0, kA._)`undefined`)), e.if((0, kA._)`${A.evaluated}.dynamicItems`, () => e.assign((0, kA._)`${A.evaluated}.items`, (0, kA._)`undefined`));
}
function XB(A, e) {
  const t = typeof A == "object" && A[e.schemaId];
  return t && (e.code.source || e.code.process) ? (0, kA._)`/*# sourceURL=${t} */` : kA.nil;
}
function C_(A, e) {
  if (_v(A) && (xv(A), bv(A))) {
    Q_(A, e);
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
function Q_(A, e) {
  const { schema: t, gen: n, opts: i } = A;
  i.$comment && t.$comment && Hv(A), E_(A), b_(A);
  const s = n.const("_errs", se.default.errors);
  Iv(A, s), n.var(e, (0, kA._)`${s} === ${se.default.errors}`);
}
function xv(A) {
  (0, kr.checkUnknownRules)(A), F_(A);
}
function Iv(A, e) {
  if (A.opts.jtd)
    return qB(A, [], !1, e);
  const t = (0, WB.getSchemaTypes)(A.schema), n = (0, WB.coerceAndCheckDataType)(A, t);
  qB(A, t, !n, e);
}
function F_(A) {
  const { schema: e, errSchemaPath: t, opts: n, self: i } = A;
  e.$ref && n.ignoreKeywordsWithRef && (0, kr.schemaHasRulesButRef)(e, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${t}"`);
}
function U_(A) {
  const { schema: e, opts: t } = A;
  e.default !== void 0 && t.useDefaults && t.strictSchema && (0, kr.checkStrictMode)(A, "default is ignored in the schema root");
}
function E_(A) {
  const e = A.schema[A.opts.schemaId];
  e && (A.baseId = (0, g_.resolveUrl)(A.opts.uriResolver, A.baseId, e));
}
function b_(A) {
  if (A.schema.$async && !A.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Hv({ gen: A, schemaEnv: e, schema: t, errSchemaPath: n, opts: i }) {
  const s = t.$comment;
  if (i.$comment === !0)
    A.code((0, kA._)`${se.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const l = (0, kA.str)`${n}/$comment`, c = A.scopeValue("root", { ref: e.root });
    A.code((0, kA._)`${se.default.self}.opts.$comment(${s}, ${l}, ${c}.schema)`);
  }
}
function __(A) {
  const { gen: e, schemaEnv: t, validateName: n, ValidationError: i, opts: s } = A;
  t.$async ? e.if((0, kA._)`${se.default.errors} === 0`, () => e.return(se.default.data), () => e.throw((0, kA._)`new ${i}(${se.default.vErrors})`)) : (e.assign((0, kA._)`${n}.errors`, se.default.vErrors), s.unevaluated && x_(A), e.return((0, kA._)`${se.default.errors} === 0`));
}
function x_({ gen: A, evaluated: e, props: t, items: n }) {
  t instanceof kA.Name && A.assign((0, kA._)`${e}.props`, t), n instanceof kA.Name && A.assign((0, kA._)`${e}.items`, n);
}
function qB(A, e, t, n) {
  const { gen: i, schema: s, data: l, allErrors: c, opts: f, self: p } = A, { RULES: B } = p;
  if (s.$ref && (f.ignoreKeywordsWithRef || !(0, kr.schemaHasRulesButRef)(s, B))) {
    i.block(() => Tv(A, "$ref", B.all.$ref.definition));
    return;
  }
  f.jtd || I_(A, e), i.block(() => {
    for (const v of B.rules)
      w(v);
    w(B.post);
  });
  function w(v) {
    (0, qh.shouldUseGroup)(s, v) && (v.type ? (i.if((0, tc.checkDataType)(v.type, l, f.strictNumbers)), zB(A, v), e.length === 1 && e[0] === v.type && t && (i.else(), (0, tc.reportTypeError)(A)), i.endIf()) : zB(A, v), c || i.if((0, kA._)`${se.default.errors} === ${n || 0}`));
  }
}
function zB(A, e) {
  const { gen: t, schema: n, opts: { useDefaults: i } } = A;
  i && (0, p_.assignDefaults)(A, e.type), t.block(() => {
    for (const s of e.rules)
      (0, qh.shouldUseRule)(n, s) && Tv(A, s.keyword, s.definition, e.type);
  });
}
function I_(A, e) {
  A.schemaEnv.meta || !A.opts.strictTypes || (H_(A, e), A.opts.allowUnionTypes || S_(A, e), L_(A, A.dataTypes));
}
function H_(A, e) {
  if (e.length) {
    if (!A.dataTypes.length) {
      A.dataTypes = e;
      return;
    }
    e.forEach((t) => {
      Sv(A.dataTypes, t) || zh(A, `type "${t}" not allowed by context "${A.dataTypes.join(",")}"`);
    }), D_(A, e);
  }
}
function S_(A, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && zh(A, "use allowUnionTypes to allow union type keyword");
}
function L_(A, e) {
  const t = A.self.RULES.all;
  for (const n in t) {
    const i = t[n];
    if (typeof i == "object" && (0, qh.shouldUseRule)(A.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((l) => T_(e, l)) && zh(A, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function T_(A, e) {
  return A.includes(e) || e === "number" && A.includes("integer");
}
function Sv(A, e) {
  return A.includes(e) || e === "integer" && A.includes("number");
}
function D_(A, e) {
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
    if ((0, Bs.validateKeywordUsage)(e, t, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, kr.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = t.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = t, this.$data)
      this.schemaCode = e.gen.const("vSchema", Dv(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, Bs.validSchemaType)(this.schema, t.schemaType, t.allowUndefined))
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
  block$data(e, t, n = kA.nil) {
    this.gen.block(() => {
      this.check$data(e, n), t();
    });
  }
  check$data(e = kA.nil, t = kA.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: s, def: l } = this;
    n.if((0, kA.or)((0, kA._)`${i} === undefined`, t)), e !== kA.nil && n.assign(e, !0), (s.length || l.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== kA.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: t, schemaType: n, def: i, it: s } = this;
    return (0, kA.or)(l(), c());
    function l() {
      if (n.length) {
        if (!(t instanceof kA.Name))
          throw new Error("ajv implementation error");
        const f = Array.isArray(n) ? n : [n];
        return (0, kA._)`${(0, tc.checkDataTypes)(f, t, s.opts.strictNumbers, tc.DataType.Wrong)}`;
      }
      return kA.nil;
    }
    function c() {
      if (i.validateSchema) {
        const f = e.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, kA._)`!${f}(${t})`;
      }
      return kA.nil;
    }
  }
  subschema(e, t) {
    const n = (0, ld.getSubschema)(this.it, e);
    (0, ld.extendSubschemaData)(n, this.it, e), (0, ld.extendSubschemaMode)(n, e);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return C_(i, t), i;
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
zn.KeywordCxt = Lv;
function Tv(A, e, t, n) {
  const i = new Lv(A, t, e);
  "code" in t ? t.code(i, n) : i.$data && t.validate ? (0, Bs.funcKeywordCode)(i, t) : "macro" in t ? (0, Bs.macroKeywordCode)(i, t) : (t.compile || t.validate) && (0, Bs.funcKeywordCode)(i, t);
}
const O_ = /^\/(?:[^~]|~0|~1)*$/, N_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Dv(A, { dataLevel: e, dataNames: t, dataPathArr: n }) {
  let i, s;
  if (A === "")
    return se.default.rootData;
  if (A[0] === "/") {
    if (!O_.test(A))
      throw new Error(`Invalid JSON-pointer: ${A}`);
    i = A, s = se.default.rootData;
  } else {
    const p = N_.exec(A);
    if (!p)
      throw new Error(`Invalid JSON-pointer: ${A}`);
    const B = +p[1];
    if (i = p[2], i === "#") {
      if (B >= e)
        throw new Error(f("property/index", B));
      return n[e - B];
    }
    if (B > e)
      throw new Error(f("data", B));
    if (s = t[e - B], !i)
      return s;
  }
  let l = s;
  const c = i.split("/");
  for (const p of c)
    p && (s = (0, kA._)`${s}${(0, kA.getProperty)((0, kr.unescapeJsonPointer)(p))}`, l = (0, kA._)`${l} && ${s}`);
  return l;
  function f(p, B) {
    return `Cannot access ${p} ${B} levels up, current level is ${e}`;
  }
}
zn.getData = Dv;
var ks = {};
Object.defineProperty(ks, "__esModule", { value: !0 });
class M_ extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
ks.default = M_;
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
const cd = Ut;
class K_ extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`), this.missingRef = (0, cd.resolveUrl)(e, t, n), this.missingSchema = (0, cd.normalizeId)((0, cd.getFullPath)(e, this.missingRef));
  }
}
go.default = K_;
var en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.resolveSchema = en.getCompilingSchema = en.resolveRef = en.compileSchema = en.SchemaEnv = void 0;
const Pn = we, R_ = ks, Xi = gr, Xn = Ut, JB = KA, $_ = zn;
class Hc {
  constructor(e) {
    var t;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (t = e.baseId) !== null && t !== void 0 ? t : (0, Xn.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
en.SchemaEnv = Hc;
function Jh(A) {
  const e = Ov.call(this, A);
  if (e)
    return e;
  const t = (0, Xn.getFullPath)(this.opts.uriResolver, A.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, l = new Pn.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let c;
  A.$async && (c = l.scopeValue("Error", {
    ref: R_.default,
    code: (0, Pn._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const f = l.scopeName("validate");
  A.validateName = f;
  const p = {
    gen: l,
    allErrors: this.opts.allErrors,
    data: Xi.default.data,
    parentData: Xi.default.parentData,
    parentDataProperty: Xi.default.parentDataProperty,
    dataNames: [Xi.default.data],
    dataPathArr: [Pn.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: l.scopeValue("schema", this.opts.code.source === !0 ? { ref: A.schema, code: (0, Pn.stringify)(A.schema) } : { ref: A.schema }),
    validateName: f,
    ValidationError: c,
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
  let B;
  try {
    this._compilations.add(A), (0, $_.validateFunctionCode)(p), l.optimize(this.opts.code.optimize);
    const w = l.toString();
    B = `${l.scopeRefs(Xi.default.scope)}return ${w}`, this.opts.code.process && (B = this.opts.code.process(B, A));
    const Q = new Function(`${Xi.default.self}`, `${Xi.default.scope}`, B)(this, this.scope.get());
    if (this.scope.value(f, { ref: Q }), Q.errors = null, Q.schema = A.schema, Q.schemaEnv = A, A.$async && (Q.$async = !0), this.opts.code.source === !0 && (Q.source = { validateName: f, validateCode: w, scopeValues: l._values }), this.opts.unevaluated) {
      const { props: u, items: U } = p;
      Q.evaluated = {
        props: u instanceof Pn.Name ? void 0 : u,
        items: U instanceof Pn.Name ? void 0 : U,
        dynamicProps: u instanceof Pn.Name,
        dynamicItems: U instanceof Pn.Name
      }, Q.source && (Q.source.evaluated = (0, Pn.stringify)(Q.evaluated));
    }
    return A.validate = Q, A;
  } catch (w) {
    throw delete A.validate, delete A.validateName, B && this.logger.error("Error compiling schema, function code:", B), w;
  } finally {
    this._compilations.delete(A);
  }
}
en.compileSchema = Jh;
function P_(A, e, t) {
  var n;
  t = (0, Xn.resolveUrl)(this.opts.uriResolver, e, t);
  const i = A.refs[t];
  if (i)
    return i;
  let s = V_.call(this, A, t);
  if (s === void 0) {
    const l = (n = A.localRefs) === null || n === void 0 ? void 0 : n[t], { schemaId: c } = this.opts;
    l && (s = new Hc({ schema: l, schemaId: c, root: A, baseId: e }));
  }
  if (s !== void 0)
    return A.refs[t] = k_.call(this, s);
}
en.resolveRef = P_;
function k_(A) {
  return (0, Xn.inlineRef)(A.schema, this.opts.inlineRefs) ? A.schema : A.validate ? A : Jh.call(this, A);
}
function Ov(A) {
  for (const e of this._compilations)
    if (G_(e, A))
      return e;
}
en.getCompilingSchema = Ov;
function G_(A, e) {
  return A.schema === e.schema && A.root === e.root && A.baseId === e.baseId;
}
function V_(A, e) {
  let t;
  for (; typeof (t = this.refs[e]) == "string"; )
    e = t;
  return t || this.schemas[e] || Sc.call(this, A, e);
}
function Sc(A, e) {
  const t = this.opts.uriResolver.parse(e), n = (0, Xn._getFullPath)(this.opts.uriResolver, t);
  let i = (0, Xn.getFullPath)(this.opts.uriResolver, A.baseId, void 0);
  if (Object.keys(A.schema).length > 0 && n === i)
    return fd.call(this, t, A);
  const s = (0, Xn.normalizeId)(n), l = this.refs[s] || this.schemas[s];
  if (typeof l == "string") {
    const c = Sc.call(this, A, l);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : fd.call(this, t, c);
  }
  if (typeof (l == null ? void 0 : l.schema) == "object") {
    if (l.validate || Jh.call(this, l), s === (0, Xn.normalizeId)(e)) {
      const { schema: c } = l, { schemaId: f } = this.opts, p = c[f];
      return p && (i = (0, Xn.resolveUrl)(this.opts.uriResolver, i, p)), new Hc({ schema: c, schemaId: f, root: A, baseId: i });
    }
    return fd.call(this, t, l);
  }
}
en.resolveSchema = Sc;
const W_ = /* @__PURE__ */ new Set([
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
  for (const c of A.fragment.slice(1).split("/")) {
    if (typeof t == "boolean")
      return;
    const f = t[(0, JB.unescapeFragment)(c)];
    if (f === void 0)
      return;
    t = f;
    const p = typeof t == "object" && t[this.opts.schemaId];
    !W_.has(c) && p && (e = (0, Xn.resolveUrl)(this.opts.uriResolver, e, p));
  }
  let s;
  if (typeof t != "boolean" && t.$ref && !(0, JB.schemaHasRulesButRef)(t, this.RULES)) {
    const c = (0, Xn.resolveUrl)(this.opts.uriResolver, e, t.$ref);
    s = Sc.call(this, n, c);
  }
  const { schemaId: l } = this.opts;
  if (s = s || new Hc({ schema: t, schemaId: l, root: n, baseId: e }), s.schema !== s.root.schema)
    return s;
}
const X_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", q_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", z_ = "object", J_ = [
  "$data"
], j_ = {
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
}, Y_ = !1, Z_ = {
  $id: X_,
  description: q_,
  type: z_,
  required: J_,
  properties: j_,
  additionalProperties: Y_
};
var jh = {}, Lc = { exports: {} };
const Ax = {
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
var ex = {
  HEX: Ax
};
const { HEX: tx } = ex;
function Nv(A) {
  if (Kv(A, ".") < 3)
    return { host: A, isIPV4: !1 };
  const e = A.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u) || [], [t] = e;
  return t ? { host: rx(t, "."), isIPV4: !0 } : { host: A, isIPV4: !1 };
}
function zd(A, e = !1) {
  let t = "", n = !0;
  for (const i of A) {
    if (tx[i] === void 0) return;
    i !== "0" && n === !0 && (n = !1), n || (t += i);
  }
  return e && t.length === 0 && (t = "0"), t;
}
function nx(A) {
  let e = 0;
  const t = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, l = !1, c = !1;
  function f() {
    if (i.length) {
      if (s === !1) {
        const p = zd(i);
        if (p !== void 0)
          n.push(p);
        else
          return t.error = !0, !1;
      }
      i.length = 0;
    }
    return !0;
  }
  for (let p = 0; p < A.length; p++) {
    const B = A[p];
    if (!(B === "[" || B === "]"))
      if (B === ":") {
        if (l === !0 && (c = !0), !f())
          break;
        if (e++, n.push(":"), e > 7) {
          t.error = !0;
          break;
        }
        p - 1 >= 0 && A[p - 1] === ":" && (l = !0);
        continue;
      } else if (B === "%") {
        if (!f())
          break;
        s = !0;
      } else {
        i.push(B);
        continue;
      }
  }
  return i.length && (s ? t.zone = i.join("") : c ? n.push(i.join("")) : n.push(zd(i))), t.address = n.join(""), t;
}
function Mv(A, e = {}) {
  if (Kv(A, ":") < 2)
    return { host: A, isIPV6: !1 };
  const t = nx(A);
  if (t.error)
    return { host: A, isIPV6: !1 };
  {
    let n = t.address, i = t.address;
    return t.zone && (n += "%" + t.zone, i += "%25" + t.zone), { host: n, escapedHost: i, isIPV6: !0 };
  }
}
function rx(A, e) {
  let t = "", n = !0;
  const i = A.length;
  for (let s = 0; s < i; s++) {
    const l = A[s];
    l === "0" && n ? (s + 1 <= i && A[s + 1] === e || s + 1 === i) && (t += l, n = !1) : (l === e ? n = !0 : n = !1, t += l);
  }
  return t;
}
function Kv(A, e) {
  let t = 0;
  for (let n = 0; n < A.length; n++)
    A[n] === e && t++;
  return t;
}
const jB = /^\.\.?\//u, YB = /^\/\.(?:\/|$)/u, ZB = /^\/\.\.(?:\/|$)/u, ix = /^\/?(?:.|\n)*?(?=\/|$)/u;
function ax(A) {
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
      const t = A.match(ix);
      if (t) {
        const n = t[0];
        A = A.slice(n.length), e.push(n);
      } else
        throw new Error("Unexpected dot segment condition");
    }
  return e.join("");
}
function ox(A, e) {
  const t = e !== !0 ? escape : unescape;
  return A.scheme !== void 0 && (A.scheme = t(A.scheme)), A.userinfo !== void 0 && (A.userinfo = t(A.userinfo)), A.host !== void 0 && (A.host = t(A.host)), A.path !== void 0 && (A.path = t(A.path)), A.query !== void 0 && (A.query = t(A.query)), A.fragment !== void 0 && (A.fragment = t(A.fragment)), A;
}
function sx(A, e) {
  const t = [];
  if (A.userinfo !== void 0 && (t.push(A.userinfo), t.push("@")), A.host !== void 0) {
    let n = unescape(A.host);
    const i = Nv(n);
    if (i.isIPV4)
      n = i.host;
    else {
      const s = Mv(i.host, { isIPV4: !1 });
      s.isIPV6 === !0 ? n = `[${s.escapedHost}]` : n = A.host;
    }
    t.push(n);
  }
  return (typeof A.port == "number" || typeof A.port == "string") && (t.push(":"), t.push(String(A.port))), t.length ? t.join("") : void 0;
}
var ux = {
  recomposeAuthority: sx,
  normalizeComponentEncoding: ox,
  removeDotSegments: ax,
  normalizeIPv4: Nv,
  normalizeIPv6: Mv,
  stringArrayToHexStripped: zd
};
const lx = /^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu, cx = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Rv(A) {
  return typeof A.secure == "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss";
}
function $v(A) {
  return A.host || (A.error = A.error || "HTTP URIs must have a host."), A;
}
function Pv(A) {
  const e = String(A.scheme).toLowerCase() === "https";
  return (A.port === (e ? 443 : 80) || A.port === "") && (A.port = void 0), A.path || (A.path = "/"), A;
}
function fx(A) {
  return A.secure = Rv(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A;
}
function dx(A) {
  if ((A.port === (Rv(A) ? 443 : 80) || A.port === "") && (A.port = void 0), typeof A.secure == "boolean" && (A.scheme = A.secure ? "wss" : "ws", A.secure = void 0), A.resourceName) {
    const [e, t] = A.resourceName.split("?");
    A.path = e && e !== "/" ? e : void 0, A.query = t, A.resourceName = void 0;
  }
  return A.fragment = void 0, A;
}
function hx(A, e) {
  if (!A.path)
    return A.error = "URN can not be parsed", A;
  const t = A.path.match(cx);
  if (t) {
    const n = e.scheme || A.scheme || "urn";
    A.nid = t[1].toLowerCase(), A.nss = t[2];
    const i = `${n}:${e.nid || A.nid}`, s = Yh[i];
    A.path = void 0, s && (A = s.parse(A, e));
  } else
    A.error = A.error || "URN can not be parsed.";
  return A;
}
function px(A, e) {
  const t = e.scheme || A.scheme || "urn", n = A.nid.toLowerCase(), i = `${t}:${e.nid || n}`, s = Yh[i];
  s && (A = s.serialize(A, e));
  const l = A, c = A.nss;
  return l.path = `${n || e.nid}:${c}`, e.skipEscape = !0, l;
}
function gx(A, e) {
  const t = A;
  return t.uuid = t.nss, t.nss = void 0, !e.tolerant && (!t.uuid || !lx.test(t.uuid)) && (t.error = t.error || "UUID is not valid."), t;
}
function Bx(A) {
  const e = A;
  return e.nss = (A.uuid || "").toLowerCase(), e;
}
const kv = {
  scheme: "http",
  domainHost: !0,
  parse: $v,
  serialize: Pv
}, wx = {
  scheme: "https",
  domainHost: kv.domainHost,
  parse: $v,
  serialize: Pv
}, Pl = {
  scheme: "ws",
  domainHost: !0,
  parse: fx,
  serialize: dx
}, mx = {
  scheme: "wss",
  domainHost: Pl.domainHost,
  parse: Pl.parse,
  serialize: Pl.serialize
}, vx = {
  scheme: "urn",
  parse: hx,
  serialize: px,
  skipNormalize: !0
}, yx = {
  scheme: "urn:uuid",
  parse: gx,
  serialize: Bx,
  skipNormalize: !0
}, Yh = {
  http: kv,
  https: wx,
  ws: Pl,
  wss: mx,
  urn: vx,
  "urn:uuid": yx
};
var Cx = Yh;
const { normalizeIPv6: Qx, normalizeIPv4: Fx, removeDotSegments: as, recomposeAuthority: Ux, normalizeComponentEncoding: nl } = ux, Zh = Cx;
function Ex(A, e) {
  return typeof A == "string" ? A = fr(Vr(A, e), e) : typeof A == "object" && (A = Vr(fr(A, e), e)), A;
}
function bx(A, e, t) {
  const n = Object.assign({ scheme: "null" }, t), i = Gv(Vr(A, n), Vr(e, n), n, !0);
  return fr(i, { ...n, skipEscape: !0 });
}
function Gv(A, e, t, n) {
  const i = {};
  return n || (A = Vr(fr(A, t), t), e = Vr(fr(e, t), t)), t = t || {}, !t.tolerant && e.scheme ? (i.scheme = e.scheme, i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = as(e.path || ""), i.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = as(e.path || ""), i.query = e.query) : (e.path ? (e.path.charAt(0) === "/" ? i.path = as(e.path) : ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path ? i.path = "/" + e.path : A.path ? i.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + e.path : i.path = e.path, i.path = as(i.path)), i.query = e.query) : (i.path = A.path, e.query !== void 0 ? i.query = e.query : i.query = A.query), i.userinfo = A.userinfo, i.host = A.host, i.port = A.port), i.scheme = A.scheme), i.fragment = e.fragment, i;
}
function _x(A, e, t) {
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
  }, n = Object.assign({}, e), i = [], s = Zh[(n.scheme || t.scheme || "").toLowerCase()];
  s && s.serialize && s.serialize(t, n), t.path !== void 0 && (n.skipEscape ? t.path = unescape(t.path) : (t.path = escape(t.path), t.scheme !== void 0 && (t.path = t.path.split("%3A").join(":")))), n.reference !== "suffix" && t.scheme && (i.push(t.scheme), i.push(":"));
  const l = Ux(t, n);
  if (l !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(l), t.path && t.path.charAt(0) !== "/" && i.push("/")), t.path !== void 0) {
    let c = t.path;
    !n.absolutePath && (!s || !s.absolutePath) && (c = as(c)), l === void 0 && (c = c.replace(/^\/\//u, "/%2F")), i.push(c);
  }
  return t.query !== void 0 && (i.push("?"), i.push(t.query)), t.fragment !== void 0 && (i.push("#"), i.push(t.fragment)), i.join("");
}
const xx = Array.from({ length: 127 }, (A, e) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));
function Ix(A) {
  let e = 0;
  for (let t = 0, n = A.length; t < n; ++t)
    if (e = A.charCodeAt(t), e > 126 || xx[e])
      return !0;
  return !1;
}
const Hx = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
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
  let s = !1;
  t.reference === "suffix" && (A = (t.scheme ? t.scheme + ":" : "") + "//" + A);
  const l = A.match(Hx);
  if (l) {
    if (n.scheme = l[1], n.userinfo = l[3], n.host = l[4], n.port = parseInt(l[5], 10), n.path = l[6] || "", n.query = l[7], n.fragment = l[8], isNaN(n.port) && (n.port = l[5]), n.host) {
      const f = Fx(n.host);
      if (f.isIPV4 === !1) {
        const p = Qx(f.host, { isIPV4: !1 });
        n.host = p.host.toLowerCase(), s = p.isIPV6;
      } else
        n.host = f.host, s = !0;
    }
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && !n.path && n.query === void 0 ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", t.reference && t.reference !== "suffix" && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
    const c = Zh[(t.scheme || n.scheme || "").toLowerCase()];
    if (!t.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (t.domainHost || c && c.domainHost) && s === !1 && Ix(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (f) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + f;
      }
    (!c || c && !c.skipNormalize) && (i && n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), i && n.userinfo !== void 0 && (n.userinfo = unescape(n.userinfo)), i && n.host !== void 0 && (n.host = unescape(n.host)), n.path !== void 0 && n.path.length && (n.path = escape(unescape(n.path))), n.fragment !== void 0 && n.fragment.length && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), c && c.parse && c.parse(n, t);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Ap = {
  SCHEMES: Zh,
  normalize: Ex,
  resolve: bx,
  resolveComponents: Gv,
  equal: _x,
  serialize: fr,
  parse: Vr
};
Lc.exports = Ap;
Lc.exports.default = Ap;
Lc.exports.fastUri = Ap;
var Sx = Lc.exports;
Object.defineProperty(jh, "__esModule", { value: !0 });
const Vv = Sx;
Vv.code = 'require("ajv/dist/runtime/uri").default';
jh.default = Vv;
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
  const n = ks, i = go, s = aa, l = en, c = we, f = Ut, p = dt, B = KA, w = Z_, v = jh, Q = (aA, T) => new RegExp(aA, T);
  Q.code = "new RegExp";
  const u = ["removeAdditional", "useDefaults", "coerceTypes"], U = /* @__PURE__ */ new Set([
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
  ]), b = {
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
  }, E = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, D = 200;
  function R(aA) {
    var T, eA, J, L, $, rA, FA, UA, zA, ne, JA, $A, sA, vA, bA, te, me, Ue, Ze, Te, ke, Ke, _e, Mt, bt;
    const Kt = aA.strict, _t = (T = aA.code) === null || T === void 0 ? void 0 : T.optimize, mt = _t === !0 || _t === void 0 ? 1 : _t || 0, dn = (J = (eA = aA.code) === null || eA === void 0 ? void 0 : eA.regExp) !== null && J !== void 0 ? J : Q, vr = (L = aA.uriResolver) !== null && L !== void 0 ? L : v.default;
    return {
      strictSchema: (rA = ($ = aA.strictSchema) !== null && $ !== void 0 ? $ : Kt) !== null && rA !== void 0 ? rA : !0,
      strictNumbers: (UA = (FA = aA.strictNumbers) !== null && FA !== void 0 ? FA : Kt) !== null && UA !== void 0 ? UA : !0,
      strictTypes: (ne = (zA = aA.strictTypes) !== null && zA !== void 0 ? zA : Kt) !== null && ne !== void 0 ? ne : "log",
      strictTuples: ($A = (JA = aA.strictTuples) !== null && JA !== void 0 ? JA : Kt) !== null && $A !== void 0 ? $A : "log",
      strictRequired: (vA = (sA = aA.strictRequired) !== null && sA !== void 0 ? sA : Kt) !== null && vA !== void 0 ? vA : !1,
      code: aA.code ? { ...aA.code, optimize: mt, regExp: dn } : { optimize: mt, regExp: dn },
      loopRequired: (bA = aA.loopRequired) !== null && bA !== void 0 ? bA : D,
      loopEnum: (te = aA.loopEnum) !== null && te !== void 0 ? te : D,
      meta: (me = aA.meta) !== null && me !== void 0 ? me : !0,
      messages: (Ue = aA.messages) !== null && Ue !== void 0 ? Ue : !0,
      inlineRefs: (Ze = aA.inlineRefs) !== null && Ze !== void 0 ? Ze : !0,
      schemaId: (Te = aA.schemaId) !== null && Te !== void 0 ? Te : "$id",
      addUsedSchema: (ke = aA.addUsedSchema) !== null && ke !== void 0 ? ke : !0,
      validateSchema: (Ke = aA.validateSchema) !== null && Ke !== void 0 ? Ke : !0,
      validateFormats: (_e = aA.validateFormats) !== null && _e !== void 0 ? _e : !0,
      unicodeRegExp: (Mt = aA.unicodeRegExp) !== null && Mt !== void 0 ? Mt : !0,
      int32range: (bt = aA.int32range) !== null && bt !== void 0 ? bt : !0,
      uriResolver: vr
    };
  }
  class x {
    constructor(T = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), T = this.opts = { ...T, ...R(T) };
      const { es5: eA, lines: J } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: U, es5: eA, lines: J }), this.logger = NA(T.logger);
      const L = T.validateFormats;
      T.validateFormats = !1, this.RULES = (0, s.getRules)(), K.call(this, b, T, "NOT SUPPORTED"), K.call(this, E, T, "DEPRECATED", "warn"), this._metaOpts = wA.call(this), T.formats && dA.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), T.keywords && cA.call(this, T.keywords), typeof T.meta == "object" && this.addMetaSchema(T.meta), Y.call(this), T.validateFormats = L;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: T, meta: eA, schemaId: J } = this.opts;
      let L = w;
      J === "id" && (L = { ...w }, L.id = L.$id, delete L.$id), eA && T && this.addMetaSchema(L, L[J], !1);
    }
    defaultMeta() {
      const { meta: T, schemaId: eA } = this.opts;
      return this.opts.defaultMeta = typeof T == "object" ? T[eA] || T : void 0;
    }
    validate(T, eA) {
      let J;
      if (typeof T == "string") {
        if (J = this.getSchema(T), !J)
          throw new Error(`no schema with key or ref "${T}"`);
      } else
        J = this.compile(T);
      const L = J(eA);
      return "$async" in J || (this.errors = J.errors), L;
    }
    compile(T, eA) {
      const J = this._addSchema(T, eA);
      return J.validate || this._compileSchemaEnv(J);
    }
    compileAsync(T, eA) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: J } = this.opts;
      return L.call(this, T, eA);
      async function L(ne, JA) {
        await $.call(this, ne.$schema);
        const $A = this._addSchema(ne, JA);
        return $A.validate || rA.call(this, $A);
      }
      async function $(ne) {
        ne && !this.getSchema(ne) && await L.call(this, { $ref: ne }, !0);
      }
      async function rA(ne) {
        try {
          return this._compileSchemaEnv(ne);
        } catch (JA) {
          if (!(JA instanceof i.default))
            throw JA;
          return FA.call(this, JA), await UA.call(this, JA.missingSchema), rA.call(this, ne);
        }
      }
      function FA({ missingSchema: ne, missingRef: JA }) {
        if (this.refs[ne])
          throw new Error(`AnySchema ${ne} is loaded but ${JA} cannot be resolved`);
      }
      async function UA(ne) {
        const JA = await zA.call(this, ne);
        this.refs[ne] || await $.call(this, JA.$schema), this.refs[ne] || this.addSchema(JA, ne, eA);
      }
      async function zA(ne) {
        const JA = this._loading[ne];
        if (JA)
          return JA;
        try {
          return await (this._loading[ne] = J(ne));
        } finally {
          delete this._loading[ne];
        }
      }
    }
    // Adds schema to the instance
    addSchema(T, eA, J, L = this.opts.validateSchema) {
      if (Array.isArray(T)) {
        for (const rA of T)
          this.addSchema(rA, void 0, J, L);
        return this;
      }
      let $;
      if (typeof T == "object") {
        const { schemaId: rA } = this.opts;
        if ($ = T[rA], $ !== void 0 && typeof $ != "string")
          throw new Error(`schema ${rA} must be string`);
      }
      return eA = (0, f.normalizeId)(eA || $), this._checkUnique(eA), this.schemas[eA] = this._addSchema(T, J, eA, L, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(T, eA, J = this.opts.validateSchema) {
      return this.addSchema(T, eA, !0, J), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(T, eA) {
      if (typeof T == "boolean")
        return !0;
      let J;
      if (J = T.$schema, J !== void 0 && typeof J != "string")
        throw new Error("$schema must be a string");
      if (J = J || this.opts.defaultMeta || this.defaultMeta(), !J)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const L = this.validate(J, T);
      if (!L && eA) {
        const $ = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error($);
        else
          throw new Error($);
      }
      return L;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(T) {
      let eA;
      for (; typeof (eA = k.call(this, T)) == "string"; )
        T = eA;
      if (eA === void 0) {
        const { schemaId: J } = this.opts, L = new l.SchemaEnv({ schema: {}, schemaId: J });
        if (eA = l.resolveSchema.call(this, L, T), !eA)
          return;
        this.refs[T] = eA;
      }
      return eA.validate || this._compileSchemaEnv(eA);
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
          const eA = k.call(this, T);
          return typeof eA == "object" && this._cache.delete(eA.schema), delete this.schemas[T], delete this.refs[T], this;
        }
        case "object": {
          const eA = T;
          this._cache.delete(eA);
          let J = T[this.opts.schemaId];
          return J && (J = (0, f.normalizeId)(J), delete this.schemas[J], delete this.refs[J]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(T) {
      for (const eA of T)
        this.addKeyword(eA);
      return this;
    }
    addKeyword(T, eA) {
      let J;
      if (typeof T == "string")
        J = T, typeof eA == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), eA.keyword = J);
      else if (typeof T == "object" && eA === void 0) {
        if (eA = T, J = eA.keyword, Array.isArray(J) && !J.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (X.call(this, J, eA), !eA)
        return (0, B.eachItem)(J, ($) => CA.call(this, $)), this;
      fA.call(this, eA);
      const L = {
        ...eA,
        type: (0, p.getJSONTypes)(eA.type),
        schemaType: (0, p.getJSONTypes)(eA.schemaType)
      };
      return (0, B.eachItem)(J, L.type.length === 0 ? ($) => CA.call(this, $, L) : ($) => L.type.forEach((rA) => CA.call(this, $, L, rA))), this;
    }
    getKeyword(T) {
      const eA = this.RULES.all[T];
      return typeof eA == "object" ? eA.definition : !!eA;
    }
    // Remove keyword
    removeKeyword(T) {
      const { RULES: eA } = this;
      delete eA.keywords[T], delete eA.all[T];
      for (const J of eA.rules) {
        const L = J.rules.findIndex(($) => $.keyword === T);
        L >= 0 && J.rules.splice(L, 1);
      }
      return this;
    }
    // Add format
    addFormat(T, eA) {
      return typeof eA == "string" && (eA = new RegExp(eA)), this.formats[T] = eA, this;
    }
    errorsText(T = this.errors, { separator: eA = ", ", dataVar: J = "data" } = {}) {
      return !T || T.length === 0 ? "No errors" : T.map((L) => `${J}${L.instancePath} ${L.message}`).reduce((L, $) => L + eA + $);
    }
    $dataMetaSchema(T, eA) {
      const J = this.RULES.all;
      T = JSON.parse(JSON.stringify(T));
      for (const L of eA) {
        const $ = L.split("/").slice(1);
        let rA = T;
        for (const FA of $)
          rA = rA[FA];
        for (const FA in J) {
          const UA = J[FA];
          if (typeof UA != "object")
            continue;
          const { $data: zA } = UA.definition, ne = rA[FA];
          zA && ne && (rA[FA] = IA(ne));
        }
      }
      return T;
    }
    _removeAllSchemas(T, eA) {
      for (const J in T) {
        const L = T[J];
        (!eA || eA.test(J)) && (typeof L == "string" ? delete T[J] : L && !L.meta && (this._cache.delete(L.schema), delete T[J]));
      }
    }
    _addSchema(T, eA, J, L = this.opts.validateSchema, $ = this.opts.addUsedSchema) {
      let rA;
      const { schemaId: FA } = this.opts;
      if (typeof T == "object")
        rA = T[FA];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof T != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let UA = this._cache.get(T);
      if (UA !== void 0)
        return UA;
      J = (0, f.normalizeId)(rA || J);
      const zA = f.getSchemaRefs.call(this, T, J);
      return UA = new l.SchemaEnv({ schema: T, schemaId: FA, meta: eA, baseId: J, localRefs: zA }), this._cache.set(UA.schema, UA), $ && !J.startsWith("#") && (J && this._checkUnique(J), this.refs[J] = UA), L && this.validateSchema(T, !0), UA;
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
      const eA = this.opts;
      this.opts = this._metaOpts;
      try {
        l.compileSchema.call(this, T);
      } finally {
        this.opts = eA;
      }
    }
  }
  x.ValidationError = n.default, x.MissingRefError = i.default, A.default = x;
  function K(aA, T, eA, J = "error") {
    for (const L in aA) {
      const $ = L;
      $ in T && this.logger[J](`${eA}: option ${L}. ${aA[$]}`);
    }
  }
  function k(aA) {
    return aA = (0, f.normalizeId)(aA), this.schemas[aA] || this.refs[aA];
  }
  function Y() {
    const aA = this.opts.schemas;
    if (aA)
      if (Array.isArray(aA))
        this.addSchema(aA);
      else
        for (const T in aA)
          this.addSchema(aA[T], T);
  }
  function dA() {
    for (const aA in this.opts.formats) {
      const T = this.opts.formats[aA];
      T && this.addFormat(aA, T);
    }
  }
  function cA(aA) {
    if (Array.isArray(aA)) {
      this.addVocabulary(aA);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const T in aA) {
      const eA = aA[T];
      eA.keyword || (eA.keyword = T), this.addKeyword(eA);
    }
  }
  function wA() {
    const aA = { ...this.opts };
    for (const T of u)
      delete aA[T];
    return aA;
  }
  const EA = { log() {
  }, warn() {
  }, error() {
  } };
  function NA(aA) {
    if (aA === !1)
      return EA;
    if (aA === void 0)
      return console;
    if (aA.log && aA.warn && aA.error)
      return aA;
    throw new Error("logger must implement log, warn and error methods");
  }
  const xA = /^[a-z_$][a-z0-9_$:-]*$/i;
  function X(aA, T) {
    const { RULES: eA } = this;
    if ((0, B.eachItem)(aA, (J) => {
      if (eA.keywords[J])
        throw new Error(`Keyword ${J} is already defined`);
      if (!xA.test(J))
        throw new Error(`Keyword ${J} has invalid name`);
    }), !!T && T.$data && !("code" in T || "validate" in T))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function CA(aA, T, eA) {
    var J;
    const L = T == null ? void 0 : T.post;
    if (eA && L)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: $ } = this;
    let rA = L ? $.post : $.rules.find(({ type: UA }) => UA === eA);
    if (rA || (rA = { type: eA, rules: [] }, $.rules.push(rA)), $.keywords[aA] = !0, !T)
      return;
    const FA = {
      keyword: aA,
      definition: {
        ...T,
        type: (0, p.getJSONTypes)(T.type),
        schemaType: (0, p.getJSONTypes)(T.schemaType)
      }
    };
    T.before ? tA.call(this, rA, FA, T.before) : rA.rules.push(FA), $.all[aA] = FA, (J = T.implements) === null || J === void 0 || J.forEach((UA) => this.addKeyword(UA));
  }
  function tA(aA, T, eA) {
    const J = aA.rules.findIndex((L) => L.keyword === eA);
    J >= 0 ? aA.rules.splice(J, 0, T) : (aA.rules.push(T), this.logger.warn(`rule ${eA} is not defined`));
  }
  function fA(aA) {
    let { metaSchema: T } = aA;
    T !== void 0 && (aA.$data && this.opts.$data && (T = IA(T)), aA.validateSchema = this.compile(T, !0));
  }
  const _A = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function IA(aA) {
    return { anyOf: [aA, _A] };
  }
})(rv);
var ep = {}, tp = {}, np = {};
Object.defineProperty(np, "__esModule", { value: !0 });
const Lx = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
np.default = Lx;
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.callRef = oa.getValidate = void 0;
const Tx = go, Aw = Be, Zt = we, Na = gr, ew = en, rl = KA, Dx = {
  keyword: "$ref",
  schemaType: "string",
  code(A) {
    const { gen: e, schema: t, it: n } = A, { baseId: i, schemaEnv: s, validateName: l, opts: c, self: f } = n, { root: p } = s;
    if ((t === "#" || t === "#/") && i === p.baseId)
      return w();
    const B = ew.resolveRef.call(f, p, i, t);
    if (B === void 0)
      throw new Tx.default(n.opts.uriResolver, i, t);
    if (B instanceof ew.SchemaEnv)
      return v(B);
    return Q(B);
    function w() {
      if (s === p)
        return kl(A, l, s, s.$async);
      const u = e.scopeValue("root", { ref: p });
      return kl(A, (0, Zt._)`${u}.validate`, p, p.$async);
    }
    function v(u) {
      const U = Wv(A, u);
      kl(A, U, u, u.$async);
    }
    function Q(u) {
      const U = e.scopeValue("schema", c.code.source === !0 ? { ref: u, code: (0, Zt.stringify)(u) } : { ref: u }), b = e.name("valid"), E = A.subschema({
        schema: u,
        dataTypes: [],
        schemaPath: Zt.nil,
        topSchemaRef: U,
        errSchemaPath: t
      }, b);
      A.mergeEvaluated(E), A.ok(b);
    }
  }
};
function Wv(A, e) {
  const { gen: t } = A;
  return e.validate ? t.scopeValue("validate", { ref: e.validate }) : (0, Zt._)`${t.scopeValue("wrapper", { ref: e })}.validate`;
}
oa.getValidate = Wv;
function kl(A, e, t, n) {
  const { gen: i, it: s } = A, { allErrors: l, schemaEnv: c, opts: f } = s, p = f.passContext ? Na.default.this : Zt.nil;
  n ? B() : w();
  function B() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const u = i.let("valid");
    i.try(() => {
      i.code((0, Zt._)`await ${(0, Aw.callValidateCode)(A, e, p)}`), Q(e), l || i.assign(u, !0);
    }, (U) => {
      i.if((0, Zt._)`!(${U} instanceof ${s.ValidationError})`, () => i.throw(U)), v(U), l || i.assign(u, !1);
    }), A.ok(u);
  }
  function w() {
    A.result((0, Aw.callValidateCode)(A, e, p), () => Q(e), () => v(e));
  }
  function v(u) {
    const U = (0, Zt._)`${u}.errors`;
    i.assign(Na.default.vErrors, (0, Zt._)`${Na.default.vErrors} === null ? ${U} : ${Na.default.vErrors}.concat(${U})`), i.assign(Na.default.errors, (0, Zt._)`${Na.default.vErrors}.length`);
  }
  function Q(u) {
    var U;
    if (!s.opts.unevaluated)
      return;
    const b = (U = t == null ? void 0 : t.validate) === null || U === void 0 ? void 0 : U.evaluated;
    if (s.props !== !0)
      if (b && !b.dynamicProps)
        b.props !== void 0 && (s.props = rl.mergeEvaluated.props(i, b.props, s.props));
      else {
        const E = i.var("props", (0, Zt._)`${u}.evaluated.props`);
        s.props = rl.mergeEvaluated.props(i, E, s.props, Zt.Name);
      }
    if (s.items !== !0)
      if (b && !b.dynamicItems)
        b.items !== void 0 && (s.items = rl.mergeEvaluated.items(i, b.items, s.items));
      else {
        const E = i.var("items", (0, Zt._)`${u}.evaluated.items`);
        s.items = rl.mergeEvaluated.items(i, E, s.items, Zt.Name);
      }
  }
}
oa.callRef = kl;
oa.default = Dx;
Object.defineProperty(tp, "__esModule", { value: !0 });
const Ox = np, Nx = oa, Mx = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Ox.default,
  Nx.default
];
tp.default = Mx;
var rp = {}, ip = {};
Object.defineProperty(ip, "__esModule", { value: !0 });
const nc = we, pi = nc.operators, rc = {
  maximum: { okStr: "<=", ok: pi.LTE, fail: pi.GT },
  minimum: { okStr: ">=", ok: pi.GTE, fail: pi.LT },
  exclusiveMaximum: { okStr: "<", ok: pi.LT, fail: pi.GTE },
  exclusiveMinimum: { okStr: ">", ok: pi.GT, fail: pi.LTE }
}, Kx = {
  message: ({ keyword: A, schemaCode: e }) => (0, nc.str)`must be ${rc[A].okStr} ${e}`,
  params: ({ keyword: A, schemaCode: e }) => (0, nc._)`{comparison: ${rc[A].okStr}, limit: ${e}}`
}, Rx = {
  keyword: Object.keys(rc),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Kx,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A;
    A.fail$data((0, nc._)`${t} ${rc[e].fail} ${n} || isNaN(${t})`);
  }
};
ip.default = Rx;
var ap = {};
Object.defineProperty(ap, "__esModule", { value: !0 });
const ws = we, $x = {
  message: ({ schemaCode: A }) => (0, ws.str)`must be multiple of ${A}`,
  params: ({ schemaCode: A }) => (0, ws._)`{multipleOf: ${A}}`
}, Px = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: $x,
  code(A) {
    const { gen: e, data: t, schemaCode: n, it: i } = A, s = i.opts.multipleOfPrecision, l = e.let("res"), c = s ? (0, ws._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${s}` : (0, ws._)`${l} !== parseInt(${l})`;
    A.fail$data((0, ws._)`(${n} === 0 || (${l} = ${t}/${n}, ${c}))`);
  }
};
ap.default = Px;
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
const ji = we, kx = KA, Gx = sp, Vx = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxLength" ? "more" : "fewer";
    return (0, ji.str)`must NOT have ${t} than ${e} characters`;
  },
  params: ({ schemaCode: A }) => (0, ji._)`{limit: ${A}}`
}, Wx = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Vx,
  code(A) {
    const { keyword: e, data: t, schemaCode: n, it: i } = A, s = e === "maxLength" ? ji.operators.GT : ji.operators.LT, l = i.opts.unicode === !1 ? (0, ji._)`${t}.length` : (0, ji._)`${(0, kx.useFunc)(A.gen, Gx.default)}(${t})`;
    A.fail$data((0, ji._)`${l} ${s} ${n}`);
  }
};
op.default = Wx;
var up = {};
Object.defineProperty(up, "__esModule", { value: !0 });
const Xx = Be, ic = we, qx = {
  message: ({ schemaCode: A }) => (0, ic.str)`must match pattern "${A}"`,
  params: ({ schemaCode: A }) => (0, ic._)`{pattern: ${A}}`
}, zx = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: qx,
  code(A) {
    const { data: e, $data: t, schema: n, schemaCode: i, it: s } = A, l = s.opts.unicodeRegExp ? "u" : "", c = t ? (0, ic._)`(new RegExp(${i}, ${l}))` : (0, Xx.usePattern)(A, n);
    A.fail$data((0, ic._)`!${c}.test(${e})`);
  }
};
up.default = zx;
var lp = {};
Object.defineProperty(lp, "__esModule", { value: !0 });
const ms = we, Jx = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxProperties" ? "more" : "fewer";
    return (0, ms.str)`must NOT have ${t} than ${e} properties`;
  },
  params: ({ schemaCode: A }) => (0, ms._)`{limit: ${A}}`
}, jx = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Jx,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxProperties" ? ms.operators.GT : ms.operators.LT;
    A.fail$data((0, ms._)`Object.keys(${t}).length ${i} ${n}`);
  }
};
lp.default = jx;
var cp = {};
Object.defineProperty(cp, "__esModule", { value: !0 });
const Yo = Be, vs = we, Yx = KA, Zx = {
  message: ({ params: { missingProperty: A } }) => (0, vs.str)`must have required property '${A}'`,
  params: ({ params: { missingProperty: A } }) => (0, vs._)`{missingProperty: ${A}}`
}, AI = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Zx,
  code(A) {
    const { gen: e, schema: t, schemaCode: n, data: i, $data: s, it: l } = A, { opts: c } = l;
    if (!s && t.length === 0)
      return;
    const f = t.length >= c.loopRequired;
    if (l.allErrors ? p() : B(), c.strictRequired) {
      const Q = A.parentSchema.properties, { definedProperties: u } = A.it;
      for (const U of t)
        if ((Q == null ? void 0 : Q[U]) === void 0 && !u.has(U)) {
          const b = l.schemaEnv.baseId + l.errSchemaPath, E = `required property "${U}" is not defined at "${b}" (strictRequired)`;
          (0, Yx.checkStrictMode)(l, E, l.opts.strictRequired);
        }
    }
    function p() {
      if (f || s)
        A.block$data(vs.nil, w);
      else
        for (const Q of t)
          (0, Yo.checkReportMissingProp)(A, Q);
    }
    function B() {
      const Q = e.let("missing");
      if (f || s) {
        const u = e.let("valid", !0);
        A.block$data(u, () => v(Q, u)), A.ok(u);
      } else
        e.if((0, Yo.checkMissingProp)(A, t, Q)), (0, Yo.reportMissingProp)(A, Q), e.else();
    }
    function w() {
      e.forOf("prop", n, (Q) => {
        A.setParams({ missingProperty: Q }), e.if((0, Yo.noPropertyInData)(e, i, Q, c.ownProperties), () => A.error());
      });
    }
    function v(Q, u) {
      A.setParams({ missingProperty: Q }), e.forOf(Q, n, () => {
        e.assign(u, (0, Yo.propertyInData)(e, i, Q, c.ownProperties)), e.if((0, vs.not)(u), () => {
          A.error(), e.break();
        });
      }, vs.nil);
    }
  }
};
cp.default = AI;
var fp = {};
Object.defineProperty(fp, "__esModule", { value: !0 });
const ys = we, eI = {
  message({ keyword: A, schemaCode: e }) {
    const t = A === "maxItems" ? "more" : "fewer";
    return (0, ys.str)`must NOT have ${t} than ${e} items`;
  },
  params: ({ schemaCode: A }) => (0, ys._)`{limit: ${A}}`
}, tI = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: eI,
  code(A) {
    const { keyword: e, data: t, schemaCode: n } = A, i = e === "maxItems" ? ys.operators.GT : ys.operators.LT;
    A.fail$data((0, ys._)`${t}.length ${i} ${n}`);
  }
};
fp.default = tI;
var dp = {}, Gs = {};
Object.defineProperty(Gs, "__esModule", { value: !0 });
const qv = vv;
qv.code = 'require("ajv/dist/runtime/equal").default';
Gs.default = qv;
Object.defineProperty(dp, "__esModule", { value: !0 });
const dd = dt, Qt = we, nI = KA, rI = Gs, iI = {
  message: ({ params: { i: A, j: e } }) => (0, Qt.str)`must NOT have duplicate items (items ## ${e} and ${A} are identical)`,
  params: ({ params: { i: A, j: e } }) => (0, Qt._)`{i: ${A}, j: ${e}}`
}, aI = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: iI,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, parentSchema: s, schemaCode: l, it: c } = A;
    if (!n && !i)
      return;
    const f = e.let("valid"), p = s.items ? (0, dd.getSchemaTypes)(s.items) : [];
    A.block$data(f, B, (0, Qt._)`${l} === false`), A.ok(f);
    function B() {
      const u = e.let("i", (0, Qt._)`${t}.length`), U = e.let("j");
      A.setParams({ i: u, j: U }), e.assign(f, !0), e.if((0, Qt._)`${u} > 1`, () => (w() ? v : Q)(u, U));
    }
    function w() {
      return p.length > 0 && !p.some((u) => u === "object" || u === "array");
    }
    function v(u, U) {
      const b = e.name("item"), E = (0, dd.checkDataTypes)(p, b, c.opts.strictNumbers, dd.DataType.Wrong), D = e.const("indices", (0, Qt._)`{}`);
      e.for((0, Qt._)`;${u}--;`, () => {
        e.let(b, (0, Qt._)`${t}[${u}]`), e.if(E, (0, Qt._)`continue`), p.length > 1 && e.if((0, Qt._)`typeof ${b} == "string"`, (0, Qt._)`${b} += "_"`), e.if((0, Qt._)`typeof ${D}[${b}] == "number"`, () => {
          e.assign(U, (0, Qt._)`${D}[${b}]`), A.error(), e.assign(f, !1).break();
        }).code((0, Qt._)`${D}[${b}] = ${u}`);
      });
    }
    function Q(u, U) {
      const b = (0, nI.useFunc)(e, rI.default), E = e.name("outer");
      e.label(E).for((0, Qt._)`;${u}--;`, () => e.for((0, Qt._)`${U} = ${u}; ${U}--;`, () => e.if((0, Qt._)`${b}(${t}[${u}], ${t}[${U}])`, () => {
        A.error(), e.assign(f, !1).break(E);
      })));
    }
  }
};
dp.default = aI;
var hp = {};
Object.defineProperty(hp, "__esModule", { value: !0 });
const Jd = we, oI = KA, sI = Gs, uI = {
  message: "must be equal to constant",
  params: ({ schemaCode: A }) => (0, Jd._)`{allowedValue: ${A}}`
}, lI = {
  keyword: "const",
  $data: !0,
  error: uI,
  code(A) {
    const { gen: e, data: t, $data: n, schemaCode: i, schema: s } = A;
    n || s && typeof s == "object" ? A.fail$data((0, Jd._)`!${(0, oI.useFunc)(e, sI.default)}(${t}, ${i})`) : A.fail((0, Jd._)`${s} !== ${t}`);
  }
};
hp.default = lI;
var pp = {};
Object.defineProperty(pp, "__esModule", { value: !0 });
const os = we, cI = KA, fI = Gs, dI = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: A }) => (0, os._)`{allowedValues: ${A}}`
}, hI = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: dI,
  code(A) {
    const { gen: e, data: t, $data: n, schema: i, schemaCode: s, it: l } = A;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const c = i.length >= l.opts.loopEnum;
    let f;
    const p = () => f ?? (f = (0, cI.useFunc)(e, fI.default));
    let B;
    if (c || n)
      B = e.let("valid"), A.block$data(B, w);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const Q = e.const("vSchema", s);
      B = (0, os.or)(...i.map((u, U) => v(Q, U)));
    }
    A.pass(B);
    function w() {
      e.assign(B, !1), e.forOf("v", s, (Q) => e.if((0, os._)`${p()}(${t}, ${Q})`, () => e.assign(B, !0).break()));
    }
    function v(Q, u) {
      const U = i[u];
      return typeof U == "object" && U !== null ? (0, os._)`${p()}(${t}, ${Q}[${u}])` : (0, os._)`${t} === ${U}`;
    }
  }
};
pp.default = hI;
Object.defineProperty(rp, "__esModule", { value: !0 });
const pI = ip, gI = ap, BI = op, wI = up, mI = lp, vI = cp, yI = fp, CI = dp, QI = hp, FI = pp, UI = [
  // number
  pI.default,
  gI.default,
  // string
  BI.default,
  wI.default,
  // object
  mI.default,
  vI.default,
  // array
  yI.default,
  CI.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  QI.default,
  FI.default
];
rp.default = UI;
var gp = {}, Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.validateAdditionalItems = void 0;
const Yi = we, jd = KA, EI = {
  message: ({ params: { len: A } }) => (0, Yi.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, Yi._)`{limit: ${A}}`
}, bI = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: EI,
  code(A) {
    const { parentSchema: e, it: t } = A, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, jd.checkStrictMode)(t, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    zv(A, n);
  }
};
function zv(A, e) {
  const { gen: t, schema: n, data: i, keyword: s, it: l } = A;
  l.items = !0;
  const c = t.const("len", (0, Yi._)`${i}.length`);
  if (n === !1)
    A.setParams({ len: e.length }), A.pass((0, Yi._)`${c} <= ${e.length}`);
  else if (typeof n == "object" && !(0, jd.alwaysValidSchema)(l, n)) {
    const p = t.var("valid", (0, Yi._)`${c} <= ${e.length}`);
    t.if((0, Yi.not)(p), () => f(p)), A.ok(p);
  }
  function f(p) {
    t.forRange("i", e.length, c, (B) => {
      A.subschema({ keyword: s, dataProp: B, dataPropType: jd.Type.Num }, p), l.allErrors || t.if((0, Yi.not)(p), () => t.break());
    });
  }
}
Bo.validateAdditionalItems = zv;
Bo.default = bI;
var Bp = {}, wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.validateTuple = void 0;
const tw = we, Gl = KA, _I = Be, xI = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(A) {
    const { schema: e, it: t } = A;
    if (Array.isArray(e))
      return Jv(A, "additionalItems", e);
    t.items = !0, !(0, Gl.alwaysValidSchema)(t, e) && A.ok((0, _I.validateArray)(A));
  }
};
function Jv(A, e, t = A.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: l, it: c } = A;
  B(i), c.opts.unevaluated && t.length && c.items !== !0 && (c.items = Gl.mergeEvaluated.items(n, t.length, c.items));
  const f = n.name("valid"), p = n.const("len", (0, tw._)`${s}.length`);
  t.forEach((w, v) => {
    (0, Gl.alwaysValidSchema)(c, w) || (n.if((0, tw._)`${p} > ${v}`, () => A.subschema({
      keyword: l,
      schemaProp: v,
      dataProp: v
    }, f)), A.ok(f));
  });
  function B(w) {
    const { opts: v, errSchemaPath: Q } = c, u = t.length, U = u === w.minItems && (u === w.maxItems || w[e] === !1);
    if (v.strictTuples && !U) {
      const b = `"${l}" is ${u}-tuple, but minItems or maxItems/${e} are not specified or different at path "${Q}"`;
      (0, Gl.checkStrictMode)(c, b, v.strictTuples);
    }
  }
}
wo.validateTuple = Jv;
wo.default = xI;
Object.defineProperty(Bp, "__esModule", { value: !0 });
const II = wo, HI = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (A) => (0, II.validateTuple)(A, "items")
};
Bp.default = HI;
var wp = {};
Object.defineProperty(wp, "__esModule", { value: !0 });
const nw = we, SI = KA, LI = Be, TI = Bo, DI = {
  message: ({ params: { len: A } }) => (0, nw.str)`must NOT have more than ${A} items`,
  params: ({ params: { len: A } }) => (0, nw._)`{limit: ${A}}`
}, OI = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: DI,
  code(A) {
    const { schema: e, parentSchema: t, it: n } = A, { prefixItems: i } = t;
    n.items = !0, !(0, SI.alwaysValidSchema)(n, e) && (i ? (0, TI.validateAdditionalItems)(A, i) : A.ok((0, LI.validateArray)(A)));
  }
};
wp.default = OI;
var mp = {};
Object.defineProperty(mp, "__esModule", { value: !0 });
const Cn = we, il = KA, NI = {
  message: ({ params: { min: A, max: e } }) => e === void 0 ? (0, Cn.str)`must contain at least ${A} valid item(s)` : (0, Cn.str)`must contain at least ${A} and no more than ${e} valid item(s)`,
  params: ({ params: { min: A, max: e } }) => e === void 0 ? (0, Cn._)`{minContains: ${A}}` : (0, Cn._)`{minContains: ${A}, maxContains: ${e}}`
}, MI = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: NI,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: s } = A;
    let l, c;
    const { minContains: f, maxContains: p } = n;
    s.opts.next ? (l = f === void 0 ? 1 : f, c = p) : l = 1;
    const B = e.const("len", (0, Cn._)`${i}.length`);
    if (A.setParams({ min: l, max: c }), c === void 0 && l === 0) {
      (0, il.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && l > c) {
      (0, il.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), A.fail();
      return;
    }
    if ((0, il.alwaysValidSchema)(s, t)) {
      let U = (0, Cn._)`${B} >= ${l}`;
      c !== void 0 && (U = (0, Cn._)`${U} && ${B} <= ${c}`), A.pass(U);
      return;
    }
    s.items = !0;
    const w = e.name("valid");
    c === void 0 && l === 1 ? Q(w, () => e.if(w, () => e.break())) : l === 0 ? (e.let(w, !0), c !== void 0 && e.if((0, Cn._)`${i}.length > 0`, v)) : (e.let(w, !1), v()), A.result(w, () => A.reset());
    function v() {
      const U = e.name("_valid"), b = e.let("count", 0);
      Q(U, () => e.if(U, () => u(b)));
    }
    function Q(U, b) {
      e.forRange("i", 0, B, (E) => {
        A.subschema({
          keyword: "contains",
          dataProp: E,
          dataPropType: il.Type.Num,
          compositeRule: !0
        }, U), b();
      });
    }
    function u(U) {
      e.code((0, Cn._)`${U}++`), c === void 0 ? e.if((0, Cn._)`${U} >= ${l}`, () => e.assign(w, !0).break()) : (e.if((0, Cn._)`${U} > ${c}`, () => e.assign(w, !1).break()), l === 1 ? e.assign(w, !0) : e.if((0, Cn._)`${U} >= ${l}`, () => e.assign(w, !0)));
    }
  }
};
mp.default = MI;
var jv = {};
(function(A) {
  Object.defineProperty(A, "__esModule", { value: !0 }), A.validateSchemaDeps = A.validatePropertyDeps = A.error = void 0;
  const e = we, t = KA, n = Be;
  A.error = {
    message: ({ params: { property: f, depsCount: p, deps: B } }) => {
      const w = p === 1 ? "property" : "properties";
      return (0, e.str)`must have ${w} ${B} when property ${f} is present`;
    },
    params: ({ params: { property: f, depsCount: p, deps: B, missingProperty: w } }) => (0, e._)`{property: ${f},
    missingProperty: ${w},
    depsCount: ${p},
    deps: ${B}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: A.error,
    code(f) {
      const [p, B] = s(f);
      l(f, p), c(f, B);
    }
  };
  function s({ schema: f }) {
    const p = {}, B = {};
    for (const w in f) {
      if (w === "__proto__")
        continue;
      const v = Array.isArray(f[w]) ? p : B;
      v[w] = f[w];
    }
    return [p, B];
  }
  function l(f, p = f.schema) {
    const { gen: B, data: w, it: v } = f;
    if (Object.keys(p).length === 0)
      return;
    const Q = B.let("missing");
    for (const u in p) {
      const U = p[u];
      if (U.length === 0)
        continue;
      const b = (0, n.propertyInData)(B, w, u, v.opts.ownProperties);
      f.setParams({
        property: u,
        depsCount: U.length,
        deps: U.join(", ")
      }), v.allErrors ? B.if(b, () => {
        for (const E of U)
          (0, n.checkReportMissingProp)(f, E);
      }) : (B.if((0, e._)`${b} && (${(0, n.checkMissingProp)(f, U, Q)})`), (0, n.reportMissingProp)(f, Q), B.else());
    }
  }
  A.validatePropertyDeps = l;
  function c(f, p = f.schema) {
    const { gen: B, data: w, keyword: v, it: Q } = f, u = B.name("valid");
    for (const U in p)
      (0, t.alwaysValidSchema)(Q, p[U]) || (B.if(
        (0, n.propertyInData)(B, w, U, Q.opts.ownProperties),
        () => {
          const b = f.subschema({ keyword: v, schemaProp: U }, u);
          f.mergeValidEvaluated(b, u);
        },
        () => B.var(u, !0)
        // TODO var
      ), f.ok(u));
  }
  A.validateSchemaDeps = c, A.default = i;
})(jv);
var vp = {};
Object.defineProperty(vp, "__esModule", { value: !0 });
const Yv = we, KI = KA, RI = {
  message: "property name must be valid",
  params: ({ params: A }) => (0, Yv._)`{propertyName: ${A.propertyName}}`
}, $I = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: RI,
  code(A) {
    const { gen: e, schema: t, data: n, it: i } = A;
    if ((0, KI.alwaysValidSchema)(i, t))
      return;
    const s = e.name("valid");
    e.forIn("key", n, (l) => {
      A.setParams({ propertyName: l }), A.subschema({
        keyword: "propertyNames",
        data: l,
        dataTypes: ["string"],
        propertyName: l,
        compositeRule: !0
      }, s), e.if((0, Yv.not)(s), () => {
        A.error(!0), i.allErrors || e.break();
      });
    }), A.ok(s);
  }
};
vp.default = $I;
var Tc = {};
Object.defineProperty(Tc, "__esModule", { value: !0 });
const al = Be, kn = we, PI = gr, ol = KA, kI = {
  message: "must NOT have additional properties",
  params: ({ params: A }) => (0, kn._)`{additionalProperty: ${A.additionalProperty}}`
}, GI = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: kI,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, errsCount: s, it: l } = A;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: f } = l;
    if (l.props = !0, f.removeAdditional !== "all" && (0, ol.alwaysValidSchema)(l, t))
      return;
    const p = (0, al.allSchemaProperties)(n.properties), B = (0, al.allSchemaProperties)(n.patternProperties);
    w(), A.ok((0, kn._)`${s} === ${PI.default.errors}`);
    function w() {
      e.forIn("key", i, (b) => {
        !p.length && !B.length ? u(b) : e.if(v(b), () => u(b));
      });
    }
    function v(b) {
      let E;
      if (p.length > 8) {
        const D = (0, ol.schemaRefOrVal)(l, n.properties, "properties");
        E = (0, al.isOwnProperty)(e, D, b);
      } else p.length ? E = (0, kn.or)(...p.map((D) => (0, kn._)`${b} === ${D}`)) : E = kn.nil;
      return B.length && (E = (0, kn.or)(E, ...B.map((D) => (0, kn._)`${(0, al.usePattern)(A, D)}.test(${b})`))), (0, kn.not)(E);
    }
    function Q(b) {
      e.code((0, kn._)`delete ${i}[${b}]`);
    }
    function u(b) {
      if (f.removeAdditional === "all" || f.removeAdditional && t === !1) {
        Q(b);
        return;
      }
      if (t === !1) {
        A.setParams({ additionalProperty: b }), A.error(), c || e.break();
        return;
      }
      if (typeof t == "object" && !(0, ol.alwaysValidSchema)(l, t)) {
        const E = e.name("valid");
        f.removeAdditional === "failing" ? (U(b, E, !1), e.if((0, kn.not)(E), () => {
          A.reset(), Q(b);
        })) : (U(b, E), c || e.if((0, kn.not)(E), () => e.break()));
      }
    }
    function U(b, E, D) {
      const R = {
        keyword: "additionalProperties",
        dataProp: b,
        dataPropType: ol.Type.Str
      };
      D === !1 && Object.assign(R, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), A.subschema(R, E);
    }
  }
};
Tc.default = GI;
var yp = {};
Object.defineProperty(yp, "__esModule", { value: !0 });
const VI = zn, rw = Be, hd = KA, iw = Tc, WI = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, parentSchema: n, data: i, it: s } = A;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && iw.default.code(new VI.KeywordCxt(s, iw.default, "additionalProperties"));
    const l = (0, rw.allSchemaProperties)(t);
    for (const w of l)
      s.definedProperties.add(w);
    s.opts.unevaluated && l.length && s.props !== !0 && (s.props = hd.mergeEvaluated.props(e, (0, hd.toHash)(l), s.props));
    const c = l.filter((w) => !(0, hd.alwaysValidSchema)(s, t[w]));
    if (c.length === 0)
      return;
    const f = e.name("valid");
    for (const w of c)
      p(w) ? B(w) : (e.if((0, rw.propertyInData)(e, i, w, s.opts.ownProperties)), B(w), s.allErrors || e.else().var(f, !0), e.endIf()), A.it.definedProperties.add(w), A.ok(f);
    function p(w) {
      return s.opts.useDefaults && !s.compositeRule && t[w].default !== void 0;
    }
    function B(w) {
      A.subschema({
        keyword: "properties",
        schemaProp: w,
        dataProp: w
      }, f);
    }
  }
};
yp.default = WI;
var Cp = {};
Object.defineProperty(Cp, "__esModule", { value: !0 });
const aw = Be, sl = we, ow = KA, sw = KA, XI = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(A) {
    const { gen: e, schema: t, data: n, parentSchema: i, it: s } = A, { opts: l } = s, c = (0, aw.allSchemaProperties)(t), f = c.filter((U) => (0, ow.alwaysValidSchema)(s, t[U]));
    if (c.length === 0 || f.length === c.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const p = l.strictSchema && !l.allowMatchingProperties && i.properties, B = e.name("valid");
    s.props !== !0 && !(s.props instanceof sl.Name) && (s.props = (0, sw.evaluatedPropsToName)(e, s.props));
    const { props: w } = s;
    v();
    function v() {
      for (const U of c)
        p && Q(U), s.allErrors ? u(U) : (e.var(B, !0), u(U), e.if(B));
    }
    function Q(U) {
      for (const b in p)
        new RegExp(U).test(b) && (0, ow.checkStrictMode)(s, `property ${b} matches pattern ${U} (use allowMatchingProperties)`);
    }
    function u(U) {
      e.forIn("key", n, (b) => {
        e.if((0, sl._)`${(0, aw.usePattern)(A, U)}.test(${b})`, () => {
          const E = f.includes(U);
          E || A.subschema({
            keyword: "patternProperties",
            schemaProp: U,
            dataProp: b,
            dataPropType: sw.Type.Str
          }, B), s.opts.unevaluated && w !== !0 ? e.assign((0, sl._)`${w}[${b}]`, !0) : !E && !s.allErrors && e.if((0, sl.not)(B), () => e.break());
        });
      });
    }
  }
};
Cp.default = XI;
var Qp = {};
Object.defineProperty(Qp, "__esModule", { value: !0 });
const qI = KA, zI = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if ((0, qI.alwaysValidSchema)(n, t)) {
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
Qp.default = zI;
var Fp = {};
Object.defineProperty(Fp, "__esModule", { value: !0 });
const JI = Be, jI = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: JI.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Fp.default = jI;
var Up = {};
Object.defineProperty(Up, "__esModule", { value: !0 });
const Vl = we, YI = KA, ZI = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: A }) => (0, Vl._)`{passingSchemas: ${A.passing}}`
}, AH = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: ZI,
  code(A) {
    const { gen: e, schema: t, parentSchema: n, it: i } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = t, l = e.let("valid", !1), c = e.let("passing", null), f = e.name("_valid");
    A.setParams({ passing: c }), e.block(p), A.result(l, () => A.reset(), () => A.error(!0));
    function p() {
      s.forEach((B, w) => {
        let v;
        (0, YI.alwaysValidSchema)(i, B) ? e.var(f, !0) : v = A.subschema({
          keyword: "oneOf",
          schemaProp: w,
          compositeRule: !0
        }, f), w > 0 && e.if((0, Vl._)`${f} && ${l}`).assign(l, !1).assign(c, (0, Vl._)`[${c}, ${w}]`).else(), e.if(f, () => {
          e.assign(l, !0), e.assign(c, w), v && A.mergeEvaluated(v, Vl.Name);
        });
      });
    }
  }
};
Up.default = AH;
var Ep = {};
Object.defineProperty(Ep, "__esModule", { value: !0 });
const eH = KA, tH = {
  keyword: "allOf",
  schemaType: "array",
  code(A) {
    const { gen: e, schema: t, it: n } = A;
    if (!Array.isArray(t))
      throw new Error("ajv implementation error");
    const i = e.name("valid");
    t.forEach((s, l) => {
      if ((0, eH.alwaysValidSchema)(n, s))
        return;
      const c = A.subschema({ keyword: "allOf", schemaProp: l }, i);
      A.ok(i), A.mergeEvaluated(c);
    });
  }
};
Ep.default = tH;
var bp = {};
Object.defineProperty(bp, "__esModule", { value: !0 });
const ac = we, Zv = KA, nH = {
  message: ({ params: A }) => (0, ac.str)`must match "${A.ifClause}" schema`,
  params: ({ params: A }) => (0, ac._)`{failingKeyword: ${A.ifClause}}`
}, rH = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: nH,
  code(A) {
    const { gen: e, parentSchema: t, it: n } = A;
    t.then === void 0 && t.else === void 0 && (0, Zv.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = uw(n, "then"), s = uw(n, "else");
    if (!i && !s)
      return;
    const l = e.let("valid", !0), c = e.name("_valid");
    if (f(), A.reset(), i && s) {
      const B = e.let("ifClause");
      A.setParams({ ifClause: B }), e.if(c, p("then", B), p("else", B));
    } else i ? e.if(c, p("then")) : e.if((0, ac.not)(c), p("else"));
    A.pass(l, () => A.error(!0));
    function f() {
      const B = A.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      A.mergeEvaluated(B);
    }
    function p(B, w) {
      return () => {
        const v = A.subschema({ keyword: B }, c);
        e.assign(l, c), A.mergeValidEvaluated(v, l), w ? e.assign(w, (0, ac._)`${B}`) : A.setParams({ ifClause: B });
      };
    }
  }
};
function uw(A, e) {
  const t = A.schema[e];
  return t !== void 0 && !(0, Zv.alwaysValidSchema)(A, t);
}
bp.default = rH;
var _p = {};
Object.defineProperty(_p, "__esModule", { value: !0 });
const iH = KA, aH = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: A, parentSchema: e, it: t }) {
    e.if === void 0 && (0, iH.checkStrictMode)(t, `"${A}" without "if" is ignored`);
  }
};
_p.default = aH;
Object.defineProperty(gp, "__esModule", { value: !0 });
const oH = Bo, sH = Bp, uH = wo, lH = wp, cH = mp, fH = jv, dH = vp, hH = Tc, pH = yp, gH = Cp, BH = Qp, wH = Fp, mH = Up, vH = Ep, yH = bp, CH = _p;
function QH(A = !1) {
  const e = [
    // any
    BH.default,
    wH.default,
    mH.default,
    vH.default,
    yH.default,
    CH.default,
    // object
    dH.default,
    hH.default,
    fH.default,
    pH.default,
    gH.default
  ];
  return A ? e.push(sH.default, lH.default) : e.push(oH.default, uH.default), e.push(cH.default), e;
}
gp.default = QH;
var xp = {}, Ip = {};
Object.defineProperty(Ip, "__esModule", { value: !0 });
const ot = we, FH = {
  message: ({ schemaCode: A }) => (0, ot.str)`must match format "${A}"`,
  params: ({ schemaCode: A }) => (0, ot._)`{format: ${A}}`
}, UH = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: FH,
  code(A, e) {
    const { gen: t, data: n, $data: i, schema: s, schemaCode: l, it: c } = A, { opts: f, errSchemaPath: p, schemaEnv: B, self: w } = c;
    if (!f.validateFormats)
      return;
    i ? v() : Q();
    function v() {
      const u = t.scopeValue("formats", {
        ref: w.formats,
        code: f.code.formats
      }), U = t.const("fDef", (0, ot._)`${u}[${l}]`), b = t.let("fType"), E = t.let("format");
      t.if((0, ot._)`typeof ${U} == "object" && !(${U} instanceof RegExp)`, () => t.assign(b, (0, ot._)`${U}.type || "string"`).assign(E, (0, ot._)`${U}.validate`), () => t.assign(b, (0, ot._)`"string"`).assign(E, U)), A.fail$data((0, ot.or)(D(), R()));
      function D() {
        return f.strictSchema === !1 ? ot.nil : (0, ot._)`${l} && !${E}`;
      }
      function R() {
        const x = B.$async ? (0, ot._)`(${U}.async ? await ${E}(${n}) : ${E}(${n}))` : (0, ot._)`${E}(${n})`, K = (0, ot._)`(typeof ${E} == "function" ? ${x} : ${E}.test(${n}))`;
        return (0, ot._)`${E} && ${E} !== true && ${b} === ${e} && !${K}`;
      }
    }
    function Q() {
      const u = w.formats[s];
      if (!u) {
        D();
        return;
      }
      if (u === !0)
        return;
      const [U, b, E] = R(u);
      U === e && A.pass(x());
      function D() {
        if (f.strictSchema === !1) {
          w.logger.warn(K());
          return;
        }
        throw new Error(K());
        function K() {
          return `unknown format "${s}" ignored in schema at path "${p}"`;
        }
      }
      function R(K) {
        const k = K instanceof RegExp ? (0, ot.regexpCode)(K) : f.code.formats ? (0, ot._)`${f.code.formats}${(0, ot.getProperty)(s)}` : void 0, Y = t.scopeValue("formats", { key: s, ref: K, code: k });
        return typeof K == "object" && !(K instanceof RegExp) ? [K.type || "string", K.validate, (0, ot._)`${Y}.validate`] : ["string", K, Y];
      }
      function x() {
        if (typeof u == "object" && !(u instanceof RegExp) && u.async) {
          if (!B.$async)
            throw new Error("async format in sync schema");
          return (0, ot._)`await ${E}(${n})`;
        }
        return typeof b == "function" ? (0, ot._)`${E}(${n})` : (0, ot._)`${E}.test(${n})`;
      }
    }
  }
};
Ip.default = UH;
Object.defineProperty(xp, "__esModule", { value: !0 });
const EH = Ip, bH = [EH.default];
xp.default = bH;
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
Object.defineProperty(ep, "__esModule", { value: !0 });
const _H = tp, xH = rp, IH = gp, HH = xp, lw = ao, SH = [
  _H.default,
  xH.default,
  (0, IH.default)(),
  HH.default,
  lw.metadataVocabulary,
  lw.contentVocabulary
];
ep.default = SH;
var Hp = {}, Dc = {};
Object.defineProperty(Dc, "__esModule", { value: !0 });
Dc.DiscrError = void 0;
var cw;
(function(A) {
  A.Tag = "tag", A.Mapping = "mapping";
})(cw || (Dc.DiscrError = cw = {}));
Object.defineProperty(Hp, "__esModule", { value: !0 });
const Wa = we, Yd = Dc, fw = en, LH = go, TH = KA, DH = {
  message: ({ params: { discrError: A, tagName: e } }) => A === Yd.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: A, tag: e, tagName: t } }) => (0, Wa._)`{error: ${A}, tag: ${t}, tagValue: ${e}}`
}, OH = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: DH,
  code(A) {
    const { gen: e, data: t, schema: n, parentSchema: i, it: s } = A, { oneOf: l } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!l)
      throw new Error("discriminator: requires oneOf keyword");
    const f = e.let("valid", !1), p = e.const("tag", (0, Wa._)`${t}${(0, Wa.getProperty)(c)}`);
    e.if((0, Wa._)`typeof ${p} == "string"`, () => B(), () => A.error(!1, { discrError: Yd.DiscrError.Tag, tag: p, tagName: c })), A.ok(f);
    function B() {
      const Q = v();
      e.if(!1);
      for (const u in Q)
        e.elseIf((0, Wa._)`${p} === ${u}`), e.assign(f, w(Q[u]));
      e.else(), A.error(!1, { discrError: Yd.DiscrError.Mapping, tag: p, tagName: c }), e.endIf();
    }
    function w(Q) {
      const u = e.name("valid"), U = A.subschema({ keyword: "oneOf", schemaProp: Q }, u);
      return A.mergeEvaluated(U, Wa.Name), u;
    }
    function v() {
      var Q;
      const u = {}, U = E(i);
      let b = !0;
      for (let x = 0; x < l.length; x++) {
        let K = l[x];
        if (K != null && K.$ref && !(0, TH.schemaHasRulesButRef)(K, s.self.RULES)) {
          const Y = K.$ref;
          if (K = fw.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, Y), K instanceof fw.SchemaEnv && (K = K.schema), K === void 0)
            throw new LH.default(s.opts.uriResolver, s.baseId, Y);
        }
        const k = (Q = K == null ? void 0 : K.properties) === null || Q === void 0 ? void 0 : Q[c];
        if (typeof k != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        b = b && (U || E(K)), D(k, x);
      }
      if (!b)
        throw new Error(`discriminator: "${c}" must be required`);
      return u;
      function E({ required: x }) {
        return Array.isArray(x) && x.includes(c);
      }
      function D(x, K) {
        if (x.const)
          R(x.const, K);
        else if (x.enum)
          for (const k of x.enum)
            R(k, K);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function R(x, K) {
        if (typeof x != "string" || x in u)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        u[x] = K;
      }
    }
  }
};
Hp.default = OH;
const NH = "http://json-schema.org/draft-07/schema#", MH = "http://json-schema.org/draft-07/schema#", KH = "Core schema meta-schema", RH = {
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
}, $H = [
  "object",
  "boolean"
], PH = {
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
}, kH = {
  $schema: NH,
  $id: MH,
  title: KH,
  definitions: RH,
  type: $H,
  properties: PH,
  default: !0
};
(function(A, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const t = rv, n = ep, i = Hp, s = kH, l = ["/properties"], c = "http://json-schema.org/draft-07/schema";
  class f extends t.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((u) => this.addVocabulary(u)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const u = this.opts.$data ? this.$dataMetaSchema(s, l) : s;
      this.addMetaSchema(u, c, !1), this.refs["http://json-schema.org/schema"] = c;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  e.Ajv = f, A.exports = e = f, A.exports.Ajv = f, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = f;
  var p = zn;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return p.KeywordCxt;
  } });
  var B = we;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return B._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return B.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return B.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return B.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return B.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return B.CodeGen;
  } });
  var w = ks;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return w.default;
  } });
  var v = go;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return v.default;
  } });
})(Gd, Gd.exports);
var GH = Gd.exports;
const A0 = /* @__PURE__ */ Rh(GH), VH = "http://json-schema.org/draft-07/schema#", WH = "Generated schema for Root", XH = "object", qH = {
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
}, zH = [
  "genome"
], JH = {
  $schema: VH,
  title: WH,
  type: XH,
  properties: qH,
  required: zH
}, jH = new A0(), dw = jH.compile(JH), YH = function() {
  var A = function(e) {
    var i;
    if (!dw(e))
      throw console.log("annotation json:", e), console.log("Invalid data:", dw.errors), new Error("Invalid data");
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
}, ZH = "http://json-schema.org/draft-07/schema#", AS = "Generated schema for Root", eS = "object", tS = {
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
}, nS = [
  "chromosomes"
], rS = {
  $schema: ZH,
  title: AS,
  type: eS,
  properties: tS,
  required: nS
}, iS = new A0(), hw = iS.compile(rS), aS = function() {
  var A = function(e) {
    if (!hw(e))
      throw console.log("json:", e), console.log("Invalid data:", hw.errors), new Error("Invalid data");
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
}, oS = function() {
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
    }).forEach(function(l, c) {
      l.globalIndex = c;
    }), i.chromosomes.forEach(function(l) {
      var c = s.features.filter(function(b) {
        return b.chromosome === l.number;
      }), f = c.filter(function(b) {
        return b.type.toLowerCase() === "gene";
      }), p = c.filter(function(b) {
        return b.type.toLowerCase() === "qtl";
      }), B = c.filter(function(b) {
        return b.type.toLowerCase() === "snp";
      }), w = B.reduce(function(b, E) {
        return Math.min(b, E.pvalue);
      }, 1);
      B.forEach(function(b, E) {
        b.id = l.number + "_" + E, b.importance = Math.log(b.pvalue) / Math.log(w);
      }), p.forEach(function(b, E) {
        b.id = l.number + "_" + E, b.selected = !1;
      }), p.reduce(function(b, E) {
        return Math.max(b, E.score);
      }, 0);
      var v = 0.9, Q = 3.5, u = function(b) {
        return v - 0.5 + 1 / (1 + Math.pow(b, Q));
      };
      f.forEach(function(b, E) {
        b.visible = !1, b.hidden = !1, b.displayed = !1, b.importance = u(E);
      });
      var U = f.slice(0, 100);
      l.annotations = {
        genes: U,
        allGenes: f,
        qtls: p,
        snps: B
      };
    }), i;
  };
  return {
    readData: async function(n, i, s) {
      var l = aS();
      let c;
      if (s ? c = l.readBasemapFromRawJSON(n) : c = await l.readBasemap(n), i) {
        var f = YH();
        let B;
        s ? B = f.readAnnotationJSONFromRawJSON(i) : B = f.readAnnotation(i);
        var p = Promise.all([c, B]).then(
          t,
          function(w) {
            return c.then(e);
          }
        );
        return p;
      }
      return e(c);
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
    var t, n = "4.17.21", i = 200, s = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", c = "Invalid `variable` option passed into `_.template`", f = "__lodash_hash_undefined__", p = 500, B = "__lodash_placeholder__", w = 1, v = 2, Q = 4, u = 1, U = 2, b = 1, E = 2, D = 4, R = 8, x = 16, K = 32, k = 64, Y = 128, dA = 256, cA = 512, wA = 30, EA = "...", NA = 800, xA = 16, X = 1, CA = 2, tA = 3, fA = 1 / 0, _A = 9007199254740991, IA = 17976931348623157e292, aA = NaN, T = 4294967295, eA = T - 1, J = T >>> 1, L = [
      ["ary", Y],
      ["bind", b],
      ["bindKey", E],
      ["curry", R],
      ["curryRight", x],
      ["flip", cA],
      ["partial", K],
      ["partialRight", k],
      ["rearg", dA]
    ], $ = "[object Arguments]", rA = "[object Array]", FA = "[object AsyncFunction]", UA = "[object Boolean]", zA = "[object Date]", ne = "[object DOMException]", JA = "[object Error]", $A = "[object Function]", sA = "[object GeneratorFunction]", vA = "[object Map]", bA = "[object Number]", te = "[object Null]", me = "[object Object]", Ue = "[object Promise]", Ze = "[object Proxy]", Te = "[object RegExp]", ke = "[object Set]", Ke = "[object String]", _e = "[object Symbol]", Mt = "[object Undefined]", bt = "[object WeakMap]", Kt = "[object WeakSet]", _t = "[object ArrayBuffer]", mt = "[object DataView]", dn = "[object Float32Array]", vr = "[object Float64Array]", xi = "[object Int8Array]", zr = "[object Int16Array]", Jr = "[object Int32Array]", lA = "[object Uint8Array]", DA = "[object Uint8ClampedArray]", XA = "[object Uint16Array]", ve = "[object Uint32Array]", ye = /\b__p \+= '';/g, ut = /\b(__p \+=) '' \+/g, xt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, xn = /&(?:amp|lt|gt|quot|#39);/g, Ii = /[&<>"']/g, In = RegExp(xn.source), Hi = RegExp(Ii.source), jr = /<%-([\s\S]+?)%>/g, hn = /<%([\s\S]+?)%>/g, Si = /<%=([\s\S]+?)%>/g, Yr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, yr = /^\w*$/, Ys = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, vo = /[\\^$.*+?()[\]{}|]/g, Cr = RegExp(vo.source), fa = /^\s+/, Li = /\s/, Zs = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Au = /\{\n\/\* \[wrapped with (.+)\] \*/, da = /,? & /, eu = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, ha = /[()=,{}\[\]\/\s]/, yo = /\\(\\)?/g, tu = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Yn = /\w*$/, Zn = /^[-+]0x[0-9a-f]+$/i, jc = /^0b[01]+$/i, Co = /^\[object .+?Constructor\]$/, Qo = /^0o[0-7]+$/i, Yc = /^(?:0|[1-9]\d*)$/, Zc = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, pa = /($^)/, Af = /['\n\r\u2028\u2029\\]/g, Ti = "\\ud800-\\udfff", nu = "\\u0300-\\u036f", ru = "\\ufe20-\\ufe2f", iu = "\\u20d0-\\u20ff", Fo = nu + ru + iu, Uo = "\\u2700-\\u27bf", Eo = "a-z\\xdf-\\xf6\\xf8-\\xff", au = "\\xac\\xb1\\xd7\\xf7", It = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Zr = "\\u2000-\\u206f", ga = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", ou = "A-Z\\xc0-\\xd6\\xd8-\\xde", su = "\\ufe0e\\ufe0f", bo = au + It + Zr + ga, Ai = "['’]", uu = "[" + Ti + "]", lu = "[" + bo + "]", Ba = "[" + Fo + "]", qt = "\\d+", ef = "[" + Uo + "]", cu = "[" + Eo + "]", Qr = "[^" + Ti + bo + qt + Uo + Eo + ou + "]", wa = "\\ud83c[\\udffb-\\udfff]", Hn = "(?:" + Ba + "|" + wa + ")", ma = "[^" + Ti + "]", Sn = "(?:\\ud83c[\\udde6-\\uddff]){2}", ei = "[\\ud800-\\udbff][\\udc00-\\udfff]", ti = "[" + ou + "]", fu = "\\u200d", va = "(?:" + cu + "|" + Qr + ")", Fr = "(?:" + ti + "|" + Qr + ")", du = "(?:" + Ai + "(?:d|ll|m|re|s|t|ve))?", ya = "(?:" + Ai + "(?:D|LL|M|RE|S|T|VE))?", Ca = Hn + "?", hu = "[" + su + "]?", tf = "(?:" + fu + "(?:" + [ma, Sn, ei].join("|") + ")" + hu + Ca + ")*", pu = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", nf = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", gu = hu + Ca + tf, rf = "(?:" + [ef, Sn, ei].join("|") + ")" + gu, af = "(?:" + [ma + Ba + "?", Ba, Sn, ei, uu].join("|") + ")", Bu = RegExp(Ai, "g"), wu = RegExp(Ba, "g"), Di = RegExp(wa + "(?=" + wa + ")|" + af + gu, "g"), mu = RegExp([
      ti + "?" + cu + "+" + du + "(?=" + [lu, ti, "$"].join("|") + ")",
      Fr + "+" + ya + "(?=" + [lu, ti + va, "$"].join("|") + ")",
      ti + "?" + va + "+" + du,
      ti + "+" + ya,
      nf,
      pu,
      qt,
      rf
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
    Me[dn] = Me[vr] = Me[xi] = Me[zr] = Me[Jr] = Me[lA] = Me[DA] = Me[XA] = Me[ve] = !0, Me[$] = Me[rA] = Me[_t] = Me[UA] = Me[mt] = Me[zA] = Me[JA] = Me[$A] = Me[vA] = Me[bA] = Me[me] = Me[Te] = Me[ke] = Me[Ke] = Me[bt] = !1;
    var Re = {};
    Re[$] = Re[rA] = Re[_t] = Re[mt] = Re[UA] = Re[zA] = Re[dn] = Re[vr] = Re[xi] = Re[zr] = Re[Jr] = Re[vA] = Re[bA] = Re[me] = Re[Te] = Re[ke] = Re[Ke] = Re[_e] = Re[lA] = Re[DA] = Re[XA] = Re[ve] = !0, Re[JA] = Re[$A] = Re[bt] = !1;
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
    }, cf = parseFloat, Cu = parseInt, Qu = typeof Va == "object" && Va && Va.Object === Object && Va, ff = typeof self == "object" && self && self.Object === Object && self, et = Qu || ff || Function("return this")(), xo = e && !e.nodeType && e, pn = xo && !0 && A && !A.nodeType && A, ri = pn && pn.exports === xo, Oi = ri && Qu.process, Rt = function() {
      try {
        var j = pn && pn.require && pn.require("util").types;
        return j || Oi && Oi.binding && Oi.binding("util");
      } catch {
      }
    }(), Io = Rt && Rt.isArrayBuffer, Qa = Rt && Rt.isDate, Ho = Rt && Rt.isMap, So = Rt && Rt.isRegExp, Fu = Rt && Rt.isSet, Uu = Rt && Rt.isTypedArray;
    function o(j, oA, iA) {
      switch (iA.length) {
        case 0:
          return j.call(oA);
        case 1:
          return j.call(oA, iA[0]);
        case 2:
          return j.call(oA, iA[0], iA[1]);
        case 3:
          return j.call(oA, iA[0], iA[1], iA[2]);
      }
      return j.apply(oA, iA);
    }
    function d(j, oA, iA, OA) {
      for (var ae = -1, Ie = j == null ? 0 : j.length; ++ae < Ie; ) {
        var tt = j[ae];
        oA(OA, tt, iA(tt), j);
      }
      return OA;
    }
    function g(j, oA) {
      for (var iA = -1, OA = j == null ? 0 : j.length; ++iA < OA && oA(j[iA], iA, j) !== !1; )
        ;
      return j;
    }
    function m(j, oA) {
      for (var iA = j == null ? 0 : j.length; iA-- && oA(j[iA], iA, j) !== !1; )
        ;
      return j;
    }
    function C(j, oA) {
      for (var iA = -1, OA = j == null ? 0 : j.length; ++iA < OA; )
        if (!oA(j[iA], iA, j))
          return !1;
      return !0;
    }
    function F(j, oA) {
      for (var iA = -1, OA = j == null ? 0 : j.length, ae = 0, Ie = []; ++iA < OA; ) {
        var tt = j[iA];
        oA(tt, iA, j) && (Ie[ae++] = tt);
      }
      return Ie;
    }
    function H(j, oA) {
      var iA = j == null ? 0 : j.length;
      return !!iA && Je(j, oA, 0) > -1;
    }
    function M(j, oA, iA) {
      for (var OA = -1, ae = j == null ? 0 : j.length; ++OA < ae; )
        if (iA(oA, j[OA]))
          return !0;
      return !1;
    }
    function W(j, oA) {
      for (var iA = -1, OA = j == null ? 0 : j.length, ae = Array(OA); ++iA < OA; )
        ae[iA] = oA(j[iA], iA, j);
      return ae;
    }
    function q(j, oA) {
      for (var iA = -1, OA = oA.length, ae = j.length; ++iA < OA; )
        j[ae + iA] = oA[iA];
      return j;
    }
    function AA(j, oA, iA, OA) {
      var ae = -1, Ie = j == null ? 0 : j.length;
      for (OA && Ie && (iA = j[++ae]); ++ae < Ie; )
        iA = oA(iA, j[ae], ae, j);
      return iA;
    }
    function mA(j, oA, iA, OA) {
      var ae = j == null ? 0 : j.length;
      for (OA && ae && (iA = j[--ae]); ae--; )
        iA = oA(iA, j[ae], ae, j);
      return iA;
    }
    function SA(j, oA) {
      for (var iA = -1, OA = j == null ? 0 : j.length; ++iA < OA; )
        if (oA(j[iA], iA, j))
          return !0;
      return !1;
    }
    var yA = le("length");
    function ie(j) {
      return j.split("");
    }
    function YA(j) {
      return j.match(eu) || [];
    }
    function ue(j, oA, iA) {
      var OA;
      return iA(j, function(ae, Ie, tt) {
        if (oA(ae, Ie, tt))
          return OA = Ie, !1;
      }), OA;
    }
    function pt(j, oA, iA, OA) {
      for (var ae = j.length, Ie = iA + (OA ? 1 : -1); OA ? Ie-- : ++Ie < ae; )
        if (oA(j[Ie], Ie, j))
          return Ie;
      return -1;
    }
    function Je(j, oA, iA) {
      return oA === oA ? ba(j, oA, iA) : pt(j, RA, iA);
    }
    function Ar(j, oA, iA, OA) {
      for (var ae = iA - 1, Ie = j.length; ++ae < Ie; )
        if (OA(j[ae], oA))
          return ae;
      return -1;
    }
    function RA(j) {
      return j !== j;
    }
    function ct(j, oA) {
      var iA = j == null ? 0 : j.length;
      return iA ? Ht(j, oA) / iA : aA;
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
    function Ln(j, oA, iA, OA, ae) {
      return ae(j, function(Ie, tt, Ee) {
        iA = OA ? (OA = !1, Ie) : oA(iA, Ie, tt, Ee);
      }), iA;
    }
    function Fa(j, oA) {
      var iA = j.length;
      for (j.sort(oA); iA--; )
        j[iA] = j[iA].value;
      return j;
    }
    function Ht(j, oA) {
      for (var iA, OA = -1, ae = j.length; ++OA < ae; ) {
        var Ie = oA(j[OA]);
        Ie !== t && (iA = iA === t ? Ie : iA + Ie);
      }
      return iA;
    }
    function Tn(j, oA) {
      for (var iA = -1, OA = Array(j); ++iA < j; )
        OA[iA] = oA(iA);
      return OA;
    }
    function er(j, oA) {
      return W(oA, function(iA) {
        return [iA, j[iA]];
      });
    }
    function Dn(j) {
      return j && j.slice(0, xu(j) + 1).replace(fa, "");
    }
    function $e(j) {
      return function(oA) {
        return j(oA);
      };
    }
    function St(j, oA) {
      return W(oA, function(iA) {
        return j[iA];
      });
    }
    function Ni(j, oA) {
      return j.has(oA);
    }
    function On(j, oA) {
      for (var iA = -1, OA = j.length; ++iA < OA && Je(oA, j[iA], 0) > -1; )
        ;
      return iA;
    }
    function Lo(j, oA) {
      for (var iA = j.length; iA-- && Je(oA, j[iA], 0) > -1; )
        ;
      return iA;
    }
    function Ur(j, oA) {
      for (var iA = j.length, OA = 0; iA--; )
        j[iA] === oA && ++OA;
      return OA;
    }
    var To = qe(of), De = qe(sf);
    function Er(j) {
      return "\\" + lf[j];
    }
    function Eu(j, oA) {
      return j == null ? t : j[oA];
    }
    function tr(j) {
      return _o.test(j);
    }
    function df(j) {
      return ni.test(j);
    }
    function Ua(j) {
      for (var oA, iA = []; !(oA = j.next()).done; )
        iA.push(oA.value);
      return iA;
    }
    function Do(j) {
      var oA = -1, iA = Array(j.size);
      return j.forEach(function(OA, ae) {
        iA[++oA] = [ae, OA];
      }), iA;
    }
    function bu(j, oA) {
      return function(iA) {
        return j(oA(iA));
      };
    }
    function nr(j, oA) {
      for (var iA = -1, OA = j.length, ae = 0, Ie = []; ++iA < OA; ) {
        var tt = j[iA];
        (tt === oA || tt === B) && (j[iA] = B, Ie[ae++] = iA);
      }
      return Ie;
    }
    function Ea(j) {
      var oA = -1, iA = Array(j.size);
      return j.forEach(function(OA) {
        iA[++oA] = OA;
      }), iA;
    }
    function _u(j) {
      var oA = -1, iA = Array(j.size);
      return j.forEach(function(OA) {
        iA[++oA] = [OA, OA];
      }), iA;
    }
    function ba(j, oA, iA) {
      for (var OA = iA - 1, ae = j.length; ++OA < ae; )
        if (j[OA] === oA)
          return OA;
      return -1;
    }
    function hf(j, oA, iA) {
      for (var OA = iA + 1; OA--; )
        if (j[OA] === oA)
          return OA;
      return OA;
    }
    function ii(j) {
      return tr(j) ? pf(j) : yA(j);
    }
    function vt(j) {
      return tr(j) ? Nn(j) : ie(j);
    }
    function xu(j) {
      for (var oA = j.length; oA-- && Li.test(j.charAt(oA)); )
        ;
      return oA;
    }
    var Oo = qe(uf);
    function pf(j) {
      for (var oA = Di.lastIndex = 0; Di.test(j); )
        ++oA;
      return oA;
    }
    function Nn(j) {
      return j.match(Di) || [];
    }
    function Mn(j) {
      return j.match(mu) || [];
    }
    var Iu = function j(oA) {
      oA = oA == null ? et : xe.defaults(et.Object(), oA, xe.pick(et, vu));
      var iA = oA.Array, OA = oA.Date, ae = oA.Error, Ie = oA.Function, tt = oA.Math, Ee = oA.Object, Mi = oA.RegExp, Hu = oA.String, yt = oA.TypeError, ai = iA.prototype, No = Ie.prototype, oi = Ee.prototype, br = oA["__core-js_shared__"], si = No.toString, He = oi.hasOwnProperty, gf = 0, N = function() {
        var r = /[^.]+$/.exec(br && br.keys && br.keys.IE_PROTO || "");
        return r ? "Symbol(src)_1." + r : "";
      }(), G = oi.toString, z = si.call(Ee), uA = et._, nA = Mi(
        "^" + si.call(He).replace(vo, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), BA = ri ? oA.Buffer : t, hA = oA.Symbol, HA = oA.Uint8Array, GA = BA ? BA.allocUnsafe : t, re = bu(Ee.getPrototypeOf, Ee), VA = Ee.create, ZA = oi.propertyIsEnumerable, fe = ai.splice, Se = hA ? hA.isConcatSpreadable : t, qA = hA ? hA.iterator : t, Ge = hA ? hA.toStringTag : t, nt = function() {
        try {
          var r = Gi(Ee, "defineProperty");
          return r({}, "", {}), r;
        } catch {
        }
      }(), $t = oA.clearTimeout !== et.clearTimeout && oA.clearTimeout, We = OA && OA.now !== et.Date.now && OA.now, Ki = oA.setTimeout !== et.setTimeout && oA.setTimeout, rr = tt.ceil, gt = tt.floor, Bf = Ee.getOwnPropertySymbols, nC = BA ? BA.isBuffer : t, rg = oA.isFinite, rC = ai.join, iC = bu(Ee.keys, Ee), ft = tt.max, Lt = tt.min, aC = OA.now, oC = oA.parseInt, ig = tt.random, sC = ai.reverse, wf = Gi(oA, "DataView"), Mo = Gi(oA, "Map"), mf = Gi(oA, "Promise"), _a = Gi(oA, "Set"), Ko = Gi(oA, "WeakMap"), Ro = Gi(Ee, "create"), Su = Ko && new Ko(), xa = {}, uC = Vi(wf), lC = Vi(Mo), cC = Vi(mf), fC = Vi(_a), dC = Vi(Ko), Lu = hA ? hA.prototype : t, $o = Lu ? Lu.valueOf : t, ag = Lu ? Lu.toString : t;
      function S(r) {
        if (At(r) && !ce(r) && !(r instanceof Qe)) {
          if (r instanceof gn)
            return r;
          if (He.call(r, "__wrapped__"))
            return oB(r);
        }
        return new gn(r);
      }
      var Ia = /* @__PURE__ */ function() {
        function r() {
        }
        return function(a) {
          if (!Ye(a))
            return {};
          if (VA)
            return VA(a);
          r.prototype = a;
          var h = new r();
          return r.prototype = t, h;
        };
      }();
      function Tu() {
      }
      function gn(r, a) {
        this.__wrapped__ = r, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
      }
      S.templateSettings = {
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
        evaluate: hn,
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
          _: S
        }
      }, S.prototype = Tu.prototype, S.prototype.constructor = S, gn.prototype = Ia(Tu.prototype), gn.prototype.constructor = gn;
      function Qe(r) {
        this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = T, this.__views__ = [];
      }
      function hC() {
        var r = new Qe(this.__wrapped__);
        return r.__actions__ = zt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = zt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = zt(this.__views__), r;
      }
      function pC() {
        if (this.__filtered__) {
          var r = new Qe(this);
          r.__dir__ = -1, r.__filtered__ = !0;
        } else
          r = this.clone(), r.__dir__ *= -1;
        return r;
      }
      function gC() {
        var r = this.__wrapped__.value(), a = this.__dir__, h = ce(r), y = a < 0, I = h ? r.length : 0, O = _Q(0, I, this.__views__), P = O.start, V = O.end, Z = V - P, pA = y ? V : P - 1, gA = this.__iteratees__, QA = gA.length, LA = 0, PA = Lt(Z, this.__takeCount__);
        if (!h || !y && I == Z && PA == Z)
          return Ig(r, this.__actions__);
        var Ae = [];
        A:
          for (; Z-- && LA < PA; ) {
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
      Qe.prototype = Ia(Tu.prototype), Qe.prototype.constructor = Qe;
      function Ri(r) {
        var a = -1, h = r == null ? 0 : r.length;
        for (this.clear(); ++a < h; ) {
          var y = r[a];
          this.set(y[0], y[1]);
        }
      }
      function BC() {
        this.__data__ = Ro ? Ro(null) : {}, this.size = 0;
      }
      function wC(r) {
        var a = this.has(r) && delete this.__data__[r];
        return this.size -= a ? 1 : 0, a;
      }
      function mC(r) {
        var a = this.__data__;
        if (Ro) {
          var h = a[r];
          return h === f ? t : h;
        }
        return He.call(a, r) ? a[r] : t;
      }
      function vC(r) {
        var a = this.__data__;
        return Ro ? a[r] !== t : He.call(a, r);
      }
      function yC(r, a) {
        var h = this.__data__;
        return this.size += this.has(r) ? 0 : 1, h[r] = Ro && a === t ? f : a, this;
      }
      Ri.prototype.clear = BC, Ri.prototype.delete = wC, Ri.prototype.get = mC, Ri.prototype.has = vC, Ri.prototype.set = yC;
      function _r(r) {
        var a = -1, h = r == null ? 0 : r.length;
        for (this.clear(); ++a < h; ) {
          var y = r[a];
          this.set(y[0], y[1]);
        }
      }
      function CC() {
        this.__data__ = [], this.size = 0;
      }
      function QC(r) {
        var a = this.__data__, h = Du(a, r);
        if (h < 0)
          return !1;
        var y = a.length - 1;
        return h == y ? a.pop() : fe.call(a, h, 1), --this.size, !0;
      }
      function FC(r) {
        var a = this.__data__, h = Du(a, r);
        return h < 0 ? t : a[h][1];
      }
      function UC(r) {
        return Du(this.__data__, r) > -1;
      }
      function EC(r, a) {
        var h = this.__data__, y = Du(h, r);
        return y < 0 ? (++this.size, h.push([r, a])) : h[y][1] = a, this;
      }
      _r.prototype.clear = CC, _r.prototype.delete = QC, _r.prototype.get = FC, _r.prototype.has = UC, _r.prototype.set = EC;
      function xr(r) {
        var a = -1, h = r == null ? 0 : r.length;
        for (this.clear(); ++a < h; ) {
          var y = r[a];
          this.set(y[0], y[1]);
        }
      }
      function bC() {
        this.size = 0, this.__data__ = {
          hash: new Ri(),
          map: new (Mo || _r)(),
          string: new Ri()
        };
      }
      function _C(r) {
        var a = Xu(this, r).delete(r);
        return this.size -= a ? 1 : 0, a;
      }
      function xC(r) {
        return Xu(this, r).get(r);
      }
      function IC(r) {
        return Xu(this, r).has(r);
      }
      function HC(r, a) {
        var h = Xu(this, r), y = h.size;
        return h.set(r, a), this.size += h.size == y ? 0 : 1, this;
      }
      xr.prototype.clear = bC, xr.prototype.delete = _C, xr.prototype.get = xC, xr.prototype.has = IC, xr.prototype.set = HC;
      function $i(r) {
        var a = -1, h = r == null ? 0 : r.length;
        for (this.__data__ = new xr(); ++a < h; )
          this.add(r[a]);
      }
      function SC(r) {
        return this.__data__.set(r, f), this;
      }
      function LC(r) {
        return this.__data__.has(r);
      }
      $i.prototype.add = $i.prototype.push = SC, $i.prototype.has = LC;
      function Kn(r) {
        var a = this.__data__ = new _r(r);
        this.size = a.size;
      }
      function TC() {
        this.__data__ = new _r(), this.size = 0;
      }
      function DC(r) {
        var a = this.__data__, h = a.delete(r);
        return this.size = a.size, h;
      }
      function OC(r) {
        return this.__data__.get(r);
      }
      function NC(r) {
        return this.__data__.has(r);
      }
      function MC(r, a) {
        var h = this.__data__;
        if (h instanceof _r) {
          var y = h.__data__;
          if (!Mo || y.length < i - 1)
            return y.push([r, a]), this.size = ++h.size, this;
          h = this.__data__ = new xr(y);
        }
        return h.set(r, a), this.size = h.size, this;
      }
      Kn.prototype.clear = TC, Kn.prototype.delete = DC, Kn.prototype.get = OC, Kn.prototype.has = NC, Kn.prototype.set = MC;
      function og(r, a) {
        var h = ce(r), y = !h && Wi(r), I = !h && !y && di(r), O = !h && !y && !I && Ta(r), P = h || y || I || O, V = P ? Tn(r.length, Hu) : [], Z = V.length;
        for (var pA in r)
          (a || He.call(r, pA)) && !(P && // Safari 9 has enumerable `arguments.length` in strict mode.
          (pA == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          I && (pA == "offset" || pA == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          O && (pA == "buffer" || pA == "byteLength" || pA == "byteOffset") || // Skip index properties.
          Lr(pA, Z))) && V.push(pA);
        return V;
      }
      function sg(r) {
        var a = r.length;
        return a ? r[If(0, a - 1)] : t;
      }
      function KC(r, a) {
        return qu(zt(r), Pi(a, 0, r.length));
      }
      function RC(r) {
        return qu(zt(r));
      }
      function vf(r, a, h) {
        (h !== t && !Rn(r[a], h) || h === t && !(a in r)) && Ir(r, a, h);
      }
      function Po(r, a, h) {
        var y = r[a];
        (!(He.call(r, a) && Rn(y, h)) || h === t && !(a in r)) && Ir(r, a, h);
      }
      function Du(r, a) {
        for (var h = r.length; h--; )
          if (Rn(r[h][0], a))
            return h;
        return -1;
      }
      function $C(r, a, h, y) {
        return ui(r, function(I, O, P) {
          a(y, I, h(I), P);
        }), y;
      }
      function ug(r, a) {
        return r && ar(a, Bt(a), r);
      }
      function PC(r, a) {
        return r && ar(a, jt(a), r);
      }
      function Ir(r, a, h) {
        a == "__proto__" && nt ? nt(r, a, {
          configurable: !0,
          enumerable: !0,
          value: h,
          writable: !0
        }) : r[a] = h;
      }
      function yf(r, a) {
        for (var h = -1, y = a.length, I = iA(y), O = r == null; ++h < y; )
          I[h] = O ? t : ed(r, a[h]);
        return I;
      }
      function Pi(r, a, h) {
        return r === r && (h !== t && (r = r <= h ? r : h), a !== t && (r = r >= a ? r : a)), r;
      }
      function Bn(r, a, h, y, I, O) {
        var P, V = a & w, Z = a & v, pA = a & Q;
        if (h && (P = I ? h(r, y, I, O) : h(r)), P !== t)
          return P;
        if (!Ye(r))
          return r;
        var gA = ce(r);
        if (gA) {
          if (P = IQ(r), !V)
            return zt(r, P);
        } else {
          var QA = Tt(r), LA = QA == $A || QA == sA;
          if (di(r))
            return Lg(r, V);
          if (QA == me || QA == $ || LA && !I) {
            if (P = Z || LA ? {} : Yg(r), !V)
              return Z ? mQ(r, PC(P, r)) : wQ(r, ug(P, r));
          } else {
            if (!Re[QA])
              return I ? r : {};
            P = HQ(r, QA, V);
          }
        }
        O || (O = new Kn());
        var PA = O.get(r);
        if (PA)
          return PA;
        O.set(r, P), bB(r) ? r.forEach(function(ee) {
          P.add(Bn(ee, a, h, ee, r, O));
        }) : UB(r) && r.forEach(function(ee, Ce) {
          P.set(Ce, Bn(ee, a, h, Ce, r, O));
        });
        var Ae = pA ? Z ? $f : Rf : Z ? jt : Bt, pe = gA ? t : Ae(r);
        return g(pe || r, function(ee, Ce) {
          pe && (Ce = ee, ee = r[Ce]), Po(P, Ce, Bn(ee, a, h, Ce, r, O));
        }), P;
      }
      function kC(r) {
        var a = Bt(r);
        return function(h) {
          return lg(h, r, a);
        };
      }
      function lg(r, a, h) {
        var y = h.length;
        if (r == null)
          return !y;
        for (r = Ee(r); y--; ) {
          var I = h[y], O = a[I], P = r[I];
          if (P === t && !(I in r) || !O(P))
            return !1;
        }
        return !0;
      }
      function cg(r, a, h) {
        if (typeof r != "function")
          throw new yt(l);
        return zo(function() {
          r.apply(t, h);
        }, a);
      }
      function ko(r, a, h, y) {
        var I = -1, O = H, P = !0, V = r.length, Z = [], pA = a.length;
        if (!V)
          return Z;
        h && (a = W(a, $e(h))), y ? (O = M, P = !1) : a.length >= i && (O = Ni, P = !1, a = new $i(a));
        A:
          for (; ++I < V; ) {
            var gA = r[I], QA = h == null ? gA : h(gA);
            if (gA = y || gA !== 0 ? gA : 0, P && QA === QA) {
              for (var LA = pA; LA--; )
                if (a[LA] === QA)
                  continue A;
              Z.push(gA);
            } else O(a, QA, y) || Z.push(gA);
          }
        return Z;
      }
      var ui = Mg(ir), fg = Mg(Qf, !0);
      function GC(r, a) {
        var h = !0;
        return ui(r, function(y, I, O) {
          return h = !!a(y, I, O), h;
        }), h;
      }
      function Ou(r, a, h) {
        for (var y = -1, I = r.length; ++y < I; ) {
          var O = r[y], P = a(O);
          if (P != null && (V === t ? P === P && !on(P) : h(P, V)))
            var V = P, Z = O;
        }
        return Z;
      }
      function VC(r, a, h, y) {
        var I = r.length;
        for (h = de(h), h < 0 && (h = -h > I ? 0 : I + h), y = y === t || y > I ? I : de(y), y < 0 && (y += I), y = h > y ? 0 : xB(y); h < y; )
          r[h++] = a;
        return r;
      }
      function dg(r, a) {
        var h = [];
        return ui(r, function(y, I, O) {
          a(y, I, O) && h.push(y);
        }), h;
      }
      function Ct(r, a, h, y, I) {
        var O = -1, P = r.length;
        for (h || (h = LQ), I || (I = []); ++O < P; ) {
          var V = r[O];
          a > 0 && h(V) ? a > 1 ? Ct(V, a - 1, h, y, I) : q(I, V) : y || (I[I.length] = V);
        }
        return I;
      }
      var Cf = Kg(), hg = Kg(!0);
      function ir(r, a) {
        return r && Cf(r, a, Bt);
      }
      function Qf(r, a) {
        return r && hg(r, a, Bt);
      }
      function Nu(r, a) {
        return F(a, function(h) {
          return Tr(r[h]);
        });
      }
      function ki(r, a) {
        a = ci(a, r);
        for (var h = 0, y = a.length; r != null && h < y; )
          r = r[or(a[h++])];
        return h && h == y ? r : t;
      }
      function pg(r, a, h) {
        var y = a(r);
        return ce(r) ? y : q(y, h(r));
      }
      function Pt(r) {
        return r == null ? r === t ? Mt : te : Ge && Ge in Ee(r) ? bQ(r) : RQ(r);
      }
      function Ff(r, a) {
        return r > a;
      }
      function WC(r, a) {
        return r != null && He.call(r, a);
      }
      function XC(r, a) {
        return r != null && a in Ee(r);
      }
      function qC(r, a, h) {
        return r >= Lt(a, h) && r < ft(a, h);
      }
      function Uf(r, a, h) {
        for (var y = h ? M : H, I = r[0].length, O = r.length, P = O, V = iA(O), Z = 1 / 0, pA = []; P--; ) {
          var gA = r[P];
          P && a && (gA = W(gA, $e(a))), Z = Lt(gA.length, Z), V[P] = !h && (a || I >= 120 && gA.length >= 120) ? new $i(P && gA) : t;
        }
        gA = r[0];
        var QA = -1, LA = V[0];
        A:
          for (; ++QA < I && pA.length < Z; ) {
            var PA = gA[QA], Ae = a ? a(PA) : PA;
            if (PA = h || PA !== 0 ? PA : 0, !(LA ? Ni(LA, Ae) : y(pA, Ae, h))) {
              for (P = O; --P; ) {
                var pe = V[P];
                if (!(pe ? Ni(pe, Ae) : y(r[P], Ae, h)))
                  continue A;
              }
              LA && LA.push(Ae), pA.push(PA);
            }
          }
        return pA;
      }
      function zC(r, a, h, y) {
        return ir(r, function(I, O, P) {
          a(y, h(I), O, P);
        }), y;
      }
      function Go(r, a, h) {
        a = ci(a, r), r = tB(r, a);
        var y = r == null ? r : r[or(mn(a))];
        return y == null ? t : o(y, r, h);
      }
      function gg(r) {
        return At(r) && Pt(r) == $;
      }
      function JC(r) {
        return At(r) && Pt(r) == _t;
      }
      function jC(r) {
        return At(r) && Pt(r) == zA;
      }
      function Vo(r, a, h, y, I) {
        return r === a ? !0 : r == null || a == null || !At(r) && !At(a) ? r !== r && a !== a : YC(r, a, h, y, Vo, I);
      }
      function YC(r, a, h, y, I, O) {
        var P = ce(r), V = ce(a), Z = P ? rA : Tt(r), pA = V ? rA : Tt(a);
        Z = Z == $ ? me : Z, pA = pA == $ ? me : pA;
        var gA = Z == me, QA = pA == me, LA = Z == pA;
        if (LA && di(r)) {
          if (!di(a))
            return !1;
          P = !0, gA = !1;
        }
        if (LA && !gA)
          return O || (O = new Kn()), P || Ta(r) ? zg(r, a, h, y, I, O) : UQ(r, a, Z, h, y, I, O);
        if (!(h & u)) {
          var PA = gA && He.call(r, "__wrapped__"), Ae = QA && He.call(a, "__wrapped__");
          if (PA || Ae) {
            var pe = PA ? r.value() : r, ee = Ae ? a.value() : a;
            return O || (O = new Kn()), I(pe, ee, h, y, O);
          }
        }
        return LA ? (O || (O = new Kn()), EQ(r, a, h, y, I, O)) : !1;
      }
      function ZC(r) {
        return At(r) && Tt(r) == vA;
      }
      function Ef(r, a, h, y) {
        var I = h.length, O = I, P = !y;
        if (r == null)
          return !O;
        for (r = Ee(r); I--; ) {
          var V = h[I];
          if (P && V[2] ? V[1] !== r[V[0]] : !(V[0] in r))
            return !1;
        }
        for (; ++I < O; ) {
          V = h[I];
          var Z = V[0], pA = r[Z], gA = V[1];
          if (P && V[2]) {
            if (pA === t && !(Z in r))
              return !1;
          } else {
            var QA = new Kn();
            if (y)
              var LA = y(pA, gA, Z, r, a, QA);
            if (!(LA === t ? Vo(gA, pA, u | U, y, QA) : LA))
              return !1;
          }
        }
        return !0;
      }
      function Bg(r) {
        if (!Ye(r) || DQ(r))
          return !1;
        var a = Tr(r) ? nA : Co;
        return a.test(Vi(r));
      }
      function AQ(r) {
        return At(r) && Pt(r) == Te;
      }
      function eQ(r) {
        return At(r) && Tt(r) == ke;
      }
      function tQ(r) {
        return At(r) && Al(r.length) && !!Me[Pt(r)];
      }
      function wg(r) {
        return typeof r == "function" ? r : r == null ? Yt : typeof r == "object" ? ce(r) ? yg(r[0], r[1]) : vg(r) : RB(r);
      }
      function bf(r) {
        if (!qo(r))
          return iC(r);
        var a = [];
        for (var h in Ee(r))
          He.call(r, h) && h != "constructor" && a.push(h);
        return a;
      }
      function nQ(r) {
        if (!Ye(r))
          return KQ(r);
        var a = qo(r), h = [];
        for (var y in r)
          y == "constructor" && (a || !He.call(r, y)) || h.push(y);
        return h;
      }
      function _f(r, a) {
        return r < a;
      }
      function mg(r, a) {
        var h = -1, y = Jt(r) ? iA(r.length) : [];
        return ui(r, function(I, O, P) {
          y[++h] = a(I, O, P);
        }), y;
      }
      function vg(r) {
        var a = kf(r);
        return a.length == 1 && a[0][2] ? AB(a[0][0], a[0][1]) : function(h) {
          return h === r || Ef(h, r, a);
        };
      }
      function yg(r, a) {
        return Vf(r) && Zg(a) ? AB(or(r), a) : function(h) {
          var y = ed(h, r);
          return y === t && y === a ? td(h, r) : Vo(a, y, u | U);
        };
      }
      function Mu(r, a, h, y, I) {
        r !== a && Cf(a, function(O, P) {
          if (I || (I = new Kn()), Ye(O))
            rQ(r, a, P, h, Mu, y, I);
          else {
            var V = y ? y(Xf(r, P), O, P + "", r, a, I) : t;
            V === t && (V = O), vf(r, P, V);
          }
        }, jt);
      }
      function rQ(r, a, h, y, I, O, P) {
        var V = Xf(r, h), Z = Xf(a, h), pA = P.get(Z);
        if (pA) {
          vf(r, h, pA);
          return;
        }
        var gA = O ? O(V, Z, h + "", r, a, P) : t, QA = gA === t;
        if (QA) {
          var LA = ce(Z), PA = !LA && di(Z), Ae = !LA && !PA && Ta(Z);
          gA = Z, LA || PA || Ae ? ce(V) ? gA = V : rt(V) ? gA = zt(V) : PA ? (QA = !1, gA = Lg(Z, !0)) : Ae ? (QA = !1, gA = Tg(Z, !0)) : gA = [] : Jo(Z) || Wi(Z) ? (gA = V, Wi(V) ? gA = IB(V) : (!Ye(V) || Tr(V)) && (gA = Yg(Z))) : QA = !1;
        }
        QA && (P.set(Z, gA), I(gA, Z, y, O, P), P.delete(Z)), vf(r, h, gA);
      }
      function Cg(r, a) {
        var h = r.length;
        if (h)
          return a += a < 0 ? h : 0, Lr(a, h) ? r[a] : t;
      }
      function Qg(r, a, h) {
        a.length ? a = W(a, function(O) {
          return ce(O) ? function(P) {
            return ki(P, O.length === 1 ? O[0] : O);
          } : O;
        }) : a = [Yt];
        var y = -1;
        a = W(a, $e(jA()));
        var I = mg(r, function(O, P, V) {
          var Z = W(a, function(pA) {
            return pA(O);
          });
          return { criteria: Z, index: ++y, value: O };
        });
        return Fa(I, function(O, P) {
          return BQ(O, P, h);
        });
      }
      function iQ(r, a) {
        return Fg(r, a, function(h, y) {
          return td(r, y);
        });
      }
      function Fg(r, a, h) {
        for (var y = -1, I = a.length, O = {}; ++y < I; ) {
          var P = a[y], V = ki(r, P);
          h(V, P) && Wo(O, ci(P, r), V);
        }
        return O;
      }
      function aQ(r) {
        return function(a) {
          return ki(a, r);
        };
      }
      function xf(r, a, h, y) {
        var I = y ? Ar : Je, O = -1, P = a.length, V = r;
        for (r === a && (a = zt(a)), h && (V = W(r, $e(h))); ++O < P; )
          for (var Z = 0, pA = a[O], gA = h ? h(pA) : pA; (Z = I(V, gA, Z, y)) > -1; )
            V !== r && fe.call(V, Z, 1), fe.call(r, Z, 1);
        return r;
      }
      function Ug(r, a) {
        for (var h = r ? a.length : 0, y = h - 1; h--; ) {
          var I = a[h];
          if (h == y || I !== O) {
            var O = I;
            Lr(I) ? fe.call(r, I, 1) : Lf(r, I);
          }
        }
        return r;
      }
      function If(r, a) {
        return r + gt(ig() * (a - r + 1));
      }
      function oQ(r, a, h, y) {
        for (var I = -1, O = ft(rr((a - r) / (h || 1)), 0), P = iA(O); O--; )
          P[y ? O : ++I] = r, r += h;
        return P;
      }
      function Hf(r, a) {
        var h = "";
        if (!r || a < 1 || a > _A)
          return h;
        do
          a % 2 && (h += r), a = gt(a / 2), a && (r += r);
        while (a);
        return h;
      }
      function ge(r, a) {
        return qf(eB(r, a, Yt), r + "");
      }
      function sQ(r) {
        return sg(Da(r));
      }
      function uQ(r, a) {
        var h = Da(r);
        return qu(h, Pi(a, 0, h.length));
      }
      function Wo(r, a, h, y) {
        if (!Ye(r))
          return r;
        a = ci(a, r);
        for (var I = -1, O = a.length, P = O - 1, V = r; V != null && ++I < O; ) {
          var Z = or(a[I]), pA = h;
          if (Z === "__proto__" || Z === "constructor" || Z === "prototype")
            return r;
          if (I != P) {
            var gA = V[Z];
            pA = y ? y(gA, Z, V) : t, pA === t && (pA = Ye(gA) ? gA : Lr(a[I + 1]) ? [] : {});
          }
          Po(V, Z, pA), V = V[Z];
        }
        return r;
      }
      var Eg = Su ? function(r, a) {
        return Su.set(r, a), r;
      } : Yt, lQ = nt ? function(r, a) {
        return nt(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: rd(a),
          writable: !0
        });
      } : Yt;
      function cQ(r) {
        return qu(Da(r));
      }
      function wn(r, a, h) {
        var y = -1, I = r.length;
        a < 0 && (a = -a > I ? 0 : I + a), h = h > I ? I : h, h < 0 && (h += I), I = a > h ? 0 : h - a >>> 0, a >>>= 0;
        for (var O = iA(I); ++y < I; )
          O[y] = r[y + a];
        return O;
      }
      function fQ(r, a) {
        var h;
        return ui(r, function(y, I, O) {
          return h = a(y, I, O), !h;
        }), !!h;
      }
      function Ku(r, a, h) {
        var y = 0, I = r == null ? y : r.length;
        if (typeof a == "number" && a === a && I <= J) {
          for (; y < I; ) {
            var O = y + I >>> 1, P = r[O];
            P !== null && !on(P) && (h ? P <= a : P < a) ? y = O + 1 : I = O;
          }
          return I;
        }
        return Sf(r, a, Yt, h);
      }
      function Sf(r, a, h, y) {
        var I = 0, O = r == null ? 0 : r.length;
        if (O === 0)
          return 0;
        a = h(a);
        for (var P = a !== a, V = a === null, Z = on(a), pA = a === t; I < O; ) {
          var gA = gt((I + O) / 2), QA = h(r[gA]), LA = QA !== t, PA = QA === null, Ae = QA === QA, pe = on(QA);
          if (P)
            var ee = y || Ae;
          else pA ? ee = Ae && (y || LA) : V ? ee = Ae && LA && (y || !PA) : Z ? ee = Ae && LA && !PA && (y || !pe) : PA || pe ? ee = !1 : ee = y ? QA <= a : QA < a;
          ee ? I = gA + 1 : O = gA;
        }
        return Lt(O, eA);
      }
      function bg(r, a) {
        for (var h = -1, y = r.length, I = 0, O = []; ++h < y; ) {
          var P = r[h], V = a ? a(P) : P;
          if (!h || !Rn(V, Z)) {
            var Z = V;
            O[I++] = P === 0 ? 0 : P;
          }
        }
        return O;
      }
      function _g(r) {
        return typeof r == "number" ? r : on(r) ? aA : +r;
      }
      function an(r) {
        if (typeof r == "string")
          return r;
        if (ce(r))
          return W(r, an) + "";
        if (on(r))
          return ag ? ag.call(r) : "";
        var a = r + "";
        return a == "0" && 1 / r == -fA ? "-0" : a;
      }
      function li(r, a, h) {
        var y = -1, I = H, O = r.length, P = !0, V = [], Z = V;
        if (h)
          P = !1, I = M;
        else if (O >= i) {
          var pA = a ? null : QQ(r);
          if (pA)
            return Ea(pA);
          P = !1, I = Ni, Z = new $i();
        } else
          Z = a ? [] : V;
        A:
          for (; ++y < O; ) {
            var gA = r[y], QA = a ? a(gA) : gA;
            if (gA = h || gA !== 0 ? gA : 0, P && QA === QA) {
              for (var LA = Z.length; LA--; )
                if (Z[LA] === QA)
                  continue A;
              a && Z.push(QA), V.push(gA);
            } else I(Z, QA, h) || (Z !== V && Z.push(QA), V.push(gA));
          }
        return V;
      }
      function Lf(r, a) {
        return a = ci(a, r), r = tB(r, a), r == null || delete r[or(mn(a))];
      }
      function xg(r, a, h, y) {
        return Wo(r, a, h(ki(r, a)), y);
      }
      function Ru(r, a, h, y) {
        for (var I = r.length, O = y ? I : -1; (y ? O-- : ++O < I) && a(r[O], O, r); )
          ;
        return h ? wn(r, y ? 0 : O, y ? O + 1 : I) : wn(r, y ? O + 1 : 0, y ? I : O);
      }
      function Ig(r, a) {
        var h = r;
        return h instanceof Qe && (h = h.value()), AA(a, function(y, I) {
          return I.func.apply(I.thisArg, q([y], I.args));
        }, h);
      }
      function Tf(r, a, h) {
        var y = r.length;
        if (y < 2)
          return y ? li(r[0]) : [];
        for (var I = -1, O = iA(y); ++I < y; )
          for (var P = r[I], V = -1; ++V < y; )
            V != I && (O[I] = ko(O[I] || P, r[V], a, h));
        return li(Ct(O, 1), a, h);
      }
      function Hg(r, a, h) {
        for (var y = -1, I = r.length, O = a.length, P = {}; ++y < I; ) {
          var V = y < O ? a[y] : t;
          h(P, r[y], V);
        }
        return P;
      }
      function Df(r) {
        return rt(r) ? r : [];
      }
      function Of(r) {
        return typeof r == "function" ? r : Yt;
      }
      function ci(r, a) {
        return ce(r) ? r : Vf(r, a) ? [r] : aB(Oe(r));
      }
      var dQ = ge;
      function fi(r, a, h) {
        var y = r.length;
        return h = h === t ? y : h, !a && h >= y ? r : wn(r, a, h);
      }
      var Sg = $t || function(r) {
        return et.clearTimeout(r);
      };
      function Lg(r, a) {
        if (a)
          return r.slice();
        var h = r.length, y = GA ? GA(h) : new r.constructor(h);
        return r.copy(y), y;
      }
      function Nf(r) {
        var a = new r.constructor(r.byteLength);
        return new HA(a).set(new HA(r)), a;
      }
      function hQ(r, a) {
        var h = a ? Nf(r.buffer) : r.buffer;
        return new r.constructor(h, r.byteOffset, r.byteLength);
      }
      function pQ(r) {
        var a = new r.constructor(r.source, Yn.exec(r));
        return a.lastIndex = r.lastIndex, a;
      }
      function gQ(r) {
        return $o ? Ee($o.call(r)) : {};
      }
      function Tg(r, a) {
        var h = a ? Nf(r.buffer) : r.buffer;
        return new r.constructor(h, r.byteOffset, r.length);
      }
      function Dg(r, a) {
        if (r !== a) {
          var h = r !== t, y = r === null, I = r === r, O = on(r), P = a !== t, V = a === null, Z = a === a, pA = on(a);
          if (!V && !pA && !O && r > a || O && P && Z && !V && !pA || y && P && Z || !h && Z || !I)
            return 1;
          if (!y && !O && !pA && r < a || pA && h && I && !y && !O || V && h && I || !P && I || !Z)
            return -1;
        }
        return 0;
      }
      function BQ(r, a, h) {
        for (var y = -1, I = r.criteria, O = a.criteria, P = I.length, V = h.length; ++y < P; ) {
          var Z = Dg(I[y], O[y]);
          if (Z) {
            if (y >= V)
              return Z;
            var pA = h[y];
            return Z * (pA == "desc" ? -1 : 1);
          }
        }
        return r.index - a.index;
      }
      function Og(r, a, h, y) {
        for (var I = -1, O = r.length, P = h.length, V = -1, Z = a.length, pA = ft(O - P, 0), gA = iA(Z + pA), QA = !y; ++V < Z; )
          gA[V] = a[V];
        for (; ++I < P; )
          (QA || I < O) && (gA[h[I]] = r[I]);
        for (; pA--; )
          gA[V++] = r[I++];
        return gA;
      }
      function Ng(r, a, h, y) {
        for (var I = -1, O = r.length, P = -1, V = h.length, Z = -1, pA = a.length, gA = ft(O - V, 0), QA = iA(gA + pA), LA = !y; ++I < gA; )
          QA[I] = r[I];
        for (var PA = I; ++Z < pA; )
          QA[PA + Z] = a[Z];
        for (; ++P < V; )
          (LA || I < O) && (QA[PA + h[P]] = r[I++]);
        return QA;
      }
      function zt(r, a) {
        var h = -1, y = r.length;
        for (a || (a = iA(y)); ++h < y; )
          a[h] = r[h];
        return a;
      }
      function ar(r, a, h, y) {
        var I = !h;
        h || (h = {});
        for (var O = -1, P = a.length; ++O < P; ) {
          var V = a[O], Z = y ? y(h[V], r[V], V, h, r) : t;
          Z === t && (Z = r[V]), I ? Ir(h, V, Z) : Po(h, V, Z);
        }
        return h;
      }
      function wQ(r, a) {
        return ar(r, Gf(r), a);
      }
      function mQ(r, a) {
        return ar(r, Jg(r), a);
      }
      function $u(r, a) {
        return function(h, y) {
          var I = ce(h) ? d : $C, O = a ? a() : {};
          return I(h, r, jA(y, 2), O);
        };
      }
      function Ha(r) {
        return ge(function(a, h) {
          var y = -1, I = h.length, O = I > 1 ? h[I - 1] : t, P = I > 2 ? h[2] : t;
          for (O = r.length > 3 && typeof O == "function" ? (I--, O) : t, P && kt(h[0], h[1], P) && (O = I < 3 ? t : O, I = 1), a = Ee(a); ++y < I; ) {
            var V = h[y];
            V && r(a, V, y, O);
          }
          return a;
        });
      }
      function Mg(r, a) {
        return function(h, y) {
          if (h == null)
            return h;
          if (!Jt(h))
            return r(h, y);
          for (var I = h.length, O = a ? I : -1, P = Ee(h); (a ? O-- : ++O < I) && y(P[O], O, P) !== !1; )
            ;
          return h;
        };
      }
      function Kg(r) {
        return function(a, h, y) {
          for (var I = -1, O = Ee(a), P = y(a), V = P.length; V--; ) {
            var Z = P[r ? V : ++I];
            if (h(O[Z], Z, O) === !1)
              break;
          }
          return a;
        };
      }
      function vQ(r, a, h) {
        var y = a & b, I = Xo(r);
        function O() {
          var P = this && this !== et && this instanceof O ? I : r;
          return P.apply(y ? h : this, arguments);
        }
        return O;
      }
      function Rg(r) {
        return function(a) {
          a = Oe(a);
          var h = tr(a) ? vt(a) : t, y = h ? h[0] : a.charAt(0), I = h ? fi(h, 1).join("") : a.slice(1);
          return y[r]() + I;
        };
      }
      function Sa(r) {
        return function(a) {
          return AA(MB(NB(a).replace(Bu, "")), r, "");
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
          var h = Ia(r.prototype), y = r.apply(h, a);
          return Ye(y) ? y : h;
        };
      }
      function yQ(r, a, h) {
        var y = Xo(r);
        function I() {
          for (var O = arguments.length, P = iA(O), V = O, Z = La(I); V--; )
            P[V] = arguments[V];
          var pA = O < 3 && P[0] !== Z && P[O - 1] !== Z ? [] : nr(P, Z);
          if (O -= pA.length, O < h)
            return Vg(
              r,
              a,
              Pu,
              I.placeholder,
              t,
              P,
              pA,
              t,
              t,
              h - O
            );
          var gA = this && this !== et && this instanceof I ? y : r;
          return o(gA, this, P);
        }
        return I;
      }
      function $g(r) {
        return function(a, h, y) {
          var I = Ee(a);
          if (!Jt(a)) {
            var O = jA(h, 3);
            a = Bt(a), h = function(V) {
              return O(I[V], V, I);
            };
          }
          var P = r(a, h, y);
          return P > -1 ? I[O ? a[P] : P] : t;
        };
      }
      function Pg(r) {
        return Sr(function(a) {
          var h = a.length, y = h, I = gn.prototype.thru;
          for (r && a.reverse(); y--; ) {
            var O = a[y];
            if (typeof O != "function")
              throw new yt(l);
            if (I && !P && Wu(O) == "wrapper")
              var P = new gn([], !0);
          }
          for (y = P ? y : h; ++y < h; ) {
            O = a[y];
            var V = Wu(O), Z = V == "wrapper" ? Pf(O) : t;
            Z && Wf(Z[0]) && Z[1] == (Y | R | K | dA) && !Z[4].length && Z[9] == 1 ? P = P[Wu(Z[0])].apply(P, Z[3]) : P = O.length == 1 && Wf(O) ? P[V]() : P.thru(O);
          }
          return function() {
            var pA = arguments, gA = pA[0];
            if (P && pA.length == 1 && ce(gA))
              return P.plant(gA).value();
            for (var QA = 0, LA = h ? a[QA].apply(this, pA) : gA; ++QA < h; )
              LA = a[QA].call(this, LA);
            return LA;
          };
        });
      }
      function Pu(r, a, h, y, I, O, P, V, Z, pA) {
        var gA = a & Y, QA = a & b, LA = a & E, PA = a & (R | x), Ae = a & cA, pe = LA ? t : Xo(r);
        function ee() {
          for (var Ce = arguments.length, be = iA(Ce), sn = Ce; sn--; )
            be[sn] = arguments[sn];
          if (PA)
            var Gt = La(ee), un = Ur(be, Gt);
          if (y && (be = Og(be, y, I, PA)), O && (be = Ng(be, O, P, PA)), Ce -= un, PA && Ce < pA) {
            var it = nr(be, Gt);
            return Vg(
              r,
              a,
              Pu,
              ee.placeholder,
              h,
              be,
              it,
              V,
              Z,
              pA - Ce
            );
          }
          var $n = QA ? h : this, Or = LA ? $n[r] : r;
          return Ce = be.length, V ? be = $Q(be, V) : Ae && Ce > 1 && be.reverse(), gA && Z < Ce && (be.length = Z), this && this !== et && this instanceof ee && (Or = pe || Xo(Or)), Or.apply($n, be);
        }
        return ee;
      }
      function kg(r, a) {
        return function(h, y) {
          return zC(h, r, a(y), {});
        };
      }
      function ku(r, a) {
        return function(h, y) {
          var I;
          if (h === t && y === t)
            return a;
          if (h !== t && (I = h), y !== t) {
            if (I === t)
              return y;
            typeof h == "string" || typeof y == "string" ? (h = an(h), y = an(y)) : (h = _g(h), y = _g(y)), I = r(h, y);
          }
          return I;
        };
      }
      function Mf(r) {
        return Sr(function(a) {
          return a = W(a, $e(jA())), ge(function(h) {
            var y = this;
            return r(a, function(I) {
              return o(I, y, h);
            });
          });
        });
      }
      function Gu(r, a) {
        a = a === t ? " " : an(a);
        var h = a.length;
        if (h < 2)
          return h ? Hf(a, r) : a;
        var y = Hf(a, rr(r / ii(a)));
        return tr(a) ? fi(vt(y), 0, r).join("") : y.slice(0, r);
      }
      function CQ(r, a, h, y) {
        var I = a & b, O = Xo(r);
        function P() {
          for (var V = -1, Z = arguments.length, pA = -1, gA = y.length, QA = iA(gA + Z), LA = this && this !== et && this instanceof P ? O : r; ++pA < gA; )
            QA[pA] = y[pA];
          for (; Z--; )
            QA[pA++] = arguments[++V];
          return o(LA, I ? h : this, QA);
        }
        return P;
      }
      function Gg(r) {
        return function(a, h, y) {
          return y && typeof y != "number" && kt(a, h, y) && (h = y = t), a = Dr(a), h === t ? (h = a, a = 0) : h = Dr(h), y = y === t ? a < h ? 1 : -1 : Dr(y), oQ(a, h, y, r);
        };
      }
      function Vu(r) {
        return function(a, h) {
          return typeof a == "string" && typeof h == "string" || (a = vn(a), h = vn(h)), r(a, h);
        };
      }
      function Vg(r, a, h, y, I, O, P, V, Z, pA) {
        var gA = a & R, QA = gA ? P : t, LA = gA ? t : P, PA = gA ? O : t, Ae = gA ? t : O;
        a |= gA ? K : k, a &= ~(gA ? k : K), a & D || (a &= ~(b | E));
        var pe = [
          r,
          a,
          I,
          PA,
          QA,
          Ae,
          LA,
          V,
          Z,
          pA
        ], ee = h.apply(t, pe);
        return Wf(r) && nB(ee, pe), ee.placeholder = y, rB(ee, r, a);
      }
      function Kf(r) {
        var a = tt[r];
        return function(h, y) {
          if (h = vn(h), y = y == null ? 0 : Lt(de(y), 292), y && rg(h)) {
            var I = (Oe(h) + "e").split("e"), O = a(I[0] + "e" + (+I[1] + y));
            return I = (Oe(O) + "e").split("e"), +(I[0] + "e" + (+I[1] - y));
          }
          return a(h);
        };
      }
      var QQ = _a && 1 / Ea(new _a([, -0]))[1] == fA ? function(r) {
        return new _a(r);
      } : od;
      function Wg(r) {
        return function(a) {
          var h = Tt(a);
          return h == vA ? Do(a) : h == ke ? _u(a) : er(a, r(a));
        };
      }
      function Hr(r, a, h, y, I, O, P, V) {
        var Z = a & E;
        if (!Z && typeof r != "function")
          throw new yt(l);
        var pA = y ? y.length : 0;
        if (pA || (a &= ~(K | k), y = I = t), P = P === t ? P : ft(de(P), 0), V = V === t ? V : de(V), pA -= I ? I.length : 0, a & k) {
          var gA = y, QA = I;
          y = I = t;
        }
        var LA = Z ? t : Pf(r), PA = [
          r,
          a,
          h,
          y,
          I,
          gA,
          QA,
          O,
          P,
          V
        ];
        if (LA && MQ(PA, LA), r = PA[0], a = PA[1], h = PA[2], y = PA[3], I = PA[4], V = PA[9] = PA[9] === t ? Z ? 0 : r.length : ft(PA[9] - pA, 0), !V && a & (R | x) && (a &= ~(R | x)), !a || a == b)
          var Ae = vQ(r, a, h);
        else a == R || a == x ? Ae = yQ(r, a, V) : (a == K || a == (b | K)) && !I.length ? Ae = CQ(r, a, h, y) : Ae = Pu.apply(t, PA);
        var pe = LA ? Eg : nB;
        return rB(pe(Ae, PA), r, a);
      }
      function Xg(r, a, h, y) {
        return r === t || Rn(r, oi[h]) && !He.call(y, h) ? a : r;
      }
      function qg(r, a, h, y, I, O) {
        return Ye(r) && Ye(a) && (O.set(a, r), Mu(r, a, t, qg, O), O.delete(a)), r;
      }
      function FQ(r) {
        return Jo(r) ? t : r;
      }
      function zg(r, a, h, y, I, O) {
        var P = h & u, V = r.length, Z = a.length;
        if (V != Z && !(P && Z > V))
          return !1;
        var pA = O.get(r), gA = O.get(a);
        if (pA && gA)
          return pA == a && gA == r;
        var QA = -1, LA = !0, PA = h & U ? new $i() : t;
        for (O.set(r, a), O.set(a, r); ++QA < V; ) {
          var Ae = r[QA], pe = a[QA];
          if (y)
            var ee = P ? y(pe, Ae, QA, a, r, O) : y(Ae, pe, QA, r, a, O);
          if (ee !== t) {
            if (ee)
              continue;
            LA = !1;
            break;
          }
          if (PA) {
            if (!SA(a, function(Ce, be) {
              if (!Ni(PA, be) && (Ae === Ce || I(Ae, Ce, h, y, O)))
                return PA.push(be);
            })) {
              LA = !1;
              break;
            }
          } else if (!(Ae === pe || I(Ae, pe, h, y, O))) {
            LA = !1;
            break;
          }
        }
        return O.delete(r), O.delete(a), LA;
      }
      function UQ(r, a, h, y, I, O, P) {
        switch (h) {
          case mt:
            if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
              return !1;
            r = r.buffer, a = a.buffer;
          case _t:
            return !(r.byteLength != a.byteLength || !O(new HA(r), new HA(a)));
          case UA:
          case zA:
          case bA:
            return Rn(+r, +a);
          case JA:
            return r.name == a.name && r.message == a.message;
          case Te:
          case Ke:
            return r == a + "";
          case vA:
            var V = Do;
          case ke:
            var Z = y & u;
            if (V || (V = Ea), r.size != a.size && !Z)
              return !1;
            var pA = P.get(r);
            if (pA)
              return pA == a;
            y |= U, P.set(r, a);
            var gA = zg(V(r), V(a), y, I, O, P);
            return P.delete(r), gA;
          case _e:
            if ($o)
              return $o.call(r) == $o.call(a);
        }
        return !1;
      }
      function EQ(r, a, h, y, I, O) {
        var P = h & u, V = Rf(r), Z = V.length, pA = Rf(a), gA = pA.length;
        if (Z != gA && !P)
          return !1;
        for (var QA = Z; QA--; ) {
          var LA = V[QA];
          if (!(P ? LA in a : He.call(a, LA)))
            return !1;
        }
        var PA = O.get(r), Ae = O.get(a);
        if (PA && Ae)
          return PA == a && Ae == r;
        var pe = !0;
        O.set(r, a), O.set(a, r);
        for (var ee = P; ++QA < Z; ) {
          LA = V[QA];
          var Ce = r[LA], be = a[LA];
          if (y)
            var sn = P ? y(be, Ce, LA, a, r, O) : y(Ce, be, LA, r, a, O);
          if (!(sn === t ? Ce === be || I(Ce, be, h, y, O) : sn)) {
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
        return qf(eB(r, t, lB), r + "");
      }
      function Rf(r) {
        return pg(r, Bt, Gf);
      }
      function $f(r) {
        return pg(r, jt, Jg);
      }
      var Pf = Su ? function(r) {
        return Su.get(r);
      } : od;
      function Wu(r) {
        for (var a = r.name + "", h = xa[a], y = He.call(xa, a) ? h.length : 0; y--; ) {
          var I = h[y], O = I.func;
          if (O == null || O == r)
            return I.name;
        }
        return a;
      }
      function La(r) {
        var a = He.call(S, "placeholder") ? S : r;
        return a.placeholder;
      }
      function jA() {
        var r = S.iteratee || id;
        return r = r === id ? wg : r, arguments.length ? r(arguments[0], arguments[1]) : r;
      }
      function Xu(r, a) {
        var h = r.__data__;
        return TQ(a) ? h[typeof a == "string" ? "string" : "hash"] : h.map;
      }
      function kf(r) {
        for (var a = Bt(r), h = a.length; h--; ) {
          var y = a[h], I = r[y];
          a[h] = [y, I, Zg(I)];
        }
        return a;
      }
      function Gi(r, a) {
        var h = Eu(r, a);
        return Bg(h) ? h : t;
      }
      function bQ(r) {
        var a = He.call(r, Ge), h = r[Ge];
        try {
          r[Ge] = t;
          var y = !0;
        } catch {
        }
        var I = G.call(r);
        return y && (a ? r[Ge] = h : delete r[Ge]), I;
      }
      var Gf = Bf ? function(r) {
        return r == null ? [] : (r = Ee(r), F(Bf(r), function(a) {
          return ZA.call(r, a);
        }));
      } : sd, Jg = Bf ? function(r) {
        for (var a = []; r; )
          q(a, Gf(r)), r = re(r);
        return a;
      } : sd, Tt = Pt;
      (wf && Tt(new wf(new ArrayBuffer(1))) != mt || Mo && Tt(new Mo()) != vA || mf && Tt(mf.resolve()) != Ue || _a && Tt(new _a()) != ke || Ko && Tt(new Ko()) != bt) && (Tt = function(r) {
        var a = Pt(r), h = a == me ? r.constructor : t, y = h ? Vi(h) : "";
        if (y)
          switch (y) {
            case uC:
              return mt;
            case lC:
              return vA;
            case cC:
              return Ue;
            case fC:
              return ke;
            case dC:
              return bt;
          }
        return a;
      });
      function _Q(r, a, h) {
        for (var y = -1, I = h.length; ++y < I; ) {
          var O = h[y], P = O.size;
          switch (O.type) {
            case "drop":
              r += P;
              break;
            case "dropRight":
              a -= P;
              break;
            case "take":
              a = Lt(a, r + P);
              break;
            case "takeRight":
              r = ft(r, a - P);
              break;
          }
        }
        return { start: r, end: a };
      }
      function xQ(r) {
        var a = r.match(Au);
        return a ? a[1].split(da) : [];
      }
      function jg(r, a, h) {
        a = ci(a, r);
        for (var y = -1, I = a.length, O = !1; ++y < I; ) {
          var P = or(a[y]);
          if (!(O = r != null && h(r, P)))
            break;
          r = r[P];
        }
        return O || ++y != I ? O : (I = r == null ? 0 : r.length, !!I && Al(I) && Lr(P, I) && (ce(r) || Wi(r)));
      }
      function IQ(r) {
        var a = r.length, h = new r.constructor(a);
        return a && typeof r[0] == "string" && He.call(r, "index") && (h.index = r.index, h.input = r.input), h;
      }
      function Yg(r) {
        return typeof r.constructor == "function" && !qo(r) ? Ia(re(r)) : {};
      }
      function HQ(r, a, h) {
        var y = r.constructor;
        switch (a) {
          case _t:
            return Nf(r);
          case UA:
          case zA:
            return new y(+r);
          case mt:
            return hQ(r, h);
          case dn:
          case vr:
          case xi:
          case zr:
          case Jr:
          case lA:
          case DA:
          case XA:
          case ve:
            return Tg(r, h);
          case vA:
            return new y();
          case bA:
          case Ke:
            return new y(r);
          case Te:
            return pQ(r);
          case ke:
            return new y();
          case _e:
            return gQ(r);
        }
      }
      function SQ(r, a) {
        var h = a.length;
        if (!h)
          return r;
        var y = h - 1;
        return a[y] = (h > 1 ? "& " : "") + a[y], a = a.join(h > 2 ? ", " : " "), r.replace(Zs, `{
/* [wrapped with ` + a + `] */
`);
      }
      function LQ(r) {
        return ce(r) || Wi(r) || !!(Se && r && r[Se]);
      }
      function Lr(r, a) {
        var h = typeof r;
        return a = a ?? _A, !!a && (h == "number" || h != "symbol" && Yc.test(r)) && r > -1 && r % 1 == 0 && r < a;
      }
      function kt(r, a, h) {
        if (!Ye(h))
          return !1;
        var y = typeof a;
        return (y == "number" ? Jt(h) && Lr(a, h.length) : y == "string" && a in h) ? Rn(h[a], r) : !1;
      }
      function Vf(r, a) {
        if (ce(r))
          return !1;
        var h = typeof r;
        return h == "number" || h == "symbol" || h == "boolean" || r == null || on(r) ? !0 : yr.test(r) || !Yr.test(r) || a != null && r in Ee(a);
      }
      function TQ(r) {
        var a = typeof r;
        return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
      }
      function Wf(r) {
        var a = Wu(r), h = S[a];
        if (typeof h != "function" || !(a in Qe.prototype))
          return !1;
        if (r === h)
          return !0;
        var y = Pf(h);
        return !!y && r === y[0];
      }
      function DQ(r) {
        return !!N && N in r;
      }
      var OQ = br ? Tr : ud;
      function qo(r) {
        var a = r && r.constructor, h = typeof a == "function" && a.prototype || oi;
        return r === h;
      }
      function Zg(r) {
        return r === r && !Ye(r);
      }
      function AB(r, a) {
        return function(h) {
          return h == null ? !1 : h[r] === a && (a !== t || r in Ee(h));
        };
      }
      function NQ(r) {
        var a = Yu(r, function(y) {
          return h.size === p && h.clear(), y;
        }), h = a.cache;
        return a;
      }
      function MQ(r, a) {
        var h = r[1], y = a[1], I = h | y, O = I < (b | E | Y), P = y == Y && h == R || y == Y && h == dA && r[7].length <= a[8] || y == (Y | dA) && a[7].length <= a[8] && h == R;
        if (!(O || P))
          return r;
        y & b && (r[2] = a[2], I |= h & b ? 0 : D);
        var V = a[3];
        if (V) {
          var Z = r[3];
          r[3] = Z ? Og(Z, V, a[4]) : V, r[4] = Z ? nr(r[3], B) : a[4];
        }
        return V = a[5], V && (Z = r[5], r[5] = Z ? Ng(Z, V, a[6]) : V, r[6] = Z ? nr(r[5], B) : a[6]), V = a[7], V && (r[7] = V), y & Y && (r[8] = r[8] == null ? a[8] : Lt(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = I, r;
      }
      function KQ(r) {
        var a = [];
        if (r != null)
          for (var h in Ee(r))
            a.push(h);
        return a;
      }
      function RQ(r) {
        return G.call(r);
      }
      function eB(r, a, h) {
        return a = ft(a === t ? r.length - 1 : a, 0), function() {
          for (var y = arguments, I = -1, O = ft(y.length - a, 0), P = iA(O); ++I < O; )
            P[I] = y[a + I];
          I = -1;
          for (var V = iA(a + 1); ++I < a; )
            V[I] = y[I];
          return V[a] = h(P), o(r, this, V);
        };
      }
      function tB(r, a) {
        return a.length < 2 ? r : ki(r, wn(a, 0, -1));
      }
      function $Q(r, a) {
        for (var h = r.length, y = Lt(a.length, h), I = zt(r); y--; ) {
          var O = a[y];
          r[y] = Lr(O, h) ? I[O] : t;
        }
        return r;
      }
      function Xf(r, a) {
        if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
          return r[a];
      }
      var nB = iB(Eg), zo = Ki || function(r, a) {
        return et.setTimeout(r, a);
      }, qf = iB(lQ);
      function rB(r, a, h) {
        var y = a + "";
        return qf(r, SQ(y, PQ(xQ(y), h)));
      }
      function iB(r) {
        var a = 0, h = 0;
        return function() {
          var y = aC(), I = xA - (y - h);
          if (h = y, I > 0) {
            if (++a >= NA)
              return arguments[0];
          } else
            a = 0;
          return r.apply(t, arguments);
        };
      }
      function qu(r, a) {
        var h = -1, y = r.length, I = y - 1;
        for (a = a === t ? y : a; ++h < a; ) {
          var O = If(h, I), P = r[O];
          r[O] = r[h], r[h] = P;
        }
        return r.length = a, r;
      }
      var aB = NQ(function(r) {
        var a = [];
        return r.charCodeAt(0) === 46 && a.push(""), r.replace(Ys, function(h, y, I, O) {
          a.push(I ? O.replace(yo, "$1") : y || h);
        }), a;
      });
      function or(r) {
        if (typeof r == "string" || on(r))
          return r;
        var a = r + "";
        return a == "0" && 1 / r == -fA ? "-0" : a;
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
      function PQ(r, a) {
        return g(L, function(h) {
          var y = "_." + h[0];
          a & h[1] && !H(r, y) && r.push(y);
        }), r.sort();
      }
      function oB(r) {
        if (r instanceof Qe)
          return r.clone();
        var a = new gn(r.__wrapped__, r.__chain__);
        return a.__actions__ = zt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
      }
      function kQ(r, a, h) {
        (h ? kt(r, a, h) : a === t) ? a = 1 : a = ft(de(a), 0);
        var y = r == null ? 0 : r.length;
        if (!y || a < 1)
          return [];
        for (var I = 0, O = 0, P = iA(rr(y / a)); I < y; )
          P[O++] = wn(r, I, I += a);
        return P;
      }
      function GQ(r) {
        for (var a = -1, h = r == null ? 0 : r.length, y = 0, I = []; ++a < h; ) {
          var O = r[a];
          O && (I[y++] = O);
        }
        return I;
      }
      function VQ() {
        var r = arguments.length;
        if (!r)
          return [];
        for (var a = iA(r - 1), h = arguments[0], y = r; y--; )
          a[y - 1] = arguments[y];
        return q(ce(h) ? zt(h) : [h], Ct(a, 1));
      }
      var WQ = ge(function(r, a) {
        return rt(r) ? ko(r, Ct(a, 1, rt, !0)) : [];
      }), XQ = ge(function(r, a) {
        var h = mn(a);
        return rt(h) && (h = t), rt(r) ? ko(r, Ct(a, 1, rt, !0), jA(h, 2)) : [];
      }), qQ = ge(function(r, a) {
        var h = mn(a);
        return rt(h) && (h = t), rt(r) ? ko(r, Ct(a, 1, rt, !0), t, h) : [];
      });
      function zQ(r, a, h) {
        var y = r == null ? 0 : r.length;
        return y ? (a = h || a === t ? 1 : de(a), wn(r, a < 0 ? 0 : a, y)) : [];
      }
      function JQ(r, a, h) {
        var y = r == null ? 0 : r.length;
        return y ? (a = h || a === t ? 1 : de(a), a = y - a, wn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function jQ(r, a) {
        return r && r.length ? Ru(r, jA(a, 3), !0, !0) : [];
      }
      function YQ(r, a) {
        return r && r.length ? Ru(r, jA(a, 3), !0) : [];
      }
      function ZQ(r, a, h, y) {
        var I = r == null ? 0 : r.length;
        return I ? (h && typeof h != "number" && kt(r, a, h) && (h = 0, y = I), VC(r, a, h, y)) : [];
      }
      function sB(r, a, h) {
        var y = r == null ? 0 : r.length;
        if (!y)
          return -1;
        var I = h == null ? 0 : de(h);
        return I < 0 && (I = ft(y + I, 0)), pt(r, jA(a, 3), I);
      }
      function uB(r, a, h) {
        var y = r == null ? 0 : r.length;
        if (!y)
          return -1;
        var I = y - 1;
        return h !== t && (I = de(h), I = h < 0 ? ft(y + I, 0) : Lt(I, y - 1)), pt(r, jA(a, 3), I, !0);
      }
      function lB(r) {
        var a = r == null ? 0 : r.length;
        return a ? Ct(r, 1) : [];
      }
      function AF(r) {
        var a = r == null ? 0 : r.length;
        return a ? Ct(r, fA) : [];
      }
      function eF(r, a) {
        var h = r == null ? 0 : r.length;
        return h ? (a = a === t ? 1 : de(a), Ct(r, a)) : [];
      }
      function tF(r) {
        for (var a = -1, h = r == null ? 0 : r.length, y = {}; ++a < h; ) {
          var I = r[a];
          y[I[0]] = I[1];
        }
        return y;
      }
      function cB(r) {
        return r && r.length ? r[0] : t;
      }
      function nF(r, a, h) {
        var y = r == null ? 0 : r.length;
        if (!y)
          return -1;
        var I = h == null ? 0 : de(h);
        return I < 0 && (I = ft(y + I, 0)), Je(r, a, I);
      }
      function rF(r) {
        var a = r == null ? 0 : r.length;
        return a ? wn(r, 0, -1) : [];
      }
      var iF = ge(function(r) {
        var a = W(r, Df);
        return a.length && a[0] === r[0] ? Uf(a) : [];
      }), aF = ge(function(r) {
        var a = mn(r), h = W(r, Df);
        return a === mn(h) ? a = t : h.pop(), h.length && h[0] === r[0] ? Uf(h, jA(a, 2)) : [];
      }), oF = ge(function(r) {
        var a = mn(r), h = W(r, Df);
        return a = typeof a == "function" ? a : t, a && h.pop(), h.length && h[0] === r[0] ? Uf(h, t, a) : [];
      });
      function sF(r, a) {
        return r == null ? "" : rC.call(r, a);
      }
      function mn(r) {
        var a = r == null ? 0 : r.length;
        return a ? r[a - 1] : t;
      }
      function uF(r, a, h) {
        var y = r == null ? 0 : r.length;
        if (!y)
          return -1;
        var I = y;
        return h !== t && (I = de(h), I = I < 0 ? ft(y + I, 0) : Lt(I, y - 1)), a === a ? hf(r, a, I) : pt(r, RA, I, !0);
      }
      function lF(r, a) {
        return r && r.length ? Cg(r, de(a)) : t;
      }
      var cF = ge(fB);
      function fB(r, a) {
        return r && r.length && a && a.length ? xf(r, a) : r;
      }
      function fF(r, a, h) {
        return r && r.length && a && a.length ? xf(r, a, jA(h, 2)) : r;
      }
      function dF(r, a, h) {
        return r && r.length && a && a.length ? xf(r, a, t, h) : r;
      }
      var hF = Sr(function(r, a) {
        var h = r == null ? 0 : r.length, y = yf(r, a);
        return Ug(r, W(a, function(I) {
          return Lr(I, h) ? +I : I;
        }).sort(Dg)), y;
      });
      function pF(r, a) {
        var h = [];
        if (!(r && r.length))
          return h;
        var y = -1, I = [], O = r.length;
        for (a = jA(a, 3); ++y < O; ) {
          var P = r[y];
          a(P, y, r) && (h.push(P), I.push(y));
        }
        return Ug(r, I), h;
      }
      function zf(r) {
        return r == null ? r : sC.call(r);
      }
      function gF(r, a, h) {
        var y = r == null ? 0 : r.length;
        return y ? (h && typeof h != "number" && kt(r, a, h) ? (a = 0, h = y) : (a = a == null ? 0 : de(a), h = h === t ? y : de(h)), wn(r, a, h)) : [];
      }
      function BF(r, a) {
        return Ku(r, a);
      }
      function wF(r, a, h) {
        return Sf(r, a, jA(h, 2));
      }
      function mF(r, a) {
        var h = r == null ? 0 : r.length;
        if (h) {
          var y = Ku(r, a);
          if (y < h && Rn(r[y], a))
            return y;
        }
        return -1;
      }
      function vF(r, a) {
        return Ku(r, a, !0);
      }
      function yF(r, a, h) {
        return Sf(r, a, jA(h, 2), !0);
      }
      function CF(r, a) {
        var h = r == null ? 0 : r.length;
        if (h) {
          var y = Ku(r, a, !0) - 1;
          if (Rn(r[y], a))
            return y;
        }
        return -1;
      }
      function QF(r) {
        return r && r.length ? bg(r) : [];
      }
      function FF(r, a) {
        return r && r.length ? bg(r, jA(a, 2)) : [];
      }
      function UF(r) {
        var a = r == null ? 0 : r.length;
        return a ? wn(r, 1, a) : [];
      }
      function EF(r, a, h) {
        return r && r.length ? (a = h || a === t ? 1 : de(a), wn(r, 0, a < 0 ? 0 : a)) : [];
      }
      function bF(r, a, h) {
        var y = r == null ? 0 : r.length;
        return y ? (a = h || a === t ? 1 : de(a), a = y - a, wn(r, a < 0 ? 0 : a, y)) : [];
      }
      function _F(r, a) {
        return r && r.length ? Ru(r, jA(a, 3), !1, !0) : [];
      }
      function xF(r, a) {
        return r && r.length ? Ru(r, jA(a, 3)) : [];
      }
      var IF = ge(function(r) {
        return li(Ct(r, 1, rt, !0));
      }), HF = ge(function(r) {
        var a = mn(r);
        return rt(a) && (a = t), li(Ct(r, 1, rt, !0), jA(a, 2));
      }), SF = ge(function(r) {
        var a = mn(r);
        return a = typeof a == "function" ? a : t, li(Ct(r, 1, rt, !0), t, a);
      });
      function LF(r) {
        return r && r.length ? li(r) : [];
      }
      function TF(r, a) {
        return r && r.length ? li(r, jA(a, 2)) : [];
      }
      function DF(r, a) {
        return a = typeof a == "function" ? a : t, r && r.length ? li(r, t, a) : [];
      }
      function Jf(r) {
        if (!(r && r.length))
          return [];
        var a = 0;
        return r = F(r, function(h) {
          if (rt(h))
            return a = ft(h.length, a), !0;
        }), Tn(a, function(h) {
          return W(r, le(h));
        });
      }
      function dB(r, a) {
        if (!(r && r.length))
          return [];
        var h = Jf(r);
        return a == null ? h : W(h, function(y) {
          return o(a, t, y);
        });
      }
      var OF = ge(function(r, a) {
        return rt(r) ? ko(r, a) : [];
      }), NF = ge(function(r) {
        return Tf(F(r, rt));
      }), MF = ge(function(r) {
        var a = mn(r);
        return rt(a) && (a = t), Tf(F(r, rt), jA(a, 2));
      }), KF = ge(function(r) {
        var a = mn(r);
        return a = typeof a == "function" ? a : t, Tf(F(r, rt), t, a);
      }), RF = ge(Jf);
      function $F(r, a) {
        return Hg(r || [], a || [], Po);
      }
      function PF(r, a) {
        return Hg(r || [], a || [], Wo);
      }
      var kF = ge(function(r) {
        var a = r.length, h = a > 1 ? r[a - 1] : t;
        return h = typeof h == "function" ? (r.pop(), h) : t, dB(r, h);
      });
      function hB(r) {
        var a = S(r);
        return a.__chain__ = !0, a;
      }
      function GF(r, a) {
        return a(r), r;
      }
      function zu(r, a) {
        return a(r);
      }
      var VF = Sr(function(r) {
        var a = r.length, h = a ? r[0] : 0, y = this.__wrapped__, I = function(O) {
          return yf(O, r);
        };
        return a > 1 || this.__actions__.length || !(y instanceof Qe) || !Lr(h) ? this.thru(I) : (y = y.slice(h, +h + (a ? 1 : 0)), y.__actions__.push({
          func: zu,
          args: [I],
          thisArg: t
        }), new gn(y, this.__chain__).thru(function(O) {
          return a && !O.length && O.push(t), O;
        }));
      });
      function WF() {
        return hB(this);
      }
      function XF() {
        return new gn(this.value(), this.__chain__);
      }
      function qF() {
        this.__values__ === t && (this.__values__ = _B(this.value()));
        var r = this.__index__ >= this.__values__.length, a = r ? t : this.__values__[this.__index__++];
        return { done: r, value: a };
      }
      function zF() {
        return this;
      }
      function JF(r) {
        for (var a, h = this; h instanceof Tu; ) {
          var y = oB(h);
          y.__index__ = 0, y.__values__ = t, a ? I.__wrapped__ = y : a = y;
          var I = y;
          h = h.__wrapped__;
        }
        return I.__wrapped__ = r, a;
      }
      function jF() {
        var r = this.__wrapped__;
        if (r instanceof Qe) {
          var a = r;
          return this.__actions__.length && (a = new Qe(this)), a = a.reverse(), a.__actions__.push({
            func: zu,
            args: [zf],
            thisArg: t
          }), new gn(a, this.__chain__);
        }
        return this.thru(zf);
      }
      function YF() {
        return Ig(this.__wrapped__, this.__actions__);
      }
      var ZF = $u(function(r, a, h) {
        He.call(r, h) ? ++r[h] : Ir(r, h, 1);
      });
      function AU(r, a, h) {
        var y = ce(r) ? C : GC;
        return h && kt(r, a, h) && (a = t), y(r, jA(a, 3));
      }
      function eU(r, a) {
        var h = ce(r) ? F : dg;
        return h(r, jA(a, 3));
      }
      var tU = $g(sB), nU = $g(uB);
      function rU(r, a) {
        return Ct(Ju(r, a), 1);
      }
      function iU(r, a) {
        return Ct(Ju(r, a), fA);
      }
      function aU(r, a, h) {
        return h = h === t ? 1 : de(h), Ct(Ju(r, a), h);
      }
      function pB(r, a) {
        var h = ce(r) ? g : ui;
        return h(r, jA(a, 3));
      }
      function gB(r, a) {
        var h = ce(r) ? m : fg;
        return h(r, jA(a, 3));
      }
      var oU = $u(function(r, a, h) {
        He.call(r, h) ? r[h].push(a) : Ir(r, h, [a]);
      });
      function sU(r, a, h, y) {
        r = Jt(r) ? r : Da(r), h = h && !y ? de(h) : 0;
        var I = r.length;
        return h < 0 && (h = ft(I + h, 0)), el(r) ? h <= I && r.indexOf(a, h) > -1 : !!I && Je(r, a, h) > -1;
      }
      var uU = ge(function(r, a, h) {
        var y = -1, I = typeof a == "function", O = Jt(r) ? iA(r.length) : [];
        return ui(r, function(P) {
          O[++y] = I ? o(a, P, h) : Go(P, a, h);
        }), O;
      }), lU = $u(function(r, a, h) {
        Ir(r, h, a);
      });
      function Ju(r, a) {
        var h = ce(r) ? W : mg;
        return h(r, jA(a, 3));
      }
      function cU(r, a, h, y) {
        return r == null ? [] : (ce(a) || (a = a == null ? [] : [a]), h = y ? t : h, ce(h) || (h = h == null ? [] : [h]), Qg(r, a, h));
      }
      var fU = $u(function(r, a, h) {
        r[h ? 0 : 1].push(a);
      }, function() {
        return [[], []];
      });
      function dU(r, a, h) {
        var y = ce(r) ? AA : Ln, I = arguments.length < 3;
        return y(r, jA(a, 4), h, I, ui);
      }
      function hU(r, a, h) {
        var y = ce(r) ? mA : Ln, I = arguments.length < 3;
        return y(r, jA(a, 4), h, I, fg);
      }
      function pU(r, a) {
        var h = ce(r) ? F : dg;
        return h(r, Zu(jA(a, 3)));
      }
      function gU(r) {
        var a = ce(r) ? sg : sQ;
        return a(r);
      }
      function BU(r, a, h) {
        (h ? kt(r, a, h) : a === t) ? a = 1 : a = de(a);
        var y = ce(r) ? KC : uQ;
        return y(r, a);
      }
      function wU(r) {
        var a = ce(r) ? RC : cQ;
        return a(r);
      }
      function mU(r) {
        if (r == null)
          return 0;
        if (Jt(r))
          return el(r) ? ii(r) : r.length;
        var a = Tt(r);
        return a == vA || a == ke ? r.size : bf(r).length;
      }
      function vU(r, a, h) {
        var y = ce(r) ? SA : fQ;
        return h && kt(r, a, h) && (a = t), y(r, jA(a, 3));
      }
      var yU = ge(function(r, a) {
        if (r == null)
          return [];
        var h = a.length;
        return h > 1 && kt(r, a[0], a[1]) ? a = [] : h > 2 && kt(a[0], a[1], a[2]) && (a = [a[0]]), Qg(r, Ct(a, 1), []);
      }), ju = We || function() {
        return et.Date.now();
      };
      function CU(r, a) {
        if (typeof a != "function")
          throw new yt(l);
        return r = de(r), function() {
          if (--r < 1)
            return a.apply(this, arguments);
        };
      }
      function BB(r, a, h) {
        return a = h ? t : a, a = r && a == null ? r.length : a, Hr(r, Y, t, t, t, t, a);
      }
      function wB(r, a) {
        var h;
        if (typeof a != "function")
          throw new yt(l);
        return r = de(r), function() {
          return --r > 0 && (h = a.apply(this, arguments)), r <= 1 && (a = t), h;
        };
      }
      var jf = ge(function(r, a, h) {
        var y = b;
        if (h.length) {
          var I = nr(h, La(jf));
          y |= K;
        }
        return Hr(r, y, a, h, I);
      }), mB = ge(function(r, a, h) {
        var y = b | E;
        if (h.length) {
          var I = nr(h, La(mB));
          y |= K;
        }
        return Hr(a, y, r, h, I);
      });
      function vB(r, a, h) {
        a = h ? t : a;
        var y = Hr(r, R, t, t, t, t, t, a);
        return y.placeholder = vB.placeholder, y;
      }
      function yB(r, a, h) {
        a = h ? t : a;
        var y = Hr(r, x, t, t, t, t, t, a);
        return y.placeholder = yB.placeholder, y;
      }
      function CB(r, a, h) {
        var y, I, O, P, V, Z, pA = 0, gA = !1, QA = !1, LA = !0;
        if (typeof r != "function")
          throw new yt(l);
        a = vn(a) || 0, Ye(h) && (gA = !!h.leading, QA = "maxWait" in h, O = QA ? ft(vn(h.maxWait) || 0, a) : O, LA = "trailing" in h ? !!h.trailing : LA);
        function PA(it) {
          var $n = y, Or = I;
          return y = I = t, pA = it, P = r.apply(Or, $n), P;
        }
        function Ae(it) {
          return pA = it, V = zo(Ce, a), gA ? PA(it) : P;
        }
        function pe(it) {
          var $n = it - Z, Or = it - pA, $B = a - $n;
          return QA ? Lt($B, O - Or) : $B;
        }
        function ee(it) {
          var $n = it - Z, Or = it - pA;
          return Z === t || $n >= a || $n < 0 || QA && Or >= O;
        }
        function Ce() {
          var it = ju();
          if (ee(it))
            return be(it);
          V = zo(Ce, pe(it));
        }
        function be(it) {
          return V = t, LA && y ? PA(it) : (y = I = t, P);
        }
        function sn() {
          V !== t && Sg(V), pA = 0, y = Z = I = V = t;
        }
        function Gt() {
          return V === t ? P : be(ju());
        }
        function un() {
          var it = ju(), $n = ee(it);
          if (y = arguments, I = this, Z = it, $n) {
            if (V === t)
              return Ae(Z);
            if (QA)
              return Sg(V), V = zo(Ce, a), PA(Z);
          }
          return V === t && (V = zo(Ce, a)), P;
        }
        return un.cancel = sn, un.flush = Gt, un;
      }
      var QU = ge(function(r, a) {
        return cg(r, 1, a);
      }), FU = ge(function(r, a, h) {
        return cg(r, vn(a) || 0, h);
      });
      function UU(r) {
        return Hr(r, cA);
      }
      function Yu(r, a) {
        if (typeof r != "function" || a != null && typeof a != "function")
          throw new yt(l);
        var h = function() {
          var y = arguments, I = a ? a.apply(this, y) : y[0], O = h.cache;
          if (O.has(I))
            return O.get(I);
          var P = r.apply(this, y);
          return h.cache = O.set(I, P) || O, P;
        };
        return h.cache = new (Yu.Cache || xr)(), h;
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
      function EU(r) {
        return wB(2, r);
      }
      var bU = dQ(function(r, a) {
        a = a.length == 1 && ce(a[0]) ? W(a[0], $e(jA())) : W(Ct(a, 1), $e(jA()));
        var h = a.length;
        return ge(function(y) {
          for (var I = -1, O = Lt(y.length, h); ++I < O; )
            y[I] = a[I].call(this, y[I]);
          return o(r, this, y);
        });
      }), Yf = ge(function(r, a) {
        var h = nr(a, La(Yf));
        return Hr(r, K, t, a, h);
      }), QB = ge(function(r, a) {
        var h = nr(a, La(QB));
        return Hr(r, k, t, a, h);
      }), _U = Sr(function(r, a) {
        return Hr(r, dA, t, t, t, a);
      });
      function xU(r, a) {
        if (typeof r != "function")
          throw new yt(l);
        return a = a === t ? a : de(a), ge(r, a);
      }
      function IU(r, a) {
        if (typeof r != "function")
          throw new yt(l);
        return a = a == null ? 0 : ft(de(a), 0), ge(function(h) {
          var y = h[a], I = fi(h, 0, a);
          return y && q(I, y), o(r, this, I);
        });
      }
      function HU(r, a, h) {
        var y = !0, I = !0;
        if (typeof r != "function")
          throw new yt(l);
        return Ye(h) && (y = "leading" in h ? !!h.leading : y, I = "trailing" in h ? !!h.trailing : I), CB(r, a, {
          leading: y,
          maxWait: a,
          trailing: I
        });
      }
      function SU(r) {
        return BB(r, 1);
      }
      function LU(r, a) {
        return Yf(Of(a), r);
      }
      function TU() {
        if (!arguments.length)
          return [];
        var r = arguments[0];
        return ce(r) ? r : [r];
      }
      function DU(r) {
        return Bn(r, Q);
      }
      function OU(r, a) {
        return a = typeof a == "function" ? a : t, Bn(r, Q, a);
      }
      function NU(r) {
        return Bn(r, w | Q);
      }
      function MU(r, a) {
        return a = typeof a == "function" ? a : t, Bn(r, w | Q, a);
      }
      function KU(r, a) {
        return a == null || lg(r, a, Bt(a));
      }
      function Rn(r, a) {
        return r === a || r !== r && a !== a;
      }
      var RU = Vu(Ff), $U = Vu(function(r, a) {
        return r >= a;
      }), Wi = gg(/* @__PURE__ */ function() {
        return arguments;
      }()) ? gg : function(r) {
        return At(r) && He.call(r, "callee") && !ZA.call(r, "callee");
      }, ce = iA.isArray, PU = Io ? $e(Io) : JC;
      function Jt(r) {
        return r != null && Al(r.length) && !Tr(r);
      }
      function rt(r) {
        return At(r) && Jt(r);
      }
      function kU(r) {
        return r === !0 || r === !1 || At(r) && Pt(r) == UA;
      }
      var di = nC || ud, GU = Qa ? $e(Qa) : jC;
      function VU(r) {
        return At(r) && r.nodeType === 1 && !Jo(r);
      }
      function WU(r) {
        if (r == null)
          return !0;
        if (Jt(r) && (ce(r) || typeof r == "string" || typeof r.splice == "function" || di(r) || Ta(r) || Wi(r)))
          return !r.length;
        var a = Tt(r);
        if (a == vA || a == ke)
          return !r.size;
        if (qo(r))
          return !bf(r).length;
        for (var h in r)
          if (He.call(r, h))
            return !1;
        return !0;
      }
      function XU(r, a) {
        return Vo(r, a);
      }
      function qU(r, a, h) {
        h = typeof h == "function" ? h : t;
        var y = h ? h(r, a) : t;
        return y === t ? Vo(r, a, t, h) : !!y;
      }
      function Zf(r) {
        if (!At(r))
          return !1;
        var a = Pt(r);
        return a == JA || a == ne || typeof r.message == "string" && typeof r.name == "string" && !Jo(r);
      }
      function zU(r) {
        return typeof r == "number" && rg(r);
      }
      function Tr(r) {
        if (!Ye(r))
          return !1;
        var a = Pt(r);
        return a == $A || a == sA || a == FA || a == Ze;
      }
      function FB(r) {
        return typeof r == "number" && r == de(r);
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
      var UB = Ho ? $e(Ho) : ZC;
      function JU(r, a) {
        return r === a || Ef(r, a, kf(a));
      }
      function jU(r, a, h) {
        return h = typeof h == "function" ? h : t, Ef(r, a, kf(a), h);
      }
      function YU(r) {
        return EB(r) && r != +r;
      }
      function ZU(r) {
        if (OQ(r))
          throw new ae(s);
        return Bg(r);
      }
      function AE(r) {
        return r === null;
      }
      function eE(r) {
        return r == null;
      }
      function EB(r) {
        return typeof r == "number" || At(r) && Pt(r) == bA;
      }
      function Jo(r) {
        if (!At(r) || Pt(r) != me)
          return !1;
        var a = re(r);
        if (a === null)
          return !0;
        var h = He.call(a, "constructor") && a.constructor;
        return typeof h == "function" && h instanceof h && si.call(h) == z;
      }
      var Ad = So ? $e(So) : AQ;
      function tE(r) {
        return FB(r) && r >= -_A && r <= _A;
      }
      var bB = Fu ? $e(Fu) : eQ;
      function el(r) {
        return typeof r == "string" || !ce(r) && At(r) && Pt(r) == Ke;
      }
      function on(r) {
        return typeof r == "symbol" || At(r) && Pt(r) == _e;
      }
      var Ta = Uu ? $e(Uu) : tQ;
      function nE(r) {
        return r === t;
      }
      function rE(r) {
        return At(r) && Tt(r) == bt;
      }
      function iE(r) {
        return At(r) && Pt(r) == Kt;
      }
      var aE = Vu(_f), oE = Vu(function(r, a) {
        return r <= a;
      });
      function _B(r) {
        if (!r)
          return [];
        if (Jt(r))
          return el(r) ? vt(r) : zt(r);
        if (qA && r[qA])
          return Ua(r[qA]());
        var a = Tt(r), h = a == vA ? Do : a == ke ? Ea : Da;
        return h(r);
      }
      function Dr(r) {
        if (!r)
          return r === 0 ? r : 0;
        if (r = vn(r), r === fA || r === -fA) {
          var a = r < 0 ? -1 : 1;
          return a * IA;
        }
        return r === r ? r : 0;
      }
      function de(r) {
        var a = Dr(r), h = a % 1;
        return a === a ? h ? a - h : a : 0;
      }
      function xB(r) {
        return r ? Pi(de(r), 0, T) : 0;
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
        var h = jc.test(r);
        return h || Qo.test(r) ? Cu(r.slice(2), h ? 2 : 8) : Zn.test(r) ? aA : +r;
      }
      function IB(r) {
        return ar(r, jt(r));
      }
      function sE(r) {
        return r ? Pi(de(r), -_A, _A) : r === 0 ? r : 0;
      }
      function Oe(r) {
        return r == null ? "" : an(r);
      }
      var uE = Ha(function(r, a) {
        if (qo(a) || Jt(a)) {
          ar(a, Bt(a), r);
          return;
        }
        for (var h in a)
          He.call(a, h) && Po(r, h, a[h]);
      }), HB = Ha(function(r, a) {
        ar(a, jt(a), r);
      }), tl = Ha(function(r, a, h, y) {
        ar(a, jt(a), r, y);
      }), lE = Ha(function(r, a, h, y) {
        ar(a, Bt(a), r, y);
      }), cE = Sr(yf);
      function fE(r, a) {
        var h = Ia(r);
        return a == null ? h : ug(h, a);
      }
      var dE = ge(function(r, a) {
        r = Ee(r);
        var h = -1, y = a.length, I = y > 2 ? a[2] : t;
        for (I && kt(a[0], a[1], I) && (y = 1); ++h < y; )
          for (var O = a[h], P = jt(O), V = -1, Z = P.length; ++V < Z; ) {
            var pA = P[V], gA = r[pA];
            (gA === t || Rn(gA, oi[pA]) && !He.call(r, pA)) && (r[pA] = O[pA]);
          }
        return r;
      }), hE = ge(function(r) {
        return r.push(t, qg), o(SB, t, r);
      });
      function pE(r, a) {
        return ue(r, jA(a, 3), ir);
      }
      function gE(r, a) {
        return ue(r, jA(a, 3), Qf);
      }
      function BE(r, a) {
        return r == null ? r : Cf(r, jA(a, 3), jt);
      }
      function wE(r, a) {
        return r == null ? r : hg(r, jA(a, 3), jt);
      }
      function mE(r, a) {
        return r && ir(r, jA(a, 3));
      }
      function vE(r, a) {
        return r && Qf(r, jA(a, 3));
      }
      function yE(r) {
        return r == null ? [] : Nu(r, Bt(r));
      }
      function CE(r) {
        return r == null ? [] : Nu(r, jt(r));
      }
      function ed(r, a, h) {
        var y = r == null ? t : ki(r, a);
        return y === t ? h : y;
      }
      function QE(r, a) {
        return r != null && jg(r, a, WC);
      }
      function td(r, a) {
        return r != null && jg(r, a, XC);
      }
      var FE = kg(function(r, a, h) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), r[a] = h;
      }, rd(Yt)), UE = kg(function(r, a, h) {
        a != null && typeof a.toString != "function" && (a = G.call(a)), He.call(r, a) ? r[a].push(h) : r[a] = [h];
      }, jA), EE = ge(Go);
      function Bt(r) {
        return Jt(r) ? og(r) : bf(r);
      }
      function jt(r) {
        return Jt(r) ? og(r, !0) : nQ(r);
      }
      function bE(r, a) {
        var h = {};
        return a = jA(a, 3), ir(r, function(y, I, O) {
          Ir(h, a(y, I, O), y);
        }), h;
      }
      function _E(r, a) {
        var h = {};
        return a = jA(a, 3), ir(r, function(y, I, O) {
          Ir(h, I, a(y, I, O));
        }), h;
      }
      var xE = Ha(function(r, a, h) {
        Mu(r, a, h);
      }), SB = Ha(function(r, a, h, y) {
        Mu(r, a, h, y);
      }), IE = Sr(function(r, a) {
        var h = {};
        if (r == null)
          return h;
        var y = !1;
        a = W(a, function(O) {
          return O = ci(O, r), y || (y = O.length > 1), O;
        }), ar(r, $f(r), h), y && (h = Bn(h, w | v | Q, FQ));
        for (var I = a.length; I--; )
          Lf(h, a[I]);
        return h;
      });
      function HE(r, a) {
        return LB(r, Zu(jA(a)));
      }
      var SE = Sr(function(r, a) {
        return r == null ? {} : iQ(r, a);
      });
      function LB(r, a) {
        if (r == null)
          return {};
        var h = W($f(r), function(y) {
          return [y];
        });
        return a = jA(a), Fg(r, h, function(y, I) {
          return a(y, I[0]);
        });
      }
      function LE(r, a, h) {
        a = ci(a, r);
        var y = -1, I = a.length;
        for (I || (I = 1, r = t); ++y < I; ) {
          var O = r == null ? t : r[or(a[y])];
          O === t && (y = I, O = h), r = Tr(O) ? O.call(r) : O;
        }
        return r;
      }
      function TE(r, a, h) {
        return r == null ? r : Wo(r, a, h);
      }
      function DE(r, a, h, y) {
        return y = typeof y == "function" ? y : t, r == null ? r : Wo(r, a, h, y);
      }
      var TB = Wg(Bt), DB = Wg(jt);
      function OE(r, a, h) {
        var y = ce(r), I = y || di(r) || Ta(r);
        if (a = jA(a, 4), h == null) {
          var O = r && r.constructor;
          I ? h = y ? new O() : [] : Ye(r) ? h = Tr(O) ? Ia(re(r)) : {} : h = {};
        }
        return (I ? g : ir)(r, function(P, V, Z) {
          return a(h, P, V, Z);
        }), h;
      }
      function NE(r, a) {
        return r == null ? !0 : Lf(r, a);
      }
      function ME(r, a, h) {
        return r == null ? r : xg(r, a, Of(h));
      }
      function KE(r, a, h, y) {
        return y = typeof y == "function" ? y : t, r == null ? r : xg(r, a, Of(h), y);
      }
      function Da(r) {
        return r == null ? [] : St(r, Bt(r));
      }
      function RE(r) {
        return r == null ? [] : St(r, jt(r));
      }
      function $E(r, a, h) {
        return h === t && (h = a, a = t), h !== t && (h = vn(h), h = h === h ? h : 0), a !== t && (a = vn(a), a = a === a ? a : 0), Pi(vn(r), a, h);
      }
      function PE(r, a, h) {
        return a = Dr(a), h === t ? (h = a, a = 0) : h = Dr(h), r = vn(r), qC(r, a, h);
      }
      function kE(r, a, h) {
        if (h && typeof h != "boolean" && kt(r, a, h) && (a = h = t), h === t && (typeof a == "boolean" ? (h = a, a = t) : typeof r == "boolean" && (h = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = Dr(r), a === t ? (a = r, r = 0) : a = Dr(a)), r > a) {
          var y = r;
          r = a, a = y;
        }
        if (h || r % 1 || a % 1) {
          var I = ig();
          return Lt(r + I * (a - r + cf("1e-" + ((I + "").length - 1))), a);
        }
        return If(r, a);
      }
      var GE = Sa(function(r, a, h) {
        return a = a.toLowerCase(), r + (h ? OB(a) : a);
      });
      function OB(r) {
        return nd(Oe(r).toLowerCase());
      }
      function NB(r) {
        return r = Oe(r), r && r.replace(Zc, To).replace(wu, "");
      }
      function VE(r, a, h) {
        r = Oe(r), a = an(a);
        var y = r.length;
        h = h === t ? y : Pi(de(h), 0, y);
        var I = h;
        return h -= a.length, h >= 0 && r.slice(h, I) == a;
      }
      function WE(r) {
        return r = Oe(r), r && Hi.test(r) ? r.replace(Ii, De) : r;
      }
      function XE(r) {
        return r = Oe(r), r && Cr.test(r) ? r.replace(vo, "\\$&") : r;
      }
      var qE = Sa(function(r, a, h) {
        return r + (h ? "-" : "") + a.toLowerCase();
      }), zE = Sa(function(r, a, h) {
        return r + (h ? " " : "") + a.toLowerCase();
      }), JE = Rg("toLowerCase");
      function jE(r, a, h) {
        r = Oe(r), a = de(a);
        var y = a ? ii(r) : 0;
        if (!a || y >= a)
          return r;
        var I = (a - y) / 2;
        return Gu(gt(I), h) + r + Gu(rr(I), h);
      }
      function YE(r, a, h) {
        r = Oe(r), a = de(a);
        var y = a ? ii(r) : 0;
        return a && y < a ? r + Gu(a - y, h) : r;
      }
      function ZE(r, a, h) {
        r = Oe(r), a = de(a);
        var y = a ? ii(r) : 0;
        return a && y < a ? Gu(a - y, h) + r : r;
      }
      function Ab(r, a, h) {
        return h || a == null ? a = 0 : a && (a = +a), oC(Oe(r).replace(fa, ""), a || 0);
      }
      function eb(r, a, h) {
        return (h ? kt(r, a, h) : a === t) ? a = 1 : a = de(a), Hf(Oe(r), a);
      }
      function tb() {
        var r = arguments, a = Oe(r[0]);
        return r.length < 3 ? a : a.replace(r[1], r[2]);
      }
      var nb = Sa(function(r, a, h) {
        return r + (h ? "_" : "") + a.toLowerCase();
      });
      function rb(r, a, h) {
        return h && typeof h != "number" && kt(r, a, h) && (a = h = t), h = h === t ? T : h >>> 0, h ? (r = Oe(r), r && (typeof a == "string" || a != null && !Ad(a)) && (a = an(a), !a && tr(r)) ? fi(vt(r), 0, h) : r.split(a, h)) : [];
      }
      var ib = Sa(function(r, a, h) {
        return r + (h ? " " : "") + nd(a);
      });
      function ab(r, a, h) {
        return r = Oe(r), h = h == null ? 0 : Pi(de(h), 0, r.length), a = an(a), r.slice(h, h + a.length) == a;
      }
      function ob(r, a, h) {
        var y = S.templateSettings;
        h && kt(r, a, h) && (a = t), r = Oe(r), a = tl({}, a, y, Xg);
        var I = tl({}, a.imports, y.imports, Xg), O = Bt(I), P = St(I, O), V, Z, pA = 0, gA = a.interpolate || pa, QA = "__p += '", LA = Mi(
          (a.escape || pa).source + "|" + gA.source + "|" + (gA === Si ? tu : pa).source + "|" + (a.evaluate || pa).source + "|$",
          "g"
        ), PA = "//# sourceURL=" + (He.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++yu + "]") + `
`;
        r.replace(LA, function(ee, Ce, be, sn, Gt, un) {
          return be || (be = sn), QA += r.slice(pA, un).replace(Af, Er), Ce && (V = !0, QA += `' +
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
        else if (ha.test(Ae))
          throw new ae(c);
        QA = (Z ? QA.replace(ye, "") : QA).replace(ut, "$1").replace(xt, "$1;"), QA = "function(" + (Ae || "obj") + `) {
` + (Ae ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (V ? ", __e = _.escape" : "") + (Z ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + QA + `return __p
}`;
        var pe = KB(function() {
          return Ie(O, PA + "return " + QA).apply(t, P);
        });
        if (pe.source = QA, Zf(pe))
          throw pe;
        return pe;
      }
      function sb(r) {
        return Oe(r).toLowerCase();
      }
      function ub(r) {
        return Oe(r).toUpperCase();
      }
      function lb(r, a, h) {
        if (r = Oe(r), r && (h || a === t))
          return Dn(r);
        if (!r || !(a = an(a)))
          return r;
        var y = vt(r), I = vt(a), O = On(y, I), P = Lo(y, I) + 1;
        return fi(y, O, P).join("");
      }
      function cb(r, a, h) {
        if (r = Oe(r), r && (h || a === t))
          return r.slice(0, xu(r) + 1);
        if (!r || !(a = an(a)))
          return r;
        var y = vt(r), I = Lo(y, vt(a)) + 1;
        return fi(y, 0, I).join("");
      }
      function fb(r, a, h) {
        if (r = Oe(r), r && (h || a === t))
          return r.replace(fa, "");
        if (!r || !(a = an(a)))
          return r;
        var y = vt(r), I = On(y, vt(a));
        return fi(y, I).join("");
      }
      function db(r, a) {
        var h = wA, y = EA;
        if (Ye(a)) {
          var I = "separator" in a ? a.separator : I;
          h = "length" in a ? de(a.length) : h, y = "omission" in a ? an(a.omission) : y;
        }
        r = Oe(r);
        var O = r.length;
        if (tr(r)) {
          var P = vt(r);
          O = P.length;
        }
        if (h >= O)
          return r;
        var V = h - ii(y);
        if (V < 1)
          return y;
        var Z = P ? fi(P, 0, V).join("") : r.slice(0, V);
        if (I === t)
          return Z + y;
        if (P && (V += Z.length - V), Ad(I)) {
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
        return Z + y;
      }
      function hb(r) {
        return r = Oe(r), r && In.test(r) ? r.replace(xn, Oo) : r;
      }
      var pb = Sa(function(r, a, h) {
        return r + (h ? " " : "") + a.toUpperCase();
      }), nd = Rg("toUpperCase");
      function MB(r, a, h) {
        return r = Oe(r), a = h ? t : a, a === t ? df(r) ? Mn(r) : YA(r) : r.match(a) || [];
      }
      var KB = ge(function(r, a) {
        try {
          return o(r, t, a);
        } catch (h) {
          return Zf(h) ? h : new ae(h);
        }
      }), gb = Sr(function(r, a) {
        return g(a, function(h) {
          h = or(h), Ir(r, h, jf(r[h], r));
        }), r;
      });
      function Bb(r) {
        var a = r == null ? 0 : r.length, h = jA();
        return r = a ? W(r, function(y) {
          if (typeof y[1] != "function")
            throw new yt(l);
          return [h(y[0]), y[1]];
        }) : [], ge(function(y) {
          for (var I = -1; ++I < a; ) {
            var O = r[I];
            if (o(O[0], this, y))
              return o(O[1], this, y);
          }
        });
      }
      function wb(r) {
        return kC(Bn(r, w));
      }
      function rd(r) {
        return function() {
          return r;
        };
      }
      function mb(r, a) {
        return r == null || r !== r ? a : r;
      }
      var vb = Pg(), yb = Pg(!0);
      function Yt(r) {
        return r;
      }
      function id(r) {
        return wg(typeof r == "function" ? r : Bn(r, w));
      }
      function Cb(r) {
        return vg(Bn(r, w));
      }
      function Qb(r, a) {
        return yg(r, Bn(a, w));
      }
      var Fb = ge(function(r, a) {
        return function(h) {
          return Go(h, r, a);
        };
      }), Ub = ge(function(r, a) {
        return function(h) {
          return Go(r, h, a);
        };
      });
      function ad(r, a, h) {
        var y = Bt(a), I = Nu(a, y);
        h == null && !(Ye(a) && (I.length || !y.length)) && (h = a, a = r, r = this, I = Nu(a, Bt(a)));
        var O = !(Ye(h) && "chain" in h) || !!h.chain, P = Tr(r);
        return g(I, function(V) {
          var Z = a[V];
          r[V] = Z, P && (r.prototype[V] = function() {
            var pA = this.__chain__;
            if (O || pA) {
              var gA = r(this.__wrapped__), QA = gA.__actions__ = zt(this.__actions__);
              return QA.push({ func: Z, args: arguments, thisArg: r }), gA.__chain__ = pA, gA;
            }
            return Z.apply(r, q([this.value()], arguments));
          });
        }), r;
      }
      function Eb() {
        return et._ === this && (et._ = uA), this;
      }
      function od() {
      }
      function bb(r) {
        return r = de(r), ge(function(a) {
          return Cg(a, r);
        });
      }
      var _b = Mf(W), xb = Mf(C), Ib = Mf(SA);
      function RB(r) {
        return Vf(r) ? le(or(r)) : aQ(r);
      }
      function Hb(r) {
        return function(a) {
          return r == null ? t : ki(r, a);
        };
      }
      var Sb = Gg(), Lb = Gg(!0);
      function sd() {
        return [];
      }
      function ud() {
        return !1;
      }
      function Tb() {
        return {};
      }
      function Db() {
        return "";
      }
      function Ob() {
        return !0;
      }
      function Nb(r, a) {
        if (r = de(r), r < 1 || r > _A)
          return [];
        var h = T, y = Lt(r, T);
        a = jA(a), r -= T;
        for (var I = Tn(y, a); ++h < r; )
          a(h);
        return I;
      }
      function Mb(r) {
        return ce(r) ? W(r, or) : on(r) ? [r] : zt(aB(Oe(r)));
      }
      function Kb(r) {
        var a = ++gf;
        return Oe(r) + a;
      }
      var Rb = ku(function(r, a) {
        return r + a;
      }, 0), $b = Kf("ceil"), Pb = ku(function(r, a) {
        return r / a;
      }, 1), kb = Kf("floor");
      function Gb(r) {
        return r && r.length ? Ou(r, Yt, Ff) : t;
      }
      function Vb(r, a) {
        return r && r.length ? Ou(r, jA(a, 2), Ff) : t;
      }
      function Wb(r) {
        return ct(r, Yt);
      }
      function Xb(r, a) {
        return ct(r, jA(a, 2));
      }
      function qb(r) {
        return r && r.length ? Ou(r, Yt, _f) : t;
      }
      function zb(r, a) {
        return r && r.length ? Ou(r, jA(a, 2), _f) : t;
      }
      var Jb = ku(function(r, a) {
        return r * a;
      }, 1), jb = Kf("round"), Yb = ku(function(r, a) {
        return r - a;
      }, 0);
      function Zb(r) {
        return r && r.length ? Ht(r, Yt) : 0;
      }
      function A1(r, a) {
        return r && r.length ? Ht(r, jA(a, 2)) : 0;
      }
      return S.after = CU, S.ary = BB, S.assign = uE, S.assignIn = HB, S.assignInWith = tl, S.assignWith = lE, S.at = cE, S.before = wB, S.bind = jf, S.bindAll = gb, S.bindKey = mB, S.castArray = TU, S.chain = hB, S.chunk = kQ, S.compact = GQ, S.concat = VQ, S.cond = Bb, S.conforms = wb, S.constant = rd, S.countBy = ZF, S.create = fE, S.curry = vB, S.curryRight = yB, S.debounce = CB, S.defaults = dE, S.defaultsDeep = hE, S.defer = QU, S.delay = FU, S.difference = WQ, S.differenceBy = XQ, S.differenceWith = qQ, S.drop = zQ, S.dropRight = JQ, S.dropRightWhile = jQ, S.dropWhile = YQ, S.fill = ZQ, S.filter = eU, S.flatMap = rU, S.flatMapDeep = iU, S.flatMapDepth = aU, S.flatten = lB, S.flattenDeep = AF, S.flattenDepth = eF, S.flip = UU, S.flow = vb, S.flowRight = yb, S.fromPairs = tF, S.functions = yE, S.functionsIn = CE, S.groupBy = oU, S.initial = rF, S.intersection = iF, S.intersectionBy = aF, S.intersectionWith = oF, S.invert = FE, S.invertBy = UE, S.invokeMap = uU, S.iteratee = id, S.keyBy = lU, S.keys = Bt, S.keysIn = jt, S.map = Ju, S.mapKeys = bE, S.mapValues = _E, S.matches = Cb, S.matchesProperty = Qb, S.memoize = Yu, S.merge = xE, S.mergeWith = SB, S.method = Fb, S.methodOf = Ub, S.mixin = ad, S.negate = Zu, S.nthArg = bb, S.omit = IE, S.omitBy = HE, S.once = EU, S.orderBy = cU, S.over = _b, S.overArgs = bU, S.overEvery = xb, S.overSome = Ib, S.partial = Yf, S.partialRight = QB, S.partition = fU, S.pick = SE, S.pickBy = LB, S.property = RB, S.propertyOf = Hb, S.pull = cF, S.pullAll = fB, S.pullAllBy = fF, S.pullAllWith = dF, S.pullAt = hF, S.range = Sb, S.rangeRight = Lb, S.rearg = _U, S.reject = pU, S.remove = pF, S.rest = xU, S.reverse = zf, S.sampleSize = BU, S.set = TE, S.setWith = DE, S.shuffle = wU, S.slice = gF, S.sortBy = yU, S.sortedUniq = QF, S.sortedUniqBy = FF, S.split = rb, S.spread = IU, S.tail = UF, S.take = EF, S.takeRight = bF, S.takeRightWhile = _F, S.takeWhile = xF, S.tap = GF, S.throttle = HU, S.thru = zu, S.toArray = _B, S.toPairs = TB, S.toPairsIn = DB, S.toPath = Mb, S.toPlainObject = IB, S.transform = OE, S.unary = SU, S.union = IF, S.unionBy = HF, S.unionWith = SF, S.uniq = LF, S.uniqBy = TF, S.uniqWith = DF, S.unset = NE, S.unzip = Jf, S.unzipWith = dB, S.update = ME, S.updateWith = KE, S.values = Da, S.valuesIn = RE, S.without = OF, S.words = MB, S.wrap = LU, S.xor = NF, S.xorBy = MF, S.xorWith = KF, S.zip = RF, S.zipObject = $F, S.zipObjectDeep = PF, S.zipWith = kF, S.entries = TB, S.entriesIn = DB, S.extend = HB, S.extendWith = tl, ad(S, S), S.add = Rb, S.attempt = KB, S.camelCase = GE, S.capitalize = OB, S.ceil = $b, S.clamp = $E, S.clone = DU, S.cloneDeep = NU, S.cloneDeepWith = MU, S.cloneWith = OU, S.conformsTo = KU, S.deburr = NB, S.defaultTo = mb, S.divide = Pb, S.endsWith = VE, S.eq = Rn, S.escape = WE, S.escapeRegExp = XE, S.every = AU, S.find = tU, S.findIndex = sB, S.findKey = pE, S.findLast = nU, S.findLastIndex = uB, S.findLastKey = gE, S.floor = kb, S.forEach = pB, S.forEachRight = gB, S.forIn = BE, S.forInRight = wE, S.forOwn = mE, S.forOwnRight = vE, S.get = ed, S.gt = RU, S.gte = $U, S.has = QE, S.hasIn = td, S.head = cB, S.identity = Yt, S.includes = sU, S.indexOf = nF, S.inRange = PE, S.invoke = EE, S.isArguments = Wi, S.isArray = ce, S.isArrayBuffer = PU, S.isArrayLike = Jt, S.isArrayLikeObject = rt, S.isBoolean = kU, S.isBuffer = di, S.isDate = GU, S.isElement = VU, S.isEmpty = WU, S.isEqual = XU, S.isEqualWith = qU, S.isError = Zf, S.isFinite = zU, S.isFunction = Tr, S.isInteger = FB, S.isLength = Al, S.isMap = UB, S.isMatch = JU, S.isMatchWith = jU, S.isNaN = YU, S.isNative = ZU, S.isNil = eE, S.isNull = AE, S.isNumber = EB, S.isObject = Ye, S.isObjectLike = At, S.isPlainObject = Jo, S.isRegExp = Ad, S.isSafeInteger = tE, S.isSet = bB, S.isString = el, S.isSymbol = on, S.isTypedArray = Ta, S.isUndefined = nE, S.isWeakMap = rE, S.isWeakSet = iE, S.join = sF, S.kebabCase = qE, S.last = mn, S.lastIndexOf = uF, S.lowerCase = zE, S.lowerFirst = JE, S.lt = aE, S.lte = oE, S.max = Gb, S.maxBy = Vb, S.mean = Wb, S.meanBy = Xb, S.min = qb, S.minBy = zb, S.stubArray = sd, S.stubFalse = ud, S.stubObject = Tb, S.stubString = Db, S.stubTrue = Ob, S.multiply = Jb, S.nth = lF, S.noConflict = Eb, S.noop = od, S.now = ju, S.pad = jE, S.padEnd = YE, S.padStart = ZE, S.parseInt = Ab, S.random = kE, S.reduce = dU, S.reduceRight = hU, S.repeat = eb, S.replace = tb, S.result = LE, S.round = jb, S.runInContext = j, S.sample = gU, S.size = mU, S.snakeCase = nb, S.some = vU, S.sortedIndex = BF, S.sortedIndexBy = wF, S.sortedIndexOf = mF, S.sortedLastIndex = vF, S.sortedLastIndexBy = yF, S.sortedLastIndexOf = CF, S.startCase = ib, S.startsWith = ab, S.subtract = Yb, S.sum = Zb, S.sumBy = A1, S.template = ob, S.times = Nb, S.toFinite = Dr, S.toInteger = de, S.toLength = xB, S.toLower = sb, S.toNumber = vn, S.toSafeInteger = sE, S.toString = Oe, S.toUpper = ub, S.trim = lb, S.trimEnd = cb, S.trimStart = fb, S.truncate = db, S.unescape = hb, S.uniqueId = Kb, S.upperCase = pb, S.upperFirst = nd, S.each = pB, S.eachRight = gB, S.first = cB, ad(S, function() {
        var r = {};
        return ir(S, function(a, h) {
          He.call(S.prototype, h) || (r[h] = a);
        }), r;
      }(), { chain: !1 }), S.VERSION = n, g(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
        S[r].placeholder = S;
      }), g(["drop", "take"], function(r, a) {
        Qe.prototype[r] = function(h) {
          h = h === t ? 1 : ft(de(h), 0);
          var y = this.__filtered__ && !a ? new Qe(this) : this.clone();
          return y.__filtered__ ? y.__takeCount__ = Lt(h, y.__takeCount__) : y.__views__.push({
            size: Lt(h, T),
            type: r + (y.__dir__ < 0 ? "Right" : "")
          }), y;
        }, Qe.prototype[r + "Right"] = function(h) {
          return this.reverse()[r](h).reverse();
        };
      }), g(["filter", "map", "takeWhile"], function(r, a) {
        var h = a + 1, y = h == X || h == tA;
        Qe.prototype[r] = function(I) {
          var O = this.clone();
          return O.__iteratees__.push({
            iteratee: jA(I, 3),
            type: h
          }), O.__filtered__ = O.__filtered__ || y, O;
        };
      }), g(["head", "last"], function(r, a) {
        var h = "take" + (a ? "Right" : "");
        Qe.prototype[r] = function() {
          return this[h](1).value()[0];
        };
      }), g(["initial", "tail"], function(r, a) {
        var h = "drop" + (a ? "" : "Right");
        Qe.prototype[r] = function() {
          return this.__filtered__ ? new Qe(this) : this[h](1);
        };
      }), Qe.prototype.compact = function() {
        return this.filter(Yt);
      }, Qe.prototype.find = function(r) {
        return this.filter(r).head();
      }, Qe.prototype.findLast = function(r) {
        return this.reverse().find(r);
      }, Qe.prototype.invokeMap = ge(function(r, a) {
        return typeof r == "function" ? new Qe(this) : this.map(function(h) {
          return Go(h, r, a);
        });
      }), Qe.prototype.reject = function(r) {
        return this.filter(Zu(jA(r)));
      }, Qe.prototype.slice = function(r, a) {
        r = de(r);
        var h = this;
        return h.__filtered__ && (r > 0 || a < 0) ? new Qe(h) : (r < 0 ? h = h.takeRight(-r) : r && (h = h.drop(r)), a !== t && (a = de(a), h = a < 0 ? h.dropRight(-a) : h.take(a - r)), h);
      }, Qe.prototype.takeRightWhile = function(r) {
        return this.reverse().takeWhile(r).reverse();
      }, Qe.prototype.toArray = function() {
        return this.take(T);
      }, ir(Qe.prototype, function(r, a) {
        var h = /^(?:filter|find|map|reject)|While$/.test(a), y = /^(?:head|last)$/.test(a), I = S[y ? "take" + (a == "last" ? "Right" : "") : a], O = y || /^find/.test(a);
        I && (S.prototype[a] = function() {
          var P = this.__wrapped__, V = y ? [1] : arguments, Z = P instanceof Qe, pA = V[0], gA = Z || ce(P), QA = function(Ce) {
            var be = I.apply(S, q([Ce], V));
            return y && LA ? be[0] : be;
          };
          gA && h && typeof pA == "function" && pA.length != 1 && (Z = gA = !1);
          var LA = this.__chain__, PA = !!this.__actions__.length, Ae = O && !LA, pe = Z && !PA;
          if (!O && gA) {
            P = pe ? P : new Qe(this);
            var ee = r.apply(P, V);
            return ee.__actions__.push({ func: zu, args: [QA], thisArg: t }), new gn(ee, LA);
          }
          return Ae && pe ? r.apply(this, V) : (ee = this.thru(QA), Ae ? y ? ee.value()[0] : ee.value() : ee);
        });
      }), g(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
        var a = ai[r], h = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", y = /^(?:pop|shift)$/.test(r);
        S.prototype[r] = function() {
          var I = arguments;
          if (y && !this.__chain__) {
            var O = this.value();
            return a.apply(ce(O) ? O : [], I);
          }
          return this[h](function(P) {
            return a.apply(ce(P) ? P : [], I);
          });
        };
      }), ir(Qe.prototype, function(r, a) {
        var h = S[a];
        if (h) {
          var y = h.name + "";
          He.call(xa, y) || (xa[y] = []), xa[y].push({ name: a, func: h });
        }
      }), xa[Pu(t, E).name] = [{
        name: "wrapper",
        func: t
      }], Qe.prototype.clone = hC, Qe.prototype.reverse = pC, Qe.prototype.value = gC, S.prototype.at = VF, S.prototype.chain = WF, S.prototype.commit = XF, S.prototype.next = qF, S.prototype.plant = JF, S.prototype.reverse = jF, S.prototype.toJSON = S.prototype.valueOf = S.prototype.value = YF, S.prototype.first = S.prototype.head, qA && (S.prototype[qA] = zF), S;
    }, xe = Iu();
    pn ? ((pn.exports = xe)._ = xe, xo._ = xe) : et._ = xe;
  }).call(Va);
})(oc, oc.exports);
var sS = oc.exports;
const Le = /* @__PURE__ */ Rh(sS), uS = function(A) {
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
  }, t = Le.merge({}, e, A), n = function(i, s) {
    var l = Le.cloneDeep(i);
    if (i.show) {
      var c = i.size * t.scale;
      s.showThreshold && (l.show = c >= s.showThreshold), s.maxSize && c > s.maxSize && (l.size = s.maxSize / t.scale);
    }
    return l;
  };
  return {
    decorateGenome: function(i) {
      var s = i, l = {
        width: t.width * (1 - t.margin.left - t.margin.right),
        height: t.height * (1 - t.margin.top - t.margin.bottom)
      }, c = Math.min(t.numberPerRow, s.chromosomes.length), f = Math.ceil(s.chromosomes.length / c), p = {
        width: l.width / c,
        height: l.height / f
      }, B = {
        top: p.height * t.cellMargin.top,
        bottom: p.height * t.cellMargin.bottom,
        left: p.width * t.cellMargin.left,
        right: p.width * t.cellMargin.right
      }, w = t.labelHeight * p.height, v = t.labelHeight * p.height, Q = p.height - w - v - B.top - B.bottom, u = Math.min(
        65 / t.scale,
        Q * t.chromosomeAspectRatio
      ), U = p.width - u - B.left - B.right, b = U / 2, E = Math.max.apply(
        null,
        s.chromosomes.map(function(x) {
          return x.length;
        })
      ), D = {
        label: Le.pick(t.annotations.label, ["size", "show"]),
        marker: Le.pick(t.annotations.marker, ["size", "show"])
      };
      D.label = n(
        D.label,
        t.annotations.label
      ), D.marker = n(
        D.marker,
        t.annotations.marker
      );
      var R = {
        chromosomePosition: {
          height: Q,
          width: u,
          x: B.left + b,
          y: B.top + w
        },
        labelPosition: {
          height: w,
          width: p.width - B.left - B.right,
          chromosomeWidth: u,
          x: B.left,
          y: B.top
        },
        sizeLabelPosition: {
          cellHeight: Q,
          height: v,
          width: p.width - B.left - B.right,
          x: B.left,
          y: B.top + w
        },
        qtlAnnotationPosition: {
          height: Q,
          width: b,
          chromosomeWidth: u,
          x: B.left,
          y: B.top + w
        },
        geneAnnotationPosition: {
          height: Q,
          width: b,
          x: B.left + b + u,
          y: B.top + w
        },
        longestChromosome: E,
        annotations: D,
        scale: t.scale
      };
      return s.chromosomes.length == 1 && (R.chromosomePosition.x = B.left + 0.5 * b, R.geneAnnotationPosition.x = B.left + 0.5 * b + u, R.qtlAnnotationPosition.width = b * 0.5, R.geneAnnotationPosition.width = b * 1.5, R.labelPosition.x = B.left + 0.5 * b, R.labelPosition.width = u, R.sizeLabelPosition.x = B.left + 0.5 * b, R.sizeLabelPosition.width = u), s.drawing = Le.pick(t, ["width", "height"]), s.drawing.margin = {
        top: t.margin.top * s.drawing.height,
        left: t.margin.left * s.drawing.width,
        bottom: t.margin.bottom * s.drawing.height,
        right: t.margin.right * s.drawing.width
      }, s.chromosomes.forEach(function(x, K) {
        var k = K % t.numberPerRow, Y = Math.floor(K / t.numberPerRow);
        x.cell = {
          y: Y * p.height + t.margin.top * t.height,
          x: k * p.width + t.margin.left * t.width,
          width: p.width,
          height: p.height
        };
      }), s.cellLayout = R, s;
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
function lS(A, e) {
  return A == null || e == null ? NaN : e < A ? -1 : e > A ? 1 : e >= A ? 0 : NaN;
}
function e0(A) {
  let e, t, n;
  A.length !== 2 ? (e = Wl, t = (c, f) => Wl(A(c), f), n = (c, f) => A(c) - f) : (e = A === Wl || A === lS ? A : cS, t = A, n = A);
  function i(c, f, p = 0, B = c.length) {
    if (p < B) {
      if (e(f, f) !== 0) return B;
      do {
        const w = p + B >>> 1;
        t(c[w], f) < 0 ? p = w + 1 : B = w;
      } while (p < B);
    }
    return p;
  }
  function s(c, f, p = 0, B = c.length) {
    if (p < B) {
      if (e(f, f) !== 0) return B;
      do {
        const w = p + B >>> 1;
        t(c[w], f) <= 0 ? p = w + 1 : B = w;
      } while (p < B);
    }
    return p;
  }
  function l(c, f, p = 0, B = c.length) {
    const w = i(c, f, p, B - 1);
    return w > p && n(c[w - 1], f) > -n(c[w], f) ? w - 1 : w;
  }
  return { left: i, center: l, right: s };
}
function cS() {
  return 0;
}
function fS(A) {
  return A === null ? NaN : +A;
}
const dS = e0(Wl), hS = dS.right;
e0(fS).center;
const pS = Math.sqrt(50), gS = Math.sqrt(10), BS = Math.sqrt(2);
function sc(A, e, t) {
  const n = (e - A) / Math.max(0, t), i = Math.floor(Math.log10(n)), s = n / Math.pow(10, i), l = s >= pS ? 10 : s >= gS ? 5 : s >= BS ? 2 : 1;
  let c, f, p;
  return i < 0 ? (p = Math.pow(10, -i) / l, c = Math.round(A * p), f = Math.round(e * p), c / p < A && ++c, f / p > e && --f, p = -p) : (p = Math.pow(10, i) * l, c = Math.round(A / p), f = Math.round(e / p), c * p < A && ++c, f * p > e && --f), f < c && 0.5 <= t && t < 2 ? sc(A, e, t * 2) : [c, f, p];
}
function wS(A, e, t) {
  if (e = +e, A = +A, t = +t, !(t > 0)) return [];
  if (A === e) return [A];
  const n = e < A, [i, s, l] = n ? sc(e, A, t) : sc(A, e, t);
  if (!(s >= i)) return [];
  const c = s - i + 1, f = new Array(c);
  if (n)
    if (l < 0) for (let p = 0; p < c; ++p) f[p] = (s - p) / -l;
    else for (let p = 0; p < c; ++p) f[p] = (s - p) * l;
  else if (l < 0) for (let p = 0; p < c; ++p) f[p] = (i + p) / -l;
  else for (let p = 0; p < c; ++p) f[p] = (i + p) * l;
  return f;
}
function Zd(A, e, t) {
  return e = +e, A = +A, t = +t, sc(A, e, t)[2];
}
function mS(A, e, t) {
  e = +e, A = +A, t = +t;
  const n = e < A, i = n ? Zd(e, A, t) : Zd(A, e, t);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var vS = { value: function() {
} };
function Oc() {
  for (var A = 0, e = arguments.length, t = {}, n; A < e; ++A) {
    if (!(n = arguments[A] + "") || n in t || /[\s.]/.test(n)) throw new Error("illegal type: " + n);
    t[n] = [];
  }
  return new Xl(t);
}
function Xl(A) {
  this._ = A;
}
function yS(A, e) {
  return A.trim().split(/^|\s+/).map(function(t) {
    var n = "", i = t.indexOf(".");
    if (i >= 0 && (n = t.slice(i + 1), t = t.slice(0, i)), t && !e.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: n };
  });
}
Xl.prototype = Oc.prototype = {
  constructor: Xl,
  on: function(A, e) {
    var t = this._, n = yS(A + "", t), i, s = -1, l = n.length;
    if (arguments.length < 2) {
      for (; ++s < l; ) if ((i = (A = n[s]).type) && (i = CS(t[i], A.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++s < l; )
      if (i = (A = n[s]).type) t[i] = pw(t[i], A.name, e);
      else if (e == null) for (i in t) t[i] = pw(t[i], A.name, null);
    return this;
  },
  copy: function() {
    var A = {}, e = this._;
    for (var t in e) A[t] = e[t].slice();
    return new Xl(A);
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
function CS(A, e) {
  for (var t = 0, n = A.length, i; t < n; ++t)
    if ((i = A[t]).name === e)
      return i.value;
}
function pw(A, e, t) {
  for (var n = 0, i = A.length; n < i; ++n)
    if (A[n].name === e) {
      A[n] = vS, A = A.slice(0, n).concat(A.slice(n + 1));
      break;
    }
  return t != null && A.push({ name: e, value: t }), A;
}
var Ah = "http://www.w3.org/1999/xhtml";
const gw = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Ah,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Nc(A) {
  var e = A += "", t = e.indexOf(":");
  return t >= 0 && (e = A.slice(0, t)) !== "xmlns" && (A = A.slice(t + 1)), gw.hasOwnProperty(e) ? { space: gw[e], local: A } : A;
}
function QS(A) {
  return function() {
    var e = this.ownerDocument, t = this.namespaceURI;
    return t === Ah && e.documentElement.namespaceURI === Ah ? e.createElement(A) : e.createElementNS(t, A);
  };
}
function FS(A) {
  return function() {
    return this.ownerDocument.createElementNS(A.space, A.local);
  };
}
function t0(A) {
  var e = Nc(A);
  return (e.local ? FS : QS)(e);
}
function US() {
}
function Sp(A) {
  return A == null ? US : function() {
    return this.querySelector(A);
  };
}
function ES(A) {
  typeof A != "function" && (A = Sp(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, c = n[i] = new Array(l), f, p, B = 0; B < l; ++B)
      (f = s[B]) && (p = A.call(f, f.__data__, B, s)) && ("__data__" in f && (p.__data__ = f.__data__), c[B] = p);
  return new Xt(n, this._parents);
}
function n0(A) {
  return A == null ? [] : Array.isArray(A) ? A : Array.from(A);
}
function bS() {
  return [];
}
function r0(A) {
  return A == null ? bS : function() {
    return this.querySelectorAll(A);
  };
}
function _S(A) {
  return function() {
    return n0(A.apply(this, arguments));
  };
}
function xS(A) {
  typeof A == "function" ? A = _S(A) : A = r0(A);
  for (var e = this._groups, t = e.length, n = [], i = [], s = 0; s < t; ++s)
    for (var l = e[s], c = l.length, f, p = 0; p < c; ++p)
      (f = l[p]) && (n.push(A.call(f, f.__data__, p, l)), i.push(f));
  return new Xt(n, i);
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
var IS = Array.prototype.find;
function HS(A) {
  return function() {
    return IS.call(this.children, A);
  };
}
function SS() {
  return this.firstElementChild;
}
function LS(A) {
  return this.select(A == null ? SS : HS(typeof A == "function" ? A : a0(A)));
}
var TS = Array.prototype.filter;
function DS() {
  return Array.from(this.children);
}
function OS(A) {
  return function() {
    return TS.call(this.children, A);
  };
}
function NS(A) {
  return this.selectAll(A == null ? DS : OS(typeof A == "function" ? A : a0(A)));
}
function MS(A) {
  typeof A != "function" && (A = i0(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, c = n[i] = [], f, p = 0; p < l; ++p)
      (f = s[p]) && A.call(f, f.__data__, p, s) && c.push(f);
  return new Xt(n, this._parents);
}
function o0(A) {
  return new Array(A.length);
}
function KS() {
  return new Xt(this._enter || this._groups.map(o0), this._parents);
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
function RS(A) {
  return function() {
    return A;
  };
}
function $S(A, e, t, n, i, s) {
  for (var l = 0, c, f = e.length, p = s.length; l < p; ++l)
    (c = e[l]) ? (c.__data__ = s[l], n[l] = c) : t[l] = new uc(A, s[l]);
  for (; l < f; ++l)
    (c = e[l]) && (i[l] = c);
}
function PS(A, e, t, n, i, s, l) {
  var c, f, p = /* @__PURE__ */ new Map(), B = e.length, w = s.length, v = new Array(B), Q;
  for (c = 0; c < B; ++c)
    (f = e[c]) && (v[c] = Q = l.call(f, f.__data__, c, e) + "", p.has(Q) ? i[c] = f : p.set(Q, f));
  for (c = 0; c < w; ++c)
    Q = l.call(A, s[c], c, s) + "", (f = p.get(Q)) ? (n[c] = f, f.__data__ = s[c], p.delete(Q)) : t[c] = new uc(A, s[c]);
  for (c = 0; c < B; ++c)
    (f = e[c]) && p.get(v[c]) === f && (i[c] = f);
}
function kS(A) {
  return A.__data__;
}
function GS(A, e) {
  if (!arguments.length) return Array.from(this, kS);
  var t = e ? PS : $S, n = this._parents, i = this._groups;
  typeof A != "function" && (A = RS(A));
  for (var s = i.length, l = new Array(s), c = new Array(s), f = new Array(s), p = 0; p < s; ++p) {
    var B = n[p], w = i[p], v = w.length, Q = VS(A.call(B, B && B.__data__, p, n)), u = Q.length, U = c[p] = new Array(u), b = l[p] = new Array(u), E = f[p] = new Array(v);
    t(B, w, U, b, E, Q, e);
    for (var D = 0, R = 0, x, K; D < u; ++D)
      if (x = U[D]) {
        for (D >= R && (R = D + 1); !(K = b[R]) && ++R < u; ) ;
        x._next = K || null;
      }
  }
  return l = new Xt(l, n), l._enter = c, l._exit = f, l;
}
function VS(A) {
  return typeof A == "object" && "length" in A ? A : Array.from(A);
}
function WS() {
  return new Xt(this._exit || this._groups.map(o0), this._parents);
}
function XS(A, e, t) {
  var n = this.enter(), i = this, s = this.exit();
  return typeof A == "function" ? (n = A(n), n && (n = n.selection())) : n = n.append(A + ""), e != null && (i = e(i), i && (i = i.selection())), t == null ? s.remove() : t(s), n && i ? n.merge(i).order() : i;
}
function qS(A) {
  for (var e = A.selection ? A.selection() : A, t = this._groups, n = e._groups, i = t.length, s = n.length, l = Math.min(i, s), c = new Array(i), f = 0; f < l; ++f)
    for (var p = t[f], B = n[f], w = p.length, v = c[f] = new Array(w), Q, u = 0; u < w; ++u)
      (Q = p[u] || B[u]) && (v[u] = Q);
  for (; f < i; ++f)
    c[f] = t[f];
  return new Xt(c, this._parents);
}
function zS() {
  for (var A = this._groups, e = -1, t = A.length; ++e < t; )
    for (var n = A[e], i = n.length - 1, s = n[i], l; --i >= 0; )
      (l = n[i]) && (s && l.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(l, s), s = l);
  return this;
}
function JS(A) {
  A || (A = jS);
  function e(w, v) {
    return w && v ? A(w.__data__, v.__data__) : !w - !v;
  }
  for (var t = this._groups, n = t.length, i = new Array(n), s = 0; s < n; ++s) {
    for (var l = t[s], c = l.length, f = i[s] = new Array(c), p, B = 0; B < c; ++B)
      (p = l[B]) && (f[B] = p);
    f.sort(e);
  }
  return new Xt(i, this._parents).order();
}
function jS(A, e) {
  return A < e ? -1 : A > e ? 1 : A >= e ? 0 : NaN;
}
function YS() {
  var A = arguments[0];
  return arguments[0] = this, A.apply(null, arguments), this;
}
function ZS() {
  return Array.from(this);
}
function AL() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length; i < s; ++i) {
      var l = n[i];
      if (l) return l;
    }
  return null;
}
function eL() {
  let A = 0;
  for (const e of this) ++A;
  return A;
}
function tL() {
  return !this.node();
}
function nL(A) {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var i = e[t], s = 0, l = i.length, c; s < l; ++s)
      (c = i[s]) && A.call(c, c.__data__, s, i);
  return this;
}
function rL(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function iL(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function aL(A, e) {
  return function() {
    this.setAttribute(A, e);
  };
}
function oL(A, e) {
  return function() {
    this.setAttributeNS(A.space, A.local, e);
  };
}
function sL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttribute(A) : this.setAttribute(A, t);
  };
}
function uL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? this.removeAttributeNS(A.space, A.local) : this.setAttributeNS(A.space, A.local, t);
  };
}
function lL(A, e) {
  var t = Nc(A);
  if (arguments.length < 2) {
    var n = this.node();
    return t.local ? n.getAttributeNS(t.space, t.local) : n.getAttribute(t);
  }
  return this.each((e == null ? t.local ? iL : rL : typeof e == "function" ? t.local ? uL : sL : t.local ? oL : aL)(t, e));
}
function s0(A) {
  return A.ownerDocument && A.ownerDocument.defaultView || A.document && A || A.defaultView;
}
function cL(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function fL(A, e, t) {
  return function() {
    this.style.setProperty(A, e, t);
  };
}
function dL(A, e, t) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.style.removeProperty(A) : this.style.setProperty(A, n, t);
  };
}
function hL(A, e, t) {
  return arguments.length > 1 ? this.each((e == null ? cL : typeof e == "function" ? dL : fL)(A, e, t ?? "")) : oo(this.node(), A);
}
function oo(A, e) {
  return A.style.getPropertyValue(e) || s0(A).getComputedStyle(A, null).getPropertyValue(e);
}
function pL(A) {
  return function() {
    delete this[A];
  };
}
function gL(A, e) {
  return function() {
    this[A] = e;
  };
}
function BL(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    t == null ? delete this[A] : this[A] = t;
  };
}
function wL(A, e) {
  return arguments.length > 1 ? this.each((e == null ? pL : typeof e == "function" ? BL : gL)(A, e)) : this.node()[A];
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
function mL(A) {
  return function() {
    c0(this, A);
  };
}
function vL(A) {
  return function() {
    f0(this, A);
  };
}
function yL(A, e) {
  return function() {
    (e.apply(this, arguments) ? c0 : f0)(this, A);
  };
}
function CL(A, e) {
  var t = u0(A + "");
  if (arguments.length < 2) {
    for (var n = Lp(this.node()), i = -1, s = t.length; ++i < s; ) if (!n.contains(t[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? yL : e ? mL : vL)(t, e));
}
function QL() {
  this.textContent = "";
}
function FL(A) {
  return function() {
    this.textContent = A;
  };
}
function UL(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function EL(A) {
  return arguments.length ? this.each(A == null ? QL : (typeof A == "function" ? UL : FL)(A)) : this.node().textContent;
}
function bL() {
  this.innerHTML = "";
}
function _L(A) {
  return function() {
    this.innerHTML = A;
  };
}
function xL(A) {
  return function() {
    var e = A.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function IL(A) {
  return arguments.length ? this.each(A == null ? bL : (typeof A == "function" ? xL : _L)(A)) : this.node().innerHTML;
}
function HL() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function SL() {
  return this.each(HL);
}
function LL() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function TL() {
  return this.each(LL);
}
function DL(A) {
  var e = typeof A == "function" ? A : t0(A);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function OL() {
  return null;
}
function NL(A, e) {
  var t = typeof A == "function" ? A : t0(A), n = e == null ? OL : typeof e == "function" ? e : Sp(e);
  return this.select(function() {
    return this.insertBefore(t.apply(this, arguments), n.apply(this, arguments) || null);
  });
}
function ML() {
  var A = this.parentNode;
  A && A.removeChild(this);
}
function KL() {
  return this.each(ML);
}
function RL() {
  var A = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function $L() {
  var A = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(A, this.nextSibling) : A;
}
function PL(A) {
  return this.select(A ? $L : RL);
}
function kL(A) {
  return arguments.length ? this.property("__data__", A) : this.node().__data__;
}
function GL(A) {
  return function(e) {
    A.call(this, e, this.__data__);
  };
}
function VL(A) {
  return A.trim().split(/^|\s+/).map(function(e) {
    var t = "", n = e.indexOf(".");
    return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), { type: e, name: t };
  });
}
function WL(A) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var t = 0, n = -1, i = e.length, s; t < i; ++t)
        s = e[t], (!A.type || s.type === A.type) && s.name === A.name ? this.removeEventListener(s.type, s.listener, s.options) : e[++n] = s;
      ++n ? e.length = n : delete this.__on;
    }
  };
}
function XL(A, e, t) {
  return function() {
    var n = this.__on, i, s = GL(e);
    if (n) {
      for (var l = 0, c = n.length; l < c; ++l)
        if ((i = n[l]).type === A.type && i.name === A.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = s, i.options = t), i.value = e;
          return;
        }
    }
    this.addEventListener(A.type, s, t), i = { type: A.type, name: A.name, value: e, listener: s, options: t }, n ? n.push(i) : this.__on = [i];
  };
}
function qL(A, e, t) {
  var n = VL(A + ""), i, s = n.length, l;
  if (arguments.length < 2) {
    var c = this.node().__on;
    if (c) {
      for (var f = 0, p = c.length, B; f < p; ++f)
        for (i = 0, B = c[f]; i < s; ++i)
          if ((l = n[i]).type === B.type && l.name === B.name)
            return B.value;
    }
    return;
  }
  for (c = e ? XL : WL, i = 0; i < s; ++i) this.each(c(n[i], e, t));
  return this;
}
function d0(A, e, t) {
  var n = s0(A), i = n.CustomEvent;
  typeof i == "function" ? i = new i(e, t) : (i = n.document.createEvent("Event"), t ? (i.initEvent(e, t.bubbles, t.cancelable), i.detail = t.detail) : i.initEvent(e, !1, !1)), A.dispatchEvent(i);
}
function zL(A, e) {
  return function() {
    return d0(this, A, e);
  };
}
function JL(A, e) {
  return function() {
    return d0(this, A, e.apply(this, arguments));
  };
}
function jL(A, e) {
  return this.each((typeof e == "function" ? JL : zL)(A, e));
}
function* YL() {
  for (var A = this._groups, e = 0, t = A.length; e < t; ++e)
    for (var n = A[e], i = 0, s = n.length, l; i < s; ++i)
      (l = n[i]) && (yield l);
}
var Tp = [null];
function Xt(A, e) {
  this._groups = A, this._parents = e;
}
function Vs() {
  return new Xt([[document.documentElement]], Tp);
}
function ZL() {
  return this;
}
Xt.prototype = Vs.prototype = {
  constructor: Xt,
  select: ES,
  selectAll: xS,
  selectChild: LS,
  selectChildren: NS,
  filter: MS,
  data: GS,
  enter: KS,
  exit: WS,
  join: XS,
  merge: qS,
  selection: ZL,
  order: zS,
  sort: JS,
  call: YS,
  nodes: ZS,
  node: AL,
  size: eL,
  empty: tL,
  each: nL,
  attr: lL,
  style: hL,
  property: wL,
  classed: CL,
  text: EL,
  html: IL,
  raise: SL,
  lower: TL,
  append: DL,
  insert: NL,
  remove: KL,
  clone: PL,
  datum: kL,
  on: qL,
  dispatch: jL,
  [Symbol.iterator]: YL
};
function WA(A) {
  return typeof A == "string" ? new Xt([[document.querySelector(A)]], [document.documentElement]) : new Xt([[A]], Tp);
}
function AT(A) {
  let e;
  for (; e = A.sourceEvent; ) A = e;
  return A;
}
function Vn(A, e) {
  if (A = AT(A), e === void 0 && (e = A.currentTarget), e) {
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
function eh(A) {
  return typeof A == "string" ? new Xt([document.querySelectorAll(A)], [document.documentElement]) : new Xt([n0(A)], Tp);
}
const eT = { passive: !1 }, Hs = { capture: !0, passive: !1 };
function pd(A) {
  A.stopImmediatePropagation();
}
function eo(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function h0(A) {
  var e = A.document.documentElement, t = WA(A).on("dragstart.drag", eo, Hs);
  "onselectstart" in e ? t.on("selectstart.drag", eo, Hs) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function p0(A, e) {
  var t = A.document.documentElement, n = WA(A).on("dragstart.drag", null);
  e && (n.on("click.drag", eo, Hs), setTimeout(function() {
    n.on("click.drag", null);
  }, 0)), "onselectstart" in t ? n.on("selectstart.drag", null) : (t.style.MozUserSelect = t.__noselect, delete t.__noselect);
}
const ul = (A) => () => A;
function th(A, {
  sourceEvent: e,
  subject: t,
  target: n,
  identifier: i,
  active: s,
  x: l,
  y: c,
  dx: f,
  dy: p,
  dispatch: B
}) {
  Object.defineProperties(this, {
    type: { value: A, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    subject: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: s, enumerable: !0, configurable: !0 },
    x: { value: l, enumerable: !0, configurable: !0 },
    y: { value: c, enumerable: !0, configurable: !0 },
    dx: { value: f, enumerable: !0, configurable: !0 },
    dy: { value: p, enumerable: !0, configurable: !0 },
    _: { value: B }
  });
}
th.prototype.on = function() {
  var A = this._.on.apply(this._, arguments);
  return A === this._ ? this : A;
};
function tT(A) {
  return !A.ctrlKey && !A.button;
}
function nT() {
  return this.parentNode;
}
function rT(A, e) {
  return e ?? { x: A.x, y: A.y };
}
function iT() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function aT() {
  var A = tT, e = nT, t = rT, n = iT, i = {}, s = Oc("start", "drag", "end"), l = 0, c, f, p, B, w = 0;
  function v(x) {
    x.on("mousedown.drag", Q).filter(n).on("touchstart.drag", b).on("touchmove.drag", E, eT).on("touchend.drag touchcancel.drag", D).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function Q(x, K) {
    if (!(B || !A.call(this, x, K))) {
      var k = R(this, e.call(this, x, K), x, K, "mouse");
      k && (WA(x.view).on("mousemove.drag", u, Hs).on("mouseup.drag", U, Hs), h0(x.view), pd(x), p = !1, c = x.clientX, f = x.clientY, k("start", x));
    }
  }
  function u(x) {
    if (eo(x), !p) {
      var K = x.clientX - c, k = x.clientY - f;
      p = K * K + k * k > w;
    }
    i.mouse("drag", x);
  }
  function U(x) {
    WA(x.view).on("mousemove.drag mouseup.drag", null), p0(x.view, p), eo(x), i.mouse("end", x);
  }
  function b(x, K) {
    if (A.call(this, x, K)) {
      var k = x.changedTouches, Y = e.call(this, x, K), dA = k.length, cA, wA;
      for (cA = 0; cA < dA; ++cA)
        (wA = R(this, Y, x, K, k[cA].identifier, k[cA])) && (pd(x), wA("start", x, k[cA]));
    }
  }
  function E(x) {
    var K = x.changedTouches, k = K.length, Y, dA;
    for (Y = 0; Y < k; ++Y)
      (dA = i[K[Y].identifier]) && (eo(x), dA("drag", x, K[Y]));
  }
  function D(x) {
    var K = x.changedTouches, k = K.length, Y, dA;
    for (B && clearTimeout(B), B = setTimeout(function() {
      B = null;
    }, 500), Y = 0; Y < k; ++Y)
      (dA = i[K[Y].identifier]) && (pd(x), dA("end", x, K[Y]));
  }
  function R(x, K, k, Y, dA, cA) {
    var wA = s.copy(), EA = Vn(cA || k, K), NA, xA, X;
    if ((X = t.call(x, new th("beforestart", {
      sourceEvent: k,
      target: v,
      identifier: dA,
      active: l,
      x: EA[0],
      y: EA[1],
      dx: 0,
      dy: 0,
      dispatch: wA
    }), Y)) != null)
      return NA = X.x - EA[0] || 0, xA = X.y - EA[1] || 0, function CA(tA, fA, _A) {
        var IA = EA, aA;
        switch (tA) {
          case "start":
            i[dA] = CA, aA = l++;
            break;
          case "end":
            delete i[dA], --l;
          case "drag":
            EA = Vn(_A || fA, K), aA = l;
            break;
        }
        wA.call(
          tA,
          x,
          new th(tA, {
            sourceEvent: fA,
            subject: X,
            target: v,
            identifier: dA,
            active: aA,
            x: EA[0] + NA,
            y: EA[1] + xA,
            dx: EA[0] - IA[0],
            dy: EA[1] - IA[1],
            dispatch: wA
          }),
          Y
        );
      };
  }
  return v.filter = function(x) {
    return arguments.length ? (A = typeof x == "function" ? x : ul(!!x), v) : A;
  }, v.container = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : ul(x), v) : e;
  }, v.subject = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : ul(x), v) : t;
  }, v.touchable = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : ul(!!x), v) : n;
  }, v.on = function() {
    var x = s.on.apply(s, arguments);
    return x === s ? v : x;
  }, v.clickDistance = function(x) {
    return arguments.length ? (w = (x = +x) * x, v) : Math.sqrt(w);
  }, v;
}
function Dp(A, e, t) {
  A.prototype = e.prototype = t, t.constructor = A;
}
function g0(A, e) {
  var t = Object.create(A.prototype);
  for (var n in e) t[n] = e[n];
  return t;
}
function Ws() {
}
var Ss = 0.7, lc = 1 / Ss, to = "\\s*([+-]?\\d+)\\s*", Ls = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", dr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", oT = /^#([0-9a-f]{3,8})$/, sT = new RegExp(`^rgb\\(${to},${to},${to}\\)$`), uT = new RegExp(`^rgb\\(${dr},${dr},${dr}\\)$`), lT = new RegExp(`^rgba\\(${to},${to},${to},${Ls}\\)$`), cT = new RegExp(`^rgba\\(${dr},${dr},${dr},${Ls}\\)$`), fT = new RegExp(`^hsl\\(${Ls},${dr},${dr}\\)$`), dT = new RegExp(`^hsla\\(${Ls},${dr},${dr},${Ls}\\)$`), Bw = {
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
Dp(Ws, sa, {
  copy(A) {
    return Object.assign(new this.constructor(), this, A);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ww,
  // Deprecated! Use color.formatHex.
  formatHex: ww,
  formatHex8: hT,
  formatHsl: pT,
  formatRgb: mw,
  toString: mw
});
function ww() {
  return this.rgb().formatHex();
}
function hT() {
  return this.rgb().formatHex8();
}
function pT() {
  return B0(this).formatHsl();
}
function mw() {
  return this.rgb().formatRgb();
}
function sa(A) {
  var e, t;
  return A = (A + "").trim().toLowerCase(), (e = oT.exec(A)) ? (t = e[1].length, e = parseInt(e[1], 16), t === 6 ? vw(e) : t === 3 ? new tn(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : t === 8 ? ll(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : t === 4 ? ll(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = sT.exec(A)) ? new tn(e[1], e[2], e[3], 1) : (e = uT.exec(A)) ? new tn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = lT.exec(A)) ? ll(e[1], e[2], e[3], e[4]) : (e = cT.exec(A)) ? ll(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = fT.exec(A)) ? Qw(e[1], e[2] / 100, e[3] / 100, 1) : (e = dT.exec(A)) ? Qw(e[1], e[2] / 100, e[3] / 100, e[4]) : Bw.hasOwnProperty(A) ? vw(Bw[A]) : A === "transparent" ? new tn(NaN, NaN, NaN, 0) : null;
}
function vw(A) {
  return new tn(A >> 16 & 255, A >> 8 & 255, A & 255, 1);
}
function ll(A, e, t, n) {
  return n <= 0 && (A = e = t = NaN), new tn(A, e, t, n);
}
function gT(A) {
  return A instanceof Ws || (A = sa(A)), A ? (A = A.rgb(), new tn(A.r, A.g, A.b, A.opacity)) : new tn();
}
function nh(A, e, t, n) {
  return arguments.length === 1 ? gT(A) : new tn(A, e, t, n ?? 1);
}
function tn(A, e, t, n) {
  this.r = +A, this.g = +e, this.b = +t, this.opacity = +n;
}
Dp(tn, nh, g0(Ws, {
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
    return new tn(ta(this.r), ta(this.g), ta(this.b), cc(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: yw,
  // Deprecated! Use color.formatHex.
  formatHex: yw,
  formatHex8: BT,
  formatRgb: Cw,
  toString: Cw
}));
function yw() {
  return `#${Aa(this.r)}${Aa(this.g)}${Aa(this.b)}`;
}
function BT() {
  return `#${Aa(this.r)}${Aa(this.g)}${Aa(this.b)}${Aa((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Cw() {
  const A = cc(this.opacity);
  return `${A === 1 ? "rgb(" : "rgba("}${ta(this.r)}, ${ta(this.g)}, ${ta(this.b)}${A === 1 ? ")" : `, ${A})`}`;
}
function cc(A) {
  return isNaN(A) ? 1 : Math.max(0, Math.min(1, A));
}
function ta(A) {
  return Math.max(0, Math.min(255, Math.round(A) || 0));
}
function Aa(A) {
  return A = ta(A), (A < 16 ? "0" : "") + A.toString(16);
}
function Qw(A, e, t, n) {
  return n <= 0 ? A = e = t = NaN : t <= 0 || t >= 1 ? A = e = NaN : e <= 0 && (A = NaN), new qn(A, e, t, n);
}
function B0(A) {
  if (A instanceof qn) return new qn(A.h, A.s, A.l, A.opacity);
  if (A instanceof Ws || (A = sa(A)), !A) return new qn();
  if (A instanceof qn) return A;
  A = A.rgb();
  var e = A.r / 255, t = A.g / 255, n = A.b / 255, i = Math.min(e, t, n), s = Math.max(e, t, n), l = NaN, c = s - i, f = (s + i) / 2;
  return c ? (e === s ? l = (t - n) / c + (t < n) * 6 : t === s ? l = (n - e) / c + 2 : l = (e - t) / c + 4, c /= f < 0.5 ? s + i : 2 - s - i, l *= 60) : c = f > 0 && f < 1 ? 0 : l, new qn(l, c, f, A.opacity);
}
function wT(A, e, t, n) {
  return arguments.length === 1 ? B0(A) : new qn(A, e, t, n ?? 1);
}
function qn(A, e, t, n) {
  this.h = +A, this.s = +e, this.l = +t, this.opacity = +n;
}
Dp(qn, wT, g0(Ws, {
  brighter(A) {
    return A = A == null ? lc : Math.pow(lc, A), new qn(this.h, this.s, this.l * A, this.opacity);
  },
  darker(A) {
    return A = A == null ? Ss : Math.pow(Ss, A), new qn(this.h, this.s, this.l * A, this.opacity);
  },
  rgb() {
    var A = this.h % 360 + (this.h < 0) * 360, e = isNaN(A) || isNaN(this.s) ? 0 : this.s, t = this.l, n = t + (t < 0.5 ? t : 1 - t) * e, i = 2 * t - n;
    return new tn(
      gd(A >= 240 ? A - 240 : A + 120, i, n),
      gd(A, i, n),
      gd(A < 120 ? A + 240 : A - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new qn(Fw(this.h), cl(this.s), cl(this.l), cc(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const A = cc(this.opacity);
    return `${A === 1 ? "hsl(" : "hsla("}${Fw(this.h)}, ${cl(this.s) * 100}%, ${cl(this.l) * 100}%${A === 1 ? ")" : `, ${A})`}`;
  }
}));
function Fw(A) {
  return A = (A || 0) % 360, A < 0 ? A + 360 : A;
}
function cl(A) {
  return Math.max(0, Math.min(1, A || 0));
}
function gd(A, e, t) {
  return (A < 60 ? e + (t - e) * A / 60 : A < 180 ? t : A < 240 ? e + (t - e) * (240 - A) / 60 : e) * 255;
}
const Op = (A) => () => A;
function mT(A, e) {
  return function(t) {
    return A + t * e;
  };
}
function vT(A, e, t) {
  return A = Math.pow(A, t), e = Math.pow(e, t) - A, t = 1 / t, function(n) {
    return Math.pow(A + n * e, t);
  };
}
function yT(A) {
  return (A = +A) == 1 ? w0 : function(e, t) {
    return t - e ? vT(e, t, A) : Op(isNaN(e) ? t : e);
  };
}
function w0(A, e) {
  var t = e - A;
  return t ? mT(A, t) : Op(isNaN(A) ? e : A);
}
const fc = function A(e) {
  var t = yT(e);
  function n(i, s) {
    var l = t((i = nh(i)).r, (s = nh(s)).r), c = t(i.g, s.g), f = t(i.b, s.b), p = w0(i.opacity, s.opacity);
    return function(B) {
      return i.r = l(B), i.g = c(B), i.b = f(B), i.opacity = p(B), i + "";
    };
  }
  return n.gamma = A, n;
}(1);
function CT(A, e) {
  e || (e = []);
  var t = A ? Math.min(e.length, A.length) : 0, n = e.slice(), i;
  return function(s) {
    for (i = 0; i < t; ++i) n[i] = A[i] * (1 - s) + e[i] * s;
    return n;
  };
}
function QT(A) {
  return ArrayBuffer.isView(A) && !(A instanceof DataView);
}
function FT(A, e) {
  var t = e ? e.length : 0, n = A ? Math.min(t, A.length) : 0, i = new Array(n), s = new Array(t), l;
  for (l = 0; l < n; ++l) i[l] = Np(A[l], e[l]);
  for (; l < t; ++l) s[l] = e[l];
  return function(c) {
    for (l = 0; l < n; ++l) s[l] = i[l](c);
    return s;
  };
}
function UT(A, e) {
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
function ET(A, e) {
  var t = {}, n = {}, i;
  (A === null || typeof A != "object") && (A = {}), (e === null || typeof e != "object") && (e = {});
  for (i in e)
    i in A ? t[i] = Np(A[i], e[i]) : n[i] = e[i];
  return function(s) {
    for (i in t) n[i] = t[i](s);
    return n;
  };
}
var rh = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Bd = new RegExp(rh.source, "g");
function bT(A) {
  return function() {
    return A;
  };
}
function _T(A) {
  return function(e) {
    return A(e) + "";
  };
}
function m0(A, e) {
  var t = rh.lastIndex = Bd.lastIndex = 0, n, i, s, l = -1, c = [], f = [];
  for (A = A + "", e = e + ""; (n = rh.exec(A)) && (i = Bd.exec(e)); )
    (s = i.index) > t && (s = e.slice(t, s), c[l] ? c[l] += s : c[++l] = s), (n = n[0]) === (i = i[0]) ? c[l] ? c[l] += i : c[++l] = i : (c[++l] = null, f.push({ i: l, x: Wn(n, i) })), t = Bd.lastIndex;
  return t < e.length && (s = e.slice(t), c[l] ? c[l] += s : c[++l] = s), c.length < 2 ? f[0] ? _T(f[0].x) : bT(e) : (e = f.length, function(p) {
    for (var B = 0, w; B < e; ++B) c[(w = f[B]).i] = w.x(p);
    return c.join("");
  });
}
function Np(A, e) {
  var t = typeof e, n;
  return e == null || t === "boolean" ? Op(e) : (t === "number" ? Wn : t === "string" ? (n = sa(e)) ? (e = n, fc) : m0 : e instanceof sa ? fc : e instanceof Date ? UT : QT(e) ? CT : Array.isArray(e) ? FT : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? ET : Wn)(A, e);
}
function xT(A, e) {
  return A = +A, e = +e, function(t) {
    return Math.round(A * (1 - t) + e * t);
  };
}
var Uw = 180 / Math.PI, ih = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function v0(A, e, t, n, i, s) {
  var l, c, f;
  return (l = Math.sqrt(A * A + e * e)) && (A /= l, e /= l), (f = A * t + e * n) && (t -= A * f, n -= e * f), (c = Math.sqrt(t * t + n * n)) && (t /= c, n /= c, f /= c), A * n < e * t && (A = -A, e = -e, f = -f, l = -l), {
    translateX: i,
    translateY: s,
    rotate: Math.atan2(e, A) * Uw,
    skewX: Math.atan(f) * Uw,
    scaleX: l,
    scaleY: c
  };
}
var fl;
function IT(A) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(A + "");
  return e.isIdentity ? ih : v0(e.a, e.b, e.c, e.d, e.e, e.f);
}
function HT(A) {
  return A == null || (fl || (fl = document.createElementNS("http://www.w3.org/2000/svg", "g")), fl.setAttribute("transform", A), !(A = fl.transform.baseVal.consolidate())) ? ih : (A = A.matrix, v0(A.a, A.b, A.c, A.d, A.e, A.f));
}
function y0(A, e, t, n) {
  function i(p) {
    return p.length ? p.pop() + " " : "";
  }
  function s(p, B, w, v, Q, u) {
    if (p !== w || B !== v) {
      var U = Q.push("translate(", null, e, null, t);
      u.push({ i: U - 4, x: Wn(p, w) }, { i: U - 2, x: Wn(B, v) });
    } else (w || v) && Q.push("translate(" + w + e + v + t);
  }
  function l(p, B, w, v) {
    p !== B ? (p - B > 180 ? B += 360 : B - p > 180 && (p += 360), v.push({ i: w.push(i(w) + "rotate(", null, n) - 2, x: Wn(p, B) })) : B && w.push(i(w) + "rotate(" + B + n);
  }
  function c(p, B, w, v) {
    p !== B ? v.push({ i: w.push(i(w) + "skewX(", null, n) - 2, x: Wn(p, B) }) : B && w.push(i(w) + "skewX(" + B + n);
  }
  function f(p, B, w, v, Q, u) {
    if (p !== w || B !== v) {
      var U = Q.push(i(Q) + "scale(", null, ",", null, ")");
      u.push({ i: U - 4, x: Wn(p, w) }, { i: U - 2, x: Wn(B, v) });
    } else (w !== 1 || v !== 1) && Q.push(i(Q) + "scale(" + w + "," + v + ")");
  }
  return function(p, B) {
    var w = [], v = [];
    return p = A(p), B = A(B), s(p.translateX, p.translateY, B.translateX, B.translateY, w, v), l(p.rotate, B.rotate, w, v), c(p.skewX, B.skewX, w, v), f(p.scaleX, p.scaleY, B.scaleX, B.scaleY, w, v), p = B = null, function(Q) {
      for (var u = -1, U = v.length, b; ++u < U; ) w[(b = v[u]).i] = b.x(Q);
      return w.join("");
    };
  };
}
var ST = y0(IT, "px, ", "px)", "deg)"), LT = y0(HT, ", ", ")", ")"), TT = 1e-12;
function Ew(A) {
  return ((A = Math.exp(A)) + 1 / A) / 2;
}
function DT(A) {
  return ((A = Math.exp(A)) - 1 / A) / 2;
}
function OT(A) {
  return ((A = Math.exp(2 * A)) - 1) / (A + 1);
}
const NT = function A(e, t, n) {
  function i(s, l) {
    var c = s[0], f = s[1], p = s[2], B = l[0], w = l[1], v = l[2], Q = B - c, u = w - f, U = Q * Q + u * u, b, E;
    if (U < TT)
      E = Math.log(v / p) / e, b = function(Y) {
        return [
          c + Y * Q,
          f + Y * u,
          p * Math.exp(e * Y * E)
        ];
      };
    else {
      var D = Math.sqrt(U), R = (v * v - p * p + n * U) / (2 * p * t * D), x = (v * v - p * p - n * U) / (2 * v * t * D), K = Math.log(Math.sqrt(R * R + 1) - R), k = Math.log(Math.sqrt(x * x + 1) - x);
      E = (k - K) / e, b = function(Y) {
        var dA = Y * E, cA = Ew(K), wA = p / (t * D) * (cA * OT(e * dA + K) - DT(K));
        return [
          c + wA * Q,
          f + wA * u,
          p * cA / Ew(e * dA + K)
        ];
      };
    }
    return b.duration = E * 1e3 * e / Math.SQRT2, b;
  }
  return i.rho = function(s) {
    var l = Math.max(1e-3, +s), c = l * l, f = c * c;
    return A(l, c, f);
  }, i;
}(Math.SQRT2, 2, 4);
var so = 0, ss = 0, Zo = 0, C0 = 1e3, dc, us, hc = 0, ua = 0, Mc = 0, Ts = typeof performance == "object" && performance.now ? performance : Date, Q0 = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(A) {
  setTimeout(A, 17);
};
function Mp() {
  return ua || (Q0(MT), ua = Ts.now() + Mc);
}
function MT() {
  ua = 0;
}
function pc() {
  this._call = this._time = this._next = null;
}
pc.prototype = F0.prototype = {
  constructor: pc,
  restart: function(A, e, t) {
    if (typeof A != "function") throw new TypeError("callback is not a function");
    t = (t == null ? Mp() : +t) + (e == null ? 0 : +e), !this._next && us !== this && (us ? us._next = this : dc = this, us = this), this._call = A, this._time = t, ah();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ah());
  }
};
function F0(A, e, t) {
  var n = new pc();
  return n.restart(A, e, t), n;
}
function KT() {
  Mp(), ++so;
  for (var A = dc, e; A; )
    (e = ua - A._time) >= 0 && A._call.call(void 0, e), A = A._next;
  --so;
}
function bw() {
  ua = (hc = Ts.now()) + Mc, so = ss = 0;
  try {
    KT();
  } finally {
    so = 0, $T(), ua = 0;
  }
}
function RT() {
  var A = Ts.now(), e = A - hc;
  e > C0 && (Mc -= e, hc = A);
}
function $T() {
  for (var A, e = dc, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), A = e, e = e._next) : (t = e._next, e._next = null, e = A ? A._next = t : dc = t);
  us = A, ah(n);
}
function ah(A) {
  if (!so) {
    ss && (ss = clearTimeout(ss));
    var e = A - ua;
    e > 24 ? (A < 1 / 0 && (ss = setTimeout(bw, A - Ts.now() - Mc)), Zo && (Zo = clearInterval(Zo))) : (Zo || (hc = Ts.now(), Zo = setInterval(RT, C0)), so = 1, Q0(bw));
  }
}
function _w(A, e, t) {
  var n = new pc();
  return e = e == null ? 0 : +e, n.restart((i) => {
    n.stop(), A(i + e);
  }, e, t), n;
}
var PT = Oc("start", "end", "cancel", "interrupt"), kT = [], U0 = 0, xw = 1, oh = 2, ql = 3, Iw = 4, sh = 5, zl = 6;
function Kc(A, e, t, n, i, s) {
  var l = A.__transition;
  if (!l) A.__transition = {};
  else if (t in l) return;
  GT(A, t, {
    name: e,
    index: n,
    // For context during callback.
    group: i,
    // For context during callback.
    on: PT,
    tween: kT,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: U0
  });
}
function Kp(A, e) {
  var t = Jn(A, e);
  if (t.state > U0) throw new Error("too late; already scheduled");
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
function GT(A, e, t) {
  var n = A.__transition, i;
  n[e] = t, t.timer = F0(s, 0, t.time);
  function s(p) {
    t.state = xw, t.timer.restart(l, t.delay, t.time), t.delay <= p && l(p - t.delay);
  }
  function l(p) {
    var B, w, v, Q;
    if (t.state !== xw) return f();
    for (B in n)
      if (Q = n[B], Q.name === t.name) {
        if (Q.state === ql) return _w(l);
        Q.state === Iw ? (Q.state = zl, Q.timer.stop(), Q.on.call("interrupt", A, A.__data__, Q.index, Q.group), delete n[B]) : +B < e && (Q.state = zl, Q.timer.stop(), Q.on.call("cancel", A, A.__data__, Q.index, Q.group), delete n[B]);
      }
    if (_w(function() {
      t.state === ql && (t.state = Iw, t.timer.restart(c, t.delay, t.time), c(p));
    }), t.state = oh, t.on.call("start", A, A.__data__, t.index, t.group), t.state === oh) {
      for (t.state = ql, i = new Array(v = t.tween.length), B = 0, w = -1; B < v; ++B)
        (Q = t.tween[B].value.call(A, A.__data__, t.index, t.group)) && (i[++w] = Q);
      i.length = w + 1;
    }
  }
  function c(p) {
    for (var B = p < t.duration ? t.ease.call(null, p / t.duration) : (t.timer.restart(f), t.state = sh, 1), w = -1, v = i.length; ++w < v; )
      i[w].call(A, B);
    t.state === sh && (t.on.call("end", A, A.__data__, t.index, t.group), f());
  }
  function f() {
    t.state = zl, t.timer.stop(), delete n[e];
    for (var p in n) return;
    delete A.__transition;
  }
}
function Jl(A, e) {
  var t = A.__transition, n, i, s = !0, l;
  if (t) {
    e = e == null ? null : e + "";
    for (l in t) {
      if ((n = t[l]).name !== e) {
        s = !1;
        continue;
      }
      i = n.state > oh && n.state < sh, n.state = zl, n.timer.stop(), n.on.call(i ? "interrupt" : "cancel", A, A.__data__, n.index, n.group), delete t[l];
    }
    s && delete A.__transition;
  }
}
function VT(A) {
  return this.each(function() {
    Jl(this, A);
  });
}
function WT(A, e) {
  var t, n;
  return function() {
    var i = Br(this, A), s = i.tween;
    if (s !== t) {
      n = t = s;
      for (var l = 0, c = n.length; l < c; ++l)
        if (n[l].name === e) {
          n = n.slice(), n.splice(l, 1);
          break;
        }
    }
    i.tween = n;
  };
}
function XT(A, e, t) {
  var n, i;
  if (typeof t != "function") throw new Error();
  return function() {
    var s = Br(this, A), l = s.tween;
    if (l !== n) {
      i = (n = l).slice();
      for (var c = { name: e, value: t }, f = 0, p = i.length; f < p; ++f)
        if (i[f].name === e) {
          i[f] = c;
          break;
        }
      f === p && i.push(c);
    }
    s.tween = i;
  };
}
function qT(A, e) {
  var t = this._id;
  if (A += "", arguments.length < 2) {
    for (var n = Jn(this.node(), t).tween, i = 0, s = n.length, l; i < s; ++i)
      if ((l = n[i]).name === A)
        return l.value;
    return null;
  }
  return this.each((e == null ? WT : XT)(t, A, e));
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
function E0(A, e) {
  var t;
  return (typeof e == "number" ? Wn : e instanceof sa ? fc : (t = sa(e)) ? (e = t, fc) : m0)(A, e);
}
function zT(A) {
  return function() {
    this.removeAttribute(A);
  };
}
function JT(A) {
  return function() {
    this.removeAttributeNS(A.space, A.local);
  };
}
function jT(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttribute(A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function YT(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = this.getAttributeNS(A.space, A.local);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function ZT(A, e, t) {
  var n, i, s;
  return function() {
    var l, c = t(this), f;
    return c == null ? void this.removeAttribute(A) : (l = this.getAttribute(A), f = c + "", l === f ? null : l === n && f === i ? s : (i = f, s = e(n = l, c)));
  };
}
function AD(A, e, t) {
  var n, i, s;
  return function() {
    var l, c = t(this), f;
    return c == null ? void this.removeAttributeNS(A.space, A.local) : (l = this.getAttributeNS(A.space, A.local), f = c + "", l === f ? null : l === n && f === i ? s : (i = f, s = e(n = l, c)));
  };
}
function eD(A, e) {
  var t = Nc(A), n = t === "transform" ? LT : E0;
  return this.attrTween(A, typeof e == "function" ? (t.local ? AD : ZT)(t, n, Rp(this, "attr." + A, e)) : e == null ? (t.local ? JT : zT)(t) : (t.local ? YT : jT)(t, n, e));
}
function tD(A, e) {
  return function(t) {
    this.setAttribute(A, e.call(this, t));
  };
}
function nD(A, e) {
  return function(t) {
    this.setAttributeNS(A.space, A.local, e.call(this, t));
  };
}
function rD(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && nD(A, s)), t;
  }
  return i._value = e, i;
}
function iD(A, e) {
  var t, n;
  function i() {
    var s = e.apply(this, arguments);
    return s !== n && (t = (n = s) && tD(A, s)), t;
  }
  return i._value = e, i;
}
function aD(A, e) {
  var t = "attr." + A;
  if (arguments.length < 2) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  var n = Nc(A);
  return this.tween(t, (n.local ? rD : iD)(n, e));
}
function oD(A, e) {
  return function() {
    Kp(this, A).delay = +e.apply(this, arguments);
  };
}
function sD(A, e) {
  return e = +e, function() {
    Kp(this, A).delay = e;
  };
}
function uD(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? oD : sD)(e, A)) : Jn(this.node(), e).delay;
}
function lD(A, e) {
  return function() {
    Br(this, A).duration = +e.apply(this, arguments);
  };
}
function cD(A, e) {
  return e = +e, function() {
    Br(this, A).duration = e;
  };
}
function fD(A) {
  var e = this._id;
  return arguments.length ? this.each((typeof A == "function" ? lD : cD)(e, A)) : Jn(this.node(), e).duration;
}
function dD(A, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Br(this, A).ease = e;
  };
}
function hD(A) {
  var e = this._id;
  return arguments.length ? this.each(dD(e, A)) : Jn(this.node(), e).ease;
}
function pD(A, e) {
  return function() {
    var t = e.apply(this, arguments);
    if (typeof t != "function") throw new Error();
    Br(this, A).ease = t;
  };
}
function gD(A) {
  if (typeof A != "function") throw new Error();
  return this.each(pD(this._id, A));
}
function BD(A) {
  typeof A != "function" && (A = i0(A));
  for (var e = this._groups, t = e.length, n = new Array(t), i = 0; i < t; ++i)
    for (var s = e[i], l = s.length, c = n[i] = [], f, p = 0; p < l; ++p)
      (f = s[p]) && A.call(f, f.__data__, p, s) && c.push(f);
  return new Wr(n, this._parents, this._name, this._id);
}
function wD(A) {
  if (A._id !== this._id) throw new Error();
  for (var e = this._groups, t = A._groups, n = e.length, i = t.length, s = Math.min(n, i), l = new Array(n), c = 0; c < s; ++c)
    for (var f = e[c], p = t[c], B = f.length, w = l[c] = new Array(B), v, Q = 0; Q < B; ++Q)
      (v = f[Q] || p[Q]) && (w[Q] = v);
  for (; c < n; ++c)
    l[c] = e[c];
  return new Wr(l, this._parents, this._name, this._id);
}
function mD(A) {
  return (A + "").trim().split(/^|\s+/).every(function(e) {
    var t = e.indexOf(".");
    return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
  });
}
function vD(A, e, t) {
  var n, i, s = mD(e) ? Kp : Br;
  return function() {
    var l = s(this, A), c = l.on;
    c !== n && (i = (n = c).copy()).on(e, t), l.on = i;
  };
}
function yD(A, e) {
  var t = this._id;
  return arguments.length < 2 ? Jn(this.node(), t).on.on(A) : this.each(vD(t, A, e));
}
function CD(A) {
  return function() {
    var e = this.parentNode;
    for (var t in this.__transition) if (+t !== A) return;
    e && e.removeChild(this);
  };
}
function QD() {
  return this.on("end.remove", CD(this._id));
}
function FD(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = Sp(A));
  for (var n = this._groups, i = n.length, s = new Array(i), l = 0; l < i; ++l)
    for (var c = n[l], f = c.length, p = s[l] = new Array(f), B, w, v = 0; v < f; ++v)
      (B = c[v]) && (w = A.call(B, B.__data__, v, c)) && ("__data__" in B && (w.__data__ = B.__data__), p[v] = w, Kc(p[v], e, t, v, p, Jn(B, t)));
  return new Wr(s, this._parents, e, t);
}
function UD(A) {
  var e = this._name, t = this._id;
  typeof A != "function" && (A = r0(A));
  for (var n = this._groups, i = n.length, s = [], l = [], c = 0; c < i; ++c)
    for (var f = n[c], p = f.length, B, w = 0; w < p; ++w)
      if (B = f[w]) {
        for (var v = A.call(B, B.__data__, w, f), Q, u = Jn(B, t), U = 0, b = v.length; U < b; ++U)
          (Q = v[U]) && Kc(Q, e, t, U, v, u);
        s.push(v), l.push(B);
      }
  return new Wr(s, l, e, t);
}
var ED = Vs.prototype.constructor;
function bD() {
  return new ED(this._groups, this._parents);
}
function _D(A, e) {
  var t, n, i;
  return function() {
    var s = oo(this, A), l = (this.style.removeProperty(A), oo(this, A));
    return s === l ? null : s === t && l === n ? i : i = e(t = s, n = l);
  };
}
function b0(A) {
  return function() {
    this.style.removeProperty(A);
  };
}
function xD(A, e, t) {
  var n, i = t + "", s;
  return function() {
    var l = oo(this, A);
    return l === i ? null : l === n ? s : s = e(n = l, t);
  };
}
function ID(A, e, t) {
  var n, i, s;
  return function() {
    var l = oo(this, A), c = t(this), f = c + "";
    return c == null && (f = c = (this.style.removeProperty(A), oo(this, A))), l === f ? null : l === n && f === i ? s : (i = f, s = e(n = l, c));
  };
}
function HD(A, e) {
  var t, n, i, s = "style." + e, l = "end." + s, c;
  return function() {
    var f = Br(this, A), p = f.on, B = f.value[s] == null ? c || (c = b0(e)) : void 0;
    (p !== t || i !== B) && (n = (t = p).copy()).on(l, i = B), f.on = n;
  };
}
function SD(A, e, t) {
  var n = (A += "") == "transform" ? ST : E0;
  return e == null ? this.styleTween(A, _D(A, n)).on("end.style." + A, b0(A)) : typeof e == "function" ? this.styleTween(A, ID(A, n, Rp(this, "style." + A, e))).each(HD(this._id, A)) : this.styleTween(A, xD(A, n, e), t).on("end.style." + A, null);
}
function LD(A, e, t) {
  return function(n) {
    this.style.setProperty(A, e.call(this, n), t);
  };
}
function TD(A, e, t) {
  var n, i;
  function s() {
    var l = e.apply(this, arguments);
    return l !== i && (n = (i = l) && LD(A, l, t)), n;
  }
  return s._value = e, s;
}
function DD(A, e, t) {
  var n = "style." + (A += "");
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  return this.tween(n, TD(A, e, t ?? ""));
}
function OD(A) {
  return function() {
    this.textContent = A;
  };
}
function ND(A) {
  return function() {
    var e = A(this);
    this.textContent = e ?? "";
  };
}
function MD(A) {
  return this.tween("text", typeof A == "function" ? ND(Rp(this, "text", A)) : OD(A == null ? "" : A + ""));
}
function KD(A) {
  return function(e) {
    this.textContent = A.call(this, e);
  };
}
function RD(A) {
  var e, t;
  function n() {
    var i = A.apply(this, arguments);
    return i !== t && (e = (t = i) && KD(i)), e;
  }
  return n._value = A, n;
}
function $D(A) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (A == null) return this.tween(e, null);
  if (typeof A != "function") throw new Error();
  return this.tween(e, RD(A));
}
function PD() {
  for (var A = this._name, e = this._id, t = _0(), n = this._groups, i = n.length, s = 0; s < i; ++s)
    for (var l = n[s], c = l.length, f, p = 0; p < c; ++p)
      if (f = l[p]) {
        var B = Jn(f, e);
        Kc(f, A, t, p, l, {
          time: B.time + B.delay + B.duration,
          delay: 0,
          duration: B.duration,
          ease: B.ease
        });
      }
  return new Wr(n, this._parents, A, t);
}
function kD() {
  var A, e, t = this, n = t._id, i = t.size();
  return new Promise(function(s, l) {
    var c = { value: l }, f = { value: function() {
      --i === 0 && s();
    } };
    t.each(function() {
      var p = Br(this, n), B = p.on;
      B !== A && (e = (A = B).copy(), e._.cancel.push(c), e._.interrupt.push(c), e._.end.push(f)), p.on = e;
    }), i === 0 && s();
  });
}
var GD = 0;
function Wr(A, e, t, n) {
  this._groups = A, this._parents = e, this._name = t, this._id = n;
}
function _0() {
  return ++GD;
}
var Nr = Vs.prototype;
Wr.prototype = {
  constructor: Wr,
  select: FD,
  selectAll: UD,
  selectChild: Nr.selectChild,
  selectChildren: Nr.selectChildren,
  filter: BD,
  merge: wD,
  selection: bD,
  transition: PD,
  call: Nr.call,
  nodes: Nr.nodes,
  node: Nr.node,
  size: Nr.size,
  empty: Nr.empty,
  each: Nr.each,
  on: yD,
  attr: eD,
  attrTween: aD,
  style: SD,
  styleTween: DD,
  text: MD,
  textTween: $D,
  remove: QD,
  tween: qT,
  delay: uD,
  duration: fD,
  ease: hD,
  easeVarying: gD,
  end: kD,
  [Symbol.iterator]: Nr[Symbol.iterator]
};
function VD(A) {
  return ((A *= 2) <= 1 ? A * A * A : (A -= 2) * A * A + 2) / 2;
}
var WD = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: VD
};
function XD(A, e) {
  for (var t; !(t = A.__transition) || !(t = t[e]); )
    if (!(A = A.parentNode))
      throw new Error(`transition ${e} not found`);
  return t;
}
function qD(A) {
  var e, t;
  A instanceof Wr ? (e = A._id, A = A._name) : (e = _0(), (t = WD).time = Mp(), A = A == null ? null : A + "");
  for (var n = this._groups, i = n.length, s = 0; s < i; ++s)
    for (var l = n[s], c = l.length, f, p = 0; p < c; ++p)
      (f = l[p]) && Kc(f, A, e, p, l, t || XD(f, e));
  return new Wr(n, this._parents, A, e);
}
Vs.prototype.interrupt = VT;
Vs.prototype.transition = qD;
function zD(A) {
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
function JD(A, e) {
  return function(t, n) {
    for (var i = t.length, s = [], l = 0, c = A[0], f = 0; i > 0 && c > 0 && (f + c + 1 > n && (c = Math.max(1, n - f)), s.push(t.substring(i -= c, i + c)), !((f += c + 1) > n)); )
      c = A[l = (l + 1) % A.length];
    return s.reverse().join(e);
  };
}
function jD(A) {
  return function(e) {
    return e.replace(/[0-9]/g, function(t) {
      return A[+t];
    });
  };
}
var YD = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Bc(A) {
  if (!(e = YD.exec(A))) throw new Error("invalid format: " + A);
  var e;
  return new $p({
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
Bc.prototype = $p.prototype;
function $p(A) {
  this.fill = A.fill === void 0 ? " " : A.fill + "", this.align = A.align === void 0 ? ">" : A.align + "", this.sign = A.sign === void 0 ? "-" : A.sign + "", this.symbol = A.symbol === void 0 ? "" : A.symbol + "", this.zero = !!A.zero, this.width = A.width === void 0 ? void 0 : +A.width, this.comma = !!A.comma, this.precision = A.precision === void 0 ? void 0 : +A.precision, this.trim = !!A.trim, this.type = A.type === void 0 ? "" : A.type + "";
}
$p.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function ZD(A) {
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
function AO(A, e) {
  var t = gc(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1], s = i - (x0 = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, l = n.length;
  return s === l ? n : s > l ? n + new Array(s - l + 1).join("0") : s > 0 ? n.slice(0, s) + "." + n.slice(s) : "0." + new Array(1 - s).join("0") + gc(A, Math.max(0, e + s - 1))[0];
}
function Hw(A, e) {
  var t = gc(A, e);
  if (!t) return A + "";
  var n = t[0], i = t[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const Sw = {
  "%": (A, e) => (A * 100).toFixed(e),
  b: (A) => Math.round(A).toString(2),
  c: (A) => A + "",
  d: zD,
  e: (A, e) => A.toExponential(e),
  f: (A, e) => A.toFixed(e),
  g: (A, e) => A.toPrecision(e),
  o: (A) => Math.round(A).toString(8),
  p: (A, e) => Hw(A * 100, e),
  r: Hw,
  s: AO,
  X: (A) => Math.round(A).toString(16).toUpperCase(),
  x: (A) => Math.round(A).toString(16)
};
function Lw(A) {
  return A;
}
var Tw = Array.prototype.map, Dw = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function eO(A) {
  var e = A.grouping === void 0 || A.thousands === void 0 ? Lw : JD(Tw.call(A.grouping, Number), A.thousands + ""), t = A.currency === void 0 ? "" : A.currency[0] + "", n = A.currency === void 0 ? "" : A.currency[1] + "", i = A.decimal === void 0 ? "." : A.decimal + "", s = A.numerals === void 0 ? Lw : jD(Tw.call(A.numerals, String)), l = A.percent === void 0 ? "%" : A.percent + "", c = A.minus === void 0 ? "−" : A.minus + "", f = A.nan === void 0 ? "NaN" : A.nan + "";
  function p(w) {
    w = Bc(w);
    var v = w.fill, Q = w.align, u = w.sign, U = w.symbol, b = w.zero, E = w.width, D = w.comma, R = w.precision, x = w.trim, K = w.type;
    K === "n" ? (D = !0, K = "g") : Sw[K] || (R === void 0 && (R = 12), x = !0, K = "g"), (b || v === "0" && Q === "=") && (b = !0, v = "0", Q = "=");
    var k = U === "$" ? t : U === "#" && /[boxX]/.test(K) ? "0" + K.toLowerCase() : "", Y = U === "$" ? n : /[%p]/.test(K) ? l : "", dA = Sw[K], cA = /[defgprs%]/.test(K);
    R = R === void 0 ? 6 : /[gprs]/.test(K) ? Math.max(1, Math.min(21, R)) : Math.max(0, Math.min(20, R));
    function wA(EA) {
      var NA = k, xA = Y, X, CA, tA;
      if (K === "c")
        xA = dA(EA) + xA, EA = "";
      else {
        EA = +EA;
        var fA = EA < 0 || 1 / EA < 0;
        if (EA = isNaN(EA) ? f : dA(Math.abs(EA), R), x && (EA = ZD(EA)), fA && +EA == 0 && u !== "+" && (fA = !1), NA = (fA ? u === "(" ? u : c : u === "-" || u === "(" ? "" : u) + NA, xA = (K === "s" ? Dw[8 + x0 / 3] : "") + xA + (fA && u === "(" ? ")" : ""), cA) {
          for (X = -1, CA = EA.length; ++X < CA; )
            if (tA = EA.charCodeAt(X), 48 > tA || tA > 57) {
              xA = (tA === 46 ? i + EA.slice(X + 1) : EA.slice(X)) + xA, EA = EA.slice(0, X);
              break;
            }
        }
      }
      D && !b && (EA = e(EA, 1 / 0));
      var _A = NA.length + EA.length + xA.length, IA = _A < E ? new Array(E - _A + 1).join(v) : "";
      switch (D && b && (EA = e(IA + EA, IA.length ? E - xA.length : 1 / 0), IA = ""), Q) {
        case "<":
          EA = NA + EA + xA + IA;
          break;
        case "=":
          EA = NA + IA + EA + xA;
          break;
        case "^":
          EA = IA.slice(0, _A = IA.length >> 1) + NA + EA + xA + IA.slice(_A);
          break;
        default:
          EA = IA + NA + EA + xA;
          break;
      }
      return s(EA);
    }
    return wA.toString = function() {
      return w + "";
    }, wA;
  }
  function B(w, v) {
    var Q = p((w = Bc(w), w.type = "f", w)), u = Math.max(-8, Math.min(8, Math.floor(uo(v) / 3))) * 3, U = Math.pow(10, -u), b = Dw[8 + u / 3];
    return function(E) {
      return Q(U * E) + b;
    };
  }
  return {
    format: p,
    formatPrefix: B
  };
}
var dl, I0, H0;
tO({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function tO(A) {
  return dl = eO(A), I0 = dl.format, H0 = dl.formatPrefix, dl;
}
function nO(A) {
  return Math.max(0, -uo(Math.abs(A)));
}
function rO(A, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(uo(e) / 3))) * 3 - uo(Math.abs(A)));
}
function iO(A, e) {
  return A = Math.abs(A), e = Math.abs(e) - A, Math.max(0, uo(e) - uo(A)) + 1;
}
function aO(A, e) {
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
function oO(A) {
  return function() {
    return A;
  };
}
function sO(A) {
  return +A;
}
var Ow = [0, 1];
function ja(A) {
  return A;
}
function uh(A, e) {
  return (e -= A = +A) ? function(t) {
    return (t - A) / e;
  } : oO(isNaN(e) ? NaN : 0.5);
}
function uO(A, e) {
  var t;
  return A > e && (t = A, A = e, e = t), function(n) {
    return Math.max(A, Math.min(e, n));
  };
}
function lO(A, e, t) {
  var n = A[0], i = A[1], s = e[0], l = e[1];
  return i < n ? (n = uh(i, n), s = t(l, s)) : (n = uh(n, i), s = t(s, l)), function(c) {
    return s(n(c));
  };
}
function cO(A, e, t) {
  var n = Math.min(A.length, e.length) - 1, i = new Array(n), s = new Array(n), l = -1;
  for (A[n] < A[0] && (A = A.slice().reverse(), e = e.slice().reverse()); ++l < n; )
    i[l] = uh(A[l], A[l + 1]), s[l] = t(e[l], e[l + 1]);
  return function(c) {
    var f = hS(A, c, 1, n) - 1;
    return s[f](i[f](c));
  };
}
function fO(A, e) {
  return e.domain(A.domain()).range(A.range()).interpolate(A.interpolate()).clamp(A.clamp()).unknown(A.unknown());
}
function dO() {
  var A = Ow, e = Ow, t = Np, n, i, s, l = ja, c, f, p;
  function B() {
    var v = Math.min(A.length, e.length);
    return l !== ja && (l = uO(A[0], A[v - 1])), c = v > 2 ? cO : lO, f = p = null, w;
  }
  function w(v) {
    return v == null || isNaN(v = +v) ? s : (f || (f = c(A.map(n), e, t)))(n(l(v)));
  }
  return w.invert = function(v) {
    return l(i((p || (p = c(e, A.map(n), Wn)))(v)));
  }, w.domain = function(v) {
    return arguments.length ? (A = Array.from(v, sO), B()) : A.slice();
  }, w.range = function(v) {
    return arguments.length ? (e = Array.from(v), B()) : e.slice();
  }, w.rangeRound = function(v) {
    return e = Array.from(v), t = xT, B();
  }, w.clamp = function(v) {
    return arguments.length ? (l = v ? !0 : ja, B()) : l !== ja;
  }, w.interpolate = function(v) {
    return arguments.length ? (t = v, B()) : t;
  }, w.unknown = function(v) {
    return arguments.length ? (s = v, w) : s;
  }, function(v, Q) {
    return n = v, i = Q, B();
  };
}
function hO() {
  return dO()(ja, ja);
}
function pO(A, e, t, n) {
  var i = mS(A, e, t), s;
  switch (n = Bc(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(A), Math.abs(e));
      return n.precision == null && !isNaN(s = rO(i, l)) && (n.precision = s), H0(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(s = iO(i, Math.max(Math.abs(A), Math.abs(e)))) && (n.precision = s - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(s = nO(i)) && (n.precision = s - (n.type === "%") * 2);
      break;
    }
  }
  return I0(n);
}
function gO(A) {
  var e = A.domain;
  return A.ticks = function(t) {
    var n = e();
    return wS(n[0], n[n.length - 1], t ?? 10);
  }, A.tickFormat = function(t, n) {
    var i = e();
    return pO(i[0], i[i.length - 1], t ?? 10, n);
  }, A.nice = function(t) {
    t == null && (t = 10);
    var n = e(), i = 0, s = n.length - 1, l = n[i], c = n[s], f, p, B = 10;
    for (c < l && (p = l, l = c, c = p, p = i, i = s, s = p); B-- > 0; ) {
      if (p = Zd(l, c, t), p === f)
        return n[i] = l, n[s] = c, e(n);
      if (p > 0)
        l = Math.floor(l / p) * p, c = Math.ceil(c / p) * p;
      else if (p < 0)
        l = Math.ceil(l * p) / p, c = Math.floor(c * p) / p;
      else
        break;
      f = p;
    }
    return A;
  }, A;
}
function ca() {
  var A = hO();
  return A.copy = function() {
    return fO(A, ca());
  }, aO.apply(A, arguments), gO(A);
}
const hl = (A) => () => A;
function BO(A, {
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
function $r(A, e, t) {
  this.k = A, this.x = e, this.y = t;
}
$r.prototype = {
  constructor: $r,
  scale: function(A) {
    return A === 1 ? this : new $r(this.k * A, this.x, this.y);
  },
  translate: function(A, e) {
    return A === 0 & e === 0 ? this : new $r(this.k, this.x + this.k * A, this.y + this.k * e);
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
var Pp = new $r(1, 0, 0);
Xa.prototype = $r.prototype;
function Xa(A) {
  for (; !A.__zoom; ) if (!(A = A.parentNode)) return Pp;
  return A.__zoom;
}
function wd(A) {
  A.stopImmediatePropagation();
}
function As(A) {
  A.preventDefault(), A.stopImmediatePropagation();
}
function wO(A) {
  return (!A.ctrlKey || A.type === "wheel") && !A.button;
}
function mO() {
  var A = this;
  return A instanceof SVGElement ? (A = A.ownerSVGElement || A, A.hasAttribute("viewBox") ? (A = A.viewBox.baseVal, [[A.x, A.y], [A.x + A.width, A.y + A.height]]) : [[0, 0], [A.width.baseVal.value, A.height.baseVal.value]]) : [[0, 0], [A.clientWidth, A.clientHeight]];
}
function Nw() {
  return this.__zoom || Pp;
}
function vO(A) {
  return -A.deltaY * (A.deltaMode === 1 ? 0.05 : A.deltaMode ? 1 : 2e-3) * (A.ctrlKey ? 10 : 1);
}
function yO() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function CO(A, e, t) {
  var n = A.invertX(e[0][0]) - t[0][0], i = A.invertX(e[1][0]) - t[1][0], s = A.invertY(e[0][1]) - t[0][1], l = A.invertY(e[1][1]) - t[1][1];
  return A.translate(
    i > n ? (n + i) / 2 : Math.min(0, n) || Math.max(0, i),
    l > s ? (s + l) / 2 : Math.min(0, s) || Math.max(0, l)
  );
}
function QO() {
  var A = wO, e = mO, t = CO, n = vO, i = yO, s = [0, 1 / 0], l = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], c = 250, f = NT, p = Oc("start", "zoom", "end"), B, w, v, Q = 500, u = 150, U = 0, b = 10;
  function E(X) {
    X.property("__zoom", Nw).on("wheel.zoom", dA, { passive: !1 }).on("mousedown.zoom", cA).on("dblclick.zoom", wA).filter(i).on("touchstart.zoom", EA).on("touchmove.zoom", NA).on("touchend.zoom touchcancel.zoom", xA).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  E.transform = function(X, CA, tA, fA) {
    var _A = X.selection ? X.selection() : X;
    _A.property("__zoom", Nw), X !== _A ? K(X, CA, tA, fA) : _A.interrupt().each(function() {
      k(this, arguments).event(fA).start().zoom(null, typeof CA == "function" ? CA.apply(this, arguments) : CA).end();
    });
  }, E.scaleBy = function(X, CA, tA, fA) {
    E.scaleTo(X, function() {
      var _A = this.__zoom.k, IA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
      return _A * IA;
    }, tA, fA);
  }, E.scaleTo = function(X, CA, tA, fA) {
    E.transform(X, function() {
      var _A = e.apply(this, arguments), IA = this.__zoom, aA = tA == null ? x(_A) : typeof tA == "function" ? tA.apply(this, arguments) : tA, T = IA.invert(aA), eA = typeof CA == "function" ? CA.apply(this, arguments) : CA;
      return t(R(D(IA, eA), aA, T), _A, l);
    }, tA, fA);
  }, E.translateBy = function(X, CA, tA, fA) {
    E.transform(X, function() {
      return t(this.__zoom.translate(
        typeof CA == "function" ? CA.apply(this, arguments) : CA,
        typeof tA == "function" ? tA.apply(this, arguments) : tA
      ), e.apply(this, arguments), l);
    }, null, fA);
  }, E.translateTo = function(X, CA, tA, fA, _A) {
    E.transform(X, function() {
      var IA = e.apply(this, arguments), aA = this.__zoom, T = fA == null ? x(IA) : typeof fA == "function" ? fA.apply(this, arguments) : fA;
      return t(Pp.translate(T[0], T[1]).scale(aA.k).translate(
        typeof CA == "function" ? -CA.apply(this, arguments) : -CA,
        typeof tA == "function" ? -tA.apply(this, arguments) : -tA
      ), IA, l);
    }, fA, _A);
  };
  function D(X, CA) {
    return CA = Math.max(s[0], Math.min(s[1], CA)), CA === X.k ? X : new $r(CA, X.x, X.y);
  }
  function R(X, CA, tA) {
    var fA = CA[0] - tA[0] * X.k, _A = CA[1] - tA[1] * X.k;
    return fA === X.x && _A === X.y ? X : new $r(X.k, fA, _A);
  }
  function x(X) {
    return [(+X[0][0] + +X[1][0]) / 2, (+X[0][1] + +X[1][1]) / 2];
  }
  function K(X, CA, tA, fA) {
    X.on("start.zoom", function() {
      k(this, arguments).event(fA).start();
    }).on("interrupt.zoom end.zoom", function() {
      k(this, arguments).event(fA).end();
    }).tween("zoom", function() {
      var _A = this, IA = arguments, aA = k(_A, IA).event(fA), T = e.apply(_A, IA), eA = tA == null ? x(T) : typeof tA == "function" ? tA.apply(_A, IA) : tA, J = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), L = _A.__zoom, $ = typeof CA == "function" ? CA.apply(_A, IA) : CA, rA = f(L.invert(eA).concat(J / L.k), $.invert(eA).concat(J / $.k));
      return function(FA) {
        if (FA === 1) FA = $;
        else {
          var UA = rA(FA), zA = J / UA[2];
          FA = new $r(zA, eA[0] - UA[0] * zA, eA[1] - UA[1] * zA);
        }
        aA.zoom(null, FA);
      };
    });
  }
  function k(X, CA, tA) {
    return !tA && X.__zooming || new Y(X, CA);
  }
  function Y(X, CA) {
    this.that = X, this.args = CA, this.active = 0, this.sourceEvent = null, this.extent = e.apply(X, CA), this.taps = 0;
  }
  Y.prototype = {
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
      p.call(
        X,
        this.that,
        new BO(X, {
          sourceEvent: this.sourceEvent,
          target: E,
          type: X,
          transform: this.that.__zoom,
          dispatch: p
        }),
        CA
      );
    }
  };
  function dA(X, ...CA) {
    if (!A.apply(this, arguments)) return;
    var tA = k(this, CA).event(X), fA = this.__zoom, _A = Math.max(s[0], Math.min(s[1], fA.k * Math.pow(2, n.apply(this, arguments)))), IA = Vn(X);
    if (tA.wheel)
      (tA.mouse[0][0] !== IA[0] || tA.mouse[0][1] !== IA[1]) && (tA.mouse[1] = fA.invert(tA.mouse[0] = IA)), clearTimeout(tA.wheel);
    else {
      if (fA.k === _A) return;
      tA.mouse = [IA, fA.invert(IA)], Jl(this), tA.start();
    }
    As(X), tA.wheel = setTimeout(aA, u), tA.zoom("mouse", t(R(D(fA, _A), tA.mouse[0], tA.mouse[1]), tA.extent, l));
    function aA() {
      tA.wheel = null, tA.end();
    }
  }
  function cA(X, ...CA) {
    if (v || !A.apply(this, arguments)) return;
    var tA = X.currentTarget, fA = k(this, CA, !0).event(X), _A = WA(X.view).on("mousemove.zoom", eA, !0).on("mouseup.zoom", J, !0), IA = Vn(X, tA), aA = X.clientX, T = X.clientY;
    h0(X.view), wd(X), fA.mouse = [IA, this.__zoom.invert(IA)], Jl(this), fA.start();
    function eA(L) {
      if (As(L), !fA.moved) {
        var $ = L.clientX - aA, rA = L.clientY - T;
        fA.moved = $ * $ + rA * rA > U;
      }
      fA.event(L).zoom("mouse", t(R(fA.that.__zoom, fA.mouse[0] = Vn(L, tA), fA.mouse[1]), fA.extent, l));
    }
    function J(L) {
      _A.on("mousemove.zoom mouseup.zoom", null), p0(L.view, fA.moved), As(L), fA.event(L).end();
    }
  }
  function wA(X, ...CA) {
    if (A.apply(this, arguments)) {
      var tA = this.__zoom, fA = Vn(X.changedTouches ? X.changedTouches[0] : X, this), _A = tA.invert(fA), IA = tA.k * (X.shiftKey ? 0.5 : 2), aA = t(R(D(tA, IA), fA, _A), e.apply(this, CA), l);
      As(X), c > 0 ? WA(this).transition().duration(c).call(K, aA, fA, X) : WA(this).call(E.transform, aA, fA, X);
    }
  }
  function EA(X, ...CA) {
    if (A.apply(this, arguments)) {
      var tA = X.touches, fA = tA.length, _A = k(this, CA, X.changedTouches.length === fA).event(X), IA, aA, T, eA;
      for (wd(X), aA = 0; aA < fA; ++aA)
        T = tA[aA], eA = Vn(T, this), eA = [eA, this.__zoom.invert(eA), T.identifier], _A.touch0 ? !_A.touch1 && _A.touch0[2] !== eA[2] && (_A.touch1 = eA, _A.taps = 0) : (_A.touch0 = eA, IA = !0, _A.taps = 1 + !!B);
      B && (B = clearTimeout(B)), IA && (_A.taps < 2 && (w = eA[0], B = setTimeout(function() {
        B = null;
      }, Q)), Jl(this), _A.start());
    }
  }
  function NA(X, ...CA) {
    if (this.__zooming) {
      var tA = k(this, CA).event(X), fA = X.changedTouches, _A = fA.length, IA, aA, T, eA;
      for (As(X), IA = 0; IA < _A; ++IA)
        aA = fA[IA], T = Vn(aA, this), tA.touch0 && tA.touch0[2] === aA.identifier ? tA.touch0[0] = T : tA.touch1 && tA.touch1[2] === aA.identifier && (tA.touch1[0] = T);
      if (aA = tA.that.__zoom, tA.touch1) {
        var J = tA.touch0[0], L = tA.touch0[1], $ = tA.touch1[0], rA = tA.touch1[1], FA = (FA = $[0] - J[0]) * FA + (FA = $[1] - J[1]) * FA, UA = (UA = rA[0] - L[0]) * UA + (UA = rA[1] - L[1]) * UA;
        aA = D(aA, Math.sqrt(FA / UA)), T = [(J[0] + $[0]) / 2, (J[1] + $[1]) / 2], eA = [(L[0] + rA[0]) / 2, (L[1] + rA[1]) / 2];
      } else if (tA.touch0) T = tA.touch0[0], eA = tA.touch0[1];
      else return;
      tA.zoom("touch", t(R(aA, T, eA), tA.extent, l));
    }
  }
  function xA(X, ...CA) {
    if (this.__zooming) {
      var tA = k(this, CA).event(X), fA = X.changedTouches, _A = fA.length, IA, aA;
      for (wd(X), v && clearTimeout(v), v = setTimeout(function() {
        v = null;
      }, Q), IA = 0; IA < _A; ++IA)
        aA = fA[IA], tA.touch0 && tA.touch0[2] === aA.identifier ? delete tA.touch0 : tA.touch1 && tA.touch1[2] === aA.identifier && delete tA.touch1;
      if (tA.touch1 && !tA.touch0 && (tA.touch0 = tA.touch1, delete tA.touch1), tA.touch0) tA.touch0[1] = this.__zoom.invert(tA.touch0[0]);
      else if (tA.end(), tA.taps === 2 && (aA = Vn(aA, this), Math.hypot(w[0] - aA[0], w[1] - aA[1]) < b)) {
        var T = WA(this).on("dblclick.zoom");
        T && T.apply(this, arguments);
      }
    }
  }
  return E.wheelDelta = function(X) {
    return arguments.length ? (n = typeof X == "function" ? X : hl(+X), E) : n;
  }, E.filter = function(X) {
    return arguments.length ? (A = typeof X == "function" ? X : hl(!!X), E) : A;
  }, E.touchable = function(X) {
    return arguments.length ? (i = typeof X == "function" ? X : hl(!!X), E) : i;
  }, E.extent = function(X) {
    return arguments.length ? (e = typeof X == "function" ? X : hl([[+X[0][0], +X[0][1]], [+X[1][0], +X[1][1]]]), E) : e;
  }, E.scaleExtent = function(X) {
    return arguments.length ? (s[0] = +X[0], s[1] = +X[1], E) : [s[0], s[1]];
  }, E.translateExtent = function(X) {
    return arguments.length ? (l[0][0] = +X[0][0], l[1][0] = +X[1][0], l[0][1] = +X[0][1], l[1][1] = +X[1][1], E) : [[l[0][0], l[0][1]], [l[1][0], l[1][1]]];
  }, E.constrain = function(X) {
    return arguments.length ? (t = X, E) : t;
  }, E.duration = function(X) {
    return arguments.length ? (c = +X, E) : c;
  }, E.interpolate = function(X) {
    return arguments.length ? (f = X, E) : f;
  }, E.on = function() {
    var X = p.on.apply(p, arguments);
    return X === p ? E : X;
  }, E.clickDistance = function(X) {
    return arguments.length ? (U = (X = +X) * X, E) : Math.sqrt(U);
  }, E.tapDistance = function(X) {
    return arguments.length ? (b = +X, E) : b;
  }, E;
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
  })(typeof window < "u" ? window : Va, function(e, t) {
    var n = [], i = e.document, s = n.slice, l = n.concat, c = n.push, f = n.indexOf, p = {}, B = p.toString, w = p.hasOwnProperty, v = {}, Q = "1.12.4", u = function(o, d) {
      return new u.fn.init(o, d);
    }, U = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, b = /^-ms-/, E = /-([\da-z])/gi, D = function(o, d) {
      return d.toUpperCase();
    };
    u.fn = u.prototype = {
      // The current version of jQuery being used
      jquery: Q,
      constructor: u,
      // Start with an empty selector
      selector: "",
      // The default length of a jQuery object is 0
      length: 0,
      toArray: function() {
        return s.call(this);
      },
      // Get the Nth element in the matched element set OR
      // Get the whole matched element set as a clean array
      get: function(o) {
        return o != null ? (
          // Return just the one element from the set
          o < 0 ? this[o + this.length] : this[o]
        ) : (
          // Return all the elements in a clean array
          s.call(this)
        );
      },
      // Take an array of elements and push it onto the stack
      // (returning the new matched element set)
      pushStack: function(o) {
        var d = u.merge(this.constructor(), o);
        return d.prevObject = this, d.context = this.context, d;
      },
      // Execute a callback for every element in the matched set.
      each: function(o) {
        return u.each(this, o);
      },
      map: function(o) {
        return this.pushStack(u.map(this, function(d, g) {
          return o.call(d, g, d);
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
      eq: function(o) {
        var d = this.length, g = +o + (o < 0 ? d : 0);
        return this.pushStack(g >= 0 && g < d ? [this[g]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      // For internal use only.
      // Behaves like an Array's method, not like a jQuery method.
      push: c,
      sort: n.sort,
      splice: n.splice
    }, u.extend = u.fn.extend = function() {
      var o, d, g, m, C, F, H = arguments[0] || {}, M = 1, W = arguments.length, q = !1;
      for (typeof H == "boolean" && (q = H, H = arguments[M] || {}, M++), typeof H != "object" && !u.isFunction(H) && (H = {}), M === W && (H = this, M--); M < W; M++)
        if ((C = arguments[M]) != null)
          for (m in C)
            o = H[m], g = C[m], H !== g && (q && g && (u.isPlainObject(g) || (d = u.isArray(g))) ? (d ? (d = !1, F = o && u.isArray(o) ? o : []) : F = o && u.isPlainObject(o) ? o : {}, H[m] = u.extend(q, F, g)) : g !== void 0 && (H[m] = g));
      return H;
    }, u.extend({
      // Unique for each copy of jQuery on the page
      expando: "jQuery" + (Q + Math.random()).replace(/\D/g, ""),
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
        return u.type(o) === "function";
      },
      isArray: Array.isArray || function(o) {
        return u.type(o) === "array";
      },
      isWindow: function(o) {
        return o != null && o == o.window;
      },
      isNumeric: function(o) {
        var d = o && o.toString();
        return !u.isArray(o) && d - parseFloat(d) + 1 >= 0;
      },
      isEmptyObject: function(o) {
        var d;
        for (d in o)
          return !1;
        return !0;
      },
      isPlainObject: function(o) {
        var d;
        if (!o || u.type(o) !== "object" || o.nodeType || u.isWindow(o))
          return !1;
        try {
          if (o.constructor && !w.call(o, "constructor") && !w.call(o.constructor.prototype, "isPrototypeOf"))
            return !1;
        } catch {
          return !1;
        }
        if (!v.ownFirst)
          for (d in o)
            return w.call(o, d);
        for (d in o)
          ;
        return d === void 0 || w.call(o, d);
      },
      type: function(o) {
        return o == null ? o + "" : typeof o == "object" || typeof o == "function" ? p[B.call(o)] || "object" : typeof o;
      },
      // Workarounds based on findings by Jim Driscoll
      // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
      globalEval: function(o) {
        o && u.trim(o) && (e.execScript || function(d) {
          e.eval.call(e, d);
        })(o);
      },
      // Convert dashed to camelCase; used by the css and data modules
      // Microsoft forgot to hump their vendor prefix (#9572)
      camelCase: function(o) {
        return o.replace(b, "ms-").replace(E, D);
      },
      nodeName: function(o, d) {
        return o.nodeName && o.nodeName.toLowerCase() === d.toLowerCase();
      },
      each: function(o, d) {
        var g, m = 0;
        if (R(o))
          for (g = o.length; m < g && d.call(o[m], m, o[m]) !== !1; m++)
            ;
        else
          for (m in o)
            if (d.call(o[m], m, o[m]) === !1)
              break;
        return o;
      },
      // Support: Android<4.1, IE<9
      trim: function(o) {
        return o == null ? "" : (o + "").replace(U, "");
      },
      // results is for internal usage only
      makeArray: function(o, d) {
        var g = d || [];
        return o != null && (R(Object(o)) ? u.merge(
          g,
          typeof o == "string" ? [o] : o
        ) : c.call(g, o)), g;
      },
      inArray: function(o, d, g) {
        var m;
        if (d) {
          if (f)
            return f.call(d, o, g);
          for (m = d.length, g = g ? g < 0 ? Math.max(0, m + g) : g : 0; g < m; g++)
            if (g in d && d[g] === o)
              return g;
        }
        return -1;
      },
      merge: function(o, d) {
        for (var g = +d.length, m = 0, C = o.length; m < g; )
          o[C++] = d[m++];
        if (g !== g)
          for (; d[m] !== void 0; )
            o[C++] = d[m++];
        return o.length = C, o;
      },
      grep: function(o, d, g) {
        for (var m, C = [], F = 0, H = o.length, M = !g; F < H; F++)
          m = !d(o[F], F), m !== M && C.push(o[F]);
        return C;
      },
      // arg is for internal usage only
      map: function(o, d, g) {
        var m, C, F = 0, H = [];
        if (R(o))
          for (m = o.length; F < m; F++)
            C = d(o[F], F, g), C != null && H.push(C);
        else
          for (F in o)
            C = d(o[F], F, g), C != null && H.push(C);
        return l.apply([], H);
      },
      // A global GUID counter for objects
      guid: 1,
      // Bind a function to a context, optionally partially applying any
      // arguments.
      proxy: function(o, d) {
        var g, m, C;
        if (typeof d == "string" && (C = o[d], d = o, o = C), !!u.isFunction(o))
          return g = s.call(arguments, 2), m = function() {
            return o.apply(d || this, g.concat(s.call(arguments)));
          }, m.guid = o.guid = o.guid || u.guid++, m;
      },
      now: function() {
        return +/* @__PURE__ */ new Date();
      },
      // jQuery.support is not used in Core but other projects attach their
      // properties to it so it needs to exist.
      support: v
    }), typeof Symbol == "function" && (u.fn[Symbol.iterator] = n[Symbol.iterator]), u.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
      function(o, d) {
        p["[object " + d + "]"] = d.toLowerCase();
      }
    );
    function R(o) {
      var d = !!o && "length" in o && o.length, g = u.type(o);
      return g === "function" || u.isWindow(o) ? !1 : g === "array" || d === 0 || typeof d == "number" && d > 0 && d - 1 in o;
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
      function(o) {
        var d, g, m, C, F, H, M, W, q, AA, mA, SA, yA, ie, YA, ue, pt, Je, Ar, RA = "sizzle" + 1 * /* @__PURE__ */ new Date(), ct = o.document, le = 0, qe = 0, Ln = j(), Fa = j(), Ht = j(), Tn = function(N, G) {
          return N === G && (mA = !0), 0;
        }, er = 1 << 31, Dn = {}.hasOwnProperty, $e = [], St = $e.pop, Ni = $e.push, On = $e.push, Lo = $e.slice, Ur = function(N, G) {
          for (var z = 0, uA = N.length; z < uA; z++)
            if (N[z] === G)
              return z;
          return -1;
        }, To = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", De = "[\\x20\\t\\r\\n\\f]", Er = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", Eu = "\\[" + De + "*(" + Er + ")(?:" + De + // Operator (capture 2)
        "*([*^$|!~]?=)" + De + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Er + "))|)" + De + "*\\]", tr = ":(" + Er + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + Eu + ")*)|.*)\\)|)", df = new RegExp(De + "+", "g"), Ua = new RegExp("^" + De + "+|((?:^|[^\\\\])(?:\\\\.)*)" + De + "+$", "g"), Do = new RegExp("^" + De + "*," + De + "*"), bu = new RegExp("^" + De + "*([>+~]|" + De + ")" + De + "*"), nr = new RegExp("=" + De + `*([^\\]'"]*?)` + De + "*\\]", "g"), Ea = new RegExp(tr), _u = new RegExp("^" + Er + "$"), ba = {
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
        }, hf = /^(?:input|select|textarea|button)$/i, ii = /^h\d$/i, vt = /^[^{]+\{\s*\[native \w/, xu = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Oo = /[+~]/, pf = /'|\\/g, Nn = new RegExp("\\\\([\\da-f]{1,6}" + De + "?|(" + De + ")|.)", "ig"), Mn = function(N, G, z) {
          var uA = "0x" + G - 65536;
          return uA !== uA || z ? G : uA < 0 ? (
            // BMP codepoint
            String.fromCharCode(uA + 65536)
          ) : (
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode(uA >> 10 | 55296, uA & 1023 | 56320)
          );
        }, Iu = function() {
          SA();
        };
        try {
          On.apply(
            $e = Lo.call(ct.childNodes),
            ct.childNodes
          ), $e[ct.childNodes.length].nodeType;
        } catch {
          On = {
            apply: $e.length ? (
              // Leverage slice if possible
              function(G, z) {
                Ni.apply(G, Lo.call(z));
              }
            ) : (
              // Support: IE<9
              // Otherwise append directly
              function(G, z) {
                for (var uA = G.length, nA = 0; G[uA++] = z[nA++]; )
                  ;
                G.length = uA - 1;
              }
            )
          };
        }
        function xe(N, G, z, uA) {
          var nA, BA, hA, HA, GA, re, VA, ZA, fe = G && G.ownerDocument, Se = G ? G.nodeType : 9;
          if (z = z || [], typeof N != "string" || !N || Se !== 1 && Se !== 9 && Se !== 11)
            return z;
          if (!uA && ((G ? G.ownerDocument || G : ct) !== yA && SA(G), G = G || yA, YA)) {
            if (Se !== 11 && (re = xu.exec(N)))
              if (nA = re[1]) {
                if (Se === 9)
                  if (hA = G.getElementById(nA)) {
                    if (hA.id === nA)
                      return z.push(hA), z;
                  } else
                    return z;
                else if (fe && (hA = fe.getElementById(nA)) && Ar(G, hA) && hA.id === nA)
                  return z.push(hA), z;
              } else {
                if (re[2])
                  return On.apply(z, G.getElementsByTagName(N)), z;
                if ((nA = re[3]) && g.getElementsByClassName && G.getElementsByClassName)
                  return On.apply(z, G.getElementsByClassName(nA)), z;
              }
            if (g.qsa && !Ht[N + " "] && (!ue || !ue.test(N))) {
              if (Se !== 1)
                fe = G, ZA = N;
              else if (G.nodeName.toLowerCase() !== "object") {
                for ((HA = G.getAttribute("id")) ? HA = HA.replace(pf, "\\$&") : G.setAttribute("id", HA = RA), VA = H(N), BA = VA.length, GA = _u.test(HA) ? "#" + HA : "[id='" + HA + "']"; BA--; )
                  VA[BA] = GA + " " + yt(VA[BA]);
                ZA = VA.join(","), fe = Oo.test(N) && Mi(G.parentNode) || G;
              }
              if (ZA)
                try {
                  return On.apply(
                    z,
                    fe.querySelectorAll(ZA)
                  ), z;
                } catch {
                } finally {
                  HA === RA && G.removeAttribute("id");
                }
            }
          }
          return W(N.replace(Ua, "$1"), G, z, uA);
        }
        function j() {
          var N = [];
          function G(z, uA) {
            return N.push(z + " ") > m.cacheLength && delete G[N.shift()], G[z + " "] = uA;
          }
          return G;
        }
        function oA(N) {
          return N[RA] = !0, N;
        }
        function iA(N) {
          var G = yA.createElement("div");
          try {
            return !!N(G);
          } catch {
            return !1;
          } finally {
            G.parentNode && G.parentNode.removeChild(G), G = null;
          }
        }
        function OA(N, G) {
          for (var z = N.split("|"), uA = z.length; uA--; )
            m.attrHandle[z[uA]] = G;
        }
        function ae(N, G) {
          var z = G && N, uA = z && N.nodeType === 1 && G.nodeType === 1 && (~G.sourceIndex || er) - (~N.sourceIndex || er);
          if (uA)
            return uA;
          if (z) {
            for (; z = z.nextSibling; )
              if (z === G)
                return -1;
          }
          return N ? 1 : -1;
        }
        function Ie(N) {
          return function(G) {
            var z = G.nodeName.toLowerCase();
            return z === "input" && G.type === N;
          };
        }
        function tt(N) {
          return function(G) {
            var z = G.nodeName.toLowerCase();
            return (z === "input" || z === "button") && G.type === N;
          };
        }
        function Ee(N) {
          return oA(function(G) {
            return G = +G, oA(function(z, uA) {
              for (var nA, BA = N([], z.length, G), hA = BA.length; hA--; )
                z[nA = BA[hA]] && (z[nA] = !(uA[nA] = z[nA]));
            });
          });
        }
        function Mi(N) {
          return N && typeof N.getElementsByTagName < "u" && N;
        }
        g = xe.support = {}, F = xe.isXML = function(N) {
          var G = N && (N.ownerDocument || N).documentElement;
          return G ? G.nodeName !== "HTML" : !1;
        }, SA = xe.setDocument = function(N) {
          var G, z, uA = N ? N.ownerDocument || N : ct;
          return uA === yA || uA.nodeType !== 9 || !uA.documentElement || (yA = uA, ie = yA.documentElement, YA = !F(yA), (z = yA.defaultView) && z.top !== z && (z.addEventListener ? z.addEventListener("unload", Iu, !1) : z.attachEvent && z.attachEvent("onunload", Iu)), g.attributes = iA(function(nA) {
            return nA.className = "i", !nA.getAttribute("className");
          }), g.getElementsByTagName = iA(function(nA) {
            return nA.appendChild(yA.createComment("")), !nA.getElementsByTagName("*").length;
          }), g.getElementsByClassName = vt.test(yA.getElementsByClassName), g.getById = iA(function(nA) {
            return ie.appendChild(nA).id = RA, !yA.getElementsByName || !yA.getElementsByName(RA).length;
          }), g.getById ? (m.find.ID = function(nA, BA) {
            if (typeof BA.getElementById < "u" && YA) {
              var hA = BA.getElementById(nA);
              return hA ? [hA] : [];
            }
          }, m.filter.ID = function(nA) {
            var BA = nA.replace(Nn, Mn);
            return function(hA) {
              return hA.getAttribute("id") === BA;
            };
          }) : (delete m.find.ID, m.filter.ID = function(nA) {
            var BA = nA.replace(Nn, Mn);
            return function(hA) {
              var HA = typeof hA.getAttributeNode < "u" && hA.getAttributeNode("id");
              return HA && HA.value === BA;
            };
          }), m.find.TAG = g.getElementsByTagName ? function(nA, BA) {
            if (typeof BA.getElementsByTagName < "u")
              return BA.getElementsByTagName(nA);
            if (g.qsa)
              return BA.querySelectorAll(nA);
          } : function(nA, BA) {
            var hA, HA = [], GA = 0, re = BA.getElementsByTagName(nA);
            if (nA === "*") {
              for (; hA = re[GA++]; )
                hA.nodeType === 1 && HA.push(hA);
              return HA;
            }
            return re;
          }, m.find.CLASS = g.getElementsByClassName && function(nA, BA) {
            if (typeof BA.getElementsByClassName < "u" && YA)
              return BA.getElementsByClassName(nA);
          }, pt = [], ue = [], (g.qsa = vt.test(yA.querySelectorAll)) && (iA(function(nA) {
            ie.appendChild(nA).innerHTML = "<a id='" + RA + "'></a><select id='" + RA + "-\r\\' msallowcapture=''><option selected=''></option></select>", nA.querySelectorAll("[msallowcapture^='']").length && ue.push("[*^$]=" + De + `*(?:''|"")`), nA.querySelectorAll("[selected]").length || ue.push("\\[" + De + "*(?:value|" + To + ")"), nA.querySelectorAll("[id~=" + RA + "-]").length || ue.push("~="), nA.querySelectorAll(":checked").length || ue.push(":checked"), nA.querySelectorAll("a#" + RA + "+*").length || ue.push(".#.+[+~]");
          }), iA(function(nA) {
            var BA = yA.createElement("input");
            BA.setAttribute("type", "hidden"), nA.appendChild(BA).setAttribute("name", "D"), nA.querySelectorAll("[name=d]").length && ue.push("name" + De + "*[*^$|!~]?="), nA.querySelectorAll(":enabled").length || ue.push(":enabled", ":disabled"), nA.querySelectorAll("*,:x"), ue.push(",.*:");
          })), (g.matchesSelector = vt.test(Je = ie.matches || ie.webkitMatchesSelector || ie.mozMatchesSelector || ie.oMatchesSelector || ie.msMatchesSelector)) && iA(function(nA) {
            g.disconnectedMatch = Je.call(nA, "div"), Je.call(nA, "[s!='']:x"), pt.push("!=", tr);
          }), ue = ue.length && new RegExp(ue.join("|")), pt = pt.length && new RegExp(pt.join("|")), G = vt.test(ie.compareDocumentPosition), Ar = G || vt.test(ie.contains) ? function(nA, BA) {
            var hA = nA.nodeType === 9 ? nA.documentElement : nA, HA = BA && BA.parentNode;
            return nA === HA || !!(HA && HA.nodeType === 1 && (hA.contains ? hA.contains(HA) : nA.compareDocumentPosition && nA.compareDocumentPosition(HA) & 16));
          } : function(nA, BA) {
            if (BA) {
              for (; BA = BA.parentNode; )
                if (BA === nA)
                  return !0;
            }
            return !1;
          }, Tn = G ? function(nA, BA) {
            if (nA === BA)
              return mA = !0, 0;
            var hA = !nA.compareDocumentPosition - !BA.compareDocumentPosition;
            return hA || (hA = (nA.ownerDocument || nA) === (BA.ownerDocument || BA) ? nA.compareDocumentPosition(BA) : (
              // Otherwise we know they are disconnected
              1
            ), hA & 1 || !g.sortDetached && BA.compareDocumentPosition(nA) === hA ? nA === yA || nA.ownerDocument === ct && Ar(ct, nA) ? -1 : BA === yA || BA.ownerDocument === ct && Ar(ct, BA) ? 1 : AA ? Ur(AA, nA) - Ur(AA, BA) : 0 : hA & 4 ? -1 : 1);
          } : function(nA, BA) {
            if (nA === BA)
              return mA = !0, 0;
            var hA, HA = 0, GA = nA.parentNode, re = BA.parentNode, VA = [nA], ZA = [BA];
            if (!GA || !re)
              return nA === yA ? -1 : BA === yA ? 1 : GA ? -1 : re ? 1 : AA ? Ur(AA, nA) - Ur(AA, BA) : 0;
            if (GA === re)
              return ae(nA, BA);
            for (hA = nA; hA = hA.parentNode; )
              VA.unshift(hA);
            for (hA = BA; hA = hA.parentNode; )
              ZA.unshift(hA);
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
        }, xe.matches = function(N, G) {
          return xe(N, null, null, G);
        }, xe.matchesSelector = function(N, G) {
          if ((N.ownerDocument || N) !== yA && SA(N), G = G.replace(nr, "='$1']"), g.matchesSelector && YA && !Ht[G + " "] && (!pt || !pt.test(G)) && (!ue || !ue.test(G)))
            try {
              var z = Je.call(N, G);
              if (z || g.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              N.document && N.document.nodeType !== 11)
                return z;
            } catch {
            }
          return xe(G, yA, null, [N]).length > 0;
        }, xe.contains = function(N, G) {
          return (N.ownerDocument || N) !== yA && SA(N), Ar(N, G);
        }, xe.attr = function(N, G) {
          (N.ownerDocument || N) !== yA && SA(N);
          var z = m.attrHandle[G.toLowerCase()], uA = z && Dn.call(m.attrHandle, G.toLowerCase()) ? z(N, G, !YA) : void 0;
          return uA !== void 0 ? uA : g.attributes || !YA ? N.getAttribute(G) : (uA = N.getAttributeNode(G)) && uA.specified ? uA.value : null;
        }, xe.error = function(N) {
          throw new Error("Syntax error, unrecognized expression: " + N);
        }, xe.uniqueSort = function(N) {
          var G, z = [], uA = 0, nA = 0;
          if (mA = !g.detectDuplicates, AA = !g.sortStable && N.slice(0), N.sort(Tn), mA) {
            for (; G = N[nA++]; )
              G === N[nA] && (uA = z.push(nA));
            for (; uA--; )
              N.splice(z[uA], 1);
          }
          return AA = null, N;
        }, C = xe.getText = function(N) {
          var G, z = "", uA = 0, nA = N.nodeType;
          if (nA) {
            if (nA === 1 || nA === 9 || nA === 11) {
              if (typeof N.textContent == "string")
                return N.textContent;
              for (N = N.firstChild; N; N = N.nextSibling)
                z += C(N);
            } else if (nA === 3 || nA === 4)
              return N.nodeValue;
          } else for (; G = N[uA++]; )
            z += C(G);
          return z;
        }, m = xe.selectors = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: oA,
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
              return N[1] = N[1].replace(Nn, Mn), N[3] = (N[3] || N[4] || N[5] || "").replace(Nn, Mn), N[2] === "~=" && (N[3] = " " + N[3] + " "), N.slice(0, 4);
            },
            CHILD: function(N) {
              return N[1] = N[1].toLowerCase(), N[1].slice(0, 3) === "nth" ? (N[3] || xe.error(N[0]), N[4] = +(N[4] ? N[5] + (N[6] || 1) : 2 * (N[3] === "even" || N[3] === "odd")), N[5] = +(N[7] + N[8] || N[3] === "odd")) : N[3] && xe.error(N[0]), N;
            },
            PSEUDO: function(N) {
              var G, z = !N[6] && N[2];
              return ba.CHILD.test(N[0]) ? null : (N[3] ? N[2] = N[4] || N[5] || "" : z && Ea.test(z) && // Get excess from tokenize (recursively)
              (G = H(z, !0)) && // advance to the next closing parenthesis
              (G = z.indexOf(")", z.length - G) - z.length) && (N[0] = N[0].slice(0, G), N[2] = z.slice(0, G)), N.slice(0, 3));
            }
          },
          filter: {
            TAG: function(N) {
              var G = N.replace(Nn, Mn).toLowerCase();
              return N === "*" ? function() {
                return !0;
              } : function(z) {
                return z.nodeName && z.nodeName.toLowerCase() === G;
              };
            },
            CLASS: function(N) {
              var G = Ln[N + " "];
              return G || (G = new RegExp("(^|" + De + ")" + N + "(" + De + "|$)")) && Ln(N, function(z) {
                return G.test(typeof z.className == "string" && z.className || typeof z.getAttribute < "u" && z.getAttribute("class") || "");
              });
            },
            ATTR: function(N, G, z) {
              return function(uA) {
                var nA = xe.attr(uA, N);
                return nA == null ? G === "!=" : G ? (nA += "", G === "=" ? nA === z : G === "!=" ? nA !== z : G === "^=" ? z && nA.indexOf(z) === 0 : G === "*=" ? z && nA.indexOf(z) > -1 : G === "$=" ? z && nA.slice(-z.length) === z : G === "~=" ? (" " + nA.replace(df, " ") + " ").indexOf(z) > -1 : G === "|=" ? nA === z || nA.slice(0, z.length + 1) === z + "-" : !1) : !0;
              };
            },
            CHILD: function(N, G, z, uA, nA) {
              var BA = N.slice(0, 3) !== "nth", hA = N.slice(-4) !== "last", HA = G === "of-type";
              return uA === 1 && nA === 0 ? (
                // Shortcut for :nth-*(n)
                function(GA) {
                  return !!GA.parentNode;
                }
              ) : function(GA, re, VA) {
                var ZA, fe, Se, qA, Ge, nt, $t = BA !== hA ? "nextSibling" : "previousSibling", We = GA.parentNode, Ki = HA && GA.nodeName.toLowerCase(), rr = !VA && !HA, gt = !1;
                if (We) {
                  if (BA) {
                    for (; $t; ) {
                      for (qA = GA; qA = qA[$t]; )
                        if (HA ? qA.nodeName.toLowerCase() === Ki : qA.nodeType === 1)
                          return !1;
                      nt = $t = N === "only" && !nt && "nextSibling";
                    }
                    return !0;
                  }
                  if (nt = [hA ? We.firstChild : We.lastChild], hA && rr) {
                    for (qA = We, Se = qA[RA] || (qA[RA] = {}), fe = Se[qA.uniqueID] || (Se[qA.uniqueID] = {}), ZA = fe[N] || [], Ge = ZA[0] === le && ZA[1], gt = Ge && ZA[2], qA = Ge && We.childNodes[Ge]; qA = ++Ge && qA && qA[$t] || // Fallback to seeking `elem` from the start
                    (gt = Ge = 0) || nt.pop(); )
                      if (qA.nodeType === 1 && ++gt && qA === GA) {
                        fe[N] = [le, Ge, gt];
                        break;
                      }
                  } else if (rr && (qA = GA, Se = qA[RA] || (qA[RA] = {}), fe = Se[qA.uniqueID] || (Se[qA.uniqueID] = {}), ZA = fe[N] || [], Ge = ZA[0] === le && ZA[1], gt = Ge), gt === !1)
                    for (; (qA = ++Ge && qA && qA[$t] || (gt = Ge = 0) || nt.pop()) && !((HA ? qA.nodeName.toLowerCase() === Ki : qA.nodeType === 1) && ++gt && (rr && (Se = qA[RA] || (qA[RA] = {}), fe = Se[qA.uniqueID] || (Se[qA.uniqueID] = {}), fe[N] = [le, gt]), qA === GA)); )
                      ;
                  return gt -= nA, gt === uA || gt % uA === 0 && gt / uA >= 0;
                }
              };
            },
            PSEUDO: function(N, G) {
              var z, uA = m.pseudos[N] || m.setFilters[N.toLowerCase()] || xe.error("unsupported pseudo: " + N);
              return uA[RA] ? uA(G) : uA.length > 1 ? (z = [N, N, "", G], m.setFilters.hasOwnProperty(N.toLowerCase()) ? oA(function(nA, BA) {
                for (var hA, HA = uA(nA, G), GA = HA.length; GA--; )
                  hA = Ur(nA, HA[GA]), nA[hA] = !(BA[hA] = HA[GA]);
              }) : function(nA) {
                return uA(nA, 0, z);
              }) : uA;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: oA(function(N) {
              var G = [], z = [], uA = M(N.replace(Ua, "$1"));
              return uA[RA] ? oA(function(nA, BA, hA, HA) {
                for (var GA, re = uA(nA, null, HA, []), VA = nA.length; VA--; )
                  (GA = re[VA]) && (nA[VA] = !(BA[VA] = GA));
              }) : function(nA, BA, hA) {
                return G[0] = nA, uA(G, null, hA, z), G[0] = null, !z.pop();
              };
            }),
            has: oA(function(N) {
              return function(G) {
                return xe(N, G).length > 0;
              };
            }),
            contains: oA(function(N) {
              return N = N.replace(Nn, Mn), function(G) {
                return (G.textContent || G.innerText || C(G)).indexOf(N) > -1;
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
              return _u.test(N || "") || xe.error("unsupported lang: " + N), N = N.replace(Nn, Mn).toLowerCase(), function(G) {
                var z;
                do
                  if (z = YA ? G.lang : G.getAttribute("xml:lang") || G.getAttribute("lang"))
                    return z = z.toLowerCase(), z === N || z.indexOf(N + "-") === 0;
                while ((G = G.parentNode) && G.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(N) {
              var G = o.location && o.location.hash;
              return G && G.slice(1) === N.id;
            },
            root: function(N) {
              return N === ie;
            },
            focus: function(N) {
              return N === yA.activeElement && (!yA.hasFocus || yA.hasFocus()) && !!(N.type || N.href || ~N.tabIndex);
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
              return !m.pseudos.empty(N);
            },
            // Element/input types
            header: function(N) {
              return ii.test(N.nodeName);
            },
            input: function(N) {
              return hf.test(N.nodeName);
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
            first: Ee(function() {
              return [0];
            }),
            last: Ee(function(N, G) {
              return [G - 1];
            }),
            eq: Ee(function(N, G, z) {
              return [z < 0 ? z + G : z];
            }),
            even: Ee(function(N, G) {
              for (var z = 0; z < G; z += 2)
                N.push(z);
              return N;
            }),
            odd: Ee(function(N, G) {
              for (var z = 1; z < G; z += 2)
                N.push(z);
              return N;
            }),
            lt: Ee(function(N, G, z) {
              for (var uA = z < 0 ? z + G : z; --uA >= 0; )
                N.push(uA);
              return N;
            }),
            gt: Ee(function(N, G, z) {
              for (var uA = z < 0 ? z + G : z; ++uA < G; )
                N.push(uA);
              return N;
            })
          }
        }, m.pseudos.nth = m.pseudos.eq;
        for (d in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          m.pseudos[d] = Ie(d);
        for (d in { submit: !0, reset: !0 })
          m.pseudos[d] = tt(d);
        function Hu() {
        }
        Hu.prototype = m.filters = m.pseudos, m.setFilters = new Hu(), H = xe.tokenize = function(N, G) {
          var z, uA, nA, BA, hA, HA, GA, re = Fa[N + " "];
          if (re)
            return G ? 0 : re.slice(0);
          for (hA = N, HA = [], GA = m.preFilter; hA; ) {
            (!z || (uA = Do.exec(hA))) && (uA && (hA = hA.slice(uA[0].length) || hA), HA.push(nA = [])), z = !1, (uA = bu.exec(hA)) && (z = uA.shift(), nA.push({
              value: z,
              // Cast descendant combinators to space
              type: uA[0].replace(Ua, " ")
            }), hA = hA.slice(z.length));
            for (BA in m.filter)
              (uA = ba[BA].exec(hA)) && (!GA[BA] || (uA = GA[BA](uA))) && (z = uA.shift(), nA.push({
                value: z,
                type: BA,
                matches: uA
              }), hA = hA.slice(z.length));
            if (!z)
              break;
          }
          return G ? hA.length : hA ? xe.error(N) : (
            // Cache the tokens
            Fa(N, HA).slice(0)
          );
        };
        function yt(N) {
          for (var G = 0, z = N.length, uA = ""; G < z; G++)
            uA += N[G].value;
          return uA;
        }
        function ai(N, G, z) {
          var uA = G.dir, nA = z && uA === "parentNode", BA = qe++;
          return G.first ? (
            // Check against closest ancestor/preceding element
            function(hA, HA, GA) {
              for (; hA = hA[uA]; )
                if (hA.nodeType === 1 || nA)
                  return N(hA, HA, GA);
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(hA, HA, GA) {
              var re, VA, ZA, fe = [le, BA];
              if (GA) {
                for (; hA = hA[uA]; )
                  if ((hA.nodeType === 1 || nA) && N(hA, HA, GA))
                    return !0;
              } else
                for (; hA = hA[uA]; )
                  if (hA.nodeType === 1 || nA) {
                    if (ZA = hA[RA] || (hA[RA] = {}), VA = ZA[hA.uniqueID] || (ZA[hA.uniqueID] = {}), (re = VA[uA]) && re[0] === le && re[1] === BA)
                      return fe[2] = re[2];
                    if (VA[uA] = fe, fe[2] = N(hA, HA, GA))
                      return !0;
                  }
            }
          );
        }
        function No(N) {
          return N.length > 1 ? function(G, z, uA) {
            for (var nA = N.length; nA--; )
              if (!N[nA](G, z, uA))
                return !1;
            return !0;
          } : N[0];
        }
        function oi(N, G, z) {
          for (var uA = 0, nA = G.length; uA < nA; uA++)
            xe(N, G[uA], z);
          return z;
        }
        function br(N, G, z, uA, nA) {
          for (var BA, hA = [], HA = 0, GA = N.length, re = G != null; HA < GA; HA++)
            (BA = N[HA]) && (!z || z(BA, uA, nA)) && (hA.push(BA), re && G.push(HA));
          return hA;
        }
        function si(N, G, z, uA, nA, BA) {
          return uA && !uA[RA] && (uA = si(uA)), nA && !nA[RA] && (nA = si(nA, BA)), oA(function(hA, HA, GA, re) {
            var VA, ZA, fe, Se = [], qA = [], Ge = HA.length, nt = hA || oi(G || "*", GA.nodeType ? [GA] : GA, []), $t = N && (hA || !G) ? br(nt, Se, N, GA, re) : nt, We = z ? (
              // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
              nA || (hA ? N : Ge || uA) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                HA
              )
            ) : $t;
            if (z && z($t, We, GA, re), uA)
              for (VA = br(We, qA), uA(VA, [], GA, re), ZA = VA.length; ZA--; )
                (fe = VA[ZA]) && (We[qA[ZA]] = !($t[qA[ZA]] = fe));
            if (hA) {
              if (nA || N) {
                if (nA) {
                  for (VA = [], ZA = We.length; ZA--; )
                    (fe = We[ZA]) && VA.push($t[ZA] = fe);
                  nA(null, We = [], VA, re);
                }
                for (ZA = We.length; ZA--; )
                  (fe = We[ZA]) && (VA = nA ? Ur(hA, fe) : Se[ZA]) > -1 && (hA[VA] = !(HA[VA] = fe));
              }
            } else
              We = br(
                We === HA ? We.splice(Ge, We.length) : We
              ), nA ? nA(null, HA, We, re) : On.apply(HA, We);
          });
        }
        function He(N) {
          for (var G, z, uA, nA = N.length, BA = m.relative[N[0].type], hA = BA || m.relative[" "], HA = BA ? 1 : 0, GA = ai(function(ZA) {
            return ZA === G;
          }, hA, !0), re = ai(function(ZA) {
            return Ur(G, ZA) > -1;
          }, hA, !0), VA = [function(ZA, fe, Se) {
            var qA = !BA && (Se || fe !== q) || ((G = fe).nodeType ? GA(ZA, fe, Se) : re(ZA, fe, Se));
            return G = null, qA;
          }]; HA < nA; HA++)
            if (z = m.relative[N[HA].type])
              VA = [ai(No(VA), z)];
            else {
              if (z = m.filter[N[HA].type].apply(null, N[HA].matches), z[RA]) {
                for (uA = ++HA; uA < nA && !m.relative[N[uA].type]; uA++)
                  ;
                return si(
                  HA > 1 && No(VA),
                  HA > 1 && yt(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    N.slice(0, HA - 1).concat({ value: N[HA - 2].type === " " ? "*" : "" })
                  ).replace(Ua, "$1"),
                  z,
                  HA < uA && He(N.slice(HA, uA)),
                  uA < nA && He(N = N.slice(uA)),
                  uA < nA && yt(N)
                );
              }
              VA.push(z);
            }
          return No(VA);
        }
        function gf(N, G) {
          var z = G.length > 0, uA = N.length > 0, nA = function(BA, hA, HA, GA, re) {
            var VA, ZA, fe, Se = 0, qA = "0", Ge = BA && [], nt = [], $t = q, We = BA || uA && m.find.TAG("*", re), Ki = le += $t == null ? 1 : Math.random() || 0.1, rr = We.length;
            for (re && (q = hA === yA || hA || re); qA !== rr && (VA = We[qA]) != null; qA++) {
              if (uA && VA) {
                for (ZA = 0, !hA && VA.ownerDocument !== yA && (SA(VA), HA = !YA); fe = N[ZA++]; )
                  if (fe(VA, hA || yA, HA)) {
                    GA.push(VA);
                    break;
                  }
                re && (le = Ki);
              }
              z && ((VA = !fe && VA) && Se--, BA && Ge.push(VA));
            }
            if (Se += qA, z && qA !== Se) {
              for (ZA = 0; fe = G[ZA++]; )
                fe(Ge, nt, hA, HA);
              if (BA) {
                if (Se > 0)
                  for (; qA--; )
                    Ge[qA] || nt[qA] || (nt[qA] = St.call(GA));
                nt = br(nt);
              }
              On.apply(GA, nt), re && !BA && nt.length > 0 && Se + G.length > 1 && xe.uniqueSort(GA);
            }
            return re && (le = Ki, q = $t), Ge;
          };
          return z ? oA(nA) : nA;
        }
        return M = xe.compile = function(N, G) {
          var z, uA = [], nA = [], BA = Ht[N + " "];
          if (!BA) {
            for (G || (G = H(N)), z = G.length; z--; )
              BA = He(G[z]), BA[RA] ? uA.push(BA) : nA.push(BA);
            BA = Ht(N, gf(nA, uA)), BA.selector = N;
          }
          return BA;
        }, W = xe.select = function(N, G, z, uA) {
          var nA, BA, hA, HA, GA, re = typeof N == "function" && N, VA = !uA && H(N = re.selector || N);
          if (z = z || [], VA.length === 1) {
            if (BA = VA[0] = VA[0].slice(0), BA.length > 2 && (hA = BA[0]).type === "ID" && g.getById && G.nodeType === 9 && YA && m.relative[BA[1].type]) {
              if (G = (m.find.ID(hA.matches[0].replace(Nn, Mn), G) || [])[0], G)
                re && (G = G.parentNode);
              else return z;
              N = N.slice(BA.shift().value.length);
            }
            for (nA = ba.needsContext.test(N) ? 0 : BA.length; nA-- && (hA = BA[nA], !m.relative[HA = hA.type]); )
              if ((GA = m.find[HA]) && (uA = GA(
                hA.matches[0].replace(Nn, Mn),
                Oo.test(BA[0].type) && Mi(G.parentNode) || G
              ))) {
                if (BA.splice(nA, 1), N = uA.length && yt(BA), !N)
                  return On.apply(z, uA), z;
                break;
              }
          }
          return (re || M(N, VA))(
            uA,
            G,
            !YA,
            z,
            !G || Oo.test(N) && Mi(G.parentNode) || G
          ), z;
        }, g.sortStable = RA.split("").sort(Tn).join("") === RA, g.detectDuplicates = !!mA, SA(), g.sortDetached = iA(function(N) {
          return N.compareDocumentPosition(yA.createElement("div")) & 1;
        }), iA(function(N) {
          return N.innerHTML = "<a href='#'></a>", N.firstChild.getAttribute("href") === "#";
        }) || OA("type|href|height|width", function(N, G, z) {
          if (!z)
            return N.getAttribute(G, G.toLowerCase() === "type" ? 1 : 2);
        }), (!g.attributes || !iA(function(N) {
          return N.innerHTML = "<input/>", N.firstChild.setAttribute("value", ""), N.firstChild.getAttribute("value") === "";
        })) && OA("value", function(N, G, z) {
          if (!z && N.nodeName.toLowerCase() === "input")
            return N.defaultValue;
        }), iA(function(N) {
          return N.getAttribute("disabled") == null;
        }) || OA(To, function(N, G, z) {
          var uA;
          if (!z)
            return N[G] === !0 ? G.toLowerCase() : (uA = N.getAttributeNode(G)) && uA.specified ? uA.value : null;
        }), xe;
      }(e)
    );
    u.find = x, u.expr = x.selectors, u.expr[":"] = u.expr.pseudos, u.uniqueSort = u.unique = x.uniqueSort, u.text = x.getText, u.isXMLDoc = x.isXML, u.contains = x.contains;
    var K = function(o, d, g) {
      for (var m = [], C = g !== void 0; (o = o[d]) && o.nodeType !== 9; )
        if (o.nodeType === 1) {
          if (C && u(o).is(g))
            break;
          m.push(o);
        }
      return m;
    }, k = function(o, d) {
      for (var g = []; o; o = o.nextSibling)
        o.nodeType === 1 && o !== d && g.push(o);
      return g;
    }, Y = u.expr.match.needsContext, dA = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, cA = /^.[^:#\[\.,]*$/;
    function wA(o, d, g) {
      if (u.isFunction(d))
        return u.grep(o, function(m, C) {
          return !!d.call(m, C, m) !== g;
        });
      if (d.nodeType)
        return u.grep(o, function(m) {
          return m === d !== g;
        });
      if (typeof d == "string") {
        if (cA.test(d))
          return u.filter(d, o, g);
        d = u.filter(d, o);
      }
      return u.grep(o, function(m) {
        return u.inArray(m, d) > -1 !== g;
      });
    }
    u.filter = function(o, d, g) {
      var m = d[0];
      return g && (o = ":not(" + o + ")"), d.length === 1 && m.nodeType === 1 ? u.find.matchesSelector(m, o) ? [m] : [] : u.find.matches(o, u.grep(d, function(C) {
        return C.nodeType === 1;
      }));
    }, u.fn.extend({
      find: function(o) {
        var d, g = [], m = this, C = m.length;
        if (typeof o != "string")
          return this.pushStack(u(o).filter(function() {
            for (d = 0; d < C; d++)
              if (u.contains(m[d], this))
                return !0;
          }));
        for (d = 0; d < C; d++)
          u.find(o, m[d], g);
        return g = this.pushStack(C > 1 ? u.unique(g) : g), g.selector = this.selector ? this.selector + " " + o : o, g;
      },
      filter: function(o) {
        return this.pushStack(wA(this, o || [], !1));
      },
      not: function(o) {
        return this.pushStack(wA(this, o || [], !0));
      },
      is: function(o) {
        return !!wA(
          this,
          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof o == "string" && Y.test(o) ? u(o) : o || [],
          !1
        ).length;
      }
    });
    var EA, NA = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, xA = u.fn.init = function(o, d, g) {
      var m, C;
      if (!o)
        return this;
      if (g = g || EA, typeof o == "string")
        if (o.charAt(0) === "<" && o.charAt(o.length - 1) === ">" && o.length >= 3 ? m = [null, o, null] : m = NA.exec(o), m && (m[1] || !d))
          if (m[1]) {
            if (d = d instanceof u ? d[0] : d, u.merge(this, u.parseHTML(
              m[1],
              d && d.nodeType ? d.ownerDocument || d : i,
              !0
            )), dA.test(m[1]) && u.isPlainObject(d))
              for (m in d)
                u.isFunction(this[m]) ? this[m](d[m]) : this.attr(m, d[m]);
            return this;
          } else {
            if (C = i.getElementById(m[2]), C && C.parentNode) {
              if (C.id !== m[2])
                return EA.find(o);
              this.length = 1, this[0] = C;
            }
            return this.context = i, this.selector = o, this;
          }
        else return !d || d.jquery ? (d || g).find(o) : this.constructor(d).find(o);
      else {
        if (o.nodeType)
          return this.context = this[0] = o, this.length = 1, this;
        if (u.isFunction(o))
          return typeof g.ready < "u" ? g.ready(o) : (
            // Execute immediately if ready is not present
            o(u)
          );
      }
      return o.selector !== void 0 && (this.selector = o.selector, this.context = o.context), u.makeArray(o, this);
    };
    xA.prototype = u.fn, EA = u(i);
    var X = /^(?:parents|prev(?:Until|All))/, CA = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
    u.fn.extend({
      has: function(o) {
        var d, g = u(o, this), m = g.length;
        return this.filter(function() {
          for (d = 0; d < m; d++)
            if (u.contains(this, g[d]))
              return !0;
        });
      },
      closest: function(o, d) {
        for (var g, m = 0, C = this.length, F = [], H = Y.test(o) || typeof o != "string" ? u(o, d || this.context) : 0; m < C; m++)
          for (g = this[m]; g && g !== d; g = g.parentNode)
            if (g.nodeType < 11 && (H ? H.index(g) > -1 : (
              // Don't pass non-elements to Sizzle
              g.nodeType === 1 && u.find.matchesSelector(g, o)
            ))) {
              F.push(g);
              break;
            }
        return this.pushStack(F.length > 1 ? u.uniqueSort(F) : F);
      },
      // Determine the position of an element within
      // the matched set of elements
      index: function(o) {
        return o ? typeof o == "string" ? u.inArray(this[0], u(o)) : u.inArray(
          // If it receives a jQuery object, the first element is used
          o.jquery ? o[0] : o,
          this
        ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      },
      add: function(o, d) {
        return this.pushStack(
          u.uniqueSort(
            u.merge(this.get(), u(o, d))
          )
        );
      },
      addBack: function(o) {
        return this.add(
          o == null ? this.prevObject : this.prevObject.filter(o)
        );
      }
    });
    function tA(o, d) {
      do
        o = o[d];
      while (o && o.nodeType !== 1);
      return o;
    }
    u.each({
      parent: function(o) {
        var d = o.parentNode;
        return d && d.nodeType !== 11 ? d : null;
      },
      parents: function(o) {
        return K(o, "parentNode");
      },
      parentsUntil: function(o, d, g) {
        return K(o, "parentNode", g);
      },
      next: function(o) {
        return tA(o, "nextSibling");
      },
      prev: function(o) {
        return tA(o, "previousSibling");
      },
      nextAll: function(o) {
        return K(o, "nextSibling");
      },
      prevAll: function(o) {
        return K(o, "previousSibling");
      },
      nextUntil: function(o, d, g) {
        return K(o, "nextSibling", g);
      },
      prevUntil: function(o, d, g) {
        return K(o, "previousSibling", g);
      },
      siblings: function(o) {
        return k((o.parentNode || {}).firstChild, o);
      },
      children: function(o) {
        return k(o.firstChild);
      },
      contents: function(o) {
        return u.nodeName(o, "iframe") ? o.contentDocument || o.contentWindow.document : u.merge([], o.childNodes);
      }
    }, function(o, d) {
      u.fn[o] = function(g, m) {
        var C = u.map(this, d, g);
        return o.slice(-5) !== "Until" && (m = g), m && typeof m == "string" && (C = u.filter(m, C)), this.length > 1 && (CA[o] || (C = u.uniqueSort(C)), X.test(o) && (C = C.reverse())), this.pushStack(C);
      };
    });
    var fA = /\S+/g;
    function _A(o) {
      var d = {};
      return u.each(o.match(fA) || [], function(g, m) {
        d[m] = !0;
      }), d;
    }
    u.Callbacks = function(o) {
      o = typeof o == "string" ? _A(o) : u.extend({}, o);
      var d, g, m, C, F = [], H = [], M = -1, W = function() {
        for (C = o.once, m = d = !0; H.length; M = -1)
          for (g = H.shift(); ++M < F.length; )
            F[M].apply(g[0], g[1]) === !1 && o.stopOnFalse && (M = F.length, g = !1);
        o.memory || (g = !1), d = !1, C && (g ? F = [] : F = "");
      }, q = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          return F && (g && !d && (M = F.length - 1, H.push(g)), function AA(mA) {
            u.each(mA, function(SA, yA) {
              u.isFunction(yA) ? (!o.unique || !q.has(yA)) && F.push(yA) : yA && yA.length && u.type(yA) !== "string" && AA(yA);
            });
          }(arguments), g && !d && W()), this;
        },
        // Remove a callback from the list
        remove: function() {
          return u.each(arguments, function(AA, mA) {
            for (var SA; (SA = u.inArray(mA, F, SA)) > -1; )
              F.splice(SA, 1), SA <= M && M--;
          }), this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(AA) {
          return AA ? u.inArray(AA, F) > -1 : F.length > 0;
        },
        // Remove all callbacks from the list
        empty: function() {
          return F && (F = []), this;
        },
        // Disable .fire and .add
        // Abort any current/pending executions
        // Clear all callbacks and values
        disable: function() {
          return C = H = [], F = g = "", this;
        },
        disabled: function() {
          return !F;
        },
        // Disable .fire
        // Also disable .add unless we have memory (since it would have no effect)
        // Abort any pending executions
        lock: function() {
          return C = !0, g || q.disable(), this;
        },
        locked: function() {
          return !!C;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function(AA, mA) {
          return C || (mA = mA || [], mA = [AA, mA.slice ? mA.slice() : mA], H.push(mA), d || W()), this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          return q.fireWith(this, arguments), this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!m;
        }
      };
      return q;
    }, u.extend({
      Deferred: function(o) {
        var d = [
          // action, add listener, listener list, final state
          ["resolve", "done", u.Callbacks("once memory"), "resolved"],
          ["reject", "fail", u.Callbacks("once memory"), "rejected"],
          ["notify", "progress", u.Callbacks("memory")]
        ], g = "pending", m = {
          state: function() {
            return g;
          },
          always: function() {
            return C.done(arguments).fail(arguments), this;
          },
          then: function() {
            var F = arguments;
            return u.Deferred(function(H) {
              u.each(d, function(M, W) {
                var q = u.isFunction(F[M]) && F[M];
                C[W[1]](function() {
                  var AA = q && q.apply(this, arguments);
                  AA && u.isFunction(AA.promise) ? AA.promise().progress(H.notify).done(H.resolve).fail(H.reject) : H[W[0] + "With"](
                    this === m ? H.promise() : this,
                    q ? [AA] : arguments
                  );
                });
              }), F = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function(F) {
            return F != null ? u.extend(F, m) : m;
          }
        }, C = {};
        return m.pipe = m.then, u.each(d, function(F, H) {
          var M = H[2], W = H[3];
          m[H[1]] = M.add, W && M.add(function() {
            g = W;
          }, d[F ^ 1][2].disable, d[2][2].lock), C[H[0]] = function() {
            return C[H[0] + "With"](this === C ? m : this, arguments), this;
          }, C[H[0] + "With"] = M.fireWith;
        }), m.promise(C), o && o.call(C, C), C;
      },
      // Deferred helper
      when: function(o) {
        var d = 0, g = s.call(arguments), m = g.length, C = m !== 1 || o && u.isFunction(o.promise) ? m : 0, F = C === 1 ? o : u.Deferred(), H = function(AA, mA, SA) {
          return function(yA) {
            mA[AA] = this, SA[AA] = arguments.length > 1 ? s.call(arguments) : yA, SA === M ? F.notifyWith(mA, SA) : --C || F.resolveWith(mA, SA);
          };
        }, M, W, q;
        if (m > 1)
          for (M = new Array(m), W = new Array(m), q = new Array(m); d < m; d++)
            g[d] && u.isFunction(g[d].promise) ? g[d].promise().progress(H(d, W, M)).done(H(d, q, g)).fail(F.reject) : --C;
        return C || F.resolveWith(q, g), F.promise();
      }
    });
    var IA;
    u.fn.ready = function(o) {
      return u.ready.promise().done(o), this;
    }, u.extend({
      // Is the DOM ready to be used? Set to true once it occurs.
      isReady: !1,
      // A counter to track how many items to wait for before
      // the ready event fires. See #6781
      readyWait: 1,
      // Hold (or release) the ready event
      holdReady: function(o) {
        o ? u.readyWait++ : u.ready(!0);
      },
      // Handle when the DOM is ready
      ready: function(o) {
        (o === !0 ? --u.readyWait : u.isReady) || (u.isReady = !0, !(o !== !0 && --u.readyWait > 0) && (IA.resolveWith(i, [u]), u.fn.triggerHandler && (u(i).triggerHandler("ready"), u(i).off("ready"))));
      }
    });
    function aA() {
      i.addEventListener ? (i.removeEventListener("DOMContentLoaded", T), e.removeEventListener("load", T)) : (i.detachEvent("onreadystatechange", T), e.detachEvent("onload", T));
    }
    function T() {
      (i.addEventListener || e.event.type === "load" || i.readyState === "complete") && (aA(), u.ready());
    }
    u.ready.promise = function(o) {
      if (!IA)
        if (IA = u.Deferred(), i.readyState === "complete" || i.readyState !== "loading" && !i.documentElement.doScroll)
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
          d && d.doScroll && function g() {
            if (!u.isReady) {
              try {
                d.doScroll("left");
              } catch {
                return e.setTimeout(g, 50);
              }
              aA(), u.ready();
            }
          }();
        }
      return IA.promise(o);
    }, u.ready.promise();
    var eA;
    for (eA in u(v))
      break;
    v.ownFirst = eA === "0", v.inlineBlockNeedsLayout = !1, u(function() {
      var o, d, g, m;
      g = i.getElementsByTagName("body")[0], !(!g || !g.style) && (d = i.createElement("div"), m = i.createElement("div"), m.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", g.appendChild(m).appendChild(d), typeof d.style.zoom < "u" && (d.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", v.inlineBlockNeedsLayout = o = d.offsetWidth === 3, o && (g.style.zoom = 1)), g.removeChild(m));
    }), function() {
      var o = i.createElement("div");
      v.deleteExpando = !0;
      try {
        delete o.test;
      } catch {
        v.deleteExpando = !1;
      }
      o = null;
    }();
    var J = function(o) {
      var d = u.noData[(o.nodeName + " ").toLowerCase()], g = +o.nodeType || 1;
      return g !== 1 && g !== 9 ? !1 : (
        // Nodes accept data unless otherwise specified; rejection can be conditional
        !d || d !== !0 && o.getAttribute("classid") === d
      );
    }, L = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, $ = /([A-Z])/g;
    function rA(o, d, g) {
      if (g === void 0 && o.nodeType === 1) {
        var m = "data-" + d.replace($, "-$1").toLowerCase();
        if (g = o.getAttribute(m), typeof g == "string") {
          try {
            g = g === "true" ? !0 : g === "false" ? !1 : g === "null" ? null : (
              // Only convert to a number if it doesn't change the string
              +g + "" === g ? +g : L.test(g) ? u.parseJSON(g) : g
            );
          } catch {
          }
          u.data(o, d, g);
        } else
          g = void 0;
      }
      return g;
    }
    function FA(o) {
      var d;
      for (d in o)
        if (!(d === "data" && u.isEmptyObject(o[d])) && d !== "toJSON")
          return !1;
      return !0;
    }
    function UA(o, d, g, m) {
      if (J(o)) {
        var C, F, H = u.expando, M = o.nodeType, W = M ? u.cache : o, q = M ? o[H] : o[H] && H;
        if (!((!q || !W[q] || !m && !W[q].data) && g === void 0 && typeof d == "string"))
          return q || (M ? q = o[H] = n.pop() || u.guid++ : q = H), W[q] || (W[q] = M ? {} : { toJSON: u.noop }), (typeof d == "object" || typeof d == "function") && (m ? W[q] = u.extend(W[q], d) : W[q].data = u.extend(W[q].data, d)), F = W[q], m || (F.data || (F.data = {}), F = F.data), g !== void 0 && (F[u.camelCase(d)] = g), typeof d == "string" ? (C = F[d], C == null && (C = F[u.camelCase(d)])) : C = F, C;
      }
    }
    function zA(o, d, g) {
      if (J(o)) {
        var m, C, F = o.nodeType, H = F ? u.cache : o, M = F ? o[u.expando] : u.expando;
        if (H[M]) {
          if (d && (m = g ? H[M] : H[M].data, m)) {
            for (u.isArray(d) ? d = d.concat(u.map(d, u.camelCase)) : (d in m) ? d = [d] : (d = u.camelCase(d), d in m ? d = [d] : d = d.split(" ")), C = d.length; C--; )
              delete m[d[C]];
            if (g ? !FA(m) : !u.isEmptyObject(m))
              return;
          }
          !g && (delete H[M].data, !FA(H[M])) || (F ? u.cleanData([o], !0) : v.deleteExpando || H != H.window ? delete H[M] : H[M] = void 0);
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
      hasData: function(o) {
        return o = o.nodeType ? u.cache[o[u.expando]] : o[u.expando], !!o && !FA(o);
      },
      data: function(o, d, g) {
        return UA(o, d, g);
      },
      removeData: function(o, d) {
        return zA(o, d);
      },
      // For internal use only.
      _data: function(o, d, g) {
        return UA(o, d, g, !0);
      },
      _removeData: function(o, d) {
        return zA(o, d, !0);
      }
    }), u.fn.extend({
      data: function(o, d) {
        var g, m, C, F = this[0], H = F && F.attributes;
        if (o === void 0) {
          if (this.length && (C = u.data(F), F.nodeType === 1 && !u._data(F, "parsedAttrs"))) {
            for (g = H.length; g--; )
              H[g] && (m = H[g].name, m.indexOf("data-") === 0 && (m = u.camelCase(m.slice(5)), rA(F, m, C[m])));
            u._data(F, "parsedAttrs", !0);
          }
          return C;
        }
        return typeof o == "object" ? this.each(function() {
          u.data(this, o);
        }) : arguments.length > 1 ? (
          // Sets one value
          this.each(function() {
            u.data(this, o, d);
          })
        ) : (
          // Gets one value
          // Try to fetch any internally stored data first
          F ? rA(F, o, u.data(F, o)) : void 0
        );
      },
      removeData: function(o) {
        return this.each(function() {
          u.removeData(this, o);
        });
      }
    }), u.extend({
      queue: function(o, d, g) {
        var m;
        if (o)
          return d = (d || "fx") + "queue", m = u._data(o, d), g && (!m || u.isArray(g) ? m = u._data(o, d, u.makeArray(g)) : m.push(g)), m || [];
      },
      dequeue: function(o, d) {
        d = d || "fx";
        var g = u.queue(o, d), m = g.length, C = g.shift(), F = u._queueHooks(o, d), H = function() {
          u.dequeue(o, d);
        };
        C === "inprogress" && (C = g.shift(), m--), C && (d === "fx" && g.unshift("inprogress"), delete F.stop, C.call(o, H, F)), !m && F && F.empty.fire();
      },
      // not intended for public consumption - generates a queueHooks object,
      // or returns the current one
      _queueHooks: function(o, d) {
        var g = d + "queueHooks";
        return u._data(o, g) || u._data(o, g, {
          empty: u.Callbacks("once memory").add(function() {
            u._removeData(o, d + "queue"), u._removeData(o, g);
          })
        });
      }
    }), u.fn.extend({
      queue: function(o, d) {
        var g = 2;
        return typeof o != "string" && (d = o, o = "fx", g--), arguments.length < g ? u.queue(this[0], o) : d === void 0 ? this : this.each(function() {
          var m = u.queue(this, o, d);
          u._queueHooks(this, o), o === "fx" && m[0] !== "inprogress" && u.dequeue(this, o);
        });
      },
      dequeue: function(o) {
        return this.each(function() {
          u.dequeue(this, o);
        });
      },
      clearQueue: function(o) {
        return this.queue(o || "fx", []);
      },
      // Get a promise resolved when queues of a certain type
      // are emptied (fx is the type by default)
      promise: function(o, d) {
        var g, m = 1, C = u.Deferred(), F = this, H = this.length, M = function() {
          --m || C.resolveWith(F, [F]);
        };
        for (typeof o != "string" && (d = o, o = void 0), o = o || "fx"; H--; )
          g = u._data(F[H], o + "queueHooks"), g && g.empty && (m++, g.empty.add(M));
        return M(), C.promise(d);
      }
    }), function() {
      var o;
      v.shrinkWrapBlocks = function() {
        if (o != null)
          return o;
        o = !1;
        var d, g, m;
        if (g = i.getElementsByTagName("body")[0], !(!g || !g.style))
          return d = i.createElement("div"), m = i.createElement("div"), m.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", g.appendChild(m).appendChild(d), typeof d.style.zoom < "u" && (d.style.cssText = // Support: Firefox<29, Android 2.3
          // Vendor-prefix box-sizing
          "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", d.appendChild(i.createElement("div")).style.width = "5px", o = d.offsetWidth !== 3), g.removeChild(m), o;
      };
    }();
    var ne = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, JA = new RegExp("^(?:([+-])=|)(" + ne + ")([a-z%]*)$", "i"), $A = ["Top", "Right", "Bottom", "Left"], sA = function(o, d) {
      return o = d || o, u.css(o, "display") === "none" || !u.contains(o.ownerDocument, o);
    };
    function vA(o, d, g, m) {
      var C, F = 1, H = 20, M = m ? function() {
        return m.cur();
      } : function() {
        return u.css(o, d, "");
      }, W = M(), q = g && g[3] || (u.cssNumber[d] ? "" : "px"), AA = (u.cssNumber[d] || q !== "px" && +W) && JA.exec(u.css(o, d));
      if (AA && AA[3] !== q) {
        q = q || AA[3], g = g || [], AA = +W || 1;
        do
          F = F || ".5", AA = AA / F, u.style(o, d, AA + q);
        while (F !== (F = M() / W) && F !== 1 && --H);
      }
      return g && (AA = +AA || +W || 0, C = g[1] ? AA + (g[1] + 1) * g[2] : +g[2], m && (m.unit = q, m.start = AA, m.end = C)), C;
    }
    var bA = function(o, d, g, m, C, F, H) {
      var M = 0, W = o.length, q = g == null;
      if (u.type(g) === "object") {
        C = !0;
        for (M in g)
          bA(o, d, M, g[M], !0, F, H);
      } else if (m !== void 0 && (C = !0, u.isFunction(m) || (H = !0), q && (H ? (d.call(o, m), d = null) : (q = d, d = function(AA, mA, SA) {
        return q.call(u(AA), SA);
      })), d))
        for (; M < W; M++)
          d(
            o[M],
            g,
            H ? m : m.call(o[M], M, d(o[M], g))
          );
      return C ? o : (
        // Gets
        q ? d.call(o) : W ? d(o[0], g) : F
      );
    }, te = /^(?:checkbox|radio)$/i, me = /<([\w:-]+)/, Ue = /^$|\/(?:java|ecma)script/i, Ze = /^\s+/, Te = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function ke(o) {
      var d = Te.split("|"), g = o.createDocumentFragment();
      if (g.createElement)
        for (; d.length; )
          g.createElement(
            d.pop()
          );
      return g;
    }
    (function() {
      var o = i.createElement("div"), d = i.createDocumentFragment(), g = i.createElement("input");
      o.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", v.leadingWhitespace = o.firstChild.nodeType === 3, v.tbody = !o.getElementsByTagName("tbody").length, v.htmlSerialize = !!o.getElementsByTagName("link").length, v.html5Clone = i.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", g.type = "checkbox", g.checked = !0, d.appendChild(g), v.appendChecked = g.checked, o.innerHTML = "<textarea>x</textarea>", v.noCloneChecked = !!o.cloneNode(!0).lastChild.defaultValue, d.appendChild(o), g = i.createElement("input"), g.setAttribute("type", "radio"), g.setAttribute("checked", "checked"), g.setAttribute("name", "t"), o.appendChild(g), v.checkClone = o.cloneNode(!0).cloneNode(!0).lastChild.checked, v.noCloneEvent = !!o.addEventListener, o[u.expando] = 1, v.attributes = !o.getAttribute(u.expando);
    })();
    var Ke = {
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
      _default: v.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Ke.optgroup = Ke.option, Ke.tbody = Ke.tfoot = Ke.colgroup = Ke.caption = Ke.thead, Ke.th = Ke.td;
    function _e(o, d) {
      var g, m, C = 0, F = typeof o.getElementsByTagName < "u" ? o.getElementsByTagName(d || "*") : typeof o.querySelectorAll < "u" ? o.querySelectorAll(d || "*") : void 0;
      if (!F)
        for (F = [], g = o.childNodes || o; (m = g[C]) != null; C++)
          !d || u.nodeName(m, d) ? F.push(m) : u.merge(F, _e(m, d));
      return d === void 0 || d && u.nodeName(o, d) ? u.merge([o], F) : F;
    }
    function Mt(o, d) {
      for (var g, m = 0; (g = o[m]) != null; m++)
        u._data(
          g,
          "globalEval",
          !d || u._data(d[m], "globalEval")
        );
    }
    var bt = /<|&#?\w+;/, Kt = /<tbody/i;
    function _t(o) {
      te.test(o.type) && (o.defaultChecked = o.checked);
    }
    function mt(o, d, g, m, C) {
      for (var F, H, M, W, q, AA, mA, SA = o.length, yA = ke(d), ie = [], YA = 0; YA < SA; YA++)
        if (H = o[YA], H || H === 0)
          if (u.type(H) === "object")
            u.merge(ie, H.nodeType ? [H] : H);
          else if (!bt.test(H))
            ie.push(d.createTextNode(H));
          else {
            for (W = W || yA.appendChild(d.createElement("div")), q = (me.exec(H) || ["", ""])[1].toLowerCase(), mA = Ke[q] || Ke._default, W.innerHTML = mA[1] + u.htmlPrefilter(H) + mA[2], F = mA[0]; F--; )
              W = W.lastChild;
            if (!v.leadingWhitespace && Ze.test(H) && ie.push(d.createTextNode(Ze.exec(H)[0])), !v.tbody)
              for (H = q === "table" && !Kt.test(H) ? W.firstChild : (
                // String was a bare <thead> or <tfoot>
                mA[1] === "<table>" && !Kt.test(H) ? W : 0
              ), F = H && H.childNodes.length; F--; )
                u.nodeName(AA = H.childNodes[F], "tbody") && !AA.childNodes.length && H.removeChild(AA);
            for (u.merge(ie, W.childNodes), W.textContent = ""; W.firstChild; )
              W.removeChild(W.firstChild);
            W = yA.lastChild;
          }
      for (W && yA.removeChild(W), v.appendChecked || u.grep(_e(ie, "input"), _t), YA = 0; H = ie[YA++]; ) {
        if (m && u.inArray(H, m) > -1) {
          C && C.push(H);
          continue;
        }
        if (M = u.contains(H.ownerDocument, H), W = _e(yA.appendChild(H), "script"), M && Mt(W), g)
          for (F = 0; H = W[F++]; )
            Ue.test(H.type || "") && g.push(H);
      }
      return W = null, yA;
    }
    (function() {
      var o, d, g = i.createElement("div");
      for (o in { submit: !0, change: !0, focusin: !0 })
        d = "on" + o, (v[o] = d in e) || (g.setAttribute(d, "t"), v[o] = g.attributes[d].expando === !1);
      g = null;
    })();
    var dn = /^(?:input|select|textarea)$/i, vr = /^key/, xi = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, zr = /^(?:focusinfocus|focusoutblur)$/, Jr = /^([^.]*)(?:\.(.+)|)/;
    function lA() {
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
    function ve(o, d, g, m, C, F) {
      var H, M;
      if (typeof d == "object") {
        typeof g != "string" && (m = m || g, g = void 0);
        for (M in d)
          ve(o, M, g, m, d[M], F);
        return o;
      }
      if (m == null && C == null ? (C = g, m = g = void 0) : C == null && (typeof g == "string" ? (C = m, m = void 0) : (C = m, m = g, g = void 0)), C === !1)
        C = DA;
      else if (!C)
        return o;
      return F === 1 && (H = C, C = function(W) {
        return u().off(W), H.apply(this, arguments);
      }, C.guid = H.guid || (H.guid = u.guid++)), o.each(function() {
        u.event.add(this, d, C, m, g);
      });
    }
    u.event = {
      global: {},
      add: function(o, d, g, m, C) {
        var F, H, M, W, q, AA, mA, SA, yA, ie, YA, ue = u._data(o);
        if (ue) {
          for (g.handler && (W = g, g = W.handler, C = W.selector), g.guid || (g.guid = u.guid++), (H = ue.events) || (H = ue.events = {}), (AA = ue.handle) || (AA = ue.handle = function(pt) {
            return typeof u < "u" && (!pt || u.event.triggered !== pt.type) ? u.event.dispatch.apply(AA.elem, arguments) : void 0;
          }, AA.elem = o), d = (d || "").match(fA) || [""], M = d.length; M--; )
            F = Jr.exec(d[M]) || [], yA = YA = F[1], ie = (F[2] || "").split(".").sort(), yA && (q = u.event.special[yA] || {}, yA = (C ? q.delegateType : q.bindType) || yA, q = u.event.special[yA] || {}, mA = u.extend({
              type: yA,
              origType: YA,
              data: m,
              handler: g,
              guid: g.guid,
              selector: C,
              needsContext: C && u.expr.match.needsContext.test(C),
              namespace: ie.join(".")
            }, W), (SA = H[yA]) || (SA = H[yA] = [], SA.delegateCount = 0, (!q.setup || q.setup.call(o, m, ie, AA) === !1) && (o.addEventListener ? o.addEventListener(yA, AA, !1) : o.attachEvent && o.attachEvent("on" + yA, AA))), q.add && (q.add.call(o, mA), mA.handler.guid || (mA.handler.guid = g.guid)), C ? SA.splice(SA.delegateCount++, 0, mA) : SA.push(mA), u.event.global[yA] = !0);
          o = null;
        }
      },
      // Detach an event or set of events from an element
      remove: function(o, d, g, m, C) {
        var F, H, M, W, q, AA, mA, SA, yA, ie, YA, ue = u.hasData(o) && u._data(o);
        if (!(!ue || !(AA = ue.events))) {
          for (d = (d || "").match(fA) || [""], q = d.length; q--; ) {
            if (M = Jr.exec(d[q]) || [], yA = YA = M[1], ie = (M[2] || "").split(".").sort(), !yA) {
              for (yA in AA)
                u.event.remove(o, yA + d[q], g, m, !0);
              continue;
            }
            for (mA = u.event.special[yA] || {}, yA = (m ? mA.delegateType : mA.bindType) || yA, SA = AA[yA] || [], M = M[2] && new RegExp("(^|\\.)" + ie.join("\\.(?:.*\\.|)") + "(\\.|$)"), W = F = SA.length; F--; )
              H = SA[F], (C || YA === H.origType) && (!g || g.guid === H.guid) && (!M || M.test(H.namespace)) && (!m || m === H.selector || m === "**" && H.selector) && (SA.splice(F, 1), H.selector && SA.delegateCount--, mA.remove && mA.remove.call(o, H));
            W && !SA.length && ((!mA.teardown || mA.teardown.call(o, ie, ue.handle) === !1) && u.removeEvent(o, yA, ue.handle), delete AA[yA]);
          }
          u.isEmptyObject(AA) && (delete ue.handle, u._removeData(o, "events"));
        }
      },
      trigger: function(o, d, g, m) {
        var C, F, H, M, W, q, AA, mA = [g || i], SA = w.call(o, "type") ? o.type : o, yA = w.call(o, "namespace") ? o.namespace.split(".") : [];
        if (H = q = g = g || i, !(g.nodeType === 3 || g.nodeType === 8) && !zr.test(SA + u.event.triggered) && (SA.indexOf(".") > -1 && (yA = SA.split("."), SA = yA.shift(), yA.sort()), F = SA.indexOf(":") < 0 && "on" + SA, o = o[u.expando] ? o : new u.Event(SA, typeof o == "object" && o), o.isTrigger = m ? 2 : 3, o.namespace = yA.join("."), o.rnamespace = o.namespace ? new RegExp("(^|\\.)" + yA.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, o.result = void 0, o.target || (o.target = g), d = d == null ? [o] : u.makeArray(d, [o]), W = u.event.special[SA] || {}, !(!m && W.trigger && W.trigger.apply(g, d) === !1))) {
          if (!m && !W.noBubble && !u.isWindow(g)) {
            for (M = W.delegateType || SA, zr.test(M + SA) || (H = H.parentNode); H; H = H.parentNode)
              mA.push(H), q = H;
            q === (g.ownerDocument || i) && mA.push(q.defaultView || q.parentWindow || e);
          }
          for (AA = 0; (H = mA[AA++]) && !o.isPropagationStopped(); )
            o.type = AA > 1 ? M : W.bindType || SA, C = (u._data(H, "events") || {})[o.type] && u._data(H, "handle"), C && C.apply(H, d), C = F && H[F], C && C.apply && J(H) && (o.result = C.apply(H, d), o.result === !1 && o.preventDefault());
          if (o.type = SA, !m && !o.isDefaultPrevented() && (!W._default || W._default.apply(mA.pop(), d) === !1) && J(g) && F && g[SA] && !u.isWindow(g)) {
            q = g[F], q && (g[F] = null), u.event.triggered = SA;
            try {
              g[SA]();
            } catch {
            }
            u.event.triggered = void 0, q && (g[F] = q);
          }
          return o.result;
        }
      },
      dispatch: function(o) {
        o = u.event.fix(o);
        var d, g, m, C, F, H = [], M = s.call(arguments), W = (u._data(this, "events") || {})[o.type] || [], q = u.event.special[o.type] || {};
        if (M[0] = o, o.delegateTarget = this, !(q.preDispatch && q.preDispatch.call(this, o) === !1)) {
          for (H = u.event.handlers.call(this, o, W), d = 0; (C = H[d++]) && !o.isPropagationStopped(); )
            for (o.currentTarget = C.elem, g = 0; (F = C.handlers[g++]) && !o.isImmediatePropagationStopped(); )
              (!o.rnamespace || o.rnamespace.test(F.namespace)) && (o.handleObj = F, o.data = F.data, m = ((u.event.special[F.origType] || {}).handle || F.handler).apply(C.elem, M), m !== void 0 && (o.result = m) === !1 && (o.preventDefault(), o.stopPropagation()));
          return q.postDispatch && q.postDispatch.call(this, o), o.result;
        }
      },
      handlers: function(o, d) {
        var g, m, C, F, H = [], M = d.delegateCount, W = o.target;
        if (M && W.nodeType && (o.type !== "click" || isNaN(o.button) || o.button < 1)) {
          for (; W != this; W = W.parentNode || this)
            if (W.nodeType === 1 && (W.disabled !== !0 || o.type !== "click")) {
              for (m = [], g = 0; g < M; g++)
                F = d[g], C = F.selector + " ", m[C] === void 0 && (m[C] = F.needsContext ? u(C, this).index(W) > -1 : u.find(C, this, null, [W]).length), m[C] && m.push(F);
              m.length && H.push({ elem: W, handlers: m });
            }
        }
        return M < d.length && H.push({ elem: this, handlers: d.slice(M) }), H;
      },
      fix: function(o) {
        if (o[u.expando])
          return o;
        var d, g, m, C = o.type, F = o, H = this.fixHooks[C];
        for (H || (this.fixHooks[C] = H = xi.test(C) ? this.mouseHooks : vr.test(C) ? this.keyHooks : {}), m = H.props ? this.props.concat(H.props) : this.props, o = new u.Event(F), d = m.length; d--; )
          g = m[d], o[g] = F[g];
        return o.target || (o.target = F.srcElement || i), o.target.nodeType === 3 && (o.target = o.target.parentNode), o.metaKey = !!o.metaKey, H.filter ? H.filter(o, F) : o;
      },
      // Includes some event props shared by KeyEvent and MouseEvent
      props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
      fixHooks: {},
      keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(o, d) {
          return o.which == null && (o.which = d.charCode != null ? d.charCode : d.keyCode), o;
        }
      },
      mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(o, d) {
          var g, m, C, F = d.button, H = d.fromElement;
          return o.pageX == null && d.clientX != null && (m = o.target.ownerDocument || i, C = m.documentElement, g = m.body, o.pageX = d.clientX + (C && C.scrollLeft || g && g.scrollLeft || 0) - (C && C.clientLeft || g && g.clientLeft || 0), o.pageY = d.clientY + (C && C.scrollTop || g && g.scrollTop || 0) - (C && C.clientTop || g && g.clientTop || 0)), !o.relatedTarget && H && (o.relatedTarget = H === o.target ? d.toElement : H), !o.which && F !== void 0 && (o.which = F & 1 ? 1 : F & 2 ? 3 : F & 4 ? 2 : 0), o;
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
          _default: function(o) {
            return u.nodeName(o.target, "a");
          }
        },
        beforeunload: {
          postDispatch: function(o) {
            o.result !== void 0 && o.originalEvent && (o.originalEvent.returnValue = o.result);
          }
        }
      },
      // Piggyback on a donor event to simulate a different one
      simulate: function(o, d, g) {
        var m = u.extend(
          new u.Event(),
          g,
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
        u.event.trigger(m, null, d), m.isDefaultPrevented() && g.preventDefault();
      }
    }, u.removeEvent = i.removeEventListener ? function(o, d, g) {
      o.removeEventListener && o.removeEventListener(d, g);
    } : function(o, d, g) {
      var m = "on" + d;
      o.detachEvent && (typeof o[m] > "u" && (o[m] = null), o.detachEvent(m, g));
    }, u.Event = function(o, d) {
      if (!(this instanceof u.Event))
        return new u.Event(o, d);
      o && o.type ? (this.originalEvent = o, this.type = o.type, this.isDefaultPrevented = o.defaultPrevented || o.defaultPrevented === void 0 && // Support: IE < 9, Android < 4.0
      o.returnValue === !1 ? lA : DA) : this.type = o, d && u.extend(this, d), this.timeStamp = o && o.timeStamp || u.now(), this[u.expando] = !0;
    }, u.Event.prototype = {
      constructor: u.Event,
      isDefaultPrevented: DA,
      isPropagationStopped: DA,
      isImmediatePropagationStopped: DA,
      preventDefault: function() {
        var o = this.originalEvent;
        this.isDefaultPrevented = lA, o && (o.preventDefault ? o.preventDefault() : o.returnValue = !1);
      },
      stopPropagation: function() {
        var o = this.originalEvent;
        this.isPropagationStopped = lA, !(!o || this.isSimulated) && (o.stopPropagation && o.stopPropagation(), o.cancelBubble = !0);
      },
      stopImmediatePropagation: function() {
        var o = this.originalEvent;
        this.isImmediatePropagationStopped = lA, o && o.stopImmediatePropagation && o.stopImmediatePropagation(), this.stopPropagation();
      }
    }, u.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function(o, d) {
      u.event.special[o] = {
        delegateType: d,
        bindType: d,
        handle: function(g) {
          var m, C = this, F = g.relatedTarget, H = g.handleObj;
          return (!F || F !== C && !u.contains(C, F)) && (g.type = H.origType, m = H.handler.apply(this, arguments), g.type = d), m;
        }
      };
    }), v.submit || (u.event.special.submit = {
      setup: function() {
        if (u.nodeName(this, "form"))
          return !1;
        u.event.add(this, "click._submit keypress._submit", function(o) {
          var d = o.target, g = u.nodeName(d, "input") || u.nodeName(d, "button") ? (
            // Support: IE <=8
            // We use jQuery.prop instead of elem.form
            // to allow fixing the IE8 delegated submit issue (gh-2332)
            // by 3rd party polyfills/workarounds.
            u.prop(d, "form")
          ) : void 0;
          g && !u._data(g, "submit") && (u.event.add(g, "submit._submit", function(m) {
            m._submitBubble = !0;
          }), u._data(g, "submit", !0));
        });
      },
      postDispatch: function(o) {
        o._submitBubble && (delete o._submitBubble, this.parentNode && !o.isTrigger && u.event.simulate("submit", this.parentNode, o));
      },
      teardown: function() {
        if (u.nodeName(this, "form"))
          return !1;
        u.event.remove(this, "._submit");
      }
    }), v.change || (u.event.special.change = {
      setup: function() {
        if (dn.test(this.nodeName))
          return (this.type === "checkbox" || this.type === "radio") && (u.event.add(this, "propertychange._change", function(o) {
            o.originalEvent.propertyName === "checked" && (this._justChanged = !0);
          }), u.event.add(this, "click._change", function(o) {
            this._justChanged && !o.isTrigger && (this._justChanged = !1), u.event.simulate("change", this, o);
          })), !1;
        u.event.add(this, "beforeactivate._change", function(o) {
          var d = o.target;
          dn.test(d.nodeName) && !u._data(d, "change") && (u.event.add(d, "change._change", function(g) {
            this.parentNode && !g.isSimulated && !g.isTrigger && u.event.simulate("change", this.parentNode, g);
          }), u._data(d, "change", !0));
        });
      },
      handle: function(o) {
        var d = o.target;
        if (this !== d || o.isSimulated || o.isTrigger || d.type !== "radio" && d.type !== "checkbox")
          return o.handleObj.handler.apply(this, arguments);
      },
      teardown: function() {
        return u.event.remove(this, "._change"), !dn.test(this.nodeName);
      }
    }), v.focusin || u.each({ focus: "focusin", blur: "focusout" }, function(o, d) {
      var g = function(m) {
        u.event.simulate(d, m.target, u.event.fix(m));
      };
      u.event.special[d] = {
        setup: function() {
          var m = this.ownerDocument || this, C = u._data(m, d);
          C || m.addEventListener(o, g, !0), u._data(m, d, (C || 0) + 1);
        },
        teardown: function() {
          var m = this.ownerDocument || this, C = u._data(m, d) - 1;
          C ? u._data(m, d, C) : (m.removeEventListener(o, g, !0), u._removeData(m, d));
        }
      };
    }), u.fn.extend({
      on: function(o, d, g, m) {
        return ve(this, o, d, g, m);
      },
      one: function(o, d, g, m) {
        return ve(this, o, d, g, m, 1);
      },
      off: function(o, d, g) {
        var m, C;
        if (o && o.preventDefault && o.handleObj)
          return m = o.handleObj, u(o.delegateTarget).off(
            m.namespace ? m.origType + "." + m.namespace : m.origType,
            m.selector,
            m.handler
          ), this;
        if (typeof o == "object") {
          for (C in o)
            this.off(C, d, o[C]);
          return this;
        }
        return (d === !1 || typeof d == "function") && (g = d, d = void 0), g === !1 && (g = DA), this.each(function() {
          u.event.remove(this, o, g, d);
        });
      },
      trigger: function(o, d) {
        return this.each(function() {
          u.event.trigger(o, d, this);
        });
      },
      triggerHandler: function(o, d) {
        var g = this[0];
        if (g)
          return u.event.trigger(o, d, g, !0);
      }
    });
    var ye = / jQuery\d+="(?:null|\d+)"/g, ut = new RegExp("<(?:" + Te + ")[\\s/>]", "i"), xt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, xn = /<script|<style|<link/i, Ii = /checked\s*(?:[^=]|=\s*.checked.)/i, In = /^true\/(.*)/, Hi = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, jr = ke(i), hn = jr.appendChild(i.createElement("div"));
    function Si(o, d) {
      return u.nodeName(o, "table") && u.nodeName(d.nodeType !== 11 ? d : d.firstChild, "tr") ? o.getElementsByTagName("tbody")[0] || o.appendChild(o.ownerDocument.createElement("tbody")) : o;
    }
    function Yr(o) {
      return o.type = (u.find.attr(o, "type") !== null) + "/" + o.type, o;
    }
    function yr(o) {
      var d = In.exec(o.type);
      return d ? o.type = d[1] : o.removeAttribute("type"), o;
    }
    function Ys(o, d) {
      if (!(d.nodeType !== 1 || !u.hasData(o))) {
        var g, m, C, F = u._data(o), H = u._data(d, F), M = F.events;
        if (M) {
          delete H.handle, H.events = {};
          for (g in M)
            for (m = 0, C = M[g].length; m < C; m++)
              u.event.add(d, g, M[g][m]);
        }
        H.data && (H.data = u.extend({}, H.data));
      }
    }
    function vo(o, d) {
      var g, m, C;
      if (d.nodeType === 1) {
        if (g = d.nodeName.toLowerCase(), !v.noCloneEvent && d[u.expando]) {
          C = u._data(d);
          for (m in C.events)
            u.removeEvent(d, m, C.handle);
          d.removeAttribute(u.expando);
        }
        g === "script" && d.text !== o.text ? (Yr(d).text = o.text, yr(d)) : g === "object" ? (d.parentNode && (d.outerHTML = o.outerHTML), v.html5Clone && o.innerHTML && !u.trim(d.innerHTML) && (d.innerHTML = o.innerHTML)) : g === "input" && te.test(o.type) ? (d.defaultChecked = d.checked = o.checked, d.value !== o.value && (d.value = o.value)) : g === "option" ? d.defaultSelected = d.selected = o.defaultSelected : (g === "input" || g === "textarea") && (d.defaultValue = o.defaultValue);
      }
    }
    function Cr(o, d, g, m) {
      d = l.apply([], d);
      var C, F, H, M, W, q, AA = 0, mA = o.length, SA = mA - 1, yA = d[0], ie = u.isFunction(yA);
      if (ie || mA > 1 && typeof yA == "string" && !v.checkClone && Ii.test(yA))
        return o.each(function(YA) {
          var ue = o.eq(YA);
          ie && (d[0] = yA.call(this, YA, ue.html())), Cr(ue, d, g, m);
        });
      if (mA && (q = mt(d, o[0].ownerDocument, !1, o, m), C = q.firstChild, q.childNodes.length === 1 && (q = C), C || m)) {
        for (M = u.map(_e(q, "script"), Yr), H = M.length; AA < mA; AA++)
          F = q, AA !== SA && (F = u.clone(F, !0, !0), H && u.merge(M, _e(F, "script"))), g.call(o[AA], F, AA);
        if (H)
          for (W = M[M.length - 1].ownerDocument, u.map(M, yr), AA = 0; AA < H; AA++)
            F = M[AA], Ue.test(F.type || "") && !u._data(F, "globalEval") && u.contains(W, F) && (F.src ? u._evalUrl && u._evalUrl(F.src) : u.globalEval(
              (F.text || F.textContent || F.innerHTML || "").replace(Hi, "")
            ));
        q = C = null;
      }
      return o;
    }
    function fa(o, d, g) {
      for (var m, C = d ? u.filter(d, o) : o, F = 0; (m = C[F]) != null; F++)
        !g && m.nodeType === 1 && u.cleanData(_e(m)), m.parentNode && (g && u.contains(m.ownerDocument, m) && Mt(_e(m, "script")), m.parentNode.removeChild(m));
      return o;
    }
    u.extend({
      htmlPrefilter: function(o) {
        return o.replace(xt, "<$1></$2>");
      },
      clone: function(o, d, g) {
        var m, C, F, H, M, W = u.contains(o.ownerDocument, o);
        if (v.html5Clone || u.isXMLDoc(o) || !ut.test("<" + o.nodeName + ">") ? F = o.cloneNode(!0) : (hn.innerHTML = o.outerHTML, hn.removeChild(F = hn.firstChild)), (!v.noCloneEvent || !v.noCloneChecked) && (o.nodeType === 1 || o.nodeType === 11) && !u.isXMLDoc(o))
          for (m = _e(F), M = _e(o), H = 0; (C = M[H]) != null; ++H)
            m[H] && vo(C, m[H]);
        if (d)
          if (g)
            for (M = M || _e(o), m = m || _e(F), H = 0; (C = M[H]) != null; H++)
              Ys(C, m[H]);
          else
            Ys(o, F);
        return m = _e(F, "script"), m.length > 0 && Mt(m, !W && _e(o, "script")), m = M = C = null, F;
      },
      cleanData: function(o, d) {
        for (var g, m, C, F, H = 0, M = u.expando, W = u.cache, q = v.attributes, AA = u.event.special; (g = o[H]) != null; H++)
          if ((d || J(g)) && (C = g[M], F = C && W[C], F)) {
            if (F.events)
              for (m in F.events)
                AA[m] ? u.event.remove(g, m) : u.removeEvent(g, m, F.handle);
            W[C] && (delete W[C], !q && typeof g.removeAttribute < "u" ? g.removeAttribute(M) : g[M] = void 0, n.push(C));
          }
      }
    }), u.fn.extend({
      // Keep domManip exposed until 3.0 (gh-2225)
      domManip: Cr,
      detach: function(o) {
        return fa(this, o, !0);
      },
      remove: function(o) {
        return fa(this, o);
      },
      text: function(o) {
        return bA(this, function(d) {
          return d === void 0 ? u.text(this) : this.empty().append(
            (this[0] && this[0].ownerDocument || i).createTextNode(d)
          );
        }, null, o, arguments.length);
      },
      append: function() {
        return Cr(this, arguments, function(o) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Si(this, o);
            d.appendChild(o);
          }
        });
      },
      prepend: function() {
        return Cr(this, arguments, function(o) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var d = Si(this, o);
            d.insertBefore(o, d.firstChild);
          }
        });
      },
      before: function() {
        return Cr(this, arguments, function(o) {
          this.parentNode && this.parentNode.insertBefore(o, this);
        });
      },
      after: function() {
        return Cr(this, arguments, function(o) {
          this.parentNode && this.parentNode.insertBefore(o, this.nextSibling);
        });
      },
      empty: function() {
        for (var o, d = 0; (o = this[d]) != null; d++) {
          for (o.nodeType === 1 && u.cleanData(_e(o, !1)); o.firstChild; )
            o.removeChild(o.firstChild);
          o.options && u.nodeName(o, "select") && (o.options.length = 0);
        }
        return this;
      },
      clone: function(o, d) {
        return o = o ?? !1, d = d ?? o, this.map(function() {
          return u.clone(this, o, d);
        });
      },
      html: function(o) {
        return bA(this, function(d) {
          var g = this[0] || {}, m = 0, C = this.length;
          if (d === void 0)
            return g.nodeType === 1 ? g.innerHTML.replace(ye, "") : void 0;
          if (typeof d == "string" && !xn.test(d) && (v.htmlSerialize || !ut.test(d)) && (v.leadingWhitespace || !Ze.test(d)) && !Ke[(me.exec(d) || ["", ""])[1].toLowerCase()]) {
            d = u.htmlPrefilter(d);
            try {
              for (; m < C; m++)
                g = this[m] || {}, g.nodeType === 1 && (u.cleanData(_e(g, !1)), g.innerHTML = d);
              g = 0;
            } catch {
            }
          }
          g && this.empty().append(d);
        }, null, o, arguments.length);
      },
      replaceWith: function() {
        var o = [];
        return Cr(this, arguments, function(d) {
          var g = this.parentNode;
          u.inArray(this, o) < 0 && (u.cleanData(_e(this)), g && g.replaceChild(d, this));
        }, o);
      }
    }), u.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function(o, d) {
      u.fn[o] = function(g) {
        for (var m, C = 0, F = [], H = u(g), M = H.length - 1; C <= M; C++)
          m = C === M ? this : this.clone(!0), u(H[C])[d](m), c.apply(F, m.get());
        return this.pushStack(F);
      };
    });
    var Li, Zs = {
      // Support: Firefox
      // We have to pre-define these values for FF (#10227)
      HTML: "block",
      BODY: "block"
    };
    function Au(o, d) {
      var g = u(d.createElement(o)).appendTo(d.body), m = u.css(g[0], "display");
      return g.detach(), m;
    }
    function da(o) {
      var d = i, g = Zs[o];
      return g || (g = Au(o, d), (g === "none" || !g) && (Li = (Li || u("<iframe frameborder='0' width='0' height='0'/>")).appendTo(d.documentElement), d = (Li[0].contentWindow || Li[0].contentDocument).document, d.write(), d.close(), g = Au(o, d), Li.detach()), Zs[o] = g), g;
    }
    var eu = /^margin/, ha = new RegExp("^(" + ne + ")(?!px)[a-z%]+$", "i"), yo = function(o, d, g, m) {
      var C, F, H = {};
      for (F in d)
        H[F] = o.style[F], o.style[F] = d[F];
      C = g.apply(o, m || []);
      for (F in d)
        o.style[F] = H[F];
      return C;
    }, tu = i.documentElement;
    (function() {
      var o, d, g, m, C, F, H = i.createElement("div"), M = i.createElement("div");
      if (!M.style)
        return;
      M.style.cssText = "float:left;opacity:.5", v.opacity = M.style.opacity === "0.5", v.cssFloat = !!M.style.cssFloat, M.style.backgroundClip = "content-box", M.cloneNode(!0).style.backgroundClip = "", v.clearCloneStyle = M.style.backgroundClip === "content-box", H = i.createElement("div"), H.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", M.innerHTML = "", H.appendChild(M), v.boxSizing = M.style.boxSizing === "" || M.style.MozBoxSizing === "" || M.style.WebkitBoxSizing === "", u.extend(v, {
        reliableHiddenOffsets: function() {
          return o == null && W(), m;
        },
        boxSizingReliable: function() {
          return o == null && W(), g;
        },
        pixelMarginRight: function() {
          return o == null && W(), d;
        },
        pixelPosition: function() {
          return o == null && W(), o;
        },
        reliableMarginRight: function() {
          return o == null && W(), C;
        },
        reliableMarginLeft: function() {
          return o == null && W(), F;
        }
      });
      function W() {
        var q, AA, mA = i.documentElement;
        mA.appendChild(H), M.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", o = g = F = !1, d = C = !0, e.getComputedStyle && (AA = e.getComputedStyle(M), o = (AA || {}).top !== "1%", F = (AA || {}).marginLeft === "2px", g = (AA || { width: "4px" }).width === "4px", M.style.marginRight = "50%", d = (AA || { marginRight: "4px" }).marginRight === "4px", q = M.appendChild(i.createElement("div")), q.style.cssText = M.style.cssText = // Support: Android 2.3
        // Vendor-prefix box-sizing
        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", q.style.marginRight = q.style.width = "0", M.style.width = "1px", C = !parseFloat((e.getComputedStyle(q) || {}).marginRight), M.removeChild(q)), M.style.display = "none", m = M.getClientRects().length === 0, m && (M.style.display = "", M.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", M.childNodes[0].style.borderCollapse = "separate", q = M.getElementsByTagName("td"), q[0].style.cssText = "margin:0;border:0;padding:0;display:none", m = q[0].offsetHeight === 0, m && (q[0].style.display = "", q[1].style.display = "none", m = q[0].offsetHeight === 0)), mA.removeChild(H);
      }
    })();
    var Yn, Zn, jc = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (Yn = function(o) {
      var d = o.ownerDocument.defaultView;
      return (!d || !d.opener) && (d = e), d.getComputedStyle(o);
    }, Zn = function(o, d, g) {
      var m, C, F, H, M = o.style;
      return g = g || Yn(o), H = g ? g.getPropertyValue(d) || g[d] : void 0, (H === "" || H === void 0) && !u.contains(o.ownerDocument, o) && (H = u.style(o, d)), g && !v.pixelMarginRight() && ha.test(H) && eu.test(d) && (m = M.width, C = M.minWidth, F = M.maxWidth, M.minWidth = M.maxWidth = M.width = H, H = g.width, M.width = m, M.minWidth = C, M.maxWidth = F), H === void 0 ? H : H + "";
    }) : tu.currentStyle && (Yn = function(o) {
      return o.currentStyle;
    }, Zn = function(o, d, g) {
      var m, C, F, H, M = o.style;
      return g = g || Yn(o), H = g ? g[d] : void 0, H == null && M && M[d] && (H = M[d]), ha.test(H) && !jc.test(d) && (m = M.left, C = o.runtimeStyle, F = C && C.left, F && (C.left = o.currentStyle.left), M.left = d === "fontSize" ? "1em" : H, H = M.pixelLeft + "px", M.left = m, F && (C.left = F)), H === void 0 ? H : H + "" || "auto";
    });
    function Co(o, d) {
      return {
        get: function() {
          if (o()) {
            delete this.get;
            return;
          }
          return (this.get = d).apply(this, arguments);
        }
      };
    }
    var Qo = /alpha\([^)]*\)/i, Yc = /opacity\s*=\s*([^)]*)/i, Zc = /^(none|table(?!-c[ea]).+)/, pa = new RegExp("^(" + ne + ")(.*)$", "i"), Af = { position: "absolute", visibility: "hidden", display: "block" }, Ti = {
      letterSpacing: "0",
      fontWeight: "400"
    }, nu = ["Webkit", "O", "Moz", "ms"], ru = i.createElement("div").style;
    function iu(o) {
      if (o in ru)
        return o;
      for (var d = o.charAt(0).toUpperCase() + o.slice(1), g = nu.length; g--; )
        if (o = nu[g] + d, o in ru)
          return o;
    }
    function Fo(o, d) {
      for (var g, m, C, F = [], H = 0, M = o.length; H < M; H++)
        m = o[H], m.style && (F[H] = u._data(m, "olddisplay"), g = m.style.display, d ? (!F[H] && g === "none" && (m.style.display = ""), m.style.display === "" && sA(m) && (F[H] = u._data(m, "olddisplay", da(m.nodeName)))) : (C = sA(m), (g && g !== "none" || !C) && u._data(
          m,
          "olddisplay",
          C ? g : u.css(m, "display")
        )));
      for (H = 0; H < M; H++)
        m = o[H], m.style && (!d || m.style.display === "none" || m.style.display === "") && (m.style.display = d ? F[H] || "" : "none");
      return o;
    }
    function Uo(o, d, g) {
      var m = pa.exec(d);
      return m ? (
        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max(0, m[1] - (g || 0)) + (m[2] || "px")
      ) : d;
    }
    function Eo(o, d, g, m, C) {
      for (var F = g === (m ? "border" : "content") ? (
        // If we already have the right measurement, avoid augmentation
        4
      ) : (
        // Otherwise initialize for horizontal or vertical properties
        d === "width" ? 1 : 0
      ), H = 0; F < 4; F += 2)
        g === "margin" && (H += u.css(o, g + $A[F], !0, C)), m ? (g === "content" && (H -= u.css(o, "padding" + $A[F], !0, C)), g !== "margin" && (H -= u.css(o, "border" + $A[F] + "Width", !0, C))) : (H += u.css(o, "padding" + $A[F], !0, C), g !== "padding" && (H += u.css(o, "border" + $A[F] + "Width", !0, C)));
      return H;
    }
    function au(o, d, g) {
      var m = !0, C = d === "width" ? o.offsetWidth : o.offsetHeight, F = Yn(o), H = v.boxSizing && u.css(o, "boxSizing", !1, F) === "border-box";
      if (C <= 0 || C == null) {
        if (C = Zn(o, d, F), (C < 0 || C == null) && (C = o.style[d]), ha.test(C))
          return C;
        m = H && (v.boxSizingReliable() || C === o.style[d]), C = parseFloat(C) || 0;
      }
      return C + Eo(
        o,
        d,
        g || (H ? "border" : "content"),
        m,
        F
      ) + "px";
    }
    u.extend({
      // Add in style property hooks for overriding the default
      // behavior of getting and setting a style property
      cssHooks: {
        opacity: {
          get: function(o, d) {
            if (d) {
              var g = Zn(o, "opacity");
              return g === "" ? "1" : g;
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
        float: v.cssFloat ? "cssFloat" : "styleFloat"
      },
      // Get and set the style property on a DOM Node
      style: function(o, d, g, m) {
        if (!(!o || o.nodeType === 3 || o.nodeType === 8 || !o.style)) {
          var C, F, H, M = u.camelCase(d), W = o.style;
          if (d = u.cssProps[M] || (u.cssProps[M] = iu(M) || M), H = u.cssHooks[d] || u.cssHooks[M], g !== void 0) {
            if (F = typeof g, F === "string" && (C = JA.exec(g)) && C[1] && (g = vA(o, d, C), F = "number"), g == null || g !== g)
              return;
            if (F === "number" && (g += C && C[3] || (u.cssNumber[M] ? "" : "px")), !v.clearCloneStyle && g === "" && d.indexOf("background") === 0 && (W[d] = "inherit"), !H || !("set" in H) || (g = H.set(o, g, m)) !== void 0)
              try {
                W[d] = g;
              } catch {
              }
          } else
            return H && "get" in H && (C = H.get(o, !1, m)) !== void 0 ? C : W[d];
        }
      },
      css: function(o, d, g, m) {
        var C, F, H, M = u.camelCase(d);
        return d = u.cssProps[M] || (u.cssProps[M] = iu(M) || M), H = u.cssHooks[d] || u.cssHooks[M], H && "get" in H && (F = H.get(o, !0, g)), F === void 0 && (F = Zn(o, d, m)), F === "normal" && d in Ti && (F = Ti[d]), g === "" || g ? (C = parseFloat(F), g === !0 || isFinite(C) ? C || 0 : F) : F;
      }
    }), u.each(["height", "width"], function(o, d) {
      u.cssHooks[d] = {
        get: function(g, m, C) {
          if (m)
            return Zc.test(u.css(g, "display")) && g.offsetWidth === 0 ? yo(g, Af, function() {
              return au(g, d, C);
            }) : au(g, d, C);
        },
        set: function(g, m, C) {
          var F = C && Yn(g);
          return Uo(
            g,
            m,
            C ? Eo(
              g,
              d,
              C,
              v.boxSizing && u.css(g, "boxSizing", !1, F) === "border-box",
              F
            ) : 0
          );
        }
      };
    }), v.opacity || (u.cssHooks.opacity = {
      get: function(o, d) {
        return Yc.test((d && o.currentStyle ? o.currentStyle.filter : o.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : d ? "1" : "";
      },
      set: function(o, d) {
        var g = o.style, m = o.currentStyle, C = u.isNumeric(d) ? "alpha(opacity=" + d * 100 + ")" : "", F = m && m.filter || g.filter || "";
        g.zoom = 1, !((d >= 1 || d === "") && u.trim(F.replace(Qo, "")) === "" && g.removeAttribute && (g.removeAttribute("filter"), d === "" || m && !m.filter)) && (g.filter = Qo.test(F) ? F.replace(Qo, C) : F + " " + C);
      }
    }), u.cssHooks.marginRight = Co(
      v.reliableMarginRight,
      function(o, d) {
        if (d)
          return yo(
            o,
            { display: "inline-block" },
            Zn,
            [o, "marginRight"]
          );
      }
    ), u.cssHooks.marginLeft = Co(
      v.reliableMarginLeft,
      function(o, d) {
        if (d)
          return (parseFloat(Zn(o, "marginLeft")) || // Support: IE<=11+
          // Running getBoundingClientRect on a disconnected node in IE throws an error
          // Support: IE8 only
          // getClientRects() errors on disconnected elems
          (u.contains(o.ownerDocument, o) ? o.getBoundingClientRect().left - yo(o, { marginLeft: 0 }, function() {
            return o.getBoundingClientRect().left;
          }) : 0)) + "px";
      }
    ), u.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function(o, d) {
      u.cssHooks[o + d] = {
        expand: function(g) {
          for (var m = 0, C = {}, F = typeof g == "string" ? g.split(" ") : [g]; m < 4; m++)
            C[o + $A[m] + d] = F[m] || F[m - 2] || F[0];
          return C;
        }
      }, eu.test(o) || (u.cssHooks[o + d].set = Uo);
    }), u.fn.extend({
      css: function(o, d) {
        return bA(this, function(g, m, C) {
          var F, H, M = {}, W = 0;
          if (u.isArray(m)) {
            for (F = Yn(g), H = m.length; W < H; W++)
              M[m[W]] = u.css(g, m[W], !1, F);
            return M;
          }
          return C !== void 0 ? u.style(g, m, C) : u.css(g, m);
        }, o, d, arguments.length > 1);
      },
      show: function() {
        return Fo(this, !0);
      },
      hide: function() {
        return Fo(this);
      },
      toggle: function(o) {
        return typeof o == "boolean" ? o ? this.show() : this.hide() : this.each(function() {
          sA(this) ? u(this).show() : u(this).hide();
        });
      }
    });
    function It(o, d, g, m, C) {
      return new It.prototype.init(o, d, g, m, C);
    }
    u.Tween = It, It.prototype = {
      constructor: It,
      init: function(o, d, g, m, C, F) {
        this.elem = o, this.prop = g, this.easing = C || u.easing._default, this.options = d, this.start = this.now = this.cur(), this.end = m, this.unit = F || (u.cssNumber[g] ? "" : "px");
      },
      cur: function() {
        var o = It.propHooks[this.prop];
        return o && o.get ? o.get(this) : It.propHooks._default.get(this);
      },
      run: function(o) {
        var d, g = It.propHooks[this.prop];
        return this.options.duration ? this.pos = d = u.easing[this.easing](
          o,
          this.options.duration * o,
          0,
          1,
          this.options.duration
        ) : this.pos = d = o, this.now = (this.end - this.start) * d + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), g && g.set ? g.set(this) : It.propHooks._default.set(this), this;
      }
    }, It.prototype.init.prototype = It.prototype, It.propHooks = {
      _default: {
        get: function(o) {
          var d;
          return o.elem.nodeType !== 1 || o.elem[o.prop] != null && o.elem.style[o.prop] == null ? o.elem[o.prop] : (d = u.css(o.elem, o.prop, ""), !d || d === "auto" ? 0 : d);
        },
        set: function(o) {
          u.fx.step[o.prop] ? u.fx.step[o.prop](o) : o.elem.nodeType === 1 && (o.elem.style[u.cssProps[o.prop]] != null || u.cssHooks[o.prop]) ? u.style(o.elem, o.prop, o.now + o.unit) : o.elem[o.prop] = o.now;
        }
      }
    }, It.propHooks.scrollTop = It.propHooks.scrollLeft = {
      set: function(o) {
        o.elem.nodeType && o.elem.parentNode && (o.elem[o.prop] = o.now);
      }
    }, u.easing = {
      linear: function(o) {
        return o;
      },
      swing: function(o) {
        return 0.5 - Math.cos(o * Math.PI) / 2;
      },
      _default: "swing"
    }, u.fx = It.prototype.init, u.fx.step = {};
    var Zr, ga, ou = /^(?:toggle|show|hide)$/, su = /queueHooks$/;
    function bo() {
      return e.setTimeout(function() {
        Zr = void 0;
      }), Zr = u.now();
    }
    function Ai(o, d) {
      var g, m = { height: o }, C = 0;
      for (d = d ? 1 : 0; C < 4; C += 2 - d)
        g = $A[C], m["margin" + g] = m["padding" + g] = o;
      return d && (m.opacity = m.width = o), m;
    }
    function uu(o, d, g) {
      for (var m, C = (qt.tweeners[d] || []).concat(qt.tweeners["*"]), F = 0, H = C.length; F < H; F++)
        if (m = C[F].call(g, d, o))
          return m;
    }
    function lu(o, d, g) {
      var m, C, F, H, M, W, q, AA, mA = this, SA = {}, yA = o.style, ie = o.nodeType && sA(o), YA = u._data(o, "fxshow");
      g.queue || (M = u._queueHooks(o, "fx"), M.unqueued == null && (M.unqueued = 0, W = M.empty.fire, M.empty.fire = function() {
        M.unqueued || W();
      }), M.unqueued++, mA.always(function() {
        mA.always(function() {
          M.unqueued--, u.queue(o, "fx").length || M.empty.fire();
        });
      })), o.nodeType === 1 && ("height" in d || "width" in d) && (g.overflow = [yA.overflow, yA.overflowX, yA.overflowY], q = u.css(o, "display"), AA = q === "none" ? u._data(o, "olddisplay") || da(o.nodeName) : q, AA === "inline" && u.css(o, "float") === "none" && (!v.inlineBlockNeedsLayout || da(o.nodeName) === "inline" ? yA.display = "inline-block" : yA.zoom = 1)), g.overflow && (yA.overflow = "hidden", v.shrinkWrapBlocks() || mA.always(function() {
        yA.overflow = g.overflow[0], yA.overflowX = g.overflow[1], yA.overflowY = g.overflow[2];
      }));
      for (m in d)
        if (C = d[m], ou.exec(C)) {
          if (delete d[m], F = F || C === "toggle", C === (ie ? "hide" : "show"))
            if (C === "show" && YA && YA[m] !== void 0)
              ie = !0;
            else
              continue;
          SA[m] = YA && YA[m] || u.style(o, m);
        } else
          q = void 0;
      if (u.isEmptyObject(SA))
        (q === "none" ? da(o.nodeName) : q) === "inline" && (yA.display = q);
      else {
        YA ? "hidden" in YA && (ie = YA.hidden) : YA = u._data(o, "fxshow", {}), F && (YA.hidden = !ie), ie ? u(o).show() : mA.done(function() {
          u(o).hide();
        }), mA.done(function() {
          var ue;
          u._removeData(o, "fxshow");
          for (ue in SA)
            u.style(o, ue, SA[ue]);
        });
        for (m in SA)
          H = uu(ie ? YA[m] : 0, m, mA), m in YA || (YA[m] = H.start, ie && (H.end = H.start, H.start = m === "width" || m === "height" ? 1 : 0));
      }
    }
    function Ba(o, d) {
      var g, m, C, F, H;
      for (g in o)
        if (m = u.camelCase(g), C = d[m], F = o[g], u.isArray(F) && (C = F[1], F = o[g] = F[0]), g !== m && (o[m] = F, delete o[g]), H = u.cssHooks[m], H && "expand" in H) {
          F = H.expand(F), delete o[m];
          for (g in F)
            g in o || (o[g] = F[g], d[g] = C);
        } else
          d[m] = C;
    }
    function qt(o, d, g) {
      var m, C, F = 0, H = qt.prefilters.length, M = u.Deferred().always(function() {
        delete W.elem;
      }), W = function() {
        if (C)
          return !1;
        for (var mA = Zr || bo(), SA = Math.max(0, q.startTime + q.duration - mA), yA = SA / q.duration || 0, ie = 1 - yA, YA = 0, ue = q.tweens.length; YA < ue; YA++)
          q.tweens[YA].run(ie);
        return M.notifyWith(o, [q, ie, SA]), ie < 1 && ue ? SA : (M.resolveWith(o, [q]), !1);
      }, q = M.promise({
        elem: o,
        props: u.extend({}, d),
        opts: u.extend(!0, {
          specialEasing: {},
          easing: u.easing._default
        }, g),
        originalProperties: d,
        originalOptions: g,
        startTime: Zr || bo(),
        duration: g.duration,
        tweens: [],
        createTween: function(mA, SA) {
          var yA = u.Tween(
            o,
            q.opts,
            mA,
            SA,
            q.opts.specialEasing[mA] || q.opts.easing
          );
          return q.tweens.push(yA), yA;
        },
        stop: function(mA) {
          var SA = 0, yA = mA ? q.tweens.length : 0;
          if (C)
            return this;
          for (C = !0; SA < yA; SA++)
            q.tweens[SA].run(1);
          return mA ? (M.notifyWith(o, [q, 1, 0]), M.resolveWith(o, [q, mA])) : M.rejectWith(o, [q, mA]), this;
        }
      }), AA = q.props;
      for (Ba(AA, q.opts.specialEasing); F < H; F++)
        if (m = qt.prefilters[F].call(q, o, AA, q.opts), m)
          return u.isFunction(m.stop) && (u._queueHooks(q.elem, q.opts.queue).stop = u.proxy(m.stop, m)), m;
      return u.map(AA, uu, q), u.isFunction(q.opts.start) && q.opts.start.call(o, q), u.fx.timer(
        u.extend(W, {
          elem: o,
          anim: q,
          queue: q.opts.queue
        })
      ), q.progress(q.opts.progress).done(q.opts.done, q.opts.complete).fail(q.opts.fail).always(q.opts.always);
    }
    u.Animation = u.extend(qt, {
      tweeners: {
        "*": [function(o, d) {
          var g = this.createTween(o, d);
          return vA(g.elem, o, JA.exec(d), g), g;
        }]
      },
      tweener: function(o, d) {
        u.isFunction(o) ? (d = o, o = ["*"]) : o = o.match(fA);
        for (var g, m = 0, C = o.length; m < C; m++)
          g = o[m], qt.tweeners[g] = qt.tweeners[g] || [], qt.tweeners[g].unshift(d);
      },
      prefilters: [lu],
      prefilter: function(o, d) {
        d ? qt.prefilters.unshift(o) : qt.prefilters.push(o);
      }
    }), u.speed = function(o, d, g) {
      var m = o && typeof o == "object" ? u.extend({}, o) : {
        complete: g || !g && d || u.isFunction(o) && o,
        duration: o,
        easing: g && d || d && !u.isFunction(d) && d
      };
      return m.duration = u.fx.off ? 0 : typeof m.duration == "number" ? m.duration : m.duration in u.fx.speeds ? u.fx.speeds[m.duration] : u.fx.speeds._default, (m.queue == null || m.queue === !0) && (m.queue = "fx"), m.old = m.complete, m.complete = function() {
        u.isFunction(m.old) && m.old.call(this), m.queue && u.dequeue(this, m.queue);
      }, m;
    }, u.fn.extend({
      fadeTo: function(o, d, g, m) {
        return this.filter(sA).css("opacity", 0).show().end().animate({ opacity: d }, o, g, m);
      },
      animate: function(o, d, g, m) {
        var C = u.isEmptyObject(o), F = u.speed(d, g, m), H = function() {
          var M = qt(this, u.extend({}, o), F);
          (C || u._data(this, "finish")) && M.stop(!0);
        };
        return H.finish = H, C || F.queue === !1 ? this.each(H) : this.queue(F.queue, H);
      },
      stop: function(o, d, g) {
        var m = function(C) {
          var F = C.stop;
          delete C.stop, F(g);
        };
        return typeof o != "string" && (g = d, d = o, o = void 0), d && o !== !1 && this.queue(o || "fx", []), this.each(function() {
          var C = !0, F = o != null && o + "queueHooks", H = u.timers, M = u._data(this);
          if (F)
            M[F] && M[F].stop && m(M[F]);
          else
            for (F in M)
              M[F] && M[F].stop && su.test(F) && m(M[F]);
          for (F = H.length; F--; )
            H[F].elem === this && (o == null || H[F].queue === o) && (H[F].anim.stop(g), C = !1, H.splice(F, 1));
          (C || !g) && u.dequeue(this, o);
        });
      },
      finish: function(o) {
        return o !== !1 && (o = o || "fx"), this.each(function() {
          var d, g = u._data(this), m = g[o + "queue"], C = g[o + "queueHooks"], F = u.timers, H = m ? m.length : 0;
          for (g.finish = !0, u.queue(this, o, []), C && C.stop && C.stop.call(this, !0), d = F.length; d--; )
            F[d].elem === this && F[d].queue === o && (F[d].anim.stop(!0), F.splice(d, 1));
          for (d = 0; d < H; d++)
            m[d] && m[d].finish && m[d].finish.call(this);
          delete g.finish;
        });
      }
    }), u.each(["toggle", "show", "hide"], function(o, d) {
      var g = u.fn[d];
      u.fn[d] = function(m, C, F) {
        return m == null || typeof m == "boolean" ? g.apply(this, arguments) : this.animate(Ai(d, !0), m, C, F);
      };
    }), u.each({
      slideDown: Ai("show"),
      slideUp: Ai("hide"),
      slideToggle: Ai("toggle"),
      fadeIn: { opacity: "show" },
      fadeOut: { opacity: "hide" },
      fadeToggle: { opacity: "toggle" }
    }, function(o, d) {
      u.fn[o] = function(g, m, C) {
        return this.animate(d, g, m, C);
      };
    }), u.timers = [], u.fx.tick = function() {
      var o, d = u.timers, g = 0;
      for (Zr = u.now(); g < d.length; g++)
        o = d[g], !o() && d[g] === o && d.splice(g--, 1);
      d.length || u.fx.stop(), Zr = void 0;
    }, u.fx.timer = function(o) {
      u.timers.push(o), o() ? u.fx.start() : u.timers.pop();
    }, u.fx.interval = 13, u.fx.start = function() {
      ga || (ga = e.setInterval(u.fx.tick, u.fx.interval));
    }, u.fx.stop = function() {
      e.clearInterval(ga), ga = null;
    }, u.fx.speeds = {
      slow: 600,
      fast: 200,
      // Default speed
      _default: 400
    }, u.fn.delay = function(o, d) {
      return o = u.fx && u.fx.speeds[o] || o, d = d || "fx", this.queue(d, function(g, m) {
        var C = e.setTimeout(g, o);
        m.stop = function() {
          e.clearTimeout(C);
        };
      });
    }, function() {
      var o, d = i.createElement("input"), g = i.createElement("div"), m = i.createElement("select"), C = m.appendChild(i.createElement("option"));
      g = i.createElement("div"), g.setAttribute("className", "t"), g.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", o = g.getElementsByTagName("a")[0], d.setAttribute("type", "checkbox"), g.appendChild(d), o = g.getElementsByTagName("a")[0], o.style.cssText = "top:1px", v.getSetAttribute = g.className !== "t", v.style = /top/.test(o.getAttribute("style")), v.hrefNormalized = o.getAttribute("href") === "/a", v.checkOn = !!d.value, v.optSelected = C.selected, v.enctype = !!i.createElement("form").enctype, m.disabled = !0, v.optDisabled = !C.disabled, d = i.createElement("input"), d.setAttribute("value", ""), v.input = d.getAttribute("value") === "", d.value = "t", d.setAttribute("type", "radio"), v.radioValue = d.value === "t";
    }();
    var ef = /\r/g, cu = /[\x20\t\r\n\f]+/g;
    u.fn.extend({
      val: function(o) {
        var d, g, m, C = this[0];
        return arguments.length ? (m = u.isFunction(o), this.each(function(F) {
          var H;
          this.nodeType === 1 && (m ? H = o.call(this, F, u(this).val()) : H = o, H == null ? H = "" : typeof H == "number" ? H += "" : u.isArray(H) && (H = u.map(H, function(M) {
            return M == null ? "" : M + "";
          })), d = u.valHooks[this.type] || u.valHooks[this.nodeName.toLowerCase()], (!d || !("set" in d) || d.set(this, H, "value") === void 0) && (this.value = H));
        })) : C ? (d = u.valHooks[C.type] || u.valHooks[C.nodeName.toLowerCase()], d && "get" in d && (g = d.get(C, "value")) !== void 0 ? g : (g = C.value, typeof g == "string" ? (
          // handle most common string cases
          g.replace(ef, "")
        ) : (
          // handle cases where value is null/undef or number
          g ?? ""
        ))) : void 0;
      }
    }), u.extend({
      valHooks: {
        option: {
          get: function(o) {
            var d = u.find.attr(o, "value");
            return d ?? // Support: IE10-11+
            // option.text throws exceptions (#14686, #14858)
            // Strip and collapse whitespace
            // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
            u.trim(u.text(o)).replace(cu, " ");
          }
        },
        select: {
          get: function(o) {
            for (var d, g, m = o.options, C = o.selectedIndex, F = o.type === "select-one" || C < 0, H = F ? null : [], M = F ? C + 1 : m.length, W = C < 0 ? M : F ? C : 0; W < M; W++)
              if (g = m[W], (g.selected || W === C) && // Don't return options that are disabled or in a disabled optgroup
              (v.optDisabled ? !g.disabled : g.getAttribute("disabled") === null) && (!g.parentNode.disabled || !u.nodeName(g.parentNode, "optgroup"))) {
                if (d = u(g).val(), F)
                  return d;
                H.push(d);
              }
            return H;
          },
          set: function(o, d) {
            for (var g, m, C = o.options, F = u.makeArray(d), H = C.length; H--; )
              if (m = C[H], u.inArray(u.valHooks.option.get(m), F) > -1)
                try {
                  m.selected = g = !0;
                } catch {
                  m.scrollHeight;
                }
              else
                m.selected = !1;
            return g || (o.selectedIndex = -1), C;
          }
        }
      }
    }), u.each(["radio", "checkbox"], function() {
      u.valHooks[this] = {
        set: function(o, d) {
          if (u.isArray(d))
            return o.checked = u.inArray(u(o).val(), d) > -1;
        }
      }, v.checkOn || (u.valHooks[this].get = function(o) {
        return o.getAttribute("value") === null ? "on" : o.value;
      });
    });
    var Qr, wa, Hn = u.expr.attrHandle, ma = /^(?:checked|selected)$/i, Sn = v.getSetAttribute, ei = v.input;
    u.fn.extend({
      attr: function(o, d) {
        return bA(this, u.attr, o, d, arguments.length > 1);
      },
      removeAttr: function(o) {
        return this.each(function() {
          u.removeAttr(this, o);
        });
      }
    }), u.extend({
      attr: function(o, d, g) {
        var m, C, F = o.nodeType;
        if (!(F === 3 || F === 8 || F === 2)) {
          if (typeof o.getAttribute > "u")
            return u.prop(o, d, g);
          if ((F !== 1 || !u.isXMLDoc(o)) && (d = d.toLowerCase(), C = u.attrHooks[d] || (u.expr.match.bool.test(d) ? wa : Qr)), g !== void 0) {
            if (g === null) {
              u.removeAttr(o, d);
              return;
            }
            return C && "set" in C && (m = C.set(o, g, d)) !== void 0 ? m : (o.setAttribute(d, g + ""), g);
          }
          return C && "get" in C && (m = C.get(o, d)) !== null ? m : (m = u.find.attr(o, d), m ?? void 0);
        }
      },
      attrHooks: {
        type: {
          set: function(o, d) {
            if (!v.radioValue && d === "radio" && u.nodeName(o, "input")) {
              var g = o.value;
              return o.setAttribute("type", d), g && (o.value = g), d;
            }
          }
        }
      },
      removeAttr: function(o, d) {
        var g, m, C = 0, F = d && d.match(fA);
        if (F && o.nodeType === 1)
          for (; g = F[C++]; )
            m = u.propFix[g] || g, u.expr.match.bool.test(g) ? ei && Sn || !ma.test(g) ? o[m] = !1 : o[u.camelCase("default-" + g)] = o[m] = !1 : u.attr(o, g, ""), o.removeAttribute(Sn ? g : m);
      }
    }), wa = {
      set: function(o, d, g) {
        return d === !1 ? u.removeAttr(o, g) : ei && Sn || !ma.test(g) ? o.setAttribute(!Sn && u.propFix[g] || g, g) : o[u.camelCase("default-" + g)] = o[g] = !0, g;
      }
    }, u.each(u.expr.match.bool.source.match(/\w+/g), function(o, d) {
      var g = Hn[d] || u.find.attr;
      ei && Sn || !ma.test(d) ? Hn[d] = function(m, C, F) {
        var H, M;
        return F || (M = Hn[C], Hn[C] = H, H = g(m, C, F) != null ? C.toLowerCase() : null, Hn[C] = M), H;
      } : Hn[d] = function(m, C, F) {
        if (!F)
          return m[u.camelCase("default-" + C)] ? C.toLowerCase() : null;
      };
    }), (!ei || !Sn) && (u.attrHooks.value = {
      set: function(o, d, g) {
        if (u.nodeName(o, "input"))
          o.defaultValue = d;
        else
          return Qr && Qr.set(o, d, g);
      }
    }), Sn || (Qr = {
      set: function(o, d, g) {
        var m = o.getAttributeNode(g);
        if (m || o.setAttributeNode(
          m = o.ownerDocument.createAttribute(g)
        ), m.value = d += "", g === "value" || d === o.getAttribute(g))
          return d;
      }
    }, Hn.id = Hn.name = Hn.coords = function(o, d, g) {
      var m;
      if (!g)
        return (m = o.getAttributeNode(d)) && m.value !== "" ? m.value : null;
    }, u.valHooks.button = {
      get: function(o, d) {
        var g = o.getAttributeNode(d);
        if (g && g.specified)
          return g.value;
      },
      set: Qr.set
    }, u.attrHooks.contenteditable = {
      set: function(o, d, g) {
        Qr.set(o, d === "" ? !1 : d, g);
      }
    }, u.each(["width", "height"], function(o, d) {
      u.attrHooks[d] = {
        set: function(g, m) {
          if (m === "")
            return g.setAttribute(d, "auto"), m;
        }
      };
    })), v.style || (u.attrHooks.style = {
      get: function(o) {
        return o.style.cssText || void 0;
      },
      set: function(o, d) {
        return o.style.cssText = d + "";
      }
    });
    var ti = /^(?:input|select|textarea|button|object)$/i, fu = /^(?:a|area)$/i;
    u.fn.extend({
      prop: function(o, d) {
        return bA(this, u.prop, o, d, arguments.length > 1);
      },
      removeProp: function(o) {
        return o = u.propFix[o] || o, this.each(function() {
          try {
            this[o] = void 0, delete this[o];
          } catch {
          }
        });
      }
    }), u.extend({
      prop: function(o, d, g) {
        var m, C, F = o.nodeType;
        if (!(F === 3 || F === 8 || F === 2))
          return (F !== 1 || !u.isXMLDoc(o)) && (d = u.propFix[d] || d, C = u.propHooks[d]), g !== void 0 ? C && "set" in C && (m = C.set(o, g, d)) !== void 0 ? m : o[d] = g : C && "get" in C && (m = C.get(o, d)) !== null ? m : o[d];
      },
      propHooks: {
        tabIndex: {
          get: function(o) {
            var d = u.find.attr(o, "tabindex");
            return d ? parseInt(d, 10) : ti.test(o.nodeName) || fu.test(o.nodeName) && o.href ? 0 : -1;
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    }), v.hrefNormalized || u.each(["href", "src"], function(o, d) {
      u.propHooks[d] = {
        get: function(g) {
          return g.getAttribute(d, 4);
        }
      };
    }), v.optSelected || (u.propHooks.selected = {
      get: function(o) {
        var d = o.parentNode;
        return d && (d.selectedIndex, d.parentNode && d.parentNode.selectedIndex), null;
      },
      set: function(o) {
        var d = o.parentNode;
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
    }), v.enctype || (u.propFix.enctype = "encoding");
    var va = /[\t\r\n\f]/g;
    function Fr(o) {
      return u.attr(o, "class") || "";
    }
    u.fn.extend({
      addClass: function(o) {
        var d, g, m, C, F, H, M, W = 0;
        if (u.isFunction(o))
          return this.each(function(q) {
            u(this).addClass(o.call(this, q, Fr(this)));
          });
        if (typeof o == "string" && o) {
          for (d = o.match(fA) || []; g = this[W++]; )
            if (C = Fr(g), m = g.nodeType === 1 && (" " + C + " ").replace(va, " "), m) {
              for (H = 0; F = d[H++]; )
                m.indexOf(" " + F + " ") < 0 && (m += F + " ");
              M = u.trim(m), C !== M && u.attr(g, "class", M);
            }
        }
        return this;
      },
      removeClass: function(o) {
        var d, g, m, C, F, H, M, W = 0;
        if (u.isFunction(o))
          return this.each(function(q) {
            u(this).removeClass(o.call(this, q, Fr(this)));
          });
        if (!arguments.length)
          return this.attr("class", "");
        if (typeof o == "string" && o) {
          for (d = o.match(fA) || []; g = this[W++]; )
            if (C = Fr(g), m = g.nodeType === 1 && (" " + C + " ").replace(va, " "), m) {
              for (H = 0; F = d[H++]; )
                for (; m.indexOf(" " + F + " ") > -1; )
                  m = m.replace(" " + F + " ", " ");
              M = u.trim(m), C !== M && u.attr(g, "class", M);
            }
        }
        return this;
      },
      toggleClass: function(o, d) {
        var g = typeof o;
        return typeof d == "boolean" && g === "string" ? d ? this.addClass(o) : this.removeClass(o) : u.isFunction(o) ? this.each(function(m) {
          u(this).toggleClass(
            o.call(this, m, Fr(this), d),
            d
          );
        }) : this.each(function() {
          var m, C, F, H;
          if (g === "string")
            for (C = 0, F = u(this), H = o.match(fA) || []; m = H[C++]; )
              F.hasClass(m) ? F.removeClass(m) : F.addClass(m);
          else (o === void 0 || g === "boolean") && (m = Fr(this), m && u._data(this, "__className__", m), u.attr(
            this,
            "class",
            m || o === !1 ? "" : u._data(this, "__className__") || ""
          ));
        });
      },
      hasClass: function(o) {
        var d, g, m = 0;
        for (d = " " + o + " "; g = this[m++]; )
          if (g.nodeType === 1 && (" " + Fr(g) + " ").replace(va, " ").indexOf(d) > -1)
            return !0;
        return !1;
      }
    }), u.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
      function(o, d) {
        u.fn[d] = function(g, m) {
          return arguments.length > 0 ? this.on(d, null, g, m) : this.trigger(d);
        };
      }
    ), u.fn.extend({
      hover: function(o, d) {
        return this.mouseenter(o).mouseleave(d || o);
      }
    });
    var du = e.location, ya = u.now(), Ca = /\?/, hu = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    u.parseJSON = function(o) {
      if (e.JSON && e.JSON.parse)
        return e.JSON.parse(o + "");
      var d, g = null, m = u.trim(o + "");
      return m && !u.trim(m.replace(hu, function(C, F, H, M) {
        return d && F && (g = 0), g === 0 ? C : (d = H || F, g += !M - !H, "");
      })) ? Function("return " + m)() : u.error("Invalid JSON: " + o);
    }, u.parseXML = function(o) {
      var d, g;
      if (!o || typeof o != "string")
        return null;
      try {
        e.DOMParser ? (g = new e.DOMParser(), d = g.parseFromString(o, "text/xml")) : (d = new e.ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(o));
      } catch {
        d = void 0;
      }
      return (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && u.error("Invalid XML: " + o), d;
    };
    var tf = /#.*$/, pu = /([?&])_=[^&]*/, nf = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, gu = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rf = /^(?:GET|HEAD)$/, af = /^\/\//, Bu = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, wu = {}, Di = {}, mu = "*/".concat("*"), _o = du.href, ni = Bu.exec(_o.toLowerCase()) || [];
    function vu(o) {
      return function(d, g) {
        typeof d != "string" && (g = d, d = "*");
        var m, C = 0, F = d.toLowerCase().match(fA) || [];
        if (u.isFunction(g))
          for (; m = F[C++]; )
            m.charAt(0) === "+" ? (m = m.slice(1) || "*", (o[m] = o[m] || []).unshift(g)) : (o[m] = o[m] || []).push(g);
      };
    }
    function yu(o, d, g, m) {
      var C = {}, F = o === Di;
      function H(M) {
        var W;
        return C[M] = !0, u.each(o[M] || [], function(q, AA) {
          var mA = AA(d, g, m);
          if (typeof mA == "string" && !F && !C[mA])
            return d.dataTypes.unshift(mA), H(mA), !1;
          if (F)
            return !(W = mA);
        }), W;
      }
      return H(d.dataTypes[0]) || !C["*"] && H("*");
    }
    function Me(o, d) {
      var g, m, C = u.ajaxSettings.flatOptions || {};
      for (m in d)
        d[m] !== void 0 && ((C[m] ? o : g || (g = {}))[m] = d[m]);
      return g && u.extend(!0, o, g), o;
    }
    function Re(o, d, g) {
      for (var m, C, F, H, M = o.contents, W = o.dataTypes; W[0] === "*"; )
        W.shift(), C === void 0 && (C = o.mimeType || d.getResponseHeader("Content-Type"));
      if (C) {
        for (H in M)
          if (M[H] && M[H].test(C)) {
            W.unshift(H);
            break;
          }
      }
      if (W[0] in g)
        F = W[0];
      else {
        for (H in g) {
          if (!W[0] || o.converters[H + " " + W[0]]) {
            F = H;
            break;
          }
          m || (m = H);
        }
        F = F || m;
      }
      if (F)
        return F !== W[0] && W.unshift(F), g[F];
    }
    function of(o, d, g, m) {
      var C, F, H, M, W, q = {}, AA = o.dataTypes.slice();
      if (AA[1])
        for (H in o.converters)
          q[H.toLowerCase()] = o.converters[H];
      for (F = AA.shift(); F; )
        if (o.responseFields[F] && (g[o.responseFields[F]] = d), !W && m && o.dataFilter && (d = o.dataFilter(d, o.dataType)), W = F, F = AA.shift(), F) {
          if (F === "*")
            F = W;
          else if (W !== "*" && W !== F) {
            if (H = q[W + " " + F] || q["* " + F], !H) {
              for (C in q)
                if (M = C.split(" "), M[1] === F && (H = q[W + " " + M[0]] || q["* " + M[0]], H)) {
                  H === !0 ? H = q[C] : q[C] !== !0 && (F = M[0], AA.unshift(M[1]));
                  break;
                }
            }
            if (H !== !0)
              if (H && o.throws)
                d = H(d);
              else
                try {
                  d = H(d);
                } catch (mA) {
                  return {
                    state: "parsererror",
                    error: H ? mA : "No conversion from " + W + " to " + F
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
      ajaxSetup: function(o, d) {
        return d ? (
          // Building a settings object
          Me(Me(o, u.ajaxSettings), d)
        ) : (
          // Extending ajaxSettings
          Me(u.ajaxSettings, o)
        );
      },
      ajaxPrefilter: vu(wu),
      ajaxTransport: vu(Di),
      // Main method
      ajax: function(o, d) {
        typeof o == "object" && (d = o, o = void 0), d = d || {};
        var g, m, C, F, H, M, W, q, AA = u.ajaxSetup({}, d), mA = AA.context || AA, SA = AA.context && (mA.nodeType || mA.jquery) ? u(mA) : u.event, yA = u.Deferred(), ie = u.Callbacks("once memory"), YA = AA.statusCode || {}, ue = {}, pt = {}, Je = 0, Ar = "canceled", RA = {
          readyState: 0,
          // Builds headers hashtable if needed
          getResponseHeader: function(le) {
            var qe;
            if (Je === 2) {
              if (!q)
                for (q = {}; qe = nf.exec(F); )
                  q[qe[1].toLowerCase()] = qe[2];
              qe = q[le.toLowerCase()];
            }
            return qe ?? null;
          },
          // Raw string
          getAllResponseHeaders: function() {
            return Je === 2 ? F : null;
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
                RA.always(le[RA.status]);
            return this;
          },
          // Cancel the request
          abort: function(le) {
            var qe = le || Ar;
            return W && W.abort(qe), ct(0, qe), this;
          }
        };
        if (yA.promise(RA).complete = ie.add, RA.success = RA.done, RA.error = RA.fail, AA.url = ((o || AA.url || _o) + "").replace(tf, "").replace(af, ni[1] + "//"), AA.type = d.method || d.type || AA.method || AA.type, AA.dataTypes = u.trim(AA.dataType || "*").toLowerCase().match(fA) || [""], AA.crossDomain == null && (g = Bu.exec(AA.url.toLowerCase()), AA.crossDomain = !!(g && (g[1] !== ni[1] || g[2] !== ni[2] || (g[3] || (g[1] === "http:" ? "80" : "443")) !== (ni[3] || (ni[1] === "http:" ? "80" : "443"))))), AA.data && AA.processData && typeof AA.data != "string" && (AA.data = u.param(AA.data, AA.traditional)), yu(wu, AA, d, RA), Je === 2)
          return RA;
        M = u.event && AA.global, M && u.active++ === 0 && u.event.trigger("ajaxStart"), AA.type = AA.type.toUpperCase(), AA.hasContent = !rf.test(AA.type), C = AA.url, AA.hasContent || (AA.data && (C = AA.url += (Ca.test(C) ? "&" : "?") + AA.data, delete AA.data), AA.cache === !1 && (AA.url = pu.test(C) ? (
          // If there is already a '_' parameter, set its value
          C.replace(pu, "$1_=" + ya++)
        ) : (
          // Otherwise add one to the end
          C + (Ca.test(C) ? "&" : "?") + "_=" + ya++
        ))), AA.ifModified && (u.lastModified[C] && RA.setRequestHeader("If-Modified-Since", u.lastModified[C]), u.etag[C] && RA.setRequestHeader("If-None-Match", u.etag[C])), (AA.data && AA.hasContent && AA.contentType !== !1 || d.contentType) && RA.setRequestHeader("Content-Type", AA.contentType), RA.setRequestHeader(
          "Accept",
          AA.dataTypes[0] && AA.accepts[AA.dataTypes[0]] ? AA.accepts[AA.dataTypes[0]] + (AA.dataTypes[0] !== "*" ? ", " + mu + "; q=0.01" : "") : AA.accepts["*"]
        );
        for (m in AA.headers)
          RA.setRequestHeader(m, AA.headers[m]);
        if (AA.beforeSend && (AA.beforeSend.call(mA, RA, AA) === !1 || Je === 2))
          return RA.abort();
        Ar = "abort";
        for (m in { success: 1, error: 1, complete: 1 })
          RA[m](AA[m]);
        if (W = yu(Di, AA, d, RA), !W)
          ct(-1, "No Transport");
        else {
          if (RA.readyState = 1, M && SA.trigger("ajaxSend", [RA, AA]), Je === 2)
            return RA;
          AA.async && AA.timeout > 0 && (H = e.setTimeout(function() {
            RA.abort("timeout");
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
        function ct(le, qe, Ln, Fa) {
          var Ht, Tn, er, Dn, $e, St = qe;
          Je !== 2 && (Je = 2, H && e.clearTimeout(H), W = void 0, F = Fa || "", RA.readyState = le > 0 ? 4 : 0, Ht = le >= 200 && le < 300 || le === 304, Ln && (Dn = Re(AA, RA, Ln)), Dn = of(AA, Dn, RA, Ht), Ht ? (AA.ifModified && ($e = RA.getResponseHeader("Last-Modified"), $e && (u.lastModified[C] = $e), $e = RA.getResponseHeader("etag"), $e && (u.etag[C] = $e)), le === 204 || AA.type === "HEAD" ? St = "nocontent" : le === 304 ? St = "notmodified" : (St = Dn.state, Tn = Dn.data, er = Dn.error, Ht = !er)) : (er = St, (le || !St) && (St = "error", le < 0 && (le = 0))), RA.status = le, RA.statusText = (qe || St) + "", Ht ? yA.resolveWith(mA, [Tn, St, RA]) : yA.rejectWith(mA, [RA, St, er]), RA.statusCode(YA), YA = void 0, M && SA.trigger(
            Ht ? "ajaxSuccess" : "ajaxError",
            [RA, AA, Ht ? Tn : er]
          ), ie.fireWith(mA, [RA, St]), M && (SA.trigger("ajaxComplete", [RA, AA]), --u.active || u.event.trigger("ajaxStop")));
        }
        return RA;
      },
      getJSON: function(o, d, g) {
        return u.get(o, d, g, "json");
      },
      getScript: function(o, d) {
        return u.get(o, void 0, d, "script");
      }
    }), u.each(["get", "post"], function(o, d) {
      u[d] = function(g, m, C, F) {
        return u.isFunction(m) && (F = F || C, C = m, m = void 0), u.ajax(u.extend({
          url: g,
          type: d,
          dataType: F,
          data: m,
          success: C
        }, u.isPlainObject(g) && g));
      };
    }), u._evalUrl = function(o) {
      return u.ajax({
        url: o,
        // Make this explicit, since user can override this through ajaxSetup (#11264)
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        throws: !0
      });
    }, u.fn.extend({
      wrapAll: function(o) {
        if (u.isFunction(o))
          return this.each(function(g) {
            u(this).wrapAll(o.call(this, g));
          });
        if (this[0]) {
          var d = u(o, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && d.insertBefore(this[0]), d.map(function() {
            for (var g = this; g.firstChild && g.firstChild.nodeType === 1; )
              g = g.firstChild;
            return g;
          }).append(this);
        }
        return this;
      },
      wrapInner: function(o) {
        return u.isFunction(o) ? this.each(function(d) {
          u(this).wrapInner(o.call(this, d));
        }) : this.each(function() {
          var d = u(this), g = d.contents();
          g.length ? g.wrapAll(o) : d.append(o);
        });
      },
      wrap: function(o) {
        var d = u.isFunction(o);
        return this.each(function(g) {
          u(this).wrapAll(d ? o.call(this, g) : o);
        });
      },
      unwrap: function() {
        return this.parent().each(function() {
          u.nodeName(this, "body") || u(this).replaceWith(this.childNodes);
        }).end();
      }
    });
    function sf(o) {
      return o.style && o.style.display || u.css(o, "display");
    }
    function uf(o) {
      if (!u.contains(o.ownerDocument || i, o))
        return !0;
      for (; o && o.nodeType === 1; ) {
        if (sf(o) === "none" || o.type === "hidden")
          return !0;
        o = o.parentNode;
      }
      return !1;
    }
    u.expr.filters.hidden = function(o) {
      return v.reliableHiddenOffsets() ? o.offsetWidth <= 0 && o.offsetHeight <= 0 && !o.getClientRects().length : uf(o);
    }, u.expr.filters.visible = function(o) {
      return !u.expr.filters.hidden(o);
    };
    var lf = /%20/g, cf = /\[\]$/, Cu = /\r?\n/g, Qu = /^(?:submit|button|image|reset|file)$/i, ff = /^(?:input|select|textarea|keygen)/i;
    function et(o, d, g, m) {
      var C;
      if (u.isArray(d))
        u.each(d, function(F, H) {
          g || cf.test(o) ? m(o, H) : et(
            o + "[" + (typeof H == "object" && H != null ? F : "") + "]",
            H,
            g,
            m
          );
        });
      else if (!g && u.type(d) === "object")
        for (C in d)
          et(o + "[" + C + "]", d[C], g, m);
      else
        m(o, d);
    }
    u.param = function(o, d) {
      var g, m = [], C = function(F, H) {
        H = u.isFunction(H) ? H() : H ?? "", m[m.length] = encodeURIComponent(F) + "=" + encodeURIComponent(H);
      };
      if (d === void 0 && (d = u.ajaxSettings && u.ajaxSettings.traditional), u.isArray(o) || o.jquery && !u.isPlainObject(o))
        u.each(o, function() {
          C(this.name, this.value);
        });
      else
        for (g in o)
          et(g, o[g], d, C);
      return m.join("&").replace(lf, "+");
    }, u.fn.extend({
      serialize: function() {
        return u.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var o = u.prop(this, "elements");
          return o ? u.makeArray(o) : this;
        }).filter(function() {
          var o = this.type;
          return this.name && !u(this).is(":disabled") && ff.test(this.nodeName) && !Qu.test(o) && (this.checked || !te.test(o));
        }).map(function(o, d) {
          var g = u(this).val();
          return g == null ? null : u.isArray(g) ? u.map(g, function(m) {
            return { name: d.name, value: m.replace(Cu, `\r
`) };
          }) : { name: d.name, value: g.replace(Cu, `\r
`) };
        }).get();
      }
    }), u.ajaxSettings.xhr = e.ActiveXObject !== void 0 ? (
      // Support: IE6-IE8
      function() {
        return this.isLocal ? Rt() : i.documentMode > 8 ? Oi() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Oi() || Rt();
      }
    ) : (
      // For all other browsers, use the standard XMLHttpRequest object
      Oi
    );
    var xo = 0, pn = {}, ri = u.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
      for (var o in pn)
        pn[o](void 0, !0);
    }), v.cors = !!ri && "withCredentials" in ri, ri = v.ajax = !!ri, ri && u.ajaxTransport(function(o) {
      if (!o.crossDomain || v.cors) {
        var d;
        return {
          send: function(g, m) {
            var C, F = o.xhr(), H = ++xo;
            if (F.open(
              o.type,
              o.url,
              o.async,
              o.username,
              o.password
            ), o.xhrFields)
              for (C in o.xhrFields)
                F[C] = o.xhrFields[C];
            o.mimeType && F.overrideMimeType && F.overrideMimeType(o.mimeType), !o.crossDomain && !g["X-Requested-With"] && (g["X-Requested-With"] = "XMLHttpRequest");
            for (C in g)
              g[C] !== void 0 && F.setRequestHeader(C, g[C] + "");
            F.send(o.hasContent && o.data || null), d = function(M, W) {
              var q, AA, mA;
              if (d && (W || F.readyState === 4))
                if (delete pn[H], d = void 0, F.onreadystatechange = u.noop, W)
                  F.readyState !== 4 && F.abort();
                else {
                  mA = {}, q = F.status, typeof F.responseText == "string" && (mA.text = F.responseText);
                  try {
                    AA = F.statusText;
                  } catch {
                    AA = "";
                  }
                  !q && o.isLocal && !o.crossDomain ? q = mA.text ? 200 : 404 : q === 1223 && (q = 204);
                }
              mA && m(q, AA, mA, F.getAllResponseHeaders());
            }, o.async ? F.readyState === 4 ? e.setTimeout(d) : F.onreadystatechange = pn[H] = d : d();
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
    function Rt() {
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
        "text script": function(o) {
          return u.globalEval(o), o;
        }
      }
    }), u.ajaxPrefilter("script", function(o) {
      o.cache === void 0 && (o.cache = !1), o.crossDomain && (o.type = "GET", o.global = !1);
    }), u.ajaxTransport("script", function(o) {
      if (o.crossDomain) {
        var d, g = i.head || u("head")[0] || i.documentElement;
        return {
          send: function(m, C) {
            d = i.createElement("script"), d.async = !0, o.scriptCharset && (d.charset = o.scriptCharset), d.src = o.url, d.onload = d.onreadystatechange = function(F, H) {
              (H || !d.readyState || /loaded|complete/.test(d.readyState)) && (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), d = null, H || C(200, "success"));
            }, g.insertBefore(d, g.firstChild);
          },
          abort: function() {
            d && d.onload(void 0, !0);
          }
        };
      }
    });
    var Io = [], Qa = /(=)\?(?=&|$)|\?\?/;
    u.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var o = Io.pop() || u.expando + "_" + ya++;
        return this[o] = !0, o;
      }
    }), u.ajaxPrefilter("json jsonp", function(o, d, g) {
      var m, C, F, H = o.jsonp !== !1 && (Qa.test(o.url) ? "url" : typeof o.data == "string" && (o.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Qa.test(o.data) && "data");
      if (H || o.dataTypes[0] === "jsonp")
        return m = o.jsonpCallback = u.isFunction(o.jsonpCallback) ? o.jsonpCallback() : o.jsonpCallback, H ? o[H] = o[H].replace(Qa, "$1" + m) : o.jsonp !== !1 && (o.url += (Ca.test(o.url) ? "&" : "?") + o.jsonp + "=" + m), o.converters["script json"] = function() {
          return F || u.error(m + " was not called"), F[0];
        }, o.dataTypes[0] = "json", C = e[m], e[m] = function() {
          F = arguments;
        }, g.always(function() {
          C === void 0 ? u(e).removeProp(m) : e[m] = C, o[m] && (o.jsonpCallback = d.jsonpCallback, Io.push(m)), F && u.isFunction(C) && C(F[0]), F = C = void 0;
        }), "script";
    }), u.parseHTML = function(o, d, g) {
      if (!o || typeof o != "string")
        return null;
      typeof d == "boolean" && (g = d, d = !1), d = d || i;
      var m = dA.exec(o), C = !g && [];
      return m ? [d.createElement(m[1])] : (m = mt([o], d, C), C && C.length && u(C).remove(), u.merge([], m.childNodes));
    };
    var Ho = u.fn.load;
    u.fn.load = function(o, d, g) {
      if (typeof o != "string" && Ho)
        return Ho.apply(this, arguments);
      var m, C, F, H = this, M = o.indexOf(" ");
      return M > -1 && (m = u.trim(o.slice(M, o.length)), o = o.slice(0, M)), u.isFunction(d) ? (g = d, d = void 0) : d && typeof d == "object" && (C = "POST"), H.length > 0 && u.ajax({
        url: o,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: C || "GET",
        dataType: "html",
        data: d
      }).done(function(W) {
        F = arguments, H.html(m ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          u("<div>").append(u.parseHTML(W)).find(m)
        ) : (
          // Otherwise use the full result
          W
        ));
      }).always(g && function(W, q) {
        H.each(function() {
          g.apply(this, F || [W.responseText, q, W]);
        });
      }), this;
    }, u.each([
      "ajaxStart",
      "ajaxStop",
      "ajaxComplete",
      "ajaxError",
      "ajaxSuccess",
      "ajaxSend"
    ], function(o, d) {
      u.fn[d] = function(g) {
        return this.on(d, g);
      };
    }), u.expr.filters.animated = function(o) {
      return u.grep(u.timers, function(d) {
        return o === d.elem;
      }).length;
    };
    function So(o) {
      return u.isWindow(o) ? o : o.nodeType === 9 ? o.defaultView || o.parentWindow : !1;
    }
    u.offset = {
      setOffset: function(o, d, g) {
        var m, C, F, H, M, W, q, AA = u.css(o, "position"), mA = u(o), SA = {};
        AA === "static" && (o.style.position = "relative"), M = mA.offset(), F = u.css(o, "top"), W = u.css(o, "left"), q = (AA === "absolute" || AA === "fixed") && u.inArray("auto", [F, W]) > -1, q ? (m = mA.position(), H = m.top, C = m.left) : (H = parseFloat(F) || 0, C = parseFloat(W) || 0), u.isFunction(d) && (d = d.call(o, g, u.extend({}, M))), d.top != null && (SA.top = d.top - M.top + H), d.left != null && (SA.left = d.left - M.left + C), "using" in d ? d.using.call(o, SA) : mA.css(SA);
      }
    }, u.fn.extend({
      offset: function(o) {
        if (arguments.length)
          return o === void 0 ? this : this.each(function(H) {
            u.offset.setOffset(this, o, H);
          });
        var d, g, m = { top: 0, left: 0 }, C = this[0], F = C && C.ownerDocument;
        if (F)
          return d = F.documentElement, u.contains(d, C) ? (typeof C.getBoundingClientRect < "u" && (m = C.getBoundingClientRect()), g = So(F), {
            top: m.top + (g.pageYOffset || d.scrollTop) - (d.clientTop || 0),
            left: m.left + (g.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
          }) : m;
      },
      position: function() {
        if (this[0]) {
          var o, d, g = { top: 0, left: 0 }, m = this[0];
          return u.css(m, "position") === "fixed" ? d = m.getBoundingClientRect() : (o = this.offsetParent(), d = this.offset(), u.nodeName(o[0], "html") || (g = o.offset()), g.top += u.css(o[0], "borderTopWidth", !0), g.left += u.css(o[0], "borderLeftWidth", !0)), {
            top: d.top - g.top - u.css(m, "marginTop", !0),
            left: d.left - g.left - u.css(m, "marginLeft", !0)
          };
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (var o = this.offsetParent; o && !u.nodeName(o, "html") && u.css(o, "position") === "static"; )
            o = o.offsetParent;
          return o || tu;
        });
      }
    }), u.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(o, d) {
      var g = /Y/.test(d);
      u.fn[o] = function(m) {
        return bA(this, function(C, F, H) {
          var M = So(C);
          if (H === void 0)
            return M ? d in M ? M[d] : M.document.documentElement[F] : C[F];
          M ? M.scrollTo(
            g ? u(M).scrollLeft() : H,
            g ? H : u(M).scrollTop()
          ) : C[F] = H;
        }, o, m, arguments.length, null);
      };
    }), u.each(["top", "left"], function(o, d) {
      u.cssHooks[d] = Co(
        v.pixelPosition,
        function(g, m) {
          if (m)
            return m = Zn(g, d), ha.test(m) ? u(g).position()[d] + "px" : m;
        }
      );
    }), u.each({ Height: "height", Width: "width" }, function(o, d) {
      u.each(
        { padding: "inner" + o, content: d, "": "outer" + o },
        function(g, m) {
          u.fn[m] = function(C, F) {
            var H = arguments.length && (g || typeof C != "boolean"), M = g || (C === !0 || F === !0 ? "margin" : "border");
            return bA(this, function(W, q, AA) {
              var mA;
              return u.isWindow(W) ? W.document.documentElement["client" + o] : W.nodeType === 9 ? (mA = W.documentElement, Math.max(
                W.body["scroll" + o],
                mA["scroll" + o],
                W.body["offset" + o],
                mA["offset" + o],
                mA["client" + o]
              )) : AA === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                u.css(W, q, M)
              ) : (
                // Set width or height on the element
                u.style(W, q, AA, M)
              );
            }, d, H ? C : void 0, H, null);
          };
        }
      );
    }), u.fn.extend({
      bind: function(o, d, g) {
        return this.on(o, null, d, g);
      },
      unbind: function(o, d) {
        return this.off(o, null, d);
      },
      delegate: function(o, d, g, m) {
        return this.on(d, o, g, m);
      },
      undelegate: function(o, d, g) {
        return arguments.length === 1 ? this.off(o, "**") : this.off(d, o || "**", g);
      }
    }), u.fn.size = function() {
      return this.length;
    }, u.fn.andSelf = u.fn.addBack;
    var Fu = e.jQuery, Uu = e.$;
    return u.noConflict = function(o) {
      return e.$ === u && (e.$ = Uu), o && e.jQuery === u && (e.jQuery = Fu), u;
    }, t || (e.jQuery = e.$ = u), u;
  });
})(S0);
var FO = S0.exports;
const oe = /* @__PURE__ */ Rh(FO), UO = function(A) {
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
  }, t = Le.merge({}, e, A), n = function(s) {
    return s < 1e3 ? s : s < 1e6 ? (s / 1e3).toFixed(1) + "Kb" : (s / 1e6).toFixed(1) + "Mb";
  };
  function i(s) {
    s.each(function(l) {
      var c = WA(this).selectAll(".chromosome-label").data([l]), f = c.enter().append("g").attr("class", "chromosome-label");
      f.append("text"), t.border && f.append("rect").classed("border", !0), WA(this).selectAll(".chromosome-label").attr("transform", function(v) {
        return "translate(" + t.layout.x + "," + t.layout.y + ")";
      }), WA(this).selectAll(".chromosome-label").selectAll("text").attr("x", t.layout.width * 0.5).attr("y", t.layout.height * 0.5).style(
        "font-size",
        Math.max(14 / t.scale, t.layout.chromosomeWidth * 1.2) + "px"
      ).text(l.number).on("click", t.onLabelSelectFunction), t.border && c.select("rect").attr("width", t.layout.width).attr("height", t.layout.height), c.exit().remove();
      var p = WA(this).selectAll(".chromosome-size-label").data([l]);
      f = p.enter().append("g").attr("class", "chromosome-size-label"), f.append("text");
      var B = 10 + t.sizeLayout.y + t.sizeLayout.cellHeight * l.length / t.longestChromosome, w = 1.2 * t.labelSize / Math.min(5, t.scale) + "px";
      WA(this).selectAll(".chromosome-size-label").attr(
        "transform",
        "translate(" + t.sizeLayout.x + "," + B + ")"
      ), p = WA(this).selectAll(".chromosome-size-label").select("text").attr("x", t.sizeLayout.width * 0.5).attr("y", 0).attr("dy", "1em").style("font-size", w).text(n(l.length)), p.exit().remove();
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
}, EO = function(A) {
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
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(p) {
    var B = n(), w = B(p.length), v = WA(this);
    v.attr("id", "chromosome_" + p.number).attr(
      "transform",
      "translate(" + t.layout.x + "," + t.layout.y + ")"
    ), v.select("defs").html("").append("mask").attr("id", "chromosome_mask_" + p.number).append("rect").attr("class", "mask_rect"), v.select("#chromosome_mask_" + p.number).attr("width", t.layout.width).attr("height", w);
    var Q = {
      width: t.layout.width,
      height: w,
      rx: Math.min(t.layout.width * 0.4, t.layout.height * 0.1),
      ry: Math.min(t.layout.width * 0.4, t.layout.height * 0.1)
    };
    v.select(".mask_rect").attr("width", Q.width).attr("height", Q.height).attr("rx", Q.rx).attr("ry", Q.ry), v.select("rect.background").attr("width", Q.width).attr("height", Q.height).attr("rx", Q.rx).attr("ry", Q.ry), v.select("rect.outline").attr("width", Q.width).attr("height", Q.height).attr("rx", Q.rx).attr("ry", Q.ry);
    var u = [], U = function() {
      var R = v.selectAll("rect.selection").data(u);
      R.enter().append("rect").attr("class", "selection").style("fill", "gray").style("opacity", 0.2), R.attr("x", 0).attr("y", function(x) {
        return Math.min(x.start, x.end);
      }).attr("width", t.layout.width).attr("height", function(x) {
        return Math.abs(x.end - x.start);
      }), R.exit().remove();
    }, b = aT().on("start", function(R) {
      var x = Vn(R, this);
      u.push({
        start: x[1],
        end: x[1]
      }), U(), R.sourceEvent.stopPropagation();
    }).on("drag", function(R) {
      u[0].end = Vn(R, this)[1], U(), R.sourceEvent.stopPropagation(), R.sourceEvent.preventDefault();
    }).on("end", function(R) {
      R.sourceEvent.stopPropagation();
      var x = B.invert(u[0].start), K = B.invert(u[0].end);
      if (x > K) {
        var k = x;
        x = K, K = k;
      }
      var Y = p.layout.geneBandNodes.filter(function(dA) {
        return dA.data.midpoint > x && dA.data.midpoint < K;
      });
      Y.forEach(function(dA) {
        dA.data.type == "gene" ? dA.data.visible = !0 : dA.data.type == "geneslist" && dA.data.genesList.forEach(function(cA) {
          cA.visible = !0;
        });
      }), t.onAnnotationSelectFunction(), u = [], U();
    });
    v.select("rect.background").call(b), t.border && v.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
    var E = v.select(".bands_container"), D;
    t.bands == "basemap" ? D = s : t.bands == "genes" && (D = c), D(E, p), v.select(".bands_container").style("mask", "url(#chromosome_mask_" + p.number + ")");
  }, s = function(p, B) {
    var w = n(), v = p.selectAll("rect.band").data(B.bands);
    v.enter().append("rect").attr("class", "band"), v.attr("width", t.layout.width).attr("y", function(Q) {
      return w(Q.start);
    }).attr("height", function(Q) {
      return w(Q.end - Q.start);
    }).attr("fill", function(Q) {
      return Q.color;
    }), v.exit().remove();
  }, l = function(p, B) {
    var w = B.end - B.start, v = p(w), Q;
    if (v * t.scale > 2)
      Q = { y: p(B.start), height: v };
    else {
      let u = Math.min(2 / t.scale, 2);
      Q = { y: p(B.midpoint) - u / 2, height: u };
    }
    return Q.fill = B.color, Q.width = t.layout.width, Q["fill-opacity"] = 0.8, Q["stroke-dasharray"] = [
      0,
      t.layout.width,
      Q.height,
      t.layout.width + Q.height
    ], Q["stroke-width"] = t.layout.width / 5, Q;
  }, c = function(p, B) {
    var w = n(), v = p.selectAll("rect.band"), Q = v.data(B.layout.geneBandNodes);
    Q.enter().append("rect").attr("id", function(U) {
      return U.data.id;
    }).attr("class", "band geneline infobox"), Q.each(function(U) {
      let b = l(w, U);
      WA(this).attr("y", b.y).attr("height", b.height).attr("fill", b.fill).attr("width", b.width).attr("fill-opacity", b["fill-opacity"]).attr("stroke-dasharray", b["stroke-dasharray"]).attr("stroke-width", b["stroke-width"]);
    }), Q.classed("selected", function(U) {
      return U.data.selected;
    });
    var u = v.data(B.bands);
    u.attr("width", t.layout.width).attr("y", function(U) {
      return w(U.start);
    }).attr("height", function(U) {
      return w(U.end - U.start);
    }).attr("fill", function(U) {
      return "white";
    }), Q.on("click", function(U, b) {
      if (b.data.type == "gene" && (b.data.displayed && !b.data.visible && !b.data.hidden ? (b.data.visible = !1, b.data.hidden = !0) : b.data.visible = !b.data.visible, t.onAnnotationSelectFunction()), b.data.type == "geneslist") {
        let E = b.data.genesList.some(function(D) {
          return !D.displayed;
        });
        b.data.genesList.forEach(function(D) {
          D.visible = E, D.hidden = !E;
        }), t.onAnnotationSelectFunction();
      }
    }), Q.exit().remove();
  };
  function f(p) {
    p.each(function(B) {
      var w = WA(this).selectAll(".chromosome").data([B]), v = w.enter().append("g").attr("class", "chromosome");
      v.append("defs"), v.append("rect").classed("background", !0), v.append("g").classed("bands_container", !0), v.append("rect").classed("outline", !0), t.border && v.append("rect").classed("border", !0), WA(this).selectAll(".chromosome").each(i), w.exit().remove();
    });
  }
  return f.onAnnotationSelectFunction = function(p) {
    return arguments.length ? (t.onAnnotationSelectFunction = p, f) : t.onAnnotationSelectFunction;
  }, f.layout = function(p) {
    return arguments.length ? (t.layout = p, f) : t.layout;
  }, f.drawing = function(p) {
    return arguments.length ? (t.drawing = p, f) : t.drawing;
  }, f.longestChromosome = function(p) {
    return arguments.length ? (t.longestChromosome = p, f) : t.longestChromosome;
  }, f.bands = function(p) {
    return arguments.length ? (t.bands = p, f) : t.bands;
  }, f.scale = function(p) {
    return arguments.length ? (t.scale = p, f) : t.scale;
  }, f.infoBoxManager = function(p) {
    return arguments.length ? (t.infoBoxManager = p, f) : t.infoBoxManager;
  }, f;
};
var nn = "top", bn = "bottom", _n = "right", rn = "left", kp = "auto", Xs = [nn, bn, _n, rn], lo = "start", Ds = "end", bO = "clippingParents", L0 = "viewport", es = "popper", _O = "reference", Mw = /* @__PURE__ */ Xs.reduce(function(A, e) {
  return A.concat([e + "-" + lo, e + "-" + Ds]);
}, []), T0 = /* @__PURE__ */ [].concat(Xs, [kp]).reduce(function(A, e) {
  return A.concat([e, e + "-" + lo, e + "-" + Ds]);
}, []), xO = "beforeRead", IO = "read", HO = "afterRead", SO = "beforeMain", LO = "main", TO = "afterMain", DO = "beforeWrite", OO = "write", NO = "afterWrite", MO = [xO, IO, HO, SO, LO, TO, DO, OO, NO];
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
function la(A) {
  var e = fn(A).Element;
  return A instanceof e || A instanceof Element;
}
function En(A) {
  var e = fn(A).HTMLElement;
  return A instanceof e || A instanceof HTMLElement;
}
function Gp(A) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = fn(A).ShadowRoot;
  return A instanceof e || A instanceof ShadowRoot;
}
function KO(A) {
  var e = A.state;
  Object.keys(e.elements).forEach(function(t) {
    var n = e.styles[t] || {}, i = e.attributes[t] || {}, s = e.elements[t];
    !En(s) || !pr(s) || (Object.assign(s.style, n), Object.keys(i).forEach(function(l) {
      var c = i[l];
      c === !1 ? s.removeAttribute(l) : s.setAttribute(l, c === !0 ? "" : c);
    }));
  });
}
function RO(A) {
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
      var i = e.elements[n], s = e.attributes[n] || {}, l = Object.keys(e.styles.hasOwnProperty(n) ? e.styles[n] : t[n]), c = l.reduce(function(f, p) {
        return f[p] = "", f;
      }, {});
      !En(i) || !pr(i) || (Object.assign(i.style, c), Object.keys(s).forEach(function(f) {
        i.removeAttribute(f);
      }));
    });
  };
}
const D0 = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: KO,
  effect: RO,
  requires: ["computeStyles"]
};
function hr(A) {
  return A.split("-")[0];
}
var na = Math.max, wc = Math.min, co = Math.round;
function lh() {
  var A = navigator.userAgentData;
  return A != null && A.brands && Array.isArray(A.brands) ? A.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function O0() {
  return !/^((?!chrome|android).)*safari/i.test(lh());
}
function fo(A, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var n = A.getBoundingClientRect(), i = 1, s = 1;
  e && En(A) && (i = A.offsetWidth > 0 && co(n.width) / A.offsetWidth || 1, s = A.offsetHeight > 0 && co(n.height) / A.offsetHeight || 1);
  var l = la(A) ? fn(A) : window, c = l.visualViewport, f = !O0() && t, p = (n.left + (f && c ? c.offsetLeft : 0)) / i, B = (n.top + (f && c ? c.offsetTop : 0)) / s, w = n.width / i, v = n.height / s;
  return {
    width: w,
    height: v,
    top: B,
    right: p + w,
    bottom: B + v,
    left: p,
    x: p,
    y: B
  };
}
function Vp(A) {
  var e = fo(A), t = A.offsetWidth, n = A.offsetHeight;
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
function Xr(A) {
  return fn(A).getComputedStyle(A);
}
function $O(A) {
  return ["table", "td", "th"].indexOf(pr(A)) >= 0;
}
function _i(A) {
  return ((la(A) ? A.ownerDocument : (
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
    (Gp(A) ? A.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    _i(A)
  );
}
function Kw(A) {
  return !En(A) || // https://github.com/popperjs/popper-core/issues/837
  Xr(A).position === "fixed" ? null : A.offsetParent;
}
function PO(A) {
  var e = /firefox/i.test(lh()), t = /Trident/i.test(lh());
  if (t && En(A)) {
    var n = Xr(A);
    if (n.position === "fixed")
      return null;
  }
  var i = Rc(A);
  for (Gp(i) && (i = i.host); En(i) && ["html", "body"].indexOf(pr(i)) < 0; ) {
    var s = Xr(i);
    if (s.transform !== "none" || s.perspective !== "none" || s.contain === "paint" || ["transform", "perspective"].indexOf(s.willChange) !== -1 || e && s.willChange === "filter" || e && s.filter && s.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function qs(A) {
  for (var e = fn(A), t = Kw(A); t && $O(t) && Xr(t).position === "static"; )
    t = Kw(t);
  return t && (pr(t) === "html" || pr(t) === "body" && Xr(t).position === "static") ? e : t || PO(A) || e;
}
function Wp(A) {
  return ["top", "bottom"].indexOf(A) >= 0 ? "x" : "y";
}
function Cs(A, e, t) {
  return na(A, wc(e, t));
}
function kO(A, e, t) {
  var n = Cs(A, e, t);
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
function K0(A) {
  return Object.assign({}, M0(), A);
}
function R0(A, e) {
  return e.reduce(function(t, n) {
    return t[n] = A, t;
  }, {});
}
var GO = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, K0(typeof e != "number" ? e : R0(e, Xs));
};
function VO(A) {
  var e, t = A.state, n = A.name, i = A.options, s = t.elements.arrow, l = t.modifiersData.popperOffsets, c = hr(t.placement), f = Wp(c), p = [rn, _n].indexOf(c) >= 0, B = p ? "height" : "width";
  if (!(!s || !l)) {
    var w = GO(i.padding, t), v = Vp(s), Q = f === "y" ? nn : rn, u = f === "y" ? bn : _n, U = t.rects.reference[B] + t.rects.reference[f] - l[f] - t.rects.popper[B], b = l[f] - t.rects.reference[f], E = qs(s), D = E ? f === "y" ? E.clientHeight || 0 : E.clientWidth || 0 : 0, R = U / 2 - b / 2, x = w[Q], K = D - v[B] - w[u], k = D / 2 - v[B] / 2 + R, Y = Cs(x, k, K), dA = f;
    t.modifiersData[n] = (e = {}, e[dA] = Y, e.centerOffset = Y - k, e);
  }
}
function WO(A) {
  var e = A.state, t = A.options, n = t.element, i = n === void 0 ? "[data-popper-arrow]" : n;
  i != null && (typeof i == "string" && (i = e.elements.popper.querySelector(i), !i) || N0(e.elements.popper, i) && (e.elements.arrow = i));
}
const XO = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: VO,
  effect: WO,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function ho(A) {
  return A.split("-")[1];
}
var qO = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function zO(A, e) {
  var t = A.x, n = A.y, i = e.devicePixelRatio || 1;
  return {
    x: co(t * i) / i || 0,
    y: co(n * i) / i || 0
  };
}
function Rw(A) {
  var e, t = A.popper, n = A.popperRect, i = A.placement, s = A.variation, l = A.offsets, c = A.position, f = A.gpuAcceleration, p = A.adaptive, B = A.roundOffsets, w = A.isFixed, v = l.x, Q = v === void 0 ? 0 : v, u = l.y, U = u === void 0 ? 0 : u, b = typeof B == "function" ? B({
    x: Q,
    y: U
  }) : {
    x: Q,
    y: U
  };
  Q = b.x, U = b.y;
  var E = l.hasOwnProperty("x"), D = l.hasOwnProperty("y"), R = rn, x = nn, K = window;
  if (p) {
    var k = qs(t), Y = "clientHeight", dA = "clientWidth";
    if (k === fn(t) && (k = _i(t), Xr(k).position !== "static" && c === "absolute" && (Y = "scrollHeight", dA = "scrollWidth")), k = k, i === nn || (i === rn || i === _n) && s === Ds) {
      x = bn;
      var cA = w && k === K && K.visualViewport ? K.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        k[Y]
      );
      U -= cA - n.height, U *= f ? 1 : -1;
    }
    if (i === rn || (i === nn || i === bn) && s === Ds) {
      R = _n;
      var wA = w && k === K && K.visualViewport ? K.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        k[dA]
      );
      Q -= wA - n.width, Q *= f ? 1 : -1;
    }
  }
  var EA = Object.assign({
    position: c
  }, p && qO), NA = B === !0 ? zO({
    x: Q,
    y: U
  }, fn(t)) : {
    x: Q,
    y: U
  };
  if (Q = NA.x, U = NA.y, f) {
    var xA;
    return Object.assign({}, EA, (xA = {}, xA[x] = D ? "0" : "", xA[R] = E ? "0" : "", xA.transform = (K.devicePixelRatio || 1) <= 1 ? "translate(" + Q + "px, " + U + "px)" : "translate3d(" + Q + "px, " + U + "px, 0)", xA));
  }
  return Object.assign({}, EA, (e = {}, e[x] = D ? U + "px" : "", e[R] = E ? Q + "px" : "", e.transform = "", e));
}
function JO(A) {
  var e = A.state, t = A.options, n = t.gpuAcceleration, i = n === void 0 ? !0 : n, s = t.adaptive, l = s === void 0 ? !0 : s, c = t.roundOffsets, f = c === void 0 ? !0 : c, p = {
    placement: hr(e.placement),
    variation: ho(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, Rw(Object.assign({}, p, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: l,
    roundOffsets: f
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, Rw(Object.assign({}, p, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: f
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const jO = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: JO,
  data: {}
};
var pl = {
  passive: !0
};
function YO(A) {
  var e = A.state, t = A.instance, n = A.options, i = n.scroll, s = i === void 0 ? !0 : i, l = n.resize, c = l === void 0 ? !0 : l, f = fn(e.elements.popper), p = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return s && p.forEach(function(B) {
    B.addEventListener("scroll", t.update, pl);
  }), c && f.addEventListener("resize", t.update, pl), function() {
    s && p.forEach(function(B) {
      B.removeEventListener("scroll", t.update, pl);
    }), c && f.removeEventListener("resize", t.update, pl);
  };
}
const ZO = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: YO,
  data: {}
};
var A4 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function jl(A) {
  return A.replace(/left|right|bottom|top/g, function(e) {
    return A4[e];
  });
}
var e4 = {
  start: "end",
  end: "start"
};
function $w(A) {
  return A.replace(/start|end/g, function(e) {
    return e4[e];
  });
}
function Xp(A) {
  var e = fn(A), t = e.pageXOffset, n = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: n
  };
}
function qp(A) {
  return fo(_i(A)).left + Xp(A).scrollLeft;
}
function t4(A, e) {
  var t = fn(A), n = _i(A), i = t.visualViewport, s = n.clientWidth, l = n.clientHeight, c = 0, f = 0;
  if (i) {
    s = i.width, l = i.height;
    var p = O0();
    (p || !p && e === "fixed") && (c = i.offsetLeft, f = i.offsetTop);
  }
  return {
    width: s,
    height: l,
    x: c + qp(A),
    y: f
  };
}
function n4(A) {
  var e, t = _i(A), n = Xp(A), i = (e = A.ownerDocument) == null ? void 0 : e.body, s = na(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), l = na(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), c = -n.scrollLeft + qp(A), f = -n.scrollTop;
  return Xr(i || t).direction === "rtl" && (c += na(t.clientWidth, i ? i.clientWidth : 0) - s), {
    width: s,
    height: l,
    x: c,
    y: f
  };
}
function zp(A) {
  var e = Xr(A), t = e.overflow, n = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + n);
}
function $0(A) {
  return ["html", "body", "#document"].indexOf(pr(A)) >= 0 ? A.ownerDocument.body : En(A) && zp(A) ? A : $0(Rc(A));
}
function Qs(A, e) {
  var t;
  e === void 0 && (e = []);
  var n = $0(A), i = n === ((t = A.ownerDocument) == null ? void 0 : t.body), s = fn(n), l = i ? [s].concat(s.visualViewport || [], zp(n) ? n : []) : n, c = e.concat(l);
  return i ? c : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    c.concat(Qs(Rc(l)))
  );
}
function ch(A) {
  return Object.assign({}, A, {
    left: A.x,
    top: A.y,
    right: A.x + A.width,
    bottom: A.y + A.height
  });
}
function r4(A, e) {
  var t = fo(A, !1, e === "fixed");
  return t.top = t.top + A.clientTop, t.left = t.left + A.clientLeft, t.bottom = t.top + A.clientHeight, t.right = t.left + A.clientWidth, t.width = A.clientWidth, t.height = A.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Pw(A, e, t) {
  return e === L0 ? ch(t4(A, t)) : la(e) ? r4(e, t) : ch(n4(_i(A)));
}
function i4(A) {
  var e = Qs(Rc(A)), t = ["absolute", "fixed"].indexOf(Xr(A).position) >= 0, n = t && En(A) ? qs(A) : A;
  return la(n) ? e.filter(function(i) {
    return la(i) && N0(i, n) && pr(i) !== "body";
  }) : [];
}
function a4(A, e, t, n) {
  var i = e === "clippingParents" ? i4(A) : [].concat(e), s = [].concat(i, [t]), l = s[0], c = s.reduce(function(f, p) {
    var B = Pw(A, p, n);
    return f.top = na(B.top, f.top), f.right = wc(B.right, f.right), f.bottom = wc(B.bottom, f.bottom), f.left = na(B.left, f.left), f;
  }, Pw(A, l, n));
  return c.width = c.right - c.left, c.height = c.bottom - c.top, c.x = c.left, c.y = c.top, c;
}
function P0(A) {
  var e = A.reference, t = A.element, n = A.placement, i = n ? hr(n) : null, s = n ? ho(n) : null, l = e.x + e.width / 2 - t.width / 2, c = e.y + e.height / 2 - t.height / 2, f;
  switch (i) {
    case nn:
      f = {
        x: l,
        y: e.y - t.height
      };
      break;
    case bn:
      f = {
        x: l,
        y: e.y + e.height
      };
      break;
    case _n:
      f = {
        x: e.x + e.width,
        y: c
      };
      break;
    case rn:
      f = {
        x: e.x - t.width,
        y: c
      };
      break;
    default:
      f = {
        x: e.x,
        y: e.y
      };
  }
  var p = i ? Wp(i) : null;
  if (p != null) {
    var B = p === "y" ? "height" : "width";
    switch (s) {
      case lo:
        f[p] = f[p] - (e[B] / 2 - t[B] / 2);
        break;
      case Ds:
        f[p] = f[p] + (e[B] / 2 - t[B] / 2);
        break;
    }
  }
  return f;
}
function Os(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = n === void 0 ? A.placement : n, s = t.strategy, l = s === void 0 ? A.strategy : s, c = t.boundary, f = c === void 0 ? bO : c, p = t.rootBoundary, B = p === void 0 ? L0 : p, w = t.elementContext, v = w === void 0 ? es : w, Q = t.altBoundary, u = Q === void 0 ? !1 : Q, U = t.padding, b = U === void 0 ? 0 : U, E = K0(typeof b != "number" ? b : R0(b, Xs)), D = v === es ? _O : es, R = A.rects.popper, x = A.elements[u ? D : v], K = a4(la(x) ? x : x.contextElement || _i(A.elements.popper), f, B, l), k = fo(A.elements.reference), Y = P0({
    reference: k,
    element: R,
    strategy: "absolute",
    placement: i
  }), dA = ch(Object.assign({}, R, Y)), cA = v === es ? dA : k, wA = {
    top: K.top - cA.top + E.top,
    bottom: cA.bottom - K.bottom + E.bottom,
    left: K.left - cA.left + E.left,
    right: cA.right - K.right + E.right
  }, EA = A.modifiersData.offset;
  if (v === es && EA) {
    var NA = EA[i];
    Object.keys(wA).forEach(function(xA) {
      var X = [_n, bn].indexOf(xA) >= 0 ? 1 : -1, CA = [nn, bn].indexOf(xA) >= 0 ? "y" : "x";
      wA[xA] += NA[CA] * X;
    });
  }
  return wA;
}
function o4(A, e) {
  e === void 0 && (e = {});
  var t = e, n = t.placement, i = t.boundary, s = t.rootBoundary, l = t.padding, c = t.flipVariations, f = t.allowedAutoPlacements, p = f === void 0 ? T0 : f, B = ho(n), w = B ? c ? Mw : Mw.filter(function(u) {
    return ho(u) === B;
  }) : Xs, v = w.filter(function(u) {
    return p.indexOf(u) >= 0;
  });
  v.length === 0 && (v = w);
  var Q = v.reduce(function(u, U) {
    return u[U] = Os(A, {
      placement: U,
      boundary: i,
      rootBoundary: s,
      padding: l
    })[hr(U)], u;
  }, {});
  return Object.keys(Q).sort(function(u, U) {
    return Q[u] - Q[U];
  });
}
function s4(A) {
  if (hr(A) === kp)
    return [];
  var e = jl(A);
  return [$w(A), e, $w(e)];
}
function u4(A) {
  var e = A.state, t = A.options, n = A.name;
  if (!e.modifiersData[n]._skip) {
    for (var i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, c = l === void 0 ? !0 : l, f = t.fallbackPlacements, p = t.padding, B = t.boundary, w = t.rootBoundary, v = t.altBoundary, Q = t.flipVariations, u = Q === void 0 ? !0 : Q, U = t.allowedAutoPlacements, b = e.options.placement, E = hr(b), D = E === b, R = f || (D || !u ? [jl(b)] : s4(b)), x = [b].concat(R).reduce(function(L, $) {
      return L.concat(hr($) === kp ? o4(e, {
        placement: $,
        boundary: B,
        rootBoundary: w,
        padding: p,
        flipVariations: u,
        allowedAutoPlacements: U
      }) : $);
    }, []), K = e.rects.reference, k = e.rects.popper, Y = /* @__PURE__ */ new Map(), dA = !0, cA = x[0], wA = 0; wA < x.length; wA++) {
      var EA = x[wA], NA = hr(EA), xA = ho(EA) === lo, X = [nn, bn].indexOf(NA) >= 0, CA = X ? "width" : "height", tA = Os(e, {
        placement: EA,
        boundary: B,
        rootBoundary: w,
        altBoundary: v,
        padding: p
      }), fA = X ? xA ? _n : rn : xA ? bn : nn;
      K[CA] > k[CA] && (fA = jl(fA));
      var _A = jl(fA), IA = [];
      if (s && IA.push(tA[NA] <= 0), c && IA.push(tA[fA] <= 0, tA[_A] <= 0), IA.every(function(L) {
        return L;
      })) {
        cA = EA, dA = !1;
        break;
      }
      Y.set(EA, IA);
    }
    if (dA)
      for (var aA = u ? 3 : 1, T = function($) {
        var rA = x.find(function(FA) {
          var UA = Y.get(FA);
          if (UA)
            return UA.slice(0, $).every(function(zA) {
              return zA;
            });
        });
        if (rA)
          return cA = rA, "break";
      }, eA = aA; eA > 0; eA--) {
        var J = T(eA);
        if (J === "break") break;
      }
    e.placement !== cA && (e.modifiersData[n]._skip = !0, e.placement = cA, e.reset = !0);
  }
}
const l4 = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: u4,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function kw(A, e, t) {
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
  return [nn, _n, bn, rn].some(function(e) {
    return A[e] >= 0;
  });
}
function c4(A) {
  var e = A.state, t = A.name, n = e.rects.reference, i = e.rects.popper, s = e.modifiersData.preventOverflow, l = Os(e, {
    elementContext: "reference"
  }), c = Os(e, {
    altBoundary: !0
  }), f = kw(l, n), p = kw(c, i, s), B = Gw(f), w = Gw(p);
  e.modifiersData[t] = {
    referenceClippingOffsets: f,
    popperEscapeOffsets: p,
    isReferenceHidden: B,
    hasPopperEscaped: w
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": B,
    "data-popper-escaped": w
  });
}
const f4 = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: c4
};
function d4(A, e, t) {
  var n = hr(A), i = [rn, nn].indexOf(n) >= 0 ? -1 : 1, s = typeof t == "function" ? t(Object.assign({}, e, {
    placement: A
  })) : t, l = s[0], c = s[1];
  return l = l || 0, c = (c || 0) * i, [rn, _n].indexOf(n) >= 0 ? {
    x: c,
    y: l
  } : {
    x: l,
    y: c
  };
}
function h4(A) {
  var e = A.state, t = A.options, n = A.name, i = t.offset, s = i === void 0 ? [0, 0] : i, l = T0.reduce(function(B, w) {
    return B[w] = d4(w, e.rects, s), B;
  }, {}), c = l[e.placement], f = c.x, p = c.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += f, e.modifiersData.popperOffsets.y += p), e.modifiersData[n] = l;
}
const p4 = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: h4
};
function g4(A) {
  var e = A.state, t = A.name;
  e.modifiersData[t] = P0({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const B4 = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: g4,
  data: {}
};
function w4(A) {
  return A === "x" ? "y" : "x";
}
function m4(A) {
  var e = A.state, t = A.options, n = A.name, i = t.mainAxis, s = i === void 0 ? !0 : i, l = t.altAxis, c = l === void 0 ? !1 : l, f = t.boundary, p = t.rootBoundary, B = t.altBoundary, w = t.padding, v = t.tether, Q = v === void 0 ? !0 : v, u = t.tetherOffset, U = u === void 0 ? 0 : u, b = Os(e, {
    boundary: f,
    rootBoundary: p,
    padding: w,
    altBoundary: B
  }), E = hr(e.placement), D = ho(e.placement), R = !D, x = Wp(E), K = w4(x), k = e.modifiersData.popperOffsets, Y = e.rects.reference, dA = e.rects.popper, cA = typeof U == "function" ? U(Object.assign({}, e.rects, {
    placement: e.placement
  })) : U, wA = typeof cA == "number" ? {
    mainAxis: cA,
    altAxis: cA
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, cA), EA = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, NA = {
    x: 0,
    y: 0
  };
  if (k) {
    if (s) {
      var xA, X = x === "y" ? nn : rn, CA = x === "y" ? bn : _n, tA = x === "y" ? "height" : "width", fA = k[x], _A = fA + b[X], IA = fA - b[CA], aA = Q ? -dA[tA] / 2 : 0, T = D === lo ? Y[tA] : dA[tA], eA = D === lo ? -dA[tA] : -Y[tA], J = e.elements.arrow, L = Q && J ? Vp(J) : {
        width: 0,
        height: 0
      }, $ = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : M0(), rA = $[X], FA = $[CA], UA = Cs(0, Y[tA], L[tA]), zA = R ? Y[tA] / 2 - aA - UA - rA - wA.mainAxis : T - UA - rA - wA.mainAxis, ne = R ? -Y[tA] / 2 + aA + UA + FA + wA.mainAxis : eA + UA + FA + wA.mainAxis, JA = e.elements.arrow && qs(e.elements.arrow), $A = JA ? x === "y" ? JA.clientTop || 0 : JA.clientLeft || 0 : 0, sA = (xA = EA == null ? void 0 : EA[x]) != null ? xA : 0, vA = fA + zA - sA - $A, bA = fA + ne - sA, te = Cs(Q ? wc(_A, vA) : _A, fA, Q ? na(IA, bA) : IA);
      k[x] = te, NA[x] = te - fA;
    }
    if (c) {
      var me, Ue = x === "x" ? nn : rn, Ze = x === "x" ? bn : _n, Te = k[K], ke = K === "y" ? "height" : "width", Ke = Te + b[Ue], _e = Te - b[Ze], Mt = [nn, rn].indexOf(E) !== -1, bt = (me = EA == null ? void 0 : EA[K]) != null ? me : 0, Kt = Mt ? Ke : Te - Y[ke] - dA[ke] - bt + wA.altAxis, _t = Mt ? Te + Y[ke] + dA[ke] - bt - wA.altAxis : _e, mt = Q && Mt ? kO(Kt, Te, _t) : Cs(Q ? Kt : Ke, Te, Q ? _t : _e);
      k[K] = mt, NA[K] = mt - Te;
    }
    e.modifiersData[n] = NA;
  }
}
const v4 = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: m4,
  requiresIfExists: ["offset"]
};
function y4(A) {
  return {
    scrollLeft: A.scrollLeft,
    scrollTop: A.scrollTop
  };
}
function C4(A) {
  return A === fn(A) || !En(A) ? Xp(A) : y4(A);
}
function Q4(A) {
  var e = A.getBoundingClientRect(), t = co(e.width) / A.offsetWidth || 1, n = co(e.height) / A.offsetHeight || 1;
  return t !== 1 || n !== 1;
}
function F4(A, e, t) {
  t === void 0 && (t = !1);
  var n = En(e), i = En(e) && Q4(e), s = _i(e), l = fo(A, i, t), c = {
    scrollLeft: 0,
    scrollTop: 0
  }, f = {
    x: 0,
    y: 0
  };
  return (n || !n && !t) && ((pr(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  zp(s)) && (c = C4(e)), En(e) ? (f = fo(e, !0), f.x += e.clientLeft, f.y += e.clientTop) : s && (f.x = qp(s))), {
    x: l.left + c.scrollLeft - f.x,
    y: l.top + c.scrollTop - f.y,
    width: l.width,
    height: l.height
  };
}
function U4(A) {
  var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), n = [];
  A.forEach(function(s) {
    e.set(s.name, s);
  });
  function i(s) {
    t.add(s.name);
    var l = [].concat(s.requires || [], s.requiresIfExists || []);
    l.forEach(function(c) {
      if (!t.has(c)) {
        var f = e.get(c);
        f && i(f);
      }
    }), n.push(s);
  }
  return A.forEach(function(s) {
    t.has(s.name) || i(s);
  }), n;
}
function E4(A) {
  var e = U4(A);
  return MO.reduce(function(t, n) {
    return t.concat(e.filter(function(i) {
      return i.phase === n;
    }));
  }, []);
}
function b4(A) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(A());
      });
    })), e;
  };
}
function _4(A) {
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
function x4(A) {
  A === void 0 && (A = {});
  var e = A, t = e.defaultModifiers, n = t === void 0 ? [] : t, i = e.defaultOptions, s = i === void 0 ? Vw : i;
  return function(c, f, p) {
    p === void 0 && (p = s);
    var B = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Vw, s),
      modifiersData: {},
      elements: {
        reference: c,
        popper: f
      },
      attributes: {},
      styles: {}
    }, w = [], v = !1, Q = {
      state: B,
      setOptions: function(E) {
        var D = typeof E == "function" ? E(B.options) : E;
        U(), B.options = Object.assign({}, s, B.options, D), B.scrollParents = {
          reference: la(c) ? Qs(c) : c.contextElement ? Qs(c.contextElement) : [],
          popper: Qs(f)
        };
        var R = E4(_4([].concat(n, B.options.modifiers)));
        return B.orderedModifiers = R.filter(function(x) {
          return x.enabled;
        }), u(), Q.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!v) {
          var E = B.elements, D = E.reference, R = E.popper;
          if (Ww(D, R)) {
            B.rects = {
              reference: F4(D, qs(R), B.options.strategy === "fixed"),
              popper: Vp(R)
            }, B.reset = !1, B.placement = B.options.placement, B.orderedModifiers.forEach(function(wA) {
              return B.modifiersData[wA.name] = Object.assign({}, wA.data);
            });
            for (var x = 0; x < B.orderedModifiers.length; x++) {
              if (B.reset === !0) {
                B.reset = !1, x = -1;
                continue;
              }
              var K = B.orderedModifiers[x], k = K.fn, Y = K.options, dA = Y === void 0 ? {} : Y, cA = K.name;
              typeof k == "function" && (B = k({
                state: B,
                options: dA,
                name: cA,
                instance: Q
              }) || B);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: b4(function() {
        return new Promise(function(b) {
          Q.forceUpdate(), b(B);
        });
      }),
      destroy: function() {
        U(), v = !0;
      }
    };
    if (!Ww(c, f))
      return Q;
    Q.setOptions(p).then(function(b) {
      !v && p.onFirstUpdate && p.onFirstUpdate(b);
    });
    function u() {
      B.orderedModifiers.forEach(function(b) {
        var E = b.name, D = b.options, R = D === void 0 ? {} : D, x = b.effect;
        if (typeof x == "function") {
          var K = x({
            state: B,
            name: E,
            instance: Q,
            options: R
          }), k = function() {
          };
          w.push(K || k);
        }
      });
    }
    function U() {
      w.forEach(function(b) {
        return b();
      }), w = [];
    }
    return Q;
  };
}
var I4 = [ZO, B4, jO, D0, p4, l4, v4, XO, f4], H4 = /* @__PURE__ */ x4({
  defaultModifiers: I4
}), S4 = "tippy-box", k0 = "tippy-content", L4 = "tippy-backdrop", G0 = "tippy-arrow", V0 = "tippy-svg-arrow", zi = {
  passive: !0,
  capture: !0
}, W0 = function() {
  return document.body;
};
function T4(A, e) {
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
function D4(A, e) {
  var t = Object.assign({}, A);
  return e.forEach(function(n) {
    delete t[n];
  }), t;
}
function O4(A) {
  return A.split(/\s+/).filter(Boolean);
}
function qa(A) {
  return [].concat(A);
}
function qw(A, e) {
  A.indexOf(e) === -1 && A.push(e);
}
function N4(A) {
  return A.filter(function(e, t) {
    return A.indexOf(e) === t;
  });
}
function M4(A) {
  return A.split("-")[0];
}
function mc(A) {
  return [].slice.call(A);
}
function zw(A) {
  return Object.keys(A).reduce(function(e, t) {
    return A[t] !== void 0 && (e[t] = A[t]), e;
  }, {});
}
function Fs() {
  return document.createElement("div");
}
function Ns(A) {
  return ["Element", "Fragment"].some(function(e) {
    return Jp(A, e);
  });
}
function K4(A) {
  return Jp(A, "NodeList");
}
function R4(A) {
  return Jp(A, "MouseEvent");
}
function $4(A) {
  return !!(A && A._tippy && A._tippy.reference === A);
}
function P4(A) {
  return Ns(A) ? [A] : K4(A) ? mc(A) : Array.isArray(A) ? A : mc(document.querySelectorAll(A));
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
function k4(A) {
  var e, t = qa(A), n = t[0];
  return n != null && (e = n.ownerDocument) != null && e.body ? n.ownerDocument : document;
}
function G4(A, e) {
  var t = e.clientX, n = e.clientY;
  return A.every(function(i) {
    var s = i.popperRect, l = i.popperState, c = i.props, f = c.interactiveBorder, p = M4(l.placement), B = l.modifiersData.offset;
    if (!B)
      return !0;
    var w = p === "bottom" ? B.top.y : 0, v = p === "top" ? B.bottom.y : 0, Q = p === "right" ? B.left.x : 0, u = p === "left" ? B.right.x : 0, U = s.top - n + w > f, b = n - s.bottom - v > f, E = s.left - t + Q > f, D = t - s.right - u > f;
    return U || b || E || D;
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
var ur = {
  isTouch: !1
}, Yw = 0;
function V4() {
  ur.isTouch || (ur.isTouch = !0, window.performance && document.addEventListener("mousemove", q0));
}
function q0() {
  var A = performance.now();
  A - Yw < 20 && (ur.isTouch = !1, document.removeEventListener("mousemove", q0)), Yw = A;
}
function W4() {
  var A = document.activeElement;
  if ($4(A)) {
    var e = A._tippy;
    A.blur && !e.state.isVisible && A.blur();
  }
}
function X4() {
  document.addEventListener("touchstart", V4, zi), window.addEventListener("blur", W4);
}
var q4 = typeof window < "u" && typeof document < "u", z4 = q4 ? (
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
function J4(A) {
  return Zw(`
  %ctippy.js

  %c` + Zw(A) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function z0(A) {
  return [
    J4(A),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var Ms;
process.env.NODE_ENV !== "production" && j4();
function j4() {
  Ms = /* @__PURE__ */ new Set();
}
function Rr(A, e) {
  if (A && !Ms.has(e)) {
    var t;
    Ms.add(e), (t = console).warn.apply(t, z0(e));
  }
}
function fh(A, e) {
  if (A && !Ms.has(e)) {
    var t;
    Ms.add(e), (t = console).error.apply(t, z0(e));
  }
}
function Y4(A) {
  var e = !A, t = Object.prototype.toString.call(A) === "[object Object]" && !A.addEventListener;
  fh(e, ["tippy() was passed", "`" + String(A) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), fh(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var J0 = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, Z4 = {
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
}, J0, Z4), AN = Object.keys(cn), eN = function(e) {
  process.env.NODE_ENV !== "production" && Y0(e, []);
  var t = Object.keys(e);
  t.forEach(function(n) {
    cn[n] = e[n];
  });
};
function j0(A) {
  var e = A.plugins || [], t = e.reduce(function(n, i) {
    var s = i.name, l = i.defaultValue;
    if (s) {
      var c;
      n[s] = A[s] !== void 0 ? A[s] : (c = cn[s]) != null ? c : l;
    }
    return n;
  }, {});
  return Object.assign({}, A, t);
}
function tN(A, e) {
  var t = e ? Object.keys(j0(Object.assign({}, cn, {
    plugins: e
  }))) : AN, n = t.reduce(function(i, s) {
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
function Am(A, e) {
  var t = Object.assign({}, e, {
    content: X0(e.content, [A])
  }, e.ignoreAttributes ? {} : tN(A, e.plugins));
  return t.aria = Object.assign({}, cn.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function Y0(A, e) {
  A === void 0 && (A = {}), e === void 0 && (e = []);
  var t = Object.keys(A);
  t.forEach(function(n) {
    var i = D4(cn, Object.keys(J0)), s = !T4(i, n);
    s && (s = e.filter(function(l) {
      return l.name === n;
    }).length === 0), Rr(s, ["`" + n + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var nN = function() {
  return "innerHTML";
};
function dh(A, e) {
  A[nN()] = e;
}
function em(A) {
  var e = Fs();
  return A === !0 ? e.className = G0 : (e.className = V0, Ns(A) ? e.appendChild(A) : dh(e, A)), e;
}
function tm(A, e) {
  Ns(e.content) ? (dh(A, ""), A.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? dh(A, e.content) : A.textContent = e.content);
}
function hh(A) {
  var e = A.firstElementChild, t = mc(e.children);
  return {
    box: e,
    content: t.find(function(n) {
      return n.classList.contains(k0);
    }),
    arrow: t.find(function(n) {
      return n.classList.contains(G0) || n.classList.contains(V0);
    }),
    backdrop: t.find(function(n) {
      return n.classList.contains(L4);
    })
  };
}
function Z0(A) {
  var e = Fs(), t = Fs();
  t.className = S4, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var n = Fs();
  n.className = k0, n.setAttribute("data-state", "hidden"), tm(n, A.props), e.appendChild(t), t.appendChild(n), i(A.props, A.props);
  function i(s, l) {
    var c = hh(e), f = c.box, p = c.content, B = c.arrow;
    l.theme ? f.setAttribute("data-theme", l.theme) : f.removeAttribute("data-theme"), typeof l.animation == "string" ? f.setAttribute("data-animation", l.animation) : f.removeAttribute("data-animation"), l.inertia ? f.setAttribute("data-inertia", "") : f.removeAttribute("data-inertia"), f.style.maxWidth = typeof l.maxWidth == "number" ? l.maxWidth + "px" : l.maxWidth, l.role ? f.setAttribute("role", l.role) : f.removeAttribute("role"), (s.content !== l.content || s.allowHTML !== l.allowHTML) && tm(p, A.props), l.arrow ? B ? s.arrow !== l.arrow && (f.removeChild(B), f.appendChild(em(l.arrow))) : f.appendChild(em(l.arrow)) : B && f.removeChild(B);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
Z0.$$tippy = !0;
var rN = 1, gl = [], Cd = [];
function iN(A, e) {
  var t = Am(A, Object.assign({}, cn, j0(zw(e)))), n, i, s, l = !1, c = !1, f = !1, p = !1, B, w, v, Q = [], u = Xw(vA, t.interactiveDebounce), U, b = rN++, E = null, D = N4(t.plugins), R = {
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
    id: b,
    reference: A,
    popper: Fs(),
    popperInstance: E,
    props: t,
    state: R,
    plugins: D,
    // methods
    clearDelayTimeouts: Kt,
    setProps: _t,
    setContent: mt,
    show: dn,
    hide: vr,
    hideWithInteractivity: xi,
    enable: Mt,
    disable: bt,
    unmount: zr,
    destroy: Jr
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && fh(!0, "render() function has not been supplied."), x;
  var K = t.render(x), k = K.popper, Y = K.onUpdate;
  k.setAttribute("data-tippy-root", ""), k.id = "tippy-" + x.id, x.popper = k, A._tippy = x, k._tippy = x;
  var dA = D.map(function(lA) {
    return lA.fn(x);
  }), cA = A.hasAttribute("aria-expanded");
  return JA(), aA(), fA(), _A("onCreate", [x]), t.showOnCreate && Ke(), k.addEventListener("mouseenter", function() {
    x.props.interactive && x.state.isVisible && x.clearDelayTimeouts();
  }), k.addEventListener("mouseleave", function() {
    x.props.interactive && x.props.trigger.indexOf("mouseenter") >= 0 && X().addEventListener("mousemove", u);
  }), x;
  function wA() {
    var lA = x.props.touch;
    return Array.isArray(lA) ? lA : [lA, 0];
  }
  function EA() {
    return wA()[0] === "hold";
  }
  function NA() {
    var lA;
    return !!((lA = x.props.render) != null && lA.$$tippy);
  }
  function xA() {
    return U || A;
  }
  function X() {
    var lA = xA().parentNode;
    return lA ? k4(lA) : document;
  }
  function CA() {
    return hh(k);
  }
  function tA(lA) {
    return x.state.isMounted && !x.state.isVisible || ur.isTouch || B && B.type === "focus" ? 0 : md(x.props.delay, lA ? 0 : 1, cn.delay);
  }
  function fA(lA) {
    lA === void 0 && (lA = !1), k.style.pointerEvents = x.props.interactive && !lA ? "" : "none", k.style.zIndex = "" + x.props.zIndex;
  }
  function _A(lA, DA, XA) {
    if (XA === void 0 && (XA = !0), dA.forEach(function(ye) {
      ye[lA] && ye[lA].apply(ye, DA);
    }), XA) {
      var ve;
      (ve = x.props)[lA].apply(ve, DA);
    }
  }
  function IA() {
    var lA = x.props.aria;
    if (lA.content) {
      var DA = "aria-" + lA.content, XA = k.id, ve = qa(x.props.triggerTarget || A);
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
    if (!(cA || !x.props.aria.expanded)) {
      var lA = qa(x.props.triggerTarget || A);
      lA.forEach(function(DA) {
        x.props.interactive ? DA.setAttribute("aria-expanded", x.state.isVisible && DA === xA() ? "true" : "false") : DA.removeAttribute("aria-expanded");
      });
    }
  }
  function T() {
    X().removeEventListener("mousemove", u), gl = gl.filter(function(lA) {
      return lA !== u;
    });
  }
  function eA(lA) {
    if (!(ur.isTouch && (f || lA.type === "mousedown"))) {
      var DA = lA.composedPath && lA.composedPath()[0] || lA.target;
      if (!(x.props.interactive && jw(k, DA))) {
        if (qa(x.props.triggerTarget || A).some(function(XA) {
          return jw(XA, DA);
        })) {
          if (ur.isTouch || x.state.isVisible && x.props.trigger.indexOf("click") >= 0)
            return;
        } else
          _A("onClickOutside", [x, lA]);
        x.props.hideOnClick === !0 && (x.clearDelayTimeouts(), x.hide(), c = !0, setTimeout(function() {
          c = !1;
        }), x.state.isMounted || rA());
      }
    }
  }
  function J() {
    f = !0;
  }
  function L() {
    f = !1;
  }
  function $() {
    var lA = X();
    lA.addEventListener("mousedown", eA, !0), lA.addEventListener("touchend", eA, zi), lA.addEventListener("touchstart", L, zi), lA.addEventListener("touchmove", J, zi);
  }
  function rA() {
    var lA = X();
    lA.removeEventListener("mousedown", eA, !0), lA.removeEventListener("touchend", eA, zi), lA.removeEventListener("touchstart", L, zi), lA.removeEventListener("touchmove", J, zi);
  }
  function FA(lA, DA) {
    zA(lA, function() {
      !x.state.isVisible && k.parentNode && k.parentNode.contains(k) && DA();
    });
  }
  function UA(lA, DA) {
    zA(lA, DA);
  }
  function zA(lA, DA) {
    var XA = CA().box;
    function ve(ye) {
      ye.target === XA && (yd(XA, "remove", ve), DA());
    }
    if (lA === 0)
      return DA();
    yd(XA, "remove", w), yd(XA, "add", ve), w = ve;
  }
  function ne(lA, DA, XA) {
    XA === void 0 && (XA = !1);
    var ve = qa(x.props.triggerTarget || A);
    ve.forEach(function(ye) {
      ye.addEventListener(lA, DA, XA), Q.push({
        node: ye,
        eventType: lA,
        handler: DA,
        options: XA
      });
    });
  }
  function JA() {
    EA() && (ne("touchstart", sA, {
      passive: !0
    }), ne("touchend", bA, {
      passive: !0
    })), O4(x.props.trigger).forEach(function(lA) {
      if (lA !== "manual")
        switch (ne(lA, sA), lA) {
          case "mouseenter":
            ne("mouseleave", bA);
            break;
          case "focus":
            ne(z4 ? "focusout" : "blur", te);
            break;
          case "focusin":
            ne("focusout", te);
            break;
        }
    });
  }
  function $A() {
    Q.forEach(function(lA) {
      var DA = lA.node, XA = lA.eventType, ve = lA.handler, ye = lA.options;
      DA.removeEventListener(XA, ve, ye);
    }), Q = [];
  }
  function sA(lA) {
    var DA, XA = !1;
    if (!(!x.state.isEnabled || me(lA) || c)) {
      var ve = ((DA = B) == null ? void 0 : DA.type) === "focus";
      B = lA, U = lA.currentTarget, aA(), !x.state.isVisible && R4(lA) && gl.forEach(function(ye) {
        return ye(lA);
      }), lA.type === "click" && (x.props.trigger.indexOf("mouseenter") < 0 || l) && x.props.hideOnClick !== !1 && x.state.isVisible ? XA = !0 : Ke(lA), lA.type === "click" && (l = !XA), XA && !ve && _e(lA);
    }
  }
  function vA(lA) {
    var DA = lA.target, XA = xA().contains(DA) || k.contains(DA);
    if (!(lA.type === "mousemove" && XA)) {
      var ve = ke().concat(k).map(function(ye) {
        var ut, xt = ye._tippy, xn = (ut = xt.popperInstance) == null ? void 0 : ut.state;
        return xn ? {
          popperRect: ye.getBoundingClientRect(),
          popperState: xn,
          props: t
        } : null;
      }).filter(Boolean);
      G4(ve, lA) && (T(), _e(lA));
    }
  }
  function bA(lA) {
    var DA = me(lA) || x.props.trigger.indexOf("click") >= 0 && l;
    if (!DA) {
      if (x.props.interactive) {
        x.hideWithInteractivity(lA);
        return;
      }
      _e(lA);
    }
  }
  function te(lA) {
    x.props.trigger.indexOf("focusin") < 0 && lA.target !== xA() || x.props.interactive && lA.relatedTarget && k.contains(lA.relatedTarget) || _e(lA);
  }
  function me(lA) {
    return ur.isTouch ? EA() !== lA.type.indexOf("touch") >= 0 : !1;
  }
  function Ue() {
    Ze();
    var lA = x.props, DA = lA.popperOptions, XA = lA.placement, ve = lA.offset, ye = lA.getReferenceClientRect, ut = lA.moveTransition, xt = NA() ? hh(k).arrow : null, xn = ye ? {
      getBoundingClientRect: ye,
      contextElement: ye.contextElement || xA()
    } : A, Ii = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(jr) {
        var hn = jr.state;
        if (NA()) {
          var Si = CA(), Yr = Si.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(yr) {
            yr === "placement" ? Yr.setAttribute("data-placement", hn.placement) : hn.attributes.popper["data-popper-" + yr] ? Yr.setAttribute("data-" + yr, "") : Yr.removeAttribute("data-" + yr);
          }), hn.attributes.popper = {};
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
    }), In.push.apply(In, (DA == null ? void 0 : DA.modifiers) || []), x.popperInstance = H4(xn, k, Object.assign({}, DA, {
      placement: XA,
      onFirstUpdate: v,
      modifiers: In
    }));
  }
  function Ze() {
    x.popperInstance && (x.popperInstance.destroy(), x.popperInstance = null);
  }
  function Te() {
    var lA = x.props.appendTo, DA, XA = xA();
    x.props.interactive && lA === W0 || lA === "parent" ? DA = XA.parentNode : DA = X0(lA, [XA]), DA.contains(k) || DA.appendChild(k), x.state.isMounted = !0, Ue(), process.env.NODE_ENV !== "production" && Rr(x.props.interactive && lA === cn.appendTo && XA.nextElementSibling !== k, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function ke() {
    return mc(k.querySelectorAll("[data-tippy-root]"));
  }
  function Ke(lA) {
    x.clearDelayTimeouts(), lA && _A("onTrigger", [x, lA]), $();
    var DA = tA(!0), XA = wA(), ve = XA[0], ye = XA[1];
    ur.isTouch && ve === "hold" && ye && (DA = ye), DA ? n = setTimeout(function() {
      x.show();
    }, DA) : x.show();
  }
  function _e(lA) {
    if (x.clearDelayTimeouts(), _A("onUntrigger", [x, lA]), !x.state.isVisible) {
      rA();
      return;
    }
    if (!(x.props.trigger.indexOf("mouseenter") >= 0 && x.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(lA.type) >= 0 && l)) {
      var DA = tA(!1);
      DA ? i = setTimeout(function() {
        x.state.isVisible && x.hide();
      }, DA) : s = requestAnimationFrame(function() {
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
  function Kt() {
    clearTimeout(n), clearTimeout(i), cancelAnimationFrame(s);
  }
  function _t(lA) {
    if (process.env.NODE_ENV !== "production" && Rr(x.state.isDestroyed, Ma("setProps")), !x.state.isDestroyed) {
      _A("onBeforeUpdate", [x, lA]), $A();
      var DA = x.props, XA = Am(A, Object.assign({}, DA, zw(lA), {
        ignoreAttributes: !0
      }));
      x.props = XA, JA(), DA.interactiveDebounce !== XA.interactiveDebounce && (T(), u = Xw(vA, XA.interactiveDebounce)), DA.triggerTarget && !XA.triggerTarget ? qa(DA.triggerTarget).forEach(function(ve) {
        ve.removeAttribute("aria-expanded");
      }) : XA.triggerTarget && A.removeAttribute("aria-expanded"), aA(), fA(), Y && Y(DA, XA), x.popperInstance && (Ue(), ke().forEach(function(ve) {
        requestAnimationFrame(ve._tippy.popperInstance.forceUpdate);
      })), _A("onAfterUpdate", [x, lA]);
    }
  }
  function mt(lA) {
    x.setProps({
      content: lA
    });
  }
  function dn() {
    process.env.NODE_ENV !== "production" && Rr(x.state.isDestroyed, Ma("show"));
    var lA = x.state.isVisible, DA = x.state.isDestroyed, XA = !x.state.isEnabled, ve = ur.isTouch && !x.props.touch, ye = md(x.props.duration, 0, cn.duration);
    if (!(lA || DA || XA || ve) && !xA().hasAttribute("disabled") && (_A("onShow", [x], !1), x.props.onShow(x) !== !1)) {
      if (x.state.isVisible = !0, NA() && (k.style.visibility = "visible"), fA(), $(), x.state.isMounted || (k.style.transition = "none"), NA()) {
        var ut = CA(), xt = ut.box, xn = ut.content;
        vd([xt, xn], 0);
      }
      v = function() {
        var In;
        if (!(!x.state.isVisible || p)) {
          if (p = !0, k.offsetHeight, k.style.transition = x.props.moveTransition, NA() && x.props.animation) {
            var Hi = CA(), jr = Hi.box, hn = Hi.content;
            vd([jr, hn], ye), Jw([jr, hn], "visible");
          }
          IA(), aA(), qw(Cd, x), (In = x.popperInstance) == null || In.forceUpdate(), _A("onMount", [x]), x.props.animation && NA() && UA(ye, function() {
            x.state.isShown = !0, _A("onShown", [x]);
          });
        }
      }, Te();
    }
  }
  function vr() {
    process.env.NODE_ENV !== "production" && Rr(x.state.isDestroyed, Ma("hide"));
    var lA = !x.state.isVisible, DA = x.state.isDestroyed, XA = !x.state.isEnabled, ve = md(x.props.duration, 1, cn.duration);
    if (!(lA || DA || XA) && (_A("onHide", [x], !1), x.props.onHide(x) !== !1)) {
      if (x.state.isVisible = !1, x.state.isShown = !1, p = !1, l = !1, NA() && (k.style.visibility = "hidden"), T(), rA(), fA(!0), NA()) {
        var ye = CA(), ut = ye.box, xt = ye.content;
        x.props.animation && (vd([ut, xt], ve), Jw([ut, xt], "hidden"));
      }
      IA(), aA(), x.props.animation ? NA() && FA(ve, x.unmount) : x.unmount();
    }
  }
  function xi(lA) {
    process.env.NODE_ENV !== "production" && Rr(x.state.isDestroyed, Ma("hideWithInteractivity")), X().addEventListener("mousemove", u), qw(gl, u), u(lA);
  }
  function zr() {
    process.env.NODE_ENV !== "production" && Rr(x.state.isDestroyed, Ma("unmount")), x.state.isVisible && x.hide(), x.state.isMounted && (Ze(), ke().forEach(function(lA) {
      lA._tippy.unmount();
    }), k.parentNode && k.parentNode.removeChild(k), Cd = Cd.filter(function(lA) {
      return lA !== x;
    }), x.state.isMounted = !1, _A("onHidden", [x]));
  }
  function Jr() {
    process.env.NODE_ENV !== "production" && Rr(x.state.isDestroyed, Ma("destroy")), !x.state.isDestroyed && (x.clearDelayTimeouts(), x.unmount(), $A(), delete A._tippy, x.state.isDestroyed = !0, _A("onDestroy", [x]));
  }
}
function zs(A, e) {
  e === void 0 && (e = {});
  var t = cn.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (Y4(A), Y0(e, t)), X4();
  var n = Object.assign({}, e, {
    plugins: t
  }), i = P4(A);
  if (process.env.NODE_ENV !== "production") {
    var s = Ns(n.content), l = i.length > 1;
    Rr(s && l, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var c = i.reduce(function(f, p) {
    var B = p && iN(p, n);
    return B && f.push(B), f;
  }, []);
  return Ns(A) ? c[0] : c;
}
zs.defaultProps = cn;
zs.setDefaultProps = eN;
zs.currentInput = ur;
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
zs.setDefaultProps({
  render: Z0
});
const aN = "_btn_pqsxd_1", oN = "_btnGroup_pqsxd_4", Bl = {
  btn: aN,
  btnGroup: oN
}, sN = function(A) {
  var e = {
    onAnnotationSelectFunction: oe.noop(),
    drawing: null,
    popoverId: ""
  }, t = Le.merge({}, e, A), n = {
    show: function(f) {
      f.visible = !0;
    },
    hide: function(f) {
      f.visible = !1, f.hidden = !0;
    },
    auto: function(f) {
      f.visible = !1, f.hidden = !1;
    }
  }, i = function(f, p) {
    f.select("span.genelabel").text(function(v) {
      return v.label;
    }).style("font-weight", function(v) {
      return v.selected ? "bold" : "normal";
    }).style("opacity", function(v) {
      return v.visible || v.selected ? 1 : v.normedScore ? v.normedScore : v.importance;
    }).style("color", function(v) {
      return p.visible || p.selected ? p.color : null;
    });
    var B = f.select("div.btn-group");
    B.selectAll("a").data(["show", "hide", "auto"]).classed("disabled", function(v) {
      return v == "show" && p.visible || v == "hide" && p.hidden && !p.visible || v == "auto" && !p.hidden && !p.visible;
    });
  }, s = function(f, p, B) {
    var w = B.data.genesList, v = p.selectAll("p").data(w);
    f.append("span").text("Cluster"), f.append("div.btn-group").selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(b) {
      return b;
    }).classed(`${Bl.btn}`, !0)``.on("click", function(b) {
      var E = n[b];
      w.forEach(E), v.each(function(D) {
        var R = WA(this);
        i(R, D);
      }), t.onAnnotationSelectFunction();
    });
    var u = v.enter(), U = u.append("p");
    U.append("span").classed("genelabel", !0), U.append("div").classed("btn-group", !0), v.each(function(b) {
      var E = WA(this), D = E.select("div.btn-group");
      D.selectAll("a").data(["show", "hide", "auto"]).enter().append("a").attr("href", "#").text(function(x) {
        return x;
      }).classed(`${Bl.btn}`, !0).on("click", function(x) {
        var K = n[x];
        K(b), t.onAnnotationSelectFunction(), i(E, b);
      });
    }), v.each(function(b) {
      var E = WA(this);
      i(E, b);
    });
  }, l = function(f, p, B) {
    var w = B.data;
    f.append("a").attr("href", w.link).text(w.label), p.append("p").text(
      "Chromosome " + w.chromosome + ": " + w.start + "-" + w.end
    ), w.score && p.append("p").text("Score: " + parseFloat(w.score).toFixed(3)), p.append("hr");
    var v = p.append("p").style("float", "right").classed(Bl.btnGroup, !0), Q = function() {
      let u = v.selectAll("a").data(["show", "hide", "auto"]);
      u.enter().append("a").attr("href", "#").text(function(U) {
        return U;
      }).classed(`${Bl.btn}`, !0).on("click", function(U) {
        var b = n[U];
        b(w), t.onAnnotationSelectFunction(), Q();
      }), u.classed("disabled", function(U) {
        return U == "show" && w.visible || U == "hide" && w.hidden && !w.visible || U == "auto" && !w.hidden && !w.visible;
      });
    };
    Q();
  }, c = {};
  return c.geneAnnotationsPopoverFunction = function(f, p) {
    var B = f.data.type == "geneslist";
    WA(t.popoverId).attr("class", "popover");
    let w = WA(t.popoverId).select(".popover-title"), v = WA(t.popoverId).select(".popover-content");
    w.selectAll("*").remove(), w.text(""), v.selectAll("*").remove(), v.text(""), B ? s(w, v, f) : l(w, v, f);
    var Q = p.target;
    oe(".gene-annotation-popover").remove(), zs(Q, {
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
    }), Q._tippy.show(), oe(document).on("click", function(u) {
      oe(u.target).closest(
        '.gene-annotation-popover, [data-toggle="popover"]'
      ).length || oe(".gene-annotation-popover").remove();
    }), oe(t.popoverId).on("mousedown mousewheel", function(u) {
      u.stopPropagation();
    });
  }, c;
}, uN = function(A) {
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
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(f, p) {
    Le.pick(t, ["onAnnotationSelectFunction", "drawing"]), t.popoverId = "#clusterPopover", n = sN(t);
    var B = i(), w = f.selectAll("g.gene-annotation").data(p.layout.annotationNodes, function(U) {
      return U.data.id;
    }), v = w.enter().append("g").classed("gene-annotation", !0);
    v.append("line").classed("midpoint-line", !0), v.append("path").classed("link", !0).attr("d", function(U) {
      return U.data.path;
    }), t.labelRectangles && v.append("rect").classed("labella", !0), v.append("text").attr("x", function(U) {
      return U.x + 0.1 * t.annotationLabelSize;
    }).attr("y", function(U) {
      return U.y + 0.4 * t.annotationLabelSize;
    }), f.selectAll("g.gene-annotation").attr("id", function(U) {
      return "feature_" + U.data.id;
    }).attr("data-bs-toggle", "popover").attr("data-bs-trigger", "hover").attr("data-bs-html", "true"), f.selectAll("g.gene-annotation").classed("selected", function(U) {
      return U.data.selected;
    }), f.selectAll("g.gene-annotation").select("line.midpoint-line").attr("x1", -(t.chromosomeWidth * 0.5)).attr("y1", function(U) {
      return B(U.data.midpoint);
    }).attr("y2", function(U) {
      return B(U.data.midpoint);
    }).attr("x2", 0), f.selectAll("g.gene-annotation").select("text").text(function(U) {
      if (U.data.type == "gene")
        return U.data.label;
      if (U.data.type == "geneslist")
        return "(" + U.data.genesList.length + ")";
    }), t.labelRectangles && f.selectAll("g.gene-annotation").select("rect.labella").attr("fill", "pink").attr("stroke", "none").attr("x", function(U) {
      return U.x;
    }).attr("y", function(U) {
      return U.y - U.dy / 2;
    }).attr("width", function(U) {
      return U.dx;
    }).attr("height", function(U) {
      return U.dy;
    });
    var Q = "0.5";
    f.selectAll("g.gene-annotation").select("path.link").style("opacity", function(U) {
      return U.data.visible || U.data.selected ? 1 : U.data.normedScore ? U.data.normedScore : U.data.importance;
    }).style("stroke-width", function(U) {
      return Q;
    }).style("stroke", function(U) {
      return U.data.visible || U.data.selected ? U.data.color : "gray";
    }), f.selectAll("g.gene-annotation").select("text").style("font-size", function(U) {
      return (U.data.selected ? 0.2 : 0) + U.data.fontSize + "px";
    }).style("font-weight", function(U) {
      return U.data.selected ? "bold" : "normal";
    }).style("fill", function(U) {
      return U.data.selected ? U.data.color : null;
    }), f.selectAll("g.gene-annotation").select("text").transition().duration(300).attr("x", function(U) {
      return U.x + 0.1 * t.annotationLabelSize;
    }).attr("y", function(U) {
      return U.y + 0.4 * t.annotationLabelSize;
    }), f.selectAll("g.gene-annotation").select("path.link").transition().duration(300).attr("d", function(U) {
      return U.data.path;
    }), f.selectAll("g.gene-annotation").on("click", function(U, b) {
      b.data.type == "gene" && (b.data.selected = !b.data.selected, b.data.selected && (b.data.visible = !0), t.onAnnotationSelectFunction()), b.data.type == "geneslist" && t.onExpandClusterFunction(p, b.data);
    }), f.selectAll("g.gene-annotation").on("contextmenu", function(U, b) {
      n.geneAnnotationsPopoverFunction(b, U);
    });
    var u = f.selectAll("g.gene-annotation").exit();
    u.remove();
  }, l = function(f) {
    f.select("rect.border").empty() && f.append("rect").classed("border", !0), f.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  };
  function c(f) {
    f.each(function(p) {
      var B = WA(this).selectAll(".gene-annotations").data([p]);
      B.enter().append("g").attr("class", "gene-annotations"), B.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ).attr("id", function(w) {
        return "annotation_" + w.number;
      }), s(B, p), B.exit().remove(), t.border && l(B);
    });
  }
  return c.onAnnotationSelectFunction = function(f) {
    return arguments.length ? (t.onAnnotationSelectFunction = f, c) : t.onAnnotationSelectFunction;
  }, c.onExpandClusterFunction = function(f) {
    return arguments.length ? (t.onExpandClusterFunction = f, c) : t.onExpandClusterFunction;
  }, c.layout = function(f) {
    return arguments.length ? (t.layout = f, c) : t.layout;
  }, c.drawing = function(f) {
    return arguments.length ? (t.drawing = f, c) : t.drawing;
  }, c.scale = function(f) {
    return arguments.length ? (t.scale = f, c) : t.scale;
  }, c.longestChromosome = function(f) {
    return arguments.length ? (t.longestChromosome = f, c) : t.longestChromosome;
  }, c.chromosomeWidth = function(f) {
    return arguments.length ? (t.chromosomeWidth = f, c) : t.chromosomeWidth;
  }, c.annotationLabelSize = function(f) {
    return arguments.length ? (t.annotationLabelSize = f, c) : t.annotationLabelSize;
  }, c.annotationMarkerSize = function(f) {
    return arguments.length ? (t.annotationMarkerSize = f, c) : t.annotationMarkerSize;
  }, c;
}, lN = function(A) {
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
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(p, B, w, v) {
    var Q = {};
    v.map(function(K, k) {
      Q[K] = k;
    });
    var u = n(), U = p.selectAll("rect.snp-annotation").data(w, function(K) {
      return K.id;
    }), b = 4, E = function(K) {
      return t.layout.width - 0.2 * t.layout.chromosomeWidth * (1 + Q[K.trait]);
    }, D = function(K) {
      return u(K.midpoint) - 0.5 * Math.max(b / t.scale, u(10));
    }, R = Math.max(b / t.scale, u(10)), x = 0.2 * t.layout.chromosomeWidth;
    U.attr("x", E).attr("y", D).attr("width", x).attr("height", R), U.enter().append("rect").attr("fill", function(K) {
      return K.color;
    }).attr("opacity", function(K) {
      return K.importance;
    }).attr("class", "snp-annotation").attr("x", E).attr("y", D).attr("width", x).attr("height", R), U.exit().remove(), U.on("contextmenu", function(K) {
    });
  }, s = function(p, B, w) {
    var v = 500, Q = n();
    t.layout.width;
    var u = 0.3 * t.layout.chromosomeWidth, U = 0.4 * t.layout.chromosomeWidth, b = B.layout.qtlNodes.some(function(T) {
      return T.displayLabel;
    });
    b && (U = U * 1.5);
    var E = w * 0.2 * t.layout.chromosomeWidth, D = function(T) {
      return t.layout.width - T.labelPosition * (U + u) - E;
    }, R = function(T) {
      return t.layout.width - T.position * (U + u) - E;
    }, x = p.selectAll("g.qtl-annotation").data(B.layout.qtlNodes, function(T) {
      return T.id;
    }), K = x.enter().append("g").classed("qtl-annotation infobox", !0);
    K.append("rect").classed("qtl-hoverbox", !0);
    var k = K.append("rect").classed("qtl-selector infobox", !0), Y = {}, dA = {};
    x.exit().select("rect").each(function(T) {
      Y[T.index] = Le.pick(this, ["x", "y", "width", "height"]), Y[T.index].midpoint = T.midpoint, Y[T.index].position = T.position;
    }), k.each(function(T) {
      dA[T.index] = Le.pick(this, ["x", "y", "width", "height"]), dA[T.index].midpoint = T.midpoint, dA[T.index].position = T.position;
    });
    var cA = function(T, eA, J, L) {
      return Le.has(T, eA) ? T[eA][J].animVal.value : L;
    };
    k.attr("x", function(T) {
      return cA(Y, T.parentIndex, "x", R(T));
    }).attr("y", function(T) {
      return cA(Y, T.parentIndex, "y", Q(T.start));
    }).attr("width", u).attr("height", function(T) {
      return cA(
        Y,
        T.parentIndex,
        "height",
        Q(T.end) - Q(T.start)
      );
    }), x.attr("id", function(T) {
      return "feature_" + T.id;
    }), x.select("rect.qtl-hoverbox").attr("x", function(T) {
      return R(T);
    }).attr("y", function(T) {
      return Q(T.start);
    }).attr("width", function(T) {
      return T.position * (U + u) + t.chromosomeWidth + E;
    }).attr("height", function(T) {
      return Q(T.end) - Q(T.start);
    }).attr("fill", function(T) {
      return T.color;
    }).attr("visibility", function(T) {
      return T.hover ? "visible" : "hidden";
    }), x.select("rect.qtl-selector").transition().duration(v).attr("x", R).attr("y", function(T) {
      return Q(T.start);
    }).attr("width", u).attr("height", function(T) {
      return Q(T.end) - Q(T.start);
    }), x.select("rect.qtl-selector").style("fill", function(T) {
      return T.color;
    }), x.exit().select("rect").transition().duration(v).attr("x", function(T) {
      return cA(dA, T.parentIndex, "x", R(T));
    }).attr("y", function(T) {
      return cA(dA, T.parentIndex, "y", Q(T.start));
    }).attr("width", function(T) {
      return u;
    }).attr("height", function(T) {
      return cA(
        dA,
        T.parentIndex,
        "height",
        Q(T.end) - Q(T.start)
      );
    }).remove(), x.exit().remove();
    var wA = function(T) {
      return Q(T.midpoint);
    }, EA = function(T) {
      return T.displayLabel === "show" ? "visible" : T.displayLabel === "hide" ? "hidden" : !0;
    }, NA = K.append("g").classed("qtl-count-group", !0), xA = x.select("g.qtl-count-group").selectAll("g.qtllist").data(
      function(T) {
        var eA = T.type == "qtllist" ? [T] : [];
        return eA;
      },
      function(T) {
        return "label_" + T.id;
      }
    ), X = xA.enter(), CA = X.append("g").classed("qtllist", !0);
    CA.append("circle").classed("qtl-count", !0), CA.append("text").classed("qtl-count", !0), NA.each(function(T) {
      if (Le.has(dA, T.index))
        if (Le.has(Y, T.parentIndex)) {
          let L = Y[T.parentIndex];
          var eA = t.layout.width - L.position * (U + u), J = Q(L.midpoint);
          WA(this).attr(
            "transform",
            "translate(" + (eA + 0.5 * u) + "," + J + ")"
          );
        } else
          WA(this).attr("transform", function(L) {
            return L ? "translate(" + (R(L) + 0.5 * u) + "," + wA(L) + ")" : "translate(0,0)";
          });
    }), x.select("g.qtl-count-group").transition().duration(v).attr("transform", function(T) {
      return T ? "translate(" + (R(T) + 0.5 * u) + "," + wA(T) + ")" : "translate(0,0)";
    }), x.select("circle.qtl-count").attr("cx", 0).attr("cy", 0).attr("r", u + "px").style("visibility", "visible").style("fill", function(T) {
      return T.color;
    }).attr("id", function(T) {
      return T.id;
    });
    var tA = Math.min(
      Math.max(10 / t.scale, u),
      14 / t.scale
    );
    x.select("text.qtl-count").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("fill", "white").style("font-size", tA + "px").style(
      "visibility",
      tA < 2 * u ? "visible" : "hidden"
    ).text(function(T) {
      return T.count;
    }), xA.exit().remove(), K.append("g").classed("qtl-label-group", !0);
    var fA = x.select("g.qtl-label-group").selectAll("g.qtl").data(
      function(T) {
        var eA = T.displayLabel ? [T] : [];
        return eA;
      },
      function(T) {
        return "label_" + T.id;
      }
    );
    fA.exit().remove(), fA.transition().duration(v).attr("transform", function(T) {
      return "translate(" + (D(T) + 0.5 * u) + "," + wA(T) + ")";
    });
    var _A = fA.enter(), IA = _A.append("g").classed("qtl", !0).attr("transform", function(T) {
      return "translate(" + (D(T) + 0.5 * u) + "," + wA(T) + ")";
    });
    IA.append("text").classed("qtl-label", !0), x.select("text.qtl-label").attr("x", 0).attr("y", 0).attr("dy", "0.3em").attr("text-anchor", "middle").style("font-size", function(T) {
      return T.fontSize + "px";
    }).attr("transform", "rotate(270)").style("visibility", EA).text(function(T) {
      return T.screenLabel;
    });
    var aA = function(T) {
      T.on("mouseenter", function(eA) {
        eA.hover = !0, s(p, B, w);
      }).on("mouseout", function(eA) {
        eA.hover = !1, s(p, B, w);
      }).on("click", function(eA) {
        eA.hover = !eA.hover, s(p, B, w);
      });
    };
    aA(x.select("rect.qtl-selector")), aA(x.select("circle.qtl-count")), aA(x.select("text.qtl-count")), x.on("contextmenu", function(T) {
      var eA = WA("#clusterPopover");
      eA.attr("class", "popover");
      var J = eA.select(".popover-title");
      J.selectAll("*").remove(), J.text(""), J.text(
        "Chromosome " + T.chromosome + ": " + T.start + "-" + T.end
      ), oe.fn.redraw = function() {
        return oe(this).each(function() {
          this.offsetHeight;
        });
      }, L = eA.select(".popover-content"), L.selectAll("*").remove(), L.text("");
      var L = eA.select(".popover-content").selectAll("p").data(
        //Either bind a single qtl or a list of qtls
        T.type == "qtllist" ? T.qtlList : [T]
      ), $ = L.enter();
      $.append("p").classed("popover-annotation", !0);
      var rA = L.append("div").attr("class", "checkbox").append("label");
      rA.append("input").attr("type", "checkbox").attr("value", "").property("checked", function(FA) {
        return FA.selected;
      }).on("click", function(FA) {
        FA.selected = !FA.selected, L.classed("selected", function(UA) {
          return UA.selected;
        }), t.onAnnotationSelectFunction();
      }), rA.append("a").attr("href", function(FA) {
        return FA.link;
      }).attr("target", "_blank").text(function(FA) {
        return FA.label;
      }), L.classed("selected", function(FA) {
        return FA.selected;
      });
    });
  }, l = function(p) {
    p.select("rect.border").empty() && p.append("rect").classed("border", !0), p.select("rect.border").attr("width", t.layout.width).attr("height", t.layout.height);
  }, c = function(p) {
    var B = /* @__PURE__ */ new Set();
    p.map(function(v) {
      B.add(v.trait);
    });
    var w = Array.from(B).sort();
    return w;
  };
  function f(p) {
    p.each(function(B) {
      var w = B.annotations.snps.filter(function(U) {
        return !(U.pvalue > t.maxSnpPValue);
      }), v = c(w), Q = WA(this).selectAll(".qtl-annotations").data([B]);
      Q.enter().append("g").attr("class", "qtl-annotations"), Q.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), s(Q, B, v.length), t.border && l(Q), Q.exit().remove();
      var u = WA(this).selectAll(".snp-annotations").data([B]);
      u.enter().append("g").attr("class", "snp-annotations"), u.attr(
        "transform",
        "translate(" + t.layout.x + "," + t.layout.y + ")"
      ), i(u, B, w, v), u.exit().remove();
    });
  }
  return f.onAnnotationSelectFunction = function(p) {
    return arguments.length ? (t.onAnnotationSelectFunction = p, f) : t.onAnnotationSelectFunction;
  }, f.layout = function(p) {
    return arguments.length ? (t.layout = p, f) : t.layout;
  }, f.drawing = function(p) {
    return arguments.length ? (t.drawing = p, f) : t.drawing;
  }, f.longestChromosome = function(p) {
    return arguments.length ? (t.longestChromosome = p, f) : t.longestChromosome;
  }, f.chromosomeWidth = function(p) {
    return arguments.length ? (t.chromosomeWidth = p, f) : t.chromosomeWidth;
  }, f.annotationLabelSize = function(p) {
    return arguments.length ? (t.annotationLabelSize = p, f) : t.annotationLabelSize;
  }, f.annotationMarkerSize = function(p) {
    return arguments.length ? (t.annotationMarkerSize = p, f) : t.annotationMarkerSize;
  }, f.showAnnotationLabels = function(p) {
    return arguments.length ? (t.showAnnotationLabels = p, f) : t.showAnnotationLabels;
  }, f.maxSnpPValue = function(p) {
    return arguments.length ? (t.maxSnpPValue = p, f) : t.maxSnpPValue;
  }, f.infoBoxManager = function(p) {
    return arguments.length ? (t.infoBoxManager = p, f) : t.infoBoxManager;
  }, f.scale = function(p) {
    return arguments.length ? (t.scale = p, f) : t.scale;
  }, f;
}, cN = function(A) {
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
    i.each(function(s) {
      var l = s.cellLayout, c = WA(this).selectAll(".chromosome-cell").data(s.chromosomes), f = c.enter().append("g").attr("class", "chromosome-cell");
      t.border && f.append("rect").classed("border", !0), WA(this).selectAll(".chromosome-cell").attr("transform", function(Q) {
        return "translate(" + Q.cell.x + "," + Q.cell.y + ")";
      }), t.border && c.select("rect").attr("x", 0).attr("y", 0).attr("width", function(Q) {
        return Q.cell.width;
      }).attr("height", function(Q) {
        return Q.cell.height;
      });
      var p = uN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).onExpandClusterFunction(t.onExpandClusterFunction).layout(l.geneAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).drawing(t.svg).scale(l.scale);
      eh(".chromosome-cell").call(p);
      var B = EO().layout(l.chromosomePosition).longestChromosome(l.longestChromosome).onAnnotationSelectFunction(t.onAnnotationSelectFunction).scale(l.scale).bands("genes").drawing(t.svg);
      eh(".chromosome-cell").call(B);
      var w = UO().layout(l.labelPosition).sizeLayout(l.sizeLabelPosition).onLabelSelectFunction(t.onLabelSelectFunction).longestChromosome(l.longestChromosome).scale(l.scale);
      c.call(w);
      var v = lN().onAnnotationSelectFunction(t.onAnnotationSelectFunction).layout(l.qtlAnnotationPosition).longestChromosome(l.longestChromosome).chromosomeWidth(l.chromosomePosition.width).annotationLabelSize(l.annotations.label.size).annotationMarkerSize(l.annotations.marker.size).showAnnotationLabels(l.annotations.label.show).maxSnpPValue(t.maxSnpPValue).drawing(t.svg).scale(l.scale);
      c.call(v), c.exit().remove();
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
function fN(A) {
  return A.slice().sort(function(e, t) {
    return e - t;
  });
}
function nm(A, e) {
  for (var t = [], n = 0; n < A; n++) {
    for (var i = [], s = 0; s < e; s++)
      i.push(0);
    t.push(i);
  }
  return t;
}
function dN(A) {
  for (var e = 0, t, n = 0; n < A.length; n++)
    (n === 0 || A[n] !== t) && (t = A[n], e++);
  return e;
}
function ph(A, e, t, n) {
  var i;
  if (A > 0) {
    var s = (t[e] - t[A - 1]) / (e - A + 1);
    i = n[e] - n[A - 1] - (e - A + 1) * s * s;
  } else
    i = n[e] - t[e] * t[e] / (e + 1);
  return i < 0 ? 0 : i;
}
function gh(A, e, t, n, i, s, l) {
  if (!(A > e)) {
    var c = Math.floor((A + e) / 2);
    n[t][c] = n[t - 1][c - 1], i[t][c] = c;
    var f = t;
    A > t && (f = Math.max(f, i[t][A - 1] || 0)), f = Math.max(f, i[t - 1][c] || 0);
    var p = c - 1;
    e < n[0].length - 1 && (p = Math.min(p, i[t][e + 1] || 0));
    for (var B, w, v, Q, u = p; u >= f && (B = ph(u, c, s, l), !(B + n[t - 1][f - 1] >= n[t][c])); --u)
      w = ph(f, c, s, l), v = w + n[t - 1][f - 1], v < n[t][c] && (n[t][c] = v, i[t][c] = f), f++, Q = B + n[t - 1][u - 1], Q < n[t][c] && (n[t][c] = Q, i[t][c] = u);
    gh(
      A,
      c - 1,
      t,
      n,
      i,
      s,
      l
    ), gh(
      c + 1,
      e,
      t,
      n,
      i,
      s,
      l
    );
  }
}
function hN(A, e, t) {
  for (var n = e[0].length, i = A[Math.floor(n / 2)], s = [], l = [], c = 0, f = void 0; c < n; ++c)
    f = A[c] - i, c === 0 ? (s.push(f), l.push(f * f)) : (s.push(s[c - 1] + f), l.push(
      l[c - 1] + f * f
    )), e[0][c] = ph(0, c, s, l), t[0][c] = 0;
  for (var p, B = 1; B < e.length; ++B)
    B < e.length - 1 ? p = B : p = n - 1, gh(
      p,
      n - 1,
      B,
      e,
      t,
      s,
      l
    );
}
function pN(A, e) {
  if (e > A.length)
    throw new Error(
      "cannot generate more classes than there are data values"
    );
  var t = fN(A), n = dN(t);
  if (n === 1)
    return [t];
  var i = nm(e, t.length), s = nm(e, t.length);
  hN(t, i, s);
  for (var l = [], c = s[0].length - 1, f = s.length - 1; f >= 0; f--) {
    var p = s[f][c];
    l[f] = t.slice(p, c + 1), f > 0 && (c = p - 1);
  }
  return l;
}
const rm = function(A) {
  var e = {}, t = { nClusters: 6 }, n = Le.merge({}, t, A);
  return e.createClustersFromGenes = function(i) {
    var s = [];
    if (i.length < 1)
      return s;
    var l = Math.min(n.nClusters, i.length), c = i.map(function(w) {
      return w.midpoint;
    });
    let f = pN(c, l);
    for (var p = [], B = 0; B < f.length; B++)
      p.push([]);
    return i.map(function(w) {
      let v = f.findIndex(function(Q) {
        return Q.includes(w.midpoint);
      });
      p[v].push(w);
    }), p.map(function(w) {
      if (w.length < 2)
        s.push.apply(s, w);
      else {
        var v = w.reduce(function(U, b) {
          return U + b.midpoint;
        }, 0) / w.length, Q = w.reduce(function(U, b) {
          return U + b.id.toString();
        }, ""), u = {
          genesList: w,
          midpoint: v,
          type: "geneslist",
          id: Q.toString()
        };
        s.push(u);
      }
    }), s;
  }, e.nClusters = function(i) {
    return arguments.length ? (n.nClusters = i, e) : n.nClusters;
  }, e;
}, gN = function(A) {
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
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(w, v, Q, u) {
    var U = 4, b = v / 3, E = b / Q * U, D = E * w > u;
    if (D)
      return 2;
    var R = v * (0.1 + 0.1 / w);
    return b = v - R, E = b / Q * U, D = E * w > u, D ? 1 : 0;
  }, s = function(w, v, Q, u, U) {
    var b = 3.5;
    let E = {};
    return E.scale = w, E.availableHeight = U, E.lineSpacing = 1, E.layerGap = v * (0.1 + 0.1 / w), E.spaceForLabel = v - E.layerGap, E.setFontSize = Math.min(
      E.spaceForLabel / Q * b,
      u / t.scale
    ), E.nodeSpacing = E.setFontSize, E.nLabels = 0.4 * U / (E.nodeSpacing + E.lineSpacing), E.density = 1, E;
  }, l = function(w, v, Q, u, U) {
    var b = 3.5, E = {};
    return E.scale = w, E.availableHeight = U, E.lineSpacing = 1, E.setFontSize = Math.min(
      v / 3 / Q * b,
      u / t.scale
    ), E.nodeSpacing = E.setFontSize, E.spaceForLabel = 1.3 * Q * E.setFontSize / b, E.layerGap = Math.min(5 * E.setFontSize, v / 3), E.density = 0.9, E.nLabels = 0.6 * U / (E.nodeSpacing + E.lineSpacing), E;
  }, c = function(w, v, Q, u) {
    u.forEach(function(b) {
      b.displayed = !0, b.fontSize = Q.setFontSize;
    });
    var U = u.map(function(b) {
      return new labella.Node(v(b.midpoint), Q.setFontSize, b);
    });
    try {
      w.nodes(U).compute();
    } catch (b) {
      if (b instanceof RangeError)
        return null;
      throw b;
    }
    return U;
  }, f = function(w) {
    let v = w.annotations.allGenes.filter(function(tA) {
      return tA.globalIndex < t.nGenesToDisplay;
    });
    var Q = t.layout.width, u = t.layout.height * Math.min(1, 0.2 + w.length / t.longestChromosome), U = v.reduce(function(tA, fA) {
      return Math.max(tA, fA.label.length);
    }, 0), b = 1.1 * t.displayedFontSize, E = 0.9 * t.displayedFontSize, D = i(
      t.scale,
      Q,
      U,
      b
    ), R;
    D == 2 ? R = l(
      t.scale,
      Q,
      U,
      E,
      u
    ) : D == 1 ? R = s(
      t.scale,
      Q,
      U,
      E,
      u
    ) : D == 0 && (R = s(
      t.scale,
      Q,
      U,
      E,
      u
    ), R.nLabels = 0);
    var x = n();
    let K = {
      nodeSpacing: R.nodeSpacing,
      lineSpacing: R.lineSpacing,
      algorithm: "overlap",
      minPos: 0,
      maxPos: R.availableHeight,
      density: R.density
    };
    var k = new labella.Force(K);
    v.forEach(function(tA) {
      tA.displayed = !1;
    });
    var Y = t.manualLabels ? new Set(
      v.filter(function(tA) {
        return tA.visible;
      })
    ) : /* @__PURE__ */ new Set();
    t.autoLabels && v.slice(0, R.nLabels).filter(function(tA) {
      return !tA.hidden;
    }).forEach(function(tA) {
      Y.add(tA);
    });
    var dA = Array.from(Y), cA = c(k, x, R, dA);
    !cA == 0 && (k.options({ algorithm: "simple" }), cA = c(k, x, R, dA));
    var wA;
    if (cA && cA.length > 0) {
      var EA = cA.map(function(tA) {
        return tA.getLayerIndex();
      });
      wA = Math.max.apply(null, EA);
    }
    if (!cA || wA > 3) {
      var NA = rm().nClusters(Math.max(R.nLabels, 1));
      try {
        var xA = NA.createClustersFromGenes(dA);
      } catch {
        xA = [];
      }
      cA = c(k, x, R, xA);
    }
    let X = {
      direction: "right",
      layerGap: R.layerGap,
      nodeHeight: R.spaceForLabel
    };
    var CA = new labella.Renderer(X);
    return CA.layout(cA), cA.forEach(function(tA) {
      tA.data.path = CA.generatePath(tA);
    }), t.manualLabels || eh(".gene-annotation").remove(), cA;
  }, p = function(w) {
    var v = rm(), Q = w.annotations.genes, u = v.createClustersFromGenes(Q);
    return u;
  };
  let B = {};
  return B.layoutChromosome = function(w) {
    w.layout.annotationNodes = f(w) || w.layout.annotationNodes;
  }, B.computeChromosomeClusters = function(w) {
    w.layout.annotationClusters = p(w), w.layout.annotationDisplayClusters = w.layout.annotationClusters.slice();
  }, B.expandAllChromosomeClusters = function(w) {
    w.layout.annotationDisplayClusters = w.annotations.genes;
  }, B.collapseAllChromosomeClusters = function(w) {
    w.layout.annotationDisplayClusters = w.layout.annotationClusters.slice();
  }, B.expandAChromosomeCluster = function(w, v) {
    w.layout.annotationDisplayClusters = w.layout.annotationClusters.slice(), v.genesList.forEach(function(u) {
      w.layout.annotationDisplayClusters.push(u);
    });
    var Q = w.layout.annotationDisplayClusters.indexOf(v);
    w.layout.annotationDisplayClusters.splice(Q, 1);
  }, B.computeNormalisedGeneScores = function(w) {
    var v = w.reduce(function(b, E) {
      return b.concat(
        E.annotations.genes.filter(function(D) {
          return D.displayed;
        })
      );
    }, []), Q = v.every(function(b) {
      return b.score;
    });
    if (Q) {
      var u = v.reduce(function(b, E) {
        return Math.max(b, E.score);
      }, 0), U = v.reduce(function(b, E) {
        return Math.min(b, E.score);
      }, 0);
      v.forEach(function(b) {
        b.normedScore = 0.5 * (b.score - U) / (u - U) + 0.5;
      });
    } else
      v.forEach(function(b) {
        b.normedScore = null;
      });
  }, B;
}, BN = function(A) {
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
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, i = function(f) {
    if (f.type == "gene") {
      var p = f;
      return {
        start: p.start,
        end: p.end,
        midpoint: p.midpoint,
        color: p.color,
        data: p
      };
    } else if (f.type == "geneslist") {
      let B = f.genesList.reduce(function(Q, u) {
        return Math.max(Q, u.end);
      }, 0);
      return {
        start: f.genesList.reduce(function(Q, u) {
          return Math.min(Q, u.start);
        }, 1 / 0),
        end: B,
        midpoint: f.midpoint,
        color: "#0000FF",
        data: f
      };
    }
  }, s = function(f) {
    n();
    var p = f.layout.geneBandDisplayClusters, B = p.map(i);
    return B;
  }, l = function(f) {
    var p = f.annotations.allGenes.filter(function(U) {
      return U.globalIndex < t.nGenesToDisplay;
    });
    p.sort(function(U, b) {
      return U.midpoint - b.midpoint;
    });
    for (var B = [], w = 0; w < p.length; ) {
      let U = w;
      for (; U < p.length && p[w].midpoint == p[U].midpoint; )
        U++;
      if (U - w == 1)
        B.push(p[w]), w++;
      else {
        var v = p.slice(w, U), Q = v.reduce(function(E, D) {
          return E + D.id.toString();
        }, ""), u = {
          genesList: v,
          midpoint: v[0].midpoint,
          type: "geneslist",
          id: Q
        };
        B.push(u), w = U;
      }
    }
    return B.sort(function(U, b) {
      return U.midpoint < b.midpoint;
    }), B;
  };
  let c = {};
  return c.layoutChromosome = function(f) {
    f.layout.geneBandNodes = s(f);
  }, c.computeChromosomeClusters = function(f) {
    let p = f.layout;
    p.geneBandClusters = l(f), p.geneBandDisplayClusters = p.geneBandClusters.slice();
  }, c.expandAllChromosomeClusters = function(f) {
    let p = f.layout;
    p.geneBandDisplayClusters = f.annotations.allGenes;
  }, c.collapseAllChromosomeClusters = function(f) {
    let p = f.layout;
    p.geneBandDisplayClusters = p.geneBandClusters.slice();
  }, c.expandAChromosomeCluster = function(f, p) {
    let B = f.layout;
    B.geneBandDisplayClusters = B.geneBandClusters.slice(), p.genesList.forEach(function(v) {
      B.geneBandDisplayClusters.push(v);
    });
    var w = B.geneBandDisplayClusters.indexOf(p);
    B.geneBandDisplayClusters.splice(w, 1);
  }, c;
}, wN = function(A) {
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
  }, s = function() {
    oe(this).hasClass("disabled") || t.onTagBtnClick();
  }, l = function() {
    oe(this).hasClass("disabled") || t.onFitBtnClick();
  }, c = function() {
    if (oe(this).hasClass("disabled"))
      return;
    const v = new Event("change"), Q = document.getElementById("select-label-btn");
    Q.value = "auto", Q.dispatchEvent(v);
    const u = document.getElementById("select-ngenes-dropdown");
    u.value = "50", u.dispatchEvent(v), t.onResetBtnClick();
  }, f = function() {
    t.onExpandBtnClick();
  }, p = function(v, Q, u, U, b) {
    var E = "select-" + Q, D = v.selectAll("select").data([null]);
    D.enter().append("select").attr("id", E).attr("name", E).attr("class", "menu-dropdown");
    const R = document.getElementById(E);
    R && (R.innerHTML = "", u.forEach(function(x) {
      var K = document.createElement("option");
      K.value = x[1], K.textContent = x[0], x[1] === b && (K.selected = !0), R.appendChild(K);
    }), R.addEventListener("change", function() {
      var x = R.options[R.selectedIndex], K = x.value;
      U(K);
    }));
  }, B = function() {
    var v = WA(n).selectAll(".genemap-menu").data([null]);
    v.enter().append("div").classed("genemap-menu", !0);
    var Q = v.selectAll("span").data([
      ["label-btn", "ngenes-dropdown"],
      ["help-btn", "reset-btn", "export-btn"]
    ]).enter().append("span").classed("menu-block", !0), u = Q.selectAll("span").data(function(wA, EA) {
      return wA;
    });
    u.enter().append("span"), Q.selectAll("span").attr("class", function(wA) {
      return wA;
    }), v.select(".network-btn").attr("title", "Launch network view").on("click", i), v.select(".tag-btn").on("click", s);
    var U = v.select(".label-btn");
    p(
      U,
      "label-btn",
      [
        ["Auto labels", "auto"],
        ["Checked labels", "show"],
        ["No labels", "hide"]
      ],
      t.onLabelBtnClick,
      "Auto labels"
    ), v.select(".fit-btn").attr("title", "Reset pan and zoom").on("click", l), v.select(".reset-btn").attr("title", "Reset selections").on("click", c);
    var b = v.select(".ngenes-dropdown");
    b.text(""), p(
      b,
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
      oe("#select-ngenes-dropdown").selectpicker("val", [
        wA + " genes",
        wA
      ]);
    }), v.select(".export-btn").attr("title", "Export to PNG").on("click", t.onExportBtnClick), v.select(".expand-btn").attr("title", "Toggle full screen").on("click", f);
    var E = "https://github.com/francis-newson-tessella/QTLNetMiner/tree/QTLNM-47-MVE/common/client/src/main/webapp/html/GeneMap/docs";
    v.select(".help-btn").attr("title", "help").text("Help").on("click", function() {
      window.open(E, "_blank");
    });
    var D = WA(n).selectAll(".genemap-advanced-menu").data([null]), R = D.select(".popover-content").selectAll("div").data([
      "qtl-btn",
      "nperrow-spinner",
      "max-snp-pvalue",
      "labelsize",
      "export-all-btn"
    ]);
    R.enter().append("div").attr("class", function(wA) {
      return wA;
    });
    var x = D.select(".qtl-btn");
    p(
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
    var K = D.select(".max-snp-pvalue").selectAll("form").data([""]).enter(), k = K.append("form").classed("bootstrap", !0).attr("id", "snp-pvalue-form").attr("class", "bootstrap form-inline");
    k.append("label").attr("id", "max-snp-pvalue-label").attr("for", "max-snp-pvalue-input").html("Max SNP p-value:&nbsp"), k.append("input").attr("class", "form-control").attr("id", "max-snp-pvalue-input").attr("type", "text").attr("value", t.maxSnpPValueProperty()), k.append("button").attr("type", "submit").attr("class", "btn btn-default").text("Set"), oe("#snp-pvalue-form").submit(function(wA) {
      t.maxSnpPValueProperty(oe("#max-snp-pvalue-input").val()), wA.preventDefault();
    }), t.maxSnpPValueProperty.addListener(function(wA) {
      oe("#max-snp-pvalue-input").val(wA);
    });
    var Y = D.select(".nperrow-spinner"), dA = Y.selectAll("input").data(["nPerRowSpinner"]).enter();
    dA.append("span").append("label").classed("bootstrap", !0).attr("for", (wA) => wA).html("Num per row:&nbsp;"), dA.append("span").append("input").attr("id", (wA) => wA).attr("type", "text").attr("value", t.initialNPerRow).attr("name", (wA) => wA), WA(".nperrow-spinner").select(".input-group").style("width", "8em").style("display", "inline-table"), oe("#nPerRowSpinner").on("change", function(wA) {
      t.onSetNumberPerRowClick(oe("#nPerRowSpinner").val());
    }), D.select(".export-all-btn").attr("title", "export all to PNG").on("click", t.onExportAllBtnClick), D.select(".labelsize").selectAll("span").data(["labelsize-label", "labelsize-dropdown"]).enter().append("span").attr("class", function(wA) {
      return wA;
    }), D.select(".labelsize-label").classed("bootstrap", !0), D.select(".labelsize-label").selectAll("label").data([""]).enter().append("label").text("Label size:");
    var cA = D.select(".labelsize-dropdown");
    cA.text(""), p(
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
      oe("#select-labelsize-dropdown").selectpicker("val", [
        wA,
        wA
      ]);
    });
  };
  function w(v) {
    v.each(function(Q) {
      var u = this;
      n = u, B();
    });
  }
  return w.onNetworkBtnClick = function(v) {
    return arguments.length ? (t.onNetworkBtnClick = v, w) : t.onNetworkBtnClick;
  }, w.onTagBtnClick = function(v) {
    return arguments.length ? (t.onTagBtnClick = v, w) : t.onTagBtnClick;
  }, w.onLabelBtnClick = function(v) {
    return arguments.length ? (t.onLabelBtnClick = v, w) : t.onLabelBtnClick;
  }, w.onQtlBtnClick = function(v) {
    return arguments.length ? (t.onQtlBtnClick = v, w) : t.onQtlBtnClick;
  }, w.onFitBtnClick = function(v) {
    return arguments.length ? (t.onFitBtnClick = v, w) : t.onFitBtnClick;
  }, w.onResetBtnClick = function(v) {
    return arguments.length ? (t.onResetBtnClick = v, w) : t.onResetBtnClick;
  }, w.onSetNumberPerRowClick = function(v) {
    return arguments.length ? (t.onSetNumberPerRowClick = v, w) : t.onSetNumberPerRowClick;
  }, w.initialMaxGenes = function(v) {
    return arguments.length ? (t.initialMaxGenes = v, w) : t.initialMaxGenes;
  }, w.initialNPerRow = function(v) {
    return arguments.length ? (t.initialNPerRow = v, w) : t.initialNPerRow;
  }, w.onExportBtnClick = function(v) {
    return arguments.length ? (t.onExportBtnClick = v, w) : t.onExportBtnClick;
  }, w.onExportAllBtnClick = function(v) {
    return arguments.length ? (t.onExportAllBtnClick = v, w) : t.onExportAllBtnClick;
  }, w.onExpandBtnClick = function(v) {
    return arguments.length ? (t.onExpandBtnClick = v, w) : t.onExpandBtnClick;
  }, w.maxSnpPValueProperty = function(v) {
    return arguments.length ? (t.maxSnpPValueProperty = v, w) : t.maxSnpPValueProperty;
  }, w.nGenesToDisplayProperty = function(v) {
    return arguments.length ? (t.nGenesToDisplayProperty = v, w) : t.nGenesToDisplayProperty;
  }, w.annotationLabelSizeProperty = function(v) {
    return arguments.length ? (t.annotationLabelSizeProperty = v, w) : t.annotationLabelSizeProperty;
  }, w.setTabButtonState = function(v) {
    var Q = WA(n).select(".tag-btn");
    v === "show" ? (Q.classed("show-label", !0), Q.classed("hide-label", !1), Q.classed("auto-label", !1), Q.classed("manual-label", !1), Q.attr("title", "Show Labels")) : v === "hide" ? (Q.classed("show-label", !1), Q.classed("hide-label", !0), Q.classed("auto-label", !1), Q.classed("manual-label", !1), Q.attr("title", "Hide Labels")) : v === "manual" ? (Q.classed("show-label", !1), Q.classed("hide-label", !1), Q.classed("auto-label", !1), Q.classed("manual-label", !0), Q.attr("title", "Manual Labels")) : (Q.classed("show-label", !1), Q.classed("hide-label", !1), Q.classed("auto-label", !0), Q.classed("manual-label", !1), Q.attr("title", "Automatic Labels"));
  }, w.getTagButtonState = function() {
    var v = WA(n).select(".tag-btn");
    return v.classed("show-label") ? "show" : v.classed("hide-label") ? "hide" : v.classed("auto-label") ? "auto" : "manual";
  }, w.setFitButtonEnabled = function(v) {
    WA(n).select(".fit-btn").classed("disabled", !v);
  }, w.setNetworkButtonEnabled = function(v) {
    WA(n).select(".network-btn").classed("disabled", !v);
  }, w;
};
class mN {
  constructor(e, t, n) {
    this.distance = e, this.linkage = t, this.threshold = n ?? 1 / 0;
  }
  cluster(e, t, n) {
    this.clusters = [], this.dists = [], this.mins = [], this.index = [];
    for (let l = 0; l < e.length; l++) {
      const c = {
        value: e[l],
        key: l,
        index: l,
        size: 1
      };
      this.clusters[l] = c, this.index[l] = c, this.dists[l] = [], this.mins[l] = 0;
    }
    for (let l = 0; l < this.clusters.length; l++)
      for (let c = 0; c <= l; c++) {
        const f = l === c ? 1 / 0 : this.distance(this.clusters[l].value, this.clusters[c].value);
        this.dists[l][c] = f, this.dists[c][l] = f, f < this.dists[l][this.mins[l]] && (this.mins[l] = c);
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
      const c = this.clusters[l].key, f = this.dists[c][this.mins[c]];
      f < t && (e = c, t = f);
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
      const c = this.clusters[l];
      let f;
      n.key === c.key ? f = 1 / 0 : this.linkage === "single" ? (f = this.dists[n.key][c.key], this.dists[n.key][c.key] > this.dists[i.key][c.key] && (f = this.dists[i.key][c.key])) : this.linkage === "complete" ? (f = this.dists[n.key][c.key], this.dists[n.key][c.key] < this.dists[i.key][c.key] && (f = this.dists[i.key][c.key])) : this.linkage === "average" ? f = (this.dists[n.key][c.key] * n.size + this.dists[i.key][c.key] * i.size) / (n.size + i.size) : f = this.distance(c.value, n.value), this.dists[n.key][c.key] = this.dists[c.key][n.key] = f;
    }
    for (let l = 0; l < this.clusters.length; l++) {
      const c = this.clusters[l].key;
      if (this.mins[c] === n.key || this.mins[c] === i.key) {
        let f = c;
        for (let p = 0; p < this.clusters.length; p++) {
          const B = this.clusters[p].key;
          this.dists[c][B] < this.dists[c][f] && (f = B);
        }
        this.mins[c] = f;
      }
      this.clusters[l].index = l;
    }
    return delete n.key, delete i.key, delete n.index, delete i.index, !0;
  }
}
function vN(A, e, t, n, i, s) {
  return t = t || "average", new mN(
    e,
    t,
    n
  ).cluster(A, i, s);
}
const yN = function() {
  var A = {};
  return A.positionAnnotations = function(e, t, n, i, s, l) {
    for (var c = i, f = l, p = s, B = function(K, k) {
      return c(K) < f(k) && c(k) < f(K);
    }, w = e.sort(function(K, k) {
      return p(K) - p(k);
    }), v = [], Q = 0; Q < w.length; Q++) {
      for (var u = e[Q], U = [], b = 0; b < v.length; b++) {
        var E = w[v[b]];
        B(u, E) || U.push(v[b]);
      }
      var D = _.difference(v, U), R = D.map(function(K) {
        return t(w[K]);
      }), x = 0;
      for (x = 1; x < R.length + 1 && R.indexOf(x) !== -1; x++)
        ;
      n(u, x), v.push(Q);
    }
    return w;
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
      function(c) {
        return c.labelPosition;
      },
      function(c, f) {
        c.labelPosition = f;
      },
      function(c) {
        return t(c.midpoint) - l * c.screenLabel.length / 2;
      },
      function(c) {
        return c.midpoint;
      },
      function(c) {
        return t(c.midpoint) + l * c.screenLabel.length / 2;
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
}, CN = function(A) {
  var e = {
    scale: 1,
    longestChromosome: 1e3,
    showAllQTLs: !0,
    showSelectedQTLs: !0,
    showAutoQTLLabels: !0,
    showSelectedQTLLabels: !0,
    annotationLabelSize: 5
  }, t = Le.merge({}, e, A), n = yN(), i = function() {
    return ca().range([0, t.layout.height]).domain([0, t.longestChromosome]);
  }, s = function(u) {
    return u.map(function(U) {
      var b = v(U), E = b.reduce(function(k, Y) {
        return Math.min(k, Y.start);
      }, 1 / 0), D = b.reduce(function(k, Y) {
        return Math.max(k, Y.end);
      }, 0), R = b.reduce(function(k, Y) {
        return k + (k ? "|" : "") + Y.start + "-" + Y.end;
      }, ""), x = (E + D) / 2;
      let K;
      return b.length == 1 ? (K = b[0], K.type = "qtl", K.index = U.index, K.parentIndex = U.parentIndex) : K = {
        cluster: U,
        index: U.index,
        parentIndex: U.parentIndex,
        qtlList: b,
        color: b[0].color,
        count: b.length,
        start: E,
        end: D,
        midpoint: x,
        chromosome: b[0].chromosome,
        type: "qtllist",
        id: R
      }, K;
    });
  }, l = function(u) {
    var U = [];
    if (t.showAllQTLs) {
      u.layout.qtlDisplayClusters = u.layout.qtlClusters.slice();
      for (var b = u.layout.qtlDisplayClusters, E = Math.ceil(Math.floor(t.scale - 0.1) / 2); E--; )
        b = w(b);
      for (var D = b.length; ; ) {
        U = s(b), U = n.sortQTLAnnotations(U);
        var R = U.reduce(function(x, K) {
          return Math.max(x, K.position);
        }, 0);
        if (R < 2) {
          if (b = w(b), D == b.length)
            break;
          D = b.length;
        } else
          break;
      }
    } else t.showSelectedQTLs && (u.layout.qtlDisplayClusters = u.annotations.qtls.filter(
      function(x) {
        return x.selected;
      }
    ), b = u.layout.qtlDisplayClusters, U = b.map(function(x) {
      let K = x;
      return K.type = "qtl", K;
    }));
    return U;
  }, c = function(u) {
    var U = Le.groupBy(u, "position");
    return Le.forOwn(U, function(b) {
      var E = 14 / t.scale, D = i();
      b = n.sortQTLLabels(b, D, E), b.forEach(function(R) {
        R.labelPosition > 1 ? R.displayLabel = !1 : (R.displayLabel = !0, R.labelPosition = R.position + 0.4);
      });
    }), u;
  }, f = function(u) {
    var U = l(u);
    U.forEach(function(Y) {
      Y.displayLabel = !1;
    });
    var b = U.filter(function(Y) {
      return Y.type == "qtl";
    });
    if (t.showAutoQTLLabels) {
      U = n.sortQTLAnnotations(U);
      var E = U.reduce(function(Y, dA) {
        return Math.max(Y, dA.position);
      }, 0);
      b.forEach(function(Y) {
        Y.label.length > 15 ? Y.screenLabel = Y.label.substring(0, 12) + "..." : Y.screenLabel = Y.label;
      });
      var D = 14 / t.scale, R = D > 0.6 * t.layout.chromosomeWidth, x = E > 3;
      !x && !R ? (c(b), b.forEach(function(Y) {
        Y.fontSize = D;
      })) : b.forEach(function(Y) {
        Y.displayLabel = !1;
      });
    }
    if (t.showSelectedQTLLabels && !t.showAutoQTLLabels) {
      var K = U.filter(function(Y) {
        return Y.selected;
      });
      D = 14 / t.scale;
      var k = 0.3 * t.layout.chromosomeWidth;
      K.forEach(function(Y) {
        Y.displayLabel = !0, Y.screenLabel = Y.label, Y.fontSize = Math.min(D, 2 * k);
      }), K = n.sortQTLAnnotationsWithLabels(
        K,
        i(),
        t.annotationLabelSize
      ), K.forEach(function(Y) {
        Y.position = Y.comboPosition, Y.labelPosition = Y.comboPosition + 0.4;
      });
    }
    return U;
  }, p = function(u, U) {
    if (u.index = U.index, U.index = U.index + 1, u.value)
      u.unit = !0, u.start = u.value.start, u.end = u.value.end;
    else {
      var b = u.left, E = u.right;
      b.parentIndex = u.index, E.parentIndex = u.index, p(b, U), p(E, U), u.unit = b.unit && E.unit && b.start == E.start && b.end == E.end, u.start = Math.min(u.left.start, u.right.start), u.end = Math.max(u.left.end, u.right.end);
    }
  }, B = function(u) {
    var U = vN(
      u.annotations.qtls,
      function(E, D) {
        if (E.end == D.end && E.start == D.start)
          return 0;
        var R = Math.min(E.end, D.end) - Math.max(E.start, D.start), x = E.end - E.start, K = D.end - D.start, k = R, Y = Math.abs(x - K);
        return Math.max(0.1, Y - k);
      },
      "single",
      null
    ), b = { index: 0 };
    return U.forEach(function(E) {
      p(E, b);
    }), U;
  }, w = function(u) {
    var U = [];
    return u.forEach(function(b) {
      if (b.value || b.unit)
        U.push(b);
      else {
        var E = b.left, D = b.right;
        U.push(E), U.push(D);
      }
    }), U;
  }, v = function(u) {
    return u.size == 1 ? [u.value] : v(u.left).concat(v(u.right));
  };
  let Q = {};
  return Q.layoutChromosome = function(u) {
    u.layout.qtlNodes = f(u) || u.layout.qtlNodes;
  }, Q.computeChromosomeClusters = function(u) {
    u.layout.qtlClusters = B(u);
  }, Q;
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
var Bh = function(A, e) {
  return Bh = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
  }, Bh(A, e);
};
function jn(A, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Bh(A, e);
  function t() {
    this.constructor = A;
  }
  A.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var wh = function() {
  return wh = Object.assign || function(e) {
    for (var t, n = 1, i = arguments.length; n < i; n++) {
      t = arguments[n];
      for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
    }
    return e;
  }, wh.apply(this, arguments);
};
function Vt(A, e, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(l) {
      l(s);
    });
  }
  return new (t || (t = Promise))(function(s, l) {
    function c(B) {
      try {
        p(n.next(B));
      } catch (w) {
        l(w);
      }
    }
    function f(B) {
      try {
        p(n.throw(B));
      } catch (w) {
        l(w);
      }
    }
    function p(B) {
      B.done ? s(B.value) : i(B.value).then(c, f);
    }
    p((n = n.apply(A, [])).next());
  });
}
function Ot(A, e) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, l;
  return l = { next: c(0), throw: c(1), return: c(2) }, typeof Symbol == "function" && (l[Symbol.iterator] = function() {
    return this;
  }), l;
  function c(p) {
    return function(B) {
      return f([p, B]);
    };
  }
  function f(p) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; t; ) try {
      if (n = 1, i && (s = p[0] & 2 ? i.return : p[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, p[1])).done) return s;
      switch (i = 0, s && (p = [p[0] & 2, s.value]), p[0]) {
        case 0:
        case 1:
          s = p;
          break;
        case 4:
          return t.label++, { value: p[1], done: !1 };
        case 5:
          t.label++, i = p[1], p = [0];
          continue;
        case 7:
          p = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (p[0] === 6 || p[0] === 2)) {
            t = 0;
            continue;
          }
          if (p[0] === 3 && (!s || p[1] > s[0] && p[1] < s[3])) {
            t.label = p[1];
            break;
          }
          if (p[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = p;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(p);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      p = e.call(A, t);
    } catch (B) {
      p = [6, B], i = 0;
    } finally {
      n = s = 0;
    }
    if (p[0] & 5) throw p[1];
    return { value: p[0] ? p[1] : void 0, done: !0 };
  }
}
function wl(A, e, t) {
  if (arguments.length === 2) for (var n = 0, i = e.length, s; n < i; n++)
    (s || !(n in e)) && (s || (s = Array.prototype.slice.call(e, 0, n)), s[n] = e[n]);
  return A.concat(s || e);
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
), $c = function(A, e) {
  return qr.fromClientRect(A, e.getBoundingClientRect());
}, QN = function(A) {
  var e = A.body, t = A.documentElement;
  if (!e || !t)
    throw new Error("Unable to get document size");
  var n = Math.max(Math.max(e.scrollWidth, t.scrollWidth), Math.max(e.offsetWidth, t.offsetWidth), Math.max(e.clientWidth, t.clientWidth)), i = Math.max(Math.max(e.scrollHeight, t.scrollHeight), Math.max(e.offsetHeight, t.offsetHeight), Math.max(e.clientHeight, t.clientHeight));
  return new qr(0, 0, n, i);
}, Pc = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = A.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
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
  for (var n = [], i = -1, s = ""; ++i < t; ) {
    var l = A[i];
    l <= 65535 ? n.push(l) : (l -= 65536, n.push((l >> 10) + 55296, l % 1024 + 56320)), (i + 1 === t || n.length > 16384) && (s += String.fromCharCode.apply(String, n), n.length = 0);
  }
  return s;
}, im = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", FN = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var ml = 0; ml < im.length; ml++)
  FN[im.charCodeAt(ml)] = ml;
var am = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ls = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var vl = 0; vl < am.length; vl++)
  ls[am.charCodeAt(vl)] = vl;
var UN = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, c, f;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var p = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), B = Array.isArray(p) ? p : new Uint8Array(p);
  for (n = 0; n < t; n += 4)
    s = ls[A.charCodeAt(n)], l = ls[A.charCodeAt(n + 1)], c = ls[A.charCodeAt(n + 2)], f = ls[A.charCodeAt(n + 3)], B[i++] = s << 2 | l >> 4, B[i++] = (l & 15) << 4 | c >> 2, B[i++] = (c & 3) << 6 | f & 63;
  return p;
}, EN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, bN = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ra = 5, jp = 11, Qd = 2, _N = jp - ra, Ay = 65536 >> ra, xN = 1 << ra, Fd = xN - 1, IN = 1024 >> ra, HN = Ay + IN, SN = HN, LN = 32, TN = SN + LN, DN = 65536 >> jp, ON = 1 << _N, NN = ON - 1, om = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, MN = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, KN = function(A, e) {
  var t = UN(A), n = Array.isArray(t) ? bN(t) : new Uint32Array(t), i = Array.isArray(t) ? EN(t) : new Uint16Array(t), s = 24, l = om(i, s / 2, n[4] / 2), c = n[5] === 2 ? om(i, (s + n[4]) / 2) : MN(n, Math.ceil((s + n[4]) / 4));
  return new RN(n[0], n[1], n[2], n[3], l, c);
}, RN = (
  /** @class */
  function() {
    function A(e, t, n, i, s, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> ra], t = (t << Qd) + (e & Fd), this.data[t];
        if (e <= 65535)
          return t = this.index[Ay + (e - 55296 >> ra)], t = (t << Qd) + (e & Fd), this.data[t];
        if (e < this.highStart)
          return t = TN - DN + (e >> jp), t = this.index[t], t += e >> ra & NN, t = this.index[t], t = (t << Qd) + (e & Fd), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), sm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", $N = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var yl = 0; yl < sm.length; yl++)
  $N[sm.charCodeAt(yl)] = yl;
var PN = "KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==", um = 50, kN = 1, ey = 2, ty = 3, GN = 4, VN = 5, lm = 7, ny = 8, cm = 9, yi = 10, mh = 11, fm = 12, vh = 13, WN = 14, cs = 15, yh = 16, Cl = 17, ts = 18, XN = 19, dm = 20, Ch = 21, ns = 22, Ud = 23, Ka = 24, ln = 25, fs = 26, ds = 27, Ra = 28, qN = 29, Zi = 30, zN = 31, Ql = 32, Fl = 33, Qh = 34, Fh = 35, Uh = 36, Ks = 37, Eh = 38, Yl = 39, Zl = 40, Ed = 41, ry = 42, JN = 43, jN = [9001, 65288], iy = "!", Fe = "×", Ul = "÷", bh = KN(PN), Mr = [Zi, Uh], _h = [kN, ey, ty, VN], ay = [yi, ny], hm = [ds, fs], YN = _h.concat(ay), pm = [Eh, Yl, Zl, Qh, Fh], ZN = [cs, vh], AM = function(A, e) {
  e === void 0 && (e = "strict");
  var t = [], n = [], i = [];
  return A.forEach(function(s, l) {
    var c = bh.get(s);
    if (c > um ? (i.push(!0), c -= um) : i.push(!1), ["normal", "auto", "loose"].indexOf(e) !== -1 && [8208, 8211, 12316, 12448].indexOf(s) !== -1)
      return n.push(l), t.push(yh);
    if (c === GN || c === mh) {
      if (l === 0)
        return n.push(l), t.push(Zi);
      var f = t[l - 1];
      return YN.indexOf(f) === -1 ? (n.push(n[l - 1]), t.push(f)) : (n.push(l), t.push(Zi));
    }
    if (n.push(l), c === zN)
      return t.push(e === "strict" ? Ch : Ks);
    if (c === ry || c === qN)
      return t.push(Zi);
    if (c === JN)
      return s >= 131072 && s <= 196605 || s >= 196608 && s <= 262141 ? t.push(Ks) : t.push(Zi);
    t.push(c);
  }), [n, t, i];
}, bd = function(A, e, t, n) {
  var i = n[t];
  if (Array.isArray(A) ? A.indexOf(i) !== -1 : A === i)
    for (var s = t; s <= n.length; ) {
      s++;
      var l = n[s];
      if (l === e)
        return !0;
      if (l !== yi)
        break;
    }
  if (i === yi)
    for (var s = t; s > 0; ) {
      s--;
      var c = n[s];
      if (Array.isArray(A) ? A.indexOf(c) !== -1 : A === c)
        for (var f = t; f <= n.length; ) {
          f++;
          var l = n[f];
          if (l === e)
            return !0;
          if (l !== yi)
            break;
        }
      if (c !== yi)
        break;
    }
  return !1;
}, gm = function(A, e) {
  for (var t = A; t >= 0; ) {
    var n = e[t];
    if (n === yi)
      t--;
    else
      return n;
  }
  return 0;
}, eM = function(A, e, t, n, i) {
  if (t[n] === 0)
    return Fe;
  var s = n - 1;
  if (Array.isArray(i) && i[s] === !0)
    return Fe;
  var l = s - 1, c = s + 1, f = e[s], p = l >= 0 ? e[l] : 0, B = e[c];
  if (f === ey && B === ty)
    return Fe;
  if (_h.indexOf(f) !== -1)
    return iy;
  if (_h.indexOf(B) !== -1 || ay.indexOf(B) !== -1)
    return Fe;
  if (gm(s, e) === ny)
    return Ul;
  if (bh.get(A[s]) === mh || (f === Ql || f === Fl) && bh.get(A[c]) === mh || f === lm || B === lm || f === cm || [yi, vh, cs].indexOf(f) === -1 && B === cm || [Cl, ts, XN, Ka, Ra].indexOf(B) !== -1 || gm(s, e) === ns || bd(Ud, ns, s, e) || bd([Cl, ts], Ch, s, e) || bd(fm, fm, s, e))
    return Fe;
  if (f === yi)
    return Ul;
  if (f === Ud || B === Ud)
    return Fe;
  if (B === yh || f === yh)
    return Ul;
  if ([vh, cs, Ch].indexOf(B) !== -1 || f === WN || p === Uh && ZN.indexOf(f) !== -1 || f === Ra && B === Uh || B === dm || Mr.indexOf(B) !== -1 && f === ln || Mr.indexOf(f) !== -1 && B === ln || f === ds && [Ks, Ql, Fl].indexOf(B) !== -1 || [Ks, Ql, Fl].indexOf(f) !== -1 && B === fs || Mr.indexOf(f) !== -1 && hm.indexOf(B) !== -1 || hm.indexOf(f) !== -1 && Mr.indexOf(B) !== -1 || // (PR | PO) × ( OP | HY )? NU
  [ds, fs].indexOf(f) !== -1 && (B === ln || [ns, cs].indexOf(B) !== -1 && e[c + 1] === ln) || // ( OP | HY ) × NU
  [ns, cs].indexOf(f) !== -1 && B === ln || // NU ×	(NU | SY | IS)
  f === ln && [ln, Ra, Ka].indexOf(B) !== -1)
    return Fe;
  if ([ln, Ra, Ka, Cl, ts].indexOf(B) !== -1)
    for (var w = s; w >= 0; ) {
      var v = e[w];
      if (v === ln)
        return Fe;
      if ([Ra, Ka].indexOf(v) !== -1)
        w--;
      else
        break;
    }
  if ([ds, fs].indexOf(B) !== -1)
    for (var w = [Cl, ts].indexOf(f) !== -1 ? l : s; w >= 0; ) {
      var v = e[w];
      if (v === ln)
        return Fe;
      if ([Ra, Ka].indexOf(v) !== -1)
        w--;
      else
        break;
    }
  if (Eh === f && [Eh, Yl, Qh, Fh].indexOf(B) !== -1 || [Yl, Qh].indexOf(f) !== -1 && [Yl, Zl].indexOf(B) !== -1 || [Zl, Fh].indexOf(f) !== -1 && B === Zl || pm.indexOf(f) !== -1 && [dm, fs].indexOf(B) !== -1 || pm.indexOf(B) !== -1 && f === ds || Mr.indexOf(f) !== -1 && Mr.indexOf(B) !== -1 || f === Ka && Mr.indexOf(B) !== -1 || Mr.concat(ln).indexOf(f) !== -1 && B === ns && jN.indexOf(A[c]) === -1 || Mr.concat(ln).indexOf(B) !== -1 && f === ts)
    return Fe;
  if (f === Ed && B === Ed) {
    for (var Q = t[s], u = 1; Q > 0 && (Q--, e[Q] === Ed); )
      u++;
    if (u % 2 !== 0)
      return Fe;
  }
  return f === Ql && B === Fl ? Fe : Ul;
}, tM = function(A, e) {
  e || (e = { lineBreak: "normal", wordBreak: "normal" });
  var t = AM(A, e.lineBreak), n = t[0], i = t[1], s = t[2];
  (e.wordBreak === "break-all" || e.wordBreak === "break-word") && (i = i.map(function(c) {
    return [ln, Zi, ry].indexOf(c) !== -1 ? Ks : c;
  }));
  var l = e.wordBreak === "keep-all" ? s.map(function(c, f) {
    return c && A[f] >= 19968 && A[f] <= 40959;
  }) : void 0;
  return [n, i, l];
}, nM = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.codePoints = e, this.required = t === iy, this.start = n, this.end = i;
    }
    return A.prototype.slice = function() {
      return st.apply(void 0, this.codePoints.slice(this.start, this.end));
    }, A;
  }()
), rM = function(A, e) {
  var t = Pc(A), n = tM(t, e), i = n[0], s = n[1], l = n[2], c = t.length, f = 0, p = 0;
  return {
    next: function() {
      if (p >= c)
        return { done: !0, value: null };
      for (var B = Fe; p < c && (B = eM(t, s, i, ++p, l)) === Fe; )
        ;
      if (B !== Fe || p === c) {
        var w = new nM(t, B, f, p);
        return f = p, { value: w, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, iM = 1, aM = 2, Js = 4, Bm = 8, vc = 10, wm = 47, Us = 92, oM = 9, sM = 32, El = 34, rs = 61, uM = 35, lM = 36, cM = 37, bl = 39, _l = 40, is = 41, fM = 95, An = 45, dM = 33, hM = 60, pM = 62, gM = 64, BM = 91, wM = 93, mM = 61, vM = 123, xl = 63, yM = 125, mm = 124, CM = 126, QM = 128, vm = 65533, _d = 42, ea = 43, FM = 44, UM = 58, EM = 59, Rs = 46, bM = 0, _M = 8, xM = 11, IM = 14, HM = 31, SM = 127, sr = -1, oy = 48, sy = 97, uy = 101, LM = 102, TM = 117, DM = 122, ly = 65, cy = 69, fy = 70, OM = 85, NM = 90, Nt = function(A) {
  return A >= oy && A <= 57;
}, MM = function(A) {
  return A >= 55296 && A <= 57343;
}, $a = function(A) {
  return Nt(A) || A >= ly && A <= fy || A >= sy && A <= LM;
}, KM = function(A) {
  return A >= sy && A <= DM;
}, RM = function(A) {
  return A >= ly && A <= NM;
}, $M = function(A) {
  return KM(A) || RM(A);
}, PM = function(A) {
  return A >= QM;
}, Il = function(A) {
  return A === vc || A === oM || A === sM;
}, yc = function(A) {
  return $M(A) || PM(A) || A === fM;
}, ym = function(A) {
  return yc(A) || Nt(A) || A === An;
}, kM = function(A) {
  return A >= bM && A <= _M || A === xM || A >= IM && A <= HM || A === SM;
}, wi = function(A, e) {
  return A !== Us ? !1 : e !== vc;
}, Hl = function(A, e, t) {
  return A === An ? yc(e) || wi(e, t) : yc(A) ? !0 : !!(A === Us && wi(A, e));
}, xd = function(A, e, t) {
  return A === ea || A === An ? Nt(e) ? !0 : e === Rs && Nt(t) : Nt(A === Rs ? e : A);
}, GM = function(A) {
  var e = 0, t = 1;
  (A[e] === ea || A[e] === An) && (A[e] === An && (t = -1), e++);
  for (var n = []; Nt(A[e]); )
    n.push(A[e++]);
  var i = n.length ? parseInt(st.apply(void 0, n), 10) : 0;
  A[e] === Rs && e++;
  for (var s = []; Nt(A[e]); )
    s.push(A[e++]);
  var l = s.length, c = l ? parseInt(st.apply(void 0, s), 10) : 0;
  (A[e] === cy || A[e] === uy) && e++;
  var f = 1;
  (A[e] === ea || A[e] === An) && (A[e] === An && (f = -1), e++);
  for (var p = []; Nt(A[e]); )
    p.push(A[e++]);
  var B = p.length ? parseInt(st.apply(void 0, p), 10) : 0;
  return t * (i + c * Math.pow(10, -l)) * Math.pow(10, f * B);
}, VM = {
  type: 2
  /* LEFT_PARENTHESIS_TOKEN */
}, WM = {
  type: 3
  /* RIGHT_PARENTHESIS_TOKEN */
}, XM = {
  type: 4
  /* COMMA_TOKEN */
}, qM = {
  type: 13
  /* SUFFIX_MATCH_TOKEN */
}, zM = {
  type: 8
  /* PREFIX_MATCH_TOKEN */
}, JM = {
  type: 21
  /* COLUMN_TOKEN */
}, jM = {
  type: 9
  /* DASH_MATCH_TOKEN */
}, YM = {
  type: 10
  /* INCLUDE_MATCH_TOKEN */
}, ZM = {
  type: 11
  /* LEFT_CURLY_BRACKET_TOKEN */
}, AK = {
  type: 12
  /* RIGHT_CURLY_BRACKET_TOKEN */
}, eK = {
  type: 14
  /* SUBSTRING_MATCH_TOKEN */
}, Sl = {
  type: 23
  /* BAD_URL_TOKEN */
}, tK = {
  type: 1
  /* BAD_STRING_TOKEN */
}, nK = {
  type: 25
  /* CDO_TOKEN */
}, rK = {
  type: 24
  /* CDC_TOKEN */
}, iK = {
  type: 26
  /* COLON_TOKEN */
}, aK = {
  type: 27
  /* SEMICOLON_TOKEN */
}, oK = {
  type: 28
  /* LEFT_SQUARE_BRACKET_TOKEN */
}, sK = {
  type: 29
  /* RIGHT_SQUARE_BRACKET_TOKEN */
}, uK = {
  type: 31
  /* WHITESPACE_TOKEN */
}, xh = {
  type: 32
  /* EOF_TOKEN */
}, dy = (
  /** @class */
  function() {
    function A() {
      this._value = [];
    }
    return A.prototype.write = function(e) {
      this._value = this._value.concat(Pc(e));
    }, A.prototype.read = function() {
      for (var e = [], t = this.consumeToken(); t !== xh; )
        e.push(t), t = this.consumeToken();
      return e;
    }, A.prototype.consumeToken = function() {
      var e = this.consumeCodePoint();
      switch (e) {
        case El:
          return this.consumeStringToken(El);
        case uM:
          var t = this.peekCodePoint(0), n = this.peekCodePoint(1), i = this.peekCodePoint(2);
          if (ym(t) || wi(n, i)) {
            var s = Hl(t, n, i) ? aM : iM, l = this.consumeName();
            return { type: 5, value: l, flags: s };
          }
          break;
        case lM:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), qM;
          break;
        case bl:
          return this.consumeStringToken(bl);
        case _l:
          return VM;
        case is:
          return WM;
        case _d:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), eK;
          break;
        case ea:
          if (xd(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case FM:
          return XM;
        case An:
          var c = e, f = this.peekCodePoint(0), p = this.peekCodePoint(1);
          if (xd(c, f, p))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          if (Hl(c, f, p))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          if (f === An && p === pM)
            return this.consumeCodePoint(), this.consumeCodePoint(), rK;
          break;
        case Rs:
          if (xd(e, this.peekCodePoint(0), this.peekCodePoint(1)))
            return this.reconsumeCodePoint(e), this.consumeNumericToken();
          break;
        case wm:
          if (this.peekCodePoint(0) === _d)
            for (this.consumeCodePoint(); ; ) {
              var B = this.consumeCodePoint();
              if (B === _d && (B = this.consumeCodePoint(), B === wm))
                return this.consumeToken();
              if (B === sr)
                return this.consumeToken();
            }
          break;
        case UM:
          return iK;
        case EM:
          return aK;
        case hM:
          if (this.peekCodePoint(0) === dM && this.peekCodePoint(1) === An && this.peekCodePoint(2) === An)
            return this.consumeCodePoint(), this.consumeCodePoint(), nK;
          break;
        case gM:
          var w = this.peekCodePoint(0), v = this.peekCodePoint(1), Q = this.peekCodePoint(2);
          if (Hl(w, v, Q)) {
            var l = this.consumeName();
            return { type: 7, value: l };
          }
          break;
        case BM:
          return oK;
        case Us:
          if (wi(e, this.peekCodePoint(0)))
            return this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
          break;
        case wM:
          return sK;
        case mM:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), zM;
          break;
        case vM:
          return ZM;
        case yM:
          return AK;
        case TM:
        case OM:
          var u = this.peekCodePoint(0), U = this.peekCodePoint(1);
          return u === ea && ($a(U) || U === xl) && (this.consumeCodePoint(), this.consumeUnicodeRangeToken()), this.reconsumeCodePoint(e), this.consumeIdentLikeToken();
        case mm:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), jM;
          if (this.peekCodePoint(0) === mm)
            return this.consumeCodePoint(), JM;
          break;
        case CM:
          if (this.peekCodePoint(0) === rs)
            return this.consumeCodePoint(), YM;
          break;
        case sr:
          return xh;
      }
      return Il(e) ? (this.consumeWhiteSpace(), uK) : Nt(e) ? (this.reconsumeCodePoint(e), this.consumeNumericToken()) : yc(e) ? (this.reconsumeCodePoint(e), this.consumeIdentLikeToken()) : { type: 6, value: st(e) };
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
      for (var n = !1; t === xl && e.length < 6; )
        e.push(t), t = this.consumeCodePoint(), n = !0;
      if (n) {
        var i = parseInt(st.apply(void 0, e.map(function(f) {
          return f === xl ? oy : f;
        })), 16), s = parseInt(st.apply(void 0, e.map(function(f) {
          return f === xl ? fy : f;
        })), 16);
        return { type: 30, start: i, end: s };
      }
      var l = parseInt(st.apply(void 0, e), 16);
      if (this.peekCodePoint(0) === An && $a(this.peekCodePoint(1))) {
        this.consumeCodePoint(), t = this.consumeCodePoint();
        for (var c = []; $a(t) && c.length < 6; )
          c.push(t), t = this.consumeCodePoint();
        var s = parseInt(st.apply(void 0, c), 16);
        return { type: 30, start: l, end: s };
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
        if (i === El || i === bl || i === _l || kM(i))
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
          return this._value.splice(0, n), tK;
        if (i === Us) {
          var s = this._value[n + 1];
          s !== sr && s !== void 0 && (s === vc ? (t += this.consumeStringSlice(n), n = -1, this._value.shift()) : wi(i, s) && (t += this.consumeStringSlice(n), t += st(this.consumeEscapedCodePoint()), n = -1));
        }
        n++;
      } while (!0);
    }, A.prototype.consumeNumber = function() {
      var e = [], t = Js, n = this.peekCodePoint(0);
      for ((n === ea || n === An) && e.push(this.consumeCodePoint()); Nt(this.peekCodePoint(0)); )
        e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0);
      var i = this.peekCodePoint(1);
      if (n === Rs && Nt(i))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Bm; Nt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      n = this.peekCodePoint(0), i = this.peekCodePoint(1);
      var s = this.peekCodePoint(2);
      if ((n === cy || n === uy) && ((i === ea || i === An) && Nt(s) || Nt(i)))
        for (e.push(this.consumeCodePoint(), this.consumeCodePoint()), t = Bm; Nt(this.peekCodePoint(0)); )
          e.push(this.consumeCodePoint());
      return [GM(e), t];
    }, A.prototype.consumeNumericToken = function() {
      var e = this.consumeNumber(), t = e[0], n = e[1], i = this.peekCodePoint(0), s = this.peekCodePoint(1), l = this.peekCodePoint(2);
      if (Hl(i, s, l)) {
        var c = this.consumeName();
        return { type: 15, number: t, flags: n, unit: c };
      }
      return i === cM ? (this.consumeCodePoint(), { type: 16, number: t, flags: n }) : { type: 17, number: t, flags: n };
    }, A.prototype.consumeEscapedCodePoint = function() {
      var e = this.consumeCodePoint();
      if ($a(e)) {
        for (var t = st(e); $a(this.peekCodePoint(0)) && t.length < 6; )
          t += st(this.consumeCodePoint());
        Il(this.peekCodePoint(0)) && this.consumeCodePoint();
        var n = parseInt(t, 16);
        return n === 0 || MM(n) || n > 1114111 ? vm : n;
      }
      return e === sr ? vm : e;
    }, A.prototype.consumeName = function() {
      for (var e = ""; ; ) {
        var t = this.consumeCodePoint();
        if (ym(t))
          e += st(t);
        else if (wi(t, this.peekCodePoint(0)))
          e += st(this.consumeEscapedCodePoint());
        else
          return this.reconsumeCodePoint(t), e;
      }
    }, A;
  }()
), hy = (
  /** @class */
  function() {
    function A(e) {
      this._tokens = e;
    }
    return A.create = function(e) {
      var t = new dy();
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
        if (n.type === 32 || cK(n, e))
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
      return typeof e > "u" ? xh : e;
    }, A.prototype.reconsumeToken = function(e) {
      this._tokens.unshift(e);
    }, A;
  }()
), js = function(A) {
  return A.type === 15;
}, mo = function(A) {
  return A.type === 17;
}, Pe = function(A) {
  return A.type === 20;
}, lK = function(A) {
  return A.type === 0;
}, Ih = function(A, e) {
  return Pe(A) && A.value === e;
}, py = function(A) {
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
}, cK = function(A, e) {
  return e === 11 && A.type === 12 || e === 28 && A.type === 29 ? !0 : e === 2 && A.type === 3;
}, bi = function(A) {
  return A.type === 17 || A.type === 15;
}, lt = function(A) {
  return A.type === 16 || bi(A);
}, gy = function(A) {
  return A.length > 1 ? [A[0], A[1]] : [A[0]];
}, Et = {
  type: 17,
  number: 0,
  flags: Js
}, Yp = {
  type: 16,
  number: 50,
  flags: Js
}, Ci = {
  type: 16,
  number: 100,
  flags: Js
}, hs = function(A, e, t) {
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
}, By = "deg", wy = "grad", my = "rad", vy = "turn", kc = {
  name: "angle",
  parse: function(A, e) {
    if (e.type === 15)
      switch (e.unit) {
        case By:
          return Math.PI * e.number / 180;
        case wy:
          return Math.PI / 200 * e.number;
        case my:
          return e.number;
        case vy:
          return Math.PI * 2 * e.number;
      }
    throw new Error("Unsupported angle type");
  }
}, yy = function(A) {
  return A.type === 15 && (A.unit === By || A.unit === wy || A.unit === my || A.unit === vy);
}, Cy = function(A) {
  var e = A.filter(Pe).map(function(t) {
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
      var t = fK[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported color function "' + e.name + '"');
      return t(A, e.values);
    }
    if (e.type === 5) {
      if (e.value.length === 3) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3);
        return Qi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), 1);
      }
      if (e.value.length === 4) {
        var n = e.value.substring(0, 1), i = e.value.substring(1, 2), s = e.value.substring(2, 3), l = e.value.substring(3, 4);
        return Qi(parseInt(n + n, 16), parseInt(i + i, 16), parseInt(s + s, 16), parseInt(l + l, 16) / 255);
      }
      if (e.value.length === 6) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6);
        return Qi(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), 1);
      }
      if (e.value.length === 8) {
        var n = e.value.substring(0, 2), i = e.value.substring(2, 4), s = e.value.substring(4, 6), l = e.value.substring(6, 8);
        return Qi(parseInt(n, 16), parseInt(i, 16), parseInt(s, 16), parseInt(l, 16) / 255);
      }
    }
    if (e.type === 20) {
      var c = Gr[e.value.toUpperCase()];
      if (typeof c < "u")
        return c;
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
}, Cm = function(A, e) {
  if (A.type === 17)
    return A.number;
  if (A.type === 16) {
    var t = e === 3 ? 1 : 255;
    return e === 3 ? A.number / 100 * t : Math.round(A.number / 100 * t);
  }
  return 0;
}, Qm = function(A, e) {
  var t = e.filter(po);
  if (t.length === 3) {
    var n = t.map(Cm), i = n[0], s = n[1], l = n[2];
    return Qi(i, s, l, 1);
  }
  if (t.length === 4) {
    var c = t.map(Cm), i = c[0], s = c[1], l = c[2], f = c[3];
    return Qi(i, s, l, f);
  }
  return 0;
};
function Id(A, e, t) {
  return t < 0 && (t += 1), t >= 1 && (t -= 1), t < 1 / 6 ? (e - A) * t * 6 + A : t < 1 / 2 ? e : t < 2 / 3 ? (e - A) * 6 * (2 / 3 - t) + A : A;
}
var Fm = function(A, e) {
  var t = e.filter(po), n = t[0], i = t[1], s = t[2], l = t[3], c = (n.type === 17 ? Fn(n.number) : kc.parse(A, n)) / (Math.PI * 2), f = lt(i) ? i.number / 100 : 0, p = lt(s) ? s.number / 100 : 0, B = typeof l < "u" && lt(l) ? Xe(l, 1) : 1;
  if (f === 0)
    return Qi(p * 255, p * 255, p * 255, 1);
  var w = p <= 0.5 ? p * (f + 1) : p + f - p * f, v = p * 2 - w, Q = Id(v, w, c + 1 / 3), u = Id(v, w, c), U = Id(v, w, c - 1 / 3);
  return Qi(Q * 255, u * 255, U * 255, B);
}, fK = {
  hsl: Fm,
  hsla: Fm,
  rgb: Qm,
  rgba: Qm
}, Es = function(A, e) {
  return Ui.parse(A, hy.create(e).parseComponentValue());
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
}, dK = {
  name: "background-clip",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (Pe(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, hK = {
  name: "background-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, Gc = function(A, e) {
  var t = Ui.parse(A, e[0]), n = e[1];
  return n && lt(n) ? { color: t, stop: n } : { color: t, stop: null };
}, Um = function(A, e) {
  var t = A[0], n = A[A.length - 1];
  t.stop === null && (t.stop = Et), n.stop === null && (n.stop = Ci);
  for (var i = [], s = 0, l = 0; l < A.length; l++) {
    var c = A[l].stop;
    if (c !== null) {
      var f = Xe(c, e);
      f > s ? i.push(f) : i.push(s), s = f;
    } else
      i.push(null);
  }
  for (var p = null, l = 0; l < i.length; l++) {
    var B = i[l];
    if (B === null)
      p === null && (p = l);
    else if (p !== null) {
      for (var w = l - p, v = i[p - 1], Q = (B - v) / (w + 1), u = 1; u <= w; u++)
        i[p + u - 1] = Q * u;
      p = null;
    }
  }
  return A.map(function(U, b) {
    var E = U.color;
    return { color: E, stop: Math.max(Math.min(1, i[b] / e), 0) };
  });
}, pK = function(A, e, t) {
  var n = e / 2, i = t / 2, s = Xe(A[0], e) - n, l = i - Xe(A[1], t);
  return (Math.atan2(l, s) + Math.PI * 2) % (Math.PI * 2);
}, gK = function(A, e, t) {
  var n = typeof A == "number" ? A : pK(A, e, t), i = Math.abs(e * Math.sin(n)) + Math.abs(t * Math.cos(n)), s = e / 2, l = t / 2, c = i / 2, f = Math.sin(n - Math.PI / 2) * c, p = Math.cos(n - Math.PI / 2) * c;
  return [i, s - p, s + p, l - f, l + f];
}, Gn = function(A, e) {
  return Math.sqrt(A * A + e * e);
}, Em = function(A, e, t, n, i) {
  var s = [
    [0, 0],
    [0, e],
    [A, 0],
    [A, e]
  ];
  return s.reduce(function(l, c) {
    var f = c[0], p = c[1], B = Gn(t - f, n - p);
    return (i ? B < l.optimumDistance : B > l.optimumDistance) ? {
      optimumCorner: c,
      optimumDistance: B
    } : l;
  }, {
    optimumDistance: i ? 1 / 0 : -1 / 0,
    optimumCorner: null
  }).optimumCorner;
}, BK = function(A, e, t, n, i) {
  var s = 0, l = 0;
  switch (A.size) {
    case 0:
      A.shape === 0 ? s = l = Math.min(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.min(Math.abs(e), Math.abs(e - n)), l = Math.min(Math.abs(t), Math.abs(t - i)));
      break;
    case 2:
      if (A.shape === 0)
        s = l = Math.min(Gn(e, t), Gn(e, t - i), Gn(e - n, t), Gn(e - n, t - i));
      else if (A.shape === 1) {
        var c = Math.min(Math.abs(t), Math.abs(t - i)) / Math.min(Math.abs(e), Math.abs(e - n)), f = Em(n, i, e, t, !0), p = f[0], B = f[1];
        s = Gn(p - e, (B - t) / c), l = c * s;
      }
      break;
    case 1:
      A.shape === 0 ? s = l = Math.max(Math.abs(e), Math.abs(e - n), Math.abs(t), Math.abs(t - i)) : A.shape === 1 && (s = Math.max(Math.abs(e), Math.abs(e - n)), l = Math.max(Math.abs(t), Math.abs(t - i)));
      break;
    case 3:
      if (A.shape === 0)
        s = l = Math.max(Gn(e, t), Gn(e, t - i), Gn(e - n, t), Gn(e - n, t - i));
      else if (A.shape === 1) {
        var c = Math.max(Math.abs(t), Math.abs(t - i)) / Math.max(Math.abs(e), Math.abs(e - n)), w = Em(n, i, e, t, !1), p = w[0], B = w[1];
        s = Gn(p - e, (B - t) / c), l = c * s;
      }
      break;
  }
  return Array.isArray(A.size) && (s = Xe(A.size[0], n), l = A.size.length === 2 ? Xe(A.size[1], i) : s), [s, l];
}, wK = function(A, e) {
  var t = Fn(180), n = [];
  return wr(e).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && l.value === "to") {
        t = Cy(i);
        return;
      } else if (yy(l)) {
        t = kc.parse(A, l);
        return;
      }
    }
    var c = Gc(A, i);
    n.push(c);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, Ll = function(A, e) {
  var t = Fn(180), n = [];
  return wr(e).forEach(function(i, s) {
    if (s === 0) {
      var l = i[0];
      if (l.type === 20 && ["top", "left", "right", "bottom"].indexOf(l.value) !== -1) {
        t = Cy(i);
        return;
      } else if (yy(l)) {
        t = (kc.parse(A, l) + Fn(270)) % Fn(360);
        return;
      }
    }
    var c = Gc(A, i);
    n.push(c);
  }), {
    angle: t,
    stops: n,
    type: 1
    /* LINEAR_GRADIENT */
  };
}, mK = function(A, e) {
  var t = Fn(180), n = [], i = 1, s = 0, l = 3, c = [];
  return wr(e).forEach(function(f, p) {
    var B = f[0];
    if (p === 0) {
      if (Pe(B) && B.value === "linear") {
        i = 1;
        return;
      } else if (Pe(B) && B.value === "radial") {
        i = 2;
        return;
      }
    }
    if (B.type === 18) {
      if (B.name === "from") {
        var w = Ui.parse(A, B.values[0]);
        n.push({ stop: Et, color: w });
      } else if (B.name === "to") {
        var w = Ui.parse(A, B.values[0]);
        n.push({ stop: Ci, color: w });
      } else if (B.name === "color-stop") {
        var v = B.values.filter(po);
        if (v.length === 2) {
          var w = Ui.parse(A, v[1]), Q = v[0];
          mo(Q) && n.push({
            stop: { type: 16, number: Q.number * 100, flags: Q.flags },
            color: w
          });
        }
      }
    }
  }), i === 1 ? {
    angle: (t + Fn(180)) % Fn(360),
    stops: n,
    type: i
  } : { size: l, shape: s, stops: n, position: c, type: i };
}, Qy = "closest-side", Fy = "farthest-side", Uy = "closest-corner", Ey = "farthest-corner", by = "circle", _y = "ellipse", xy = "cover", Iy = "contain", vK = function(A, e) {
  var t = 0, n = 3, i = [], s = [];
  return wr(e).forEach(function(l, c) {
    var f = !0;
    if (c === 0) {
      var p = !1;
      f = l.reduce(function(w, v) {
        if (p)
          if (Pe(v))
            switch (v.value) {
              case "center":
                return s.push(Yp), w;
              case "top":
              case "left":
                return s.push(Et), w;
              case "right":
              case "bottom":
                return s.push(Ci), w;
            }
          else (lt(v) || bi(v)) && s.push(v);
        else if (Pe(v))
          switch (v.value) {
            case by:
              return t = 0, !1;
            case _y:
              return t = 1, !1;
            case "at":
              return p = !0, !1;
            case Qy:
              return n = 0, !1;
            case xy:
            case Fy:
              return n = 1, !1;
            case Iy:
            case Uy:
              return n = 2, !1;
            case Ey:
              return n = 3, !1;
          }
        else if (bi(v) || lt(v))
          return Array.isArray(n) || (n = []), n.push(v), !1;
        return w;
      }, f);
    }
    if (f) {
      var B = Gc(A, l);
      i.push(B);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, Tl = function(A, e) {
  var t = 0, n = 3, i = [], s = [];
  return wr(e).forEach(function(l, c) {
    var f = !0;
    if (c === 0 ? f = l.reduce(function(B, w) {
      if (Pe(w))
        switch (w.value) {
          case "center":
            return s.push(Yp), !1;
          case "top":
          case "left":
            return s.push(Et), !1;
          case "right":
          case "bottom":
            return s.push(Ci), !1;
        }
      else if (lt(w) || bi(w))
        return s.push(w), !1;
      return B;
    }, f) : c === 1 && (f = l.reduce(function(B, w) {
      if (Pe(w))
        switch (w.value) {
          case by:
            return t = 0, !1;
          case _y:
            return t = 1, !1;
          case Iy:
          case Qy:
            return n = 0, !1;
          case Fy:
            return n = 1, !1;
          case Uy:
            return n = 2, !1;
          case xy:
          case Ey:
            return n = 3, !1;
        }
      else if (bi(w) || lt(w))
        return Array.isArray(n) || (n = []), n.push(w), !1;
      return B;
    }, f)), f) {
      var p = Gc(A, l);
      i.push(p);
    }
  }), {
    size: n,
    shape: t,
    stops: i,
    position: s,
    type: 2
    /* RADIAL_GRADIENT */
  };
}, yK = function(A) {
  return A.type === 1;
}, CK = function(A) {
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
      var n = Hy[e.name];
      if (typeof n > "u")
        throw new Error('Attempting to parse an unsupported image function "' + e.name + '"');
      return n(A, e.values);
    }
    throw new Error("Unsupported image type " + e.type);
  }
};
function QK(A) {
  return !(A.type === 20 && A.value === "none") && (A.type !== 18 || !!Hy[A.name]);
}
var Hy = {
  "linear-gradient": wK,
  "-moz-linear-gradient": Ll,
  "-ms-linear-gradient": Ll,
  "-o-linear-gradient": Ll,
  "-webkit-linear-gradient": Ll,
  "radial-gradient": vK,
  "-moz-radial-gradient": Tl,
  "-ms-radial-gradient": Tl,
  "-o-radial-gradient": Tl,
  "-webkit-radial-gradient": Tl,
  "-webkit-gradient": mK
}, FK = {
  name: "background-image",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    var t = e[0];
    return t.type === 20 && t.value === "none" ? [] : e.filter(function(n) {
      return po(n) && QK(n);
    }).map(function(n) {
      return Zp.parse(A, n);
    });
  }
}, UK = {
  name: "background-origin",
  initialValue: "border-box",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.map(function(t) {
      if (Pe(t))
        switch (t.value) {
          case "padding-box":
            return 1;
          case "content-box":
            return 2;
        }
      return 0;
    });
  }
}, EK = {
  name: "background-position",
  initialValue: "0% 0%",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return wr(e).map(function(t) {
      return t.filter(lt);
    }).map(gy);
  }
}, bK = {
  name: "background-repeat",
  initialValue: "repeat",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return wr(e).map(function(t) {
      return t.filter(Pe).map(function(n) {
        return n.value;
      }).join(" ");
    }).map(_K);
  }
}, _K = function(A) {
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
var xK = {
  name: "background-size",
  initialValue: "0",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return wr(e).map(function(t) {
      return t.filter(IK);
    });
  }
}, IK = function(A) {
  return Pe(A) || lt(A);
}, Vc = function(A) {
  return {
    name: "border-" + A + "-color",
    initialValue: "transparent",
    prefix: !1,
    type: 3,
    format: "color"
  };
}, HK = Vc("top"), SK = Vc("right"), LK = Vc("bottom"), TK = Vc("left"), Wc = function(A) {
  return {
    name: "border-radius-" + A,
    initialValue: "0 0",
    prefix: !1,
    type: 1,
    parse: function(e, t) {
      return gy(t.filter(lt));
    }
  };
}, DK = Wc("top-left"), OK = Wc("top-right"), NK = Wc("bottom-right"), MK = Wc("bottom-left"), Xc = function(A) {
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
}, KK = Xc("top"), RK = Xc("right"), $K = Xc("bottom"), PK = Xc("left"), qc = function(A) {
  return {
    name: "border-" + A + "-width",
    initialValue: "0",
    type: 0,
    prefix: !1,
    parse: function(e, t) {
      return js(t) ? t.number : 0;
    }
  };
}, kK = qc("top"), GK = qc("right"), VK = qc("bottom"), WK = qc("left"), XK = {
  name: "color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, qK = {
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
}, zK = {
  name: "display",
  initialValue: "inline-block",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Pe).reduce(
      function(t, n) {
        return t | JK(n.value);
      },
      0
      /* NONE */
    );
  }
}, JK = function(A) {
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
}, jK = {
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
}, YK = {
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
var ZK = {
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
}, AR = {
  name: "line-height",
  initialValue: "normal",
  prefix: !1,
  type: 4
  /* TOKEN_VALUE */
}, bm = function(A, e) {
  return Pe(A) && A.value === "normal" ? 1.2 * e : A.type === 17 ? e * A.number : lt(A) ? Xe(A, e) : e;
}, eR = {
  name: "list-style-image",
  initialValue: "none",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return e.type === 20 && e.value === "none" ? null : Zp.parse(A, e);
  }
}, tR = {
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
}, Hh = {
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
}, nR = zc("top"), rR = zc("right"), iR = zc("bottom"), aR = zc("left"), oR = {
  name: "overflow",
  initialValue: "visible",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Pe).map(function(t) {
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
}, sR = {
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
}, uR = Jc("top"), lR = Jc("right"), cR = Jc("bottom"), fR = Jc("left"), dR = {
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
}, hR = {
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
}, pR = {
  name: "text-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Ih(e[0], "none") ? [] : wr(e).map(function(t) {
      for (var n = {
        color: Gr.TRANSPARENT,
        offsetX: Et,
        offsetY: Et,
        blur: Et
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        bi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : n.blur = l, i++) : n.color = Ui.parse(A, l);
      }
      return n;
    });
  }
}, gR = {
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
}, BR = {
  name: "transform",
  initialValue: "none",
  prefix: !0,
  type: 0,
  parse: function(A, e) {
    if (e.type === 20 && e.value === "none")
      return null;
    if (e.type === 18) {
      var t = vR[e.name];
      if (typeof t > "u")
        throw new Error('Attempting to parse an unsupported transform function "' + e.name + '"');
      return t(e.values);
    }
    return null;
  }
}, wR = function(A) {
  var e = A.filter(function(t) {
    return t.type === 17;
  }).map(function(t) {
    return t.number;
  });
  return e.length === 6 ? e : null;
}, mR = function(A) {
  var e = A.filter(function(f) {
    return f.type === 17;
  }).map(function(f) {
    return f.number;
  }), t = e[0], n = e[1];
  e[2], e[3];
  var i = e[4], s = e[5];
  e[6], e[7], e[8], e[9], e[10], e[11];
  var l = e[12], c = e[13];
  return e[14], e[15], e.length === 16 ? [t, n, i, s, l, c] : null;
}, vR = {
  matrix: wR,
  matrix3d: mR
}, _m = {
  type: 16,
  number: 50,
  flags: Js
}, yR = [_m, _m], CR = {
  name: "transform-origin",
  initialValue: "50% 50%",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    var t = e.filter(lt);
    return t.length !== 2 ? yR : [t[0], t[1]];
  }
}, QR = {
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
var FR = {
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
}, UR = {
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
}, Sy = {
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
}, ER = {
  name: "opacity",
  initialValue: "1",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return mo(e) ? e.number : 1;
  }
}, bR = {
  name: "text-decoration-color",
  initialValue: "transparent",
  prefix: !1,
  type: 3,
  format: "color"
}, _R = {
  name: "text-decoration-line",
  initialValue: "none",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(Pe).map(function(t) {
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
}, xR = {
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
}, IR = {
  name: "font-size",
  initialValue: "0",
  prefix: !1,
  type: 3,
  format: "length"
}, HR = {
  name: "font-weight",
  initialValue: "normal",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    if (mo(e))
      return e.number;
    if (Pe(e))
      switch (e.value) {
        case "bold":
          return 700;
        case "normal":
        default:
          return 400;
      }
    return 400;
  }
}, SR = {
  name: "font-variant",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.filter(Pe).map(function(t) {
      return t.value;
    });
  }
}, LR = {
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
}, TR = {
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
}, DR = {
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
    for (var n = [], i = e.filter(py), s = 0; s < i.length; s++) {
      var l = i[s], c = i[s + 1];
      if (l.type === 20) {
        var f = c && mo(c) ? c.number : 1;
        n.push({ counter: l.value, increment: f });
      }
    }
    return n;
  }
}, OR = {
  name: "counter-reset",
  initialValue: "none",
  prefix: !0,
  type: 1,
  parse: function(A, e) {
    if (e.length === 0)
      return [];
    for (var t = [], n = e.filter(py), i = 0; i < n.length; i++) {
      var s = n[i], l = n[i + 1];
      if (Pe(s) && s.value !== "none") {
        var c = l && mo(l) ? l.number : 0;
        t.push({ counter: s.value, reset: c });
      }
    }
    return t;
  }
}, NR = {
  name: "duration",
  initialValue: "0s",
  prefix: !1,
  type: 1,
  parse: function(A, e) {
    return e.filter(js).map(function(t) {
      return Sy.parse(A, t);
    });
  }
}, MR = {
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
    var n = [], i = e.filter(lK);
    if (i.length % 2 !== 0)
      return null;
    for (var s = 0; s < i.length; s += 2) {
      var l = i[s].value, c = i[s + 1].value;
      n.push({ open: l, close: c });
    }
    return n;
  }
}, xm = function(A, e, t) {
  if (!A)
    return "";
  var n = A[Math.min(e, A.length - 1)];
  return n ? t ? n.open : n.close : "";
}, KR = {
  name: "box-shadow",
  initialValue: "none",
  type: 1,
  prefix: !1,
  parse: function(A, e) {
    return e.length === 1 && Ih(e[0], "none") ? [] : wr(e).map(function(t) {
      for (var n = {
        color: 255,
        offsetX: Et,
        offsetY: Et,
        blur: Et,
        spread: Et,
        inset: !1
      }, i = 0, s = 0; s < t.length; s++) {
        var l = t[s];
        Ih(l, "inset") ? n.inset = !0 : bi(l) ? (i === 0 ? n.offsetX = l : i === 1 ? n.offsetY = l : i === 2 ? n.blur = l : n.spread = l, i++) : n.color = Ui.parse(A, l);
      }
      return n;
    });
  }
}, RR = {
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
    return e.filter(Pe).forEach(function(i) {
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
}, $R = {
  name: "-webkit-text-stroke-color",
  initialValue: "currentcolor",
  prefix: !1,
  type: 3,
  format: "color"
}, PR = {
  name: "-webkit-text-stroke-width",
  initialValue: "0",
  type: 0,
  prefix: !1,
  parse: function(A, e) {
    return js(e) ? e.number : 0;
  }
}, kR = (
  /** @class */
  function() {
    function A(e, t) {
      var n, i;
      this.animationDuration = MA(e, NR, t.animationDuration), this.backgroundClip = MA(e, dK, t.backgroundClip), this.backgroundColor = MA(e, hK, t.backgroundColor), this.backgroundImage = MA(e, FK, t.backgroundImage), this.backgroundOrigin = MA(e, UK, t.backgroundOrigin), this.backgroundPosition = MA(e, EK, t.backgroundPosition), this.backgroundRepeat = MA(e, bK, t.backgroundRepeat), this.backgroundSize = MA(e, xK, t.backgroundSize), this.borderTopColor = MA(e, HK, t.borderTopColor), this.borderRightColor = MA(e, SK, t.borderRightColor), this.borderBottomColor = MA(e, LK, t.borderBottomColor), this.borderLeftColor = MA(e, TK, t.borderLeftColor), this.borderTopLeftRadius = MA(e, DK, t.borderTopLeftRadius), this.borderTopRightRadius = MA(e, OK, t.borderTopRightRadius), this.borderBottomRightRadius = MA(e, NK, t.borderBottomRightRadius), this.borderBottomLeftRadius = MA(e, MK, t.borderBottomLeftRadius), this.borderTopStyle = MA(e, KK, t.borderTopStyle), this.borderRightStyle = MA(e, RK, t.borderRightStyle), this.borderBottomStyle = MA(e, $K, t.borderBottomStyle), this.borderLeftStyle = MA(e, PK, t.borderLeftStyle), this.borderTopWidth = MA(e, kK, t.borderTopWidth), this.borderRightWidth = MA(e, GK, t.borderRightWidth), this.borderBottomWidth = MA(e, VK, t.borderBottomWidth), this.borderLeftWidth = MA(e, WK, t.borderLeftWidth), this.boxShadow = MA(e, KR, t.boxShadow), this.color = MA(e, XK, t.color), this.direction = MA(e, qK, t.direction), this.display = MA(e, zK, t.display), this.float = MA(e, jK, t.cssFloat), this.fontFamily = MA(e, xR, t.fontFamily), this.fontSize = MA(e, IR, t.fontSize), this.fontStyle = MA(e, LR, t.fontStyle), this.fontVariant = MA(e, SR, t.fontVariant), this.fontWeight = MA(e, HR, t.fontWeight), this.letterSpacing = MA(e, YK, t.letterSpacing), this.lineBreak = MA(e, ZK, t.lineBreak), this.lineHeight = MA(e, AR, t.lineHeight), this.listStyleImage = MA(e, eR, t.listStyleImage), this.listStylePosition = MA(e, tR, t.listStylePosition), this.listStyleType = MA(e, Hh, t.listStyleType), this.marginTop = MA(e, nR, t.marginTop), this.marginRight = MA(e, rR, t.marginRight), this.marginBottom = MA(e, iR, t.marginBottom), this.marginLeft = MA(e, aR, t.marginLeft), this.opacity = MA(e, ER, t.opacity);
      var s = MA(e, oR, t.overflow);
      this.overflowX = s[0], this.overflowY = s[s.length > 1 ? 1 : 0], this.overflowWrap = MA(e, sR, t.overflowWrap), this.paddingTop = MA(e, uR, t.paddingTop), this.paddingRight = MA(e, lR, t.paddingRight), this.paddingBottom = MA(e, cR, t.paddingBottom), this.paddingLeft = MA(e, fR, t.paddingLeft), this.paintOrder = MA(e, RR, t.paintOrder), this.position = MA(e, hR, t.position), this.textAlign = MA(e, dR, t.textAlign), this.textDecorationColor = MA(e, bR, (n = t.textDecorationColor) !== null && n !== void 0 ? n : t.color), this.textDecorationLine = MA(e, _R, (i = t.textDecorationLine) !== null && i !== void 0 ? i : t.textDecoration), this.textShadow = MA(e, pR, t.textShadow), this.textTransform = MA(e, gR, t.textTransform), this.transform = MA(e, BR, t.transform), this.transformOrigin = MA(e, CR, t.transformOrigin), this.visibility = MA(e, QR, t.visibility), this.webkitTextStrokeColor = MA(e, $R, t.webkitTextStrokeColor), this.webkitTextStrokeWidth = MA(e, PR, t.webkitTextStrokeWidth), this.wordBreak = MA(e, FR, t.wordBreak), this.zIndex = MA(e, UR, t.zIndex);
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
), GR = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.content = MA(e, TR, t.content), this.quotes = MA(e, MR, t.quotes);
    }
    return A;
  }()
), Im = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.counterIncrement = MA(e, DR, t.counterIncrement), this.counterReset = MA(e, OR, t.counterReset);
    }
    return A;
  }()
), MA = function(A, e, t) {
  var n = new dy(), i = t !== null && typeof t < "u" ? t.toString() : e.initialValue;
  n.write(i);
  var s = new hy(n.read());
  switch (e.type) {
    case 2:
      var l = s.parseComponentValue();
      return e.parse(A, Pe(l) ? l.value : e.initialValue);
    case 0:
      return e.parse(A, s.parseComponentValue());
    case 1:
      return e.parse(A, s.parseComponentValues());
    case 4:
      return s.parseComponentValue();
    case 3:
      switch (e.format) {
        case "angle":
          return kc.parse(A, s.parseComponentValue());
        case "color":
          return Ui.parse(A, s.parseComponentValue());
        case "image":
          return Zp.parse(A, s.parseComponentValue());
        case "length":
          var c = s.parseComponentValue();
          return bi(c) ? c : Et;
        case "length-percentage":
          var f = s.parseComponentValue();
          return lt(f) ? f : Et;
        case "time":
          return Sy.parse(A, s.parseComponentValue());
      }
      break;
  }
}, VR = "data-html2canvas-debug", WR = function(A) {
  var e = A.getAttribute(VR);
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
}, Sh = function(A, e) {
  var t = WR(A);
  return t === 1 || e === t;
}, mr = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      if (this.context = e, this.textNodes = [], this.elements = [], this.flags = 0, Sh(
        t,
        3
        /* PARSE */
      ))
        debugger;
      this.styles = new kR(e, window.getComputedStyle(t, null)), Dh(t) && (this.styles.animationDuration.some(function(n) {
        return n > 0;
      }) && (t.style.animationDuration = "0s"), this.styles.transform !== null && (t.style.transform = "none")), this.bounds = $c(this.context, t), Sh(
        t,
        4
        /* RENDER */
      ) && (this.flags |= 16);
    }
    return A;
  }()
), XR = "AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=", Hm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ps = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Dl = 0; Dl < Hm.length; Dl++)
  ps[Hm.charCodeAt(Dl)] = Dl;
var qR = function(A) {
  var e = A.length * 0.75, t = A.length, n, i = 0, s, l, c, f;
  A[A.length - 1] === "=" && (e--, A[A.length - 2] === "=" && e--);
  var p = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && typeof Uint8Array.prototype.slice < "u" ? new ArrayBuffer(e) : new Array(e), B = Array.isArray(p) ? p : new Uint8Array(p);
  for (n = 0; n < t; n += 4)
    s = ps[A.charCodeAt(n)], l = ps[A.charCodeAt(n + 1)], c = ps[A.charCodeAt(n + 2)], f = ps[A.charCodeAt(n + 3)], B[i++] = s << 2 | l >> 4, B[i++] = (l & 15) << 4 | c >> 2, B[i++] = (c & 3) << 6 | f & 63;
  return p;
}, zR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 2)
    t.push(A[n + 1] << 8 | A[n]);
  return t;
}, JR = function(A) {
  for (var e = A.length, t = [], n = 0; n < e; n += 4)
    t.push(A[n + 3] << 24 | A[n + 2] << 16 | A[n + 1] << 8 | A[n]);
  return t;
}, ia = 5, Ag = 11, Hd = 2, jR = Ag - ia, Ly = 65536 >> ia, YR = 1 << ia, Sd = YR - 1, ZR = 1024 >> ia, A$ = Ly + ZR, e$ = A$, t$ = 32, n$ = e$ + t$, r$ = 65536 >> Ag, i$ = 1 << jR, a$ = i$ - 1, Sm = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint16Array(Array.prototype.slice.call(A, e, t));
}, o$ = function(A, e, t) {
  return A.slice ? A.slice(e, t) : new Uint32Array(Array.prototype.slice.call(A, e, t));
}, s$ = function(A, e) {
  var t = qR(A), n = Array.isArray(t) ? JR(t) : new Uint32Array(t), i = Array.isArray(t) ? zR(t) : new Uint16Array(t), s = 24, l = Sm(i, s / 2, n[4] / 2), c = n[5] === 2 ? Sm(i, (s + n[4]) / 2) : o$(n, Math.ceil((s + n[4]) / 4));
  return new u$(n[0], n[1], n[2], n[3], l, c);
}, u$ = (
  /** @class */
  function() {
    function A(e, t, n, i, s, l) {
      this.initialValue = e, this.errorValue = t, this.highStart = n, this.highValueIndex = i, this.index = s, this.data = l;
    }
    return A.prototype.get = function(e) {
      var t;
      if (e >= 0) {
        if (e < 55296 || e > 56319 && e <= 65535)
          return t = this.index[e >> ia], t = (t << Hd) + (e & Sd), this.data[t];
        if (e <= 65535)
          return t = this.index[Ly + (e - 55296 >> ia)], t = (t << Hd) + (e & Sd), this.data[t];
        if (e < this.highStart)
          return t = n$ - r$ + (e >> Ag), t = this.index[t], t += e >> ia & a$, t = this.index[t], t = (t << Hd) + (e & Sd), this.data[t];
        if (e <= 1114111)
          return this.data[this.highValueIndex];
      }
      return this.errorValue;
    }, A;
  }()
), Lm = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", l$ = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (var Ol = 0; Ol < Lm.length; Ol++)
  l$[Lm.charCodeAt(Ol)] = Ol;
var c$ = 1, Ld = 2, Td = 3, Tm = 4, Dm = 5, f$ = 7, Om = 8, Dd = 9, Od = 10, Nm = 11, Mm = 12, Km = 13, Rm = 14, Nd = 15, d$ = function(A) {
  for (var e = [], t = 0, n = A.length; t < n; ) {
    var i = A.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < n) {
      var s = A.charCodeAt(t++);
      (s & 64512) === 56320 ? e.push(((i & 1023) << 10) + (s & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}, h$ = function() {
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
}, p$ = s$(XR), yn = "×", Md = "÷", g$ = function(A) {
  return p$.get(A);
}, B$ = function(A, e, t) {
  var n = t - 2, i = e[n], s = e[t - 1], l = e[t];
  if (s === Ld && l === Td)
    return yn;
  if (s === Ld || s === Td || s === Tm || l === Ld || l === Td || l === Tm)
    return Md;
  if (s === Om && [Om, Dd, Nm, Mm].indexOf(l) !== -1 || (s === Nm || s === Dd) && (l === Dd || l === Od) || (s === Mm || s === Od) && l === Od || l === Km || l === Dm || l === f$ || s === c$)
    return yn;
  if (s === Km && l === Rm) {
    for (; i === Dm; )
      i = e[--n];
    if (i === Rm)
      return yn;
  }
  if (s === Nd && l === Nd) {
    for (var c = 0; i === Nd; )
      c++, i = e[--n];
    if (c % 2 === 0)
      return yn;
  }
  return Md;
}, w$ = function(A) {
  var e = d$(A), t = e.length, n = 0, i = 0, s = e.map(g$);
  return {
    next: function() {
      if (n >= t)
        return { done: !0, value: null };
      for (var l = yn; n < t && (l = B$(e, s, ++n)) === yn; )
        ;
      if (l !== yn || n === t) {
        var c = h$.apply(null, e.slice(i, n));
        return i = n, { value: c, done: !1 };
      }
      return { done: !0, value: null };
    }
  };
}, m$ = function(A) {
  for (var e = w$(A), t = [], n; !(n = e.next()).done; )
    n.value && t.push(n.value.slice());
  return t;
}, v$ = function(A) {
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
}, y$ = function(A) {
  var e = A.createElement("boundtest");
  e.style.width = "50px", e.style.display = "block", e.style.fontSize = "12px", e.style.letterSpacing = "0px", e.style.wordSpacing = "0px", A.body.appendChild(e);
  var t = A.createRange();
  e.innerHTML = typeof "".repeat == "function" ? "&#128104;".repeat(10) : "";
  var n = e.firstChild, i = Pc(n.data).map(function(f) {
    return st(f);
  }), s = 0, l = {}, c = i.every(function(f, p) {
    t.setStart(n, s), t.setEnd(n, s + f.length);
    var B = t.getBoundingClientRect();
    s += f.length;
    var w = B.x > l.x || B.y > l.y;
    return l = B, p === 0 ? !0 : w;
  });
  return A.body.removeChild(e), c;
}, C$ = function() {
  return typeof new Image().crossOrigin < "u";
}, Q$ = function() {
  return typeof new XMLHttpRequest().responseType == "string";
}, F$ = function(A) {
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
}, $m = function(A) {
  return A[0] === 0 && A[1] === 255 && A[2] === 0 && A[3] === 255;
}, U$ = function(A) {
  var e = A.createElement("canvas"), t = 100;
  e.width = t, e.height = t;
  var n = e.getContext("2d");
  if (!n)
    return Promise.reject(!1);
  n.fillStyle = "rgb(0, 255, 0)", n.fillRect(0, 0, t, t);
  var i = new Image(), s = e.toDataURL();
  i.src = s;
  var l = Lh(t, t, 0, 0, i);
  return n.fillStyle = "red", n.fillRect(0, 0, t, t), Pm(l).then(function(c) {
    n.drawImage(c, 0, 0);
    var f = n.getImageData(0, 0, t, t).data;
    n.fillStyle = "red", n.fillRect(0, 0, t, t);
    var p = A.createElement("div");
    return p.style.backgroundImage = "url(" + s + ")", p.style.height = t + "px", $m(f) ? Pm(Lh(t, t, 0, 0, p)) : Promise.reject(!1);
  }).then(function(c) {
    return n.drawImage(c, 0, 0), $m(n.getImageData(0, 0, t, t).data);
  }).catch(function() {
    return !1;
  });
}, Lh = function(A, e, t, n, i) {
  var s = "http://www.w3.org/2000/svg", l = document.createElementNS(s, "svg"), c = document.createElementNS(s, "foreignObject");
  return l.setAttributeNS(null, "width", A.toString()), l.setAttributeNS(null, "height", e.toString()), c.setAttributeNS(null, "width", "100%"), c.setAttributeNS(null, "height", "100%"), c.setAttributeNS(null, "x", t.toString()), c.setAttributeNS(null, "y", n.toString()), c.setAttributeNS(null, "externalResourcesRequired", "true"), l.appendChild(c), c.appendChild(i), l;
}, Pm = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      return e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, Ft = {
  get SUPPORT_RANGE_BOUNDS() {
    var A = v$(document);
    return Object.defineProperty(Ft, "SUPPORT_RANGE_BOUNDS", { value: A }), A;
  },
  get SUPPORT_WORD_BREAKING() {
    var A = Ft.SUPPORT_RANGE_BOUNDS && y$(document);
    return Object.defineProperty(Ft, "SUPPORT_WORD_BREAKING", { value: A }), A;
  },
  get SUPPORT_SVG_DRAWING() {
    var A = F$(document);
    return Object.defineProperty(Ft, "SUPPORT_SVG_DRAWING", { value: A }), A;
  },
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    var A = typeof Array.from == "function" && typeof window.fetch == "function" ? U$(document) : Promise.resolve(!1);
    return Object.defineProperty(Ft, "SUPPORT_FOREIGNOBJECT_DRAWING", { value: A }), A;
  },
  get SUPPORT_CORS_IMAGES() {
    var A = C$();
    return Object.defineProperty(Ft, "SUPPORT_CORS_IMAGES", { value: A }), A;
  },
  get SUPPORT_RESPONSE_TYPE() {
    var A = Q$();
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
), E$ = function(A, e, t, n) {
  var i = x$(e, t), s = [], l = 0;
  return i.forEach(function(c) {
    if (t.textDecorationLine.length || c.trim().length > 0)
      if (Ft.SUPPORT_RANGE_BOUNDS) {
        var f = km(n, l, c.length).getClientRects();
        if (f.length > 1) {
          var p = eg(c), B = 0;
          p.forEach(function(v) {
            s.push(new _s(v, qr.fromDOMRectList(A, km(n, B + l, v.length).getClientRects()))), B += v.length;
          });
        } else
          s.push(new _s(c, qr.fromDOMRectList(A, f)));
      } else {
        var w = n.splitText(c.length);
        s.push(new _s(c, b$(A, n))), n = w;
      }
    else Ft.SUPPORT_RANGE_BOUNDS || (n = n.splitText(c.length));
    l += c.length;
  }), s;
}, b$ = function(A, e) {
  var t = e.ownerDocument;
  if (t) {
    var n = t.createElement("html2canvaswrapper");
    n.appendChild(e.cloneNode(!0));
    var i = e.parentNode;
    if (i) {
      i.replaceChild(n, e);
      var s = $c(A, n);
      return n.firstChild && i.replaceChild(n.firstChild, n), s;
    }
  }
  return qr.EMPTY;
}, km = function(A, e, t) {
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
  return m$(A);
}, _$ = function(A, e) {
  if (Ft.SUPPORT_NATIVE_TEXT_SEGMENTATION) {
    var t = new Intl.Segmenter(void 0, {
      granularity: "word"
    });
    return Array.from(t.segment(A)).map(function(n) {
      return n.segment;
    });
  }
  return H$(A, e);
}, x$ = function(A, e) {
  return e.letterSpacing !== 0 ? eg(A) : _$(A, e);
}, I$ = [32, 160, 4961, 65792, 65793, 4153, 4241], H$ = function(A, e) {
  for (var t = rM(A, {
    lineBreak: e.lineBreak,
    wordBreak: e.overflowWrap === "break-word" ? "break-word" : e.wordBreak
  }), n = [], i, s = function() {
    if (i.value) {
      var l = i.value.slice(), c = Pc(l), f = "";
      c.forEach(function(p) {
        I$.indexOf(p) === -1 ? f += st(p) : (f.length && n.push(f), n.push(st(p)), f = "");
      }), f.length && n.push(f);
    }
  }; !(i = t.next()).done; )
    s();
  return n;
}, S$ = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t, n) {
      this.text = L$(t.data, n.textTransform), this.textBounds = E$(e, this.text, n, t);
    }
    return A;
  }()
), L$ = function(A, e) {
  switch (e) {
    case 1:
      return A.toLowerCase();
    case 3:
      return A.replace(T$, D$);
    case 2:
      return A.toUpperCase();
    default:
      return A;
  }
}, T$ = /(^|\s|:|-|\(|\))([a-z])/g, D$ = function(A, e, t) {
  return A.length > 0 ? e + t.toUpperCase() : A;
}, Ty = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.src = n.currentSrc || n.src, i.intrinsicWidth = n.naturalWidth, i.intrinsicHeight = n.naturalHeight, i.context.cache.addImage(i.src), i;
    }
    return e;
  }(mr)
), Dy = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.canvas = n, i.intrinsicWidth = n.width, i.intrinsicHeight = n.height, i;
    }
    return e;
  }(mr)
), Oy = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = new XMLSerializer(), l = $c(t, n);
      return n.setAttribute("width", l.width + "px"), n.setAttribute("height", l.height + "px"), i.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(n)), i.intrinsicWidth = n.width.baseVal.value, i.intrinsicHeight = n.height.baseVal.value, i.context.cache.addImage(i.svg), i;
    }
    return e;
  }(mr)
), Ny = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(mr)
), Th = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.start = n.start, i.reversed = typeof n.reversed == "boolean" && n.reversed === !0, i;
    }
    return e;
  }(mr)
), O$ = [
  {
    type: 15,
    flags: 0,
    unit: "px",
    number: 3
  }
], N$ = [
  {
    type: 16,
    flags: 0,
    number: 50
  }
], M$ = function(A) {
  return A.width > A.height ? new qr(A.left + (A.width - A.height) / 2, A.top, A.height, A.height) : A.width < A.height ? new qr(A.left, A.top + (A.height - A.width) / 2, A.width, A.width) : A;
}, K$ = function(A) {
  var e = A.type === R$ ? new Array(A.value.length + 1).join("•") : A.value;
  return e.length === 0 ? A.placeholder || "" : e;
}, Qc = "checkbox", Fc = "radio", R$ = "password", Gm = 707406591, tg = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      switch (i.type = n.type.toLowerCase(), i.checked = n.checked, i.value = K$(n), (i.type === Qc || i.type === Fc) && (i.styles.backgroundColor = 3739148031, i.styles.borderTopColor = i.styles.borderRightColor = i.styles.borderBottomColor = i.styles.borderLeftColor = 2779096575, i.styles.borderTopWidth = i.styles.borderRightWidth = i.styles.borderBottomWidth = i.styles.borderLeftWidth = 1, i.styles.borderTopStyle = i.styles.borderRightStyle = i.styles.borderBottomStyle = i.styles.borderLeftStyle = 1, i.styles.backgroundClip = [
        0
        /* BORDER_BOX */
      ], i.styles.backgroundOrigin = [
        0
        /* BORDER_BOX */
      ], i.bounds = M$(i.bounds)), i.type) {
        case Qc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = O$;
          break;
        case Fc:
          i.styles.borderTopRightRadius = i.styles.borderTopLeftRadius = i.styles.borderBottomRightRadius = i.styles.borderBottomLeftRadius = N$;
          break;
      }
      return i;
    }
    return e;
  }(mr)
), My = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this, s = n.options[n.selectedIndex || 0];
      return i.value = s && s.text || "", i;
    }
    return e;
  }(mr)
), Ky = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i.value = n.value, i;
    }
    return e;
  }(mr)
), Ry = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      i.src = n.src, i.width = parseInt(n.width, 10) || 0, i.height = parseInt(n.height, 10) || 0, i.backgroundColor = i.styles.backgroundColor;
      try {
        if (n.contentWindow && n.contentWindow.document && n.contentWindow.document.documentElement) {
          i.tree = Py(t, n.contentWindow.document.documentElement);
          var s = n.contentWindow.document.documentElement ? Es(t, getComputedStyle(n.contentWindow.document.documentElement).backgroundColor) : Gr.TRANSPARENT, l = n.contentWindow.document.body ? Es(t, getComputedStyle(n.contentWindow.document.body).backgroundColor) : Gr.TRANSPARENT;
          i.backgroundColor = Ei(s) ? Ei(l) ? i.styles.backgroundColor : l : s;
        }
      } catch {
      }
      return i;
    }
    return e;
  }(mr)
), $$ = ["OL", "UL", "MENU"], Ac = function(A, e, t, n) {
  for (var i = e.firstChild, s = void 0; i; i = s)
    if (s = i.nextSibling, ky(i) && i.data.trim().length > 0)
      t.textNodes.push(new S$(A, i, t.styles));
    else if (Ya(i))
      if (Xy(i) && i.assignedNodes)
        i.assignedNodes().forEach(function(c) {
          return Ac(A, c, t, n);
        });
      else {
        var l = $y(A, i);
        l.styles.isVisible() && (P$(i, l, n) ? l.flags |= 4 : k$(l.styles) && (l.flags |= 2), $$.indexOf(i.tagName) !== -1 && (l.flags |= 8), t.elements.push(l), i.slot, i.shadowRoot ? Ac(A, i.shadowRoot, l, n) : !Uc(i) && !Gy(i) && !Ec(i) && Ac(A, i, l, n));
      }
}, $y = function(A, e) {
  return Oh(e) ? new Ty(A, e) : Vy(e) ? new Dy(A, e) : Gy(e) ? new Oy(A, e) : G$(e) ? new Ny(A, e) : V$(e) ? new Th(A, e) : W$(e) ? new tg(A, e) : Ec(e) ? new My(A, e) : Uc(e) ? new Ky(A, e) : Wy(e) ? new Ry(A, e) : new mr(A, e);
}, Py = function(A, e) {
  var t = $y(A, e);
  return t.flags |= 4, Ac(A, e, t, t), t;
}, P$ = function(A, e, t) {
  return e.styles.isPositionedWithZIndex() || e.styles.opacity < 1 || e.styles.isTransformed() || ng(A) && t.styles.isTransparent();
}, k$ = function(A) {
  return A.isPositioned() || A.isFloating();
}, ky = function(A) {
  return A.nodeType === Node.TEXT_NODE;
}, Ya = function(A) {
  return A.nodeType === Node.ELEMENT_NODE;
}, Dh = function(A) {
  return Ya(A) && typeof A.style < "u" && !ec(A);
}, ec = function(A) {
  return typeof A.className == "object";
}, G$ = function(A) {
  return A.tagName === "LI";
}, V$ = function(A) {
  return A.tagName === "OL";
}, W$ = function(A) {
  return A.tagName === "INPUT";
}, X$ = function(A) {
  return A.tagName === "HTML";
}, Gy = function(A) {
  return A.tagName === "svg";
}, ng = function(A) {
  return A.tagName === "BODY";
}, Vy = function(A) {
  return A.tagName === "CANVAS";
}, Vm = function(A) {
  return A.tagName === "VIDEO";
}, Oh = function(A) {
  return A.tagName === "IMG";
}, Wy = function(A) {
  return A.tagName === "IFRAME";
}, Wm = function(A) {
  return A.tagName === "STYLE";
}, q$ = function(A) {
  return A.tagName === "SCRIPT";
}, Uc = function(A) {
  return A.tagName === "TEXTAREA";
}, Ec = function(A) {
  return A.tagName === "SELECT";
}, Xy = function(A) {
  return A.tagName === "SLOT";
}, Xm = function(A) {
  return A.tagName.indexOf("-") > 0;
}, z$ = (
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
      n !== null && n.forEach(function(c) {
        var f = t.counters[c.counter];
        f && c.increment !== 0 && (s = !1, f.length || f.push(1), f[Math.max(0, f.length - 1)] += c.increment);
      });
      var l = [];
      return s && i.forEach(function(c) {
        var f = t.counters[c.counter];
        l.push(c.counter), f || (f = t.counters[c.counter] = []), f.push(c.reset);
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
}, J$ = {
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
}, j$ = {
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
}, Pa = function(A, e, t, n, i, s) {
  return A < e || A > t ? $s(A, i, s.length > 0) : n.integers.reduce(function(l, c, f) {
    for (; A >= c; )
      A -= c, l += n.values[f];
    return l;
  }, "") + s;
}, qy = function(A, e, t, n) {
  var i = "";
  do
    t || A--, i = n(A) + i, A /= e;
  while (A * e >= e);
  return i;
}, at = function(A, e, t, n, i) {
  var s = t - e + 1;
  return (A < 0 ? "-" : "") + (qy(Math.abs(A), s, n, function(l) {
    return st(Math.floor(l % s) + e);
  }) + i);
}, qi = function(A, e, t) {
  t === void 0 && (t = ". ");
  var n = e.length;
  return qy(Math.abs(A), n, !1, function(i) {
    return e[Math.floor(i % n)];
  }) + t;
}, za = 1, gi = 2, Bi = 4, gs = 8, Kr = function(A, e, t, n, i, s) {
  if (A < -9999 || A > 9999)
    return $s(A, 4, i.length > 0);
  var l = Math.abs(A), c = i;
  if (l === 0)
    return e[0] + c;
  for (var f = 0; l > 0 && f <= 4; f++) {
    var p = l % 10;
    p === 0 && ht(s, za) && c !== "" ? c = e[p] + c : p > 1 || p === 1 && f === 0 || p === 1 && f === 1 && ht(s, gi) || p === 1 && f === 1 && ht(s, Bi) && A > 100 || p === 1 && f > 1 && ht(s, gs) ? c = e[p] + (f > 0 ? t[f - 1] : "") + c : p === 1 && f > 0 && (c = t[f - 1] + c), l = Math.floor(l / 10);
  }
  return (A < 0 ? n : "") + c;
}, Jm = "十百千萬", jm = "拾佰仟萬", Ym = "マイナス", Kd = "마이너스", $s = function(A, e, t) {
  var n = t ? ". " : "", i = t ? "、" : "", s = t ? ", " : "", l = t ? " " : "";
  switch (e) {
    case 0:
      return "•" + l;
    case 1:
      return "◦" + l;
    case 2:
      return "◾" + l;
    case 5:
      var c = at(A, 48, 57, !0, n);
      return c.length < 4 ? "0" + c : c;
    case 4:
      return qi(A, "〇一二三四五六七八九", i);
    case 6:
      return Pa(A, 1, 3999, qm, 3, n).toLowerCase();
    case 7:
      return Pa(A, 1, 3999, qm, 3, n);
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
      return Pa(A, 1, 9999, zm, 3, n);
    case 35:
      return Pa(A, 1, 9999, zm, 3, n).toLowerCase();
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
      return Kr(A, "零一二三四五六七八九", Jm, "負", i, gi | Bi | gs);
    case 47:
      return Kr(A, "零壹貳參肆伍陸柒捌玖", jm, "負", i, za | gi | Bi | gs);
    case 42:
      return Kr(A, "零一二三四五六七八九", Jm, "负", i, gi | Bi | gs);
    case 41:
      return Kr(A, "零壹贰叁肆伍陆柒捌玖", jm, "负", i, za | gi | Bi | gs);
    case 26:
      return Kr(A, "〇一二三四五六七八九", "十百千万", Ym, i, 0);
    case 25:
      return Kr(A, "零壱弐参四伍六七八九", "拾百千万", Ym, i, za | gi | Bi);
    case 31:
      return Kr(A, "영일이삼사오육칠팔구", "십백천만", Kd, s, za | gi | Bi);
    case 33:
      return Kr(A, "零一二三四五六七八九", "十百千萬", Kd, s, 0);
    case 32:
      return Kr(A, "零壹貳參四五六七八九", "拾百千", Kd, s, za | gi | Bi);
    case 18:
      return at(A, 2406, 2415, !0, n);
    case 20:
      return Pa(A, 1, 19999, j$, 3, n);
    case 21:
      return at(A, 2790, 2799, !0, n);
    case 22:
      return at(A, 2662, 2671, !0, n);
    case 22:
      return Pa(A, 1, 10999, J$, 3, n);
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
}, zy = "data-html2canvas-ignore", Zm = (
  /** @class */
  function() {
    function A(e, t, n) {
      if (this.context = e, this.options = n, this.scrolledElements = [], this.referenceElement = t, this.counters = new z$(), this.quoteDepth = 0, !t.ownerDocument)
        throw new Error("Cloned element does not have an owner document");
      this.documentElement = this.cloneNode(t.ownerDocument.documentElement, !1);
    }
    return A.prototype.toIFrame = function(e, t) {
      var n = this, i = Y$(e, t);
      if (!i.contentWindow)
        return Promise.reject("Unable to find iframe window");
      var s = e.defaultView.pageXOffset, l = e.defaultView.pageYOffset, c = i.contentWindow, f = c.document, p = eP(i).then(function() {
        return Vt(n, void 0, void 0, function() {
          var B, w;
          return Ot(this, function(v) {
            switch (v.label) {
              case 0:
                return this.scrolledElements.forEach(iP), c && (c.scrollTo(t.left, t.top), /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (c.scrollY !== t.top || c.scrollX !== t.left) && (this.context.logger.warn("Unable to restore scroll position for cloned document"), this.context.windowBounds = this.context.windowBounds.add(c.scrollX - t.left, c.scrollY - t.top, 0, 0))), B = this.options.onclone, w = this.clonedReferenceElement, typeof w > "u" ? [2, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")] : f.fonts && f.fonts.ready ? [4, f.fonts.ready] : [3, 2];
              case 1:
                v.sent(), v.label = 2;
              case 2:
                return /(AppleWebKit)/g.test(navigator.userAgent) ? [4, AP(f)] : [3, 4];
              case 3:
                v.sent(), v.label = 4;
              case 4:
                return typeof B == "function" ? [2, Promise.resolve().then(function() {
                  return B(f, w);
                }).then(function() {
                  return i;
                })] : [2, i];
            }
          });
        });
      });
      return f.open(), f.write(nP(document.doctype) + "<html></html>"), rP(this.referenceElement.ownerDocument, s, l), f.replaceChild(f.adoptNode(this.documentElement), f.documentElement), f.close(), p;
    }, A.prototype.createElementClone = function(e) {
      if (Sh(
        e,
        2
        /* CLONE */
      ))
        debugger;
      if (Vy(e))
        return this.createCanvasClone(e);
      if (Vm(e))
        return this.createVideoClone(e);
      if (Wm(e))
        return this.createStyleClone(e);
      var t = e.cloneNode(!1);
      return Oh(t) && (Oh(e) && e.currentSrc && e.currentSrc !== e.src && (t.src = e.currentSrc, t.srcset = ""), t.loading === "lazy" && (t.loading = "eager")), Xm(t) ? this.createCustomElementClone(t) : t;
    }, A.prototype.createCustomElementClone = function(e) {
      var t = document.createElement("html2canvascustomelement");
      return Rd(e.style, t), t;
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
            var c = (t = e.getContext("webgl2")) !== null && t !== void 0 ? t : e.getContext("webgl");
            if (c) {
              var f = c.getContextAttributes();
              (f == null ? void 0 : f.preserveDrawingBuffer) === !1 && this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false", e);
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
      (!Ya(t) || !q$(t) && !t.hasAttribute(zy) && (typeof this.options.ignoreElements != "function" || !this.options.ignoreElements(t))) && (!this.options.copyStyles || !Ya(t) || !Wm(t)) && e.appendChild(this.cloneNode(t, n));
    }, A.prototype.cloneChildNodes = function(e, t, n) {
      for (var i = this, s = e.shadowRoot ? e.shadowRoot.firstChild : e.firstChild; s; s = s.nextSibling)
        if (Ya(s) && Xy(s) && typeof s.assignedNodes == "function") {
          var l = s.assignedNodes();
          l.length && l.forEach(function(c) {
            return i.appendChildNode(t, c, n);
          });
        } else
          this.appendChildNode(t, s, n);
    }, A.prototype.cloneNode = function(e, t) {
      if (ky(e))
        return document.createTextNode(e.data);
      if (!e.ownerDocument)
        return e.cloneNode(!1);
      var n = e.ownerDocument.defaultView;
      if (n && Ya(e) && (Dh(e) || ec(e))) {
        var i = this.createElementClone(e);
        i.style.transitionProperty = "none";
        var s = n.getComputedStyle(e), l = n.getComputedStyle(e, ":before"), c = n.getComputedStyle(e, ":after");
        this.referenceElement === e && Dh(i) && (this.clonedReferenceElement = i), ng(i) && sP(i);
        var f = this.counters.parse(new Im(this.context, s)), p = this.resolvePseudoContent(e, i, l, xs.BEFORE);
        Xm(e) && (t = !0), Vm(e) || this.cloneChildNodes(e, i, t), p && i.insertBefore(p, i.firstChild);
        var B = this.resolvePseudoContent(e, i, c, xs.AFTER);
        return B && i.appendChild(B), this.counters.pop(f), (s && (this.options.copyStyles || ec(e)) && !Wy(e) || t) && Rd(s, i), (e.scrollTop !== 0 || e.scrollLeft !== 0) && this.scrolledElements.push([i, e.scrollLeft, e.scrollTop]), (Uc(e) || Ec(e)) && (Uc(i) || Ec(i)) && (i.value = e.value), i;
      }
      return e.cloneNode(!1);
    }, A.prototype.resolvePseudoContent = function(e, t, n, i) {
      var s = this;
      if (n) {
        var l = n.content, c = t.ownerDocument;
        if (!(!c || !l || l === "none" || l === "-moz-alt-content" || n.display === "none")) {
          this.counters.parse(new Im(this.context, n));
          var f = new GR(this.context, n), p = c.createElement("html2canvaspseudoelement");
          Rd(n, p), f.content.forEach(function(w) {
            if (w.type === 0)
              p.appendChild(c.createTextNode(w.value));
            else if (w.type === 22) {
              var v = c.createElement("img");
              v.src = w.value, v.style.opacity = "1", p.appendChild(v);
            } else if (w.type === 18) {
              if (w.name === "attr") {
                var Q = w.values.filter(Pe);
                Q.length && p.appendChild(c.createTextNode(e.getAttribute(Q[0].value) || ""));
              } else if (w.name === "counter") {
                var u = w.values.filter(po), U = u[0], b = u[1];
                if (U && Pe(U)) {
                  var E = s.counters.getCounterValue(U.value), D = b && Pe(b) ? Hh.parse(s.context, b.value) : 3;
                  p.appendChild(c.createTextNode($s(E, D, !1)));
                }
              } else if (w.name === "counters") {
                var R = w.values.filter(po), U = R[0], x = R[1], b = R[2];
                if (U && Pe(U)) {
                  var K = s.counters.getCounterValues(U.value), k = b && Pe(b) ? Hh.parse(s.context, b.value) : 3, Y = x && x.type === 0 ? x.value : "", dA = K.map(function(EA) {
                    return $s(EA, k, !1);
                  }).join(Y);
                  p.appendChild(c.createTextNode(dA));
                }
              }
            } else if (w.type === 20)
              switch (w.value) {
                case "open-quote":
                  p.appendChild(c.createTextNode(xm(f.quotes, s.quoteDepth++, !0)));
                  break;
                case "close-quote":
                  p.appendChild(c.createTextNode(xm(f.quotes, --s.quoteDepth, !1)));
                  break;
                default:
                  p.appendChild(c.createTextNode(w.value));
              }
          }), p.className = Nh + " " + Mh;
          var B = i === xs.BEFORE ? " " + Nh : " " + Mh;
          return ec(t) ? t.className.baseValue += B : t.className += B, p;
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
var Y$ = function(A, e) {
  var t = A.createElement("iframe");
  return t.className = "html2canvas-container", t.style.visibility = "hidden", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0px", t.style.border = "0", t.width = e.width.toString(), t.height = e.height.toString(), t.scrolling = "no", t.setAttribute(zy, "true"), A.body.appendChild(t), t;
}, Z$ = function(A) {
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
}, AP = function(A) {
  return Promise.all([].slice.call(A.images, 0).map(Z$));
}, eP = function(A) {
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
}, tP = [
  "all",
  "d",
  "content"
  // Safari shows pseudoelements if content is set
], Rd = function(A, e) {
  for (var t = A.length - 1; t >= 0; t--) {
    var n = A.item(t);
    tP.indexOf(n) === -1 && e.style.setProperty(n, A.getPropertyValue(n));
  }
  return e;
}, nP = function(A) {
  var e = "";
  return A && (e += "<!DOCTYPE ", A.name && (e += A.name), A.internalSubset && (e += A.internalSubset), A.publicId && (e += '"' + A.publicId + '"'), A.systemId && (e += '"' + A.systemId + '"'), e += ">"), e;
}, rP = function(A, e, t) {
  A && A.defaultView && (e !== A.defaultView.pageXOffset || t !== A.defaultView.pageYOffset) && A.defaultView.scrollTo(e, t);
}, iP = function(A) {
  var e = A[0], t = A[1], n = A[2];
  e.scrollLeft = t, e.scrollTop = n;
}, aP = ":before", oP = ":after", Nh = "___html2canvas___pseudoelement_before", Mh = "___html2canvas___pseudoelement_after", Av = `{
    content: "" !important;
    display: none !important;
}`, sP = function(A) {
  uP(A, "." + Nh + aP + Av + `
         .` + Mh + oP + Av);
}, uP = function(A, e) {
  var t = A.ownerDocument;
  if (t) {
    var n = t.createElement("style");
    n.textContent = e, A.appendChild(n);
  }
}, Jy = (
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
), lP = (
  /** @class */
  function() {
    function A(e, t) {
      this.context = e, this._options = t, this._cache = {};
    }
    return A.prototype.addImage = function(e) {
      var t = Promise.resolve();
      return this.has(e) || (Pd(e) || hP(e)) && (this._cache[e] = this.loadImage(e)).catch(function() {
      }), t;
    }, A.prototype.match = function(e) {
      return this._cache[e];
    }, A.prototype.loadImage = function(e) {
      return Vt(this, void 0, void 0, function() {
        var t, n, i, s, l = this;
        return Ot(this, function(c) {
          switch (c.label) {
            case 0:
              return t = Jy.isSameOrigin(e), n = !$d(e) && this._options.useCORS === !0 && Ft.SUPPORT_CORS_IMAGES && !t, i = !$d(e) && !t && !Pd(e) && typeof this._options.proxy == "string" && Ft.SUPPORT_CORS_XHR && !n, !t && this._options.allowTaint === !1 && !$d(e) && !Pd(e) && !i && !n ? [
                2
                /*return*/
              ] : (s = e, i ? [4, this.proxy(s)] : [3, 2]);
            case 1:
              s = c.sent(), c.label = 2;
            case 2:
              return this.context.logger.debug("Added image " + e.substring(0, 256)), [4, new Promise(function(f, p) {
                var B = new Image();
                B.onload = function() {
                  return f(B);
                }, B.onerror = p, (pP(s) || n) && (B.crossOrigin = "anonymous"), B.src = s, B.complete === !0 && setTimeout(function() {
                  return f(B);
                }, 500), l._options.imageTimeout > 0 && setTimeout(function() {
                  return p("Timed out (" + l._options.imageTimeout + "ms) loading image");
                }, l._options.imageTimeout);
              })];
            case 3:
              return [2, c.sent()];
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
        var c = Ft.SUPPORT_RESPONSE_TYPE ? "blob" : "text", f = new XMLHttpRequest();
        f.onload = function() {
          if (f.status === 200)
            if (c === "text")
              s(f.response);
            else {
              var w = new FileReader();
              w.addEventListener("load", function() {
                return s(w.result);
              }, !1), w.addEventListener("error", function(v) {
                return l(v);
              }, !1), w.readAsDataURL(f.response);
            }
          else
            l("Failed to proxy resource " + i + " with status code " + f.status);
        }, f.onerror = l;
        var p = n.indexOf("?") > -1 ? "&" : "?";
        if (f.open("GET", "" + n + p + "url=" + encodeURIComponent(e) + "&responseType=" + c), c !== "text" && f instanceof XMLHttpRequest && (f.responseType = c), t._options.imageTimeout) {
          var B = t._options.imageTimeout;
          f.timeout = B, f.ontimeout = function() {
            return l("Timed out (" + B + "ms) proxying " + i);
          };
        }
        f.send();
      });
    }, A;
  }()
), cP = /^data:image\/svg\+xml/i, fP = /^data:image\/.*;base64,/i, dP = /^data:image\/.*/i, hP = function(A) {
  return Ft.SUPPORT_SVG_DRAWING || !gP(A);
}, $d = function(A) {
  return dP.test(A);
}, pP = function(A) {
  return fP.test(A);
}, Pd = function(A) {
  return A.substr(0, 4) === "blob";
}, gP = function(A) {
  return A.substr(-3).toLowerCase() === "svg" || cP.test(A);
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
), ka = function(A, e, t) {
  return new TA(A.x + (e.x - A.x) * t, A.y + (e.y - A.y) * t);
}, Nl = (
  /** @class */
  function() {
    function A(e, t, n, i) {
      this.type = 1, this.start = e, this.startControl = t, this.endControl = n, this.end = i;
    }
    return A.prototype.subdivide = function(e, t) {
      var n = ka(this.start, this.startControl, e), i = ka(this.startControl, this.endControl, e), s = ka(this.endControl, this.end, e), l = ka(n, i, e), c = ka(i, s, e), f = ka(l, c, e);
      return t ? new A(this.start, n, l, f) : new A(f, c, s, this.end);
    }, A.prototype.add = function(e, t) {
      return new A(this.start.add(e, t), this.startControl.add(e, t), this.endControl.add(e, t), this.end.add(e, t));
    }, A.prototype.reverse = function() {
      return new A(this.end, this.endControl, this.startControl, this.start);
    }, A;
  }()
), Qn = function(A) {
  return A.type === 1;
}, BP = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      var t = e.styles, n = e.bounds, i = hs(t.borderTopLeftRadius, n.width, n.height), s = i[0], l = i[1], c = hs(t.borderTopRightRadius, n.width, n.height), f = c[0], p = c[1], B = hs(t.borderBottomRightRadius, n.width, n.height), w = B[0], v = B[1], Q = hs(t.borderBottomLeftRadius, n.width, n.height), u = Q[0], U = Q[1], b = [];
      b.push((s + f) / n.width), b.push((u + w) / n.width), b.push((l + U) / n.height), b.push((p + v) / n.height);
      var E = Math.max.apply(Math, b);
      E > 1 && (s /= E, l /= E, f /= E, p /= E, w /= E, v /= E, u /= E, U /= E);
      var D = n.width - f, R = n.height - v, x = n.width - w, K = n.height - U, k = t.borderTopWidth, Y = t.borderRightWidth, dA = t.borderBottomWidth, cA = t.borderLeftWidth, wA = Xe(t.paddingTop, e.bounds.width), EA = Xe(t.paddingRight, e.bounds.width), NA = Xe(t.paddingBottom, e.bounds.width), xA = Xe(t.paddingLeft, e.bounds.width);
      this.topLeftBorderDoubleOuterBox = s > 0 || l > 0 ? je(n.left + cA / 3, n.top + k / 3, s - cA / 3, l - k / 3, Ne.TOP_LEFT) : new TA(n.left + cA / 3, n.top + k / 3), this.topRightBorderDoubleOuterBox = s > 0 || l > 0 ? je(n.left + D, n.top + k / 3, f - Y / 3, p - k / 3, Ne.TOP_RIGHT) : new TA(n.left + n.width - Y / 3, n.top + k / 3), this.bottomRightBorderDoubleOuterBox = w > 0 || v > 0 ? je(n.left + x, n.top + R, w - Y / 3, v - dA / 3, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - Y / 3, n.top + n.height - dA / 3), this.bottomLeftBorderDoubleOuterBox = u > 0 || U > 0 ? je(n.left + cA / 3, n.top + K, u - cA / 3, U - dA / 3, Ne.BOTTOM_LEFT) : new TA(n.left + cA / 3, n.top + n.height - dA / 3), this.topLeftBorderDoubleInnerBox = s > 0 || l > 0 ? je(n.left + cA * 2 / 3, n.top + k * 2 / 3, s - cA * 2 / 3, l - k * 2 / 3, Ne.TOP_LEFT) : new TA(n.left + cA * 2 / 3, n.top + k * 2 / 3), this.topRightBorderDoubleInnerBox = s > 0 || l > 0 ? je(n.left + D, n.top + k * 2 / 3, f - Y * 2 / 3, p - k * 2 / 3, Ne.TOP_RIGHT) : new TA(n.left + n.width - Y * 2 / 3, n.top + k * 2 / 3), this.bottomRightBorderDoubleInnerBox = w > 0 || v > 0 ? je(n.left + x, n.top + R, w - Y * 2 / 3, v - dA * 2 / 3, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - Y * 2 / 3, n.top + n.height - dA * 2 / 3), this.bottomLeftBorderDoubleInnerBox = u > 0 || U > 0 ? je(n.left + cA * 2 / 3, n.top + K, u - cA * 2 / 3, U - dA * 2 / 3, Ne.BOTTOM_LEFT) : new TA(n.left + cA * 2 / 3, n.top + n.height - dA * 2 / 3), this.topLeftBorderStroke = s > 0 || l > 0 ? je(n.left + cA / 2, n.top + k / 2, s - cA / 2, l - k / 2, Ne.TOP_LEFT) : new TA(n.left + cA / 2, n.top + k / 2), this.topRightBorderStroke = s > 0 || l > 0 ? je(n.left + D, n.top + k / 2, f - Y / 2, p - k / 2, Ne.TOP_RIGHT) : new TA(n.left + n.width - Y / 2, n.top + k / 2), this.bottomRightBorderStroke = w > 0 || v > 0 ? je(n.left + x, n.top + R, w - Y / 2, v - dA / 2, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - Y / 2, n.top + n.height - dA / 2), this.bottomLeftBorderStroke = u > 0 || U > 0 ? je(n.left + cA / 2, n.top + K, u - cA / 2, U - dA / 2, Ne.BOTTOM_LEFT) : new TA(n.left + cA / 2, n.top + n.height - dA / 2), this.topLeftBorderBox = s > 0 || l > 0 ? je(n.left, n.top, s, l, Ne.TOP_LEFT) : new TA(n.left, n.top), this.topRightBorderBox = f > 0 || p > 0 ? je(n.left + D, n.top, f, p, Ne.TOP_RIGHT) : new TA(n.left + n.width, n.top), this.bottomRightBorderBox = w > 0 || v > 0 ? je(n.left + x, n.top + R, w, v, Ne.BOTTOM_RIGHT) : new TA(n.left + n.width, n.top + n.height), this.bottomLeftBorderBox = u > 0 || U > 0 ? je(n.left, n.top + K, u, U, Ne.BOTTOM_LEFT) : new TA(n.left, n.top + n.height), this.topLeftPaddingBox = s > 0 || l > 0 ? je(n.left + cA, n.top + k, Math.max(0, s - cA), Math.max(0, l - k), Ne.TOP_LEFT) : new TA(n.left + cA, n.top + k), this.topRightPaddingBox = f > 0 || p > 0 ? je(n.left + Math.min(D, n.width - Y), n.top + k, D > n.width + Y ? 0 : Math.max(0, f - Y), Math.max(0, p - k), Ne.TOP_RIGHT) : new TA(n.left + n.width - Y, n.top + k), this.bottomRightPaddingBox = w > 0 || v > 0 ? je(n.left + Math.min(x, n.width - cA), n.top + Math.min(R, n.height - dA), Math.max(0, w - Y), Math.max(0, v - dA), Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - Y, n.top + n.height - dA), this.bottomLeftPaddingBox = u > 0 || U > 0 ? je(n.left + cA, n.top + Math.min(K, n.height - dA), Math.max(0, u - cA), Math.max(0, U - dA), Ne.BOTTOM_LEFT) : new TA(n.left + cA, n.top + n.height - dA), this.topLeftContentBox = s > 0 || l > 0 ? je(n.left + cA + xA, n.top + k + wA, Math.max(0, s - (cA + xA)), Math.max(0, l - (k + wA)), Ne.TOP_LEFT) : new TA(n.left + cA + xA, n.top + k + wA), this.topRightContentBox = f > 0 || p > 0 ? je(n.left + Math.min(D, n.width + cA + xA), n.top + k + wA, D > n.width + cA + xA ? 0 : f - cA + xA, p - (k + wA), Ne.TOP_RIGHT) : new TA(n.left + n.width - (Y + EA), n.top + k + wA), this.bottomRightContentBox = w > 0 || v > 0 ? je(n.left + Math.min(x, n.width - (cA + xA)), n.top + Math.min(R, n.height + k + wA), Math.max(0, w - (Y + EA)), v - (dA + NA), Ne.BOTTOM_RIGHT) : new TA(n.left + n.width - (Y + EA), n.top + n.height - (dA + NA)), this.bottomLeftContentBox = u > 0 || U > 0 ? je(n.left + cA + xA, n.top + K, Math.max(0, u - (cA + xA)), U - (dA + NA), Ne.BOTTOM_LEFT) : new TA(n.left + cA + xA, n.top + n.height - (dA + NA));
    }
    return A;
  }()
), Ne;
(function(A) {
  A[A.TOP_LEFT = 0] = "TOP_LEFT", A[A.TOP_RIGHT = 1] = "TOP_RIGHT", A[A.BOTTOM_RIGHT = 2] = "BOTTOM_RIGHT", A[A.BOTTOM_LEFT = 3] = "BOTTOM_LEFT";
})(Ne || (Ne = {}));
var je = function(A, e, t, n, i) {
  var s = 4 * ((Math.sqrt(2) - 1) / 3), l = t * s, c = n * s, f = A + t, p = e + n;
  switch (i) {
    case Ne.TOP_LEFT:
      return new Nl(new TA(A, p), new TA(A, p - c), new TA(f - l, e), new TA(f, e));
    case Ne.TOP_RIGHT:
      return new Nl(new TA(A, e), new TA(A + l, e), new TA(f, p - c), new TA(f, p));
    case Ne.BOTTOM_RIGHT:
      return new Nl(new TA(f, e), new TA(f, e + c), new TA(A + l, p), new TA(A, p));
    case Ne.BOTTOM_LEFT:
    default:
      return new Nl(new TA(f, p), new TA(f - l, p), new TA(A, e + c), new TA(A, e));
  }
}, bc = function(A) {
  return [A.topLeftBorderBox, A.topRightBorderBox, A.bottomRightBorderBox, A.bottomLeftBorderBox];
}, wP = function(A) {
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
}, mP = (
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
), vP = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.opacity = e, this.type = 2, this.target = 6;
    }
    return A;
  }()
), yP = function(A) {
  return A.type === 0;
}, jy = function(A) {
  return A.type === 1;
}, CP = function(A) {
  return A.type === 2;
}, ev = function(A, e) {
  return A.length === e.length ? A.some(function(t, n) {
    return t === e[n];
  }) : !1;
}, QP = function(A, e, t, n, i) {
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
}, Yy = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e) {
      this.element = e, this.inlineLevel = [], this.nonInlineLevel = [], this.negativeZIndex = [], this.zeroOrAutoZIndexOrTransformedOrOpacity = [], this.positiveZIndex = [], this.nonPositionedFloats = [], this.nonPositionedInlineLevel = [];
    }
    return A;
  }()
), Zy = (
  /** @class */
  function() {
    function A(e, t) {
      if (this.container = e, this.parent = t, this.effects = [], this.curves = new BP(this.container), this.container.styles.opacity < 1 && this.effects.push(new vP(this.container.styles.opacity)), this.container.styles.transform !== null) {
        var n = this.container.bounds.left + this.container.styles.transformOrigin[0].number, i = this.container.bounds.top + this.container.styles.transformOrigin[1].number, s = this.container.styles.transform;
        this.effects.push(new mP(n, i, s));
      }
      if (this.container.styles.overflowX !== 0) {
        var l = bc(this.curves), c = _c(this.curves);
        ev(l, c) ? this.effects.push(new Ml(
          l,
          6
          /* CONTENT */
        )) : (this.effects.push(new Ml(
          l,
          2
          /* BACKGROUND_BORDERS */
        )), this.effects.push(new Ml(
          c,
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
        var s = n.effects.filter(function(f) {
          return !jy(f);
        });
        if (t || n.container.styles.position !== 0 || !n.parent) {
          if (i.unshift.apply(i, s), t = [
            2,
            3
            /* FIXED */
          ].indexOf(n.container.styles.position) === -1, n.container.styles.overflowX !== 0) {
            var l = bc(n.curves), c = _c(n.curves);
            ev(l, c) || i.unshift(new Ml(
              c,
              6
              /* CONTENT */
            ));
          }
        } else
          i.unshift.apply(i, s);
        n = n.parent;
      }
      return i.filter(function(f) {
        return ht(f.target, e);
      });
    }, A;
  }()
), Kh = function(A, e, t, n) {
  A.container.elements.forEach(function(i) {
    var s = ht(
      i.flags,
      4
      /* CREATES_REAL_STACKING_CONTEXT */
    ), l = ht(
      i.flags,
      2
      /* CREATES_STACKING_CONTEXT */
    ), c = new Zy(i, A);
    ht(
      i.styles.display,
      2048
      /* LIST_ITEM */
    ) && n.push(c);
    var f = ht(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) ? [] : n;
    if (s || l) {
      var p = s || i.styles.isPositioned() ? t : e, B = new Yy(c);
      if (i.styles.isPositioned() || i.styles.opacity < 1 || i.styles.isTransformed()) {
        var w = i.styles.zIndex.order;
        if (w < 0) {
          var v = 0;
          p.negativeZIndex.some(function(u, U) {
            return w > u.element.container.styles.zIndex.order ? (v = U, !1) : v > 0;
          }), p.negativeZIndex.splice(v, 0, B);
        } else if (w > 0) {
          var Q = 0;
          p.positiveZIndex.some(function(u, U) {
            return w >= u.element.container.styles.zIndex.order ? (Q = U + 1, !1) : Q > 0;
          }), p.positiveZIndex.splice(Q, 0, B);
        } else
          p.zeroOrAutoZIndexOrTransformedOrOpacity.push(B);
      } else
        i.styles.isFloating() ? p.nonPositionedFloats.push(B) : p.nonPositionedInlineLevel.push(B);
      Kh(c, B, s ? B : t, f);
    } else
      i.styles.isInlineLevel() ? e.inlineLevel.push(c) : e.nonInlineLevel.push(c), Kh(c, e, t, f);
    ht(
      i.flags,
      8
      /* IS_LIST_OWNER */
    ) && AC(i, f);
  });
}, AC = function(A, e) {
  for (var t = A instanceof Th ? A.start : 1, n = A instanceof Th ? A.reversed : !1, i = 0; i < e.length; i++) {
    var s = e[i];
    s.container instanceof Ny && typeof s.container.value == "number" && s.container.value !== 0 && (t = s.container.value), s.listValue = $s(t, s.container.styles.listStyleType, !0), t += n ? -1 : 1;
  }
}, FP = function(A) {
  var e = new Zy(A, null), t = new Yy(e), n = [];
  return Kh(e, t, t, n), AC(e.container, n), t;
}, tv = function(A, e) {
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
}, UP = function(A, e) {
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
}, EP = function(A, e) {
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
}, bP = function(A, e) {
  switch (e) {
    case 0:
      return Kl(A.topLeftBorderStroke, A.topRightBorderStroke);
    case 1:
      return Kl(A.topRightBorderStroke, A.bottomRightBorderStroke);
    case 2:
      return Kl(A.bottomRightBorderStroke, A.bottomLeftBorderStroke);
    case 3:
    default:
      return Kl(A.bottomLeftBorderStroke, A.topLeftBorderStroke);
  }
}, Kl = function(A, e) {
  var t = [];
  return Qn(A) ? t.push(A.subdivide(0.5, !1)) : t.push(A), Qn(e) ? t.push(e.subdivide(0.5, !0)) : t.push(e), t;
}, Un = function(A, e, t, n) {
  var i = [];
  return Qn(A) ? i.push(A.subdivide(0.5, !1)) : i.push(A), Qn(t) ? i.push(t.subdivide(0.5, !0)) : i.push(t), Qn(n) ? i.push(n.subdivide(0.5, !0).reverse()) : i.push(n), Qn(e) ? i.push(e.subdivide(0.5, !1).reverse()) : i.push(e), i;
}, eC = function(A) {
  var e = A.bounds, t = A.styles;
  return e.add(t.borderLeftWidth, t.borderTopWidth, -(t.borderRightWidth + t.borderLeftWidth), -(t.borderTopWidth + t.borderBottomWidth));
}, xc = function(A) {
  var e = A.styles, t = A.bounds, n = Xe(e.paddingLeft, t.width), i = Xe(e.paddingRight, t.width), s = Xe(e.paddingTop, t.width), l = Xe(e.paddingBottom, t.width);
  return t.add(n + e.borderLeftWidth, s + e.borderTopWidth, -(e.borderRightWidth + e.borderLeftWidth + n + i), -(e.borderTopWidth + e.borderBottomWidth + s + l));
}, _P = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? xc(e) : eC(e);
}, xP = function(A, e) {
  return A === 0 ? e.bounds : A === 2 ? xc(e) : eC(e);
}, kd = function(A, e, t) {
  var n = _P(Ja(A.styles.backgroundOrigin, e), A), i = xP(Ja(A.styles.backgroundClip, e), A), s = IP(Ja(A.styles.backgroundSize, e), t, n), l = s[0], c = s[1], f = hs(Ja(A.styles.backgroundPosition, e), n.width - l, n.height - c), p = HP(Ja(A.styles.backgroundRepeat, e), f, s, n, i), B = Math.round(n.left + f[0]), w = Math.round(n.top + f[1]);
  return [p, B, w, l, c];
}, Ga = function(A) {
  return Pe(A) && A.value === no.AUTO;
}, Rl = function(A) {
  return typeof A == "number";
}, IP = function(A, e, t) {
  var n = e[0], i = e[1], s = e[2], l = A[0], c = A[1];
  if (!l)
    return [0, 0];
  if (lt(l) && c && lt(c))
    return [Xe(l, t.width), Xe(c, t.height)];
  var f = Rl(s);
  if (Pe(l) && (l.value === no.CONTAIN || l.value === no.COVER)) {
    if (Rl(s)) {
      var p = t.width / t.height;
      return p < s != (l.value === no.COVER) ? [t.width, t.width / s] : [t.height * s, t.height];
    }
    return [t.width, t.height];
  }
  var B = Rl(n), w = Rl(i), v = B || w;
  if (Ga(l) && (!c || Ga(c))) {
    if (B && w)
      return [n, i];
    if (!f && !v)
      return [t.width, t.height];
    if (v && f) {
      var Q = B ? n : i * s, u = w ? i : n / s;
      return [Q, u];
    }
    var U = B ? n : t.width, b = w ? i : t.height;
    return [U, b];
  }
  if (f) {
    var E = 0, D = 0;
    return lt(l) ? E = Xe(l, t.width) : lt(c) && (D = Xe(c, t.height)), Ga(l) ? E = D * s : (!c || Ga(c)) && (D = E / s), [E, D];
  }
  var R = null, x = null;
  if (lt(l) ? R = Xe(l, t.width) : c && lt(c) && (x = Xe(c, t.height)), R !== null && (!c || Ga(c)) && (x = B && w ? R / n * i : t.height), x !== null && Ga(l) && (R = B && w ? x / i * n : t.width), R !== null && x !== null)
    return [R, x];
  throw new Error("Unable to calculate background-size for element");
}, Ja = function(A, e) {
  var t = A[e];
  return typeof t > "u" ? A[0] : t;
}, HP = function(A, e, t, n, i) {
  var s = e[0], l = e[1], c = t[0], f = t[1];
  switch (A) {
    case 2:
      return [
        new TA(Math.round(n.left), Math.round(n.top + l)),
        new TA(Math.round(n.left + n.width), Math.round(n.top + l)),
        new TA(Math.round(n.left + n.width), Math.round(f + n.top + l)),
        new TA(Math.round(n.left), Math.round(f + n.top + l))
      ];
    case 3:
      return [
        new TA(Math.round(n.left + s), Math.round(n.top)),
        new TA(Math.round(n.left + s + c), Math.round(n.top)),
        new TA(Math.round(n.left + s + c), Math.round(n.height + n.top)),
        new TA(Math.round(n.left + s), Math.round(n.height + n.top))
      ];
    case 1:
      return [
        new TA(Math.round(n.left + s), Math.round(n.top + l)),
        new TA(Math.round(n.left + s + c), Math.round(n.top + l)),
        new TA(Math.round(n.left + s + c), Math.round(n.top + l + f)),
        new TA(Math.round(n.left + s), Math.round(n.top + l + f))
      ];
    default:
      return [
        new TA(Math.round(i.left), Math.round(i.top)),
        new TA(Math.round(i.left + i.width), Math.round(i.top)),
        new TA(Math.round(i.left + i.width), Math.round(i.height + i.top)),
        new TA(Math.round(i.left), Math.round(i.height + i.top))
      ];
  }
}, SP = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", nv = "Hidden Text", LP = (
  /** @class */
  function() {
    function A(e) {
      this._data = {}, this._document = e;
    }
    return A.prototype.parseMetrics = function(e, t) {
      var n = this._document.createElement("div"), i = this._document.createElement("img"), s = this._document.createElement("span"), l = this._document.body;
      n.style.visibility = "hidden", n.style.fontFamily = e, n.style.fontSize = t, n.style.margin = "0", n.style.padding = "0", n.style.whiteSpace = "nowrap", l.appendChild(n), i.src = SP, i.width = 1, i.height = 1, i.style.margin = "0", i.style.padding = "0", i.style.verticalAlign = "baseline", s.style.fontFamily = e, s.style.fontSize = t, s.style.margin = "0", s.style.padding = "0", s.appendChild(this._document.createTextNode(nv)), n.appendChild(s), n.appendChild(i);
      var c = i.offsetTop - s.offsetTop + 2;
      n.removeChild(s), n.appendChild(this._document.createTextNode(nv)), n.style.lineHeight = "normal", i.style.verticalAlign = "super";
      var f = i.offsetTop - n.offsetTop + 2;
      return l.removeChild(n), { baseline: c, middle: f };
    }, A.prototype.getMetrics = function(e, t) {
      var n = e + " " + t;
      return typeof this._data[n] > "u" && (this._data[n] = this.parseMetrics(e, t)), this._data[n];
    }, A;
  }()
), tC = (
  /** @class */
  /* @__PURE__ */ function() {
    function A(e, t) {
      this.context = e, this.options = t;
    }
    return A;
  }()
), TP = 1e4, DP = (
  /** @class */
  function(A) {
    jn(e, A);
    function e(t, n) {
      var i = A.call(this, t, n) || this;
      return i._activeEffects = [], i.canvas = n.canvas ? n.canvas : document.createElement("canvas"), i.ctx = i.canvas.getContext("2d"), n.canvas || (i.canvas.width = Math.floor(n.width * n.scale), i.canvas.height = Math.floor(n.height * n.scale), i.canvas.style.width = n.width + "px", i.canvas.style.height = n.height + "px"), i.fontMetrics = new LP(document), i.ctx.scale(i.options.scale, i.options.scale), i.ctx.translate(-n.x, -n.y), i.ctx.textBaseline = "bottom", i._activeEffects = [], i.context.logger.debug("Canvas renderer initialized (" + n.width + "x" + n.height + ") with scale " + n.scale), i;
    }
    return e.prototype.applyEffects = function(t) {
      for (var n = this; this._activeEffects.length; )
        this.popEffect();
      t.forEach(function(i) {
        return n.applyEffect(i);
      });
    }, e.prototype.applyEffect = function(t) {
      this.ctx.save(), CP(t) && (this.ctx.globalAlpha = t.opacity), yP(t) && (this.ctx.translate(t.offsetX, t.offsetY), this.ctx.transform(t.matrix[0], t.matrix[1], t.matrix[2], t.matrix[3], t.matrix[4], t.matrix[5]), this.ctx.translate(-t.offsetX, -t.offsetY)), jy(t) && (this.path(t.path), this.ctx.clip()), this._activeEffects.push(t);
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
      var s = this;
      if (n === 0)
        this.ctx.fillText(t.text, t.bounds.left, t.bounds.top + i);
      else {
        var l = eg(t.text);
        l.reduce(function(c, f) {
          return s.ctx.fillText(f, c, t.bounds.top + i), c + s.ctx.measureText(f).width;
        }, t.bounds.left);
      }
    }, e.prototype.createFontStyle = function(t) {
      var n = t.fontVariant.filter(function(l) {
        return l === "normal" || l === "small-caps";
      }).join(""), i = RP(t.fontFamily).join(", "), s = js(t.fontSize) ? "" + t.fontSize.number + t.fontSize.unit : t.fontSize.number + "px";
      return [
        [t.fontStyle, n, t.fontWeight, s, i].join(" "),
        i,
        s
      ];
    }, e.prototype.renderTextNode = function(t, n) {
      return Vt(this, void 0, void 0, function() {
        var i, s, l, c, f, p, B, w, v = this;
        return Ot(this, function(Q) {
          return i = this.createFontStyle(n), s = i[0], l = i[1], c = i[2], this.ctx.font = s, this.ctx.direction = n.direction === 1 ? "rtl" : "ltr", this.ctx.textAlign = "left", this.ctx.textBaseline = "alphabetic", f = this.fontMetrics.getMetrics(l, c), p = f.baseline, B = f.middle, w = n.paintOrder, t.textBounds.forEach(function(u) {
            w.forEach(function(U) {
              switch (U) {
                case 0:
                  v.ctx.fillStyle = wt(n.color), v.renderTextWithLetterSpacing(u, n.letterSpacing, p);
                  var b = n.textShadow;
                  b.length && u.text.trim().length && (b.slice(0).reverse().forEach(function(E) {
                    v.ctx.shadowColor = wt(E.color), v.ctx.shadowOffsetX = E.offsetX.number * v.options.scale, v.ctx.shadowOffsetY = E.offsetY.number * v.options.scale, v.ctx.shadowBlur = E.blur.number, v.renderTextWithLetterSpacing(u, n.letterSpacing, p);
                  }), v.ctx.shadowColor = "", v.ctx.shadowOffsetX = 0, v.ctx.shadowOffsetY = 0, v.ctx.shadowBlur = 0), n.textDecorationLine.length && (v.ctx.fillStyle = wt(n.textDecorationColor || n.color), n.textDecorationLine.forEach(function(E) {
                    switch (E) {
                      case 1:
                        v.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top + p), u.bounds.width, 1);
                        break;
                      case 2:
                        v.ctx.fillRect(u.bounds.left, Math.round(u.bounds.top), u.bounds.width, 1);
                        break;
                      case 3:
                        v.ctx.fillRect(u.bounds.left, Math.ceil(u.bounds.top + B), u.bounds.width, 1);
                        break;
                    }
                  }));
                  break;
                case 1:
                  n.webkitTextStrokeWidth && u.text.trim().length && (v.ctx.strokeStyle = wt(n.webkitTextStrokeColor), v.ctx.lineWidth = n.webkitTextStrokeWidth, v.ctx.lineJoin = window.chrome ? "miter" : "round", v.ctx.strokeText(u.text, u.bounds.left, u.bounds.top + p)), v.ctx.strokeStyle = "", v.ctx.lineWidth = 0, v.ctx.lineJoin = "miter";
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
        var s = xc(t), l = _c(n);
        this.path(l), this.ctx.save(), this.ctx.clip(), this.ctx.drawImage(i, 0, 0, t.intrinsicWidth, t.intrinsicHeight, s.left, s.top, s.width, s.height), this.ctx.restore();
      }
    }, e.prototype.renderNodeContent = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i, s, l, c, f, D, D, p, B, w, v, x, Q, u, K, U, b, E, D, R, x, K;
        return Ot(this, function(k) {
          switch (k.label) {
            case 0:
              this.applyEffects(t.getEffects(
                4
                /* CONTENT */
              )), n = t.container, i = t.curves, s = n.styles, l = 0, c = n.textNodes, k.label = 1;
            case 1:
              return l < c.length ? (f = c[l], [4, this.renderTextNode(f, s)]) : [3, 4];
            case 2:
              k.sent(), k.label = 3;
            case 3:
              return l++, [3, 1];
            case 4:
              if (!(n instanceof Ty)) return [3, 8];
              k.label = 5;
            case 5:
              return k.trys.push([5, 7, , 8]), [4, this.context.cache.match(n.src)];
            case 6:
              return D = k.sent(), this.renderReplacedElement(n, i, D), [3, 8];
            case 7:
              return k.sent(), this.context.logger.error("Error loading image " + n.src), [3, 8];
            case 8:
              if (n instanceof Dy && this.renderReplacedElement(n, i, n.canvas), !(n instanceof Oy)) return [3, 12];
              k.label = 9;
            case 9:
              return k.trys.push([9, 11, , 12]), [4, this.context.cache.match(n.svg)];
            case 10:
              return D = k.sent(), this.renderReplacedElement(n, i, D), [3, 12];
            case 11:
              return k.sent(), this.context.logger.error("Error loading svg " + n.svg.substring(0, 255)), [3, 12];
            case 12:
              return n instanceof Ry && n.tree ? (p = new e(this.context, {
                scale: this.options.scale,
                backgroundColor: n.backgroundColor,
                x: 0,
                y: 0,
                width: n.width,
                height: n.height
              }), [4, p.render(n.tree)]) : [3, 14];
            case 13:
              B = k.sent(), n.width && n.height && this.ctx.drawImage(B, 0, 0, n.width, n.height, n.bounds.left, n.bounds.top, n.bounds.width, n.bounds.height), k.label = 14;
            case 14:
              if (n instanceof tg && (w = Math.min(n.bounds.width, n.bounds.height), n.type === Qc ? n.checked && (this.ctx.save(), this.path([
                new TA(n.bounds.left + w * 0.39363, n.bounds.top + w * 0.79),
                new TA(n.bounds.left + w * 0.16, n.bounds.top + w * 0.5549),
                new TA(n.bounds.left + w * 0.27347, n.bounds.top + w * 0.44071),
                new TA(n.bounds.left + w * 0.39694, n.bounds.top + w * 0.5649),
                new TA(n.bounds.left + w * 0.72983, n.bounds.top + w * 0.23),
                new TA(n.bounds.left + w * 0.84, n.bounds.top + w * 0.34085),
                new TA(n.bounds.left + w * 0.39363, n.bounds.top + w * 0.79)
              ]), this.ctx.fillStyle = wt(Gm), this.ctx.fill(), this.ctx.restore()) : n.type === Fc && n.checked && (this.ctx.save(), this.ctx.beginPath(), this.ctx.arc(n.bounds.left + w / 2, n.bounds.top + w / 2, w / 4, 0, Math.PI * 2, !0), this.ctx.fillStyle = wt(Gm), this.ctx.fill(), this.ctx.restore())), OP(n) && n.value.length) {
                switch (v = this.createFontStyle(s), x = v[0], Q = v[1], u = this.fontMetrics.getMetrics(x, Q).baseline, this.ctx.font = x, this.ctx.fillStyle = wt(s.color), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = MP(n.styles.textAlign), K = xc(n), U = 0, n.styles.textAlign) {
                  case 1:
                    U += K.width / 2;
                    break;
                  case 2:
                    U += K.width;
                    break;
                }
                b = K.add(U, 0, 0, -K.height / 2 + 1), this.ctx.save(), this.path([
                  new TA(K.left, K.top),
                  new TA(K.left + K.width, K.top),
                  new TA(K.left + K.width, K.top + K.height),
                  new TA(K.left, K.top + K.height)
                ]), this.ctx.clip(), this.renderTextWithLetterSpacing(new _s(n.value, b), s.letterSpacing, u), this.ctx.restore(), this.ctx.textBaseline = "alphabetic", this.ctx.textAlign = "left";
              }
              if (!ht(
                n.styles.display,
                2048
                /* LIST_ITEM */
              )) return [3, 20];
              if (n.styles.listStyleImage === null) return [3, 19];
              if (E = n.styles.listStyleImage, E.type !== 0) return [3, 18];
              D = void 0, R = E.url, k.label = 15;
            case 15:
              return k.trys.push([15, 17, , 18]), [4, this.context.cache.match(R)];
            case 16:
              return D = k.sent(), this.ctx.drawImage(D, n.bounds.left - (D.width + 10), n.bounds.top), [3, 18];
            case 17:
              return k.sent(), this.context.logger.error("Error loading list-style-image " + R), [3, 18];
            case 18:
              return [3, 20];
            case 19:
              t.listValue && n.styles.listStyleType !== -1 && (x = this.createFontStyle(s)[0], this.ctx.font = x, this.ctx.fillStyle = wt(s.color), this.ctx.textBaseline = "middle", this.ctx.textAlign = "right", K = new qr(n.bounds.left, n.bounds.top + Xe(n.styles.paddingTop, n.bounds.width), n.bounds.width, bm(s.lineHeight, s.fontSize.number) / 2 + 1), this.renderTextWithLetterSpacing(new _s(t.listValue, K), s.letterSpacing, bm(s.lineHeight, s.fontSize.number) / 2 + 2), this.ctx.textBaseline = "bottom", this.ctx.textAlign = "left"), k.label = 20;
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
        var n, i, E, s, l, E, c, f, E, p, B, E, w, v, E, Q, u, E, U, b, E;
        return Ot(this, function(D) {
          switch (D.label) {
            case 0:
              if (ht(
                t.element.container.flags,
                16
                /* DEBUG_RENDER */
              ))
                debugger;
              return [4, this.renderNodeBackgroundAndBorders(t.element)];
            case 1:
              D.sent(), n = 0, i = t.negativeZIndex, D.label = 2;
            case 2:
              return n < i.length ? (E = i[n], [4, this.renderStack(E)]) : [3, 5];
            case 3:
              D.sent(), D.label = 4;
            case 4:
              return n++, [3, 2];
            case 5:
              return [4, this.renderNodeContent(t.element)];
            case 6:
              D.sent(), s = 0, l = t.nonInlineLevel, D.label = 7;
            case 7:
              return s < l.length ? (E = l[s], [4, this.renderNode(E)]) : [3, 10];
            case 8:
              D.sent(), D.label = 9;
            case 9:
              return s++, [3, 7];
            case 10:
              c = 0, f = t.nonPositionedFloats, D.label = 11;
            case 11:
              return c < f.length ? (E = f[c], [4, this.renderStack(E)]) : [3, 14];
            case 12:
              D.sent(), D.label = 13;
            case 13:
              return c++, [3, 11];
            case 14:
              p = 0, B = t.nonPositionedInlineLevel, D.label = 15;
            case 15:
              return p < B.length ? (E = B[p], [4, this.renderStack(E)]) : [3, 18];
            case 16:
              D.sent(), D.label = 17;
            case 17:
              return p++, [3, 15];
            case 18:
              w = 0, v = t.inlineLevel, D.label = 19;
            case 19:
              return w < v.length ? (E = v[w], [4, this.renderNode(E)]) : [3, 22];
            case 20:
              D.sent(), D.label = 21;
            case 21:
              return w++, [3, 19];
            case 22:
              Q = 0, u = t.zeroOrAutoZIndexOrTransformedOrOpacity, D.label = 23;
            case 23:
              return Q < u.length ? (E = u[Q], [4, this.renderStack(E)]) : [3, 26];
            case 24:
              D.sent(), D.label = 25;
            case 25:
              return Q++, [3, 23];
            case 26:
              U = 0, b = t.positiveZIndex, D.label = 27;
            case 27:
              return U < b.length ? (E = b[U], [4, this.renderStack(E)]) : [3, 30];
            case 28:
              D.sent(), D.label = 29;
            case 29:
              return U++, [3, 27];
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
        var l = Qn(i) ? i.start : i;
        s === 0 ? n.ctx.moveTo(l.x, l.y) : n.ctx.lineTo(l.x, l.y), Qn(i) && n.ctx.bezierCurveTo(i.startControl.x, i.startControl.y, i.endControl.x, i.endControl.y, i.end.x, i.end.y);
      });
    }, e.prototype.renderRepeat = function(t, n, i, s) {
      this.path(t), this.ctx.fillStyle = n, this.ctx.translate(i, s), this.ctx.fill(), this.ctx.translate(-i, -s);
    }, e.prototype.resizeImage = function(t, n, i) {
      var s;
      if (t.width === n && t.height === i)
        return t;
      var l = (s = this.canvas.ownerDocument) !== null && s !== void 0 ? s : document, c = l.createElement("canvas");
      c.width = Math.max(1, n), c.height = Math.max(1, i);
      var f = c.getContext("2d");
      return f.drawImage(t, 0, 0, t.width, t.height, 0, 0, n, i), c;
    }, e.prototype.renderBackgroundImage = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i, s, l, c, f;
        return Ot(this, function(p) {
          switch (p.label) {
            case 0:
              n = t.styles.backgroundImage.length - 1, i = function(B) {
                var w, v, Q, wA, tA, fA, xA, X, dA, u, wA, tA, fA, xA, X, U, b, E, D, R, x, K, k, Y, dA, cA, wA, EA, NA, xA, X, CA, tA, fA, _A, IA, aA, T, eA, J, L, $;
                return Ot(this, function(rA) {
                  switch (rA.label) {
                    case 0:
                      if (B.type !== 0) return [3, 5];
                      w = void 0, v = B.url, rA.label = 1;
                    case 1:
                      return rA.trys.push([1, 3, , 4]), [4, s.context.cache.match(v)];
                    case 2:
                      return w = rA.sent(), [3, 4];
                    case 3:
                      return rA.sent(), s.context.logger.error("Error loading background-image " + v), [3, 4];
                    case 4:
                      return w && (Q = kd(t, n, [
                        w.width,
                        w.height,
                        w.width / w.height
                      ]), wA = Q[0], tA = Q[1], fA = Q[2], xA = Q[3], X = Q[4], dA = s.ctx.createPattern(s.resizeImage(w, xA, X), "repeat"), s.renderRepeat(wA, dA, tA, fA)), [3, 6];
                    case 5:
                      yK(B) ? (u = kd(t, n, [null, null, null]), wA = u[0], tA = u[1], fA = u[2], xA = u[3], X = u[4], U = gK(B.angle, xA, X), b = U[0], E = U[1], D = U[2], R = U[3], x = U[4], K = document.createElement("canvas"), K.width = xA, K.height = X, k = K.getContext("2d"), Y = k.createLinearGradient(E, R, D, x), Um(B.stops, b).forEach(function(FA) {
                        return Y.addColorStop(FA.stop, wt(FA.color));
                      }), k.fillStyle = Y, k.fillRect(0, 0, xA, X), xA > 0 && X > 0 && (dA = s.ctx.createPattern(K, "repeat"), s.renderRepeat(wA, dA, tA, fA))) : CK(B) && (cA = kd(t, n, [
                        null,
                        null,
                        null
                      ]), wA = cA[0], EA = cA[1], NA = cA[2], xA = cA[3], X = cA[4], CA = B.position.length === 0 ? [Yp] : B.position, tA = Xe(CA[0], xA), fA = Xe(CA[CA.length - 1], X), _A = BK(B, tA, fA, xA, X), IA = _A[0], aA = _A[1], IA > 0 && aA > 0 && (T = s.ctx.createRadialGradient(EA + tA, NA + fA, 0, EA + tA, NA + fA, IA), Um(B.stops, IA * 2).forEach(function(FA) {
                        return T.addColorStop(FA.stop, wt(FA.color));
                      }), s.path(wA), s.ctx.fillStyle = T, IA !== aA ? (eA = t.bounds.left + 0.5 * t.bounds.width, J = t.bounds.top + 0.5 * t.bounds.height, L = aA / IA, $ = 1 / L, s.ctx.save(), s.ctx.translate(eA, J), s.ctx.transform(1, 0, 0, L, 0, 0), s.ctx.translate(-eA, -J), s.ctx.fillRect(EA, $ * (NA - J) + J, xA, X * $), s.ctx.restore()) : s.ctx.fill())), rA.label = 6;
                    case 6:
                      return n--, [
                        2
                        /*return*/
                      ];
                  }
                });
              }, s = this, l = 0, c = t.styles.backgroundImage.slice(0).reverse(), p.label = 1;
            case 1:
              return l < c.length ? (f = c[l], [5, i(f)]) : [3, 4];
            case 2:
              p.sent(), p.label = 3;
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
        return Ot(this, function(s) {
          return this.path(tv(i, n)), this.ctx.fillStyle = wt(t), this.ctx.fill(), [
            2
            /*return*/
          ];
        });
      });
    }, e.prototype.renderDoubleBorder = function(t, n, i, s) {
      return Vt(this, void 0, void 0, function() {
        var l, c;
        return Ot(this, function(f) {
          switch (f.label) {
            case 0:
              return n < 3 ? [4, this.renderSolidBorder(t, i, s)] : [3, 2];
            case 1:
              return f.sent(), [
                2
                /*return*/
              ];
            case 2:
              return l = UP(s, i), this.path(l), this.ctx.fillStyle = wt(t), this.ctx.fill(), c = EP(s, i), this.path(c), this.ctx.fill(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderNodeBackgroundAndBorders = function(t) {
      return Vt(this, void 0, void 0, function() {
        var n, i, s, l, c, f, p, B, w = this;
        return Ot(this, function(v) {
          switch (v.label) {
            case 0:
              return this.applyEffects(t.getEffects(
                2
                /* BACKGROUND_BORDERS */
              )), n = t.container.styles, i = !Ei(n.backgroundColor) || n.backgroundImage.length, s = [
                { style: n.borderTopStyle, color: n.borderTopColor, width: n.borderTopWidth },
                { style: n.borderRightStyle, color: n.borderRightColor, width: n.borderRightWidth },
                { style: n.borderBottomStyle, color: n.borderBottomColor, width: n.borderBottomWidth },
                { style: n.borderLeftStyle, color: n.borderLeftColor, width: n.borderLeftWidth }
              ], l = NP(Ja(n.backgroundClip, 0), t.curves), i || n.boxShadow.length ? (this.ctx.save(), this.path(l), this.ctx.clip(), Ei(n.backgroundColor) || (this.ctx.fillStyle = wt(n.backgroundColor), this.ctx.fill()), [4, this.renderBackgroundImage(t.container)]) : [3, 2];
            case 1:
              v.sent(), this.ctx.restore(), n.boxShadow.slice(0).reverse().forEach(function(Q) {
                w.ctx.save();
                var u = bc(t.curves), U = Q.inset ? 0 : TP, b = QP(u, -U + (Q.inset ? 1 : -1) * Q.spread.number, (Q.inset ? 1 : -1) * Q.spread.number, Q.spread.number * (Q.inset ? -2 : 2), Q.spread.number * (Q.inset ? -2 : 2));
                Q.inset ? (w.path(u), w.ctx.clip(), w.mask(b)) : (w.mask(u), w.ctx.clip(), w.path(b)), w.ctx.shadowOffsetX = Q.offsetX.number + U, w.ctx.shadowOffsetY = Q.offsetY.number, w.ctx.shadowColor = wt(Q.color), w.ctx.shadowBlur = Q.blur.number, w.ctx.fillStyle = Q.inset ? wt(Q.color) : "rgba(0,0,0,1)", w.ctx.fill(), w.ctx.restore();
              }), v.label = 2;
            case 2:
              c = 0, f = 0, p = s, v.label = 3;
            case 3:
              return f < p.length ? (B = p[f], B.style !== 0 && !Ei(B.color) && B.width > 0 ? B.style !== 2 ? [3, 5] : [4, this.renderDashedDottedBorder(
                B.color,
                B.width,
                c,
                t.curves,
                2
                /* DASHED */
              )] : [3, 11]) : [3, 13];
            case 4:
              return v.sent(), [3, 11];
            case 5:
              return B.style !== 3 ? [3, 7] : [4, this.renderDashedDottedBorder(
                B.color,
                B.width,
                c,
                t.curves,
                3
                /* DOTTED */
              )];
            case 6:
              return v.sent(), [3, 11];
            case 7:
              return B.style !== 4 ? [3, 9] : [4, this.renderDoubleBorder(B.color, B.width, c, t.curves)];
            case 8:
              return v.sent(), [3, 11];
            case 9:
              return [4, this.renderSolidBorder(B.color, c, t.curves)];
            case 10:
              v.sent(), v.label = 11;
            case 11:
              c++, v.label = 12;
            case 12:
              return f++, [3, 3];
            case 13:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.renderDashedDottedBorder = function(t, n, i, s, l) {
      return Vt(this, void 0, void 0, function() {
        var c, f, p, B, w, v, Q, u, U, b, E, D, R, x, K, k, K, k;
        return Ot(this, function(Y) {
          return this.ctx.save(), c = bP(s, i), f = tv(s, i), l === 2 && (this.path(f), this.ctx.clip()), Qn(f[0]) ? (p = f[0].start.x, B = f[0].start.y) : (p = f[0].x, B = f[0].y), Qn(f[1]) ? (w = f[1].end.x, v = f[1].end.y) : (w = f[1].x, v = f[1].y), i === 0 || i === 2 ? Q = Math.abs(p - w) : Q = Math.abs(B - v), this.ctx.beginPath(), l === 3 ? this.formatPath(c) : this.formatPath(f.slice(0, 2)), u = n < 3 ? n * 3 : n * 2, U = n < 3 ? n * 2 : n, l === 3 && (u = n, U = n), b = !0, Q <= u * 2 ? b = !1 : Q <= u * 2 + U ? (E = Q / (2 * u + U), u *= E, U *= E) : (D = Math.floor((Q + U) / (u + U)), R = (Q - D * u) / (D - 1), x = (Q - (D + 1) * u) / D, U = x <= 0 || Math.abs(U - R) < Math.abs(U - x) ? R : x), b && (l === 3 ? this.ctx.setLineDash([0, u + U]) : this.ctx.setLineDash([u, U])), l === 3 ? (this.ctx.lineCap = "round", this.ctx.lineWidth = n) : this.ctx.lineWidth = n * 2 + 1.1, this.ctx.strokeStyle = wt(t), this.ctx.stroke(), this.ctx.setLineDash([]), l === 2 && (Qn(f[0]) && (K = f[3], k = f[0], this.ctx.beginPath(), this.formatPath([new TA(K.end.x, K.end.y), new TA(k.start.x, k.start.y)]), this.ctx.stroke()), Qn(f[1]) && (K = f[1], k = f[2], this.ctx.beginPath(), this.formatPath([new TA(K.end.x, K.end.y), new TA(k.start.x, k.start.y)]), this.ctx.stroke())), this.ctx.restore(), [
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
              return this.options.backgroundColor && (this.ctx.fillStyle = wt(this.options.backgroundColor), this.ctx.fillRect(this.options.x, this.options.y, this.options.width, this.options.height)), n = FP(t), [4, this.renderStack(n)];
            case 1:
              return i.sent(), this.applyEffects([]), [2, this.canvas];
          }
        });
      });
    }, e;
  }(tC)
), OP = function(A) {
  return A instanceof Ky || A instanceof My ? !0 : A instanceof tg && A.type !== Fc && A.type !== Qc;
}, NP = function(A, e) {
  switch (A) {
    case 0:
      return bc(e);
    case 2:
      return wP(e);
    case 1:
    default:
      return _c(e);
  }
}, MP = function(A) {
  switch (A) {
    case 1:
      return "center";
    case 2:
      return "right";
    case 0:
    default:
      return "left";
  }
}, KP = ["-apple-system", "system-ui"], RP = function(A) {
  return /iPhone OS 15_(0|1)/.test(window.navigator.userAgent) ? A.filter(function(e) {
    return KP.indexOf(e) === -1;
  }) : A;
}, $P = (
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
        return Ot(this, function(s) {
          switch (s.label) {
            case 0:
              return n = Lh(this.options.width * this.options.scale, this.options.height * this.options.scale, this.options.scale, this.options.scale, t), [4, PP(n)];
            case 1:
              return i = s.sent(), this.options.backgroundColor && (this.ctx.fillStyle = wt(this.options.backgroundColor), this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale)), this.ctx.drawImage(i, -this.options.x * this.options.scale, -this.options.y * this.options.scale), [2, this.canvas];
          }
        });
      });
    }, e;
  }(tC)
), PP = function(A) {
  return new Promise(function(e, t) {
    var n = new Image();
    n.onload = function() {
      e(n);
    }, n.onerror = t, n.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(A));
  });
}, kP = (
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
), GP = (
  /** @class */
  function() {
    function A(e, t) {
      var n;
      this.windowBounds = t, this.instanceName = "#" + A.instanceCount++, this.logger = new kP({ id: this.instanceName, enabled: e.logging }), this.cache = (n = e.cache) !== null && n !== void 0 ? n : new lP(this, e);
    }
    return A.instanceCount = 1, A;
  }()
), VP = function(A, e) {
  return e === void 0 && (e = {}), WP(A, e);
};
typeof window < "u" && Jy.setContext(window);
var WP = function(A, e) {
  return Vt(void 0, void 0, void 0, function() {
    var t, n, i, s, l, c, f, p, B, w, v, Q, u, U, b, E, D, R, x, K, Y, k, Y, dA, cA, wA, EA, NA, xA, X, CA, tA, fA, _A, IA, aA, T, eA, J, L;
    return Ot(this, function($) {
      switch ($.label) {
        case 0:
          if (!A || typeof A != "object")
            return [2, Promise.reject("Invalid element provided as first argument")];
          if (t = A.ownerDocument, !t)
            throw new Error("Element is not attached to a Document");
          if (n = t.defaultView, !n)
            throw new Error("Document is not attached to a Window");
          return i = {
            allowTaint: (dA = e.allowTaint) !== null && dA !== void 0 ? dA : !1,
            imageTimeout: (cA = e.imageTimeout) !== null && cA !== void 0 ? cA : 15e3,
            proxy: e.proxy,
            useCORS: (wA = e.useCORS) !== null && wA !== void 0 ? wA : !1
          }, s = wh({ logging: (EA = e.logging) !== null && EA !== void 0 ? EA : !0, cache: e.cache }, i), l = {
            windowWidth: (NA = e.windowWidth) !== null && NA !== void 0 ? NA : n.innerWidth,
            windowHeight: (xA = e.windowHeight) !== null && xA !== void 0 ? xA : n.innerHeight,
            scrollX: (X = e.scrollX) !== null && X !== void 0 ? X : n.pageXOffset,
            scrollY: (CA = e.scrollY) !== null && CA !== void 0 ? CA : n.pageYOffset
          }, c = new qr(l.scrollX, l.scrollY, l.windowWidth, l.windowHeight), f = new GP(s, c), p = (tA = e.foreignObjectRendering) !== null && tA !== void 0 ? tA : !1, B = {
            allowTaint: (fA = e.allowTaint) !== null && fA !== void 0 ? fA : !1,
            onclone: e.onclone,
            ignoreElements: e.ignoreElements,
            inlineImages: p,
            copyStyles: p
          }, f.logger.debug("Starting document clone with size " + c.width + "x" + c.height + " scrolled to " + -c.left + "," + -c.top), w = new Zm(f, A, B), v = w.clonedReferenceElement, v ? [4, w.toIFrame(t, c)] : [2, Promise.reject("Unable to find element in cloned iframe")];
        case 1:
          return Q = $.sent(), u = ng(v) || X$(v) ? QN(v.ownerDocument) : $c(f, v), U = u.width, b = u.height, E = u.left, D = u.top, R = XP(f, v, e.backgroundColor), x = {
            canvas: e.canvas,
            backgroundColor: R,
            scale: (IA = (_A = e.scale) !== null && _A !== void 0 ? _A : n.devicePixelRatio) !== null && IA !== void 0 ? IA : 1,
            x: ((aA = e.x) !== null && aA !== void 0 ? aA : 0) + E,
            y: ((T = e.y) !== null && T !== void 0 ? T : 0) + D,
            width: (eA = e.width) !== null && eA !== void 0 ? eA : Math.ceil(U),
            height: (J = e.height) !== null && J !== void 0 ? J : Math.ceil(b)
          }, p ? (f.logger.debug("Document cloned, using foreign object rendering"), Y = new $P(f, x), [4, Y.render(v)]) : [3, 3];
        case 2:
          return K = $.sent(), [3, 5];
        case 3:
          return f.logger.debug("Document cloned, element located at " + E + "," + D + " with size " + U + "x" + b + " using computed rendering"), f.logger.debug("Starting DOM parsing"), k = Py(f, v), R === k.styles.backgroundColor && (k.styles.backgroundColor = Gr.TRANSPARENT), f.logger.debug("Starting renderer for element at " + x.x + "," + x.y + " with size " + x.width + "x" + x.height), Y = new DP(f, x), [4, Y.render(k)];
        case 4:
          K = $.sent(), $.label = 5;
        case 5:
          return (!((L = e.removeContainer) !== null && L !== void 0) || L) && (Zm.destroy(Q) || f.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")), f.logger.debug("Finished rendering"), [2, K];
      }
    });
  });
}, XP = function(A, e, t) {
  var n = e.ownerDocument, i = n.documentElement ? Es(A, getComputedStyle(n.documentElement).backgroundColor) : Gr.TRANSPARENT, s = n.body ? Es(A, getComputedStyle(n.body).backgroundColor) : Gr.TRANSPARENT, l = typeof t == "string" ? Es(A, t) : t === null ? Gr.TRANSPARENT : 4294967295;
  return e === n.documentElement ? Ei(i) ? Ei(s) ? l : s : i : l;
};
let mi = {};
mi.vectorEffectSupport = !0;
mi.Listener = function(A) {
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
  }, t = Le.merge({}, e, A), n, i, s, l, c, f, p, B, w, v, Q, u, U, b, E, D, R = !1, x = {}, K = function() {
    if (R) {
      var sA = oe(n).height();
      t.height = sA - 80, t.width = "100%";
    }
  }, k = function() {
    R ? (t.height = x.height, t.width = x.width, WA(n).classed("fullscreen", !1), R = !1) : (x.height = t.height, x.width = t.width, WA(n).classed("fullscreen", !0), R = !0), K(), CA(), cA(), JA();
  }, Y = function() {
    var sA = { width: t.width, height: t.height };
    if (sA.width.toString().indexOf("%") >= 0 || sA.height.toString().indexOf("%") >= 0) {
      var vA = WA(n).select("svg").node().getBoundingClientRect();
      sA.width.toString().indexOf("%") >= 0 && (sA.width = vA.width), sA.height.toString().indexOf("%") >= 0 && (sA.height = vA.height);
    }
    return sA;
  }, dA = function() {
    const sA = Xa(i.node()), vA = sA.k, bA = [sA.x, sA.y];
    return bA[0] !== 0 || bA[1] !== 0 || vA !== 1;
  }, cA = function() {
    const sA = Xa(i.node()), vA = sA.k, bA = [sA.x, sA.y];
    vA === 1 && Le.isEqual(bA, [0, 0]) || (f.translate([0, 0]), f.scale(1), s.attr(
      "transform",
      "translate(" + f.translate() + ")scale(" + f.scale() + ")"
    ), u.setFitButtonEnabled(dA()), UA(), JA());
  }, wA = function() {
    s.select(".drawing_outline").attr("width", w.drawing.width).attr("height", w.drawing.height);
  }, EA = function() {
    var sA = w.drawing, vA = w.margin;
    s.select(".drawing_margin").attr("x", vA.left).attr("y", vA.top).attr("width", sA.width - vA.left - vA.right).attr("height", sA.height - vA.top - vA.bottom);
  }, NA = function() {
    s.attr("transform", "translate(0,0)scale(1)"), s.attr(
      "transform",
      "translate(" + f.translate() + ")scale(" + f.scale() + ")"
    );
  }, xA = async function() {
    const sA = document.querySelector(".mapview-wrapper");
    VP(sA).then((vA) => {
      const bA = vA.toDataURL("image/png"), te = document.createElement("a");
      te.href = bA, te.download = "capture.png", te.click();
    }).catch((vA) => {
      console.error("Error capturing the element:", vA);
    });
  };
  p = function() {
    var sA = Xa(this), vA = [sA.x, sA.y], bA = sA.k;
    if (w) {
      var te = i.node().getBoundingClientRect(), me = -w.drawing.width * bA + te.width * (1 - t.extraPanArea) + w.drawing.margin.right * bA, Ue = te.width * t.extraPanArea - w.drawing.margin.left * bA;
      vA[0] = Le.clamp(vA[0], me, Ue);
      var Ze = -w.drawing.height * bA + te.height * (1 - t.extraPanArea) + w.drawing.margin.bottom * bA, Te = te.height * t.extraPanArea - w.drawing.margin.top * bA;
      vA[1] = Le.clamp(vA[1], Ze, Te);
    }
    (sA.x !== vA[0] || sA.y !== vA[1]) && f.translateBy(
      i,
      vA[0] - sA.x,
      vA[1] - sA.y
    ), bA !== B && (UA(), JA(), B = bA), u.setFitButtonEnabled(dA()), s.attr(
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
      oe(bA.target).closest(n).length < 1 && R == !0 && k();
    });
  }, fA = function(sA) {
    sA == "auto" ? (U = !0, b = !0, w.chromosomes.forEach(function(vA) {
      vA.annotations.genes.forEach(function(bA) {
        bA.selected == !0 && (bA.visible = !0);
      });
    })) : sA == "show" ? (U = !1, b = !0) : sA == "hide" && (U = !1, b = !1), w.chromosomes.forEach(function(vA) {
      vA.annotations.genes.forEach(function(bA) {
        sA === "auto" ? delete bA.showLabel : bA.showLabel = sA;
      });
    }), UA(), JA();
  }, _A = function() {
    var sA = w.chromosomes.some(function(vA) {
      return vA.annotations.genes.some(function(bA) {
        return bA.selected;
      });
    });
    $A.onAnonationLabelSelectFunction && $A.onAnonationLabelSelectFunction($A.getSelectedGenes()), UA(), JA(), WA(".network-btn").classed("disabled", !sA);
  }, IA = function(sA) {
    Q ? (w = v, Q = !1) : (w = { chromosomes: [sA] }, Q = !0), $A.onAnonationLabelSelectFunction($A.getSelectedGenes()), cA(), UA(), JA();
  }, aA = function() {
    Le.flatMap(
      w.chromosomes.map(function(sA) {
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
  }, T = function() {
    var sA = u.getTagButtonState(), vA;
    sA === "auto" ? vA = "show" : sA === "show" ? vA = "hide" : vA = "auto", u.setTabButtonState(vA), fA(vA), JA();
  }, eA = function() {
    w.chromosomes.forEach(function(sA) {
      sA.annotations.allGenes.forEach(function(vA) {
        vA.selected = !1, vA.visible = !1, vA.hidden = !1;
      });
    }), UA(), JA();
  }, J = function(sA) {
    t.layout.numberPerRow = sA, rA(), UA(), JA();
  }, L = function(sA) {
    sA == "all" ? (E = !0, D = !0) : sA == "selected" ? (E = !1, D = "true") : (E = !1, D = !1), FA(), UA(), JA();
  }, $ = function() {
    const vA = Xa(i.node()).k;
    var bA = uS(t.layout).width(Y().width).height(Y().height).scale(vA);
    w = bA.decorateGenome(w);
  }, rA = function() {
    w.chromosomes.forEach(function(sA) {
      sA.layout = sA.layout || {}, sA.layout.annotationDisplayClusters = null, sA.layout.geneBandDisplayClusters = null;
    });
  }, FA = function() {
    w.chromosomes.forEach(function(sA) {
      sA.layout = sA.layout || {}, sA.layout.qtlDisplayClusters = null;
    });
  }, UA = function() {
    const vA = Xa(i.node()).k;
    $();
    var bA = gN({
      longestChromosome: w.cellLayout.longestChromosome,
      layout: w.cellLayout.geneAnnotationPosition,
      annotationMarkerSize: w.cellLayout.annotations.marker.size,
      annotationLabelSize: w.cellLayout.annotations.label.size,
      scale: vA,
      autoLabels: U,
      manualLabels: b,
      nGenesToDisplay: t.nGenesToDisplay,
      displayedFontSize: t.annotationLabelSize
    }), te = BN({
      longestChromosome: w.cellLayout.longestChromosome,
      layout: w.cellLayout.geneAnnotationPosition,
      nClusters: 50,
      scale: vA,
      nGenesToDisplay: t.nGenesToDisplay
    }), me = CN({
      longestChromosome: w.cellLayout.longestChromosome,
      layout: w.cellLayout.qtlAnnotationPosition,
      scale: vA,
      showAllQTLs: E,
      showSelectedQTLs: D,
      showAutoQTLLabels: E,
      showSelectedQTLLabels: D,
      annotationLabelSize: w.cellLayout.annotations.label.size
    });
    w.chromosomes.forEach(function(Ue) {
      Ue.layout = Ue.layout || {}, Ue.layout.annotationDisplayClusters || bA.computeChromosomeClusters(Ue), bA.layoutChromosome(Ue), Ue.layout.geneBandDisplayClusters || te.computeChromosomeClusters(Ue), te.layoutChromosome(Ue), Ue.layout.qtlDisplayClusters || me.computeChromosomeClusters(Ue), me.layoutChromosome(Ue);
    }), bA.computeNormalisedGeneScores(w.chromosomes);
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
    l = sA.append("div").append("span").attr("class", "logger").attr("id", "logbar"), c = sA.append("div").attr("class", "key").attr("id", "keybar"), mi.vectorEffectSupport = "vectorEffect" in bA.node().style, tA(), bA.on("contextmenu", X), bA.append("g").classed("zoom_window", !0).append("rect").classed("drawing_outline", !0), t.contentBorder && sA.select(".zoom_window").append("rect").classed("drawing_margin", !0), B = 1, f = QO().scaleExtent([0.5, 60]), f.on("start", function() {
      bA.classed("dragging", !0);
    }).on("zoom", p).on("end", function() {
      bA.classed("dragging", !1);
    }), sA.select("svg").call(f);
    var te = sA.append("div").attr("id", "clusterPopover").attr("class", "popover");
    return te.append("div").attr("class", "arrow"), te.append("h3").attr("class", "popover-title").text("Cluster"), te.append("div").attr("class", "popover-content"), bA;
  }, JA = function() {
    WA(n).select("svg").node() ? (i = WA(n).select("svg"), i.attr("width", t.width).attr("height", t.height)) : i = ne(WA(n)), $();
    var sA = w.chromosomes.every(function(bA) {
      return bA.layout;
    });
    sA || UA(), i.datum(w), s = i.select(".zoom_window"), wA(), t.contentBorder && EA();
    var vA = cN().onAnnotationSelectFunction(_A).onLabelSelectFunction(IA).maxAnnotationLayers(t.layout.maxAnnotationLayers).maxSnpPValue(t.maxSnpPValue).svg(i);
    s.call(vA);
  };
  function $A(sA) {
    sA.each(function(vA) {
      var bA = this;
      n = bA, v = vA, w = v, Q = !1, u || (u = wN().onTagBtnClick(T).onFitBtnClick(cA).onLabelBtnClick(fA).onQtlBtnClick(L).onNetworkBtnClick(aA).onResetBtnClick(eA).onSetNumberPerRowClick(J).initialMaxGenes(t.nGenesToDisplay).initialNPerRow(t.layout.numberPerRow).onExportBtnClick(xA).onExportAllBtnClick(NA).onExpandBtnClick(k).maxSnpPValueProperty($A.maxSnpPValue).nGenesToDisplayProperty($A.nGenesToDisplay).annotationLabelSizeProperty($A.annotationLabelSize)), WA(n).call(u), u.setNetworkButtonEnabled(!1), u.setFitButtonEnabled(!1), u.setTabButtonState("auto"), JA();
    });
  }
  return $A.resetZoom = cA, $A.width = function(sA) {
    return arguments.length ? (t.width = sA, $A) : t.width;
  }, $A.height = function(sA) {
    return arguments.length ? (t.height = sA, $A) : t.height;
  }, $A.layout = function(sA) {
    return arguments.length ? (t.layout = Le.merge(t.layout, sA), $A) : t.layout;
  }, $A.draw = async function(sA, vA, bA, te = !1) {
    var me = oS();
    if (bA)
      me.readData(vA, bA, te).then(function(Ue) {
        $A._draw(sA, Ue, te);
      });
    else {
      const Ue = await me.readData(vA, bA, te);
      $A._draw(sA, Ue, te);
    }
  }, $A._draw = function(sA, vA) {
    var bA = WA(sA).selectAll("div").data(["genemap-target"]);
    bA.enter().append("div").attr("id", function(te) {
      return te;
    }), n = WA(sA).select("#genemap-target").node(), WA(n).datum(vA).call($A), $A.nGenesToDisplay(t.initialMaxGenes), cA(), zA(c, w);
  }, $A.changeQtlColor = function(sA, vA, bA) {
    w.chromosomes.forEach(function(te) {
      te.layout.qtlNodes.forEach(function(me) {
        me.id === sA && (me.color = vA, me.label = bA);
      });
    }), UA(), JA();
  }, $A.changeColor = function(sA) {
    WA("#map").style("background-color", sA), UA(), JA();
  }, $A.redraw = function(sA) {
    n = WA(sA).select("#genemap-target")[0][0], K(), WA(n).call($A), CA();
  }, $A.setGeneLabels = function(sA) {
    n && fA(sA);
  }, $A.maxSnpPValue = mi.Listener(t.maxSnpPValue).addListener(function(sA) {
    var vA = Number(sA);
    isNaN(vA) && $A.maxSnpPValue(t.maxSnpPValue), t.maxSnpPValue = Number(sA), UA(), JA();
  }), $A.nGenesToDisplay = mi.Listener(t.nGenesToDisplay).addListener(
    function(sA) {
      var vA = t.nGenesToDisplay;
      t.nGenesToDisplay = sA, sA != vA && (rA(), UA(), JA());
    }
  ), $A.annotationLabelSize = mi.Listener(
    t.annotationLabelSize
  ).addListener(function(sA) {
    t.annotationLabelSize = sA, rA(), UA(), JA();
  }), $A.setQtlLabels = function(sA) {
    if (n) {
      var vA = WA(n).datum();
      vA.chromosomes.forEach(function(bA) {
        bA.annotations.qtls.forEach(function(te) {
          sA === "auto" ? delete te.showLabel : te.showLabel = sA;
        });
      });
    }
  }, $A.onAnonationLabelSelectFunction = function() {
  }, $A.loggingOn = function() {
    l.style("display", "initial");
  }, $A.loggingOff = function() {
    l.style("display", "none");
  }, $A.getSelectedGenes = function() {
    var sA = [];
    return w.chromosomes.forEach(function(vA) {
      vA.annotations.genes.forEach(function(bA) {
        bA.selected && sA.push(bA);
      });
    }), sA;
  }, $A.getGenome = function() {
    return w;
  }, $A;
};
const ro = mi.GeneMap().width("100%").height("100%");
function qP() {
  const A = document.getElementById("show-gene-labels"), e = A.options[A.selectedIndex].value;
  ro.setGeneLabels(e);
  const t = document.getElementById("show-qtl-labels"), n = t.options[t.selectedIndex].value;
  ro.setQtlLabels(n), ro.redraw("#map");
}
function zP() {
  ro.changeQtlColor("C6", "#000");
}
async function JP(A) {
  A && ro.resetZoom();
  const e = await import("./arabidopsis-DWsJl-zt.js"), t = await import("./arabidopsis-BWR4fnku.js");
  ro.draw("#map", e.default, t.default, !0);
}
export {
  zP as changeQtlColor,
  ro as chart,
  JP as redraw,
  qP as updateLabel
};
